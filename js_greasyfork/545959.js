// ==UserScript==
// @name         B站搜索页视频分区筛选功能
// @namespace    https://github.com/Jayvin-Leung
// @version      1.1.0
// @author       Jayvin Leung
// @description  恢复B站搜索页视频分区筛选功能
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @homepageURL  https://github.com/Jayvin-Leung/Bilibili-Search-Filter
// @supportURL   https://github.com/Jayvin-Leung/Bilibili-Search-Filter/issues
// @match        https://search.bilibili.com/*
// @require      https://registry.npmmirror.com/vue/3.5.18/files/dist/vue.global.prod.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545959/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545959/B%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .global-loading-overlay[data-v-2210c2cf]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#ffffffb3;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);transition:opacity .3s ease}.global-loading-spinner[data-v-2210c2cf]{width:50px;height:50px;border:3px solid rgba(0,0,0,.1);border-radius:50%;border-top-color:#3498db;animation:spin-2210c2cf 1s ease-in-out infinite}.global-loading-text[data-v-2210c2cf]{margin-top:15px;color:#333;font-size:16px}@keyframes spin-2210c2cf{to{transform:rotate(360deg)}} ");

(function (vue) {
  'use strict';

  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$6 = {
    key: 0,
    class: "global-loading-overlay"
  };
  const _hoisted_2$2 = {
    key: 0,
    class: "global-loading-text"
  };
  const _sfc_main$c = {
    __name: "Loading",
    setup(__props, { expose: __expose }) {
      const visible = vue.ref(false);
      const text = vue.ref("");
      const show = (loadingText = "加载中……") => {
        text.value = loadingText || "";
        visible.value = true;
      };
      const hide = () => {
        visible.value = false;
      };
      __expose({ show, hide });
      return (_ctx, _cache) => {
        return visible.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "global-loading-spinner" }, null, -1)),
          text.value ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_2$2, vue.toDisplayString(text.value), 1)) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const Loading = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-2210c2cf"]]);
  let loadingInstance = null;
  let loadingMountPoint = null;
  let loadingQueue = 0;
  const initLoading = () => {
    if (!loadingInstance) {
      loadingMountPoint = document.createElement("div");
      loadingMountPoint.id = "global-loading-container";
      document.body.appendChild(loadingMountPoint);
      loadingInstance = vue.createApp(Loading).mount(loadingMountPoint);
    }
  };
  const showLoading = (text) => {
    loadingQueue++;
    initLoading();
    loadingInstance.show(text);
  };
  const hideLoading = () => {
    if (loadingQueue > 0) loadingQueue--;
    if (loadingQueue === 0 && loadingInstance) {
      loadingInstance.hide();
    }
  };
  const destroyLoading = () => {
    if (loadingMountPoint) {
      hideLoading();
      document.body.removeChild(loadingMountPoint);
      loadingMountPoint = null;
      loadingInstance = null;
      loadingQueue = 0;
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", destroyLoading);
  }
  const _ = vue.ref({
    data_v_search_content: { "data-v-22ff42d3": "" },
    data_v_search_page: { "data-v-0450c084": "" },
    data_v_bili_video_card: { "data-v-37adbc26": "" }
  });
  const get = (key) => {
    return _.value[key];
  };
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var md5$1 = { exports: {} };
  var crypt = { exports: {} };
  var hasRequiredCrypt;
  function requireCrypt() {
    if (hasRequiredCrypt) return crypt.exports;
    hasRequiredCrypt = 1;
    (function() {
      var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
        // Bit-wise rotation left
        rotl: function(n, b) {
          return n << b | n >>> 32 - b;
        },
        // Bit-wise rotation right
        rotr: function(n, b) {
          return n << 32 - b | n >>> b;
        },
        // Swap big-endian to little-endian and vice versa
        endian: function(n) {
          if (n.constructor == Number) {
            return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
          }
          for (var i = 0; i < n.length; i++)
            n[i] = crypt$1.endian(n[i]);
          return n;
        },
        // Generate an array of any length of random bytes
        randomBytes: function(n) {
          for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
          return bytes;
        },
        // Convert a byte array to big-endian 32-bit words
        bytesToWords: function(bytes) {
          for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << 24 - b % 32;
          return words;
        },
        // Convert big-endian 32-bit words to a byte array
        wordsToBytes: function(words) {
          for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
          return bytes;
        },
        // Convert a byte array to a hex string
        bytesToHex: function(bytes) {
          for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 15).toString(16));
          }
          return hex.join("");
        },
        // Convert a hex string to a byte array
        hexToBytes: function(hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
          return bytes;
        },
        // Convert a byte array to a base-64 string
        bytesToBase64: function(bytes) {
          for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            for (var j = 0; j < 4; j++)
              if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
              else
                base64.push("=");
          }
          return base64.join("");
        },
        // Convert a base-64 string to a byte array
        base64ToBytes: function(base64) {
          base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
          for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
          }
          return bytes;
        }
      };
      crypt.exports = crypt$1;
    })();
    return crypt.exports;
  }
  var charenc_1;
  var hasRequiredCharenc;
  function requireCharenc() {
    if (hasRequiredCharenc) return charenc_1;
    hasRequiredCharenc = 1;
    var charenc = {
      // UTF-8 encoding
      utf8: {
        // Convert a string to a byte array
        stringToBytes: function(str) {
          return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
        },
        // Convert a byte array to a string
        bytesToString: function(bytes) {
          return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
        }
      },
      // Binary encoding
      bin: {
        // Convert a string to a byte array
        stringToBytes: function(str) {
          for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 255);
          return bytes;
        },
        // Convert a byte array to a string
        bytesToString: function(bytes) {
          for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
          return str.join("");
        }
      }
    };
    charenc_1 = charenc;
    return charenc_1;
  }
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var isBuffer_1;
  var hasRequiredIsBuffer;
  function requireIsBuffer() {
    if (hasRequiredIsBuffer) return isBuffer_1;
    hasRequiredIsBuffer = 1;
    isBuffer_1 = function(obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
    }
    return isBuffer_1;
  }
  var hasRequiredMd5;
  function requireMd5() {
    if (hasRequiredMd5) return md5$1.exports;
    hasRequiredMd5 = 1;
    (function() {
      var crypt2 = requireCrypt(), utf8 = requireCharenc().utf8, isBuffer = requireIsBuffer(), bin = requireCharenc().bin, md52 = function(message, options) {
        if (message.constructor == String)
          if (options && options.encoding === "binary")
            message = bin.stringToBytes(message);
          else
            message = utf8.stringToBytes(message);
        else if (isBuffer(message))
          message = Array.prototype.slice.call(message, 0);
        else if (!Array.isArray(message) && message.constructor !== Uint8Array)
          message = message.toString();
        var m = crypt2.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (var i = 0; i < m.length; i++) {
          m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
        }
        m[l >>> 5] |= 128 << l % 32;
        m[(l + 64 >>> 9 << 4) + 14] = l;
        var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
        for (var i = 0; i < m.length; i += 16) {
          var aa = a, bb = b, cc = c, dd = d;
          a = FF(a, b, c, d, m[i + 0], 7, -680876936);
          d = FF(d, a, b, c, m[i + 1], 12, -389564586);
          c = FF(c, d, a, b, m[i + 2], 17, 606105819);
          b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
          a = FF(a, b, c, d, m[i + 4], 7, -176418897);
          d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
          c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
          b = FF(b, c, d, a, m[i + 7], 22, -45705983);
          a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
          d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
          c = FF(c, d, a, b, m[i + 10], 17, -42063);
          b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
          a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
          d = FF(d, a, b, c, m[i + 13], 12, -40341101);
          c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
          b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
          a = GG(a, b, c, d, m[i + 1], 5, -165796510);
          d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
          c = GG(c, d, a, b, m[i + 11], 14, 643717713);
          b = GG(b, c, d, a, m[i + 0], 20, -373897302);
          a = GG(a, b, c, d, m[i + 5], 5, -701558691);
          d = GG(d, a, b, c, m[i + 10], 9, 38016083);
          c = GG(c, d, a, b, m[i + 15], 14, -660478335);
          b = GG(b, c, d, a, m[i + 4], 20, -405537848);
          a = GG(a, b, c, d, m[i + 9], 5, 568446438);
          d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
          c = GG(c, d, a, b, m[i + 3], 14, -187363961);
          b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
          a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
          d = GG(d, a, b, c, m[i + 2], 9, -51403784);
          c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
          b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
          a = HH(a, b, c, d, m[i + 5], 4, -378558);
          d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
          c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
          b = HH(b, c, d, a, m[i + 14], 23, -35309556);
          a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
          d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
          c = HH(c, d, a, b, m[i + 7], 16, -155497632);
          b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
          a = HH(a, b, c, d, m[i + 13], 4, 681279174);
          d = HH(d, a, b, c, m[i + 0], 11, -358537222);
          c = HH(c, d, a, b, m[i + 3], 16, -722521979);
          b = HH(b, c, d, a, m[i + 6], 23, 76029189);
          a = HH(a, b, c, d, m[i + 9], 4, -640364487);
          d = HH(d, a, b, c, m[i + 12], 11, -421815835);
          c = HH(c, d, a, b, m[i + 15], 16, 530742520);
          b = HH(b, c, d, a, m[i + 2], 23, -995338651);
          a = II(a, b, c, d, m[i + 0], 6, -198630844);
          d = II(d, a, b, c, m[i + 7], 10, 1126891415);
          c = II(c, d, a, b, m[i + 14], 15, -1416354905);
          b = II(b, c, d, a, m[i + 5], 21, -57434055);
          a = II(a, b, c, d, m[i + 12], 6, 1700485571);
          d = II(d, a, b, c, m[i + 3], 10, -1894986606);
          c = II(c, d, a, b, m[i + 10], 15, -1051523);
          b = II(b, c, d, a, m[i + 1], 21, -2054922799);
          a = II(a, b, c, d, m[i + 8], 6, 1873313359);
          d = II(d, a, b, c, m[i + 15], 10, -30611744);
          c = II(c, d, a, b, m[i + 6], 15, -1560198380);
          b = II(b, c, d, a, m[i + 13], 21, 1309151649);
          a = II(a, b, c, d, m[i + 4], 6, -145523070);
          d = II(d, a, b, c, m[i + 11], 10, -1120210379);
          c = II(c, d, a, b, m[i + 2], 15, 718787259);
          b = II(b, c, d, a, m[i + 9], 21, -343485551);
          a = a + aa >>> 0;
          b = b + bb >>> 0;
          c = c + cc >>> 0;
          d = d + dd >>> 0;
        }
        return crypt2.endian([a, b, c, d]);
      };
      md52._ff = function(a, b, c, d, x, s, t) {
        var n = a + (b & c | ~b & d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._gg = function(a, b, c, d, x, s, t) {
        var n = a + (b & d | c & ~d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._hh = function(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._ii = function(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._blocksize = 16;
      md52._digestsize = 16;
      md5$1.exports = function(message, options) {
        if (message === void 0 || message === null)
          throw new Error("Illegal argument " + message);
        var digestbytes = crypt2.wordsToBytes(md52(message, options));
        return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt2.bytesToHex(digestbytes);
      };
    })();
    return md5$1.exports;
  }
  var md5Exports = requireMd5();
  const md5 = /* @__PURE__ */ getDefaultExportFromCjs(md5Exports);
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
  const getSESSDATA = () => {
    return getCookieValue("SESSDATA");
  };
  const encWbi = (params2, img_key, sub_key) => {
    const _mixinKeyEncTab = [
      46,
      47,
      18,
      2,
      53,
      8,
      23,
      32,
      15,
      50,
      10,
      31,
      58,
      3,
      45,
      35,
      27,
      43,
      5,
      49,
      33,
      9,
      42,
      19,
      29,
      28,
      14,
      39,
      12,
      38,
      41,
      13,
      37,
      48,
      7,
      16,
      24,
      55,
      40,
      61,
      26,
      17,
      0,
      1,
      60,
      51,
      30,
      4,
      22,
      25,
      54,
      21,
      56,
      59,
      6,
      63,
      57,
      62,
      11,
      36,
      20,
      34,
      44,
      52
    ];
    const _getMixinKey = (orig) => _mixinKeyEncTab.map((n) => orig[n]).join("").slice(0, 32);
    const mixin_key = _getMixinKey(img_key + sub_key);
    const curr_time = Math.round(Date.now() / 1e3);
    const chr_filter = /[!'()*]/g;
    Object.assign(params2, { wts: curr_time });
    const query = Object.keys(params2).sort().map((key) => {
      const value = params2[key].toString().replace(chr_filter, "");
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
    const wbi_sign = md5(query + mixin_key);
    return query + "&w_rid=" + wbi_sign;
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
    getSESSDATA,
    encWbi,
    getCurrLocation,
    getCurrBvid,
    av2bv,
    bv2av
  };
  const request = async (url, option, success, failure) => {
    if (!url || !option) {
      throw new Error("invaild url or option");
    }
    return fetch(url, option).then((response) => response.json()).then((result) => {
      if (result.code === 0) {
        success && success(result.data);
        return result.data;
      } else {
        failure && failure(result.message);
        return result.message;
      }
    }).catch((e) => {
      failure && failure("请求发生错误：" + e);
      return e;
    });
  };
  const getWbiKeys = async () => {
    let img_url = localStorage.wbi_img_url;
    let sub_url = localStorage.wbi_sub_url;
    if (!img_url || !sub_url) {
      const res = await request("https://api.bilibili.com/x/web-interface/nav", {
        method: "GET",
        credentials: "include",
        mode: "cors"
      });
      img_url = res.wbi_img.img_url;
      sub_url = res.wbi_img.sub_url;
    }
    return {
      img_key: img_url.slice(img_url.lastIndexOf("/") + 1, img_url.lastIndexOf(".")),
      sub_key: sub_url.slice(sub_url.lastIndexOf("/") + 1, sub_url.lastIndexOf("."))
    };
  };
  class Request {
    get(url, params2 = {}, success, failure) {
      params2.platform = "web";
      const keys = Object.keys(params2).sort();
      const query = keys.map((k) => `${k}=${params2[k]}`).join("&");
      return request(
        query ? `${url}?${query}` : url,
        {
          method: "GET",
          credentials: "include",
          mode: "cors"
        },
        success,
        failure
      );
    }
    post(url, params2 = {}, success, failure) {
      params2.platform = "web";
      params2.csrf = biliUtil.getCsrf();
      const keys = Object.keys(params2).sort();
      const query = new URLSearchParams();
      keys.forEach((k) => query.append(k, params2[k]));
      return request(
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
        success,
        failure
      );
    }
    async wbiGet(url, params2 = {}, success, failure) {
      params2.platform = "web";
      const wbiKeys = await getWbiKeys();
      const query = biliUtil.encWbi(params2, wbiKeys.img_key, wbiKeys.sub_key);
      return request(
        `${url}?${query}`,
        {
          method: "GET",
          credentials: "include",
          mode: "cors"
        },
        success,
        failure
      );
    }
  }
  const request$1 = new Request();
  const type = ({
    keyword,
    pn = 1,
    ps = 42,
    searchType = "video",
    order = "",
    pubtimeBeginS = 0,
    pubtimeEndS = 0,
    duration = "",
    tids = ""
  }, success, failure) => {
    if (!keyword) return;
    let url = "https://api.bilibili.com/x/web-interface/wbi/search/type";
    let params2 = {
      keyword,
      page: pn,
      page_size: ps,
      search_type: searchType,
      order,
      pubtime_begin_s: pubtimeBeginS,
      pubtime_end_s: pubtimeEndS,
      duration,
      tids
    };
    return request$1.wbiGet(url, params2, success, failure);
  };
  const _hoisted_1$5 = ["onClick"];
  const _sfc_main$b = {
    __name: "Channel",
    props: {
      "tid": {},
      "tidModifiers": {}
    },
    emits: ["update:tid"],
    setup(__props) {
      const tid = vue.useModel(__props, "tid");
      const channels = [
        {
          text: "全部分区",
          tid: 0
        },
        {
          text: "动画",
          tid: 1
        },
        {
          text: "游戏",
          tid: 4
        },
        {
          text: "鬼畜",
          tid: 119
        },
        {
          text: "音乐",
          tid: 3
        },
        {
          text: "舞蹈",
          tid: 129
        },
        {
          text: "影视",
          tid: 181
        },
        {
          text: "生活",
          tid: 160
        },
        {
          text: "娱乐",
          tid: 5
        },
        {
          text: "知识",
          tid: 36
        },
        {
          text: "科技数码",
          tid: 188
        },
        {
          text: "资讯",
          tid: 202
        },
        {
          text: "美食",
          tid: 211
        },
        {
          text: "汽车",
          tid: 223
        },
        {
          text: "时尚美妆",
          tid: 155
        },
        {
          text: "体育运动",
          tid: 234
        },
        {
          text: "动物",
          tid: 217
        }
      ];
      const handleClick = (newValue) => {
        if (newValue === tid.value) return;
        tid.value = newValue;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(channels, (item) => {
          return vue.createElementVNode("button", {
            class: vue.normalizeClass({
              "vui_button vui_button--tab mt_sm mr_sm": true,
              "vui_button--active": item.tid === tid.value
            }),
            onClick: ($event) => handleClick(item.tid)
          }, vue.toDisplayString(item.text), 11, _hoisted_1$5);
        }), 64);
      };
    }
  };
  const add = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/add";
    let params2 = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params2, success, failure);
  };
  const del = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/del";
    let params2 = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params2, success, failure);
  };
  const _sfc_main$a = {};
  const _hoisted_1$4 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 20 20",
    width: "20",
    height: "20",
    fill: "currentColor",
    class: "bili-watch-later__icon"
  };
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$4, _cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        d: "M10 3.1248000000000005C6.20305 3.1248000000000005 3.1250083333333336 6.202841666666667 3.1250083333333336 9.999833333333335C3.1250083333333336 13.796750000000001 6.20305 16.874833333333335 10 16.874833333333335C11.898291666666667 16.874833333333335 13.615833333333333 16.106291666666667 14.860625 14.861916666666666C15.104708333333335 14.617916666666666 15.500416666666668 14.617958333333334 15.7445 14.862041666666668C15.9885 15.106166666666669 15.988416666666668 15.501916666666666 15.744333333333334 15.745958333333334C14.274750000000001 17.215041666666668 12.243041666666667 18.124833333333335 10 18.124833333333335C5.512691666666667 18.124833333333335 1.8750083333333334 14.487125 1.8750083333333334 9.999833333333335C1.8750083333333334 5.512483333333334 5.512691666666667 1.8748000000000002 10 1.8748000000000002C14.487291666666668 1.8748000000000002 18.125 5.512483333333334 18.125 9.999833333333335C18.125 10.304458333333333 18.108208333333334 10.605458333333333 18.075458333333337 10.901791666666668C18.0375 11.244916666666667 17.728625 11.492291666666667 17.385583333333333 11.454333333333334C17.0425 11.416416666666667 16.795083333333334 11.107541666666668 16.833000000000002 10.764458333333334C16.860750000000003 10.513625000000001 16.875 10.2585 16.875 9.999833333333335C16.875 6.202841666666667 13.796958333333333 3.1248000000000005 10 3.1248000000000005z",
        fill: "currentColor"
      }, null, -1),
      vue.createElementVNode("path", {
        d: "M15.391416666666666 9.141166666666667C15.635458333333334 8.897083333333335 16.031208333333332 8.897083333333335 16.275291666666668 9.141166666666667L17.5 10.365875L18.72475 9.141166666666667C18.968791666666668 8.897083333333335 19.364541666666668 8.897083333333335 19.608625 9.141166666666667C19.852666666666668 9.385291666666667 19.852666666666668 9.780958333333334 19.608625 10.025083333333333L18.08925 11.544416666666669C17.763833333333334 11.869833333333334 17.236208333333334 11.869833333333334 16.91075 11.544416666666669L15.391416666666666 10.025083333333333C15.147333333333334 9.780958333333334 15.147333333333334 9.385291666666667 15.391416666666666 9.141166666666667z",
        fill: "currentColor"
      }, null, -1),
      vue.createElementVNode("path", {
        d: "M12.499333333333334 9.278375C13.05475 9.599 13.05475 10.400666666666668 12.499333333333334 10.721291666666668L9.373916666666666 12.525791666666668C8.818541666666667 12.846416666666666 8.124274999999999 12.445583333333333 8.124274999999999 11.804291666666668L8.124274999999999 8.1954C8.124274999999999 7.554066666666667 8.818541666666667 7.153233333333334 9.373916666666666 7.473900000000001L12.499333333333334 9.278375z",
        fill: "currentColor"
      }, null, -1)
    ]));
  }
  const WatchLaterToAddSVG = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$1]]);
  const _sfc_main$9 = {};
  const _hoisted_1$3 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 20 20",
    width: "20",
    height: "20",
    fill: "currentColor",
    class: "bili-watch-later__icon"
  };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
      vue.createElementVNode("path", {
        d: "M2.483616666666667 10.274833333333333C2.727691666666667 10.03075 3.123416666666667 10.03075 3.3675000000000006 10.274833333333333L6.755716666666666 13.663041666666667C7.08115 13.988500000000002 7.608791666666667 13.988500000000002 7.9342250000000005 13.663041666666667L16.62575 4.971516666666667C16.869833333333336 4.7274416666666665 17.265583333333332 4.7274416666666665 17.509625 4.971516666666667C17.753708333333332 5.215591666666667 17.753708333333332 5.611325000000001 17.509625 5.8554L8.818125 14.546916666666666C8.004516666666667 15.360500000000002 6.685425 15.360500000000002 5.871833333333333 14.546916666666666L2.483616666666667 11.158708333333333C2.2395333333333336 10.914625000000001 2.2395333333333336 10.518875000000001 2.483616666666667 10.274833333333333z",
        fill: "currentColor"
      }, null, -1)
    ]));
  }
  const WatchLaterAddedSVG = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render]]);
  const _hoisted_1$2 = {
    class: "bili-watch-later__tip",
    style: { "display": "none" }
  };
  const _sfc_main$8 = {
    __name: "WatchLater",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const mouseenterPip = (event) => {
        event.target.querySelector(".bili-watch-later__tip").style.display = "";
      };
      const mouseleavePip = (event) => {
        event.target.querySelector(".bili-watch-later__tip").style.display = "none";
      };
      const handleWatchLater = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (props.item.toview) {
          del({ bvid: props.item.bvid }, () => {
            props.item.toview = false;
          });
        } else {
          add({ bvid: props.item.bvid }, () => {
            props.item.toview = true;
          });
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "bili-watch-later bili-watch-later--pip",
          style: { "display": "none" },
          onMouseenter: mouseenterPip,
          onMouseleave: mouseleavePip,
          onClick: _cache[0] || (_cache[0] = (event) => handleWatchLater(event))
        }, [
          __props.item.toview ? (vue.openBlock(), vue.createBlock(WatchLaterAddedSVG, { key: 0 })) : (vue.openBlock(), vue.createBlock(WatchLaterToAddSVG, { key: 1 })),
          vue.createElementVNode("span", _hoisted_1$2, vue.toDisplayString(__props.item.toview ? " 移除 " : " 稍后再看 "), 1)
        ], 32);
      };
    }
  };
  const _sfc_main$7 = {
    __name: "PlayNumSVG",
    setup(__props) {
      const d_v_b_v_c = get("data_v_bili_video_card");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps(vue.unref(d_v_b_v_c), {
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          viewBox: "0 0 24 24",
          width: "24",
          height: "24",
          fill: "#ffffff",
          class: "bili-video-card__stats--icon"
        }), _cache[0] || (_cache[0] = [
          vue.createElementVNode("path", {
            d: "M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z",
            fill: "currentColor"
          }, null, -1),
          vue.createElementVNode("path", {
            d: "M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z",
            fill: "currentColor"
          }, null, -1)
        ]), 16);
      };
    }
  };
  const _sfc_main$6 = {
    __name: "DmNumSVG",
    setup(__props) {
      const d_v_b_v_c = get("data_v_bili_video_card");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps(vue.unref(d_v_b_v_c), {
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          viewBox: "0 0 24 24",
          width: "24",
          height: "24",
          class: "bili-video-card__stats--icon"
        }), _cache[0] || (_cache[0] = [
          vue.createStaticVNode('<path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><path d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z" fill="currentColor"></path><path d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z" fill="currentColor"></path><path d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z" fill="currentColor"></path><path d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z" fill="currentColor"></path>', 5)
        ]), 16);
      };
    }
  };
  const _sfc_main$5 = {
    __name: "Stats",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const d_v_b_v_c = get("data_v_bili_video_card");
      const convert = (duration) => {
        const [minutes, seconds] = duration.split(":").map(Number);
        if (minutes < 60) return duration;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return [
          hours.toString().padStart(2, "0"),
          remainingMinutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
        ].join(":");
      };
      const obj = vue.computed(() => {
        const _2 = {};
        _2.play = props.item.play;
        _2.playText = _2.play < 1e4 ? _2.play : (_2.play / 1e4).toFixed(1) + "万";
        _2.danmu = props.item.danmaku;
        _2.danmuText = _2.danmu < 1e4 ? _2.danmu : (_2.danmu / 1e4).toFixed(1) + "万";
        _2.durationText = convert(props.item.duration);
        return _2;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(vue.unref(d_v_b_v_c), { class: "bili-video-card__stats" }), [
          vue.createElementVNode("div", vue.mergeProps(vue.unref(d_v_b_v_c), { class: "bili-video-card__stats--left" }), [
            vue.createElementVNode("span", vue.mergeProps(vue.unref(d_v_b_v_c), { class: "bili-video-card__stats--item" }), [
              vue.createVNode(_sfc_main$7),
              vue.createElementVNode("span", vue.normalizeProps(vue.guardReactiveProps(vue.unref(d_v_b_v_c))), vue.toDisplayString(obj.value.playText), 17)
            ], 16),
            vue.createElementVNode("span", vue.mergeProps(vue.unref(d_v_b_v_c), { class: "bili-video-card__stats--item" }), [
              vue.createVNode(_sfc_main$6),
              vue.createElementVNode("span", vue.normalizeProps(vue.guardReactiveProps(vue.unref(d_v_b_v_c))), vue.toDisplayString(obj.value.danmuText), 17)
            ], 16)
          ], 16),
          vue.createElementVNode("span", vue.mergeProps(vue.unref(d_v_b_v_c), { class: "bili-video-card__stats__duration" }), vue.toDisplayString(obj.value.durationText), 17)
        ], 16);
      };
    }
  };
  const _sfc_main$4 = {
    __name: "UpSVG",
    setup(__props) {
      const d_v_b_v_c = get("data_v_bili_video_card");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps(vue.unref(d_v_b_v_c), {
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          viewBox: "0 0 24 24",
          width: "24",
          height: "24",
          class: "bili-video-card__info--author-ico mr_2"
        }), _cache[0] || (_cache[0] = [
          vue.createElementVNode("path", {
            d: "M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z",
            fill: "currentColor"
          }, null, -1),
          vue.createElementVNode("path", {
            d: "M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z",
            fill: "currentColor"
          }, null, -1),
          vue.createElementVNode("path", {
            d: "M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z",
            fill: "currentColor"
          }, null, -1)
        ]), 16);
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
    },
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    (timestamp) => {
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}-${day}`;
    }
  ];
  const dateUtil = { timestampToDate };
  const _sfc_main$3 = {
    __name: "PublicTime",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const isYesterday = (timestamp) => {
        const today = /* @__PURE__ */ new Date();
        const input = new Date(timestamp);
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const inputMidnight = new Date(input.getFullYear(), input.getMonth(), input.getDate());
        const timeDiff = todayMidnight - inputMidnight;
        const oneDayMs = 24 * 60 * 60 * 1e3;
        return timeDiff === oneDayMs;
      };
      const convert = (time) => {
        const diff = Math.floor(Date.now() / 1e3) - time;
        if (diff <= 60) return diff + "秒前";
        if (diff <= 60 * 60) return Math.floor(diff / 60) + "分钟前";
        if (diff <= 24 * 60 * 60) return Math.floor(diff / (60 * 60)) + "小时前";
        if (isYesterday(time * 1e3)) return "昨天";
        return (/* @__PURE__ */ new Date()).getFullYear() === new Date(time * 1e3).getFullYear() ? dateUtil.timestampToDate[3](time * 1e3) : dateUtil.timestampToDate[2](time * 1e3);
      };
      const obj = vue.computed(() => {
        const _2 = {};
        _2.time = props.item.pubdate;
        _2.timeText = convert(_2.time);
        return _2;
      });
      return (_ctx, _cache) => {
        return vue.toDisplayString(" · " + obj.value.timeText);
      };
    }
  };
  const _hoisted_1$1 = ["href"];
  const _hoisted_2$1 = { class: "bili-watch-later--wrap" };
  const _hoisted_3$1 = ["srcset"];
  const _hoisted_4$1 = ["srcset"];
  const _hoisted_5 = ["src", "alt"];
  const _hoisted_6 = ["href"];
  const _hoisted_7 = ["title", "innerHTML"];
  const _hoisted_8 = ["href"];
  const _sfc_main$2 = {
    __name: "List",
    props: {
      list: {
        type: Array,
        required: true,
        default: []
      }
    },
    setup(__props) {
      const d_v_s_p = get("data_v_search_page");
      const d_v_b_v_c = get("data_v_bili_video_card");
      const mouseenterCover = (event) => {
        event.target.querySelector(".bili-watch-later").style.display = "";
      };
      const mouseleaveCover = (event) => {
        event.target.querySelector(".bili-watch-later").style.display = "none";
      };
      return (_ctx, _cache) => {
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.list, (item) => {
          return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
            item.type === "video" ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
              key: 0,
              ref_for: true
            }, vue.unref(d_v_s_p), { class: "video-list-item col_3 col_xs_1_5 col_md_2 col_xl_1_7 mb_x40" }), [
              vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, { ...vue.unref(d_v_b_v_c), ...vue.unref(d_v_s_p) }, { class: "bili-video-card" }), [
                vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__skeleton hide" }), [
                  vue.createElementVNode("div", vue.mergeProps({ class: "bili-video-card__skeleton--cover" }, { ref_for: true }, vue.unref(d_v_b_v_c)), null, 16),
                  vue.createElementVNode("div", vue.mergeProps({ class: "bili-video-card__skeleton--info" }, { ref_for: true }, vue.unref(d_v_b_v_c)), [
                    vue.createElementVNode("div", vue.mergeProps({ class: "bili-video-card__skeleton--right" }, { ref_for: true }, vue.unref(d_v_b_v_c)), [
                      vue.createElementVNode("p", vue.mergeProps({ class: "bili-video-card__skeleton--text" }, { ref_for: true }, vue.unref(d_v_b_v_c)), null, 16),
                      vue.createElementVNode("p", vue.mergeProps({ class: "bili-video-card__skeleton--text short" }, { ref_for: true }, vue.unref(d_v_b_v_c)), null, 16),
                      vue.createElementVNode("p", vue.mergeProps({ class: "bili-video-card__skeleton--light" }, { ref_for: true }, vue.unref(d_v_b_v_c)), null, 16)
                    ], 16)
                  ], 16)
                ], 16),
                vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__wrap" }), [
                  vue.createElementVNode("a", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), {
                    href: `//www.bilibili.com/video/${item.bvid}/`,
                    class: "",
                    target: "_blank",
                    "data-mod": "search-card",
                    "data-idx": "all",
                    "data-ext": "click",
                    onMouseenter: mouseenterCover,
                    onMouseleave: mouseleaveCover
                  }), [
                    vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__image" }), [
                      vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__image--wrap" }), [
                        vue.createElementVNode("div", _hoisted_2$1, [
                          vue.createVNode(_sfc_main$8, { item }, null, 8, ["item"])
                        ]),
                        vue.createElementVNode("picture", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "v-img bili-video-card__cover" }), [
                          vue.createElementVNode("source", {
                            srcset: item.pic + "@672w_378h_1c_!web-search-common-cover.avif",
                            type: "image/avif"
                          }, null, 8, _hoisted_3$1),
                          vue.createElementVNode("source", {
                            srcset: item.pic + "@672w_378h_1c_!web-search-common-cover.webp",
                            type: "image/webp"
                          }, null, 8, _hoisted_4$1),
                          vue.createElementVNode("img", {
                            src: item.pic + "@672w_378h_1c_!web-search-common-cover",
                            alt: item.title,
                            loading: "lazy",
                            onload: "",
                            onerror: "typeof window.imgOnError === 'function' && window.imgOnError(this)"
                          }, null, 8, _hoisted_5)
                        ], 16)
                      ], 16),
                      vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__mask" }), [
                        vue.createVNode(_sfc_main$5, { item }, null, 8, ["item"])
                      ], 16)
                    ], 16)
                  ], 16, _hoisted_1$1),
                  vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__info" }), [
                    vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__info--right" }), [
                      vue.createElementVNode("a", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), {
                        href: `//www.bilibili.com/video/${item.bvid}/`,
                        target: "_blank",
                        "data-mod": "search-card",
                        "data-idx": "all",
                        "data-ext": "click"
                      }), [
                        vue.createElementVNode("h3", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), {
                          class: "bili-video-card__info--tit",
                          title: item.title.replace(/<\/?em[^>]*>/g, ""),
                          innerHTML: item.title
                        }), null, 16, _hoisted_7)
                      ], 16, _hoisted_6),
                      vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__info--bottom" }), [
                        vue.createElementVNode("a", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), {
                          class: "bili-video-card__info--owner",
                          href: `//space.bilibili.com/${item.mid}`,
                          target: "_blank",
                          "data-mod": "search-card",
                          "data-idx": "all",
                          "data-ext": "click"
                        }), [
                          vue.createVNode(_sfc_main$4),
                          vue.createElementVNode("span", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__info--author" }), vue.toDisplayString(item.author), 17),
                          vue.createElementVNode("span", vue.mergeProps({ ref_for: true }, vue.unref(d_v_b_v_c), { class: "bili-video-card__info--date" }), [
                            vue.createVNode(_sfc_main$3, { item }, null, 8, ["item"])
                          ], 16)
                        ], 16, _hoisted_8)
                      ], 16)
                    ], 16)
                  ], 16)
                ], 16)
              ], 16)
            ], 16)) : vue.createCommentVNode("", true)
          ], 64);
        }), 256);
      };
    }
  };
  const _hoisted_1 = { class: "vui_pagenation--btns" };
  const _hoisted_2 = ["disabled"];
  const _hoisted_3 = ["onClick"];
  const _hoisted_4 = ["disabled"];
  const _sfc_main$1 = {
    __name: "Pagination",
    props: {
      total: {
        type: Number,
        required: true
      },
      currPage: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        required: true
      }
    },
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const d_v_s_p = get("data_v_search_page");
      const totalPage = vue.computed(() => Math.ceil(props.total / props.pageSize));
      const hasPrev = vue.computed(() => totalPage.value > 1 && props.currPage !== 1);
      const hasNext = vue.computed(() => totalPage.value > 1 && props.currPage !== totalPage.value);
      const pages = vue.computed(() => {
        const maxVisiblePages = 9;
        const _pages = [];
        if (totalPage.value <= maxVisiblePages) {
          for (let i = 1; i <= totalPage.value; i++) {
            _pages.push(i);
          }
        } else {
          const halfVisiblePages = Math.floor(maxVisiblePages / 2);
          _pages.push(1);
          let startPage, endPage;
          if (props.currPage <= halfVisiblePages + 1) {
            startPage = 2;
            endPage = maxVisiblePages - 2;
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push({ text: "...", to: props.currPage + 5 });
            _pages.push(totalPage.value);
          } else if (props.currPage >= totalPage.value - halfVisiblePages) {
            _pages.push({ text: "...", to: props.currPage - 5 });
            startPage = totalPage.value - (maxVisiblePages - 3);
            endPage = totalPage.value - 1;
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push(totalPage.value);
          } else {
            _pages.push({ text: "...", to: props.currPage - 5 });
            startPage = props.currPage - Math.floor((maxVisiblePages - 4) / 2);
            endPage = props.currPage + Math.floor((maxVisiblePages - 4) / 2);
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push({ text: "...", to: props.currPage + 5 });
            _pages.push(totalPage.value);
          }
        }
        return _pages;
      });
      const jump = (to) => {
        emits("change", to);
      };
      return (_ctx, _cache) => {
        return totalPage.value > 1 ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ key: 0 }, vue.unref(d_v_s_p), { class: "vui_pagenation" }), [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("button", {
              class: "vui_button vui_button--disabled vui_pagenation--btn vui_pagenation--btn-side",
              disabled: !hasPrev.value,
              onClick: _cache[0] || (_cache[0] = ($event) => jump(__props.currPage - 1))
            }, " 上一页 ", 8, _hoisted_2),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(pages.value, (page) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                class: vue.normalizeClass({
                  vui_button: true,
                  "vui_button--no-transition": true,
                  "vui_pagenation--btn": true,
                  "vui_pagenation--btn-num": true,
                  "vui_button--active": __props.currPage === page,
                  "vui_button--active-blue": __props.currPage === page
                }),
                onClick: ($event) => jump(typeof page === "object" ? page.to : page)
              }, vue.toDisplayString(typeof page === "object" ? page.text : page), 11, _hoisted_3);
            }), 256)),
            vue.createElementVNode("button", {
              class: "vui_button vui_pagenation--btn vui_pagenation--btn-side",
              disabled: !hasNext.value,
              onClick: _cache[1] || (_cache[1] = ($event) => jump(__props.currPage + 1))
            }, " 下一页 ", 8, _hoisted_4)
          ])
        ], 16)) : vue.createCommentVNode("", true);
      };
    }
  };
  const _sfc_main = {
    __name: "Content",
    props: {
      list: {
        type: Array,
        required: true,
        default: []
      },
      total: {
        type: Number,
        required: true,
        default: 0
      },
      currPage: {
        type: Number,
        required: true,
        default: 1
      },
      pageSize: {
        type: Number,
        required: true,
        default: 42
      }
    },
    emits: ["jump"],
    setup(__props, { emit: __emit }) {
      const emits = __emit;
      const d_v_s_c = get("data_v_search_content");
      const d_v_s_p = get("data_v_search_page");
      const handleJump2 = (to) => {
        emits("jump", to);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          style: {},
          class: "search-page-wrapper"
        }, vue.unref(d_v_s_c)), [
          vue.createElementVNode("div", vue.mergeProps(vue.unref(d_v_s_p), { class: "search-page search-page-video i_wrapper mt_xxl pb_xxl" }), [
            vue.createElementVNode("div", vue.mergeProps(vue.unref(d_v_s_p), { class: "video-list row" }), [
              vue.createVNode(_sfc_main$2, { list: __props.list }, null, 8, ["list"])
            ], 16),
            vue.createElementVNode("div", vue.mergeProps(vue.unref(d_v_s_p), { class: "flex_center mt_x50 mb_lg" }), [
              vue.createVNode(_sfc_main$1, {
                total: __props.total,
                currPage: __props.currPage,
                pageSize: __props.pageSize,
                onChange: handleJump2
              }, null, 8, ["total", "currPage", "pageSize"])
            ], 16)
          ], 16)
        ], 16);
      };
    }
  };
  const original = history.replaceState;
  let href = null;
  let originChannelEL = null;
  let customChannelEL = null;
  let originContentEL = null;
  let customContentEL = null;
  const params = vue.ref({
    searchType: "video",
    tids: 0,
    pn: 1,
    ps: 36
  });
  const total = vue.ref(0);
  const list = vue.ref([]);
  const search = () => {
    href = window.location.href;
    const _2 = new URLSearchParams(window.location.search);
    params.value.keyword = _2.get("keyword") || "要开心噢！";
    params.value.order = _2.get("order") || "";
    params.value.pubtimeBeginS = _2.get("pubtime_begin_s") || 0;
    params.value.pubtimeEndS = _2.get("pubtime_end_s") || 0;
    params.value.duration = _2.get("duration") || 0;
    showLoading();
    type({ ...params.value }, (result) => {
      total.value = result.numResults;
      list.value = result.result;
      hideLoading();
    });
  };
  const handleJump = (to) => {
    params.value.pn = to;
    search();
    document.documentElement.scrollTop = 0;
  };
  const renderChannel = () => {
    vue.createApp({
      render: () => {
        return vue.h(_sfc_main$b, {
          tid: params.value.tids,
          "onUpdate:tid": (newValue) => {
            if (newValue === params.value.tids) return;
            params.value.tids = newValue;
            params.value.pn = 1;
            search();
          }
        });
      }
    }).mount(
      (() => {
        originChannelEL = document.querySelector(
          "#i_cecream .search-header .search-conditions .more-conditions .search-condition-row:nth-child(3)"
        );
        if (customChannelEL) customChannelEL.parentNode.removeChild(customChannelEL);
        customChannelEL = originChannelEL.cloneNode();
        customChannelEL.id = "custom-channel";
        originChannelEL.parentNode.append(customChannelEL);
        return customChannelEL;
      })()
    );
  };
  const renderContent = () => {
    vue.createApp({
      render: () => {
        return vue.h(_sfc_main, {
          list: list.value,
          total: total.value,
          currPage: params.value.pn,
          pageSize: params.value.ps,
          onJump: handleJump
        });
      }
    }).mount(
      (() => {
        originContentEL = document.querySelector("#i_cecream .search-content");
        if (customContentEL) customContentEL.parentNode.removeChild(customContentEL);
        customContentEL = originContentEL.cloneNode();
        customContentEL.id = "custom-content";
        originContentEL.parentNode.append(customContentEL);
        return customContentEL;
      })()
    );
  };
  const replace = () => {
    if (originChannelEL) {
      if (!document.body.contains(originChannelEL)) {
        originChannelEL = document.querySelector(
          "#i_cecream .search-header .search-conditions .more-conditions .search-condition-row:nth-child(3)"
        );
      }
      originChannelEL.style.display = "none";
    }
    if (customChannelEL) {
      if (!document.body.contains(customChannelEL)) {
        originChannelEL.parentNode.append(customChannelEL);
      }
      customChannelEL.style.display = "";
    }
    if (originContentEL) originContentEL.style.display = "none";
    if (customContentEL) customContentEL.style.display = "";
  };
  const restore = () => {
    if (originChannelEL) originChannelEL.style.display = "";
    if (customChannelEL) customChannelEL.style.display = "none";
    if (originContentEL) originContentEL.style.display = "";
    if (customContentEL) customContentEL.style.display = "none";
  };
  (() => {
    const load_observer = new MutationObserver(() => {
      const videoTab = document.querySelector(
        "#i_cecream .search-header .search-tabs .vui_tabs--nav-item:nth-child(2)"
      );
      if (!videoTab || !videoTab.classList.contains("vui_tabs--nav-item-active")) return;
      load_observer.disconnect();
      renderChannel();
      renderContent();
      const _2 = () => {
        if (!videoTab.classList.contains("vui_tabs--nav-item-active")) {
          restore();
          history.replaceState = original;
        } else {
          replace();
          history.replaceState = function(...args) {
            original.apply(this, args);
            if (href === window.location.href) return;
            params.value.pn = 1;
            search();
          };
          params.value.tids = 0;
          params.value.pn = 1;
          search();
        }
      };
      new MutationObserver(_2).observe(videoTab, {
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true
      });
      _2();
    });
    load_observer.observe(document.body, { childList: true, subtree: true });
  })();

})(Vue);