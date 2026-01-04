(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react/jsx-runtime'), require('@mantine/hooks'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react/jsx-runtime', '@mantine/hooks', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineCore = {}, global.React, global.ReactJSXRuntime, global.MantineHooks, global.ReactDOM));
})(this, (function (exports, React10, jsxRuntime, hooks, ReactDOM) { 'use strict';
  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }
  var React10__namespace = _interopNamespaceDefault(React10);
  var ReactDOM__namespace = _interopNamespaceDefault(ReactDOM);
  (()=>{var a=typeof Reflect=="object"?Reflect:null,g=a&&typeof a.apply=="function"?a.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)},p;a&&typeof a.ownKeys=="function"?p=a.ownKeys:Object.getOwnPropertySymbols?p=function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:p=function(e){return Object.getOwnPropertyNames(e)};function D(n){console&&console.warn&&console.warn(n);}var w=Number.isNaN||function(e){return e!==e};function s(){L.call(this);}s.EventEmitter=s;s.prototype._events=void 0;s.prototype._eventsCount=0;s.prototype._maxListeners=void 0;var y=10;function d(n){if(typeof n!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n)}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return y},set:function(n){if(typeof n!="number"||n<0||w(n))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+n+".");y=n;}});function L(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0;}s.init=L;s.prototype.setMaxListeners=function(e){if(typeof e!="number"||e<0||w(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this};function b(n){return n._maxListeners===void 0?s.defaultMaxListeners:n._maxListeners}s.prototype.getMaxListeners=function(){return b(this)};s.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i=e==="error",u=this._events;if(u!==void 0)i=i&&u.error===void 0;else if(!i)return !1;if(i){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var c=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw c.context=o,c}var l=u[e];if(l===void 0)return !1;if(typeof l=="function")g(l,this,t);else for(var m=l.length,M=x(l,m),r=0;r<m;++r)g(M[r],this,t);return !0};function _(n,e,t,r){var i,u,o;if(d(t),u=n._events,u===void 0?(u=n._events=Object.create(null),n._eventsCount=0):(u.newListener!==void 0&&(n.emit("newListener",e,t.listener?t.listener:t),u=n._events),o=u[e]),o===void 0)o=u[e]=t,++n._eventsCount;else if(typeof o=="function"?o=u[e]=r?[t,o]:[o,t]:r?o.unshift(t):o.push(t),i=b(n),i>0&&o.length>i&&!o.warned){o.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=n,c.type=e,c.count=o.length,D(c);}return n}s.prototype.addListener=function(e,t){return _(this,e,t,!1)};s.prototype.on=s.prototype.addListener;s.prototype.prependListener=function(e,t){return _(this,e,t,!0)};function R(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function E(n,e,t){var r={fired:!1,wrapFn:void 0,target:n,type:e,listener:t},i=R.bind(r);return i.listener=t,r.wrapFn=i,i}s.prototype.once=function(e,t){return d(t),this.on(e,E(this,e,t)),this};s.prototype.prependOnceListener=function(e,t){return d(t),this.prependListener(e,E(this,e,t)),this};s.prototype.removeListener=function(e,t){var r,i,u,o,c;if(d(t),i=this._events,i===void 0)return this;if(r=i[e],r===void 0)return this;if(r===t||r.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete i[e],i.removeListener&&this.emit("removeListener",e,r.listener||t));else if(typeof r!="function"){for(u=-1,o=r.length-1;o>=0;o--)if(r[o]===t||r[o].listener===t){c=r[o].listener,u=o;break}if(u<0)return this;u===0?r.shift():N(r,u),r.length===1&&(i[e]=r[0]),i.removeListener!==void 0&&this.emit("removeListener",e,c||t);}return this};s.prototype.off=s.prototype.removeListener;s.prototype.removeAllListeners=function(e){var t,r,i;if(r=this._events,r===void 0)return this;if(r.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):r[e]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete r[e]),this;if(arguments.length===0){var u=Object.keys(r),o;for(i=0;i<u.length;++i)o=u[i],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=r[e],typeof t=="function")this.removeListener(e,t);else if(t!==void 0)for(i=t.length-1;i>=0;i--)this.removeListener(e,t[i]);return this};function O(n,e,t){var r=n._events;if(r===void 0)return [];var i=r[e];return i===void 0?[]:typeof i=="function"?t?[i.listener||i]:[i]:t?P(i):x(i,i.length)}s.prototype.listeners=function(e){return O(this,e,!0)};s.prototype.rawListeners=function(e){return O(this,e,!1)};function C(n,e){return typeof n.listenerCount=="function"?n.listenerCount(e):s.prototype.listenerCount.call(n,e)}s.listenerCount=C;s.prototype.listenerCount=function(n){var e=this._events;if(e!==void 0){var t=e[n];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0};s.prototype.eventNames=function(){return this._eventsCount>0?p(this._events):[]};function x(n,e){for(var t=new Array(e),r=0;r<e;++r)t[r]=n[r];return t}function N(n,e){for(;e+1<n.length;e++)n[e]=n[e+1];n.pop();}function P(n){for(var e=new Array(n.length),t=0;t<e.length;++t)e[t]=n[t].listener||n[t];return e}function v(n){let e=performance.now(),t=Math.floor(e/1e3),r=Math.floor(e*1e6-t*1e9);if(!n)return [t,r];let[i,u]=n;return [t-i,r-u]}v.bigint=function(){let[n,e]=v();return BigInt(n)*1000000000n+BigInt(e)};var h=class extends s{title="browser";browser=!0;env={};argv=[];pid=0;arch="unknown";platform="browser";version="";versions={};emitWarning=()=>{throw new Error("process.emitWarning is not supported")};binding=()=>{throw new Error("process.binding is not supported")};cwd=()=>{throw new Error("process.cwd is not supported")};chdir=e=>{throw new Error("process.chdir is not supported")};umask=()=>18;nextTick=(e,...t)=>queueMicrotask(()=>e(...t));hrtime=v;constructor(){super();}},f=new h;if(typeof Deno<"u"){f.name="deno",f.browser=!1,f.pid=Deno.pid,f.cwd=()=>Deno.cwd(),f.chdir=e=>Deno.chdir(e),f.arch=Deno.build.arch,f.platform=Deno.build.os,f.version="v18.12.1",f.versions={node:"18.12.1",uv:"1.43.0",zlib:"1.2.11",brotli:"1.0.9",ares:"1.18.1",modules:"108",nghttp2:"1.47.0",napi:"8",llhttp:"6.0.10",openssl:"3.0.7+quic",cldr:"41.0",icu:"71.1",tz:"2022b",unicode:"14.0",ngtcp2:"0.8.1",nghttp3:"0.7.0",...Deno.version},f.env=new Proxy({},{get(e,t){return Deno.env.get(String(t))},ownKeys:()=>Reflect.ownKeys(Deno.env.toObject()),getOwnPropertyDescriptor:(e,t)=>{let r=Deno.env.toObject();if(t in Deno.env.toObject()){let i={enumerable:!0,configurable:!0};return typeof t=="string"&&(i.value=r[t]),i}},set(e,t,r){return Deno.env.set(String(t),String(r)),r}});let n=["","",...Deno.args];Object.defineProperty(n,"0",{get:Deno.execPath}),Object.defineProperty(n,"1",{get:()=>Deno.mainModule.startsWith("file:")?new URL(Deno.mainModule).pathname:join(Deno.cwd(),"$deno$node.js")}),f.argv=n;}else {let n="/";f.cwd=()=>n,f.chdir=e=>n=e;}var j=f;globalThis.__Process$=j;})();
  var require=n=>{const e=m=>typeof m.default<"u"?m.default:m;switch(n){case"react":return e(React10__namespace);default:throw new Error("module \""+n+"\" not found");}};
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require =  ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    __defProp(target, "default", { value: mod, enumerable: true }) ,
    mod
  ));
  var require_extends = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/@babel+runtime@7.26.0/node_modules/@babel/runtime/helpers/extends.js"(exports, module) {
      function _extends() {
        return module.exports = _extends = Object.assign ? Object.assign.bind() : function(n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r2 in t)
              ({}).hasOwnProperty.call(t, r2) && (n[r2] = t[r2]);
          }
          return n;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
      }
      module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });
  var require_objectWithoutPropertiesLoose = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/@babel+runtime@7.26.0/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"(exports, module) {
      function _objectWithoutPropertiesLoose(r2, e) {
        if (null == r2)
          return {};
        var t = {};
        for (var n in r2)
          if ({}.hasOwnProperty.call(r2, n)) {
            if (e.includes(n))
              continue;
            t[n] = r2[n];
          }
        return t;
      }
      module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });
  var require_use_isomorphic_layout_effect_browser_cjs = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/use-isomorphic-layout-effect@1.2.0_react@18.3.1/node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.cjs.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var react = __require("react");
      var index3 = react.useLayoutEffect;
      exports["default"] = index3;
    }
  });
  var require_use_latest_cjs_dev = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/use-latest@1.2.1_react@18.3.1/node_modules/use-latest/dist/use-latest.cjs.dev.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var React12 = __require("react");
      var useIsomorphicLayoutEffect2 = require_use_isomorphic_layout_effect_browser_cjs();
      function _interopDefault(e) {
        return e && e.__esModule ? e : { "default": e };
      }
      function _interopNamespace(e) {
        if (e && e.__esModule)
          return e;
        var n =  Object.create(null);
        if (e) {
          Object.keys(e).forEach(function(k) {
            if (k !== "default") {
              var d = Object.getOwnPropertyDescriptor(e, k);
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: function() {
                  return e[k];
                }
              });
            }
          });
        }
        n["default"] = e;
        return Object.freeze(n);
      }
      var React__namespace =  _interopNamespace(React12);
      var useIsomorphicLayoutEffect__default =  _interopDefault(useIsomorphicLayoutEffect2);
      var useLatest = function useLatest2(value) {
        var ref = React__namespace.useRef(value);
        useIsomorphicLayoutEffect__default["default"](function() {
          ref.current = value;
        });
        return ref;
      };
      exports["default"] = useLatest;
    }
  });
  var require_use_latest_cjs = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/use-latest@1.2.1_react@18.3.1/node_modules/use-latest/dist/use-latest.cjs.js"(exports, module) {
      {
        module.exports = require_use_latest_cjs_dev();
      }
    }
  });
  var require_use_composed_ref_cjs = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/use-composed-ref@1.3.0_react@18.3.1/node_modules/use-composed-ref/dist/use-composed-ref.cjs.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var React12 = __require("react");
      var updateRef = function updateRef2(ref, value) {
        if (typeof ref === "function") {
          ref(value);
          return;
        }
        ref.current = value;
      };
      var useComposedRef = function useComposedRef2(libRef, userRef) {
        var prevUserRef = React12.useRef();
        return React12.useCallback(function(instance) {
          libRef.current = instance;
          if (prevUserRef.current) {
            updateRef(prevUserRef.current, null);
          }
          prevUserRef.current = userRef;
          if (!userRef) {
            return;
          }
          updateRef(userRef, instance);
        }, [userRef]);
      };
      exports.default = useComposedRef;
    }
  });
  var require_react_textarea_autosize_browser_cjs = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/react-textarea-autosize@8.5.6_react@18.3.1/node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.cjs.js"(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      var _extends = require_extends();
      var _objectWithoutPropertiesLoose = require_objectWithoutPropertiesLoose();
      var React12 = __require("react");
      var useLatest = require_use_latest_cjs();
      var useComposedRef = require_use_composed_ref_cjs();
      function _interopDefault(e) {
        return e && e.__esModule ? e : { "default": e };
      }
      function _interopNamespace(e) {
        if (e && e.__esModule)
          return e;
        var n =  Object.create(null);
        if (e) {
          Object.keys(e).forEach(function(k) {
            if (k !== "default") {
              var d = Object.getOwnPropertyDescriptor(e, k);
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: function() {
                  return e[k];
                }
              });
            }
          });
        }
        n["default"] = e;
        return Object.freeze(n);
      }
      var React__namespace =  _interopNamespace(React12);
      var useLatest__default =  _interopDefault(useLatest);
      var useComposedRef__default =  _interopDefault(useComposedRef);
      var HIDDEN_TEXTAREA_STYLE = {
        "min-height": "0",
        "max-height": "none",
        height: "0",
        visibility: "hidden",
        overflow: "hidden",
        position: "absolute",
        "z-index": "-1000",
        top: "0",
        right: "0",
        display: "block"
      };
      var forceHiddenStyles = function forceHiddenStyles2(node) {
        Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function(key) {
          node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], "important");
        });
      };
      var forceHiddenStyles$1 = forceHiddenStyles;
      var hiddenTextarea = null;
      var getHeight = function getHeight2(node, sizingData) {
        var height = node.scrollHeight;
        if (sizingData.sizingStyle.boxSizing === "border-box") {
          return height + sizingData.borderSize;
        }
        return height - sizingData.paddingSize;
      };
      function calculateNodeHeight(sizingData, value, minRows, maxRows) {
        if (minRows === void 0) {
          minRows = 1;
        }
        if (maxRows === void 0) {
          maxRows = Infinity;
        }
        if (!hiddenTextarea) {
          hiddenTextarea = document.createElement("textarea");
          hiddenTextarea.setAttribute("tabindex", "-1");
          hiddenTextarea.setAttribute("aria-hidden", "true");
          forceHiddenStyles$1(hiddenTextarea);
        }
        if (hiddenTextarea.parentNode === null) {
          document.body.appendChild(hiddenTextarea);
        }
        var paddingSize = sizingData.paddingSize, borderSize = sizingData.borderSize, sizingStyle = sizingData.sizingStyle;
        var boxSizing = sizingStyle.boxSizing;
        Object.keys(sizingStyle).forEach(function(_key) {
          var key = _key;
          hiddenTextarea.style[key] = sizingStyle[key];
        });
        forceHiddenStyles$1(hiddenTextarea);
        hiddenTextarea.value = value;
        var height = getHeight(hiddenTextarea, sizingData);
        hiddenTextarea.value = value;
        height = getHeight(hiddenTextarea, sizingData);
        hiddenTextarea.value = "x";
        var rowHeight = hiddenTextarea.scrollHeight - paddingSize;
        var minHeight = rowHeight * minRows;
        if (boxSizing === "border-box") {
          minHeight = minHeight + paddingSize + borderSize;
        }
        height = Math.max(minHeight, height);
        var maxHeight = rowHeight * maxRows;
        if (boxSizing === "border-box") {
          maxHeight = maxHeight + paddingSize + borderSize;
        }
        height = Math.min(maxHeight, height);
        return [height, rowHeight];
      }
      var noop3 = function noop4() {
      };
      var pick = function pick2(props, obj) {
        return props.reduce(function(acc, prop) {
          acc[prop] = obj[prop];
          return acc;
        }, {});
      };
      var SIZING_STYLE = [
        "borderBottomWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "boxSizing",
        "fontFamily",
        "fontSize",
        "fontStyle",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "tabSize",
        "textIndent",
        "textRendering",
        "textTransform",
        "width",
        "wordBreak",
        "wordSpacing",
        "scrollbarGutter"
      ];
      var isIE = !!document.documentElement.currentStyle;
      var getSizingData = function getSizingData2(node) {
        var style = window.getComputedStyle(node);
        if (style === null) {
          return null;
        }
        var sizingStyle = pick(SIZING_STYLE, style);
        var boxSizing = sizingStyle.boxSizing;
        if (boxSizing === "") {
          return null;
        }
        if (isIE && boxSizing === "border-box") {
          sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + "px";
        }
        var paddingSize = parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
        var borderSize = parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth);
        return {
          sizingStyle,
          paddingSize,
          borderSize
        };
      };
      var getSizingData$1 = getSizingData;
      function useListener(target, type, listener) {
        var latestListener = useLatest__default["default"](listener);
        React__namespace.useLayoutEffect(function() {
          var handler = function handler2(ev) {
            return latestListener.current(ev);
          };
          if (!target) {
            return;
          }
          target.addEventListener(type, handler);
          return function() {
            return target.removeEventListener(type, handler);
          };
        }, []);
      }
      var useWindowResizeListener = function useWindowResizeListener2(listener) {
        useListener(window, "resize", listener);
      };
      var useFontsLoadedListener = function useFontsLoadedListener2(listener) {
        useListener(document.fonts, "loadingdone", listener);
      };
      var _excluded = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"];
      var TextareaAutosize = function TextareaAutosize2(_ref, userRef) {
        var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = _ref$onChange === void 0 ? noop3 : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = _ref$onHeightChange === void 0 ? noop3 : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, _excluded);
        var isControlled = props.value !== void 0;
        var libRef = React__namespace.useRef(null);
        var ref = useComposedRef__default["default"](libRef, userRef);
        var heightRef = React__namespace.useRef(0);
        var measurementsCacheRef = React__namespace.useRef();
        var resizeTextarea = function resizeTextarea2() {
          var node = libRef.current;
          var nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData$1(node);
          if (!nodeSizingData) {
            return;
          }
          measurementsCacheRef.current = nodeSizingData;
          var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || "x", minRows, maxRows), height = _calculateNodeHeight[0], rowHeight = _calculateNodeHeight[1];
          if (heightRef.current !== height) {
            heightRef.current = height;
            node.style.setProperty("height", height + "px", "important");
            onHeightChange(height, {
              rowHeight
            });
          }
        };
        var handleChange = function handleChange2(event) {
          if (!isControlled) {
            resizeTextarea();
          }
          onChange(event);
        };
        {
          React__namespace.useLayoutEffect(resizeTextarea);
          useWindowResizeListener(resizeTextarea);
          useFontsLoadedListener(resizeTextarea);
          return  React__namespace.createElement("textarea", _extends({}, props, {
            onChange: handleChange,
            ref
          }));
        }
      };
      var index3 =  React__namespace.forwardRef(TextareaAutosize);
      exports["default"] = index3;
    }
  });
  var require_react_textarea_autosize_browser_cjs_default = __commonJS({
    "../esmd/npm/@mantine/core@7.15.2/node_modules/.pnpm/react-textarea-autosize@8.5.6_react@18.3.1/node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.cjs.default.js"(exports) {
      exports._default = require_react_textarea_autosize_browser_cjs().default;
    }
  });
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __spreadArray(to, from, pack) {
    for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }
  function useCallbackRef(initialValue, callback) {
    var ref = React10.useState(function() {
      return {
        value: initialValue,
        callback,
        facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React10__namespace.useLayoutEffect : React10__namespace.useEffect;
  var currentValues =  new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
  }
  function ItoI(a) {
    return a;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x) {
            return x !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x) {
            return cb(x);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x) {
            pendingQueue.push(x);
            cycle();
          },
          filter: function(filter) {
            pendingQueue = pendingQueue.filter(filter);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
  }
  var SideCar = function(_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error("Sidecar medium not found");
    }
    return React10__namespace.createElement(Target, __assign({}, rest));
  };
  SideCar.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
  }
  var effectCar = createSidecarMedium();
  var nothing = function() {
    return;
  };
  var RemoveScroll = React10__namespace.forwardRef(function(props, parentRef) {
    var ref = React10__namespace.useRef(null);
    var _a = React10__namespace.useState({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container2 = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React10__namespace.createElement(
      React10__namespace.Fragment,
      null,
      enabled && React10__namespace.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? React10__namespace.cloneElement(React10__namespace.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React10__namespace.createElement(Container2, __assign({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };
  var getNonce = function() {
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      React10__namespace.useEffect(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };
  var styleSingleton = function() {
    var useStyle = styleHookSingleton();
    var Sheet = function(_a) {
      var styles = _a.styles, dynamic = _a.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse = function(x) {
    return parseInt(x || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse(left), parse(top), parse(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };
  var Style = styleSingleton();
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    React10__namespace.useEffect(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
    useLockAttribute();
    var gap = React10__namespace.useMemo(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React10__namespace.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var options;
  var nonPassive = passiveSupported ? { passive: false } : false;
  var alwaysContainsScroll = function(node) {
    return node.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
      return false;
    }
    var styles = window.getComputedStyle(node);
    return (
      styles[overflow] !== "hidden" && 
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowY");
  };
  var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
  };
  var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node) {
    return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function(axis, node) {
    return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      if (target instanceof ShadowRoot) {
        target = target.host;
      } else {
        target = target.parentNode;
      }
    } while (
      !targetInLock && target !== document.body || 
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (Math.abs(availableScroll) < 1 || !noOverscroll)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (Math.abs(availableScrollTop) < 1 || !noOverscroll)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
  };
  var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React10__namespace.useRef([]);
    var touchStartRef = React10__namespace.useRef([0, 0]);
    var activeAxis = React10__namespace.useRef();
    var id = React10__namespace.useState(idCounter++)[0];
    var Style2 = React10__namespace.useState(styleSingleton)[0];
    var lastProps = React10__namespace.useRef(props);
    React10__namespace.useEffect(function() {
      lastProps.current = props;
    }, [props]);
    React10__namespace.useEffect(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef)).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React10__namespace.useCallback(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = React10__namespace.useCallback(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e) {
        return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React10__namespace.useCallback(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
          return e !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React10__namespace.useCallback(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = React10__namespace.useCallback(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React10__namespace.useCallback(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React10__namespace.useEffect(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return React10__namespace.createElement(
      React10__namespace.Fragment,
      null,
      inert ? React10__namespace.createElement(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? React10__namespace.createElement(RemoveScrollBar, { gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
      if (node instanceof ShadowRoot) {
        shadowParent = node.host;
        node = node.host;
      }
      node = node.parentNode;
    }
    return shadowParent;
  }
  var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = React10__namespace.forwardRef(function(props, ref) {
    return React10__namespace.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: sidecar_default }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var Combination_default = ReactRemoveScroll;
  function keys(object) {
    return Object.keys(object);
  }
  function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }
  function deepMerge(target, source) {
    const result = { ...target };
    const _source = source;
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(_source[key])) {
          if (!(key in target)) {
            result[key] = _source[key];
          } else {
            result[key] = deepMerge(result[key], _source[key]);
          }
        } else {
          result[key] = _source[key];
        }
      });
    }
    return result;
  }
  function camelToKebabCase(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  function getTransformedScaledValue(value) {
    if (typeof value !== "string" || !value.includes("var(--mantine-scale)")) {
      return value;
    }
    return value.match(/^calc\((.*?)\)$/)?.[1].split("*")[0].trim();
  }
  function px(value) {
    const transformedValue = getTransformedScaledValue(value);
    if (typeof transformedValue === "number") {
      return transformedValue;
    }
    if (typeof transformedValue === "string") {
      if (transformedValue.includes("calc") || transformedValue.includes("var")) {
        return transformedValue;
      }
      if (transformedValue.includes("px")) {
        return Number(transformedValue.replace("px", ""));
      }
      if (transformedValue.includes("rem")) {
        return Number(transformedValue.replace("rem", "")) * 16;
      }
      if (transformedValue.includes("em")) {
        return Number(transformedValue.replace("em", "")) * 16;
      }
      return Number(transformedValue);
    }
    return NaN;
  }
  function scaleRem(remValue) {
    if (remValue === "0rem") {
      return "0rem";
    }
    return `calc(${remValue} * var(--mantine-scale))`;
  }
  function createConverter(units, { shouldScale = false } = {}) {
    function converter(value) {
      if (value === 0 || value === "0") {
        return `0${units}`;
      }
      if (typeof value === "number") {
        const val = `${value / 16}${units}`;
        return shouldScale ? scaleRem(val) : val;
      }
      if (typeof value === "string") {
        if (value === "") {
          return value;
        }
        if (value.startsWith("calc(") || value.startsWith("clamp(") || value.includes("rgba(")) {
          return value;
        }
        if (value.includes(",")) {
          return value.split(",").map((val) => converter(val)).join(",");
        }
        if (value.includes(" ")) {
          return value.split(" ").map((val) => converter(val)).join(" ");
        }
        if (value.includes(units)) {
          return shouldScale ? scaleRem(value) : value;
        }
        const replaced = value.replace("px", "");
        if (!Number.isNaN(Number(replaced))) {
          const val = `${Number(replaced) / 16}${units}`;
          return shouldScale ? scaleRem(val) : val;
        }
      }
      return value;
    }
    return converter;
  }
  var rem = createConverter("rem", { shouldScale: true });
  var em = createConverter("em");
  function filterProps(props) {
    return Object.keys(props).reduce((acc, key) => {
      if (props[key] !== void 0) {
        acc[key] = props[key];
      }
      return acc;
    }, {});
  }
  function isNumberLike(value) {
    if (typeof value === "number") {
      return true;
    }
    if (typeof value === "string") {
      if (value.startsWith("calc(") || value.startsWith("var(") || value.includes(" ") && value.trim() !== "") {
        return true;
      }
      const cssUnitsRegex = /^[+-]?[0-9]+(\.[0-9]+)?(px|em|rem|ex|ch|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cm|mm|in|pt|pc|q|cqw|cqh|cqi|cqb|cqmin|cqmax|%)?$/;
      const values2 = value.trim().split(/\s+/);
      return values2.every((val) => cssUnitsRegex.test(val));
    }
    return false;
  }
  function isElement(value) {
    if (Array.isArray(value) || value === null) {
      return false;
    }
    if (typeof value === "object") {
      if (value.type === React10.Fragment) {
        return false;
      }
      return true;
    }
    return false;
  }
  function createSafeContext(errorMessage) {
    const Context = React10.createContext(null);
    const useSafeContext = () => {
      const ctx = React10.useContext(Context);
      if (ctx === null) {
        throw new Error(errorMessage);
      }
      return ctx;
    };
    const Provider = ({ children, value }) =>  jsxRuntime.jsx(Context.Provider, { value, children });
    return [Provider, useSafeContext];
  }
  function createOptionalContext(initialValue = null) {
    const Context = React10.createContext(initialValue);
    const useOptionalContext = () => React10.useContext(Context);
    const Provider = ({ children, value }) =>  jsxRuntime.jsx(Context.Provider, { value, children });
    return [Provider, useOptionalContext];
  }
  function getSafeId(uid, errorMessage) {
    return (value) => {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(errorMessage);
      }
      return `${uid}-${value}`;
    };
  }
  function findElementAncestor(element, selector) {
    let _element = element;
    while ((_element = _element.parentElement) && !_element.matches(selector)) {
    }
    return _element;
  }
  function getPreviousIndex(current, elements, loop) {
    for (let i = current - 1; i >= 0; i -= 1) {
      if (!elements[i].disabled) {
        return i;
      }
    }
    if (loop) {
      for (let i = elements.length - 1; i > -1; i -= 1) {
        if (!elements[i].disabled) {
          return i;
        }
      }
    }
    return current;
  }
  function getNextIndex(current, elements, loop) {
    for (let i = current + 1; i < elements.length; i += 1) {
      if (!elements[i].disabled) {
        return i;
      }
    }
    if (loop) {
      for (let i = 0; i < elements.length; i += 1) {
        if (!elements[i].disabled) {
          return i;
        }
      }
    }
    return current;
  }
  function onSameLevel(target, sibling, parentSelector) {
    return findElementAncestor(target, parentSelector) === findElementAncestor(sibling, parentSelector);
  }
  function createScopedKeydownHandler({
    parentSelector,
    siblingSelector,
    onKeyDown,
    loop = true,
    activateOnFocus = false,
    dir = "rtl",
    orientation
  }) {
    return (event) => {
      onKeyDown?.(event);
      const elements = Array.from(
        findElementAncestor(event.currentTarget, parentSelector)?.querySelectorAll(
          siblingSelector
        ) || []
      ).filter((node) => onSameLevel(event.currentTarget, node, parentSelector));
      const current = elements.findIndex((el) => event.currentTarget === el);
      const _nextIndex = getNextIndex(current, elements, loop);
      const _previousIndex = getPreviousIndex(current, elements, loop);
      const nextIndex = dir === "rtl" ? _previousIndex : _nextIndex;
      const previousIndex = dir === "rtl" ? _nextIndex : _previousIndex;
      switch (event.key) {
        case "ArrowRight": {
          if (orientation === "horizontal") {
            event.stopPropagation();
            event.preventDefault();
            elements[nextIndex].focus();
            activateOnFocus && elements[nextIndex].click();
          }
          break;
        }
        case "ArrowLeft": {
          if (orientation === "horizontal") {
            event.stopPropagation();
            event.preventDefault();
            elements[previousIndex].focus();
            activateOnFocus && elements[previousIndex].click();
          }
          break;
        }
        case "ArrowUp": {
          if (orientation === "vertical") {
            event.stopPropagation();
            event.preventDefault();
            elements[_previousIndex].focus();
            activateOnFocus && elements[_previousIndex].click();
          }
          break;
        }
        case "ArrowDown": {
          if (orientation === "vertical") {
            event.stopPropagation();
            event.preventDefault();
            elements[_nextIndex].focus();
            activateOnFocus && elements[_nextIndex].click();
          }
          break;
        }
        case "Home": {
          event.stopPropagation();
          event.preventDefault();
          !elements[0].disabled && elements[0].focus();
          break;
        }
        case "End": {
          event.stopPropagation();
          event.preventDefault();
          const last = elements.length - 1;
          !elements[last].disabled && elements[last].focus();
          break;
        }
      }
    };
  }
  var elevations = {
    app: 100,
    modal: 200,
    popover: 300,
    overlay: 400,
    max: 9999
  };
  function getDefaultZIndex(level) {
    return elevations[level];
  }
  var noop = () => {
  };
  function closeOnEscape(callback, options = { active: true }) {
    if (typeof callback !== "function" || !options.active) {
      return options.onKeyDown || noop;
    }
    return (event) => {
      if (event.key === "Escape") {
        callback(event);
        options.onTrigger?.();
      }
    };
  }
  function getSize(size4, prefix = "size", convertToRem = true) {
    if (size4 === void 0) {
      return void 0;
    }
    return isNumberLike(size4) ? convertToRem ? rem(size4) : size4 : `var(--${prefix}-${size4})`;
  }
  function getSpacing(size4) {
    return getSize(size4, "mantine-spacing");
  }
  function getRadius(size4) {
    if (size4 === void 0) {
      return "var(--mantine-radius-default)";
    }
    return getSize(size4, "mantine-radius");
  }
  function getFontSize(size4) {
    return getSize(size4, "mantine-font-size");
  }
  function getLineHeight(size4) {
    return getSize(size4, "mantine-line-height", false);
  }
  function getShadow(size4) {
    if (!size4) {
      return void 0;
    }
    return getSize(size4, "mantine-shadow", false);
  }
  function createEventHandler(parentEventHandler, eventHandler) {
    return (event) => {
      parentEventHandler?.(event);
      eventHandler?.(event);
    };
  }
  function getBreakpointValue(breakpoint, breakpoints) {
    if (breakpoint in breakpoints) {
      return px(breakpoints[breakpoint]);
    }
    return px(breakpoint);
  }
  function getSortedBreakpoints(values2, breakpoints) {
    const convertedBreakpoints = values2.map((breakpoint) => ({
      value: breakpoint,
      px: getBreakpointValue(breakpoint, breakpoints)
    }));
    convertedBreakpoints.sort((a, b) => a.px - b.px);
    return convertedBreakpoints;
  }
  function getBaseValue(value) {
    if (typeof value === "object" && value !== null) {
      if ("base" in value) {
        return value.base;
      }
      return void 0;
    }
    return value;
  }
  function getContextItemIndex(elementSelector, parentSelector, node) {
    if (!node) {
      return null;
    }
    return Array.from(
      findElementAncestor(node, parentSelector)?.querySelectorAll(elementSelector) || []
    ).findIndex((element) => element === node);
  }
  function useHovered() {
    const [hovered, setHovered] = React10.useState(-1);
    const resetHovered = () => setHovered(-1);
    return [hovered, { setHovered, resetHovered }];
  }
  function dispatchEvent(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
  function createUseExternalEvents(prefix) {
    function _useExternalEvents(events) {
      const handlers = Object.keys(events).reduce((acc, eventKey) => {
        acc[`${prefix}:${eventKey}`] = (event) => events[eventKey](event.detail);
        return acc;
      }, {});
      hooks.useIsomorphicEffect(() => {
        Object.keys(handlers).forEach((eventKey) => {
          window.removeEventListener(eventKey, handlers[eventKey]);
          window.addEventListener(eventKey, handlers[eventKey]);
        });
        return () => Object.keys(handlers).forEach((eventKey) => {
          window.removeEventListener(eventKey, handlers[eventKey]);
        });
      }, [handlers]);
    }
    function createEvent(event) {
      return (...payload) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
    }
    return [_useExternalEvents, createEvent];
  }
  function getEnv() {
    if (typeof __Process$ !== "undefined" && __Process$.env && "development") {
      return "development";
    }
    return "development";
  }
  function memoize(func) {
    const cache =  new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    };
  }
  function findClosestNumber(value, numbers) {
    if (numbers.length === 0) {
      return value;
    }
    return numbers.reduce(
      (prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }
  function getRefProp(element) {
    const version = React10.version;
    if (typeof React10.version !== "string") {
      return element?.ref;
    }
    if (version.startsWith("18.")) {
      return element?.ref;
    }
    return element?.props?.ref;
  }
  function createVarsResolver(resolver) {
    return resolver;
  }
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e)
      n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e)) {
        var o = e.length;
        for (t = 0; t < o; t++)
          e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
      } else
        for (f in e)
          e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
      (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }
  var clsx_default = clsx;
  var EMPTY_CLASS_NAMES = {};
  function mergeClassNames(objects) {
    const merged = {};
    objects.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (merged[key]) {
          merged[key] = clsx_default(merged[key], value);
        } else {
          merged[key] = value;
        }
      });
    });
    return merged;
  }
  function resolveClassNames({ theme, classNames, props, stylesCtx }) {
    const arrayClassNames = Array.isArray(classNames) ? classNames : [classNames];
    const resolvedClassNames = arrayClassNames.map(
      (item) => typeof item === "function" ? item(theme, props, stylesCtx) : item || EMPTY_CLASS_NAMES
    );
    return mergeClassNames(resolvedClassNames);
  }
  function resolveStyles({ theme, styles, props, stylesCtx }) {
    const arrayStyles = Array.isArray(styles) ? styles : [styles];
    return arrayStyles.reduce((acc, style) => {
      if (typeof style === "function") {
        return { ...acc, ...style(theme, props, stylesCtx) };
      }
      return { ...acc, ...style };
    }, {});
  }
  var MantineContext = React10.createContext(null);
  function useMantineContext() {
    const ctx = React10.useContext(MantineContext);
    if (!ctx) {
      throw new Error("[@mantine/core] MantineProvider was not found in tree");
    }
    return ctx;
  }
  function useMantineCssVariablesResolver() {
    return useMantineContext().cssVariablesResolver;
  }
  function useMantineClassNamesPrefix() {
    return useMantineContext().classNamesPrefix;
  }
  function useMantineStyleNonce() {
    return useMantineContext().getStyleNonce;
  }
  function useMantineWithStaticClasses() {
    return useMantineContext().withStaticClasses;
  }
  function useMantineIsHeadless() {
    return useMantineContext().headless;
  }
  function useMantineSxTransform() {
    return useMantineContext().stylesTransform?.sx;
  }
  function useMantineStylesTransform() {
    return useMantineContext().stylesTransform?.styles;
  }
  function isHexColor(hex) {
    const HEX_REGEXP = /^#?([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i;
    return HEX_REGEXP.test(hex);
  }
  function hexToRgba(color) {
    let hexString = color.replace("#", "");
    if (hexString.length === 3) {
      const shorthandHex = hexString.split("");
      hexString = [
        shorthandHex[0],
        shorthandHex[0],
        shorthandHex[1],
        shorthandHex[1],
        shorthandHex[2],
        shorthandHex[2]
      ].join("");
    }
    if (hexString.length === 8) {
      const alpha2 = parseInt(hexString.slice(6, 8), 16) / 255;
      return {
        r: parseInt(hexString.slice(0, 2), 16),
        g: parseInt(hexString.slice(2, 4), 16),
        b: parseInt(hexString.slice(4, 6), 16),
        a: alpha2
      };
    }
    const parsed = parseInt(hexString, 16);
    const r2 = parsed >> 16 & 255;
    const g = parsed >> 8 & 255;
    const b = parsed & 255;
    return {
      r: r2,
      g,
      b,
      a: 1
    };
  }
  function rgbStringToRgba(color) {
    const [r2, g, b, a] = color.replace(/[^0-9,./]/g, "").split(/[/,]/).map(Number);
    return { r: r2, g, b, a: a || 1 };
  }
  function hslStringToRgba(hslaString) {
    const hslaRegex = /^hsla?\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*(,\s*(0?\.\d+|\d+(\.\d+)?))?\s*\)$/i;
    const matches = hslaString.match(hslaRegex);
    if (!matches) {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      };
    }
    const h = parseInt(matches[1], 10);
    const s = parseInt(matches[2], 10) / 100;
    const l = parseInt(matches[3], 10) / 100;
    const a = matches[5] ? parseFloat(matches[5]) : void 0;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const huePrime = h / 60;
    const x = chroma * (1 - Math.abs(huePrime % 2 - 1));
    const m = l - chroma / 2;
    let r2;
    let g;
    let b;
    if (huePrime >= 0 && huePrime < 1) {
      r2 = chroma;
      g = x;
      b = 0;
    } else if (huePrime >= 1 && huePrime < 2) {
      r2 = x;
      g = chroma;
      b = 0;
    } else if (huePrime >= 2 && huePrime < 3) {
      r2 = 0;
      g = chroma;
      b = x;
    } else if (huePrime >= 3 && huePrime < 4) {
      r2 = 0;
      g = x;
      b = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      r2 = x;
      g = 0;
      b = chroma;
    } else {
      r2 = chroma;
      g = 0;
      b = x;
    }
    return {
      r: Math.round((r2 + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a: a || 1
    };
  }
  function toRgba(color) {
    if (isHexColor(color)) {
      return hexToRgba(color);
    }
    if (color.startsWith("rgb")) {
      return rgbStringToRgba(color);
    }
    if (color.startsWith("hsl")) {
      return hslStringToRgba(color);
    }
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };
  }
  function darken(color, alpha2) {
    if (color.startsWith("var(")) {
      return `color-mix(in srgb, ${color}, black ${alpha2 * 100}%)`;
    }
    const { r: r2, g, b, a } = toRgba(color);
    const f = 1 - alpha2;
    const dark = (input) => Math.round(input * f);
    return `rgba(${dark(r2)}, ${dark(g)}, ${dark(b)}, ${a})`;
  }
  function getPrimaryShade(theme, colorScheme) {
    if (typeof theme.primaryShade === "number") {
      return theme.primaryShade;
    }
    if (colorScheme === "dark") {
      return theme.primaryShade.dark;
    }
    return theme.primaryShade.light;
  }
  function gammaCorrect(c) {
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }
  function getLightnessFromOklch(oklchColor) {
    const match = oklchColor.match(/oklch\((.*?)%\s/);
    return match ? parseFloat(match[1]) : null;
  }
  function luminance(color) {
    if (color.startsWith("oklch(")) {
      return (getLightnessFromOklch(color) || 0) / 100;
    }
    const { r: r2, g, b } = toRgba(color);
    const sR = r2 / 255;
    const sG = g / 255;
    const sB = b / 255;
    const rLinear = gammaCorrect(sR);
    const gLinear = gammaCorrect(sG);
    const bLinear = gammaCorrect(sB);
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }
  function isLightColor(color, luminanceThreshold = 0.179) {
    if (color.startsWith("var(")) {
      return false;
    }
    return luminance(color) > luminanceThreshold;
  }
  function parseThemeColor({
    color,
    theme,
    colorScheme
  }) {
    if (typeof color !== "string") {
      throw new Error(
        `[@mantine/core] Failed to parse color. Expected color to be a string, instead got ${typeof color}`
      );
    }
    if (color === "bright") {
      return {
        color,
        value: colorScheme === "dark" ? theme.white : theme.black,
        shade: void 0,
        isThemeColor: false,
        isLight: isLightColor(
          colorScheme === "dark" ? theme.white : theme.black,
          theme.luminanceThreshold
        ),
        variable: "--mantine-color-bright"
      };
    }
    if (color === "dimmed") {
      return {
        color,
        value: colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7],
        shade: void 0,
        isThemeColor: false,
        isLight: isLightColor(
          colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
          theme.luminanceThreshold
        ),
        variable: "--mantine-color-dimmed"
      };
    }
    if (color === "white" || color === "black") {
      return {
        color,
        value: color === "white" ? theme.white : theme.black,
        shade: void 0,
        isThemeColor: false,
        isLight: isLightColor(
          color === "white" ? theme.white : theme.black,
          theme.luminanceThreshold
        ),
        variable: `--mantine-color-${color}`
      };
    }
    const [_color, shade] = color.split(".");
    const colorShade = shade ? Number(shade) : void 0;
    const isThemeColor = _color in theme.colors;
    if (isThemeColor) {
      const colorValue = colorShade !== void 0 ? theme.colors[_color][colorShade] : theme.colors[_color][getPrimaryShade(theme, colorScheme || "light")];
      return {
        color: _color,
        value: colorValue,
        shade: colorShade,
        isThemeColor,
        isLight: isLightColor(colorValue, theme.luminanceThreshold),
        variable: shade ? `--mantine-color-${_color}-${colorShade}` : `--mantine-color-${_color}-filled`
      };
    }
    return {
      color,
      value: color,
      isThemeColor,
      isLight: isLightColor(color, theme.luminanceThreshold),
      shade: colorShade,
      variable: void 0
    };
  }
  function getThemeColor(color, theme) {
    const parsed = parseThemeColor({ color: color || theme.primaryColor, theme });
    return parsed.variable ? `var(${parsed.variable})` : color;
  }
  function getGradient(gradient, theme) {
    const merged = {
      from: gradient?.from || theme.defaultGradient.from,
      to: gradient?.to || theme.defaultGradient.to,
      deg: gradient?.deg || theme.defaultGradient.deg || 0
    };
    const fromColor = getThemeColor(merged.from, theme);
    const toColor = getThemeColor(merged.to, theme);
    return `linear-gradient(${merged.deg}deg, ${fromColor} 0%, ${toColor} 100%)`;
  }
  function rgba(color, alpha2) {
    if (typeof color !== "string" || alpha2 > 1 || alpha2 < 0) {
      return "rgba(0, 0, 0, 1)";
    }
    if (color.startsWith("var(")) {
      const mixPercentage = (1 - alpha2) * 100;
      return `color-mix(in srgb, ${color}, transparent ${mixPercentage}%)`;
    }
    if (color.startsWith("oklch")) {
      if (color.includes("/")) {
        return color.replace(/\/\s*[\d.]+\s*\)/, `/ ${alpha2})`);
      }
      return color.replace(")", ` / ${alpha2})`);
    }
    const { r: r2, g, b } = toRgba(color);
    return `rgba(${r2}, ${g}, ${b}, ${alpha2})`;
  }
  var alpha = rgba;
  var defaultVariantColorsResolver = ({
    color,
    theme,
    variant,
    gradient,
    autoContrast
  }) => {
    const parsed = parseThemeColor({ color, theme });
    const _autoContrast = typeof autoContrast === "boolean" ? autoContrast : theme.autoContrast;
    if (variant === "filled") {
      const textColor = _autoContrast ? parsed.isLight ? "var(--mantine-color-black)" : "var(--mantine-color-white)" : "var(--mantine-color-white)";
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: `var(--mantine-color-${color}-filled)`,
            hover: `var(--mantine-color-${color}-filled-hover)`,
            color: textColor,
            border: `${rem(1)} solid transparent`
          };
        }
        return {
          background: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
          hover: `var(--mantine-color-${parsed.color}-${parsed.shade === 9 ? 8 : parsed.shade + 1})`,
          color: textColor,
          border: `${rem(1)} solid transparent`
        };
      }
      return {
        background: color,
        hover: darken(color, 0.1),
        color: textColor,
        border: `${rem(1)} solid transparent`
      };
    }
    if (variant === "light") {
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: `var(--mantine-color-${color}-light)`,
            hover: `var(--mantine-color-${color}-light-hover)`,
            color: `var(--mantine-color-${color}-light-color)`,
            border: `${rem(1)} solid transparent`
          };
        }
        const parsedColor = theme.colors[parsed.color][parsed.shade];
        return {
          background: rgba(parsedColor, 0.1),
          hover: rgba(parsedColor, 0.12),
          color: `var(--mantine-color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
          border: `${rem(1)} solid transparent`
        };
      }
      return {
        background: rgba(color, 0.1),
        hover: rgba(color, 0.12),
        color,
        border: `${rem(1)} solid transparent`
      };
    }
    if (variant === "outline") {
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: "transparent",
            hover: `var(--mantine-color-${color}-outline-hover)`,
            color: `var(--mantine-color-${color}-outline)`,
            border: `${rem(1)} solid var(--mantine-color-${color}-outline)`
          };
        }
        return {
          background: "transparent",
          hover: rgba(theme.colors[parsed.color][parsed.shade], 0.05),
          color: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
          border: `${rem(1)} solid var(--mantine-color-${parsed.color}-${parsed.shade})`
        };
      }
      return {
        background: "transparent",
        hover: rgba(color, 0.05),
        color,
        border: `${rem(1)} solid ${color}`
      };
    }
    if (variant === "subtle") {
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: "transparent",
            hover: `var(--mantine-color-${color}-light-hover)`,
            color: `var(--mantine-color-${color}-light-color)`,
            border: `${rem(1)} solid transparent`
          };
        }
        const parsedColor = theme.colors[parsed.color][parsed.shade];
        return {
          background: "transparent",
          hover: rgba(parsedColor, 0.12),
          color: `var(--mantine-color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
          border: `${rem(1)} solid transparent`
        };
      }
      return {
        background: "transparent",
        hover: rgba(color, 0.12),
        color,
        border: `${rem(1)} solid transparent`
      };
    }
    if (variant === "transparent") {
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: "transparent",
            hover: "transparent",
            color: `var(--mantine-color-${color}-light-color)`,
            border: `${rem(1)} solid transparent`
          };
        }
        return {
          background: "transparent",
          hover: "transparent",
          color: `var(--mantine-color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
          border: `${rem(1)} solid transparent`
        };
      }
      return {
        background: "transparent",
        hover: "transparent",
        color,
        border: `${rem(1)} solid transparent`
      };
    }
    if (variant === "white") {
      if (parsed.isThemeColor) {
        if (parsed.shade === void 0) {
          return {
            background: "var(--mantine-color-white)",
            hover: darken(theme.white, 0.01),
            color: `var(--mantine-color-${color}-filled)`,
            border: `${rem(1)} solid transparent`
          };
        }
        return {
          background: "var(--mantine-color-white)",
          hover: darken(theme.white, 0.01),
          color: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
          border: `${rem(1)} solid transparent`
        };
      }
      return {
        background: "var(--mantine-color-white)",
        hover: darken(theme.white, 0.01),
        color,
        border: `${rem(1)} solid transparent`
      };
    }
    if (variant === "gradient") {
      return {
        background: getGradient(gradient, theme),
        hover: getGradient(gradient, theme),
        color: "var(--mantine-color-white)",
        border: "none"
      };
    }
    if (variant === "default") {
      return {
        background: "var(--mantine-color-default)",
        hover: "var(--mantine-color-default-hover)",
        color: "var(--mantine-color-default-color)",
        border: `${rem(1)} solid var(--mantine-color-default-border)`
      };
    }
    return {};
  };
  var DEFAULT_COLORS = {
    dark: [
      "#C9C9C9",
      "#b8b8b8",
      "#828282",
      "#696969",
      "#424242",
      "#3b3b3b",
      "#2e2e2e",
      "#242424",
      "#1f1f1f",
      "#141414"
    ],
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529"
    ],
    red: [
      "#fff5f5",
      "#ffe3e3",
      "#ffc9c9",
      "#ffa8a8",
      "#ff8787",
      "#ff6b6b",
      "#fa5252",
      "#f03e3e",
      "#e03131",
      "#c92a2a"
    ],
    pink: [
      "#fff0f6",
      "#ffdeeb",
      "#fcc2d7",
      "#faa2c1",
      "#f783ac",
      "#f06595",
      "#e64980",
      "#d6336c",
      "#c2255c",
      "#a61e4d"
    ],
    grape: [
      "#f8f0fc",
      "#f3d9fa",
      "#eebefa",
      "#e599f7",
      "#da77f2",
      "#cc5de8",
      "#be4bdb",
      "#ae3ec9",
      "#9c36b5",
      "#862e9c"
    ],
    violet: [
      "#f3f0ff",
      "#e5dbff",
      "#d0bfff",
      "#b197fc",
      "#9775fa",
      "#845ef7",
      "#7950f2",
      "#7048e8",
      "#6741d9",
      "#5f3dc4"
    ],
    indigo: [
      "#edf2ff",
      "#dbe4ff",
      "#bac8ff",
      "#91a7ff",
      "#748ffc",
      "#5c7cfa",
      "#4c6ef5",
      "#4263eb",
      "#3b5bdb",
      "#364fc7"
    ],
    blue: [
      "#e7f5ff",
      "#d0ebff",
      "#a5d8ff",
      "#74c0fc",
      "#4dabf7",
      "#339af0",
      "#228be6",
      "#1c7ed6",
      "#1971c2",
      "#1864ab"
    ],
    cyan: [
      "#e3fafc",
      "#c5f6fa",
      "#99e9f2",
      "#66d9e8",
      "#3bc9db",
      "#22b8cf",
      "#15aabf",
      "#1098ad",
      "#0c8599",
      "#0b7285"
    ],
    teal: [
      "#e6fcf5",
      "#c3fae8",
      "#96f2d7",
      "#63e6be",
      "#38d9a9",
      "#20c997",
      "#12b886",
      "#0ca678",
      "#099268",
      "#087f5b"
    ],
    green: [
      "#ebfbee",
      "#d3f9d8",
      "#b2f2bb",
      "#8ce99a",
      "#69db7c",
      "#51cf66",
      "#40c057",
      "#37b24d",
      "#2f9e44",
      "#2b8a3e"
    ],
    lime: [
      "#f4fce3",
      "#e9fac8",
      "#d8f5a2",
      "#c0eb75",
      "#a9e34b",
      "#94d82d",
      "#82c91e",
      "#74b816",
      "#66a80f",
      "#5c940d"
    ],
    yellow: [
      "#fff9db",
      "#fff3bf",
      "#ffec99",
      "#ffe066",
      "#ffd43b",
      "#fcc419",
      "#fab005",
      "#f59f00",
      "#f08c00",
      "#e67700"
    ],
    orange: [
      "#fff4e6",
      "#ffe8cc",
      "#ffd8a8",
      "#ffc078",
      "#ffa94d",
      "#ff922b",
      "#fd7e14",
      "#f76707",
      "#e8590c",
      "#d9480f"
    ]
  };
  var DEFAULT_FONT_FAMILY = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji";
  var DEFAULT_THEME = {
    scale: 1,
    fontSmoothing: true,
    focusRing: "auto",
    white: "#fff",
    black: "#000",
    colors: DEFAULT_COLORS,
    primaryShade: { light: 6, dark: 8 },
    primaryColor: "blue",
    variantColorResolver: defaultVariantColorsResolver,
    autoContrast: false,
    luminanceThreshold: 0.3,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontFamilyMonospace: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    respectReducedMotion: false,
    cursorType: "default",
    defaultGradient: { from: "blue", to: "cyan", deg: 45 },
    defaultRadius: "sm",
    activeClassName: "mantine-active",
    focusClassName: "",
    headings: {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: "700",
      textWrap: "wrap",
      sizes: {
        h1: { fontSize: rem(34), lineHeight: "1.3" },
        h2: { fontSize: rem(26), lineHeight: "1.35" },
        h3: { fontSize: rem(22), lineHeight: "1.4" },
        h4: { fontSize: rem(18), lineHeight: "1.45" },
        h5: { fontSize: rem(16), lineHeight: "1.5" },
        h6: { fontSize: rem(14), lineHeight: "1.5" }
      }
    },
    fontSizes: {
      xs: rem(12),
      sm: rem(14),
      md: rem(16),
      lg: rem(18),
      xl: rem(20)
    },
    lineHeights: {
      xs: "1.4",
      sm: "1.45",
      md: "1.55",
      lg: "1.6",
      xl: "1.65"
    },
    radius: {
      xs: rem(2),
      sm: rem(4),
      md: rem(8),
      lg: rem(16),
      xl: rem(32)
    },
    spacing: {
      xs: rem(10),
      sm: rem(12),
      md: rem(16),
      lg: rem(20),
      xl: rem(32)
    },
    breakpoints: {
      xs: "36em",
      sm: "48em",
      md: "62em",
      lg: "75em",
      xl: "88em"
    },
    shadows: {
      xs: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05), 0 ${rem(1)} ${rem(2)} rgba(0, 0, 0, 0.1)`,
      sm: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 ${rem(10)} ${rem(
      15
    )} ${rem(-5)}, rgba(0, 0, 0, 0.04) 0 ${rem(7)} ${rem(7)} ${rem(-5)}`,
      md: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 ${rem(20)} ${rem(
      25
    )} ${rem(-5)}, rgba(0, 0, 0, 0.04) 0 ${rem(10)} ${rem(10)} ${rem(-5)}`,
      lg: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 ${rem(28)} ${rem(
      23
    )} ${rem(-7)}, rgba(0, 0, 0, 0.04) 0 ${rem(12)} ${rem(12)} ${rem(-7)}`,
      xl: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 ${rem(36)} ${rem(
      28
    )} ${rem(-7)}, rgba(0, 0, 0, 0.04) 0 ${rem(17)} ${rem(17)} ${rem(-7)}`
    },
    other: {},
    components: {}
  };
  function isMantineColorScheme(value) {
    return value === "auto" || value === "dark" || value === "light";
  }
  function localStorageColorSchemeManager({
    key = "mantine-color-scheme-value"
  } = {}) {
    let handleStorageEvent;
    return {
      get: (defaultValue) => {
        if (typeof window === "undefined") {
          return defaultValue;
        }
        try {
          const storedColorScheme = window.localStorage.getItem(key);
          return isMantineColorScheme(storedColorScheme) ? storedColorScheme : defaultValue;
        } catch {
          return defaultValue;
        }
      },
      set: (value) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error2) {
          console.warn(
            "[@mantine/core] Local storage color scheme manager was unable to save color scheme.",
            error2
          );
        }
      },
      subscribe: (onUpdate) => {
        handleStorageEvent = (event) => {
          if (event.storageArea === window.localStorage && event.key === key) {
            isMantineColorScheme(event.newValue) && onUpdate(event.newValue);
          }
        };
        window.addEventListener("storage", handleStorageEvent);
      },
      unsubscribe: () => {
        window.removeEventListener("storage", handleStorageEvent);
      },
      clear: () => {
        window.localStorage.removeItem(key);
      }
    };
  }
  var INVALID_PRIMARY_COLOR_ERROR = "[@mantine/core] MantineProvider: Invalid theme.primaryColor, it accepts only key of theme.colors, learn more \u2013 https://mantine.dev/theming/colors/#primary-color";
  var INVALID_PRIMARY_SHADE_ERROR = "[@mantine/core] MantineProvider: Invalid theme.primaryShade, it accepts only 0-9 integers or an object { light: 0-9, dark: 0-9 }";
  function isValidPrimaryShade(shade) {
    if (shade < 0 || shade > 9) {
      return false;
    }
    return parseInt(shade.toString(), 10) === shade;
  }
  function validateMantineTheme(theme) {
    if (!(theme.primaryColor in theme.colors)) {
      throw new Error(INVALID_PRIMARY_COLOR_ERROR);
    }
    if (typeof theme.primaryShade === "object") {
      if (!isValidPrimaryShade(theme.primaryShade.dark) || !isValidPrimaryShade(theme.primaryShade.light)) {
        throw new Error(INVALID_PRIMARY_SHADE_ERROR);
      }
    }
    if (typeof theme.primaryShade === "number" && !isValidPrimaryShade(theme.primaryShade)) {
      throw new Error(INVALID_PRIMARY_SHADE_ERROR);
    }
  }
  function mergeMantineTheme(currentTheme, themeOverride) {
    if (!themeOverride) {
      validateMantineTheme(currentTheme);
      return currentTheme;
    }
    const result = deepMerge(currentTheme, themeOverride);
    if (themeOverride.fontFamily && !themeOverride.headings?.fontFamily) {
      result.headings.fontFamily = themeOverride.fontFamily;
    }
    validateMantineTheme(result);
    return result;
  }
  var MantineThemeContext = React10.createContext(null);
  var useSafeMantineTheme = () => React10.useContext(MantineThemeContext) || DEFAULT_THEME;
  function useMantineTheme() {
    const ctx = React10.useContext(MantineThemeContext);
    if (!ctx) {
      throw new Error(
        "@mantine/core: MantineProvider was not found in component tree, make sure you have it in your app"
      );
    }
    return ctx;
  }
  function MantineThemeProvider({
    theme,
    children,
    inherit = true
  }) {
    const parentTheme = useSafeMantineTheme();
    const mergedTheme = React10.useMemo(
      () => mergeMantineTheme(inherit ? parentTheme : DEFAULT_THEME, theme),
      [theme, parentTheme, inherit]
    );
    return  jsxRuntime.jsx(MantineThemeContext.Provider, { value: mergedTheme, children });
  }
  MantineThemeProvider.displayName = "@mantine/core/MantineThemeProvider";
  function MantineClasses() {
    const theme = useMantineTheme();
    const nonce = useMantineStyleNonce();
    const classes87 = keys(theme.breakpoints).reduce((acc, breakpoint) => {
      const isPxBreakpoint = theme.breakpoints[breakpoint].includes("px");
      const pxValue = px(theme.breakpoints[breakpoint]);
      const maxWidthBreakpoint = isPxBreakpoint ? `${pxValue - 0.1}px` : em(pxValue - 0.1);
      const minWidthBreakpoint = isPxBreakpoint ? `${pxValue}px` : em(pxValue);
      return `${acc}@media (max-width: ${maxWidthBreakpoint}) {.mantine-visible-from-${breakpoint} {display: none !important;}}@media (min-width: ${minWidthBreakpoint}) {.mantine-hidden-from-${breakpoint} {display: none !important;}}`;
    }, "");
    return  jsxRuntime.jsx(
      "style",
      {
        "data-mantine-styles": "classes",
        nonce: nonce?.(),
        dangerouslySetInnerHTML: { __html: classes87 }
      }
    );
  }
  function cssVariablesObjectToString(variables) {
    return Object.entries(variables).map(([name, value]) => `${name}: ${value};`).join("");
  }
  function wrapWithSelector(selectors, code) {
    const _selectors = Array.isArray(selectors) ? selectors : [selectors];
    return _selectors.reduce((acc, selector) => `${selector}{${acc}}`, code);
  }
  function convertCssVariables(input, selector) {
    const sharedVariables = cssVariablesObjectToString(input.variables);
    const shared = sharedVariables ? wrapWithSelector(selector, sharedVariables) : "";
    const dark = cssVariablesObjectToString(input.dark);
    const light = cssVariablesObjectToString(input.light);
    const darkForced = dark ? selector === ":host" ? wrapWithSelector(`${selector}([data-mantine-color-scheme="dark"])`, dark) : wrapWithSelector(`${selector}[data-mantine-color-scheme="dark"]`, dark) : "";
    const lightForced = light ? selector === ":host" ? wrapWithSelector(`${selector}([data-mantine-color-scheme="light"])`, light) : wrapWithSelector(`${selector}[data-mantine-color-scheme="light"]`, light) : "";
    return `${shared}${darkForced}${lightForced}`;
  }
  function getContrastColor({ color, theme, autoContrast }) {
    const _autoContrast = typeof autoContrast === "boolean" ? autoContrast : theme.autoContrast;
    if (!_autoContrast) {
      return "var(--mantine-color-white)";
    }
    const parsed = parseThemeColor({ color: color || theme.primaryColor, theme });
    return parsed.isLight ? "var(--mantine-color-black)" : "var(--mantine-color-white)";
  }
  function getPrimaryContrastColor(theme, colorScheme) {
    return getContrastColor({
      color: theme.colors[theme.primaryColor][getPrimaryShade(theme, colorScheme)],
      theme,
      autoContrast: null
    });
  }
  function getCSSColorVariables({
    theme,
    color,
    colorScheme,
    name = color,
    withColorValues = true
  }) {
    if (!theme.colors[color]) {
      return {};
    }
    if (colorScheme === "light") {
      const primaryShade2 = getPrimaryShade(theme, "light");
      const dynamicVariables2 = {
        [`--mantine-color-${name}-text`]: `var(--mantine-color-${name}-filled)`,
        [`--mantine-color-${name}-filled`]: `var(--mantine-color-${name}-${primaryShade2})`,
        [`--mantine-color-${name}-filled-hover`]: `var(--mantine-color-${name}-${primaryShade2 === 9 ? 8 : primaryShade2 + 1})`,
        [`--mantine-color-${name}-light`]: alpha(theme.colors[color][primaryShade2], 0.1),
        [`--mantine-color-${name}-light-hover`]: alpha(theme.colors[color][primaryShade2], 0.12),
        [`--mantine-color-${name}-light-color`]: `var(--mantine-color-${name}-${primaryShade2})`,
        [`--mantine-color-${name}-outline`]: `var(--mantine-color-${name}-${primaryShade2})`,
        [`--mantine-color-${name}-outline-hover`]: alpha(theme.colors[color][primaryShade2], 0.05)
      };
      if (!withColorValues) {
        return dynamicVariables2;
      }
      return {
        [`--mantine-color-${name}-0`]: theme.colors[color][0],
        [`--mantine-color-${name}-1`]: theme.colors[color][1],
        [`--mantine-color-${name}-2`]: theme.colors[color][2],
        [`--mantine-color-${name}-3`]: theme.colors[color][3],
        [`--mantine-color-${name}-4`]: theme.colors[color][4],
        [`--mantine-color-${name}-5`]: theme.colors[color][5],
        [`--mantine-color-${name}-6`]: theme.colors[color][6],
        [`--mantine-color-${name}-7`]: theme.colors[color][7],
        [`--mantine-color-${name}-8`]: theme.colors[color][8],
        [`--mantine-color-${name}-9`]: theme.colors[color][9],
        ...dynamicVariables2
      };
    }
    const primaryShade = getPrimaryShade(theme, "dark");
    const dynamicVariables = {
      [`--mantine-color-${name}-text`]: `var(--mantine-color-${name}-4)`,
      [`--mantine-color-${name}-filled`]: `var(--mantine-color-${name}-${primaryShade})`,
      [`--mantine-color-${name}-filled-hover`]: `var(--mantine-color-${name}-${primaryShade === 9 ? 8 : primaryShade + 1})`,
      [`--mantine-color-${name}-light`]: alpha(
        theme.colors[color][Math.max(0, primaryShade - 2)],
        0.15
      ),
      [`--mantine-color-${name}-light-hover`]: alpha(
        theme.colors[color][Math.max(0, primaryShade - 2)],
        0.2
      ),
      [`--mantine-color-${name}-light-color`]: `var(--mantine-color-${name}-${Math.max(primaryShade - 5, 0)})`,
      [`--mantine-color-${name}-outline`]: `var(--mantine-color-${name}-${Math.max(primaryShade - 4, 0)})`,
      [`--mantine-color-${name}-outline-hover`]: alpha(
        theme.colors[color][Math.max(primaryShade - 4, 0)],
        0.05
      )
    };
    if (!withColorValues) {
      return dynamicVariables;
    }
    return {
      [`--mantine-color-${name}-0`]: theme.colors[color][0],
      [`--mantine-color-${name}-1`]: theme.colors[color][1],
      [`--mantine-color-${name}-2`]: theme.colors[color][2],
      [`--mantine-color-${name}-3`]: theme.colors[color][3],
      [`--mantine-color-${name}-4`]: theme.colors[color][4],
      [`--mantine-color-${name}-5`]: theme.colors[color][5],
      [`--mantine-color-${name}-6`]: theme.colors[color][6],
      [`--mantine-color-${name}-7`]: theme.colors[color][7],
      [`--mantine-color-${name}-8`]: theme.colors[color][8],
      [`--mantine-color-${name}-9`]: theme.colors[color][9],
      ...dynamicVariables
    };
  }
  function colorsTuple(input) {
    if (Array.isArray(input)) {
      return input;
    }
    return Array(10).fill(input);
  }
  function virtualColor(input) {
    const result = colorsTuple(
      Array.from({ length: 10 }).map((_, i) => `var(--mantine-color-${input.name}-${i})`)
    );
    Object.defineProperty(result, "mantine-virtual-color", {
      enumerable: false,
      writable: false,
      configurable: false,
      value: true
    });
    Object.defineProperty(result, "dark", {
      enumerable: false,
      writable: false,
      configurable: false,
      value: input.dark
    });
    Object.defineProperty(result, "light", {
      enumerable: false,
      writable: false,
      configurable: false,
      value: input.light
    });
    Object.defineProperty(result, "name", {
      enumerable: false,
      writable: false,
      configurable: false,
      value: input.name
    });
    return result;
  }
  function isVirtualColor(value) {
    return !!value && typeof value === "object" && "mantine-virtual-color" in value;
  }
  function assignSizeVariables(variables, sizes2, name) {
    keys(sizes2).forEach(
      (size4) => Object.assign(variables, { [`--mantine-${name}-${size4}`]: sizes2[size4] })
    );
  }
  var defaultCssVariablesResolver = (theme) => {
    const lightPrimaryShade = getPrimaryShade(theme, "light");
    const defaultRadius = theme.defaultRadius in theme.radius ? theme.radius[theme.defaultRadius] : rem(theme.defaultRadius);
    const result = {
      variables: {
        "--mantine-scale": theme.scale.toString(),
        "--mantine-cursor-type": theme.cursorType,
        "--mantine-color-scheme": "light dark",
        "--mantine-webkit-font-smoothing": theme.fontSmoothing ? "antialiased" : "unset",
        "--mantine-moz-font-smoothing": theme.fontSmoothing ? "grayscale" : "unset",
        "--mantine-color-white": theme.white,
        "--mantine-color-black": theme.black,
        "--mantine-line-height": theme.lineHeights.md,
        "--mantine-font-family": theme.fontFamily,
        "--mantine-font-family-monospace": theme.fontFamilyMonospace,
        "--mantine-font-family-headings": theme.headings.fontFamily,
        "--mantine-heading-font-weight": theme.headings.fontWeight,
        "--mantine-heading-text-wrap": theme.headings.textWrap,
        "--mantine-radius-default": defaultRadius,
        "--mantine-primary-color-filled": `var(--mantine-color-${theme.primaryColor}-filled)`,
        "--mantine-primary-color-filled-hover": `var(--mantine-color-${theme.primaryColor}-filled-hover)`,
        "--mantine-primary-color-light": `var(--mantine-color-${theme.primaryColor}-light)`,
        "--mantine-primary-color-light-hover": `var(--mantine-color-${theme.primaryColor}-light-hover)`,
        "--mantine-primary-color-light-color": `var(--mantine-color-${theme.primaryColor}-light-color)`
      },
      light: {
        "--mantine-primary-color-contrast": getPrimaryContrastColor(theme, "light"),
        "--mantine-color-bright": "var(--mantine-color-black)",
        "--mantine-color-text": theme.black,
        "--mantine-color-body": theme.white,
        "--mantine-color-error": "var(--mantine-color-red-6)",
        "--mantine-color-placeholder": "var(--mantine-color-gray-5)",
        "--mantine-color-anchor": `var(--mantine-color-${theme.primaryColor}-${lightPrimaryShade})`,
        "--mantine-color-default": "var(--mantine-color-white)",
        "--mantine-color-default-hover": "var(--mantine-color-gray-0)",
        "--mantine-color-default-color": "var(--mantine-color-black)",
        "--mantine-color-default-border": "var(--mantine-color-gray-4)",
        "--mantine-color-dimmed": "var(--mantine-color-gray-6)"
      },
      dark: {
        "--mantine-primary-color-contrast": getPrimaryContrastColor(theme, "dark"),
        "--mantine-color-bright": "var(--mantine-color-white)",
        "--mantine-color-text": "var(--mantine-color-dark-0)",
        "--mantine-color-body": "var(--mantine-color-dark-7)",
        "--mantine-color-error": "var(--mantine-color-red-8)",
        "--mantine-color-placeholder": "var(--mantine-color-dark-3)",
        "--mantine-color-anchor": `var(--mantine-color-${theme.primaryColor}-4)`,
        "--mantine-color-default": "var(--mantine-color-dark-6)",
        "--mantine-color-default-hover": "var(--mantine-color-dark-5)",
        "--mantine-color-default-color": "var(--mantine-color-white)",
        "--mantine-color-default-border": "var(--mantine-color-dark-4)",
        "--mantine-color-dimmed": "var(--mantine-color-dark-2)"
      }
    };
    assignSizeVariables(result.variables, theme.breakpoints, "breakpoint");
    assignSizeVariables(result.variables, theme.spacing, "spacing");
    assignSizeVariables(result.variables, theme.fontSizes, "font-size");
    assignSizeVariables(result.variables, theme.lineHeights, "line-height");
    assignSizeVariables(result.variables, theme.shadows, "shadow");
    assignSizeVariables(result.variables, theme.radius, "radius");
    theme.colors[theme.primaryColor].forEach((_, index3) => {
      result.variables[`--mantine-primary-color-${index3}`] = `var(--mantine-color-${theme.primaryColor}-${index3})`;
    });
    keys(theme.colors).forEach((color) => {
      const value = theme.colors[color];
      if (isVirtualColor(value)) {
        Object.assign(
          result.light,
          getCSSColorVariables({
            theme,
            name: value.name,
            color: value.light,
            colorScheme: "light",
            withColorValues: true
          })
        );
        Object.assign(
          result.dark,
          getCSSColorVariables({
            theme,
            name: value.name,
            color: value.dark,
            colorScheme: "dark",
            withColorValues: true
          })
        );
        return;
      }
      value.forEach((shade, index3) => {
        result.variables[`--mantine-color-${color}-${index3}`] = shade;
      });
      Object.assign(
        result.light,
        getCSSColorVariables({
          theme,
          color,
          colorScheme: "light",
          withColorValues: false
        })
      );
      Object.assign(
        result.dark,
        getCSSColorVariables({
          theme,
          color,
          colorScheme: "dark",
          withColorValues: false
        })
      );
    });
    const headings4 = theme.headings.sizes;
    keys(headings4).forEach((heading) => {
      result.variables[`--mantine-${heading}-font-size`] = headings4[heading].fontSize;
      result.variables[`--mantine-${heading}-line-height`] = headings4[heading].lineHeight;
      result.variables[`--mantine-${heading}-font-weight`] = headings4[heading].fontWeight || theme.headings.fontWeight;
    });
    return result;
  };
  function getMergedVariables({ theme, generator }) {
    const defaultResolver = defaultCssVariablesResolver(theme);
    const providerGenerator = generator?.(theme);
    return providerGenerator ? deepMerge(defaultResolver, providerGenerator) : defaultResolver;
  }
  var defaultCssVariables = defaultCssVariablesResolver(DEFAULT_THEME);
  function removeDefaultVariables(input) {
    const cleaned = {
      variables: {},
      light: {},
      dark: {}
    };
    keys(input.variables).forEach((key) => {
      if (defaultCssVariables.variables[key] !== input.variables[key]) {
        cleaned.variables[key] = input.variables[key];
      }
    });
    keys(input.light).forEach((key) => {
      if (defaultCssVariables.light[key] !== input.light[key]) {
        cleaned.light[key] = input.light[key];
      }
    });
    keys(input.dark).forEach((key) => {
      if (defaultCssVariables.dark[key] !== input.dark[key]) {
        cleaned.dark[key] = input.dark[key];
      }
    });
    return cleaned;
  }
  function getColorSchemeCssVariables(selector) {
    return `
  ${selector}[data-mantine-color-scheme="dark"] { --mantine-color-scheme: dark; }
  ${selector}[data-mantine-color-scheme="light"] { --mantine-color-scheme: light; }
`;
  }
  function MantineCssVariables({
    cssVariablesSelector,
    deduplicateCssVariables
  }) {
    const theme = useMantineTheme();
    const nonce = useMantineStyleNonce();
    const generator = useMantineCssVariablesResolver();
    const mergedVariables = getMergedVariables({ theme, generator });
    const shouldCleanVariables = cssVariablesSelector === ":root" && deduplicateCssVariables;
    const cleanedVariables = shouldCleanVariables ? removeDefaultVariables(mergedVariables) : mergedVariables;
    const css = convertCssVariables(cleanedVariables, cssVariablesSelector);
    if (css) {
      return  jsxRuntime.jsx(
        "style",
        {
          "data-mantine-styles": true,
          nonce: nonce?.(),
          dangerouslySetInnerHTML: {
            __html: `${css}${shouldCleanVariables ? "" : getColorSchemeCssVariables(cssVariablesSelector)}`
          }
        }
      );
    }
    return null;
  }
  MantineCssVariables.displayName = "@mantine/CssVariables";
  function suppressNextjsWarning() {
    const originalError = console.error;
    console.error = (...args) => {
      if (args.length > 1 && typeof args[0] === "string" && args[0].toLowerCase().includes("extra attributes from the server") && typeof args[1] === "string" && args[1].toLowerCase().includes("data-mantine-color-scheme"))
        ;
      else {
        originalError(...args);
      }
    };
  }
  function setColorSchemeAttribute(colorScheme, getRootElement) {
    const hasDarkColorScheme = typeof window !== "undefined" && "matchMedia" in window && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const computedColorScheme = colorScheme !== "auto" ? colorScheme : hasDarkColorScheme ? "dark" : "light";
    getRootElement()?.setAttribute("data-mantine-color-scheme", computedColorScheme);
  }
  function useProviderColorScheme({
    manager,
    defaultColorScheme,
    getRootElement,
    forceColorScheme
  }) {
    const media = React10.useRef(null);
    const [value, setValue] = React10.useState(() => manager.get(defaultColorScheme));
    const colorSchemeValue = forceColorScheme || value;
    const setColorScheme = React10.useCallback(
      (colorScheme) => {
        if (!forceColorScheme) {
          setColorSchemeAttribute(colorScheme, getRootElement);
          setValue(colorScheme);
          manager.set(colorScheme);
        }
      },
      [manager.set, colorSchemeValue, forceColorScheme]
    );
    const clearColorScheme = React10.useCallback(() => {
      setValue(defaultColorScheme);
      setColorSchemeAttribute(defaultColorScheme, getRootElement);
      manager.clear();
    }, [manager.clear, defaultColorScheme]);
    React10.useEffect(() => {
      manager.subscribe(setColorScheme);
      return manager.unsubscribe;
    }, [manager.subscribe, manager.unsubscribe]);
    hooks.useIsomorphicEffect(() => {
      setColorSchemeAttribute(manager.get(defaultColorScheme), getRootElement);
    }, []);
    React10.useEffect(() => {
      if (forceColorScheme) {
        setColorSchemeAttribute(forceColorScheme, getRootElement);
        return () => {
        };
      }
      if (forceColorScheme === void 0) {
        setColorSchemeAttribute(value, getRootElement);
      }
      if (typeof window !== "undefined" && "matchMedia" in window) {
        media.current = window.matchMedia("(prefers-color-scheme: dark)");
      }
      const listener = (event) => {
        if (value === "auto") {
          setColorSchemeAttribute(event.matches ? "dark" : "light", getRootElement);
        }
      };
      media.current?.addEventListener("change", listener);
      return () => media.current?.removeEventListener("change", listener);
    }, [value, forceColorScheme]);
    return { colorScheme: colorSchemeValue, setColorScheme, clearColorScheme };
  }
  function useRespectReduceMotion({
    respectReducedMotion,
    getRootElement
  }) {
    hooks.useIsomorphicEffect(() => {
      if (respectReducedMotion) {
        getRootElement()?.setAttribute("data-respect-reduced-motion", "true");
      }
    }, [respectReducedMotion]);
  }
  suppressNextjsWarning();
  function MantineProvider({
    theme,
    children,
    getStyleNonce,
    withStaticClasses = true,
    withGlobalClasses = true,
    deduplicateCssVariables = true,
    withCssVariables = true,
    cssVariablesSelector = ":root",
    classNamesPrefix = "mantine",
    colorSchemeManager = localStorageColorSchemeManager(),
    defaultColorScheme = "light",
    getRootElement = () => document.documentElement,
    cssVariablesResolver,
    forceColorScheme,
    stylesTransform
  }) {
    const { colorScheme, setColorScheme, clearColorScheme } = useProviderColorScheme({
      defaultColorScheme,
      forceColorScheme,
      manager: colorSchemeManager,
      getRootElement
    });
    useRespectReduceMotion({
      respectReducedMotion: theme?.respectReducedMotion || false,
      getRootElement
    });
    return  jsxRuntime.jsx(
      MantineContext.Provider,
      {
        value: {
          colorScheme,
          setColorScheme,
          clearColorScheme,
          getRootElement,
          classNamesPrefix,
          getStyleNonce,
          cssVariablesResolver,
          cssVariablesSelector,
          withStaticClasses,
          stylesTransform
        },
        children:  jsxRuntime.jsxs(MantineThemeProvider, { theme, children: [
          withCssVariables &&  jsxRuntime.jsx(
            MantineCssVariables,
            {
              cssVariablesSelector,
              deduplicateCssVariables
            }
          ),
          withGlobalClasses &&  jsxRuntime.jsx(MantineClasses, {}),
          children
        ] })
      }
    );
  }
  MantineProvider.displayName = "@mantine/core/MantineProvider";
  function HeadlessMantineProvider({ children, theme }) {
    return  jsxRuntime.jsx(
      MantineContext.Provider,
      {
        value: {
          colorScheme: "auto",
          setColorScheme: () => {
          },
          clearColorScheme: () => {
          },
          getRootElement: () => document.documentElement,
          classNamesPrefix: "mantine",
          cssVariablesSelector: ":root",
          withStaticClasses: false,
          headless: true
        },
        children:  jsxRuntime.jsx(MantineThemeProvider, { theme, children })
      }
    );
  }
  HeadlessMantineProvider.displayName = "@mantine/core/HeadlessMantineProvider";
  function useResolvedStylesApi({
    classNames,
    styles,
    props,
    stylesCtx
  }) {
    const theme = useMantineTheme();
    return {
      resolvedClassNames: resolveClassNames({
        theme,
        classNames,
        props,
        stylesCtx: stylesCtx || void 0
      }),
      resolvedStyles: resolveStyles({
        theme,
        styles,
        props,
        stylesCtx: stylesCtx || void 0
      })
    };
  }
  var FOCUS_CLASS_NAMES = {
    always: "mantine-focus-always",
    auto: "mantine-focus-auto",
    never: "mantine-focus-never"
  };
  function getGlobalClassNames({ theme, options, unstyled }) {
    return clsx_default(
      options?.focusable && !unstyled && (theme.focusClassName || FOCUS_CLASS_NAMES[theme.focusRing]),
      options?.active && !unstyled && theme.activeClassName
    );
  }
  function getOptionsClassNames({
    selector,
    stylesCtx,
    options,
    props,
    theme
  }) {
    return resolveClassNames({
      theme,
      classNames: options?.classNames,
      props: options?.props || props,
      stylesCtx
    })[selector];
  }
  function getResolvedClassNames({
    selector,
    stylesCtx,
    theme,
    classNames,
    props
  }) {
    return resolveClassNames({ theme, classNames, props, stylesCtx })[selector];
  }
  function getRootClassName({ rootSelector, selector, className }) {
    return rootSelector === selector ? className : void 0;
  }
  function getSelectorClassName({ selector, classes: classes87, unstyled }) {
    return unstyled ? void 0 : classes87[selector];
  }
  function getStaticClassNames({
    themeName,
    classNamesPrefix,
    selector,
    withStaticClass
  }) {
    if (withStaticClass === false) {
      return [];
    }
    return themeName.map((n) => `${classNamesPrefix}-${n}-${selector}`);
  }
  function getThemeClassNames({
    themeName,
    theme,
    selector,
    props,
    stylesCtx
  }) {
    return themeName.map(
      (n) => resolveClassNames({
        theme,
        classNames: theme.components[n]?.classNames,
        props,
        stylesCtx
      })?.[selector]
    );
  }
  function getVariantClassName({
    options,
    classes: classes87,
    selector,
    unstyled
  }) {
    return options?.variant && !unstyled ? classes87[`${selector}--${options.variant}`] : void 0;
  }
  function getClassName({
    theme,
    options,
    themeName,
    selector,
    classNamesPrefix,
    classNames,
    classes: classes87,
    unstyled,
    className,
    rootSelector,
    props,
    stylesCtx,
    withStaticClasses,
    headless,
    transformedStyles
  }) {
    return clsx_default(
      getGlobalClassNames({ theme, options, unstyled: unstyled || headless }),
      getThemeClassNames({ theme, themeName, selector, props, stylesCtx }),
      getVariantClassName({ options, classes: classes87, selector, unstyled }),
      getResolvedClassNames({ selector, stylesCtx, theme, classNames, props }),
      getResolvedClassNames({ selector, stylesCtx, theme, classNames: transformedStyles, props }),
      getOptionsClassNames({ selector, stylesCtx, options, props, theme }),
      getRootClassName({ rootSelector, selector, className }),
      getSelectorClassName({ selector, classes: classes87, unstyled: unstyled || headless }),
      withStaticClasses && !headless && getStaticClassNames({
        themeName,
        classNamesPrefix,
        selector,
        withStaticClass: options?.withStaticClass
      }),
      options?.className
    );
  }
  function getThemeStyles({
    theme,
    themeName,
    props,
    stylesCtx,
    selector
  }) {
    return themeName.map(
      (n) => resolveStyles({
        theme,
        styles: theme.components[n]?.styles,
        props,
        stylesCtx
      })[selector]
    ).reduce((acc, val) => ({ ...acc, ...val }), {});
  }
  function resolveStyle({ style, theme }) {
    if (Array.isArray(style)) {
      return [...style].reduce(
        (acc, item) => ({ ...acc, ...resolveStyle({ style: item, theme }) }),
        {}
      );
    }
    if (typeof style === "function") {
      return style(theme);
    }
    if (style == null) {
      return {};
    }
    return style;
  }
  function mergeVars(vars) {
    return vars.reduce((acc, current) => {
      if (current) {
        Object.keys(current).forEach((key) => {
          acc[key] = { ...acc[key], ...filterProps(current[key]) };
        });
      }
      return acc;
    }, {});
  }
  function resolveVars({
    vars,
    varsResolver: varsResolver90,
    theme,
    props,
    stylesCtx,
    selector,
    themeName,
    headless
  }) {
    return mergeVars([
      headless ? {} : varsResolver90?.(theme, props, stylesCtx),
      ...themeName.map((name) => theme.components?.[name]?.vars?.(theme, props, stylesCtx)),
      vars?.(theme, props, stylesCtx)
    ])?.[selector];
  }
  function getStyle({
    theme,
    themeName,
    selector,
    options,
    props,
    stylesCtx,
    rootSelector,
    styles,
    style,
    vars,
    varsResolver: varsResolver90,
    headless,
    withStylesTransform
  }) {
    return {
      ...!withStylesTransform && getThemeStyles({ theme, themeName, props, stylesCtx, selector }),
      ...!withStylesTransform && resolveStyles({ theme, styles, props, stylesCtx })[selector],
      ...!withStylesTransform && resolveStyles({ theme, styles: options?.styles, props: options?.props || props, stylesCtx })[selector],
      ...resolveVars({ theme, props, stylesCtx, vars, varsResolver: varsResolver90, selector, themeName, headless }),
      ...rootSelector === selector ? resolveStyle({ style, theme }) : null,
      ...resolveStyle({ style: options?.style, theme })
    };
  }
  function useStylesTransform({ props, stylesCtx, themeName }) {
    const theme = useMantineTheme();
    const stylesTransform = useMantineStylesTransform()?.();
    const getTransformedStyles = (styles) => {
      if (!stylesTransform) {
        return [];
      }
      const transformedStyles = styles.map(
        (style) => stylesTransform(style, { props, theme, ctx: stylesCtx })
      );
      return [
        ...transformedStyles,
        ...themeName.map(
          (n) => stylesTransform(theme.components[n]?.styles, { props, theme, ctx: stylesCtx })
        )
      ].filter(Boolean);
    };
    return {
      getTransformedStyles,
      withStylesTransform: !!stylesTransform
    };
  }
  function useStyles({
    name,
    classes: classes87,
    props,
    stylesCtx,
    className,
    style,
    rootSelector = "root",
    unstyled,
    classNames,
    styles,
    vars,
    varsResolver: varsResolver90
  }) {
    const theme = useMantineTheme();
    const classNamesPrefix = useMantineClassNamesPrefix();
    const withStaticClasses = useMantineWithStaticClasses();
    const headless = useMantineIsHeadless();
    const themeName = (Array.isArray(name) ? name : [name]).filter((n) => n);
    const { withStylesTransform, getTransformedStyles } = useStylesTransform({
      props,
      stylesCtx,
      themeName
    });
    return (selector, options) => ({
      className: getClassName({
        theme,
        options,
        themeName,
        selector,
        classNamesPrefix,
        classNames,
        classes: classes87,
        unstyled,
        className,
        rootSelector,
        props,
        stylesCtx,
        withStaticClasses,
        headless,
        transformedStyles: getTransformedStyles([options?.styles, styles])
      }),
      style: getStyle({
        theme,
        themeName,
        selector,
        options,
        props,
        stylesCtx,
        rootSelector,
        styles,
        style,
        vars,
        varsResolver: varsResolver90,
        headless,
        withStylesTransform
      })
    });
  }
  function lighten(color, alpha2) {
    if (color.startsWith("var(")) {
      return `color-mix(in srgb, ${color}, white ${alpha2 * 100}%)`;
    }
    const { r: r2, g, b, a } = toRgba(color);
    const light = (input) => Math.round(input + (255 - input) * alpha2);
    return `rgba(${light(r2)}, ${light(g)}, ${light(b)}, ${a})`;
  }
  function getAutoContrastValue(autoContrast, theme) {
    return typeof autoContrast === "boolean" ? autoContrast : theme.autoContrast;
  }
  function disableTransition(nonce) {
    const style = document.createElement("style");
    style.setAttribute("data-mantine-styles", "inline");
    style.innerHTML = "*, *::before, *::after {transition: none !important;}";
    style.setAttribute("data-mantine-disable-transition", "true");
    nonce && style.setAttribute("nonce", nonce);
    document.head.appendChild(style);
    const clear = () => document.querySelectorAll("[data-mantine-disable-transition]").forEach((element) => element.remove());
    return clear;
  }
  function useMantineColorScheme({ keepTransitions } = {}) {
    const clearStylesRef = React10.useRef(noop);
    const timeoutRef = React10.useRef(-1);
    const ctx = React10.useContext(MantineContext);
    const nonce = useMantineStyleNonce();
    const nonceValue = React10.useRef(nonce?.());
    if (!ctx) {
      throw new Error("[@mantine/core] MantineProvider was not found in tree");
    }
    const setColorScheme = (value) => {
      ctx.setColorScheme(value);
      clearStylesRef.current = keepTransitions ? () => {
      } : disableTransition(nonceValue.current);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        clearStylesRef.current?.();
      }, 10);
    };
    const clearColorScheme = () => {
      ctx.clearColorScheme();
      clearStylesRef.current = keepTransitions ? () => {
      } : disableTransition(nonceValue.current);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        clearStylesRef.current?.();
      }, 10);
    };
    const osColorScheme = hooks.useColorScheme("light", { getInitialValueInEffect: false });
    const computedColorScheme = ctx.colorScheme === "auto" ? osColorScheme : ctx.colorScheme;
    const toggleColorScheme = React10.useCallback(
      () => setColorScheme(computedColorScheme === "light" ? "dark" : "light"),
      [setColorScheme, computedColorScheme]
    );
    React10.useEffect(
      () => () => {
        clearStylesRef.current?.();
        window.clearTimeout(timeoutRef.current);
      },
      []
    );
    return {
      colorScheme: ctx.colorScheme,
      setColorScheme,
      clearColorScheme,
      toggleColorScheme
    };
  }
  function useComputedColorScheme(defaultValue, options = { getInitialValueInEffect: true }) {
    const osColorScheme = hooks.useColorScheme(defaultValue, options);
    const { colorScheme } = useMantineColorScheme();
    return colorScheme === "auto" ? osColorScheme : colorScheme;
  }
  var getScript = ({
    defaultColorScheme,
    localStorageKey,
    forceColorScheme
  }) => forceColorScheme ? `document.documentElement.setAttribute("data-mantine-color-scheme", '${forceColorScheme}');` : `try {
  var _colorScheme = window.localStorage.getItem("${localStorageKey}");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "${defaultColorScheme}";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
} catch (e) {}
`;
  function ColorSchemeScript({
    defaultColorScheme = "light",
    localStorageKey = "mantine-color-scheme-value",
    forceColorScheme,
    ...others
  }) {
    const _defaultColorScheme = ["light", "dark", "auto"].includes(defaultColorScheme) ? defaultColorScheme : "light";
    return  jsxRuntime.jsx(
      "script",
      {
        ...others,
        "data-mantine-script": true,
        dangerouslySetInnerHTML: {
          __html: getScript({
            defaultColorScheme: _defaultColorScheme,
            localStorageKey,
            forceColorScheme
          })
        }
      }
    );
  }
  function useProps(component, defaultProps184, props) {
    const theme = useMantineTheme();
    const contextPropsPayload = theme.components[component]?.defaultProps;
    const contextProps = typeof contextPropsPayload === "function" ? contextPropsPayload(theme) : contextPropsPayload;
    return { ...defaultProps184, ...contextProps, ...filterProps(props) };
  }
  function createTheme(theme) {
    return theme;
  }
  function mergeThemeOverrides(...overrides) {
    return overrides.reduce((acc, override) => deepMerge(acc, override), {});
  }
  var BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];
  function getFirstMatchingValue(value, biggestMatch) {
    if (!biggestMatch) {
      return value.base;
    }
    let index3 = BREAKPOINTS.indexOf(biggestMatch);
    while (index3 >= 0) {
      if (BREAKPOINTS[index3] in value) {
        return value[BREAKPOINTS[index3]];
      }
      index3 -= 1;
    }
    return value.base;
  }
  function getFirstMatchingBreakpoint(matches) {
    return matches.findLastIndex((v) => v);
  }
  function useMatches(payload, options) {
    const theme = useMantineTheme();
    const xsMatches = hooks.useMediaQuery(`(min-width: ${theme.breakpoints.xs})`, false, options);
    const smMatches = hooks.useMediaQuery(`(min-width: ${theme.breakpoints.sm})`, false, options);
    const mdMatches = hooks.useMediaQuery(`(min-width: ${theme.breakpoints.md})`, false, options);
    const lgMatches = hooks.useMediaQuery(`(min-width: ${theme.breakpoints.lg})`, false, options);
    const xlMatches = hooks.useMediaQuery(`(min-width: ${theme.breakpoints.xl})`, false, options);
    const breakpoints = [xsMatches, smMatches, mdMatches, lgMatches, xlMatches];
    const firstMatchingBreakpointIndex = getFirstMatchingBreakpoint(breakpoints);
    return getFirstMatchingValue(payload, BREAKPOINTS[firstMatchingBreakpointIndex]);
  }
  var mantineHtmlProps = {
    suppressHydrationWarning: true,
    "data-mantine-color-scheme": "light"
  };
  function cssObjectToString(css) {
    return keys(css).reduce(
      (acc, rule) => css[rule] !== void 0 ? `${acc}${camelToKebabCase(rule)}:${css[rule]};` : acc,
      ""
    ).trim();
  }
  function stylesToString({ selector, styles, media, container }) {
    const baseStyles = styles ? cssObjectToString(styles) : "";
    const mediaQueryStyles = !Array.isArray(media) ? [] : media.map((item) => `@media${item.query}{${selector}{${cssObjectToString(item.styles)}}}`);
    const containerStyles = !Array.isArray(container) ? [] : container.map(
      (item) => `@container ${item.query}{${selector}{${cssObjectToString(item.styles)}}}`
    );
    return `${baseStyles ? `${selector}{${baseStyles}}` : ""}${mediaQueryStyles.join("")}${containerStyles.join("")}`.trim();
  }
  function InlineStyles(props) {
    const nonce = useMantineStyleNonce();
    return  jsxRuntime.jsx(
      "style",
      {
        "data-mantine-styles": "inline",
        nonce: nonce?.(),
        dangerouslySetInnerHTML: { __html: stylesToString(props) }
      }
    );
  }
  function extractStyleProps(others) {
    const {
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      me,
      ms,
      p,
      px: px2,
      py,
      pt,
      pb,
      pl,
      pr,
      pe,
      ps,
      bd,
      bg,
      c,
      opacity,
      ff,
      fz,
      fw,
      lts,
      ta,
      lh,
      fs,
      tt,
      td,
      w,
      miw,
      maw,
      h,
      mih,
      mah,
      bgsz,
      bgp,
      bgr,
      bga,
      pos,
      top,
      left,
      bottom,
      right,
      inset,
      display,
      flex,
      hiddenFrom,
      visibleFrom,
      lightHidden,
      darkHidden,
      sx,
      ...rest
    } = others;
    const styleProps = filterProps({
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      me,
      ms,
      p,
      px: px2,
      py,
      pt,
      pb,
      pl,
      pr,
      pe,
      ps,
      bd,
      bg,
      c,
      opacity,
      ff,
      fz,
      fw,
      lts,
      ta,
      lh,
      fs,
      tt,
      td,
      w,
      miw,
      maw,
      h,
      mih,
      mah,
      bgsz,
      bgp,
      bgr,
      bga,
      pos,
      top,
      left,
      bottom,
      right,
      inset,
      display,
      flex,
      hiddenFrom,
      visibleFrom,
      lightHidden,
      darkHidden,
      sx
    });
    return { styleProps, rest };
  }
  var STYlE_PROPS_DATA = {
    m: { type: "spacing", property: "margin" },
    mt: { type: "spacing", property: "marginTop" },
    mb: { type: "spacing", property: "marginBottom" },
    ml: { type: "spacing", property: "marginLeft" },
    mr: { type: "spacing", property: "marginRight" },
    ms: { type: "spacing", property: "marginInlineStart" },
    me: { type: "spacing", property: "marginInlineEnd" },
    mx: { type: "spacing", property: "marginInline" },
    my: { type: "spacing", property: "marginBlock" },
    p: { type: "spacing", property: "padding" },
    pt: { type: "spacing", property: "paddingTop" },
    pb: { type: "spacing", property: "paddingBottom" },
    pl: { type: "spacing", property: "paddingLeft" },
    pr: { type: "spacing", property: "paddingRight" },
    ps: { type: "spacing", property: "paddingInlineStart" },
    pe: { type: "spacing", property: "paddingInlineEnd" },
    px: { type: "spacing", property: "paddingInline" },
    py: { type: "spacing", property: "paddingBlock" },
    bd: { type: "border", property: "border" },
    bg: { type: "color", property: "background" },
    c: { type: "textColor", property: "color" },
    opacity: { type: "identity", property: "opacity" },
    ff: { type: "fontFamily", property: "fontFamily" },
    fz: { type: "fontSize", property: "fontSize" },
    fw: { type: "identity", property: "fontWeight" },
    lts: { type: "size", property: "letterSpacing" },
    ta: { type: "identity", property: "textAlign" },
    lh: { type: "lineHeight", property: "lineHeight" },
    fs: { type: "identity", property: "fontStyle" },
    tt: { type: "identity", property: "textTransform" },
    td: { type: "identity", property: "textDecoration" },
    w: { type: "spacing", property: "width" },
    miw: { type: "spacing", property: "minWidth" },
    maw: { type: "spacing", property: "maxWidth" },
    h: { type: "spacing", property: "height" },
    mih: { type: "spacing", property: "minHeight" },
    mah: { type: "spacing", property: "maxHeight" },
    bgsz: { type: "size", property: "backgroundSize" },
    bgp: { type: "identity", property: "backgroundPosition" },
    bgr: { type: "identity", property: "backgroundRepeat" },
    bga: { type: "identity", property: "backgroundAttachment" },
    pos: { type: "identity", property: "position" },
    top: { type: "size", property: "top" },
    left: { type: "size", property: "left" },
    bottom: { type: "size", property: "bottom" },
    right: { type: "size", property: "right" },
    inset: { type: "size", property: "inset" },
    display: { type: "identity", property: "display" },
    flex: { type: "identity", property: "flex" }
  };
  function colorResolver(color, theme) {
    const parsedColor = parseThemeColor({ color, theme });
    if (parsedColor.color === "dimmed") {
      return "var(--mantine-color-dimmed)";
    }
    if (parsedColor.color === "bright") {
      return "var(--mantine-color-bright)";
    }
    return parsedColor.variable ? `var(${parsedColor.variable})` : parsedColor.color;
  }
  function textColorResolver(color, theme) {
    const parsedColor = parseThemeColor({ color, theme });
    if (parsedColor.isThemeColor && parsedColor.shade === void 0) {
      return `var(--mantine-color-${parsedColor.color}-text)`;
    }
    return colorResolver(color, theme);
  }
  function borderResolver(value, theme) {
    if (typeof value === "number") {
      return rem(value);
    }
    if (typeof value === "string") {
      const [size4, style, ...colorTuple] = value.split(" ").filter((val) => val.trim() !== "");
      let result = `${rem(size4)}`;
      style && (result += ` ${style}`);
      colorTuple.length > 0 && (result += ` ${colorResolver(colorTuple.join(" "), theme)}`);
      return result.trim();
    }
    return value;
  }
  var values = {
    text: "var(--mantine-font-family)",
    mono: "var(--mantine-font-family-monospace)",
    monospace: "var(--mantine-font-family-monospace)",
    heading: "var(--mantine-font-family-headings)",
    headings: "var(--mantine-font-family-headings)"
  };
  function fontFamilyResolver(fontFamily) {
    if (typeof fontFamily === "string" && fontFamily in values) {
      return values[fontFamily];
    }
    return fontFamily;
  }
  var headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
  function fontSizeResolver(value, theme) {
    if (typeof value === "string" && value in theme.fontSizes) {
      return `var(--mantine-font-size-${value})`;
    }
    if (typeof value === "string" && headings.includes(value)) {
      return `var(--mantine-${value}-font-size)`;
    }
    if (typeof value === "number") {
      return rem(value);
    }
    if (typeof value === "string") {
      return rem(value);
    }
    return value;
  }
  function identityResolver(value) {
    return value;
  }
  var headings2 = ["h1", "h2", "h3", "h4", "h5", "h6"];
  function lineHeightResolver(value, theme) {
    if (typeof value === "string" && value in theme.lineHeights) {
      return `var(--mantine-line-height-${value})`;
    }
    if (typeof value === "string" && headings2.includes(value)) {
      return `var(--mantine-${value}-line-height)`;
    }
    return value;
  }
  function sizeResolver(value) {
    if (typeof value === "number") {
      return rem(value);
    }
    return value;
  }
  function spacingResolver(value, theme) {
    if (typeof value === "number") {
      return rem(value);
    }
    if (typeof value === "string") {
      const mod = value.replace("-", "");
      if (!(mod in theme.spacing)) {
        return rem(value);
      }
      const variable = `--mantine-spacing-${mod}`;
      return value.startsWith("-") ? `calc(var(${variable}) * -1)` : `var(${variable})`;
    }
    return value;
  }
  var resolvers = {
    color: colorResolver,
    textColor: textColorResolver,
    fontSize: fontSizeResolver,
    spacing: spacingResolver,
    identity: identityResolver,
    size: sizeResolver,
    lineHeight: lineHeightResolver,
    fontFamily: fontFamilyResolver,
    border: borderResolver
  };
  function replaceMediaQuery(query) {
    return query.replace("(min-width: ", "").replace("em)", "");
  }
  function sortMediaQueries({
    media,
    ...props
  }) {
    const breakpoints = Object.keys(media);
    const sortedMedia = breakpoints.sort((a, b) => Number(replaceMediaQuery(a)) - Number(replaceMediaQuery(b))).map((query) => ({ query, styles: media[query] }));
    return { ...props, media: sortedMedia };
  }
  function hasResponsiveStyles(styleProp) {
    if (typeof styleProp !== "object" || styleProp === null) {
      return false;
    }
    const breakpoints = Object.keys(styleProp);
    if (breakpoints.length === 1 && breakpoints[0] === "base") {
      return false;
    }
    return true;
  }
  function getBaseValue2(value) {
    if (typeof value === "object" && value !== null) {
      if ("base" in value) {
        return value.base;
      }
      return void 0;
    }
    return value;
  }
  function getBreakpointKeys(value) {
    if (typeof value === "object" && value !== null) {
      return keys(value).filter((key) => key !== "base");
    }
    return [];
  }
  function getBreakpointValue2(value, breakpoint) {
    if (typeof value === "object" && value !== null && breakpoint in value) {
      return value[breakpoint];
    }
    return value;
  }
  function parseStyleProps({
    styleProps,
    data,
    theme
  }) {
    return sortMediaQueries(
      keys(styleProps).reduce(
        (acc, styleProp) => {
          if (styleProp === "hiddenFrom" || styleProp === "visibleFrom" || styleProp === "sx") {
            return acc;
          }
          const propertyData = data[styleProp];
          const properties = Array.isArray(propertyData.property) ? propertyData.property : [propertyData.property];
          const baseValue = getBaseValue2(styleProps[styleProp]);
          if (!hasResponsiveStyles(styleProps[styleProp])) {
            properties.forEach((property) => {
              acc.inlineStyles[property] = resolvers[propertyData.type](baseValue, theme);
            });
            return acc;
          }
          acc.hasResponsiveStyles = true;
          const breakpoints = getBreakpointKeys(styleProps[styleProp]);
          properties.forEach((property) => {
            if (baseValue) {
              acc.styles[property] = resolvers[propertyData.type](baseValue, theme);
            }
            breakpoints.forEach((breakpoint) => {
              const bp = `(min-width: ${theme.breakpoints[breakpoint]})`;
              acc.media[bp] = {
                ...acc.media[bp],
                [property]: resolvers[propertyData.type](
                  getBreakpointValue2(styleProps[styleProp], breakpoint),
                  theme
                )
              };
            });
          });
          return acc;
        },
        {
          hasResponsiveStyles: false,
          styles: {},
          inlineStyles: {},
          media: {}
        }
      )
    );
  }
  function useRandomClassName() {
    const id = React10.useId().replace(/:/g, "");
    return `__m__-${id}`;
  }
  function getStyleObject(style, theme) {
    if (Array.isArray(style)) {
      return [...style].reduce(
        (acc, item) => ({ ...acc, ...getStyleObject(item, theme) }),
        {}
      );
    }
    if (typeof style === "function") {
      return style(theme);
    }
    if (style == null) {
      return {};
    }
    return style;
  }
  function createPolymorphicComponent(component) {
    return component;
  }
  function transformModKey(key) {
    return key.startsWith("data-") ? key : `data-${key}`;
  }
  function getMod(props) {
    return Object.keys(props).reduce((acc, key) => {
      const value = props[key];
      if (value === void 0 || value === "" || value === false || value === null) {
        return acc;
      }
      acc[transformModKey(key)] = props[key];
      return acc;
    }, {});
  }
  function getBoxMod(mod) {
    if (!mod) {
      return null;
    }
    if (typeof mod === "string") {
      return { [transformModKey(mod)]: true };
    }
    if (Array.isArray(mod)) {
      return [...mod].reduce(
        (acc, value) => ({ ...acc, ...getBoxMod(value) }),
        {}
      );
    }
    return getMod(mod);
  }
  function mergeStyles(styles, theme) {
    if (Array.isArray(styles)) {
      return [...styles].reduce(
        (acc, item) => ({ ...acc, ...mergeStyles(item, theme) }),
        {}
      );
    }
    if (typeof styles === "function") {
      return styles(theme);
    }
    if (styles == null) {
      return {};
    }
    return styles;
  }
  function getBoxStyle({
    theme,
    style,
    vars,
    styleProps
  }) {
    const _style = mergeStyles(style, theme);
    const _vars = mergeStyles(vars, theme);
    return { ..._style, ..._vars, ...styleProps };
  }
  var _Box = React10.forwardRef(
    ({
      component,
      style,
      __vars,
      className,
      variant,
      mod,
      size: size4,
      hiddenFrom,
      visibleFrom,
      lightHidden,
      darkHidden,
      renderRoot,
      __size,
      ...others
    }, ref) => {
      const theme = useMantineTheme();
      const Element2 = component || "div";
      const { styleProps, rest } = extractStyleProps(others);
      const useSxTransform = useMantineSxTransform();
      const transformedSx = useSxTransform?.()?.(styleProps.sx);
      const responsiveClassName = useRandomClassName();
      const parsedStyleProps = parseStyleProps({
        styleProps,
        theme,
        data: STYlE_PROPS_DATA
      });
      const props = {
        ref,
        style: getBoxStyle({
          theme,
          style,
          vars: __vars,
          styleProps: parsedStyleProps.inlineStyles
        }),
        className: clsx_default(className, transformedSx, {
          [responsiveClassName]: parsedStyleProps.hasResponsiveStyles,
          "mantine-light-hidden": lightHidden,
          "mantine-dark-hidden": darkHidden,
          [`mantine-hidden-from-${hiddenFrom}`]: hiddenFrom,
          [`mantine-visible-from-${visibleFrom}`]: visibleFrom
        }),
        "data-variant": variant,
        "data-size": isNumberLike(size4) ? void 0 : size4 || void 0,
        size: __size,
        ...getBoxMod(mod),
        ...rest
      };
      return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        parsedStyleProps.hasResponsiveStyles &&  jsxRuntime.jsx(
          InlineStyles,
          {
            selector: `.${responsiveClassName}`,
            styles: parsedStyleProps.styles,
            media: parsedStyleProps.media
          }
        ),
        typeof renderRoot === "function" ? renderRoot(props) :  jsxRuntime.jsx(Element2, { ...props })
      ] });
    }
  );
  _Box.displayName = "@mantine/core/Box";
  var Box = createPolymorphicComponent(_Box);
  function identity(value) {
    return value;
  }
  function getWithProps(Component) {
    const _Component = Component;
    return (fixedProps) => {
      const Extended = React10.forwardRef((props, ref) =>  jsxRuntime.jsx(_Component, { ...fixedProps, ...props, ref }));
      Extended.extend = _Component.extend;
      Extended.displayName = `WithProps(${_Component.displayName})`;
      return Extended;
    };
  }
  function factory(ui) {
    const Component = React10.forwardRef(ui);
    Component.extend = identity;
    Component.withProps = (fixedProps) => {
      const Extended = React10.forwardRef((props, ref) =>  jsxRuntime.jsx(Component, { ...fixedProps, ...props, ref }));
      Extended.extend = Component.extend;
      Extended.displayName = `WithProps(${Component.displayName})`;
      return Extended;
    };
    return Component;
  }
  function polymorphicFactory(ui) {
    const Component = React10.forwardRef(ui);
    Component.withProps = (fixedProps) => {
      const Extended = React10.forwardRef((props, ref) =>  jsxRuntime.jsx(Component, { ...fixedProps, ...props, ref }));
      Extended.extend = Component.extend;
      Extended.displayName = `WithProps(${Component.displayName})`;
      return Extended;
    };
    Component.extend = identity;
    return Component;
  }
  var DirectionContext = React10.createContext({
    dir: "ltr",
    toggleDirection: () => {
    },
    setDirection: () => {
    }
  });
  function useDirection() {
    return React10.useContext(DirectionContext);
  }
  function DirectionProvider({
    children,
    initialDirection = "ltr",
    detectDirection = true
  }) {
    const [dir, setDir] = React10.useState(initialDirection);
    const setDirection = (direction) => {
      setDir(direction);
      document.documentElement.setAttribute("dir", direction);
    };
    const toggleDirection = () => setDirection(dir === "ltr" ? "rtl" : "ltr");
    hooks.useIsomorphicEffect(() => {
      if (detectDirection) {
        const direction = document.documentElement.getAttribute("dir");
        if (direction === "rtl" || direction === "ltr") {
          setDirection(direction);
        }
      }
    }, []);
    return  jsxRuntime.jsx(DirectionContext.Provider, { value: { dir, toggleDirection, setDirection }, children });
  }
  function getAutoHeightDuration(height) {
    if (!height || typeof height === "string") {
      return 0;
    }
    const constant = height / 36;
    return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
  }
  function getElementHeight(el) {
    return el?.current ? el.current.scrollHeight : "auto";
  }
  var raf = typeof window !== "undefined" && window.requestAnimationFrame;
  function useCollapse({
    transitionDuration,
    transitionTimingFunction = "ease",
    onTransitionEnd = () => {
    },
    opened
  }) {
    const el = React10.useRef(null);
    const collapsedHeight = 0;
    const collapsedStyles = {
      display: "none",
      height: 0,
      overflow: "hidden"
    };
    const [styles, setStylesRaw] = React10.useState(opened ? {} : collapsedStyles);
    const setStyles = (newStyles) => {
      ReactDOM.flushSync(() => setStylesRaw(newStyles));
    };
    const mergeStyles2 = (newStyles) => {
      setStyles((oldStyles) => ({ ...oldStyles, ...newStyles }));
    };
    function getTransitionStyles2(height) {
      const _duration = transitionDuration || getAutoHeightDuration(height);
      return {
        transition: `height ${_duration}ms ${transitionTimingFunction}, opacity ${_duration}ms ${transitionTimingFunction}`
      };
    }
    hooks.useDidUpdate(() => {
      if (typeof raf === "function") {
        if (opened) {
          raf(() => {
            mergeStyles2({ willChange: "height", display: "block", overflow: "hidden" });
            raf(() => {
              const height = getElementHeight(el);
              mergeStyles2({ ...getTransitionStyles2(height), height });
            });
          });
        } else {
          raf(() => {
            const height = getElementHeight(el);
            mergeStyles2({ ...getTransitionStyles2(height), willChange: "height", height });
            raf(() => mergeStyles2({ height: collapsedHeight, overflow: "hidden" }));
          });
        }
      }
    }, [opened]);
    const handleTransitionEnd = (e) => {
      if (e.target !== el.current || e.propertyName !== "height") {
        return;
      }
      if (opened) {
        const height = getElementHeight(el);
        if (height === styles.height) {
          setStyles({});
        } else {
          mergeStyles2({ height });
        }
        onTransitionEnd();
      } else if (styles.height === collapsedHeight) {
        setStyles(collapsedStyles);
        onTransitionEnd();
      }
    };
    function getCollapseProps({ style = {}, refKey = "ref", ...rest } = {}) {
      const theirRef = rest[refKey];
      return {
        "aria-hidden": !opened,
        ...rest,
        [refKey]: hooks.mergeRefs(el, theirRef),
        onTransitionEnd: handleTransitionEnd,
        style: { boxSizing: "border-box", ...style, ...styles }
      };
    }
    return getCollapseProps;
  }
  var defaultProps = {
    transitionDuration: 200,
    transitionTimingFunction: "ease",
    animateOpacity: true
  };
  var Collapse = factory((props, ref) => {
    const {
      children,
      in: opened,
      transitionDuration,
      transitionTimingFunction,
      style,
      onTransitionEnd,
      animateOpacity,
      ...others
    } = useProps("Collapse", defaultProps, props);
    const theme = useMantineTheme();
    const shouldReduceMotion = hooks.useReducedMotion();
    const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
    const duration = reduceMotion ? 0 : transitionDuration;
    const getCollapseProps = useCollapse({
      opened,
      transitionDuration: duration,
      transitionTimingFunction,
      onTransitionEnd
    });
    if (duration === 0) {
      return opened ?  jsxRuntime.jsx(Box, { ...others, children }) : null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        ...getCollapseProps({
          style: {
            opacity: opened || !animateOpacity ? 1 : 0,
            transition: animateOpacity ? `opacity ${duration}ms ${transitionTimingFunction}` : "none",
            ...getStyleObject(style, theme)
          },
          ref,
          ...others
        }),
        children
      }
    );
  });
  Collapse.displayName = "@mantine/core/Collapse";
  var [ScrollAreaProvider, useScrollAreaContext] = createSafeContext(
    "ScrollArea.Root component was not found in tree"
  );
  function useResizeObserver(element, onResize) {
    const handleResize = hooks.useCallbackRef(onResize);
    hooks.useIsomorphicEffect(() => {
      let rAF = 0;
      if (element) {
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(rAF);
          rAF = window.requestAnimationFrame(handleResize);
        });
        resizeObserver.observe(element);
        return () => {
          window.cancelAnimationFrame(rAF);
          resizeObserver.unobserve(element);
        };
      }
      return void 0;
    }, [element, handleResize]);
  }
  var Corner = React10.forwardRef((props, ref) => {
    const { style, ...others } = props;
    const ctx = useScrollAreaContext();
    const [width, setWidth] = React10.useState(0);
    const [height, setHeight] = React10.useState(0);
    const hasSize = Boolean(width && height);
    useResizeObserver(ctx.scrollbarX, () => {
      const h = ctx.scrollbarX?.offsetHeight || 0;
      ctx.onCornerHeightChange(h);
      setHeight(h);
    });
    useResizeObserver(ctx.scrollbarY, () => {
      const w = ctx.scrollbarY?.offsetWidth || 0;
      ctx.onCornerWidthChange(w);
      setWidth(w);
    });
    return hasSize ?  jsxRuntime.jsx("div", { ...others, ref, style: { ...style, width, height } }) : null;
  });
  var ScrollAreaCorner = React10.forwardRef((props, ref) => {
    const ctx = useScrollAreaContext();
    const hasBothScrollbarsVisible = Boolean(ctx.scrollbarX && ctx.scrollbarY);
    const hasCorner = ctx.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ?  jsxRuntime.jsx(Corner, { ...props, ref }) : null;
  });
  var defaultProps2 = {
    scrollHideDelay: 1e3,
    type: "hover"
  };
  var ScrollAreaRoot = React10.forwardRef((_props, ref) => {
    const props = useProps("ScrollAreaRoot", defaultProps2, _props);
    const { type, scrollHideDelay, scrollbars, ...others } = props;
    const [scrollArea, setScrollArea] = React10.useState(null);
    const [viewport, setViewport] = React10.useState(null);
    const [content, setContent] = React10.useState(null);
    const [scrollbarX, setScrollbarX] = React10.useState(null);
    const [scrollbarY, setScrollbarY] = React10.useState(null);
    const [cornerWidth, setCornerWidth] = React10.useState(0);
    const [cornerHeight, setCornerHeight] = React10.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = React10.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = React10.useState(false);
    const rootRef = hooks.useMergedRef(ref, (node) => setScrollArea(node));
    return  jsxRuntime.jsx(
      ScrollAreaProvider,
      {
        value: {
          type,
          scrollHideDelay,
          scrollArea,
          viewport,
          onViewportChange: setViewport,
          content,
          onContentChange: setContent,
          scrollbarX,
          onScrollbarXChange: setScrollbarX,
          scrollbarXEnabled,
          onScrollbarXEnabledChange: setScrollbarXEnabled,
          scrollbarY,
          onScrollbarYChange: setScrollbarY,
          scrollbarYEnabled,
          onScrollbarYEnabledChange: setScrollbarYEnabled,
          onCornerWidthChange: setCornerWidth,
          onCornerHeightChange: setCornerHeight
        },
        children:  jsxRuntime.jsx(
          Box,
          {
            ...others,
            ref: rootRef,
            __vars: {
              "--sa-corner-width": scrollbars !== "xy" ? "0px" : `${cornerWidth}px`,
              "--sa-corner-height": scrollbars !== "xy" ? "0px" : `${cornerHeight}px`
            }
          }
        )
      }
    );
  });
  ScrollAreaRoot.displayName = "@mantine/core/ScrollAreaRoot";
  function getThumbRatio(viewportSize, contentSize) {
    const ratio = viewportSize / contentSize;
    return Number.isNaN(ratio) ? 0 : ratio;
  }
  function getThumbSize(sizes2) {
    const ratio = getThumbRatio(sizes2.viewport, sizes2.content);
    const scrollbarPadding = sizes2.scrollbar.paddingStart + sizes2.scrollbar.paddingEnd;
    const thumbSize = (sizes2.scrollbar.size - scrollbarPadding) * ratio;
    return Math.max(thumbSize, 18);
  }
  function linearScale(input, output) {
    return (value) => {
      if (input[0] === input[1] || output[0] === output[1]) {
        return output[0];
      }
      const ratio = (output[1] - output[0]) / (input[1] - input[0]);
      return output[0] + ratio * (value - input[0]);
    };
  }
  function clamp(value, [min2, max2]) {
    return Math.min(max2, Math.max(min2, value));
  }
  function getThumbOffsetFromScroll(scrollPos, sizes2, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes2);
    const scrollbarPadding = sizes2.scrollbar.paddingStart + sizes2.scrollbar.paddingEnd;
    const scrollbar = sizes2.scrollbar.size - scrollbarPadding;
    const maxScrollPos = sizes2.content - sizes2.viewport;
    const maxThumbPos = scrollbar - thumbSizePx;
    const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
    const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
    return interpolate(scrollWithoutMomentum);
  }
  function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes2, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes2);
    const thumbCenter = thumbSizePx / 2;
    const offset4 = pointerOffset || thumbCenter;
    const thumbOffsetFromEnd = thumbSizePx - offset4;
    const minPointerPos = sizes2.scrollbar.paddingStart + offset4;
    const maxPointerPos = sizes2.scrollbar.size - sizes2.scrollbar.paddingEnd - thumbOffsetFromEnd;
    const maxScrollPos = sizes2.content - sizes2.viewport;
    const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
    return interpolate(pointerPos);
  }
  function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
    return scrollPos > 0 && scrollPos < maxScrollPos;
  }
  function toInt(value) {
    return value ? parseInt(value, 10) : 0;
  }
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return (event) => {
      originalEventHandler?.(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        ourEventHandler?.(event);
      }
    };
  }
  var [ScrollbarProvider, useScrollbarContext] = createSafeContext(
    "ScrollAreaScrollbar was not found in tree"
  );
  var Scrollbar = React10.forwardRef((props, forwardedRef) => {
    const {
      sizes: sizes2,
      hasThumb,
      onThumbChange,
      onThumbPointerUp,
      onThumbPointerDown,
      onThumbPositionChange,
      onDragScroll,
      onWheelScroll,
      onResize,
      ...scrollbarProps
    } = props;
    const context = useScrollAreaContext();
    const [scrollbar, setScrollbar] = React10.useState(null);
    const composeRefs = hooks.useMergedRef(forwardedRef, (node) => setScrollbar(node));
    const rectRef = React10.useRef(null);
    const prevWebkitUserSelectRef = React10.useRef("");
    const { viewport } = context;
    const maxScrollPos = sizes2.content - sizes2.viewport;
    const handleWheelScroll = hooks.useCallbackRef(onWheelScroll);
    const handleThumbPositionChange = hooks.useCallbackRef(onThumbPositionChange);
    const handleResize = hooks.useDebouncedCallback(onResize, 10);
    const handleDragScroll = (event) => {
      if (rectRef.current) {
        const x = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({ x, y });
      }
    };
    React10.useEffect(() => {
      const handleWheel = (event) => {
        const element = event.target;
        const isScrollbarWheel = scrollbar?.contains(element);
        if (isScrollbarWheel) {
          handleWheelScroll(event, maxScrollPos);
        }
      };
      document.addEventListener("wheel", handleWheel, { passive: false });
      return () => document.removeEventListener("wheel", handleWheel, { passive: false });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    React10.useEffect(handleThumbPositionChange, [sizes2, handleThumbPositionChange]);
    useResizeObserver(scrollbar, handleResize);
    useResizeObserver(context.content, handleResize);
    return  jsxRuntime.jsx(
      ScrollbarProvider,
      {
        value: {
          scrollbar,
          hasThumb,
          onThumbChange: hooks.useCallbackRef(onThumbChange),
          onThumbPointerUp: hooks.useCallbackRef(onThumbPointerUp),
          onThumbPositionChange: handleThumbPositionChange,
          onThumbPointerDown: hooks.useCallbackRef(onThumbPointerDown)
        },
        children:  jsxRuntime.jsx(
          "div",
          {
            ...scrollbarProps,
            ref: composeRefs,
            "data-mantine-scrollbar": true,
            style: { position: "absolute", ...scrollbarProps.style },
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              event.preventDefault();
              const mainPointer = 0;
              if (event.button === mainPointer) {
                const element = event.target;
                element.setPointerCapture(event.pointerId);
                rectRef.current = scrollbar.getBoundingClientRect();
                prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
                document.body.style.webkitUserSelect = "none";
                handleDragScroll(event);
              }
            }),
            onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
            onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
              event.preventDefault();
              const element = event.target;
              if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
              }
              document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
              rectRef.current = null;
            })
          }
        )
      }
    );
  });
  var ScrollAreaScrollbarX = React10.forwardRef(
    (props, forwardedRef) => {
      const { sizes: sizes2, onSizesChange, style, ...others } = props;
      const ctx = useScrollAreaContext();
      const [computedStyle, setComputedStyle] = React10.useState();
      const ref = React10.useRef(null);
      const composeRefs = hooks.useMergedRef(forwardedRef, ref, ctx.onScrollbarXChange);
      React10.useEffect(() => {
        if (ref.current) {
          setComputedStyle(getComputedStyle(ref.current));
        }
      }, [ref]);
      return  jsxRuntime.jsx(
        Scrollbar,
        {
          "data-orientation": "horizontal",
          ...others,
          ref: composeRefs,
          sizes: sizes2,
          style: {
            ...style,
            ["--sa-thumb-width"]: `${getThumbSize(sizes2)}px`
          },
          onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
          onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
          onWheelScroll: (event, maxScrollPos) => {
            if (ctx.viewport) {
              const scrollPos = ctx.viewport.scrollLeft + event.deltaX;
              props.onWheelScroll(scrollPos);
              if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
                event.preventDefault();
              }
            }
          },
          onResize: () => {
            if (ref.current && ctx.viewport && computedStyle) {
              onSizesChange({
                content: ctx.viewport.scrollWidth,
                viewport: ctx.viewport.offsetWidth,
                scrollbar: {
                  size: ref.current.clientWidth,
                  paddingStart: toInt(computedStyle.paddingLeft),
                  paddingEnd: toInt(computedStyle.paddingRight)
                }
              });
            }
          }
        }
      );
    }
  );
  ScrollAreaScrollbarX.displayName = "@mantine/core/ScrollAreaScrollbarX";
  var ScrollAreaScrollbarY = React10.forwardRef(
    (props, forwardedRef) => {
      const { sizes: sizes2, onSizesChange, style, ...others } = props;
      const context = useScrollAreaContext();
      const [computedStyle, setComputedStyle] = React10.useState();
      const ref = React10.useRef(null);
      const composeRefs = hooks.useMergedRef(forwardedRef, ref, context.onScrollbarYChange);
      React10.useEffect(() => {
        if (ref.current) {
          setComputedStyle(window.getComputedStyle(ref.current));
        }
      }, []);
      return  jsxRuntime.jsx(
        Scrollbar,
        {
          ...others,
          "data-orientation": "vertical",
          ref: composeRefs,
          sizes: sizes2,
          style: {
            ["--sa-thumb-height"]: `${getThumbSize(sizes2)}px`,
            ...style
          },
          onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
          onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
          onWheelScroll: (event, maxScrollPos) => {
            if (context.viewport) {
              const scrollPos = context.viewport.scrollTop + event.deltaY;
              props.onWheelScroll(scrollPos);
              if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
                event.preventDefault();
              }
            }
          },
          onResize: () => {
            if (ref.current && context.viewport && computedStyle) {
              onSizesChange({
                content: context.viewport.scrollHeight,
                viewport: context.viewport.offsetHeight,
                scrollbar: {
                  size: ref.current.clientHeight,
                  paddingStart: toInt(computedStyle.paddingTop),
                  paddingEnd: toInt(computedStyle.paddingBottom)
                }
              });
            }
          }
        }
      );
    }
  );
  ScrollAreaScrollbarY.displayName = "@mantine/core/ScrollAreaScrollbarY";
  var ScrollAreaScrollbarVisible = React10.forwardRef((props, forwardedRef) => {
    const { orientation = "vertical", ...scrollbarProps } = props;
    const { dir } = useDirection();
    const context = useScrollAreaContext();
    const thumbRef = React10.useRef(null);
    const pointerOffsetRef = React10.useRef(0);
    const [sizes2, setSizes] = React10.useState({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
    });
    const thumbRatio = getThumbRatio(sizes2.viewport, sizes2.content);
    const commonProps = {
      ...scrollbarProps,
      sizes: sizes2,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: (thumb) => {
        thumbRef.current = thumb;
      },
      onThumbPointerUp: () => {
        pointerOffsetRef.current = 0;
      },
      onThumbPointerDown: (pointerPos) => {
        pointerOffsetRef.current = pointerPos;
      }
    };
    const getScrollPosition = (pointerPos, direction) => getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes2, direction);
    if (orientation === "horizontal") {
      return  jsxRuntime.jsx(
        ScrollAreaScrollbarX,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollLeft;
              const offset4 = getThumbOffsetFromScroll(scrollPos, sizes2, dir);
              thumbRef.current.style.transform = `translate3d(${offset4}px, 0, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) {
              context.viewport.scrollLeft = scrollPos;
            }
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) {
              context.viewport.scrollLeft = getScrollPosition(pointerPos, dir);
            }
          }
        }
      );
    }
    if (orientation === "vertical") {
      return  jsxRuntime.jsx(
        ScrollAreaScrollbarY,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollTop;
              const offset4 = getThumbOffsetFromScroll(scrollPos, sizes2);
              if (sizes2.scrollbar.size === 0) {
                thumbRef.current.style.setProperty("--thumb-opacity", "0");
              } else {
                thumbRef.current.style.setProperty("--thumb-opacity", "1");
              }
              thumbRef.current.style.transform = `translate3d(0, ${offset4}px, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) {
              context.viewport.scrollTop = scrollPos;
            }
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) {
              context.viewport.scrollTop = getScrollPosition(pointerPos);
            }
          }
        }
      );
    }
    return null;
  });
  ScrollAreaScrollbarVisible.displayName = "@mantine/core/ScrollAreaScrollbarVisible";
  var ScrollAreaScrollbarAuto = React10.forwardRef(
    (props, ref) => {
      const context = useScrollAreaContext();
      const { forceMount, ...scrollbarProps } = props;
      const [visible, setVisible] = React10.useState(false);
      const isHorizontal = props.orientation === "horizontal";
      const handleResize = hooks.useDebouncedCallback(() => {
        if (context.viewport) {
          const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
          const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
          setVisible(isHorizontal ? isOverflowX : isOverflowY);
        }
      }, 10);
      useResizeObserver(context.viewport, handleResize);
      useResizeObserver(context.content, handleResize);
      if (forceMount || visible) {
        return  jsxRuntime.jsx(
          ScrollAreaScrollbarVisible,
          {
            "data-state": visible ? "visible" : "hidden",
            ...scrollbarProps,
            ref
          }
        );
      }
      return null;
    }
  );
  ScrollAreaScrollbarAuto.displayName = "@mantine/core/ScrollAreaScrollbarAuto";
  var ScrollAreaScrollbarHover = React10.forwardRef(
    (props, ref) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext();
      const [visible, setVisible] = React10.useState(false);
      React10.useEffect(() => {
        const { scrollArea } = context;
        let hideTimer = 0;
        if (scrollArea) {
          const handlePointerEnter = () => {
            window.clearTimeout(hideTimer);
            setVisible(true);
          };
          const handlePointerLeave = () => {
            hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
          };
          scrollArea.addEventListener("pointerenter", handlePointerEnter);
          scrollArea.addEventListener("pointerleave", handlePointerLeave);
          return () => {
            window.clearTimeout(hideTimer);
            scrollArea.removeEventListener("pointerenter", handlePointerEnter);
            scrollArea.removeEventListener("pointerleave", handlePointerLeave);
          };
        }
        return void 0;
      }, [context.scrollArea, context.scrollHideDelay]);
      if (forceMount || visible) {
        return  jsxRuntime.jsx(
          ScrollAreaScrollbarAuto,
          {
            "data-state": visible ? "visible" : "hidden",
            ...scrollbarProps,
            ref
          }
        );
      }
      return null;
    }
  );
  ScrollAreaScrollbarHover.displayName = "@mantine/core/ScrollAreaScrollbarHover";
  var ScrollAreaScrollbarScroll = React10.forwardRef(
    (props, red) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext();
      const isHorizontal = props.orientation === "horizontal";
      const [state, setState] = React10.useState("hidden");
      const debounceScrollEnd = hooks.useDebouncedCallback(() => setState("idle"), 100);
      React10.useEffect(() => {
        if (state === "idle") {
          const hideTimer = window.setTimeout(() => setState("hidden"), context.scrollHideDelay);
          return () => window.clearTimeout(hideTimer);
        }
        return void 0;
      }, [state, context.scrollHideDelay]);
      React10.useEffect(() => {
        const { viewport } = context;
        const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
        if (viewport) {
          let prevScrollPos = viewport[scrollDirection];
          const handleScroll2 = () => {
            const scrollPos = viewport[scrollDirection];
            const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
            if (hasScrollInDirectionChanged) {
              setState("scrolling");
              debounceScrollEnd();
            }
            prevScrollPos = scrollPos;
          };
          viewport.addEventListener("scroll", handleScroll2);
          return () => viewport.removeEventListener("scroll", handleScroll2);
        }
        return void 0;
      }, [context.viewport, isHorizontal, debounceScrollEnd]);
      if (forceMount || state !== "hidden") {
        return  jsxRuntime.jsx(
          ScrollAreaScrollbarVisible,
          {
            "data-state": state === "hidden" ? "hidden" : "visible",
            ...scrollbarProps,
            ref: red,
            onPointerEnter: composeEventHandlers(props.onPointerEnter, () => setState("interacting")),
            onPointerLeave: composeEventHandlers(props.onPointerLeave, () => setState("idle"))
          }
        );
      }
      return null;
    }
  );
  var ScrollAreaScrollbar = React10.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext();
      const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
      const isHorizontal = props.orientation === "horizontal";
      React10.useEffect(() => {
        isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
        return () => {
          isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
        };
      }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
      return context.type === "hover" ?  jsxRuntime.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ?  jsxRuntime.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ?  jsxRuntime.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ?  jsxRuntime.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaScrollbar.displayName = "@mantine/core/ScrollAreaScrollbar";
  function addUnlinkedScrollListener(node, handler = () => {
  }) {
    let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
    let rAF = 0;
    (function loop() {
      const position = { left: node.scrollLeft, top: node.scrollTop };
      const isHorizontalScroll = prevPosition.left !== position.left;
      const isVerticalScroll = prevPosition.top !== position.top;
      if (isHorizontalScroll || isVerticalScroll) {
        handler();
      }
      prevPosition = position;
      rAF = window.requestAnimationFrame(loop);
    })();
    return () => window.cancelAnimationFrame(rAF);
  }
  var Thumb = React10.forwardRef((props, forwardedRef) => {
    const { style, ...others } = props;
    const scrollAreaContext = useScrollAreaContext();
    const scrollbarContext = useScrollbarContext();
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = hooks.useMergedRef(forwardedRef, (node) => scrollbarContext.onThumbChange(node));
    const removeUnlinkedScrollListenerRef = React10.useRef(void 0);
    const debounceScrollEnd = hooks.useDebouncedCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    React10.useEffect(() => {
      const { viewport } = scrollAreaContext;
      if (viewport) {
        const handleScroll2 = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
      return void 0;
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return  jsxRuntime.jsx(
      "div",
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...others,
        ref: composedRef,
        style: {
          width: "var(--sa-thumb-width)",
          height: "var(--sa-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  });
  Thumb.displayName = "@mantine/core/ScrollAreaThumb";
  var ScrollAreaThumb = React10.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...thumbProps } = props;
      const scrollbarContext = useScrollbarContext();
      if (forceMount || scrollbarContext.hasThumb) {
        return  jsxRuntime.jsx(Thumb, { ref: forwardedRef, ...thumbProps });
      }
      return null;
    }
  );
  ScrollAreaThumb.displayName = "@mantine/core/ScrollAreaThumb";
  var ScrollAreaViewport = React10.forwardRef(
    ({ children, style, ...others }, ref) => {
      const ctx = useScrollAreaContext();
      const rootRef = hooks.useMergedRef(ref, ctx.onViewportChange);
      return  jsxRuntime.jsx(
        Box,
        {
          ...others,
          ref: rootRef,
          style: {
            overflowX: ctx.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: ctx.scrollbarYEnabled ? "scroll" : "hidden",
            ...style
          },
          children:  jsxRuntime.jsx("div", { style: { minWidth: "100%", display: "table" }, ref: ctx.onContentChange, children })
        }
      );
    }
  );
  ScrollAreaViewport.displayName = "@mantine/core/ScrollAreaViewport";
  var classes = { "root": "m_d57069b5", "viewport": "m_c0783ff9", "viewportInner": "m_f8f631dd", "scrollbar": "m_c44ba933", "thumb": "m_d8b5e363", "corner": "m_21657268" };
  var defaultProps3 = {
    scrollHideDelay: 1e3,
    type: "hover",
    scrollbars: "xy"
  };
  var varsResolver = createVarsResolver((_, { scrollbarSize }) => ({
    root: {
      "--scrollarea-scrollbar-size": rem(scrollbarSize)
    }
  }));
  var ScrollArea = factory((_props, ref) => {
    const props = useProps("ScrollArea", defaultProps3, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      scrollbarSize,
      vars,
      type,
      scrollHideDelay,
      viewportProps,
      viewportRef,
      onScrollPositionChange,
      children,
      offsetScrollbars,
      scrollbars,
      onBottomReached,
      onTopReached,
      ...others
    } = props;
    const [scrollbarHovered, setScrollbarHovered] = React10.useState(false);
    const getStyles2 = useStyles({
      name: "ScrollArea",
      props,
      classes,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver
    });
    return  jsxRuntime.jsxs(
      ScrollAreaRoot,
      {
        type: type === "never" ? "always" : type,
        scrollHideDelay,
        ref,
        scrollbars,
        ...getStyles2("root"),
        ...others,
        children: [
           jsxRuntime.jsx(
            ScrollAreaViewport,
            {
              ...viewportProps,
              ...getStyles2("viewport", { style: viewportProps?.style }),
              ref: viewportRef,
              "data-offset-scrollbars": offsetScrollbars === true ? "xy" : offsetScrollbars || void 0,
              "data-scrollbars": scrollbars || void 0,
              onScroll: (e) => {
                viewportProps?.onScroll?.(e);
                onScrollPositionChange?.({ x: e.currentTarget.scrollLeft, y: e.currentTarget.scrollTop });
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                if (scrollTop - (scrollHeight - clientHeight) >= 0) {
                  onBottomReached?.();
                }
                if (scrollTop === 0) {
                  onTopReached?.();
                }
              },
              children
            }
          ),
          (scrollbars === "xy" || scrollbars === "x") &&  jsxRuntime.jsx(
            ScrollAreaScrollbar,
            {
              ...getStyles2("scrollbar"),
              orientation: "horizontal",
              "data-hidden": type === "never" || void 0,
              forceMount: true,
              onMouseEnter: () => setScrollbarHovered(true),
              onMouseLeave: () => setScrollbarHovered(false),
              children:  jsxRuntime.jsx(ScrollAreaThumb, { ...getStyles2("thumb") })
            }
          ),
          (scrollbars === "xy" || scrollbars === "y") &&  jsxRuntime.jsx(
            ScrollAreaScrollbar,
            {
              ...getStyles2("scrollbar"),
              orientation: "vertical",
              "data-hidden": type === "never" || void 0,
              forceMount: true,
              onMouseEnter: () => setScrollbarHovered(true),
              onMouseLeave: () => setScrollbarHovered(false),
              children:  jsxRuntime.jsx(ScrollAreaThumb, { ...getStyles2("thumb") })
            }
          ),
           jsxRuntime.jsx(
            ScrollAreaCorner,
            {
              ...getStyles2("corner"),
              "data-hovered": scrollbarHovered || void 0,
              "data-hidden": type === "never" || void 0
            }
          )
        ]
      }
    );
  });
  ScrollArea.displayName = "@mantine/core/ScrollArea";
  var ScrollAreaAutosize = factory((props, ref) => {
    const {
      children,
      classNames,
      styles,
      scrollbarSize,
      scrollHideDelay,
      type,
      dir,
      offsetScrollbars,
      viewportRef,
      onScrollPositionChange,
      unstyled,
      variant,
      viewportProps,
      scrollbars,
      style,
      vars,
      onBottomReached,
      onTopReached,
      ...others
    } = useProps("ScrollAreaAutosize", defaultProps3, props);
    return  jsxRuntime.jsx(Box, { ...others, ref, style: [{ display: "flex", overflow: "auto" }, style], children:  jsxRuntime.jsx(Box, { style: { display: "flex", flexDirection: "column", flex: 1 }, children:  jsxRuntime.jsx(
      ScrollArea,
      {
        classNames,
        styles,
        scrollHideDelay,
        scrollbarSize,
        type,
        dir,
        offsetScrollbars,
        viewportRef,
        onScrollPositionChange,
        unstyled,
        variant,
        viewportProps,
        vars,
        scrollbars,
        onBottomReached,
        onTopReached,
        children
      }
    ) }) });
  });
  ScrollArea.classes = classes;
  ScrollAreaAutosize.displayName = "@mantine/core/ScrollAreaAutosize";
  ScrollAreaAutosize.classes = classes;
  ScrollArea.Autosize = ScrollAreaAutosize;
  var classes2 = { "root": "m_87cf2631" };
  var defaultProps4 = {
    __staticSelector: "UnstyledButton"
  };
  var UnstyledButton = polymorphicFactory(
    (_props, ref) => {
      const props = useProps("UnstyledButton", defaultProps4, _props);
      const {
        className,
        component = "button",
        __staticSelector,
        unstyled,
        classNames,
        styles,
        style,
        ...others
      } = props;
      const getStyles2 = useStyles({
        name: __staticSelector,
        props,
        classes: classes2,
        className,
        style,
        classNames,
        styles,
        unstyled
      });
      return  jsxRuntime.jsx(
        Box,
        {
          ...getStyles2("root", { focusable: true }),
          component,
          ref,
          type: component === "button" ? "button" : void 0,
          ...others
        }
      );
    }
  );
  UnstyledButton.classes = classes2;
  UnstyledButton.displayName = "@mantine/core/UnstyledButton";
  var classes3 = { "root": "m_515a97f8" };
  var defaultProps5 = {};
  var VisuallyHidden = factory((_props, ref) => {
    const props = useProps("VisuallyHidden", defaultProps5, _props);
    const { classNames, className, style, styles, unstyled, vars, ...others } = props;
    const getStyles2 = useStyles({
      name: "VisuallyHidden",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled
    });
    return  jsxRuntime.jsx(Box, { component: "span", ref, ...getStyles2("root"), ...others });
  });
  VisuallyHidden.classes = classes3;
  VisuallyHidden.displayName = "@mantine/core/VisuallyHidden";
  var classes4 = { "root": "m_1b7284a3" };
  var defaultProps6 = {};
  var varsResolver2 = createVarsResolver((_, { radius, shadow }) => ({
    root: {
      "--paper-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--paper-shadow": getShadow(shadow)
    }
  }));
  var Paper = polymorphicFactory((_props, ref) => {
    const props = useProps("Paper", defaultProps6, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      withBorder,
      vars,
      radius,
      shadow,
      variant,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Paper",
      props,
      classes: classes4,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver2
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        mod: [{ "data-with-border": withBorder }, mod],
        ...getStyles2("root"),
        variant,
        ...others
      }
    );
  });
  Paper.classes = classes4;
  Paper.displayName = "@mantine/core/Paper";
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement2(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].includes(getNodeName(element));
  }
  function isTopLayer(element) {
    return [":popover-open", ":modal"].some((selector) => {
      try {
        return element.matches(selector);
      } catch (e) {
        return false;
      }
    });
  }
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement2(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports)
      return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  function isLastTraversableNode(node) {
    return ["html", "body", "#document"].includes(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement2(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      node.assignedSlot || 
      node.parentNode || 
      isShadowRoot(node) && node.host || 
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  function activeElement(doc) {
    let activeElement2 = doc.activeElement;
    while (((_activeElement = activeElement2) == null || (_activeElement = _activeElement.shadowRoot) == null ? void 0 : _activeElement.activeElement) != null) {
      var _activeElement;
      activeElement2 = activeElement2.shadowRoot.activeElement;
    }
    return activeElement2;
  }
  function contains(parent, child) {
    if (!parent || !child) {
      return false;
    }
    const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();
    if (parent.contains(child)) {
      return true;
    }
    if (rootNode && isShadowRoot(rootNode)) {
      let next = child;
      while (next) {
        if (parent === next) {
          return true;
        }
        next = next.parentNode || next.host;
      }
    }
    return false;
  }
  function getPlatform() {
    const uaData = navigator.userAgentData;
    if (uaData != null && uaData.platform) {
      return uaData.platform;
    }
    return navigator.platform;
  }
  function getUserAgent() {
    const uaData = navigator.userAgentData;
    if (uaData && Array.isArray(uaData.brands)) {
      return uaData.brands.map((_ref) => {
        let {
          brand,
          version
        } = _ref;
        return brand + "/" + version;
      }).join(" ");
    }
    return navigator.userAgent;
  }
  function isVirtualPointerEvent(event) {
    if (isJSDOM())
      return false;
    return !isAndroid() && event.width === 0 && event.height === 0 || isAndroid() && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "mouse" || 
    event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "touch";
  }
  function isSafari() {
    return /apple/i.test(navigator.vendor);
  }
  function isAndroid() {
    const re = /android/i;
    return re.test(getPlatform()) || re.test(getUserAgent());
  }
  function isMac() {
    return getPlatform().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
  }
  function isJSDOM() {
    return getUserAgent().includes("jsdom/");
  }
  function isMouseLikePointerType(pointerType, strict) {
    const values2 = ["mouse", "pen"];
    {
      values2.push("", void 0);
    }
    return values2.includes(pointerType);
  }
  function isReactEvent(event) {
    return "nativeEvent" in event;
  }
  function isRootElement(element) {
    return element.matches("html,body");
  }
  function getDocument(node) {
    return (node == null ? void 0 : node.ownerDocument) || document;
  }
  function isEventTargetWithin(event, node) {
    if (node == null) {
      return false;
    }
    if ("composedPath" in event) {
      return event.composedPath().includes(node);
    }
    const e = event;
    return e.target != null && node.contains(e.target);
  }
  function getTarget(event) {
    if ("composedPath" in event) {
      return event.composedPath()[0];
    }
    return event.target;
  }
  var TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
  function isTypeableElement(element) {
    return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
  }
  var min = Math.min;
  var max = Math.max;
  var round = Math.round;
  var floor = Math.floor;
  var createCoords = (v) => ({
    x: v,
    y: v
  });
  var oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  var oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp2(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  function getSideList(side, isStart, rtl) {
    const lr = ["left", "right"];
    const rl = ["right", "left"];
    const tb = ["top", "bottom"];
    const bt = ["bottom", "top"];
    switch (side) {
      case "top":
      case "bottom":
        if (rtl)
          return isStart ? rl : lr;
        return isStart ? lr : rl;
      case "left":
      case "right":
        return isStart ? tb : bt;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x,
      y
    };
  }
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  var computePosition = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platform2,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var arrow = (options) => ({
    name: "arrow",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset4 = clamp2(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset4 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset4,
          centerOffset: center - offset4 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  var flip = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || 
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getBoundingRect(rects) {
    const minX = min(...rects.map((rect) => rect.left));
    const minY = min(...rects.map((rect) => rect.top));
    const maxX = max(...rects.map((rect) => rect.right));
    const maxY = max(...rects.map((rect) => rect.bottom));
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  function getRectsByLine(rects) {
    const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
    const groups = [];
    let prevRect = null;
    for (let i = 0; i < sortedRects.length; i++) {
      const rect = sortedRects[i];
      if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
        groups.push([rect]);
      } else {
        groups[groups.length - 1].push(rect);
      }
      prevRect = rect;
    }
    return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
  }
  var inline = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "inline",
      options,
      async fn(state) {
        const {
          placement,
          elements,
          rects,
          platform: platform2,
          strategy
        } = state;
        const {
          padding = 2,
          x,
          y
        } = evaluate(options, state);
        const nativeClientRects = Array.from(await (platform2.getClientRects == null ? void 0 : platform2.getClientRects(elements.reference)) || []);
        const clientRects = getRectsByLine(nativeClientRects);
        const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
        const paddingObject = getPaddingObject(padding);
        function getBoundingClientRect2() {
          if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
            return clientRects.find((rect) => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
          }
          if (clientRects.length >= 2) {
            if (getSideAxis(placement) === "y") {
              const firstRect = clientRects[0];
              const lastRect = clientRects[clientRects.length - 1];
              const isTop = getSide(placement) === "top";
              const top2 = firstRect.top;
              const bottom2 = lastRect.bottom;
              const left2 = isTop ? firstRect.left : lastRect.left;
              const right2 = isTop ? firstRect.right : lastRect.right;
              const width2 = right2 - left2;
              const height2 = bottom2 - top2;
              return {
                top: top2,
                bottom: bottom2,
                left: left2,
                right: right2,
                width: width2,
                height: height2,
                x: left2,
                y: top2
              };
            }
            const isLeftSide = getSide(placement) === "left";
            const maxRight = max(...clientRects.map((rect) => rect.right));
            const minLeft = min(...clientRects.map((rect) => rect.left));
            const measureRects = clientRects.filter((rect) => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
            const top = measureRects[0].top;
            const bottom = measureRects[measureRects.length - 1].bottom;
            const left = minLeft;
            const right = maxRight;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          return fallback;
        }
        const resetRects = await platform2.getElementRects({
          reference: {
            getBoundingClientRect: getBoundingClientRect2
          },
          floating: elements.floating,
          strategy
        });
        if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
          return {
            reset: {
              rects: resetRects
            }
          };
        }
        return {};
      }
    };
  };
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var offset = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  var shift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x2,
                y: y2
              } = _ref;
              return {
                x: x2,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp2(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp2(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  var limitShift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset4 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset4, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = ["top", "left"].includes(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  var size = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };
  function getCssDimensions(element) {
    const css = getComputedStyle2(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement2(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }
  var noOffsets =  createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement2(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement2(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
    if (ignoreScrollbarX === void 0) {
      ignoreScrollbarX = false;
    }
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
      getWindowScrollBarX(documentElement, htmlRect)
    ));
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement2(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement2(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement2(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement2(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement2(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  var getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  var platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement: isElement2,
    isRTL
  };
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const {
        left,
        top,
        width,
        height
      } = element.getBoundingClientRect();
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          root: root.ownerDocument
        });
      } catch (e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  var offset2 = offset;
  var shift2 = shift;
  var flip2 = flip;
  var size2 = size;
  var arrow2 = arrow;
  var inline2 = inline;
  var limitShift2 = limitShift;
  var computePosition2 = (reference, floating, options) => {
    const cache =  new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };
  var index = typeof document !== "undefined" ? React10.useLayoutEffect : React10.useEffect;
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === "function" && a.toString() === b.toString()) {
      return true;
    }
    let length;
    let i;
    let keys2;
    if (a && b && typeof a === "object") {
      if (Array.isArray(a)) {
        length = a.length;
        if (length !== b.length)
          return false;
        for (i = length; i-- !== 0; ) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      keys2 = Object.keys(a);
      length = keys2.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!{}.hasOwnProperty.call(b, keys2[i])) {
          return false;
        }
      }
      for (i = length; i-- !== 0; ) {
        const key = keys2[i];
        if (key === "_owner" && a.$$typeof) {
          continue;
        }
        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a !== a && b !== b;
  }
  function getDPR(element) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React10__namespace.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React10__namespace.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React10__namespace.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React10__namespace.useState(null);
    const [_floating, _setFloating] = React10__namespace.useState(null);
    const setReference = React10__namespace.useCallback((node) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, []);
    const setFloating = React10__namespace.useCallback((node) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React10__namespace.useRef(null);
    const floatingRef = React10__namespace.useRef(null);
    const dataRef = React10__namespace.useRef(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = React10__namespace.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition2(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM__namespace.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React10__namespace.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index(() => {
      if (referenceEl)
        referenceRef.current = referenceEl;
      if (floatingEl)
        floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = React10__namespace.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React10__namespace.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React10__namespace.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x + "px, " + y + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React10__namespace.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  var arrow$1 = (options) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(state) {
        const {
          element,
          padding
        } = typeof options === "function" ? options(state) : options;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow2({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element) {
          return arrow2({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  var offset3 = (options, deps) => ({
    ...offset2(options),
    options: [options, deps]
  });
  var shift3 = (options, deps) => ({
    ...shift2(options),
    options: [options, deps]
  });
  var limitShift3 = (options, deps) => ({
    ...limitShift2(options),
    options: [options, deps]
  });
  var flip3 = (options, deps) => ({
    ...flip2(options),
    options: [options, deps]
  });
  var size3 = (options, deps) => ({
    ...size2(options),
    options: [options, deps]
  });
  var inline3 = (options, deps) => ({
    ...inline2(options),
    options: [options, deps]
  });
  var arrow3 = (options, deps) => ({
    ...arrow$1(options),
    options: [options, deps]
  });
  var SafeReact = {
    ...React10__namespace
  };
  var useInsertionEffect = SafeReact.useInsertionEffect;
  var useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());
  function useEffectEvent(callback) {
    const ref = React10__namespace.useRef(() => {
      {
        throw new Error("Cannot call an event handler while rendering.");
      }
    });
    useSafeInsertionEffect(() => {
      ref.current = callback;
    });
    return React10__namespace.useCallback(function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return ref.current == null ? void 0 : ref.current(...args);
    }, []);
  }
  var index2 = typeof document !== "undefined" ? React10.useLayoutEffect : React10.useEffect;
  var serverHandoffComplete = false;
  var count = 0;
  var genId = () => (
    "floating-ui-" + Math.random().toString(36).slice(2, 6) + count++
  );
  function useFloatingId() {
    const [id, setId] = React10__namespace.useState(() => serverHandoffComplete ? genId() : void 0);
    index2(() => {
      if (id == null) {
        setId(genId());
      }
    }, []);
    React10__namespace.useEffect(() => {
      serverHandoffComplete = true;
    }, []);
    return id;
  }
  var useReactId = SafeReact.useId;
  var useId2 = useReactId || useFloatingId;
  var devMessageSet;
  {
    devMessageSet =  new Set();
  }
  function error() {
    var _devMessageSet3;
    for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      messages[_key2] = arguments[_key2];
    }
    const message = "Floating UI: " + messages.join(" ");
    if (!((_devMessageSet3 = devMessageSet) != null && _devMessageSet3.has(message))) {
      var _devMessageSet4;
      (_devMessageSet4 = devMessageSet) == null || _devMessageSet4.add(message);
      console.error(message);
    }
  }
  function createPubSub() {
    const map =  new Map();
    return {
      emit(event, data) {
        var _map$get;
        (_map$get = map.get(event)) == null || _map$get.forEach((handler) => handler(data));
      },
      on(event, listener) {
        map.set(event, [...map.get(event) || [], listener]);
      },
      off(event, listener) {
        var _map$get2;
        map.set(event, ((_map$get2 = map.get(event)) == null ? void 0 : _map$get2.filter((l) => l !== listener)) || []);
      }
    };
  }
  var FloatingNodeContext =  React10__namespace.createContext(null);
  var FloatingTreeContext =  React10__namespace.createContext(null);
  var useFloatingParentNodeId = () => {
    var _React$useContext;
    return ((_React$useContext = React10__namespace.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
  };
  var useFloatingTree = () => React10__namespace.useContext(FloatingTreeContext);
  function createAttribute(name) {
    return "data-floating-ui-" + name;
  }
  function useLatestRef2(value) {
    const ref = React10.useRef(value);
    index2(() => {
      ref.current = value;
    });
    return ref;
  }
  var safePolygonIdentifier =  createAttribute("safe-polygon");
  function getDelay(value, prop, pointerType) {
    if (pointerType && !isMouseLikePointerType(pointerType)) {
      return 0;
    }
    if (typeof value === "number") {
      return value;
    }
    return value == null ? void 0 : value[prop];
  }
  function useHover(context, props) {
    if (props === void 0) {
      props = {};
    }
    const {
      open,
      onOpenChange,
      dataRef,
      events,
      elements
    } = context;
    const {
      enabled = true,
      delay = 0,
      handleClose = null,
      mouseOnly = false,
      restMs = 0,
      move = true
    } = props;
    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    const handleCloseRef = useLatestRef2(handleClose);
    const delayRef = useLatestRef2(delay);
    const openRef = useLatestRef2(open);
    const pointerTypeRef = React10__namespace.useRef();
    const timeoutRef = React10__namespace.useRef(-1);
    const handlerRef = React10__namespace.useRef();
    const restTimeoutRef = React10__namespace.useRef(-1);
    const blockMouseMoveRef = React10__namespace.useRef(true);
    const performedPointerEventsMutationRef = React10__namespace.useRef(false);
    const unbindMouseMoveRef = React10__namespace.useRef(() => {
    });
    const restTimeoutPendingRef = React10__namespace.useRef(false);
    const isHoverOpen = React10__namespace.useCallback(() => {
      var _dataRef$current$open;
      const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
      return (type == null ? void 0 : type.includes("mouse")) && type !== "mousedown";
    }, [dataRef]);
    React10__namespace.useEffect(() => {
      if (!enabled)
        return;
      function onOpenChange2(_ref) {
        let {
          open: open2
        } = _ref;
        if (!open2) {
          clearTimeout(timeoutRef.current);
          clearTimeout(restTimeoutRef.current);
          blockMouseMoveRef.current = true;
          restTimeoutPendingRef.current = false;
        }
      }
      events.on("openchange", onOpenChange2);
      return () => {
        events.off("openchange", onOpenChange2);
      };
    }, [enabled, events]);
    React10__namespace.useEffect(() => {
      if (!enabled)
        return;
      if (!handleCloseRef.current)
        return;
      if (!open)
        return;
      function onLeave(event) {
        if (isHoverOpen()) {
          onOpenChange(false, event, "hover");
        }
      }
      const html = getDocument(elements.floating).documentElement;
      html.addEventListener("mouseleave", onLeave);
      return () => {
        html.removeEventListener("mouseleave", onLeave);
      };
    }, [elements.floating, open, onOpenChange, enabled, handleCloseRef, isHoverOpen]);
    const closeWithDelay = React10__namespace.useCallback(function(event, runElseBranch, reason) {
      if (runElseBranch === void 0) {
        runElseBranch = true;
      }
      if (reason === void 0) {
        reason = "hover";
      }
      const closeDelay = getDelay(delayRef.current, "close", pointerTypeRef.current);
      if (closeDelay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => onOpenChange(false, event, reason), closeDelay);
      } else if (runElseBranch) {
        clearTimeout(timeoutRef.current);
        onOpenChange(false, event, reason);
      }
    }, [delayRef, onOpenChange]);
    const cleanupMouseMoveHandler = useEffectEvent(() => {
      unbindMouseMoveRef.current();
      handlerRef.current = void 0;
    });
    const clearPointerEvents = useEffectEvent(() => {
      if (performedPointerEventsMutationRef.current) {
        const body = getDocument(elements.floating).body;
        body.style.pointerEvents = "";
        body.removeAttribute(safePolygonIdentifier);
        performedPointerEventsMutationRef.current = false;
      }
    });
    const isClickLikeOpenEvent = useEffectEvent(() => {
      return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
    });
    React10__namespace.useEffect(() => {
      if (!enabled)
        return;
      function onMouseEnter(event) {
        clearTimeout(timeoutRef.current);
        blockMouseMoveRef.current = false;
        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && !getDelay(delayRef.current, "open")) {
          return;
        }
        const openDelay = getDelay(delayRef.current, "open", pointerTypeRef.current);
        if (openDelay) {
          timeoutRef.current = window.setTimeout(() => {
            if (!openRef.current) {
              onOpenChange(true, event, "hover");
            }
          }, openDelay);
        } else if (!open) {
          onOpenChange(true, event, "hover");
        }
      }
      function onMouseLeave(event) {
        if (isClickLikeOpenEvent())
          return;
        unbindMouseMoveRef.current();
        const doc = getDocument(elements.floating);
        clearTimeout(restTimeoutRef.current);
        restTimeoutPendingRef.current = false;
        if (handleCloseRef.current && dataRef.current.floatingContext) {
          if (!open) {
            clearTimeout(timeoutRef.current);
          }
          handlerRef.current = handleCloseRef.current({
            ...dataRef.current.floatingContext,
            tree,
            x: event.clientX,
            y: event.clientY,
            onClose() {
              clearPointerEvents();
              cleanupMouseMoveHandler();
              if (!isClickLikeOpenEvent()) {
                closeWithDelay(event, true, "safe-polygon");
              }
            }
          });
          const handler = handlerRef.current;
          doc.addEventListener("mousemove", handler);
          unbindMouseMoveRef.current = () => {
            doc.removeEventListener("mousemove", handler);
          };
          return;
        }
        const shouldClose = pointerTypeRef.current === "touch" ? !contains(elements.floating, event.relatedTarget) : true;
        if (shouldClose) {
          closeWithDelay(event);
        }
      }
      function onScrollMouseLeave(event) {
        if (isClickLikeOpenEvent())
          return;
        if (!dataRef.current.floatingContext)
          return;
        handleCloseRef.current == null || handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event);
            }
          }
        })(event);
      }
      if (isElement2(elements.domReference)) {
        var _elements$floating;
        const ref = elements.domReference;
        open && ref.addEventListener("mouseleave", onScrollMouseLeave);
        (_elements$floating = elements.floating) == null || _elements$floating.addEventListener("mouseleave", onScrollMouseLeave);
        move && ref.addEventListener("mousemove", onMouseEnter, {
          once: true
        });
        ref.addEventListener("mouseenter", onMouseEnter);
        ref.addEventListener("mouseleave", onMouseLeave);
        return () => {
          var _elements$floating2;
          open && ref.removeEventListener("mouseleave", onScrollMouseLeave);
          (_elements$floating2 = elements.floating) == null || _elements$floating2.removeEventListener("mouseleave", onScrollMouseLeave);
          move && ref.removeEventListener("mousemove", onMouseEnter);
          ref.removeEventListener("mouseenter", onMouseEnter);
          ref.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    }, [elements, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, openRef, tree, delayRef, handleCloseRef, dataRef, isClickLikeOpenEvent]);
    index2(() => {
      var _handleCloseRef$curre;
      if (!enabled)
        return;
      if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
        performedPointerEventsMutationRef.current = true;
        const floatingEl = elements.floating;
        if (isElement2(elements.domReference) && floatingEl) {
          var _tree$nodesRef$curren;
          const body = getDocument(elements.floating).body;
          body.setAttribute(safePolygonIdentifier, "");
          const ref = elements.domReference;
          const parentFloating = tree == null || (_tree$nodesRef$curren = tree.nodesRef.current.find((node) => node.id === parentId)) == null || (_tree$nodesRef$curren = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren.elements.floating;
          if (parentFloating) {
            parentFloating.style.pointerEvents = "";
          }
          body.style.pointerEvents = "none";
          ref.style.pointerEvents = "auto";
          floatingEl.style.pointerEvents = "auto";
          return () => {
            body.style.pointerEvents = "";
            ref.style.pointerEvents = "";
            floatingEl.style.pointerEvents = "";
          };
        }
      }
    }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);
    index2(() => {
      if (!open) {
        pointerTypeRef.current = void 0;
        restTimeoutPendingRef.current = false;
        cleanupMouseMoveHandler();
        clearPointerEvents();
      }
    }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
    React10__namespace.useEffect(() => {
      return () => {
        cleanupMouseMoveHandler();
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        clearPointerEvents();
      };
    }, [enabled, elements.domReference, cleanupMouseMoveHandler, clearPointerEvents]);
    const reference = React10__namespace.useMemo(() => {
      function setPointerRef(event) {
        pointerTypeRef.current = event.pointerType;
      }
      return {
        onPointerDown: setPointerRef,
        onPointerEnter: setPointerRef,
        onMouseMove(event) {
          const {
            nativeEvent
          } = event;
          function handleMouseMove() {
            if (!blockMouseMoveRef.current && !openRef.current) {
              onOpenChange(true, nativeEvent, "hover");
            }
          }
          if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
            return;
          }
          if (open || restMs === 0) {
            return;
          }
          if (restTimeoutPendingRef.current && event.movementX ** 2 + event.movementY ** 2 < 2) {
            return;
          }
          clearTimeout(restTimeoutRef.current);
          if (pointerTypeRef.current === "touch") {
            handleMouseMove();
          } else {
            restTimeoutPendingRef.current = true;
            restTimeoutRef.current = window.setTimeout(handleMouseMove, restMs);
          }
        }
      };
    }, [mouseOnly, onOpenChange, open, openRef, restMs]);
    const floating = React10__namespace.useMemo(() => ({
      onMouseEnter() {
        clearTimeout(timeoutRef.current);
      },
      onMouseLeave(event) {
        if (!isClickLikeOpenEvent()) {
          closeWithDelay(event.nativeEvent, false);
        }
      }
    }), [closeWithDelay, isClickLikeOpenEvent]);
    return React10__namespace.useMemo(() => enabled ? {
      reference,
      floating
    } : {}, [enabled, reference, floating]);
  }
  var NOOP = () => {
  };
  var FloatingDelayGroupContext =  React10__namespace.createContext({
    delay: 0,
    initialDelay: 0,
    timeoutMs: 0,
    currentId: null,
    setCurrentId: NOOP,
    setState: NOOP,
    isInstantPhase: false
  });
  var useDelayGroupContext = () => React10__namespace.useContext(FloatingDelayGroupContext);
  function FloatingDelayGroup(props) {
    const {
      children,
      delay,
      timeoutMs = 0
    } = props;
    const [state, setState] = React10__namespace.useReducer((prev, next) => ({
      ...prev,
      ...next
    }), {
      delay,
      timeoutMs,
      initialDelay: delay,
      currentId: null,
      isInstantPhase: false
    });
    const initialCurrentIdRef = React10__namespace.useRef(null);
    const setCurrentId = React10__namespace.useCallback((currentId) => {
      setState({
        currentId
      });
    }, []);
    index2(() => {
      if (state.currentId) {
        if (initialCurrentIdRef.current === null) {
          initialCurrentIdRef.current = state.currentId;
        } else if (!state.isInstantPhase) {
          setState({
            isInstantPhase: true
          });
        }
      } else {
        if (state.isInstantPhase) {
          setState({
            isInstantPhase: false
          });
        }
        initialCurrentIdRef.current = null;
      }
    }, [state.currentId, state.isInstantPhase]);
    return  React10__namespace.createElement(FloatingDelayGroupContext.Provider, {
      value: React10__namespace.useMemo(() => ({
        ...state,
        setState,
        setCurrentId
      }), [state, setCurrentId])
    }, children);
  }
  function useDelayGroup(context, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      open,
      onOpenChange,
      floatingId
    } = context;
    const {
      id: optionId,
      enabled = true
    } = options;
    const id = optionId != null ? optionId : floatingId;
    const groupContext = useDelayGroupContext();
    const {
      currentId,
      setCurrentId,
      initialDelay,
      setState,
      timeoutMs
    } = groupContext;
    index2(() => {
      if (!enabled)
        return;
      if (!currentId)
        return;
      setState({
        delay: {
          open: 1,
          close: getDelay(initialDelay, "close")
        }
      });
      if (currentId !== id) {
        onOpenChange(false);
      }
    }, [enabled, id, onOpenChange, setState, currentId, initialDelay]);
    index2(() => {
      function unset() {
        onOpenChange(false);
        setState({
          delay: initialDelay,
          currentId: null
        });
      }
      if (!enabled)
        return;
      if (!currentId)
        return;
      if (!open && currentId === id) {
        if (timeoutMs) {
          const timeout = window.setTimeout(unset, timeoutMs);
          return () => {
            clearTimeout(timeout);
          };
        }
        unset();
      }
    }, [enabled, open, setState, currentId, id, onOpenChange, initialDelay, timeoutMs]);
    index2(() => {
      if (!enabled)
        return;
      if (setCurrentId === NOOP || !open)
        return;
      setCurrentId(id);
    }, [enabled, open, setCurrentId, id]);
    return groupContext;
  }
  function getChildren(nodes, id) {
    let allChildren = nodes.filter((node) => {
      var _node$context;
      return node.parentId === id && ((_node$context = node.context) == null ? void 0 : _node$context.open);
    });
    let currentChildren = allChildren;
    while (currentChildren.length) {
      currentChildren = nodes.filter((node) => {
        var _currentChildren;
        return (_currentChildren = currentChildren) == null ? void 0 : _currentChildren.some((n) => {
          var _node$context2;
          return node.parentId === n.id && ((_node$context2 = node.context) == null ? void 0 : _node$context2.open);
        });
      });
      allChildren = allChildren.concat(currentChildren);
    }
    return allChildren;
  }
  var FOCUSABLE_ATTRIBUTE = "data-floating-ui-focusable";
  var bubbleHandlerKeys = {
    pointerdown: "onPointerDown",
    mousedown: "onMouseDown",
    click: "onClick"
  };
  var captureHandlerKeys = {
    pointerdown: "onPointerDownCapture",
    mousedown: "onMouseDownCapture",
    click: "onClickCapture"
  };
  var normalizeProp = (normalizable) => {
    var _normalizable$escapeK, _normalizable$outside;
    return {
      escapeKey: typeof normalizable === "boolean" ? normalizable : (_normalizable$escapeK = normalizable == null ? void 0 : normalizable.escapeKey) != null ? _normalizable$escapeK : false,
      outsidePress: typeof normalizable === "boolean" ? normalizable : (_normalizable$outside = normalizable == null ? void 0 : normalizable.outsidePress) != null ? _normalizable$outside : true
    };
  };
  function useDismiss(context, props) {
    if (props === void 0) {
      props = {};
    }
    const {
      open,
      onOpenChange,
      elements,
      dataRef
    } = context;
    const {
      enabled = true,
      escapeKey = true,
      outsidePress: unstable_outsidePress = true,
      outsidePressEvent = "pointerdown",
      referencePress = false,
      referencePressEvent = "pointerdown",
      ancestorScroll = false,
      bubbles,
      capture
    } = props;
    const tree = useFloatingTree();
    const outsidePressFn = useEffectEvent(typeof unstable_outsidePress === "function" ? unstable_outsidePress : () => false);
    const outsidePress = typeof unstable_outsidePress === "function" ? outsidePressFn : unstable_outsidePress;
    const insideReactTreeRef = React10__namespace.useRef(false);
    const endedOrStartedInsideRef = React10__namespace.useRef(false);
    const {
      escapeKey: escapeKeyBubbles,
      outsidePress: outsidePressBubbles
    } = normalizeProp(bubbles);
    const {
      escapeKey: escapeKeyCapture,
      outsidePress: outsidePressCapture
    } = normalizeProp(capture);
    const isComposingRef = React10__namespace.useRef(false);
    const closeOnEscapeKeyDown = useEffectEvent((event) => {
      var _dataRef$current$floa;
      if (!open || !enabled || !escapeKey || event.key !== "Escape") {
        return;
      }
      if (isComposingRef.current) {
        return;
      }
      const nodeId = (_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.nodeId;
      const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
      if (!escapeKeyBubbles) {
        event.stopPropagation();
        if (children.length > 0) {
          let shouldDismiss = true;
          children.forEach((child) => {
            var _child$context;
            if ((_child$context = child.context) != null && _child$context.open && !child.context.dataRef.current.__escapeKeyBubbles) {
              shouldDismiss = false;
              return;
            }
          });
          if (!shouldDismiss) {
            return;
          }
        }
      }
      onOpenChange(false, isReactEvent(event) ? event.nativeEvent : event, "escape-key");
    });
    const closeOnEscapeKeyDownCapture = useEffectEvent((event) => {
      var _getTarget2;
      const callback = () => {
        var _getTarget;
        closeOnEscapeKeyDown(event);
        (_getTarget = getTarget(event)) == null || _getTarget.removeEventListener("keydown", callback);
      };
      (_getTarget2 = getTarget(event)) == null || _getTarget2.addEventListener("keydown", callback);
    });
    const closeOnPressOutside = useEffectEvent((event) => {
      var _dataRef$current$floa2;
      const insideReactTree = insideReactTreeRef.current;
      insideReactTreeRef.current = false;
      const endedOrStartedInside = endedOrStartedInsideRef.current;
      endedOrStartedInsideRef.current = false;
      if (outsidePressEvent === "click" && endedOrStartedInside) {
        return;
      }
      if (insideReactTree) {
        return;
      }
      if (typeof outsidePress === "function" && !outsidePress(event)) {
        return;
      }
      const target = getTarget(event);
      const inertSelector = "[" + createAttribute("inert") + "]";
      const markers = getDocument(elements.floating).querySelectorAll(inertSelector);
      let targetRootAncestor = isElement2(target) ? target : null;
      while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
        const nextParent = getParentNode(targetRootAncestor);
        if (isLastTraversableNode(nextParent) || !isElement2(nextParent)) {
          break;
        }
        targetRootAncestor = nextParent;
      }
      if (markers.length && isElement2(target) && !isRootElement(target) && 
      !contains(target, elements.floating) && 
      Array.from(markers).every((marker) => !contains(targetRootAncestor, marker))) {
        return;
      }
      if (isHTMLElement(target) && floating) {
        const canScrollX = target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
        const canScrollY = target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
        let xCond = canScrollY && event.offsetX > target.clientWidth;
        if (canScrollY) {
          const isRTL2 = getComputedStyle2(target).direction === "rtl";
          if (isRTL2) {
            xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
          }
        }
        if (xCond || canScrollX && event.offsetY > target.clientHeight) {
          return;
        }
      }
      const nodeId = (_dataRef$current$floa2 = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa2.nodeId;
      const targetIsInsideChildren = tree && getChildren(tree.nodesRef.current, nodeId).some((node) => {
        var _node$context;
        return isEventTargetWithin(event, (_node$context = node.context) == null ? void 0 : _node$context.elements.floating);
      });
      if (isEventTargetWithin(event, elements.floating) || isEventTargetWithin(event, elements.domReference) || targetIsInsideChildren) {
        return;
      }
      const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach((child) => {
          var _child$context2;
          if ((_child$context2 = child.context) != null && _child$context2.open && !child.context.dataRef.current.__outsidePressBubbles) {
            shouldDismiss = false;
            return;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
      onOpenChange(false, event, "outside-press");
    });
    const closeOnPressOutsideCapture = useEffectEvent((event) => {
      var _getTarget4;
      const callback = () => {
        var _getTarget3;
        closeOnPressOutside(event);
        (_getTarget3 = getTarget(event)) == null || _getTarget3.removeEventListener(outsidePressEvent, callback);
      };
      (_getTarget4 = getTarget(event)) == null || _getTarget4.addEventListener(outsidePressEvent, callback);
    });
    React10__namespace.useEffect(() => {
      if (!open || !enabled) {
        return;
      }
      dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
      dataRef.current.__outsidePressBubbles = outsidePressBubbles;
      let compositionTimeout = -1;
      function onScroll(event) {
        onOpenChange(false, event, "ancestor-scroll");
      }
      function handleCompositionStart() {
        window.clearTimeout(compositionTimeout);
        isComposingRef.current = true;
      }
      function handleCompositionEnd() {
        compositionTimeout = window.setTimeout(
          () => {
            isComposingRef.current = false;
          },
          isWebKit() ? 5 : 0
        );
      }
      const doc = getDocument(elements.floating);
      if (escapeKey) {
        doc.addEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
        doc.addEventListener("compositionstart", handleCompositionStart);
        doc.addEventListener("compositionend", handleCompositionEnd);
      }
      outsidePress && doc.addEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
      let ancestors = [];
      if (ancestorScroll) {
        if (isElement2(elements.domReference)) {
          ancestors = getOverflowAncestors(elements.domReference);
        }
        if (isElement2(elements.floating)) {
          ancestors = ancestors.concat(getOverflowAncestors(elements.floating));
        }
        if (!isElement2(elements.reference) && elements.reference && elements.reference.contextElement) {
          ancestors = ancestors.concat(getOverflowAncestors(elements.reference.contextElement));
        }
      }
      ancestors = ancestors.filter((ancestor) => {
        var _doc$defaultView;
        return ancestor !== ((_doc$defaultView = doc.defaultView) == null ? void 0 : _doc$defaultView.visualViewport);
      });
      ancestors.forEach((ancestor) => {
        ancestor.addEventListener("scroll", onScroll, {
          passive: true
        });
      });
      return () => {
        if (escapeKey) {
          doc.removeEventListener("keydown", escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown, escapeKeyCapture);
          doc.removeEventListener("compositionstart", handleCompositionStart);
          doc.removeEventListener("compositionend", handleCompositionEnd);
        }
        outsidePress && doc.removeEventListener(outsidePressEvent, outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside, outsidePressCapture);
        ancestors.forEach((ancestor) => {
          ancestor.removeEventListener("scroll", onScroll);
        });
        window.clearTimeout(compositionTimeout);
      };
    }, [dataRef, elements, escapeKey, outsidePress, outsidePressEvent, open, onOpenChange, ancestorScroll, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, escapeKeyCapture, closeOnEscapeKeyDownCapture, closeOnPressOutside, outsidePressCapture, closeOnPressOutsideCapture]);
    React10__namespace.useEffect(() => {
      insideReactTreeRef.current = false;
    }, [outsidePress, outsidePressEvent]);
    const reference = React10__namespace.useMemo(() => ({
      onKeyDown: closeOnEscapeKeyDown,
      [bubbleHandlerKeys[referencePressEvent]]: (event) => {
        if (referencePress) {
          onOpenChange(false, event.nativeEvent, "reference-press");
        }
      }
    }), [closeOnEscapeKeyDown, onOpenChange, referencePress, referencePressEvent]);
    const floating = React10__namespace.useMemo(() => ({
      onKeyDown: closeOnEscapeKeyDown,
      onMouseDown() {
        endedOrStartedInsideRef.current = true;
      },
      onMouseUp() {
        endedOrStartedInsideRef.current = true;
      },
      [captureHandlerKeys[outsidePressEvent]]: () => {
        insideReactTreeRef.current = true;
      }
    }), [closeOnEscapeKeyDown, outsidePressEvent]);
    return React10__namespace.useMemo(() => enabled ? {
      reference,
      floating
    } : {}, [enabled, reference, floating]);
  }
  function useFloatingRootContext(options) {
    const {
      open = false,
      onOpenChange: onOpenChangeProp,
      elements: elementsProp
    } = options;
    const floatingId = useId2();
    const dataRef = React10__namespace.useRef({});
    const [events] = React10__namespace.useState(() => createPubSub());
    const nested = useFloatingParentNodeId() != null;
    {
      const optionDomReference = elementsProp.reference;
      if (optionDomReference && !isElement2(optionDomReference)) {
        error("Cannot pass a virtual element to the `elements.reference` option,", "as it must be a real DOM element. Use `refs.setPositionReference()`", "instead.");
      }
    }
    const [positionReference, setPositionReference] = React10__namespace.useState(elementsProp.reference);
    const onOpenChange = useEffectEvent((open2, event, reason) => {
      dataRef.current.openEvent = open2 ? event : void 0;
      events.emit("openchange", {
        open: open2,
        event,
        reason,
        nested
      });
      onOpenChangeProp == null || onOpenChangeProp(open2, event, reason);
    });
    const refs = React10__namespace.useMemo(() => ({
      setPositionReference
    }), []);
    const elements = React10__namespace.useMemo(() => ({
      reference: positionReference || elementsProp.reference || null,
      floating: elementsProp.floating || null,
      domReference: elementsProp.reference
    }), [positionReference, elementsProp.reference, elementsProp.floating]);
    return React10__namespace.useMemo(() => ({
      dataRef,
      open,
      onOpenChange,
      elements,
      events,
      floatingId,
      refs
    }), [open, onOpenChange, elements, events, floatingId, refs]);
  }
  function useFloating2(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      nodeId
    } = options;
    const internalRootContext = useFloatingRootContext({
      ...options,
      elements: {
        reference: null,
        floating: null,
        ...options.elements
      }
    });
    const rootContext = options.rootContext || internalRootContext;
    const computedElements = rootContext.elements;
    const [_domReference, setDomReference] = React10__namespace.useState(null);
    const [positionReference, _setPositionReference] = React10__namespace.useState(null);
    const optionDomReference = computedElements == null ? void 0 : computedElements.domReference;
    const domReference = optionDomReference || _domReference;
    const domReferenceRef = React10__namespace.useRef(null);
    const tree = useFloatingTree();
    index2(() => {
      if (domReference) {
        domReferenceRef.current = domReference;
      }
    }, [domReference]);
    const position = useFloating({
      ...options,
      elements: {
        ...computedElements,
        ...positionReference && {
          reference: positionReference
        }
      }
    });
    const setPositionReference = React10__namespace.useCallback((node) => {
      const computedPositionReference = isElement2(node) ? {
        getBoundingClientRect: () => node.getBoundingClientRect(),
        contextElement: node
      } : node;
      _setPositionReference(computedPositionReference);
      position.refs.setReference(computedPositionReference);
    }, [position.refs]);
    const setReference = React10__namespace.useCallback((node) => {
      if (isElement2(node) || node === null) {
        domReferenceRef.current = node;
        setDomReference(node);
      }
      if (isElement2(position.refs.reference.current) || position.refs.reference.current === null || 
      node !== null && !isElement2(node)) {
        position.refs.setReference(node);
      }
    }, [position.refs]);
    const refs = React10__namespace.useMemo(() => ({
      ...position.refs,
      setReference,
      setPositionReference,
      domReference: domReferenceRef
    }), [position.refs, setReference, setPositionReference]);
    const elements = React10__namespace.useMemo(() => ({
      ...position.elements,
      domReference
    }), [position.elements, domReference]);
    const context = React10__namespace.useMemo(() => ({
      ...position,
      ...rootContext,
      refs,
      elements,
      nodeId
    }), [position, refs, elements, nodeId, rootContext]);
    index2(() => {
      rootContext.dataRef.current.floatingContext = context;
      const node = tree == null ? void 0 : tree.nodesRef.current.find((node2) => node2.id === nodeId);
      if (node) {
        node.context = context;
      }
    });
    return React10__namespace.useMemo(() => ({
      ...position,
      context,
      refs,
      elements
    }), [position, refs, elements, context]);
  }
  function useFocus(context, props) {
    if (props === void 0) {
      props = {};
    }
    const {
      open,
      onOpenChange,
      events,
      dataRef,
      elements
    } = context;
    const {
      enabled = true,
      visibleOnly = true
    } = props;
    const blockFocusRef = React10__namespace.useRef(false);
    const timeoutRef = React10__namespace.useRef();
    const keyboardModalityRef = React10__namespace.useRef(true);
    React10__namespace.useEffect(() => {
      if (!enabled)
        return;
      const win = getWindow(elements.domReference);
      function onBlur() {
        if (!open && isHTMLElement(elements.domReference) && elements.domReference === activeElement(getDocument(elements.domReference))) {
          blockFocusRef.current = true;
        }
      }
      function onKeyDown() {
        keyboardModalityRef.current = true;
      }
      win.addEventListener("blur", onBlur);
      win.addEventListener("keydown", onKeyDown, true);
      return () => {
        win.removeEventListener("blur", onBlur);
        win.removeEventListener("keydown", onKeyDown, true);
      };
    }, [elements.domReference, open, enabled]);
    React10__namespace.useEffect(() => {
      if (!enabled)
        return;
      function onOpenChange2(_ref) {
        let {
          reason
        } = _ref;
        if (reason === "reference-press" || reason === "escape-key") {
          blockFocusRef.current = true;
        }
      }
      events.on("openchange", onOpenChange2);
      return () => {
        events.off("openchange", onOpenChange2);
      };
    }, [events, enabled]);
    React10__namespace.useEffect(() => {
      return () => {
        clearTimeout(timeoutRef.current);
      };
    }, []);
    const reference = React10__namespace.useMemo(() => ({
      onPointerDown(event) {
        if (isVirtualPointerEvent(event.nativeEvent))
          return;
        keyboardModalityRef.current = false;
      },
      onMouseLeave() {
        blockFocusRef.current = false;
      },
      onFocus(event) {
        if (blockFocusRef.current)
          return;
        const target = getTarget(event.nativeEvent);
        if (visibleOnly && isElement2(target)) {
          try {
            if (isSafari() && isMac())
              throw Error();
            if (!target.matches(":focus-visible"))
              return;
          } catch (e) {
            if (!keyboardModalityRef.current && !isTypeableElement(target)) {
              return;
            }
          }
        }
        onOpenChange(true, event.nativeEvent, "focus");
      },
      onBlur(event) {
        blockFocusRef.current = false;
        const relatedTarget = event.relatedTarget;
        const nativeEvent = event.nativeEvent;
        const movedToFocusGuard = isElement2(relatedTarget) && relatedTarget.hasAttribute(createAttribute("focus-guard")) && relatedTarget.getAttribute("data-type") === "outside";
        timeoutRef.current = window.setTimeout(() => {
          var _dataRef$current$floa;
          const activeEl = activeElement(elements.domReference ? elements.domReference.ownerDocument : document);
          if (!relatedTarget && activeEl === elements.domReference)
            return;
          if (contains((_dataRef$current$floa = dataRef.current.floatingContext) == null ? void 0 : _dataRef$current$floa.refs.floating.current, activeEl) || contains(elements.domReference, activeEl) || movedToFocusGuard) {
            return;
          }
          onOpenChange(false, nativeEvent, "focus");
        });
      }
    }), [dataRef, elements.domReference, onOpenChange, visibleOnly]);
    return React10__namespace.useMemo(() => enabled ? {
      reference
    } : {}, [enabled, reference]);
  }
  var ACTIVE_KEY = "active";
  var SELECTED_KEY = "selected";
  function mergeProps(userProps, propsList, elementKey) {
    const map =  new Map();
    const isItem = elementKey === "item";
    let domUserProps = userProps;
    if (isItem && userProps) {
      const {
        [ACTIVE_KEY]: _,
        [SELECTED_KEY]: __,
        ...validProps
      } = userProps;
      domUserProps = validProps;
    }
    return {
      ...elementKey === "floating" && {
        tabIndex: -1,
        [FOCUSABLE_ATTRIBUTE]: ""
      },
      ...domUserProps,
      ...propsList.map((value) => {
        const propsOrGetProps = value ? value[elementKey] : null;
        if (typeof propsOrGetProps === "function") {
          return userProps ? propsOrGetProps(userProps) : null;
        }
        return propsOrGetProps;
      }).concat(userProps).reduce((acc, props) => {
        if (!props) {
          return acc;
        }
        Object.entries(props).forEach((_ref) => {
          let [key, value] = _ref;
          if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
            return;
          }
          if (key.indexOf("on") === 0) {
            if (!map.has(key)) {
              map.set(key, []);
            }
            if (typeof value === "function") {
              var _map$get;
              (_map$get = map.get(key)) == null || _map$get.push(value);
              acc[key] = function() {
                var _map$get2;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                return (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.map((fn) => fn(...args)).find((val) => val !== void 0);
              };
            }
          } else {
            acc[key] = value;
          }
        });
        return acc;
      }, {})
    };
  }
  function useInteractions(propsList) {
    if (propsList === void 0) {
      propsList = [];
    }
    const referenceDeps = propsList.map((key) => key == null ? void 0 : key.reference);
    const floatingDeps = propsList.map((key) => key == null ? void 0 : key.floating);
    const itemDeps = propsList.map((key) => key == null ? void 0 : key.item);
    const getReferenceProps = React10__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "reference"),
      referenceDeps
    );
    const getFloatingProps = React10__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "floating"),
      floatingDeps
    );
    const getItemProps = React10__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "item"),
      itemDeps
    );
    return React10__namespace.useMemo(() => ({
      getReferenceProps,
      getFloatingProps,
      getItemProps
    }), [getReferenceProps, getFloatingProps, getItemProps]);
  }
  var componentRoleToAriaRoleMap =  new Map([["select", "listbox"], ["combobox", "listbox"], ["label", false]]);
  function useRole(context, props) {
    var _componentRoleToAriaR;
    if (props === void 0) {
      props = {};
    }
    const {
      open,
      floatingId
    } = context;
    const {
      enabled = true,
      role = "dialog"
    } = props;
    const ariaRole = (_componentRoleToAriaR = componentRoleToAriaRoleMap.get(role)) != null ? _componentRoleToAriaR : role;
    const referenceId = useId2();
    const parentId = useFloatingParentNodeId();
    const isNested = parentId != null;
    const reference = React10__namespace.useMemo(() => {
      if (ariaRole === "tooltip" || role === "label") {
        return {
          ["aria-" + (role === "label" ? "labelledby" : "describedby")]: open ? floatingId : void 0
        };
      }
      return {
        "aria-expanded": open ? "true" : "false",
        "aria-haspopup": ariaRole === "alertdialog" ? "dialog" : ariaRole,
        "aria-controls": open ? floatingId : void 0,
        ...ariaRole === "listbox" && {
          role: "combobox"
        },
        ...ariaRole === "menu" && {
          id: referenceId
        },
        ...ariaRole === "menu" && isNested && {
          role: "menuitem"
        },
        ...role === "select" && {
          "aria-autocomplete": "none"
        },
        ...role === "combobox" && {
          "aria-autocomplete": "list"
        }
      };
    }, [ariaRole, floatingId, isNested, open, referenceId, role]);
    const floating = React10__namespace.useMemo(() => {
      const floatingProps = {
        id: floatingId,
        ...ariaRole && {
          role: ariaRole
        }
      };
      if (ariaRole === "tooltip" || role === "label") {
        return floatingProps;
      }
      return {
        ...floatingProps,
        ...ariaRole === "menu" && {
          "aria-labelledby": referenceId
        }
      };
    }, [ariaRole, floatingId, referenceId, role]);
    const item = React10__namespace.useCallback((_ref) => {
      let {
        active,
        selected
      } = _ref;
      const commonProps = {
        role: "option",
        ...active && {
          id: floatingId + "-option"
        }
      };
      switch (role) {
        case "select":
          return {
            ...commonProps,
            "aria-selected": active && selected
          };
        case "combobox": {
          return {
            ...commonProps,
            ...active && {
              "aria-selected": true
            }
          };
        }
      }
      return {};
    }, [floatingId, role]);
    return React10__namespace.useMemo(() => enabled ? {
      reference,
      floating,
      item
    } : {}, [enabled, reference, floating, item]);
  }
  function getFloatingPosition(dir, position) {
    if (dir === "rtl" && (position.includes("right") || position.includes("left"))) {
      const [side, placement] = position.split("-");
      const flippedPosition = side === "right" ? "left" : "right";
      return placement === void 0 ? flippedPosition : `${flippedPosition}-${placement}`;
    }
    return position;
  }
  function horizontalSide(placement, arrowY, arrowOffset, arrowPosition) {
    if (placement === "center" || arrowPosition === "center") {
      return { top: arrowY };
    }
    if (placement === "end") {
      return { bottom: arrowOffset };
    }
    if (placement === "start") {
      return { top: arrowOffset };
    }
    return {};
  }
  function verticalSide(placement, arrowX, arrowOffset, arrowPosition, dir) {
    if (placement === "center" || arrowPosition === "center") {
      return { left: arrowX };
    }
    if (placement === "end") {
      return { [dir === "ltr" ? "right" : "left"]: arrowOffset };
    }
    if (placement === "start") {
      return { [dir === "ltr" ? "left" : "right"]: arrowOffset };
    }
    return {};
  }
  var radiusByFloatingSide = {
    bottom: "borderTopLeftRadius",
    left: "borderTopRightRadius",
    right: "borderBottomLeftRadius",
    top: "borderBottomRightRadius"
  };
  function getArrowPositionStyles({
    position,
    arrowSize,
    arrowOffset,
    arrowRadius,
    arrowPosition,
    arrowX,
    arrowY,
    dir
  }) {
    const [side, placement = "center"] = position.split("-");
    const baseStyles = {
      width: arrowSize,
      height: arrowSize,
      transform: "rotate(45deg)",
      position: "absolute",
      [radiusByFloatingSide[side]]: arrowRadius
    };
    const arrowPlacement = -arrowSize / 2;
    if (side === "left") {
      return {
        ...baseStyles,
        ...horizontalSide(placement, arrowY, arrowOffset, arrowPosition),
        right: arrowPlacement,
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        clipPath: "polygon(100% 0, 0 0, 100% 100%)"
      };
    }
    if (side === "right") {
      return {
        ...baseStyles,
        ...horizontalSide(placement, arrowY, arrowOffset, arrowPosition),
        left: arrowPlacement,
        borderRightColor: "transparent",
        borderTopColor: "transparent",
        clipPath: "polygon(0 100%, 0 0, 100% 100%)"
      };
    }
    if (side === "top") {
      return {
        ...baseStyles,
        ...verticalSide(placement, arrowX, arrowOffset, arrowPosition, dir),
        bottom: arrowPlacement,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        clipPath: "polygon(0 100%, 100% 100%, 100% 0)"
      };
    }
    if (side === "bottom") {
      return {
        ...baseStyles,
        ...verticalSide(placement, arrowX, arrowOffset, arrowPosition, dir),
        top: arrowPlacement,
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
        clipPath: "polygon(0 100%, 0 0, 100% 0)"
      };
    }
    return {};
  }
  var FloatingArrow = React10.forwardRef(
    ({
      position,
      arrowSize,
      arrowOffset,
      arrowRadius,
      arrowPosition,
      visible,
      arrowX,
      arrowY,
      style,
      ...others
    }, ref) => {
      const { dir } = useDirection();
      if (!visible) {
        return null;
      }
      return  jsxRuntime.jsx(
        "div",
        {
          ...others,
          ref,
          style: {
            ...style,
            ...getArrowPositionStyles({
              position,
              arrowSize,
              arrowOffset,
              arrowRadius,
              arrowPosition,
              dir,
              arrowX,
              arrowY
            })
          }
        }
      );
    }
  );
  FloatingArrow.displayName = "@mantine/core/FloatingArrow";
  var [PopoverContextProvider, usePopoverContext] = createSafeContext(
    "Popover component was not found in the tree"
  );
  function FocusTrap({
    children,
    active = true,
    refProp = "ref",
    innerRef
  }) {
    const focusTrapRef = hooks.useFocusTrap(active);
    const ref = hooks.useMergedRef(focusTrapRef, innerRef);
    if (!isElement(children)) {
      return children;
    }
    return React10.cloneElement(children, { [refProp]: ref });
  }
  function FocusTrapInitialFocus(props) {
    return  jsxRuntime.jsx(VisuallyHidden, { tabIndex: -1, "data-autofocus": true, ...props });
  }
  FocusTrap.displayName = "@mantine/core/FocusTrap";
  FocusTrapInitialFocus.displayName = "@mantine/core/FocusTrapInitialFocus";
  FocusTrap.InitialFocus = FocusTrapInitialFocus;
  function createPortalNode(props) {
    const node = document.createElement("div");
    node.setAttribute("data-portal", "true");
    typeof props.className === "string" && node.classList.add(...props.className.split(" ").filter(Boolean));
    typeof props.style === "object" && Object.assign(node.style, props.style);
    typeof props.id === "string" && node.setAttribute("id", props.id);
    return node;
  }
  var defaultProps7 = {};
  var Portal = React10.forwardRef((props, ref) => {
    const { children, target, ...others } = useProps("Portal", defaultProps7, props);
    const [mounted, setMounted] = React10.useState(false);
    const nodeRef = React10.useRef(null);
    hooks.useIsomorphicEffect(() => {
      setMounted(true);
      nodeRef.current = !target ? createPortalNode(others) : typeof target === "string" ? document.querySelector(target) : target;
      hooks.assignRef(ref, nodeRef.current);
      if (!target && nodeRef.current) {
        document.body.appendChild(nodeRef.current);
      }
      return () => {
        if (!target && nodeRef.current) {
          document.body.removeChild(nodeRef.current);
        }
      };
    }, [target]);
    if (!mounted || !nodeRef.current) {
      return null;
    }
    return ReactDOM.createPortal( jsxRuntime.jsx(jsxRuntime.Fragment, { children }), nodeRef.current);
  });
  Portal.displayName = "@mantine/core/Portal";
  function OptionalPortal({ withinPortal = true, children, ...others }) {
    if (withinPortal) {
      return  jsxRuntime.jsx(Portal, { ...others, children });
    }
    return  jsxRuntime.jsx(jsxRuntime.Fragment, { children });
  }
  OptionalPortal.displayName = "@mantine/core/OptionalPortal";
  var popIn = (from) => ({
    in: { opacity: 1, transform: "scale(1)" },
    out: { opacity: 0, transform: `scale(.9) translateY(${rem(from === "bottom" ? 10 : -10)})` },
    transitionProperty: "transform, opacity"
  });
  var transitions = {
    fade: {
      in: { opacity: 1 },
      out: { opacity: 0 },
      transitionProperty: "opacity"
    },
    "fade-up": {
      in: { opacity: 1, transform: "translateY(0)" },
      out: { opacity: 0, transform: `translateY(${rem(30)}` },
      transitionProperty: "opacity, transform"
    },
    "fade-down": {
      in: { opacity: 1, transform: "translateY(0)" },
      out: { opacity: 0, transform: `translateY(${rem(-30)}` },
      transitionProperty: "opacity, transform"
    },
    "fade-left": {
      in: { opacity: 1, transform: "translateX(0)" },
      out: { opacity: 0, transform: `translateX(${rem(30)}` },
      transitionProperty: "opacity, transform"
    },
    "fade-right": {
      in: { opacity: 1, transform: "translateX(0)" },
      out: { opacity: 0, transform: `translateX(${rem(-30)}` },
      transitionProperty: "opacity, transform"
    },
    scale: {
      in: { opacity: 1, transform: "scale(1)" },
      out: { opacity: 0, transform: "scale(0)" },
      common: { transformOrigin: "top" },
      transitionProperty: "transform, opacity"
    },
    "scale-y": {
      in: { opacity: 1, transform: "scaleY(1)" },
      out: { opacity: 0, transform: "scaleY(0)" },
      common: { transformOrigin: "top" },
      transitionProperty: "transform, opacity"
    },
    "scale-x": {
      in: { opacity: 1, transform: "scaleX(1)" },
      out: { opacity: 0, transform: "scaleX(0)" },
      common: { transformOrigin: "left" },
      transitionProperty: "transform, opacity"
    },
    "skew-up": {
      in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
      out: { opacity: 0, transform: `translateY(${rem(-20)}) skew(-10deg, -5deg)` },
      common: { transformOrigin: "top" },
      transitionProperty: "transform, opacity"
    },
    "skew-down": {
      in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
      out: { opacity: 0, transform: `translateY(${rem(20)}) skew(-10deg, -5deg)` },
      common: { transformOrigin: "bottom" },
      transitionProperty: "transform, opacity"
    },
    "rotate-left": {
      in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
      out: { opacity: 0, transform: `translateY(${rem(20)}) rotate(-5deg)` },
      common: { transformOrigin: "bottom" },
      transitionProperty: "transform, opacity"
    },
    "rotate-right": {
      in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
      out: { opacity: 0, transform: `translateY(${rem(20)}) rotate(5deg)` },
      common: { transformOrigin: "top" },
      transitionProperty: "transform, opacity"
    },
    "slide-down": {
      in: { opacity: 1, transform: "translateY(0)" },
      out: { opacity: 0, transform: "translateY(-100%)" },
      common: { transformOrigin: "top" },
      transitionProperty: "transform, opacity"
    },
    "slide-up": {
      in: { opacity: 1, transform: "translateY(0)" },
      out: { opacity: 0, transform: "translateY(100%)" },
      common: { transformOrigin: "bottom" },
      transitionProperty: "transform, opacity"
    },
    "slide-left": {
      in: { opacity: 1, transform: "translateX(0)" },
      out: { opacity: 0, transform: "translateX(100%)" },
      common: { transformOrigin: "left" },
      transitionProperty: "transform, opacity"
    },
    "slide-right": {
      in: { opacity: 1, transform: "translateX(0)" },
      out: { opacity: 0, transform: "translateX(-100%)" },
      common: { transformOrigin: "right" },
      transitionProperty: "transform, opacity"
    },
    pop: {
      ...popIn("bottom"),
      common: { transformOrigin: "center center" }
    },
    "pop-bottom-left": {
      ...popIn("bottom"),
      common: { transformOrigin: "bottom left" }
    },
    "pop-bottom-right": {
      ...popIn("bottom"),
      common: { transformOrigin: "bottom right" }
    },
    "pop-top-left": {
      ...popIn("top"),
      common: { transformOrigin: "top left" }
    },
    "pop-top-right": {
      ...popIn("top"),
      common: { transformOrigin: "top right" }
    }
  };
  var transitionStatuses = {
    entering: "in",
    entered: "in",
    exiting: "out",
    exited: "out",
    "pre-exiting": "out",
    "pre-entering": "out"
  };
  function getTransitionStyles({
    transition,
    state,
    duration,
    timingFunction
  }) {
    const shared = {
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: timingFunction
    };
    if (typeof transition === "string") {
      if (!(transition in transitions)) {
        return {};
      }
      return {
        transitionProperty: transitions[transition].transitionProperty,
        ...shared,
        ...transitions[transition].common,
        ...transitions[transition][transitionStatuses[state]]
      };
    }
    return {
      transitionProperty: transition.transitionProperty,
      ...shared,
      ...transition.common,
      ...transition[transitionStatuses[state]]
    };
  }
  function useTransition({
    duration,
    exitDuration,
    timingFunction,
    mounted,
    onEnter,
    onExit,
    onEntered,
    onExited,
    enterDelay,
    exitDelay
  }) {
    const theme = useMantineTheme();
    const shouldReduceMotion = hooks.useReducedMotion();
    const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
    const [transitionDuration, setTransitionDuration] = React10.useState(reduceMotion ? 0 : duration);
    const [transitionStatus, setStatus] = React10.useState(mounted ? "entered" : "exited");
    const transitionTimeoutRef = React10.useRef(-1);
    const delayTimeoutRef = React10.useRef(-1);
    const rafRef = React10.useRef(-1);
    const handleStateChange = (shouldMount) => {
      const preHandler = shouldMount ? onEnter : onExit;
      const handler = shouldMount ? onEntered : onExited;
      window.clearTimeout(transitionTimeoutRef.current);
      const newTransitionDuration = reduceMotion ? 0 : shouldMount ? duration : exitDuration;
      setTransitionDuration(newTransitionDuration);
      if (newTransitionDuration === 0) {
        typeof preHandler === "function" && preHandler();
        typeof handler === "function" && handler();
        setStatus(shouldMount ? "entered" : "exited");
      } else {
        rafRef.current = requestAnimationFrame(() => {
          ReactDOM.flushSync(() => {
            setStatus(shouldMount ? "pre-entering" : "pre-exiting");
          });
          rafRef.current = requestAnimationFrame(() => {
            typeof preHandler === "function" && preHandler();
            setStatus(shouldMount ? "entering" : "exiting");
            transitionTimeoutRef.current = window.setTimeout(() => {
              typeof handler === "function" && handler();
              setStatus(shouldMount ? "entered" : "exited");
            }, newTransitionDuration);
          });
        });
      }
    };
    const handleTransitionWithDelay = (shouldMount) => {
      window.clearTimeout(delayTimeoutRef.current);
      const delay = shouldMount ? enterDelay : exitDelay;
      if (typeof delay !== "number") {
        handleStateChange(shouldMount);
        return;
      }
      delayTimeoutRef.current = window.setTimeout(
        () => {
          handleStateChange(shouldMount);
        },
        shouldMount ? enterDelay : exitDelay
      );
    };
    hooks.useDidUpdate(() => {
      handleTransitionWithDelay(mounted);
    }, [mounted]);
    React10.useEffect(
      () => () => {
        window.clearTimeout(transitionTimeoutRef.current);
        cancelAnimationFrame(rafRef.current);
      },
      []
    );
    return {
      transitionDuration,
      transitionStatus,
      transitionTimingFunction: timingFunction || "ease"
    };
  }
  function Transition({
    keepMounted,
    transition = "fade",
    duration = 250,
    exitDuration = duration,
    mounted,
    children,
    timingFunction = "ease",
    onExit,
    onEntered,
    onEnter,
    onExited,
    enterDelay,
    exitDelay
  }) {
    const { transitionDuration, transitionStatus, transitionTimingFunction } = useTransition({
      mounted,
      exitDuration,
      duration,
      timingFunction,
      onExit,
      onEntered,
      onEnter,
      onExited,
      enterDelay,
      exitDelay
    });
    if (transitionDuration === 0) {
      return mounted ?  jsxRuntime.jsx(jsxRuntime.Fragment, { children: children({}) }) : keepMounted ? children({ display: "none" }) : null;
    }
    return transitionStatus === "exited" ? keepMounted ? children({ display: "none" }) : null :  jsxRuntime.jsx(jsxRuntime.Fragment, { children: children(
      getTransitionStyles({
        transition,
        duration: transitionDuration,
        state: transitionStatus,
        timingFunction: transitionTimingFunction
      })
    ) });
  }
  Transition.displayName = "@mantine/core/Transition";
  var classes5 = { "dropdown": "m_38a85659", "arrow": "m_a31dc6c1" };
  var defaultProps8 = {};
  var PopoverDropdown = factory((_props, ref) => {
    const props = useProps("PopoverDropdown", defaultProps8, _props);
    const {
      className,
      style,
      vars,
      children,
      onKeyDownCapture,
      variant,
      classNames,
      styles,
      ...others
    } = props;
    const ctx = usePopoverContext();
    const returnFocus = hooks.useFocusReturn({
      opened: ctx.opened,
      shouldReturnFocus: ctx.returnFocus
    });
    const accessibleProps = ctx.withRoles ? {
      "aria-labelledby": ctx.getTargetId(),
      id: ctx.getDropdownId(),
      role: "dialog",
      tabIndex: -1
    } : {};
    const mergedRef = hooks.useMergedRef(ref, ctx.floating);
    if (ctx.disabled) {
      return null;
    }
    return  jsxRuntime.jsx(OptionalPortal, { ...ctx.portalProps, withinPortal: ctx.withinPortal, children:  jsxRuntime.jsx(
      Transition,
      {
        mounted: ctx.opened,
        ...ctx.transitionProps,
        transition: ctx.transitionProps?.transition || "fade",
        duration: ctx.transitionProps?.duration ?? 150,
        keepMounted: ctx.keepMounted,
        exitDuration: typeof ctx.transitionProps?.exitDuration === "number" ? ctx.transitionProps.exitDuration : ctx.transitionProps?.duration,
        children: (transitionStyles) =>  jsxRuntime.jsx(FocusTrap, { active: ctx.trapFocus && ctx.opened, innerRef: mergedRef, children:  jsxRuntime.jsxs(
          Box,
          {
            ...accessibleProps,
            ...others,
            variant,
            onKeyDownCapture: closeOnEscape(ctx.onClose, {
              active: ctx.closeOnEscape,
              onTrigger: returnFocus,
              onKeyDown: onKeyDownCapture
            }),
            "data-position": ctx.placement,
            "data-fixed": ctx.floatingStrategy === "fixed" || void 0,
            ...ctx.getStyles("dropdown", {
              className,
              props,
              classNames,
              styles,
              style: [
                {
                  ...transitionStyles,
                  zIndex: ctx.zIndex,
                  top: ctx.y ?? 0,
                  left: ctx.x ?? 0,
                  width: ctx.width === "target" ? void 0 : rem(ctx.width)
                },
                ctx.resolvedStyles.dropdown,
                styles?.dropdown,
                style
              ]
            }),
            children: [
              children,
               jsxRuntime.jsx(
                FloatingArrow,
                {
                  ref: ctx.arrowRef,
                  arrowX: ctx.arrowX,
                  arrowY: ctx.arrowY,
                  visible: ctx.withArrow,
                  position: ctx.placement,
                  arrowSize: ctx.arrowSize,
                  arrowRadius: ctx.arrowRadius,
                  arrowOffset: ctx.arrowOffset,
                  arrowPosition: ctx.arrowPosition,
                  ...ctx.getStyles("arrow", {
                    props,
                    classNames,
                    styles
                  })
                }
              )
            ]
          }
        ) })
      }
    ) });
  });
  PopoverDropdown.classes = classes5;
  PopoverDropdown.displayName = "@mantine/core/PopoverDropdown";
  var defaultProps9 = {
    refProp: "ref",
    popupType: "dialog"
  };
  var PopoverTarget = factory((props, ref) => {
    const { children, refProp, popupType, ...others } = useProps(
      "PopoverTarget",
      defaultProps9,
      props
    );
    if (!isElement(children)) {
      throw new Error(
        "Popover.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const forwardedProps = others;
    const ctx = usePopoverContext();
    const targetRef = hooks.useMergedRef(ctx.reference, getRefProp(children), ref);
    const accessibleProps = ctx.withRoles ? {
      "aria-haspopup": popupType,
      "aria-expanded": ctx.opened,
      "aria-controls": ctx.getDropdownId(),
      id: ctx.getTargetId()
    } : {};
    return React10.cloneElement(children, {
      ...forwardedProps,
      ...accessibleProps,
      ...ctx.targetProps,
      className: clsx_default(
        ctx.targetProps.className,
        forwardedProps.className,
        children.props.className
      ),
      [refProp]: targetRef,
      ...!ctx.controlled ? { onClick: ctx.onToggle } : null
    });
  });
  PopoverTarget.displayName = "@mantine/core/PopoverTarget";
  function useFloatingAutoUpdate({
    opened,
    floating,
    position,
    positionDependencies
  }) {
    const [delayedUpdate, setDelayedUpdate] = React10.useState(0);
    React10.useEffect(() => {
      if (floating.refs.reference.current && floating.refs.floating.current && opened) {
        return autoUpdate(
          floating.refs.reference.current,
          floating.refs.floating.current,
          floating.update
        );
      }
      return void 0;
    }, [
      floating.refs.reference.current,
      floating.refs.floating.current,
      opened,
      delayedUpdate,
      position
    ]);
    hooks.useDidUpdate(() => {
      floating.update();
    }, positionDependencies);
    hooks.useDidUpdate(() => {
      setDelayedUpdate((c) => c + 1);
    }, [opened]);
  }
  function getDefaultMiddlewares(middlewares) {
    if (middlewares === void 0) {
      return { shift: true, flip: true };
    }
    const result = { ...middlewares };
    if (middlewares.shift === void 0) {
      result.shift = true;
    }
    if (middlewares.flip === void 0) {
      result.flip = true;
    }
    return result;
  }
  function getPopoverMiddlewares(options, getFloating) {
    const middlewaresOptions = getDefaultMiddlewares(options.middlewares);
    const middlewares = [offset3(options.offset)];
    if (middlewaresOptions.shift) {
      middlewares.push(
        shift3(
          typeof middlewaresOptions.shift === "boolean" ? { limiter: limitShift3(), padding: 5 } : { limiter: limitShift3(), padding: 5, ...middlewaresOptions.shift }
        )
      );
    }
    if (middlewaresOptions.flip) {
      middlewares.push(
        typeof middlewaresOptions.flip === "boolean" ? flip3() : flip3(middlewaresOptions.flip)
      );
    }
    if (middlewaresOptions.inline) {
      middlewares.push(
        typeof middlewaresOptions.inline === "boolean" ? inline3() : inline3(middlewaresOptions.inline)
      );
    }
    middlewares.push(arrow3({ element: options.arrowRef, padding: options.arrowOffset }));
    if (middlewaresOptions.size || options.width === "target") {
      middlewares.push(
        size3({
          ...typeof middlewaresOptions.size === "boolean" ? {} : middlewaresOptions.size,
          apply({ rects, availableWidth, availableHeight, ...rest }) {
            const floating = getFloating();
            const styles = floating.refs.floating.current?.style ?? {};
            if (middlewaresOptions.size) {
              if (typeof middlewaresOptions.size === "object" && !!middlewaresOptions.size.apply) {
                middlewaresOptions.size.apply({ rects, availableWidth, availableHeight, ...rest });
              } else {
                Object.assign(styles, {
                  maxWidth: `${availableWidth}px`,
                  maxHeight: `${availableHeight}px`
                });
              }
            }
            if (options.width === "target") {
              Object.assign(styles, {
                width: `${rects.reference.width}px`
              });
            }
          }
        })
      );
    }
    return middlewares;
  }
  function usePopover(options) {
    const [_opened, setOpened] = hooks.useUncontrolled({
      value: options.opened,
      defaultValue: options.defaultOpened,
      finalValue: false,
      onChange: options.onChange
    });
    const previouslyOpened = React10.useRef(_opened);
    const onClose = () => {
      if (_opened) {
        setOpened(false);
      }
    };
    const onToggle = () => setOpened(!_opened);
    const floating = useFloating2({
      strategy: options.strategy,
      placement: options.position,
      middleware: getPopoverMiddlewares(options, () => floating)
    });
    useFloatingAutoUpdate({
      opened: _opened,
      position: options.position,
      positionDependencies: options.positionDependencies || [],
      floating
    });
    hooks.useDidUpdate(() => {
      options.onPositionChange?.(floating.placement);
    }, [floating.placement]);
    hooks.useDidUpdate(() => {
      if (_opened !== previouslyOpened.current) {
        if (!_opened) {
          options.onClose?.();
        } else {
          options.onOpen?.();
        }
      }
      previouslyOpened.current = _opened;
    }, [_opened, options.onClose, options.onOpen]);
    return {
      floating,
      controlled: typeof options.opened === "boolean",
      opened: _opened,
      onClose,
      onToggle
    };
  }
  var defaultProps10 = {
    position: "bottom",
    offset: 8,
    positionDependencies: [],
    transitionProps: { transition: "fade", duration: 150 },
    middlewares: { flip: true, shift: true, inline: false },
    arrowSize: 7,
    arrowOffset: 5,
    arrowRadius: 0,
    arrowPosition: "side",
    closeOnClickOutside: true,
    withinPortal: true,
    closeOnEscape: true,
    trapFocus: false,
    withRoles: true,
    returnFocus: false,
    clickOutsideEvents: ["mousedown", "touchstart"],
    zIndex: getDefaultZIndex("popover"),
    __staticSelector: "Popover",
    width: "max-content"
  };
  var varsResolver3 = createVarsResolver((_, { radius, shadow }) => ({
    dropdown: {
      "--popover-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--popover-shadow": getShadow(shadow)
    }
  }));
  function Popover(_props) {
    const props = useProps("Popover", defaultProps10, _props);
    const {
      children,
      position,
      offset: offset4,
      onPositionChange,
      positionDependencies,
      opened,
      transitionProps,
      onExitTransitionEnd,
      onEnterTransitionEnd,
      width,
      middlewares,
      withArrow,
      arrowSize,
      arrowOffset,
      arrowRadius,
      arrowPosition,
      unstyled,
      classNames,
      styles,
      closeOnClickOutside,
      withinPortal,
      portalProps,
      closeOnEscape: closeOnEscape2,
      clickOutsideEvents,
      trapFocus,
      onClose,
      onOpen,
      onChange,
      zIndex,
      radius,
      shadow,
      id,
      defaultOpened,
      __staticSelector,
      withRoles,
      disabled,
      returnFocus,
      variant,
      keepMounted,
      vars,
      floatingStrategy,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: __staticSelector,
      props,
      classes: classes5,
      classNames,
      styles,
      unstyled,
      rootSelector: "dropdown",
      vars,
      varsResolver: varsResolver3
    });
    const { resolvedStyles } = useResolvedStylesApi({ classNames, styles, props });
    const arrowRef = React10.useRef(null);
    const [targetNode, setTargetNode] = React10.useState(null);
    const [dropdownNode, setDropdownNode] = React10.useState(null);
    const { dir } = useDirection();
    const uid = hooks.useId(id);
    const popover = usePopover({
      middlewares,
      width,
      position: getFloatingPosition(dir, position),
      offset: typeof offset4 === "number" ? offset4 + (withArrow ? arrowSize / 2 : 0) : offset4,
      arrowRef,
      arrowOffset,
      onPositionChange,
      positionDependencies,
      opened,
      defaultOpened,
      onChange,
      onOpen,
      onClose,
      strategy: floatingStrategy
    });
    hooks.useClickOutside(() => closeOnClickOutside && popover.onClose(), clickOutsideEvents, [
      targetNode,
      dropdownNode
    ]);
    const reference = React10.useCallback(
      (node) => {
        setTargetNode(node);
        popover.floating.refs.setReference(node);
      },
      [popover.floating.refs.setReference]
    );
    const floating = React10.useCallback(
      (node) => {
        setDropdownNode(node);
        popover.floating.refs.setFloating(node);
      },
      [popover.floating.refs.setFloating]
    );
    const onExited = React10.useCallback(() => {
      transitionProps?.onExited?.();
      onExitTransitionEnd?.();
    }, [transitionProps?.onExited, onExitTransitionEnd]);
    const onEntered = React10.useCallback(() => {
      transitionProps?.onEntered?.();
      onEnterTransitionEnd?.();
    }, [transitionProps?.onEntered, onEnterTransitionEnd]);
    return  jsxRuntime.jsx(
      PopoverContextProvider,
      {
        value: {
          returnFocus,
          disabled,
          controlled: popover.controlled,
          reference,
          floating,
          x: popover.floating.x,
          y: popover.floating.y,
          arrowX: popover.floating?.middlewareData?.arrow?.x,
          arrowY: popover.floating?.middlewareData?.arrow?.y,
          opened: popover.opened,
          arrowRef,
          transitionProps: { ...transitionProps, onExited, onEntered },
          width,
          withArrow,
          arrowSize,
          arrowOffset,
          arrowRadius,
          arrowPosition,
          placement: popover.floating.placement,
          trapFocus,
          withinPortal,
          portalProps,
          zIndex,
          radius,
          shadow,
          closeOnEscape: closeOnEscape2,
          onClose: popover.onClose,
          onToggle: popover.onToggle,
          getTargetId: () => `${uid}-target`,
          getDropdownId: () => `${uid}-dropdown`,
          withRoles,
          targetProps: others,
          __staticSelector,
          classNames,
          styles,
          unstyled,
          variant,
          keepMounted,
          getStyles: getStyles2,
          resolvedStyles,
          floatingStrategy
        },
        children
      }
    );
  }
  Popover.Target = PopoverTarget;
  Popover.Dropdown = PopoverDropdown;
  Popover.displayName = "@mantine/core/Popover";
  Popover.extend = (input) => input;
  var classes6 = { "root": "m_5ae2e3c", "barsLoader": "m_7a2bd4cd", "bar": "m_870bb79", "bars-loader-animation": "m_5d2b3b9d", "dotsLoader": "m_4e3f22d7", "dot": "m_870c4af", "loader-dots-animation": "m_aac34a1", "ovalLoader": "m_b34414df", "oval-loader-animation": "m_f8e89c4b" };
  var Bars = React10.forwardRef(({ className, ...others }, ref) =>  jsxRuntime.jsxs(Box, { component: "span", className: clsx_default(classes6.barsLoader, className), ...others, ref, children: [
     jsxRuntime.jsx("span", { className: classes6.bar }),
     jsxRuntime.jsx("span", { className: classes6.bar }),
     jsxRuntime.jsx("span", { className: classes6.bar })
  ] }));
  Bars.displayName = "@mantine/core/Bars";
  var Dots = React10.forwardRef(({ className, ...others }, ref) =>  jsxRuntime.jsxs(Box, { component: "span", className: clsx_default(classes6.dotsLoader, className), ...others, ref, children: [
     jsxRuntime.jsx("span", { className: classes6.dot }),
     jsxRuntime.jsx("span", { className: classes6.dot }),
     jsxRuntime.jsx("span", { className: classes6.dot })
  ] }));
  Dots.displayName = "@mantine/core/Dots";
  var Oval = React10.forwardRef(({ className, ...others }, ref) =>  jsxRuntime.jsx(Box, { component: "span", className: clsx_default(classes6.ovalLoader, className), ...others, ref }));
  Oval.displayName = "@mantine/core/Oval";
  var defaultLoaders = {
    bars: Bars,
    oval: Oval,
    dots: Dots
  };
  var defaultProps11 = {
    loaders: defaultLoaders,
    type: "oval"
  };
  var varsResolver4 = createVarsResolver((theme, { size: size4, color }) => ({
    root: {
      "--loader-size": getSize(size4, "loader-size"),
      "--loader-color": color ? getThemeColor(color, theme) : void 0
    }
  }));
  var Loader = factory((_props, ref) => {
    const props = useProps("Loader", defaultProps11, _props);
    const {
      size: size4,
      color,
      type,
      vars,
      className,
      style,
      classNames,
      styles,
      unstyled,
      loaders,
      variant,
      children,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Loader",
      props,
      classes: classes6,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver4
    });
    if (children) {
      return  jsxRuntime.jsx(Box, { ...getStyles2("root"), ref, ...others, children });
    }
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root"),
        ref,
        component: loaders[type],
        variant,
        size: size4,
        ...others
      }
    );
  });
  Loader.defaultLoaders = defaultLoaders;
  Loader.classes = classes6;
  Loader.displayName = "@mantine/core/Loader";
  var classes7 = { "root": "m_8d3f4000", "icon": "m_8d3afb97", "loader": "m_302b9fb1", "group": "m_1a0f1b21", "groupSection": "m_437b6484" };
  var defaultProps12 = {
    orientation: "horizontal"
  };
  var varsResolver5 = createVarsResolver((_, { borderWidth }) => ({
    group: { "--ai-border-width": rem(borderWidth) }
  }));
  var ActionIconGroup = factory((_props, ref) => {
    const props = useProps("ActionIconGroup", defaultProps12, _props);
    const {
      className,
      style,
      classNames,
      styles,
      unstyled,
      orientation,
      vars,
      borderWidth,
      variant,
      mod,
      ...others
    } = useProps("ActionIconGroup", defaultProps12, _props);
    const getStyles2 = useStyles({
      name: "ActionIconGroup",
      props,
      classes: classes7,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver5,
      rootSelector: "group"
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("group"),
        ref,
        variant,
        mod: [{ "data-orientation": orientation }, mod],
        role: "group",
        ...others
      }
    );
  });
  ActionIconGroup.classes = classes7;
  ActionIconGroup.displayName = "@mantine/core/ActionIconGroup";
  var defaultProps13 = {};
  var varsResolver6 = createVarsResolver(
    (theme, { radius, color, gradient, variant, autoContrast, size: size4 }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        groupSection: {
          "--section-height": getSize(size4, "section-height"),
          "--section-padding-x": getSize(size4, "section-padding-x"),
          "--section-fz": getFontSize(size4),
          "--section-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--section-bg": color || variant ? colors.background : void 0,
          "--section-color": colors.color,
          "--section-bd": color || variant ? colors.border : void 0
        }
      };
    }
  );
  var ActionIconGroupSection = factory((_props, ref) => {
    const props = useProps("ActionIconGroupSection", defaultProps13, _props);
    const {
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      variant,
      gradient,
      radius,
      autoContrast,
      ...others
    } = useProps("ActionIconGroupSection", defaultProps13, _props);
    const getStyles2 = useStyles({
      name: "ActionIconGroupSection",
      props,
      classes: classes7,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver6,
      rootSelector: "groupSection"
    });
    return  jsxRuntime.jsx(Box, { ...getStyles2("groupSection"), ref, variant, ...others });
  });
  ActionIconGroupSection.classes = classes7;
  ActionIconGroupSection.displayName = "@mantine/core/ActionIconGroupSection";
  var defaultProps14 = {};
  var varsResolver7 = createVarsResolver(
    (theme, { size: size4, radius, variant, gradient, color, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        root: {
          "--ai-size": getSize(size4, "ai-size"),
          "--ai-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--ai-bg": color || variant ? colors.background : void 0,
          "--ai-hover": color || variant ? colors.hover : void 0,
          "--ai-hover-color": color || variant ? colors.hoverColor : void 0,
          "--ai-color": colors.color,
          "--ai-bd": color || variant ? colors.border : void 0
        }
      };
    }
  );
  var ActionIcon = polymorphicFactory((_props, ref) => {
    const props = useProps("ActionIcon", defaultProps14, _props);
    const {
      className,
      unstyled,
      variant,
      classNames,
      styles,
      style,
      loading,
      loaderProps,
      size: size4,
      color,
      radius,
      __staticSelector,
      gradient,
      vars,
      children,
      disabled,
      "data-disabled": dataDisabled,
      autoContrast,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: ["ActionIcon", __staticSelector],
      props,
      className,
      style,
      classes: classes7,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver7
    });
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ...getStyles2("root", { active: !disabled && !loading && !dataDisabled }),
        ...others,
        unstyled,
        variant,
        size: size4,
        disabled: disabled || loading,
        ref,
        mod: [{ loading, disabled: disabled || dataDisabled }, mod],
        children: [
           jsxRuntime.jsx(Transition, { mounted: !!loading, transition: "slide-down", duration: 150, children: (transitionStyles) =>  jsxRuntime.jsx(Box, { component: "span", ...getStyles2("loader", { style: transitionStyles }), "aria-hidden": true, children:  jsxRuntime.jsx(Loader, { color: "var(--ai-color)", size: "calc(var(--ai-size) * 0.55)", ...loaderProps }) }) }),
           jsxRuntime.jsx(Box, { component: "span", mod: { loading }, ...getStyles2("icon"), children })
        ]
      }
    );
  });
  ActionIcon.classes = classes7;
  ActionIcon.displayName = "@mantine/core/ActionIcon";
  ActionIcon.Group = ActionIconGroup;
  ActionIcon.GroupSection = ActionIconGroupSection;
  var CloseIcon = React10.forwardRef(
    ({ size: size4 = "var(--cb-icon-size, 70%)", style, ...others }, ref) =>  jsxRuntime.jsx(
      "svg",
      {
        viewBox: "0 0 15 15",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { ...style, width: size4, height: size4 },
        ref,
        ...others,
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    )
  );
  CloseIcon.displayName = "@mantine/core/CloseIcon";
  var classes8 = { "root": "m_86a44da5", "root--subtle": "m_220c80f2" };
  var defaultProps15 = {
    variant: "subtle"
  };
  var varsResolver8 = createVarsResolver((_, { size: size4, radius, iconSize }) => ({
    root: {
      "--cb-size": getSize(size4, "cb-size"),
      "--cb-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--cb-icon-size": rem(iconSize)
    }
  }));
  var CloseButton = polymorphicFactory((_props, ref) => {
    const props = useProps("CloseButton", defaultProps15, _props);
    const {
      iconSize,
      children,
      vars,
      radius,
      className,
      classNames,
      style,
      styles,
      unstyled,
      "data-disabled": dataDisabled,
      disabled,
      variant,
      icon,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "CloseButton",
      props,
      className,
      style,
      classes: classes8,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver8
    });
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ref,
        ...others,
        unstyled,
        variant,
        disabled,
        mod: [{ disabled: disabled || dataDisabled }, mod],
        ...getStyles2("root", { variant, active: !disabled && !dataDisabled }),
        children: [
          icon ||  jsxRuntime.jsx(CloseIcon, {}),
          children
        ]
      }
    );
  });
  CloseButton.classes = classes8;
  CloseButton.displayName = "@mantine/core/CloseButton";
  function filterFalsyChildren(children) {
    return React10.Children.toArray(children).filter(Boolean);
  }
  var classes9 = { "root": "m_4081bf90" };
  var defaultProps16 = {
    preventGrowOverflow: true,
    gap: "md",
    align: "center",
    justify: "flex-start",
    wrap: "wrap"
  };
  var varsResolver9 = createVarsResolver(
    (_, { grow, preventGrowOverflow, gap, align, justify, wrap }, { childWidth }) => ({
      root: {
        "--group-child-width": grow && preventGrowOverflow ? childWidth : void 0,
        "--group-gap": getSpacing(gap),
        "--group-align": align,
        "--group-justify": justify,
        "--group-wrap": wrap
      }
    })
  );
  var Group = factory((_props, ref) => {
    const props = useProps("Group", defaultProps16, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      children,
      gap,
      align,
      justify,
      wrap,
      grow,
      preventGrowOverflow,
      vars,
      variant,
      __size,
      mod,
      ...others
    } = props;
    const filteredChildren = filterFalsyChildren(children);
    const childrenCount = filteredChildren.length;
    const resolvedGap = getSpacing(gap ?? "md");
    const childWidth = `calc(${100 / childrenCount}% - (${resolvedGap} - ${resolvedGap} / ${childrenCount}))`;
    const stylesCtx = { childWidth };
    const getStyles2 = useStyles({
      name: "Group",
      props,
      stylesCtx,
      className,
      style,
      classes: classes9,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver9
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root"),
        ref,
        variant,
        mod: [{ grow }, mod],
        size: __size,
        ...others,
        children: filteredChildren
      }
    );
  });
  Group.classes = classes9;
  Group.displayName = "@mantine/core/Group";
  var classes10 = { "root": "m_9814e45f" };
  var defaultProps17 = {
    zIndex: getDefaultZIndex("modal")
  };
  var varsResolver10 = createVarsResolver(
    (_, { gradient, color, backgroundOpacity, blur, radius, zIndex }) => ({
      root: {
        "--overlay-bg": gradient || (color !== void 0 || backgroundOpacity !== void 0) && rgba(color || "#000", backgroundOpacity ?? 0.6) || void 0,
        "--overlay-filter": blur ? `blur(${rem(blur)})` : void 0,
        "--overlay-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--overlay-z-index": zIndex?.toString()
      }
    })
  );
  var Overlay = polymorphicFactory((_props, ref) => {
    const props = useProps("Overlay", defaultProps17, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      fixed,
      center,
      children,
      radius,
      zIndex,
      gradient,
      blur,
      color,
      backgroundOpacity,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Overlay",
      props,
      classes: classes10,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver10
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), mod: [{ center, fixed }, mod], ...others, children });
  });
  Overlay.classes = classes10;
  Overlay.displayName = "@mantine/core/Overlay";
  var [ModalBaseProvider, useModalBaseContext] = createSafeContext(
    "ModalBase component was not found in tree"
  );
  function useLockScroll({ opened, transitionDuration }) {
    const [shouldLockScroll, setShouldLockScroll] = React10.useState(opened);
    const timeout = React10.useRef(-1);
    const reduceMotion = hooks.useReducedMotion();
    const _transitionDuration = reduceMotion ? 0 : transitionDuration;
    React10.useEffect(() => {
      if (opened) {
        setShouldLockScroll(true);
        window.clearTimeout(timeout.current);
      } else if (_transitionDuration === 0) {
        setShouldLockScroll(false);
      } else {
        timeout.current = window.setTimeout(() => setShouldLockScroll(false), _transitionDuration);
      }
      return () => window.clearTimeout(timeout.current);
    }, [opened, _transitionDuration]);
    return shouldLockScroll;
  }
  function useModal({
    id,
    transitionProps,
    opened,
    trapFocus,
    closeOnEscape: closeOnEscape2,
    onClose,
    returnFocus
  }) {
    const _id = hooks.useId(id);
    const [titleMounted, setTitleMounted] = React10.useState(false);
    const [bodyMounted, setBodyMounted] = React10.useState(false);
    const transitionDuration = typeof transitionProps?.duration === "number" ? transitionProps?.duration : 200;
    const shouldLockScroll = useLockScroll({ opened, transitionDuration });
    hooks.useWindowEvent(
      "keydown",
      (event) => {
        if (event.key === "Escape" && closeOnEscape2 && opened) {
          const shouldTrigger = event.target?.getAttribute("data-mantine-stop-propagation") !== "true";
          shouldTrigger && onClose();
        }
      },
      { capture: true }
    );
    hooks.useFocusReturn({ opened, shouldReturnFocus: trapFocus && returnFocus });
    return {
      _id,
      titleMounted,
      bodyMounted,
      shouldLockScroll,
      setTitleMounted,
      setBodyMounted
    };
  }
  var ModalBase = React10.forwardRef(
    ({
      keepMounted,
      opened,
      onClose,
      id,
      transitionProps,
      onExitTransitionEnd,
      onEnterTransitionEnd,
      trapFocus,
      closeOnEscape: closeOnEscape2,
      returnFocus,
      closeOnClickOutside,
      withinPortal,
      portalProps,
      lockScroll,
      children,
      zIndex,
      shadow,
      padding,
      __vars,
      unstyled,
      removeScrollProps,
      ...others
    }, ref) => {
      const { _id, titleMounted, bodyMounted, shouldLockScroll, setTitleMounted, setBodyMounted } = useModal({ id, transitionProps, opened, trapFocus, closeOnEscape: closeOnEscape2, onClose, returnFocus });
      const { key: removeScrollKey, ...otherRemoveScrollProps } = removeScrollProps || {};
      return  jsxRuntime.jsx(OptionalPortal, { ...portalProps, withinPortal, children:  jsxRuntime.jsx(
        ModalBaseProvider,
        {
          value: {
            opened,
            onClose,
            closeOnClickOutside,
            onExitTransitionEnd,
            onEnterTransitionEnd,
            transitionProps: { ...transitionProps, keepMounted },
            getTitleId: () => `${_id}-title`,
            getBodyId: () => `${_id}-body`,
            titleMounted,
            bodyMounted,
            setTitleMounted,
            setBodyMounted,
            trapFocus,
            closeOnEscape: closeOnEscape2,
            zIndex,
            unstyled
          },
          children:  jsxRuntime.jsx(
            Combination_default,
            {
              enabled: shouldLockScroll && lockScroll,
              ...otherRemoveScrollProps,
              children:  jsxRuntime.jsx(
                Box,
                {
                  ref,
                  ...others,
                  __vars: {
                    ...__vars,
                    "--mb-z-index": (zIndex || getDefaultZIndex("modal")).toString(),
                    "--mb-shadow": getShadow(shadow),
                    "--mb-padding": getSpacing(padding)
                  },
                  children
                }
              )
            },
            removeScrollKey
          )
        }
      ) });
    }
  );
  ModalBase.displayName = "@mantine/core/ModalBase";
  function useModalBodyId() {
    const ctx = useModalBaseContext();
    React10.useEffect(() => {
      ctx.setBodyMounted(true);
      return () => ctx.setBodyMounted(false);
    }, []);
    return ctx.getBodyId();
  }
  var classes11 = { "title": "m_615af6c9", "header": "m_b5489c3c", "inner": "m_60c222c7", "content": "m_fd1ab0aa", "close": "m_606cb269", "body": "m_5df29311" };
  var ModalBaseBody = React10.forwardRef(
    ({ className, ...others }, ref) => {
      const bodyId = useModalBodyId();
      const ctx = useModalBaseContext();
      return  jsxRuntime.jsx(
        Box,
        {
          ref,
          ...others,
          id: bodyId,
          className: clsx_default({ [classes11.body]: !ctx.unstyled }, className)
        }
      );
    }
  );
  ModalBaseBody.displayName = "@mantine/core/ModalBaseBody";
  var ModalBaseCloseButton = React10.forwardRef(
    ({ className, onClick, ...others }, ref) => {
      const ctx = useModalBaseContext();
      return  jsxRuntime.jsx(
        CloseButton,
        {
          ref,
          ...others,
          onClick: (event) => {
            ctx.onClose();
            onClick?.(event);
          },
          className: clsx_default({ [classes11.close]: !ctx.unstyled }, className),
          unstyled: ctx.unstyled
        }
      );
    }
  );
  ModalBaseCloseButton.displayName = "@mantine/core/ModalBaseCloseButton";
  var ModalBaseContent = React10.forwardRef(
    ({ transitionProps, className, innerProps, onKeyDown, style, ...others }, ref) => {
      const ctx = useModalBaseContext();
      return  jsxRuntime.jsx(
        Transition,
        {
          mounted: ctx.opened,
          transition: "pop",
          ...ctx.transitionProps,
          onExited: () => {
            ctx.onExitTransitionEnd?.();
            ctx.transitionProps?.onExited?.();
          },
          onEntered: () => {
            ctx.onEnterTransitionEnd?.();
            ctx.transitionProps?.onEntered?.();
          },
          ...transitionProps,
          children: (transitionStyles) =>  jsxRuntime.jsx(
            "div",
            {
              ...innerProps,
              className: clsx_default({ [classes11.inner]: !ctx.unstyled }, innerProps.className),
              children:  jsxRuntime.jsx(FocusTrap, { active: ctx.opened && ctx.trapFocus, innerRef: ref, children:  jsxRuntime.jsx(
                Paper,
                {
                  ...others,
                  component: "section",
                  role: "dialog",
                  tabIndex: -1,
                  "aria-modal": true,
                  "aria-describedby": ctx.bodyMounted ? ctx.getBodyId() : void 0,
                  "aria-labelledby": ctx.titleMounted ? ctx.getTitleId() : void 0,
                  style: [style, transitionStyles],
                  className: clsx_default({ [classes11.content]: !ctx.unstyled }, className),
                  unstyled: ctx.unstyled,
                  children: others.children
                }
              ) })
            }
          )
        }
      );
    }
  );
  ModalBaseContent.displayName = "@mantine/core/ModalBaseContent";
  var ModalBaseHeader = React10.forwardRef(
    ({ className, ...others }, ref) => {
      const ctx = useModalBaseContext();
      return  jsxRuntime.jsx(
        Box,
        {
          component: "header",
          ref,
          className: clsx_default({ [classes11.header]: !ctx.unstyled }, className),
          ...others
        }
      );
    }
  );
  ModalBaseHeader.displayName = "@mantine/core/ModalBaseHeader";
  var DEFAULT_TRANSITION = {
    duration: 200,
    timingFunction: "ease",
    transition: "fade"
  };
  function useModalTransition(transitionOverride) {
    const ctx = useModalBaseContext();
    return { ...DEFAULT_TRANSITION, ...ctx.transitionProps, ...transitionOverride };
  }
  var ModalBaseOverlay = React10.forwardRef(
    ({ onClick, transitionProps, style, visible, ...others }, ref) => {
      const ctx = useModalBaseContext();
      const transition = useModalTransition(transitionProps);
      return  jsxRuntime.jsx(
        Transition,
        {
          mounted: visible !== void 0 ? visible : ctx.opened,
          ...transition,
          transition: "fade",
          children: (transitionStyles) =>  jsxRuntime.jsx(
            Overlay,
            {
              ref,
              fixed: true,
              style: [style, transitionStyles],
              zIndex: ctx.zIndex,
              unstyled: ctx.unstyled,
              onClick: (event) => {
                onClick?.(event);
                ctx.closeOnClickOutside && ctx.onClose();
              },
              ...others
            }
          )
        }
      );
    }
  );
  ModalBaseOverlay.displayName = "@mantine/core/ModalBaseOverlay";
  function useModalTitle() {
    const ctx = useModalBaseContext();
    React10.useEffect(() => {
      ctx.setTitleMounted(true);
      return () => ctx.setTitleMounted(false);
    }, []);
    return ctx.getTitleId();
  }
  var ModalBaseTitle = React10.forwardRef(
    ({ className, ...others }, ref) => {
      const id = useModalTitle();
      const ctx = useModalBaseContext();
      return  jsxRuntime.jsx(
        Box,
        {
          component: "h2",
          ref,
          className: clsx_default({ [classes11.title]: !ctx.unstyled }, className),
          ...others,
          id
        }
      );
    }
  );
  ModalBaseTitle.displayName = "@mantine/core/ModalBaseTitle";
  function NativeScrollArea({ children }) {
    return  jsxRuntime.jsx(jsxRuntime.Fragment, { children });
  }
  var [InputWrapperProvider, useInputWrapperContext] = createOptionalContext({
    offsetBottom: false,
    offsetTop: false,
    describedBy: void 0,
    getStyles: null,
    inputId: void 0,
    labelId: void 0
  });
  var classes12 = { "wrapper": "m_6c018570", "input": "m_8fb7ebe7", "section": "m_82577fc2", "placeholder": "m_88bacfd0", "root": "m_46b77525", "label": "m_8fdc1311", "required": "m_78a94662", "error": "m_8f816625", "description": "m_fe47ce59" };
  var defaultProps18 = {};
  var varsResolver11 = createVarsResolver((_, { size: size4 }) => ({
    description: {
      "--input-description-size": size4 === void 0 ? void 0 : `calc(${getFontSize(size4)} - ${rem(2)})`
    }
  }));
  var InputDescription = factory((_props, ref) => {
    const props = useProps("InputDescription", defaultProps18, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      __staticSelector,
      __inheritStyles = true,
      variant,
      ...others
    } = useProps("InputDescription", defaultProps18, props);
    const ctx = useInputWrapperContext();
    const _getStyles = useStyles({
      name: ["InputWrapper", __staticSelector],
      props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "description",
      vars,
      varsResolver: varsResolver11
    });
    const getStyles2 = __inheritStyles && ctx?.getStyles || _getStyles;
    return  jsxRuntime.jsx(
      Box,
      {
        component: "p",
        ref,
        variant,
        size: size4,
        ...getStyles2("description", ctx?.getStyles ? { className, style } : void 0),
        ...others
      }
    );
  });
  InputDescription.classes = classes12;
  InputDescription.displayName = "@mantine/core/InputDescription";
  var defaultProps19 = {};
  var varsResolver12 = createVarsResolver((_, { size: size4 }) => ({
    error: {
      "--input-error-size": size4 === void 0 ? void 0 : `calc(${getFontSize(size4)} - ${rem(2)})`
    }
  }));
  var InputError = factory((_props, ref) => {
    const props = useProps("InputError", defaultProps19, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      __staticSelector,
      __inheritStyles = true,
      variant,
      ...others
    } = props;
    const _getStyles = useStyles({
      name: ["InputWrapper", __staticSelector],
      props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "error",
      vars,
      varsResolver: varsResolver12
    });
    const ctx = useInputWrapperContext();
    const getStyles2 = __inheritStyles && ctx?.getStyles || _getStyles;
    return  jsxRuntime.jsx(
      Box,
      {
        component: "p",
        ref,
        variant,
        size: size4,
        ...getStyles2("error", ctx?.getStyles ? { className, style } : void 0),
        ...others
      }
    );
  });
  InputError.classes = classes12;
  InputError.displayName = "@mantine/core/InputError";
  var defaultProps20 = {
    labelElement: "label"
  };
  var varsResolver13 = createVarsResolver((_, { size: size4 }) => ({
    label: {
      "--input-label-size": getFontSize(size4),
      "--input-asterisk-color": void 0
    }
  }));
  var InputLabel = factory((_props, ref) => {
    const props = useProps("InputLabel", defaultProps20, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      labelElement,
      size: size4,
      required,
      htmlFor,
      onMouseDown,
      children,
      __staticSelector,
      variant,
      mod,
      ...others
    } = useProps("InputLabel", defaultProps20, props);
    const _getStyles = useStyles({
      name: ["InputWrapper", __staticSelector],
      props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "label",
      vars,
      varsResolver: varsResolver13
    });
    const ctx = useInputWrapperContext();
    const getStyles2 = ctx?.getStyles || _getStyles;
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("label", ctx?.getStyles ? { className, style } : void 0),
        component: labelElement,
        variant,
        size: size4,
        ref,
        htmlFor: labelElement === "label" ? htmlFor : void 0,
        mod: [{ required }, mod],
        onMouseDown: (event) => {
          onMouseDown?.(event);
          if (!event.defaultPrevented && event.detail > 1) {
            event.preventDefault();
          }
        },
        ...others,
        children: [
          children,
          required &&  jsxRuntime.jsx("span", { ...getStyles2("required"), "aria-hidden": true, children: " *" })
        ]
      }
    );
  });
  InputLabel.classes = classes12;
  InputLabel.displayName = "@mantine/core/InputLabel";
  var defaultProps21 = {};
  var InputPlaceholder = factory((_props, ref) => {
    const props = useProps("InputPlaceholder", defaultProps21, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      __staticSelector,
      variant,
      error: error2,
      mod,
      ...others
    } = useProps("InputPlaceholder", defaultProps21, props);
    const getStyles2 = useStyles({
      name: ["InputPlaceholder", __staticSelector],
      props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "placeholder"
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("placeholder"),
        mod: [{ error: !!error2 }, mod],
        component: "span",
        variant,
        ref,
        ...others
      }
    );
  });
  InputPlaceholder.classes = classes12;
  InputPlaceholder.displayName = "@mantine/core/InputPlaceholder";
  function getInputOffsets(inputWrapperOrder, { hasDescription, hasError }) {
    const inputIndex = inputWrapperOrder.findIndex((part) => part === "input");
    const aboveInput = inputWrapperOrder.slice(0, inputIndex);
    const belowInput = inputWrapperOrder.slice(inputIndex + 1);
    const offsetTop = hasDescription && aboveInput.includes("description") || hasError && aboveInput.includes("error");
    const offsetBottom = hasDescription && belowInput.includes("description") || hasError && belowInput.includes("error");
    return { offsetBottom, offsetTop };
  }
  var defaultProps22 = {
    labelElement: "label",
    inputContainer: (children) => children,
    inputWrapperOrder: ["label", "description", "input", "error"]
  };
  var varsResolver14 = createVarsResolver((_, { size: size4 }) => ({
    label: {
      "--input-label-size": getFontSize(size4),
      "--input-asterisk-color": void 0
    },
    error: {
      "--input-error-size": size4 === void 0 ? void 0 : `calc(${getFontSize(size4)} - ${rem(2)})`
    },
    description: {
      "--input-description-size": size4 === void 0 ? void 0 : `calc(${getFontSize(size4)} - ${rem(2)})`
    }
  }));
  var InputWrapper = factory((_props, ref) => {
    const props = useProps("InputWrapper", defaultProps22, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      variant,
      __staticSelector,
      inputContainer,
      inputWrapperOrder,
      label,
      error: error2,
      description,
      labelProps,
      descriptionProps,
      errorProps,
      labelElement,
      children,
      withAsterisk,
      id,
      required,
      __stylesApiProps,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: ["InputWrapper", __staticSelector],
      props: __stylesApiProps || props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver14
    });
    const sharedProps = {
      size: size4,
      variant,
      __staticSelector
    };
    const idBase = hooks.useId(id);
    const isRequired = typeof withAsterisk === "boolean" ? withAsterisk : required;
    const errorId = errorProps?.id || `${idBase}-error`;
    const descriptionId = descriptionProps?.id || `${idBase}-description`;
    const inputId = idBase;
    const hasError = !!error2 && typeof error2 !== "boolean";
    const hasDescription = !!description;
    const _describedBy = `${hasError ? errorId : ""} ${hasDescription ? descriptionId : ""}`;
    const describedBy = _describedBy.trim().length > 0 ? _describedBy.trim() : void 0;
    const labelId = labelProps?.id || `${idBase}-label`;
    const _label = label &&  jsxRuntime.jsx(
      InputLabel,
      {
        labelElement,
        id: labelId,
        htmlFor: inputId,
        required: isRequired,
        ...sharedProps,
        ...labelProps,
        children: label
      },
      "label"
    );
    const _description = hasDescription &&  jsxRuntime.jsx(
      InputDescription,
      {
        ...descriptionProps,
        ...sharedProps,
        size: descriptionProps?.size || sharedProps.size,
        id: descriptionProps?.id || descriptionId,
        children: description
      },
      "description"
    );
    const _input =  jsxRuntime.jsx(React10.Fragment, { children: inputContainer(children) }, "input");
    const _error = hasError &&  React10.createElement(
      InputError,
      {
        ...errorProps,
        ...sharedProps,
        size: errorProps?.size || sharedProps.size,
        key: "error",
        id: errorProps?.id || errorId
      },
      error2
    );
    const content = inputWrapperOrder.map((part) => {
      switch (part) {
        case "label":
          return _label;
        case "input":
          return _input;
        case "description":
          return _description;
        case "error":
          return _error;
        default:
          return null;
      }
    });
    return  jsxRuntime.jsx(
      InputWrapperProvider,
      {
        value: {
          getStyles: getStyles2,
          describedBy,
          inputId,
          labelId,
          ...getInputOffsets(inputWrapperOrder, { hasDescription, hasError })
        },
        children:  jsxRuntime.jsx(
          Box,
          {
            ref,
            variant,
            size: size4,
            mod: [{ error: !!error2 }, mod],
            ...getStyles2("root"),
            ...others,
            children: content
          }
        )
      }
    );
  });
  InputWrapper.classes = classes12;
  InputWrapper.displayName = "@mantine/core/InputWrapper";
  var defaultProps23 = {
    variant: "default",
    leftSectionPointerEvents: "none",
    rightSectionPointerEvents: "none",
    withAria: true,
    withErrorStyles: true
  };
  var varsResolver15 = createVarsResolver((_, props, ctx) => ({
    wrapper: {
      "--input-margin-top": ctx.offsetTop ? "calc(var(--mantine-spacing-xs) / 2)" : void 0,
      "--input-margin-bottom": ctx.offsetBottom ? "calc(var(--mantine-spacing-xs) / 2)" : void 0,
      "--input-height": getSize(props.size, "input-height"),
      "--input-fz": getFontSize(props.size),
      "--input-radius": props.radius === void 0 ? void 0 : getRadius(props.radius),
      "--input-left-section-width": props.leftSectionWidth !== void 0 ? rem(props.leftSectionWidth) : void 0,
      "--input-right-section-width": props.rightSectionWidth !== void 0 ? rem(props.rightSectionWidth) : void 0,
      "--input-padding-y": props.multiline ? getSize(props.size, "input-padding-y") : void 0,
      "--input-left-section-pointer-events": props.leftSectionPointerEvents,
      "--input-right-section-pointer-events": props.rightSectionPointerEvents
    }
  }));
  var Input = polymorphicFactory((_props, ref) => {
    const props = useProps("Input", defaultProps23, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      required,
      __staticSelector,
      __stylesApiProps,
      size: size4,
      wrapperProps,
      error: error2,
      disabled,
      leftSection,
      leftSectionProps,
      leftSectionWidth,
      rightSection,
      rightSectionProps,
      rightSectionWidth,
      rightSectionPointerEvents,
      leftSectionPointerEvents,
      variant,
      vars,
      pointer,
      multiline,
      radius,
      id,
      withAria,
      withErrorStyles,
      mod,
      inputSize,
      ...others
    } = props;
    const { styleProps, rest } = extractStyleProps(others);
    const ctx = useInputWrapperContext();
    const stylesCtx = { offsetBottom: ctx?.offsetBottom, offsetTop: ctx?.offsetTop };
    const getStyles2 = useStyles({
      name: ["Input", __staticSelector],
      props: __stylesApiProps || props,
      classes: classes12,
      className,
      style,
      classNames,
      styles,
      unstyled,
      stylesCtx,
      rootSelector: "wrapper",
      vars,
      varsResolver: varsResolver15
    });
    const ariaAttributes = withAria ? {
      required,
      disabled,
      "aria-invalid": !!error2,
      "aria-describedby": ctx?.describedBy,
      id: ctx?.inputId || id
    } : {};
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("wrapper"),
        ...styleProps,
        ...wrapperProps,
        mod: [
          {
            error: !!error2 && withErrorStyles,
            pointer,
            disabled,
            multiline,
            "data-with-right-section": !!rightSection,
            "data-with-left-section": !!leftSection
          },
          mod
        ],
        variant,
        size: size4,
        children: [
          leftSection &&  jsxRuntime.jsx(
            "div",
            {
              ...leftSectionProps,
              "data-position": "left",
              ...getStyles2("section", {
                className: leftSectionProps?.className,
                style: leftSectionProps?.style
              }),
              children: leftSection
            }
          ),
           jsxRuntime.jsx(
            Box,
            {
              component: "input",
              ...rest,
              ...ariaAttributes,
              ref,
              required,
              mod: { disabled, error: !!error2 && withErrorStyles },
              variant,
              __size: inputSize,
              ...getStyles2("input")
            }
          ),
          rightSection &&  jsxRuntime.jsx(
            "div",
            {
              ...rightSectionProps,
              "data-position": "right",
              ...getStyles2("section", {
                className: rightSectionProps?.className,
                style: rightSectionProps?.style
              }),
              children: rightSection
            }
          )
        ]
      }
    );
  });
  Input.classes = classes12;
  Input.Wrapper = InputWrapper;
  Input.Label = InputLabel;
  Input.Error = InputError;
  Input.Description = InputDescription;
  Input.Placeholder = InputPlaceholder;
  Input.displayName = "@mantine/core/Input";
  function useInputProps(component, defaultProps184, _props) {
    const props = useProps(component, defaultProps184, _props);
    const {
      label,
      description,
      error: error2,
      required,
      classNames,
      styles,
      className,
      unstyled,
      __staticSelector,
      __stylesApiProps,
      errorProps,
      labelProps,
      descriptionProps,
      wrapperProps: _wrapperProps,
      id,
      size: size4,
      style,
      inputContainer,
      inputWrapperOrder,
      withAsterisk,
      variant,
      vars,
      mod,
      ...others
    } = props;
    const { styleProps, rest } = extractStyleProps(others);
    const wrapperProps = {
      label,
      description,
      error: error2,
      required,
      classNames,
      className,
      __staticSelector,
      __stylesApiProps: __stylesApiProps || props,
      errorProps,
      labelProps,
      descriptionProps,
      unstyled,
      styles,
      size: size4,
      style,
      inputContainer,
      inputWrapperOrder,
      withAsterisk,
      variant,
      id,
      mod,
      ..._wrapperProps
    };
    return {
      ...rest,
      classNames,
      styles,
      unstyled,
      wrapperProps: { ...wrapperProps, ...styleProps },
      inputProps: {
        required,
        classNames,
        styles,
        unstyled,
        size: size4,
        __staticSelector,
        __stylesApiProps: __stylesApiProps || props,
        error: error2,
        variant,
        id
      }
    };
  }
  var defaultProps24 = {
    __staticSelector: "InputBase",
    withAria: true
  };
  var InputBase = polymorphicFactory((props, ref) => {
    const { inputProps, wrapperProps, ...others } = useInputProps("InputBase", defaultProps24, props);
    return  jsxRuntime.jsx(Input.Wrapper, { ...wrapperProps, children:  jsxRuntime.jsx(Input, { ...inputProps, ...others, ref }) });
  });
  InputBase.classes = { ...Input.classes, ...Input.Wrapper.classes };
  InputBase.displayName = "@mantine/core/InputBase";
  var FLEX_STYLE_PROPS_DATA = {
    gap: { type: "spacing", property: "gap" },
    rowGap: { type: "spacing", property: "rowGap" },
    columnGap: { type: "spacing", property: "columnGap" },
    align: { type: "identity", property: "alignItems" },
    justify: { type: "identity", property: "justifyContent" },
    wrap: { type: "identity", property: "flexWrap" },
    direction: { type: "identity", property: "flexDirection" }
  };
  var classes13 = { "root": "m_8bffd616" };
  var defaultProps25 = {};
  var Flex = polymorphicFactory((_props, ref) => {
    const props = useProps("Flex", defaultProps25, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      gap,
      rowGap,
      columnGap,
      align,
      justify,
      wrap,
      direction,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Flex",
      classes: classes13,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars
    });
    const theme = useMantineTheme();
    const responsiveClassName = useRandomClassName();
    const parsedStyleProps = parseStyleProps({
      styleProps: { gap, rowGap, columnGap, align, justify, wrap, direction },
      theme,
      data: FLEX_STYLE_PROPS_DATA
    });
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      parsedStyleProps.hasResponsiveStyles &&  jsxRuntime.jsx(
        InlineStyles,
        {
          selector: `.${responsiveClassName}`,
          styles: parsedStyleProps.styles,
          media: parsedStyleProps.media
        }
      ),
       jsxRuntime.jsx(
        Box,
        {
          ref,
          ...getStyles2("root", {
            className: responsiveClassName,
            style: filterProps(parsedStyleProps.inlineStyles)
          }),
          ...others
        }
      )
    ] });
  });
  Flex.classes = classes13;
  Flex.displayName = "@mantine/core/Flex";
  function isParent(parentElement, childElement) {
    if (!childElement || !parentElement) {
      return false;
    }
    let parent = childElement.parentNode;
    while (parent != null) {
      if (parent === parentElement) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  function useFloatingIndicator({
    target,
    parent,
    ref,
    displayAfterTransitionEnd
  }) {
    const transitionTimeout = React10.useRef(-1);
    const [initialized, setInitialized] = React10.useState(false);
    const [hidden, setHidden] = React10.useState(
      typeof displayAfterTransitionEnd === "boolean" ? displayAfterTransitionEnd : false
    );
    const updatePosition = () => {
      if (!target || !parent || !ref.current) {
        return;
      }
      const targetRect = target.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const targetComputedStyle = window.getComputedStyle(target);
      const parentComputedStyle = window.getComputedStyle(parent);
      const borderTopWidth = toInt(targetComputedStyle.borderTopWidth) + toInt(parentComputedStyle.borderTopWidth);
      const borderLeftWidth = toInt(targetComputedStyle.borderLeftWidth) + toInt(parentComputedStyle.borderLeftWidth);
      const position = {
        top: targetRect.top - parentRect.top - borderTopWidth,
        left: targetRect.left - parentRect.left - borderLeftWidth,
        width: targetRect.width,
        height: targetRect.height
      };
      ref.current.style.transform = `translateY(${position.top}px) translateX(${position.left}px)`;
      ref.current.style.width = `${position.width}px`;
      ref.current.style.height = `${position.height}px`;
    };
    const updatePositionWithoutAnimation = () => {
      window.clearTimeout(transitionTimeout.current);
      if (ref.current) {
        ref.current.style.transitionDuration = "0ms";
      }
      updatePosition();
      transitionTimeout.current = window.setTimeout(() => {
        if (ref.current) {
          ref.current.style.transitionDuration = "";
        }
      }, 30);
    };
    const targetResizeObserver = React10.useRef(null);
    const parentResizeObserver = React10.useRef(null);
    React10.useEffect(() => {
      updatePosition();
      if (target) {
        targetResizeObserver.current = new ResizeObserver(updatePositionWithoutAnimation);
        targetResizeObserver.current.observe(target);
        if (parent) {
          parentResizeObserver.current = new ResizeObserver(updatePositionWithoutAnimation);
          parentResizeObserver.current.observe(parent);
        }
        return () => {
          targetResizeObserver.current?.disconnect();
          parentResizeObserver.current?.disconnect();
        };
      }
      return void 0;
    }, [parent, target]);
    React10.useEffect(() => {
      if (parent) {
        const handleTransitionEnd = (event) => {
          if (isParent(event.target, parent)) {
            updatePositionWithoutAnimation();
            setHidden(false);
          }
        };
        parent.addEventListener("transitionend", handleTransitionEnd);
        return () => {
          parent.removeEventListener("transitionend", handleTransitionEnd);
        };
      }
      return void 0;
    }, [parent]);
    hooks.useTimeout(
      () => {
        if (getEnv() !== "test") {
          setInitialized(true);
        }
      },
      20,
      { autoInvoke: true }
    );
    hooks.useMutationObserver(
      (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "dir") {
            updatePositionWithoutAnimation();
          }
        });
      },
      { attributes: true, attributeFilter: ["dir"] },
      () => document.documentElement
    );
    return { initialized, hidden };
  }
  var classes14 = { "root": "m_96b553a6" };
  var defaultProps26 = {};
  var varsResolver16 = createVarsResolver(
    (_theme, { transitionDuration }) => ({
      root: {
        "--transition-duration": typeof transitionDuration === "number" ? `${transitionDuration}ms` : transitionDuration
      }
    })
  );
  var FloatingIndicator = factory((_props, ref) => {
    const props = useProps("FloatingIndicator", defaultProps26, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      target,
      parent,
      transitionDuration,
      mod,
      displayAfterTransitionEnd,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "FloatingIndicator",
      classes: classes14,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver16
    });
    const innerRef = React10.useRef(null);
    const { initialized, hidden } = useFloatingIndicator({
      target,
      parent,
      ref: innerRef,
      displayAfterTransitionEnd
    });
    const mergedRef = hooks.useMergedRef(ref, innerRef);
    if (!target || !parent) {
      return null;
    }
    return  jsxRuntime.jsx(Box, { ref: mergedRef, mod: [{ initialized, hidden }, mod], ...getStyles2("root"), ...others });
  });
  FloatingIndicator.displayName = "@mantine/core/FloatingIndicator";
  FloatingIndicator.classes = classes14;
  var [AccordionProvider, useAccordionContext] = createSafeContext(
    "Accordion component was not found in the tree"
  );
  function AccordionChevron({ style, size: size4 = 16, ...others }) {
    return  jsxRuntime.jsx(
      "svg",
      {
        viewBox: "0 0 15 15",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { ...style, width: rem(size4), height: rem(size4), display: "block" },
        ...others,
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    );
  }
  AccordionChevron.displayName = "@mantine/core/AccordionChevron";
  var [AccordionItemProvider, useAccordionItemContext] = createSafeContext("Accordion.Item component was not found in the tree");
  var classes15 = { "root": "m_9bdbb667", "panel": "m_df78851f", "content": "m_4ba554d4", "itemTitle": "m_8fa820a0", "control": "m_4ba585b8", "control--default": "m_6939a5e9", "control--contained": "m_4271d21b", "label": "m_df3ffa0f", "chevron": "m_3f35ae96", "icon": "m_9bd771fe", "item": "m_9bd7b098", "item--default": "m_fe19b709", "item--contained": "m_1f921b3b", "item--filled": "m_2cdf939a", "item--separated": "m_9f59b069" };
  var defaultProps27 = {};
  var AccordionControl = factory((props, ref) => {
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      chevron,
      icon,
      onClick,
      onKeyDown,
      children,
      disabled,
      mod,
      ...others
    } = useProps("AccordionControl", defaultProps27, props);
    const { value } = useAccordionItemContext();
    const ctx = useAccordionContext();
    const isActive = ctx.isItemActive(value);
    const shouldWrapWithHeading = typeof ctx.order === "number";
    const Heading = `h${ctx.order}`;
    const content =  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ...others,
        ...ctx.getStyles("control", { className, classNames, style, styles, variant: ctx.variant }),
        unstyled: ctx.unstyled,
        mod: [
          "accordion-control",
          { active: isActive, "chevron-position": ctx.chevronPosition, disabled },
          mod
        ],
        ref,
        onClick: (event) => {
          onClick?.(event);
          ctx.onChange(value);
        },
        type: "button",
        disabled,
        "aria-expanded": isActive,
        "aria-controls": ctx.getRegionId(value),
        id: ctx.getControlId(value),
        onKeyDown: createScopedKeydownHandler({
          siblingSelector: "[data-accordion-control]",
          parentSelector: "[data-accordion]",
          activateOnFocus: false,
          loop: ctx.loop,
          orientation: "vertical",
          onKeyDown
        }),
        children: [
           jsxRuntime.jsx(
            Box,
            {
              component: "span",
              mod: { rotate: !ctx.disableChevronRotation && isActive, position: ctx.chevronPosition },
              ...ctx.getStyles("chevron", { classNames, styles }),
              children: chevron || ctx.chevron
            }
          ),
           jsxRuntime.jsx("span", { ...ctx.getStyles("label", { classNames, styles }), children }),
          icon &&  jsxRuntime.jsx(
            Box,
            {
              component: "span",
              mod: { "chevron-position": ctx.chevronPosition },
              ...ctx.getStyles("icon", { classNames, styles }),
              children: icon
            }
          )
        ]
      }
    );
    return shouldWrapWithHeading ?  jsxRuntime.jsx(Heading, { ...ctx.getStyles("itemTitle", { classNames, styles }), children: content }) : content;
  });
  AccordionControl.displayName = "@mantine/core/AccordionControl";
  AccordionControl.classes = classes15;
  var defaultProps28 = {};
  var AccordionItem = factory((props, ref) => {
    const { classNames, className, style, styles, vars, value, mod, ...others } = useProps(
      "AccordionItem",
      defaultProps28,
      props
    );
    const ctx = useAccordionContext();
    return  jsxRuntime.jsx(AccordionItemProvider, { value: { value }, children:  jsxRuntime.jsx(
      Box,
      {
        ref,
        mod: [{ active: ctx.isItemActive(value) }, mod],
        ...ctx.getStyles("item", { className, classNames, styles, style, variant: ctx.variant }),
        ...others
      }
    ) });
  });
  AccordionItem.displayName = "@mantine/core/AccordionItem";
  AccordionItem.classes = classes15;
  var defaultProps29 = {};
  var AccordionPanel = factory((props, ref) => {
    const { classNames, className, style, styles, vars, children, ...others } = useProps(
      "AccordionPanel",
      defaultProps29,
      props
    );
    const { value } = useAccordionItemContext();
    const ctx = useAccordionContext();
    return  jsxRuntime.jsx(
      Collapse,
      {
        ref,
        ...ctx.getStyles("panel", { className, classNames, style, styles }),
        ...others,
        in: ctx.isItemActive(value),
        transitionDuration: ctx.transitionDuration ?? 200,
        role: "region",
        id: ctx.getRegionId(value),
        "aria-labelledby": ctx.getControlId(value),
        children:  jsxRuntime.jsx("div", { ...ctx.getStyles("content", { classNames, styles }), children })
      }
    );
  });
  AccordionPanel.displayName = "@mantine/core/AccordionPanel";
  AccordionPanel.classes = classes15;
  var defaultProps30 = {
    multiple: false,
    disableChevronRotation: false,
    chevronPosition: "right",
    variant: "default",
    chevron:  jsxRuntime.jsx(AccordionChevron, {})
  };
  var varsResolver17 = createVarsResolver(
    (_, { transitionDuration, chevronSize, radius }) => ({
      root: {
        "--accordion-transition-duration": transitionDuration === void 0 ? void 0 : `${transitionDuration}ms`,
        "--accordion-chevron-size": chevronSize === void 0 ? void 0 : rem(chevronSize),
        "--accordion-radius": radius === void 0 ? void 0 : getRadius(radius)
      }
    })
  );
  function Accordion(_props) {
    const props = useProps("Accordion", defaultProps30, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      multiple,
      value,
      defaultValue,
      onChange,
      id,
      loop,
      transitionDuration,
      disableChevronRotation,
      chevronPosition,
      chevronSize,
      order,
      chevron,
      variant,
      radius,
      ...others
    } = props;
    const uid = hooks.useId(id);
    const [_value, handleChange] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: multiple ? [] : null,
      onChange
    });
    const isItemActive = (itemValue) => Array.isArray(_value) ? _value.includes(itemValue) : itemValue === _value;
    const handleItemChange = (itemValue) => {
      const nextValue = Array.isArray(_value) ? _value.includes(itemValue) ? _value.filter((selectedValue) => selectedValue !== itemValue) : [..._value, itemValue] : itemValue === _value ? null : itemValue;
      handleChange(nextValue);
    };
    const getStyles2 = useStyles({
      name: "Accordion",
      classes: classes15,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver17
    });
    return  jsxRuntime.jsx(
      AccordionProvider,
      {
        value: {
          isItemActive,
          onChange: handleItemChange,
          getControlId: getSafeId(
            `${uid}-control`,
            "Accordion.Item component was rendered with invalid value or without value"
          ),
          getRegionId: getSafeId(
            `${uid}-panel`,
            "Accordion.Item component was rendered with invalid value or without value"
          ),
          transitionDuration,
          disableChevronRotation,
          chevronPosition,
          order,
          chevron,
          loop,
          getStyles: getStyles2,
          variant,
          unstyled
        },
        children:  jsxRuntime.jsx(Box, { ...getStyles2("root"), id: uid, ...others, variant, "data-accordion": true, children })
      }
    );
  }
  var extendAccordion = (c) => c;
  Accordion.extend = extendAccordion;
  Accordion.withProps = getWithProps(Accordion);
  Accordion.classes = classes15;
  Accordion.displayName = "@mantine/core/Accordion";
  Accordion.Item = AccordionItem;
  Accordion.Panel = AccordionPanel;
  Accordion.Control = AccordionControl;
  Accordion.Chevron = AccordionChevron;
  var classes16 = { "root": "m_7f854edf" };
  var defaultProps31 = {
    position: { bottom: 0, right: 0 },
    zIndex: getDefaultZIndex("modal"),
    withinPortal: true
  };
  var varsResolver18 = createVarsResolver((_, { zIndex, position }) => ({
    root: {
      "--affix-z-index": zIndex?.toString(),
      "--affix-top": rem(position?.top),
      "--affix-left": rem(position?.left),
      "--affix-bottom": rem(position?.bottom),
      "--affix-right": rem(position?.right)
    }
  }));
  var Affix = factory((_props, ref) => {
    const props = useProps("Affix", defaultProps31, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      portalProps,
      zIndex,
      withinPortal,
      position,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Affix",
      classes: classes16,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver18
    });
    return  jsxRuntime.jsx(OptionalPortal, { ...portalProps, withinPortal, children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others }) });
  });
  Affix.classes = classes16;
  Affix.displayName = "@mantine/core/Affix";
  var classes17 = { "root": "m_66836ed3", "wrapper": "m_a5d60502", "body": "m_667c2793", "title": "m_6a03f287", "label": "m_698f4f23", "icon": "m_667f2a6a", "message": "m_7fa78076", "closeButton": "m_87f54839" };
  var defaultProps32 = {};
  var varsResolver19 = createVarsResolver(
    (theme, { radius, color, variant, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        variant: variant || "light",
        autoContrast
      });
      return {
        root: {
          "--alert-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--alert-bg": color || variant ? colors.background : void 0,
          "--alert-color": colors.color,
          "--alert-bd": color || variant ? colors.border : void 0
        }
      };
    }
  );
  var Alert = factory((_props, ref) => {
    const props = useProps("Alert", defaultProps32, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      radius,
      color,
      title,
      children,
      id,
      icon,
      withCloseButton,
      onClose,
      closeButtonLabel,
      variant,
      autoContrast,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Alert",
      classes: classes17,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver19
    });
    const rootId = hooks.useId(id);
    const titleId = title && `${rootId}-title` || void 0;
    const bodyId = `${rootId}-body`;
    return  jsxRuntime.jsx(
      Box,
      {
        id: rootId,
        ...getStyles2("root", { variant }),
        variant,
        ref,
        ...others,
        role: "alert",
        "aria-describedby": bodyId,
        "aria-labelledby": titleId,
        children:  jsxRuntime.jsxs("div", { ...getStyles2("wrapper"), children: [
          icon &&  jsxRuntime.jsx("div", { ...getStyles2("icon"), children: icon }),
           jsxRuntime.jsxs("div", { ...getStyles2("body"), children: [
            title &&  jsxRuntime.jsx("div", { ...getStyles2("title"), "data-with-close-button": withCloseButton || void 0, children:  jsxRuntime.jsx("span", { id: titleId, ...getStyles2("label"), children: title }) }),
            children &&  jsxRuntime.jsx("div", { id: bodyId, ...getStyles2("message"), "data-variant": variant, children })
          ] }),
          withCloseButton &&  jsxRuntime.jsx(
            CloseButton,
            {
              ...getStyles2("closeButton"),
              onClick: onClose,
              variant: "transparent",
              size: 16,
              iconSize: 16,
              "aria-label": closeButtonLabel,
              unstyled
            }
          )
        ] })
      }
    );
  });
  Alert.classes = classes17;
  Alert.displayName = "@mantine/core/Alert";
  var classes18 = { "root": "m_b6d8b162" };
  function getTextTruncate(truncate) {
    if (truncate === "start") {
      return "start";
    }
    if (truncate === "end" || truncate) {
      return "end";
    }
    return void 0;
  }
  var defaultProps33 = {
    inherit: false
  };
  var varsResolver20 = createVarsResolver(
    (theme, { variant, lineClamp, gradient, size: size4, color }) => ({
      root: {
        "--text-fz": getFontSize(size4),
        "--text-lh": getLineHeight(size4),
        "--text-gradient": variant === "gradient" ? getGradient(gradient, theme) : void 0,
        "--text-line-clamp": typeof lineClamp === "number" ? lineClamp.toString() : void 0,
        "--text-color": color ? getThemeColor(color, theme) : void 0
      }
    })
  );
  var Text = polymorphicFactory((_props, ref) => {
    const props = useProps("Text", defaultProps33, _props);
    const {
      lineClamp,
      truncate,
      inline: inline4,
      inherit,
      gradient,
      span,
      __staticSelector,
      vars,
      className,
      style,
      classNames,
      styles,
      unstyled,
      variant,
      mod,
      size: size4,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: ["Text", __staticSelector],
      props,
      classes: classes18,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver20
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root", { focusable: true }),
        ref,
        component: span ? "span" : "p",
        variant,
        mod: [
          {
            "data-truncate": getTextTruncate(truncate),
            "data-line-clamp": typeof lineClamp === "number",
            "data-inline": inline4,
            "data-inherit": inherit
          },
          mod
        ],
        size: size4,
        ...others
      }
    );
  });
  Text.classes = classes18;
  Text.displayName = "@mantine/core/Text";
  var classes19 = { "root": "m_849cf0da" };
  var defaultProps34 = {
    underline: "hover"
  };
  var Anchor = polymorphicFactory((props, ref) => {
    const { underline, className, unstyled, mod, ...others } = useProps(
      "Anchor",
      defaultProps34,
      props
    );
    return  jsxRuntime.jsx(
      Text,
      {
        component: "a",
        ref,
        className: clsx_default({ [classes19.root]: !unstyled }, className),
        ...others,
        mod: [{ underline }, mod],
        __staticSelector: "Anchor",
        unstyled
      }
    );
  });
  Anchor.classes = classes19;
  Anchor.displayName = "@mantine/core/Anchor";
  var classes20 = { "root": "m_48204f9b", "marks": "m_bb9cdbad", "mark": "m_481dd586", "thumb": "m_bc02ba3d", "label": "m_bb8e875b" };
  var defaultProps35 = {
    step: 1,
    withLabel: true
  };
  var varsResolver21 = createVarsResolver((_, { size: size4, thumbSize }) => ({
    root: {
      "--slider-size": rem(size4),
      "--thumb-size": rem(thumbSize)
    }
  }));
  var AngleSlider = factory((_props, ref) => {
    const props = useProps("AngleSlider", defaultProps35, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      step,
      value,
      defaultValue,
      onChange,
      onMouseDown,
      withLabel,
      marks,
      thumbSize,
      restrictToMarks,
      formatLabel,
      onChangeEnd,
      disabled,
      onTouchStart,
      name,
      hiddenInputProps,
      "aria-label": ariaLabel,
      tabIndex,
      onScrubStart,
      onScrubEnd,
      ...others
    } = props;
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: 0,
      onChange
    });
    const update = (val) => {
      if (rootRef.current) {
        const newValue = restrictToMarks && Array.isArray(marks) ? findClosestNumber(
          val,
          marks.map((mark) => mark.value)
        ) : val;
        setValue(newValue);
      }
    };
    const { ref: rootRef } = hooks.useRadialMove(update, {
      step,
      onChangeEnd,
      onScrubStart,
      onScrubEnd
    });
    const getStyles2 = useStyles({
      name: "AngleSlider",
      classes: classes20,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver21
    });
    const handleKeyDown = (event) => {
      if (disabled) {
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        const normalized = hooks.normalizeRadialValue(_value - step, step);
        setValue(normalized);
        onChangeEnd?.(normalized);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        const normalized = hooks.normalizeRadialValue(_value + step, step);
        setValue(normalized);
        onChangeEnd?.(normalized);
      }
      if (event.key === "Home") {
        setValue(0);
        onChangeEnd?.(0);
      }
      if (event.key === "End") {
        setValue(359);
        onChangeEnd?.(359);
      }
    };
    const marksItems = marks?.map((mark, index3) =>  React10.createElement(
      "div",
      {
        ...getStyles2("mark", { style: { "--angle": `${mark.value}deg` } }),
        "data-label": mark.label || void 0,
        key: index3
      }
    ));
    return  jsxRuntime.jsxs(Box, { ref: hooks.useMergedRef(ref, rootRef), ...getStyles2("root", { focusable: true }), ...others, children: [
      marksItems && marksItems.length > 0 &&  jsxRuntime.jsx("div", { ...getStyles2("marks"), children: marksItems }),
      withLabel &&  jsxRuntime.jsx("div", { ...getStyles2("label"), children: typeof formatLabel === "function" ? formatLabel(_value) : _value }),
       jsxRuntime.jsx(
        "div",
        {
          tabIndex: tabIndex ?? (disabled ? -1 : 0),
          role: "slider",
          "aria-valuemax": 360,
          "aria-valuemin": 0,
          "aria-valuenow": _value,
          onKeyDown: handleKeyDown,
          "aria-label": ariaLabel,
          ...getStyles2("thumb", { style: { transform: `rotate(${_value}deg)` } })
        }
      ),
       jsxRuntime.jsx("input", { type: "hidden", name, value: _value, ...hiddenInputProps })
    ] });
  });
  AngleSlider.displayName = "@mantine/core/AngleSlider";
  AngleSlider.classes = classes20;
  var [AppShellProvider, useAppShellContext] = createSafeContext(
    "AppShell was not found in tree"
  );
  var classes21 = { "root": "m_89ab340", "navbar": "m_45252eee", "aside": "m_9cdde9a", "header": "m_3b16f56b", "main": "m_8983817", "footer": "m_3840c879", "section": "m_6dcfc7c7" };
  var defaultProps36 = {};
  var AppShellAside = factory((_props, ref) => {
    const props = useProps("AppShellAside", defaultProps36, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      withBorder,
      zIndex,
      mod,
      ...others
    } = props;
    const ctx = useAppShellContext();
    if (ctx.disabled) {
      return null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        component: "aside",
        ref,
        mod: [{ "with-border": withBorder ?? ctx.withBorder }, mod],
        ...ctx.getStyles("aside", { className, classNames, styles, style }),
        ...others,
        __vars: {
          "--app-shell-aside-z-index": `calc(${zIndex ?? ctx.zIndex} + 1)`
        }
      }
    );
  });
  AppShellAside.classes = classes21;
  AppShellAside.displayName = "@mantine/core/AppShellAside";
  var defaultProps37 = {};
  var AppShellFooter = factory((_props, ref) => {
    const props = useProps("AppShellFooter", defaultProps37, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      withBorder,
      zIndex,
      mod,
      ...others
    } = props;
    const ctx = useAppShellContext();
    if (ctx.disabled) {
      return null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        component: "footer",
        ref,
        mod: [{ "with-border": withBorder ?? ctx.withBorder }, mod],
        ...ctx.getStyles("footer", {
          className: clsx_default({ [Combination_default.classNames.zeroRight]: ctx.offsetScrollbars }, className),
          classNames,
          styles,
          style
        }),
        ...others,
        __vars: { "--app-shell-footer-z-index": (zIndex ?? ctx.zIndex)?.toString() }
      }
    );
  });
  AppShellFooter.classes = classes21;
  AppShellFooter.displayName = "@mantine/core/AppShellFooter";
  var defaultProps38 = {};
  var AppShellHeader = factory((_props, ref) => {
    const props = useProps("AppShellHeader", defaultProps38, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      withBorder,
      zIndex,
      mod,
      ...others
    } = props;
    const ctx = useAppShellContext();
    if (ctx.disabled) {
      return null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        component: "header",
        ref,
        mod: [{ "with-border": withBorder ?? ctx.withBorder }, mod],
        ...ctx.getStyles("header", {
          className: clsx_default({ [Combination_default.classNames.zeroRight]: ctx.offsetScrollbars }, className),
          classNames,
          styles,
          style
        }),
        ...others,
        __vars: { "--app-shell-header-z-index": (zIndex ?? ctx.zIndex)?.toString() }
      }
    );
  });
  AppShellHeader.classes = classes21;
  AppShellHeader.displayName = "@mantine/core/AppShellHeader";
  var defaultProps39 = {};
  var AppShellMain = factory((_props, ref) => {
    const props = useProps("AppShellMain", defaultProps39, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useAppShellContext();
    return  jsxRuntime.jsx(
      Box,
      {
        component: "main",
        ref,
        ...ctx.getStyles("main", { className, style, classNames, styles }),
        ...others
      }
    );
  });
  AppShellMain.classes = classes21;
  AppShellMain.displayName = "@mantine/core/AppShellMain";
  function getBaseSize(size4) {
    if (typeof size4 === "object") {
      return size4.base;
    }
    return size4;
  }
  function isPrimitiveSize(size4) {
    const isBaseSize = typeof size4 === "object" && size4 !== null && typeof size4.base !== "undefined" && Object.keys(size4).length === 1;
    return typeof size4 === "number" || typeof size4 === "string" || isBaseSize;
  }
  function isResponsiveSize(size4) {
    if (typeof size4 !== "object" || size4 === null) {
      return false;
    }
    if (Object.keys(size4).length === 1 && "base" in size4) {
      return false;
    }
    return true;
  }
  function assignAsideVariables({
    baseStyles,
    minMediaStyles,
    maxMediaStyles,
    aside,
    theme
  }) {
    const asideWidth = aside?.width;
    const collapsedAsideTransform = "translateX(var(--app-shell-aside-width))";
    const collapsedAsideTransformRtl = "translateX(calc(var(--app-shell-aside-width) * -1))";
    if (aside?.breakpoint && !aside?.collapsed?.mobile) {
      maxMediaStyles[aside?.breakpoint] = maxMediaStyles[aside?.breakpoint] || {};
      maxMediaStyles[aside?.breakpoint]["--app-shell-aside-width"] = "100%";
      maxMediaStyles[aside?.breakpoint]["--app-shell-aside-offset"] = "0px";
    }
    if (isPrimitiveSize(asideWidth)) {
      const baseSize = rem(getBaseSize(asideWidth));
      baseStyles["--app-shell-aside-width"] = baseSize;
      baseStyles["--app-shell-aside-offset"] = baseSize;
    }
    if (isResponsiveSize(asideWidth)) {
      if (typeof asideWidth.base !== "undefined") {
        baseStyles["--app-shell-aside-width"] = rem(asideWidth.base);
        baseStyles["--app-shell-aside-offset"] = rem(asideWidth.base);
      }
      keys(asideWidth).forEach((key) => {
        if (key !== "base") {
          minMediaStyles[key] = minMediaStyles[key] || {};
          minMediaStyles[key]["--app-shell-aside-width"] = rem(asideWidth[key]);
          minMediaStyles[key]["--app-shell-aside-offset"] = rem(asideWidth[key]);
        }
      });
    }
    if (aside?.collapsed?.desktop) {
      const breakpointValue = aside.breakpoint;
      minMediaStyles[breakpointValue] = minMediaStyles[breakpointValue] || {};
      minMediaStyles[breakpointValue]["--app-shell-aside-transform"] = collapsedAsideTransform;
      minMediaStyles[breakpointValue]["--app-shell-aside-transform-rtl"] = collapsedAsideTransformRtl;
      minMediaStyles[breakpointValue]["--app-shell-aside-offset"] = "0px !important";
    }
    if (aside?.collapsed?.mobile) {
      const breakpointValue = getBreakpointValue(aside.breakpoint, theme.breakpoints) - 0.1;
      maxMediaStyles[breakpointValue] = maxMediaStyles[breakpointValue] || {};
      maxMediaStyles[breakpointValue]["--app-shell-aside-width"] = "100%";
      maxMediaStyles[breakpointValue]["--app-shell-aside-offset"] = "0px";
      maxMediaStyles[breakpointValue]["--app-shell-aside-transform"] = collapsedAsideTransform;
      maxMediaStyles[breakpointValue]["--app-shell-aside-transform-rtl"] = collapsedAsideTransformRtl;
    }
  }
  function assignFooterVariables({
    baseStyles,
    minMediaStyles,
    footer
  }) {
    const footerHeight = footer?.height;
    const collapsedFooterTransform = "translateY(var(--app-shell-footer-height))";
    const shouldOffset = footer?.offset ?? true;
    if (isPrimitiveSize(footerHeight)) {
      const baseSize = rem(getBaseSize(footerHeight));
      baseStyles["--app-shell-footer-height"] = baseSize;
      if (shouldOffset) {
        baseStyles["--app-shell-footer-offset"] = baseSize;
      }
    }
    if (isResponsiveSize(footerHeight)) {
      if (typeof footerHeight.base !== "undefined") {
        baseStyles["--app-shell-footer-height"] = rem(footerHeight.base);
        if (shouldOffset) {
          baseStyles["--app-shell-footer-offset"] = rem(footerHeight.base);
        }
      }
      keys(footerHeight).forEach((key) => {
        if (key !== "base") {
          minMediaStyles[key] = minMediaStyles[key] || {};
          minMediaStyles[key]["--app-shell-footer-height"] = rem(footerHeight[key]);
          if (shouldOffset) {
            minMediaStyles[key]["--app-shell-footer-offset"] = rem(footerHeight[key]);
          }
        }
      });
    }
    if (footer?.collapsed) {
      baseStyles["--app-shell-footer-transform"] = collapsedFooterTransform;
      baseStyles["--app-shell-footer-offset"] = "0px !important";
    }
  }
  function assignHeaderVariables({
    baseStyles,
    minMediaStyles,
    header
  }) {
    const headerHeight = header?.height;
    const collapsedHeaderTransform = "translateY(calc(var(--app-shell-header-height) * -1))";
    const shouldOffset = header?.offset ?? true;
    if (isPrimitiveSize(headerHeight)) {
      const baseSize = rem(getBaseSize(headerHeight));
      baseStyles["--app-shell-header-height"] = baseSize;
      if (shouldOffset) {
        baseStyles["--app-shell-header-offset"] = baseSize;
      }
    }
    if (isResponsiveSize(headerHeight)) {
      if (typeof headerHeight.base !== "undefined") {
        baseStyles["--app-shell-header-height"] = rem(headerHeight.base);
        if (shouldOffset) {
          baseStyles["--app-shell-header-offset"] = rem(headerHeight.base);
        }
      }
      keys(headerHeight).forEach((key) => {
        if (key !== "base") {
          minMediaStyles[key] = minMediaStyles[key] || {};
          minMediaStyles[key]["--app-shell-header-height"] = rem(headerHeight[key]);
          if (shouldOffset) {
            minMediaStyles[key]["--app-shell-header-offset"] = rem(headerHeight[key]);
          }
        }
      });
    }
    if (header?.collapsed) {
      baseStyles["--app-shell-header-transform"] = collapsedHeaderTransform;
      baseStyles["--app-shell-header-offset"] = "0px !important";
    }
  }
  function assignNavbarVariables({
    baseStyles,
    minMediaStyles,
    maxMediaStyles,
    navbar,
    theme
  }) {
    const navbarWidth = navbar?.width;
    const collapsedNavbarTransform = "translateX(calc(var(--app-shell-navbar-width) * -1))";
    const collapsedNavbarTransformRtl = "translateX(var(--app-shell-navbar-width))";
    if (navbar?.breakpoint && !navbar?.collapsed?.mobile) {
      maxMediaStyles[navbar?.breakpoint] = maxMediaStyles[navbar?.breakpoint] || {};
      maxMediaStyles[navbar?.breakpoint]["--app-shell-navbar-width"] = "100%";
      maxMediaStyles[navbar?.breakpoint]["--app-shell-navbar-offset"] = "0px";
    }
    if (isPrimitiveSize(navbarWidth)) {
      const baseSize = rem(getBaseSize(navbarWidth));
      baseStyles["--app-shell-navbar-width"] = baseSize;
      baseStyles["--app-shell-navbar-offset"] = baseSize;
    }
    if (isResponsiveSize(navbarWidth)) {
      if (typeof navbarWidth.base !== "undefined") {
        baseStyles["--app-shell-navbar-width"] = rem(navbarWidth.base);
        baseStyles["--app-shell-navbar-offset"] = rem(navbarWidth.base);
      }
      keys(navbarWidth).forEach((key) => {
        if (key !== "base") {
          minMediaStyles[key] = minMediaStyles[key] || {};
          minMediaStyles[key]["--app-shell-navbar-width"] = rem(navbarWidth[key]);
          minMediaStyles[key]["--app-shell-navbar-offset"] = rem(navbarWidth[key]);
        }
      });
    }
    if (navbar?.collapsed?.desktop) {
      const breakpointValue = navbar.breakpoint;
      minMediaStyles[breakpointValue] = minMediaStyles[breakpointValue] || {};
      minMediaStyles[breakpointValue]["--app-shell-navbar-transform"] = collapsedNavbarTransform;
      minMediaStyles[breakpointValue]["--app-shell-navbar-transform-rtl"] = collapsedNavbarTransformRtl;
      minMediaStyles[breakpointValue]["--app-shell-navbar-offset"] = "0px !important";
    }
    if (navbar?.collapsed?.mobile) {
      const breakpointValue = getBreakpointValue(navbar.breakpoint, theme.breakpoints) - 0.1;
      maxMediaStyles[breakpointValue] = maxMediaStyles[breakpointValue] || {};
      maxMediaStyles[breakpointValue]["--app-shell-navbar-width"] = "100%";
      maxMediaStyles[breakpointValue]["--app-shell-navbar-offset"] = "0px";
      maxMediaStyles[breakpointValue]["--app-shell-navbar-transform"] = collapsedNavbarTransform;
      maxMediaStyles[breakpointValue]["--app-shell-navbar-transform-rtl"] = collapsedNavbarTransformRtl;
    }
  }
  function getPaddingValue(padding) {
    return Number(padding) === 0 ? "0px" : getSpacing(padding);
  }
  function assignPaddingVariables({
    padding,
    baseStyles,
    minMediaStyles
  }) {
    if (isPrimitiveSize(padding)) {
      baseStyles["--app-shell-padding"] = getPaddingValue(getBaseSize(padding));
    }
    if (isResponsiveSize(padding)) {
      if (padding.base) {
        baseStyles["--app-shell-padding"] = getPaddingValue(padding.base);
      }
      keys(padding).forEach((key) => {
        if (key !== "base") {
          minMediaStyles[key] = minMediaStyles[key] || {};
          minMediaStyles[key]["--app-shell-padding"] = getPaddingValue(padding[key]);
        }
      });
    }
  }
  function getVariables({ navbar, header, footer, aside, padding, theme }) {
    const minMediaStyles = {};
    const maxMediaStyles = {};
    const baseStyles = {};
    assignNavbarVariables({
      baseStyles,
      minMediaStyles,
      maxMediaStyles,
      navbar,
      theme
    });
    assignAsideVariables({
      baseStyles,
      minMediaStyles,
      maxMediaStyles,
      aside,
      theme
    });
    assignHeaderVariables({ baseStyles, minMediaStyles, header });
    assignFooterVariables({ baseStyles, minMediaStyles, footer });
    assignPaddingVariables({ baseStyles, minMediaStyles, padding });
    const minMedia = getSortedBreakpoints(keys(minMediaStyles), theme.breakpoints).map(
      (breakpoint) => ({
        query: `(min-width: ${em(breakpoint.px)})`,
        styles: minMediaStyles[breakpoint.value]
      })
    );
    const maxMedia = getSortedBreakpoints(keys(maxMediaStyles), theme.breakpoints).map(
      (breakpoint) => ({
        query: `(max-width: ${em(breakpoint.px)})`,
        styles: maxMediaStyles[breakpoint.value]
      })
    );
    const media = [...minMedia, ...maxMedia];
    return { baseStyles, media };
  }
  function AppShellMediaStyles({
    navbar,
    header,
    aside,
    footer,
    padding
  }) {
    const theme = useMantineTheme();
    const ctx = useMantineContext();
    const { media, baseStyles } = getVariables({ navbar, header, footer, aside, padding, theme });
    return  jsxRuntime.jsx(InlineStyles, { media, styles: baseStyles, selector: ctx.cssVariablesSelector });
  }
  var defaultProps40 = {};
  var AppShellNavbar = factory((_props, ref) => {
    const props = useProps("AppShellNavbar", defaultProps40, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      withBorder,
      zIndex,
      mod,
      ...others
    } = props;
    const ctx = useAppShellContext();
    if (ctx.disabled) {
      return null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        component: "nav",
        ref,
        mod: [{ "with-border": withBorder ?? ctx.withBorder }, mod],
        ...ctx.getStyles("navbar", { className, classNames, styles, style }),
        ...others,
        __vars: {
          "--app-shell-navbar-z-index": `calc(${zIndex ?? ctx.zIndex} + 1)`
        }
      }
    );
  });
  AppShellNavbar.classes = classes21;
  AppShellNavbar.displayName = "@mantine/core/AppShellNavbar";
  var defaultProps41 = {};
  var AppShellSection = polymorphicFactory((_props, ref) => {
    const props = useProps("AppShellSection", defaultProps41, _props);
    const { classNames, className, style, styles, vars, grow, mod, ...others } = props;
    const ctx = useAppShellContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        mod: [{ grow }, mod],
        ...ctx.getStyles("section", { className, style, classNames, styles }),
        ...others
      }
    );
  });
  AppShellSection.classes = classes21;
  AppShellSection.displayName = "@mantine/core/AppShellSection";
  function useResizing({ transitionDuration, disabled }) {
    const [resizing, setResizing] = React10.useState(true);
    const resizingTimeout = React10.useRef(-1);
    const disabledTimeout = React10.useRef(-1);
    hooks.useWindowEvent("resize", () => {
      setResizing(true);
      clearTimeout(resizingTimeout.current);
      resizingTimeout.current = window.setTimeout(
        () => React10.startTransition(() => {
          setResizing(false);
        }),
        200
      );
    });
    hooks.useIsomorphicEffect(() => {
      setResizing(true);
      clearTimeout(disabledTimeout.current);
      disabledTimeout.current = window.setTimeout(
        () => React10.startTransition(() => {
          setResizing(false);
        }),
        transitionDuration || 0
      );
    }, [disabled, transitionDuration]);
    return resizing;
  }
  var defaultProps42 = {
    withBorder: true,
    padding: 0,
    transitionDuration: 200,
    transitionTimingFunction: "ease",
    zIndex: getDefaultZIndex("app")
  };
  var varsResolver22 = createVarsResolver(
    (_, { transitionDuration, transitionTimingFunction }) => ({
      root: {
        "--app-shell-transition-duration": `${transitionDuration}ms`,
        "--app-shell-transition-timing-function": transitionTimingFunction
      }
    })
  );
  var AppShell = factory((_props, ref) => {
    const props = useProps("AppShell", defaultProps42, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      navbar,
      withBorder,
      padding,
      transitionDuration,
      transitionTimingFunction,
      header,
      zIndex,
      layout,
      disabled,
      aside,
      footer,
      offsetScrollbars = layout !== "alt",
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "AppShell",
      classes: classes21,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver22
    });
    const resizing = useResizing({ disabled, transitionDuration });
    return  jsxRuntime.jsxs(AppShellProvider, { value: { getStyles: getStyles2, withBorder, zIndex, disabled, offsetScrollbars }, children: [
       jsxRuntime.jsx(
        AppShellMediaStyles,
        {
          navbar,
          header,
          aside,
          footer,
          padding
        }
      ),
       jsxRuntime.jsx(
        Box,
        {
          ref,
          ...getStyles2("root"),
          mod: [{ resizing, layout, disabled }, mod],
          ...others
        }
      )
    ] });
  });
  AppShell.classes = classes21;
  AppShell.displayName = "@mantine/core/AppShell";
  AppShell.Navbar = AppShellNavbar;
  AppShell.Header = AppShellHeader;
  AppShell.Main = AppShellMain;
  AppShell.Aside = AppShellAside;
  AppShell.Footer = AppShellFooter;
  AppShell.Section = AppShellSection;
  var classes22 = { "root": "m_71ac47fc" };
  var defaultProps43 = {};
  var varsResolver23 = createVarsResolver((_, { ratio }) => ({
    root: {
      "--ar-ratio": ratio?.toString()
    }
  }));
  var AspectRatio = factory((_props, ref) => {
    const props = useProps("AspectRatio", defaultProps43, _props);
    const { classNames, className, style, styles, unstyled, vars, ratio, ...others } = props;
    const getStyles2 = useStyles({
      name: "AspectRatio",
      classes: classes22,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver23
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others });
  });
  AspectRatio.classes = classes22;
  AspectRatio.displayName = "@mantine/core/AspectRatio";
  function parseItem(item) {
    if (typeof item === "string") {
      return { value: item, label: item };
    }
    if ("value" in item && !("label" in item)) {
      return { value: item.value, label: item.value, disabled: item.disabled };
    }
    if (typeof item === "number") {
      return { value: item.toString(), label: item.toString() };
    }
    if ("group" in item) {
      return {
        group: item.group,
        items: item.items.map((i) => parseItem(i))
      };
    }
    return item;
  }
  function getParsedComboboxData(data) {
    if (!data) {
      return [];
    }
    return data.map((item) => parseItem(item));
  }
  function getOptionsLockup(options) {
    return options.reduce((acc, item) => {
      if ("group" in item) {
        return { ...acc, ...getOptionsLockup(item.items) };
      }
      acc[item.value] = item;
      return acc;
    }, {});
  }
  function getLabelsLockup(options) {
    return options.reduce((acc, item) => {
      if ("group" in item) {
        return { ...acc, ...getLabelsLockup(item.items) };
      }
      acc[item.label] = item;
      return acc;
    }, {});
  }
  var classes23 = { "dropdown": "m_88b62a41", "search": "m_985517d8", "options": "m_b2821a6e", "option": "m_92253aa5", "empty": "m_2530cd1d", "header": "m_858f94bd", "footer": "m_82b967cb", "group": "m_254f3e4f", "groupLabel": "m_2bb2e9e5", "chevron": "m_2943220b", "optionsDropdownOption": "m_390b5f4", "optionsDropdownCheckIcon": "m_8ee53fc2" };
  var defaultProps44 = {
    error: null
  };
  var varsResolver24 = createVarsResolver((_, { size: size4 }) => ({
    chevron: {
      "--combobox-chevron-size": getSize(size4, "combobox-chevron-size")
    }
  }));
  var ComboboxChevron = factory((_props, ref) => {
    const props = useProps("ComboboxChevron", defaultProps44, _props);
    const { size: size4, error: error2, style, className, classNames, styles, unstyled, vars, mod, ...others } = props;
    const getStyles2 = useStyles({
      name: "ComboboxChevron",
      classes: classes23,
      props,
      style,
      className,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver24,
      rootSelector: "chevron"
    });
    return  jsxRuntime.jsx(
      Box,
      {
        component: "svg",
        ...others,
        ...getStyles2("chevron"),
        size: size4,
        viewBox: "0 0 15 15",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        mod: ["combobox-chevron", { error: error2 }, mod],
        ref,
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    );
  });
  ComboboxChevron.classes = classes23;
  ComboboxChevron.displayName = "@mantine/core/ComboboxChevron";
  var [ComboboxProvider, useComboboxContext] = createSafeContext(
    "Combobox component was not found in tree"
  );
  var ComboboxClearButton = React10.forwardRef(
    ({ size: size4, onMouseDown, onClick, onClear, ...others }, ref) =>  jsxRuntime.jsx(
      CloseButton,
      {
        ref,
        size: size4 || "sm",
        variant: "transparent",
        tabIndex: -1,
        "aria-hidden": true,
        ...others,
        onMouseDown: (event) => {
          event.preventDefault();
          onMouseDown?.(event);
        },
        onClick: (event) => {
          onClear();
          onClick?.(event);
        }
      }
    )
  );
  ComboboxClearButton.displayName = "@mantine/core/ComboboxClearButton";
  var defaultProps45 = {};
  var ComboboxDropdown = factory((props, ref) => {
    const { classNames, styles, className, style, hidden, ...others } = useProps(
      "ComboboxDropdown",
      defaultProps45,
      props
    );
    const ctx = useComboboxContext();
    return  jsxRuntime.jsx(
      Popover.Dropdown,
      {
        ...others,
        ref,
        role: "presentation",
        "data-hidden": hidden || void 0,
        ...ctx.getStyles("dropdown", { className, style, classNames, styles })
      }
    );
  });
  ComboboxDropdown.classes = classes23;
  ComboboxDropdown.displayName = "@mantine/core/ComboboxDropdown";
  var defaultProps46 = {
    refProp: "ref"
  };
  var ComboboxDropdownTarget = factory((props, ref) => {
    const { children, refProp } = useProps("ComboboxDropdownTarget", defaultProps46, props);
    useComboboxContext();
    if (!isElement(children)) {
      throw new Error(
        "Combobox.DropdownTarget component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    return  jsxRuntime.jsx(Popover.Target, { ref, refProp, children });
  });
  ComboboxDropdownTarget.displayName = "@mantine/core/ComboboxDropdownTarget";
  var defaultProps47 = {};
  var ComboboxEmpty = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "ComboboxEmpty",
      defaultProps47,
      props
    );
    const ctx = useComboboxContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("empty", { className, classNames, styles, style }),
        ...others
      }
    );
  });
  ComboboxEmpty.classes = classes23;
  ComboboxEmpty.displayName = "@mantine/core/ComboboxEmpty";
  function useComboboxTargetProps({
    onKeyDown,
    withKeyboardNavigation,
    withAriaAttributes,
    withExpandedAttribute,
    targetType,
    autoComplete
  }) {
    const ctx = useComboboxContext();
    const [selectedOptionId, setSelectedOptionId] = React10.useState(null);
    const handleKeyDown = (event) => {
      onKeyDown?.(event);
      if (ctx.readOnly) {
        return;
      }
      if (withKeyboardNavigation) {
        if (event.nativeEvent.isComposing) {
          return;
        }
        if (event.nativeEvent.code === "ArrowDown") {
          event.preventDefault();
          if (!ctx.store.dropdownOpened) {
            ctx.store.openDropdown("keyboard");
            setSelectedOptionId(ctx.store.selectActiveOption());
            ctx.store.updateSelectedOptionIndex("selected", { scrollIntoView: true });
          } else {
            setSelectedOptionId(ctx.store.selectNextOption());
          }
        }
        if (event.nativeEvent.code === "ArrowUp") {
          event.preventDefault();
          if (!ctx.store.dropdownOpened) {
            ctx.store.openDropdown("keyboard");
            setSelectedOptionId(ctx.store.selectActiveOption());
            ctx.store.updateSelectedOptionIndex("selected", { scrollIntoView: true });
          } else {
            setSelectedOptionId(ctx.store.selectPreviousOption());
          }
        }
        if (event.nativeEvent.code === "Enter" || event.nativeEvent.code === "NumpadEnter") {
          if (event.nativeEvent.keyCode === 229) {
            return;
          }
          const selectedOptionIndex = ctx.store.getSelectedOptionIndex();
          if (ctx.store.dropdownOpened && selectedOptionIndex !== -1) {
            event.preventDefault();
            ctx.store.clickSelectedOption();
          } else if (targetType === "button") {
            event.preventDefault();
            ctx.store.openDropdown("keyboard");
          }
        }
        if (event.nativeEvent.code === "Escape") {
          ctx.store.closeDropdown("keyboard");
        }
        if (event.nativeEvent.code === "Space") {
          if (targetType === "button") {
            event.preventDefault();
            ctx.store.toggleDropdown("keyboard");
          }
        }
      }
    };
    const ariaAttributes = withAriaAttributes ? {
      "aria-haspopup": "listbox",
      "aria-expanded": withExpandedAttribute && !!(ctx.store.listId && ctx.store.dropdownOpened) || void 0,
      "aria-controls": ctx.store.dropdownOpened ? ctx.store.listId : void 0,
      "aria-activedescendant": ctx.store.dropdownOpened ? selectedOptionId || void 0 : void 0,
      autoComplete,
      "data-expanded": ctx.store.dropdownOpened || void 0,
      "data-mantine-stop-propagation": ctx.store.dropdownOpened || void 0
    } : {};
    return {
      ...ariaAttributes,
      onKeyDown: handleKeyDown
    };
  }
  var defaultProps48 = {
    refProp: "ref",
    targetType: "input",
    withKeyboardNavigation: true,
    withAriaAttributes: true,
    withExpandedAttribute: false,
    autoComplete: "off"
  };
  var ComboboxEventsTarget = factory((props, ref) => {
    const {
      children,
      refProp,
      withKeyboardNavigation,
      withAriaAttributes,
      withExpandedAttribute,
      targetType,
      autoComplete,
      ...others
    } = useProps("ComboboxEventsTarget", defaultProps48, props);
    if (!isElement(children)) {
      throw new Error(
        "Combobox.EventsTarget component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const ctx = useComboboxContext();
    const targetProps = useComboboxTargetProps({
      targetType,
      withAriaAttributes,
      withKeyboardNavigation,
      withExpandedAttribute,
      onKeyDown: children.props.onKeyDown,
      autoComplete
    });
    return React10.cloneElement(children, {
      ...targetProps,
      ...others,
      [refProp]: hooks.useMergedRef(ref, ctx.store.targetRef, getRefProp(children))
    });
  });
  ComboboxEventsTarget.displayName = "@mantine/core/ComboboxEventsTarget";
  var defaultProps49 = {};
  var ComboboxFooter = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "ComboboxFooter",
      defaultProps49,
      props
    );
    const ctx = useComboboxContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("footer", { className, classNames, style, styles }),
        ...others,
        onMouseDown: (event) => {
          event.preventDefault();
        }
      }
    );
  });
  ComboboxFooter.classes = classes23;
  ComboboxFooter.displayName = "@mantine/core/ComboboxFooter";
  var defaultProps50 = {};
  var ComboboxGroup = factory((props, ref) => {
    const { classNames, className, style, styles, vars, children, label, ...others } = useProps(
      "ComboboxGroup",
      defaultProps50,
      props
    );
    const ctx = useComboboxContext();
    return  jsxRuntime.jsxs(
      Box,
      {
        ref,
        ...ctx.getStyles("group", { className, classNames, style, styles }),
        ...others,
        children: [
          label &&  jsxRuntime.jsx("div", { ...ctx.getStyles("groupLabel", { classNames, styles }), children: label }),
          children
        ]
      }
    );
  });
  ComboboxGroup.classes = classes23;
  ComboboxGroup.displayName = "@mantine/core/ComboboxGroup";
  var defaultProps51 = {};
  var ComboboxHeader = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "ComboboxHeader",
      defaultProps51,
      props
    );
    const ctx = useComboboxContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("header", { className, classNames, style, styles }),
        ...others,
        onMouseDown: (event) => {
          event.preventDefault();
        }
      }
    );
  });
  ComboboxHeader.classes = classes23;
  ComboboxHeader.displayName = "@mantine/core/ComboboxHeader";
  function ComboboxHiddenInput({
    value,
    valuesDivider = ",",
    ...others
  }) {
    return  jsxRuntime.jsx(
      "input",
      {
        type: "hidden",
        value: Array.isArray(value) ? value.join(valuesDivider) : value || "",
        ...others
      }
    );
  }
  ComboboxHiddenInput.displayName = "@mantine/core/ComboboxHiddenInput";
  var defaultProps52 = {};
  var ComboboxOption = factory((_props, ref) => {
    const props = useProps("ComboboxOption", defaultProps52, _props);
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      onClick,
      id,
      active,
      onMouseDown,
      onMouseOver,
      disabled,
      selected,
      mod,
      ...others
    } = props;
    const ctx = useComboboxContext();
    const uuid = React10.useId();
    const _id = id || uuid;
    return  jsxRuntime.jsx(
      Box,
      {
        ...ctx.getStyles("option", { className, classNames, styles, style }),
        ...others,
        ref,
        id: _id,
        mod: [
          "combobox-option",
          { "combobox-active": active, "combobox-disabled": disabled, "combobox-selected": selected },
          mod
        ],
        role: "option",
        onClick: (event) => {
          if (!disabled) {
            ctx.onOptionSubmit?.(props.value, props);
            onClick?.(event);
          } else {
            event.preventDefault();
          }
        },
        onMouseDown: (event) => {
          event.preventDefault();
          onMouseDown?.(event);
        },
        onMouseOver: (event) => {
          if (ctx.resetSelectionOnOptionHover) {
            ctx.store.resetSelectedOption();
          }
          onMouseOver?.(event);
        }
      }
    );
  });
  ComboboxOption.classes = classes23;
  ComboboxOption.displayName = "@mantine/core/ComboboxOption";
  var defaultProps53 = {};
  var ComboboxOptions = factory((_props, ref) => {
    const props = useProps("ComboboxOptions", defaultProps53, _props);
    const { classNames, className, style, styles, id, onMouseDown, labelledBy, ...others } = props;
    const ctx = useComboboxContext();
    const _id = hooks.useId(id);
    React10.useEffect(() => {
      ctx.store.setListId(_id);
    }, [_id]);
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("options", { className, style, classNames, styles }),
        ...others,
        id: _id,
        role: "listbox",
        "aria-labelledby": labelledBy,
        onMouseDown: (event) => {
          event.preventDefault();
          onMouseDown?.(event);
        }
      }
    );
  });
  ComboboxOptions.classes = classes23;
  ComboboxOptions.displayName = "@mantine/core/ComboboxOptions";
  var defaultProps54 = {
    withAriaAttributes: true,
    withKeyboardNavigation: true
  };
  var ComboboxSearch = factory((_props, ref) => {
    const props = useProps("ComboboxSearch", defaultProps54, _props);
    const {
      classNames,
      styles,
      unstyled,
      vars,
      withAriaAttributes,
      onKeyDown,
      withKeyboardNavigation,
      size: size4,
      ...others
    } = props;
    const ctx = useComboboxContext();
    const _styles = ctx.getStyles("search");
    const targetProps = useComboboxTargetProps({
      targetType: "input",
      withAriaAttributes,
      withKeyboardNavigation,
      withExpandedAttribute: false,
      onKeyDown,
      autoComplete: "off"
    });
    return  jsxRuntime.jsx(
      Input,
      {
        ref: hooks.useMergedRef(ref, ctx.store.searchRef),
        classNames: [{ input: _styles.className }, classNames],
        styles: [{ input: _styles.style }, styles],
        size: size4 || ctx.size,
        ...targetProps,
        ...others,
        __staticSelector: "Combobox"
      }
    );
  });
  ComboboxSearch.classes = classes23;
  ComboboxSearch.displayName = "@mantine/core/ComboboxSearch";
  var defaultProps55 = {
    refProp: "ref",
    targetType: "input",
    withKeyboardNavigation: true,
    withAriaAttributes: true,
    withExpandedAttribute: false,
    autoComplete: "off"
  };
  var ComboboxTarget = factory((props, ref) => {
    const {
      children,
      refProp,
      withKeyboardNavigation,
      withAriaAttributes,
      withExpandedAttribute,
      targetType,
      autoComplete,
      ...others
    } = useProps("ComboboxTarget", defaultProps55, props);
    if (!isElement(children)) {
      throw new Error(
        "Combobox.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const ctx = useComboboxContext();
    const targetProps = useComboboxTargetProps({
      targetType,
      withAriaAttributes,
      withKeyboardNavigation,
      withExpandedAttribute,
      onKeyDown: children.props.onKeyDown,
      autoComplete
    });
    const clonedElement = React10.cloneElement(children, {
      ...targetProps,
      ...others
    });
    return  jsxRuntime.jsx(Popover.Target, { ref: hooks.useMergedRef(ref, ctx.store.targetRef), children: clonedElement });
  });
  ComboboxTarget.displayName = "@mantine/core/ComboboxTarget";
  function getPreviousIndex2(currentIndex, elements, loop) {
    for (let i = currentIndex - 1; i >= 0; i -= 1) {
      if (!elements[i].hasAttribute("data-combobox-disabled")) {
        return i;
      }
    }
    if (loop) {
      for (let i = elements.length - 1; i > -1; i -= 1) {
        if (!elements[i].hasAttribute("data-combobox-disabled")) {
          return i;
        }
      }
    }
    return currentIndex;
  }
  function getNextIndex2(currentIndex, elements, loop) {
    for (let i = currentIndex + 1; i < elements.length; i += 1) {
      if (!elements[i].hasAttribute("data-combobox-disabled")) {
        return i;
      }
    }
    if (loop) {
      for (let i = 0; i < elements.length; i += 1) {
        if (!elements[i].hasAttribute("data-combobox-disabled")) {
          return i;
        }
      }
    }
    return currentIndex;
  }
  function getFirstIndex(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      if (!elements[i].hasAttribute("data-combobox-disabled")) {
        return i;
      }
    }
    return -1;
  }
  function useCombobox({
    defaultOpened,
    opened,
    onOpenedChange,
    onDropdownClose,
    onDropdownOpen,
    loop = true,
    scrollBehavior = "instant"
  } = {}) {
    const [dropdownOpened, setDropdownOpened] = hooks.useUncontrolled({
      value: opened,
      defaultValue: defaultOpened,
      finalValue: false,
      onChange: onOpenedChange
    });
    const listId = React10.useRef(null);
    const selectedOptionIndex = React10.useRef(-1);
    const searchRef = React10.useRef(null);
    const targetRef = React10.useRef(null);
    const focusSearchTimeout = React10.useRef(-1);
    const focusTargetTimeout = React10.useRef(-1);
    const selectedIndexUpdateTimeout = React10.useRef(-1);
    const openDropdown = React10.useCallback(
      (eventSource = "unknown") => {
        if (!dropdownOpened) {
          setDropdownOpened(true);
          onDropdownOpen?.(eventSource);
        }
      },
      [setDropdownOpened, onDropdownOpen, dropdownOpened]
    );
    const closeDropdown = React10.useCallback(
      (eventSource = "unknown") => {
        if (dropdownOpened) {
          setDropdownOpened(false);
          onDropdownClose?.(eventSource);
        }
      },
      [setDropdownOpened, onDropdownClose, dropdownOpened]
    );
    const toggleDropdown = React10.useCallback(
      (eventSource = "unknown") => {
        if (dropdownOpened) {
          closeDropdown(eventSource);
        } else {
          openDropdown(eventSource);
        }
      },
      [closeDropdown, openDropdown, dropdownOpened]
    );
    const clearSelectedItem = React10.useCallback(() => {
      const selected = document.querySelector(`#${listId.current} [data-combobox-selected]`);
      selected?.removeAttribute("data-combobox-selected");
      selected?.removeAttribute("aria-selected");
    }, []);
    const selectOption = React10.useCallback(
      (index3) => {
        const list = document.getElementById(listId.current);
        const items = list?.querySelectorAll("[data-combobox-option]");
        if (!items) {
          return null;
        }
        const nextIndex = index3 >= items.length ? 0 : index3 < 0 ? items.length - 1 : index3;
        selectedOptionIndex.current = nextIndex;
        if (items?.[nextIndex] && !items[nextIndex].hasAttribute("data-combobox-disabled")) {
          clearSelectedItem();
          items[nextIndex].setAttribute("data-combobox-selected", "true");
          items[nextIndex].setAttribute("aria-selected", "true");
          items[nextIndex].scrollIntoView({ block: "nearest", behavior: scrollBehavior });
          return items[nextIndex].id;
        }
        return null;
      },
      [scrollBehavior, clearSelectedItem]
    );
    const selectActiveOption = React10.useCallback(() => {
      const activeOption = document.querySelector(
        `#${listId.current} [data-combobox-active]`
      );
      if (activeOption) {
        const items = document.querySelectorAll(
          `#${listId.current} [data-combobox-option]`
        );
        const index3 = Array.from(items).findIndex((option) => option === activeOption);
        return selectOption(index3);
      }
      return selectOption(0);
    }, [selectOption]);
    const selectNextOption = React10.useCallback(
      () => selectOption(
        getNextIndex2(
          selectedOptionIndex.current,
          document.querySelectorAll(`#${listId.current} [data-combobox-option]`),
          loop
        )
      ),
      [selectOption, loop]
    );
    const selectPreviousOption = React10.useCallback(
      () => selectOption(
        getPreviousIndex2(
          selectedOptionIndex.current,
          document.querySelectorAll(`#${listId.current} [data-combobox-option]`),
          loop
        )
      ),
      [selectOption, loop]
    );
    const selectFirstOption = React10.useCallback(
      () => selectOption(
        getFirstIndex(
          document.querySelectorAll(`#${listId.current} [data-combobox-option]`)
        )
      ),
      [selectOption]
    );
    const updateSelectedOptionIndex = React10.useCallback(
      (target = "selected", options) => {
        selectedIndexUpdateTimeout.current = window.setTimeout(() => {
          const items = document.querySelectorAll(
            `#${listId.current} [data-combobox-option]`
          );
          const index3 = Array.from(items).findIndex(
            (option) => option.hasAttribute(`data-combobox-${target}`)
          );
          selectedOptionIndex.current = index3;
          if (options?.scrollIntoView) {
            items[index3]?.scrollIntoView({ block: "nearest", behavior: scrollBehavior });
          }
        }, 0);
      },
      []
    );
    const resetSelectedOption = React10.useCallback(() => {
      selectedOptionIndex.current = -1;
      clearSelectedItem();
    }, [clearSelectedItem]);
    const clickSelectedOption = React10.useCallback(() => {
      const items = document.querySelectorAll(
        `#${listId.current} [data-combobox-option]`
      );
      const item = items?.[selectedOptionIndex.current];
      item?.click();
    }, []);
    const setListId = React10.useCallback((id) => {
      listId.current = id;
    }, []);
    const focusSearchInput = React10.useCallback(() => {
      focusSearchTimeout.current = window.setTimeout(() => searchRef.current.focus(), 0);
    }, []);
    const focusTarget = React10.useCallback(() => {
      focusTargetTimeout.current = window.setTimeout(() => targetRef.current.focus(), 0);
    }, []);
    const getSelectedOptionIndex = React10.useCallback(() => selectedOptionIndex.current, []);
    React10.useEffect(
      () => () => {
        window.clearTimeout(focusSearchTimeout.current);
        window.clearTimeout(focusTargetTimeout.current);
        window.clearTimeout(selectedIndexUpdateTimeout.current);
      },
      []
    );
    return {
      dropdownOpened,
      openDropdown,
      closeDropdown,
      toggleDropdown,
      selectedOptionIndex: selectedOptionIndex.current,
      getSelectedOptionIndex,
      selectOption,
      selectFirstOption,
      selectActiveOption,
      selectNextOption,
      selectPreviousOption,
      resetSelectedOption,
      updateSelectedOptionIndex,
      listId: listId.current,
      setListId,
      clickSelectedOption,
      searchRef,
      focusSearchInput,
      targetRef,
      focusTarget
    };
  }
  var defaultProps56 = {
    keepMounted: true,
    withinPortal: true,
    resetSelectionOnOptionHover: false,
    width: "target",
    transitionProps: { transition: "fade", duration: 0 }
  };
  var varsResolver25 = createVarsResolver((_, { size: size4, dropdownPadding }) => ({
    options: {
      "--combobox-option-fz": getFontSize(size4),
      "--combobox-option-padding": getSize(size4, "combobox-option-padding")
    },
    dropdown: {
      "--combobox-padding": dropdownPadding === void 0 ? void 0 : rem(dropdownPadding),
      "--combobox-option-fz": getFontSize(size4),
      "--combobox-option-padding": getSize(size4, "combobox-option-padding")
    }
  }));
  function Combobox(_props) {
    const props = useProps("Combobox", defaultProps56, _props);
    const {
      classNames,
      styles,
      unstyled,
      children,
      store: controlledStore,
      vars,
      onOptionSubmit,
      onClose,
      size: size4,
      dropdownPadding,
      resetSelectionOnOptionHover,
      __staticSelector,
      readOnly,
      ...others
    } = props;
    const uncontrolledStore = useCombobox();
    const store = controlledStore || uncontrolledStore;
    const getStyles2 = useStyles({
      name: __staticSelector || "Combobox",
      classes: classes23,
      props,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver25
    });
    const onDropdownClose = () => {
      onClose?.();
      store.closeDropdown();
    };
    return  jsxRuntime.jsx(
      ComboboxProvider,
      {
        value: {
          getStyles: getStyles2,
          store,
          onOptionSubmit,
          size: size4,
          resetSelectionOnOptionHover,
          readOnly
        },
        children:  jsxRuntime.jsx(
          Popover,
          {
            opened: store.dropdownOpened,
            ...others,
            onChange: (_opened) => !_opened && onDropdownClose(),
            withRoles: false,
            unstyled,
            children
          }
        )
      }
    );
  }
  var extendCombobox = (c) => c;
  Combobox.extend = extendCombobox;
  Combobox.classes = classes23;
  Combobox.displayName = "@mantine/core/Combobox";
  Combobox.Target = ComboboxTarget;
  Combobox.Dropdown = ComboboxDropdown;
  Combobox.Options = ComboboxOptions;
  Combobox.Option = ComboboxOption;
  Combobox.Search = ComboboxSearch;
  Combobox.Empty = ComboboxEmpty;
  Combobox.Chevron = ComboboxChevron;
  Combobox.Footer = ComboboxFooter;
  Combobox.Header = ComboboxHeader;
  Combobox.EventsTarget = ComboboxEventsTarget;
  Combobox.DropdownTarget = ComboboxDropdownTarget;
  Combobox.Group = ComboboxGroup;
  Combobox.ClearButton = ComboboxClearButton;
  Combobox.HiddenInput = ComboboxHiddenInput;
  var classes24 = { "root": "m_5f75b09e", "body": "m_5f6e695e", "labelWrapper": "m_d3ea56bb", "label": "m_8ee546b8", "description": "m_328f68c0", "error": "m_8e8a99cc" };
  var InlineInputClasses = classes24;
  var InlineInput = React10.forwardRef(
    ({
      __staticSelector,
      __stylesApiProps,
      className,
      classNames,
      styles,
      unstyled,
      children,
      label,
      description,
      id,
      disabled,
      error: error2,
      size: size4,
      labelPosition = "left",
      bodyElement = "div",
      labelElement = "label",
      variant,
      style,
      vars,
      mod,
      ...others
    }, ref) => {
      const getStyles2 = useStyles({
        name: __staticSelector,
        props: __stylesApiProps,
        className,
        style,
        classes: classes24,
        classNames,
        styles,
        unstyled
      });
      return  jsxRuntime.jsx(
        Box,
        {
          ...getStyles2("root"),
          ref,
          __vars: {
            "--label-fz": getFontSize(size4),
            "--label-lh": getSize(size4, "label-lh")
          },
          mod: [{ "label-position": labelPosition }, mod],
          variant,
          size: size4,
          ...others,
          children:  jsxRuntime.jsxs(
            Box,
            {
              component: bodyElement,
              htmlFor: bodyElement === "label" ? id : void 0,
              ...getStyles2("body"),
              children: [
                children,
                 jsxRuntime.jsxs("div", { ...getStyles2("labelWrapper"), "data-disabled": disabled || void 0, children: [
                  label &&  jsxRuntime.jsx(
                    Box,
                    {
                      component: labelElement,
                      htmlFor: labelElement === "label" ? id : void 0,
                      ...getStyles2("label"),
                      "data-disabled": disabled || void 0,
                      children: label
                    }
                  ),
                  description &&  jsxRuntime.jsx(Input.Description, { size: size4, __inheritStyles: false, ...getStyles2("description"), children: description }),
                  error2 && typeof error2 !== "boolean" &&  jsxRuntime.jsx(Input.Error, { size: size4, __inheritStyles: false, ...getStyles2("error"), children: error2 })
                ] })
              ]
            }
          )
        }
      );
    }
  );
  InlineInput.displayName = "@mantine/core/InlineInput";
  var CheckboxGroupContext = React10.createContext(null);
  var CheckboxGroupProvider = CheckboxGroupContext.Provider;
  var useCheckboxGroupContext = () => React10.useContext(CheckboxGroupContext);
  var [CheckboxCardProvider, useCheckboxCardContext] = createOptionalContext();
  var classes25 = { "card": "m_26775b0a" };
  var defaultProps57 = {
    withBorder: true
  };
  var varsResolver26 = createVarsResolver((_, { radius }) => ({
    card: {
      "--card-radius": getRadius(radius)
    }
  }));
  var CheckboxCard = factory((_props, ref) => {
    const props = useProps("CheckboxCard", defaultProps57, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      checked,
      mod,
      withBorder,
      value,
      onClick,
      defaultChecked,
      onChange,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "CheckboxCard",
      classes: classes25,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver26,
      rootSelector: "card"
    });
    const ctx = useCheckboxGroupContext();
    const _checked = typeof checked === "boolean" ? checked : ctx ? ctx.value.includes(value || "") : void 0;
    const [_value, setValue] = hooks.useUncontrolled({
      value: _checked,
      defaultValue: defaultChecked,
      finalValue: false,
      onChange
    });
    return  jsxRuntime.jsx(CheckboxCardProvider, { value: { checked: _value }, children:  jsxRuntime.jsx(
      UnstyledButton,
      {
        ref,
        mod: [{ "with-border": withBorder, checked: _value }, mod],
        ...getStyles2("card"),
        ...others,
        role: "checkbox",
        "aria-checked": _value,
        onClick: (event) => {
          onClick?.(event);
          ctx?.onChange(value || "");
          setValue(!_value);
        }
      }
    ) });
  });
  CheckboxCard.displayName = "@mantine/core/CheckboxCard";
  CheckboxCard.classes = classes25;
  function InputsGroupFieldset({ children, role }) {
    const ctx = useInputWrapperContext();
    if (!ctx) {
      return  jsxRuntime.jsx(jsxRuntime.Fragment, { children });
    }
    return  jsxRuntime.jsx("div", { role, "aria-labelledby": ctx.labelId, "aria-describedby": ctx.describedBy, children });
  }
  var defaultProps58 = {};
  var CheckboxGroup = factory((props, ref) => {
    const { value, defaultValue, onChange, size: size4, wrapperProps, children, readOnly, ...others } = useProps("CheckboxGroup", defaultProps58, props);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: [],
      onChange
    });
    const handleChange = (event) => {
      const itemValue = typeof event === "string" ? event : event.currentTarget.value;
      !readOnly && setValue(
        _value.includes(itemValue) ? _value.filter((item) => item !== itemValue) : [..._value, itemValue]
      );
    };
    return  jsxRuntime.jsx(CheckboxGroupProvider, { value: { value: _value, onChange: handleChange, size: size4 }, children:  jsxRuntime.jsx(
      Input.Wrapper,
      {
        size: size4,
        ref,
        ...wrapperProps,
        ...others,
        labelElement: "div",
        __staticSelector: "CheckboxGroup",
        children:  jsxRuntime.jsx(InputsGroupFieldset, { role: "group", children })
      }
    ) });
  });
  CheckboxGroup.classes = Input.Wrapper.classes;
  CheckboxGroup.displayName = "@mantine/core/CheckboxGroup";
  function CheckIcon({ size: size4, style, ...others }) {
    const _style = size4 !== void 0 ? { width: rem(size4), height: rem(size4), ...style } : style;
    return  jsxRuntime.jsx(
      "svg",
      {
        viewBox: "0 0 10 7",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: _style,
        "aria-hidden": true,
        ...others,
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    );
  }
  function CheckboxIcon({ indeterminate, ...others }) {
    if (indeterminate) {
      return  jsxRuntime.jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 32 6",
          "aria-hidden": true,
          ...others,
          children:  jsxRuntime.jsx("rect", { width: "32", height: "6", fill: "currentColor", rx: "3" })
        }
      );
    }
    return  jsxRuntime.jsx(CheckIcon, { ...others });
  }
  var classes26 = { "indicator": "m_5e5256ee", "icon": "m_1b1c543a", "indicator--outline": "m_76e20374" };
  var defaultProps59 = {
    icon: CheckboxIcon
  };
  var varsResolver27 = createVarsResolver(
    (theme, { radius, color, size: size4, iconColor, variant, autoContrast }) => {
      const parsedColor = parseThemeColor({ color: color || theme.primaryColor, theme });
      const outlineColor = parsedColor.isThemeColor && parsedColor.shade === void 0 ? `var(--mantine-color-${parsedColor.color}-outline)` : parsedColor.color;
      return {
        indicator: {
          "--checkbox-size": getSize(size4, "checkbox-size"),
          "--checkbox-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--checkbox-color": variant === "outline" ? outlineColor : getThemeColor(color, theme),
          "--checkbox-icon-color": iconColor ? getThemeColor(iconColor, theme) : getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
        }
      };
    }
  );
  var CheckboxIndicator = factory((_props, ref) => {
    const props = useProps("CheckboxIndicator", defaultProps59, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      icon,
      indeterminate,
      radius,
      color,
      iconColor,
      autoContrast,
      checked,
      mod,
      variant,
      disabled,
      ...others
    } = props;
    const Icon = icon;
    const getStyles2 = useStyles({
      name: "CheckboxIndicator",
      classes: classes26,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver27,
      rootSelector: "indicator"
    });
    const ctx = useCheckboxCardContext();
    const _checked = typeof checked === "boolean" || typeof indeterminate === "boolean" ? checked || indeterminate : ctx?.checked || false;
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...getStyles2("indicator", { variant }),
        variant,
        mod: [{ checked: _checked, disabled }, mod],
        ...others,
        children:  jsxRuntime.jsx(Icon, { indeterminate, ...getStyles2("icon") })
      }
    );
  });
  CheckboxIndicator.displayName = "@mantine/core/CheckboxIndicator";
  CheckboxIndicator.classes = classes26;
  var classes27 = { "root": "m_bf2d988c", "inner": "m_26062bec", "input": "m_26063560", "icon": "m_bf295423", "input--outline": "m_215c4542" };
  var defaultProps60 = {
    labelPosition: "right",
    icon: CheckboxIcon
  };
  var varsResolver28 = createVarsResolver(
    (theme, { radius, color, size: size4, iconColor, variant, autoContrast }) => {
      const parsedColor = parseThemeColor({ color: color || theme.primaryColor, theme });
      const outlineColor = parsedColor.isThemeColor && parsedColor.shade === void 0 ? `var(--mantine-color-${parsedColor.color}-outline)` : parsedColor.color;
      return {
        root: {
          "--checkbox-size": getSize(size4, "checkbox-size"),
          "--checkbox-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--checkbox-color": variant === "outline" ? outlineColor : getThemeColor(color, theme),
          "--checkbox-icon-color": iconColor ? getThemeColor(iconColor, theme) : getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
        }
      };
    }
  );
  var Checkbox = factory((_props, ref) => {
    const props = useProps("Checkbox", defaultProps60, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      color,
      label,
      id,
      size: size4,
      radius,
      wrapperProps,
      checked,
      labelPosition,
      description,
      error: error2,
      disabled,
      variant,
      indeterminate,
      icon,
      rootRef,
      iconColor,
      onChange,
      autoContrast,
      mod,
      ...others
    } = props;
    const ctx = useCheckboxGroupContext();
    const _size = size4 || ctx?.size;
    const Icon = icon;
    const getStyles2 = useStyles({
      name: "Checkbox",
      props,
      classes: classes27,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver28
    });
    const { styleProps, rest } = extractStyleProps(others);
    const uuid = hooks.useId(id);
    const contextProps = ctx ? {
      checked: ctx.value.includes(rest.value),
      onChange: (event) => {
        ctx.onChange(event);
        onChange?.(event);
      }
    } : {};
    return  jsxRuntime.jsx(
      InlineInput,
      {
        ...getStyles2("root"),
        __staticSelector: "Checkbox",
        __stylesApiProps: props,
        id: uuid,
        size: _size,
        labelPosition,
        label,
        description,
        error: error2,
        disabled,
        classNames,
        styles,
        unstyled,
        "data-checked": contextProps.checked || checked || void 0,
        variant,
        ref: rootRef,
        mod,
        ...styleProps,
        ...wrapperProps,
        children:  jsxRuntime.jsxs(Box, { ...getStyles2("inner"), mod: { "data-label-position": labelPosition }, children: [
           jsxRuntime.jsx(
            Box,
            {
              component: "input",
              id: uuid,
              ref,
              checked,
              disabled,
              mod: { error: !!error2, indeterminate },
              ...getStyles2("input", { focusable: true, variant }),
              onChange,
              ...rest,
              ...contextProps,
              type: "checkbox"
            }
          ),
           jsxRuntime.jsx(Icon, { indeterminate, ...getStyles2("icon") })
        ] })
      }
    );
  });
  Checkbox.classes = { ...classes27, ...InlineInputClasses };
  Checkbox.displayName = "@mantine/core/Checkbox";
  Checkbox.Group = CheckboxGroup;
  Checkbox.Indicator = CheckboxIndicator;
  Checkbox.Card = CheckboxCard;
  function isOptionsGroup(item) {
    return "group" in item;
  }
  function defaultOptionsFilter({
    options,
    search,
    limit
  }) {
    const parsedSearch = search.trim().toLowerCase();
    const result = [];
    for (let i = 0; i < options.length; i += 1) {
      const item = options[i];
      if (result.length === limit) {
        return result;
      }
      if (isOptionsGroup(item)) {
        result.push({
          group: item.group,
          items: defaultOptionsFilter({
            options: item.items,
            search,
            limit: limit - result.length
          })
        });
      }
      if (!isOptionsGroup(item)) {
        if (item.label.toLowerCase().includes(parsedSearch)) {
          result.push(item);
        }
      }
    }
    return result;
  }
  function isEmptyComboboxData(data) {
    if (data.length === 0) {
      return true;
    }
    for (const item of data) {
      if (!("group" in item)) {
        return false;
      }
      if (item.items.length > 0) {
        return false;
      }
    }
    return true;
  }
  function validateOptions(options, valuesSet =  new Set()) {
    if (!Array.isArray(options)) {
      return;
    }
    for (const option of options) {
      if (isOptionsGroup(option)) {
        validateOptions(option.items, valuesSet);
      } else {
        if (typeof option.value === "undefined") {
          throw new Error("[@mantine/core] Each option must have value property");
        }
        if (typeof option.value !== "string") {
          throw new Error(
            `[@mantine/core] Option value must be a string, other data formats are not supported, got ${typeof option.value}`
          );
        }
        if (valuesSet.has(option.value)) {
          throw new Error(
            `[@mantine/core] Duplicate options are not supported. Option with value "${option.value}" was provided more than once`
          );
        }
        valuesSet.add(option.value);
      }
    }
  }
  function isValueChecked(value, optionValue) {
    return Array.isArray(value) ? value.includes(optionValue) : value === optionValue;
  }
  function Option({
    data,
    withCheckIcon,
    value,
    checkIconPosition,
    unstyled,
    renderOption
  }) {
    if (!isOptionsGroup(data)) {
      const checked = isValueChecked(value, data.value);
      const check = withCheckIcon && checked &&  jsxRuntime.jsx(CheckIcon, { className: classes23.optionsDropdownCheckIcon });
      const defaultContent =  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        checkIconPosition === "left" && check,
         jsxRuntime.jsx("span", { children: data.label }),
        checkIconPosition === "right" && check
      ] });
      return  jsxRuntime.jsx(
        Combobox.Option,
        {
          value: data.value,
          disabled: data.disabled,
          className: clsx_default({ [classes23.optionsDropdownOption]: !unstyled }),
          "data-reverse": checkIconPosition === "right" || void 0,
          "data-checked": checked || void 0,
          "aria-selected": checked,
          active: checked,
          children: typeof renderOption === "function" ? renderOption({ option: data, checked }) : defaultContent
        }
      );
    }
    const options = data.items.map((item) =>  jsxRuntime.jsx(
      Option,
      {
        data: item,
        value,
        unstyled,
        withCheckIcon,
        checkIconPosition,
        renderOption
      },
      item.value
    ));
    return  jsxRuntime.jsx(Combobox.Group, { label: data.group, children: options });
  }
  function OptionsDropdown({
    data,
    hidden,
    hiddenWhenEmpty,
    filter,
    search,
    limit,
    maxDropdownHeight,
    withScrollArea = true,
    filterOptions = true,
    withCheckIcon = false,
    value,
    checkIconPosition,
    nothingFoundMessage,
    unstyled,
    labelId,
    renderOption,
    scrollAreaProps,
    "aria-label": ariaLabel
  }) {
    validateOptions(data);
    const shouldFilter = typeof search === "string";
    const filteredData = shouldFilter ? (filter || defaultOptionsFilter)({
      options: data,
      search: filterOptions ? search : "",
      limit: limit ?? Infinity
    }) : data;
    const isEmpty = isEmptyComboboxData(filteredData);
    const options = filteredData.map((item) =>  jsxRuntime.jsx(
      Option,
      {
        data: item,
        withCheckIcon,
        value,
        checkIconPosition,
        unstyled,
        renderOption
      },
      isOptionsGroup(item) ? item.group : item.value
    ));
    return  jsxRuntime.jsx(Combobox.Dropdown, { hidden: hidden || hiddenWhenEmpty && isEmpty, children:  jsxRuntime.jsxs(Combobox.Options, { labelledBy: labelId, "aria-label": ariaLabel, children: [
      withScrollArea ?  jsxRuntime.jsx(
        ScrollArea.Autosize,
        {
          mah: maxDropdownHeight ?? 220,
          type: "scroll",
          scrollbarSize: "var(--combobox-padding)",
          offsetScrollbars: "y",
          ...scrollAreaProps,
          children: options
        }
      ) : options,
      isEmpty && nothingFoundMessage &&  jsxRuntime.jsx(Combobox.Empty, { children: nothingFoundMessage })
    ] }) });
  }
  var defaultProps61 = {};
  var Autocomplete = factory((_props, ref) => {
    const props = useProps("Autocomplete", defaultProps61, _props);
    const {
      classNames,
      styles,
      unstyled,
      vars,
      dropdownOpened,
      defaultDropdownOpened,
      onDropdownClose,
      onDropdownOpen,
      onFocus,
      onBlur,
      onClick,
      onChange,
      data,
      value,
      defaultValue,
      selectFirstOptionOnChange,
      onOptionSubmit,
      comboboxProps,
      readOnly,
      disabled,
      filter,
      limit,
      withScrollArea,
      maxDropdownHeight,
      size: size4,
      id,
      renderOption,
      autoComplete,
      scrollAreaProps,
      ...others
    } = props;
    const _id = hooks.useId(id);
    const parsedData = getParsedComboboxData(data);
    const optionsLockup = getOptionsLockup(parsedData);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "",
      onChange
    });
    const combobox = useCombobox({
      opened: dropdownOpened,
      defaultOpened: defaultDropdownOpened,
      onDropdownOpen,
      onDropdownClose: () => {
        onDropdownClose?.();
        combobox.resetSelectedOption();
      }
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      props,
      styles,
      classNames
    });
    React10.useEffect(() => {
      if (selectFirstOptionOnChange) {
        combobox.selectFirstOption();
      }
    }, [selectFirstOptionOnChange, _value]);
    return  jsxRuntime.jsxs(
      Combobox,
      {
        store: combobox,
        __staticSelector: "Autocomplete",
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        unstyled,
        readOnly,
        onOptionSubmit: (val) => {
          onOptionSubmit?.(val);
          setValue(optionsLockup[val].label);
          combobox.closeDropdown();
        },
        size: size4,
        ...comboboxProps,
        children: [
           jsxRuntime.jsx(Combobox.Target, { autoComplete, children:  jsxRuntime.jsx(
            InputBase,
            {
              ref,
              ...others,
              size: size4,
              __staticSelector: "Autocomplete",
              disabled,
              readOnly,
              value: _value,
              onChange: (event) => {
                setValue(event.currentTarget.value);
                combobox.openDropdown();
                selectFirstOptionOnChange && combobox.selectFirstOption();
              },
              onFocus: (event) => {
                combobox.openDropdown();
                onFocus?.(event);
              },
              onBlur: (event) => {
                combobox.closeDropdown();
                onBlur?.(event);
              },
              onClick: (event) => {
                combobox.openDropdown();
                onClick?.(event);
              },
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              unstyled,
              id: _id
            }
          ) }),
           jsxRuntime.jsx(
            OptionsDropdown,
            {
              data: parsedData,
              hidden: readOnly || disabled,
              filter,
              search: _value,
              limit,
              hiddenWhenEmpty: true,
              withScrollArea,
              maxDropdownHeight,
              unstyled,
              labelId: others.label ? `${_id}-label` : void 0,
              "aria-label": others.label ? void 0 : others["aria-label"],
              renderOption,
              scrollAreaProps
            }
          )
        ]
      }
    );
  });
  Autocomplete.classes = { ...InputBase.classes, ...Combobox.classes };
  Autocomplete.displayName = "@mantine/core/Autocomplete";
  var AvatarGroupContext = React10.createContext(null);
  var AvatarGroupProvider = AvatarGroupContext.Provider;
  function useAvatarGroupContext() {
    const ctx = React10.useContext(AvatarGroupContext);
    return { withinGroup: !!ctx };
  }
  var classes28 = { "group": "m_11def92b", "root": "m_f85678b6", "image": "m_11f8ac07", "placeholder": "m_104cd71f" };
  var defaultProps62 = {};
  var varsResolver29 = createVarsResolver((_, { spacing }) => ({
    group: {
      "--ag-spacing": getSpacing(spacing)
    }
  }));
  var AvatarGroup = factory((_props, ref) => {
    const props = useProps("AvatarGroup", defaultProps62, _props);
    const { classNames, className, style, styles, unstyled, vars, spacing, ...others } = props;
    const getStyles2 = useStyles({
      name: "AvatarGroup",
      classes: classes28,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver29,
      rootSelector: "group"
    });
    return  jsxRuntime.jsx(AvatarGroupProvider, { value: true, children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("group"), ...others }) });
  });
  AvatarGroup.classes = classes28;
  AvatarGroup.displayName = "@mantine/core/AvatarGroup";
  function AvatarPlaceholderIcon(props) {
    return  jsxRuntime.jsx(
      "svg",
      {
        ...props,
        "data-avatar-placeholder-icon": true,
        viewBox: "0 0 15 15",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    );
  }
  function getInitials(name, limit = 2) {
    const splitted = name.split(" ");
    if (splitted.length === 1) {
      return name.slice(0, limit).toUpperCase();
    }
    return splitted.map((word) => word[0]).slice(0, limit).join("").toUpperCase();
  }
  function hashCode(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  }
  var defaultColors = [
    "blue",
    "cyan",
    "grape",
    "green",
    "indigo",
    "lime",
    "orange",
    "pink",
    "red",
    "teal",
    "violet"
  ];
  function getInitialsColor(name, colors = defaultColors) {
    const hash = hashCode(getInitials(name));
    const index3 = Math.abs(hash) % colors.length;
    return colors[index3];
  }
  var defaultProps63 = {};
  var varsResolver30 = createVarsResolver(
    (theme, { size: size4, radius, variant, gradient, color, autoContrast, name, allowedInitialsColors }) => {
      const _color = color === "initials" && typeof name === "string" ? getInitialsColor(name, allowedInitialsColors) : color;
      const colors = theme.variantColorResolver({
        color: _color || "gray",
        theme,
        gradient,
        variant: variant || "light",
        autoContrast
      });
      return {
        root: {
          "--avatar-size": getSize(size4, "avatar-size"),
          "--avatar-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--avatar-bg": _color || variant ? colors.background : void 0,
          "--avatar-color": _color || variant ? colors.color : void 0,
          "--avatar-bd": _color || variant ? colors.border : void 0
        }
      };
    }
  );
  var Avatar = polymorphicFactory((_props, ref) => {
    const props = useProps("Avatar", defaultProps63, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      src,
      alt,
      radius,
      color,
      gradient,
      imageProps,
      children,
      autoContrast,
      mod,
      name,
      allowedInitialsColors,
      ...others
    } = props;
    const ctx = useAvatarGroupContext();
    const [error2, setError] = React10.useState(!src);
    const getStyles2 = useStyles({
      name: "Avatar",
      props,
      classes: classes28,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver30
    });
    React10.useEffect(() => setError(!src), [src]);
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root"),
        mod: [{ "within-group": ctx.withinGroup }, mod],
        ref,
        ...others,
        children: error2 ?  jsxRuntime.jsx("span", { ...getStyles2("placeholder"), title: alt, children: children || typeof name === "string" && getInitials(name) ||  jsxRuntime.jsx(AvatarPlaceholderIcon, {}) }) :  jsxRuntime.jsx(
          "img",
          {
            ...imageProps,
            ...getStyles2("image"),
            src,
            alt,
            onError: (event) => {
              setError(true);
              imageProps?.onError?.(event);
            }
          }
        )
      }
    );
  });
  Avatar.classes = classes28;
  Avatar.displayName = "@mantine/core/Avatar";
  Avatar.Group = AvatarGroup;
  var classes29 = { "root": "m_2ce0de02" };
  var defaultProps64 = {};
  var varsResolver31 = createVarsResolver((_, { radius }) => ({
    root: { "--bi-radius": radius === void 0 ? void 0 : getRadius(radius) }
  }));
  var BackgroundImage = polymorphicFactory((_props, ref) => {
    const props = useProps("BackgroundImage", defaultProps64, _props);
    const { classNames, className, style, styles, unstyled, vars, radius, src, variant, ...others } = props;
    const getStyles2 = useStyles({
      name: "BackgroundImage",
      props,
      classes: classes29,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver31
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        variant,
        ...getStyles2("root", { style: { backgroundImage: `url(${src})` } }),
        ...others
      }
    );
  });
  BackgroundImage.classes = classes29;
  BackgroundImage.displayName = "@mantine/core/BackgroundImage";
  var classes30 = { "root": "m_347db0ec", "root--dot": "m_fbd81e3d", "label": "m_5add502a", "section": "m_91fdda9b" };
  var defaultProps65 = {};
  var varsResolver32 = createVarsResolver(
    (theme, { radius, color, gradient, variant, size: size4, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        root: {
          "--badge-height": getSize(size4, "badge-height"),
          "--badge-padding-x": getSize(size4, "badge-padding-x"),
          "--badge-fz": getSize(size4, "badge-fz"),
          "--badge-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--badge-bg": color || variant ? colors.background : void 0,
          "--badge-color": color || variant ? colors.color : void 0,
          "--badge-bd": color || variant ? colors.border : void 0,
          "--badge-dot-color": variant === "dot" ? getThemeColor(color, theme) : void 0
        }
      };
    }
  );
  var Badge = polymorphicFactory((_props, ref) => {
    const props = useProps("Badge", defaultProps65, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      radius,
      color,
      gradient,
      leftSection,
      rightSection,
      children,
      variant,
      fullWidth,
      autoContrast,
      circle,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Badge",
      props,
      classes: classes30,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver32
    });
    return  jsxRuntime.jsxs(
      Box,
      {
        variant,
        mod: [
          {
            block: fullWidth,
            circle,
            "with-right-section": !!rightSection,
            "with-left-section": !!leftSection
          },
          mod
        ],
        ...getStyles2("root", { variant }),
        ref,
        ...others,
        children: [
          leftSection &&  jsxRuntime.jsx("span", { ...getStyles2("section"), "data-position": "left", children: leftSection }),
           jsxRuntime.jsx("span", { ...getStyles2("label"), children }),
          rightSection &&  jsxRuntime.jsx("span", { ...getStyles2("section"), "data-position": "right", children: rightSection })
        ]
      }
    );
  });
  Badge.classes = classes30;
  Badge.displayName = "@mantine/core/Badge";
  var classes31 = { "root": "m_ddec01c0", "icon": "m_dde7bd57", "cite": "m_dde51a35" };
  var defaultProps66 = {
    iconSize: 48
  };
  var varsResolver33 = createVarsResolver((theme, { color, iconSize, radius }) => {
    const darkParsed = parseThemeColor({
      color: color || theme.primaryColor,
      theme,
      colorScheme: "dark"
    });
    const lightParsed = parseThemeColor({
      color: color || theme.primaryColor,
      theme,
      colorScheme: "light"
    });
    return {
      root: {
        "--bq-bg-light": rgba(lightParsed.value, 0.07),
        "--bq-bg-dark": rgba(darkParsed.value, 0.06),
        "--bq-bd": getThemeColor(color, theme),
        "--bq-icon-size": rem(iconSize),
        "--bq-radius": getRadius(radius)
      }
    };
  });
  var Blockquote = factory((_props, ref) => {
    const props = useProps("Blockquote", defaultProps66, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      icon,
      iconSize,
      cite,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Blockquote",
      classes: classes31,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver33
    });
    return  jsxRuntime.jsxs(Box, { component: "blockquote", ref, ...getStyles2("root"), ...others, children: [
      icon &&  jsxRuntime.jsx("span", { ...getStyles2("icon"), children: icon }),
      children,
      cite &&  jsxRuntime.jsx("cite", { ...getStyles2("cite"), children: cite })
    ] });
  });
  Blockquote.classes = classes31;
  Blockquote.displayName = "@mantine/core/Blockquote";
  var classes32 = { "root": "m_8b3717df", "breadcrumb": "m_f678d540", "separator": "m_3b8f2208" };
  var defaultProps67 = {
    separator: "/"
  };
  var varsResolver34 = createVarsResolver((_, { separatorMargin }) => ({
    root: {
      "--bc-separator-margin": getSpacing(separatorMargin)
    }
  }));
  var Breadcrumbs = factory((_props, ref) => {
    const props = useProps("Breadcrumbs", defaultProps67, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      separator,
      separatorMargin,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Breadcrumbs",
      classes: classes32,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver34
    });
    const items = React10.Children.toArray(children).reduce((acc, child, index3, array) => {
      const item = isElement(child) ? React10.cloneElement(child, {
        ...getStyles2("breadcrumb", { className: child.props?.className }),
        key: index3
      }) :  React10.createElement("div", { ...getStyles2("breadcrumb"), key: index3 }, child);
      acc.push(item);
      if (index3 !== array.length - 1) {
        acc.push(
           React10.createElement(Box, { ...getStyles2("separator"), key: `separator-${index3}` }, separator)
        );
      }
      return acc;
    }, []);
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others, children: items });
  });
  Breadcrumbs.classes = classes32;
  Breadcrumbs.displayName = "@mantine/core/Breadcrumbs";
  var classes33 = { "root": "m_fea6bf1a", "burger": "m_d4fb9cad" };
  var defaultProps68 = {};
  var varsResolver35 = createVarsResolver(
    (theme, { color, size: size4, lineSize, transitionDuration, transitionTimingFunction }) => ({
      root: {
        "--burger-color": color ? getThemeColor(color, theme) : void 0,
        "--burger-size": getSize(size4, "burger-size"),
        "--burger-line-size": lineSize ? rem(lineSize) : void 0,
        "--burger-transition-duration": transitionDuration === void 0 ? void 0 : `${transitionDuration}ms`,
        "--burger-transition-timing-function": transitionTimingFunction
      }
    })
  );
  var Burger = factory((_props, ref) => {
    const props = useProps("Burger", defaultProps68, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      opened,
      children,
      transitionDuration,
      transitionTimingFunction,
      lineSize,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Burger",
      classes: classes33,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver35
    });
    return  jsxRuntime.jsxs(UnstyledButton, { ...getStyles2("root"), ref, ...others, children: [
       jsxRuntime.jsx(Box, { mod: ["reduce-motion", { opened }], ...getStyles2("burger") }),
      children
    ] });
  });
  Burger.classes = classes33;
  Burger.displayName = "@mantine/core/Burger";
  var classes34 = { "root": "m_77c9d27d", "inner": "m_80f1301b", "label": "m_811560b9", "section": "m_a74036a", "loader": "m_a25b86ee", "group": "m_80d6d844", "groupSection": "m_70be2a01" };
  var defaultProps69 = {
    orientation: "horizontal"
  };
  var varsResolver36 = createVarsResolver((_, { borderWidth }) => ({
    group: { "--button-border-width": rem(borderWidth) }
  }));
  var ButtonGroup = factory((_props, ref) => {
    const props = useProps("ButtonGroup", defaultProps69, _props);
    const {
      className,
      style,
      classNames,
      styles,
      unstyled,
      orientation,
      vars,
      borderWidth,
      variant,
      mod,
      ...others
    } = useProps("ButtonGroup", defaultProps69, _props);
    const getStyles2 = useStyles({
      name: "ButtonGroup",
      props,
      classes: classes34,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver36,
      rootSelector: "group"
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("group"),
        ref,
        variant,
        mod: [{ "data-orientation": orientation }, mod],
        role: "group",
        ...others
      }
    );
  });
  ButtonGroup.classes = classes34;
  ButtonGroup.displayName = "@mantine/core/ButtonGroup";
  var defaultProps70 = {};
  var varsResolver37 = createVarsResolver(
    (theme, { radius, color, gradient, variant, autoContrast, size: size4 }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        groupSection: {
          "--section-height": getSize(size4, "section-height"),
          "--section-padding-x": getSize(size4, "section-padding-x"),
          "--section-fz": size4?.includes("compact") ? getFontSize(size4.replace("compact-", "")) : getFontSize(size4),
          "--section-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--section-bg": color || variant ? colors.background : void 0,
          "--section-color": colors.color,
          "--section-bd": color || variant ? colors.border : void 0
        }
      };
    }
  );
  var ButtonGroupSection = factory((_props, ref) => {
    const props = useProps("ButtonGroupSection", defaultProps70, _props);
    const {
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      variant,
      gradient,
      radius,
      autoContrast,
      ...others
    } = useProps("ButtonGroupSection", defaultProps70, _props);
    const getStyles2 = useStyles({
      name: "ButtonGroupSection",
      props,
      classes: classes34,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver37,
      rootSelector: "groupSection"
    });
    return  jsxRuntime.jsx(Box, { ...getStyles2("groupSection"), ref, variant, ...others });
  });
  ButtonGroupSection.classes = classes34;
  ButtonGroupSection.displayName = "@mantine/core/ButtonGroupSection";
  var loaderTransition = {
    in: { opacity: 1, transform: `translate(-50%, calc(-50% + ${rem(1)}))` },
    out: { opacity: 0, transform: "translate(-50%, -200%)" },
    common: { transformOrigin: "center" },
    transitionProperty: "transform, opacity"
  };
  var defaultProps71 = {};
  var varsResolver38 = createVarsResolver(
    (theme, { radius, color, gradient, variant, size: size4, justify, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        root: {
          "--button-justify": justify,
          "--button-height": getSize(size4, "button-height"),
          "--button-padding-x": getSize(size4, "button-padding-x"),
          "--button-fz": size4?.includes("compact") ? getFontSize(size4.replace("compact-", "")) : getFontSize(size4),
          "--button-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--button-bg": color || variant ? colors.background : void 0,
          "--button-hover": color || variant ? colors.hover : void 0,
          "--button-color": colors.color,
          "--button-bd": color || variant ? colors.border : void 0,
          "--button-hover-color": color || variant ? colors.hoverColor : void 0
        }
      };
    }
  );
  var Button = polymorphicFactory((_props, ref) => {
    const props = useProps("Button", defaultProps71, _props);
    const {
      style,
      vars,
      className,
      color,
      disabled,
      children,
      leftSection,
      rightSection,
      fullWidth,
      variant,
      radius,
      loading,
      loaderProps,
      gradient,
      classNames,
      styles,
      unstyled,
      "data-disabled": dataDisabled,
      autoContrast,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Button",
      props,
      classes: classes34,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver38
    });
    const hasLeftSection = !!leftSection;
    const hasRightSection = !!rightSection;
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ref,
        ...getStyles2("root", { active: !disabled && !loading && !dataDisabled }),
        unstyled,
        variant,
        disabled: disabled || loading,
        mod: [
          {
            disabled: disabled || dataDisabled,
            loading,
            block: fullWidth,
            "with-left-section": hasLeftSection,
            "with-right-section": hasRightSection
          },
          mod
        ],
        ...others,
        children: [
           jsxRuntime.jsx(Transition, { mounted: !!loading, transition: loaderTransition, duration: 150, children: (transitionStyles) =>  jsxRuntime.jsx(Box, { component: "span", ...getStyles2("loader", { style: transitionStyles }), "aria-hidden": true, children:  jsxRuntime.jsx(
            Loader,
            {
              color: "var(--button-color)",
              size: "calc(var(--button-height) / 1.8)",
              ...loaderProps
            }
          ) }) }),
           jsxRuntime.jsxs("span", { ...getStyles2("inner"), children: [
            leftSection &&  jsxRuntime.jsx(Box, { component: "span", ...getStyles2("section"), mod: { position: "left" }, children: leftSection }),
             jsxRuntime.jsx(Box, { component: "span", mod: { loading }, ...getStyles2("label"), children }),
            rightSection &&  jsxRuntime.jsx(Box, { component: "span", ...getStyles2("section"), mod: { position: "right" }, children: rightSection })
          ] })
        ]
      }
    );
  });
  Button.classes = classes34;
  Button.displayName = "@mantine/core/Button";
  Button.Group = ButtonGroup;
  Button.GroupSection = ButtonGroupSection;
  var [CardProvider, useCardContext] = createSafeContext(
    "Card component was not found in tree"
  );
  var classes35 = { "root": "m_e615b15f", "section": "m_599a2148" };
  var defaultProps72 = {};
  var CardSection = polymorphicFactory((_props, ref) => {
    const props = useProps("CardSection", defaultProps72, _props);
    const { classNames, className, style, styles, vars, withBorder, inheritPadding, mod, ...others } = props;
    const ctx = useCardContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        mod: [{ "with-border": withBorder, "inherit-padding": inheritPadding }, mod],
        ...ctx.getStyles("section", { className, style, styles, classNames }),
        ...others
      }
    );
  });
  CardSection.classes = classes35;
  CardSection.displayName = "@mantine/core/CardSection";
  var defaultProps73 = {};
  var varsResolver39 = createVarsResolver((_, { padding }) => ({
    root: {
      "--card-padding": getSpacing(padding)
    }
  }));
  var Card = polymorphicFactory((_props, ref) => {
    const props = useProps("Card", defaultProps73, _props);
    const { classNames, className, style, styles, unstyled, vars, children, padding, ...others } = props;
    const getStyles2 = useStyles({
      name: "Card",
      props,
      classes: classes35,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver39
    });
    const _children = React10.Children.toArray(children);
    const content = _children.map((child, index3) => {
      if (typeof child === "object" && child && "type" in child && child.type === CardSection) {
        return React10.cloneElement(child, {
          "data-first-section": index3 === 0 || void 0,
          "data-last-section": index3 === _children.length - 1 || void 0
        });
      }
      return child;
    });
    return  jsxRuntime.jsx(CardProvider, { value: { getStyles: getStyles2 }, children:  jsxRuntime.jsx(Paper, { ref, unstyled, ...getStyles2("root"), ...others, children: content }) });
  });
  Card.classes = classes35;
  Card.displayName = "@mantine/core/Card";
  Card.Section = CardSection;
  var classes36 = { "root": "m_4451eb3a" };
  var defaultProps74 = {};
  var Center = polymorphicFactory((_props, ref) => {
    const props = useProps("Center", defaultProps74, _props);
    const { classNames, className, style, styles, unstyled, vars, inline: inline4, mod, ...others } = props;
    const getStyles2 = useStyles({
      name: "Center",
      props,
      classes: classes36,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars
    });
    return  jsxRuntime.jsx(Box, { ref, mod: [{ inline: inline4 }, mod], ...getStyles2("root"), ...others });
  });
  Center.classes = classes36;
  Center.displayName = "@mantine/core/Center";
  var [ChipGroupProvider, useChipGroupContext] = createOptionalContext();
  var defaultProps75 = {};
  function ChipGroup(props) {
    const { value, defaultValue, onChange, multiple, children } = useProps(
      "ChipGroup",
      defaultProps75,
      props
    );
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: multiple ? [] : null,
      onChange
    });
    const isChipSelected = (val) => Array.isArray(_value) ? _value.includes(val) : val === _value;
    const handleChange = (event) => {
      const val = event.currentTarget.value;
      if (Array.isArray(_value)) {
        setValue(_value.includes(val) ? _value.filter((v) => v !== val) : [..._value, val]);
      } else {
        setValue(val);
      }
    };
    return  jsxRuntime.jsx(ChipGroupProvider, { value: { isChipSelected, onChange: handleChange, multiple }, children });
  }
  ChipGroup.displayName = "@mantine/core/ChipGroup";
  var classes37 = { "root": "m_f59ffda3", "label": "m_be049a53", "label--outline": "m_3904c1af", "label--filled": "m_fa109255", "label--light": "m_f7e165c3", "iconWrapper": "m_9ac86df9", "checkIcon": "m_d6d72580", "input": "m_bde07329" };
  var defaultProps76 = {
    type: "checkbox"
  };
  var varsResolver40 = createVarsResolver(
    (theme, { size: size4, radius, variant, color, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        variant: variant || "filled",
        autoContrast
      });
      return {
        root: {
          "--chip-fz": getFontSize(size4),
          "--chip-size": getSize(size4, "chip-size"),
          "--chip-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--chip-checked-padding": getSize(size4, "chip-checked-padding"),
          "--chip-padding": getSize(size4, "chip-padding"),
          "--chip-icon-size": getSize(size4, "chip-icon-size"),
          "--chip-bg": color || variant ? colors.background : void 0,
          "--chip-hover": color || variant ? colors.hover : void 0,
          "--chip-color": color || variant ? colors.color : void 0,
          "--chip-bd": color || variant ? colors.border : void 0,
          "--chip-spacing": getSize(size4, "chip-spacing")
        }
      };
    }
  );
  var Chip = factory((_props, ref) => {
    const props = useProps("Chip", defaultProps76, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      id,
      checked,
      defaultChecked,
      onChange,
      value,
      wrapperProps,
      type,
      disabled,
      children,
      size: size4,
      variant,
      icon,
      rootRef,
      autoContrast,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Chip",
      classes: classes37,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver40
    });
    const ctx = useChipGroupContext();
    const uuid = hooks.useId(id);
    const { styleProps, rest } = extractStyleProps(others);
    const [_value, setValue] = hooks.useUncontrolled({
      value: checked,
      defaultValue: defaultChecked,
      finalValue: false,
      onChange
    });
    const contextProps = ctx ? {
      checked: ctx.isChipSelected(value),
      onChange: (event) => {
        ctx.onChange(event);
        onChange?.(event.currentTarget.checked);
      },
      type: ctx.multiple ? "checkbox" : "radio"
    } : {};
    const _checked = contextProps.checked || _value;
    return  jsxRuntime.jsxs(
      Box,
      {
        size: size4,
        variant,
        ref: rootRef,
        mod,
        ...getStyles2("root"),
        ...styleProps,
        ...wrapperProps,
        children: [
           jsxRuntime.jsx(
            "input",
            {
              type,
              ...getStyles2("input"),
              checked: _checked,
              onChange: (event) => setValue(event.currentTarget.checked),
              id: uuid,
              disabled,
              ref,
              value,
              ...contextProps,
              ...rest
            }
          ),
           jsxRuntime.jsxs(
            "label",
            {
              htmlFor: uuid,
              "data-checked": _checked || void 0,
              "data-disabled": disabled || void 0,
              ...getStyles2("label", { variant: variant || "filled" }),
              children: [
                _checked &&  jsxRuntime.jsx("span", { ...getStyles2("iconWrapper"), children: icon ||  jsxRuntime.jsx(CheckIcon, { ...getStyles2("checkIcon") }) }),
                 jsxRuntime.jsx("span", { children })
              ]
            }
          )
        ]
      }
    );
  });
  Chip.classes = classes37;
  Chip.displayName = "@mantine/core/Chip";
  Chip.Group = ChipGroup;
  var classes38 = { "root": "m_b183c0a2" };
  var defaultProps77 = {};
  var varsResolver41 = createVarsResolver((theme, { color }) => ({
    root: {
      "--code-bg": color ? getThemeColor(color, theme) : void 0
    }
  }));
  var Code = factory((_props, ref) => {
    const props = useProps("Code", defaultProps77, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      color,
      block,
      variant,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Code",
      props,
      classes: classes38,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver41
    });
    return  jsxRuntime.jsx(
      Box,
      {
        component: block ? "pre" : "code",
        variant,
        ref,
        mod: [{ block }, mod],
        ...getStyles2("root"),
        ...others,
        dir: "ltr"
      }
    );
  });
  Code.classes = classes38;
  Code.displayName = "@mantine/core/Code";
  var classes39 = { "root": "m_de3d2490", "colorOverlay": "m_862f3d1b", "shadowOverlay": "m_98ae7f22", "alphaOverlay": "m_95709ac0", "childrenOverlay": "m_93e74e3" };
  var defaultProps78 = {
    withShadow: true
  };
  var varsResolver42 = createVarsResolver((_, { radius, size: size4 }) => ({
    root: {
      "--cs-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--cs-size": rem(size4)
    }
  }));
  var ColorSwatch = polymorphicFactory((_props, ref) => {
    const props = useProps("ColorSwatch", defaultProps78, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      color,
      size: size4,
      radius,
      withShadow,
      children,
      variant,
      ...others
    } = useProps("ColorSwatch", defaultProps78, props);
    const getStyles2 = useStyles({
      name: "ColorSwatch",
      props,
      classes: classes39,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver42
    });
    return  jsxRuntime.jsxs(
      Box,
      {
        ref,
        variant,
        size: size4,
        ...getStyles2("root", { focusable: true }),
        ...others,
        children: [
           jsxRuntime.jsx("span", { ...getStyles2("alphaOverlay") }),
          withShadow &&  jsxRuntime.jsx("span", { ...getStyles2("shadowOverlay") }),
           jsxRuntime.jsx("span", { ...getStyles2("colorOverlay", { style: { backgroundColor: color } }) }),
           jsxRuntime.jsx("span", { ...getStyles2("childrenOverlay"), children })
        ]
      }
    );
  });
  ColorSwatch.classes = classes39;
  ColorSwatch.displayName = "@mantine/core/ColorSwatch";
  var [ColorPickerProvider, useColorPickerContext] = createOptionalContext(null);
  var Thumb2 = React10.forwardRef(({ position, ...others }, ref) =>  jsxRuntime.jsx(
    Box,
    {
      ref,
      __vars: {
        "--thumb-y-offset": `${position.y * 100}%`,
        "--thumb-x-offset": `${position.x * 100}%`
      },
      ...others
    }
  ));
  Thumb2.displayName = "@mantine/core/ColorPickerThumb";
  var classes40 = { "wrapper": "m_fee9c77", "preview": "m_9dddfbac", "body": "m_bffecc3e", "sliders": "m_3283bb96", "thumb": "m_40d572ba", "swatch": "m_d8ee6fd8", "swatches": "m_5711e686", "saturation": "m_202a296e", "saturationOverlay": "m_11b3db02", "slider": "m_d856d47d", "sliderOverlay": "m_8f327113" };
  var defaultProps79 = {};
  var ColorSlider = factory((_props, ref) => {
    const props = useProps("ColorSlider", defaultProps79, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      onChange,
      onChangeEnd,
      maxValue,
      round: round3,
      size: size4 = "md",
      focusable = true,
      value,
      overlays,
      thumbColor = "transparent",
      onScrubStart,
      onScrubEnd,
      __staticSelector = "ColorPicker",
      ...others
    } = props;
    const _getStyles = useStyles({
      name: __staticSelector,
      classes: classes40,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled
    });
    const ctxGetStyles = useColorPickerContext()?.getStyles;
    const getStyles2 = ctxGetStyles || _getStyles;
    const theme = useMantineTheme();
    const [position, setPosition] = React10.useState({ y: 0, x: value / maxValue });
    const positionRef = React10.useRef(position);
    const getChangeValue2 = (val) => round3 ? Math.round(val * maxValue) : val * maxValue;
    const { ref: sliderRef } = hooks.useMove(
      ({ x, y }) => {
        positionRef.current = { x, y };
        onChange?.(getChangeValue2(x));
      },
      {
        onScrubEnd: () => {
          const { x } = positionRef.current;
          onChangeEnd?.(getChangeValue2(x));
          onScrubEnd?.();
        },
        onScrubStart
      }
    );
    hooks.useDidUpdate(() => {
      setPosition({ y: 0, x: value / maxValue });
    }, [value]);
    const handleArrow = (event, pos) => {
      event.preventDefault();
      const _position = hooks.clampUseMovePosition(pos);
      onChange?.(getChangeValue2(_position.x));
      onChangeEnd?.(getChangeValue2(_position.x));
    };
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight": {
          handleArrow(event, { x: position.x + 0.05, y: position.y });
          break;
        }
        case "ArrowLeft": {
          handleArrow(event, { x: position.x - 0.05, y: position.y });
          break;
        }
      }
    };
    const layers = overlays.map((overlay, index3) =>  React10.createElement("div", { ...getStyles2("sliderOverlay"), style: overlay, key: index3 }));
    return  jsxRuntime.jsxs(
      Box,
      {
        ...others,
        ref: hooks.useMergedRef(sliderRef, ref),
        ...getStyles2("slider"),
        role: "slider",
        "aria-valuenow": value,
        "aria-valuemax": maxValue,
        "aria-valuemin": 0,
        tabIndex: focusable ? 0 : -1,
        onKeyDown: handleKeyDown,
        "data-focus-ring": theme.focusRing,
        __vars: {
          "--cp-thumb-size": `var(--cp-thumb-size-${size4})`
        },
        children: [
          layers,
           jsxRuntime.jsx(
            Thumb2,
            {
              position,
              ...getStyles2("thumb", { style: { top: rem(1), background: thumbColor } })
            }
          )
        ]
      }
    );
  });
  ColorSlider.displayName = "@mantine/core/ColorSlider";
  function round2(number, digits = 0, base = 10 ** digits) {
    return Math.round(base * number) / base;
  }
  function hslaToHsva({ h, s, l, a }) {
    const ss = s * ((l < 50 ? l : 100 - l) / 100);
    return {
      h,
      s: ss > 0 ? 2 * ss / (l + ss) * 100 : 0,
      v: l + ss,
      a
    };
  }
  var angleUnits = {
    grad: 360 / 400,
    turn: 360,
    rad: 360 / (Math.PI * 2)
  };
  function parseHue(value, unit = "deg") {
    return Number(value) * (angleUnits[unit] || 1);
  }
  var HSL_REGEXP = /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
  function parseHsla(color) {
    const match = HSL_REGEXP.exec(color);
    if (!match) {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
    return hslaToHsva({
      h: parseHue(match[1], match[2]),
      s: Number(match[3]),
      l: Number(match[4]),
      a: match[5] === void 0 ? 1 : Number(match[5]) / (match[6] ? 100 : 1)
    });
  }
  function rgbaToHsva({ r: r2, g, b, a }) {
    const max2 = Math.max(r2, g, b);
    const delta = max2 - Math.min(r2, g, b);
    const hh = delta ? max2 === r2 ? (g - b) / delta : max2 === g ? 2 + (b - r2) / delta : 4 + (r2 - g) / delta : 0;
    return {
      h: round2(60 * (hh < 0 ? hh + 6 : hh), 3),
      s: round2(max2 ? delta / max2 * 100 : 0, 3),
      v: round2(max2 / 255 * 100, 3),
      a
    };
  }
  function parseHex(color) {
    const hex = color[0] === "#" ? color.slice(1) : color;
    if (hex.length === 3) {
      return rgbaToHsva({
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1
      });
    }
    return rgbaToHsva({
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1
    });
  }
  function parseHexa(color) {
    const hex = color[0] === "#" ? color.slice(1) : color;
    const roundA = (a2) => round2(parseInt(a2, 16) / 255, 3);
    if (hex.length === 4) {
      const withoutOpacity2 = hex.slice(0, 3);
      const a2 = roundA(hex[3] + hex[3]);
      const hsvaColor2 = { ...parseHex(withoutOpacity2), a: a2 };
      return hsvaColor2;
    }
    const withoutOpacity = hex.slice(0, 6);
    const a = roundA(hex.slice(6, 8));
    const hsvaColor = { ...parseHex(withoutOpacity), a };
    return hsvaColor;
  }
  var RGB_REGEXP = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
  function parseRgba(color) {
    const match = RGB_REGEXP.exec(color);
    if (!match) {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
    return rgbaToHsva({
      r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
      g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
      b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
      a: match[7] === void 0 ? 1 : Number(match[7]) / (match[8] ? 100 : 1)
    });
  }
  var VALIDATION_REGEXP = {
    hex: /^#?([0-9A-F]{3}){1,2}$/i,
    hexa: /^#?([0-9A-F]{4}){1,2}$/i,
    rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
    rgba: /^rgba\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
    hsl: /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/i,
    hsla: /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/i
  };
  var CONVERTERS = {
    hex: parseHex,
    hexa: parseHexa,
    rgb: parseRgba,
    rgba: parseRgba,
    hsl: parseHsla,
    hsla: parseHsla
  };
  function isColorValid(color) {
    for (const [, regexp] of Object.entries(VALIDATION_REGEXP)) {
      if (regexp.test(color)) {
        return true;
      }
    }
    return false;
  }
  function parseColor(color) {
    if (typeof color !== "string") {
      return { h: 0, s: 0, v: 0, a: 1 };
    }
    if (color === "transparent") {
      return { h: 0, s: 0, v: 0, a: 0 };
    }
    const trimmed = color.trim();
    for (const [rule, regexp] of Object.entries(VALIDATION_REGEXP)) {
      if (regexp.test(trimmed)) {
        return CONVERTERS[rule](trimmed);
      }
    }
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  var defaultProps80 = {};
  var AlphaSlider = React10.forwardRef((props, ref) => {
    const { value, onChange, onChangeEnd, color, ...others } = useProps(
      "AlphaSlider",
      defaultProps80,
      props
    );
    return  jsxRuntime.jsx(
      ColorSlider,
      {
        ...others,
        ref,
        value,
        onChange: (val) => onChange?.(round2(val, 2)),
        onChangeEnd: (val) => onChangeEnd?.(round2(val, 2)),
        maxValue: 1,
        round: false,
        "data-alpha": true,
        overlays: [
          {
            backgroundImage: "linear-gradient(45deg, var(--slider-checkers) 25%, transparent 25%), linear-gradient(-45deg, var(--slider-checkers) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--slider-checkers) 75%), linear-gradient(-45deg, var(--mantine-color-body) 75%, var(--slider-checkers) 75%)",
            backgroundSize: `${rem(8)} ${rem(8)}`,
            backgroundPosition: `0 0, 0 ${rem(4)}, ${rem(4)} ${rem(-4)}, ${rem(-4)} 0`
          },
          {
            backgroundImage: `linear-gradient(90deg, transparent, ${color})`
          },
          {
            boxShadow: `rgba(0, 0, 0, .1) 0 0 0 ${rem(1)} inset, rgb(0, 0, 0, .15) 0 0 ${rem(
            4
          )} inset`
          }
        ]
      }
    );
  });
  AlphaSlider.displayName = "@mantine/core/AlphaSlider";
  function hsvaToRgbaObject({ h, s, v, a }) {
    const _h = h / 360 * 6;
    const _s = s / 100;
    const _v = v / 100;
    const hh = Math.floor(_h);
    const l = _v * (1 - _s);
    const c = _v * (1 - (_h - hh) * _s);
    const d = _v * (1 - (1 - _h + hh) * _s);
    const module = hh % 6;
    return {
      r: round2([_v, c, l, l, d, _v][module] * 255),
      g: round2([d, _v, _v, c, l, l][module] * 255),
      b: round2([l, l, d, _v, _v, c][module] * 255),
      a: round2(a, 2)
    };
  }
  function hsvaToRgba(color, includeAlpha) {
    const { r: r2, g, b, a } = hsvaToRgbaObject(color);
    if (!includeAlpha) {
      return `rgb(${r2}, ${g}, ${b})`;
    }
    return `rgba(${r2}, ${g}, ${b}, ${round2(a, 2)})`;
  }
  function hsvaToHsl({ h, s, v, a }, includeAlpha) {
    const hh = (200 - s) * v / 100;
    const result = {
      h: Math.round(h),
      s: Math.round(hh > 0 && hh < 200 ? s * v / 100 / (hh <= 100 ? hh : 200 - hh) * 100 : 0),
      l: Math.round(hh / 2)
    };
    if (!includeAlpha) {
      return `hsl(${result.h}, ${result.s}%, ${result.l}%)`;
    }
    return `hsla(${result.h}, ${result.s}%, ${result.l}%, ${round2(a, 2)})`;
  }
  function formatHexPart(number) {
    const hex = number.toString(16);
    return hex.length < 2 ? `0${hex}` : hex;
  }
  function hsvaToHex(color) {
    const { r: r2, g, b } = hsvaToRgbaObject(color);
    return `#${formatHexPart(r2)}${formatHexPart(g)}${formatHexPart(b)}`;
  }
  function hsvaToHexa(color) {
    const a = Math.round(color.a * 255);
    return `${hsvaToHex(color)}${formatHexPart(a)}`;
  }
  var CONVERTERS2 = {
    hex: hsvaToHex,
    hexa: (color) => hsvaToHexa(color),
    rgb: (color) => hsvaToRgba(color, false),
    rgba: (color) => hsvaToRgba(color, true),
    hsl: (color) => hsvaToHsl(color, false),
    hsla: (color) => hsvaToHsl(color, true)
  };
  function convertHsvaTo(format2, color) {
    if (!color) {
      return "#000000";
    }
    if (!(format2 in CONVERTERS2)) {
      return CONVERTERS2.hex(color);
    }
    return CONVERTERS2[format2](color);
  }
  var HueSlider = React10.forwardRef((props, ref) => {
    const { value, onChange, onChangeEnd, color, ...others } = useProps("HueSlider", {}, props);
    return  jsxRuntime.jsx(
      ColorSlider,
      {
        ...others,
        ref,
        value,
        onChange,
        onChangeEnd,
        maxValue: 360,
        thumbColor: `hsl(${value}, 100%, 50%)`,
        round: true,
        "data-hue": true,
        overlays: [
          {
            backgroundImage: "linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))"
          },
          {
            boxShadow: `rgba(0, 0, 0, .1) 0 0 0 ${rem(1)} inset, rgb(0, 0, 0, .15) 0 0 ${rem(
            4
          )} inset`
          }
        ]
      }
    );
  });
  HueSlider.displayName = "@mantine/core/HueSlider";
  function Saturation({
    className,
    onChange,
    onChangeEnd,
    value,
    saturationLabel,
    focusable = true,
    size: size4,
    color,
    onScrubStart,
    onScrubEnd,
    ...others
  }) {
    const { getStyles: getStyles2 } = useColorPickerContext();
    const [position, setPosition] = React10.useState({ x: value.s / 100, y: 1 - value.v / 100 });
    const positionRef = React10.useRef(position);
    const { ref } = hooks.useMove(
      ({ x, y }) => {
        positionRef.current = { x, y };
        onChange({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
      },
      {
        onScrubEnd: () => {
          const { x, y } = positionRef.current;
          onChangeEnd({ s: Math.round(x * 100), v: Math.round((1 - y) * 100) });
          onScrubEnd?.();
        },
        onScrubStart
      }
    );
    React10.useEffect(() => {
      setPosition({ x: value.s / 100, y: 1 - value.v / 100 });
    }, [value.s, value.v]);
    const handleArrow = (event, pos) => {
      event.preventDefault();
      const _position = hooks.clampUseMovePosition(pos);
      onChange({ s: Math.round(_position.x * 100), v: Math.round((1 - _position.y) * 100) });
      onChangeEnd({ s: Math.round(_position.x * 100), v: Math.round((1 - _position.y) * 100) });
    };
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp": {
          handleArrow(event, { y: position.y - 0.05, x: position.x });
          break;
        }
        case "ArrowDown": {
          handleArrow(event, { y: position.y + 0.05, x: position.x });
          break;
        }
        case "ArrowRight": {
          handleArrow(event, { x: position.x + 0.05, y: position.y });
          break;
        }
        case "ArrowLeft": {
          handleArrow(event, { x: position.x - 0.05, y: position.y });
          break;
        }
      }
    };
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("saturation"),
        ref,
        ...others,
        role: "slider",
        "aria-label": saturationLabel,
        "aria-valuenow": position.x,
        "aria-valuetext": convertHsvaTo("rgba", value),
        tabIndex: focusable ? 0 : -1,
        onKeyDown: handleKeyDown,
        children: [
           jsxRuntime.jsx(
            "div",
            {
              ...getStyles2("saturationOverlay", {
                style: { backgroundColor: `hsl(${value.h}, 100%, 50%)` }
              })
            }
          ),
           jsxRuntime.jsx(
            "div",
            {
              ...getStyles2("saturationOverlay", {
                style: { backgroundImage: "linear-gradient(90deg, #fff, transparent)" }
              })
            }
          ),
           jsxRuntime.jsx(
            "div",
            {
              ...getStyles2("saturationOverlay", {
                style: { backgroundImage: "linear-gradient(0deg, #000, transparent)" }
              })
            }
          ),
           jsxRuntime.jsx(Thumb2, { position, ...getStyles2("thumb", { style: { backgroundColor: color } }) })
        ]
      }
    );
  }
  Saturation.displayName = "@mantine/core/Saturation";
  var Swatches = React10.forwardRef(
    ({
      className,
      datatype,
      setValue,
      onChangeEnd,
      size: size4,
      focusable,
      data,
      swatchesPerRow,
      ...others
    }, ref) => {
      const ctx = useColorPickerContext();
      const colors = data.map((color, index3) =>  React10.createElement(
        ColorSwatch,
        {
          ...ctx.getStyles("swatch"),
          unstyled: ctx.unstyled,
          component: "button",
          type: "button",
          color,
          key: index3,
          radius: "sm",
          onClick: () => {
            setValue(color);
            onChangeEnd?.(color);
          },
          "aria-label": color,
          tabIndex: focusable ? 0 : -1,
          "data-swatch": true
        }
      ));
      return  jsxRuntime.jsx(Box, { ...ctx.getStyles("swatches"), ref, ...others, children: colors });
    }
  );
  Swatches.displayName = "@mantine/core/Swatches";
  var defaultProps81 = {
    swatchesPerRow: 7,
    withPicker: true,
    focusable: true,
    size: "md",
    __staticSelector: "ColorPicker"
  };
  var varsResolver43 = createVarsResolver((_, { size: size4, swatchesPerRow }) => ({
    wrapper: {
      "--cp-preview-size": getSize(size4, "cp-preview-size"),
      "--cp-width": getSize(size4, "cp-width"),
      "--cp-body-spacing": getSpacing(size4),
      "--cp-swatch-size": `${100 / swatchesPerRow}%`,
      "--cp-thumb-size": getSize(size4, "cp-thumb-size"),
      "--cp-saturation-height": getSize(size4, "cp-saturation-height")
    }
  }));
  var ColorPicker = factory((_props, ref) => {
    const props = useProps("ColorPicker", defaultProps81, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      format: format2,
      value,
      defaultValue,
      onChange,
      onChangeEnd,
      withPicker,
      size: size4,
      saturationLabel,
      hueLabel,
      alphaLabel,
      focusable,
      swatches,
      swatchesPerRow,
      fullWidth,
      onColorSwatchClick,
      __staticSelector,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: __staticSelector,
      props,
      classes: classes40,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "wrapper",
      vars,
      varsResolver: varsResolver43
    });
    const formatRef = React10.useRef(format2);
    const valueRef = React10.useRef("");
    const scrubTimeoutRef = React10.useRef(-1);
    const isScrubbingRef = React10.useRef(false);
    const withAlpha = format2 === "hexa" || format2 === "rgba" || format2 === "hsla";
    const [_value, setValue, controlled] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "#FFFFFF",
      onChange
    });
    const [parsed, setParsed] = React10.useState(parseColor(_value));
    const startScrubbing = () => {
      window.clearTimeout(scrubTimeoutRef.current);
      isScrubbingRef.current = true;
    };
    const stopScrubbing = () => {
      window.clearTimeout(scrubTimeoutRef.current);
      scrubTimeoutRef.current = window.setTimeout(() => {
        isScrubbingRef.current = false;
      }, 200);
    };
    const handleChange = (color) => {
      setParsed((current) => {
        const next = { ...current, ...color };
        valueRef.current = convertHsvaTo(formatRef.current, next);
        return next;
      });
      setValue(valueRef.current);
    };
    hooks.useDidUpdate(() => {
      if (isColorValid(value) && !isScrubbingRef.current) {
        setParsed(parseColor(value));
      }
    }, [value]);
    hooks.useDidUpdate(() => {
      formatRef.current = format2;
      setValue(convertHsvaTo(format2, parsed));
    }, [format2]);
    return  jsxRuntime.jsx(ColorPickerProvider, { value: { getStyles: getStyles2, unstyled }, children:  jsxRuntime.jsxs(
      Box,
      {
        ref,
        ...getStyles2("wrapper"),
        size: size4,
        mod: [{ "full-width": fullWidth }, mod],
        ...others,
        children: [
          withPicker &&  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
             jsxRuntime.jsx(
              Saturation,
              {
                value: parsed,
                onChange: handleChange,
                onChangeEnd: ({ s, v }) => onChangeEnd?.(convertHsvaTo(formatRef.current, { ...parsed, s, v })),
                color: _value,
                size: size4,
                focusable,
                saturationLabel,
                onScrubStart: startScrubbing,
                onScrubEnd: stopScrubbing
              }
            ),
             jsxRuntime.jsxs("div", { ...getStyles2("body"), children: [
               jsxRuntime.jsxs("div", { ...getStyles2("sliders"), children: [
                 jsxRuntime.jsx(
                  HueSlider,
                  {
                    value: parsed.h,
                    onChange: (h) => handleChange({ h }),
                    onChangeEnd: (h) => onChangeEnd?.(convertHsvaTo(formatRef.current, { ...parsed, h })),
                    size: size4,
                    focusable,
                    "aria-label": hueLabel,
                    onScrubStart: startScrubbing,
                    onScrubEnd: stopScrubbing
                  }
                ),
                withAlpha &&  jsxRuntime.jsx(
                  AlphaSlider,
                  {
                    value: parsed.a,
                    onChange: (a) => handleChange({ a }),
                    onChangeEnd: (a) => {
                      onChangeEnd?.(convertHsvaTo(formatRef.current, { ...parsed, a }));
                    },
                    size: size4,
                    color: convertHsvaTo("hex", parsed),
                    focusable,
                    "aria-label": alphaLabel,
                    onScrubStart: startScrubbing,
                    onScrubEnd: stopScrubbing
                  }
                )
              ] }),
              withAlpha &&  jsxRuntime.jsx(
                ColorSwatch,
                {
                  color: _value,
                  radius: "sm",
                  size: "var(--cp-preview-size)",
                  ...getStyles2("preview")
                }
              )
            ] })
          ] }),
          Array.isArray(swatches) &&  jsxRuntime.jsx(
            Swatches,
            {
              data: swatches,
              swatchesPerRow,
              focusable,
              setValue,
              onChangeEnd: (color) => {
                const convertedColor = convertHsvaTo(format2, parseColor(color));
                onColorSwatchClick?.(convertedColor);
                onChangeEnd?.(convertedColor);
                if (!controlled) {
                  setParsed(parseColor(color));
                }
              }
            }
          )
        ]
      }
    ) });
  });
  ColorPicker.classes = classes40;
  ColorPicker.displayName = "@mantine/core/ColorPicker";
  function EyeDropperIcon({ style, ...others }) {
    return  jsxRuntime.jsxs(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        style: {
          width: "var(--ci-eye-dropper-icon-size)",
          height: "var(--ci-eye-dropper-icon-size)",
          ...style
        },
        viewBox: "0 0 24 24",
        strokeWidth: "1.5",
        stroke: "currentColor",
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...others,
        children: [
           jsxRuntime.jsx("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
           jsxRuntime.jsx("path", { d: "M11 7l6 6" }),
           jsxRuntime.jsx("path", { d: "M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z" })
        ]
      }
    );
  }
  var classes41 = { "eyeDropperIcon": "m_b077c2bc", "colorPreview": "m_c5ccdcab", "dropdown": "m_5ece2cd7" };
  var defaultProps82 = {
    format: "hex",
    fixOnBlur: true,
    withPreview: true,
    swatchesPerRow: 7,
    withPicker: true,
    popoverProps: { transitionProps: { transition: "fade", duration: 0 } },
    withEyeDropper: true
  };
  var varsResolver44 = createVarsResolver((_, { size: size4 }) => ({
    eyeDropperIcon: {
      "--ci-eye-dropper-icon-size": getSize(size4, "ci-eye-dropper-icon-size")
    },
    colorPreview: {
      "--ci-preview-size": getSize(size4, "ci-preview-size")
    }
  }));
  var ColorInput = factory((_props, ref) => {
    const props = useProps("ColorInput", defaultProps82, _props);
    const {
      classNames,
      styles,
      unstyled,
      disallowInput,
      fixOnBlur,
      popoverProps,
      withPreview,
      withEyeDropper,
      eyeDropperIcon,
      closeOnColorSwatchClick,
      eyeDropperButtonProps,
      value,
      defaultValue,
      onChange,
      onChangeEnd,
      onClick,
      onFocus,
      onBlur,
      inputProps,
      format: format2,
      wrapperProps,
      readOnly,
      withPicker,
      swatches,
      disabled,
      leftSection,
      rightSection,
      swatchesPerRow,
      ...others
    } = useInputProps("ColorInput", defaultProps82, _props);
    const getStyles2 = useStyles({
      name: "ColorInput",
      props,
      classes: classes41,
      classNames,
      styles,
      unstyled,
      rootSelector: "wrapper",
      vars: props.vars,
      varsResolver: varsResolver44
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const [dropdownOpened, setDropdownOpened] = React10.useState(false);
    const [lastValidValue, setLastValidValue] = React10.useState("");
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "",
      onChange
    });
    const { supported: eyeDropperSupported, open: openEyeDropper } = hooks.useEyeDropper();
    const eyeDropper =  jsxRuntime.jsx(
      ActionIcon,
      {
        ...eyeDropperButtonProps,
        ...getStyles2("eyeDropperButton", {
          className: eyeDropperButtonProps?.className,
          style: eyeDropperButtonProps?.style
        }),
        variant: "subtle",
        color: "gray",
        size: inputProps.size,
        unstyled,
        onClick: () => openEyeDropper().then((payload) => {
          if (payload?.sRGBHex) {
            const color = convertHsvaTo(format2, parseColor(payload.sRGBHex));
            setValue(color);
            onChangeEnd?.(color);
          }
        }).catch(() => {
        }),
        children: eyeDropperIcon ||  jsxRuntime.jsx(EyeDropperIcon, { ...getStyles2("eyeDropperIcon") })
      }
    );
    const handleInputFocus = (event) => {
      onFocus?.(event);
      setDropdownOpened(true);
    };
    const handleInputBlur = (event) => {
      fixOnBlur && setValue(lastValidValue);
      onBlur?.(event);
      setDropdownOpened(false);
    };
    const handleInputClick = (event) => {
      onClick?.(event);
      setDropdownOpened(true);
    };
    React10.useEffect(() => {
      if (isColorValid(_value) || _value.trim() === "") {
        setLastValidValue(_value);
      }
    }, [_value]);
    hooks.useDidUpdate(() => {
      if (isColorValid(_value)) {
        setValue(convertHsvaTo(format2, parseColor(_value)));
      }
    }, [format2]);
    return  jsxRuntime.jsx(
      Input.Wrapper,
      {
        ...wrapperProps,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        __staticSelector: "ColorInput",
        children:  jsxRuntime.jsxs(
          Popover,
          {
            __staticSelector: "ColorInput",
            position: "bottom-start",
            offset: 5,
            opened: dropdownOpened,
            ...popoverProps,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            withRoles: false,
            disabled: readOnly || withPicker === false && (!Array.isArray(swatches) || swatches.length === 0),
            children: [
               jsxRuntime.jsx(Popover.Target, { children:  jsxRuntime.jsx(
                Input,
                {
                  autoComplete: "off",
                  ...others,
                  ...inputProps,
                  classNames: resolvedClassNames,
                  styles: resolvedStyles,
                  disabled,
                  ref,
                  __staticSelector: "ColorInput",
                  onFocus: handleInputFocus,
                  onBlur: handleInputBlur,
                  onClick: handleInputClick,
                  spellCheck: false,
                  value: _value,
                  onChange: (event) => {
                    const inputValue = event.currentTarget.value;
                    setValue(inputValue);
                    if (isColorValid(inputValue)) {
                      onChangeEnd?.(convertHsvaTo(format2, parseColor(inputValue)));
                    }
                  },
                  leftSection: leftSection || (withPreview ?  jsxRuntime.jsx(
                    ColorSwatch,
                    {
                      color: isColorValid(_value) ? _value : "#fff",
                      size: "var(--ci-preview-size)",
                      ...getStyles2("colorPreview")
                    }
                  ) : null),
                  readOnly: disallowInput || readOnly,
                  pointer: disallowInput,
                  unstyled,
                  rightSection: rightSection || (withEyeDropper && !disabled && !readOnly && eyeDropperSupported ? eyeDropper : null)
                }
              ) }),
               jsxRuntime.jsx(
                Popover.Dropdown,
                {
                  onMouseDown: (event) => event.preventDefault(),
                  className: classes41.dropdown,
                  children:  jsxRuntime.jsx(
                    ColorPicker,
                    {
                      __staticSelector: "ColorInput",
                      value: _value,
                      onChange: setValue,
                      onChangeEnd,
                      format: format2,
                      swatches,
                      swatchesPerRow,
                      withPicker,
                      size: inputProps.size,
                      focusable: false,
                      unstyled,
                      styles: resolvedStyles,
                      classNames: resolvedClassNames,
                      onColorSwatchClick: () => closeOnColorSwatchClick && setDropdownOpened(false)
                    }
                  )
                }
              )
            ]
          }
        )
      }
    );
  });
  ColorInput.classes = InputBase.classes;
  ColorInput.displayName = "@mantine/core/ColorInput";
  function getPreviousIndex3({
    currentIndex,
    isOptionDisabled,
    totalOptionsCount,
    loop
  }) {
    for (let i = currentIndex - 1; i >= 0; i -= 1) {
      if (!isOptionDisabled(i)) {
        return i;
      }
    }
    if (loop) {
      for (let i = totalOptionsCount - 1; i > -1; i -= 1) {
        if (!isOptionDisabled(i)) {
          return i;
        }
      }
    }
    return currentIndex;
  }
  function getNextIndex3({
    currentIndex,
    isOptionDisabled,
    totalOptionsCount,
    loop
  }) {
    for (let i = currentIndex + 1; i < totalOptionsCount; i += 1) {
      if (!isOptionDisabled(i)) {
        return i;
      }
    }
    if (loop) {
      for (let i = 0; i < totalOptionsCount; i += 1) {
        if (!isOptionDisabled(i)) {
          return i;
        }
      }
    }
    return currentIndex;
  }
  function getFirstIndex2({ totalOptionsCount, isOptionDisabled }) {
    for (let i = 0; i < totalOptionsCount; i += 1) {
      if (!isOptionDisabled(i)) {
        return i;
      }
    }
    return -1;
  }
  function useVirtualizedCombobox({
    defaultOpened,
    opened,
    onOpenedChange,
    onDropdownClose,
    onDropdownOpen,
    loop = true,
    totalOptionsCount,
    isOptionDisabled = () => false,
    getOptionId,
    selectedOptionIndex,
    setSelectedOptionIndex,
    activeOptionIndex,
    onSelectedOptionSubmit
  } = {
    totalOptionsCount: 0,
    getOptionId: () => null,
    selectedOptionIndex: 1,
    setSelectedOptionIndex: () => {
    },
    onSelectedOptionSubmit: () => {
    }
  }) {
    const [dropdownOpened, setDropdownOpened] = hooks.useUncontrolled({
      value: opened,
      defaultValue: defaultOpened,
      finalValue: false,
      onChange: onOpenedChange
    });
    const listId = React10.useRef(null);
    const searchRef = React10.useRef(null);
    const targetRef = React10.useRef(null);
    const focusSearchTimeout = React10.useRef(-1);
    const focusTargetTimeout = React10.useRef(-1);
    const openDropdown = () => {
      if (!dropdownOpened) {
        setDropdownOpened(true);
        onDropdownOpen?.();
      }
    };
    const closeDropdown = () => {
      if (dropdownOpened) {
        setDropdownOpened(false);
        onDropdownClose?.();
      }
    };
    const toggleDropdown = () => {
      if (dropdownOpened) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };
    const selectOption = (index3) => {
      const nextIndex = index3 >= totalOptionsCount ? 0 : index3 < 0 ? totalOptionsCount - 1 : index3;
      setSelectedOptionIndex(nextIndex);
      return getOptionId(nextIndex);
    };
    const selectActiveOption = () => selectOption(activeOptionIndex ?? 0);
    const selectNextOption = () => selectOption(
      getNextIndex3({ currentIndex: selectedOptionIndex, isOptionDisabled, totalOptionsCount, loop })
    );
    const selectPreviousOption = () => selectOption(
      getPreviousIndex3({
        currentIndex: selectedOptionIndex,
        isOptionDisabled,
        totalOptionsCount,
        loop
      })
    );
    const selectFirstOption = () => selectOption(getFirstIndex2({ isOptionDisabled, totalOptionsCount }));
    const resetSelectedOption = () => {
      setSelectedOptionIndex(-1);
    };
    const clickSelectedOption = () => {
      onSelectedOptionSubmit?.(selectedOptionIndex);
    };
    const setListId = (id) => {
      listId.current = id;
    };
    const focusSearchInput = () => {
      focusSearchTimeout.current = window.setTimeout(() => searchRef.current.focus(), 0);
    };
    const focusTarget = () => {
      focusTargetTimeout.current = window.setTimeout(() => targetRef.current.focus(), 0);
    };
    React10.useEffect(
      () => () => {
        window.clearTimeout(focusSearchTimeout.current);
        window.clearTimeout(focusTargetTimeout.current);
      },
      []
    );
    const getSelectedOptionIndex = React10.useCallback(() => selectedOptionIndex, []);
    return {
      dropdownOpened,
      openDropdown,
      closeDropdown,
      toggleDropdown,
      selectedOptionIndex,
      getSelectedOptionIndex,
      selectOption,
      selectFirstOption,
      selectActiveOption,
      selectNextOption,
      selectPreviousOption,
      resetSelectedOption,
      updateSelectedOptionIndex: () => {
      },
      listId: listId.current,
      setListId,
      clickSelectedOption,
      searchRef,
      focusSearchInput,
      targetRef,
      focusTarget
    };
  }
  var classes42 = { "root": "m_7485cace" };
  var defaultProps83 = {};
  var varsResolver45 = createVarsResolver((_, { size: size4, fluid }) => ({
    root: {
      "--container-size": fluid ? void 0 : getSize(size4, "container-size")
    }
  }));
  var Container = factory((_props, ref) => {
    const props = useProps("Container", defaultProps83, _props);
    const { classNames, className, style, styles, unstyled, vars, fluid, mod, ...others } = props;
    const getStyles2 = useStyles({
      name: "Container",
      classes: classes42,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver45
    });
    return  jsxRuntime.jsx(Box, { ref, mod: [{ fluid }, mod], ...getStyles2("root"), ...others });
  });
  Container.classes = classes42;
  Container.displayName = "@mantine/core/Container";
  var defaultProps84 = {
    timeout: 1e3
  };
  function CopyButton(props) {
    const { children, timeout, value, ...others } = useProps("CopyButton", defaultProps84, props);
    const clipboard = hooks.useClipboard({ timeout });
    const copy = () => clipboard.copy(value);
    return  jsxRuntime.jsx(jsxRuntime.Fragment, { children: children({ copy, copied: clipboard.copied, ...others }) });
  }
  CopyButton.displayName = "@mantine/core/CopyButton";
  var classes43 = { "root": "m_e2125a27", "closeButton": "m_5abab665" };
  var defaultProps85 = {
    shadow: "md",
    p: "md",
    withBorder: false,
    transitionProps: { transition: "pop-top-right", duration: 200 },
    position: {
      bottom: 30,
      right: 30
    }
  };
  var varsResolver46 = createVarsResolver((_, { size: size4 }) => ({
    root: {
      "--dialog-size": getSize(size4, "dialog-size")
    }
  }));
  var Dialog = factory((_props, ref) => {
    const props = useProps("Dialog", defaultProps85, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      zIndex,
      position,
      keepMounted,
      opened,
      transitionProps,
      withCloseButton,
      withinPortal,
      children,
      onClose,
      portalProps,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Dialog",
      classes: classes43,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver46
    });
    return  jsxRuntime.jsx(
      Affix,
      {
        zIndex,
        position,
        ref,
        withinPortal,
        portalProps,
        unstyled,
        children:  jsxRuntime.jsx(Transition, { keepMounted, mounted: opened, ...transitionProps, children: (transitionStyles) =>  jsxRuntime.jsxs(
          Paper,
          {
            unstyled,
            ...getStyles2("root", { style: transitionStyles }),
            ...others,
            children: [
              withCloseButton &&  jsxRuntime.jsx(CloseButton, { onClick: onClose, unstyled, ...getStyles2("closeButton") }),
              children
            ]
          }
        ) })
      }
    );
  });
  Dialog.classes = classes43;
  Dialog.displayName = "@mantine/core/Dialog";
  var classes44 = { "root": "m_3eebeb36", "label": "m_9e365f20" };
  var defaultProps86 = {
    orientation: "horizontal"
  };
  var varsResolver47 = createVarsResolver((theme, { color, variant, size: size4 }) => ({
    root: {
      "--divider-color": color ? getThemeColor(color, theme) : void 0,
      "--divider-border-style": variant,
      "--divider-size": getSize(size4, "divider-size")
    }
  }));
  var Divider = factory((_props, ref) => {
    const props = useProps("Divider", defaultProps86, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      color,
      orientation,
      label,
      labelPosition,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Divider",
      classes: classes44,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver47
    });
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        mod: [{ orientation, "with-label": !!label }, mod],
        ...getStyles2("root"),
        ...others,
        role: "separator",
        children: label &&  jsxRuntime.jsx(Box, { component: "span", mod: { position: labelPosition }, ...getStyles2("label"), children: label })
      }
    );
  });
  Divider.classes = classes44;
  Divider.displayName = "@mantine/core/Divider";
  var [DrawerProvider, useDrawerContext] = createSafeContext(
    "Drawer component was not found in tree"
  );
  var classes45 = { "root": "m_f11b401e", "header": "m_5a7c2c9", "content": "m_b8a05bbd", "inner": "m_31cd769a" };
  var defaultProps87 = {};
  var DrawerBody = factory((_props, ref) => {
    const props = useProps("DrawerBody", defaultProps87, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useDrawerContext();
    return  jsxRuntime.jsx(
      ModalBaseBody,
      {
        ref,
        ...ctx.getStyles("body", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  DrawerBody.classes = classes45;
  DrawerBody.displayName = "@mantine/core/DrawerBody";
  var defaultProps88 = {};
  var DrawerCloseButton = factory((_props, ref) => {
    const props = useProps("DrawerCloseButton", defaultProps88, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useDrawerContext();
    return  jsxRuntime.jsx(
      ModalBaseCloseButton,
      {
        ref,
        ...ctx.getStyles("close", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  DrawerCloseButton.classes = classes45;
  DrawerCloseButton.displayName = "@mantine/core/DrawerCloseButton";
  var defaultProps89 = {};
  var DrawerContent = factory((_props, ref) => {
    const props = useProps("DrawerContent", defaultProps89, _props);
    const { classNames, className, style, styles, vars, children, radius, __hidden, ...others } = props;
    const ctx = useDrawerContext();
    const Scroll = ctx.scrollAreaComponent || NativeScrollArea;
    return  jsxRuntime.jsx(
      ModalBaseContent,
      {
        ...ctx.getStyles("content", { className, style, styles, classNames }),
        innerProps: ctx.getStyles("inner", { className, style, styles, classNames }),
        ref,
        ...others,
        radius: radius || ctx.radius || 0,
        "data-hidden": __hidden || void 0,
        children:  jsxRuntime.jsx(Scroll, { style: { height: "calc(100vh - var(--drawer-offset) * 2)" }, children })
      }
    );
  });
  DrawerContent.classes = classes45;
  DrawerContent.displayName = "@mantine/core/DrawerContent";
  var defaultProps90 = {};
  var DrawerHeader = factory((_props, ref) => {
    const props = useProps("DrawerHeader", defaultProps90, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useDrawerContext();
    return  jsxRuntime.jsx(
      ModalBaseHeader,
      {
        ref,
        ...ctx.getStyles("header", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  DrawerHeader.classes = classes45;
  DrawerHeader.displayName = "@mantine/core/DrawerHeader";
  var defaultProps91 = {};
  var DrawerOverlay = factory((_props, ref) => {
    const props = useProps("DrawerOverlay", defaultProps91, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useDrawerContext();
    return  jsxRuntime.jsx(
      ModalBaseOverlay,
      {
        ref,
        ...ctx.getStyles("overlay", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  DrawerOverlay.classes = classes45;
  DrawerOverlay.displayName = "@mantine/core/DrawerOverlay";
  function getDrawerAlign(position) {
    switch (position) {
      case "top":
        return "flex-start";
      case "bottom":
        return "flex-end";
      default:
        return void 0;
    }
  }
  function getDrawerFlex(position) {
    if (position === "top" || position === "bottom") {
      return "0 0 calc(100% - var(--drawer-offset, 0rem) * 2)";
    }
    return void 0;
  }
  var transitions2 = {
    top: "slide-down",
    bottom: "slide-up",
    left: "slide-right",
    right: "slide-left"
  };
  var rtlTransitions = {
    top: "slide-down",
    bottom: "slide-up",
    right: "slide-right",
    left: "slide-left"
  };
  var defaultProps92 = {
    closeOnClickOutside: true,
    withinPortal: true,
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    closeOnEscape: true,
    keepMounted: false,
    zIndex: getDefaultZIndex("modal"),
    position: "left"
  };
  var varsResolver48 = createVarsResolver((_, { position, size: size4, offset: offset4 }) => ({
    root: {
      "--drawer-size": getSize(size4, "drawer-size"),
      "--drawer-flex": getDrawerFlex(position),
      "--drawer-height": position === "left" || position === "right" ? void 0 : "var(--drawer-size)",
      "--drawer-align": getDrawerAlign(position),
      "--drawer-justify": position === "right" ? "flex-end" : void 0,
      "--drawer-offset": rem(offset4)
    }
  }));
  var DrawerRoot = factory((_props, ref) => {
    const props = useProps("DrawerRoot", defaultProps92, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      scrollAreaComponent,
      position,
      transitionProps,
      radius,
      ...others
    } = props;
    const { dir } = useDirection();
    const getStyles2 = useStyles({
      name: "Drawer",
      classes: classes45,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver48
    });
    const drawerTransition = (dir === "rtl" ? rtlTransitions : transitions2)[position];
    return  jsxRuntime.jsx(DrawerProvider, { value: { scrollAreaComponent, getStyles: getStyles2, radius }, children:  jsxRuntime.jsx(
      ModalBase,
      {
        ref,
        ...getStyles2("root"),
        transitionProps: { transition: drawerTransition, ...transitionProps },
        unstyled,
        ...others
      }
    ) });
  });
  DrawerRoot.classes = classes45;
  DrawerRoot.displayName = "@mantine/core/DrawerRoot";
  var [DrawerStackProvider, useDrawerStackContext] = createOptionalContext();
  function DrawerStack({ children }) {
    const [stack, setStack] = React10.useState([]);
    const [maxZIndex, setMaxZIndex] = React10.useState(getDefaultZIndex("modal"));
    return  jsxRuntime.jsx(
      DrawerStackProvider,
      {
        value: {
          stack,
          addModal: (id, zIndex) => {
            setStack((current) => [... new Set([...current, id])]);
            setMaxZIndex(
              (current) => typeof zIndex === "number" && typeof current === "number" ? Math.max(current, zIndex) : current
            );
          },
          removeModal: (id) => setStack((current) => current.filter((currentId) => currentId !== id)),
          getZIndex: (id) => `calc(${maxZIndex} + ${stack.indexOf(id)} + 1)`,
          currentId: stack[stack.length - 1],
          maxZIndex
        },
        children
      }
    );
  }
  DrawerStack.displayName = "@mantine/core/DrawerStack";
  var defaultProps93 = {};
  var DrawerTitle = factory((_props, ref) => {
    const props = useProps("DrawerTitle", defaultProps93, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useDrawerContext();
    return  jsxRuntime.jsx(
      ModalBaseTitle,
      {
        ref,
        ...ctx.getStyles("title", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  DrawerTitle.classes = classes45;
  DrawerTitle.displayName = "@mantine/core/DrawerTitle";
  var defaultProps94 = {
    closeOnClickOutside: true,
    withinPortal: true,
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    closeOnEscape: true,
    keepMounted: false,
    zIndex: getDefaultZIndex("modal"),
    withOverlay: true,
    withCloseButton: true
  };
  var Drawer = factory((_props, ref) => {
    const {
      title,
      withOverlay,
      overlayProps,
      withCloseButton,
      closeButtonProps,
      children,
      opened,
      stackId,
      zIndex,
      ...others
    } = useProps("Drawer", defaultProps94, _props);
    const ctx = useDrawerStackContext();
    const hasHeader = !!title || withCloseButton;
    const stackProps = ctx && stackId ? {
      closeOnEscape: ctx.currentId === stackId,
      trapFocus: ctx.currentId === stackId,
      zIndex: ctx.getZIndex(stackId)
    } : {};
    const overlayVisible = withOverlay === false ? false : stackId && ctx ? ctx.currentId === stackId : opened;
    React10.useEffect(() => {
      if (ctx && stackId) {
        opened ? ctx.addModal(stackId, zIndex || getDefaultZIndex("modal")) : ctx.removeModal(stackId);
      }
    }, [opened, stackId, zIndex]);
    return  jsxRuntime.jsxs(
      DrawerRoot,
      {
        ref,
        opened,
        zIndex: ctx && stackId ? ctx.getZIndex(stackId) : zIndex,
        ...others,
        ...stackProps,
        children: [
          withOverlay &&  jsxRuntime.jsx(
            DrawerOverlay,
            {
              visible: overlayVisible,
              transitionProps: ctx && stackId ? { duration: 0 } : void 0,
              ...overlayProps
            }
          ),
           jsxRuntime.jsxs(DrawerContent, { __hidden: ctx && stackId && opened ? stackId !== ctx.currentId : false, children: [
            hasHeader &&  jsxRuntime.jsxs(DrawerHeader, { children: [
              title &&  jsxRuntime.jsx(DrawerTitle, { children: title }),
              withCloseButton &&  jsxRuntime.jsx(DrawerCloseButton, { ...closeButtonProps })
            ] }),
             jsxRuntime.jsx(DrawerBody, { children })
          ] })
        ]
      }
    );
  });
  Drawer.classes = classes45;
  Drawer.displayName = "@mantine/core/Drawer";
  Drawer.Root = DrawerRoot;
  Drawer.Overlay = DrawerOverlay;
  Drawer.Content = DrawerContent;
  Drawer.Body = DrawerBody;
  Drawer.Header = DrawerHeader;
  Drawer.Title = DrawerTitle;
  Drawer.CloseButton = DrawerCloseButton;
  Drawer.Stack = DrawerStack;
  var classes46 = { "root": "m_e9408a47", "root--default": "m_84c9523a", "root--filled": "m_ef274e49", "root--unstyled": "m_eda993d3", "legend": "m_90794832", "legend--unstyled": "m_74ca27fe" };
  var defaultProps95 = {
    variant: "default"
  };
  var varsResolver49 = createVarsResolver((_, { radius }) => ({
    root: {
      "--fieldset-radius": radius === void 0 ? void 0 : getRadius(radius)
    }
  }));
  var Fieldset = factory((_props, ref) => {
    const props = useProps("Fieldset", defaultProps95, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      legend,
      variant,
      children,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Fieldset",
      classes: classes46,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver49
    });
    return  jsxRuntime.jsxs(
      Box,
      {
        component: "fieldset",
        ref,
        variant,
        ...getStyles2("root", { variant }),
        ...others,
        children: [
          legend &&  jsxRuntime.jsx("legend", { ...getStyles2("legend", { variant }), children: legend }),
          children
        ]
      }
    );
  });
  Fieldset.classes = classes46;
  Fieldset.displayName = "@mantine/core/Fieldset";
  var defaultProps96 = {
    multiple: false
  };
  var FileButton = React10.forwardRef(
    (props, ref) => {
      const {
        onChange,
        children,
        multiple,
        accept,
        name,
        form,
        resetRef,
        disabled,
        capture,
        inputProps,
        ...others
      } = useProps("FileButton", defaultProps96, props);
      const inputRef = React10.useRef(null);
      const onClick = () => {
        !disabled && inputRef.current?.click();
      };
      const handleChange = (event) => {
        if (multiple) {
          onChange(Array.from(event.currentTarget.files));
        } else {
          onChange(event.currentTarget.files[0] || null);
        }
      };
      const reset = () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      };
      hooks.assignRef(resetRef, reset);
      return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        children({ onClick, ...others }),
         jsxRuntime.jsx(
          "input",
          {
            style: { display: "none" },
            type: "file",
            accept,
            multiple,
            onChange: handleChange,
            ref: hooks.useMergedRef(ref, inputRef),
            name,
            form,
            capture,
            ...inputProps
          }
        )
      ] });
    }
  );
  FileButton.displayName = "@mantine/core/FileButton";
  var DefaultValue = ({ value }) =>  jsxRuntime.jsx("div", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: Array.isArray(value) ? value.map((file) => file.name).join(", ") : value?.name });
  var defaultProps97 = {
    valueComponent: DefaultValue
  };
  var _FileInput = factory((_props, ref) => {
    const props = useProps("FileInput", defaultProps97, _props);
    const {
      unstyled,
      vars,
      onChange,
      value,
      defaultValue,
      multiple,
      accept,
      name,
      form,
      valueComponent,
      clearable,
      clearButtonProps,
      readOnly,
      capture,
      fileInputProps,
      rightSection,
      size: size4,
      placeholder,
      component,
      resetRef: resetRefProp,
      classNames,
      styles,
      ...others
    } = props;
    const resetRef = React10.useRef(null);
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      onChange,
      finalValue: multiple ? [] : null
    });
    const hasValue = Array.isArray(_value) ? _value.length !== 0 : _value !== null;
    const _rightSection = rightSection || (clearable && hasValue && !readOnly ?  jsxRuntime.jsx(
      CloseButton,
      {
        ...clearButtonProps,
        variant: "subtle",
        onClick: () => setValue(multiple ? [] : null),
        size: size4,
        unstyled
      }
    ) : null);
    React10.useEffect(() => {
      if (Array.isArray(_value) && _value.length === 0 || _value === null) {
        resetRef.current?.();
      }
    }, [_value]);
    const ValueComponent = valueComponent;
    return  jsxRuntime.jsx(
      FileButton,
      {
        onChange: setValue,
        multiple,
        accept,
        name,
        form,
        resetRef: hooks.useMergedRef(resetRef, resetRefProp),
        disabled: readOnly,
        capture,
        inputProps: fileInputProps,
        children: (fileButtonProps) =>  jsxRuntime.jsx(
          InputBase,
          {
            component: component || "button",
            ref,
            rightSection: _rightSection,
            ...fileButtonProps,
            ...others,
            __staticSelector: "FileInput",
            multiline: true,
            type: "button",
            pointer: true,
            __stylesApiProps: props,
            unstyled,
            size: size4,
            classNames,
            styles,
            children: !hasValue ?  jsxRuntime.jsx(
              Input.Placeholder,
              {
                __staticSelector: "FileInput",
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                children: placeholder
              }
            ) :  jsxRuntime.jsx(ValueComponent, { value: _value })
          }
        )
      }
    );
  });
  _FileInput.classes = InputBase.classes;
  _FileInput.displayName = "@mantine/core/FileInput";
  var FileInput = _FileInput;
  function useDelayedHover({ open, close, openDelay, closeDelay }) {
    const openTimeout = React10.useRef(-1);
    const closeTimeout = React10.useRef(-1);
    const clearTimeouts = () => {
      window.clearTimeout(openTimeout.current);
      window.clearTimeout(closeTimeout.current);
    };
    const openDropdown = () => {
      clearTimeouts();
      if (openDelay === 0 || openDelay === void 0) {
        open();
      } else {
        openTimeout.current = window.setTimeout(open, openDelay);
      }
    };
    const closeDropdown = () => {
      clearTimeouts();
      if (closeDelay === 0 || closeDelay === void 0) {
        close();
      } else {
        closeTimeout.current = window.setTimeout(close, closeDelay);
      }
    };
    React10.useEffect(() => clearTimeouts, []);
    return { openDropdown, closeDropdown };
  }
  var [GridProvider, useGridContext] = createSafeContext(
    "Grid component was not found in tree"
  );
  var getColumnFlexBasis = (colSpan, columns) => {
    if (colSpan === "content") {
      return "auto";
    }
    if (colSpan === "auto") {
      return "0rem";
    }
    return colSpan ? `${100 / (columns / colSpan)}%` : void 0;
  };
  var getColumnMaxWidth = (colSpan, columns, grow) => {
    if (grow || colSpan === "auto") {
      return "100%";
    }
    if (colSpan === "content") {
      return "unset";
    }
    return getColumnFlexBasis(colSpan, columns);
  };
  var getColumnFlexGrow = (colSpan, grow) => {
    if (!colSpan) {
      return void 0;
    }
    return colSpan === "auto" || grow ? "1" : "auto";
  };
  var getColumnOffset = (offset4, columns) => offset4 === 0 ? "0" : offset4 ? `${100 / (columns / offset4)}%` : void 0;
  function GridColVariables({ span, order, offset: offset4, selector }) {
    const theme = useMantineTheme();
    const ctx = useGridContext();
    const _breakpoints = ctx.breakpoints || theme.breakpoints;
    const baseValue = getBaseValue(span);
    const baseSpan = baseValue === void 0 ? 12 : getBaseValue(span);
    const baseStyles = filterProps({
      "--col-order": getBaseValue(order)?.toString(),
      "--col-flex-grow": getColumnFlexGrow(baseSpan, ctx.grow),
      "--col-flex-basis": getColumnFlexBasis(baseSpan, ctx.columns),
      "--col-width": baseSpan === "content" ? "auto" : void 0,
      "--col-max-width": getColumnMaxWidth(baseSpan, ctx.columns, ctx.grow),
      "--col-offset": getColumnOffset(getBaseValue(offset4), ctx.columns)
    });
    const queries = keys(_breakpoints).reduce(
      (acc, breakpoint) => {
        if (!acc[breakpoint]) {
          acc[breakpoint] = {};
        }
        if (typeof order === "object" && order[breakpoint] !== void 0) {
          acc[breakpoint]["--col-order"] = order[breakpoint]?.toString();
        }
        if (typeof span === "object" && span[breakpoint] !== void 0) {
          acc[breakpoint]["--col-flex-grow"] = getColumnFlexGrow(span[breakpoint], ctx.grow);
          acc[breakpoint]["--col-flex-basis"] = getColumnFlexBasis(span[breakpoint], ctx.columns);
          acc[breakpoint]["--col-width"] = span[breakpoint] === "content" ? "auto" : void 0;
          acc[breakpoint]["--col-max-width"] = getColumnMaxWidth(
            span[breakpoint],
            ctx.columns,
            ctx.grow
          );
        }
        if (typeof offset4 === "object" && offset4[breakpoint] !== void 0) {
          acc[breakpoint]["--col-offset"] = getColumnOffset(offset4[breakpoint], ctx.columns);
        }
        return acc;
      },
      {}
    );
    const sortedBreakpoints = getSortedBreakpoints(keys(queries), _breakpoints).filter(
      (breakpoint) => keys(queries[breakpoint.value]).length > 0
    );
    const values2 = sortedBreakpoints.map((breakpoint) => ({
      query: ctx.type === "container" ? `mantine-grid (min-width: ${_breakpoints[breakpoint.value]})` : `(min-width: ${_breakpoints[breakpoint.value]})`,
      styles: queries[breakpoint.value]
    }));
    return  jsxRuntime.jsx(
      InlineStyles,
      {
        styles: baseStyles,
        media: ctx.type === "container" ? void 0 : values2,
        container: ctx.type === "container" ? values2 : void 0,
        selector
      }
    );
  }
  var classes47 = { "container": "m_8478a6da", "root": "m_410352e9", "inner": "m_dee7bd2f", "col": "m_96bdd299" };
  var defaultProps98 = {
    span: 12
  };
  var GridCol = factory((_props, ref) => {
    const props = useProps("GridCol", defaultProps98, _props);
    const { classNames, className, style, styles, vars, span, order, offset: offset4, ...others } = props;
    const ctx = useGridContext();
    const responsiveClassName = useRandomClassName();
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsx(
        GridColVariables,
        {
          selector: `.${responsiveClassName}`,
          span,
          order,
          offset: offset4
        }
      ),
       jsxRuntime.jsx(
        Box,
        {
          ref,
          ...ctx.getStyles("col", {
            className: clsx_default(className, responsiveClassName),
            style,
            classNames,
            styles
          }),
          ...others
        }
      )
    ] });
  });
  GridCol.classes = classes47;
  GridCol.displayName = "@mantine/core/GridCol";
  function GridVariables({ gutter, selector, breakpoints, type }) {
    const theme = useMantineTheme();
    const _breakpoints = breakpoints || theme.breakpoints;
    const baseStyles = filterProps({
      "--grid-gutter": getSpacing(getBaseValue(gutter))
    });
    const queries = keys(_breakpoints).reduce(
      (acc, breakpoint) => {
        if (!acc[breakpoint]) {
          acc[breakpoint] = {};
        }
        if (typeof gutter === "object" && gutter[breakpoint] !== void 0) {
          acc[breakpoint]["--grid-gutter"] = getSpacing(gutter[breakpoint]);
        }
        return acc;
      },
      {}
    );
    const sortedBreakpoints = getSortedBreakpoints(keys(queries), _breakpoints).filter(
      (breakpoint) => keys(queries[breakpoint.value]).length > 0
    );
    const values2 = sortedBreakpoints.map((breakpoint) => ({
      query: type === "container" ? `mantine-grid (min-width: ${_breakpoints[breakpoint.value]})` : `(min-width: ${_breakpoints[breakpoint.value]})`,
      styles: queries[breakpoint.value]
    }));
    return  jsxRuntime.jsx(
      InlineStyles,
      {
        styles: baseStyles,
        media: type === "container" ? void 0 : values2,
        container: type === "container" ? values2 : void 0,
        selector
      }
    );
  }
  var defaultProps99 = {
    gutter: "md",
    grow: false,
    columns: 12
  };
  var varsResolver50 = createVarsResolver((_, { justify, align, overflow }) => ({
    root: {
      "--grid-justify": justify,
      "--grid-align": align,
      "--grid-overflow": overflow
    }
  }));
  var Grid = factory((_props, ref) => {
    const props = useProps("Grid", defaultProps99, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      grow,
      gutter,
      columns,
      align,
      justify,
      children,
      breakpoints,
      type,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Grid",
      classes: classes47,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver50
    });
    const responsiveClassName = useRandomClassName();
    if (type === "container" && breakpoints) {
      return  jsxRuntime.jsxs(GridProvider, { value: { getStyles: getStyles2, grow, columns: columns || 12, breakpoints, type }, children: [
         jsxRuntime.jsx(GridVariables, { selector: `.${responsiveClassName}`, ...props }),
         jsxRuntime.jsx("div", { ...getStyles2("container"), children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("root", { className: responsiveClassName }), ...others, children:  jsxRuntime.jsx("div", { ...getStyles2("inner"), children }) }) })
      ] });
    }
    return  jsxRuntime.jsxs(GridProvider, { value: { getStyles: getStyles2, grow, columns: columns || 12, breakpoints, type }, children: [
       jsxRuntime.jsx(GridVariables, { selector: `.${responsiveClassName}`, ...props }),
       jsxRuntime.jsx(Box, { ref, ...getStyles2("root", { className: responsiveClassName }), ...others, children:  jsxRuntime.jsx("div", { ...getStyles2("inner"), children }) })
    ] });
  });
  Grid.classes = classes47;
  Grid.displayName = "@mantine/core/Grid";
  Grid.Col = GridCol;
  function getMarkColor({ color, theme, defaultShade }) {
    const parsed = parseThemeColor({ color, theme });
    if (!parsed.isThemeColor) {
      return color;
    }
    if (parsed.shade === void 0) {
      return `var(--mantine-color-${parsed.color}-${defaultShade})`;
    }
    return `var(${parsed.variable})`;
  }
  var classes48 = { "root": "m_bcb3f3c2" };
  var defaultProps100 = {
    color: "yellow"
  };
  var varsResolver51 = createVarsResolver((theme, { color }) => ({
    root: {
      "--mark-bg-dark": getMarkColor({ color, theme, defaultShade: 5 }),
      "--mark-bg-light": getMarkColor({ color, theme, defaultShade: 2 })
    }
  }));
  var Mark = factory((_props, ref) => {
    const props = useProps("Mark", defaultProps100, _props);
    const { classNames, className, style, styles, unstyled, vars, color, variant, ...others } = props;
    const getStyles2 = useStyles({
      name: "Mark",
      props,
      className,
      style,
      classes: classes48,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver51
    });
    return  jsxRuntime.jsx(Box, { component: "mark", ref, variant, ...getStyles2("root"), ...others });
  });
  Mark.classes = classes48;
  Mark.displayName = "@mantine/core/Mark";
  function escapeRegex(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
  }
  function highlighter(value, _highlight) {
    if (_highlight == null) {
      return [{ chunk: value, highlighted: false }];
    }
    const highlight = Array.isArray(_highlight) ? _highlight.map(escapeRegex) : escapeRegex(_highlight);
    const shouldHighlight = Array.isArray(highlight) ? highlight.filter((part) => part.trim().length > 0).length > 0 : highlight.trim() !== "";
    if (!shouldHighlight) {
      return [{ chunk: value, highlighted: false }];
    }
    const matcher = typeof highlight === "string" ? highlight.trim() : highlight.filter((part) => part.trim().length !== 0).map((part) => part.trim()).sort((a, b) => b.length - a.length).join("|");
    const re = new RegExp(`(${matcher})`, "gi");
    const chunks = value.split(re).map((part) => ({ chunk: part, highlighted: re.test(part) })).filter(({ chunk }) => chunk);
    return chunks;
  }
  var defaultProps101 = {};
  var Highlight = polymorphicFactory((props, ref) => {
    const { unstyled, children, highlight, highlightStyles, color, ...others } = useProps(
      "Highlight",
      defaultProps101,
      props
    );
    const highlightChunks = highlighter(children, highlight);
    return  jsxRuntime.jsx(Text, { unstyled, ref, ...others, __staticSelector: "Highlight", children: highlightChunks.map(
      ({ chunk, highlighted }, i) => highlighted ?  jsxRuntime.jsx(
        Mark,
        {
          unstyled,
          color,
          style: highlightStyles,
          "data-highlight": chunk,
          children: chunk
        },
        i
      ) :  jsxRuntime.jsx("span", { children: chunk }, i)
    ) });
  });
  Highlight.classes = Text.classes;
  Highlight.displayName = "@mantine/core/Highlight";
  var [HoverCardContextProvider, useHoverCardContext] = createSafeContext(
    "HoverCard component was not found in the tree"
  );
  var defaultProps102 = {};
  function HoverCardDropdown(props) {
    const { children, onMouseEnter, onMouseLeave, ...others } = useProps(
      "HoverCardDropdown",
      defaultProps102,
      props
    );
    const ctx = useHoverCardContext();
    const handleMouseEnter = createEventHandler(onMouseEnter, ctx.openDropdown);
    const handleMouseLeave = createEventHandler(onMouseLeave, ctx.closeDropdown);
    return  jsxRuntime.jsx(Popover.Dropdown, { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, ...others, children });
  }
  HoverCardDropdown.displayName = "@mantine/core/HoverCardDropdown";
  var defaultProps103 = {
    refProp: "ref"
  };
  var HoverCardTarget = React10.forwardRef((props, ref) => {
    const { children, refProp, eventPropsWrapperName, ...others } = useProps(
      "HoverCardTarget",
      defaultProps103,
      props
    );
    if (!isElement(children)) {
      throw new Error(
        "HoverCard.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const ctx = useHoverCardContext();
    const onMouseEnter = createEventHandler(children.props.onMouseEnter, ctx.openDropdown);
    const onMouseLeave = createEventHandler(children.props.onMouseLeave, ctx.closeDropdown);
    const eventListeners = { onMouseEnter, onMouseLeave };
    return  jsxRuntime.jsx(Popover.Target, { refProp, ref, ...others, children: React10.cloneElement(
      children,
      eventPropsWrapperName ? { [eventPropsWrapperName]: eventListeners } : eventListeners
    ) });
  });
  HoverCardTarget.displayName = "@mantine/core/HoverCardTarget";
  var defaultProps104 = {
    openDelay: 0,
    closeDelay: 150,
    initiallyOpened: false
  };
  function HoverCard(props) {
    const { children, onOpen, onClose, openDelay, closeDelay, initiallyOpened, ...others } = useProps(
      "HoverCard",
      defaultProps104,
      props
    );
    const [opened, { open, close }] = hooks.useDisclosure(initiallyOpened, { onClose, onOpen });
    const { openDropdown, closeDropdown } = useDelayedHover({ open, close, openDelay, closeDelay });
    return  jsxRuntime.jsx(HoverCardContextProvider, { value: { openDropdown, closeDropdown }, children:  jsxRuntime.jsx(Popover, { ...others, opened, __staticSelector: "HoverCard", children }) });
  }
  HoverCard.displayName = "@mantine/core/HoverCard";
  HoverCard.Target = HoverCardTarget;
  HoverCard.Dropdown = HoverCardDropdown;
  HoverCard.extend = (input) => input;
  var classes49 = { "root": "m_9e117634" };
  var defaultProps105 = {};
  var varsResolver52 = createVarsResolver((_, { radius, fit }) => ({
    root: {
      "--image-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--image-object-fit": fit
    }
  }));
  var Image = polymorphicFactory((_props, ref) => {
    const props = useProps("Image", defaultProps105, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      onError,
      src,
      radius,
      fit,
      fallbackSrc,
      mod,
      ...others
    } = props;
    const [error2, setError] = React10.useState(!src);
    React10.useEffect(() => setError(!src), [src]);
    const getStyles2 = useStyles({
      name: "Image",
      classes: classes49,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver52
    });
    if (error2 && fallbackSrc) {
      return  jsxRuntime.jsx(
        Box,
        {
          component: "img",
          ref,
          src: fallbackSrc,
          ...getStyles2("root"),
          onError,
          mod: ["fallback", mod],
          ...others
        }
      );
    }
    return  jsxRuntime.jsx(
      Box,
      {
        component: "img",
        ref,
        ...getStyles2("root"),
        src,
        onError: (event) => {
          onError?.(event);
          setError(true);
        },
        mod,
        ...others
      }
    );
  });
  Image.classes = classes49;
  Image.displayName = "@mantine/core/Image";
  function getPositionVariables(_position = "top-end", offset4 = 0) {
    const variables = {
      "--indicator-top": void 0,
      "--indicator-bottom": void 0,
      "--indicator-left": void 0,
      "--indicator-right": void 0,
      "--indicator-translate-x": void 0,
      "--indicator-translate-y": void 0
    };
    const _offset = rem(offset4);
    const [position, placement] = _position.split("-");
    if (position === "top") {
      variables["--indicator-top"] = _offset;
      variables["--indicator-translate-y"] = "-50%";
    }
    if (position === "middle") {
      variables["--indicator-top"] = "50%";
      variables["--indicator-translate-y"] = "-50%";
    }
    if (position === "bottom") {
      variables["--indicator-bottom"] = _offset;
      variables["--indicator-translate-y"] = "50%";
    }
    if (placement === "start") {
      variables["--indicator-left"] = _offset;
      variables["--indicator-translate-x"] = "-50%";
    }
    if (placement === "center") {
      variables["--indicator-left"] = "50%";
      variables["--indicator-translate-x"] = "-50%";
    }
    if (placement === "end") {
      variables["--indicator-right"] = _offset;
      variables["--indicator-translate-x"] = "50%";
    }
    return variables;
  }
  var classes50 = { "root": "m_e5262200", "indicator": "m_760d1fb1", "processing": "m_885901b1" };
  var defaultProps106 = {
    position: "top-end",
    offset: 0,
    inline: false,
    withBorder: false,
    disabled: false,
    processing: false
  };
  var varsResolver53 = createVarsResolver(
    (theme, { color, position, offset: offset4, size: size4, radius, zIndex, autoContrast }) => ({
      root: {
        "--indicator-color": color ? getThemeColor(color, theme) : void 0,
        "--indicator-text-color": getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0,
        "--indicator-size": rem(size4),
        "--indicator-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--indicator-z-index": zIndex?.toString(),
        ...getPositionVariables(position, offset4)
      }
    })
  );
  var Indicator = factory((_props, ref) => {
    const props = useProps("Indicator", defaultProps106, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      position,
      offset: offset4,
      inline: inline4,
      label,
      radius,
      color,
      withBorder,
      disabled,
      processing,
      zIndex,
      autoContrast,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Indicator",
      classes: classes50,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver53
    });
    return  jsxRuntime.jsxs(Box, { ref, ...getStyles2("root"), mod: [{ inline: inline4 }, mod], ...others, children: [
      !disabled &&  jsxRuntime.jsx(
        Box,
        {
          mod: { "with-label": !!label, "with-border": withBorder, processing },
          ...getStyles2("indicator"),
          children: label
        }
      ),
      children
    ] });
  });
  Indicator.classes = classes50;
  Indicator.displayName = "@mantine/core/Indicator";
  var import_react_textarea_autosize_browser_cjs_default = __toESM(require_react_textarea_autosize_browser_cjs_default());
  var defaultProps107 = {};
  var Textarea = factory((props, ref) => {
    const { autosize, maxRows, minRows, __staticSelector, resize, ...others } = useProps(
      "Textarea",
      defaultProps107,
      props
    );
    const shouldAutosize = autosize && getEnv() !== "test";
    const autosizeProps = shouldAutosize ? { maxRows, minRows } : {};
    return  jsxRuntime.jsx(
      InputBase,
      {
        component: shouldAutosize ? import_react_textarea_autosize_browser_cjs_default._default : "textarea",
        ref,
        ...others,
        __staticSelector: __staticSelector || "Textarea",
        multiline: true,
        "data-no-overflow": autosize && maxRows === void 0 || void 0,
        __vars: { "--input-resize": resize },
        ...autosizeProps
      }
    );
  });
  Textarea.classes = InputBase.classes;
  Textarea.displayName = "@mantine/core/Textarea";
  function validateJson(value, deserialize) {
    if (typeof value === "string" && value.trim().length === 0) {
      return true;
    }
    try {
      deserialize(value);
      return true;
    } catch (e) {
      return false;
    }
  }
  var defaultProps108 = {
    serialize: JSON.stringify,
    deserialize: JSON.parse
  };
  var JsonInput = factory((props, ref) => {
    const {
      value,
      defaultValue,
      onChange,
      formatOnBlur,
      validationError,
      serialize,
      deserialize,
      onFocus,
      onBlur,
      readOnly,
      error: error2,
      ...others
    } = useProps("JsonInput", defaultProps108, props);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "",
      onChange
    });
    const [valid, setValid] = React10.useState(validateJson(_value, deserialize));
    const handleFocus = (event) => {
      onFocus?.(event);
      setValid(true);
    };
    const handleBlur = (event) => {
      typeof onBlur === "function" && onBlur(event);
      const isValid = validateJson(event.currentTarget.value, deserialize);
      formatOnBlur && !readOnly && isValid && event.currentTarget.value.trim() !== "" && setValue(serialize(deserialize(event.currentTarget.value), null, 2));
      setValid(isValid);
    };
    return  jsxRuntime.jsx(
      Textarea,
      {
        value: _value,
        onChange: (event) => setValue(event.currentTarget.value),
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref,
        readOnly,
        ...others,
        autoComplete: "off",
        __staticSelector: "JsonInput",
        error: valid ? error2 : validationError || true,
        "data-monospace": true
      }
    );
  });
  JsonInput.classes = InputBase.classes;
  JsonInput.displayName = "@mantine/core/JsonInput";
  var classes51 = { "root": "m_dc6f14e2" };
  var defaultProps109 = {};
  var varsResolver54 = createVarsResolver((_, { size: size4 }) => ({
    root: {
      "--kbd-fz": getSize(size4, "kbd-fz"),
      "--kbd-padding": getSize(size4, "kbd-padding")
    }
  }));
  var Kbd = factory((_props, ref) => {
    const props = useProps("Kbd", defaultProps109, _props);
    const { classNames, className, style, styles, unstyled, vars, ...others } = props;
    const getStyles2 = useStyles({
      name: "Kbd",
      classes: classes51,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver54
    });
    return  jsxRuntime.jsx(Box, { component: "kbd", ref, ...getStyles2("root"), ...others });
  });
  Kbd.classes = classes51;
  Kbd.displayName = "@mantine/core/Kbd";
  var [ListProvider, useListContext] = createSafeContext(
    "List component was not found in tree"
  );
  var classes52 = { "root": "m_abbac491", "item": "m_abb6bec2", "itemWrapper": "m_75cd9f71", "itemIcon": "m_60f83e5b" };
  var defaultProps110 = {};
  var ListItem = factory((_props, ref) => {
    const props = useProps("ListItem", defaultProps110, _props);
    const { classNames, className, style, styles, vars, icon, children, mod, ...others } = props;
    const ctx = useListContext();
    const _icon = icon || ctx.icon;
    const stylesApiProps = { classNames, styles };
    return  jsxRuntime.jsx(
      Box,
      {
        ...ctx.getStyles("item", { ...stylesApiProps, className, style }),
        component: "li",
        mod: [{ "with-icon": !!_icon, centered: ctx.center }, mod],
        ref,
        ...others,
        children:  jsxRuntime.jsxs("div", { ...ctx.getStyles("itemWrapper", stylesApiProps), children: [
          _icon &&  jsxRuntime.jsx("span", { ...ctx.getStyles("itemIcon", stylesApiProps), children: _icon }),
           jsxRuntime.jsx("span", { ...ctx.getStyles("itemLabel", stylesApiProps), children })
        ] })
      }
    );
  });
  ListItem.classes = classes52;
  ListItem.displayName = "@mantine/core/ListItem";
  var defaultProps111 = {
    type: "unordered"
  };
  var varsResolver55 = createVarsResolver((_, { size: size4, spacing }) => ({
    root: {
      "--list-fz": getFontSize(size4),
      "--list-lh": getLineHeight(size4),
      "--list-spacing": getSpacing(spacing)
    }
  }));
  var List = factory((_props, ref) => {
    const props = useProps("List", defaultProps111, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      type,
      withPadding,
      icon,
      spacing,
      center,
      listStyleType,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "List",
      classes: classes52,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver55
    });
    return  jsxRuntime.jsx(ListProvider, { value: { center, icon, getStyles: getStyles2 }, children:  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root", { style: { listStyleType } }),
        component: type === "unordered" ? "ul" : "ol",
        mod: [{ "with-padding": withPadding }, mod],
        ref,
        ...others,
        children
      }
    ) });
  });
  List.classes = classes52;
  List.displayName = "@mantine/core/List";
  List.Item = ListItem;
  var classes53 = { "root": "m_6e45937b", "loader": "m_e8eb006c", "overlay": "m_df587f17" };
  var defaultProps112 = {
    transitionProps: { transition: "fade", duration: 0 },
    overlayProps: { backgroundOpacity: 0.75 },
    zIndex: getDefaultZIndex("overlay")
  };
  var varsResolver56 = createVarsResolver((_, { zIndex }) => ({
    root: {
      "--lo-z-index": zIndex?.toString()
    }
  }));
  var LoadingOverlay = factory((_props, ref) => {
    const props = useProps("LoadingOverlay", defaultProps112, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      transitionProps,
      loaderProps,
      overlayProps,
      visible,
      zIndex,
      ...others
    } = props;
    const theme = useMantineTheme();
    const getStyles2 = useStyles({
      name: "LoadingOverlay",
      classes: classes53,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver56
    });
    const _overlayProps = { ...defaultProps112.overlayProps, ...overlayProps };
    return  jsxRuntime.jsx(Transition, { transition: "fade", ...transitionProps, mounted: !!visible, children: (transitionStyles) =>  jsxRuntime.jsxs(Box, { ...getStyles2("root", { style: transitionStyles }), ref, ...others, children: [
       jsxRuntime.jsx(Loader, { ...getStyles2("loader"), unstyled, ...loaderProps }),
       jsxRuntime.jsx(
        Overlay,
        {
          ..._overlayProps,
          ...getStyles2("overlay"),
          darkHidden: true,
          unstyled,
          color: overlayProps?.color || theme.white
        }
      ),
       jsxRuntime.jsx(
        Overlay,
        {
          ..._overlayProps,
          ...getStyles2("overlay"),
          lightHidden: true,
          unstyled,
          color: overlayProps?.color || theme.colors.dark[5]
        }
      )
    ] }) });
  });
  LoadingOverlay.classes = classes53;
  LoadingOverlay.displayName = "@mantine/core/LoadingOverlay";
  var [MenuContextProvider, useMenuContext] = createSafeContext(
    "Menu component was not found in the tree"
  );
  var classes54 = { "dropdown": "m_dc9b7c9f", "label": "m_9bfac126", "divider": "m_efdf90cb", "item": "m_99ac2aa1", "itemLabel": "m_5476e0d3", "itemSection": "m_8b75e504" };
  var defaultProps113 = {};
  var MenuDivider = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "MenuDivider",
      defaultProps113,
      props
    );
    const ctx = useMenuContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("divider", { className, style, styles, classNames }),
        ...others
      }
    );
  });
  MenuDivider.classes = classes54;
  MenuDivider.displayName = "@mantine/core/MenuDivider";
  var defaultProps114 = {};
  var MenuDropdown = factory((props, ref) => {
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      children,
      ...others
    } = useProps("MenuDropdown", defaultProps114, props);
    const wrapperRef = React10.useRef(null);
    const ctx = useMenuContext();
    const handleKeyDown = createEventHandler(onKeyDown, (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        wrapperRef.current?.querySelectorAll("[data-menu-item]:not(:disabled)")[0]?.focus();
      }
    });
    const handleMouseEnter = createEventHandler(
      onMouseEnter,
      () => (ctx.trigger === "hover" || ctx.trigger === "click-hover") && ctx.openDropdown()
    );
    const handleMouseLeave = createEventHandler(
      onMouseLeave,
      () => (ctx.trigger === "hover" || ctx.trigger === "click-hover") && ctx.closeDropdown()
    );
    return  jsxRuntime.jsxs(
      Popover.Dropdown,
      {
        ...others,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        role: "menu",
        "aria-orientation": "vertical",
        ref: hooks.useMergedRef(ref, wrapperRef),
        ...ctx.getStyles("dropdown", {
          className,
          style,
          styles,
          classNames,
          withStaticClass: false
        }),
        tabIndex: -1,
        "data-menu-dropdown": true,
        onKeyDown: handleKeyDown,
        children: [
           jsxRuntime.jsx("div", { tabIndex: -1, "data-autofocus": true, "data-mantine-stop-propagation": true, style: { outline: 0 } }),
          children
        ]
      }
    );
  });
  MenuDropdown.classes = classes54;
  MenuDropdown.displayName = "@mantine/core/MenuDropdown";
  var defaultProps115 = {};
  var MenuItem = polymorphicFactory((props, ref) => {
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      color,
      closeMenuOnClick,
      leftSection,
      rightSection,
      children,
      disabled,
      ...others
    } = useProps("MenuItem", defaultProps115, props);
    const ctx = useMenuContext();
    const theme = useMantineTheme();
    const { dir } = useDirection();
    const itemRef = React10.useRef(null);
    const itemIndex = ctx.getItemIndex(itemRef.current);
    const _others = others;
    const handleMouseLeave = createEventHandler(_others.onMouseLeave, () => ctx.setHovered(-1));
    const handleMouseEnter = createEventHandler(
      _others.onMouseEnter,
      () => ctx.setHovered(ctx.getItemIndex(itemRef.current))
    );
    const handleClick = createEventHandler(_others.onClick, () => {
      if (typeof closeMenuOnClick === "boolean") {
        closeMenuOnClick && ctx.closeDropdownImmediately();
      } else {
        ctx.closeOnItemClick && ctx.closeDropdownImmediately();
      }
    });
    const handleFocus = createEventHandler(
      _others.onFocus,
      () => ctx.setHovered(ctx.getItemIndex(itemRef.current))
    );
    const colors = color ? theme.variantColorResolver({ color, theme, variant: "light" }) : void 0;
    const parsedThemeColor = color ? parseThemeColor({ color, theme }) : null;
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ...others,
        unstyled: ctx.unstyled,
        tabIndex: ctx.menuItemTabIndex,
        onFocus: handleFocus,
        ...ctx.getStyles("item", { className, style, styles, classNames }),
        ref: hooks.useMergedRef(itemRef, ref),
        role: "menuitem",
        disabled,
        "data-menu-item": true,
        "data-disabled": disabled || void 0,
        "data-hovered": ctx.hovered === itemIndex ? true : void 0,
        "data-mantine-stop-propagation": true,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
        onKeyDown: createScopedKeydownHandler({
          siblingSelector: "[data-menu-item]",
          parentSelector: "[data-menu-dropdown]",
          activateOnFocus: false,
          loop: ctx.loop,
          dir,
          orientation: "vertical",
          onKeyDown: _others.onKeyDown
        }),
        __vars: {
          "--menu-item-color": parsedThemeColor?.isThemeColor && parsedThemeColor?.shade === void 0 ? `var(--mantine-color-${parsedThemeColor.color}-6)` : colors?.color,
          "--menu-item-hover": colors?.hover
        },
        children: [
          leftSection &&  jsxRuntime.jsx("div", { ...ctx.getStyles("itemSection", { styles, classNames }), "data-position": "left", children: leftSection }),
          children &&  jsxRuntime.jsx("div", { ...ctx.getStyles("itemLabel", { styles, classNames }), children }),
          rightSection &&  jsxRuntime.jsx("div", { ...ctx.getStyles("itemSection", { styles, classNames }), "data-position": "right", children: rightSection })
        ]
      }
    );
  });
  MenuItem.classes = classes54;
  MenuItem.displayName = "@mantine/core/MenuItem";
  var defaultProps116 = {};
  var MenuLabel = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "MenuLabel",
      defaultProps116,
      props
    );
    const ctx = useMenuContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("label", { className, style, styles, classNames }),
        ...others
      }
    );
  });
  MenuLabel.classes = classes54;
  MenuLabel.displayName = "@mantine/core/MenuLabel";
  var defaultProps117 = {
    refProp: "ref"
  };
  var MenuTarget = React10.forwardRef((props, ref) => {
    const { children, refProp, ...others } = useProps("MenuTarget", defaultProps117, props);
    if (!isElement(children)) {
      throw new Error(
        "Menu.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const ctx = useMenuContext();
    const _childrenProps = children.props;
    const onClick = createEventHandler(_childrenProps.onClick, () => {
      if (ctx.trigger === "click") {
        ctx.toggleDropdown();
      } else if (ctx.trigger === "click-hover") {
        ctx.setOpenedViaClick(true);
        if (!ctx.opened) {
          ctx.openDropdown();
        }
      }
    });
    const onMouseEnter = createEventHandler(
      _childrenProps.onMouseEnter,
      () => (ctx.trigger === "hover" || ctx.trigger === "click-hover") && ctx.openDropdown()
    );
    const onMouseLeave = createEventHandler(_childrenProps.onMouseLeave, () => {
      if (ctx.trigger === "hover") {
        ctx.closeDropdown();
      } else if (ctx.trigger === "click-hover" && !ctx.openedViaClick) {
        ctx.closeDropdown();
      }
    });
    return  jsxRuntime.jsx(Popover.Target, { refProp, popupType: "menu", ref, ...others, children: React10.cloneElement(children, {
      onClick,
      onMouseEnter,
      onMouseLeave,
      "data-expanded": ctx.opened ? true : void 0
    }) });
  });
  MenuTarget.displayName = "@mantine/core/MenuTarget";
  var defaultProps118 = {
    trapFocus: true,
    closeOnItemClick: true,
    clickOutsideEvents: ["mousedown", "touchstart", "keydown"],
    loop: true,
    trigger: "click",
    openDelay: 0,
    closeDelay: 100,
    menuItemTabIndex: -1
  };
  function Menu(_props) {
    const props = useProps("Menu", defaultProps118, _props);
    const {
      children,
      onOpen,
      onClose,
      opened,
      defaultOpened,
      trapFocus,
      onChange,
      closeOnItemClick,
      loop,
      closeOnEscape: closeOnEscape2,
      trigger,
      openDelay,
      closeDelay,
      classNames,
      styles,
      unstyled,
      variant,
      vars,
      menuItemTabIndex,
      keepMounted,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Menu",
      classes: classes54,
      props,
      classNames,
      styles,
      unstyled
    });
    const [hovered, { setHovered, resetHovered }] = useHovered();
    const [_opened, setOpened] = hooks.useUncontrolled({
      value: opened,
      defaultValue: defaultOpened,
      finalValue: false,
      onChange
    });
    const [openedViaClick, setOpenedViaClick] = React10.useState(false);
    const close = () => {
      setOpened(false);
      setOpenedViaClick(false);
      _opened && onClose?.();
    };
    const open = () => {
      setOpened(true);
      !_opened && onOpen?.();
    };
    const toggleDropdown = () => {
      _opened ? close() : open();
    };
    const { openDropdown, closeDropdown } = useDelayedHover({ open, close, closeDelay, openDelay });
    const getItemIndex = (node) => getContextItemIndex("[data-menu-item]", "[data-menu-dropdown]", node);
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    hooks.useDidUpdate(() => {
      resetHovered();
    }, [_opened]);
    return  jsxRuntime.jsx(
      MenuContextProvider,
      {
        value: {
          getStyles: getStyles2,
          opened: _opened,
          toggleDropdown,
          getItemIndex,
          hovered,
          setHovered,
          openedViaClick,
          setOpenedViaClick,
          closeOnItemClick,
          closeDropdown: trigger === "click" ? close : closeDropdown,
          openDropdown: trigger === "click" ? open : openDropdown,
          closeDropdownImmediately: close,
          loop,
          trigger,
          unstyled,
          menuItemTabIndex
        },
        children:  jsxRuntime.jsx(
          Popover,
          {
            ...others,
            opened: _opened,
            onChange: toggleDropdown,
            defaultOpened,
            trapFocus: keepMounted ? false : trapFocus,
            closeOnEscape: closeOnEscape2,
            __staticSelector: "Menu",
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            variant,
            keepMounted,
            children
          }
        )
      }
    );
  }
  Menu.extend = (input) => input;
  Menu.classes = classes54;
  Menu.displayName = "@mantine/core/Menu";
  Menu.Item = MenuItem;
  Menu.Label = MenuLabel;
  Menu.Dropdown = MenuDropdown;
  Menu.Target = MenuTarget;
  Menu.Divider = MenuDivider;
  var [ModalProvider, useModalContext] = createSafeContext(
    "Modal component was not found in tree"
  );
  var classes55 = { "root": "m_9df02822", "content": "m_54c44539", "inner": "m_1f958f16", "header": "m_d0e2b9cd" };
  var defaultProps119 = {};
  var ModalBody = factory((_props, ref) => {
    const props = useProps("ModalBody", defaultProps119, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useModalContext();
    return  jsxRuntime.jsx(
      ModalBaseBody,
      {
        ref,
        ...ctx.getStyles("body", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  ModalBody.classes = classes55;
  ModalBody.displayName = "@mantine/core/ModalBody";
  var defaultProps120 = {};
  var ModalCloseButton = factory((_props, ref) => {
    const props = useProps("ModalCloseButton", defaultProps120, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useModalContext();
    return  jsxRuntime.jsx(
      ModalBaseCloseButton,
      {
        ref,
        ...ctx.getStyles("close", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  ModalCloseButton.classes = classes55;
  ModalCloseButton.displayName = "@mantine/core/ModalCloseButton";
  var defaultProps121 = {};
  var ModalContent = factory((_props, ref) => {
    const props = useProps("ModalContent", defaultProps121, _props);
    const { classNames, className, style, styles, vars, children, __hidden, ...others } = props;
    const ctx = useModalContext();
    const Scroll = ctx.scrollAreaComponent || NativeScrollArea;
    return  jsxRuntime.jsx(
      ModalBaseContent,
      {
        ...ctx.getStyles("content", { className, style, styles, classNames }),
        innerProps: ctx.getStyles("inner", { className, style, styles, classNames }),
        "data-full-screen": ctx.fullScreen || void 0,
        "data-modal-content": true,
        "data-hidden": __hidden || void 0,
        ref,
        ...others,
        children:  jsxRuntime.jsx(
          Scroll,
          {
            style: {
              maxHeight: ctx.fullScreen ? "100dvh" : `calc(100dvh - (${rem(ctx.yOffset)} * 2))`
            },
            children
          }
        )
      }
    );
  });
  ModalContent.classes = classes55;
  ModalContent.displayName = "@mantine/core/ModalContent";
  var defaultProps122 = {};
  var ModalHeader = factory((_props, ref) => {
    const props = useProps("ModalHeader", defaultProps122, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useModalContext();
    return  jsxRuntime.jsx(
      ModalBaseHeader,
      {
        ref,
        ...ctx.getStyles("header", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  ModalHeader.classes = classes55;
  ModalHeader.displayName = "@mantine/core/ModalHeader";
  var defaultProps123 = {};
  var ModalOverlay = factory((_props, ref) => {
    const props = useProps("ModalOverlay", defaultProps123, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useModalContext();
    return  jsxRuntime.jsx(
      ModalBaseOverlay,
      {
        ref,
        ...ctx.getStyles("overlay", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  ModalOverlay.classes = classes55;
  ModalOverlay.displayName = "@mantine/core/ModalOverlay";
  var defaultProps124 = {
    __staticSelector: "Modal",
    closeOnClickOutside: true,
    withinPortal: true,
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    closeOnEscape: true,
    keepMounted: false,
    zIndex: getDefaultZIndex("modal"),
    transitionProps: { duration: 200, transition: "fade-down" },
    yOffset: "5dvh"
  };
  var varsResolver57 = createVarsResolver(
    (_, { radius, size: size4, yOffset, xOffset }) => ({
      root: {
        "--modal-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--modal-size": getSize(size4, "modal-size"),
        "--modal-y-offset": rem(yOffset),
        "--modal-x-offset": rem(xOffset)
      }
    })
  );
  var ModalRoot = factory((_props, ref) => {
    const props = useProps("ModalRoot", defaultProps124, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      yOffset,
      scrollAreaComponent,
      radius,
      fullScreen,
      centered,
      xOffset,
      __staticSelector,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: __staticSelector,
      classes: classes55,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver57
    });
    return  jsxRuntime.jsx(ModalProvider, { value: { yOffset, scrollAreaComponent, getStyles: getStyles2, fullScreen }, children:  jsxRuntime.jsx(
      ModalBase,
      {
        ref,
        ...getStyles2("root"),
        "data-full-screen": fullScreen || void 0,
        "data-centered": centered || void 0,
        unstyled,
        ...others
      }
    ) });
  });
  ModalRoot.classes = classes55;
  ModalRoot.displayName = "@mantine/core/ModalRoot";
  var [ModalStackProvider, useModalStackContext] = createOptionalContext();
  function ModalStack({ children }) {
    const [stack, setStack] = React10.useState([]);
    const [maxZIndex, setMaxZIndex] = React10.useState(getDefaultZIndex("modal"));
    return  jsxRuntime.jsx(
      ModalStackProvider,
      {
        value: {
          stack,
          addModal: (id, zIndex) => {
            setStack((current) => [... new Set([...current, id])]);
            setMaxZIndex(
              (current) => typeof zIndex === "number" && typeof current === "number" ? Math.max(current, zIndex) : current
            );
          },
          removeModal: (id) => setStack((current) => current.filter((currentId) => currentId !== id)),
          getZIndex: (id) => `calc(${maxZIndex} + ${stack.indexOf(id)} + 1)`,
          currentId: stack[stack.length - 1],
          maxZIndex
        },
        children
      }
    );
  }
  ModalStack.displayName = "@mantine/core/ModalStack";
  var defaultProps125 = {};
  var ModalTitle = factory((_props, ref) => {
    const props = useProps("ModalTitle", defaultProps125, _props);
    const { classNames, className, style, styles, vars, ...others } = props;
    const ctx = useModalContext();
    return  jsxRuntime.jsx(
      ModalBaseTitle,
      {
        ref,
        ...ctx.getStyles("title", { classNames, style, styles, className }),
        ...others
      }
    );
  });
  ModalTitle.classes = classes55;
  ModalTitle.displayName = "@mantine/core/ModalTitle";
  var defaultProps126 = {
    closeOnClickOutside: true,
    withinPortal: true,
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    closeOnEscape: true,
    keepMounted: false,
    zIndex: getDefaultZIndex("modal"),
    transitionProps: { duration: 200, transition: "fade-down" },
    withOverlay: true,
    withCloseButton: true
  };
  var Modal = factory((_props, ref) => {
    const {
      title,
      withOverlay,
      overlayProps,
      withCloseButton,
      closeButtonProps,
      children,
      radius,
      opened,
      stackId,
      zIndex,
      ...others
    } = useProps("Modal", defaultProps126, _props);
    const ctx = useModalStackContext();
    const hasHeader = !!title || withCloseButton;
    const stackProps = ctx && stackId ? {
      closeOnEscape: ctx.currentId === stackId,
      trapFocus: ctx.currentId === stackId,
      zIndex: ctx.getZIndex(stackId)
    } : {};
    const overlayVisible = withOverlay === false ? false : stackId && ctx ? ctx.currentId === stackId : opened;
    React10.useEffect(() => {
      if (ctx && stackId) {
        opened ? ctx.addModal(stackId, zIndex || getDefaultZIndex("modal")) : ctx.removeModal(stackId);
      }
    }, [opened, stackId, zIndex]);
    return  jsxRuntime.jsxs(
      ModalRoot,
      {
        ref,
        radius,
        opened,
        zIndex: ctx && stackId ? ctx.getZIndex(stackId) : zIndex,
        ...others,
        ...stackProps,
        children: [
          withOverlay &&  jsxRuntime.jsx(
            ModalOverlay,
            {
              visible: overlayVisible,
              transitionProps: ctx && stackId ? { duration: 0 } : void 0,
              ...overlayProps
            }
          ),
           jsxRuntime.jsxs(
            ModalContent,
            {
              radius,
              __hidden: ctx && stackId && opened ? stackId !== ctx.currentId : false,
              children: [
                hasHeader &&  jsxRuntime.jsxs(ModalHeader, { children: [
                  title &&  jsxRuntime.jsx(ModalTitle, { children: title }),
                  withCloseButton &&  jsxRuntime.jsx(ModalCloseButton, { ...closeButtonProps })
                ] }),
                 jsxRuntime.jsx(ModalBody, { children })
              ]
            }
          )
        ]
      }
    );
  });
  Modal.classes = classes55;
  Modal.displayName = "@mantine/core/Modal";
  Modal.Root = ModalRoot;
  Modal.Overlay = ModalOverlay;
  Modal.Content = ModalContent;
  Modal.Body = ModalBody;
  Modal.Header = ModalHeader;
  Modal.Title = ModalTitle;
  Modal.CloseButton = ModalCloseButton;
  Modal.Stack = ModalStack;
  function useModalsStack(modals) {
    const initialState = modals.reduce(
      (acc, modal) => ({ ...acc, [modal]: false }),
      {}
    );
    const [state, setState] = React10.useState(initialState);
    const open = React10.useCallback((modal) => {
      setState((current) => ({ ...current, [modal]: true }));
    }, []);
    const close = React10.useCallback(
      (modal) => setState((current) => ({ ...current, [modal]: false })),
      []
    );
    const toggle = React10.useCallback(
      (modal) => setState((current) => ({ ...current, [modal]: !current[modal] })),
      []
    );
    const closeAll = React10.useCallback(() => setState(initialState), []);
    const register = React10.useCallback(
      (modal) => ({
        opened: state[modal],
        onClose: () => close(modal),
        stackId: modal
      }),
      [state]
    );
    return { state, open, close, closeAll, toggle, register };
  }
  var useDrawersStack = useModalsStack;
  var [PillsInputProvider, usePillsInputContext] = createOptionalContext();
  var [PillGroupProvider, usePillGroupContext] = createOptionalContext();
  var classes56 = { "root": "m_7cda1cd6", "root--default": "m_44da308b", "root--contrast": "m_e3a01f8", "label": "m_1e0e6180", "remove": "m_ae386778", "group": "m_1dcfd90b" };
  var defaultProps127 = {};
  var varsResolver58 = createVarsResolver((_, { gap }, { size: size4 }) => ({
    group: {
      "--pg-gap": gap !== void 0 ? getSize(gap) : getSize(size4, "pg-gap")
    }
  }));
  var PillGroup = factory((_props, ref) => {
    const props = useProps("PillGroup", defaultProps127, _props);
    const { classNames, className, style, styles, unstyled, vars, size: size4, disabled, ...others } = props;
    const pillsInputCtx = usePillsInputContext();
    const _size = pillsInputCtx?.size || size4 || void 0;
    const getStyles2 = useStyles({
      name: "PillGroup",
      classes: classes56,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver58,
      stylesCtx: { size: _size },
      rootSelector: "group"
    });
    return  jsxRuntime.jsx(PillGroupProvider, { value: { size: _size, disabled }, children:  jsxRuntime.jsx(Box, { ref, size: _size, ...getStyles2("group"), ...others }) });
  });
  PillGroup.classes = classes56;
  PillGroup.displayName = "@mantine/core/PillGroup";
  var defaultProps128 = {
    variant: "default"
  };
  var varsResolver59 = createVarsResolver((_, { radius }, { size: size4 }) => ({
    root: {
      "--pill-fz": getSize(size4, "pill-fz"),
      "--pill-height": getSize(size4, "pill-height"),
      "--pill-radius": radius === void 0 ? void 0 : getRadius(radius)
    }
  }));
  var Pill = factory((_props, ref) => {
    const props = useProps("Pill", defaultProps128, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      variant,
      children,
      withRemoveButton,
      onRemove,
      removeButtonProps,
      radius,
      size: size4,
      disabled,
      mod,
      ...others
    } = props;
    const ctx = usePillGroupContext();
    const pillsInputCtx = usePillsInputContext();
    const _size = size4 || ctx?.size || void 0;
    const _variant = pillsInputCtx?.variant === "filled" ? "contrast" : variant || "default";
    const getStyles2 = useStyles({
      name: "Pill",
      classes: classes56,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver59,
      stylesCtx: { size: _size }
    });
    return  jsxRuntime.jsxs(
      Box,
      {
        component: "span",
        ref,
        variant: _variant,
        size: _size,
        ...getStyles2("root", { variant: _variant }),
        mod: [
          { "with-remove": withRemoveButton && !disabled, disabled: disabled || ctx?.disabled },
          mod
        ],
        ...others,
        children: [
           jsxRuntime.jsx("span", { ...getStyles2("label"), children }),
          withRemoveButton &&  jsxRuntime.jsx(
            CloseButton,
            {
              variant: "transparent",
              radius,
              tabIndex: -1,
              "aria-hidden": true,
              unstyled,
              ...removeButtonProps,
              ...getStyles2("remove", {
                className: removeButtonProps?.className,
                style: removeButtonProps?.style
              }),
              onMouseDown: (event) => {
                event.preventDefault();
                event.stopPropagation();
                removeButtonProps?.onMouseDown?.(event);
              },
              onClick: (event) => {
                event.stopPropagation();
                onRemove?.();
                removeButtonProps?.onClick?.(event);
              }
            }
          )
        ]
      }
    );
  });
  Pill.classes = classes56;
  Pill.displayName = "@mantine/core/Pill";
  Pill.Group = PillGroup;
  var classes57 = { "field": "m_45c4369d" };
  var defaultProps129 = {
    type: "visible"
  };
  var PillsInputField = factory((_props, ref) => {
    const props = useProps("PillsInputField", defaultProps129, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      type,
      disabled,
      id,
      pointer,
      mod,
      ...others
    } = props;
    const ctx = usePillsInputContext();
    const inputWrapperCtx = useInputWrapperContext();
    const getStyles2 = useStyles({
      name: "PillsInputField",
      classes: classes57,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "field"
    });
    const _disabled = disabled || ctx?.disabled;
    return  jsxRuntime.jsx(
      Box,
      {
        component: "input",
        ref: hooks.useMergedRef(ref, ctx?.fieldRef),
        "data-type": type,
        disabled: _disabled,
        mod: [{ disabled: _disabled, pointer }, mod],
        ...getStyles2("field"),
        ...others,
        id: inputWrapperCtx?.inputId || id,
        "aria-invalid": ctx?.hasError,
        "aria-describedby": inputWrapperCtx?.describedBy,
        type: "text",
        onMouseDown: (event) => !pointer && event.stopPropagation()
      }
    );
  });
  PillsInputField.classes = classes57;
  PillsInputField.displayName = "@mantine/core/PillsInputField";
  var defaultProps130 = {};
  var PillsInput = factory((_props, ref) => {
    const props = useProps("PillsInput", defaultProps130, _props);
    const {
      children,
      onMouseDown,
      onClick,
      size: size4,
      disabled,
      __staticSelector,
      error: error2,
      variant,
      ...others
    } = props;
    const fieldRef = React10.useRef(null);
    return  jsxRuntime.jsx(PillsInputProvider, { value: { fieldRef, size: size4, disabled, hasError: !!error2, variant }, children:  jsxRuntime.jsx(
      InputBase,
      {
        size: size4,
        error: error2,
        variant,
        component: "div",
        ref,
        onMouseDown: (event) => {
          event.preventDefault();
          onMouseDown?.(event);
          fieldRef.current?.focus();
        },
        onClick: (event) => {
          event.preventDefault();
          onClick?.(event);
          fieldRef.current?.focus();
        },
        ...others,
        multiline: true,
        disabled,
        __staticSelector: __staticSelector || "PillsInput",
        withAria: false,
        children
      }
    ) });
  });
  PillsInput.displayName = "@mantine/core/PillsInput";
  PillsInput.Field = PillsInputField;
  function filterPickedValues({ data, value }) {
    const normalizedValue = value.map((item) => item.trim().toLowerCase());
    const filtered = data.reduce((acc, item) => {
      if (isOptionsGroup(item)) {
        acc.push({
          group: item.group,
          items: item.items.filter(
            (option) => normalizedValue.indexOf(option.value.toLowerCase().trim()) === -1
          )
        });
      } else if (normalizedValue.indexOf(item.value.toLowerCase().trim()) === -1) {
        acc.push(item);
      }
      return acc;
    }, []);
    return filtered;
  }
  var defaultProps131 = {
    maxValues: Infinity,
    withCheckIcon: true,
    checkIconPosition: "left",
    hiddenInputValuesDivider: ","
  };
  var MultiSelect = factory((_props, ref) => {
    const props = useProps("MultiSelect", defaultProps131, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      variant,
      data,
      dropdownOpened,
      defaultDropdownOpened,
      onDropdownOpen,
      onDropdownClose,
      selectFirstOptionOnChange,
      onOptionSubmit,
      comboboxProps,
      filter,
      limit,
      withScrollArea,
      maxDropdownHeight,
      searchValue,
      defaultSearchValue,
      onSearchChange,
      readOnly,
      disabled,
      onFocus,
      onBlur,
      onPaste,
      radius,
      rightSection,
      rightSectionWidth,
      rightSectionPointerEvents,
      rightSectionProps,
      leftSection,
      leftSectionWidth,
      leftSectionPointerEvents,
      leftSectionProps,
      inputContainer,
      inputWrapperOrder,
      withAsterisk,
      labelProps,
      descriptionProps,
      errorProps,
      wrapperProps,
      description,
      label,
      error: error2,
      maxValues,
      searchable,
      nothingFoundMessage,
      withCheckIcon,
      checkIconPosition,
      hidePickedOptions,
      withErrorStyles,
      name,
      form,
      id,
      clearable,
      clearButtonProps,
      hiddenInputProps,
      placeholder,
      hiddenInputValuesDivider,
      required,
      mod,
      renderOption,
      onRemove,
      onClear,
      scrollAreaProps,
      ...others
    } = props;
    const _id = hooks.useId(id);
    const parsedData = getParsedComboboxData(data);
    const optionsLockup = getOptionsLockup(parsedData);
    const combobox = useCombobox({
      opened: dropdownOpened,
      defaultOpened: defaultDropdownOpened,
      onDropdownOpen,
      onDropdownClose: () => {
        onDropdownClose?.();
        combobox.resetSelectedOption();
      }
    });
    const {
      styleProps,
      rest: { type, autoComplete, ...rest }
    } = extractStyleProps(others);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: [],
      onChange
    });
    const [_searchValue, setSearchValue] = hooks.useUncontrolled({
      value: searchValue,
      defaultValue: defaultSearchValue,
      finalValue: "",
      onChange: onSearchChange
    });
    const getStyles2 = useStyles({
      name: "MultiSelect",
      classes: {},
      props,
      classNames,
      styles,
      unstyled
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      props,
      styles,
      classNames
    });
    const handleInputKeydown = (event) => {
      onKeyDown?.(event);
      if (event.key === " " && !searchable) {
        event.preventDefault();
        combobox.toggleDropdown();
      }
      if (event.key === "Backspace" && _searchValue.length === 0 && _value.length > 0) {
        onRemove?.(_value[_value.length - 1]);
        setValue(_value.slice(0, _value.length - 1));
      }
    };
    const values2 = _value.map((item, index3) =>  jsxRuntime.jsx(
      Pill,
      {
        withRemoveButton: !readOnly && !optionsLockup[item]?.disabled,
        onRemove: () => {
          setValue(_value.filter((i) => item !== i));
          onRemove?.(item);
        },
        unstyled,
        disabled,
        ...getStyles2("pill"),
        children: optionsLockup[item]?.label || item
      },
      `${item}-${index3}`
    ));
    React10.useEffect(() => {
      if (selectFirstOptionOnChange) {
        combobox.selectFirstOption();
      }
    }, [selectFirstOptionOnChange, _value]);
    const clearButton = clearable && _value.length > 0 && !disabled && !readOnly &&  jsxRuntime.jsx(
      Combobox.ClearButton,
      {
        size: size4,
        ...clearButtonProps,
        onClear: () => {
          onClear?.();
          setValue([]);
          setSearchValue("");
        }
      }
    );
    const filteredData = filterPickedValues({ data: parsedData, value: _value });
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsxs(
        Combobox,
        {
          store: combobox,
          classNames: resolvedClassNames,
          styles: resolvedStyles,
          unstyled,
          size: size4,
          readOnly,
          __staticSelector: "MultiSelect",
          onOptionSubmit: (val) => {
            onOptionSubmit?.(val);
            setSearchValue("");
            combobox.updateSelectedOptionIndex("selected");
            if (_value.includes(optionsLockup[val].value)) {
              setValue(_value.filter((v) => v !== optionsLockup[val].value));
              onRemove?.(optionsLockup[val].value);
            } else if (_value.length < maxValues) {
              setValue([..._value, optionsLockup[val].value]);
            }
          },
          ...comboboxProps,
          children: [
             jsxRuntime.jsx(Combobox.DropdownTarget, { children:  jsxRuntime.jsx(
              PillsInput,
              {
                ...styleProps,
                __staticSelector: "MultiSelect",
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                unstyled,
                size: size4,
                className,
                style,
                variant,
                disabled,
                radius,
                rightSection: rightSection || clearButton ||  jsxRuntime.jsx(Combobox.Chevron, { size: size4, error: error2, unstyled }),
                rightSectionPointerEvents: rightSectionPointerEvents || (clearButton ? "all" : "none"),
                rightSectionWidth,
                rightSectionProps,
                leftSection,
                leftSectionWidth,
                leftSectionPointerEvents,
                leftSectionProps,
                inputContainer,
                inputWrapperOrder,
                withAsterisk,
                labelProps,
                descriptionProps,
                errorProps,
                wrapperProps,
                description,
                label,
                error: error2,
                multiline: true,
                withErrorStyles,
                __stylesApiProps: {
                  ...props,
                  rightSectionPointerEvents: rightSectionPointerEvents || (clearButton ? "all" : "none"),
                  multiline: true
                },
                pointer: !searchable,
                onClick: () => searchable ? combobox.openDropdown() : combobox.toggleDropdown(),
                "data-expanded": combobox.dropdownOpened || void 0,
                id: _id,
                required,
                mod,
                children:  jsxRuntime.jsxs(Pill.Group, { disabled, unstyled, ...getStyles2("pillsList"), children: [
                  values2,
                   jsxRuntime.jsx(Combobox.EventsTarget, { autoComplete, children:  jsxRuntime.jsx(
                    PillsInput.Field,
                    {
                      ...rest,
                      ref,
                      id: _id,
                      placeholder,
                      type: !searchable && !placeholder ? "hidden" : "visible",
                      ...getStyles2("inputField"),
                      unstyled,
                      onFocus: (event) => {
                        onFocus?.(event);
                        searchable && combobox.openDropdown();
                      },
                      onBlur: (event) => {
                        onBlur?.(event);
                        combobox.closeDropdown();
                        setSearchValue("");
                      },
                      onKeyDown: handleInputKeydown,
                      value: _searchValue,
                      onChange: (event) => {
                        setSearchValue(event.currentTarget.value);
                        searchable && combobox.openDropdown();
                        selectFirstOptionOnChange && combobox.selectFirstOption();
                      },
                      disabled,
                      readOnly: readOnly || !searchable,
                      pointer: !searchable
                    }
                  ) })
                ] })
              }
            ) }),
             jsxRuntime.jsx(
              OptionsDropdown,
              {
                data: hidePickedOptions ? filteredData : parsedData,
                hidden: readOnly || disabled,
                filter,
                search: _searchValue,
                limit,
                hiddenWhenEmpty: !nothingFoundMessage,
                withScrollArea,
                maxDropdownHeight,
                filterOptions: searchable,
                value: _value,
                checkIconPosition,
                withCheckIcon,
                nothingFoundMessage,
                unstyled,
                labelId: label ? `${_id}-label` : void 0,
                "aria-label": label ? void 0 : others["aria-label"],
                renderOption,
                scrollAreaProps
              }
            )
          ]
        }
      ),
       jsxRuntime.jsx(
        Combobox.HiddenInput,
        {
          name,
          valuesDivider: hiddenInputValuesDivider,
          value: _value,
          form,
          disabled,
          ...hiddenInputProps
        }
      )
    ] });
  });
  MultiSelect.classes = { ...InputBase.classes, ...Combobox.classes };
  MultiSelect.displayName = "@mantine/core/MultiSelect";
  function isGroup(input) {
    return "group" in input;
  }
  function NativeSelectOption({ data }) {
    if (isGroup(data)) {
      const items = data.items.map((item) =>  jsxRuntime.jsx(NativeSelectOption, { data: item }, item.value));
      return  jsxRuntime.jsx("optgroup", { label: data.group, children: items });
    }
    const { value, label, ...others } = data;
    return  jsxRuntime.jsx("option", { value: data.value, ...others, children: data.label }, data.value);
  }
  NativeSelectOption.displayName = "@mantine/core/NativeSelectOption";
  var defaultProps132 = {
    rightSectionPointerEvents: "none"
  };
  var NativeSelect = factory((props, ref) => {
    const { data, children, size: size4, error: error2, rightSection, unstyled, ...others } = useProps(
      "NativeSelect",
      defaultProps132,
      props
    );
    const options = getParsedComboboxData(data).map((item, index3) =>  jsxRuntime.jsx(NativeSelectOption, { data: item }, index3));
    return  jsxRuntime.jsx(
      InputBase,
      {
        component: "select",
        ref,
        ...others,
        __staticSelector: "NativeSelect",
        size: size4,
        pointer: true,
        error: error2,
        unstyled,
        rightSection: rightSection ||  jsxRuntime.jsx(ComboboxChevron, { size: size4, error: error2, unstyled }),
        children: children || options
      }
    );
  });
  NativeSelect.classes = InputBase.classes;
  NativeSelect.displayName = "@mantine/core/NativeSelect";
  var classes58 = { "root": "m_f0824112", "description": "m_57492dcc", "section": "m_690090b5", "label": "m_1f6ac4c4", "body": "m_f07af9d2", "children": "m_e17b862f", "chevron": "m_1fd8a00b" };
  var defaultProps133 = {};
  var varsResolver60 = createVarsResolver(
    (theme, { variant, color, childrenOffset, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        variant: variant || "light",
        autoContrast
      });
      return {
        root: {
          "--nl-bg": color || variant ? colors.background : void 0,
          "--nl-hover": color || variant ? colors.hover : void 0,
          "--nl-color": color || variant ? colors.color : void 0
        },
        children: {
          "--nl-offset": getSpacing(childrenOffset)
        }
      };
    }
  );
  var NavLink = polymorphicFactory((_props, ref) => {
    const props = useProps("NavLink", defaultProps133, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      opened,
      defaultOpened,
      onChange,
      children,
      onClick,
      active,
      disabled,
      leftSection,
      rightSection,
      label,
      description,
      disableRightSectionRotation,
      noWrap,
      childrenOffset,
      onKeyDown,
      autoContrast,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "NavLink",
      props,
      classes: classes58,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver60
    });
    const [_opened, setOpened] = hooks.useUncontrolled({
      value: opened,
      defaultValue: defaultOpened,
      finalValue: false,
      onChange
    });
    const withChildren = !!children;
    const handleClick = (event) => {
      onClick?.(event);
      if (withChildren) {
        event.preventDefault();
        setOpened(!_opened);
      }
    };
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsxs(
        UnstyledButton,
        {
          ...getStyles2("root"),
          component: "a",
          ref,
          onClick: handleClick,
          onKeyDown: (event) => {
            onKeyDown?.(event);
            if (event.nativeEvent.code === "Space" && withChildren) {
              event.preventDefault();
              setOpened(!_opened);
            }
          },
          unstyled,
          mod: [{ disabled, active, expanded: _opened }, mod],
          ...others,
          children: [
            leftSection &&  jsxRuntime.jsx(Box, { component: "span", ...getStyles2("section"), mod: { position: "left" }, children: leftSection }),
             jsxRuntime.jsxs(Box, { ...getStyles2("body"), mod: { "no-wrap": noWrap }, children: [
               jsxRuntime.jsx(Box, { component: "span", ...getStyles2("label"), children: label }),
               jsxRuntime.jsx(Box, { component: "span", mod: { active }, ...getStyles2("description"), children: description })
            ] }),
            (withChildren || rightSection) &&  jsxRuntime.jsx(
              Box,
              {
                ...getStyles2("section"),
                component: "span",
                mod: { rotate: _opened && !disableRightSectionRotation, position: "right" },
                children: withChildren ? rightSection ||  jsxRuntime.jsx(AccordionChevron, { ...getStyles2("chevron") }) : rightSection
              }
            )
          ]
        }
      ),
      withChildren &&  jsxRuntime.jsx(Collapse, { in: _opened, ...getStyles2("collapse"), children:  jsxRuntime.jsx("div", { ...getStyles2("children"), children }) })
    ] });
  });
  NavLink.classes = classes58;
  NavLink.displayName = "@mantine/core/NavLink";
  var classes59 = { "root": "m_a513464", "icon": "m_a4ceffb", "loader": "m_b0920b15", "body": "m_a49ed24", "title": "m_3feedf16", "description": "m_3d733a3a", "closeButton": "m_919a4d88" };
  var defaultProps134 = {
    withCloseButton: true
  };
  var varsResolver61 = createVarsResolver((theme, { radius, color }) => ({
    root: {
      "--notification-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--notification-color": color ? getThemeColor(color, theme) : void 0
    }
  }));
  var Notification = factory((_props, ref) => {
    const props = useProps("Notification", defaultProps134, _props);
    const {
      className,
      color,
      radius,
      loading,
      withCloseButton,
      withBorder,
      title,
      icon,
      children,
      onClose,
      closeButtonProps,
      classNames,
      style,
      styles,
      unstyled,
      variant,
      vars,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Notification",
      classes: classes59,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver61
    });
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("root"),
        mod: [{ "data-with-icon": !!icon || loading, "data-with-border": withBorder }, mod],
        ref,
        variant,
        ...others,
        role: "alert",
        children: [
          icon && !loading &&  jsxRuntime.jsx("div", { ...getStyles2("icon"), children: icon }),
          loading &&  jsxRuntime.jsx(Loader, { size: 28, color, ...getStyles2("loader") }),
           jsxRuntime.jsxs("div", { ...getStyles2("body"), children: [
            title &&  jsxRuntime.jsx("div", { ...getStyles2("title"), children: title }),
             jsxRuntime.jsx(Box, { ...getStyles2("description"), mod: { "data-with-title": !!title }, children })
          ] }),
          withCloseButton &&  jsxRuntime.jsx(
            CloseButton,
            {
              iconSize: 16,
              color: "gray",
              ...closeButtonProps,
              unstyled,
              onClick: onClose,
              ...getStyles2("closeButton")
            }
          )
        ]
      }
    );
  });
  Notification.classes = classes59;
  Notification.displayName = "@mantine/core/Notification";
  function __rest2(s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
        t[p] = s[p];
      }
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) {
          t[p[i]] = s[p[i]];
        }
      }
    }
    return t;
  }
  var SourceType;
  (function(SourceType2) {
    SourceType2["event"] = "event";
    SourceType2["props"] = "prop";
  })(SourceType || (SourceType = {}));
  function noop2() {
  }
  function memoizeOnce(cb) {
    var lastArgs;
    var lastValue = void 0;
    return function() {
      var args = [], len = arguments.length;
      while (len--)
        args[len] = arguments[len];
      if (lastArgs && args.length === lastArgs.length && args.every(function(value, index3) {
        return value === lastArgs[index3];
      })) {
        return lastValue;
      }
      lastArgs = args;
      lastValue = cb.apply(void 0, args);
      return lastValue;
    };
  }
  function charIsNumber(char) {
    return !!(char || "").match(/\d/);
  }
  function isNil(val) {
    return val === null || val === void 0;
  }
  function isNanValue(val) {
    return typeof val === "number" && isNaN(val);
  }
  function isNotValidValue(val) {
    return isNil(val) || isNanValue(val) || typeof val === "number" && !isFinite(val);
  }
  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  }
  function getThousandsGroupRegex(thousandsGroupStyle) {
    switch (thousandsGroupStyle) {
      case "lakh":
        return /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g;
      case "wan":
        return /(\d)(?=(\d{4})+(?!\d))/g;
      case "thousand":
      default:
        return /(\d)(?=(\d{3})+(?!\d))/g;
    }
  }
  function applyThousandSeparator(str, thousandSeparator, thousandsGroupStyle) {
    var thousandsGroupRegex = getThousandsGroupRegex(thousandsGroupStyle);
    var index3 = str.search(/[1-9]/);
    index3 = index3 === -1 ? str.length : index3;
    return str.substring(0, index3) + str.substring(index3, str.length).replace(thousandsGroupRegex, "$1" + thousandSeparator);
  }
  function usePersistentCallback(cb) {
    var callbackRef = React10.useRef(cb);
    callbackRef.current = cb;
    var persistentCbRef = React10.useRef(function() {
      var args = [], len = arguments.length;
      while (len--)
        args[len] = arguments[len];
      return callbackRef.current.apply(callbackRef, args);
    });
    return persistentCbRef.current;
  }
  function splitDecimal(numStr, allowNegative) {
    if (allowNegative === void 0)
      allowNegative = true;
    var hasNegation = numStr[0] === "-";
    var addNegation = hasNegation && allowNegative;
    numStr = numStr.replace("-", "");
    var parts = numStr.split(".");
    var beforeDecimal = parts[0];
    var afterDecimal = parts[1] || "";
    return {
      beforeDecimal,
      afterDecimal,
      hasNegation,
      addNegation
    };
  }
  function fixLeadingZero(numStr) {
    if (!numStr) {
      return numStr;
    }
    var isNegative = numStr[0] === "-";
    if (isNegative) {
      numStr = numStr.substring(1, numStr.length);
    }
    var parts = numStr.split(".");
    var beforeDecimal = parts[0].replace(/^0+/, "") || "0";
    var afterDecimal = parts[1] || "";
    return (isNegative ? "-" : "") + beforeDecimal + (afterDecimal ? "." + afterDecimal : "");
  }
  function limitToScale(numStr, scale, fixedDecimalScale) {
    var str = "";
    var filler = fixedDecimalScale ? "0" : "";
    for (var i = 0; i <= scale - 1; i++) {
      str += numStr[i] || filler;
    }
    return str;
  }
  function repeat(str, count2) {
    return Array(count2 + 1).join(str);
  }
  function toNumericString(num) {
    var _num = num + "";
    var sign = _num[0] === "-" ? "-" : "";
    if (sign) {
      _num = _num.substring(1);
    }
    var ref = _num.split(/[eE]/g);
    var coefficient = ref[0];
    var exponent = ref[1];
    exponent = Number(exponent);
    if (!exponent) {
      return sign + coefficient;
    }
    coefficient = coefficient.replace(".", "");
    var decimalIndex = 1 + exponent;
    var coffiecientLn = coefficient.length;
    if (decimalIndex < 0) {
      coefficient = "0." + repeat("0", Math.abs(decimalIndex)) + coefficient;
    } else if (decimalIndex >= coffiecientLn) {
      coefficient = coefficient + repeat("0", decimalIndex - coffiecientLn);
    } else {
      coefficient = (coefficient.substring(0, decimalIndex) || "0") + "." + coefficient.substring(decimalIndex);
    }
    return sign + coefficient;
  }
  function roundToPrecision(numStr, scale, fixedDecimalScale) {
    if (["", "-"].indexOf(numStr) !== -1) {
      return numStr;
    }
    var shouldHaveDecimalSeparator = (numStr.indexOf(".") !== -1 || fixedDecimalScale) && scale;
    var ref = splitDecimal(numStr);
    var beforeDecimal = ref.beforeDecimal;
    var afterDecimal = ref.afterDecimal;
    var hasNegation = ref.hasNegation;
    var floatValue = parseFloat("0." + (afterDecimal || "0"));
    var floatValueStr = afterDecimal.length <= scale ? "0." + afterDecimal : floatValue.toFixed(scale);
    var roundedDecimalParts = floatValueStr.split(".");
    var intPart = beforeDecimal;
    if (beforeDecimal && Number(roundedDecimalParts[0])) {
      intPart = beforeDecimal.split("").reverse().reduce(function(roundedStr, current, idx) {
        if (roundedStr.length > idx) {
          return (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length);
        }
        return current + roundedStr;
      }, roundedDecimalParts[0]);
    }
    var decimalPart = limitToScale(roundedDecimalParts[1] || "", scale, fixedDecimalScale);
    var negation = hasNegation ? "-" : "";
    var decimalSeparator = shouldHaveDecimalSeparator ? "." : "";
    return "" + negation + intPart + decimalSeparator + decimalPart;
  }
  function setCaretPosition(el, caretPos) {
    el.value = el.value;
    if (el !== null) {
      if (el.createTextRange) {
        var range = el.createTextRange();
        range.move("character", caretPos);
        range.select();
        return true;
      }
      if (el.selectionStart || el.selectionStart === 0) {
        el.focus();
        el.setSelectionRange(caretPos, caretPos);
        return true;
      }
      el.focus();
      return false;
    }
  }
  var findChangeRange = memoizeOnce(function(prevValue, newValue) {
    var i = 0, j = 0;
    var prevLength = prevValue.length;
    var newLength = newValue.length;
    while (prevValue[i] === newValue[i] && i < prevLength) {
      i++;
    }
    while (prevValue[prevLength - 1 - j] === newValue[newLength - 1 - j] && newLength - j > i && prevLength - j > i) {
      j++;
    }
    return {
      from: { start: i, end: prevLength - j },
      to: { start: i, end: newLength - j }
    };
  });
  var findChangedRangeFromCaretPositions = function(lastCaretPositions, currentCaretPosition) {
    var startPosition = Math.min(lastCaretPositions.selectionStart, currentCaretPosition);
    return {
      from: { start: startPosition, end: lastCaretPositions.selectionEnd },
      to: { start: startPosition, end: currentCaretPosition }
    };
  };
  function clamp3(num, min2, max2) {
    return Math.min(Math.max(num, min2), max2);
  }
  function geInputCaretPosition(el) {
    return Math.max(el.selectionStart, el.selectionEnd);
  }
  function addInputMode() {
    return typeof navigator !== "undefined" && !(navigator.platform && /iPhone|iPod/.test(navigator.platform));
  }
  function getDefaultChangeMeta(value) {
    return {
      from: {
        start: 0,
        end: 0
      },
      to: {
        start: 0,
        end: value.length
      },
      lastValue: ""
    };
  }
  function defaultIsCharacterSame(ref) {
    var currentValue = ref.currentValue;
    var formattedValue = ref.formattedValue;
    var currentValueIndex = ref.currentValueIndex;
    var formattedValueIndex = ref.formattedValueIndex;
    return currentValue[currentValueIndex] === formattedValue[formattedValueIndex];
  }
  function getCaretPosition(newFormattedValue, lastFormattedValue, curValue, curCaretPos, boundary, isValidInputCharacter, isCharacterSame) {
    if (isCharacterSame === void 0)
      isCharacterSame = defaultIsCharacterSame;
    var firstAllowedPosition = boundary.findIndex(function(b) {
      return b;
    });
    var prefixFormat = newFormattedValue.slice(0, firstAllowedPosition);
    if (!lastFormattedValue && !curValue.startsWith(prefixFormat)) {
      lastFormattedValue = prefixFormat;
      curValue = prefixFormat + curValue;
      curCaretPos = curCaretPos + prefixFormat.length;
    }
    var curValLn = curValue.length;
    var formattedValueLn = newFormattedValue.length;
    var addedIndexMap = {};
    var indexMap = new Array(curValLn);
    for (var i = 0; i < curValLn; i++) {
      indexMap[i] = -1;
      for (var j = 0, jLn = formattedValueLn; j < jLn; j++) {
        var isCharSame = isCharacterSame({
          currentValue: curValue,
          lastValue: lastFormattedValue,
          formattedValue: newFormattedValue,
          currentValueIndex: i,
          formattedValueIndex: j
        });
        if (isCharSame && addedIndexMap[j] !== true) {
          indexMap[i] = j;
          addedIndexMap[j] = true;
          break;
        }
      }
    }
    var pos = curCaretPos;
    while (pos < curValLn && (indexMap[pos] === -1 || !isValidInputCharacter(curValue[pos]))) {
      pos++;
    }
    var endIndex = pos === curValLn || indexMap[pos] === -1 ? formattedValueLn : indexMap[pos];
    pos = curCaretPos - 1;
    while (pos > 0 && indexMap[pos] === -1) {
      pos--;
    }
    var startIndex = pos === -1 || indexMap[pos] === -1 ? 0 : indexMap[pos] + 1;
    if (startIndex > endIndex) {
      return endIndex;
    }
    return curCaretPos - startIndex < endIndex - curCaretPos ? startIndex : endIndex;
  }
  function getCaretPosInBoundary(value, caretPos, boundary, direction) {
    var valLn = value.length;
    caretPos = clamp3(caretPos, 0, valLn);
    if (direction === "left") {
      while (caretPos >= 0 && !boundary[caretPos]) {
        caretPos--;
      }
      if (caretPos === -1) {
        caretPos = boundary.indexOf(true);
      }
    } else {
      while (caretPos <= valLn && !boundary[caretPos]) {
        caretPos++;
      }
      if (caretPos > valLn) {
        caretPos = boundary.lastIndexOf(true);
      }
    }
    if (caretPos === -1) {
      caretPos = valLn;
    }
    return caretPos;
  }
  function caretUnknownFormatBoundary(formattedValue) {
    var boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(function() {
      return true;
    });
    for (var i = 0, ln = boundaryAry.length; i < ln; i++) {
      boundaryAry[i] = Boolean(charIsNumber(formattedValue[i]) || charIsNumber(formattedValue[i - 1]));
    }
    return boundaryAry;
  }
  function useInternalValues(value, defaultValue, valueIsNumericString, format2, removeFormatting2, onValueChange) {
    if (onValueChange === void 0)
      onValueChange = noop2;
    var getValues = usePersistentCallback(function(value2, valueIsNumericString2) {
      var formattedValue, numAsString;
      if (isNotValidValue(value2)) {
        numAsString = "";
        formattedValue = "";
      } else if (typeof value2 === "number" || valueIsNumericString2) {
        numAsString = typeof value2 === "number" ? toNumericString(value2) : value2;
        formattedValue = format2(numAsString);
      } else {
        numAsString = removeFormatting2(value2, void 0);
        formattedValue = format2(numAsString);
      }
      return { formattedValue, numAsString };
    });
    var ref = React10.useState(function() {
      return getValues(isNil(value) ? defaultValue : value, valueIsNumericString);
    });
    var values2 = ref[0];
    var setValues = ref[1];
    var _onValueChange = function(newValues2, sourceInfo) {
      if (newValues2.formattedValue !== values2.formattedValue) {
        setValues({
          formattedValue: newValues2.formattedValue,
          numAsString: newValues2.value
        });
      }
      onValueChange(newValues2, sourceInfo);
    };
    var _value = value;
    var _valueIsNumericString = valueIsNumericString;
    if (isNil(value)) {
      _value = values2.numAsString;
      _valueIsNumericString = true;
    }
    var newValues = getValues(_value, _valueIsNumericString);
    React10.useMemo(function() {
      setValues(newValues);
    }, [newValues.formattedValue]);
    return [values2, _onValueChange];
  }
  function defaultRemoveFormatting(value) {
    return value.replace(/[^0-9]/g, "");
  }
  function defaultFormat(value) {
    return value;
  }
  function NumberFormatBase(props) {
    var type = props.type;
    if (type === void 0)
      type = "text";
    var displayType = props.displayType;
    if (displayType === void 0)
      displayType = "input";
    var customInput = props.customInput;
    var renderText = props.renderText;
    var getInputRef = props.getInputRef;
    var format2 = props.format;
    if (format2 === void 0)
      format2 = defaultFormat;
    var removeFormatting2 = props.removeFormatting;
    if (removeFormatting2 === void 0)
      removeFormatting2 = defaultRemoveFormatting;
    var defaultValue = props.defaultValue;
    var valueIsNumericString = props.valueIsNumericString;
    var onValueChange = props.onValueChange;
    var isAllowed = props.isAllowed;
    var onChange = props.onChange;
    if (onChange === void 0)
      onChange = noop2;
    var onKeyDown = props.onKeyDown;
    if (onKeyDown === void 0)
      onKeyDown = noop2;
    var onMouseUp = props.onMouseUp;
    if (onMouseUp === void 0)
      onMouseUp = noop2;
    var onFocus = props.onFocus;
    if (onFocus === void 0)
      onFocus = noop2;
    var onBlur = props.onBlur;
    if (onBlur === void 0)
      onBlur = noop2;
    var propValue = props.value;
    var getCaretBoundary2 = props.getCaretBoundary;
    if (getCaretBoundary2 === void 0)
      getCaretBoundary2 = caretUnknownFormatBoundary;
    var isValidInputCharacter = props.isValidInputCharacter;
    if (isValidInputCharacter === void 0)
      isValidInputCharacter = charIsNumber;
    var isCharacterSame = props.isCharacterSame;
    var otherProps = __rest2(props, ["type", "displayType", "customInput", "renderText", "getInputRef", "format", "removeFormatting", "defaultValue", "valueIsNumericString", "onValueChange", "isAllowed", "onChange", "onKeyDown", "onMouseUp", "onFocus", "onBlur", "value", "getCaretBoundary", "isValidInputCharacter", "isCharacterSame"]);
    var ref = useInternalValues(propValue, defaultValue, Boolean(valueIsNumericString), format2, removeFormatting2, onValueChange);
    var ref_0 = ref[0];
    var formattedValue = ref_0.formattedValue;
    var numAsString = ref_0.numAsString;
    var onFormattedValueChange = ref[1];
    var caretPositionBeforeChange = React10.useRef();
    var lastUpdatedValue = React10.useRef({ formattedValue, numAsString });
    var _onValueChange = function(values2, source) {
      lastUpdatedValue.current = { formattedValue: values2.formattedValue, numAsString: values2.value };
      onFormattedValueChange(values2, source);
    };
    var ref$1 = React10.useState(false);
    var mounted = ref$1[0];
    var setMounted = ref$1[1];
    var focusedElm = React10.useRef(null);
    var timeout = React10.useRef({
      setCaretTimeout: null,
      focusTimeout: null
    });
    React10.useEffect(function() {
      setMounted(true);
      return function() {
        clearTimeout(timeout.current.setCaretTimeout);
        clearTimeout(timeout.current.focusTimeout);
      };
    }, []);
    var _format = format2;
    var getValueObject = function(formattedValue2, numAsString2) {
      var floatValue = parseFloat(numAsString2);
      return {
        formattedValue: formattedValue2,
        value: numAsString2,
        floatValue: isNaN(floatValue) ? void 0 : floatValue
      };
    };
    var setPatchedCaretPosition = function(el, caretPos, currentValue) {
      if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
        return;
      }
      setCaretPosition(el, caretPos);
      timeout.current.setCaretTimeout = setTimeout(function() {
        if (el.value === currentValue && el.selectionStart !== caretPos) {
          setCaretPosition(el, caretPos);
        }
      }, 0);
    };
    var correctCaretPosition = function(value, caretPos, direction) {
      return getCaretPosInBoundary(value, caretPos, getCaretBoundary2(value), direction);
    };
    var getNewCaretPosition = function(inputValue, newFormattedValue, caretPos) {
      var caretBoundary = getCaretBoundary2(newFormattedValue);
      var updatedCaretPos = getCaretPosition(newFormattedValue, formattedValue, inputValue, caretPos, caretBoundary, isValidInputCharacter, isCharacterSame);
      updatedCaretPos = getCaretPosInBoundary(newFormattedValue, updatedCaretPos, caretBoundary);
      return updatedCaretPos;
    };
    var updateValueAndCaretPosition = function(params) {
      var newFormattedValue = params.formattedValue;
      if (newFormattedValue === void 0)
        newFormattedValue = "";
      var input = params.input;
      var source = params.source;
      var event = params.event;
      var numAsString2 = params.numAsString;
      var caretPos;
      if (input) {
        var inputValue = params.inputValue || input.value;
        var currentCaretPosition2 = geInputCaretPosition(input);
        input.value = newFormattedValue;
        caretPos = getNewCaretPosition(inputValue, newFormattedValue, currentCaretPosition2);
        if (caretPos !== void 0) {
          setPatchedCaretPosition(input, caretPos, newFormattedValue);
        }
      }
      if (newFormattedValue !== formattedValue) {
        _onValueChange(getValueObject(newFormattedValue, numAsString2), { event, source });
      }
    };
    React10.useEffect(function() {
      var ref2 = lastUpdatedValue.current;
      var lastFormattedValue = ref2.formattedValue;
      var lastNumAsString = ref2.numAsString;
      if (formattedValue !== lastFormattedValue || numAsString !== lastNumAsString) {
        _onValueChange(getValueObject(formattedValue, numAsString), {
          event: void 0,
          source: SourceType.props
        });
      }
    }, [formattedValue, numAsString]);
    var currentCaretPosition = focusedElm.current ? geInputCaretPosition(focusedElm.current) : void 0;
    var useIsomorphicLayoutEffect2 = typeof window !== "undefined" ? React10.useLayoutEffect : React10.useEffect;
    useIsomorphicLayoutEffect2(function() {
      var input = focusedElm.current;
      if (formattedValue !== lastUpdatedValue.current.formattedValue && input) {
        var caretPos = getNewCaretPosition(lastUpdatedValue.current.formattedValue, formattedValue, currentCaretPosition);
        input.value = formattedValue;
        setPatchedCaretPosition(input, caretPos, formattedValue);
      }
    }, [formattedValue]);
    var formatInputValue = function(inputValue, event, source) {
      var input = event.target;
      var changeRange = caretPositionBeforeChange.current ? findChangedRangeFromCaretPositions(caretPositionBeforeChange.current, input.selectionEnd) : findChangeRange(formattedValue, inputValue);
      var changeMeta = Object.assign(Object.assign({}, changeRange), { lastValue: formattedValue });
      var _numAsString = removeFormatting2(inputValue, changeMeta);
      var _formattedValue = _format(_numAsString);
      _numAsString = removeFormatting2(_formattedValue, void 0);
      if (isAllowed && !isAllowed(getValueObject(_formattedValue, _numAsString))) {
        var input$1 = event.target;
        var currentCaretPosition2 = geInputCaretPosition(input$1);
        var caretPos = getNewCaretPosition(inputValue, formattedValue, currentCaretPosition2);
        input$1.value = formattedValue;
        setPatchedCaretPosition(input$1, caretPos, formattedValue);
        return false;
      }
      updateValueAndCaretPosition({
        formattedValue: _formattedValue,
        numAsString: _numAsString,
        inputValue,
        event,
        source,
        input: event.target
      });
      return true;
    };
    var setCaretPositionInfoBeforeChange = function(el, endOffset) {
      if (endOffset === void 0)
        endOffset = 0;
      var selectionStart = el.selectionStart;
      var selectionEnd = el.selectionEnd;
      caretPositionBeforeChange.current = { selectionStart, selectionEnd: selectionEnd + endOffset };
    };
    var _onChange = function(e) {
      var el = e.target;
      var inputValue = el.value;
      var changed = formatInputValue(inputValue, e, SourceType.event);
      if (changed) {
        onChange(e);
      }
      caretPositionBeforeChange.current = void 0;
    };
    var _onKeyDown = function(e) {
      var el = e.target;
      var key = e.key;
      var selectionStart = el.selectionStart;
      var selectionEnd = el.selectionEnd;
      var value = el.value;
      if (value === void 0)
        value = "";
      var expectedCaretPosition;
      if (key === "ArrowLeft" || key === "Backspace") {
        expectedCaretPosition = Math.max(selectionStart - 1, 0);
      } else if (key === "ArrowRight") {
        expectedCaretPosition = Math.min(selectionStart + 1, value.length);
      } else if (key === "Delete") {
        expectedCaretPosition = selectionStart;
      }
      var endOffset = 0;
      if (key === "Delete" && selectionStart === selectionEnd) {
        endOffset = 1;
      }
      var isArrowKey = key === "ArrowLeft" || key === "ArrowRight";
      if (expectedCaretPosition === void 0 || selectionStart !== selectionEnd && !isArrowKey) {
        onKeyDown(e);
        setCaretPositionInfoBeforeChange(el, endOffset);
        return;
      }
      var newCaretPosition = expectedCaretPosition;
      if (isArrowKey) {
        var direction = key === "ArrowLeft" ? "left" : "right";
        newCaretPosition = correctCaretPosition(value, expectedCaretPosition, direction);
        if (newCaretPosition !== expectedCaretPosition) {
          e.preventDefault();
        }
      } else if (key === "Delete" && !isValidInputCharacter(value[expectedCaretPosition])) {
        newCaretPosition = correctCaretPosition(value, expectedCaretPosition, "right");
      } else if (key === "Backspace" && !isValidInputCharacter(value[expectedCaretPosition])) {
        newCaretPosition = correctCaretPosition(value, expectedCaretPosition, "left");
      }
      if (newCaretPosition !== expectedCaretPosition) {
        setPatchedCaretPosition(el, newCaretPosition, value);
      }
      onKeyDown(e);
      setCaretPositionInfoBeforeChange(el, endOffset);
    };
    var _onMouseUp = function(e) {
      var el = e.target;
      var correctCaretPositionIfRequired = function() {
        var selectionStart = el.selectionStart;
        var selectionEnd = el.selectionEnd;
        var value = el.value;
        if (value === void 0)
          value = "";
        if (selectionStart === selectionEnd) {
          var caretPosition = correctCaretPosition(value, selectionStart);
          if (caretPosition !== selectionStart) {
            setPatchedCaretPosition(el, caretPosition, value);
          }
        }
      };
      correctCaretPositionIfRequired();
      requestAnimationFrame(function() {
        correctCaretPositionIfRequired();
      });
      onMouseUp(e);
      setCaretPositionInfoBeforeChange(el);
    };
    var _onFocus = function(e) {
      if (e.persist) {
        e.persist();
      }
      var el = e.target;
      var currentTarget = e.currentTarget;
      focusedElm.current = el;
      timeout.current.focusTimeout = setTimeout(function() {
        var selectionStart = el.selectionStart;
        var selectionEnd = el.selectionEnd;
        var value = el.value;
        if (value === void 0)
          value = "";
        var caretPosition = correctCaretPosition(value, selectionStart);
        if (caretPosition !== selectionStart && !(selectionStart === 0 && selectionEnd === value.length)) {
          setPatchedCaretPosition(el, caretPosition, value);
        }
        onFocus(Object.assign(Object.assign({}, e), { currentTarget }));
      }, 0);
    };
    var _onBlur = function(e) {
      focusedElm.current = null;
      clearTimeout(timeout.current.focusTimeout);
      clearTimeout(timeout.current.setCaretTimeout);
      onBlur(e);
    };
    var inputMode = mounted && addInputMode() ? "numeric" : void 0;
    var inputProps = Object.assign({ inputMode }, otherProps, {
      type,
      value: formattedValue,
      onChange: _onChange,
      onKeyDown: _onKeyDown,
      onMouseUp: _onMouseUp,
      onFocus: _onFocus,
      onBlur: _onBlur
    });
    if (displayType === "text") {
      return renderText ? React10.createElement(React10.Fragment, null, renderText(formattedValue, otherProps) || null) : React10.createElement("span", Object.assign({}, otherProps, { ref: getInputRef }), formattedValue);
    } else if (customInput) {
      var CustomInput = customInput;
      return React10.createElement(CustomInput, Object.assign({}, inputProps, { ref: getInputRef }));
    }
    return React10.createElement("input", Object.assign({}, inputProps, { ref: getInputRef }));
  }
  function format(numStr, props) {
    var decimalScale = props.decimalScale;
    var fixedDecimalScale = props.fixedDecimalScale;
    var prefix = props.prefix;
    if (prefix === void 0)
      prefix = "";
    var suffix = props.suffix;
    if (suffix === void 0)
      suffix = "";
    var allowNegative = props.allowNegative;
    var thousandsGroupStyle = props.thousandsGroupStyle;
    if (thousandsGroupStyle === void 0)
      thousandsGroupStyle = "thousand";
    if (numStr === "" || numStr === "-") {
      return numStr;
    }
    var ref = getSeparators(props);
    var thousandSeparator = ref.thousandSeparator;
    var decimalSeparator = ref.decimalSeparator;
    var hasDecimalSeparator = decimalScale !== 0 && numStr.indexOf(".") !== -1 || decimalScale && fixedDecimalScale;
    var ref$1 = splitDecimal(numStr, allowNegative);
    var beforeDecimal = ref$1.beforeDecimal;
    var afterDecimal = ref$1.afterDecimal;
    var addNegation = ref$1.addNegation;
    if (decimalScale !== void 0) {
      afterDecimal = limitToScale(afterDecimal, decimalScale, !!fixedDecimalScale);
    }
    if (thousandSeparator) {
      beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator, thousandsGroupStyle);
    }
    if (prefix) {
      beforeDecimal = prefix + beforeDecimal;
    }
    if (suffix) {
      afterDecimal = afterDecimal + suffix;
    }
    if (addNegation) {
      beforeDecimal = "-" + beforeDecimal;
    }
    numStr = beforeDecimal + (hasDecimalSeparator && decimalSeparator || "") + afterDecimal;
    return numStr;
  }
  function getSeparators(props) {
    var decimalSeparator = props.decimalSeparator;
    if (decimalSeparator === void 0)
      decimalSeparator = ".";
    var thousandSeparator = props.thousandSeparator;
    var allowedDecimalSeparators = props.allowedDecimalSeparators;
    if (thousandSeparator === true) {
      thousandSeparator = ",";
    }
    if (!allowedDecimalSeparators) {
      allowedDecimalSeparators = [decimalSeparator, "."];
    }
    return {
      decimalSeparator,
      thousandSeparator,
      allowedDecimalSeparators
    };
  }
  function handleNegation(value, allowNegative) {
    if (value === void 0)
      value = "";
    var negationRegex = new RegExp("(-)");
    var doubleNegationRegex = new RegExp("(-)(.)*(-)");
    var hasNegation = negationRegex.test(value);
    var removeNegation = doubleNegationRegex.test(value);
    value = value.replace(/-/g, "");
    if (hasNegation && !removeNegation && allowNegative) {
      value = "-" + value;
    }
    return value;
  }
  function getNumberRegex(decimalSeparator, global) {
    return new RegExp("(^-)|[0-9]|" + escapeRegExp(decimalSeparator), "g" );
  }
  function isNumericString(val, prefix, suffix) {
    if (val === "") {
      return true;
    }
    return !(prefix === null || prefix === void 0 ? void 0 : prefix.match(/\d/)) && !(suffix === null || suffix === void 0 ? void 0 : suffix.match(/\d/)) && typeof val === "string" && !isNaN(Number(val));
  }
  function removeFormatting(value, changeMeta, props) {
    var assign;
    if (changeMeta === void 0)
      changeMeta = getDefaultChangeMeta(value);
    var allowNegative = props.allowNegative;
    var prefix = props.prefix;
    if (prefix === void 0)
      prefix = "";
    var suffix = props.suffix;
    if (suffix === void 0)
      suffix = "";
    var decimalScale = props.decimalScale;
    var from = changeMeta.from;
    var to = changeMeta.to;
    var start = to.start;
    var end = to.end;
    var ref = getSeparators(props);
    var allowedDecimalSeparators = ref.allowedDecimalSeparators;
    var decimalSeparator = ref.decimalSeparator;
    var isBeforeDecimalSeparator = value[end] === decimalSeparator;
    if (charIsNumber(value) && (value === prefix || value === suffix) && changeMeta.lastValue === "") {
      return value;
    }
    if (end - start === 1 && allowedDecimalSeparators.indexOf(value[start]) !== -1) {
      var separator = decimalScale === 0 ? "" : decimalSeparator;
      value = value.substring(0, start) + separator + value.substring(start + 1, value.length);
    }
    var stripNegation = function(value2, start2, end2) {
      var hasNegation2 = false;
      var hasDoubleNegation = false;
      if (prefix.startsWith("-")) {
        hasNegation2 = false;
      } else if (value2.startsWith("--")) {
        hasNegation2 = false;
        hasDoubleNegation = true;
      } else if (suffix.startsWith("-") && value2.length === suffix.length) {
        hasNegation2 = false;
      } else if (value2[0] === "-") {
        hasNegation2 = true;
      }
      var charsToRemove = hasNegation2 ? 1 : 0;
      if (hasDoubleNegation) {
        charsToRemove = 2;
      }
      if (charsToRemove) {
        value2 = value2.substring(charsToRemove);
        start2 -= charsToRemove;
        end2 -= charsToRemove;
      }
      return { value: value2, start: start2, end: end2, hasNegation: hasNegation2 };
    };
    var toMetadata = stripNegation(value, start, end);
    var hasNegation = toMetadata.hasNegation;
    assign = toMetadata, value = assign.value, start = assign.start, end = assign.end;
    var ref$1 = stripNegation(changeMeta.lastValue, from.start, from.end);
    var fromStart = ref$1.start;
    var fromEnd = ref$1.end;
    var lastValue = ref$1.value;
    var updatedSuffixPart = value.substring(start, end);
    if (value.length && lastValue.length && (fromStart > lastValue.length - suffix.length || fromEnd < prefix.length) && !(updatedSuffixPart && suffix.startsWith(updatedSuffixPart))) {
      value = lastValue;
    }
    var startIndex = 0;
    if (value.startsWith(prefix)) {
      startIndex += prefix.length;
    } else if (start < prefix.length) {
      startIndex = start;
    }
    value = value.substring(startIndex);
    end -= startIndex;
    var endIndex = value.length;
    var suffixStartIndex = value.length - suffix.length;
    if (value.endsWith(suffix)) {
      endIndex = suffixStartIndex;
    } else if (end > suffixStartIndex) {
      endIndex = end;
    } else if (end > value.length - suffix.length) {
      endIndex = end;
    }
    value = value.substring(0, endIndex);
    value = handleNegation(hasNegation ? "-" + value : value, allowNegative);
    value = (value.match(getNumberRegex(decimalSeparator)) || []).join("");
    var firstIndex = value.indexOf(decimalSeparator);
    value = value.replace(new RegExp(escapeRegExp(decimalSeparator), "g"), function(match, index3) {
      return index3 === firstIndex ? "." : "";
    });
    var ref$2 = splitDecimal(value, allowNegative);
    var beforeDecimal = ref$2.beforeDecimal;
    var afterDecimal = ref$2.afterDecimal;
    var addNegation = ref$2.addNegation;
    if (to.end - to.start < from.end - from.start && beforeDecimal === "" && isBeforeDecimalSeparator && !parseFloat(afterDecimal)) {
      value = addNegation ? "-" : "";
    }
    return value;
  }
  function getCaretBoundary(formattedValue, props) {
    var prefix = props.prefix;
    if (prefix === void 0)
      prefix = "";
    var suffix = props.suffix;
    if (suffix === void 0)
      suffix = "";
    var boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(function() {
      return true;
    });
    var hasNegation = formattedValue[0] === "-";
    boundaryAry.fill(false, 0, prefix.length + (hasNegation ? 1 : 0));
    var valLn = formattedValue.length;
    boundaryAry.fill(false, valLn - suffix.length + 1, valLn + 1);
    return boundaryAry;
  }
  function validateAndUpdateProps(props) {
    var ref = getSeparators(props);
    var thousandSeparator = ref.thousandSeparator;
    var decimalSeparator = ref.decimalSeparator;
    var prefix = props.prefix;
    if (prefix === void 0)
      prefix = "";
    var allowNegative = props.allowNegative;
    if (allowNegative === void 0)
      allowNegative = true;
    if (thousandSeparator === decimalSeparator) {
      throw new Error("\n        Decimal separator can't be same as thousand separator.\n        thousandSeparator: " + thousandSeparator + ' (thousandSeparator = {true} is same as thousandSeparator = ",")\n        decimalSeparator: ' + decimalSeparator + " (default value for decimalSeparator is .)\n     ");
    }
    if (prefix.startsWith("-") && allowNegative) {
      console.error("\n      Prefix can't start with '-' when allowNegative is true.\n      prefix: " + prefix + "\n      allowNegative: " + allowNegative + "\n    ");
      allowNegative = false;
    }
    return Object.assign(Object.assign({}, props), { allowNegative });
  }
  function useNumericFormat(props) {
    props = validateAndUpdateProps(props);
    props.decimalSeparator;
    props.allowedDecimalSeparators;
    props.thousandsGroupStyle;
    var suffix = props.suffix;
    var allowNegative = props.allowNegative;
    var allowLeadingZeros = props.allowLeadingZeros;
    var onKeyDown = props.onKeyDown;
    if (onKeyDown === void 0)
      onKeyDown = noop2;
    var onBlur = props.onBlur;
    if (onBlur === void 0)
      onBlur = noop2;
    var thousandSeparator = props.thousandSeparator;
    var decimalScale = props.decimalScale;
    var fixedDecimalScale = props.fixedDecimalScale;
    var prefix = props.prefix;
    if (prefix === void 0)
      prefix = "";
    var defaultValue = props.defaultValue;
    var value = props.value;
    var valueIsNumericString = props.valueIsNumericString;
    var onValueChange = props.onValueChange;
    var restProps = __rest2(props, ["decimalSeparator", "allowedDecimalSeparators", "thousandsGroupStyle", "suffix", "allowNegative", "allowLeadingZeros", "onKeyDown", "onBlur", "thousandSeparator", "decimalScale", "fixedDecimalScale", "prefix", "defaultValue", "value", "valueIsNumericString", "onValueChange"]);
    var ref = getSeparators(props);
    var decimalSeparator = ref.decimalSeparator;
    var allowedDecimalSeparators = ref.allowedDecimalSeparators;
    var _format = function(numStr) {
      return format(numStr, props);
    };
    var _removeFormatting = function(inputValue, changeMeta) {
      return removeFormatting(inputValue, changeMeta, props);
    };
    var _value = isNil(value) ? defaultValue : value;
    var _valueIsNumericString = valueIsNumericString !== null && valueIsNumericString !== void 0 ? valueIsNumericString : isNumericString(_value, prefix, suffix);
    if (!isNil(value)) {
      _valueIsNumericString = _valueIsNumericString || typeof value === "number";
    } else if (!isNil(defaultValue)) {
      _valueIsNumericString = _valueIsNumericString || typeof defaultValue === "number";
    }
    var roundIncomingValueToPrecision = function(value2) {
      if (isNotValidValue(value2)) {
        return value2;
      }
      if (typeof value2 === "number") {
        value2 = toNumericString(value2);
      }
      if (_valueIsNumericString && typeof decimalScale === "number") {
        return roundToPrecision(value2, decimalScale, Boolean(fixedDecimalScale));
      }
      return value2;
    };
    var ref$1 = useInternalValues(roundIncomingValueToPrecision(value), roundIncomingValueToPrecision(defaultValue), Boolean(_valueIsNumericString), _format, _removeFormatting, onValueChange);
    var ref$1_0 = ref$1[0];
    var numAsString = ref$1_0.numAsString;
    var formattedValue = ref$1_0.formattedValue;
    var _onValueChange = ref$1[1];
    var _onKeyDown = function(e) {
      var el = e.target;
      var key = e.key;
      var selectionStart = el.selectionStart;
      var selectionEnd = el.selectionEnd;
      var value2 = el.value;
      if (value2 === void 0)
        value2 = "";
      if ((key === "Backspace" || key === "Delete") && selectionEnd < prefix.length) {
        e.preventDefault();
        return;
      }
      if (selectionStart !== selectionEnd) {
        onKeyDown(e);
        return;
      }
      if (key === "Backspace" && value2[0] === "-" && selectionStart === prefix.length + 1 && allowNegative) {
        setCaretPosition(el, 1);
      }
      if (decimalScale && fixedDecimalScale) {
        if (key === "Backspace" && value2[selectionStart - 1] === decimalSeparator) {
          setCaretPosition(el, selectionStart - 1);
          e.preventDefault();
        } else if (key === "Delete" && value2[selectionStart] === decimalSeparator) {
          e.preventDefault();
        }
      }
      if ((allowedDecimalSeparators === null || allowedDecimalSeparators === void 0 ? void 0 : allowedDecimalSeparators.includes(key)) && value2[selectionStart] === decimalSeparator) {
        setCaretPosition(el, selectionStart + 1);
      }
      var _thousandSeparator = thousandSeparator === true ? "," : thousandSeparator;
      if (key === "Backspace" && value2[selectionStart - 1] === _thousandSeparator) {
        setCaretPosition(el, selectionStart - 1);
      }
      if (key === "Delete" && value2[selectionStart] === _thousandSeparator) {
        setCaretPosition(el, selectionStart + 1);
      }
      onKeyDown(e);
    };
    var _onBlur = function(e) {
      var _value2 = numAsString;
      if (!_value2.match(/\d/g)) {
        _value2 = "";
      }
      if (!allowLeadingZeros) {
        _value2 = fixLeadingZero(_value2);
      }
      if (fixedDecimalScale && decimalScale) {
        _value2 = roundToPrecision(_value2, decimalScale, fixedDecimalScale);
      }
      if (_value2 !== numAsString) {
        var formattedValue2 = format(_value2, props);
        _onValueChange({
          formattedValue: formattedValue2,
          value: _value2,
          floatValue: parseFloat(_value2)
        }, {
          event: e,
          source: SourceType.event
        });
      }
      onBlur(e);
    };
    var isValidInputCharacter = function(inputChar) {
      if (inputChar === decimalSeparator) {
        return true;
      }
      return charIsNumber(inputChar);
    };
    var isCharacterSame = function(ref2) {
      var currentValue = ref2.currentValue;
      var lastValue = ref2.lastValue;
      var formattedValue2 = ref2.formattedValue;
      var currentValueIndex = ref2.currentValueIndex;
      var formattedValueIndex = ref2.formattedValueIndex;
      var curChar = currentValue[currentValueIndex];
      var newChar = formattedValue2[formattedValueIndex];
      var typedRange = findChangeRange(lastValue, currentValue);
      var to = typedRange.to;
      var getDecimalSeparatorIndex = function(value2) {
        return _removeFormatting(value2).indexOf(".") + prefix.length;
      };
      if (value === 0 && fixedDecimalScale && decimalScale && currentValue[to.start] === decimalSeparator && getDecimalSeparatorIndex(currentValue) < currentValueIndex && getDecimalSeparatorIndex(formattedValue2) > formattedValueIndex) {
        return false;
      }
      if (currentValueIndex >= to.start && currentValueIndex < to.end && allowedDecimalSeparators && allowedDecimalSeparators.includes(curChar) && newChar === decimalSeparator) {
        return true;
      }
      return curChar === newChar;
    };
    return Object.assign(Object.assign({}, restProps), {
      value: formattedValue,
      valueIsNumericString: false,
      isValidInputCharacter,
      isCharacterSame,
      onValueChange: _onValueChange,
      format: _format,
      removeFormatting: _removeFormatting,
      getCaretBoundary: function(formattedValue2) {
        return getCaretBoundary(formattedValue2, props);
      },
      onKeyDown: _onKeyDown,
      onBlur: _onBlur
    });
  }
  function NumericFormat(props) {
    var numericFormatProps = useNumericFormat(props);
    return React10.createElement(NumberFormatBase, Object.assign({}, numericFormatProps));
  }
  var defaultProps135 = {};
  function NumberFormatter(_props) {
    const props = useProps("NumberFormatter", defaultProps135, _props);
    const { value, defaultValue, ...others } = props;
    if (value === void 0) {
      return null;
    }
    return  jsxRuntime.jsx(NumericFormat, { displayType: "text", value, ...others });
  }
  var extendNumberFormatter = (c) => c;
  NumberFormatter.extend = extendNumberFormatter;
  NumberFormatter.displayName = "@mantine/core/NumberFormatter";
  function NumberInputChevron({ direction, style, ...others }) {
    return  jsxRuntime.jsx(
      "svg",
      {
        style: {
          width: "var(--ni-chevron-size)",
          height: "var(--ni-chevron-size)",
          transform: direction === "up" ? "rotate(180deg)" : void 0,
          ...style
        },
        viewBox: "0 0 15 15",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ...others,
        children:  jsxRuntime.jsx(
          "path",
          {
            d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
            fill: "currentColor",
            fillRule: "evenodd",
            clipRule: "evenodd"
          }
        )
      }
    );
  }
  var classes60 = { "root": "m_e2f5cd4e", "controls": "m_95e17d22", "control": "m_80b4b171" };
  var leadingDecimalZeroPattern = /^(0\.0*|-0(\.0*)?)$/;
  var leadingZerosPattern = /^-?0\d+(\.\d+)?\.?$/;
  function isNumberString(value) {
    return typeof value === "string" && value !== "" && !Number.isNaN(Number(value));
  }
  function canIncrement(value) {
    if (typeof value === "number") {
      return value < Number.MAX_SAFE_INTEGER;
    }
    return value === "" || isNumberString(value) && Number(value) < Number.MAX_SAFE_INTEGER;
  }
  function getDecimalPlaces(inputValue) {
    return inputValue.toString().replace(".", "").length;
  }
  function isValidNumber(floatValue, value) {
    return (typeof floatValue === "number" ? floatValue < Number.MAX_SAFE_INTEGER : !Number.isNaN(Number(floatValue))) && !Number.isNaN(floatValue) && getDecimalPlaces(value) < 14 && value !== "";
  }
  function isInRange(value, min2, max2) {
    if (value === void 0) {
      return true;
    }
    const minValid = min2 === void 0 || value >= min2;
    const maxValid = max2 === void 0 || value <= max2;
    return minValid && maxValid;
  }
  var defaultProps136 = {
    step: 1,
    clampBehavior: "blur",
    allowDecimal: true,
    allowNegative: true,
    withKeyboardEvents: true,
    allowLeadingZeros: true,
    trimLeadingZeroesOnBlur: true,
    startValue: 0
  };
  var varsResolver62 = createVarsResolver((_, { size: size4 }) => ({
    controls: {
      "--ni-chevron-size": getSize(size4, "ni-chevron-size")
    }
  }));
  var NumberInput = factory((_props, ref) => {
    const props = useProps("NumberInput", defaultProps136, _props);
    const {
      className,
      classNames,
      styles,
      unstyled,
      vars,
      onChange,
      onValueChange,
      value,
      defaultValue,
      max: max2,
      min: min2,
      step,
      hideControls,
      rightSection,
      isAllowed,
      clampBehavior,
      onBlur,
      allowDecimal,
      decimalScale,
      onKeyDown,
      onKeyDownCapture,
      handlersRef,
      startValue,
      disabled,
      rightSectionPointerEvents,
      allowNegative,
      readOnly,
      size: size4,
      rightSectionWidth,
      stepHoldInterval,
      stepHoldDelay,
      allowLeadingZeros,
      withKeyboardEvents,
      trimLeadingZeroesOnBlur,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "NumberInput",
      classes: classes60,
      props,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver62
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "",
      onChange
    });
    const shouldUseStepInterval = stepHoldDelay !== void 0 && stepHoldInterval !== void 0;
    const inputRef = React10.useRef(null);
    const onStepTimeoutRef = React10.useRef(null);
    const stepCountRef = React10.useRef(0);
    const handleValueChange = (payload, event) => {
      if (event.source === "event") {
        setValue(
          isValidNumber(payload.floatValue, payload.value) && !leadingDecimalZeroPattern.test(payload.value) && !(allowLeadingZeros ? leadingZerosPattern.test(payload.value) : false) ? payload.floatValue : payload.value
        );
      }
      onValueChange?.(payload, event);
    };
    const getDecimalPlaces2 = (inputValue) => {
      const match = String(inputValue).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    };
    const adjustCursor = (position) => {
      if (inputRef.current && typeof position !== "undefined") {
        inputRef.current.setSelectionRange(position, position);
      }
    };
    const incrementRef = React10.useRef(noop);
    incrementRef.current = () => {
      if (!canIncrement(_value)) {
        return;
      }
      let val;
      const currentValuePrecision = getDecimalPlaces2(_value);
      const stepPrecision = getDecimalPlaces2(step);
      const maxPrecision = Math.max(currentValuePrecision, stepPrecision);
      const factor = 10 ** maxPrecision;
      if (!isNumberString(_value) && (typeof _value !== "number" || Number.isNaN(_value))) {
        val = hooks.clamp(startValue, min2, max2);
      } else if (max2 !== void 0) {
        const incrementedValue = (Math.round(Number(_value) * factor) + Math.round(step * factor)) / factor;
        val = incrementedValue <= max2 ? incrementedValue : max2;
      } else {
        val = (Math.round(Number(_value) * factor) + Math.round(step * factor)) / factor;
      }
      const formattedValue = val.toFixed(maxPrecision);
      setValue(parseFloat(formattedValue));
      onValueChange?.(
        { floatValue: parseFloat(formattedValue), formattedValue, value: formattedValue },
        { source: "increment" }
      );
      setTimeout(() => adjustCursor(inputRef.current?.value.length), 0);
    };
    const decrementRef = React10.useRef(noop);
    decrementRef.current = () => {
      if (!canIncrement(_value)) {
        return;
      }
      let val;
      const minValue = min2 !== void 0 ? min2 : !allowNegative ? 0 : Number.MIN_SAFE_INTEGER;
      const currentValuePrecision = getDecimalPlaces2(_value);
      const stepPrecision = getDecimalPlaces2(step);
      const maxPrecision = Math.max(currentValuePrecision, stepPrecision);
      const factor = 10 ** maxPrecision;
      if (!isNumberString(_value) && typeof _value !== "number" || Number.isNaN(_value)) {
        val = hooks.clamp(startValue, minValue, max2);
      } else {
        const decrementedValue = (Math.round(Number(_value) * factor) - Math.round(step * factor)) / factor;
        val = minValue !== void 0 && decrementedValue < minValue ? minValue : decrementedValue;
      }
      const formattedValue = val.toFixed(maxPrecision);
      setValue(parseFloat(formattedValue));
      onValueChange?.(
        { floatValue: parseFloat(formattedValue), formattedValue, value: formattedValue },
        { source: "decrement" }
      );
      setTimeout(() => adjustCursor(inputRef.current?.value.length), 0);
    };
    const handleKeyDown = (event) => {
      onKeyDown?.(event);
      if (readOnly || !withKeyboardEvents) {
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        incrementRef.current();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        decrementRef.current();
      }
    };
    const handleKeyDownCapture = (event) => {
      onKeyDownCapture?.(event);
      if (event.key === "Backspace") {
        const input = inputRef.current;
        if (input.selectionStart === 0 && input.selectionStart === input.selectionEnd) {
          event.preventDefault();
          window.setTimeout(() => adjustCursor(0), 0);
        }
      }
    };
    hooks.assignRef(handlersRef, { increment: incrementRef.current, decrement: decrementRef.current });
    const onStepHandleChange = (isIncrement) => {
      if (isIncrement) {
        incrementRef.current();
      } else {
        decrementRef.current();
      }
      stepCountRef.current += 1;
    };
    const onStepLoop = (isIncrement) => {
      onStepHandleChange(isIncrement);
      if (shouldUseStepInterval) {
        const interval = typeof stepHoldInterval === "number" ? stepHoldInterval : stepHoldInterval(stepCountRef.current);
        onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), interval);
      }
    };
    const onStep = (event, isIncrement) => {
      event.preventDefault();
      inputRef.current?.focus();
      onStepHandleChange(isIncrement);
      if (shouldUseStepInterval) {
        onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), stepHoldDelay);
      }
    };
    const onStepDone = () => {
      if (onStepTimeoutRef.current) {
        window.clearTimeout(onStepTimeoutRef.current);
      }
      onStepTimeoutRef.current = null;
      stepCountRef.current = 0;
    };
    const controls =  jsxRuntime.jsxs("div", { ...getStyles2("controls"), children: [
       jsxRuntime.jsx(
        UnstyledButton,
        {
          ...getStyles2("control"),
          tabIndex: -1,
          "aria-hidden": true,
          disabled: disabled || typeof _value === "number" && max2 !== void 0 && _value >= max2,
          mod: { direction: "up" },
          onMouseDown: (event) => event.preventDefault(),
          onPointerDown: (event) => {
            onStep(event, true);
          },
          onPointerUp: onStepDone,
          onPointerLeave: onStepDone,
          children:  jsxRuntime.jsx(NumberInputChevron, { direction: "up" })
        }
      ),
       jsxRuntime.jsx(
        UnstyledButton,
        {
          ...getStyles2("control"),
          tabIndex: -1,
          "aria-hidden": true,
          disabled: disabled || typeof _value === "number" && min2 !== void 0 && _value <= min2,
          mod: { direction: "down" },
          onMouseDown: (event) => event.preventDefault(),
          onPointerDown: (event) => {
            onStep(event, false);
          },
          onPointerUp: onStepDone,
          onPointerLeave: onStepDone,
          children:  jsxRuntime.jsx(NumberInputChevron, { direction: "down" })
        }
      )
    ] });
    return  jsxRuntime.jsx(
      InputBase,
      {
        component: NumericFormat,
        allowNegative,
        className: clsx_default(classes60.root, className),
        size: size4,
        ...others,
        readOnly,
        disabled,
        value: _value,
        getInputRef: hooks.useMergedRef(ref, inputRef),
        onValueChange: handleValueChange,
        rightSection: hideControls || readOnly || !canIncrement(_value) ? rightSection : rightSection || controls,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        unstyled,
        __staticSelector: "NumberInput",
        decimalScale: allowDecimal ? decimalScale : 0,
        onKeyDown: handleKeyDown,
        onKeyDownCapture: handleKeyDownCapture,
        rightSectionPointerEvents: rightSectionPointerEvents ?? (disabled ? "none" : void 0),
        rightSectionWidth: rightSectionWidth ?? `var(--ni-right-section-width-${size4 || "sm"})`,
        allowLeadingZeros,
        onBlur: (event) => {
          onBlur?.(event);
          if (clampBehavior === "blur" && typeof _value === "number") {
            const clampedValue = hooks.clamp(_value, min2, max2);
            if (clampedValue !== _value) {
              setValue(hooks.clamp(_value, min2, max2));
            }
          }
          if (trimLeadingZeroesOnBlur && typeof _value === "string" && getDecimalPlaces2(_value) < 15) {
            const replaced = _value.replace(/^0+/, "");
            const parsedValue = parseFloat(replaced);
            setValue(
              Number.isNaN(parsedValue) || parsedValue > Number.MAX_SAFE_INTEGER ? replaced : hooks.clamp(parsedValue, min2, max2)
            );
          }
        },
        isAllowed: (val) => {
          if (clampBehavior === "strict") {
            if (isAllowed) {
              return isAllowed(val) && isInRange(val.floatValue, min2, max2);
            }
            return isInRange(val.floatValue, min2, max2);
          }
          return isAllowed ? isAllowed(val) : true;
        }
      }
    );
  });
  NumberInput.classes = { ...InputBase.classes, ...classes60 };
  NumberInput.displayName = "@mantine/core/NumberInput";
  var [PaginationProvider, usePaginationContext] = createSafeContext(
    "Pagination.Root component was not found in tree"
  );
  var classes61 = { "root": "m_4addd315", "control": "m_326d024a", "dots": "m_4ad7767d" };
  var defaultProps137 = {
    withPadding: true
  };
  var PaginationControl = factory((_props, ref) => {
    const props = useProps("PaginationControl", defaultProps137, _props);
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      active,
      disabled,
      withPadding,
      mod,
      ...others
    } = props;
    const ctx = usePaginationContext();
    const _disabled = disabled || ctx.disabled;
    return  jsxRuntime.jsx(
      UnstyledButton,
      {
        ref,
        disabled: _disabled,
        mod: [{ active, disabled: _disabled, "with-padding": withPadding }, mod],
        ...ctx.getStyles("control", { className, style, classNames, styles, active: !_disabled }),
        ...others
      }
    );
  });
  PaginationControl.classes = classes61;
  PaginationControl.displayName = "@mantine/core/PaginationControl";
  function PaginationIcon({ style, children, path, ...others }) {
    return  jsxRuntime.jsx(
      "svg",
      {
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        style: {
          width: "calc(var(--pagination-control-size) / 1.8)",
          height: "calc(var(--pagination-control-size) / 1.8)",
          ...style
        },
        ...others,
        children:  jsxRuntime.jsx("path", { d: path, fill: "currentColor" })
      }
    );
  }
  var PaginationNextIcon = (props) =>  jsxRuntime.jsx(
    PaginationIcon,
    {
      ...props,
      path: "M8.781 8l-3.3-3.3.943-.943L10.667 8l-4.243 4.243-.943-.943 3.3-3.3z"
    }
  );
  var PaginationPreviousIcon = (props) =>  jsxRuntime.jsx(
    PaginationIcon,
    {
      ...props,
      path: "M7.219 8l3.3 3.3-.943.943L5.333 8l4.243-4.243.943.943-3.3 3.3z"
    }
  );
  var PaginationFirstIcon = (props) =>  jsxRuntime.jsx(
    PaginationIcon,
    {
      ...props,
      path: "M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z"
    }
  );
  var PaginationLastIcon = (props) =>  jsxRuntime.jsx(
    PaginationIcon,
    {
      ...props,
      path: "M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z"
    }
  );
  var PaginationDotsIcon = (props) =>  jsxRuntime.jsx(
    PaginationIcon,
    {
      ...props,
      path: "M2 8c0-.733.6-1.333 1.333-1.333.734 0 1.334.6 1.334 1.333s-.6 1.333-1.334 1.333C2.6 9.333 2 8.733 2 8zm9.333 0c0-.733.6-1.333 1.334-1.333C13.4 6.667 14 7.267 14 8s-.6 1.333-1.333 1.333c-.734 0-1.334-.6-1.334-1.333zM6.667 8c0-.733.6-1.333 1.333-1.333s1.333.6 1.333 1.333S8.733 9.333 8 9.333 6.667 8.733 6.667 8z"
    }
  );
  var defaultProps138 = {
    icon: PaginationDotsIcon
  };
  var PaginationDots = factory((_props, ref) => {
    const props = useProps("PaginationDots", defaultProps138, _props);
    const { classNames, className, style, styles, vars, icon, ...others } = props;
    const ctx = usePaginationContext();
    const Icon = icon;
    return  jsxRuntime.jsx(Box, { ref, ...ctx.getStyles("dots", { className, style, styles, classNames }), ...others, children:  jsxRuntime.jsx(
      Icon,
      {
        style: {
          width: "calc(var(--pagination-control-size) / 1.8)",
          height: "calc(var(--pagination-control-size) / 1.8)"
        }
      }
    ) });
  });
  PaginationDots.classes = classes61;
  PaginationDots.displayName = "@mantine/core/PaginationDots";
  function createEdgeComponent({ icon, name, action, type }) {
    const defaultProps184 = { icon };
    const Component = React10.forwardRef((props, ref) => {
      const { icon: _icon, ...others } = useProps(name, defaultProps184, props);
      const Icon = _icon;
      const ctx = usePaginationContext();
      const disabled = type === "next" ? ctx.active === ctx.total : ctx.active === 1;
      return  jsxRuntime.jsx(
        PaginationControl,
        {
          disabled: ctx.disabled || disabled,
          ref,
          onClick: ctx[action],
          withPadding: false,
          ...others,
          children:  jsxRuntime.jsx(
            Icon,
            {
              className: "mantine-rotate-rtl",
              style: {
                width: "calc(var(--pagination-control-size) / 1.8)",
                height: "calc(var(--pagination-control-size) / 1.8)"
              }
            }
          )
        }
      );
    });
    Component.displayName = `@mantine/core/${name}`;
    return createPolymorphicComponent(Component);
  }
  var PaginationNext = createEdgeComponent({
    icon: PaginationNextIcon,
    name: "PaginationNext",
    action: "onNext",
    type: "next"
  });
  var PaginationPrevious = createEdgeComponent({
    icon: PaginationPreviousIcon,
    name: "PaginationPrevious",
    action: "onPrevious",
    type: "previous"
  });
  var PaginationFirst = createEdgeComponent({
    icon: PaginationFirstIcon,
    name: "PaginationFirst",
    action: "onFirst",
    type: "previous"
  });
  var PaginationLast = createEdgeComponent({
    icon: PaginationLastIcon,
    name: "PaginationLast",
    action: "onLast",
    type: "next"
  });
  function PaginationItems({ dotsIcon }) {
    const ctx = usePaginationContext();
    const items = ctx.range.map((page, index3) => {
      if (page === "dots") {
        return  jsxRuntime.jsx(PaginationDots, { icon: dotsIcon }, index3);
      }
      return  jsxRuntime.jsx(
        PaginationControl,
        {
          active: page === ctx.active,
          "aria-current": page === ctx.active ? "page" : void 0,
          onClick: () => ctx.onChange(page),
          disabled: ctx.disabled,
          ...ctx.getItemProps?.(page),
          children: ctx.getItemProps?.(page)?.children ?? page
        },
        index3
      );
    });
    return  jsxRuntime.jsx(jsxRuntime.Fragment, { children: items });
  }
  PaginationItems.displayName = "@mantine/core/PaginationItems";
  var defaultProps139 = {
    siblings: 1,
    boundaries: 1
  };
  var varsResolver63 = createVarsResolver(
    (theme, { size: size4, radius, color, autoContrast }) => ({
      root: {
        "--pagination-control-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--pagination-control-size": getSize(size4, "pagination-control-size"),
        "--pagination-control-fz": getFontSize(size4),
        "--pagination-active-bg": color ? getThemeColor(color, theme) : void 0,
        "--pagination-active-color": getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
      }
    })
  );
  var PaginationRoot = factory((_props, ref) => {
    const props = useProps("PaginationRoot", defaultProps139, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      total,
      value,
      defaultValue,
      onChange,
      disabled,
      siblings,
      boundaries,
      color,
      radius,
      onNextPage,
      onPreviousPage,
      onFirstPage,
      onLastPage,
      getItemProps,
      autoContrast,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Pagination",
      classes: classes61,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver63
    });
    const { range, setPage, next, previous, active, first, last } = hooks.usePagination({
      page: value,
      initialPage: defaultValue,
      onChange,
      total,
      siblings,
      boundaries
    });
    const handleNextPage = createEventHandler(onNextPage, next);
    const handlePreviousPage = createEventHandler(onPreviousPage, previous);
    const handleFirstPage = createEventHandler(onFirstPage, first);
    const handleLastPage = createEventHandler(onLastPage, last);
    return  jsxRuntime.jsx(
      PaginationProvider,
      {
        value: {
          total,
          range,
          active,
          disabled,
          getItemProps,
          onChange: setPage,
          onNext: handleNextPage,
          onPrevious: handlePreviousPage,
          onFirst: handleFirstPage,
          onLast: handleLastPage,
          getStyles: getStyles2
        },
        children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others })
      }
    );
  });
  PaginationRoot.classes = classes61;
  PaginationRoot.displayName = "@mantine/core/PaginationRoot";
  var defaultProps140 = {
    withControls: true,
    siblings: 1,
    boundaries: 1,
    gap: 8
  };
  var Pagination = factory((_props, ref) => {
    const props = useProps("Pagination", defaultProps140, _props);
    const {
      withEdges,
      withControls,
      getControlProps,
      nextIcon,
      previousIcon,
      lastIcon,
      firstIcon,
      dotsIcon,
      total,
      gap,
      hideWithOnePage,
      ...others
    } = props;
    if (total <= 0 || hideWithOnePage && total === 1) {
      return null;
    }
    return  jsxRuntime.jsx(PaginationRoot, { ref, total, ...others, children:  jsxRuntime.jsxs(Group, { gap, children: [
      withEdges &&  jsxRuntime.jsx(PaginationFirst, { icon: firstIcon, ...getControlProps?.("first") }),
      withControls &&  jsxRuntime.jsx(PaginationPrevious, { icon: previousIcon, ...getControlProps?.("previous") }),
       jsxRuntime.jsx(PaginationItems, { dotsIcon }),
      withControls &&  jsxRuntime.jsx(PaginationNext, { icon: nextIcon, ...getControlProps?.("next") }),
      withEdges &&  jsxRuntime.jsx(PaginationLast, { icon: lastIcon, ...getControlProps?.("last") })
    ] }) });
  });
  Pagination.classes = classes61;
  Pagination.displayName = "@mantine/core/Pagination";
  Pagination.Root = PaginationRoot;
  Pagination.Control = PaginationControl;
  Pagination.Dots = PaginationDots;
  Pagination.First = PaginationFirst;
  Pagination.Last = PaginationLast;
  Pagination.Next = PaginationNext;
  Pagination.Previous = PaginationPrevious;
  Pagination.Items = PaginationItems;
  var PasswordToggleIcon = ({
    reveal
  }) =>  jsxRuntime.jsx(
    "svg",
    {
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { width: "var(--psi-icon-size)", height: "var(--psi-icon-size)" },
      children:  jsxRuntime.jsx(
        "path",
        {
          d: reveal ? "M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z" : "M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z",
          fill: "currentColor",
          fillRule: "evenodd",
          clipRule: "evenodd"
        }
      )
    }
  );
  var classes62 = { "root": "m_f61ca620", "input": "m_ccf8da4c", "innerInput": "m_f2d85dd2", "visibilityToggle": "m_b1072d44" };
  var defaultProps141 = {
    visibilityToggleIcon: PasswordToggleIcon
  };
  var varsResolver64 = createVarsResolver((_, { size: size4 }) => ({
    root: {
      "--psi-icon-size": getSize(size4, "psi-icon-size"),
      "--psi-button-size": getSize(size4, "psi-button-size")
    }
  }));
  var PasswordInput = factory((_props, ref) => {
    const props = useProps("PasswordInput", defaultProps141, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      required,
      error: error2,
      leftSection,
      disabled,
      id,
      variant,
      inputContainer,
      description,
      label,
      size: size4,
      errorProps,
      descriptionProps,
      labelProps,
      withAsterisk,
      inputWrapperOrder,
      wrapperProps,
      radius,
      rightSection,
      rightSectionWidth,
      rightSectionPointerEvents,
      leftSectionWidth,
      visible,
      defaultVisible,
      onVisibilityChange,
      visibilityToggleIcon,
      visibilityToggleButtonProps,
      rightSectionProps,
      leftSectionProps,
      leftSectionPointerEvents,
      withErrorStyles,
      mod,
      ...others
    } = props;
    const uuid = hooks.useId(id);
    const [_visible, setVisibility] = hooks.useUncontrolled({
      value: visible,
      defaultValue: defaultVisible,
      finalValue: false,
      onChange: onVisibilityChange
    });
    const toggleVisibility = () => setVisibility(!_visible);
    const getStyles2 = useStyles({
      name: "PasswordInput",
      classes: classes62,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver64
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const { styleProps, rest } = extractStyleProps(others);
    const VisibilityToggleIcon = visibilityToggleIcon;
    const visibilityToggleButton =  jsxRuntime.jsx(
      ActionIcon,
      {
        ...getStyles2("visibilityToggle"),
        disabled,
        radius,
        "aria-hidden": !visibilityToggleButtonProps,
        tabIndex: -1,
        ...visibilityToggleButtonProps,
        variant: visibilityToggleButtonProps?.variant ?? "subtle",
        color: "gray",
        unstyled,
        onTouchEnd: (event) => {
          event.preventDefault();
          visibilityToggleButtonProps?.onTouchEnd?.(event);
          toggleVisibility();
        },
        onMouseDown: (event) => {
          event.preventDefault();
          visibilityToggleButtonProps?.onMouseDown?.(event);
          toggleVisibility();
        },
        onKeyDown: (event) => {
          visibilityToggleButtonProps?.onKeyDown?.(event);
          if (event.key === " ") {
            event.preventDefault();
            toggleVisibility();
          }
        },
        children:  jsxRuntime.jsx(VisibilityToggleIcon, { reveal: _visible })
      }
    );
    return  jsxRuntime.jsx(
      Input.Wrapper,
      {
        required,
        id: uuid,
        label,
        error: error2,
        description,
        size: size4,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        __staticSelector: "PasswordInput",
        errorProps,
        descriptionProps,
        unstyled,
        withAsterisk,
        inputWrapperOrder,
        inputContainer,
        variant,
        labelProps: { ...labelProps, htmlFor: uuid },
        mod,
        ...getStyles2("root"),
        ...styleProps,
        ...wrapperProps,
        children:  jsxRuntime.jsx(
          Input,
          {
            component: "div",
            error: error2,
            leftSection,
            size: size4,
            classNames: { ...resolvedClassNames, input: clsx_default(classes62.input, resolvedClassNames.input) },
            styles: resolvedStyles,
            radius,
            disabled,
            __staticSelector: "PasswordInput",
            rightSectionWidth,
            rightSection: rightSection ?? visibilityToggleButton,
            variant,
            unstyled,
            leftSectionWidth,
            rightSectionPointerEvents: rightSectionPointerEvents || "all",
            rightSectionProps,
            leftSectionProps,
            leftSectionPointerEvents,
            withAria: false,
            withErrorStyles,
            children:  jsxRuntime.jsx(
              "input",
              {
                required,
                "data-invalid": !!error2 || void 0,
                "data-with-left-section": !!leftSection || void 0,
                ...getStyles2("innerInput"),
                disabled,
                id: uuid,
                ref,
                ...rest,
                autoComplete: rest.autoComplete || "off",
                type: _visible ? "text" : "password"
              }
            )
          }
        )
      }
    );
  });
  PasswordInput.classes = { ...InputBase.classes, ...classes62 };
  PasswordInput.displayName = "@mantine/core/PasswordInput";
  function createPinArray(length, value) {
    if (length < 1) {
      return [];
    }
    const values2 = new Array(length).fill("");
    if (value) {
      const splitted = value.trim().split("");
      for (let i = 0; i < Math.min(length, splitted.length); i += 1) {
        values2[i] = splitted[i] === " " ? "" : splitted[i];
      }
    }
    return values2;
  }
  var classes63 = { "root": "m_f1cb205a", "pinInput": "m_cb288ead" };
  var regex = {
    number: /^[0-9]+$/,
    alphanumeric: /^[a-zA-Z0-9]+$/i
  };
  var defaultProps142 = {
    gap: "sm",
    length: 4,
    manageFocus: true,
    oneTimeCode: true,
    placeholder: "\u25CB",
    type: "alphanumeric",
    ariaLabel: "PinInput"
  };
  var varsResolver65 = createVarsResolver((_, { size: size4 }) => ({
    root: {
      "--pin-input-size": getSize(size4 ?? defaultProps142.size, "pin-input-size")
    }
  }));
  var PinInput = factory((props, ref) => {
    const {
      name,
      form,
      className,
      value,
      defaultValue,
      variant,
      gap,
      style,
      size: size4,
      classNames,
      styles,
      unstyled,
      length,
      onChange,
      onComplete,
      manageFocus,
      autoFocus,
      error: error2,
      radius,
      disabled,
      oneTimeCode,
      placeholder,
      type,
      mask,
      readOnly,
      inputType,
      inputMode,
      ariaLabel,
      vars,
      id,
      hiddenInputProps,
      rootRef,
      getInputProps,
      ...others
    } = useProps("PinInput", defaultProps142, props);
    const uuid = hooks.useId(id);
    const getStyles2 = useStyles({
      name: "PinInput",
      classes: classes63,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver65
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const [focusedIndex, setFocusedIndex] = React10.useState(-1);
    const [_value, setValues] = hooks.useUncontrolled({
      value: value ? createPinArray(length ?? 0, value) : void 0,
      defaultValue: defaultValue?.split("").slice(0, length ?? 0),
      finalValue: createPinArray(length ?? 0, ""),
      onChange: typeof onChange === "function" ? (val) => {
        onChange(val.join("").trim());
      } : void 0
    });
    const _valueToString = _value.join("").trim();
    const inputsRef = React10.useRef([]);
    const validate = (code) => {
      const re = type instanceof RegExp ? type : type && type in regex ? regex[type] : null;
      return re?.test(code);
    };
    const focusInputField = (dir, index3, event) => {
      if (!manageFocus) {
        event?.preventDefault();
        return;
      }
      if (dir === "next") {
        const nextIndex = index3 + 1;
        const canFocusNext = nextIndex < (length ?? 0);
        if (canFocusNext) {
          event?.preventDefault();
          inputsRef.current[nextIndex].focus();
        }
      }
      if (dir === "prev") {
        const nextIndex = index3 - 1;
        const canFocusNext = nextIndex > -1;
        if (canFocusNext) {
          event?.preventDefault();
          inputsRef.current[nextIndex].focus();
        }
      }
    };
    const setFieldValue = (val, index3) => {
      const values2 = [..._value];
      values2[index3] = val;
      setValues(values2);
    };
    const handleChange = (event, index3) => {
      const inputValue = event.target.value;
      const nextCharOrValue = inputValue.length === 2 ? inputValue.split("")[inputValue.length - 1] : inputValue;
      const isValid = validate(nextCharOrValue);
      if (nextCharOrValue.length < 2) {
        if (isValid) {
          setFieldValue(nextCharOrValue, index3);
          focusInputField("next", index3);
        } else {
          setFieldValue("", index3);
        }
      } else if (isValid) {
        setValues(createPinArray(length ?? 0, inputValue));
      }
    };
    const handleKeyDown = (event, index3) => {
      const { ctrlKey, metaKey, key, shiftKey, target } = event;
      const inputValue = target.value;
      if (inputMode === "numeric") {
        const canTypeSign = key === "Backspace" || key === "Tab" || key === "Control" || key === "Delete" || ctrlKey && key === "v" || metaKey && key === "v" ? true : !Number.isNaN(Number(key));
        if (!canTypeSign) {
          event.preventDefault();
        }
      }
      if (key === "ArrowLeft" || shiftKey && key === "Tab") {
        focusInputField("prev", index3, event);
      } else if (key === "ArrowRight" || key === "Tab" || key === " ") {
        focusInputField("next", index3, event);
      } else if (key === "Delete") {
        setFieldValue("", index3);
      } else if (key === "Backspace") {
        if (index3 !== 0) {
          setFieldValue("", index3);
          if (length === index3 + 1) {
            if (event.target.value === "") {
              focusInputField("prev", index3, event);
            }
          } else {
            focusInputField("prev", index3, event);
          }
        }
      } else if (inputValue.length > 0 && key === _value[index3]) {
        focusInputField("next", index3, event);
      }
    };
    const handleFocus = (event, index3) => {
      event.target.select();
      setFocusedIndex(index3);
    };
    const handleBlur = () => {
      setFocusedIndex(-1);
    };
    const handlePaste = (event) => {
      event.preventDefault();
      const copyValue = event.clipboardData.getData("text/plain").replace(/[\n\r\s]+/g, "");
      const isValid = validate(copyValue.trim());
      if (isValid) {
        const copyValueToPinArray = createPinArray(length ?? 0, copyValue);
        setValues(copyValueToPinArray);
        focusInputField("next", copyValueToPinArray.length - 2);
      }
    };
    React10.useEffect(() => {
      if (_valueToString.length !== length) {
        return;
      }
      onComplete?.(_valueToString);
    }, [length, _valueToString]);
    React10.useEffect(() => {
      if (length !== _value.length) {
        setValues(createPinArray(length ?? 0, _value.join("")));
      }
    }, [length, _value]);
    React10.useEffect(() => {
      if (value === "") {
        setValues(createPinArray(length ?? 0, value));
      }
    }, [value]);
    React10.useEffect(() => {
      if (disabled) {
        setFocusedIndex(-1);
      }
    }, [disabled]);
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsx(
        Group,
        {
          ...others,
          ...getStyles2("root"),
          ref: rootRef,
          role: "group",
          id: uuid,
          gap,
          unstyled,
          wrap: "nowrap",
          variant,
          __size: size4,
          dir: "ltr",
          children: _value.map((char, index3) =>  React10.createElement(
            Input,
            {
              component: "input",
              ...getStyles2("pinInput", {
                style: {
                  "--input-padding": "0",
                  "--input-text-align": "center"
                }
              }),
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              size: size4,
              __staticSelector: "PinInput",
              id: `${uuid}-${index3 + 1}`,
              key: `${uuid}-${index3}`,
              inputMode: inputMode || (type === "number" ? "numeric" : "text"),
              onChange: (event) => handleChange(event, index3),
              onKeyDown: (event) => handleKeyDown(event, index3),
              onFocus: (event) => handleFocus(event, index3),
              onBlur: handleBlur,
              onPaste: handlePaste,
              type: inputType || (mask ? "password" : type === "number" ? "tel" : "text"),
              radius,
              error: error2,
              variant,
              disabled,
              ref: (node) => {
                index3 === 0 && hooks.assignRef(ref, node);
                inputsRef.current[index3] = node;
              },
              autoComplete: oneTimeCode ? "one-time-code" : "off",
              placeholder: focusedIndex === index3 ? "" : placeholder,
              value: char,
              autoFocus: autoFocus && index3 === 0,
              unstyled,
              "aria-label": ariaLabel,
              readOnly,
              ...getInputProps?.(index3)
            }
          ))
        }
      ),
       jsxRuntime.jsx("input", { type: "hidden", name, form, value: _valueToString, ...hiddenInputProps })
    ] });
  });
  PinInput.classes = { ...classes63, ...InputBase.classes };
  PinInput.displayName = "@mantine/core/PinInput";
  var [ProgressProvider, useProgressContext] = createSafeContext(
    "Progress.Root component was not found in tree"
  );
  var classes64 = { "root": "m_db6d6462", "section": "m_2242eb65", "stripes-animation": "m_81a374bd", "label": "m_91e40b74" };
  var defaultProps143 = {};
  var ProgressLabel = factory((props, ref) => {
    const { classNames, className, style, styles, vars, ...others } = useProps(
      "ProgressLabel",
      defaultProps143,
      props
    );
    const ctx = useProgressContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("label", { className, style, classNames, styles }),
        ...others
      }
    );
  });
  ProgressLabel.classes = classes64;
  ProgressLabel.displayName = "@mantine/core/ProgressLabel";
  var defaultProps144 = {};
  var varsResolver66 = createVarsResolver(
    (_, { size: size4, radius, transitionDuration }) => ({
      root: {
        "--progress-size": getSize(size4, "progress-size"),
        "--progress-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--progress-transition-duration": typeof transitionDuration === "number" ? `${transitionDuration}ms` : void 0
      }
    })
  );
  var ProgressRoot = factory((_props, ref) => {
    const props = useProps("ProgressRoot", defaultProps144, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      autoContrast,
      transitionDuration,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Progress",
      classes: classes64,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver66
    });
    return  jsxRuntime.jsx(ProgressProvider, { value: { getStyles: getStyles2, autoContrast }, children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others }) });
  });
  ProgressRoot.classes = classes64;
  ProgressRoot.displayName = "@mantine/core/ProgressRoot";
  var defaultProps145 = {
    withAria: true
  };
  var ProgressSection = factory((props, ref) => {
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      value,
      withAria,
      color,
      striped,
      animated,
      mod,
      ...others
    } = useProps("ProgressSection", defaultProps145, props);
    const ctx = useProgressContext();
    const theme = useMantineTheme();
    const ariaAttributes = withAria ? {
      role: "progressbar",
      "aria-valuemax": 100,
      "aria-valuemin": 0,
      "aria-valuenow": value,
      "aria-valuetext": `${value}%`
    } : {};
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...ctx.getStyles("section", { className, classNames, styles, style }),
        ...others,
        ...ariaAttributes,
        mod: [{ striped: striped || animated, animated }, mod],
        __vars: {
          "--progress-section-width": `${value}%`,
          "--progress-section-color": getThemeColor(color, theme),
          "--progress-label-color": getAutoContrastValue(ctx.autoContrast, theme) ? getContrastColor({ color, theme, autoContrast: ctx.autoContrast }) : void 0
        }
      }
    );
  });
  ProgressSection.classes = classes64;
  ProgressSection.displayName = "@mantine/core/ProgressSection";
  var defaultProps146 = {};
  var Progress = factory((_props, ref) => {
    const props = useProps("Progress", defaultProps146, _props);
    const {
      value,
      classNames,
      styles,
      vars,
      color,
      striped,
      animated,
      "aria-label": label,
      ...others
    } = props;
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    return  jsxRuntime.jsx(
      ProgressRoot,
      {
        ref,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        vars,
        ...others,
        children:  jsxRuntime.jsx(
          ProgressSection,
          {
            value,
            color,
            striped,
            animated,
            "aria-label": label
          }
        )
      }
    );
  });
  Progress.classes = classes64;
  Progress.displayName = "@mantine/core/Progress";
  Progress.Section = ProgressSection;
  Progress.Root = ProgressRoot;
  Progress.Label = ProgressLabel;
  var [RadioGroupProvider, useRadioGroupContext] = createOptionalContext();
  var [RadioCardProvider, useRadioCardContext] = createOptionalContext();
  var classes65 = { "card": "m_9dc8ae12" };
  var defaultProps147 = {
    withBorder: true
  };
  var varsResolver67 = createVarsResolver((_, { radius }) => ({
    card: {
      "--card-radius": getRadius(radius)
    }
  }));
  var RadioCard = factory((_props, ref) => {
    const props = useProps("RadioCard", defaultProps147, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      checked,
      mod,
      withBorder,
      value,
      onClick,
      name,
      onKeyDown,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "RadioCard",
      classes: classes65,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver67,
      rootSelector: "card"
    });
    const { dir } = useDirection();
    const ctx = useRadioGroupContext();
    const _checked = typeof checked === "boolean" ? checked : ctx?.value === value || false;
    const _name = name || ctx?.name;
    const handleKeyDown = (event) => {
      onKeyDown?.(event);
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.nativeEvent.code)) {
        event.preventDefault();
        const siblings = Array.from(
          document.querySelectorAll(
            `[role="radio"][name="${_name || "__mantine"}"]`
          )
        );
        const currentIndex = siblings.findIndex((element) => element === event.target);
        const nextIndex = currentIndex + 1 >= siblings.length ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? siblings.length - 1 : currentIndex - 1;
        if (event.nativeEvent.code === "ArrowDown") {
          siblings[nextIndex].focus();
          siblings[nextIndex].click();
        }
        if (event.nativeEvent.code === "ArrowUp") {
          siblings[prevIndex].focus();
          siblings[prevIndex].click();
        }
        if (event.nativeEvent.code === "ArrowLeft") {
          siblings[dir === "ltr" ? prevIndex : nextIndex].focus();
          siblings[dir === "ltr" ? prevIndex : nextIndex].click();
        }
        if (event.nativeEvent.code === "ArrowRight") {
          siblings[dir === "ltr" ? nextIndex : prevIndex].focus();
          siblings[dir === "ltr" ? nextIndex : prevIndex].click();
        }
      }
    };
    return  jsxRuntime.jsx(RadioCardProvider, { value: { checked: _checked }, children:  jsxRuntime.jsx(
      UnstyledButton,
      {
        ref,
        mod: [{ "with-border": withBorder, checked: _checked }, mod],
        ...getStyles2("card"),
        ...others,
        role: "radio",
        "aria-checked": _checked,
        name: _name,
        onClick: (event) => {
          onClick?.(event);
          ctx?.onChange(value || "");
        },
        onKeyDown: handleKeyDown
      }
    ) });
  });
  RadioCard.displayName = "@mantine/core/RadioCard";
  RadioCard.classes = classes65;
  var defaultProps148 = {};
  var RadioGroup = factory((props, ref) => {
    const { value, defaultValue, onChange, size: size4, wrapperProps, children, name, readOnly, ...others } = useProps("RadioGroup", defaultProps148, props);
    const _name = hooks.useId(name);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: "",
      onChange
    });
    const handleChange = (event) => !readOnly && setValue(typeof event === "string" ? event : event.currentTarget.value);
    return  jsxRuntime.jsx(RadioGroupProvider, { value: { value: _value, onChange: handleChange, size: size4, name: _name }, children:  jsxRuntime.jsx(
      Input.Wrapper,
      {
        size: size4,
        ref,
        ...wrapperProps,
        ...others,
        labelElement: "div",
        __staticSelector: "RadioGroup",
        children:  jsxRuntime.jsx(InputsGroupFieldset, { role: "radiogroup", children })
      }
    ) });
  });
  RadioGroup.classes = Input.Wrapper.classes;
  RadioGroup.displayName = "@mantine/core/RadioGroup";
  function RadioIcon({ size: size4, style, ...others }) {
    return  jsxRuntime.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 5 5",
        style: { width: rem(size4), height: rem(size4), ...style },
        "aria-hidden": true,
        ...others,
        children:  jsxRuntime.jsx("circle", { cx: "2.5", cy: "2.5", r: "2.5", fill: "currentColor" })
      }
    );
  }
  var classes66 = { "indicator": "m_717d7ff6", "icon": "m_3e4da632", "indicator--outline": "m_2980836c" };
  var defaultProps149 = {
    icon: RadioIcon
  };
  var varsResolver68 = createVarsResolver(
    (theme, { radius, color, size: size4, iconColor, variant, autoContrast }) => {
      const parsedColor = parseThemeColor({ color: color || theme.primaryColor, theme });
      const outlineColor = parsedColor.isThemeColor && parsedColor.shade === void 0 ? `var(--mantine-color-${parsedColor.color}-outline)` : parsedColor.color;
      return {
        indicator: {
          "--radio-size": getSize(size4, "radio-size"),
          "--radio-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--radio-color": variant === "outline" ? outlineColor : getThemeColor(color, theme),
          "--radio-icon-size": getSize(size4, "radio-icon-size"),
          "--radio-icon-color": iconColor ? getThemeColor(iconColor, theme) : getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
        }
      };
    }
  );
  var RadioIndicator = factory((_props, ref) => {
    const props = useProps("RadioIndicator", defaultProps149, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      icon,
      radius,
      color,
      iconColor,
      autoContrast,
      checked,
      mod,
      variant,
      disabled,
      ...others
    } = props;
    const Icon = icon;
    const getStyles2 = useStyles({
      name: "RadioIndicator",
      classes: classes66,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver68,
      rootSelector: "indicator"
    });
    const ctx = useRadioCardContext();
    const _checked = typeof checked === "boolean" ? checked : ctx?.checked || false;
    return  jsxRuntime.jsx(
      Box,
      {
        ref,
        ...getStyles2("indicator", { variant }),
        variant,
        mod: [{ checked: _checked, disabled }, mod],
        ...others,
        children:  jsxRuntime.jsx(Icon, { ...getStyles2("icon") })
      }
    );
  });
  RadioIndicator.displayName = "@mantine/core/RadioIndicator";
  RadioIndicator.classes = classes66;
  var classes67 = { "root": "m_f3f1af94", "inner": "m_89c4f5e4", "icon": "m_f3ed6b2b", "radio": "m_8a3dbb89", "radio--outline": "m_1bfe9d39" };
  var defaultProps150 = {
    labelPosition: "right"
  };
  var varsResolver69 = createVarsResolver(
    (theme, { size: size4, radius, color, iconColor, variant, autoContrast }) => {
      const parsedColor = parseThemeColor({ color: color || theme.primaryColor, theme });
      const outlineColor = parsedColor.isThemeColor && parsedColor.shade === void 0 ? `var(--mantine-color-${parsedColor.color}-outline)` : parsedColor.color;
      return {
        root: {
          "--radio-size": getSize(size4, "radio-size"),
          "--radio-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--radio-color": variant === "outline" ? outlineColor : getThemeColor(color, theme),
          "--radio-icon-color": iconColor ? getThemeColor(iconColor, theme) : getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0,
          "--radio-icon-size": getSize(size4, "radio-icon-size")
        }
      };
    }
  );
  var Radio = factory((_props, ref) => {
    const props = useProps("Radio", defaultProps150, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      id,
      size: size4,
      label,
      labelPosition,
      description,
      error: error2,
      radius,
      color,
      variant,
      disabled,
      wrapperProps,
      icon: Icon = RadioIcon,
      rootRef,
      iconColor,
      onChange,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Radio",
      classes: classes67,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver69
    });
    const ctx = useRadioGroupContext();
    const contextSize = ctx?.size ?? size4;
    const componentSize = props.size ? size4 : contextSize;
    const { styleProps, rest } = extractStyleProps(others);
    const uuid = hooks.useId(id);
    const contextProps = ctx ? {
      checked: ctx.value === rest.value,
      name: rest.name ?? ctx.name,
      onChange: (event) => {
        ctx.onChange(event);
        onChange?.(event);
      }
    } : {};
    return  jsxRuntime.jsx(
      InlineInput,
      {
        ...getStyles2("root"),
        __staticSelector: "Radio",
        __stylesApiProps: props,
        id: uuid,
        size: componentSize,
        labelPosition,
        label,
        description,
        error: error2,
        disabled,
        classNames,
        styles,
        unstyled,
        "data-checked": contextProps.checked || void 0,
        variant,
        ref: rootRef,
        mod,
        ...styleProps,
        ...wrapperProps,
        children:  jsxRuntime.jsxs(Box, { ...getStyles2("inner"), mod: { "label-position": labelPosition }, children: [
           jsxRuntime.jsx(
            Box,
            {
              ...getStyles2("radio", { focusable: true, variant }),
              onChange,
              ...rest,
              ...contextProps,
              component: "input",
              mod: { error: !!error2 },
              ref,
              id: uuid,
              disabled,
              type: "radio"
            }
          ),
           jsxRuntime.jsx(Icon, { ...getStyles2("icon"), "aria-hidden": true })
        ] })
      }
    );
  });
  Radio.classes = classes67;
  Radio.displayName = "@mantine/core/Radio";
  Radio.Group = RadioGroup;
  Radio.Card = RadioCard;
  Radio.Indicator = RadioIndicator;
  var [RatingProvider, useRatingContext] = createSafeContext(
    "Rating was not found in tree"
  );
  function StarIcon(props) {
    const { width, height, style, ...others } = props;
    return  jsxRuntime.jsx(
      "svg",
      {
        viewBox: "0 0 24 24",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: { width, height, ...style },
        ...others,
        children:  jsxRuntime.jsx("path", { d: "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" })
      }
    );
  }
  StarIcon.displayName = "@mantine/core/StarIcon";
  function StarSymbol({ type }) {
    const ctx = useRatingContext();
    return  jsxRuntime.jsx(StarIcon, { ...ctx.getStyles("starSymbol"), "data-filled": type === "full" || void 0 });
  }
  StarSymbol.displayName = "@mantine/core/StarSymbol";
  function RatingItem({
    getSymbolLabel,
    emptyIcon,
    fullIcon,
    full,
    active,
    value,
    readOnly,
    fractionValue,
    color,
    id,
    onBlur,
    onChange,
    onInputChange,
    style,
    ...others
  }) {
    const ctx = useRatingContext();
    const _fullIcon = typeof fullIcon === "function" ? fullIcon(value) : fullIcon;
    const _emptyIcon = typeof emptyIcon === "function" ? emptyIcon(value) : emptyIcon;
    const { dir } = useDirection();
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      !readOnly &&  jsxRuntime.jsx(
        "input",
        {
          ...ctx.getStyles("input"),
          onKeyDown: (event) => event.key === " " && onChange(value),
          id,
          type: "radio",
          "data-active": active || void 0,
          "aria-label": getSymbolLabel?.(value),
          value,
          onBlur,
          onChange: onInputChange,
          ...others
        }
      ),
       jsxRuntime.jsx(
        Box,
        {
          component: readOnly ? "div" : "label",
          ...ctx.getStyles("label"),
          "data-read-only": readOnly || void 0,
          htmlFor: id,
          onClick: () => onChange(value),
          __vars: {
            "--rating-item-z-index": (fractionValue === 1 ? void 0 : active ? 2 : 0)?.toString()
          },
          children:  jsxRuntime.jsx(
            Box,
            {
              ...ctx.getStyles("symbolBody"),
              __vars: {
                "--rating-symbol-clip-path": fractionValue === 1 ? void 0 : dir === "ltr" ? `inset(0 ${active ? 100 - fractionValue * 100 : 100}% 0 0)` : `inset(0 0 0 ${active ? 100 - fractionValue * 100 : 100}% )`
              },
              children: full ? _fullIcon ||  jsxRuntime.jsx(StarSymbol, { type: "full" }) : _emptyIcon ||  jsxRuntime.jsx(StarSymbol, { type: "empty" })
            }
          )
        }
      )
    ] });
  }
  RatingItem.displayName = "@mantine/core/RatingItem";
  var classes68 = { "root": "m_f8d312f2", "symbolGroup": "m_61734bb7", "starSymbol": "m_5662a89a", "input": "m_211007ba", "label": "m_21342ee4", "symbolBody": "m_fae05d6a" };
  function roundValueTo(value, to) {
    const rounded = Math.round(value / to) * to;
    const precision = `${to}`.split(".")[1]?.length || 0;
    return Number(rounded.toFixed(precision));
  }
  var defaultProps151 = {
    size: "sm",
    getSymbolLabel: (value) => `${value}`,
    count: 5,
    fractions: 1,
    color: "yellow"
  };
  var varsResolver70 = createVarsResolver((theme, { size: size4, color }) => ({
    root: {
      "--rating-size": getSize(size4, "rating-size"),
      "--rating-color": getThemeColor(color, theme)
    }
  }));
  var Rating = factory((_props, ref) => {
    const props = useProps("Rating", defaultProps151, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      name,
      id,
      value,
      defaultValue,
      onChange,
      fractions,
      count: count2,
      onMouseEnter,
      readOnly,
      onMouseMove,
      onHover,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      size: size4,
      variant,
      getSymbolLabel,
      color,
      emptySymbol,
      fullSymbol,
      highlightSelectedOnly,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Rating",
      classes: classes68,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver70
    });
    const { dir } = useDirection();
    const _name = hooks.useId(name);
    const _id = hooks.useId(id);
    const rootRef = React10.useRef(null);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: 0,
      onChange
    });
    const [hovered, setHovered] = React10.useState(-1);
    const [isOutside, setOutside] = React10.useState(true);
    const _fractions = Math.floor(fractions);
    const _count = Math.floor(count2);
    const decimalUnit = 1 / _fractions;
    const stableValueRounded = roundValueTo(_value, decimalUnit);
    const finalValue = hovered !== -1 ? hovered : stableValueRounded;
    const getRatingFromCoordinates = (x) => {
      const { left, right, width } = rootRef.current.getBoundingClientRect();
      const symbolWidth = width / _count;
      const hoverPosition = dir === "rtl" ? right - x : x - left;
      const hoverValue = hoverPosition / symbolWidth;
      return hooks.clamp(roundValueTo(hoverValue + decimalUnit / 2, decimalUnit), decimalUnit, _count);
    };
    const handleMouseEnter = (event) => {
      onMouseEnter?.(event);
      !readOnly && setOutside(false);
    };
    const handleMouseMove = (event) => {
      onMouseMove?.(event);
      if (readOnly) {
        return;
      }
      const rounded = getRatingFromCoordinates(event.clientX);
      setHovered(rounded);
      rounded !== hovered && onHover?.(rounded);
    };
    const handleMouseLeave = (event) => {
      onMouseLeave?.(event);
      if (readOnly) {
        return;
      }
      setHovered(-1);
      setOutside(true);
      hovered !== -1 && onHover?.(-1);
    };
    const handleTouchStart = (event) => {
      const { touches } = event;
      if (touches.length !== 1) {
        return;
      }
      if (!readOnly) {
        const touch = touches[0];
        setValue(getRatingFromCoordinates(touch.clientX));
      }
      onTouchStart?.(event);
    };
    const handleTouchEnd = (event) => {
      event.preventDefault();
      onTouchEnd?.(event);
    };
    const handleItemBlur = () => isOutside && setHovered(-1);
    const handleInputChange = (event) => {
      if (!readOnly) {
        if (typeof event === "number") {
          setHovered(event);
        } else {
          setHovered(parseFloat(event.target.value));
        }
      }
    };
    const handleChange = (event) => {
      if (!readOnly) {
        if (typeof event === "number") {
          setValue(event);
        } else {
          setValue(parseFloat(event.target.value));
        }
      }
    };
    const items = Array(_count).fill(0).map((_, index3) => {
      const integerValue = index3 + 1;
      const fractionItems = Array.from(new Array(index3 === 0 ? _fractions + 1 : _fractions));
      const isGroupActive = !readOnly && Math.ceil(hovered) === integerValue;
      return  jsxRuntime.jsx(
        "div",
        {
          "data-active": isGroupActive || void 0,
          ...getStyles2("symbolGroup"),
          children: fractionItems.map((__, fractionIndex) => {
            const fractionValue = decimalUnit * (index3 === 0 ? fractionIndex : fractionIndex + 1);
            const symbolValue = roundValueTo(integerValue - 1 + fractionValue, decimalUnit);
            return  jsxRuntime.jsx(
              RatingItem,
              {
                getSymbolLabel,
                emptyIcon: emptySymbol,
                fullIcon: fullSymbol,
                full: highlightSelectedOnly ? symbolValue === finalValue : symbolValue <= finalValue,
                active: symbolValue === finalValue,
                checked: symbolValue === stableValueRounded,
                readOnly,
                fractionValue,
                value: symbolValue,
                name: _name,
                onChange: handleChange,
                onBlur: handleItemBlur,
                onInputChange: handleInputChange,
                id: `${_id}-${index3}-${fractionIndex}`
              },
              `${integerValue}-${symbolValue}`
            );
          })
        },
        integerValue
      );
    });
    return  jsxRuntime.jsx(RatingProvider, { value: { getStyles: getStyles2 }, children:  jsxRuntime.jsx(
      Box,
      {
        ref: hooks.useMergedRef(rootRef, ref),
        ...getStyles2("root"),
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        variant,
        size: size4,
        id: _id,
        ...others,
        children: items
      }
    ) });
  });
  Rating.classes = classes68;
  Rating.displayName = "@mantine/core/Rating";
  var defaultTransition = {
    duration: 100,
    transition: "fade"
  };
  function getTransitionProps(transitionProps, componentTransition) {
    return { ...defaultTransition, ...componentTransition, ...transitionProps };
  }
  function useFloatingTooltip({
    offset: offset4,
    position,
    defaultOpened
  }) {
    const [opened, setOpened] = React10.useState(defaultOpened);
    const boundaryRef = React10.useRef(null);
    const { x, y, elements, refs, update, placement } = useFloating2({
      placement: position,
      middleware: [
        shift3({
          crossAxis: true,
          padding: 5,
          rootBoundary: "document"
        })
      ]
    });
    const horizontalOffset = placement.includes("right") ? offset4 : position.includes("left") ? offset4 * -1 : 0;
    const verticalOffset = placement.includes("bottom") ? offset4 : position.includes("top") ? offset4 * -1 : 0;
    const handleMouseMove = React10.useCallback(
      ({ clientX, clientY }) => {
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: clientX,
              y: clientY,
              left: clientX + horizontalOffset,
              top: clientY + verticalOffset,
              right: clientX,
              bottom: clientY
            };
          }
        });
      },
      [elements.reference]
    );
    React10.useEffect(() => {
      if (refs.floating.current) {
        const boundary = boundaryRef.current;
        boundary.addEventListener("mousemove", handleMouseMove);
        const parents = getOverflowAncestors(refs.floating.current);
        parents.forEach((parent) => {
          parent.addEventListener("scroll", update);
        });
        return () => {
          boundary.removeEventListener("mousemove", handleMouseMove);
          parents.forEach((parent) => {
            parent.removeEventListener("scroll", update);
          });
        };
      }
      return void 0;
    }, [elements.reference, refs.floating.current, update, handleMouseMove, opened]);
    return { handleMouseMove, x, y, opened, setOpened, boundaryRef, floating: refs.setFloating };
  }
  var classes69 = { "tooltip": "m_1b3c8819", "arrow": "m_f898399f" };
  var defaultProps152 = {
    refProp: "ref",
    withinPortal: true,
    offset: 10,
    defaultOpened: false,
    position: "right",
    zIndex: getDefaultZIndex("popover")
  };
  var varsResolver71 = createVarsResolver((theme, { radius, color }) => ({
    tooltip: {
      "--tooltip-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--tooltip-bg": color ? getThemeColor(color, theme) : void 0,
      "--tooltip-color": color ? "var(--mantine-color-white)" : void 0
    }
  }));
  var TooltipFloating = factory((_props, ref) => {
    const props = useProps("TooltipFloating", defaultProps152, _props);
    const {
      children,
      refProp,
      withinPortal,
      style,
      className,
      classNames,
      styles,
      unstyled,
      radius,
      color,
      label,
      offset: offset4,
      position,
      multiline,
      zIndex,
      disabled,
      defaultOpened,
      variant,
      vars,
      portalProps,
      ...others
    } = props;
    const theme = useMantineTheme();
    const getStyles2 = useStyles({
      name: "TooltipFloating",
      props,
      classes: classes69,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "tooltip",
      vars,
      varsResolver: varsResolver71
    });
    const { handleMouseMove, x, y, opened, boundaryRef, floating, setOpened } = useFloatingTooltip({
      offset: offset4,
      position,
      defaultOpened
    });
    if (!isElement(children)) {
      throw new Error(
        "[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const targetRef = hooks.useMergedRef(boundaryRef, getRefProp(children), ref);
    const _childrenProps = children.props;
    const onMouseEnter = (event) => {
      _childrenProps.onMouseEnter?.(event);
      handleMouseMove(event);
      setOpened(true);
    };
    const onMouseLeave = (event) => {
      _childrenProps.onMouseLeave?.(event);
      setOpened(false);
    };
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsx(OptionalPortal, { ...portalProps, withinPortal, children:  jsxRuntime.jsx(
        Box,
        {
          ...others,
          ...getStyles2("tooltip", {
            style: {
              ...getStyleObject(style, theme),
              zIndex,
              display: !disabled && opened ? "block" : "none",
              top: (y && Math.round(y)) ?? "",
              left: (x && Math.round(x)) ?? ""
            }
          }),
          variant,
          ref: floating,
          mod: { multiline },
          children: label
        }
      ) }),
      React10.cloneElement(children, {
        ..._childrenProps,
        [refProp]: targetRef,
        onMouseEnter,
        onMouseLeave
      })
    ] });
  });
  TooltipFloating.classes = classes69;
  TooltipFloating.displayName = "@mantine/core/TooltipFloating";
  var TooltipGroupContext = React10.createContext(false);
  var TooltipGroupProvider = TooltipGroupContext.Provider;
  var useTooltipGroupContext = () => React10.useContext(TooltipGroupContext);
  var defaultProps153 = {
    openDelay: 0,
    closeDelay: 0
  };
  function TooltipGroup(props) {
    const { openDelay, closeDelay, children } = useProps("TooltipGroup", defaultProps153, props);
    return  jsxRuntime.jsx(TooltipGroupProvider, { value: true, children:  jsxRuntime.jsx(FloatingDelayGroup, { delay: { open: openDelay, close: closeDelay }, children }) });
  }
  TooltipGroup.displayName = "@mantine/core/TooltipGroup";
  TooltipGroup.extend = (c) => c;
  function getDefaultMiddlewares2(middlewares) {
    if (middlewares === void 0) {
      return { shift: true, flip: true };
    }
    const result = { ...middlewares };
    if (middlewares.shift === void 0) {
      result.shift = true;
    }
    if (middlewares.flip === void 0) {
      result.flip = true;
    }
    return result;
  }
  function getTooltipMiddlewares(settings) {
    const middlewaresOptions = getDefaultMiddlewares2(settings.middlewares);
    const middlewares = [offset3(settings.offset)];
    if (middlewaresOptions.shift) {
      middlewares.push(
        shift3(
          typeof middlewaresOptions.shift === "boolean" ? { padding: 8 } : { padding: 8, ...middlewaresOptions.shift }
        )
      );
    }
    if (middlewaresOptions.flip) {
      middlewares.push(
        typeof middlewaresOptions.flip === "boolean" ? flip3() : flip3(middlewaresOptions.flip)
      );
    }
    middlewares.push(arrow3({ element: settings.arrowRef, padding: settings.arrowOffset }));
    if (middlewaresOptions.inline) {
      middlewares.push(
        typeof middlewaresOptions.inline === "boolean" ? inline3() : inline3(middlewaresOptions.inline)
      );
    } else if (settings.inline) {
      middlewares.push(inline3());
    }
    return middlewares;
  }
  function useTooltip(settings) {
    const [uncontrolledOpened, setUncontrolledOpened] = React10.useState(settings.defaultOpened);
    const controlled = typeof settings.opened === "boolean";
    const opened = controlled ? settings.opened : uncontrolledOpened;
    const withinGroup = useTooltipGroupContext();
    const uid = hooks.useId();
    const { delay: groupDelay, currentId, setCurrentId } = useDelayGroupContext();
    const onChange = React10.useCallback(
      (_opened) => {
        setUncontrolledOpened(_opened);
        if (_opened) {
          setCurrentId(uid);
        }
      },
      [setCurrentId, uid]
    );
    const {
      x,
      y,
      context,
      refs,
      update,
      placement,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
    } = useFloating2({
      strategy: settings.strategy,
      placement: settings.position,
      open: opened,
      onOpenChange: onChange,
      middleware: getTooltipMiddlewares(settings)
    });
    useDelayGroup(context, { id: uid });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(context, {
        enabled: settings.events?.hover,
        delay: withinGroup ? groupDelay : { open: settings.openDelay, close: settings.closeDelay },
        mouseOnly: !settings.events?.touch
      }),
      useFocus(context, { enabled: settings.events?.focus, visibleOnly: true }),
      useRole(context, { role: "tooltip" }),
      useDismiss(context, { enabled: typeof settings.opened === "undefined" })
    ]);
    useFloatingAutoUpdate({
      opened,
      position: settings.position,
      positionDependencies: settings.positionDependencies,
      floating: { refs, update }
    });
    hooks.useDidUpdate(() => {
      settings.onPositionChange?.(placement);
    }, [placement]);
    const isGroupPhase = opened && currentId && currentId !== uid;
    return {
      x,
      y,
      arrowX,
      arrowY,
      reference: refs.setReference,
      floating: refs.setFloating,
      getFloatingProps,
      getReferenceProps,
      isGroupPhase,
      opened,
      placement
    };
  }
  var defaultProps154 = {
    position: "top",
    refProp: "ref",
    withinPortal: true,
    inline: false,
    defaultOpened: false,
    arrowSize: 4,
    arrowOffset: 5,
    arrowRadius: 0,
    arrowPosition: "side",
    offset: 5,
    transitionProps: { duration: 100, transition: "fade" },
    events: { hover: true, focus: false, touch: false },
    zIndex: getDefaultZIndex("popover"),
    positionDependencies: [],
    middlewares: { flip: true, shift: true, inline: false }
  };
  var varsResolver72 = createVarsResolver((theme, { radius, color }) => ({
    tooltip: {
      "--tooltip-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--tooltip-bg": color ? getThemeColor(color, theme) : void 0,
      "--tooltip-color": color ? "var(--mantine-color-white)" : void 0
    }
  }));
  var Tooltip = factory((_props, ref) => {
    const props = useProps("Tooltip", defaultProps154, _props);
    const {
      children,
      position,
      refProp,
      label,
      openDelay,
      closeDelay,
      onPositionChange,
      opened,
      defaultOpened,
      withinPortal,
      radius,
      color,
      classNames,
      styles,
      unstyled,
      style,
      className,
      withArrow,
      arrowSize,
      arrowOffset,
      arrowRadius,
      arrowPosition,
      offset: offset4,
      transitionProps,
      multiline,
      events,
      zIndex,
      disabled,
      positionDependencies,
      onClick,
      onMouseEnter,
      onMouseLeave,
      inline: inline4,
      variant,
      keepMounted,
      vars,
      portalProps,
      mod,
      floatingStrategy,
      middlewares,
      ...others
    } = useProps("Tooltip", defaultProps154, props);
    const { dir } = useDirection();
    const arrowRef = React10.useRef(null);
    const tooltip = useTooltip({
      position: getFloatingPosition(dir, position),
      closeDelay,
      openDelay,
      onPositionChange,
      opened,
      defaultOpened,
      events,
      arrowRef,
      arrowOffset,
      offset: typeof offset4 === "number" ? offset4 + (withArrow ? arrowSize / 2 : 0) : offset4,
      positionDependencies: [...positionDependencies, children],
      inline: inline4,
      strategy: floatingStrategy,
      middlewares
    });
    const getStyles2 = useStyles({
      name: "Tooltip",
      props,
      classes: classes69,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "tooltip",
      vars,
      varsResolver: varsResolver72
    });
    if (!isElement(children)) {
      throw new Error(
        "[@mantine/core] Tooltip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
      );
    }
    const targetRef = hooks.useMergedRef(tooltip.reference, getRefProp(children), ref);
    const transition = getTransitionProps(transitionProps, { duration: 100, transition: "fade" });
    const _childrenProps = children.props;
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsx(OptionalPortal, { ...portalProps, withinPortal, children:  jsxRuntime.jsx(
        Transition,
        {
          ...transition,
          keepMounted,
          mounted: !disabled && !!tooltip.opened,
          duration: tooltip.isGroupPhase ? 10 : transition.duration,
          children: (transitionStyles) =>  jsxRuntime.jsxs(
            Box,
            {
              ...others,
              "data-fixed": floatingStrategy === "fixed" || void 0,
              variant,
              mod: [{ multiline }, mod],
              ...tooltip.getFloatingProps({
                ref: tooltip.floating,
                className: getStyles2("tooltip").className,
                style: {
                  ...getStyles2("tooltip").style,
                  ...transitionStyles,
                  zIndex,
                  top: tooltip.y ?? 0,
                  left: tooltip.x ?? 0
                }
              }),
              children: [
                label,
                 jsxRuntime.jsx(
                  FloatingArrow,
                  {
                    ref: arrowRef,
                    arrowX: tooltip.arrowX,
                    arrowY: tooltip.arrowY,
                    visible: withArrow,
                    position: tooltip.placement,
                    arrowSize,
                    arrowOffset,
                    arrowRadius,
                    arrowPosition,
                    ...getStyles2("arrow")
                  }
                )
              ]
            }
          )
        }
      ) }),
      React10.cloneElement(
        children,
        tooltip.getReferenceProps({
          onClick,
          onMouseEnter,
          onMouseLeave,
          onMouseMove: props.onMouseMove,
          onPointerDown: props.onPointerDown,
          onPointerEnter: props.onPointerEnter,
          [refProp]: targetRef,
          className: clsx_default(className, _childrenProps.className),
          ..._childrenProps
        })
      )
    ] });
  });
  Tooltip.classes = classes69;
  Tooltip.displayName = "@mantine/core/Tooltip";
  Tooltip.Floating = TooltipFloating;
  Tooltip.Group = TooltipGroup;
  function getCurveProps({ size: size4, thickness, sum, value, root, offset: offset4 }) {
    const radius = (size4 * 0.9 - thickness * 2) / 2;
    const deg = Math.PI * radius * 2 / 100;
    const strokeDasharray = root || value === void 0 ? `${(100 - sum) * deg}, ${sum * deg}` : `${value * deg}, ${(100 - value) * deg}`;
    return {
      strokeWidth: Number.isNaN(thickness) ? 12 : thickness,
      cx: size4 / 2 || 0,
      cy: size4 / 2 || 0,
      r: radius || 0,
      transform: root ? `scale(1, -1) translate(0, -${size4})` : void 0,
      strokeDasharray,
      strokeDashoffset: root ? 0 : offset4 || 0
    };
  }
  function Curve({
    size: size4,
    value,
    offset: offset4,
    sum,
    thickness,
    root,
    color,
    lineRoundCaps,
    tooltip,
    getStyles: getStyles2,
    display,
    ...others
  }) {
    const theme = useMantineTheme();
    return  jsxRuntime.jsx(Tooltip.Floating, { disabled: !tooltip, label: tooltip, children:  jsxRuntime.jsx(
      Box,
      {
        component: "circle",
        ...others,
        ...getStyles2("curve"),
        __vars: { "--curve-color": color ? getThemeColor(color, theme) : void 0 },
        fill: "none",
        strokeLinecap: lineRoundCaps ? "round" : "butt",
        ...getCurveProps({ sum, size: size4, thickness, value, offset: offset4, root })
      }
    ) });
  }
  Curve.displayName = "@mantine/core/Curve";
  function getCurves({
    size: size4,
    thickness,
    sections,
    renderRoundedLineCaps,
    rootColor
  }) {
    const sum = sections.reduce((acc, current) => acc + current.value, 0);
    const accumulated = Math.PI * ((size4 * 0.9 - thickness * 2) / 2) * 2;
    let offset4 = accumulated;
    const curves = [];
    const curvesInOrder = [];
    for (let i = 0; i < sections.length; i += 1) {
      curves.push({ sum, offset: offset4, data: sections[i], root: false });
      offset4 -= sections[i].value / 100 * accumulated;
    }
    curves.push({ sum, offset: offset4, data: { color: rootColor }, root: true });
    curvesInOrder.push({ ...curves[curves.length - 1], lineRoundCaps: false });
    if (curves.length > 2) {
      curvesInOrder.push({ ...curves[0], lineRoundCaps: renderRoundedLineCaps });
      curvesInOrder.push({ ...curves[curves.length - 2], lineRoundCaps: renderRoundedLineCaps });
      for (let i = 1; i <= curves.length - 3; i += 1) {
        curvesInOrder.push({ ...curves[i], lineRoundCaps: false });
      }
    } else {
      curvesInOrder.push({ ...curves[0], lineRoundCaps: renderRoundedLineCaps });
    }
    return curvesInOrder;
  }
  var classes70 = { "root": "m_b32e4812", "svg": "m_d43b5134", "curve": "m_b1ca1fbf", "label": "m_b23f9dc4" };
  function getClampedThickness(thickness, size4) {
    return Math.min(thickness || 12, (size4 || 120) / 4);
  }
  var defaultProps155 = {
    size: 120,
    thickness: 12
  };
  var varsResolver73 = createVarsResolver(
    (_, { size: size4, thickness, transitionDuration }) => ({
      root: {
        "--rp-size": rem(size4),
        "--rp-label-offset": rem(thickness * 2),
        "--rp-transition-duration": transitionDuration ? `${transitionDuration}ms` : void 0
      }
    })
  );
  var RingProgress = factory((_props, ref) => {
    const props = useProps("RingProgress", defaultProps155, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      label,
      sections,
      size: size4,
      thickness,
      roundCaps,
      rootColor,
      transitionDuration,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "RingProgress",
      classes: classes70,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver73
    });
    const clampedThickness = getClampedThickness(thickness, size4);
    const curves = getCurves({
      size: size4,
      thickness: clampedThickness,
      sections,
      renderRoundedLineCaps: roundCaps,
      rootColor
    }).map(({ data, sum, root, lineRoundCaps, offset: offset4 }, index3) =>  React10.createElement(
      Curve,
      {
        ...data,
        key: index3,
        size: size4,
        thickness: clampedThickness,
        sum,
        offset: offset4,
        color: data?.color,
        root,
        lineRoundCaps,
        getStyles: getStyles2
      }
    ));
    return  jsxRuntime.jsxs(Box, { ...getStyles2("root"), size: size4, ref, ...others, children: [
       jsxRuntime.jsx("svg", { ...getStyles2("svg"), children: curves }),
      label &&  jsxRuntime.jsx("div", { ...getStyles2("label"), children: label })
    ] });
  });
  RingProgress.classes = classes70;
  RingProgress.displayName = "@mantine/core/RingProgress";
  var classes71 = { "root": "m_cf365364", "indicator": "m_9e182ccd", "label": "m_1738fcb2", "input": "m_1714d588", "control": "m_69686b9b", "innerLabel": "m_78882f40" };
  var defaultProps156 = {
    withItemsBorders: true
  };
  var varsResolver74 = createVarsResolver(
    (theme, { radius, color, transitionDuration, size: size4, transitionTimingFunction }) => ({
      root: {
        "--sc-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--sc-color": color ? getThemeColor(color, theme) : void 0,
        "--sc-shadow": color ? void 0 : "var(--mantine-shadow-xs)",
        "--sc-transition-duration": transitionDuration === void 0 ? void 0 : `${transitionDuration}ms`,
        "--sc-transition-timing-function": transitionTimingFunction,
        "--sc-padding": getSize(size4, "sc-padding"),
        "--sc-font-size": getFontSize(size4)
      }
    })
  );
  var SegmentedControl = factory((_props, ref) => {
    const props = useProps("SegmentedControl", defaultProps156, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      value,
      defaultValue,
      onChange,
      size: size4,
      name,
      disabled,
      readOnly,
      fullWidth,
      orientation,
      radius,
      color,
      transitionDuration,
      transitionTimingFunction,
      variant,
      autoContrast,
      withItemsBorders,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "SegmentedControl",
      props,
      classes: classes71,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver74
    });
    const theme = useMantineTheme();
    const _data = data.map(
      (item) => typeof item === "string" ? { label: item, value: item } : item
    );
    const initialized = hooks.useMounted();
    const [parent, setParent] = React10.useState(null);
    const [refs, setRefs] = React10.useState({});
    const setElementRef = (element, val) => {
      refs[val] = element;
      setRefs(refs);
    };
    const [_value, handleValueChange] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: Array.isArray(data) ? _data.find((item) => !item.disabled)?.value ?? data[0]?.value ?? null : null,
      onChange
    });
    const uuid = hooks.useId(name);
    const controls = _data.map((item) =>  React10.createElement(
      Box,
      {
        ...getStyles2("control"),
        mod: { active: _value === item.value, orientation },
        key: item.value
      },
       React10.createElement(
        "input",
        {
          ...getStyles2("input"),
          disabled: disabled || item.disabled,
          type: "radio",
          name: uuid,
          value: item.value,
          id: `${uuid}-${item.value}`,
          checked: _value === item.value,
          onChange: () => !readOnly && handleValueChange(item.value),
          "data-focus-ring": theme.focusRing,
          key: `${item.value}-input`
        }
      ),
       React10.createElement(
        Box,
        {
          component: "label",
          ...getStyles2("label"),
          mod: {
            active: _value === item.value && !(disabled || item.disabled),
            disabled: disabled || item.disabled,
            "read-only": readOnly
          },
          htmlFor: `${uuid}-${item.value}`,
          ref: (node) => setElementRef(node, item.value),
          __vars: {
            "--sc-label-color": color !== void 0 ? getContrastColor({ color, theme, autoContrast }) : void 0
          },
          key: `${item.value}-label`
        },
         jsxRuntime.jsx("span", { ...getStyles2("innerLabel"), children: item.label })
      )
    ));
    const mergedRef = hooks.useMergedRef(ref, (node) => setParent(node));
    if (data.length === 0) {
      return null;
    }
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("root"),
        variant,
        size: size4,
        ref: mergedRef,
        mod: [
          {
            "full-width": fullWidth,
            orientation,
            initialized,
            "with-items-borders": withItemsBorders
          },
          mod
        ],
        ...others,
        role: "radiogroup",
        "data-disabled": disabled,
        children: [
          typeof _value === "string" &&  jsxRuntime.jsx(
            FloatingIndicator,
            {
              target: refs[_value],
              parent,
              component: "span",
              transitionDuration: "var(--sc-transition-duration)",
              ...getStyles2("indicator")
            }
          ),
          controls
        ]
      }
    );
  });
  SegmentedControl.classes = classes71;
  SegmentedControl.displayName = "@mantine/core/SegmentedControl";
  var defaultProps157 = {
    searchable: false,
    withCheckIcon: true,
    allowDeselect: true,
    checkIconPosition: "left"
  };
  var Select = factory((_props, ref) => {
    const props = useProps("Select", defaultProps157, _props);
    const {
      classNames,
      styles,
      unstyled,
      vars,
      dropdownOpened,
      defaultDropdownOpened,
      onDropdownClose,
      onDropdownOpen,
      onFocus,
      onBlur,
      onClick,
      onChange,
      data,
      value,
      defaultValue,
      selectFirstOptionOnChange,
      onOptionSubmit,
      comboboxProps,
      readOnly,
      disabled,
      filter,
      limit,
      withScrollArea,
      maxDropdownHeight,
      size: size4,
      searchable,
      rightSection,
      checkIconPosition,
      withCheckIcon,
      nothingFoundMessage,
      name,
      form,
      searchValue,
      defaultSearchValue,
      onSearchChange,
      allowDeselect,
      error: error2,
      rightSectionPointerEvents,
      id,
      clearable,
      clearButtonProps,
      hiddenInputProps,
      renderOption,
      onClear,
      autoComplete,
      scrollAreaProps,
      ...others
    } = props;
    const parsedData = React10.useMemo(() => getParsedComboboxData(data), [data]);
    const optionsLockup = React10.useMemo(() => getOptionsLockup(parsedData), [parsedData]);
    const _id = hooks.useId(id);
    const [_value, setValue, controlled] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: null,
      onChange
    });
    const selectedOption = typeof _value === "string" ? optionsLockup[_value] : void 0;
    const previousSelectedOption = hooks.usePrevious(selectedOption);
    const [search, setSearch] = hooks.useUncontrolled({
      value: searchValue,
      defaultValue: defaultSearchValue,
      finalValue: selectedOption ? selectedOption.label : "",
      onChange: onSearchChange
    });
    const combobox = useCombobox({
      opened: dropdownOpened,
      defaultOpened: defaultDropdownOpened,
      onDropdownOpen: () => {
        onDropdownOpen?.();
        combobox.updateSelectedOptionIndex("active", { scrollIntoView: true });
      },
      onDropdownClose: () => {
        onDropdownClose?.();
        combobox.resetSelectedOption();
      }
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      props,
      styles,
      classNames
    });
    React10.useEffect(() => {
      if (selectFirstOptionOnChange) {
        combobox.selectFirstOption();
      }
    }, [selectFirstOptionOnChange, _value]);
    React10.useEffect(() => {
      if (value === null) {
        setSearch("");
      }
      if (typeof value === "string" && selectedOption && (previousSelectedOption?.value !== selectedOption.value || previousSelectedOption?.label !== selectedOption.label)) {
        setSearch(selectedOption.label);
      }
    }, [value, selectedOption]);
    const clearButton = clearable && !!_value && !disabled && !readOnly &&  jsxRuntime.jsx(
      Combobox.ClearButton,
      {
        size: size4,
        ...clearButtonProps,
        onClear: () => {
          setValue(null, null);
          setSearch("");
          onClear?.();
        }
      }
    );
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsxs(
        Combobox,
        {
          store: combobox,
          __staticSelector: "Select",
          classNames: resolvedClassNames,
          styles: resolvedStyles,
          unstyled,
          readOnly,
          onOptionSubmit: (val) => {
            onOptionSubmit?.(val);
            const optionLockup = allowDeselect ? optionsLockup[val].value === _value ? null : optionsLockup[val] : optionsLockup[val];
            const nextValue = optionLockup ? optionLockup.value : null;
            nextValue !== _value && setValue(nextValue, optionLockup);
            !controlled && setSearch(typeof nextValue === "string" ? optionLockup?.label || "" : "");
            combobox.closeDropdown();
          },
          size: size4,
          ...comboboxProps,
          children: [
             jsxRuntime.jsx(Combobox.Target, { targetType: searchable ? "input" : "button", autoComplete, children:  jsxRuntime.jsx(
              InputBase,
              {
                id: _id,
                ref,
                rightSection: rightSection || clearButton ||  jsxRuntime.jsx(Combobox.Chevron, { size: size4, error: error2, unstyled }),
                rightSectionPointerEvents: rightSectionPointerEvents || (clearButton ? "all" : "none"),
                ...others,
                size: size4,
                __staticSelector: "Select",
                disabled,
                readOnly: readOnly || !searchable,
                value: search,
                onChange: (event) => {
                  setSearch(event.currentTarget.value);
                  combobox.openDropdown();
                  selectFirstOptionOnChange && combobox.selectFirstOption();
                },
                onFocus: (event) => {
                  searchable && combobox.openDropdown();
                  onFocus?.(event);
                },
                onBlur: (event) => {
                  searchable && combobox.closeDropdown();
                  setSearch(_value != null ? optionsLockup[_value]?.label || "" : "");
                  onBlur?.(event);
                },
                onClick: (event) => {
                  searchable ? combobox.openDropdown() : combobox.toggleDropdown();
                  onClick?.(event);
                },
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                unstyled,
                pointer: !searchable,
                error: error2
              }
            ) }),
             jsxRuntime.jsx(
              OptionsDropdown,
              {
                data: parsedData,
                hidden: readOnly || disabled,
                filter,
                search,
                limit,
                hiddenWhenEmpty: !nothingFoundMessage,
                withScrollArea,
                maxDropdownHeight,
                filterOptions: searchable && selectedOption?.label !== search,
                value: _value,
                checkIconPosition,
                withCheckIcon,
                nothingFoundMessage,
                unstyled,
                labelId: others.label ? `${_id}-label` : void 0,
                "aria-label": others.label ? void 0 : others["aria-label"],
                renderOption,
                scrollAreaProps
              }
            )
          ]
        }
      ),
       jsxRuntime.jsx(
        Combobox.HiddenInput,
        {
          value: _value,
          name,
          form,
          disabled,
          ...hiddenInputProps
        }
      )
    ] });
  });
  Select.classes = { ...InputBase.classes, ...Combobox.classes };
  Select.displayName = "@mantine/core/Select";
  var classes72 = { "root": "m_fa528724", "svg": "m_62e9e7e2", "filledSegment": "m_c573fb6f", "label": "m_4fa340f2" };
  var defaultProps158 = {
    size: 200,
    thickness: 12,
    orientation: "up",
    fillDirection: "left-to-right",
    labelPosition: "bottom"
  };
  function getRotation({
    orientation,
    fillDirection
  }) {
    if (orientation === "down") {
      if (fillDirection === "right-to-left") {
        return "rotate(180deg) rotateY(180deg)";
      }
      return "rotate(180deg)";
    }
    if (fillDirection === "left-to-right") {
      return "rotateY(180deg)";
    }
    return void 0;
  }
  var varsResolver75 = createVarsResolver(
    (theme, {
      filledSegmentColor,
      emptySegmentColor,
      orientation,
      fillDirection,
      transitionDuration,
      thickness
    }) => ({
      root: {
        "--scp-filled-segment-color": filledSegmentColor ? getThemeColor(filledSegmentColor, theme) : void 0,
        "--scp-empty-segment-color": emptySegmentColor ? getThemeColor(emptySegmentColor, theme) : void 0,
        "--scp-rotation": getRotation({ orientation, fillDirection }),
        "--scp-transition-duration": transitionDuration ? `${transitionDuration}ms` : void 0,
        "--scp-thickness": rem(thickness)
      }
    })
  );
  var SemiCircleProgress = factory((_props, ref) => {
    const props = useProps("SemiCircleProgress", defaultProps158, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      thickness,
      value,
      orientation,
      fillDirection,
      filledSegmentColor,
      emptySegmentColor,
      transitionDuration,
      label,
      labelPosition,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "SemiCircleProgress",
      classes: classes72,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver75
    });
    const coordinateForCircle = size4 / 2;
    const radius = (size4 - 2 * thickness) / 2;
    const circumference = Math.PI * radius;
    const semiCirclePercentage = hooks.clamp(value, 0, 100) * (circumference / 100);
    return  jsxRuntime.jsxs(Box, { ref, size: size4, ...getStyles2("root"), ...others, children: [
      label &&  jsxRuntime.jsx("p", { ...getStyles2("label"), "data-position": labelPosition, "data-orientation": orientation, children: label }),
       jsxRuntime.jsxs("svg", { width: size4, height: size4 / 2, ...getStyles2("svg"), children: [
         jsxRuntime.jsx(
          "circle",
          {
            cx: coordinateForCircle,
            cy: coordinateForCircle,
            r: radius,
            fill: "none",
            stroke: "var(--scp-empty-segment-color)",
            strokeWidth: thickness,
            strokeDasharray: circumference,
            ...getStyles2("emptySegment", { style: { strokeDashoffset: circumference } })
          }
        ),
         jsxRuntime.jsx(
          "circle",
          {
            cx: coordinateForCircle,
            cy: coordinateForCircle,
            r: radius,
            fill: "none",
            stroke: "var(--scp-filled-segment-color)",
            strokeWidth: thickness,
            strokeDasharray: circumference,
            ...getStyles2("filledSegment", { style: { strokeDashoffset: semiCirclePercentage } })
          }
        )
      ] })
    ] });
  });
  SemiCircleProgress.displayName = "@mantine/core/SemiCircleProgress";
  SemiCircleProgress.classes = classes72;
  function SimpleGridMediaVariables({
    spacing,
    verticalSpacing,
    cols,
    selector
  }) {
    const theme = useMantineTheme();
    const _verticalSpacing = verticalSpacing === void 0 ? spacing : verticalSpacing;
    const baseStyles = filterProps({
      "--sg-spacing-x": getSpacing(getBaseValue(spacing)),
      "--sg-spacing-y": getSpacing(getBaseValue(_verticalSpacing)),
      "--sg-cols": getBaseValue(cols)?.toString()
    });
    const queries = keys(theme.breakpoints).reduce(
      (acc, breakpoint) => {
        if (!acc[breakpoint]) {
          acc[breakpoint] = {};
        }
        if (typeof spacing === "object" && spacing[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-spacing-x"] = getSpacing(spacing[breakpoint]);
        }
        if (typeof _verticalSpacing === "object" && _verticalSpacing[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-spacing-y"] = getSpacing(_verticalSpacing[breakpoint]);
        }
        if (typeof cols === "object" && cols[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-cols"] = cols[breakpoint];
        }
        return acc;
      },
      {}
    );
    const sortedBreakpoints = getSortedBreakpoints(keys(queries), theme.breakpoints).filter(
      (breakpoint) => keys(queries[breakpoint.value]).length > 0
    );
    const media = sortedBreakpoints.map((breakpoint) => ({
      query: `(min-width: ${theme.breakpoints[breakpoint.value]})`,
      styles: queries[breakpoint.value]
    }));
    return  jsxRuntime.jsx(InlineStyles, { styles: baseStyles, media, selector });
  }
  function getBreakpoints(values2) {
    if (typeof values2 === "object" && values2 !== null) {
      return keys(values2);
    }
    return [];
  }
  function sortBreakpoints(breakpoints) {
    return breakpoints.sort((a, b) => px(a) - px(b));
  }
  function getUniqueBreakpoints({
    spacing,
    verticalSpacing,
    cols
  }) {
    const breakpoints = Array.from(
       new Set([
        ...getBreakpoints(spacing),
        ...getBreakpoints(verticalSpacing),
        ...getBreakpoints(cols)
      ])
    );
    return sortBreakpoints(breakpoints);
  }
  function SimpleGridContainerVariables({
    spacing,
    verticalSpacing,
    cols,
    selector
  }) {
    const _verticalSpacing = verticalSpacing === void 0 ? spacing : verticalSpacing;
    const baseStyles = filterProps({
      "--sg-spacing-x": getSpacing(getBaseValue(spacing)),
      "--sg-spacing-y": getSpacing(getBaseValue(_verticalSpacing)),
      "--sg-cols": getBaseValue(cols)?.toString()
    });
    const uniqueBreakpoints = getUniqueBreakpoints({ spacing, verticalSpacing, cols });
    const queries = uniqueBreakpoints.reduce(
      (acc, breakpoint) => {
        if (!acc[breakpoint]) {
          acc[breakpoint] = {};
        }
        if (typeof spacing === "object" && spacing[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-spacing-x"] = getSpacing(spacing[breakpoint]);
        }
        if (typeof _verticalSpacing === "object" && _verticalSpacing[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-spacing-y"] = getSpacing(_verticalSpacing[breakpoint]);
        }
        if (typeof cols === "object" && cols[breakpoint] !== void 0) {
          acc[breakpoint]["--sg-cols"] = cols[breakpoint];
        }
        return acc;
      },
      {}
    );
    const media = uniqueBreakpoints.map((breakpoint) => ({
      query: `simple-grid (min-width: ${breakpoint})`,
      styles: queries[breakpoint]
    }));
    return  jsxRuntime.jsx(InlineStyles, { styles: baseStyles, container: media, selector });
  }
  var classes73 = { "container": "m_925c2d2c", "root": "m_2415a157" };
  var defaultProps159 = {
    cols: 1,
    spacing: "md",
    type: "media"
  };
  var SimpleGrid = factory((_props, ref) => {
    const props = useProps("SimpleGrid", defaultProps159, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      cols,
      verticalSpacing,
      spacing,
      type,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "SimpleGrid",
      classes: classes73,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars
    });
    const responsiveClassName = useRandomClassName();
    if (type === "container") {
      return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
         jsxRuntime.jsx(SimpleGridContainerVariables, { ...props, selector: `.${responsiveClassName}` }),
         jsxRuntime.jsx("div", { ...getStyles2("container"), children:  jsxRuntime.jsx(Box, { ref, ...getStyles2("root", { className: responsiveClassName }), ...others }) })
      ] });
    }
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsx(SimpleGridMediaVariables, { ...props, selector: `.${responsiveClassName}` }),
       jsxRuntime.jsx(Box, { ref, ...getStyles2("root", { className: responsiveClassName }), ...others })
    ] });
  });
  SimpleGrid.classes = classes73;
  SimpleGrid.displayName = "@mantine/core/SimpleGrid";
  var classes74 = { "root": "m_18320242", "skeleton-fade": "m_299c329c" };
  var defaultProps160 = {
    visible: true,
    animate: true
  };
  var varsResolver76 = createVarsResolver(
    (_, { width, height, radius, circle }) => ({
      root: {
        "--skeleton-height": rem(height),
        "--skeleton-width": circle ? rem(height) : rem(width),
        "--skeleton-radius": circle ? "1000px" : radius === void 0 ? void 0 : getRadius(radius)
      }
    })
  );
  var Skeleton = factory((_props, ref) => {
    const props = useProps("Skeleton", defaultProps160, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      width,
      height,
      circle,
      visible,
      radius,
      animate,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Skeleton",
      classes: classes74,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver76
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), mod: [{ visible, animate }, mod], ...others });
  });
  Skeleton.classes = classes74;
  Skeleton.displayName = "@mantine/core/Skeleton";
  var [SliderProvider, useSliderContext] = createSafeContext(
    "SliderProvider was not found in tree"
  );
  var SliderRoot = React10.forwardRef(
    ({ size: size4, disabled, variant, color, thumbSize, radius, ...others }, ref) => {
      const { getStyles: getStyles2 } = useSliderContext();
      return  jsxRuntime.jsx(
        Box,
        {
          tabIndex: -1,
          variant,
          size: size4,
          ref,
          ...getStyles2("root"),
          ...others
        }
      );
    }
  );
  SliderRoot.displayName = "@mantine/core/SliderRoot";
  var Thumb3 = React10.forwardRef(
    ({
      max: max2,
      min: min2,
      value,
      position,
      label,
      dragging,
      onMouseDown,
      onKeyDownCapture,
      labelTransitionProps,
      labelAlwaysOn,
      thumbLabel,
      onFocus,
      onBlur,
      showLabelOnHover,
      isHovered,
      children = null,
      disabled
    }, ref) => {
      const { getStyles: getStyles2 } = useSliderContext();
      const [focused, setFocused] = React10.useState(false);
      const isVisible = labelAlwaysOn || dragging || focused || showLabelOnHover && isHovered;
      return  jsxRuntime.jsxs(
        Box,
        {
          tabIndex: 0,
          role: "slider",
          "aria-label": thumbLabel,
          "aria-valuemax": max2,
          "aria-valuemin": min2,
          "aria-valuenow": value,
          ref,
          __vars: { "--slider-thumb-offset": `${position}%` },
          ...getStyles2("thumb", { focusable: true }),
          mod: { dragging, disabled },
          onFocus: (event) => {
            setFocused(true);
            typeof onFocus === "function" && onFocus(event);
          },
          onBlur: (event) => {
            setFocused(false);
            typeof onBlur === "function" && onBlur(event);
          },
          onTouchStart: onMouseDown,
          onMouseDown,
          onKeyDownCapture,
          onClick: (event) => event.stopPropagation(),
          children: [
            children,
             jsxRuntime.jsx(
              Transition,
              {
                mounted: label != null && !!isVisible,
                transition: "fade",
                duration: 0,
                ...labelTransitionProps,
                children: (transitionStyles) =>  jsxRuntime.jsx("div", { ...getStyles2("label", { style: transitionStyles }), children: label })
              }
            )
          ]
        }
      );
    }
  );
  Thumb3.displayName = "@mantine/core/SliderThumb";
  function getPosition({ value, min: min2, max: max2 }) {
    const position = (value - min2) / (max2 - min2) * 100;
    return Math.min(Math.max(position, 0), 100);
  }
  function isMarkFilled({ mark, offset: offset4, value, inverted = false }) {
    return inverted ? typeof offset4 === "number" ? mark.value <= offset4 || mark.value >= value : mark.value >= value : typeof offset4 === "number" ? mark.value >= offset4 && mark.value <= value : mark.value <= value;
  }
  function Marks({ marks, min: min2, max: max2, disabled, value, offset: offset4, inverted }) {
    const { getStyles: getStyles2 } = useSliderContext();
    if (!marks) {
      return null;
    }
    const items = marks.map((mark, index3) =>  React10.createElement(
      Box,
      {
        ...getStyles2("markWrapper"),
        __vars: { "--mark-offset": `${getPosition({ value: mark.value, min: min2, max: max2 })}%` },
        key: index3
      },
       jsxRuntime.jsx(
        Box,
        {
          ...getStyles2("mark"),
          mod: { filled: isMarkFilled({ mark, value, offset: offset4, inverted }), disabled }
        }
      ),
      mark.label &&  jsxRuntime.jsx("div", { ...getStyles2("markLabel"), children: mark.label })
    ));
    return  jsxRuntime.jsx("div", { children: items });
  }
  Marks.displayName = "@mantine/core/SliderMarks";
  function Track({
    filled,
    children,
    offset: offset4,
    disabled,
    marksOffset,
    inverted,
    containerProps,
    ...others
  }) {
    const { getStyles: getStyles2 } = useSliderContext();
    return  jsxRuntime.jsx(Box, { ...getStyles2("trackContainer"), mod: { disabled }, ...containerProps, children:  jsxRuntime.jsxs(Box, { ...getStyles2("track"), mod: { inverted, disabled }, children: [
       jsxRuntime.jsx(
        Box,
        {
          mod: { inverted, disabled },
          __vars: {
            "--slider-bar-width": `calc(${filled}% + var(--slider-size))`,
            "--slider-bar-offset": `calc(${offset4}% - var(--slider-size))`
          },
          ...getStyles2("bar")
        }
      ),
      children,
       jsxRuntime.jsx(Marks, { ...others, offset: marksOffset, disabled, inverted })
    ] }) });
  }
  Track.displayName = "@mantine/core/SliderTrack";
  function getChangeValue({
    value,
    containerWidth,
    min: min2,
    max: max2,
    step,
    precision
  }) {
    const left = !containerWidth ? value : Math.min(Math.max(value, 0), containerWidth) / containerWidth;
    const dx = left * (max2 - min2);
    const nextValue = (dx !== 0 ? Math.round(dx / step) * step : 0) + min2;
    const nextValueWithinStep = Math.max(nextValue, min2);
    if (precision !== void 0) {
      return Number(nextValueWithinStep.toFixed(precision));
    }
    return nextValueWithinStep;
  }
  function getFloatingValue(value, precision) {
    return parseFloat(value.toFixed(precision));
  }
  function getPrecision(step) {
    if (!step) {
      return 0;
    }
    const split = step.toString().split(".");
    return split.length > 1 ? split[1].length : 0;
  }
  function getNextMarkValue(currentValue, marks) {
    const sortedMarks = [...marks].sort((a, b) => a.value - b.value);
    const nextMark = sortedMarks.find((mark) => mark.value > currentValue);
    return nextMark ? nextMark.value : currentValue;
  }
  function getPreviousMarkValue(currentValue, marks) {
    const sortedMarks = [...marks].sort((a, b) => b.value - a.value);
    const previousMark = sortedMarks.find((mark) => mark.value < currentValue);
    return previousMark ? previousMark.value : currentValue;
  }
  function getFirstMarkValue(marks) {
    const sortedMarks = [...marks].sort((a, b) => b.value - a.value);
    return sortedMarks.length > 0 ? sortedMarks[0].value : 0;
  }
  function getLastMarkValue(marks) {
    const sortedMarks = [...marks].sort((a, b) => a.value - b.value);
    return sortedMarks.length > 0 ? sortedMarks[sortedMarks.length - 1].value : 100;
  }
  var classes75 = { "root": "m_dd36362e", "label": "m_c9357328", "thumb": "m_c9a9a60a", "trackContainer": "m_a8645c2", "track": "m_c9ade57f", "bar": "m_38aeed47", "markWrapper": "m_b7b0423a", "mark": "m_dd33bc19", "markLabel": "m_68c77a5b" };
  var defaultProps161 = {
    radius: "xl",
    min: 0,
    max: 100,
    step: 1,
    marks: [],
    label: (f) => f,
    labelTransitionProps: { transition: "fade", duration: 0 },
    labelAlwaysOn: false,
    thumbLabel: "",
    showLabelOnHover: true,
    disabled: false,
    scale: (v) => v
  };
  var varsResolver77 = createVarsResolver(
    (theme, { size: size4, color, thumbSize, radius }) => ({
      root: {
        "--slider-size": getSize(size4, "slider-size"),
        "--slider-color": color ? getThemeColor(color, theme) : void 0,
        "--slider-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--slider-thumb-size": thumbSize !== void 0 ? rem(thumbSize) : "calc(var(--slider-size) * 2)"
      }
    })
  );
  var Slider = factory((_props, ref) => {
    const props = useProps("Slider", defaultProps161, _props);
    const {
      classNames,
      styles,
      value,
      onChange,
      onChangeEnd,
      size: size4,
      min: min2,
      max: max2,
      step,
      precision: _precision,
      defaultValue,
      name,
      marks,
      label,
      labelTransitionProps,
      labelAlwaysOn,
      thumbLabel,
      showLabelOnHover,
      thumbChildren,
      disabled,
      unstyled,
      scale,
      inverted,
      className,
      style,
      vars,
      hiddenInputProps,
      restrictToMarks,
      thumbProps,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Slider",
      props,
      classes: classes75,
      classNames,
      className,
      styles,
      style,
      vars,
      varsResolver: varsResolver77,
      unstyled
    });
    const { dir } = useDirection();
    const [hovered, setHovered] = React10.useState(false);
    const [_value, setValue] = hooks.useUncontrolled({
      value: typeof value === "number" ? hooks.clamp(value, min2, max2) : value,
      defaultValue: typeof defaultValue === "number" ? hooks.clamp(defaultValue, min2, max2) : defaultValue,
      finalValue: hooks.clamp(0, min2, max2),
      onChange
    });
    const valueRef = React10.useRef(_value);
    const root = React10.useRef(null);
    const thumb = React10.useRef(null);
    const position = getPosition({ value: _value, min: min2, max: max2 });
    const scaledValue = scale(_value);
    const _label = typeof label === "function" ? label(scaledValue) : label;
    const precision = _precision ?? getPrecision(step);
    const handleChange = React10.useCallback(
      ({ x }) => {
        if (!disabled) {
          const nextValue = getChangeValue({
            value: x,
            min: min2,
            max: max2,
            step,
            precision
          });
          setValue(
            restrictToMarks && marks?.length ? findClosestNumber(
              nextValue,
              marks.map((mark) => mark.value)
            ) : nextValue
          );
          valueRef.current = nextValue;
        }
      },
      [disabled, min2, max2, step, precision, setValue, marks, restrictToMarks]
    );
    const { ref: container, active } = hooks.useMove(
      handleChange,
      {
        onScrubEnd: () => onChangeEnd?.(
          restrictToMarks && marks?.length ? findClosestNumber(
            valueRef.current,
            marks.map((mark) => mark.value)
          ) : valueRef.current
        )
      },
      dir
    );
    const handleTrackKeydownCapture = (event) => {
      if (!disabled) {
        switch (event.key) {
          case "ArrowUp": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              const nextValue2 = getNextMarkValue(_value, marks);
              setValue(nextValue2);
              onChangeEnd?.(nextValue2);
              break;
            }
            const nextValue = getFloatingValue(
              Math.min(Math.max(_value + step, min2), max2),
              precision
            );
            setValue(nextValue);
            onChangeEnd?.(nextValue);
            break;
          }
          case "ArrowRight": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              const nextValue2 = dir === "rtl" ? getPreviousMarkValue(_value, marks) : getNextMarkValue(_value, marks);
              setValue(nextValue2);
              onChangeEnd?.(nextValue2);
              break;
            }
            const nextValue = getFloatingValue(
              Math.min(Math.max(dir === "rtl" ? _value - step : _value + step, min2), max2),
              precision
            );
            setValue(nextValue);
            onChangeEnd?.(nextValue);
            break;
          }
          case "ArrowDown": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              const nextValue2 = getPreviousMarkValue(_value, marks);
              setValue(nextValue2);
              onChangeEnd?.(nextValue2);
              break;
            }
            const nextValue = getFloatingValue(
              Math.min(Math.max(_value - step, min2), max2),
              precision
            );
            setValue(nextValue);
            onChangeEnd?.(nextValue);
            break;
          }
          case "ArrowLeft": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              const nextValue2 = dir === "rtl" ? getNextMarkValue(_value, marks) : getPreviousMarkValue(_value, marks);
              setValue(nextValue2);
              onChangeEnd?.(nextValue2);
              break;
            }
            const nextValue = getFloatingValue(
              Math.min(Math.max(dir === "rtl" ? _value + step : _value - step, min2), max2),
              precision
            );
            setValue(nextValue);
            onChangeEnd?.(nextValue);
            break;
          }
          case "Home": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              setValue(getFirstMarkValue(marks));
              onChangeEnd?.(getFirstMarkValue(marks));
              break;
            }
            setValue(min2);
            onChangeEnd?.(min2);
            break;
          }
          case "End": {
            event.preventDefault();
            thumb.current?.focus();
            if (restrictToMarks && marks) {
              setValue(getLastMarkValue(marks));
              onChangeEnd?.(getLastMarkValue(marks));
              break;
            }
            setValue(max2);
            onChangeEnd?.(max2);
            break;
          }
        }
      }
    };
    return  jsxRuntime.jsx(SliderProvider, { value: { getStyles: getStyles2 }, children:  jsxRuntime.jsxs(
      SliderRoot,
      {
        ...others,
        ref: hooks.useMergedRef(ref, root),
        onKeyDownCapture: handleTrackKeydownCapture,
        onMouseDownCapture: () => root.current?.focus(),
        size: size4,
        disabled,
        children: [
           jsxRuntime.jsx(
            Track,
            {
              inverted,
              offset: 0,
              filled: position,
              marks,
              min: min2,
              max: max2,
              value: scaledValue,
              disabled,
              containerProps: {
                ref: container,
                onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
                onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0
              },
              children:  jsxRuntime.jsx(
                Thumb3,
                {
                  max: max2,
                  min: min2,
                  value: scaledValue,
                  position,
                  dragging: active,
                  label: _label,
                  ref: thumb,
                  labelTransitionProps,
                  labelAlwaysOn,
                  thumbLabel,
                  showLabelOnHover,
                  isHovered: hovered,
                  disabled,
                  ...thumbProps,
                  children: thumbChildren
                }
              )
            }
          ),
           jsxRuntime.jsx("input", { type: "hidden", name, value: scaledValue, ...hiddenInputProps })
        ]
      }
    ) });
  });
  Slider.classes = classes75;
  Slider.displayName = "@mantine/core/Slider";
  function getClientPosition(event) {
    if ("TouchEvent" in window && event instanceof window.TouchEvent) {
      const touch = event.touches[0];
      return touch.clientX;
    }
    return event.clientX;
  }
  var varsResolver78 = createVarsResolver(
    (theme, { size: size4, color, thumbSize, radius }) => ({
      root: {
        "--slider-size": getSize(size4, "slider-size"),
        "--slider-color": color ? getThemeColor(color, theme) : void 0,
        "--slider-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--slider-thumb-size": thumbSize !== void 0 ? rem(thumbSize) : "calc(var(--slider-size) * 2)"
      }
    })
  );
  var defaultProps162 = {
    min: 0,
    max: 100,
    minRange: 10,
    step: 1,
    marks: [],
    label: (f) => f,
    labelTransitionProps: { transition: "fade", duration: 0 },
    labelAlwaysOn: false,
    showLabelOnHover: true,
    disabled: false,
    scale: (v) => v
  };
  var RangeSlider = factory((_props, ref) => {
    const props = useProps("RangeSlider", defaultProps162, _props);
    const {
      classNames,
      styles,
      value,
      onChange,
      onChangeEnd,
      size: size4,
      min: min2,
      max: max2,
      minRange,
      maxRange,
      step,
      precision: _precision,
      defaultValue,
      name,
      marks,
      label,
      labelTransitionProps,
      labelAlwaysOn,
      thumbFromLabel,
      thumbToLabel,
      showLabelOnHover,
      thumbChildren,
      disabled,
      unstyled,
      scale,
      inverted,
      className,
      style,
      vars,
      hiddenInputProps,
      thumbProps,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Slider",
      props,
      classes: classes75,
      classNames,
      className,
      styles,
      style,
      vars,
      varsResolver: varsResolver78,
      unstyled
    });
    const { dir } = useDirection();
    const [focused, setFocused] = React10.useState(-1);
    const [hovered, setHovered] = React10.useState(false);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: [min2, max2],
      onChange
    });
    const valueRef = React10.useRef(_value);
    const thumbs = React10.useRef([]);
    const thumbIndex = React10.useRef(void 0);
    const positions = [
      getPosition({ value: _value[0], min: min2, max: max2 }),
      getPosition({ value: _value[1], min: min2, max: max2 })
    ];
    const precision = _precision ?? getPrecision(step);
    const _setValue = (val) => {
      setValue(val);
      valueRef.current = val;
    };
    React10.useEffect(
      () => {
        if (Array.isArray(value)) {
          valueRef.current = value;
        }
      },
      Array.isArray(value) ? [value[0], value[1]] : [null, null]
    );
    const setRangedValue = (val, index3, triggerChangeEnd) => {
      const clone = [...valueRef.current];
      clone[index3] = val;
      if (index3 === 0) {
        if (val > clone[1] - (minRange - 1e-9)) {
          clone[1] = Math.min(val + minRange, max2);
        }
        if (val > (max2 - (minRange - 1e-9) || min2)) {
          clone[index3] = valueRef.current[index3];
        }
        if (clone[1] - val > maxRange) {
          clone[1] = val + maxRange;
        }
      }
      if (index3 === 1) {
        if (val < clone[0] + minRange) {
          clone[0] = Math.max(val - minRange, min2);
        }
        if (val < clone[0] + minRange) {
          clone[index3] = valueRef.current[index3];
        }
        if (val - clone[0] > maxRange) {
          clone[0] = val - maxRange;
        }
      }
      clone[0] = getFloatingValue(clone[0], precision);
      clone[1] = getFloatingValue(clone[1], precision);
      _setValue(clone);
      if (triggerChangeEnd) {
        onChangeEnd?.(valueRef.current);
      }
    };
    const handleChange = (val) => {
      if (!disabled) {
        const nextValue = getChangeValue({
          value: val,
          min: min2,
          max: max2,
          step,
          precision
        });
        setRangedValue(nextValue, thumbIndex.current, false);
      }
    };
    const { ref: container, active } = hooks.useMove(
      ({ x }) => handleChange(x),
      { onScrubEnd: () => onChangeEnd?.(valueRef.current) },
      dir
    );
    function handleThumbMouseDown(index3) {
      thumbIndex.current = index3;
    }
    const handleTrackMouseDownCapture = (event) => {
      container.current.focus();
      const rect = container.current.getBoundingClientRect();
      const changePosition = getClientPosition(event.nativeEvent);
      const changeValue = getChangeValue({
        value: changePosition - rect.left,
        max: max2,
        min: min2,
        step,
        containerWidth: rect.width
      });
      const nearestHandle = Math.abs(_value[0] - changeValue) > Math.abs(_value[1] - changeValue) ? 1 : 0;
      const _nearestHandle = dir === "ltr" ? nearestHandle : nearestHandle === 1 ? 0 : 1;
      thumbIndex.current = _nearestHandle;
    };
    const getFocusedThumbIndex = () => {
      if (focused !== 1 && focused !== 0) {
        setFocused(0);
        return 0;
      }
      return focused;
    };
    const handleTrackKeydownCapture = (event) => {
      if (!disabled) {
        switch (event.key) {
          case "ArrowUp": {
            event.preventDefault();
            const focusedIndex = getFocusedThumbIndex();
            thumbs.current[focusedIndex].focus();
            setRangedValue(
              getFloatingValue(
                Math.min(Math.max(valueRef.current[focusedIndex] + step, min2), max2),
                precision
              ),
              focusedIndex,
              true
            );
            break;
          }
          case "ArrowRight": {
            event.preventDefault();
            const focusedIndex = getFocusedThumbIndex();
            thumbs.current[focusedIndex].focus();
            setRangedValue(
              getFloatingValue(
                Math.min(
                  Math.max(
                    dir === "rtl" ? valueRef.current[focusedIndex] - step : valueRef.current[focusedIndex] + step,
                    min2
                  ),
                  max2
                ),
                precision
              ),
              focusedIndex,
              true
            );
            break;
          }
          case "ArrowDown": {
            event.preventDefault();
            const focusedIndex = getFocusedThumbIndex();
            thumbs.current[focusedIndex].focus();
            setRangedValue(
              getFloatingValue(
                Math.min(Math.max(valueRef.current[focusedIndex] - step, min2), max2),
                precision
              ),
              focusedIndex,
              true
            );
            break;
          }
          case "ArrowLeft": {
            event.preventDefault();
            const focusedIndex = getFocusedThumbIndex();
            thumbs.current[focusedIndex].focus();
            setRangedValue(
              getFloatingValue(
                Math.min(
                  Math.max(
                    dir === "rtl" ? valueRef.current[focusedIndex] + step : valueRef.current[focusedIndex] - step,
                    min2
                  ),
                  max2
                ),
                precision
              ),
              focusedIndex,
              true
            );
            break;
          }
        }
      }
    };
    const sharedThumbProps = {
      max: max2,
      min: min2,
      size: size4,
      labelTransitionProps,
      labelAlwaysOn,
      onBlur: () => setFocused(-1)
    };
    const hasArrayThumbChildren = Array.isArray(thumbChildren);
    return  jsxRuntime.jsx(SliderProvider, { value: { getStyles: getStyles2 }, children:  jsxRuntime.jsxs(SliderRoot, { ...others, size: size4, ref, disabled, children: [
       jsxRuntime.jsxs(
        Track,
        {
          offset: positions[0],
          marksOffset: _value[0],
          filled: positions[1] - positions[0],
          marks,
          inverted,
          min: min2,
          max: max2,
          value: _value[1],
          disabled,
          containerProps: {
            ref: container,
            onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
            onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0,
            onTouchStartCapture: handleTrackMouseDownCapture,
            onTouchEndCapture: () => {
              thumbIndex.current = -1;
            },
            onMouseDownCapture: handleTrackMouseDownCapture,
            onMouseUpCapture: () => {
              thumbIndex.current = -1;
            },
            onKeyDownCapture: handleTrackKeydownCapture
          },
          children: [
             jsxRuntime.jsx(
              Thumb3,
              {
                ...sharedThumbProps,
                value: scale(_value[0]),
                position: positions[0],
                dragging: active,
                label: typeof label === "function" ? label(getFloatingValue(scale(_value[0]), precision)) : label,
                ref: (node) => {
                  thumbs.current[0] = node;
                },
                thumbLabel: thumbFromLabel,
                onMouseDown: () => handleThumbMouseDown(0),
                onFocus: () => setFocused(0),
                showLabelOnHover,
                isHovered: hovered,
                disabled,
                ...thumbProps?.(0),
                children: hasArrayThumbChildren ? thumbChildren[0] : thumbChildren
              }
            ),
             jsxRuntime.jsx(
              Thumb3,
              {
                ...sharedThumbProps,
                thumbLabel: thumbToLabel,
                value: scale(_value[1]),
                position: positions[1],
                dragging: active,
                label: typeof label === "function" ? label(getFloatingValue(scale(_value[1]), precision)) : label,
                ref: (node) => {
                  thumbs.current[1] = node;
                },
                onMouseDown: () => handleThumbMouseDown(1),
                onFocus: () => setFocused(1),
                showLabelOnHover,
                isHovered: hovered,
                disabled,
                ...thumbProps?.(1),
                children: hasArrayThumbChildren ? thumbChildren[1] : thumbChildren
              }
            )
          ]
        }
      ),
       jsxRuntime.jsx("input", { type: "hidden", name: `${name}_from`, value: _value[0], ...hiddenInputProps }),
       jsxRuntime.jsx("input", { type: "hidden", name: `${name}_to`, value: _value[1], ...hiddenInputProps })
    ] }) });
  });
  RangeSlider.classes = classes75;
  RangeSlider.displayName = "@mantine/core/RangeSlider";
  var defaultProps163 = {};
  var Space = factory((props, ref) => {
    const { w, h, miw, mih, ...others } = useProps("Space", defaultProps163, props);
    return  jsxRuntime.jsx(Box, { ref, ...others, w, miw: miw ?? w, h, mih: mih ?? h });
  });
  Space.displayName = "@mantine/core/Space";
  var classes76 = { "root": "m_559cce2d", "content": "m_b912df4e", "control": "m_b9131032" };
  var defaultProps164 = {
    maxHeight: 100,
    initialState: false
  };
  var varsResolver79 = createVarsResolver((_, { transitionDuration }) => ({
    root: {
      "--spoiler-transition-duration": transitionDuration !== void 0 ? `${transitionDuration}ms` : void 0
    }
  }));
  var Spoiler = factory((_props, ref) => {
    const props = useProps("Spoiler", defaultProps164, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      initialState,
      maxHeight,
      hideLabel,
      showLabel,
      children,
      controlRef,
      transitionDuration,
      id,
      expanded,
      onExpandedChange,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Spoiler",
      classes: classes76,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver79
    });
    const _id = hooks.useId(id);
    const regionId = `${_id}-region`;
    const [show, setShowState] = hooks.useUncontrolled({
      value: expanded,
      defaultValue: initialState,
      finalValue: false,
      onChange: onExpandedChange
    });
    const { ref: contentRef, height } = hooks.useElementSize();
    const spoilerMoreContent = show ? hideLabel : showLabel;
    const spoiler = spoilerMoreContent !== null && maxHeight < height;
    return  jsxRuntime.jsxs(
      Box,
      {
        ...getStyles2("root"),
        id: _id,
        ref,
        "data-has-spoiler": spoiler || void 0,
        ...others,
        children: [
          spoiler &&  jsxRuntime.jsx(
            Anchor,
            {
              component: "button",
              type: "button",
              ref: controlRef,
              onClick: () => setShowState(!show),
              "aria-expanded": show,
              "aria-controls": regionId,
              ...getStyles2("control"),
              children: spoilerMoreContent
            }
          ),
           jsxRuntime.jsx(
            "div",
            {
              ...getStyles2("content", {
                style: { maxHeight: !show ? rem(maxHeight) : height ? rem(height) : void 0 }
              }),
              "data-reduce-motion": true,
              role: "region",
              id: regionId,
              children:  jsxRuntime.jsx("div", { ref: contentRef, children })
            }
          )
        ]
      }
    );
  });
  Spoiler.classes = classes76;
  Spoiler.displayName = "@mantine/core/Spoiler";
  var classes77 = { "root": "m_6d731127" };
  var defaultProps165 = {
    gap: "md",
    align: "stretch",
    justify: "flex-start"
  };
  var varsResolver80 = createVarsResolver((_, { gap, align, justify }) => ({
    root: {
      "--stack-gap": getSpacing(gap),
      "--stack-align": align,
      "--stack-justify": justify
    }
  }));
  var Stack = factory((_props, ref) => {
    const props = useProps("Stack", defaultProps165, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      align,
      justify,
      gap,
      variant,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Stack",
      props,
      classes: classes77,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver80
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), variant, ...others });
  });
  Stack.classes = classes77;
  Stack.displayName = "@mantine/core/Stack";
  var [StepperProvider, useStepperContext] = createSafeContext(
    "Stepper component was not found in tree"
  );
  var StepperCompleted = () => null;
  StepperCompleted.displayName = "@mantine/core/StepperCompleted";
  var classes78 = { "root": "m_cbb4ea7e", "steps": "m_aaf89d0b", "separator": "m_2a371ac9", "content": "m_78da155d", "step": "m_cbb57068", "step--horizontal": "m_f56b1e2c", "step--vertical": "m_833edb7e", "verticalSeparator": "m_6496b3f3", "stepWrapper": "m_818e70b", "stepIcon": "m_1959ad01", "stepCompletedIcon": "m_a79331dc", "stepBody": "m_1956aa2a", "stepLabel": "m_12051f6c", "stepDescription": "m_164eea74" };
  var getStepFragment = (Fragment29, step) => {
    if (typeof Fragment29 === "function") {
      return  jsxRuntime.jsx(Fragment29, { step: step || 0 });
    }
    return Fragment29;
  };
  var defaultProps166 = {
    withIcon: true,
    allowStepClick: true,
    iconPosition: "left"
  };
  var StepperStep = factory((props, ref) => {
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      step,
      state,
      color,
      icon,
      completedIcon,
      progressIcon,
      label,
      description,
      withIcon,
      iconSize,
      loading,
      allowStepClick,
      allowStepSelect,
      iconPosition,
      orientation,
      mod,
      ...others
    } = useProps("StepperStep", defaultProps166, props);
    const ctx = useStepperContext();
    const theme = useMantineTheme();
    const stylesApi = { classNames, styles };
    const _icon = state === "stepCompleted" ? null : state === "stepProgress" ? progressIcon : icon;
    const dataAttributes = {
      "data-progress": state === "stepProgress" || void 0,
      "data-completed": state === "stepCompleted" || void 0
    };
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ...ctx.getStyles("step", { className, style, variant: ctx.orientation, ...stylesApi }),
        mod: [
          { "icon-position": iconPosition || ctx.iconPosition, "allow-click": allowStepClick },
          mod
        ],
        ref,
        ...dataAttributes,
        ...others,
        __vars: { "--step-color": color ? getThemeColor(color, theme) : void 0 },
        tabIndex: allowStepClick ? 0 : -1,
        children: [
          withIcon &&  jsxRuntime.jsxs("span", { ...ctx.getStyles("stepWrapper", stylesApi), children: [
             jsxRuntime.jsxs("span", { ...ctx.getStyles("stepIcon", stylesApi), ...dataAttributes, children: [
               jsxRuntime.jsx(Transition, { mounted: state === "stepCompleted", transition: "pop", duration: 200, children: (transitionStyles) =>  jsxRuntime.jsx(
                "span",
                {
                  ...ctx.getStyles("stepCompletedIcon", { style: transitionStyles, ...stylesApi }),
                  children: loading ?  jsxRuntime.jsx(
                    Loader,
                    {
                      color: "var(--mantine-color-white)",
                      size: "calc(var(--stepper-icon-size) / 2)",
                      ...ctx.getStyles("stepLoader", stylesApi)
                    }
                  ) : getStepFragment(completedIcon, step) ||  jsxRuntime.jsx(CheckIcon, { size: "60%" })
                }
              ) }),
              state !== "stepCompleted" ? loading ?  jsxRuntime.jsx(
                Loader,
                {
                  ...ctx.getStyles("stepLoader", stylesApi),
                  size: "calc(var(--stepper-icon-size) / 2)",
                  color
                }
              ) : getStepFragment(_icon || icon, step) : null
            ] }),
            orientation === "vertical" &&  jsxRuntime.jsx(
              "span",
              {
                ...ctx.getStyles("verticalSeparator", stylesApi),
                "data-active": state === "stepCompleted" || void 0
              }
            )
          ] }),
          (label || description) &&  jsxRuntime.jsxs(
            "span",
            {
              ...ctx.getStyles("stepBody", stylesApi),
              "data-orientation": ctx.orientation,
              "data-icon-position": iconPosition || ctx.iconPosition,
              children: [
                label &&  jsxRuntime.jsx("span", { ...ctx.getStyles("stepLabel", stylesApi), children: getStepFragment(label, step) }),
                description &&  jsxRuntime.jsx("span", { ...ctx.getStyles("stepDescription", stylesApi), children: getStepFragment(description, step) })
              ]
            }
          )
        ]
      }
    );
  });
  StepperStep.classes = classes78;
  StepperStep.displayName = "@mantine/core/StepperStep";
  var defaultProps167 = {
    orientation: "horizontal",
    iconPosition: "left",
    allowNextStepsSelect: true,
    wrap: true
  };
  var varsResolver81 = createVarsResolver(
    (theme, { color, iconSize, size: size4, contentPadding, radius, autoContrast }) => ({
      root: {
        "--stepper-color": color ? getThemeColor(color, theme) : void 0,
        "--stepper-icon-color": getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0,
        "--stepper-icon-size": iconSize === void 0 ? getSize(size4, "stepper-icon-size") : rem(iconSize),
        "--stepper-content-padding": getSpacing(contentPadding),
        "--stepper-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--stepper-fz": getFontSize(size4),
        "--stepper-spacing": getSpacing(size4)
      }
    })
  );
  var Stepper = factory((_props, ref) => {
    const props = useProps("Stepper", defaultProps167, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      onStepClick,
      active,
      icon,
      completedIcon,
      progressIcon,
      color,
      iconSize,
      contentPadding,
      orientation,
      iconPosition,
      size: size4,
      radius,
      allowNextStepsSelect,
      wrap,
      autoContrast,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Stepper",
      classes: classes78,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver81
    });
    const convertedChildren = React10.Children.toArray(children);
    const _children = convertedChildren.filter(
      (child) => child.type !== StepperCompleted
    );
    const completedStep = convertedChildren.find(
      (item) => item.type === StepperCompleted
    );
    const items = _children.reduce(
      (acc, item, index3) => {
        const state = active === index3 ? "stepProgress" : active > index3 ? "stepCompleted" : "stepInactive";
        const shouldAllowSelect = () => {
          if (typeof onStepClick !== "function") {
            return false;
          }
          if (typeof item.props.allowStepSelect === "boolean") {
            return item.props.allowStepSelect;
          }
          return state === "stepCompleted" || allowNextStepsSelect;
        };
        const isStepSelectionEnabled = shouldAllowSelect();
        acc.push(
          React10.cloneElement(item, {
            icon: item.props.icon || icon || index3 + 1,
            key: index3,
            step: index3,
            state,
            onClick: () => isStepSelectionEnabled && onStepClick?.(index3),
            allowStepClick: isStepSelectionEnabled,
            completedIcon: item.props.completedIcon || completedIcon,
            progressIcon: item.props.progressIcon || progressIcon,
            color: item.props.color || color,
            iconSize,
            iconPosition: item.props.iconPosition || iconPosition,
            orientation
          })
        );
        if (orientation === "horizontal" && index3 !== _children.length - 1) {
          acc.push(
             React10.createElement(
              "div",
              {
                ...getStyles2("separator"),
                "data-active": index3 < active || void 0,
                "data-orientation": orientation,
                key: `separator-${index3}`
              }
            )
          );
        }
        return acc;
      },
      []
    );
    const stepContent = _children[active]?.props?.children;
    const completedContent = completedStep?.props?.children;
    const content = active > _children.length - 1 ? completedContent : stepContent;
    return  jsxRuntime.jsx(StepperProvider, { value: { getStyles: getStyles2, orientation, iconPosition }, children:  jsxRuntime.jsxs(Box, { ...getStyles2("root"), ref, size: size4, ...others, children: [
       jsxRuntime.jsx(
        Box,
        {
          ...getStyles2("steps"),
          mod: {
            orientation,
            "icon-position": iconPosition,
            wrap: wrap && orientation !== "vertical"
          },
          children: items
        }
      ),
      content &&  jsxRuntime.jsx("div", { ...getStyles2("content"), children: content })
    ] }) });
  });
  Stepper.classes = classes78;
  Stepper.displayName = "@mantine/core/Stepper";
  Stepper.Completed = StepperCompleted;
  Stepper.Step = StepperStep;
  var SwitchGroupContext = React10.createContext(null);
  var SwitchGroupProvider = SwitchGroupContext.Provider;
  var useSwitchGroupContext = () => React10.useContext(SwitchGroupContext);
  var defaultProps168 = {};
  var SwitchGroup = factory((props, ref) => {
    const { value, defaultValue, onChange, size: size4, wrapperProps, children, readOnly, ...others } = useProps("SwitchGroup", defaultProps168, props);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: [],
      onChange
    });
    const handleChange = (event) => {
      const itemValue = event.currentTarget.value;
      !readOnly && setValue(
        _value.includes(itemValue) ? _value.filter((item) => item !== itemValue) : [..._value, itemValue]
      );
    };
    return  jsxRuntime.jsx(SwitchGroupProvider, { value: { value: _value, onChange: handleChange, size: size4 }, children:  jsxRuntime.jsx(
      Input.Wrapper,
      {
        size: size4,
        ref,
        ...wrapperProps,
        ...others,
        labelElement: "div",
        __staticSelector: "SwitchGroup",
        children:  jsxRuntime.jsx(InputsGroupFieldset, { role: "group", children })
      }
    ) });
  });
  SwitchGroup.classes = Input.Wrapper.classes;
  SwitchGroup.displayName = "@mantine/core/SwitchGroup";
  var classes79 = { "root": "m_5f93f3bb", "input": "m_926b4011", "track": "m_9307d992", "thumb": "m_93039a1d", "trackLabel": "m_8277e082" };
  var defaultProps169 = {
    labelPosition: "right"
  };
  var varsResolver82 = createVarsResolver((theme, { radius, color, size: size4 }) => ({
    root: {
      "--switch-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--switch-height": getSize(size4, "switch-height"),
      "--switch-width": getSize(size4, "switch-width"),
      "--switch-thumb-size": getSize(size4, "switch-thumb-size"),
      "--switch-label-font-size": getSize(size4, "switch-label-font-size"),
      "--switch-track-label-padding": getSize(size4, "switch-track-label-padding"),
      "--switch-color": color ? getThemeColor(color, theme) : void 0
    }
  }));
  var Switch = factory((_props, ref) => {
    const props = useProps("Switch", defaultProps169, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      color,
      label,
      offLabel,
      onLabel,
      id,
      size: size4,
      radius,
      wrapperProps,
      thumbIcon,
      checked,
      defaultChecked,
      onChange,
      labelPosition,
      description,
      error: error2,
      disabled,
      variant,
      rootRef,
      mod,
      ...others
    } = props;
    const ctx = useSwitchGroupContext();
    const _size = size4 || ctx?.size;
    const getStyles2 = useStyles({
      name: "Switch",
      props,
      classes: classes79,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver82
    });
    const { styleProps, rest } = extractStyleProps(others);
    const uuid = hooks.useId(id);
    const contextProps = ctx ? {
      checked: ctx.value.includes(rest.value),
      onChange: ctx.onChange
    } : {};
    const [_checked, handleChange] = hooks.useUncontrolled({
      value: contextProps.checked ?? checked,
      defaultValue: defaultChecked,
      finalValue: false
    });
    return  jsxRuntime.jsxs(
      InlineInput,
      {
        ...getStyles2("root"),
        __staticSelector: "Switch",
        __stylesApiProps: props,
        id: uuid,
        size: _size,
        labelPosition,
        label,
        description,
        error: error2,
        disabled,
        bodyElement: "label",
        labelElement: "span",
        classNames,
        styles,
        unstyled,
        "data-checked": contextProps.checked || checked || void 0,
        variant,
        ref: rootRef,
        mod,
        ...styleProps,
        ...wrapperProps,
        children: [
           jsxRuntime.jsx(
            "input",
            {
              ...rest,
              disabled,
              checked: _checked,
              "data-checked": contextProps.checked || checked || void 0,
              onChange: (event) => {
                ctx ? contextProps.onChange?.(event) : onChange?.(event);
                handleChange(event.currentTarget.checked);
              },
              id: uuid,
              ref,
              type: "checkbox",
              role: "switch",
              ...getStyles2("input")
            }
          ),
           jsxRuntime.jsxs(
            Box,
            {
              "aria-hidden": "true",
              mod: { error: error2, "label-position": labelPosition, "without-labels": !onLabel && !offLabel },
              ...getStyles2("track"),
              children: [
                 jsxRuntime.jsx(Box, { component: "span", mod: "reduce-motion", ...getStyles2("thumb"), children: thumbIcon }),
                 jsxRuntime.jsx("span", { ...getStyles2("trackLabel"), children: _checked ? onLabel : offLabel })
              ]
            }
          )
        ]
      }
    );
  });
  Switch.classes = { ...classes79, ...InlineInputClasses };
  Switch.displayName = "@mantine/core/Switch";
  Switch.Group = SwitchGroup;
  var [TableProvider, useTableContext] = createSafeContext(
    "Table component was not found in the tree"
  );
  var classes80 = { "table": "m_b23fa0ef", "th": "m_4e7aa4f3", "tr": "m_4e7aa4fd", "td": "m_4e7aa4ef", "tbody": "m_b2404537", "thead": "m_b242d975", "caption": "m_9e5a3ac7", "scrollContainer": "m_a100c15", "scrollContainerInner": "m_62259741" };
  function getDataAttributes(ctx, options) {
    if (!options) {
      return void 0;
    }
    const data = {};
    if (options.columnBorder && ctx.withColumnBorders) {
      data["data-with-column-border"] = true;
    }
    if (options.rowBorder && ctx.withRowBorders) {
      data["data-with-row-border"] = true;
    }
    if (options.striped && ctx.striped) {
      data["data-striped"] = ctx.striped;
    }
    if (options.highlightOnHover && ctx.highlightOnHover) {
      data["data-hover"] = true;
    }
    if (options.captionSide && ctx.captionSide) {
      data["data-side"] = ctx.captionSide;
    }
    if (options.stickyHeader && ctx.stickyHeader) {
      data["data-sticky"] = true;
    }
    return data;
  }
  function tableElement(element, options) {
    const name = `Table${element.charAt(0).toUpperCase()}${element.slice(1)}`;
    const Component = factory((_props, ref) => {
      const props = useProps(name, {}, _props);
      const { classNames, className, style, styles, ...others } = props;
      const ctx = useTableContext();
      return  jsxRuntime.jsx(
        Box,
        {
          component: element,
          ref,
          ...getDataAttributes(ctx, options),
          ...ctx.getStyles(element, { className, classNames, style, styles, props }),
          ...others
        }
      );
    });
    Component.displayName = `@mantine/core/${name}`;
    Component.classes = classes80;
    return Component;
  }
  var TableTh = tableElement("th", { columnBorder: true });
  var TableTd = tableElement("td", { columnBorder: true });
  var TableTr = tableElement("tr", {
    rowBorder: true,
    striped: true,
    highlightOnHover: true
  });
  var TableThead = tableElement("thead", { stickyHeader: true });
  var TableTbody = tableElement("tbody");
  var TableTfoot = tableElement("tfoot");
  var TableCaption = tableElement("caption", { captionSide: true });
  function TableDataRenderer({ data }) {
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      data.caption &&  jsxRuntime.jsx(TableCaption, { children: data.caption }),
      data.head &&  jsxRuntime.jsx(TableThead, { children:  jsxRuntime.jsx(TableTr, { children: data.head.map((item, index3) =>  jsxRuntime.jsx(TableTh, { children: item }, index3)) }) }),
      data.body &&  jsxRuntime.jsx(TableTbody, { children: data.body.map((row, rowIndex) =>  jsxRuntime.jsx(TableTr, { children: row.map((item, index3) =>  jsxRuntime.jsx(TableTd, { children: item }, index3)) }, rowIndex)) }),
      data.foot &&  jsxRuntime.jsx(TableTfoot, { children:  jsxRuntime.jsx(TableTr, { children: data.foot.map((item, index3) =>  jsxRuntime.jsx(TableTh, { children: item }, index3)) }) })
    ] });
  }
  TableDataRenderer.displayName = "@mantine/core/TableDataRenderer";
  var defaultProps170 = {
    type: "scrollarea"
  };
  var varsResolver83 = createVarsResolver((_, { minWidth, type }) => ({
    scrollContainer: {
      "--table-min-width": rem(minWidth),
      "--table-overflow": type === "native" ? "auto" : void 0
    }
  }));
  var TableScrollContainer = factory((_props, ref) => {
    const props = useProps("TableScrollContainer", defaultProps170, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      minWidth,
      type,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "TableScrollContainer",
      classes: classes80,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver83,
      rootSelector: "scrollContainer"
    });
    return  jsxRuntime.jsx(
      Box,
      {
        component: type === "scrollarea" ? ScrollArea : "div",
        ...type === "scrollarea" ? { offsetScrollbars: "x" } : {},
        ref,
        ...getStyles2("scrollContainer"),
        ...others,
        children:  jsxRuntime.jsx("div", { ...getStyles2("scrollContainerInner"), children })
      }
    );
  });
  TableScrollContainer.classes = classes80;
  TableScrollContainer.displayName = "@mantine/core/TableScrollContainer";
  var defaultProps171 = {
    withRowBorders: true,
    verticalSpacing: 7
  };
  var varsResolver84 = createVarsResolver(
    (theme, {
      layout,
      captionSide,
      horizontalSpacing,
      verticalSpacing,
      borderColor,
      stripedColor,
      highlightOnHoverColor,
      striped,
      highlightOnHover,
      stickyHeaderOffset,
      stickyHeader
    }) => ({
      table: {
        "--table-layout": layout,
        "--table-caption-side": captionSide,
        "--table-horizontal-spacing": getSpacing(horizontalSpacing),
        "--table-vertical-spacing": getSpacing(verticalSpacing),
        "--table-border-color": borderColor ? getThemeColor(borderColor, theme) : void 0,
        "--table-striped-color": striped && stripedColor ? getThemeColor(stripedColor, theme) : void 0,
        "--table-highlight-on-hover-color": highlightOnHover && highlightOnHoverColor ? getThemeColor(highlightOnHoverColor, theme) : void 0,
        "--table-sticky-header-offset": stickyHeader ? rem(stickyHeaderOffset) : void 0
      }
    })
  );
  var Table = factory((_props, ref) => {
    const props = useProps("Table", defaultProps171, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      horizontalSpacing,
      verticalSpacing,
      captionSide,
      stripedColor,
      highlightOnHoverColor,
      striped,
      highlightOnHover,
      withColumnBorders,
      withRowBorders,
      withTableBorder,
      borderColor,
      layout,
      variant,
      data,
      children,
      stickyHeader,
      stickyHeaderOffset,
      mod,
      tabularNums,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Table",
      props,
      className,
      style,
      classes: classes80,
      classNames,
      styles,
      unstyled,
      rootSelector: "table",
      vars,
      varsResolver: varsResolver84
    });
    return  jsxRuntime.jsx(
      TableProvider,
      {
        value: {
          getStyles: getStyles2,
          stickyHeader,
          striped: striped === true ? "odd" : striped || void 0,
          highlightOnHover,
          withColumnBorders,
          withRowBorders,
          captionSide: captionSide || "bottom"
        },
        children:  jsxRuntime.jsx(
          Box,
          {
            component: "table",
            variant,
            ref,
            mod: [{ "data-with-table-border": withTableBorder, "data-tabular-nums": tabularNums }, mod],
            ...getStyles2("table"),
            ...others,
            children: children || !!data &&  jsxRuntime.jsx(TableDataRenderer, { data })
          }
        )
      }
    );
  });
  Table.classes = classes80;
  Table.displayName = "@mantine/core/Table";
  Table.Td = TableTd;
  Table.Th = TableTh;
  Table.Tr = TableTr;
  Table.Thead = TableThead;
  Table.Tbody = TableTbody;
  Table.Tfoot = TableTfoot;
  Table.Caption = TableCaption;
  Table.ScrollContainer = TableScrollContainer;
  Table.DataRenderer = TableDataRenderer;
  var [TabsProvider, useTabsContext] = createSafeContext(
    "Tabs component was not found in the tree"
  );
  var classes81 = { "root": "m_89d60db1", "list--default": "m_576c9d4", "list": "m_89d33d6d", "panel": "m_b0c91715", "tab": "m_4ec4dce6", "tabSection": "m_fc420b1f", "tab--default": "m_539e827b", "list--outline": "m_6772fbd5", "tab--outline": "m_b59ab47c", "tab--pills": "m_c3381914" };
  var defaultProps172 = {};
  var TabsList = factory((_props, ref) => {
    const props = useProps("TabsList", defaultProps172, _props);
    const { children, className, grow, justify, classNames, styles, style, mod, ...others } = props;
    const ctx = useTabsContext();
    return  jsxRuntime.jsx(
      Box,
      {
        ...others,
        ...ctx.getStyles("list", {
          className,
          style,
          classNames,
          styles,
          props,
          variant: ctx.variant
        }),
        ref,
        role: "tablist",
        variant: ctx.variant,
        mod: [
          {
            grow,
            orientation: ctx.orientation,
            placement: ctx.orientation === "vertical" && ctx.placement,
            inverted: ctx.inverted
          },
          mod
        ],
        "aria-orientation": ctx.orientation,
        __vars: { "--tabs-justify": justify },
        children
      }
    );
  });
  TabsList.classes = classes81;
  TabsList.displayName = "@mantine/core/TabsList";
  var defaultProps173 = {};
  var TabsPanel = factory((_props, ref) => {
    const props = useProps("TabsPanel", defaultProps173, _props);
    const { children, className, value, classNames, styles, style, mod, keepMounted, ...others } = props;
    const ctx = useTabsContext();
    const active = ctx.value === value;
    const content = ctx.keepMounted || keepMounted ? children : active ? children : null;
    return  jsxRuntime.jsx(
      Box,
      {
        ...others,
        ...ctx.getStyles("panel", {
          className,
          classNames,
          styles,
          style: [style, !active ? { display: "none" } : void 0],
          props
        }),
        ref,
        mod: [{ orientation: ctx.orientation }, mod],
        role: "tabpanel",
        id: ctx.getPanelId(value),
        "aria-labelledby": ctx.getTabId(value),
        children: content
      }
    );
  });
  TabsPanel.classes = classes81;
  TabsPanel.displayName = "@mantine/core/TabsPanel";
  var defaultProps174 = {};
  var TabsTab = factory((_props, ref) => {
    const props = useProps("TabsTab", defaultProps174, _props);
    const {
      className,
      children,
      rightSection,
      leftSection,
      value,
      onClick,
      onKeyDown,
      disabled,
      color,
      style,
      classNames,
      styles,
      vars,
      mod,
      tabIndex,
      ...others
    } = props;
    const theme = useMantineTheme();
    const { dir } = useDirection();
    const ctx = useTabsContext();
    const active = value === ctx.value;
    const activateTab = (event) => {
      ctx.onChange(ctx.allowTabDeactivation ? value === ctx.value ? null : value : value);
      onClick?.(event);
    };
    const stylesApiProps = { classNames, styles, props };
    return  jsxRuntime.jsxs(
      UnstyledButton,
      {
        ...others,
        ...ctx.getStyles("tab", { className, style, variant: ctx.variant, ...stylesApiProps }),
        disabled,
        unstyled: ctx.unstyled,
        variant: ctx.variant,
        mod: [
          {
            active,
            disabled,
            orientation: ctx.orientation,
            inverted: ctx.inverted,
            placement: ctx.orientation === "vertical" && ctx.placement
          },
          mod
        ],
        ref,
        role: "tab",
        id: ctx.getTabId(value),
        "aria-selected": active,
        tabIndex: tabIndex || active || ctx.value === null ? 0 : -1,
        "aria-controls": ctx.getPanelId(value),
        onClick: activateTab,
        __vars: { "--tabs-color": color ? getThemeColor(color, theme) : void 0 },
        onKeyDown: createScopedKeydownHandler({
          siblingSelector: '[role="tab"]',
          parentSelector: '[role="tablist"]',
          activateOnFocus: ctx.activateTabWithKeyboard,
          loop: ctx.loop,
          orientation: ctx.orientation || "horizontal",
          dir,
          onKeyDown
        }),
        children: [
          leftSection &&  jsxRuntime.jsx("span", { ...ctx.getStyles("tabSection", stylesApiProps), "data-position": "left", children: leftSection }),
          children &&  jsxRuntime.jsx("span", { ...ctx.getStyles("tabLabel", stylesApiProps), children }),
          rightSection &&  jsxRuntime.jsx("span", { ...ctx.getStyles("tabSection", stylesApiProps), "data-position": "right", children: rightSection })
        ]
      }
    );
  });
  TabsTab.classes = classes81;
  TabsTab.displayName = "@mantine/core/TabsTab";
  var VALUE_ERROR = "Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value";
  var defaultProps175 = {
    keepMounted: true,
    orientation: "horizontal",
    loop: true,
    activateTabWithKeyboard: true,
    allowTabDeactivation: false,
    unstyled: false,
    inverted: false,
    variant: "default",
    placement: "left"
  };
  var varsResolver85 = createVarsResolver((theme, { radius, color, autoContrast }) => ({
    root: {
      "--tabs-radius": getRadius(radius),
      "--tabs-color": getThemeColor(color, theme),
      "--tabs-text-color": getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
    }
  }));
  var Tabs = factory((_props, ref) => {
    const props = useProps("Tabs", defaultProps175, _props);
    const {
      defaultValue,
      value,
      onChange,
      orientation,
      children,
      loop,
      id,
      activateTabWithKeyboard,
      allowTabDeactivation,
      variant,
      color,
      radius,
      inverted,
      placement,
      keepMounted,
      classNames,
      styles,
      unstyled,
      className,
      style,
      vars,
      autoContrast,
      mod,
      ...others
    } = props;
    const uid = hooks.useId(id);
    const [currentTab, setCurrentTab] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: null,
      onChange
    });
    const getStyles2 = useStyles({
      name: "Tabs",
      props,
      classes: classes81,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver85
    });
    return  jsxRuntime.jsx(
      TabsProvider,
      {
        value: {
          placement,
          value: currentTab,
          orientation,
          id: uid,
          loop,
          activateTabWithKeyboard,
          getTabId: getSafeId(`${uid}-tab`, VALUE_ERROR),
          getPanelId: getSafeId(`${uid}-panel`, VALUE_ERROR),
          onChange: setCurrentTab,
          allowTabDeactivation,
          variant,
          color,
          radius,
          inverted,
          keepMounted,
          unstyled,
          getStyles: getStyles2
        },
        children:  jsxRuntime.jsx(
          Box,
          {
            ref,
            id: uid,
            variant,
            mod: [
              {
                orientation,
                inverted: orientation === "horizontal" && inverted,
                placement: orientation === "vertical" && placement
              },
              mod
            ],
            ...getStyles2("root"),
            ...others,
            children
          }
        )
      }
    );
  });
  Tabs.classes = classes81;
  Tabs.displayName = "@mantine/core/Tabs";
  Tabs.Tab = TabsTab;
  Tabs.Panel = TabsPanel;
  Tabs.List = TabsList;
  function filterPickedTags({ data, value }) {
    const normalizedValue = value.map((item) => item.trim().toLowerCase());
    const filtered = data.reduce((acc, item) => {
      if (isOptionsGroup(item)) {
        acc.push({
          group: item.group,
          items: item.items.filter(
            (option) => normalizedValue.indexOf(option.label.toLowerCase().trim()) === -1
          )
        });
      } else if (normalizedValue.indexOf(item.label.toLowerCase().trim()) === -1) {
        acc.push(item);
      }
      return acc;
    }, []);
    return filtered;
  }
  function splitTags(splitChars, value) {
    if (!splitChars) {
      return [value];
    }
    return value.split(new RegExp(`[${splitChars.join("")}]`)).map((tag) => tag.trim()).filter((tag) => tag !== "");
  }
  function getSplittedTags({
    splitChars,
    allowDuplicates,
    maxTags,
    value,
    currentTags
  }) {
    const splitted = splitTags(splitChars, value);
    const merged = allowDuplicates ? [...currentTags, ...splitted] : [... new Set([...currentTags, ...splitted])];
    return maxTags ? merged.slice(0, maxTags) : merged;
  }
  var defaultProps176 = {
    maxTags: Infinity,
    allowDuplicates: false,
    acceptValueOnBlur: true,
    splitChars: [","],
    hiddenInputValuesDivider: ","
  };
  var TagsInput = factory((_props, ref) => {
    const props = useProps("TagsInput", defaultProps176, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      size: size4,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      maxTags,
      allowDuplicates,
      onDuplicate,
      variant,
      data,
      dropdownOpened,
      defaultDropdownOpened,
      onDropdownOpen,
      onDropdownClose,
      selectFirstOptionOnChange,
      onOptionSubmit,
      comboboxProps,
      filter,
      limit,
      withScrollArea,
      maxDropdownHeight,
      searchValue,
      defaultSearchValue,
      onSearchChange,
      readOnly,
      disabled,
      splitChars,
      onFocus,
      onBlur,
      onPaste,
      radius,
      rightSection,
      rightSectionWidth,
      rightSectionPointerEvents,
      rightSectionProps,
      leftSection,
      leftSectionWidth,
      leftSectionPointerEvents,
      leftSectionProps,
      inputContainer,
      inputWrapperOrder,
      withAsterisk,
      required,
      labelProps,
      descriptionProps,
      errorProps,
      wrapperProps,
      description,
      label,
      error: error2,
      withErrorStyles,
      name,
      form,
      id,
      clearable,
      clearButtonProps,
      hiddenInputProps,
      hiddenInputValuesDivider,
      mod,
      renderOption,
      onRemove,
      onClear,
      scrollAreaProps,
      acceptValueOnBlur,
      ...others
    } = props;
    const _id = hooks.useId(id);
    const parsedData = getParsedComboboxData(data);
    const optionsLockup = getOptionsLockup(parsedData);
    const inputRef = React10.useRef(null);
    const _ref = hooks.useMergedRef(inputRef, ref);
    const combobox = useCombobox({
      opened: dropdownOpened,
      defaultOpened: defaultDropdownOpened,
      onDropdownOpen,
      onDropdownClose: () => {
        onDropdownClose?.();
        combobox.resetSelectedOption();
      }
    });
    const {
      styleProps,
      rest: { type, autoComplete, ...rest }
    } = extractStyleProps(others);
    const [_value, setValue] = hooks.useUncontrolled({
      value,
      defaultValue,
      finalValue: [],
      onChange
    });
    const [_searchValue, setSearchValue] = hooks.useUncontrolled({
      value: searchValue,
      defaultValue: defaultSearchValue,
      finalValue: "",
      onChange: onSearchChange
    });
    const getStyles2 = useStyles({
      name: "TagsInput",
      classes: {},
      props,
      classNames,
      styles,
      unstyled
    });
    const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
      props,
      styles,
      classNames
    });
    const handleValueSelect = (val) => {
      const isDuplicate = _value.some((tag) => tag.toLowerCase() === val.toLowerCase());
      if (isDuplicate) {
        onDuplicate?.(val);
      }
      if ((!isDuplicate || isDuplicate && allowDuplicates) && _value.length < maxTags) {
        onOptionSubmit?.(val);
        setSearchValue("");
        if (val.length > 0) {
          setValue([..._value, val]);
        }
      }
    };
    const handleInputKeydown = (event) => {
      onKeyDown?.(event);
      if (event.isPropagationStopped()) {
        return;
      }
      const inputValue = _searchValue.trim();
      const { length } = inputValue;
      if (splitChars.includes(event.key) && length > 0) {
        setValue(
          getSplittedTags({
            splitChars,
            allowDuplicates,
            maxTags,
            value: _searchValue,
            currentTags: _value
          })
        );
        setSearchValue("");
        event.preventDefault();
      }
      if (event.key === "Enter" && length > 0 && !event.nativeEvent.isComposing) {
        event.preventDefault();
        const hasActiveSelection = !!document.querySelector(
          `#${combobox.listId} [data-combobox-option][data-combobox-selected]`
        );
        if (hasActiveSelection) {
          return;
        }
        handleValueSelect(inputValue);
      }
      if (event.key === "Backspace" && length === 0 && _value.length > 0 && !event.nativeEvent.isComposing) {
        onRemove?.(_value[_value.length - 1]);
        setValue(_value.slice(0, _value.length - 1));
      }
    };
    const handlePaste = (event) => {
      onPaste?.(event);
      event.preventDefault();
      if (event.clipboardData) {
        const pastedText = event.clipboardData.getData("text/plain");
        setValue(
          getSplittedTags({
            splitChars,
            allowDuplicates,
            maxTags,
            value: `${_searchValue}${pastedText}`,
            currentTags: _value
          })
        );
        setSearchValue("");
      }
    };
    const values2 = _value.map((item, index3) =>  jsxRuntime.jsx(
      Pill,
      {
        withRemoveButton: !readOnly,
        onRemove: () => {
          const next_value = _value.slice();
          next_value.splice(index3, 1);
          setValue(next_value);
          onRemove?.(item);
        },
        unstyled,
        disabled,
        ...getStyles2("pill"),
        children: item
      },
      `${item}-${index3}`
    ));
    React10.useEffect(() => {
      if (selectFirstOptionOnChange) {
        combobox.selectFirstOption();
      }
    }, [selectFirstOptionOnChange, _value, _searchValue]);
    const clearButton = clearable && _value.length > 0 && !disabled && !readOnly &&  jsxRuntime.jsx(
      Combobox.ClearButton,
      {
        size: size4,
        ...clearButtonProps,
        onClear: () => {
          setValue([]);
          setSearchValue("");
          inputRef.current?.focus();
          combobox.openDropdown();
          onClear?.();
        }
      }
    );
    return  jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
       jsxRuntime.jsxs(
        Combobox,
        {
          store: combobox,
          classNames: resolvedClassNames,
          styles: resolvedStyles,
          unstyled,
          size: size4,
          readOnly,
          __staticSelector: "TagsInput",
          onOptionSubmit: (val) => {
            onOptionSubmit?.(val);
            setSearchValue("");
            _value.length < maxTags && setValue([..._value, optionsLockup[val].label]);
            combobox.resetSelectedOption();
          },
          ...comboboxProps,
          children: [
             jsxRuntime.jsx(Combobox.DropdownTarget, { children:  jsxRuntime.jsx(
              PillsInput,
              {
                ...styleProps,
                __staticSelector: "TagsInput",
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                unstyled,
                size: size4,
                className,
                style,
                variant,
                disabled,
                radius,
                rightSection: rightSection || clearButton,
                rightSectionWidth,
                rightSectionPointerEvents,
                rightSectionProps,
                leftSection,
                leftSectionWidth,
                leftSectionPointerEvents,
                leftSectionProps,
                inputContainer,
                inputWrapperOrder,
                withAsterisk,
                required,
                labelProps,
                descriptionProps,
                errorProps,
                wrapperProps,
                description,
                label,
                error: error2,
                multiline: true,
                withErrorStyles,
                __stylesApiProps: { ...props, multiline: true },
                id: _id,
                mod,
                children:  jsxRuntime.jsxs(Pill.Group, { disabled, unstyled, ...getStyles2("pillsList"), children: [
                  values2,
                   jsxRuntime.jsx(Combobox.EventsTarget, { autoComplete, children:  jsxRuntime.jsx(
                    PillsInput.Field,
                    {
                      ...rest,
                      ref: _ref,
                      ...getStyles2("inputField"),
                      unstyled,
                      onKeyDown: handleInputKeydown,
                      onFocus: (event) => {
                        onFocus?.(event);
                        combobox.openDropdown();
                      },
                      onBlur: (event) => {
                        onBlur?.(event);
                        acceptValueOnBlur && handleValueSelect(_searchValue);
                        combobox.closeDropdown();
                      },
                      onPaste: handlePaste,
                      value: _searchValue,
                      onChange: (event) => setSearchValue(event.currentTarget.value),
                      required: required && _value.length === 0,
                      disabled,
                      readOnly,
                      id: _id
                    }
                  ) })
                ] })
              }
            ) }),
             jsxRuntime.jsx(
              OptionsDropdown,
              {
                data: filterPickedTags({ data: parsedData, value: _value }),
                hidden: readOnly || disabled,
                filter,
                search: _searchValue,
                limit,
                hiddenWhenEmpty: true,
                withScrollArea,
                maxDropdownHeight,
                unstyled,
                labelId: label ? `${_id}-label` : void 0,
                "aria-label": label ? void 0 : others["aria-label"],
                renderOption,
                scrollAreaProps
              }
            )
          ]
        }
      ),
       jsxRuntime.jsx(
        Combobox.HiddenInput,
        {
          name,
          form,
          value: _value,
          valuesDivider: hiddenInputValuesDivider,
          disabled,
          ...hiddenInputProps
        }
      )
    ] });
  });
  TagsInput.classes = { ...InputBase.classes, ...Combobox.classes };
  TagsInput.displayName = "@mantine/core/TagsInput";
  var defaultProps177 = {};
  var TextInput = factory((props, ref) => {
    const _props = useProps("TextInput", defaultProps177, props);
    return  jsxRuntime.jsx(InputBase, { component: "input", ref, ..._props, __staticSelector: "TextInput" });
  });
  TextInput.classes = InputBase.classes;
  TextInput.displayName = "@mantine/core/TextInput";
  var classes82 = { "root": "m_7341320d" };
  var defaultProps178 = {};
  var varsResolver86 = createVarsResolver(
    (theme, { size: size4, radius, variant, gradient, color, autoContrast }) => {
      const colors = theme.variantColorResolver({
        color: color || theme.primaryColor,
        theme,
        gradient,
        variant: variant || "filled",
        autoContrast
      });
      return {
        root: {
          "--ti-size": getSize(size4, "ti-size"),
          "--ti-radius": radius === void 0 ? void 0 : getRadius(radius),
          "--ti-bg": color || variant ? colors.background : void 0,
          "--ti-color": color || variant ? colors.color : void 0,
          "--ti-bd": color || variant ? colors.border : void 0
        }
      };
    }
  );
  var ThemeIcon = factory((_props, ref) => {
    const props = useProps("ThemeIcon", defaultProps178, _props);
    const { classNames, className, style, styles, unstyled, vars, autoContrast, ...others } = props;
    const getStyles2 = useStyles({
      name: "ThemeIcon",
      classes: classes82,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver86
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others });
  });
  ThemeIcon.classes = classes82;
  ThemeIcon.displayName = "@mantine/core/ThemeIcon";
  var [TimelineProvider, useTimelineContext] = createSafeContext(
    "Timeline component was not found in tree"
  );
  var classes83 = { "root": "m_43657ece", "itemTitle": "m_2ebe8099", "item": "m_436178ff", "itemBullet": "m_8affcee1", "itemBody": "m_540e8f41" };
  var defaultProps179 = {};
  var TimelineItem = factory((_props, ref) => {
    const props = useProps("TimelineItem", defaultProps179, _props);
    const {
      classNames,
      className,
      style,
      styles,
      vars,
      __active,
      __align,
      __lineActive,
      __vars,
      bullet,
      radius,
      color,
      lineVariant,
      children,
      title,
      mod,
      ...others
    } = props;
    const ctx = useTimelineContext();
    const theme = useMantineTheme();
    const stylesApiProps = { classNames, styles };
    return  jsxRuntime.jsxs(
      Box,
      {
        ...ctx.getStyles("item", { ...stylesApiProps, className, style }),
        mod: [{ "line-active": __lineActive, active: __active }, mod],
        ref,
        __vars: {
          "--tli-radius": radius ? getRadius(radius) : void 0,
          "--tli-color": color ? getThemeColor(color, theme) : void 0,
          "--tli-border-style": lineVariant || void 0
        },
        ...others,
        children: [
           jsxRuntime.jsx(
            Box,
            {
              ...ctx.getStyles("itemBullet", stylesApiProps),
              mod: { "with-child": !!bullet, align: __align, active: __active },
              children: bullet
            }
          ),
           jsxRuntime.jsxs("div", { ...ctx.getStyles("itemBody", stylesApiProps), children: [
            title &&  jsxRuntime.jsx("div", { ...ctx.getStyles("itemTitle", stylesApiProps), children: title }),
             jsxRuntime.jsx("div", { ...ctx.getStyles("itemContent", stylesApiProps), children })
          ] })
        ]
      }
    );
  });
  TimelineItem.classes = classes83;
  TimelineItem.displayName = "@mantine/core/TimelineItem";
  var defaultProps180 = {
    active: -1,
    align: "left",
    reverseActive: false
  };
  var varsResolver87 = createVarsResolver(
    (theme, { bulletSize, lineWidth, radius, color, autoContrast }) => ({
      root: {
        "--tl-bullet-size": rem(bulletSize),
        "--tl-line-width": rem(lineWidth),
        "--tl-radius": radius === void 0 ? void 0 : getRadius(radius),
        "--tl-color": color ? getThemeColor(color, theme) : void 0,
        "--tl-icon-color": getAutoContrastValue(autoContrast, theme) ? getContrastColor({ color, theme, autoContrast }) : void 0
      }
    })
  );
  var Timeline = factory((_props, ref) => {
    const props = useProps("Timeline", defaultProps180, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      children,
      active,
      color,
      radius,
      bulletSize,
      align,
      lineWidth,
      reverseActive,
      mod,
      autoContrast,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Timeline",
      classes: classes83,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver87
    });
    const _children = React10.Children.toArray(children);
    const items = _children.map(
      (item, index3) => React10.cloneElement(item, {
        unstyled,
        __align: align,
        __active: item.props?.active || (reverseActive ? active >= _children.length - index3 - 1 : active >= index3),
        __lineActive: item.props?.lineActive || (reverseActive ? active >= _children.length - index3 - 1 : active - 1 >= index3)
      })
    );
    return  jsxRuntime.jsx(TimelineProvider, { value: { getStyles: getStyles2 }, children:  jsxRuntime.jsx(Box, { ...getStyles2("root"), mod: [{ align }, mod], ref, ...others, children: items }) });
  });
  Timeline.classes = classes83;
  Timeline.displayName = "@mantine/core/Timeline";
  Timeline.Item = TimelineItem;
  var headings3 = ["h1", "h2", "h3", "h4", "h5", "h6"];
  var sizes = ["xs", "sm", "md", "lg", "xl"];
  function getTitleSize(order, size4) {
    const titleSize = size4 !== void 0 ? size4 : `h${order}`;
    if (headings3.includes(titleSize)) {
      return {
        fontSize: `var(--mantine-${titleSize}-font-size)`,
        fontWeight: `var(--mantine-${titleSize}-font-weight)`,
        lineHeight: `var(--mantine-${titleSize}-line-height)`
      };
    } else if (sizes.includes(titleSize)) {
      return {
        fontSize: `var(--mantine-font-size-${titleSize})`,
        fontWeight: `var(--mantine-h${order}-font-weight)`,
        lineHeight: `var(--mantine-h${order}-line-height)`
      };
    }
    return {
      fontSize: rem(titleSize),
      fontWeight: `var(--mantine-h${order}-font-weight)`,
      lineHeight: `var(--mantine-h${order}-line-height)`
    };
  }
  var classes84 = { "root": "m_8a5d1357" };
  var defaultProps181 = {
    order: 1
  };
  var varsResolver88 = createVarsResolver((_, { order, size: size4, lineClamp, textWrap }) => {
    const sizeVariables = getTitleSize(order, size4);
    return {
      root: {
        "--title-fw": sizeVariables.fontWeight,
        "--title-lh": sizeVariables.lineHeight,
        "--title-fz": sizeVariables.fontSize,
        "--title-line-clamp": typeof lineClamp === "number" ? lineClamp.toString() : void 0,
        "--title-text-wrap": textWrap
      }
    };
  });
  var Title = factory((_props, ref) => {
    const props = useProps("Title", defaultProps181, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      order,
      vars,
      size: size4,
      variant,
      lineClamp,
      textWrap,
      mod,
      ...others
    } = props;
    const getStyles2 = useStyles({
      name: "Title",
      props,
      classes: classes84,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver88
    });
    if (![1, 2, 3, 4, 5, 6].includes(order)) {
      return null;
    }
    return  jsxRuntime.jsx(
      Box,
      {
        ...getStyles2("root"),
        component: `h${order}`,
        variant,
        ref,
        mod: [{ order, "data-line-clamp": typeof lineClamp === "number" }, mod],
        size: size4,
        ...others
      }
    );
  });
  Title.classes = classes84;
  Title.displayName = "@mantine/core/Title";
  function getValuesRange(anchor, value, flatValues) {
    if (!anchor || !value) {
      return [];
    }
    const anchorIndex = flatValues.indexOf(anchor);
    const valueIndex = flatValues.indexOf(value);
    const start = Math.min(anchorIndex, valueIndex);
    const end = Math.max(anchorIndex, valueIndex);
    return flatValues.slice(start, end + 1);
  }
  function TreeNode({
    node,
    getStyles: getStyles2,
    rootIndex,
    controller,
    expandOnClick,
    selectOnClick,
    isSubtree,
    level = 1,
    renderNode,
    flatValues,
    allowRangeSelection,
    expandOnSpace,
    checkOnSpace
  }) {
    const ref = React10.useRef(null);
    const nested = (node.children || []).map((child) =>  jsxRuntime.jsx(
      TreeNode,
      {
        node: child,
        flatValues,
        getStyles: getStyles2,
        rootIndex: void 0,
        level: level + 1,
        controller,
        expandOnClick,
        isSubtree: true,
        renderNode,
        selectOnClick,
        allowRangeSelection,
        expandOnSpace,
        checkOnSpace
      },
      child.value
    ));
    const handleKeyDown = (event) => {
      if (event.nativeEvent.code === "ArrowRight") {
        event.stopPropagation();
        event.preventDefault();
        if (controller.expandedState[node.value]) {
          event.currentTarget.querySelector("[role=treeitem]")?.focus();
        } else {
          controller.expand(node.value);
        }
      }
      if (event.nativeEvent.code === "ArrowLeft") {
        event.stopPropagation();
        event.preventDefault();
        if (controller.expandedState[node.value] && (node.children || []).length > 0) {
          controller.collapse(node.value);
        } else if (isSubtree) {
          findElementAncestor(event.currentTarget, "[role=treeitem]")?.focus();
        }
      }
      if (event.nativeEvent.code === "ArrowDown" || event.nativeEvent.code === "ArrowUp") {
        const root = findElementAncestor(event.currentTarget, "[data-tree-root]");
        if (!root) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        const nodes = Array.from(root.querySelectorAll("[role=treeitem]"));
        const index3 = nodes.indexOf(event.currentTarget);
        if (index3 === -1) {
          return;
        }
        const nextIndex = event.nativeEvent.code === "ArrowDown" ? index3 + 1 : index3 - 1;
        nodes[nextIndex]?.focus();
        if (event.shiftKey) {
          const selectNode = nodes[nextIndex];
          if (selectNode) {
            controller.setSelectedState(
              getValuesRange(controller.anchorNode, selectNode.dataset.value, flatValues)
            );
          }
        }
      }
      if (event.nativeEvent.code === "Space") {
        if (expandOnSpace) {
          event.stopPropagation();
          event.preventDefault();
          controller.toggleExpanded(node.value);
        }
        if (checkOnSpace) {
          event.stopPropagation();
          event.preventDefault();
          controller.isNodeChecked(node.value) ? controller.uncheckNode(node.value) : controller.checkNode(node.value);
        }
      }
    };
    const handleNodeClick = (event) => {
      event.stopPropagation();
      if (allowRangeSelection && event.shiftKey && controller.anchorNode) {
        controller.setSelectedState(getValuesRange(controller.anchorNode, node.value, flatValues));
        ref.current?.focus();
      } else {
        expandOnClick && controller.toggleExpanded(node.value);
        selectOnClick && controller.select(node.value);
        ref.current?.focus();
      }
    };
    const selected = controller.selectedState.includes(node.value);
    const elementProps = {
      ...getStyles2("label"),
      onClick: handleNodeClick,
      "data-selected": selected || void 0,
      "data-value": node.value,
      "data-hovered": controller.hoveredNode === node.value || void 0
    };
    return  jsxRuntime.jsxs(
      "li",
      {
        ...getStyles2("node", {
          style: { "--label-offset": `calc(var(--level-offset) * ${level - 1})` }
        }),
        role: "treeitem",
        "aria-selected": selected,
        "data-value": node.value,
        "data-selected": selected || void 0,
        "data-hovered": controller.hoveredNode === node.value || void 0,
        "data-level": level,
        tabIndex: rootIndex === 0 ? 0 : -1,
        onKeyDown: handleKeyDown,
        ref,
        onMouseOver: (event) => {
          event.stopPropagation();
          controller.setHoveredNode(node.value);
        },
        onMouseLeave: (event) => {
          event.stopPropagation();
          controller.setHoveredNode(null);
        },
        children: [
          typeof renderNode === "function" ? renderNode({
            node,
            level,
            selected,
            tree: controller,
            expanded: controller.expandedState[node.value] || false,
            hasChildren: Array.isArray(node.children) && node.children.length > 0,
            elementProps
          }) :  jsxRuntime.jsx("div", { ...elementProps, children: node.label }),
          controller.expandedState[node.value] && nested.length > 0 &&  jsxRuntime.jsx("ul", { role: "group", ...getStyles2("subtree"), "data-level": level, children: nested })
        ]
      }
    );
  }
  TreeNode.displayName = "@mantine/core/TreeNode";
  function getAllCheckedNodes(data, checkedState, acc = []) {
    const currentTreeChecked = [];
    for (const node of data) {
      if (Array.isArray(node.children) && node.children.length > 0) {
        const innerChecked = getAllCheckedNodes(node.children, checkedState, acc);
        if (innerChecked.currentTreeChecked.length === node.children.length) {
          const isChecked = innerChecked.currentTreeChecked.every((item2) => item2.checked);
          const item = {
            checked: isChecked,
            indeterminate: !isChecked,
            value: node.value,
            hasChildren: true
          };
          currentTreeChecked.push(item);
          acc.push(item);
        } else if (innerChecked.currentTreeChecked.length > 0) {
          const item = { checked: false, indeterminate: true, value: node.value, hasChildren: true };
          currentTreeChecked.push(item);
          acc.push(item);
        }
      } else if (checkedState.includes(node.value)) {
        const item = {
          checked: true,
          indeterminate: false,
          value: node.value,
          hasChildren: false
        };
        currentTreeChecked.push(item);
        acc.push(item);
      }
    }
    return { result: acc, currentTreeChecked };
  }
  function findTreeNode(value, data) {
    for (const node of data) {
      if (node.value === value) {
        return node;
      }
      if (Array.isArray(node.children)) {
        const childNode = findTreeNode(value, node.children);
        if (childNode) {
          return childNode;
        }
      }
    }
    return null;
  }
  function getChildrenNodesValues(value, data, acc = []) {
    const node = findTreeNode(value, data);
    if (!node) {
      return acc;
    }
    if (!Array.isArray(node.children) || node.children.length === 0) {
      return [node.value];
    }
    node.children.forEach((child) => {
      if (Array.isArray(child.children) && child.children.length > 0) {
        getChildrenNodesValues(child.value, data, acc);
      } else {
        acc.push(child.value);
      }
    });
    return acc;
  }
  function getAllChildrenNodes(data) {
    return data.reduce((acc, node) => {
      if (Array.isArray(node.children) && node.children.length > 0) {
        acc.push(...getAllChildrenNodes(node.children));
      } else {
        acc.push(node.value);
      }
      return acc;
    }, []);
  }
  function isNodeChecked(value, data, checkedState) {
    if (checkedState.length === 0) {
      return false;
    }
    if (checkedState.includes(value)) {
      return true;
    }
    const checkedNodes = getAllCheckedNodes(data, checkedState).result;
    return checkedNodes.some((node) => node.value === value && node.checked);
  }
  var memoizedIsNodeChecked = memoize(isNodeChecked);
  function isNodeIndeterminate(value, data, checkedState) {
    if (checkedState.length === 0) {
      return false;
    }
    const checkedNodes = getAllCheckedNodes(data, checkedState).result;
    return checkedNodes.some((node) => node.value === value && node.indeterminate);
  }
  var memoizedIsNodeIndeterminate = memoize(isNodeIndeterminate);
  function getInitialTreeExpandedState(initialState, data, value, acc = {}) {
    data.forEach((node) => {
      acc[node.value] = node.value in initialState ? initialState[node.value] : node.value === value;
      if (Array.isArray(node.children)) {
        getInitialTreeExpandedState(initialState, node.children, value, acc);
      }
    });
    return acc;
  }
  function getTreeExpandedState(data, expandedNodesValues) {
    const state = getInitialTreeExpandedState({}, data, []);
    if (expandedNodesValues === "*") {
      return Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    }
    expandedNodesValues.forEach((node) => {
      state[node] = true;
    });
    return state;
  }
  function getInitialCheckedState(initialState, data) {
    const acc = [];
    initialState.forEach((node) => acc.push(...getChildrenNodesValues(node, data)));
    return Array.from(new Set(acc));
  }
  function useTree({
    initialSelectedState = [],
    initialCheckedState = [],
    initialExpandedState = {},
    multiple = false,
    onNodeCollapse,
    onNodeExpand
  } = {}) {
    const [data, setData] = React10.useState([]);
    const [expandedState, setExpandedState] = React10.useState(initialExpandedState);
    const [selectedState, setSelectedState] = React10.useState(initialSelectedState);
    const [checkedState, setCheckedState] = React10.useState(initialCheckedState);
    const [anchorNode, setAnchorNode] = React10.useState(null);
    const [hoveredNode, setHoveredNode] = React10.useState(null);
    const initialize = React10.useCallback(
      (_data) => {
        setExpandedState((current) => getInitialTreeExpandedState(current, _data, selectedState));
        setCheckedState((current) => getInitialCheckedState(current, _data));
        setData(_data);
      },
      [selectedState, checkedState]
    );
    const toggleExpanded = React10.useCallback(
      (value) => {
        setExpandedState((current) => {
          const nextState = { ...current, [value]: !current[value] };
          nextState[value] ? onNodeExpand?.(value) : onNodeCollapse?.(value);
          return nextState;
        });
      },
      [onNodeCollapse, onNodeExpand]
    );
    const collapse = React10.useCallback(
      (value) => {
        setExpandedState((current) => {
          if (current[value] !== false) {
            onNodeCollapse?.(value);
          }
          return { ...current, [value]: false };
        });
      },
      [onNodeCollapse]
    );
    const expand = React10.useCallback(
      (value) => {
        setExpandedState((current) => {
          if (current[value] !== true) {
            onNodeExpand?.(value);
          }
          return { ...current, [value]: true };
        });
      },
      [onNodeExpand]
    );
    const expandAllNodes = React10.useCallback(() => {
      setExpandedState((current) => {
        const next = { ...current };
        Object.keys(next).forEach((key) => {
          next[key] = true;
        });
        return next;
      });
    }, []);
    const collapseAllNodes = React10.useCallback(() => {
      setExpandedState((current) => {
        const next = { ...current };
        Object.keys(next).forEach((key) => {
          next[key] = false;
        });
        return next;
      });
    }, []);
    const toggleSelected = React10.useCallback(
      (value) => setSelectedState((current) => {
        if (!multiple) {
          if (current.includes(value)) {
            setAnchorNode(null);
            return [];
          }
          setAnchorNode(value);
          return [value];
        }
        if (current.includes(value)) {
          setAnchorNode(null);
          return current.filter((item) => item !== value);
        }
        setAnchorNode(value);
        return [...current, value];
      }),
      []
    );
    const select = React10.useCallback((value) => {
      setAnchorNode(value);
      setSelectedState(
        (current) => multiple ? current.includes(value) ? current : [...current, value] : [value]
      );
    }, []);
    const deselect = React10.useCallback((value) => {
      anchorNode === value && setAnchorNode(null);
      setSelectedState((current) => current.filter((item) => item !== value));
    }, []);
    const clearSelected = React10.useCallback(() => {
      setSelectedState([]);
      setAnchorNode(null);
    }, []);
    const checkNode = React10.useCallback(
      (value) => {
        const checkedNodes = getChildrenNodesValues(value, data);
        setCheckedState((current) => Array.from( new Set([...current, ...checkedNodes])));
      },
      [data]
    );
    const uncheckNode = React10.useCallback(
      (value) => {
        const checkedNodes = getChildrenNodesValues(value, data);
        setCheckedState((current) => current.filter((item) => !checkedNodes.includes(item)));
      },
      [data]
    );
    const checkAllNodes = React10.useCallback(() => {
      setCheckedState(() => getAllChildrenNodes(data));
    }, [data]);
    const uncheckAllNodes = React10.useCallback(() => {
      setCheckedState([]);
    }, []);
    const getCheckedNodes = () => getAllCheckedNodes(data, checkedState).result;
    const isNodeChecked2 = (value) => memoizedIsNodeChecked(value, data, checkedState);
    const isNodeIndeterminate2 = (value) => memoizedIsNodeIndeterminate(value, data, checkedState);
    return {
      multiple,
      expandedState,
      selectedState,
      checkedState,
      anchorNode,
      initialize,
      toggleExpanded,
      collapse,
      expand,
      expandAllNodes,
      collapseAllNodes,
      setExpandedState,
      checkNode,
      uncheckNode,
      checkAllNodes,
      uncheckAllNodes,
      setCheckedState,
      toggleSelected,
      select,
      deselect,
      clearSelected,
      setSelectedState,
      hoveredNode,
      setHoveredNode,
      getCheckedNodes,
      isNodeChecked: isNodeChecked2,
      isNodeIndeterminate: isNodeIndeterminate2
    };
  }
  var classes85 = { "root": "m_f698e191", "subtree": "m_75f3ecf", "node": "m_f6970eb1", "label": "m_dc283425" };
  function getFlatValues(data) {
    return data.reduce((acc, item) => {
      acc.push(item.value);
      if (item.children) {
        acc.push(...getFlatValues(item.children));
      }
      return acc;
    }, []);
  }
  var defaultProps182 = {
    expandOnClick: true,
    allowRangeSelection: true,
    expandOnSpace: true
  };
  var varsResolver89 = createVarsResolver((_theme, { levelOffset }) => ({
    root: {
      "--level-offset": getSpacing(levelOffset)
    }
  }));
  var Tree = factory((_props, ref) => {
    const props = useProps("Tree", defaultProps182, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      expandOnClick,
      tree,
      renderNode,
      selectOnClick,
      clearSelectionOnOutsideClick,
      allowRangeSelection,
      expandOnSpace,
      levelOffset,
      checkOnSpace,
      ...others
    } = props;
    const defaultController = useTree();
    const controller = tree || defaultController;
    const getStyles2 = useStyles({
      name: "Tree",
      classes: classes85,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver89
    });
    const clickOutsideRef = hooks.useClickOutside(
      () => clearSelectionOnOutsideClick && controller.clearSelected()
    );
    const mergedRef = hooks.useMergedRef(ref, clickOutsideRef);
    const flatValues = React10.useMemo(() => getFlatValues(data), [data]);
    React10.useEffect(() => {
      controller.initialize(data);
    }, [data]);
    const nodes = data.map((node, index3) =>  jsxRuntime.jsx(
      TreeNode,
      {
        node,
        getStyles: getStyles2,
        rootIndex: index3,
        expandOnClick,
        selectOnClick,
        controller,
        renderNode,
        flatValues,
        allowRangeSelection,
        expandOnSpace,
        checkOnSpace
      },
      node.value
    ));
    return  jsxRuntime.jsx(
      Box,
      {
        component: "ul",
        ref: mergedRef,
        ...getStyles2("root"),
        ...others,
        role: "tree",
        "aria-multiselectable": controller.multiple,
        "data-tree-root": true,
        children: nodes
      }
    );
  });
  Tree.displayName = "@mantine/core/Tree";
  Tree.classes = classes85;
  var classes86 = { "root": "m_d6493fad" };
  var defaultProps183 = {};
  var TypographyStylesProvider = factory((_props, ref) => {
    const props = useProps("TypographyStylesProvider", defaultProps183, _props);
    const { classNames, className, style, styles, unstyled, ...others } = props;
    const getStyles2 = useStyles({
      name: "TypographyStylesProvider",
      classes: classes86,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled
    });
    return  jsxRuntime.jsx(Box, { ref, ...getStyles2("root"), ...others });
  });
  TypographyStylesProvider.classes = classes86;
  TypographyStylesProvider.displayName = "@mantine/core/TypographyStylesProvider";
  exports.Accordion = Accordion;
  exports.AccordionChevron = AccordionChevron;
  exports.AccordionControl = AccordionControl;
  exports.AccordionItem = AccordionItem;
  exports.AccordionPanel = AccordionPanel;
  exports.ActionIcon = ActionIcon;
  exports.ActionIconGroup = ActionIconGroup;
  exports.ActionIconGroupSection = ActionIconGroupSection;
  exports.Affix = Affix;
  exports.Alert = Alert;
  exports.AlphaSlider = AlphaSlider;
  exports.Anchor = Anchor;
  exports.AngleSlider = AngleSlider;
  exports.AppShell = AppShell;
  exports.AppShellAside = AppShellAside;
  exports.AppShellFooter = AppShellFooter;
  exports.AppShellHeader = AppShellHeader;
  exports.AppShellMain = AppShellMain;
  exports.AppShellNavbar = AppShellNavbar;
  exports.AppShellSection = AppShellSection;
  exports.AspectRatio = AspectRatio;
  exports.Autocomplete = Autocomplete;
  exports.Avatar = Avatar;
  exports.AvatarGroup = AvatarGroup;
  exports.BackgroundImage = BackgroundImage;
  exports.Badge = Badge;
  exports.Blockquote = Blockquote;
  exports.Box = Box;
  exports.Breadcrumbs = Breadcrumbs;
  exports.Burger = Burger;
  exports.Button = Button;
  exports.ButtonGroup = ButtonGroup;
  exports.ButtonGroupSection = ButtonGroupSection;
  exports.Card = Card;
  exports.CardSection = CardSection;
  exports.Center = Center;
  exports.CheckIcon = CheckIcon;
  exports.Checkbox = Checkbox;
  exports.CheckboxCard = CheckboxCard;
  exports.CheckboxGroup = CheckboxGroup;
  exports.CheckboxIndicator = CheckboxIndicator;
  exports.Chip = Chip;
  exports.ChipGroup = ChipGroup;
  exports.CloseButton = CloseButton;
  exports.CloseIcon = CloseIcon;
  exports.Code = Code;
  exports.Collapse = Collapse;
  exports.ColorInput = ColorInput;
  exports.ColorPicker = ColorPicker;
  exports.ColorSchemeScript = ColorSchemeScript;
  exports.ColorSwatch = ColorSwatch;
  exports.Combobox = Combobox;
  exports.ComboboxChevron = ComboboxChevron;
  exports.ComboboxClearButton = ComboboxClearButton;
  exports.ComboboxDropdown = ComboboxDropdown;
  exports.ComboboxDropdownTarget = ComboboxDropdownTarget;
  exports.ComboboxEmpty = ComboboxEmpty;
  exports.ComboboxEventsTarget = ComboboxEventsTarget;
  exports.ComboboxFooter = ComboboxFooter;
  exports.ComboboxGroup = ComboboxGroup;
  exports.ComboboxHeader = ComboboxHeader;
  exports.ComboboxHiddenInput = ComboboxHiddenInput;
  exports.ComboboxOption = ComboboxOption;
  exports.ComboboxOptions = ComboboxOptions;
  exports.ComboboxSearch = ComboboxSearch;
  exports.ComboboxTarget = ComboboxTarget;
  exports.Container = Container;
  exports.CopyButton = CopyButton;
  exports.DEFAULT_THEME = DEFAULT_THEME;
  exports.Dialog = Dialog;
  exports.DirectionContext = DirectionContext;
  exports.DirectionProvider = DirectionProvider;
  exports.Divider = Divider;
  exports.Drawer = Drawer;
  exports.DrawerBody = DrawerBody;
  exports.DrawerCloseButton = DrawerCloseButton;
  exports.DrawerContent = DrawerContent;
  exports.DrawerHeader = DrawerHeader;
  exports.DrawerOverlay = DrawerOverlay;
  exports.DrawerRoot = DrawerRoot;
  exports.DrawerStack = DrawerStack;
  exports.DrawerTitle = DrawerTitle;
  exports.FLEX_STYLE_PROPS_DATA = FLEX_STYLE_PROPS_DATA;
  exports.FOCUS_CLASS_NAMES = FOCUS_CLASS_NAMES;
  exports.Fieldset = Fieldset;
  exports.FileButton = FileButton;
  exports.FileInput = FileInput;
  exports.Flex = Flex;
  exports.FloatingArrow = FloatingArrow;
  exports.FloatingIndicator = FloatingIndicator;
  exports.FocusTrap = FocusTrap;
  exports.FocusTrapInitialFocus = FocusTrapInitialFocus;
  exports.Grid = Grid;
  exports.GridCol = GridCol;
  exports.Group = Group;
  exports.HeadlessMantineProvider = HeadlessMantineProvider;
  exports.Highlight = Highlight;
  exports.HoverCard = HoverCard;
  exports.HoverCardDropdown = HoverCardDropdown;
  exports.HoverCardTarget = HoverCardTarget;
  exports.HueSlider = HueSlider;
  exports.Image = Image;
  exports.Indicator = Indicator;
  exports.InlineStyles = InlineStyles;
  exports.Input = Input;
  exports.InputBase = InputBase;
  exports.InputDescription = InputDescription;
  exports.InputError = InputError;
  exports.InputLabel = InputLabel;
  exports.InputPlaceholder = InputPlaceholder;
  exports.InputWrapper = InputWrapper;
  exports.JsonInput = JsonInput;
  exports.Kbd = Kbd;
  exports.List = List;
  exports.ListItem = ListItem;
  exports.Loader = Loader;
  exports.LoadingOverlay = LoadingOverlay;
  exports.MANTINE_TRANSITIONS = transitions;
  exports.MantineContext = MantineContext;
  exports.MantineProvider = MantineProvider;
  exports.MantineThemeContext = MantineThemeContext;
  exports.MantineThemeProvider = MantineThemeProvider;
  exports.Mark = Mark;
  exports.Menu = Menu;
  exports.MenuDivider = MenuDivider;
  exports.MenuDropdown = MenuDropdown;
  exports.MenuItem = MenuItem;
  exports.MenuLabel = MenuLabel;
  exports.MenuTarget = MenuTarget;
  exports.Modal = Modal;
  exports.ModalBase = ModalBase;
  exports.ModalBaseBody = ModalBaseBody;
  exports.ModalBaseCloseButton = ModalBaseCloseButton;
  exports.ModalBaseContent = ModalBaseContent;
  exports.ModalBaseHeader = ModalBaseHeader;
  exports.ModalBaseOverlay = ModalBaseOverlay;
  exports.ModalBaseTitle = ModalBaseTitle;
  exports.ModalBody = ModalBody;
  exports.ModalCloseButton = ModalCloseButton;
  exports.ModalContent = ModalContent;
  exports.ModalHeader = ModalHeader;
  exports.ModalOverlay = ModalOverlay;
  exports.ModalRoot = ModalRoot;
  exports.ModalStack = ModalStack;
  exports.ModalTitle = ModalTitle;
  exports.MultiSelect = MultiSelect;
  exports.NativeScrollArea = NativeScrollArea;
  exports.NativeSelect = NativeSelect;
  exports.NavLink = NavLink;
  exports.Notification = Notification;
  exports.NumberFormatter = NumberFormatter;
  exports.NumberInput = NumberInput;
  exports.OptionalPortal = OptionalPortal;
  exports.OptionsDropdown = OptionsDropdown;
  exports.Overlay = Overlay;
  exports.Pagination = Pagination;
  exports.PaginationControl = PaginationControl;
  exports.PaginationDots = PaginationDots;
  exports.PaginationFirst = PaginationFirst;
  exports.PaginationItems = PaginationItems;
  exports.PaginationLast = PaginationLast;
  exports.PaginationNext = PaginationNext;
  exports.PaginationPrevious = PaginationPrevious;
  exports.PaginationRoot = PaginationRoot;
  exports.Paper = Paper;
  exports.PasswordInput = PasswordInput;
  exports.Pill = Pill;
  exports.PillGroup = PillGroup;
  exports.PillsInput = PillsInput;
  exports.PillsInputField = PillsInputField;
  exports.PinInput = PinInput;
  exports.Popover = Popover;
  exports.PopoverDropdown = PopoverDropdown;
  exports.PopoverTarget = PopoverTarget;
  exports.Portal = Portal;
  exports.Progress = Progress;
  exports.ProgressLabel = ProgressLabel;
  exports.ProgressRoot = ProgressRoot;
  exports.ProgressSection = ProgressSection;
  exports.Radio = Radio;
  exports.RadioCard = RadioCard;
  exports.RadioGroup = RadioGroup;
  exports.RadioIcon = RadioIcon;
  exports.RadioIndicator = RadioIndicator;
  exports.RangeSlider = RangeSlider;
  exports.Rating = Rating;
  exports.RemoveScroll = Combination_default;
  exports.RingProgress = RingProgress;
  exports.STYlE_PROPS_DATA = STYlE_PROPS_DATA;
  exports.ScrollArea = ScrollArea;
  exports.ScrollAreaAutosize = ScrollAreaAutosize;
  exports.SegmentedControl = SegmentedControl;
  exports.Select = Select;
  exports.SemiCircleProgress = SemiCircleProgress;
  exports.SimpleGrid = SimpleGrid;
  exports.Skeleton = Skeleton;
  exports.Slider = Slider;
  exports.Space = Space;
  exports.Spoiler = Spoiler;
  exports.Stack = Stack;
  exports.Stepper = Stepper;
  exports.StepperCompleted = StepperCompleted;
  exports.StepperStep = StepperStep;
  exports.Switch = Switch;
  exports.SwitchGroup = SwitchGroup;
  exports.Table = Table;
  exports.TableCaption = TableCaption;
  exports.TableScrollContainer = TableScrollContainer;
  exports.TableTbody = TableTbody;
  exports.TableTd = TableTd;
  exports.TableTfoot = TableTfoot;
  exports.TableTh = TableTh;
  exports.TableThead = TableThead;
  exports.TableTr = TableTr;
  exports.Tabs = Tabs;
  exports.TabsList = TabsList;
  exports.TabsPanel = TabsPanel;
  exports.TabsTab = TabsTab;
  exports.TagsInput = TagsInput;
  exports.Text = Text;
  exports.TextInput = TextInput;
  exports.Textarea = Textarea;
  exports.ThemeIcon = ThemeIcon;
  exports.Timeline = Timeline;
  exports.TimelineItem = TimelineItem;
  exports.Title = Title;
  exports.Tooltip = Tooltip;
  exports.TooltipFloating = TooltipFloating;
  exports.TooltipGroup = TooltipGroup;
  exports.Transition = Transition;
  exports.Tree = Tree;
  exports.TypographyStylesProvider = TypographyStylesProvider;
  exports.UnstyledButton = UnstyledButton;
  exports.VisuallyHidden = VisuallyHidden;
  exports.alpha = alpha;
  exports.camelToKebabCase = camelToKebabCase;
  exports.closeOnEscape = closeOnEscape;
  exports.colorsTuple = colorsTuple;
  exports.convertCssVariables = convertCssVariables;
  exports.convertHsvaTo = convertHsvaTo;
  exports.createEventHandler = createEventHandler;
  exports.createOptionalContext = createOptionalContext;
  exports.createPolymorphicComponent = createPolymorphicComponent;
  exports.createSafeContext = createSafeContext;
  exports.createScopedKeydownHandler = createScopedKeydownHandler;
  exports.createTheme = createTheme;
  exports.createUseExternalEvents = createUseExternalEvents;
  exports.createVarsResolver = createVarsResolver;
  exports.darken = darken;
  exports.deepMerge = deepMerge;
  exports.defaultCssVariablesResolver = defaultCssVariablesResolver;
  exports.defaultLoaders = defaultLoaders;
  exports.defaultOptionsFilter = defaultOptionsFilter;
  exports.defaultVariantColorsResolver = defaultVariantColorsResolver;
  exports.em = em;
  exports.extractStyleProps = extractStyleProps;
  exports.factory = factory;
  exports.filterProps = filterProps;
  exports.findClosestNumber = findClosestNumber;
  exports.findElementAncestor = findElementAncestor;
  exports.getAutoContrastValue = getAutoContrastValue;
  exports.getBaseValue = getBaseValue;
  exports.getBreakpointValue = getBreakpointValue;
  exports.getCSSColorVariables = getCSSColorVariables;
  exports.getContextItemIndex = getContextItemIndex;
  exports.getContrastColor = getContrastColor;
  exports.getDefaultZIndex = getDefaultZIndex;
  exports.getEnv = getEnv;
  exports.getFloatingPosition = getFloatingPosition;
  exports.getFontSize = getFontSize;
  exports.getGradient = getGradient;
  exports.getLabelsLockup = getLabelsLockup;
  exports.getLineHeight = getLineHeight;
  exports.getOptionsLockup = getOptionsLockup;
  exports.getParsedComboboxData = getParsedComboboxData;
  exports.getPrimaryContrastColor = getPrimaryContrastColor;
  exports.getPrimaryShade = getPrimaryShade;
  exports.getRadius = getRadius;
  exports.getRefProp = getRefProp;
  exports.getSafeId = getSafeId;
  exports.getShadow = getShadow;
  exports.getSize = getSize;
  exports.getSortedBreakpoints = getSortedBreakpoints;
  exports.getSpacing = getSpacing;
  exports.getStyleObject = getStyleObject;
  exports.getThemeColor = getThemeColor;
  exports.getTransitionProps = getTransitionProps;
  exports.getTreeExpandedState = getTreeExpandedState;
  exports.getWithProps = getWithProps;
  exports.isColorValid = isColorValid;
  exports.isElement = isElement;
  exports.isLightColor = isLightColor;
  exports.isMantineColorScheme = isMantineColorScheme;
  exports.isNumberLike = isNumberLike;
  exports.isOptionsGroup = isOptionsGroup;
  exports.isVirtualColor = isVirtualColor;
  exports.keys = keys;
  exports.lighten = lighten;
  exports.localStorageColorSchemeManager = localStorageColorSchemeManager;
  exports.luminance = luminance;
  exports.mantineHtmlProps = mantineHtmlProps;
  exports.memoize = memoize;
  exports.mergeMantineTheme = mergeMantineTheme;
  exports.mergeThemeOverrides = mergeThemeOverrides;
  exports.noop = noop;
  exports.parseColor = parseColor;
  exports.parseStyleProps = parseStyleProps;
  exports.parseThemeColor = parseThemeColor;
  exports.polymorphicFactory = polymorphicFactory;
  exports.px = px;
  exports.rem = rem;
  exports.resolveClassNames = resolveClassNames;
  exports.resolveStyles = resolveStyles;
  exports.rgba = rgba;
  exports.stylesToString = stylesToString;
  exports.toRgba = toRgba;
  exports.useCheckboxCardContext = useCheckboxCardContext;
  exports.useCheckboxGroupContext = useCheckboxGroupContext;
  exports.useCombobox = useCombobox;
  exports.useComboboxTargetProps = useComboboxTargetProps;
  exports.useComputedColorScheme = useComputedColorScheme;
  exports.useDelayedHover = useDelayedHover;
  exports.useDirection = useDirection;
  exports.useDrawerStackContext = useDrawerStackContext;
  exports.useDrawersStack = useDrawersStack;
  exports.useFloatingAutoUpdate = useFloatingAutoUpdate;
  exports.useHovered = useHovered;
  exports.useInputProps = useInputProps;
  exports.useInputWrapperContext = useInputWrapperContext;
  exports.useMantineClassNamesPrefix = useMantineClassNamesPrefix;
  exports.useMantineColorScheme = useMantineColorScheme;
  exports.useMantineContext = useMantineContext;
  exports.useMantineCssVariablesResolver = useMantineCssVariablesResolver;
  exports.useMantineIsHeadless = useMantineIsHeadless;
  exports.useMantineStyleNonce = useMantineStyleNonce;
  exports.useMantineStylesTransform = useMantineStylesTransform;
  exports.useMantineSxTransform = useMantineSxTransform;
  exports.useMantineTheme = useMantineTheme;
  exports.useMantineWithStaticClasses = useMantineWithStaticClasses;
  exports.useMatches = useMatches;
  exports.useModalStackContext = useModalStackContext;
  exports.useModalsStack = useModalsStack;
  exports.useProps = useProps;
  exports.useProviderColorScheme = useProviderColorScheme;
  exports.useRadioCardContext = useRadioCardContext;
  exports.useRandomClassName = useRandomClassName;
  exports.useResolvedStylesApi = useResolvedStylesApi;
  exports.useSafeMantineTheme = useSafeMantineTheme;
  exports.useStyles = useStyles;
  exports.useTree = useTree;
  exports.useVirtualizedCombobox = useVirtualizedCombobox;
  exports.validateMantineTheme = validateMantineTheme;
  exports.virtualColor = virtualColor;
}));