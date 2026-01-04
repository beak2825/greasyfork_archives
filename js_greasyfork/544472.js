// ==UserScript==
// @name         B站个人空间投稿页分区筛选功能
// @namespace    https://github.com/Jayvin-Leung
// @version      1.1.0
// @author       Jayvin Leung
// @description  恢复B站个人空间投稿页分区筛选功能
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @homepageURL  https://github.com/Jayvin-Leung/Bilibili-Upload-Filter
// @supportURL   https://github.com/Jayvin-Leung/Bilibili-Upload-Filter/issues
// @match        https://space.bilibili.com/*
// @require      https://registry.npmmirror.com/vue/3.5.18/files/dist/vue.global.prod.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544472/B%E7%AB%99%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4%E6%8A%95%E7%A8%BF%E9%A1%B5%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544472/B%E7%AB%99%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4%E6%8A%95%E7%A8%BF%E9%A1%B5%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

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
  const encWbi = (params, img_key, sub_key) => {
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
    Object.assign(params, { wts: curr_time });
    const query = Object.keys(params).sort().map((key) => {
      const value = params[key].toString().replace(chr_filter, "");
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
    get(url, params = {}, success, failure) {
      params.platform = "web";
      const keys = Object.keys(params).sort();
      const query = keys.map((k) => `${k}=${params[k]}`).join("&");
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
    post(url, params = {}, success, failure) {
      params.platform = "web";
      params.csrf = biliUtil.getCsrf();
      const keys = Object.keys(params).sort();
      const query = new URLSearchParams();
      keys.forEach((k) => query.append(k, params[k]));
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
    async wbiGet(url, params = {}, success, failure) {
      params.platform = "web";
      const wbiKeys = await getWbiKeys();
      const query = biliUtil.encWbi(params, wbiKeys.img_key, wbiKeys.sub_key);
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
  const search = ({
    mid: mid2,
    pn = 1,
    ps = 40,
    tid = 0,
    order = "pubdate",
    orderAvoided = true,
    specialType = ""
  }, success, failure) => {
    if (!mid2) return;
    let url = "https://api.bilibili.com/x/space/wbi/arc/search";
    let params = {
      mid: mid2,
      pn,
      ps,
      tid,
      order,
      order_avoided: orderAvoided,
      special_type: specialType
    };
    return request$1.wbiGet(url, params, success, failure);
  };
  const _sfc_main$9 = {
    __name: "Top",
    props: {
      mid: {
        type: String,
        required: true,
        default: ""
      },
      tid: {
        type: Number,
        required: false
      },
      order: {
        type: String,
        required: false
      }
    },
    setup(__props) {
      const props = __props;
      const mapping = {
        pubdate: "pubtime",
        click: "play",
        stow: "fav"
      };
      const url = vue.computed(() => {
        let _ = `http://www.bilibili.com/medialist/play/${props.mid}?from=space`;
        if (props.tid) _ += `&tid=${props.tid}`;
        if (props.order) _ += `&sort_field=${mapping[props.order]}`;
        return _;
      });
      const handleClick = () => {
        window.open(url.value);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "video-header__top" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "title" }), "TA的视频", 16),
          vue.createElementVNode("button", vue.mergeProps(_ctx.$attrs, {
            class: "vui_button action-btn playall-btn play-all",
            onClick: handleClick
          }), _cache[0] || (_cache[0] = [
            vue.createElementVNode("i", {
              class: "vui_icon sic-fsp-play_fill icon",
              style: { "font-size": "12px" }
            }, null, -1),
            vue.createElementVNode("span", null, "播放全部", -1)
          ]), 16)
        ], 16);
      };
    }
  };
  const _hoisted_1$7 = ["onClick"];
  const _sfc_main$8 = {
    __name: "Bottom",
    props: {
      order: {
        type: String,
        required: true,
        default: "pubdate"
      },
      type: {
        type: String,
        required: true,
        default: ""
      },
      slist: {
        type: Array,
        required: true,
        default: []
      },
      tid: {
        type: Number,
        required: true,
        default: 0
      },
      tlist: {
        type: Array,
        required: true,
        default: []
      },
      mode: {
        type: String,
        required: true,
        default: "grid-mode"
      }
    },
    emits: ["changeOrder", "filter", "changeMode"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const open = vue.ref(false);
      const handleClickOrder = (order) => {
        if (order === props.order) return;
        emits("changeOrder", order);
      };
      const handleClickRadio = (type, tid) => {
        if (type === props.type && tid === props.tid) return;
        emits("filter", type, tid);
      };
      const handleClickMode = () => {
        emits("changeMode");
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "video-header__bottom" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "breadcrumb" }), [
            vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "radio-filter video-order-filter" }), [
              vue.createElementVNode("div", {
                class: vue.normalizeClass({
                  "radio-filter__item": true,
                  "radio-filter__item--active": __props.order === "pubdate"
                }),
                onClick: _cache[0] || (_cache[0] = ($event) => handleClickOrder("pubdate"))
              }, " 最新发布 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass({
                  "radio-filter__item": true,
                  "radio-filter__item--active": __props.order === "click"
                }),
                onClick: _cache[1] || (_cache[1] = ($event) => handleClickOrder("click"))
              }, " 最多播放 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass({
                  "radio-filter__item": true,
                  "radio-filter__item--active": __props.order === "stow"
                }),
                onClick: _cache[2] || (_cache[2] = ($event) => handleClickOrder("stow"))
              }, " 最多收藏 ", 2)
            ], 16),
            __props.slist.length > 0 || __props.tlist.length > 0 ? (vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({ key: 0 }, _ctx.$attrs, {
              class: "vui_button video-type-filter-switcher",
              onClick: _cache[3] || (_cache[3] = ($event) => open.value = !open.value)
            }), [
              _cache[6] || (_cache[6] = vue.createTextVNode(" 更多筛选 ", -1)),
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: {
                  vui_icon: true,
                  "sic-BDC-arrow_expand_line": true,
                  "video-type-filter-switcher--icon": true,
                  revert: open.value
                },
                style: { "font-size": "12px" }
              }), null, 16)
            ], 16)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", vue.mergeProps({ "data-v-0c0350ba": "" }, _ctx.$attrs, { class: "lists-view-mode video-mode-switcher" }), [
              vue.createElementVNode("div", {
                "data-v-0c0350ba": "",
                class: "lists-view-mode__action",
                onClick: handleClickMode
              }, [
                vue.createElementVNode("i", {
                  "data-v-0c0350ba": "",
                  class: vue.normalizeClass({
                    vui_icon: true,
                    "sic-fsp-grid_line": __props.mode === "list-mode",
                    "sic-fsp-list_line": __props.mode === "grid-mode"
                  }),
                  style: { "font-size": "28px" }
                }, null, 2)
              ])
            ], 16)
          ], 16),
          __props.slist.length > 0 || __props.tlist.length > 0 ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ key: 0 }, _ctx.$attrs, {
            class: "radio-filter video-type-filter",
            style: {}
          }), [
            vue.createElementVNode("div", {
              class: vue.normalizeClass({
                "radio-filter__item": true,
                "radio-filter__item--active": __props.type === "" && __props.tid === 0
              }),
              onClick: _cache[4] || (_cache[4] = ($event) => handleClickRadio("", 0))
            }, " 全部类型 " + vue.toDisplayString(__props.tlist.reduce((sum, item) => sum + item.count, 0)), 3),
            __props.slist.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass({
                "radio-filter__item": true,
                "radio-filter__item--active": __props.type === "charging" && __props.tid === 0
              }),
              onClick: _cache[5] || (_cache[5] = ($event) => handleClickRadio("charging", 0))
            }, [
              _cache[7] || (_cache[7] = vue.createElementVNode("i", {
                class: "vui_icon sic-BDC-battery_charge_simple_fill radio-filter__item-icon",
                style: { "font-size": "16px" }
              }, null, -1)),
              vue.createTextVNode(" 充电专属 " + vue.toDisplayString(__props.slist[0].count), 1)
            ], 2)) : vue.createCommentVNode("", true),
            __props.tlist.length > 0 ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(__props.tlist, (item) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass({
                  "radio-filter__item": true,
                  "radio-filter__item--active": __props.tid === item.tid && __props.type === ""
                }),
                onClick: ($event) => handleClickRadio("", item.tid)
              }, vue.toDisplayString(item.name) + " " + vue.toDisplayString(item.count), 11, _hoisted_1$7);
            }), 256)) : vue.createCommentVNode("", true)
          ], 16)), [
            [vue.vShow, open.value]
          ]) : vue.createCommentVNode("", true)
        ], 16);
      };
    }
  };
  const _hoisted_1$6 = {
    key: 0,
    class: "bili-cover-card__tags"
  };
  const _hoisted_2$6 = {
    key: 0,
    class: "sic-BDC-battery_charge_simple_fill"
  };
  const _sfc_main$7 = {
    __name: "Tags",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const tags = vue.computed(() => {
        const _ = [];
        const time = props.item.is_avoided === 1 ? props.item.meta.ptime : props.item.created;
        if (Math.floor(Date.now() / 1e3) - time < 24 * 60 * 60) {
          _.push({ type: "new-tag", text: "最新" });
        }
        if (props.item.is_charging_arc) {
          _.push({ type: "charge-tag", text: "充电专属" });
        }
        if (props.item.is_lesson_video === 1) {
          _.push({ type: "pugv-tag", text: "课堂" });
        }
        if (props.item.is_steins_gate === 1) {
          _.push({ type: "interactive-tag", text: "互动" });
        }
        if (props.item.is_union_video === 1) {
          _.push({ type: "union-tag", text: "合作" });
        }
        if (props.item.is_live_playback === 1) {
          _.push({ type: "live-tag", text: "直播回放" });
        }
        return _;
      });
      return (_ctx, _cache) => {
        return tags.value.length && tags.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(tags.value, (obj, index) => {
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: index }, [
              index < 2 ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(["bili-cover-card__tag", obj.type])
              }, [
                obj.type === "charge-tag" ? (vue.openBlock(), vue.createElementBlock("i", _hoisted_2$6)) : vue.createCommentVNode("", true),
                vue.createElementVNode("span", null, vue.toDisplayString(obj.text), 1)
              ], 2)) : vue.createCommentVNode("", true)
            ], 64);
          }), 128))
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const _hoisted_1$5 = { class: "bili-cover-card__stats" };
  const _hoisted_2$5 = {
    key: 0,
    class: "bili-cover-card__stat"
  };
  const _hoisted_3$3 = {
    key: 1,
    class: "bili-cover-card__stat"
  };
  const _hoisted_4$3 = {
    key: 2,
    class: "bili-cover-card__stat"
  };
  const _hoisted_5$2 = { class: "bili-cover-card__stat" };
  const _hoisted_6$2 = {
    key: 0,
    class: "sic-BDC-video_archive_line"
  };
  const _sfc_main$6 = {
    __name: "Stats",
    props: {
      item: {
        type: Object,
        required: true
      },
      mode: {
        type: String,
        required: true,
        default: "grid-mode"
      }
    },
    setup(__props) {
      const props = __props;
      const convert = (length) => {
        const [minutes, seconds] = length.split(":").map(Number);
        if (minutes < 60) return length;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return [
          hours.toString().padStart(2, "0"),
          remainingMinutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
        ].join(":");
      };
      const obj = vue.computed(() => {
        const _ = {};
        _.isAvoidedOrLesson = props.item.is_avoided === 1 || props.item.is_lesson_video === 1;
        _.play = _.isAvoidedOrLesson ? props.item.meta.stat.view : props.item.play;
        _.playText = _.play < 1e4 ? _.play : (_.play / 1e4).toFixed(1) + "万";
        _.danmu = _.isAvoidedOrLesson ? props.item.meta.stat.danmaku : props.item.video_review;
        _.danmuText = _.danmu < 1e4 ? _.danmu : (_.danmu / 1e4).toFixed(1) + "万";
        _.lengthOrLessonInfo = _.isAvoidedOrLesson ? props.item.is_avoided === 1 ? props.item.meta.ep_count : props.item.lesson_update_info : convert(props.item.length);
        return _;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          __props.mode === "list-mode" && __props.item.is_self_view ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$5, _cache[0] || (_cache[0] = [
            vue.createElementVNode("i", { class: "sic-BDC-lock_locked_line" }, null, -1),
            vue.createElementVNode("span", null, "仅自己可见", -1)
          ]))) : vue.createCommentVNode("", true),
          __props.mode === "grid-mode" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$3, [
            _cache[1] || (_cache[1] = vue.createElementVNode("i", { class: "sic-BDC-playdata_square_line" }, null, -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(obj.value.playText), 1)
          ])) : vue.createCommentVNode("", true),
          __props.mode === "grid-mode" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$3, [
            _cache[2] || (_cache[2] = vue.createElementVNode("i", { class: "sic-BDC-danmu_square_line" }, null, -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(obj.value.danmuText), 1)
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_5$2, [
            obj.value.isAvoidedOrLesson ? (vue.openBlock(), vue.createElementBlock("i", _hoisted_6$2)) : vue.createCommentVNode("", true),
            vue.createElementVNode("span", null, vue.toDisplayString(obj.value.lengthOrLessonInfo), 1)
          ])
        ]);
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
  const _hoisted_1$4 = { class: "upload-video-card__stats" };
  const _hoisted_2$4 = { class: "stat" };
  const _hoisted_3$2 = { class: "stat" };
  const _hoisted_4$2 = { class: "stat" };
  const _sfc_main$5 = {
    __name: "StatsRight",
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
        const _ = {};
        _.isAvoidedOrLesson = props.item.is_avoided === 1 || props.item.is_lesson_video === 1;
        _.play = _.isAvoidedOrLesson ? props.item.meta.stat.view : props.item.play;
        _.playText = _.play < 1e4 ? _.play : (_.play / 1e4).toFixed(1) + "万";
        _.danmu = _.isAvoidedOrLesson ? props.item.meta.stat.danmaku : props.item.video_review;
        _.danmuText = _.danmu < 1e4 ? _.danmu : (_.danmu / 1e4).toFixed(1) + "万";
        _.time = props.item.is_avoided === 1 ? props.item.meta.ptime : props.item.created;
        _.timeText = convert(_.time);
        return _;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
          vue.createElementVNode("div", _hoisted_2$4, [
            _cache[0] || (_cache[0] = vue.createElementVNode("i", {
              class: "vui_icon sic-BDC-playdata_square_line icon",
              style: { "font-size": "18px" }
            }, null, -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(obj.value.playText), 1)
          ]),
          vue.createElementVNode("div", _hoisted_3$2, [
            _cache[1] || (_cache[1] = vue.createElementVNode("i", {
              class: "vui_icon sic-BDC-danmu_square_line icon",
              style: { "font-size": "18px" }
            }, null, -1)),
            vue.createElementVNode("span", null, vue.toDisplayString(obj.value.danmuText), 1)
          ]),
          vue.createElementVNode("div", _hoisted_4$2, vue.toDisplayString(obj.value.timeText), 1)
        ]);
      };
    }
  };
  const _hoisted_1$3 = {
    key: 0,
    class: "bili-video-card__subtitle"
  };
  const _hoisted_2$3 = {
    key: 1,
    class: "bili-video-card__subtitle"
  };
  const _sfc_main$4 = {
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
        const _ = {};
        _.time = props.item.is_avoided === 1 ? props.item.meta.ptime : props.item.created;
        _.timeText = convert(_.time);
        return _;
      });
      return (_ctx, _cache) => {
        return __props.item.is_self_view ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          _cache[0] || (_cache[0] = vue.createElementVNode("i", { class: "sic-BDC-lock_locked_line" }, null, -1)),
          vue.createElementVNode("span", null, "仅自己可见 · " + vue.toDisplayString(obj.value.timeText), 1)
        ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$3, [
          vue.createElementVNode("span", null, vue.toDisplayString(obj.value.timeText), 1)
        ]));
      };
    }
  };
  const add = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/add";
    let params = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params, success, failure);
  };
  const del = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/del";
    let params = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params, success, failure);
  };
  const _hoisted_1$2 = { class: "bili-card-watch-later" };
  const _hoisted_2$2 = { class: "bili-card-watch-later__tip" };
  const _sfc_main$3 = {
    __name: "WatchLater",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      const props = __props;
      const handleWatchLater = (event) => {
        event.stopPropagation();
        if (props.item.is_steins_gate === 1) return;
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
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", {
            class: "bili-card-watch-later__btn",
            onClick: _cache[0] || (_cache[0] = (event) => handleWatchLater(event))
          }, [
            vue.createElementVNode("i", {
              class: vue.normalizeClass(__props.item.toview ? "sic-BDC-checkmark_line" : "sic-BDC-arrow_play_next_line"),
              style: { "font-variation-settings": "'strk' 1.5" }
            }, null, 2)
          ]),
          vue.createElementVNode("span", _hoisted_2$2, vue.toDisplayString(__props.item.toview ? "移除" : "稍后再看"), 1)
        ]);
      };
    }
  };
  const _hoisted_1$1 = { class: "upload-video-card__left" };
  const _hoisted_2$1 = { class: "upload-video-card__main" };
  const _hoisted_3$1 = { class: "bili-video-card" };
  const _hoisted_4$1 = { class: "bili-video-card__wrap" };
  const _hoisted_5$1 = ["href"];
  const _hoisted_6$1 = { class: "bili-cover-card__thumbnail" };
  const _hoisted_7 = ["src", "alt"];
  const _hoisted_8 = {
    key: 0,
    class: "bili-video-card__details"
  };
  const _hoisted_9 = ["title"];
  const _hoisted_10 = ["href"];
  const _hoisted_11 = {
    key: 0,
    class: "upload-video-card__right"
  };
  const _hoisted_12 = { class: "info__top" };
  const _hoisted_13 = ["href", "title"];
  const _hoisted_14 = { class: "desc" };
  const _hoisted_15 = {
    class: "vui_ellipsis multi-mode",
    style: { "-webkit-line-clamp": "2" }
  };
  const _hoisted_16 = { class: "info__bottom" };
  const _sfc_main$2 = {
    __name: "List",
    props: {
      list: {
        type: Array,
        required: true,
        default: []
      },
      mode: {
        type: String,
        required: true,
        default: "grid-mode"
      }
    },
    setup(__props) {
      const mouseenterCover = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-watch-later")) == null ? void 0 : _a.classList.add("bili-card-watch-later--visible");
      };
      const mouseleaveCover = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-watch-later")) == null ? void 0 : _a.classList.remove("bili-card-watch-later--visible");
      };
      return (_ctx, _cache) => {
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.list, (item) => {
          return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ ref_for: true }, _ctx.$attrs, {
            class: ["upload-video-card", __props.mode]
          }), [
            vue.createElementVNode("div", _hoisted_1$1, [
              vue.createElementVNode("div", _hoisted_2$1, [
                vue.createElementVNode("div", _hoisted_3$1, [
                  vue.createElementVNode("div", _hoisted_4$1, [
                    vue.createElementVNode("div", {
                      class: "bili-video-card__cover",
                      onMouseenter: mouseenterCover,
                      onMouseleave: mouseleaveCover
                    }, [
                      vue.createElementVNode("a", {
                        class: vue.normalizeClass({
                          "bili-cover-card": true,
                          "bili-cover-card--frozen": item.is_charging_arc || item.is_lesson_video
                        }),
                        href: `//www.bilibili.com/video/${item.bvid}/?spm_id_from=333.1387.upload.video_card.click`,
                        target: "_blank"
                      }, [
                        vue.createElementVNode("div", _hoisted_6$1, [
                          vue.createElementVNode("img", {
                            src: item.is_avoided === 1 ? item.meta.cover.slice(item.meta.cover.indexOf("//")) + "@672w_378h_1c.avif" : item.pic.slice(item.pic.indexOf("//")) + "@672w_378h_1c.avif",
                            class: "",
                            alt: item.is_avoided === 1 ? item.meta.title : item.title,
                            onload: "typeof window.bmgCmptOnload === 'function' && window.bmgCmptOnload(this)",
                            onerror: "typeof window.bmgCmptOnerror === 'function' && window.bmgCmptOnerror(this)"
                          }, null, 8, _hoisted_7)
                        ]),
                        vue.createVNode(_sfc_main$7, { item }, null, 8, ["item"]),
                        vue.createVNode(_sfc_main$6, {
                          item,
                          mode: __props.mode
                        }, null, 8, ["item", "mode"])
                      ], 10, _hoisted_5$1),
                      !item.is_lesson_video ? (vue.openBlock(), vue.createBlock(_sfc_main$3, {
                        key: 0,
                        item
                      }, null, 8, ["item"])) : vue.createCommentVNode("", true)
                    ], 32),
                    __props.mode === "grid-mode" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
                      vue.createElementVNode("div", {
                        class: "bili-video-card__title",
                        title: item.is_avoided === 1 ? item.meta.title : item.title
                      }, [
                        vue.createElementVNode("a", {
                          href: `//www.bilibili.com/video/${item.bvid}/?spm_id_from=333.1387.upload.video_card.click`,
                          target: "_blank"
                        }, vue.toDisplayString(item.is_avoided === 1 ? item.meta.title : item.title), 9, _hoisted_10)
                      ], 8, _hoisted_9),
                      vue.createVNode(_sfc_main$4, { item }, null, 8, ["item"])
                    ])) : vue.createCommentVNode("", true)
                  ])
                ])
              ])
            ]),
            __props.mode === "list-mode" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
              vue.createElementVNode("div", _hoisted_12, [
                vue.createElementVNode("a", {
                  class: "title",
                  href: `//www.bilibili.com/video/${item.bvid}/`,
                  target: "_blank",
                  title: item.is_avoided === 1 ? item.meta.title : item.title
                }, vue.toDisplayString(item.is_avoided === 1 ? item.meta.title : item.title), 9, _hoisted_13),
                vue.createElementVNode("div", _hoisted_14, [
                  vue.createElementVNode("div", _hoisted_15, vue.toDisplayString(item.is_avoided === 1 ? item.meta.intro : item.description), 1)
                ])
              ]),
              vue.createElementVNode("div", _hoisted_16, [
                vue.createVNode(_sfc_main$5, { item }, null, 8, ["item"])
              ])
            ])) : vue.createCommentVNode("", true)
          ], 16);
        }), 256);
      };
    }
  };
  const _hoisted_1 = { class: "vui_pagenation--btns" };
  const _hoisted_2 = ["onClick"];
  const _hoisted_3 = { class: "vui_pagenation-go" };
  const _hoisted_4 = { class: "vui_pagenation-go__count" };
  const _hoisted_5 = { class: "vui_input" };
  const _hoisted_6 = { class: "vui_input-wrapper" };
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
      const handleEnter = (event) => {
        const to = Number(event.target.value);
        if (Number.isInteger(to) && to >= 1 && to <= totalPage.value) {
          jump(to);
        }
        event.target.value = "";
      };
      return (_ctx, _cache) => {
        return totalPage.value > 1 ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ key: 0 }, _ctx.$attrs, { class: "vui_pagenation vui_pagenation--jump video-pagination" }), [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("button", {
              class: vue.normalizeClass({
                vui_button: true,
                "vui_pagenation--btn": true,
                "vui_pagenation--btn-side": true,
                "vui_button--disabled": !hasPrev.value
              }),
              onClick: _cache[0] || (_cache[0] = ($event) => jump(__props.currPage - 1))
            }, " 上一页 ", 2),
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
              }, vue.toDisplayString(typeof page === "object" ? page.text : page), 11, _hoisted_2);
            }), 256)),
            vue.createElementVNode("button", {
              class: vue.normalizeClass({
                vui_button: true,
                "vui_pagenation--btn": true,
                "vui_pagenation--btn-side": true,
                "vui_button--disabled": !hasNext.value
              }),
              onClick: _cache[1] || (_cache[1] = ($event) => jump(__props.currPage + 1))
            }, " 下一页 ", 2)
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            vue.createElementVNode("span", _hoisted_4, " 共 " + vue.toDisplayString(totalPage.value) + " 页 / " + vue.toDisplayString(__props.total) + " 个，跳至 ", 1),
            vue.createElementVNode("div", _hoisted_5, [
              vue.createElementVNode("div", _hoisted_6, [
                vue.createElementVNode("input", {
                  type: "number",
                  class: "vui_input__input vui_input__input-resizable",
                  onKeyup: vue.withKeys(handleEnter, ["enter"])
                }, null, 32)
              ])
            ]),
            _cache[2] || (_cache[2] = vue.createElementVNode("span", { class: "vui_pagenation-go__page" }, "页", -1))
          ])
        ], 16)) : vue.createCommentVNode("", true);
      };
    }
  };
  const _sfc_main = {
    __name: "Video",
    props: {
      mid: {
        type: String,
        required: true,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      const mode = vue.ref("grid-mode");
      const params = vue.ref({
        pn: 1,
        ps: 42,
        tid: 0,
        order: "pubdate",
        orderAvoided: true,
        specialType: ""
      });
      const total = vue.ref(0);
      const slist = vue.ref([]);
      const tlist = vue.ref({});
      const vlist = vue.ref([]);
      const search$1 = () => {
        search({ mid: props.mid, ...params.value }, (result) => {
          total.value = result.page.count;
          slist.value = result.list.slist;
          tlist.value = result.list.tlist;
          vlist.value = result.list.vlist;
        });
      };
      const handleChangeOrder = (order) => {
        params.value.order = order;
        params.value.pn = 1;
        search$1();
      };
      const handleChangeMode = () => {
        mode.value = mode.value === "grid-mode" ? "list-mode" : "grid-mode";
      };
      const handleFilter = (type, tid) => {
        params.value.specialType = type;
        params.value.tid = tid;
        params.value.pn = 1;
        search$1();
      };
      const handleJump = (to) => {
        params.value.pn = to;
        search$1();
        document.documentElement.scrollTop = 0;
      };
      search$1();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "video" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "video-header" }), [
            vue.createVNode(_sfc_main$9, vue.mergeProps(_ctx.$attrs, {
              mid: props.mid,
              tid: params.value.tid,
              order: params.value.order
            }), null, 16, ["mid", "tid", "order"]),
            vue.createVNode(_sfc_main$8, vue.mergeProps(_ctx.$attrs, {
              order: params.value.order,
              onChangeOrder: handleChangeOrder,
              mode: mode.value,
              onChangeMode: handleChangeMode,
              type: params.value.specialType,
              slist: slist.value || [],
              tid: params.value.tid,
              tlist: tlist.value ? Object.values(tlist.value) : [],
              onFilter: handleFilter
            }), null, 16, ["order", "mode", "type", "slist", "tid", "tlist"])
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "video-body" }), [
            vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, {
              class: ["video-list", mode.value]
            }), [
              vue.createVNode(_sfc_main$2, vue.mergeProps(_ctx.$attrs, {
                list: vlist.value || [],
                mode: mode.value
              }), null, 16, ["list", "mode"])
            ], 16)
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "video-footer" }), [
            vue.createVNode(_sfc_main$1, vue.mergeProps(_ctx.$attrs, {
              total: total.value,
              currPage: params.value.pn,
              pageSize: params.value.ps,
              onChange: handleJump
            }), null, 16, ["total", "currPage", "pageSize"])
          ], 16)
        ], 16);
      };
    }
  };
  const mid = location.pathname.split("/")[1];
  let spaceMainElement = null;
  const render = () => {
    let attr = null;
    vue.createApp({
      render: () => {
        return vue.h(_sfc_main, {
          [attr.name]: attr.value,
          mid
        });
      }
    }).mount(
      (() => {
        const videoElement = spaceMainElement.querySelector(".video");
        attr = Object.values(videoElement.attributes).find((item) => {
          return item.name.startsWith("data-v-");
        });
        return videoElement.parentNode;
      })()
    );
  };
  (() => {
    const load_observer = new MutationObserver(() => {
      spaceMainElement = document.body.querySelector("div#app > main.space-main");
      if (!spaceMainElement) return;
      load_observer.disconnect();
      const _ = () => {
        if (!spaceMainElement.classList.contains("route_uploadVideo")) return;
        render();
      };
      _();
      new MutationObserver(_).observe(spaceMainElement, {
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true
      });
    });
    load_observer.observe(document.body, { childList: true, subtree: true });
  })();

})(Vue);