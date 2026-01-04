// ==UserScript==
// @name         SOOP (숲) - 채팅 스타일러
// @namespace    https://github.com/bcong
// @version      20250726045809
// @author       비콩
// @description  새로운 채팅 환경
// @license      MIT
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @match        https://www.sooplive.co.kr/*
// @match        https://play.sooplive.co.kr/*
// @connect      sooplive.co.kr
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/517201/SOOP%20%28%EC%88%B2%29%20-%20%EC%B1%84%ED%8C%85%20%EC%8A%A4%ED%83%80%EC%9D%BC%EB%9F%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/517201/SOOP%20%28%EC%88%B2%29%20-%20%EC%B1%84%ED%8C%85%20%EC%8A%A4%ED%83%80%EC%9D%BC%EB%9F%AC.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const e=document.createElement("style");e.textContent=n,document.head.append(e)})(` @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css');
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}
#root,
html,
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
select {
  border: none;
  border-radius: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
select:focus {
  outline: none;
}
img {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
._SettingMenu_v3ob1_1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
._SettingMenu_v3ob1_1 button p {
  font-size: 24px !important;
  background: linear-gradient(45deg, #0388ff, #48dcb6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-weight: 800;
  line-height: 1;
  padding: 8px !important;
  font-family: 'Pretendard' !important;
}
._SettingMenu_v3ob1_1:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
._SettingTemplate_6q8n6_1 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed !important;
  width: 330px;
  height: 400px;
  background-color: #fff;
  display: none;
  z-index: 10001;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 12px;
  border: 1px solid rgba(117, 123, 138, 0.2);
  flex-direction: column;
  overflow: auto;
}
._SettingTemplate_6q8n6_1._View_6q8n6_17 {
  display: flex;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 {
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  flex-direction: row;
  position: relative;
  border-bottom: 1px solid rgba(117, 123, 138, 0.1);
  background-color: rgba(0, 0, 0, 0.02);
  padding-left: 12px;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 ._Title_6q8n6_31 p {
  font-size: 14px;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 ._Menus_6q8n6_34 {
  height: 100%;
  position: absolute;
  right: 0;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 ._Menus_6q8n6_34 ._Menu_6q8n6_34 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 100%;
  transition-duration: 0.1s;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 ._Menus_6q8n6_34 ._Menu_6q8n6_34 svg {
  width: 60%;
  height: 100%;
}
._SettingTemplate_6q8n6_1 ._Header_6q8n6_20 ._Menus_6q8n6_34 ._Menu_6q8n6_34:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
._SettingTemplate_6q8n6_1 ._Content_6q8n6_55 {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
._SettingTemplate_6q8n6_1 ._Content_6q8n6_55::-webkit-scrollbar-track,
._SettingTemplate_6q8n6_1 ._Content_6q8n6_55::-webkit-scrollbar {
  background-color: transparent;
  width: 10px;
}
._SettingTemplate_6q8n6_1 ._Content_6q8n6_55::-webkit-scrollbar-thumb {
  background: rgba(63, 63, 63, 0.8) !important;
  border-radius: 20px;
  background-clip: padding-box !important;
  border: 3px solid transparent !important;
}
._SettingTemplate_6q8n6_1 ._Content_6q8n6_55:hover::-webkit-scrollbar-thumb {
  background: rgba(63, 63, 63, 0.8) !important;
  background-clip: padding-box !important;
  border: 3px solid transparent !important;
}
._ToggleButton_6twf4_1 {
  width: 46px;
  height: 24px;
  border-radius: 36px;
  background-color: #d8dadf;
  position: relative;
  transition-duration: 0.2s;
}
._ToggleButton_6twf4_1:hover {
  cursor: pointer;
}
._ToggleButton_6twf4_1._Enable_6twf4_12 {
  background-color: #0388ff;
}
._ToggleButton_6twf4_1._Enable_6twf4_12 ._Circle_6twf4_15 {
  transform: translate(134%, -50%);
}
._ToggleButton_6twf4_1 ._Circle_6twf4_15 {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  top: 50%;
  left: 0px;
  transform: translate(20%, -50%);
  transition-duration: 0.2s;
}
._Setting_1369u_1 {
  flex: 1;
}
._Setting_1369u_1 ._Menus_1369u_4 {
  padding: 0 16px 0 12px;
  margin-bottom: 6px;
}
._Setting_1369u_1 ._Menus_1369u_4 ._Menu_1369u_4 {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
}
._Setting_1369u_1 ._Menus_1369u_4 ._Menu_1369u_4 ._Name_1369u_14 {
  width: 120px;
}
._Setting_1369u_1 ._Menus_1369u_4 ._Menu_1369u_4 ._Name_1369u_14 p {
  font-weight: 500;
  font-size: 14px;
}
._Setting_1369u_1 ._Menus_1369u_4 ._Menu_1369u_4 ._Value_1369u_21 {
  display: flex;
  justify-content: right;
  align-items: center;
  flex: 1;
  height: 100%;
}
._ListBox_g79p9_1 {
  position: relative;
}
._ListBox_g79p9_1 ._ListValue_g79p9_4 {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100px;
  height: 26px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
._ListBox_g79p9_1 ._ListValue_g79p9_4:hover {
  cursor: pointer;
}
._ListBox_g79p9_1 ._ListValue_g79p9_4 p {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
}
._ListBox_g79p9_1 ._ListValue_g79p9_4 svg {
  top: 0;
  right: 0;
  position: absolute;
}
._ListBox_g79p9_1 ._Options_g79p9_31 {
  display: none;
  position: absolute;
  width: 100px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 6px;
  top: 100%;
  transform: translate(0%, 5%);
  overflow: hidden;
  z-index: 100;
}
._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31 {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 8px;
}
._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31 p {
  font-size: 14px;
  font-weight: 500;
}
._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31._Selected_g79p9_55 {
  background-color: rgba(0, 0, 0, 0.08);
}
._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31._Selected_g79p9_55 p {
  color: #969696;
}
._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31:not(._ListBox_g79p9_1 ._Options_g79p9_31 ._Option_g79p9_31._Selected_g79p9_55):hover {
  background-color: rgba(0, 0, 0, 0.03);
  cursor: pointer;
}
._ListBox_g79p9_1 ._Options_g79p9_31._View_g79p9_65 {
  display: block;
}
._InputBox_1a5to_1 {
  position: relative;
}
._InputBox_1a5to_1 ._InputValue_1a5to_4 {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100px;
  height: 26px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
._InputBox_1a5to_1 ._InputValue_1a5to_4:hover {
  cursor: text;
}
._InputBox_1a5to_1 ._InputValue_1a5to_4 input {
  text-align: right;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
}
._InputBox_1a5to_1 ._Tip_1a5to_25 {
  display: none;
  position: absolute;
  background-color: #ef0e0e;
  border-radius: 8px;
  padding: 4px 6px;
  bottom: 0%;
  transform: translate(0%, 110%);
}
._InputBox_1a5to_1 ._Tip_1a5to_25 p {
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}
._InputBox_1a5to_1 ._Tip_1a5to_25._View_1a5to_39 {
  display: flex;
}
._SliderBar_pao52_1 {
  width: 150px;
  margin: 20px auto;
}
._SliderBar_pao52_1 ._SliderTrack_pao52_5 {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: #d8dadf;
  border-radius: 4px;
}
._SliderBar_pao52_1 ._SliderTrack_pao52_5 ._SliderFilled_pao52_12 {
  position: absolute;
  height: 100%;
  background-color: #0388ff;
  border-radius: inherit;
  transition-duration: 0.1s;
}
._SliderBar_pao52_1 ._SliderTrack_pao52_5 ._SliderThumb_pao52_19 {
  position: absolute;
  top: -4px;
  width: 28px;
  height: 14px;
  background-color: #0388ff;
  border-radius: 6px;
  cursor: pointer;
  z-index: 10;
  transform: translate(-50%, 0%);
  transition-duration: 0.1s;
  transform-origin: 0;
}
._SliderBar_pao52_1 ._SliderTrack_pao52_5 ._SliderThumb_pao52_19:hover {
  scale: 1.15;
}
._SliderBar_pao52_1 ._SliderTrack_pao52_5 ._SliderThumb_pao52_19::after {
  display: flex;
  justify-content: center;
  content: attr(data-value);
  color: #fff;
  font-weight: 600;
}
._FrameChat_athuv_1 {
  z-index: 998;
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 4px;
}
._FrameChat_athuv_1._LeftTop_athuv_8 {
  top: 0;
}
._FrameChat_athuv_1._LeftBottom_athuv_11 {
  bottom: 0;
}
._FrameChat_athuv_1._RightTop_athuv_14 {
  right: 0;
  top: 0;
}
._FrameChat_athuv_1._RightBottom_athuv_18 {
  right: 0;
  bottom: 0;
}
._FrameChat_athuv_1 ._Chat_athuv_22 {
  display: flex;
  position: relative;
  z-index: 1;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
._FrameChat_athuv_1 ._Chat_athuv_22._Sorted_athuv_28 ._MessageContainer_athuv_28 {
  display: flex;
  flex-direction: row;
}
._FrameChat_athuv_1 ._Chat_athuv_22._Sorted_athuv_28 ._MessageContainer_athuv_28 ._Username_athuv_32 {
  width: 126px;
}
._FrameChat_athuv_1 ._Chat_athuv_22._Sorted_athuv_28 ._MessageContainer_athuv_28 ._Message_athuv_28 {
  flex: 1;
}
._FrameChat_athuv_1 ._Chat_athuv_22 ._MessageContainer_athuv_28 {
  padding: 2px 8px;
  border-radius: 8px;
}
._FrameChat_athuv_1 ._Chat_athuv_22 ._MessageContainer_athuv_28 ._Username_athuv_32 {
  display: inline-block;
  word-break: break-all;
  white-space: nowrap;
  margin-right: 8px;
}
._FrameChat_athuv_1 ._Chat_athuv_22 ._MessageContainer_athuv_28 ._Username_athuv_32 p {
  display: inline;
  vertical-align: top;
  font-weight: 700;
}
._FrameChat_athuv_1 ._Chat_athuv_22 ._MessageContainer_athuv_28 ._Message_athuv_28 {
  display: inline;
  word-break: break-all;
}
._FrameChat_athuv_1 ._Chat_athuv_22 ._MessageContainer_athuv_28 ._Message_athuv_28 p {
  display: inline;
  vertical-align: top;
  font-weight: 500;
  color: #f6f9ff;
}
._FrameChat_athuv_1 ._Chat_athuv_22._Background_athuv_63 ._MessageContainer_athuv_28 {
  backdrop-filter: blur(12px);
  padding: 4px 8px;
}
._OverlayChat_recsk_1 {
  position: fixed;
  flex-direction: column;
  z-index: 1502;
  border-radius: 8px;
  cursor: move;
  left: 0;
  top: 0;
  display: none;
  gap: 4px;
  padding: 8px 4px;
}
._OverlayChat_recsk_1._View_recsk_13 {
  display: flex;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 {
  display: flex;
  position: relative;
  z-index: 1;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}
._OverlayChat_recsk_1 ._Chat_recsk_16._Sorted_recsk_22 ._MessageContainer_recsk_22 {
  display: flex;
  flex-direction: row;
}
._OverlayChat_recsk_1 ._Chat_recsk_16._Sorted_recsk_22 ._MessageContainer_recsk_22 ._Username_recsk_26 {
  width: 126px;
}
._OverlayChat_recsk_1 ._Chat_recsk_16._Sorted_recsk_22 ._MessageContainer_recsk_22 ._Message_recsk_22 {
  flex: 1;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 ._MessageContainer_recsk_22 {
  padding: 2px 8px;
  border-radius: 8px;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 ._MessageContainer_recsk_22 ._Username_recsk_26 {
  display: inline-block;
  word-break: break-all;
  white-space: nowrap;
  margin-right: 8px;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 ._MessageContainer_recsk_22 ._Username_recsk_26 p {
  display: inline;
  vertical-align: top;
  font-weight: 700;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 ._MessageContainer_recsk_22 ._Message_recsk_22 {
  display: inline;
  word-break: break-all;
}
._OverlayChat_recsk_1 ._Chat_recsk_16 ._MessageContainer_recsk_22 ._Message_recsk_22 p {
  display: inline;
  vertical-align: top;
  font-weight: 500;
  color: #f6f9ff;
}
._OverlayChat_recsk_1 ._Chat_recsk_16._Background_recsk_57 ._MessageContainer_recsk_22 {
  backdrop-filter: blur(12px);
  padding: 4px 8px;
} `);

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  (function() {
    function getDefaultExportFromCjs(x2) {
      return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
    }
    var jsxRuntime = { exports: {} };
    var reactJsxRuntime_production_min = {};
    var react = { exports: {} };
    var react_production_min = {};
    /**
     * @license React
     * react.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
    function A$1(a) {
      if (null === a || "object" !== typeof a) return null;
      a = z$1 && a[z$1] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var B$1 = { isMounted: function() {
      return false;
    }, enqueueForceUpdate: function() {
    }, enqueueReplaceState: function() {
    }, enqueueSetState: function() {
    } }, C$1 = Object.assign, D$1 = {};
    function E$1(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D$1;
      this.updater = e || B$1;
    }
    E$1.prototype.isReactComponent = {};
    E$1.prototype.setState = function(a, b) {
      if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, b, "setState");
    };
    E$1.prototype.forceUpdate = function(a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function F() {
    }
    F.prototype = E$1.prototype;
    function G$1(a, b, e) {
      this.props = a;
      this.context = b;
      this.refs = D$1;
      this.updater = e || B$1;
    }
    var H$1 = G$1.prototype = new F();
    H$1.constructor = G$1;
    C$1(H$1, E$1.prototype);
    H$1.isPureReactComponent = true;
    var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
    function M$1(a, b, e) {
      var d, c = {}, k2 = null, h = null;
      if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
      var g = arguments.length - 2;
      if (1 === g) c.children = e;
      else if (1 < g) {
        for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
        c.children = f2;
      }
      if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
      return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
    }
    function N$1(a, b) {
      return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
    }
    function O$1(a) {
      return "object" === typeof a && null !== a && a.$$typeof === l$1;
    }
    function escape(a) {
      var b = { "=": "=0", ":": "=2" };
      return "$" + a.replace(/[=:]/g, function(a2) {
        return b[a2];
      });
    }
    var P$1 = /\/+/g;
    function Q$1(a, b) {
      return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
    }
    function R$1(a, b, e, d, c) {
      var k2 = typeof a;
      if ("undefined" === k2 || "boolean" === k2) a = null;
      var h = false;
      if (null === a) h = true;
      else switch (k2) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l$1:
            case n$1:
              h = true;
          }
      }
      if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
      h = 0;
      d = "" === d ? "." : d + ":";
      if (I$1(a)) for (var g = 0; g < a.length; g++) {
        k2 = a[g];
        var f2 = d + Q$1(k2, g);
        h += R$1(k2, b, e, f2, c);
      }
      else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
      else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
      return h;
    }
    function S$1(a, b, e) {
      if (null == a) return a;
      var d = [], c = 0;
      R$1(a, d, "", "", function(a2) {
        return b.call(e, a2, c++);
      });
      return d;
    }
    function T$1(a) {
      if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
        }, function(b2) {
          if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
        });
        -1 === a._status && (a._status = 0, a._result = b);
      }
      if (1 === a._status) return a._result.default;
      throw a._result;
    }
    var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
    function X$1() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
      S$1(a, function() {
        b.apply(this, arguments);
      }, e);
    }, count: function(a) {
      var b = 0;
      S$1(a, function() {
        b++;
      });
      return b;
    }, toArray: function(a) {
      return S$1(a, function(a2) {
        return a2;
      }) || [];
    }, only: function(a) {
      if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
      return a;
    } };
    react_production_min.Component = E$1;
    react_production_min.Fragment = p$2;
    react_production_min.Profiler = r;
    react_production_min.PureComponent = G$1;
    react_production_min.StrictMode = q$1;
    react_production_min.Suspense = w;
    react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
    react_production_min.act = X$1;
    react_production_min.cloneElement = function(a, b, e) {
      if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
      if (null != b) {
        void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
      }
      var f2 = arguments.length - 2;
      if (1 === f2) d.children = e;
      else if (1 < f2) {
        g = Array(f2);
        for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
        d.children = g;
      }
      return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
    };
    react_production_min.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    react_production_min.createElement = M$1;
    react_production_min.createFactory = function(a) {
      var b = M$1.bind(null, a);
      b.type = a;
      return b;
    };
    react_production_min.createRef = function() {
      return { current: null };
    };
    react_production_min.forwardRef = function(a) {
      return { $$typeof: v$1, render: a };
    };
    react_production_min.isValidElement = O$1;
    react_production_min.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
    };
    react_production_min.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    react_production_min.startTransition = function(a) {
      var b = V$1.transition;
      V$1.transition = {};
      try {
        a();
      } finally {
        V$1.transition = b;
      }
    };
    react_production_min.unstable_act = X$1;
    react_production_min.useCallback = function(a, b) {
      return U$1.current.useCallback(a, b);
    };
    react_production_min.useContext = function(a) {
      return U$1.current.useContext(a);
    };
    react_production_min.useDebugValue = function() {
    };
    react_production_min.useDeferredValue = function(a) {
      return U$1.current.useDeferredValue(a);
    };
    react_production_min.useEffect = function(a, b) {
      return U$1.current.useEffect(a, b);
    };
    react_production_min.useId = function() {
      return U$1.current.useId();
    };
    react_production_min.useImperativeHandle = function(a, b, e) {
      return U$1.current.useImperativeHandle(a, b, e);
    };
    react_production_min.useInsertionEffect = function(a, b) {
      return U$1.current.useInsertionEffect(a, b);
    };
    react_production_min.useLayoutEffect = function(a, b) {
      return U$1.current.useLayoutEffect(a, b);
    };
    react_production_min.useMemo = function(a, b) {
      return U$1.current.useMemo(a, b);
    };
    react_production_min.useReducer = function(a, b, e) {
      return U$1.current.useReducer(a, b, e);
    };
    react_production_min.useRef = function(a) {
      return U$1.current.useRef(a);
    };
    react_production_min.useState = function(a) {
      return U$1.current.useState(a);
    };
    react_production_min.useSyncExternalStore = function(a, b, e) {
      return U$1.current.useSyncExternalStore(a, b, e);
    };
    react_production_min.useTransition = function() {
      return U$1.current.useTransition();
    };
    react_production_min.version = "18.3.1";
    {
      react.exports = react_production_min;
    }
    var reactExports = react.exports;
    const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
    /**
     * @license React
     * react-jsx-runtime.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
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
    var reactDom = { exports: {} };
    var reactDom_production_min = {};
    var scheduler = { exports: {} };
    var scheduler_production_min = {};
    /**
     * @license React
     * scheduler.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    (function(exports) {
      function f2(a, b) {
        var c = a.length;
        a.push(b);
        a: for (; 0 < c; ) {
          var d = c - 1 >>> 1, e = a[d];
          if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
          else break a;
        }
      }
      function h(a) {
        return 0 === a.length ? null : a[0];
      }
      function k2(a) {
        if (0 === a.length) return null;
        var b = a[0], c = a.pop();
        if (c !== b) {
          a[0] = c;
          a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
            var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
            if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
            else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
            else break a;
          }
        }
        return b;
      }
      function g(a, b) {
        var c = a.sortIndex - b.sortIndex;
        return 0 !== c ? c : a.id - b.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        var l2 = performance;
        exports.unstable_now = function() {
          return l2.now();
        };
      } else {
        var p2 = Date, q2 = p2.now();
        exports.unstable_now = function() {
          return p2.now() - q2;
        };
      }
      var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G2(a) {
        for (var b = h(t2); null !== b; ) {
          if (null === b.callback) k2(t2);
          else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
          else break;
          b = h(t2);
        }
      }
      function H2(a) {
        B2 = false;
        G2(a);
        if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
        else {
          var b = h(t2);
          null !== b && K2(H2, b.startTime - a);
        }
      }
      function J2(a, b) {
        A2 = false;
        B2 && (B2 = false, E2(L2), L2 = -1);
        z2 = true;
        var c = y2;
        try {
          G2(b);
          for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
            var d = v2.callback;
            if ("function" === typeof d) {
              v2.callback = null;
              y2 = v2.priorityLevel;
              var e = d(v2.expirationTime <= b);
              b = exports.unstable_now();
              "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
              G2(b);
            } else k2(r2);
            v2 = h(r2);
          }
          if (null !== v2) var w2 = true;
          else {
            var m2 = h(t2);
            null !== m2 && K2(H2, m2.startTime - b);
            w2 = false;
          }
          return w2;
        } finally {
          v2 = null, y2 = c, z2 = false;
        }
      }
      var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
      function M2() {
        return exports.unstable_now() - Q2 < P2 ? false : true;
      }
      function R2() {
        if (null !== O2) {
          var a = exports.unstable_now();
          Q2 = a;
          var b = true;
          try {
            b = O2(true, a);
          } finally {
            b ? S2() : (N2 = false, O2 = null);
          }
        } else N2 = false;
      }
      var S2;
      if ("function" === typeof F2) S2 = function() {
        F2(R2);
      };
      else if ("undefined" !== typeof MessageChannel) {
        var T2 = new MessageChannel(), U2 = T2.port2;
        T2.port1.onmessage = R2;
        S2 = function() {
          U2.postMessage(null);
        };
      } else S2 = function() {
        D2(R2, 0);
      };
      function I2(a) {
        O2 = a;
        N2 || (N2 = true, S2());
      }
      function K2(a, b) {
        L2 = D2(function() {
          a(exports.unstable_now());
        }, b);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a) {
        a.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A2 || z2 || (A2 = true, I2(J2));
      };
      exports.unstable_forceFrameRate = function(a) {
        0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y2;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h(r2);
      };
      exports.unstable_next = function(a) {
        switch (y2) {
          case 1:
          case 2:
          case 3:
            var b = 3;
            break;
          default:
            b = y2;
        }
        var c = y2;
        y2 = b;
        try {
          return a();
        } finally {
          y2 = c;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a = 3;
        }
        var c = y2;
        y2 = a;
        try {
          return b();
        } finally {
          y2 = c;
        }
      };
      exports.unstable_scheduleCallback = function(a, b, c) {
        var d = exports.unstable_now();
        "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
        switch (a) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c + e;
        a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
        c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
        return a;
      };
      exports.unstable_shouldYield = M2;
      exports.unstable_wrapCallback = function(a) {
        var b = y2;
        return function() {
          var c = y2;
          y2 = b;
          try {
            return a.apply(this, arguments);
          } finally {
            y2 = c;
          }
        };
      };
    })(scheduler_production_min);
    {
      scheduler.exports = scheduler_production_min;
    }
    var schedulerExports = scheduler.exports;
    /**
     * @license React
     * react-dom.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var aa = reactExports, ca = schedulerExports;
    function p(a) {
      for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
      return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    var da = /* @__PURE__ */ new Set(), ea = {};
    function fa(a, b) {
      ha(a, b);
      ha(a + "Capture", b);
    }
    function ha(a, b) {
      ea[a] = b;
      for (a = 0; a < b.length; a++) da.add(b[a]);
    }
    var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
    function oa(a) {
      if (ja.call(ma, a)) return true;
      if (ja.call(la, a)) return false;
      if (ka.test(a)) return ma[a] = true;
      la[a] = true;
      return false;
    }
    function pa(a, b, c, d) {
      if (null !== c && 0 === c.type) return false;
      switch (typeof b) {
        case "function":
        case "symbol":
          return true;
        case "boolean":
          if (d) return false;
          if (null !== c) return !c.acceptsBooleans;
          a = a.toLowerCase().slice(0, 5);
          return "data-" !== a && "aria-" !== a;
        default:
          return false;
      }
    }
    function qa(a, b, c, d) {
      if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
      if (d) return false;
      if (null !== c) switch (c.type) {
        case 3:
          return !b;
        case 4:
          return false === b;
        case 5:
          return isNaN(b);
        case 6:
          return isNaN(b) || 1 > b;
      }
      return false;
    }
    function v(a, b, c, d, e, f2, g) {
      this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
      this.attributeName = d;
      this.attributeNamespace = e;
      this.mustUseProperty = c;
      this.propertyName = a;
      this.type = b;
      this.sanitizeURL = f2;
      this.removeEmptyString = g;
    }
    var z = {};
    "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
      z[a] = new v(a, 0, false, a, null, false, false);
    });
    [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
      var b = a[0];
      z[b] = new v(b, 1, false, a[1], null, false, false);
    });
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
      z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
    });
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
      z[a] = new v(a, 2, false, a, null, false, false);
    });
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
      z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
    });
    ["checked", "multiple", "muted", "selected"].forEach(function(a) {
      z[a] = new v(a, 3, true, a, null, false, false);
    });
    ["capture", "download"].forEach(function(a) {
      z[a] = new v(a, 4, false, a, null, false, false);
    });
    ["cols", "rows", "size", "span"].forEach(function(a) {
      z[a] = new v(a, 6, false, a, null, false, false);
    });
    ["rowSpan", "start"].forEach(function(a) {
      z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
    });
    var ra = /[\-:]([a-z])/g;
    function sa(a) {
      return a[1].toUpperCase();
    }
    "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
      var b = a.replace(
        ra,
        sa
      );
      z[b] = new v(b, 1, false, a, null, false, false);
    });
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
    });
    ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
      var b = a.replace(ra, sa);
      z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
    });
    ["tabIndex", "crossOrigin"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
    });
    z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
    ["src", "href", "action", "formAction"].forEach(function(a) {
      z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
    });
    function ta(a, b, c, d) {
      var e = z.hasOwnProperty(b) ? z[b] : null;
      if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
    }
    var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
    var Ia = Symbol.for("react.offscreen");
    var Ja = Symbol.iterator;
    function Ka(a) {
      if (null === a || "object" !== typeof a) return null;
      a = Ja && a[Ja] || a["@@iterator"];
      return "function" === typeof a ? a : null;
    }
    var A = Object.assign, La;
    function Ma(a) {
      if (void 0 === La) try {
        throw Error();
      } catch (c) {
        var b = c.stack.trim().match(/\n( *(at )?)/);
        La = b && b[1] || "";
      }
      return "\n" + La + a;
    }
    var Na = false;
    function Oa(a, b) {
      if (!a || Na) return "";
      Na = true;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        if (b) if (b = function() {
          throw Error();
        }, Object.defineProperty(b.prototype, "props", { set: function() {
          throw Error();
        } }), "object" === typeof Reflect && Reflect.construct) {
          try {
            Reflect.construct(b, []);
          } catch (l2) {
            var d = l2;
          }
          Reflect.construct(a, [], b);
        } else {
          try {
            b.call();
          } catch (l2) {
            d = l2;
          }
          a.call(b.prototype);
        }
        else {
          try {
            throw Error();
          } catch (l2) {
            d = l2;
          }
          a();
        }
      } catch (l2) {
        if (l2 && d && "string" === typeof l2.stack) {
          for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
          for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
            if (1 !== g || 1 !== h) {
              do
                if (g--, h--, 0 > h || e[g] !== f2[h]) {
                  var k2 = "\n" + e[g].replace(" at new ", " at ");
                  a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
                  return k2;
                }
              while (1 <= g && 0 <= h);
            }
            break;
          }
        }
      } finally {
        Na = false, Error.prepareStackTrace = c;
      }
      return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
    }
    function Pa(a) {
      switch (a.tag) {
        case 5:
          return Ma(a.type);
        case 16:
          return Ma("Lazy");
        case 13:
          return Ma("Suspense");
        case 19:
          return Ma("SuspenseList");
        case 0:
        case 2:
        case 15:
          return a = Oa(a.type, false), a;
        case 11:
          return a = Oa(a.type.render, false), a;
        case 1:
          return a = Oa(a.type, true), a;
        default:
          return "";
      }
    }
    function Qa(a) {
      if (null == a) return null;
      if ("function" === typeof a) return a.displayName || a.name || null;
      if ("string" === typeof a) return a;
      switch (a) {
        case ya:
          return "Fragment";
        case wa:
          return "Portal";
        case Aa:
          return "Profiler";
        case za:
          return "StrictMode";
        case Ea:
          return "Suspense";
        case Fa:
          return "SuspenseList";
      }
      if ("object" === typeof a) switch (a.$$typeof) {
        case Ca:
          return (a.displayName || "Context") + ".Consumer";
        case Ba:
          return (a._context.displayName || "Context") + ".Provider";
        case Da:
          var b = a.render;
          a = a.displayName;
          a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          return a;
        case Ga:
          return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
        case Ha:
          b = a._payload;
          a = a._init;
          try {
            return Qa(a(b));
          } catch (c) {
          }
      }
      return null;
    }
    function Ra(a) {
      var b = a.type;
      switch (a.tag) {
        case 24:
          return "Cache";
        case 9:
          return (b.displayName || "Context") + ".Consumer";
        case 10:
          return (b._context.displayName || "Context") + ".Provider";
        case 18:
          return "DehydratedFragment";
        case 11:
          return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 5:
          return b;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return Qa(b);
        case 8:
          return b === za ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
          if ("function" === typeof b) return b.displayName || b.name || null;
          if ("string" === typeof b) return b;
      }
      return null;
    }
    function Sa(a) {
      switch (typeof a) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function Ta(a) {
      var b = a.type;
      return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
    }
    function Ua(a) {
      var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
      if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
        var e = c.get, f2 = c.set;
        Object.defineProperty(a, b, { configurable: true, get: function() {
          return e.call(this);
        }, set: function(a2) {
          d = "" + a2;
          f2.call(this, a2);
        } });
        Object.defineProperty(a, b, { enumerable: c.enumerable });
        return { getValue: function() {
          return d;
        }, setValue: function(a2) {
          d = "" + a2;
        }, stopTracking: function() {
          a._valueTracker = null;
          delete a[b];
        } };
      }
    }
    function Va(a) {
      a._valueTracker || (a._valueTracker = Ua(a));
    }
    function Wa(a) {
      if (!a) return false;
      var b = a._valueTracker;
      if (!b) return true;
      var c = b.getValue();
      var d = "";
      a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
      a = d;
      return a !== c ? (b.setValue(a), true) : false;
    }
    function Xa(a) {
      a = a || ("undefined" !== typeof document ? document : void 0);
      if ("undefined" === typeof a) return null;
      try {
        return a.activeElement || a.body;
      } catch (b) {
        return a.body;
      }
    }
    function Ya(a, b) {
      var c = b.checked;
      return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
    }
    function Za(a, b) {
      var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
      c = Sa(null != b.value ? b.value : c);
      a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
    }
    function ab(a, b) {
      b = b.checked;
      null != b && ta(a, "checked", b, false);
    }
    function bb(a, b) {
      ab(a, b);
      var c = Sa(b.value), d = b.type;
      if (null != c) if ("number" === d) {
        if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
      } else a.value !== "" + c && (a.value = "" + c);
      else if ("submit" === d || "reset" === d) {
        a.removeAttribute("value");
        return;
      }
      b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
      null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
    }
    function db(a, b, c) {
      if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
        var d = b.type;
        if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
        b = "" + a._wrapperState.initialValue;
        c || b === a.value || (a.value = b);
        a.defaultValue = b;
      }
      c = a.name;
      "" !== c && (a.name = "");
      a.defaultChecked = !!a._wrapperState.initialChecked;
      "" !== c && (a.name = c);
    }
    function cb(a, b, c) {
      if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
    }
    var eb = Array.isArray;
    function fb(a, b, c, d) {
      a = a.options;
      if (b) {
        b = {};
        for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
        for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
      } else {
        c = "" + Sa(c);
        b = null;
        for (e = 0; e < a.length; e++) {
          if (a[e].value === c) {
            a[e].selected = true;
            d && (a[e].defaultSelected = true);
            return;
          }
          null !== b || a[e].disabled || (b = a[e]);
        }
        null !== b && (b.selected = true);
      }
    }
    function gb(a, b) {
      if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
      return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
    }
    function hb(a, b) {
      var c = b.value;
      if (null == c) {
        c = b.children;
        b = b.defaultValue;
        if (null != c) {
          if (null != b) throw Error(p(92));
          if (eb(c)) {
            if (1 < c.length) throw Error(p(93));
            c = c[0];
          }
          b = c;
        }
        null == b && (b = "");
        c = b;
      }
      a._wrapperState = { initialValue: Sa(c) };
    }
    function ib(a, b) {
      var c = Sa(b.value), d = Sa(b.defaultValue);
      null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
      null != d && (a.defaultValue = "" + d);
    }
    function jb(a) {
      var b = a.textContent;
      b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
    }
    function kb(a) {
      switch (a) {
        case "svg":
          return "http://www.w3.org/2000/svg";
        case "math":
          return "http://www.w3.org/1998/Math/MathML";
        default:
          return "http://www.w3.org/1999/xhtml";
      }
    }
    function lb(a, b) {
      return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
    }
    var mb, nb = function(a) {
      return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
        MSApp.execUnsafeLocalFunction(function() {
          return a(b, c, d, e);
        });
      } : a;
    }(function(a, b) {
      if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
      else {
        mb = mb || document.createElement("div");
        mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
        for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
        for (; b.firstChild; ) a.appendChild(b.firstChild);
      }
    });
    function ob(a, b) {
      if (b) {
        var c = a.firstChild;
        if (c && c === a.lastChild && 3 === c.nodeType) {
          c.nodeValue = b;
          return;
        }
      }
      a.textContent = b;
    }
    var pb = {
      animationIterationCount: true,
      aspectRatio: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    }, qb = ["Webkit", "ms", "Moz", "O"];
    Object.keys(pb).forEach(function(a) {
      qb.forEach(function(b) {
        b = b + a.charAt(0).toUpperCase() + a.substring(1);
        pb[b] = pb[a];
      });
    });
    function rb(a, b, c) {
      return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
    }
    function sb(a, b) {
      a = a.style;
      for (var c in b) if (b.hasOwnProperty(c)) {
        var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
        "float" === c && (c = "cssFloat");
        d ? a.setProperty(c, e) : a[c] = e;
      }
    }
    var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
    function ub(a, b) {
      if (b) {
        if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
        if (null != b.dangerouslySetInnerHTML) {
          if (null != b.children) throw Error(p(60));
          if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
        }
        if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
      }
    }
    function vb(a, b) {
      if (-1 === a.indexOf("-")) return "string" === typeof b.is;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return false;
        default:
          return true;
      }
    }
    var wb = null;
    function xb(a) {
      a = a.target || a.srcElement || window;
      a.correspondingUseElement && (a = a.correspondingUseElement);
      return 3 === a.nodeType ? a.parentNode : a;
    }
    var yb = null, zb = null, Ab = null;
    function Bb(a) {
      if (a = Cb(a)) {
        if ("function" !== typeof yb) throw Error(p(280));
        var b = a.stateNode;
        b && (b = Db(b), yb(a.stateNode, a.type, b));
      }
    }
    function Eb(a) {
      zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
    }
    function Fb() {
      if (zb) {
        var a = zb, b = Ab;
        Ab = zb = null;
        Bb(a);
        if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
      }
    }
    function Gb(a, b) {
      return a(b);
    }
    function Hb() {
    }
    var Ib = false;
    function Jb(a, b, c) {
      if (Ib) return a(b, c);
      Ib = true;
      try {
        return Gb(a, b, c);
      } finally {
        if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
      }
    }
    function Kb(a, b) {
      var c = a.stateNode;
      if (null === c) return null;
      var d = Db(c);
      if (null === d) return null;
      c = d[b];
      a: switch (b) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
          a = !d;
          break a;
        default:
          a = false;
      }
      if (a) return null;
      if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
      return c;
    }
    var Lb = false;
    if (ia) try {
      var Mb = {};
      Object.defineProperty(Mb, "passive", { get: function() {
        Lb = true;
      } });
      window.addEventListener("test", Mb, Mb);
      window.removeEventListener("test", Mb, Mb);
    } catch (a) {
      Lb = false;
    }
    function Nb(a, b, c, d, e, f2, g, h, k2) {
      var l2 = Array.prototype.slice.call(arguments, 3);
      try {
        b.apply(c, l2);
      } catch (m2) {
        this.onError(m2);
      }
    }
    var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
      Ob = true;
      Pb = a;
    } };
    function Tb(a, b, c, d, e, f2, g, h, k2) {
      Ob = false;
      Pb = null;
      Nb.apply(Sb, arguments);
    }
    function Ub(a, b, c, d, e, f2, g, h, k2) {
      Tb.apply(this, arguments);
      if (Ob) {
        if (Ob) {
          var l2 = Pb;
          Ob = false;
          Pb = null;
        } else throw Error(p(198));
        Qb || (Qb = true, Rb = l2);
      }
    }
    function Vb(a) {
      var b = a, c = a;
      if (a.alternate) for (; b.return; ) b = b.return;
      else {
        a = b;
        do
          b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
        while (a);
      }
      return 3 === b.tag ? c : null;
    }
    function Wb(a) {
      if (13 === a.tag) {
        var b = a.memoizedState;
        null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
        if (null !== b) return b.dehydrated;
      }
      return null;
    }
    function Xb(a) {
      if (Vb(a) !== a) throw Error(p(188));
    }
    function Yb(a) {
      var b = a.alternate;
      if (!b) {
        b = Vb(a);
        if (null === b) throw Error(p(188));
        return b !== a ? null : a;
      }
      for (var c = a, d = b; ; ) {
        var e = c.return;
        if (null === e) break;
        var f2 = e.alternate;
        if (null === f2) {
          d = e.return;
          if (null !== d) {
            c = d;
            continue;
          }
          break;
        }
        if (e.child === f2.child) {
          for (f2 = e.child; f2; ) {
            if (f2 === c) return Xb(e), a;
            if (f2 === d) return Xb(e), b;
            f2 = f2.sibling;
          }
          throw Error(p(188));
        }
        if (c.return !== d.return) c = e, d = f2;
        else {
          for (var g = false, h = e.child; h; ) {
            if (h === c) {
              g = true;
              c = e;
              d = f2;
              break;
            }
            if (h === d) {
              g = true;
              d = e;
              c = f2;
              break;
            }
            h = h.sibling;
          }
          if (!g) {
            for (h = f2.child; h; ) {
              if (h === c) {
                g = true;
                c = f2;
                d = e;
                break;
              }
              if (h === d) {
                g = true;
                d = f2;
                c = e;
                break;
              }
              h = h.sibling;
            }
            if (!g) throw Error(p(189));
          }
        }
        if (c.alternate !== d) throw Error(p(190));
      }
      if (3 !== c.tag) throw Error(p(188));
      return c.stateNode.current === c ? a : b;
    }
    function Zb(a) {
      a = Yb(a);
      return null !== a ? $b(a) : null;
    }
    function $b(a) {
      if (5 === a.tag || 6 === a.tag) return a;
      for (a = a.child; null !== a; ) {
        var b = $b(a);
        if (null !== b) return b;
        a = a.sibling;
      }
      return null;
    }
    var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
    function mc(a) {
      if (lc && "function" === typeof lc.onCommitFiberRoot) try {
        lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
      } catch (b) {
      }
    }
    var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
    function nc(a) {
      a >>>= 0;
      return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
    }
    var rc = 64, sc = 4194304;
    function tc(a) {
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return a & 130023424;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 1073741824;
        default:
          return a;
      }
    }
    function uc(a, b) {
      var c = a.pendingLanes;
      if (0 === c) return 0;
      var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
      if (0 !== g) {
        var h = g & ~e;
        0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
      } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
      if (0 === d) return 0;
      if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
      0 !== (d & 4) && (d |= c & 16);
      b = a.entangledLanes;
      if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
      return d;
    }
    function vc(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 4:
          return b + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return b + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function wc(a, b) {
      for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
        var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
        if (-1 === k2) {
          if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
        } else k2 <= b && (a.expiredLanes |= h);
        f2 &= ~h;
      }
    }
    function xc(a) {
      a = a.pendingLanes & -1073741825;
      return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
    }
    function yc() {
      var a = rc;
      rc <<= 1;
      0 === (rc & 4194240) && (rc = 64);
      return a;
    }
    function zc(a) {
      for (var b = [], c = 0; 31 > c; c++) b.push(a);
      return b;
    }
    function Ac(a, b, c) {
      a.pendingLanes |= b;
      536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
      a = a.eventTimes;
      b = 31 - oc(b);
      a[b] = c;
    }
    function Bc(a, b) {
      var c = a.pendingLanes & ~b;
      a.pendingLanes = b;
      a.suspendedLanes = 0;
      a.pingedLanes = 0;
      a.expiredLanes &= b;
      a.mutableReadLanes &= b;
      a.entangledLanes &= b;
      b = a.entanglements;
      var d = a.eventTimes;
      for (a = a.expirationTimes; 0 < c; ) {
        var e = 31 - oc(c), f2 = 1 << e;
        b[e] = 0;
        d[e] = -1;
        a[e] = -1;
        c &= ~f2;
      }
    }
    function Cc(a, b) {
      var c = a.entangledLanes |= b;
      for (a = a.entanglements; c; ) {
        var d = 31 - oc(c), e = 1 << d;
        e & b | a[d] & b && (a[d] |= b);
        c &= ~e;
      }
    }
    var C = 0;
    function Dc(a) {
      a &= -a;
      return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
    }
    var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
    function Sc(a, b) {
      switch (a) {
        case "focusin":
        case "focusout":
          Lc = null;
          break;
        case "dragenter":
        case "dragleave":
          Mc = null;
          break;
        case "mouseover":
        case "mouseout":
          Nc = null;
          break;
        case "pointerover":
        case "pointerout":
          Oc.delete(b.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Pc.delete(b.pointerId);
      }
    }
    function Tc(a, b, c, d, e, f2) {
      if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
      a.eventSystemFlags |= d;
      b = a.targetContainers;
      null !== e && -1 === b.indexOf(e) && b.push(e);
      return a;
    }
    function Uc(a, b, c, d, e) {
      switch (b) {
        case "focusin":
          return Lc = Tc(Lc, a, b, c, d, e), true;
        case "dragenter":
          return Mc = Tc(Mc, a, b, c, d, e), true;
        case "mouseover":
          return Nc = Tc(Nc, a, b, c, d, e), true;
        case "pointerover":
          var f2 = e.pointerId;
          Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
          return true;
        case "gotpointercapture":
          return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
      }
      return false;
    }
    function Vc(a) {
      var b = Wc(a.target);
      if (null !== b) {
        var c = Vb(b);
        if (null !== c) {
          if (b = c.tag, 13 === b) {
            if (b = Wb(c), null !== b) {
              a.blockedOn = b;
              Ic(a.priority, function() {
                Gc(c);
              });
              return;
            }
          } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
            a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function Xc(a) {
      if (null !== a.blockedOn) return false;
      for (var b = a.targetContainers; 0 < b.length; ) {
        var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
        if (null === c) {
          c = a.nativeEvent;
          var d = new c.constructor(c.type, c);
          wb = d;
          c.target.dispatchEvent(d);
          wb = null;
        } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
        b.shift();
      }
      return true;
    }
    function Zc(a, b, c) {
      Xc(a) && c.delete(b);
    }
    function $c() {
      Jc = false;
      null !== Lc && Xc(Lc) && (Lc = null);
      null !== Mc && Xc(Mc) && (Mc = null);
      null !== Nc && Xc(Nc) && (Nc = null);
      Oc.forEach(Zc);
      Pc.forEach(Zc);
    }
    function ad(a, b) {
      a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
    }
    function bd(a) {
      function b(b2) {
        return ad(b2, a);
      }
      if (0 < Kc.length) {
        ad(Kc[0], a);
        for (var c = 1; c < Kc.length; c++) {
          var d = Kc[c];
          d.blockedOn === a && (d.blockedOn = null);
        }
      }
      null !== Lc && ad(Lc, a);
      null !== Mc && ad(Mc, a);
      null !== Nc && ad(Nc, a);
      Oc.forEach(b);
      Pc.forEach(b);
      for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
      for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
    }
    var cd = ua.ReactCurrentBatchConfig, dd = true;
    function ed(a, b, c, d) {
      var e = C, f2 = cd.transition;
      cd.transition = null;
      try {
        C = 1, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f2;
      }
    }
    function gd(a, b, c, d) {
      var e = C, f2 = cd.transition;
      cd.transition = null;
      try {
        C = 4, fd(a, b, c, d);
      } finally {
        C = e, cd.transition = f2;
      }
    }
    function fd(a, b, c, d) {
      if (dd) {
        var e = Yc(a, b, c, d);
        if (null === e) hd(a, b, d, id, c), Sc(a, d);
        else if (Uc(e, a, b, c, d)) d.stopPropagation();
        else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
          for (; null !== e; ) {
            var f2 = Cb(e);
            null !== f2 && Ec(f2);
            f2 = Yc(a, b, c, d);
            null === f2 && hd(a, b, d, id, c);
            if (f2 === e) break;
            e = f2;
          }
          null !== e && d.stopPropagation();
        } else hd(a, b, d, null, c);
      }
    }
    var id = null;
    function Yc(a, b, c, d) {
      id = null;
      a = xb(d);
      a = Wc(a);
      if (null !== a) if (b = Vb(a), null === b) a = null;
      else if (c = b.tag, 13 === c) {
        a = Wb(b);
        if (null !== a) return a;
        a = null;
      } else if (3 === c) {
        if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
        a = null;
      } else b !== a && (a = null);
      id = a;
      return null;
    }
    function jd(a) {
      switch (a) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 4;
        case "message":
          switch (ec()) {
            case fc:
              return 1;
            case gc:
              return 4;
            case hc:
            case ic:
              return 16;
            case jc:
              return 536870912;
            default:
              return 16;
          }
        default:
          return 16;
      }
    }
    var kd = null, ld = null, md = null;
    function nd() {
      if (md) return md;
      var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
      for (a = 0; a < c && b[a] === e[a]; a++) ;
      var g = c - a;
      for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
      return md = e.slice(a, 1 < d ? 1 - d : void 0);
    }
    function od(a) {
      var b = a.keyCode;
      "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
      10 === a && (a = 13);
      return 32 <= a || 13 === a ? a : 0;
    }
    function pd() {
      return true;
    }
    function qd() {
      return false;
    }
    function rd(a) {
      function b(b2, d, e, f2, g) {
        this._reactName = b2;
        this._targetInst = e;
        this.type = d;
        this.nativeEvent = f2;
        this.target = g;
        this.currentTarget = null;
        for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
        this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
        this.isPropagationStopped = qd;
        return this;
      }
      A(b.prototype, { preventDefault: function() {
        this.defaultPrevented = true;
        var a2 = this.nativeEvent;
        a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
      }, stopPropagation: function() {
        var a2 = this.nativeEvent;
        a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
      }, persist: function() {
      }, isPersistent: pd });
      return b;
    }
    var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
      return a.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
      return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
    }, movementX: function(a) {
      if ("movementX" in a) return a.movementX;
      a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
      return wd;
    }, movementY: function(a) {
      return "movementY" in a ? a.movementY : xd;
    } }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
      return "clipboardData" in a ? a.clipboardData : window.clipboardData;
    } }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Nd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function Pd(a) {
      var b = this.nativeEvent;
      return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
    }
    function zd() {
      return Pd;
    }
    var Qd = A({}, ud, { key: function(a) {
      if (a.key) {
        var b = Md[a.key] || a.key;
        if ("Unidentified" !== b) return b;
      }
      return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
      return "keypress" === a.type ? od(a) : 0;
    }, keyCode: function(a) {
      return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    }, which: function(a) {
      return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
    } }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
      deltaX: function(a) {
        return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
      },
      deltaY: function(a) {
        return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
    ia && "documentMode" in document && (be = document.documentMode);
    var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
    function ge(a, b) {
      switch (a) {
        case "keyup":
          return -1 !== $d.indexOf(b.keyCode);
        case "keydown":
          return 229 !== b.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return true;
        default:
          return false;
      }
    }
    function he(a) {
      a = a.detail;
      return "object" === typeof a && "data" in a ? a.data : null;
    }
    var ie = false;
    function je(a, b) {
      switch (a) {
        case "compositionend":
          return he(b);
        case "keypress":
          if (32 !== b.which) return null;
          fe = true;
          return ee;
        case "textInput":
          return a = b.data, a === ee && fe ? null : a;
        default:
          return null;
      }
    }
    function ke(a, b) {
      if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
            if (b.char && 1 < b.char.length) return b.char;
            if (b.which) return String.fromCharCode(b.which);
          }
          return null;
        case "compositionend":
          return de && "ko" !== b.locale ? null : b.data;
        default:
          return null;
      }
    }
    var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
    function me(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
    }
    function ne(a, b, c, d) {
      Eb(d);
      b = oe(b, "onChange");
      0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
    }
    var pe = null, qe = null;
    function re(a) {
      se(a, 0);
    }
    function te(a) {
      var b = ue(a);
      if (Wa(b)) return a;
    }
    function ve(a, b) {
      if ("change" === a) return b;
    }
    var we = false;
    if (ia) {
      var xe;
      if (ia) {
        var ye = "oninput" in document;
        if (!ye) {
          var ze = document.createElement("div");
          ze.setAttribute("oninput", "return;");
          ye = "function" === typeof ze.oninput;
        }
        xe = ye;
      } else xe = false;
      we = xe && (!document.documentMode || 9 < document.documentMode);
    }
    function Ae() {
      pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
    }
    function Be(a) {
      if ("value" === a.propertyName && te(qe)) {
        var b = [];
        ne(b, qe, a, xb(a));
        Jb(re, b);
      }
    }
    function Ce(a, b, c) {
      "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
    }
    function De(a) {
      if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
    }
    function Ee(a, b) {
      if ("click" === a) return te(b);
    }
    function Fe(a, b) {
      if ("input" === a || "change" === a) return te(b);
    }
    function Ge(a, b) {
      return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
    }
    var He = "function" === typeof Object.is ? Object.is : Ge;
    function Ie(a, b) {
      if (He(a, b)) return true;
      if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
      var c = Object.keys(a), d = Object.keys(b);
      if (c.length !== d.length) return false;
      for (d = 0; d < c.length; d++) {
        var e = c[d];
        if (!ja.call(b, e) || !He(a[e], b[e])) return false;
      }
      return true;
    }
    function Je(a) {
      for (; a && a.firstChild; ) a = a.firstChild;
      return a;
    }
    function Ke(a, b) {
      var c = Je(a);
      a = 0;
      for (var d; c; ) {
        if (3 === c.nodeType) {
          d = a + c.textContent.length;
          if (a <= b && d >= b) return { node: c, offset: b - a };
          a = d;
        }
        a: {
          for (; c; ) {
            if (c.nextSibling) {
              c = c.nextSibling;
              break a;
            }
            c = c.parentNode;
          }
          c = void 0;
        }
        c = Je(c);
      }
    }
    function Le(a, b) {
      return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
    }
    function Me() {
      for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
        try {
          var c = "string" === typeof b.contentWindow.location.href;
        } catch (d) {
          c = false;
        }
        if (c) a = b.contentWindow;
        else break;
        b = Xa(a.document);
      }
      return b;
    }
    function Ne(a) {
      var b = a && a.nodeName && a.nodeName.toLowerCase();
      return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
    }
    function Oe(a) {
      var b = Me(), c = a.focusedElem, d = a.selectionRange;
      if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
        if (null !== d && Ne(c)) {
          if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
          else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
            a = a.getSelection();
            var e = c.textContent.length, f2 = Math.min(d.start, e);
            d = void 0 === d.end ? f2 : Math.min(d.end, e);
            !a.extend && f2 > d && (e = d, d = f2, f2 = e);
            e = Ke(c, f2);
            var g = Ke(
              c,
              d
            );
            e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
          }
        }
        b = [];
        for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
        "function" === typeof c.focus && c.focus();
        for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
      }
    }
    var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
    function Ue(a, b, c) {
      var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
      Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
    }
    function Ve(a, b) {
      var c = {};
      c[a.toLowerCase()] = b.toLowerCase();
      c["Webkit" + a] = "webkit" + b;
      c["Moz" + a] = "moz" + b;
      return c;
    }
    var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
    ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
    function Ze(a) {
      if (Xe[a]) return Xe[a];
      if (!We[a]) return a;
      var b = We[a], c;
      for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
      return a;
    }
    var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    function ff(a, b) {
      df.set(a, b);
      fa(b, [a]);
    }
    for (var gf = 0; gf < ef.length; gf++) {
      var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
      ff(jf, "on" + kf);
    }
    ff($e, "onAnimationEnd");
    ff(af, "onAnimationIteration");
    ff(bf, "onAnimationStart");
    ff("dblclick", "onDoubleClick");
    ff("focusin", "onFocus");
    ff("focusout", "onBlur");
    ff(cf, "onTransitionEnd");
    ha("onMouseEnter", ["mouseout", "mouseover"]);
    ha("onMouseLeave", ["mouseout", "mouseover"]);
    ha("onPointerEnter", ["pointerout", "pointerover"]);
    ha("onPointerLeave", ["pointerout", "pointerover"]);
    fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
    fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
    fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
    function nf(a, b, c) {
      var d = a.type || "unknown-event";
      a.currentTarget = c;
      Ub(d, b, void 0, a);
      a.currentTarget = null;
    }
    function se(a, b) {
      b = 0 !== (b & 4);
      for (var c = 0; c < a.length; c++) {
        var d = a[c], e = d.event;
        d = d.listeners;
        a: {
          var f2 = void 0;
          if (b) for (var g = d.length - 1; 0 <= g; g--) {
            var h = d[g], k2 = h.instance, l2 = h.currentTarget;
            h = h.listener;
            if (k2 !== f2 && e.isPropagationStopped()) break a;
            nf(e, h, l2);
            f2 = k2;
          }
          else for (g = 0; g < d.length; g++) {
            h = d[g];
            k2 = h.instance;
            l2 = h.currentTarget;
            h = h.listener;
            if (k2 !== f2 && e.isPropagationStopped()) break a;
            nf(e, h, l2);
            f2 = k2;
          }
        }
      }
      if (Qb) throw a = Rb, Qb = false, Rb = null, a;
    }
    function D(a, b) {
      var c = b[of];
      void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
      var d = a + "__bubble";
      c.has(d) || (pf(b, a, 2, false), c.add(d));
    }
    function qf(a, b, c) {
      var d = 0;
      b && (d |= 4);
      pf(c, a, d, b);
    }
    var rf = "_reactListening" + Math.random().toString(36).slice(2);
    function sf(a) {
      if (!a[rf]) {
        a[rf] = true;
        da.forEach(function(b2) {
          "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
        });
        var b = 9 === a.nodeType ? a : a.ownerDocument;
        null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
      }
    }
    function pf(a, b, c, d) {
      switch (jd(b)) {
        case 1:
          var e = ed;
          break;
        case 4:
          e = gd;
          break;
        default:
          e = fd;
      }
      c = e.bind(null, b, c, a);
      e = void 0;
      !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
      d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
    }
    function hd(a, b, c, d, e) {
      var f2 = d;
      if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
        if (null === d) return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h = d.stateNode.containerInfo;
          if (h === e || 8 === h.nodeType && h.parentNode === e) break;
          if (4 === g) for (g = d.return; null !== g; ) {
            var k2 = g.tag;
            if (3 === k2 || 4 === k2) {
              if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
            }
            g = g.return;
          }
          for (; null !== h; ) {
            g = Wc(h);
            if (null === g) return;
            k2 = g.tag;
            if (5 === k2 || 6 === k2) {
              d = f2 = g;
              continue a;
            }
            h = h.parentNode;
          }
        }
        d = d.return;
      }
      Jb(function() {
        var d2 = f2, e2 = xb(c), g2 = [];
        a: {
          var h2 = df.get(a);
          if (void 0 !== h2) {
            var k3 = td, n2 = a;
            switch (a) {
              case "keypress":
                if (0 === od(c)) break a;
              case "keydown":
              case "keyup":
                k3 = Rd;
                break;
              case "focusin":
                n2 = "focus";
                k3 = Fd;
                break;
              case "focusout":
                n2 = "blur";
                k3 = Fd;
                break;
              case "beforeblur":
              case "afterblur":
                k3 = Fd;
                break;
              case "click":
                if (2 === c.button) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                k3 = Bd;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                k3 = Dd;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                k3 = Vd;
                break;
              case $e:
              case af:
              case bf:
                k3 = Hd;
                break;
              case cf:
                k3 = Xd;
                break;
              case "scroll":
                k3 = vd;
                break;
              case "wheel":
                k3 = Zd;
                break;
              case "copy":
              case "cut":
              case "paste":
                k3 = Jd;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                k3 = Td;
            }
            var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
            t2 = [];
            for (var w2 = d2, u2; null !== w2; ) {
              u2 = w2;
              var F2 = u2.stateNode;
              5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
              if (J2) break;
              w2 = w2.return;
            }
            0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
          }
        }
        if (0 === (b & 7)) {
          a: {
            h2 = "mouseover" === a || "pointerover" === a;
            k3 = "mouseout" === a || "pointerout" === a;
            if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
            if (k3 || h2) {
              h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
              if (k3) {
                if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
              } else k3 = null, n2 = d2;
              if (k3 !== n2) {
                t2 = Bd;
                F2 = "onMouseLeave";
                x2 = "onMouseEnter";
                w2 = "mouse";
                if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
                J2 = null == k3 ? h2 : ue(k3);
                u2 = null == n2 ? h2 : ue(n2);
                h2 = new t2(F2, w2 + "leave", k3, c, e2);
                h2.target = J2;
                h2.relatedTarget = u2;
                F2 = null;
                Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
                J2 = F2;
                if (k3 && n2) b: {
                  t2 = k3;
                  x2 = n2;
                  w2 = 0;
                  for (u2 = t2; u2; u2 = vf(u2)) w2++;
                  u2 = 0;
                  for (F2 = x2; F2; F2 = vf(F2)) u2++;
                  for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
                  for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
                  for (; w2--; ) {
                    if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                    t2 = vf(t2);
                    x2 = vf(x2);
                  }
                  t2 = null;
                }
                else t2 = null;
                null !== k3 && wf(g2, h2, k3, t2, false);
                null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
              }
            }
          }
          a: {
            h2 = d2 ? ue(d2) : window;
            k3 = h2.nodeName && h2.nodeName.toLowerCase();
            if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
            else if (me(h2)) if (we) na = Fe;
            else {
              na = De;
              var xa = Ce;
            }
            else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
            if (na && (na = na(a, d2))) {
              ne(g2, na, c, e2);
              break a;
            }
            xa && xa(a, h2, d2);
            "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
          }
          xa = d2 ? ue(d2) : window;
          switch (a) {
            case "focusin":
              if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
              break;
            case "focusout":
              Se = Re = Qe = null;
              break;
            case "mousedown":
              Te = true;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Te = false;
              Ue(g2, c, e2);
              break;
            case "selectionchange":
              if (Pe) break;
            case "keydown":
            case "keyup":
              Ue(g2, c, e2);
          }
          var $a;
          if (ae) b: {
            switch (a) {
              case "compositionstart":
                var ba = "onCompositionStart";
                break b;
              case "compositionend":
                ba = "onCompositionEnd";
                break b;
              case "compositionupdate":
                ba = "onCompositionUpdate";
                break b;
            }
            ba = void 0;
          }
          else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
          ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
          if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
        }
        se(g2, b);
      });
    }
    function tf(a, b, c) {
      return { instance: a, listener: b, currentTarget: c };
    }
    function oe(a, b) {
      for (var c = b + "Capture", d = []; null !== a; ) {
        var e = a, f2 = e.stateNode;
        5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
        a = a.return;
      }
      return d;
    }
    function vf(a) {
      if (null === a) return null;
      do
        a = a.return;
      while (a && 5 !== a.tag);
      return a ? a : null;
    }
    function wf(a, b, c, d, e) {
      for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
        var h = c, k2 = h.alternate, l2 = h.stateNode;
        if (null !== k2 && k2 === d) break;
        5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
        c = c.return;
      }
      0 !== g.length && a.push({ event: b, listeners: g });
    }
    var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
    function zf(a) {
      return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
    }
    function Af(a, b, c) {
      b = zf(b);
      if (zf(a) !== b && c) throw Error(p(425));
    }
    function Bf() {
    }
    var Cf = null, Df = null;
    function Ef(a, b) {
      return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
    }
    var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
      return Hf.resolve(null).then(a).catch(If);
    } : Ff;
    function If(a) {
      setTimeout(function() {
        throw a;
      });
    }
    function Kf(a, b) {
      var c = b, d = 0;
      do {
        var e = c.nextSibling;
        a.removeChild(c);
        if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
          if (0 === d) {
            a.removeChild(e);
            bd(b);
            return;
          }
          d--;
        } else "$" !== c && "$?" !== c && "$!" !== c || d++;
        c = e;
      } while (c);
      bd(b);
    }
    function Lf(a) {
      for (; null != a; a = a.nextSibling) {
        var b = a.nodeType;
        if (1 === b || 3 === b) break;
        if (8 === b) {
          b = a.data;
          if ("$" === b || "$!" === b || "$?" === b) break;
          if ("/$" === b) return null;
        }
      }
      return a;
    }
    function Mf(a) {
      a = a.previousSibling;
      for (var b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("$" === c || "$!" === c || "$?" === c) {
            if (0 === b) return a;
            b--;
          } else "/$" === c && b++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
    function Wc(a) {
      var b = a[Of];
      if (b) return b;
      for (var c = a.parentNode; c; ) {
        if (b = c[uf] || c[Of]) {
          c = b.alternate;
          if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
            if (c = a[Of]) return c;
            a = Mf(a);
          }
          return b;
        }
        a = c;
        c = a.parentNode;
      }
      return null;
    }
    function Cb(a) {
      a = a[Of] || a[uf];
      return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
    }
    function ue(a) {
      if (5 === a.tag || 6 === a.tag) return a.stateNode;
      throw Error(p(33));
    }
    function Db(a) {
      return a[Pf] || null;
    }
    var Sf = [], Tf = -1;
    function Uf(a) {
      return { current: a };
    }
    function E(a) {
      0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
    }
    function G(a, b) {
      Tf++;
      Sf[Tf] = a.current;
      a.current = b;
    }
    var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
    function Yf(a, b) {
      var c = a.type.contextTypes;
      if (!c) return Vf;
      var d = a.stateNode;
      if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
      var e = {}, f2;
      for (f2 in c) e[f2] = b[f2];
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
      return e;
    }
    function Zf(a) {
      a = a.childContextTypes;
      return null !== a && void 0 !== a;
    }
    function $f() {
      E(Wf);
      E(H);
    }
    function ag(a, b, c) {
      if (H.current !== Vf) throw Error(p(168));
      G(H, b);
      G(Wf, c);
    }
    function bg(a, b, c) {
      var d = a.stateNode;
      b = b.childContextTypes;
      if ("function" !== typeof d.getChildContext) return c;
      d = d.getChildContext();
      for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
      return A({}, c, d);
    }
    function cg(a) {
      a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
      Xf = H.current;
      G(H, a);
      G(Wf, Wf.current);
      return true;
    }
    function dg(a, b, c) {
      var d = a.stateNode;
      if (!d) throw Error(p(169));
      c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
      G(Wf, c);
    }
    var eg = null, fg = false, gg = false;
    function hg(a) {
      null === eg ? eg = [a] : eg.push(a);
    }
    function ig(a) {
      fg = true;
      hg(a);
    }
    function jg() {
      if (!gg && null !== eg) {
        gg = true;
        var a = 0, b = C;
        try {
          var c = eg;
          for (C = 1; a < c.length; a++) {
            var d = c[a];
            do
              d = d(true);
            while (null !== d);
          }
          eg = null;
          fg = false;
        } catch (e) {
          throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
        } finally {
          C = b, gg = false;
        }
      }
      return null;
    }
    var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
    function tg(a, b) {
      kg[lg++] = ng;
      kg[lg++] = mg;
      mg = a;
      ng = b;
    }
    function ug(a, b, c) {
      og[pg++] = rg;
      og[pg++] = sg;
      og[pg++] = qg;
      qg = a;
      var d = rg;
      a = sg;
      var e = 32 - oc(d) - 1;
      d &= ~(1 << e);
      c += 1;
      var f2 = 32 - oc(b) + e;
      if (30 < f2) {
        var g = e - e % 5;
        f2 = (d & (1 << g) - 1).toString(32);
        d >>= g;
        e -= g;
        rg = 1 << 32 - oc(b) + e | c << e | d;
        sg = f2 + a;
      } else rg = 1 << f2 | c << e | d, sg = a;
    }
    function vg(a) {
      null !== a.return && (tg(a, 1), ug(a, 1, 0));
    }
    function wg(a) {
      for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
      for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
    }
    var xg = null, yg = null, I = false, zg = null;
    function Ag(a, b) {
      var c = Bg(5, null, null, 0);
      c.elementType = "DELETED";
      c.stateNode = b;
      c.return = a;
      b = a.deletions;
      null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
    }
    function Cg(a, b) {
      switch (a.tag) {
        case 5:
          var c = a.type;
          b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
          return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
        case 6:
          return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
        case 13:
          return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
        default:
          return false;
      }
    }
    function Dg(a) {
      return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
    }
    function Eg(a) {
      if (I) {
        var b = yg;
        if (b) {
          var c = b;
          if (!Cg(a, b)) {
            if (Dg(a)) throw Error(p(418));
            b = Lf(c.nextSibling);
            var d = xg;
            b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
          }
        } else {
          if (Dg(a)) throw Error(p(418));
          a.flags = a.flags & -4097 | 2;
          I = false;
          xg = a;
        }
      }
    }
    function Fg(a) {
      for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
      xg = a;
    }
    function Gg(a) {
      if (a !== xg) return false;
      if (!I) return Fg(a), I = true, false;
      var b;
      (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
      if (b && (b = yg)) {
        if (Dg(a)) throw Hg(), Error(p(418));
        for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
      }
      Fg(a);
      if (13 === a.tag) {
        a = a.memoizedState;
        a = null !== a ? a.dehydrated : null;
        if (!a) throw Error(p(317));
        a: {
          a = a.nextSibling;
          for (b = 0; a; ) {
            if (8 === a.nodeType) {
              var c = a.data;
              if ("/$" === c) {
                if (0 === b) {
                  yg = Lf(a.nextSibling);
                  break a;
                }
                b--;
              } else "$" !== c && "$!" !== c && "$?" !== c || b++;
            }
            a = a.nextSibling;
          }
          yg = null;
        }
      } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
      return true;
    }
    function Hg() {
      for (var a = yg; a; ) a = Lf(a.nextSibling);
    }
    function Ig() {
      yg = xg = null;
      I = false;
    }
    function Jg(a) {
      null === zg ? zg = [a] : zg.push(a);
    }
    var Kg = ua.ReactCurrentBatchConfig;
    function Lg(a, b, c) {
      a = c.ref;
      if (null !== a && "function" !== typeof a && "object" !== typeof a) {
        if (c._owner) {
          c = c._owner;
          if (c) {
            if (1 !== c.tag) throw Error(p(309));
            var d = c.stateNode;
          }
          if (!d) throw Error(p(147, a));
          var e = d, f2 = "" + a;
          if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
          b = function(a2) {
            var b2 = e.refs;
            null === a2 ? delete b2[f2] : b2[f2] = a2;
          };
          b._stringRef = f2;
          return b;
        }
        if ("string" !== typeof a) throw Error(p(284));
        if (!c._owner) throw Error(p(290, a));
      }
      return a;
    }
    function Mg(a, b) {
      a = Object.prototype.toString.call(b);
      throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
    }
    function Ng(a) {
      var b = a._init;
      return b(a._payload);
    }
    function Og(a) {
      function b(b2, c2) {
        if (a) {
          var d2 = b2.deletions;
          null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
        }
      }
      function c(c2, d2) {
        if (!a) return null;
        for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
        return null;
      }
      function d(a2, b2) {
        for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
        return a2;
      }
      function e(a2, b2) {
        a2 = Pg(a2, b2);
        a2.index = 0;
        a2.sibling = null;
        return a2;
      }
      function f2(b2, c2, d2) {
        b2.index = d2;
        if (!a) return b2.flags |= 1048576, c2;
        d2 = b2.alternate;
        if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
        b2.flags |= 2;
        return c2;
      }
      function g(b2) {
        a && null === b2.alternate && (b2.flags |= 2);
        return b2;
      }
      function h(a2, b2, c2, d2) {
        if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function k2(a2, b2, c2, d2) {
        var f3 = c2.type;
        if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
        if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
        d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
        d2.ref = Lg(a2, b2, c2);
        d2.return = a2;
        return d2;
      }
      function l2(a2, b2, c2, d2) {
        if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
        b2 = e(b2, c2.children || []);
        b2.return = a2;
        return b2;
      }
      function m2(a2, b2, c2, d2, f3) {
        if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
        b2 = e(b2, c2);
        b2.return = a2;
        return b2;
      }
      function q2(a2, b2, c2) {
        if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
        if ("object" === typeof b2 && null !== b2) {
          switch (b2.$$typeof) {
            case va:
              return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
            case wa:
              return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
            case Ha:
              var d2 = b2._init;
              return q2(a2, d2(b2._payload), c2);
          }
          if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
          Mg(a2, b2);
        }
        return null;
      }
      function r2(a2, b2, c2, d2) {
        var e2 = null !== b2 ? b2.key : null;
        if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
        if ("object" === typeof c2 && null !== c2) {
          switch (c2.$$typeof) {
            case va:
              return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
            case wa:
              return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
            case Ha:
              return e2 = c2._init, r2(
                a2,
                b2,
                e2(c2._payload),
                d2
              );
          }
          if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
          Mg(a2, c2);
        }
        return null;
      }
      function y2(a2, b2, c2, d2, e2) {
        if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
        if ("object" === typeof d2 && null !== d2) {
          switch (d2.$$typeof) {
            case va:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
            case wa:
              return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
            case Ha:
              var f3 = d2._init;
              return y2(a2, b2, c2, f3(d2._payload), e2);
          }
          if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
          Mg(b2, d2);
        }
        return null;
      }
      function n2(e2, g2, h2, k3) {
        for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
          u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
          var n3 = r2(e2, u2, h2[w2], k3);
          if (null === n3) {
            null === u2 && (u2 = x2);
            break;
          }
          a && u2 && null === n3.alternate && b(e2, u2);
          g2 = f2(n3, g2, w2);
          null === m3 ? l3 = n3 : m3.sibling = n3;
          m3 = n3;
          u2 = x2;
        }
        if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
        if (null === u2) {
          for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
          I && tg(e2, w2);
          return l3;
        }
        for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
        a && u2.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w2);
        return l3;
      }
      function t2(e2, g2, h2, k3) {
        var l3 = Ka(h2);
        if ("function" !== typeof l3) throw Error(p(150));
        h2 = l3.call(h2);
        if (null == h2) throw Error(p(151));
        for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
          m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
          var t3 = r2(e2, m3, n3.value, k3);
          if (null === t3) {
            null === m3 && (m3 = x2);
            break;
          }
          a && m3 && null === t3.alternate && b(e2, m3);
          g2 = f2(t3, g2, w2);
          null === u2 ? l3 = t3 : u2.sibling = t3;
          u2 = t3;
          m3 = x2;
        }
        if (n3.done) return c(
          e2,
          m3
        ), I && tg(e2, w2), l3;
        if (null === m3) {
          for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
          I && tg(e2, w2);
          return l3;
        }
        for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
        a && m3.forEach(function(a2) {
          return b(e2, a2);
        });
        I && tg(e2, w2);
        return l3;
      }
      function J2(a2, d2, f3, h2) {
        "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
        if ("object" === typeof f3 && null !== f3) {
          switch (f3.$$typeof) {
            case va:
              a: {
                for (var k3 = f3.key, l3 = d2; null !== l3; ) {
                  if (l3.key === k3) {
                    k3 = f3.type;
                    if (k3 === ya) {
                      if (7 === l3.tag) {
                        c(a2, l3.sibling);
                        d2 = e(l3, f3.props.children);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                    } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                      c(a2, l3.sibling);
                      d2 = e(l3, f3.props);
                      d2.ref = Lg(a2, l3, f3);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                    c(a2, l3);
                    break;
                  } else b(a2, l3);
                  l3 = l3.sibling;
                }
                f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
              }
              return g(a2);
            case wa:
              a: {
                for (l3 = f3.key; null !== d2; ) {
                  if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                    c(a2, d2.sibling);
                    d2 = e(d2, f3.children || []);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  } else {
                    c(a2, d2);
                    break;
                  }
                  else b(a2, d2);
                  d2 = d2.sibling;
                }
                d2 = Sg(f3, a2.mode, h2);
                d2.return = a2;
                a2 = d2;
              }
              return g(a2);
            case Ha:
              return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
          }
          if (eb(f3)) return n2(a2, d2, f3, h2);
          if (Ka(f3)) return t2(a2, d2, f3, h2);
          Mg(a2, f3);
        }
        return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
      }
      return J2;
    }
    var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
    function $g() {
      Zg = Yg = Xg = null;
    }
    function ah(a) {
      var b = Wg.current;
      E(Wg);
      a._currentValue = b;
    }
    function bh(a, b, c) {
      for (; null !== a; ) {
        var d = a.alternate;
        (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
        if (a === c) break;
        a = a.return;
      }
    }
    function ch(a, b) {
      Xg = a;
      Zg = Yg = null;
      a = a.dependencies;
      null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
    }
    function eh(a) {
      var b = a._currentValue;
      if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
        if (null === Xg) throw Error(p(308));
        Yg = a;
        Xg.dependencies = { lanes: 0, firstContext: a };
      } else Yg = Yg.next = a;
      return b;
    }
    var fh = null;
    function gh(a) {
      null === fh ? fh = [a] : fh.push(a);
    }
    function hh(a, b, c, d) {
      var e = b.interleaved;
      null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
      b.interleaved = c;
      return ih(a, d);
    }
    function ih(a, b) {
      a.lanes |= b;
      var c = a.alternate;
      null !== c && (c.lanes |= b);
      c = a;
      for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
      return 3 === c.tag ? c.stateNode : null;
    }
    var jh = false;
    function kh(a) {
      a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
    }
    function lh(a, b) {
      a = a.updateQueue;
      b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
    }
    function mh(a, b) {
      return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
    }
    function nh(a, b, c) {
      var d = a.updateQueue;
      if (null === d) return null;
      d = d.shared;
      if (0 !== (K & 2)) {
        var e = d.pending;
        null === e ? b.next = b : (b.next = e.next, e.next = b);
        d.pending = b;
        return ih(a, c);
      }
      e = d.interleaved;
      null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
      d.interleaved = b;
      return ih(a, c);
    }
    function oh(a, b, c) {
      b = b.updateQueue;
      if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    function ph(a, b) {
      var c = a.updateQueue, d = a.alternate;
      if (null !== d && (d = d.updateQueue, c === d)) {
        var e = null, f2 = null;
        c = c.firstBaseUpdate;
        if (null !== c) {
          do {
            var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
            null === f2 ? e = f2 = g : f2 = f2.next = g;
            c = c.next;
          } while (null !== c);
          null === f2 ? e = f2 = b : f2 = f2.next = b;
        } else e = f2 = b;
        c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
        a.updateQueue = c;
        return;
      }
      a = c.lastBaseUpdate;
      null === a ? c.firstBaseUpdate = b : a.next = b;
      c.lastBaseUpdate = b;
    }
    function qh(a, b, c, d) {
      var e = a.updateQueue;
      jh = false;
      var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
      if (null !== h) {
        e.shared.pending = null;
        var k2 = h, l2 = k2.next;
        k2.next = null;
        null === g ? f2 = l2 : g.next = l2;
        g = k2;
        var m2 = a.alternate;
        null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
      }
      if (null !== f2) {
        var q2 = e.baseState;
        g = 0;
        m2 = l2 = k2 = null;
        h = f2;
        do {
          var r2 = h.lane, y2 = h.eventTime;
          if ((d & r2) === r2) {
            null !== m2 && (m2 = m2.next = {
              eventTime: y2,
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            });
            a: {
              var n2 = a, t2 = h;
              r2 = b;
              y2 = c;
              switch (t2.tag) {
                case 1:
                  n2 = t2.payload;
                  if ("function" === typeof n2) {
                    q2 = n2.call(y2, q2, r2);
                    break a;
                  }
                  q2 = n2;
                  break a;
                case 3:
                  n2.flags = n2.flags & -65537 | 128;
                case 0:
                  n2 = t2.payload;
                  r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
                  if (null === r2 || void 0 === r2) break a;
                  q2 = A({}, q2, r2);
                  break a;
                case 2:
                  jh = true;
              }
            }
            null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
          } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
          h = h.next;
          if (null === h) if (h = e.shared.pending, null === h) break;
          else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
        } while (1);
        null === m2 && (k2 = q2);
        e.baseState = k2;
        e.firstBaseUpdate = l2;
        e.lastBaseUpdate = m2;
        b = e.shared.interleaved;
        if (null !== b) {
          e = b;
          do
            g |= e.lane, e = e.next;
          while (e !== b);
        } else null === f2 && (e.shared.lanes = 0);
        rh |= g;
        a.lanes = g;
        a.memoizedState = q2;
      }
    }
    function sh(a, b, c) {
      a = b.effects;
      b.effects = null;
      if (null !== a) for (b = 0; b < a.length; b++) {
        var d = a[b], e = d.callback;
        if (null !== e) {
          d.callback = null;
          d = c;
          if ("function" !== typeof e) throw Error(p(191, e));
          e.call(d);
        }
      }
    }
    var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
    function xh(a) {
      if (a === th) throw Error(p(174));
      return a;
    }
    function yh(a, b) {
      G(wh, b);
      G(vh, a);
      G(uh, th);
      a = b.nodeType;
      switch (a) {
        case 9:
        case 11:
          b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
          break;
        default:
          a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
      }
      E(uh);
      G(uh, b);
    }
    function zh() {
      E(uh);
      E(vh);
      E(wh);
    }
    function Ah(a) {
      xh(wh.current);
      var b = xh(uh.current);
      var c = lb(b, a.type);
      b !== c && (G(vh, a), G(uh, c));
    }
    function Bh(a) {
      vh.current === a && (E(uh), E(vh));
    }
    var L = Uf(0);
    function Ch(a) {
      for (var b = a; null !== b; ) {
        if (13 === b.tag) {
          var c = b.memoizedState;
          if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
        } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
          if (0 !== (b.flags & 128)) return b;
        } else if (null !== b.child) {
          b.child.return = b;
          b = b.child;
          continue;
        }
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return null;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
      return null;
    }
    var Dh = [];
    function Eh() {
      for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
      Dh.length = 0;
    }
    var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
    function P() {
      throw Error(p(321));
    }
    function Mh(a, b) {
      if (null === b) return false;
      for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
      return true;
    }
    function Nh(a, b, c, d, e, f2) {
      Hh = f2;
      M = b;
      b.memoizedState = null;
      b.updateQueue = null;
      b.lanes = 0;
      Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
      a = c(d, e);
      if (Jh) {
        f2 = 0;
        do {
          Jh = false;
          Kh = 0;
          if (25 <= f2) throw Error(p(301));
          f2 += 1;
          O = N = null;
          b.updateQueue = null;
          Fh.current = Qh;
          a = c(d, e);
        } while (Jh);
      }
      Fh.current = Rh;
      b = null !== N && null !== N.next;
      Hh = 0;
      O = N = M = null;
      Ih = false;
      if (b) throw Error(p(300));
      return a;
    }
    function Sh() {
      var a = 0 !== Kh;
      Kh = 0;
      return a;
    }
    function Th() {
      var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
      return O;
    }
    function Uh() {
      if (null === N) {
        var a = M.alternate;
        a = null !== a ? a.memoizedState : null;
      } else a = N.next;
      var b = null === O ? M.memoizedState : O.next;
      if (null !== b) O = b, N = a;
      else {
        if (null === a) throw Error(p(310));
        N = a;
        a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
      }
      return O;
    }
    function Vh(a, b) {
      return "function" === typeof b ? b(a) : b;
    }
    function Wh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = N, e = d.baseQueue, f2 = c.pending;
      if (null !== f2) {
        if (null !== e) {
          var g = e.next;
          e.next = f2.next;
          f2.next = g;
        }
        d.baseQueue = e = f2;
        c.pending = null;
      }
      if (null !== e) {
        f2 = e.next;
        d = d.baseState;
        var h = g = null, k2 = null, l2 = f2;
        do {
          var m2 = l2.lane;
          if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
          else {
            var q2 = {
              lane: m2,
              action: l2.action,
              hasEagerState: l2.hasEagerState,
              eagerState: l2.eagerState,
              next: null
            };
            null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
            M.lanes |= m2;
            rh |= m2;
          }
          l2 = l2.next;
        } while (null !== l2 && l2 !== f2);
        null === k2 ? g = d : k2.next = h;
        He(d, b.memoizedState) || (dh = true);
        b.memoizedState = d;
        b.baseState = g;
        b.baseQueue = k2;
        c.lastRenderedState = d;
      }
      a = c.interleaved;
      if (null !== a) {
        e = a;
        do
          f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
        while (e !== a);
      } else null === e && (c.lanes = 0);
      return [b.memoizedState, c.dispatch];
    }
    function Xh(a) {
      var b = Uh(), c = b.queue;
      if (null === c) throw Error(p(311));
      c.lastRenderedReducer = a;
      var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
      if (null !== e) {
        c.pending = null;
        var g = e = e.next;
        do
          f2 = a(f2, g.action), g = g.next;
        while (g !== e);
        He(f2, b.memoizedState) || (dh = true);
        b.memoizedState = f2;
        null === b.baseQueue && (b.baseState = f2);
        c.lastRenderedState = f2;
      }
      return [f2, d];
    }
    function Yh() {
    }
    function Zh(a, b) {
      var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
      f2 && (d.memoizedState = e, dh = true);
      d = d.queue;
      $h(ai.bind(null, c, d, a), [a]);
      if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
        c.flags |= 2048;
        bi(9, ci.bind(null, c, d, e, b), void 0, null);
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(c, b, e);
      }
      return e;
    }
    function di(a, b, c) {
      a.flags |= 16384;
      a = { getSnapshot: b, value: c };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
    }
    function ci(a, b, c, d) {
      b.value = c;
      b.getSnapshot = d;
      ei(b) && fi(a);
    }
    function ai(a, b, c) {
      return c(function() {
        ei(b) && fi(a);
      });
    }
    function ei(a) {
      var b = a.getSnapshot;
      a = a.value;
      try {
        var c = b();
        return !He(a, c);
      } catch (d) {
        return true;
      }
    }
    function fi(a) {
      var b = ih(a, 1);
      null !== b && gi(b, a, 1, -1);
    }
    function hi(a) {
      var b = Th();
      "function" === typeof a && (a = a());
      b.memoizedState = b.baseState = a;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
      b.queue = a;
      a = a.dispatch = ii.bind(null, M, a);
      return [b.memoizedState, a];
    }
    function bi(a, b, c, d) {
      a = { tag: a, create: b, destroy: c, deps: d, next: null };
      b = M.updateQueue;
      null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
      return a;
    }
    function ji() {
      return Uh().memoizedState;
    }
    function ki(a, b, c, d) {
      var e = Th();
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
    }
    function li(a, b, c, d) {
      var e = Uh();
      d = void 0 === d ? null : d;
      var f2 = void 0;
      if (null !== N) {
        var g = N.memoizedState;
        f2 = g.destroy;
        if (null !== d && Mh(d, g.deps)) {
          e.memoizedState = bi(b, c, f2, d);
          return;
        }
      }
      M.flags |= a;
      e.memoizedState = bi(1 | b, c, f2, d);
    }
    function mi(a, b) {
      return ki(8390656, 8, a, b);
    }
    function $h(a, b) {
      return li(2048, 8, a, b);
    }
    function ni(a, b) {
      return li(4, 2, a, b);
    }
    function oi(a, b) {
      return li(4, 4, a, b);
    }
    function pi(a, b) {
      if ("function" === typeof b) return a = a(), b(a), function() {
        b(null);
      };
      if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
        b.current = null;
      };
    }
    function qi(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return li(4, 4, pi.bind(null, b, a), c);
    }
    function ri() {
    }
    function si(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      c.memoizedState = [a, b];
      return a;
    }
    function ti(a, b) {
      var c = Uh();
      b = void 0 === b ? null : b;
      var d = c.memoizedState;
      if (null !== d && null !== b && Mh(b, d[1])) return d[0];
      a = a();
      c.memoizedState = [a, b];
      return a;
    }
    function ui(a, b, c) {
      if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
      He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
      return b;
    }
    function vi(a, b) {
      var c = C;
      C = 0 !== c && 4 > c ? c : 4;
      a(true);
      var d = Gh.transition;
      Gh.transition = {};
      try {
        a(false), b();
      } finally {
        C = c, Gh.transition = d;
      }
    }
    function wi() {
      return Uh().memoizedState;
    }
    function xi(a, b, c) {
      var d = yi(a);
      c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, c);
      else if (c = hh(a, b, c, d), null !== c) {
        var e = R();
        gi(c, a, d, e);
        Bi(c, b, d);
      }
    }
    function ii(a, b, c) {
      var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
      if (zi(a)) Ai(b, e);
      else {
        var f2 = a.alternate;
        if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
          var g = b.lastRenderedState, h = f2(g, c);
          e.hasEagerState = true;
          e.eagerState = h;
          if (He(h, g)) {
            var k2 = b.interleaved;
            null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
            b.interleaved = e;
            return;
          }
        } catch (l2) {
        } finally {
        }
        c = hh(a, b, e, d);
        null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
      }
    }
    function zi(a) {
      var b = a.alternate;
      return a === M || null !== b && b === M;
    }
    function Ai(a, b) {
      Jh = Ih = true;
      var c = a.pending;
      null === c ? b.next = b : (b.next = c.next, c.next = b);
      a.pending = b;
    }
    function Bi(a, b, c) {
      if (0 !== (c & 4194240)) {
        var d = b.lanes;
        d &= a.pendingLanes;
        c |= d;
        b.lanes = c;
        Cc(a, c);
      }
    }
    var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
      Th().memoizedState = [a, void 0 === b ? null : b];
      return a;
    }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
      c = null !== c && void 0 !== c ? c.concat([a]) : null;
      return ki(
        4194308,
        4,
        pi.bind(null, b, a),
        c
      );
    }, useLayoutEffect: function(a, b) {
      return ki(4194308, 4, a, b);
    }, useInsertionEffect: function(a, b) {
      return ki(4, 2, a, b);
    }, useMemo: function(a, b) {
      var c = Th();
      b = void 0 === b ? null : b;
      a = a();
      c.memoizedState = [a, b];
      return a;
    }, useReducer: function(a, b, c) {
      var d = Th();
      b = void 0 !== c ? c(b) : b;
      d.memoizedState = d.baseState = b;
      a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
      d.queue = a;
      a = a.dispatch = xi.bind(null, M, a);
      return [d.memoizedState, a];
    }, useRef: function(a) {
      var b = Th();
      a = { current: a };
      return b.memoizedState = a;
    }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
      return Th().memoizedState = a;
    }, useTransition: function() {
      var a = hi(false), b = a[0];
      a = vi.bind(null, a[1]);
      Th().memoizedState = a;
      return [b, a];
    }, useMutableSource: function() {
    }, useSyncExternalStore: function(a, b, c) {
      var d = M, e = Th();
      if (I) {
        if (void 0 === c) throw Error(p(407));
        c = c();
      } else {
        c = b();
        if (null === Q) throw Error(p(349));
        0 !== (Hh & 30) || di(d, b, c);
      }
      e.memoizedState = c;
      var f2 = { value: c, getSnapshot: b };
      e.queue = f2;
      mi(ai.bind(
        null,
        d,
        f2,
        a
      ), [a]);
      d.flags |= 2048;
      bi(9, ci.bind(null, d, f2, c, b), void 0, null);
      return c;
    }, useId: function() {
      var a = Th(), b = Q.identifierPrefix;
      if (I) {
        var c = sg;
        var d = rg;
        c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
        b = ":" + b + "R" + c;
        c = Kh++;
        0 < c && (b += "H" + c.toString(32));
        b += ":";
      } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
      return a.memoizedState = b;
    }, unstable_isNewReconciler: false }, Ph = {
      readContext: eh,
      useCallback: si,
      useContext: eh,
      useEffect: $h,
      useImperativeHandle: qi,
      useInsertionEffect: ni,
      useLayoutEffect: oi,
      useMemo: ti,
      useReducer: Wh,
      useRef: ji,
      useState: function() {
        return Wh(Vh);
      },
      useDebugValue: ri,
      useDeferredValue: function(a) {
        var b = Uh();
        return ui(b, N.memoizedState, a);
      },
      useTransition: function() {
        var a = Wh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      },
      useMutableSource: Yh,
      useSyncExternalStore: Zh,
      useId: wi,
      unstable_isNewReconciler: false
    }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
      return Xh(Vh);
    }, useDebugValue: ri, useDeferredValue: function(a) {
      var b = Uh();
      return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
    }, useTransition: function() {
      var a = Xh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
    function Ci(a, b) {
      if (a && a.defaultProps) {
        b = A({}, b);
        a = a.defaultProps;
        for (var c in a) void 0 === b[c] && (b[c] = a[c]);
        return b;
      }
      return b;
    }
    function Di(a, b, c, d) {
      b = a.memoizedState;
      c = c(d, b);
      c = null === c || void 0 === c ? b : A({}, b, c);
      a.memoizedState = c;
      0 === a.lanes && (a.updateQueue.baseState = c);
    }
    var Ei = { isMounted: function(a) {
      return (a = a._reactInternals) ? Vb(a) === a : false;
    }, enqueueSetState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f2 = mh(d, e);
      f2.payload = b;
      void 0 !== c && null !== c && (f2.callback = c);
      b = nh(a, f2, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueReplaceState: function(a, b, c) {
      a = a._reactInternals;
      var d = R(), e = yi(a), f2 = mh(d, e);
      f2.tag = 1;
      f2.payload = b;
      void 0 !== c && null !== c && (f2.callback = c);
      b = nh(a, f2, e);
      null !== b && (gi(b, a, e, d), oh(b, a, e));
    }, enqueueForceUpdate: function(a, b) {
      a = a._reactInternals;
      var c = R(), d = yi(a), e = mh(c, d);
      e.tag = 2;
      void 0 !== b && null !== b && (e.callback = b);
      b = nh(a, e, d);
      null !== b && (gi(b, a, d, c), oh(b, a, d));
    } };
    function Fi(a, b, c, d, e, f2, g) {
      a = a.stateNode;
      return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
    }
    function Gi(a, b, c) {
      var d = false, e = Vf;
      var f2 = b.contextType;
      "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
      b = new b(c, f2);
      a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
      b.updater = Ei;
      a.stateNode = b;
      b._reactInternals = a;
      d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
      return b;
    }
    function Hi(a, b, c, d) {
      a = b.state;
      "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
      "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
      b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
    }
    function Ii(a, b, c, d) {
      var e = a.stateNode;
      e.props = c;
      e.state = a.memoizedState;
      e.refs = {};
      kh(a);
      var f2 = b.contextType;
      "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
      e.state = a.memoizedState;
      f2 = b.getDerivedStateFromProps;
      "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
      "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
      "function" === typeof e.componentDidMount && (a.flags |= 4194308);
    }
    function Ji(a, b) {
      try {
        var c = "", d = b;
        do
          c += Pa(d), d = d.return;
        while (d);
        var e = c;
      } catch (f2) {
        e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
      }
      return { value: a, source: b, stack: e, digest: null };
    }
    function Ki(a, b, c) {
      return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
    }
    function Li(a, b) {
      try {
        console.error(b.value);
      } catch (c) {
        setTimeout(function() {
          throw c;
        });
      }
    }
    var Mi = "function" === typeof WeakMap ? WeakMap : Map;
    function Ni(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      c.payload = { element: null };
      var d = b.value;
      c.callback = function() {
        Oi || (Oi = true, Pi = d);
        Li(a, b);
      };
      return c;
    }
    function Qi(a, b, c) {
      c = mh(-1, c);
      c.tag = 3;
      var d = a.type.getDerivedStateFromError;
      if ("function" === typeof d) {
        var e = b.value;
        c.payload = function() {
          return d(e);
        };
        c.callback = function() {
          Li(a, b);
        };
      }
      var f2 = a.stateNode;
      null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
        Li(a, b);
        "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
        var c2 = b.stack;
        this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
      });
      return c;
    }
    function Si(a, b, c) {
      var d = a.pingCache;
      if (null === d) {
        d = a.pingCache = new Mi();
        var e = /* @__PURE__ */ new Set();
        d.set(b, e);
      } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
      e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
    }
    function Ui(a) {
      do {
        var b;
        if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
        if (b) return a;
        a = a.return;
      } while (null !== a);
      return null;
    }
    function Vi(a, b, c, d, e) {
      if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
      a.flags |= 65536;
      a.lanes = e;
      return a;
    }
    var Wi = ua.ReactCurrentOwner, dh = false;
    function Xi(a, b, c, d) {
      b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
    }
    function Yi(a, b, c, d, e) {
      c = c.render;
      var f2 = b.ref;
      ch(b, e);
      d = Nh(a, b, c, d, f2, e);
      c = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && c && vg(b);
      b.flags |= 1;
      Xi(a, b, d, e);
      return b.child;
    }
    function $i(a, b, c, d, e) {
      if (null === a) {
        var f2 = c.type;
        if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
        a = Rg(c.type, null, d, b, b.mode, e);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      f2 = a.child;
      if (0 === (a.lanes & e)) {
        var g = f2.memoizedProps;
        c = c.compare;
        c = null !== c ? c : Ie;
        if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
      }
      b.flags |= 1;
      a = Pg(f2, d);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    function bj(a, b, c, d, e) {
      if (null !== a) {
        var f2 = a.memoizedProps;
        if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
        else return b.lanes = a.lanes, Zi(a, b, e);
      }
      return cj(a, b, c, d, e);
    }
    function dj(a, b, c) {
      var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
      if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
      else {
        if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
        b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        d = null !== f2 ? f2.baseLanes : c;
        G(ej, fj);
        fj |= d;
      }
      else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
      Xi(a, b, e, c);
      return b.child;
    }
    function gj(a, b) {
      var c = b.ref;
      if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
    }
    function cj(a, b, c, d, e) {
      var f2 = Zf(c) ? Xf : H.current;
      f2 = Yf(b, f2);
      ch(b, e);
      c = Nh(a, b, c, d, f2, e);
      d = Sh();
      if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
      I && d && vg(b);
      b.flags |= 1;
      Xi(a, b, c, e);
      return b.child;
    }
    function hj(a, b, c, d, e) {
      if (Zf(c)) {
        var f2 = true;
        cg(b);
      } else f2 = false;
      ch(b, e);
      if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
      else if (null === a) {
        var g = b.stateNode, h = b.memoizedProps;
        g.props = h;
        var k2 = g.context, l2 = c.contextType;
        "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
        var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
        q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
        jh = false;
        var r2 = b.memoizedState;
        g.state = r2;
        qh(b, d, g, e);
        k2 = b.memoizedState;
        h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
      } else {
        g = b.stateNode;
        lh(a, b);
        h = b.memoizedProps;
        l2 = b.type === b.elementType ? h : Ci(b.type, h);
        g.props = l2;
        q2 = b.pendingProps;
        r2 = g.context;
        k2 = c.contextType;
        "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
        var y2 = c.getDerivedStateFromProps;
        (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
        jh = false;
        r2 = b.memoizedState;
        g.state = r2;
        qh(b, d, g, e);
        var n2 = b.memoizedState;
        h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
      }
      return jj(a, b, c, d, f2, e);
    }
    function jj(a, b, c, d, e, f2) {
      gj(a, b);
      var g = 0 !== (b.flags & 128);
      if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
      d = b.stateNode;
      Wi.current = b;
      var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
      b.flags |= 1;
      null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
      b.memoizedState = d.state;
      e && dg(b, c, true);
      return b.child;
    }
    function kj(a) {
      var b = a.stateNode;
      b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
      yh(a, b.containerInfo);
    }
    function lj(a, b, c, d, e) {
      Ig();
      Jg(e);
      b.flags |= 256;
      Xi(a, b, c, d);
      return b.child;
    }
    var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
    function nj(a) {
      return { baseLanes: a, cachePool: null, transitions: null };
    }
    function oj(a, b, c) {
      var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
      (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
      if (h) f2 = true, b.flags &= -129;
      else if (null === a || null !== a.memoizedState) e |= 1;
      G(L, e & 1);
      if (null === a) {
        Eg(b);
        a = b.memoizedState;
        if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
        g = d.children;
        a = d.fallback;
        return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
      }
      e = a.memoizedState;
      if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
      if (f2) {
        f2 = d.fallback;
        g = b.mode;
        e = a.child;
        h = e.sibling;
        var k2 = { mode: "hidden", children: d.children };
        0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
        null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
        f2.return = b;
        d.return = b;
        d.sibling = f2;
        b.child = d;
        d = f2;
        f2 = b.child;
        g = a.child.memoizedState;
        g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
        f2.memoizedState = g;
        f2.childLanes = a.childLanes & ~c;
        b.memoizedState = mj;
        return d;
      }
      f2 = a.child;
      a = f2.sibling;
      d = Pg(f2, { mode: "visible", children: d.children });
      0 === (b.mode & 1) && (d.lanes = c);
      d.return = b;
      d.sibling = null;
      null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
      b.child = d;
      b.memoizedState = null;
      return d;
    }
    function qj(a, b) {
      b = pj({ mode: "visible", children: b }, a.mode, 0, null);
      b.return = a;
      return a.child = b;
    }
    function sj(a, b, c, d) {
      null !== d && Jg(d);
      Ug(b, a.child, null, c);
      a = qj(b, b.pendingProps.children);
      a.flags |= 2;
      b.memoizedState = null;
      return a;
    }
    function rj(a, b, c, d, e, f2, g) {
      if (c) {
        if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
        if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
        f2 = d.fallback;
        e = b.mode;
        d = pj({ mode: "visible", children: d.children }, e, 0, null);
        f2 = Tg(f2, e, g, null);
        f2.flags |= 2;
        d.return = b;
        f2.return = b;
        d.sibling = f2;
        b.child = d;
        0 !== (b.mode & 1) && Ug(b, a.child, null, g);
        b.child.memoizedState = nj(g);
        b.memoizedState = mj;
        return f2;
      }
      if (0 === (b.mode & 1)) return sj(a, b, g, null);
      if ("$!" === e.data) {
        d = e.nextSibling && e.nextSibling.dataset;
        if (d) var h = d.dgst;
        d = h;
        f2 = Error(p(419));
        d = Ki(f2, d, void 0);
        return sj(a, b, g, d);
      }
      h = 0 !== (g & a.childLanes);
      if (dh || h) {
        d = Q;
        if (null !== d) {
          switch (g & -g) {
            case 4:
              e = 2;
              break;
            case 16:
              e = 8;
              break;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              e = 32;
              break;
            case 536870912:
              e = 268435456;
              break;
            default:
              e = 0;
          }
          e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
          0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
        }
        tj();
        d = Ki(Error(p(421)));
        return sj(a, b, g, d);
      }
      if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
      a = f2.treeContext;
      yg = Lf(e.nextSibling);
      xg = b;
      I = true;
      zg = null;
      null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
      b = qj(b, d.children);
      b.flags |= 4096;
      return b;
    }
    function vj(a, b, c) {
      a.lanes |= b;
      var d = a.alternate;
      null !== d && (d.lanes |= b);
      bh(a.return, b, c);
    }
    function wj(a, b, c, d, e) {
      var f2 = a.memoizedState;
      null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
    }
    function xj(a, b, c) {
      var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
      Xi(a, b, d.children, c);
      d = L.current;
      if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
      else {
        if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
          if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
          else if (19 === a.tag) vj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b) break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b) break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
        d &= 1;
      }
      G(L, d);
      if (0 === (b.mode & 1)) b.memoizedState = null;
      else switch (e) {
        case "forwards":
          c = b.child;
          for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
          c = e;
          null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
          wj(b, false, e, c, f2);
          break;
        case "backwards":
          c = null;
          e = b.child;
          for (b.child = null; null !== e; ) {
            a = e.alternate;
            if (null !== a && null === Ch(a)) {
              b.child = e;
              break;
            }
            a = e.sibling;
            e.sibling = c;
            c = e;
            e = a;
          }
          wj(b, true, c, null, f2);
          break;
        case "together":
          wj(b, false, null, null, void 0);
          break;
        default:
          b.memoizedState = null;
      }
      return b.child;
    }
    function ij(a, b) {
      0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
    }
    function Zi(a, b, c) {
      null !== a && (b.dependencies = a.dependencies);
      rh |= b.lanes;
      if (0 === (c & b.childLanes)) return null;
      if (null !== a && b.child !== a.child) throw Error(p(153));
      if (null !== b.child) {
        a = b.child;
        c = Pg(a, a.pendingProps);
        b.child = c;
        for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
        c.sibling = null;
      }
      return b.child;
    }
    function yj(a, b, c) {
      switch (b.tag) {
        case 3:
          kj(b);
          Ig();
          break;
        case 5:
          Ah(b);
          break;
        case 1:
          Zf(b.type) && cg(b);
          break;
        case 4:
          yh(b, b.stateNode.containerInfo);
          break;
        case 10:
          var d = b.type._context, e = b.memoizedProps.value;
          G(Wg, d._currentValue);
          d._currentValue = e;
          break;
        case 13:
          d = b.memoizedState;
          if (null !== d) {
            if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
            if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
            G(L, L.current & 1);
            a = Zi(a, b, c);
            return null !== a ? a.sibling : null;
          }
          G(L, L.current & 1);
          break;
        case 19:
          d = 0 !== (c & b.childLanes);
          if (0 !== (a.flags & 128)) {
            if (d) return xj(a, b, c);
            b.flags |= 128;
          }
          e = b.memoizedState;
          null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
          G(L, L.current);
          if (d) break;
          else return null;
        case 22:
        case 23:
          return b.lanes = 0, dj(a, b, c);
      }
      return Zi(a, b, c);
    }
    var zj, Aj, Bj, Cj;
    zj = function(a, b) {
      for (var c = b.child; null !== c; ) {
        if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
        else if (4 !== c.tag && null !== c.child) {
          c.child.return = c;
          c = c.child;
          continue;
        }
        if (c === b) break;
        for (; null === c.sibling; ) {
          if (null === c.return || c.return === b) return;
          c = c.return;
        }
        c.sibling.return = c.return;
        c = c.sibling;
      }
    };
    Aj = function() {
    };
    Bj = function(a, b, c, d) {
      var e = a.memoizedProps;
      if (e !== d) {
        a = b.stateNode;
        xh(uh.current);
        var f2 = null;
        switch (c) {
          case "input":
            e = Ya(a, e);
            d = Ya(a, d);
            f2 = [];
            break;
          case "select":
            e = A({}, e, { value: void 0 });
            d = A({}, d, { value: void 0 });
            f2 = [];
            break;
          case "textarea":
            e = gb(a, e);
            d = gb(a, d);
            f2 = [];
            break;
          default:
            "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
        }
        ub(c, d);
        var g;
        c = null;
        for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
          var h = e[l2];
          for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
        for (l2 in d) {
          var k2 = d[l2];
          h = null != e ? e[l2] : void 0;
          if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
            for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
          } else c || (f2 || (f2 = []), f2.push(
            l2,
            c
          )), c = k2;
          else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
        }
        c && (f2 = f2 || []).push("style", c);
        var l2 = f2;
        if (b.updateQueue = l2) b.flags |= 4;
      }
    };
    Cj = function(a, b, c, d) {
      c !== d && (b.flags |= 4);
    };
    function Dj(a, b) {
      if (!I) switch (a.tailMode) {
        case "hidden":
          b = a.tail;
          for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
          null === c ? a.tail = null : c.sibling = null;
          break;
        case "collapsed":
          c = a.tail;
          for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
          null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
      }
    }
    function S(a) {
      var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
      if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
      else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
      a.subtreeFlags |= d;
      a.childLanes = c;
      return b;
    }
    function Ej(a, b, c) {
      var d = b.pendingProps;
      wg(b);
      switch (b.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return S(b), null;
        case 1:
          return Zf(b.type) && $f(), S(b), null;
        case 3:
          d = b.stateNode;
          zh();
          E(Wf);
          E(H);
          Eh();
          d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
          if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
          Aj(a, b);
          S(b);
          return null;
        case 5:
          Bh(b);
          var e = xh(wh.current);
          c = b.type;
          if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          else {
            if (!d) {
              if (null === b.stateNode) throw Error(p(166));
              S(b);
              return null;
            }
            a = xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.type;
              var f2 = b.memoizedProps;
              d[Of] = b;
              d[Pf] = f2;
              a = 0 !== (b.mode & 1);
              switch (c) {
                case "dialog":
                  D("cancel", d);
                  D("close", d);
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", d);
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D(lf[e], d);
                  break;
                case "source":
                  D("error", d);
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    d
                  );
                  D("load", d);
                  break;
                case "details":
                  D("toggle", d);
                  break;
                case "input":
                  Za(d, f2);
                  D("invalid", d);
                  break;
                case "select":
                  d._wrapperState = { wasMultiple: !!f2.multiple };
                  D("invalid", d);
                  break;
                case "textarea":
                  hb(d, f2), D("invalid", d);
              }
              ub(c, f2);
              e = null;
              for (var g in f2) if (f2.hasOwnProperty(g)) {
                var h = f2[g];
                "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
                  d.textContent,
                  h,
                  a
                ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
              }
              switch (c) {
                case "input":
                  Va(d);
                  db(d, f2, true);
                  break;
                case "textarea":
                  Va(d);
                  jb(d);
                  break;
                case "select":
                case "option":
                  break;
                default:
                  "function" === typeof f2.onClick && (d.onclick = Bf);
              }
              d = e;
              b.updateQueue = d;
              null !== d && (b.flags |= 4);
            } else {
              g = 9 === e.nodeType ? e : e.ownerDocument;
              "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
              "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
              a[Of] = b;
              a[Pf] = d;
              zj(a, b, false, false);
              b.stateNode = a;
              a: {
                g = vb(c, d);
                switch (c) {
                  case "dialog":
                    D("cancel", a);
                    D("close", a);
                    e = d;
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", a);
                    e = d;
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], a);
                    e = d;
                    break;
                  case "source":
                    D("error", a);
                    e = d;
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      a
                    );
                    D("load", a);
                    e = d;
                    break;
                  case "details":
                    D("toggle", a);
                    e = d;
                    break;
                  case "input":
                    Za(a, d);
                    e = Ya(a, d);
                    D("invalid", a);
                    break;
                  case "option":
                    e = d;
                    break;
                  case "select":
                    a._wrapperState = { wasMultiple: !!d.multiple };
                    e = A({}, d, { value: void 0 });
                    D("invalid", a);
                    break;
                  case "textarea":
                    hb(a, d);
                    e = gb(a, d);
                    D("invalid", a);
                    break;
                  default:
                    e = d;
                }
                ub(c, e);
                h = e;
                for (f2 in h) if (h.hasOwnProperty(f2)) {
                  var k2 = h[f2];
                  "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
                }
                switch (c) {
                  case "input":
                    Va(a);
                    db(a, d, false);
                    break;
                  case "textarea":
                    Va(a);
                    jb(a);
                    break;
                  case "option":
                    null != d.value && a.setAttribute("value", "" + Sa(d.value));
                    break;
                  case "select":
                    a.multiple = !!d.multiple;
                    f2 = d.value;
                    null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                      a,
                      !!d.multiple,
                      d.defaultValue,
                      true
                    );
                    break;
                  default:
                    "function" === typeof e.onClick && (a.onclick = Bf);
                }
                switch (c) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d = !!d.autoFocus;
                    break a;
                  case "img":
                    d = true;
                    break a;
                  default:
                    d = false;
                }
              }
              d && (b.flags |= 4);
            }
            null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
          }
          S(b);
          return null;
        case 6:
          if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
          else {
            if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
            c = xh(wh.current);
            xh(uh.current);
            if (Gg(b)) {
              d = b.stateNode;
              c = b.memoizedProps;
              d[Of] = b;
              if (f2 = d.nodeValue !== c) {
                if (a = xg, null !== a) switch (a.tag) {
                  case 3:
                    Af(d.nodeValue, c, 0 !== (a.mode & 1));
                    break;
                  case 5:
                    true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                }
              }
              f2 && (b.flags |= 4);
            } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
          }
          S(b);
          return null;
        case 13:
          E(L);
          d = b.memoizedState;
          if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
            if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
            else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
              if (null === a) {
                if (!f2) throw Error(p(318));
                f2 = b.memoizedState;
                f2 = null !== f2 ? f2.dehydrated : null;
                if (!f2) throw Error(p(317));
                f2[Of] = b;
              } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
              S(b);
              f2 = false;
            } else null !== zg && (Fj(zg), zg = null), f2 = true;
            if (!f2) return b.flags & 65536 ? b : null;
          }
          if (0 !== (b.flags & 128)) return b.lanes = c, b;
          d = null !== d;
          d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
          null !== b.updateQueue && (b.flags |= 4);
          S(b);
          return null;
        case 4:
          return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
        case 10:
          return ah(b.type._context), S(b), null;
        case 17:
          return Zf(b.type) && $f(), S(b), null;
        case 19:
          E(L);
          f2 = b.memoizedState;
          if (null === f2) return S(b), null;
          d = 0 !== (b.flags & 128);
          g = f2.rendering;
          if (null === g) if (d) Dj(f2, false);
          else {
            if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
              g = Ch(a);
              if (null !== g) {
                b.flags |= 128;
                Dj(f2, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G(L, L.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
            null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
          }
          else {
            if (!d) if (a = Ch(g), null !== a) {
              if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
            } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
            f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
          }
          if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
          S(b);
          return null;
        case 22:
        case 23:
          return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
        case 24:
          return null;
        case 25:
          return null;
      }
      throw Error(p(156, b.tag));
    }
    function Ij(a, b) {
      wg(b);
      switch (b.tag) {
        case 1:
          return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 3:
          return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
        case 5:
          return Bh(b), null;
        case 13:
          E(L);
          a = b.memoizedState;
          if (null !== a && null !== a.dehydrated) {
            if (null === b.alternate) throw Error(p(340));
            Ig();
          }
          a = b.flags;
          return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
        case 19:
          return E(L), null;
        case 4:
          return zh(), null;
        case 10:
          return ah(b.type._context), null;
        case 22:
        case 23:
          return Hj(), null;
        case 24:
          return null;
        default:
          return null;
      }
    }
    var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
    function Lj(a, b) {
      var c = a.ref;
      if (null !== c) if ("function" === typeof c) try {
        c(null);
      } catch (d) {
        W(a, b, d);
      }
      else c.current = null;
    }
    function Mj(a, b, c) {
      try {
        c();
      } catch (d) {
        W(a, b, d);
      }
    }
    var Nj = false;
    function Oj(a, b) {
      Cf = dd;
      a = Me();
      if (Ne(a)) {
        if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
        else a: {
          c = (c = a.ownerDocument) && c.defaultView || window;
          var d = c.getSelection && c.getSelection();
          if (d && 0 !== d.rangeCount) {
            c = d.anchorNode;
            var e = d.anchorOffset, f2 = d.focusNode;
            d = d.focusOffset;
            try {
              c.nodeType, f2.nodeType;
            } catch (F2) {
              c = null;
              break a;
            }
            var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
            b: for (; ; ) {
              for (var y2; ; ) {
                q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
                q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
                3 === q2.nodeType && (g += q2.nodeValue.length);
                if (null === (y2 = q2.firstChild)) break;
                r2 = q2;
                q2 = y2;
              }
              for (; ; ) {
                if (q2 === a) break b;
                r2 === c && ++l2 === e && (h = g);
                r2 === f2 && ++m2 === d && (k2 = g);
                if (null !== (y2 = q2.nextSibling)) break;
                q2 = r2;
                r2 = q2.parentNode;
              }
              q2 = y2;
            }
            c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
          } else c = null;
        }
        c = c || { start: 0, end: 0 };
      } else c = null;
      Df = { focusedElem: a, selectionRange: c };
      dd = false;
      for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
      else for (; null !== V; ) {
        b = V;
        try {
          var n2 = b.alternate;
          if (0 !== (b.flags & 1024)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              break;
            case 1:
              if (null !== n2) {
                var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
                x2.__reactInternalSnapshotBeforeUpdate = w2;
              }
              break;
            case 3:
              var u2 = b.stateNode.containerInfo;
              1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
              break;
            case 5:
            case 6:
            case 4:
            case 17:
              break;
            default:
              throw Error(p(163));
          }
        } catch (F2) {
          W(b, b.return, F2);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V = a;
          break;
        }
        V = b.return;
      }
      n2 = Nj;
      Nj = false;
      return n2;
    }
    function Pj(a, b, c) {
      var d = b.updateQueue;
      d = null !== d ? d.lastEffect : null;
      if (null !== d) {
        var e = d = d.next;
        do {
          if ((e.tag & a) === a) {
            var f2 = e.destroy;
            e.destroy = void 0;
            void 0 !== f2 && Mj(b, c, f2);
          }
          e = e.next;
        } while (e !== d);
      }
    }
    function Qj(a, b) {
      b = b.updateQueue;
      b = null !== b ? b.lastEffect : null;
      if (null !== b) {
        var c = b = b.next;
        do {
          if ((c.tag & a) === a) {
            var d = c.create;
            c.destroy = d();
          }
          c = c.next;
        } while (c !== b);
      }
    }
    function Rj(a) {
      var b = a.ref;
      if (null !== b) {
        var c = a.stateNode;
        switch (a.tag) {
          case 5:
            a = c;
            break;
          default:
            a = c;
        }
        "function" === typeof b ? b(a) : b.current = a;
      }
    }
    function Sj(a) {
      var b = a.alternate;
      null !== b && (a.alternate = null, Sj(b));
      a.child = null;
      a.deletions = null;
      a.sibling = null;
      5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
      a.stateNode = null;
      a.return = null;
      a.dependencies = null;
      a.memoizedProps = null;
      a.memoizedState = null;
      a.pendingProps = null;
      a.stateNode = null;
      a.updateQueue = null;
    }
    function Tj(a) {
      return 5 === a.tag || 3 === a.tag || 4 === a.tag;
    }
    function Uj(a) {
      a: for (; ; ) {
        for (; null === a.sibling; ) {
          if (null === a.return || Tj(a.return)) return null;
          a = a.return;
        }
        a.sibling.return = a.return;
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
          if (a.flags & 2) continue a;
          if (null === a.child || 4 === a.tag) continue a;
          else a.child.return = a, a = a.child;
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function Vj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
      else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
    }
    function Wj(a, b, c) {
      var d = a.tag;
      if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
      else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
    }
    var X = null, Xj = false;
    function Yj(a, b, c) {
      for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
    }
    function Zj(a, b, c) {
      if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
        lc.onCommitFiberUnmount(kc, c);
      } catch (h) {
      }
      switch (c.tag) {
        case 5:
          U || Lj(c, b);
        case 6:
          var d = X, e = Xj;
          X = null;
          Yj(a, b, c);
          X = d;
          Xj = e;
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
          break;
        case 18:
          null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
          break;
        case 4:
          d = X;
          e = Xj;
          X = c.stateNode.containerInfo;
          Xj = true;
          Yj(a, b, c);
          X = d;
          Xj = e;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
            e = d = d.next;
            do {
              var f2 = e, g = f2.destroy;
              f2 = f2.tag;
              void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
              e = e.next;
            } while (e !== d);
          }
          Yj(a, b, c);
          break;
        case 1:
          if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
            d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
          } catch (h) {
            W(c, b, h);
          }
          Yj(a, b, c);
          break;
        case 21:
          Yj(a, b, c);
          break;
        case 22:
          c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
          break;
        default:
          Yj(a, b, c);
      }
    }
    function ak(a) {
      var b = a.updateQueue;
      if (null !== b) {
        a.updateQueue = null;
        var c = a.stateNode;
        null === c && (c = a.stateNode = new Kj());
        b.forEach(function(b2) {
          var d = bk.bind(null, a, b2);
          c.has(b2) || (c.add(b2), b2.then(d, d));
        });
      }
    }
    function ck(a, b) {
      var c = b.deletions;
      if (null !== c) for (var d = 0; d < c.length; d++) {
        var e = c[d];
        try {
          var f2 = a, g = b, h = g;
          a: for (; null !== h; ) {
            switch (h.tag) {
              case 5:
                X = h.stateNode;
                Xj = false;
                break a;
              case 3:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
              case 4:
                X = h.stateNode.containerInfo;
                Xj = true;
                break a;
            }
            h = h.return;
          }
          if (null === X) throw Error(p(160));
          Zj(f2, g, e);
          X = null;
          Xj = false;
          var k2 = e.alternate;
          null !== k2 && (k2.return = null);
          e.return = null;
        } catch (l2) {
          W(e, b, l2);
        }
      }
      if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
    }
    function dk(a, b) {
      var c = a.alternate, d = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ck(b, a);
          ek(a);
          if (d & 4) {
            try {
              Pj(3, a, a.return), Qj(3, a);
            } catch (t2) {
              W(a, a.return, t2);
            }
            try {
              Pj(5, a, a.return);
            } catch (t2) {
              W(a, a.return, t2);
            }
          }
          break;
        case 1:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          break;
        case 5:
          ck(b, a);
          ek(a);
          d & 512 && null !== c && Lj(c, c.return);
          if (a.flags & 32) {
            var e = a.stateNode;
            try {
              ob(e, "");
            } catch (t2) {
              W(a, a.return, t2);
            }
          }
          if (d & 4 && (e = a.stateNode, null != e)) {
            var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
            a.updateQueue = null;
            if (null !== k2) try {
              "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
              vb(h, g);
              var l2 = vb(h, f2);
              for (g = 0; g < k2.length; g += 2) {
                var m2 = k2[g], q2 = k2[g + 1];
                "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
              }
              switch (h) {
                case "input":
                  bb(e, f2);
                  break;
                case "textarea":
                  ib(e, f2);
                  break;
                case "select":
                  var r2 = e._wrapperState.wasMultiple;
                  e._wrapperState.wasMultiple = !!f2.multiple;
                  var y2 = f2.value;
                  null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                    e,
                    !!f2.multiple,
                    f2.defaultValue,
                    true
                  ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
              }
              e[Pf] = f2;
            } catch (t2) {
              W(a, a.return, t2);
            }
          }
          break;
        case 6:
          ck(b, a);
          ek(a);
          if (d & 4) {
            if (null === a.stateNode) throw Error(p(162));
            e = a.stateNode;
            f2 = a.memoizedProps;
            try {
              e.nodeValue = f2;
            } catch (t2) {
              W(a, a.return, t2);
            }
          }
          break;
        case 3:
          ck(b, a);
          ek(a);
          if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
            bd(b.containerInfo);
          } catch (t2) {
            W(a, a.return, t2);
          }
          break;
        case 4:
          ck(b, a);
          ek(a);
          break;
        case 13:
          ck(b, a);
          ek(a);
          e = a.child;
          e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
          d & 4 && ak(a);
          break;
        case 22:
          m2 = null !== c && null !== c.memoizedState;
          a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
          ek(a);
          if (d & 8192) {
            l2 = null !== a.memoizedState;
            if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
              for (q2 = V = m2; null !== V; ) {
                r2 = V;
                y2 = r2.child;
                switch (r2.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    Pj(4, r2, r2.return);
                    break;
                  case 1:
                    Lj(r2, r2.return);
                    var n2 = r2.stateNode;
                    if ("function" === typeof n2.componentWillUnmount) {
                      d = r2;
                      c = r2.return;
                      try {
                        b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                      } catch (t2) {
                        W(d, c, t2);
                      }
                    }
                    break;
                  case 5:
                    Lj(r2, r2.return);
                    break;
                  case 22:
                    if (null !== r2.memoizedState) {
                      gk(q2);
                      continue;
                    }
                }
                null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
              }
              m2 = m2.sibling;
            }
            a: for (m2 = null, q2 = a; ; ) {
              if (5 === q2.tag) {
                if (null === m2) {
                  m2 = q2;
                  try {
                    e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
                  } catch (t2) {
                    W(a, a.return, t2);
                  }
                }
              } else if (6 === q2.tag) {
                if (null === m2) try {
                  q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                } catch (t2) {
                  W(a, a.return, t2);
                }
              } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
                q2.child.return = q2;
                q2 = q2.child;
                continue;
              }
              if (q2 === a) break a;
              for (; null === q2.sibling; ) {
                if (null === q2.return || q2.return === a) break a;
                m2 === q2 && (m2 = null);
                q2 = q2.return;
              }
              m2 === q2 && (m2 = null);
              q2.sibling.return = q2.return;
              q2 = q2.sibling;
            }
          }
          break;
        case 19:
          ck(b, a);
          ek(a);
          d & 4 && ak(a);
          break;
        case 21:
          break;
        default:
          ck(
            b,
            a
          ), ek(a);
      }
    }
    function ek(a) {
      var b = a.flags;
      if (b & 2) {
        try {
          a: {
            for (var c = a.return; null !== c; ) {
              if (Tj(c)) {
                var d = c;
                break a;
              }
              c = c.return;
            }
            throw Error(p(160));
          }
          switch (d.tag) {
            case 5:
              var e = d.stateNode;
              d.flags & 32 && (ob(e, ""), d.flags &= -33);
              var f2 = Uj(a);
              Wj(a, f2, e);
              break;
            case 3:
            case 4:
              var g = d.stateNode.containerInfo, h = Uj(a);
              Vj(a, h, g);
              break;
            default:
              throw Error(p(161));
          }
        } catch (k2) {
          W(a, a.return, k2);
        }
        a.flags &= -3;
      }
      b & 4096 && (a.flags &= -4097);
    }
    function hk(a, b, c) {
      V = a;
      ik(a);
    }
    function ik(a, b, c) {
      for (var d = 0 !== (a.mode & 1); null !== V; ) {
        var e = V, f2 = e.child;
        if (22 === e.tag && d) {
          var g = null !== e.memoizedState || Jj;
          if (!g) {
            var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
            h = Jj;
            var l2 = U;
            Jj = g;
            if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
            for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
            V = e;
            Jj = h;
            U = l2;
          }
          kk(a);
        } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
      }
    }
    function kk(a) {
      for (; null !== V; ) {
        var b = V;
        if (0 !== (b.flags & 8772)) {
          var c = b.alternate;
          try {
            if (0 !== (b.flags & 8772)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                U || Qj(5, b);
                break;
              case 1:
                var d = b.stateNode;
                if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                else {
                  var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                  d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
                var f2 = b.updateQueue;
                null !== f2 && sh(b, f2, d);
                break;
              case 3:
                var g = b.updateQueue;
                if (null !== g) {
                  c = null;
                  if (null !== b.child) switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                  sh(b, g, c);
                }
                break;
              case 5:
                var h = b.stateNode;
                if (null === c && b.flags & 4) {
                  c = h;
                  var k2 = b.memoizedProps;
                  switch (b.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      k2.autoFocus && c.focus();
                      break;
                    case "img":
                      k2.src && (c.src = k2.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (null === b.memoizedState) {
                  var l2 = b.alternate;
                  if (null !== l2) {
                    var m2 = l2.memoizedState;
                    if (null !== m2) {
                      var q2 = m2.dehydrated;
                      null !== q2 && bd(q2);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(p(163));
            }
            U || b.flags & 512 && Rj(b);
          } catch (r2) {
            W(b, b.return, r2);
          }
        }
        if (b === a) {
          V = null;
          break;
        }
        c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function gk(a) {
      for (; null !== V; ) {
        var b = V;
        if (b === a) {
          V = null;
          break;
        }
        var c = b.sibling;
        if (null !== c) {
          c.return = b.return;
          V = c;
          break;
        }
        V = b.return;
      }
    }
    function jk(a) {
      for (; null !== V; ) {
        var b = V;
        try {
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              var c = b.return;
              try {
                Qj(4, b);
              } catch (k2) {
                W(b, c, k2);
              }
              break;
            case 1:
              var d = b.stateNode;
              if ("function" === typeof d.componentDidMount) {
                var e = b.return;
                try {
                  d.componentDidMount();
                } catch (k2) {
                  W(b, e, k2);
                }
              }
              var f2 = b.return;
              try {
                Rj(b);
              } catch (k2) {
                W(b, f2, k2);
              }
              break;
            case 5:
              var g = b.return;
              try {
                Rj(b);
              } catch (k2) {
                W(b, g, k2);
              }
          }
        } catch (k2) {
          W(b, b.return, k2);
        }
        if (b === a) {
          V = null;
          break;
        }
        var h = b.sibling;
        if (null !== h) {
          h.return = b.return;
          V = h;
          break;
        }
        V = b.return;
      }
    }
    var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
    function R() {
      return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
    }
    function yi(a) {
      if (0 === (a.mode & 1)) return 1;
      if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
      if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
      a = C;
      if (0 !== a) return a;
      a = window.event;
      a = void 0 === a ? 16 : jd(a.type);
      return a;
    }
    function gi(a, b, c, d) {
      if (50 < yk) throw yk = 0, zk = null, Error(p(185));
      Ac(a, c, d);
      if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
    }
    function Dk(a, b) {
      var c = a.callbackNode;
      wc(a, b);
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
      else if (b = d & -d, a.callbackPriority !== b) {
        null != c && bc(c);
        if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
          0 === (K & 6) && jg();
        }), c = null;
        else {
          switch (Dc(d)) {
            case 1:
              c = fc;
              break;
            case 4:
              c = gc;
              break;
            case 16:
              c = hc;
              break;
            case 536870912:
              c = jc;
              break;
            default:
              c = hc;
          }
          c = Fk(c, Gk.bind(null, a));
        }
        a.callbackPriority = b;
        a.callbackNode = c;
      }
    }
    function Gk(a, b) {
      Ak = -1;
      Bk = 0;
      if (0 !== (K & 6)) throw Error(p(327));
      var c = a.callbackNode;
      if (Hk() && a.callbackNode !== c) return null;
      var d = uc(a, a === Q ? Z : 0);
      if (0 === d) return null;
      if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
      else {
        b = d;
        var e = K;
        K |= 2;
        var f2 = Jk();
        if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
        do
          try {
            Lk();
            break;
          } catch (h) {
            Mk(a, h);
          }
        while (1);
        $g();
        mk.current = f2;
        K = e;
        null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
      }
      if (0 !== b) {
        2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
        if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
        if (6 === b) Ck(a, d);
        else {
          e = a.current.alternate;
          if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          a.finishedWork = e;
          a.finishedLanes = d;
          switch (b) {
            case 0:
            case 1:
              throw Error(p(345));
            case 2:
              Pk(a, tk, uk);
              break;
            case 3:
              Ck(a, d);
              if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                if (0 !== uc(a, 0)) break;
                e = a.suspendedLanes;
                if ((e & d) !== d) {
                  R();
                  a.pingedLanes |= a.suspendedLanes & e;
                  break;
                }
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 4:
              Ck(a, d);
              if ((d & 4194240) === d) break;
              b = a.eventTimes;
              for (e = -1; 0 < d; ) {
                var g = 31 - oc(d);
                f2 = 1 << g;
                g = b[g];
                g > e && (e = g);
                d &= ~f2;
              }
              d = e;
              d = B() - d;
              d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
              if (10 < d) {
                a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                break;
              }
              Pk(a, tk, uk);
              break;
            case 5:
              Pk(a, tk, uk);
              break;
            default:
              throw Error(p(329));
          }
        }
      }
      Dk(a, B());
      return a.callbackNode === c ? Gk.bind(null, a) : null;
    }
    function Nk(a, b) {
      var c = sk;
      a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
      a = Ik(a, b);
      2 !== a && (b = tk, tk = c, null !== b && Fj(b));
      return a;
    }
    function Fj(a) {
      null === tk ? tk = a : tk.push.apply(tk, a);
    }
    function Ok(a) {
      for (var b = a; ; ) {
        if (b.flags & 16384) {
          var c = b.updateQueue;
          if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
            var e = c[d], f2 = e.getSnapshot;
            e = e.value;
            try {
              if (!He(f2(), e)) return false;
            } catch (g) {
              return false;
            }
          }
        }
        c = b.child;
        if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
        else {
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return true;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
      }
      return true;
    }
    function Ck(a, b) {
      b &= ~rk;
      b &= ~qk;
      a.suspendedLanes |= b;
      a.pingedLanes &= ~b;
      for (a = a.expirationTimes; 0 < b; ) {
        var c = 31 - oc(b), d = 1 << c;
        a[c] = -1;
        b &= ~d;
      }
    }
    function Ek(a) {
      if (0 !== (K & 6)) throw Error(p(327));
      Hk();
      var b = uc(a, 0);
      if (0 === (b & 1)) return Dk(a, B()), null;
      var c = Ik(a, b);
      if (0 !== a.tag && 2 === c) {
        var d = xc(a);
        0 !== d && (b = d, c = Nk(a, d));
      }
      if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
      if (6 === c) throw Error(p(345));
      a.finishedWork = a.current.alternate;
      a.finishedLanes = b;
      Pk(a, tk, uk);
      Dk(a, B());
      return null;
    }
    function Qk(a, b) {
      var c = K;
      K |= 1;
      try {
        return a(b);
      } finally {
        K = c, 0 === K && (Gj = B() + 500, fg && jg());
      }
    }
    function Rk(a) {
      null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
      var b = K;
      K |= 1;
      var c = ok.transition, d = C;
      try {
        if (ok.transition = null, C = 1, a) return a();
      } finally {
        C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
      }
    }
    function Hj() {
      fj = ej.current;
      E(ej);
    }
    function Kk(a, b) {
      a.finishedWork = null;
      a.finishedLanes = 0;
      var c = a.timeoutHandle;
      -1 !== c && (a.timeoutHandle = -1, Gf(c));
      if (null !== Y) for (c = Y.return; null !== c; ) {
        var d = c;
        wg(d);
        switch (d.tag) {
          case 1:
            d = d.type.childContextTypes;
            null !== d && void 0 !== d && $f();
            break;
          case 3:
            zh();
            E(Wf);
            E(H);
            Eh();
            break;
          case 5:
            Bh(d);
            break;
          case 4:
            zh();
            break;
          case 13:
            E(L);
            break;
          case 19:
            E(L);
            break;
          case 10:
            ah(d.type._context);
            break;
          case 22:
          case 23:
            Hj();
        }
        c = c.return;
      }
      Q = a;
      Y = a = Pg(a.current, null);
      Z = fj = b;
      T = 0;
      pk = null;
      rk = qk = rh = 0;
      tk = sk = null;
      if (null !== fh) {
        for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
          c.interleaved = null;
          var e = d.next, f2 = c.pending;
          if (null !== f2) {
            var g = f2.next;
            f2.next = e;
            d.next = g;
          }
          c.pending = d;
        }
        fh = null;
      }
      return a;
    }
    function Mk(a, b) {
      do {
        var c = Y;
        try {
          $g();
          Fh.current = Rh;
          if (Ih) {
            for (var d = M.memoizedState; null !== d; ) {
              var e = d.queue;
              null !== e && (e.pending = null);
              d = d.next;
            }
            Ih = false;
          }
          Hh = 0;
          O = N = M = null;
          Jh = false;
          Kh = 0;
          nk.current = null;
          if (null === c || null === c.return) {
            T = 1;
            pk = b;
            Y = null;
            break;
          }
          a: {
            var f2 = a, g = c.return, h = c, k2 = b;
            b = Z;
            h.flags |= 32768;
            if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
              var l2 = k2, m2 = h, q2 = m2.tag;
              if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
                var r2 = m2.alternate;
                r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
              }
              var y2 = Ui(g);
              if (null !== y2) {
                y2.flags &= -257;
                Vi(y2, g, h, f2, b);
                y2.mode & 1 && Si(f2, l2, b);
                b = y2;
                k2 = l2;
                var n2 = b.updateQueue;
                if (null === n2) {
                  var t2 = /* @__PURE__ */ new Set();
                  t2.add(k2);
                  b.updateQueue = t2;
                } else n2.add(k2);
                break a;
              } else {
                if (0 === (b & 1)) {
                  Si(f2, l2, b);
                  tj();
                  break a;
                }
                k2 = Error(p(426));
              }
            } else if (I && h.mode & 1) {
              var J2 = Ui(g);
              if (null !== J2) {
                0 === (J2.flags & 65536) && (J2.flags |= 256);
                Vi(J2, g, h, f2, b);
                Jg(Ji(k2, h));
                break a;
              }
            }
            f2 = k2 = Ji(k2, h);
            4 !== T && (T = 2);
            null === sk ? sk = [f2] : sk.push(f2);
            f2 = g;
            do {
              switch (f2.tag) {
                case 3:
                  f2.flags |= 65536;
                  b &= -b;
                  f2.lanes |= b;
                  var x2 = Ni(f2, k2, b);
                  ph(f2, x2);
                  break a;
                case 1:
                  h = k2;
                  var w2 = f2.type, u2 = f2.stateNode;
                  if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                    f2.flags |= 65536;
                    b &= -b;
                    f2.lanes |= b;
                    var F2 = Qi(f2, h, b);
                    ph(f2, F2);
                    break a;
                  }
              }
              f2 = f2.return;
            } while (null !== f2);
          }
          Sk(c);
        } catch (na) {
          b = na;
          Y === c && null !== c && (Y = c = c.return);
          continue;
        }
        break;
      } while (1);
    }
    function Jk() {
      var a = mk.current;
      mk.current = Rh;
      return null === a ? Rh : a;
    }
    function tj() {
      if (0 === T || 3 === T || 2 === T) T = 4;
      null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
    }
    function Ik(a, b) {
      var c = K;
      K |= 2;
      var d = Jk();
      if (Q !== a || Z !== b) uk = null, Kk(a, b);
      do
        try {
          Tk();
          break;
        } catch (e) {
          Mk(a, e);
        }
      while (1);
      $g();
      K = c;
      mk.current = d;
      if (null !== Y) throw Error(p(261));
      Q = null;
      Z = 0;
      return T;
    }
    function Tk() {
      for (; null !== Y; ) Uk(Y);
    }
    function Lk() {
      for (; null !== Y && !cc(); ) Uk(Y);
    }
    function Uk(a) {
      var b = Vk(a.alternate, a, fj);
      a.memoizedProps = a.pendingProps;
      null === b ? Sk(a) : Y = b;
      nk.current = null;
    }
    function Sk(a) {
      var b = a;
      do {
        var c = b.alternate;
        a = b.return;
        if (0 === (b.flags & 32768)) {
          if (c = Ej(c, b, fj), null !== c) {
            Y = c;
            return;
          }
        } else {
          c = Ij(c, b);
          if (null !== c) {
            c.flags &= 32767;
            Y = c;
            return;
          }
          if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
          else {
            T = 6;
            Y = null;
            return;
          }
        }
        b = b.sibling;
        if (null !== b) {
          Y = b;
          return;
        }
        Y = b = a;
      } while (null !== b);
      0 === T && (T = 5);
    }
    function Pk(a, b, c) {
      var d = C, e = ok.transition;
      try {
        ok.transition = null, C = 1, Wk(a, b, c, d);
      } finally {
        ok.transition = e, C = d;
      }
      return null;
    }
    function Wk(a, b, c, d) {
      do
        Hk();
      while (null !== wk);
      if (0 !== (K & 6)) throw Error(p(327));
      c = a.finishedWork;
      var e = a.finishedLanes;
      if (null === c) return null;
      a.finishedWork = null;
      a.finishedLanes = 0;
      if (c === a.current) throw Error(p(177));
      a.callbackNode = null;
      a.callbackPriority = 0;
      var f2 = c.lanes | c.childLanes;
      Bc(a, f2);
      a === Q && (Y = Q = null, Z = 0);
      0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
        Hk();
        return null;
      }));
      f2 = 0 !== (c.flags & 15990);
      if (0 !== (c.subtreeFlags & 15990) || f2) {
        f2 = ok.transition;
        ok.transition = null;
        var g = C;
        C = 1;
        var h = K;
        K |= 4;
        nk.current = null;
        Oj(a, c);
        dk(c, a);
        Oe(Df);
        dd = !!Cf;
        Df = Cf = null;
        a.current = c;
        hk(c);
        dc();
        K = h;
        C = g;
        ok.transition = f2;
      } else a.current = c;
      vk && (vk = false, wk = a, xk = e);
      f2 = a.pendingLanes;
      0 === f2 && (Ri = null);
      mc(c.stateNode);
      Dk(a, B());
      if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
      if (Oi) throw Oi = false, a = Pi, Pi = null, a;
      0 !== (xk & 1) && 0 !== a.tag && Hk();
      f2 = a.pendingLanes;
      0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
      jg();
      return null;
    }
    function Hk() {
      if (null !== wk) {
        var a = Dc(xk), b = ok.transition, c = C;
        try {
          ok.transition = null;
          C = 16 > a ? 16 : a;
          if (null === wk) var d = false;
          else {
            a = wk;
            wk = null;
            xk = 0;
            if (0 !== (K & 6)) throw Error(p(331));
            var e = K;
            K |= 4;
            for (V = a.current; null !== V; ) {
              var f2 = V, g = f2.child;
              if (0 !== (V.flags & 16)) {
                var h = f2.deletions;
                if (null !== h) {
                  for (var k2 = 0; k2 < h.length; k2++) {
                    var l2 = h[k2];
                    for (V = l2; null !== V; ) {
                      var m2 = V;
                      switch (m2.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Pj(8, m2, f2);
                      }
                      var q2 = m2.child;
                      if (null !== q2) q2.return = m2, V = q2;
                      else for (; null !== V; ) {
                        m2 = V;
                        var r2 = m2.sibling, y2 = m2.return;
                        Sj(m2);
                        if (m2 === l2) {
                          V = null;
                          break;
                        }
                        if (null !== r2) {
                          r2.return = y2;
                          V = r2;
                          break;
                        }
                        V = y2;
                      }
                    }
                  }
                  var n2 = f2.alternate;
                  if (null !== n2) {
                    var t2 = n2.child;
                    if (null !== t2) {
                      n2.child = null;
                      do {
                        var J2 = t2.sibling;
                        t2.sibling = null;
                        t2 = J2;
                      } while (null !== t2);
                    }
                  }
                  V = f2;
                }
              }
              if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
              else b: for (; null !== V; ) {
                f2 = V;
                if (0 !== (f2.flags & 2048)) switch (f2.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pj(9, f2, f2.return);
                }
                var x2 = f2.sibling;
                if (null !== x2) {
                  x2.return = f2.return;
                  V = x2;
                  break b;
                }
                V = f2.return;
              }
            }
            var w2 = a.current;
            for (V = w2; null !== V; ) {
              g = V;
              var u2 = g.child;
              if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
              else b: for (g = w2; null !== V; ) {
                h = V;
                if (0 !== (h.flags & 2048)) try {
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, h);
                  }
                } catch (na) {
                  W(h, h.return, na);
                }
                if (h === g) {
                  V = null;
                  break b;
                }
                var F2 = h.sibling;
                if (null !== F2) {
                  F2.return = h.return;
                  V = F2;
                  break b;
                }
                V = h.return;
              }
            }
            K = e;
            jg();
            if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
              lc.onPostCommitFiberRoot(kc, a);
            } catch (na) {
            }
            d = true;
          }
          return d;
        } finally {
          C = c, ok.transition = b;
        }
      }
      return false;
    }
    function Xk(a, b, c) {
      b = Ji(c, b);
      b = Ni(a, b, 1);
      a = nh(a, b, 1);
      b = R();
      null !== a && (Ac(a, 1, b), Dk(a, b));
    }
    function W(a, b, c) {
      if (3 === a.tag) Xk(a, a, c);
      else for (; null !== b; ) {
        if (3 === b.tag) {
          Xk(b, a, c);
          break;
        } else if (1 === b.tag) {
          var d = b.stateNode;
          if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
            a = Ji(c, a);
            a = Qi(b, a, 1);
            b = nh(b, a, 1);
            a = R();
            null !== b && (Ac(b, 1, a), Dk(b, a));
            break;
          }
        }
        b = b.return;
      }
    }
    function Ti(a, b, c) {
      var d = a.pingCache;
      null !== d && d.delete(b);
      b = R();
      a.pingedLanes |= a.suspendedLanes & c;
      Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
      Dk(a, b);
    }
    function Yk(a, b) {
      0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
      var c = R();
      a = ih(a, b);
      null !== a && (Ac(a, b, c), Dk(a, c));
    }
    function uj(a) {
      var b = a.memoizedState, c = 0;
      null !== b && (c = b.retryLane);
      Yk(a, c);
    }
    function bk(a, b) {
      var c = 0;
      switch (a.tag) {
        case 13:
          var d = a.stateNode;
          var e = a.memoizedState;
          null !== e && (c = e.retryLane);
          break;
        case 19:
          d = a.stateNode;
          break;
        default:
          throw Error(p(314));
      }
      null !== d && d.delete(b);
      Yk(a, c);
    }
    var Vk;
    Vk = function(a, b, c) {
      if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
      else {
        if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
        dh = 0 !== (a.flags & 131072) ? true : false;
      }
      else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
      b.lanes = 0;
      switch (b.tag) {
        case 2:
          var d = b.type;
          ij(a, b);
          a = b.pendingProps;
          var e = Yf(b, H.current);
          ch(b, c);
          e = Nh(null, b, d, a, e, c);
          var f2 = Sh();
          b.flags |= 1;
          "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
          return b;
        case 16:
          d = b.elementType;
          a: {
            ij(a, b);
            a = b.pendingProps;
            e = d._init;
            d = e(d._payload);
            b.type = d;
            e = b.tag = Zk(d);
            a = Ci(d, a);
            switch (e) {
              case 0:
                b = cj(null, b, d, a, c);
                break a;
              case 1:
                b = hj(null, b, d, a, c);
                break a;
              case 11:
                b = Yi(null, b, d, a, c);
                break a;
              case 14:
                b = $i(null, b, d, Ci(d.type, a), c);
                break a;
            }
            throw Error(p(
              306,
              d,
              ""
            ));
          }
          return b;
        case 0:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
        case 1:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
        case 3:
          a: {
            kj(b);
            if (null === a) throw Error(p(387));
            d = b.pendingProps;
            f2 = b.memoizedState;
            e = f2.element;
            lh(a, b);
            qh(b, d, null, c);
            var g = b.memoizedState;
            d = g.element;
            if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
              e = Ji(Error(p(423)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else if (d !== e) {
              e = Ji(Error(p(424)), b);
              b = lj(a, b, d, c, e);
              break a;
            } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
            else {
              Ig();
              if (d === e) {
                b = Zi(a, b, c);
                break a;
              }
              Xi(a, b, d, c);
            }
            b = b.child;
          }
          return b;
        case 5:
          return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
        case 6:
          return null === a && Eg(b), null;
        case 13:
          return oj(a, b, c);
        case 4:
          return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
        case 11:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
        case 7:
          return Xi(a, b, b.pendingProps, c), b.child;
        case 8:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 12:
          return Xi(a, b, b.pendingProps.children, c), b.child;
        case 10:
          a: {
            d = b.type._context;
            e = b.pendingProps;
            f2 = b.memoizedProps;
            g = e.value;
            G(Wg, d._currentValue);
            d._currentValue = g;
            if (null !== f2) if (He(f2.value, g)) {
              if (f2.children === e.children && !Wf.current) {
                b = Zi(a, b, c);
                break a;
              }
            } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
              var h = f2.dependencies;
              if (null !== h) {
                g = f2.child;
                for (var k2 = h.firstContext; null !== k2; ) {
                  if (k2.context === d) {
                    if (1 === f2.tag) {
                      k2 = mh(-1, c & -c);
                      k2.tag = 2;
                      var l2 = f2.updateQueue;
                      if (null !== l2) {
                        l2 = l2.shared;
                        var m2 = l2.pending;
                        null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                        l2.pending = k2;
                      }
                    }
                    f2.lanes |= c;
                    k2 = f2.alternate;
                    null !== k2 && (k2.lanes |= c);
                    bh(
                      f2.return,
                      c,
                      b
                    );
                    h.lanes |= c;
                    break;
                  }
                  k2 = k2.next;
                }
              } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
              else if (18 === f2.tag) {
                g = f2.return;
                if (null === g) throw Error(p(341));
                g.lanes |= c;
                h = g.alternate;
                null !== h && (h.lanes |= c);
                bh(g, c, b);
                g = f2.sibling;
              } else g = f2.child;
              if (null !== g) g.return = f2;
              else for (g = f2; null !== g; ) {
                if (g === b) {
                  g = null;
                  break;
                }
                f2 = g.sibling;
                if (null !== f2) {
                  f2.return = g.return;
                  g = f2;
                  break;
                }
                g = g.return;
              }
              f2 = g;
            }
            Xi(a, b, e.children, c);
            b = b.child;
          }
          return b;
        case 9:
          return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
        case 14:
          return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
        case 15:
          return bj(a, b, b.type, b.pendingProps, c);
        case 17:
          return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
        case 19:
          return xj(a, b, c);
        case 22:
          return dj(a, b, c);
      }
      throw Error(p(156, b.tag));
    };
    function Fk(a, b) {
      return ac(a, b);
    }
    function $k(a, b, c, d) {
      this.tag = a;
      this.key = c;
      this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
      this.index = 0;
      this.ref = null;
      this.pendingProps = b;
      this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
      this.mode = d;
      this.subtreeFlags = this.flags = 0;
      this.deletions = null;
      this.childLanes = this.lanes = 0;
      this.alternate = null;
    }
    function Bg(a, b, c, d) {
      return new $k(a, b, c, d);
    }
    function aj(a) {
      a = a.prototype;
      return !(!a || !a.isReactComponent);
    }
    function Zk(a) {
      if ("function" === typeof a) return aj(a) ? 1 : 0;
      if (void 0 !== a && null !== a) {
        a = a.$$typeof;
        if (a === Da) return 11;
        if (a === Ga) return 14;
      }
      return 2;
    }
    function Pg(a, b) {
      var c = a.alternate;
      null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
      c.flags = a.flags & 14680064;
      c.childLanes = a.childLanes;
      c.lanes = a.lanes;
      c.child = a.child;
      c.memoizedProps = a.memoizedProps;
      c.memoizedState = a.memoizedState;
      c.updateQueue = a.updateQueue;
      b = a.dependencies;
      c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
      c.sibling = a.sibling;
      c.index = a.index;
      c.ref = a.ref;
      return c;
    }
    function Rg(a, b, c, d, e, f2) {
      var g = 2;
      d = a;
      if ("function" === typeof a) aj(a) && (g = 1);
      else if ("string" === typeof a) g = 5;
      else a: switch (a) {
        case ya:
          return Tg(c.children, e, f2, b);
        case za:
          g = 8;
          e |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
        case Ea:
          return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
        case Fa:
          return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
        case Ia:
          return pj(c, e, f2, b);
        default:
          if ("object" === typeof a && null !== a) switch (a.$$typeof) {
            case Ba:
              g = 10;
              break a;
            case Ca:
              g = 9;
              break a;
            case Da:
              g = 11;
              break a;
            case Ga:
              g = 14;
              break a;
            case Ha:
              g = 16;
              d = null;
              break a;
          }
          throw Error(p(130, null == a ? a : typeof a, ""));
      }
      b = Bg(g, c, b, e);
      b.elementType = a;
      b.type = d;
      b.lanes = f2;
      return b;
    }
    function Tg(a, b, c, d) {
      a = Bg(7, a, d, b);
      a.lanes = c;
      return a;
    }
    function pj(a, b, c, d) {
      a = Bg(22, a, d, b);
      a.elementType = Ia;
      a.lanes = c;
      a.stateNode = { isHidden: false };
      return a;
    }
    function Qg(a, b, c) {
      a = Bg(6, a, null, b);
      a.lanes = c;
      return a;
    }
    function Sg(a, b, c) {
      b = Bg(4, null !== a.children ? a.children : [], a.key, b);
      b.lanes = c;
      b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
      return b;
    }
    function al(a, b, c, d, e) {
      this.tag = b;
      this.containerInfo = a;
      this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
      this.timeoutHandle = -1;
      this.callbackNode = this.pendingContext = this.context = null;
      this.callbackPriority = 0;
      this.eventTimes = zc(0);
      this.expirationTimes = zc(-1);
      this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
      this.entanglements = zc(0);
      this.identifierPrefix = d;
      this.onRecoverableError = e;
      this.mutableSourceEagerHydrationData = null;
    }
    function bl(a, b, c, d, e, f2, g, h, k2) {
      a = new al(a, b, c, h, k2);
      1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
      f2 = Bg(3, null, null, b);
      a.current = f2;
      f2.stateNode = a;
      f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
      kh(f2);
      return a;
    }
    function cl(a, b, c) {
      var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
    }
    function dl(a) {
      if (!a) return Vf;
      a = a._reactInternals;
      a: {
        if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
        var b = a;
        do {
          switch (b.tag) {
            case 3:
              b = b.stateNode.context;
              break a;
            case 1:
              if (Zf(b.type)) {
                b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                break a;
              }
          }
          b = b.return;
        } while (null !== b);
        throw Error(p(171));
      }
      if (1 === a.tag) {
        var c = a.type;
        if (Zf(c)) return bg(a, c, b);
      }
      return b;
    }
    function el(a, b, c, d, e, f2, g, h, k2) {
      a = bl(c, d, true, a, e, f2, g, h, k2);
      a.context = dl(null);
      c = a.current;
      d = R();
      e = yi(c);
      f2 = mh(d, e);
      f2.callback = void 0 !== b && null !== b ? b : null;
      nh(c, f2, e);
      a.current.lanes = e;
      Ac(a, e, d);
      Dk(a, d);
      return a;
    }
    function fl(a, b, c, d) {
      var e = b.current, f2 = R(), g = yi(e);
      c = dl(c);
      null === b.context ? b.context = c : b.pendingContext = c;
      b = mh(f2, g);
      b.payload = { element: a };
      d = void 0 === d ? null : d;
      null !== d && (b.callback = d);
      a = nh(e, b, g);
      null !== a && (gi(a, e, g, f2), oh(a, e, g));
      return g;
    }
    function gl(a) {
      a = a.current;
      if (!a.child) return null;
      switch (a.child.tag) {
        case 5:
          return a.child.stateNode;
        default:
          return a.child.stateNode;
      }
    }
    function hl(a, b) {
      a = a.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        var c = a.retryLane;
        a.retryLane = 0 !== c && c < b ? c : b;
      }
    }
    function il(a, b) {
      hl(a, b);
      (a = a.alternate) && hl(a, b);
    }
    function jl() {
      return null;
    }
    var kl = "function" === typeof reportError ? reportError : function(a) {
      console.error(a);
    };
    function ll(a) {
      this._internalRoot = a;
    }
    ml.prototype.render = ll.prototype.render = function(a) {
      var b = this._internalRoot;
      if (null === b) throw Error(p(409));
      fl(a, b, null, null);
    };
    ml.prototype.unmount = ll.prototype.unmount = function() {
      var a = this._internalRoot;
      if (null !== a) {
        this._internalRoot = null;
        var b = a.containerInfo;
        Rk(function() {
          fl(null, a, null, null);
        });
        b[uf] = null;
      }
    };
    function ml(a) {
      this._internalRoot = a;
    }
    ml.prototype.unstable_scheduleHydration = function(a) {
      if (a) {
        var b = Hc();
        a = { blockedOn: null, target: a, priority: b };
        for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
        Qc.splice(c, 0, a);
        0 === c && Vc(a);
      }
    };
    function nl(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
    }
    function ol(a) {
      return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
    }
    function pl() {
    }
    function ql(a, b, c, d, e) {
      if (e) {
        if ("function" === typeof d) {
          var f2 = d;
          d = function() {
            var a2 = gl(g);
            f2.call(a2);
          };
        }
        var g = el(b, d, a, 0, null, false, false, "", pl);
        a._reactRootContainer = g;
        a[uf] = g.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk();
        return g;
      }
      for (; e = a.lastChild; ) a.removeChild(e);
      if ("function" === typeof d) {
        var h = d;
        d = function() {
          var a2 = gl(k2);
          h.call(a2);
        };
      }
      var k2 = bl(a, 0, false, null, null, false, false, "", pl);
      a._reactRootContainer = k2;
      a[uf] = k2.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk(function() {
        fl(b, k2, c, d);
      });
      return k2;
    }
    function rl(a, b, c, d, e) {
      var f2 = c._reactRootContainer;
      if (f2) {
        var g = f2;
        if ("function" === typeof e) {
          var h = e;
          e = function() {
            var a2 = gl(g);
            h.call(a2);
          };
        }
        fl(b, g, a, e);
      } else g = ql(c, b, a, e, d);
      return gl(g);
    }
    Ec = function(a) {
      switch (a.tag) {
        case 3:
          var b = a.stateNode;
          if (b.current.memoizedState.isDehydrated) {
            var c = tc(b.pendingLanes);
            0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
          }
          break;
        case 13:
          Rk(function() {
            var b2 = ih(a, 1);
            if (null !== b2) {
              var c2 = R();
              gi(b2, a, 1, c2);
            }
          }), il(a, 1);
      }
    };
    Fc = function(a) {
      if (13 === a.tag) {
        var b = ih(a, 134217728);
        if (null !== b) {
          var c = R();
          gi(b, a, 134217728, c);
        }
        il(a, 134217728);
      }
    };
    Gc = function(a) {
      if (13 === a.tag) {
        var b = yi(a), c = ih(a, b);
        if (null !== c) {
          var d = R();
          gi(c, a, b, d);
        }
        il(a, b);
      }
    };
    Hc = function() {
      return C;
    };
    Ic = function(a, b) {
      var c = C;
      try {
        return C = a, b();
      } finally {
        C = c;
      }
    };
    yb = function(a, b, c) {
      switch (b) {
        case "input":
          bb(a, c);
          b = c.name;
          if ("radio" === c.type && null != b) {
            for (c = a; c.parentNode; ) c = c.parentNode;
            c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
            for (b = 0; b < c.length; b++) {
              var d = c[b];
              if (d !== a && d.form === a.form) {
                var e = Db(d);
                if (!e) throw Error(p(90));
                Wa(d);
                bb(d, e);
              }
            }
          }
          break;
        case "textarea":
          ib(a, c);
          break;
        case "select":
          b = c.value, null != b && fb(a, !!c.multiple, b, false);
      }
    };
    Gb = Qk;
    Hb = Rk;
    var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
    var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
      a = Zb(a);
      return null === a ? null : a.stateNode;
    }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
      var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!vl.isDisabled && vl.supportsFiber) try {
        kc = vl.inject(ul), lc = vl;
      } catch (a) {
      }
    }
    reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
    reactDom_production_min.createPortal = function(a, b) {
      var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!nl(b)) throw Error(p(200));
      return cl(a, b, null, c);
    };
    reactDom_production_min.createRoot = function(a, b) {
      if (!nl(a)) throw Error(p(299));
      var c = false, d = "", e = kl;
      null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
      b = bl(a, 1, false, null, null, c, false, d, e);
      a[uf] = b.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      return new ll(b);
    };
    reactDom_production_min.findDOMNode = function(a) {
      if (null == a) return null;
      if (1 === a.nodeType) return a;
      var b = a._reactInternals;
      if (void 0 === b) {
        if ("function" === typeof a.render) throw Error(p(188));
        a = Object.keys(a).join(",");
        throw Error(p(268, a));
      }
      a = Zb(b);
      a = null === a ? null : a.stateNode;
      return a;
    };
    reactDom_production_min.flushSync = function(a) {
      return Rk(a);
    };
    reactDom_production_min.hydrate = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, true, c);
    };
    reactDom_production_min.hydrateRoot = function(a, b, c) {
      if (!nl(a)) throw Error(p(405));
      var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
      null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
      b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
      a[uf] = b.current;
      sf(a);
      if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
        c,
        e
      );
      return new ml(b);
    };
    reactDom_production_min.render = function(a, b, c) {
      if (!ol(b)) throw Error(p(200));
      return rl(null, a, b, false, c);
    };
    reactDom_production_min.unmountComponentAtNode = function(a) {
      if (!ol(a)) throw Error(p(40));
      return a._reactRootContainer ? (Rk(function() {
        rl(null, null, a, false, function() {
          a._reactRootContainer = null;
          a[uf] = null;
        });
      }), true) : false;
    };
    reactDom_production_min.unstable_batchedUpdates = Qk;
    reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
      if (!ol(c)) throw Error(p(200));
      if (null == a || void 0 === a._reactInternals) throw Error(p(38));
      return rl(a, b, c, false, d);
    };
    reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      reactDom.exports = reactDom_production_min;
    }
    var reactDomExports = reactDom.exports;
    const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
    var createRoot;
    var m = reactDomExports;
    {
      createRoot = m.createRoot;
      m.hydrateRoot;
    }
    const SettingMenu = "_SettingMenu_v3ob1_1";
    const styles$8 = {
      SettingMenu
    };
    function die(error) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      throw new Error(typeof error === "number" ? "[MobX] minified error nr: " + error + (args.length ? " " + args.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + error);
    }
    var mockGlobal = {};
    function getGlobal() {
      if (typeof globalThis !== "undefined") {
        return globalThis;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      if (typeof self !== "undefined") {
        return self;
      }
      return mockGlobal;
    }
    var assign = Object.assign;
    var getDescriptor = Object.getOwnPropertyDescriptor;
    var defineProperty = Object.defineProperty;
    var objectPrototype = Object.prototype;
    var EMPTY_ARRAY = [];
    Object.freeze(EMPTY_ARRAY);
    var EMPTY_OBJECT = {};
    Object.freeze(EMPTY_OBJECT);
    var hasProxy = typeof Proxy !== "undefined";
    var plainObjectString = /* @__PURE__ */ Object.toString();
    function assertProxies() {
      if (!hasProxy) {
        die("Proxy not available");
      }
    }
    function once(func) {
      var invoked = false;
      return function() {
        if (invoked) {
          return;
        }
        invoked = true;
        return func.apply(this, arguments);
      };
    }
    var noop = function noop2() {
    };
    function isFunction(fn) {
      return typeof fn === "function";
    }
    function isStringish(value) {
      var t2 = typeof value;
      switch (t2) {
        case "string":
        case "symbol":
        case "number":
          return true;
      }
      return false;
    }
    function isObject(value) {
      return value !== null && typeof value === "object";
    }
    function isPlainObject(value) {
      if (!isObject(value)) {
        return false;
      }
      var proto = Object.getPrototypeOf(value);
      if (proto == null) {
        return true;
      }
      var protoConstructor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof protoConstructor === "function" && protoConstructor.toString() === plainObjectString;
    }
    function isGenerator(obj) {
      var constructor = obj == null ? void 0 : obj.constructor;
      if (!constructor) {
        return false;
      }
      if ("GeneratorFunction" === constructor.name || "GeneratorFunction" === constructor.displayName) {
        return true;
      }
      return false;
    }
    function addHiddenProp(object2, propName, value) {
      defineProperty(object2, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value
      });
    }
    function addHiddenFinalProp(object2, propName, value) {
      defineProperty(object2, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
      });
    }
    function createInstanceofPredicate(name, theClass) {
      var propName = "isMobX" + name;
      theClass.prototype[propName] = true;
      return function(x2) {
        return isObject(x2) && x2[propName] === true;
      };
    }
    function isES6Map(thing) {
      return thing != null && Object.prototype.toString.call(thing) === "[object Map]";
    }
    function isPlainES6Map(thing) {
      var mapProto = Object.getPrototypeOf(thing);
      var objectProto = Object.getPrototypeOf(mapProto);
      var nullProto = Object.getPrototypeOf(objectProto);
      return nullProto === null;
    }
    function isES6Set(thing) {
      return thing != null && Object.prototype.toString.call(thing) === "[object Set]";
    }
    var hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";
    function getPlainObjectKeys(object2) {
      var keys2 = Object.keys(object2);
      if (!hasGetOwnPropertySymbols) {
        return keys2;
      }
      var symbols = Object.getOwnPropertySymbols(object2);
      if (!symbols.length) {
        return keys2;
      }
      return [].concat(keys2, symbols.filter(function(s) {
        return objectPrototype.propertyIsEnumerable.call(object2, s);
      }));
    }
    var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : hasGetOwnPropertySymbols ? function(obj) {
      return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
    } : (
      /* istanbul ignore next */
      Object.getOwnPropertyNames
    );
    function toPrimitive(value) {
      return value === null ? null : typeof value === "object" ? "" + value : value;
    }
    function hasProp(target, prop) {
      return objectPrototype.hasOwnProperty.call(target, prop);
    }
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(target) {
      var res = {};
      ownKeys(target).forEach(function(key) {
        res[key] = getDescriptor(target, key);
      });
      return res;
    };
    function getFlag(flags, mask) {
      return !!(flags & mask);
    }
    function setFlag(flags, mask, newValue) {
      if (newValue) {
        flags |= mask;
      } else {
        flags &= ~mask;
      }
      return flags;
    }
    function _arrayLikeToArray(r2, a) {
      (null == a || a > r2.length) && (a = r2.length);
      for (var e = 0, n2 = Array(a); e < a; e++) n2[e] = r2[e];
      return n2;
    }
    function _defineProperties(e, r2) {
      for (var t2 = 0; t2 < r2.length; t2++) {
        var o = r2[t2];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
      }
    }
    function _createClass(e, r2, t2) {
      return r2 && _defineProperties(e.prototype, r2), Object.defineProperty(e, "prototype", {
        writable: false
      }), e;
    }
    function _createForOfIteratorHelperLoose(r2, e) {
      var t2 = "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
      if (t2) return (t2 = t2.call(r2)).next.bind(t2);
      if (Array.isArray(r2) || (t2 = _unsupportedIterableToArray(r2)) || e) {
        t2 && (r2 = t2);
        var o = 0;
        return function() {
          return o >= r2.length ? {
            done: true
          } : {
            done: false,
            value: r2[o++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n2) {
        for (var e = 1; e < arguments.length; e++) {
          var t2 = arguments[e];
          for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
        }
        return n2;
      }, _extends.apply(null, arguments);
    }
    function _inheritsLoose(t2, o) {
      t2.prototype = Object.create(o.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o);
    }
    function _setPrototypeOf(t2, e) {
      return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t22, e2) {
        return t22.__proto__ = e2, t22;
      }, _setPrototypeOf(t2, e);
    }
    function _toPrimitive(t2, r2) {
      if ("object" != typeof t2 || !t2) return t2;
      var e = t2[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t2, r2);
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(t2);
    }
    function _toPropertyKey(t2) {
      var i = _toPrimitive(t2, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _unsupportedIterableToArray(r2, a) {
      if (r2) {
        if ("string" == typeof r2) return _arrayLikeToArray(r2, a);
        var t2 = {}.toString.call(r2).slice(8, -1);
        return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a) : void 0;
      }
    }
    var storedAnnotationsSymbol = /* @__PURE__ */ Symbol("mobx-stored-annotations");
    function createDecoratorAnnotation(annotation) {
      function decorator(target, property) {
        if (is20223Decorator(property)) {
          return annotation.decorate_20223_(target, property);
        } else {
          storeAnnotation(target, property, annotation);
        }
      }
      return Object.assign(decorator, annotation);
    }
    function storeAnnotation(prototype, key, annotation) {
      if (!hasProp(prototype, storedAnnotationsSymbol)) {
        addHiddenProp(prototype, storedAnnotationsSymbol, _extends({}, prototype[storedAnnotationsSymbol]));
      }
      if (!isOverride(annotation)) {
        prototype[storedAnnotationsSymbol][key] = annotation;
      }
    }
    function collectStoredAnnotations(target) {
      if (!hasProp(target, storedAnnotationsSymbol)) {
        addHiddenProp(target, storedAnnotationsSymbol, _extends({}, target[storedAnnotationsSymbol]));
      }
      return target[storedAnnotationsSymbol];
    }
    function is20223Decorator(context) {
      return typeof context == "object" && typeof context["kind"] == "string";
    }
    var $mobx = /* @__PURE__ */ Symbol("mobx administration");
    var Atom = /* @__PURE__ */ function() {
      function Atom2(name_) {
        if (name_ === void 0) {
          name_ = "Atom";
        }
        this.name_ = void 0;
        this.flags_ = 0;
        this.observers_ = /* @__PURE__ */ new Set();
        this.lastAccessedBy_ = 0;
        this.lowestObserverState_ = IDerivationState_.NOT_TRACKING_;
        this.onBOL = void 0;
        this.onBUOL = void 0;
        this.name_ = name_;
      }
      var _proto = Atom2.prototype;
      _proto.onBO = function onBO() {
        if (this.onBOL) {
          this.onBOL.forEach(function(listener) {
            return listener();
          });
        }
      };
      _proto.onBUO = function onBUO() {
        if (this.onBUOL) {
          this.onBUOL.forEach(function(listener) {
            return listener();
          });
        }
      };
      _proto.reportObserved = function reportObserved$1() {
        return reportObserved(this);
      };
      _proto.reportChanged = function reportChanged() {
        startBatch();
        propagateChanged(this);
        endBatch();
      };
      _proto.toString = function toString2() {
        return this.name_;
      };
      return _createClass(Atom2, [{
        key: "isBeingObserved",
        get: function get4() {
          return getFlag(this.flags_, Atom2.isBeingObservedMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Atom2.isBeingObservedMask_, newValue);
        }
      }, {
        key: "isPendingUnobservation",
        get: function get4() {
          return getFlag(this.flags_, Atom2.isPendingUnobservationMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Atom2.isPendingUnobservationMask_, newValue);
        }
      }, {
        key: "diffValue",
        get: function get4() {
          return getFlag(this.flags_, Atom2.diffValueMask_) ? 1 : 0;
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Atom2.diffValueMask_, newValue === 1 ? true : false);
        }
      }]);
    }();
    Atom.isBeingObservedMask_ = 1;
    Atom.isPendingUnobservationMask_ = 2;
    Atom.diffValueMask_ = 4;
    var isAtom = /* @__PURE__ */ createInstanceofPredicate("Atom", Atom);
    function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
      if (onBecomeObservedHandler === void 0) {
        onBecomeObservedHandler = noop;
      }
      if (onBecomeUnobservedHandler === void 0) {
        onBecomeUnobservedHandler = noop;
      }
      var atom = new Atom(name);
      if (onBecomeObservedHandler !== noop) {
        onBecomeObserved(atom, onBecomeObservedHandler);
      }
      if (onBecomeUnobservedHandler !== noop) {
        onBecomeUnobserved(atom, onBecomeUnobservedHandler);
      }
      return atom;
    }
    function identityComparer(a, b) {
      return a === b;
    }
    function structuralComparer(a, b) {
      return deepEqual(a, b);
    }
    function shallowComparer(a, b) {
      return deepEqual(a, b, 1);
    }
    function defaultComparer(a, b) {
      if (Object.is) {
        return Object.is(a, b);
      }
      return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
    }
    var comparer = {
      identity: identityComparer,
      structural: structuralComparer,
      "default": defaultComparer,
      shallow: shallowComparer
    };
    function deepEnhancer(v2, _14, name) {
      if (isObservable(v2)) {
        return v2;
      }
      if (Array.isArray(v2)) {
        return observable.array(v2, {
          name
        });
      }
      if (isPlainObject(v2)) {
        return observable.object(v2, void 0, {
          name
        });
      }
      if (isES6Map(v2)) {
        return observable.map(v2, {
          name
        });
      }
      if (isES6Set(v2)) {
        return observable.set(v2, {
          name
        });
      }
      if (typeof v2 === "function" && !isAction(v2) && !isFlow(v2)) {
        if (isGenerator(v2)) {
          return flow(v2);
        } else {
          return autoAction(name, v2);
        }
      }
      return v2;
    }
    function shallowEnhancer(v2, _14, name) {
      if (v2 === void 0 || v2 === null) {
        return v2;
      }
      if (isObservableObject(v2) || isObservableArray(v2) || isObservableMap(v2) || isObservableSet(v2)) {
        return v2;
      }
      if (Array.isArray(v2)) {
        return observable.array(v2, {
          name,
          deep: false
        });
      }
      if (isPlainObject(v2)) {
        return observable.object(v2, void 0, {
          name,
          deep: false
        });
      }
      if (isES6Map(v2)) {
        return observable.map(v2, {
          name,
          deep: false
        });
      }
      if (isES6Set(v2)) {
        return observable.set(v2, {
          name,
          deep: false
        });
      }
    }
    function referenceEnhancer(newValue) {
      return newValue;
    }
    function refStructEnhancer(v2, oldValue) {
      if (deepEqual(v2, oldValue)) {
        return oldValue;
      }
      return v2;
    }
    var OVERRIDE = "override";
    function isOverride(annotation) {
      return annotation.annotationType_ === OVERRIDE;
    }
    function createActionAnnotation(name, options) {
      return {
        annotationType_: name,
        options_: options,
        make_: make_$1,
        extend_: extend_$1,
        decorate_20223_: decorate_20223_$1
      };
    }
    function make_$1(adm, key, descriptor, source) {
      var _this$options_;
      if ((_this$options_ = this.options_) != null && _this$options_.bound) {
        return this.extend_(adm, key, descriptor, false) === null ? 0 : 1;
      }
      if (source === adm.target_) {
        return this.extend_(adm, key, descriptor, false) === null ? 0 : 2;
      }
      if (isAction(descriptor.value)) {
        return 1;
      }
      var actionDescriptor = createActionDescriptor(adm, this, key, descriptor, false);
      defineProperty(source, key, actionDescriptor);
      return 2;
    }
    function extend_$1(adm, key, descriptor, proxyTrap) {
      var actionDescriptor = createActionDescriptor(adm, this, key, descriptor);
      return adm.defineProperty_(key, actionDescriptor, proxyTrap);
    }
    function decorate_20223_$1(mthd, context) {
      var kind = context.kind, name = context.name, addInitializer = context.addInitializer;
      var ann = this;
      var _createAction = function _createAction2(m2) {
        var _ann$options_$name, _ann$options_, _ann$options_$autoAct, _ann$options_2;
        return createAction((_ann$options_$name = (_ann$options_ = ann.options_) == null ? void 0 : _ann$options_.name) != null ? _ann$options_$name : name.toString(), m2, (_ann$options_$autoAct = (_ann$options_2 = ann.options_) == null ? void 0 : _ann$options_2.autoAction) != null ? _ann$options_$autoAct : false);
      };
      if (kind == "field") {
        return function(initMthd) {
          var _ann$options_3;
          var mthd2 = initMthd;
          if (!isAction(mthd2)) {
            mthd2 = _createAction(mthd2);
          }
          if ((_ann$options_3 = ann.options_) != null && _ann$options_3.bound) {
            mthd2 = mthd2.bind(this);
            mthd2.isMobxAction = true;
          }
          return mthd2;
        };
      }
      if (kind == "method") {
        var _this$options_2;
        if (!isAction(mthd)) {
          mthd = _createAction(mthd);
        }
        if ((_this$options_2 = this.options_) != null && _this$options_2.bound) {
          addInitializer(function() {
            var self2 = this;
            var bound = self2[name].bind(self2);
            bound.isMobxAction = true;
            self2[name] = bound;
          });
        }
        return mthd;
      }
      die("Cannot apply '" + ann.annotationType_ + "' to '" + String(name) + "' (kind: " + kind + "):" + ("\n'" + ann.annotationType_ + "' can only be used on properties with a function value."));
    }
    function assertActionDescriptor(adm, _ref, key, _ref2) {
      _ref.annotationType_;
      _ref2.value;
    }
    function createActionDescriptor(adm, annotation, key, descriptor, safeDescriptors) {
      var _annotation$options_, _annotation$options_$, _annotation$options_2, _annotation$options_$2, _annotation$options_3, _annotation$options_4, _adm$proxy_2;
      if (safeDescriptors === void 0) {
        safeDescriptors = globalState.safeDescriptors;
      }
      assertActionDescriptor(adm, annotation, key, descriptor);
      var value = descriptor.value;
      if ((_annotation$options_ = annotation.options_) != null && _annotation$options_.bound) {
        var _adm$proxy_;
        value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
      }
      return {
        value: createAction(
          (_annotation$options_$ = (_annotation$options_2 = annotation.options_) == null ? void 0 : _annotation$options_2.name) != null ? _annotation$options_$ : key.toString(),
          value,
          (_annotation$options_$2 = (_annotation$options_3 = annotation.options_) == null ? void 0 : _annotation$options_3.autoAction) != null ? _annotation$options_$2 : false,
          // https://github.com/mobxjs/mobx/discussions/3140
          (_annotation$options_4 = annotation.options_) != null && _annotation$options_4.bound ? (_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_ : void 0
        ),
        // Non-configurable for classes
        // prevents accidental field redefinition in subclass
        configurable: safeDescriptors ? adm.isPlainObject_ : true,
        // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
        enumerable: false,
        // Non-obsevable, therefore non-writable
        // Also prevents rewriting in subclass constructor
        writable: safeDescriptors ? false : true
      };
    }
    function createFlowAnnotation(name, options) {
      return {
        annotationType_: name,
        options_: options,
        make_: make_$2,
        extend_: extend_$2,
        decorate_20223_: decorate_20223_$2
      };
    }
    function make_$2(adm, key, descriptor, source) {
      var _this$options_;
      if (source === adm.target_) {
        return this.extend_(adm, key, descriptor, false) === null ? 0 : 2;
      }
      if ((_this$options_ = this.options_) != null && _this$options_.bound && (!hasProp(adm.target_, key) || !isFlow(adm.target_[key]))) {
        if (this.extend_(adm, key, descriptor, false) === null) {
          return 0;
        }
      }
      if (isFlow(descriptor.value)) {
        return 1;
      }
      var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, false, false);
      defineProperty(source, key, flowDescriptor);
      return 2;
    }
    function extend_$2(adm, key, descriptor, proxyTrap) {
      var _this$options_2;
      var flowDescriptor = createFlowDescriptor(adm, this, key, descriptor, (_this$options_2 = this.options_) == null ? void 0 : _this$options_2.bound);
      return adm.defineProperty_(key, flowDescriptor, proxyTrap);
    }
    function decorate_20223_$2(mthd, context) {
      var _this$options_3;
      var name = context.name, addInitializer = context.addInitializer;
      if (!isFlow(mthd)) {
        mthd = flow(mthd);
      }
      if ((_this$options_3 = this.options_) != null && _this$options_3.bound) {
        addInitializer(function() {
          var self2 = this;
          var bound = self2[name].bind(self2);
          bound.isMobXFlow = true;
          self2[name] = bound;
        });
      }
      return mthd;
    }
    function assertFlowDescriptor(adm, _ref, key, _ref2) {
      _ref.annotationType_;
      _ref2.value;
    }
    function createFlowDescriptor(adm, annotation, key, descriptor, bound, safeDescriptors) {
      if (safeDescriptors === void 0) {
        safeDescriptors = globalState.safeDescriptors;
      }
      assertFlowDescriptor(adm, annotation, key, descriptor);
      var value = descriptor.value;
      if (!isFlow(value)) {
        value = flow(value);
      }
      if (bound) {
        var _adm$proxy_;
        value = value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
        value.isMobXFlow = true;
      }
      return {
        value,
        // Non-configurable for classes
        // prevents accidental field redefinition in subclass
        configurable: safeDescriptors ? adm.isPlainObject_ : true,
        // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
        enumerable: false,
        // Non-obsevable, therefore non-writable
        // Also prevents rewriting in subclass constructor
        writable: safeDescriptors ? false : true
      };
    }
    function createComputedAnnotation(name, options) {
      return {
        annotationType_: name,
        options_: options,
        make_: make_$3,
        extend_: extend_$3,
        decorate_20223_: decorate_20223_$3
      };
    }
    function make_$3(adm, key, descriptor) {
      return this.extend_(adm, key, descriptor, false) === null ? 0 : 1;
    }
    function extend_$3(adm, key, descriptor, proxyTrap) {
      assertComputedDescriptor(adm, this, key, descriptor);
      return adm.defineComputedProperty_(key, _extends({}, this.options_, {
        get: descriptor.get,
        set: descriptor.set
      }), proxyTrap);
    }
    function decorate_20223_$3(get4, context) {
      var ann = this;
      var key = context.name, addInitializer = context.addInitializer;
      addInitializer(function() {
        var adm = asObservableObject(this)[$mobx];
        var options = _extends({}, ann.options_, {
          get: get4,
          context: this
        });
        options.name || (options.name = "ObservableObject." + key.toString());
        adm.values_.set(key, new ComputedValue(options));
      });
      return function() {
        return this[$mobx].getObservablePropValue_(key);
      };
    }
    function assertComputedDescriptor(adm, _ref, key, _ref2) {
      _ref.annotationType_;
      _ref2.get;
    }
    function createObservableAnnotation(name, options) {
      return {
        annotationType_: name,
        options_: options,
        make_: make_$4,
        extend_: extend_$4,
        decorate_20223_: decorate_20223_$4
      };
    }
    function make_$4(adm, key, descriptor) {
      return this.extend_(adm, key, descriptor, false) === null ? 0 : 1;
    }
    function extend_$4(adm, key, descriptor, proxyTrap) {
      var _this$options_$enhanc, _this$options_;
      assertObservableDescriptor(adm, this);
      return adm.defineObservableProperty_(key, descriptor.value, (_this$options_$enhanc = (_this$options_ = this.options_) == null ? void 0 : _this$options_.enhancer) != null ? _this$options_$enhanc : deepEnhancer, proxyTrap);
    }
    function decorate_20223_$4(desc, context) {
      var ann = this;
      var kind = context.kind, name = context.name;
      var initializedObjects = /* @__PURE__ */ new WeakSet();
      function initializeObservable(target, value) {
        var _ann$options_$enhance, _ann$options_;
        var adm = asObservableObject(target)[$mobx];
        var observable2 = new ObservableValue(value, (_ann$options_$enhance = (_ann$options_ = ann.options_) == null ? void 0 : _ann$options_.enhancer) != null ? _ann$options_$enhance : deepEnhancer, "ObservableObject." + name.toString(), false);
        adm.values_.set(name, observable2);
        initializedObjects.add(target);
      }
      if (kind == "accessor") {
        return {
          get: function get4() {
            if (!initializedObjects.has(this)) {
              initializeObservable(this, desc.get.call(this));
            }
            return this[$mobx].getObservablePropValue_(name);
          },
          set: function set5(value) {
            if (!initializedObjects.has(this)) {
              initializeObservable(this, value);
            }
            return this[$mobx].setObservablePropValue_(name, value);
          },
          init: function init(value) {
            if (!initializedObjects.has(this)) {
              initializeObservable(this, value);
            }
            return value;
          }
        };
      }
      return;
    }
    function assertObservableDescriptor(adm, _ref, key, descriptor) {
      _ref.annotationType_;
    }
    var AUTO = "true";
    var autoAnnotation = /* @__PURE__ */ createAutoAnnotation();
    function createAutoAnnotation(options) {
      return {
        annotationType_: AUTO,
        options_: options,
        make_: make_$5,
        extend_: extend_$5,
        decorate_20223_: decorate_20223_$5
      };
    }
    function make_$5(adm, key, descriptor, source) {
      var _this$options_3, _this$options_4;
      if (descriptor.get) {
        return computed.make_(adm, key, descriptor, source);
      }
      if (descriptor.set) {
        var set5 = createAction(key.toString(), descriptor.set);
        if (source === adm.target_) {
          return adm.defineProperty_(key, {
            configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
            set: set5
          }) === null ? 0 : 2;
        }
        defineProperty(source, key, {
          configurable: true,
          set: set5
        });
        return 2;
      }
      if (source !== adm.target_ && typeof descriptor.value === "function") {
        var _this$options_2;
        if (isGenerator(descriptor.value)) {
          var _this$options_;
          var flowAnnotation2 = (_this$options_ = this.options_) != null && _this$options_.autoBind ? flow.bound : flow;
          return flowAnnotation2.make_(adm, key, descriptor, source);
        }
        var actionAnnotation2 = (_this$options_2 = this.options_) != null && _this$options_2.autoBind ? autoAction.bound : autoAction;
        return actionAnnotation2.make_(adm, key, descriptor, source);
      }
      var observableAnnotation2 = ((_this$options_3 = this.options_) == null ? void 0 : _this$options_3.deep) === false ? observable.ref : observable;
      if (typeof descriptor.value === "function" && (_this$options_4 = this.options_) != null && _this$options_4.autoBind) {
        var _adm$proxy_;
        descriptor.value = descriptor.value.bind((_adm$proxy_ = adm.proxy_) != null ? _adm$proxy_ : adm.target_);
      }
      return observableAnnotation2.make_(adm, key, descriptor, source);
    }
    function extend_$5(adm, key, descriptor, proxyTrap) {
      var _this$options_5, _this$options_6;
      if (descriptor.get) {
        return computed.extend_(adm, key, descriptor, proxyTrap);
      }
      if (descriptor.set) {
        return adm.defineProperty_(key, {
          configurable: globalState.safeDescriptors ? adm.isPlainObject_ : true,
          set: createAction(key.toString(), descriptor.set)
        }, proxyTrap);
      }
      if (typeof descriptor.value === "function" && (_this$options_5 = this.options_) != null && _this$options_5.autoBind) {
        var _adm$proxy_2;
        descriptor.value = descriptor.value.bind((_adm$proxy_2 = adm.proxy_) != null ? _adm$proxy_2 : adm.target_);
      }
      var observableAnnotation2 = ((_this$options_6 = this.options_) == null ? void 0 : _this$options_6.deep) === false ? observable.ref : observable;
      return observableAnnotation2.extend_(adm, key, descriptor, proxyTrap);
    }
    function decorate_20223_$5(desc, context) {
      die("'" + this.annotationType_ + "' cannot be used as a decorator");
    }
    var OBSERVABLE = "observable";
    var OBSERVABLE_REF = "observable.ref";
    var OBSERVABLE_SHALLOW = "observable.shallow";
    var OBSERVABLE_STRUCT = "observable.struct";
    var defaultCreateObservableOptions = {
      deep: true,
      name: void 0,
      defaultDecorator: void 0,
      proxy: true
    };
    Object.freeze(defaultCreateObservableOptions);
    function asCreateObservableOptions(thing) {
      return thing || defaultCreateObservableOptions;
    }
    var observableAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE);
    var observableRefAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_REF, {
      enhancer: referenceEnhancer
    });
    var observableShallowAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_SHALLOW, {
      enhancer: shallowEnhancer
    });
    var observableStructAnnotation = /* @__PURE__ */ createObservableAnnotation(OBSERVABLE_STRUCT, {
      enhancer: refStructEnhancer
    });
    var observableDecoratorAnnotation = /* @__PURE__ */ createDecoratorAnnotation(observableAnnotation);
    function getEnhancerFromOptions(options) {
      return options.deep === true ? deepEnhancer : options.deep === false ? referenceEnhancer : getEnhancerFromAnnotation(options.defaultDecorator);
    }
    function getAnnotationFromOptions(options) {
      var _options$defaultDecor;
      return options ? (_options$defaultDecor = options.defaultDecorator) != null ? _options$defaultDecor : createAutoAnnotation(options) : void 0;
    }
    function getEnhancerFromAnnotation(annotation) {
      var _annotation$options_$, _annotation$options_;
      return !annotation ? deepEnhancer : (_annotation$options_$ = (_annotation$options_ = annotation.options_) == null ? void 0 : _annotation$options_.enhancer) != null ? _annotation$options_$ : deepEnhancer;
    }
    function createObservable(v2, arg2, arg3) {
      if (is20223Decorator(arg2)) {
        return observableAnnotation.decorate_20223_(v2, arg2);
      }
      if (isStringish(arg2)) {
        storeAnnotation(v2, arg2, observableAnnotation);
        return;
      }
      if (isObservable(v2)) {
        return v2;
      }
      if (isPlainObject(v2)) {
        return observable.object(v2, arg2, arg3);
      }
      if (Array.isArray(v2)) {
        return observable.array(v2, arg2);
      }
      if (isES6Map(v2)) {
        return observable.map(v2, arg2);
      }
      if (isES6Set(v2)) {
        return observable.set(v2, arg2);
      }
      if (typeof v2 === "object" && v2 !== null) {
        return v2;
      }
      return observable.box(v2, arg2);
    }
    assign(createObservable, observableDecoratorAnnotation);
    var observableFactories = {
      box: function box(value, options) {
        var o = asCreateObservableOptions(options);
        return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
      },
      array: function array(initialValues, options) {
        var o = asCreateObservableOptions(options);
        return (globalState.useProxies === false || o.proxy === false ? createLegacyArray : createObservableArray)(initialValues, getEnhancerFromOptions(o), o.name);
      },
      map: function map(initialValues, options) {
        var o = asCreateObservableOptions(options);
        return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
      },
      set: function set(initialValues, options) {
        var o = asCreateObservableOptions(options);
        return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
      },
      object: function object(props, decorators, options) {
        return initObservable(function() {
          return extendObservable(globalState.useProxies === false || (options == null ? void 0 : options.proxy) === false ? asObservableObject({}, options) : asDynamicObservableObject({}, options), props, decorators);
        });
      },
      ref: /* @__PURE__ */ createDecoratorAnnotation(observableRefAnnotation),
      shallow: /* @__PURE__ */ createDecoratorAnnotation(observableShallowAnnotation),
      deep: observableDecoratorAnnotation,
      struct: /* @__PURE__ */ createDecoratorAnnotation(observableStructAnnotation)
    };
    var observable = /* @__PURE__ */ assign(createObservable, observableFactories);
    var COMPUTED = "computed";
    var COMPUTED_STRUCT = "computed.struct";
    var computedAnnotation = /* @__PURE__ */ createComputedAnnotation(COMPUTED);
    var computedStructAnnotation = /* @__PURE__ */ createComputedAnnotation(COMPUTED_STRUCT, {
      equals: comparer.structural
    });
    var computed = function computed2(arg1, arg2) {
      if (is20223Decorator(arg2)) {
        return computedAnnotation.decorate_20223_(arg1, arg2);
      }
      if (isStringish(arg2)) {
        return storeAnnotation(arg1, arg2, computedAnnotation);
      }
      if (isPlainObject(arg1)) {
        return createDecoratorAnnotation(createComputedAnnotation(COMPUTED, arg1));
      }
      var opts = isPlainObject(arg2) ? arg2 : {};
      opts.get = arg1;
      opts.name || (opts.name = arg1.name || "");
      return new ComputedValue(opts);
    };
    Object.assign(computed, computedAnnotation);
    computed.struct = /* @__PURE__ */ createDecoratorAnnotation(computedStructAnnotation);
    var _getDescriptor$config, _getDescriptor;
    var currentActionId = 0;
    var nextActionId = 1;
    var isFunctionNameConfigurable$1 = (_getDescriptor$config = (_getDescriptor = /* @__PURE__ */ getDescriptor(function() {
    }, "name")) == null ? void 0 : _getDescriptor.configurable) != null ? _getDescriptor$config : false;
    var tmpNameDescriptor = {
      value: "action",
      configurable: true,
      writable: false,
      enumerable: false
    };
    function createAction(actionName, fn, autoAction2, ref) {
      if (autoAction2 === void 0) {
        autoAction2 = false;
      }
      function res() {
        return executeAction(actionName, autoAction2, fn, ref || this, arguments);
      }
      res.isMobxAction = true;
      res.toString = function() {
        return fn.toString();
      };
      if (isFunctionNameConfigurable$1) {
        tmpNameDescriptor.value = actionName;
        defineProperty(res, "name", tmpNameDescriptor);
      }
      return res;
    }
    function executeAction(actionName, canRunAsDerivation, fn, scope, args) {
      var runInfo = _startAction(actionName, canRunAsDerivation);
      try {
        return fn.apply(scope, args);
      } catch (err) {
        runInfo.error_ = err;
        throw err;
      } finally {
        _endAction(runInfo);
      }
    }
    function _startAction(actionName, canRunAsDerivation, scope, args) {
      var notifySpy_ = false;
      var startTime_ = 0;
      var prevDerivation_ = globalState.trackingDerivation;
      var runAsAction = !canRunAsDerivation || !prevDerivation_;
      startBatch();
      var prevAllowStateChanges_ = globalState.allowStateChanges;
      if (runAsAction) {
        untrackedStart();
        prevAllowStateChanges_ = allowStateChangesStart(true);
      }
      var prevAllowStateReads_ = allowStateReadsStart(true);
      var runInfo = {
        runAsAction_: runAsAction,
        prevDerivation_,
        prevAllowStateChanges_,
        prevAllowStateReads_,
        notifySpy_,
        startTime_,
        actionId_: nextActionId++,
        parentActionId_: currentActionId
      };
      currentActionId = runInfo.actionId_;
      return runInfo;
    }
    function _endAction(runInfo) {
      if (currentActionId !== runInfo.actionId_) {
        die(30);
      }
      currentActionId = runInfo.parentActionId_;
      if (runInfo.error_ !== void 0) {
        globalState.suppressReactionErrors = true;
      }
      allowStateChangesEnd(runInfo.prevAllowStateChanges_);
      allowStateReadsEnd(runInfo.prevAllowStateReads_);
      endBatch();
      if (runInfo.runAsAction_) {
        untrackedEnd(runInfo.prevDerivation_);
      }
      globalState.suppressReactionErrors = false;
    }
    function allowStateChangesStart(allowStateChanges2) {
      var prev = globalState.allowStateChanges;
      globalState.allowStateChanges = allowStateChanges2;
      return prev;
    }
    function allowStateChangesEnd(prev) {
      globalState.allowStateChanges = prev;
    }
    var ObservableValue = /* @__PURE__ */ function(_Atom) {
      function ObservableValue2(value, enhancer, name_, notifySpy, equals) {
        var _this;
        if (name_ === void 0) {
          name_ = "ObservableValue";
        }
        if (equals === void 0) {
          equals = comparer["default"];
        }
        _this = _Atom.call(this, name_) || this;
        _this.enhancer = void 0;
        _this.name_ = void 0;
        _this.equals = void 0;
        _this.hasUnreportedChange_ = false;
        _this.interceptors_ = void 0;
        _this.changeListeners_ = void 0;
        _this.value_ = void 0;
        _this.dehancer = void 0;
        _this.enhancer = enhancer;
        _this.name_ = name_;
        _this.equals = equals;
        _this.value_ = enhancer(value, void 0, name_);
        return _this;
      }
      _inheritsLoose(ObservableValue2, _Atom);
      var _proto = ObservableValue2.prototype;
      _proto.dehanceValue = function dehanceValue(value) {
        if (this.dehancer !== void 0) {
          return this.dehancer(value);
        }
        return value;
      };
      _proto.set = function set5(newValue) {
        this.value_;
        newValue = this.prepareNewValue_(newValue);
        if (newValue !== globalState.UNCHANGED) {
          this.setNewValue_(newValue);
        }
      };
      _proto.prepareNewValue_ = function prepareNewValue_(newValue) {
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            object: this,
            type: UPDATE,
            newValue
          });
          if (!change) {
            return globalState.UNCHANGED;
          }
          newValue = change.newValue;
        }
        newValue = this.enhancer(newValue, this.value_, this.name_);
        return this.equals(this.value_, newValue) ? globalState.UNCHANGED : newValue;
      };
      _proto.setNewValue_ = function setNewValue_(newValue) {
        var oldValue = this.value_;
        this.value_ = newValue;
        this.reportChanged();
        if (hasListeners(this)) {
          notifyListeners(this, {
            type: UPDATE,
            object: this,
            newValue,
            oldValue
          });
        }
      };
      _proto.get = function get4() {
        this.reportObserved();
        return this.dehanceValue(this.value_);
      };
      _proto.intercept_ = function intercept_(handler) {
        return registerInterceptor(this, handler);
      };
      _proto.observe_ = function observe_(listener, fireImmediately) {
        if (fireImmediately) {
          listener({
            observableKind: "value",
            debugObjectName: this.name_,
            object: this,
            type: UPDATE,
            newValue: this.value_,
            oldValue: void 0
          });
        }
        return registerListener(this, listener);
      };
      _proto.raw = function raw() {
        return this.value_;
      };
      _proto.toJSON = function toJSON2() {
        return this.get();
      };
      _proto.toString = function toString2() {
        return this.name_ + "[" + this.value_ + "]";
      };
      _proto.valueOf = function valueOf() {
        return toPrimitive(this.get());
      };
      _proto[Symbol.toPrimitive] = function() {
        return this.valueOf();
      };
      return ObservableValue2;
    }(Atom);
    var ComputedValue = /* @__PURE__ */ function() {
      function ComputedValue2(options) {
        this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
        this.observing_ = [];
        this.newObserving_ = null;
        this.observers_ = /* @__PURE__ */ new Set();
        this.runId_ = 0;
        this.lastAccessedBy_ = 0;
        this.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
        this.unboundDepsCount_ = 0;
        this.value_ = new CaughtException(null);
        this.name_ = void 0;
        this.triggeredBy_ = void 0;
        this.flags_ = 0;
        this.derivation = void 0;
        this.setter_ = void 0;
        this.isTracing_ = TraceMode.NONE;
        this.scope_ = void 0;
        this.equals_ = void 0;
        this.requiresReaction_ = void 0;
        this.keepAlive_ = void 0;
        this.onBOL = void 0;
        this.onBUOL = void 0;
        if (!options.get) {
          die(31);
        }
        this.derivation = options.get;
        this.name_ = options.name || "ComputedValue";
        if (options.set) {
          this.setter_ = createAction("ComputedValue-setter", options.set);
        }
        this.equals_ = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer["default"]);
        this.scope_ = options.context;
        this.requiresReaction_ = options.requiresReaction;
        this.keepAlive_ = !!options.keepAlive;
      }
      var _proto = ComputedValue2.prototype;
      _proto.onBecomeStale_ = function onBecomeStale_() {
        propagateMaybeChanged(this);
      };
      _proto.onBO = function onBO() {
        if (this.onBOL) {
          this.onBOL.forEach(function(listener) {
            return listener();
          });
        }
      };
      _proto.onBUO = function onBUO() {
        if (this.onBUOL) {
          this.onBUOL.forEach(function(listener) {
            return listener();
          });
        }
      };
      _proto.get = function get4() {
        if (this.isComputing) {
          die(32, this.name_, this.derivation);
        }
        if (globalState.inBatch === 0 && // !globalState.trackingDerivatpion &&
        this.observers_.size === 0 && !this.keepAlive_) {
          if (shouldCompute(this)) {
            this.warnAboutUntrackedRead_();
            startBatch();
            this.value_ = this.computeValue_(false);
            endBatch();
          }
        } else {
          reportObserved(this);
          if (shouldCompute(this)) {
            var prevTrackingContext = globalState.trackingContext;
            if (this.keepAlive_ && !prevTrackingContext) {
              globalState.trackingContext = this;
            }
            if (this.trackAndCompute()) {
              propagateChangeConfirmed(this);
            }
            globalState.trackingContext = prevTrackingContext;
          }
        }
        var result = this.value_;
        if (isCaughtException(result)) {
          throw result.cause;
        }
        return result;
      };
      _proto.set = function set5(value) {
        if (this.setter_) {
          if (this.isRunningSetter) {
            die(33, this.name_);
          }
          this.isRunningSetter = true;
          try {
            this.setter_.call(this.scope_, value);
          } finally {
            this.isRunningSetter = false;
          }
        } else {
          die(34, this.name_);
        }
      };
      _proto.trackAndCompute = function trackAndCompute() {
        var oldValue = this.value_;
        var wasSuspended = (
          /* see #1208 */
          this.dependenciesState_ === IDerivationState_.NOT_TRACKING_
        );
        var newValue = this.computeValue_(true);
        var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals_(oldValue, newValue);
        if (changed) {
          this.value_ = newValue;
        }
        return changed;
      };
      _proto.computeValue_ = function computeValue_(track) {
        this.isComputing = true;
        var prev = allowStateChangesStart(false);
        var res;
        if (track) {
          res = trackDerivedFunction(this, this.derivation, this.scope_);
        } else {
          if (globalState.disableErrorBoundaries === true) {
            res = this.derivation.call(this.scope_);
          } else {
            try {
              res = this.derivation.call(this.scope_);
            } catch (e) {
              res = new CaughtException(e);
            }
          }
        }
        allowStateChangesEnd(prev);
        this.isComputing = false;
        return res;
      };
      _proto.suspend_ = function suspend_() {
        if (!this.keepAlive_) {
          clearObserving(this);
          this.value_ = void 0;
        }
      };
      _proto.observe_ = function observe_(listener, fireImmediately) {
        var _this = this;
        var firstTime = true;
        var prevValue = void 0;
        return autorun(function() {
          var newValue = _this.get();
          if (!firstTime || fireImmediately) {
            var prevU = untrackedStart();
            listener({
              observableKind: "computed",
              debugObjectName: _this.name_,
              type: UPDATE,
              object: _this,
              newValue,
              oldValue: prevValue
            });
            untrackedEnd(prevU);
          }
          firstTime = false;
          prevValue = newValue;
        });
      };
      _proto.warnAboutUntrackedRead_ = function warnAboutUntrackedRead_() {
        {
          return;
        }
      };
      _proto.toString = function toString2() {
        return this.name_ + "[" + this.derivation.toString() + "]";
      };
      _proto.valueOf = function valueOf() {
        return toPrimitive(this.get());
      };
      _proto[Symbol.toPrimitive] = function() {
        return this.valueOf();
      };
      return _createClass(ComputedValue2, [{
        key: "isComputing",
        get: function get4() {
          return getFlag(this.flags_, ComputedValue2.isComputingMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, ComputedValue2.isComputingMask_, newValue);
        }
      }, {
        key: "isRunningSetter",
        get: function get4() {
          return getFlag(this.flags_, ComputedValue2.isRunningSetterMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, ComputedValue2.isRunningSetterMask_, newValue);
        }
      }, {
        key: "isBeingObserved",
        get: function get4() {
          return getFlag(this.flags_, ComputedValue2.isBeingObservedMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, ComputedValue2.isBeingObservedMask_, newValue);
        }
      }, {
        key: "isPendingUnobservation",
        get: function get4() {
          return getFlag(this.flags_, ComputedValue2.isPendingUnobservationMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, ComputedValue2.isPendingUnobservationMask_, newValue);
        }
      }, {
        key: "diffValue",
        get: function get4() {
          return getFlag(this.flags_, ComputedValue2.diffValueMask_) ? 1 : 0;
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, ComputedValue2.diffValueMask_, newValue === 1 ? true : false);
        }
      }]);
    }();
    ComputedValue.isComputingMask_ = 1;
    ComputedValue.isRunningSetterMask_ = 2;
    ComputedValue.isBeingObservedMask_ = 4;
    ComputedValue.isPendingUnobservationMask_ = 8;
    ComputedValue.diffValueMask_ = 16;
    var isComputedValue = /* @__PURE__ */ createInstanceofPredicate("ComputedValue", ComputedValue);
    var IDerivationState_;
    (function(IDerivationState_2) {
      IDerivationState_2[IDerivationState_2["NOT_TRACKING_"] = -1] = "NOT_TRACKING_";
      IDerivationState_2[IDerivationState_2["UP_TO_DATE_"] = 0] = "UP_TO_DATE_";
      IDerivationState_2[IDerivationState_2["POSSIBLY_STALE_"] = 1] = "POSSIBLY_STALE_";
      IDerivationState_2[IDerivationState_2["STALE_"] = 2] = "STALE_";
    })(IDerivationState_ || (IDerivationState_ = {}));
    var TraceMode;
    (function(TraceMode2) {
      TraceMode2[TraceMode2["NONE"] = 0] = "NONE";
      TraceMode2[TraceMode2["LOG"] = 1] = "LOG";
      TraceMode2[TraceMode2["BREAK"] = 2] = "BREAK";
    })(TraceMode || (TraceMode = {}));
    var CaughtException = function CaughtException2(cause) {
      this.cause = void 0;
      this.cause = cause;
    };
    function isCaughtException(e) {
      return e instanceof CaughtException;
    }
    function shouldCompute(derivation) {
      switch (derivation.dependenciesState_) {
        case IDerivationState_.UP_TO_DATE_:
          return false;
        case IDerivationState_.NOT_TRACKING_:
        case IDerivationState_.STALE_:
          return true;
        case IDerivationState_.POSSIBLY_STALE_: {
          var prevAllowStateReads = allowStateReadsStart(true);
          var prevUntracked = untrackedStart();
          var obs = derivation.observing_, l2 = obs.length;
          for (var i = 0; i < l2; i++) {
            var obj = obs[i];
            if (isComputedValue(obj)) {
              if (globalState.disableErrorBoundaries) {
                obj.get();
              } else {
                try {
                  obj.get();
                } catch (e) {
                  untrackedEnd(prevUntracked);
                  allowStateReadsEnd(prevAllowStateReads);
                  return true;
                }
              }
              if (derivation.dependenciesState_ === IDerivationState_.STALE_) {
                untrackedEnd(prevUntracked);
                allowStateReadsEnd(prevAllowStateReads);
                return true;
              }
            }
          }
          changeDependenciesStateTo0(derivation);
          untrackedEnd(prevUntracked);
          allowStateReadsEnd(prevAllowStateReads);
          return false;
        }
      }
    }
    function checkIfStateModificationsAreAllowed(atom) {
      {
        return;
      }
    }
    function trackDerivedFunction(derivation, f2, context) {
      var prevAllowStateReads = allowStateReadsStart(true);
      changeDependenciesStateTo0(derivation);
      derivation.newObserving_ = new Array(
        // Reserve constant space for initial dependencies, dynamic space otherwise.
        // See https://github.com/mobxjs/mobx/pull/3833
        derivation.runId_ === 0 ? 100 : derivation.observing_.length
      );
      derivation.unboundDepsCount_ = 0;
      derivation.runId_ = ++globalState.runId;
      var prevTracking = globalState.trackingDerivation;
      globalState.trackingDerivation = derivation;
      globalState.inBatch++;
      var result;
      if (globalState.disableErrorBoundaries === true) {
        result = f2.call(context);
      } else {
        try {
          result = f2.call(context);
        } catch (e) {
          result = new CaughtException(e);
        }
      }
      globalState.inBatch--;
      globalState.trackingDerivation = prevTracking;
      bindDependencies(derivation);
      allowStateReadsEnd(prevAllowStateReads);
      return result;
    }
    function bindDependencies(derivation) {
      var prevObserving = derivation.observing_;
      var observing = derivation.observing_ = derivation.newObserving_;
      var lowestNewObservingDerivationState = IDerivationState_.UP_TO_DATE_;
      var i0 = 0, l2 = derivation.unboundDepsCount_;
      for (var i = 0; i < l2; i++) {
        var dep = observing[i];
        if (dep.diffValue === 0) {
          dep.diffValue = 1;
          if (i0 !== i) {
            observing[i0] = dep;
          }
          i0++;
        }
        if (dep.dependenciesState_ > lowestNewObservingDerivationState) {
          lowestNewObservingDerivationState = dep.dependenciesState_;
        }
      }
      observing.length = i0;
      derivation.newObserving_ = null;
      l2 = prevObserving.length;
      while (l2--) {
        var _dep = prevObserving[l2];
        if (_dep.diffValue === 0) {
          removeObserver(_dep, derivation);
        }
        _dep.diffValue = 0;
      }
      while (i0--) {
        var _dep2 = observing[i0];
        if (_dep2.diffValue === 1) {
          _dep2.diffValue = 0;
          addObserver(_dep2, derivation);
        }
      }
      if (lowestNewObservingDerivationState !== IDerivationState_.UP_TO_DATE_) {
        derivation.dependenciesState_ = lowestNewObservingDerivationState;
        derivation.onBecomeStale_();
      }
    }
    function clearObserving(derivation) {
      var obs = derivation.observing_;
      derivation.observing_ = [];
      var i = obs.length;
      while (i--) {
        removeObserver(obs[i], derivation);
      }
      derivation.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
    }
    function untracked(action2) {
      var prev = untrackedStart();
      try {
        return action2();
      } finally {
        untrackedEnd(prev);
      }
    }
    function untrackedStart() {
      var prev = globalState.trackingDerivation;
      globalState.trackingDerivation = null;
      return prev;
    }
    function untrackedEnd(prev) {
      globalState.trackingDerivation = prev;
    }
    function allowStateReadsStart(allowStateReads) {
      var prev = globalState.allowStateReads;
      globalState.allowStateReads = allowStateReads;
      return prev;
    }
    function allowStateReadsEnd(prev) {
      globalState.allowStateReads = prev;
    }
    function changeDependenciesStateTo0(derivation) {
      if (derivation.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
        return;
      }
      derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_;
      var obs = derivation.observing_;
      var i = obs.length;
      while (i--) {
        obs[i].lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
      }
    }
    var MobXGlobals = function MobXGlobals2() {
      this.version = 6;
      this.UNCHANGED = {};
      this.trackingDerivation = null;
      this.trackingContext = null;
      this.runId = 0;
      this.mobxGuid = 0;
      this.inBatch = 0;
      this.pendingUnobservations = [];
      this.pendingReactions = [];
      this.isRunningReactions = false;
      this.allowStateChanges = false;
      this.allowStateReads = true;
      this.enforceActions = true;
      this.spyListeners = [];
      this.globalReactionErrorHandlers = [];
      this.computedRequiresReaction = false;
      this.reactionRequiresObservable = false;
      this.observableRequiresReaction = false;
      this.disableErrorBoundaries = false;
      this.suppressReactionErrors = false;
      this.useProxies = true;
      this.verifyProxies = false;
      this.safeDescriptors = true;
    };
    var canMergeGlobalState = true;
    var isolateCalled = false;
    var globalState = /* @__PURE__ */ function() {
      var global2 = /* @__PURE__ */ getGlobal();
      if (global2.__mobxInstanceCount > 0 && !global2.__mobxGlobals) {
        canMergeGlobalState = false;
      }
      if (global2.__mobxGlobals && global2.__mobxGlobals.version !== new MobXGlobals().version) {
        canMergeGlobalState = false;
      }
      if (!canMergeGlobalState) {
        setTimeout(function() {
          if (!isolateCalled) {
            die(35);
          }
        }, 1);
        return new MobXGlobals();
      } else if (global2.__mobxGlobals) {
        global2.__mobxInstanceCount += 1;
        if (!global2.__mobxGlobals.UNCHANGED) {
          global2.__mobxGlobals.UNCHANGED = {};
        }
        return global2.__mobxGlobals;
      } else {
        global2.__mobxInstanceCount = 1;
        return global2.__mobxGlobals = /* @__PURE__ */ new MobXGlobals();
      }
    }();
    function isolateGlobalState() {
      if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) {
        die(36);
      }
      isolateCalled = true;
      if (canMergeGlobalState) {
        var global2 = getGlobal();
        if (--global2.__mobxInstanceCount === 0) {
          global2.__mobxGlobals = void 0;
        }
        globalState = new MobXGlobals();
      }
    }
    function addObserver(observable2, node) {
      observable2.observers_.add(node);
      if (observable2.lowestObserverState_ > node.dependenciesState_) {
        observable2.lowestObserverState_ = node.dependenciesState_;
      }
    }
    function removeObserver(observable2, node) {
      observable2.observers_["delete"](node);
      if (observable2.observers_.size === 0) {
        queueForUnobservation(observable2);
      }
    }
    function queueForUnobservation(observable2) {
      if (observable2.isPendingUnobservation === false) {
        observable2.isPendingUnobservation = true;
        globalState.pendingUnobservations.push(observable2);
      }
    }
    function startBatch() {
      globalState.inBatch++;
    }
    function endBatch() {
      if (--globalState.inBatch === 0) {
        runReactions();
        var list = globalState.pendingUnobservations;
        for (var i = 0; i < list.length; i++) {
          var observable2 = list[i];
          observable2.isPendingUnobservation = false;
          if (observable2.observers_.size === 0) {
            if (observable2.isBeingObserved) {
              observable2.isBeingObserved = false;
              observable2.onBUO();
            }
            if (observable2 instanceof ComputedValue) {
              observable2.suspend_();
            }
          }
        }
        globalState.pendingUnobservations = [];
      }
    }
    function reportObserved(observable2) {
      var derivation = globalState.trackingDerivation;
      if (derivation !== null) {
        if (derivation.runId_ !== observable2.lastAccessedBy_) {
          observable2.lastAccessedBy_ = derivation.runId_;
          derivation.newObserving_[derivation.unboundDepsCount_++] = observable2;
          if (!observable2.isBeingObserved && globalState.trackingContext) {
            observable2.isBeingObserved = true;
            observable2.onBO();
          }
        }
        return observable2.isBeingObserved;
      } else if (observable2.observers_.size === 0 && globalState.inBatch > 0) {
        queueForUnobservation(observable2);
      }
      return false;
    }
    function propagateChanged(observable2) {
      if (observable2.lowestObserverState_ === IDerivationState_.STALE_) {
        return;
      }
      observable2.lowestObserverState_ = IDerivationState_.STALE_;
      observable2.observers_.forEach(function(d) {
        if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
          d.onBecomeStale_();
        }
        d.dependenciesState_ = IDerivationState_.STALE_;
      });
    }
    function propagateChangeConfirmed(observable2) {
      if (observable2.lowestObserverState_ === IDerivationState_.STALE_) {
        return;
      }
      observable2.lowestObserverState_ = IDerivationState_.STALE_;
      observable2.observers_.forEach(function(d) {
        if (d.dependenciesState_ === IDerivationState_.POSSIBLY_STALE_) {
          d.dependenciesState_ = IDerivationState_.STALE_;
        } else if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
          observable2.lowestObserverState_ = IDerivationState_.UP_TO_DATE_;
        }
      });
    }
    function propagateMaybeChanged(observable2) {
      if (observable2.lowestObserverState_ !== IDerivationState_.UP_TO_DATE_) {
        return;
      }
      observable2.lowestObserverState_ = IDerivationState_.POSSIBLY_STALE_;
      observable2.observers_.forEach(function(d) {
        if (d.dependenciesState_ === IDerivationState_.UP_TO_DATE_) {
          d.dependenciesState_ = IDerivationState_.POSSIBLY_STALE_;
          d.onBecomeStale_();
        }
      });
    }
    var Reaction = /* @__PURE__ */ function() {
      function Reaction2(name_, onInvalidate_, errorHandler_, requiresObservable_) {
        if (name_ === void 0) {
          name_ = "Reaction";
        }
        this.name_ = void 0;
        this.onInvalidate_ = void 0;
        this.errorHandler_ = void 0;
        this.requiresObservable_ = void 0;
        this.observing_ = [];
        this.newObserving_ = [];
        this.dependenciesState_ = IDerivationState_.NOT_TRACKING_;
        this.runId_ = 0;
        this.unboundDepsCount_ = 0;
        this.flags_ = 0;
        this.isTracing_ = TraceMode.NONE;
        this.name_ = name_;
        this.onInvalidate_ = onInvalidate_;
        this.errorHandler_ = errorHandler_;
        this.requiresObservable_ = requiresObservable_;
      }
      var _proto = Reaction2.prototype;
      _proto.onBecomeStale_ = function onBecomeStale_() {
        this.schedule_();
      };
      _proto.schedule_ = function schedule_() {
        if (!this.isScheduled) {
          this.isScheduled = true;
          globalState.pendingReactions.push(this);
          runReactions();
        }
      };
      _proto.runReaction_ = function runReaction_() {
        if (!this.isDisposed) {
          startBatch();
          this.isScheduled = false;
          var prev = globalState.trackingContext;
          globalState.trackingContext = this;
          if (shouldCompute(this)) {
            this.isTrackPending = true;
            try {
              this.onInvalidate_();
              if (false) ;
            } catch (e) {
              this.reportExceptionInDerivation_(e);
            }
          }
          globalState.trackingContext = prev;
          endBatch();
        }
      };
      _proto.track = function track(fn) {
        if (this.isDisposed) {
          return;
        }
        startBatch();
        this.isRunning = true;
        var prevReaction = globalState.trackingContext;
        globalState.trackingContext = this;
        var result = trackDerivedFunction(this, fn, void 0);
        globalState.trackingContext = prevReaction;
        this.isRunning = false;
        this.isTrackPending = false;
        if (this.isDisposed) {
          clearObserving(this);
        }
        if (isCaughtException(result)) {
          this.reportExceptionInDerivation_(result.cause);
        }
        endBatch();
      };
      _proto.reportExceptionInDerivation_ = function reportExceptionInDerivation_(error) {
        var _this = this;
        if (this.errorHandler_) {
          this.errorHandler_(error, this);
          return;
        }
        if (globalState.disableErrorBoundaries) {
          throw error;
        }
        var message = "[mobx] uncaught error in '" + this + "'";
        if (!globalState.suppressReactionErrors) {
          console.error(message, error);
        }
        globalState.globalReactionErrorHandlers.forEach(function(f2) {
          return f2(error, _this);
        });
      };
      _proto.dispose = function dispose() {
        if (!this.isDisposed) {
          this.isDisposed = true;
          if (!this.isRunning) {
            startBatch();
            clearObserving(this);
            endBatch();
          }
        }
      };
      _proto.getDisposer_ = function getDisposer_(abortSignal) {
        var _this2 = this;
        var dispose = function dispose2() {
          _this2.dispose();
          abortSignal == null || abortSignal.removeEventListener == null || abortSignal.removeEventListener("abort", dispose2);
        };
        abortSignal == null || abortSignal.addEventListener == null || abortSignal.addEventListener("abort", dispose);
        dispose[$mobx] = this;
        return dispose;
      };
      _proto.toString = function toString2() {
        return "Reaction[" + this.name_ + "]";
      };
      _proto.trace = function trace$1(enterBreakPoint) {
      };
      return _createClass(Reaction2, [{
        key: "isDisposed",
        get: function get4() {
          return getFlag(this.flags_, Reaction2.isDisposedMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Reaction2.isDisposedMask_, newValue);
        }
      }, {
        key: "isScheduled",
        get: function get4() {
          return getFlag(this.flags_, Reaction2.isScheduledMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Reaction2.isScheduledMask_, newValue);
        }
      }, {
        key: "isTrackPending",
        get: function get4() {
          return getFlag(this.flags_, Reaction2.isTrackPendingMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Reaction2.isTrackPendingMask_, newValue);
        }
      }, {
        key: "isRunning",
        get: function get4() {
          return getFlag(this.flags_, Reaction2.isRunningMask_);
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Reaction2.isRunningMask_, newValue);
        }
      }, {
        key: "diffValue",
        get: function get4() {
          return getFlag(this.flags_, Reaction2.diffValueMask_) ? 1 : 0;
        },
        set: function set5(newValue) {
          this.flags_ = setFlag(this.flags_, Reaction2.diffValueMask_, newValue === 1 ? true : false);
        }
      }]);
    }();
    Reaction.isDisposedMask_ = 1;
    Reaction.isScheduledMask_ = 2;
    Reaction.isTrackPendingMask_ = 4;
    Reaction.isRunningMask_ = 8;
    Reaction.diffValueMask_ = 16;
    var MAX_REACTION_ITERATIONS = 100;
    var reactionScheduler = function reactionScheduler2(f2) {
      return f2();
    };
    function runReactions() {
      if (globalState.inBatch > 0 || globalState.isRunningReactions) {
        return;
      }
      reactionScheduler(runReactionsHelper);
    }
    function runReactionsHelper() {
      globalState.isRunningReactions = true;
      var allReactions = globalState.pendingReactions;
      var iterations = 0;
      while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
          console.error("[mobx] cycle in reaction: " + allReactions[0]);
          allReactions.splice(0);
        }
        var remainingReactions = allReactions.splice(0);
        for (var i = 0, l2 = remainingReactions.length; i < l2; i++) {
          remainingReactions[i].runReaction_();
        }
      }
      globalState.isRunningReactions = false;
    }
    var isReaction = /* @__PURE__ */ createInstanceofPredicate("Reaction", Reaction);
    function setReactionScheduler(fn) {
      var baseScheduler = reactionScheduler;
      reactionScheduler = function reactionScheduler3(f2) {
        return fn(function() {
          return baseScheduler(f2);
        });
      };
    }
    function isSpyEnabled() {
      return false;
    }
    function spy(listener) {
      {
        console.warn("[mobx.spy] Is a no-op in production builds");
        return function() {
        };
      }
    }
    var ACTION = "action";
    var ACTION_BOUND = "action.bound";
    var AUTOACTION = "autoAction";
    var AUTOACTION_BOUND = "autoAction.bound";
    var DEFAULT_ACTION_NAME = "<unnamed action>";
    var actionAnnotation = /* @__PURE__ */ createActionAnnotation(ACTION);
    var actionBoundAnnotation = /* @__PURE__ */ createActionAnnotation(ACTION_BOUND, {
      bound: true
    });
    var autoActionAnnotation = /* @__PURE__ */ createActionAnnotation(AUTOACTION, {
      autoAction: true
    });
    var autoActionBoundAnnotation = /* @__PURE__ */ createActionAnnotation(AUTOACTION_BOUND, {
      autoAction: true,
      bound: true
    });
    function createActionFactory(autoAction2) {
      var res = function action2(arg1, arg2) {
        if (isFunction(arg1)) {
          return createAction(arg1.name || DEFAULT_ACTION_NAME, arg1, autoAction2);
        }
        if (isFunction(arg2)) {
          return createAction(arg1, arg2, autoAction2);
        }
        if (is20223Decorator(arg2)) {
          return (autoAction2 ? autoActionAnnotation : actionAnnotation).decorate_20223_(arg1, arg2);
        }
        if (isStringish(arg2)) {
          return storeAnnotation(arg1, arg2, autoAction2 ? autoActionAnnotation : actionAnnotation);
        }
        if (isStringish(arg1)) {
          return createDecoratorAnnotation(createActionAnnotation(autoAction2 ? AUTOACTION : ACTION, {
            name: arg1,
            autoAction: autoAction2
          }));
        }
      };
      return res;
    }
    var action = /* @__PURE__ */ createActionFactory(false);
    Object.assign(action, actionAnnotation);
    var autoAction = /* @__PURE__ */ createActionFactory(true);
    Object.assign(autoAction, autoActionAnnotation);
    action.bound = /* @__PURE__ */ createDecoratorAnnotation(actionBoundAnnotation);
    autoAction.bound = /* @__PURE__ */ createDecoratorAnnotation(autoActionBoundAnnotation);
    function isAction(thing) {
      return isFunction(thing) && thing.isMobxAction === true;
    }
    function autorun(view, opts) {
      var _opts$name, _opts, _opts2, _opts3;
      if (opts === void 0) {
        opts = EMPTY_OBJECT;
      }
      var name = (_opts$name = (_opts = opts) == null ? void 0 : _opts.name) != null ? _opts$name : "Autorun";
      var runSync = !opts.scheduler && !opts.delay;
      var reaction2;
      if (runSync) {
        reaction2 = new Reaction(name, function() {
          this.track(reactionRunner);
        }, opts.onError, opts.requiresObservable);
      } else {
        var scheduler2 = createSchedulerFromOptions(opts);
        var isScheduled = false;
        reaction2 = new Reaction(name, function() {
          if (!isScheduled) {
            isScheduled = true;
            scheduler2(function() {
              isScheduled = false;
              if (!reaction2.isDisposed) {
                reaction2.track(reactionRunner);
              }
            });
          }
        }, opts.onError, opts.requiresObservable);
      }
      function reactionRunner() {
        view(reaction2);
      }
      if (!((_opts2 = opts) != null && (_opts2 = _opts2.signal) != null && _opts2.aborted)) {
        reaction2.schedule_();
      }
      return reaction2.getDisposer_((_opts3 = opts) == null ? void 0 : _opts3.signal);
    }
    var run = function run2(f2) {
      return f2();
    };
    function createSchedulerFromOptions(opts) {
      return opts.scheduler ? opts.scheduler : opts.delay ? function(f2) {
        return setTimeout(f2, opts.delay);
      } : run;
    }
    var ON_BECOME_OBSERVED = "onBO";
    var ON_BECOME_UNOBSERVED = "onBUO";
    function onBecomeObserved(thing, arg2, arg3) {
      return interceptHook(ON_BECOME_OBSERVED, thing, arg2, arg3);
    }
    function onBecomeUnobserved(thing, arg2, arg3) {
      return interceptHook(ON_BECOME_UNOBSERVED, thing, arg2, arg3);
    }
    function interceptHook(hook, thing, arg2, arg3) {
      var atom = getAtom(thing);
      var cb2 = isFunction(arg3) ? arg3 : arg2;
      var listenersKey = hook + "L";
      if (atom[listenersKey]) {
        atom[listenersKey].add(cb2);
      } else {
        atom[listenersKey] = /* @__PURE__ */ new Set([cb2]);
      }
      return function() {
        var hookListeners = atom[listenersKey];
        if (hookListeners) {
          hookListeners["delete"](cb2);
          if (hookListeners.size === 0) {
            delete atom[listenersKey];
          }
        }
      };
    }
    var NEVER = "never";
    var ALWAYS = "always";
    var OBSERVED = "observed";
    function configure(options) {
      if (options.isolateGlobalState === true) {
        isolateGlobalState();
      }
      var useProxies = options.useProxies, enforceActions = options.enforceActions;
      if (useProxies !== void 0) {
        globalState.useProxies = useProxies === ALWAYS ? true : useProxies === NEVER ? false : typeof Proxy !== "undefined";
      }
      if (useProxies === "ifavailable") {
        globalState.verifyProxies = true;
      }
      if (enforceActions !== void 0) {
        var ea2 = enforceActions === ALWAYS ? ALWAYS : enforceActions === OBSERVED;
        globalState.enforceActions = ea2;
        globalState.allowStateChanges = ea2 === true || ea2 === ALWAYS ? false : true;
      }
      ["computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "disableErrorBoundaries", "safeDescriptors"].forEach(function(key) {
        if (key in options) {
          globalState[key] = !!options[key];
        }
      });
      globalState.allowStateReads = !globalState.observableRequiresReaction;
      if (options.reactionScheduler) {
        setReactionScheduler(options.reactionScheduler);
      }
    }
    function extendObservable(target, properties, annotations, options) {
      var descriptors = getOwnPropertyDescriptors(properties);
      initObservable(function() {
        var adm = asObservableObject(target, options)[$mobx];
        ownKeys(descriptors).forEach(function(key) {
          adm.extend_(
            key,
            descriptors[key],
            // must pass "undefined" for { key: undefined }
            !annotations ? true : key in annotations ? annotations[key] : true
          );
        });
      });
      return target;
    }
    function getDependencyTree(thing, property) {
      return nodeToDependencyTree(getAtom(thing, property));
    }
    function nodeToDependencyTree(node) {
      var result = {
        name: node.name_
      };
      if (node.observing_ && node.observing_.length > 0) {
        result.dependencies = unique(node.observing_).map(nodeToDependencyTree);
      }
      return result;
    }
    function unique(list) {
      return Array.from(new Set(list));
    }
    var generatorId = 0;
    function FlowCancellationError() {
      this.message = "FLOW_CANCELLED";
    }
    FlowCancellationError.prototype = /* @__PURE__ */ Object.create(Error.prototype);
    var flowAnnotation = /* @__PURE__ */ createFlowAnnotation("flow");
    var flowBoundAnnotation = /* @__PURE__ */ createFlowAnnotation("flow.bound", {
      bound: true
    });
    var flow = /* @__PURE__ */ Object.assign(function flow2(arg1, arg2) {
      if (is20223Decorator(arg2)) {
        return flowAnnotation.decorate_20223_(arg1, arg2);
      }
      if (isStringish(arg2)) {
        return storeAnnotation(arg1, arg2, flowAnnotation);
      }
      var generator = arg1;
      var name = generator.name || "<unnamed flow>";
      var res = function res2() {
        var ctx = this;
        var args = arguments;
        var runId = ++generatorId;
        var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
        var rejector;
        var pendingPromise = void 0;
        var promise = new Promise(function(resolve, reject) {
          var stepId = 0;
          rejector = reject;
          function onFulfilled(res3) {
            pendingPromise = void 0;
            var ret;
            try {
              ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res3);
            } catch (e) {
              return reject(e);
            }
            next(ret);
          }
          function onRejected(err) {
            pendingPromise = void 0;
            var ret;
            try {
              ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen["throw"]).call(gen, err);
            } catch (e) {
              return reject(e);
            }
            next(ret);
          }
          function next(ret) {
            if (isFunction(ret == null ? void 0 : ret.then)) {
              ret.then(next, reject);
              return;
            }
            if (ret.done) {
              return resolve(ret.value);
            }
            pendingPromise = Promise.resolve(ret.value);
            return pendingPromise.then(onFulfilled, onRejected);
          }
          onFulfilled(void 0);
        });
        promise.cancel = action(name + " - runid: " + runId + " - cancel", function() {
          try {
            if (pendingPromise) {
              cancelPromise(pendingPromise);
            }
            var _res = gen["return"](void 0);
            var yieldedPromise = Promise.resolve(_res.value);
            yieldedPromise.then(noop, noop);
            cancelPromise(yieldedPromise);
            rejector(new FlowCancellationError());
          } catch (e) {
            rejector(e);
          }
        });
        return promise;
      };
      res.isMobXFlow = true;
      return res;
    }, flowAnnotation);
    flow.bound = /* @__PURE__ */ createDecoratorAnnotation(flowBoundAnnotation);
    function cancelPromise(promise) {
      if (isFunction(promise.cancel)) {
        promise.cancel();
      }
    }
    function isFlow(fn) {
      return (fn == null ? void 0 : fn.isMobXFlow) === true;
    }
    function _isObservable(value, property) {
      if (!value) {
        return false;
      }
      return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
    }
    function isObservable(value) {
      return _isObservable(value);
    }
    function transaction(action2, thisArg) {
      if (thisArg === void 0) {
        thisArg = void 0;
      }
      startBatch();
      try {
        return action2.apply(thisArg);
      } finally {
        endBatch();
      }
    }
    function getAdm(target) {
      return target[$mobx];
    }
    var objectProxyTraps = {
      has: function has2(target, name) {
        return getAdm(target).has_(name);
      },
      get: function get2(target, name) {
        return getAdm(target).get_(name);
      },
      set: function set3(target, name, value) {
        var _getAdm$set_;
        if (!isStringish(name)) {
          return false;
        }
        return (_getAdm$set_ = getAdm(target).set_(name, value, true)) != null ? _getAdm$set_ : true;
      },
      deleteProperty: function deleteProperty(target, name) {
        var _getAdm$delete_;
        if (!isStringish(name)) {
          return false;
        }
        return (_getAdm$delete_ = getAdm(target).delete_(name, true)) != null ? _getAdm$delete_ : true;
      },
      defineProperty: function defineProperty2(target, name, descriptor) {
        var _getAdm$definePropert;
        return (_getAdm$definePropert = getAdm(target).defineProperty_(name, descriptor)) != null ? _getAdm$definePropert : true;
      },
      ownKeys: function ownKeys2(target) {
        return getAdm(target).ownKeys_();
      },
      preventExtensions: function preventExtensions(target) {
        die(13);
      }
    };
    function asDynamicObservableObject(target, options) {
      var _target$$mobx, _target$$mobx$proxy_;
      assertProxies();
      target = asObservableObject(target, options);
      return (_target$$mobx$proxy_ = (_target$$mobx = target[$mobx]).proxy_) != null ? _target$$mobx$proxy_ : _target$$mobx.proxy_ = new Proxy(target, objectProxyTraps);
    }
    function hasInterceptors(interceptable) {
      return interceptable.interceptors_ !== void 0 && interceptable.interceptors_.length > 0;
    }
    function registerInterceptor(interceptable, handler) {
      var interceptors = interceptable.interceptors_ || (interceptable.interceptors_ = []);
      interceptors.push(handler);
      return once(function() {
        var idx = interceptors.indexOf(handler);
        if (idx !== -1) {
          interceptors.splice(idx, 1);
        }
      });
    }
    function interceptChange(interceptable, change) {
      var prevU = untrackedStart();
      try {
        var interceptors = [].concat(interceptable.interceptors_ || []);
        for (var i = 0, l2 = interceptors.length; i < l2; i++) {
          change = interceptors[i](change);
          if (change && !change.type) {
            die(14);
          }
          if (!change) {
            break;
          }
        }
        return change;
      } finally {
        untrackedEnd(prevU);
      }
    }
    function hasListeners(listenable) {
      return listenable.changeListeners_ !== void 0 && listenable.changeListeners_.length > 0;
    }
    function registerListener(listenable, handler) {
      var listeners = listenable.changeListeners_ || (listenable.changeListeners_ = []);
      listeners.push(handler);
      return once(function() {
        var idx = listeners.indexOf(handler);
        if (idx !== -1) {
          listeners.splice(idx, 1);
        }
      });
    }
    function notifyListeners(listenable, change) {
      var prevU = untrackedStart();
      var listeners = listenable.changeListeners_;
      if (!listeners) {
        return;
      }
      listeners = listeners.slice();
      for (var i = 0, l2 = listeners.length; i < l2; i++) {
        listeners[i](change);
      }
      untrackedEnd(prevU);
    }
    function makeObservable(target, annotations, options) {
      initObservable(function() {
        var _annotations;
        var adm = asObservableObject(target, options)[$mobx];
        if (false) ;
        (_annotations = annotations) != null ? _annotations : annotations = collectStoredAnnotations(target);
        ownKeys(annotations).forEach(function(key) {
          return adm.make_(key, annotations[key]);
        });
      });
      return target;
    }
    var SPLICE = "splice";
    var UPDATE = "update";
    var MAX_SPLICE_SIZE = 1e4;
    var arrayTraps = {
      get: function get3(target, name) {
        var adm = target[$mobx];
        if (name === $mobx) {
          return adm;
        }
        if (name === "length") {
          return adm.getArrayLength_();
        }
        if (typeof name === "string" && !isNaN(name)) {
          return adm.get_(parseInt(name));
        }
        if (hasProp(arrayExtensions, name)) {
          return arrayExtensions[name];
        }
        return target[name];
      },
      set: function set4(target, name, value) {
        var adm = target[$mobx];
        if (name === "length") {
          adm.setArrayLength_(value);
        }
        if (typeof name === "symbol" || isNaN(name)) {
          target[name] = value;
        } else {
          adm.set_(parseInt(name), value);
        }
        return true;
      },
      preventExtensions: function preventExtensions2() {
        die(15);
      }
    };
    var ObservableArrayAdministration = /* @__PURE__ */ function() {
      function ObservableArrayAdministration2(name, enhancer, owned_, legacyMode_) {
        if (name === void 0) {
          name = "ObservableArray";
        }
        this.owned_ = void 0;
        this.legacyMode_ = void 0;
        this.atom_ = void 0;
        this.values_ = [];
        this.interceptors_ = void 0;
        this.changeListeners_ = void 0;
        this.enhancer_ = void 0;
        this.dehancer = void 0;
        this.proxy_ = void 0;
        this.lastKnownLength_ = 0;
        this.owned_ = owned_;
        this.legacyMode_ = legacyMode_;
        this.atom_ = new Atom(name);
        this.enhancer_ = function(newV, oldV) {
          return enhancer(newV, oldV, "ObservableArray[..]");
        };
      }
      var _proto = ObservableArrayAdministration2.prototype;
      _proto.dehanceValue_ = function dehanceValue_(value) {
        if (this.dehancer !== void 0) {
          return this.dehancer(value);
        }
        return value;
      };
      _proto.dehanceValues_ = function dehanceValues_(values2) {
        if (this.dehancer !== void 0 && values2.length > 0) {
          return values2.map(this.dehancer);
        }
        return values2;
      };
      _proto.intercept_ = function intercept_(handler) {
        return registerInterceptor(this, handler);
      };
      _proto.observe_ = function observe_(listener, fireImmediately) {
        if (fireImmediately === void 0) {
          fireImmediately = false;
        }
        if (fireImmediately) {
          listener({
            observableKind: "array",
            object: this.proxy_,
            debugObjectName: this.atom_.name_,
            type: "splice",
            index: 0,
            added: this.values_.slice(),
            addedCount: this.values_.length,
            removed: [],
            removedCount: 0
          });
        }
        return registerListener(this, listener);
      };
      _proto.getArrayLength_ = function getArrayLength_() {
        this.atom_.reportObserved();
        return this.values_.length;
      };
      _proto.setArrayLength_ = function setArrayLength_(newLength) {
        if (typeof newLength !== "number" || isNaN(newLength) || newLength < 0) {
          die("Out of range: " + newLength);
        }
        var currentLength = this.values_.length;
        if (newLength === currentLength) {
          return;
        } else if (newLength > currentLength) {
          var newItems = new Array(newLength - currentLength);
          for (var i = 0; i < newLength - currentLength; i++) {
            newItems[i] = void 0;
          }
          this.spliceWithArray_(currentLength, 0, newItems);
        } else {
          this.spliceWithArray_(newLength, currentLength - newLength);
        }
      };
      _proto.updateArrayLength_ = function updateArrayLength_(oldLength, delta) {
        if (oldLength !== this.lastKnownLength_) {
          die(16);
        }
        this.lastKnownLength_ += delta;
        if (this.legacyMode_ && delta > 0) {
          reserveArrayBuffer(oldLength + delta + 1);
        }
      };
      _proto.spliceWithArray_ = function spliceWithArray_(index, deleteCount, newItems) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this.atom_);
        var length = this.values_.length;
        if (index === void 0) {
          index = 0;
        } else if (index > length) {
          index = length;
        } else if (index < 0) {
          index = Math.max(0, length + index);
        }
        if (arguments.length === 1) {
          deleteCount = length - index;
        } else if (deleteCount === void 0 || deleteCount === null) {
          deleteCount = 0;
        } else {
          deleteCount = Math.max(0, Math.min(deleteCount, length - index));
        }
        if (newItems === void 0) {
          newItems = EMPTY_ARRAY;
        }
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            object: this.proxy_,
            type: SPLICE,
            index,
            removedCount: deleteCount,
            added: newItems
          });
          if (!change) {
            return EMPTY_ARRAY;
          }
          deleteCount = change.removedCount;
          newItems = change.added;
        }
        newItems = newItems.length === 0 ? newItems : newItems.map(function(v2) {
          return _this.enhancer_(v2, void 0);
        });
        if (this.legacyMode_ || false) {
          var lengthDelta = newItems.length - deleteCount;
          this.updateArrayLength_(length, lengthDelta);
        }
        var res = this.spliceItemsIntoValues_(index, deleteCount, newItems);
        if (deleteCount !== 0 || newItems.length !== 0) {
          this.notifyArraySplice_(index, newItems, res);
        }
        return this.dehanceValues_(res);
      };
      _proto.spliceItemsIntoValues_ = function spliceItemsIntoValues_(index, deleteCount, newItems) {
        if (newItems.length < MAX_SPLICE_SIZE) {
          var _this$values_;
          return (_this$values_ = this.values_).splice.apply(_this$values_, [index, deleteCount].concat(newItems));
        } else {
          var res = this.values_.slice(index, index + deleteCount);
          var oldItems = this.values_.slice(index + deleteCount);
          this.values_.length += newItems.length - deleteCount;
          for (var i = 0; i < newItems.length; i++) {
            this.values_[index + i] = newItems[i];
          }
          for (var _i = 0; _i < oldItems.length; _i++) {
            this.values_[index + newItems.length + _i] = oldItems[_i];
          }
          return res;
        }
      };
      _proto.notifyArrayChildUpdate_ = function notifyArrayChildUpdate_(index, newValue, oldValue) {
        var notifySpy = !this.owned_ && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
          observableKind: "array",
          object: this.proxy_,
          type: UPDATE,
          debugObjectName: this.atom_.name_,
          index,
          newValue,
          oldValue
        } : null;
        this.atom_.reportChanged();
        if (notify) {
          notifyListeners(this, change);
        }
      };
      _proto.notifyArraySplice_ = function notifyArraySplice_(index, added, removed) {
        var notifySpy = !this.owned_ && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
          observableKind: "array",
          object: this.proxy_,
          debugObjectName: this.atom_.name_,
          type: SPLICE,
          index,
          removed,
          added,
          removedCount: removed.length,
          addedCount: added.length
        } : null;
        this.atom_.reportChanged();
        if (notify) {
          notifyListeners(this, change);
        }
      };
      _proto.get_ = function get_(index) {
        if (this.legacyMode_ && index >= this.values_.length) {
          console.warn("[mobx] Out of bounds read: " + index);
          return void 0;
        }
        this.atom_.reportObserved();
        return this.dehanceValue_(this.values_[index]);
      };
      _proto.set_ = function set_(index, newValue) {
        var values2 = this.values_;
        if (this.legacyMode_ && index > values2.length) {
          die(17, index, values2.length);
        }
        if (index < values2.length) {
          checkIfStateModificationsAreAllowed(this.atom_);
          var oldValue = values2[index];
          if (hasInterceptors(this)) {
            var change = interceptChange(this, {
              type: UPDATE,
              object: this.proxy_,
              // since "this" is the real array we need to pass its proxy
              index,
              newValue
            });
            if (!change) {
              return;
            }
            newValue = change.newValue;
          }
          newValue = this.enhancer_(newValue, oldValue);
          var changed = newValue !== oldValue;
          if (changed) {
            values2[index] = newValue;
            this.notifyArrayChildUpdate_(index, newValue, oldValue);
          }
        } else {
          var newItems = new Array(index + 1 - values2.length);
          for (var i = 0; i < newItems.length - 1; i++) {
            newItems[i] = void 0;
          }
          newItems[newItems.length - 1] = newValue;
          this.spliceWithArray_(values2.length, 0, newItems);
        }
      };
      return ObservableArrayAdministration2;
    }();
    function createObservableArray(initialValues, enhancer, name, owned) {
      if (name === void 0) {
        name = "ObservableArray";
      }
      if (owned === void 0) {
        owned = false;
      }
      assertProxies();
      return initObservable(function() {
        var adm = new ObservableArrayAdministration(name, enhancer, owned, false);
        addHiddenFinalProp(adm.values_, $mobx, adm);
        var proxy = new Proxy(adm.values_, arrayTraps);
        adm.proxy_ = proxy;
        if (initialValues && initialValues.length) {
          adm.spliceWithArray_(0, 0, initialValues);
        }
        return proxy;
      });
    }
    var arrayExtensions = {
      clear: function clear() {
        return this.splice(0);
      },
      replace: function replace(newItems) {
        var adm = this[$mobx];
        return adm.spliceWithArray_(0, adm.values_.length, newItems);
      },
      // Used by JSON.stringify
      toJSON: function toJSON() {
        return this.slice();
      },
      /*
       * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
       * since these functions alter the inner structure of the array, the have side effects.
       * Because the have side effects, they should not be used in computed function,
       * and for that reason the do not call dependencyState.notifyObserved
       */
      splice: function splice(index, deleteCount) {
        for (var _len = arguments.length, newItems = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          newItems[_key - 2] = arguments[_key];
        }
        var adm = this[$mobx];
        switch (arguments.length) {
          case 0:
            return [];
          case 1:
            return adm.spliceWithArray_(index);
          case 2:
            return adm.spliceWithArray_(index, deleteCount);
        }
        return adm.spliceWithArray_(index, deleteCount, newItems);
      },
      spliceWithArray: function spliceWithArray(index, deleteCount, newItems) {
        return this[$mobx].spliceWithArray_(index, deleteCount, newItems);
      },
      push: function push() {
        var adm = this[$mobx];
        for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          items[_key2] = arguments[_key2];
        }
        adm.spliceWithArray_(adm.values_.length, 0, items);
        return adm.values_.length;
      },
      pop: function pop() {
        return this.splice(Math.max(this[$mobx].values_.length - 1, 0), 1)[0];
      },
      shift: function shift() {
        return this.splice(0, 1)[0];
      },
      unshift: function unshift() {
        var adm = this[$mobx];
        for (var _len3 = arguments.length, items = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          items[_key3] = arguments[_key3];
        }
        adm.spliceWithArray_(0, 0, items);
        return adm.values_.length;
      },
      reverse: function reverse() {
        if (globalState.trackingDerivation) {
          die(37, "reverse");
        }
        this.replace(this.slice().reverse());
        return this;
      },
      sort: function sort() {
        if (globalState.trackingDerivation) {
          die(37, "sort");
        }
        var copy = this.slice();
        copy.sort.apply(copy, arguments);
        this.replace(copy);
        return this;
      },
      remove: function remove2(value) {
        var adm = this[$mobx];
        var idx = adm.dehanceValues_(adm.values_).indexOf(value);
        if (idx > -1) {
          this.splice(idx, 1);
          return true;
        }
        return false;
      }
    };
    addArrayExtension("at", simpleFunc);
    addArrayExtension("concat", simpleFunc);
    addArrayExtension("flat", simpleFunc);
    addArrayExtension("includes", simpleFunc);
    addArrayExtension("indexOf", simpleFunc);
    addArrayExtension("join", simpleFunc);
    addArrayExtension("lastIndexOf", simpleFunc);
    addArrayExtension("slice", simpleFunc);
    addArrayExtension("toString", simpleFunc);
    addArrayExtension("toLocaleString", simpleFunc);
    addArrayExtension("toSorted", simpleFunc);
    addArrayExtension("toSpliced", simpleFunc);
    addArrayExtension("with", simpleFunc);
    addArrayExtension("every", mapLikeFunc);
    addArrayExtension("filter", mapLikeFunc);
    addArrayExtension("find", mapLikeFunc);
    addArrayExtension("findIndex", mapLikeFunc);
    addArrayExtension("findLast", mapLikeFunc);
    addArrayExtension("findLastIndex", mapLikeFunc);
    addArrayExtension("flatMap", mapLikeFunc);
    addArrayExtension("forEach", mapLikeFunc);
    addArrayExtension("map", mapLikeFunc);
    addArrayExtension("some", mapLikeFunc);
    addArrayExtension("toReversed", mapLikeFunc);
    addArrayExtension("reduce", reduceLikeFunc);
    addArrayExtension("reduceRight", reduceLikeFunc);
    function addArrayExtension(funcName, funcFactory) {
      if (typeof Array.prototype[funcName] === "function") {
        arrayExtensions[funcName] = funcFactory(funcName);
      }
    }
    function simpleFunc(funcName) {
      return function() {
        var adm = this[$mobx];
        adm.atom_.reportObserved();
        var dehancedValues = adm.dehanceValues_(adm.values_);
        return dehancedValues[funcName].apply(dehancedValues, arguments);
      };
    }
    function mapLikeFunc(funcName) {
      return function(callback, thisArg) {
        var _this2 = this;
        var adm = this[$mobx];
        adm.atom_.reportObserved();
        var dehancedValues = adm.dehanceValues_(adm.values_);
        return dehancedValues[funcName](function(element, index) {
          return callback.call(thisArg, element, index, _this2);
        });
      };
    }
    function reduceLikeFunc(funcName) {
      return function() {
        var _this3 = this;
        var adm = this[$mobx];
        adm.atom_.reportObserved();
        var dehancedValues = adm.dehanceValues_(adm.values_);
        var callback = arguments[0];
        arguments[0] = function(accumulator, currentValue, index) {
          return callback(accumulator, currentValue, index, _this3);
        };
        return dehancedValues[funcName].apply(dehancedValues, arguments);
      };
    }
    var isObservableArrayAdministration = /* @__PURE__ */ createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
    function isObservableArray(thing) {
      return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
    }
    var ObservableMapMarker = {};
    var ADD = "add";
    var DELETE = "delete";
    var ObservableMap = /* @__PURE__ */ function() {
      function ObservableMap2(initialData, enhancer_, name_) {
        var _this = this;
        if (enhancer_ === void 0) {
          enhancer_ = deepEnhancer;
        }
        if (name_ === void 0) {
          name_ = "ObservableMap";
        }
        this.enhancer_ = void 0;
        this.name_ = void 0;
        this[$mobx] = ObservableMapMarker;
        this.data_ = void 0;
        this.hasMap_ = void 0;
        this.keysAtom_ = void 0;
        this.interceptors_ = void 0;
        this.changeListeners_ = void 0;
        this.dehancer = void 0;
        this.enhancer_ = enhancer_;
        this.name_ = name_;
        if (!isFunction(Map)) {
          die(18);
        }
        initObservable(function() {
          _this.keysAtom_ = createAtom(false ? _this.name_ + ".keys()" : "ObservableMap.keys()");
          _this.data_ = /* @__PURE__ */ new Map();
          _this.hasMap_ = /* @__PURE__ */ new Map();
          if (initialData) {
            _this.merge(initialData);
          }
        });
      }
      var _proto = ObservableMap2.prototype;
      _proto.has_ = function has_(key) {
        return this.data_.has(key);
      };
      _proto.has = function has3(key) {
        var _this2 = this;
        if (!globalState.trackingDerivation) {
          return this.has_(key);
        }
        var entry = this.hasMap_.get(key);
        if (!entry) {
          var newEntry = entry = new ObservableValue(this.has_(key), referenceEnhancer, "ObservableMap.key?", false);
          this.hasMap_.set(key, newEntry);
          onBecomeUnobserved(newEntry, function() {
            return _this2.hasMap_["delete"](key);
          });
        }
        return entry.get();
      };
      _proto.set = function set5(key, value) {
        var hasKey = this.has_(key);
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            type: hasKey ? UPDATE : ADD,
            object: this,
            newValue: value,
            name: key
          });
          if (!change) {
            return this;
          }
          value = change.newValue;
        }
        if (hasKey) {
          this.updateValue_(key, value);
        } else {
          this.addValue_(key, value);
        }
        return this;
      };
      _proto["delete"] = function _delete(key) {
        var _this3 = this;
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            type: DELETE,
            object: this,
            name: key
          });
          if (!change) {
            return false;
          }
        }
        if (this.has_(key)) {
          var notifySpy = isSpyEnabled();
          var notify = hasListeners(this);
          var _change = notify || notifySpy ? {
            observableKind: "map",
            debugObjectName: this.name_,
            type: DELETE,
            object: this,
            oldValue: this.data_.get(key).value_,
            name: key
          } : null;
          transaction(function() {
            var _this3$hasMap_$get;
            _this3.keysAtom_.reportChanged();
            (_this3$hasMap_$get = _this3.hasMap_.get(key)) == null || _this3$hasMap_$get.setNewValue_(false);
            var observable2 = _this3.data_.get(key);
            observable2.setNewValue_(void 0);
            _this3.data_["delete"](key);
          });
          if (notify) {
            notifyListeners(this, _change);
          }
          return true;
        }
        return false;
      };
      _proto.updateValue_ = function updateValue_(key, newValue) {
        var observable2 = this.data_.get(key);
        newValue = observable2.prepareNewValue_(newValue);
        if (newValue !== globalState.UNCHANGED) {
          var notifySpy = isSpyEnabled();
          var notify = hasListeners(this);
          var change = notify || notifySpy ? {
            observableKind: "map",
            debugObjectName: this.name_,
            type: UPDATE,
            object: this,
            oldValue: observable2.value_,
            name: key,
            newValue
          } : null;
          observable2.setNewValue_(newValue);
          if (notify) {
            notifyListeners(this, change);
          }
        }
      };
      _proto.addValue_ = function addValue_(key, newValue) {
        var _this4 = this;
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        transaction(function() {
          var _this4$hasMap_$get;
          var observable2 = new ObservableValue(newValue, _this4.enhancer_, "ObservableMap.key", false);
          _this4.data_.set(key, observable2);
          newValue = observable2.value_;
          (_this4$hasMap_$get = _this4.hasMap_.get(key)) == null || _this4$hasMap_$get.setNewValue_(true);
          _this4.keysAtom_.reportChanged();
        });
        var notifySpy = isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy ? {
          observableKind: "map",
          debugObjectName: this.name_,
          type: ADD,
          object: this,
          name: key,
          newValue
        } : null;
        if (notify) {
          notifyListeners(this, change);
        }
      };
      _proto.get = function get4(key) {
        if (this.has(key)) {
          return this.dehanceValue_(this.data_.get(key).get());
        }
        return this.dehanceValue_(void 0);
      };
      _proto.dehanceValue_ = function dehanceValue_(value) {
        if (this.dehancer !== void 0) {
          return this.dehancer(value);
        }
        return value;
      };
      _proto.keys = function keys2() {
        this.keysAtom_.reportObserved();
        return this.data_.keys();
      };
      _proto.values = function values2() {
        var self2 = this;
        var keys2 = this.keys();
        return makeIterableForMap({
          next: function next() {
            var _keys$next = keys2.next(), done = _keys$next.done, value = _keys$next.value;
            return {
              done,
              value: done ? void 0 : self2.get(value)
            };
          }
        });
      };
      _proto.entries = function entries2() {
        var self2 = this;
        var keys2 = this.keys();
        return makeIterableForMap({
          next: function next() {
            var _keys$next2 = keys2.next(), done = _keys$next2.done, value = _keys$next2.value;
            return {
              done,
              value: done ? void 0 : [value, self2.get(value)]
            };
          }
        });
      };
      _proto[Symbol.iterator] = function() {
        return this.entries();
      };
      _proto.forEach = function forEach(callback, thisArg) {
        for (var _iterator = _createForOfIteratorHelperLoose(this), _step; !(_step = _iterator()).done; ) {
          var _step$value = _step.value, key = _step$value[0], value = _step$value[1];
          callback.call(thisArg, value, key, this);
        }
      };
      _proto.merge = function merge(other) {
        var _this5 = this;
        if (isObservableMap(other)) {
          other = new Map(other);
        }
        transaction(function() {
          if (isPlainObject(other)) {
            getPlainObjectKeys(other).forEach(function(key) {
              return _this5.set(key, other[key]);
            });
          } else if (Array.isArray(other)) {
            other.forEach(function(_ref) {
              var key = _ref[0], value = _ref[1];
              return _this5.set(key, value);
            });
          } else if (isES6Map(other)) {
            if (!isPlainES6Map(other)) {
              die(19, other);
            }
            other.forEach(function(value, key) {
              return _this5.set(key, value);
            });
          } else if (other !== null && other !== void 0) {
            die(20, other);
          }
        });
        return this;
      };
      _proto.clear = function clear2() {
        var _this6 = this;
        transaction(function() {
          untracked(function() {
            for (var _iterator2 = _createForOfIteratorHelperLoose(_this6.keys()), _step2; !(_step2 = _iterator2()).done; ) {
              var key = _step2.value;
              _this6["delete"](key);
            }
          });
        });
      };
      _proto.replace = function replace2(values2) {
        var _this7 = this;
        transaction(function() {
          var replacementMap = convertToMap(values2);
          var orderedData = /* @__PURE__ */ new Map();
          var keysReportChangedCalled = false;
          for (var _iterator3 = _createForOfIteratorHelperLoose(_this7.data_.keys()), _step3; !(_step3 = _iterator3()).done; ) {
            var key = _step3.value;
            if (!replacementMap.has(key)) {
              var deleted = _this7["delete"](key);
              if (deleted) {
                keysReportChangedCalled = true;
              } else {
                var value = _this7.data_.get(key);
                orderedData.set(key, value);
              }
            }
          }
          for (var _iterator4 = _createForOfIteratorHelperLoose(replacementMap.entries()), _step4; !(_step4 = _iterator4()).done; ) {
            var _step4$value = _step4.value, _key = _step4$value[0], _value = _step4$value[1];
            var keyExisted = _this7.data_.has(_key);
            _this7.set(_key, _value);
            if (_this7.data_.has(_key)) {
              var _value2 = _this7.data_.get(_key);
              orderedData.set(_key, _value2);
              if (!keyExisted) {
                keysReportChangedCalled = true;
              }
            }
          }
          if (!keysReportChangedCalled) {
            if (_this7.data_.size !== orderedData.size) {
              _this7.keysAtom_.reportChanged();
            } else {
              var iter1 = _this7.data_.keys();
              var iter2 = orderedData.keys();
              var next1 = iter1.next();
              var next2 = iter2.next();
              while (!next1.done) {
                if (next1.value !== next2.value) {
                  _this7.keysAtom_.reportChanged();
                  break;
                }
                next1 = iter1.next();
                next2 = iter2.next();
              }
            }
          }
          _this7.data_ = orderedData;
        });
        return this;
      };
      _proto.toString = function toString2() {
        return "[object ObservableMap]";
      };
      _proto.toJSON = function toJSON2() {
        return Array.from(this);
      };
      _proto.observe_ = function observe_(listener, fireImmediately) {
        return registerListener(this, listener);
      };
      _proto.intercept_ = function intercept_(handler) {
        return registerInterceptor(this, handler);
      };
      return _createClass(ObservableMap2, [{
        key: "size",
        get: function get4() {
          this.keysAtom_.reportObserved();
          return this.data_.size;
        }
      }, {
        key: Symbol.toStringTag,
        get: function get4() {
          return "Map";
        }
      }]);
    }();
    var isObservableMap = /* @__PURE__ */ createInstanceofPredicate("ObservableMap", ObservableMap);
    function makeIterableForMap(iterator) {
      iterator[Symbol.toStringTag] = "MapIterator";
      return makeIterable(iterator);
    }
    function convertToMap(dataStructure) {
      if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
        return dataStructure;
      } else if (Array.isArray(dataStructure)) {
        return new Map(dataStructure);
      } else if (isPlainObject(dataStructure)) {
        var map2 = /* @__PURE__ */ new Map();
        for (var key in dataStructure) {
          map2.set(key, dataStructure[key]);
        }
        return map2;
      } else {
        return die(21, dataStructure);
      }
    }
    var ObservableSetMarker = {};
    var ObservableSet = /* @__PURE__ */ function() {
      function ObservableSet2(initialData, enhancer, name_) {
        var _this = this;
        if (enhancer === void 0) {
          enhancer = deepEnhancer;
        }
        if (name_ === void 0) {
          name_ = "ObservableSet";
        }
        this.name_ = void 0;
        this[$mobx] = ObservableSetMarker;
        this.data_ = /* @__PURE__ */ new Set();
        this.atom_ = void 0;
        this.changeListeners_ = void 0;
        this.interceptors_ = void 0;
        this.dehancer = void 0;
        this.enhancer_ = void 0;
        this.name_ = name_;
        if (!isFunction(Set)) {
          die(22);
        }
        this.enhancer_ = function(newV, oldV) {
          return enhancer(newV, oldV, name_);
        };
        initObservable(function() {
          _this.atom_ = createAtom(_this.name_);
          if (initialData) {
            _this.replace(initialData);
          }
        });
      }
      var _proto = ObservableSet2.prototype;
      _proto.dehanceValue_ = function dehanceValue_(value) {
        if (this.dehancer !== void 0) {
          return this.dehancer(value);
        }
        return value;
      };
      _proto.clear = function clear2() {
        var _this2 = this;
        transaction(function() {
          untracked(function() {
            for (var _iterator = _createForOfIteratorHelperLoose(_this2.data_.values()), _step; !(_step = _iterator()).done; ) {
              var value = _step.value;
              _this2["delete"](value);
            }
          });
        });
      };
      _proto.forEach = function forEach(callbackFn, thisArg) {
        for (var _iterator2 = _createForOfIteratorHelperLoose(this), _step2; !(_step2 = _iterator2()).done; ) {
          var value = _step2.value;
          callbackFn.call(thisArg, value, value, this);
        }
      };
      _proto.add = function add(value) {
        var _this3 = this;
        checkIfStateModificationsAreAllowed(this.atom_);
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            type: ADD,
            object: this,
            newValue: value
          });
          if (!change) {
            return this;
          }
          value = change.newValue;
        }
        if (!this.has(value)) {
          transaction(function() {
            _this3.data_.add(_this3.enhancer_(value, void 0));
            _this3.atom_.reportChanged();
          });
          var notifySpy = false;
          var notify = hasListeners(this);
          var _change = notify || notifySpy ? {
            observableKind: "set",
            debugObjectName: this.name_,
            type: ADD,
            object: this,
            newValue: value
          } : null;
          if (notify) {
            notifyListeners(this, _change);
          }
        }
        return this;
      };
      _proto["delete"] = function _delete(value) {
        var _this4 = this;
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            type: DELETE,
            object: this,
            oldValue: value
          });
          if (!change) {
            return false;
          }
        }
        if (this.has(value)) {
          var notifySpy = false;
          var notify = hasListeners(this);
          var _change2 = notify || notifySpy ? {
            observableKind: "set",
            debugObjectName: this.name_,
            type: DELETE,
            object: this,
            oldValue: value
          } : null;
          transaction(function() {
            _this4.atom_.reportChanged();
            _this4.data_["delete"](value);
          });
          if (notify) {
            notifyListeners(this, _change2);
          }
          return true;
        }
        return false;
      };
      _proto.has = function has3(value) {
        this.atom_.reportObserved();
        return this.data_.has(this.dehanceValue_(value));
      };
      _proto.entries = function entries2() {
        var values2 = this.values();
        return makeIterableForSet({
          next: function next() {
            var _values$next = values2.next(), value = _values$next.value, done = _values$next.done;
            return !done ? {
              value: [value, value],
              done
            } : {
              value: void 0,
              done
            };
          }
        });
      };
      _proto.keys = function keys2() {
        return this.values();
      };
      _proto.values = function values2() {
        this.atom_.reportObserved();
        var self2 = this;
        var values3 = this.data_.values();
        return makeIterableForSet({
          next: function next() {
            var _values$next2 = values3.next(), value = _values$next2.value, done = _values$next2.done;
            return !done ? {
              value: self2.dehanceValue_(value),
              done
            } : {
              value: void 0,
              done
            };
          }
        });
      };
      _proto.intersection = function intersection(otherSet) {
        if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
          return otherSet.intersection(this);
        } else {
          var dehancedSet = new Set(this);
          return dehancedSet.intersection(otherSet);
        }
      };
      _proto.union = function union(otherSet) {
        if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
          return otherSet.union(this);
        } else {
          var dehancedSet = new Set(this);
          return dehancedSet.union(otherSet);
        }
      };
      _proto.difference = function difference(otherSet) {
        return new Set(this).difference(otherSet);
      };
      _proto.symmetricDifference = function symmetricDifference(otherSet) {
        if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
          return otherSet.symmetricDifference(this);
        } else {
          var dehancedSet = new Set(this);
          return dehancedSet.symmetricDifference(otherSet);
        }
      };
      _proto.isSubsetOf = function isSubsetOf(otherSet) {
        return new Set(this).isSubsetOf(otherSet);
      };
      _proto.isSupersetOf = function isSupersetOf(otherSet) {
        return new Set(this).isSupersetOf(otherSet);
      };
      _proto.isDisjointFrom = function isDisjointFrom(otherSet) {
        if (isES6Set(otherSet) && !isObservableSet(otherSet)) {
          return otherSet.isDisjointFrom(this);
        } else {
          var dehancedSet = new Set(this);
          return dehancedSet.isDisjointFrom(otherSet);
        }
      };
      _proto.replace = function replace2(other) {
        var _this5 = this;
        if (isObservableSet(other)) {
          other = new Set(other);
        }
        transaction(function() {
          if (Array.isArray(other)) {
            _this5.clear();
            other.forEach(function(value) {
              return _this5.add(value);
            });
          } else if (isES6Set(other)) {
            _this5.clear();
            other.forEach(function(value) {
              return _this5.add(value);
            });
          } else if (other !== null && other !== void 0) {
            die("Cannot initialize set from " + other);
          }
        });
        return this;
      };
      _proto.observe_ = function observe_(listener, fireImmediately) {
        return registerListener(this, listener);
      };
      _proto.intercept_ = function intercept_(handler) {
        return registerInterceptor(this, handler);
      };
      _proto.toJSON = function toJSON2() {
        return Array.from(this);
      };
      _proto.toString = function toString2() {
        return "[object ObservableSet]";
      };
      _proto[Symbol.iterator] = function() {
        return this.values();
      };
      return _createClass(ObservableSet2, [{
        key: "size",
        get: function get4() {
          this.atom_.reportObserved();
          return this.data_.size;
        }
      }, {
        key: Symbol.toStringTag,
        get: function get4() {
          return "Set";
        }
      }]);
    }();
    var isObservableSet = /* @__PURE__ */ createInstanceofPredicate("ObservableSet", ObservableSet);
    function makeIterableForSet(iterator) {
      iterator[Symbol.toStringTag] = "SetIterator";
      return makeIterable(iterator);
    }
    var descriptorCache = /* @__PURE__ */ Object.create(null);
    var REMOVE = "remove";
    var ObservableObjectAdministration = /* @__PURE__ */ function() {
      function ObservableObjectAdministration2(target_, values_, name_, defaultAnnotation_) {
        if (values_ === void 0) {
          values_ = /* @__PURE__ */ new Map();
        }
        if (defaultAnnotation_ === void 0) {
          defaultAnnotation_ = autoAnnotation;
        }
        this.target_ = void 0;
        this.values_ = void 0;
        this.name_ = void 0;
        this.defaultAnnotation_ = void 0;
        this.keysAtom_ = void 0;
        this.changeListeners_ = void 0;
        this.interceptors_ = void 0;
        this.proxy_ = void 0;
        this.isPlainObject_ = void 0;
        this.appliedAnnotations_ = void 0;
        this.pendingKeys_ = void 0;
        this.target_ = target_;
        this.values_ = values_;
        this.name_ = name_;
        this.defaultAnnotation_ = defaultAnnotation_;
        this.keysAtom_ = new Atom("ObservableObject.keys");
        this.isPlainObject_ = isPlainObject(this.target_);
      }
      var _proto = ObservableObjectAdministration2.prototype;
      _proto.getObservablePropValue_ = function getObservablePropValue_(key) {
        return this.values_.get(key).get();
      };
      _proto.setObservablePropValue_ = function setObservablePropValue_(key, newValue) {
        var observable2 = this.values_.get(key);
        if (observable2 instanceof ComputedValue) {
          observable2.set(newValue);
          return true;
        }
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            type: UPDATE,
            object: this.proxy_ || this.target_,
            name: key,
            newValue
          });
          if (!change) {
            return null;
          }
          newValue = change.newValue;
        }
        newValue = observable2.prepareNewValue_(newValue);
        if (newValue !== globalState.UNCHANGED) {
          var notify = hasListeners(this);
          var notifySpy = false;
          var _change = notify || notifySpy ? {
            type: UPDATE,
            observableKind: "object",
            debugObjectName: this.name_,
            object: this.proxy_ || this.target_,
            oldValue: observable2.value_,
            name: key,
            newValue
          } : null;
          observable2.setNewValue_(newValue);
          if (notify) {
            notifyListeners(this, _change);
          }
        }
        return true;
      };
      _proto.get_ = function get_(key) {
        if (globalState.trackingDerivation && !hasProp(this.target_, key)) {
          this.has_(key);
        }
        return this.target_[key];
      };
      _proto.set_ = function set_(key, value, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        if (hasProp(this.target_, key)) {
          if (this.values_.has(key)) {
            return this.setObservablePropValue_(key, value);
          } else if (proxyTrap) {
            return Reflect.set(this.target_, key, value);
          } else {
            this.target_[key] = value;
            return true;
          }
        } else {
          return this.extend_(key, {
            value,
            enumerable: true,
            writable: true,
            configurable: true
          }, this.defaultAnnotation_, proxyTrap);
        }
      };
      _proto.has_ = function has_(key) {
        if (!globalState.trackingDerivation) {
          return key in this.target_;
        }
        this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
        var entry = this.pendingKeys_.get(key);
        if (!entry) {
          entry = new ObservableValue(key in this.target_, referenceEnhancer, "ObservableObject.key?", false);
          this.pendingKeys_.set(key, entry);
        }
        return entry.get();
      };
      _proto.make_ = function make_2(key, annotation) {
        if (annotation === true) {
          annotation = this.defaultAnnotation_;
        }
        if (annotation === false) {
          return;
        }
        if (!(key in this.target_)) {
          var _this$target_$storedA;
          if ((_this$target_$storedA = this.target_[storedAnnotationsSymbol]) != null && _this$target_$storedA[key]) {
            return;
          } else {
            die(1, annotation.annotationType_, this.name_ + "." + key.toString());
          }
        }
        var source = this.target_;
        while (source && source !== objectPrototype) {
          var descriptor = getDescriptor(source, key);
          if (descriptor) {
            var outcome = annotation.make_(this, key, descriptor, source);
            if (outcome === 0) {
              return;
            }
            if (outcome === 1) {
              break;
            }
          }
          source = Object.getPrototypeOf(source);
        }
        recordAnnotationApplied(this, annotation, key);
      };
      _proto.extend_ = function extend_2(key, descriptor, annotation, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        if (annotation === true) {
          annotation = this.defaultAnnotation_;
        }
        if (annotation === false) {
          return this.defineProperty_(key, descriptor, proxyTrap);
        }
        var outcome = annotation.extend_(this, key, descriptor, proxyTrap);
        if (outcome) {
          recordAnnotationApplied(this, annotation, key);
        }
        return outcome;
      };
      _proto.defineProperty_ = function defineProperty_(key, descriptor, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        try {
          startBatch();
          var deleteOutcome = this.delete_(key);
          if (!deleteOutcome) {
            return deleteOutcome;
          }
          if (hasInterceptors(this)) {
            var change = interceptChange(this, {
              object: this.proxy_ || this.target_,
              name: key,
              type: ADD,
              newValue: descriptor.value
            });
            if (!change) {
              return null;
            }
            var newValue = change.newValue;
            if (descriptor.value !== newValue) {
              descriptor = _extends({}, descriptor, {
                value: newValue
              });
            }
          }
          if (proxyTrap) {
            if (!Reflect.defineProperty(this.target_, key, descriptor)) {
              return false;
            }
          } else {
            defineProperty(this.target_, key, descriptor);
          }
          this.notifyPropertyAddition_(key, descriptor.value);
        } finally {
          endBatch();
        }
        return true;
      };
      _proto.defineObservableProperty_ = function defineObservableProperty_(key, value, enhancer, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        try {
          startBatch();
          var deleteOutcome = this.delete_(key);
          if (!deleteOutcome) {
            return deleteOutcome;
          }
          if (hasInterceptors(this)) {
            var change = interceptChange(this, {
              object: this.proxy_ || this.target_,
              name: key,
              type: ADD,
              newValue: value
            });
            if (!change) {
              return null;
            }
            value = change.newValue;
          }
          var cachedDescriptor = getCachedObservablePropDescriptor(key);
          var descriptor = {
            configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
            enumerable: true,
            get: cachedDescriptor.get,
            set: cachedDescriptor.set
          };
          if (proxyTrap) {
            if (!Reflect.defineProperty(this.target_, key, descriptor)) {
              return false;
            }
          } else {
            defineProperty(this.target_, key, descriptor);
          }
          var observable2 = new ObservableValue(value, enhancer, false ? this.name_ + "." + key.toString() : "ObservableObject.key", false);
          this.values_.set(key, observable2);
          this.notifyPropertyAddition_(key, observable2.value_);
        } finally {
          endBatch();
        }
        return true;
      };
      _proto.defineComputedProperty_ = function defineComputedProperty_(key, options, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        try {
          startBatch();
          var deleteOutcome = this.delete_(key);
          if (!deleteOutcome) {
            return deleteOutcome;
          }
          if (hasInterceptors(this)) {
            var change = interceptChange(this, {
              object: this.proxy_ || this.target_,
              name: key,
              type: ADD,
              newValue: void 0
            });
            if (!change) {
              return null;
            }
          }
          options.name || (options.name = false ? this.name_ + "." + key.toString() : "ObservableObject.key");
          options.context = this.proxy_ || this.target_;
          var cachedDescriptor = getCachedObservablePropDescriptor(key);
          var descriptor = {
            configurable: globalState.safeDescriptors ? this.isPlainObject_ : true,
            enumerable: false,
            get: cachedDescriptor.get,
            set: cachedDescriptor.set
          };
          if (proxyTrap) {
            if (!Reflect.defineProperty(this.target_, key, descriptor)) {
              return false;
            }
          } else {
            defineProperty(this.target_, key, descriptor);
          }
          this.values_.set(key, new ComputedValue(options));
          this.notifyPropertyAddition_(key, void 0);
        } finally {
          endBatch();
        }
        return true;
      };
      _proto.delete_ = function delete_(key, proxyTrap) {
        if (proxyTrap === void 0) {
          proxyTrap = false;
        }
        checkIfStateModificationsAreAllowed(this.keysAtom_);
        if (!hasProp(this.target_, key)) {
          return true;
        }
        if (hasInterceptors(this)) {
          var change = interceptChange(this, {
            object: this.proxy_ || this.target_,
            name: key,
            type: REMOVE
          });
          if (!change) {
            return null;
          }
        }
        try {
          var _this$pendingKeys_;
          startBatch();
          var notify = hasListeners(this);
          var notifySpy = false;
          var observable2 = this.values_.get(key);
          var value = void 0;
          if (!observable2 && (notify || notifySpy)) {
            var _getDescriptor2;
            value = (_getDescriptor2 = getDescriptor(this.target_, key)) == null ? void 0 : _getDescriptor2.value;
          }
          if (proxyTrap) {
            if (!Reflect.deleteProperty(this.target_, key)) {
              return false;
            }
          } else {
            delete this.target_[key];
          }
          if (false) ;
          if (observable2) {
            this.values_["delete"](key);
            if (observable2 instanceof ObservableValue) {
              value = observable2.value_;
            }
            propagateChanged(observable2);
          }
          this.keysAtom_.reportChanged();
          (_this$pendingKeys_ = this.pendingKeys_) == null || (_this$pendingKeys_ = _this$pendingKeys_.get(key)) == null || _this$pendingKeys_.set(key in this.target_);
          if (notify || notifySpy) {
            var _change2 = {
              type: REMOVE,
              observableKind: "object",
              object: this.proxy_ || this.target_,
              debugObjectName: this.name_,
              oldValue: value,
              name: key
            };
            if (false) ;
            if (notify) {
              notifyListeners(this, _change2);
            }
            if (false) ;
          }
        } finally {
          endBatch();
        }
        return true;
      };
      _proto.observe_ = function observe_(callback, fireImmediately) {
        return registerListener(this, callback);
      };
      _proto.intercept_ = function intercept_(handler) {
        return registerInterceptor(this, handler);
      };
      _proto.notifyPropertyAddition_ = function notifyPropertyAddition_(key, value) {
        var _this$pendingKeys_2;
        var notify = hasListeners(this);
        var notifySpy = false;
        if (notify || notifySpy) {
          var change = notify || notifySpy ? {
            type: ADD,
            observableKind: "object",
            debugObjectName: this.name_,
            object: this.proxy_ || this.target_,
            name: key,
            newValue: value
          } : null;
          if (notify) {
            notifyListeners(this, change);
          }
        }
        (_this$pendingKeys_2 = this.pendingKeys_) == null || (_this$pendingKeys_2 = _this$pendingKeys_2.get(key)) == null || _this$pendingKeys_2.set(true);
        this.keysAtom_.reportChanged();
      };
      _proto.ownKeys_ = function ownKeys_() {
        this.keysAtom_.reportObserved();
        return ownKeys(this.target_);
      };
      _proto.keys_ = function keys_() {
        this.keysAtom_.reportObserved();
        return Object.keys(this.target_);
      };
      return ObservableObjectAdministration2;
    }();
    function asObservableObject(target, options) {
      var _options$name;
      if (hasProp(target, $mobx)) {
        return target;
      }
      var name = (_options$name = options == null ? void 0 : options.name) != null ? _options$name : "ObservableObject";
      var adm = new ObservableObjectAdministration(target, /* @__PURE__ */ new Map(), String(name), getAnnotationFromOptions(options));
      addHiddenProp(target, $mobx, adm);
      return target;
    }
    var isObservableObjectAdministration = /* @__PURE__ */ createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
    function getCachedObservablePropDescriptor(key) {
      return descriptorCache[key] || (descriptorCache[key] = {
        get: function get4() {
          return this[$mobx].getObservablePropValue_(key);
        },
        set: function set5(value) {
          return this[$mobx].setObservablePropValue_(key, value);
        }
      });
    }
    function isObservableObject(thing) {
      if (isObject(thing)) {
        return isObservableObjectAdministration(thing[$mobx]);
      }
      return false;
    }
    function recordAnnotationApplied(adm, annotation, key) {
      var _adm$target_$storedAn;
      (_adm$target_$storedAn = adm.target_[storedAnnotationsSymbol]) == null || delete _adm$target_$storedAn[key];
    }
    var ENTRY_0 = /* @__PURE__ */ createArrayEntryDescriptor(0);
    var safariPrototypeSetterInheritanceBug = /* @__PURE__ */ function() {
      var v2 = false;
      var p2 = {};
      Object.defineProperty(p2, "0", {
        set: function set5() {
          v2 = true;
        }
      });
      Object.create(p2)["0"] = 1;
      return v2 === false;
    }();
    var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
    var StubArray = function StubArray2() {
    };
    function inherit(ctor, proto) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(ctor.prototype, proto);
      } else if (ctor.prototype.__proto__ !== void 0) {
        ctor.prototype.__proto__ = proto;
      } else {
        ctor.prototype = proto;
      }
    }
    inherit(StubArray, Array.prototype);
    var LegacyObservableArray = /* @__PURE__ */ function(_StubArray) {
      function LegacyObservableArray2(initialValues, enhancer, name, owned) {
        var _this;
        if (name === void 0) {
          name = "ObservableArray";
        }
        if (owned === void 0) {
          owned = false;
        }
        _this = _StubArray.call(this) || this;
        initObservable(function() {
          var adm = new ObservableArrayAdministration(name, enhancer, owned, true);
          adm.proxy_ = _this;
          addHiddenFinalProp(_this, $mobx, adm);
          if (initialValues && initialValues.length) {
            _this.spliceWithArray(0, 0, initialValues);
          }
          if (safariPrototypeSetterInheritanceBug) {
            Object.defineProperty(_this, "0", ENTRY_0);
          }
        });
        return _this;
      }
      _inheritsLoose(LegacyObservableArray2, _StubArray);
      var _proto = LegacyObservableArray2.prototype;
      _proto.concat = function concat() {
        this[$mobx].atom_.reportObserved();
        for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
          arrays[_key] = arguments[_key];
        }
        return Array.prototype.concat.apply(
          this.slice(),
          //@ts-ignore
          arrays.map(function(a) {
            return isObservableArray(a) ? a.slice() : a;
          })
        );
      };
      _proto[Symbol.iterator] = function() {
        var self2 = this;
        var nextIndex = 0;
        return makeIterable({
          next: function next() {
            return nextIndex < self2.length ? {
              value: self2[nextIndex++],
              done: false
            } : {
              done: true,
              value: void 0
            };
          }
        });
      };
      return _createClass(LegacyObservableArray2, [{
        key: "length",
        get: function get4() {
          return this[$mobx].getArrayLength_();
        },
        set: function set5(newLength) {
          this[$mobx].setArrayLength_(newLength);
        }
      }, {
        key: Symbol.toStringTag,
        get: function get4() {
          return "Array";
        }
      }]);
    }(StubArray);
    Object.entries(arrayExtensions).forEach(function(_ref) {
      var prop = _ref[0], fn = _ref[1];
      if (prop !== "concat") {
        addHiddenProp(LegacyObservableArray.prototype, prop, fn);
      }
    });
    function createArrayEntryDescriptor(index) {
      return {
        enumerable: false,
        configurable: true,
        get: function get4() {
          return this[$mobx].get_(index);
        },
        set: function set5(value) {
          this[$mobx].set_(index, value);
        }
      };
    }
    function createArrayBufferItem(index) {
      defineProperty(LegacyObservableArray.prototype, "" + index, createArrayEntryDescriptor(index));
    }
    function reserveArrayBuffer(max) {
      if (max > OBSERVABLE_ARRAY_BUFFER_SIZE) {
        for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max + 100; index++) {
          createArrayBufferItem(index);
        }
        OBSERVABLE_ARRAY_BUFFER_SIZE = max;
      }
    }
    reserveArrayBuffer(1e3);
    function createLegacyArray(initialValues, enhancer, name) {
      return new LegacyObservableArray(initialValues, enhancer, name);
    }
    function getAtom(thing, property) {
      if (typeof thing === "object" && thing !== null) {
        if (isObservableArray(thing)) {
          if (property !== void 0) {
            die(23);
          }
          return thing[$mobx].atom_;
        }
        if (isObservableSet(thing)) {
          return thing.atom_;
        }
        if (isObservableMap(thing)) {
          if (property === void 0) {
            return thing.keysAtom_;
          }
          var observable2 = thing.data_.get(property) || thing.hasMap_.get(property);
          if (!observable2) {
            die(25, property, getDebugName(thing));
          }
          return observable2;
        }
        if (isObservableObject(thing)) {
          if (!property) {
            return die(26);
          }
          var _observable = thing[$mobx].values_.get(property);
          if (!_observable) {
            die(27, property, getDebugName(thing));
          }
          return _observable;
        }
        if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
          return thing;
        }
      } else if (isFunction(thing)) {
        if (isReaction(thing[$mobx])) {
          return thing[$mobx];
        }
      }
      die(28);
    }
    function getAdministration(thing, property) {
      if (!thing) {
        die(29);
      }
      if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
        return thing;
      }
      if (isObservableMap(thing) || isObservableSet(thing)) {
        return thing;
      }
      if (thing[$mobx]) {
        return thing[$mobx];
      }
      die(24, thing);
    }
    function getDebugName(thing, property) {
      var named;
      if (property !== void 0) {
        named = getAtom(thing, property);
      } else if (isAction(thing)) {
        return thing.name;
      } else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) {
        named = getAdministration(thing);
      } else {
        named = getAtom(thing);
      }
      return named.name_;
    }
    function initObservable(cb2) {
      var derivation = untrackedStart();
      var allowStateChanges2 = allowStateChangesStart(true);
      startBatch();
      try {
        return cb2();
      } finally {
        endBatch();
        allowStateChangesEnd(allowStateChanges2);
        untrackedEnd(derivation);
      }
    }
    var toString = objectPrototype.toString;
    function deepEqual(a, b, depth) {
      if (depth === void 0) {
        depth = -1;
      }
      return eq(a, b, depth);
    }
    function eq(a, b, depth, aStack, bStack) {
      if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
      }
      if (a == null || b == null) {
        return false;
      }
      if (a !== a) {
        return b !== b;
      }
      var type = typeof a;
      if (type !== "function" && type !== "object" && typeof b != "object") {
        return false;
      }
      var className = toString.call(a);
      if (className !== toString.call(b)) {
        return false;
      }
      switch (className) {
        case "[object RegExp]":
        case "[object String]":
          return "" + a === "" + b;
        case "[object Number]":
          if (+a !== +a) {
            return +b !== +b;
          }
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
          return +a === +b;
        case "[object Symbol]":
          return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);
        case "[object Map]":
        case "[object Set]":
          if (depth >= 0) {
            depth++;
          }
          break;
      }
      a = unwrap(a);
      b = unwrap(b);
      var areArrays = className === "[object Array]";
      if (!areArrays) {
        if (typeof a != "object" || typeof b != "object") {
          return false;
        }
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
          return false;
        }
      }
      if (depth === 0) {
        return false;
      } else if (depth < 0) {
        depth = -1;
      }
      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
      while (length--) {
        if (aStack[length] === a) {
          return bStack[length] === b;
        }
      }
      aStack.push(a);
      bStack.push(b);
      if (areArrays) {
        length = a.length;
        if (length !== b.length) {
          return false;
        }
        while (length--) {
          if (!eq(a[length], b[length], depth - 1, aStack, bStack)) {
            return false;
          }
        }
      } else {
        var keys2 = Object.keys(a);
        var _length = keys2.length;
        if (Object.keys(b).length !== _length) {
          return false;
        }
        for (var i = 0; i < _length; i++) {
          var key = keys2[i];
          if (!(hasProp(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack))) {
            return false;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return true;
    }
    function unwrap(a) {
      if (isObservableArray(a)) {
        return a.slice();
      }
      if (isES6Map(a) || isObservableMap(a)) {
        return Array.from(a.entries());
      }
      if (isES6Set(a) || isObservableSet(a)) {
        return Array.from(a.entries());
      }
      return a;
    }
    var _getGlobal$Iterator;
    var maybeIteratorPrototype = ((_getGlobal$Iterator = getGlobal().Iterator) == null ? void 0 : _getGlobal$Iterator.prototype) || {};
    function makeIterable(iterator) {
      iterator[Symbol.iterator] = getSelf;
      return Object.assign(Object.create(maybeIteratorPrototype), iterator);
    }
    function getSelf() {
      return this;
    }
    ["Symbol", "Map", "Set"].forEach(function(m2) {
      var g = getGlobal();
      if (typeof g[m2] === "undefined") {
        die("MobX requires global '" + m2 + "' to be available or polyfilled");
      }
    });
    if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
      __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy,
        extras: {
          getDebugName
        },
        $mobx
      });
    }
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __decorateClass = (decorators, target, key, kind) => {
      var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
      for (var i = decorators.length - 1, decorator; i >= 0; i--)
        if (decorator = decorators[i])
          result = (kind ? decorator(target, key, result) : decorator(result)) || result;
      if (kind && result) __defProp2(target, key, result);
      return result;
    };
    class MainStore {
      constructor() {
        __publicField(this, "_initSetting", [
          {
            key: "chat_style",
            value: 0
          },
          {
            key: "enable",
            value: true
          },
          {
            key: "overlay_view_count",
            value: 10
          },
          {
            key: "defalut_chat_enable",
            value: true
          },
          {
            key: "show_nicknames",
            value: true
          },
          // 오버레이
          {
            key: "overlay_background_opacity",
            value: 0
          },
          {
            key: "overlay_chat_opacity",
            value: 50
          },
          {
            key: "overlay_background_area",
            value: 0
          },
          {
            key: "overlay_random_username",
            value: true
          },
          {
            key: "overlay_view_width",
            value: 500
          },
          {
            key: "overlay_sort_chat_messages",
            value: false
          },
          {
            key: "overlay_font_size",
            value: 14
          },
          {
            key: "overlay_chat_background",
            value: true
          },
          {
            key: "overlay_background",
            value: false
          },
          // 프레임
          {
            key: "frame_chat_position",
            value: 1
          },
          {
            key: "frame_random_username",
            value: true
          },
          {
            key: "frame_chat_background",
            value: true
          },
          {
            key: "frame_view_count",
            value: 3
          },
          {
            key: "frame_chat_opacity",
            value: 50
          },
          {
            key: "frame_background_opacity",
            value: 70
          },
          {
            key: "frame_background_area",
            value: 0
          },
          {
            key: "frame_view_width",
            value: 500
          },
          {
            key: "frame_sort_chat_messages",
            value: false
          },
          {
            key: "frame_font_size",
            value: 14
          },
          {
            key: "frame_background",
            value: false
          },
          {
            key: "frame_offset_x",
            value: 14
          },
          {
            key: "frame_offset_y",
            value: 14
          }
        ]);
        __publicField(this, "_setting", /* @__PURE__ */ new Map());
        __publicField(this, "_chats", []);
        __publicField(this, "_maxChats", 20);
        __publicField(this, "init", () => {
          for (const setting of this.initSetting) {
            this.setting.set(setting.key, setting.value);
          }
        });
        __publicField(this, "setSetting", (key, value, save) => {
          this.setting.set(key, value);
          save && GM_setValue(key, value);
        });
        __publicField(this, "addChat", (chat) => {
          this.chats.push(chat);
          if (this.chats.length >= this.maxChats)
            this.chats.shift();
        });
        __publicField(this, "lastChat", () => {
          return this.chats[this.chats.length - 1];
        });
        makeObservable(this);
        this.init();
      }
      get initSetting() {
        return this._initSetting;
      }
      get setting() {
        return this._setting;
      }
      get chats() {
        return this._chats;
      }
      get maxChats() {
        return this._maxChats;
      }
    }
    __decorateClass([
      observable
    ], MainStore.prototype, "_setting", 2);
    __decorateClass([
      observable
    ], MainStore.prototype, "_chats", 2);
    __decorateClass([
      observable
    ], MainStore.prototype, "_maxChats", 2);
    __decorateClass([
      action
    ], MainStore.prototype, "init", 2);
    __decorateClass([
      action
    ], MainStore.prototype, "setSetting", 2);
    __decorateClass([
      action
    ], MainStore.prototype, "addChat", 2);
    __decorateClass([
      action
    ], MainStore.prototype, "lastChat", 2);
    __decorateClass([
      computed
    ], MainStore.prototype, "initSetting", 1);
    __decorateClass([
      computed
    ], MainStore.prototype, "setting", 1);
    __decorateClass([
      computed
    ], MainStore.prototype, "chats", 1);
    __decorateClass([
      computed
    ], MainStore.prototype, "maxChats", 1);
    class RootStore {
      constructor() {
        __publicField(this, "mainStore");
        this.mainStore = new MainStore();
      }
    }
    const rootStore = new RootStore();
    const StoreContext = reactExports.createContext(void 0);
    const useRootStore = () => {
      const context = reactExports.useContext(StoreContext);
      if (context == void 0) throw new Error("useRootStore must be used within RootStoreProvider");
      return context;
    };
    const useMainStore = () => {
      const { mainStore } = useRootStore();
      return mainStore;
    };
    const StoreProvider = ({ children }) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StoreContext.Provider, { value: rootStore, children });
    };
    const SettingMenuComponent = ({
      toggleSetting
    }) => {
      const mainStore = useMainStore();
      const id2 = "chatStylerSetting";
      const addViewChat = () => {
        const isAdd = document.getElementById("new_btn_chat");
        if (isAdd) return;
        const oldElements = document.getElementsByClassName("btn_chat");
        if (oldElements.length > 0) {
          const oldElement = oldElements[0];
          if (oldElement && oldElement.parentElement) {
            const newLiElement = document.createElement("li");
            newLiElement.className = "btn_chat";
            newLiElement.style.display = "block";
            newLiElement.id = "new_btn_chat";
            const newButtonElement = document.createElement("button");
            newButtonElement.type = "button";
            const newSpanElement = document.createElement("span");
            newSpanElement.textContent = "채팅창 on/off";
            newButtonElement.appendChild(newSpanElement);
            newLiElement.onclick = () => {
              mainStore.setSetting("defalut_chat_enable", !mainStore.setting.get("defalut_chat_enable"), true);
            };
            newLiElement.appendChild(newButtonElement);
            oldElement.parentElement.insertBefore(newLiElement, oldElement.nextSibling);
          } else {
            console.error("btn_chat 클래스를 가진 요소의 부모를 찾을 수 없습니다.");
          }
        } else {
          console.error("btn_chat 클래스를 가진 요소를 찾을 수 없습니다.");
        }
      };
      const addViewChatBox = () => {
        const isAdd = document.getElementById("new_setbox_close");
        if (isAdd) return;
        const oldElement = document.getElementById("setbox_close");
        if (oldElement && oldElement.parentElement) {
          oldElement.style.display = "none";
          const newLiElement = document.createElement("li");
          newLiElement.className = "close";
          newLiElement.id = "new_setbox_close";
          const newAnchorElement = document.createElement("a");
          newAnchorElement.className = "tip-right";
          newAnchorElement.setAttribute("tip", "닫기");
          newAnchorElement.textContent = "새로운 채팅 영역 숨기기";
          newLiElement.appendChild(newAnchorElement);
          newLiElement.onclick = () => {
            mainStore.setSetting("defalut_chat_enable", !mainStore.setting.get("defalut_chat_enable"), true);
          };
          oldElement.parentElement.insertBefore(newLiElement, oldElement.nextSibling);
        } else {
          console.error("setbox_close 요소 또는 부모 요소를 찾을 수 없습니다.");
        }
      };
      reactExports.useEffect(() => {
        addViewChat();
        addViewChatBox();
      }, []);
      reactExports.useEffect(() => {
        const checkAndInsertElement = () => {
          const serviceUtilElement = document.querySelector(".serviceUtil");
          if (!serviceUtilElement) {
            setTimeout(checkAndInsertElement, 1e3);
            return;
          }
          const existingItem = document.getElementById(id2);
          if (existingItem)
            existingItem.remove();
          const newDivElement = document.createElement("div");
          newDivElement.id = id2;
          newDivElement.className = styles$8.SettingMenu;
          const buttonElement = document.createElement("button");
          buttonElement.setAttribute("tip", "채팅 스타일러 설정");
          const spanElement = document.createElement("p");
          spanElement.textContent = "S";
          buttonElement.appendChild(spanElement);
          newDivElement.appendChild(buttonElement);
          serviceUtilElement.insertBefore(newDivElement, serviceUtilElement.firstChild);
          newDivElement.addEventListener("click", toggleSetting);
          return () => {
            newDivElement.removeEventListener("click", toggleSetting);
          };
        };
        checkAndInsertElement();
      }, []);
      return null;
    };
    const SettingTemplate$1 = "_SettingTemplate_6q8n6_1";
    const View$3 = "_View_6q8n6_17";
    const Header = "_Header_6q8n6_20";
    const Title = "_Title_6q8n6_31";
    const Menus$1 = "_Menus_6q8n6_34";
    const Menu$1 = "_Menu_6q8n6_34";
    const Content = "_Content_6q8n6_55";
    const styles$7 = {
      SettingTemplate: SettingTemplate$1,
      View: View$3,
      Header,
      Title,
      Menus: Menus$1,
      Menu: Menu$1,
      Content
    };
    const classes = (...classes2) => {
      return classes2.filter(Boolean).join(" ");
    };
    function log(...args) {
      console.log(
        "%cUserscript (React Mode):",
        "color: purple; font-weight: bold",
        ...args
      );
    }
    function addLocationChangeCallback(callback) {
      window.setTimeout(callback, 0);
      let oldHref = window.location.href;
      const body = document.querySelector("body");
      if (!body) {
        throw new Error("Body element not found.");
      }
      const observer2 = new MutationObserver((mutations) => {
        if (mutations.some(() => oldHref !== document.location.href)) {
          oldHref = document.location.href;
          callback();
        }
      });
      observer2.observe(body, { childList: true, subtree: true });
      return observer2;
    }
    async function awaitElement(selector) {
      const MAX_TRIES = 60;
      let tries = 0;
      return new Promise((resolve, reject) => {
        function probe() {
          tries++;
          return document.querySelector(selector);
        }
        function delayedProbe() {
          if (tries >= MAX_TRIES) {
            log("Can't find element with selector", selector);
            reject(new Error(`Element with selector "${selector}" not found after ${MAX_TRIES} tries.`));
            return;
          }
          const elm = probe();
          if (elm) {
            resolve(elm);
            return;
          }
          window.setTimeout(delayedProbe, 250);
        }
        delayedProbe();
      });
    }
    const ToggleButton$1 = "_ToggleButton_6twf4_1";
    const Enable = "_Enable_6twf4_12";
    const Circle = "_Circle_6twf4_15";
    const styles$6 = {
      ToggleButton: ToggleButton$1,
      Enable,
      Circle
    };
    const ToggleButton = ({
      enable = false,
      setEnable
    }) => {
      const handleToggle = () => {
        setEnable(!enable);
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes(styles$6.ToggleButton, enable ? styles$6.Enable : false), onClick: handleToggle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$6.Circle }) });
    };
    const Setting$1 = "_Setting_1369u_1";
    const Menus = "_Menus_1369u_4";
    const Menu = "_Menu_1369u_4";
    const Name = "_Name_1369u_14";
    const Value = "_Value_1369u_21";
    const styles$5 = {
      Setting: Setting$1,
      Menus,
      Menu,
      Name,
      Value
    };
    const ListBox$1 = "_ListBox_g79p9_1";
    const ListValue = "_ListValue_g79p9_4";
    const Options = "_Options_g79p9_31";
    const Option = "_Option_g79p9_31";
    const Selected = "_Selected_g79p9_55";
    const View$2 = "_View_g79p9_65";
    const styles$4 = {
      ListBox: ListBox$1,
      ListValue,
      Options,
      Option,
      Selected,
      View: View$2
    };
    const ListBox = ({
      value = 0,
      options,
      setValue
    }) => {
      const [isOptions, IsOptions] = reactExports.useState(false);
      const handleSetValue = (key) => {
        setValue(key);
        IsOptions(false);
      };
      const optionsElem = options.map(({ key, name }) => {
        const isSelected = value == key;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes(styles$4.Option, isSelected ? styles$4.Selected : false), onClick: () => !isSelected && handleSetValue(key), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: name }) }, key);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$4.ListBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$4.ListValue, onClick: () => IsOptions(!isOptions), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: options[value].name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes(styles$4.Options, isOptions ? styles$4.View : false), children: optionsElem })
      ] });
    };
    if (!reactExports.useState) {
      throw new Error("mobx-react-lite requires React with Hooks support");
    }
    if (!makeObservable) {
      throw new Error("mobx-react-lite@3 requires mobx at least version 6 to be available");
    }
    function defaultNoopBatch(callback) {
      callback();
    }
    function observerBatching(reactionScheduler2) {
      if (!reactionScheduler2) {
        reactionScheduler2 = defaultNoopBatch;
      }
      configure({ reactionScheduler: reactionScheduler2 });
    }
    function printDebugValue(v2) {
      return getDependencyTree(v2);
    }
    var REGISTRY_FINALIZE_AFTER = 1e4;
    var REGISTRY_SWEEP_INTERVAL = 1e4;
    var TimerBasedFinalizationRegistry = (
      /** @class */
      function() {
        function TimerBasedFinalizationRegistry2(finalize) {
          var _this = this;
          Object.defineProperty(this, "finalize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: finalize
          });
          Object.defineProperty(this, "registrations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: /* @__PURE__ */ new Map()
          });
          Object.defineProperty(this, "sweepTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "sweep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function(maxAge) {
              if (maxAge === void 0) {
                maxAge = REGISTRY_FINALIZE_AFTER;
              }
              clearTimeout(_this.sweepTimeout);
              _this.sweepTimeout = void 0;
              var now = Date.now();
              _this.registrations.forEach(function(registration, token) {
                if (now - registration.registeredAt >= maxAge) {
                  _this.finalize(registration.value);
                  _this.registrations.delete(token);
                }
              });
              if (_this.registrations.size > 0) {
                _this.scheduleSweep();
              }
            }
          });
          Object.defineProperty(this, "finalizeAllImmediately", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function() {
              _this.sweep(0);
            }
          });
        }
        Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "register", {
          enumerable: false,
          configurable: true,
          writable: true,
          value: function(target, value, token) {
            this.registrations.set(token, {
              value,
              registeredAt: Date.now()
            });
            this.scheduleSweep();
          }
        });
        Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "unregister", {
          enumerable: false,
          configurable: true,
          writable: true,
          value: function(token) {
            this.registrations.delete(token);
          }
        });
        Object.defineProperty(TimerBasedFinalizationRegistry2.prototype, "scheduleSweep", {
          enumerable: false,
          configurable: true,
          writable: true,
          value: function() {
            if (this.sweepTimeout === void 0) {
              this.sweepTimeout = setTimeout(this.sweep, REGISTRY_SWEEP_INTERVAL);
            }
          }
        });
        return TimerBasedFinalizationRegistry2;
      }()
    );
    var UniversalFinalizationRegistry = typeof FinalizationRegistry !== "undefined" ? FinalizationRegistry : TimerBasedFinalizationRegistry;
    var observerFinalizationRegistry = new UniversalFinalizationRegistry(function(adm) {
      var _a2;
      (_a2 = adm.reaction) === null || _a2 === void 0 ? void 0 : _a2.dispose();
      adm.reaction = null;
    });
    var shim$1 = { exports: {} };
    var useSyncExternalStoreShim_production = {};
    /**
     * @license React
     * use-sync-external-store-shim.production.js
     *
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var React = reactExports;
    function is(x2, y2) {
      return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue;
    function useSyncExternalStore$2(subscribe, getSnapshot) {
      var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
      useLayoutEffect(
        function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe, value, getSnapshot]
      );
      useEffect(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
      return getSnapshot();
    }
    var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    {
      shim$1.exports = useSyncExternalStoreShim_production;
    }
    var shimExports = shim$1.exports;
    function createReaction(adm) {
      adm.reaction = new Reaction("observer".concat(adm.name), function() {
        var _a2;
        adm.stateVersion = Symbol();
        (_a2 = adm.onStoreChange) === null || _a2 === void 0 ? void 0 : _a2.call(adm);
      });
    }
    function useObserver(render, baseComponentName) {
      if (baseComponentName === void 0) {
        baseComponentName = "observed";
      }
      var admRef = React$1.useRef(null);
      if (!admRef.current) {
        var adm_1 = {
          reaction: null,
          onStoreChange: null,
          stateVersion: Symbol(),
          name: baseComponentName,
          subscribe: function(onStoreChange) {
            observerFinalizationRegistry.unregister(adm_1);
            adm_1.onStoreChange = onStoreChange;
            if (!adm_1.reaction) {
              createReaction(adm_1);
              adm_1.stateVersion = Symbol();
            }
            return function() {
              var _a2;
              adm_1.onStoreChange = null;
              (_a2 = adm_1.reaction) === null || _a2 === void 0 ? void 0 : _a2.dispose();
              adm_1.reaction = null;
            };
          },
          getSnapshot: function() {
            return adm_1.stateVersion;
          }
        };
        admRef.current = adm_1;
      }
      var adm = admRef.current;
      if (!adm.reaction) {
        createReaction(adm);
        observerFinalizationRegistry.register(admRef, adm, adm);
      }
      React$1.useDebugValue(adm.reaction, printDebugValue);
      shimExports.useSyncExternalStore(
        // Both of these must be stable, otherwise it would keep resubscribing every render.
        adm.subscribe,
        adm.getSnapshot,
        adm.getSnapshot
      );
      var renderResult;
      var exception;
      adm.reaction.track(function() {
        try {
          renderResult = render();
        } catch (e) {
          exception = e;
        }
      });
      if (exception) {
        throw exception;
      }
      return renderResult;
    }
    var _a$1, _b;
    var hasSymbol = typeof Symbol === "function" && Symbol.for;
    var isFunctionNameConfigurable = (_b = (_a$1 = Object.getOwnPropertyDescriptor(function() {
    }, "name")) === null || _a$1 === void 0 ? void 0 : _a$1.configurable) !== null && _b !== void 0 ? _b : false;
    var ReactForwardRefSymbol = hasSymbol ? Symbol.for("react.forward_ref") : typeof reactExports.forwardRef === "function" && reactExports.forwardRef(function(props) {
      return null;
    })["$$typeof"];
    var ReactMemoSymbol = hasSymbol ? Symbol.for("react.memo") : typeof reactExports.memo === "function" && reactExports.memo(function(props) {
      return null;
    })["$$typeof"];
    function observer(baseComponent, options) {
      var _a2;
      if (ReactMemoSymbol && baseComponent["$$typeof"] === ReactMemoSymbol) {
        throw new Error("[mobx-react-lite] You are trying to use `observer` on a function component wrapped in either another `observer` or `React.memo`. The observer already applies 'React.memo' for you.");
      }
      var useForwardRef = (_a2 = void 0) !== null && _a2 !== void 0 ? _a2 : false;
      var render = baseComponent;
      var baseComponentName = baseComponent.displayName || baseComponent.name;
      if (ReactForwardRefSymbol && baseComponent["$$typeof"] === ReactForwardRefSymbol) {
        useForwardRef = true;
        render = baseComponent["render"];
        if (typeof render !== "function") {
          throw new Error("[mobx-react-lite] `render` property of ForwardRef was not a function");
        }
      }
      var observerComponent = function(props, ref) {
        return useObserver(function() {
          return render(props, ref);
        }, baseComponentName);
      };
      observerComponent.displayName = baseComponent.displayName;
      if (isFunctionNameConfigurable) {
        Object.defineProperty(observerComponent, "name", {
          value: baseComponent.name,
          writable: true,
          configurable: true
        });
      }
      if (baseComponent.contextTypes) {
        observerComponent.contextTypes = baseComponent.contextTypes;
      }
      if (useForwardRef) {
        observerComponent = reactExports.forwardRef(observerComponent);
      }
      observerComponent = reactExports.memo(observerComponent);
      copyStaticProperties(baseComponent, observerComponent);
      return observerComponent;
    }
    var hoistBlackList = {
      $$typeof: true,
      render: true,
      compare: true,
      type: true,
      // Don't redefine `displayName`,
      // it's defined as getter-setter pair on `memo` (see #3192).
      displayName: true
    };
    function copyStaticProperties(base, target) {
      Object.keys(base).forEach(function(key) {
        if (!hoistBlackList[key]) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
      });
    }
    var _a;
    observerBatching(reactDomExports.unstable_batchedUpdates);
    (_a = observerFinalizationRegistry["finalizeAllImmediately"]) !== null && _a !== void 0 ? _a : function() {
    };
    const InputBox$1 = "_InputBox_1a5to_1";
    const InputValue = "_InputValue_1a5to_4";
    const Tip = "_Tip_1a5to_25";
    const View$1 = "_View_1a5to_39";
    const styles$3 = {
      InputBox: InputBox$1,
      InputValue,
      Tip,
      View: View$1
    };
    const InputBox = ({
      value,
      type,
      max,
      min,
      setValue
    }) => {
      const [tip, setTip] = reactExports.useState("");
      const handleChange = (e) => {
        let newValue = e.target.value;
        if (e.target.type == "number") {
          if (!/^\d*$/.test(newValue)) return;
          if (newValue.length > 1 && newValue.startsWith("0")) {
            newValue = newValue.replace(/^0+/, "");
          }
          newValue = Number(newValue);
          if (max && max < newValue || min && min > newValue) {
            setTip(`${min} ~ ${max} 사이 값을 입력해주세요.`);
          } else {
            setTip("");
          }
        }
        setValue(newValue);
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$3.InputBox, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.InputValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value: String(value), onChange: handleChange }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes(styles$3.Tip, tip.length > 0 ? styles$3.View : false), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: tip }) })
      ] });
    };
    const SliderBar$1 = "_SliderBar_pao52_1";
    const SliderTrack = "_SliderTrack_pao52_5";
    const SliderFilled = "_SliderFilled_pao52_12";
    const SliderThumb = "_SliderThumb_pao52_19";
    const styles$2 = {
      SliderBar: SliderBar$1,
      SliderTrack,
      SliderFilled,
      SliderThumb
    };
    const SliderBar = ({
      value,
      min = 0,
      max = 0,
      setValue
    }) => {
      const sliderRef = reactExports.useRef(null);
      const handleMouseMove = (e) => {
        if (!sliderRef.current || max <= min) return;
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.min(Math.max(0, offsetX / rect.width), 1);
        const newValue = Math.round(percentage * (max - min) + min);
        setValue(newValue);
      };
      const handleMouseDown = (e) => {
        handleMouseMove(e.nativeEvent);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", handleMouseMove);
          },
          { once: true }
        );
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$2.SliderBar, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: styles$2.SliderTrack,
          ref: sliderRef,
          onMouseDown: handleMouseDown,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: styles$2.SliderThumb,
                "data-value": value,
                style: { left: `${(value - min) / (max - min) * 100}%` }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: styles$2.SliderFilled,
                style: { width: `${(value - min) / (max - min) * 100}%` }
              }
            )
          ]
        }
      ) });
    };
    const Setting = observer(() => {
      const mainStore = useMainStore();
      const chat_style = mainStore.setting.get("chat_style");
      const opitons = [
        {
          key: 0,
          name: "오버레이"
        },
        {
          key: 1,
          name: "프레임"
        }
      ];
      const frameChatPositionOpitons = [
        {
          key: 0,
          name: "좌측 상단"
        },
        {
          key: 1,
          name: "좌측 하단"
        },
        {
          key: 2,
          name: "우측 상단"
        },
        {
          key: 3,
          name: "우측 하단"
        }
      ];
      const settingList = [
        {
          name: "스타일러 활성화",
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("enable"),
              cb: (value) => mainStore.setSetting("enable", value, true)
            }
          ]
        },
        {
          name: "기존 채팅 표시",
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("defalut_chat_enable"),
              cb: (value) => mainStore.setSetting("defalut_chat_enable", value, true)
            }
          ]
        },
        {
          name: "닉네임 표시",
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("show_nicknames"),
              cb: (value) => mainStore.setSetting("show_nicknames", value, true)
            }
          ]
        },
        {
          name: "채팅창 스타일",
          values: [
            {
              type: "list",
              value: mainStore.setting.get("chat_style"),
              options: opitons,
              cb: (value) => mainStore.setSetting("chat_style", value, true)
            }
          ]
        },
        // 오버레이
        {
          name: "채팅 표시 개수",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_view_count"),
              min: 1,
              max: mainStore.maxChats,
              cb: (value) => mainStore.setSetting("overlay_view_count", value, true)
            }
          ]
        },
        {
          name: "채팅 길이",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_view_width"),
              min: 100,
              max: 500,
              cb: (value) => mainStore.setSetting("overlay_view_width", value, true)
            }
          ]
        },
        {
          name: "폰트 크기",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_font_size"),
              min: 10,
              max: 28,
              cb: (value) => mainStore.setSetting("overlay_font_size", value, true)
            }
          ]
        },
        {
          name: "닉네임 랜덤 색상",
          disable: chat_style != 0,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("overlay_random_username"),
              cb: (value) => mainStore.setSetting("overlay_random_username", value, true)
            }
          ]
        },
        {
          name: "채팅 메시지 정렬",
          disable: chat_style != 0,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("overlay_sort_chat_messages"),
              cb: (value) => mainStore.setSetting("overlay_sort_chat_messages", value, true)
            }
          ]
        },
        {
          name: "채팅 배경 표시",
          disable: chat_style != 0,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("overlay_chat_background"),
              cb: (value) => mainStore.setSetting("overlay_chat_background", value, true)
            }
          ]
        },
        {
          name: "채팅 배경 투명도",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_chat_opacity"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("overlay_chat_opacity", value, true)
            }
          ]
        },
        {
          name: "배경 표시",
          disable: chat_style != 0,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("overlay_background"),
              cb: (value) => mainStore.setSetting("overlay_background", value, true)
            }
          ]
        },
        {
          name: "배경 투명도",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_background_opacity"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("overlay_background_opacity", value, true)
            }
          ]
        },
        {
          name: "배경 영역",
          disable: chat_style != 0,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("overlay_background_area"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("overlay_background_area", value, true)
            }
          ]
        },
        // 프레임
        {
          name: "채팅창 위치",
          disable: chat_style != 1,
          values: [
            {
              type: "list",
              value: mainStore.setting.get("frame_chat_position"),
              options: frameChatPositionOpitons,
              cb: (value) => mainStore.setSetting("frame_chat_position", value, true)
            }
          ]
        },
        {
          name: "채팅 표시 개수",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_view_count"),
              min: 1,
              max: mainStore.maxChats,
              cb: (value) => mainStore.setSetting("frame_view_count", value, true)
            }
          ]
        },
        {
          name: "채팅 길이",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_view_width"),
              min: 100,
              max: 500,
              cb: (value) => mainStore.setSetting("frame_view_width", value, true)
            }
          ]
        },
        {
          name: "폰트 크기",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_font_size"),
              min: 10,
              max: 28,
              cb: (value) => mainStore.setSetting("frame_font_size", value, true)
            }
          ]
        },
        {
          name: "채팅 오프셋 X축",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_offset_x"),
              min: 0,
              max: 50,
              cb: (value) => mainStore.setSetting("frame_offset_x", value, true)
            }
          ]
        },
        {
          name: "채팅 오프셋 Y축",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_offset_y"),
              min: 0,
              max: 50,
              cb: (value) => mainStore.setSetting("frame_offset_y", value, true)
            }
          ]
        },
        {
          name: "닉네임 랜덤 색상",
          disable: chat_style != 1,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("frame_random_username"),
              cb: (value) => mainStore.setSetting("frame_random_username", value, true)
            }
          ]
        },
        {
          name: "채팅 메시지 정렬",
          disable: chat_style != 1,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("frame_sort_chat_messages"),
              cb: (value) => mainStore.setSetting("frame_sort_chat_messages", value, true)
            }
          ]
        },
        {
          name: "채팅 배경 표시",
          disable: chat_style != 1,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("frame_chat_background"),
              cb: (value) => mainStore.setSetting("frame_chat_background", value, true)
            }
          ]
        },
        {
          name: "채팅 배경 투명도",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_chat_opacity"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("frame_chat_opacity", value, true)
            }
          ]
        },
        {
          name: "배경 표시",
          disable: chat_style != 1,
          values: [
            {
              type: "toggle",
              value: mainStore.setting.get("frame_background"),
              cb: (value) => mainStore.setSetting("frame_background", value, true)
            }
          ]
        },
        {
          name: "배경 투명도",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_background_opacity"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("frame_background_opacity", value, true)
            }
          ]
        },
        {
          name: "배경 영역",
          disable: chat_style != 1,
          values: [
            {
              type: "slider",
              value: mainStore.setting.get("frame_background_area"),
              min: 0,
              max: 100,
              cb: (value) => mainStore.setSetting("frame_background_area", value, true)
            }
          ]
        }
      ];
      const settingListElem = settingList.map(({ name, disable, values }, idx) => {
        if (disable) return;
        const valueElem = values.map(({ type, value, options, inputType, min, max, cb: cb2 }, idx2) => {
          let contentElem;
          switch (type) {
            case "toggle":
              contentElem = /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { enable: value, setEnable: cb2 });
              break;
            case "list":
              contentElem = /* @__PURE__ */ jsxRuntimeExports.jsx(ListBox, { value, options, setValue: cb2 });
              break;
            case "input":
              contentElem = /* @__PURE__ */ jsxRuntimeExports.jsx(InputBox, { value, setValue: cb2, type: inputType, min, max });
              break;
            case "slider":
              contentElem = /* @__PURE__ */ jsxRuntimeExports.jsx(SliderBar, { value, setValue: cb2, min, max });
              break;
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.Value, children: contentElem }, idx2);
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$5.Menu, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.Name, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: name }) }),
          valueElem
        ] }, idx);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.Setting, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$5.Menus, children: settingListElem }) });
    });
    const SvgCrossSmall = (props) => /* @__PURE__ */ reactExports.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", id: "Outline", viewBox: "0 0 24 24", width: 512, height: 512, ...props }, /* @__PURE__ */ reactExports.createElement("path", { d: "M18,6h0a1,1,0,0,0-1.414,0L12,10.586,7.414,6A1,1,0,0,0,6,6H6A1,1,0,0,0,6,7.414L10.586,12,6,16.586A1,1,0,0,0,6,18H6a1,1,0,0,0,1.414,0L12,13.414,16.586,18A1,1,0,0,0,18,18h0a1,1,0,0,0,0-1.414L13.414,12,18,7.414A1,1,0,0,0,18,6Z" }));
    const SettingTemplate = ({
      isSetting,
      toggleSetting
    }) => {
      const settingRef = reactExports.useRef(null);
      const [isDragging, setIsDragging] = reactExports.useState(false);
      const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
      const [initialPosition, setInitialPosition] = reactExports.useState({ x: 0, y: 0 });
      const handleMouseDown = (e) => {
        if (!settingRef.current) return;
        setIsDragging(true);
        setInitialPosition({
          x: e.clientX,
          y: e.clientY
        });
        setOffset({
          x: settingRef.current.offsetLeft,
          y: settingRef.current.offsetTop
        });
      };
      const handleMouseMove = (e) => {
        if (!isDragging || !settingRef.current) return;
        const currentX = e.clientX - initialPosition.x;
        const currentY = e.clientY - initialPosition.y;
        const newLeft = offset.x + currentX;
        const newTop = offset.y + currentY;
        settingRef.current.style.left = `${newLeft}px`;
        settingRef.current.style.top = `${newTop}px`;
      };
      const handleMouseUp = () => {
        setIsDragging(false);
      };
      reactExports.useEffect(() => {
        if (isDragging) {
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        } else {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }, [isDragging]);
      return ReactDOM.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: settingRef,
            className: classes(styles$7.SettingTemplate, isSetting ? styles$7.View : false),
            style: { position: "absolute" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$7.Header, onMouseDown: handleMouseDown, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.Title, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "채팅 스타일러" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: styles$7.Menus,
                    onMouseDown: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: styles$7.Menu,
                        onClick: toggleSetting,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SvgCrossSmall, { fill: "rgb(70, 70, 70)" })
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$7.Content, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Setting, {}) })
            ]
          }
        ),
        document.body
      );
    };
    const FrameChat$1 = "_FrameChat_athuv_1";
    const LeftTop = "_LeftTop_athuv_8";
    const LeftBottom = "_LeftBottom_athuv_11";
    const RightTop = "_RightTop_athuv_14";
    const RightBottom = "_RightBottom_athuv_18";
    const Chat$2 = "_Chat_athuv_22";
    const Sorted$1 = "_Sorted_athuv_28";
    const MessageContainer$1 = "_MessageContainer_athuv_28";
    const Username$1 = "_Username_athuv_32";
    const Message$1 = "_Message_athuv_28";
    const Background$1 = "_Background_athuv_63";
    const styles$1 = {
      FrameChat: FrameChat$1,
      LeftTop,
      LeftBottom,
      RightTop,
      RightBottom,
      Chat: Chat$2,
      Sorted: Sorted$1,
      MessageContainer: MessageContainer$1,
      Username: Username$1,
      Message: Message$1,
      Background: Background$1
    };
    const FrameChat = observer(() => {
      const mainStore = useMainStore();
      const [playerSizeDiv, setPlayerSizeDiv] = reactExports.useState(null);
      const frameChatPosition = mainStore.setting.get("frame_chat_position");
      const frameRandomUsername = mainStore.setting.get("frame_random_username");
      const frameViewCount = mainStore.setting.get("frame_view_count");
      const frameChatOpacity = mainStore.setting.get("frame_chat_opacity");
      const frameBackgroundOpacity = mainStore.setting.get("frame_background_opacity");
      const frameBackgroundArea = mainStore.setting.get("frame_background_area");
      const frameChatBackground = mainStore.setting.get("frame_chat_background");
      const frameViewWidth = mainStore.setting.get("frame_view_width");
      const frameSortChatMessages = mainStore.setting.get("frame_sort_chat_messages");
      const frameFontSize = mainStore.setting.get("frame_font_size");
      const frameBackground = mainStore.setting.get("frame_background");
      const frameOffsetX = mainStore.setting.get("frame_offset_x");
      const frameOffsetY = mainStore.setting.get("frame_offset_y");
      const showNicknames = mainStore.setting.get("show_nicknames");
      reactExports.useEffect(() => {
        const div = document.querySelector("#videoLayer");
        if (div) {
          setPlayerSizeDiv(div);
        }
      }, []);
      const chatsElem = mainStore.chats.slice(-frameViewCount).map(({ id: id2, username, contentArray, color }) => {
        const background = frameChatBackground ? `rgba(0, 0, 0, ${frameChatOpacity}%)` : "";
        const fontSize = `${frameFontSize}px`;
        const userNameElem = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.Username, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          color: frameRandomUsername ? color : "#9dd9a5",
          fontSize
        }, children: username }) });
        const messageContent = contentArray.map((content, index) => {
          if (content.type == "image") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: content.content, style: { width: fontSize, height: fontSize } }, index);
          } else {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize }, children: content.content }, index);
          }
        });
        const messageElem = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.Message, children: messageContent });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: classes(
              styles$1.Chat,
              frameChatBackground ? styles$1.Background : false,
              frameSortChatMessages ? styles$1.Sorted : false
            ),
            style: {
              width: `${frameViewWidth}px`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: styles$1.MessageContainer,
                style: {
                  background
                },
                children: [
                  showNicknames && userNameElem,
                  messageElem
                ]
              }
            )
          },
          id2
        );
      });
      let frameChatPositionCls = "", frameChatDegree;
      switch (frameChatPosition) {
        case 0:
          frameChatPositionCls = styles$1.LeftTop;
          frameChatDegree = 180;
          break;
        case 1:
          frameChatPositionCls = styles$1.LeftBottom;
          frameChatDegree = 0;
          break;
        case 2:
          frameChatPositionCls = styles$1.RightTop;
          frameChatDegree = 180;
          break;
        case 3:
          frameChatPositionCls = styles$1.RightBottom;
          frameChatDegree = 0;
          break;
      }
      const chatBackgroundStyle = `linear-gradient(${frameChatDegree}deg, rgba(0, 0, 0, ${frameBackgroundOpacity}%) ${frameBackgroundArea}%, rgba(0, 0, 0, 0) 100%)`;
      return playerSizeDiv ? ReactDOM.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: classes(styles$1.FrameChat, frameChatPositionCls),
            style: {
              background: frameBackground ? chatBackgroundStyle : "",
              paddingLeft: `${frameOffsetX}px`,
              paddingRight: `${frameOffsetX}px`,
              paddingTop: `${frameOffsetY}px`,
              paddingBottom: `${frameOffsetY}px`
            },
            children: chatsElem
          }
        ),
        playerSizeDiv
      ) : null;
    });
    const OverlayChat$1 = "_OverlayChat_recsk_1";
    const View = "_View_recsk_13";
    const Chat$1 = "_Chat_recsk_16";
    const Sorted = "_Sorted_recsk_22";
    const MessageContainer = "_MessageContainer_recsk_22";
    const Username = "_Username_recsk_26";
    const Message = "_Message_recsk_22";
    const Background = "_Background_recsk_57";
    const styles = {
      OverlayChat: OverlayChat$1,
      View,
      Chat: Chat$1,
      Sorted,
      MessageContainer,
      Username,
      Message,
      Background
    };
    const OverlayChat = observer(() => {
      const mainStore = useMainStore();
      const chatRef = reactExports.useRef(null);
      const [isView, IsView] = reactExports.useState(false);
      const [isDragging, setIsDragging] = reactExports.useState(false);
      const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
      const [initialPosition, setInitialPosition] = reactExports.useState({ x: 0, y: 0 });
      const [position, setPosition] = reactExports.useState({ left: 0, top: 0 });
      const overlayViewCount = mainStore.setting.get("overlay_view_count");
      const overlayViewOpacity = mainStore.setting.get("overlay_chat_opacity");
      const overlayBackgroundOpacity = mainStore.setting.get("overlay_background_opacity");
      const overlayRandomUsername = mainStore.setting.get("overlay_random_username");
      const overlayViewWidth = mainStore.setting.get("overlay_view_width");
      const overlaySortChatMessages = mainStore.setting.get("overlay_sort_chat_messages");
      const overlayFontSize = mainStore.setting.get("overlay_font_size");
      const overlayChatBackground = mainStore.setting.get("overlay_chat_background");
      const overlayBackground = mainStore.setting.get("overlay_background");
      const overlayBackgroundArea = mainStore.setting.get("overlay_background_area");
      const showNicknames = mainStore.setting.get("show_nicknames");
      const handleMouseDown = (e) => {
        if (!chatRef.current) return;
        setIsDragging(true);
        setInitialPosition({
          x: e.clientX,
          y: e.clientY
        });
        setOffset({
          x: position.left,
          y: position.top
        });
      };
      const handleMouseMove = (e) => {
        if (!isDragging || !chatRef.current) return;
        const currentX = e.clientX - initialPosition.x;
        const currentY = e.clientY - initialPosition.y;
        const newLeft = offset.x + currentX;
        const newTop = offset.y + currentY;
        setPosition({ left: newLeft, top: newTop });
        chatRef.current.style.left = `${newLeft}px`;
        chatRef.current.style.top = `${newTop}px`;
      };
      const handleMouseUp = () => {
        setIsDragging(false);
        mainStore.setSetting("overlay_x", position.left, true);
        mainStore.setSetting("overlay_y", position.top, true);
      };
      reactExports.useEffect(() => {
        if (isDragging) {
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        } else {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }, [position, isDragging]);
      reactExports.useEffect(() => {
        const handleResize = () => {
          if (!chatRef.current) return;
          const rect = chatRef.current.getBoundingClientRect();
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          let newLeft = position.left;
          let newTop = position.top;
          if (rect.left < 0 || rect.right > windowWidth) {
            if (rect.left < 0) newLeft = 0;
            if (rect.right > windowWidth) newLeft = windowWidth - rect.width;
          }
          if (rect.top < 0 || rect.bottom > windowHeight) {
            if (rect.top < 0) newTop = 0;
            if (rect.bottom > windowHeight) newTop = windowHeight - rect.height;
          }
          setPosition({ left: newLeft, top: newTop });
          chatRef.current.style.left = `${newLeft}px`;
          chatRef.current.style.top = `${newTop}px`;
          mainStore.setSetting("overlay_x", newLeft, true);
          mainStore.setSetting("overlay_y", newTop, true);
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [position]);
      reactExports.useEffect(() => {
        if (!chatRef.current) return;
        const left = mainStore.setting.get("overlay_x") || 0;
        const top = mainStore.setting.get("overlay_y") || 0;
        setPosition({ left, top });
        chatRef.current.style.left = `${left}px`;
        chatRef.current.style.top = `${top}px`;
        IsView(true);
      }, []);
      const chatsElem = mainStore.chats.slice(-overlayViewCount).map(({ id: id2, username, contentArray, color }) => {
        const background = overlayChatBackground ? `rgba(0, 0, 0, ${overlayViewOpacity}%)` : "";
        const fontSize = `${overlayFontSize}px`;
        const userNameElem = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.Username, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          color: overlayRandomUsername ? color : "#9dd9a5",
          fontSize
        }, children: username }) });
        const messageContent = contentArray.map((content, index) => {
          if (content.type == "image") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: content.content, style: { width: fontSize, height: fontSize } }, index);
          } else {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize }, children: content.content }, index);
          }
        });
        const messageElem = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.Message, children: messageContent });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: classes(
              styles.Chat,
              overlayChatBackground ? styles.Background : false,
              overlaySortChatMessages ? styles.Sorted : false
            ),
            style: {
              width: `${overlayViewWidth}px`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: styles.MessageContainer,
                style: {
                  background
                },
                children: [
                  showNicknames && userNameElem,
                  messageElem
                ]
              }
            )
          },
          id2
        );
      });
      const chatBackgroundStyle = `linear-gradient(0deg, rgba(0, 0, 0, ${overlayBackgroundOpacity}%) ${overlayBackgroundArea}%, rgba(0, 0, 0, 0) 100%)`;
      return ReactDOM.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: chatRef,
            className: classes(styles.OverlayChat, isView ? styles.View : false),
            onMouseDown: handleMouseDown,
            style: {
              left: `${position.left}px`,
              top: `${position.top}px`,
              background: overlayBackground ? chatBackgroundStyle : ""
            },
            children: chatsElem
          }
        ),
        document.body
      );
    });
    const Chat = observer(() => {
      const mainStore = useMainStore();
      const enable = mainStore.setting.get("enable");
      const chat_style = mainStore.setting.get("chat_style");
      const defalut_chat_enable = mainStore.setting.get("defalut_chat_enable");
      reactExports.useEffect(() => {
        const sideElement = document.querySelector("#webplayer_contents .wrapping.side");
        if (sideElement)
          sideElement.style.display = defalut_chat_enable ? "block" : "none";
      }, [defalut_chat_enable]);
      let chatElem;
      switch (chat_style) {
        case 0:
          chatElem = /* @__PURE__ */ jsxRuntimeExports.jsx(OverlayChat, {});
          break;
        case 1:
          chatElem = /* @__PURE__ */ jsxRuntimeExports.jsx(FrameChat, {});
          break;
      }
      return enable && chatElem;
    });
    const App = () => {
      const mainStore = useMainStore();
      const [isSetting, IsSetting] = reactExports.useState(false);
      const [isInit, IsInit] = reactExports.useState(false);
      const chatUpdate = reactExports.useRef(null);
      let colorIdx = 0;
      const colors = [
        "#f28ca5",
        "#9dd9a5",
        "#fff08c",
        "#a1b1eb",
        "#fac098",
        "#c88ed9",
        "#a2f7f7",
        "#f798f2",
        "#ddfa85"
      ];
      const toggleSetting = () => {
        IsSetting((prevIsSetting) => !prevIsSetting);
      };
      const initSetting = () => {
        GM_listValues().map((v2) => {
          mainStore.setSetting(v2, GM_getValue(v2), false);
        });
        mainStore.addChat({ id: -1, username: "제작자", contentArray: [{ type: "text", content: "비콩 (github.com/bcong)" }], color: "#e9ab00" });
        IsInit(true);
      };
      const updateChatMessages = () => {
        const chatAreaElements = document.querySelectorAll("#chat_area");
        const chatArea = chatAreaElements[chatAreaElements.length - 1];
        if (!chatArea) return;
        const chatItems = chatArea.querySelectorAll(".chatting-list-item");
        const recentChats = Array.from(chatItems).slice(-mainStore.maxChats);
        if (recentChats.length <= 1) return;
        const lastChat = mainStore.lastChat();
        recentChats.forEach((chat) => {
          var _a2;
          const username = ((_a2 = chat.querySelector(".username .author")) == null ? void 0 : _a2.textContent) || null;
          const message = chat.querySelector(".message-text");
          if (!username || !message) return;
          const id2 = Number(message == null ? void 0 : message.id) || 0;
          if (lastChat.id >= id2) return;
          const contentArray = [];
          const messageOriginal = message.querySelector("#message-original");
          if (!messageOriginal) return;
          messageOriginal.childNodes.forEach((node) => {
            var _a3;
            if (node.nodeType === Node.TEXT_NODE) {
              const textContent = (_a3 = node.textContent) == null ? void 0 : _a3.trim();
              if (textContent) {
                contentArray.push({ type: "text", content: textContent });
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.tagName === "IMG") {
                const imgSrc = element.getAttribute("src");
                if (imgSrc) {
                  contentArray.push({ type: "image", content: imgSrc });
                }
              }
            }
          });
          mainStore.addChat({ id: id2, username, contentArray, color: colors[colorIdx] });
          colorIdx == colors.length - 1 ? colorIdx = 0 : colorIdx++;
        });
      };
      const checkViewChat = () => {
        const buttonElement = document.querySelector(".view_ctrl .btn_chat");
        if (!buttonElement) return;
        const computedStyle = window.getComputedStyle(buttonElement);
        const button = buttonElement.querySelector("button");
        if (!button) return;
        computedStyle.display == "block" && button.click();
      };
      reactExports.useEffect(() => {
        initSetting();
        checkViewChat();
        chatUpdate.current = setInterval(() => {
          updateChatMessages();
          checkViewChat();
        }, 100);
        return () => {
          if (chatUpdate.current) clearInterval(chatUpdate.current);
        };
      }, []);
      return isInit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingMenuComponent, { isSetting, toggleSetting }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SettingTemplate, { isSetting, toggleSetting }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chat, {})
      ] });
    };
    log("SOOP 채팅 스타일러 - 비콩");
    let root = null;
    async function main() {
      const body = await awaitElement("body > div");
      let container = document.querySelector("#soop-chat-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "soop-chat-container";
        body.appendChild(container);
      }
      if (!root) {
        root = createRoot(container);
        root.render(
          /* @__PURE__ */ jsxRuntimeExports.jsx(StoreProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
        );
      }
    }
    addLocationChangeCallback(() => {
      main().catch((e) => {
        log(e);
      });
    });
  })();

})();