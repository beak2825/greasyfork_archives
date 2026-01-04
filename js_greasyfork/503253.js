// ==UserScript==
// @name       qq音乐歌单下载工具
// @namespace  npm/vite-plugin-monkey
// @version    4.0.9
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://y.qq.com/n/ryqq*
// @require    https://cdn.jsdelivr.net/npm/mongkey-fetch-utils@1.5.47/qqMusicSonglist.js
// @require    https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @connect    ws6.stream.qqmusic.qq.com
// @connect    stream.qqmusic.qq.com
// @connect    qqmusic.qq.com
// @connect    qq.com
// @connect    *
// @license    MIT
// @grant      GM.addElement
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_xmlhttpRequest
// @grant      unsafeWindow
// @description QQ音乐歌单一键式批量下载到本地。（注意：使用前请登录qq音乐账号，再下载音乐，若遇到下载失败，请刷新后重试，或者检查网络流畅）使用流程： 进入qq音乐官网https://y.qq.com/n/ryqq。再选择需要下载的歌单播放歌单全部音乐。进入播放界面提示是否下载。点击确认获取本地音乐（歌曲多可能需要一段时间）。等待一段时间后，即可下载歌单内全部音乐。（适用于u盘音响设备，或者车内音响设备音乐下载本地）*****请勿运用到商业用途。若用于商业用途与本人无关。
// @downloadURL https://update.greasyfork.org/scripts/503253/qq%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/503253/qq%E9%9F%B3%E4%B9%90%E6%AD%8C%E5%8D%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .process-div{display:flex;justify-content:center;flex-direction:column;align-items:center}.show-text{margin-top:36px}.downAllBtn-qq{display:inline-block;background-color:green;color:#fff!important;font-size:large}.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:#00000080;display:flex;justify-content:center;align-items:center}.modal-content{background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 8px #0003;text-align:center}input{display:block;width:220px;margin-left:calc(50% - 110px)}img{width:240px}.modal-buttons{margin-top:20px}.modal-content p{width:320px}.modal-buttons button{margin:0 10px}a{color:#00f;text-decoration:none}a:visited{color:purple}a:hover{color:red;text-decoration:underline}a:active{color:green} ");

(function (require$$0$1, require$$0$2) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n2) {
    if (n2.__esModule) return n2;
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f2, arguments, this.constructor);
        }
        return f2.apply(this, arguments);
      };
      a.prototype = f2.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n2).forEach(function(k2) {
      var d = Object.getOwnPropertyDescriptor(n2, k2);
      Object.defineProperty(a, k2, d.get ? d : {
        enumerable: true,
        get: function() {
          return n2[k2];
        }
      });
    });
    return a;
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
  var f = require$$0$1, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
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
  var client = {};
  var m = require$$0$2;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  function new_byte$2(count) {
    return new Int8Array(count);
  }
  function new_short(count) {
    return new Int16Array(count);
  }
  function new_int$8(count) {
    return new Int32Array(count);
  }
  function new_float$8(count) {
    return new Float32Array(count);
  }
  function new_double$1(count) {
    return new Float64Array(count);
  }
  function new_float_n$3(args) {
    if (args.length == 1) {
      return new_float$8(args[0]);
    }
    var sz = args[0];
    args = args.slice(1);
    var A = [];
    for (var i = 0; i < sz; i++) {
      A.push(new_float_n$3(args));
    }
    return A;
  }
  function new_int_n$1(args) {
    if (args.length == 1) {
      return new_int$8(args[0]);
    }
    var sz = args[0];
    args = args.slice(1);
    var A = [];
    for (var i = 0; i < sz; i++) {
      A.push(new_int_n$1(args));
    }
    return A;
  }
  function new_short_n(args) {
    if (args.length == 1) {
      return new_short(args[0]);
    }
    var sz = args[0];
    args = args.slice(1);
    var A = [];
    for (var i = 0; i < sz; i++) {
      A.push(new_short_n(args));
    }
    return A;
  }
  function new_array_n(args) {
    if (args.length == 1) {
      return new Array(args[0]);
    }
    var sz = args[0];
    args = args.slice(1);
    var A = [];
    for (var i = 0; i < sz; i++) {
      A.push(new_array_n(args));
    }
    return A;
  }
  var Arrays$3 = {};
  Arrays$3.fill = function(a, fromIndex, toIndex, val) {
    if (arguments.length == 2) {
      for (var i = 0; i < a.length; i++) {
        a[i] = arguments[1];
      }
    } else {
      for (var i = fromIndex; i < toIndex; i++) {
        a[i] = val;
      }
    }
  };
  var System$3 = {};
  System$3.arraycopy = function(src, srcPos, dest, destPos, length) {
    var srcEnd = srcPos + length;
    while (srcPos < srcEnd)
      dest[destPos++] = src[srcPos++];
  };
  System$3.out = {};
  System$3.out.println = function(message) {
    console.log(message);
  };
  System$3.out.printf = function() {
    console.log.apply(console, arguments);
  };
  var Util$2 = {};
  Util$2.SQRT2 = 1.4142135623730951;
  Util$2.FAST_LOG10 = function(x) {
    return Math.log10(x);
  };
  Util$2.FAST_LOG10_X = function(x, y) {
    return Math.log10(x) * y;
  };
  function ShortBlock$2(ordinal) {
    this.ordinal = ordinal;
  }
  ShortBlock$2.short_block_allowed = new ShortBlock$2(0);
  ShortBlock$2.short_block_coupled = new ShortBlock$2(1);
  ShortBlock$2.short_block_dispensed = new ShortBlock$2(2);
  ShortBlock$2.short_block_forced = new ShortBlock$2(3);
  var Float$1 = {};
  Float$1.MAX_VALUE = 34028235e31;
  function VbrMode$2(ordinal) {
    this.ordinal = ordinal;
  }
  VbrMode$2.vbr_off = new VbrMode$2(0);
  VbrMode$2.vbr_mt = new VbrMode$2(1);
  VbrMode$2.vbr_rh = new VbrMode$2(2);
  VbrMode$2.vbr_abr = new VbrMode$2(3);
  VbrMode$2.vbr_mtrh = new VbrMode$2(4);
  VbrMode$2.vbr_default = VbrMode$2.vbr_mtrh;
  var assert$3 = function(x) {
  };
  var common$h = {
    "System": System$3,
    "VbrMode": VbrMode$2,
    "Float": Float$1,
    "ShortBlock": ShortBlock$2,
    "Util": Util$2,
    "Arrays": Arrays$3,
    "new_array_n": new_array_n,
    "new_byte": new_byte$2,
    "new_double": new_double$1,
    "new_float": new_float$8,
    "new_float_n": new_float_n$3,
    "new_int": new_int$8,
    "new_int_n": new_int_n$1,
    "new_short": new_short,
    "new_short_n": new_short_n,
    "assert": assert$3
  };
  function MPEGMode$2(ordinal) {
    var _ordinal = ordinal;
    this.ordinal = function() {
      return _ordinal;
    };
  }
  MPEGMode$2.STEREO = new MPEGMode$2(0);
  MPEGMode$2.JOINT_STEREO = new MPEGMode$2(1);
  MPEGMode$2.DUAL_CHANNEL = new MPEGMode$2(2);
  MPEGMode$2.MONO = new MPEGMode$2(3);
  MPEGMode$2.NOT_SET = new MPEGMode$2(4);
  var MPEGMode_1 = MPEGMode$2;
  var NewMDCT_1;
  var hasRequiredNewMDCT;
  function requireNewMDCT() {
    if (hasRequiredNewMDCT) return NewMDCT_1;
    hasRequiredNewMDCT = 1;
    var common2 = common$h;
    var System2 = common2.System;
    var Util2 = common2.Util;
    var Arrays2 = common2.Arrays;
    var new_float2 = common2.new_float;
    var Encoder2 = requireEncoder();
    function NewMDCT() {
      var enwindow = [
        -477e-9 * 0.740951125354959 / 2384e-9,
        103951e-9 * 0.740951125354959 / 2384e-9,
        953674e-9 * 0.740951125354959 / 2384e-9,
        2841473e-9 * 0.740951125354959 / 2384e-9,
        0.035758972 * 0.740951125354959 / 2384e-9,
        3401756e-9 * 0.740951125354959 / 2384e-9,
        983715e-9 * 0.740951125354959 / 2384e-9,
        99182e-9 * 0.740951125354959 / 2384e-9,
        /* 15 */
        12398e-9 * 0.740951125354959 / 2384e-9,
        191212e-9 * 0.740951125354959 / 2384e-9,
        2283096e-9 * 0.740951125354959 / 2384e-9,
        0.016994476 * 0.740951125354959 / 2384e-9,
        -0.018756866 * 0.740951125354959 / 2384e-9,
        -2630711e-9 * 0.740951125354959 / 2384e-9,
        -247478e-9 * 0.740951125354959 / 2384e-9,
        -14782e-9 * 0.740951125354959 / 2384e-9,
        0.9063471690191471,
        0.1960342806591213,
        -477e-9 * 0.773010453362737 / 2384e-9,
        105858e-9 * 0.773010453362737 / 2384e-9,
        930786e-9 * 0.773010453362737 / 2384e-9,
        2521515e-9 * 0.773010453362737 / 2384e-9,
        0.035694122 * 0.773010453362737 / 2384e-9,
        3643036e-9 * 0.773010453362737 / 2384e-9,
        991821e-9 * 0.773010453362737 / 2384e-9,
        96321e-9 * 0.773010453362737 / 2384e-9,
        /* 14 */
        11444e-9 * 0.773010453362737 / 2384e-9,
        165462e-9 * 0.773010453362737 / 2384e-9,
        2110004e-9 * 0.773010453362737 / 2384e-9,
        0.016112804 * 0.773010453362737 / 2384e-9,
        -0.019634247 * 0.773010453362737 / 2384e-9,
        -2803326e-9 * 0.773010453362737 / 2384e-9,
        -277042e-9 * 0.773010453362737 / 2384e-9,
        -16689e-9 * 0.773010453362737 / 2384e-9,
        0.8206787908286602,
        0.3901806440322567,
        -477e-9 * 0.803207531480645 / 2384e-9,
        107288e-9 * 0.803207531480645 / 2384e-9,
        902653e-9 * 0.803207531480645 / 2384e-9,
        2174854e-9 * 0.803207531480645 / 2384e-9,
        0.035586357 * 0.803207531480645 / 2384e-9,
        3858566e-9 * 0.803207531480645 / 2384e-9,
        995159e-9 * 0.803207531480645 / 2384e-9,
        9346e-8 * 0.803207531480645 / 2384e-9,
        /* 13 */
        10014e-9 * 0.803207531480645 / 2384e-9,
        14019e-8 * 0.803207531480645 / 2384e-9,
        1937389e-9 * 0.803207531480645 / 2384e-9,
        0.015233517 * 0.803207531480645 / 2384e-9,
        -0.020506859 * 0.803207531480645 / 2384e-9,
        -2974033e-9 * 0.803207531480645 / 2384e-9,
        -30756e-8 * 0.803207531480645 / 2384e-9,
        -1812e-8 * 0.803207531480645 / 2384e-9,
        0.7416505462720353,
        0.5805693545089249,
        -477e-9 * 0.831469612302545 / 2384e-9,
        108242e-9 * 0.831469612302545 / 2384e-9,
        868797e-9 * 0.831469612302545 / 2384e-9,
        1800537e-9 * 0.831469612302545 / 2384e-9,
        0.0354352 * 0.831469612302545 / 2384e-9,
        4049301e-9 * 0.831469612302545 / 2384e-9,
        994205e-9 * 0.831469612302545 / 2384e-9,
        90599e-9 * 0.831469612302545 / 2384e-9,
        /* 12 */
        906e-8 * 0.831469612302545 / 2384e-9,
        116348e-9 * 0.831469612302545 / 2384e-9,
        1766682e-9 * 0.831469612302545 / 2384e-9,
        0.014358521 * 0.831469612302545 / 2384e-9,
        -0.021372318 * 0.831469612302545 / 2384e-9,
        -314188e-8 * 0.831469612302545 / 2384e-9,
        -339031e-9 * 0.831469612302545 / 2384e-9,
        -1955e-8 * 0.831469612302545 / 2384e-9,
        0.6681786379192989,
        0.7653668647301797,
        -477e-9 * 0.857728610000272 / 2384e-9,
        108719e-9 * 0.857728610000272 / 2384e-9,
        82922e-8 * 0.857728610000272 / 2384e-9,
        1399517e-9 * 0.857728610000272 / 2384e-9,
        0.035242081 * 0.857728610000272 / 2384e-9,
        421524e-8 * 0.857728610000272 / 2384e-9,
        989437e-9 * 0.857728610000272 / 2384e-9,
        87261e-9 * 0.857728610000272 / 2384e-9,
        /* 11 */
        8106e-9 * 0.857728610000272 / 2384e-9,
        93937e-9 * 0.857728610000272 / 2384e-9,
        1597881e-9 * 0.857728610000272 / 2384e-9,
        0.013489246 * 0.857728610000272 / 2384e-9,
        -0.022228718 * 0.857728610000272 / 2384e-9,
        -3306866e-9 * 0.857728610000272 / 2384e-9,
        -371456e-9 * 0.857728610000272 / 2384e-9,
        -21458e-9 * 0.857728610000272 / 2384e-9,
        0.5993769336819237,
        0.9427934736519954,
        -477e-9 * 0.881921264348355 / 2384e-9,
        108719e-9 * 0.881921264348355 / 2384e-9,
        78392e-8 * 0.881921264348355 / 2384e-9,
        971317e-9 * 0.881921264348355 / 2384e-9,
        0.035007 * 0.881921264348355 / 2384e-9,
        4357815e-9 * 0.881921264348355 / 2384e-9,
        980854e-9 * 0.881921264348355 / 2384e-9,
        83923e-9 * 0.881921264348355 / 2384e-9,
        /* 10 */
        7629e-9 * 0.881921264348355 / 2384e-9,
        72956e-9 * 0.881921264348355 / 2384e-9,
        1432419e-9 * 0.881921264348355 / 2384e-9,
        0.012627602 * 0.881921264348355 / 2384e-9,
        -0.02307415 * 0.881921264348355 / 2384e-9,
        -3467083e-9 * 0.881921264348355 / 2384e-9,
        -404358e-9 * 0.881921264348355 / 2384e-9,
        -23365e-9 * 0.881921264348355 / 2384e-9,
        0.5345111359507916,
        1.111140466039205,
        -954e-9 * 0.903989293123443 / 2384e-9,
        108242e-9 * 0.903989293123443 / 2384e-9,
        731945e-9 * 0.903989293123443 / 2384e-9,
        515938e-9 * 0.903989293123443 / 2384e-9,
        0.034730434 * 0.903989293123443 / 2384e-9,
        4477024e-9 * 0.903989293123443 / 2384e-9,
        968933e-9 * 0.903989293123443 / 2384e-9,
        80585e-9 * 0.903989293123443 / 2384e-9,
        /* 9 */
        6676e-9 * 0.903989293123443 / 2384e-9,
        52929e-9 * 0.903989293123443 / 2384e-9,
        1269817e-9 * 0.903989293123443 / 2384e-9,
        0.011775017 * 0.903989293123443 / 2384e-9,
        -0.023907185 * 0.903989293123443 / 2384e-9,
        -3622532e-9 * 0.903989293123443 / 2384e-9,
        -438213e-9 * 0.903989293123443 / 2384e-9,
        -25272e-9 * 0.903989293123443 / 2384e-9,
        0.4729647758913199,
        1.268786568327291,
        -954e-9 * 0.9238795325112867 / 2384e-9,
        106812e-9 * 0.9238795325112867 / 2384e-9,
        674248e-9 * 0.9238795325112867 / 2384e-9,
        33379e-9 * 0.9238795325112867 / 2384e-9,
        0.034412861 * 0.9238795325112867 / 2384e-9,
        4573822e-9 * 0.9238795325112867 / 2384e-9,
        954151e-9 * 0.9238795325112867 / 2384e-9,
        76771e-9 * 0.9238795325112867 / 2384e-9,
        6199e-9 * 0.9238795325112867 / 2384e-9,
        34332e-9 * 0.9238795325112867 / 2384e-9,
        1111031e-9 * 0.9238795325112867 / 2384e-9,
        0.010933399 * 0.9238795325112867 / 2384e-9,
        -0.024725437 * 0.9238795325112867 / 2384e-9,
        -3771782e-9 * 0.9238795325112867 / 2384e-9,
        -472546e-9 * 0.9238795325112867 / 2384e-9,
        -27657e-9 * 0.9238795325112867 / 2384e-9,
        0.41421356237309503,
        /* tan(PI/8) */
        1.414213562373095,
        -954e-9 * 0.941544065183021 / 2384e-9,
        105381e-9 * 0.941544065183021 / 2384e-9,
        610352e-9 * 0.941544065183021 / 2384e-9,
        -475883e-9 * 0.941544065183021 / 2384e-9,
        0.03405571 * 0.941544065183021 / 2384e-9,
        4649162e-9 * 0.941544065183021 / 2384e-9,
        935555e-9 * 0.941544065183021 / 2384e-9,
        73433e-9 * 0.941544065183021 / 2384e-9,
        /* 7 */
        5245e-9 * 0.941544065183021 / 2384e-9,
        17166e-9 * 0.941544065183021 / 2384e-9,
        956535e-9 * 0.941544065183021 / 2384e-9,
        0.010103703 * 0.941544065183021 / 2384e-9,
        -0.025527 * 0.941544065183021 / 2384e-9,
        -3914356e-9 * 0.941544065183021 / 2384e-9,
        -507355e-9 * 0.941544065183021 / 2384e-9,
        -30041e-9 * 0.941544065183021 / 2384e-9,
        0.3578057213145241,
        1.546020906725474,
        -954e-9 * 0.956940335732209 / 2384e-9,
        10252e-8 * 0.956940335732209 / 2384e-9,
        539303e-9 * 0.956940335732209 / 2384e-9,
        -1011848e-9 * 0.956940335732209 / 2384e-9,
        0.033659935 * 0.956940335732209 / 2384e-9,
        4703045e-9 * 0.956940335732209 / 2384e-9,
        915051e-9 * 0.956940335732209 / 2384e-9,
        70095e-9 * 0.956940335732209 / 2384e-9,
        /* 6 */
        4768e-9 * 0.956940335732209 / 2384e-9,
        954e-9 * 0.956940335732209 / 2384e-9,
        806808e-9 * 0.956940335732209 / 2384e-9,
        9287834e-9 * 0.956940335732209 / 2384e-9,
        -0.026310921 * 0.956940335732209 / 2384e-9,
        -4048824e-9 * 0.956940335732209 / 2384e-9,
        -542164e-9 * 0.956940335732209 / 2384e-9,
        -32425e-9 * 0.956940335732209 / 2384e-9,
        0.3033466836073424,
        1.66293922460509,
        -1431e-9 * 0.970031253194544 / 2384e-9,
        99182e-9 * 0.970031253194544 / 2384e-9,
        462532e-9 * 0.970031253194544 / 2384e-9,
        -1573563e-9 * 0.970031253194544 / 2384e-9,
        0.033225536 * 0.970031253194544 / 2384e-9,
        4737377e-9 * 0.970031253194544 / 2384e-9,
        891685e-9 * 0.970031253194544 / 2384e-9,
        6628e-8 * 0.970031253194544 / 2384e-9,
        /* 5 */
        4292e-9 * 0.970031253194544 / 2384e-9,
        -13828e-9 * 0.970031253194544 / 2384e-9,
        66185e-8 * 0.970031253194544 / 2384e-9,
        8487225e-9 * 0.970031253194544 / 2384e-9,
        -0.02707386 * 0.970031253194544 / 2384e-9,
        -4174709e-9 * 0.970031253194544 / 2384e-9,
        -576973e-9 * 0.970031253194544 / 2384e-9,
        -34809e-9 * 0.970031253194544 / 2384e-9,
        0.2504869601913055,
        1.76384252869671,
        -1431e-9 * 0.98078528040323 / 2384e-9,
        95367e-9 * 0.98078528040323 / 2384e-9,
        378609e-9 * 0.98078528040323 / 2384e-9,
        -2161503e-9 * 0.98078528040323 / 2384e-9,
        0.032754898 * 0.98078528040323 / 2384e-9,
        4752159e-9 * 0.98078528040323 / 2384e-9,
        866413e-9 * 0.98078528040323 / 2384e-9,
        62943e-9 * 0.98078528040323 / 2384e-9,
        /* 4 */
        3815e-9 * 0.98078528040323 / 2384e-9,
        -2718e-8 * 0.98078528040323 / 2384e-9,
        522137e-9 * 0.98078528040323 / 2384e-9,
        7703304e-9 * 0.98078528040323 / 2384e-9,
        -0.027815342 * 0.98078528040323 / 2384e-9,
        -4290581e-9 * 0.98078528040323 / 2384e-9,
        -611782e-9 * 0.98078528040323 / 2384e-9,
        -3767e-8 * 0.98078528040323 / 2384e-9,
        0.198912367379658,
        1.847759065022573,
        -1907e-9 * 0.989176509964781 / 2384e-9,
        90122e-9 * 0.989176509964781 / 2384e-9,
        288486e-9 * 0.989176509964781 / 2384e-9,
        -2774239e-9 * 0.989176509964781 / 2384e-9,
        0.03224802 * 0.989176509964781 / 2384e-9,
        4748821e-9 * 0.989176509964781 / 2384e-9,
        838757e-9 * 0.989176509964781 / 2384e-9,
        59605e-9 * 0.989176509964781 / 2384e-9,
        /* 3 */
        3338e-9 * 0.989176509964781 / 2384e-9,
        -39577e-9 * 0.989176509964781 / 2384e-9,
        388145e-9 * 0.989176509964781 / 2384e-9,
        6937027e-9 * 0.989176509964781 / 2384e-9,
        -0.028532982 * 0.989176509964781 / 2384e-9,
        -4395962e-9 * 0.989176509964781 / 2384e-9,
        -646591e-9 * 0.989176509964781 / 2384e-9,
        -40531e-9 * 0.989176509964781 / 2384e-9,
        0.1483359875383474,
        1.913880671464418,
        -1907e-9 * 0.995184726672197 / 2384e-9,
        844e-7 * 0.995184726672197 / 2384e-9,
        191689e-9 * 0.995184726672197 / 2384e-9,
        -3411293e-9 * 0.995184726672197 / 2384e-9,
        0.03170681 * 0.995184726672197 / 2384e-9,
        4728317e-9 * 0.995184726672197 / 2384e-9,
        809669e-9 * 0.995184726672197 / 2384e-9,
        5579e-8 * 0.995184726672197 / 2384e-9,
        3338e-9 * 0.995184726672197 / 2384e-9,
        -50545e-9 * 0.995184726672197 / 2384e-9,
        259876e-9 * 0.995184726672197 / 2384e-9,
        6189346e-9 * 0.995184726672197 / 2384e-9,
        -0.029224873 * 0.995184726672197 / 2384e-9,
        -4489899e-9 * 0.995184726672197 / 2384e-9,
        -680923e-9 * 0.995184726672197 / 2384e-9,
        -43392e-9 * 0.995184726672197 / 2384e-9,
        0.09849140335716425,
        1.961570560806461,
        -2384e-9 * 0.998795456205172 / 2384e-9,
        77724e-9 * 0.998795456205172 / 2384e-9,
        88215e-9 * 0.998795456205172 / 2384e-9,
        -4072189e-9 * 0.998795456205172 / 2384e-9,
        0.031132698 * 0.998795456205172 / 2384e-9,
        4691124e-9 * 0.998795456205172 / 2384e-9,
        779152e-9 * 0.998795456205172 / 2384e-9,
        52929e-9 * 0.998795456205172 / 2384e-9,
        2861e-9 * 0.998795456205172 / 2384e-9,
        -60558e-9 * 0.998795456205172 / 2384e-9,
        137329e-9 * 0.998795456205172 / 2384e-9,
        546217e-8 * 0.998795456205172 / 2384e-9,
        -0.02989006 * 0.998795456205172 / 2384e-9,
        -4570484e-9 * 0.998795456205172 / 2384e-9,
        -714302e-9 * 0.998795456205172 / 2384e-9,
        -46253e-9 * 0.998795456205172 / 2384e-9,
        0.04912684976946725,
        1.990369453344394,
        0.035780907 * Util2.SQRT2 * 0.5 / 2384e-9,
        0.017876148 * Util2.SQRT2 * 0.5 / 2384e-9,
        3134727e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        2457142e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        971317e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        218868e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        101566e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        13828e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
        0.030526638 / 2384e-9,
        4638195e-9 / 2384e-9,
        747204e-9 / 2384e-9,
        49591e-9 / 2384e-9,
        4756451e-9 / 2384e-9,
        21458e-9 / 2384e-9,
        -69618e-9 / 2384e-9
        /* 2.384e-06/2.384e-06 */
      ];
      var NS = 12;
      var NL = 36;
      var win = [
        [
          2382191739347913e-28,
          6423305872147834e-28,
          9400849094049688e-28,
          1122435026096556e-27,
          1183840321267481e-27,
          1122435026096556e-27,
          940084909404969e-27,
          6423305872147839e-28,
          2382191739347918e-28,
          5456116108943412e-27,
          4878985199565852e-27,
          4240448995017367e-27,
          3559909094758252e-27,
          2858043359288075e-27,
          2156177623817898e-27,
          1475637723558783e-27,
          8371015190102974e-28,
          2599706096327376e-28,
          -5456116108943412e-27,
          -4878985199565852e-27,
          -4240448995017367e-27,
          -3559909094758252e-27,
          -2858043359288076e-27,
          -2156177623817898e-27,
          -1475637723558783e-27,
          -8371015190102975e-28,
          -2599706096327376e-28,
          -2382191739347923e-28,
          -6423305872147843e-28,
          -9400849094049696e-28,
          -1122435026096556e-27,
          -1183840321267481e-27,
          -1122435026096556e-27,
          -9400849094049694e-28,
          -642330587214784e-27,
          -2382191739347918e-28
        ],
        [
          2382191739347913e-28,
          6423305872147834e-28,
          9400849094049688e-28,
          1122435026096556e-27,
          1183840321267481e-27,
          1122435026096556e-27,
          9400849094049688e-28,
          6423305872147841e-28,
          2382191739347918e-28,
          5456116108943413e-27,
          4878985199565852e-27,
          4240448995017367e-27,
          3559909094758253e-27,
          2858043359288075e-27,
          2156177623817898e-27,
          1475637723558782e-27,
          8371015190102975e-28,
          2599706096327376e-28,
          -5461314069809755e-27,
          -4921085770524055e-27,
          -4343405037091838e-27,
          -3732668368707687e-27,
          -3093523840190885e-27,
          -2430835727329465e-27,
          -1734679010007751e-27,
          -974825365660928e-27,
          -2797435120168326e-28,
          0,
          0,
          0,
          0,
          0,
          0,
          -2283748241799531e-28,
          -4037858874020686e-28,
          -2146547464825323e-28
        ],
        [
          0.1316524975873958,
          /* win[SHORT_TYPE] */
          0.414213562373095,
          0.7673269879789602,
          1.091308501069271,
          /* tantab_l */
          1.303225372841206,
          1.56968557711749,
          1.920982126971166,
          2.414213562373094,
          3.171594802363212,
          4.510708503662055,
          7.595754112725146,
          22.90376554843115,
          0.984807753012208,
          /* cx */
          0.6427876096865394,
          0.3420201433256688,
          0.9396926207859084,
          -0.1736481776669303,
          -0.7660444431189779,
          0.8660254037844387,
          0.5,
          -0.5144957554275265,
          /* ca */
          -0.4717319685649723,
          -0.3133774542039019,
          -0.1819131996109812,
          -0.09457419252642064,
          -0.04096558288530405,
          -0.01419856857247115,
          -0.003699974673760037,
          0.8574929257125442,
          /* cs */
          0.8817419973177052,
          0.9496286491027329,
          0.9833145924917901,
          0.9955178160675857,
          0.9991605581781475,
          0.999899195244447,
          0.9999931550702802
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          2283748241799531e-28,
          4037858874020686e-28,
          2146547464825323e-28,
          5461314069809755e-27,
          4921085770524055e-27,
          4343405037091838e-27,
          3732668368707687e-27,
          3093523840190885e-27,
          2430835727329466e-27,
          1734679010007751e-27,
          974825365660928e-27,
          2797435120168326e-28,
          -5456116108943413e-27,
          -4878985199565852e-27,
          -4240448995017367e-27,
          -3559909094758253e-27,
          -2858043359288075e-27,
          -2156177623817898e-27,
          -1475637723558782e-27,
          -8371015190102975e-28,
          -2599706096327376e-28,
          -2382191739347913e-28,
          -6423305872147834e-28,
          -9400849094049688e-28,
          -1122435026096556e-27,
          -1183840321267481e-27,
          -1122435026096556e-27,
          -9400849094049688e-28,
          -6423305872147841e-28,
          -2382191739347918e-28
        ]
      ];
      var tantab_l = win[Encoder2.SHORT_TYPE];
      var cx = win[Encoder2.SHORT_TYPE];
      var ca = win[Encoder2.SHORT_TYPE];
      var cs = win[Encoder2.SHORT_TYPE];
      var order = [
        0,
        1,
        16,
        17,
        8,
        9,
        24,
        25,
        4,
        5,
        20,
        21,
        12,
        13,
        28,
        29,
        2,
        3,
        18,
        19,
        10,
        11,
        26,
        27,
        6,
        7,
        22,
        23,
        14,
        15,
        30,
        31
      ];
      function window_subband(x1, x1Pos, a) {
        var wp = 10;
        var x2 = x1Pos + 238 - 14 - 286;
        for (var i = -15; i < 0; i++) {
          var w, s, t;
          w = enwindow[wp + -10];
          s = x1[x2 + -224] * w;
          t = x1[x1Pos + 224] * w;
          w = enwindow[wp + -9];
          s += x1[x2 + -160] * w;
          t += x1[x1Pos + 160] * w;
          w = enwindow[wp + -8];
          s += x1[x2 + -96] * w;
          t += x1[x1Pos + 96] * w;
          w = enwindow[wp + -7];
          s += x1[x2 + -32] * w;
          t += x1[x1Pos + 32] * w;
          w = enwindow[wp + -6];
          s += x1[x2 + 32] * w;
          t += x1[x1Pos + -32] * w;
          w = enwindow[wp + -5];
          s += x1[x2 + 96] * w;
          t += x1[x1Pos + -96] * w;
          w = enwindow[wp + -4];
          s += x1[x2 + 160] * w;
          t += x1[x1Pos + -160] * w;
          w = enwindow[wp + -3];
          s += x1[x2 + 224] * w;
          t += x1[x1Pos + -224] * w;
          w = enwindow[wp + -2];
          s += x1[x1Pos + -256] * w;
          t -= x1[x2 + 256] * w;
          w = enwindow[wp + -1];
          s += x1[x1Pos + -192] * w;
          t -= x1[x2 + 192] * w;
          w = enwindow[wp + 0];
          s += x1[x1Pos + -128] * w;
          t -= x1[x2 + 128] * w;
          w = enwindow[wp + 1];
          s += x1[x1Pos + -64] * w;
          t -= x1[x2 + 64] * w;
          w = enwindow[wp + 2];
          s += x1[x1Pos + 0] * w;
          t -= x1[x2 + 0] * w;
          w = enwindow[wp + 3];
          s += x1[x1Pos + 64] * w;
          t -= x1[x2 + -64] * w;
          w = enwindow[wp + 4];
          s += x1[x1Pos + 128] * w;
          t -= x1[x2 + -128] * w;
          w = enwindow[wp + 5];
          s += x1[x1Pos + 192] * w;
          t -= x1[x2 + -192] * w;
          s *= enwindow[wp + 6];
          w = t - s;
          a[30 + i * 2] = t + s;
          a[31 + i * 2] = enwindow[wp + 7] * w;
          wp += 18;
          x1Pos--;
          x2++;
        }
        {
          var s, t, u, v;
          t = x1[x1Pos + -16] * enwindow[wp + -10];
          s = x1[x1Pos + -32] * enwindow[wp + -2];
          t += (x1[x1Pos + -48] - x1[x1Pos + 16]) * enwindow[wp + -9];
          s += x1[x1Pos + -96] * enwindow[wp + -1];
          t += (x1[x1Pos + -80] + x1[x1Pos + 48]) * enwindow[wp + -8];
          s += x1[x1Pos + -160] * enwindow[wp + 0];
          t += (x1[x1Pos + -112] - x1[x1Pos + 80]) * enwindow[wp + -7];
          s += x1[x1Pos + -224] * enwindow[wp + 1];
          t += (x1[x1Pos + -144] + x1[x1Pos + 112]) * enwindow[wp + -6];
          s -= x1[x1Pos + 32] * enwindow[wp + 2];
          t += (x1[x1Pos + -176] - x1[x1Pos + 144]) * enwindow[wp + -5];
          s -= x1[x1Pos + 96] * enwindow[wp + 3];
          t += (x1[x1Pos + -208] + x1[x1Pos + 176]) * enwindow[wp + -4];
          s -= x1[x1Pos + 160] * enwindow[wp + 4];
          t += (x1[x1Pos + -240] - x1[x1Pos + 208]) * enwindow[wp + -3];
          s -= x1[x1Pos + 224];
          u = s - t;
          v = s + t;
          t = a[14];
          s = a[15] - t;
          a[31] = v + t;
          a[30] = u + s;
          a[15] = u - s;
          a[14] = v - t;
        }
        {
          var xr;
          xr = a[28] - a[0];
          a[0] += a[28];
          a[28] = xr * enwindow[wp + -2 * 18 + 7];
          xr = a[29] - a[1];
          a[1] += a[29];
          a[29] = xr * enwindow[wp + -2 * 18 + 7];
          xr = a[26] - a[2];
          a[2] += a[26];
          a[26] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[27] - a[3];
          a[3] += a[27];
          a[27] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[24] - a[4];
          a[4] += a[24];
          a[24] = xr * enwindow[wp + -6 * 18 + 7];
          xr = a[25] - a[5];
          a[5] += a[25];
          a[25] = xr * enwindow[wp + -6 * 18 + 7];
          xr = a[22] - a[6];
          a[6] += a[22];
          a[22] = xr * Util2.SQRT2;
          xr = a[23] - a[7];
          a[7] += a[23];
          a[23] = xr * Util2.SQRT2 - a[7];
          a[7] -= a[6];
          a[22] -= a[7];
          a[23] -= a[22];
          xr = a[6];
          a[6] = a[31] - xr;
          a[31] = a[31] + xr;
          xr = a[7];
          a[7] = a[30] - xr;
          a[30] = a[30] + xr;
          xr = a[22];
          a[22] = a[15] - xr;
          a[15] = a[15] + xr;
          xr = a[23];
          a[23] = a[14] - xr;
          a[14] = a[14] + xr;
          xr = a[20] - a[8];
          a[8] += a[20];
          a[20] = xr * enwindow[wp + -10 * 18 + 7];
          xr = a[21] - a[9];
          a[9] += a[21];
          a[21] = xr * enwindow[wp + -10 * 18 + 7];
          xr = a[18] - a[10];
          a[10] += a[18];
          a[18] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[19] - a[11];
          a[11] += a[19];
          a[19] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[16] - a[12];
          a[12] += a[16];
          a[16] = xr * enwindow[wp + -14 * 18 + 7];
          xr = a[17] - a[13];
          a[13] += a[17];
          a[17] = xr * enwindow[wp + -14 * 18 + 7];
          xr = -a[20] + a[24];
          a[20] += a[24];
          a[24] = xr * enwindow[wp + -12 * 18 + 7];
          xr = -a[21] + a[25];
          a[21] += a[25];
          a[25] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[4] - a[8];
          a[4] += a[8];
          a[8] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[5] - a[9];
          a[5] += a[9];
          a[9] = xr * enwindow[wp + -12 * 18 + 7];
          xr = a[0] - a[12];
          a[0] += a[12];
          a[12] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[1] - a[13];
          a[1] += a[13];
          a[13] = xr * enwindow[wp + -4 * 18 + 7];
          xr = a[16] - a[28];
          a[16] += a[28];
          a[28] = xr * enwindow[wp + -4 * 18 + 7];
          xr = -a[17] + a[29];
          a[17] += a[29];
          a[29] = xr * enwindow[wp + -4 * 18 + 7];
          xr = Util2.SQRT2 * (a[2] - a[10]);
          a[2] += a[10];
          a[10] = xr;
          xr = Util2.SQRT2 * (a[3] - a[11]);
          a[3] += a[11];
          a[11] = xr;
          xr = Util2.SQRT2 * (-a[18] + a[26]);
          a[18] += a[26];
          a[26] = xr - a[18];
          xr = Util2.SQRT2 * (-a[19] + a[27]);
          a[19] += a[27];
          a[27] = xr - a[19];
          xr = a[2];
          a[19] -= a[3];
          a[3] -= xr;
          a[2] = a[31] - xr;
          a[31] += xr;
          xr = a[3];
          a[11] -= a[19];
          a[18] -= xr;
          a[3] = a[30] - xr;
          a[30] += xr;
          xr = a[18];
          a[27] -= a[11];
          a[19] -= xr;
          a[18] = a[15] - xr;
          a[15] += xr;
          xr = a[19];
          a[10] -= xr;
          a[19] = a[14] - xr;
          a[14] += xr;
          xr = a[10];
          a[11] -= xr;
          a[10] = a[23] - xr;
          a[23] += xr;
          xr = a[11];
          a[26] -= xr;
          a[11] = a[22] - xr;
          a[22] += xr;
          xr = a[26];
          a[27] -= xr;
          a[26] = a[7] - xr;
          a[7] += xr;
          xr = a[27];
          a[27] = a[6] - xr;
          a[6] += xr;
          xr = Util2.SQRT2 * (a[0] - a[4]);
          a[0] += a[4];
          a[4] = xr;
          xr = Util2.SQRT2 * (a[1] - a[5]);
          a[1] += a[5];
          a[5] = xr;
          xr = Util2.SQRT2 * (a[16] - a[20]);
          a[16] += a[20];
          a[20] = xr;
          xr = Util2.SQRT2 * (a[17] - a[21]);
          a[17] += a[21];
          a[21] = xr;
          xr = -Util2.SQRT2 * (a[8] - a[12]);
          a[8] += a[12];
          a[12] = xr - a[8];
          xr = -Util2.SQRT2 * (a[9] - a[13]);
          a[9] += a[13];
          a[13] = xr - a[9];
          xr = -Util2.SQRT2 * (a[25] - a[29]);
          a[25] += a[29];
          a[29] = xr - a[25];
          xr = -Util2.SQRT2 * (a[24] + a[28]);
          a[24] -= a[28];
          a[28] = xr - a[24];
          xr = a[24] - a[16];
          a[24] = xr;
          xr = a[20] - xr;
          a[20] = xr;
          xr = a[28] - xr;
          a[28] = xr;
          xr = a[25] - a[17];
          a[25] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[17] - a[1];
          a[17] = xr;
          xr = a[9] - xr;
          a[9] = xr;
          xr = a[25] - xr;
          a[25] = xr;
          xr = a[5] - xr;
          a[5] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[13] - xr;
          a[13] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[1] - a[0];
          a[1] = xr;
          xr = a[16] - xr;
          a[16] = xr;
          xr = a[17] - xr;
          a[17] = xr;
          xr = a[8] - xr;
          a[8] = xr;
          xr = a[9] - xr;
          a[9] = xr;
          xr = a[24] - xr;
          a[24] = xr;
          xr = a[25] - xr;
          a[25] = xr;
          xr = a[4] - xr;
          a[4] = xr;
          xr = a[5] - xr;
          a[5] = xr;
          xr = a[20] - xr;
          a[20] = xr;
          xr = a[21] - xr;
          a[21] = xr;
          xr = a[12] - xr;
          a[12] = xr;
          xr = a[13] - xr;
          a[13] = xr;
          xr = a[28] - xr;
          a[28] = xr;
          xr = a[29] - xr;
          a[29] = xr;
          xr = a[0];
          a[0] += a[31];
          a[31] -= xr;
          xr = a[1];
          a[1] += a[30];
          a[30] -= xr;
          xr = a[16];
          a[16] += a[15];
          a[15] -= xr;
          xr = a[17];
          a[17] += a[14];
          a[14] -= xr;
          xr = a[8];
          a[8] += a[23];
          a[23] -= xr;
          xr = a[9];
          a[9] += a[22];
          a[22] -= xr;
          xr = a[24];
          a[24] += a[7];
          a[7] -= xr;
          xr = a[25];
          a[25] += a[6];
          a[6] -= xr;
          xr = a[4];
          a[4] += a[27];
          a[27] -= xr;
          xr = a[5];
          a[5] += a[26];
          a[26] -= xr;
          xr = a[20];
          a[20] += a[11];
          a[11] -= xr;
          xr = a[21];
          a[21] += a[10];
          a[10] -= xr;
          xr = a[12];
          a[12] += a[19];
          a[19] -= xr;
          xr = a[13];
          a[13] += a[18];
          a[18] -= xr;
          xr = a[28];
          a[28] += a[3];
          a[3] -= xr;
          xr = a[29];
          a[29] += a[2];
          a[2] -= xr;
        }
      }
      function mdct_short(inout, inoutPos) {
        for (var l2 = 0; l2 < 3; l2++) {
          var tc0, tc1, tc2, ts0, ts1, ts2;
          ts0 = inout[inoutPos + 2 * 3] * win[Encoder2.SHORT_TYPE][0] - inout[inoutPos + 5 * 3];
          tc0 = inout[inoutPos + 0 * 3] * win[Encoder2.SHORT_TYPE][2] - inout[inoutPos + 3 * 3];
          tc1 = ts0 + tc0;
          tc2 = ts0 - tc0;
          ts0 = inout[inoutPos + 5 * 3] * win[Encoder2.SHORT_TYPE][0] + inout[inoutPos + 2 * 3];
          tc0 = inout[inoutPos + 3 * 3] * win[Encoder2.SHORT_TYPE][2] + inout[inoutPos + 0 * 3];
          ts1 = ts0 + tc0;
          ts2 = -ts0 + tc0;
          tc0 = (inout[inoutPos + 1 * 3] * win[Encoder2.SHORT_TYPE][1] - inout[inoutPos + 4 * 3]) * 2069978111953089e-26;
          ts0 = (inout[inoutPos + 4 * 3] * win[Encoder2.SHORT_TYPE][1] + inout[inoutPos + 1 * 3]) * 2069978111953089e-26;
          inout[inoutPos + 3 * 0] = tc1 * 190752519173728e-25 + tc0;
          inout[inoutPos + 3 * 5] = -ts1 * 190752519173728e-25 + ts0;
          tc2 = tc2 * 0.8660254037844387 * 1907525191737281e-26;
          ts1 = ts1 * 0.5 * 1907525191737281e-26 + ts0;
          inout[inoutPos + 3 * 1] = tc2 - ts1;
          inout[inoutPos + 3 * 2] = tc2 + ts1;
          tc1 = tc1 * 0.5 * 1907525191737281e-26 - tc0;
          ts2 = ts2 * 0.8660254037844387 * 1907525191737281e-26;
          inout[inoutPos + 3 * 3] = tc1 + ts2;
          inout[inoutPos + 3 * 4] = tc1 - ts2;
          inoutPos++;
        }
      }
      function mdct_long(out, outPos, _in) {
        var ct, st;
        {
          var tc1, tc2, tc3, tc4, ts5, ts6, ts7, ts8;
          tc1 = _in[17] - _in[9];
          tc3 = _in[15] - _in[11];
          tc4 = _in[14] - _in[12];
          ts5 = _in[0] + _in[8];
          ts6 = _in[1] + _in[7];
          ts7 = _in[2] + _in[6];
          ts8 = _in[3] + _in[5];
          out[outPos + 17] = ts5 + ts7 - ts8 - (ts6 - _in[4]);
          st = (ts5 + ts7 - ts8) * cx[12 + 7] + (ts6 - _in[4]);
          ct = (tc1 - tc3 - tc4) * cx[12 + 6];
          out[outPos + 5] = ct + st;
          out[outPos + 6] = ct - st;
          tc2 = (_in[16] - _in[10]) * cx[12 + 6];
          ts6 = ts6 * cx[12 + 7] + _in[4];
          ct = tc1 * cx[12 + 0] + tc2 + tc3 * cx[12 + 1] + tc4 * cx[12 + 2];
          st = -ts5 * cx[12 + 4] + ts6 - ts7 * cx[12 + 5] + ts8 * cx[12 + 3];
          out[outPos + 1] = ct + st;
          out[outPos + 2] = ct - st;
          ct = tc1 * cx[12 + 1] - tc2 - tc3 * cx[12 + 2] + tc4 * cx[12 + 0];
          st = -ts5 * cx[12 + 5] + ts6 - ts7 * cx[12 + 3] + ts8 * cx[12 + 4];
          out[outPos + 9] = ct + st;
          out[outPos + 10] = ct - st;
          ct = tc1 * cx[12 + 2] - tc2 + tc3 * cx[12 + 0] - tc4 * cx[12 + 1];
          st = ts5 * cx[12 + 3] - ts6 + ts7 * cx[12 + 4] - ts8 * cx[12 + 5];
          out[outPos + 13] = ct + st;
          out[outPos + 14] = ct - st;
        }
        {
          var ts1, ts2, ts3, ts4, tc5, tc6, tc7, tc8;
          ts1 = _in[8] - _in[0];
          ts3 = _in[6] - _in[2];
          ts4 = _in[5] - _in[3];
          tc5 = _in[17] + _in[9];
          tc6 = _in[16] + _in[10];
          tc7 = _in[15] + _in[11];
          tc8 = _in[14] + _in[12];
          out[outPos + 0] = tc5 + tc7 + tc8 + (tc6 + _in[13]);
          ct = (tc5 + tc7 + tc8) * cx[12 + 7] - (tc6 + _in[13]);
          st = (ts1 - ts3 + ts4) * cx[12 + 6];
          out[outPos + 11] = ct + st;
          out[outPos + 12] = ct - st;
          ts2 = (_in[7] - _in[1]) * cx[12 + 6];
          tc6 = _in[13] - tc6 * cx[12 + 7];
          ct = tc5 * cx[12 + 3] - tc6 + tc7 * cx[12 + 4] + tc8 * cx[12 + 5];
          st = ts1 * cx[12 + 2] + ts2 + ts3 * cx[12 + 0] + ts4 * cx[12 + 1];
          out[outPos + 3] = ct + st;
          out[outPos + 4] = ct - st;
          ct = -tc5 * cx[12 + 5] + tc6 - tc7 * cx[12 + 3] - tc8 * cx[12 + 4];
          st = ts1 * cx[12 + 1] + ts2 - ts3 * cx[12 + 2] - ts4 * cx[12 + 0];
          out[outPos + 7] = ct + st;
          out[outPos + 8] = ct - st;
          ct = -tc5 * cx[12 + 4] + tc6 - tc7 * cx[12 + 5] - tc8 * cx[12 + 3];
          st = ts1 * cx[12 + 0] - ts2 + ts3 * cx[12 + 1] - ts4 * cx[12 + 2];
          out[outPos + 15] = ct + st;
          out[outPos + 16] = ct - st;
        }
      }
      this.mdct_sub48 = function(gfc, w0, w1) {
        var wk = w0;
        var wkPos = 286;
        for (var ch = 0; ch < gfc.channels_out; ch++) {
          for (var gr = 0; gr < gfc.mode_gr; gr++) {
            var band;
            var gi = gfc.l3_side.tt[gr][ch];
            var mdct_enc = gi.xr;
            var mdct_encPos = 0;
            var samp = gfc.sb_sample[ch][1 - gr];
            var sampPos = 0;
            for (var k2 = 0; k2 < 18 / 2; k2++) {
              window_subband(wk, wkPos, samp[sampPos]);
              window_subband(wk, wkPos + 32, samp[sampPos + 1]);
              sampPos += 2;
              wkPos += 64;
              for (band = 1; band < 32; band += 2) {
                samp[sampPos - 1][band] *= -1;
              }
            }
            for (band = 0; band < 32; band++, mdct_encPos += 18) {
              var type = gi.block_type;
              var band0 = gfc.sb_sample[ch][gr];
              var band1 = gfc.sb_sample[ch][1 - gr];
              if (gi.mixed_block_flag != 0 && band < 2)
                type = 0;
              if (gfc.amp_filter[band] < 1e-12) {
                Arrays2.fill(
                  mdct_enc,
                  mdct_encPos + 0,
                  mdct_encPos + 18,
                  0
                );
              } else {
                if (gfc.amp_filter[band] < 1) {
                  for (var k2 = 0; k2 < 18; k2++)
                    band1[k2][order[band]] *= gfc.amp_filter[band];
                }
                if (type == Encoder2.SHORT_TYPE) {
                  for (var k2 = -NS / 4; k2 < 0; k2++) {
                    var w = win[Encoder2.SHORT_TYPE][k2 + 3];
                    mdct_enc[mdct_encPos + k2 * 3 + 9] = band0[9 + k2][order[band]] * w - band0[8 - k2][order[band]];
                    mdct_enc[mdct_encPos + k2 * 3 + 18] = band0[14 - k2][order[band]] * w + band0[15 + k2][order[band]];
                    mdct_enc[mdct_encPos + k2 * 3 + 10] = band0[15 + k2][order[band]] * w - band0[14 - k2][order[band]];
                    mdct_enc[mdct_encPos + k2 * 3 + 19] = band1[2 - k2][order[band]] * w + band1[3 + k2][order[band]];
                    mdct_enc[mdct_encPos + k2 * 3 + 11] = band1[3 + k2][order[band]] * w - band1[2 - k2][order[band]];
                    mdct_enc[mdct_encPos + k2 * 3 + 20] = band1[8 - k2][order[band]] * w + band1[9 + k2][order[band]];
                  }
                  mdct_short(mdct_enc, mdct_encPos);
                } else {
                  var work = new_float2(18);
                  for (var k2 = -NL / 4; k2 < 0; k2++) {
                    var a, b;
                    a = win[type][k2 + 27] * band1[k2 + 9][order[band]] + win[type][k2 + 36] * band1[8 - k2][order[band]];
                    b = win[type][k2 + 9] * band0[k2 + 9][order[band]] - win[type][k2 + 18] * band0[8 - k2][order[band]];
                    work[k2 + 9] = a - b * tantab_l[3 + k2 + 9];
                    work[k2 + 18] = a * tantab_l[3 + k2 + 9] + b;
                  }
                  mdct_long(mdct_enc, mdct_encPos, work);
                }
              }
              if (type != Encoder2.SHORT_TYPE && band != 0) {
                for (var k2 = 7; k2 >= 0; --k2) {
                  var bu, bd;
                  bu = mdct_enc[mdct_encPos + k2] * ca[20 + k2] + mdct_enc[mdct_encPos + -1 - k2] * cs[28 + k2];
                  bd = mdct_enc[mdct_encPos + k2] * cs[28 + k2] - mdct_enc[mdct_encPos + -1 - k2] * ca[20 + k2];
                  mdct_enc[mdct_encPos + -1 - k2] = bu;
                  mdct_enc[mdct_encPos + k2] = bd;
                }
              }
            }
          }
          wk = w1;
          wkPos = 286;
          if (gfc.mode_gr == 1) {
            for (var i = 0; i < 18; i++) {
              System2.arraycopy(
                gfc.sb_sample[ch][1][i],
                0,
                gfc.sb_sample[ch][0][i],
                0,
                32
              );
            }
          }
        }
      };
    }
    NewMDCT_1 = NewMDCT;
    return NewMDCT_1;
  }
  var III_psy_xmin_1;
  var hasRequiredIII_psy_xmin;
  function requireIII_psy_xmin() {
    if (hasRequiredIII_psy_xmin) return III_psy_xmin_1;
    hasRequiredIII_psy_xmin = 1;
    var Encoder2 = requireEncoder();
    var common2 = common$h;
    var System2 = common2.System;
    var new_float2 = common2.new_float;
    var new_float_n2 = common2.new_float_n;
    function III_psy_xmin2() {
      this.l = new_float2(Encoder2.SBMAX_l);
      this.s = new_float_n2([Encoder2.SBMAX_s, 3]);
      var self2 = this;
      this.assign = function(iii_psy_xmin) {
        System2.arraycopy(iii_psy_xmin.l, 0, self2.l, 0, Encoder2.SBMAX_l);
        for (var i = 0; i < Encoder2.SBMAX_s; i++) {
          for (var j = 0; j < 3; j++) {
            self2.s[i][j] = iii_psy_xmin.s[i][j];
          }
        }
      };
    }
    III_psy_xmin_1 = III_psy_xmin2;
    return III_psy_xmin_1;
  }
  var III_psy_ratio_1;
  var hasRequiredIII_psy_ratio;
  function requireIII_psy_ratio() {
    if (hasRequiredIII_psy_ratio) return III_psy_ratio_1;
    hasRequiredIII_psy_ratio = 1;
    var III_psy_xmin2 = requireIII_psy_xmin();
    function III_psy_ratio() {
      this.thm = new III_psy_xmin2();
      this.en = new III_psy_xmin2();
    }
    III_psy_ratio_1 = III_psy_ratio;
    return III_psy_ratio_1;
  }
  var Encoder_1;
  var hasRequiredEncoder;
  function requireEncoder() {
    if (hasRequiredEncoder) return Encoder_1;
    hasRequiredEncoder = 1;
    var common2 = common$h;
    var System2 = common2.System;
    var VbrMode2 = common2.VbrMode;
    var new_array_n2 = common2.new_array_n;
    var new_float2 = common2.new_float;
    var new_float_n2 = common2.new_float_n;
    var new_int2 = common2.new_int;
    var assert2 = common2.assert;
    var MPEGMode2 = MPEGMode_1;
    Encoder2.ENCDELAY = 576;
    Encoder2.POSTDELAY = 1152;
    Encoder2.MDCTDELAY = 48;
    Encoder2.FFTOFFSET = 224 + Encoder2.MDCTDELAY;
    Encoder2.DECDELAY = 528;
    Encoder2.SBLIMIT = 32;
    Encoder2.CBANDS = 64;
    Encoder2.SBPSY_l = 21;
    Encoder2.SBPSY_s = 12;
    Encoder2.SBMAX_l = 22;
    Encoder2.SBMAX_s = 13;
    Encoder2.PSFB21 = 6;
    Encoder2.PSFB12 = 6;
    Encoder2.BLKSIZE = 1024;
    Encoder2.HBLKSIZE = Encoder2.BLKSIZE / 2 + 1;
    Encoder2.BLKSIZE_s = 256;
    Encoder2.HBLKSIZE_s = Encoder2.BLKSIZE_s / 2 + 1;
    Encoder2.NORM_TYPE = 0;
    Encoder2.START_TYPE = 1;
    Encoder2.SHORT_TYPE = 2;
    Encoder2.STOP_TYPE = 3;
    Encoder2.MPG_MD_LR_LR = 0;
    Encoder2.MPG_MD_LR_I = 1;
    Encoder2.MPG_MD_MS_LR = 2;
    Encoder2.MPG_MD_MS_I = 3;
    Encoder2.fircoef = [
      -0.0207887 * 5,
      -0.0378413 * 5,
      -0.0432472 * 5,
      -0.031183 * 5,
      779609e-23 * 5,
      0.0467745 * 5,
      0.10091 * 5,
      0.151365 * 5,
      0.187098 * 5
    ];
    function Encoder2() {
      var NewMDCT = requireNewMDCT();
      var III_psy_ratio = requireIII_psy_ratio();
      var FFTOFFSET = Encoder2.FFTOFFSET;
      var MPG_MD_MS_LR = Encoder2.MPG_MD_MS_LR;
      var bs = null;
      this.psy = null;
      var psy = null;
      var vbr = null;
      var qupvt = null;
      this.setModules = function(_bs, _psy, _qupvt, _vbr) {
        bs = _bs;
        this.psy = _psy;
        psy = _psy;
        vbr = _vbr;
        qupvt = _qupvt;
      };
      var newMDCT = new NewMDCT();
      function adjust_ATH(gfc) {
        var gr2_max, max_pow;
        if (gfc.ATH.useAdjust == 0) {
          gfc.ATH.adjust = 1;
          return;
        }
        max_pow = gfc.loudness_sq[0][0];
        gr2_max = gfc.loudness_sq[1][0];
        if (gfc.channels_out == 2) {
          max_pow += gfc.loudness_sq[0][1];
          gr2_max += gfc.loudness_sq[1][1];
        } else {
          max_pow += max_pow;
          gr2_max += gr2_max;
        }
        if (gfc.mode_gr == 2) {
          max_pow = Math.max(max_pow, gr2_max);
        }
        max_pow *= 0.5;
        max_pow *= gfc.ATH.aaSensitivityP;
        if (max_pow > 0.03125) {
          if (gfc.ATH.adjust >= 1) {
            gfc.ATH.adjust = 1;
          } else {
            if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
              gfc.ATH.adjust = gfc.ATH.adjustLimit;
            }
          }
          gfc.ATH.adjustLimit = 1;
        } else {
          var adj_lim_new = 31.98 * max_pow + 625e-6;
          if (gfc.ATH.adjust >= adj_lim_new) {
            gfc.ATH.adjust *= adj_lim_new * 0.075 + 0.925;
            if (gfc.ATH.adjust < adj_lim_new) {
              gfc.ATH.adjust = adj_lim_new;
            }
          } else {
            if (gfc.ATH.adjustLimit >= adj_lim_new) {
              gfc.ATH.adjust = adj_lim_new;
            } else {
              if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
                gfc.ATH.adjust = gfc.ATH.adjustLimit;
              }
            }
          }
          gfc.ATH.adjustLimit = adj_lim_new;
        }
      }
      function updateStats(gfc) {
        var gr, ch;
        assert2(0 <= gfc.bitrate_index && gfc.bitrate_index < 16);
        assert2(0 <= gfc.mode_ext && gfc.mode_ext < 4);
        gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][4]++;
        gfc.bitrate_stereoMode_Hist[15][4]++;
        if (gfc.channels_out == 2) {
          gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][gfc.mode_ext]++;
          gfc.bitrate_stereoMode_Hist[15][gfc.mode_ext]++;
        }
        for (gr = 0; gr < gfc.mode_gr; ++gr) {
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            var bt = gfc.l3_side.tt[gr][ch].block_type | 0;
            if (gfc.l3_side.tt[gr][ch].mixed_block_flag != 0)
              bt = 4;
            gfc.bitrate_blockType_Hist[gfc.bitrate_index][bt]++;
            gfc.bitrate_blockType_Hist[gfc.bitrate_index][5]++;
            gfc.bitrate_blockType_Hist[15][bt]++;
            gfc.bitrate_blockType_Hist[15][5]++;
          }
        }
      }
      function lame_encode_frame_init(gfp, inbuf) {
        var gfc = gfp.internal_flags;
        var ch, gr;
        if (gfc.lame_encode_frame_init == 0) {
          var i, j;
          var primebuff0 = new_float2(286 + 1152 + 576);
          var primebuff1 = new_float2(286 + 1152 + 576);
          gfc.lame_encode_frame_init = 1;
          for (i = 0, j = 0; i < 286 + 576 * (1 + gfc.mode_gr); ++i) {
            if (i < 576 * gfc.mode_gr) {
              primebuff0[i] = 0;
              if (gfc.channels_out == 2)
                primebuff1[i] = 0;
            } else {
              primebuff0[i] = inbuf[0][j];
              if (gfc.channels_out == 2)
                primebuff1[i] = inbuf[1][j];
              ++j;
            }
          }
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              gfc.l3_side.tt[gr][ch].block_type = Encoder2.SHORT_TYPE;
            }
          }
          newMDCT.mdct_sub48(gfc, primebuff0, primebuff1);
          assert2(576 >= Encoder2.FFTOFFSET);
          assert2(gfc.mf_size >= Encoder2.BLKSIZE + gfp.framesize - Encoder2.FFTOFFSET);
          assert2(gfc.mf_size >= 512 + gfp.framesize - 32);
        }
      }
      this.lame_encode_mp3_frame = function(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
        var mp3count;
        var masking_LR = new_array_n2([2, 2]);
        masking_LR[0][0] = new III_psy_ratio();
        masking_LR[0][1] = new III_psy_ratio();
        masking_LR[1][0] = new III_psy_ratio();
        masking_LR[1][1] = new III_psy_ratio();
        var masking_MS = new_array_n2([2, 2]);
        masking_MS[0][0] = new III_psy_ratio();
        masking_MS[0][1] = new III_psy_ratio();
        masking_MS[1][0] = new III_psy_ratio();
        masking_MS[1][1] = new III_psy_ratio();
        var masking;
        var inbuf = [null, null];
        var gfc = gfp.internal_flags;
        var tot_ener = new_float_n2([2, 4]);
        var ms_ener_ratio = [0.5, 0.5];
        var pe = [[0, 0], [0, 0]];
        var pe_MS = [[0, 0], [0, 0]];
        var pe_use;
        var ch, gr;
        inbuf[0] = inbuf_l;
        inbuf[1] = inbuf_r;
        if (gfc.lame_encode_frame_init == 0) {
          lame_encode_frame_init(gfp, inbuf);
        }
        gfc.padding = 0;
        if ((gfc.slot_lag -= gfc.frac_SpF) < 0) {
          gfc.slot_lag += gfp.out_samplerate;
          gfc.padding = 1;
        }
        if (gfc.psymodel != 0) {
          var ret;
          var bufp = [null, null];
          var bufpPos = 0;
          var blocktype = new_int2(2);
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              bufp[ch] = inbuf[ch];
              bufpPos = 576 + gr * 576 - Encoder2.FFTOFFSET;
            }
            if (gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) {
              ret = psy.L3psycho_anal_vbr(
                gfp,
                bufp,
                bufpPos,
                gr,
                masking_LR,
                masking_MS,
                pe[gr],
                pe_MS[gr],
                tot_ener[gr],
                blocktype
              );
            } else {
              ret = psy.L3psycho_anal_ns(
                gfp,
                bufp,
                bufpPos,
                gr,
                masking_LR,
                masking_MS,
                pe[gr],
                pe_MS[gr],
                tot_ener[gr],
                blocktype
              );
            }
            if (ret != 0)
              return -4;
            if (gfp.mode == MPEGMode2.JOINT_STEREO) {
              ms_ener_ratio[gr] = tot_ener[gr][2] + tot_ener[gr][3];
              if (ms_ener_ratio[gr] > 0)
                ms_ener_ratio[gr] = tot_ener[gr][3] / ms_ener_ratio[gr];
            }
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var cod_info = gfc.l3_side.tt[gr][ch];
              cod_info.block_type = blocktype[ch];
              cod_info.mixed_block_flag = 0;
            }
          }
        } else {
          for (gr = 0; gr < gfc.mode_gr; gr++)
            for (ch = 0; ch < gfc.channels_out; ch++) {
              gfc.l3_side.tt[gr][ch].block_type = Encoder2.NORM_TYPE;
              gfc.l3_side.tt[gr][ch].mixed_block_flag = 0;
              pe_MS[gr][ch] = pe[gr][ch] = 700;
            }
        }
        adjust_ATH(gfc);
        newMDCT.mdct_sub48(gfc, inbuf[0], inbuf[1]);
        gfc.mode_ext = Encoder2.MPG_MD_LR_LR;
        if (gfp.force_ms) {
          gfc.mode_ext = Encoder2.MPG_MD_MS_LR;
        } else if (gfp.mode == MPEGMode2.JOINT_STEREO) {
          var sum_pe_MS = 0;
          var sum_pe_LR = 0;
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              sum_pe_MS += pe_MS[gr][ch];
              sum_pe_LR += pe[gr][ch];
            }
          }
          if (sum_pe_MS <= 1 * sum_pe_LR) {
            var gi0 = gfc.l3_side.tt[0];
            var gi1 = gfc.l3_side.tt[gfc.mode_gr - 1];
            if (gi0[0].block_type == gi0[1].block_type && gi1[0].block_type == gi1[1].block_type) {
              gfc.mode_ext = Encoder2.MPG_MD_MS_LR;
            }
          }
        }
        if (gfc.mode_ext == MPG_MD_MS_LR) {
          masking = masking_MS;
          pe_use = pe_MS;
        } else {
          masking = masking_LR;
          pe_use = pe;
        }
        if (gfp.analysis && gfc.pinfo != null) {
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              gfc.pinfo.ms_ratio[gr] = gfc.ms_ratio[gr];
              gfc.pinfo.ms_ener_ratio[gr] = ms_ener_ratio[gr];
              gfc.pinfo.blocktype[gr][ch] = gfc.l3_side.tt[gr][ch].block_type;
              gfc.pinfo.pe[gr][ch] = pe_use[gr][ch];
              System2.arraycopy(
                gfc.l3_side.tt[gr][ch].xr,
                0,
                gfc.pinfo.xr[gr][ch],
                0,
                576
              );
              if (gfc.mode_ext == MPG_MD_MS_LR) {
                gfc.pinfo.ers[gr][ch] = gfc.pinfo.ers[gr][ch + 2];
                System2.arraycopy(
                  gfc.pinfo.energy[gr][ch + 2],
                  0,
                  gfc.pinfo.energy[gr][ch],
                  0,
                  gfc.pinfo.energy[gr][ch].length
                );
              }
            }
          }
        }
        if (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_abr) {
          var i;
          var f2;
          for (i = 0; i < 18; i++)
            gfc.nsPsy.pefirbuf[i] = gfc.nsPsy.pefirbuf[i + 1];
          f2 = 0;
          for (gr = 0; gr < gfc.mode_gr; gr++)
            for (ch = 0; ch < gfc.channels_out; ch++)
              f2 += pe_use[gr][ch];
          gfc.nsPsy.pefirbuf[18] = f2;
          f2 = gfc.nsPsy.pefirbuf[9];
          for (i = 0; i < 9; i++)
            f2 += (gfc.nsPsy.pefirbuf[i] + gfc.nsPsy.pefirbuf[18 - i]) * Encoder2.fircoef[i];
          f2 = 670 * 5 * gfc.mode_gr * gfc.channels_out / f2;
          for (gr = 0; gr < gfc.mode_gr; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              pe_use[gr][ch] *= f2;
            }
          }
        }
        gfc.iteration_loop.iteration_loop(gfp, pe_use, ms_ener_ratio, masking);
        bs.format_bitstream(gfp);
        mp3count = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 1);
        if (gfp.bWriteVbrTag)
          vbr.addVbrFrame(gfp);
        if (gfp.analysis && gfc.pinfo != null) {
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var j;
            for (j = 0; j < FFTOFFSET; j++)
              gfc.pinfo.pcmdata[ch][j] = gfc.pinfo.pcmdata[ch][j + gfp.framesize];
            for (j = FFTOFFSET; j < 1600; j++) {
              gfc.pinfo.pcmdata[ch][j] = inbuf[ch][j - FFTOFFSET];
            }
          }
          qupvt.set_frame_pinfo(gfp, masking);
        }
        updateStats(gfc);
        return mp3count;
      };
    }
    Encoder_1 = Encoder2;
    return Encoder_1;
  }
  var common$g = common$h;
  var Util$1 = common$g.Util;
  var new_float$7 = common$g.new_float;
  var Encoder$7 = requireEncoder();
  function FFT$1() {
    var window2 = new_float$7(Encoder$7.BLKSIZE);
    var window_s = new_float$7(Encoder$7.BLKSIZE_s / 2);
    var costab = [
      0.9238795325112867,
      0.3826834323650898,
      0.9951847266721969,
      0.0980171403295606,
      0.9996988186962042,
      0.02454122852291229,
      0.9999811752826011,
      0.006135884649154475
    ];
    function fht(fz, fzPos, n2) {
      var tri = 0;
      var k4;
      var fi;
      var gi;
      n2 <<= 1;
      var fn = fzPos + n2;
      k4 = 4;
      do {
        var s1, c1;
        var i, k1, k2, k3, kx;
        kx = k4 >> 1;
        k1 = k4;
        k2 = k4 << 1;
        k3 = k2 + k1;
        k4 = k2 << 1;
        fi = fzPos;
        gi = fi + kx;
        do {
          var f0, f1, f2, f3;
          f1 = fz[fi + 0] - fz[fi + k1];
          f0 = fz[fi + 0] + fz[fi + k1];
          f3 = fz[fi + k2] - fz[fi + k3];
          f2 = fz[fi + k2] + fz[fi + k3];
          fz[fi + k2] = f0 - f2;
          fz[fi + 0] = f0 + f2;
          fz[fi + k3] = f1 - f3;
          fz[fi + k1] = f1 + f3;
          f1 = fz[gi + 0] - fz[gi + k1];
          f0 = fz[gi + 0] + fz[gi + k1];
          f3 = Util$1.SQRT2 * fz[gi + k3];
          f2 = Util$1.SQRT2 * fz[gi + k2];
          fz[gi + k2] = f0 - f2;
          fz[gi + 0] = f0 + f2;
          fz[gi + k3] = f1 - f3;
          fz[gi + k1] = f1 + f3;
          gi += k4;
          fi += k4;
        } while (fi < fn);
        c1 = costab[tri + 0];
        s1 = costab[tri + 1];
        for (i = 1; i < kx; i++) {
          var c2, s2;
          c2 = 1 - 2 * s1 * s1;
          s2 = 2 * s1 * c1;
          fi = fzPos + i;
          gi = fzPos + k1 - i;
          do {
            var a, b, g0, f0, f1, g1, f2, g2, f3, g3;
            b = s2 * fz[fi + k1] - c2 * fz[gi + k1];
            a = c2 * fz[fi + k1] + s2 * fz[gi + k1];
            f1 = fz[fi + 0] - a;
            f0 = fz[fi + 0] + a;
            g1 = fz[gi + 0] - b;
            g0 = fz[gi + 0] + b;
            b = s2 * fz[fi + k3] - c2 * fz[gi + k3];
            a = c2 * fz[fi + k3] + s2 * fz[gi + k3];
            f3 = fz[fi + k2] - a;
            f2 = fz[fi + k2] + a;
            g3 = fz[gi + k2] - b;
            g2 = fz[gi + k2] + b;
            b = s1 * f2 - c1 * g3;
            a = c1 * f2 + s1 * g3;
            fz[fi + k2] = f0 - a;
            fz[fi + 0] = f0 + a;
            fz[gi + k3] = g1 - b;
            fz[gi + k1] = g1 + b;
            b = c1 * g2 - s1 * f3;
            a = s1 * g2 + c1 * f3;
            fz[gi + k2] = g0 - a;
            fz[gi + 0] = g0 + a;
            fz[fi + k3] = f1 - b;
            fz[fi + k1] = f1 + b;
            gi += k4;
            fi += k4;
          } while (fi < fn);
          c2 = c1;
          c1 = c2 * costab[tri + 0] - s1 * costab[tri + 1];
          s1 = c2 * costab[tri + 1] + s1 * costab[tri + 0];
        }
        tri += 2;
      } while (k4 < n2);
    }
    var rv_tbl = [
      0,
      128,
      64,
      192,
      32,
      160,
      96,
      224,
      16,
      144,
      80,
      208,
      48,
      176,
      112,
      240,
      8,
      136,
      72,
      200,
      40,
      168,
      104,
      232,
      24,
      152,
      88,
      216,
      56,
      184,
      120,
      248,
      4,
      132,
      68,
      196,
      36,
      164,
      100,
      228,
      20,
      148,
      84,
      212,
      52,
      180,
      116,
      244,
      12,
      140,
      76,
      204,
      44,
      172,
      108,
      236,
      28,
      156,
      92,
      220,
      60,
      188,
      124,
      252,
      2,
      130,
      66,
      194,
      34,
      162,
      98,
      226,
      18,
      146,
      82,
      210,
      50,
      178,
      114,
      242,
      10,
      138,
      74,
      202,
      42,
      170,
      106,
      234,
      26,
      154,
      90,
      218,
      58,
      186,
      122,
      250,
      6,
      134,
      70,
      198,
      38,
      166,
      102,
      230,
      22,
      150,
      86,
      214,
      54,
      182,
      118,
      246,
      14,
      142,
      78,
      206,
      46,
      174,
      110,
      238,
      30,
      158,
      94,
      222,
      62,
      190,
      126,
      254
    ];
    this.fft_short = function(gfc, x_real, chn, buffer, bufPos) {
      for (var b = 0; b < 3; b++) {
        var x = Encoder$7.BLKSIZE_s / 2;
        var k2 = 65535 & 576 / 3 * (b + 1);
        var j = Encoder$7.BLKSIZE_s / 8 - 1;
        do {
          var f0, f1, f2, f3, w;
          var i = rv_tbl[j << 2] & 255;
          f0 = window_s[i] * buffer[chn][bufPos + i + k2];
          w = window_s[127 - i] * buffer[chn][bufPos + i + k2 + 128];
          f1 = f0 - w;
          f0 = f0 + w;
          f2 = window_s[i + 64] * buffer[chn][bufPos + i + k2 + 64];
          w = window_s[63 - i] * buffer[chn][bufPos + i + k2 + 192];
          f3 = f2 - w;
          f2 = f2 + w;
          x -= 4;
          x_real[b][x + 0] = f0 + f2;
          x_real[b][x + 2] = f0 - f2;
          x_real[b][x + 1] = f1 + f3;
          x_real[b][x + 3] = f1 - f3;
          f0 = window_s[i + 1] * buffer[chn][bufPos + i + k2 + 1];
          w = window_s[126 - i] * buffer[chn][bufPos + i + k2 + 129];
          f1 = f0 - w;
          f0 = f0 + w;
          f2 = window_s[i + 65] * buffer[chn][bufPos + i + k2 + 65];
          w = window_s[62 - i] * buffer[chn][bufPos + i + k2 + 193];
          f3 = f2 - w;
          f2 = f2 + w;
          x_real[b][x + Encoder$7.BLKSIZE_s / 2 + 0] = f0 + f2;
          x_real[b][x + Encoder$7.BLKSIZE_s / 2 + 2] = f0 - f2;
          x_real[b][x + Encoder$7.BLKSIZE_s / 2 + 1] = f1 + f3;
          x_real[b][x + Encoder$7.BLKSIZE_s / 2 + 3] = f1 - f3;
        } while (--j >= 0);
        fht(x_real[b], x, Encoder$7.BLKSIZE_s / 2);
      }
    };
    this.fft_long = function(gfc, y, chn, buffer, bufPos) {
      var jj = Encoder$7.BLKSIZE / 8 - 1;
      var x = Encoder$7.BLKSIZE / 2;
      do {
        var f0, f1, f2, f3, w;
        var i = rv_tbl[jj] & 255;
        f0 = window2[i] * buffer[chn][bufPos + i];
        w = window2[i + 512] * buffer[chn][bufPos + i + 512];
        f1 = f0 - w;
        f0 = f0 + w;
        f2 = window2[i + 256] * buffer[chn][bufPos + i + 256];
        w = window2[i + 768] * buffer[chn][bufPos + i + 768];
        f3 = f2 - w;
        f2 = f2 + w;
        x -= 4;
        y[x + 0] = f0 + f2;
        y[x + 2] = f0 - f2;
        y[x + 1] = f1 + f3;
        y[x + 3] = f1 - f3;
        f0 = window2[i + 1] * buffer[chn][bufPos + i + 1];
        w = window2[i + 513] * buffer[chn][bufPos + i + 513];
        f1 = f0 - w;
        f0 = f0 + w;
        f2 = window2[i + 257] * buffer[chn][bufPos + i + 257];
        w = window2[i + 769] * buffer[chn][bufPos + i + 769];
        f3 = f2 - w;
        f2 = f2 + w;
        y[x + Encoder$7.BLKSIZE / 2 + 0] = f0 + f2;
        y[x + Encoder$7.BLKSIZE / 2 + 2] = f0 - f2;
        y[x + Encoder$7.BLKSIZE / 2 + 1] = f1 + f3;
        y[x + Encoder$7.BLKSIZE / 2 + 3] = f1 - f3;
      } while (--jj >= 0);
      fht(y, x, Encoder$7.BLKSIZE / 2);
    };
    this.init_fft = function(gfc) {
      for (var i = 0; i < Encoder$7.BLKSIZE; i++)
        window2[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * (i + 0.5) / Encoder$7.BLKSIZE) + 0.08 * Math.cos(4 * Math.PI * (i + 0.5) / Encoder$7.BLKSIZE);
      for (var i = 0; i < Encoder$7.BLKSIZE_s / 2; i++)
        window_s[i] = 0.5 * (1 - Math.cos(2 * Math.PI * (i + 0.5) / Encoder$7.BLKSIZE_s));
    };
  }
  var FFT_1 = FFT$1;
  var common$f = common$h;
  var VbrMode$1 = common$f.VbrMode;
  var Float = common$f.Float;
  var ShortBlock$1 = common$f.ShortBlock;
  var Util = common$f.Util;
  var Arrays$2 = common$f.Arrays;
  var new_float$6 = common$f.new_float;
  var new_float_n$2 = common$f.new_float_n;
  var new_int$7 = common$f.new_int;
  var assert$2 = common$f.assert;
  var FFT = FFT_1;
  var Encoder$6 = requireEncoder();
  var MPEGMode$1 = MPEGMode_1;
  function PsyModel() {
    var fft = new FFT();
    var LOG10 = 2.302585092994046;
    var rpelev = 2;
    var rpelev2 = 16;
    var rpelev_s = 2;
    var rpelev2_s = 16;
    var DELBARK = 0.34;
    var VO_SCALE = 1 / (14752 * 14752) / (Encoder$6.BLKSIZE / 2);
    var temporalmask_sustain_sec = 0.01;
    var NS_PREECHO_ATT0 = 0.8;
    var NS_PREECHO_ATT1 = 0.6;
    var NS_PREECHO_ATT2 = 0.3;
    var NS_MSFIX = 3.5;
    var NSFIRLEN = 21;
    var LN_TO_LOG10 = 0.2302585093;
    function NON_LINEAR_SCALE_ENERGY(x) {
      return x;
    }
    function psycho_loudness_approx(energy, gfc) {
      var loudness_power = 0;
      for (var i = 0; i < Encoder$6.BLKSIZE / 2; ++i)
        loudness_power += energy[i] * gfc.ATH.eql_w[i];
      loudness_power *= VO_SCALE;
      return loudness_power;
    }
    function compute_ffts(gfp, fftenergy, fftenergy_s, wsamp_l, wsamp_lPos, wsamp_s, wsamp_sPos, gr_out, chn, buffer, bufPos) {
      var gfc = gfp.internal_flags;
      if (chn < 2) {
        fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer, bufPos);
        fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer, bufPos);
      } else if (chn == 2) {
        for (var j = Encoder$6.BLKSIZE - 1; j >= 0; --j) {
          var l2 = wsamp_l[wsamp_lPos + 0][j];
          var r = wsamp_l[wsamp_lPos + 1][j];
          wsamp_l[wsamp_lPos + 0][j] = (l2 + r) * Util.SQRT2 * 0.5;
          wsamp_l[wsamp_lPos + 1][j] = (l2 - r) * Util.SQRT2 * 0.5;
        }
        for (var b = 2; b >= 0; --b) {
          for (var j = Encoder$6.BLKSIZE_s - 1; j >= 0; --j) {
            var l2 = wsamp_s[wsamp_sPos + 0][b][j];
            var r = wsamp_s[wsamp_sPos + 1][b][j];
            wsamp_s[wsamp_sPos + 0][b][j] = (l2 + r) * Util.SQRT2 * 0.5;
            wsamp_s[wsamp_sPos + 1][b][j] = (l2 - r) * Util.SQRT2 * 0.5;
          }
        }
      }
      fftenergy[0] = NON_LINEAR_SCALE_ENERGY(wsamp_l[wsamp_lPos + 0][0]);
      fftenergy[0] *= fftenergy[0];
      for (var j = Encoder$6.BLKSIZE / 2 - 1; j >= 0; --j) {
        var re = wsamp_l[wsamp_lPos + 0][Encoder$6.BLKSIZE / 2 - j];
        var im = wsamp_l[wsamp_lPos + 0][Encoder$6.BLKSIZE / 2 + j];
        fftenergy[Encoder$6.BLKSIZE / 2 - j] = NON_LINEAR_SCALE_ENERGY((re * re + im * im) * 0.5);
      }
      for (var b = 2; b >= 0; --b) {
        fftenergy_s[b][0] = wsamp_s[wsamp_sPos + 0][b][0];
        fftenergy_s[b][0] *= fftenergy_s[b][0];
        for (var j = Encoder$6.BLKSIZE_s / 2 - 1; j >= 0; --j) {
          var re = wsamp_s[wsamp_sPos + 0][b][Encoder$6.BLKSIZE_s / 2 - j];
          var im = wsamp_s[wsamp_sPos + 0][b][Encoder$6.BLKSIZE_s / 2 + j];
          fftenergy_s[b][Encoder$6.BLKSIZE_s / 2 - j] = NON_LINEAR_SCALE_ENERGY((re * re + im * im) * 0.5);
        }
      }
      {
        var totalenergy = 0;
        for (var j = 11; j < Encoder$6.HBLKSIZE; j++)
          totalenergy += fftenergy[j];
        gfc.tot_ener[chn] = totalenergy;
      }
      if (gfp.analysis) {
        for (var j = 0; j < Encoder$6.HBLKSIZE; j++) {
          gfc.pinfo.energy[gr_out][chn][j] = gfc.pinfo.energy_save[chn][j];
          gfc.pinfo.energy_save[chn][j] = fftenergy[j];
        }
        gfc.pinfo.pe[gr_out][chn] = gfc.pe[chn];
      }
      if (gfp.athaa_loudapprox == 2 && chn < 2) {
        gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
        gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
      }
    }
    var I1LIMIT = 8;
    var I2LIMIT = 23;
    var MLIMIT = 15;
    var ma_max_i1;
    var ma_max_i2;
    var ma_max_m;
    var tab = [
      1,
      0.79433,
      0.63096,
      0.63096,
      0.63096,
      0.63096,
      0.63096,
      0.25119,
      0.11749
    ];
    function init_mask_add_max_values() {
      ma_max_i1 = Math.pow(10, (I1LIMIT + 1) / 16);
      ma_max_i2 = Math.pow(10, (I2LIMIT + 1) / 16);
      ma_max_m = Math.pow(10, MLIMIT / 10);
    }
    var table1 = [
      3.3246 * 3.3246,
      3.23837 * 3.23837,
      3.15437 * 3.15437,
      3.00412 * 3.00412,
      2.86103 * 2.86103,
      2.65407 * 2.65407,
      2.46209 * 2.46209,
      2.284 * 2.284,
      2.11879 * 2.11879,
      1.96552 * 1.96552,
      1.82335 * 1.82335,
      1.69146 * 1.69146,
      1.56911 * 1.56911,
      1.46658 * 1.46658,
      1.37074 * 1.37074,
      1.31036 * 1.31036,
      1.25264 * 1.25264,
      1.20648 * 1.20648,
      1.16203 * 1.16203,
      1.12765 * 1.12765,
      1.09428 * 1.09428,
      1.0659 * 1.0659,
      1.03826 * 1.03826,
      1.01895 * 1.01895,
      1
    ];
    var table2 = [
      1.33352 * 1.33352,
      1.35879 * 1.35879,
      1.38454 * 1.38454,
      1.39497 * 1.39497,
      1.40548 * 1.40548,
      1.3537 * 1.3537,
      1.30382 * 1.30382,
      1.22321 * 1.22321,
      1.14758 * 1.14758,
      1
    ];
    var table3 = [
      2.35364 * 2.35364,
      2.29259 * 2.29259,
      2.23313 * 2.23313,
      2.12675 * 2.12675,
      2.02545 * 2.02545,
      1.87894 * 1.87894,
      1.74303 * 1.74303,
      1.61695 * 1.61695,
      1.49999 * 1.49999,
      1.39148 * 1.39148,
      1.29083 * 1.29083,
      1.19746 * 1.19746,
      1.11084 * 1.11084,
      1.03826 * 1.03826
    ];
    function mask_add(m1, m2, kk, b, gfc, shortblock) {
      var ratio;
      if (m2 > m1) {
        if (m2 < m1 * ma_max_i2)
          ratio = m2 / m1;
        else
          return m1 + m2;
      } else {
        if (m1 >= m2 * ma_max_i2)
          return m1 + m2;
        ratio = m1 / m2;
      }
      m1 += m2;
      if (b + 3 <= 3 + 3) {
        if (ratio >= ma_max_i1) {
          return m1;
        }
        var i = 0 | Util.FAST_LOG10_X(ratio, 16);
        return m1 * table2[i];
      }
      var i = 0 | Util.FAST_LOG10_X(ratio, 16);
      {
        m2 = gfc.ATH.cb_l[kk] * gfc.ATH.adjust;
      }
      if (m1 < ma_max_m * m2) {
        if (m1 > m2) {
          var f2, r;
          f2 = 1;
          if (i <= 13)
            f2 = table3[i];
          r = Util.FAST_LOG10_X(m1 / m2, 10 / 15);
          return m1 * ((table1[i] - f2) * r + f2);
        }
        if (i > 13)
          return m1;
        return m1 * table3[i];
      }
      return m1 * table1[i];
    }
    var table2_ = [
      1.33352 * 1.33352,
      1.35879 * 1.35879,
      1.38454 * 1.38454,
      1.39497 * 1.39497,
      1.40548 * 1.40548,
      1.3537 * 1.3537,
      1.30382 * 1.30382,
      1.22321 * 1.22321,
      1.14758 * 1.14758,
      1
    ];
    function vbrpsy_mask_add(m1, m2, b) {
      var ratio;
      if (m1 < 0) {
        m1 = 0;
      }
      if (m2 < 0) {
        m2 = 0;
      }
      if (m1 <= 0) {
        return m2;
      }
      if (m2 <= 0) {
        return m1;
      }
      if (m2 > m1) {
        ratio = m2 / m1;
      } else {
        ratio = m1 / m2;
      }
      if (-2 <= b && b <= 2) {
        if (ratio >= ma_max_i1) {
          return m1 + m2;
        } else {
          var i = 0 | Util.FAST_LOG10_X(ratio, 16);
          return (m1 + m2) * table2_[i];
        }
      }
      if (ratio < ma_max_i2) {
        return m1 + m2;
      }
      if (m1 < m2) {
        m1 = m2;
      }
      return m1;
    }
    function calc_interchannel_masking(gfp, ratio) {
      var gfc = gfp.internal_flags;
      if (gfc.channels_out > 1) {
        for (var sb = 0; sb < Encoder$6.SBMAX_l; sb++) {
          var l2 = gfc.thm[0].l[sb];
          var r = gfc.thm[1].l[sb];
          gfc.thm[0].l[sb] += r * ratio;
          gfc.thm[1].l[sb] += l2 * ratio;
        }
        for (var sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
          for (var sblock = 0; sblock < 3; sblock++) {
            var l2 = gfc.thm[0].s[sb][sblock];
            var r = gfc.thm[1].s[sb][sblock];
            gfc.thm[0].s[sb][sblock] += r * ratio;
            gfc.thm[1].s[sb][sblock] += l2 * ratio;
          }
        }
      }
    }
    function msfix1(gfc) {
      for (var sb = 0; sb < Encoder$6.SBMAX_l; sb++) {
        if (gfc.thm[0].l[sb] > 1.58 * gfc.thm[1].l[sb] || gfc.thm[1].l[sb] > 1.58 * gfc.thm[0].l[sb])
          continue;
        var mld = gfc.mld_l[sb] * gfc.en[3].l[sb];
        var rmid = Math.max(
          gfc.thm[2].l[sb],
          Math.min(gfc.thm[3].l[sb], mld)
        );
        mld = gfc.mld_l[sb] * gfc.en[2].l[sb];
        var rside = Math.max(
          gfc.thm[3].l[sb],
          Math.min(gfc.thm[2].l[sb], mld)
        );
        gfc.thm[2].l[sb] = rmid;
        gfc.thm[3].l[sb] = rside;
      }
      for (var sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
        for (var sblock = 0; sblock < 3; sblock++) {
          if (gfc.thm[0].s[sb][sblock] > 1.58 * gfc.thm[1].s[sb][sblock] || gfc.thm[1].s[sb][sblock] > 1.58 * gfc.thm[0].s[sb][sblock])
            continue;
          var mld = gfc.mld_s[sb] * gfc.en[3].s[sb][sblock];
          var rmid = Math.max(
            gfc.thm[2].s[sb][sblock],
            Math.min(gfc.thm[3].s[sb][sblock], mld)
          );
          mld = gfc.mld_s[sb] * gfc.en[2].s[sb][sblock];
          var rside = Math.max(
            gfc.thm[3].s[sb][sblock],
            Math.min(gfc.thm[2].s[sb][sblock], mld)
          );
          gfc.thm[2].s[sb][sblock] = rmid;
          gfc.thm[3].s[sb][sblock] = rside;
        }
      }
    }
    function ns_msfix(gfc, msfix, athadjust) {
      var msfix2 = msfix;
      var athlower = Math.pow(10, athadjust);
      msfix *= 2;
      msfix2 *= 2;
      for (var sb = 0; sb < Encoder$6.SBMAX_l; sb++) {
        var thmLR, thmM, thmS, ath;
        ath = gfc.ATH.cb_l[gfc.bm_l[sb]] * athlower;
        thmLR = Math.min(
          Math.max(gfc.thm[0].l[sb], ath),
          Math.max(gfc.thm[1].l[sb], ath)
        );
        thmM = Math.max(gfc.thm[2].l[sb], ath);
        thmS = Math.max(gfc.thm[3].l[sb], ath);
        if (thmLR * msfix < thmM + thmS) {
          var f2 = thmLR * msfix2 / (thmM + thmS);
          thmM *= f2;
          thmS *= f2;
        }
        gfc.thm[2].l[sb] = Math.min(thmM, gfc.thm[2].l[sb]);
        gfc.thm[3].l[sb] = Math.min(thmS, gfc.thm[3].l[sb]);
      }
      athlower *= Encoder$6.BLKSIZE_s / Encoder$6.BLKSIZE;
      for (var sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
        for (var sblock = 0; sblock < 3; sblock++) {
          var thmLR, thmM, thmS, ath;
          ath = gfc.ATH.cb_s[gfc.bm_s[sb]] * athlower;
          thmLR = Math.min(
            Math.max(gfc.thm[0].s[sb][sblock], ath),
            Math.max(gfc.thm[1].s[sb][sblock], ath)
          );
          thmM = Math.max(gfc.thm[2].s[sb][sblock], ath);
          thmS = Math.max(gfc.thm[3].s[sb][sblock], ath);
          if (thmLR * msfix < thmM + thmS) {
            var f2 = thmLR * msfix / (thmM + thmS);
            thmM *= f2;
            thmS *= f2;
          }
          gfc.thm[2].s[sb][sblock] = Math.min(
            gfc.thm[2].s[sb][sblock],
            thmM
          );
          gfc.thm[3].s[sb][sblock] = Math.min(
            gfc.thm[3].s[sb][sblock],
            thmS
          );
        }
      }
    }
    function convert_partition2scalefac_s(gfc, eb, thr, chn, sblock) {
      var sb, b;
      var enn = 0;
      var thmm = 0;
      for (sb = b = 0; sb < Encoder$6.SBMAX_s; ++b, ++sb) {
        var bo_s_sb = gfc.bo_s[sb];
        var npart_s = gfc.npart_s;
        var b_lim = bo_s_sb < npart_s ? bo_s_sb : npart_s;
        while (b < b_lim) {
          assert$2(eb[b] >= 0);
          assert$2(thr[b] >= 0);
          enn += eb[b];
          thmm += thr[b];
          b++;
        }
        gfc.en[chn].s[sb][sblock] = enn;
        gfc.thm[chn].s[sb][sblock] = thmm;
        if (b >= npart_s) {
          ++sb;
          break;
        }
        assert$2(eb[b] >= 0);
        assert$2(thr[b] >= 0);
        {
          var w_curr = gfc.PSY.bo_s_weight[sb];
          var w_next = 1 - w_curr;
          enn = w_curr * eb[b];
          thmm = w_curr * thr[b];
          gfc.en[chn].s[sb][sblock] += enn;
          gfc.thm[chn].s[sb][sblock] += thmm;
          enn = w_next * eb[b];
          thmm = w_next * thr[b];
        }
      }
      for (; sb < Encoder$6.SBMAX_s; ++sb) {
        gfc.en[chn].s[sb][sblock] = 0;
        gfc.thm[chn].s[sb][sblock] = 0;
      }
    }
    function convert_partition2scalefac_l(gfc, eb, thr, chn) {
      var sb, b;
      var enn = 0;
      var thmm = 0;
      for (sb = b = 0; sb < Encoder$6.SBMAX_l; ++b, ++sb) {
        var bo_l_sb = gfc.bo_l[sb];
        var npart_l = gfc.npart_l;
        var b_lim = bo_l_sb < npart_l ? bo_l_sb : npart_l;
        while (b < b_lim) {
          assert$2(eb[b] >= 0);
          assert$2(thr[b] >= 0);
          enn += eb[b];
          thmm += thr[b];
          b++;
        }
        gfc.en[chn].l[sb] = enn;
        gfc.thm[chn].l[sb] = thmm;
        if (b >= npart_l) {
          ++sb;
          break;
        }
        assert$2(eb[b] >= 0);
        assert$2(thr[b] >= 0);
        {
          var w_curr = gfc.PSY.bo_l_weight[sb];
          var w_next = 1 - w_curr;
          enn = w_curr * eb[b];
          thmm = w_curr * thr[b];
          gfc.en[chn].l[sb] += enn;
          gfc.thm[chn].l[sb] += thmm;
          enn = w_next * eb[b];
          thmm = w_next * thr[b];
        }
      }
      for (; sb < Encoder$6.SBMAX_l; ++sb) {
        gfc.en[chn].l[sb] = 0;
        gfc.thm[chn].l[sb] = 0;
      }
    }
    function compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
      var gfc = gfp.internal_flags;
      var j, b;
      for (b = j = 0; b < gfc.npart_s; ++b) {
        var ebb = 0;
        var n2 = gfc.numlines_s[b];
        for (var i = 0; i < n2; ++i, ++j) {
          var el = fftenergy_s[sblock][j];
          ebb += el;
        }
        eb[b] = ebb;
      }
      assert$2(b == gfc.npart_s);
      for (j = b = 0; b < gfc.npart_s; b++) {
        var kk = gfc.s3ind_s[b][0];
        var ecb = gfc.s3_ss[j++] * eb[kk];
        ++kk;
        while (kk <= gfc.s3ind_s[b][1]) {
          ecb += gfc.s3_ss[j] * eb[kk];
          ++j;
          ++kk;
        }
        {
          var x = rpelev_s * gfc.nb_s1[chn][b];
          thr[b] = Math.min(ecb, x);
        }
        if (gfc.blocktype_old[chn & 1] == Encoder$6.SHORT_TYPE) {
          var x = rpelev2_s * gfc.nb_s2[chn][b];
          var y = thr[b];
          thr[b] = Math.min(x, y);
        }
        gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
        gfc.nb_s1[chn][b] = ecb;
        assert$2(thr[b] >= 0);
      }
      for (; b <= Encoder$6.CBANDS; ++b) {
        eb[b] = 0;
        thr[b] = 0;
      }
    }
    function block_type_set(gfp, uselongblock, blocktype_d, blocktype) {
      var gfc = gfp.internal_flags;
      if (gfp.short_blocks == ShortBlock$1.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0))
        uselongblock[0] = uselongblock[1] = 0;
      for (var chn = 0; chn < gfc.channels_out; chn++) {
        blocktype[chn] = Encoder$6.NORM_TYPE;
        if (gfp.short_blocks == ShortBlock$1.short_block_dispensed)
          uselongblock[chn] = 1;
        if (gfp.short_blocks == ShortBlock$1.short_block_forced)
          uselongblock[chn] = 0;
        if (uselongblock[chn] != 0) {
          assert$2(gfc.blocktype_old[chn] != Encoder$6.START_TYPE);
          if (gfc.blocktype_old[chn] == Encoder$6.SHORT_TYPE)
            blocktype[chn] = Encoder$6.STOP_TYPE;
        } else {
          blocktype[chn] = Encoder$6.SHORT_TYPE;
          if (gfc.blocktype_old[chn] == Encoder$6.NORM_TYPE) {
            gfc.blocktype_old[chn] = Encoder$6.START_TYPE;
          }
          if (gfc.blocktype_old[chn] == Encoder$6.STOP_TYPE)
            gfc.blocktype_old[chn] = Encoder$6.SHORT_TYPE;
        }
        blocktype_d[chn] = gfc.blocktype_old[chn];
        gfc.blocktype_old[chn] = blocktype[chn];
      }
    }
    function NS_INTERP(x, y, r) {
      if (r >= 1) {
        return x;
      }
      if (r <= 0)
        return y;
      if (y > 0) {
        return Math.pow(x / y, r) * y;
      }
      return 0;
    }
    var regcoef_s = [
      11.8,
      13.6,
      17.2,
      32,
      46.5,
      51.3,
      57.5,
      67.1,
      71.5,
      84.6,
      97.6,
      130
      /* 255.8 */
    ];
    function pecalc_s(mr, masking_lower) {
      var pe_s = 1236.28 / 4;
      for (var sb = 0; sb < Encoder$6.SBMAX_s - 1; sb++) {
        for (var sblock = 0; sblock < 3; sblock++) {
          var thm = mr.thm.s[sb][sblock];
          if (thm > 0) {
            var x = thm * masking_lower;
            var en = mr.en.s[sb][sblock];
            if (en > x) {
              if (en > x * 1e10) {
                pe_s += regcoef_s[sb] * (10 * LOG10);
              } else {
                pe_s += regcoef_s[sb] * Util.FAST_LOG10(en / x);
              }
            }
          }
        }
      }
      return pe_s;
    }
    var regcoef_l = [
      6.8,
      5.8,
      5.8,
      6.4,
      6.5,
      9.9,
      12.1,
      14.4,
      15,
      18.9,
      21.6,
      26.9,
      34.2,
      40.2,
      46.8,
      56.5,
      60.7,
      73.9,
      85.7,
      93.4,
      126.1
      /* 241.3 */
    ];
    function pecalc_l(mr, masking_lower) {
      var pe_l = 1124.23 / 4;
      for (var sb = 0; sb < Encoder$6.SBMAX_l - 1; sb++) {
        var thm = mr.thm.l[sb];
        if (thm > 0) {
          var x = thm * masking_lower;
          var en = mr.en.l[sb];
          if (en > x) {
            if (en > x * 1e10) {
              pe_l += regcoef_l[sb] * (10 * LOG10);
            } else {
              pe_l += regcoef_l[sb] * Util.FAST_LOG10(en / x);
            }
          }
        }
      }
      return pe_l;
    }
    function calc_energy(gfc, fftenergy, eb, max, avg) {
      var b, j;
      for (b = j = 0; b < gfc.npart_l; ++b) {
        var ebb = 0, m2 = 0;
        var i;
        for (i = 0; i < gfc.numlines_l[b]; ++i, ++j) {
          var el = fftenergy[j];
          ebb += el;
          if (m2 < el)
            m2 = el;
        }
        eb[b] = ebb;
        max[b] = m2;
        avg[b] = ebb * gfc.rnumlines_l[b];
        assert$2(gfc.rnumlines_l[b] >= 0);
        assert$2(eb[b] >= 0);
        assert$2(max[b] >= 0);
        assert$2(avg[b] >= 0);
      }
    }
    function calc_mask_index_l(gfc, max, avg, mask_idx) {
      var last_tab_entry = tab.length - 1;
      var b = 0;
      var a = avg[b] + avg[b + 1];
      if (a > 0) {
        var m2 = max[b];
        if (m2 < max[b + 1])
          m2 = max[b + 1];
        assert$2(gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1 > 0);
        a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
        var k2 = 0 | a;
        if (k2 > last_tab_entry)
          k2 = last_tab_entry;
        mask_idx[b] = k2;
      } else {
        mask_idx[b] = 0;
      }
      for (b = 1; b < gfc.npart_l - 1; b++) {
        a = avg[b - 1] + avg[b] + avg[b + 1];
        if (a > 0) {
          var m2 = max[b - 1];
          if (m2 < max[b])
            m2 = max[b];
          if (m2 < max[b + 1])
            m2 = max[b + 1];
          assert$2(gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1 > 0);
          a = 20 * (m2 * 3 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
          var k2 = 0 | a;
          if (k2 > last_tab_entry)
            k2 = last_tab_entry;
          mask_idx[b] = k2;
        } else {
          mask_idx[b] = 0;
        }
      }
      assert$2(b == gfc.npart_l - 1);
      a = avg[b - 1] + avg[b];
      if (a > 0) {
        var m2 = max[b - 1];
        if (m2 < max[b])
          m2 = max[b];
        assert$2(gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1 > 0);
        a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1));
        var k2 = 0 | a;
        if (k2 > last_tab_entry)
          k2 = last_tab_entry;
        mask_idx[b] = k2;
      } else {
        mask_idx[b] = 0;
      }
      assert$2(b == gfc.npart_l - 1);
    }
    var fircoef = [
      -865163e-23 * 2,
      -851586e-8 * 2,
      -674764e-23 * 2,
      0.0209036 * 2,
      -336639e-22 * 2,
      -0.0438162 * 2,
      -154175e-22 * 2,
      0.0931738 * 2,
      -552212e-22 * 2,
      -0.313819 * 2
    ];
    this.L3psycho_anal_ns = function(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
      var gfc = gfp.internal_flags;
      var wsamp_L = new_float_n$2([2, Encoder$6.BLKSIZE]);
      var wsamp_S = new_float_n$2([2, 3, Encoder$6.BLKSIZE_s]);
      var eb_l = new_float$6(Encoder$6.CBANDS + 1);
      var eb_s = new_float$6(Encoder$6.CBANDS + 1);
      var thr = new_float$6(Encoder$6.CBANDS + 2);
      var blocktype = new_int$7(2), uselongblock = new_int$7(2);
      var numchn, chn;
      var b, i, j, k2;
      var sb, sblock;
      var ns_hpfsmpl = new_float_n$2([2, 576]);
      var pcfact;
      var mask_idx_l = new_int$7(Encoder$6.CBANDS + 2), mask_idx_s = new_int$7(Encoder$6.CBANDS + 2);
      Arrays$2.fill(mask_idx_s, 0);
      numchn = gfc.channels_out;
      if (gfp.mode == MPEGMode$1.JOINT_STEREO)
        numchn = 4;
      if (gfp.VBR == VbrMode$1.vbr_off)
        pcfact = gfc.ResvMax == 0 ? 0 : gfc.ResvSize / gfc.ResvMax * 0.5;
      else if (gfp.VBR == VbrMode$1.vbr_rh || gfp.VBR == VbrMode$1.vbr_mtrh || gfp.VBR == VbrMode$1.vbr_mt) {
        pcfact = 0.6;
      } else
        pcfact = 1;
      for (chn = 0; chn < gfc.channels_out; chn++) {
        var firbuf2 = buffer[chn];
        var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
        for (i = 0; i < 576; i++) {
          var sum1, sum2;
          sum1 = firbuf2[firbufPos + i + 10];
          sum2 = 0;
          for (j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
            sum1 += fircoef[j] * (firbuf2[firbufPos + i + j] + firbuf2[firbufPos + i + NSFIRLEN - j]);
            sum2 += fircoef[j + 1] * (firbuf2[firbufPos + i + j + 1] + firbuf2[firbufPos + i + NSFIRLEN - j - 1]);
          }
          ns_hpfsmpl[chn][i] = sum1 + sum2;
        }
        masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
        masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
        if (numchn > 2) {
          masking_MS_ratio[gr_out][chn].en.assign(gfc.en[chn + 2]);
          masking_MS_ratio[gr_out][chn].thm.assign(gfc.thm[chn + 2]);
        }
      }
      for (chn = 0; chn < numchn; chn++) {
        var wsamp_l;
        var wsamp_s;
        var en_subshort = new_float$6(12);
        var en_short = [0, 0, 0, 0];
        var attack_intensity = new_float$6(12);
        var ns_uselongblock = 1;
        var attackThreshold;
        var max = new_float$6(Encoder$6.CBANDS), avg = new_float$6(Encoder$6.CBANDS);
        var ns_attacks = [0, 0, 0, 0];
        var fftenergy = new_float$6(Encoder$6.HBLKSIZE);
        var fftenergy_s = new_float_n$2([3, Encoder$6.HBLKSIZE_s]);
        assert$2(gfc.npart_s <= Encoder$6.CBANDS);
        assert$2(gfc.npart_l <= Encoder$6.CBANDS);
        for (i = 0; i < 3; i++) {
          en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
          assert$2(gfc.nsPsy.last_en_subshort[chn][i + 4] > 0);
          attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
          en_short[0] += en_subshort[i];
        }
        if (chn == 2) {
          for (i = 0; i < 576; i++) {
            var l2, r;
            l2 = ns_hpfsmpl[0][i];
            r = ns_hpfsmpl[1][i];
            ns_hpfsmpl[0][i] = l2 + r;
            ns_hpfsmpl[1][i] = l2 - r;
          }
        }
        {
          var pf = ns_hpfsmpl[chn & 1];
          var pfPos = 0;
          for (i = 0; i < 9; i++) {
            var pfe = pfPos + 576 / 9;
            var p2 = 1;
            for (; pfPos < pfe; pfPos++)
              if (p2 < Math.abs(pf[pfPos]))
                p2 = Math.abs(pf[pfPos]);
            gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p2;
            en_short[1 + i / 3] += p2;
            if (p2 > en_subshort[i + 3 - 2]) {
              assert$2(en_subshort[i + 3 - 2] > 0);
              p2 = p2 / en_subshort[i + 3 - 2];
            } else if (en_subshort[i + 3 - 2] > p2 * 10) {
              p2 = en_subshort[i + 3 - 2] / (p2 * 10);
            } else
              p2 = 0;
            attack_intensity[i + 3] = p2;
          }
        }
        if (gfp.analysis) {
          var x = attack_intensity[0];
          for (i = 1; i < 12; i++)
            if (x < attack_intensity[i])
              x = attack_intensity[i];
          gfc.pinfo.ers[gr_out][chn] = gfc.pinfo.ers_save[chn];
          gfc.pinfo.ers_save[chn] = x;
        }
        attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
        for (i = 0; i < 12; i++)
          if (0 == ns_attacks[i / 3] && attack_intensity[i] > attackThreshold)
            ns_attacks[i / 3] = i % 3 + 1;
        for (i = 1; i < 4; i++) {
          var ratio;
          if (en_short[i - 1] > en_short[i]) {
            assert$2(en_short[i] > 0);
            ratio = en_short[i - 1] / en_short[i];
          } else {
            assert$2(en_short[i - 1] > 0);
            ratio = en_short[i] / en_short[i - 1];
          }
          if (ratio < 1.7) {
            ns_attacks[i] = 0;
            if (i == 1)
              ns_attacks[0] = 0;
          }
        }
        if (ns_attacks[0] != 0 && gfc.nsPsy.lastAttacks[chn] != 0)
          ns_attacks[0] = 0;
        if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[0] + ns_attacks[1] + ns_attacks[2] + ns_attacks[3] != 0) {
          ns_uselongblock = 0;
          if (ns_attacks[1] != 0 && ns_attacks[0] != 0)
            ns_attacks[1] = 0;
          if (ns_attacks[2] != 0 && ns_attacks[1] != 0)
            ns_attacks[2] = 0;
          if (ns_attacks[3] != 0 && ns_attacks[2] != 0)
            ns_attacks[3] = 0;
        }
        if (chn < 2) {
          uselongblock[chn] = ns_uselongblock;
        } else {
          if (ns_uselongblock == 0) {
            uselongblock[0] = uselongblock[1] = 0;
          }
        }
        energy[chn] = gfc.tot_ener[chn];
        wsamp_s = wsamp_S;
        wsamp_l = wsamp_L;
        compute_ffts(
          gfp,
          fftenergy,
          fftenergy_s,
          wsamp_l,
          chn & 1,
          wsamp_s,
          chn & 1,
          gr_out,
          chn,
          buffer,
          bufPos
        );
        calc_energy(gfc, fftenergy, eb_l, max, avg);
        calc_mask_index_l(gfc, max, avg, mask_idx_l);
        for (sblock = 0; sblock < 3; sblock++) {
          var enn, thmm;
          compute_masking_s(gfp, fftenergy_s, eb_s, thr, chn, sblock);
          convert_partition2scalefac_s(gfc, eb_s, thr, chn, sblock);
          for (sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
            thmm = gfc.thm[chn].s[sb][sblock];
            thmm *= NS_PREECHO_ATT0;
            if (ns_attacks[sblock] >= 2 || ns_attacks[sblock + 1] == 1) {
              var idx = sblock != 0 ? sblock - 1 : 2;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT1 * pcfact
              );
              thmm = Math.min(thmm, p2);
            }
            if (ns_attacks[sblock] == 1) {
              var idx = sblock != 0 ? sblock - 1 : 2;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT2 * pcfact
              );
              thmm = Math.min(thmm, p2);
            } else if (sblock != 0 && ns_attacks[sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
              var idx = sblock != 2 ? sblock + 1 : 0;
              var p2 = NS_INTERP(
                gfc.thm[chn].s[sb][idx],
                thmm,
                NS_PREECHO_ATT2 * pcfact
              );
              thmm = Math.min(thmm, p2);
            }
            enn = en_subshort[sblock * 3 + 3] + en_subshort[sblock * 3 + 4] + en_subshort[sblock * 3 + 5];
            if (en_subshort[sblock * 3 + 5] * 6 < enn) {
              thmm *= 0.5;
              if (en_subshort[sblock * 3 + 4] * 6 < enn)
                thmm *= 0.5;
            }
            gfc.thm[chn].s[sb][sblock] = thmm;
          }
        }
        gfc.nsPsy.lastAttacks[chn] = ns_attacks[2];
        k2 = 0;
        {
          for (b = 0; b < gfc.npart_l; b++) {
            var kk = gfc.s3ind[b][0];
            var eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
            var ecb = gfc.s3_ll[k2++] * eb2;
            while (++kk <= gfc.s3ind[b][1]) {
              eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
              ecb = mask_add(
                ecb,
                gfc.s3_ll[k2++] * eb2,
                kk,
                kk - b,
                gfc
              );
            }
            ecb *= 0.158489319246111;
            if (gfc.blocktype_old[chn & 1] == Encoder$6.SHORT_TYPE)
              thr[b] = ecb;
            else
              thr[b] = NS_INTERP(
                Math.min(ecb, Math.min(rpelev * gfc.nb_1[chn][b], rpelev2 * gfc.nb_2[chn][b])),
                ecb,
                pcfact
              );
            gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
            gfc.nb_1[chn][b] = ecb;
          }
        }
        for (; b <= Encoder$6.CBANDS; ++b) {
          eb_l[b] = 0;
          thr[b] = 0;
        }
        convert_partition2scalefac_l(gfc, eb_l, thr, chn);
      }
      if (gfp.mode == MPEGMode$1.STEREO || gfp.mode == MPEGMode$1.JOINT_STEREO) {
        if (gfp.interChRatio > 0) {
          calc_interchannel_masking(gfp, gfp.interChRatio);
        }
      }
      if (gfp.mode == MPEGMode$1.JOINT_STEREO) {
        var msfix;
        msfix1(gfc);
        msfix = gfp.msfix;
        if (Math.abs(msfix) > 0)
          ns_msfix(gfc, msfix, gfp.ATHlower * gfc.ATH.adjust);
      }
      block_type_set(gfp, uselongblock, blocktype_d, blocktype);
      for (chn = 0; chn < numchn; chn++) {
        var ppe;
        var ppePos = 0;
        var type;
        var mr;
        if (chn > 1) {
          ppe = percep_MS_entropy;
          ppePos = -2;
          type = Encoder$6.NORM_TYPE;
          if (blocktype_d[0] == Encoder$6.SHORT_TYPE || blocktype_d[1] == Encoder$6.SHORT_TYPE)
            type = Encoder$6.SHORT_TYPE;
          mr = masking_MS_ratio[gr_out][chn - 2];
        } else {
          ppe = percep_entropy;
          ppePos = 0;
          type = blocktype_d[chn];
          mr = masking_ratio[gr_out][chn];
        }
        if (type == Encoder$6.SHORT_TYPE)
          ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
        else
          ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
        if (gfp.analysis)
          gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
      }
      return 0;
    };
    function vbrpsy_compute_fft_l(gfp, buffer, bufPos, chn, gr_out, fftenergy, wsamp_l, wsamp_lPos) {
      var gfc = gfp.internal_flags;
      if (chn < 2) {
        fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer, bufPos);
      } else if (chn == 2) {
        for (var j = Encoder$6.BLKSIZE - 1; j >= 0; --j) {
          var l2 = wsamp_l[wsamp_lPos + 0][j];
          var r = wsamp_l[wsamp_lPos + 1][j];
          wsamp_l[wsamp_lPos + 0][j] = (l2 + r) * Util.SQRT2 * 0.5;
          wsamp_l[wsamp_lPos + 1][j] = (l2 - r) * Util.SQRT2 * 0.5;
        }
      }
      fftenergy[0] = NON_LINEAR_SCALE_ENERGY(wsamp_l[wsamp_lPos + 0][0]);
      fftenergy[0] *= fftenergy[0];
      for (var j = Encoder$6.BLKSIZE / 2 - 1; j >= 0; --j) {
        var re = wsamp_l[wsamp_lPos + 0][Encoder$6.BLKSIZE / 2 - j];
        var im = wsamp_l[wsamp_lPos + 0][Encoder$6.BLKSIZE / 2 + j];
        fftenergy[Encoder$6.BLKSIZE / 2 - j] = NON_LINEAR_SCALE_ENERGY((re * re + im * im) * 0.5);
      }
      {
        var totalenergy = 0;
        for (var j = 11; j < Encoder$6.HBLKSIZE; j++)
          totalenergy += fftenergy[j];
        gfc.tot_ener[chn] = totalenergy;
      }
      if (gfp.analysis) {
        for (var j = 0; j < Encoder$6.HBLKSIZE; j++) {
          gfc.pinfo.energy[gr_out][chn][j] = gfc.pinfo.energy_save[chn][j];
          gfc.pinfo.energy_save[chn][j] = fftenergy[j];
        }
        gfc.pinfo.pe[gr_out][chn] = gfc.pe[chn];
      }
    }
    function vbrpsy_compute_fft_s(gfp, buffer, bufPos, chn, sblock, fftenergy_s, wsamp_s, wsamp_sPos) {
      var gfc = gfp.internal_flags;
      if (sblock == 0 && chn < 2) {
        fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer, bufPos);
      }
      if (chn == 2) {
        for (var j = Encoder$6.BLKSIZE_s - 1; j >= 0; --j) {
          var l2 = wsamp_s[wsamp_sPos + 0][sblock][j];
          var r = wsamp_s[wsamp_sPos + 1][sblock][j];
          wsamp_s[wsamp_sPos + 0][sblock][j] = (l2 + r) * Util.SQRT2 * 0.5;
          wsamp_s[wsamp_sPos + 1][sblock][j] = (l2 - r) * Util.SQRT2 * 0.5;
        }
      }
      fftenergy_s[sblock][0] = wsamp_s[wsamp_sPos + 0][sblock][0];
      fftenergy_s[sblock][0] *= fftenergy_s[sblock][0];
      for (var j = Encoder$6.BLKSIZE_s / 2 - 1; j >= 0; --j) {
        var re = wsamp_s[wsamp_sPos + 0][sblock][Encoder$6.BLKSIZE_s / 2 - j];
        var im = wsamp_s[wsamp_sPos + 0][sblock][Encoder$6.BLKSIZE_s / 2 + j];
        fftenergy_s[sblock][Encoder$6.BLKSIZE_s / 2 - j] = NON_LINEAR_SCALE_ENERGY((re * re + im * im) * 0.5);
      }
    }
    function vbrpsy_compute_loudness_approximation_l(gfp, gr_out, chn, fftenergy) {
      var gfc = gfp.internal_flags;
      if (gfp.athaa_loudapprox == 2 && chn < 2) {
        gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
        gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
      }
    }
    var fircoef_ = [
      -865163e-23 * 2,
      -851586e-8 * 2,
      -674764e-23 * 2,
      0.0209036 * 2,
      -336639e-22 * 2,
      -0.0438162 * 2,
      -154175e-22 * 2,
      0.0931738 * 2,
      -552212e-22 * 2,
      -0.313819 * 2
    ];
    function vbrpsy_attack_detection(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, energy, sub_short_factor, ns_attacks, uselongblock) {
      var ns_hpfsmpl = new_float_n$2([2, 576]);
      var gfc = gfp.internal_flags;
      var n_chn_out = gfc.channels_out;
      var n_chn_psy = gfp.mode == MPEGMode$1.JOINT_STEREO ? 4 : n_chn_out;
      for (var chn = 0; chn < n_chn_out; chn++) {
        firbuf = buffer[chn];
        var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
        for (var i = 0; i < 576; i++) {
          var sum1, sum2;
          sum1 = firbuf[firbufPos + i + 10];
          sum2 = 0;
          for (var j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
            sum1 += fircoef_[j] * (firbuf[firbufPos + i + j] + firbuf[firbufPos + i + NSFIRLEN - j]);
            sum2 += fircoef_[j + 1] * (firbuf[firbufPos + i + j + 1] + firbuf[firbufPos + i + NSFIRLEN - j - 1]);
          }
          ns_hpfsmpl[chn][i] = sum1 + sum2;
        }
        masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
        masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
        if (n_chn_psy > 2) {
          masking_MS_ratio[gr_out][chn].en.assign(gfc.en[chn + 2]);
          masking_MS_ratio[gr_out][chn].thm.assign(gfc.thm[chn + 2]);
        }
      }
      for (var chn = 0; chn < n_chn_psy; chn++) {
        var attack_intensity = new_float$6(12);
        var en_subshort = new_float$6(12);
        var en_short = [0, 0, 0, 0];
        var pf = ns_hpfsmpl[chn & 1];
        var pfPos = 0;
        var attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
        var ns_uselongblock = 1;
        if (chn == 2) {
          for (var i = 0, j = 576; j > 0; ++i, --j) {
            var l2 = ns_hpfsmpl[0][i];
            var r = ns_hpfsmpl[1][i];
            ns_hpfsmpl[0][i] = l2 + r;
            ns_hpfsmpl[1][i] = l2 - r;
          }
        }
        for (var i = 0; i < 3; i++) {
          en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
          assert$2(gfc.nsPsy.last_en_subshort[chn][i + 4] > 0);
          attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
          en_short[0] += en_subshort[i];
        }
        for (var i = 0; i < 9; i++) {
          var pfe = pfPos + 576 / 9;
          var p2 = 1;
          for (; pfPos < pfe; pfPos++)
            if (p2 < Math.abs(pf[pfPos]))
              p2 = Math.abs(pf[pfPos]);
          gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p2;
          en_short[1 + i / 3] += p2;
          if (p2 > en_subshort[i + 3 - 2]) {
            assert$2(en_subshort[i + 3 - 2] > 0);
            p2 = p2 / en_subshort[i + 3 - 2];
          } else if (en_subshort[i + 3 - 2] > p2 * 10) {
            p2 = en_subshort[i + 3 - 2] / (p2 * 10);
          } else {
            p2 = 0;
          }
          attack_intensity[i + 3] = p2;
        }
        for (var i = 0; i < 3; ++i) {
          var enn = en_subshort[i * 3 + 3] + en_subshort[i * 3 + 4] + en_subshort[i * 3 + 5];
          var factor = 1;
          if (en_subshort[i * 3 + 5] * 6 < enn) {
            factor *= 0.5;
            if (en_subshort[i * 3 + 4] * 6 < enn) {
              factor *= 0.5;
            }
          }
          sub_short_factor[chn][i] = factor;
        }
        if (gfp.analysis) {
          var x = attack_intensity[0];
          for (var i = 1; i < 12; i++) {
            if (x < attack_intensity[i]) {
              x = attack_intensity[i];
            }
          }
          gfc.pinfo.ers[gr_out][chn] = gfc.pinfo.ers_save[chn];
          gfc.pinfo.ers_save[chn] = x;
        }
        for (var i = 0; i < 12; i++) {
          if (0 == ns_attacks[chn][i / 3] && attack_intensity[i] > attackThreshold) {
            ns_attacks[chn][i / 3] = i % 3 + 1;
          }
        }
        for (var i = 1; i < 4; i++) {
          var u = en_short[i - 1];
          var v = en_short[i];
          var m2 = Math.max(u, v);
          if (m2 < 4e4) {
            if (u < 1.7 * v && v < 1.7 * u) {
              if (i == 1 && ns_attacks[chn][0] <= ns_attacks[chn][i]) {
                ns_attacks[chn][0] = 0;
              }
              ns_attacks[chn][i] = 0;
            }
          }
        }
        if (ns_attacks[chn][0] <= gfc.nsPsy.lastAttacks[chn]) {
          ns_attacks[chn][0] = 0;
        }
        if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[chn][0] + ns_attacks[chn][1] + ns_attacks[chn][2] + ns_attacks[chn][3] != 0) {
          ns_uselongblock = 0;
          if (ns_attacks[chn][1] != 0 && ns_attacks[chn][0] != 0) {
            ns_attacks[chn][1] = 0;
          }
          if (ns_attacks[chn][2] != 0 && ns_attacks[chn][1] != 0) {
            ns_attacks[chn][2] = 0;
          }
          if (ns_attacks[chn][3] != 0 && ns_attacks[chn][2] != 0) {
            ns_attacks[chn][3] = 0;
          }
        }
        if (chn < 2) {
          uselongblock[chn] = ns_uselongblock;
        } else {
          if (ns_uselongblock == 0) {
            uselongblock[0] = uselongblock[1] = 0;
          }
        }
        energy[chn] = gfc.tot_ener[chn];
      }
    }
    function vbrpsy_skip_masking_s(gfc, chn, sblock) {
      if (sblock == 0) {
        for (var b = 0; b < gfc.npart_s; b++) {
          gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
          gfc.nb_s1[chn][b] = 0;
        }
      }
    }
    function vbrpsy_skip_masking_l(gfc, chn) {
      for (var b = 0; b < gfc.npart_l; b++) {
        gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
        gfc.nb_1[chn][b] = 0;
      }
    }
    function psyvbr_calc_mask_index_s(gfc, max, avg, mask_idx) {
      var last_tab_entry = tab.length - 1;
      var b = 0;
      var a = avg[b] + avg[b + 1];
      if (a > 0) {
        var m2 = max[b];
        if (m2 < max[b + 1])
          m2 = max[b + 1];
        assert$2(gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1 > 0);
        a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1));
        var k2 = 0 | a;
        if (k2 > last_tab_entry)
          k2 = last_tab_entry;
        mask_idx[b] = k2;
      } else {
        mask_idx[b] = 0;
      }
      for (b = 1; b < gfc.npart_s - 1; b++) {
        a = avg[b - 1] + avg[b] + avg[b + 1];
        assert$2(b + 1 < gfc.npart_s);
        if (a > 0) {
          var m2 = max[b - 1];
          if (m2 < max[b])
            m2 = max[b];
          if (m2 < max[b + 1])
            m2 = max[b + 1];
          assert$2(gfc.numlines_s[b - 1] + gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1 > 0);
          a = 20 * (m2 * 3 - a) / (a * (gfc.numlines_s[b - 1] + gfc.numlines_s[b] + gfc.numlines_s[b + 1] - 1));
          var k2 = 0 | a;
          if (k2 > last_tab_entry)
            k2 = last_tab_entry;
          mask_idx[b] = k2;
        } else {
          mask_idx[b] = 0;
        }
      }
      assert$2(b == gfc.npart_s - 1);
      a = avg[b - 1] + avg[b];
      if (a > 0) {
        var m2 = max[b - 1];
        if (m2 < max[b])
          m2 = max[b];
        assert$2(gfc.numlines_s[b - 1] + gfc.numlines_s[b] - 1 > 0);
        a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_s[b - 1] + gfc.numlines_s[b] - 1));
        var k2 = 0 | a;
        if (k2 > last_tab_entry)
          k2 = last_tab_entry;
        mask_idx[b] = k2;
      } else {
        mask_idx[b] = 0;
      }
      assert$2(b == gfc.npart_s - 1);
    }
    function vbrpsy_compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
      var gfc = gfp.internal_flags;
      var max = new float[Encoder$6.CBANDS](), avg = new_float$6(Encoder$6.CBANDS);
      var i, j, b;
      var mask_idx_s = new int[Encoder$6.CBANDS]();
      for (b = j = 0; b < gfc.npart_s; ++b) {
        var ebb = 0, m2 = 0;
        var n2 = gfc.numlines_s[b];
        for (i = 0; i < n2; ++i, ++j) {
          var el = fftenergy_s[sblock][j];
          ebb += el;
          if (m2 < el)
            m2 = el;
        }
        eb[b] = ebb;
        max[b] = m2;
        avg[b] = ebb / n2;
        assert$2(avg[b] >= 0);
      }
      assert$2(b == gfc.npart_s);
      for (; b < Encoder$6.CBANDS; ++b) {
        max[b] = 0;
        avg[b] = 0;
      }
      psyvbr_calc_mask_index_s(gfc, max, avg, mask_idx_s);
      for (j = b = 0; b < gfc.npart_s; b++) {
        var kk = gfc.s3ind_s[b][0];
        var last = gfc.s3ind_s[b][1];
        var dd, dd_n;
        var x, ecb, avg_mask;
        dd = mask_idx_s[kk];
        dd_n = 1;
        ecb = gfc.s3_ss[j] * eb[kk] * tab[mask_idx_s[kk]];
        ++j;
        ++kk;
        while (kk <= last) {
          dd += mask_idx_s[kk];
          dd_n += 1;
          x = gfc.s3_ss[j] * eb[kk] * tab[mask_idx_s[kk]];
          ecb = vbrpsy_mask_add(ecb, x, kk - b);
          ++j;
          ++kk;
        }
        dd = (1 + 2 * dd) / (2 * dd_n);
        avg_mask = tab[dd] * 0.5;
        ecb *= avg_mask;
        thr[b] = ecb;
        gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
        gfc.nb_s1[chn][b] = ecb;
        {
          x = max[b];
          x *= gfc.minval_s[b];
          x *= avg_mask;
          if (thr[b] > x) {
            thr[b] = x;
          }
        }
        if (gfc.masking_lower > 1) {
          thr[b] *= gfc.masking_lower;
        }
        if (thr[b] > eb[b]) {
          thr[b] = eb[b];
        }
        if (gfc.masking_lower < 1) {
          thr[b] *= gfc.masking_lower;
        }
        assert$2(thr[b] >= 0);
      }
      for (; b < Encoder$6.CBANDS; ++b) {
        eb[b] = 0;
        thr[b] = 0;
      }
    }
    function vbrpsy_compute_masking_l(gfc, fftenergy, eb_l, thr, chn) {
      var max = new_float$6(Encoder$6.CBANDS), avg = new_float$6(Encoder$6.CBANDS);
      var mask_idx_l = new_int$7(Encoder$6.CBANDS + 2);
      var b;
      calc_energy(gfc, fftenergy, eb_l, max, avg);
      calc_mask_index_l(gfc, max, avg, mask_idx_l);
      var k2 = 0;
      for (b = 0; b < gfc.npart_l; b++) {
        var x, ecb, avg_mask, t;
        var kk = gfc.s3ind[b][0];
        var last = gfc.s3ind[b][1];
        var dd = 0, dd_n = 0;
        dd = mask_idx_l[kk];
        dd_n += 1;
        ecb = gfc.s3_ll[k2] * eb_l[kk] * tab[mask_idx_l[kk]];
        ++k2;
        ++kk;
        while (kk <= last) {
          dd += mask_idx_l[kk];
          dd_n += 1;
          x = gfc.s3_ll[k2] * eb_l[kk] * tab[mask_idx_l[kk]];
          t = vbrpsy_mask_add(ecb, x, kk - b);
          ecb = t;
          ++k2;
          ++kk;
        }
        dd = (1 + 2 * dd) / (2 * dd_n);
        avg_mask = tab[dd] * 0.5;
        ecb *= avg_mask;
        if (gfc.blocktype_old[chn & 1] == Encoder$6.SHORT_TYPE) {
          var ecb_limit = rpelev * gfc.nb_1[chn][b];
          if (ecb_limit > 0) {
            thr[b] = Math.min(ecb, ecb_limit);
          } else {
            thr[b] = Math.min(ecb, eb_l[b] * NS_PREECHO_ATT2);
          }
        } else {
          var ecb_limit_2 = rpelev2 * gfc.nb_2[chn][b];
          var ecb_limit_1 = rpelev * gfc.nb_1[chn][b];
          var ecb_limit;
          if (ecb_limit_2 <= 0) {
            ecb_limit_2 = ecb;
          }
          if (ecb_limit_1 <= 0) {
            ecb_limit_1 = ecb;
          }
          if (gfc.blocktype_old[chn & 1] == Encoder$6.NORM_TYPE) {
            ecb_limit = Math.min(ecb_limit_1, ecb_limit_2);
          } else {
            ecb_limit = ecb_limit_1;
          }
          thr[b] = Math.min(ecb, ecb_limit);
        }
        gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
        gfc.nb_1[chn][b] = ecb;
        {
          x = max[b];
          x *= gfc.minval_l[b];
          x *= avg_mask;
          if (thr[b] > x) {
            thr[b] = x;
          }
        }
        if (gfc.masking_lower > 1) {
          thr[b] *= gfc.masking_lower;
        }
        if (thr[b] > eb_l[b]) {
          thr[b] = eb_l[b];
        }
        if (gfc.masking_lower < 1) {
          thr[b] *= gfc.masking_lower;
        }
        assert$2(thr[b] >= 0);
      }
      for (; b < Encoder$6.CBANDS; ++b) {
        eb_l[b] = 0;
        thr[b] = 0;
      }
    }
    function vbrpsy_compute_block_type(gfp, uselongblock) {
      var gfc = gfp.internal_flags;
      if (gfp.short_blocks == ShortBlock$1.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0))
        uselongblock[0] = uselongblock[1] = 0;
      for (var chn = 0; chn < gfc.channels_out; chn++) {
        if (gfp.short_blocks == ShortBlock$1.short_block_dispensed) {
          uselongblock[chn] = 1;
        }
        if (gfp.short_blocks == ShortBlock$1.short_block_forced) {
          uselongblock[chn] = 0;
        }
      }
    }
    function vbrpsy_apply_block_type(gfp, uselongblock, blocktype_d) {
      var gfc = gfp.internal_flags;
      for (var chn = 0; chn < gfc.channels_out; chn++) {
        var blocktype = Encoder$6.NORM_TYPE;
        if (uselongblock[chn] != 0) {
          assert$2(gfc.blocktype_old[chn] != Encoder$6.START_TYPE);
          if (gfc.blocktype_old[chn] == Encoder$6.SHORT_TYPE)
            blocktype = Encoder$6.STOP_TYPE;
        } else {
          blocktype = Encoder$6.SHORT_TYPE;
          if (gfc.blocktype_old[chn] == Encoder$6.NORM_TYPE) {
            gfc.blocktype_old[chn] = Encoder$6.START_TYPE;
          }
          if (gfc.blocktype_old[chn] == Encoder$6.STOP_TYPE)
            gfc.blocktype_old[chn] = Encoder$6.SHORT_TYPE;
        }
        blocktype_d[chn] = gfc.blocktype_old[chn];
        gfc.blocktype_old[chn] = blocktype;
      }
    }
    function vbrpsy_compute_MS_thresholds(eb, thr, cb_mld, ath_cb, athadjust, msfix, n2) {
      var msfix2 = msfix * 2;
      var athlower = msfix > 0 ? Math.pow(10, athadjust) : 1;
      var rside, rmid;
      for (var b = 0; b < n2; ++b) {
        var ebM = eb[2][b];
        var ebS = eb[3][b];
        var thmL = thr[0][b];
        var thmR = thr[1][b];
        var thmM = thr[2][b];
        var thmS = thr[3][b];
        if (thmL <= 1.58 * thmR && thmR <= 1.58 * thmL) {
          var mld_m = cb_mld[b] * ebS;
          var mld_s = cb_mld[b] * ebM;
          rmid = Math.max(thmM, Math.min(thmS, mld_m));
          rside = Math.max(thmS, Math.min(thmM, mld_s));
        } else {
          rmid = thmM;
          rside = thmS;
        }
        if (msfix > 0) {
          var thmLR, thmMS;
          var ath = ath_cb[b] * athlower;
          thmLR = Math.min(Math.max(thmL, ath), Math.max(thmR, ath));
          thmM = Math.max(rmid, ath);
          thmS = Math.max(rside, ath);
          thmMS = thmM + thmS;
          if (thmMS > 0 && thmLR * msfix2 < thmMS) {
            var f2 = thmLR * msfix2 / thmMS;
            thmM *= f2;
            thmS *= f2;
          }
          rmid = Math.min(thmM, rmid);
          rside = Math.min(thmS, rside);
        }
        if (rmid > ebM) {
          rmid = ebM;
        }
        if (rside > ebS) {
          rside = ebS;
        }
        thr[2][b] = rmid;
        thr[3][b] = rside;
      }
    }
    this.L3psycho_anal_vbr = function(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
      var gfc = gfp.internal_flags;
      var wsamp_l;
      var wsamp_s;
      var fftenergy = new_float$6(Encoder$6.HBLKSIZE);
      var fftenergy_s = new_float_n$2([3, Encoder$6.HBLKSIZE_s]);
      var wsamp_L = new_float_n$2([2, Encoder$6.BLKSIZE]);
      var wsamp_S = new_float_n$2([2, 3, Encoder$6.BLKSIZE_s]);
      var eb = new_float_n$2([4, Encoder$6.CBANDS]), thr = new_float_n$2([4, Encoder$6.CBANDS]);
      var sub_short_factor = new_float_n$2([4, 3]);
      var pcfact = 0.6;
      var ns_attacks = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      var uselongblock = new_int$7(2);
      var n_chn_psy = gfp.mode == MPEGMode$1.JOINT_STEREO ? 4 : gfc.channels_out;
      vbrpsy_attack_detection(
        gfp,
        buffer,
        bufPos,
        gr_out,
        masking_ratio,
        masking_MS_ratio,
        energy,
        sub_short_factor,
        ns_attacks,
        uselongblock
      );
      vbrpsy_compute_block_type(gfp, uselongblock);
      {
        for (var chn = 0; chn < n_chn_psy; chn++) {
          var ch01 = chn & 1;
          wsamp_l = wsamp_L;
          vbrpsy_compute_fft_l(
            gfp,
            buffer,
            bufPos,
            chn,
            gr_out,
            fftenergy,
            wsamp_l,
            ch01
          );
          vbrpsy_compute_loudness_approximation_l(
            gfp,
            gr_out,
            chn,
            fftenergy
          );
          if (uselongblock[ch01] != 0) {
            vbrpsy_compute_masking_l(
              gfc,
              fftenergy,
              eb[chn],
              thr[chn],
              chn
            );
          } else {
            vbrpsy_skip_masking_l(gfc, chn);
          }
        }
        if (uselongblock[0] + uselongblock[1] == 2) {
          if (gfp.mode == MPEGMode$1.JOINT_STEREO) {
            vbrpsy_compute_MS_thresholds(
              eb,
              thr,
              gfc.mld_cb_l,
              gfc.ATH.cb_l,
              gfp.ATHlower * gfc.ATH.adjust,
              gfp.msfix,
              gfc.npart_l
            );
          }
        }
        for (var chn = 0; chn < n_chn_psy; chn++) {
          var ch01 = chn & 1;
          if (uselongblock[ch01] != 0) {
            convert_partition2scalefac_l(gfc, eb[chn], thr[chn], chn);
          }
        }
      }
      {
        for (var sblock = 0; sblock < 3; sblock++) {
          for (var chn = 0; chn < n_chn_psy; ++chn) {
            var ch01 = chn & 1;
            if (uselongblock[ch01] != 0) {
              vbrpsy_skip_masking_s(gfc, chn, sblock);
            } else {
              wsamp_s = wsamp_S;
              vbrpsy_compute_fft_s(
                gfp,
                buffer,
                bufPos,
                chn,
                sblock,
                fftenergy_s,
                wsamp_s,
                ch01
              );
              vbrpsy_compute_masking_s(
                gfp,
                fftenergy_s,
                eb[chn],
                thr[chn],
                chn,
                sblock
              );
            }
          }
          if (uselongblock[0] + uselongblock[1] == 0) {
            if (gfp.mode == MPEGMode$1.JOINT_STEREO) {
              vbrpsy_compute_MS_thresholds(
                eb,
                thr,
                gfc.mld_cb_s,
                gfc.ATH.cb_s,
                gfp.ATHlower * gfc.ATH.adjust,
                gfp.msfix,
                gfc.npart_s
              );
            }
          }
          for (var chn = 0; chn < n_chn_psy; ++chn) {
            var ch01 = chn & 1;
            if (0 == uselongblock[ch01]) {
              convert_partition2scalefac_s(
                gfc,
                eb[chn],
                thr[chn],
                chn,
                sblock
              );
            }
          }
        }
        for (var chn = 0; chn < n_chn_psy; chn++) {
          var ch01 = chn & 1;
          if (uselongblock[ch01] != 0) {
            continue;
          }
          for (var sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
            var new_thmm = new_float$6(3);
            for (var sblock = 0; sblock < 3; sblock++) {
              var thmm = gfc.thm[chn].s[sb][sblock];
              thmm *= NS_PREECHO_ATT0;
              if (ns_attacks[chn][sblock] >= 2 || ns_attacks[chn][sblock + 1] == 1) {
                var idx = sblock != 0 ? sblock - 1 : 2;
                var p2 = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT1 * pcfact
                );
                thmm = Math.min(thmm, p2);
              } else if (ns_attacks[chn][sblock] == 1) {
                var idx = sblock != 0 ? sblock - 1 : 2;
                var p2 = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT2 * pcfact
                );
                thmm = Math.min(thmm, p2);
              } else if (sblock != 0 && ns_attacks[chn][sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
                var idx = sblock != 2 ? sblock + 1 : 0;
                var p2 = NS_INTERP(
                  gfc.thm[chn].s[sb][idx],
                  thmm,
                  NS_PREECHO_ATT2 * pcfact
                );
                thmm = Math.min(thmm, p2);
              }
              thmm *= sub_short_factor[chn][sblock];
              new_thmm[sblock] = thmm;
            }
            for (var sblock = 0; sblock < 3; sblock++) {
              gfc.thm[chn].s[sb][sblock] = new_thmm[sblock];
            }
          }
        }
      }
      for (var chn = 0; chn < n_chn_psy; chn++) {
        gfc.nsPsy.lastAttacks[chn] = ns_attacks[chn][2];
      }
      vbrpsy_apply_block_type(gfp, uselongblock, blocktype_d);
      for (var chn = 0; chn < n_chn_psy; chn++) {
        var ppe;
        var ppePos;
        var type;
        var mr;
        if (chn > 1) {
          ppe = percep_MS_entropy;
          ppePos = -2;
          type = Encoder$6.NORM_TYPE;
          if (blocktype_d[0] == Encoder$6.SHORT_TYPE || blocktype_d[1] == Encoder$6.SHORT_TYPE)
            type = Encoder$6.SHORT_TYPE;
          mr = masking_MS_ratio[gr_out][chn - 2];
        } else {
          ppe = percep_entropy;
          ppePos = 0;
          type = blocktype_d[chn];
          mr = masking_ratio[gr_out][chn];
        }
        if (type == Encoder$6.SHORT_TYPE) {
          ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
        } else {
          ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
        }
        if (gfp.analysis) {
          gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
        }
      }
      return 0;
    };
    function s3_func_x(bark, hf_slope) {
      var tempx = bark, tempy;
      if (tempx >= 0) {
        tempy = -tempx * 27;
      } else {
        tempy = tempx * hf_slope;
      }
      if (tempy <= -72) {
        return 0;
      }
      return Math.exp(tempy * LN_TO_LOG10);
    }
    function norm_s3_func_x(hf_slope) {
      var lim_a = 0, lim_b = 0;
      {
        var x = 0, l2, h;
        for (x = 0; s3_func_x(x, hf_slope) > 1e-20; x -= 1)
          ;
        l2 = x;
        h = 0;
        while (Math.abs(h - l2) > 1e-12) {
          x = (h + l2) / 2;
          if (s3_func_x(x, hf_slope) > 0) {
            h = x;
          } else {
            l2 = x;
          }
        }
        lim_a = l2;
      }
      {
        var x = 0, l2, h;
        for (x = 0; s3_func_x(x, hf_slope) > 1e-20; x += 1)
          ;
        l2 = 0;
        h = x;
        while (Math.abs(h - l2) > 1e-12) {
          x = (h + l2) / 2;
          if (s3_func_x(x, hf_slope) > 0) {
            l2 = x;
          } else {
            h = x;
          }
        }
        lim_b = h;
      }
      {
        var sum = 0;
        var m2 = 1e3;
        var i;
        for (i = 0; i <= m2; ++i) {
          var x = lim_a + i * (lim_b - lim_a) / m2;
          var y = s3_func_x(x, hf_slope);
          sum += y;
        }
        {
          var norm = (m2 + 1) / (sum * (lim_b - lim_a));
          return norm;
        }
      }
    }
    function s3_func(bark) {
      var tempx, x, tempy, temp;
      tempx = bark;
      if (tempx >= 0)
        tempx *= 3;
      else
        tempx *= 1.5;
      if (tempx >= 0.5 && tempx <= 2.5) {
        temp = tempx - 0.5;
        x = 8 * (temp * temp - 2 * temp);
      } else
        x = 0;
      tempx += 0.474;
      tempy = 15.811389 + 7.5 * tempx - 17.5 * Math.sqrt(1 + tempx * tempx);
      if (tempy <= -60)
        return 0;
      tempx = Math.exp((x + tempy) * LN_TO_LOG10);
      tempx /= 0.6609193;
      return tempx;
    }
    function freq2bark(freq) {
      if (freq < 0)
        freq = 0;
      freq = freq * 1e-3;
      return 13 * Math.atan(0.76 * freq) + 3.5 * Math.atan(freq * freq / (7.5 * 7.5));
    }
    function init_numline(numlines, bo, bm, bval, bval_width, mld, bo_w, sfreq, blksize, scalepos, deltafreq, sbmax) {
      var b_frq = new_float$6(Encoder$6.CBANDS + 1);
      var sample_freq_frac = sfreq / (sbmax > 15 ? 2 * 576 : 2 * 192);
      var partition = new_int$7(Encoder$6.HBLKSIZE);
      var i;
      sfreq /= blksize;
      var j = 0;
      var ni = 0;
      for (i = 0; i < Encoder$6.CBANDS; i++) {
        var bark1;
        var j2;
        bark1 = freq2bark(sfreq * j);
        b_frq[i] = sfreq * j;
        for (j2 = j; freq2bark(sfreq * j2) - bark1 < DELBARK && j2 <= blksize / 2; j2++)
          ;
        numlines[i] = j2 - j;
        ni = i + 1;
        while (j < j2) {
          assert$2(j < Encoder$6.HBLKSIZE);
          partition[j++] = i;
        }
        if (j > blksize / 2) {
          j = blksize / 2;
          ++i;
          break;
        }
      }
      assert$2(i < Encoder$6.CBANDS);
      b_frq[i] = sfreq * j;
      for (var sfb = 0; sfb < sbmax; sfb++) {
        var i1, i2, start, end;
        var arg;
        start = scalepos[sfb];
        end = scalepos[sfb + 1];
        i1 = 0 | Math.floor(0.5 + deltafreq * (start - 0.5));
        if (i1 < 0)
          i1 = 0;
        i2 = 0 | Math.floor(0.5 + deltafreq * (end - 0.5));
        if (i2 > blksize / 2)
          i2 = blksize / 2;
        bm[sfb] = (partition[i1] + partition[i2]) / 2;
        bo[sfb] = partition[i2];
        var f_tmp = sample_freq_frac * end;
        bo_w[sfb] = (f_tmp - b_frq[bo[sfb]]) / (b_frq[bo[sfb] + 1] - b_frq[bo[sfb]]);
        if (bo_w[sfb] < 0) {
          bo_w[sfb] = 0;
        } else {
          if (bo_w[sfb] > 1) {
            bo_w[sfb] = 1;
          }
        }
        arg = freq2bark(sfreq * scalepos[sfb] * deltafreq);
        arg = Math.min(arg, 15.5) / 15.5;
        mld[sfb] = Math.pow(
          10,
          1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
        );
      }
      j = 0;
      for (var k2 = 0; k2 < ni; k2++) {
        var w = numlines[k2];
        var bark1, bark2;
        bark1 = freq2bark(sfreq * j);
        bark2 = freq2bark(sfreq * (j + w - 1));
        bval[k2] = 0.5 * (bark1 + bark2);
        bark1 = freq2bark(sfreq * (j - 0.5));
        bark2 = freq2bark(sfreq * (j + w - 0.5));
        bval_width[k2] = bark2 - bark1;
        j += w;
      }
      return ni;
    }
    function init_s3_values(s3ind, npart, bval, bval_width, norm, use_old_s3) {
      var s3 = new_float_n$2([Encoder$6.CBANDS, Encoder$6.CBANDS]);
      var j;
      var numberOfNoneZero = 0;
      if (use_old_s3) {
        for (var i = 0; i < npart; i++) {
          for (j = 0; j < npart; j++) {
            var v = s3_func(bval[i] - bval[j]) * bval_width[j];
            s3[i][j] = v * norm[i];
          }
        }
      } else {
        for (j = 0; j < npart; j++) {
          var hf_slope = 15 + Math.min(21 / bval[j], 12);
          var s3_x_norm = norm_s3_func_x(hf_slope);
          for (var i = 0; i < npart; i++) {
            var v = s3_x_norm * s3_func_x(bval[i] - bval[j], hf_slope) * bval_width[j];
            s3[i][j] = v * norm[i];
          }
        }
      }
      for (var i = 0; i < npart; i++) {
        for (j = 0; j < npart; j++) {
          if (s3[i][j] > 0)
            break;
        }
        s3ind[i][0] = j;
        for (j = npart - 1; j > 0; j--) {
          if (s3[i][j] > 0)
            break;
        }
        s3ind[i][1] = j;
        numberOfNoneZero += s3ind[i][1] - s3ind[i][0] + 1;
      }
      var p2 = new_float$6(numberOfNoneZero);
      var k2 = 0;
      for (var i = 0; i < npart; i++)
        for (j = s3ind[i][0]; j <= s3ind[i][1]; j++)
          p2[k2++] = s3[i][j];
      return p2;
    }
    function stereo_demask(f2) {
      var arg = freq2bark(f2);
      arg = Math.min(arg, 15.5) / 15.5;
      return Math.pow(
        10,
        1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
      );
    }
    this.psymodel_init = function(gfp) {
      var gfc = gfp.internal_flags;
      var i;
      var useOldS3 = true;
      var bvl_a = 13, bvl_b = 24;
      var snr_l_a = 0, snr_l_b = 0;
      var snr_s_a = -8.25, snr_s_b = -4.5;
      var bval = new_float$6(Encoder$6.CBANDS);
      var bval_width = new_float$6(Encoder$6.CBANDS);
      var norm = new_float$6(Encoder$6.CBANDS);
      var sfreq = gfp.out_samplerate;
      switch (gfp.experimentalZ) {
        default:
        case 0:
          useOldS3 = true;
          break;
        case 1:
          useOldS3 = gfp.VBR == VbrMode$1.vbr_mtrh || gfp.VBR == VbrMode$1.vbr_mt ? false : true;
          break;
        case 2:
          useOldS3 = false;
          break;
        case 3:
          bvl_a = 8;
          snr_l_a = -1.75;
          snr_l_b = -0.0125;
          snr_s_a = -8.25;
          snr_s_b = -2.25;
          break;
      }
      gfc.ms_ener_ratio_old = 0.25;
      gfc.blocktype_old[0] = gfc.blocktype_old[1] = Encoder$6.NORM_TYPE;
      for (i = 0; i < 4; ++i) {
        for (var j = 0; j < Encoder$6.CBANDS; ++j) {
          gfc.nb_1[i][j] = 1e20;
          gfc.nb_2[i][j] = 1e20;
          gfc.nb_s1[i][j] = gfc.nb_s2[i][j] = 1;
        }
        for (var sb = 0; sb < Encoder$6.SBMAX_l; sb++) {
          gfc.en[i].l[sb] = 1e20;
          gfc.thm[i].l[sb] = 1e20;
        }
        for (var j = 0; j < 3; ++j) {
          for (var sb = 0; sb < Encoder$6.SBMAX_s; sb++) {
            gfc.en[i].s[sb][j] = 1e20;
            gfc.thm[i].s[sb][j] = 1e20;
          }
          gfc.nsPsy.lastAttacks[i] = 0;
        }
        for (var j = 0; j < 9; j++)
          gfc.nsPsy.last_en_subshort[i][j] = 10;
      }
      gfc.loudness_sq_save[0] = gfc.loudness_sq_save[1] = 0;
      gfc.npart_l = init_numline(
        gfc.numlines_l,
        gfc.bo_l,
        gfc.bm_l,
        bval,
        bval_width,
        gfc.mld_l,
        gfc.PSY.bo_l_weight,
        sfreq,
        Encoder$6.BLKSIZE,
        gfc.scalefac_band.l,
        Encoder$6.BLKSIZE / (2 * 576),
        Encoder$6.SBMAX_l
      );
      assert$2(gfc.npart_l < Encoder$6.CBANDS);
      for (i = 0; i < gfc.npart_l; i++) {
        var snr = snr_l_a;
        if (bval[i] >= bvl_a) {
          snr = snr_l_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_l_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
        }
        norm[i] = Math.pow(10, snr / 10);
        if (gfc.numlines_l[i] > 0) {
          gfc.rnumlines_l[i] = 1 / gfc.numlines_l[i];
        } else {
          gfc.rnumlines_l[i] = 0;
        }
      }
      gfc.s3_ll = init_s3_values(
        gfc.s3ind,
        gfc.npart_l,
        bval,
        bval_width,
        norm,
        useOldS3
      );
      var j = 0;
      for (i = 0; i < gfc.npart_l; i++) {
        var x;
        x = Float.MAX_VALUE;
        for (var k2 = 0; k2 < gfc.numlines_l[i]; k2++, j++) {
          var freq = sfreq * j / (1e3 * Encoder$6.BLKSIZE);
          var level;
          level = this.ATHformula(freq * 1e3, gfp) - 20;
          level = Math.pow(10, 0.1 * level);
          level *= gfc.numlines_l[i];
          if (x > level)
            x = level;
        }
        gfc.ATH.cb_l[i] = x;
        x = -20 + bval[i] * 20 / 10;
        if (x > 6) {
          x = 100;
        }
        if (x < -15) {
          x = -15;
        }
        x -= 8;
        gfc.minval_l[i] = Math.pow(10, x / 10) * gfc.numlines_l[i];
      }
      gfc.npart_s = init_numline(
        gfc.numlines_s,
        gfc.bo_s,
        gfc.bm_s,
        bval,
        bval_width,
        gfc.mld_s,
        gfc.PSY.bo_s_weight,
        sfreq,
        Encoder$6.BLKSIZE_s,
        gfc.scalefac_band.s,
        Encoder$6.BLKSIZE_s / (2 * 192),
        Encoder$6.SBMAX_s
      );
      assert$2(gfc.npart_s < Encoder$6.CBANDS);
      j = 0;
      for (i = 0; i < gfc.npart_s; i++) {
        var x;
        var snr = snr_s_a;
        if (bval[i] >= bvl_a) {
          snr = snr_s_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_s_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
        }
        norm[i] = Math.pow(10, snr / 10);
        x = Float.MAX_VALUE;
        for (var k2 = 0; k2 < gfc.numlines_s[i]; k2++, j++) {
          var freq = sfreq * j / (1e3 * Encoder$6.BLKSIZE_s);
          var level;
          level = this.ATHformula(freq * 1e3, gfp) - 20;
          level = Math.pow(10, 0.1 * level);
          level *= gfc.numlines_s[i];
          if (x > level)
            x = level;
        }
        gfc.ATH.cb_s[i] = x;
        x = -7 + bval[i] * 7 / 12;
        if (bval[i] > 12) {
          x *= 1 + Math.log(1 + x) * 3.1;
        }
        if (bval[i] < 12) {
          x *= 1 + Math.log(1 - x) * 2.3;
        }
        if (x < -15) {
          x = -15;
        }
        x -= 8;
        gfc.minval_s[i] = Math.pow(10, x / 10) * gfc.numlines_s[i];
      }
      gfc.s3_ss = init_s3_values(
        gfc.s3ind_s,
        gfc.npart_s,
        bval,
        bval_width,
        norm,
        useOldS3
      );
      init_mask_add_max_values();
      fft.init_fft(gfc);
      gfc.decay = Math.exp(-1 * LOG10 / (temporalmask_sustain_sec * sfreq / 192));
      {
        var msfix;
        msfix = NS_MSFIX;
        if ((gfp.exp_nspsytune & 2) != 0)
          msfix = 1;
        if (Math.abs(gfp.msfix) > 0)
          msfix = gfp.msfix;
        gfp.msfix = msfix;
        for (var b = 0; b < gfc.npart_l; b++)
          if (gfc.s3ind[b][1] > gfc.npart_l - 1)
            gfc.s3ind[b][1] = gfc.npart_l - 1;
      }
      var frame_duration = 576 * gfc.mode_gr / sfreq;
      gfc.ATH.decay = Math.pow(10, -12 / 10 * frame_duration);
      gfc.ATH.adjust = 0.01;
      gfc.ATH.adjustLimit = 1;
      assert$2(gfc.bo_l[Encoder$6.SBMAX_l - 1] <= gfc.npart_l);
      assert$2(gfc.bo_s[Encoder$6.SBMAX_s - 1] <= gfc.npart_s);
      if (gfp.ATHtype != -1) {
        var freq;
        var freq_inc = gfp.out_samplerate / Encoder$6.BLKSIZE;
        var eql_balance = 0;
        freq = 0;
        for (i = 0; i < Encoder$6.BLKSIZE / 2; ++i) {
          freq += freq_inc;
          gfc.ATH.eql_w[i] = 1 / Math.pow(10, this.ATHformula(freq, gfp) / 10);
          eql_balance += gfc.ATH.eql_w[i];
        }
        eql_balance = 1 / eql_balance;
        for (i = Encoder$6.BLKSIZE / 2; --i >= 0; ) {
          gfc.ATH.eql_w[i] *= eql_balance;
        }
      }
      {
        for (var b = j = 0; b < gfc.npart_s; ++b) {
          for (i = 0; i < gfc.numlines_s[b]; ++i) {
            ++j;
          }
        }
        for (var b = j = 0; b < gfc.npart_l; ++b) {
          for (i = 0; i < gfc.numlines_l[b]; ++i) {
            ++j;
          }
        }
      }
      j = 0;
      for (i = 0; i < gfc.npart_l; i++) {
        var freq = sfreq * (j + gfc.numlines_l[i] / 2) / (1 * Encoder$6.BLKSIZE);
        gfc.mld_cb_l[i] = stereo_demask(freq);
        j += gfc.numlines_l[i];
      }
      for (; i < Encoder$6.CBANDS; ++i) {
        gfc.mld_cb_l[i] = 1;
      }
      j = 0;
      for (i = 0; i < gfc.npart_s; i++) {
        var freq = sfreq * (j + gfc.numlines_s[i] / 2) / (1 * Encoder$6.BLKSIZE_s);
        gfc.mld_cb_s[i] = stereo_demask(freq);
        j += gfc.numlines_s[i];
      }
      for (; i < Encoder$6.CBANDS; ++i) {
        gfc.mld_cb_s[i] = 1;
      }
      return 0;
    };
    function ATHformula_GB(f2, value) {
      if (f2 < -0.3)
        f2 = 3410;
      f2 /= 1e3;
      f2 = Math.max(0.1, f2);
      var ath = 3.64 * Math.pow(f2, -0.8) - 6.8 * Math.exp(-0.6 * Math.pow(f2 - 3.4, 2)) + 6 * Math.exp(-0.15 * Math.pow(f2 - 8.7, 2)) + (0.6 + 0.04 * value) * 1e-3 * Math.pow(f2, 4);
      return ath;
    }
    this.ATHformula = function(f2, gfp) {
      var ath;
      switch (gfp.ATHtype) {
        case 0:
          ath = ATHformula_GB(f2, 9);
          break;
        case 1:
          ath = ATHformula_GB(f2, -1);
          break;
        case 2:
          ath = ATHformula_GB(f2, 0);
          break;
        case 3:
          ath = ATHformula_GB(f2, 1) + 6;
          break;
        case 4:
          ath = ATHformula_GB(f2, gfp.ATHcurve);
          break;
        default:
          ath = ATHformula_GB(f2, 0);
          break;
      }
      return ath;
    };
  }
  var PsyModel_1 = PsyModel;
  var MPEGMode = MPEGMode_1;
  function LameGlobalFlags() {
    this.class_id = 0;
    this.num_samples = 0;
    this.num_channels = 0;
    this.in_samplerate = 0;
    this.out_samplerate = 0;
    this.scale = 0;
    this.scale_left = 0;
    this.scale_right = 0;
    this.analysis = false;
    this.bWriteVbrTag = false;
    this.decode_only = false;
    this.quality = 0;
    this.mode = MPEGMode.STEREO;
    this.force_ms = false;
    this.free_format = false;
    this.findReplayGain = false;
    this.decode_on_the_fly = false;
    this.write_id3tag_automatic = false;
    this.brate = 0;
    this.compression_ratio = 0;
    this.copyright = 0;
    this.original = 0;
    this.extension = 0;
    this.emphasis = 0;
    this.error_protection = 0;
    this.strict_ISO = false;
    this.disable_reservoir = false;
    this.quant_comp = 0;
    this.quant_comp_short = 0;
    this.experimentalY = false;
    this.experimentalZ = 0;
    this.exp_nspsytune = 0;
    this.preset = 0;
    this.VBR = null;
    this.VBR_q_frac = 0;
    this.VBR_q = 0;
    this.VBR_mean_bitrate_kbps = 0;
    this.VBR_min_bitrate_kbps = 0;
    this.VBR_max_bitrate_kbps = 0;
    this.VBR_hard_min = 0;
    this.lowpassfreq = 0;
    this.highpassfreq = 0;
    this.lowpasswidth = 0;
    this.highpasswidth = 0;
    this.maskingadjust = 0;
    this.maskingadjust_short = 0;
    this.ATHonly = false;
    this.ATHshort = false;
    this.noATH = false;
    this.ATHtype = 0;
    this.ATHcurve = 0;
    this.ATHlower = 0;
    this.athaa_type = 0;
    this.athaa_loudapprox = 0;
    this.athaa_sensitivity = 0;
    this.short_blocks = null;
    this.useTemporal = false;
    this.interChRatio = 0;
    this.msfix = 0;
    this.tune = false;
    this.tune_value_a = 0;
    this.version = 0;
    this.encoder_delay = 0;
    this.encoder_padding = 0;
    this.framesize = 0;
    this.frameNum = 0;
    this.lame_allocated_gfp = 0;
    this.internal_flags = null;
  }
  var LameGlobalFlags_1 = LameGlobalFlags;
  var Encoder$5 = requireEncoder();
  var L3Side$4 = {};
  L3Side$4.SFBMAX = Encoder$5.SBMAX_s * 3;
  var L3Side_1 = L3Side$4;
  var common$e = common$h;
  var new_float$5 = common$e.new_float;
  var new_int$6 = common$e.new_int;
  var L3Side$3 = L3Side_1;
  function GrInfo$1() {
    this.xr = new_float$5(576);
    this.l3_enc = new_int$6(576);
    this.scalefac = new_int$6(L3Side$3.SFBMAX);
    this.xrpow_max = 0;
    this.part2_3_length = 0;
    this.big_values = 0;
    this.count1 = 0;
    this.global_gain = 0;
    this.scalefac_compress = 0;
    this.block_type = 0;
    this.mixed_block_flag = 0;
    this.table_select = new_int$6(3);
    this.subblock_gain = new_int$6(3 + 1);
    this.region0_count = 0;
    this.region1_count = 0;
    this.preflag = 0;
    this.scalefac_scale = 0;
    this.count1table_select = 0;
    this.part2_length = 0;
    this.sfb_lmax = 0;
    this.sfb_smin = 0;
    this.psy_lmax = 0;
    this.sfbmax = 0;
    this.psymax = 0;
    this.sfbdivide = 0;
    this.width = new_int$6(L3Side$3.SFBMAX);
    this.window = new_int$6(L3Side$3.SFBMAX);
    this.count1bits = 0;
    this.sfb_partition_table = null;
    this.slen = new_int$6(4);
    this.max_nonzero_coeff = 0;
    var self2 = this;
    function clone_int(array) {
      return new Int32Array(array);
    }
    function clone_float(array) {
      return new Float32Array(array);
    }
    this.assign = function(other) {
      self2.xr = clone_float(other.xr);
      self2.l3_enc = clone_int(other.l3_enc);
      self2.scalefac = clone_int(other.scalefac);
      self2.xrpow_max = other.xrpow_max;
      self2.part2_3_length = other.part2_3_length;
      self2.big_values = other.big_values;
      self2.count1 = other.count1;
      self2.global_gain = other.global_gain;
      self2.scalefac_compress = other.scalefac_compress;
      self2.block_type = other.block_type;
      self2.mixed_block_flag = other.mixed_block_flag;
      self2.table_select = clone_int(other.table_select);
      self2.subblock_gain = clone_int(other.subblock_gain);
      self2.region0_count = other.region0_count;
      self2.region1_count = other.region1_count;
      self2.preflag = other.preflag;
      self2.scalefac_scale = other.scalefac_scale;
      self2.count1table_select = other.count1table_select;
      self2.part2_length = other.part2_length;
      self2.sfb_lmax = other.sfb_lmax;
      self2.sfb_smin = other.sfb_smin;
      self2.psy_lmax = other.psy_lmax;
      self2.sfbmax = other.sfbmax;
      self2.psymax = other.psymax;
      self2.sfbdivide = other.sfbdivide;
      self2.width = clone_int(other.width);
      self2.window = clone_int(other.window);
      self2.count1bits = other.count1bits;
      self2.sfb_partition_table = other.sfb_partition_table.slice(0);
      self2.slen = clone_int(other.slen);
      self2.max_nonzero_coeff = other.max_nonzero_coeff;
    };
  }
  var GrInfo_1 = GrInfo$1;
  var common$d = common$h;
  var new_int$5 = common$d.new_int;
  var GrInfo = GrInfo_1;
  function IIISideInfo$1() {
    this.tt = [[null, null], [null, null]];
    this.main_data_begin = 0;
    this.private_bits = 0;
    this.resvDrain_pre = 0;
    this.resvDrain_post = 0;
    this.scfsi = [new_int$5(4), new_int$5(4)];
    for (var gr = 0; gr < 2; gr++) {
      for (var ch = 0; ch < 2; ch++) {
        this.tt[gr][ch] = new GrInfo();
      }
    }
  }
  var IIISideInfo_1 = IIISideInfo$1;
  var common$c = common$h;
  var System$2 = common$c.System;
  var new_int$4 = common$c.new_int;
  var Encoder$4 = requireEncoder();
  function ScaleFac$1(arrL, arrS, arr21, arr12) {
    this.l = new_int$4(1 + Encoder$4.SBMAX_l);
    this.s = new_int$4(1 + Encoder$4.SBMAX_s);
    this.psfb21 = new_int$4(1 + Encoder$4.PSFB21);
    this.psfb12 = new_int$4(1 + Encoder$4.PSFB12);
    var l2 = this.l;
    var s = this.s;
    if (arguments.length == 4) {
      this.arrL = arguments[0];
      this.arrS = arguments[1];
      this.arr21 = arguments[2];
      this.arr12 = arguments[3];
      System$2.arraycopy(this.arrL, 0, l2, 0, Math.min(this.arrL.length, this.l.length));
      System$2.arraycopy(this.arrS, 0, s, 0, Math.min(this.arrS.length, this.s.length));
      System$2.arraycopy(this.arr21, 0, this.psfb21, 0, Math.min(this.arr21.length, this.psfb21.length));
      System$2.arraycopy(this.arr12, 0, this.psfb12, 0, Math.min(this.arr12.length, this.psfb12.length));
    }
  }
  var ScaleFac_1 = ScaleFac$1;
  var common$b = common$h;
  var new_float$4 = common$b.new_float;
  var new_float_n$1 = common$b.new_float_n;
  var new_int$3 = common$b.new_int;
  var Encoder$3 = requireEncoder();
  function NsPsy$1() {
    this.last_en_subshort = new_float_n$1([4, 9]);
    this.lastAttacks = new_int$3(4);
    this.pefirbuf = new_float$4(19);
    this.longfact = new_float$4(Encoder$3.SBMAX_l);
    this.shortfact = new_float$4(Encoder$3.SBMAX_s);
    this.attackthre = 0;
    this.attackthre_s = 0;
  }
  var NsPsy_1 = NsPsy$1;
  function VBRSeekInfo$1() {
    this.sum = 0;
    this.seen = 0;
    this.want = 0;
    this.pos = 0;
    this.size = 0;
    this.bag = null;
    this.nVbrNumFrames = 0;
    this.nBytesWritten = 0;
    this.TotalFrameSize = 0;
  }
  var VBRSeekInfo_1 = VBRSeekInfo$1;
  var common$a = common$h;
  var new_byte$1 = common$a.new_byte;
  var new_double = common$a.new_double;
  var new_float$3 = common$a.new_float;
  var new_float_n = common$a.new_float_n;
  var new_int$2 = common$a.new_int;
  var new_int_n = common$a.new_int_n;
  var IIISideInfo = IIISideInfo_1;
  var ScaleFac = ScaleFac_1;
  var NsPsy = NsPsy_1;
  var VBRSeekInfo = VBRSeekInfo_1;
  var III_psy_xmin = requireIII_psy_xmin();
  var Encoder$2 = requireEncoder();
  var L3Side$2 = L3Side_1;
  LameInternalFlags$1.MFSIZE = 3 * 1152 + Encoder$2.ENCDELAY - Encoder$2.MDCTDELAY;
  LameInternalFlags$1.MAX_HEADER_BUF = 256;
  LameInternalFlags$1.MAX_BITS_PER_CHANNEL = 4095;
  LameInternalFlags$1.MAX_BITS_PER_GRANULE = 7680;
  LameInternalFlags$1.BPC = 320;
  function LameInternalFlags$1() {
    var MAX_HEADER_LEN = 40;
    this.Class_ID = 0;
    this.lame_encode_frame_init = 0;
    this.iteration_init_init = 0;
    this.fill_buffer_resample_init = 0;
    this.mfbuf = new_float_n([2, LameInternalFlags$1.MFSIZE]);
    this.mode_gr = 0;
    this.channels_in = 0;
    this.channels_out = 0;
    this.resample_ratio = 0;
    this.mf_samples_to_encode = 0;
    this.mf_size = 0;
    this.VBR_min_bitrate = 0;
    this.VBR_max_bitrate = 0;
    this.bitrate_index = 0;
    this.samplerate_index = 0;
    this.mode_ext = 0;
    this.lowpass1 = 0;
    this.lowpass2 = 0;
    this.highpass1 = 0;
    this.highpass2 = 0;
    this.noise_shaping = 0;
    this.noise_shaping_amp = 0;
    this.substep_shaping = 0;
    this.psymodel = 0;
    this.noise_shaping_stop = 0;
    this.subblock_gain = 0;
    this.use_best_huffman = 0;
    this.full_outer_loop = 0;
    this.l3_side = new IIISideInfo();
    this.ms_ratio = new_float$3(2);
    this.padding = 0;
    this.frac_SpF = 0;
    this.slot_lag = 0;
    this.tag_spec = null;
    this.nMusicCRC = 0;
    this.OldValue = new_int$2(2);
    this.CurrentStep = new_int$2(2);
    this.masking_lower = 0;
    this.bv_scf = new_int$2(576);
    this.pseudohalf = new_int$2(L3Side$2.SFBMAX);
    this.sfb21_extra = false;
    this.inbuf_old = new Array(2);
    this.blackfilt = new Array(2 * LameInternalFlags$1.BPC + 1);
    this.itime = new_double(2);
    this.sideinfo_len = 0;
    this.sb_sample = new_float_n([2, 2, 18, Encoder$2.SBLIMIT]);
    this.amp_filter = new_float$3(32);
    function Header() {
      this.write_timing = 0;
      this.ptr = 0;
      this.buf = new_byte$1(MAX_HEADER_LEN);
    }
    this.header = new Array(LameInternalFlags$1.MAX_HEADER_BUF);
    this.h_ptr = 0;
    this.w_ptr = 0;
    this.ancillary_flag = 0;
    this.ResvSize = 0;
    this.ResvMax = 0;
    this.scalefac_band = new ScaleFac();
    this.minval_l = new_float$3(Encoder$2.CBANDS);
    this.minval_s = new_float$3(Encoder$2.CBANDS);
    this.nb_1 = new_float_n([4, Encoder$2.CBANDS]);
    this.nb_2 = new_float_n([4, Encoder$2.CBANDS]);
    this.nb_s1 = new_float_n([4, Encoder$2.CBANDS]);
    this.nb_s2 = new_float_n([4, Encoder$2.CBANDS]);
    this.s3_ss = null;
    this.s3_ll = null;
    this.decay = 0;
    this.thm = new Array(4);
    this.en = new Array(4);
    this.tot_ener = new_float$3(4);
    this.loudness_sq = new_float_n([2, 2]);
    this.loudness_sq_save = new_float$3(2);
    this.mld_l = new_float$3(Encoder$2.SBMAX_l);
    this.mld_s = new_float$3(Encoder$2.SBMAX_s);
    this.bm_l = new_int$2(Encoder$2.SBMAX_l);
    this.bo_l = new_int$2(Encoder$2.SBMAX_l);
    this.bm_s = new_int$2(Encoder$2.SBMAX_s);
    this.bo_s = new_int$2(Encoder$2.SBMAX_s);
    this.npart_l = 0;
    this.npart_s = 0;
    this.s3ind = new_int_n([Encoder$2.CBANDS, 2]);
    this.s3ind_s = new_int_n([Encoder$2.CBANDS, 2]);
    this.numlines_s = new_int$2(Encoder$2.CBANDS);
    this.numlines_l = new_int$2(Encoder$2.CBANDS);
    this.rnumlines_l = new_float$3(Encoder$2.CBANDS);
    this.mld_cb_l = new_float$3(Encoder$2.CBANDS);
    this.mld_cb_s = new_float$3(Encoder$2.CBANDS);
    this.numlines_s_num1 = 0;
    this.numlines_l_num1 = 0;
    this.pe = new_float$3(4);
    this.ms_ratio_s_old = 0;
    this.ms_ratio_l_old = 0;
    this.ms_ener_ratio_old = 0;
    this.blocktype_old = new_int$2(2);
    this.nsPsy = new NsPsy();
    this.VBR_seek_table = new VBRSeekInfo();
    this.ATH = null;
    this.PSY = null;
    this.nogap_total = 0;
    this.nogap_current = 0;
    this.decode_on_the_fly = true;
    this.findReplayGain = true;
    this.findPeakSample = true;
    this.PeakSample = 0;
    this.RadioGain = 0;
    this.AudiophileGain = 0;
    this.rgdata = null;
    this.noclipGainChange = 0;
    this.noclipScale = 0;
    this.bitrate_stereoMode_Hist = new_int_n([16, 4 + 1]);
    this.bitrate_blockType_Hist = new_int_n([16, 4 + 1 + 1]);
    this.pinfo = null;
    this.hip = null;
    this.in_buffer_nsamples = 0;
    this.in_buffer_0 = null;
    this.in_buffer_1 = null;
    this.iteration_loop = null;
    for (var i = 0; i < this.en.length; i++) {
      this.en[i] = new III_psy_xmin();
    }
    for (var i = 0; i < this.thm.length; i++) {
      this.thm[i] = new III_psy_xmin();
    }
    for (var i = 0; i < this.header.length; i++) {
      this.header[i] = new Header();
    }
  }
  var LameInternalFlags_1 = LameInternalFlags$1;
  var common$9 = common$h;
  var new_float$2 = common$9.new_float;
  var Encoder$1 = requireEncoder();
  function ATH() {
    this.useAdjust = 0;
    this.aaSensitivityP = 0;
    this.adjust = 0;
    this.adjustLimit = 0;
    this.decay = 0;
    this.floor = 0;
    this.l = new_float$2(Encoder$1.SBMAX_l);
    this.s = new_float$2(Encoder$1.SBMAX_s);
    this.psfb21 = new_float$2(Encoder$1.PSFB21);
    this.psfb12 = new_float$2(Encoder$1.PSFB12);
    this.cb_l = new_float$2(Encoder$1.CBANDS);
    this.cb_s = new_float$2(Encoder$1.CBANDS);
    this.eql_w = new_float$2(Encoder$1.BLKSIZE / 2);
  }
  var ATH_1 = ATH;
  var common$8 = common$h;
  var System$1 = common$8.System;
  var Arrays$1 = common$8.Arrays;
  GainAnalysis$2.STEPS_per_dB = 100;
  GainAnalysis$2.MAX_dB = 120;
  GainAnalysis$2.GAIN_NOT_ENOUGH_SAMPLES = -24601;
  GainAnalysis$2.GAIN_ANALYSIS_ERROR = 0;
  GainAnalysis$2.GAIN_ANALYSIS_OK = 1;
  GainAnalysis$2.INIT_GAIN_ANALYSIS_ERROR = 0;
  GainAnalysis$2.INIT_GAIN_ANALYSIS_OK = 1;
  GainAnalysis$2.YULE_ORDER = 10;
  GainAnalysis$2.MAX_ORDER = GainAnalysis$2.YULE_ORDER;
  GainAnalysis$2.MAX_SAMP_FREQ = 48e3;
  GainAnalysis$2.RMS_WINDOW_TIME_NUMERATOR = 1;
  GainAnalysis$2.RMS_WINDOW_TIME_DENOMINATOR = 20;
  GainAnalysis$2.MAX_SAMPLES_PER_WINDOW = GainAnalysis$2.MAX_SAMP_FREQ * GainAnalysis$2.RMS_WINDOW_TIME_NUMERATOR / GainAnalysis$2.RMS_WINDOW_TIME_DENOMINATOR + 1;
  function GainAnalysis$2() {
    var PINK_REF = 64.82;
    var RMS_PERCENTILE = 0.95;
    var RMS_WINDOW_TIME_NUMERATOR = GainAnalysis$2.RMS_WINDOW_TIME_NUMERATOR;
    var RMS_WINDOW_TIME_DENOMINATOR = GainAnalysis$2.RMS_WINDOW_TIME_DENOMINATOR;
    var ABYule = [
      [
        0.038575994352,
        -3.84664617118067,
        -0.02160367184185,
        7.81501653005538,
        -0.00123395316851,
        -11.34170355132042,
        -9291677959e-14,
        13.05504219327545,
        -0.01655260341619,
        -12.28759895145294,
        0.02161526843274,
        9.4829380631979,
        -0.02074045215285,
        -5.87257861775999,
        0.00594298065125,
        2.75465861874613,
        0.00306428023191,
        -0.86984376593551,
        12025322027e-14,
        0.13919314567432,
        0.00288463683916
      ],
      [
        0.0541865640643,
        -3.47845948550071,
        -0.02911007808948,
        6.36317777566148,
        -0.00848709379851,
        -8.54751527471874,
        -0.00851165645469,
        9.4769360780128,
        -0.00834990904936,
        -8.81498681370155,
        0.02245293253339,
        6.85401540936998,
        -0.02596338512915,
        -4.39470996079559,
        0.01624864962975,
        2.19611684890774,
        -0.00240879051584,
        -0.75104302451432,
        0.00674613682247,
        0.13149317958808,
        -0.00187763777362
      ],
      [
        0.15457299681924,
        -2.37898834973084,
        -0.09331049056315,
        2.84868151156327,
        -0.06247880153653,
        -2.64577170229825,
        0.02163541888798,
        2.23697657451713,
        -0.05588393329856,
        -1.67148153367602,
        0.04781476674921,
        1.00595954808547,
        0.00222312597743,
        -0.45953458054983,
        0.03174092540049,
        0.16378164858596,
        -0.01390589421898,
        -0.05032077717131,
        0.00651420667831,
        0.0234789740702,
        -0.00881362733839
      ],
      [
        0.30296907319327,
        -1.61273165137247,
        -0.22613988682123,
        1.0797749225997,
        -0.08587323730772,
        -0.2565625775407,
        0.03282930172664,
        -0.1627671912044,
        -0.00915702933434,
        -0.22638893773906,
        -0.02364141202522,
        0.39120800788284,
        -0.00584456039913,
        -0.22138138954925,
        0.06276101321749,
        0.04500235387352,
        -828086748e-14,
        0.02005851806501,
        0.00205861885564,
        0.00302439095741,
        -0.02950134983287
      ],
      [
        0.33642304856132,
        -1.49858979367799,
        -0.2557224142557,
        0.87350271418188,
        -0.11828570177555,
        0.12205022308084,
        0.11921148675203,
        -0.80774944671438,
        -0.07834489609479,
        0.47854794562326,
        -0.0046997791438,
        -0.12453458140019,
        -0.0058950022444,
        -0.04067510197014,
        0.05724228140351,
        0.08333755284107,
        0.00832043980773,
        -0.04237348025746,
        -0.0163538138454,
        0.02977207319925,
        -0.0176017656815
      ],
      [
        0.4491525660845,
        -0.62820619233671,
        -0.14351757464547,
        0.29661783706366,
        -0.22784394429749,
        -0.372563729424,
        -0.01419140100551,
        0.00213767857124,
        0.04078262797139,
        -0.42029820170918,
        -0.12398163381748,
        0.22199650564824,
        0.04097565135648,
        0.00613424350682,
        0.10478503600251,
        0.06747620744683,
        -0.01863887810927,
        0.05784820375801,
        -0.03193428438915,
        0.03222754072173,
        0.00541907748707
      ],
      [
        0.56619470757641,
        -1.04800335126349,
        -0.75464456939302,
        0.29156311971249,
        0.1624213774223,
        -0.26806001042947,
        0.16744243493672,
        0.00819999645858,
        -0.18901604199609,
        0.45054734505008,
        0.3093178284183,
        -0.33032403314006,
        -0.27562961986224,
        0.0673936833311,
        0.00647310677246,
        -0.04784254229033,
        0.08647503780351,
        0.01639907836189,
        -0.0378898455484,
        0.01807364323573,
        -0.00588215443421
      ],
      [
        0.58100494960553,
        -0.51035327095184,
        -0.53174909058578,
        -0.31863563325245,
        -0.14289799034253,
        -0.20256413484477,
        0.17520704835522,
        0.1472815413433,
        0.02377945217615,
        0.38952639978999,
        0.15558449135573,
        -0.23313271880868,
        -0.25344790059353,
        -0.05246019024463,
        0.01628462406333,
        -0.02505961724053,
        0.06920467763959,
        0.02442357316099,
        -0.03721611395801,
        0.01818801111503,
        -0.00749618797172
      ],
      [
        0.53648789255105,
        -0.2504987195602,
        -0.42163034350696,
        -0.43193942311114,
        -0.00275953611929,
        -0.03424681017675,
        0.04267842219415,
        -0.04678328784242,
        -0.10214864179676,
        0.26408300200955,
        0.14590772289388,
        0.15113130533216,
        -0.02459864859345,
        -0.17556493366449,
        -0.11202315195388,
        -0.18823009262115,
        -0.04060034127,
        0.05477720428674,
        0.0478866554818,
        0.0470440968812,
        -0.02217936801134
      ]
    ];
    var ABButter = [
      [
        0.98621192462708,
        -1.97223372919527,
        -1.97242384925416,
        0.97261396931306,
        0.98621192462708
      ],
      [
        0.98500175787242,
        -1.96977855582618,
        -1.97000351574484,
        0.9702284756635,
        0.98500175787242
      ],
      [
        0.97938932735214,
        -1.95835380975398,
        -1.95877865470428,
        0.95920349965459,
        0.97938932735214
      ],
      [
        0.97531843204928,
        -1.95002759149878,
        -1.95063686409857,
        0.95124613669835,
        0.97531843204928
      ],
      [
        0.97316523498161,
        -1.94561023566527,
        -1.94633046996323,
        0.94705070426118,
        0.97316523498161
      ],
      [
        0.96454515552826,
        -1.92783286977036,
        -1.92909031105652,
        0.93034775234268,
        0.96454515552826
      ],
      [
        0.96009142950541,
        -1.91858953033784,
        -1.92018285901082,
        0.92177618768381,
        0.96009142950541
      ],
      [
        0.95856916599601,
        -1.9154210807478,
        -1.91713833199203,
        0.91885558323625,
        0.95856916599601
      ],
      [
        0.94597685600279,
        -1.88903307939452,
        -1.89195371200558,
        0.89487434461664,
        0.94597685600279
      ]
    ];
    function filterYule(input, inputPos, output, outputPos, nSamples, kernel) {
      while (nSamples-- != 0) {
        output[outputPos] = 1e-10 + input[inputPos + 0] * kernel[0] - output[outputPos - 1] * kernel[1] + input[inputPos - 1] * kernel[2] - output[outputPos - 2] * kernel[3] + input[inputPos - 2] * kernel[4] - output[outputPos - 3] * kernel[5] + input[inputPos - 3] * kernel[6] - output[outputPos - 4] * kernel[7] + input[inputPos - 4] * kernel[8] - output[outputPos - 5] * kernel[9] + input[inputPos - 5] * kernel[10] - output[outputPos - 6] * kernel[11] + input[inputPos - 6] * kernel[12] - output[outputPos - 7] * kernel[13] + input[inputPos - 7] * kernel[14] - output[outputPos - 8] * kernel[15] + input[inputPos - 8] * kernel[16] - output[outputPos - 9] * kernel[17] + input[inputPos - 9] * kernel[18] - output[outputPos - 10] * kernel[19] + input[inputPos - 10] * kernel[20];
        ++outputPos;
        ++inputPos;
      }
    }
    function filterButter(input, inputPos, output, outputPos, nSamples, kernel) {
      while (nSamples-- != 0) {
        output[outputPos] = input[inputPos + 0] * kernel[0] - output[outputPos - 1] * kernel[1] + input[inputPos - 1] * kernel[2] - output[outputPos - 2] * kernel[3] + input[inputPos - 2] * kernel[4];
        ++outputPos;
        ++inputPos;
      }
    }
    function ResetSampleFrequency(rgData, samplefreq) {
      for (var i = 0; i < MAX_ORDER; i++)
        rgData.linprebuf[i] = rgData.lstepbuf[i] = rgData.loutbuf[i] = rgData.rinprebuf[i] = rgData.rstepbuf[i] = rgData.routbuf[i] = 0;
      switch (0 | samplefreq) {
        case 48e3:
          rgData.reqindex = 0;
          break;
        case 44100:
          rgData.reqindex = 1;
          break;
        case 32e3:
          rgData.reqindex = 2;
          break;
        case 24e3:
          rgData.reqindex = 3;
          break;
        case 22050:
          rgData.reqindex = 4;
          break;
        case 16e3:
          rgData.reqindex = 5;
          break;
        case 12e3:
          rgData.reqindex = 6;
          break;
        case 11025:
          rgData.reqindex = 7;
          break;
        case 8e3:
          rgData.reqindex = 8;
          break;
        default:
          return INIT_GAIN_ANALYSIS_ERROR;
      }
      rgData.sampleWindow = 0 | (samplefreq * RMS_WINDOW_TIME_NUMERATOR + RMS_WINDOW_TIME_DENOMINATOR - 1) / RMS_WINDOW_TIME_DENOMINATOR;
      rgData.lsum = 0;
      rgData.rsum = 0;
      rgData.totsamp = 0;
      Arrays$1.ill(rgData.A, 0);
      return INIT_GAIN_ANALYSIS_OK;
    }
    this.InitGainAnalysis = function(rgData, samplefreq) {
      if (ResetSampleFrequency(rgData, samplefreq) != INIT_GAIN_ANALYSIS_OK) {
        return INIT_GAIN_ANALYSIS_ERROR;
      }
      rgData.linpre = MAX_ORDER;
      rgData.rinpre = MAX_ORDER;
      rgData.lstep = MAX_ORDER;
      rgData.rstep = MAX_ORDER;
      rgData.lout = MAX_ORDER;
      rgData.rout = MAX_ORDER;
      Arrays$1.fill(rgData.B, 0);
      return INIT_GAIN_ANALYSIS_OK;
    };
    function fsqr(d) {
      return d * d;
    }
    this.AnalyzeSamples = function(rgData, left_samples, left_samplesPos, right_samples, right_samplesPos, num_samples, num_channels) {
      var curleft;
      var curleftBase;
      var curright;
      var currightBase;
      var batchsamples;
      var cursamples;
      var cursamplepos;
      if (num_samples == 0)
        return GAIN_ANALYSIS_OK;
      cursamplepos = 0;
      batchsamples = num_samples;
      switch (num_channels) {
        case 1:
          right_samples = left_samples;
          right_samplesPos = left_samplesPos;
          break;
        case 2:
          break;
        default:
          return GAIN_ANALYSIS_ERROR;
      }
      if (num_samples < MAX_ORDER) {
        System$1.arraycopy(
          left_samples,
          left_samplesPos,
          rgData.linprebuf,
          MAX_ORDER,
          num_samples
        );
        System$1.arraycopy(
          right_samples,
          right_samplesPos,
          rgData.rinprebuf,
          MAX_ORDER,
          num_samples
        );
      } else {
        System$1.arraycopy(
          left_samples,
          left_samplesPos,
          rgData.linprebuf,
          MAX_ORDER,
          MAX_ORDER
        );
        System$1.arraycopy(
          right_samples,
          right_samplesPos,
          rgData.rinprebuf,
          MAX_ORDER,
          MAX_ORDER
        );
      }
      while (batchsamples > 0) {
        cursamples = batchsamples > rgData.sampleWindow - rgData.totsamp ? rgData.sampleWindow - rgData.totsamp : batchsamples;
        if (cursamplepos < MAX_ORDER) {
          curleft = rgData.linpre + cursamplepos;
          curleftBase = rgData.linprebuf;
          curright = rgData.rinpre + cursamplepos;
          currightBase = rgData.rinprebuf;
          if (cursamples > MAX_ORDER - cursamplepos)
            cursamples = MAX_ORDER - cursamplepos;
        } else {
          curleft = left_samplesPos + cursamplepos;
          curleftBase = left_samples;
          curright = right_samplesPos + cursamplepos;
          currightBase = right_samples;
        }
        filterYule(curleftBase, curleft, rgData.lstepbuf, rgData.lstep + rgData.totsamp, cursamples, ABYule[rgData.reqindex]);
        filterYule(currightBase, curright, rgData.rstepbuf, rgData.rstep + rgData.totsamp, cursamples, ABYule[rgData.reqindex]);
        filterButter(
          rgData.lstepbuf,
          rgData.lstep + rgData.totsamp,
          rgData.loutbuf,
          rgData.lout + rgData.totsamp,
          cursamples,
          ABButter[rgData.reqindex]
        );
        filterButter(
          rgData.rstepbuf,
          rgData.rstep + rgData.totsamp,
          rgData.routbuf,
          rgData.rout + rgData.totsamp,
          cursamples,
          ABButter[rgData.reqindex]
        );
        curleft = rgData.lout + rgData.totsamp;
        curleftBase = rgData.loutbuf;
        curright = rgData.rout + rgData.totsamp;
        currightBase = rgData.routbuf;
        var i = cursamples % 8;
        while (i-- != 0) {
          rgData.lsum += fsqr(curleftBase[curleft++]);
          rgData.rsum += fsqr(currightBase[curright++]);
        }
        i = cursamples / 8;
        while (i-- != 0) {
          rgData.lsum += fsqr(curleftBase[curleft + 0]) + fsqr(curleftBase[curleft + 1]) + fsqr(curleftBase[curleft + 2]) + fsqr(curleftBase[curleft + 3]) + fsqr(curleftBase[curleft + 4]) + fsqr(curleftBase[curleft + 5]) + fsqr(curleftBase[curleft + 6]) + fsqr(curleftBase[curleft + 7]);
          curleft += 8;
          rgData.rsum += fsqr(currightBase[curright + 0]) + fsqr(currightBase[curright + 1]) + fsqr(currightBase[curright + 2]) + fsqr(currightBase[curright + 3]) + fsqr(currightBase[curright + 4]) + fsqr(currightBase[curright + 5]) + fsqr(currightBase[curright + 6]) + fsqr(currightBase[curright + 7]);
          curright += 8;
        }
        batchsamples -= cursamples;
        cursamplepos += cursamples;
        rgData.totsamp += cursamples;
        if (rgData.totsamp == rgData.sampleWindow) {
          var val = GainAnalysis$2.STEPS_per_dB * 10 * Math.log10((rgData.lsum + rgData.rsum) / rgData.totsamp * 0.5 + 1e-37);
          var ival = val <= 0 ? 0 : 0 | val;
          if (ival >= rgData.A.length)
            ival = rgData.A.length - 1;
          rgData.A[ival]++;
          rgData.lsum = rgData.rsum = 0;
          System$1.arraycopy(
            rgData.loutbuf,
            rgData.totsamp,
            rgData.loutbuf,
            0,
            MAX_ORDER
          );
          System$1.arraycopy(
            rgData.routbuf,
            rgData.totsamp,
            rgData.routbuf,
            0,
            MAX_ORDER
          );
          System$1.arraycopy(
            rgData.lstepbuf,
            rgData.totsamp,
            rgData.lstepbuf,
            0,
            MAX_ORDER
          );
          System$1.arraycopy(
            rgData.rstepbuf,
            rgData.totsamp,
            rgData.rstepbuf,
            0,
            MAX_ORDER
          );
          rgData.totsamp = 0;
        }
        if (rgData.totsamp > rgData.sampleWindow) {
          return GAIN_ANALYSIS_ERROR;
        }
      }
      if (num_samples < MAX_ORDER) {
        System$1.arraycopy(
          rgData.linprebuf,
          num_samples,
          rgData.linprebuf,
          0,
          MAX_ORDER - num_samples
        );
        System$1.arraycopy(
          rgData.rinprebuf,
          num_samples,
          rgData.rinprebuf,
          0,
          MAX_ORDER - num_samples
        );
        System$1.arraycopy(
          left_samples,
          left_samplesPos,
          rgData.linprebuf,
          MAX_ORDER - num_samples,
          num_samples
        );
        System$1.arraycopy(
          right_samples,
          right_samplesPos,
          rgData.rinprebuf,
          MAX_ORDER - num_samples,
          num_samples
        );
      } else {
        System$1.arraycopy(left_samples, left_samplesPos + num_samples - MAX_ORDER, rgData.linprebuf, 0, MAX_ORDER);
        System$1.arraycopy(right_samples, right_samplesPos + num_samples - MAX_ORDER, rgData.rinprebuf, 0, MAX_ORDER);
      }
      return GAIN_ANALYSIS_OK;
    };
    function analyzeResult(Array2, len) {
      var i;
      var elems = 0;
      for (i = 0; i < len; i++)
        elems += Array2[i];
      if (elems == 0)
        return GAIN_NOT_ENOUGH_SAMPLES;
      var upper = 0 | Math.ceil(elems * (1 - RMS_PERCENTILE));
      for (i = len; i-- > 0; ) {
        if ((upper -= Array2[i]) <= 0)
          break;
      }
      return PINK_REF - i / GainAnalysis$2.STEPS_per_dB;
    }
    this.GetTitleGain = function(rgData) {
      var retval = analyzeResult(rgData.A, rgData.A.length);
      for (var i = 0; i < rgData.A.length; i++) {
        rgData.B[i] += rgData.A[i];
        rgData.A[i] = 0;
      }
      for (var i = 0; i < MAX_ORDER; i++)
        rgData.linprebuf[i] = rgData.lstepbuf[i] = rgData.loutbuf[i] = rgData.rinprebuf[i] = rgData.rstepbuf[i] = rgData.routbuf[i] = 0;
      rgData.totsamp = 0;
      rgData.lsum = rgData.rsum = 0;
      return retval;
    };
  }
  var GainAnalysis_1 = GainAnalysis$2;
  var common$7 = common$h;
  var new_float$1 = common$7.new_float;
  var new_int$1 = common$7.new_int;
  var GainAnalysis$1 = GainAnalysis_1;
  function ReplayGain() {
    this.linprebuf = new_float$1(GainAnalysis$1.MAX_ORDER * 2);
    this.linpre = 0;
    this.lstepbuf = new_float$1(GainAnalysis$1.MAX_SAMPLES_PER_WINDOW + GainAnalysis$1.MAX_ORDER);
    this.lstep = 0;
    this.loutbuf = new_float$1(GainAnalysis$1.MAX_SAMPLES_PER_WINDOW + GainAnalysis$1.MAX_ORDER);
    this.lout = 0;
    this.rinprebuf = new_float$1(GainAnalysis$1.MAX_ORDER * 2);
    this.rinpre = 0;
    this.rstepbuf = new_float$1(GainAnalysis$1.MAX_SAMPLES_PER_WINDOW + GainAnalysis$1.MAX_ORDER);
    this.rstep = 0;
    this.routbuf = new_float$1(GainAnalysis$1.MAX_SAMPLES_PER_WINDOW + GainAnalysis$1.MAX_ORDER);
    this.rout = 0;
    this.sampleWindow = 0;
    this.totsamp = 0;
    this.lsum = 0;
    this.rsum = 0;
    this.freqindex = 0;
    this.first = 0;
    this.A = new_int$1(0 | GainAnalysis$1.STEPS_per_dB * GainAnalysis$1.MAX_dB);
    this.B = new_int$1(0 | GainAnalysis$1.STEPS_per_dB * GainAnalysis$1.MAX_dB);
  }
  var ReplayGain_1 = ReplayGain;
  function MeanBits$1(meanBits) {
    this.bits = meanBits;
  }
  var MeanBits_1 = MeanBits$1;
  var common$6 = common$h;
  var new_float = common$6.new_float;
  var new_int = common$6.new_int;
  var assert$1 = common$6.assert;
  var MeanBits = MeanBits_1;
  var Encoder = requireEncoder();
  var L3Side$1 = L3Side_1;
  var LameInternalFlags = LameInternalFlags_1;
  function CBRNewIterationLoop(_quantize) {
    var quantize = _quantize;
    this.quantize = quantize;
    this.iteration_loop = function(gfp, pe, ms_ener_ratio, ratio) {
      var gfc = gfp.internal_flags;
      var l3_xmin = new_float(L3Side$1.SFBMAX);
      var xrpow = new_float(576);
      var targ_bits = new_int(2);
      var mean_bits = 0, max_bits;
      var l3_side = gfc.l3_side;
      var mb = new MeanBits(mean_bits);
      this.quantize.rv.ResvFrameBegin(gfp, mb);
      mean_bits = mb.bits;
      for (var gr = 0; gr < gfc.mode_gr; gr++) {
        max_bits = this.quantize.qupvt.on_pe(
          gfp,
          pe,
          targ_bits,
          mean_bits,
          gr,
          gr
        );
        if (gfc.mode_ext == Encoder.MPG_MD_MS_LR) {
          this.quantize.ms_convert(gfc.l3_side, gr);
          this.quantize.qupvt.reduce_side(
            targ_bits,
            ms_ener_ratio[gr],
            mean_bits,
            max_bits
          );
        }
        for (var ch = 0; ch < gfc.channels_out; ch++) {
          var adjust, masking_lower_db;
          var cod_info = l3_side.tt[gr][ch];
          if (cod_info.block_type != Encoder.SHORT_TYPE) {
            adjust = 0;
            masking_lower_db = gfc.PSY.mask_adjust - adjust;
          } else {
            adjust = 0;
            masking_lower_db = gfc.PSY.mask_adjust_short - adjust;
          }
          gfc.masking_lower = Math.pow(
            10,
            masking_lower_db * 0.1
          );
          this.quantize.init_outer_loop(gfc, cod_info);
          if (this.quantize.init_xrpow(gfc, cod_info, xrpow)) {
            this.quantize.qupvt.calc_xmin(
              gfp,
              ratio[gr][ch],
              cod_info,
              l3_xmin
            );
            this.quantize.outer_loop(
              gfp,
              cod_info,
              l3_xmin,
              xrpow,
              ch,
              targ_bits[ch]
            );
          }
          this.quantize.iteration_finish_one(gfc, gr, ch);
          assert$1(cod_info.part2_3_length <= LameInternalFlags.MAX_BITS_PER_CHANNEL);
          assert$1(cod_info.part2_3_length <= targ_bits[ch]);
        }
      }
      this.quantize.rv.ResvFrameEnd(gfc, mean_bits);
    };
  }
  var CBRNewIterationLoop_1 = CBRNewIterationLoop;
  function HuffCodeTab(len, max, tab, hl) {
    this.xlen = len;
    this.linmax = max;
    this.table = tab;
    this.hlen = hl;
  }
  var Tables$1 = {};
  Tables$1.t1HB = [
    1,
    1,
    1,
    0
  ];
  Tables$1.t2HB = [
    1,
    2,
    1,
    3,
    1,
    1,
    3,
    2,
    0
  ];
  Tables$1.t3HB = [
    3,
    2,
    1,
    1,
    1,
    1,
    3,
    2,
    0
  ];
  Tables$1.t5HB = [
    1,
    2,
    6,
    5,
    3,
    1,
    4,
    4,
    7,
    5,
    7,
    1,
    6,
    1,
    1,
    0
  ];
  Tables$1.t6HB = [
    7,
    3,
    5,
    1,
    6,
    2,
    3,
    2,
    5,
    4,
    4,
    1,
    3,
    3,
    2,
    0
  ];
  Tables$1.t7HB = [
    1,
    2,
    10,
    19,
    16,
    10,
    3,
    3,
    7,
    10,
    5,
    3,
    11,
    4,
    13,
    17,
    8,
    4,
    12,
    11,
    18,
    15,
    11,
    2,
    7,
    6,
    9,
    14,
    3,
    1,
    6,
    4,
    5,
    3,
    2,
    0
  ];
  Tables$1.t8HB = [
    3,
    4,
    6,
    18,
    12,
    5,
    5,
    1,
    2,
    16,
    9,
    3,
    7,
    3,
    5,
    14,
    7,
    3,
    19,
    17,
    15,
    13,
    10,
    4,
    13,
    5,
    8,
    11,
    5,
    1,
    12,
    4,
    4,
    1,
    1,
    0
  ];
  Tables$1.t9HB = [
    7,
    5,
    9,
    14,
    15,
    7,
    6,
    4,
    5,
    5,
    6,
    7,
    7,
    6,
    8,
    8,
    8,
    5,
    15,
    6,
    9,
    10,
    5,
    1,
    11,
    7,
    9,
    6,
    4,
    1,
    14,
    4,
    6,
    2,
    6,
    0
  ];
  Tables$1.t10HB = [
    1,
    2,
    10,
    23,
    35,
    30,
    12,
    17,
    3,
    3,
    8,
    12,
    18,
    21,
    12,
    7,
    11,
    9,
    15,
    21,
    32,
    40,
    19,
    6,
    14,
    13,
    22,
    34,
    46,
    23,
    18,
    7,
    20,
    19,
    33,
    47,
    27,
    22,
    9,
    3,
    31,
    22,
    41,
    26,
    21,
    20,
    5,
    3,
    14,
    13,
    10,
    11,
    16,
    6,
    5,
    1,
    9,
    8,
    7,
    8,
    4,
    4,
    2,
    0
  ];
  Tables$1.t11HB = [
    3,
    4,
    10,
    24,
    34,
    33,
    21,
    15,
    5,
    3,
    4,
    10,
    32,
    17,
    11,
    10,
    11,
    7,
    13,
    18,
    30,
    31,
    20,
    5,
    25,
    11,
    19,
    59,
    27,
    18,
    12,
    5,
    35,
    33,
    31,
    58,
    30,
    16,
    7,
    5,
    28,
    26,
    32,
    19,
    17,
    15,
    8,
    14,
    14,
    12,
    9,
    13,
    14,
    9,
    4,
    1,
    11,
    4,
    6,
    6,
    6,
    3,
    2,
    0
  ];
  Tables$1.t12HB = [
    9,
    6,
    16,
    33,
    41,
    39,
    38,
    26,
    7,
    5,
    6,
    9,
    23,
    16,
    26,
    11,
    17,
    7,
    11,
    14,
    21,
    30,
    10,
    7,
    17,
    10,
    15,
    12,
    18,
    28,
    14,
    5,
    32,
    13,
    22,
    19,
    18,
    16,
    9,
    5,
    40,
    17,
    31,
    29,
    17,
    13,
    4,
    2,
    27,
    12,
    11,
    15,
    10,
    7,
    4,
    1,
    27,
    12,
    8,
    12,
    6,
    3,
    1,
    0
  ];
  Tables$1.t13HB = [
    1,
    5,
    14,
    21,
    34,
    51,
    46,
    71,
    42,
    52,
    68,
    52,
    67,
    44,
    43,
    19,
    3,
    4,
    12,
    19,
    31,
    26,
    44,
    33,
    31,
    24,
    32,
    24,
    31,
    35,
    22,
    14,
    15,
    13,
    23,
    36,
    59,
    49,
    77,
    65,
    29,
    40,
    30,
    40,
    27,
    33,
    42,
    16,
    22,
    20,
    37,
    61,
    56,
    79,
    73,
    64,
    43,
    76,
    56,
    37,
    26,
    31,
    25,
    14,
    35,
    16,
    60,
    57,
    97,
    75,
    114,
    91,
    54,
    73,
    55,
    41,
    48,
    53,
    23,
    24,
    58,
    27,
    50,
    96,
    76,
    70,
    93,
    84,
    77,
    58,
    79,
    29,
    74,
    49,
    41,
    17,
    47,
    45,
    78,
    74,
    115,
    94,
    90,
    79,
    69,
    83,
    71,
    50,
    59,
    38,
    36,
    15,
    72,
    34,
    56,
    95,
    92,
    85,
    91,
    90,
    86,
    73,
    77,
    65,
    51,
    44,
    43,
    42,
    43,
    20,
    30,
    44,
    55,
    78,
    72,
    87,
    78,
    61,
    46,
    54,
    37,
    30,
    20,
    16,
    53,
    25,
    41,
    37,
    44,
    59,
    54,
    81,
    66,
    76,
    57,
    54,
    37,
    18,
    39,
    11,
    35,
    33,
    31,
    57,
    42,
    82,
    72,
    80,
    47,
    58,
    55,
    21,
    22,
    26,
    38,
    22,
    53,
    25,
    23,
    38,
    70,
    60,
    51,
    36,
    55,
    26,
    34,
    23,
    27,
    14,
    9,
    7,
    34,
    32,
    28,
    39,
    49,
    75,
    30,
    52,
    48,
    40,
    52,
    28,
    18,
    17,
    9,
    5,
    45,
    21,
    34,
    64,
    56,
    50,
    49,
    45,
    31,
    19,
    12,
    15,
    10,
    7,
    6,
    3,
    48,
    23,
    20,
    39,
    36,
    35,
    53,
    21,
    16,
    23,
    13,
    10,
    6,
    1,
    4,
    2,
    16,
    15,
    17,
    27,
    25,
    20,
    29,
    11,
    17,
    12,
    16,
    8,
    1,
    1,
    0,
    1
  ];
  Tables$1.t15HB = [
    7,
    12,
    18,
    53,
    47,
    76,
    124,
    108,
    89,
    123,
    108,
    119,
    107,
    81,
    122,
    63,
    13,
    5,
    16,
    27,
    46,
    36,
    61,
    51,
    42,
    70,
    52,
    83,
    65,
    41,
    59,
    36,
    19,
    17,
    15,
    24,
    41,
    34,
    59,
    48,
    40,
    64,
    50,
    78,
    62,
    80,
    56,
    33,
    29,
    28,
    25,
    43,
    39,
    63,
    55,
    93,
    76,
    59,
    93,
    72,
    54,
    75,
    50,
    29,
    52,
    22,
    42,
    40,
    67,
    57,
    95,
    79,
    72,
    57,
    89,
    69,
    49,
    66,
    46,
    27,
    77,
    37,
    35,
    66,
    58,
    52,
    91,
    74,
    62,
    48,
    79,
    63,
    90,
    62,
    40,
    38,
    125,
    32,
    60,
    56,
    50,
    92,
    78,
    65,
    55,
    87,
    71,
    51,
    73,
    51,
    70,
    30,
    109,
    53,
    49,
    94,
    88,
    75,
    66,
    122,
    91,
    73,
    56,
    42,
    64,
    44,
    21,
    25,
    90,
    43,
    41,
    77,
    73,
    63,
    56,
    92,
    77,
    66,
    47,
    67,
    48,
    53,
    36,
    20,
    71,
    34,
    67,
    60,
    58,
    49,
    88,
    76,
    67,
    106,
    71,
    54,
    38,
    39,
    23,
    15,
    109,
    53,
    51,
    47,
    90,
    82,
    58,
    57,
    48,
    72,
    57,
    41,
    23,
    27,
    62,
    9,
    86,
    42,
    40,
    37,
    70,
    64,
    52,
    43,
    70,
    55,
    42,
    25,
    29,
    18,
    11,
    11,
    118,
    68,
    30,
    55,
    50,
    46,
    74,
    65,
    49,
    39,
    24,
    16,
    22,
    13,
    14,
    7,
    91,
    44,
    39,
    38,
    34,
    63,
    52,
    45,
    31,
    52,
    28,
    19,
    14,
    8,
    9,
    3,
    123,
    60,
    58,
    53,
    47,
    43,
    32,
    22,
    37,
    24,
    17,
    12,
    15,
    10,
    2,
    1,
    71,
    37,
    34,
    30,
    28,
    20,
    17,
    26,
    21,
    16,
    10,
    6,
    8,
    6,
    2,
    0
  ];
  Tables$1.t16HB = [
    1,
    5,
    14,
    44,
    74,
    63,
    110,
    93,
    172,
    149,
    138,
    242,
    225,
    195,
    376,
    17,
    3,
    4,
    12,
    20,
    35,
    62,
    53,
    47,
    83,
    75,
    68,
    119,
    201,
    107,
    207,
    9,
    15,
    13,
    23,
    38,
    67,
    58,
    103,
    90,
    161,
    72,
    127,
    117,
    110,
    209,
    206,
    16,
    45,
    21,
    39,
    69,
    64,
    114,
    99,
    87,
    158,
    140,
    252,
    212,
    199,
    387,
    365,
    26,
    75,
    36,
    68,
    65,
    115,
    101,
    179,
    164,
    155,
    264,
    246,
    226,
    395,
    382,
    362,
    9,
    66,
    30,
    59,
    56,
    102,
    185,
    173,
    265,
    142,
    253,
    232,
    400,
    388,
    378,
    445,
    16,
    111,
    54,
    52,
    100,
    184,
    178,
    160,
    133,
    257,
    244,
    228,
    217,
    385,
    366,
    715,
    10,
    98,
    48,
    91,
    88,
    165,
    157,
    148,
    261,
    248,
    407,
    397,
    372,
    380,
    889,
    884,
    8,
    85,
    84,
    81,
    159,
    156,
    143,
    260,
    249,
    427,
    401,
    392,
    383,
    727,
    713,
    708,
    7,
    154,
    76,
    73,
    141,
    131,
    256,
    245,
    426,
    406,
    394,
    384,
    735,
    359,
    710,
    352,
    11,
    139,
    129,
    67,
    125,
    247,
    233,
    229,
    219,
    393,
    743,
    737,
    720,
    885,
    882,
    439,
    4,
    243,
    120,
    118,
    115,
    227,
    223,
    396,
    746,
    742,
    736,
    721,
    712,
    706,
    223,
    436,
    6,
    202,
    224,
    222,
    218,
    216,
    389,
    386,
    381,
    364,
    888,
    443,
    707,
    440,
    437,
    1728,
    4,
    747,
    211,
    210,
    208,
    370,
    379,
    734,
    723,
    714,
    1735,
    883,
    877,
    876,
    3459,
    865,
    2,
    377,
    369,
    102,
    187,
    726,
    722,
    358,
    711,
    709,
    866,
    1734,
    871,
    3458,
    870,
    434,
    0,
    12,
    10,
    7,
    11,
    10,
    17,
    11,
    9,
    13,
    12,
    10,
    7,
    5,
    3,
    1,
    3
  ];
  Tables$1.t24HB = [
    15,
    13,
    46,
    80,
    146,
    262,
    248,
    434,
    426,
    669,
    653,
    649,
    621,
    517,
    1032,
    88,
    14,
    12,
    21,
    38,
    71,
    130,
    122,
    216,
    209,
    198,
    327,
    345,
    319,
    297,
    279,
    42,
    47,
    22,
    41,
    74,
    68,
    128,
    120,
    221,
    207,
    194,
    182,
    340,
    315,
    295,
    541,
    18,
    81,
    39,
    75,
    70,
    134,
    125,
    116,
    220,
    204,
    190,
    178,
    325,
    311,
    293,
    271,
    16,
    147,
    72,
    69,
    135,
    127,
    118,
    112,
    210,
    200,
    188,
    352,
    323,
    306,
    285,
    540,
    14,
    263,
    66,
    129,
    126,
    119,
    114,
    214,
    202,
    192,
    180,
    341,
    317,
    301,
    281,
    262,
    12,
    249,
    123,
    121,
    117,
    113,
    215,
    206,
    195,
    185,
    347,
    330,
    308,
    291,
    272,
    520,
    10,
    435,
    115,
    111,
    109,
    211,
    203,
    196,
    187,
    353,
    332,
    313,
    298,
    283,
    531,
    381,
    17,
    427,
    212,
    208,
    205,
    201,
    193,
    186,
    177,
    169,
    320,
    303,
    286,
    268,
    514,
    377,
    16,
    335,
    199,
    197,
    191,
    189,
    181,
    174,
    333,
    321,
    305,
    289,
    275,
    521,
    379,
    371,
    11,
    668,
    184,
    183,
    179,
    175,
    344,
    331,
    314,
    304,
    290,
    277,
    530,
    383,
    373,
    366,
    10,
    652,
    346,
    171,
    168,
    164,
    318,
    309,
    299,
    287,
    276,
    263,
    513,
    375,
    368,
    362,
    6,
    648,
    322,
    316,
    312,
    307,
    302,
    292,
    284,
    269,
    261,
    512,
    376,
    370,
    364,
    359,
    4,
    620,
    300,
    296,
    294,
    288,
    282,
    273,
    266,
    515,
    380,
    374,
    369,
    365,
    361,
    357,
    2,
    1033,
    280,
    278,
    274,
    267,
    264,
    259,
    382,
    378,
    372,
    367,
    363,
    360,
    358,
    356,
    0,
    43,
    20,
    19,
    17,
    15,
    13,
    11,
    9,
    7,
    6,
    4,
    7,
    5,
    3,
    1,
    3
  ];
  Tables$1.t32HB = [
    1 << 0,
    5 << 1,
    4 << 1,
    5 << 2,
    6 << 1,
    5 << 2,
    4 << 2,
    4 << 3,
    7 << 1,
    3 << 2,
    6 << 2,
    0 << 3,
    7 << 2,
    2 << 3,
    3 << 3,
    1 << 4
  ];
  Tables$1.t33HB = [
    15 << 0,
    14 << 1,
    13 << 1,
    12 << 2,
    11 << 1,
    10 << 2,
    9 << 2,
    8 << 3,
    7 << 1,
    6 << 2,
    5 << 2,
    4 << 3,
    3 << 2,
    2 << 3,
    1 << 3,
    0 << 4
  ];
  Tables$1.t1l = [
    1,
    4,
    3,
    5
  ];
  Tables$1.t2l = [
    1,
    4,
    7,
    4,
    5,
    7,
    6,
    7,
    8
  ];
  Tables$1.t3l = [
    2,
    3,
    7,
    4,
    4,
    7,
    6,
    7,
    8
  ];
  Tables$1.t5l = [
    1,
    4,
    7,
    8,
    4,
    5,
    8,
    9,
    7,
    8,
    9,
    10,
    8,
    8,
    9,
    10
  ];
  Tables$1.t6l = [
    3,
    4,
    6,
    8,
    4,
    4,
    6,
    7,
    5,
    6,
    7,
    8,
    7,
    7,
    8,
    9
  ];
  Tables$1.t7l = [
    1,
    4,
    7,
    9,
    9,
    10,
    4,
    6,
    8,
    9,
    9,
    10,
    7,
    7,
    9,
    10,
    10,
    11,
    8,
    9,
    10,
    11,
    11,
    11,
    8,
    9,
    10,
    11,
    11,
    12,
    9,
    10,
    11,
    12,
    12,
    12
  ];
  Tables$1.t8l = [
    2,
    4,
    7,
    9,
    9,
    10,
    4,
    4,
    6,
    10,
    10,
    10,
    7,
    6,
    8,
    10,
    10,
    11,
    9,
    10,
    10,
    11,
    11,
    12,
    9,
    9,
    10,
    11,
    12,
    12,
    10,
    10,
    11,
    11,
    13,
    13
  ];
  Tables$1.t9l = [
    3,
    4,
    6,
    7,
    9,
    10,
    4,
    5,
    6,
    7,
    8,
    10,
    5,
    6,
    7,
    8,
    9,
    10,
    7,
    7,
    8,
    9,
    9,
    10,
    8,
    8,
    9,
    9,
    10,
    11,
    9,
    9,
    10,
    10,
    11,
    11
  ];
  Tables$1.t10l = [
    1,
    4,
    7,
    9,
    10,
    10,
    10,
    11,
    4,
    6,
    8,
    9,
    10,
    11,
    10,
    10,
    7,
    8,
    9,
    10,
    11,
    12,
    11,
    11,
    8,
    9,
    10,
    11,
    12,
    12,
    11,
    12,
    9,
    10,
    11,
    12,
    12,
    12,
    12,
    12,
    10,
    11,
    12,
    12,
    13,
    13,
    12,
    13,
    9,
    10,
    11,
    12,
    12,
    12,
    13,
    13,
    10,
    10,
    11,
    12,
    12,
    13,
    13,
    13
  ];
  Tables$1.t11l = [
    2,
    4,
    6,
    8,
    9,
    10,
    9,
    10,
    4,
    5,
    6,
    8,
    10,
    10,
    9,
    10,
    6,
    7,
    8,
    9,
    10,
    11,
    10,
    10,
    8,
    8,
    9,
    11,
    10,
    12,
    10,
    11,
    9,
    10,
    10,
    11,
    11,
    12,
    11,
    12,
    9,
    10,
    11,
    12,
    12,
    13,
    12,
    13,
    9,
    9,
    9,
    10,
    11,
    12,
    12,
    12,
    9,
    9,
    10,
    11,
    12,
    12,
    12,
    12
  ];
  Tables$1.t12l = [
    4,
    4,
    6,
    8,
    9,
    10,
    10,
    10,
    4,
    5,
    6,
    7,
    9,
    9,
    10,
    10,
    6,
    6,
    7,
    8,
    9,
    10,
    9,
    10,
    7,
    7,
    8,
    8,
    9,
    10,
    10,
    10,
    8,
    8,
    9,
    9,
    10,
    10,
    10,
    11,
    9,
    9,
    10,
    10,
    10,
    11,
    10,
    11,
    9,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12
  ];
  Tables$1.t13l = [
    1,
    5,
    7,
    8,
    9,
    10,
    10,
    11,
    10,
    11,
    12,
    12,
    13,
    13,
    14,
    14,
    4,
    6,
    8,
    9,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    13,
    14,
    14,
    14,
    7,
    8,
    9,
    10,
    11,
    11,
    12,
    12,
    11,
    12,
    12,
    13,
    13,
    14,
    15,
    15,
    8,
    9,
    10,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    15,
    15,
    9,
    9,
    11,
    11,
    12,
    12,
    13,
    13,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    16,
    10,
    10,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    13,
    15,
    15,
    16,
    16,
    10,
    11,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    16,
    16,
    11,
    11,
    12,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    16,
    18,
    18,
    10,
    10,
    11,
    12,
    12,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    16,
    17,
    17,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    15,
    14,
    15,
    15,
    16,
    16,
    16,
    18,
    17,
    11,
    12,
    12,
    13,
    13,
    14,
    14,
    15,
    14,
    15,
    16,
    15,
    16,
    17,
    18,
    19,
    12,
    12,
    12,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    16,
    17,
    17,
    17,
    18,
    12,
    13,
    13,
    14,
    14,
    15,
    14,
    15,
    16,
    16,
    17,
    17,
    17,
    18,
    18,
    18,
    13,
    13,
    14,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    16,
    17,
    18,
    17,
    18,
    18,
    14,
    14,
    14,
    15,
    15,
    15,
    17,
    16,
    16,
    19,
    17,
    17,
    17,
    19,
    18,
    18,
    13,
    14,
    15,
    16,
    16,
    16,
    17,
    16,
    17,
    17,
    18,
    18,
    21,
    20,
    21,
    18
  ];
  Tables$1.t15l = [
    3,
    5,
    6,
    8,
    8,
    9,
    10,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    14,
    5,
    5,
    7,
    8,
    9,
    9,
    10,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    6,
    7,
    7,
    8,
    9,
    9,
    10,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    9,
    9,
    9,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    10,
    9,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    14,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    14,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    15,
    14,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    12,
    12,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    15,
    15,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    14,
    15,
    15,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    14,
    15,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15
  ];
  Tables$1.t16_5l = [
    1,
    5,
    7,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    14,
    11,
    4,
    6,
    8,
    9,
    10,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    14,
    13,
    14,
    11,
    7,
    8,
    9,
    10,
    11,
    11,
    12,
    12,
    13,
    12,
    13,
    13,
    13,
    14,
    14,
    12,
    9,
    9,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    13,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    15,
    12,
    10,
    10,
    11,
    11,
    12,
    13,
    13,
    14,
    13,
    14,
    14,
    15,
    15,
    15,
    16,
    13,
    11,
    11,
    11,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    16,
    13,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    17,
    17,
    13,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    13,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    15,
    16,
    15,
    14,
    12,
    13,
    12,
    13,
    14,
    14,
    14,
    14,
    15,
    16,
    16,
    16,
    17,
    17,
    16,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    15,
    16,
    16,
    16,
    16,
    16,
    16,
    15,
    16,
    14,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    17,
    16,
    16,
    16,
    16,
    18,
    14,
    15,
    14,
    14,
    14,
    15,
    15,
    16,
    16,
    16,
    18,
    17,
    17,
    17,
    19,
    17,
    14,
    14,
    15,
    13,
    14,
    16,
    16,
    15,
    16,
    16,
    17,
    18,
    17,
    19,
    17,
    16,
    14,
    11,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    12
  ];
  Tables$1.t16l = [
    1,
    5,
    7,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    14,
    10,
    4,
    6,
    8,
    9,
    10,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    14,
    13,
    14,
    10,
    7,
    8,
    9,
    10,
    11,
    11,
    12,
    12,
    13,
    12,
    13,
    13,
    13,
    14,
    14,
    11,
    9,
    9,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    12,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    15,
    11,
    10,
    10,
    11,
    11,
    12,
    13,
    13,
    14,
    13,
    14,
    14,
    15,
    15,
    15,
    16,
    12,
    11,
    11,
    11,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    16,
    12,
    11,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    17,
    17,
    12,
    11,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    12,
    12,
    12,
    12,
    13,
    13,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    15,
    16,
    15,
    13,
    12,
    13,
    12,
    13,
    14,
    14,
    14,
    14,
    15,
    16,
    16,
    16,
    17,
    17,
    16,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    15,
    16,
    16,
    16,
    16,
    16,
    16,
    15,
    16,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    17,
    16,
    16,
    16,
    16,
    18,
    13,
    15,
    14,
    14,
    14,
    15,
    15,
    16,
    16,
    16,
    18,
    17,
    17,
    17,
    19,
    17,
    13,
    14,
    15,
    13,
    14,
    16,
    16,
    15,
    16,
    16,
    17,
    18,
    17,
    19,
    17,
    16,
    13,
    10,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    10
  ];
  Tables$1.t24l = [
    4,
    5,
    7,
    8,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    10,
    5,
    6,
    7,
    8,
    9,
    10,
    10,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    10,
    7,
    7,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    13,
    9,
    8,
    8,
    9,
    9,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    9,
    10,
    9,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    9,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    9,
    11,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    10,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    10,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    10,
    12,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    10,
    12,
    12,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    10,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    10,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    10,
    13,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    10,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    6
  ];
  Tables$1.t32l = [
    1 + 0,
    4 + 1,
    4 + 1,
    5 + 2,
    4 + 1,
    6 + 2,
    5 + 2,
    6 + 3,
    4 + 1,
    5 + 2,
    5 + 2,
    6 + 3,
    5 + 2,
    6 + 3,
    6 + 3,
    6 + 4
  ];
  Tables$1.t33l = [
    4 + 0,
    4 + 1,
    4 + 1,
    4 + 2,
    4 + 1,
    4 + 2,
    4 + 2,
    4 + 3,
    4 + 1,
    4 + 2,
    4 + 2,
    4 + 3,
    4 + 2,
    4 + 3,
    4 + 3,
    4 + 4
  ];
  Tables$1.ht = [
    /* xlen, linmax, table, hlen */
    new HuffCodeTab(0, 0, null, null),
    new HuffCodeTab(2, 0, Tables$1.t1HB, Tables$1.t1l),
    new HuffCodeTab(3, 0, Tables$1.t2HB, Tables$1.t2l),
    new HuffCodeTab(3, 0, Tables$1.t3HB, Tables$1.t3l),
    new HuffCodeTab(0, 0, null, null),
    /* Apparently not used */
    new HuffCodeTab(4, 0, Tables$1.t5HB, Tables$1.t5l),
    new HuffCodeTab(4, 0, Tables$1.t6HB, Tables$1.t6l),
    new HuffCodeTab(6, 0, Tables$1.t7HB, Tables$1.t7l),
    new HuffCodeTab(6, 0, Tables$1.t8HB, Tables$1.t8l),
    new HuffCodeTab(6, 0, Tables$1.t9HB, Tables$1.t9l),
    new HuffCodeTab(8, 0, Tables$1.t10HB, Tables$1.t10l),
    new HuffCodeTab(8, 0, Tables$1.t11HB, Tables$1.t11l),
    new HuffCodeTab(8, 0, Tables$1.t12HB, Tables$1.t12l),
    new HuffCodeTab(16, 0, Tables$1.t13HB, Tables$1.t13l),
    new HuffCodeTab(0, 0, null, Tables$1.t16_5l),
    /* Apparently not used */
    new HuffCodeTab(16, 0, Tables$1.t15HB, Tables$1.t15l),
    new HuffCodeTab(1, 1, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(2, 3, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(3, 7, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(4, 15, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(6, 63, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(8, 255, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(10, 1023, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(13, 8191, Tables$1.t16HB, Tables$1.t16l),
    new HuffCodeTab(4, 15, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(5, 31, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(6, 63, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(7, 127, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(8, 255, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(9, 511, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(11, 2047, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(13, 8191, Tables$1.t24HB, Tables$1.t24l),
    new HuffCodeTab(0, 0, Tables$1.t32HB, Tables$1.t32l),
    new HuffCodeTab(0, 0, Tables$1.t33HB, Tables$1.t33l)
  ];
  Tables$1.largetbl = [
    65540,
    327685,
    458759,
    589832,
    655369,
    655370,
    720906,
    720907,
    786443,
    786444,
    786444,
    851980,
    851980,
    851980,
    917517,
    655370,
    262149,
    393222,
    524295,
    589832,
    655369,
    720906,
    720906,
    720907,
    786443,
    786443,
    786444,
    851980,
    917516,
    851980,
    917516,
    655370,
    458759,
    524295,
    589832,
    655369,
    720905,
    720906,
    786442,
    786443,
    851979,
    786443,
    851979,
    851980,
    851980,
    917516,
    917517,
    720905,
    589832,
    589832,
    655369,
    720905,
    720906,
    786442,
    786442,
    786443,
    851979,
    851979,
    917515,
    917516,
    917516,
    983052,
    983052,
    786441,
    655369,
    655369,
    720905,
    720906,
    786442,
    786442,
    851978,
    851979,
    851979,
    917515,
    917516,
    917516,
    983052,
    983052,
    983053,
    720905,
    655370,
    655369,
    720906,
    720906,
    786442,
    851978,
    851979,
    917515,
    851979,
    917515,
    917516,
    983052,
    983052,
    983052,
    1048588,
    786441,
    720906,
    720906,
    720906,
    786442,
    851978,
    851979,
    851979,
    851979,
    917515,
    917516,
    917516,
    917516,
    983052,
    983052,
    1048589,
    786441,
    720907,
    720906,
    786442,
    786442,
    851979,
    851979,
    851979,
    917515,
    917516,
    983052,
    983052,
    983052,
    983052,
    1114125,
    1114125,
    786442,
    720907,
    786443,
    786443,
    851979,
    851979,
    851979,
    917515,
    917515,
    983051,
    983052,
    983052,
    983052,
    1048588,
    1048589,
    1048589,
    786442,
    786443,
    786443,
    786443,
    851979,
    851979,
    917515,
    917515,
    983052,
    983052,
    983052,
    983052,
    1048588,
    983053,
    1048589,
    983053,
    851978,
    786444,
    851979,
    786443,
    851979,
    917515,
    917516,
    917516,
    917516,
    983052,
    1048588,
    1048588,
    1048589,
    1114125,
    1114125,
    1048589,
    786442,
    851980,
    851980,
    851979,
    851979,
    917515,
    917516,
    983052,
    1048588,
    1048588,
    1048588,
    1048588,
    1048589,
    1048589,
    983053,
    1048589,
    851978,
    851980,
    917516,
    917516,
    917516,
    917516,
    983052,
    983052,
    983052,
    983052,
    1114124,
    1048589,
    1048589,
    1048589,
    1048589,
    1179661,
    851978,
    983052,
    917516,
    917516,
    917516,
    983052,
    983052,
    1048588,
    1048588,
    1048589,
    1179661,
    1114125,
    1114125,
    1114125,
    1245197,
    1114125,
    851978,
    917517,
    983052,
    851980,
    917516,
    1048588,
    1048588,
    983052,
    1048589,
    1048589,
    1114125,
    1179661,
    1114125,
    1245197,
    1114125,
    1048589,
    851978,
    655369,
    655369,
    655369,
    720905,
    720905,
    786441,
    786441,
    786441,
    851977,
    851977,
    851977,
    851978,
    851978,
    851978,
    851978,
    655366
  ];
  Tables$1.table23 = [
    65538,
    262147,
    458759,
    262148,
    327684,
    458759,
    393222,
    458759,
    524296
  ];
  Tables$1.table56 = [
    65539,
    262148,
    458758,
    524296,
    262148,
    327684,
    524294,
    589831,
    458757,
    524294,
    589831,
    655368,
    524295,
    524295,
    589832,
    655369
  ];
  Tables$1.bitrate_table = [
    [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1],
    /* MPEG 2 */
    [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1],
    /* MPEG 1 */
    [0, 8, 16, 24, 32, 40, 48, 56, 64, -1, -1, -1, -1, -1, -1, -1]
    /* MPEG 2.5 */
  ];
  Tables$1.samplerate_table = [
    [22050, 24e3, 16e3, -1],
    [44100, 48e3, 32e3, -1],
    [11025, 12e3, 8e3, -1]
  ];
  Tables$1.scfsi_band = [0, 6, 11, 16, 21];
  var Tables_1 = Tables$1;
  var QuantizePVT_1;
  var hasRequiredQuantizePVT;
  function requireQuantizePVT() {
    if (hasRequiredQuantizePVT) return QuantizePVT_1;
    hasRequiredQuantizePVT = 1;
    var ScaleFac2 = ScaleFac_1;
    var common2 = common$h;
    var VbrMode2 = common2.VbrMode;
    var Float2 = common2.Float;
    var Util2 = common2.Util;
    var new_float2 = common2.new_float;
    var new_int2 = common2.new_int;
    var assert2 = common2.assert;
    var Encoder2 = requireEncoder();
    var MeanBits2 = MeanBits_1;
    var LameInternalFlags2 = LameInternalFlags_1;
    QuantizePVT.Q_MAX = 256 + 1;
    QuantizePVT.Q_MAX2 = 116;
    QuantizePVT.LARGE_BITS = 1e5;
    QuantizePVT.IXMAX_VAL = 8206;
    function QuantizePVT() {
      var BitStream = requireBitStream();
      var tak = null;
      var rv = null;
      var psy = null;
      this.setModules = function(_tk, _rv, _psy) {
        tak = _tk;
        rv = _rv;
        psy = _psy;
      };
      function POW20(x) {
        assert2(0 <= x + QuantizePVT.Q_MAX2 && x < QuantizePVT.Q_MAX);
        return pow20[x + QuantizePVT.Q_MAX2];
      }
      this.IPOW20 = function(x) {
        assert2(0 <= x && x < QuantizePVT.Q_MAX);
        return ipow20[x];
      };
      var DBL_EPSILON = 2220446049250313e-31;
      var IXMAX_VAL = QuantizePVT.IXMAX_VAL;
      var PRECALC_SIZE = IXMAX_VAL + 2;
      var Q_MAX = QuantizePVT.Q_MAX;
      var Q_MAX2 = QuantizePVT.Q_MAX2;
      QuantizePVT.LARGE_BITS;
      var NSATHSCALE = 100;
      this.nr_of_sfb_block = [
        [[6, 5, 5, 5], [9, 9, 9, 9], [6, 9, 9, 9]],
        [[6, 5, 7, 3], [9, 9, 12, 6], [6, 9, 12, 6]],
        [[11, 10, 0, 0], [18, 18, 0, 0], [15, 18, 0, 0]],
        [[7, 7, 7, 0], [12, 12, 12, 0], [6, 15, 12, 0]],
        [[6, 6, 6, 3], [12, 9, 9, 6], [6, 12, 9, 6]],
        [[8, 8, 5, 0], [15, 12, 9, 0], [6, 18, 9, 0]]
      ];
      var pretab = [
        0,
        0,
        0,
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
        3,
        3,
        3,
        2,
        0
      ];
      this.pretab = pretab;
      this.sfBandIndex = [
        // Table B.2.b: 22.05 kHz
        new ScaleFac2(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          //  sfb12 pseudo sub bands
        ),
        /* Table B.2.c: 24 kHz */
        /* docs: 332. mpg123(broken): 330 */
        new ScaleFac2(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            114,
            136,
            162,
            194,
            232,
            278,
            332,
            394,
            464,
            540,
            576
          ],
          [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.2.a: 16 kHz */
        new ScaleFac2(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.b: 44.1 kHz */
        new ScaleFac2(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            44,
            52,
            62,
            74,
            90,
            110,
            134,
            162,
            196,
            238,
            288,
            342,
            418,
            576
          ],
          [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.c: 48 kHz */
        new ScaleFac2(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            42,
            50,
            60,
            72,
            88,
            106,
            128,
            156,
            190,
            230,
            276,
            330,
            384,
            576
          ],
          [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* Table B.8.a: 32 kHz */
        new ScaleFac2(
          [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            30,
            36,
            44,
            54,
            66,
            82,
            102,
            126,
            156,
            194,
            240,
            296,
            364,
            448,
            550,
            576
          ],
          [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 11.025 kHz */
        new ScaleFac2(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [
            0 / 3,
            12 / 3,
            24 / 3,
            36 / 3,
            54 / 3,
            78 / 3,
            108 / 3,
            144 / 3,
            186 / 3,
            240 / 3,
            312 / 3,
            402 / 3,
            522 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 12 kHz */
        new ScaleFac2(
          [
            0,
            6,
            12,
            18,
            24,
            30,
            36,
            44,
            54,
            66,
            80,
            96,
            116,
            140,
            168,
            200,
            238,
            284,
            336,
            396,
            464,
            522,
            576
          ],
          [
            0 / 3,
            12 / 3,
            24 / 3,
            36 / 3,
            54 / 3,
            78 / 3,
            108 / 3,
            144 / 3,
            186 / 3,
            240 / 3,
            312 / 3,
            402 / 3,
            522 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        ),
        /* MPEG-2.5 8 kHz */
        new ScaleFac2(
          [
            0,
            12,
            24,
            36,
            48,
            60,
            72,
            88,
            108,
            132,
            160,
            192,
            232,
            280,
            336,
            400,
            476,
            566,
            568,
            570,
            572,
            574,
            576
          ],
          [
            0 / 3,
            24 / 3,
            48 / 3,
            72 / 3,
            108 / 3,
            156 / 3,
            216 / 3,
            288 / 3,
            372 / 3,
            480 / 3,
            486 / 3,
            492 / 3,
            498 / 3,
            576 / 3
          ],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0]
          /*  sfb12 pseudo sub bands */
        )
      ];
      var pow20 = new_float2(Q_MAX + Q_MAX2 + 1);
      var ipow20 = new_float2(Q_MAX);
      var pow43 = new_float2(PRECALC_SIZE);
      var adj43 = new_float2(PRECALC_SIZE);
      this.adj43 = adj43;
      function ATHmdct(gfp, f2) {
        var ath = psy.ATHformula(f2, gfp);
        ath -= NSATHSCALE;
        ath = Math.pow(10, ath / 10 + gfp.ATHlower);
        return ath;
      }
      function compute_ath(gfp) {
        var ATH_l = gfp.internal_flags.ATH.l;
        var ATH_psfb21 = gfp.internal_flags.ATH.psfb21;
        var ATH_s = gfp.internal_flags.ATH.s;
        var ATH_psfb12 = gfp.internal_flags.ATH.psfb12;
        var gfc = gfp.internal_flags;
        var samp_freq = gfp.out_samplerate;
        for (var sfb = 0; sfb < Encoder2.SBMAX_l; sfb++) {
          var start = gfc.scalefac_band.l[sfb];
          var end = gfc.scalefac_band.l[sfb + 1];
          ATH_l[sfb] = Float2.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 576);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_l[sfb] = Math.min(ATH_l[sfb], ATH_f);
          }
        }
        for (var sfb = 0; sfb < Encoder2.PSFB21; sfb++) {
          var start = gfc.scalefac_band.psfb21[sfb];
          var end = gfc.scalefac_band.psfb21[sfb + 1];
          ATH_psfb21[sfb] = Float2.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 576);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_psfb21[sfb] = Math.min(ATH_psfb21[sfb], ATH_f);
          }
        }
        for (var sfb = 0; sfb < Encoder2.SBMAX_s; sfb++) {
          var start = gfc.scalefac_band.s[sfb];
          var end = gfc.scalefac_band.s[sfb + 1];
          ATH_s[sfb] = Float2.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 192);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_s[sfb] = Math.min(ATH_s[sfb], ATH_f);
          }
          ATH_s[sfb] *= gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
        }
        for (var sfb = 0; sfb < Encoder2.PSFB12; sfb++) {
          var start = gfc.scalefac_band.psfb12[sfb];
          var end = gfc.scalefac_band.psfb12[sfb + 1];
          ATH_psfb12[sfb] = Float2.MAX_VALUE;
          for (var i = start; i < end; i++) {
            var freq = i * samp_freq / (2 * 192);
            var ATH_f = ATHmdct(gfp, freq);
            ATH_psfb12[sfb] = Math.min(ATH_psfb12[sfb], ATH_f);
          }
          ATH_psfb12[sfb] *= gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12];
        }
        if (gfp.noATH) {
          for (var sfb = 0; sfb < Encoder2.SBMAX_l; sfb++) {
            ATH_l[sfb] = 1e-20;
          }
          for (var sfb = 0; sfb < Encoder2.PSFB21; sfb++) {
            ATH_psfb21[sfb] = 1e-20;
          }
          for (var sfb = 0; sfb < Encoder2.SBMAX_s; sfb++) {
            ATH_s[sfb] = 1e-20;
          }
          for (var sfb = 0; sfb < Encoder2.PSFB12; sfb++) {
            ATH_psfb12[sfb] = 1e-20;
          }
        }
        gfc.ATH.floor = 10 * Math.log10(ATHmdct(gfp, -1));
      }
      this.iteration_init = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side = gfc.l3_side;
        var i;
        if (gfc.iteration_init_init == 0) {
          gfc.iteration_init_init = 1;
          l3_side.main_data_begin = 0;
          compute_ath(gfp);
          pow43[0] = 0;
          for (i = 1; i < PRECALC_SIZE; i++)
            pow43[i] = Math.pow(i, 4 / 3);
          for (i = 0; i < PRECALC_SIZE - 1; i++)
            adj43[i] = i + 1 - Math.pow(
              0.5 * (pow43[i] + pow43[i + 1]),
              0.75
            );
          adj43[i] = 0.5;
          for (i = 0; i < Q_MAX; i++)
            ipow20[i] = Math.pow(2, (i - 210) * -0.1875);
          for (i = 0; i <= Q_MAX + Q_MAX2; i++)
            pow20[i] = Math.pow(2, (i - 210 - Q_MAX2) * 0.25);
          tak.huffman_init(gfc);
          {
            var bass, alto, treble, sfb21;
            i = gfp.exp_nspsytune >> 2 & 63;
            if (i >= 32)
              i -= 64;
            bass = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 8 & 63;
            if (i >= 32)
              i -= 64;
            alto = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 14 & 63;
            if (i >= 32)
              i -= 64;
            treble = Math.pow(10, i / 4 / 10);
            i = gfp.exp_nspsytune >> 20 & 63;
            if (i >= 32)
              i -= 64;
            sfb21 = treble * Math.pow(10, i / 4 / 10);
            for (i = 0; i < Encoder2.SBMAX_l; i++) {
              var f2;
              if (i <= 6)
                f2 = bass;
              else if (i <= 13)
                f2 = alto;
              else if (i <= 20)
                f2 = treble;
              else
                f2 = sfb21;
              gfc.nsPsy.longfact[i] = f2;
            }
            for (i = 0; i < Encoder2.SBMAX_s; i++) {
              var f2;
              if (i <= 5)
                f2 = bass;
              else if (i <= 10)
                f2 = alto;
              else if (i <= 11)
                f2 = treble;
              else
                f2 = sfb21;
              gfc.nsPsy.shortfact[i] = f2;
            }
          }
        }
      };
      this.on_pe = function(gfp, pe, targ_bits, mean_bits, gr, cbr) {
        var gfc = gfp.internal_flags;
        var tbits = 0, bits;
        var add_bits = new_int2(2);
        var ch;
        var mb = new MeanBits2(tbits);
        var extra_bits = rv.ResvMaxBits(gfp, mean_bits, mb, cbr);
        tbits = mb.bits;
        var max_bits = tbits + extra_bits;
        if (max_bits > LameInternalFlags2.MAX_BITS_PER_GRANULE) {
          max_bits = LameInternalFlags2.MAX_BITS_PER_GRANULE;
        }
        for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
          targ_bits[ch] = Math.min(
            LameInternalFlags2.MAX_BITS_PER_CHANNEL,
            tbits / gfc.channels_out
          );
          add_bits[ch] = 0 | targ_bits[ch] * pe[gr][ch] / 700 - targ_bits[ch];
          if (add_bits[ch] > mean_bits * 3 / 4)
            add_bits[ch] = mean_bits * 3 / 4;
          if (add_bits[ch] < 0)
            add_bits[ch] = 0;
          if (add_bits[ch] + targ_bits[ch] > LameInternalFlags2.MAX_BITS_PER_CHANNEL)
            add_bits[ch] = Math.max(
              0,
              LameInternalFlags2.MAX_BITS_PER_CHANNEL - targ_bits[ch]
            );
          bits += add_bits[ch];
        }
        if (bits > extra_bits) {
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            add_bits[ch] = extra_bits * add_bits[ch] / bits;
          }
        }
        for (ch = 0; ch < gfc.channels_out; ++ch) {
          targ_bits[ch] += add_bits[ch];
          extra_bits -= add_bits[ch];
        }
        for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
          bits += targ_bits[ch];
        }
        if (bits > LameInternalFlags2.MAX_BITS_PER_GRANULE) {
          var sum = 0;
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            targ_bits[ch] *= LameInternalFlags2.MAX_BITS_PER_GRANULE;
            targ_bits[ch] /= bits;
            sum += targ_bits[ch];
          }
        }
        return max_bits;
      };
      this.reduce_side = function(targ_bits, ms_ener_ratio, mean_bits, max_bits) {
        assert2(targ_bits[0] + targ_bits[1] <= LameInternalFlags2.MAX_BITS_PER_GRANULE);
        var fac = 0.33 * (0.5 - ms_ener_ratio) / 0.5;
        if (fac < 0)
          fac = 0;
        if (fac > 0.5)
          fac = 0.5;
        var move_bits = 0 | fac * 0.5 * (targ_bits[0] + targ_bits[1]);
        if (move_bits > LameInternalFlags2.MAX_BITS_PER_CHANNEL - targ_bits[0]) {
          move_bits = LameInternalFlags2.MAX_BITS_PER_CHANNEL - targ_bits[0];
        }
        if (move_bits < 0)
          move_bits = 0;
        if (targ_bits[1] >= 125) {
          if (targ_bits[1] - move_bits > 125) {
            if (targ_bits[0] < mean_bits)
              targ_bits[0] += move_bits;
            targ_bits[1] -= move_bits;
          } else {
            targ_bits[0] += targ_bits[1] - 125;
            targ_bits[1] = 125;
          }
        }
        move_bits = targ_bits[0] + targ_bits[1];
        if (move_bits > max_bits) {
          targ_bits[0] = max_bits * targ_bits[0] / move_bits;
          targ_bits[1] = max_bits * targ_bits[1] / move_bits;
        }
        assert2(targ_bits[0] <= LameInternalFlags2.MAX_BITS_PER_CHANNEL);
        assert2(targ_bits[1] <= LameInternalFlags2.MAX_BITS_PER_CHANNEL);
        assert2(targ_bits[0] + targ_bits[1] <= LameInternalFlags2.MAX_BITS_PER_GRANULE);
      };
      this.athAdjust = function(a, x, athFloor) {
        var o = 90.30873362;
        var p2 = 94.82444863;
        var u = Util2.FAST_LOG10_X(x, 10);
        var v = a * a;
        var w = 0;
        u -= athFloor;
        if (v > 1e-20)
          w = 1 + Util2.FAST_LOG10_X(v, 10 / o);
        if (w < 0)
          w = 0;
        u *= w;
        u += athFloor + o - p2;
        return Math.pow(10, 0.1 * u);
      };
      this.calc_xmin = function(gfp, ratio, cod_info, pxmin) {
        var pxminPos = 0;
        var gfc = gfp.internal_flags;
        var gsfb, j = 0, ath_over = 0;
        var ATH2 = gfc.ATH;
        var xr = cod_info.xr;
        var enable_athaa_fix = gfp.VBR == VbrMode2.vbr_mtrh ? 1 : 0;
        var masking_lower = gfc.masking_lower;
        if (gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) {
          masking_lower = 1;
        }
        for (gsfb = 0; gsfb < cod_info.psy_lmax; gsfb++) {
          var en0, xmin;
          var rh1, rh2;
          var width, l2;
          if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh)
            xmin = athAdjust(ATH2.adjust, ATH2.l[gsfb], ATH2.floor);
          else
            xmin = ATH2.adjust * ATH2.l[gsfb];
          width = cod_info.width[gsfb];
          rh1 = xmin / width;
          rh2 = DBL_EPSILON;
          l2 = width >> 1;
          en0 = 0;
          do {
            var xa, xb;
            xa = xr[j] * xr[j];
            en0 += xa;
            rh2 += xa < rh1 ? xa : rh1;
            j++;
            xb = xr[j] * xr[j];
            en0 += xb;
            rh2 += xb < rh1 ? xb : rh1;
            j++;
          } while (--l2 > 0);
          if (en0 > xmin)
            ath_over++;
          if (gsfb == Encoder2.SBPSY_l) {
            var x = xmin * gfc.nsPsy.longfact[gsfb];
            if (rh2 < x) {
              rh2 = x;
            }
          }
          if (enable_athaa_fix != 0) {
            xmin = rh2;
          }
          if (!gfp.ATHonly) {
            var e = ratio.en.l[gsfb];
            if (e > 0) {
              var x;
              x = en0 * ratio.thm.l[gsfb] * masking_lower / e;
              if (enable_athaa_fix != 0)
                x *= gfc.nsPsy.longfact[gsfb];
              if (xmin < x)
                xmin = x;
            }
          }
          if (enable_athaa_fix != 0)
            pxmin[pxminPos++] = xmin;
          else
            pxmin[pxminPos++] = xmin * gfc.nsPsy.longfact[gsfb];
        }
        var max_nonzero = 575;
        if (cod_info.block_type != Encoder2.SHORT_TYPE) {
          var k2 = 576;
          while (k2-- != 0 && BitStream.EQ(xr[k2], 0)) {
            max_nonzero = k2;
          }
        }
        cod_info.max_nonzero_coeff = max_nonzero;
        for (var sfb = cod_info.sfb_smin; gsfb < cod_info.psymax; sfb++, gsfb += 3) {
          var width, b;
          var tmpATH;
          if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh)
            tmpATH = athAdjust(ATH2.adjust, ATH2.s[sfb], ATH2.floor);
          else
            tmpATH = ATH2.adjust * ATH2.s[sfb];
          width = cod_info.width[gsfb];
          for (b = 0; b < 3; b++) {
            var en0 = 0, xmin;
            var rh1, rh2;
            var l2 = width >> 1;
            rh1 = tmpATH / width;
            rh2 = DBL_EPSILON;
            do {
              var xa, xb;
              xa = xr[j] * xr[j];
              en0 += xa;
              rh2 += xa < rh1 ? xa : rh1;
              j++;
              xb = xr[j] * xr[j];
              en0 += xb;
              rh2 += xb < rh1 ? xb : rh1;
              j++;
            } while (--l2 > 0);
            if (en0 > tmpATH)
              ath_over++;
            if (sfb == Encoder2.SBPSY_s) {
              var x = tmpATH * gfc.nsPsy.shortfact[sfb];
              if (rh2 < x) {
                rh2 = x;
              }
            }
            if (enable_athaa_fix != 0)
              xmin = rh2;
            else
              xmin = tmpATH;
            if (!gfp.ATHonly && !gfp.ATHshort) {
              var e = ratio.en.s[sfb][b];
              if (e > 0) {
                var x;
                x = en0 * ratio.thm.s[sfb][b] * masking_lower / e;
                if (enable_athaa_fix != 0)
                  x *= gfc.nsPsy.shortfact[sfb];
                if (xmin < x)
                  xmin = x;
              }
            }
            if (enable_athaa_fix != 0)
              pxmin[pxminPos++] = xmin;
            else
              pxmin[pxminPos++] = xmin * gfc.nsPsy.shortfact[sfb];
          }
          if (gfp.useTemporal) {
            if (pxmin[pxminPos - 3] > pxmin[pxminPos - 3 + 1])
              pxmin[pxminPos - 3 + 1] += (pxmin[pxminPos - 3] - pxmin[pxminPos - 3 + 1]) * gfc.decay;
            if (pxmin[pxminPos - 3 + 1] > pxmin[pxminPos - 3 + 2])
              pxmin[pxminPos - 3 + 2] += (pxmin[pxminPos - 3 + 1] - pxmin[pxminPos - 3 + 2]) * gfc.decay;
          }
        }
        return ath_over;
      };
      function StartLine(j) {
        this.s = j;
      }
      this.calc_noise_core = function(cod_info, startline, l2, step) {
        var noise = 0;
        var j = startline.s;
        var ix = cod_info.l3_enc;
        if (j > cod_info.count1) {
          while (l2-- != 0) {
            var temp;
            temp = cod_info.xr[j];
            j++;
            noise += temp * temp;
            temp = cod_info.xr[j];
            j++;
            noise += temp * temp;
          }
        } else if (j > cod_info.big_values) {
          var ix01 = new_float2(2);
          ix01[0] = 0;
          ix01[1] = step;
          while (l2-- != 0) {
            var temp;
            temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
            j++;
            noise += temp * temp;
            temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
            j++;
            noise += temp * temp;
          }
        } else {
          while (l2-- != 0) {
            var temp;
            temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
            j++;
            noise += temp * temp;
            temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
            j++;
            noise += temp * temp;
          }
        }
        startline.s = j;
        return noise;
      };
      this.calc_noise = function(cod_info, l3_xmin, distort, res, prev_noise) {
        var distortPos = 0;
        var l3_xminPos = 0;
        var sfb, l2, over = 0;
        var over_noise_db = 0;
        var tot_noise_db = 0;
        var max_noise = -20;
        var j = 0;
        var scalefac = cod_info.scalefac;
        var scalefacPos = 0;
        res.over_SSD = 0;
        for (sfb = 0; sfb < cod_info.psymax; sfb++) {
          var s = cod_info.global_gain - (scalefac[scalefacPos++] + (cod_info.preflag != 0 ? pretab[sfb] : 0) << cod_info.scalefac_scale + 1) - cod_info.subblock_gain[cod_info.window[sfb]] * 8;
          var noise = 0;
          if (prev_noise != null && prev_noise.step[sfb] == s) {
            noise = prev_noise.noise[sfb];
            j += cod_info.width[sfb];
            distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
            noise = prev_noise.noise_log[sfb];
          } else {
            var step = POW20(s);
            l2 = cod_info.width[sfb] >> 1;
            if (j + cod_info.width[sfb] > cod_info.max_nonzero_coeff) {
              var usefullsize;
              usefullsize = cod_info.max_nonzero_coeff - j + 1;
              if (usefullsize > 0)
                l2 = usefullsize >> 1;
              else
                l2 = 0;
            }
            var sl = new StartLine(j);
            noise = this.calc_noise_core(cod_info, sl, l2, step);
            j = sl.s;
            if (prev_noise != null) {
              prev_noise.step[sfb] = s;
              prev_noise.noise[sfb] = noise;
            }
            noise = distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
            noise = Util2.FAST_LOG10(Math.max(noise, 1e-20));
            if (prev_noise != null) {
              prev_noise.noise_log[sfb] = noise;
            }
          }
          if (prev_noise != null) {
            prev_noise.global_gain = cod_info.global_gain;
          }
          tot_noise_db += noise;
          if (noise > 0) {
            var tmp;
            tmp = Math.max(0 | noise * 10 + 0.5, 1);
            res.over_SSD += tmp * tmp;
            over++;
            over_noise_db += noise;
          }
          max_noise = Math.max(max_noise, noise);
        }
        res.over_count = over;
        res.tot_noise = tot_noise_db;
        res.over_noise = over_noise_db;
        res.max_noise = max_noise;
        return over;
      };
      this.set_pinfo = function(gfp, cod_info, ratio, gr, ch) {
        var gfc = gfp.internal_flags;
        var sfb, sfb2;
        var l2;
        var en0, en1;
        var ifqstep = cod_info.scalefac_scale == 0 ? 0.5 : 1;
        var scalefac = cod_info.scalefac;
        var l3_xmin = new_float2(L3Side.SFBMAX);
        var xfsf = new_float2(L3Side.SFBMAX);
        var noise = new CalcNoiseResult();
        calc_xmin(gfp, ratio, cod_info, l3_xmin);
        calc_noise(cod_info, l3_xmin, xfsf, noise, null);
        var j = 0;
        sfb2 = cod_info.sfb_lmax;
        if (cod_info.block_type != Encoder2.SHORT_TYPE && 0 == cod_info.mixed_block_flag)
          sfb2 = 22;
        for (sfb = 0; sfb < sfb2; sfb++) {
          var start = gfc.scalefac_band.l[sfb];
          var end = gfc.scalefac_band.l[sfb + 1];
          var bw = end - start;
          for (en0 = 0; j < end; j++)
            en0 += cod_info.xr[j] * cod_info.xr[j];
          en0 /= bw;
          en1 = 1e15;
          gfc.pinfo.en[gr][ch][sfb] = en1 * en0;
          gfc.pinfo.xfsf[gr][ch][sfb] = en1 * l3_xmin[sfb] * xfsf[sfb] / bw;
          if (ratio.en.l[sfb] > 0 && !gfp.ATHonly)
            en0 = en0 / ratio.en.l[sfb];
          else
            en0 = 0;
          gfc.pinfo.thr[gr][ch][sfb] = en1 * Math.max(en0 * ratio.thm.l[sfb], gfc.ATH.l[sfb]);
          gfc.pinfo.LAMEsfb[gr][ch][sfb] = 0;
          if (cod_info.preflag != 0 && sfb >= 11)
            gfc.pinfo.LAMEsfb[gr][ch][sfb] = -ifqstep * pretab[sfb];
          if (sfb < Encoder2.SBPSY_l) {
            assert2(scalefac[sfb] >= 0);
            gfc.pinfo.LAMEsfb[gr][ch][sfb] -= ifqstep * scalefac[sfb];
          }
        }
        if (cod_info.block_type == Encoder2.SHORT_TYPE) {
          sfb2 = sfb;
          for (sfb = cod_info.sfb_smin; sfb < Encoder2.SBMAX_s; sfb++) {
            var start = gfc.scalefac_band.s[sfb];
            var end = gfc.scalefac_band.s[sfb + 1];
            var bw = end - start;
            for (var i = 0; i < 3; i++) {
              for (en0 = 0, l2 = start; l2 < end; l2++) {
                en0 += cod_info.xr[j] * cod_info.xr[j];
                j++;
              }
              en0 = Math.max(en0 / bw, 1e-20);
              en1 = 1e15;
              gfc.pinfo.en_s[gr][ch][3 * sfb + i] = en1 * en0;
              gfc.pinfo.xfsf_s[gr][ch][3 * sfb + i] = en1 * l3_xmin[sfb2] * xfsf[sfb2] / bw;
              if (ratio.en.s[sfb][i] > 0)
                en0 = en0 / ratio.en.s[sfb][i];
              else
                en0 = 0;
              if (gfp.ATHonly || gfp.ATHshort)
                en0 = 0;
              gfc.pinfo.thr_s[gr][ch][3 * sfb + i] = en1 * Math.max(
                en0 * ratio.thm.s[sfb][i],
                gfc.ATH.s[sfb]
              );
              gfc.pinfo.LAMEsfb_s[gr][ch][3 * sfb + i] = -2 * cod_info.subblock_gain[i];
              if (sfb < Encoder2.SBPSY_s) {
                gfc.pinfo.LAMEsfb_s[gr][ch][3 * sfb + i] -= ifqstep * scalefac[sfb2];
              }
              sfb2++;
            }
          }
        }
        gfc.pinfo.LAMEqss[gr][ch] = cod_info.global_gain;
        gfc.pinfo.LAMEmainbits[gr][ch] = cod_info.part2_3_length + cod_info.part2_length;
        gfc.pinfo.LAMEsfbits[gr][ch] = cod_info.part2_length;
        gfc.pinfo.over[gr][ch] = noise.over_count;
        gfc.pinfo.max_noise[gr][ch] = noise.max_noise * 10;
        gfc.pinfo.over_noise[gr][ch] = noise.over_noise * 10;
        gfc.pinfo.tot_noise[gr][ch] = noise.tot_noise * 10;
        gfc.pinfo.over_SSD[gr][ch] = noise.over_SSD;
      };
    }
    QuantizePVT_1 = QuantizePVT;
    return QuantizePVT_1;
  }
  var Takehiro_1;
  var hasRequiredTakehiro;
  function requireTakehiro() {
    if (hasRequiredTakehiro) return Takehiro_1;
    hasRequiredTakehiro = 1;
    var common2 = common$h;
    var System2 = common2.System;
    var Arrays2 = common2.Arrays;
    var new_int2 = common2.new_int;
    var assert2 = common2.assert;
    var Encoder2 = requireEncoder();
    var Tables2 = Tables_1;
    var GrInfo2 = GrInfo_1;
    var QuantizePVT = requireQuantizePVT();
    function Takehiro() {
      var qupvt = null;
      this.qupvt = null;
      this.setModules = function(_qupvt) {
        this.qupvt = _qupvt;
        qupvt = _qupvt;
      };
      function Bits(b) {
        this.bits = 0 | b;
      }
      var subdv_table = [
        [0, 0],
        /* 0 bands */
        [0, 0],
        /* 1 bands */
        [0, 0],
        /* 2 bands */
        [0, 0],
        /* 3 bands */
        [0, 0],
        /* 4 bands */
        [0, 1],
        /* 5 bands */
        [1, 1],
        /* 6 bands */
        [1, 1],
        /* 7 bands */
        [1, 2],
        /* 8 bands */
        [2, 2],
        /* 9 bands */
        [2, 3],
        /* 10 bands */
        [2, 3],
        /* 11 bands */
        [3, 4],
        /* 12 bands */
        [3, 4],
        /* 13 bands */
        [3, 4],
        /* 14 bands */
        [4, 5],
        /* 15 bands */
        [4, 5],
        /* 16 bands */
        [4, 6],
        /* 17 bands */
        [5, 6],
        /* 18 bands */
        [5, 6],
        /* 19 bands */
        [5, 7],
        /* 20 bands */
        [6, 7],
        /* 21 bands */
        [6, 7]
        /* 22 bands */
      ];
      function quantize_lines_xrpow_01(l2, istep, xr, xrPos, ix, ixPos) {
        var compareval0 = (1 - 0.4054) / istep;
        l2 = l2 >> 1;
        while (l2-- != 0) {
          ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
          ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
        }
      }
      function quantize_lines_xrpow(l2, istep, xr, xrPos, ix, ixPos) {
        l2 = l2 >> 1;
        var remaining = l2 % 2;
        l2 = l2 >> 1;
        while (l2-- != 0) {
          var x0, x1, x2, x3;
          var rx0, rx1, rx2, rx3;
          x0 = xr[xrPos++] * istep;
          x1 = xr[xrPos++] * istep;
          rx0 = 0 | x0;
          x2 = xr[xrPos++] * istep;
          rx1 = 0 | x1;
          x3 = xr[xrPos++] * istep;
          rx2 = 0 | x2;
          x0 += qupvt.adj43[rx0];
          rx3 = 0 | x3;
          x1 += qupvt.adj43[rx1];
          ix[ixPos++] = 0 | x0;
          x2 += qupvt.adj43[rx2];
          ix[ixPos++] = 0 | x1;
          x3 += qupvt.adj43[rx3];
          ix[ixPos++] = 0 | x2;
          ix[ixPos++] = 0 | x3;
        }
        if (remaining != 0) {
          var x0, x1;
          var rx0, rx1;
          x0 = xr[xrPos++] * istep;
          x1 = xr[xrPos++] * istep;
          rx0 = 0 | x0;
          rx1 = 0 | x1;
          x0 += qupvt.adj43[rx0];
          x1 += qupvt.adj43[rx1];
          ix[ixPos++] = 0 | x0;
          ix[ixPos++] = 0 | x1;
        }
      }
      function quantize_xrpow(xp, pi, istep, codInfo, prevNoise) {
        var sfb;
        var sfbmax;
        var j = 0;
        var prev_data_use;
        var accumulate = 0;
        var accumulate01 = 0;
        var xpPos = 0;
        var iData = pi;
        var iDataPos = 0;
        var acc_iData = iData;
        var acc_iDataPos = 0;
        var acc_xp = xp;
        var acc_xpPos = 0;
        prev_data_use = prevNoise != null && codInfo.global_gain == prevNoise.global_gain;
        if (codInfo.block_type == Encoder2.SHORT_TYPE)
          sfbmax = 38;
        else
          sfbmax = 21;
        for (sfb = 0; sfb <= sfbmax; sfb++) {
          var step = -1;
          if (prev_data_use || codInfo.block_type == Encoder2.NORM_TYPE) {
            step = codInfo.global_gain - (codInfo.scalefac[sfb] + (codInfo.preflag != 0 ? qupvt.pretab[sfb] : 0) << codInfo.scalefac_scale + 1) - codInfo.subblock_gain[codInfo.window[sfb]] * 8;
          }
          assert2(codInfo.width[sfb] >= 0);
          if (prev_data_use && prevNoise.step[sfb] == step) {
            if (accumulate != 0) {
              quantize_lines_xrpow(
                accumulate,
                istep,
                acc_xp,
                acc_xpPos,
                acc_iData,
                acc_iDataPos
              );
              accumulate = 0;
            }
            if (accumulate01 != 0) {
              quantize_lines_xrpow_01(
                accumulate01,
                istep,
                acc_xp,
                acc_xpPos,
                acc_iData,
                acc_iDataPos
              );
              accumulate01 = 0;
            }
          } else {
            var l2 = codInfo.width[sfb];
            if (j + codInfo.width[sfb] > codInfo.max_nonzero_coeff) {
              var usefullsize;
              usefullsize = codInfo.max_nonzero_coeff - j + 1;
              Arrays2.fill(pi, codInfo.max_nonzero_coeff, 576, 0);
              l2 = usefullsize;
              if (l2 < 0) {
                l2 = 0;
              }
              sfb = sfbmax + 1;
            }
            if (0 == accumulate && 0 == accumulate01) {
              acc_iData = iData;
              acc_iDataPos = iDataPos;
              acc_xp = xp;
              acc_xpPos = xpPos;
            }
            if (prevNoise != null && prevNoise.sfb_count1 > 0 && sfb >= prevNoise.sfb_count1 && prevNoise.step[sfb] > 0 && step >= prevNoise.step[sfb]) {
              if (accumulate != 0) {
                quantize_lines_xrpow(
                  accumulate,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate = 0;
                acc_iData = iData;
                acc_iDataPos = iDataPos;
                acc_xp = xp;
                acc_xpPos = xpPos;
              }
              accumulate01 += l2;
            } else {
              if (accumulate01 != 0) {
                quantize_lines_xrpow_01(
                  accumulate01,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate01 = 0;
                acc_iData = iData;
                acc_iDataPos = iDataPos;
                acc_xp = xp;
                acc_xpPos = xpPos;
              }
              accumulate += l2;
            }
            if (l2 <= 0) {
              if (accumulate01 != 0) {
                quantize_lines_xrpow_01(
                  accumulate01,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate01 = 0;
              }
              if (accumulate != 0) {
                quantize_lines_xrpow(
                  accumulate,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate = 0;
              }
              break;
            }
          }
          if (sfb <= sfbmax) {
            iDataPos += codInfo.width[sfb];
            xpPos += codInfo.width[sfb];
            j += codInfo.width[sfb];
          }
        }
        if (accumulate != 0) {
          quantize_lines_xrpow(
            accumulate,
            istep,
            acc_xp,
            acc_xpPos,
            acc_iData,
            acc_iDataPos
          );
          accumulate = 0;
        }
        if (accumulate01 != 0) {
          quantize_lines_xrpow_01(
            accumulate01,
            istep,
            acc_xp,
            acc_xpPos,
            acc_iData,
            acc_iDataPos
          );
          accumulate01 = 0;
        }
      }
      function ix_max(ix, ixPos, endPos) {
        var max1 = 0, max2 = 0;
        do {
          var x1 = ix[ixPos++];
          var x2 = ix[ixPos++];
          if (max1 < x1)
            max1 = x1;
          if (max2 < x2)
            max2 = x2;
        } while (ixPos < endPos);
        if (max1 < max2)
          max1 = max2;
        return max1;
      }
      function count_bit_ESC(ix, ixPos, end, t1, t2, s) {
        var linbits = Tables2.ht[t1].xlen * 65536 + Tables2.ht[t2].xlen;
        var sum = 0, sum2;
        do {
          var x = ix[ixPos++];
          var y = ix[ixPos++];
          if (x != 0) {
            if (x > 14) {
              x = 15;
              sum += linbits;
            }
            x *= 16;
          }
          if (y != 0) {
            if (y > 14) {
              y = 15;
              sum += linbits;
            }
            x += y;
          }
          sum += Tables2.largetbl[x];
        } while (ixPos < end);
        sum2 = sum & 65535;
        sum >>= 16;
        if (sum > sum2) {
          sum = sum2;
          t1 = t2;
        }
        s.bits += sum;
        return t1;
      }
      function count_bit_noESC(ix, ixPos, end, s) {
        var sum1 = 0;
        var hlen1 = Tables2.ht[1].hlen;
        do {
          var x = ix[ixPos + 0] * 2 + ix[ixPos + 1];
          ixPos += 2;
          sum1 += hlen1[x];
        } while (ixPos < end);
        s.bits += sum1;
        return 1;
      }
      function count_bit_noESC_from2(ix, ixPos, end, t1, s) {
        var sum = 0, sum2;
        var xlen = Tables2.ht[t1].xlen;
        var hlen;
        if (t1 == 2)
          hlen = Tables2.table23;
        else
          hlen = Tables2.table56;
        do {
          var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
          ixPos += 2;
          sum += hlen[x];
        } while (ixPos < end);
        sum2 = sum & 65535;
        sum >>= 16;
        if (sum > sum2) {
          sum = sum2;
          t1++;
        }
        s.bits += sum;
        return t1;
      }
      function count_bit_noESC_from3(ix, ixPos, end, t1, s) {
        var sum1 = 0;
        var sum2 = 0;
        var sum3 = 0;
        var xlen = Tables2.ht[t1].xlen;
        var hlen1 = Tables2.ht[t1].hlen;
        var hlen2 = Tables2.ht[t1 + 1].hlen;
        var hlen3 = Tables2.ht[t1 + 2].hlen;
        do {
          var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
          ixPos += 2;
          sum1 += hlen1[x];
          sum2 += hlen2[x];
          sum3 += hlen3[x];
        } while (ixPos < end);
        var t = t1;
        if (sum1 > sum2) {
          sum1 = sum2;
          t++;
        }
        if (sum1 > sum3) {
          sum1 = sum3;
          t = t1 + 2;
        }
        s.bits += sum1;
        return t;
      }
      var huf_tbl_noESC = [
        1,
        2,
        5,
        7,
        7,
        10,
        10,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        13
      ];
      function choose_table(ix, ixPos, endPos, s) {
        var max = ix_max(ix, ixPos, endPos);
        switch (max) {
          case 0:
            return max;
          case 1:
            return count_bit_noESC(ix, ixPos, endPos, s);
          case 2:
          case 3:
            return count_bit_noESC_from2(
              ix,
              ixPos,
              endPos,
              huf_tbl_noESC[max - 1],
              s
            );
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
            return count_bit_noESC_from3(
              ix,
              ixPos,
              endPos,
              huf_tbl_noESC[max - 1],
              s
            );
          default:
            if (max > QuantizePVT.IXMAX_VAL) {
              s.bits = QuantizePVT.LARGE_BITS;
              return -1;
            }
            max -= 15;
            var choice2;
            for (choice2 = 24; choice2 < 32; choice2++) {
              if (Tables2.ht[choice2].linmax >= max) {
                break;
              }
            }
            var choice;
            for (choice = choice2 - 8; choice < 24; choice++) {
              if (Tables2.ht[choice].linmax >= max) {
                break;
              }
            }
            return count_bit_ESC(ix, ixPos, endPos, choice, choice2, s);
        }
      }
      this.noquant_count_bits = function(gfc, gi, prev_noise) {
        var ix = gi.l3_enc;
        var i = Math.min(576, gi.max_nonzero_coeff + 2 >> 1 << 1);
        if (prev_noise != null)
          prev_noise.sfb_count1 = 0;
        for (; i > 1; i -= 2)
          if ((ix[i - 1] | ix[i - 2]) != 0)
            break;
        gi.count1 = i;
        var a1 = 0;
        var a2 = 0;
        for (; i > 3; i -= 4) {
          var p2;
          if (((ix[i - 1] | ix[i - 2] | ix[i - 3] | ix[i - 4]) & 2147483647) > 1) {
            break;
          }
          p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
          a1 += Tables2.t32l[p2];
          a2 += Tables2.t33l[p2];
        }
        var bits = a1;
        gi.count1table_select = 0;
        if (a1 > a2) {
          bits = a2;
          gi.count1table_select = 1;
        }
        gi.count1bits = bits;
        gi.big_values = i;
        if (i == 0)
          return bits;
        if (gi.block_type == Encoder2.SHORT_TYPE) {
          a1 = 3 * gfc.scalefac_band.s[3];
          if (a1 > gi.big_values)
            a1 = gi.big_values;
          a2 = gi.big_values;
        } else if (gi.block_type == Encoder2.NORM_TYPE) {
          a1 = gi.region0_count = gfc.bv_scf[i - 2];
          a2 = gi.region1_count = gfc.bv_scf[i - 1];
          assert2(a1 + a2 + 2 < Encoder2.SBPSY_l);
          a2 = gfc.scalefac_band.l[a1 + a2 + 2];
          a1 = gfc.scalefac_band.l[a1 + 1];
          if (a2 < i) {
            var bi = new Bits(bits);
            gi.table_select[2] = choose_table(ix, a2, i, bi);
            bits = bi.bits;
          }
        } else {
          gi.region0_count = 7;
          gi.region1_count = Encoder2.SBMAX_l - 1 - 7 - 1;
          a1 = gfc.scalefac_band.l[7 + 1];
          a2 = i;
          if (a1 > a2) {
            a1 = a2;
          }
        }
        a1 = Math.min(a1, i);
        a2 = Math.min(a2, i);
        if (0 < a1) {
          var bi = new Bits(bits);
          gi.table_select[0] = choose_table(ix, 0, a1, bi);
          bits = bi.bits;
        }
        if (a1 < a2) {
          var bi = new Bits(bits);
          gi.table_select[1] = choose_table(ix, a1, a2, bi);
          bits = bi.bits;
        }
        if (gfc.use_best_huffman == 2) {
          gi.part2_3_length = bits;
          best_huffman_divide(gfc, gi);
          bits = gi.part2_3_length;
        }
        if (prev_noise != null) {
          if (gi.block_type == Encoder2.NORM_TYPE) {
            var sfb = 0;
            while (gfc.scalefac_band.l[sfb] < gi.big_values) {
              sfb++;
            }
            prev_noise.sfb_count1 = sfb;
          }
        }
        return bits;
      };
      this.count_bits = function(gfc, xr, gi, prev_noise) {
        var ix = gi.l3_enc;
        var w = QuantizePVT.IXMAX_VAL / qupvt.IPOW20(gi.global_gain);
        if (gi.xrpow_max > w)
          return QuantizePVT.LARGE_BITS;
        quantize_xrpow(xr, ix, qupvt.IPOW20(gi.global_gain), gi, prev_noise);
        if ((gfc.substep_shaping & 2) != 0) {
          var j = 0;
          var gain = gi.global_gain + gi.scalefac_scale;
          var roundfac = 0.634521682242439 / qupvt.IPOW20(gain);
          for (var sfb = 0; sfb < gi.sfbmax; sfb++) {
            var width = gi.width[sfb];
            if (0 == gfc.pseudohalf[sfb]) {
              j += width;
            } else {
              var k2;
              for (k2 = j, j += width; k2 < j; ++k2) {
                ix[k2] = xr[k2] >= roundfac ? ix[k2] : 0;
              }
            }
          }
        }
        return this.noquant_count_bits(gfc, gi, prev_noise);
      };
      function recalc_divide_init(gfc, cod_info, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
        var bigv = cod_info.big_values;
        for (var r0 = 0; r0 <= 7 + 15; r0++) {
          r01_bits[r0] = QuantizePVT.LARGE_BITS;
        }
        for (var r0 = 0; r0 < 16; r0++) {
          var a1 = gfc.scalefac_band.l[r0 + 1];
          if (a1 >= bigv)
            break;
          var r0bits = 0;
          var bi = new Bits(r0bits);
          var r0t = choose_table(ix, 0, a1, bi);
          r0bits = bi.bits;
          for (var r1 = 0; r1 < 8; r1++) {
            var a2 = gfc.scalefac_band.l[r0 + r1 + 2];
            if (a2 >= bigv)
              break;
            var bits = r0bits;
            bi = new Bits(bits);
            var r1t = choose_table(ix, a1, a2, bi);
            bits = bi.bits;
            if (r01_bits[r0 + r1] > bits) {
              r01_bits[r0 + r1] = bits;
              r01_div[r0 + r1] = r0;
              r0_tbl[r0 + r1] = r0t;
              r1_tbl[r0 + r1] = r1t;
            }
          }
        }
      }
      function recalc_divide_sub(gfc, cod_info2, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
        var bigv = cod_info2.big_values;
        for (var r2 = 2; r2 < Encoder2.SBMAX_l + 1; r2++) {
          var a2 = gfc.scalefac_band.l[r2];
          if (a2 >= bigv)
            break;
          var bits = r01_bits[r2 - 2] + cod_info2.count1bits;
          if (gi.part2_3_length <= bits)
            break;
          var bi = new Bits(bits);
          var r2t = choose_table(ix, a2, bigv, bi);
          bits = bi.bits;
          if (gi.part2_3_length <= bits)
            continue;
          gi.assign(cod_info2);
          gi.part2_3_length = bits;
          gi.region0_count = r01_div[r2 - 2];
          gi.region1_count = r2 - 2 - r01_div[r2 - 2];
          gi.table_select[0] = r0_tbl[r2 - 2];
          gi.table_select[1] = r1_tbl[r2 - 2];
          gi.table_select[2] = r2t;
        }
      }
      this.best_huffman_divide = function(gfc, gi) {
        var cod_info2 = new GrInfo2();
        var ix = gi.l3_enc;
        var r01_bits = new_int2(7 + 15 + 1);
        var r01_div = new_int2(7 + 15 + 1);
        var r0_tbl = new_int2(7 + 15 + 1);
        var r1_tbl = new_int2(7 + 15 + 1);
        if (gi.block_type == Encoder2.SHORT_TYPE && gfc.mode_gr == 1)
          return;
        cod_info2.assign(gi);
        if (gi.block_type == Encoder2.NORM_TYPE) {
          recalc_divide_init(gfc, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl);
          recalc_divide_sub(
            gfc,
            cod_info2,
            gi,
            ix,
            r01_bits,
            r01_div,
            r0_tbl,
            r1_tbl
          );
        }
        var i = cod_info2.big_values;
        if (i == 0 || (ix[i - 2] | ix[i - 1]) > 1)
          return;
        i = gi.count1 + 2;
        if (i > 576)
          return;
        cod_info2.assign(gi);
        cod_info2.count1 = i;
        var a1 = 0;
        var a2 = 0;
        for (; i > cod_info2.big_values; i -= 4) {
          var p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
          a1 += Tables2.t32l[p2];
          a2 += Tables2.t33l[p2];
        }
        cod_info2.big_values = i;
        cod_info2.count1table_select = 0;
        if (a1 > a2) {
          a1 = a2;
          cod_info2.count1table_select = 1;
        }
        cod_info2.count1bits = a1;
        if (cod_info2.block_type == Encoder2.NORM_TYPE)
          recalc_divide_sub(
            gfc,
            cod_info2,
            gi,
            ix,
            r01_bits,
            r01_div,
            r0_tbl,
            r1_tbl
          );
        else {
          cod_info2.part2_3_length = a1;
          a1 = gfc.scalefac_band.l[7 + 1];
          if (a1 > i) {
            a1 = i;
          }
          if (a1 > 0) {
            var bi = new Bits(cod_info2.part2_3_length);
            cod_info2.table_select[0] = choose_table(ix, 0, a1, bi);
            cod_info2.part2_3_length = bi.bits;
          }
          if (i > a1) {
            var bi = new Bits(cod_info2.part2_3_length);
            cod_info2.table_select[1] = choose_table(ix, a1, i, bi);
            cod_info2.part2_3_length = bi.bits;
          }
          if (gi.part2_3_length > cod_info2.part2_3_length)
            gi.assign(cod_info2);
        }
      };
      var slen1_n = [1, 1, 1, 1, 8, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16];
      var slen2_n = [1, 2, 4, 8, 1, 2, 4, 8, 2, 4, 8, 2, 4, 8, 4, 8];
      var slen1_tab = [0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
      var slen2_tab = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3];
      Takehiro.slen1_tab = slen1_tab;
      Takehiro.slen2_tab = slen2_tab;
      function scfsi_calc(ch, l3_side) {
        var sfb;
        var gi = l3_side.tt[1][ch];
        var g0 = l3_side.tt[0][ch];
        for (var i = 0; i < Tables2.scfsi_band.length - 1; i++) {
          for (sfb = Tables2.scfsi_band[i]; sfb < Tables2.scfsi_band[i + 1]; sfb++) {
            if (g0.scalefac[sfb] != gi.scalefac[sfb] && gi.scalefac[sfb] >= 0)
              break;
          }
          if (sfb == Tables2.scfsi_band[i + 1]) {
            for (sfb = Tables2.scfsi_band[i]; sfb < Tables2.scfsi_band[i + 1]; sfb++) {
              gi.scalefac[sfb] = -1;
            }
            l3_side.scfsi[ch][i] = 1;
          }
        }
        var s1 = 0;
        var c1 = 0;
        for (sfb = 0; sfb < 11; sfb++) {
          if (gi.scalefac[sfb] == -1)
            continue;
          c1++;
          if (s1 < gi.scalefac[sfb])
            s1 = gi.scalefac[sfb];
        }
        var s2 = 0;
        var c2 = 0;
        for (; sfb < Encoder2.SBPSY_l; sfb++) {
          if (gi.scalefac[sfb] == -1)
            continue;
          c2++;
          if (s2 < gi.scalefac[sfb])
            s2 = gi.scalefac[sfb];
        }
        for (var i = 0; i < 16; i++) {
          if (s1 < slen1_n[i] && s2 < slen2_n[i]) {
            var c = slen1_tab[i] * c1 + slen2_tab[i] * c2;
            if (gi.part2_length > c) {
              gi.part2_length = c;
              gi.scalefac_compress = i;
            }
          }
        }
      }
      this.best_scalefac_store = function(gfc, gr, ch, l3_side) {
        var gi = l3_side.tt[gr][ch];
        var sfb, i, j, l2;
        var recalc = 0;
        j = 0;
        for (sfb = 0; sfb < gi.sfbmax; sfb++) {
          var width = gi.width[sfb];
          j += width;
          for (l2 = -width; l2 < 0; l2++) {
            if (gi.l3_enc[l2 + j] != 0)
              break;
          }
          if (l2 == 0)
            gi.scalefac[sfb] = recalc = -2;
        }
        if (0 == gi.scalefac_scale && 0 == gi.preflag) {
          var s = 0;
          for (sfb = 0; sfb < gi.sfbmax; sfb++)
            if (gi.scalefac[sfb] > 0)
              s |= gi.scalefac[sfb];
          if (0 == (s & 1) && s != 0) {
            for (sfb = 0; sfb < gi.sfbmax; sfb++)
              if (gi.scalefac[sfb] > 0)
                gi.scalefac[sfb] >>= 1;
            gi.scalefac_scale = recalc = 1;
          }
        }
        if (0 == gi.preflag && gi.block_type != Encoder2.SHORT_TYPE && gfc.mode_gr == 2) {
          for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
            if (gi.scalefac[sfb] < qupvt.pretab[sfb] && gi.scalefac[sfb] != -2)
              break;
          if (sfb == Encoder2.SBPSY_l) {
            for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
              if (gi.scalefac[sfb] > 0)
                gi.scalefac[sfb] -= qupvt.pretab[sfb];
            gi.preflag = recalc = 1;
          }
        }
        for (i = 0; i < 4; i++)
          l3_side.scfsi[ch][i] = 0;
        if (gfc.mode_gr == 2 && gr == 1 && l3_side.tt[0][ch].block_type != Encoder2.SHORT_TYPE && l3_side.tt[1][ch].block_type != Encoder2.SHORT_TYPE) {
          scfsi_calc(ch, l3_side);
          recalc = 0;
        }
        for (sfb = 0; sfb < gi.sfbmax; sfb++) {
          if (gi.scalefac[sfb] == -2) {
            gi.scalefac[sfb] = 0;
          }
        }
        if (recalc != 0) {
          if (gfc.mode_gr == 2) {
            this.scale_bitcount(gi);
          } else {
            this.scale_bitcount_lsf(gfc, gi);
          }
        }
      };
      function all_scalefactors_not_negative(scalefac, n2) {
        for (var i = 0; i < n2; ++i) {
          if (scalefac[i] < 0)
            return false;
        }
        return true;
      }
      var scale_short = [
        0,
        18,
        36,
        54,
        54,
        36,
        54,
        72,
        54,
        72,
        90,
        72,
        90,
        108,
        108,
        126
      ];
      var scale_mixed = [
        0,
        18,
        36,
        54,
        51,
        35,
        53,
        71,
        52,
        70,
        88,
        69,
        87,
        105,
        104,
        122
      ];
      var scale_long = [
        0,
        10,
        20,
        30,
        33,
        21,
        31,
        41,
        32,
        42,
        52,
        43,
        53,
        63,
        64,
        74
      ];
      this.scale_bitcount = function(cod_info) {
        var k2, sfb, max_slen1 = 0, max_slen2 = 0;
        var tab;
        var scalefac = cod_info.scalefac;
        assert2(all_scalefactors_not_negative(scalefac, cod_info.sfbmax));
        if (cod_info.block_type == Encoder2.SHORT_TYPE) {
          tab = scale_short;
          if (cod_info.mixed_block_flag != 0)
            tab = scale_mixed;
        } else {
          tab = scale_long;
          if (0 == cod_info.preflag) {
            for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
              if (scalefac[sfb] < qupvt.pretab[sfb])
                break;
            if (sfb == Encoder2.SBPSY_l) {
              cod_info.preflag = 1;
              for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
                scalefac[sfb] -= qupvt.pretab[sfb];
            }
          }
        }
        for (sfb = 0; sfb < cod_info.sfbdivide; sfb++)
          if (max_slen1 < scalefac[sfb])
            max_slen1 = scalefac[sfb];
        for (; sfb < cod_info.sfbmax; sfb++)
          if (max_slen2 < scalefac[sfb])
            max_slen2 = scalefac[sfb];
        cod_info.part2_length = QuantizePVT.LARGE_BITS;
        for (k2 = 0; k2 < 16; k2++) {
          if (max_slen1 < slen1_n[k2] && max_slen2 < slen2_n[k2] && cod_info.part2_length > tab[k2]) {
            cod_info.part2_length = tab[k2];
            cod_info.scalefac_compress = k2;
          }
        }
        return cod_info.part2_length == QuantizePVT.LARGE_BITS;
      };
      var max_range_sfac_tab = [
        [15, 15, 7, 7],
        [15, 15, 7, 0],
        [7, 3, 0, 0],
        [15, 31, 31, 0],
        [7, 7, 7, 0],
        [3, 3, 0, 0]
      ];
      this.scale_bitcount_lsf = function(gfc, cod_info) {
        var table_number, row_in_table, partition, nr_sfb, window2;
        var over;
        var i, sfb;
        var max_sfac = new_int2(4);
        var scalefac = cod_info.scalefac;
        if (cod_info.preflag != 0)
          table_number = 2;
        else
          table_number = 0;
        for (i = 0; i < 4; i++)
          max_sfac[i] = 0;
        if (cod_info.block_type == Encoder2.SHORT_TYPE) {
          row_in_table = 1;
          var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (sfb = 0, partition = 0; partition < 4; partition++) {
            nr_sfb = partition_table[partition] / 3;
            for (i = 0; i < nr_sfb; i++, sfb++)
              for (window2 = 0; window2 < 3; window2++)
                if (scalefac[sfb * 3 + window2] > max_sfac[partition])
                  max_sfac[partition] = scalefac[sfb * 3 + window2];
          }
        } else {
          row_in_table = 0;
          var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (sfb = 0, partition = 0; partition < 4; partition++) {
            nr_sfb = partition_table[partition];
            for (i = 0; i < nr_sfb; i++, sfb++)
              if (scalefac[sfb] > max_sfac[partition])
                max_sfac[partition] = scalefac[sfb];
          }
        }
        for (over = false, partition = 0; partition < 4; partition++) {
          if (max_sfac[partition] > max_range_sfac_tab[table_number][partition])
            over = true;
        }
        if (!over) {
          var slen1, slen2, slen3, slen4;
          cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
          for (partition = 0; partition < 4; partition++)
            cod_info.slen[partition] = log2tab[max_sfac[partition]];
          slen1 = cod_info.slen[0];
          slen2 = cod_info.slen[1];
          slen3 = cod_info.slen[2];
          slen4 = cod_info.slen[3];
          switch (table_number) {
            case 0:
              cod_info.scalefac_compress = (slen1 * 5 + slen2 << 4) + (slen3 << 2) + slen4;
              break;
            case 1:
              cod_info.scalefac_compress = 400 + (slen1 * 5 + slen2 << 2) + slen3;
              break;
            case 2:
              cod_info.scalefac_compress = 500 + slen1 * 3 + slen2;
              break;
            default:
              System2.err.printf("intensity stereo not implemented yet\n");
              break;
          }
        }
        if (!over) {
          assert2(cod_info.sfb_partition_table != null);
          cod_info.part2_length = 0;
          for (partition = 0; partition < 4; partition++)
            cod_info.part2_length += cod_info.slen[partition] * cod_info.sfb_partition_table[partition];
        }
        return over;
      };
      var log2tab = [
        0,
        1,
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
        4,
        4,
        4,
        4
      ];
      this.huffman_init = function(gfc) {
        for (var i = 2; i <= 576; i += 2) {
          var scfb_anz = 0, bv_index;
          while (gfc.scalefac_band.l[++scfb_anz] < i)
            ;
          bv_index = subdv_table[scfb_anz][0];
          while (gfc.scalefac_band.l[bv_index + 1] > i)
            bv_index--;
          if (bv_index < 0) {
            bv_index = subdv_table[scfb_anz][0];
          }
          gfc.bv_scf[i - 2] = bv_index;
          bv_index = subdv_table[scfb_anz][1];
          while (gfc.scalefac_band.l[bv_index + gfc.bv_scf[i - 2] + 2] > i)
            bv_index--;
          if (bv_index < 0) {
            bv_index = subdv_table[scfb_anz][1];
          }
          gfc.bv_scf[i - 1] = bv_index;
        }
      };
    }
    Takehiro_1 = Takehiro;
    return Takehiro_1;
  }
  var BitStream_1;
  var hasRequiredBitStream;
  function requireBitStream() {
    if (hasRequiredBitStream) return BitStream_1;
    hasRequiredBitStream = 1;
    var common2 = common$h;
    var System2 = common2.System;
    var Arrays2 = common2.Arrays;
    var new_byte2 = common2.new_byte;
    var new_float_n2 = common2.new_float_n;
    var new_int2 = common2.new_int;
    var assert2 = common2.assert;
    var Takehiro = requireTakehiro();
    var Tables2 = Tables_1;
    var Encoder2 = requireEncoder();
    var LameInternalFlags2 = LameInternalFlags_1;
    var Lame2 = requireLame();
    BitStream.EQ = function(a, b) {
      return Math.abs(a) > Math.abs(b) ? Math.abs(a - b) <= Math.abs(a) * 1e-6 : Math.abs(a - b) <= Math.abs(b) * 1e-6;
    };
    BitStream.NEQ = function(a, b) {
      return !BitStream.EQ(a, b);
    };
    function BitStream() {
      var self2 = this;
      var CRC16_POLYNOMIAL = 32773;
      var ga = null;
      var mpg = null;
      var ver = null;
      var vbr = null;
      this.setModules = function(_ga, _mpg, _ver, _vbr) {
        ga = _ga;
        mpg = _mpg;
        ver = _ver;
        vbr = _vbr;
      };
      var buf = null;
      var totbit = 0;
      var bufByteIdx = 0;
      var bufBitIdx = 0;
      this.getframebits = function(gfp) {
        var gfc = gfp.internal_flags;
        var bit_rate;
        if (gfc.bitrate_index != 0)
          bit_rate = Tables2.bitrate_table[gfp.version][gfc.bitrate_index];
        else
          bit_rate = gfp.brate;
        var bytes = 0 | (gfp.version + 1) * 72e3 * bit_rate / gfp.out_samplerate + gfc.padding;
        return 8 * bytes;
      };
      function putheader_bits(gfc) {
        System2.arraycopy(gfc.header[gfc.w_ptr].buf, 0, buf, bufByteIdx, gfc.sideinfo_len);
        bufByteIdx += gfc.sideinfo_len;
        totbit += gfc.sideinfo_len * 8;
        gfc.w_ptr = gfc.w_ptr + 1 & LameInternalFlags2.MAX_HEADER_BUF - 1;
      }
      function putbits2(gfc, val, j) {
        while (j > 0) {
          var k2;
          if (bufBitIdx == 0) {
            bufBitIdx = 8;
            bufByteIdx++;
            assert2(bufByteIdx < Lame2.LAME_MAXMP3BUFFER);
            assert2(gfc.header[gfc.w_ptr].write_timing >= totbit);
            if (gfc.header[gfc.w_ptr].write_timing == totbit) {
              putheader_bits(gfc);
            }
            buf[bufByteIdx] = 0;
          }
          k2 = Math.min(j, bufBitIdx);
          j -= k2;
          bufBitIdx -= k2;
          buf[bufByteIdx] |= val >> j << bufBitIdx;
          totbit += k2;
        }
      }
      function putbits_noheaders(gfc, val, j) {
        while (j > 0) {
          var k2;
          if (bufBitIdx == 0) {
            bufBitIdx = 8;
            bufByteIdx++;
            assert2(bufByteIdx < Lame2.LAME_MAXMP3BUFFER);
            buf[bufByteIdx] = 0;
          }
          k2 = Math.min(j, bufBitIdx);
          j -= k2;
          bufBitIdx -= k2;
          buf[bufByteIdx] |= val >> j << bufBitIdx;
          totbit += k2;
        }
      }
      function drain_into_ancillary(gfp, remainingBits) {
        var gfc = gfp.internal_flags;
        var i;
        if (remainingBits >= 8) {
          putbits2(gfc, 76, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 65, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 77, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 8) {
          putbits2(gfc, 69, 8);
          remainingBits -= 8;
        }
        if (remainingBits >= 32) {
          var version = ver.getLameShortVersion();
          if (remainingBits >= 32)
            for (i = 0; i < version.length && remainingBits >= 8; ++i) {
              remainingBits -= 8;
              putbits2(gfc, version.charAt(i), 8);
            }
        }
        for (; remainingBits >= 1; remainingBits -= 1) {
          putbits2(gfc, gfc.ancillary_flag, 1);
          gfc.ancillary_flag ^= !gfp.disable_reservoir ? 1 : 0;
        }
      }
      function writeheader(gfc, val, j) {
        var ptr = gfc.header[gfc.h_ptr].ptr;
        while (j > 0) {
          var k2 = Math.min(j, 8 - (ptr & 7));
          j -= k2;
          gfc.header[gfc.h_ptr].buf[ptr >> 3] |= val >> j << 8 - (ptr & 7) - k2;
          ptr += k2;
        }
        gfc.header[gfc.h_ptr].ptr = ptr;
      }
      function CRC_update(value, crc) {
        value <<= 8;
        for (var i = 0; i < 8; i++) {
          value <<= 1;
          crc <<= 1;
          if (((crc ^ value) & 65536) != 0)
            crc ^= CRC16_POLYNOMIAL;
        }
        return crc;
      }
      this.CRC_writeheader = function(gfc, header) {
        var crc = 65535;
        crc = CRC_update(header[2] & 255, crc);
        crc = CRC_update(header[3] & 255, crc);
        for (var i = 6; i < gfc.sideinfo_len; i++) {
          crc = CRC_update(header[i] & 255, crc);
        }
        header[4] = byte(crc >> 8);
        header[5] = byte(crc & 255);
      };
      function encodeSideInfo2(gfp, bitsPerFrame) {
        var gfc = gfp.internal_flags;
        var l3_side;
        var gr, ch;
        l3_side = gfc.l3_side;
        gfc.header[gfc.h_ptr].ptr = 0;
        Arrays2.fill(gfc.header[gfc.h_ptr].buf, 0, gfc.sideinfo_len, 0);
        if (gfp.out_samplerate < 16e3)
          writeheader(gfc, 4094, 12);
        else
          writeheader(gfc, 4095, 12);
        writeheader(gfc, gfp.version, 1);
        writeheader(gfc, 4 - 3, 2);
        writeheader(gfc, !gfp.error_protection ? 1 : 0, 1);
        writeheader(gfc, gfc.bitrate_index, 4);
        writeheader(gfc, gfc.samplerate_index, 2);
        writeheader(gfc, gfc.padding, 1);
        writeheader(gfc, gfp.extension, 1);
        writeheader(gfc, gfp.mode.ordinal(), 2);
        writeheader(gfc, gfc.mode_ext, 2);
        writeheader(gfc, gfp.copyright, 1);
        writeheader(gfc, gfp.original, 1);
        writeheader(gfc, gfp.emphasis, 2);
        if (gfp.error_protection) {
          writeheader(gfc, 0, 16);
        }
        if (gfp.version == 1) {
          assert2(l3_side.main_data_begin >= 0);
          writeheader(gfc, l3_side.main_data_begin, 9);
          if (gfc.channels_out == 2)
            writeheader(gfc, l3_side.private_bits, 3);
          else
            writeheader(gfc, l3_side.private_bits, 5);
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var band;
            for (band = 0; band < 4; band++) {
              writeheader(gfc, l3_side.scfsi[ch][band], 1);
            }
          }
          for (gr = 0; gr < 2; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
              writeheader(gfc, gi.big_values / 2, 9);
              writeheader(gfc, gi.global_gain, 8);
              writeheader(gfc, gi.scalefac_compress, 4);
              if (gi.block_type != Encoder2.NORM_TYPE) {
                writeheader(gfc, 1, 1);
                writeheader(gfc, gi.block_type, 2);
                writeheader(gfc, gi.mixed_block_flag, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                writeheader(gfc, gi.subblock_gain[0], 3);
                writeheader(gfc, gi.subblock_gain[1], 3);
                writeheader(gfc, gi.subblock_gain[2], 3);
              } else {
                writeheader(gfc, 0, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                if (gi.table_select[2] == 14)
                  gi.table_select[2] = 16;
                writeheader(gfc, gi.table_select[2], 5);
                assert2(0 <= gi.region0_count && gi.region0_count < 16);
                assert2(0 <= gi.region1_count && gi.region1_count < 8);
                writeheader(gfc, gi.region0_count, 4);
                writeheader(gfc, gi.region1_count, 3);
              }
              writeheader(gfc, gi.preflag, 1);
              writeheader(gfc, gi.scalefac_scale, 1);
              writeheader(gfc, gi.count1table_select, 1);
            }
          }
        } else {
          assert2(l3_side.main_data_begin >= 0);
          writeheader(gfc, l3_side.main_data_begin, 8);
          writeheader(gfc, l3_side.private_bits, gfc.channels_out);
          gr = 0;
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var gi = l3_side.tt[gr][ch];
            writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
            writeheader(gfc, gi.big_values / 2, 9);
            writeheader(gfc, gi.global_gain, 8);
            writeheader(gfc, gi.scalefac_compress, 9);
            if (gi.block_type != Encoder2.NORM_TYPE) {
              writeheader(gfc, 1, 1);
              writeheader(gfc, gi.block_type, 2);
              writeheader(gfc, gi.mixed_block_flag, 1);
              if (gi.table_select[0] == 14)
                gi.table_select[0] = 16;
              writeheader(gfc, gi.table_select[0], 5);
              if (gi.table_select[1] == 14)
                gi.table_select[1] = 16;
              writeheader(gfc, gi.table_select[1], 5);
              writeheader(gfc, gi.subblock_gain[0], 3);
              writeheader(gfc, gi.subblock_gain[1], 3);
              writeheader(gfc, gi.subblock_gain[2], 3);
            } else {
              writeheader(gfc, 0, 1);
              if (gi.table_select[0] == 14)
                gi.table_select[0] = 16;
              writeheader(gfc, gi.table_select[0], 5);
              if (gi.table_select[1] == 14)
                gi.table_select[1] = 16;
              writeheader(gfc, gi.table_select[1], 5);
              if (gi.table_select[2] == 14)
                gi.table_select[2] = 16;
              writeheader(gfc, gi.table_select[2], 5);
              assert2(0 <= gi.region0_count && gi.region0_count < 16);
              assert2(0 <= gi.region1_count && gi.region1_count < 8);
              writeheader(gfc, gi.region0_count, 4);
              writeheader(gfc, gi.region1_count, 3);
            }
            writeheader(gfc, gi.scalefac_scale, 1);
            writeheader(gfc, gi.count1table_select, 1);
          }
        }
        if (gfp.error_protection) {
          CRC_writeheader(gfc, gfc.header[gfc.h_ptr].buf);
        }
        {
          var old = gfc.h_ptr;
          assert2(gfc.header[old].ptr == gfc.sideinfo_len * 8);
          gfc.h_ptr = old + 1 & LameInternalFlags2.MAX_HEADER_BUF - 1;
          gfc.header[gfc.h_ptr].write_timing = gfc.header[old].write_timing + bitsPerFrame;
          if (gfc.h_ptr == gfc.w_ptr) {
            System2.err.println("Error: MAX_HEADER_BUF too small in bitstream.c \n");
          }
        }
      }
      function huffman_coder_count1(gfc, gi) {
        var h = Tables2.ht[gi.count1table_select + 32];
        var i, bits = 0;
        var ix = gi.big_values;
        var xr = gi.big_values;
        assert2(gi.count1table_select < 2);
        for (i = (gi.count1 - gi.big_values) / 4; i > 0; --i) {
          var huffbits = 0;
          var p2 = 0, v;
          v = gi.l3_enc[ix + 0];
          if (v != 0) {
            p2 += 8;
            if (gi.xr[xr + 0] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 1];
          if (v != 0) {
            p2 += 4;
            huffbits *= 2;
            if (gi.xr[xr + 1] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 2];
          if (v != 0) {
            p2 += 2;
            huffbits *= 2;
            if (gi.xr[xr + 2] < 0)
              huffbits++;
          }
          v = gi.l3_enc[ix + 3];
          if (v != 0) {
            p2++;
            huffbits *= 2;
            if (gi.xr[xr + 3] < 0)
              huffbits++;
          }
          ix += 4;
          xr += 4;
          putbits2(gfc, huffbits + h.table[p2], h.hlen[p2]);
          bits += h.hlen[p2];
        }
        return bits;
      }
      function Huffmancode(gfc, tableindex, start, end, gi) {
        var h = Tables2.ht[tableindex];
        var bits = 0;
        if (0 == tableindex)
          return bits;
        for (var i = start; i < end; i += 2) {
          var cbits = 0;
          var xbits = 0;
          var linbits = h.xlen;
          var xlen = h.xlen;
          var ext = 0;
          var x1 = gi.l3_enc[i];
          var x2 = gi.l3_enc[i + 1];
          if (x1 != 0) {
            if (gi.xr[i] < 0)
              ext++;
            cbits--;
          }
          if (tableindex > 15) {
            if (x1 > 14) {
              var linbits_x1 = x1 - 15;
              assert2(linbits_x1 <= h.linmax);
              ext |= linbits_x1 << 1;
              xbits = linbits;
              x1 = 15;
            }
            if (x2 > 14) {
              var linbits_x2 = x2 - 15;
              assert2(linbits_x2 <= h.linmax);
              ext <<= linbits;
              ext |= linbits_x2;
              xbits += linbits;
              x2 = 15;
            }
            xlen = 16;
          }
          if (x2 != 0) {
            ext <<= 1;
            if (gi.xr[i + 1] < 0)
              ext++;
            cbits--;
          }
          x1 = x1 * xlen + x2;
          xbits -= cbits;
          cbits += h.hlen[x1];
          putbits2(gfc, h.table[x1], cbits);
          putbits2(gfc, ext, xbits);
          bits += cbits + xbits;
        }
        return bits;
      }
      function ShortHuffmancodebits(gfc, gi) {
        var region1Start = 3 * gfc.scalefac_band.s[3];
        if (region1Start > gi.big_values)
          region1Start = gi.big_values;
        var bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
        bits += Huffmancode(
          gfc,
          gi.table_select[1],
          region1Start,
          gi.big_values,
          gi
        );
        return bits;
      }
      function LongHuffmancodebits(gfc, gi) {
        var bigvalues, bits;
        var region1Start, region2Start;
        bigvalues = gi.big_values;
        var i = gi.region0_count + 1;
        assert2(i < gfc.scalefac_band.l.length);
        region1Start = gfc.scalefac_band.l[i];
        i += gi.region1_count + 1;
        assert2(i < gfc.scalefac_band.l.length);
        region2Start = gfc.scalefac_band.l[i];
        if (region1Start > bigvalues)
          region1Start = bigvalues;
        if (region2Start > bigvalues)
          region2Start = bigvalues;
        bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
        bits += Huffmancode(
          gfc,
          gi.table_select[1],
          region1Start,
          region2Start,
          gi
        );
        bits += Huffmancode(
          gfc,
          gi.table_select[2],
          region2Start,
          bigvalues,
          gi
        );
        return bits;
      }
      function writeMainData(gfp) {
        var gr, ch, sfb, data_bits, tot_bits = 0;
        var gfc = gfp.internal_flags;
        var l3_side = gfc.l3_side;
        if (gfp.version == 1) {
          for (gr = 0; gr < 2; gr++) {
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              var slen1 = Takehiro.slen1_tab[gi.scalefac_compress];
              var slen2 = Takehiro.slen2_tab[gi.scalefac_compress];
              data_bits = 0;
              for (sfb = 0; sfb < gi.sfbdivide; sfb++) {
                if (gi.scalefac[sfb] == -1)
                  continue;
                putbits2(gfc, gi.scalefac[sfb], slen1);
                data_bits += slen1;
              }
              for (; sfb < gi.sfbmax; sfb++) {
                if (gi.scalefac[sfb] == -1)
                  continue;
                putbits2(gfc, gi.scalefac[sfb], slen2);
                data_bits += slen2;
              }
              assert2(data_bits == gi.part2_length);
              if (gi.block_type == Encoder2.SHORT_TYPE) {
                data_bits += ShortHuffmancodebits(gfc, gi);
              } else {
                data_bits += LongHuffmancodebits(gfc, gi);
              }
              data_bits += huffman_coder_count1(gfc, gi);
              assert2(data_bits == gi.part2_3_length + gi.part2_length);
              tot_bits += data_bits;
            }
          }
        } else {
          gr = 0;
          for (ch = 0; ch < gfc.channels_out; ch++) {
            var gi = l3_side.tt[gr][ch];
            var i, sfb_partition, scale_bits = 0;
            assert2(gi.sfb_partition_table != null);
            data_bits = 0;
            sfb = 0;
            sfb_partition = 0;
            if (gi.block_type == Encoder2.SHORT_TYPE) {
              for (; sfb_partition < 4; sfb_partition++) {
                var sfbs = gi.sfb_partition_table[sfb_partition] / 3;
                var slen = gi.slen[sfb_partition];
                for (i = 0; i < sfbs; i++, sfb++) {
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 0], 0),
                    slen
                  );
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 1], 0),
                    slen
                  );
                  putbits2(
                    gfc,
                    Math.max(gi.scalefac[sfb * 3 + 2], 0),
                    slen
                  );
                  scale_bits += 3 * slen;
                }
              }
              data_bits += ShortHuffmancodebits(gfc, gi);
            } else {
              for (; sfb_partition < 4; sfb_partition++) {
                var sfbs = gi.sfb_partition_table[sfb_partition];
                var slen = gi.slen[sfb_partition];
                for (i = 0; i < sfbs; i++, sfb++) {
                  putbits2(gfc, Math.max(gi.scalefac[sfb], 0), slen);
                  scale_bits += slen;
                }
              }
              data_bits += LongHuffmancodebits(gfc, gi);
            }
            data_bits += huffman_coder_count1(gfc, gi);
            assert2(data_bits == gi.part2_3_length);
            assert2(scale_bits == gi.part2_length);
            tot_bits += scale_bits + data_bits;
          }
        }
        return tot_bits;
      }
      function TotalBytes() {
        this.total = 0;
      }
      function compute_flushbits(gfp, total_bytes_output) {
        var gfc = gfp.internal_flags;
        var flushbits, remaining_headers;
        var bitsPerFrame;
        var last_ptr, first_ptr;
        first_ptr = gfc.w_ptr;
        last_ptr = gfc.h_ptr - 1;
        if (last_ptr == -1)
          last_ptr = LameInternalFlags2.MAX_HEADER_BUF - 1;
        flushbits = gfc.header[last_ptr].write_timing - totbit;
        total_bytes_output.total = flushbits;
        if (flushbits >= 0) {
          remaining_headers = 1 + last_ptr - first_ptr;
          if (last_ptr < first_ptr)
            remaining_headers = 1 + last_ptr - first_ptr + LameInternalFlags2.MAX_HEADER_BUF;
          flushbits -= remaining_headers * 8 * gfc.sideinfo_len;
        }
        bitsPerFrame = self2.getframebits(gfp);
        flushbits += bitsPerFrame;
        total_bytes_output.total += bitsPerFrame;
        if (total_bytes_output.total % 8 != 0)
          total_bytes_output.total = 1 + total_bytes_output.total / 8;
        else
          total_bytes_output.total = total_bytes_output.total / 8;
        total_bytes_output.total += bufByteIdx + 1;
        if (flushbits < 0) {
          System2.err.println("strange error flushing buffer ... \n");
        }
        return flushbits;
      }
      this.flush_bitstream = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side;
        var flushbits;
        var last_ptr = gfc.h_ptr - 1;
        if (last_ptr == -1)
          last_ptr = LameInternalFlags2.MAX_HEADER_BUF - 1;
        l3_side = gfc.l3_side;
        if ((flushbits = compute_flushbits(gfp, new TotalBytes())) < 0)
          return;
        drain_into_ancillary(gfp, flushbits);
        assert2(gfc.header[last_ptr].write_timing + this.getframebits(gfp) == totbit);
        gfc.ResvSize = 0;
        l3_side.main_data_begin = 0;
        if (gfc.findReplayGain) {
          var RadioGain = ga.GetTitleGain(gfc.rgdata);
          assert2(NEQ(RadioGain, GainAnalysis.GAIN_NOT_ENOUGH_SAMPLES));
          gfc.RadioGain = Math.floor(RadioGain * 10 + 0.5) | 0;
        }
        if (gfc.findPeakSample) {
          gfc.noclipGainChange = Math.ceil(Math.log10(gfc.PeakSample / 32767) * 20 * 10) | 0;
          if (gfc.noclipGainChange > 0) {
            if (EQ(gfp.scale, 1) || EQ(gfp.scale, 0))
              gfc.noclipScale = Math.floor(32767 / gfc.PeakSample * 100) / 100;
            else {
              gfc.noclipScale = -1;
            }
          } else
            gfc.noclipScale = -1;
        }
      };
      this.add_dummy_byte = function(gfp, val, n2) {
        var gfc = gfp.internal_flags;
        var i;
        while (n2-- > 0) {
          putbits_noheaders(gfc, val, 8);
          for (i = 0; i < LameInternalFlags2.MAX_HEADER_BUF; ++i)
            gfc.header[i].write_timing += 8;
        }
      };
      this.format_bitstream = function(gfp) {
        var gfc = gfp.internal_flags;
        var l3_side;
        l3_side = gfc.l3_side;
        var bitsPerFrame = this.getframebits(gfp);
        drain_into_ancillary(gfp, l3_side.resvDrain_pre);
        encodeSideInfo2(gfp, bitsPerFrame);
        var bits = 8 * gfc.sideinfo_len;
        bits += writeMainData(gfp);
        drain_into_ancillary(gfp, l3_side.resvDrain_post);
        bits += l3_side.resvDrain_post;
        l3_side.main_data_begin += (bitsPerFrame - bits) / 8;
        if (compute_flushbits(gfp, new TotalBytes()) != gfc.ResvSize) {
          System2.err.println("Internal buffer inconsistency. flushbits <> ResvSize");
        }
        if (l3_side.main_data_begin * 8 != gfc.ResvSize) {
          System2.err.printf(
            "bit reservoir error: \nl3_side.main_data_begin: %d \nResvoir size:             %d \nresv drain (post)         %d \nresv drain (pre)          %d \nheader and sideinfo:      %d \ndata bits:                %d \ntotal bits:               %d (remainder: %d) \nbitsperframe:             %d \n",
            8 * l3_side.main_data_begin,
            gfc.ResvSize,
            l3_side.resvDrain_post,
            l3_side.resvDrain_pre,
            8 * gfc.sideinfo_len,
            bits - l3_side.resvDrain_post - 8 * gfc.sideinfo_len,
            bits,
            bits % 8,
            bitsPerFrame
          );
          System2.err.println("This is a fatal error.  It has several possible causes:");
          System2.err.println("90%%  LAME compiled with buggy version of gcc using advanced optimizations");
          System2.err.println(" 9%%  Your system is overclocked");
          System2.err.println(" 1%%  bug in LAME encoding library");
          gfc.ResvSize = l3_side.main_data_begin * 8;
        }
        if (totbit > 1e9) {
          var i;
          for (i = 0; i < LameInternalFlags2.MAX_HEADER_BUF; ++i)
            gfc.header[i].write_timing -= totbit;
          totbit = 0;
        }
        return 0;
      };
      this.copy_buffer = function(gfc, buffer, bufferPos, size, mp3data) {
        var minimum = bufByteIdx + 1;
        if (minimum <= 0)
          return 0;
        if (size != 0 && minimum > size) {
          return -1;
        }
        System2.arraycopy(buf, 0, buffer, bufferPos, minimum);
        bufByteIdx = -1;
        bufBitIdx = 0;
        if (mp3data != 0) {
          var crc = new_int2(1);
          crc[0] = gfc.nMusicCRC;
          vbr.updateMusicCRC(crc, buffer, bufferPos, minimum);
          gfc.nMusicCRC = crc[0];
          if (minimum > 0) {
            gfc.VBR_seek_table.nBytesWritten += minimum;
          }
          if (gfc.decode_on_the_fly) {
            var pcm_buf = new_float_n2([2, 1152]);
            var mp3_in = minimum;
            var samples_out = -1;
            var i;
            while (samples_out != 0) {
              samples_out = mpg.hip_decode1_unclipped(
                gfc.hip,
                buffer,
                bufferPos,
                mp3_in,
                pcm_buf[0],
                pcm_buf[1]
              );
              mp3_in = 0;
              if (samples_out == -1) {
                samples_out = 0;
              }
              if (samples_out > 0) {
                if (gfc.findPeakSample) {
                  for (i = 0; i < samples_out; i++) {
                    if (pcm_buf[0][i] > gfc.PeakSample)
                      gfc.PeakSample = pcm_buf[0][i];
                    else if (-pcm_buf[0][i] > gfc.PeakSample)
                      gfc.PeakSample = -pcm_buf[0][i];
                  }
                  if (gfc.channels_out > 1)
                    for (i = 0; i < samples_out; i++) {
                      if (pcm_buf[1][i] > gfc.PeakSample)
                        gfc.PeakSample = pcm_buf[1][i];
                      else if (-pcm_buf[1][i] > gfc.PeakSample)
                        gfc.PeakSample = -pcm_buf[1][i];
                    }
                }
                if (gfc.findReplayGain) {
                  if (ga.AnalyzeSamples(
                    gfc.rgdata,
                    pcm_buf[0],
                    0,
                    pcm_buf[1],
                    0,
                    samples_out,
                    gfc.channels_out
                  ) == GainAnalysis.GAIN_ANALYSIS_ERROR)
                    return -6;
                }
              }
            }
          }
        }
        return minimum;
      };
      this.init_bit_stream_w = function(gfc) {
        buf = new_byte2(Lame2.LAME_MAXMP3BUFFER);
        gfc.h_ptr = gfc.w_ptr = 0;
        gfc.header[gfc.h_ptr].write_timing = 0;
        bufByteIdx = -1;
        bufBitIdx = 0;
        totbit = 0;
      };
    }
    BitStream_1 = BitStream;
    return BitStream_1;
  }
  var Lame_1;
  var hasRequiredLame;
  function requireLame() {
    if (hasRequiredLame) return Lame_1;
    hasRequiredLame = 1;
    var common2 = common$h;
    var System2 = common2.System;
    var VbrMode2 = common2.VbrMode;
    var ShortBlock2 = common2.ShortBlock;
    var new_float2 = common2.new_float;
    var new_int_n2 = common2.new_int_n;
    var new_short_n2 = common2.new_short_n;
    var assert2 = common2.assert;
    var PsyModel2 = PsyModel_1;
    var LameGlobalFlags2 = LameGlobalFlags_1;
    var LameInternalFlags2 = LameInternalFlags_1;
    var ATH2 = ATH_1;
    var ReplayGain2 = ReplayGain_1;
    var CBRNewIterationLoop2 = CBRNewIterationLoop_1;
    var BitStream = requireBitStream();
    var Tables2 = Tables_1;
    var Encoder2 = requireEncoder();
    var MPEGMode2 = MPEGMode_1;
    function Lame2() {
      var self2 = this;
      var LAME_MAXALBUMART = 128 * 1024;
      Lame2.V9 = 410;
      Lame2.V8 = 420;
      Lame2.V7 = 430;
      Lame2.V6 = 440;
      Lame2.V5 = 450;
      Lame2.V4 = 460;
      Lame2.V3 = 470;
      Lame2.V2 = 480;
      Lame2.V1 = 490;
      Lame2.V0 = 500;
      Lame2.R3MIX = 1e3;
      Lame2.STANDARD = 1001;
      Lame2.EXTREME = 1002;
      Lame2.INSANE = 1003;
      Lame2.STANDARD_FAST = 1004;
      Lame2.EXTREME_FAST = 1005;
      Lame2.MEDIUM = 1006;
      Lame2.MEDIUM_FAST = 1007;
      var LAME_MAXMP3BUFFER = 16384 + LAME_MAXALBUMART;
      Lame2.LAME_MAXMP3BUFFER = LAME_MAXMP3BUFFER;
      var ga;
      var bs;
      var p2;
      var qupvt;
      var qu;
      var psy = new PsyModel2();
      var vbr;
      var id3;
      var mpglib;
      this.enc = new Encoder2();
      this.setModules = function(_ga, _bs, _p, _qupvt, _qu, _vbr, _ver, _id3, _mpglib) {
        ga = _ga;
        bs = _bs;
        p2 = _p;
        qupvt = _qupvt;
        qu = _qu;
        vbr = _vbr;
        id3 = _id3;
        mpglib = _mpglib;
        this.enc.setModules(bs, psy, qupvt, vbr);
      };
      function PSY() {
        this.mask_adjust = 0;
        this.mask_adjust_short = 0;
        this.bo_l_weight = new_float2(Encoder2.SBMAX_l);
        this.bo_s_weight = new_float2(Encoder2.SBMAX_s);
      }
      function LowPassHighPass() {
        this.lowerlimit = 0;
      }
      function BandPass(bitrate, lPass) {
        this.lowpass = lPass;
      }
      var LAME_ID = 4294479419;
      function lame_init_old(gfp) {
        var gfc;
        gfp.class_id = LAME_ID;
        gfc = gfp.internal_flags = new LameInternalFlags2();
        gfp.mode = MPEGMode2.NOT_SET;
        gfp.original = 1;
        gfp.in_samplerate = 44100;
        gfp.num_channels = 2;
        gfp.num_samples = -1;
        gfp.bWriteVbrTag = true;
        gfp.quality = -1;
        gfp.short_blocks = null;
        gfc.subblock_gain = -1;
        gfp.lowpassfreq = 0;
        gfp.highpassfreq = 0;
        gfp.lowpasswidth = -1;
        gfp.highpasswidth = -1;
        gfp.VBR = VbrMode2.vbr_off;
        gfp.VBR_q = 4;
        gfp.ATHcurve = -1;
        gfp.VBR_mean_bitrate_kbps = 128;
        gfp.VBR_min_bitrate_kbps = 0;
        gfp.VBR_max_bitrate_kbps = 0;
        gfp.VBR_hard_min = 0;
        gfc.VBR_min_bitrate = 1;
        gfc.VBR_max_bitrate = 13;
        gfp.quant_comp = -1;
        gfp.quant_comp_short = -1;
        gfp.msfix = -1;
        gfc.resample_ratio = 1;
        gfc.OldValue[0] = 180;
        gfc.OldValue[1] = 180;
        gfc.CurrentStep[0] = 4;
        gfc.CurrentStep[1] = 4;
        gfc.masking_lower = 1;
        gfc.nsPsy.attackthre = -1;
        gfc.nsPsy.attackthre_s = -1;
        gfp.scale = -1;
        gfp.athaa_type = -1;
        gfp.ATHtype = -1;
        gfp.athaa_loudapprox = -1;
        gfp.athaa_sensitivity = 0;
        gfp.useTemporal = null;
        gfp.interChRatio = -1;
        gfc.mf_samples_to_encode = Encoder2.ENCDELAY + Encoder2.POSTDELAY;
        gfp.encoder_padding = 0;
        gfc.mf_size = Encoder2.ENCDELAY - Encoder2.MDCTDELAY;
        gfp.findReplayGain = false;
        gfp.decode_on_the_fly = false;
        gfc.decode_on_the_fly = false;
        gfc.findReplayGain = false;
        gfc.findPeakSample = false;
        gfc.RadioGain = 0;
        gfc.AudiophileGain = 0;
        gfc.noclipGainChange = 0;
        gfc.noclipScale = -1;
        gfp.preset = 0;
        gfp.write_id3tag_automatic = true;
        return 0;
      }
      this.lame_init = function() {
        var gfp = new LameGlobalFlags2();
        lame_init_old(gfp);
        gfp.lame_allocated_gfp = 1;
        return gfp;
      };
      function filter_coef(x) {
        if (x > 1)
          return 0;
        if (x <= 0)
          return 1;
        return Math.cos(Math.PI / 2 * x);
      }
      this.nearestBitrateFullIndex = function(bitrate) {
        var full_bitrate_table = [
          8,
          16,
          24,
          32,
          40,
          48,
          56,
          64,
          80,
          96,
          112,
          128,
          160,
          192,
          224,
          256,
          320
        ];
        var lower_range = 0, lower_range_kbps = 0, upper_range = 0, upper_range_kbps = 0;
        upper_range_kbps = full_bitrate_table[16];
        upper_range = 16;
        lower_range_kbps = full_bitrate_table[16];
        lower_range = 16;
        for (var b = 0; b < 16; b++) {
          if (Math.max(bitrate, full_bitrate_table[b + 1]) != bitrate) {
            upper_range_kbps = full_bitrate_table[b + 1];
            upper_range = b + 1;
            lower_range_kbps = full_bitrate_table[b];
            lower_range = b;
            break;
          }
        }
        if (upper_range_kbps - bitrate > bitrate - lower_range_kbps) {
          return lower_range;
        }
        return upper_range;
      };
      function optimum_samplefreq(lowpassfreq, input_samplefreq) {
        var suggested_samplefreq = 44100;
        if (input_samplefreq >= 48e3)
          suggested_samplefreq = 48e3;
        else if (input_samplefreq >= 44100)
          suggested_samplefreq = 44100;
        else if (input_samplefreq >= 32e3)
          suggested_samplefreq = 32e3;
        else if (input_samplefreq >= 24e3)
          suggested_samplefreq = 24e3;
        else if (input_samplefreq >= 22050)
          suggested_samplefreq = 22050;
        else if (input_samplefreq >= 16e3)
          suggested_samplefreq = 16e3;
        else if (input_samplefreq >= 12e3)
          suggested_samplefreq = 12e3;
        else if (input_samplefreq >= 11025)
          suggested_samplefreq = 11025;
        else if (input_samplefreq >= 8e3)
          suggested_samplefreq = 8e3;
        if (lowpassfreq == -1)
          return suggested_samplefreq;
        if (lowpassfreq <= 15960)
          suggested_samplefreq = 44100;
        if (lowpassfreq <= 15250)
          suggested_samplefreq = 32e3;
        if (lowpassfreq <= 11220)
          suggested_samplefreq = 24e3;
        if (lowpassfreq <= 9970)
          suggested_samplefreq = 22050;
        if (lowpassfreq <= 7230)
          suggested_samplefreq = 16e3;
        if (lowpassfreq <= 5420)
          suggested_samplefreq = 12e3;
        if (lowpassfreq <= 4510)
          suggested_samplefreq = 11025;
        if (lowpassfreq <= 3970)
          suggested_samplefreq = 8e3;
        if (input_samplefreq < suggested_samplefreq) {
          if (input_samplefreq > 44100) {
            return 48e3;
          }
          if (input_samplefreq > 32e3) {
            return 44100;
          }
          if (input_samplefreq > 24e3) {
            return 32e3;
          }
          if (input_samplefreq > 22050) {
            return 24e3;
          }
          if (input_samplefreq > 16e3) {
            return 22050;
          }
          if (input_samplefreq > 12e3) {
            return 16e3;
          }
          if (input_samplefreq > 11025) {
            return 12e3;
          }
          if (input_samplefreq > 8e3) {
            return 11025;
          }
          return 8e3;
        }
        return suggested_samplefreq;
      }
      function SmpFrqIndex(sample_freq, gpf) {
        switch (sample_freq) {
          case 44100:
            gpf.version = 1;
            return 0;
          case 48e3:
            gpf.version = 1;
            return 1;
          case 32e3:
            gpf.version = 1;
            return 2;
          case 22050:
            gpf.version = 0;
            return 0;
          case 24e3:
            gpf.version = 0;
            return 1;
          case 16e3:
            gpf.version = 0;
            return 2;
          case 11025:
            gpf.version = 0;
            return 0;
          case 12e3:
            gpf.version = 0;
            return 1;
          case 8e3:
            gpf.version = 0;
            return 2;
          default:
            gpf.version = 0;
            return -1;
        }
      }
      function FindNearestBitrate(bRate, version, samplerate) {
        if (samplerate < 16e3)
          version = 2;
        var bitrate = Tables2.bitrate_table[version][1];
        for (var i = 2; i <= 14; i++) {
          if (Tables2.bitrate_table[version][i] > 0) {
            if (Math.abs(Tables2.bitrate_table[version][i] - bRate) < Math.abs(bitrate - bRate))
              bitrate = Tables2.bitrate_table[version][i];
          }
        }
        return bitrate;
      }
      function BitrateIndex(bRate, version, samplerate) {
        if (samplerate < 16e3)
          version = 2;
        for (var i = 0; i <= 14; i++) {
          if (Tables2.bitrate_table[version][i] > 0) {
            if (Tables2.bitrate_table[version][i] == bRate) {
              return i;
            }
          }
        }
        return -1;
      }
      function optimum_bandwidth(lh, bitrate) {
        var freq_map = [
          new BandPass(8, 2e3),
          new BandPass(16, 3700),
          new BandPass(24, 3900),
          new BandPass(32, 5500),
          new BandPass(40, 7e3),
          new BandPass(48, 7500),
          new BandPass(56, 1e4),
          new BandPass(64, 11e3),
          new BandPass(80, 13500),
          new BandPass(96, 15100),
          new BandPass(112, 15600),
          new BandPass(128, 17e3),
          new BandPass(160, 17500),
          new BandPass(192, 18600),
          new BandPass(224, 19400),
          new BandPass(256, 19700),
          new BandPass(320, 20500)
        ];
        var table_index = self2.nearestBitrateFullIndex(bitrate);
        lh.lowerlimit = freq_map[table_index].lowpass;
      }
      function lame_init_params_ppflt(gfp) {
        var gfc = gfp.internal_flags;
        var lowpass_band = 32;
        var highpass_band = -1;
        if (gfc.lowpass1 > 0) {
          var minband = 999;
          for (var band = 0; band <= 31; band++) {
            var freq = band / 31;
            if (freq >= gfc.lowpass2) {
              lowpass_band = Math.min(lowpass_band, band);
            }
            if (gfc.lowpass1 < freq && freq < gfc.lowpass2) {
              minband = Math.min(minband, band);
            }
          }
          if (minband == 999) {
            gfc.lowpass1 = (lowpass_band - 0.75) / 31;
          } else {
            gfc.lowpass1 = (minband - 0.75) / 31;
          }
          gfc.lowpass2 = lowpass_band / 31;
        }
        if (gfc.highpass2 > 0) {
          if (gfc.highpass2 < 0.9 * (0.75 / 31)) {
            gfc.highpass1 = 0;
            gfc.highpass2 = 0;
            System2.err.println("Warning: highpass filter disabled.  highpass frequency too small\n");
          }
        }
        if (gfc.highpass2 > 0) {
          var maxband = -1;
          for (var band = 0; band <= 31; band++) {
            var freq = band / 31;
            if (freq <= gfc.highpass1) {
              highpass_band = Math.max(highpass_band, band);
            }
            if (gfc.highpass1 < freq && freq < gfc.highpass2) {
              maxband = Math.max(maxband, band);
            }
          }
          gfc.highpass1 = highpass_band / 31;
          if (maxband == -1) {
            gfc.highpass2 = (highpass_band + 0.75) / 31;
          } else {
            gfc.highpass2 = (maxband + 0.75) / 31;
          }
        }
        for (var band = 0; band < 32; band++) {
          var fc1, fc2;
          var freq = band / 31;
          if (gfc.highpass2 > gfc.highpass1) {
            fc1 = filter_coef((gfc.highpass2 - freq) / (gfc.highpass2 - gfc.highpass1 + 1e-20));
          } else {
            fc1 = 1;
          }
          if (gfc.lowpass2 > gfc.lowpass1) {
            fc2 = filter_coef((freq - gfc.lowpass1) / (gfc.lowpass2 - gfc.lowpass1 + 1e-20));
          } else {
            fc2 = 1;
          }
          gfc.amp_filter[band] = fc1 * fc2;
        }
      }
      function lame_init_qval(gfp) {
        var gfc = gfp.internal_flags;
        switch (gfp.quality) {
          default:
          case 9:
            gfc.psymodel = 0;
            gfc.noise_shaping = 0;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 8:
            gfp.quality = 7;
          case 7:
            gfc.psymodel = 1;
            gfc.noise_shaping = 0;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 6:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 5:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 0;
            gfc.full_outer_loop = 0;
            break;
          case 4:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 0;
            gfc.noise_shaping_stop = 0;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 3:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            gfc.noise_shaping_amp = 1;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 2:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 1;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 1:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 2;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
          case 0:
            gfc.psymodel = 1;
            if (gfc.noise_shaping == 0)
              gfc.noise_shaping = 1;
            if (gfc.substep_shaping == 0)
              gfc.substep_shaping = 2;
            gfc.noise_shaping_amp = 2;
            gfc.noise_shaping_stop = 1;
            if (gfc.subblock_gain == -1)
              gfc.subblock_gain = 1;
            gfc.use_best_huffman = 1;
            gfc.full_outer_loop = 0;
            break;
        }
      }
      function lame_init_bitstream(gfp) {
        var gfc = gfp.internal_flags;
        gfp.frameNum = 0;
        if (gfp.write_id3tag_automatic) {
          id3.id3tag_write_v2(gfp);
        }
        gfc.bitrate_stereoMode_Hist = new_int_n2([16, 4 + 1]);
        gfc.bitrate_blockType_Hist = new_int_n2([16, 4 + 1 + 1]);
        gfc.PeakSample = 0;
        if (gfp.bWriteVbrTag)
          vbr.InitVbrTag(gfp);
      }
      this.lame_init_params = function(gfp) {
        var gfc = gfp.internal_flags;
        gfc.Class_ID = 0;
        if (gfc.ATH == null)
          gfc.ATH = new ATH2();
        if (gfc.PSY == null)
          gfc.PSY = new PSY();
        if (gfc.rgdata == null)
          gfc.rgdata = new ReplayGain2();
        gfc.channels_in = gfp.num_channels;
        if (gfc.channels_in == 1)
          gfp.mode = MPEGMode2.MONO;
        gfc.channels_out = gfp.mode == MPEGMode2.MONO ? 1 : 2;
        gfc.mode_ext = Encoder2.MPG_MD_MS_LR;
        if (gfp.mode == MPEGMode2.MONO)
          gfp.force_ms = false;
        if (gfp.VBR == VbrMode2.vbr_off && gfp.VBR_mean_bitrate_kbps != 128 && gfp.brate == 0)
          gfp.brate = gfp.VBR_mean_bitrate_kbps;
        if (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) ;
        else {
          gfp.free_format = false;
        }
        if (gfp.VBR == VbrMode2.vbr_off && gfp.brate == 0) {
          if (BitStream.EQ(gfp.compression_ratio, 0))
            gfp.compression_ratio = 11.025;
        }
        if (gfp.VBR == VbrMode2.vbr_off && gfp.compression_ratio > 0) {
          if (gfp.out_samplerate == 0)
            gfp.out_samplerate = map2MP3Frequency(int(0.97 * gfp.in_samplerate));
          gfp.brate = 0 | gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.compression_ratio);
          gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
          if (!gfp.free_format)
            gfp.brate = FindNearestBitrate(
              gfp.brate,
              gfp.version,
              gfp.out_samplerate
            );
        }
        if (gfp.out_samplerate != 0) {
          if (gfp.out_samplerate < 16e3) {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              8
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              64
            );
          } else if (gfp.out_samplerate < 32e3) {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              8
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              160
            );
          } else {
            gfp.VBR_mean_bitrate_kbps = Math.max(
              gfp.VBR_mean_bitrate_kbps,
              32
            );
            gfp.VBR_mean_bitrate_kbps = Math.min(
              gfp.VBR_mean_bitrate_kbps,
              320
            );
          }
        }
        if (gfp.lowpassfreq == 0) {
          var lowpass = 16e3;
          switch (gfp.VBR) {
            case VbrMode2.vbr_off: {
              var lh = new LowPassHighPass();
              optimum_bandwidth(lh, gfp.brate);
              lowpass = lh.lowerlimit;
              break;
            }
            case VbrMode2.vbr_abr: {
              var lh = new LowPassHighPass();
              optimum_bandwidth(lh, gfp.VBR_mean_bitrate_kbps);
              lowpass = lh.lowerlimit;
              break;
            }
            case VbrMode2.vbr_rh: {
              var x = [
                19500,
                19e3,
                18600,
                18e3,
                17500,
                16e3,
                15600,
                14900,
                12500,
                1e4,
                3950
              ];
              if (0 <= gfp.VBR_q && gfp.VBR_q <= 9) {
                var a = x[gfp.VBR_q], b = x[gfp.VBR_q + 1], m2 = gfp.VBR_q_frac;
                lowpass = linear_int(a, b, m2);
              } else {
                lowpass = 19500;
              }
              break;
            }
            default: {
              var x = [
                19500,
                19e3,
                18500,
                18e3,
                17500,
                16500,
                15500,
                14500,
                12500,
                9500,
                3950
              ];
              if (0 <= gfp.VBR_q && gfp.VBR_q <= 9) {
                var a = x[gfp.VBR_q], b = x[gfp.VBR_q + 1], m2 = gfp.VBR_q_frac;
                lowpass = linear_int(a, b, m2);
              } else {
                lowpass = 19500;
              }
            }
          }
          if (gfp.mode == MPEGMode2.MONO && (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_abr))
            lowpass *= 1.5;
          gfp.lowpassfreq = lowpass | 0;
        }
        if (gfp.out_samplerate == 0) {
          if (2 * gfp.lowpassfreq > gfp.in_samplerate) {
            gfp.lowpassfreq = gfp.in_samplerate / 2;
          }
          gfp.out_samplerate = optimum_samplefreq(
            gfp.lowpassfreq | 0,
            gfp.in_samplerate
          );
        }
        gfp.lowpassfreq = Math.min(20500, gfp.lowpassfreq);
        gfp.lowpassfreq = Math.min(gfp.out_samplerate / 2, gfp.lowpassfreq);
        if (gfp.VBR == VbrMode2.vbr_off) {
          gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
        }
        if (gfp.VBR == VbrMode2.vbr_abr) {
          gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
        }
        if (!gfp.bWriteVbrTag) {
          gfp.findReplayGain = false;
          gfp.decode_on_the_fly = false;
          gfc.findPeakSample = false;
        }
        gfc.findReplayGain = gfp.findReplayGain;
        gfc.decode_on_the_fly = gfp.decode_on_the_fly;
        if (gfc.decode_on_the_fly)
          gfc.findPeakSample = true;
        if (gfc.findReplayGain) {
          if (ga.InitGainAnalysis(gfc.rgdata, gfp.out_samplerate) == GainAnalysis.INIT_GAIN_ANALYSIS_ERROR) {
            gfp.internal_flags = null;
            return -6;
          }
        }
        if (gfc.decode_on_the_fly && !gfp.decode_only) {
          if (gfc.hip != null) {
            mpglib.hip_decode_exit(gfc.hip);
          }
          gfc.hip = mpglib.hip_decode_init();
        }
        gfc.mode_gr = gfp.out_samplerate <= 24e3 ? 1 : 2;
        gfp.framesize = 576 * gfc.mode_gr;
        gfp.encoder_delay = Encoder2.ENCDELAY;
        gfc.resample_ratio = gfp.in_samplerate / gfp.out_samplerate;
        switch (gfp.VBR) {
          case VbrMode2.vbr_mt:
          case VbrMode2.vbr_rh:
          case VbrMode2.vbr_mtrh:
            {
              var cmp = [
                5.7,
                6.5,
                7.3,
                8.2,
                10,
                11.9,
                13,
                14,
                15,
                16.5
              ];
              gfp.compression_ratio = cmp[gfp.VBR_q];
            }
            break;
          case VbrMode2.vbr_abr:
            gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
            break;
          default:
            gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
            break;
        }
        if (gfp.mode == MPEGMode2.NOT_SET) {
          gfp.mode = MPEGMode2.JOINT_STEREO;
        }
        if (gfp.highpassfreq > 0) {
          gfc.highpass1 = 2 * gfp.highpassfreq;
          if (gfp.highpasswidth >= 0)
            gfc.highpass2 = 2 * (gfp.highpassfreq + gfp.highpasswidth);
          else
            gfc.highpass2 = (1 + 0) * 2 * gfp.highpassfreq;
          gfc.highpass1 /= gfp.out_samplerate;
          gfc.highpass2 /= gfp.out_samplerate;
        } else {
          gfc.highpass1 = 0;
          gfc.highpass2 = 0;
        }
        if (gfp.lowpassfreq > 0) {
          gfc.lowpass2 = 2 * gfp.lowpassfreq;
          if (gfp.lowpasswidth >= 0) {
            gfc.lowpass1 = 2 * (gfp.lowpassfreq - gfp.lowpasswidth);
            if (gfc.lowpass1 < 0)
              gfc.lowpass1 = 0;
          } else {
            gfc.lowpass1 = (1 - 0) * 2 * gfp.lowpassfreq;
          }
          gfc.lowpass1 /= gfp.out_samplerate;
          gfc.lowpass2 /= gfp.out_samplerate;
        } else {
          gfc.lowpass1 = 0;
          gfc.lowpass2 = 0;
        }
        lame_init_params_ppflt(gfp);
        gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
        if (gfc.samplerate_index < 0) {
          gfp.internal_flags = null;
          return -1;
        }
        if (gfp.VBR == VbrMode2.vbr_off) {
          if (gfp.free_format) {
            gfc.bitrate_index = 0;
          } else {
            gfp.brate = FindNearestBitrate(
              gfp.brate,
              gfp.version,
              gfp.out_samplerate
            );
            gfc.bitrate_index = BitrateIndex(
              gfp.brate,
              gfp.version,
              gfp.out_samplerate
            );
            if (gfc.bitrate_index <= 0) {
              gfp.internal_flags = null;
              return -1;
            }
          }
        } else {
          gfc.bitrate_index = 1;
        }
        if (gfp.analysis)
          gfp.bWriteVbrTag = false;
        if (gfc.pinfo != null)
          gfp.bWriteVbrTag = false;
        bs.init_bit_stream_w(gfc);
        var j = gfc.samplerate_index + 3 * gfp.version + 6 * (gfp.out_samplerate < 16e3 ? 1 : 0);
        for (var i = 0; i < Encoder2.SBMAX_l + 1; i++)
          gfc.scalefac_band.l[i] = qupvt.sfBandIndex[j].l[i];
        for (var i = 0; i < Encoder2.PSFB21 + 1; i++) {
          var size = (gfc.scalefac_band.l[22] - gfc.scalefac_band.l[21]) / Encoder2.PSFB21;
          var start = gfc.scalefac_band.l[21] + i * size;
          gfc.scalefac_band.psfb21[i] = start;
        }
        gfc.scalefac_band.psfb21[Encoder2.PSFB21] = 576;
        for (var i = 0; i < Encoder2.SBMAX_s + 1; i++)
          gfc.scalefac_band.s[i] = qupvt.sfBandIndex[j].s[i];
        for (var i = 0; i < Encoder2.PSFB12 + 1; i++) {
          var size = (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) / Encoder2.PSFB12;
          var start = gfc.scalefac_band.s[12] + i * size;
          gfc.scalefac_band.psfb12[i] = start;
        }
        gfc.scalefac_band.psfb12[Encoder2.PSFB12] = 192;
        if (gfp.version == 1)
          gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 17 : 4 + 32;
        else
          gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 9 : 4 + 17;
        if (gfp.error_protection)
          gfc.sideinfo_len += 2;
        lame_init_bitstream(gfp);
        gfc.Class_ID = LAME_ID;
        {
          var k2;
          for (k2 = 0; k2 < 19; k2++)
            gfc.nsPsy.pefirbuf[k2] = 700 * gfc.mode_gr * gfc.channels_out;
          if (gfp.ATHtype == -1)
            gfp.ATHtype = 4;
        }
        assert2(gfp.VBR_q <= 9);
        assert2(gfp.VBR_q >= 0);
        switch (gfp.VBR) {
          case VbrMode2.vbr_mt:
            gfp.VBR = VbrMode2.vbr_mtrh;
          case VbrMode2.vbr_mtrh: {
            if (gfp.useTemporal == null) {
              gfp.useTemporal = false;
            }
            p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            if (gfp.quality < 5)
              gfp.quality = 0;
            if (gfp.quality > 5)
              gfp.quality = 5;
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (gfp.experimentalY)
              gfc.sfb21_extra = false;
            else
              gfc.sfb21_extra = gfp.out_samplerate > 44e3;
            gfc.iteration_loop = new VBRNewIterationLoop(qu);
            break;
          }
          case VbrMode2.vbr_rh: {
            p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (gfp.experimentalY)
              gfc.sfb21_extra = false;
            else
              gfc.sfb21_extra = gfp.out_samplerate > 44e3;
            if (gfp.quality > 6)
              gfp.quality = 6;
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            gfc.iteration_loop = new VBROldIterationLoop(qu);
            break;
          }
          default: {
            var vbrmode;
            gfc.sfb21_extra = false;
            if (gfp.quality < 0)
              gfp.quality = LAME_DEFAULT_QUALITY;
            vbrmode = gfp.VBR;
            if (vbrmode == VbrMode2.vbr_off)
              gfp.VBR_mean_bitrate_kbps = gfp.brate;
            p2.apply_preset(gfp, gfp.VBR_mean_bitrate_kbps, 0);
            gfp.VBR = vbrmode;
            gfc.PSY.mask_adjust = gfp.maskingadjust;
            gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
            if (vbrmode == VbrMode2.vbr_off) {
              gfc.iteration_loop = new CBRNewIterationLoop2(qu);
            } else {
              gfc.iteration_loop = new ABRIterationLoop(qu);
            }
            break;
          }
        }
        assert2(gfp.scale >= 0);
        if (gfp.VBR != VbrMode2.vbr_off) {
          gfc.VBR_min_bitrate = 1;
          gfc.VBR_max_bitrate = 14;
          if (gfp.out_samplerate < 16e3)
            gfc.VBR_max_bitrate = 8;
          if (gfp.VBR_min_bitrate_kbps != 0) {
            gfp.VBR_min_bitrate_kbps = FindNearestBitrate(
              gfp.VBR_min_bitrate_kbps,
              gfp.version,
              gfp.out_samplerate
            );
            gfc.VBR_min_bitrate = BitrateIndex(
              gfp.VBR_min_bitrate_kbps,
              gfp.version,
              gfp.out_samplerate
            );
            if (gfc.VBR_min_bitrate < 0)
              return -1;
          }
          if (gfp.VBR_max_bitrate_kbps != 0) {
            gfp.VBR_max_bitrate_kbps = FindNearestBitrate(
              gfp.VBR_max_bitrate_kbps,
              gfp.version,
              gfp.out_samplerate
            );
            gfc.VBR_max_bitrate = BitrateIndex(
              gfp.VBR_max_bitrate_kbps,
              gfp.version,
              gfp.out_samplerate
            );
            if (gfc.VBR_max_bitrate < 0)
              return -1;
          }
          gfp.VBR_min_bitrate_kbps = Tables2.bitrate_table[gfp.version][gfc.VBR_min_bitrate];
          gfp.VBR_max_bitrate_kbps = Tables2.bitrate_table[gfp.version][gfc.VBR_max_bitrate];
          gfp.VBR_mean_bitrate_kbps = Math.min(
            Tables2.bitrate_table[gfp.version][gfc.VBR_max_bitrate],
            gfp.VBR_mean_bitrate_kbps
          );
          gfp.VBR_mean_bitrate_kbps = Math.max(
            Tables2.bitrate_table[gfp.version][gfc.VBR_min_bitrate],
            gfp.VBR_mean_bitrate_kbps
          );
        }
        if (gfp.tune) {
          gfc.PSY.mask_adjust += gfp.tune_value_a;
          gfc.PSY.mask_adjust_short += gfp.tune_value_a;
        }
        lame_init_qval(gfp);
        assert2(gfp.scale >= 0);
        if (gfp.athaa_type < 0)
          gfc.ATH.useAdjust = 3;
        else
          gfc.ATH.useAdjust = gfp.athaa_type;
        gfc.ATH.aaSensitivityP = Math.pow(10, gfp.athaa_sensitivity / -10);
        if (gfp.short_blocks == null) {
          gfp.short_blocks = ShortBlock2.short_block_allowed;
        }
        if (gfp.short_blocks == ShortBlock2.short_block_allowed && (gfp.mode == MPEGMode2.JOINT_STEREO || gfp.mode == MPEGMode2.STEREO)) {
          gfp.short_blocks = ShortBlock2.short_block_coupled;
        }
        if (gfp.quant_comp < 0)
          gfp.quant_comp = 1;
        if (gfp.quant_comp_short < 0)
          gfp.quant_comp_short = 0;
        if (gfp.msfix < 0)
          gfp.msfix = 0;
        gfp.exp_nspsytune = gfp.exp_nspsytune | 1;
        if (gfp.internal_flags.nsPsy.attackthre < 0)
          gfp.internal_flags.nsPsy.attackthre = PsyModel2.NSATTACKTHRE;
        if (gfp.internal_flags.nsPsy.attackthre_s < 0)
          gfp.internal_flags.nsPsy.attackthre_s = PsyModel2.NSATTACKTHRE_S;
        assert2(gfp.scale >= 0);
        if (gfp.scale < 0)
          gfp.scale = 1;
        if (gfp.ATHtype < 0)
          gfp.ATHtype = 4;
        if (gfp.ATHcurve < 0)
          gfp.ATHcurve = 4;
        if (gfp.athaa_loudapprox < 0)
          gfp.athaa_loudapprox = 2;
        if (gfp.interChRatio < 0)
          gfp.interChRatio = 0;
        if (gfp.useTemporal == null)
          gfp.useTemporal = true;
        gfc.slot_lag = gfc.frac_SpF = 0;
        if (gfp.VBR == VbrMode2.vbr_off)
          gfc.slot_lag = gfc.frac_SpF = (gfp.version + 1) * 72e3 * gfp.brate % gfp.out_samplerate | 0;
        qupvt.iteration_init(gfp);
        psy.psymodel_init(gfp);
        assert2(gfp.scale >= 0);
        return 0;
      };
      function update_inbuffer_size(gfc, nsamples) {
        if (gfc.in_buffer_0 == null || gfc.in_buffer_nsamples < nsamples) {
          gfc.in_buffer_0 = new_float2(nsamples);
          gfc.in_buffer_1 = new_float2(nsamples);
          gfc.in_buffer_nsamples = nsamples;
        }
      }
      this.lame_encode_flush = function(gfp, mp3buffer, mp3bufferPos, mp3buffer_size) {
        var gfc = gfp.internal_flags;
        var buffer = new_short_n2([2, 1152]);
        var imp3 = 0, mp3count, mp3buffer_size_remaining;
        var end_padding;
        var frames_left;
        var samples_to_encode = gfc.mf_samples_to_encode - Encoder2.POSTDELAY;
        var mf_needed = calcNeeded(gfp);
        if (gfc.mf_samples_to_encode < 1) {
          return 0;
        }
        mp3count = 0;
        if (gfp.in_samplerate != gfp.out_samplerate) {
          samples_to_encode += 16 * gfp.out_samplerate / gfp.in_samplerate;
        }
        end_padding = gfp.framesize - samples_to_encode % gfp.framesize;
        if (end_padding < 576)
          end_padding += gfp.framesize;
        gfp.encoder_padding = end_padding;
        frames_left = (samples_to_encode + end_padding) / gfp.framesize;
        while (frames_left > 0 && imp3 >= 0) {
          var bunch = mf_needed - gfc.mf_size;
          var frame_num = gfp.frameNum;
          bunch *= gfp.in_samplerate;
          bunch /= gfp.out_samplerate;
          if (bunch > 1152)
            bunch = 1152;
          if (bunch < 1)
            bunch = 1;
          mp3buffer_size_remaining = mp3buffer_size - mp3count;
          if (mp3buffer_size == 0)
            mp3buffer_size_remaining = 0;
          imp3 = this.lame_encode_buffer(
            gfp,
            buffer[0],
            buffer[1],
            bunch,
            mp3buffer,
            mp3bufferPos,
            mp3buffer_size_remaining
          );
          mp3bufferPos += imp3;
          mp3count += imp3;
          frames_left -= frame_num != gfp.frameNum ? 1 : 0;
        }
        gfc.mf_samples_to_encode = 0;
        if (imp3 < 0) {
          return imp3;
        }
        mp3buffer_size_remaining = mp3buffer_size - mp3count;
        if (mp3buffer_size == 0)
          mp3buffer_size_remaining = 0;
        bs.flush_bitstream(gfp);
        imp3 = bs.copy_buffer(
          gfc,
          mp3buffer,
          mp3bufferPos,
          mp3buffer_size_remaining,
          1
        );
        if (imp3 < 0) {
          return imp3;
        }
        mp3bufferPos += imp3;
        mp3count += imp3;
        mp3buffer_size_remaining = mp3buffer_size - mp3count;
        if (mp3buffer_size == 0)
          mp3buffer_size_remaining = 0;
        if (gfp.write_id3tag_automatic) {
          id3.id3tag_write_v1(gfp);
          imp3 = bs.copy_buffer(
            gfc,
            mp3buffer,
            mp3bufferPos,
            mp3buffer_size_remaining,
            0
          );
          if (imp3 < 0) {
            return imp3;
          }
          mp3count += imp3;
        }
        return mp3count;
      };
      this.lame_encode_buffer = function(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
        var gfc = gfp.internal_flags;
        var in_buffer = [null, null];
        if (gfc.Class_ID != LAME_ID)
          return -3;
        if (nsamples == 0)
          return 0;
        update_inbuffer_size(gfc, nsamples);
        in_buffer[0] = gfc.in_buffer_0;
        in_buffer[1] = gfc.in_buffer_1;
        for (var i = 0; i < nsamples; i++) {
          in_buffer[0][i] = buffer_l[i];
          if (gfc.channels_in > 1)
            in_buffer[1][i] = buffer_r[i];
        }
        return lame_encode_buffer_sample(
          gfp,
          in_buffer[0],
          in_buffer[1],
          nsamples,
          mp3buf,
          mp3bufPos,
          mp3buf_size
        );
      };
      function calcNeeded(gfp) {
        var mf_needed = Encoder2.BLKSIZE + gfp.framesize - Encoder2.FFTOFFSET;
        mf_needed = Math.max(mf_needed, 512 + gfp.framesize - 32);
        return mf_needed;
      }
      function lame_encode_buffer_sample(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
        var gfc = gfp.internal_flags;
        var mp3size = 0, ret, i, ch, mf_needed;
        var mp3out;
        var mfbuf = [null, null];
        var in_buffer = [null, null];
        if (gfc.Class_ID != LAME_ID)
          return -3;
        if (nsamples == 0)
          return 0;
        mp3out = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 0);
        if (mp3out < 0)
          return mp3out;
        mp3bufPos += mp3out;
        mp3size += mp3out;
        in_buffer[0] = buffer_l;
        in_buffer[1] = buffer_r;
        if (BitStream.NEQ(gfp.scale, 0) && BitStream.NEQ(gfp.scale, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[0][i] *= gfp.scale;
            if (gfc.channels_out == 2)
              in_buffer[1][i] *= gfp.scale;
          }
        }
        if (BitStream.NEQ(gfp.scale_left, 0) && BitStream.NEQ(gfp.scale_left, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[0][i] *= gfp.scale_left;
          }
        }
        if (BitStream.NEQ(gfp.scale_right, 0) && BitStream.NEQ(gfp.scale_right, 1)) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[1][i] *= gfp.scale_right;
          }
        }
        if (gfp.num_channels == 2 && gfc.channels_out == 1) {
          for (i = 0; i < nsamples; ++i) {
            in_buffer[0][i] = 0.5 * (in_buffer[0][i] + in_buffer[1][i]);
            in_buffer[1][i] = 0;
          }
        }
        mf_needed = calcNeeded(gfp);
        mfbuf[0] = gfc.mfbuf[0];
        mfbuf[1] = gfc.mfbuf[1];
        var in_bufferPos = 0;
        while (nsamples > 0) {
          var in_buffer_ptr = [null, null];
          var n_in = 0;
          var n_out = 0;
          in_buffer_ptr[0] = in_buffer[0];
          in_buffer_ptr[1] = in_buffer[1];
          var inOut = new InOut();
          fill_buffer(
            gfp,
            mfbuf,
            in_buffer_ptr,
            in_bufferPos,
            nsamples,
            inOut
          );
          n_in = inOut.n_in;
          n_out = inOut.n_out;
          if (gfc.findReplayGain && !gfc.decode_on_the_fly) {
            if (ga.AnalyzeSamples(
              gfc.rgdata,
              mfbuf[0],
              gfc.mf_size,
              mfbuf[1],
              gfc.mf_size,
              n_out,
              gfc.channels_out
            ) == GainAnalysis.GAIN_ANALYSIS_ERROR)
              return -6;
          }
          nsamples -= n_in;
          in_bufferPos += n_in;
          if (gfc.channels_out == 2)
            ;
          gfc.mf_size += n_out;
          assert2(gfc.mf_size <= LameInternalFlags2.MFSIZE);
          if (gfc.mf_samples_to_encode < 1) {
            gfc.mf_samples_to_encode = Encoder2.ENCDELAY + Encoder2.POSTDELAY;
          }
          gfc.mf_samples_to_encode += n_out;
          if (gfc.mf_size >= mf_needed) {
            var buf_size = mp3buf_size - mp3size;
            if (mp3buf_size == 0)
              buf_size = 0;
            ret = lame_encode_frame(
              gfp,
              mfbuf[0],
              mfbuf[1],
              mp3buf,
              mp3bufPos,
              buf_size
            );
            if (ret < 0)
              return ret;
            mp3bufPos += ret;
            mp3size += ret;
            gfc.mf_size -= gfp.framesize;
            gfc.mf_samples_to_encode -= gfp.framesize;
            for (ch = 0; ch < gfc.channels_out; ch++)
              for (i = 0; i < gfc.mf_size; i++)
                mfbuf[ch][i] = mfbuf[ch][i + gfp.framesize];
          }
        }
        return mp3size;
      }
      function lame_encode_frame(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
        var ret = self2.enc.lame_encode_mp3_frame(
          gfp,
          inbuf_l,
          inbuf_r,
          mp3buf,
          mp3bufPos,
          mp3buf_size
        );
        gfp.frameNum++;
        return ret;
      }
      function InOut() {
        this.n_in = 0;
        this.n_out = 0;
      }
      function NumUsed() {
        this.num_used = 0;
      }
      function gcd(i, j) {
        return j != 0 ? gcd(j, i % j) : i;
      }
      function blackman(x, fcn, l2) {
        var wcn = Math.PI * fcn;
        x /= l2;
        if (x < 0)
          x = 0;
        if (x > 1)
          x = 1;
        var x2 = x - 0.5;
        var bkwn = 0.42 - 0.5 * Math.cos(2 * x * Math.PI) + 0.08 * Math.cos(4 * x * Math.PI);
        if (Math.abs(x2) < 1e-9)
          return wcn / Math.PI;
        else
          return bkwn * Math.sin(l2 * wcn * x2) / (Math.PI * l2 * x2);
      }
      function fill_buffer_resample(gfp, outbuf, outbufPos, desired_len, inbuf, in_bufferPos, len, num_used, ch) {
        var gfc = gfp.internal_flags;
        var i, j = 0, k2;
        var bpc = gfp.out_samplerate / gcd(gfp.out_samplerate, gfp.in_samplerate);
        if (bpc > LameInternalFlags2.BPC)
          bpc = LameInternalFlags2.BPC;
        var intratio = Math.abs(gfc.resample_ratio - Math.floor(0.5 + gfc.resample_ratio)) < 1e-4 ? 1 : 0;
        var fcn = 1 / gfc.resample_ratio;
        if (fcn > 1)
          fcn = 1;
        var filter_l = 31;
        if (0 == filter_l % 2)
          --filter_l;
        filter_l += intratio;
        var BLACKSIZE = filter_l + 1;
        if (gfc.fill_buffer_resample_init == 0) {
          gfc.inbuf_old[0] = new_float2(BLACKSIZE);
          gfc.inbuf_old[1] = new_float2(BLACKSIZE);
          for (i = 0; i <= 2 * bpc; ++i)
            gfc.blackfilt[i] = new_float2(BLACKSIZE);
          gfc.itime[0] = 0;
          gfc.itime[1] = 0;
          for (j = 0; j <= 2 * bpc; j++) {
            var sum = 0;
            var offset = (j - bpc) / (2 * bpc);
            for (i = 0; i <= filter_l; i++)
              sum += gfc.blackfilt[j][i] = blackman(
                i - offset,
                fcn,
                filter_l
              );
            for (i = 0; i <= filter_l; i++)
              gfc.blackfilt[j][i] /= sum;
          }
          gfc.fill_buffer_resample_init = 1;
        }
        var inbuf_old = gfc.inbuf_old[ch];
        for (k2 = 0; k2 < desired_len; k2++) {
          var time0;
          var joff;
          time0 = k2 * gfc.resample_ratio;
          j = 0 | Math.floor(time0 - gfc.itime[ch]);
          if (filter_l + j - filter_l / 2 >= len)
            break;
          var offset = time0 - gfc.itime[ch] - (j + 0.5 * (filter_l % 2));
          joff = 0 | Math.floor(offset * 2 * bpc + bpc + 0.5);
          var xvalue = 0;
          for (i = 0; i <= filter_l; ++i) {
            var j2 = 0 | i + j - filter_l / 2;
            var y;
            y = j2 < 0 ? inbuf_old[BLACKSIZE + j2] : inbuf[in_bufferPos + j2];
            xvalue += y * gfc.blackfilt[joff][i];
          }
          outbuf[outbufPos + k2] = xvalue;
        }
        num_used.num_used = Math.min(len, filter_l + j - filter_l / 2);
        gfc.itime[ch] += num_used.num_used - k2 * gfc.resample_ratio;
        if (num_used.num_used >= BLACKSIZE) {
          for (i = 0; i < BLACKSIZE; i++)
            inbuf_old[i] = inbuf[in_bufferPos + num_used.num_used + i - BLACKSIZE];
        } else {
          var n_shift = BLACKSIZE - num_used.num_used;
          for (i = 0; i < n_shift; ++i)
            inbuf_old[i] = inbuf_old[i + num_used.num_used];
          for (j = 0; i < BLACKSIZE; ++i, ++j)
            inbuf_old[i] = inbuf[in_bufferPos + j];
          assert2(j == num_used.num_used);
        }
        return k2;
      }
      function fill_buffer(gfp, mfbuf, in_buffer, in_bufferPos, nsamples, io) {
        var gfc = gfp.internal_flags;
        if (gfc.resample_ratio < 0.9999 || gfc.resample_ratio > 1.0001) {
          for (var ch = 0; ch < gfc.channels_out; ch++) {
            var numUsed = new NumUsed();
            io.n_out = fill_buffer_resample(
              gfp,
              mfbuf[ch],
              gfc.mf_size,
              gfp.framesize,
              in_buffer[ch],
              in_bufferPos,
              nsamples,
              numUsed,
              ch
            );
            io.n_in = numUsed.num_used;
          }
        } else {
          io.n_out = Math.min(gfp.framesize, nsamples);
          io.n_in = io.n_out;
          for (var i = 0; i < io.n_out; ++i) {
            mfbuf[0][gfc.mf_size + i] = in_buffer[0][in_bufferPos + i];
            if (gfc.channels_out == 2)
              mfbuf[1][gfc.mf_size + i] = in_buffer[1][in_bufferPos + i];
          }
        }
      }
    }
    Lame_1 = Lame2;
    return Lame_1;
  }
  requireLame();
  requireEncoder();
  requireLame();
  requireQuantizePVT();
  requireTakehiro();
  requireBitStream();
  requireEncoder();
  function fourccToInt(fourcc) {
    return fourcc.charCodeAt(0) << 24 | fourcc.charCodeAt(1) << 16 | fourcc.charCodeAt(2) << 8 | fourcc.charCodeAt(3);
  }
  fourccToInt("RIFF");
  fourccToInt("WAVE");
  fourccToInt("fmt ");
  fourccToInt("data");
  var recorderCore = { exports: {} };
  (function(module) {
    (function(factory) {
      var browser = typeof window == "object" && !!window.document;
      var win = browser ? window : Object;
      factory(win, browser);
      if (module.exports) {
        module.exports = win.Recorder;
      }
    })(function(Export, isBrowser) {
      var NOOP = function() {
      };
      var IsNum = function(v) {
        return typeof v == "number";
      };
      var Recorder2 = function(set) {
        return new initFn(set);
      };
      var LM = Recorder2.LM = "2024-04-09 19:15";
      var GitUrl = "https://github.com/xiangyuecn/Recorder";
      var RecTxt = "Recorder";
      var getUserMediaTxt = "getUserMedia";
      var srcSampleRateTxt = "srcSampleRate";
      var sampleRateTxt = "sampleRate";
      var bitRateTxt = "bitRate";
      var CatchTxt = "catch";
      var WRec2 = Export[RecTxt];
      if (WRec2 && WRec2.LM == LM) {
        WRec2.CLog(WRec2.i18n.$T("K8zP::重复导入{1}", 0, RecTxt), 3);
        return;
      }
      Recorder2.IsOpen = function() {
        var stream = Recorder2.Stream;
        if (stream) {
          var tracks = stream.getTracks && stream.getTracks() || stream.audioTracks || [];
          var track = tracks[0];
          if (track) {
            var state = track.readyState;
            return state == "live" || state == track.LIVE;
          }
        }
        return false;
      };
      Recorder2.BufferSize = 4096;
      Recorder2.Destroy = function() {
        CLog(RecTxt + " Destroy");
        Disconnect();
        for (var k2 in DestroyList) {
          DestroyList[k2]();
        }
      };
      var DestroyList = {};
      Recorder2.BindDestroy = function(key, call) {
        DestroyList[key] = call;
      };
      Recorder2.Support = function() {
        if (!isBrowser) return false;
        var scope = navigator.mediaDevices || {};
        if (!scope[getUserMediaTxt]) {
          scope = navigator;
          scope[getUserMediaTxt] || (scope[getUserMediaTxt] = scope.webkitGetUserMedia || scope.mozGetUserMedia || scope.msGetUserMedia);
        }
        if (!scope[getUserMediaTxt]) {
          return false;
        }
        Recorder2.Scope = scope;
        if (!Recorder2.GetContext()) {
          return false;
        }
        return true;
      };
      Recorder2.GetContext = function(tryNew) {
        if (!isBrowser) return null;
        var AC = window.AudioContext;
        if (!AC) {
          AC = window.webkitAudioContext;
        }
        if (!AC) {
          return null;
        }
        var ctx = Recorder2.Ctx;
        if (!ctx || ctx.state == "closed") {
          ctx = Recorder2.Ctx = new AC();
          Recorder2.NewCtxs = Recorder2.NewCtxs || [];
          Recorder2.BindDestroy("Ctx", function() {
            var ctx2 = Recorder2.Ctx;
            if (ctx2 && ctx2.close) {
              CloseCtx(ctx2);
              Recorder2.Ctx = 0;
            }
            var arr = Recorder2.NewCtxs;
            Recorder2.NewCtxs = [];
            for (var i = 0; i < arr.length; i++) CloseCtx(arr[i]);
          });
        }
        if (tryNew && ctx.close) {
          try {
            ctx = new AC();
            Recorder2.NewCtxs.push(ctx);
          } catch (e) {
            CLog("GetContext tryNew Error", 1, e);
          }
        }
        return ctx;
      };
      Recorder2.CloseNewCtx = function(ctx) {
        if (ctx && ctx != Recorder2.Ctx) {
          CloseCtx(ctx);
          var arr = Recorder2.NewCtxs || [], L = arr.length;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == ctx) {
              arr.splice(i, 1);
              break;
            }
          }
          CLog($T("mSxV::剩{1}个GetContext未close", 0, L + "-1=" + arr.length), arr.length ? 3 : 0);
        }
      };
      var CloseCtx = function(ctx) {
        if (ctx && ctx.close) {
          ctx._isC = 1;
          try {
            ctx.close();
          } catch (e) {
            CLog("ctx close err", 1, e);
          }
        }
      };
      var ResumeCtx = Recorder2.ResumeCtx = function(ctx, check, True, False) {
        var isEnd = 0, isBind = 0, isLsSC = 0, runC = 0, EL = "EventListener", Tag = "ResumeCtx ";
        var end = function(err, ok) {
          if (isBind) {
            bind();
          }
          if (!isEnd) {
            isEnd = 1;
            err && False(err, runC);
            ok && True(runC);
          }
          if (ok) {
            if (!ctx._LsSC && ctx["add" + EL]) ctx["add" + EL]("statechange", run);
            ctx._LsSC = 1;
            isLsSC = 1;
          }
        };
        var bind = function(add) {
          if (add && isBind) return;
          isBind = add ? 1 : 0;
          var types = ["focus", "mousedown", "mouseup", "touchstart", "touchend"];
          for (var i = 0; i < types.length; i++)
            window[(add ? "add" : "remove") + EL](types[i], run, true);
        };
        var run = function() {
          var sVal = ctx.state, spEnd = CtxSpEnd(sVal);
          if (!isEnd && !check(spEnd ? ++runC : runC)) return end();
          if (spEnd) {
            if (isLsSC) CLog(Tag + "sc " + sVal, 3);
            bind(1);
            ctx.resume().then(function() {
              if (isLsSC) CLog(Tag + "sc " + ctx.state);
              end(0, 1);
            })[CatchTxt](function(e) {
              CLog(Tag + "error", 1, e);
              if (!CtxSpEnd(ctx.state)) {
                end(e.message || "error");
              }
            });
          } else if (sVal == "closed") {
            if (isLsSC && !ctx._isC) CLog(Tag + "sc " + sVal, 1);
            end("ctx closed");
          } else {
            end(0, 1);
          }
        };
        run();
      };
      var CtxSpEnd = Recorder2.CtxSpEnd = function(v) {
        return v == "suspended" || v == "interrupted";
      };
      var CtxState = function(ctx) {
        var v = ctx.state, msg = "ctx.state=" + v;
        if (CtxSpEnd(v)) msg += $T("nMIy::（注意：ctx不是running状态，rec.open和start至少要有一个在用户操作(触摸、点击等)时进行调用，否则将在rec.start时尝试进行ctx.resume，可能会产生兼容性问题(仅iOS)，请参阅文档中runningContext配置）");
        return msg;
      };
      var ConnectEnableWebM = "ConnectEnableWebM";
      Recorder2[ConnectEnableWebM] = true;
      var ConnectEnableWorklet = "ConnectEnableWorklet";
      Recorder2[ConnectEnableWorklet] = false;
      var Connect = function(streamStore, isUserMedia) {
        var bufferSize = streamStore.BufferSize || Recorder2.BufferSize;
        var stream = streamStore.Stream;
        var ctx = stream._RC || stream._c || Recorder2.GetContext(true);
        stream._c = ctx;
        var mediaConn = function(node) {
          var media = stream._m = ctx.createMediaStreamSource(stream);
          var ctxDest = ctx.destination, cmsdTxt = "createMediaStreamDestination";
          if (ctx[cmsdTxt]) {
            ctxDest = stream._d = ctx[cmsdTxt]();
          }
          media.connect(node);
          node.connect(ctxDest);
        };
        var isWebM, isWorklet, badInt, webMTips = "";
        var calls = stream._call;
        var onReceive = function(float32Arr) {
          for (var k0 in calls) {
            var size = float32Arr.length;
            var pcm = new Int16Array(size);
            var sum = 0;
            for (var j = 0; j < size; j++) {
              var s = Math.max(-1, Math.min(1, float32Arr[j]));
              s = s < 0 ? s * 32768 : s * 32767;
              pcm[j] = s;
              sum += Math.abs(s);
            }
            for (var k2 in calls) {
              calls[k2](pcm, sum);
            }
            return;
          }
        };
        var scriptProcessor = "ScriptProcessor";
        var audioWorklet = "audioWorklet";
        var recAudioWorklet = RecTxt + " " + audioWorklet;
        var RecProc = "RecProc";
        var MediaRecorderTxt = "MediaRecorder";
        var MRWebMPCM = MediaRecorderTxt + ".WebM.PCM";
        var oldFn = ctx.createScriptProcessor || ctx.createJavaScriptNode;
        var oldIsBest = $T("ZGlf::。由于{1}内部1秒375次回调，在移动端可能会有性能问题导致回调丢失录音变短，PC端无影响，暂不建议开启{1}。", 0, audioWorklet);
        var oldScript = function() {
          isWorklet = stream.isWorklet = false;
          _Disconn_n(stream);
          CLog($T("7TU0::Connect采用老的{1}，", 0, scriptProcessor) + i18n.get(
            Recorder2[ConnectEnableWorklet] ? $T("JwCL::但已设置{1}尝试启用{2}", 2) : $T("VGjB::可设置{1}尝试启用{2}", 2),
            [RecTxt + "." + ConnectEnableWorklet + "=true", audioWorklet]
          ) + webMTips + oldIsBest, 3);
          var process = stream._p = oldFn.call(ctx, bufferSize, 1, 1);
          mediaConn(process);
          process.onaudioprocess = function(e) {
            var arr = e.inputBuffer.getChannelData(0);
            onReceive(arr);
          };
        };
        var connWorklet = function() {
          isWebM = stream.isWebM = false;
          _Disconn_r(stream);
          isWorklet = stream.isWorklet = !oldFn || Recorder2[ConnectEnableWorklet];
          var AwNode = window.AudioWorkletNode;
          if (!(isWorklet && ctx[audioWorklet] && AwNode)) {
            oldScript();
            return;
          }
          var clazzUrl = function() {
            var xf = function(f2) {
              return f2.toString().replace(/^function|DEL_/g, "").replace(/\$RA/g, recAudioWorklet);
            };
            var clazz = "class " + RecProc + " extends AudioWorkletProcessor{";
            clazz += "constructor " + xf(function(option) {
              DEL_super(option);
              var This = this, bufferSize2 = option.processorOptions.bufferSize;
              This.bufferSize = bufferSize2;
              This.buffer = new Float32Array(bufferSize2 * 2);
              This.pos = 0;
              This.port.onmessage = function(e) {
                if (e.data.kill) {
                  This.kill = true;
                  $C.log("$RA kill call");
                }
              };
              $C.log("$RA .ctor call", option);
            });
            clazz += "process " + xf(function(input, b, c) {
              var This = this, bufferSize2 = This.bufferSize;
              var buffer = This.buffer, pos = This.pos;
              input = (input[0] || [])[0] || [];
              if (input.length) {
                buffer.set(input, pos);
                pos += input.length;
                var len = ~~(pos / bufferSize2) * bufferSize2;
                if (len) {
                  this.port.postMessage({ val: buffer.slice(0, len) });
                  var more = buffer.subarray(len, pos);
                  buffer = new Float32Array(bufferSize2 * 2);
                  buffer.set(more);
                  pos = more.length;
                  This.buffer = buffer;
                }
                This.pos = pos;
              }
              return !This.kill;
            });
            clazz += '}try{registerProcessor("' + RecProc + '", ' + RecProc + ')}catch(e){$C.error("' + recAudioWorklet + ' Reg Error",e)}';
            clazz = clazz.replace(/\$C\./g, "console.");
            return "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(clazz)));
          };
          var awNext = function() {
            return isWorklet && stream._na;
          };
          var nodeAlive = stream._na = function() {
            if (badInt !== "") {
              clearTimeout(badInt);
              badInt = setTimeout(function() {
                badInt = 0;
                if (awNext()) {
                  CLog($T("MxX1::{1}未返回任何音频，恢复使用{2}", 0, audioWorklet, scriptProcessor), 3);
                  oldFn && oldScript();
                }
              }, 500);
            }
          };
          var createNode = function() {
            if (!awNext()) return;
            var node = stream._n = new AwNode(ctx, RecProc, {
              processorOptions: { bufferSize }
            });
            mediaConn(node);
            node.port.onmessage = function(e) {
              if (badInt) {
                clearTimeout(badInt);
                badInt = "";
              }
              if (awNext()) {
                onReceive(e.data.val);
              } else if (!isWorklet) {
                CLog($T("XUap::{1}多余回调", 0, audioWorklet), 3);
              }
            };
            CLog($T("yOta::Connect采用{1}，设置{2}可恢复老式{3}", 0, audioWorklet, RecTxt + "." + ConnectEnableWorklet + "=false", scriptProcessor) + webMTips + oldIsBest, 3);
          };
          var ctxOK = function() {
            if (!awNext()) return;
            if (ctx[RecProc]) {
              createNode();
              return;
            }
            var url = clazzUrl();
            ctx[audioWorklet].addModule(url).then(function(e) {
              if (!awNext()) return;
              ctx[RecProc] = 1;
              createNode();
              if (badInt) {
                nodeAlive();
              }
            })[CatchTxt](function(e) {
              CLog(audioWorklet + ".addModule Error", 1, e);
              awNext() && oldScript();
            });
          };
          ResumeCtx(ctx, function() {
            return awNext();
          }, ctxOK, ctxOK);
        };
        var connWebM = function() {
          var MR = window[MediaRecorderTxt];
          var onData = "ondataavailable";
          var webmType = "audio/webm; codecs=pcm";
          isWebM = stream.isWebM = Recorder2[ConnectEnableWebM];
          var supportMR = MR && onData in MR.prototype && MR.isTypeSupported(webmType);
          webMTips = supportMR ? "" : $T("VwPd::（此浏览器不支持{1}）", 0, MRWebMPCM);
          if (!isUserMedia || !isWebM || !supportMR) {
            connWorklet();
            return;
          }
          var mrNext = function() {
            return isWebM && stream._ra;
          };
          stream._ra = function() {
            if (badInt !== "") {
              clearTimeout(badInt);
              badInt = setTimeout(function() {
                if (mrNext()) {
                  CLog($T("vHnb::{1}未返回任何音频，降级使用{2}", 0, MediaRecorderTxt, audioWorklet), 3);
                  connWorklet();
                }
              }, 500);
            }
          };
          var mrSet = Object.assign({ mimeType: webmType }, Recorder2.ConnectWebMOptions);
          var mr = stream._r = new MR(stream, mrSet);
          var webmData = stream._rd = { sampleRate: ctx[sampleRateTxt] };
          mr[onData] = function(e) {
            var reader = new FileReader();
            reader.onloadend = function() {
              if (mrNext()) {
                var f32arr = WebM_Extract(new Uint8Array(reader.result), webmData);
                if (!f32arr) return;
                if (f32arr == -1) {
                  connWorklet();
                  return;
                }
                if (badInt) {
                  clearTimeout(badInt);
                  badInt = "";
                }
                onReceive(f32arr);
              } else if (!isWebM) {
                CLog($T("O9P7::{1}多余回调", 0, MediaRecorderTxt), 3);
              }
            };
            reader.readAsArrayBuffer(e.data);
          };
          mr.start(~~(bufferSize / 48));
          CLog($T("LMEm::Connect采用{1}，设置{2}可恢复使用{3}或老式{4}", 0, MRWebMPCM, RecTxt + "." + ConnectEnableWebM + "=false", audioWorklet, scriptProcessor));
        };
        connWebM();
      };
      var ConnAlive = function(stream) {
        if (stream._na) stream._na();
        if (stream._ra) stream._ra();
      };
      var _Disconn_n = function(stream) {
        stream._na = null;
        if (stream._n) {
          stream._n.port.postMessage({ kill: true });
          stream._n.disconnect();
          stream._n = null;
        }
      };
      var _Disconn_r = function(stream) {
        stream._ra = null;
        if (stream._r) {
          try {
            stream._r.stop();
          } catch (e) {
            CLog("mr stop err", 1, e);
          }
          stream._r = null;
        }
      };
      var Disconnect = function(streamStore) {
        streamStore = streamStore || Recorder2;
        var isGlobal = streamStore == Recorder2;
        var stream = streamStore.Stream;
        if (stream) {
          if (stream._m) {
            stream._m.disconnect();
            stream._m = null;
          }
          if (!stream._RC && stream._c) {
            Recorder2.CloseNewCtx(stream._c);
          }
          stream._RC = null;
          stream._c = null;
          if (stream._d) {
            StopS_(stream._d.stream);
            stream._d = null;
          }
          if (stream._p) {
            stream._p.disconnect();
            stream._p.onaudioprocess = stream._p = null;
          }
          _Disconn_n(stream);
          _Disconn_r(stream);
          if (isGlobal) {
            StopS_(stream);
          }
        }
        streamStore.Stream = 0;
      };
      var StopS_ = Recorder2.StopS_ = function(stream) {
        var tracks = stream.getTracks && stream.getTracks() || stream.audioTracks || [];
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.stop && track.stop();
        }
        stream.stop && stream.stop();
      };
      Recorder2.SampleData = function(pcmDatas, pcmSampleRate, newSampleRate, prevChunkInfo, option) {
        var Txt = "SampleData";
        prevChunkInfo || (prevChunkInfo = {});
        var index = prevChunkInfo.index || 0;
        var offset = prevChunkInfo.offset || 0;
        var filter = prevChunkInfo.filter;
        if (filter && filter.fn && filter.sr != pcmSampleRate) {
          filter = null;
          CLog($T("d48C::{1}的filter采样率变了，重设滤波", 0, Txt), 3);
        }
        if (!filter) {
          var freq = newSampleRate > pcmSampleRate * 3 / 4 ? 0 : newSampleRate / 2 * 3 / 4;
          filter = { fn: freq ? Recorder2.IIRFilter(true, pcmSampleRate, freq) : 0 };
        }
        filter.sr = pcmSampleRate;
        var filterFn = filter.fn;
        var frameNext = prevChunkInfo.frameNext || [];
        option || (option = {});
        var frameSize = option.frameSize || 1;
        if (option.frameType) {
          frameSize = option.frameType == "mp3" ? 1152 : 1;
        }
        var nLen = pcmDatas.length;
        if (index > nLen + 1) {
          CLog($T("tlbC::{1}似乎传入了未重置chunk {2}", 0, Txt, index + ">" + nLen), 3);
        }
        var size = 0;
        for (var i = index; i < nLen; i++) {
          size += pcmDatas[i].length;
        }
        size = Math.max(0, size - Math.floor(offset));
        var step = pcmSampleRate / newSampleRate;
        if (step > 1) {
          size = Math.floor(size / step);
        } else {
          step = 1;
          newSampleRate = pcmSampleRate;
        }
        size += frameNext.length;
        var res = new Int16Array(size);
        var idx = 0;
        for (var i = 0; i < frameNext.length; i++) {
          res[idx] = frameNext[i];
          idx++;
        }
        for (; index < nLen; index++) {
          var o = pcmDatas[index];
          var i = offset, il = o.length;
          var F = filterFn && filterFn.Embed, F1 = 0, F2 = 0, Fx = 0, Fy = 0;
          for (var i0 = 0, i2 = 0; i0 < il; i0++, i2++) {
            if (i2 < il) {
              if (F) {
                Fx = o[i2];
                Fy = F.b0 * Fx + F.b1 * F.x1 + F.b0 * F.x2 - F.a1 * F.y1 - F.a2 * F.y2;
                F.x2 = F.x1;
                F.x1 = Fx;
                F.y2 = F.y1;
                F.y1 = Fy;
              } else {
                Fy = filterFn ? filterFn(o[i2]) : o[i2];
              }
            }
            F1 = F2;
            F2 = Fy;
            if (i2 == 0) {
              i0--;
              continue;
            }
            var before = Math.floor(i);
            if (i0 != before) continue;
            var after = Math.ceil(i);
            var atPoint = i - before;
            var beforeVal = F1;
            var afterVal = after < il ? F2 : beforeVal;
            var val = beforeVal + (afterVal - beforeVal) * atPoint;
            if (val > 32767) val = 32767;
            else if (val < -32768) val = -32768;
            res[idx] = val;
            idx++;
            i += step;
          }
          offset = Math.max(0, i - il);
        }
        frameNext = null;
        var frameNextSize = res.length % frameSize;
        if (frameNextSize > 0) {
          var u8Pos = (res.length - frameNextSize) * 2;
          frameNext = new Int16Array(res.buffer.slice(u8Pos));
          res = new Int16Array(res.buffer.slice(0, u8Pos));
        }
        return {
          index,
          offset,
          filter,
          frameNext,
          sampleRate: newSampleRate,
          data: res
        };
      };
      Recorder2.IIRFilter = function(useLowPass, sampleRate, freq) {
        var ov = 2 * Math.PI * freq / sampleRate;
        var sn = Math.sin(ov);
        var cs = Math.cos(ov);
        var alpha = sn / 2;
        var a0 = 1 + alpha;
        var a1 = -2 * cs / a0;
        var a2 = (1 - alpha) / a0;
        if (useLowPass) {
          var b0 = (1 - cs) / 2 / a0;
          var b1 = (1 - cs) / a0;
        } else {
          var b0 = (1 + cs) / 2 / a0;
          var b1 = -(1 + cs) / a0;
        }
        var x1 = 0, x2 = 0, y = 0, y1 = 0, y2 = 0;
        var fn = function(x) {
          y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
          x2 = x1;
          x1 = x;
          y2 = y1;
          y1 = y;
          return y;
        };
        fn.Embed = { x1: 0, x2: 0, y1: 0, y2: 0, b0, b1, a1, a2 };
        return fn;
      };
      Recorder2.PowerLevel = function(pcmAbsSum, pcmLength) {
        var power = pcmAbsSum / pcmLength || 0;
        var level;
        if (power < 1251) {
          level = Math.round(power / 1250 * 10);
        } else {
          level = Math.round(Math.min(100, Math.max(0, (1 + Math.log(power / 1e4) / Math.log(10)) * 100)));
        }
        return level;
      };
      Recorder2.PowerDBFS = function(maxSample) {
        var val = Math.max(0.1, maxSample || 0), Pref = 32767;
        val = Math.min(val, Pref);
        val = 20 * Math.log(val / Pref) / Math.log(10);
        return Math.max(-100, Math.round(val));
      };
      Recorder2.CLog = function(msg, err) {
        if (typeof console != "object") return;
        var now = /* @__PURE__ */ new Date();
        var t = ("0" + now.getMinutes()).substr(-2) + ":" + ("0" + now.getSeconds()).substr(-2) + "." + ("00" + now.getMilliseconds()).substr(-3);
        var recID = this && this.envIn && this.envCheck && this.id;
        var arr = ["[" + t + " " + RecTxt + (recID ? ":" + recID : "") + "]" + msg];
        var a = arguments, cwe = Recorder2.CLog;
        var i = 2, fn = cwe.log || console.log;
        if (IsNum(err)) {
          fn = err == 1 ? cwe.error || console.error : err == 3 ? cwe.warn || console.warn : fn;
        } else {
          i = 1;
        }
        for (; i < a.length; i++) {
          arr.push(a[i]);
        }
        if (IsLoser) {
          fn && fn("[IsLoser]" + arr[0], arr.length > 1 ? arr : "");
        } else {
          fn.apply(console, arr);
        }
      };
      var CLog = function() {
        Recorder2.CLog.apply(this, arguments);
      };
      var IsLoser = true;
      try {
        IsLoser = !console.log.apply;
      } catch (e) {
      }
      var ID = 0;
      function initFn(set) {
        var This = this;
        This.id = ++ID;
        Traffic();
        var o = {
          type: "mp3",
          onProcess: NOOP
          //fn(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd) buffers=[[Int16,...],...]：缓冲的PCM数据，为从开始录音到现在的所有pcm片段；powerLevel：当前缓冲的音量级别0-100，bufferDuration：已缓冲时长，bufferSampleRate：缓冲使用的采样率（当type支持边录边转码(Worker)时，此采样率和设置的采样率相同，否则不一定相同）；newBufferIdx:本次回调新增的buffer起始索引；asyncEnd:fn() 如果onProcess是异步的(返回值为true时)，处理完成时需要调用此回调，如果不是异步的请忽略此参数，此方法回调时必须是真异步（不能真异步时需用setTimeout包裹）。onProcess返回值：如果返回true代表开启异步模式，在某些大量运算的场合异步是必须的，必须在异步处理完成时调用asyncEnd(不能真异步时需用setTimeout包裹)，在onProcess执行后新增的buffer会全部替换成空数组，因此本回调开头应立即将newBufferIdx到本次回调结尾位置的buffer全部保存到另外一个数组内，处理完成后写回buffers中本次回调的结尾位置。
          //*******高级设置******
          //,sourceStream:MediaStream Object
          //可选直接提供一个媒体流，从这个流中录制、实时处理音频数据（当前Recorder实例独享此流）；不提供时为普通的麦克风录音，由getUserMedia提供音频流（所有Recorder实例共享同一个流）
          //比如：audio、video标签dom节点的captureStream方法（实验特性，不同浏览器支持程度不高）返回的流；WebRTC中的remote流；自己创建的流等
          //注意：流内必须至少存在一条音轨(Audio Track)，比如audio标签必须等待到可以开始播放后才会有音轨，否则open会失败
          //,runningContext:AudioContext
          //可选提供一个state为running状态的AudioContext对象(ctx)；默认会在rec.open时自动创建一个新的ctx，无用户操作（触摸、点击等）时调用rec.open的ctx.state可能为suspended，会在rec.start时尝试进行ctx.resume，如果也无用户操作ctx.resume可能不会恢复成running状态（目前仅iOS上有此兼容性问题），导致无法去读取媒体流，这时请提前在用户操作时调用Recorder.GetContext(true)来得到一个running状态AudioContext（用完需调用CloseNewCtx(ctx)关闭）
          //,audioTrackSet:{ deviceId:"",groupId:"", autoGainControl:true, echoCancellation:true, noiseSuppression:true }
          //普通麦克风录音时getUserMedia方法的audio配置参数，比如指定设备id，回声消除、降噪开关；注意：提供的任何配置值都不一定会生效
          //由于麦克风是全局共享的，所以新配置后需要close掉以前的再重新open
          //更多参考: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
          //,disableEnvInFix:false 内部参数，禁用设备卡顿时音频输入丢失补偿功能
          //,takeoffEncodeChunk:NOOP //fn(chunkBytes) chunkBytes=[Uint8,...]：实时编码环境下接管编码器输出，当编码器实时编码出一块有效的二进制音频数据时实时回调此方法；参数为二进制的Uint8Array，就是编码出来的音频数据片段，所有的chunkBytes拼接在一起即为完整音频。本实现的想法最初由QQ2543775048提出
          //当提供此回调方法时，将接管编码器的数据输出，编码器内部将放弃存储生成的音频数据；如果当前编码器或环境不支持实时编码处理，将在open时直接走fail逻辑
          //因此提供此回调后调用stop方法将无法获得有效的音频数据，因为编码器内没有音频数据，因此stop时返回的blob将是一个字节长度为0的blob
          //大部分录音格式编码器都支持实时编码（边录边转码），比如mp3格式：会实时的将编码出来的mp3片段通过此方法回调，所有的chunkBytes拼接到一起即为完整的mp3，此种拼接的结果比mock方法实时生成的音质更加，因为天然避免了首尾的静默
          //不支持实时编码的录音格式不可以提供此回调（wav格式不支持，因为wav文件头中需要提供文件最终长度），提供了将在open时直接走fail逻辑
        };
        for (var k2 in set) {
          o[k2] = set[k2];
        }
        This.set = o;
        var vB = o[bitRateTxt], vS = o[sampleRateTxt];
        if (vB && !IsNum(vB) || vS && !IsNum(vS)) {
          This.CLog($T.G("IllegalArgs-1", [$T("VtS4::{1}和{2}必须是数值", 0, sampleRateTxt, bitRateTxt)]), 1, set);
        }
        o[bitRateTxt] = +vB || 16;
        o[sampleRateTxt] = +vS || 16e3;
        This.state = 0;
        This._S = 9;
        This.Sync = { O: 9, C: 9 };
      }
      Recorder2.Sync = {
        /*open*/
        O: 9,
        /*close*/
        C: 9
      };
      Recorder2.prototype = initFn.prototype = {
        CLog,
        _streamStore: function() {
          if (this.set.sourceStream) {
            return this;
          } else {
            return Recorder2;
          }
        },
        _streamCtx: function() {
          var m2 = this._streamStore().Stream;
          return m2 && m2._c;
        },
        open: function(True, False) {
          var This = this, set = This.set, streamStore = This._streamStore(), newCtx = 0;
          True = True || NOOP;
          var failCall = function(errMsg, isUserNotAllow) {
            isUserNotAllow = !!isUserNotAllow;
            This.CLog($T("5tWi::录音open失败：") + errMsg + ",isUserNotAllow:" + isUserNotAllow, 1);
            if (newCtx) Recorder2.CloseNewCtx(newCtx);
            False && False(errMsg, isUserNotAllow);
          };
          This._streamTag = getUserMediaTxt;
          var ok = function() {
            This.CLog("open ok, id:" + This.id + " stream:" + This._streamTag);
            True();
            This._SO = 0;
          };
          var Lock = streamStore.Sync;
          var lockOpen = ++Lock.O, lockClose = Lock.C;
          This._O = This._O_ = lockOpen;
          This._SO = This._S;
          var lockFail = function() {
            if (lockClose != Lock.C || !This._O) {
              var err = $T("dFm8::open被取消");
              if (lockOpen == Lock.O) {
                This.close();
              } else {
                err = $T("VtJO::open被中断");
              }
              failCall(err);
              return true;
            }
          };
          if (!isBrowser) {
            failCall($T.G("NonBrowser-1", ["open"]) + $T("EMJq::，可尝试使用RecordApp解决方案") + "(" + GitUrl + "/tree/master/app-support-sample)");
            return;
          }
          var checkMsg = This.envCheck({ envName: "H5", canProcess: true });
          if (checkMsg) {
            failCall($T("A5bm::不能录音：") + checkMsg);
            return;
          }
          if (set.sourceStream) {
            This._streamTag = "set.sourceStream";
            if (!Recorder2.GetContext()) {
              failCall($T("1iU7::不支持此浏览器从流中获取录音"));
              return;
            }
            Disconnect(streamStore);
            var stream = This.Stream = set.sourceStream;
            stream._RC = set.runningContext;
            stream._call = {};
            try {
              Connect(streamStore);
            } catch (e) {
              Disconnect(streamStore);
              failCall($T("BTW2::从流中打开录音失败：") + e.message);
              return;
            }
            ok();
            return;
          }
          var codeFail = function(code, msg) {
            try {
              window.top.a;
            } catch (e) {
              failCall($T("Nclz::无权录音(跨域，请尝试给iframe添加麦克风访问策略，如{1})", 0, 'allow="camera;microphone"'));
              return;
            }
            if (/Permission|Allow/i.test(code)) {
              failCall($T("gyO5::用户拒绝了录音权限"), true);
            } else if (window.isSecureContext === false) {
              failCall($T("oWNo::浏览器禁止不安全页面录音，可开启https解决"));
            } else if (/Found/i.test(code)) {
              failCall(msg + $T("jBa9::，无可用麦克风"));
            } else {
              failCall(msg);
            }
          };
          if (Recorder2.IsOpen()) {
            ok();
            return;
          }
          if (!Recorder2.Support()) {
            codeFail("", $T("COxc::此浏览器不支持录音"));
            return;
          }
          var ctx = set.runningContext;
          if (!ctx) ctx = newCtx = Recorder2.GetContext(true);
          var f1 = function(stream2) {
            setTimeout(function() {
              stream2._call = {};
              var oldStream = Recorder2.Stream;
              if (oldStream) {
                Disconnect();
                stream2._call = oldStream._call;
              }
              Recorder2.Stream = stream2;
              stream2._c = ctx;
              stream2._RC = set.runningContext;
              if (lockFail()) return;
              if (Recorder2.IsOpen()) {
                if (oldStream) This.CLog($T("upb8::发现同时多次调用open"), 1);
                Connect(streamStore, 1);
                ok();
              } else {
                failCall($T("Q1GA::录音功能无效：无音频流"));
              }
            }, 100);
          };
          var f2 = function(e) {
            var code = e.name || e.message || e.code + ":" + e;
            This.CLog($T("xEQR::请求录音权限错误"), 1, e);
            codeFail(code, $T("bDOG::无法录音：") + code);
          };
          var trackSet = set.audioTrackSet || {};
          trackSet[sampleRateTxt] = ctx[sampleRateTxt];
          var mSet = { audio: trackSet };
          try {
            var pro = Recorder2.Scope[getUserMediaTxt](mSet, f1, f2);
          } catch (e) {
            This.CLog(getUserMediaTxt, 3, e);
            mSet = { audio: true };
            pro = Recorder2.Scope[getUserMediaTxt](mSet, f1, f2);
          }
          This.CLog(getUserMediaTxt + "(" + JSON.stringify(mSet) + ") " + CtxState(ctx) + $T("RiWe::，未配置noiseSuppression和echoCancellation时浏览器可能会自动打开降噪和回声消除，移动端可能会降低系统播放音量（关闭录音后可恢复），请参阅文档中audioTrackSet配置") + "(" + GitUrl + ") LM:" + LM + " UA:" + navigator.userAgent);
          if (pro && pro.then) {
            pro.then(f1)[CatchTxt](f2);
          }
        },
        close: function(call) {
          call = call || NOOP;
          var This = this, streamStore = This._streamStore();
          This._stop();
          var sTag = " stream:" + This._streamTag;
          var Lock = streamStore.Sync;
          This._O = 0;
          if (This._O_ != Lock.O) {
            This.CLog($T("hWVz::close被忽略（因为同时open了多个rec，只有最后一个会真正close）") + sTag, 3);
            call();
            return;
          }
          Lock.C++;
          Disconnect(streamStore);
          This.CLog("close," + sTag);
          call();
        },
        mock: function(pcmData, pcmSampleRate) {
          var This = this;
          This._stop();
          This.isMock = 1;
          This.mockEnvInfo = null;
          This.buffers = [pcmData];
          This.recSize = pcmData.length;
          This._setSrcSR(pcmSampleRate);
          This._streamTag = "mock";
          return This;
        },
        _setSrcSR: function(sampleRate) {
          var This = this, set = This.set;
          var setSr = set[sampleRateTxt];
          if (setSr > sampleRate) {
            set[sampleRateTxt] = sampleRate;
          } else {
            setSr = 0;
          }
          This[srcSampleRateTxt] = sampleRate;
          This.CLog(srcSampleRateTxt + ": " + sampleRate + " set." + sampleRateTxt + ": " + set[sampleRateTxt] + (setSr ? " " + $T("UHvm::忽略") + ": " + setSr : ""), setSr ? 3 : 0);
        },
        envCheck: function(envInfo) {
          var errMsg, This = this, set = This.set;
          var tag = "CPU_BE";
          if (!errMsg && !Recorder2[tag] && typeof Int8Array == "function" && !new Int8Array(new Int32Array([1]).buffer)[0]) {
            Traffic(tag);
            errMsg = $T("Essp::不支持{1}架构", 0, tag);
          }
          if (!errMsg) {
            var type = set.type, hasFn = This[type + "_envCheck"];
            if (set.takeoffEncodeChunk) {
              if (!hasFn) {
                errMsg = $T("2XBl::{1}类型不支持设置takeoffEncodeChunk", 0, type) + (This[type] ? "" : $T("LG7e::(未加载编码器)"));
              } else if (!envInfo.canProcess) {
                errMsg = $T("7uMV::{1}环境不支持实时处理", 0, envInfo.envName);
              }
            }
            if (!errMsg && hasFn) {
              errMsg = This[type + "_envCheck"](envInfo, set);
            }
          }
          return errMsg || "";
        },
        envStart: function(mockEnvInfo, sampleRate) {
          var This = this, set = This.set;
          This.isMock = mockEnvInfo ? 1 : 0;
          This.mockEnvInfo = mockEnvInfo;
          This.buffers = [];
          This.recSize = 0;
          if (mockEnvInfo) {
            This._streamTag = "env$" + mockEnvInfo.envName;
          }
          This.state = 1;
          This.envInLast = 0;
          This.envInFirst = 0;
          This.envInFix = 0;
          This.envInFixTs = [];
          This._setSrcSR(sampleRate);
          This.engineCtx = 0;
          if (This[set.type + "_start"]) {
            var engineCtx = This.engineCtx = This[set.type + "_start"](set);
            if (engineCtx) {
              engineCtx.pcmDatas = [];
              engineCtx.pcmSize = 0;
            }
          }
        },
        envResume: function() {
          this.envInFixTs = [];
        },
        envIn: function(pcm, sum) {
          var This = this, set = This.set, engineCtx = This.engineCtx;
          if (This.state != 1) {
            if (!This.state) This.CLog("envIn at state=0", 3);
            return;
          }
          var bufferSampleRate = This[srcSampleRateTxt];
          var size = pcm.length;
          var powerLevel = Recorder2.PowerLevel(sum, size);
          var buffers = This.buffers;
          var bufferFirstIdx = buffers.length;
          buffers.push(pcm);
          var buffersThis = buffers;
          var bufferFirstIdxThis = bufferFirstIdx;
          var now = Date.now();
          var pcmTime = Math.round(size / bufferSampleRate * 1e3);
          This.envInLast = now;
          if (This.buffers.length == 1) {
            This.envInFirst = now - pcmTime;
          }
          var envInFixTs = This.envInFixTs;
          envInFixTs.splice(0, 0, { t: now, d: pcmTime });
          var tsInStart = now, tsPcm = 0;
          for (var i = 0; i < envInFixTs.length; i++) {
            var o = envInFixTs[i];
            if (now - o.t > 3e3) {
              envInFixTs.length = i;
              break;
            }
            tsInStart = o.t;
            tsPcm += o.d;
          }
          var tsInPrev = envInFixTs[1];
          var tsIn = now - tsInStart;
          var lost = tsIn - tsPcm;
          if (lost > tsIn / 3 && (tsInPrev && tsIn > 1e3 || envInFixTs.length >= 6)) {
            var addTime = now - tsInPrev.t - pcmTime;
            if (addTime > pcmTime / 5) {
              var fixOpen = !set.disableEnvInFix;
              This.CLog("[" + now + "]" + i18n.get(fixOpen ? $T("4Kfd::补偿{1}ms", 1) : $T("bM5i::未补偿{1}ms", 1), [addTime]), 3);
              This.envInFix += addTime;
              if (fixOpen) {
                var addPcm = new Int16Array(addTime * bufferSampleRate / 1e3);
                size += addPcm.length;
                buffers.push(addPcm);
              }
            }
          }
          var sizeOld = This.recSize, addSize = size;
          var bufferSize = sizeOld + addSize;
          This.recSize = bufferSize;
          if (engineCtx) {
            var chunkInfo = Recorder2.SampleData(buffers, bufferSampleRate, set[sampleRateTxt], engineCtx.chunkInfo);
            engineCtx.chunkInfo = chunkInfo;
            sizeOld = engineCtx.pcmSize;
            addSize = chunkInfo.data.length;
            bufferSize = sizeOld + addSize;
            engineCtx.pcmSize = bufferSize;
            buffers = engineCtx.pcmDatas;
            bufferFirstIdx = buffers.length;
            buffers.push(chunkInfo.data);
            bufferSampleRate = chunkInfo[sampleRateTxt];
          }
          var duration = Math.round(bufferSize / bufferSampleRate * 1e3);
          var bufferNextIdx = buffers.length;
          var bufferNextIdxThis = buffersThis.length;
          var asyncEnd = function() {
            var num = asyncBegin ? 0 : -addSize;
            var hasClear2 = buffers[0] == null;
            for (var i2 = bufferFirstIdx; i2 < bufferNextIdx; i2++) {
              var buffer = buffers[i2];
              if (buffer == null) {
                hasClear2 = 1;
              } else {
                num += buffer.length;
                if (engineCtx && buffer.length) {
                  This[set.type + "_encode"](engineCtx, buffer);
                }
              }
            }
            if (hasClear2 && engineCtx) {
              var i2 = bufferFirstIdxThis;
              if (buffersThis[0]) {
                i2 = 0;
              }
              for (; i2 < bufferNextIdxThis; i2++) {
                buffersThis[i2] = null;
              }
            }
            if (hasClear2) {
              num = asyncBegin ? addSize : 0;
              buffers[0] = null;
            }
            if (engineCtx) {
              engineCtx.pcmSize += num;
            } else {
              This.recSize += num;
            }
          };
          var asyncBegin = 0, procTxt = "rec.set.onProcess";
          try {
            asyncBegin = set.onProcess(buffers, powerLevel, duration, bufferSampleRate, bufferFirstIdx, asyncEnd);
          } catch (e) {
            console.error(procTxt + $T("gFUF::回调出错是不允许的，需保证不会抛异常"), e);
          }
          var slowT = Date.now() - now;
          if (slowT > 10 && This.envInFirst - now > 1e3) {
            This.CLog(procTxt + $T("2ghS::低性能，耗时{1}ms", 0, slowT), 3);
          }
          if (asyncBegin === true) {
            var hasClear = 0;
            for (var i = bufferFirstIdx; i < bufferNextIdx; i++) {
              if (buffers[i] == null) {
                hasClear = 1;
              } else {
                buffers[i] = new Int16Array(0);
              }
            }
            if (hasClear) {
              This.CLog($T("ufqH::未进入异步前不能清除buffers"), 3);
            } else {
              if (engineCtx) {
                engineCtx.pcmSize -= addSize;
              } else {
                This.recSize -= addSize;
              }
            }
          } else {
            asyncEnd();
          }
        },
        start: function() {
          var This = this;
          var isOpen = 1;
          if (This.set.sourceStream) {
            if (!This.Stream) {
              isOpen = 0;
            }
          } else if (!Recorder2.IsOpen()) {
            isOpen = 0;
          }
          if (!isOpen) {
            This.CLog($T("6WmN::start失败：未open"), 1);
            return;
          }
          var ctx = This._streamCtx();
          This.CLog($T("kLDN::start 开始录音，") + CtxState(ctx) + " stream:" + This._streamTag);
          This._stop();
          This.envStart(null, ctx[sampleRateTxt]);
          This.state = 3;
          if (This._SO && This._SO + 1 != This._S) {
            This.CLog($T("Bp2y::start被中断"), 3);
            return;
          }
          This._SO = 0;
          var end = function() {
            if (This.state == 3) {
              This.state = 1;
              This.resume();
            }
          };
          var tag = "AudioContext resume: ";
          ResumeCtx(ctx, function(runC) {
            runC && This.CLog(tag + "wait...");
            return This.state == 3;
          }, function(runC) {
            runC && This.CLog(tag + ctx.state);
            end();
          }, function(err) {
            This.CLog(tag + ctx.state + $T("upkE::，可能无法录音：") + err, 1);
            end();
          });
        },
        pause: function() {
          var This = this, stream = This._streamStore().Stream;
          if (This.state) {
            This.state = 2;
            This.CLog("pause");
            if (stream) delete stream._call[This.id];
          }
        },
        resume: function() {
          var This = this, stream = This._streamStore().Stream;
          var tag = "resume", tag3 = tag + "(wait ctx)";
          if (This.state == 3) {
            This.CLog(tag3);
          } else if (This.state) {
            This.state = 1;
            This.CLog(tag);
            This.envResume();
            if (stream) {
              stream._call[This.id] = function(pcm, sum) {
                if (This.state == 1) {
                  This.envIn(pcm, sum);
                }
              };
              ConnAlive(stream);
            }
            var ctx = This._streamCtx();
            if (ctx) {
              ResumeCtx(ctx, function(runC) {
                runC && This.CLog(tag3 + "...");
                return This.state == 1;
              }, function(runC) {
                runC && This.CLog(tag3 + ctx.state);
                ConnAlive(stream);
              }, function(err) {
                This.CLog(tag3 + ctx.state + "[err]" + err, 1);
              });
            }
          }
        },
        _stop: function(keepEngine) {
          var This = this, set = This.set;
          if (!This.isMock) {
            This._S++;
          }
          if (This.state) {
            This.pause();
            This.state = 0;
          }
          if (!keepEngine && This[set.type + "_stop"]) {
            This[set.type + "_stop"](This.engineCtx);
            This.engineCtx = 0;
          }
        },
        stop: function(True, False, autoClose) {
          var This = this, set = This.set, t1;
          var envInMS = This.envInLast - This.envInFirst, envInLen = envInMS && This.buffers.length;
          This.CLog($T("Xq4s::stop 和start时差:") + (envInMS ? envInMS + "ms " + $T("3CQP::补偿:") + This.envInFix + "ms envIn:" + envInLen + " fps:" + (envInLen / envInMS * 1e3).toFixed(1) : "-") + " stream:" + This._streamTag + " (" + GitUrl + ") LM:" + LM);
          var end = function() {
            This._stop();
            if (autoClose) {
              This.close();
            }
          };
          var err = function(msg) {
            This.CLog($T("u8JG::结束录音失败：") + msg, 1);
            False && False(msg);
            end();
          };
          var ok = function(blob, mime, duration2) {
            var tBlob = "blob", tABuf = "arraybuffer", tDT = "dataType", tDDT = "DefaultDataType";
            var dType = This[tDT] || Recorder2[tDDT] || tBlob, dTag = tDT + "=" + dType;
            var isAB = blob instanceof ArrayBuffer, dErr = 0;
            var dLen = isAB ? blob.byteLength : blob.size;
            if (dType == tABuf) {
              if (!isAB) dErr = 1;
            } else if (dType == tBlob) {
              if (typeof Blob != "function") {
                dErr = $T.G("NonBrowser-1", [dTag]) + $T("1skY::，请设置{1}", 0, RecTxt + "." + tDDT + '="' + tABuf + '"');
              } else {
                if (isAB) blob = new Blob([blob], { type: mime });
                if (!(blob instanceof Blob)) dErr = 1;
                mime = blob.type || mime;
              }
            } else {
              dErr = $T.G("NotSupport-1", [dTag]);
            }
            This.CLog($T("Wv7l::结束录音 编码花{1}ms 音频时长{2}ms 文件大小{3}b", 0, Date.now() - t1, duration2, dLen) + " " + dTag + "," + mime);
            if (dErr) {
              err(dErr != 1 ? dErr : $T("Vkbd::{1}编码器返回的不是{2}", 0, set.type, dType) + ", " + dTag);
              return;
            }
            if (set.takeoffEncodeChunk) {
              This.CLog($T("QWnr::启用takeoffEncodeChunk后stop返回的blob长度为0不提供音频数据"), 3);
            } else if (dLen < Math.max(50, duration2 / 5)) {
              err($T("Sz2H::生成的{1}无效", 0, set.type));
              return;
            }
            True && True(blob, duration2, mime);
            end();
          };
          if (!This.isMock) {
            var isCtxWait = This.state == 3;
            if (!This.state || isCtxWait) {
              err($T("wf9t::未开始录音") + (isCtxWait ? $T("Dl2c::，开始录音前无用户交互导致AudioContext未运行") : ""));
              return;
            }
          }
          This._stop(true);
          var size = This.recSize;
          if (!size) {
            err($T("Ltz3::未采集到录音"));
            return;
          }
          if (!This[set.type]) {
            err($T("xGuI::未加载{1}编码器，请尝试到{2}的src/engine内找到{1}的编码器并加载", 0, set.type, RecTxt));
            return;
          }
          if (This.isMock) {
            var checkMsg = This.envCheck(This.mockEnvInfo || { envName: "mock", canProcess: false });
            if (checkMsg) {
              err($T("AxOH::录音错误：") + checkMsg);
              return;
            }
          }
          var engineCtx = This.engineCtx;
          if (This[set.type + "_complete"] && engineCtx) {
            var duration = Math.round(engineCtx.pcmSize / set[sampleRateTxt] * 1e3);
            t1 = Date.now();
            This[set.type + "_complete"](engineCtx, function(blob, mime) {
              ok(blob, mime, duration);
            }, err);
            return;
          }
          t1 = Date.now();
          if (!This.buffers[0]) {
            err($T("xkKd::音频buffers被释放"));
            return;
          }
          var chunk = Recorder2.SampleData(This.buffers, This[srcSampleRateTxt], set[sampleRateTxt]);
          set[sampleRateTxt] = chunk[sampleRateTxt];
          var res = chunk.data;
          var duration = Math.round(res.length / set[sampleRateTxt] * 1e3);
          This.CLog($T("CxeT::采样:{1} 花:{2}ms", 0, size + "->" + res.length, Date.now() - t1));
          setTimeout(function() {
            t1 = Date.now();
            This[set.type](res, function(blob, mime) {
              ok(blob, mime, duration);
            }, function(msg) {
              err(msg);
            });
          });
        }
      };
      var WebM_Extract = function(inBytes, scope) {
        if (!scope.pos) {
          scope.pos = [0];
          scope.tracks = {};
          scope.bytes = [];
        }
        var tracks = scope.tracks, position = [scope.pos[0]];
        var endPos = function() {
          scope.pos[0] = position[0];
        };
        var sBL = scope.bytes.length;
        var bytes = new Uint8Array(sBL + inBytes.length);
        bytes.set(scope.bytes);
        bytes.set(inBytes, sBL);
        scope.bytes = bytes;
        if (!scope._ht) {
          readMatroskaVInt(bytes, position);
          readMatroskaBlock(bytes, position);
          if (!BytesEq(readMatroskaVInt(bytes, position), [24, 83, 128, 103])) {
            return;
          }
          readMatroskaVInt(bytes, position);
          while (position[0] < bytes.length) {
            var eid0 = readMatroskaVInt(bytes, position);
            var bytes0 = readMatroskaBlock(bytes, position);
            var pos0 = [0], audioIdx = 0;
            if (!bytes0) return;
            if (BytesEq(eid0, [22, 84, 174, 107])) {
              while (pos0[0] < bytes0.length) {
                var eid1 = readMatroskaVInt(bytes0, pos0);
                var bytes1 = readMatroskaBlock(bytes0, pos0);
                var pos1 = [0], track = { channels: 0, sampleRate: 0 };
                if (BytesEq(eid1, [174])) {
                  while (pos1[0] < bytes1.length) {
                    var eid2 = readMatroskaVInt(bytes1, pos1);
                    var bytes2 = readMatroskaBlock(bytes1, pos1);
                    var pos2 = [0];
                    if (BytesEq(eid2, [215])) {
                      var val = BytesInt(bytes2);
                      track.number = val;
                      tracks[val] = track;
                    } else if (BytesEq(eid2, [131])) {
                      var val = BytesInt(bytes2);
                      if (val == 1) track.type = "video";
                      else if (val == 2) {
                        track.type = "audio";
                        if (!audioIdx) scope.track0 = track;
                        track.idx = audioIdx++;
                      } else track.type = "Type-" + val;
                    } else if (BytesEq(eid2, [134])) {
                      var str = "";
                      for (var i = 0; i < bytes2.length; i++) {
                        str += String.fromCharCode(bytes2[i]);
                      }
                      track.codec = str;
                    } else if (BytesEq(eid2, [225])) {
                      while (pos2[0] < bytes2.length) {
                        var eid3 = readMatroskaVInt(bytes2, pos2);
                        var bytes3 = readMatroskaBlock(bytes2, pos2);
                        if (BytesEq(eid3, [181])) {
                          var val = 0, arr = new Uint8Array(bytes3.reverse()).buffer;
                          if (bytes3.length == 4) val = new Float32Array(arr)[0];
                          else if (bytes3.length == 8) val = new Float64Array(arr)[0];
                          else CLog("WebM Track !Float", 1, bytes3);
                          track[sampleRateTxt] = Math.round(val);
                        } else if (BytesEq(eid3, [98, 100])) track.bitDepth = BytesInt(bytes3);
                        else if (BytesEq(eid3, [159])) track.channels = BytesInt(bytes3);
                      }
                    }
                  }
                }
              }
              scope._ht = 1;
              CLog("WebM Tracks", tracks);
              endPos();
              break;
            }
          }
        }
        var track0 = scope.track0;
        if (!track0) return;
        if (track0.bitDepth == 16 && /FLOAT/i.test(track0.codec)) {
          track0.bitDepth = 32;
          CLog("WebM 16->32 bit", 3);
        }
        if (track0[sampleRateTxt] != scope[sampleRateTxt] || track0.bitDepth != 32 || track0.channels < 1 || !/(\b|_)PCM\b/i.test(track0.codec)) {
          scope.bytes = [];
          if (!scope.bad) CLog("WebM Track Unexpected", 3, scope);
          scope.bad = 1;
          return -1;
        }
        var datas = [], dataLen = 0;
        while (position[0] < bytes.length) {
          var eid1 = readMatroskaVInt(bytes, position);
          var bytes1 = readMatroskaBlock(bytes, position);
          if (!bytes1) break;
          if (BytesEq(eid1, [163])) {
            var trackNo = bytes1[0] & 15;
            var track = tracks[trackNo];
            if (!track) {
              CLog("WebM !Track" + trackNo, 1, tracks);
            } else if (track.idx === 0) {
              var u8arr = new Uint8Array(bytes1.length - 4);
              for (var i = 4; i < bytes1.length; i++) {
                u8arr[i - 4] = bytes1[i];
              }
              datas.push(u8arr);
              dataLen += u8arr.length;
            }
          }
          endPos();
        }
        if (dataLen) {
          var more = new Uint8Array(bytes.length - scope.pos[0]);
          more.set(bytes.subarray(scope.pos[0]));
          scope.bytes = more;
          scope.pos[0] = 0;
          var u8arr = new Uint8Array(dataLen);
          for (var i = 0, i2 = 0; i < datas.length; i++) {
            u8arr.set(datas[i], i2);
            i2 += datas[i].length;
          }
          var arr = new Float32Array(u8arr.buffer);
          if (track0.channels > 1) {
            var arr2 = [];
            for (var i = 0; i < arr.length; ) {
              arr2.push(arr[i]);
              i += track0.channels;
            }
            arr = new Float32Array(arr2);
          }
          return arr;
        }
      };
      var BytesEq = function(bytes1, bytes2) {
        if (!bytes1 || bytes1.length != bytes2.length) return false;
        if (bytes1.length == 1) return bytes1[0] == bytes2[0];
        for (var i = 0; i < bytes1.length; i++) {
          if (bytes1[i] != bytes2[i]) return false;
        }
        return true;
      };
      var BytesInt = function(bytes) {
        var s = "";
        for (var i = 0; i < bytes.length; i++) {
          var n2 = bytes[i];
          s += (n2 < 16 ? "0" : "") + n2.toString(16);
        }
        return parseInt(s, 16) || 0;
      };
      var readMatroskaVInt = function(arr, pos, trim) {
        var i = pos[0];
        if (i >= arr.length) return;
        var b0 = arr[i], b2 = ("0000000" + b0.toString(2)).substr(-8);
        var m2 = /^(0*1)(\d*)$/.exec(b2);
        if (!m2) return;
        var len = m2[1].length, val = [];
        if (i + len > arr.length) return;
        for (var i2 = 0; i2 < len; i2++) {
          val[i2] = arr[i];
          i++;
        }
        if (trim) val[0] = parseInt(m2[2] || "0", 2);
        pos[0] = i;
        return val;
      };
      var readMatroskaBlock = function(arr, pos) {
        var lenVal = readMatroskaVInt(arr, pos, 1);
        if (!lenVal) return;
        var len = BytesInt(lenVal);
        var i = pos[0], val = [];
        if (len < 2147483647) {
          if (i + len > arr.length) return;
          for (var i2 = 0; i2 < len; i2++) {
            val[i2] = arr[i];
            i++;
          }
        }
        pos[0] = i;
        return val;
      };
      var i18n = Recorder2.i18n = {
        lang: "zh-CN",
        alias: { "zh-CN": "zh", "en-US": "en" },
        locales: {},
        data: {},
        put: function(set, texts) {
          var tag = RecTxt + ".i18n.put: ";
          var overwrite = set.overwrite;
          overwrite = overwrite == null || overwrite;
          var lang = set.lang;
          lang = i18n.alias[lang] || lang;
          if (!lang) throw new Error(tag + "set.lang?");
          var locale = i18n.locales[lang];
          if (!locale) {
            locale = {};
            i18n.locales[lang] = locale;
          }
          var exp = /^([\w\-]+):/, m2;
          for (var i = 0; i < texts.length; i++) {
            var v = texts[i];
            m2 = exp.exec(v);
            if (!m2) {
              CLog(tag + "'key:'? " + v, 3, set);
              continue;
            }
            var key = m2[1], v = v.substr(key.length + 1);
            if (!overwrite && locale[key]) continue;
            locale[key] = v;
          }
        },
        get: function() {
          return i18n.v_G.apply(null, arguments);
        },
        v_G: function(key, args, lang) {
          args = args || [];
          lang = lang || i18n.lang;
          lang = i18n.alias[lang] || lang;
          var locale = i18n.locales[lang];
          var val = locale && locale[key] || "";
          if (!val && lang != "zh") {
            if (lang == "en") return i18n.v_G(key, args, "zh");
            return i18n.v_G(key, args, "en");
          }
          i18n.lastLang = lang;
          if (val == "=Empty") return "";
          return val.replace(/\{(\d+)(\!?)\}/g, function(v, a, b) {
            a = +a || 0;
            v = args[a - 1];
            if (a < 1 || a > args.length) {
              v = "{?}";
              CLog("i18n[" + key + "] no {" + a + "}: " + val, 3);
            }
            return b ? "" : v;
          });
        },
        $T: function() {
          return i18n.v_T.apply(null, arguments);
        },
        v_T: function() {
          var a = arguments, key = "", args = [], isArgs = 0, tag = RecTxt + ".i18n.$T:";
          var exp = /^([\w\-]*):/, m2;
          for (var i = 0; i < a.length; i++) {
            var v = a[i];
            if (i == 0) {
              m2 = exp.exec(v);
              key = m2 && m2[1];
              if (!key) throw new Error(tag + "0 'key:'?");
              v = v.substr(key.length + 1);
            }
            if (isArgs === -1) args.push(v);
            else if (isArgs) throw new Error(tag + " bad args");
            else if (v === 0) isArgs = -1;
            else if (IsNum(v)) {
              if (v < 1) throw new Error(tag + " bad args");
              isArgs = v;
            } else {
              var lang = i == 1 ? "en" : i ? "" : "zh";
              m2 = exp.exec(v);
              if (m2) {
                lang = m2[1] || lang;
                v = v.substr(m2[1].length + 1);
              }
              if (!m2 || !lang) throw new Error(tag + i + " 'lang:'?");
              i18n.put({ lang, overwrite: false }, [key + ":" + v]);
            }
          }
          if (!key) return "";
          if (isArgs > 0) return key;
          return i18n.v_G(key, args);
        }
      };
      var $T = i18n.$T;
      $T.G = i18n.get;
      $T("NonBrowser-1::非浏览器环境，不支持{1}", 1);
      $T("IllegalArgs-1::参数错误：{1}", 1);
      $T("NeedImport-2::调用{1}需要先导入{2}", 2);
      $T("NotSupport-1::不支持：{1}", 1);
      Recorder2.TrafficImgUrl = "//ia.51.la/go1?id=20469973&pvFlag=1";
      var Traffic = Recorder2.Traffic = function(report) {
        if (!isBrowser) return;
        report = report ? "/" + RecTxt + "/Report/" + report : "";
        var imgUrl = Recorder2.TrafficImgUrl;
        if (imgUrl) {
          var data = Recorder2.Traffic;
          var m2 = /^(https?:..[^\/#]*\/?)[^#]*/i.exec(location.href) || [];
          var host = m2[1] || "http://file/";
          var idf = (m2[0] || host) + report;
          if (imgUrl.indexOf("//") == 0) {
            if (/^https:/i.test(idf)) {
              imgUrl = "https:" + imgUrl;
            } else {
              imgUrl = "http:" + imgUrl;
            }
          }
          if (report) {
            imgUrl = imgUrl + "&cu=" + encodeURIComponent(host + report);
          }
          if (!data[idf]) {
            data[idf] = 1;
            var img = new Image();
            img.src = imgUrl;
            CLog("Traffic Analysis Image: " + (report || RecTxt + ".TrafficImgUrl=" + Recorder2.TrafficImgUrl));
          }
        }
      };
      if (WRec2) {
        CLog($T("8HO5::覆盖导入{1}", 0, RecTxt), 1);
        WRec2.Destroy();
      }
      Export[RecTxt] = Recorder2;
    });
  })(recorderCore);
  var recorderCoreExports = recorderCore.exports;
  const Recorder = /* @__PURE__ */ getDefaultExportFromCjs(recorderCoreExports);
  (function(factory) {
    var browser = typeof window == "object" && !!window.document;
    var win = browser ? window : Object;
    var rec = win.Recorder, ni = rec.i18n;
    factory(rec, ni, ni.$T, browser);
  })(function(Recorder2, i18n, $T, isBrowser) {
    var SampleS = "48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000";
    var BitS = "8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 192, 224, 256, 320";
    Recorder2.prototype.enc_mp3 = {
      stable: true,
      takeEC: "full",
      getTestMsg: function() {
        return $T("Zm7L::采样率范围：{1}；比特率范围：{2}（不同比特率支持的采样率范围不同，小于32kbps时采样率需小于32000）", 0, SampleS, BitS);
      }
    };
    var NormalizeSet = function(set) {
      var bS = set.bitRate, sS = set.sampleRate, s = sS;
      if ((" " + BitS + ",").indexOf(" " + bS + ",") == -1) {
        Recorder2.CLog($T("eGB9::{1}不在mp3支持的取值范围：{2}", 0, "bitRate=" + bS, BitS), 3);
      }
      if ((" " + SampleS + ",").indexOf(" " + sS + ",") == -1) {
        var arr = SampleS.split(", "), vs = [];
        for (var i = 0; i < arr.length; i++) vs.push({ v: +arr[i], s: Math.abs(arr[i] - sS) });
        vs.sort(function(a, b) {
          return a.s - b.s;
        });
        s = vs[0].v;
        set.sampleRate = s;
        Recorder2.CLog($T("zLTa::sampleRate已更新为{1}，因为{2}不在mp3支持的取值范围：{3}", 0, s, sS, SampleS), 3);
      }
    };
    var ImportEngineErr = function() {
      return $T.G("NeedImport-2", ["mp3.js", "src/engine/mp3-engine.js"]);
    };
    var HasWebWorker = isBrowser && typeof Worker == "function";
    Recorder2.prototype.mp3 = function(res, True, False) {
      var This = this, set = This.set, size = res.length;
      if (!Recorder2.lamejs) {
        False(ImportEngineErr());
        return;
      }
      if (HasWebWorker) {
        var ctx = This.mp3_start(set);
        if (ctx) {
          if (ctx.isW) {
            This.mp3_encode(ctx, res);
            This.mp3_complete(ctx, True, False, 1);
            return;
          }
          This.mp3_stop(ctx);
        }
      }
      NormalizeSet(set);
      var mp3 = new Recorder2.lamejs.Mp3Encoder(1, set.sampleRate, set.bitRate);
      var blockSize = 57600;
      var memory = new Int8Array(5e5), mOffset = 0;
      var idx = 0, isFlush = 0;
      var run = function() {
        try {
          if (idx < size) {
            var buf = mp3.encodeBuffer(res.subarray(idx, idx + blockSize));
          } else {
            isFlush = 1;
            var buf = mp3.flush();
          }
          ;
        } catch (e) {
          console.error(e);
          if (!isFlush) try {
            mp3.flush();
          } catch (r) {
            console.error(r);
          }
          False("MP3 Encoder: " + e.message);
          return;
        }
        var bufLen = buf.length;
        if (bufLen > 0) {
          if (mOffset + bufLen > memory.length) {
            var tmp = new Int8Array(memory.length + Math.max(5e5, bufLen));
            tmp.set(memory.subarray(0, mOffset));
            memory = tmp;
          }
          memory.set(buf, mOffset);
          mOffset += bufLen;
        }
        if (idx < size) {
          idx += blockSize;
          setTimeout(run);
        } else {
          var data = [memory.buffer.slice(0, mOffset)];
          var meta = mp3TrimFix.fn(data, mOffset, size, set.sampleRate);
          mp3TrimFixSetMeta(meta, set);
          True(data[0] || new ArrayBuffer(0), "audio/mp3");
        }
      };
      run();
    };
    var mp3Worker;
    Recorder2.BindDestroy("mp3Worker", function() {
      if (mp3Worker) {
        Recorder2.CLog("mp3Worker Destroy");
        mp3Worker.terminate();
        mp3Worker = null;
      }
    });
    Recorder2.prototype.mp3_envCheck = function(envInfo, set) {
      var errMsg = "";
      if (set.takeoffEncodeChunk) {
        if (!newContext()) {
          errMsg = $T("yhUs::当前浏览器版本太低，无法实时处理");
        }
      }
      if (!errMsg && !Recorder2.lamejs) {
        errMsg = ImportEngineErr();
      }
      return errMsg;
    };
    Recorder2.prototype.mp3_start = function(set) {
      return newContext(set);
    };
    var openList = { id: 0 };
    var newContext = function(setOrNull, _badW) {
      var run = function(e) {
        var ed = e.data;
        var wk_ctxs = scope.wkScope.wk_ctxs;
        var wk_lame = scope.wkScope.wk_lame;
        var wk_mp3TrimFix = scope.wkScope.wk_mp3TrimFix;
        var cur = wk_ctxs[ed.id];
        if (ed.action == "init") {
          wk_ctxs[ed.id] = {
            sampleRate: ed.sampleRate,
            bitRate: ed.bitRate,
            takeoff: ed.takeoff,
            pcmSize: 0,
            memory: new Int8Array(5e5),
            mOffset: 0,
            encObj: new wk_lame.Mp3Encoder(1, ed.sampleRate, ed.bitRate)
          };
        } else if (!cur) {
          return;
        }
        var addBytes = function(buf2) {
          var bufLen = buf2.length;
          if (cur.mOffset + bufLen > cur.memory.length) {
            var tmp = new Int8Array(cur.memory.length + Math.max(5e5, bufLen));
            tmp.set(cur.memory.subarray(0, cur.mOffset));
            cur.memory = tmp;
          }
          cur.memory.set(buf2, cur.mOffset);
          cur.mOffset += bufLen;
        };
        switch (ed.action) {
          case "stop":
            if (!cur.isCp) try {
              cur.encObj.flush();
            } catch (e2) {
              console.error(e2);
            }
            cur.encObj = null;
            delete wk_ctxs[ed.id];
            break;
          case "encode":
            if (cur.isCp) break;
            cur.pcmSize += ed.pcm.length;
            try {
              var buf = cur.encObj.encodeBuffer(ed.pcm);
            } catch (e2) {
              cur.err = e2;
              console.error(e2);
            }
            if (buf && buf.length > 0) {
              if (cur.takeoff) {
                worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
              } else {
                addBytes(buf);
              }
            }
            break;
          case "complete":
            cur.isCp = 1;
            try {
              var buf = cur.encObj.flush();
            } catch (e2) {
              cur.err = e2;
              console.error(e2);
            }
            if (buf && buf.length > 0) {
              if (cur.takeoff) {
                worker.onmessage({ action: "takeoff", id: ed.id, chunk: buf });
              } else {
                addBytes(buf);
              }
            }
            if (cur.err) {
              worker.onmessage({
                action: ed.action,
                id: ed.id,
                err: "MP3 Encoder: " + cur.err.message
              });
              break;
            }
            var data = [cur.memory.buffer.slice(0, cur.mOffset)];
            var meta = wk_mp3TrimFix.fn(data, cur.mOffset, cur.pcmSize, cur.sampleRate);
            worker.onmessage({
              action: ed.action,
              id: ed.id,
              blob: data[0] || new ArrayBuffer(0),
              meta
            });
            break;
        }
      };
      var initOnMsg = function(isW) {
        worker.onmessage = function(e) {
          var data = e;
          if (isW) data = e.data;
          var ctx2 = openList[data.id];
          if (ctx2) {
            if (data.action == "takeoff") {
              ctx2.set.takeoffEncodeChunk(new Uint8Array(data.chunk.buffer));
            } else {
              ctx2.call && ctx2.call(data);
              ctx2.call = null;
            }
          }
        };
      };
      var initCtx = function() {
        var ctx2 = { worker, set: setOrNull };
        if (setOrNull) {
          ctx2.id = ++openList.id;
          openList[ctx2.id] = ctx2;
          NormalizeSet(setOrNull);
          worker.postMessage({
            action: "init",
            id: ctx2.id,
            sampleRate: setOrNull.sampleRate,
            bitRate: setOrNull.bitRate,
            takeoff: !!setOrNull.takeoffEncodeChunk,
            x: new Int16Array(5)
            //低版本浏览器不支持序列化TypedArray
          });
        } else {
          worker.postMessage({
            x: new Int16Array(5)
            //低版本浏览器不支持序列化TypedArray
          });
        }
        return ctx2;
      };
      var scope, worker = mp3Worker;
      if (_badW || !HasWebWorker) {
        Recorder2.CLog($T("k9PT::当前环境不支持Web Worker，mp3实时编码器运行在主线程中"), 3);
        worker = { postMessage: function(ed) {
          run({ data: ed });
        } };
        scope = { wkScope: {
          wk_ctxs: {},
          wk_lame: Recorder2.lamejs,
          wk_mp3TrimFix: mp3TrimFix
        } };
        initOnMsg();
        return initCtx();
      }
      try {
        if (!worker) {
          var onmsg = (run + "").replace(/[\w\$]+\.onmessage/g, "self.postMessage");
          onmsg = onmsg.replace(/[\w\$]+\.wkScope/g, "wkScope");
          var jsCode = ");wk_lame();self.onmessage=" + onmsg;
          jsCode += ";var wkScope={ wk_ctxs:{},wk_lame:wk_lame";
          jsCode += ",wk_mp3TrimFix:{rm:" + mp3TrimFix.rm + ",fn:" + mp3TrimFix.fn + "} }";
          var lamejsCode = Recorder2.lamejs.toString();
          var url = (window.URL || webkitURL).createObjectURL(new Blob(["var wk_lame=(", lamejsCode, jsCode], { type: "text/javascript" }));
          worker = new Worker(url);
          setTimeout(function() {
            (window.URL || webkitURL).revokeObjectURL(url);
          }, 1e4);
          initOnMsg(1);
        }
        ;
        var ctx = initCtx();
        ctx.isW = 1;
        mp3Worker = worker;
        return ctx;
      } catch (e) {
        worker && worker.terminate();
        console.error(e);
        return newContext(setOrNull, 1);
      }
    };
    Recorder2.prototype.mp3_stop = function(startCtx) {
      if (startCtx && startCtx.worker) {
        startCtx.worker.postMessage({
          action: "stop",
          id: startCtx.id
        });
        startCtx.worker = null;
        delete openList[startCtx.id];
        var opens = -1;
        for (var k2 in openList) {
          opens++;
        }
        if (opens) {
          Recorder2.CLog($T("fT6M::mp3 worker剩{1}个未stop", 0, opens), 3);
        }
      }
    };
    Recorder2.prototype.mp3_encode = function(startCtx, pcm) {
      if (startCtx && startCtx.worker) {
        startCtx.worker.postMessage({
          action: "encode",
          id: startCtx.id,
          pcm
        });
      }
    };
    Recorder2.prototype.mp3_complete = function(startCtx, True, False, autoStop) {
      var This = this;
      if (startCtx && startCtx.worker) {
        startCtx.call = function(data) {
          if (autoStop) {
            This.mp3_stop(startCtx);
          }
          if (data.err) {
            False(data.err);
          } else {
            mp3TrimFixSetMeta(data.meta, startCtx.set);
            True(data.blob, "audio/mp3");
          }
        };
        startCtx.worker.postMessage({
          action: "complete",
          id: startCtx.id
        });
      } else {
        False($T("mPxH::mp3编码器未start"));
      }
    };
    Recorder2.mp3ReadMeta = function(mp3Buffers, length) {
      var parseInt_ES3 = typeof window != "undefined" && window.parseInt || typeof self != "undefined" && self.parseInt || parseInt;
      var u8arr0 = new Uint8Array(mp3Buffers[0] || []);
      if (u8arr0.length < 4) {
        return null;
      }
      var byteAt = function(idx2, u8) {
        return ("0000000" + ((u8 || u8arr0)[idx2] || 0).toString(2)).substr(-8);
      };
      var b2 = byteAt(0) + byteAt(1);
      var b4 = byteAt(2) + byteAt(3);
      if (!/^1{11}/.test(b2)) {
        return null;
      }
      var version = { "00": 2.5, "10": 2, "11": 1 }[b2.substr(11, 2)];
      var layer = { "01": 3 }[b2.substr(13, 2)];
      var sampleRate = {
        //lamejs -> Tables.samplerate_table
        "1": [44100, 48e3, 32e3],
        "2": [22050, 24e3, 16e3],
        "2.5": [11025, 12e3, 8e3]
      }[version];
      sampleRate && (sampleRate = sampleRate[parseInt_ES3(b4.substr(4, 2), 2)]);
      var bitRate = [
        //lamejs -> Tables.bitrate_table
        [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
        [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
        //MPEG 1
      ][version == 1 ? 1 : 0][parseInt_ES3(b4.substr(0, 4), 2)];
      if (!version || !layer || !bitRate || !sampleRate) {
        return null;
      }
      var duration = Math.round(length * 8 / bitRate);
      var frame = layer == 1 ? 384 : layer == 2 ? 1152 : version == 1 ? 1152 : 576;
      var frameDurationFloat = frame / sampleRate * 1e3;
      var frameSize = Math.floor(frame * bitRate / 8 / sampleRate * 1e3);
      var hasPadding = 0, seek = 0;
      for (var i = 0; i < mp3Buffers.length; i++) {
        var buf = mp3Buffers[i];
        seek += buf.byteLength;
        if (seek >= frameSize + 3) {
          var buf8 = new Uint8Array(buf);
          var idx = buf.byteLength - (seek - (frameSize + 3) + 1);
          var ib4 = byteAt(idx, buf8);
          hasPadding = ib4.charAt(6) == "1";
          break;
        }
      }
      if (hasPadding) {
        frameSize++;
      }
      return {
        version,
        layer,
        sampleRate,
        bitRate,
        duration,
        size: length,
        hasPadding,
        frameSize,
        frameDurationFloat
        //每帧时长，含小数 ms
      };
    };
    var mp3TrimFix = {
      //minfiy keep name
      rm: Recorder2.mp3ReadMeta,
      fn: function(mp3Buffers, length, pcmLength, pcmSampleRate) {
        var meta = this.rm(mp3Buffers, length);
        if (!meta) {
          return { err: "mp3 unknown format" };
        }
        var pcmDuration = Math.round(pcmLength / pcmSampleRate * 1e3);
        var num = Math.floor((meta.duration - pcmDuration) / meta.frameDurationFloat);
        if (num > 0) {
          var size = num * meta.frameSize - (meta.hasPadding ? 1 : 0);
          length -= size;
          var arr0 = 0, arrs = [];
          for (var i = 0; i < mp3Buffers.length; i++) {
            var arr = mp3Buffers[i];
            if (size <= 0) {
              break;
            }
            if (size >= arr.byteLength) {
              size -= arr.byteLength;
              arrs.push(arr);
              mp3Buffers.splice(i, 1);
              i--;
            } else {
              mp3Buffers[i] = arr.slice(size);
              arr0 = arr;
              size = 0;
            }
          }
          var checkMeta = this.rm(mp3Buffers, length);
          if (!checkMeta) {
            arr0 && (mp3Buffers[0] = arr0);
            for (var i = 0; i < arrs.length; i++) {
              mp3Buffers.splice(i, 0, arrs[i]);
            }
            meta.err = "mp3 fix error: 已还原，错误原因不明";
          }
          var fix = meta.trimFix = {};
          fix.remove = num;
          fix.removeDuration = Math.round(num * meta.frameDurationFloat);
          fix.duration = Math.round(length * 8 / meta.bitRate);
        }
        return meta;
      }
    };
    var mp3TrimFixSetMeta = function(meta, set) {
      var tag = "MP3 Info: ";
      if (meta.sampleRate && meta.sampleRate != set.sampleRate || meta.bitRate && meta.bitRate != set.bitRate) {
        Recorder2.CLog(tag + $T("uY9i::和设置的不匹配{1}，已更新成{2}", 0, "set:" + set.bitRate + "kbps " + set.sampleRate + "hz", "set:" + meta.bitRate + "kbps " + meta.sampleRate + "hz"), 3, set);
        set.sampleRate = meta.sampleRate;
        set.bitRate = meta.bitRate;
      }
      var trimFix = meta.trimFix;
      if (trimFix) {
        tag += $T("iMSm::Fix移除{1}帧", 0, trimFix.remove) + " " + trimFix.removeDuration + "ms -> " + trimFix.duration + "ms";
        if (trimFix.remove > 2) {
          meta.err = (meta.err ? meta.err + ", " : "") + $T("b9zm::移除帧数过多");
        }
      } else {
        tag += (meta.duration || "-") + "ms";
      }
      if (meta.err) {
        Recorder2.CLog(tag, 1, meta.err, meta);
      } else {
        Recorder2.CLog(tag, meta);
      }
    };
  });
  (function(factory) {
    var browser = typeof window == "object" && !!window.document;
    var win = browser ? window : Object;
    var rec = win.Recorder;
    factory(rec);
  })(function(Recorder2) {
    function lamejs() {
      var Math_log10 = function(s) {
        return Math.log(s) / Math.log(10);
      };
      var abort = function(what) {
        throw new Error("abort(" + what + ")");
      };
      function new_byte2(count) {
        return new Int8Array(count);
      }
      function new_short2(count) {
        return new Int16Array(count);
      }
      function new_int2(count) {
        return new Int32Array(count);
      }
      function new_float2(count) {
        return new Float32Array(count);
      }
      function new_double2(count) {
        return new Float64Array(count);
      }
      function new_float_n2(args) {
        if (args.length == 1) {
          return new_float2(args[0]);
        }
        var sz = args[0];
        args = args.slice(1);
        var A = [];
        for (var i = 0; i < sz; i++) {
          A.push(new_float_n2(args));
        }
        return A;
      }
      function new_int_n2(args) {
        if (args.length == 1) {
          return new_int2(args[0]);
        }
        var sz = args[0];
        args = args.slice(1);
        var A = [];
        for (var i = 0; i < sz; i++) {
          A.push(new_int_n2(args));
        }
        return A;
      }
      function new_short_n2(args) {
        if (args.length == 1) {
          return new_short2(args[0]);
        }
        var sz = args[0];
        args = args.slice(1);
        var A = [];
        for (var i = 0; i < sz; i++) {
          A.push(new_short_n2(args));
        }
        return A;
      }
      function new_array_n2(args) {
        if (args.length == 1) {
          return new Array(args[0]);
        }
        var sz = args[0];
        args = args.slice(1);
        var A = [];
        for (var i = 0; i < sz; i++) {
          A.push(new_array_n2(args));
        }
        return A;
      }
      var Arrays2 = {};
      Arrays2.fill = function(a, fromIndex, toIndex, val) {
        if (arguments.length == 2) {
          for (var i = 0; i < a.length; i++) {
            a[i] = arguments[1];
          }
        } else {
          for (var i = fromIndex; i < toIndex; i++) {
            a[i] = val;
          }
        }
      };
      var System2 = {};
      System2.arraycopy = function(src, srcPos, dest, destPos, length) {
        var srcEnd = srcPos + length;
        while (srcPos < srcEnd)
          dest[destPos++] = src[srcPos++];
      };
      var Util2 = {};
      Util2.SQRT2 = 1.4142135623730951;
      Util2.FAST_LOG10 = function(x) {
        return Math_log10(x);
      };
      Util2.FAST_LOG10_X = function(x, y) {
        return Math_log10(x) * y;
      };
      function ShortBlock2(ordinal) {
        this.ordinal = ordinal;
      }
      ShortBlock2.short_block_allowed = new ShortBlock2(0);
      ShortBlock2.short_block_coupled = new ShortBlock2(1);
      ShortBlock2.short_block_dispensed = new ShortBlock2(2);
      ShortBlock2.short_block_forced = new ShortBlock2(3);
      var Float2 = {};
      Float2.MAX_VALUE = 34028235e31;
      function VbrMode2(ordinal) {
        this.ordinal = ordinal;
      }
      VbrMode2.vbr_off = new VbrMode2(0);
      VbrMode2.vbr_mt = new VbrMode2(1);
      VbrMode2.vbr_rh = new VbrMode2(2);
      VbrMode2.vbr_abr = new VbrMode2(3);
      VbrMode2.vbr_mtrh = new VbrMode2(4);
      VbrMode2.vbr_default = VbrMode2.vbr_mtrh;
      function MPEGMode2(ordinal) {
        var _ordinal = ordinal;
        this.ordinal = function() {
          return _ordinal;
        };
      }
      MPEGMode2.STEREO = new MPEGMode2(0);
      MPEGMode2.JOINT_STEREO = new MPEGMode2(1);
      MPEGMode2.DUAL_CHANNEL = new MPEGMode2(2);
      MPEGMode2.MONO = new MPEGMode2(3);
      MPEGMode2.NOT_SET = new MPEGMode2(4);
      function Version() {
        var LAME_MAJOR_VERSION = 3;
        var LAME_MINOR_VERSION = 98;
        var LAME_PATCH_VERSION = 4;
        this.getLameShortVersion = function() {
          return LAME_MAJOR_VERSION + "." + LAME_MINOR_VERSION + "." + LAME_PATCH_VERSION;
        };
      }
      function Takehiro() {
        var qupvt = null;
        this.qupvt = null;
        this.setModules = function(_qupvt) {
          this.qupvt = _qupvt;
          qupvt = _qupvt;
        };
        function Bits(b) {
          this.bits = 0 | b;
        }
        var subdv_table = [
          [0, 0],
          /* 0 bands */
          [0, 0],
          /* 1 bands */
          [0, 0],
          /* 2 bands */
          [0, 0],
          /* 3 bands */
          [0, 0],
          /* 4 bands */
          [0, 1],
          /* 5 bands */
          [1, 1],
          /* 6 bands */
          [1, 1],
          /* 7 bands */
          [1, 2],
          /* 8 bands */
          [2, 2],
          /* 9 bands */
          [2, 3],
          /* 10 bands */
          [2, 3],
          /* 11 bands */
          [3, 4],
          /* 12 bands */
          [3, 4],
          /* 13 bands */
          [3, 4],
          /* 14 bands */
          [4, 5],
          /* 15 bands */
          [4, 5],
          /* 16 bands */
          [4, 6],
          /* 17 bands */
          [5, 6],
          /* 18 bands */
          [5, 6],
          /* 19 bands */
          [5, 7],
          /* 20 bands */
          [6, 7],
          /* 21 bands */
          [6, 7]
          /* 22 bands */
        ];
        function quantize_lines_xrpow_01(l2, istep, xr, xrPos, ix, ixPos) {
          var compareval0 = (1 - 0.4054) / istep;
          l2 = l2 >> 1;
          while (l2-- != 0) {
            ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
            ix[ixPos++] = compareval0 > xr[xrPos++] ? 0 : 1;
          }
        }
        function quantize_lines_xrpow(l2, istep, xr, xrPos, ix, ixPos) {
          l2 = l2 >> 1;
          var remaining = l2 % 2;
          l2 = l2 >> 1;
          while (l2-- != 0) {
            var x0, x1, x2, x3;
            var rx0, rx1, rx2, rx3;
            x0 = xr[xrPos++] * istep;
            x1 = xr[xrPos++] * istep;
            rx0 = 0 | x0;
            x2 = xr[xrPos++] * istep;
            rx1 = 0 | x1;
            x3 = xr[xrPos++] * istep;
            rx2 = 0 | x2;
            x0 += qupvt.adj43[rx0];
            rx3 = 0 | x3;
            x1 += qupvt.adj43[rx1];
            ix[ixPos++] = 0 | x0;
            x2 += qupvt.adj43[rx2];
            ix[ixPos++] = 0 | x1;
            x3 += qupvt.adj43[rx3];
            ix[ixPos++] = 0 | x2;
            ix[ixPos++] = 0 | x3;
          }
          if (remaining != 0) {
            var x0, x1;
            var rx0, rx1;
            x0 = xr[xrPos++] * istep;
            x1 = xr[xrPos++] * istep;
            rx0 = 0 | x0;
            rx1 = 0 | x1;
            x0 += qupvt.adj43[rx0];
            x1 += qupvt.adj43[rx1];
            ix[ixPos++] = 0 | x0;
            ix[ixPos++] = 0 | x1;
          }
        }
        function quantize_xrpow(xp, pi, istep, codInfo, prevNoise) {
          var sfb;
          var sfbmax;
          var j = 0;
          var prev_data_use;
          var accumulate = 0;
          var accumulate01 = 0;
          var xpPos = 0;
          var iData = pi;
          var iDataPos = 0;
          var acc_iData = iData;
          var acc_iDataPos = 0;
          var acc_xp = xp;
          var acc_xpPos = 0;
          prev_data_use = prevNoise != null && codInfo.global_gain == prevNoise.global_gain;
          if (codInfo.block_type == Encoder2.SHORT_TYPE)
            sfbmax = 38;
          else
            sfbmax = 21;
          for (sfb = 0; sfb <= sfbmax; sfb++) {
            var step = -1;
            if (prev_data_use || codInfo.block_type == Encoder2.NORM_TYPE) {
              step = codInfo.global_gain - (codInfo.scalefac[sfb] + (codInfo.preflag != 0 ? qupvt.pretab[sfb] : 0) << codInfo.scalefac_scale + 1) - codInfo.subblock_gain[codInfo.window[sfb]] * 8;
            }
            if (prev_data_use && prevNoise.step[sfb] == step) {
              if (accumulate != 0) {
                quantize_lines_xrpow(
                  accumulate,
                  istep,
                  acc_xp,
                  acc_xpPos,
                  acc_iData,
                  acc_iDataPos
                );
                accumulate = 0;
              }
              if (accumulate01 != 0) {
                abort();
              }
            } else {
              var l2 = codInfo.width[sfb];
              if (j + codInfo.width[sfb] > codInfo.max_nonzero_coeff) {
                var usefullsize;
                usefullsize = codInfo.max_nonzero_coeff - j + 1;
                Arrays2.fill(pi, codInfo.max_nonzero_coeff, 576, 0);
                l2 = usefullsize;
                if (l2 < 0) {
                  l2 = 0;
                }
                sfb = sfbmax + 1;
              }
              if (0 == accumulate && 0 == accumulate01) {
                acc_iData = iData;
                acc_iDataPos = iDataPos;
                acc_xp = xp;
                acc_xpPos = xpPos;
              }
              if (prevNoise != null && prevNoise.sfb_count1 > 0 && sfb >= prevNoise.sfb_count1 && prevNoise.step[sfb] > 0 && step >= prevNoise.step[sfb]) {
                if (accumulate != 0) {
                  quantize_lines_xrpow(
                    accumulate,
                    istep,
                    acc_xp,
                    acc_xpPos,
                    acc_iData,
                    acc_iDataPos
                  );
                  accumulate = 0;
                  acc_iData = iData;
                  acc_iDataPos = iDataPos;
                  acc_xp = xp;
                  acc_xpPos = xpPos;
                }
                accumulate01 += l2;
              } else {
                if (accumulate01 != 0) {
                  quantize_lines_xrpow_01(
                    accumulate01,
                    istep,
                    acc_xp,
                    acc_xpPos,
                    acc_iData,
                    acc_iDataPos
                  );
                  accumulate01 = 0;
                  acc_iData = iData;
                  acc_iDataPos = iDataPos;
                  acc_xp = xp;
                  acc_xpPos = xpPos;
                }
                accumulate += l2;
              }
              if (l2 <= 0) {
                if (accumulate01 != 0) {
                  abort();
                }
                if (accumulate != 0) {
                  abort();
                }
                break;
              }
            }
            if (sfb <= sfbmax) {
              iDataPos += codInfo.width[sfb];
              xpPos += codInfo.width[sfb];
              j += codInfo.width[sfb];
            }
          }
          if (accumulate != 0) {
            quantize_lines_xrpow(
              accumulate,
              istep,
              acc_xp,
              acc_xpPos,
              acc_iData,
              acc_iDataPos
            );
            accumulate = 0;
          }
          if (accumulate01 != 0) {
            abort();
          }
        }
        function ix_max(ix, ixPos, endPos) {
          var max1 = 0, max2 = 0;
          do {
            var x1 = ix[ixPos++];
            var x2 = ix[ixPos++];
            if (max1 < x1)
              max1 = x1;
            if (max2 < x2)
              max2 = x2;
          } while (ixPos < endPos);
          if (max1 < max2)
            max1 = max2;
          return max1;
        }
        function count_bit_ESC(ix, ixPos, end, t1, t2, s) {
          var linbits = Tables2.ht[t1].xlen * 65536 + Tables2.ht[t2].xlen;
          var sum = 0, sum2;
          do {
            var x = ix[ixPos++];
            var y = ix[ixPos++];
            if (x != 0) {
              if (x > 14) {
                x = 15;
                sum += linbits;
              }
              x *= 16;
            }
            if (y != 0) {
              if (y > 14) {
                y = 15;
                sum += linbits;
              }
              x += y;
            }
            sum += Tables2.largetbl[x];
          } while (ixPos < end);
          sum2 = sum & 65535;
          sum >>= 16;
          if (sum > sum2) {
            sum = sum2;
            t1 = t2;
          }
          s.bits += sum;
          return t1;
        }
        function count_bit_noESC(ix, ixPos, end, s) {
          var sum1 = 0;
          var hlen1 = Tables2.ht[1].hlen;
          do {
            var x = ix[ixPos + 0] * 2 + ix[ixPos + 1];
            ixPos += 2;
            sum1 += hlen1[x];
          } while (ixPos < end);
          s.bits += sum1;
          return 1;
        }
        function count_bit_noESC_from2(ix, ixPos, end, t1, s) {
          var sum = 0, sum2;
          var xlen = Tables2.ht[t1].xlen;
          var hlen;
          if (t1 == 2)
            hlen = Tables2.table23;
          else
            hlen = Tables2.table56;
          do {
            var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
            ixPos += 2;
            sum += hlen[x];
          } while (ixPos < end);
          sum2 = sum & 65535;
          sum >>= 16;
          if (sum > sum2) {
            sum = sum2;
            t1++;
          }
          s.bits += sum;
          return t1;
        }
        function count_bit_noESC_from3(ix, ixPos, end, t1, s) {
          var sum1 = 0;
          var sum2 = 0;
          var sum3 = 0;
          var xlen = Tables2.ht[t1].xlen;
          var hlen1 = Tables2.ht[t1].hlen;
          var hlen2 = Tables2.ht[t1 + 1].hlen;
          var hlen3 = Tables2.ht[t1 + 2].hlen;
          do {
            var x = ix[ixPos + 0] * xlen + ix[ixPos + 1];
            ixPos += 2;
            sum1 += hlen1[x];
            sum2 += hlen2[x];
            sum3 += hlen3[x];
          } while (ixPos < end);
          var t = t1;
          if (sum1 > sum2) {
            sum1 = sum2;
            t++;
          }
          if (sum1 > sum3) {
            sum1 = sum3;
            t = t1 + 2;
          }
          s.bits += sum1;
          return t;
        }
        var huf_tbl_noESC = [
          1,
          2,
          5,
          7,
          7,
          10,
          10,
          13,
          13,
          13,
          13,
          13,
          13,
          13,
          13
        ];
        function choose_table(ix, ixPos, endPos, s) {
          var max = ix_max(ix, ixPos, endPos);
          switch (max) {
            case 0:
              return max;
            case 1:
              return count_bit_noESC(ix, ixPos, endPos, s);
            case 2:
            case 3:
              return count_bit_noESC_from2(
                ix,
                ixPos,
                endPos,
                huf_tbl_noESC[max - 1],
                s
              );
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
              return count_bit_noESC_from3(
                ix,
                ixPos,
                endPos,
                huf_tbl_noESC[max - 1],
                s
              );
            default:
              if (max > QuantizePVT.IXMAX_VAL) {
                abort();
              }
              max -= 15;
              var choice2;
              for (choice2 = 24; choice2 < 32; choice2++) {
                if (Tables2.ht[choice2].linmax >= max) {
                  break;
                }
              }
              var choice;
              for (choice = choice2 - 8; choice < 24; choice++) {
                if (Tables2.ht[choice].linmax >= max) {
                  break;
                }
              }
              return count_bit_ESC(ix, ixPos, endPos, choice, choice2, s);
          }
        }
        this.noquant_count_bits = function(gfc, gi, prev_noise) {
          var ix = gi.l3_enc;
          var i = Math.min(576, gi.max_nonzero_coeff + 2 >> 1 << 1);
          if (prev_noise != null)
            prev_noise.sfb_count1 = 0;
          for (; i > 1; i -= 2)
            if ((ix[i - 1] | ix[i - 2]) != 0)
              break;
          gi.count1 = i;
          var a1 = 0;
          var a2 = 0;
          for (; i > 3; i -= 4) {
            var p2;
            if (((ix[i - 1] | ix[i - 2] | ix[i - 3] | ix[i - 4]) & 2147483647) > 1) {
              break;
            }
            p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
            a1 += Tables2.t32l[p2];
            a2 += Tables2.t33l[p2];
          }
          var bits = a1;
          gi.count1table_select = 0;
          if (a1 > a2) {
            bits = a2;
            gi.count1table_select = 1;
          }
          gi.count1bits = bits;
          gi.big_values = i;
          if (i == 0)
            return bits;
          if (gi.block_type == Encoder2.SHORT_TYPE) {
            a1 = 3 * gfc.scalefac_band.s[3];
            if (a1 > gi.big_values)
              a1 = gi.big_values;
            a2 = gi.big_values;
          } else if (gi.block_type == Encoder2.NORM_TYPE) {
            a1 = gi.region0_count = gfc.bv_scf[i - 2];
            a2 = gi.region1_count = gfc.bv_scf[i - 1];
            a2 = gfc.scalefac_band.l[a1 + a2 + 2];
            a1 = gfc.scalefac_band.l[a1 + 1];
            if (a2 < i) {
              var bi = new Bits(bits);
              gi.table_select[2] = choose_table(ix, a2, i, bi);
              bits = bi.bits;
            }
          } else {
            gi.region0_count = 7;
            gi.region1_count = Encoder2.SBMAX_l - 1 - 7 - 1;
            a1 = gfc.scalefac_band.l[7 + 1];
            a2 = i;
            if (a1 > a2) {
              a1 = a2;
            }
          }
          a1 = Math.min(a1, i);
          a2 = Math.min(a2, i);
          if (0 < a1) {
            var bi = new Bits(bits);
            gi.table_select[0] = choose_table(ix, 0, a1, bi);
            bits = bi.bits;
          }
          if (a1 < a2) {
            var bi = new Bits(bits);
            gi.table_select[1] = choose_table(ix, a1, a2, bi);
            bits = bi.bits;
          }
          if (gfc.use_best_huffman == 2) {
            abort();
          }
          if (prev_noise != null) {
            if (gi.block_type == Encoder2.NORM_TYPE) {
              var sfb = 0;
              while (gfc.scalefac_band.l[sfb] < gi.big_values) {
                sfb++;
              }
              prev_noise.sfb_count1 = sfb;
            }
          }
          return bits;
        };
        this.count_bits = function(gfc, xr, gi, prev_noise) {
          var ix = gi.l3_enc;
          var w = QuantizePVT.IXMAX_VAL / qupvt.IPOW20(gi.global_gain);
          if (gi.xrpow_max > w)
            return QuantizePVT.LARGE_BITS;
          quantize_xrpow(xr, ix, qupvt.IPOW20(gi.global_gain), gi, prev_noise);
          if ((gfc.substep_shaping & 2) != 0) {
            abort();
          }
          return this.noquant_count_bits(gfc, gi, prev_noise);
        };
        function recalc_divide_init(gfc, cod_info, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
          var bigv = cod_info.big_values;
          for (var r0 = 0; r0 <= 7 + 15; r0++) {
            r01_bits[r0] = QuantizePVT.LARGE_BITS;
          }
          for (var r0 = 0; r0 < 16; r0++) {
            var a1 = gfc.scalefac_band.l[r0 + 1];
            if (a1 >= bigv)
              break;
            var r0bits = 0;
            var bi = new Bits(r0bits);
            var r0t = choose_table(ix, 0, a1, bi);
            r0bits = bi.bits;
            for (var r1 = 0; r1 < 8; r1++) {
              var a2 = gfc.scalefac_band.l[r0 + r1 + 2];
              if (a2 >= bigv)
                break;
              var bits = r0bits;
              bi = new Bits(bits);
              var r1t = choose_table(ix, a1, a2, bi);
              bits = bi.bits;
              if (r01_bits[r0 + r1] > bits) {
                r01_bits[r0 + r1] = bits;
                r01_div[r0 + r1] = r0;
                r0_tbl[r0 + r1] = r0t;
                r1_tbl[r0 + r1] = r1t;
              }
            }
          }
        }
        function recalc_divide_sub(gfc, cod_info2, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl) {
          var bigv = cod_info2.big_values;
          for (var r2 = 2; r2 < Encoder2.SBMAX_l + 1; r2++) {
            var a2 = gfc.scalefac_band.l[r2];
            if (a2 >= bigv)
              break;
            var bits = r01_bits[r2 - 2] + cod_info2.count1bits;
            if (gi.part2_3_length <= bits)
              break;
            var bi = new Bits(bits);
            var r2t = choose_table(ix, a2, bigv, bi);
            bits = bi.bits;
            if (gi.part2_3_length <= bits)
              continue;
            gi.assign(cod_info2);
            gi.part2_3_length = bits;
            gi.region0_count = r01_div[r2 - 2];
            gi.region1_count = r2 - 2 - r01_div[r2 - 2];
            gi.table_select[0] = r0_tbl[r2 - 2];
            gi.table_select[1] = r1_tbl[r2 - 2];
            gi.table_select[2] = r2t;
          }
        }
        this.best_huffman_divide = function(gfc, gi) {
          var cod_info2 = new GrInfo2();
          var ix = gi.l3_enc;
          var r01_bits = new_int2(7 + 15 + 1);
          var r01_div = new_int2(7 + 15 + 1);
          var r0_tbl = new_int2(7 + 15 + 1);
          var r1_tbl = new_int2(7 + 15 + 1);
          if (gi.block_type == Encoder2.SHORT_TYPE && gfc.mode_gr == 1)
            return;
          cod_info2.assign(gi);
          if (gi.block_type == Encoder2.NORM_TYPE) {
            recalc_divide_init(gfc, gi, ix, r01_bits, r01_div, r0_tbl, r1_tbl);
            recalc_divide_sub(
              gfc,
              cod_info2,
              gi,
              ix,
              r01_bits,
              r01_div,
              r0_tbl,
              r1_tbl
            );
          }
          var i = cod_info2.big_values;
          if (i == 0 || (ix[i - 2] | ix[i - 1]) > 1)
            return;
          i = gi.count1 + 2;
          if (i > 576)
            return;
          cod_info2.assign(gi);
          cod_info2.count1 = i;
          var a1 = 0;
          var a2 = 0;
          for (; i > cod_info2.big_values; i -= 4) {
            var p2 = ((ix[i - 4] * 2 + ix[i - 3]) * 2 + ix[i - 2]) * 2 + ix[i - 1];
            a1 += Tables2.t32l[p2];
            a2 += Tables2.t33l[p2];
          }
          cod_info2.big_values = i;
          cod_info2.count1table_select = 0;
          if (a1 > a2) {
            a1 = a2;
            cod_info2.count1table_select = 1;
          }
          cod_info2.count1bits = a1;
          if (cod_info2.block_type == Encoder2.NORM_TYPE)
            recalc_divide_sub(
              gfc,
              cod_info2,
              gi,
              ix,
              r01_bits,
              r01_div,
              r0_tbl,
              r1_tbl
            );
          else {
            cod_info2.part2_3_length = a1;
            a1 = gfc.scalefac_band.l[7 + 1];
            if (a1 > i) {
              a1 = i;
            }
            if (a1 > 0) {
              var bi = new Bits(cod_info2.part2_3_length);
              cod_info2.table_select[0] = choose_table(ix, 0, a1, bi);
              cod_info2.part2_3_length = bi.bits;
            }
            if (i > a1) {
              var bi = new Bits(cod_info2.part2_3_length);
              cod_info2.table_select[1] = choose_table(ix, a1, i, bi);
              cod_info2.part2_3_length = bi.bits;
            }
            if (gi.part2_3_length > cod_info2.part2_3_length)
              gi.assign(cod_info2);
          }
        };
        var slen1_n = [1, 1, 1, 1, 8, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16];
        var slen2_n = [1, 2, 4, 8, 1, 2, 4, 8, 2, 4, 8, 2, 4, 8, 4, 8];
        var slen1_tab = [0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4];
        var slen2_tab = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3];
        Takehiro.slen1_tab = slen1_tab;
        Takehiro.slen2_tab = slen2_tab;
        function scfsi_calc(ch, l3_side) {
          var sfb;
          var gi = l3_side.tt[1][ch];
          var g0 = l3_side.tt[0][ch];
          for (var i = 0; i < Tables2.scfsi_band.length - 1; i++) {
            for (sfb = Tables2.scfsi_band[i]; sfb < Tables2.scfsi_band[i + 1]; sfb++) {
              if (g0.scalefac[sfb] != gi.scalefac[sfb] && gi.scalefac[sfb] >= 0)
                break;
            }
            if (sfb == Tables2.scfsi_band[i + 1]) {
              for (sfb = Tables2.scfsi_band[i]; sfb < Tables2.scfsi_band[i + 1]; sfb++) {
                gi.scalefac[sfb] = -1;
              }
              l3_side.scfsi[ch][i] = 1;
            }
          }
          var s1 = 0;
          var c1 = 0;
          for (sfb = 0; sfb < 11; sfb++) {
            if (gi.scalefac[sfb] == -1)
              continue;
            c1++;
            if (s1 < gi.scalefac[sfb])
              s1 = gi.scalefac[sfb];
          }
          var s2 = 0;
          var c2 = 0;
          for (; sfb < Encoder2.SBPSY_l; sfb++) {
            if (gi.scalefac[sfb] == -1)
              continue;
            c2++;
            if (s2 < gi.scalefac[sfb])
              s2 = gi.scalefac[sfb];
          }
          for (var i = 0; i < 16; i++) {
            if (s1 < slen1_n[i] && s2 < slen2_n[i]) {
              var c = slen1_tab[i] * c1 + slen2_tab[i] * c2;
              if (gi.part2_length > c) {
                gi.part2_length = c;
                gi.scalefac_compress = i;
              }
            }
          }
        }
        this.best_scalefac_store = function(gfc, gr, ch, l3_side) {
          var gi = l3_side.tt[gr][ch];
          var sfb, i, j, l2;
          var recalc = 0;
          j = 0;
          for (sfb = 0; sfb < gi.sfbmax; sfb++) {
            var width = gi.width[sfb];
            j += width;
            for (l2 = -width; l2 < 0; l2++) {
              if (gi.l3_enc[l2 + j] != 0)
                break;
            }
            if (l2 == 0)
              gi.scalefac[sfb] = recalc = -2;
          }
          if (0 == gi.scalefac_scale && 0 == gi.preflag) {
            var s = 0;
            for (sfb = 0; sfb < gi.sfbmax; sfb++)
              if (gi.scalefac[sfb] > 0)
                s |= gi.scalefac[sfb];
            if (0 == (s & 1) && s != 0) {
              for (sfb = 0; sfb < gi.sfbmax; sfb++)
                if (gi.scalefac[sfb] > 0)
                  gi.scalefac[sfb] >>= 1;
              gi.scalefac_scale = recalc = 1;
            }
          }
          if (0 == gi.preflag && gi.block_type != Encoder2.SHORT_TYPE && gfc.mode_gr == 2) {
            for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
              if (gi.scalefac[sfb] < qupvt.pretab[sfb] && gi.scalefac[sfb] != -2)
                break;
            if (sfb == Encoder2.SBPSY_l) {
              for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
                if (gi.scalefac[sfb] > 0)
                  gi.scalefac[sfb] -= qupvt.pretab[sfb];
              gi.preflag = recalc = 1;
            }
          }
          for (i = 0; i < 4; i++)
            l3_side.scfsi[ch][i] = 0;
          if (gfc.mode_gr == 2 && gr == 1 && l3_side.tt[0][ch].block_type != Encoder2.SHORT_TYPE && l3_side.tt[1][ch].block_type != Encoder2.SHORT_TYPE) {
            scfsi_calc(ch, l3_side);
            recalc = 0;
          }
          for (sfb = 0; sfb < gi.sfbmax; sfb++) {
            if (gi.scalefac[sfb] == -2) {
              gi.scalefac[sfb] = 0;
            }
          }
          if (recalc != 0) {
            if (gfc.mode_gr == 2) {
              this.scale_bitcount(gi);
            } else {
              this.scale_bitcount_lsf(gfc, gi);
            }
          }
        };
        var scale_short = [
          0,
          18,
          36,
          54,
          54,
          36,
          54,
          72,
          54,
          72,
          90,
          72,
          90,
          108,
          108,
          126
        ];
        var scale_mixed = [
          0,
          18,
          36,
          54,
          51,
          35,
          53,
          71,
          52,
          70,
          88,
          69,
          87,
          105,
          104,
          122
        ];
        var scale_long = [
          0,
          10,
          20,
          30,
          33,
          21,
          31,
          41,
          32,
          42,
          52,
          43,
          53,
          63,
          64,
          74
        ];
        this.scale_bitcount = function(cod_info) {
          var k2, sfb, max_slen1 = 0, max_slen2 = 0;
          var tab;
          var scalefac = cod_info.scalefac;
          if (cod_info.block_type == Encoder2.SHORT_TYPE) {
            tab = scale_short;
            if (cod_info.mixed_block_flag != 0)
              tab = scale_mixed;
          } else {
            tab = scale_long;
            if (0 == cod_info.preflag) {
              for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
                if (scalefac[sfb] < qupvt.pretab[sfb])
                  break;
              if (sfb == Encoder2.SBPSY_l) {
                cod_info.preflag = 1;
                for (sfb = 11; sfb < Encoder2.SBPSY_l; sfb++)
                  scalefac[sfb] -= qupvt.pretab[sfb];
              }
            }
          }
          for (sfb = 0; sfb < cod_info.sfbdivide; sfb++)
            if (max_slen1 < scalefac[sfb])
              max_slen1 = scalefac[sfb];
          for (; sfb < cod_info.sfbmax; sfb++)
            if (max_slen2 < scalefac[sfb])
              max_slen2 = scalefac[sfb];
          cod_info.part2_length = QuantizePVT.LARGE_BITS;
          for (k2 = 0; k2 < 16; k2++) {
            if (max_slen1 < slen1_n[k2] && max_slen2 < slen2_n[k2] && cod_info.part2_length > tab[k2]) {
              cod_info.part2_length = tab[k2];
              cod_info.scalefac_compress = k2;
            }
          }
          return cod_info.part2_length == QuantizePVT.LARGE_BITS;
        };
        var max_range_sfac_tab = [
          [15, 15, 7, 7],
          [15, 15, 7, 0],
          [7, 3, 0, 0],
          [15, 31, 31, 0],
          [7, 7, 7, 0],
          [3, 3, 0, 0]
        ];
        this.scale_bitcount_lsf = function(gfc, cod_info) {
          var table_number, row_in_table, partition, nr_sfb, window2;
          var over;
          var i, sfb;
          var max_sfac = new_int2(4);
          var scalefac = cod_info.scalefac;
          if (cod_info.preflag != 0)
            table_number = 2;
          else
            table_number = 0;
          for (i = 0; i < 4; i++)
            max_sfac[i] = 0;
          if (cod_info.block_type == Encoder2.SHORT_TYPE) {
            row_in_table = 1;
            var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
            for (sfb = 0, partition = 0; partition < 4; partition++) {
              nr_sfb = partition_table[partition] / 3;
              for (i = 0; i < nr_sfb; i++, sfb++)
                for (window2 = 0; window2 < 3; window2++)
                  if (scalefac[sfb * 3 + window2] > max_sfac[partition])
                    max_sfac[partition] = scalefac[sfb * 3 + window2];
            }
          } else {
            row_in_table = 0;
            var partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
            for (sfb = 0, partition = 0; partition < 4; partition++) {
              nr_sfb = partition_table[partition];
              for (i = 0; i < nr_sfb; i++, sfb++)
                if (scalefac[sfb] > max_sfac[partition])
                  max_sfac[partition] = scalefac[sfb];
            }
          }
          for (over = false, partition = 0; partition < 4; partition++) {
            if (max_sfac[partition] > max_range_sfac_tab[table_number][partition])
              over = true;
          }
          if (!over) {
            var slen1, slen2, slen3, slen4;
            cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[table_number][row_in_table];
            for (partition = 0; partition < 4; partition++)
              cod_info.slen[partition] = log2tab[max_sfac[partition]];
            slen1 = cod_info.slen[0];
            slen2 = cod_info.slen[1];
            slen3 = cod_info.slen[2];
            slen4 = cod_info.slen[3];
            switch (table_number) {
              case 0:
                cod_info.scalefac_compress = (slen1 * 5 + slen2 << 4) + (slen3 << 2) + slen4;
                break;
              case 1:
                cod_info.scalefac_compress = 400 + (slen1 * 5 + slen2 << 2) + slen3;
                break;
              case 2:
                cod_info.scalefac_compress = 500 + slen1 * 3 + slen2;
                break;
            }
          }
          if (!over) {
            cod_info.part2_length = 0;
            for (partition = 0; partition < 4; partition++)
              cod_info.part2_length += cod_info.slen[partition] * cod_info.sfb_partition_table[partition];
          }
          return over;
        };
        var log2tab = [
          0,
          1,
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
          4,
          4,
          4,
          4
        ];
        this.huffman_init = function(gfc) {
          for (var i = 2; i <= 576; i += 2) {
            var scfb_anz = 0, bv_index;
            while (gfc.scalefac_band.l[++scfb_anz] < i)
              ;
            bv_index = subdv_table[scfb_anz][0];
            while (gfc.scalefac_band.l[bv_index + 1] > i)
              bv_index--;
            if (bv_index < 0) {
              bv_index = subdv_table[scfb_anz][0];
            }
            gfc.bv_scf[i - 2] = bv_index;
            bv_index = subdv_table[scfb_anz][1];
            while (gfc.scalefac_band.l[bv_index + gfc.bv_scf[i - 2] + 2] > i)
              bv_index--;
            if (bv_index < 0) {
              bv_index = subdv_table[scfb_anz][1];
            }
            gfc.bv_scf[i - 1] = bv_index;
          }
        };
      }
      GainAnalysis2.STEPS_per_dB = 100;
      GainAnalysis2.MAX_dB = 120;
      GainAnalysis2.GAIN_NOT_ENOUGH_SAMPLES = -24601;
      GainAnalysis2.GAIN_ANALYSIS_ERROR = 0;
      GainAnalysis2.GAIN_ANALYSIS_OK = 1;
      GainAnalysis2.INIT_GAIN_ANALYSIS_ERROR = 0;
      GainAnalysis2.INIT_GAIN_ANALYSIS_OK = 1;
      GainAnalysis2.YULE_ORDER = 10;
      GainAnalysis2.MAX_ORDER = GainAnalysis2.YULE_ORDER;
      GainAnalysis2.MAX_SAMP_FREQ = 48e3;
      GainAnalysis2.RMS_WINDOW_TIME_NUMERATOR = 1;
      GainAnalysis2.RMS_WINDOW_TIME_DENOMINATOR = 20;
      GainAnalysis2.MAX_SAMPLES_PER_WINDOW = GainAnalysis2.MAX_SAMP_FREQ * GainAnalysis2.RMS_WINDOW_TIME_NUMERATOR / GainAnalysis2.RMS_WINDOW_TIME_DENOMINATOR + 1;
      function GainAnalysis2() {
      }
      function Presets() {
        function ABRPresets(kbps, comp, compS, joint, fix, shThreshold, shThresholdS, bass, sc, mask, lower, curve, interCh, sfScale) {
          this.quant_comp = comp;
          this.quant_comp_s = compS;
          this.safejoint = joint;
          this.nsmsfix = fix;
          this.st_lrm = shThreshold;
          this.st_s = shThresholdS;
          this.nsbass = bass;
          this.scale = sc;
          this.masking_adj = mask;
          this.ath_lower = lower;
          this.ath_curve = curve;
          this.interch = interCh;
          this.sfscale = sfScale;
        }
        var lame;
        this.setModules = function(_lame) {
          lame = _lame;
        };
        function apply_vbr_preset(gfp, a, enforce) {
          abort();
        }
        var abr_switch_map = [
          new ABRPresets(8, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -30, 11, 12e-4, 1),
          /*   8, impossible to use in stereo */
          new ABRPresets(16, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -25, 11, 1e-3, 1),
          /*  16 */
          new ABRPresets(24, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -20, 11, 1e-3, 1),
          /*  24 */
          new ABRPresets(32, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -15, 11, 1e-3, 1),
          /*  32 */
          new ABRPresets(40, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -10, 11, 9e-4, 1),
          /*  40 */
          new ABRPresets(48, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -10, 11, 9e-4, 1),
          /*  48 */
          new ABRPresets(56, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -6, 11, 8e-4, 1),
          /*  56 */
          new ABRPresets(64, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, -2, 11, 8e-4, 1),
          /*  64 */
          new ABRPresets(80, 9, 9, 0, 0, 6.6, 145, 0, 0.95, 0, 0, 8, 7e-4, 1),
          /*  80 */
          new ABRPresets(96, 9, 9, 0, 2.5, 6.6, 145, 0, 0.95, 0, 1, 5.5, 6e-4, 1),
          /*  96 */
          new ABRPresets(112, 9, 9, 0, 2.25, 6.6, 145, 0, 0.95, 0, 2, 4.5, 5e-4, 1),
          /* 112 */
          new ABRPresets(128, 9, 9, 0, 1.95, 6.4, 140, 0, 0.95, 0, 3, 4, 2e-4, 1),
          /* 128 */
          new ABRPresets(160, 9, 9, 1, 1.79, 6, 135, 0, 0.95, -2, 5, 3.5, 0, 1),
          /* 160 */
          new ABRPresets(192, 9, 9, 1, 1.49, 5.6, 125, 0, 0.97, -4, 7, 3, 0, 0),
          /* 192 */
          new ABRPresets(224, 9, 9, 1, 1.25, 5.2, 125, 0, 0.98, -6, 9, 2, 0, 0),
          /* 224 */
          new ABRPresets(256, 9, 9, 1, 0.97, 5.2, 125, 0, 1, -8, 10, 1, 0, 0),
          /* 256 */
          new ABRPresets(320, 9, 9, 1, 0.9, 5.2, 125, 0, 1, -10, 12, 0, 0, 0)
          /* 320 */
        ];
        function apply_abr_preset(gfp, preset, enforce) {
          var actual_bitrate = preset;
          var r = lame.nearestBitrateFullIndex(preset);
          gfp.VBR = VbrMode2.vbr_abr;
          gfp.VBR_mean_bitrate_kbps = actual_bitrate;
          gfp.VBR_mean_bitrate_kbps = Math.min(gfp.VBR_mean_bitrate_kbps, 320);
          gfp.VBR_mean_bitrate_kbps = Math.max(gfp.VBR_mean_bitrate_kbps, 8);
          gfp.brate = gfp.VBR_mean_bitrate_kbps;
          if (gfp.VBR_mean_bitrate_kbps > 320) {
            gfp.disable_reservoir = true;
          }
          if (abr_switch_map[r].safejoint > 0)
            gfp.exp_nspsytune = gfp.exp_nspsytune | 2;
          if (abr_switch_map[r].sfscale > 0) {
            gfp.internal_flags.noise_shaping = 2;
          }
          if (Math.abs(abr_switch_map[r].nsbass) > 0) {
            var k2 = int(abr_switch_map[r].nsbass * 4);
            if (k2 < 0)
              k2 += 64;
            gfp.exp_nspsytune = gfp.exp_nspsytune | k2 << 2;
          }
          if (enforce != 0)
            gfp.quant_comp = abr_switch_map[r].quant_comp;
          else if (!(Math.abs(gfp.quant_comp - -1) > 0))
            gfp.quant_comp = abr_switch_map[r].quant_comp;
          if (enforce != 0)
            gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
          else if (!(Math.abs(gfp.quant_comp_short - -1) > 0))
            gfp.quant_comp_short = abr_switch_map[r].quant_comp_s;
          if (enforce != 0)
            gfp.msfix = abr_switch_map[r].nsmsfix;
          else if (!(Math.abs(gfp.msfix - -1) > 0))
            gfp.msfix = abr_switch_map[r].nsmsfix;
          if (enforce != 0)
            gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
          else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre - -1) > 0))
            gfp.internal_flags.nsPsy.attackthre = abr_switch_map[r].st_lrm;
          if (enforce != 0)
            gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
          else if (!(Math.abs(gfp.internal_flags.nsPsy.attackthre_s - -1) > 0))
            gfp.internal_flags.nsPsy.attackthre_s = abr_switch_map[r].st_s;
          if (enforce != 0)
            gfp.scale = abr_switch_map[r].scale;
          else if (!(Math.abs(gfp.scale - -1) > 0))
            gfp.scale = abr_switch_map[r].scale;
          if (enforce != 0)
            gfp.maskingadjust = abr_switch_map[r].masking_adj;
          else if (!(Math.abs(gfp.maskingadjust - 0) > 0))
            gfp.maskingadjust = abr_switch_map[r].masking_adj;
          if (abr_switch_map[r].masking_adj > 0) {
            if (enforce != 0)
              gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
            else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0))
              gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 0.9;
          } else {
            if (enforce != 0)
              gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
            else if (!(Math.abs(gfp.maskingadjust_short - 0) > 0))
              gfp.maskingadjust_short = abr_switch_map[r].masking_adj * 1.1;
          }
          if (enforce != 0)
            gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
          else if (!(Math.abs(-gfp.ATHlower * 10 - 0) > 0))
            gfp.ATHlower = -abr_switch_map[r].ath_lower / 10;
          if (enforce != 0)
            gfp.ATHcurve = abr_switch_map[r].ath_curve;
          else if (!(Math.abs(gfp.ATHcurve - -1) > 0))
            gfp.ATHcurve = abr_switch_map[r].ath_curve;
          if (enforce != 0)
            gfp.interChRatio = abr_switch_map[r].interch;
          else if (!(Math.abs(gfp.interChRatio - -1) > 0))
            gfp.interChRatio = abr_switch_map[r].interch;
          return preset;
        }
        this.apply_preset = function(gfp, preset, enforce) {
          switch (preset) {
            case Lame2.R3MIX: {
              preset = Lame2.V3;
              gfp.VBR = VbrMode2.vbr_mtrh;
              break;
            }
            case Lame2.MEDIUM: {
              preset = Lame2.V4;
              gfp.VBR = VbrMode2.vbr_rh;
              break;
            }
            case Lame2.MEDIUM_FAST: {
              preset = Lame2.V4;
              gfp.VBR = VbrMode2.vbr_mtrh;
              break;
            }
            case Lame2.STANDARD: {
              preset = Lame2.V2;
              gfp.VBR = VbrMode2.vbr_rh;
              break;
            }
            case Lame2.STANDARD_FAST: {
              preset = Lame2.V2;
              gfp.VBR = VbrMode2.vbr_mtrh;
              break;
            }
            case Lame2.EXTREME: {
              preset = Lame2.V0;
              gfp.VBR = VbrMode2.vbr_rh;
              break;
            }
            case Lame2.EXTREME_FAST: {
              preset = Lame2.V0;
              gfp.VBR = VbrMode2.vbr_mtrh;
              break;
            }
            case Lame2.INSANE: {
              preset = 320;
              gfp.preset = preset;
              apply_abr_preset(gfp, preset, enforce);
              gfp.VBR = VbrMode2.vbr_off;
              return preset;
            }
          }
          gfp.preset = preset;
          {
            switch (preset) {
              case Lame2.V9:
                apply_vbr_preset();
                return preset;
              case Lame2.V8:
                apply_vbr_preset();
                return preset;
              case Lame2.V7:
                apply_vbr_preset();
                return preset;
              case Lame2.V6:
                apply_vbr_preset();
                return preset;
              case Lame2.V5:
                apply_vbr_preset();
                return preset;
              case Lame2.V4:
                apply_vbr_preset();
                return preset;
              case Lame2.V3:
                apply_vbr_preset();
                return preset;
              case Lame2.V2:
                apply_vbr_preset();
                return preset;
              case Lame2.V1:
                apply_vbr_preset();
                return preset;
              case Lame2.V0:
                apply_vbr_preset();
                return preset;
            }
          }
          if (8 <= preset && preset <= 320) {
            return apply_abr_preset(gfp, preset, enforce);
          }
          gfp.preset = 0;
          return preset;
        };
      }
      function Reservoir() {
        var bs;
        this.setModules = function(_bs) {
          bs = _bs;
        };
        this.ResvFrameBegin = function(gfp, mean_bits) {
          var gfc = gfp.internal_flags;
          var maxmp3buf;
          var l3_side = gfc.l3_side;
          var frameLength = bs.getframebits(gfp);
          mean_bits.bits = (frameLength - gfc.sideinfo_len * 8) / gfc.mode_gr;
          var resvLimit = 8 * 256 * gfc.mode_gr - 8;
          if (gfp.brate > 320) {
            abort();
          } else {
            maxmp3buf = 8 * 1440;
            if (gfp.strict_ISO) {
              abort();
            }
          }
          gfc.ResvMax = maxmp3buf - frameLength;
          if (gfc.ResvMax > resvLimit)
            gfc.ResvMax = resvLimit;
          if (gfc.ResvMax < 0 || gfp.disable_reservoir)
            gfc.ResvMax = 0;
          var fullFrameBits = mean_bits.bits * gfc.mode_gr + Math.min(gfc.ResvSize, gfc.ResvMax);
          if (fullFrameBits > maxmp3buf)
            fullFrameBits = maxmp3buf;
          l3_side.resvDrain_pre = 0;
          if (gfc.pinfo != null) {
            abort();
          }
          return fullFrameBits;
        };
        this.ResvMaxBits = function(gfp, mean_bits, targ_bits, cbr) {
          var gfc = gfp.internal_flags;
          var add_bits;
          var ResvSize = gfc.ResvSize, ResvMax = gfc.ResvMax;
          if (cbr != 0)
            ResvSize += mean_bits;
          if ((gfc.substep_shaping & 1) != 0)
            ResvMax *= 0.9;
          targ_bits.bits = mean_bits;
          if (ResvSize * 10 > ResvMax * 9) {
            add_bits = ResvSize - ResvMax * 9 / 10;
            targ_bits.bits += add_bits;
            gfc.substep_shaping |= 128;
          } else {
            add_bits = 0;
            gfc.substep_shaping &= 127;
            if (!gfp.disable_reservoir && 0 == (gfc.substep_shaping & 1))
              targ_bits.bits -= 0.1 * mean_bits;
          }
          var extra_bits = ResvSize < gfc.ResvMax * 6 / 10 ? ResvSize : gfc.ResvMax * 6 / 10;
          extra_bits -= add_bits;
          if (extra_bits < 0)
            extra_bits = 0;
          return extra_bits;
        };
        this.ResvAdjust = function(gfc, gi) {
          gfc.ResvSize -= gi.part2_3_length + gi.part2_length;
        };
        this.ResvFrameEnd = function(gfc, mean_bits) {
          var over_bits;
          var l3_side = gfc.l3_side;
          gfc.ResvSize += mean_bits * gfc.mode_gr;
          var stuffingBits = 0;
          l3_side.resvDrain_post = 0;
          l3_side.resvDrain_pre = 0;
          if ((over_bits = gfc.ResvSize % 8) != 0)
            stuffingBits += over_bits;
          over_bits = gfc.ResvSize - stuffingBits - gfc.ResvMax;
          if (over_bits > 0) {
            stuffingBits += over_bits;
          }
          {
            var mdb_bytes = Math.min(l3_side.main_data_begin * 8, stuffingBits) / 8;
            l3_side.resvDrain_pre += 8 * mdb_bytes;
            stuffingBits -= 8 * mdb_bytes;
            gfc.ResvSize -= 8 * mdb_bytes;
            l3_side.main_data_begin -= mdb_bytes;
          }
          l3_side.resvDrain_post += stuffingBits;
          gfc.ResvSize -= stuffingBits;
        };
      }
      VBRTag2.NUMTOCENTRIES = 100;
      VBRTag2.MAXFRAMESIZE = 2880;
      function VBRTag2() {
        this.setModules = function(_lame, _bs, _v) {
        };
        var crc16Lookup = [
          0,
          49345,
          49537,
          320,
          49921,
          960,
          640,
          49729,
          50689,
          1728,
          1920,
          51009,
          1280,
          50625,
          50305,
          1088,
          52225,
          3264,
          3456,
          52545,
          3840,
          53185,
          52865,
          3648,
          2560,
          51905,
          52097,
          2880,
          51457,
          2496,
          2176,
          51265,
          55297,
          6336,
          6528,
          55617,
          6912,
          56257,
          55937,
          6720,
          7680,
          57025,
          57217,
          8e3,
          56577,
          7616,
          7296,
          56385,
          5120,
          54465,
          54657,
          5440,
          55041,
          6080,
          5760,
          54849,
          53761,
          4800,
          4992,
          54081,
          4352,
          53697,
          53377,
          4160,
          61441,
          12480,
          12672,
          61761,
          13056,
          62401,
          62081,
          12864,
          13824,
          63169,
          63361,
          14144,
          62721,
          13760,
          13440,
          62529,
          15360,
          64705,
          64897,
          15680,
          65281,
          16320,
          16e3,
          65089,
          64001,
          15040,
          15232,
          64321,
          14592,
          63937,
          63617,
          14400,
          10240,
          59585,
          59777,
          10560,
          60161,
          11200,
          10880,
          59969,
          60929,
          11968,
          12160,
          61249,
          11520,
          60865,
          60545,
          11328,
          58369,
          9408,
          9600,
          58689,
          9984,
          59329,
          59009,
          9792,
          8704,
          58049,
          58241,
          9024,
          57601,
          8640,
          8320,
          57409,
          40961,
          24768,
          24960,
          41281,
          25344,
          41921,
          41601,
          25152,
          26112,
          42689,
          42881,
          26432,
          42241,
          26048,
          25728,
          42049,
          27648,
          44225,
          44417,
          27968,
          44801,
          28608,
          28288,
          44609,
          43521,
          27328,
          27520,
          43841,
          26880,
          43457,
          43137,
          26688,
          30720,
          47297,
          47489,
          31040,
          47873,
          31680,
          31360,
          47681,
          48641,
          32448,
          32640,
          48961,
          32e3,
          48577,
          48257,
          31808,
          46081,
          29888,
          30080,
          46401,
          30464,
          47041,
          46721,
          30272,
          29184,
          45761,
          45953,
          29504,
          45313,
          29120,
          28800,
          45121,
          20480,
          37057,
          37249,
          20800,
          37633,
          21440,
          21120,
          37441,
          38401,
          22208,
          22400,
          38721,
          21760,
          38337,
          38017,
          21568,
          39937,
          23744,
          23936,
          40257,
          24320,
          40897,
          40577,
          24128,
          23040,
          39617,
          39809,
          23360,
          39169,
          22976,
          22656,
          38977,
          34817,
          18624,
          18816,
          35137,
          19200,
          35777,
          35457,
          19008,
          19968,
          36545,
          36737,
          20288,
          36097,
          19904,
          19584,
          35905,
          17408,
          33985,
          34177,
          17728,
          34561,
          18368,
          18048,
          34369,
          33281,
          17088,
          17280,
          33601,
          16640,
          33217,
          32897,
          16448
        ];
        function crcUpdateLookup(value, crc) {
          var tmp = crc ^ value;
          crc = crc >> 8 ^ crc16Lookup[tmp & 255];
          return crc;
        }
        this.updateMusicCRC = function(crc, buffer, bufferPos, size) {
          for (var i = 0; i < size; ++i)
            crc[0] = crcUpdateLookup(buffer[bufferPos + i], crc[0]);
        };
      }
      BitStream.EQ = function(a, b) {
        return Math.abs(a) > Math.abs(b) ? Math.abs(a - b) <= Math.abs(a) * 1e-6 : Math.abs(a - b) <= Math.abs(b) * 1e-6;
      };
      BitStream.NEQ = function(a, b) {
        return !BitStream.EQ(a, b);
      };
      function BitStream() {
        var self2 = this;
        var ver = null;
        var vbr = null;
        this.setModules = function(_ga, _mpg, _ver, _vbr) {
          ver = _ver;
          vbr = _vbr;
        };
        var buf = null;
        var totbit = 0;
        var bufByteIdx = 0;
        var bufBitIdx = 0;
        this.getframebits = function(gfp) {
          var gfc = gfp.internal_flags;
          var bit_rate;
          if (gfc.bitrate_index != 0)
            bit_rate = Tables2.bitrate_table[gfp.version][gfc.bitrate_index];
          else
            bit_rate = gfp.brate;
          var bytes = 0 | (gfp.version + 1) * 72e3 * bit_rate / gfp.out_samplerate + gfc.padding;
          return 8 * bytes;
        };
        function putheader_bits(gfc) {
          System2.arraycopy(gfc.header[gfc.w_ptr].buf, 0, buf, bufByteIdx, gfc.sideinfo_len);
          bufByteIdx += gfc.sideinfo_len;
          totbit += gfc.sideinfo_len * 8;
          gfc.w_ptr = gfc.w_ptr + 1 & LameInternalFlags2.MAX_HEADER_BUF - 1;
        }
        function putbits2(gfc, val, j) {
          while (j > 0) {
            var k2;
            if (bufBitIdx == 0) {
              bufBitIdx = 8;
              bufByteIdx++;
              if (gfc.header[gfc.w_ptr].write_timing == totbit) {
                putheader_bits(gfc);
              }
              buf[bufByteIdx] = 0;
            }
            k2 = Math.min(j, bufBitIdx);
            j -= k2;
            bufBitIdx -= k2;
            buf[bufByteIdx] |= val >> j << bufBitIdx;
            totbit += k2;
          }
        }
        function drain_into_ancillary(gfp, remainingBits) {
          var gfc = gfp.internal_flags;
          var i;
          if (remainingBits >= 8) {
            putbits2(gfc, 76, 8);
            remainingBits -= 8;
          }
          if (remainingBits >= 8) {
            putbits2(gfc, 65, 8);
            remainingBits -= 8;
          }
          if (remainingBits >= 8) {
            putbits2(gfc, 77, 8);
            remainingBits -= 8;
          }
          if (remainingBits >= 8) {
            putbits2(gfc, 69, 8);
            remainingBits -= 8;
          }
          if (remainingBits >= 32) {
            var version = ver.getLameShortVersion();
            if (remainingBits >= 32)
              for (i = 0; i < version.length && remainingBits >= 8; ++i) {
                remainingBits -= 8;
                putbits2(gfc, version.charCodeAt(i), 8);
              }
          }
          for (; remainingBits >= 1; remainingBits -= 1) {
            putbits2(gfc, gfc.ancillary_flag, 1);
            gfc.ancillary_flag ^= !gfp.disable_reservoir ? 1 : 0;
          }
        }
        function writeheader(gfc, val, j) {
          var ptr = gfc.header[gfc.h_ptr].ptr;
          while (j > 0) {
            var k2 = Math.min(j, 8 - (ptr & 7));
            j -= k2;
            gfc.header[gfc.h_ptr].buf[ptr >> 3] |= val >> j << 8 - (ptr & 7) - k2;
            ptr += k2;
          }
          gfc.header[gfc.h_ptr].ptr = ptr;
        }
        function encodeSideInfo2(gfp, bitsPerFrame) {
          var gfc = gfp.internal_flags;
          var l3_side;
          var gr, ch;
          l3_side = gfc.l3_side;
          gfc.header[gfc.h_ptr].ptr = 0;
          Arrays2.fill(gfc.header[gfc.h_ptr].buf, 0, gfc.sideinfo_len, 0);
          if (gfp.out_samplerate < 16e3)
            writeheader(gfc, 4094, 12);
          else
            writeheader(gfc, 4095, 12);
          writeheader(gfc, gfp.version, 1);
          writeheader(gfc, 4 - 3, 2);
          writeheader(gfc, !gfp.error_protection ? 1 : 0, 1);
          writeheader(gfc, gfc.bitrate_index, 4);
          writeheader(gfc, gfc.samplerate_index, 2);
          writeheader(gfc, gfc.padding, 1);
          writeheader(gfc, gfp.extension, 1);
          writeheader(gfc, gfp.mode.ordinal(), 2);
          writeheader(gfc, gfc.mode_ext, 2);
          writeheader(gfc, gfp.copyright, 1);
          writeheader(gfc, gfp.original, 1);
          writeheader(gfc, gfp.emphasis, 2);
          if (gfp.error_protection) {
            writeheader(gfc, 0, 16);
          }
          if (gfp.version == 1) {
            writeheader(gfc, l3_side.main_data_begin, 9);
            if (gfc.channels_out == 2)
              writeheader(gfc, l3_side.private_bits, 3);
            else
              writeheader(gfc, l3_side.private_bits, 5);
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var band;
              for (band = 0; band < 4; band++) {
                writeheader(gfc, l3_side.scfsi[ch][band], 1);
              }
            }
            for (gr = 0; gr < 2; gr++) {
              for (ch = 0; ch < gfc.channels_out; ch++) {
                var gi = l3_side.tt[gr][ch];
                writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
                writeheader(gfc, gi.big_values / 2, 9);
                writeheader(gfc, gi.global_gain, 8);
                writeheader(gfc, gi.scalefac_compress, 4);
                if (gi.block_type != Encoder2.NORM_TYPE) {
                  writeheader(gfc, 1, 1);
                  writeheader(gfc, gi.block_type, 2);
                  writeheader(gfc, gi.mixed_block_flag, 1);
                  if (gi.table_select[0] == 14)
                    gi.table_select[0] = 16;
                  writeheader(gfc, gi.table_select[0], 5);
                  if (gi.table_select[1] == 14)
                    gi.table_select[1] = 16;
                  writeheader(gfc, gi.table_select[1], 5);
                  writeheader(gfc, gi.subblock_gain[0], 3);
                  writeheader(gfc, gi.subblock_gain[1], 3);
                  writeheader(gfc, gi.subblock_gain[2], 3);
                } else {
                  writeheader(gfc, 0, 1);
                  if (gi.table_select[0] == 14)
                    gi.table_select[0] = 16;
                  writeheader(gfc, gi.table_select[0], 5);
                  if (gi.table_select[1] == 14)
                    gi.table_select[1] = 16;
                  writeheader(gfc, gi.table_select[1], 5);
                  if (gi.table_select[2] == 14)
                    gi.table_select[2] = 16;
                  writeheader(gfc, gi.table_select[2], 5);
                  writeheader(gfc, gi.region0_count, 4);
                  writeheader(gfc, gi.region1_count, 3);
                }
                writeheader(gfc, gi.preflag, 1);
                writeheader(gfc, gi.scalefac_scale, 1);
                writeheader(gfc, gi.count1table_select, 1);
              }
            }
          } else {
            writeheader(gfc, l3_side.main_data_begin, 8);
            writeheader(gfc, l3_side.private_bits, gfc.channels_out);
            gr = 0;
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              writeheader(gfc, gi.part2_3_length + gi.part2_length, 12);
              writeheader(gfc, gi.big_values / 2, 9);
              writeheader(gfc, gi.global_gain, 8);
              writeheader(gfc, gi.scalefac_compress, 9);
              if (gi.block_type != Encoder2.NORM_TYPE) {
                writeheader(gfc, 1, 1);
                writeheader(gfc, gi.block_type, 2);
                writeheader(gfc, gi.mixed_block_flag, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                writeheader(gfc, gi.subblock_gain[0], 3);
                writeheader(gfc, gi.subblock_gain[1], 3);
                writeheader(gfc, gi.subblock_gain[2], 3);
              } else {
                writeheader(gfc, 0, 1);
                if (gi.table_select[0] == 14)
                  gi.table_select[0] = 16;
                writeheader(gfc, gi.table_select[0], 5);
                if (gi.table_select[1] == 14)
                  gi.table_select[1] = 16;
                writeheader(gfc, gi.table_select[1], 5);
                if (gi.table_select[2] == 14)
                  gi.table_select[2] = 16;
                writeheader(gfc, gi.table_select[2], 5);
                writeheader(gfc, gi.region0_count, 4);
                writeheader(gfc, gi.region1_count, 3);
              }
              writeheader(gfc, gi.scalefac_scale, 1);
              writeheader(gfc, gi.count1table_select, 1);
            }
          }
          if (gfp.error_protection) {
            abort();
          }
          {
            var old = gfc.h_ptr;
            gfc.h_ptr = old + 1 & LameInternalFlags2.MAX_HEADER_BUF - 1;
            gfc.header[gfc.h_ptr].write_timing = gfc.header[old].write_timing + bitsPerFrame;
            if (gfc.h_ptr == gfc.w_ptr) ;
          }
        }
        function huffman_coder_count1(gfc, gi) {
          var h = Tables2.ht[gi.count1table_select + 32];
          var i, bits = 0;
          var ix = gi.big_values;
          var xr = gi.big_values;
          for (i = (gi.count1 - gi.big_values) / 4; i > 0; --i) {
            var huffbits = 0;
            var p2 = 0, v;
            v = gi.l3_enc[ix + 0];
            if (v != 0) {
              p2 += 8;
              if (gi.xr[xr + 0] < 0)
                huffbits++;
            }
            v = gi.l3_enc[ix + 1];
            if (v != 0) {
              p2 += 4;
              huffbits *= 2;
              if (gi.xr[xr + 1] < 0)
                huffbits++;
            }
            v = gi.l3_enc[ix + 2];
            if (v != 0) {
              p2 += 2;
              huffbits *= 2;
              if (gi.xr[xr + 2] < 0)
                huffbits++;
            }
            v = gi.l3_enc[ix + 3];
            if (v != 0) {
              p2++;
              huffbits *= 2;
              if (gi.xr[xr + 3] < 0)
                huffbits++;
            }
            ix += 4;
            xr += 4;
            putbits2(gfc, huffbits + h.table[p2], h.hlen[p2]);
            bits += h.hlen[p2];
          }
          return bits;
        }
        function Huffmancode(gfc, tableindex, start, end, gi) {
          var h = Tables2.ht[tableindex];
          var bits = 0;
          if (0 == tableindex)
            return bits;
          for (var i = start; i < end; i += 2) {
            var cbits = 0;
            var xbits = 0;
            var linbits = h.xlen;
            var xlen = h.xlen;
            var ext = 0;
            var x1 = gi.l3_enc[i];
            var x2 = gi.l3_enc[i + 1];
            if (x1 != 0) {
              if (gi.xr[i] < 0)
                ext++;
              cbits--;
            }
            if (tableindex > 15) {
              if (x1 > 14) {
                var linbits_x1 = x1 - 15;
                ext |= linbits_x1 << 1;
                xbits = linbits;
                x1 = 15;
              }
              if (x2 > 14) {
                var linbits_x2 = x2 - 15;
                ext <<= linbits;
                ext |= linbits_x2;
                xbits += linbits;
                x2 = 15;
              }
              xlen = 16;
            }
            if (x2 != 0) {
              ext <<= 1;
              if (gi.xr[i + 1] < 0)
                ext++;
              cbits--;
            }
            x1 = x1 * xlen + x2;
            xbits -= cbits;
            cbits += h.hlen[x1];
            putbits2(gfc, h.table[x1], cbits);
            putbits2(gfc, ext, xbits);
            bits += cbits + xbits;
          }
          return bits;
        }
        function ShortHuffmancodebits(gfc, gi) {
          var region1Start = 3 * gfc.scalefac_band.s[3];
          if (region1Start > gi.big_values)
            region1Start = gi.big_values;
          var bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
          bits += Huffmancode(
            gfc,
            gi.table_select[1],
            region1Start,
            gi.big_values,
            gi
          );
          return bits;
        }
        function LongHuffmancodebits(gfc, gi) {
          var bigvalues, bits;
          var region1Start, region2Start;
          bigvalues = gi.big_values;
          var i = gi.region0_count + 1;
          region1Start = gfc.scalefac_band.l[i];
          i += gi.region1_count + 1;
          region2Start = gfc.scalefac_band.l[i];
          if (region1Start > bigvalues)
            region1Start = bigvalues;
          if (region2Start > bigvalues)
            region2Start = bigvalues;
          bits = Huffmancode(gfc, gi.table_select[0], 0, region1Start, gi);
          bits += Huffmancode(
            gfc,
            gi.table_select[1],
            region1Start,
            region2Start,
            gi
          );
          bits += Huffmancode(
            gfc,
            gi.table_select[2],
            region2Start,
            bigvalues,
            gi
          );
          return bits;
        }
        function writeMainData(gfp) {
          var gr, ch, sfb, data_bits, tot_bits = 0;
          var gfc = gfp.internal_flags;
          var l3_side = gfc.l3_side;
          if (gfp.version == 1) {
            for (gr = 0; gr < 2; gr++) {
              for (ch = 0; ch < gfc.channels_out; ch++) {
                var gi = l3_side.tt[gr][ch];
                var slen1 = Takehiro.slen1_tab[gi.scalefac_compress];
                var slen2 = Takehiro.slen2_tab[gi.scalefac_compress];
                data_bits = 0;
                for (sfb = 0; sfb < gi.sfbdivide; sfb++) {
                  if (gi.scalefac[sfb] == -1)
                    continue;
                  putbits2(gfc, gi.scalefac[sfb], slen1);
                  data_bits += slen1;
                }
                for (; sfb < gi.sfbmax; sfb++) {
                  if (gi.scalefac[sfb] == -1)
                    continue;
                  putbits2(gfc, gi.scalefac[sfb], slen2);
                  data_bits += slen2;
                }
                if (gi.block_type == Encoder2.SHORT_TYPE) {
                  data_bits += ShortHuffmancodebits(gfc, gi);
                } else {
                  data_bits += LongHuffmancodebits(gfc, gi);
                }
                data_bits += huffman_coder_count1(gfc, gi);
                tot_bits += data_bits;
              }
            }
          } else {
            gr = 0;
            for (ch = 0; ch < gfc.channels_out; ch++) {
              var gi = l3_side.tt[gr][ch];
              var i, sfb_partition, scale_bits = 0;
              data_bits = 0;
              sfb = 0;
              sfb_partition = 0;
              if (gi.block_type == Encoder2.SHORT_TYPE) {
                for (; sfb_partition < 4; sfb_partition++) {
                  var sfbs = gi.sfb_partition_table[sfb_partition] / 3;
                  var slen = gi.slen[sfb_partition];
                  for (i = 0; i < sfbs; i++, sfb++) {
                    putbits2(
                      gfc,
                      Math.max(gi.scalefac[sfb * 3 + 0], 0),
                      slen
                    );
                    putbits2(
                      gfc,
                      Math.max(gi.scalefac[sfb * 3 + 1], 0),
                      slen
                    );
                    putbits2(
                      gfc,
                      Math.max(gi.scalefac[sfb * 3 + 2], 0),
                      slen
                    );
                    scale_bits += 3 * slen;
                  }
                }
                data_bits += ShortHuffmancodebits(gfc, gi);
              } else {
                for (; sfb_partition < 4; sfb_partition++) {
                  var sfbs = gi.sfb_partition_table[sfb_partition];
                  var slen = gi.slen[sfb_partition];
                  for (i = 0; i < sfbs; i++, sfb++) {
                    putbits2(gfc, Math.max(gi.scalefac[sfb], 0), slen);
                    scale_bits += slen;
                  }
                }
                data_bits += LongHuffmancodebits(gfc, gi);
              }
              data_bits += huffman_coder_count1(gfc, gi);
              tot_bits += scale_bits + data_bits;
            }
          }
          return tot_bits;
        }
        function TotalBytes() {
          this.total = 0;
        }
        function compute_flushbits(gfp, total_bytes_output) {
          var gfc = gfp.internal_flags;
          var flushbits;
          var bitsPerFrame;
          var last_ptr;
          gfc.w_ptr;
          last_ptr = gfc.h_ptr - 1;
          if (last_ptr == -1)
            last_ptr = LameInternalFlags2.MAX_HEADER_BUF - 1;
          flushbits = gfc.header[last_ptr].write_timing - totbit;
          total_bytes_output.total = flushbits;
          if (flushbits >= 0) {
            abort();
          }
          bitsPerFrame = self2.getframebits(gfp);
          flushbits += bitsPerFrame;
          total_bytes_output.total += bitsPerFrame;
          if (total_bytes_output.total % 8 != 0)
            total_bytes_output.total = 1 + total_bytes_output.total / 8;
          else
            total_bytes_output.total = total_bytes_output.total / 8;
          total_bytes_output.total += bufByteIdx + 1;
          return flushbits;
        }
        this.flush_bitstream = function(gfp) {
          var gfc = gfp.internal_flags;
          var l3_side;
          var flushbits;
          gfc.h_ptr - 1;
          l3_side = gfc.l3_side;
          if ((flushbits = compute_flushbits(gfp, new TotalBytes())) < 0)
            return;
          drain_into_ancillary(gfp, flushbits);
          gfc.ResvSize = 0;
          l3_side.main_data_begin = 0;
          if (gfc.findReplayGain) {
            abort();
          }
          if (gfc.findPeakSample) {
            abort();
          }
        };
        this.format_bitstream = function(gfp) {
          var gfc = gfp.internal_flags;
          var l3_side;
          l3_side = gfc.l3_side;
          var bitsPerFrame = this.getframebits(gfp);
          drain_into_ancillary(gfp, l3_side.resvDrain_pre);
          encodeSideInfo2(gfp, bitsPerFrame);
          var bits = 8 * gfc.sideinfo_len;
          bits += writeMainData(gfp);
          drain_into_ancillary(gfp, l3_side.resvDrain_post);
          bits += l3_side.resvDrain_post;
          l3_side.main_data_begin += (bitsPerFrame - bits) / 8;
          if (compute_flushbits(gfp, new TotalBytes()) != gfc.ResvSize) ;
          if (l3_side.main_data_begin * 8 != gfc.ResvSize) {
            gfc.ResvSize = l3_side.main_data_begin * 8;
          }
          if (totbit > 1e9) {
            var i;
            for (i = 0; i < LameInternalFlags2.MAX_HEADER_BUF; ++i)
              gfc.header[i].write_timing -= totbit;
            totbit = 0;
          }
          return 0;
        };
        this.copy_buffer = function(gfc, buffer, bufferPos, size, mp3data) {
          var minimum = bufByteIdx + 1;
          if (minimum <= 0)
            return 0;
          if (size != 0 && minimum > size) {
            return -1;
          }
          System2.arraycopy(buf, 0, buffer, bufferPos, minimum);
          bufByteIdx = -1;
          bufBitIdx = 0;
          if (mp3data != 0) {
            var crc = new_int2(1);
            crc[0] = gfc.nMusicCRC;
            vbr.updateMusicCRC(crc, buffer, bufferPos, minimum);
            gfc.nMusicCRC = crc[0];
            if (minimum > 0) {
              gfc.VBR_seek_table.nBytesWritten += minimum;
            }
            if (gfc.decode_on_the_fly) {
              abort();
            }
          }
          return minimum;
        };
        this.init_bit_stream_w = function(gfc) {
          buf = new_byte2(Lame2.LAME_MAXMP3BUFFER);
          gfc.h_ptr = gfc.w_ptr = 0;
          gfc.header[gfc.h_ptr].write_timing = 0;
          bufByteIdx = -1;
          bufBitIdx = 0;
          totbit = 0;
        };
      }
      function HuffCodeTab2(len, max, tab, hl) {
        this.xlen = len;
        this.linmax = max;
        this.table = tab;
        this.hlen = hl;
      }
      var Tables2 = {};
      Tables2.t1HB = [
        1,
        1,
        1,
        0
      ];
      Tables2.t2HB = [
        1,
        2,
        1,
        3,
        1,
        1,
        3,
        2,
        0
      ];
      Tables2.t3HB = [
        3,
        2,
        1,
        1,
        1,
        1,
        3,
        2,
        0
      ];
      Tables2.t5HB = [
        1,
        2,
        6,
        5,
        3,
        1,
        4,
        4,
        7,
        5,
        7,
        1,
        6,
        1,
        1,
        0
      ];
      Tables2.t6HB = [
        7,
        3,
        5,
        1,
        6,
        2,
        3,
        2,
        5,
        4,
        4,
        1,
        3,
        3,
        2,
        0
      ];
      Tables2.t7HB = [
        1,
        2,
        10,
        19,
        16,
        10,
        3,
        3,
        7,
        10,
        5,
        3,
        11,
        4,
        13,
        17,
        8,
        4,
        12,
        11,
        18,
        15,
        11,
        2,
        7,
        6,
        9,
        14,
        3,
        1,
        6,
        4,
        5,
        3,
        2,
        0
      ];
      Tables2.t8HB = [
        3,
        4,
        6,
        18,
        12,
        5,
        5,
        1,
        2,
        16,
        9,
        3,
        7,
        3,
        5,
        14,
        7,
        3,
        19,
        17,
        15,
        13,
        10,
        4,
        13,
        5,
        8,
        11,
        5,
        1,
        12,
        4,
        4,
        1,
        1,
        0
      ];
      Tables2.t9HB = [
        7,
        5,
        9,
        14,
        15,
        7,
        6,
        4,
        5,
        5,
        6,
        7,
        7,
        6,
        8,
        8,
        8,
        5,
        15,
        6,
        9,
        10,
        5,
        1,
        11,
        7,
        9,
        6,
        4,
        1,
        14,
        4,
        6,
        2,
        6,
        0
      ];
      Tables2.t10HB = [
        1,
        2,
        10,
        23,
        35,
        30,
        12,
        17,
        3,
        3,
        8,
        12,
        18,
        21,
        12,
        7,
        11,
        9,
        15,
        21,
        32,
        40,
        19,
        6,
        14,
        13,
        22,
        34,
        46,
        23,
        18,
        7,
        20,
        19,
        33,
        47,
        27,
        22,
        9,
        3,
        31,
        22,
        41,
        26,
        21,
        20,
        5,
        3,
        14,
        13,
        10,
        11,
        16,
        6,
        5,
        1,
        9,
        8,
        7,
        8,
        4,
        4,
        2,
        0
      ];
      Tables2.t11HB = [
        3,
        4,
        10,
        24,
        34,
        33,
        21,
        15,
        5,
        3,
        4,
        10,
        32,
        17,
        11,
        10,
        11,
        7,
        13,
        18,
        30,
        31,
        20,
        5,
        25,
        11,
        19,
        59,
        27,
        18,
        12,
        5,
        35,
        33,
        31,
        58,
        30,
        16,
        7,
        5,
        28,
        26,
        32,
        19,
        17,
        15,
        8,
        14,
        14,
        12,
        9,
        13,
        14,
        9,
        4,
        1,
        11,
        4,
        6,
        6,
        6,
        3,
        2,
        0
      ];
      Tables2.t12HB = [
        9,
        6,
        16,
        33,
        41,
        39,
        38,
        26,
        7,
        5,
        6,
        9,
        23,
        16,
        26,
        11,
        17,
        7,
        11,
        14,
        21,
        30,
        10,
        7,
        17,
        10,
        15,
        12,
        18,
        28,
        14,
        5,
        32,
        13,
        22,
        19,
        18,
        16,
        9,
        5,
        40,
        17,
        31,
        29,
        17,
        13,
        4,
        2,
        27,
        12,
        11,
        15,
        10,
        7,
        4,
        1,
        27,
        12,
        8,
        12,
        6,
        3,
        1,
        0
      ];
      Tables2.t13HB = [
        1,
        5,
        14,
        21,
        34,
        51,
        46,
        71,
        42,
        52,
        68,
        52,
        67,
        44,
        43,
        19,
        3,
        4,
        12,
        19,
        31,
        26,
        44,
        33,
        31,
        24,
        32,
        24,
        31,
        35,
        22,
        14,
        15,
        13,
        23,
        36,
        59,
        49,
        77,
        65,
        29,
        40,
        30,
        40,
        27,
        33,
        42,
        16,
        22,
        20,
        37,
        61,
        56,
        79,
        73,
        64,
        43,
        76,
        56,
        37,
        26,
        31,
        25,
        14,
        35,
        16,
        60,
        57,
        97,
        75,
        114,
        91,
        54,
        73,
        55,
        41,
        48,
        53,
        23,
        24,
        58,
        27,
        50,
        96,
        76,
        70,
        93,
        84,
        77,
        58,
        79,
        29,
        74,
        49,
        41,
        17,
        47,
        45,
        78,
        74,
        115,
        94,
        90,
        79,
        69,
        83,
        71,
        50,
        59,
        38,
        36,
        15,
        72,
        34,
        56,
        95,
        92,
        85,
        91,
        90,
        86,
        73,
        77,
        65,
        51,
        44,
        43,
        42,
        43,
        20,
        30,
        44,
        55,
        78,
        72,
        87,
        78,
        61,
        46,
        54,
        37,
        30,
        20,
        16,
        53,
        25,
        41,
        37,
        44,
        59,
        54,
        81,
        66,
        76,
        57,
        54,
        37,
        18,
        39,
        11,
        35,
        33,
        31,
        57,
        42,
        82,
        72,
        80,
        47,
        58,
        55,
        21,
        22,
        26,
        38,
        22,
        53,
        25,
        23,
        38,
        70,
        60,
        51,
        36,
        55,
        26,
        34,
        23,
        27,
        14,
        9,
        7,
        34,
        32,
        28,
        39,
        49,
        75,
        30,
        52,
        48,
        40,
        52,
        28,
        18,
        17,
        9,
        5,
        45,
        21,
        34,
        64,
        56,
        50,
        49,
        45,
        31,
        19,
        12,
        15,
        10,
        7,
        6,
        3,
        48,
        23,
        20,
        39,
        36,
        35,
        53,
        21,
        16,
        23,
        13,
        10,
        6,
        1,
        4,
        2,
        16,
        15,
        17,
        27,
        25,
        20,
        29,
        11,
        17,
        12,
        16,
        8,
        1,
        1,
        0,
        1
      ];
      Tables2.t15HB = [
        7,
        12,
        18,
        53,
        47,
        76,
        124,
        108,
        89,
        123,
        108,
        119,
        107,
        81,
        122,
        63,
        13,
        5,
        16,
        27,
        46,
        36,
        61,
        51,
        42,
        70,
        52,
        83,
        65,
        41,
        59,
        36,
        19,
        17,
        15,
        24,
        41,
        34,
        59,
        48,
        40,
        64,
        50,
        78,
        62,
        80,
        56,
        33,
        29,
        28,
        25,
        43,
        39,
        63,
        55,
        93,
        76,
        59,
        93,
        72,
        54,
        75,
        50,
        29,
        52,
        22,
        42,
        40,
        67,
        57,
        95,
        79,
        72,
        57,
        89,
        69,
        49,
        66,
        46,
        27,
        77,
        37,
        35,
        66,
        58,
        52,
        91,
        74,
        62,
        48,
        79,
        63,
        90,
        62,
        40,
        38,
        125,
        32,
        60,
        56,
        50,
        92,
        78,
        65,
        55,
        87,
        71,
        51,
        73,
        51,
        70,
        30,
        109,
        53,
        49,
        94,
        88,
        75,
        66,
        122,
        91,
        73,
        56,
        42,
        64,
        44,
        21,
        25,
        90,
        43,
        41,
        77,
        73,
        63,
        56,
        92,
        77,
        66,
        47,
        67,
        48,
        53,
        36,
        20,
        71,
        34,
        67,
        60,
        58,
        49,
        88,
        76,
        67,
        106,
        71,
        54,
        38,
        39,
        23,
        15,
        109,
        53,
        51,
        47,
        90,
        82,
        58,
        57,
        48,
        72,
        57,
        41,
        23,
        27,
        62,
        9,
        86,
        42,
        40,
        37,
        70,
        64,
        52,
        43,
        70,
        55,
        42,
        25,
        29,
        18,
        11,
        11,
        118,
        68,
        30,
        55,
        50,
        46,
        74,
        65,
        49,
        39,
        24,
        16,
        22,
        13,
        14,
        7,
        91,
        44,
        39,
        38,
        34,
        63,
        52,
        45,
        31,
        52,
        28,
        19,
        14,
        8,
        9,
        3,
        123,
        60,
        58,
        53,
        47,
        43,
        32,
        22,
        37,
        24,
        17,
        12,
        15,
        10,
        2,
        1,
        71,
        37,
        34,
        30,
        28,
        20,
        17,
        26,
        21,
        16,
        10,
        6,
        8,
        6,
        2,
        0
      ];
      Tables2.t16HB = [
        1,
        5,
        14,
        44,
        74,
        63,
        110,
        93,
        172,
        149,
        138,
        242,
        225,
        195,
        376,
        17,
        3,
        4,
        12,
        20,
        35,
        62,
        53,
        47,
        83,
        75,
        68,
        119,
        201,
        107,
        207,
        9,
        15,
        13,
        23,
        38,
        67,
        58,
        103,
        90,
        161,
        72,
        127,
        117,
        110,
        209,
        206,
        16,
        45,
        21,
        39,
        69,
        64,
        114,
        99,
        87,
        158,
        140,
        252,
        212,
        199,
        387,
        365,
        26,
        75,
        36,
        68,
        65,
        115,
        101,
        179,
        164,
        155,
        264,
        246,
        226,
        395,
        382,
        362,
        9,
        66,
        30,
        59,
        56,
        102,
        185,
        173,
        265,
        142,
        253,
        232,
        400,
        388,
        378,
        445,
        16,
        111,
        54,
        52,
        100,
        184,
        178,
        160,
        133,
        257,
        244,
        228,
        217,
        385,
        366,
        715,
        10,
        98,
        48,
        91,
        88,
        165,
        157,
        148,
        261,
        248,
        407,
        397,
        372,
        380,
        889,
        884,
        8,
        85,
        84,
        81,
        159,
        156,
        143,
        260,
        249,
        427,
        401,
        392,
        383,
        727,
        713,
        708,
        7,
        154,
        76,
        73,
        141,
        131,
        256,
        245,
        426,
        406,
        394,
        384,
        735,
        359,
        710,
        352,
        11,
        139,
        129,
        67,
        125,
        247,
        233,
        229,
        219,
        393,
        743,
        737,
        720,
        885,
        882,
        439,
        4,
        243,
        120,
        118,
        115,
        227,
        223,
        396,
        746,
        742,
        736,
        721,
        712,
        706,
        223,
        436,
        6,
        202,
        224,
        222,
        218,
        216,
        389,
        386,
        381,
        364,
        888,
        443,
        707,
        440,
        437,
        1728,
        4,
        747,
        211,
        210,
        208,
        370,
        379,
        734,
        723,
        714,
        1735,
        883,
        877,
        876,
        3459,
        865,
        2,
        377,
        369,
        102,
        187,
        726,
        722,
        358,
        711,
        709,
        866,
        1734,
        871,
        3458,
        870,
        434,
        0,
        12,
        10,
        7,
        11,
        10,
        17,
        11,
        9,
        13,
        12,
        10,
        7,
        5,
        3,
        1,
        3
      ];
      Tables2.t24HB = [
        15,
        13,
        46,
        80,
        146,
        262,
        248,
        434,
        426,
        669,
        653,
        649,
        621,
        517,
        1032,
        88,
        14,
        12,
        21,
        38,
        71,
        130,
        122,
        216,
        209,
        198,
        327,
        345,
        319,
        297,
        279,
        42,
        47,
        22,
        41,
        74,
        68,
        128,
        120,
        221,
        207,
        194,
        182,
        340,
        315,
        295,
        541,
        18,
        81,
        39,
        75,
        70,
        134,
        125,
        116,
        220,
        204,
        190,
        178,
        325,
        311,
        293,
        271,
        16,
        147,
        72,
        69,
        135,
        127,
        118,
        112,
        210,
        200,
        188,
        352,
        323,
        306,
        285,
        540,
        14,
        263,
        66,
        129,
        126,
        119,
        114,
        214,
        202,
        192,
        180,
        341,
        317,
        301,
        281,
        262,
        12,
        249,
        123,
        121,
        117,
        113,
        215,
        206,
        195,
        185,
        347,
        330,
        308,
        291,
        272,
        520,
        10,
        435,
        115,
        111,
        109,
        211,
        203,
        196,
        187,
        353,
        332,
        313,
        298,
        283,
        531,
        381,
        17,
        427,
        212,
        208,
        205,
        201,
        193,
        186,
        177,
        169,
        320,
        303,
        286,
        268,
        514,
        377,
        16,
        335,
        199,
        197,
        191,
        189,
        181,
        174,
        333,
        321,
        305,
        289,
        275,
        521,
        379,
        371,
        11,
        668,
        184,
        183,
        179,
        175,
        344,
        331,
        314,
        304,
        290,
        277,
        530,
        383,
        373,
        366,
        10,
        652,
        346,
        171,
        168,
        164,
        318,
        309,
        299,
        287,
        276,
        263,
        513,
        375,
        368,
        362,
        6,
        648,
        322,
        316,
        312,
        307,
        302,
        292,
        284,
        269,
        261,
        512,
        376,
        370,
        364,
        359,
        4,
        620,
        300,
        296,
        294,
        288,
        282,
        273,
        266,
        515,
        380,
        374,
        369,
        365,
        361,
        357,
        2,
        1033,
        280,
        278,
        274,
        267,
        264,
        259,
        382,
        378,
        372,
        367,
        363,
        360,
        358,
        356,
        0,
        43,
        20,
        19,
        17,
        15,
        13,
        11,
        9,
        7,
        6,
        4,
        7,
        5,
        3,
        1,
        3
      ];
      Tables2.t32HB = [
        1 << 0,
        5 << 1,
        4 << 1,
        5 << 2,
        6 << 1,
        5 << 2,
        4 << 2,
        4 << 3,
        7 << 1,
        3 << 2,
        6 << 2,
        0 << 3,
        7 << 2,
        2 << 3,
        3 << 3,
        1 << 4
      ];
      Tables2.t33HB = [
        15 << 0,
        14 << 1,
        13 << 1,
        12 << 2,
        11 << 1,
        10 << 2,
        9 << 2,
        8 << 3,
        7 << 1,
        6 << 2,
        5 << 2,
        4 << 3,
        3 << 2,
        2 << 3,
        1 << 3,
        0 << 4
      ];
      Tables2.t1l = [
        1,
        4,
        3,
        5
      ];
      Tables2.t2l = [
        1,
        4,
        7,
        4,
        5,
        7,
        6,
        7,
        8
      ];
      Tables2.t3l = [
        2,
        3,
        7,
        4,
        4,
        7,
        6,
        7,
        8
      ];
      Tables2.t5l = [
        1,
        4,
        7,
        8,
        4,
        5,
        8,
        9,
        7,
        8,
        9,
        10,
        8,
        8,
        9,
        10
      ];
      Tables2.t6l = [
        3,
        4,
        6,
        8,
        4,
        4,
        6,
        7,
        5,
        6,
        7,
        8,
        7,
        7,
        8,
        9
      ];
      Tables2.t7l = [
        1,
        4,
        7,
        9,
        9,
        10,
        4,
        6,
        8,
        9,
        9,
        10,
        7,
        7,
        9,
        10,
        10,
        11,
        8,
        9,
        10,
        11,
        11,
        11,
        8,
        9,
        10,
        11,
        11,
        12,
        9,
        10,
        11,
        12,
        12,
        12
      ];
      Tables2.t8l = [
        2,
        4,
        7,
        9,
        9,
        10,
        4,
        4,
        6,
        10,
        10,
        10,
        7,
        6,
        8,
        10,
        10,
        11,
        9,
        10,
        10,
        11,
        11,
        12,
        9,
        9,
        10,
        11,
        12,
        12,
        10,
        10,
        11,
        11,
        13,
        13
      ];
      Tables2.t9l = [
        3,
        4,
        6,
        7,
        9,
        10,
        4,
        5,
        6,
        7,
        8,
        10,
        5,
        6,
        7,
        8,
        9,
        10,
        7,
        7,
        8,
        9,
        9,
        10,
        8,
        8,
        9,
        9,
        10,
        11,
        9,
        9,
        10,
        10,
        11,
        11
      ];
      Tables2.t10l = [
        1,
        4,
        7,
        9,
        10,
        10,
        10,
        11,
        4,
        6,
        8,
        9,
        10,
        11,
        10,
        10,
        7,
        8,
        9,
        10,
        11,
        12,
        11,
        11,
        8,
        9,
        10,
        11,
        12,
        12,
        11,
        12,
        9,
        10,
        11,
        12,
        12,
        12,
        12,
        12,
        10,
        11,
        12,
        12,
        13,
        13,
        12,
        13,
        9,
        10,
        11,
        12,
        12,
        12,
        13,
        13,
        10,
        10,
        11,
        12,
        12,
        13,
        13,
        13
      ];
      Tables2.t11l = [
        2,
        4,
        6,
        8,
        9,
        10,
        9,
        10,
        4,
        5,
        6,
        8,
        10,
        10,
        9,
        10,
        6,
        7,
        8,
        9,
        10,
        11,
        10,
        10,
        8,
        8,
        9,
        11,
        10,
        12,
        10,
        11,
        9,
        10,
        10,
        11,
        11,
        12,
        11,
        12,
        9,
        10,
        11,
        12,
        12,
        13,
        12,
        13,
        9,
        9,
        9,
        10,
        11,
        12,
        12,
        12,
        9,
        9,
        10,
        11,
        12,
        12,
        12,
        12
      ];
      Tables2.t12l = [
        4,
        4,
        6,
        8,
        9,
        10,
        10,
        10,
        4,
        5,
        6,
        7,
        9,
        9,
        10,
        10,
        6,
        6,
        7,
        8,
        9,
        10,
        9,
        10,
        7,
        7,
        8,
        8,
        9,
        10,
        10,
        10,
        8,
        8,
        9,
        9,
        10,
        10,
        10,
        11,
        9,
        9,
        10,
        10,
        10,
        11,
        10,
        11,
        9,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12
      ];
      Tables2.t13l = [
        1,
        5,
        7,
        8,
        9,
        10,
        10,
        11,
        10,
        11,
        12,
        12,
        13,
        13,
        14,
        14,
        4,
        6,
        8,
        9,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        13,
        14,
        14,
        14,
        7,
        8,
        9,
        10,
        11,
        11,
        12,
        12,
        11,
        12,
        12,
        13,
        13,
        14,
        15,
        15,
        8,
        9,
        10,
        11,
        11,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        15,
        15,
        9,
        9,
        11,
        11,
        12,
        12,
        13,
        13,
        12,
        13,
        13,
        14,
        14,
        15,
        15,
        16,
        10,
        10,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        13,
        15,
        15,
        16,
        16,
        10,
        11,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        15,
        15,
        16,
        16,
        11,
        11,
        12,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        15,
        16,
        18,
        18,
        10,
        10,
        11,
        12,
        12,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        16,
        17,
        17,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        15,
        14,
        15,
        15,
        16,
        16,
        16,
        18,
        17,
        11,
        12,
        12,
        13,
        13,
        14,
        14,
        15,
        14,
        15,
        16,
        15,
        16,
        17,
        18,
        19,
        12,
        12,
        12,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        15,
        16,
        17,
        17,
        17,
        18,
        12,
        13,
        13,
        14,
        14,
        15,
        14,
        15,
        16,
        16,
        17,
        17,
        17,
        18,
        18,
        18,
        13,
        13,
        14,
        15,
        15,
        15,
        16,
        16,
        16,
        16,
        16,
        17,
        18,
        17,
        18,
        18,
        14,
        14,
        14,
        15,
        15,
        15,
        17,
        16,
        16,
        19,
        17,
        17,
        17,
        19,
        18,
        18,
        13,
        14,
        15,
        16,
        16,
        16,
        17,
        16,
        17,
        17,
        18,
        18,
        21,
        20,
        21,
        18
      ];
      Tables2.t15l = [
        3,
        5,
        6,
        8,
        8,
        9,
        10,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        14,
        5,
        5,
        7,
        8,
        9,
        9,
        10,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        6,
        7,
        7,
        8,
        9,
        9,
        10,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        9,
        9,
        9,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        10,
        9,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        14,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        14,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        15,
        14,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        15,
        12,
        12,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        13,
        14,
        14,
        15,
        15,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        14,
        15,
        15,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        14,
        15,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        14,
        15,
        15,
        15,
        15
      ];
      Tables2.t16_5l = [
        1,
        5,
        7,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        14,
        11,
        4,
        6,
        8,
        9,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        14,
        13,
        14,
        11,
        7,
        8,
        9,
        10,
        11,
        11,
        12,
        12,
        13,
        12,
        13,
        13,
        13,
        14,
        14,
        12,
        9,
        9,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        14,
        15,
        15,
        13,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        14,
        15,
        15,
        15,
        12,
        10,
        10,
        11,
        11,
        12,
        13,
        13,
        14,
        13,
        14,
        14,
        15,
        15,
        15,
        16,
        13,
        11,
        11,
        11,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        16,
        13,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        17,
        17,
        13,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        16,
        16,
        16,
        13,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        16,
        15,
        16,
        15,
        14,
        12,
        13,
        12,
        13,
        14,
        14,
        14,
        14,
        15,
        16,
        16,
        16,
        17,
        17,
        16,
        13,
        13,
        13,
        13,
        13,
        14,
        14,
        15,
        16,
        16,
        16,
        16,
        16,
        16,
        15,
        16,
        14,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        15,
        15,
        17,
        16,
        16,
        16,
        16,
        18,
        14,
        15,
        14,
        14,
        14,
        15,
        15,
        16,
        16,
        16,
        18,
        17,
        17,
        17,
        19,
        17,
        14,
        14,
        15,
        13,
        14,
        16,
        16,
        15,
        16,
        16,
        17,
        18,
        17,
        19,
        17,
        16,
        14,
        11,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        14,
        14,
        14,
        12
      ];
      Tables2.t16l = [
        1,
        5,
        7,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        14,
        10,
        4,
        6,
        8,
        9,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        14,
        13,
        14,
        10,
        7,
        8,
        9,
        10,
        11,
        11,
        12,
        12,
        13,
        12,
        13,
        13,
        13,
        14,
        14,
        11,
        9,
        9,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        14,
        15,
        15,
        12,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        14,
        15,
        15,
        15,
        11,
        10,
        10,
        11,
        11,
        12,
        13,
        13,
        14,
        13,
        14,
        14,
        15,
        15,
        15,
        16,
        12,
        11,
        11,
        11,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        16,
        12,
        11,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        17,
        17,
        12,
        11,
        12,
        12,
        13,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        16,
        16,
        16,
        12,
        12,
        12,
        12,
        13,
        13,
        14,
        14,
        15,
        15,
        15,
        15,
        16,
        15,
        16,
        15,
        13,
        12,
        13,
        12,
        13,
        14,
        14,
        14,
        14,
        15,
        16,
        16,
        16,
        17,
        17,
        16,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        15,
        16,
        16,
        16,
        16,
        16,
        16,
        15,
        16,
        13,
        13,
        14,
        14,
        14,
        14,
        15,
        15,
        15,
        15,
        17,
        16,
        16,
        16,
        16,
        18,
        13,
        15,
        14,
        14,
        14,
        15,
        15,
        16,
        16,
        16,
        18,
        17,
        17,
        17,
        19,
        17,
        13,
        14,
        15,
        13,
        14,
        16,
        16,
        15,
        16,
        16,
        17,
        18,
        17,
        19,
        17,
        16,
        13,
        10,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        10
      ];
      Tables2.t24l = [
        4,
        5,
        7,
        8,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        10,
        5,
        6,
        7,
        8,
        9,
        10,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        10,
        7,
        7,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        13,
        9,
        8,
        8,
        9,
        9,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        9,
        9,
        9,
        9,
        10,
        10,
        10,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        13,
        9,
        10,
        9,
        10,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        9,
        10,
        10,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        9,
        11,
        10,
        10,
        10,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        10,
        11,
        11,
        11,
        11,
        11,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        13,
        13,
        10,
        11,
        11,
        11,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        10,
        12,
        11,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        10,
        12,
        12,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        10,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        10,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        10,
        13,
        12,
        12,
        12,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        13,
        10,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        9,
        10,
        10,
        10,
        10,
        6
      ];
      Tables2.t32l = [
        1 + 0,
        4 + 1,
        4 + 1,
        5 + 2,
        4 + 1,
        6 + 2,
        5 + 2,
        6 + 3,
        4 + 1,
        5 + 2,
        5 + 2,
        6 + 3,
        5 + 2,
        6 + 3,
        6 + 3,
        6 + 4
      ];
      Tables2.t33l = [
        4 + 0,
        4 + 1,
        4 + 1,
        4 + 2,
        4 + 1,
        4 + 2,
        4 + 2,
        4 + 3,
        4 + 1,
        4 + 2,
        4 + 2,
        4 + 3,
        4 + 2,
        4 + 3,
        4 + 3,
        4 + 4
      ];
      Tables2.ht = [
        /* xlen, linmax, table, hlen */
        new HuffCodeTab2(0, 0, null, null),
        new HuffCodeTab2(2, 0, Tables2.t1HB, Tables2.t1l),
        new HuffCodeTab2(3, 0, Tables2.t2HB, Tables2.t2l),
        new HuffCodeTab2(3, 0, Tables2.t3HB, Tables2.t3l),
        new HuffCodeTab2(0, 0, null, null),
        /* Apparently not used */
        new HuffCodeTab2(4, 0, Tables2.t5HB, Tables2.t5l),
        new HuffCodeTab2(4, 0, Tables2.t6HB, Tables2.t6l),
        new HuffCodeTab2(6, 0, Tables2.t7HB, Tables2.t7l),
        new HuffCodeTab2(6, 0, Tables2.t8HB, Tables2.t8l),
        new HuffCodeTab2(6, 0, Tables2.t9HB, Tables2.t9l),
        new HuffCodeTab2(8, 0, Tables2.t10HB, Tables2.t10l),
        new HuffCodeTab2(8, 0, Tables2.t11HB, Tables2.t11l),
        new HuffCodeTab2(8, 0, Tables2.t12HB, Tables2.t12l),
        new HuffCodeTab2(16, 0, Tables2.t13HB, Tables2.t13l),
        new HuffCodeTab2(0, 0, null, Tables2.t16_5l),
        /* Apparently not used */
        new HuffCodeTab2(16, 0, Tables2.t15HB, Tables2.t15l),
        new HuffCodeTab2(1, 1, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(2, 3, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(3, 7, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(4, 15, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(6, 63, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(8, 255, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(10, 1023, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(13, 8191, Tables2.t16HB, Tables2.t16l),
        new HuffCodeTab2(4, 15, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(5, 31, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(6, 63, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(7, 127, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(8, 255, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(9, 511, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(11, 2047, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(13, 8191, Tables2.t24HB, Tables2.t24l),
        new HuffCodeTab2(0, 0, Tables2.t32HB, Tables2.t32l),
        new HuffCodeTab2(0, 0, Tables2.t33HB, Tables2.t33l)
      ];
      Tables2.largetbl = [
        65540,
        327685,
        458759,
        589832,
        655369,
        655370,
        720906,
        720907,
        786443,
        786444,
        786444,
        851980,
        851980,
        851980,
        917517,
        655370,
        262149,
        393222,
        524295,
        589832,
        655369,
        720906,
        720906,
        720907,
        786443,
        786443,
        786444,
        851980,
        917516,
        851980,
        917516,
        655370,
        458759,
        524295,
        589832,
        655369,
        720905,
        720906,
        786442,
        786443,
        851979,
        786443,
        851979,
        851980,
        851980,
        917516,
        917517,
        720905,
        589832,
        589832,
        655369,
        720905,
        720906,
        786442,
        786442,
        786443,
        851979,
        851979,
        917515,
        917516,
        917516,
        983052,
        983052,
        786441,
        655369,
        655369,
        720905,
        720906,
        786442,
        786442,
        851978,
        851979,
        851979,
        917515,
        917516,
        917516,
        983052,
        983052,
        983053,
        720905,
        655370,
        655369,
        720906,
        720906,
        786442,
        851978,
        851979,
        917515,
        851979,
        917515,
        917516,
        983052,
        983052,
        983052,
        1048588,
        786441,
        720906,
        720906,
        720906,
        786442,
        851978,
        851979,
        851979,
        851979,
        917515,
        917516,
        917516,
        917516,
        983052,
        983052,
        1048589,
        786441,
        720907,
        720906,
        786442,
        786442,
        851979,
        851979,
        851979,
        917515,
        917516,
        983052,
        983052,
        983052,
        983052,
        1114125,
        1114125,
        786442,
        720907,
        786443,
        786443,
        851979,
        851979,
        851979,
        917515,
        917515,
        983051,
        983052,
        983052,
        983052,
        1048588,
        1048589,
        1048589,
        786442,
        786443,
        786443,
        786443,
        851979,
        851979,
        917515,
        917515,
        983052,
        983052,
        983052,
        983052,
        1048588,
        983053,
        1048589,
        983053,
        851978,
        786444,
        851979,
        786443,
        851979,
        917515,
        917516,
        917516,
        917516,
        983052,
        1048588,
        1048588,
        1048589,
        1114125,
        1114125,
        1048589,
        786442,
        851980,
        851980,
        851979,
        851979,
        917515,
        917516,
        983052,
        1048588,
        1048588,
        1048588,
        1048588,
        1048589,
        1048589,
        983053,
        1048589,
        851978,
        851980,
        917516,
        917516,
        917516,
        917516,
        983052,
        983052,
        983052,
        983052,
        1114124,
        1048589,
        1048589,
        1048589,
        1048589,
        1179661,
        851978,
        983052,
        917516,
        917516,
        917516,
        983052,
        983052,
        1048588,
        1048588,
        1048589,
        1179661,
        1114125,
        1114125,
        1114125,
        1245197,
        1114125,
        851978,
        917517,
        983052,
        851980,
        917516,
        1048588,
        1048588,
        983052,
        1048589,
        1048589,
        1114125,
        1179661,
        1114125,
        1245197,
        1114125,
        1048589,
        851978,
        655369,
        655369,
        655369,
        720905,
        720905,
        786441,
        786441,
        786441,
        851977,
        851977,
        851977,
        851978,
        851978,
        851978,
        851978,
        655366
      ];
      Tables2.table23 = [
        65538,
        262147,
        458759,
        262148,
        327684,
        458759,
        393222,
        458759,
        524296
      ];
      Tables2.table56 = [
        65539,
        262148,
        458758,
        524296,
        262148,
        327684,
        524294,
        589831,
        458757,
        524294,
        589831,
        655368,
        524295,
        524295,
        589832,
        655369
      ];
      Tables2.bitrate_table = [
        [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1],
        /* MPEG 2 */
        [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1],
        /* MPEG 1 */
        [0, 8, 16, 24, 32, 40, 48, 56, 64, -1, -1, -1, -1, -1, -1, -1]
        /* MPEG 2.5 */
      ];
      Tables2.samplerate_table = [
        [22050, 24e3, 16e3, -1],
        [44100, 48e3, 32e3, -1],
        [11025, 12e3, 8e3, -1]
      ];
      Tables2.scfsi_band = [0, 6, 11, 16, 21];
      function MeanBits2(meanBits) {
        this.bits = meanBits;
      }
      function CalcNoiseResult2() {
        this.over_noise = 0;
        this.tot_noise = 0;
        this.max_noise = 0;
        this.over_count = 0;
        this.over_SSD = 0;
        this.bits = 0;
      }
      function VBRQuantize() {
        this.setModules = function(_qupvt, _tk) {
        };
      }
      function ATH2() {
        this.useAdjust = 0;
        this.aaSensitivityP = 0;
        this.adjust = 0;
        this.adjustLimit = 0;
        this.decay = 0;
        this.floor = 0;
        this.l = new_float2(Encoder2.SBMAX_l);
        this.s = new_float2(Encoder2.SBMAX_s);
        this.psfb21 = new_float2(Encoder2.PSFB21);
        this.psfb12 = new_float2(Encoder2.PSFB12);
        this.cb_l = new_float2(Encoder2.CBANDS);
        this.cb_s = new_float2(Encoder2.CBANDS);
        this.eql_w = new_float2(Encoder2.BLKSIZE / 2);
      }
      function LameGlobalFlags2() {
        this.class_id = 0;
        this.num_samples = 0;
        this.num_channels = 0;
        this.in_samplerate = 0;
        this.out_samplerate = 0;
        this.scale = 0;
        this.scale_left = 0;
        this.scale_right = 0;
        this.analysis = false;
        this.bWriteVbrTag = false;
        this.decode_only = false;
        this.quality = 0;
        this.mode = MPEGMode2.STEREO;
        this.force_ms = false;
        this.free_format = false;
        this.findReplayGain = false;
        this.decode_on_the_fly = false;
        this.write_id3tag_automatic = false;
        this.brate = 0;
        this.compression_ratio = 0;
        this.copyright = 0;
        this.original = 0;
        this.extension = 0;
        this.emphasis = 0;
        this.error_protection = 0;
        this.strict_ISO = false;
        this.disable_reservoir = false;
        this.quant_comp = 0;
        this.quant_comp_short = 0;
        this.experimentalY = false;
        this.experimentalZ = 0;
        this.exp_nspsytune = 0;
        this.preset = 0;
        this.VBR = null;
        this.VBR_q_frac = 0;
        this.VBR_q = 0;
        this.VBR_mean_bitrate_kbps = 0;
        this.VBR_min_bitrate_kbps = 0;
        this.VBR_max_bitrate_kbps = 0;
        this.VBR_hard_min = 0;
        this.lowpassfreq = 0;
        this.highpassfreq = 0;
        this.lowpasswidth = 0;
        this.highpasswidth = 0;
        this.maskingadjust = 0;
        this.maskingadjust_short = 0;
        this.ATHonly = false;
        this.ATHshort = false;
        this.noATH = false;
        this.ATHtype = 0;
        this.ATHcurve = 0;
        this.ATHlower = 0;
        this.athaa_type = 0;
        this.athaa_loudapprox = 0;
        this.athaa_sensitivity = 0;
        this.short_blocks = null;
        this.useTemporal = false;
        this.interChRatio = 0;
        this.msfix = 0;
        this.tune = false;
        this.tune_value_a = 0;
        this.version = 0;
        this.encoder_delay = 0;
        this.encoder_padding = 0;
        this.framesize = 0;
        this.frameNum = 0;
        this.lame_allocated_gfp = 0;
        this.internal_flags = null;
      }
      function CBRNewIterationLoop2(_quantize) {
        var quantize = _quantize;
        this.quantize = quantize;
        this.iteration_loop = function(gfp, pe, ms_ener_ratio, ratio) {
          var gfc = gfp.internal_flags;
          var l3_xmin = new_float2(L3Side2.SFBMAX);
          var xrpow = new_float2(576);
          var targ_bits = new_int2(2);
          var mean_bits = 0;
          var l3_side = gfc.l3_side;
          var mb = new MeanBits2(mean_bits);
          this.quantize.rv.ResvFrameBegin(gfp, mb);
          mean_bits = mb.bits;
          for (var gr = 0; gr < gfc.mode_gr; gr++) {
            this.quantize.qupvt.on_pe(
              gfp,
              pe,
              targ_bits,
              mean_bits,
              gr,
              gr
            );
            if (gfc.mode_ext == Encoder2.MPG_MD_MS_LR) {
              abort();
            }
            for (var ch = 0; ch < gfc.channels_out; ch++) {
              var adjust, masking_lower_db;
              var cod_info = l3_side.tt[gr][ch];
              if (cod_info.block_type != Encoder2.SHORT_TYPE) {
                adjust = 0;
                masking_lower_db = gfc.PSY.mask_adjust - adjust;
              } else {
                adjust = 0;
                masking_lower_db = gfc.PSY.mask_adjust_short - adjust;
              }
              gfc.masking_lower = Math.pow(
                10,
                masking_lower_db * 0.1
              );
              this.quantize.init_outer_loop(gfc, cod_info);
              if (this.quantize.init_xrpow(gfc, cod_info, xrpow)) {
                this.quantize.qupvt.calc_xmin(
                  gfp,
                  ratio[gr][ch],
                  cod_info,
                  l3_xmin
                );
                this.quantize.outer_loop(
                  gfp,
                  cod_info,
                  l3_xmin,
                  xrpow,
                  ch,
                  targ_bits[ch]
                );
              }
              this.quantize.iteration_finish_one(gfc, gr, ch);
            }
          }
          this.quantize.rv.ResvFrameEnd(gfc, mean_bits);
        };
      }
      function ReplayGain2() {
      }
      function ScaleFac2(arrL, arrS, arr21, arr12) {
        this.l = new_int2(1 + Encoder2.SBMAX_l);
        this.s = new_int2(1 + Encoder2.SBMAX_s);
        this.psfb21 = new_int2(1 + Encoder2.PSFB21);
        this.psfb12 = new_int2(1 + Encoder2.PSFB12);
        var l2 = this.l;
        var s = this.s;
        if (arguments.length == 4) {
          this.arrL = arguments[0];
          this.arrS = arguments[1];
          this.arr21 = arguments[2];
          this.arr12 = arguments[3];
          System2.arraycopy(this.arrL, 0, l2, 0, Math.min(this.arrL.length, this.l.length));
          System2.arraycopy(this.arrS, 0, s, 0, Math.min(this.arrS.length, this.s.length));
          System2.arraycopy(this.arr21, 0, this.psfb21, 0, Math.min(this.arr21.length, this.psfb21.length));
          System2.arraycopy(this.arr12, 0, this.psfb12, 0, Math.min(this.arr12.length, this.psfb12.length));
        }
      }
      QuantizePVT.Q_MAX = 256 + 1;
      QuantizePVT.Q_MAX2 = 116;
      QuantizePVT.LARGE_BITS = 1e5;
      QuantizePVT.IXMAX_VAL = 8206;
      function QuantizePVT() {
        var tak = null;
        var rv = null;
        var psy = null;
        this.setModules = function(_tk, _rv, _psy) {
          tak = _tk;
          rv = _rv;
          psy = _psy;
        };
        function POW20(x) {
          return pow20[x + QuantizePVT.Q_MAX2];
        }
        this.IPOW20 = function(x) {
          return ipow20[x];
        };
        var DBL_EPSILON = 2220446049250313e-31;
        var IXMAX_VAL = QuantizePVT.IXMAX_VAL;
        var PRECALC_SIZE = IXMAX_VAL + 2;
        var Q_MAX = QuantizePVT.Q_MAX;
        var Q_MAX2 = QuantizePVT.Q_MAX2;
        var NSATHSCALE = 100;
        this.nr_of_sfb_block = [
          [[6, 5, 5, 5], [9, 9, 9, 9], [6, 9, 9, 9]],
          [[6, 5, 7, 3], [9, 9, 12, 6], [6, 9, 12, 6]],
          [[11, 10, 0, 0], [18, 18, 0, 0], [15, 18, 0, 0]],
          [[7, 7, 7, 0], [12, 12, 12, 0], [6, 15, 12, 0]],
          [[6, 6, 6, 3], [12, 9, 9, 6], [6, 12, 9, 6]],
          [[8, 8, 5, 0], [15, 12, 9, 0], [6, 18, 9, 0]]
        ];
        var pretab = [
          0,
          0,
          0,
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
          3,
          3,
          3,
          2,
          0
        ];
        this.pretab = pretab;
        this.sfBandIndex = [
          // Table B.2.b: 22.05 kHz
          new ScaleFac2(
            [
              0,
              6,
              12,
              18,
              24,
              30,
              36,
              44,
              54,
              66,
              80,
              96,
              116,
              140,
              168,
              200,
              238,
              284,
              336,
              396,
              464,
              522,
              576
            ],
            [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            //  sfb12 pseudo sub bands
          ),
          /* Table B.2.c: 24 kHz */
          /* docs: 332. mpg123(broken): 330 */
          new ScaleFac2(
            [
              0,
              6,
              12,
              18,
              24,
              30,
              36,
              44,
              54,
              66,
              80,
              96,
              114,
              136,
              162,
              194,
              232,
              278,
              332,
              394,
              464,
              540,
              576
            ],
            [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* Table B.2.a: 16 kHz */
          new ScaleFac2(
            [
              0,
              6,
              12,
              18,
              24,
              30,
              36,
              44,
              54,
              66,
              80,
              96,
              116,
              140,
              168,
              200,
              238,
              284,
              336,
              396,
              464,
              522,
              576
            ],
            [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* Table B.8.b: 44.1 kHz */
          new ScaleFac2(
            [
              0,
              4,
              8,
              12,
              16,
              20,
              24,
              30,
              36,
              44,
              52,
              62,
              74,
              90,
              110,
              134,
              162,
              196,
              238,
              288,
              342,
              418,
              576
            ],
            [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* Table B.8.c: 48 kHz */
          new ScaleFac2(
            [
              0,
              4,
              8,
              12,
              16,
              20,
              24,
              30,
              36,
              42,
              50,
              60,
              72,
              88,
              106,
              128,
              156,
              190,
              230,
              276,
              330,
              384,
              576
            ],
            [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* Table B.8.a: 32 kHz */
          new ScaleFac2(
            [
              0,
              4,
              8,
              12,
              16,
              20,
              24,
              30,
              36,
              44,
              54,
              66,
              82,
              102,
              126,
              156,
              194,
              240,
              296,
              364,
              448,
              550,
              576
            ],
            [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* MPEG-2.5 11.025 kHz */
          new ScaleFac2(
            [
              0,
              6,
              12,
              18,
              24,
              30,
              36,
              44,
              54,
              66,
              80,
              96,
              116,
              140,
              168,
              200,
              238,
              284,
              336,
              396,
              464,
              522,
              576
            ],
            [
              0 / 3,
              12 / 3,
              24 / 3,
              36 / 3,
              54 / 3,
              78 / 3,
              108 / 3,
              144 / 3,
              186 / 3,
              240 / 3,
              312 / 3,
              402 / 3,
              522 / 3,
              576 / 3
            ],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* MPEG-2.5 12 kHz */
          new ScaleFac2(
            [
              0,
              6,
              12,
              18,
              24,
              30,
              36,
              44,
              54,
              66,
              80,
              96,
              116,
              140,
              168,
              200,
              238,
              284,
              336,
              396,
              464,
              522,
              576
            ],
            [
              0 / 3,
              12 / 3,
              24 / 3,
              36 / 3,
              54 / 3,
              78 / 3,
              108 / 3,
              144 / 3,
              186 / 3,
              240 / 3,
              312 / 3,
              402 / 3,
              522 / 3,
              576 / 3
            ],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          ),
          /* MPEG-2.5 8 kHz */
          new ScaleFac2(
            [
              0,
              12,
              24,
              36,
              48,
              60,
              72,
              88,
              108,
              132,
              160,
              192,
              232,
              280,
              336,
              400,
              476,
              566,
              568,
              570,
              572,
              574,
              576
            ],
            [
              0 / 3,
              24 / 3,
              48 / 3,
              72 / 3,
              108 / 3,
              156 / 3,
              216 / 3,
              288 / 3,
              372 / 3,
              480 / 3,
              486 / 3,
              492 / 3,
              498 / 3,
              576 / 3
            ],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
            /*  sfb12 pseudo sub bands */
          )
        ];
        var pow20 = new_float2(Q_MAX + Q_MAX2 + 1);
        var ipow20 = new_float2(Q_MAX);
        var pow43 = new_float2(PRECALC_SIZE);
        var adj43 = new_float2(PRECALC_SIZE);
        this.adj43 = adj43;
        function ATHmdct(gfp, f2) {
          var ath = psy.ATHformula(f2, gfp);
          ath -= NSATHSCALE;
          ath = Math.pow(10, ath / 10 + gfp.ATHlower);
          return ath;
        }
        function compute_ath(gfp) {
          var ATH_l = gfp.internal_flags.ATH.l;
          var ATH_psfb21 = gfp.internal_flags.ATH.psfb21;
          var ATH_s = gfp.internal_flags.ATH.s;
          var ATH_psfb12 = gfp.internal_flags.ATH.psfb12;
          var gfc = gfp.internal_flags;
          var samp_freq = gfp.out_samplerate;
          for (var sfb = 0; sfb < Encoder2.SBMAX_l; sfb++) {
            var start = gfc.scalefac_band.l[sfb];
            var end = gfc.scalefac_band.l[sfb + 1];
            ATH_l[sfb] = Float2.MAX_VALUE;
            for (var i = start; i < end; i++) {
              var freq = i * samp_freq / (2 * 576);
              var ATH_f = ATHmdct(gfp, freq);
              ATH_l[sfb] = Math.min(ATH_l[sfb], ATH_f);
            }
          }
          for (var sfb = 0; sfb < Encoder2.PSFB21; sfb++) {
            var start = gfc.scalefac_band.psfb21[sfb];
            var end = gfc.scalefac_band.psfb21[sfb + 1];
            ATH_psfb21[sfb] = Float2.MAX_VALUE;
            for (var i = start; i < end; i++) {
              var freq = i * samp_freq / (2 * 576);
              var ATH_f = ATHmdct(gfp, freq);
              ATH_psfb21[sfb] = Math.min(ATH_psfb21[sfb], ATH_f);
            }
          }
          for (var sfb = 0; sfb < Encoder2.SBMAX_s; sfb++) {
            var start = gfc.scalefac_band.s[sfb];
            var end = gfc.scalefac_band.s[sfb + 1];
            ATH_s[sfb] = Float2.MAX_VALUE;
            for (var i = start; i < end; i++) {
              var freq = i * samp_freq / (2 * 192);
              var ATH_f = ATHmdct(gfp, freq);
              ATH_s[sfb] = Math.min(ATH_s[sfb], ATH_f);
            }
            ATH_s[sfb] *= gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
          }
          for (var sfb = 0; sfb < Encoder2.PSFB12; sfb++) {
            var start = gfc.scalefac_band.psfb12[sfb];
            var end = gfc.scalefac_band.psfb12[sfb + 1];
            ATH_psfb12[sfb] = Float2.MAX_VALUE;
            for (var i = start; i < end; i++) {
              var freq = i * samp_freq / (2 * 192);
              var ATH_f = ATHmdct(gfp, freq);
              ATH_psfb12[sfb] = Math.min(ATH_psfb12[sfb], ATH_f);
            }
            ATH_psfb12[sfb] *= gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12];
          }
          if (gfp.noATH) {
            abort();
          }
          gfc.ATH.floor = 10 * Math_log10(ATHmdct(gfp, -1));
        }
        this.iteration_init = function(gfp) {
          var gfc = gfp.internal_flags;
          var l3_side = gfc.l3_side;
          var i;
          if (gfc.iteration_init_init == 0) {
            gfc.iteration_init_init = 1;
            l3_side.main_data_begin = 0;
            compute_ath(gfp);
            pow43[0] = 0;
            for (i = 1; i < PRECALC_SIZE; i++)
              pow43[i] = Math.pow(i, 4 / 3);
            for (i = 0; i < PRECALC_SIZE - 1; i++)
              adj43[i] = i + 1 - Math.pow(
                0.5 * (pow43[i] + pow43[i + 1]),
                0.75
              );
            adj43[i] = 0.5;
            for (i = 0; i < Q_MAX; i++)
              ipow20[i] = Math.pow(2, (i - 210) * -0.1875);
            for (i = 0; i <= Q_MAX + Q_MAX2; i++)
              pow20[i] = Math.pow(2, (i - 210 - Q_MAX2) * 0.25);
            tak.huffman_init(gfc);
            {
              var bass, alto, treble, sfb21;
              i = gfp.exp_nspsytune >> 2 & 63;
              if (i >= 32)
                i -= 64;
              bass = Math.pow(10, i / 4 / 10);
              i = gfp.exp_nspsytune >> 8 & 63;
              if (i >= 32)
                i -= 64;
              alto = Math.pow(10, i / 4 / 10);
              i = gfp.exp_nspsytune >> 14 & 63;
              if (i >= 32)
                i -= 64;
              treble = Math.pow(10, i / 4 / 10);
              i = gfp.exp_nspsytune >> 20 & 63;
              if (i >= 32)
                i -= 64;
              sfb21 = treble * Math.pow(10, i / 4 / 10);
              for (i = 0; i < Encoder2.SBMAX_l; i++) {
                var f2;
                if (i <= 6)
                  f2 = bass;
                else if (i <= 13)
                  f2 = alto;
                else if (i <= 20)
                  f2 = treble;
                else
                  f2 = sfb21;
                gfc.nsPsy.longfact[i] = f2;
              }
              for (i = 0; i < Encoder2.SBMAX_s; i++) {
                var f2;
                if (i <= 5)
                  f2 = bass;
                else if (i <= 10)
                  f2 = alto;
                else if (i <= 11)
                  f2 = treble;
                else
                  f2 = sfb21;
                gfc.nsPsy.shortfact[i] = f2;
              }
            }
          }
        };
        this.on_pe = function(gfp, pe, targ_bits, mean_bits, gr, cbr) {
          var gfc = gfp.internal_flags;
          var tbits = 0, bits;
          var add_bits = new_int2(2);
          var ch;
          var mb = new MeanBits2(tbits);
          var extra_bits = rv.ResvMaxBits(gfp, mean_bits, mb, cbr);
          tbits = mb.bits;
          var max_bits = tbits + extra_bits;
          if (max_bits > LameInternalFlags2.MAX_BITS_PER_GRANULE) {
            max_bits = LameInternalFlags2.MAX_BITS_PER_GRANULE;
          }
          for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
            targ_bits[ch] = Math.min(
              LameInternalFlags2.MAX_BITS_PER_CHANNEL,
              tbits / gfc.channels_out
            );
            add_bits[ch] = 0 | targ_bits[ch] * pe[gr][ch] / 700 - targ_bits[ch];
            if (add_bits[ch] > mean_bits * 3 / 4)
              add_bits[ch] = mean_bits * 3 / 4;
            if (add_bits[ch] < 0)
              add_bits[ch] = 0;
            if (add_bits[ch] + targ_bits[ch] > LameInternalFlags2.MAX_BITS_PER_CHANNEL)
              add_bits[ch] = Math.max(
                0,
                LameInternalFlags2.MAX_BITS_PER_CHANNEL - targ_bits[ch]
              );
            bits += add_bits[ch];
          }
          if (bits > extra_bits) {
            for (ch = 0; ch < gfc.channels_out; ++ch) {
              add_bits[ch] = extra_bits * add_bits[ch] / bits;
            }
          }
          for (ch = 0; ch < gfc.channels_out; ++ch) {
            targ_bits[ch] += add_bits[ch];
            extra_bits -= add_bits[ch];
          }
          for (bits = 0, ch = 0; ch < gfc.channels_out; ++ch) {
            bits += targ_bits[ch];
          }
          if (bits > LameInternalFlags2.MAX_BITS_PER_GRANULE) {
            abort();
          }
          return max_bits;
        };
        this.athAdjust = function(a, x, athFloor) {
          var o = 90.30873362;
          var p2 = 94.82444863;
          var u = Util2.FAST_LOG10_X(x, 10);
          var v = a * a;
          var w = 0;
          u -= athFloor;
          if (v > 1e-20)
            w = 1 + Util2.FAST_LOG10_X(v, 10 / o);
          if (w < 0)
            w = 0;
          u *= w;
          u += athFloor + o - p2;
          return Math.pow(10, 0.1 * u);
        };
        this.calc_xmin = function(gfp, ratio, cod_info, pxmin) {
          var pxminPos = 0;
          var gfc = gfp.internal_flags;
          var gsfb, j = 0, ath_over = 0;
          var ATH3 = gfc.ATH;
          var xr = cod_info.xr;
          var enable_athaa_fix = gfp.VBR == VbrMode2.vbr_mtrh ? 1 : 0;
          var masking_lower = gfc.masking_lower;
          if (gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) {
            masking_lower = 1;
          }
          for (gsfb = 0; gsfb < cod_info.psy_lmax; gsfb++) {
            var en0, xmin;
            var rh1, rh2;
            var width, l2;
            if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh)
              xmin = athAdjust(ATH3.adjust, ATH3.l[gsfb], ATH3.floor);
            else
              xmin = ATH3.adjust * ATH3.l[gsfb];
            width = cod_info.width[gsfb];
            rh1 = xmin / width;
            rh2 = DBL_EPSILON;
            l2 = width >> 1;
            en0 = 0;
            do {
              var xa, xb;
              xa = xr[j] * xr[j];
              en0 += xa;
              rh2 += xa < rh1 ? xa : rh1;
              j++;
              xb = xr[j] * xr[j];
              en0 += xb;
              rh2 += xb < rh1 ? xb : rh1;
              j++;
            } while (--l2 > 0);
            if (en0 > xmin)
              ath_over++;
            if (gsfb == Encoder2.SBPSY_l) {
              abort();
            }
            if (enable_athaa_fix != 0) {
              xmin = rh2;
            }
            if (!gfp.ATHonly) {
              var e = ratio.en.l[gsfb];
              if (e > 0) {
                var x;
                x = en0 * ratio.thm.l[gsfb] * masking_lower / e;
                if (enable_athaa_fix != 0)
                  x *= gfc.nsPsy.longfact[gsfb];
                if (xmin < x)
                  xmin = x;
              }
            }
            if (enable_athaa_fix != 0)
              pxmin[pxminPos++] = xmin;
            else
              pxmin[pxminPos++] = xmin * gfc.nsPsy.longfact[gsfb];
          }
          var max_nonzero = 575;
          if (cod_info.block_type != Encoder2.SHORT_TYPE) {
            var k2 = 576;
            while (k2-- != 0 && BitStream.EQ(xr[k2], 0)) {
              max_nonzero = k2;
            }
          }
          cod_info.max_nonzero_coeff = max_nonzero;
          for (var sfb = cod_info.sfb_smin; gsfb < cod_info.psymax; sfb++, gsfb += 3) {
            var width, b;
            var tmpATH;
            if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh)
              tmpATH = athAdjust(ATH3.adjust, ATH3.s[sfb], ATH3.floor);
            else
              tmpATH = ATH3.adjust * ATH3.s[sfb];
            width = cod_info.width[gsfb];
            for (b = 0; b < 3; b++) {
              var en0 = 0, xmin;
              var rh1, rh2;
              var l2 = width >> 1;
              rh1 = tmpATH / width;
              rh2 = DBL_EPSILON;
              do {
                var xa, xb;
                xa = xr[j] * xr[j];
                en0 += xa;
                rh2 += xa < rh1 ? xa : rh1;
                j++;
                xb = xr[j] * xr[j];
                en0 += xb;
                rh2 += xb < rh1 ? xb : rh1;
                j++;
              } while (--l2 > 0);
              if (en0 > tmpATH)
                ath_over++;
              if (sfb == Encoder2.SBPSY_s) {
                abort();
              }
              if (enable_athaa_fix != 0)
                xmin = rh2;
              else
                xmin = tmpATH;
              if (!gfp.ATHonly && !gfp.ATHshort) {
                var e = ratio.en.s[sfb][b];
                if (e > 0) {
                  var x;
                  x = en0 * ratio.thm.s[sfb][b] * masking_lower / e;
                  if (enable_athaa_fix != 0)
                    x *= gfc.nsPsy.shortfact[sfb];
                  if (xmin < x)
                    xmin = x;
                }
              }
              if (enable_athaa_fix != 0)
                pxmin[pxminPos++] = xmin;
              else
                pxmin[pxminPos++] = xmin * gfc.nsPsy.shortfact[sfb];
            }
            if (gfp.useTemporal) {
              if (pxmin[pxminPos - 3] > pxmin[pxminPos - 3 + 1])
                pxmin[pxminPos - 3 + 1] += (pxmin[pxminPos - 3] - pxmin[pxminPos - 3 + 1]) * gfc.decay;
              if (pxmin[pxminPos - 3 + 1] > pxmin[pxminPos - 3 + 2])
                pxmin[pxminPos - 3 + 2] += (pxmin[pxminPos - 3 + 1] - pxmin[pxminPos - 3 + 2]) * gfc.decay;
            }
          }
          return ath_over;
        };
        function StartLine(j) {
          this.s = j;
        }
        this.calc_noise_core = function(cod_info, startline, l2, step) {
          var noise = 0;
          var j = startline.s;
          var ix = cod_info.l3_enc;
          if (j > cod_info.count1) {
            while (l2-- != 0) {
              var temp;
              temp = cod_info.xr[j];
              j++;
              noise += temp * temp;
              temp = cod_info.xr[j];
              j++;
              noise += temp * temp;
            }
          } else if (j > cod_info.big_values) {
            var ix01 = new_float2(2);
            ix01[0] = 0;
            ix01[1] = step;
            while (l2-- != 0) {
              var temp;
              temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
              j++;
              noise += temp * temp;
              temp = Math.abs(cod_info.xr[j]) - ix01[ix[j]];
              j++;
              noise += temp * temp;
            }
          } else {
            while (l2-- != 0) {
              var temp;
              temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
              j++;
              noise += temp * temp;
              temp = Math.abs(cod_info.xr[j]) - pow43[ix[j]] * step;
              j++;
              noise += temp * temp;
            }
          }
          startline.s = j;
          return noise;
        };
        this.calc_noise = function(cod_info, l3_xmin, distort, res, prev_noise) {
          var distortPos = 0;
          var l3_xminPos = 0;
          var sfb, l2, over = 0;
          var over_noise_db = 0;
          var tot_noise_db = 0;
          var max_noise = -20;
          var j = 0;
          var scalefac = cod_info.scalefac;
          var scalefacPos = 0;
          res.over_SSD = 0;
          for (sfb = 0; sfb < cod_info.psymax; sfb++) {
            var s = cod_info.global_gain - (scalefac[scalefacPos++] + (cod_info.preflag != 0 ? pretab[sfb] : 0) << cod_info.scalefac_scale + 1) - cod_info.subblock_gain[cod_info.window[sfb]] * 8;
            var noise = 0;
            if (prev_noise != null && prev_noise.step[sfb] == s) {
              noise = prev_noise.noise[sfb];
              j += cod_info.width[sfb];
              distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
              noise = prev_noise.noise_log[sfb];
            } else {
              var step = POW20(s);
              l2 = cod_info.width[sfb] >> 1;
              if (j + cod_info.width[sfb] > cod_info.max_nonzero_coeff) {
                var usefullsize;
                usefullsize = cod_info.max_nonzero_coeff - j + 1;
                if (usefullsize > 0)
                  l2 = usefullsize >> 1;
                else
                  l2 = 0;
              }
              var sl = new StartLine(j);
              noise = this.calc_noise_core(cod_info, sl, l2, step);
              j = sl.s;
              if (prev_noise != null) {
                prev_noise.step[sfb] = s;
                prev_noise.noise[sfb] = noise;
              }
              noise = distort[distortPos++] = noise / l3_xmin[l3_xminPos++];
              noise = Util2.FAST_LOG10(Math.max(noise, 1e-20));
              if (prev_noise != null) {
                prev_noise.noise_log[sfb] = noise;
              }
            }
            if (prev_noise != null) {
              prev_noise.global_gain = cod_info.global_gain;
            }
            tot_noise_db += noise;
            if (noise > 0) {
              var tmp;
              tmp = Math.max(0 | noise * 10 + 0.5, 1);
              res.over_SSD += tmp * tmp;
              over++;
              over_noise_db += noise;
            }
            max_noise = Math.max(max_noise, noise);
          }
          res.over_count = over;
          res.tot_noise = tot_noise_db;
          res.over_noise = over_noise_db;
          res.max_noise = max_noise;
          return over;
        };
      }
      function CalcNoiseData() {
        this.global_gain = 0;
        this.sfb_count1 = 0;
        this.step = new_int2(39);
        this.noise = new_float2(39);
        this.noise_log = new_float2(39);
      }
      function GrInfo2() {
        this.xr = new_float2(576);
        this.l3_enc = new_int2(576);
        this.scalefac = new_int2(L3Side2.SFBMAX);
        this.xrpow_max = 0;
        this.part2_3_length = 0;
        this.big_values = 0;
        this.count1 = 0;
        this.global_gain = 0;
        this.scalefac_compress = 0;
        this.block_type = 0;
        this.mixed_block_flag = 0;
        this.table_select = new_int2(3);
        this.subblock_gain = new_int2(3 + 1);
        this.region0_count = 0;
        this.region1_count = 0;
        this.preflag = 0;
        this.scalefac_scale = 0;
        this.count1table_select = 0;
        this.part2_length = 0;
        this.sfb_lmax = 0;
        this.sfb_smin = 0;
        this.psy_lmax = 0;
        this.sfbmax = 0;
        this.psymax = 0;
        this.sfbdivide = 0;
        this.width = new_int2(L3Side2.SFBMAX);
        this.window = new_int2(L3Side2.SFBMAX);
        this.count1bits = 0;
        this.sfb_partition_table = null;
        this.slen = new_int2(4);
        this.max_nonzero_coeff = 0;
        var self2 = this;
        function clone_int(array) {
          return new Int32Array(array);
        }
        function clone_float(array) {
          return new Float32Array(array);
        }
        this.assign = function(other) {
          self2.xr = clone_float(other.xr);
          self2.l3_enc = clone_int(other.l3_enc);
          self2.scalefac = clone_int(other.scalefac);
          self2.xrpow_max = other.xrpow_max;
          self2.part2_3_length = other.part2_3_length;
          self2.big_values = other.big_values;
          self2.count1 = other.count1;
          self2.global_gain = other.global_gain;
          self2.scalefac_compress = other.scalefac_compress;
          self2.block_type = other.block_type;
          self2.mixed_block_flag = other.mixed_block_flag;
          self2.table_select = clone_int(other.table_select);
          self2.subblock_gain = clone_int(other.subblock_gain);
          self2.region0_count = other.region0_count;
          self2.region1_count = other.region1_count;
          self2.preflag = other.preflag;
          self2.scalefac_scale = other.scalefac_scale;
          self2.count1table_select = other.count1table_select;
          self2.part2_length = other.part2_length;
          self2.sfb_lmax = other.sfb_lmax;
          self2.sfb_smin = other.sfb_smin;
          self2.psy_lmax = other.psy_lmax;
          self2.sfbmax = other.sfbmax;
          self2.psymax = other.psymax;
          self2.sfbdivide = other.sfbdivide;
          self2.width = clone_int(other.width);
          self2.window = clone_int(other.window);
          self2.count1bits = other.count1bits;
          self2.sfb_partition_table = other.sfb_partition_table.slice(0);
          self2.slen = clone_int(other.slen);
          self2.max_nonzero_coeff = other.max_nonzero_coeff;
        };
      }
      var L3Side2 = {};
      L3Side2.SFBMAX = Encoder2.SBMAX_s * 3;
      function Quantize() {
        this.rv = null;
        var rv;
        this.qupvt = null;
        var qupvt;
        var vbr = new VBRQuantize();
        var tk;
        this.setModules = function(_bs, _rv, _qupvt, _tk) {
          rv = _rv;
          this.rv = _rv;
          qupvt = _qupvt;
          this.qupvt = _qupvt;
          tk = _tk;
          vbr.setModules(qupvt, tk);
        };
        function init_xrpow_core(cod_info, xrpow, upper, sum) {
          sum = 0;
          for (var i = 0; i <= upper; ++i) {
            var tmp = Math.abs(cod_info.xr[i]);
            sum += tmp;
            xrpow[i] = Math.sqrt(tmp * Math.sqrt(tmp));
            if (xrpow[i] > cod_info.xrpow_max)
              cod_info.xrpow_max = xrpow[i];
          }
          return sum;
        }
        this.init_xrpow = function(gfc, cod_info, xrpow) {
          var sum = 0;
          var upper = 0 | cod_info.max_nonzero_coeff;
          cod_info.xrpow_max = 0;
          Arrays2.fill(xrpow, upper, 576, 0);
          sum = init_xrpow_core(cod_info, xrpow, upper, sum);
          if (sum > 1e-20) {
            var j = 0;
            if ((gfc.substep_shaping & 2) != 0)
              j = 1;
            for (var i = 0; i < cod_info.psymax; i++)
              gfc.pseudohalf[i] = j;
            return true;
          }
          Arrays2.fill(cod_info.l3_enc, 0, 576, 0);
          return false;
        };
        function psfb21_analogsilence(gfc, cod_info) {
          var ath = gfc.ATH;
          var xr = cod_info.xr;
          if (cod_info.block_type != Encoder2.SHORT_TYPE) {
            var stop = false;
            for (var gsfb = Encoder2.PSFB21 - 1; gsfb >= 0 && !stop; gsfb--) {
              var start = gfc.scalefac_band.psfb21[gsfb];
              var end = gfc.scalefac_band.psfb21[gsfb + 1];
              var ath21 = qupvt.athAdjust(
                ath.adjust,
                ath.psfb21[gsfb],
                ath.floor
              );
              if (gfc.nsPsy.longfact[21] > 1e-12)
                ath21 *= gfc.nsPsy.longfact[21];
              for (var j = end - 1; j >= start; j--) {
                if (Math.abs(xr[j]) < ath21)
                  xr[j] = 0;
                else {
                  stop = true;
                  break;
                }
              }
            }
          } else {
            for (var block = 0; block < 3; block++) {
              var stop = false;
              for (var gsfb = Encoder2.PSFB12 - 1; gsfb >= 0 && !stop; gsfb--) {
                var start = gfc.scalefac_band.s[12] * 3 + (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) * block + (gfc.scalefac_band.psfb12[gsfb] - gfc.scalefac_band.psfb12[0]);
                var end = start + (gfc.scalefac_band.psfb12[gsfb + 1] - gfc.scalefac_band.psfb12[gsfb]);
                var ath12 = qupvt.athAdjust(
                  ath.adjust,
                  ath.psfb12[gsfb],
                  ath.floor
                );
                if (gfc.nsPsy.shortfact[12] > 1e-12)
                  ath12 *= gfc.nsPsy.shortfact[12];
                for (var j = end - 1; j >= start; j--) {
                  if (Math.abs(xr[j]) < ath12)
                    xr[j] = 0;
                  else {
                    stop = true;
                    break;
                  }
                }
              }
            }
          }
        }
        this.init_outer_loop = function(gfc, cod_info) {
          cod_info.part2_3_length = 0;
          cod_info.big_values = 0;
          cod_info.count1 = 0;
          cod_info.global_gain = 210;
          cod_info.scalefac_compress = 0;
          cod_info.table_select[0] = 0;
          cod_info.table_select[1] = 0;
          cod_info.table_select[2] = 0;
          cod_info.subblock_gain[0] = 0;
          cod_info.subblock_gain[1] = 0;
          cod_info.subblock_gain[2] = 0;
          cod_info.subblock_gain[3] = 0;
          cod_info.region0_count = 0;
          cod_info.region1_count = 0;
          cod_info.preflag = 0;
          cod_info.scalefac_scale = 0;
          cod_info.count1table_select = 0;
          cod_info.part2_length = 0;
          cod_info.sfb_lmax = Encoder2.SBPSY_l;
          cod_info.sfb_smin = Encoder2.SBPSY_s;
          cod_info.psy_lmax = gfc.sfb21_extra ? Encoder2.SBMAX_l : Encoder2.SBPSY_l;
          cod_info.psymax = cod_info.psy_lmax;
          cod_info.sfbmax = cod_info.sfb_lmax;
          cod_info.sfbdivide = 11;
          for (var sfb = 0; sfb < Encoder2.SBMAX_l; sfb++) {
            cod_info.width[sfb] = gfc.scalefac_band.l[sfb + 1] - gfc.scalefac_band.l[sfb];
            cod_info.window[sfb] = 3;
          }
          if (cod_info.block_type == Encoder2.SHORT_TYPE) {
            var ixwork = new_float2(576);
            cod_info.sfb_smin = 0;
            cod_info.sfb_lmax = 0;
            if (cod_info.mixed_block_flag != 0) {
              abort();
            }
            cod_info.psymax = cod_info.sfb_lmax + 3 * ((gfc.sfb21_extra ? Encoder2.SBMAX_s : Encoder2.SBPSY_s) - cod_info.sfb_smin);
            cod_info.sfbmax = cod_info.sfb_lmax + 3 * (Encoder2.SBPSY_s - cod_info.sfb_smin);
            cod_info.sfbdivide = cod_info.sfbmax - 18;
            cod_info.psy_lmax = cod_info.sfb_lmax;
            var ix = gfc.scalefac_band.l[cod_info.sfb_lmax];
            System2.arraycopy(cod_info.xr, 0, ixwork, 0, 576);
            for (var sfb = cod_info.sfb_smin; sfb < Encoder2.SBMAX_s; sfb++) {
              var start = gfc.scalefac_band.s[sfb];
              var end = gfc.scalefac_band.s[sfb + 1];
              for (var window2 = 0; window2 < 3; window2++) {
                for (var l2 = start; l2 < end; l2++) {
                  cod_info.xr[ix++] = ixwork[3 * l2 + window2];
                }
              }
            }
            var j = cod_info.sfb_lmax;
            for (var sfb = cod_info.sfb_smin; sfb < Encoder2.SBMAX_s; sfb++) {
              cod_info.width[j] = cod_info.width[j + 1] = cod_info.width[j + 2] = gfc.scalefac_band.s[sfb + 1] - gfc.scalefac_band.s[sfb];
              cod_info.window[j] = 0;
              cod_info.window[j + 1] = 1;
              cod_info.window[j + 2] = 2;
              j += 3;
            }
          }
          cod_info.count1bits = 0;
          cod_info.sfb_partition_table = qupvt.nr_of_sfb_block[0][0];
          cod_info.slen[0] = 0;
          cod_info.slen[1] = 0;
          cod_info.slen[2] = 0;
          cod_info.slen[3] = 0;
          cod_info.max_nonzero_coeff = 575;
          Arrays2.fill(cod_info.scalefac, 0);
          psfb21_analogsilence(gfc, cod_info);
        };
        function BinSearchDirection(ordinal) {
          this.ordinal = ordinal;
        }
        BinSearchDirection.BINSEARCH_NONE = new BinSearchDirection(0);
        BinSearchDirection.BINSEARCH_UP = new BinSearchDirection(1);
        BinSearchDirection.BINSEARCH_DOWN = new BinSearchDirection(2);
        function bin_search_StepSize(gfc, cod_info, desired_rate, ch, xrpow) {
          var nBits;
          var CurrentStep = gfc.CurrentStep[ch];
          var flagGoneOver = false;
          var start = gfc.OldValue[ch];
          var Direction = BinSearchDirection.BINSEARCH_NONE;
          cod_info.global_gain = start;
          desired_rate -= cod_info.part2_length;
          for (; ; ) {
            var step;
            nBits = tk.count_bits(gfc, xrpow, cod_info, null);
            if (CurrentStep == 1 || nBits == desired_rate)
              break;
            if (nBits > desired_rate) {
              if (Direction == BinSearchDirection.BINSEARCH_DOWN)
                flagGoneOver = true;
              if (flagGoneOver)
                CurrentStep /= 2;
              Direction = BinSearchDirection.BINSEARCH_UP;
              step = CurrentStep;
            } else {
              if (Direction == BinSearchDirection.BINSEARCH_UP)
                flagGoneOver = true;
              if (flagGoneOver)
                CurrentStep /= 2;
              Direction = BinSearchDirection.BINSEARCH_DOWN;
              step = -CurrentStep;
            }
            cod_info.global_gain += step;
            if (cod_info.global_gain < 0) {
              abort();
            }
            if (cod_info.global_gain > 255) {
              abort();
            }
          }
          while (nBits > desired_rate && cod_info.global_gain < 255) {
            cod_info.global_gain++;
            nBits = tk.count_bits(gfc, xrpow, cod_info, null);
          }
          gfc.CurrentStep[ch] = start - cod_info.global_gain >= 4 ? 4 : 2;
          gfc.OldValue[ch] = cod_info.global_gain;
          cod_info.part2_3_length = nBits;
          return nBits;
        }
        function loop_break(cod_info) {
          for (var sfb = 0; sfb < cod_info.sfbmax; sfb++)
            if (cod_info.scalefac[sfb] + cod_info.subblock_gain[cod_info.window[sfb]] == 0)
              return false;
          return true;
        }
        function quant_compare(quant_comp, best, calc, gi, distort) {
          var better;
          switch (quant_comp) {
            default:
            case 9: {
              if (best.over_count > 0) {
                better = calc.over_SSD <= best.over_SSD;
                if (calc.over_SSD == best.over_SSD)
                  better = calc.bits < best.bits;
              } else {
                better = calc.max_noise < 0 && calc.max_noise * 10 + calc.bits <= best.max_noise * 10 + best.bits;
              }
              break;
            }
            case 0:
              better = calc.over_count < best.over_count || calc.over_count == best.over_count && calc.over_noise < best.over_noise || calc.over_count == best.over_count && BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
              break;
            case 8:
              abort();
            case 1:
              better = calc.max_noise < best.max_noise;
              break;
            case 2:
              better = calc.tot_noise < best.tot_noise;
              break;
            case 3:
              better = calc.tot_noise < best.tot_noise && calc.max_noise < best.max_noise;
              break;
            case 4:
              better = calc.max_noise <= 0 && best.max_noise > 0.2 || calc.max_noise <= 0 && best.max_noise < 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise || calc.max_noise <= 0 && best.max_noise > 0 && best.max_noise > calc.max_noise - 0.2 && calc.tot_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.05 && best.max_noise > calc.max_noise - 0.1 && calc.tot_noise + calc.over_noise < best.tot_noise + best.over_noise || calc.max_noise > 0 && best.max_noise > -0.1 && best.max_noise > calc.max_noise - 0.15 && calc.tot_noise + calc.over_noise + calc.over_noise < best.tot_noise + best.over_noise + best.over_noise;
              break;
            case 5:
              better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && calc.tot_noise < best.tot_noise;
              break;
            case 6:
              better = calc.over_noise < best.over_noise || BitStream.EQ(calc.over_noise, best.over_noise) && (calc.max_noise < best.max_noise || BitStream.EQ(calc.max_noise, best.max_noise) && calc.tot_noise <= best.tot_noise);
              break;
            case 7:
              better = calc.over_count < best.over_count || calc.over_noise < best.over_noise;
              break;
          }
          if (best.over_count == 0) {
            better = better && calc.bits < best.bits;
          }
          return better;
        }
        function amp_scalefac_bands(gfp, cod_info, distort, xrpow, bRefine) {
          var gfc = gfp.internal_flags;
          var ifqstep34;
          if (cod_info.scalefac_scale == 0) {
            ifqstep34 = 1.2968395546510096;
          } else {
            ifqstep34 = 1.6817928305074292;
          }
          var trigger = 0;
          for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
            if (trigger < distort[sfb])
              trigger = distort[sfb];
          }
          var noise_shaping_amp = gfc.noise_shaping_amp;
          if (noise_shaping_amp == 3) {
            abort();
          }
          switch (noise_shaping_amp) {
            case 2:
              break;
            case 1:
              if (trigger > 1)
                trigger = Math.pow(trigger, 0.5);
              else
                trigger *= 0.95;
              break;
            case 0:
            default:
              if (trigger > 1)
                trigger = 1;
              else
                trigger *= 0.95;
              break;
          }
          var j = 0;
          for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
            var width = cod_info.width[sfb];
            var l2;
            j += width;
            if (distort[sfb] < trigger)
              continue;
            if ((gfc.substep_shaping & 2) != 0) {
              abort();
            }
            cod_info.scalefac[sfb]++;
            for (l2 = -width; l2 < 0; l2++) {
              xrpow[j + l2] *= ifqstep34;
              if (xrpow[j + l2] > cod_info.xrpow_max)
                cod_info.xrpow_max = xrpow[j + l2];
            }
            if (gfc.noise_shaping_amp == 2)
              return;
          }
        }
        function inc_scalefac_scale(cod_info, xrpow) {
          var ifqstep34 = 1.2968395546510096;
          var j = 0;
          for (var sfb = 0; sfb < cod_info.sfbmax; sfb++) {
            var width = cod_info.width[sfb];
            var s = cod_info.scalefac[sfb];
            if (cod_info.preflag != 0)
              s += qupvt.pretab[sfb];
            j += width;
            if ((s & 1) != 0) {
              s++;
              for (var l2 = -width; l2 < 0; l2++) {
                xrpow[j + l2] *= ifqstep34;
                if (xrpow[j + l2] > cod_info.xrpow_max)
                  cod_info.xrpow_max = xrpow[j + l2];
              }
            }
            cod_info.scalefac[sfb] = s >> 1;
          }
          cod_info.preflag = 0;
          cod_info.scalefac_scale = 1;
        }
        function inc_subblock_gain(gfc, cod_info, xrpow) {
          var sfb;
          var scalefac = cod_info.scalefac;
          for (sfb = 0; sfb < cod_info.sfb_lmax; sfb++) {
            if (scalefac[sfb] >= 16)
              return true;
          }
          for (var window2 = 0; window2 < 3; window2++) {
            var s1 = 0;
            var s2 = 0;
            for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbdivide; sfb += 3) {
              if (s1 < scalefac[sfb])
                s1 = scalefac[sfb];
            }
            for (; sfb < cod_info.sfbmax; sfb += 3) {
              if (s2 < scalefac[sfb])
                s2 = scalefac[sfb];
            }
            if (s1 < 16 && s2 < 8)
              continue;
            if (cod_info.subblock_gain[window2] >= 7)
              return true;
            cod_info.subblock_gain[window2]++;
            var j = gfc.scalefac_band.l[cod_info.sfb_lmax];
            for (sfb = cod_info.sfb_lmax + window2; sfb < cod_info.sfbmax; sfb += 3) {
              var amp;
              var width = cod_info.width[sfb];
              var s = scalefac[sfb];
              s = s - (4 >> cod_info.scalefac_scale);
              if (s >= 0) {
                scalefac[sfb] = s;
                j += width * 3;
                continue;
              }
              scalefac[sfb] = 0;
              {
                var gain = 210 + (s << cod_info.scalefac_scale + 1);
                amp = qupvt.IPOW20(gain);
              }
              j += width * (window2 + 1);
              for (var l2 = -width; l2 < 0; l2++) {
                xrpow[j + l2] *= amp;
                if (xrpow[j + l2] > cod_info.xrpow_max)
                  cod_info.xrpow_max = xrpow[j + l2];
              }
              j += width * (3 - window2 - 1);
            }
            {
              var amp = qupvt.IPOW20(202);
              j += cod_info.width[sfb] * (window2 + 1);
              for (var l2 = -cod_info.width[sfb]; l2 < 0; l2++) {
                xrpow[j + l2] *= amp;
                if (xrpow[j + l2] > cod_info.xrpow_max)
                  cod_info.xrpow_max = xrpow[j + l2];
              }
            }
          }
          return false;
        }
        function balance_noise(gfp, cod_info, distort, xrpow, bRefine) {
          var gfc = gfp.internal_flags;
          amp_scalefac_bands(gfp, cod_info, distort, xrpow);
          var status = loop_break(cod_info);
          if (status)
            return false;
          if (gfc.mode_gr == 2)
            status = tk.scale_bitcount(cod_info);
          else
            status = tk.scale_bitcount_lsf(gfc, cod_info);
          if (!status)
            return true;
          if (gfc.noise_shaping > 1) {
            Arrays2.fill(gfc.pseudohalf, 0);
            if (0 == cod_info.scalefac_scale) {
              inc_scalefac_scale(cod_info, xrpow);
              status = false;
            } else {
              if (cod_info.block_type == Encoder2.SHORT_TYPE && gfc.subblock_gain > 0) {
                status = inc_subblock_gain(gfc, cod_info, xrpow) || loop_break(cod_info);
              }
            }
          }
          if (!status) {
            if (gfc.mode_gr == 2)
              status = tk.scale_bitcount(cod_info);
            else
              status = tk.scale_bitcount_lsf(gfc, cod_info);
          }
          return !status;
        }
        this.outer_loop = function(gfp, cod_info, l3_xmin, xrpow, ch, targ_bits) {
          var gfc = gfp.internal_flags;
          var cod_info_w = new GrInfo2();
          var save_xrpow = new_float2(576);
          var distort = new_float2(L3Side2.SFBMAX);
          var best_noise_info = new CalcNoiseResult2();
          var better;
          var prev_noise = new CalcNoiseData();
          var best_part2_3_length = 9999999;
          var bEndOfSearch = false;
          var bRefine = false;
          var best_ggain_pass1 = 0;
          bin_search_StepSize(gfc, cod_info, targ_bits, ch, xrpow);
          if (0 == gfc.noise_shaping)
            return 100;
          qupvt.calc_noise(
            cod_info,
            l3_xmin,
            distort,
            best_noise_info,
            prev_noise
          );
          best_noise_info.bits = cod_info.part2_3_length;
          cod_info_w.assign(cod_info);
          var age = 0;
          System2.arraycopy(xrpow, 0, save_xrpow, 0, 576);
          while (!bEndOfSearch) {
            do {
              var noise_info = new CalcNoiseResult2();
              var search_limit;
              var maxggain = 255;
              if ((gfc.substep_shaping & 2) != 0) {
                search_limit = 20;
              } else {
                search_limit = 3;
              }
              if (gfc.sfb21_extra) {
                abort();
              }
              if (!balance_noise(gfp, cod_info_w, distort, xrpow))
                break;
              if (cod_info_w.scalefac_scale != 0)
                maxggain = 254;
              var huff_bits = targ_bits - cod_info_w.part2_length;
              if (huff_bits <= 0)
                break;
              while ((cod_info_w.part2_3_length = tk.count_bits(
                gfc,
                xrpow,
                cod_info_w,
                prev_noise
              )) > huff_bits && cod_info_w.global_gain <= maxggain)
                cod_info_w.global_gain++;
              if (cod_info_w.global_gain > maxggain)
                break;
              if (best_noise_info.over_count == 0) {
                while ((cod_info_w.part2_3_length = tk.count_bits(
                  gfc,
                  xrpow,
                  cod_info_w,
                  prev_noise
                )) > best_part2_3_length && cod_info_w.global_gain <= maxggain)
                  cod_info_w.global_gain++;
                if (cod_info_w.global_gain > maxggain)
                  break;
              }
              qupvt.calc_noise(
                cod_info_w,
                l3_xmin,
                distort,
                noise_info,
                prev_noise
              );
              noise_info.bits = cod_info_w.part2_3_length;
              if (cod_info.block_type != Encoder2.SHORT_TYPE) {
                better = gfp.quant_comp;
              } else
                better = gfp.quant_comp_short;
              better = quant_compare(better, best_noise_info, noise_info) ? 1 : 0;
              if (better != 0) {
                best_part2_3_length = cod_info.part2_3_length;
                best_noise_info = noise_info;
                cod_info.assign(cod_info_w);
                age = 0;
                System2.arraycopy(xrpow, 0, save_xrpow, 0, 576);
              } else {
                if (gfc.full_outer_loop == 0) {
                  if (++age > search_limit && best_noise_info.over_count == 0)
                    break;
                  if (gfc.noise_shaping_amp == 3 && bRefine && age > 30)
                    break;
                  if (gfc.noise_shaping_amp == 3 && bRefine && cod_info_w.global_gain - best_ggain_pass1 > 15)
                    break;
                }
              }
            } while (cod_info_w.global_gain + cod_info_w.scalefac_scale < 255);
            if (gfc.noise_shaping_amp == 3) {
              abort();
            } else {
              bEndOfSearch = true;
            }
          }
          if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh)
            System2.arraycopy(save_xrpow, 0, xrpow, 0, 576);
          else if ((gfc.substep_shaping & 1) != 0)
            abort();
          return best_noise_info.over_count;
        };
        this.iteration_finish_one = function(gfc, gr, ch) {
          var l3_side = gfc.l3_side;
          var cod_info = l3_side.tt[gr][ch];
          tk.best_scalefac_store(gfc, gr, ch, l3_side);
          if (gfc.use_best_huffman == 1)
            tk.best_huffman_divide(gfc, cod_info);
          rv.ResvAdjust(gfc, cod_info);
        };
      }
      function NewMDCT() {
        var enwindow = [
          -477e-9 * 0.740951125354959 / 2384e-9,
          103951e-9 * 0.740951125354959 / 2384e-9,
          953674e-9 * 0.740951125354959 / 2384e-9,
          2841473e-9 * 0.740951125354959 / 2384e-9,
          0.035758972 * 0.740951125354959 / 2384e-9,
          3401756e-9 * 0.740951125354959 / 2384e-9,
          983715e-9 * 0.740951125354959 / 2384e-9,
          99182e-9 * 0.740951125354959 / 2384e-9,
          /* 15 */
          12398e-9 * 0.740951125354959 / 2384e-9,
          191212e-9 * 0.740951125354959 / 2384e-9,
          2283096e-9 * 0.740951125354959 / 2384e-9,
          0.016994476 * 0.740951125354959 / 2384e-9,
          -0.018756866 * 0.740951125354959 / 2384e-9,
          -2630711e-9 * 0.740951125354959 / 2384e-9,
          -247478e-9 * 0.740951125354959 / 2384e-9,
          -14782e-9 * 0.740951125354959 / 2384e-9,
          0.9063471690191471,
          0.1960342806591213,
          -477e-9 * 0.773010453362737 / 2384e-9,
          105858e-9 * 0.773010453362737 / 2384e-9,
          930786e-9 * 0.773010453362737 / 2384e-9,
          2521515e-9 * 0.773010453362737 / 2384e-9,
          0.035694122 * 0.773010453362737 / 2384e-9,
          3643036e-9 * 0.773010453362737 / 2384e-9,
          991821e-9 * 0.773010453362737 / 2384e-9,
          96321e-9 * 0.773010453362737 / 2384e-9,
          /* 14 */
          11444e-9 * 0.773010453362737 / 2384e-9,
          165462e-9 * 0.773010453362737 / 2384e-9,
          2110004e-9 * 0.773010453362737 / 2384e-9,
          0.016112804 * 0.773010453362737 / 2384e-9,
          -0.019634247 * 0.773010453362737 / 2384e-9,
          -2803326e-9 * 0.773010453362737 / 2384e-9,
          -277042e-9 * 0.773010453362737 / 2384e-9,
          -16689e-9 * 0.773010453362737 / 2384e-9,
          0.8206787908286602,
          0.3901806440322567,
          -477e-9 * 0.803207531480645 / 2384e-9,
          107288e-9 * 0.803207531480645 / 2384e-9,
          902653e-9 * 0.803207531480645 / 2384e-9,
          2174854e-9 * 0.803207531480645 / 2384e-9,
          0.035586357 * 0.803207531480645 / 2384e-9,
          3858566e-9 * 0.803207531480645 / 2384e-9,
          995159e-9 * 0.803207531480645 / 2384e-9,
          9346e-8 * 0.803207531480645 / 2384e-9,
          /* 13 */
          10014e-9 * 0.803207531480645 / 2384e-9,
          14019e-8 * 0.803207531480645 / 2384e-9,
          1937389e-9 * 0.803207531480645 / 2384e-9,
          0.015233517 * 0.803207531480645 / 2384e-9,
          -0.020506859 * 0.803207531480645 / 2384e-9,
          -2974033e-9 * 0.803207531480645 / 2384e-9,
          -30756e-8 * 0.803207531480645 / 2384e-9,
          -1812e-8 * 0.803207531480645 / 2384e-9,
          0.7416505462720353,
          0.5805693545089249,
          -477e-9 * 0.831469612302545 / 2384e-9,
          108242e-9 * 0.831469612302545 / 2384e-9,
          868797e-9 * 0.831469612302545 / 2384e-9,
          1800537e-9 * 0.831469612302545 / 2384e-9,
          0.0354352 * 0.831469612302545 / 2384e-9,
          4049301e-9 * 0.831469612302545 / 2384e-9,
          994205e-9 * 0.831469612302545 / 2384e-9,
          90599e-9 * 0.831469612302545 / 2384e-9,
          /* 12 */
          906e-8 * 0.831469612302545 / 2384e-9,
          116348e-9 * 0.831469612302545 / 2384e-9,
          1766682e-9 * 0.831469612302545 / 2384e-9,
          0.014358521 * 0.831469612302545 / 2384e-9,
          -0.021372318 * 0.831469612302545 / 2384e-9,
          -314188e-8 * 0.831469612302545 / 2384e-9,
          -339031e-9 * 0.831469612302545 / 2384e-9,
          -1955e-8 * 0.831469612302545 / 2384e-9,
          0.6681786379192989,
          0.7653668647301797,
          -477e-9 * 0.857728610000272 / 2384e-9,
          108719e-9 * 0.857728610000272 / 2384e-9,
          82922e-8 * 0.857728610000272 / 2384e-9,
          1399517e-9 * 0.857728610000272 / 2384e-9,
          0.035242081 * 0.857728610000272 / 2384e-9,
          421524e-8 * 0.857728610000272 / 2384e-9,
          989437e-9 * 0.857728610000272 / 2384e-9,
          87261e-9 * 0.857728610000272 / 2384e-9,
          /* 11 */
          8106e-9 * 0.857728610000272 / 2384e-9,
          93937e-9 * 0.857728610000272 / 2384e-9,
          1597881e-9 * 0.857728610000272 / 2384e-9,
          0.013489246 * 0.857728610000272 / 2384e-9,
          -0.022228718 * 0.857728610000272 / 2384e-9,
          -3306866e-9 * 0.857728610000272 / 2384e-9,
          -371456e-9 * 0.857728610000272 / 2384e-9,
          -21458e-9 * 0.857728610000272 / 2384e-9,
          0.5993769336819237,
          0.9427934736519954,
          -477e-9 * 0.881921264348355 / 2384e-9,
          108719e-9 * 0.881921264348355 / 2384e-9,
          78392e-8 * 0.881921264348355 / 2384e-9,
          971317e-9 * 0.881921264348355 / 2384e-9,
          0.035007 * 0.881921264348355 / 2384e-9,
          4357815e-9 * 0.881921264348355 / 2384e-9,
          980854e-9 * 0.881921264348355 / 2384e-9,
          83923e-9 * 0.881921264348355 / 2384e-9,
          /* 10 */
          7629e-9 * 0.881921264348355 / 2384e-9,
          72956e-9 * 0.881921264348355 / 2384e-9,
          1432419e-9 * 0.881921264348355 / 2384e-9,
          0.012627602 * 0.881921264348355 / 2384e-9,
          -0.02307415 * 0.881921264348355 / 2384e-9,
          -3467083e-9 * 0.881921264348355 / 2384e-9,
          -404358e-9 * 0.881921264348355 / 2384e-9,
          -23365e-9 * 0.881921264348355 / 2384e-9,
          0.5345111359507916,
          1.111140466039205,
          -954e-9 * 0.903989293123443 / 2384e-9,
          108242e-9 * 0.903989293123443 / 2384e-9,
          731945e-9 * 0.903989293123443 / 2384e-9,
          515938e-9 * 0.903989293123443 / 2384e-9,
          0.034730434 * 0.903989293123443 / 2384e-9,
          4477024e-9 * 0.903989293123443 / 2384e-9,
          968933e-9 * 0.903989293123443 / 2384e-9,
          80585e-9 * 0.903989293123443 / 2384e-9,
          /* 9 */
          6676e-9 * 0.903989293123443 / 2384e-9,
          52929e-9 * 0.903989293123443 / 2384e-9,
          1269817e-9 * 0.903989293123443 / 2384e-9,
          0.011775017 * 0.903989293123443 / 2384e-9,
          -0.023907185 * 0.903989293123443 / 2384e-9,
          -3622532e-9 * 0.903989293123443 / 2384e-9,
          -438213e-9 * 0.903989293123443 / 2384e-9,
          -25272e-9 * 0.903989293123443 / 2384e-9,
          0.4729647758913199,
          1.268786568327291,
          -954e-9 * 0.9238795325112867 / 2384e-9,
          106812e-9 * 0.9238795325112867 / 2384e-9,
          674248e-9 * 0.9238795325112867 / 2384e-9,
          33379e-9 * 0.9238795325112867 / 2384e-9,
          0.034412861 * 0.9238795325112867 / 2384e-9,
          4573822e-9 * 0.9238795325112867 / 2384e-9,
          954151e-9 * 0.9238795325112867 / 2384e-9,
          76771e-9 * 0.9238795325112867 / 2384e-9,
          6199e-9 * 0.9238795325112867 / 2384e-9,
          34332e-9 * 0.9238795325112867 / 2384e-9,
          1111031e-9 * 0.9238795325112867 / 2384e-9,
          0.010933399 * 0.9238795325112867 / 2384e-9,
          -0.024725437 * 0.9238795325112867 / 2384e-9,
          -3771782e-9 * 0.9238795325112867 / 2384e-9,
          -472546e-9 * 0.9238795325112867 / 2384e-9,
          -27657e-9 * 0.9238795325112867 / 2384e-9,
          0.41421356237309503,
          /* tan(PI/8) */
          1.414213562373095,
          -954e-9 * 0.941544065183021 / 2384e-9,
          105381e-9 * 0.941544065183021 / 2384e-9,
          610352e-9 * 0.941544065183021 / 2384e-9,
          -475883e-9 * 0.941544065183021 / 2384e-9,
          0.03405571 * 0.941544065183021 / 2384e-9,
          4649162e-9 * 0.941544065183021 / 2384e-9,
          935555e-9 * 0.941544065183021 / 2384e-9,
          73433e-9 * 0.941544065183021 / 2384e-9,
          /* 7 */
          5245e-9 * 0.941544065183021 / 2384e-9,
          17166e-9 * 0.941544065183021 / 2384e-9,
          956535e-9 * 0.941544065183021 / 2384e-9,
          0.010103703 * 0.941544065183021 / 2384e-9,
          -0.025527 * 0.941544065183021 / 2384e-9,
          -3914356e-9 * 0.941544065183021 / 2384e-9,
          -507355e-9 * 0.941544065183021 / 2384e-9,
          -30041e-9 * 0.941544065183021 / 2384e-9,
          0.3578057213145241,
          1.546020906725474,
          -954e-9 * 0.956940335732209 / 2384e-9,
          10252e-8 * 0.956940335732209 / 2384e-9,
          539303e-9 * 0.956940335732209 / 2384e-9,
          -1011848e-9 * 0.956940335732209 / 2384e-9,
          0.033659935 * 0.956940335732209 / 2384e-9,
          4703045e-9 * 0.956940335732209 / 2384e-9,
          915051e-9 * 0.956940335732209 / 2384e-9,
          70095e-9 * 0.956940335732209 / 2384e-9,
          /* 6 */
          4768e-9 * 0.956940335732209 / 2384e-9,
          954e-9 * 0.956940335732209 / 2384e-9,
          806808e-9 * 0.956940335732209 / 2384e-9,
          9287834e-9 * 0.956940335732209 / 2384e-9,
          -0.026310921 * 0.956940335732209 / 2384e-9,
          -4048824e-9 * 0.956940335732209 / 2384e-9,
          -542164e-9 * 0.956940335732209 / 2384e-9,
          -32425e-9 * 0.956940335732209 / 2384e-9,
          0.3033466836073424,
          1.66293922460509,
          -1431e-9 * 0.970031253194544 / 2384e-9,
          99182e-9 * 0.970031253194544 / 2384e-9,
          462532e-9 * 0.970031253194544 / 2384e-9,
          -1573563e-9 * 0.970031253194544 / 2384e-9,
          0.033225536 * 0.970031253194544 / 2384e-9,
          4737377e-9 * 0.970031253194544 / 2384e-9,
          891685e-9 * 0.970031253194544 / 2384e-9,
          6628e-8 * 0.970031253194544 / 2384e-9,
          /* 5 */
          4292e-9 * 0.970031253194544 / 2384e-9,
          -13828e-9 * 0.970031253194544 / 2384e-9,
          66185e-8 * 0.970031253194544 / 2384e-9,
          8487225e-9 * 0.970031253194544 / 2384e-9,
          -0.02707386 * 0.970031253194544 / 2384e-9,
          -4174709e-9 * 0.970031253194544 / 2384e-9,
          -576973e-9 * 0.970031253194544 / 2384e-9,
          -34809e-9 * 0.970031253194544 / 2384e-9,
          0.2504869601913055,
          1.76384252869671,
          -1431e-9 * 0.98078528040323 / 2384e-9,
          95367e-9 * 0.98078528040323 / 2384e-9,
          378609e-9 * 0.98078528040323 / 2384e-9,
          -2161503e-9 * 0.98078528040323 / 2384e-9,
          0.032754898 * 0.98078528040323 / 2384e-9,
          4752159e-9 * 0.98078528040323 / 2384e-9,
          866413e-9 * 0.98078528040323 / 2384e-9,
          62943e-9 * 0.98078528040323 / 2384e-9,
          /* 4 */
          3815e-9 * 0.98078528040323 / 2384e-9,
          -2718e-8 * 0.98078528040323 / 2384e-9,
          522137e-9 * 0.98078528040323 / 2384e-9,
          7703304e-9 * 0.98078528040323 / 2384e-9,
          -0.027815342 * 0.98078528040323 / 2384e-9,
          -4290581e-9 * 0.98078528040323 / 2384e-9,
          -611782e-9 * 0.98078528040323 / 2384e-9,
          -3767e-8 * 0.98078528040323 / 2384e-9,
          0.198912367379658,
          1.847759065022573,
          -1907e-9 * 0.989176509964781 / 2384e-9,
          90122e-9 * 0.989176509964781 / 2384e-9,
          288486e-9 * 0.989176509964781 / 2384e-9,
          -2774239e-9 * 0.989176509964781 / 2384e-9,
          0.03224802 * 0.989176509964781 / 2384e-9,
          4748821e-9 * 0.989176509964781 / 2384e-9,
          838757e-9 * 0.989176509964781 / 2384e-9,
          59605e-9 * 0.989176509964781 / 2384e-9,
          /* 3 */
          3338e-9 * 0.989176509964781 / 2384e-9,
          -39577e-9 * 0.989176509964781 / 2384e-9,
          388145e-9 * 0.989176509964781 / 2384e-9,
          6937027e-9 * 0.989176509964781 / 2384e-9,
          -0.028532982 * 0.989176509964781 / 2384e-9,
          -4395962e-9 * 0.989176509964781 / 2384e-9,
          -646591e-9 * 0.989176509964781 / 2384e-9,
          -40531e-9 * 0.989176509964781 / 2384e-9,
          0.1483359875383474,
          1.913880671464418,
          -1907e-9 * 0.995184726672197 / 2384e-9,
          844e-7 * 0.995184726672197 / 2384e-9,
          191689e-9 * 0.995184726672197 / 2384e-9,
          -3411293e-9 * 0.995184726672197 / 2384e-9,
          0.03170681 * 0.995184726672197 / 2384e-9,
          4728317e-9 * 0.995184726672197 / 2384e-9,
          809669e-9 * 0.995184726672197 / 2384e-9,
          5579e-8 * 0.995184726672197 / 2384e-9,
          3338e-9 * 0.995184726672197 / 2384e-9,
          -50545e-9 * 0.995184726672197 / 2384e-9,
          259876e-9 * 0.995184726672197 / 2384e-9,
          6189346e-9 * 0.995184726672197 / 2384e-9,
          -0.029224873 * 0.995184726672197 / 2384e-9,
          -4489899e-9 * 0.995184726672197 / 2384e-9,
          -680923e-9 * 0.995184726672197 / 2384e-9,
          -43392e-9 * 0.995184726672197 / 2384e-9,
          0.09849140335716425,
          1.961570560806461,
          -2384e-9 * 0.998795456205172 / 2384e-9,
          77724e-9 * 0.998795456205172 / 2384e-9,
          88215e-9 * 0.998795456205172 / 2384e-9,
          -4072189e-9 * 0.998795456205172 / 2384e-9,
          0.031132698 * 0.998795456205172 / 2384e-9,
          4691124e-9 * 0.998795456205172 / 2384e-9,
          779152e-9 * 0.998795456205172 / 2384e-9,
          52929e-9 * 0.998795456205172 / 2384e-9,
          2861e-9 * 0.998795456205172 / 2384e-9,
          -60558e-9 * 0.998795456205172 / 2384e-9,
          137329e-9 * 0.998795456205172 / 2384e-9,
          546217e-8 * 0.998795456205172 / 2384e-9,
          -0.02989006 * 0.998795456205172 / 2384e-9,
          -4570484e-9 * 0.998795456205172 / 2384e-9,
          -714302e-9 * 0.998795456205172 / 2384e-9,
          -46253e-9 * 0.998795456205172 / 2384e-9,
          0.04912684976946725,
          1.990369453344394,
          0.035780907 * Util2.SQRT2 * 0.5 / 2384e-9,
          0.017876148 * Util2.SQRT2 * 0.5 / 2384e-9,
          3134727e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          2457142e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          971317e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          218868e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          101566e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          13828e-9 * Util2.SQRT2 * 0.5 / 2384e-9,
          0.030526638 / 2384e-9,
          4638195e-9 / 2384e-9,
          747204e-9 / 2384e-9,
          49591e-9 / 2384e-9,
          4756451e-9 / 2384e-9,
          21458e-9 / 2384e-9,
          -69618e-9 / 2384e-9
          /* 2.384e-06/2.384e-06 */
        ];
        var NS = 12;
        var NL = 36;
        var win = [
          [
            2382191739347913e-28,
            6423305872147834e-28,
            9400849094049688e-28,
            1122435026096556e-27,
            1183840321267481e-27,
            1122435026096556e-27,
            940084909404969e-27,
            6423305872147839e-28,
            2382191739347918e-28,
            5456116108943412e-27,
            4878985199565852e-27,
            4240448995017367e-27,
            3559909094758252e-27,
            2858043359288075e-27,
            2156177623817898e-27,
            1475637723558783e-27,
            8371015190102974e-28,
            2599706096327376e-28,
            -5456116108943412e-27,
            -4878985199565852e-27,
            -4240448995017367e-27,
            -3559909094758252e-27,
            -2858043359288076e-27,
            -2156177623817898e-27,
            -1475637723558783e-27,
            -8371015190102975e-28,
            -2599706096327376e-28,
            -2382191739347923e-28,
            -6423305872147843e-28,
            -9400849094049696e-28,
            -1122435026096556e-27,
            -1183840321267481e-27,
            -1122435026096556e-27,
            -9400849094049694e-28,
            -642330587214784e-27,
            -2382191739347918e-28
          ],
          [
            2382191739347913e-28,
            6423305872147834e-28,
            9400849094049688e-28,
            1122435026096556e-27,
            1183840321267481e-27,
            1122435026096556e-27,
            9400849094049688e-28,
            6423305872147841e-28,
            2382191739347918e-28,
            5456116108943413e-27,
            4878985199565852e-27,
            4240448995017367e-27,
            3559909094758253e-27,
            2858043359288075e-27,
            2156177623817898e-27,
            1475637723558782e-27,
            8371015190102975e-28,
            2599706096327376e-28,
            -5461314069809755e-27,
            -4921085770524055e-27,
            -4343405037091838e-27,
            -3732668368707687e-27,
            -3093523840190885e-27,
            -2430835727329465e-27,
            -1734679010007751e-27,
            -974825365660928e-27,
            -2797435120168326e-28,
            0,
            0,
            0,
            0,
            0,
            0,
            -2283748241799531e-28,
            -4037858874020686e-28,
            -2146547464825323e-28
          ],
          [
            0.1316524975873958,
            /* win[SHORT_TYPE] */
            0.414213562373095,
            0.7673269879789602,
            1.091308501069271,
            /* tantab_l */
            1.303225372841206,
            1.56968557711749,
            1.920982126971166,
            2.414213562373094,
            3.171594802363212,
            4.510708503662055,
            7.595754112725146,
            22.90376554843115,
            0.984807753012208,
            /* cx */
            0.6427876096865394,
            0.3420201433256688,
            0.9396926207859084,
            -0.1736481776669303,
            -0.7660444431189779,
            0.8660254037844387,
            0.5,
            -0.5144957554275265,
            /* ca */
            -0.4717319685649723,
            -0.3133774542039019,
            -0.1819131996109812,
            -0.09457419252642064,
            -0.04096558288530405,
            -0.01419856857247115,
            -0.003699974673760037,
            0.8574929257125442,
            /* cs */
            0.8817419973177052,
            0.9496286491027329,
            0.9833145924917901,
            0.9955178160675857,
            0.9991605581781475,
            0.999899195244447,
            0.9999931550702802
          ],
          [
            0,
            0,
            0,
            0,
            0,
            0,
            2283748241799531e-28,
            4037858874020686e-28,
            2146547464825323e-28,
            5461314069809755e-27,
            4921085770524055e-27,
            4343405037091838e-27,
            3732668368707687e-27,
            3093523840190885e-27,
            2430835727329466e-27,
            1734679010007751e-27,
            974825365660928e-27,
            2797435120168326e-28,
            -5456116108943413e-27,
            -4878985199565852e-27,
            -4240448995017367e-27,
            -3559909094758253e-27,
            -2858043359288075e-27,
            -2156177623817898e-27,
            -1475637723558782e-27,
            -8371015190102975e-28,
            -2599706096327376e-28,
            -2382191739347913e-28,
            -6423305872147834e-28,
            -9400849094049688e-28,
            -1122435026096556e-27,
            -1183840321267481e-27,
            -1122435026096556e-27,
            -9400849094049688e-28,
            -6423305872147841e-28,
            -2382191739347918e-28
          ]
        ];
        var tantab_l = win[Encoder2.SHORT_TYPE];
        var cx = win[Encoder2.SHORT_TYPE];
        var ca = win[Encoder2.SHORT_TYPE];
        var cs = win[Encoder2.SHORT_TYPE];
        var order = [
          0,
          1,
          16,
          17,
          8,
          9,
          24,
          25,
          4,
          5,
          20,
          21,
          12,
          13,
          28,
          29,
          2,
          3,
          18,
          19,
          10,
          11,
          26,
          27,
          6,
          7,
          22,
          23,
          14,
          15,
          30,
          31
        ];
        function window_subband(x1, x1Pos, a) {
          var wp = 10;
          var x2 = x1Pos + 238 - 14 - 286;
          for (var i = -15; i < 0; i++) {
            var w, s, t;
            w = enwindow[wp + -10];
            s = x1[x2 + -224] * w;
            t = x1[x1Pos + 224] * w;
            w = enwindow[wp + -9];
            s += x1[x2 + -160] * w;
            t += x1[x1Pos + 160] * w;
            w = enwindow[wp + -8];
            s += x1[x2 + -96] * w;
            t += x1[x1Pos + 96] * w;
            w = enwindow[wp + -7];
            s += x1[x2 + -32] * w;
            t += x1[x1Pos + 32] * w;
            w = enwindow[wp + -6];
            s += x1[x2 + 32] * w;
            t += x1[x1Pos + -32] * w;
            w = enwindow[wp + -5];
            s += x1[x2 + 96] * w;
            t += x1[x1Pos + -96] * w;
            w = enwindow[wp + -4];
            s += x1[x2 + 160] * w;
            t += x1[x1Pos + -160] * w;
            w = enwindow[wp + -3];
            s += x1[x2 + 224] * w;
            t += x1[x1Pos + -224] * w;
            w = enwindow[wp + -2];
            s += x1[x1Pos + -256] * w;
            t -= x1[x2 + 256] * w;
            w = enwindow[wp + -1];
            s += x1[x1Pos + -192] * w;
            t -= x1[x2 + 192] * w;
            w = enwindow[wp + 0];
            s += x1[x1Pos + -128] * w;
            t -= x1[x2 + 128] * w;
            w = enwindow[wp + 1];
            s += x1[x1Pos + -64] * w;
            t -= x1[x2 + 64] * w;
            w = enwindow[wp + 2];
            s += x1[x1Pos + 0] * w;
            t -= x1[x2 + 0] * w;
            w = enwindow[wp + 3];
            s += x1[x1Pos + 64] * w;
            t -= x1[x2 + -64] * w;
            w = enwindow[wp + 4];
            s += x1[x1Pos + 128] * w;
            t -= x1[x2 + -128] * w;
            w = enwindow[wp + 5];
            s += x1[x1Pos + 192] * w;
            t -= x1[x2 + -192] * w;
            s *= enwindow[wp + 6];
            w = t - s;
            a[30 + i * 2] = t + s;
            a[31 + i * 2] = enwindow[wp + 7] * w;
            wp += 18;
            x1Pos--;
            x2++;
          }
          {
            var s, t, u, v;
            t = x1[x1Pos + -16] * enwindow[wp + -10];
            s = x1[x1Pos + -32] * enwindow[wp + -2];
            t += (x1[x1Pos + -48] - x1[x1Pos + 16]) * enwindow[wp + -9];
            s += x1[x1Pos + -96] * enwindow[wp + -1];
            t += (x1[x1Pos + -80] + x1[x1Pos + 48]) * enwindow[wp + -8];
            s += x1[x1Pos + -160] * enwindow[wp + 0];
            t += (x1[x1Pos + -112] - x1[x1Pos + 80]) * enwindow[wp + -7];
            s += x1[x1Pos + -224] * enwindow[wp + 1];
            t += (x1[x1Pos + -144] + x1[x1Pos + 112]) * enwindow[wp + -6];
            s -= x1[x1Pos + 32] * enwindow[wp + 2];
            t += (x1[x1Pos + -176] - x1[x1Pos + 144]) * enwindow[wp + -5];
            s -= x1[x1Pos + 96] * enwindow[wp + 3];
            t += (x1[x1Pos + -208] + x1[x1Pos + 176]) * enwindow[wp + -4];
            s -= x1[x1Pos + 160] * enwindow[wp + 4];
            t += (x1[x1Pos + -240] - x1[x1Pos + 208]) * enwindow[wp + -3];
            s -= x1[x1Pos + 224];
            u = s - t;
            v = s + t;
            t = a[14];
            s = a[15] - t;
            a[31] = v + t;
            a[30] = u + s;
            a[15] = u - s;
            a[14] = v - t;
          }
          {
            var xr;
            xr = a[28] - a[0];
            a[0] += a[28];
            a[28] = xr * enwindow[wp + -2 * 18 + 7];
            xr = a[29] - a[1];
            a[1] += a[29];
            a[29] = xr * enwindow[wp + -2 * 18 + 7];
            xr = a[26] - a[2];
            a[2] += a[26];
            a[26] = xr * enwindow[wp + -4 * 18 + 7];
            xr = a[27] - a[3];
            a[3] += a[27];
            a[27] = xr * enwindow[wp + -4 * 18 + 7];
            xr = a[24] - a[4];
            a[4] += a[24];
            a[24] = xr * enwindow[wp + -6 * 18 + 7];
            xr = a[25] - a[5];
            a[5] += a[25];
            a[25] = xr * enwindow[wp + -6 * 18 + 7];
            xr = a[22] - a[6];
            a[6] += a[22];
            a[22] = xr * Util2.SQRT2;
            xr = a[23] - a[7];
            a[7] += a[23];
            a[23] = xr * Util2.SQRT2 - a[7];
            a[7] -= a[6];
            a[22] -= a[7];
            a[23] -= a[22];
            xr = a[6];
            a[6] = a[31] - xr;
            a[31] = a[31] + xr;
            xr = a[7];
            a[7] = a[30] - xr;
            a[30] = a[30] + xr;
            xr = a[22];
            a[22] = a[15] - xr;
            a[15] = a[15] + xr;
            xr = a[23];
            a[23] = a[14] - xr;
            a[14] = a[14] + xr;
            xr = a[20] - a[8];
            a[8] += a[20];
            a[20] = xr * enwindow[wp + -10 * 18 + 7];
            xr = a[21] - a[9];
            a[9] += a[21];
            a[21] = xr * enwindow[wp + -10 * 18 + 7];
            xr = a[18] - a[10];
            a[10] += a[18];
            a[18] = xr * enwindow[wp + -12 * 18 + 7];
            xr = a[19] - a[11];
            a[11] += a[19];
            a[19] = xr * enwindow[wp + -12 * 18 + 7];
            xr = a[16] - a[12];
            a[12] += a[16];
            a[16] = xr * enwindow[wp + -14 * 18 + 7];
            xr = a[17] - a[13];
            a[13] += a[17];
            a[17] = xr * enwindow[wp + -14 * 18 + 7];
            xr = -a[20] + a[24];
            a[20] += a[24];
            a[24] = xr * enwindow[wp + -12 * 18 + 7];
            xr = -a[21] + a[25];
            a[21] += a[25];
            a[25] = xr * enwindow[wp + -12 * 18 + 7];
            xr = a[4] - a[8];
            a[4] += a[8];
            a[8] = xr * enwindow[wp + -12 * 18 + 7];
            xr = a[5] - a[9];
            a[5] += a[9];
            a[9] = xr * enwindow[wp + -12 * 18 + 7];
            xr = a[0] - a[12];
            a[0] += a[12];
            a[12] = xr * enwindow[wp + -4 * 18 + 7];
            xr = a[1] - a[13];
            a[1] += a[13];
            a[13] = xr * enwindow[wp + -4 * 18 + 7];
            xr = a[16] - a[28];
            a[16] += a[28];
            a[28] = xr * enwindow[wp + -4 * 18 + 7];
            xr = -a[17] + a[29];
            a[17] += a[29];
            a[29] = xr * enwindow[wp + -4 * 18 + 7];
            xr = Util2.SQRT2 * (a[2] - a[10]);
            a[2] += a[10];
            a[10] = xr;
            xr = Util2.SQRT2 * (a[3] - a[11]);
            a[3] += a[11];
            a[11] = xr;
            xr = Util2.SQRT2 * (-a[18] + a[26]);
            a[18] += a[26];
            a[26] = xr - a[18];
            xr = Util2.SQRT2 * (-a[19] + a[27]);
            a[19] += a[27];
            a[27] = xr - a[19];
            xr = a[2];
            a[19] -= a[3];
            a[3] -= xr;
            a[2] = a[31] - xr;
            a[31] += xr;
            xr = a[3];
            a[11] -= a[19];
            a[18] -= xr;
            a[3] = a[30] - xr;
            a[30] += xr;
            xr = a[18];
            a[27] -= a[11];
            a[19] -= xr;
            a[18] = a[15] - xr;
            a[15] += xr;
            xr = a[19];
            a[10] -= xr;
            a[19] = a[14] - xr;
            a[14] += xr;
            xr = a[10];
            a[11] -= xr;
            a[10] = a[23] - xr;
            a[23] += xr;
            xr = a[11];
            a[26] -= xr;
            a[11] = a[22] - xr;
            a[22] += xr;
            xr = a[26];
            a[27] -= xr;
            a[26] = a[7] - xr;
            a[7] += xr;
            xr = a[27];
            a[27] = a[6] - xr;
            a[6] += xr;
            xr = Util2.SQRT2 * (a[0] - a[4]);
            a[0] += a[4];
            a[4] = xr;
            xr = Util2.SQRT2 * (a[1] - a[5]);
            a[1] += a[5];
            a[5] = xr;
            xr = Util2.SQRT2 * (a[16] - a[20]);
            a[16] += a[20];
            a[20] = xr;
            xr = Util2.SQRT2 * (a[17] - a[21]);
            a[17] += a[21];
            a[21] = xr;
            xr = -Util2.SQRT2 * (a[8] - a[12]);
            a[8] += a[12];
            a[12] = xr - a[8];
            xr = -Util2.SQRT2 * (a[9] - a[13]);
            a[9] += a[13];
            a[13] = xr - a[9];
            xr = -Util2.SQRT2 * (a[25] - a[29]);
            a[25] += a[29];
            a[29] = xr - a[25];
            xr = -Util2.SQRT2 * (a[24] + a[28]);
            a[24] -= a[28];
            a[28] = xr - a[24];
            xr = a[24] - a[16];
            a[24] = xr;
            xr = a[20] - xr;
            a[20] = xr;
            xr = a[28] - xr;
            a[28] = xr;
            xr = a[25] - a[17];
            a[25] = xr;
            xr = a[21] - xr;
            a[21] = xr;
            xr = a[29] - xr;
            a[29] = xr;
            xr = a[17] - a[1];
            a[17] = xr;
            xr = a[9] - xr;
            a[9] = xr;
            xr = a[25] - xr;
            a[25] = xr;
            xr = a[5] - xr;
            a[5] = xr;
            xr = a[21] - xr;
            a[21] = xr;
            xr = a[13] - xr;
            a[13] = xr;
            xr = a[29] - xr;
            a[29] = xr;
            xr = a[1] - a[0];
            a[1] = xr;
            xr = a[16] - xr;
            a[16] = xr;
            xr = a[17] - xr;
            a[17] = xr;
            xr = a[8] - xr;
            a[8] = xr;
            xr = a[9] - xr;
            a[9] = xr;
            xr = a[24] - xr;
            a[24] = xr;
            xr = a[25] - xr;
            a[25] = xr;
            xr = a[4] - xr;
            a[4] = xr;
            xr = a[5] - xr;
            a[5] = xr;
            xr = a[20] - xr;
            a[20] = xr;
            xr = a[21] - xr;
            a[21] = xr;
            xr = a[12] - xr;
            a[12] = xr;
            xr = a[13] - xr;
            a[13] = xr;
            xr = a[28] - xr;
            a[28] = xr;
            xr = a[29] - xr;
            a[29] = xr;
            xr = a[0];
            a[0] += a[31];
            a[31] -= xr;
            xr = a[1];
            a[1] += a[30];
            a[30] -= xr;
            xr = a[16];
            a[16] += a[15];
            a[15] -= xr;
            xr = a[17];
            a[17] += a[14];
            a[14] -= xr;
            xr = a[8];
            a[8] += a[23];
            a[23] -= xr;
            xr = a[9];
            a[9] += a[22];
            a[22] -= xr;
            xr = a[24];
            a[24] += a[7];
            a[7] -= xr;
            xr = a[25];
            a[25] += a[6];
            a[6] -= xr;
            xr = a[4];
            a[4] += a[27];
            a[27] -= xr;
            xr = a[5];
            a[5] += a[26];
            a[26] -= xr;
            xr = a[20];
            a[20] += a[11];
            a[11] -= xr;
            xr = a[21];
            a[21] += a[10];
            a[10] -= xr;
            xr = a[12];
            a[12] += a[19];
            a[19] -= xr;
            xr = a[13];
            a[13] += a[18];
            a[18] -= xr;
            xr = a[28];
            a[28] += a[3];
            a[3] -= xr;
            xr = a[29];
            a[29] += a[2];
            a[2] -= xr;
          }
        }
        function mdct_short(inout, inoutPos) {
          for (var l2 = 0; l2 < 3; l2++) {
            var tc0, tc1, tc2, ts0, ts1, ts2;
            ts0 = inout[inoutPos + 2 * 3] * win[Encoder2.SHORT_TYPE][0] - inout[inoutPos + 5 * 3];
            tc0 = inout[inoutPos + 0 * 3] * win[Encoder2.SHORT_TYPE][2] - inout[inoutPos + 3 * 3];
            tc1 = ts0 + tc0;
            tc2 = ts0 - tc0;
            ts0 = inout[inoutPos + 5 * 3] * win[Encoder2.SHORT_TYPE][0] + inout[inoutPos + 2 * 3];
            tc0 = inout[inoutPos + 3 * 3] * win[Encoder2.SHORT_TYPE][2] + inout[inoutPos + 0 * 3];
            ts1 = ts0 + tc0;
            ts2 = -ts0 + tc0;
            tc0 = (inout[inoutPos + 1 * 3] * win[Encoder2.SHORT_TYPE][1] - inout[inoutPos + 4 * 3]) * 2069978111953089e-26;
            ts0 = (inout[inoutPos + 4 * 3] * win[Encoder2.SHORT_TYPE][1] + inout[inoutPos + 1 * 3]) * 2069978111953089e-26;
            inout[inoutPos + 3 * 0] = tc1 * 190752519173728e-25 + tc0;
            inout[inoutPos + 3 * 5] = -ts1 * 190752519173728e-25 + ts0;
            tc2 = tc2 * 0.8660254037844387 * 1907525191737281e-26;
            ts1 = ts1 * 0.5 * 1907525191737281e-26 + ts0;
            inout[inoutPos + 3 * 1] = tc2 - ts1;
            inout[inoutPos + 3 * 2] = tc2 + ts1;
            tc1 = tc1 * 0.5 * 1907525191737281e-26 - tc0;
            ts2 = ts2 * 0.8660254037844387 * 1907525191737281e-26;
            inout[inoutPos + 3 * 3] = tc1 + ts2;
            inout[inoutPos + 3 * 4] = tc1 - ts2;
            inoutPos++;
          }
        }
        function mdct_long(out, outPos, _in) {
          var ct, st;
          {
            var tc1, tc2, tc3, tc4, ts5, ts6, ts7, ts8;
            tc1 = _in[17] - _in[9];
            tc3 = _in[15] - _in[11];
            tc4 = _in[14] - _in[12];
            ts5 = _in[0] + _in[8];
            ts6 = _in[1] + _in[7];
            ts7 = _in[2] + _in[6];
            ts8 = _in[3] + _in[5];
            out[outPos + 17] = ts5 + ts7 - ts8 - (ts6 - _in[4]);
            st = (ts5 + ts7 - ts8) * cx[12 + 7] + (ts6 - _in[4]);
            ct = (tc1 - tc3 - tc4) * cx[12 + 6];
            out[outPos + 5] = ct + st;
            out[outPos + 6] = ct - st;
            tc2 = (_in[16] - _in[10]) * cx[12 + 6];
            ts6 = ts6 * cx[12 + 7] + _in[4];
            ct = tc1 * cx[12 + 0] + tc2 + tc3 * cx[12 + 1] + tc4 * cx[12 + 2];
            st = -ts5 * cx[12 + 4] + ts6 - ts7 * cx[12 + 5] + ts8 * cx[12 + 3];
            out[outPos + 1] = ct + st;
            out[outPos + 2] = ct - st;
            ct = tc1 * cx[12 + 1] - tc2 - tc3 * cx[12 + 2] + tc4 * cx[12 + 0];
            st = -ts5 * cx[12 + 5] + ts6 - ts7 * cx[12 + 3] + ts8 * cx[12 + 4];
            out[outPos + 9] = ct + st;
            out[outPos + 10] = ct - st;
            ct = tc1 * cx[12 + 2] - tc2 + tc3 * cx[12 + 0] - tc4 * cx[12 + 1];
            st = ts5 * cx[12 + 3] - ts6 + ts7 * cx[12 + 4] - ts8 * cx[12 + 5];
            out[outPos + 13] = ct + st;
            out[outPos + 14] = ct - st;
          }
          {
            var ts1, ts2, ts3, ts4, tc5, tc6, tc7, tc8;
            ts1 = _in[8] - _in[0];
            ts3 = _in[6] - _in[2];
            ts4 = _in[5] - _in[3];
            tc5 = _in[17] + _in[9];
            tc6 = _in[16] + _in[10];
            tc7 = _in[15] + _in[11];
            tc8 = _in[14] + _in[12];
            out[outPos + 0] = tc5 + tc7 + tc8 + (tc6 + _in[13]);
            ct = (tc5 + tc7 + tc8) * cx[12 + 7] - (tc6 + _in[13]);
            st = (ts1 - ts3 + ts4) * cx[12 + 6];
            out[outPos + 11] = ct + st;
            out[outPos + 12] = ct - st;
            ts2 = (_in[7] - _in[1]) * cx[12 + 6];
            tc6 = _in[13] - tc6 * cx[12 + 7];
            ct = tc5 * cx[12 + 3] - tc6 + tc7 * cx[12 + 4] + tc8 * cx[12 + 5];
            st = ts1 * cx[12 + 2] + ts2 + ts3 * cx[12 + 0] + ts4 * cx[12 + 1];
            out[outPos + 3] = ct + st;
            out[outPos + 4] = ct - st;
            ct = -tc5 * cx[12 + 5] + tc6 - tc7 * cx[12 + 3] - tc8 * cx[12 + 4];
            st = ts1 * cx[12 + 1] + ts2 - ts3 * cx[12 + 2] - ts4 * cx[12 + 0];
            out[outPos + 7] = ct + st;
            out[outPos + 8] = ct - st;
            ct = -tc5 * cx[12 + 4] + tc6 - tc7 * cx[12 + 5] - tc8 * cx[12 + 3];
            st = ts1 * cx[12 + 0] - ts2 + ts3 * cx[12 + 1] - ts4 * cx[12 + 2];
            out[outPos + 15] = ct + st;
            out[outPos + 16] = ct - st;
          }
        }
        this.mdct_sub48 = function(gfc, w0, w1) {
          var wk = w0;
          var wkPos = 286;
          for (var ch = 0; ch < gfc.channels_out; ch++) {
            for (var gr = 0; gr < gfc.mode_gr; gr++) {
              var band;
              var gi = gfc.l3_side.tt[gr][ch];
              var mdct_enc = gi.xr;
              var mdct_encPos = 0;
              var samp = gfc.sb_sample[ch][1 - gr];
              var sampPos = 0;
              for (var k2 = 0; k2 < 18 / 2; k2++) {
                window_subband(wk, wkPos, samp[sampPos]);
                window_subband(wk, wkPos + 32, samp[sampPos + 1]);
                sampPos += 2;
                wkPos += 64;
                for (band = 1; band < 32; band += 2) {
                  samp[sampPos - 1][band] *= -1;
                }
              }
              for (band = 0; band < 32; band++, mdct_encPos += 18) {
                var type = gi.block_type;
                var band0 = gfc.sb_sample[ch][gr];
                var band1 = gfc.sb_sample[ch][1 - gr];
                if (gi.mixed_block_flag != 0 && band < 2)
                  type = 0;
                if (gfc.amp_filter[band] < 1e-12) {
                  Arrays2.fill(
                    mdct_enc,
                    mdct_encPos + 0,
                    mdct_encPos + 18,
                    0
                  );
                } else {
                  if (gfc.amp_filter[band] < 1) {
                    abort();
                  }
                  if (type == Encoder2.SHORT_TYPE) {
                    for (var k2 = -NS / 4; k2 < 0; k2++) {
                      var w = win[Encoder2.SHORT_TYPE][k2 + 3];
                      mdct_enc[mdct_encPos + k2 * 3 + 9] = band0[9 + k2][order[band]] * w - band0[8 - k2][order[band]];
                      mdct_enc[mdct_encPos + k2 * 3 + 18] = band0[14 - k2][order[band]] * w + band0[15 + k2][order[band]];
                      mdct_enc[mdct_encPos + k2 * 3 + 10] = band0[15 + k2][order[band]] * w - band0[14 - k2][order[band]];
                      mdct_enc[mdct_encPos + k2 * 3 + 19] = band1[2 - k2][order[band]] * w + band1[3 + k2][order[band]];
                      mdct_enc[mdct_encPos + k2 * 3 + 11] = band1[3 + k2][order[band]] * w - band1[2 - k2][order[band]];
                      mdct_enc[mdct_encPos + k2 * 3 + 20] = band1[8 - k2][order[band]] * w + band1[9 + k2][order[band]];
                    }
                    mdct_short(mdct_enc, mdct_encPos);
                  } else {
                    var work = new_float2(18);
                    for (var k2 = -NL / 4; k2 < 0; k2++) {
                      var a, b;
                      a = win[type][k2 + 27] * band1[k2 + 9][order[band]] + win[type][k2 + 36] * band1[8 - k2][order[band]];
                      b = win[type][k2 + 9] * band0[k2 + 9][order[band]] - win[type][k2 + 18] * band0[8 - k2][order[band]];
                      work[k2 + 9] = a - b * tantab_l[3 + k2 + 9];
                      work[k2 + 18] = a * tantab_l[3 + k2 + 9] + b;
                    }
                    mdct_long(mdct_enc, mdct_encPos, work);
                  }
                }
                if (type != Encoder2.SHORT_TYPE && band != 0) {
                  for (var k2 = 7; k2 >= 0; --k2) {
                    var bu, bd;
                    bu = mdct_enc[mdct_encPos + k2] * ca[20 + k2] + mdct_enc[mdct_encPos + -1 - k2] * cs[28 + k2];
                    bd = mdct_enc[mdct_encPos + k2] * cs[28 + k2] - mdct_enc[mdct_encPos + -1 - k2] * ca[20 + k2];
                    mdct_enc[mdct_encPos + -1 - k2] = bu;
                    mdct_enc[mdct_encPos + k2] = bd;
                  }
                }
              }
            }
            wk = w1;
            wkPos = 286;
            if (gfc.mode_gr == 1) {
              for (var i = 0; i < 18; i++) {
                System2.arraycopy(
                  gfc.sb_sample[ch][1][i],
                  0,
                  gfc.sb_sample[ch][0][i],
                  0,
                  32
                );
              }
            }
          }
        };
      }
      function III_psy_ratio() {
        this.thm = new III_psy_xmin2();
        this.en = new III_psy_xmin2();
      }
      Encoder2.ENCDELAY = 576;
      Encoder2.POSTDELAY = 1152;
      Encoder2.MDCTDELAY = 48;
      Encoder2.FFTOFFSET = 224 + Encoder2.MDCTDELAY;
      Encoder2.DECDELAY = 528;
      Encoder2.SBLIMIT = 32;
      Encoder2.CBANDS = 64;
      Encoder2.SBPSY_l = 21;
      Encoder2.SBPSY_s = 12;
      Encoder2.SBMAX_l = 22;
      Encoder2.SBMAX_s = 13;
      Encoder2.PSFB21 = 6;
      Encoder2.PSFB12 = 6;
      Encoder2.BLKSIZE = 1024;
      Encoder2.HBLKSIZE = Encoder2.BLKSIZE / 2 + 1;
      Encoder2.BLKSIZE_s = 256;
      Encoder2.HBLKSIZE_s = Encoder2.BLKSIZE_s / 2 + 1;
      Encoder2.NORM_TYPE = 0;
      Encoder2.START_TYPE = 1;
      Encoder2.SHORT_TYPE = 2;
      Encoder2.STOP_TYPE = 3;
      Encoder2.MPG_MD_LR_LR = 0;
      Encoder2.MPG_MD_LR_I = 1;
      Encoder2.MPG_MD_MS_LR = 2;
      Encoder2.MPG_MD_MS_I = 3;
      Encoder2.fircoef = [
        -0.0207887 * 5,
        -0.0378413 * 5,
        -0.0432472 * 5,
        -0.031183 * 5,
        779609e-23 * 5,
        0.0467745 * 5,
        0.10091 * 5,
        0.151365 * 5,
        0.187098 * 5
      ];
      function Encoder2() {
        var MPG_MD_MS_LR = Encoder2.MPG_MD_MS_LR;
        var bs = null;
        this.psy = null;
        var psy = null;
        var vbr = null;
        this.setModules = function(_bs, _psy, _qupvt, _vbr) {
          bs = _bs;
          this.psy = _psy;
          psy = _psy;
          vbr = _vbr;
        };
        var newMDCT = new NewMDCT();
        function adjust_ATH(gfc) {
          var gr2_max, max_pow;
          if (gfc.ATH.useAdjust == 0) {
            gfc.ATH.adjust = 1;
            return;
          }
          max_pow = gfc.loudness_sq[0][0];
          gr2_max = gfc.loudness_sq[1][0];
          if (gfc.channels_out == 2) {
            abort();
          } else {
            max_pow += max_pow;
            gr2_max += gr2_max;
          }
          if (gfc.mode_gr == 2) {
            max_pow = Math.max(max_pow, gr2_max);
          }
          max_pow *= 0.5;
          max_pow *= gfc.ATH.aaSensitivityP;
          if (max_pow > 0.03125) {
            if (gfc.ATH.adjust >= 1) {
              gfc.ATH.adjust = 1;
            } else {
              if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
                gfc.ATH.adjust = gfc.ATH.adjustLimit;
              }
            }
            gfc.ATH.adjustLimit = 1;
          } else {
            var adj_lim_new = 31.98 * max_pow + 625e-6;
            if (gfc.ATH.adjust >= adj_lim_new) {
              gfc.ATH.adjust *= adj_lim_new * 0.075 + 0.925;
              if (gfc.ATH.adjust < adj_lim_new) {
                gfc.ATH.adjust = adj_lim_new;
              }
            } else {
              if (gfc.ATH.adjustLimit >= adj_lim_new) {
                gfc.ATH.adjust = adj_lim_new;
              } else {
                if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
                  gfc.ATH.adjust = gfc.ATH.adjustLimit;
                }
              }
            }
            gfc.ATH.adjustLimit = adj_lim_new;
          }
        }
        function updateStats(gfc) {
          var gr, ch;
          gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][4]++;
          gfc.bitrate_stereoMode_Hist[15][4]++;
          if (gfc.channels_out == 2) {
            abort();
          }
          for (gr = 0; gr < gfc.mode_gr; ++gr) {
            for (ch = 0; ch < gfc.channels_out; ++ch) {
              var bt = gfc.l3_side.tt[gr][ch].block_type | 0;
              if (gfc.l3_side.tt[gr][ch].mixed_block_flag != 0)
                bt = 4;
              gfc.bitrate_blockType_Hist[gfc.bitrate_index][bt]++;
              gfc.bitrate_blockType_Hist[gfc.bitrate_index][5]++;
              gfc.bitrate_blockType_Hist[15][bt]++;
              gfc.bitrate_blockType_Hist[15][5]++;
            }
          }
        }
        function lame_encode_frame_init(gfp, inbuf) {
          var gfc = gfp.internal_flags;
          var ch, gr;
          if (gfc.lame_encode_frame_init == 0) {
            var i, j;
            var primebuff0 = new_float2(286 + 1152 + 576);
            var primebuff1 = new_float2(286 + 1152 + 576);
            gfc.lame_encode_frame_init = 1;
            for (i = 0, j = 0; i < 286 + 576 * (1 + gfc.mode_gr); ++i) {
              if (i < 576 * gfc.mode_gr) {
                primebuff0[i] = 0;
                if (gfc.channels_out == 2)
                  primebuff1[i] = 0;
              } else {
                primebuff0[i] = inbuf[0][j];
                if (gfc.channels_out == 2)
                  primebuff1[i] = inbuf[1][j];
                ++j;
              }
            }
            for (gr = 0; gr < gfc.mode_gr; gr++) {
              for (ch = 0; ch < gfc.channels_out; ch++) {
                gfc.l3_side.tt[gr][ch].block_type = Encoder2.SHORT_TYPE;
              }
            }
            newMDCT.mdct_sub48(gfc, primebuff0, primebuff1);
          }
        }
        this.lame_encode_mp3_frame = function(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
          var mp3count;
          var masking_LR = new_array_n2([2, 2]);
          masking_LR[0][0] = new III_psy_ratio();
          masking_LR[0][1] = new III_psy_ratio();
          masking_LR[1][0] = new III_psy_ratio();
          masking_LR[1][1] = new III_psy_ratio();
          var masking_MS = new_array_n2([2, 2]);
          masking_MS[0][0] = new III_psy_ratio();
          masking_MS[0][1] = new III_psy_ratio();
          masking_MS[1][0] = new III_psy_ratio();
          masking_MS[1][1] = new III_psy_ratio();
          var masking;
          var inbuf = [null, null];
          var gfc = gfp.internal_flags;
          var tot_ener = new_float_n2([2, 4]);
          var ms_ener_ratio = [0.5, 0.5];
          var pe = [[0, 0], [0, 0]];
          var pe_MS = [[0, 0], [0, 0]];
          var pe_use;
          var ch, gr;
          inbuf[0] = inbuf_l;
          inbuf[1] = inbuf_r;
          if (gfc.lame_encode_frame_init == 0) {
            lame_encode_frame_init(gfp, inbuf);
          }
          gfc.padding = 0;
          if ((gfc.slot_lag -= gfc.frac_SpF) < 0) {
            gfc.slot_lag += gfp.out_samplerate;
            gfc.padding = 1;
          }
          if (gfc.psymodel != 0) {
            var ret;
            var bufp = [null, null];
            var bufpPos = 0;
            var blocktype = new_int2(2);
            for (gr = 0; gr < gfc.mode_gr; gr++) {
              for (ch = 0; ch < gfc.channels_out; ch++) {
                bufp[ch] = inbuf[ch];
                bufpPos = 576 + gr * 576 - Encoder2.FFTOFFSET;
              }
              if (gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) {
                abort();
              } else {
                ret = psy.L3psycho_anal_ns(
                  gfp,
                  bufp,
                  bufpPos,
                  gr,
                  masking_LR,
                  masking_MS,
                  pe[gr],
                  pe_MS[gr],
                  tot_ener[gr],
                  blocktype
                );
              }
              if (ret != 0)
                return -4;
              if (gfp.mode == MPEGMode2.JOINT_STEREO) {
                abort();
              }
              for (ch = 0; ch < gfc.channels_out; ch++) {
                var cod_info = gfc.l3_side.tt[gr][ch];
                cod_info.block_type = blocktype[ch];
                cod_info.mixed_block_flag = 0;
              }
            }
          } else {
            abort();
          }
          adjust_ATH(gfc);
          newMDCT.mdct_sub48(gfc, inbuf[0], inbuf[1]);
          gfc.mode_ext = Encoder2.MPG_MD_LR_LR;
          if (gfp.force_ms) {
            gfc.mode_ext = Encoder2.MPG_MD_MS_LR;
          } else if (gfp.mode == MPEGMode2.JOINT_STEREO) {
            abort();
          }
          if (gfc.mode_ext == MPG_MD_MS_LR) {
            masking = masking_MS;
            pe_use = pe_MS;
          } else {
            masking = masking_LR;
            pe_use = pe;
          }
          if (gfp.analysis && gfc.pinfo != null) {
            abort();
          }
          if (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_abr) {
            var i;
            var f2;
            for (i = 0; i < 18; i++)
              gfc.nsPsy.pefirbuf[i] = gfc.nsPsy.pefirbuf[i + 1];
            f2 = 0;
            for (gr = 0; gr < gfc.mode_gr; gr++)
              for (ch = 0; ch < gfc.channels_out; ch++)
                f2 += pe_use[gr][ch];
            gfc.nsPsy.pefirbuf[18] = f2;
            f2 = gfc.nsPsy.pefirbuf[9];
            for (i = 0; i < 9; i++)
              f2 += (gfc.nsPsy.pefirbuf[i] + gfc.nsPsy.pefirbuf[18 - i]) * Encoder2.fircoef[i];
            f2 = 670 * 5 * gfc.mode_gr * gfc.channels_out / f2;
            for (gr = 0; gr < gfc.mode_gr; gr++) {
              for (ch = 0; ch < gfc.channels_out; ch++) {
                pe_use[gr][ch] *= f2;
              }
            }
          }
          gfc.iteration_loop.iteration_loop(gfp, pe_use, ms_ener_ratio, masking);
          bs.format_bitstream(gfp);
          mp3count = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 1);
          if (gfp.bWriteVbrTag)
            vbr.addVbrFrame(gfp);
          if (gfp.analysis && gfc.pinfo != null) {
            abort();
          }
          updateStats(gfc);
          return mp3count;
        };
      }
      function VBRSeekInfo2() {
        this.sum = 0;
        this.seen = 0;
        this.want = 0;
        this.pos = 0;
        this.size = 0;
        this.bag = null;
        this.nVbrNumFrames = 0;
        this.nBytesWritten = 0;
        this.TotalFrameSize = 0;
      }
      function IIISideInfo2() {
        this.tt = [[null, null], [null, null]];
        this.main_data_begin = 0;
        this.private_bits = 0;
        this.resvDrain_pre = 0;
        this.resvDrain_post = 0;
        this.scfsi = [new_int2(4), new_int2(4)];
        for (var gr = 0; gr < 2; gr++) {
          for (var ch = 0; ch < 2; ch++) {
            this.tt[gr][ch] = new GrInfo2();
          }
        }
      }
      function III_psy_xmin2() {
        this.l = new_float2(Encoder2.SBMAX_l);
        this.s = new_float_n2([Encoder2.SBMAX_s, 3]);
        var self2 = this;
        this.assign = function(iii_psy_xmin) {
          System2.arraycopy(iii_psy_xmin.l, 0, self2.l, 0, Encoder2.SBMAX_l);
          for (var i = 0; i < Encoder2.SBMAX_s; i++) {
            for (var j = 0; j < 3; j++) {
              self2.s[i][j] = iii_psy_xmin.s[i][j];
            }
          }
        };
      }
      function NsPsy2() {
        this.last_en_subshort = new_float_n2([4, 9]);
        this.lastAttacks = new_int2(4);
        this.pefirbuf = new_float2(19);
        this.longfact = new_float2(Encoder2.SBMAX_l);
        this.shortfact = new_float2(Encoder2.SBMAX_s);
        this.attackthre = 0;
        this.attackthre_s = 0;
      }
      LameInternalFlags2.MFSIZE = 3 * 1152 + Encoder2.ENCDELAY - Encoder2.MDCTDELAY;
      LameInternalFlags2.MAX_HEADER_BUF = 256;
      LameInternalFlags2.MAX_BITS_PER_CHANNEL = 4095;
      LameInternalFlags2.MAX_BITS_PER_GRANULE = 7680;
      LameInternalFlags2.BPC = 320;
      function LameInternalFlags2() {
        var MAX_HEADER_LEN = 40;
        this.Class_ID = 0;
        this.lame_encode_frame_init = 0;
        this.iteration_init_init = 0;
        this.fill_buffer_resample_init = 0;
        this.mfbuf = new_float_n2([2, LameInternalFlags2.MFSIZE]);
        this.mode_gr = 0;
        this.channels_in = 0;
        this.channels_out = 0;
        this.resample_ratio = 0;
        this.mf_samples_to_encode = 0;
        this.mf_size = 0;
        this.VBR_min_bitrate = 0;
        this.VBR_max_bitrate = 0;
        this.bitrate_index = 0;
        this.samplerate_index = 0;
        this.mode_ext = 0;
        this.lowpass1 = 0;
        this.lowpass2 = 0;
        this.highpass1 = 0;
        this.highpass2 = 0;
        this.noise_shaping = 0;
        this.noise_shaping_amp = 0;
        this.substep_shaping = 0;
        this.psymodel = 0;
        this.noise_shaping_stop = 0;
        this.subblock_gain = 0;
        this.use_best_huffman = 0;
        this.full_outer_loop = 0;
        this.l3_side = new IIISideInfo2();
        this.ms_ratio = new_float2(2);
        this.padding = 0;
        this.frac_SpF = 0;
        this.slot_lag = 0;
        this.tag_spec = null;
        this.nMusicCRC = 0;
        this.OldValue = new_int2(2);
        this.CurrentStep = new_int2(2);
        this.masking_lower = 0;
        this.bv_scf = new_int2(576);
        this.pseudohalf = new_int2(L3Side2.SFBMAX);
        this.sfb21_extra = false;
        this.inbuf_old = new Array(2);
        this.blackfilt = new Array(2 * LameInternalFlags2.BPC + 1);
        this.itime = new_double2(2);
        this.sideinfo_len = 0;
        this.sb_sample = new_float_n2([2, 2, 18, Encoder2.SBLIMIT]);
        this.amp_filter = new_float2(32);
        function Header() {
          this.write_timing = 0;
          this.ptr = 0;
          this.buf = new_byte2(MAX_HEADER_LEN);
        }
        this.header = new Array(LameInternalFlags2.MAX_HEADER_BUF);
        this.h_ptr = 0;
        this.w_ptr = 0;
        this.ancillary_flag = 0;
        this.ResvSize = 0;
        this.ResvMax = 0;
        this.scalefac_band = new ScaleFac2();
        this.minval_l = new_float2(Encoder2.CBANDS);
        this.minval_s = new_float2(Encoder2.CBANDS);
        this.nb_1 = new_float_n2([4, Encoder2.CBANDS]);
        this.nb_2 = new_float_n2([4, Encoder2.CBANDS]);
        this.nb_s1 = new_float_n2([4, Encoder2.CBANDS]);
        this.nb_s2 = new_float_n2([4, Encoder2.CBANDS]);
        this.s3_ss = null;
        this.s3_ll = null;
        this.decay = 0;
        this.thm = new Array(4);
        this.en = new Array(4);
        this.tot_ener = new_float2(4);
        this.loudness_sq = new_float_n2([2, 2]);
        this.loudness_sq_save = new_float2(2);
        this.mld_l = new_float2(Encoder2.SBMAX_l);
        this.mld_s = new_float2(Encoder2.SBMAX_s);
        this.bm_l = new_int2(Encoder2.SBMAX_l);
        this.bo_l = new_int2(Encoder2.SBMAX_l);
        this.bm_s = new_int2(Encoder2.SBMAX_s);
        this.bo_s = new_int2(Encoder2.SBMAX_s);
        this.npart_l = 0;
        this.npart_s = 0;
        this.s3ind = new_int_n2([Encoder2.CBANDS, 2]);
        this.s3ind_s = new_int_n2([Encoder2.CBANDS, 2]);
        this.numlines_s = new_int2(Encoder2.CBANDS);
        this.numlines_l = new_int2(Encoder2.CBANDS);
        this.rnumlines_l = new_float2(Encoder2.CBANDS);
        this.mld_cb_l = new_float2(Encoder2.CBANDS);
        this.mld_cb_s = new_float2(Encoder2.CBANDS);
        this.numlines_s_num1 = 0;
        this.numlines_l_num1 = 0;
        this.pe = new_float2(4);
        this.ms_ratio_s_old = 0;
        this.ms_ratio_l_old = 0;
        this.ms_ener_ratio_old = 0;
        this.blocktype_old = new_int2(2);
        this.nsPsy = new NsPsy2();
        this.VBR_seek_table = new VBRSeekInfo2();
        this.ATH = null;
        this.PSY = null;
        this.nogap_total = 0;
        this.nogap_current = 0;
        this.decode_on_the_fly = true;
        this.findReplayGain = true;
        this.findPeakSample = true;
        this.PeakSample = 0;
        this.RadioGain = 0;
        this.AudiophileGain = 0;
        this.rgdata = null;
        this.noclipGainChange = 0;
        this.noclipScale = 0;
        this.bitrate_stereoMode_Hist = new_int_n2([16, 4 + 1]);
        this.bitrate_blockType_Hist = new_int_n2([16, 4 + 1 + 1]);
        this.pinfo = null;
        this.hip = null;
        this.in_buffer_nsamples = 0;
        this.in_buffer_0 = null;
        this.in_buffer_1 = null;
        this.iteration_loop = null;
        for (var i = 0; i < this.en.length; i++) {
          this.en[i] = new III_psy_xmin2();
        }
        for (var i = 0; i < this.thm.length; i++) {
          this.thm[i] = new III_psy_xmin2();
        }
        for (var i = 0; i < this.header.length; i++) {
          this.header[i] = new Header();
        }
      }
      function FFT2() {
        var window2 = new_float2(Encoder2.BLKSIZE);
        var window_s = new_float2(Encoder2.BLKSIZE_s / 2);
        var costab = [
          0.9238795325112867,
          0.3826834323650898,
          0.9951847266721969,
          0.0980171403295606,
          0.9996988186962042,
          0.02454122852291229,
          0.9999811752826011,
          0.006135884649154475
        ];
        function fht(fz, fzPos, n2) {
          var tri = 0;
          var k4;
          var fi;
          var gi;
          n2 <<= 1;
          var fn = fzPos + n2;
          k4 = 4;
          do {
            var s1, c1;
            var i, k1, k2, k3, kx;
            kx = k4 >> 1;
            k1 = k4;
            k2 = k4 << 1;
            k3 = k2 + k1;
            k4 = k2 << 1;
            fi = fzPos;
            gi = fi + kx;
            do {
              var f0, f1, f2, f3;
              f1 = fz[fi + 0] - fz[fi + k1];
              f0 = fz[fi + 0] + fz[fi + k1];
              f3 = fz[fi + k2] - fz[fi + k3];
              f2 = fz[fi + k2] + fz[fi + k3];
              fz[fi + k2] = f0 - f2;
              fz[fi + 0] = f0 + f2;
              fz[fi + k3] = f1 - f3;
              fz[fi + k1] = f1 + f3;
              f1 = fz[gi + 0] - fz[gi + k1];
              f0 = fz[gi + 0] + fz[gi + k1];
              f3 = Util2.SQRT2 * fz[gi + k3];
              f2 = Util2.SQRT2 * fz[gi + k2];
              fz[gi + k2] = f0 - f2;
              fz[gi + 0] = f0 + f2;
              fz[gi + k3] = f1 - f3;
              fz[gi + k1] = f1 + f3;
              gi += k4;
              fi += k4;
            } while (fi < fn);
            c1 = costab[tri + 0];
            s1 = costab[tri + 1];
            for (i = 1; i < kx; i++) {
              var c2, s2;
              c2 = 1 - 2 * s1 * s1;
              s2 = 2 * s1 * c1;
              fi = fzPos + i;
              gi = fzPos + k1 - i;
              do {
                var a, b, g0, f0, f1, g1, f2, g2, f3, g3;
                b = s2 * fz[fi + k1] - c2 * fz[gi + k1];
                a = c2 * fz[fi + k1] + s2 * fz[gi + k1];
                f1 = fz[fi + 0] - a;
                f0 = fz[fi + 0] + a;
                g1 = fz[gi + 0] - b;
                g0 = fz[gi + 0] + b;
                b = s2 * fz[fi + k3] - c2 * fz[gi + k3];
                a = c2 * fz[fi + k3] + s2 * fz[gi + k3];
                f3 = fz[fi + k2] - a;
                f2 = fz[fi + k2] + a;
                g3 = fz[gi + k2] - b;
                g2 = fz[gi + k2] + b;
                b = s1 * f2 - c1 * g3;
                a = c1 * f2 + s1 * g3;
                fz[fi + k2] = f0 - a;
                fz[fi + 0] = f0 + a;
                fz[gi + k3] = g1 - b;
                fz[gi + k1] = g1 + b;
                b = c1 * g2 - s1 * f3;
                a = s1 * g2 + c1 * f3;
                fz[gi + k2] = g0 - a;
                fz[gi + 0] = g0 + a;
                fz[fi + k3] = f1 - b;
                fz[fi + k1] = f1 + b;
                gi += k4;
                fi += k4;
              } while (fi < fn);
              c2 = c1;
              c1 = c2 * costab[tri + 0] - s1 * costab[tri + 1];
              s1 = c2 * costab[tri + 1] + s1 * costab[tri + 0];
            }
            tri += 2;
          } while (k4 < n2);
        }
        var rv_tbl = [
          0,
          128,
          64,
          192,
          32,
          160,
          96,
          224,
          16,
          144,
          80,
          208,
          48,
          176,
          112,
          240,
          8,
          136,
          72,
          200,
          40,
          168,
          104,
          232,
          24,
          152,
          88,
          216,
          56,
          184,
          120,
          248,
          4,
          132,
          68,
          196,
          36,
          164,
          100,
          228,
          20,
          148,
          84,
          212,
          52,
          180,
          116,
          244,
          12,
          140,
          76,
          204,
          44,
          172,
          108,
          236,
          28,
          156,
          92,
          220,
          60,
          188,
          124,
          252,
          2,
          130,
          66,
          194,
          34,
          162,
          98,
          226,
          18,
          146,
          82,
          210,
          50,
          178,
          114,
          242,
          10,
          138,
          74,
          202,
          42,
          170,
          106,
          234,
          26,
          154,
          90,
          218,
          58,
          186,
          122,
          250,
          6,
          134,
          70,
          198,
          38,
          166,
          102,
          230,
          22,
          150,
          86,
          214,
          54,
          182,
          118,
          246,
          14,
          142,
          78,
          206,
          46,
          174,
          110,
          238,
          30,
          158,
          94,
          222,
          62,
          190,
          126,
          254
        ];
        this.fft_short = function(gfc, x_real, chn, buffer, bufPos) {
          for (var b = 0; b < 3; b++) {
            var x = Encoder2.BLKSIZE_s / 2;
            var k2 = 65535 & 576 / 3 * (b + 1);
            var j = Encoder2.BLKSIZE_s / 8 - 1;
            do {
              var f0, f1, f2, f3, w;
              var i = rv_tbl[j << 2] & 255;
              f0 = window_s[i] * buffer[chn][bufPos + i + k2];
              w = window_s[127 - i] * buffer[chn][bufPos + i + k2 + 128];
              f1 = f0 - w;
              f0 = f0 + w;
              f2 = window_s[i + 64] * buffer[chn][bufPos + i + k2 + 64];
              w = window_s[63 - i] * buffer[chn][bufPos + i + k2 + 192];
              f3 = f2 - w;
              f2 = f2 + w;
              x -= 4;
              x_real[b][x + 0] = f0 + f2;
              x_real[b][x + 2] = f0 - f2;
              x_real[b][x + 1] = f1 + f3;
              x_real[b][x + 3] = f1 - f3;
              f0 = window_s[i + 1] * buffer[chn][bufPos + i + k2 + 1];
              w = window_s[126 - i] * buffer[chn][bufPos + i + k2 + 129];
              f1 = f0 - w;
              f0 = f0 + w;
              f2 = window_s[i + 65] * buffer[chn][bufPos + i + k2 + 65];
              w = window_s[62 - i] * buffer[chn][bufPos + i + k2 + 193];
              f3 = f2 - w;
              f2 = f2 + w;
              x_real[b][x + Encoder2.BLKSIZE_s / 2 + 0] = f0 + f2;
              x_real[b][x + Encoder2.BLKSIZE_s / 2 + 2] = f0 - f2;
              x_real[b][x + Encoder2.BLKSIZE_s / 2 + 1] = f1 + f3;
              x_real[b][x + Encoder2.BLKSIZE_s / 2 + 3] = f1 - f3;
            } while (--j >= 0);
            fht(x_real[b], x, Encoder2.BLKSIZE_s / 2);
          }
        };
        this.fft_long = function(gfc, y, chn, buffer, bufPos) {
          var jj = Encoder2.BLKSIZE / 8 - 1;
          var x = Encoder2.BLKSIZE / 2;
          do {
            var f0, f1, f2, f3, w;
            var i = rv_tbl[jj] & 255;
            f0 = window2[i] * buffer[chn][bufPos + i];
            w = window2[i + 512] * buffer[chn][bufPos + i + 512];
            f1 = f0 - w;
            f0 = f0 + w;
            f2 = window2[i + 256] * buffer[chn][bufPos + i + 256];
            w = window2[i + 768] * buffer[chn][bufPos + i + 768];
            f3 = f2 - w;
            f2 = f2 + w;
            x -= 4;
            y[x + 0] = f0 + f2;
            y[x + 2] = f0 - f2;
            y[x + 1] = f1 + f3;
            y[x + 3] = f1 - f3;
            f0 = window2[i + 1] * buffer[chn][bufPos + i + 1];
            w = window2[i + 513] * buffer[chn][bufPos + i + 513];
            f1 = f0 - w;
            f0 = f0 + w;
            f2 = window2[i + 257] * buffer[chn][bufPos + i + 257];
            w = window2[i + 769] * buffer[chn][bufPos + i + 769];
            f3 = f2 - w;
            f2 = f2 + w;
            y[x + Encoder2.BLKSIZE / 2 + 0] = f0 + f2;
            y[x + Encoder2.BLKSIZE / 2 + 2] = f0 - f2;
            y[x + Encoder2.BLKSIZE / 2 + 1] = f1 + f3;
            y[x + Encoder2.BLKSIZE / 2 + 3] = f1 - f3;
          } while (--jj >= 0);
          fht(y, x, Encoder2.BLKSIZE / 2);
        };
        this.init_fft = function(gfc) {
          for (var i = 0; i < Encoder2.BLKSIZE; i++)
            window2[i] = 0.42 - 0.5 * Math.cos(2 * Math.PI * (i + 0.5) / Encoder2.BLKSIZE) + 0.08 * Math.cos(4 * Math.PI * (i + 0.5) / Encoder2.BLKSIZE);
          for (var i = 0; i < Encoder2.BLKSIZE_s / 2; i++)
            window_s[i] = 0.5 * (1 - Math.cos(2 * Math.PI * (i + 0.5) / Encoder2.BLKSIZE_s));
        };
      }
      function PsyModel2() {
        var fft = new FFT2();
        var LOG10 = 2.302585092994046;
        var rpelev = 2;
        var rpelev2 = 16;
        var rpelev_s = 2;
        var rpelev2_s = 16;
        var DELBARK = 0.34;
        var VO_SCALE = 1 / (14752 * 14752) / (Encoder2.BLKSIZE / 2);
        var temporalmask_sustain_sec = 0.01;
        var NS_PREECHO_ATT0 = 0.8;
        var NS_PREECHO_ATT1 = 0.6;
        var NS_PREECHO_ATT2 = 0.3;
        var NS_MSFIX = 3.5;
        var NSFIRLEN = 21;
        var LN_TO_LOG10 = 0.2302585093;
        function psycho_loudness_approx(energy, gfc) {
          var loudness_power = 0;
          for (var i = 0; i < Encoder2.BLKSIZE / 2; ++i)
            loudness_power += energy[i] * gfc.ATH.eql_w[i];
          loudness_power *= VO_SCALE;
          return loudness_power;
        }
        function compute_ffts(gfp, fftenergy, fftenergy_s, wsamp_l, wsamp_lPos, wsamp_s, wsamp_sPos, gr_out, chn, buffer, bufPos) {
          var gfc = gfp.internal_flags;
          if (chn < 2) {
            fft.fft_long(gfc, wsamp_l[wsamp_lPos], chn, buffer, bufPos);
            fft.fft_short(gfc, wsamp_s[wsamp_sPos], chn, buffer, bufPos);
          } else if (chn == 2) {
            abort();
          }
          fftenergy[0] = /*fix NON_LINEAR_SCALE_ENERGY*/
          wsamp_l[wsamp_lPos + 0][0];
          fftenergy[0] *= fftenergy[0];
          for (var j = Encoder2.BLKSIZE / 2 - 1; j >= 0; --j) {
            var re = wsamp_l[wsamp_lPos + 0][Encoder2.BLKSIZE / 2 - j];
            var im = wsamp_l[wsamp_lPos + 0][Encoder2.BLKSIZE / 2 + j];
            fftenergy[Encoder2.BLKSIZE / 2 - j] = /*fix NON_LINEAR_SCALE_ENERGY*/
            (re * re + im * im) * 0.5;
          }
          for (var b = 2; b >= 0; --b) {
            fftenergy_s[b][0] = wsamp_s[wsamp_sPos + 0][b][0];
            fftenergy_s[b][0] *= fftenergy_s[b][0];
            for (var j = Encoder2.BLKSIZE_s / 2 - 1; j >= 0; --j) {
              var re = wsamp_s[wsamp_sPos + 0][b][Encoder2.BLKSIZE_s / 2 - j];
              var im = wsamp_s[wsamp_sPos + 0][b][Encoder2.BLKSIZE_s / 2 + j];
              fftenergy_s[b][Encoder2.BLKSIZE_s / 2 - j] = /*fix NON_LINEAR_SCALE_ENERGY*/
              (re * re + im * im) * 0.5;
            }
          }
          {
            var totalenergy = 0;
            for (var j = 11; j < Encoder2.HBLKSIZE; j++)
              totalenergy += fftenergy[j];
            gfc.tot_ener[chn] = totalenergy;
          }
          if (gfp.analysis) {
            abort();
          }
          if (gfp.athaa_loudapprox == 2 && chn < 2) {
            gfc.loudness_sq[gr_out][chn] = gfc.loudness_sq_save[chn];
            gfc.loudness_sq_save[chn] = psycho_loudness_approx(fftenergy, gfc);
          }
        }
        var I1LIMIT = 8;
        var I2LIMIT = 23;
        var MLIMIT = 15;
        var ma_max_i1;
        var ma_max_i2;
        var ma_max_m;
        var tab = [
          1,
          0.79433,
          0.63096,
          0.63096,
          0.63096,
          0.63096,
          0.63096,
          0.25119,
          0.11749
        ];
        function init_mask_add_max_values() {
          ma_max_i1 = Math.pow(10, (I1LIMIT + 1) / 16);
          ma_max_i2 = Math.pow(10, (I2LIMIT + 1) / 16);
          ma_max_m = Math.pow(10, MLIMIT / 10);
        }
        var table1 = [
          3.3246 * 3.3246,
          3.23837 * 3.23837,
          3.15437 * 3.15437,
          3.00412 * 3.00412,
          2.86103 * 2.86103,
          2.65407 * 2.65407,
          2.46209 * 2.46209,
          2.284 * 2.284,
          2.11879 * 2.11879,
          1.96552 * 1.96552,
          1.82335 * 1.82335,
          1.69146 * 1.69146,
          1.56911 * 1.56911,
          1.46658 * 1.46658,
          1.37074 * 1.37074,
          1.31036 * 1.31036,
          1.25264 * 1.25264,
          1.20648 * 1.20648,
          1.16203 * 1.16203,
          1.12765 * 1.12765,
          1.09428 * 1.09428,
          1.0659 * 1.0659,
          1.03826 * 1.03826,
          1.01895 * 1.01895,
          1
        ];
        var table2 = [
          1.33352 * 1.33352,
          1.35879 * 1.35879,
          1.38454 * 1.38454,
          1.39497 * 1.39497,
          1.40548 * 1.40548,
          1.3537 * 1.3537,
          1.30382 * 1.30382,
          1.22321 * 1.22321,
          1.14758 * 1.14758,
          1
        ];
        var table3 = [
          2.35364 * 2.35364,
          2.29259 * 2.29259,
          2.23313 * 2.23313,
          2.12675 * 2.12675,
          2.02545 * 2.02545,
          1.87894 * 1.87894,
          1.74303 * 1.74303,
          1.61695 * 1.61695,
          1.49999 * 1.49999,
          1.39148 * 1.39148,
          1.29083 * 1.29083,
          1.19746 * 1.19746,
          1.11084 * 1.11084,
          1.03826 * 1.03826
        ];
        function mask_add(m1, m2, kk, b, gfc, shortblock) {
          var ratio;
          if (m2 > m1) {
            if (m2 < m1 * ma_max_i2)
              ratio = m2 / m1;
            else
              return m1 + m2;
          } else {
            if (m1 >= m2 * ma_max_i2)
              return m1 + m2;
            ratio = m1 / m2;
          }
          m1 += m2;
          if (b + 3 <= 3 + 3) {
            if (ratio >= ma_max_i1) {
              return m1;
            }
            var i = 0 | Util2.FAST_LOG10_X(ratio, 16);
            return m1 * table2[i];
          }
          var i = 0 | Util2.FAST_LOG10_X(ratio, 16);
          {
            m2 = gfc.ATH.cb_l[kk] * gfc.ATH.adjust;
          }
          if (m1 < ma_max_m * m2) {
            if (m1 > m2) {
              var f2, r;
              f2 = 1;
              if (i <= 13)
                f2 = table3[i];
              r = Util2.FAST_LOG10_X(m1 / m2, 10 / 15);
              return m1 * ((table1[i] - f2) * r + f2);
            }
            if (i > 13)
              return m1;
            return m1 * table3[i];
          }
          return m1 * table1[i];
        }
        function convert_partition2scalefac_s(gfc, eb, thr, chn, sblock) {
          var sb, b;
          var enn = 0;
          var thmm = 0;
          for (sb = b = 0; sb < Encoder2.SBMAX_s; ++b, ++sb) {
            var bo_s_sb = gfc.bo_s[sb];
            var npart_s = gfc.npart_s;
            var b_lim = bo_s_sb < npart_s ? bo_s_sb : npart_s;
            while (b < b_lim) {
              enn += eb[b];
              thmm += thr[b];
              b++;
            }
            gfc.en[chn].s[sb][sblock] = enn;
            gfc.thm[chn].s[sb][sblock] = thmm;
            if (b >= npart_s) {
              ++sb;
              break;
            }
            {
              var w_curr = gfc.PSY.bo_s_weight[sb];
              var w_next = 1 - w_curr;
              enn = w_curr * eb[b];
              thmm = w_curr * thr[b];
              gfc.en[chn].s[sb][sblock] += enn;
              gfc.thm[chn].s[sb][sblock] += thmm;
              enn = w_next * eb[b];
              thmm = w_next * thr[b];
            }
          }
          for (; sb < Encoder2.SBMAX_s; ++sb) {
            gfc.en[chn].s[sb][sblock] = 0;
            gfc.thm[chn].s[sb][sblock] = 0;
          }
        }
        function convert_partition2scalefac_l(gfc, eb, thr, chn) {
          var sb, b;
          var enn = 0;
          var thmm = 0;
          for (sb = b = 0; sb < Encoder2.SBMAX_l; ++b, ++sb) {
            var bo_l_sb = gfc.bo_l[sb];
            var npart_l = gfc.npart_l;
            var b_lim = bo_l_sb < npart_l ? bo_l_sb : npart_l;
            while (b < b_lim) {
              enn += eb[b];
              thmm += thr[b];
              b++;
            }
            gfc.en[chn].l[sb] = enn;
            gfc.thm[chn].l[sb] = thmm;
            if (b >= npart_l) {
              ++sb;
              break;
            }
            {
              var w_curr = gfc.PSY.bo_l_weight[sb];
              var w_next = 1 - w_curr;
              enn = w_curr * eb[b];
              thmm = w_curr * thr[b];
              gfc.en[chn].l[sb] += enn;
              gfc.thm[chn].l[sb] += thmm;
              enn = w_next * eb[b];
              thmm = w_next * thr[b];
            }
          }
          for (; sb < Encoder2.SBMAX_l; ++sb) {
            gfc.en[chn].l[sb] = 0;
            gfc.thm[chn].l[sb] = 0;
          }
        }
        function compute_masking_s(gfp, fftenergy_s, eb, thr, chn, sblock) {
          var gfc = gfp.internal_flags;
          var j, b;
          for (b = j = 0; b < gfc.npart_s; ++b) {
            var ebb = 0;
            var n2 = gfc.numlines_s[b];
            for (var i = 0; i < n2; ++i, ++j) {
              var el = fftenergy_s[sblock][j];
              ebb += el;
            }
            eb[b] = ebb;
          }
          for (j = b = 0; b < gfc.npart_s; b++) {
            var kk = gfc.s3ind_s[b][0];
            var ecb = gfc.s3_ss[j++] * eb[kk];
            ++kk;
            while (kk <= gfc.s3ind_s[b][1]) {
              ecb += gfc.s3_ss[j] * eb[kk];
              ++j;
              ++kk;
            }
            {
              var x = rpelev_s * gfc.nb_s1[chn][b];
              thr[b] = Math.min(ecb, x);
            }
            if (gfc.blocktype_old[chn & 1] == Encoder2.SHORT_TYPE) {
              var x = rpelev2_s * gfc.nb_s2[chn][b];
              var y = thr[b];
              thr[b] = Math.min(x, y);
            }
            gfc.nb_s2[chn][b] = gfc.nb_s1[chn][b];
            gfc.nb_s1[chn][b] = ecb;
          }
          for (; b <= Encoder2.CBANDS; ++b) {
            eb[b] = 0;
            thr[b] = 0;
          }
        }
        function block_type_set(gfp, uselongblock, blocktype_d, blocktype) {
          var gfc = gfp.internal_flags;
          if (gfp.short_blocks == ShortBlock2.short_block_coupled && !(uselongblock[0] != 0 && uselongblock[1] != 0))
            uselongblock[0] = uselongblock[1] = 0;
          for (var chn = 0; chn < gfc.channels_out; chn++) {
            blocktype[chn] = Encoder2.NORM_TYPE;
            if (gfp.short_blocks == ShortBlock2.short_block_dispensed)
              uselongblock[chn] = 1;
            if (gfp.short_blocks == ShortBlock2.short_block_forced)
              uselongblock[chn] = 0;
            if (uselongblock[chn] != 0) {
              if (gfc.blocktype_old[chn] == Encoder2.SHORT_TYPE)
                blocktype[chn] = Encoder2.STOP_TYPE;
            } else {
              blocktype[chn] = Encoder2.SHORT_TYPE;
              if (gfc.blocktype_old[chn] == Encoder2.NORM_TYPE) {
                gfc.blocktype_old[chn] = Encoder2.START_TYPE;
              }
              if (gfc.blocktype_old[chn] == Encoder2.STOP_TYPE)
                gfc.blocktype_old[chn] = Encoder2.SHORT_TYPE;
            }
            blocktype_d[chn] = gfc.blocktype_old[chn];
            gfc.blocktype_old[chn] = blocktype[chn];
          }
        }
        function NS_INTERP(x, y, r) {
          if (r >= 1) {
            return x;
          }
          if (r <= 0)
            return y;
          if (y > 0) {
            return Math.pow(x / y, r) * y;
          }
          return 0;
        }
        var regcoef_s = [
          11.8,
          13.6,
          17.2,
          32,
          46.5,
          51.3,
          57.5,
          67.1,
          71.5,
          84.6,
          97.6,
          130
          /* 255.8 */
        ];
        function pecalc_s(mr, masking_lower) {
          var pe_s = 1236.28 / 4;
          for (var sb = 0; sb < Encoder2.SBMAX_s - 1; sb++) {
            for (var sblock = 0; sblock < 3; sblock++) {
              var thm = mr.thm.s[sb][sblock];
              if (thm > 0) {
                var x = thm * masking_lower;
                var en = mr.en.s[sb][sblock];
                if (en > x) {
                  if (en > x * 1e10) {
                    pe_s += regcoef_s[sb] * (10 * LOG10);
                  } else {
                    pe_s += regcoef_s[sb] * Util2.FAST_LOG10(en / x);
                  }
                }
              }
            }
          }
          return pe_s;
        }
        var regcoef_l = [
          6.8,
          5.8,
          5.8,
          6.4,
          6.5,
          9.9,
          12.1,
          14.4,
          15,
          18.9,
          21.6,
          26.9,
          34.2,
          40.2,
          46.8,
          56.5,
          60.7,
          73.9,
          85.7,
          93.4,
          126.1
          /* 241.3 */
        ];
        function pecalc_l(mr, masking_lower) {
          var pe_l = 1124.23 / 4;
          for (var sb = 0; sb < Encoder2.SBMAX_l - 1; sb++) {
            var thm = mr.thm.l[sb];
            if (thm > 0) {
              var x = thm * masking_lower;
              var en = mr.en.l[sb];
              if (en > x) {
                if (en > x * 1e10) {
                  pe_l += regcoef_l[sb] * (10 * LOG10);
                } else {
                  pe_l += regcoef_l[sb] * Util2.FAST_LOG10(en / x);
                }
              }
            }
          }
          return pe_l;
        }
        function calc_energy(gfc, fftenergy, eb, max, avg) {
          var b, j;
          for (b = j = 0; b < gfc.npart_l; ++b) {
            var ebb = 0, m2 = 0;
            var i;
            for (i = 0; i < gfc.numlines_l[b]; ++i, ++j) {
              var el = fftenergy[j];
              ebb += el;
              if (m2 < el)
                m2 = el;
            }
            eb[b] = ebb;
            max[b] = m2;
            avg[b] = ebb * gfc.rnumlines_l[b];
          }
        }
        function calc_mask_index_l(gfc, max, avg, mask_idx) {
          var last_tab_entry = tab.length - 1;
          var b = 0;
          var a = avg[b] + avg[b + 1];
          if (a > 0) {
            var m2 = max[b];
            if (m2 < max[b + 1])
              m2 = max[b + 1];
            a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
            var k2 = 0 | a;
            if (k2 > last_tab_entry)
              k2 = last_tab_entry;
            mask_idx[b] = k2;
          } else {
            mask_idx[b] = 0;
          }
          for (b = 1; b < gfc.npart_l - 1; b++) {
            a = avg[b - 1] + avg[b] + avg[b + 1];
            if (a > 0) {
              var m2 = max[b - 1];
              if (m2 < max[b])
                m2 = max[b];
              if (m2 < max[b + 1])
                m2 = max[b + 1];
              a = 20 * (m2 * 3 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] + gfc.numlines_l[b + 1] - 1));
              var k2 = 0 | a;
              if (k2 > last_tab_entry)
                k2 = last_tab_entry;
              mask_idx[b] = k2;
            } else {
              mask_idx[b] = 0;
            }
          }
          a = avg[b - 1] + avg[b];
          if (a > 0) {
            var m2 = max[b - 1];
            if (m2 < max[b])
              m2 = max[b];
            a = 20 * (m2 * 2 - a) / (a * (gfc.numlines_l[b - 1] + gfc.numlines_l[b] - 1));
            var k2 = 0 | a;
            if (k2 > last_tab_entry)
              k2 = last_tab_entry;
            mask_idx[b] = k2;
          } else {
            mask_idx[b] = 0;
          }
        }
        var fircoef = [
          -865163e-23 * 2,
          -851586e-8 * 2,
          -674764e-23 * 2,
          0.0209036 * 2,
          -336639e-22 * 2,
          -0.0438162 * 2,
          -154175e-22 * 2,
          0.0931738 * 2,
          -552212e-22 * 2,
          -0.313819 * 2
        ];
        this.L3psycho_anal_ns = function(gfp, buffer, bufPos, gr_out, masking_ratio, masking_MS_ratio, percep_entropy, percep_MS_entropy, energy, blocktype_d) {
          var gfc = gfp.internal_flags;
          var wsamp_L = new_float_n2([2, Encoder2.BLKSIZE]);
          var wsamp_S = new_float_n2([2, 3, Encoder2.BLKSIZE_s]);
          var eb_l = new_float2(Encoder2.CBANDS + 1);
          var eb_s = new_float2(Encoder2.CBANDS + 1);
          var thr = new_float2(Encoder2.CBANDS + 2);
          var blocktype = new_int2(2), uselongblock = new_int2(2);
          var numchn, chn;
          var b, i, j, k2;
          var sb, sblock;
          var ns_hpfsmpl = new_float_n2([2, 576]);
          var pcfact;
          var mask_idx_l = new_int2(Encoder2.CBANDS + 2), mask_idx_s = new_int2(Encoder2.CBANDS + 2);
          Arrays2.fill(mask_idx_s, 0);
          numchn = gfc.channels_out;
          if (gfp.mode == MPEGMode2.JOINT_STEREO)
            numchn = 4;
          if (gfp.VBR == VbrMode2.vbr_off)
            pcfact = gfc.ResvMax == 0 ? 0 : gfc.ResvSize / gfc.ResvMax * 0.5;
          else if (gfp.VBR == VbrMode2.vbr_rh || gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) {
            pcfact = 0.6;
          } else
            pcfact = 1;
          for (chn = 0; chn < gfc.channels_out; chn++) {
            var firbuf2 = buffer[chn];
            var firbufPos = bufPos + 576 - 350 - NSFIRLEN + 192;
            for (i = 0; i < 576; i++) {
              var sum1, sum2;
              sum1 = firbuf2[firbufPos + i + 10];
              sum2 = 0;
              for (j = 0; j < (NSFIRLEN - 1) / 2 - 1; j += 2) {
                sum1 += fircoef[j] * (firbuf2[firbufPos + i + j] + firbuf2[firbufPos + i + NSFIRLEN - j]);
                sum2 += fircoef[j + 1] * (firbuf2[firbufPos + i + j + 1] + firbuf2[firbufPos + i + NSFIRLEN - j - 1]);
              }
              ns_hpfsmpl[chn][i] = sum1 + sum2;
            }
            masking_ratio[gr_out][chn].en.assign(gfc.en[chn]);
            masking_ratio[gr_out][chn].thm.assign(gfc.thm[chn]);
            if (numchn > 2) {
              abort();
            }
          }
          for (chn = 0; chn < numchn; chn++) {
            var wsamp_l;
            var wsamp_s;
            var en_subshort = new_float2(12);
            var en_short = [0, 0, 0, 0];
            var attack_intensity = new_float2(12);
            var ns_uselongblock = 1;
            var attackThreshold;
            var max = new_float2(Encoder2.CBANDS), avg = new_float2(Encoder2.CBANDS);
            var ns_attacks = [0, 0, 0, 0];
            var fftenergy = new_float2(Encoder2.HBLKSIZE);
            var fftenergy_s = new_float_n2([3, Encoder2.HBLKSIZE_s]);
            for (i = 0; i < 3; i++) {
              en_subshort[i] = gfc.nsPsy.last_en_subshort[chn][i + 6];
              attack_intensity[i] = en_subshort[i] / gfc.nsPsy.last_en_subshort[chn][i + 4];
              en_short[0] += en_subshort[i];
            }
            if (chn == 2) {
              abort();
            }
            {
              var pf = ns_hpfsmpl[chn & 1];
              var pfPos = 0;
              for (i = 0; i < 9; i++) {
                var pfe = pfPos + 576 / 9;
                var p2 = 1;
                for (; pfPos < pfe; pfPos++)
                  if (p2 < Math.abs(pf[pfPos]))
                    p2 = Math.abs(pf[pfPos]);
                gfc.nsPsy.last_en_subshort[chn][i] = en_subshort[i + 3] = p2;
                en_short[1 + i / 3] += p2;
                if (p2 > en_subshort[i + 3 - 2]) {
                  p2 = p2 / en_subshort[i + 3 - 2];
                } else if (en_subshort[i + 3 - 2] > p2 * 10) {
                  p2 = en_subshort[i + 3 - 2] / (p2 * 10);
                } else
                  p2 = 0;
                attack_intensity[i + 3] = p2;
              }
            }
            if (gfp.analysis) {
              abort();
            }
            attackThreshold = chn == 3 ? gfc.nsPsy.attackthre_s : gfc.nsPsy.attackthre;
            for (i = 0; i < 12; i++)
              if (0 == ns_attacks[i / 3] && attack_intensity[i] > attackThreshold)
                ns_attacks[i / 3] = i % 3 + 1;
            for (i = 1; i < 4; i++) {
              var ratio;
              if (en_short[i - 1] > en_short[i]) {
                ratio = en_short[i - 1] / en_short[i];
              } else {
                ratio = en_short[i] / en_short[i - 1];
              }
              if (ratio < 1.7) {
                ns_attacks[i] = 0;
                if (i == 1)
                  ns_attacks[0] = 0;
              }
            }
            if (ns_attacks[0] != 0 && gfc.nsPsy.lastAttacks[chn] != 0)
              ns_attacks[0] = 0;
            if (gfc.nsPsy.lastAttacks[chn] == 3 || ns_attacks[0] + ns_attacks[1] + ns_attacks[2] + ns_attacks[3] != 0) {
              ns_uselongblock = 0;
              if (ns_attacks[1] != 0 && ns_attacks[0] != 0)
                ns_attacks[1] = 0;
              if (ns_attacks[2] != 0 && ns_attacks[1] != 0)
                ns_attacks[2] = 0;
              if (ns_attacks[3] != 0 && ns_attacks[2] != 0)
                ns_attacks[3] = 0;
            }
            if (chn < 2) {
              uselongblock[chn] = ns_uselongblock;
            } else {
              abort();
            }
            energy[chn] = gfc.tot_ener[chn];
            wsamp_s = wsamp_S;
            wsamp_l = wsamp_L;
            compute_ffts(
              gfp,
              fftenergy,
              fftenergy_s,
              wsamp_l,
              chn & 1,
              wsamp_s,
              chn & 1,
              gr_out,
              chn,
              buffer,
              bufPos
            );
            calc_energy(gfc, fftenergy, eb_l, max, avg);
            calc_mask_index_l(gfc, max, avg, mask_idx_l);
            for (sblock = 0; sblock < 3; sblock++) {
              var enn, thmm;
              compute_masking_s(gfp, fftenergy_s, eb_s, thr, chn, sblock);
              convert_partition2scalefac_s(gfc, eb_s, thr, chn, sblock);
              for (sb = 0; sb < Encoder2.SBMAX_s; sb++) {
                thmm = gfc.thm[chn].s[sb][sblock];
                thmm *= NS_PREECHO_ATT0;
                if (ns_attacks[sblock] >= 2 || ns_attacks[sblock + 1] == 1) {
                  var idx = sblock != 0 ? sblock - 1 : 2;
                  var p2 = NS_INTERP(
                    gfc.thm[chn].s[sb][idx],
                    thmm,
                    NS_PREECHO_ATT1 * pcfact
                  );
                  thmm = Math.min(thmm, p2);
                }
                if (ns_attacks[sblock] == 1) {
                  var idx = sblock != 0 ? sblock - 1 : 2;
                  var p2 = NS_INTERP(
                    gfc.thm[chn].s[sb][idx],
                    thmm,
                    NS_PREECHO_ATT2 * pcfact
                  );
                  thmm = Math.min(thmm, p2);
                } else if (sblock != 0 && ns_attacks[sblock - 1] == 3 || sblock == 0 && gfc.nsPsy.lastAttacks[chn] == 3) {
                  var idx = sblock != 2 ? sblock + 1 : 0;
                  var p2 = NS_INTERP(
                    gfc.thm[chn].s[sb][idx],
                    thmm,
                    NS_PREECHO_ATT2 * pcfact
                  );
                  thmm = Math.min(thmm, p2);
                }
                enn = en_subshort[sblock * 3 + 3] + en_subshort[sblock * 3 + 4] + en_subshort[sblock * 3 + 5];
                if (en_subshort[sblock * 3 + 5] * 6 < enn) {
                  thmm *= 0.5;
                  if (en_subshort[sblock * 3 + 4] * 6 < enn)
                    thmm *= 0.5;
                }
                gfc.thm[chn].s[sb][sblock] = thmm;
              }
            }
            gfc.nsPsy.lastAttacks[chn] = ns_attacks[2];
            k2 = 0;
            {
              for (b = 0; b < gfc.npart_l; b++) {
                var kk = gfc.s3ind[b][0];
                var eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
                var ecb = gfc.s3_ll[k2++] * eb2;
                while (++kk <= gfc.s3ind[b][1]) {
                  eb2 = eb_l[kk] * tab[mask_idx_l[kk]];
                  ecb = mask_add(
                    ecb,
                    gfc.s3_ll[k2++] * eb2,
                    kk,
                    kk - b,
                    gfc
                  );
                }
                ecb *= 0.158489319246111;
                if (gfc.blocktype_old[chn & 1] == Encoder2.SHORT_TYPE)
                  thr[b] = ecb;
                else
                  thr[b] = NS_INTERP(
                    Math.min(ecb, Math.min(rpelev * gfc.nb_1[chn][b], rpelev2 * gfc.nb_2[chn][b])),
                    ecb,
                    pcfact
                  );
                gfc.nb_2[chn][b] = gfc.nb_1[chn][b];
                gfc.nb_1[chn][b] = ecb;
              }
            }
            for (; b <= Encoder2.CBANDS; ++b) {
              eb_l[b] = 0;
              thr[b] = 0;
            }
            convert_partition2scalefac_l(gfc, eb_l, thr, chn);
          }
          if (gfp.mode == MPEGMode2.STEREO || gfp.mode == MPEGMode2.JOINT_STEREO) {
            abort();
          }
          if (gfp.mode == MPEGMode2.JOINT_STEREO) {
            abort();
          }
          block_type_set(gfp, uselongblock, blocktype_d, blocktype);
          for (chn = 0; chn < numchn; chn++) {
            var ppe;
            var ppePos = 0;
            var type;
            var mr;
            if (chn > 1) {
              abort();
            } else {
              ppe = percep_entropy;
              ppePos = 0;
              type = blocktype_d[chn];
              mr = masking_ratio[gr_out][chn];
            }
            if (type == Encoder2.SHORT_TYPE)
              ppe[ppePos + chn] = pecalc_s(mr, gfc.masking_lower);
            else
              ppe[ppePos + chn] = pecalc_l(mr, gfc.masking_lower);
            if (gfp.analysis)
              gfc.pinfo.pe[gr_out][chn] = ppe[ppePos + chn];
          }
          return 0;
        };
        function s3_func(bark) {
          var tempx, x, tempy, temp;
          tempx = bark;
          if (tempx >= 0)
            tempx *= 3;
          else
            tempx *= 1.5;
          if (tempx >= 0.5 && tempx <= 2.5) {
            temp = tempx - 0.5;
            x = 8 * (temp * temp - 2 * temp);
          } else
            x = 0;
          tempx += 0.474;
          tempy = 15.811389 + 7.5 * tempx - 17.5 * Math.sqrt(1 + tempx * tempx);
          if (tempy <= -60)
            return 0;
          tempx = Math.exp((x + tempy) * LN_TO_LOG10);
          tempx /= 0.6609193;
          return tempx;
        }
        function freq2bark(freq) {
          if (freq < 0)
            freq = 0;
          freq = freq * 1e-3;
          return 13 * Math.atan(0.76 * freq) + 3.5 * Math.atan(freq * freq / (7.5 * 7.5));
        }
        function init_numline(numlines, bo, bm, bval, bval_width, mld, bo_w, sfreq, blksize, scalepos, deltafreq, sbmax) {
          var b_frq = new_float2(Encoder2.CBANDS + 1);
          var sample_freq_frac = sfreq / (sbmax > 15 ? 2 * 576 : 2 * 192);
          var partition = new_int2(Encoder2.HBLKSIZE);
          var i;
          sfreq /= blksize;
          var j = 0;
          var ni = 0;
          for (i = 0; i < Encoder2.CBANDS; i++) {
            var bark1;
            var j2;
            bark1 = freq2bark(sfreq * j);
            b_frq[i] = sfreq * j;
            for (j2 = j; freq2bark(sfreq * j2) - bark1 < DELBARK && j2 <= blksize / 2; j2++)
              ;
            numlines[i] = j2 - j;
            ni = i + 1;
            while (j < j2) {
              partition[j++] = i;
            }
            if (j > blksize / 2) {
              j = blksize / 2;
              ++i;
              break;
            }
          }
          b_frq[i] = sfreq * j;
          for (var sfb = 0; sfb < sbmax; sfb++) {
            var i1, i2, start, end;
            var arg;
            start = scalepos[sfb];
            end = scalepos[sfb + 1];
            i1 = 0 | Math.floor(0.5 + deltafreq * (start - 0.5));
            if (i1 < 0)
              i1 = 0;
            i2 = 0 | Math.floor(0.5 + deltafreq * (end - 0.5));
            if (i2 > blksize / 2)
              i2 = blksize / 2;
            bm[sfb] = (partition[i1] + partition[i2]) / 2;
            bo[sfb] = partition[i2];
            var f_tmp = sample_freq_frac * end;
            bo_w[sfb] = (f_tmp - b_frq[bo[sfb]]) / (b_frq[bo[sfb] + 1] - b_frq[bo[sfb]]);
            if (bo_w[sfb] < 0) {
              bo_w[sfb] = 0;
            } else {
              if (bo_w[sfb] > 1) {
                bo_w[sfb] = 1;
              }
            }
            arg = freq2bark(sfreq * scalepos[sfb] * deltafreq);
            arg = Math.min(arg, 15.5) / 15.5;
            mld[sfb] = Math.pow(
              10,
              1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
            );
          }
          j = 0;
          for (var k2 = 0; k2 < ni; k2++) {
            var w = numlines[k2];
            var bark1, bark2;
            bark1 = freq2bark(sfreq * j);
            bark2 = freq2bark(sfreq * (j + w - 1));
            bval[k2] = 0.5 * (bark1 + bark2);
            bark1 = freq2bark(sfreq * (j - 0.5));
            bark2 = freq2bark(sfreq * (j + w - 0.5));
            bval_width[k2] = bark2 - bark1;
            j += w;
          }
          return ni;
        }
        function init_s3_values(s3ind, npart, bval, bval_width, norm, use_old_s3) {
          var s3 = new_float_n2([Encoder2.CBANDS, Encoder2.CBANDS]);
          var j;
          var numberOfNoneZero = 0;
          if (use_old_s3) {
            for (var i = 0; i < npart; i++) {
              for (j = 0; j < npart; j++) {
                var v = s3_func(bval[i] - bval[j]) * bval_width[j];
                s3[i][j] = v * norm[i];
              }
            }
          } else {
            abort();
          }
          for (var i = 0; i < npart; i++) {
            for (j = 0; j < npart; j++) {
              if (s3[i][j] > 0)
                break;
            }
            s3ind[i][0] = j;
            for (j = npart - 1; j > 0; j--) {
              if (s3[i][j] > 0)
                break;
            }
            s3ind[i][1] = j;
            numberOfNoneZero += s3ind[i][1] - s3ind[i][0] + 1;
          }
          var p2 = new_float2(numberOfNoneZero);
          var k2 = 0;
          for (var i = 0; i < npart; i++)
            for (j = s3ind[i][0]; j <= s3ind[i][1]; j++)
              p2[k2++] = s3[i][j];
          return p2;
        }
        function stereo_demask(f2) {
          var arg = freq2bark(f2);
          arg = Math.min(arg, 15.5) / 15.5;
          return Math.pow(
            10,
            1.25 * (1 - Math.cos(Math.PI * arg)) - 2.5
          );
        }
        this.psymodel_init = function(gfp) {
          var gfc = gfp.internal_flags;
          var i;
          var useOldS3 = true;
          var bvl_a = 13, bvl_b = 24;
          var snr_l_a = 0, snr_l_b = 0;
          var snr_s_a = -8.25, snr_s_b = -4.5;
          var bval = new_float2(Encoder2.CBANDS);
          var bval_width = new_float2(Encoder2.CBANDS);
          var norm = new_float2(Encoder2.CBANDS);
          var sfreq = gfp.out_samplerate;
          switch (gfp.experimentalZ) {
            default:
            case 0:
              useOldS3 = true;
              break;
            case 1:
              useOldS3 = gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt ? false : true;
              break;
            case 2:
              useOldS3 = false;
              break;
            case 3:
              bvl_a = 8;
              snr_l_a = -1.75;
              snr_l_b = -0.0125;
              snr_s_a = -8.25;
              snr_s_b = -2.25;
              break;
          }
          gfc.ms_ener_ratio_old = 0.25;
          gfc.blocktype_old[0] = gfc.blocktype_old[1] = Encoder2.NORM_TYPE;
          for (i = 0; i < 4; ++i) {
            for (var j = 0; j < Encoder2.CBANDS; ++j) {
              gfc.nb_1[i][j] = 1e20;
              gfc.nb_2[i][j] = 1e20;
              gfc.nb_s1[i][j] = gfc.nb_s2[i][j] = 1;
            }
            for (var sb = 0; sb < Encoder2.SBMAX_l; sb++) {
              gfc.en[i].l[sb] = 1e20;
              gfc.thm[i].l[sb] = 1e20;
            }
            for (var j = 0; j < 3; ++j) {
              for (var sb = 0; sb < Encoder2.SBMAX_s; sb++) {
                gfc.en[i].s[sb][j] = 1e20;
                gfc.thm[i].s[sb][j] = 1e20;
              }
              gfc.nsPsy.lastAttacks[i] = 0;
            }
            for (var j = 0; j < 9; j++)
              gfc.nsPsy.last_en_subshort[i][j] = 10;
          }
          gfc.loudness_sq_save[0] = gfc.loudness_sq_save[1] = 0;
          gfc.npart_l = init_numline(
            gfc.numlines_l,
            gfc.bo_l,
            gfc.bm_l,
            bval,
            bval_width,
            gfc.mld_l,
            gfc.PSY.bo_l_weight,
            sfreq,
            Encoder2.BLKSIZE,
            gfc.scalefac_band.l,
            Encoder2.BLKSIZE / (2 * 576),
            Encoder2.SBMAX_l
          );
          for (i = 0; i < gfc.npart_l; i++) {
            var snr = snr_l_a;
            if (bval[i] >= bvl_a) {
              snr = snr_l_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_l_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
            }
            norm[i] = Math.pow(10, snr / 10);
            if (gfc.numlines_l[i] > 0) {
              gfc.rnumlines_l[i] = 1 / gfc.numlines_l[i];
            } else {
              gfc.rnumlines_l[i] = 0;
            }
          }
          gfc.s3_ll = init_s3_values(
            gfc.s3ind,
            gfc.npart_l,
            bval,
            bval_width,
            norm,
            useOldS3
          );
          var j = 0;
          for (i = 0; i < gfc.npart_l; i++) {
            var x;
            x = Float2.MAX_VALUE;
            for (var k2 = 0; k2 < gfc.numlines_l[i]; k2++, j++) {
              var freq = sfreq * j / (1e3 * Encoder2.BLKSIZE);
              var level;
              level = this.ATHformula(freq * 1e3, gfp) - 20;
              level = Math.pow(10, 0.1 * level);
              level *= gfc.numlines_l[i];
              if (x > level)
                x = level;
            }
            gfc.ATH.cb_l[i] = x;
            x = -20 + bval[i] * 20 / 10;
            if (x > 6) {
              x = 100;
            }
            if (x < -15) {
              x = -15;
            }
            x -= 8;
            gfc.minval_l[i] = Math.pow(10, x / 10) * gfc.numlines_l[i];
          }
          gfc.npart_s = init_numline(
            gfc.numlines_s,
            gfc.bo_s,
            gfc.bm_s,
            bval,
            bval_width,
            gfc.mld_s,
            gfc.PSY.bo_s_weight,
            sfreq,
            Encoder2.BLKSIZE_s,
            gfc.scalefac_band.s,
            Encoder2.BLKSIZE_s / (2 * 192),
            Encoder2.SBMAX_s
          );
          j = 0;
          for (i = 0; i < gfc.npart_s; i++) {
            var x;
            var snr = snr_s_a;
            if (bval[i] >= bvl_a) {
              snr = snr_s_b * (bval[i] - bvl_a) / (bvl_b - bvl_a) + snr_s_a * (bvl_b - bval[i]) / (bvl_b - bvl_a);
            }
            norm[i] = Math.pow(10, snr / 10);
            x = Float2.MAX_VALUE;
            for (var k2 = 0; k2 < gfc.numlines_s[i]; k2++, j++) {
              var freq = sfreq * j / (1e3 * Encoder2.BLKSIZE_s);
              var level;
              level = this.ATHformula(freq * 1e3, gfp) - 20;
              level = Math.pow(10, 0.1 * level);
              level *= gfc.numlines_s[i];
              if (x > level)
                x = level;
            }
            gfc.ATH.cb_s[i] = x;
            x = -7 + bval[i] * 7 / 12;
            if (bval[i] > 12) {
              x *= 1 + Math.log(1 + x) * 3.1;
            }
            if (bval[i] < 12) {
              x *= 1 + Math.log(1 - x) * 2.3;
            }
            if (x < -15) {
              x = -15;
            }
            x -= 8;
            gfc.minval_s[i] = Math.pow(10, x / 10) * gfc.numlines_s[i];
          }
          gfc.s3_ss = init_s3_values(
            gfc.s3ind_s,
            gfc.npart_s,
            bval,
            bval_width,
            norm,
            useOldS3
          );
          init_mask_add_max_values();
          fft.init_fft(gfc);
          gfc.decay = Math.exp(-1 * LOG10 / (temporalmask_sustain_sec * sfreq / 192));
          {
            var msfix;
            msfix = NS_MSFIX;
            if ((gfp.exp_nspsytune & 2) != 0)
              msfix = 1;
            if (Math.abs(gfp.msfix) > 0)
              msfix = gfp.msfix;
            gfp.msfix = msfix;
            for (var b = 0; b < gfc.npart_l; b++)
              if (gfc.s3ind[b][1] > gfc.npart_l - 1)
                gfc.s3ind[b][1] = gfc.npart_l - 1;
          }
          var frame_duration = 576 * gfc.mode_gr / sfreq;
          gfc.ATH.decay = Math.pow(10, -12 / 10 * frame_duration);
          gfc.ATH.adjust = 0.01;
          gfc.ATH.adjustLimit = 1;
          if (gfp.ATHtype != -1) {
            var freq;
            var freq_inc = gfp.out_samplerate / Encoder2.BLKSIZE;
            var eql_balance = 0;
            freq = 0;
            for (i = 0; i < Encoder2.BLKSIZE / 2; ++i) {
              freq += freq_inc;
              gfc.ATH.eql_w[i] = 1 / Math.pow(10, this.ATHformula(freq, gfp) / 10);
              eql_balance += gfc.ATH.eql_w[i];
            }
            eql_balance = 1 / eql_balance;
            for (i = Encoder2.BLKSIZE / 2; --i >= 0; ) {
              gfc.ATH.eql_w[i] *= eql_balance;
            }
          }
          {
            for (var b = j = 0; b < gfc.npart_s; ++b) {
              for (i = 0; i < gfc.numlines_s[b]; ++i) {
                ++j;
              }
            }
            for (var b = j = 0; b < gfc.npart_l; ++b) {
              for (i = 0; i < gfc.numlines_l[b]; ++i) {
                ++j;
              }
            }
          }
          j = 0;
          for (i = 0; i < gfc.npart_l; i++) {
            var freq = sfreq * (j + gfc.numlines_l[i] / 2) / (1 * Encoder2.BLKSIZE);
            gfc.mld_cb_l[i] = stereo_demask(freq);
            j += gfc.numlines_l[i];
          }
          for (; i < Encoder2.CBANDS; ++i) {
            gfc.mld_cb_l[i] = 1;
          }
          j = 0;
          for (i = 0; i < gfc.npart_s; i++) {
            var freq = sfreq * (j + gfc.numlines_s[i] / 2) / (1 * Encoder2.BLKSIZE_s);
            gfc.mld_cb_s[i] = stereo_demask(freq);
            j += gfc.numlines_s[i];
          }
          for (; i < Encoder2.CBANDS; ++i) {
            gfc.mld_cb_s[i] = 1;
          }
          return 0;
        };
        function ATHformula_GB(f2, value) {
          if (f2 < -0.3)
            f2 = 3410;
          f2 /= 1e3;
          f2 = Math.max(0.1, f2);
          var ath = 3.64 * Math.pow(f2, -0.8) - 6.8 * Math.exp(-0.6 * Math.pow(f2 - 3.4, 2)) + 6 * Math.exp(-0.15 * Math.pow(f2 - 8.7, 2)) + (0.6 + 0.04 * value) * 1e-3 * Math.pow(f2, 4);
          return ath;
        }
        this.ATHformula = function(f2, gfp) {
          var ath;
          switch (gfp.ATHtype) {
            case 0:
              ath = ATHformula_GB(f2, 9);
              break;
            case 1:
              ath = ATHformula_GB(f2, -1);
              break;
            case 2:
              ath = ATHformula_GB(f2, 0);
              break;
            case 3:
              ath = ATHformula_GB(f2, 1) + 6;
              break;
            case 4:
              ath = ATHformula_GB(f2, gfp.ATHcurve);
              break;
            default:
              ath = ATHformula_GB(f2, 0);
              break;
          }
          return ath;
        };
      }
      function Lame2() {
        var self2 = this;
        var LAME_MAXALBUMART = 128 * 1024;
        Lame2.V9 = 410;
        Lame2.V8 = 420;
        Lame2.V7 = 430;
        Lame2.V6 = 440;
        Lame2.V5 = 450;
        Lame2.V4 = 460;
        Lame2.V3 = 470;
        Lame2.V2 = 480;
        Lame2.V1 = 490;
        Lame2.V0 = 500;
        Lame2.R3MIX = 1e3;
        Lame2.STANDARD = 1001;
        Lame2.EXTREME = 1002;
        Lame2.INSANE = 1003;
        Lame2.STANDARD_FAST = 1004;
        Lame2.EXTREME_FAST = 1005;
        Lame2.MEDIUM = 1006;
        Lame2.MEDIUM_FAST = 1007;
        var LAME_MAXMP3BUFFER = 16384 + LAME_MAXALBUMART;
        Lame2.LAME_MAXMP3BUFFER = LAME_MAXMP3BUFFER;
        var ga;
        var bs;
        var p2;
        var qupvt;
        var qu;
        var psy = new PsyModel2();
        var vbr;
        var id3;
        this.enc = new Encoder2();
        this.setModules = function(_ga, _bs, _p, _qupvt, _qu, _vbr, _ver, _id3, _mpglib) {
          ga = _ga;
          bs = _bs;
          p2 = _p;
          qupvt = _qupvt;
          qu = _qu;
          vbr = _vbr;
          id3 = _id3;
          this.enc.setModules(bs, psy, qupvt, vbr);
        };
        function PSY() {
          this.mask_adjust = 0;
          this.mask_adjust_short = 0;
          this.bo_l_weight = new_float2(Encoder2.SBMAX_l);
          this.bo_s_weight = new_float2(Encoder2.SBMAX_s);
        }
        function LowPassHighPass() {
          this.lowerlimit = 0;
        }
        function BandPass(bitrate, lPass) {
          this.lowpass = lPass;
        }
        var LAME_ID = 4294479419;
        function lame_init_old(gfp) {
          var gfc;
          gfp.class_id = LAME_ID;
          gfc = gfp.internal_flags = new LameInternalFlags2();
          gfp.mode = MPEGMode2.NOT_SET;
          gfp.original = 1;
          gfp.in_samplerate = 44100;
          gfp.num_channels = 2;
          gfp.num_samples = -1;
          gfp.bWriteVbrTag = true;
          gfp.quality = -1;
          gfp.short_blocks = null;
          gfc.subblock_gain = -1;
          gfp.lowpassfreq = 0;
          gfp.highpassfreq = 0;
          gfp.lowpasswidth = -1;
          gfp.highpasswidth = -1;
          gfp.VBR = VbrMode2.vbr_off;
          gfp.VBR_q = 4;
          gfp.ATHcurve = -1;
          gfp.VBR_mean_bitrate_kbps = 128;
          gfp.VBR_min_bitrate_kbps = 0;
          gfp.VBR_max_bitrate_kbps = 0;
          gfp.VBR_hard_min = 0;
          gfc.VBR_min_bitrate = 1;
          gfc.VBR_max_bitrate = 13;
          gfp.quant_comp = -1;
          gfp.quant_comp_short = -1;
          gfp.msfix = -1;
          gfc.resample_ratio = 1;
          gfc.OldValue[0] = 180;
          gfc.OldValue[1] = 180;
          gfc.CurrentStep[0] = 4;
          gfc.CurrentStep[1] = 4;
          gfc.masking_lower = 1;
          gfc.nsPsy.attackthre = -1;
          gfc.nsPsy.attackthre_s = -1;
          gfp.scale = -1;
          gfp.athaa_type = -1;
          gfp.ATHtype = -1;
          gfp.athaa_loudapprox = -1;
          gfp.athaa_sensitivity = 0;
          gfp.useTemporal = null;
          gfp.interChRatio = -1;
          gfc.mf_samples_to_encode = Encoder2.ENCDELAY + Encoder2.POSTDELAY;
          gfp.encoder_padding = 0;
          gfc.mf_size = Encoder2.ENCDELAY - Encoder2.MDCTDELAY;
          gfp.findReplayGain = false;
          gfp.decode_on_the_fly = false;
          gfc.decode_on_the_fly = false;
          gfc.findReplayGain = false;
          gfc.findPeakSample = false;
          gfc.RadioGain = 0;
          gfc.AudiophileGain = 0;
          gfc.noclipGainChange = 0;
          gfc.noclipScale = -1;
          gfp.preset = 0;
          gfp.write_id3tag_automatic = true;
          return 0;
        }
        this.lame_init = function() {
          var gfp = new LameGlobalFlags2();
          lame_init_old(gfp);
          gfp.lame_allocated_gfp = 1;
          return gfp;
        };
        function filter_coef(x) {
          if (x > 1)
            return 0;
          if (x <= 0)
            return 1;
          return Math.cos(Math.PI / 2 * x);
        }
        this.nearestBitrateFullIndex = function(bitrate) {
          var full_bitrate_table = [
            8,
            16,
            24,
            32,
            40,
            48,
            56,
            64,
            80,
            96,
            112,
            128,
            160,
            192,
            224,
            256,
            320
          ];
          var lower_range = 0, lower_range_kbps = 0, upper_range = 0, upper_range_kbps = 0;
          upper_range_kbps = full_bitrate_table[16];
          upper_range = 16;
          lower_range_kbps = full_bitrate_table[16];
          lower_range = 16;
          for (var b = 0; b < 16; b++) {
            if (Math.max(bitrate, full_bitrate_table[b + 1]) != bitrate) {
              upper_range_kbps = full_bitrate_table[b + 1];
              upper_range = b + 1;
              lower_range_kbps = full_bitrate_table[b];
              lower_range = b;
              break;
            }
          }
          if (upper_range_kbps - bitrate > bitrate - lower_range_kbps) {
            return lower_range;
          }
          return upper_range;
        };
        function SmpFrqIndex(sample_freq, gpf) {
          switch (sample_freq) {
            case 44100:
              gpf.version = 1;
              return 0;
            case 48e3:
              gpf.version = 1;
              return 1;
            case 32e3:
              gpf.version = 1;
              return 2;
            case 22050:
              gpf.version = 0;
              return 0;
            case 24e3:
              gpf.version = 0;
              return 1;
            case 16e3:
              gpf.version = 0;
              return 2;
            case 11025:
              gpf.version = 0;
              return 0;
            case 12e3:
              gpf.version = 0;
              return 1;
            case 8e3:
              gpf.version = 0;
              return 2;
            default:
              gpf.version = 0;
              return -1;
          }
        }
        function FindNearestBitrate(bRate, version, samplerate) {
          if (samplerate < 16e3)
            version = 2;
          var bitrate = Tables2.bitrate_table[version][1];
          for (var i = 2; i <= 14; i++) {
            if (Tables2.bitrate_table[version][i] > 0) {
              if (Math.abs(Tables2.bitrate_table[version][i] - bRate) < Math.abs(bitrate - bRate))
                bitrate = Tables2.bitrate_table[version][i];
            }
          }
          return bitrate;
        }
        function BitrateIndex(bRate, version, samplerate) {
          if (samplerate < 16e3)
            version = 2;
          for (var i = 0; i <= 14; i++) {
            if (Tables2.bitrate_table[version][i] > 0) {
              if (Tables2.bitrate_table[version][i] == bRate) {
                return i;
              }
            }
          }
          return -1;
        }
        function optimum_bandwidth(lh, bitrate) {
          var freq_map = [
            new BandPass(8, 2e3),
            new BandPass(16, 3700),
            new BandPass(24, 3900),
            new BandPass(32, 5500),
            new BandPass(40, 7e3),
            new BandPass(48, 7500),
            new BandPass(56, 1e4),
            new BandPass(64, 11e3),
            new BandPass(80, 13500),
            new BandPass(96, 15100),
            new BandPass(112, 15600),
            new BandPass(128, 17e3),
            new BandPass(160, 17500),
            new BandPass(192, 18600),
            new BandPass(224, 19400),
            new BandPass(256, 19700),
            new BandPass(320, 20500)
          ];
          var table_index = self2.nearestBitrateFullIndex(bitrate);
          lh.lowerlimit = freq_map[table_index].lowpass;
        }
        function lame_init_params_ppflt(gfp) {
          var gfc = gfp.internal_flags;
          var lowpass_band = 32;
          if (gfc.lowpass1 > 0) {
            var minband = 999;
            for (var band = 0; band <= 31; band++) {
              var freq = band / 31;
              if (freq >= gfc.lowpass2) {
                lowpass_band = Math.min(lowpass_band, band);
              }
              if (gfc.lowpass1 < freq && freq < gfc.lowpass2) {
                minband = Math.min(minband, band);
              }
            }
            if (minband == 999) {
              gfc.lowpass1 = (lowpass_band - 0.75) / 31;
            } else {
              gfc.lowpass1 = (minband - 0.75) / 31;
            }
            gfc.lowpass2 = lowpass_band / 31;
          }
          if (gfc.highpass2 > 0) {
            abort();
          }
          if (gfc.highpass2 > 0) {
            abort();
          }
          for (var band = 0; band < 32; band++) {
            var fc1, fc2;
            var freq = band / 31;
            if (gfc.highpass2 > gfc.highpass1) {
              abort();
            } else {
              fc1 = 1;
            }
            if (gfc.lowpass2 > gfc.lowpass1) {
              fc2 = filter_coef((freq - gfc.lowpass1) / (gfc.lowpass2 - gfc.lowpass1 + 1e-20));
            } else {
              fc2 = 1;
            }
            gfc.amp_filter[band] = fc1 * fc2;
          }
        }
        function lame_init_qval(gfp) {
          var gfc = gfp.internal_flags;
          switch (gfp.quality) {
            default:
            case 9:
              gfc.psymodel = 0;
              gfc.noise_shaping = 0;
              gfc.noise_shaping_amp = 0;
              gfc.noise_shaping_stop = 0;
              gfc.use_best_huffman = 0;
              gfc.full_outer_loop = 0;
              break;
            case 8:
              gfp.quality = 7;
            case 7:
              gfc.psymodel = 1;
              gfc.noise_shaping = 0;
              gfc.noise_shaping_amp = 0;
              gfc.noise_shaping_stop = 0;
              gfc.use_best_huffman = 0;
              gfc.full_outer_loop = 0;
              break;
            case 6:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              gfc.noise_shaping_amp = 0;
              gfc.noise_shaping_stop = 0;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 0;
              gfc.full_outer_loop = 0;
              break;
            case 5:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              gfc.noise_shaping_amp = 0;
              gfc.noise_shaping_stop = 0;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 0;
              gfc.full_outer_loop = 0;
              break;
            case 4:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              gfc.noise_shaping_amp = 0;
              gfc.noise_shaping_stop = 0;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 1;
              gfc.full_outer_loop = 0;
              break;
            case 3:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              gfc.noise_shaping_amp = 1;
              gfc.noise_shaping_stop = 1;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 1;
              gfc.full_outer_loop = 0;
              break;
            case 2:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              if (gfc.substep_shaping == 0)
                gfc.substep_shaping = 2;
              gfc.noise_shaping_amp = 1;
              gfc.noise_shaping_stop = 1;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 1;
              gfc.full_outer_loop = 0;
              break;
            case 1:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              if (gfc.substep_shaping == 0)
                gfc.substep_shaping = 2;
              gfc.noise_shaping_amp = 2;
              gfc.noise_shaping_stop = 1;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 1;
              gfc.full_outer_loop = 0;
              break;
            case 0:
              gfc.psymodel = 1;
              if (gfc.noise_shaping == 0)
                gfc.noise_shaping = 1;
              if (gfc.substep_shaping == 0)
                gfc.substep_shaping = 2;
              gfc.noise_shaping_amp = 2;
              gfc.noise_shaping_stop = 1;
              if (gfc.subblock_gain == -1)
                gfc.subblock_gain = 1;
              gfc.use_best_huffman = 1;
              gfc.full_outer_loop = 0;
              break;
          }
        }
        function lame_init_bitstream(gfp) {
          var gfc = gfp.internal_flags;
          gfp.frameNum = 0;
          if (gfp.write_id3tag_automatic) {
            id3.id3tag_write_v2(gfp);
          }
          gfc.bitrate_stereoMode_Hist = new_int_n2([16, 4 + 1]);
          gfc.bitrate_blockType_Hist = new_int_n2([16, 4 + 1 + 1]);
          gfc.PeakSample = 0;
          if (gfp.bWriteVbrTag)
            vbr.InitVbrTag(gfp);
        }
        this.lame_init_params = function(gfp) {
          var gfc = gfp.internal_flags;
          gfc.Class_ID = 0;
          if (gfc.ATH == null)
            gfc.ATH = new ATH2();
          if (gfc.PSY == null)
            gfc.PSY = new PSY();
          if (gfc.rgdata == null)
            gfc.rgdata = new ReplayGain2();
          gfc.channels_in = gfp.num_channels;
          if (gfc.channels_in == 1)
            gfp.mode = MPEGMode2.MONO;
          gfc.channels_out = gfp.mode == MPEGMode2.MONO ? 1 : 2;
          gfc.mode_ext = Encoder2.MPG_MD_MS_LR;
          if (gfp.mode == MPEGMode2.MONO)
            gfp.force_ms = false;
          if (gfp.VBR == VbrMode2.vbr_off && gfp.VBR_mean_bitrate_kbps != 128 && gfp.brate == 0)
            gfp.brate = gfp.VBR_mean_bitrate_kbps;
          if (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_mtrh || gfp.VBR == VbrMode2.vbr_mt) ;
          else {
            gfp.free_format = false;
          }
          if (gfp.VBR == VbrMode2.vbr_off && gfp.brate == 0) {
            abort();
          }
          if (gfp.VBR == VbrMode2.vbr_off && gfp.compression_ratio > 0) {
            abort();
          }
          if (gfp.out_samplerate != 0) {
            if (gfp.out_samplerate < 16e3) {
              gfp.VBR_mean_bitrate_kbps = Math.max(
                gfp.VBR_mean_bitrate_kbps,
                8
              );
              gfp.VBR_mean_bitrate_kbps = Math.min(
                gfp.VBR_mean_bitrate_kbps,
                64
              );
            } else if (gfp.out_samplerate < 32e3) {
              gfp.VBR_mean_bitrate_kbps = Math.max(
                gfp.VBR_mean_bitrate_kbps,
                8
              );
              gfp.VBR_mean_bitrate_kbps = Math.min(
                gfp.VBR_mean_bitrate_kbps,
                160
              );
            } else {
              gfp.VBR_mean_bitrate_kbps = Math.max(
                gfp.VBR_mean_bitrate_kbps,
                32
              );
              gfp.VBR_mean_bitrate_kbps = Math.min(
                gfp.VBR_mean_bitrate_kbps,
                320
              );
            }
          }
          if (gfp.lowpassfreq == 0) {
            var lowpass = 16e3;
            switch (gfp.VBR) {
              case VbrMode2.vbr_off: {
                var lh = new LowPassHighPass();
                optimum_bandwidth(lh, gfp.brate);
                lowpass = lh.lowerlimit;
                break;
              }
              case VbrMode2.vbr_abr: {
                var lh = new LowPassHighPass();
                optimum_bandwidth(lh, gfp.VBR_mean_bitrate_kbps);
                lowpass = lh.lowerlimit;
                break;
              }
              case VbrMode2.vbr_rh: {
                abort();
              }
              default: {
                abort();
              }
            }
            if (gfp.mode == MPEGMode2.MONO && (gfp.VBR == VbrMode2.vbr_off || gfp.VBR == VbrMode2.vbr_abr))
              lowpass *= 1.5;
            gfp.lowpassfreq = lowpass | 0;
          }
          if (gfp.out_samplerate == 0) {
            abort();
          }
          gfp.lowpassfreq = Math.min(20500, gfp.lowpassfreq);
          gfp.lowpassfreq = Math.min(gfp.out_samplerate / 2, gfp.lowpassfreq);
          if (gfp.VBR == VbrMode2.vbr_off) {
            gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
          }
          if (gfp.VBR == VbrMode2.vbr_abr) {
            abort();
          }
          if (!gfp.bWriteVbrTag) {
            gfp.findReplayGain = false;
            gfp.decode_on_the_fly = false;
            gfc.findPeakSample = false;
          }
          gfc.findReplayGain = gfp.findReplayGain;
          gfc.decode_on_the_fly = gfp.decode_on_the_fly;
          if (gfc.decode_on_the_fly)
            gfc.findPeakSample = true;
          if (gfc.findReplayGain) {
            abort();
          }
          if (gfc.decode_on_the_fly && !gfp.decode_only) {
            abort();
          }
          gfc.mode_gr = gfp.out_samplerate <= 24e3 ? 1 : 2;
          gfp.framesize = 576 * gfc.mode_gr;
          gfp.encoder_delay = Encoder2.ENCDELAY;
          gfc.resample_ratio = gfp.in_samplerate / gfp.out_samplerate;
          switch (gfp.VBR) {
            case VbrMode2.vbr_mt:
            case VbrMode2.vbr_rh:
            case VbrMode2.vbr_mtrh:
              {
                var cmp = [
                  5.7,
                  6.5,
                  7.3,
                  8.2,
                  10,
                  11.9,
                  13,
                  14,
                  15,
                  16.5
                ];
                gfp.compression_ratio = cmp[gfp.VBR_q];
              }
              break;
            case VbrMode2.vbr_abr:
              gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.VBR_mean_bitrate_kbps);
              break;
            default:
              gfp.compression_ratio = gfp.out_samplerate * 16 * gfc.channels_out / (1e3 * gfp.brate);
              break;
          }
          if (gfp.mode == MPEGMode2.NOT_SET) {
            gfp.mode = MPEGMode2.JOINT_STEREO;
          }
          if (gfp.highpassfreq > 0) {
            abort();
          } else {
            gfc.highpass1 = 0;
            gfc.highpass2 = 0;
          }
          if (gfp.lowpassfreq > 0) {
            gfc.lowpass2 = 2 * gfp.lowpassfreq;
            if (gfp.lowpasswidth >= 0) {
              abort();
            } else {
              gfc.lowpass1 = (1 - 0) * 2 * gfp.lowpassfreq;
            }
            gfc.lowpass1 /= gfp.out_samplerate;
            gfc.lowpass2 /= gfp.out_samplerate;
          } else {
            abort();
          }
          lame_init_params_ppflt(gfp);
          gfc.samplerate_index = SmpFrqIndex(gfp.out_samplerate, gfp);
          if (gfc.samplerate_index < 0) {
            abort();
          }
          if (gfp.VBR == VbrMode2.vbr_off) {
            if (gfp.free_format) {
              gfc.bitrate_index = 0;
            } else {
              gfp.brate = FindNearestBitrate(
                gfp.brate,
                gfp.version,
                gfp.out_samplerate
              );
              gfc.bitrate_index = BitrateIndex(
                gfp.brate,
                gfp.version,
                gfp.out_samplerate
              );
              if (gfc.bitrate_index <= 0) {
                abort();
              }
            }
          } else {
            gfc.bitrate_index = 1;
          }
          if (gfp.analysis)
            gfp.bWriteVbrTag = false;
          if (gfc.pinfo != null)
            gfp.bWriteVbrTag = false;
          bs.init_bit_stream_w(gfc);
          var j = gfc.samplerate_index + 3 * gfp.version + 6 * (gfp.out_samplerate < 16e3 ? 1 : 0);
          for (var i = 0; i < Encoder2.SBMAX_l + 1; i++)
            gfc.scalefac_band.l[i] = qupvt.sfBandIndex[j].l[i];
          for (var i = 0; i < Encoder2.PSFB21 + 1; i++) {
            var size = (gfc.scalefac_band.l[22] - gfc.scalefac_band.l[21]) / Encoder2.PSFB21;
            var start = gfc.scalefac_band.l[21] + i * size;
            gfc.scalefac_band.psfb21[i] = start;
          }
          gfc.scalefac_band.psfb21[Encoder2.PSFB21] = 576;
          for (var i = 0; i < Encoder2.SBMAX_s + 1; i++)
            gfc.scalefac_band.s[i] = qupvt.sfBandIndex[j].s[i];
          for (var i = 0; i < Encoder2.PSFB12 + 1; i++) {
            var size = (gfc.scalefac_band.s[13] - gfc.scalefac_band.s[12]) / Encoder2.PSFB12;
            var start = gfc.scalefac_band.s[12] + i * size;
            gfc.scalefac_band.psfb12[i] = start;
          }
          gfc.scalefac_band.psfb12[Encoder2.PSFB12] = 192;
          if (gfp.version == 1)
            gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 17 : 4 + 32;
          else
            gfc.sideinfo_len = gfc.channels_out == 1 ? 4 + 9 : 4 + 17;
          if (gfp.error_protection)
            gfc.sideinfo_len += 2;
          lame_init_bitstream(gfp);
          gfc.Class_ID = LAME_ID;
          {
            var k2;
            for (k2 = 0; k2 < 19; k2++)
              gfc.nsPsy.pefirbuf[k2] = 700 * gfc.mode_gr * gfc.channels_out;
            if (gfp.ATHtype == -1)
              gfp.ATHtype = 4;
          }
          switch (gfp.VBR) {
            case VbrMode2.vbr_mt:
              gfp.VBR = VbrMode2.vbr_mtrh;
            case VbrMode2.vbr_mtrh: {
              if (gfp.useTemporal == null) {
                gfp.useTemporal = false;
              }
              p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
              if (gfp.quality < 0)
                gfp.quality = LAME_DEFAULT_QUALITY;
              if (gfp.quality < 5)
                gfp.quality = 0;
              if (gfp.quality > 5)
                gfp.quality = 5;
              gfc.PSY.mask_adjust = gfp.maskingadjust;
              gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
              if (gfp.experimentalY)
                gfc.sfb21_extra = false;
              else
                gfc.sfb21_extra = gfp.out_samplerate > 44e3;
              gfc.iteration_loop = new VBRNewIterationLoop(qu);
              break;
            }
            case VbrMode2.vbr_rh: {
              p2.apply_preset(gfp, 500 - gfp.VBR_q * 10, 0);
              gfc.PSY.mask_adjust = gfp.maskingadjust;
              gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
              if (gfp.experimentalY)
                gfc.sfb21_extra = false;
              else
                gfc.sfb21_extra = gfp.out_samplerate > 44e3;
              if (gfp.quality > 6)
                gfp.quality = 6;
              if (gfp.quality < 0)
                gfp.quality = LAME_DEFAULT_QUALITY;
              gfc.iteration_loop = new VBROldIterationLoop(qu);
              break;
            }
            default: {
              var vbrmode;
              gfc.sfb21_extra = false;
              if (gfp.quality < 0)
                gfp.quality = LAME_DEFAULT_QUALITY;
              vbrmode = gfp.VBR;
              if (vbrmode == VbrMode2.vbr_off)
                gfp.VBR_mean_bitrate_kbps = gfp.brate;
              p2.apply_preset(gfp, gfp.VBR_mean_bitrate_kbps, 0);
              gfp.VBR = vbrmode;
              gfc.PSY.mask_adjust = gfp.maskingadjust;
              gfc.PSY.mask_adjust_short = gfp.maskingadjust_short;
              if (vbrmode == VbrMode2.vbr_off) {
                gfc.iteration_loop = new CBRNewIterationLoop2(qu);
              } else {
                abort();
              }
              break;
            }
          }
          if (gfp.VBR != VbrMode2.vbr_off) {
            abort();
          }
          if (gfp.tune) {
            abort();
          }
          lame_init_qval(gfp);
          if (gfp.athaa_type < 0)
            gfc.ATH.useAdjust = 3;
          else
            gfc.ATH.useAdjust = gfp.athaa_type;
          gfc.ATH.aaSensitivityP = Math.pow(10, gfp.athaa_sensitivity / -10);
          if (gfp.short_blocks == null) {
            gfp.short_blocks = ShortBlock2.short_block_allowed;
          }
          if (gfp.short_blocks == ShortBlock2.short_block_allowed && (gfp.mode == MPEGMode2.JOINT_STEREO || gfp.mode == MPEGMode2.STEREO)) {
            gfp.short_blocks = ShortBlock2.short_block_coupled;
          }
          if (gfp.quant_comp < 0)
            gfp.quant_comp = 1;
          if (gfp.quant_comp_short < 0)
            gfp.quant_comp_short = 0;
          if (gfp.msfix < 0)
            gfp.msfix = 0;
          gfp.exp_nspsytune = gfp.exp_nspsytune | 1;
          if (gfp.internal_flags.nsPsy.attackthre < 0)
            gfp.internal_flags.nsPsy.attackthre = PsyModel2.NSATTACKTHRE;
          if (gfp.internal_flags.nsPsy.attackthre_s < 0)
            gfp.internal_flags.nsPsy.attackthre_s = PsyModel2.NSATTACKTHRE_S;
          if (gfp.scale < 0)
            gfp.scale = 1;
          if (gfp.ATHtype < 0)
            gfp.ATHtype = 4;
          if (gfp.ATHcurve < 0)
            gfp.ATHcurve = 4;
          if (gfp.athaa_loudapprox < 0)
            gfp.athaa_loudapprox = 2;
          if (gfp.interChRatio < 0)
            gfp.interChRatio = 0;
          if (gfp.useTemporal == null)
            gfp.useTemporal = true;
          gfc.slot_lag = gfc.frac_SpF = 0;
          if (gfp.VBR == VbrMode2.vbr_off)
            gfc.slot_lag = gfc.frac_SpF = (gfp.version + 1) * 72e3 * gfp.brate % gfp.out_samplerate | 0;
          qupvt.iteration_init(gfp);
          psy.psymodel_init(gfp);
          return 0;
        };
        function update_inbuffer_size(gfc, nsamples) {
          if (gfc.in_buffer_0 == null || gfc.in_buffer_nsamples < nsamples) {
            gfc.in_buffer_0 = new_float2(nsamples);
            gfc.in_buffer_1 = new_float2(nsamples);
            gfc.in_buffer_nsamples = nsamples;
          }
        }
        this.lame_encode_flush = function(gfp, mp3buffer, mp3bufferPos, mp3buffer_size) {
          var gfc = gfp.internal_flags;
          var buffer = new_short_n2([2, 1152]);
          var imp3 = 0, mp3count, mp3buffer_size_remaining;
          var end_padding;
          var frames_left;
          var samples_to_encode = gfc.mf_samples_to_encode - Encoder2.POSTDELAY;
          var mf_needed = calcNeeded(gfp);
          if (gfc.mf_samples_to_encode < 1) {
            return 0;
          }
          mp3count = 0;
          if (gfp.in_samplerate != gfp.out_samplerate) {
            abort();
          }
          end_padding = gfp.framesize - samples_to_encode % gfp.framesize;
          if (end_padding < 576)
            end_padding += gfp.framesize;
          gfp.encoder_padding = end_padding;
          frames_left = (samples_to_encode + end_padding) / gfp.framesize;
          while (frames_left > 0 && imp3 >= 0) {
            var bunch = mf_needed - gfc.mf_size;
            var frame_num = gfp.frameNum;
            bunch *= gfp.in_samplerate;
            bunch /= gfp.out_samplerate;
            if (bunch > 1152)
              bunch = 1152;
            if (bunch < 1)
              bunch = 1;
            mp3buffer_size_remaining = mp3buffer_size - mp3count;
            if (mp3buffer_size == 0)
              mp3buffer_size_remaining = 0;
            imp3 = this.lame_encode_buffer(
              gfp,
              buffer[0],
              buffer[1],
              bunch,
              mp3buffer,
              mp3bufferPos,
              mp3buffer_size_remaining
            );
            mp3bufferPos += imp3;
            mp3count += imp3;
            frames_left -= frame_num != gfp.frameNum ? 1 : 0;
          }
          gfc.mf_samples_to_encode = 0;
          if (imp3 < 0) {
            return imp3;
          }
          mp3buffer_size_remaining = mp3buffer_size - mp3count;
          if (mp3buffer_size == 0)
            mp3buffer_size_remaining = 0;
          bs.flush_bitstream(gfp);
          imp3 = bs.copy_buffer(
            gfc,
            mp3buffer,
            mp3bufferPos,
            mp3buffer_size_remaining,
            1
          );
          if (imp3 < 0) {
            return imp3;
          }
          mp3bufferPos += imp3;
          mp3count += imp3;
          mp3buffer_size_remaining = mp3buffer_size - mp3count;
          if (mp3buffer_size == 0)
            mp3buffer_size_remaining = 0;
          if (gfp.write_id3tag_automatic) {
            abort();
          }
          return mp3count;
        };
        this.lame_encode_buffer = function(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
          var gfc = gfp.internal_flags;
          var in_buffer = [null, null];
          if (gfc.Class_ID != LAME_ID)
            return -3;
          if (nsamples == 0)
            return 0;
          update_inbuffer_size(gfc, nsamples);
          in_buffer[0] = gfc.in_buffer_0;
          in_buffer[1] = gfc.in_buffer_1;
          for (var i = 0; i < nsamples; i++) {
            in_buffer[0][i] = buffer_l[i];
            if (gfc.channels_in > 1)
              in_buffer[1][i] = buffer_r[i];
          }
          return lame_encode_buffer_sample(
            gfp,
            in_buffer[0],
            in_buffer[1],
            nsamples,
            mp3buf,
            mp3bufPos,
            mp3buf_size
          );
        };
        function calcNeeded(gfp) {
          var mf_needed = Encoder2.BLKSIZE + gfp.framesize - Encoder2.FFTOFFSET;
          mf_needed = Math.max(mf_needed, 512 + gfp.framesize - 32);
          return mf_needed;
        }
        function lame_encode_buffer_sample(gfp, buffer_l, buffer_r, nsamples, mp3buf, mp3bufPos, mp3buf_size) {
          var gfc = gfp.internal_flags;
          var mp3size = 0, ret, i, ch, mf_needed;
          var mp3out;
          var mfbuf = [null, null];
          var in_buffer = [null, null];
          if (gfc.Class_ID != LAME_ID)
            return -3;
          if (nsamples == 0)
            return 0;
          mp3out = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 0);
          if (mp3out < 0)
            return mp3out;
          mp3bufPos += mp3out;
          mp3size += mp3out;
          in_buffer[0] = buffer_l;
          in_buffer[1] = buffer_r;
          if (BitStream.NEQ(gfp.scale, 0) && BitStream.NEQ(gfp.scale, 1)) {
            for (i = 0; i < nsamples; ++i) {
              in_buffer[0][i] *= gfp.scale;
              if (gfc.channels_out == 2)
                in_buffer[1][i] *= gfp.scale;
            }
          }
          if (BitStream.NEQ(gfp.scale_left, 0) && BitStream.NEQ(gfp.scale_left, 1)) {
            for (i = 0; i < nsamples; ++i) {
              in_buffer[0][i] *= gfp.scale_left;
            }
          }
          if (BitStream.NEQ(gfp.scale_right, 0) && BitStream.NEQ(gfp.scale_right, 1)) {
            for (i = 0; i < nsamples; ++i) {
              in_buffer[1][i] *= gfp.scale_right;
            }
          }
          if (gfp.num_channels == 2 && gfc.channels_out == 1) {
            abort();
          }
          mf_needed = calcNeeded(gfp);
          mfbuf[0] = gfc.mfbuf[0];
          mfbuf[1] = gfc.mfbuf[1];
          var in_bufferPos = 0;
          while (nsamples > 0) {
            var in_buffer_ptr = [null, null];
            var n_in = 0;
            var n_out = 0;
            in_buffer_ptr[0] = in_buffer[0];
            in_buffer_ptr[1] = in_buffer[1];
            var inOut = new InOut();
            fill_buffer(
              gfp,
              mfbuf,
              in_buffer_ptr,
              in_bufferPos,
              nsamples,
              inOut
            );
            n_in = inOut.n_in;
            n_out = inOut.n_out;
            if (gfc.findReplayGain && !gfc.decode_on_the_fly) {
              if (ga.AnalyzeSamples(
                gfc.rgdata,
                mfbuf[0],
                gfc.mf_size,
                mfbuf[1],
                gfc.mf_size,
                n_out,
                gfc.channels_out
              ) == GainAnalysis2.GAIN_ANALYSIS_ERROR)
                return -6;
            }
            nsamples -= n_in;
            in_bufferPos += n_in;
            if (gfc.channels_out == 2)
              ;
            gfc.mf_size += n_out;
            if (gfc.mf_samples_to_encode < 1) {
              abort();
            }
            gfc.mf_samples_to_encode += n_out;
            if (gfc.mf_size >= mf_needed) {
              var buf_size = mp3buf_size - mp3size;
              if (mp3buf_size == 0)
                buf_size = 0;
              ret = lame_encode_frame(
                gfp,
                mfbuf[0],
                mfbuf[1],
                mp3buf,
                mp3bufPos,
                buf_size
              );
              if (ret < 0)
                return ret;
              mp3bufPos += ret;
              mp3size += ret;
              gfc.mf_size -= gfp.framesize;
              gfc.mf_samples_to_encode -= gfp.framesize;
              for (ch = 0; ch < gfc.channels_out; ch++)
                for (i = 0; i < gfc.mf_size; i++)
                  mfbuf[ch][i] = mfbuf[ch][i + gfp.framesize];
            }
          }
          return mp3size;
        }
        function lame_encode_frame(gfp, inbuf_l, inbuf_r, mp3buf, mp3bufPos, mp3buf_size) {
          var ret = self2.enc.lame_encode_mp3_frame(
            gfp,
            inbuf_l,
            inbuf_r,
            mp3buf,
            mp3bufPos,
            mp3buf_size
          );
          gfp.frameNum++;
          return ret;
        }
        function InOut() {
          this.n_in = 0;
          this.n_out = 0;
        }
        function fill_buffer(gfp, mfbuf, in_buffer, in_bufferPos, nsamples, io) {
          var gfc = gfp.internal_flags;
          if (gfc.resample_ratio < 0.9999 || gfc.resample_ratio > 1.0001) {
            abort();
          } else {
            io.n_out = Math.min(gfp.framesize, nsamples);
            io.n_in = io.n_out;
            for (var i = 0; i < io.n_out; ++i) {
              mfbuf[0][gfc.mf_size + i] = in_buffer[0][in_bufferPos + i];
              if (gfc.channels_out == 2)
                mfbuf[1][gfc.mf_size + i] = in_buffer[1][in_bufferPos + i];
            }
          }
        }
      }
      function GetAudio() {
        this.setModules = function(parse2, mpg2) {
        };
      }
      function Parse() {
        this.setModules = function(ver2, id32, pre2) {
        };
      }
      function MPGLib() {
      }
      function ID3Tag() {
        this.setModules = function(_bits, _ver) {
        };
      }
      function Mp3Encoder(channels, samplerate, kbps) {
        if (channels != 1) {
          abort("fix cc: only supports mono");
        }
        var lame = new Lame2();
        var gaud = new GetAudio();
        var ga = new GainAnalysis2();
        var bs = new BitStream();
        var p2 = new Presets();
        var qupvt = new QuantizePVT();
        var qu = new Quantize();
        var vbr = new VBRTag2();
        var ver = new Version();
        var id3 = new ID3Tag();
        var rv = new Reservoir();
        var tak = new Takehiro();
        var parse = new Parse();
        var mpg = new MPGLib();
        lame.setModules(ga, bs, p2, qupvt, qu, vbr, ver, id3, mpg);
        bs.setModules(ga, mpg, ver, vbr);
        id3.setModules(bs, ver);
        p2.setModules(lame);
        qu.setModules(bs, rv, qupvt, tak);
        qupvt.setModules(tak, rv, lame.enc.psy);
        rv.setModules(bs);
        tak.setModules(qupvt);
        vbr.setModules(lame, bs, ver);
        gaud.setModules(parse, mpg);
        parse.setModules(ver, id3, p2);
        var gfp = lame.lame_init();
        gfp.num_channels = channels;
        gfp.in_samplerate = samplerate;
        gfp.out_samplerate = samplerate;
        gfp.brate = kbps;
        gfp.mode = MPEGMode2.STEREO;
        gfp.quality = 3;
        gfp.bWriteVbrTag = false;
        gfp.disable_reservoir = true;
        gfp.write_id3tag_automatic = false;
        lame.lame_init_params(gfp);
        var maxSamples = 1152;
        var mp3buf_size = 0 | 1.25 * maxSamples + 7200;
        var mp3buf = new_byte2(mp3buf_size);
        this.encodeBuffer = function(left, right) {
          if (channels == 1) {
            right = left;
          }
          if (left.length > maxSamples) {
            maxSamples = left.length;
            mp3buf_size = 0 | 1.25 * maxSamples + 7200;
            mp3buf = new_byte2(mp3buf_size);
          }
          var _sz = lame.lame_encode_buffer(gfp, left, right, left.length, mp3buf, 0, mp3buf_size);
          return new Int8Array(mp3buf.subarray(0, _sz));
        };
        this.flush = function() {
          var _sz = lame.lame_encode_flush(gfp, mp3buf, 0, mp3buf_size);
          return new Int8Array(mp3buf.subarray(0, _sz));
        };
      }
      L3Side2.SFBMAX = Encoder2.SBMAX_s * 3;
      lamejs.Mp3Encoder = Mp3Encoder;
    }
    lamejs();
    Recorder2.lamejs = lamejs;
  });
  (function(factory) {
    var browser = typeof window == "object" && !!window.document;
    var win = browser ? window : Object;
    var rec = win.Recorder, ni = rec.i18n;
    factory(rec, ni, ni.$T, browser);
  })(function(Recorder2, i18n, $T, isBrowser) {
    Recorder2.prototype.enc_wav = {
      stable: true,
      fast: true,
      getTestMsg: function() {
        return $T("gPSE::支持位数8位、16位（填在比特率里面），采样率取值无限制；此编码器仅在pcm数据前加了一个44字节的wav头，编码出来的16位wav文件去掉开头的44字节即可得到pcm（注：其他wav编码器可能不是44字节）");
      }
    };
    var NormalizeSet = function(set) {
      var bS = set.bitRate, b = bS == 8 ? 8 : 16;
      if (bS != b) Recorder2.CLog($T("wyw9::WAV Info: 不支持{1}位，已更新成{2}位", 0, bS, b), 3);
      set.bitRate = b;
    };
    Recorder2.prototype.wav = function(res, True, False) {
      var This = this, set = This.set;
      NormalizeSet(set);
      var size = res.length, sampleRate = set.sampleRate, bitRate = set.bitRate;
      var dataLength = size * (bitRate / 8);
      var header = Recorder2.wav_header(1, 1, sampleRate, bitRate, dataLength);
      var offset = header.length;
      var bytes = new Uint8Array(offset + dataLength);
      bytes.set(header);
      if (bitRate == 8) {
        for (var i = 0; i < size; i++) {
          var val = (res[i] >> 8) + 128;
          bytes[offset++] = val;
        }
      } else {
        bytes = new Int16Array(bytes.buffer);
        bytes.set(res, offset / 2);
      }
      True(bytes.buffer, "audio/wav");
    };
    Recorder2.wav_header = function(format, numCh, sampleRate, bitRate, dataLength) {
      var extSize = format == 1 ? 0 : 2;
      var buffer = new ArrayBuffer(44 + extSize);
      var data = new DataView(buffer);
      var offset = 0;
      var writeString = function(str) {
        for (var i = 0; i < str.length; i++, offset++) {
          data.setUint8(offset, str.charCodeAt(i));
        }
      };
      var write16 = function(v) {
        data.setUint16(offset, v, true);
        offset += 2;
      };
      var write32 = function(v) {
        data.setUint32(offset, v, true);
        offset += 4;
      };
      writeString("RIFF");
      write32(36 + extSize + dataLength);
      writeString("WAVE");
      writeString("fmt ");
      write32(16 + extSize);
      write16(format);
      write16(numCh);
      write32(sampleRate);
      write32(sampleRate * (numCh * bitRate / 8));
      write16(numCh * bitRate / 8);
      write16(bitRate);
      if (format != 1) {
        write16(0);
      }
      writeString("data");
      write32(dataLength);
      return new Uint8Array(buffer);
    };
  });
  Recorder.Wav2Other = function(newSet, wavBlob, True, False) {
    const reader = new FileReader();
    reader.onloadend = function() {
      const wavView = new Uint8Array(reader.result);
      const eq = function(p2, s) {
        for (var i2 = 0; i2 < s.length; i2++) {
          if (wavView[p2 + i2] != s.charCodeAt(i2)) {
            return false;
          }
        }
        return true;
      };
      let pcm;
      if (eq(0, "RIFF") && eq(8, "WAVEfmt ")) {
        var numCh = wavView[22];
        if (wavView[20] == 1 && (numCh == 1 || numCh == 2)) {
          var sampleRate = wavView[24] + (wavView[25] << 8) + (wavView[26] << 16) + (wavView[27] << 24);
          var bitRate = wavView[34] + (wavView[35] << 8);
          var dataPos = 0;
          for (var i = 12, iL = wavView.length - 8; i < iL; ) {
            if (wavView[i] == 100 && wavView[i + 1] == 97 && wavView[i + 2] == 116 && wavView[i + 3] == 97) {
              dataPos = i + 8;
              break;
            }
            i += 4;
            i += 4 + wavView[i] + (wavView[i + 1] << 8) + (wavView[i + 2] << 16) + (wavView[i + 3] << 24);
          }
          if (dataPos) {
            if (bitRate == 16) {
              pcm = new Int16Array(wavView.buffer.slice(dataPos));
            } else if (bitRate == 8) {
              pcm = new Int16Array(wavView.length - dataPos);
              for (var j = dataPos, d = 0; j < wavView.length; j++, d++) {
                var b = wavView[j];
                pcm[d] = b - 128 << 8;
              }
            }
          }
          if (pcm && numCh == 2) {
            var pcm1 = new Int16Array(pcm.length / 2);
            for (var i = 0; i < pcm1.length; i++) {
              pcm1[i] = (pcm[i * 2] + pcm[i * 2 + 1]) / 2;
            }
            pcm = pcm1;
          }
        }
      }
      if (!pcm) {
        False && False("非单或双声道wav raw pcm格式音频，无法转码");
        return;
      }
      var rec = Recorder(newSet).mock(pcm, sampleRate);
      rec.stop(function(blob, duration) {
        True(blob, duration, rec);
      }, False);
    };
    reader.readAsArrayBuffer(wavBlob);
  };
  const transWavBlob = (wavBlob, fileName, total, cd, node) => {
    if (!wavBlob) {
      return;
    }
    var set = {
      type: "mp3",
      sampleRate: 48e3,
      bitRate: 96
    };
    Recorder.Wav2Other(
      set,
      wavBlob,
      function(blob, duration, rec) {
        window.toAudioCount++;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName + ".mp3");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        cd(node);
      },
      function(msg) {
      }
    );
  };
  class ListNode {
    constructor(value) {
      __publicField(this, "value");
      __publicField(this, "next");
      this.value = value;
      this.next = null;
    }
  }
  class LinkedList {
    constructor() {
      __publicField(this, "head");
      __publicField(this, "tail");
      this.head = null;
      this.tail = null;
    }
    // 添加节点到链表末尾
    add(value) {
      const newNode = new ListNode(value);
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
    // 打印链表
    print() {
      let current = this.head;
      const values = [];
      while (current) {
        values.push(current.value);
        current = current.next;
      }
    }
  }
  function arrayToLinkedList(arr) {
    const linkedList = new LinkedList();
    for (const value of arr) {
      linkedList.add({ ...value, length: arr == null ? void 0 : arr.length });
    }
    return linkedList;
  }
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const blobToAwv = (buffer, fileName, total, cd, node, func) => {
    const bufferToWave = new Function(
      func == null ? void 0 : func.arg1,
      func == null ? void 0 : func.arg2,
      base64ToJson(func == null ? void 0 : func.function)
    );
    const audioCtx = new AudioContext();
    audioCtx.decodeAudioData(buffer, function(audioBuffer) {
      const blob = bufferToWave(
        audioBuffer,
        audioBuffer.sampleRate * audioBuffer.duration
      );
      transWavBlob(blob, fileName, total, cd, node);
    });
  };
  function base64ToJson(base64String) {
    const jsonString = atob(base64String);
    return jsonString;
  }
  const getUrlAndWavToMp3Download = (data, recall, func, processFunc) => {
    var _a, _b, _c, _d;
    const linkedList = arrayToLinkedList(data);
    let processCount = 0;
    const cd = (node) => {
      var _a2, _b2;
      if (node == null ? void 0 : node.next) {
        _GM_xmlhttpRequest({
          method: "GET",
          url: (_b2 = (_a2 = node == null ? void 0 : node.next) == null ? void 0 : _a2.value) == null ? void 0 : _b2.downUrl,
          responseType: "arraybuffer",
          onload: function(res) {
            var _a3, _b3;
            const blob = res.response;
            let buffer = blob;
            processFunc(++processCount);
            blobToAwv(
              buffer,
              (_b3 = (_a3 = node == null ? void 0 : node.next) == null ? void 0 : _a3.value) == null ? void 0 : _b3.title,
              data == null ? void 0 : data.length,
              cd,
              node == null ? void 0 : node.next,
              func
            );
          },
          onerror: function(response) {
            console.log("请求失败");
          }
        });
      } else {
        recall();
      }
    };
    if ((_b = (_a = linkedList == null ? void 0 : linkedList.head) == null ? void 0 : _a.value) == null ? void 0 : _b.downUrl) {
      fetch((_d = (_c = linkedList == null ? void 0 : linkedList.head) == null ? void 0 : _c.value) == null ? void 0 : _d.downUrl).then((response) => {
        return response.arrayBuffer();
      }).then((blob) => {
        var _a2, _b2;
        let buffer = blob;
        blobToAwv(
          buffer,
          (_b2 = (_a2 = linkedList == null ? void 0 : linkedList.head) == null ? void 0 : _a2.value) == null ? void 0 : _b2.title,
          data == null ? void 0 : data.length,
          cd,
          linkedList == null ? void 0 : linkedList.head,
          func
        );
      }).catch((error) => {
        console.error("Error downloading file:", error);
      });
    } else {
      recall();
    }
  };
  const Modal = ({ isOpen, onClose, onConfirm, onCloseModal, imgUrl, getQQMusicUrl }) => {
    const [inputValue, setInputValue] = require$$0$1.useState("");
    if (!isOpen) return null;
    const handleConfirm = () => {
      onConfirm(inputValue).then((res) => {
        if (res) {
          onClose();
        } else {
          alert("验证码错误");
        }
      });
      setInputValue("");
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imgUrl ? imgUrl : "https://files.ybshome.com/files/20240927/172742491202459681.jpg",
          alt: "Placeholder"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "red", fontSize: "0.75rem", position: "relative", top: "-10px" }, children: [
        "微信扫描二维码，动动手指帮下作者进京东快递福利群，谢谢啦！！！验证码为51949输入即可开始下载。也可联系修改脚本。tip: 确认后会下载网页播放器内全部音乐，若需要挑选请点击取消，修改播放器内音乐。刷新页面点击确认等待全部下载！！！且登录账号后方可使用！！！。若无会员，可进入此网站获取。",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: getQQMusicUrl, target: "_blank", children: getQQMusicUrl })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          placeholder: "输入验证码"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-buttons", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCloseModal, children: "取消" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleConfirm, children: "确认" })
      ] })
    ] }) });
  };
  var cryptoJs = { exports: {} };
  function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var core = { exports: {} };
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var hasRequiredCore;
  function requireCore() {
    if (hasRequiredCore) return core.exports;
    hasRequiredCore = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory();
        }
      })(commonjsGlobal, function() {
        var CryptoJS2 = CryptoJS2 || function(Math2, undefined$1) {
          var crypto;
          if (typeof window !== "undefined" && window.crypto) {
            crypto = window.crypto;
          }
          if (typeof self !== "undefined" && self.crypto) {
            crypto = self.crypto;
          }
          if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto = globalThis.crypto;
          }
          if (!crypto && typeof window !== "undefined" && window.msCrypto) {
            crypto = window.msCrypto;
          }
          if (!crypto && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
            crypto = commonjsGlobal.crypto;
          }
          if (!crypto && typeof commonjsRequire === "function") {
            try {
              crypto = require$$0;
            } catch (err) {
            }
          }
          var cryptoSecureRandomInt = function() {
            if (crypto) {
              if (typeof crypto.getRandomValues === "function") {
                try {
                  return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {
                }
              }
              if (typeof crypto.randomBytes === "function") {
                try {
                  return crypto.randomBytes(4).readInt32LE();
                } catch (err) {
                }
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
          };
          var create = Object.create || /* @__PURE__ */ function() {
            function F() {
            }
            return function(obj) {
              var subtype;
              F.prototype = obj;
              subtype = new F();
              F.prototype = null;
              return subtype;
            };
          }();
          var C = {};
          var C_lib = C.lib = {};
          var Base = C_lib.Base = /* @__PURE__ */ function() {
            return {
              /**
               * Creates a new object that inherits from this object.
               *
               * @param {Object} overrides Properties to copy into the new object.
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         field: 'value',
               *
               *         method: function () {
               *         }
               *     });
               */
              extend: function(overrides) {
                var subtype = create(this);
                if (overrides) {
                  subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                  subtype.init = function() {
                    subtype.$super.init.apply(this, arguments);
                  };
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
              },
              /**
               * Extends this object and runs the init method.
               * Arguments to create() will be passed to init().
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var instance = MyType.create();
               */
              create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },
              /**
               * Initializes a newly created object.
               * Override this method to add some logic when your objects are created.
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         init: function () {
               *             // ...
               *         }
               *     });
               */
              init: function() {
              },
              /**
               * Copies properties into this object.
               *
               * @param {Object} properties The properties to mix in.
               *
               * @example
               *
               *     MyType.mixIn({
               *         field: 'value'
               *     });
               */
              mixIn: function(properties) {
                for (var propertyName in properties) {
                  if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                  }
                }
                if (properties.hasOwnProperty("toString")) {
                  this.toString = properties.toString;
                }
              },
              /**
               * Creates a copy of this object.
               *
               * @return {Object} The clone.
               *
               * @example
               *
               *     var clone = instance.clone();
               */
              clone: function() {
                return this.init.prototype.extend(this);
              }
            };
          }();
          var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },
            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function(encoder) {
              return (encoder || Hex).stringify(this);
            },
            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function(wordArray) {
              var thisWords = this.words;
              var thatWords = wordArray.words;
              var thisSigBytes = this.sigBytes;
              var thatSigBytes = wordArray.sigBytes;
              this.clamp();
              if (thisSigBytes % 4) {
                for (var i = 0; i < thatSigBytes; i++) {
                  var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                  thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                }
              } else {
                for (var j = 0; j < thatSigBytes; j += 4) {
                  thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
                }
              }
              this.sigBytes += thatSigBytes;
              return this;
            },
            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function() {
              var words = this.words;
              var sigBytes = this.sigBytes;
              words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
              words.length = Math2.ceil(sigBytes / 4);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },
            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function(nBytes) {
              var words = [];
              for (var i = 0; i < nBytes; i += 4) {
                words.push(cryptoSecureRandomInt());
              }
              return new WordArray.init(words, nBytes);
            }
          });
          var C_enc = C.enc = {};
          var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var hexChars = [];
              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 15).toString(16));
              }
              return hexChars.join("");
            },
            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function(hexStr) {
              var hexStrLength = hexStr.length;
              var words = [];
              for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
              }
              return new WordArray.init(words, hexStrLength / 2);
            }
          };
          var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var latin1Chars = [];
              for (var i = 0; i < sigBytes; i++) {
                var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                latin1Chars.push(String.fromCharCode(bite));
              }
              return latin1Chars.join("");
            },
            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function(latin1Str) {
              var latin1StrLength = latin1Str.length;
              var words = [];
              for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
              }
              return new WordArray.init(words, latin1StrLength);
            }
          };
          var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function(wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function(utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function() {
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },
            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function(data) {
              if (typeof data == "string") {
                data = Utf8.parse(data);
              }
              this._data.concat(data);
              this._nDataBytes += data.sigBytes;
            },
            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function(doFlush) {
              var processedWords;
              var data = this._data;
              var dataWords = data.words;
              var dataSigBytes = data.sigBytes;
              var blockSize = this.blockSize;
              var blockSizeBytes = blockSize * 4;
              var nBlocksReady = dataSigBytes / blockSizeBytes;
              if (doFlush) {
                nBlocksReady = Math2.ceil(nBlocksReady);
              } else {
                nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
              }
              var nWordsReady = nBlocksReady * blockSize;
              var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
              if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                  this._doProcessBlock(dataWords, offset);
                }
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
              }
              return new WordArray.init(processedWords, nBytesReady);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),
            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
              this.reset();
            },
            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._append(messageUpdate);
              this._process();
              return this;
            },
            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              if (messageUpdate) {
                this._append(messageUpdate);
              }
              var hash = this._doFinalize();
              return hash;
            },
            blockSize: 512 / 32,
            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function(hasher) {
              return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },
            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function(hasher) {
              return function(message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          var C_algo = C.algo = {};
          return C;
        }(Math);
        return CryptoJS2;
      });
    })(core);
    return core.exports;
  }
  var x64Core = { exports: {} };
  var hasRequiredX64Core;
  function requireX64Core() {
    if (hasRequiredX64Core) return x64Core.exports;
    hasRequiredX64Core = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(undefined$1) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          var C_x64 = C.x64 = {};
          C_x64.Word = Base.extend({
            /**
             * Initializes a newly created 64-bit word.
             *
             * @param {number} high The high 32 bits.
             * @param {number} low The low 32 bits.
             *
             * @example
             *
             *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
             */
            init: function(high, low) {
              this.high = high;
              this.low = low;
            }
            /**
             * Bitwise NOTs this word.
             *
             * @return {X64Word} A new x64-Word object after negating.
             *
             * @example
             *
             *     var negated = x64Word.not();
             */
            // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ANDs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to AND with this word.
             *
             * @return {X64Word} A new x64-Word object after ANDing.
             *
             * @example
             *
             *     var anded = x64Word.and(anotherX64Word);
             */
            // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to OR with this word.
             *
             * @return {X64Word} A new x64-Word object after ORing.
             *
             * @example
             *
             *     var ored = x64Word.or(anotherX64Word);
             */
            // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise XORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to XOR with this word.
             *
             * @return {X64Word} A new x64-Word object after XORing.
             *
             * @example
             *
             *     var xored = x64Word.xor(anotherX64Word);
             */
            // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the left.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftL(25);
             */
            // shiftL: function (n) {
            // if (n < 32) {
            // var high = (this.high << n) | (this.low >>> (32 - n));
            // var low = this.low << n;
            // } else {
            // var high = this.low << (n - 32);
            // var low = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the right.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftR(7);
             */
            // shiftR: function (n) {
            // if (n < 32) {
            // var low = (this.low >>> n) | (this.high << (32 - n));
            // var high = this.high >>> n;
            // } else {
            // var low = this.high >>> (n - 32);
            // var high = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Rotates this word n bits to the left.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotL(25);
             */
            // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
            // },
            /**
             * Rotates this word n bits to the right.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotR(7);
             */
            // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
            // },
            /**
             * Adds this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to add with this word.
             *
             * @return {X64Word} A new x64-Word object after adding.
             *
             * @example
             *
             *     var added = x64Word.add(anotherX64Word);
             */
            // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;
            // return X64Word.create(high, low);
            // }
          });
          C_x64.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.x64.WordArray.create();
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ]);
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ], 10);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },
            /**
             * Converts this 64-bit word array to a 32-bit word array.
             *
             * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
             *
             * @example
             *
             *     var x32WordArray = x64WordArray.toX32();
             */
            toX32: function() {
              var x64Words = this.words;
              var x64WordsLength = x64Words.length;
              var x32Words = [];
              for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
              }
              return X32WordArray.create(x32Words, this.sigBytes);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {X64WordArray} The clone.
             *
             * @example
             *
             *     var clone = x64WordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              var words = clone.words = this.words.slice(0);
              var wordsLength = words.length;
              for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
              }
              return clone;
            }
          });
        })();
        return CryptoJS2;
      });
    })(x64Core);
    return x64Core.exports;
  }
  var libTypedarrays = { exports: {} };
  var hasRequiredLibTypedarrays;
  function requireLibTypedarrays() {
    if (hasRequiredLibTypedarrays) return libTypedarrays.exports;
    hasRequiredLibTypedarrays = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          if (typeof ArrayBuffer != "function") {
            return;
          }
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var superInit = WordArray.init;
          var subInit = WordArray.init = function(typedArray) {
            if (typedArray instanceof ArrayBuffer) {
              typedArray = new Uint8Array(typedArray);
            }
            if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
              typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
            }
            if (typedArray instanceof Uint8Array) {
              var typedArrayByteLength = typedArray.byteLength;
              var words = [];
              for (var i = 0; i < typedArrayByteLength; i++) {
                words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
              }
              superInit.call(this, words, typedArrayByteLength);
            } else {
              superInit.apply(this, arguments);
            }
          };
          subInit.prototype = WordArray;
        })();
        return CryptoJS2.lib.WordArray;
      });
    })(libTypedarrays);
    return libTypedarrays.exports;
  }
  var encUtf16 = { exports: {} };
  var hasRequiredEncUtf16;
  function requireEncUtf16() {
    if (hasRequiredEncUtf16) return encUtf16.exports;
    hasRequiredEncUtf16 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Utf16 = C_enc.Utf16BE = {
            /**
             * Converts a word array to a UTF-16 BE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 BE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 BE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 BE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          C_enc.Utf16LE = {
            /**
             * Converts a word array to a UTF-16 LE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 LE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i = 0; i < sigBytes; i += 2) {
                var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 LE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 LE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i = 0; i < utf16StrLength; i++) {
                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          function swapEndian(word) {
            return word << 8 & 4278255360 | word >>> 8 & 16711935;
          }
        })();
        return CryptoJS2.enc.Utf16;
      });
    })(encUtf16);
    return encUtf16.exports;
  }
  var encBase64 = { exports: {} };
  var hasRequiredEncBase64;
  function requireEncBase64() {
    if (hasRequiredEncBase64) return encBase64.exports;
    hasRequiredEncBase64 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function(base64Str) {
              var base64StrLength = base64Str.length;
              var map = this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS2.enc.Base64;
      });
    })(encBase64);
    return encBase64.exports;
  }
  var encBase64url = { exports: {} };
  var hasRequiredEncBase64url;
  function requireEncBase64url() {
    if (hasRequiredEncBase64url) return encBase64url.exports;
    hasRequiredEncBase64url = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Base64url = {
            /**
             * Converts a word array to a Base64url string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {string} The Base64url string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
             */
            stringify: function(wordArray, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = urlSafe ? this._safe_map : this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
                var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64url string to a word array.
             *
             * @param {string} base64Str The Base64url string.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
             */
            parse: function(base64Str, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var base64StrLength = base64Str.length;
              var map = urlSafe ? this._safe_map : this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
              if (i % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS2.enc.Base64url;
      });
    })(encBase64url);
    return encBase64url.exports;
  }
  var md5 = { exports: {} };
  var hasRequiredMd5;
  function requireMd5() {
    if (hasRequiredMd5) return md5.exports;
    hasRequiredMd5 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var T = [];
          (function() {
            for (var i = 0; i < 64; i++) {
              T[i] = Math2.abs(Math2.sin(i + 1)) * 4294967296 | 0;
            }
          })();
          var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878
              ]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i = 0; i < 16; i++) {
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var M_offset_0 = M[offset + 0];
              var M_offset_1 = M[offset + 1];
              var M_offset_2 = M[offset + 2];
              var M_offset_3 = M[offset + 3];
              var M_offset_4 = M[offset + 4];
              var M_offset_5 = M[offset + 5];
              var M_offset_6 = M[offset + 6];
              var M_offset_7 = M[offset + 7];
              var M_offset_8 = M[offset + 8];
              var M_offset_9 = M[offset + 9];
              var M_offset_10 = M[offset + 10];
              var M_offset_11 = M[offset + 11];
              var M_offset_12 = M[offset + 12];
              var M_offset_13 = M[offset + 13];
              var M_offset_14 = M[offset + 14];
              var M_offset_15 = M[offset + 15];
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              a = FF(a, b, c, d, M_offset_0, 7, T[0]);
              d = FF(d, a, b, c, M_offset_1, 12, T[1]);
              c = FF(c, d, a, b, M_offset_2, 17, T[2]);
              b = FF(b, c, d, a, M_offset_3, 22, T[3]);
              a = FF(a, b, c, d, M_offset_4, 7, T[4]);
              d = FF(d, a, b, c, M_offset_5, 12, T[5]);
              c = FF(c, d, a, b, M_offset_6, 17, T[6]);
              b = FF(b, c, d, a, M_offset_7, 22, T[7]);
              a = FF(a, b, c, d, M_offset_8, 7, T[8]);
              d = FF(d, a, b, c, M_offset_9, 12, T[9]);
              c = FF(c, d, a, b, M_offset_10, 17, T[10]);
              b = FF(b, c, d, a, M_offset_11, 22, T[11]);
              a = FF(a, b, c, d, M_offset_12, 7, T[12]);
              d = FF(d, a, b, c, M_offset_13, 12, T[13]);
              c = FF(c, d, a, b, M_offset_14, 17, T[14]);
              b = FF(b, c, d, a, M_offset_15, 22, T[15]);
              a = GG(a, b, c, d, M_offset_1, 5, T[16]);
              d = GG(d, a, b, c, M_offset_6, 9, T[17]);
              c = GG(c, d, a, b, M_offset_11, 14, T[18]);
              b = GG(b, c, d, a, M_offset_0, 20, T[19]);
              a = GG(a, b, c, d, M_offset_5, 5, T[20]);
              d = GG(d, a, b, c, M_offset_10, 9, T[21]);
              c = GG(c, d, a, b, M_offset_15, 14, T[22]);
              b = GG(b, c, d, a, M_offset_4, 20, T[23]);
              a = GG(a, b, c, d, M_offset_9, 5, T[24]);
              d = GG(d, a, b, c, M_offset_14, 9, T[25]);
              c = GG(c, d, a, b, M_offset_3, 14, T[26]);
              b = GG(b, c, d, a, M_offset_8, 20, T[27]);
              a = GG(a, b, c, d, M_offset_13, 5, T[28]);
              d = GG(d, a, b, c, M_offset_2, 9, T[29]);
              c = GG(c, d, a, b, M_offset_7, 14, T[30]);
              b = GG(b, c, d, a, M_offset_12, 20, T[31]);
              a = HH(a, b, c, d, M_offset_5, 4, T[32]);
              d = HH(d, a, b, c, M_offset_8, 11, T[33]);
              c = HH(c, d, a, b, M_offset_11, 16, T[34]);
              b = HH(b, c, d, a, M_offset_14, 23, T[35]);
              a = HH(a, b, c, d, M_offset_1, 4, T[36]);
              d = HH(d, a, b, c, M_offset_4, 11, T[37]);
              c = HH(c, d, a, b, M_offset_7, 16, T[38]);
              b = HH(b, c, d, a, M_offset_10, 23, T[39]);
              a = HH(a, b, c, d, M_offset_13, 4, T[40]);
              d = HH(d, a, b, c, M_offset_0, 11, T[41]);
              c = HH(c, d, a, b, M_offset_3, 16, T[42]);
              b = HH(b, c, d, a, M_offset_6, 23, T[43]);
              a = HH(a, b, c, d, M_offset_9, 4, T[44]);
              d = HH(d, a, b, c, M_offset_12, 11, T[45]);
              c = HH(c, d, a, b, M_offset_15, 16, T[46]);
              b = HH(b, c, d, a, M_offset_2, 23, T[47]);
              a = II(a, b, c, d, M_offset_0, 6, T[48]);
              d = II(d, a, b, c, M_offset_7, 10, T[49]);
              c = II(c, d, a, b, M_offset_14, 15, T[50]);
              b = II(b, c, d, a, M_offset_5, 21, T[51]);
              a = II(a, b, c, d, M_offset_12, 6, T[52]);
              d = II(d, a, b, c, M_offset_3, 10, T[53]);
              c = II(c, d, a, b, M_offset_10, 15, T[54]);
              b = II(b, c, d, a, M_offset_1, 21, T[55]);
              a = II(a, b, c, d, M_offset_8, 6, T[56]);
              d = II(d, a, b, c, M_offset_15, 10, T[57]);
              c = II(c, d, a, b, M_offset_6, 15, T[58]);
              b = II(b, c, d, a, M_offset_13, 21, T[59]);
              a = II(a, b, c, d, M_offset_4, 6, T[60]);
              d = II(d, a, b, c, M_offset_11, 10, T[61]);
              c = II(c, d, a, b, M_offset_2, 15, T[62]);
              b = II(b, c, d, a, M_offset_9, 21, T[63]);
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
              var nBitsTotalL = nBitsTotal;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i = 0; i < 4; i++) {
                var H_i = H[i];
                H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function FF(a, b, c, d, x, s, t) {
            var n2 = a + (b & c | ~b & d) + x + t;
            return (n2 << s | n2 >>> 32 - s) + b;
          }
          function GG(a, b, c, d, x, s, t) {
            var n2 = a + (b & d | c & ~d) + x + t;
            return (n2 << s | n2 >>> 32 - s) + b;
          }
          function HH(a, b, c, d, x, s, t) {
            var n2 = a + (b ^ c ^ d) + x + t;
            return (n2 << s | n2 >>> 32 - s) + b;
          }
          function II(a, b, c, d, x, s, t) {
            var n2 = a + (c ^ (b | ~d)) + x + t;
            return (n2 << s | n2 >>> 32 - s) + b;
          }
          C.MD5 = Hasher._createHelper(MD5);
          C.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);
        return CryptoJS2.MD5;
      });
    })(md5);
    return md5.exports;
  }
  var sha1 = { exports: {} };
  var hasRequiredSha1;
  function requireSha1() {
    if (hasRequiredSha1) return sha1.exports;
    hasRequiredSha1 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var W = [];
          var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878,
                3285377520
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              var e = H[4];
              for (var i = 0; i < 80; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var n2 = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                  W[i] = n2 << 1 | n2 >>> 31;
                }
                var t = (a << 5 | a >>> 27) + e + W[i];
                if (i < 20) {
                  t += (b & c | ~b & d) + 1518500249;
                } else if (i < 40) {
                  t += (b ^ c ^ d) + 1859775393;
                } else if (i < 60) {
                  t += (b & c | b & d | c & d) - 1894007588;
                } else {
                  t += (b ^ c ^ d) - 899497514;
                }
                e = d;
                d = c;
                c = b << 30 | b >>> 2;
                b = a;
                a = t;
              }
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
              H[4] = H[4] + e | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA1 = Hasher._createHelper(SHA1);
          C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        })();
        return CryptoJS2.SHA1;
      });
    })(sha1);
    return sha1.exports;
  }
  var sha256 = { exports: {} };
  var hasRequiredSha256;
  function requireSha256() {
    if (hasRequiredSha256) return sha256.exports;
    hasRequiredSha256 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var H = [];
          var K = [];
          (function() {
            function isPrime(n3) {
              var sqrtN = Math2.sqrt(n3);
              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n3 % factor)) {
                  return false;
                }
              }
              return true;
            }
            function getFractionalBits(n3) {
              return (n3 - (n3 | 0)) * 4294967296 | 0;
            }
            var n2 = 2;
            var nPrime = 0;
            while (nPrime < 64) {
              if (isPrime(n2)) {
                if (nPrime < 8) {
                  H[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 3));
                nPrime++;
              }
              n2++;
            }
          })();
          var W = [];
          var SHA256 = C_algo.SHA256 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init(H.slice(0));
            },
            _doProcessBlock: function(M, offset) {
              var H2 = this._hash.words;
              var a = H2[0];
              var b = H2[1];
              var c = H2[2];
              var d = H2[3];
              var e = H2[4];
              var f2 = H2[5];
              var g = H2[6];
              var h = H2[7];
              for (var i = 0; i < 64; i++) {
                if (i < 16) {
                  W[i] = M[offset + i] | 0;
                } else {
                  var gamma0x = W[i - 15];
                  var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                  var gamma1x = W[i - 2];
                  var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                  W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }
                var ch = e & f2 ^ ~e & g;
                var maj = a & b ^ a & c ^ b & c;
                var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f2;
                f2 = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
              }
              H2[0] = H2[0] + a | 0;
              H2[1] = H2[1] + b | 0;
              H2[2] = H2[2] + c | 0;
              H2[3] = H2[3] + d | 0;
              H2[4] = H2[4] + e | 0;
              H2[5] = H2[5] + f2 | 0;
              H2[6] = H2[6] + g | 0;
              H2[7] = H2[7] + h | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA256 = Hasher._createHelper(SHA256);
          C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        })(Math);
        return CryptoJS2.SHA256;
      });
    })(sha256);
    return sha256.exports;
  }
  var sha224 = { exports: {} };
  var hasRequiredSha224;
  function requireSha224() {
    if (hasRequiredSha224) return sha224.exports;
    hasRequiredSha224 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha256());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var SHA224 = C_algo.SHA224 = SHA256.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                3238371032,
                914150663,
                812702999,
                4144912697,
                4290775857,
                1750603025,
                1694076839,
                3204075428
              ]);
            },
            _doFinalize: function() {
              var hash = SHA256._doFinalize.call(this);
              hash.sigBytes -= 4;
              return hash;
            }
          });
          C.SHA224 = SHA256._createHelper(SHA224);
          C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        })();
        return CryptoJS2.SHA224;
      });
    })(sha224);
    return sha224.exports;
  }
  var sha512 = { exports: {} };
  var hasRequiredSha512;
  function requireSha512() {
    if (hasRequiredSha512) return sha512.exports;
    hasRequiredSha512 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          function X64Word_create() {
            return X64Word.create.apply(X64Word, arguments);
          }
          var K = [
            X64Word_create(1116352408, 3609767458),
            X64Word_create(1899447441, 602891725),
            X64Word_create(3049323471, 3964484399),
            X64Word_create(3921009573, 2173295548),
            X64Word_create(961987163, 4081628472),
            X64Word_create(1508970993, 3053834265),
            X64Word_create(2453635748, 2937671579),
            X64Word_create(2870763221, 3664609560),
            X64Word_create(3624381080, 2734883394),
            X64Word_create(310598401, 1164996542),
            X64Word_create(607225278, 1323610764),
            X64Word_create(1426881987, 3590304994),
            X64Word_create(1925078388, 4068182383),
            X64Word_create(2162078206, 991336113),
            X64Word_create(2614888103, 633803317),
            X64Word_create(3248222580, 3479774868),
            X64Word_create(3835390401, 2666613458),
            X64Word_create(4022224774, 944711139),
            X64Word_create(264347078, 2341262773),
            X64Word_create(604807628, 2007800933),
            X64Word_create(770255983, 1495990901),
            X64Word_create(1249150122, 1856431235),
            X64Word_create(1555081692, 3175218132),
            X64Word_create(1996064986, 2198950837),
            X64Word_create(2554220882, 3999719339),
            X64Word_create(2821834349, 766784016),
            X64Word_create(2952996808, 2566594879),
            X64Word_create(3210313671, 3203337956),
            X64Word_create(3336571891, 1034457026),
            X64Word_create(3584528711, 2466948901),
            X64Word_create(113926993, 3758326383),
            X64Word_create(338241895, 168717936),
            X64Word_create(666307205, 1188179964),
            X64Word_create(773529912, 1546045734),
            X64Word_create(1294757372, 1522805485),
            X64Word_create(1396182291, 2643833823),
            X64Word_create(1695183700, 2343527390),
            X64Word_create(1986661051, 1014477480),
            X64Word_create(2177026350, 1206759142),
            X64Word_create(2456956037, 344077627),
            X64Word_create(2730485921, 1290863460),
            X64Word_create(2820302411, 3158454273),
            X64Word_create(3259730800, 3505952657),
            X64Word_create(3345764771, 106217008),
            X64Word_create(3516065817, 3606008344),
            X64Word_create(3600352804, 1432725776),
            X64Word_create(4094571909, 1467031594),
            X64Word_create(275423344, 851169720),
            X64Word_create(430227734, 3100823752),
            X64Word_create(506948616, 1363258195),
            X64Word_create(659060556, 3750685593),
            X64Word_create(883997877, 3785050280),
            X64Word_create(958139571, 3318307427),
            X64Word_create(1322822218, 3812723403),
            X64Word_create(1537002063, 2003034995),
            X64Word_create(1747873779, 3602036899),
            X64Word_create(1955562222, 1575990012),
            X64Word_create(2024104815, 1125592928),
            X64Word_create(2227730452, 2716904306),
            X64Word_create(2361852424, 442776044),
            X64Word_create(2428436474, 593698344),
            X64Word_create(2756734187, 3733110249),
            X64Word_create(3204031479, 2999351573),
            X64Word_create(3329325298, 3815920427),
            X64Word_create(3391569614, 3928383900),
            X64Word_create(3515267271, 566280711),
            X64Word_create(3940187606, 3454069534),
            X64Word_create(4118630271, 4000239992),
            X64Word_create(116418474, 1914138554),
            X64Word_create(174292421, 2731055270),
            X64Word_create(289380356, 3203993006),
            X64Word_create(460393269, 320620315),
            X64Word_create(685471733, 587496836),
            X64Word_create(852142971, 1086792851),
            X64Word_create(1017036298, 365543100),
            X64Word_create(1126000580, 2618297676),
            X64Word_create(1288033470, 3409855158),
            X64Word_create(1501505948, 4234509866),
            X64Word_create(1607167915, 987167468),
            X64Word_create(1816402316, 1246189591)
          ];
          var W = [];
          (function() {
            for (var i = 0; i < 80; i++) {
              W[i] = X64Word_create();
            }
          })();
          var SHA512 = C_algo.SHA512 = Hasher.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(1779033703, 4089235720),
                new X64Word.init(3144134277, 2227873595),
                new X64Word.init(1013904242, 4271175723),
                new X64Word.init(2773480762, 1595750129),
                new X64Word.init(1359893119, 2917565137),
                new X64Word.init(2600822924, 725511199),
                new X64Word.init(528734635, 4215389547),
                new X64Word.init(1541459225, 327033209)
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var H0 = H[0];
              var H1 = H[1];
              var H2 = H[2];
              var H3 = H[3];
              var H4 = H[4];
              var H5 = H[5];
              var H6 = H[6];
              var H7 = H[7];
              var H0h = H0.high;
              var H0l = H0.low;
              var H1h = H1.high;
              var H1l = H1.low;
              var H2h = H2.high;
              var H2l = H2.low;
              var H3h = H3.high;
              var H3l = H3.low;
              var H4h = H4.high;
              var H4l = H4.low;
              var H5h = H5.high;
              var H5l = H5.low;
              var H6h = H6.high;
              var H6l = H6.low;
              var H7h = H7.high;
              var H7l = H7.low;
              var ah = H0h;
              var al = H0l;
              var bh = H1h;
              var bl = H1l;
              var ch = H2h;
              var cl = H2l;
              var dh = H3h;
              var dl = H3l;
              var eh = H4h;
              var el = H4l;
              var fh = H5h;
              var fl = H5l;
              var gh = H6h;
              var gl = H6l;
              var hh = H7h;
              var hl = H7l;
              for (var i = 0; i < 80; i++) {
                var Wil;
                var Wih;
                var Wi = W[i];
                if (i < 16) {
                  Wih = Wi.high = M[offset + i * 2] | 0;
                  Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                } else {
                  var gamma0x = W[i - 15];
                  var gamma0xh = gamma0x.high;
                  var gamma0xl = gamma0x.low;
                  var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                  var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                  var gamma1x = W[i - 2];
                  var gamma1xh = gamma1x.high;
                  var gamma1xl = gamma1x.low;
                  var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                  var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                  var Wi7 = W[i - 7];
                  var Wi7h = Wi7.high;
                  var Wi7l = Wi7.low;
                  var Wi16 = W[i - 16];
                  var Wi16h = Wi16.high;
                  var Wi16l = Wi16.low;
                  Wil = gamma0l + Wi7l;
                  Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                  Wil = Wil + gamma1l;
                  Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                  Wil = Wil + Wi16l;
                  Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                  Wi.high = Wih;
                  Wi.low = Wil;
                }
                var chh = eh & fh ^ ~eh & gh;
                var chl = el & fl ^ ~el & gl;
                var majh = ah & bh ^ ah & ch ^ bh & ch;
                var majl = al & bl ^ al & cl ^ bl & cl;
                var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
                var Ki = K[i];
                var Kih = Ki.high;
                var Kil = Ki.low;
                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = dl + t1l | 0;
                eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = t1l + t2l | 0;
                ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
              }
              H0l = H0.low = H0l + al;
              H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
              H1l = H1.low = H1l + bl;
              H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
              H2l = H2.low = H2l + cl;
              H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
              H3l = H3.low = H3l + dl;
              H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
              H4l = H4.low = H4l + el;
              H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
              H5l = H5.low = H5l + fl;
              H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
              H6l = H6.low = H6l + gl;
              H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
              H7l = H7.low = H7l + hl;
              H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var hash = this._hash.toX32();
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            },
            blockSize: 1024 / 32
          });
          C.SHA512 = Hasher._createHelper(SHA512);
          C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        })();
        return CryptoJS2.SHA512;
      });
    })(sha512);
    return sha512.exports;
  }
  var sha384 = { exports: {} };
  var hasRequiredSha384;
  function requireSha384() {
    if (hasRequiredSha384) return sha384.exports;
    hasRequiredSha384 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core(), requireSha512());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          var SHA512 = C_algo.SHA512;
          var SHA384 = C_algo.SHA384 = SHA512.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(3418070365, 3238371032),
                new X64Word.init(1654270250, 914150663),
                new X64Word.init(2438529370, 812702999),
                new X64Word.init(355462360, 4144912697),
                new X64Word.init(1731405415, 4290775857),
                new X64Word.init(2394180231, 1750603025),
                new X64Word.init(3675008525, 1694076839),
                new X64Word.init(1203062813, 3204075428)
              ]);
            },
            _doFinalize: function() {
              var hash = SHA512._doFinalize.call(this);
              hash.sigBytes -= 16;
              return hash;
            }
          });
          C.SHA384 = SHA512._createHelper(SHA384);
          C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        })();
        return CryptoJS2.SHA384;
      });
    })(sha384);
    return sha384.exports;
  }
  var sha3 = { exports: {} };
  var hasRequiredSha3;
  function requireSha3() {
    if (hasRequiredSha3) return sha3.exports;
    hasRequiredSha3 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var C_algo = C.algo;
          var RHO_OFFSETS = [];
          var PI_INDEXES = [];
          var ROUND_CONSTANTS = [];
          (function() {
            var x = 1, y = 0;
            for (var t = 0; t < 24; t++) {
              RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
              var newX = y % 5;
              var newY = (2 * x + 3 * y) % 5;
              x = newX;
              y = newY;
            }
            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
              }
            }
            var LFSR = 1;
            for (var i = 0; i < 24; i++) {
              var roundConstantMsw = 0;
              var roundConstantLsw = 0;
              for (var j = 0; j < 7; j++) {
                if (LFSR & 1) {
                  var bitPosition = (1 << j) - 1;
                  if (bitPosition < 32) {
                    roundConstantLsw ^= 1 << bitPosition;
                  } else {
                    roundConstantMsw ^= 1 << bitPosition - 32;
                  }
                }
                if (LFSR & 128) {
                  LFSR = LFSR << 1 ^ 113;
                } else {
                  LFSR <<= 1;
                }
              }
              ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
            }
          })();
          var T = [];
          (function() {
            for (var i = 0; i < 25; i++) {
              T[i] = X64Word.create();
            }
          })();
          var SHA3 = C_algo.SHA3 = Hasher.extend({
            /**
             * Configuration options.
             *
             * @property {number} outputLength
             *   The desired number of bits in the output hash.
             *   Only values permitted are: 224, 256, 384, 512.
             *   Default: 512
             */
            cfg: Hasher.cfg.extend({
              outputLength: 512
            }),
            _doReset: function() {
              var state = this._state = [];
              for (var i = 0; i < 25; i++) {
                state[i] = new X64Word.init();
              }
              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function(M, offset) {
              var state = this._state;
              var nBlockSizeLanes = this.blockSize / 2;
              for (var i = 0; i < nBlockSizeLanes; i++) {
                var M2i = M[offset + 2 * i];
                var M2i1 = M[offset + 2 * i + 1];
                M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
                M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
                var lane = state[i];
                lane.high ^= M2i1;
                lane.low ^= M2i;
              }
              for (var round = 0; round < 24; round++) {
                for (var x = 0; x < 5; x++) {
                  var tMsw = 0, tLsw = 0;
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                  }
                  var Tx = T[x];
                  Tx.high = tMsw;
                  Tx.low = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                  var Tx4 = T[(x + 4) % 5];
                  var Tx1 = T[(x + 1) % 5];
                  var Tx1Msw = Tx1.high;
                  var Tx1Lsw = Tx1.low;
                  var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                  var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                  }
                }
                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                  var tMsw;
                  var tLsw;
                  var lane = state[laneIndex];
                  var laneMsw = lane.high;
                  var laneLsw = lane.low;
                  var rhoOffset = RHO_OFFSETS[laneIndex];
                  if (rhoOffset < 32) {
                    tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                    tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                  } else {
                    tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                    tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                  }
                  var TPiLane = T[PI_INDEXES[laneIndex]];
                  TPiLane.high = tMsw;
                  TPiLane.low = tLsw;
                }
                var T0 = T[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low = state0.low;
                for (var x = 0; x < 5; x++) {
                  for (var y = 0; y < 5; y++) {
                    var laneIndex = x + 5 * y;
                    var lane = state[laneIndex];
                    var TLane = T[laneIndex];
                    var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                    var Tx2Lane = T[(x + 2) % 5 + 5 * y];
                    lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                    lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                  }
                }
                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low ^= roundConstant.low;
              }
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              var blockSizeBits = this.blockSize * 32;
              dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
              dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var state = this._state;
              var outputLengthBytes = this.cfg.outputLength / 8;
              var outputLengthLanes = outputLengthBytes / 8;
              var hashWords = [];
              for (var i = 0; i < outputLengthLanes; i++) {
                var lane = state[i];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
                laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
              }
              return new WordArray.init(hashWords, outputLengthBytes);
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              var state = clone._state = this._state.slice(0);
              for (var i = 0; i < 25; i++) {
                state[i] = state[i].clone();
              }
              return clone;
            }
          });
          C.SHA3 = Hasher._createHelper(SHA3);
          C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        })(Math);
        return CryptoJS2.SHA3;
      });
    })(sha3);
    return sha3.exports;
  }
  var ripemd160 = { exports: {} };
  var hasRequiredRipemd160;
  function requireRipemd160() {
    if (hasRequiredRipemd160) return ripemd160.exports;
    hasRequiredRipemd160 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        /** @preserve
        			(c) 2012 by Cédric Mesnil. All rights reserved.
        
        			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
        
        			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
        
        			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        			*/
        (function(Math2) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var _zl = WordArray.create([
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            7,
            4,
            13,
            1,
            10,
            6,
            15,
            3,
            12,
            0,
            9,
            5,
            2,
            14,
            11,
            8,
            3,
            10,
            14,
            4,
            9,
            15,
            8,
            1,
            2,
            7,
            0,
            6,
            13,
            11,
            5,
            12,
            1,
            9,
            11,
            10,
            0,
            8,
            12,
            4,
            13,
            3,
            7,
            15,
            14,
            5,
            6,
            2,
            4,
            0,
            5,
            9,
            7,
            12,
            2,
            10,
            14,
            1,
            3,
            8,
            11,
            6,
            15,
            13
          ]);
          var _zr = WordArray.create([
            5,
            14,
            7,
            0,
            9,
            2,
            11,
            4,
            13,
            6,
            15,
            8,
            1,
            10,
            3,
            12,
            6,
            11,
            3,
            7,
            0,
            13,
            5,
            10,
            14,
            15,
            8,
            12,
            4,
            9,
            1,
            2,
            15,
            5,
            1,
            3,
            7,
            14,
            6,
            9,
            11,
            8,
            12,
            2,
            10,
            0,
            4,
            13,
            8,
            6,
            4,
            1,
            3,
            11,
            15,
            0,
            5,
            12,
            2,
            13,
            9,
            7,
            10,
            14,
            12,
            15,
            10,
            4,
            1,
            5,
            8,
            7,
            6,
            2,
            13,
            14,
            0,
            3,
            9,
            11
          ]);
          var _sl = WordArray.create([
            11,
            14,
            15,
            12,
            5,
            8,
            7,
            9,
            11,
            13,
            14,
            15,
            6,
            7,
            9,
            8,
            7,
            6,
            8,
            13,
            11,
            9,
            7,
            15,
            7,
            12,
            15,
            9,
            11,
            7,
            13,
            12,
            11,
            13,
            6,
            7,
            14,
            9,
            13,
            15,
            14,
            8,
            13,
            6,
            5,
            12,
            7,
            5,
            11,
            12,
            14,
            15,
            14,
            15,
            9,
            8,
            9,
            14,
            5,
            6,
            8,
            6,
            5,
            12,
            9,
            15,
            5,
            11,
            6,
            8,
            13,
            12,
            5,
            12,
            13,
            14,
            11,
            8,
            5,
            6
          ]);
          var _sr = WordArray.create([
            8,
            9,
            9,
            11,
            13,
            15,
            15,
            5,
            7,
            7,
            8,
            11,
            14,
            14,
            12,
            6,
            9,
            13,
            15,
            7,
            12,
            8,
            9,
            11,
            7,
            7,
            12,
            7,
            6,
            15,
            13,
            11,
            9,
            7,
            15,
            11,
            8,
            6,
            6,
            14,
            12,
            13,
            5,
            14,
            13,
            13,
            7,
            5,
            15,
            5,
            8,
            11,
            14,
            14,
            6,
            14,
            6,
            9,
            12,
            9,
            12,
            5,
            15,
            8,
            8,
            5,
            12,
            9,
            12,
            5,
            14,
            6,
            8,
            13,
            6,
            5,
            15,
            13,
            11,
            11
          ]);
          var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
          var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
          var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
            _doReset: function() {
              this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i = 0; i < 16; i++) {
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var hl = _hl.words;
              var hr = _hr.words;
              var zl = _zl.words;
              var zr = _zr.words;
              var sl = _sl.words;
              var sr = _sr.words;
              var al, bl, cl, dl, el;
              var ar, br, cr, dr, er;
              ar = al = H[0];
              br = bl = H[1];
              cr = cl = H[2];
              dr = dl = H[3];
              er = el = H[4];
              var t;
              for (var i = 0; i < 80; i += 1) {
                t = al + M[offset + zl[i]] | 0;
                if (i < 16) {
                  t += f1(bl, cl, dl) + hl[0];
                } else if (i < 32) {
                  t += f2(bl, cl, dl) + hl[1];
                } else if (i < 48) {
                  t += f3(bl, cl, dl) + hl[2];
                } else if (i < 64) {
                  t += f4(bl, cl, dl) + hl[3];
                } else {
                  t += f5(bl, cl, dl) + hl[4];
                }
                t = t | 0;
                t = rotl(t, sl[i]);
                t = t + el | 0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t;
                t = ar + M[offset + zr[i]] | 0;
                if (i < 16) {
                  t += f5(br, cr, dr) + hr[0];
                } else if (i < 32) {
                  t += f4(br, cr, dr) + hr[1];
                } else if (i < 48) {
                  t += f3(br, cr, dr) + hr[2];
                } else if (i < 64) {
                  t += f2(br, cr, dr) + hr[3];
                } else {
                  t += f1(br, cr, dr) + hr[4];
                }
                t = t | 0;
                t = rotl(t, sr[i]);
                t = t + er | 0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t;
              }
              t = H[1] + cl + dr | 0;
              H[1] = H[2] + dl + er | 0;
              H[2] = H[3] + el + ar | 0;
              H[3] = H[4] + al + br | 0;
              H[4] = H[0] + bl + cr | 0;
              H[0] = t;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i = 0; i < 5; i++) {
                var H_i = H[i];
                H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function f1(x, y, z) {
            return x ^ y ^ z;
          }
          function f2(x, y, z) {
            return x & y | ~x & z;
          }
          function f3(x, y, z) {
            return (x | ~y) ^ z;
          }
          function f4(x, y, z) {
            return x & z | y & ~z;
          }
          function f5(x, y, z) {
            return x ^ (y | ~z);
          }
          function rotl(x, n2) {
            return x << n2 | x >>> 32 - n2;
          }
          C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })();
        return CryptoJS2.RIPEMD160;
      });
    })(ripemd160);
    return ripemd160.exports;
  }
  var hmac = { exports: {} };
  var hasRequiredHmac;
  function requireHmac() {
    if (hasRequiredHmac) return hmac.exports;
    hasRequiredHmac = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C.algo;
          C_algo.HMAC = Base.extend({
            /**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */
            init: function(hasher, key) {
              hasher = this._hasher = new hasher.init();
              if (typeof key == "string") {
                key = Utf8.parse(key);
              }
              var hasherBlockSize = hasher.blockSize;
              var hasherBlockSizeBytes = hasherBlockSize * 4;
              if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
              }
              key.clamp();
              var oKey = this._oKey = key.clone();
              var iKey = this._iKey = key.clone();
              var oKeyWords = oKey.words;
              var iKeyWords = iKey.words;
              for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 1549556828;
                iKeyWords[i] ^= 909522486;
              }
              oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
              this.reset();
            },
            /**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */
            reset: function() {
              var hasher = this._hasher;
              hasher.reset();
              hasher.update(this._iKey);
            },
            /**
             * Updates this HMAC with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {HMAC} This HMAC instance.
             *
             * @example
             *
             *     hmacHasher.update('message');
             *     hmacHasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._hasher.update(messageUpdate);
              return this;
            },
            /**
             * Finalizes the HMAC computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The HMAC.
             *
             * @example
             *
             *     var hmac = hmacHasher.finalize();
             *     var hmac = hmacHasher.finalize('message');
             *     var hmac = hmacHasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              var hasher = this._hasher;
              var innerHash = hasher.finalize(messageUpdate);
              hasher.reset();
              var hmac2 = hasher.finalize(this._oKey.clone().concat(innerHash));
              return hmac2;
            }
          });
        })();
      });
    })(hmac);
    return hmac.exports;
  }
  var pbkdf2 = { exports: {} };
  var hasRequiredPbkdf2;
  function requirePbkdf2() {
    if (hasRequiredPbkdf2) return pbkdf2.exports;
    hasRequiredPbkdf2 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha256(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var HMAC = C_algo.HMAC;
          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hasher to use. Default: SHA256
             * @property {number} iterations The number of iterations to perform. Default: 250000
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA256,
              iterations: 25e4
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.PBKDF2.create();
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var cfg = this.cfg;
              var hmac2 = HMAC.create(cfg.hasher, password);
              var derivedKey = WordArray.create();
              var blockIndex = WordArray.create([1]);
              var derivedKeyWords = derivedKey.words;
              var blockIndexWords = blockIndex.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                var block = hmac2.update(salt).finalize(blockIndex);
                hmac2.reset();
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                  intermediate = hmac2.finalize(intermediate);
                  hmac2.reset();
                  var intermediateWords = intermediate.words;
                  for (var j = 0; j < blockWordsLength; j++) {
                    blockWords[j] ^= intermediateWords[j];
                  }
                }
                derivedKey.concat(block);
                blockIndexWords[0]++;
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.PBKDF2 = function(password, salt, cfg) {
            return PBKDF2.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS2.PBKDF2;
      });
    })(pbkdf2);
    return pbkdf2.exports;
  }
  var evpkdf = { exports: {} };
  var hasRequiredEvpkdf;
  function requireEvpkdf() {
    if (hasRequiredEvpkdf) return evpkdf.exports;
    hasRequiredEvpkdf = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha1(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var MD5 = C_algo.MD5;
          var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var block;
              var cfg = this.cfg;
              var hasher = cfg.hasher.create();
              var derivedKey = WordArray.create();
              var derivedKeyWords = derivedKey.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                if (block) {
                  hasher.update(block);
                }
                block = hasher.update(password).finalize(salt);
                hasher.reset();
                for (var i = 1; i < iterations; i++) {
                  block = hasher.finalize(block);
                  hasher.reset();
                }
                derivedKey.concat(block);
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.EvpKDF = function(password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS2.EvpKDF;
      });
    })(evpkdf);
    return evpkdf.exports;
  }
  var cipherCore = { exports: {} };
  var hasRequiredCipherCore;
  function requireCipherCore() {
    if (hasRequiredCipherCore) return cipherCore.exports;
    hasRequiredCipherCore = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEvpkdf());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.lib.Cipher || function(undefined$1) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
          var C_enc = C.enc;
          C_enc.Utf8;
          var Base64 = C_enc.Base64;
          var C_algo = C.algo;
          var EvpKDF = C_algo.EvpKDF;
          var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),
            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function(key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },
            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function(key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },
            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function(xformMode, key, cfg) {
              this.cfg = this.cfg.extend(cfg);
              this._xformMode = xformMode;
              this._key = key;
              this.reset();
            },
            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function(dataUpdate) {
              this._append(dataUpdate);
              return this._process();
            },
            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function(dataUpdate) {
              if (dataUpdate) {
                this._append(dataUpdate);
              }
              var finalProcessedData = this._doFinalize();
              return finalProcessedData;
            },
            keySize: 128 / 32,
            ivSize: 128 / 32,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: /* @__PURE__ */ function() {
              function selectCipherStrategy(key) {
                if (typeof key == "string") {
                  return PasswordBasedCipher;
                } else {
                  return SerializableCipher;
                }
              }
              return function(cipher) {
                return {
                  encrypt: function(message, key, cfg) {
                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                  },
                  decrypt: function(ciphertext, key, cfg) {
                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                  }
                };
              };
            }()
          });
          C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function() {
              var finalProcessedBlocks = this._process(true);
              return finalProcessedBlocks;
            },
            blockSize: 1
          });
          var C_mode = C.mode = {};
          var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function(cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },
            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function(cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },
            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function(cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          var CBC = C_mode.CBC = function() {
            var CBC2 = BlockCipherMode.extend();
            CBC2.Encryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            CBC2.Decryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var thisBlock = words.slice(offset, offset + blockSize);
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);
                this._prevBlock = thisBlock;
              }
            });
            function xorBlock(words, offset, blockSize) {
              var block;
              var iv = this._iv;
              if (iv) {
                block = iv;
                this._iv = undefined$1;
              } else {
                block = this._prevBlock;
              }
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
              }
            }
            return CBC2;
          }();
          var C_pad = C.pad = {};
          var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function(data, blockSize) {
              var blockSizeBytes = blockSize * 4;
              var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
              var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
              var paddingWords = [];
              for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
              }
              var padding = WordArray.create(paddingWords, nPaddingBytes);
              data.concat(padding);
            },
            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function(data) {
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
              data.sigBytes -= nPaddingBytes;
            }
          };
          C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
              mode: CBC,
              padding: Pkcs7
            }),
            reset: function() {
              var modeCreator;
              Cipher.reset.call(this);
              var cfg = this.cfg;
              var iv = cfg.iv;
              var mode = cfg.mode;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                modeCreator = mode.createEncryptor;
              } else {
                modeCreator = mode.createDecryptor;
                this._minBufferSize = 1;
              }
              if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
              } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
              }
            },
            _doProcessBlock: function(words, offset) {
              this._mode.processBlock(words, offset);
            },
            _doFinalize: function() {
              var finalProcessedBlocks;
              var padding = this.cfg.padding;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                padding.pad(this._data, this.blockSize);
                finalProcessedBlocks = this._process(true);
              } else {
                finalProcessedBlocks = this._process(true);
                padding.unpad(finalProcessedBlocks);
              }
              return finalProcessedBlocks;
            },
            blockSize: 128 / 32
          });
          var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function(cipherParams) {
              this.mixIn(cipherParams);
            },
            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function(formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          var C_format = C.format = {};
          var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              var wordArray;
              var ciphertext = cipherParams.ciphertext;
              var salt = cipherParams.salt;
              if (salt) {
                wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
              } else {
                wordArray = ciphertext;
              }
              return wordArray.toString(Base64);
            },
            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function(openSSLStr) {
              var salt;
              var ciphertext = Base64.parse(openSSLStr);
              var ciphertextWords = ciphertext.words;
              if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
                salt = WordArray.create(ciphertextWords.slice(2, 4));
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
              }
              return CipherParams.create({ ciphertext, salt });
            }
          };
          var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),
            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, key, cfg) {
              cfg = this.cfg.extend(cfg);
              var encryptor = cipher.createEncryptor(key, cfg);
              var ciphertext = encryptor.finalize(message);
              var cipherCfg = encryptor.cfg;
              return CipherParams.create({
                ciphertext,
                key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
              });
            },
            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, key, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },
            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function(ciphertext, format) {
              if (typeof ciphertext == "string") {
                return format.parse(ciphertext, this);
              } else {
                return ciphertext;
              }
            }
          });
          var C_kdf = C.kdf = {};
          var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function(password, keySize, ivSize, salt, hasher) {
              if (!salt) {
                salt = WordArray.random(64 / 8);
              }
              if (!hasher) {
                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
              } else {
                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
              }
              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4;
              return CipherParams.create({ key, iv, salt });
            }
          };
          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),
            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, password, cfg) {
              cfg = this.cfg.extend(cfg);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },
            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, password, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
              return plaintext;
            }
          });
        }();
      });
    })(cipherCore);
    return cipherCore.exports;
  }
  var modeCfb = { exports: {} };
  var hasRequiredModeCfb;
  function requireModeCfb() {
    if (hasRequiredModeCfb) return modeCfb.exports;
    hasRequiredModeCfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.CFB = function() {
          var CFB = CryptoJS2.lib.BlockCipherMode.extend();
          CFB.Encryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CFB.Decryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = thisBlock;
            }
          });
          function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
            var keystream;
            var iv = this._iv;
            if (iv) {
              keystream = iv.slice(0);
              this._iv = void 0;
            } else {
              keystream = this._prevBlock;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
          return CFB;
        }();
        return CryptoJS2.mode.CFB;
      });
    })(modeCfb);
    return modeCfb.exports;
  }
  var modeCtr = { exports: {} };
  var hasRequiredModeCtr;
  function requireModeCtr() {
    if (hasRequiredModeCtr) return modeCtr.exports;
    hasRequiredModeCtr = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.CTR = function() {
          var CTR = CryptoJS2.lib.BlockCipherMode.extend();
          var Encryptor = CTR.Encryptor = CTR.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTR.Decryptor = Encryptor;
          return CTR;
        }();
        return CryptoJS2.mode.CTR;
      });
    })(modeCtr);
    return modeCtr.exports;
  }
  var modeCtrGladman = { exports: {} };
  var hasRequiredModeCtrGladman;
  function requireModeCtrGladman() {
    if (hasRequiredModeCtrGladman) return modeCtrGladman.exports;
    hasRequiredModeCtrGladman = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        /** @preserve
         * Counter block mode compatible with  Dr Brian Gladman fileenc.c
         * derived from CryptoJS.mode.CTR
         * Jan Hruby jhruby.web@gmail.com
         */
        CryptoJS2.mode.CTRGladman = function() {
          var CTRGladman = CryptoJS2.lib.BlockCipherMode.extend();
          function incWord(word) {
            if ((word >> 24 & 255) === 255) {
              var b1 = word >> 16 & 255;
              var b2 = word >> 8 & 255;
              var b3 = word & 255;
              if (b1 === 255) {
                b1 = 0;
                if (b2 === 255) {
                  b2 = 0;
                  if (b3 === 255) {
                    b3 = 0;
                  } else {
                    ++b3;
                  }
                } else {
                  ++b2;
                }
              } else {
                ++b1;
              }
              word = 0;
              word += b1 << 16;
              word += b2 << 8;
              word += b3;
            } else {
              word += 1 << 24;
            }
            return word;
          }
          function incCounter(counter) {
            if ((counter[0] = incWord(counter[0])) === 0) {
              counter[1] = incWord(counter[1]);
            }
            return counter;
          }
          var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              incCounter(counter);
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          CTRGladman.Decryptor = Encryptor;
          return CTRGladman;
        }();
        return CryptoJS2.mode.CTRGladman;
      });
    })(modeCtrGladman);
    return modeCtrGladman.exports;
  }
  var modeOfb = { exports: {} };
  var hasRequiredModeOfb;
  function requireModeOfb() {
    if (hasRequiredModeOfb) return modeOfb.exports;
    hasRequiredModeOfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.OFB = function() {
          var OFB = CryptoJS2.lib.BlockCipherMode.extend();
          var Encryptor = OFB.Encryptor = OFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var keystream = this._keystream;
              if (iv) {
                keystream = this._keystream = iv.slice(0);
                this._iv = void 0;
              }
              cipher.encryptBlock(keystream, 0);
              for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= keystream[i];
              }
            }
          });
          OFB.Decryptor = Encryptor;
          return OFB;
        }();
        return CryptoJS2.mode.OFB;
      });
    })(modeOfb);
    return modeOfb.exports;
  }
  var modeEcb = { exports: {} };
  var hasRequiredModeEcb;
  function requireModeEcb() {
    if (hasRequiredModeEcb) return modeEcb.exports;
    hasRequiredModeEcb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.ECB = function() {
          var ECB = CryptoJS2.lib.BlockCipherMode.extend();
          ECB.Encryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.encryptBlock(words, offset);
            }
          });
          ECB.Decryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.decryptBlock(words, offset);
            }
          });
          return ECB;
        }();
        return CryptoJS2.mode.ECB;
      });
    })(modeEcb);
    return modeEcb.exports;
  }
  var padAnsix923 = { exports: {} };
  var hasRequiredPadAnsix923;
  function requirePadAnsix923() {
    if (hasRequiredPadAnsix923) return padAnsix923.exports;
    hasRequiredPadAnsix923 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.AnsiX923 = {
          pad: function(data, blockSize) {
            var dataSigBytes = data.sigBytes;
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
            var lastBytePos = dataSigBytes + nPaddingBytes - 1;
            data.clamp();
            data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
            data.sigBytes += nPaddingBytes;
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS2.pad.Ansix923;
      });
    })(padAnsix923);
    return padAnsix923.exports;
  }
  var padIso10126 = { exports: {} };
  var hasRequiredPadIso10126;
  function requirePadIso10126() {
    if (hasRequiredPadIso10126) return padIso10126.exports;
    hasRequiredPadIso10126 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.Iso10126 = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            data.concat(CryptoJS2.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS2.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS2.pad.Iso10126;
      });
    })(padIso10126);
    return padIso10126.exports;
  }
  var padIso97971 = { exports: {} };
  var hasRequiredPadIso97971;
  function requirePadIso97971() {
    if (hasRequiredPadIso97971) return padIso97971.exports;
    hasRequiredPadIso97971 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.Iso97971 = {
          pad: function(data, blockSize) {
            data.concat(CryptoJS2.lib.WordArray.create([2147483648], 1));
            CryptoJS2.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function(data) {
            CryptoJS2.pad.ZeroPadding.unpad(data);
            data.sigBytes--;
          }
        };
        return CryptoJS2.pad.Iso97971;
      });
    })(padIso97971);
    return padIso97971.exports;
  }
  var padZeropadding = { exports: {} };
  var hasRequiredPadZeropadding;
  function requirePadZeropadding() {
    if (hasRequiredPadZeropadding) return padZeropadding.exports;
    hasRequiredPadZeropadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.ZeroPadding = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            data.clamp();
            data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
          },
          unpad: function(data) {
            var dataWords = data.words;
            var i = data.sigBytes - 1;
            for (var i = data.sigBytes - 1; i >= 0; i--) {
              if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
                data.sigBytes = i + 1;
                break;
              }
            }
          }
        };
        return CryptoJS2.pad.ZeroPadding;
      });
    })(padZeropadding);
    return padZeropadding.exports;
  }
  var padNopadding = { exports: {} };
  var hasRequiredPadNopadding;
  function requirePadNopadding() {
    if (hasRequiredPadNopadding) return padNopadding.exports;
    hasRequiredPadNopadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.NoPadding = {
          pad: function() {
          },
          unpad: function() {
          }
        };
        return CryptoJS2.pad.NoPadding;
      });
    })(padNopadding);
    return padNopadding.exports;
  }
  var formatHex = { exports: {} };
  var hasRequiredFormatHex;
  function requireFormatHex() {
    if (hasRequiredFormatHex) return formatHex.exports;
    hasRequiredFormatHex = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(undefined$1) {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C.enc;
          var Hex = C_enc.Hex;
          var C_format = C.format;
          C_format.Hex = {
            /**
             * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The hexadecimally encoded string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },
            /**
             * Converts a hexadecimally encoded ciphertext string to a cipher params object.
             *
             * @param {string} input The hexadecimally encoded string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
             */
            parse: function(input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({ ciphertext });
            }
          };
        })();
        return CryptoJS2.format.Hex;
      });
    })(formatHex);
    return formatHex.exports;
  }
  var aes = { exports: {} };
  var hasRequiredAes;
  function requireAes() {
    if (hasRequiredAes) return aes.exports;
    hasRequiredAes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var SBOX = [];
          var INV_SBOX = [];
          var SUB_MIX_0 = [];
          var SUB_MIX_1 = [];
          var SUB_MIX_2 = [];
          var SUB_MIX_3 = [];
          var INV_SUB_MIX_0 = [];
          var INV_SUB_MIX_1 = [];
          var INV_SUB_MIX_2 = [];
          var INV_SUB_MIX_3 = [];
          (function() {
            var d = [];
            for (var i = 0; i < 256; i++) {
              if (i < 128) {
                d[i] = i << 1;
              } else {
                d[i] = i << 1 ^ 283;
              }
            }
            var x = 0;
            var xi = 0;
            for (var i = 0; i < 256; i++) {
              var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
              sx = sx >>> 8 ^ sx & 255 ^ 99;
              SBOX[x] = sx;
              INV_SBOX[sx] = x;
              var x2 = d[x];
              var x4 = d[x2];
              var x8 = d[x4];
              var t = d[sx] * 257 ^ sx * 16843008;
              SUB_MIX_0[x] = t << 24 | t >>> 8;
              SUB_MIX_1[x] = t << 16 | t >>> 16;
              SUB_MIX_2[x] = t << 8 | t >>> 24;
              SUB_MIX_3[x] = t;
              var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
              INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
              INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
              INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
              INV_SUB_MIX_3[sx] = t;
              if (!x) {
                x = xi = 1;
              } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
              }
            }
          })();
          var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
          var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function() {
              var t;
              if (this._nRounds && this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              var nRounds = this._nRounds = keySize + 6;
              var ksRows = (nRounds + 1) * 4;
              var keySchedule = this._keySchedule = [];
              for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                  keySchedule[ksRow] = keyWords[ksRow];
                } else {
                  t = keySchedule[ksRow - 1];
                  if (!(ksRow % keySize)) {
                    t = t << 8 | t >>> 24;
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                    t ^= RCON[ksRow / keySize | 0] << 24;
                  } else if (keySize > 6 && ksRow % keySize == 4) {
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                  }
                  keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
              }
              var invKeySchedule = this._invKeySchedule = [];
              for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;
                if (invKsRow % 4) {
                  var t = keySchedule[ksRow];
                } else {
                  var t = keySchedule[ksRow - 4];
                }
                if (invKsRow < 4 || ksRow <= 4) {
                  invKeySchedule[invKsRow] = t;
                } else {
                  invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
                }
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },
            decryptBlock: function(M, offset) {
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
              this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
            },
            _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
              var nRounds = this._nRounds;
              var s0 = M[offset] ^ keySchedule[0];
              var s1 = M[offset + 1] ^ keySchedule[1];
              var s2 = M[offset + 2] ^ keySchedule[2];
              var s3 = M[offset + 3] ^ keySchedule[3];
              var ksRow = 4;
              for (var round = 1; round < nRounds; round++) {
                var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
              }
              var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
              var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
              var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
              var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
              M[offset] = t0;
              M[offset + 1] = t1;
              M[offset + 2] = t2;
              M[offset + 3] = t3;
            },
            keySize: 256 / 32
          });
          C.AES = BlockCipher._createHelper(AES);
        })();
        return CryptoJS2.AES;
      });
    })(aes);
    return aes.exports;
  }
  var tripledes = { exports: {} };
  var hasRequiredTripledes;
  function requireTripledes() {
    if (hasRequiredTripledes) return tripledes.exports;
    hasRequiredTripledes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var PC1 = [
            57,
            49,
            41,
            33,
            25,
            17,
            9,
            1,
            58,
            50,
            42,
            34,
            26,
            18,
            10,
            2,
            59,
            51,
            43,
            35,
            27,
            19,
            11,
            3,
            60,
            52,
            44,
            36,
            63,
            55,
            47,
            39,
            31,
            23,
            15,
            7,
            62,
            54,
            46,
            38,
            30,
            22,
            14,
            6,
            61,
            53,
            45,
            37,
            29,
            21,
            13,
            5,
            28,
            20,
            12,
            4
          ];
          var PC2 = [
            14,
            17,
            11,
            24,
            1,
            5,
            3,
            28,
            15,
            6,
            21,
            10,
            23,
            19,
            12,
            4,
            26,
            8,
            16,
            7,
            27,
            20,
            13,
            2,
            41,
            52,
            31,
            37,
            47,
            55,
            30,
            40,
            51,
            45,
            33,
            48,
            44,
            49,
            39,
            56,
            34,
            53,
            46,
            42,
            50,
            36,
            29,
            32
          ];
          var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
          var SBOX_P = [
            {
              0: 8421888,
              268435456: 32768,
              536870912: 8421378,
              805306368: 2,
              1073741824: 512,
              1342177280: 8421890,
              1610612736: 8389122,
              1879048192: 8388608,
              2147483648: 514,
              2415919104: 8389120,
              2684354560: 33280,
              2952790016: 8421376,
              3221225472: 32770,
              3489660928: 8388610,
              3758096384: 0,
              4026531840: 33282,
              134217728: 0,
              402653184: 8421890,
              671088640: 33282,
              939524096: 32768,
              1207959552: 8421888,
              1476395008: 512,
              1744830464: 8421378,
              2013265920: 2,
              2281701376: 8389120,
              2550136832: 33280,
              2818572288: 8421376,
              3087007744: 8389122,
              3355443200: 8388610,
              3623878656: 32770,
              3892314112: 514,
              4160749568: 8388608,
              1: 32768,
              268435457: 2,
              536870913: 8421888,
              805306369: 8388608,
              1073741825: 8421378,
              1342177281: 33280,
              1610612737: 512,
              1879048193: 8389122,
              2147483649: 8421890,
              2415919105: 8421376,
              2684354561: 8388610,
              2952790017: 33282,
              3221225473: 514,
              3489660929: 8389120,
              3758096385: 32770,
              4026531841: 0,
              134217729: 8421890,
              402653185: 8421376,
              671088641: 8388608,
              939524097: 512,
              1207959553: 32768,
              1476395009: 8388610,
              1744830465: 2,
              2013265921: 33282,
              2281701377: 32770,
              2550136833: 8389122,
              2818572289: 514,
              3087007745: 8421888,
              3355443201: 8389120,
              3623878657: 0,
              3892314113: 33280,
              4160749569: 8421378
            },
            {
              0: 1074282512,
              16777216: 16384,
              33554432: 524288,
              50331648: 1074266128,
              67108864: 1073741840,
              83886080: 1074282496,
              100663296: 1073758208,
              117440512: 16,
              134217728: 540672,
              150994944: 1073758224,
              167772160: 1073741824,
              184549376: 540688,
              201326592: 524304,
              218103808: 0,
              234881024: 16400,
              251658240: 1074266112,
              8388608: 1073758208,
              25165824: 540688,
              41943040: 16,
              58720256: 1073758224,
              75497472: 1074282512,
              92274688: 1073741824,
              109051904: 524288,
              125829120: 1074266128,
              142606336: 524304,
              159383552: 0,
              176160768: 16384,
              192937984: 1074266112,
              209715200: 1073741840,
              226492416: 540672,
              243269632: 1074282496,
              260046848: 16400,
              268435456: 0,
              285212672: 1074266128,
              301989888: 1073758224,
              318767104: 1074282496,
              335544320: 1074266112,
              352321536: 16,
              369098752: 540688,
              385875968: 16384,
              402653184: 16400,
              419430400: 524288,
              436207616: 524304,
              452984832: 1073741840,
              469762048: 540672,
              486539264: 1073758208,
              503316480: 1073741824,
              520093696: 1074282512,
              276824064: 540688,
              293601280: 524288,
              310378496: 1074266112,
              327155712: 16384,
              343932928: 1073758208,
              360710144: 1074282512,
              377487360: 16,
              394264576: 1073741824,
              411041792: 1074282496,
              427819008: 1073741840,
              444596224: 1073758224,
              461373440: 524304,
              478150656: 0,
              494927872: 16400,
              511705088: 1074266128,
              528482304: 540672
            },
            {
              0: 260,
              1048576: 0,
              2097152: 67109120,
              3145728: 65796,
              4194304: 65540,
              5242880: 67108868,
              6291456: 67174660,
              7340032: 67174400,
              8388608: 67108864,
              9437184: 67174656,
              10485760: 65792,
              11534336: 67174404,
              12582912: 67109124,
              13631488: 65536,
              14680064: 4,
              15728640: 256,
              524288: 67174656,
              1572864: 67174404,
              2621440: 0,
              3670016: 67109120,
              4718592: 67108868,
              5767168: 65536,
              6815744: 65540,
              7864320: 260,
              8912896: 4,
              9961472: 256,
              11010048: 67174400,
              12058624: 65796,
              13107200: 65792,
              14155776: 67109124,
              15204352: 67174660,
              16252928: 67108864,
              16777216: 67174656,
              17825792: 65540,
              18874368: 65536,
              19922944: 67109120,
              20971520: 256,
              22020096: 67174660,
              23068672: 67108868,
              24117248: 0,
              25165824: 67109124,
              26214400: 67108864,
              27262976: 4,
              28311552: 65792,
              29360128: 67174400,
              30408704: 260,
              31457280: 65796,
              32505856: 67174404,
              17301504: 67108864,
              18350080: 260,
              19398656: 67174656,
              20447232: 0,
              21495808: 65540,
              22544384: 67109120,
              23592960: 256,
              24641536: 67174404,
              25690112: 65536,
              26738688: 67174660,
              27787264: 65796,
              28835840: 67108868,
              29884416: 67109124,
              30932992: 67174400,
              31981568: 4,
              33030144: 65792
            },
            {
              0: 2151682048,
              65536: 2147487808,
              131072: 4198464,
              196608: 2151677952,
              262144: 0,
              327680: 4198400,
              393216: 2147483712,
              458752: 4194368,
              524288: 2147483648,
              589824: 4194304,
              655360: 64,
              720896: 2147487744,
              786432: 2151678016,
              851968: 4160,
              917504: 4096,
              983040: 2151682112,
              32768: 2147487808,
              98304: 64,
              163840: 2151678016,
              229376: 2147487744,
              294912: 4198400,
              360448: 2151682112,
              425984: 0,
              491520: 2151677952,
              557056: 4096,
              622592: 2151682048,
              688128: 4194304,
              753664: 4160,
              819200: 2147483648,
              884736: 4194368,
              950272: 4198464,
              1015808: 2147483712,
              1048576: 4194368,
              1114112: 4198400,
              1179648: 2147483712,
              1245184: 0,
              1310720: 4160,
              1376256: 2151678016,
              1441792: 2151682048,
              1507328: 2147487808,
              1572864: 2151682112,
              1638400: 2147483648,
              1703936: 2151677952,
              1769472: 4198464,
              1835008: 2147487744,
              1900544: 4194304,
              1966080: 64,
              2031616: 4096,
              1081344: 2151677952,
              1146880: 2151682112,
              1212416: 0,
              1277952: 4198400,
              1343488: 4194368,
              1409024: 2147483648,
              1474560: 2147487808,
              1540096: 64,
              1605632: 2147483712,
              1671168: 4096,
              1736704: 2147487744,
              1802240: 2151678016,
              1867776: 4160,
              1933312: 2151682048,
              1998848: 4194304,
              2064384: 4198464
            },
            {
              0: 128,
              4096: 17039360,
              8192: 262144,
              12288: 536870912,
              16384: 537133184,
              20480: 16777344,
              24576: 553648256,
              28672: 262272,
              32768: 16777216,
              36864: 537133056,
              40960: 536871040,
              45056: 553910400,
              49152: 553910272,
              53248: 0,
              57344: 17039488,
              61440: 553648128,
              2048: 17039488,
              6144: 553648256,
              10240: 128,
              14336: 17039360,
              18432: 262144,
              22528: 537133184,
              26624: 553910272,
              30720: 536870912,
              34816: 537133056,
              38912: 0,
              43008: 553910400,
              47104: 16777344,
              51200: 536871040,
              55296: 553648128,
              59392: 16777216,
              63488: 262272,
              65536: 262144,
              69632: 128,
              73728: 536870912,
              77824: 553648256,
              81920: 16777344,
              86016: 553910272,
              90112: 537133184,
              94208: 16777216,
              98304: 553910400,
              102400: 553648128,
              106496: 17039360,
              110592: 537133056,
              114688: 262272,
              118784: 536871040,
              122880: 0,
              126976: 17039488,
              67584: 553648256,
              71680: 16777216,
              75776: 17039360,
              79872: 537133184,
              83968: 536870912,
              88064: 17039488,
              92160: 128,
              96256: 553910272,
              100352: 262272,
              104448: 553910400,
              108544: 0,
              112640: 553648128,
              116736: 16777344,
              120832: 262144,
              124928: 537133056,
              129024: 536871040
            },
            {
              0: 268435464,
              256: 8192,
              512: 270532608,
              768: 270540808,
              1024: 268443648,
              1280: 2097152,
              1536: 2097160,
              1792: 268435456,
              2048: 0,
              2304: 268443656,
              2560: 2105344,
              2816: 8,
              3072: 270532616,
              3328: 2105352,
              3584: 8200,
              3840: 270540800,
              128: 270532608,
              384: 270540808,
              640: 8,
              896: 2097152,
              1152: 2105352,
              1408: 268435464,
              1664: 268443648,
              1920: 8200,
              2176: 2097160,
              2432: 8192,
              2688: 268443656,
              2944: 270532616,
              3200: 0,
              3456: 270540800,
              3712: 2105344,
              3968: 268435456,
              4096: 268443648,
              4352: 270532616,
              4608: 270540808,
              4864: 8200,
              5120: 2097152,
              5376: 268435456,
              5632: 268435464,
              5888: 2105344,
              6144: 2105352,
              6400: 0,
              6656: 8,
              6912: 270532608,
              7168: 8192,
              7424: 268443656,
              7680: 270540800,
              7936: 2097160,
              4224: 8,
              4480: 2105344,
              4736: 2097152,
              4992: 268435464,
              5248: 268443648,
              5504: 8200,
              5760: 270540808,
              6016: 270532608,
              6272: 270540800,
              6528: 270532616,
              6784: 8192,
              7040: 2105352,
              7296: 2097160,
              7552: 0,
              7808: 268435456,
              8064: 268443656
            },
            {
              0: 1048576,
              16: 33555457,
              32: 1024,
              48: 1049601,
              64: 34604033,
              80: 0,
              96: 1,
              112: 34603009,
              128: 33555456,
              144: 1048577,
              160: 33554433,
              176: 34604032,
              192: 34603008,
              208: 1025,
              224: 1049600,
              240: 33554432,
              8: 34603009,
              24: 0,
              40: 33555457,
              56: 34604032,
              72: 1048576,
              88: 33554433,
              104: 33554432,
              120: 1025,
              136: 1049601,
              152: 33555456,
              168: 34603008,
              184: 1048577,
              200: 1024,
              216: 34604033,
              232: 1,
              248: 1049600,
              256: 33554432,
              272: 1048576,
              288: 33555457,
              304: 34603009,
              320: 1048577,
              336: 33555456,
              352: 34604032,
              368: 1049601,
              384: 1025,
              400: 34604033,
              416: 1049600,
              432: 1,
              448: 0,
              464: 34603008,
              480: 33554433,
              496: 1024,
              264: 1049600,
              280: 33555457,
              296: 34603009,
              312: 1,
              328: 33554432,
              344: 1048576,
              360: 1025,
              376: 34604032,
              392: 33554433,
              408: 34603008,
              424: 0,
              440: 34604033,
              456: 1049601,
              472: 1024,
              488: 33555456,
              504: 1048577
            },
            {
              0: 134219808,
              1: 131072,
              2: 134217728,
              3: 32,
              4: 131104,
              5: 134350880,
              6: 134350848,
              7: 2048,
              8: 134348800,
              9: 134219776,
              10: 133120,
              11: 134348832,
              12: 2080,
              13: 0,
              14: 134217760,
              15: 133152,
              2147483648: 2048,
              2147483649: 134350880,
              2147483650: 134219808,
              2147483651: 134217728,
              2147483652: 134348800,
              2147483653: 133120,
              2147483654: 133152,
              2147483655: 32,
              2147483656: 134217760,
              2147483657: 2080,
              2147483658: 131104,
              2147483659: 134350848,
              2147483660: 0,
              2147483661: 134348832,
              2147483662: 134219776,
              2147483663: 131072,
              16: 133152,
              17: 134350848,
              18: 32,
              19: 2048,
              20: 134219776,
              21: 134217760,
              22: 134348832,
              23: 131072,
              24: 0,
              25: 131104,
              26: 134348800,
              27: 134219808,
              28: 134350880,
              29: 133120,
              30: 2080,
              31: 134217728,
              2147483664: 131072,
              2147483665: 2048,
              2147483666: 134348832,
              2147483667: 133152,
              2147483668: 32,
              2147483669: 134348800,
              2147483670: 134217728,
              2147483671: 134219808,
              2147483672: 134350880,
              2147483673: 134217760,
              2147483674: 134219776,
              2147483675: 0,
              2147483676: 133120,
              2147483677: 2080,
              2147483678: 131104,
              2147483679: 134350848
            }
          ];
          var SBOX_MASK = [
            4160749569,
            528482304,
            33030144,
            2064384,
            129024,
            8064,
            504,
            2147483679
          ];
          var DES = C_algo.DES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keyBits = [];
              for (var i = 0; i < 56; i++) {
                var keyBitPos = PC1[i] - 1;
                keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
              }
              var subKeys = this._subKeys = [];
              for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                var subKey = subKeys[nSubKey] = [];
                var bitShift = BIT_SHIFTS[nSubKey];
                for (var i = 0; i < 24; i++) {
                  subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;
                  subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
                }
                subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
                for (var i = 1; i < 7; i++) {
                  subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
                }
                subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
              }
              var invSubKeys = this._invSubKeys = [];
              for (var i = 0; i < 16; i++) {
                invSubKeys[i] = subKeys[15 - i];
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._subKeys);
            },
            decryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._invSubKeys);
            },
            _doCryptBlock: function(M, offset, subKeys) {
              this._lBlock = M[offset];
              this._rBlock = M[offset + 1];
              exchangeLR.call(this, 4, 252645135);
              exchangeLR.call(this, 16, 65535);
              exchangeRL.call(this, 2, 858993459);
              exchangeRL.call(this, 8, 16711935);
              exchangeLR.call(this, 1, 1431655765);
              for (var round = 0; round < 16; round++) {
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock;
                var f2 = 0;
                for (var i = 0; i < 8; i++) {
                  f2 |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f2;
              }
              var t = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = t;
              exchangeLR.call(this, 1, 1431655765);
              exchangeRL.call(this, 8, 16711935);
              exchangeRL.call(this, 2, 858993459);
              exchangeLR.call(this, 16, 65535);
              exchangeLR.call(this, 4, 252645135);
              M[offset] = this._lBlock;
              M[offset + 1] = this._rBlock;
            },
            keySize: 64 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          function exchangeLR(offset, mask) {
            var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
            this._rBlock ^= t;
            this._lBlock ^= t << offset;
          }
          function exchangeRL(offset, mask) {
            var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
            this._lBlock ^= t;
            this._rBlock ^= t << offset;
          }
          C.DES = BlockCipher._createHelper(DES);
          var TripleDES = C_algo.TripleDES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
              }
              var key1 = keyWords.slice(0, 2);
              var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
              var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
              this._des1 = DES.createEncryptor(WordArray.create(key1));
              this._des2 = DES.createEncryptor(WordArray.create(key2));
              this._des3 = DES.createEncryptor(WordArray.create(key3));
            },
            encryptBlock: function(M, offset) {
              this._des1.encryptBlock(M, offset);
              this._des2.decryptBlock(M, offset);
              this._des3.encryptBlock(M, offset);
            },
            decryptBlock: function(M, offset) {
              this._des3.decryptBlock(M, offset);
              this._des2.encryptBlock(M, offset);
              this._des1.decryptBlock(M, offset);
            },
            keySize: 192 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          C.TripleDES = BlockCipher._createHelper(TripleDES);
        })();
        return CryptoJS2.TripleDES;
      });
    })(tripledes);
    return tripledes.exports;
  }
  var rc4 = { exports: {} };
  var hasRequiredRc4;
  function requireRc4() {
    if (hasRequiredRc4) return rc4.exports;
    hasRequiredRc4 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var RC4 = C_algo.RC4 = StreamCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keySigBytes = key.sigBytes;
              var S = this._S = [];
              for (var i = 0; i < 256; i++) {
                S[i] = i;
              }
              for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
                j = (j + S[i] + keyByte) % 256;
                var t = S[i];
                S[i] = S[j];
                S[j] = t;
              }
              this._i = this._j = 0;
            },
            _doProcessBlock: function(M, offset) {
              M[offset] ^= generateKeystreamWord.call(this);
            },
            keySize: 256 / 32,
            ivSize: 0
          });
          function generateKeystreamWord() {
            var S = this._S;
            var i = this._i;
            var j = this._j;
            var keystreamWord = 0;
            for (var n2 = 0; n2 < 4; n2++) {
              i = (i + 1) % 256;
              j = (j + S[i]) % 256;
              var t = S[i];
              S[i] = S[j];
              S[j] = t;
              keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n2 * 8;
            }
            this._i = i;
            this._j = j;
            return keystreamWord;
          }
          C.RC4 = StreamCipher._createHelper(RC4);
          var RC4Drop = C_algo.RC4Drop = RC4.extend({
            /**
             * Configuration options.
             *
             * @property {number} drop The number of keystream words to drop. Default 192
             */
            cfg: RC4.cfg.extend({
              drop: 192
            }),
            _doReset: function() {
              RC4._doReset.call(this);
              for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
              }
            }
          });
          C.RC4Drop = StreamCipher._createHelper(RC4Drop);
        })();
        return CryptoJS2.RC4;
      });
    })(rc4);
    return rc4.exports;
  }
  var rabbit = { exports: {} };
  var hasRequiredRabbit;
  function requireRabbit() {
    if (hasRequiredRabbit) return rabbit.exports;
    hasRequiredRabbit = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var Rabbit = C_algo.Rabbit = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              for (var i = 0; i < 4; i++) {
                K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
              }
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
              for (var i = 0; i < 8; i++) {
                C2[i] ^= X[i + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i2 & 4294901760;
                var i3 = i2 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i2;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i2;
                C2[7] ^= i3;
                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i = 0; i < 4; i++) {
                S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i = 0; i < 8; i++) {
              C_[i] = C2[i];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C2[i];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.Rabbit = StreamCipher._createHelper(Rabbit);
        })();
        return CryptoJS2.Rabbit;
      });
    })(rabbit);
    return rabbit.exports;
  }
  var rabbitLegacy = { exports: {} };
  var hasRequiredRabbitLegacy;
  function requireRabbitLegacy() {
    if (hasRequiredRabbitLegacy) return rabbitLegacy.exports;
    hasRequiredRabbitLegacy = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
              for (var i = 0; i < 8; i++) {
                C2[i] ^= X[i + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i2 & 4294901760;
                var i3 = i2 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i2;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i2;
                C2[7] ^= i3;
                for (var i = 0; i < 4; i++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i = 0; i < 4; i++) {
                S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
                M[offset + i] ^= S[i];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i = 0; i < 8; i++) {
              C_[i] = C2[i];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i = 0; i < 8; i++) {
              var gx = X[i] + C2[i];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        })();
        return CryptoJS2.RabbitLegacy;
      });
    })(rabbitLegacy);
    return rabbitLegacy.exports;
  }
  var blowfish = { exports: {} };
  var hasRequiredBlowfish;
  function requireBlowfish() {
    if (hasRequiredBlowfish) return blowfish.exports;
    hasRequiredBlowfish = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C = CryptoJS2;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          const N = 16;
          const ORIG_P = [
            608135816,
            2242054355,
            320440878,
            57701188,
            2752067618,
            698298832,
            137296536,
            3964562569,
            1160258022,
            953160567,
            3193202383,
            887688300,
            3232508343,
            3380367581,
            1065670069,
            3041331479,
            2450970073,
            2306472731
          ];
          const ORIG_S = [
            [
              3509652390,
              2564797868,
              805139163,
              3491422135,
              3101798381,
              1780907670,
              3128725573,
              4046225305,
              614570311,
              3012652279,
              134345442,
              2240740374,
              1667834072,
              1901547113,
              2757295779,
              4103290238,
              227898511,
              1921955416,
              1904987480,
              2182433518,
              2069144605,
              3260701109,
              2620446009,
              720527379,
              3318853667,
              677414384,
              3393288472,
              3101374703,
              2390351024,
              1614419982,
              1822297739,
              2954791486,
              3608508353,
              3174124327,
              2024746970,
              1432378464,
              3864339955,
              2857741204,
              1464375394,
              1676153920,
              1439316330,
              715854006,
              3033291828,
              289532110,
              2706671279,
              2087905683,
              3018724369,
              1668267050,
              732546397,
              1947742710,
              3462151702,
              2609353502,
              2950085171,
              1814351708,
              2050118529,
              680887927,
              999245976,
              1800124847,
              3300911131,
              1713906067,
              1641548236,
              4213287313,
              1216130144,
              1575780402,
              4018429277,
              3917837745,
              3693486850,
              3949271944,
              596196993,
              3549867205,
              258830323,
              2213823033,
              772490370,
              2760122372,
              1774776394,
              2652871518,
              566650946,
              4142492826,
              1728879713,
              2882767088,
              1783734482,
              3629395816,
              2517608232,
              2874225571,
              1861159788,
              326777828,
              3124490320,
              2130389656,
              2716951837,
              967770486,
              1724537150,
              2185432712,
              2364442137,
              1164943284,
              2105845187,
              998989502,
              3765401048,
              2244026483,
              1075463327,
              1455516326,
              1322494562,
              910128902,
              469688178,
              1117454909,
              936433444,
              3490320968,
              3675253459,
              1240580251,
              122909385,
              2157517691,
              634681816,
              4142456567,
              3825094682,
              3061402683,
              2540495037,
              79693498,
              3249098678,
              1084186820,
              1583128258,
              426386531,
              1761308591,
              1047286709,
              322548459,
              995290223,
              1845252383,
              2603652396,
              3431023940,
              2942221577,
              3202600964,
              3727903485,
              1712269319,
              422464435,
              3234572375,
              1170764815,
              3523960633,
              3117677531,
              1434042557,
              442511882,
              3600875718,
              1076654713,
              1738483198,
              4213154764,
              2393238008,
              3677496056,
              1014306527,
              4251020053,
              793779912,
              2902807211,
              842905082,
              4246964064,
              1395751752,
              1040244610,
              2656851899,
              3396308128,
              445077038,
              3742853595,
              3577915638,
              679411651,
              2892444358,
              2354009459,
              1767581616,
              3150600392,
              3791627101,
              3102740896,
              284835224,
              4246832056,
              1258075500,
              768725851,
              2589189241,
              3069724005,
              3532540348,
              1274779536,
              3789419226,
              2764799539,
              1660621633,
              3471099624,
              4011903706,
              913787905,
              3497959166,
              737222580,
              2514213453,
              2928710040,
              3937242737,
              1804850592,
              3499020752,
              2949064160,
              2386320175,
              2390070455,
              2415321851,
              4061277028,
              2290661394,
              2416832540,
              1336762016,
              1754252060,
              3520065937,
              3014181293,
              791618072,
              3188594551,
              3933548030,
              2332172193,
              3852520463,
              3043980520,
              413987798,
              3465142937,
              3030929376,
              4245938359,
              2093235073,
              3534596313,
              375366246,
              2157278981,
              2479649556,
              555357303,
              3870105701,
              2008414854,
              3344188149,
              4221384143,
              3956125452,
              2067696032,
              3594591187,
              2921233993,
              2428461,
              544322398,
              577241275,
              1471733935,
              610547355,
              4027169054,
              1432588573,
              1507829418,
              2025931657,
              3646575487,
              545086370,
              48609733,
              2200306550,
              1653985193,
              298326376,
              1316178497,
              3007786442,
              2064951626,
              458293330,
              2589141269,
              3591329599,
              3164325604,
              727753846,
              2179363840,
              146436021,
              1461446943,
              4069977195,
              705550613,
              3059967265,
              3887724982,
              4281599278,
              3313849956,
              1404054877,
              2845806497,
              146425753,
              1854211946
            ],
            [
              1266315497,
              3048417604,
              3681880366,
              3289982499,
              290971e4,
              1235738493,
              2632868024,
              2414719590,
              3970600049,
              1771706367,
              1449415276,
              3266420449,
              422970021,
              1963543593,
              2690192192,
              3826793022,
              1062508698,
              1531092325,
              1804592342,
              2583117782,
              2714934279,
              4024971509,
              1294809318,
              4028980673,
              1289560198,
              2221992742,
              1669523910,
              35572830,
              157838143,
              1052438473,
              1016535060,
              1802137761,
              1753167236,
              1386275462,
              3080475397,
              2857371447,
              1040679964,
              2145300060,
              2390574316,
              1461121720,
              2956646967,
              4031777805,
              4028374788,
              33600511,
              2920084762,
              1018524850,
              629373528,
              3691585981,
              3515945977,
              2091462646,
              2486323059,
              586499841,
              988145025,
              935516892,
              3367335476,
              2599673255,
              2839830854,
              265290510,
              3972581182,
              2759138881,
              3795373465,
              1005194799,
              847297441,
              406762289,
              1314163512,
              1332590856,
              1866599683,
              4127851711,
              750260880,
              613907577,
              1450815602,
              3165620655,
              3734664991,
              3650291728,
              3012275730,
              3704569646,
              1427272223,
              778793252,
              1343938022,
              2676280711,
              2052605720,
              1946737175,
              3164576444,
              3914038668,
              3967478842,
              3682934266,
              1661551462,
              3294938066,
              4011595847,
              840292616,
              3712170807,
              616741398,
              312560963,
              711312465,
              1351876610,
              322626781,
              1910503582,
              271666773,
              2175563734,
              1594956187,
              70604529,
              3617834859,
              1007753275,
              1495573769,
              4069517037,
              2549218298,
              2663038764,
              504708206,
              2263041392,
              3941167025,
              2249088522,
              1514023603,
              1998579484,
              1312622330,
              694541497,
              2582060303,
              2151582166,
              1382467621,
              776784248,
              2618340202,
              3323268794,
              2497899128,
              2784771155,
              503983604,
              4076293799,
              907881277,
              423175695,
              432175456,
              1378068232,
              4145222326,
              3954048622,
              3938656102,
              3820766613,
              2793130115,
              2977904593,
              26017576,
              3274890735,
              3194772133,
              1700274565,
              1756076034,
              4006520079,
              3677328699,
              720338349,
              1533947780,
              354530856,
              688349552,
              3973924725,
              1637815568,
              332179504,
              3949051286,
              53804574,
              2852348879,
              3044236432,
              1282449977,
              3583942155,
              3416972820,
              4006381244,
              1617046695,
              2628476075,
              3002303598,
              1686838959,
              431878346,
              2686675385,
              1700445008,
              1080580658,
              1009431731,
              832498133,
              3223435511,
              2605976345,
              2271191193,
              2516031870,
              1648197032,
              4164389018,
              2548247927,
              300782431,
              375919233,
              238389289,
              3353747414,
              2531188641,
              2019080857,
              1475708069,
              455242339,
              2609103871,
              448939670,
              3451063019,
              1395535956,
              2413381860,
              1841049896,
              1491858159,
              885456874,
              4264095073,
              4001119347,
              1565136089,
              3898914787,
              1108368660,
              540939232,
              1173283510,
              2745871338,
              3681308437,
              4207628240,
              3343053890,
              4016749493,
              1699691293,
              1103962373,
              3625875870,
              2256883143,
              3830138730,
              1031889488,
              3479347698,
              1535977030,
              4236805024,
              3251091107,
              2132092099,
              1774941330,
              1199868427,
              1452454533,
              157007616,
              2904115357,
              342012276,
              595725824,
              1480756522,
              206960106,
              497939518,
              591360097,
              863170706,
              2375253569,
              3596610801,
              1814182875,
              2094937945,
              3421402208,
              1082520231,
              3463918190,
              2785509508,
              435703966,
              3908032597,
              1641649973,
              2842273706,
              3305899714,
              1510255612,
              2148256476,
              2655287854,
              3276092548,
              4258621189,
              236887753,
              3681803219,
              274041037,
              1734335097,
              3815195456,
              3317970021,
              1899903192,
              1026095262,
              4050517792,
              356393447,
              2410691914,
              3873677099,
              3682840055
            ],
            [
              3913112168,
              2491498743,
              4132185628,
              2489919796,
              1091903735,
              1979897079,
              3170134830,
              3567386728,
              3557303409,
              857797738,
              1136121015,
              1342202287,
              507115054,
              2535736646,
              337727348,
              3213592640,
              1301675037,
              2528481711,
              1895095763,
              1721773893,
              3216771564,
              62756741,
              2142006736,
              835421444,
              2531993523,
              1442658625,
              3659876326,
              2882144922,
              676362277,
              1392781812,
              170690266,
              3921047035,
              1759253602,
              3611846912,
              1745797284,
              664899054,
              1329594018,
              3901205900,
              3045908486,
              2062866102,
              2865634940,
              3543621612,
              3464012697,
              1080764994,
              553557557,
              3656615353,
              3996768171,
              991055499,
              499776247,
              1265440854,
              648242737,
              3940784050,
              980351604,
              3713745714,
              1749149687,
              3396870395,
              4211799374,
              3640570775,
              1161844396,
              3125318951,
              1431517754,
              545492359,
              4268468663,
              3499529547,
              1437099964,
              2702547544,
              3433638243,
              2581715763,
              2787789398,
              1060185593,
              1593081372,
              2418618748,
              4260947970,
              69676912,
              2159744348,
              86519011,
              2512459080,
              3838209314,
              1220612927,
              3339683548,
              133810670,
              1090789135,
              1078426020,
              1569222167,
              845107691,
              3583754449,
              4072456591,
              1091646820,
              628848692,
              1613405280,
              3757631651,
              526609435,
              236106946,
              48312990,
              2942717905,
              3402727701,
              1797494240,
              859738849,
              992217954,
              4005476642,
              2243076622,
              3870952857,
              3732016268,
              765654824,
              3490871365,
              2511836413,
              1685915746,
              3888969200,
              1414112111,
              2273134842,
              3281911079,
              4080962846,
              172450625,
              2569994100,
              980381355,
              4109958455,
              2819808352,
              2716589560,
              2568741196,
              3681446669,
              3329971472,
              1835478071,
              660984891,
              3704678404,
              4045999559,
              3422617507,
              3040415634,
              1762651403,
              1719377915,
              3470491036,
              2693910283,
              3642056355,
              3138596744,
              1364962596,
              2073328063,
              1983633131,
              926494387,
              3423689081,
              2150032023,
              4096667949,
              1749200295,
              3328846651,
              309677260,
              2016342300,
              1779581495,
              3079819751,
              111262694,
              1274766160,
              443224088,
              298511866,
              1025883608,
              3806446537,
              1145181785,
              168956806,
              3641502830,
              3584813610,
              1689216846,
              3666258015,
              3200248200,
              1692713982,
              2646376535,
              4042768518,
              1618508792,
              1610833997,
              3523052358,
              4130873264,
              2001055236,
              3610705100,
              2202168115,
              4028541809,
              2961195399,
              1006657119,
              2006996926,
              3186142756,
              1430667929,
              3210227297,
              1314452623,
              4074634658,
              4101304120,
              2273951170,
              1399257539,
              3367210612,
              3027628629,
              1190975929,
              2062231137,
              2333990788,
              2221543033,
              2438960610,
              1181637006,
              548689776,
              2362791313,
              3372408396,
              3104550113,
              3145860560,
              296247880,
              1970579870,
              3078560182,
              3769228297,
              1714227617,
              3291629107,
              3898220290,
              166772364,
              1251581989,
              493813264,
              448347421,
              195405023,
              2709975567,
              677966185,
              3703036547,
              1463355134,
              2715995803,
              1338867538,
              1343315457,
              2802222074,
              2684532164,
              233230375,
              2599980071,
              2000651841,
              3277868038,
              1638401717,
              4028070440,
              3237316320,
              6314154,
              819756386,
              300326615,
              590932579,
              1405279636,
              3267499572,
              3150704214,
              2428286686,
              3959192993,
              3461946742,
              1862657033,
              1266418056,
              963775037,
              2089974820,
              2263052895,
              1917689273,
              448879540,
              3550394620,
              3981727096,
              150775221,
              3627908307,
              1303187396,
              508620638,
              2975983352,
              2726630617,
              1817252668,
              1876281319,
              1457606340,
              908771278,
              3720792119,
              3617206836,
              2455994898,
              1729034894,
              1080033504
            ],
            [
              976866871,
              3556439503,
              2881648439,
              1522871579,
              1555064734,
              1336096578,
              3548522304,
              2579274686,
              3574697629,
              3205460757,
              3593280638,
              3338716283,
              3079412587,
              564236357,
              2993598910,
              1781952180,
              1464380207,
              3163844217,
              3332601554,
              1699332808,
              1393555694,
              1183702653,
              3581086237,
              1288719814,
              691649499,
              2847557200,
              2895455976,
              3193889540,
              2717570544,
              1781354906,
              1676643554,
              2592534050,
              3230253752,
              1126444790,
              2770207658,
              2633158820,
              2210423226,
              2615765581,
              2414155088,
              3127139286,
              673620729,
              2805611233,
              1269405062,
              4015350505,
              3341807571,
              4149409754,
              1057255273,
              2012875353,
              2162469141,
              2276492801,
              2601117357,
              993977747,
              3918593370,
              2654263191,
              753973209,
              36408145,
              2530585658,
              25011837,
              3520020182,
              2088578344,
              530523599,
              2918365339,
              1524020338,
              1518925132,
              3760827505,
              3759777254,
              1202760957,
              3985898139,
              3906192525,
              674977740,
              4174734889,
              2031300136,
              2019492241,
              3983892565,
              4153806404,
              3822280332,
              352677332,
              2297720250,
              60907813,
              90501309,
              3286998549,
              1016092578,
              2535922412,
              2839152426,
              457141659,
              509813237,
              4120667899,
              652014361,
              1966332200,
              2975202805,
              55981186,
              2327461051,
              676427537,
              3255491064,
              2882294119,
              3433927263,
              1307055953,
              942726286,
              933058658,
              2468411793,
              3933900994,
              4215176142,
              1361170020,
              2001714738,
              2830558078,
              3274259782,
              1222529897,
              1679025792,
              2729314320,
              3714953764,
              1770335741,
              151462246,
              3013232138,
              1682292957,
              1483529935,
              471910574,
              1539241949,
              458788160,
              3436315007,
              1807016891,
              3718408830,
              978976581,
              1043663428,
              3165965781,
              1927990952,
              4200891579,
              2372276910,
              3208408903,
              3533431907,
              1412390302,
              2931980059,
              4132332400,
              1947078029,
              3881505623,
              4168226417,
              2941484381,
              1077988104,
              1320477388,
              886195818,
              18198404,
              3786409e3,
              2509781533,
              112762804,
              3463356488,
              1866414978,
              891333506,
              18488651,
              661792760,
              1628790961,
              3885187036,
              3141171499,
              876946877,
              2693282273,
              1372485963,
              791857591,
              2686433993,
              3759982718,
              3167212022,
              3472953795,
              2716379847,
              445679433,
              3561995674,
              3504004811,
              3574258232,
              54117162,
              3331405415,
              2381918588,
              3769707343,
              4154350007,
              1140177722,
              4074052095,
              668550556,
              3214352940,
              367459370,
              261225585,
              2610173221,
              4209349473,
              3468074219,
              3265815641,
              314222801,
              3066103646,
              3808782860,
              282218597,
              3406013506,
              3773591054,
              379116347,
              1285071038,
              846784868,
              2669647154,
              3771962079,
              3550491691,
              2305946142,
              453669953,
              1268987020,
              3317592352,
              3279303384,
              3744833421,
              2610507566,
              3859509063,
              266596637,
              3847019092,
              517658769,
              3462560207,
              3443424879,
              370717030,
              4247526661,
              2224018117,
              4143653529,
              4112773975,
              2788324899,
              2477274417,
              1456262402,
              2901442914,
              1517677493,
              1846949527,
              2295493580,
              3734397586,
              2176403920,
              1280348187,
              1908823572,
              3871786941,
              846861322,
              1172426758,
              3287448474,
              3383383037,
              1655181056,
              3139813346,
              901632758,
              1897031941,
              2986607138,
              3066810236,
              3447102507,
              1393639104,
              373351379,
              950779232,
              625454576,
              3124240540,
              4148612726,
              2007998917,
              544563296,
              2244738638,
              2330496472,
              2058025392,
              1291430526,
              424198748,
              50039436,
              29584100,
              3605783033,
              2429876329,
              2791104160,
              1057563949,
              3255363231,
              3075367218,
              3463963227,
              1469046755,
              985887462
            ]
          ];
          var BLOWFISH_CTX = {
            pbox: [],
            sbox: []
          };
          function F(ctx, x) {
            let a = x >> 24 & 255;
            let b = x >> 16 & 255;
            let c = x >> 8 & 255;
            let d = x & 255;
            let y = ctx.sbox[0][a] + ctx.sbox[1][b];
            y = y ^ ctx.sbox[2][c];
            y = y + ctx.sbox[3][d];
            return y;
          }
          function BlowFish_Encrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i = 0; i < N; ++i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[N];
            Xl = Xl ^ ctx.pbox[N + 1];
            return { left: Xl, right: Xr };
          }
          function BlowFish_Decrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i = N + 1; i > 1; --i) {
              Xl = Xl ^ ctx.pbox[i];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[1];
            Xl = Xl ^ ctx.pbox[0];
            return { left: Xl, right: Xr };
          }
          function BlowFishInit(ctx, key, keysize) {
            for (let Row = 0; Row < 4; Row++) {
              ctx.sbox[Row] = [];
              for (let Col = 0; Col < 256; Col++) {
                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
              }
            }
            let keyIndex = 0;
            for (let index = 0; index < N + 2; index++) {
              ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
              keyIndex++;
              if (keyIndex >= keysize) {
                keyIndex = 0;
              }
            }
            let Data1 = 0;
            let Data2 = 0;
            let res = 0;
            for (let i = 0; i < N + 2; i += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.pbox[i] = Data1;
              ctx.pbox[i + 1] = Data2;
            }
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 256; j += 2) {
                res = BlowFish_Encrypt(ctx, Data1, Data2);
                Data1 = res.left;
                Data2 = res.right;
                ctx.sbox[i][j] = Data1;
                ctx.sbox[i][j + 1] = Data2;
              }
            }
            return true;
          }
          var Blowfish = C_algo.Blowfish = BlockCipher.extend({
            _doReset: function() {
              if (this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
            },
            encryptBlock: function(M, offset) {
              var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            decryptBlock: function(M, offset) {
              var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            blockSize: 64 / 32,
            keySize: 128 / 32,
            ivSize: 64 / 32
          });
          C.Blowfish = BlockCipher._createHelper(Blowfish);
        })();
        return CryptoJS2.Blowfish;
      });
    })(blowfish);
    return blowfish.exports;
  }
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      return CryptoJS2;
    });
  })(cryptoJs);
  var cryptoJsExports = cryptoJs.exports;
  const CryptoJS = /* @__PURE__ */ getDefaultExportFromCjs(cryptoJsExports);
  function getAesString(data, key, iv) {
    let keys = CryptoJS.enc.Utf8.parse(key);
    let vis = CryptoJS.enc.Utf8.parse(iv);
    let encrypt = CryptoJS.AES.encrypt(data, keys, {
      iv: vis,
      //iv偏移量 CBC需加偏移量
      mode: CryptoJS.mode.CBC,
      //CBC模式
      // mode: CryptoJS.mode.ECB, //ECB模式
      padding: CryptoJS.pad.Pkcs7
      //padding处理
    });
    return encrypt.toString();
  }
  function getDAesString(encrypted, key, iv) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  var Meter = function(props) {
    var {
      percent = 0,
      // a number between 0 and 1, inclusive
      width = 100,
      // the overall width
      height = 10,
      // the overall height
      rounded = true,
      // if true, use rounded corners
      color = "#0078bc",
      // the fill color
      animate = false,
      // if true, animate when the percent changes
      label = null
      // a label to describe the contents (for accessibility)
    } = props;
    var r = rounded ? Math.ceil(height / 2) : 0;
    var w = percent ? Math.max(height, width * Math.min(percent, 1)) : 0;
    var style = animate ? { "transition": "width 500ms, fill 250ms" } : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width, height, "aria-label": label, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width, height, fill: "#ccc", rx: r, ry: r }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: w, height, fill: color, rx: r, ry: r, style })
    ] });
  };
  const getScretProduct = getAesString(
    "51951",
    "bm9fcHJvZHVjdF9pZF9zY3JldA==",
    12
  );
  const getScretScret = getAesString(
    "4860f345f6c1407197b3d7a80b4faff6",
    "bm9fcHJvZHVjdF9pZF9zY3JldA==",
    13
  );
  function App(props) {
    const { secretKey: secretKey2 } = props;
    const [loadding, setLoading] = require$$0$1.useState(false);
    const [process, setProcess] = require$$0$1.useState(0);
    const [screntCode, setScrentCode] = require$$0$1.useState(0);
    const [totalNum, setTotalNum] = require$$0$1.useState(0);
    const [isGetMp3, setIsGetMp3] = require$$0$1.useState(false);
    const [getQQMusicUrl, setGetQQMusicUrl] = require$$0$1.useState("");
    const [isModalOpen, setModalOpen] = require$$0$1.useState(false);
    const [songStateList, setSongStateList] = require$$0$1.useState([]);
    const [imgUrl, setImgUrl] = require$$0$1.useState(null);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
      setModalOpen(false);
    };
    const getCode = () => {
      fetch(
        `https://www.mxnzp.com/api/remote_config/get?user_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&secret=${getDAesString(
        secretKey2.secret,
        "bm8tcG8td28tbWktbWE=",
        160
      )}&product_id=${getDAesString(
        secretKey2.id,
        "bm8tcG8td28tbWktbWE=",
        120
      )}&app_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&app_secret=${getDAesString(
        secretKey2.appSec,
        "bm8tcG8td28tbWktbWE=",
        190
      )}`
      ).then((response) => response.body).then((rb) => {
        const reader = rb.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          }
        });
      }).then(
        (stream) => (
          // Respond with our stream
          new Response(stream, {
            headers: { "Content-Type": "text/html" }
          }).text()
        )
      ).then((result) => {
        var _a;
        const res = JSON.parse(result);
        const data = JSON.parse((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.productConfig);
        setImgUrl("https://smart-patrol.oss-cn-beijing.aliyuncs.com/files/20250724/17533672549362891.PNG");
        setGetQQMusicUrl(base64ToJson(data == null ? void 0 : data.saveQMusic));
        setTimeout(() => {
          getScret();
        }, 1e3);
      });
    };
    const getScret = () => {
      fetch(
        `https://www.mxnzp.com/api/remote_config/get?user_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&secret=${getDAesString(
        getScretScret,
        "bm9fcHJvZHVjdF9pZF9zY3JldA==",
        13
      )}&product_id=${getDAesString(
        getScretProduct,
        "bm9fcHJvZHVjdF9pZF9zY3JldA==",
        12
      )}&app_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&app_secret=${getDAesString(
        secretKey2.appSec,
        "bm8tcG8td28tbWktbWE=",
        190
      )}`
      ).then((response) => response.body).then((rb) => {
        const reader = rb.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          }
        });
      }).then(
        (stream) => (
          // Respond with our stream
          new Response(stream, {
            headers: { "Content-Type": "text/html" }
          }).text()
        )
      ).then((result) => {
        var _a;
        const res = JSON.parse(result);
        const resData = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.productConfig;
        const scret = JSON.parse(resData);
        setScrentCode(base64ToJson(scret == null ? void 0 : scret.productScret));
      });
    };
    const startDownloadMusic = (bufferToWaveJson) => {
      const addXMLRequestCallback = (callback) => {
        let oldSend = null;
        let i = null;
        if (XMLHttpRequest.callbacks) {
          XMLHttpRequest.callbacks.push(callback);
        } else {
          XMLHttpRequest.callbacks = [callback];
          oldSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.send = function() {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
              XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
          };
        }
      };
      const getsongList = () => {
        var _a, _b;
        const localStorgQQ = localStorage.getItem("qqSonglist");
        const localStorgPlay = localStorage.getItem("playSongData");
        if (window == null ? void 0 : window.songlist) {
          return window == null ? void 0 : window.songlist;
        }
        if (localStorgQQ) {
          return JSON.parse(localStorgQQ);
        }
        if (localStorgPlay) {
          return (_b = (_a = JSON.parse(localStorgPlay)) == null ? void 0 : _a.value) == null ? void 0 : _b.songList;
        }
      };
      const songList = getsongList();
      let processCount = 1;
      setTotalNum(songList == null ? void 0 : songList.length);
      const firstSongDown = localStorage.getItem("firstSongDown");
      if (firstSongDown) {
        const downUrlIne = JSON.parse(firstSongDown);
        const index = songList.findIndex((item) => (item == null ? void 0 : item.mid) === downUrlIne.mid);
        songList[index]["downUrl"] = "https://ws6.stream.qqmusic.qq.com/" + downUrlIne.downUrl;
        setProcess(processCount);
      }
      addXMLRequestCallback((xhr) => {
        xhr.addEventListener("loadend", function() {
          var _a;
          if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseURL.indexOf("cgi-bin/musics.fcg") !== -1) {
              let res = xhr.response;
          if (typeof xhr.response == 'object') {
            res = new TextDecoder().decode(xhr.response)
          }
          let list = JSON.parse(typeof res == 'string' ? res : null);
              // let list = JSON.parse(xhr.response);
              (_a = Object.keys(list)) == null ? void 0 : _a.forEach((item) => {
                var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                const isHasDownList = songList == null ? void 0 : songList.filter((item2) => item2 == null ? void 0 : item2.downUrl);
                if ((isHasDownList == null ? void 0 : isHasDownList.length) <= (songList == null ? void 0 : songList.length)) {
                  if ((_d = (_c = (_b = (_a2 = list[item]) == null ? void 0 : _a2.data) == null ? void 0 : _b.midurlinfo) == null ? void 0 : _c[0]) == null ? void 0 : _d.purl) {
                    const mid = (_h = (_g = (_f = (_e = list[item]) == null ? void 0 : _e.data) == null ? void 0 : _f.midurlinfo) == null ? void 0 : _g[0]) == null ? void 0 : _h.songmid;
                    const index = songList.findIndex((item2) => (item2 == null ? void 0 : item2.mid) === mid);
                    songList[index]["downUrl"] = "https://ws6.stream.qqmusic.qq.com/" + ((_l = (_k = (_j = (_i = list[item]) == null ? void 0 : _i.data) == null ? void 0 : _j.midurlinfo) == null ? void 0 : _k[0]) == null ? void 0 : _l.purl);
                    console.log(songList, "songlist");
                    setProcess(++processCount);
                    const newIsHas = songList == null ? void 0 : songList.filter((item2) => item2 == null ? void 0 : item2.downUrl);
                    if ((newIsHas == null ? void 0 : newIsHas.length) === (songList == null ? void 0 : songList.length)) {
                      setSongStateList(songList);
                      setIsGetMp3(true);
                      setProcess(0);
                      getUrlAndWavToMp3Download(
                        songList,
                        () => {
                          setLoading(false);
                          const body = document.querySelector("#app");
                          body.style.visibility = "visible";
                        },
                        bufferToWaveJson,
                        (processCount2) => {
                          setProcess(processCount2);
                        }
                      );
                    } else {
                      setTimeout(() => {
                        const nextBtn = document.querySelector(
                          ".player__ft .btn_big_next"
                        );
                        nextBtn.click();
                      }, 1e3);
                    }
                  }
                }
              });
            }
          }
        });
      });
    };
    const handleConfirm = (inputValue, screntCode2) => {
      return fetch(
        `https://www.mxnzp.com/api/remote_config/get?user_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&secret=${screntCode2}&product_id=${inputValue}&app_id=${getDAesString(
        secretKey2.appId,
        "bm8tcG8td28tbWktbWE=",
        210
      )}&app_secret=${getDAesString(
        secretKey2.appSec,
        "bm8tcG8td28tbWktbWE=",
        190
      )}`
      ).then((response) => response.body).then((rb) => {
        const reader = rb.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          }
        });
      }).then(
        (stream) => (
          // Respond with our stream
          new Response(stream, {
            headers: { "Content-Type": "text/html" }
          }).text()
        )
      ).then((result) => {
        const res = JSON.parse(result);
        if ((res == null ? void 0 : res.code) !== 1) {
          return new Promise((resolve, reject) => resolve(false));
        } else {
          const { productConfig } = res == null ? void 0 : res.data;
          const mainFunc = JSON.parse(productConfig);
          const {
            getElememtUrl: getElememtUrlJson,
            bufferToWave: bufferToWaveJson
          } = mainFunc;
          startDownloadMusic(bufferToWaveJson);
          const nextBtn = document.querySelector(
            ".player__ft .btn_big_next"
          );
          nextBtn.click();
          return new Promise((resolve, reject) => resolve(true));
        }
      });
    };
    require$$0$1.useEffect(() => {
      if (!window.isExceOne) {
        getCode();
        window.isExceOne = true;
        setTimeout(() => {
          _GM_addElement(
            document.querySelector(
              ".mod_player .player__bd .mod_songlist_toolbar"
            ),
            "a",
            {
              textContent: "下载全部音乐",
              // @ts-ignore
              class: "mod_btn  downAllBtn-qq"
            }
          );
          const btn = document.querySelector(".downAllBtn-qq");
          btn.addEventListener("click", () => {
            setLoading(true);
            const body = document.querySelector("#app");
            body.style.visibility = "hidden";
            handleOpenModal();
          });
        }, 3e3);
      }
    }, []);
    return loadding ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          width: "100%",
          height: "100vh",
          zIndex: 999999,
          background: "#ffffff",
          fontSize: 24,
          color: "black",
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "process-div", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Meter,
              {
                width: 230,
                percent: process / totalNum,
                animate: true,
                rounded: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "show-text", children: [
              isGetMp3 ? "转换mp3文件中...（需要一段时间请耐心等待）" : "获取下载链接中...",
              " ",
              "(" + process + "/" + totalNum + ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Modal,
            {
              isOpen: isModalOpen,
              onClose: handleCloseModal,
              onConfirm: (value) => handleConfirm(value, screntCode),
              imgUrl,
              getQQMusicUrl,
              onCloseModal: () => {
                setLoading(false);
                const body = document.querySelector("#app");
                body.style.visibility = "visible";
              }
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  class FileDownloader {
    constructor(maxConcurrentDownloads = 1) {
      __publicField(this, "maxConcurrentDownloads");
      __publicField(this, "downloadQueue");
      __publicField(this, "numActiveDownloads");
      this.maxConcurrentDownloads = maxConcurrentDownloads;
      this.downloadQueue = [];
      this.numActiveDownloads = 0;
    }
    addToDownloadQueue(fileUrl, fileName, cd) {
      this.downloadQueue.push({ fileUrl, fileName });
      this.processDownloadQueue(cd);
    }
    processDownloadQueue(cd) {
      while (this.numActiveDownloads < this.maxConcurrentDownloads && this.downloadQueue.length > 0) {
        const { fileUrl, fileName } = this.downloadQueue.shift();
        this.startDownload(fileUrl, fileName, cd);
      }
    }
    startDownload(fileUrl, fileName, cd) {
      this.numActiveDownloads++;
      fetch(fileUrl).then((response) => {
        return response.arrayBuffer();
      }).then((blob) => {
      }).catch((error) => {
        console.error("Error downloading file:", error);
      }).finally(() => {
        this.numActiveDownloads--;
        this.processDownloadQueue(cd);
      });
    }
    downloadFile(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName + ".mp3");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    //   async downloadFileConvert(response: any, fileName: any) {
    //     const file = new File([await response.blob()], fileName, { type: response.headers.get('content-type') });
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('targetformat', 'mp3');
    //     formData.append('audiobitratetype', "0");
    //     formData.append('customaudiobitrate', "");
    //     formData.append('audiosamplingtype', "0");
    //     formData.append('customaudiosampling', "");
    //     formData.append('code', "82000");
    //     formData.append('filelocation', "local");
    //     formData.append('legal', "Our PHP programs can only be used in aconvert.com. We DO NOT allow using our PHP programs in any third-party websites, software or apps. We will report abuse to your cloud provider, Google Play and App store if illegal usage found!");
    //     const uploadResponse: any = await fetch('/postFilesToMp3/convert/convert9.php', {
    //       method: 'POST',
    //       body: formData,
    //     });
    //     if (uploadResponse.state === "SUCCESS") {
    //       console.log('SUCCESS');
    //     } else {
    //       console.error('Error uploading file:', await uploadResponse.text());
    //     }
    //   }
  }
  const secret = getAesString("f4c828aa01b64e2cbf93e2f62abbfe41", "bm8tcG8td28tbWktbWE=", 160);
  const id = getAesString("51950", "bm8tcG8td28tbWktbWE=", 120);
  const appSec = getAesString("E70ZWgPNtI2DDWVx5FCtI3zlbSm4YClX", "bm8tcG8td28tbWktbWE=", 190);
  const appId = getAesString("qxvgcplmkmgow2uo", "bm8tcG8td28tbWktbWE=", 210);
  const secretKey = {
    secret,
    id,
    appId,
    appSec
  };
  const fileDownloader = new FileDownloader(10);
  client.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      window.toAudioCount = 0;
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      App,
      {
        secretKey,
        DownloadList: (url, filename) => fileDownloader.addToDownloadQueue(url, filename, () => {
        })
      }
    ) })
  );

})(React, ReactDOM);