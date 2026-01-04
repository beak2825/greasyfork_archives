// ==UserScript==
// @name         B站收藏视频备注+自动备份、视频笔记下载、分p/合集视频随机播放……
// @namespace    https://github.com/Jayvin-Leung
// @version      1.1.1
// @author       Jayvin Leung
// @description  【（1）收藏视频备注功能】：支持在收藏视频时添加备注信息，然后在收藏夹中快速查看和管理备注内容 ；【（2）视频笔记下载功能】：支持转换单视频、分p视频、合集视频的私人笔记内容为Markdown文件并下载至本地 ；【（3）分p/合集视频列表随机播放功能】：支持单个页面开启/关闭，可自动、点击、快捷键、蓝牙随机切换 ；【（4）数据备份、恢复功能】：支持按时间间隔自动备份数据到云端和手动恢复，同时支持导出到本地和导入 ；（注意：部分功能仅适配B站新版网页端）
// @license      MIT
// @icon         https://github.com/user-attachments/assets/b9c1ca07-876b-4fd9-b88e-df10cb29615f
// @homepageURL  https://github.com/Jayvin-Leung/Bilibili-Memo
// @supportURL   https://github.com/Jayvin-Leung/Bilibili-Memo/issues
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://space.bilibili.com/*/favlist*
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/dayjs.min.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/customParseFormat.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekday.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/localeData.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekOfYear.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/weekYear.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/advancedFormat.js
// @require      https://registry.npmmirror.com/dayjs/1.11.13/files/plugin/quarterOfYear.js
// @require      https://registry.npmmirror.com/vue/3.5.13/files/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/ant-design-vue/4.2.6/files/dist/antd.min.js
// @require      https://registry.npmmirror.com/fflate/0.8.2/files/umd/index.js
// @resource     ant-design-vue/dist/reset.css  https://registry.npmmirror.com/ant-design-vue/4.2.6/files/dist/reset.css
// @connect      kdocs.cn
// @grant        GM.deleteValue
// @grant        GM.getTab
// @grant        GM.getTabs
// @grant        GM.getValue
// @grant        GM.info
// @grant        GM.saveTab
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528432/B%E7%AB%99%E6%94%B6%E8%97%8F%E8%A7%86%E9%A2%91%E5%A4%87%E6%B3%A8%2B%E8%87%AA%E5%8A%A8%E5%A4%87%E4%BB%BD%E3%80%81%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E4%B8%8B%E8%BD%BD%E3%80%81%E5%88%86p%E5%90%88%E9%9B%86%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E2%80%A6%E2%80%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/528432/B%E7%AB%99%E6%94%B6%E8%97%8F%E8%A7%86%E9%A2%91%E5%A4%87%E6%B3%A8%2B%E8%87%AA%E5%8A%A8%E5%A4%87%E4%BB%BD%E3%80%81%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E4%B8%8B%E8%BD%BD%E3%80%81%E5%88%86p%E5%90%88%E9%9B%86%E8%A7%86%E9%A2%91%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E2%80%A6%E2%80%A6.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const t=document.createElement("style");t.textContent=a,document.head.append(t)})(' .ribbon[data-v-83c9451e]{margin:0;font-size:12px;line-height:16px;color:#fff;text-align:center;width:20px;height:18px;background:linear-gradient(135deg,rgba(255,255,255,.4),transparent) #ea3447;background-blend-mode:soft-light;display:inline-block;border-radius:12px 0 0 12px;position:relative;border:1px solid #fff;cursor:pointer}.ribbon[data-v-83c9451e]:after{position:absolute;content:"";clip-path:polygon(0 0,100% 0,0 100%);width:4px;height:4px;right:0;bottom:-4px;background:linear-gradient(#0000004d,#0000004d);background-color:inherit}.ribbon-new[data-v-83c9451e]{background-color:#696969}.custom-row-time[data-v-83c9451e]{margin-top:8px}.custom-col-time[data-v-83c9451e]{font-size:12px;color:#bbb}.bili-video-card__remark{position:absolute;top:38%;right:-4px;z-index:999}.collection__remark{padding:20px 20px 0;border-top:1px solid #e3e5e7}.custom-loading{position:absolute;z-index:999;border:1px solid #1677ff;border-radius:6px;background:#ffffffb3;text-align:center;padding-top:200px}.custom-more{position:absolute;z-index:999}.items[data-v-1d7c71a3]{width:100%;padding:0 10px;background:#efefef;border-radius:4px}.item[data-v-1d7c71a3]{margin:8px 0;background:#fff;border:1px solid #dbdbdb;border-radius:6px}.moving[data-v-1d7c71a3]{color:transparent;background:transparent;border:1px dashed #ccc;transition:none}.backup-time[data-v-c47228de],.restore-time[data-v-c47228de]{font-size:12px;color:#bbb}.custom-layout[data-v-69aa2ebc]{background-color:#fff;color:#000;max-height:600px;overflow:hidden}.custom-layout-sider[data-v-69aa2ebc]{text-align:right;margin:10px;height:580px;overflow:auto}.custom-layout-sider[data-v-69aa2ebc]::-webkit-scrollbar{width:0px}.custom-layout-sider[data-v-69aa2ebc]::-webkit-scrollbar-thumb{background-color:gray;border-radius:5px}.custom-layout-sider[data-v-69aa2ebc]::-webkit-scrollbar-track{background-color:#dcdcdc}.custom-layout-conten[data-v-69aa2ebc]{text-align:left;margin:10px;height:580px;overflow:auto}.custom-layout-conten[data-v-69aa2ebc]::-webkit-scrollbar{width:0px;height:0px;position:absolute;left:0}.custom-layout-conten[data-v-69aa2ebc]::-webkit-scrollbar-thumb{background-color:gray;border-radius:5px}.custom-layout-conten[data-v-69aa2ebc]::-webkit-scrollbar-track{background-color:transparent}.custom-divider[data-v-69aa2ebc]{font-weight:700;font-size:18px;margin:0}.custom-collapse[data-v-69aa2ebc] .ant-collapse-header{padding:0;background-color:#f0f8ff}.custom-collapse[data-v-69aa2ebc] .ant-collapse-content-box{padding:0}ul li[data-v-16c5d314]{padding:4px 0;line-height:24px;list-style:disc}.custom-row{width:100%;padding:6px 10px}.custom-row:hover{background-color:#f0f8ff}.custom-col-label{font-size:16px;height:32px;line-height:32px}.custom-col-content{height:32px;line-height:32px} ');

(async function (vue, Antd, fflate) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("ant-design-vue/dist/reset.css");
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h2, s, l) {
    var r;
    var g;
    var b;
    h2 = bound01(h2, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
      g = l;
      b = l;
      r = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h2 + 1 / 3);
      g = hue2rgb(p, q, h2);
      b = hue2rgb(p, q, h2 - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h2 = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h2 = 0;
    } else {
      switch (max) {
        case r:
          h2 = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h2 = (b - r) / d + 2;
          break;
        case b:
          h2 = (r - g) / d + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s, v };
  }
  function hsvToRgb(h2, s, v) {
    h2 = bound01(h2, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h2);
    var f = h2 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    return hex.join("");
  }
  function convertHexToDecimal(h2) {
    return parseIntFromHex(h2) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
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
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
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
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
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
    var r = _ref.r, g = _ref.g, b = _ref.b;
    var hsv = rgbToHsv(r, g, b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v
    };
  }
  function toHex(_ref2) {
    var r = _ref2.r, g = _ref2.g, b = _ref2.b;
    return "#".concat(rgbToHex(r, g, b));
  }
  function mix(rgb1, rgb2, amount) {
    var p = amount / 100;
    var rgb = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b
    };
    return rgb;
  }
  function getHue(hsv, i, light) {
    var hue;
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  function getSaturation(hsv, i, light) {
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    var saturation;
    if (light) {
      saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
      saturation = hsv.s + saturationStep;
    } else {
      saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Number(saturation.toFixed(2));
  }
  function getValue(hsv, i, light) {
    var value;
    if (light) {
      value = hsv.v + brightnessStep1 * i;
    } else {
      value = hsv.v - brightnessStep2 * i;
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
    for (var i = lightColorCount; i > 0; i -= 1) {
      var hsv = toHsv(pColor);
      var colorString = toHex(inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      }));
      patterns.push(colorString);
    }
    patterns.push(toHex(pColor));
    for (var _i = 1; _i <= darkColorCount; _i += 1) {
      var _hsv = toHsv(pColor);
      var _colorString = toHex(inputToRGB({
        h: getHue(_hsv, _i),
        s: getSaturation(_hsv, _i),
        v: getValue(_hsv, _i)
      }));
      patterns.push(_colorString);
    }
    if (opts.theme === "dark") {
      return darkColorMap.map(function(_ref3) {
        var index2 = _ref3.index, opacity = _ref3.opacity;
        var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index2]), opacity * 100));
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
  Object.keys(presetPrimaryColors).forEach(function(key) {
    presetPalettes[key] = generate$1(presetPrimaryColors[key]);
    presetPalettes[key].primary = presetPalettes[key][5];
    presetDarkPalettes[key] = generate$1(presetPrimaryColors[key], {
      theme: "dark",
      backgroundColor: "#141414"
    });
    presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
  });
  var blue = presetPalettes.blue;
  var contextKey = Symbol("iconContext");
  var useInjectIconContext = function useInjectIconContext2() {
    return vue.inject(contextKey, {
      prefixCls: vue.ref("anticon"),
      rootClassName: vue.ref(""),
      csp: vue.ref()
    });
  };
  function canUseDom() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }
  function contains(root, n) {
    if (!root) {
      return false;
    }
    if (root.contains) {
      return root.contains(n);
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
  function getContainer(option) {
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
    return Array.from((containerCache.get(container) || container).children).filter(function(node) {
      return node.tagName === "STYLE";
    });
  }
  function injectCSS(css) {
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
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
      if (prepend === "queue") {
        var existStyle = findStyles(container).filter(function(node) {
          return ["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER));
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
  function findExistNode(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var container = getContainer(option);
    return findStyles(container).find(function(node) {
      return node.getAttribute(getMark(option)) === key;
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
  function updateCSS(css, key) {
    var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var container = getContainer(option);
    syncRealContainer(container, option);
    var existNode = findExistNode(key, option);
    if (existNode) {
      if (option.csp && option.csp.nonce && existNode.nonce !== option.csp.nonce) {
        existNode.nonce = option.csp.nonce;
      }
      if (existNode.innerHTML !== css) {
        existNode.innerHTML = css;
      }
      return existNode;
    }
    var newNode = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
  }
  function _objectSpread$b(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$b(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$b(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function warning(valid, message) {
  }
  function isIconDefinition(target) {
    return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
  }
  function generate(node, key, rootProps) {
    if (!rootProps) {
      return vue.h(node.tag, _objectSpread$b({
        key
      }, node.attrs), (node.children || []).map(function(child, index2) {
        return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index2));
      }));
    }
    return vue.h(node.tag, _objectSpread$b({
      key
    }, rootProps, node.attrs), (node.children || []).map(function(child, index2) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index2));
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
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$1(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose$1(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectSpread$a(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$a(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$a(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
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
    return _objectSpread$a({}, twoToneColorPalette);
  }
  var IconBase = function IconBase2(props, context) {
    var _props$context$attrs = _objectSpread$a({}, props, context.attrs), icon = _props$context$attrs.icon, primaryColor = _props$context$attrs.primaryColor, secondaryColor = _props$context$attrs.secondaryColor, restProps = _objectWithoutProperties$1(_props$context$attrs, _excluded$1);
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
      target = _objectSpread$a({}, target, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return generate(target.icon, "svg-".concat(target.name), _objectSpread$a({}, restProps, {
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
  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }
  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit$1(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function setTwoToneColor(twoToneColor) {
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray$1(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return IconBase.setTwoToneColors({
      primaryColor,
      secondaryColor
    });
  }
  function getTwoToneColor() {
    var colors = IconBase.getTwoToneColors();
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _objectSpread$9(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$9(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$9(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  setTwoToneColor(blue.primary);
  var Icon = function Icon2(props, context) {
    var _classObj;
    var _props$context$attrs = _objectSpread$9({}, props, context.attrs), cls = _props$context$attrs["class"], icon = _props$context$attrs.icon, spin = _props$context$attrs.spin, rotate = _props$context$attrs.rotate, tabindex = _props$context$attrs.tabindex, twoToneColor = _props$context$attrs.twoToneColor, onClick = _props$context$attrs.onClick, restProps = _objectWithoutProperties(_props$context$attrs, _excluded);
    var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, rootClassName = _useInjectIconContext.rootClassName;
    var classObj = (_classObj = {}, _defineProperty$9(_classObj, rootClassName.value, !!rootClassName.value), _defineProperty$9(_classObj, prefixCls.value, true), _defineProperty$9(_classObj, "".concat(prefixCls.value, "-").concat(icon.name), Boolean(icon.name)), _defineProperty$9(_classObj, "".concat(prefixCls.value, "-spin"), !!spin || icon.name === "loading"), _classObj);
    var iconTabIndex = tabindex;
    if (iconTabIndex === void 0 && onClick) {
      iconTabIndex = -1;
    }
    var svgStyle = rotate ? {
      msTransform: "rotate(".concat(rotate, "deg)"),
      transform: "rotate(".concat(rotate, "deg)")
    } : void 0;
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return vue.createVNode("span", _objectSpread$9({
      "role": "img",
      "aria-label": icon.name
    }, restProps, {
      "onClick": onClick,
      "class": [classObj, cls],
      "tabindex": iconTabIndex
    }), [vue.createVNode(IconBase, {
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
  var BarsOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "0 0 1024 1024", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0z" } }] }, "name": "bars", "theme": "outlined" };
  function _objectSpread$8(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$8(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$8(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var BarsOutlined = function BarsOutlined2(props, context) {
    var p = _objectSpread$8({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$8({}, p, {
      "icon": BarsOutlined$1
    }), null);
  };
  BarsOutlined.displayName = "BarsOutlined";
  BarsOutlined.inheritAttrs = false;
  var CustomerServiceOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 128c-212.1 0-384 171.9-384 384v360c0 13.3 10.7 24 24 24h184c35.3 0 64-28.7 64-64V624c0-35.3-28.7-64-64-64H200v-48c0-172.3 139.7-312 312-312s312 139.7 312 312v48H688c-35.3 0-64 28.7-64 64v208c0 35.3 28.7 64 64 64h184c13.3 0 24-10.7 24-24V512c0-212.1-171.9-384-384-384zM328 632v192H200V632h128zm496 192H696V632h128v192z" } }] }, "name": "customer-service", "theme": "outlined" };
  function _objectSpread$7(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$7(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$7(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var CustomerServiceOutlined = function CustomerServiceOutlined2(props, context) {
    var p = _objectSpread$7({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$7({}, p, {
      "icon": CustomerServiceOutlined$1
    }), null);
  };
  CustomerServiceOutlined.displayName = "CustomerServiceOutlined";
  CustomerServiceOutlined.inheritAttrs = false;
  var EditOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" } }] }, "name": "edit", "theme": "outlined" };
  function _objectSpread$6(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$6(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$6(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var EditOutlined = function EditOutlined2(props, context) {
    var p = _objectSpread$6({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$6({}, p, {
      "icon": EditOutlined$1
    }), null);
  };
  EditOutlined.displayName = "EditOutlined";
  EditOutlined.inheritAttrs = false;
  var ExclamationCircleOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }, { "tag": "path", "attrs": { "d": "M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" } }] }, "name": "exclamation-circle", "theme": "outlined" };
  function _objectSpread$5(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$5(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$5(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var ExclamationCircleOutlined = function ExclamationCircleOutlined2(props, context) {
    var p = _objectSpread$5({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$5({}, p, {
      "icon": ExclamationCircleOutlined$1
    }), null);
  };
  ExclamationCircleOutlined.displayName = "ExclamationCircleOutlined";
  ExclamationCircleOutlined.inheritAttrs = false;
  var FolderOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z" } }] }, "name": "folder", "theme": "outlined" };
  function _objectSpread$4(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$4(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$4(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var FolderOutlined = function FolderOutlined2(props, context) {
    var p = _objectSpread$4({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$4({}, p, {
      "icon": FolderOutlined$1
    }), null);
  };
  FolderOutlined.displayName = "FolderOutlined";
  FolderOutlined.inheritAttrs = false;
  var PlusOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" } }, { "tag": "path", "attrs": { "d": "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z" } }] }, "name": "plus", "theme": "outlined" };
  function _objectSpread$3(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$3(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$3(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var PlusOutlined = function PlusOutlined2(props, context) {
    var p = _objectSpread$3({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$3({}, p, {
      "icon": PlusOutlined$1
    }), null);
  };
  PlusOutlined.displayName = "PlusOutlined";
  PlusOutlined.inheritAttrs = false;
  var ProfileOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM340 368a40 40 0 1080 0 40 40 0 10-80 0zm0 144a40 40 0 1080 0 40 40 0 10-80 0zm0 144a40 40 0 1080 0 40 40 0 10-80 0z" } }] }, "name": "profile", "theme": "outlined" };
  function _objectSpread$2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$2(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var ProfileOutlined = function ProfileOutlined2(props, context) {
    var p = _objectSpread$2({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$2({}, p, {
      "icon": ProfileOutlined$1
    }), null);
  };
  ProfileOutlined.displayName = "ProfileOutlined";
  ProfileOutlined.inheritAttrs = false;
  var SettingOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z" } }] }, "name": "setting", "theme": "outlined" };
  function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var SettingOutlined = function SettingOutlined2(props, context) {
    var p = _objectSpread$1({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$1({}, p, {
      "icon": SettingOutlined$1
    }), null);
  };
  SettingOutlined.displayName = "SettingOutlined";
  SettingOutlined.inheritAttrs = false;
  var SyncOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z" } }] }, "name": "sync", "theme": "outlined" };
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var SyncOutlined = function SyncOutlined2(props, context) {
    var p = _objectSpread({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread({}, p, {
      "icon": SyncOutlined$1
    }), null);
  };
  SyncOutlined.displayName = "SyncOutlined";
  SyncOutlined.inheritAttrs = false;
  const titleRef = vue.ref();
  const templateRef = vue.shallowRef();
  const templatePropsRef = vue.ref();
  const openRef = vue.ref(false);
  vue.createApp({
    render: () => {
      return vue.h(
        Antd.Modal,
        {
          centered: true,
          destroyOnClose: true,
          footer: null,
          title: titleRef.value,
          open: openRef.value,
          width: "720px",
          zIndex: 99999,
          onCancel: () => {
            openRef.value = false;
          }
        },
        () => vue.h(templateRef.value, { ...templatePropsRef.value })
      );
    }
  }).use(Antd).mount(
    (() => {
      const div = document.createElement("div");
      document.body.append(div);
      return div;
    })()
  );
  const templateModal = ({ title, template, templateProps }) => {
    openRef.value = true;
    titleRef.value = title;
    templateRef.value = template;
    templatePropsRef.value = templateProps;
    return () => {
      openRef.value = false;
    };
  };
  const messageModal = ({ title, message, type = "info" }) => {
    Antd.Modal[type]({
      title,
      content: message,
      autoFocusButton: null,
      okText: "确定",
      zIndex: 99999,
      style: { "text-align": "left" },
      onOk() {
        Antd.Modal.destroyAll();
      },
      onCancel() {
        Antd.Modal.destroyAll();
      }
    });
  };
  class Storage {
    constructor() {
      if (new.target === Storage) {
        throw new Error("Cannot instantiate an abstract class.");
      }
      Reflect.ownKeys(Storage.prototype).forEach((key) => {
        if (key === "constructor") return;
        if (!new.target.prototype.hasOwnProperty(key) || new.target.prototype[key].length !== Storage.prototype[key].length) {
          throw new Error(`Abstract method ${key} must be implemented.`);
        }
      });
    }
    /**
     * 设置缓存
     * @abstract
     * @param {string} key
     * @param {any}    value
     */
    set(key, value) {
      throw new Error("must be implemented by subclass!");
    }
    /**
     * 判断缓存是否存在
     * @abstract
     * @param {string}    key
     * @returns {boolean}
     */
    has(key) {
      throw new Error("must be implemented by subclass!");
    }
    /**
     * 获取缓存
     * @abstract
     * @param {string} key
     * @param {any}    defaultValue
     * @returns {any}
     */
    get(key, defaultValue) {
      throw new Error("must be implemented by subclass!");
    }
    /**
     * 删除缓存
     * @abstract
     * @param {string} key
     */
    remove(key) {
      throw new Error("must be implemented by subclass!");
    }
    /**
     * 清除缓存
     * @abstract
     */
    clear() {
      throw new Error("must be implemented by subclass!");
    }
    /**
     * 监听缓存变化
     * @abstract
     * @param {string}     key                        需要监听的key
     * @param {Function}   execute                    监听到变化时执行的回调函数
     * @param {{
     *          key: string,
     *          newValue: any,
     *          oldValue: any,
     *        }}           execute.params.$0          execute参数1：{key: string, newValue: any, oldVaule: any}
     * @param {string}     execute.params.$0.key      监听的key
     * @param {any}        execute.params.$0.newValue 变化后的新数据
     * @param {any}        execute.params.$0.oldValue 变化前的旧数据
     * @returns {Function}                            停止监听函数
     */
    listen(key, execute) {
      throw new Error("must be implemented by subclass!");
    }
  }
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class GM_Storage extends Storage {
    constructor() {
      super();
    }
    /** @override */
    set(key, value) {
      _GM_setValue(key, value);
    }
    /** @override */
    has(key) {
      return _GM_getValue(key, null) ? true : false;
    }
    /** @override */
    get(key, defaultValue) {
      return _GM_getValue(key, defaultValue);
    }
    /** @override */
    remove(key) {
      _GM_deleteValue(key);
    }
    /** @override */
    clear() {
      const keys = _GM_listValues();
      keys.forEach((key) => {
        _GM_deleteValue(key);
      });
    }
    /** @override */
    listen(key, execute) {
      const listenerId = _GM_addValueChangeListener(key, (key2, oldValue, newValue) => {
        execute({ key: key2, newValue, oldValue });
      });
      return () => {
        _GM_removeValueChangeListener(listenerId);
      };
    }
  }
  const _$3 = new GM_Storage();
  const constants = Object.freeze({
    STORAGE_KEY: {
      AGREEMENT: `${"Bilibili-Memo"}:Agreement`,
      BASE_CONFIG: `${"Bilibili-Memo"}:BaseConfig`,
      PLUGIN_CONFIG: (id) => `${"Bilibili-Memo"}:PluginConfig:${id}`
    }
  });
  const storageUtil = {
    getAgreement: () => {
      const key = constants.STORAGE_KEY.AGREEMENT;
      return _$3.get(key);
    },
    setAgreement: (choice) => {
      const key = constants.STORAGE_KEY.AGREEMENT;
      _$3.set(key, choice);
    },
    listenAgreement: (execute) => {
      if (!execute || typeof execute !== "function") {
        throw new Error("TypeError: execute is not a function");
      }
      const key = constants.STORAGE_KEY.AGREEMENT;
      return _$3.listen(key, execute);
    },
    getBaseConfig: () => {
      const key = constants.STORAGE_KEY.BASE_CONFIG;
      return _$3.get(key);
    },
    setBaseConfig: (baseConfig2) => {
      const key = constants.STORAGE_KEY.BASE_CONFIG;
      _$3.set(key, baseConfig2);
    },
    listenBaseConfig: (execute) => {
      if (!execute || typeof execute !== "function") {
        throw new Error("TypeError: execute is not a function");
      }
      const key = constants.STORAGE_KEY.BASE_CONFIG;
      return _$3.listen(key, execute);
    },
    getPluginConfig: (id) => {
      if (!id) throw new Error("Error parameter: id.");
      const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
      return _$3.get(key);
    },
    setPluginConfig: (id, pluginConfig2) => {
      if (!id) throw new Error("Error parameter: id.");
      const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
      _$3.set(key, pluginConfig2);
    },
    listenPluginConfig: (id, execute) => {
      if (!id) throw new Error("Error parameter: id.");
      if (!execute || typeof execute !== "function") {
        throw new Error("TypeError: execute is not a function");
      }
      const key = constants.STORAGE_KEY.PLUGIN_CONFIG(id);
      return _$3.listen(key, execute);
    }
  };
  class Plugin {
    constructor({ name, description, icon, type, $init, $reset, $click }) {
      this.name = name;
      this.description = description;
      this.icon = icon;
      this.type = type;
      this.$init = $init;
      this.$reset = $reset;
      this.$click = $click;
    }
  }
  const XOR_CODE = 23442827791579n;
  const MASK_CODE = 2251799813685247n;
  const MAX_AID = 1n << 51n;
  const BASE = 58n;
  const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
  const getCookieValue = (key) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim().split("=");
      if (cookie[0] === key) {
        return cookie.length > 1 ? cookie[1] : "";
      }
    }
    return null;
  };
  const getUid = () => {
    return getCookieValue("DedeUserID");
  };
  const getCsrf = () => {
    return getCookieValue("bili_jct");
  };
  const getCurrLocation = () => {
    const currLocation = location.origin + location.pathname;
    return currLocation.endsWith("/") ? currLocation : currLocation + "/";
  };
  const getCurrBvid = () => {
    if (location.origin != "https://www.bilibili.com") return "";
    const arr = location.pathname.split("/");
    if (arr[1] !== "video") return "";
    if (!new RegExp(/(BV|av)[a-zA-Z0-9]+/).test(arr[2])) return "";
    return arr[2];
  };
  const av2bv = (aid) => {
    const bytes = ["B", "V", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
    while (tmp > 0) {
      bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
      tmp = tmp / BASE;
      bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join("");
  };
  const bv2av = (bvid) => {
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce(
      (pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)),
      0n
    );
    return Number(tmp & MASK_CODE ^ XOR_CODE);
  };
  const biliUtil = {
    getCookieValue,
    getUid,
    getCsrf,
    getCurrLocation,
    getCurrBvid,
    av2bv,
    bv2av
  };
  class PluginConfig {
    constructor({
      base: { match = [], isOnlySwitchCurrActive = false, isActive = false },
      option = {},
      data: data2 = []
    }) {
      this.base = {
        // 插件应用的位置，动态信息使用{{x}}表示，默认空数组代表全匹配
        match,
        // 插件是否已激活
        isActive,
        // 插件是否只切换当前页面激活状态
        isOnlySwitchCurrActive
      };
      this.option = option;
      this.data = data2;
    }
  }
  const assignDeep = (target, ...sources) => {
    if (target === void 0 || target === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    sources.forEach((source) => {
      if (source !== void 0 && source !== null) {
        for (const key in source) {
          target[key] = cloneDeep(source[key]);
        }
      }
    });
    return target;
  };
  const assignTargetDeep = (target, ...sources) => {
    if (target === void 0 || target === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    sources.forEach((source) => {
      if (source !== void 0 && source !== null) {
        for (const key in target) {
          if (source.hasOwnProperty(key)) {
            target[key] = cloneDeep(source[key]);
          }
        }
      }
    });
    return target;
  };
  const cloneDeep = (target) => {
    const map = /* @__PURE__ */ new WeakMap();
    const isObject = (t) => {
      return typeof t === "object" && t || typeof t === "function";
    };
    const clone = (data2) => {
      if (!isObject(data2)) {
        return data2;
      }
      if (typeof data2 === "function") {
        try {
          return data2;
        } catch (error) {
          return data2;
        }
      }
      if (map.has(data2)) {
        return map.get(data2);
      }
      if ([Date, RegExp].includes(data2.constructor)) {
        return new data2.constructor(data2);
      }
      if (data2.constructor === Map) {
        const result2 = /* @__PURE__ */ new Map();
        map.set(data2, result2);
        data2.forEach((val, key) => {
          if (isObject(val)) {
            result2.set(key, clone(val));
          } else {
            result2.set(key, val);
          }
        });
        return result2;
      }
      if (data2.constructor === Set) {
        const result2 = /* @__PURE__ */ new Set();
        map.set(data2, result2);
        data2.forEach((val) => {
          if (isObject(val)) {
            result2.add(clone(val));
          } else {
            result2.add(val);
          }
        });
        return result2;
      }
      if (Array.isArray(data2)) {
        const result2 = [];
        map.set(data2, result2);
        data2.forEach((val, index2) => {
          if (isObject(val)) {
            result2[index2] = clone(val);
          } else {
            result2[index2] = val;
          }
        });
        return result2;
      }
      const keys = Reflect.ownKeys(data2);
      const allDesc = Object.getOwnPropertyDescriptors(data2);
      const result = Object.create(Object.getPrototypeOf(data2), allDesc);
      map.set(data2, result);
      keys.forEach((key) => {
        const val = data2[key];
        if (isObject(val)) {
          result[key] = clone(val);
        } else {
          result[key] = val;
        }
      });
      return result;
    };
    return clone(target);
  };
  const _$2 = { assignDeep, assignTargetDeep, cloneDeep };
  class BaseConfig {
    constructor({
      general: { shortcutMaxShow = 1, shortcutShowMode = "hover", shortcuts = [] },
      syncAndBackup: {
        wps: {
          isActive = false,
          airScript: { token = "", webhook = "", isValid = false },
          sync: { enabled = false },
          backup: { autoBackupInterval = 0, lastBackupTime = 0, lastRestoreTime = 0 }
        }
      }
    }) {
      this.general = {
        // 快捷方式栏最大展示数量
        shortcutMaxShow,
        // 快捷方式栏展开方式
        shortcutShowMode,
        // 快捷方式栏插件数组
        shortcuts
      };
      this.syncAndBackup = {
        // WPS 备份设置
        wps: {
          // 是否开启
          isActive,
          // AirScript 配置
          airScript: {
            // AirScript 脚本 APIToken
            token,
            // AirScript 脚本对应 webhook
            webhook,
            // 是否有效
            isValid
          },
          // 同步设置
          sync: {
            // 开启实时同步
            enabled
          },
          // 备份设置
          backup: {
            // 自动备份间隔
            autoBackupInterval,
            // 上一次备份数据时间
            lastBackupTime,
            // 上一次恢复数据时间
            lastRestoreTime
          }
        }
      };
    }
  }
  class ConfigRef {
    constructor(config2) {
      if (![BaseConfig, PluginConfig].includes(config2.constructor)) {
        throw new Error("param config expect class [BaseConfig, PluginConfig].");
      }
      this._config = vue.ref(config2);
      this._changeHandler = null;
      this._listener = { pause: null, resume: null, stop: null };
    }
    _self() {
      return this._config.value;
    }
    initChangeHandler(handler2) {
      this._changeHandler = handler2;
    }
    useChangeHandler() {
      this._changeHandler && this._changeHandler(this.getValue());
    }
    getValue() {
      return _$2.cloneDeep(this._config.value);
    }
    setValue(value) {
      _$2.assignTargetDeep(this._config.value, value);
    }
    /**
     * 监听插件配置变化
     * @param {Function}                execute               插件配置变化时执行的回调函数
     * @param {any}                     execute.params.$0     execute参数1：变化后的新数据
     * @param {any}                     execute.params.$1     execute参数2：变化前的旧数据
     * @param {{realOldValue: boolean}} [option]              可选选项
     * @param {boolean}                 [option.realOldValue] 是否需要返回真正的 oldValue
     */
    listen(execute, option) {
      if (!execute || typeof execute !== "function") {
        throw new Error("TypeError: execute is not a function");
      }
      this.stopListen();
      if (option && option.realOldValue) {
        let oldValue = _$2.cloneDeep(this._config.value);
        this._listener = vue.watch(this._config.value, (value) => {
          execute(value, oldValue);
          oldValue = _$2.cloneDeep(value);
        });
      } else {
        this._listener = vue.watch(this._config.value, (value, oldValue) => {
          execute(value, oldValue);
        });
      }
    }
    pauseListen() {
      this._listener.pause && this._listener.pause();
    }
    resumeListen() {
      this._listener.resume && this._listener.resume();
    }
    stopListen() {
      if (this._listener.stop) {
        this._listener.stop();
        this._listener = { pause: null, resume: null, stop: null };
      }
    }
    getController() {
      return {
        initChangeHandler: (handler2) => this.initChangeHandler(handler2),
        useChangeHandler: () => this.useChangeHandler(),
        getValue: () => this.getValue(),
        setValue: (value) => this.setValue(value),
        listen: (execute, option) => this.listen(execute, option),
        pauseListen: () => this.pauseListen(),
        resumeListen: () => this.resumeListen(),
        stopListen: () => this.stopListen()
      };
    }
  }
  const pluginConfig$2 = new PluginConfig({
    base: {
      match: [
        "https://space.bilibili.com/{{uid}}/favlist/",
        "https://www.bilibili.com/video/{{bvid}}/"
      ],
      isActive: false,
      isOnlySwitchCurrActive: false
    },
    option: {},
    data: []
  });
  const configRef$3 = new ConfigRef(pluginConfig$2);
  const config$4 = configRef$3._self();
  const controller$3 = configRef$3.getController();
  const _sfc_main$j = {
    __name: "DisplayTag",
    props: {
      tags: {
        type: String,
        required: true,
        default: ""
      },
      color: {
        type: String,
        default: "red"
      }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_a_tag = vue.resolveComponent("a-tag");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.tags ? __props.tags.split(",") : [], (tag) => {
          return vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: tag }, [
            tag.length > 20 ? (vue.openBlock(), vue.createBlock(_component_a_tooltip, {
              key: 0,
              title: tag
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_tag, { color: __props.color }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(`${tag.slice(0, 20)}...`), 1)
                  ]),
                  _: 2
                }, 1032, ["color"])
              ]),
              _: 2
            }, 1032, ["title"])) : (vue.openBlock(), vue.createBlock(_component_a_tag, {
              key: 1,
              color: __props.color
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(tag), 1)
              ]),
              _: 2
            }, 1032, ["color"]))
          ], 64);
        }), 128);
      };
    }
  };
  const timestampToDate = [
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  ];
  const formatSeconds = [
    (seconds) => {
      const date = new Date(seconds * 1e3);
      const hh = date.getUTCHours().toString().padStart(2, "0");
      const mm = date.getUTCMinutes().toString().padStart(2, "0");
      const ss = date.getSeconds().toString().padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    },
    (seconds) => {
      const date = new Date(seconds * 1e3);
      const mm = date.getUTCMinutes().toString().padStart(2, "0");
      const ss = date.getSeconds().toString().padStart(2, "0");
      return `${mm}:${ss}`;
    }
  ];
  const dateUtil = { timestampToDate, formatSeconds };
  const request$1 = async (url, option, execute, error) => {
    if (!url || !option) {
      throw new Error("invaild url or option");
    }
    return fetch(url, option).then((response) => response.json()).then((data2) => {
      if (data2.code === 0) {
        execute && execute(data2.data);
        return data2.data;
      } else {
        error && error(data2.message);
        return data2.message;
      }
    }).catch((err) => {
      console.error("请求发生错误：", err);
      error && error("请求发生错误：" + err);
      return err;
    });
  };
  let Request$1 = class Request {
    get(url, params = {}, execute, error) {
      const keys = Object.keys(params).sort();
      const query = keys.map((k) => `${k}=${params[k]}`).join("&");
      return request$1(
        query ? `${url}?${query}` : url,
        {
          method: "GET",
          credentials: "include",
          mode: "cors"
        },
        execute,
        error
      );
    }
    post(url, params = {}, execute, error) {
      const keys = Object.keys(params).sort();
      const query = new URLSearchParams();
      keys.forEach((k) => query.append(k, params[k]));
      return request$1(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: query.toString(),
          credentials: "include",
          mode: "cors"
        },
        execute,
        error
      );
    }
  };
  const request$2 = new Request$1();
  const view = (bvid, execute, error) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/web-interface/view";
    let params = {
      bvid
    };
    return request$2.get(url, params, execute, error);
  };
  const _sfc_main$i = {
    __name: "DynamicTag",
    props: {
      tags: {
        type: String,
        required: true,
        default: ""
      },
      color: {
        type: String,
        default: "red"
      }
    },
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const inputRef = vue.ref();
      const state = vue.ref({
        tags: props.tags ? props.tags.split(",") : [],
        inputVisible: false,
        inputValue: ""
      });
      const handleClose = (removedTag) => {
        const tags = state.value.tags.filter((tag) => tag !== removedTag);
        state.value.tags = tags;
        emits("change", state.value.tags.join());
      };
      const showInput = () => {
        state.value.inputVisible = true;
        vue.nextTick(() => {
          inputRef.value.focus();
        });
      };
      const handleInputConfirm = () => {
        const inputValue = state.value.inputValue;
        let tags = state.value.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        Object.assign(state.value, {
          tags,
          inputVisible: false,
          inputValue: ""
        });
        emits("change", state.value.tags.join());
      };
      return (_ctx, _cache) => {
        const _component_a_tag = vue.resolveComponent("a-tag");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_input = vue.resolveComponent("a-input");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(state.value.tags, (tag) => {
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: tag }, [
              tag.length > 20 ? (vue.openBlock(), vue.createBlock(_component_a_tooltip, {
                key: 0,
                title: tag
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_tag, {
                    color: __props.color,
                    closable: "",
                    onClose: ($event) => handleClose(tag)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(`${tag.slice(0, 20)}...`), 1)
                    ]),
                    _: 2
                  }, 1032, ["color", "onClose"])
                ]),
                _: 2
              }, 1032, ["title"])) : (vue.openBlock(), vue.createBlock(_component_a_tag, {
                key: 1,
                color: __props.color,
                closable: "",
                onClose: ($event) => handleClose(tag)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(tag), 1)
                ]),
                _: 2
              }, 1032, ["color", "onClose"]))
            ], 64);
          }), 128)),
          state.value.inputVisible ? (vue.openBlock(), vue.createBlock(_component_a_input, {
            key: 0,
            ref_key: "inputRef",
            ref: inputRef,
            value: state.value.inputValue,
            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => state.value.inputValue = $event),
            type: "text",
            size: "small",
            onBlur: handleInputConfirm,
            onKeyup: vue.withKeys(handleInputConfirm, ["enter"]),
            style: { "width": "78px" }
          }, null, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_a_tag, {
            key: 1,
            onClick: showInput,
            style: { "background": "#fff", "border-style": "dashed" }
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(PlusOutlined)),
              _cache[1] || (_cache[1] = vue.createTextVNode(" New Tag "))
            ]),
            _: 1
          }))
        ], 64);
      };
    }
  };
  const _hoisted_1$2 = { key: 1 };
  const _sfc_main$h = {
    __name: "Info",
    props: [
      "bvid",
      "pic",
      "title",
      "desc",
      "remark",
      "tags",
      "ctime",
      "mtime"
    ],
    emits: ["change", "close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const container = vue.ref();
      const textareaRef = vue.ref();
      const formState = vue.ref({ ...props });
      const handleTagsChange = (tags) => {
        formState.value.tags = tags;
      };
      const handleSubmit = () => {
        if (!formState.value.ctime) {
          formState.value.ctime = Date.now();
        }
        formState.value.mtime = Date.now();
        emits("change", vue.toRaw(formState.value));
        emits("close");
      };
      vue.onMounted(() => {
        container.value = document.querySelector(".custom-form");
        textareaRef.value.focus();
      });
      return (_ctx, _cache) => {
        const _component_a_image = vue.resolveComponent("a-image");
        const _component_a_form_item = vue.resolveComponent("a-form-item");
        const _component_a_input = vue.resolveComponent("a-input");
        const _component_a_textarea = vue.resolveComponent("a-textarea");
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_form = vue.resolveComponent("a-form");
        return vue.openBlock(), vue.createBlock(_component_a_form, {
          model: formState.value,
          "label-col": { span: 5 },
          "wrapper-col": { span: 17 },
          class: "custom-form"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_form_item, { label: "视频封面" }, {
              default: vue.withCtx(() => [
                formState.value.pic ? (vue.openBlock(), vue.createBlock(_component_a_image, {
                  key: 0,
                  src: formState.value.pic,
                  preview: {
                    getContainer: () => container.value
                  },
                  width: 200
                }, null, 8, ["src", "preview"])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$2, "无"))
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { label: "视频标题" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_input, {
                  value: formState.value.title,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => formState.value.title = $event),
                  bordered: false,
                  disabled: "",
                  style: { "color": "gray" }
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { label: "视频简介" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_textarea, {
                  value: formState.value.desc,
                  "onUpdate:value": _cache[1] || (_cache[1] = ($event) => formState.value.desc = $event),
                  bordered: false,
                  autoSize: "",
                  disabled: "",
                  style: { "color": "gray" }
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { label: "备注" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_textarea, {
                  ref_key: "textareaRef",
                  ref: textareaRef,
                  value: formState.value.remark,
                  "onUpdate:value": _cache[2] || (_cache[2] = ($event) => formState.value.remark = $event),
                  "show-count": "",
                  maxlength: 500,
                  "auto-size": { minRows: 4 }
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { label: "标签" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_sfc_main$i, {
                  tags: formState.value.tags || "",
                  onChange: handleTagsChange
                }, null, 8, ["tags"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { "wrapper-col": { span: 4, offset: 11 } }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_button, {
                  type: "primary",
                  onClick: handleSubmit
                }, {
                  default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                    vue.createTextVNode("保存")
                  ])),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"]);
      };
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$1 = { key: 0 };
  const _hoisted_2$1 = {
    key: 2,
    style: { "text-align": "right" }
  };
  const _sfc_main$g = {
    __name: "Badge",
    props: [
      "bvid",
      "pic",
      "title",
      "desc",
      "remark",
      "tags",
      "ctime",
      "mtime"
    ],
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const handleChange = (record) => {
        emits("change", record);
      };
      const showModal = () => {
        view(
          props.bvid,
          (result) => {
            const { pic = props.pic, title = props.title, desc = props.desc } = result || {};
            const close = templateModal({
              title: "备注信息",
              template: _sfc_main$h,
              templateProps: {
                ...props,
                pic,
                title,
                desc,
                onChange: handleChange,
                onClose: () => close()
              }
            });
          },
          (message) => {
            messageModal({ title: "提示", message, type: "warning" });
          }
        );
      };
      return (_ctx, _cache) => {
        const _component_a_divider = vue.resolveComponent("a-divider");
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_row = vue.resolveComponent("a-row");
        const _component_a_popover = vue.resolveComponent("a-popover");
        return __props.remark || __props.tags ? (vue.openBlock(), vue.createBlock(_component_a_popover, {
          key: 0,
          placement: "topRight",
          arrowPointAtCenter: "",
          destroyTooltipOnHide: "",
          overlayInnerStyle: {
            width: "380px",
            boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.5)"
          }
        }, {
          content: vue.withCtx(() => [
            __props.remark ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_1$1, vue.toDisplayString(__props.remark), 1)) : vue.createCommentVNode("", true),
            __props.remark && __props.tags ? (vue.openBlock(), vue.createBlock(_component_a_divider, {
              key: 1,
              dashed: "",
              style: { "margin": "12px 0" }
            })) : vue.createCommentVNode("", true),
            __props.tags ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_2$1, [
              vue.createVNode(_sfc_main$j, {
                tags: __props.tags || ""
              }, null, 8, ["tags"])
            ])) : vue.createCommentVNode("", true),
            __props.ctime || __props.mtime ? (vue.openBlock(), vue.createBlock(_component_a_row, {
              key: 3,
              justify: "space-between",
              class: "custom-row-time"
            }, {
              default: vue.withCtx(() => [
                __props.ctime ? (vue.openBlock(), vue.createBlock(_component_a_col, {
                  key: 0,
                  span: 12,
                  class: "custom-col-time"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 创建时间：" + vue.toDisplayString(vue.unref(dateUtil).timestampToDate[1](__props.ctime)), 1)
                  ]),
                  _: 1
                })) : vue.createCommentVNode("", true),
                __props.mtime ? (vue.openBlock(), vue.createBlock(_component_a_col, {
                  key: 1,
                  span: 12,
                  class: "custom-col-time"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 修改时间：" + vue.toDisplayString(vue.unref(dateUtil).timestampToDate[1](__props.mtime)), 1)
                  ]),
                  _: 1
                })) : vue.createCommentVNode("", true)
              ]),
              _: 1
            })) : vue.createCommentVNode("", true)
          ]),
          default: vue.withCtx(() => [
            vue.createElementVNode("div", {
              title: "点击编辑备注",
              onClick: showModal,
              class: "ribbon"
            }, [
              vue.createVNode(vue.unref(EditOutlined))
            ])
          ]),
          _: 1
        })) : (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          title: "点击编辑备注",
          onClick: showModal,
          class: "ribbon ribbon-new"
        }, [
          vue.createVNode(vue.unref(EditOutlined))
        ]));
      };
    }
  };
  const Badge = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-83c9451e"]]);
  const _sfc_main$f = {
    __name: "Edit",
    props: [
      "bvid",
      "pic",
      "title",
      "desc",
      "remark",
      "tags",
      "ctime",
      "mtime"
    ],
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const formState = vue.ref({ ...props });
      view(
        props.bvid,
        (result) => {
          if (result) {
            formState.value.pic = result.pic;
            formState.value.title = result.title;
            formState.value.desc = result.desc;
          }
        },
        (message) => {
          messageModal({ title: "提示", message, type: "warning" });
        }
      );
      const handleChange = () => {
        emits("change", vue.toRaw(formState.value));
      };
      const handleTagsChange = (tags) => {
        formState.value.tags = tags;
        handleChange();
      };
      return (_ctx, _cache) => {
        const _component_a_textarea = vue.resolveComponent("a-textarea");
        const _component_a_form_item = vue.resolveComponent("a-form-item");
        const _component_a_form = vue.resolveComponent("a-form");
        return vue.openBlock(), vue.createBlock(_component_a_form, {
          model: formState.value,
          "label-col": { span: 3 },
          "wrapper-col": { span: 21 }
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_form_item, { label: "备注" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_textarea, {
                  value: formState.value.remark,
                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => formState.value.remark = $event),
                  "show-count": "",
                  maxlength: 500,
                  "auto-size": { minRows: 4, maxRows: 10 },
                  onChange: handleChange
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_form_item, { label: "标签" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_sfc_main$i, {
                  tags: formState.value.tags || "",
                  onChange: handleTagsChange
                }, null, 8, ["tags"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"]);
      };
    }
  };
  let currPage$1 = (() => {
    const curr = biliUtil.getCurrLocation();
    if (curr === config$4.base.match[0].replace(/{{uid}}/, biliUtil.getUid())) {
      return "fav";
    } else if (curr === config$4.base.match[1].replace(/{{bvid}}/, biliUtil.getCurrBvid())) {
      return "video";
    } else {
      return "";
    }
  })();
  let fav = null;
  let nodeList = null;
  let collection = null;
  let appInstances = [];
  const insertOrUpdate = (record) => {
    let index2 = null;
    const result = config$4.data.find((o, i) => {
      index2 = i;
      return o.bvid === record.bvid;
    });
    if (!result) {
      config$4.data.push(record);
    } else {
      config$4.data.splice(index2, 1);
      config$4.data.splice(index2, 0, record);
    }
    controller$3.useChangeHandler();
  };
  const unmountApp = () => {
    appInstances.forEach((item) => {
      if (item) item.unmount();
    });
    appInstances = [];
  };
  const fav_getBvid = (el) => {
    const a = el.querySelector("a:first-child");
    const href = a == null ? void 0 : a.getAttribute("href");
    const path = href == null ? void 0 : href.split("?")[0];
    const temp = path == null ? void 0 : path.split("/video/");
    return temp && temp.length > 1 ? temp[1] : "";
  };
  const fav_render = () => {
    unmountApp();
    nodeList == null ? void 0 : nodeList.forEach((wrap) => {
      const bvid = fav_getBvid(wrap);
      const result = config$4.data.find((o) => o.bvid === bvid);
      const target = vue.ref(result || { bvid });
      const app = vue.createApp({
        render: () => {
          return vue.h(Badge, {
            ...target.value,
            onChange: (record) => {
              target.value = record;
              insertOrUpdate(target.value);
            }
          });
        }
      });
      app.use(Antd);
      app.mount(
        (() => {
          let remark = wrap.querySelector(".bili-video-card__remark");
          if (!remark) {
            remark = document.createElement("div");
            remark.classList.add("bili-video-card__remark");
            wrap.appendChild(remark);
          }
          return remark;
        })()
      );
      appInstances.push(app);
    });
  };
  const fav_remove = () => {
    nodeList == null ? void 0 : nodeList.forEach((wrap) => {
      const remark = wrap.querySelector(".bili-video-card__remark");
      remark && remark.remove();
    });
  };
  const fav_observer = new MutationObserver((mutations) => {
    let newNodeList = [];
    for (const item of mutations) {
      let wrap = null;
      if (item.target.classList.contains("items")) {
        if (item.addedNodes.length > 0) {
          const items_item = item.addedNodes[0];
          const card = items_item == null ? void 0 : items_item.querySelector(".bili-video-card");
          wrap = card == null ? void 0 : card.querySelector(".bili-video-card__wrap");
        }
      }
      if (item.target.classList.contains("bili-video-card")) {
        if (item.addedNodes.length > 0) {
          wrap = item.addedNodes[0];
        }
      }
      wrap && newNodeList.push(wrap);
    }
    if (newNodeList.length > 0) {
      nodeList = newNodeList;
      fav_render();
    }
  });
  const video_getBvid = () => {
    return location.pathname.split("/")[2];
  };
  const video_render = () => {
    const bvid = video_getBvid();
    if (!collection || !bvid) return;
    unmountApp();
    const result = config$4.data.find((o) => o.bvid === bvid);
    const target = vue.ref(result || { bvid });
    const app = vue.createApp({
      render: () => {
        return vue.h(_sfc_main$f, {
          ...target.value,
          onChange: (record) => {
            target.value = record;
          }
        });
      }
    });
    app.use(Antd);
    app.mount(
      (() => {
        let remark = collection.querySelector(".collection__remark");
        if (!remark) {
          const bottom = collection.querySelector(".bottom");
          remark = document.createElement("div");
          remark.classList.add("collection__remark");
          collection.insertBefore(remark, bottom);
          const button = bottom.querySelector("button");
          button && button.addEventListener("click", () => {
            if (!target.value.ctime) {
              target.value.ctime = Date.now();
            }
            target.value.mtime = Date.now();
            insertOrUpdate(target.value);
          });
        }
        return remark;
      })()
    );
    appInstances.push(app);
  };
  const video_remove = () => {
    const remark = collection == null ? void 0 : collection.querySelector(".collection__remark");
    remark && remark.remove();
  };
  const video_observer = new MutationObserver((mutations) => {
    for (const item of mutations) {
      item.addedNodes.forEach((el) => {
        var _a;
        if ((_a = el.classList) == null ? void 0 : _a.contains("bili-dialog-m")) {
          collection = el.querySelector(".collection-m-exp");
          if (collection) {
            video_render();
            return;
          }
        }
      });
    }
  });
  const install$1 = () => {
    if (currPage$1 === "fav") {
      fav = document.querySelector(".fav-list-main > .items");
      nodeList = fav == null ? void 0 : fav.querySelectorAll(".bili-video-card__wrap");
      if (nodeList && nodeList.length > 0) fav_render();
      fav_observer.observe(document.body, { childList: true, subtree: true });
    } else if (currPage$1 === "video") {
      collection = document.querySelector(".bili-dialog-m .collection-m-exp");
      if (collection) video_render();
      video_observer.observe(document.body, { childList: true });
    }
  };
  const uninstall$1 = () => {
    if (currPage$1 === "fav") {
      fav_observer.disconnect();
      fav_remove();
      nodeList = null;
      fav = null;
    } else if (currPage$1 === "video") {
      video_observer.disconnect();
      video_remove();
      collection = null;
    }
  };
  const toggle$1 = () => {
    if (config$4.base.isActive) {
      install$1();
      console.log("开启收藏夹备注功能");
    } else {
      uninstall$1();
      console.log("关闭收藏夹备注功能");
    }
  };
  const init$5 = () => {
    toggle$1();
    console.log("初始化收藏夹备注功能完成");
  };
  const reset$4 = () => {
    toggle$1();
    console.log("重置收藏夹备注功能完成");
  };
  const click$2 = () => {
    config$4.base.isActive = !config$4.base.isActive;
    toggle$1();
    controller$3.useChangeHandler();
    console.log("切换收藏夹备注功能完成");
  };
  const plugin$2 = new Plugin({
    name: "收藏视频备注",
    description: "一键开启收藏夹备注功能，支持在视频页面和收藏夹页面内编辑备注信息",
    icon: FolderOutlined,
    type: "persistent",
    $init: init$5,
    $reset: reset$4,
    $click: click$2
  });
  const _sfc_main$e = {
    __name: "Option",
    setup(__props) {
      const handleChange = (_2, e) => {
        e.preventDefault();
        click$2();
      };
      return (_ctx, _cache) => {
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_switch = vue.resolveComponent("a-switch");
        const _component_a_row = vue.resolveComponent("a-row");
        return vue.openBlock(), vue.createBlock(_component_a_row, {
          justify: "space-between",
          class: "custom-row"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_col, {
              span: 18,
              style: { "color": "#a9a9a9" }
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(vue.unref(plugin$2).description), 1)
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_switch, {
                  checked: vue.unref(config$4).base.isActive,
                  onChange: handleChange
                }, null, 8, ["checked"])
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  };
  const index$2 = {
    self: plugin$2,
    config: controller$3,
    Option: _sfc_main$e
  };
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: index$2
  }, Symbol.toStringTag, { value: "Module" }));
  const note = (bvid, execute, error) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/note/list/archive";
    let params = {
      oid: biliUtil.bv2av(bvid),
      oid_type: 0
    };
    return request$2.get(url, params, execute, error);
  };
  const info = (bvid, noteId, execute, error) => {
    if (!bvid || !noteId) return;
    let url = "https://api.bilibili.com/x/note/info";
    let params = {
      oid: biliUtil.bv2av(bvid),
      oid_type: 0,
      note_id: noteId
    };
    return request$2.get(url, params, execute, error);
  };
  class TemplateFactory {
    /**
     * 创建一个模板工厂
     * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
     */
    constructor(videoType) {
      this.videoType = videoType;
    }
    /**
     * 获取对应视频类型的模板
     * @returns 模板对象
     */
    getTemplate() {
      if (!["single", "multip", "season"].includes(this.videoType)) {
        throw new Error("parameter videoType is invalid");
      }
      return {};
    }
  }
  const _template$2 = {
    tips: () => {
      return `> [!warning] 警告！！！
> - 如果有出链，先查看出链面板下的数据是否识别成功
> - 打开“设置”-“选项”-“文件与链接”-“始终更新内部链接”功能
> - 确认后方可重新修改笔记名称
> - 没有出链的可直接忽略以上步骤
> - 确认笔记无误后可根据情况删除该警告

`;
    },
    info: (type, cover, title, url, desc) => {
      return `# ${type}信息

![](${cover})

**标题：** ${title}[ ](${url})

**简介：** ${desc}

`;
    },
    catalog: (catalog) => {
      return `# 目录清单

${catalog}`;
    },
    note: (note2) => {
      return `# 笔记内容

${note2}`;
    }
  };
  const renderSingle$1 = ({ info: { cover, title, url, desc }, note: note2 }) => {
    return _template$2.info("视频", cover, title, url, desc).concat(_template$2.note(note2));
  };
  const renderMultip$1 = ({ info: { cover, title, url, desc }, catalog, note: note2 }) => {
    return _template$2.tips().concat(
      _template$2.info("视频", cover, title, url, desc),
      _template$2.catalog(catalog),
      _template$2.note(note2)
    );
  };
  const renderSeasonCatalog = ({ info: { cover, title, url, desc }, catalog }) => {
    return _template$2.tips().concat(_template$2.info("合集", cover, title, url, desc), _template$2.catalog(catalog));
  };
  class FileTemplateFactory extends TemplateFactory {
    /**
     * 创建一个文件模板工厂
     * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
     */
    constructor(videoType) {
      super(videoType);
    }
    /**
     * 获取对应视频类型的文件模板
     * @returns {{render: Function}} 文件模板对象
     */
    getTemplate() {
      const template = super.getTemplate();
      if (this.videoType === "single") {
        template.render = renderSingle$1;
      } else if (this.videoType === "multip") {
        template.render = renderMultip$1;
      } else if (this.videoType === "season") {
        template.render = renderSeasonCatalog;
      }
      return template;
    }
  }
  const _template$1 = {
    callout_tasklist: (catalogs, type) => {
      return renderCallout(type, "- [ ]", catalogs);
    },
    callout_orderedlist: (catalogs, type) => {
      return renderCalloutOrderedlist(type, catalogs);
    },
    callout_bulletedlist: (catalogs, type) => {
      return renderCallout(type, "-", catalogs);
    },
    callout: (catalogs, type) => {
      return renderCallout(type, "", catalogs);
    },
    quotes_tasklist: (catalogs) => {
      return renderQuotes("- [ ]", catalogs);
    },
    quotes_orderedlist: (catalogs) => {
      return renderQuotesOrderedlist(catalogs);
    },
    quotes_bulletedlist: (catalogs) => {
      return renderQuotes("-", catalogs);
    },
    quotes: (catalogs) => {
      return renderQuotes("", catalogs);
    },
    horizontalrule_tasklist: (catalogs) => {
      return renderHorizontalrule("- [ ]", catalogs);
    },
    horizontalrule_orderedlist: (catalogs) => {
      return renderHorizontalruleOrderedlist(catalogs);
    },
    horizontalrule_bulletedlist: (catalogs) => {
      return renderHorizontalrule("-", catalogs);
    },
    horizontalrule: (catalogs) => {
      return renderHorizontalrule("", catalogs);
    }
  };
  const renderCallout = (type, prefix, catalogs) => {
    return `> [!info]+ 视频${type}
${catalogs.map((item) => `> ${prefix}${prefix && " "}${item.outlink}`).join("  \n").concat("  \n")}
`;
  };
  const renderCalloutOrderedlist = (type, catalogs) => {
    return `> [!info]+ 视频${type}
${catalogs.map((item) => `> ${item.index}. ${item.outlink}`).join("  \n").concat("  \n")}
`;
  };
  const renderQuotes = (prefix, catalogs) => {
    return `${catalogs.map((item) => `> ${prefix}${prefix && " "}${item.outlink}`).join("  \n").concat("  \n")}
`;
  };
  const renderQuotesOrderedlist = (catalogs) => {
    return `${catalogs.map((item) => `> ${item.index}. ${item.outlink}`).join("  \n").concat("  \n")}
`;
  };
  const renderHorizontalrule = (prefix, catalogs) => {
    return `---
${catalogs.map((item) => `${prefix}${prefix && " "}${item.outlink}`).join("  \n").concat("  \n")}---

`;
  };
  const renderHorizontalruleOrderedlist = (catalogs) => {
    return `---
${catalogs.map((item) => `${item.index}. ${item.outlink}`).join("  \n").concat("  \n")}---

`;
  };
  const render = (catalogs, type, style2) => {
    return _template$1[style2](catalogs, type);
  };
  class CatalogTemplateFactory extends TemplateFactory {
    /**
     * 创建一个目录清单模块模板工厂
     * @param {string}          videoType      视频类型：single-单视频，multip-选集，season-合集
     * @param {{style: string}} [option]       可选配置
     * @param {string}          [option.style] 目录清单风格：同_template的key
     */
    constructor(videoType, option = { style }) {
      super(videoType);
      this.style = option == null ? void 0 : option.style;
    }
    /**
     * 获取对应风格的目录清单模块模板
     * @returns {{render: Function}} 目录清单模块模板对象
     */
    getTemplate() {
      const template = super.getTemplate();
      if (this.videoType === "single") {
        template.render = () => "";
      } else if (this.videoType === "multip") {
        template.render = ({ catalogs }) => {
          return render(catalogs, "选集", this.style);
        };
      } else if (this.videoType === "season") {
        template.render = ({ catalogs }) => {
          return render(catalogs, "合集", this.style);
        };
      }
      return template;
    }
  }
  const _template = {
    title: (title, url) => {
      return `## ${title}
> 视频地址：[${url}](${url})

`;
    },
    content: (content) => {
      return `${content}

`;
    }
  };
  const renderSingle = ({ notes }) => {
    const note2 = notes == null ? void 0 : notes.find((item) => item.p === 1);
    return (note2 == null ? void 0 : note2.content) ? _template.content(note2.content) : "";
  };
  const renderMultip = ({ catalogs, notes }) => {
    return catalogs.map((item) => {
      const note2 = notes.find((obj) => obj.p === item.index);
      return _template.title(item.title, item.url).concat(note2 && note2.content ? _template.content(note2.content) : "");
    }).join("");
  };
  class NoteTemplateFactory extends TemplateFactory {
    /**
     * 创建一个笔记内容模块模板工厂
     * @param {string} videoType 视频类型：single-单视频，multip-选集，season-合集
     */
    constructor(videoType) {
      super(videoType);
    }
    /**
     * 获取对应笔记标题格式的笔记内容模块模板
     * @returns {{render: Function}} 笔记内容模块模板对象
     */
    getTemplate() {
      const template = super.getTemplate();
      if (this.videoType === "single") {
        template.render = renderSingle;
      } else if (this.videoType === "multip") {
        template.render = renderMultip;
      } else if (this.videoType === "season") {
        template.render = () => "";
      }
      return template;
    }
  }
  class CatalogItem {
    constructor(index2, title, url, outlink) {
      this.index = index2;
      this.title = title;
      this.url = url;
      this.outlink = outlink;
    }
  }
  class EpisodeCatalog {
    /**
     * 创建一个合集目录清单处理对象
     * @param {{bvid: string, title: string}[]} episodes                合集数组
     * @param {string}                          episodes.item.bvid      视频bvid
     * @param {string}                          episodes.item.title     视频标题
     * @param {{fileName: string}[]}            files                   笔记文件数组
     * @param {string}                          files.item.fileName     笔记文件名
     * @param {{outlinkHandler: Function}}      [option]                可选配置
     * @param {Function}                        [option.outlinkHandler] 出链处理器
     */
    constructor(episodes, files, option = { outlinkHandler }) {
      this.episodes = episodes;
      this.files = files;
      this.outlinkHandler = option == null ? void 0 : option.outlinkHandler;
    }
    /**
     * 处理合集目录清单数据并输出结果
     * @returns {CatalogItem} 处理结果
     */
    data() {
      if (!this.episodes || !this.episodes.length || this.episodes.length === 0) return [];
      return this.episodes.map((o, index2) => {
        var _a;
        const fileName = ((_a = this.files[index2]) == null ? void 0 : _a.fileName) || "";
        const outlink = this.outlinkHandler ? this.outlinkHandler(fileName) : fileName;
        const url = `https://www.bilibili.com/video/${o.bvid}`;
        return new CatalogItem(index2 + 1, o.title, url, outlink);
      });
    }
  }
  class PageCaltalog {
    /**
     * 创建一个选集目录清单处理对象
     * @param {string}                         bvid                    视频bvid
     * @param {{page: number, part: string}[]} pages                   分P数组
     * @param {number}                         pages.item.page         分P数
     * @param {string}                         pages.item.part         分P标题
     * @param {{
     *          titleHandler: Function,
     *          outlinkHandler: Function,
     *        }}                               [option]                可选配置
     * @param {Function}                       [option.titleHandler]   分P标题处理器
     * @param {Function}                       [option.outlinkHandler] 出链处理器
     */
    constructor(bvid, pages, option = { titleHandler, outlinkHandler }) {
      this.bvid = bvid;
      this.pages = pages;
      this.titleHandler = option == null ? void 0 : option.titleHandler;
      this.outlinkHandler = option == null ? void 0 : option.outlinkHandler;
    }
    /**
     * 处理选集目录清单数据并输出结果
     * @returns {CatalogItem} 处理结果
     */
    data() {
      if (!this.bvid) throw new Error("bvid is not found.");
      if (!this.pages || !this.pages.length || this.pages.length === 0) return [];
      return this.pages.map((o) => {
        const title = this.titleHandler ? this.titleHandler(o.page, o.part) : o.part;
        const outlink = this.outlinkHandler ? this.outlinkHandler(title) : title;
        const url = `https://www.bilibili.com/video/${this.bvid}?p=${o.page}`;
        return new CatalogItem(o.page, title, url, outlink);
      });
    }
  }
  class NoteItem {
    constructor(p, content) {
      this.p = p;
      this.content = content;
    }
  }
  class Note {
    /**
     * 创建一个笔记内容处理对象
     * @param {string}                  bvid                  视频bvid
     * @param {string}                  raw                   B站接口返回的笔记原文
     * @param {{
     *          textHandler: Function,
     *          tagHandler: Function,
     *          imageHandler: Function,
     *        }}                        [option]              可选配置
     * @param {Function}                [option.textHandler]  文本处理器
     * @param {Function}                [option.tagHandler]   时间戳处理器
     * @param {Function}                [option.imageHandler] 图片处理器
     */
    constructor(bvid, raw, option = { textHandler, tagHandler, imageHandler }) {
      this.bvid = bvid;
      this.raw = raw;
      this.textHandler = option == null ? void 0 : option.textHandler;
      this.tagHandler = option == null ? void 0 : option.tagHandler;
      this.imageHandler = option == null ? void 0 : option.imageHandler;
    }
    /**
     * 处理笔记内容并输出结果
     * @returns {NoteItem[]} 处理结果
     */
    data() {
      if (!this.bvid) throw new Error("bvid is not found.");
      if (!this.raw) return [];
      const contents = JSON.parse(this.raw);
      if (!contents || !contents.length || contents.length === 0) return [];
      let line = [];
      const lines = [line];
      for (let item of contents) {
        if (typeof item.insert === "object") {
          if (item.insert.tag && line.length > 0) {
            line = [];
            lines.push(line);
          }
          line.push(item);
          continue;
        }
        if (!/\n/.test(item.insert)) {
          line.push(item);
          continue;
        }
        const temp = item.insert.split(/\n/);
        for (let i = 0; i < temp.length; i++) {
          if (i > 0) {
            line = [];
            lines.push(line);
          }
          if (i < temp.length - 1 && (temp[i] || item.attributes) || temp[i]) {
            line.push({ insert: temp[i], attributes: item.attributes });
          }
        }
      }
      let note2 = new NoteItem(1, "");
      const notes = [note2];
      let preLine = null;
      lines.forEach((line2) => {
        let lineText = "";
        const tagStack = [];
        let preItem = null;
        line2.forEach((item, index2) => {
          if (typeof item.insert === "string") {
            if (this.textHandler) {
              lineText = this.textHandler(preLine, lineText, preItem, item, tagStack);
              if (index2 === line2.length - 1) {
                lineText = this.textHandler(preLine, lineText, item, null, tagStack);
              }
            } else {
              lineText += item.insert;
            }
          }
          if (item.insert.tag) {
            const index3 = item.insert.tag.index;
            if (index3 !== note2.p) {
              const temp = notes.find((obj) => obj.p === index3);
              if (!temp) {
                note2 = new NoteItem(index3, "");
                notes.push(note2);
              } else {
                note2 = temp;
              }
            }
            lineText += this.tagHandler ? this.tagHandler(this.bvid, { ...item.insert.tag }) : "";
          }
          if (item.insert.imageUpload) {
            lineText += this.imageHandler ? this.imageHandler({ ...item.insert.imageUpload }) : "";
          }
          preItem = item;
          preLine = null;
        });
        note2.content = note2.content.concat(lineText, "\n\n");
        preLine = line2;
      });
      return notes;
    }
  }
  const pluginConfig$1 = new PluginConfig({
    base: {
      match: ["https://www.bilibili.com/video/{{bvid}}/"],
      isActive: false,
      isOnlySwitchCurrActive: false
    },
    option: {
      isOnlyCurr: true,
      catalog: {
        style: "callout_tasklist",
        newline: "  "
      },
      title: {
        pattern: "P{x} 📺 {xxx}",
        level: "##"
      },
      note: {
        mode: "markdown",
        isExtended: false,
        syntax: {
          newline: "\n",
          bold: "**",
          list: "-"
        }
      }
    },
    data: []
  });
  const configRef$2 = new ConfigRef(pluginConfig$1);
  const config$3 = configRef$2._self();
  const controller$2 = configRef$2.getController();
  const reg = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]/g;
  const fileNameHandler = (fileName) => {
    return fileName.replace(/[\\\/\:\*\?\"\<\>\|]/g, "");
  };
  const pageTitleHandler = (p, title) => {
    title = title.replace(reg, "\\$&");
    return config$3.option.title.pattern ? config$3.option.title.pattern.replace(/{x}/g, p).replace(/{xxx}/g, title) : title;
  };
  const mdOutlink = (fileName) => {
    const ascll = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/ ]/g;
    const encode = ($0) => {
      return !["(", ")"].includes($0) ? encodeURI($0) : $0 == "(" ? "%28" : "%29";
    };
    const mdDisplayReg = { r: /(\[\])/g, $: "\\$1" };
    const mdLinkReg = { r: ascll, $: encode };
    return {
      display: fileName.replace(mdDisplayReg.r, mdDisplayReg.$),
      link: fileName.replace(mdLinkReg.r, mdLinkReg.$)
    };
  };
  const wikiOutlink = (fileName) => {
    const wikiDisplayReg = { r: /(\[\])/g, $: " $1" };
    const wikiLinkReg = { r: /[\#\^\|\\]/g, $: " " };
    return {
      display: fileName.replace(wikiDisplayReg.r, wikiDisplayReg.$),
      link: fileName.replace(wikiLinkReg.r, wikiLinkReg.$)
    };
  };
  const episodeOutlinkHandler = (fileName) => {
    const md = mdOutlink(fileName);
    const wiki = wikiOutlink(fileName);
    return config$3.option.note.mode === "obsidian" ? `[[${wiki.link}|${wiki.display.slice(0, -3)}]]` : `[${md.display.slice(0, -3)}](${md.link})`;
  };
  const pageOutlinkHandler = (fileName) => {
    return (title) => {
      const md = mdOutlink(title);
      const wiki = wikiOutlink(title);
      return config$3.option.note.mode === "obsidian" ? `[[${fileName}#${wiki.link}|${wiki.display}]]` : `[${md.display}](${mdOutlink(fileName).link}#${md.link})`;
    };
  };
  const textHandler$1 = () => {
    let indentLevel = [];
    const isExtended = config$3.option.note.isExtended;
    const rank = (() => {
      if (isExtended) {
        return [
          { name: "underline", start: "<u>", end: "</u>", sort: 0 },
          { name: "strike", start: "<s>", end: "</s>", sort: 1 },
          { name: "bold", start: "<b>", end: "</b>", sort: 2 },
          { name: "background", start: "<span>", end: "</span>", sort: 3 },
          { name: "color", start: "<span>", end: "</span>", sort: 3 },
          { name: "size", start: "<span>", end: "</span>", sort: 3 }
        ];
      } else {
        let temp = config$3.option.note.syntax.bold;
        if (config$3.option.note.mode === "obsidian") {
          return [
            { name: "bold", start: temp, end: temp, sort: 0 },
            { name: "strike", start: "~~", end: "~~", sort: 1 },
            { name: "background", start: "==", end: "==", sort: 2 }
          ];
        } else {
          return [{ name: "bold", start: temp, end: temp }];
        }
      }
    })();
    const cross = (obj1, obj2) => {
      if (!obj1 || !obj2) return {};
      const result = {};
      for (const key in obj1) {
        if (isExtended) {
          if (obj2.hasOwnProperty(key) && obj1[key] === obj2[key]) {
            result[key] = obj1[key];
          }
        } else {
          if (obj2.hasOwnProperty(key)) {
            result[key] = obj1[key];
          }
        }
      }
      return result;
    };
    const diff = (target, pattern) => {
      if (!target) return {};
      const result = {};
      for (const key in target) {
        if (!pattern.hasOwnProperty(key)) {
          result[key] = target[key];
        }
      }
      return result;
    };
    const suffix = (tagStack, closedTags, open, close) => {
      let max = 0;
      let keyArr = Object.keys(open);
      if (keyArr.length > 0) {
        keyArr.forEach((key) => {
          const target = rank.find((item) => item.name === key);
          if (target && target.sort > max) max = target.sort;
        });
      }
      keyArr = Object.keys(close);
      if (keyArr.length > 0) {
        keyArr.forEach((key) => {
          let index2 = -1;
          const target = tagStack.find((item, i) => {
            if (item.name === key) {
              index2 = i;
              return item;
            }
          });
          if (index2 > -1) {
            closedTags.push(...tagStack.splice(index2, 1));
            if (target.sort > max) max = target.sort;
          }
        });
      }
      if (isExtended) {
        closedTags.push(...tagStack.filter((item) => item.sort <= max));
      } else {
        closedTags.push(...tagStack.filter((item) => item.sort < max));
      }
      return closedTags.length > 0 ? closedTags.reduce((acc, curr) => {
        if (!acc.find((item) => item.sort === curr.sort)) acc.push({ ...curr });
        return acc;
      }, []).sort((a, b) => a.sort - b.sort).map((item) => item.end).join("") : "";
    };
    const prefix = (tagStack, closedTags, same, open) => {
      const skip = [];
      let keyArr = Object.keys(same);
      if (keyArr.length > 0) {
        keyArr.forEach((key) => {
          if (!closedTags.find((item) => item.name === key)) skip.push(key);
        });
      }
      keyArr = Object.keys(open);
      if (keyArr.length > 0) {
        keyArr.forEach((key) => {
          let target = rank.find((item) => item.name === key);
          if (target) {
            if (isExtended && target.sort === 3) {
              const styleName = target.name === "size" ? "font-size" : target.name;
              if (same.hasOwnProperty(target.name)) {
                target.start = `${styleName}: ${same[target.name]}`;
              }
              if (open.hasOwnProperty(target.name)) {
                target.start = `${styleName}: ${open[target.name]}`;
              }
            }
            tagStack.push(target);
          }
        });
      }
      return tagStack.length > 0 ? tagStack.reduce((acc, curr) => {
        if (!skip.includes(curr.name)) {
          const target = acc.find((item) => item.sort === curr.sort);
          if (target && isExtended && target.sort === 3) {
            target.name += `,${curr.name}`;
            target.start += `;${curr.start}`;
          } else {
            acc.push({ ...curr });
          }
        }
        return acc;
      }, []).sort((a, b) => b.sort - a.sort).map((item) => {
        if (isExtended && item.sort === 3) {
          item.start = `<span style="${item.start}">`;
        }
        return item.start;
      }).join("") : "";
    };
    const listfix = (indent = 0, list) => {
      if (list === "ordered") {
        const number = indentLevel[indent] ? indentLevel[indent] + 1 : 1;
        indentLevel[indent] = number;
        for (let i = indent + 1; i < indentLevel.length; i++) {
          indentLevel[i] = 0;
        }
        return `${"	".repeat(indent)}${number}. `;
      } else {
        return `${"	".repeat(indent)}${config$3.option.note.syntax.list} `;
      }
    };
    return (preLine, line, preItem, item, tagStack) => {
      const insert = (item == null ? void 0 : item.insert) || "";
      const attributes = (item == null ? void 0 : item.attributes) || {};
      const same = cross(preItem == null ? void 0 : preItem.attributes, attributes);
      const close = diff(preItem == null ? void 0 : preItem.attributes, same);
      const open = diff(attributes, same);
      const closedTags = [];
      line += suffix(tagStack, closedTags, open, close);
      line += prefix(tagStack, closedTags, same, open);
      if (attributes == null ? void 0 : attributes.list) {
        line = listfix(attributes.indent, attributes.list) + line;
      }
      if (preLine && !preLine.find((o) => {
        var _a;
        return ((_a = o.attributes) == null ? void 0 : _a.list) === "ordered";
      })) {
        indentLevel = [];
      }
      if (isExtended && Object.keys(attributes).length > 0) {
        return `${line}${insert}`;
      } else {
        return `${line}${insert.replace(reg, "\\$&")}`;
      }
    };
  };
  const tagHandler$1 = (bvid, { cidCount, desc, index: index2, seconds, title }) => {
    return cidCount === 1 ? `[🏁 ${dateUtil.formatSeconds[1](seconds)}${desc ? " " + desc : ""}](https://www.bilibili.com/video/${bvid}?t=${seconds})` : `[🏁 ${title} P${index2} - ${dateUtil.formatSeconds[1](seconds)}${desc ? " " + desc : ""}](https://www.bilibili.com/video/${bvid}?p=${index2}#t=${seconds})`;
  };
  const imageHandler$1 = (folder) => {
    let images = [];
    return (action) => {
      if (action === "list") {
        return images;
      } else {
        return ({ id, url }) => {
          const fileName = `${id}.jpg`;
          images.push({ fileName, url });
          return config$3.option.note.mode === "obsidian" ? `![[${folder}/${fileName}]]` : `![](${folder}/${fileName})`;
        };
      }
    };
  };
  let imageActionHandler;
  const getNoteContent = async (bvid) => {
    const noteRes = await note(bvid);
    const noteIds = noteRes == null ? void 0 : noteRes.noteIds;
    if (!noteIds || !noteIds.length || noteIds.length === 0) return "";
    const infoRes = await info(bvid, noteIds[0]);
    return (infoRes == null ? void 0 : infoRes.content) || "";
  };
  const getNoteFile = async (data2) => {
    const fileName = `${fileNameHandler(data2.title)}.md`;
    const bvid = data2.bvid;
    const pages = data2.pages;
    const videoType = pages.length > 1 ? "multip" : "single";
    const arcOrData = data2.arc ? data2.arc : data2;
    const fileTemplate = new FileTemplateFactory(videoType).getTemplate();
    const catalogTemplate = new CatalogTemplateFactory(videoType, {
      style: config$3.option.catalog.style
    }).getTemplate();
    const noteTemplate = new NoteTemplateFactory(videoType).getTemplate();
    const info2 = {
      cover: arcOrData.pic,
      title: arcOrData.title,
      url: `https://www.bilibili.com/video/${bvid}`,
      desc: arcOrData.desc
    };
    const catalog = new PageCaltalog(bvid, pages, {
      titleHandler: pageTitleHandler,
      outlinkHandler: pageOutlinkHandler(fileName)
    });
    const catalogs = catalog.data();
    const catalogText = catalogTemplate.render({ catalogs });
    const note2 = new Note(bvid, await getNoteContent(bvid), {
      textHandler: textHandler$1(),
      tagHandler: tagHandler$1,
      imageHandler: imageActionHandler("save")
    });
    const notes = note2.data();
    const noteText = noteTemplate.render({ catalogs, notes });
    const fileContent = fileTemplate.render({ info: info2, catalog: catalogText, note: noteText });
    return { fileName, fileContent };
  };
  const getNoteFiles = async (bvid) => {
    var _a;
    if (!bvid) return [];
    const files = [];
    const result = await view(bvid);
    if (result.ugc_season && !config$3.option.isOnlyCurr) {
      const episodes = (_a = result.ugc_season.sections) == null ? void 0 : _a.reduce((acc, curr) => {
        return acc.concat((curr == null ? void 0 : curr.episodes) || []);
      }, []);
      if (!episodes || !episodes.length || episodes.length === 0) return [];
      const upUid = result.ugc_season.mid;
      const seasonId = result.ugc_season.id;
      if (!upUid || !seasonId) return [];
      for (let i = 0; i < episodes.length; i++) {
        const item = episodes[i];
        item.title = `${i + 1}. ${item.title}`;
        files.push(await getNoteFile(item));
      }
      const fileTemplate = new FileTemplateFactory("season").getTemplate();
      const catalogTemplate = new CatalogTemplateFactory("season", {
        style: config$3.option.catalog.style
      }).getTemplate();
      const info2 = {
        cover: result.ugc_season.cover,
        title: result.ugc_season.title,
        url: `https://space.bilibili.com/${upUid}/lists/${seasonId}?type=season`,
        desc: result.ugc_season.intro
      };
      const catalog = new EpisodeCatalog(episodes, files, {
        outlinkHandler: episodeOutlinkHandler
      });
      const catalogs = catalog.data();
      const catalogText = catalogTemplate.render({ catalogs });
      const fileName = "0. 合集目录.md";
      const fileContent = fileTemplate.render({ info: info2, catalog: catalogText });
      files.push({ fileName, fileContent });
    } else {
      files.push(await getNoteFile(result));
    }
    return files;
  };
  const downloadNote = async (bvid) => {
    const files = {};
    const notes = await getNoteFiles(bvid);
    const images = imageActionHandler("list");
    const folderName = `B站笔记${Date.now()}`;
    const attachmentName = "附件";
    notes.forEach((item) => {
      files[`${folderName}/${item.fileName}`] = fflate.strToU8(item.fileContent);
    });
    if (images && images.length > 0) {
      for (const item of images) {
        const content = await fetch(item.url, {
          method: "GET",
          credentials: "include",
          mode: "cors"
        }).then((response) => response.arrayBuffer());
        files[`${folderName}/${attachmentName}/${item.fileName}`] = new Uint8Array(content);
      }
    }
    fflate.zip(files, (error, zipped) => {
      if (error) throw error;
      const blob = new Blob([zipped], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  const init$4 = () => {
    console.log("初始化笔记&清单功能完成");
  };
  const reset$3 = () => {
    console.log("重置笔记&清单功能完成");
  };
  const click$1 = () => {
    const bvid = biliUtil.getCurrBvid();
    if (!bvid) {
      messageModal({ title: "信息", message: "请进入视频页再使用！" });
      return;
    }
    imageActionHandler = imageHandler$1("附件");
    messageModal({
      title: "信息",
      message: "处理中……视频数量越多需要时间越长。下载完成后请手动关闭弹窗！"
    });
    downloadNote(bvid);
  };
  const plugin$1 = new Plugin({
    name: "视频笔记下载",
    description: "一键下载视频的分p/合集目录清单及私人笔记内容，进入视频页面后使用",
    icon: ProfileOutlined,
    type: "immediate",
    $init: init$4,
    $reset: reset$3,
    $click: click$1
  });
  const LOADING_TIME$1 = 2e3;
  const _sfc_main$d = {
    __name: "Option",
    props: {
      container: {
        type: Object,
        required: true,
        default: document.body
      }
    },
    setup(__props) {
      const state = vue.ref({
        download: false
      });
      const handleClick = () => {
        state.value.download = true;
        click$1();
        setTimeout(() => {
          state.value.download = false;
        }, LOADING_TIME$1);
      };
      const handleChange = () => {
        controller$2.useChangeHandler();
      };
      return (_ctx, _cache) => {
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_row = vue.resolveComponent("a-row");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_switch = vue.resolveComponent("a-switch");
        const _component_a_select_option = vue.resolveComponent("a-select-option");
        const _component_a_select = vue.resolveComponent("a-select");
        const _component_a_divider = vue.resolveComponent("a-divider");
        const _component_a_input = vue.resolveComponent("a-input");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, {
                span: 18,
                style: { "color": "#a9a9a9" }
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(vue.unref(plugin$1).description), 1)
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_button, {
                    loading: state.value.download,
                    onClick: handleClick
                  }, {
                    default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                      vue.createTextVNode("立即执行")
                    ])),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => [
                  _cache[8] || (_cache[8] = vue.createTextVNode(" 合集视频只下载当前视频的笔记 ")),
                  vue.createVNode(_component_a_tooltip, {
                    getPopupContainer: () => __props.container,
                    title: "合集的视频数量影响笔记下载速度"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_switch, {
                    checked: vue.unref(config$3).option.isOnlyCurr,
                    "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => vue.unref(config$3).option.isOnlyCurr = $event),
                    onChange: handleChange
                  }, null, 8, ["checked"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                  vue.createTextVNode("目录清单风格")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    value: vue.unref(config$3).option.catalog.style,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(config$3).option.catalog.style = $event),
                    onChange: handleChange,
                    style: { "width": "160px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: "callout_tasklist" }, {
                        default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                          vue.createTextVNode("callout + 任务列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "callout_orderedlist" }, {
                        default: vue.withCtx(() => _cache[11] || (_cache[11] = [
                          vue.createTextVNode("callout + 有序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "callout_bulletedlist" }, {
                        default: vue.withCtx(() => _cache[12] || (_cache[12] = [
                          vue.createTextVNode("callout + 无序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "callout" }, {
                        default: vue.withCtx(() => _cache[13] || (_cache[13] = [
                          vue.createTextVNode("callout")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "quotes_tasklist" }, {
                        default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                          vue.createTextVNode("引用块 + 任务列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "quotes_orderedlist" }, {
                        default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                          vue.createTextVNode("引用块 + 有序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "quotes_bulletedlist" }, {
                        default: vue.withCtx(() => _cache[16] || (_cache[16] = [
                          vue.createTextVNode("引用块 + 无序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "quotes" }, {
                        default: vue.withCtx(() => _cache[17] || (_cache[17] = [
                          vue.createTextVNode("引用块")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "horizontalrule_tasklist" }, {
                        default: vue.withCtx(() => _cache[18] || (_cache[18] = [
                          vue.createTextVNode("水平线 + 任务列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "horizontalrule_orderedlist" }, {
                        default: vue.withCtx(() => _cache[19] || (_cache[19] = [
                          vue.createTextVNode("水平线 + 有序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "horizontalrule_bulletedlist" }, {
                        default: vue.withCtx(() => _cache[20] || (_cache[20] = [
                          vue.createTextVNode("水平线 + 无序列表")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "horizontalrule" }, {
                        default: vue.withCtx(() => _cache[21] || (_cache[21] = [
                          vue.createTextVNode("水平线")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[22] || (_cache[22] = [
                  vue.createTextVNode("目录清单分P标题格式")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_input, {
                    value: vue.unref(config$3).option.title.pattern,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(config$3).option.title.pattern = $event),
                    onChange: handleChange,
                    style: { "width": "160px" }
                  }, {
                    suffix: vue.withCtx(() => [
                      vue.createVNode(_component_a_tooltip, {
                        getPopupContainer: () => __props.container
                      }, {
                        title: vue.withCtx(() => [
                          _cache[23] || (_cache[23] = vue.createElementVNode("p", null, "{x}：表示分p数", -1)),
                          _cache[24] || (_cache[24] = vue.createElementVNode("p", null, "{xxx}：表示分p标题", -1)),
                          vue.createVNode(_component_a_divider, {
                            dashed: "",
                            style: { "border-color": "gray" }
                          }),
                          _cache[25] || (_cache[25] = vue.createElementVNode("p", null, "示例：第 {x} 集 《{xxx}》", -1)),
                          _cache[26] || (_cache[26] = vue.createElementVNode("p", null, "输出：第 1 集 《导学》", -1))
                        ]),
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                        ]),
                        _: 1
                      }, 8, ["getPopupContainer"])
                    ]),
                    _: 1
                  }, 8, ["value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => [
                  _cache[27] || (_cache[27] = vue.createTextVNode(" 使用B站视频笔记格式 ")),
                  vue.createVNode(_component_a_tooltip, {
                    getPopupContainer: () => __props.container,
                    title: "该模式生成的笔记包含大量HTML标签"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_switch, {
                    checked: vue.unref(config$3).option.note.isExtended,
                    "onUpdate:checked": _cache[3] || (_cache[3] = ($event) => vue.unref(config$3).option.note.isExtended = $event),
                    onChange: handleChange
                  }, null, 8, ["checked"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[28] || (_cache[28] = [
                  vue.createTextVNode("笔记语法风格")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    disabled: vue.unref(config$3).option.note.isExtended,
                    value: vue.unref(config$3).option.note.mode,
                    "onUpdate:value": _cache[4] || (_cache[4] = ($event) => vue.unref(config$3).option.note.mode = $event),
                    onChange: handleChange,
                    style: { "width": "110px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: "markdown" }, {
                        default: vue.withCtx(() => _cache[29] || (_cache[29] = [
                          vue.createTextVNode("markdown")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "obsidian" }, {
                        default: vue.withCtx(() => _cache[30] || (_cache[30] = [
                          vue.createTextVNode("obsidian")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "disabled", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_divider, {
            dashed: "",
            style: { "border-color": "gray" }
          }, {
            default: vue.withCtx(() => _cache[31] || (_cache[31] = [
              vue.createTextVNode("markdown/obsidian 语法设置")
            ])),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[32] || (_cache[32] = [
                  vue.createTextVNode("笔记加粗方式")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    disabled: vue.unref(config$3).option.note.isExtended,
                    value: vue.unref(config$3).option.note.syntax.bold,
                    "onUpdate:value": _cache[5] || (_cache[5] = ($event) => vue.unref(config$3).option.note.syntax.bold = $event),
                    onChange: handleChange,
                    style: { "width": "130px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: "**" }, {
                        default: vue.withCtx(() => _cache[33] || (_cache[33] = [
                          vue.createTextVNode("双星号包裹")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "__" }, {
                        default: vue.withCtx(() => _cache[34] || (_cache[34] = [
                          vue.createTextVNode("双下划线包裹")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "disabled", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[35] || (_cache[35] = [
                  vue.createTextVNode("笔记无序列表方式")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    disabled: vue.unref(config$3).option.note.isExtended,
                    value: vue.unref(config$3).option.note.syntax.list,
                    "onUpdate:value": _cache[6] || (_cache[6] = ($event) => vue.unref(config$3).option.note.syntax.list = $event),
                    onChange: handleChange,
                    style: { "width": "90px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: "-" }, {
                        default: vue.withCtx(() => _cache[36] || (_cache[36] = [
                          vue.createTextVNode("单减号")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "+" }, {
                        default: vue.withCtx(() => _cache[37] || (_cache[37] = [
                          vue.createTextVNode("单加号")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "*" }, {
                        default: vue.withCtx(() => _cache[38] || (_cache[38] = [
                          vue.createTextVNode("单星号")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "disabled", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 64);
      };
    }
  };
  const index$1 = {
    self: plugin$1,
    config: controller$2,
    Option: _sfc_main$d
  };
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: index$1
  }, Symbol.toStringTag, { value: "Module" }));
  const pluginConfig = new PluginConfig({
    base: {
      match: [
        "https://www.bilibili.com/video/*/",
        "https://www.bilibili.com/list/*/"
      ],
      isActive: false,
      isOnlySwitchCurrActive: true
    },
    option: {},
    data: []
  });
  const configRef$1 = new ConfigRef(pluginConfig);
  const config$2 = configRef$1._self();
  const controller$1 = configRef$1.getController();
  const _sfc_main$c = {};
  function _sfc_render(_ctx, _cache) {
    const _component_a_spin = vue.resolveComponent("a-spin");
    return vue.openBlock(), vue.createBlock(_component_a_spin, {
      size: "large",
      tip: "加载中…"
    });
  }
  const Mask = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render]]);
  const _sfc_main$b = {
    __name: "More",
    props: {
      disabled: {
        type: Boolean,
        required: true,
        default: false
      },
      message: {
        type: String,
        required: false,
        default: "加载中…"
      }
    },
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const emits = __emit;
      const handleClick = ({ key }) => {
        emits("click", key);
      };
      return (_ctx, _cache) => {
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_menu_item = vue.resolveComponent("a-menu-item");
        const _component_a_menu = vue.resolveComponent("a-menu");
        const _component_a_dropdown = vue.resolveComponent("a-dropdown");
        return vue.openBlock(), vue.createBlock(_component_a_dropdown, { disabled: __props.disabled }, {
          overlay: vue.withCtx(() => [
            vue.createVNode(_component_a_menu, { onClick: handleClick }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_menu_item, { key: "1" }, {
                  default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                    vue.createTextVNode("加载10次")
                  ])),
                  _: 1
                }),
                vue.createVNode(_component_a_menu_item, { key: "5" }, {
                  default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                    vue.createTextVNode("加载50次")
                  ])),
                  _: 1
                }),
                vue.createVNode(_component_a_menu_item, { key: "10" }, {
                  default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                    vue.createTextVNode("加载100次")
                  ])),
                  _: 1
                }),
                vue.createVNode(_component_a_menu_item, { key: "-1" }, {
                  default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                    vue.createTextVNode("加载全部")
                  ])),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_tooltip, null, {
              title: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(__props.message || "加载中…"), 1)
              ]),
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_button, {
                  size: "large",
                  disabled: __props.disabled
                }, {
                  icon: vue.withCtx(() => [
                    vue.createVNode(vue.unref(SyncOutlined))
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["disabled"]);
      };
    }
  };
  let currPage = (() => {
    const curr = biliUtil.getCurrLocation();
    if (/^https:\/\/www\.bilibili\.com\/video\/[^/]+\/$/.test(curr)) {
      return "video";
    } else if (/^https:\/\/www\.bilibili\.com\/list\/[^/]+\/$/.test(curr)) {
      return "list";
    } else {
      return "";
    }
  })();
  let video = null;
  let loading = null;
  let more = null;
  let next = null;
  let originalBluetoothHandler = null;
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const initVideoPageNext = async () => {
    var _a;
    const result = await view(biliUtil.getCurrBvid());
    if (!result) return;
    let videos = 0;
    if (result.ugc_season) {
      videos = (_a = result.ugc_season.sections) == null ? void 0 : _a.reduce((acc, curr) => {
        var _a2;
        acc += (_a2 = curr == null ? void 0 : curr.episodes) == null ? void 0 : _a2.reduce((acc2, curr2) => {
          var _a3;
          acc2 += ((_a3 = curr2 == null ? void 0 : curr2.pages) == null ? void 0 : _a3.length) || 0;
          return acc2;
        }, 0);
        return acc;
      }, 0);
    } else {
      videos = result.videos;
    }
    next = () => {
      if (!videos || videos <= 1) return;
      player == null ? void 0 : player.goto(random(1, videos), true);
    };
  };
  const initListPageNext = async () => {
    const origin = document.querySelector(".action-list-container");
    if (!origin) return;
    const list = origin.querySelector("#playlist-video-action-list");
    if (!list) return;
    let eplist = [];
    const disabledRef = vue.ref(false);
    const messageRef = vue.ref(eplist.length + "个视频可播放");
    const _renderLoading = () => {
      if (loading) return;
      loading = document.createElement("div");
      loading.classList.add("custom-loading");
      loading.style.width = origin.clientWidth + "px";
      loading.style.height = origin.clientHeight + "px";
      loading.style.display = "none";
      origin.parentNode.insertBefore(loading, origin);
      vue.createApp({
        render: () => vue.h(Mask)
      }).use(Antd).mount(loading);
    };
    const _showLoading = () => {
      disabledRef.value = true;
      messageRef.value = "加载中…";
      loading && (loading.style.display = "");
    };
    const _hideLoading = (isEnd) => {
      if (isEnd) {
        disabledRef.value = true;
        messageRef.value = "已全部加载，共" + eplist.length + "个视频可播放";
      } else {
        disabledRef.value = false;
        messageRef.value = eplist.length + "个视频可播放";
      }
      loading && (loading.style.display = "none");
    };
    const _loadElement = (MAX_COUNT = 20) => {
      _showLoading();
      let count = 0;
      let timerId = setInterval(() => {
        var _a, _b, _c, _d;
        const startFlag = list.querySelector("#actionListAheadAnchor");
        const endFlag = list.querySelector("#actionListBehindAnchor");
        if (((_a = startFlag == null ? void 0 : startFlag.style) == null ? void 0 : _a.display) === "none" && ((_b = endFlag == null ? void 0 : endFlag.style) == null ? void 0 : _b.display) === "none" || MAX_COUNT > -1 && count >= MAX_COUNT) {
          clearInterval(timerId);
          timerId = null;
          const single = ".singlep-list-item-inner";
          const multip = ".multip-list-item-inner .multip-list-item";
          eplist = list.querySelectorAll(`${single}, ${multip}`);
          if (eplist && eplist.length > 0) {
            for (const item of eplist) {
              if (item.classList.contains("siglep-active") || item.classList.contains("multip-list-item-active")) {
                setTimeout(() => {
                  var _a2, _b2;
                  list.scrollTo({
                    top: item.offsetTop,
                    behavior: "smooth"
                  });
                  _hideLoading(
                    ((_a2 = startFlag == null ? void 0 : startFlag.style) == null ? void 0 : _a2.display) === "none" && ((_b2 = endFlag == null ? void 0 : endFlag.style) == null ? void 0 : _b2.display) === "none"
                  );
                }, 10);
                return;
              }
            }
          }
        }
        if (((_c = endFlag == null ? void 0 : endFlag.style) == null ? void 0 : _c.display) === "") {
          list.scrollTop += list.scrollHeight;
        } else if (((_d = startFlag == null ? void 0 : startFlag.style) == null ? void 0 : _d.display) === "") {
          list.scroll(null, 0);
        }
        count++;
      }, random(300, 600));
    };
    const _renderMore = () => {
      if (more) return;
      more = document.createElement("div");
      more.classList.add("custom-more");
      more.style.marginLeft = origin.clientWidth + 10 + "px";
      origin.parentNode.insertBefore(more, origin);
      vue.createApp({
        render: () => vue.h(_sfc_main$b, {
          disabled: disabledRef.value,
          message: messageRef.value,
          onClick: (key) => {
            _loadElement(key === -1 ? -1 : key * 10);
          }
        })
      }).use(Antd).mount(more);
    };
    const _render = () => {
      _renderLoading();
      _renderMore();
    };
    _render();
    _loadElement();
    next = () => {
      if (!eplist || eplist.length <= 0) return;
      const target = eplist[random(0, eplist.length - 1)];
      if (!target) return;
      if (target.classList.contains("multip-list-item")) {
        target.parentElement.style.display = "";
      }
      target.click();
      setTimeout(() => {
        list.scrollTo({
          top: target.offsetTop,
          behavior: "smooth"
        });
      }, random(10, 200));
    };
  };
  const initNext = async () => {
    if (currPage === "video") {
      initVideoPageNext();
    } else if (currPage === "list") {
      initListPageNext();
    }
  };
  const handler = () => {
    next && next();
  };
  const buttonHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  };
  const observer = new MutationObserver((mutations) => {
    for (const item of mutations) {
      if (item.target.classList.contains("bpx-player-control-bottom-left")) {
        if (item.addedNodes.length > 0) {
          const button = item.addedNodes[0];
          if (button.classList.contains("bpx-player-ctrl-next")) {
            button.addEventListener("click", buttonHandler);
          }
        }
      }
    }
  });
  const keydownHandler = (event) => {
    if (event.key === "]") {
      event.preventDefault();
      handler();
    }
  };
  const bluetoothHandler = () => {
    handler();
  };
  const install = async () => {
    var _a, _b;
    video = document.querySelector("#bilibili-player video");
    if (!video) return;
    initNext();
    video == null ? void 0 : video.addEventListener("ended", handler);
    observer.observe(document.body, { childList: true, subtree: true });
    (_a = document.querySelector(".bpx-player-ctrl-next")) == null ? void 0 : _a.addEventListener("click", buttonHandler);
    document.addEventListener("keydown", keydownHandler);
    if (!((_b = navigator.mediaSession) == null ? void 0 : _b.setActionHandler)) return;
    originalBluetoothHandler = navigator.mediaSession.setActionHandler;
    navigator.mediaSession.setActionHandler = function($0, $1) {
      if ($0 === "nexttrack" && $1 !== bluetoothHandler) $1 = bluetoothHandler;
      originalBluetoothHandler.call(this, $0, $1);
    };
    navigator.mediaSession.setActionHandler("nexttrack", bluetoothHandler);
  };
  const uninstall = () => {
    var _a, _b;
    if (((_a = navigator.mediaSession) == null ? void 0 : _a.setActionHandler) && originalBluetoothHandler) {
      navigator.mediaSession.setActionHandler = originalBluetoothHandler;
      originalBluetoothHandler = null;
      navigator.mediaSession.setActionHandler("nexttrack", () => player == null ? void 0 : player.next());
    }
    document.removeEventListener("keydown", keydownHandler);
    (_b = document.querySelector(".bpx-player-ctrl-next")) == null ? void 0 : _b.removeEventListener("click", buttonHandler);
    observer.disconnect();
    video == null ? void 0 : video.removeEventListener("ended", handler);
    next = null;
    more && more.parentNode.removeChild(more) && (more = null);
    loading && loading.parentNode.removeChild(loading) && (loading = null);
    video = null;
  };
  const toggle = () => {
    if (config$2.base.isActive) {
      install();
      console.log("开启列表随机播放功能");
    } else {
      uninstall();
      console.log("关闭列表随机播放功能");
    }
  };
  const init$3 = () => {
    toggle();
    console.log("初始化列表随机播放功能完成");
  };
  const reset$2 = () => {
    toggle();
    console.log("重置列表随机播放功能完成");
  };
  const click = () => {
    config$2.base.isActive = !config$2.base.isActive;
    toggle();
    controller$1.useChangeHandler();
    console.log("切换列表随机播放功能完成");
  };
  const plugin = new Plugin({
    name: "列表随机播放",
    description: "一键开启分p/合集视频的列表随机播放功能，当前页面状态切换不影响其他页面",
    icon: CustomerServiceOutlined,
    type: "persistent",
    $init: init$3,
    $reset: reset$2,
    $click: click
  });
  const _sfc_main$a = {
    __name: "Option",
    setup(__props) {
      const handleChange = (_2, e) => {
        e.preventDefault();
        click();
      };
      return (_ctx, _cache) => {
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_switch = vue.resolveComponent("a-switch");
        const _component_a_row = vue.resolveComponent("a-row");
        return vue.openBlock(), vue.createBlock(_component_a_row, {
          justify: "space-between",
          class: "custom-row"
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_col, {
              span: 18,
              style: { "color": "#a9a9a9" }
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(vue.unref(plugin).description), 1)
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_switch, {
                  checked: vue.unref(config$2).base.isActive,
                  onChange: handleChange
                }, null, 8, ["checked"])
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  };
  const index = {
    self: plugin,
    config: controller$1,
    Option: _sfc_main$a
  };
  const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: index
  }, Symbol.toStringTag, { value: "Module" }));
  const plugins = [];
  const modules = /* @__PURE__ */ Object.assign({ "./fav/index.js": __vite_glob_0_0, "./note/index.js": __vite_glob_0_1, "./pod/index.js": __vite_glob_0_2 });
  Object.keys(modules).forEach((path) => {
    const plugin2 = modules[path].default;
    plugin2.id = path.split("/")[1];
    plugin2.path = path;
    plugins.push(plugin2);
  });
  plugins.sort((a, b) => {
    var _a;
    return (_a = a.id) == null ? void 0 : _a.localeCompare(b.id);
  });
  console.log("插件注册完成");
  const _hoisted_1 = { class: "items" };
  const _hoisted_2 = ["onDragstart", "onDragenter"];
  const _hoisted_3 = { key: 1 };
  const _sfc_main$9 = {
    __name: "DraggableList",
    props: {
      list: {
        type: Array,
        required: true,
        default: []
      }
    },
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      let dragIndex = 0;
      const dragstart = (e, index2) => {
        e.stopPropagation();
        setTimeout(() => {
          e.target.classList.add("moving");
        }, 0);
        dragIndex = index2;
      };
      const dragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      };
      const dragenter = (e, index2) => {
        e.preventDefault();
        if (dragIndex !== index2) {
          const source = props.list[dragIndex];
          props.list.splice(dragIndex, 1);
          props.list.splice(index2, 0, source);
          dragIndex = index2;
        }
      };
      const dragend = (e) => {
        e.target.classList.remove("moving");
        emits("change", props.list);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("ul", _hoisted_1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.list, (item, index2) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: item.id,
              draggable: true,
              onDragstart: ($event) => dragstart($event, index2),
              onDragover: dragover,
              onDragenter: ($event) => dragenter($event, index2),
              onDragend: dragend,
              class: "item"
            }, [
              _ctx.$slots.item ? vue.renderSlot(_ctx.$slots, "item", vue.mergeProps({
                key: 0,
                ref_for: true
              }, { ...item, index: index2 }), void 0, true) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(item.text), 1))
            ], 40, _hoisted_2);
          }), 128))
        ]);
      };
    }
  };
  const DraggableList = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-1d7c71a3"]]);
  class PluginVO {
    constructor({ id, name, icon, type, isActive, $click }) {
      this.id = id;
      this.name = name;
      this.icon = icon;
      this.type = type;
      this.isActive = isActive;
      this.$click = $click;
    }
  }
  const request = async (method, webhook, token, data2, execute, error) => {
    if (!method || !webhook || !token) {
      throw new Error("invaild method or webhook or token");
    }
    return _GM.xmlHttpRequest({
      method,
      url: webhook,
      headers: {
        "Content-Type": "application/json",
        "AirScript-Token": token
      },
      data: data2,
      anonymous: true,
      onerror: (response) => {
        console.error("请求发生错误：", response.status, response.statusText);
        error && error("请求发生错误：" + response.status);
        return response.status;
      },
      onload: (response) => {
        if (response.status === 200) {
          const text = JSON.parse(response.responseText);
          execute && execute(text.data);
          return text.data;
        }
        let message = null;
        if (response.status === 404) {
          message = "webhook有误，请仔细检查是否填写正确";
        } else if (response.status === 403) {
          const text = JSON.parse(response.responseText);
          if (text.result === "ApiTokenNotExists") {
            message = "脚本令牌有误，请检查令牌是否过期或填写有误";
          } else if (text.result === "lightLinkNotExist") {
            message = "webhook不存在，请重新复制并填写";
          } else if (text.result === "ScriptNotExists") {
            message = "脚本不存在，请先创建脚本";
          } else {
            message = "webhook有误，请仔细检查是否填写正确";
          }
        } else {
          message = response.statusText;
        }
        error && error(message);
        return message;
      }
    });
  };
  class Request2 {
    constructor(webhook, token) {
      this.webhook = webhook;
      this.token = token;
    }
    validate(execute, error) {
      const data2 = JSON.stringify({
        Context: {
          argv: null
        }
      });
      return request("POST", this.webhook, this.token, data2, execute, error);
    }
    get(params = {}, execute, error) {
      const keys = Object.keys(params).sort();
      const query = keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
      if (query) this.webhook = `${this.webhook}?${query}`;
      return request("GET", this.webhook, this.token, null, execute, error);
    }
    post(url, params = {}, execute, error) {
      if (!url || url.split("/").length < 2) {
        throw new Error("invaild url");
      }
      const lastIndex = url.lastIndexOf("/");
      const body = {
        target: url.substring(0, lastIndex),
        action: url.substring(lastIndex + 1),
        params
      };
      const data2 = JSON.stringify({
        Context: {
          argv: body
        }
      });
      return request("POST", this.webhook, this.token, data2, execute, error);
    }
  }
  const backup$1 = (request2, config2, execute, error) => {
    return request2 && request2.post("base/backup", { config: config2 }, execute, error);
  };
  const task$1 = (request2, task_id, execute, error) => {
    return request2 && request2.get({ task_id }, execute, error);
  };
  const restore$1 = (request2, execute, error) => {
    return request2 && request2.post("base/restore", null, execute, error);
  };
  const baseConfig = new BaseConfig({
    general: { shortcutMaxShow: 1, shortcutShowMode: "hover", shortcuts: [] },
    syncAndBackup: {
      wps: {
        isActive: false,
        airScript: {
          token: "",
          webhook: "",
          isValid: false
        },
        sync: { enabled: false },
        backup: { autoBackupInterval: 0, lastBackupTime: 0, lastRestoreTime: 0 }
      }
    }
  });
  const configRef = new ConfigRef(baseConfig);
  const config$1 = configRef._self();
  const controller = configRef.getController();
  const KEY = `${"Bilibili-Memo"}:AUTO_BACKUP_LOCK`;
  let timer = null;
  const _$1 = await (async () => {
    const info2 = await _GM.info;
    if (info2.scriptHandler === "Tampermonkey") {
      return async (execute) => {
        const tab = await _GM.getTab();
        if (!tab.id) return;
        const tabs = await _GM.getTabs();
        if (tab.id !== Object.keys(tabs)[0]) return;
        execute && execute();
      };
    } else {
      return async (execute) => {
        const lock = await _GM.getValue(KEY);
        if (!lock || JSON.parse(lock) + 5 * 60 * 1e3 < Date.now()) {
          await _GM.setValue(KEY, Date.now());
        }
        execute && execute();
        await _GM.deleteValue(KEY);
      };
    }
  })();
  const removeTimer = () => {
    timer && clearInterval(timer);
  };
  const setTimer = (interval, execute) => {
    removeTimer();
    if (interval > 0) {
      timer = setInterval(() => {
        _$1 && _$1(execute);
      }, interval * 0.25 * 60 * 1e3);
      _$1 && _$1(execute);
    }
  };
  class ConfigOutput {
    constructor() {
      this.base = controller.getValue();
      this.plugins = plugins.reduce((acc, curr) => {
        return { ...acc, [curr.id]: curr.config.getValue() };
      }, {});
    }
  }
  const reload = (data2) => {
    const baseConfig2 = data2.base;
    if (baseConfig2) {
      controller.setValue(baseConfig2);
      controller.useChangeHandler();
    }
    if (data2.plugins && Object.keys(data2.plugins).length > 0) {
      plugins.forEach((item) => {
        const pluginConfig2 = data2.plugins[item.id];
        if (pluginConfig2) {
          item.config.setValue(pluginConfig2);
          item.config.useChangeHandler();
          if (item.self.type === "persistent") item.self.$reset();
        }
      });
    }
    if (data2.base || data2.plugins) nav.self.$init();
  };
  const download = (success) => {
    const _download = (data2, filename) => {
      const blob = new Blob([JSON.stringify(data2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    };
    _download(new ConfigOutput(), "config.json");
    messageModal({ title: "信息", message: "处理中……下载完成后请手动关闭弹窗！" });
    success && success();
  };
  const upload = (success) => {
    const _upload = (execute) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== "application/json") {
          messageModal({
            title: "提示",
            message: "文件格式有误，请选择 .json 后缀格式的文件",
            type: "warning"
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          execute && execute(e.target.result);
        };
        reader.onerror = (e) => {
          console.error("文件读取出错:", e.target.error);
          messageModal({ title: "错误", message: "文件读取出错", type: "error" });
        };
        reader.readAsText(file);
      });
      input.click();
      input.remove();
    };
    _upload((result) => {
      const data2 = JSON.parse(result);
      if (data2) {
        reload(data2);
        messageModal({ title: "成功", message: "配置导入完成", type: "success" });
      }
    });
    success && success();
  };
  const validate = (success, failure) => {
    if (!config$1.syncAndBackup.wps.isActive) return;
    const condition = "https://www.kdocs.cn/api/v3/ide/";
    if (!config$1.syncAndBackup.wps.airScript.webhook.startsWith(condition)) {
      messageModal({
        title: "提示",
        message: "webhook有误，请仔细检查是否填写正确",
        type: "warning"
      });
      failure && failure();
      return;
    }
    const request2 = new Request2(
      config$1.syncAndBackup.wps.airScript.webhook,
      config$1.syncAndBackup.wps.airScript.token
    );
    request2.validate(
      (data2) => {
        if ((data2 == null ? void 0 : data2.result) && data2.result.isValid) {
          config$1.syncAndBackup.wps.airScript.isValid = true;
          controller.useChangeHandler();
        }
        success && success();
      },
      (message) => {
        messageModal({ title: "提示", message, type: "warning" });
        failure && failure();
      }
    );
  };
  const backup = (success, failure) => {
    if (!config$1.syncAndBackup.wps.isActive) return;
    if (!config$1.syncAndBackup.wps.airScript.isValid) return;
    const request2 = new Request2(
      config$1.syncAndBackup.wps.airScript.webhook,
      config$1.syncAndBackup.wps.airScript.token
    );
    backup$1(
      request2,
      new ConfigOutput(),
      (data2) => {
        const result = data2 == null ? void 0 : data2.result;
        if (result && result.lastBackupTime && result.lastBackupTime > 0) {
          config$1.syncAndBackup.wps.backup.lastBackupTime = result.lastBackupTime;
          controller.useChangeHandler();
          messageModal({ title: "成功", message: "备份完成", type: "success" });
          success && success();
        } else {
          messageModal({ title: "提示", message: "稍后再试", type: "warning" });
          failure && failure();
        }
      },
      (message) => {
        messageModal({ title: "提示", message, type: "warning" });
        config$1.syncAndBackup.wps.airScript.isValid = false;
        controller.useChangeHandler();
        failure && failure();
      }
    );
  };
  const task = (task_id) => {
    if (!config$1.syncAndBackup.wps.isActive) return;
    if (!config$1.syncAndBackup.wps.airScript.isValid) return;
    if (!task_id) return;
    const request2 = new Request2(
      "https://www.kdocs.cn/api/v3/script/task",
      config$1.syncAndBackup.wps.airScript.token
    );
    task$1(request2, task_id, (data2) => {
      const result = data2 == null ? void 0 : data2.result;
      if (result && result.lastBackupTime && result.lastBackupTime > 0) {
        config$1.syncAndBackup.wps.backup.lastBackupTime = result.lastBackupTime;
        controller.useChangeHandler();
      } else {
        setTimeout(() => {
          task(task_id);
        }, 5e3);
      }
    });
  };
  const autoBackup = () => {
    if (!config$1.syncAndBackup.wps.isActive) return;
    if (!config$1.syncAndBackup.wps.airScript.isValid) return;
    const interval = config$1.syncAndBackup.wps.backup.autoBackupInterval;
    if (interval <= 0) return;
    const time = config$1.syncAndBackup.wps.backup.lastBackupTime + interval * 60 * 1e3;
    if (time > Date.now()) return;
    const request2 = new Request2(
      config$1.syncAndBackup.wps.airScript.webhook.replace("sync_task", "task"),
      config$1.syncAndBackup.wps.airScript.token
    );
    backup$1(
      request2,
      new ConfigOutput(),
      (data2) => {
        task(data2 == null ? void 0 : data2.task_id);
      },
      () => {
        config$1.syncAndBackup.wps.airScript.isValid = false;
        controller.useChangeHandler();
      }
    );
  };
  const restore = (success, failure) => {
    if (!config$1.syncAndBackup.wps.isActive) return;
    if (!config$1.syncAndBackup.wps.airScript.isValid) return;
    const request2 = new Request2(
      config$1.syncAndBackup.wps.airScript.webhook,
      config$1.syncAndBackup.wps.airScript.token
    );
    restore$1(
      request2,
      (data2) => {
        if (data2 == null ? void 0 : data2.result) reload(data2 == null ? void 0 : data2.result);
        messageModal({ title: "成功", message: "恢复完成", type: "success" });
        success && success();
      },
      (message) => {
        messageModal({ title: "提示", message, type: "warning" });
        config$1.syncAndBackup.wps.airScript.isValid = false;
        controller.useChangeHandler();
        failure && failure();
      }
    );
  };
  const init$2 = () => {
    setTimer(config$1.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
  };
  const reset$1 = () => {
    removeTimer();
    setTimer(config$1.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
  };
  const menu = { self: { $init: init$2, $reset: reset$1 }, config: controller };
  const config = vue.ref({ pluginVOs: [] }).value;
  const _ = vue.ref([]);
  const pluginToPluginVO = (item) => {
    return new PluginVO({
      id: item.id,
      name: item.self.name,
      icon: item.self.icon,
      type: item.self.type,
      isActive: item.config.getValue().base.isActive,
      $click: item.self.$click
    });
  };
  const reset = () => {
    config.pluginVOs = [];
    menu.config.getValue().general.shortcuts.forEach((shortcut) => {
      const pluginVO = _.value.find((item) => item.id === shortcut.id && shortcut.isShow);
      if (pluginVO) config.pluginVOs.push(pluginVO);
    });
  };
  const init$1 = () => {
    _.value = plugins.map((item) => pluginToPluginVO(item));
    reset();
  };
  const switchActive = (pluginId, isActive) => {
    const pluginVO = _.value.find((item) => item.id === pluginId);
    if (!pluginVO) return;
    pluginVO.isActive = isActive;
  };
  const nav = {
    self: { $init: init$1, $reset: reset, $switchActive: switchActive }
  };
  const _sfc_main$8 = {
    __name: "OptionGeneral",
    props: {
      container: {
        type: Object,
        required: true,
        default: document.body
      }
    },
    setup(__props) {
      const handleChangeSort = (newShortcuts) => {
        config$1.general.shortcuts = newShortcuts;
        handleChangeShow();
      };
      const handleChangeShow = () => {
        nav.self.$reset();
        handleChange();
      };
      const handleChange = () => {
        controller.useChangeHandler();
      };
      return (_ctx, _cache) => {
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_select_option = vue.resolveComponent("a-select-option");
        const _component_a_select = vue.resolveComponent("a-select");
        const _component_a_row = vue.resolveComponent("a-row");
        const _component_a_divider = vue.resolveComponent("a-divider");
        const _component_a_switch = vue.resolveComponent("a-switch");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => [
                  _cache[2] || (_cache[2] = vue.createTextVNode(" 快捷方式栏最大显示数量 ")),
                  vue.createVNode(_component_a_tooltip, {
                    getPopupContainer: () => __props.container,
                    title: "大于该数量将收起为一个按钮"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    value: vue.unref(config$1).general.shortcutMaxShow,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(config$1).general.shortcutMaxShow = $event),
                    onChange: handleChange,
                    style: { "width": "60px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: 0 }, {
                        default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                          vue.createTextVNode("0")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 1 }, {
                        default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                          vue.createTextVNode("1")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 2 }, {
                        default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                          vue.createTextVNode("2")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 3 }, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode("3")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                  vue.createTextVNode("快捷方式栏展开方式")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    value: vue.unref(config$1).general.shortcutShowMode,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(config$1).general.shortcutShowMode = $event),
                    onChange: handleChange,
                    style: { "width": "70px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: "hover" }, {
                        default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                          vue.createTextVNode("触碰")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: "click" }, {
                        default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                          vue.createTextVNode("点击")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_divider, {
            dashed: "",
            style: { "border-color": "gray" }
          }, {
            default: vue.withCtx(() => _cache[10] || (_cache[10] = [
              vue.createTextVNode(" 拖住排序（快捷方式的显示/隐藏不影响功能的开启/关闭） ")
            ])),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(DraggableList, {
                list: vue.unref(config$1).general.shortcuts,
                onChange: handleChangeSort
              }, {
                item: vue.withCtx(({ id, name, index: index2 }) => [
                  vue.createVNode(_component_a_row, {
                    justify: "space-between",
                    class: "custom-row"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                        default: vue.withCtx(() => {
                          var _a;
                          return [
                            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent((_a = vue.unref(plugins).find((item) => item.id === id)) == null ? void 0 : _a.self.icon))),
                            vue.createTextVNode(" " + vue.toDisplayString(name), 1)
                          ];
                        }),
                        _: 2
                      }, 1024),
                      vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_a_switch, {
                            checked: vue.unref(config$1).general.shortcuts[index2].isShow,
                            "onUpdate:checked": ($event) => vue.unref(config$1).general.shortcuts[index2].isShow = $event,
                            onChange: handleChangeShow
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 1
              }, 8, ["list"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  };
  const _sfc_main$7 = {
    __name: "OptionWPS",
    props: {
      container: {
        type: Object,
        required: true,
        default: document.body
      }
    },
    setup(__props) {
      const state = vue.ref({
        token: "",
        webhook: "",
        vaild: false,
        backup: false,
        restore: false
      });
      const handleChangeToken = (e) => {
        if (e.target.value) state.value.token = "";
      };
      const handleChangeWebhook = (e) => {
        if (e.target.value) state.value.webhook = "";
      };
      const handleValidate = () => {
        const token = config$1.syncAndBackup.wps.airScript.token;
        const webhook = config$1.syncAndBackup.wps.airScript.webhook;
        if (!token || !webhook) {
          if (!token) state.value.token = "error";
          if (!webhook) state.value.webhook = "error";
          return;
        }
        state.value.vaild = true;
        validate(
          () => {
            state.value.vaild = false;
          },
          () => {
            state.value.vaild = false;
          }
        );
      };
      const handleBackup = () => {
        state.value.backup = true;
        backup(
          () => {
            state.value.backup = false;
          },
          () => {
            state.value.backup = false;
          }
        );
      };
      const handleRestore = () => {
        state.value.restore = true;
        restore(
          () => {
            state.value.restore = false;
          },
          () => {
            state.value.restore = false;
          }
        );
      };
      const handleChangeAutoBackupInterval = () => {
        controller.useChangeHandler();
        setTimer(config$1.syncAndBackup.wps.backup.autoBackupInterval, autoBackup);
      };
      return (_ctx, _cache) => {
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_input = vue.resolveComponent("a-input");
        const _component_a_row = vue.resolveComponent("a-row");
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_select_option = vue.resolveComponent("a-select-option");
        const _component_a_select = vue.resolveComponent("a-select");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_popconfirm = vue.resolveComponent("a-popconfirm");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                  vue.createTextVNode("脚本令牌")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_input, {
                    "allow-clear": "",
                    status: state.value.token,
                    value: vue.unref(config$1).syncAndBackup.wps.airScript.token,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(config$1).syncAndBackup.wps.airScript.token = $event),
                    onChange: handleChangeToken,
                    style: { "width": "220px" }
                  }, null, 8, ["status", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                  vue.createTextVNode("脚本webhook")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_input, {
                    "allow-clear": "",
                    status: state.value.webhook,
                    value: vue.unref(config$1).syncAndBackup.wps.airScript.webhook,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => vue.unref(config$1).syncAndBackup.wps.airScript.webhook = $event),
                    onChange: handleChangeWebhook,
                    style: { "width": "300px" }
                  }, null, 8, ["status", "value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_button, {
                    type: "primary",
                    loading: state.value.vaild,
                    onClick: handleValidate
                  }, {
                    default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode(" 验证 ")
                    ])),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => [
                  _cache[12] || (_cache[12] = vue.createTextVNode(" 间隔 ")),
                  vue.createVNode(_component_a_select, {
                    getPopupContainer: () => __props.container,
                    disabled: !vue.unref(config$1).syncAndBackup.wps.airScript.isValid,
                    value: vue.unref(config$1).syncAndBackup.wps.backup.autoBackupInterval,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => vue.unref(config$1).syncAndBackup.wps.backup.autoBackupInterval = $event),
                    onChange: handleChangeAutoBackupInterval
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_select_option, { value: 0 }, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode("0")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 5 }, {
                        default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                          vue.createTextVNode("5")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 10 }, {
                        default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                          vue.createTextVNode("10")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 15 }, {
                        default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                          vue.createTextVNode("15")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 30 }, {
                        default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                          vue.createTextVNode("30")
                        ])),
                        _: 1
                      }),
                      vue.createVNode(_component_a_select_option, { value: 60 }, {
                        default: vue.withCtx(() => _cache[11] || (_cache[11] = [
                          vue.createTextVNode("60")
                        ])),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "disabled", "value"]),
                  _cache[13] || (_cache[13] = vue.createTextVNode(" 分钟自动备份 ")),
                  vue.createVNode(_component_a_tooltip, {
                    getPopupContainer: () => __props.container,
                    title: "间隔0分钟表示不开启自动备份"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_button, {
                    disabled: !vue.unref(config$1).syncAndBackup.wps.airScript.isValid,
                    loading: state.value.backup,
                    onClick: handleBackup,
                    style: { "margin-right": "5px" }
                  }, {
                    default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                      vue.createTextVNode(" 备份至云端 ")
                    ])),
                    _: 1
                  }, 8, ["disabled", "loading"]),
                  vue.createVNode(_component_a_popconfirm, {
                    getPopupContainer: () => __props.container,
                    disabled: !vue.unref(config$1).syncAndBackup.wps.airScript.isValid,
                    title: "该操作会覆盖掉当前全部数据，确定吗?",
                    "ok-text": "确定",
                    "cancel-text": "取消",
                    onConfirm: handleRestore,
                    overlayInnerStyle: { width: "300px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_button, {
                        disabled: !vue.unref(config$1).syncAndBackup.wps.airScript.isValid,
                        loading: state.value.restore,
                        danger: "",
                        style: { "margin-left": "5px" }
                      }, {
                        default: vue.withCtx(() => _cache[15] || (_cache[15] = [
                          vue.createTextVNode(" 从云端恢复 ")
                        ])),
                        _: 1
                      }, 8, ["disabled", "loading"])
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "disabled"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label backup-time" }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 上一次备份时间： " + vue.toDisplayString(vue.unref(config$1).syncAndBackup.wps.backup.lastBackupTime ? vue.unref(dateUtil).timestampToDate[1](vue.unref(config$1).syncAndBackup.wps.backup.lastBackupTime) : "无备份历史"), 1)
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content restore-time" }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 上一次恢复时间： " + vue.toDisplayString(vue.unref(config$1).syncAndBackup.wps.backup.lastRestoreTime ? vue.unref(dateUtil).timestampToDate[1](vue.unref(config$1).syncAndBackup.wps.backup.lastRestoreTime) : "无恢复历史"), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 64);
      };
    }
  };
  const OptionWPS = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-c47228de"]]);
  const LOADING_TIME = 2e3;
  const _sfc_main$6 = {
    __name: "OptionSyncAndBackup",
    props: {
      container: {
        type: Object,
        required: true,
        default: document.body
      }
    },
    setup(__props) {
      const state = vue.ref({
        exp: false,
        imp: false
      });
      const visible = vue.ref(false);
      const handleExport = () => {
        state.value.exp = true;
        download(() => {
          setTimeout(() => {
            state.value.exp = false;
          }, LOADING_TIME);
        });
      };
      const handleImport = () => {
        state.value.imp = true;
        upload(() => {
          setTimeout(() => {
            state.value.imp = false;
          }, LOADING_TIME);
        });
      };
      const handleChangeActive = (checked, event) => {
        if (checked) {
          event.preventDefault();
          visible.value = true;
          return;
        }
        config$1.syncAndBackup.wps.isActive = false;
        controller.useChangeHandler();
      };
      const handleConfirm = () => {
        visible.value = false;
        config$1.syncAndBackup.wps.isActive = true;
        controller.useChangeHandler();
      };
      const handleCancel = () => {
        visible.value = false;
      };
      return (_ctx, _cache) => {
        const _component_a_col = vue.resolveComponent("a-col");
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_popconfirm = vue.resolveComponent("a-popconfirm");
        const _component_a_row = vue.resolveComponent("a-row");
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_switch = vue.resolveComponent("a-switch");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                  vue.createTextVNode("下载插件数据到本地")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_button, {
                    loading: state.value.exp,
                    onClick: handleExport
                  }, {
                    default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                      vue.createTextVNode("导出")
                    ])),
                    _: 1
                  }, 8, ["loading"]),
                  vue.createVNode(_component_a_popconfirm, {
                    getPopupContainer: () => __props.container,
                    title: "该操作会覆盖掉当前全部数据，确定吗?",
                    "ok-text": "确定",
                    "cancel-text": "取消",
                    onConfirm: handleImport,
                    overlayInnerStyle: { width: "300px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_button, {
                        danger: "",
                        loading: state.value.imp,
                        style: { "margin-left": "10px" }
                      }, {
                        default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                          vue.createTextVNode("导入")
                        ])),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, {
            justify: "space-between",
            class: "custom-row"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_col, { class: "custom-col-label" }, {
                default: vue.withCtx(() => [
                  _cache[3] || (_cache[3] = vue.createTextVNode(" 备份插件数据到WPS ")),
                  vue.createVNode(_component_a_tooltip, {
                    getPopupContainer: () => __props.container,
                    title: "该功能依赖网络连接及第三方软件（金山文档WPS）接口的稳定性"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ExclamationCircleOutlined), { style: { "color": "rgba(0, 0, 0, 0.45)" } })
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_col, { class: "custom-col-content" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_a_popconfirm, {
                    getPopupContainer: () => __props.container,
                    open: visible.value,
                    title: "该功能将会使插件数据传输至第三方软件（金山文档WPS），传输只会在本插件及您指定的WPS账号的指定文档之间进行，确定开启吗?",
                    "ok-text": "确定",
                    "cancel-text": "取消",
                    onConfirm: handleConfirm,
                    onCancel: handleCancel,
                    overlayInnerStyle: { width: "300px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_a_switch, {
                        checked: vue.unref(config$1).syncAndBackup.wps.isActive,
                        onChange: handleChangeActive
                      }, null, 8, ["checked"])
                    ]),
                    _: 1
                  }, 8, ["getPopupContainer", "open"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.unref(config$1).syncAndBackup.wps.isActive ? (vue.openBlock(), vue.createBlock(OptionWPS, {
            key: 0,
            container: __props.container
          }, null, 8, ["container"])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  };
  const _sfc_main$5 = {
    __name: "Option",
    setup(__props) {
      const settings = [
        {
          id: "general",
          self: { name: "通用" },
          Option: _sfc_main$8
        },
        {
          id: "syncAndBackup",
          self: { name: "同步&备份" },
          Option: _sfc_main$6
        }
      ];
      const anchorItems = settings.concat(plugins).map((item) => {
        return {
          key: item.id,
          href: "#" + item.id,
          title: item.self.name
        };
      });
      const contentItems = settings.concat(plugins).map((item) => {
        return {
          id: item.id,
          name: item.self.name,
          option: item.Option
        };
      });
      const activeKey = vue.ref(settings[0].id);
      const container = vue.ref();
      const handleClickAnchor = (e, link) => {
        e.preventDefault();
        activeKey.value = link.href.substring(1);
      };
      vue.onMounted(() => {
        container.value = document.querySelector(".custom-layout-conten");
      });
      return (_ctx, _cache) => {
        const _component_a_anchor = vue.resolveComponent("a-anchor");
        const _component_a_layout_sider = vue.resolveComponent("a-layout-sider");
        const _component_a_divider = vue.resolveComponent("a-divider");
        const _component_a_collapse_panel = vue.resolveComponent("a-collapse-panel");
        const _component_a_collapse = vue.resolveComponent("a-collapse");
        const _component_a_layout_content = vue.resolveComponent("a-layout-content");
        const _component_a_layout = vue.resolveComponent("a-layout");
        return vue.openBlock(), vue.createBlock(_component_a_layout, { class: "custom-layout" }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_a_layout_sider, {
              theme: "light",
              width: "auto",
              class: "custom-layout-sider"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_anchor, {
                  getContainer: () => container.value,
                  items: vue.unref(anchorItems),
                  affix: false,
                  onClick: handleClickAnchor
                }, null, 8, ["getContainer", "items"])
              ]),
              _: 1
            }),
            vue.createVNode(_component_a_divider, {
              type: "vertical",
              style: { "height": "auto" }
            }),
            vue.createVNode(_component_a_layout_content, {
              width: "auto",
              class: "custom-layout-conten"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_a_collapse, {
                  activeKey: activeKey.value,
                  "onUpdate:activeKey": _cache[0] || (_cache[0] = ($event) => activeKey.value = $event),
                  ghost: "",
                  accordion: "",
                  class: "custom-collapse"
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(contentItems), (item) => {
                      return vue.openBlock(), vue.createBlock(_component_a_collapse_panel, {
                        key: item.id
                      }, {
                        header: vue.withCtx(() => [
                          vue.createVNode(_component_a_divider, {
                            id: item.id,
                            orientation: "left",
                            orientationMargin: "0px",
                            class: "custom-divider"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(vue.toDisplayString(item.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["id"])
                        ]),
                        default: vue.withCtx(() => [
                          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.option), { container: container.value }, null, 8, ["container"]))
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                }, 8, ["activeKey"])
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  };
  const Option = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-69aa2ebc"]]);
  const _sfc_main$4 = {
    __name: "Button",
    setup(__props) {
      const showModal = () => {
        templateModal({ title: "设置", template: Option });
      };
      return (_ctx, _cache) => {
        const _component_a_float_button = vue.resolveComponent("a-float-button");
        return vue.openBlock(), vue.createBlock(_component_a_float_button, vue.mergeProps(_ctx.$attrs, { onClick: showModal }), {
          icon: vue.withCtx(() => [
            vue.createVNode(vue.unref(SettingOutlined))
          ]),
          _: 1
        }, 16);
      };
    }
  };
  const _sfc_main$3 = {
    __name: "Button",
    setup(__props) {
      const handleTrigger = () => {
        const baseConfig2 = menu.config.getValue();
        const max = baseConfig2.general.shortcutMaxShow;
        const mode = baseConfig2.general.shortcutShowMode;
        return config.pluginVOs.length > max ? mode : "";
      };
      const handleType = (item) => {
        if (item.type === "immediate") return "default";
        return item.isActive ? "primary" : "default";
      };
      return (_ctx, _cache) => {
        const _component_a_float_button = vue.resolveComponent("a-float-button");
        const _component_a_float_button_group = vue.resolveComponent("a-float-button-group");
        return vue.openBlock(), vue.createBlock(_component_a_float_button_group, {
          trigger: handleTrigger()
        }, {
          icon: vue.withCtx(() => [
            vue.createVNode(vue.unref(BarsOutlined))
          ]),
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(config).pluginVOs, (item) => {
              return vue.openBlock(), vue.createBlock(_component_a_float_button, {
                key: item.id,
                tooltip: item.name,
                type: handleType(item),
                onClick: item.$click
              }, {
                icon: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.icon)))
                ]),
                _: 2
              }, 1032, ["tooltip", "type", "onClick"]);
            }), 128))
          ]),
          _: 1
        }, 8, ["trigger"]);
      };
    }
  };
  const _sfc_main$2 = {
    __name: "Toolbar",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_sfc_main$3, vue.mergeProps(_ctx.$attrs, { style: { "left": "24px", "bottom": "80px" } }), null, 16),
          vue.createVNode(_sfc_main$4, vue.mergeProps(_ctx.$attrs, { style: { "left": "24px", "bottom": "24px" } }), null, 16)
        ], 64);
      };
    }
  };
  const _sfc_main$1 = {
    __name: "Agreement",
    setup(__props) {
      const projectName = "Bilibili-Memo";
      const state = vue.ref({
        agree: false
      });
      const handleAgree = () => {
        state.value.agree = true;
        setTimeout(() => {
          storageUtil.setAgreement(true);
        }, 100);
      };
      return (_ctx, _cache) => {
        const _component_a_typography_title = vue.resolveComponent("a-typography-title");
        const _component_a_typography_paragraph = vue.resolveComponent("a-typography-paragraph");
        const _component_a_typography = vue.resolveComponent("a-typography");
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_row = vue.resolveComponent("a-row");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_a_typography, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_typography_title, { level: 5 }, {
                default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                  vue.createTextVNode(" 欢迎使用本插件！请务必知悉以下事项： ")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_typography_paragraph, null, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("ul", null, [
                    vue.createElementVNode("li", null, " 本插件完全免费开源，代码公开透明（https://github.com/Jayvin-Leung/" + vue.toDisplayString(vue.unref(projectName)) + "） ", 1),
                    _cache[1] || (_cache[1] = vue.createElementVNode("li", null, "本插件不涉及修改您的B站用户数据（以下称“B站数据”）", -1)),
                    _cache[2] || (_cache[2] = vue.createElementVNode("li", null, "使用本插件时产生的数据（以下称“插件数据”）都会保存在浏览器本地", -1)),
                    _cache[3] || (_cache[3] = vue.createElementVNode("li", null, "本插件不会收集您的B站数据和插件数据", -1)),
                    _cache[4] || (_cache[4] = vue.createElementVNode("li", null, " 受技术和能力所限，本插件可能存在未测试到的bug，可能会导致部分插件数据异常，请定期导出到本地或备份到云端 ", -1))
                  ])
                ]),
                _: 1
              }),
              vue.createVNode(_component_a_typography_title, { level: 5 }, {
                default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                  vue.createTextVNode("您需知悉：")
                ])),
                _: 1
              }),
              vue.createVNode(_component_a_typography_paragraph, null, {
                default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                  vue.createElementVNode("ul", null, [
                    vue.createElementVNode("li", null, "开发者无法为您因插件数据丢失或异常所导致的损失负责"),
                    vue.createElementVNode("li", null, "使用即表示您愿意接受插件数据可能丢失或异常的风险")
                  ], -1)
                ])),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createVNode(_component_a_row, { style: { "justify-content": "center" } }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_a_button, {
                type: "primary",
                loading: state.value.agree,
                onClick: handleAgree
              }, {
                default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                  vue.createTextVNode("确定")
                ])),
                _: 1
              }, 8, ["loading"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  };
  const Agreement = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-16c5d314"]]);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const showModal = () => {
        templateModal({ title: "使用须知", template: Agreement });
      };
      return (_ctx, _cache) => {
        const _component_a_float_button = vue.resolveComponent("a-float-button");
        return vue.unref(storageUtil).getAgreement() ? (vue.openBlock(), vue.createBlock(_sfc_main$2, {
          key: 0,
          style: { "z-index": "9999" }
        })) : (vue.openBlock(), vue.createBlock(_component_a_float_button, {
          key: 1,
          style: { "z-index": "9999", "left": "24px", "bottom": "24px" },
          onClick: showModal
        }, {
          icon: vue.withCtx(() => [
            vue.createVNode(vue.unref(SettingOutlined))
          ]),
          _: 1
        }));
      };
    }
  };
  const initPluginConfig = () => {
    plugins.forEach((item) => {
      const cache = storageUtil.getPluginConfig(item.id);
      if (!cache) {
        storageUtil.setPluginConfig(item.id, item.config.getValue());
      } else {
        item.config.setValue(cache);
      }
      item.config.initChangeHandler((config2) => {
        storageUtil.setPluginConfig(item.id, config2);
        if (item.self.type === "persistent") {
          nav.self.$switchActive(item.id, config2.base.isActive);
        }
      });
      item.self.$init();
    });
  };
  const initBaseConfig = () => {
    const cache = storageUtil.getBaseConfig();
    if (!cache) {
      const baseConfig2 = menu.config.getValue();
      plugins.forEach((item) => {
        const shortcut = { id: item.id, name: item.self.name, isShow: true };
        baseConfig2.general.shortcuts.push(shortcut);
      });
      storageUtil.setBaseConfig(baseConfig2);
    } else {
      menu.config.setValue(cache);
    }
    menu.config.initChangeHandler((config2) => {
      storageUtil.setBaseConfig(config2);
    });
    menu.self.$init();
  };
  const initListener = () => {
    let listeners = [];
    listeners.push(
      storageUtil.listenAgreement(({ newValue, oldValue }) => {
        if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
        location.reload();
      })
    );
    listeners.push(
      storageUtil.listenBaseConfig(({ newValue }) => {
        const oldValue = menu.config.getValue();
        if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
        menu.config.setValue(newValue);
        if (newValue.syncAndBackup.wps.backup.autoBackupInterval !== oldValue.syncAndBackup.wps.backup.autoBackupInterval) {
          menu.self.$reset();
        }
        nav.self.$reset();
      })
    );
    plugins.forEach((item) => {
      listeners.push(
        storageUtil.listenPluginConfig(item.id, ({ newValue }) => {
          const oldValue = item.config.getValue();
          if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return;
          if (oldValue.base.isOnlySwitchCurrActive) {
            newValue.base.isActive = oldValue.base.isActive;
          }
          item.config.setValue(newValue);
          if (item.self.type === "persistent" && newValue.base.isActive !== oldValue.base.isActive) {
            item.self.$reset();
            nav.self.$switchActive(item.id, newValue.base.isActive);
          }
        })
      );
    });
    return listeners;
  };
  const init = () => {
    initPluginConfig();
    initBaseConfig();
    nav.self.$init();
    initListener();
    console.log("初始化完成");
  };
  const register = async () => {
    const info2 = await _GM.info;
    if (info2.scriptHandler === "Tampermonkey") {
      const tab = await _GM.getTab();
      if (tab.id) return;
      const tabs = await _GM.getTabs();
      tab.id = Object.keys(tabs).pop();
      await _GM.saveTab(tab);
    }
  };
  await( register());
  init();
  vue.createApp(_sfc_main).use(Antd).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, antd, fflate);