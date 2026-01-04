// ==UserScript==
// @name         海涛慕课小工具
// @namespace    慕课网
// @version      2.0
// @description  慕课小工具
// @author       海涛
// @match        *://*/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379408/%E6%B5%B7%E6%B6%9B%E6%85%95%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/379408/%E6%B5%B7%E6%B6%9B%E6%85%95%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/cxmooc-tools/mooc.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_charenc@0.0.2@charenc/charenc.js":
/*!********************************************************!*\
  !*** ./node_modules/_charenc@0.0.2@charenc/charenc.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "./node_modules/_crypt@0.0.2@crypt/crypt.js":
/*!**************************************************!*\
  !*** ./node_modules/_crypt@0.0.2@crypt/crypt.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
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
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
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
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "./node_modules/_is-buffer@1.1.6@is-buffer/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/_is-buffer@1.1.6@is-buffer/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/_md5@2.2.1@md5/md5.js":
/*!********************************************!*\
  !*** ./node_modules/_md5@2.2.1@md5/md5.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/_crypt@0.0.2@crypt/crypt.js"),
      utf8 = __webpack_require__(/*! charenc */ "./node_modules/_charenc@0.0.2@charenc/charenc.js").utf8,
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/_is-buffer@1.1.6@is-buffer/index.js"),
      bin = __webpack_require__(/*! charenc */ "./node_modules/_charenc@0.0.2@charenc/charenc.js").bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    url: "https://blog.icodef.com:8081/",
    version: 1.56,
    update: 'https://github.com/CodFrm/cxmooc-tools/releases',
    enforce: false,
    cx: {
        player: 'https://blog.icodef.com:8081/player/cxmooc-tools.swf',
        resplugin: 'https://blog.icodef.com:8081/player/ResourcePlug.swf'
    }
}

/***/ }),

/***/ "./src/cxmooc-tools/common.js":
/*!************************************!*\
  !*** ./src/cxmooc-tools/common.js ***!
  \************************************/
/*! exports provided: showExpand, injected, substrEx, get, post, createBtn, switchChoice, switchTask, dealRegx, removeHTML, getLocalTopic, pop_prompt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showExpand", function() { return showExpand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injected", function() { return injected; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "substrEx", function() { return substrEx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "post", function() { return post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBtn", function() { return createBtn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchChoice", function() { return switchChoice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchTask", function() { return switchTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dealRegx", function() { return dealRegx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeHTML", function() { return removeHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLocalTopic", function() { return getLocalTopic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pop_prompt", function() { return pop_prompt; });
const topic = __webpack_require__(/*! ./topic */ "./src/cxmooc-tools/topic.js");
const video = __webpack_require__(/*! ./video */ "./src/cxmooc-tools/video.js");
/**
 * 显示扩展按钮,并绑定事件
 * @param {iframe document} _this 
 */
function showExpand(_this) {
    var ans = _this.contentDocument.getElementsByClassName('ans-job-icon');
    var config = JSON.parse(localStorage['config']);
    clearInterval(window.switchTimer);
    if (ans.length <= 0 && config['auto']) {
        //没有任务点,正在挂机的状态,5s后切换下一个
        console.log('null,switch task');
        window.switchTimer = setTimeout(function () {
            switchTask();
        }, 5000);
        return;
    }
    for (var i = 0; i < ans.length; i++) {
        ans[i].style.width = '100%';
        ans[i].style.textAlign = 'center';
        if (ans[i].nextSibling.className.indexOf('ans-insertvideo-online') >= 0) {
            //视频
            video(_this, ans[i], i);
        } else if (ans[i].parentNode.className.indexOf('ans-attach-ct ans-job-finished') >= 0) {
            //做完的题目
            topic(_this, ans[i], i, true);
        } else if (ans[i].parentNode.className.indexOf('ans-attach-ct') >= 0) {
            //未做完的题目
            topic(_this, ans[i], i, false);
        }
        //处理某些标签
        var delSpans = ans[i].getElementsByTagName('span');
        for (var n = 0; n < delSpans.length; n++) {
            delSpans[n].setAttribute('style', '');
        }
        //如果是挂机模式,并且是第一个,点击,启动!
        if (i == 0 && config['auto']) {
            setTimeout(function () {
                _this.contentDocument.getElementById('action-btn').click();
            }, 2000);
        }
    }
}

function injected(doc, file) {
    var path = 'src/' + file;
    var temp = doc.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.src = document.head.getAttribute('chrome-url') + path;
    doc.head.appendChild(temp);
}

/**
 * 取中间文本
 * @param {*} str 
 * @param {*} left 
 * @param {*} right 
 */
function substrEx(str, left, right) {
    var leftPos = str.indexOf(left) + left.length;
    var rightPos = str.indexOf(right, leftPos);
    return str.substring(leftPos, rightPos);
}
/**
 * 创建http请求
 */
function createRequest() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}
/**
 * get请求
 * @param {*} url 
 */
function get(url) {
    try {
        var xmlhttp = createRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    } catch (e) {
        return false;
    }
    return xmlhttp;
}

function post(url, data, json = true) {
    try {
        var xmlhttp = createRequest();
        xmlhttp.open("POST", url, true);
        if (json) {
            xmlhttp.setRequestHeader("Content-Type", "application/json");
        } else {
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xmlhttp.send(data);
    } catch (e) {
        return false;
    }
    return xmlhttp;
}

/**
 * 创建一个按钮
 * @param {*} title 
 */
function createBtn(title) {
    var btn = document.createElement('button');
    btn.innerText = title;
    btn.style.outline = 'none';
    btn.style.border = '0';
    btn.style.background = '#7d9d35';
    btn.style.color = '#fff';
    btn.style.borderRadius = '4px';
    btn.style.padding = '2px 8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.marginLeft = '4px';
    btn.onmousemove = () => {
        btn.style.boxShadow = '1px 1px 1px 1px #ccc';
    };
    btn.onmouseout = () => {
        btn.style.boxShadow = '';
    };
    return btn;
}

function switchChoice() {
    var tab = document.getElementsByClassName('tabtags');
    if (tab.length <= 0) {
        return false;
    }
    var tabs = tab[0].getElementsByTagName('span');
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].className.indexOf('currents') > 0) {
            //现行,切换到下一个
            if (i + 1 >= tabs.length) {
                //超过长度
                break;
            } else {
                return tabs[i + 1];
            }
        }
    }
    //可以换页了
    return false;
}

function switchTask() {
    // var now = Math.round(new Date().getTime() / 1000);
    // if (localStorage['last'] != undefined) {
    //     //判断上次间隔
    //     console.log();
    //     if (now - localStorage['last'] < 4) {
    //         //小于4秒不进行操作,返回
    //         return;
    //     }
    // }
    // localStorage['last'] = Math.round(new Date().getTime() / 1000);
    //判断选项夹
    var tab = switchChoice();
    if (tab !== false) {
        tab.click();
        return true;
    }
    //判断任务点
    var course = document.getElementById('coursetree');
    var now = course.getElementsByClassName('currents');
    if (now.length <= 0) {
        alert('很奇怪啊');
        return false;
    }
    now = now[0];
    var next = now.parentNode.parentNode;
    if (next.nextElementSibling == undefined) {
        if (next.parentNode.nextElementSibling == undefined) {
            alert('挂机完成了');
            return true;
        } else {
            next = next.parentNode;
        }
    }
    //两个父节点后,下一个兄弟节点的第一个节点,点击,启动!
    console.log(next);
    var nextBtn = next.nextElementSibling.getElementsByTagName('a')[0];
    if (nextBtn.href.indexOf('getTeacherAjax') <= 0) {
        console.log('switch task lock');
        setTimeout(function () {
            switchTask();
        }, 2000);
    } else {
        now.className = '';
        nextBtn.click();
        nextBtn.firstElementChild.className = 'currents';
        console.log('next task');
    }
    return true;
}

function dealRegx(str, topic) {
    topic = topic.replace('(', '\\(');
    topic = topic.replace(')', '\\)');
    str = str.replace('{topic}', '[\\s\\S]{0,6}?' + topic + '[\\s\\S]*?');
    str = str.replace('{answer}', '(\\S+)');
    return str;
}

/** 
 * 去除html标签
 */
function removeHTML(html) {
    //TODO:重复的函数
    //先处理img标签
    var imgReplace = /<img .*?src="(.*?)".*?>/g;
    html = html.replace(imgReplace, '$1');
    var revHtml = /<.*?>/g;
    html = html.replace(revHtml, '');
    html = html.replace(/(^\s+)|(\s+$)/g, '');
    html = dealSymbol(html);
    return html.replace(/&nbsp;/g, ' ');
}

/**
 * 处理符号
 * @param {*} topic 
 */
function dealSymbol(topic) {
    topic = topic.replace('，', ',');
    topic = topic.replace('（', '(');
    topic = topic.replace('）', ')');
    topic = topic.replace('？', '?');
    topic = topic.replace('：', ':');
    topic = topic.replace(/[“”]/g, '"');
    return topic;
}

/**
 * 获取本地题库中的信息
 * @param {*} topic 
 */
function getLocalTopic(topic, count) {
    count = count == undefined ? 1 : count;
    try {
        if (localStorage['topic_regx'] == undefined || localStorage['topic_regx'] == '') {
            return;
        }
        var reg = new RegExp(dealRegx(localStorage['topic_regx'], topic));
        console.log(reg);
        var str = localStorage['topics'];
        var arr = reg.exec(str);
        if (arr != null) {
            return {
                content: arr[0],
                answer: arr.length >= 2 ? arr[1] : ''
            };
        } else if (count <= 2) {
            return getLocalTopic(topic.substring(count, topic.length - 2), ++count);
        }
    } catch (e) {

    }
    return;
}

function pop_prompt(text, sec = 4) {
    var box = document.createElement('div');
    box.style.position = "absolute";
    box.style.background = "#aeffab";
    box.style.fontSize = "18px";
    box.style.padding = "4px 20px";
    box.style.borderRadius = "20px";
    box.style.top = "50%";
    box.style.left = "50%";
    box.style.transform = "translate(-50%,-50%)";
    box.style.transition = "1s";
    box.style.opacity = "0";
    box.innerText = text;
    setTimeout(function () {
        box.style.opacity = "0";
        setTimeout(function () {
            box.remove();
        }, 1000)
    }, sec * 1000);
    return box;
}

/***/ }),

/***/ "./src/cxmooc-tools/mooc.js":
/*!**********************************!*\
  !*** ./src/cxmooc-tools/mooc.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/cxmooc-tools/common.js");

const md5 = __webpack_require__(/*! md5 */ "./node_modules/_md5@2.2.1@md5/md5.js");
const moocServer = __webpack_require__(/*! ../config */ "./src/config.js");
//监听框架加载
document.addEventListener('load', function (ev) {
    var ev = ev || event;
    var _this = ev.srcElement || ev.target;
    if (_this.id == 'iframe') {
        Object(_common__WEBPACK_IMPORTED_MODULE_0__["showExpand"])(_this);
    }
}, true);
//监测框架
var frame = document.getElementById('iframe');
if (frame != null) {
    Object(_common__WEBPACK_IMPORTED_MODULE_0__["showExpand"])(frame);
}
//监测作业板块
if (window.location.href.indexOf('work/doHomeWorkNew') > 0) {
    var form = document.getElementById('form1');
    if (form != null) {
        //显示答题按钮
        const topic = __webpack_require__(/*! ./topic */ "./src/cxmooc-tools/topic.js");
        topic(document, form.previousElementSibling, 0, false);
    }
}

if (window.location.href.indexOf('work/selectWorkQuestionYiPiYue') > 0) {
    var form = document.getElementById('ZyBottom');
    if (form != null) {
        //显示答题按钮
        const topic = __webpack_require__(/*! ./topic */ "./src/cxmooc-tools/topic.js");
        topic(document, form.previousElementSibling, 0, true);
    }
}

//考试
if (window.location.href.indexOf('exam/test/reVersionTestStartNew') > 0) {
    //读取题目和答案
    var config = JSON.parse(localStorage['config']);
    var topic = document.getElementById('position${velocityCount}').getElementsByClassName('clearfix')[0];
    var prompt = document.createElement('div');
    prompt.style.color = "#e53935";
    prompt.className = "prompt";
    document.getElementsByTagName('form')[0].appendChild(prompt);
    var netReq;
    if (config['blurry_answer']) {
        topic = dealTopic(topic);
        netReq = common.post(moocServer.url + 'v2/answer', 'topic[0]='+topic, false);
    } else {
        topic = md5(dealTopic(topic));
        netReq = Object(_common__WEBPACK_IMPORTED_MODULE_0__["get"])(moocServer.url + 'answer?topic[0]=' + md5(topic));
    }
    netReq.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status != 200) {
                prompt.innerText = '网络错误';
            } else {
                var json = JSON.parse(this.responseText);
                if (json[0].result.length <= 0) {
                    prompt.innerText = '没有搜索到答案,尝试从题库中查询';
                    //从本地题库读取内容
                    var localTopic = Object(_common__WEBPACK_IMPORTED_MODULE_0__["getLocalTopic"])(topic);
                    if (localTopic != undefined) {
                        //检索到题目了
                        var tmpResult = {
                            correct: []
                        };
                        //类型判断
                        if (/^[\w]+$/.test(localTopic.answer)) {
                            tmpResult.type = 2;
                        } else if (/^[√|×]$/) {
                            tmpResult.type = 3;
                        } else {}
                        if (tmpResult.type == 3) {
                            //判断题
                            tmpResult.correct.push({
                                content: (localTopic.answer == '√' ? true : false)
                            });
                        } else if (tmpResult.type <= 2) {
                            //单/多选
                            var reg = /[\w]/g;
                            var match = localTopic.answer.match(reg);
                            if (match != undefined) {
                                for (var i = 0; i < match.length; i++) {
                                    tmpResult.correct.push({
                                        option: match[i]
                                    });
                                }
                            }
                        } else if (tmpResult.type == 4) {
                            //填空题,暂时空一下

                        }
                        if (tmpResult.correct.length > 0) {
                            json[0].result.push(tmpResult);
                            prompt.innerHTML = "成功的从本地题库搜索到答案:<br />" + localTopic.content + "<br/>答案:" + localTopic.answer + "<br/>";
                        } else {
                            prompt.innerHTML += "<br />题库中无该题答案";
                        }
                    } else {
                        prompt.innerHTML += "<br />题库中无该题答案";
                    }
                } else {
                    prompt.innerHTML += "搜索成功,答案:";
                }

                switch (json["0"].result["0"].type) {
                    case 1:
                    case 2:
                        {
                            var options = document.getElementsByClassName('Cy_ulTop')[0].getElementsByTagName('li');
                            var answer = json["0"].result["0"].correct;
                            //选择题
                            for (let i = 0; i < answer.length; i++) {
                                console.log(options[answer[i].option.charCodeAt() - 65]);
                                if (options[answer[i].option.charCodeAt() - 65].className != 'Hover') {
                                    options[answer[i].option.charCodeAt() - 65].click();
                                }
                                prompt.innerHTML += answer[i].option + '、' + answer[i].content + "  "
                            }
                            break;
                        }
                    case 3:
                        {
                            var options = document.getElementsByClassName('Cy_ulBottom')[0].getElementsByTagName('li');
                            //判断题
                            if (json["0"].result["0"].correct["0"].content == true) {
                                options[0].click();
                            } else {
                                options[0].click();
                            }
                            break;
                        }
                    case 4:
                        {
                            //填空题
                        }
                }

            }
        }
    }
}

function dealTopic(topic) {
    topic = Object(_common__WEBPACK_IMPORTED_MODULE_0__["removeHTML"])(topic.innerHTML);
    var revHtml = /<[\s\S]*?>/g;
    //处理分
    topic = topic.replace(/\（[\S]+?分）/, '')
    topic = topic.replace(revHtml, '').trim();
    return topic
}

/***/ }),

/***/ "./src/cxmooc-tools/topic.js":
/*!***********************************!*\
  !*** ./src/cxmooc-tools/topic.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const common = __webpack_require__(/*! ./common */ "./src/cxmooc-tools/common.js");
const md5 = __webpack_require__(/*! md5 */ "./node_modules/_md5@2.2.1@md5/md5.js");
const moocServer = __webpack_require__(/*! ../config */ "./src/config.js");
/**
 * 题目处理模块
 */
module.exports = function (_this, elLogo, index, over) {
    var doc, topicDoc;
    if (_this.id == 'iframe') {
        doc = _this.contentDocument.getElementsByTagName('iframe')[index].contentDocument;
        topicDoc = doc.getElementById('frame_content').contentDocument;
    } else {
        doc = _this;
        topicDoc = _this;
    }
    var config = JSON.parse(localStorage['config']);
    if (over || (config['auto'] && config['answer_ignore'])) {
        //完成的提交答案
        var auto = common.createBtn('下一个');
        auto.id = 'action-btn';
        elLogo.appendChild(auto);
        auto.onclick = function () {
            //进入下一个
            if (!config['auto']) {
                nextTask();
            }
            setTimeout(function () {
                nextTask();
            }, 5000);
        }
        dealDocumentTopic(topicDoc);
    } else {
        //未完成的填入答案
        var auto = common.createBtn('搜索答案');
        auto.id = 'action-btn';
        elLogo.appendChild(auto);
        auto.onclick = function () {
            var topicList = topicDoc.getElementsByClassName('Zy_TItle');
            //分多段请求,每段10个请求
            for (let n = 0; n < topicList.length; n += 10) {
                let topic = [];
                for (let i = n; i < topicList.length && i - n < 10; i++) {
                    var msg = getTopicMsg(topicList[i]);
                    var md5Data;
                    if (config['blurry_answer']) {
                        var blurdeal = msg.topic;
                        blurdeal = blurdeal.replace(/[\s。（）\(\)\.]+$/, '');
                        md5Data = { topic: encodeURI(blurdeal), type: msg.type.toString() };
                    } else {
                        md5Data = md5(msg.topic + msg.type.toString());
                    }
                    topicList[i].id = 'answer_' + i.toString();
                    topic.push(md5Data);
                }
                var data = '';
                for (let i in topic) {
                    if (config['blurry_answer']) {
                        data += 'topic[' + i + ']=' + topic[i].topic + '&type[' + i + ']=' + topic[i].type + '&';
                    } else {
                        data += 'topic[' + i + ']=' + topic[i] + '&';
                    }
                }
                let show = false;
                var netReq;
                if (config['blurry_answer']) {
                    netReq = common.post(moocServer.url + 'v2/answer', data, false);
                } else {
                    netReq = common.get(moocServer.url + 'answer?' + data);
                }
                netReq.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status != 200) {
                            if (!show) {
                                show = true;
                                alert('未知错误');
                            }
                        } else {
                            var json = JSON.parse(this.responseText);
                            var answer_null = false;
                            //填入答案
                            for (let i in json) {
                                if (fillIn('answer_' + (n + json[i].index), json[i].result == undefined ? [] : json[i].result) == 'null answer') {
                                    answer_null = true;
                                }
                            }
                            //如果是自动挂机,填入之后自动提交
                            if (!config['auto']) {
                                return;
                            }
                            if (answer_null) {
                                alert('有题目没有找到答案,并且未设置随机答案,请手动填入');
                                return;
                            }
                            setTimeout(function () {
                                //提交操作
                                var submit = topicDoc.getElementsByClassName('Btn_blue_1');
                                submit = submit[0];
                                submit.click();
                                //判断有没有未填的题目
                                setTimeout(function () {
                                    if (topicDoc.getElementById('tipContent').innerText.indexOf('未做完') > 0) {
                                        if (!show) {
                                            show = true;
                                            alert('提示:' + topicDoc.getElementById('tipContent').innerText);
                                        }
                                        return;
                                    }
                                    var tmp = document.getElementById('validate');
                                    if (tmp.style.display != 'none') {
                                        if (!show) {
                                            show = true;
                                            alert('需要输入验证码');
                                        }
                                        return;
                                    }
                                    //确定提交
                                    var submit = topicDoc.getElementsByClassName('bluebtn');
                                    submit[0].click();
                                    setTimeout(function () {
                                        // _this.contentDocument.getElementsByTagName('iframe')[index].contentWindow.location.reload();
                                        nextTask();
                                    }, 3000);
                                }, 3000);
                            }, config['interval'] * 1000 * 60);
                            console.log('timeout:' + config['interval'] * 1000 * 60);
                        }
                    }
                }
            }
        }
    }

    function nextTask() {
        //判断有没有下一个,自动进行下一个任务
        var ans = _this.contentDocument.getElementsByClassName('ans-job-icon');
        if (ans.length > index + 1) {
            //点击
            var nextAction = ans[index + 1].firstElementChild;
            nextAction.click();
        } else {
            //已经是最后一个,切换任务
            common.switchTask();
        }
    }

    /**
     * 用document方式提取题目
     */
    function dealDocumentTopic(doc) {
        var topic = doc.getElementsByClassName('TiMu');
        var retJson = new Array();
        for (var i = 0; i < topic.length; i++) {
            //题目标题块对象
            var titleDiv = topic[i].getElementsByClassName('Zy_TItle clearfix');
            if (titleDiv.length <= 0) {
                continue;
            }
            titleDiv = titleDiv[0];
            //题目标题对象
            var title = titleDiv.getElementsByClassName('clearfix');
            if (title.length <= 0) {
                continue;
            }
            title = title[0];
            //题目类型对象
            var type = title.getElementsByTagName('div');
            if (type.length <= 0) {
                continue;
            }
            type = type[0];
            //获取题目类型
            type = switchTopicType(common.substrEx(type.innerHTML, '【', '】'));
            if (type == -1) {
                continue;
            }
            //获取题目
            var tmpTitle = removeHTML(title.innerHTML.substring(title.innerHTML.indexOf('】') + 1));
            // title = title.getElementsByTagName('p');
            if (tmpTitle.length <= 0) {
                //题目获取失败,搜索里面有没有img,有那么title就为img的路径
                var img = title.getElementsByTagName('img');
                if (img == null) {
                    continue;
                }
                tmpTitle = img.getAttribute('src');
            }
            title = tmpTitle;
            //对答案进行处理
            var ret = dealDocumentAnswer(topic[i], type);
            if (ret != undefined) {
                ret.type = type;
                ret.topic = title;
                retJson.push(ret);
            }
            // msg.answers = answers;
            // msg.correct = correct;
            // console.log(type, title);
        }
        var box = common.pop_prompt("√  答案自动记录成功");
        document.body.appendChild(box);
        setTimeout(function () { box.style.opacity = "1"; }, 500);
        common.post(moocServer.url + 'answer', JSON.stringify(retJson));
    }

    function dealDocumentAnswer(topic, type) {
        var ret = {
            answers: [],
            correct: []
        };
        //然后看看有没有正确答案
        var answer = topic.getElementsByClassName('Py_tk');
        var answerSpan = undefined;
        if (answer.length <= 0) {
            //没有正确答案,搜索自己的答案,并判断是不是对的,否则返回空
            answer = topic.getElementsByClassName('Py_answer clearfix');
            if (answer.length <= 0) {
                return undefined;
            }
            if (answer[0].innerHTML.indexOf("正确答案") < 0) {
                if (answer[0].getElementsByClassName("dui").length <= 0) {
                    return undefined;
                }
            }
            answerSpan = answer[0].getElementsByTagName('span');
            if (answerSpan.length > 0) {
                answerSpan = answerSpan[0];
            }
        }
        answer = answer[0];
        //提取选项和答案到数据库结构
        // msg.answers = answers;
        // msg.correct = correct;
        if (type <= 2) {
            var options = topic.getElementsByClassName('Zy_ulTop');
            if (options.length >= 0) {
                options = options[0].getElementsByClassName('clearfix');
                for (var i = 0; i < options.length; i++) {
                    var option = options[i].getElementsByTagName('i');
                    if (option.length <= 0) {
                        continue;
                    }
                    var content = options[i].getElementsByTagName('a');
                    if (content.length <= 0) {
                        continue;
                    }
                    option = option[0];
                    content = content[0];
                    option = option.innerHTML.substring(0, 1);
                    var tmpJson = {
                        option: option,
                        content: removeHTML(content.innerHTML)
                    };
                    ret.answers.push(tmpJson);
                    //判断是否在其中
                    //选择题的正确答案和自己的答案都在一起,先判断有没有正确答案
                    if (answerSpan.innerHTML.indexOf(option) >= 0) {
                        ret.correct.push(tmpJson);
                    }
                }
            }
        } else if (type == 3) {
            var t = true;
            if (answerSpan.innerHTML.indexOf('×') >= 0) {
                t = false;
            }
            ret.correct.push({
                option: t,
                content: t
            });
        } else if (type == 4) {
            var options = answer.getElementsByTagName('div');
            if (options.length <= 0) {
                return undefined;
            }
            options = options[0].getElementsByClassName('font14');
            for (var i = 0; i < options.length; i++) {
                var option = options[i].getElementsByTagName('i');
                if (option.length <= 0) {
                    continue;
                }
                var content = options[i].getElementsByClassName('clearfix');
                if (content.length <= 0) {
                    continue;
                }
                option = option[0];
                content = content[0];
                option = common.substrEx(option.innerHTML, "第", "空");
                var tmpJson = {
                    option: option,
                    content: removeHTML(content.innerHTML)
                };
                // ret.answers.push(tmpJson);
                if (options[i].getElementsByClassName('dui').length > 0 || answerSpan == undefined) {
                    ret.correct.push(tmpJson);
                }
            }
        }
        return ret;
    }

    function rand(min, max) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * min + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (max - min + 1) + min, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    function fillIn(id, result) {
        var topicEl = topicDoc.getElementById(id);
        var topicMsg = getTopicMsg(topicEl);
        var prompt = topicEl.nextSibling.nextSibling.getElementsByClassName('prompt');
        if (prompt.length <= 0) {
            prompt = document.createElement('div');
            prompt.style.color = "#e53935";
            prompt.className = "prompt";
            topicEl.nextSibling.nextSibling.appendChild(prompt);
        } else {
            prompt = prompt[0];
            prompt.style.color = "#e53935";
            prompt.innerHTML = '';
            prompt.style.fontWeight = 100;
        }
        if (topicMsg.topic == '') {
            prompt.innerHTML = '没有找到题目,什么鬼?';
            return;
        }
        var options = topicEl.nextSibling.nextSibling.getElementsByTagName('li');
        var rand = document.head.getAttribute('rand-answer');
        if (result.length <= 0) {
            //没有在线上检索到答案,先在检索本地题库
            //从本地题库读取内容
            var localTopic = getLocalTopic(topicMsg.topic);
            if (localTopic != undefined) {
                //检索到题目了
                var tmpResult = {
                    correct: []
                };
                tmpResult.type = topicMsg.type;
                if (tmpResult.type == 3) {
                    //判断题
                    tmpResult.correct.push({
                        content: (localTopic.answer == '√' ? true : false)
                    });
                } else if (tmpResult.type <= 2) {
                    //单/多选
                    var reg = /[\w]/g;
                    var match = localTopic.answer.match(reg);
                    for (var i = 0; i < match.length; i++) {
                        tmpResult.correct.push({
                            option: match[i]
                        });
                    }
                } else if (tmpResult.type == 4) {
                    //填空题,暂时空一下

                }
                if (tmpResult.correct.length > 0) {
                    result.push(tmpResult);
                    console.log(tmpResult);
                    prompt.innerHTML = "成功的从本地题库搜索到答案:<br />" + localTopic.content + "<br/>答案:" + localTopic.answer + "<br/>";
                }
            }
        }
        if (result.length <= 0) {
            //无答案,检索配置有没有设置随机答案....
            if (rand != 'true') {
                prompt.innerHTML = "没有从题库中获取到相应记录";
                return 'null answer';
            }
            prompt.style.fontWeight = 600;
            prompt.innerHTML = "请注意这是随机生成的答案!<br/>";
            rand = true;
            var tmpResult = {
                correct: []
            };
            tmpResult.type = topicMsg.type;
            var d = Math.floor(Math.random() * 10 + 1);
            //随机生成答案,有些混乱了....
            for (let n = 0; n < options.length; n++) {
                var optionsContent;
                if (tmpResult.type == 3) {
                    //判断题
                    if (d % 2 == 1) {
                        tmpResult.correct.push({
                            content: true
                        });
                    } else {
                        tmpResult.correct.push({
                            content: false
                        });
                    }
                    break;
                } else if (tmpResult.type <= 2) {
                    //单选题
                    var oc = options[n].querySelector('.after');
                    if (oc == null) {
                        continue;
                    }
                    optionsContent = removeHTML(oc.innerHTML);
                    if (tmpResult.type == 2) {
                        options[n].querySelector('input[type=checkbox]').checked = false;
                        //多选
                        d = Math.floor(Math.random() * (options.length - 1) + 2);
                        console.log("num:" + d);
                        var select = [];
                        for (var i = 0; i < options.length; i++) {
                            select.push(i);
                        }
                        for (; d > 0; d--) {
                            var index = Math.floor(Math.random() * select.length);
                            var n_oc = options[select[index]].querySelector('.after');
                            if (n_oc == null) {
                                continue;
                            }
                            optionsContent = removeHTML(n_oc.innerHTML);
                            tmpResult.correct.push({
                                content: optionsContent
                            });
                            select.splice(index, 1);
                        }
                        break;
                    } else {
                        if (n == d % options.length) {
                            tmpResult.correct.push({
                                content: optionsContent
                            });
                        }
                    }
                } else {
                    //填空题啥的就不弄了
                    prompt.innerHTML = '不支持随机的题目类型';
                    return;
                }
            }
            result.push(tmpResult);
        }
        result = result[0];
        prompt.innerHTML += '答案:';
        for (let i = 0; i < result.correct.length; i++) {
            for (let n = 0; n < options.length; n++) {
                var optionsContent;
                if (result.type == 3) {
                    if (result.correct[i].content) {
                        prompt.innerHTML += '对 √';
                        options[0].getElementsByTagName('input')[0].click();
                    } else {
                        prompt.innerHTML += '错 ×';
                        options[1].getElementsByTagName('input')[0].click();
                    }
                    break;
                } else if (result.type <= 2) {
                    var oc = options[n].querySelector('.after');
                    if (oc == null) {
                        continue;
                    }
                    optionsContent = removeHTML(oc.innerHTML);
                    var option = options[n].querySelector("input").value;
                    //如果内容是空的,就看选项的
                    if (result.correct[i].content == optionsContent) {
                        prompt.innerHTML += optionsContent + "   ";
                        options[n].querySelector('.after').click();
                        var option = options[n].querySelector("input").value;
                    } else if (result.correct[i].option == option) {
                        prompt.innerHTML += optionsContent + "   ";
                        options[n].querySelector('.after').click();
                        var option = options[n].querySelector("input").value;
                    }
                } else if (result.type == 4) {
                    optionsContent = common.substrEx(options[n].innerHTML, "第", "空");
                    if (optionsContent == result.correct[i].option) {
                        prompt.innerHTML += "第" + optionsContent + "空:" + result.correct[i].content + "   ";
                        options[n].getElementsByTagName('input')[0].value = result.correct[i].content;
                    }
                }
            }
        }
    }

    /**
     * 获取本地题库中的信息
     * @param {*} topic 
     */
    function getLocalTopic(topic) {
        try {
            if (localStorage['topic_regx'] == undefined || localStorage['topic_regx'] == '') {
                return;
            }
            var reg = new RegExp(common.dealRegx(localStorage['topic_regx'], topic));
            console.log(reg);
            var str = localStorage['topics'];
            var arr = reg.exec(str);
            if (arr != null && arr.length >= 2) {
                return {
                    content: arr[0],
                    answer: arr[1]
                };
            }
        } catch (e) {

        }
        return;
    }

    /**
     * 获取题目信息
     * @param {*} elTopic 
     */
    function getTopicMsg(elTopic) {
        var msg = {};
        msg.topic = elTopic.querySelector('div.clearfix').innerHTML;
        msg.type = switchTopicType(common.substrEx(msg.topic, '【', '】'));
        msg.topic = removeHTML(msg.topic.substring(msg.topic.indexOf('】') + 1));
        return msg;
    }

    /**
     * 处理符号
     * @param {*} topic 
     */
    function dealSymbol(topic) {
        topic = topic.replace('，', ',');
        topic = topic.replace('（', '(');
        topic = topic.replace('）', ')');
        topic = topic.replace('？', '?');
        topic = topic.replace('：', ':');
        topic = topic.replace(/[“”]/g, '"');
        return topic;
    }
    /** 
     * 处理html源码获取题目信息
     */
    function dealHTMLTopic(data) {
        var regx = /【(.*?)】([\s\S]*?)<\/div>([\S\s]*?)<div class="Py_answer clearfix">[\s\S]*?[正确答案：|我的答案：]([\s\S]*?)<i class="fr (.*?)"><\/i>/g;
        var result;
        var retJson = new Array();
        while (result = regx.exec(data)) {
            //判断是不是有正确答案的显示,如果有正确答案,就处理正确答案
            //太难处理了,已切换成document的形式
            if (result.input.indexOf('<span>正确答案：') < 0) {
                if (result[5] != 'dui') {
                    continue;
                }
            }
            var tmpJson = dealTopicMsg(result);
            retJson.push(tmpJson);
            // var tmpJson = {};
            // if (result.input.indexOf('>正确答案：') > 0) {
            //     result[4] = result[3];
            // } else {
            //     if (result[5] != 'dui') {
            //         continue;
            //     }
            //     result[4] += '</div>';
            // }
            // tmpJson = dealTopicMsg(result);
            // retJson.push(tmpJson);
        }
        console.log(retJson);
        //提交数据
        common.post(moocServer.url + 'answer', JSON.stringify(retJson));
    }
    /** 
     * 去除html标签
     */
    function removeHTML(html) {
        //先处理img标签
        var imgReplace = /<img .*?src="(.*?)".*?>/g;
        html = html.replace(imgReplace, '$1');
        var revHtml = /<.*?>/g;
        html = html.replace(revHtml, '');
        html = html.replace(/(^\s+)|(\s+$)/g, '');
        html = dealSymbol(html);
        return html.replace(/&nbsp;/g, ' ');
    }
    /**
     * 处理题目信息
     * @param {*} regxData 
     */
    function dealTopicMsg(regxData) {
        var msg = {};
        //去除html标签
        var revHtml = /<.*?>/g;
        msg.topic = removeHTML(regxData[2]);
        msg.type = switchTopicType(regxData[1]);
        if (msg.type == -1) {
            return null;
        }
        //处理答案块
        var result;
        var answers = [];
        var correct = [];
        if (msg.type <= 3) {
            //处理答案
            var answerRegx = /<i class="fl">(.*?)<\/i>[\s\S]*?style="word-break: break-all;text-decoration: none;">(.*?)<\/a>/g;
            regxData[4] = removeHTML(regxData[4].substring(0, regxData[4].indexOf('</span>')));
            if (msg.type == 3) {
                var pos = regxData[4].indexOf('：');
                if (pos >= 0) {
                    regxData[4] = regxData[4].substring(pos + 1, pos + 2);
                }
                regxData[4] = (regxData[4] == '×' ? false : true)
                correct = [{
                    option: regxData[4],
                    content: regxData[4]
                }]
            } else {
                while (result = answerRegx.exec(regxData[3])) {
                    var option = result[1].substring(0, 1);
                    var answer = {
                        option: option,
                        content: removeHTML(result[2])
                    };
                    if (regxData[4].indexOf(option) >= 0) {
                        correct.push(answer);
                    }
                    answers.push(answer);
                }
            }
        } else if (msg.type == 4) {
            var answerRegx = /第(.*?)空[\s\S]*?<div class="clearfix">([\s\S]*?)</g;
            regxData[4] += '<';
            while (result = answerRegx.exec(regxData[4] + '<')) {
                correct.push({
                    option: result[1],
                    content: removeHTML(result[2])
                });
            }
        }
        //外观文件的扩展名为(   )。
        //外观文件的扩展名为(   )。
        msg.answers = answers;
        msg.correct = correct;
        return msg;
    }

    /**
     * 题目类型
     * @param {*} typeTtile 
     */
    function switchTopicType(typeTtile) {
        var type = typeTtile;
        switch (type) {
            case '单选题':
                {
                    type = 1;
                    break;
                }
            case '多选题':
                {
                    type = 2;
                    break;
                }
            case '判断题':
                {
                    type = 3;
                    break;
                }
            case '填空题':
                {
                    type = 4;
                    break;
                }
            default:
                {
                    type = -1;
                    break;
                }
        }
        return type;
    }
    return this;
}

/***/ }),

/***/ "./src/cxmooc-tools/video.js":
/*!***********************************!*\
  !*** ./src/cxmooc-tools/video.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const common = __webpack_require__(/*! ./common */ "./src/cxmooc-tools/common.js");
const md5 = __webpack_require__(/*! md5 */ "./node_modules/_md5@2.2.1@md5/md5.js");
const createBtn = common.createBtn;
const get = common.get;

/**
 * 视频操作模块
 * @param {*} _this 
 * @param {*} elLogo 
 * @param {*} index 
 */
module.exports = function (_this, elLogo, index) {
    //获取要操作的对象和视频id
    var wid = _this.contentDocument.getElementsByTagName('iframe')[index].contentWindow;
    var doc = _this.contentDocument.getElementsByTagName('iframe')[index].contentDocument;
    var objId = _this.contentDocument.getElementsByTagName('iframe')[index].getAttribute('objectid');
    var iframe = _this.contentDocument.getElementsByTagName('iframe')[index];
    //视频的信息和题目
    var videoTopic = {};
    var videoInfo = {};
    //在框架内注入js
    common.injected(doc, 'action.js');
    //更换swf播放器
    var timer = setInterval(function () {
        var obj = doc.getElementsByTagName('object');
        if (obj.length > 0) {
            //开始重新加载
            clearInterval(timer);
            wid.removeOldPlayer(obj[0]);
        }
    }, 200);
    //创建各个按钮
    var hang_btn = createBtn('开始挂机');
    hang_btn.id = 'action-btn';
    hang_btn.value = index;
    hang_btn.title = "直接开始";
    elLogo.appendChild(hang_btn);
    hang_btn.onclick = function () {
        var config = JSON.parse(localStorage['config']);
        if (config['auto']) {
            //全自动挂机开始
            //判断完成的任务点
            var ans = _this.contentDocument.getElementsByClassName('ans-job-icon');
            if (ans[index].parentNode.className.indexOf('ans-job-finished') >= 0) {
                if (ans.length > index + 1) {
                    var nextAction = ans[index + 1].firstElementChild;
                    nextAction.click();
                } else {
                    common.switchTask();
                }
                return;
            }
            hang_btn.innerText = '挂机中...';
            var timer = setInterval(function () {
                if (wid.monitorPlay != undefined) {
                    clearInterval(timer);
                    wid.monitorPlay(function () {
                        //播放完成
                        console.log('over');
                        setTimeout(function () {
                            //判断有没有下一个,自动进行下一个任务
                            if (ans.length > index + 1) {
                                //点击
                                var nextAction = ans[index + 1].firstElementChild;
                                nextAction.click();
                            } else {
                                //已经是最后一个,切换任务
                                common.switchTask();
                            }
                        }, config['interval'] * 1000 * 60);
                    }, config);
                }
            }, 1000);

        } else {
            //TODO:wid.monitorPlay 重复多余的 以后可以去掉
            if (wid.monitorPlay != undefined) {
                wid.monitorPlay(undefined, config);
            } else {
                monitorPlay(undefined, config);
            }
        }
    }

    // var hang_mode_2 = createBtn('挂机模式2(bate)');
    // hang_mode_2.style.background = '#F57C00';
    // hang_mode_2.title = "还在测试中,不知道有什么样的风险,欢迎反馈,如果能成,将在全自动挂机迈出一大步^_^";
    // elLogo.appendChild(hang_mode_2);

    var boom = createBtn('秒过视频');
    boom.style.background = '#F57C00';
    boom.title = "秒过视频会被后台检测到";
    boom.value = index;
    elLogo.appendChild(boom);

    //获取参数
    var _index = 0;
    var mArg = _this.contentDocument.body.innerHTML;
    mArg = '{' + common.substrEx(mArg, 'mArg = {', ';');
    mArg = JSON.parse(mArg);
    for (let i = 0; i < mArg.attachments.length; i++) {
        if (mArg.attachments[i].objectId == objId) {
            _index = i;
            break;
        }
    }
    /**
     * 获取题目列表
     * @param {*} callback 
     */
    var getVideoTopic = function (callback) {
        if (videoTopic.length > 0) {
            callback(videoTopic);
            return;
        }
        // mArg.attachments[_index].mid = '13699717041081426508636528';
        get('/richvideo/initdatawithviewer?&start=undefined&mid=' +
            mArg.attachments[_index].mid).onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var json = JSON.parse(this.responseText);
                        videoTopic = json;
                        callback(json);
                    }
                }
            }
    }
    /**
     * 获取视频信息
     * @param {*} callback 
     */
    var getVideoInfo = function (callback) {
        if (videoInfo.length > 0) {
            callback(videoInfo);
            return;
        }
        get('/ananas/status/' + mArg.attachments[_index].objectId +
            '?k=318&_dc=' + Date.parse(new Date())).onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var json = JSON.parse(this.responseText);
                        videoInfo = json;
                        callback(json);
                    }
                }
            }
    }
    var createDiv = function (title) {
        var divEl = document.createElement('div');
        divEl.style.color = "#ff0101";
        divEl.style.textAlign = 'left';
        divEl.innerHTML = title;
        return divEl;
    }
    //获取正确答案
    var getTrueAnswer = function (list) {
        var right = '';
        for (let i = 0; i < list.length; i++) {
            if (list[i].isRight) {
                right += '<span style="margin-left:6px;">' + list[i].name + ":" + list[i].description + '</span>';
            }
        }
        if (right != '') {
            return right;
        }
        return '没有找到答案(没有,出bug了???)';
    }
    //展示题目答案
    getVideoTopic(function (data) {
        iframe.parentNode.appendChild(createDiv('本视频题目列表:'));
        for (let i = 0; i < data.length; i++) {
            var answer = getTrueAnswer(data[i].datas[0].options);
            var title = "题目" + (i + 1) + ":" + data[i].datas[0].description + "<br/>答案:   " + answer;
            var divEl = createDiv(title);
            iframe.parentNode.appendChild(divEl);
        }
    });

    var send_answer_pack = function (resourceid, answer, callback) {
        get('/richvideo/qv?resourceid=' + resourceid + "&answer='" + answer + "'").onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var json = JSON.parse(this.responseText);
                    if (callback != undefined) {
                        callback(json);
                    }
                }
            }
        }
    }

    /**
     * 挂机类
     */
    var hang = function (res) {
        var _instance = this;
        if (res.prompt != undefined) {
            _instance.prompt = res.prompt;
        }
        var timer = 0;
        var time = 0;
        this.start = function (start_time = 0) {
            start_time = parseInt(start_time == null ? 0 : start_time);
            var begin = false;
            timer = setInterval(function () {
                var tmpTime = (time + start_time);
                //判断题目,然后减个5-6秒
                for (let i = 0; i < videoTopic.length; i++) {
                    if (videoTopic[i].datas[0].startTime == (tmpTime) && videoTopic[i].datas[0].isAnswer == undefined) {
                        videoTopic[i].datas[0].isAnswer = true;
                        time -= (5 + Math.floor((Math.random() * 5) + 1));
                        //时间到了,回答题目
                        console.log('qqq');
                        var answer = getTrueAnswer(videoTopic[i].datas[0].options);
                        send_answer_pack(videoTopic[i].datas[0].resourceId, answer.name);
                    }
                }
                //判断开始和结束
                if (time <= 0 || (tmpTime) >= videoInfo.duration) {
                    if (time > 0 || !begin) {
                        begin = true;
                        getVideoInfo(function (info) {
                            console.log(tmpTime);
                            send_time_pack(tmpTime, function (ret) {
                                if (ret == true) {
                                    _instance.stop();
                                    if (_instance.prompt != undefined) {
                                        _instance.prompt(1);
                                    }
                                }
                            });
                        });
                        if ((tmpTime) >= videoInfo.duration) {
                            _instance.stop();
                            if (_instance.prompt != undefined) {
                                _instance.prompt(2);
                            }
                        }
                    }
                }
                console.log(time);
                time += 1;
            }, 1000);
        }

        this.stop = function () {
            clearTimeout(timer);
        }
        return this;
    };
    //挂机模式2按钮事件
    var instance_hang = new hang({
        prompt: function (code) {
            switch (code) {
                case 1:
                    alert('已经通过的视频');
                    break;
                case 2:
                    alert('视频挂机完成');
                    break;
                default:
                    alert('不明错误');
                    break
            }
        }
    });

    // hang_mode_2.onclick = function () {
    //     if (hang_mode_2.getAttribute('start') == 'true') {
    //         //开始则为暂停
    //         hang_mode_2.innerText = "挂机模式2(bate)";
    //         hang_mode_2.setAttribute('start', 'false');
    //         instance_hang.stop();
    //     } else {
    //         hang_mode_2.innerText = "停止挂机(bate)";
    //         hang_mode_2.setAttribute('start', 'true');
    //         instance_hang.start(hang_mode_2.getAttribute('time'));
    //     }
    //     console.log("这是一个在测试阶段的产物");
    // }

    /**
     * 发送一个时间包
     * @param {*} time 
     */
    var send_time_pack = function (playTime, callback) {
        getVideoInfo(function (json) {
            var enc = '[' + mArg.defaults.clazzId + '][' + mArg.defaults.userid + '][' +
                mArg.attachments[_index].property._jobid + '][' + mArg.attachments[_index].objectId + '][' +
                (playTime * 1000).toString() + '][d_yHJ!$pdA~5][' + (json.duration * 1000).toString() + '][0_' +
                json.duration + ']';
            enc = md5(enc);
            get('/multimedia/log/' + json.dtoken + '?clipTime=0_' + json.duration +
                '&otherInfo=' + mArg.attachments[_index].otherInfo +
                '&userid=' + mArg.defaults.userid + '&rt=0.9&jobid=' + mArg.attachments[_index].property._jobid +
                '&duration=' + json.duration + '&dtype=Video&objectId=' + mArg.attachments[_index].objectId +
                '&clazzId=' + mArg.defaults.clazzId +
                '&view=pc&playingTime=' + playTime + '&isdrag=4&enc=' + enc).onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            let isPassed = JSON.parse(this.responseText);
                            callback(isPassed.isPassed);
                            return;
                        }
                    }
                }
        });
    }

    //秒过按钮事件
    boom.onclick = function () {
        if (localStorage['boom_no_prompt'] == undefined || localStorage['boom_no_prompt'] != 1) {
            var msg = prompt('秒过视频会产生不良记录,是否继续?如果以后不想再弹出本对话框请在下方填写yes')
            if (msg === null) return;
            if (msg === 'yes') localStorage['boom_no_prompt'] = 1;
        }
        getVideoInfo(function (json) {
            var playTime = parseInt(json.duration - Math.random(1, 2));
            send_time_pack(playTime, function (ret) {
                if (ret == true) {
                    alert('秒过成功,刷新后查看效果');
                } else {
                    alert('操作失败,错误');
                }
            });
        });
    }

    function monitorPlay(playOver, config) {
        var document = wid.document;
        function unshowOcclusion() {
            var playBtn = document.querySelector('.vjs-big-play-button');
            console.log(playBtn);
            if (playBtn != null) {
                playBtn.style.display = 'none';
            }
            var tmp = document.querySelector('.vjs-poster');
            if (tmp != null) {
                tmp.style.display = 'none';
            }
        }
        var timer = setInterval(function () {
            var player = document.querySelector('#video_html5_api');
            if (player == undefined || player == null) {
                return;
            }
            clearInterval(timer);
            /**
             * 对cdn进行处理
             */
            if (localStorage['cdn'] != undefined) {
                var url = player.src;
                url = url.substr(url.indexOf('/video/'));
                console.log(url);
                player.src = localStorage['cdn'] + url;
                console.log(player.src);
            }
            //判断是否播放，顺便让那个按钮和界面不可见
            unshowOcclusion();
            play();
            player.onpause = function () {
                console.log('pause');
                if (player.currentTime <= player.duration - 1) {
                    play();
                }
            }
            player.onloadstart = function () {
                var cdn = player.currentSrc;
                cdn = cdn.substr(0, cdn.indexOf('/video/', 10));
                localStorage['cdn'] = cdn;
                console.log('cdn change ' + cdn);
            }
            player.onended = function () {
                console.log('end');
                if (playOver != undefined) {
                    playOver();
                }
            }
            function play() {
                var time = setInterval(function () {
                    if (player.paused) {
                        player.play();
                        console.log(config);
                        player.muted = config.video_mute;
                        player.playbackRate = config.video_multiple;
                    } else {
                        clearInterval(time);
                    }
                }, 1000);
            }
        }, 200);
    }
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19jaGFyZW5jQDAuMC4yQGNoYXJlbmMvY2hhcmVuYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX2NyeXB0QDAuMC4yQGNyeXB0L2NyeXB0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9faXMtYnVmZmVyQDEuMS42QGlzLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX21kNUAyLjIuMUBtZDUvbWQ1LmpzIiwid2VicGFjazovLy8uL3NyYy9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N4bW9vYy10b29scy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N4bW9vYy10b29scy9tb29jLmpzIiwid2VicGFjazovLy8uL3NyYy9jeG1vb2MtdG9vbHMvdG9waWMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2N4bW9vYy10b29scy92aWRlby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrQkFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHlCQUF5QixFQUFFO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDIiwiZmlsZSI6Im1vb2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jeG1vb2MtdG9vbHMvbW9vYy5qc1wiKTtcbiIsInZhciBjaGFyZW5jID0ge1xuICAvLyBVVEYtOCBlbmNvZGluZ1xuICB1dGY4OiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiBjaGFyZW5jLmJpbi5zdHJpbmdUb0J5dGVzKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKSk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGNoYXJlbmMuYmluLmJ5dGVzVG9TdHJpbmcoYnl0ZXMpKSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEJpbmFyeSBlbmNvZGluZ1xuICBiaW46IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgc3RyID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHN0ci5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pKTtcbiAgICAgIHJldHVybiBzdHIuam9pbignJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJlbmM7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBiYXNlNjRtYXBcbiAgICAgID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuXG4gIGNyeXB0ID0ge1xuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIGxlZnRcbiAgICByb3RsOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgYikgfCAobiA+Pj4gKDMyIC0gYikpO1xuICAgIH0sXG5cbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiByaWdodFxuICAgIHJvdHI6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCAoMzIgLSBiKSkgfCAobiA+Pj4gYik7XG4gICAgfSxcblxuICAgIC8vIFN3YXAgYmlnLWVuZGlhbiB0byBsaXR0bGUtZW5kaWFuIGFuZCB2aWNlIHZlcnNhXG4gICAgZW5kaWFuOiBmdW5jdGlvbihuKSB7XG4gICAgICAvLyBJZiBudW1iZXIgZ2l2ZW4sIHN3YXAgZW5kaWFuXG4gICAgICBpZiAobi5jb25zdHJ1Y3RvciA9PSBOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNyeXB0LnJvdGwobiwgOCkgJiAweDAwRkYwMEZGIHwgY3J5cHQucm90bChuLCAyNCkgJiAweEZGMDBGRjAwO1xuICAgICAgfVxuXG4gICAgICAvLyBFbHNlLCBhc3N1bWUgYXJyYXkgYW5kIHN3YXAgYWxsIGl0ZW1zXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG4ubGVuZ3RoOyBpKyspXG4gICAgICAgIG5baV0gPSBjcnlwdC5lbmRpYW4obltpXSk7XG4gICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYW4gYXJyYXkgb2YgYW55IGxlbmd0aCBvZiByYW5kb20gYnl0ZXNcbiAgICByYW5kb21CeXRlczogZnVuY3Rpb24obikge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXTsgbiA+IDA7IG4tLSlcbiAgICAgICAgYnl0ZXMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYmlnLWVuZGlhbiAzMi1iaXQgd29yZHNcbiAgICBieXRlc1RvV29yZHM6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciB3b3JkcyA9IFtdLCBpID0gMCwgYiA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKywgYiArPSA4KVxuICAgICAgICB3b3Jkc1tiID4+PiA1XSB8PSBieXRlc1tpXSA8PCAoMjQgLSBiICUgMzIpO1xuICAgICAgcmV0dXJuIHdvcmRzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGJpZy1lbmRpYW4gMzItYml0IHdvcmRzIHRvIGEgYnl0ZSBhcnJheVxuICAgIHdvcmRzVG9CeXRlczogZnVuY3Rpb24od29yZHMpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGIgPSAwOyBiIDwgd29yZHMubGVuZ3RoICogMzI7IGIgKz0gOClcbiAgICAgICAgYnl0ZXMucHVzaCgod29yZHNbYiA+Pj4gNV0gPj4+ICgyNCAtIGIgJSAzMikpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgaGV4IHN0cmluZ1xuICAgIGJ5dGVzVG9IZXg6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBoZXggPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSAmIDB4RikudG9TdHJpbmcoMTYpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZXguam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBoZXggc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYyA9IDA7IGMgPCBoZXgubGVuZ3RoOyBjICs9IDIpXG4gICAgICAgIGJ5dGVzLnB1c2gocGFyc2VJbnQoaGV4LnN1YnN0cihjLCAyKSwgMTYpKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgIGJ5dGVzVG9CYXNlNjQ6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBiYXNlNjQgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICB2YXIgdHJpcGxldCA9IChieXRlc1tpXSA8PCAxNikgfCAoYnl0ZXNbaSArIDFdIDw8IDgpIHwgYnl0ZXNbaSArIDJdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKylcbiAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA8PSBieXRlcy5sZW5ndGggKiA4KVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goYmFzZTY0bWFwLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRikpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKCc9Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZTY0LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYmFzZS02NCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgYmFzZTY0VG9CeXRlczogZnVuY3Rpb24oYmFzZTY0KSB7XG4gICAgICAvLyBSZW1vdmUgbm9uLWJhc2UtNjQgY2hhcmFjdGVyc1xuICAgICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL1teQS1aMC05K1xcL10vaWcsICcnKTtcblxuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgaSA9IDAsIGltb2Q0ID0gMDsgaSA8IGJhc2U2NC5sZW5ndGg7XG4gICAgICAgICAgaW1vZDQgPSArK2kgJSA0KSB7XG4gICAgICAgIGlmIChpbW9kNCA9PSAwKSBjb250aW51ZTtcbiAgICAgICAgYnl0ZXMucHVzaCgoKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgJiAoTWF0aC5wb3coMiwgLTIgKiBpbW9kNCArIDgpIC0gMSkpIDw8IChpbW9kNCAqIDIpKVxuICAgICAgICAgICAgfCAoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpKSkgPj4+ICg2IC0gaW1vZDQgKiAyKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNyeXB0O1xufSkoKTtcbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNyeXB0ID0gcmVxdWlyZSgnY3J5cHQnKSxcclxuICAgICAgdXRmOCA9IHJlcXVpcmUoJ2NoYXJlbmMnKS51dGY4LFxyXG4gICAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpLFxyXG4gICAgICBiaW4gPSByZXF1aXJlKCdjaGFyZW5jJykuYmluLFxyXG5cclxuICAvLyBUaGUgY29yZVxyXG4gIG1kNSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICAvLyBDb252ZXJ0IHRvIGJ5dGUgYXJyYXlcclxuICAgIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09IFN0cmluZylcclxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGluZyA9PT0gJ2JpbmFyeScpXHJcbiAgICAgICAgbWVzc2FnZSA9IGJpbi5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbWVzc2FnZSA9IHV0Zjguc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgIGVsc2UgaWYgKGlzQnVmZmVyKG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWVzc2FnZSwgMCk7XHJcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlKSlcclxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UudG9TdHJpbmcoKTtcclxuICAgIC8vIGVsc2UsIGFzc3VtZSBieXRlIGFycmF5IGFscmVhZHlcclxuXHJcbiAgICB2YXIgbSA9IGNyeXB0LmJ5dGVzVG9Xb3JkcyhtZXNzYWdlKSxcclxuICAgICAgICBsID0gbWVzc2FnZS5sZW5ndGggKiA4LFxyXG4gICAgICAgIGEgPSAgMTczMjU4NDE5MyxcclxuICAgICAgICBiID0gLTI3MTczMzg3OSxcclxuICAgICAgICBjID0gLTE3MzI1ODQxOTQsXHJcbiAgICAgICAgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gICAgLy8gU3dhcCBlbmRpYW5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtW2ldID0gKChtW2ldIDw8ICA4KSB8IChtW2ldID4+PiAyNCkpICYgMHgwMEZGMDBGRiB8XHJcbiAgICAgICAgICAgICAoKG1baV0gPDwgMjQpIHwgKG1baV0gPj4+ICA4KSkgJiAweEZGMDBGRjAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhZGRpbmdcclxuICAgIG1bbCA+Pj4gNV0gfD0gMHg4MCA8PCAobCAlIDMyKTtcclxuICAgIG1bKCgobCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsO1xyXG5cclxuICAgIC8vIE1ldGhvZCBzaG9ydGN1dHNcclxuICAgIHZhciBGRiA9IG1kNS5fZmYsXHJcbiAgICAgICAgR0cgPSBtZDUuX2dnLFxyXG4gICAgICAgIEhIID0gbWQ1Ll9oaCxcclxuICAgICAgICBJSSA9IG1kNS5faWk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xyXG5cclxuICAgICAgdmFyIGFhID0gYSxcclxuICAgICAgICAgIGJiID0gYixcclxuICAgICAgICAgIGNjID0gYyxcclxuICAgICAgICAgIGRkID0gZDtcclxuXHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDBdLCAgNywgLTY4MDg3NjkzNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDcsIC0xNzY0MTg4OTcpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgOF0sICA3LCAgMTc3MDAzNTQxNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTcsIC00MjA2Myk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDcsICAxODA0NjAzNjgyKTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsxM10sIDEyLCAtNDAzNDExMDEpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyAxXSwgIDUsIC0xNjU3OTY1MTApO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyA2XSwgIDksIC0xMDY5NTAxNjMyKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgMF0sIDIwLCAtMzczODk3MzAyKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgNV0sICA1LCAtNzAxNTU4NjkxKTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsxMF0sICA5LCAgMzgwMTYwODMpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA5XSwgIDUsICA1Njg0NDY0MzgpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzE0XSwgIDksIC0xMDE5ODAzNjkwKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krMTNdLCAgNSwgLTE0NDQ2ODE0NjcpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyAyXSwgIDksIC01MTQwMzc4NCk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDVdLCAgNCwgLTM3ODU1OCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyAxXSwgIDQsIC0xNTMwOTkyMDYwKTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKzEzXSwgIDQsICA2ODEyNzkxNzQpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDldLCAgNCwgLTY0MDM2NDQ4Nyk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyAwXSwgIDYsIC0xOTg2MzA4NDQpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsxMl0sICA2LCAgMTcwMDQ4NTU3MSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDhdLCAgNiwgIDE4NzMzMTMzNTkpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgNF0sICA2LCAtMTQ1NTIzMDcwKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgICBhID0gKGEgKyBhYSkgPj4+IDA7XHJcbiAgICAgIGIgPSAoYiArIGJiKSA+Pj4gMDtcclxuICAgICAgYyA9IChjICsgY2MpID4+PiAwO1xyXG4gICAgICBkID0gKGQgKyBkZCkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNyeXB0LmVuZGlhbihbYSwgYiwgYywgZF0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEF1eGlsaWFyeSBmdW5jdGlvbnNcclxuICBtZDUuX2ZmICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGMgfCB+YiAmIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2dnICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGQgfCBjICYgfmQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2hoICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiBeIGMgXiBkKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9paSAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGMgXiAoYiB8IH5kKSkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG5cclxuICAvLyBQYWNrYWdlIHByaXZhdGUgYmxvY2tzaXplXHJcbiAgbWQ1Ll9ibG9ja3NpemUgPSAxNjtcclxuICBtZDUuX2RpZ2VzdHNpemUgPSAxNjtcclxuXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG1lc3NhZ2UgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSBudWxsKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgYXJndW1lbnQgJyArIG1lc3NhZ2UpO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHVybDogXCJodHRwczovL2Jsb2cuaWNvZGVmLmNvbTo4MDgxL1wiLFxuICAgIHZlcnNpb246IDEuNTYsXG4gICAgdXBkYXRlOiAnaHR0cHM6Ly9naXRodWIuY29tL0NvZEZybS9jeG1vb2MtdG9vbHMvcmVsZWFzZXMnLFxuICAgIGVuZm9yY2U6IGZhbHNlLFxuICAgIGN4OiB7XG4gICAgICAgIHBsYXllcjogJ2h0dHBzOi8vYmxvZy5pY29kZWYuY29tOjgwODEvcGxheWVyL2N4bW9vYy10b29scy5zd2YnLFxuICAgICAgICByZXNwbHVnaW46ICdodHRwczovL2Jsb2cuaWNvZGVmLmNvbTo4MDgxL3BsYXllci9SZXNvdXJjZVBsdWcuc3dmJ1xuICAgIH1cbn0iLCJjb25zdCB0b3BpYyA9IHJlcXVpcmUoJy4vdG9waWMnKTtcbmNvbnN0IHZpZGVvID0gcmVxdWlyZSgnLi92aWRlbycpO1xuLyoqXG4gKiDmmL7npLrmianlsZXmjInpkq4s5bm257uR5a6a5LqL5Lu2XG4gKiBAcGFyYW0ge2lmcmFtZSBkb2N1bWVudH0gX3RoaXMgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93RXhwYW5kKF90aGlzKSB7XG4gICAgdmFyIGFucyA9IF90aGlzLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhbnMtam9iLWljb24nKTtcbiAgICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ2NvbmZpZyddKTtcbiAgICBjbGVhckludGVydmFsKHdpbmRvdy5zd2l0Y2hUaW1lcik7XG4gICAgaWYgKGFucy5sZW5ndGggPD0gMCAmJiBjb25maWdbJ2F1dG8nXSkge1xuICAgICAgICAvL+ayoeacieS7u+WKoeeCuSzmraPlnKjmjILmnLrnmoTnirbmgIEsNXPlkI7liIfmjaLkuIvkuIDkuKpcbiAgICAgICAgY29uc29sZS5sb2coJ251bGwsc3dpdGNoIHRhc2snKTtcbiAgICAgICAgd2luZG93LnN3aXRjaFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzd2l0Y2hUYXNrKCk7XG4gICAgICAgIH0sIDUwMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFuc1tpXS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgYW5zW2ldLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICBpZiAoYW5zW2ldLm5leHRTaWJsaW5nLmNsYXNzTmFtZS5pbmRleE9mKCdhbnMtaW5zZXJ0dmlkZW8tb25saW5lJykgPj0gMCkge1xuICAgICAgICAgICAgLy/op4bpopFcbiAgICAgICAgICAgIHZpZGVvKF90aGlzLCBhbnNbaV0sIGkpO1xuICAgICAgICB9IGVsc2UgaWYgKGFuc1tpXS5wYXJlbnROb2RlLmNsYXNzTmFtZS5pbmRleE9mKCdhbnMtYXR0YWNoLWN0IGFucy1qb2ItZmluaXNoZWQnKSA+PSAwKSB7XG4gICAgICAgICAgICAvL+WBmuWujOeahOmimOebrlxuICAgICAgICAgICAgdG9waWMoX3RoaXMsIGFuc1tpXSwgaSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5zW2ldLnBhcmVudE5vZGUuY2xhc3NOYW1lLmluZGV4T2YoJ2Fucy1hdHRhY2gtY3QnKSA+PSAwKSB7XG4gICAgICAgICAgICAvL+acquWBmuWujOeahOmimOebrlxuICAgICAgICAgICAgdG9waWMoX3RoaXMsIGFuc1tpXSwgaSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8v5aSE55CG5p+Q5Lqb5qCH562+XG4gICAgICAgIHZhciBkZWxTcGFucyA9IGFuc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3BhbicpO1xuICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IGRlbFNwYW5zLmxlbmd0aDsgbisrKSB7XG4gICAgICAgICAgICBkZWxTcGFuc1tuXS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIC8v5aaC5p6c5piv5oyC5py65qih5byPLOW5tuS4lOaYr+esrOS4gOS4qizngrnlh7ss5ZCv5YqoIVxuICAgICAgICBpZiAoaSA9PSAwICYmIGNvbmZpZ1snYXV0byddKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGlvbi1idG4nKS5jbGljaygpO1xuICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RlZChkb2MsIGZpbGUpIHtcbiAgICB2YXIgcGF0aCA9ICdzcmMvJyArIGZpbGU7XG4gICAgdmFyIHRlbXAgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgdGVtcC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gICAgdGVtcC5zcmMgPSBkb2N1bWVudC5oZWFkLmdldEF0dHJpYnV0ZSgnY2hyb21lLXVybCcpICsgcGF0aDtcbiAgICBkb2MuaGVhZC5hcHBlbmRDaGlsZCh0ZW1wKTtcbn1cblxuLyoqXG4gKiDlj5bkuK3pl7TmlofmnKxcbiAqIEBwYXJhbSB7Kn0gc3RyIFxuICogQHBhcmFtIHsqfSBsZWZ0IFxuICogQHBhcmFtIHsqfSByaWdodCBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1YnN0ckV4KHN0ciwgbGVmdCwgcmlnaHQpIHtcbiAgICB2YXIgbGVmdFBvcyA9IHN0ci5pbmRleE9mKGxlZnQpICsgbGVmdC5sZW5ndGg7XG4gICAgdmFyIHJpZ2h0UG9zID0gc3RyLmluZGV4T2YocmlnaHQsIGxlZnRQb3MpO1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKGxlZnRQb3MsIHJpZ2h0UG9zKTtcbn1cbi8qKlxuICog5Yib5bu6aHR0cOivt+axglxuICovXG5mdW5jdGlvbiBjcmVhdGVSZXF1ZXN0KCkge1xuICAgIHZhciB4bWxodHRwO1xuICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHhtbGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICAgIH1cbiAgICByZXR1cm4geG1saHR0cDtcbn1cbi8qKlxuICogZ2V06K+35rGCXG4gKiBAcGFyYW0geyp9IHVybCBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldCh1cmwpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgeG1saHR0cCA9IGNyZWF0ZVJlcXVlc3QoKTtcbiAgICAgICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4geG1saHR0cDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvc3QodXJsLCBkYXRhLCBqc29uID0gdHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciB4bWxodHRwID0gY3JlYXRlUmVxdWVzdCgpO1xuICAgICAgICB4bWxodHRwLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIGlmIChqc29uKSB7XG4gICAgICAgICAgICB4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeG1saHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHhtbGh0dHAuc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHhtbGh0dHA7XG59XG5cbi8qKlxuICog5Yib5bu65LiA5Liq5oyJ6ZKuXG4gKiBAcGFyYW0geyp9IHRpdGxlIFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQnRuKHRpdGxlKSB7XG4gICAgdmFyIGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ0bi5pbm5lclRleHQgPSB0aXRsZTtcbiAgICBidG4uc3R5bGUub3V0bGluZSA9ICdub25lJztcbiAgICBidG4uc3R5bGUuYm9yZGVyID0gJzAnO1xuICAgIGJ0bi5zdHlsZS5iYWNrZ3JvdW5kID0gJyM3ZDlkMzUnO1xuICAgIGJ0bi5zdHlsZS5jb2xvciA9ICcjZmZmJztcbiAgICBidG4uc3R5bGUuYm9yZGVyUmFkaXVzID0gJzRweCc7XG4gICAgYnRuLnN0eWxlLnBhZGRpbmcgPSAnMnB4IDhweCc7XG4gICAgYnRuLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICBidG4uc3R5bGUuZm9udFNpemUgPSAnMTJweCc7XG4gICAgYnRuLnN0eWxlLm1hcmdpbkxlZnQgPSAnNHB4JztcbiAgICBidG4ub25tb3VzZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIGJ0bi5zdHlsZS5ib3hTaGFkb3cgPSAnMXB4IDFweCAxcHggMXB4ICNjY2MnO1xuICAgIH07XG4gICAgYnRuLm9ubW91c2VvdXQgPSAoKSA9PiB7XG4gICAgICAgIGJ0bi5zdHlsZS5ib3hTaGFkb3cgPSAnJztcbiAgICB9O1xuICAgIHJldHVybiBidG47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hDaG9pY2UoKSB7XG4gICAgdmFyIHRhYiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYnRhZ3MnKTtcbiAgICBpZiAodGFiLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHRhYnMgPSB0YWJbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NwYW4nKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRhYnNbaV0uY2xhc3NOYW1lLmluZGV4T2YoJ2N1cnJlbnRzJykgPiAwKSB7XG4gICAgICAgICAgICAvL+eOsOihjCzliIfmjaLliLDkuIvkuIDkuKpcbiAgICAgICAgICAgIGlmIChpICsgMSA+PSB0YWJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8v6LaF6L+H6ZW/5bqmXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJzW2kgKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvL+WPr+S7peaNoumhteS6hlxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFRhc2soKSB7XG4gICAgLy8gdmFyIG5vdyA9IE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAvLyBpZiAobG9jYWxTdG9yYWdlWydsYXN0J10gIT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgIC8v5Yik5pat5LiK5qyh6Ze06ZqUXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCk7XG4gICAgLy8gICAgIGlmIChub3cgLSBsb2NhbFN0b3JhZ2VbJ2xhc3QnXSA8IDQpIHtcbiAgICAvLyAgICAgICAgIC8v5bCP5LqONOenkuS4jei/m+ihjOaTjeS9nCzov5Tlm55cbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbiAgICAvLyBsb2NhbFN0b3JhZ2VbJ2xhc3QnXSA9IE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcbiAgICAvL+WIpOaWremAiemhueWkuVxuICAgIHZhciB0YWIgPSBzd2l0Y2hDaG9pY2UoKTtcbiAgICBpZiAodGFiICE9PSBmYWxzZSkge1xuICAgICAgICB0YWIuY2xpY2soKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8v5Yik5pat5Lu75Yqh54K5XG4gICAgdmFyIGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3Vyc2V0cmVlJyk7XG4gICAgdmFyIG5vdyA9IGNvdXJzZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjdXJyZW50cycpO1xuICAgIGlmIChub3cubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgYWxlcnQoJ+W+iOWlh+aAquWViicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG5vdyA9IG5vd1swXTtcbiAgICB2YXIgbmV4dCA9IG5vdy5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgaWYgKG5leHQubmV4dEVsZW1lbnRTaWJsaW5nID09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobmV4dC5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGFsZXJ0KCfmjILmnLrlrozmiJDkuoYnKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV4dCA9IG5leHQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL+S4pOS4queItuiKgueCueWQjizkuIvkuIDkuKrlhYTlvJ/oioLngrnnmoTnrKzkuIDkuKroioLngrks54K55Ye7LOWQr+WKqCFcbiAgICBjb25zb2xlLmxvZyhuZXh0KTtcbiAgICB2YXIgbmV4dEJ0biA9IG5leHQubmV4dEVsZW1lbnRTaWJsaW5nLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylbMF07XG4gICAgaWYgKG5leHRCdG4uaHJlZi5pbmRleE9mKCdnZXRUZWFjaGVyQWpheCcpIDw9IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N3aXRjaCB0YXNrIGxvY2snKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzd2l0Y2hUYXNrKCk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5vdy5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgbmV4dEJ0bi5jbGljaygpO1xuICAgICAgICBuZXh0QnRuLmZpcnN0RWxlbWVudENoaWxkLmNsYXNzTmFtZSA9ICdjdXJyZW50cyc7XG4gICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHRhc2snKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFsUmVneChzdHIsIHRvcGljKSB7XG4gICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKCcoJywgJ1xcXFwoJyk7XG4gICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKCcpJywgJ1xcXFwpJyk7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoJ3t0b3BpY30nLCAnW1xcXFxzXFxcXFNdezAsNn0/JyArIHRvcGljICsgJ1tcXFxcc1xcXFxTXSo/Jyk7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoJ3thbnN3ZXJ9JywgJyhcXFxcUyspJyk7XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLyoqIFxuICog5Y676ZmkaHRtbOagh+etvlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSFRNTChodG1sKSB7XG4gICAgLy9UT0RPOumHjeWkjeeahOWHveaVsFxuICAgIC8v5YWI5aSE55CGaW1n5qCH562+XG4gICAgdmFyIGltZ1JlcGxhY2UgPSAvPGltZyAuKj9zcmM9XCIoLio/KVwiLio/Pi9nO1xuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoaW1nUmVwbGFjZSwgJyQxJyk7XG4gICAgdmFyIHJldkh0bWwgPSAvPC4qPz4vZztcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKHJldkh0bWwsICcnKTtcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC8oXlxccyspfChcXHMrJCkvZywgJycpO1xuICAgIGh0bWwgPSBkZWFsU3ltYm9sKGh0bWwpO1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyZuYnNwOy9nLCAnICcpO1xufVxuXG4vKipcbiAqIOWkhOeQhuespuWPt1xuICogQHBhcmFtIHsqfSB0b3BpYyBcbiAqL1xuZnVuY3Rpb24gZGVhbFN5bWJvbCh0b3BpYykge1xuICAgIHRvcGljID0gdG9waWMucmVwbGFjZSgn77yMJywgJywnKTtcbiAgICB0b3BpYyA9IHRvcGljLnJlcGxhY2UoJ++8iCcsICcoJyk7XG4gICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKCfvvIknLCAnKScpO1xuICAgIHRvcGljID0gdG9waWMucmVwbGFjZSgn77yfJywgJz8nKTtcbiAgICB0b3BpYyA9IHRvcGljLnJlcGxhY2UoJ++8micsICc6Jyk7XG4gICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKC9b4oCc4oCdXS9nLCAnXCInKTtcbiAgICByZXR1cm4gdG9waWM7XG59XG5cbi8qKlxuICog6I635Y+W5pys5Zyw6aKY5bqT5Lit55qE5L+h5oGvXG4gKiBAcGFyYW0geyp9IHRvcGljIFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxUb3BpYyh0b3BpYywgY291bnQpIHtcbiAgICBjb3VudCA9IGNvdW50ID09IHVuZGVmaW5lZCA/IDEgOiBjb3VudDtcbiAgICB0cnkge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlWyd0b3BpY19yZWd4J10gPT0gdW5kZWZpbmVkIHx8IGxvY2FsU3RvcmFnZVsndG9waWNfcmVneCddID09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoZGVhbFJlZ3gobG9jYWxTdG9yYWdlWyd0b3BpY19yZWd4J10sIHRvcGljKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlZyk7XG4gICAgICAgIHZhciBzdHIgPSBsb2NhbFN0b3JhZ2VbJ3RvcGljcyddO1xuICAgICAgICB2YXIgYXJyID0gcmVnLmV4ZWMoc3RyKTtcbiAgICAgICAgaWYgKGFyciAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGFyclswXSxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6IGFyci5sZW5ndGggPj0gMiA/IGFyclsxXSA6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGNvdW50IDw9IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRMb2NhbFRvcGljKHRvcGljLnN1YnN0cmluZyhjb3VudCwgdG9waWMubGVuZ3RoIC0gMiksICsrY291bnQpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgfVxuICAgIHJldHVybjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcF9wcm9tcHQodGV4dCwgc2VjID0gNCkge1xuICAgIHZhciBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib3guc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgYm94LnN0eWxlLmJhY2tncm91bmQgPSBcIiNhZWZmYWJcIjtcbiAgICBib3guc3R5bGUuZm9udFNpemUgPSBcIjE4cHhcIjtcbiAgICBib3guc3R5bGUucGFkZGluZyA9IFwiNHB4IDIwcHhcIjtcbiAgICBib3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIyMHB4XCI7XG4gICAgYm94LnN0eWxlLnRvcCA9IFwiNTAlXCI7XG4gICAgYm94LnN0eWxlLmxlZnQgPSBcIjUwJVwiO1xuICAgIGJveC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZSgtNTAlLC01MCUpXCI7XG4gICAgYm94LnN0eWxlLnRyYW5zaXRpb24gPSBcIjFzXCI7XG4gICAgYm94LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICBib3guaW5uZXJUZXh0ID0gdGV4dDtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYm94LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBib3gucmVtb3ZlKCk7XG4gICAgICAgIH0sIDEwMDApXG4gICAgfSwgc2VjICogMTAwMCk7XG4gICAgcmV0dXJuIGJveDtcbn0iLCJpbXBvcnQge1xuICAgIHNob3dFeHBhbmQsXG4gICAgcmVtb3ZlSFRNTCxcbiAgICBnZXQsXG4gICAgZ2V0TG9jYWxUb3BpY1xufSBmcm9tICcuL2NvbW1vbic7XG5jb25zdCBtZDUgPSByZXF1aXJlKFwibWQ1XCIpO1xuY29uc3QgbW9vY1NlcnZlciA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuLy/nm5HlkKzmoYbmnrbliqDovb1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICB2YXIgZXYgPSBldiB8fCBldmVudDtcbiAgICB2YXIgX3RoaXMgPSBldi5zcmNFbGVtZW50IHx8IGV2LnRhcmdldDtcbiAgICBpZiAoX3RoaXMuaWQgPT0gJ2lmcmFtZScpIHtcbiAgICAgICAgc2hvd0V4cGFuZChfdGhpcyk7XG4gICAgfVxufSwgdHJ1ZSk7XG4vL+ebkea1i+ahhuaetlxudmFyIGZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lmcmFtZScpO1xuaWYgKGZyYW1lICE9IG51bGwpIHtcbiAgICBzaG93RXhwYW5kKGZyYW1lKTtcbn1cbi8v55uR5rWL5L2c5Lia5p2/5Z2XXG5pZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignd29yay9kb0hvbWVXb3JrTmV3JykgPiAwKSB7XG4gICAgdmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybTEnKTtcbiAgICBpZiAoZm9ybSAhPSBudWxsKSB7XG4gICAgICAgIC8v5pi+56S6562U6aKY5oyJ6ZKuXG4gICAgICAgIGNvbnN0IHRvcGljID0gcmVxdWlyZSgnLi90b3BpYycpO1xuICAgICAgICB0b3BpYyhkb2N1bWVudCwgZm9ybS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLCAwLCBmYWxzZSk7XG4gICAgfVxufVxuXG5pZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignd29yay9zZWxlY3RXb3JrUXVlc3Rpb25ZaVBpWXVlJykgPiAwKSB7XG4gICAgdmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnWnlCb3R0b20nKTtcbiAgICBpZiAoZm9ybSAhPSBudWxsKSB7XG4gICAgICAgIC8v5pi+56S6562U6aKY5oyJ6ZKuXG4gICAgICAgIGNvbnN0IHRvcGljID0gcmVxdWlyZSgnLi90b3BpYycpO1xuICAgICAgICB0b3BpYyhkb2N1bWVudCwgZm9ybS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLCAwLCB0cnVlKTtcbiAgICB9XG59XG5cbi8v6ICD6K+VXG5pZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignZXhhbS90ZXN0L3JlVmVyc2lvblRlc3RTdGFydE5ldycpID4gMCkge1xuICAgIC8v6K+75Y+W6aKY55uu5ZKM562U5qGIXG4gICAgdmFyIGNvbmZpZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjb25maWcnXSk7XG4gICAgdmFyIHRvcGljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bvc2l0aW9uJHt2ZWxvY2l0eUNvdW50fScpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NsZWFyZml4JylbMF07XG4gICAgdmFyIHByb21wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb21wdC5zdHlsZS5jb2xvciA9IFwiI2U1MzkzNVwiO1xuICAgIHByb21wdC5jbGFzc05hbWUgPSBcInByb21wdFwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmb3JtJylbMF0uYXBwZW5kQ2hpbGQocHJvbXB0KTtcbiAgICB2YXIgbmV0UmVxO1xuICAgIGlmIChjb25maWdbJ2JsdXJyeV9hbnN3ZXInXSkge1xuICAgICAgICB0b3BpYyA9IGRlYWxUb3BpYyh0b3BpYyk7XG4gICAgICAgIG5ldFJlcSA9IGNvbW1vbi5wb3N0KG1vb2NTZXJ2ZXIudXJsICsgJ3YyL2Fuc3dlcicsICd0b3BpY1swXT0nK3RvcGljLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9waWMgPSBtZDUoZGVhbFRvcGljKHRvcGljKSk7XG4gICAgICAgIG5ldFJlcSA9IGdldChtb29jU2VydmVyLnVybCArICdhbnN3ZXI/dG9waWNbMF09JyArIG1kNSh0b3BpYykpO1xuICAgIH1cbiAgICBuZXRSZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyAhPSAyMDApIHtcbiAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJUZXh0ID0gJ+e9kee7nOmUmeivryc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb25bMF0ucmVzdWx0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdC5pbm5lclRleHQgPSAn5rKh5pyJ5pCc57Si5Yiw562U5qGILOWwneivleS7jumimOW6k+S4reafpeivoic7XG4gICAgICAgICAgICAgICAgICAgIC8v5LuO5pys5Zyw6aKY5bqT6K+75Y+W5YaF5a65XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbFRvcGljID0gZ2V0TG9jYWxUb3BpYyh0b3BpYyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFRvcGljICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/mo4DntKLliLDpopjnm67kuoZcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXBSZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+exu+Wei+WIpOaWrVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9eW1xcd10rJC8udGVzdChsb2NhbFRvcGljLmFuc3dlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBSZXN1bHQudHlwZSA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eW+KImnzDl10kLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcFJlc3VsdC50eXBlID0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wUmVzdWx0LnR5cGUgPSA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcFJlc3VsdC50eXBlID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIpOaWremimFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcFJlc3VsdC5jb3JyZWN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAobG9jYWxUb3BpYy5hbnN3ZXIgPT0gJ+KImicgPyB0cnVlIDogZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRtcFJlc3VsdC50eXBlIDw9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WNlS/lpJrpgIlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gL1tcXHddL2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbG9jYWxUb3BpYy5hbnN3ZXIubWF0Y2gocmVnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF0Y2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcFJlc3VsdC5jb3JyZWN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbjogbWF0Y2hbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0bXBSZXN1bHQudHlwZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/loavnqbrpopgs5pqC5pe256m65LiA5LiLXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0bXBSZXN1bHQuY29ycmVjdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvblswXS5yZXN1bHQucHVzaCh0bXBSZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdC5pbm5lckhUTUwgPSBcIuaIkOWKn+eahOS7juacrOWcsOmimOW6k+aQnOe0ouWIsOetlOahiDo8YnIgLz5cIiArIGxvY2FsVG9waWMuY29udGVudCArIFwiPGJyLz7nrZTmoYg6XCIgKyBsb2NhbFRvcGljLmFuc3dlciArIFwiPGJyLz5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCArPSBcIjxiciAvPumimOW6k+S4reaXoOivpemimOetlOahiFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCArPSBcIjxiciAvPumimOW6k+S4reaXoOivpemimOetlOahiFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCArPSBcIuaQnOe0ouaIkOWKnyznrZTmoYg6XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChqc29uW1wiMFwiXS5yZXN1bHRbXCIwXCJdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdDeV91bFRvcCcpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXIgPSBqc29uW1wiMFwiXS5yZXN1bHRbXCIwXCJdLmNvcnJlY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgInmi6npophcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvcHRpb25zW2Fuc3dlcltpXS5vcHRpb24uY2hhckNvZGVBdCgpIC0gNjVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbYW5zd2VyW2ldLm9wdGlvbi5jaGFyQ29kZUF0KCkgLSA2NV0uY2xhc3NOYW1lICE9ICdIb3ZlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbYW5zd2VyW2ldLm9wdGlvbi5jaGFyQ29kZUF0KCkgLSA2NV0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MICs9IGFuc3dlcltpXS5vcHRpb24gKyAn44CBJyArIGFuc3dlcltpXS5jb250ZW50ICsgXCIgIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdDeV91bEJvdHRvbScpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yik5pat6aKYXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25bXCIwXCJdLnJlc3VsdFtcIjBcIl0uY29ycmVjdFtcIjBcIl0uY29udGVudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbMF0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zWzBdLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/loavnqbrpophcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVhbFRvcGljKHRvcGljKSB7XG4gICAgdG9waWMgPSByZW1vdmVIVE1MKHRvcGljLmlubmVySFRNTCk7XG4gICAgdmFyIHJldkh0bWwgPSAvPFtcXHNcXFNdKj8+L2c7XG4gICAgLy/lpITnkIbliIZcbiAgICB0b3BpYyA9IHRvcGljLnJlcGxhY2UoL1xc77yIW1xcU10rP+WIhu+8iS8sICcnKVxuICAgIHRvcGljID0gdG9waWMucmVwbGFjZShyZXZIdG1sLCAnJykudHJpbSgpO1xuICAgIHJldHVybiB0b3BpY1xufSIsImNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBtZDUgPSByZXF1aXJlKFwibWQ1XCIpO1xuY29uc3QgbW9vY1NlcnZlciA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuLyoqXG4gKiDpopjnm67lpITnkIbmqKHlnZdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoX3RoaXMsIGVsTG9nbywgaW5kZXgsIG92ZXIpIHtcbiAgICB2YXIgZG9jLCB0b3BpY0RvYztcbiAgICBpZiAoX3RoaXMuaWQgPT0gJ2lmcmFtZScpIHtcbiAgICAgICAgZG9jID0gX3RoaXMuY29udGVudERvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpZnJhbWUnKVtpbmRleF0uY29udGVudERvY3VtZW50O1xuICAgICAgICB0b3BpY0RvYyA9IGRvYy5nZXRFbGVtZW50QnlJZCgnZnJhbWVfY29udGVudCcpLmNvbnRlbnREb2N1bWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2MgPSBfdGhpcztcbiAgICAgICAgdG9waWNEb2MgPSBfdGhpcztcbiAgICB9XG4gICAgdmFyIGNvbmZpZyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjb25maWcnXSk7XG4gICAgaWYgKG92ZXIgfHwgKGNvbmZpZ1snYXV0byddICYmIGNvbmZpZ1snYW5zd2VyX2lnbm9yZSddKSkge1xuICAgICAgICAvL+WujOaIkOeahOaPkOS6pOetlOahiFxuICAgICAgICB2YXIgYXV0byA9IGNvbW1vbi5jcmVhdGVCdG4oJ+S4i+S4gOS4qicpO1xuICAgICAgICBhdXRvLmlkID0gJ2FjdGlvbi1idG4nO1xuICAgICAgICBlbExvZ28uYXBwZW5kQ2hpbGQoYXV0byk7XG4gICAgICAgIGF1dG8ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8v6L+b5YWl5LiL5LiA5LiqXG4gICAgICAgICAgICBpZiAoIWNvbmZpZ1snYXV0byddKSB7XG4gICAgICAgICAgICAgICAgbmV4dFRhc2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5leHRUYXNrKCk7XG4gICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgfVxuICAgICAgICBkZWFsRG9jdW1lbnRUb3BpYyh0b3BpY0RvYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy/mnKrlrozmiJDnmoTloavlhaXnrZTmoYhcbiAgICAgICAgdmFyIGF1dG8gPSBjb21tb24uY3JlYXRlQnRuKCfmkJzntKLnrZTmoYgnKTtcbiAgICAgICAgYXV0by5pZCA9ICdhY3Rpb24tYnRuJztcbiAgICAgICAgZWxMb2dvLmFwcGVuZENoaWxkKGF1dG8pO1xuICAgICAgICBhdXRvLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9waWNMaXN0ID0gdG9waWNEb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnWnlfVEl0bGUnKTtcbiAgICAgICAgICAgIC8v5YiG5aSa5q616K+35rGCLOavj+autTEw5Liq6K+35rGCXG4gICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHRvcGljTGlzdC5sZW5ndGg7IG4gKz0gMTApIHtcbiAgICAgICAgICAgICAgICBsZXQgdG9waWMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gbjsgaSA8IHRvcGljTGlzdC5sZW5ndGggJiYgaSAtIG4gPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSBnZXRUb3BpY01zZyh0b3BpY0xpc3RbaV0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWQ1RGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZ1snYmx1cnJ5X2Fuc3dlciddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmx1cmRlYWwgPSBtc2cudG9waWM7XG4gICAgICAgICAgICAgICAgICAgICAgICBibHVyZGVhbCA9IGJsdXJkZWFsLnJlcGxhY2UoL1tcXHPjgILvvIjvvIlcXChcXClcXC5dKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZDVEYXRhID0geyB0b3BpYzogZW5jb2RlVVJJKGJsdXJkZWFsKSwgdHlwZTogbXNnLnR5cGUudG9TdHJpbmcoKSB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWQ1RGF0YSA9IG1kNShtc2cudG9waWMgKyBtc2cudHlwZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0b3BpY0xpc3RbaV0uaWQgPSAnYW5zd2VyXycgKyBpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHRvcGljLnB1c2gobWQ1RGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiB0b3BpYykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnWydibHVycnlfYW5zd2VyJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgKz0gJ3RvcGljWycgKyBpICsgJ109JyArIHRvcGljW2ldLnRvcGljICsgJyZ0eXBlWycgKyBpICsgJ109JyArIHRvcGljW2ldLnR5cGUgKyAnJic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhICs9ICd0b3BpY1snICsgaSArICddPScgKyB0b3BpY1tpXSArICcmJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBuZXRSZXE7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZ1snYmx1cnJ5X2Fuc3dlciddKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldFJlcSA9IGNvbW1vbi5wb3N0KG1vb2NTZXJ2ZXIudXJsICsgJ3YyL2Fuc3dlcicsIGRhdGEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXRSZXEgPSBjb21tb24uZ2V0KG1vb2NTZXJ2ZXIudXJsICsgJ2Fuc3dlcj8nICsgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5ldFJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzICE9IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+acquefpemUmeivrycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyX251bGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Whq+WFpeetlOahiFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4ganNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsbEluKCdhbnN3ZXJfJyArIChuICsganNvbltpXS5pbmRleCksIGpzb25baV0ucmVzdWx0ID09IHVuZGVmaW5lZCA/IFtdIDoganNvbltpXS5yZXN1bHQpID09ICdudWxsIGFuc3dlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcl9udWxsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaYr+iHquWKqOaMguacuizloavlhaXkuYvlkI7oh6rliqjmj5DkuqRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZ1snYXV0byddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlcl9udWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfmnInpopjnm67msqHmnInmib7liLDnrZTmoYgs5bm25LiU5pyq6K6+572u6ZqP5py6562U5qGILOivt+aJi+WKqOWhq+WFpScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aPkOS6pOaTjeS9nFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VibWl0ID0gdG9waWNEb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnQnRuX2JsdWVfMScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXQgPSBzdWJtaXRbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdC5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIpOaWreacieayoeacieacquWhq+eahOmimOebrlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b3BpY0RvYy5nZXRFbGVtZW50QnlJZCgndGlwQ29udGVudCcpLmlubmVyVGV4dC5pbmRleE9mKCfmnKrlgZrlrownKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfmj5DnpLo6JyArIHRvcGljRG9jLmdldEVsZW1lbnRCeUlkKCd0aXBDb250ZW50JykuaW5uZXJUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2YWxpZGF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcC5zdHlsZS5kaXNwbGF5ICE9ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+mcgOimgei+k+WFpemqjOivgeeggScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ehruWumuaPkOS6pFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1Ym1pdCA9IHRvcGljRG9jLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JsdWVidG4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdFswXS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gX3RoaXMuY29udGVudERvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpZnJhbWUnKVtpbmRleF0uY29udGVudFdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGFzaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNvbmZpZ1snaW50ZXJ2YWwnXSAqIDEwMDAgKiA2MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RpbWVvdXQ6JyArIGNvbmZpZ1snaW50ZXJ2YWwnXSAqIDEwMDAgKiA2MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0VGFzaygpIHtcbiAgICAgICAgLy/liKTmlq3mnInmsqHmnInkuIvkuIDkuKos6Ieq5Yqo6L+b6KGM5LiL5LiA5Liq5Lu75YqhXG4gICAgICAgIHZhciBhbnMgPSBfdGhpcy5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYW5zLWpvYi1pY29uJyk7XG4gICAgICAgIGlmIChhbnMubGVuZ3RoID4gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAvL+eCueWHu1xuICAgICAgICAgICAgdmFyIG5leHRBY3Rpb24gPSBhbnNbaW5kZXggKyAxXS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIG5leHRBY3Rpb24uY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5bey57uP5piv5pyA5ZCO5LiA5LiqLOWIh+aNouS7u+WKoVxuICAgICAgICAgICAgY29tbW9uLnN3aXRjaFRhc2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeUqGRvY3VtZW505pa55byP5o+Q5Y+W6aKY55uuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVhbERvY3VtZW50VG9waWMoZG9jKSB7XG4gICAgICAgIHZhciB0b3BpYyA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdUaU11Jyk7XG4gICAgICAgIHZhciByZXRKc29uID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9waWMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8v6aKY55uu5qCH6aKY5Z2X5a+56LGhXG4gICAgICAgICAgICB2YXIgdGl0bGVEaXYgPSB0b3BpY1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdaeV9USXRsZSBjbGVhcmZpeCcpO1xuICAgICAgICAgICAgaWYgKHRpdGxlRGl2Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aXRsZURpdiA9IHRpdGxlRGl2WzBdO1xuICAgICAgICAgICAgLy/popjnm67moIfpopjlr7nosaFcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRpdGxlRGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NsZWFyZml4Jyk7XG4gICAgICAgICAgICBpZiAodGl0bGUubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpdGxlID0gdGl0bGVbMF07XG4gICAgICAgICAgICAvL+mimOebruexu+Wei+WvueixoVxuICAgICAgICAgICAgdmFyIHR5cGUgPSB0aXRsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XG4gICAgICAgICAgICBpZiAodHlwZS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHlwZSA9IHR5cGVbMF07XG4gICAgICAgICAgICAvL+iOt+WPlumimOebruexu+Wei1xuICAgICAgICAgICAgdHlwZSA9IHN3aXRjaFRvcGljVHlwZShjb21tb24uc3Vic3RyRXgodHlwZS5pbm5lckhUTUwsICfjgJAnLCAn44CRJykpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v6I635Y+W6aKY55uuXG4gICAgICAgICAgICB2YXIgdG1wVGl0bGUgPSByZW1vdmVIVE1MKHRpdGxlLmlubmVySFRNTC5zdWJzdHJpbmcodGl0bGUuaW5uZXJIVE1MLmluZGV4T2YoJ+OAkScpICsgMSkpO1xuICAgICAgICAgICAgLy8gdGl0bGUgPSB0aXRsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgncCcpO1xuICAgICAgICAgICAgaWYgKHRtcFRpdGxlLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgLy/popjnm67ojrflj5blpLHotKUs5pCc57Si6YeM6Z2i5pyJ5rKh5pyJaW1nLOaciemCo+S5iHRpdGxl5bCx5Li6aW1n55qE6Lev5b6EXG4gICAgICAgICAgICAgICAgdmFyIGltZyA9IHRpdGxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKTtcbiAgICAgICAgICAgICAgICBpZiAoaW1nID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRtcFRpdGxlID0gaW1nLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aXRsZSA9IHRtcFRpdGxlO1xuICAgICAgICAgICAgLy/lr7nnrZTmoYjov5vooYzlpITnkIZcbiAgICAgICAgICAgIHZhciByZXQgPSBkZWFsRG9jdW1lbnRBbnN3ZXIodG9waWNbaV0sIHR5cGUpO1xuICAgICAgICAgICAgaWYgKHJldCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXQudHlwZSA9IHR5cGU7XG4gICAgICAgICAgICAgICAgcmV0LnRvcGljID0gdGl0bGU7XG4gICAgICAgICAgICAgICAgcmV0SnNvbi5wdXNoKHJldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtc2cuYW5zd2VycyA9IGFuc3dlcnM7XG4gICAgICAgICAgICAvLyBtc2cuY29ycmVjdCA9IGNvcnJlY3Q7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0eXBlLCB0aXRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJveCA9IGNvbW1vbi5wb3BfcHJvbXB0KFwi4oiaICDnrZTmoYjoh6rliqjorrDlvZXmiJDlip9cIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYm94KTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGJveC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7IH0sIDUwMCk7XG4gICAgICAgIGNvbW1vbi5wb3N0KG1vb2NTZXJ2ZXIudXJsICsgJ2Fuc3dlcicsIEpTT04uc3RyaW5naWZ5KHJldEpzb24pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWFsRG9jdW1lbnRBbnN3ZXIodG9waWMsIHR5cGUpIHtcbiAgICAgICAgdmFyIHJldCA9IHtcbiAgICAgICAgICAgIGFuc3dlcnM6IFtdLFxuICAgICAgICAgICAgY29ycmVjdDogW11cbiAgICAgICAgfTtcbiAgICAgICAgLy/nhLblkI7nnIvnnIvmnInmsqHmnInmraPnoa7nrZTmoYhcbiAgICAgICAgdmFyIGFuc3dlciA9IHRvcGljLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ1B5X3RrJyk7XG4gICAgICAgIHZhciBhbnN3ZXJTcGFuID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoYW5zd2VyLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAvL+ayoeacieato+ehruetlOahiCzmkJzntKLoh6rlt7HnmoTnrZTmoYgs5bm25Yik5pat5piv5LiN5piv5a+555qELOWQpuWImei/lOWbnuepulxuICAgICAgICAgICAgYW5zd2VyID0gdG9waWMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnUHlfYW5zd2VyIGNsZWFyZml4Jyk7XG4gICAgICAgICAgICBpZiAoYW5zd2VyLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbnN3ZXJbMF0uaW5uZXJIVE1MLmluZGV4T2YoXCLmraPnoa7nrZTmoYhcIikgPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuc3dlclswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZHVpXCIpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5zd2VyU3BhbiA9IGFuc3dlclswXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3BhbicpO1xuICAgICAgICAgICAgaWYgKGFuc3dlclNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGFuc3dlclNwYW4gPSBhbnN3ZXJTcGFuWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFuc3dlciA9IGFuc3dlclswXTtcbiAgICAgICAgLy/mj5Dlj5bpgInpobnlkoznrZTmoYjliLDmlbDmja7lupPnu5PmnoRcbiAgICAgICAgLy8gbXNnLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAvLyBtc2cuY29ycmVjdCA9IGNvcnJlY3Q7XG4gICAgICAgIGlmICh0eXBlIDw9IDIpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0gdG9waWMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnWnlfdWxUb3AnKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnNbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xlYXJmaXgnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbiA9IG9wdGlvbnNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2knKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbi5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBvcHRpb25zW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSBvcHRpb25bMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50WzBdO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSBvcHRpb24uaW5uZXJIVE1MLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcEpzb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb246IG9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlbW92ZUhUTUwoY29udGVudC5pbm5lckhUTUwpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJldC5hbnN3ZXJzLnB1c2godG1wSnNvbik7XG4gICAgICAgICAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5Zyo5YW25LitXG4gICAgICAgICAgICAgICAgICAgIC8v6YCJ5oup6aKY55qE5q2j56Gu562U5qGI5ZKM6Ieq5bex55qE562U5qGI6YO95Zyo5LiA6LW3LOWFiOWIpOaWreacieayoeacieato+ehruetlOahiFxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5zd2VyU3Bhbi5pbm5lckhUTUwuaW5kZXhPZihvcHRpb24pID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5jb3JyZWN0LnB1c2godG1wSnNvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAzKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoYW5zd2VyU3Bhbi5pbm5lckhUTUwuaW5kZXhPZignw5cnKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0LmNvcnJlY3QucHVzaCh7XG4gICAgICAgICAgICAgICAgb3B0aW9uOiB0LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gNCkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBhbnN3ZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnNbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9udDE0Jyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uID0gb3B0aW9uc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaScpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb24ubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gb3B0aW9uc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbGVhcmZpeCcpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRpb24gPSBvcHRpb25bMF07XG4gICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnRbMF07XG4gICAgICAgICAgICAgICAgb3B0aW9uID0gY29tbW9uLnN1YnN0ckV4KG9wdGlvbi5pbm5lckhUTUwsIFwi56ysXCIsIFwi56m6XCIpO1xuICAgICAgICAgICAgICAgIHZhciB0bXBKc29uID0ge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb246IG9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVtb3ZlSFRNTChjb250ZW50LmlubmVySFRNTClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vIHJldC5hbnN3ZXJzLnB1c2godG1wSnNvbik7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZHVpJykubGVuZ3RoID4gMCB8fCBhbnN3ZXJTcGFuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXQuY29ycmVjdC5wdXNoKHRtcEpzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmQobWluLCBtYXgpIHtcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBtaW4gKyAxLCAxMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4sIDEwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxsSW4oaWQsIHJlc3VsdCkge1xuICAgICAgICB2YXIgdG9waWNFbCA9IHRvcGljRG9jLmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgdmFyIHRvcGljTXNnID0gZ2V0VG9waWNNc2codG9waWNFbCk7XG4gICAgICAgIHZhciBwcm9tcHQgPSB0b3BpY0VsLm5leHRTaWJsaW5nLm5leHRTaWJsaW5nLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Byb21wdCcpO1xuICAgICAgICBpZiAocHJvbXB0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBwcm9tcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHByb21wdC5zdHlsZS5jb2xvciA9IFwiI2U1MzkzNVwiO1xuICAgICAgICAgICAgcHJvbXB0LmNsYXNzTmFtZSA9IFwicHJvbXB0XCI7XG4gICAgICAgICAgICB0b3BpY0VsLm5leHRTaWJsaW5nLm5leHRTaWJsaW5nLmFwcGVuZENoaWxkKHByb21wdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9tcHQgPSBwcm9tcHRbMF07XG4gICAgICAgICAgICBwcm9tcHQuc3R5bGUuY29sb3IgPSBcIiNlNTM5MzVcIjtcbiAgICAgICAgICAgIHByb21wdC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIHByb21wdC5zdHlsZS5mb250V2VpZ2h0ID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b3BpY01zZy50b3BpYyA9PSAnJykge1xuICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCA9ICfmsqHmnInmib7liLDpopjnm64s5LuA5LmI6ay8Pyc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0b3BpY0VsLm5leHRTaWJsaW5nLm5leHRTaWJsaW5nLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpO1xuICAgICAgICB2YXIgcmFuZCA9IGRvY3VtZW50LmhlYWQuZ2V0QXR0cmlidXRlKCdyYW5kLWFuc3dlcicpO1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAvL+ayoeacieWcqOe6v+S4iuajgOe0ouWIsOetlOahiCzlhYjlnKjmo4DntKLmnKzlnLDpopjlupNcbiAgICAgICAgICAgIC8v5LuO5pys5Zyw6aKY5bqT6K+75Y+W5YaF5a65XG4gICAgICAgICAgICB2YXIgbG9jYWxUb3BpYyA9IGdldExvY2FsVG9waWModG9waWNNc2cudG9waWMpO1xuICAgICAgICAgICAgaWYgKGxvY2FsVG9waWMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy/mo4DntKLliLDpopjnm67kuoZcbiAgICAgICAgICAgICAgICB2YXIgdG1wUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICBjb3JyZWN0OiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdG1wUmVzdWx0LnR5cGUgPSB0b3BpY01zZy50eXBlO1xuICAgICAgICAgICAgICAgIGlmICh0bXBSZXN1bHQudHlwZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5Yik5pat6aKYXG4gICAgICAgICAgICAgICAgICAgIHRtcFJlc3VsdC5jb3JyZWN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogKGxvY2FsVG9waWMuYW5zd2VyID09ICfiiJonID8gdHJ1ZSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRtcFJlc3VsdC50eXBlIDw9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ljZUv5aSa6YCJXG4gICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSAvW1xcd10vZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbG9jYWxUb3BpYy5hbnN3ZXIubWF0Y2gocmVnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXRjaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wUmVzdWx0LmNvcnJlY3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uOiBtYXRjaFtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRtcFJlc3VsdC50eXBlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/loavnqbrpopgs5pqC5pe256m65LiA5LiLXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRtcFJlc3VsdC5jb3JyZWN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godG1wUmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codG1wUmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCA9IFwi5oiQ5Yqf55qE5LuO5pys5Zyw6aKY5bqT5pCc57Si5Yiw562U5qGIOjxiciAvPlwiICsgbG9jYWxUb3BpYy5jb250ZW50ICsgXCI8YnIvPuetlOahiDpcIiArIGxvY2FsVG9waWMuYW5zd2VyICsgXCI8YnIvPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAvL+aXoOetlOahiCzmo4DntKLphY3nva7mnInmsqHmnInorr7nva7pmo/mnLrnrZTmoYguLi4uXG4gICAgICAgICAgICBpZiAocmFuZCAhPSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MID0gXCLmsqHmnInku47popjlupPkuK3ojrflj5bliLDnm7jlupTorrDlvZVcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bGwgYW5zd2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21wdC5zdHlsZS5mb250V2VpZ2h0ID0gNjAwO1xuICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCA9IFwi6K+35rOo5oSP6L+Z5piv6ZqP5py655Sf5oiQ55qE562U5qGIITxici8+XCI7XG4gICAgICAgICAgICByYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB0bXBSZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0bXBSZXN1bHQudHlwZSA9IHRvcGljTXNnLnR5cGU7XG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICsgMSk7XG4gICAgICAgICAgICAvL+maj+acuueUn+aIkOetlOahiCzmnInkupvmt7fkubHkuoYuLi4uXG4gICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IG9wdGlvbnMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc0NvbnRlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKHRtcFJlc3VsdC50eXBlID09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/liKTmlq3pophcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQgJSAyID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcFJlc3VsdC5jb3JyZWN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wUmVzdWx0LmNvcnJlY3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG1wUmVzdWx0LnR5cGUgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICAvL+WNlemAiemimFxuICAgICAgICAgICAgICAgICAgICB2YXIgb2MgPSBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoJy5hZnRlcicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc0NvbnRlbnQgPSByZW1vdmVIVE1MKG9jLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0bXBSZXN1bHQudHlwZSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpJrpgIlcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAob3B0aW9ucy5sZW5ndGggLSAxKSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJudW06XCIgKyBkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICg7IGQgPiAwOyBkLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzZWxlY3QubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbl9vYyA9IG9wdGlvbnNbc2VsZWN0W2luZGV4XV0ucXVlcnlTZWxlY3RvcignLmFmdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5fb2MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc0NvbnRlbnQgPSByZW1vdmVIVE1MKG5fb2MuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBSZXN1bHQuY29ycmVjdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogb3B0aW9uc0NvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG4gPT0gZCAlIG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wUmVzdWx0LmNvcnJlY3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IG9wdGlvbnNDb250ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL+Whq+epuumimOWVpeeahOWwseS4jeW8hOS6hlxuICAgICAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MID0gJ+S4jeaUr+aMgemaj+acuueahOmimOebruexu+Weiyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaCh0bXBSZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFswXTtcbiAgICAgICAgcHJvbXB0LmlubmVySFRNTCArPSAn562U5qGIOic7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0LmNvcnJlY3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgb3B0aW9ucy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zQ29udGVudDtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnR5cGUgPT0gMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNvcnJlY3RbaV0uY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0LmlubmVySFRNTCArPSAn5a+5IOKImic7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MICs9ICfplJkgw5cnO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1sxXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKVswXS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LnR5cGUgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2MgPSBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoJy5hZnRlcicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob2MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc0NvbnRlbnQgPSByZW1vdmVIVE1MKG9jLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzlhoXlrrnmmK/nqbrnmoQs5bCx55yL6YCJ6aG555qEXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29ycmVjdFtpXS5jb250ZW50ID09IG9wdGlvbnNDb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MICs9IG9wdGlvbnNDb250ZW50ICsgXCIgICBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbbl0ucXVlcnlTZWxlY3RvcignLmFmdGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuY29ycmVjdFtpXS5vcHRpb24gPT0gb3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHQuaW5uZXJIVE1MICs9IG9wdGlvbnNDb250ZW50ICsgXCIgICBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbbl0ucXVlcnlTZWxlY3RvcignLmFmdGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb24gPSBvcHRpb25zW25dLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LnR5cGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zQ29udGVudCA9IGNvbW1vbi5zdWJzdHJFeChvcHRpb25zW25dLmlubmVySFRNTCwgXCLnrKxcIiwgXCLnqbpcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zQ29udGVudCA9PSByZXN1bHQuY29ycmVjdFtpXS5vcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdC5pbm5lckhUTUwgKz0gXCLnrKxcIiArIG9wdGlvbnNDb250ZW50ICsgXCLnqbo6XCIgKyByZXN1bHQuY29ycmVjdFtpXS5jb250ZW50ICsgXCIgICBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbbl0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF0udmFsdWUgPSByZXN1bHQuY29ycmVjdFtpXS5jb250ZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+W5pys5Zyw6aKY5bqT5Lit55qE5L+h5oGvXG4gICAgICogQHBhcmFtIHsqfSB0b3BpYyBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMb2NhbFRvcGljKHRvcGljKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlWyd0b3BpY19yZWd4J10gPT0gdW5kZWZpbmVkIHx8IGxvY2FsU3RvcmFnZVsndG9waWNfcmVneCddID09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoY29tbW9uLmRlYWxSZWd4KGxvY2FsU3RvcmFnZVsndG9waWNfcmVneCddLCB0b3BpYykpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVnKTtcbiAgICAgICAgICAgIHZhciBzdHIgPSBsb2NhbFN0b3JhZ2VbJ3RvcGljcyddO1xuICAgICAgICAgICAgdmFyIGFyciA9IHJlZy5leGVjKHN0cik7XG4gICAgICAgICAgICBpZiAoYXJyICE9IG51bGwgJiYgYXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogYXJyWzBdLFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFyclsxXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDojrflj5bpopjnm67kv6Hmga9cbiAgICAgKiBAcGFyYW0geyp9IGVsVG9waWMgXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VG9waWNNc2coZWxUb3BpYykge1xuICAgICAgICB2YXIgbXNnID0ge307XG4gICAgICAgIG1zZy50b3BpYyA9IGVsVG9waWMucXVlcnlTZWxlY3RvcignZGl2LmNsZWFyZml4JykuaW5uZXJIVE1MO1xuICAgICAgICBtc2cudHlwZSA9IHN3aXRjaFRvcGljVHlwZShjb21tb24uc3Vic3RyRXgobXNnLnRvcGljLCAn44CQJywgJ+OAkScpKTtcbiAgICAgICAgbXNnLnRvcGljID0gcmVtb3ZlSFRNTChtc2cudG9waWMuc3Vic3RyaW5nKG1zZy50b3BpYy5pbmRleE9mKCfjgJEnKSArIDEpKTtcbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlpITnkIbnrKblj7dcbiAgICAgKiBAcGFyYW0geyp9IHRvcGljIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlYWxTeW1ib2wodG9waWMpIHtcbiAgICAgICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKCfvvIwnLCAnLCcpO1xuICAgICAgICB0b3BpYyA9IHRvcGljLnJlcGxhY2UoJ++8iCcsICcoJyk7XG4gICAgICAgIHRvcGljID0gdG9waWMucmVwbGFjZSgn77yJJywgJyknKTtcbiAgICAgICAgdG9waWMgPSB0b3BpYy5yZXBsYWNlKCfvvJ8nLCAnPycpO1xuICAgICAgICB0b3BpYyA9IHRvcGljLnJlcGxhY2UoJ++8micsICc6Jyk7XG4gICAgICAgIHRvcGljID0gdG9waWMucmVwbGFjZSgvW+KAnOKAnV0vZywgJ1wiJyk7XG4gICAgICAgIHJldHVybiB0b3BpYztcbiAgICB9XG4gICAgLyoqIFxuICAgICAqIOWkhOeQhmh0bWzmupDnoIHojrflj5bpopjnm67kv6Hmga9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWFsSFRNTFRvcGljKGRhdGEpIHtcbiAgICAgICAgdmFyIHJlZ3ggPSAv44CQKC4qPynjgJEoW1xcc1xcU10qPyk8XFwvZGl2PihbXFxTXFxzXSo/KTxkaXYgY2xhc3M9XCJQeV9hbnN3ZXIgY2xlYXJmaXhcIj5bXFxzXFxTXSo/W+ato+ehruetlOahiO+8mnzmiJHnmoTnrZTmoYjvvJpdKFtcXHNcXFNdKj8pPGkgY2xhc3M9XCJmciAoLio/KVwiPjxcXC9pPi9nO1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICB2YXIgcmV0SnNvbiA9IG5ldyBBcnJheSgpO1xuICAgICAgICB3aGlsZSAocmVzdWx0ID0gcmVneC5leGVjKGRhdGEpKSB7XG4gICAgICAgICAgICAvL+WIpOaWreaYr+S4jeaYr+acieato+ehruetlOahiOeahOaYvuekuizlpoLmnpzmnInmraPnoa7nrZTmoYgs5bCx5aSE55CG5q2j56Gu562U5qGIXG4gICAgICAgICAgICAvL+WkqumavuWkhOeQhuS6hizlt7LliIfmjaLmiJBkb2N1bWVudOeahOW9ouW8j1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5pbnB1dC5pbmRleE9mKCc8c3Bhbj7mraPnoa7nrZTmoYjvvJonKSA8IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WzVdICE9ICdkdWknKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0bXBKc29uID0gZGVhbFRvcGljTXNnKHJlc3VsdCk7XG4gICAgICAgICAgICByZXRKc29uLnB1c2godG1wSnNvbik7XG4gICAgICAgICAgICAvLyB2YXIgdG1wSnNvbiA9IHt9O1xuICAgICAgICAgICAgLy8gaWYgKHJlc3VsdC5pbnB1dC5pbmRleE9mKCc+5q2j56Gu562U5qGI77yaJykgPiAwKSB7XG4gICAgICAgICAgICAvLyAgICAgcmVzdWx0WzRdID0gcmVzdWx0WzNdO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICBpZiAocmVzdWx0WzVdICE9ICdkdWknKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICByZXN1bHRbNF0gKz0gJzwvZGl2Pic7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyB0bXBKc29uID0gZGVhbFRvcGljTXNnKHJlc3VsdCk7XG4gICAgICAgICAgICAvLyByZXRKc29uLnB1c2godG1wSnNvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cocmV0SnNvbik7XG4gICAgICAgIC8v5o+Q5Lqk5pWw5o2uXG4gICAgICAgIGNvbW1vbi5wb3N0KG1vb2NTZXJ2ZXIudXJsICsgJ2Fuc3dlcicsIEpTT04uc3RyaW5naWZ5KHJldEpzb24pKTtcbiAgICB9XG4gICAgLyoqIFxuICAgICAqIOWOu+mZpGh0bWzmoIfnrb5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVIVE1MKGh0bWwpIHtcbiAgICAgICAgLy/lhYjlpITnkIZpbWfmoIfnrb5cbiAgICAgICAgdmFyIGltZ1JlcGxhY2UgPSAvPGltZyAuKj9zcmM9XCIoLio/KVwiLio/Pi9nO1xuICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKGltZ1JlcGxhY2UsICckMScpO1xuICAgICAgICB2YXIgcmV2SHRtbCA9IC88Lio/Pi9nO1xuICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKHJldkh0bWwsICcnKTtcbiAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvKF5cXHMrKXwoXFxzKyQpL2csICcnKTtcbiAgICAgICAgaHRtbCA9IGRlYWxTeW1ib2woaHRtbCk7XG4gICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoLyZuYnNwOy9nLCAnICcpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlpITnkIbpopjnm67kv6Hmga9cbiAgICAgKiBAcGFyYW0geyp9IHJlZ3hEYXRhIFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlYWxUb3BpY01zZyhyZWd4RGF0YSkge1xuICAgICAgICB2YXIgbXNnID0ge307XG4gICAgICAgIC8v5Y676ZmkaHRtbOagh+etvlxuICAgICAgICB2YXIgcmV2SHRtbCA9IC88Lio/Pi9nO1xuICAgICAgICBtc2cudG9waWMgPSByZW1vdmVIVE1MKHJlZ3hEYXRhWzJdKTtcbiAgICAgICAgbXNnLnR5cGUgPSBzd2l0Y2hUb3BpY1R5cGUocmVneERhdGFbMV0pO1xuICAgICAgICBpZiAobXNnLnR5cGUgPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8v5aSE55CG562U5qGI5Z2XXG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIHZhciBjb3JyZWN0ID0gW107XG4gICAgICAgIGlmIChtc2cudHlwZSA8PSAzKSB7XG4gICAgICAgICAgICAvL+WkhOeQhuetlOahiFxuICAgICAgICAgICAgdmFyIGFuc3dlclJlZ3ggPSAvPGkgY2xhc3M9XCJmbFwiPiguKj8pPFxcL2k+W1xcc1xcU10qP3N0eWxlPVwid29yZC1icmVhazogYnJlYWstYWxsO3RleHQtZGVjb3JhdGlvbjogbm9uZTtcIj4oLio/KTxcXC9hPi9nO1xuICAgICAgICAgICAgcmVneERhdGFbNF0gPSByZW1vdmVIVE1MKHJlZ3hEYXRhWzRdLnN1YnN0cmluZygwLCByZWd4RGF0YVs0XS5pbmRleE9mKCc8L3NwYW4+JykpKTtcbiAgICAgICAgICAgIGlmIChtc2cudHlwZSA9PSAzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IHJlZ3hEYXRhWzRdLmluZGV4T2YoJ++8micpO1xuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZWd4RGF0YVs0XSA9IHJlZ3hEYXRhWzRdLnN1YnN0cmluZyhwb3MgKyAxLCBwb3MgKyAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVneERhdGFbNF0gPSAocmVneERhdGFbNF0gPT0gJ8OXJyA/IGZhbHNlIDogdHJ1ZSlcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gW3tcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uOiByZWd4RGF0YVs0XSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVneERhdGFbNF1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0ID0gYW5zd2VyUmVneC5leGVjKHJlZ3hEYXRhWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uID0gcmVzdWx0WzFdLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbjogb3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVtb3ZlSFRNTChyZXN1bHRbMl0pXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWd4RGF0YVs0XS5pbmRleE9mKG9wdGlvbikgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdC5wdXNoKGFuc3dlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKGFuc3dlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1zZy50eXBlID09IDQpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJSZWd4ID0gL+esrCguKj8p56m6W1xcc1xcU10qPzxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPihbXFxzXFxTXSo/KTwvZztcbiAgICAgICAgICAgIHJlZ3hEYXRhWzRdICs9ICc8JztcbiAgICAgICAgICAgIHdoaWxlIChyZXN1bHQgPSBhbnN3ZXJSZWd4LmV4ZWMocmVneERhdGFbNF0gKyAnPCcpKSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uOiByZXN1bHRbMV0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlbW92ZUhUTUwocmVzdWx0WzJdKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5aSW6KeC5paH5Lu255qE5omp5bGV5ZCN5Li6KCAgICnjgIJcbiAgICAgICAgLy/lpJbop4Lmlofku7bnmoTmianlsZXlkI3kuLooICAgKeOAglxuICAgICAgICBtc2cuYW5zd2VycyA9IGFuc3dlcnM7XG4gICAgICAgIG1zZy5jb3JyZWN0ID0gY29ycmVjdDtcbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDpopjnm67nsbvlnotcbiAgICAgKiBAcGFyYW0geyp9IHR5cGVUdGlsZSBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzd2l0Y2hUb3BpY1R5cGUodHlwZVR0aWxlKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZVR0aWxlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ+WNlemAiemimCc6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAn5aSa6YCJ6aKYJzpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICfliKTmlq3popgnOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IDM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ+Whq+epuumimCc6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gNDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn0iLCJjb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgbWQ1ID0gcmVxdWlyZShcIm1kNVwiKTtcbmNvbnN0IGNyZWF0ZUJ0biA9IGNvbW1vbi5jcmVhdGVCdG47XG5jb25zdCBnZXQgPSBjb21tb24uZ2V0O1xuXG4vKipcbiAqIOinhumikeaTjeS9nOaooeWdl1xuICogQHBhcmFtIHsqfSBfdGhpcyBcbiAqIEBwYXJhbSB7Kn0gZWxMb2dvIFxuICogQHBhcmFtIHsqfSBpbmRleCBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoX3RoaXMsIGVsTG9nbywgaW5kZXgpIHtcbiAgICAvL+iOt+WPluimgeaTjeS9nOeahOWvueixoeWSjOinhumikWlkXG4gICAgdmFyIHdpZCA9IF90aGlzLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaWZyYW1lJylbaW5kZXhdLmNvbnRlbnRXaW5kb3c7XG4gICAgdmFyIGRvYyA9IF90aGlzLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaWZyYW1lJylbaW5kZXhdLmNvbnRlbnREb2N1bWVudDtcbiAgICB2YXIgb2JqSWQgPSBfdGhpcy5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lmcmFtZScpW2luZGV4XS5nZXRBdHRyaWJ1dGUoJ29iamVjdGlkJyk7XG4gICAgdmFyIGlmcmFtZSA9IF90aGlzLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaWZyYW1lJylbaW5kZXhdO1xuICAgIC8v6KeG6aKR55qE5L+h5oGv5ZKM6aKY55uuXG4gICAgdmFyIHZpZGVvVG9waWMgPSB7fTtcbiAgICB2YXIgdmlkZW9JbmZvID0ge307XG4gICAgLy/lnKjmoYbmnrblhoXms6jlhaVqc1xuICAgIGNvbW1vbi5pbmplY3RlZChkb2MsICdhY3Rpb24uanMnKTtcbiAgICAvL+abtOaNonN3ZuaSreaUvuWZqFxuICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb2JqZWN0Jyk7XG4gICAgICAgIGlmIChvYmoubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy/lvIDlp4vph43mlrDliqDovb1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgd2lkLnJlbW92ZU9sZFBsYXllcihvYmpbMF0pO1xuICAgICAgICB9XG4gICAgfSwgMjAwKTtcbiAgICAvL+WIm+W7uuWQhOS4quaMiemSrlxuICAgIHZhciBoYW5nX2J0biA9IGNyZWF0ZUJ0bign5byA5aeL5oyC5py6Jyk7XG4gICAgaGFuZ19idG4uaWQgPSAnYWN0aW9uLWJ0bic7XG4gICAgaGFuZ19idG4udmFsdWUgPSBpbmRleDtcbiAgICBoYW5nX2J0bi50aXRsZSA9IFwi55u05o6l5byA5aeLXCI7XG4gICAgZWxMb2dvLmFwcGVuZENoaWxkKGhhbmdfYnRuKTtcbiAgICBoYW5nX2J0bi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ2NvbmZpZyddKTtcbiAgICAgICAgaWYgKGNvbmZpZ1snYXV0byddKSB7XG4gICAgICAgICAgICAvL+WFqOiHquWKqOaMguacuuW8gOWni1xuICAgICAgICAgICAgLy/liKTmlq3lrozmiJDnmoTku7vliqHngrlcbiAgICAgICAgICAgIHZhciBhbnMgPSBfdGhpcy5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYW5zLWpvYi1pY29uJyk7XG4gICAgICAgICAgICBpZiAoYW5zW2luZGV4XS5wYXJlbnROb2RlLmNsYXNzTmFtZS5pbmRleE9mKCdhbnMtam9iLWZpbmlzaGVkJykgPj0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChhbnMubGVuZ3RoID4gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0QWN0aW9uID0gYW5zW2luZGV4ICsgMV0uZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHRBY3Rpb24uY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21tb24uc3dpdGNoVGFzaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5nX2J0bi5pbm5lclRleHQgPSAn5oyC5py65LitLi4uJztcbiAgICAgICAgICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAod2lkLm1vbml0b3JQbGF5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgICAgICAgICAgd2lkLm1vbml0b3JQbGF5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pKt5pS+5a6M5oiQXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3ZlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKTmlq3mnInmsqHmnInkuIvkuIDkuKos6Ieq5Yqo6L+b6KGM5LiL5LiA5Liq5Lu75YqhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFucy5sZW5ndGggPiBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ngrnlh7tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRBY3Rpb24gPSBhbnNbaW5kZXggKyAxXS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEFjdGlvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bey57uP5piv5pyA5ZCO5LiA5LiqLOWIh+aNouS7u+WKoVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tb24uc3dpdGNoVGFzaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNvbmZpZ1snaW50ZXJ2YWwnXSAqIDEwMDAgKiA2MCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vVE9ETzp3aWQubW9uaXRvclBsYXkg6YeN5aSN5aSa5L2Z55qEIOS7peWQjuWPr+S7peWOu+aOiVxuICAgICAgICAgICAgaWYgKHdpZC5tb25pdG9yUGxheSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3aWQubW9uaXRvclBsYXkodW5kZWZpbmVkLCBjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb25pdG9yUGxheSh1bmRlZmluZWQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2YXIgaGFuZ19tb2RlXzIgPSBjcmVhdGVCdG4oJ+aMguacuuaooeW8jzIoYmF0ZSknKTtcbiAgICAvLyBoYW5nX21vZGVfMi5zdHlsZS5iYWNrZ3JvdW5kID0gJyNGNTdDMDAnO1xuICAgIC8vIGhhbmdfbW9kZV8yLnRpdGxlID0gXCLov5jlnKjmtYvor5XkuK0s5LiN55+l6YGT5pyJ5LuA5LmI5qC355qE6aOO6ZmpLOasoui/juWPjemmiCzlpoLmnpzog73miJAs5bCG5Zyo5YWo6Ieq5Yqo5oyC5py66L+I5Ye65LiA5aSn5q2lXl9eXCI7XG4gICAgLy8gZWxMb2dvLmFwcGVuZENoaWxkKGhhbmdfbW9kZV8yKTtcblxuICAgIHZhciBib29tID0gY3JlYXRlQnRuKCfnp5Lov4fop4bpopEnKTtcbiAgICBib29tLnN0eWxlLmJhY2tncm91bmQgPSAnI0Y1N0MwMCc7XG4gICAgYm9vbS50aXRsZSA9IFwi56eS6L+H6KeG6aKR5Lya6KKr5ZCO5Y+w5qOA5rWL5YiwXCI7XG4gICAgYm9vbS52YWx1ZSA9IGluZGV4O1xuICAgIGVsTG9nby5hcHBlbmRDaGlsZChib29tKTtcblxuICAgIC8v6I635Y+W5Y+C5pWwXG4gICAgdmFyIF9pbmRleCA9IDA7XG4gICAgdmFyIG1BcmcgPSBfdGhpcy5jb250ZW50RG9jdW1lbnQuYm9keS5pbm5lckhUTUw7XG4gICAgbUFyZyA9ICd7JyArIGNvbW1vbi5zdWJzdHJFeChtQXJnLCAnbUFyZyA9IHsnLCAnOycpO1xuICAgIG1BcmcgPSBKU09OLnBhcnNlKG1BcmcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbUFyZy5hdHRhY2htZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobUFyZy5hdHRhY2htZW50c1tpXS5vYmplY3RJZCA9PSBvYmpJZCkge1xuICAgICAgICAgICAgX2luZGV4ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOiOt+WPlumimOebruWIl+ihqFxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2sgXG4gICAgICovXG4gICAgdmFyIGdldFZpZGVvVG9waWMgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHZpZGVvVG9waWMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sodmlkZW9Ub3BpYyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gbUFyZy5hdHRhY2htZW50c1tfaW5kZXhdLm1pZCA9ICcxMzY5OTcxNzA0MTA4MTQyNjUwODYzNjUyOCc7XG4gICAgICAgIGdldCgnL3JpY2h2aWRlby9pbml0ZGF0YXdpdGh2aWV3ZXI/JnN0YXJ0PXVuZGVmaW5lZCZtaWQ9JyArXG4gICAgICAgICAgICBtQXJnLmF0dGFjaG1lbnRzW19pbmRleF0ubWlkKS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb1RvcGljID0ganNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDojrflj5bop4bpopHkv6Hmga9cbiAgICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrIFxuICAgICAqL1xuICAgIHZhciBnZXRWaWRlb0luZm8gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHZpZGVvSW5mby5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh2aWRlb0luZm8pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdldCgnL2FuYW5hcy9zdGF0dXMvJyArIG1BcmcuYXR0YWNobWVudHNbX2luZGV4XS5vYmplY3RJZCArXG4gICAgICAgICAgICAnP2s9MzE4Jl9kYz0nICsgRGF0ZS5wYXJzZShuZXcgRGF0ZSgpKSkub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlkZW9JbmZvID0ganNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgY3JlYXRlRGl2ID0gZnVuY3Rpb24gKHRpdGxlKSB7XG4gICAgICAgIHZhciBkaXZFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXZFbC5zdHlsZS5jb2xvciA9IFwiI2ZmMDEwMVwiO1xuICAgICAgICBkaXZFbC5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgICAgIGRpdkVsLmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICByZXR1cm4gZGl2RWw7XG4gICAgfVxuICAgIC8v6I635Y+W5q2j56Gu562U5qGIXG4gICAgdmFyIGdldFRydWVBbnN3ZXIgPSBmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICB2YXIgcmlnaHQgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobGlzdFtpXS5pc1JpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgKz0gJzxzcGFuIHN0eWxlPVwibWFyZ2luLWxlZnQ6NnB4O1wiPicgKyBsaXN0W2ldLm5hbWUgKyBcIjpcIiArIGxpc3RbaV0uZGVzY3JpcHRpb24gKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJpZ2h0ICE9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICfmsqHmnInmib7liLDnrZTmoYgo5rKh5pyJLOWHumJ1Z+S6hj8/PyknO1xuICAgIH1cbiAgICAvL+WxleekuumimOebruetlOahiFxuICAgIGdldFZpZGVvVG9waWMoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoY3JlYXRlRGl2KCfmnKzop4bpopHpopjnm67liJfooag6JykpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXIgPSBnZXRUcnVlQW5zd2VyKGRhdGFbaV0uZGF0YXNbMF0ub3B0aW9ucyk7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBcIumimOebrlwiICsgKGkgKyAxKSArIFwiOlwiICsgZGF0YVtpXS5kYXRhc1swXS5kZXNjcmlwdGlvbiArIFwiPGJyLz7nrZTmoYg6ICAgXCIgKyBhbnN3ZXI7XG4gICAgICAgICAgICB2YXIgZGl2RWwgPSBjcmVhdGVEaXYodGl0bGUpO1xuICAgICAgICAgICAgaWZyYW1lLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZGl2RWwpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgc2VuZF9hbnN3ZXJfcGFjayA9IGZ1bmN0aW9uIChyZXNvdXJjZWlkLCBhbnN3ZXIsIGNhbGxiYWNrKSB7XG4gICAgICAgIGdldCgnL3JpY2h2aWRlby9xdj9yZXNvdXJjZWlkPScgKyByZXNvdXJjZWlkICsgXCImYW5zd2VyPSdcIiArIGFuc3dlciArIFwiJ1wiKS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGpzb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5oyC5py657G7XG4gICAgICovXG4gICAgdmFyIGhhbmcgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZhciBfaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgICBpZiAocmVzLnByb21wdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF9pbnN0YW5jZS5wcm9tcHQgPSByZXMucHJvbXB0O1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aW1lciA9IDA7XG4gICAgICAgIHZhciB0aW1lID0gMDtcbiAgICAgICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uIChzdGFydF90aW1lID0gMCkge1xuICAgICAgICAgICAgc3RhcnRfdGltZSA9IHBhcnNlSW50KHN0YXJ0X3RpbWUgPT0gbnVsbCA/IDAgOiBzdGFydF90aW1lKTtcbiAgICAgICAgICAgIHZhciBiZWdpbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcFRpbWUgPSAodGltZSArIHN0YXJ0X3RpbWUpO1xuICAgICAgICAgICAgICAgIC8v5Yik5pat6aKY55uuLOeEtuWQjuWHj+S4qjUtNuenklxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlkZW9Ub3BpYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlkZW9Ub3BpY1tpXS5kYXRhc1swXS5zdGFydFRpbWUgPT0gKHRtcFRpbWUpICYmIHZpZGVvVG9waWNbaV0uZGF0YXNbMF0uaXNBbnN3ZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb1RvcGljW2ldLmRhdGFzWzBdLmlzQW5zd2VyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWUgLT0gKDUgKyBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogNSkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aXtumXtOWIsOS6hizlm57nrZTpopjnm65cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdxcXEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXIgPSBnZXRUcnVlQW5zd2VyKHZpZGVvVG9waWNbaV0uZGF0YXNbMF0ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kX2Fuc3dlcl9wYWNrKHZpZGVvVG9waWNbaV0uZGF0YXNbMF0ucmVzb3VyY2VJZCwgYW5zd2VyLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8v5Yik5pat5byA5aeL5ZKM57uT5p2fXG4gICAgICAgICAgICAgICAgaWYgKHRpbWUgPD0gMCB8fCAodG1wVGltZSkgPj0gdmlkZW9JbmZvLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aW1lID4gMCB8fCAhYmVnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFZpZGVvSW5mbyhmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRtcFRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRfdGltZV9wYWNrKHRtcFRpbWUsIGZ1bmN0aW9uIChyZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaW5zdGFuY2Uuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pbnN0YW5jZS5wcm9tcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2luc3RhbmNlLnByb21wdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRtcFRpbWUpID49IHZpZGVvSW5mby5kdXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbnN0YW5jZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pbnN0YW5jZS5wcm9tcHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbnN0YW5jZS5wcm9tcHQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRpbWUpO1xuICAgICAgICAgICAgICAgIHRpbWUgKz0gMTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8v5oyC5py65qih5byPMuaMiemSruS6i+S7tlxuICAgIHZhciBpbnN0YW5jZV9oYW5nID0gbmV3IGhhbmcoe1xuICAgICAgICBwcm9tcHQ6IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflt7Lnu4/pgJrov4fnmoTop4bpopEnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBhbGVydCgn6KeG6aKR5oyC5py65a6M5oiQJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfkuI3mmI7plJnor68nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gaGFuZ19tb2RlXzIub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgaWYgKGhhbmdfbW9kZV8yLmdldEF0dHJpYnV0ZSgnc3RhcnQnKSA9PSAndHJ1ZScpIHtcbiAgICAvLyAgICAgICAgIC8v5byA5aeL5YiZ5Li65pqC5YGcXG4gICAgLy8gICAgICAgICBoYW5nX21vZGVfMi5pbm5lclRleHQgPSBcIuaMguacuuaooeW8jzIoYmF0ZSlcIjtcbiAgICAvLyAgICAgICAgIGhhbmdfbW9kZV8yLnNldEF0dHJpYnV0ZSgnc3RhcnQnLCAnZmFsc2UnKTtcbiAgICAvLyAgICAgICAgIGluc3RhbmNlX2hhbmcuc3RvcCgpO1xuICAgIC8vICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgaGFuZ19tb2RlXzIuaW5uZXJUZXh0ID0gXCLlgZzmraLmjILmnLooYmF0ZSlcIjtcbiAgICAvLyAgICAgICAgIGhhbmdfbW9kZV8yLnNldEF0dHJpYnV0ZSgnc3RhcnQnLCAndHJ1ZScpO1xuICAgIC8vICAgICAgICAgaW5zdGFuY2VfaGFuZy5zdGFydChoYW5nX21vZGVfMi5nZXRBdHRyaWJ1dGUoJ3RpbWUnKSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgY29uc29sZS5sb2coXCLov5nmmK/kuIDkuKrlnKjmtYvor5XpmLbmrrXnmoTkuqfnialcIik7XG4gICAgLy8gfVxuXG4gICAgLyoqXG4gICAgICog5Y+R6YCB5LiA5Liq5pe26Ze05YyFXG4gICAgICogQHBhcmFtIHsqfSB0aW1lIFxuICAgICAqL1xuICAgIHZhciBzZW5kX3RpbWVfcGFjayA9IGZ1bmN0aW9uIChwbGF5VGltZSwgY2FsbGJhY2spIHtcbiAgICAgICAgZ2V0VmlkZW9JbmZvKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICB2YXIgZW5jID0gJ1snICsgbUFyZy5kZWZhdWx0cy5jbGF6eklkICsgJ11bJyArIG1BcmcuZGVmYXVsdHMudXNlcmlkICsgJ11bJyArXG4gICAgICAgICAgICAgICAgbUFyZy5hdHRhY2htZW50c1tfaW5kZXhdLnByb3BlcnR5Ll9qb2JpZCArICddWycgKyBtQXJnLmF0dGFjaG1lbnRzW19pbmRleF0ub2JqZWN0SWQgKyAnXVsnICtcbiAgICAgICAgICAgICAgICAocGxheVRpbWUgKiAxMDAwKS50b1N0cmluZygpICsgJ11bZF95SEohJHBkQX41XVsnICsgKGpzb24uZHVyYXRpb24gKiAxMDAwKS50b1N0cmluZygpICsgJ11bMF8nICtcbiAgICAgICAgICAgICAgICBqc29uLmR1cmF0aW9uICsgJ10nO1xuICAgICAgICAgICAgZW5jID0gbWQ1KGVuYyk7XG4gICAgICAgICAgICBnZXQoJy9tdWx0aW1lZGlhL2xvZy8nICsganNvbi5kdG9rZW4gKyAnP2NsaXBUaW1lPTBfJyArIGpzb24uZHVyYXRpb24gK1xuICAgICAgICAgICAgICAgICcmb3RoZXJJbmZvPScgKyBtQXJnLmF0dGFjaG1lbnRzW19pbmRleF0ub3RoZXJJbmZvICtcbiAgICAgICAgICAgICAgICAnJnVzZXJpZD0nICsgbUFyZy5kZWZhdWx0cy51c2VyaWQgKyAnJnJ0PTAuOSZqb2JpZD0nICsgbUFyZy5hdHRhY2htZW50c1tfaW5kZXhdLnByb3BlcnR5Ll9qb2JpZCArXG4gICAgICAgICAgICAgICAgJyZkdXJhdGlvbj0nICsganNvbi5kdXJhdGlvbiArICcmZHR5cGU9VmlkZW8mb2JqZWN0SWQ9JyArIG1BcmcuYXR0YWNobWVudHNbX2luZGV4XS5vYmplY3RJZCArXG4gICAgICAgICAgICAgICAgJyZjbGF6eklkPScgKyBtQXJnLmRlZmF1bHRzLmNsYXp6SWQgK1xuICAgICAgICAgICAgICAgICcmdmlldz1wYyZwbGF5aW5nVGltZT0nICsgcGxheVRpbWUgKyAnJmlzZHJhZz00JmVuYz0nICsgZW5jKS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpc1Bhc3NlZCA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGlzUGFzc2VkLmlzUGFzc2VkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8v56eS6L+H5oyJ6ZKu5LqL5Lu2XG4gICAgYm9vbS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlWydib29tX25vX3Byb21wdCddID09IHVuZGVmaW5lZCB8fCBsb2NhbFN0b3JhZ2VbJ2Jvb21fbm9fcHJvbXB0J10gIT0gMSkge1xuICAgICAgICAgICAgdmFyIG1zZyA9IHByb21wdCgn56eS6L+H6KeG6aKR5Lya5Lqn55Sf5LiN6Imv6K6w5b2VLOaYr+WQpue7p+e7rT/lpoLmnpzku6XlkI7kuI3mg7Plho3lvLnlh7rmnKzlr7nor53moYbor7flnKjkuIvmlrnloavlhpl5ZXMnKVxuICAgICAgICAgICAgaWYgKG1zZyA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKG1zZyA9PT0gJ3llcycpIGxvY2FsU3RvcmFnZVsnYm9vbV9ub19wcm9tcHQnXSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0VmlkZW9JbmZvKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICB2YXIgcGxheVRpbWUgPSBwYXJzZUludChqc29uLmR1cmF0aW9uIC0gTWF0aC5yYW5kb20oMSwgMikpO1xuICAgICAgICAgICAgc2VuZF90aW1lX3BhY2socGxheVRpbWUsIGZ1bmN0aW9uIChyZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmV0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+enkui/h+aIkOWKnyzliLfmlrDlkI7mn6XnnIvmlYjmnpwnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5pON5L2c5aSx6LSlLOmUmeivrycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb25pdG9yUGxheShwbGF5T3ZlciwgY29uZmlnKSB7XG4gICAgICAgIHZhciBkb2N1bWVudCA9IHdpZC5kb2N1bWVudDtcbiAgICAgICAgZnVuY3Rpb24gdW5zaG93T2NjbHVzaW9uKCkge1xuICAgICAgICAgICAgdmFyIHBsYXlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmpzLWJpZy1wbGF5LWJ1dHRvbicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGxheUJ0bik7XG4gICAgICAgICAgICBpZiAocGxheUJ0biAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGxheUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRtcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52anMtcG9zdGVyJyk7XG4gICAgICAgICAgICBpZiAodG1wICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0bXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcGxheWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3ZpZGVvX2h0bWw1X2FwaScpO1xuICAgICAgICAgICAgaWYgKHBsYXllciA9PSB1bmRlZmluZWQgfHwgcGxheWVyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog5a+5Y2Ru6L+b6KGM5aSE55CGXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2VbJ2NkbiddICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBwbGF5ZXIuc3JjO1xuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIodXJsLmluZGV4T2YoJy92aWRlby8nKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3JjID0gbG9jYWxTdG9yYWdlWydjZG4nXSArIHVybDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuc3JjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5pKt5pS+77yM6aG65L6/6K6p6YKj5Liq5oyJ6ZKu5ZKM55WM6Z2i5LiN5Y+v6KeBXG4gICAgICAgICAgICB1bnNob3dPY2NsdXNpb24oKTtcbiAgICAgICAgICAgIHBsYXkoKTtcbiAgICAgICAgICAgIHBsYXllci5vbnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwYXVzZScpO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuY3VycmVudFRpbWUgPD0gcGxheWVyLmR1cmF0aW9uIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWVyLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBjZG4gPSBwbGF5ZXIuY3VycmVudFNyYztcbiAgICAgICAgICAgICAgICBjZG4gPSBjZG4uc3Vic3RyKDAsIGNkbi5pbmRleE9mKCcvdmlkZW8vJywgMTApKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbJ2NkbiddID0gY2RuO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjZG4gY2hhbmdlICcgKyBjZG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGxheWVyLm9uZW5kZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCcpO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5T3ZlciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheU92ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBwbGF5KCkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIubXV0ZWQgPSBjb25maWcudmlkZW9fbXV0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5wbGF5YmFja1JhdGUgPSBjb25maWcudmlkZW9fbXVsdGlwbGU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDIwMCk7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=