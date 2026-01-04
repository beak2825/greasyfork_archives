// ==UserScript==
// @name         saasweb拦截调试工具-saasweb-devtool
// @namespace    npm/vue-router-tool
// @version      1.1.4
// @author       shixiaoshi
// @description  vue项目多路由切换；路径智能补全；saasweb生产界面调试本地服务。
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://*/*
// @match        http://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js
// @connect      localhost
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @noframes    
// @downloadURL https://update.greasyfork.org/scripts/455638/saasweb%E6%8B%A6%E6%88%AA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7-saasweb-devtool.user.js
// @updateURL https://update.greasyfork.org/scripts/455638/saasweb%E6%8B%A6%E6%88%AA%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7-saasweb-devtool.meta.js
// ==/UserScript==

(a=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=a,document.head.appendChild(e)})('.monkey-box-wrap[data-v-376271cc]{position:fixed;z-index:9999;background:rgba(255,255,255,.9);box-shadow:0 4px 8px #07111b33;border-radius:8px}.monkey-box-wrap[data-v-376271cc]:before{content:"";display:block;width:8px;height:8px;background:#fff;z-index:1900;position:absolute;transform:rotate(45deg);left:20px}.belowPart[data-v-376271cc]:before{bottom:-4px}.upPart[data-v-376271cc]:before{top:-4px}.message-enter-from[data-v-376271cc]{min-height:0px;opacity:0}.message-enter-active[data-v-376271cc],.message-leave-active[data-v-376271cc]{transition:all .2s ease-out}.message-leave-to[data-v-376271cc]{min-height:0;opacity:0}.router-wrap[data-v-dcd8eb21]{width:100%;padding:4px;max-height:200px;min-height:20px;overflow-y:auto;overflow-x:hidden;cursor:pointer}.router-wrap .router-item[data-v-dcd8eb21]{border-radius:3px;padding:4px;align-items:center;justify-content:space-between;display:flex;transition:all .1s linear}.router-wrap .router-item .left[data-v-dcd8eb21]{width:25px;height:25px;border-radius:5px;background:#fff;display:flex;justify-content:center;align-items:center;padding:2px;overflow:hidden;transition:padding .1s linear}.router-wrap .router-item .left[data-v-dcd8eb21]:hover{padding:5px;transition:padding .1s linear}.router-wrap .router-item .right[data-v-dcd8eb21]{flex:1;display:flex;flex-flow:column;justify-content:space-between;margin-left:4px;height:28px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.router-wrap .router-item .right .path-wrap[data-v-dcd8eb21]{line-height:14px;display:block;font-size:12px;color:#303133;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.router-wrap .router-item .right .name-wrap[data-v-dcd8eb21]{font-size:12px;line-height:12px;color:#c3c7cb}.router-wrap .router-item[data-v-dcd8eb21]:hover{transform:translate(3px);background:#EBEDF0;box-shadow:0 4px 8px #07111b1a}.monkey-setting-wrap[data-v-909a43a7]{padding:5px;max-height:400px;overflow-y:auto;font-size:13px;overflow-x:hidden;color:#373c43}.monkey-setting-wrap .switch-wrap[data-v-909a43a7]{border-radius:5px;height:24px;line-height:24px;padding:0 5px}.monkey-setting-wrap .switch-wrap .item-wrap[data-v-909a43a7]{display:flex;cursor:pointer;align-items:center;justify-content:space-between}.monkey-setting-wrap .switch-wrap .item-wrap .left[data-v-909a43a7]{display:flex;font-weight:500}.monkey-setting-wrap .switch-wrap .item-wrap .right[data-v-909a43a7]{width:30px;height:15px;background:#dcdfe6;border-radius:10px;display:flex;align-items:center;justify-content:flex-start;padding:0 2px;box-sizing:border-box}.monkey-setting-wrap .switch-wrap .item-wrap .right span[data-v-909a43a7]{height:12px;width:12px;background:#fff;display:block;border-radius:50%}.monkey-setting-wrap .switch-wrap .item-wrap .select[data-v-909a43a7]{justify-content:flex-end;background:#409eff;transition:all .2s linear}.monkey-setting-wrap .setting-wrap[data-v-909a43a7]{border-top:1px solid gainsboro;margin:5px}.monkey-setting-wrap .setting-wrap .item-wrap[data-v-909a43a7]{margin:5px 0;color:#606266;background:#F5F7FA;border-radius:2px;font-size:12px;padding:3px 0}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content[data-v-909a43a7]{margin-top:5px;padding:0;display:flex;align-items:center}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content label[data-v-909a43a7]{display:flex;align-items:center;padding-left:10px;width:70px}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content label input[data-v-909a43a7]{margin-right:5px}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content .input_text[data-v-909a43a7]{border:1px solid #ccc;padding:3px 5px;width:100%;color:#8d9399;background:#fff;border-radius:3px;box-sizing:border-box;-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content .input_text[data-v-909a43a7]:focus{border-color:#66afe9;outline:unset;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}.monkey-setting-wrap .setting-wrap .item-wrap .setting-content p[data-v-909a43a7]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monkey-setting-wrap .setting-wrap .item-wrap[data-v-909a43a7]:hover{border-bottom:1px solid #409eff}.monkey-setting-wrap .btn-wrap[data-v-909a43a7]{display:flex;justify-content:end;padding-right:5px;margin-top:10px}.monkey-setting-wrap .btn-wrap span[data-v-909a43a7]{display:inline-block;padding:0 10px;height:25px;border-radius:5px;text-align:center;line-height:25px;background-color:#0091ff;border-color:#0091ff;color:#fff;cursor:pointer}.monkey-setting-wrap .name[data-v-909a43a7]{display:flex;justify-content:space-between}.monkey-setting-wrap .name .clear[data-v-909a43a7]{color:#ac2f28;background-color:#fde3e2;border-radius:5px;font-size:12px;padding:0 5px;line-height:15px;cursor:pointer}.monkey-wrap[data-v-c9827b3a]{position:fixed;cursor:pointer;z-index:9999;user-select:none;background:rgba(255,255,255,.5);backdrop-filter:blur(10px);box-shadow:0 4px 8px #07111b1a;border-radius:8px;display:flex;align-items:center;padding:2px 5px;height:32px;right:auto}.monkey-wrap .v-drag-handle[data-v-c9827b3a]{cursor:move}.monkey-wrap .icon[data-v-c9827b3a]{width:16px;height:16px;display:inline-block;display:flex;justify-content:center;align-items:center;overflow:hidden;margin:0 5px}.monkey-wrap .monkey-home-wrap[data-v-c9827b3a]{overflow:hidden;display:flex;height:25px;align-items:center;border-radius:15px;color:#0065b3;background-color:#e1f2ff}.monkey-wrap .monkey-home-wrap .monkey-name-wrap[data-v-c9827b3a]{display:flex;min-width:80px;align-items:center}.monkey-wrap .monkey-home-wrap .monkey-name-wrap .monkey-arrow[data-v-c9827b3a]{width:10px;height:10px;display:flex;justify-content:center;align-items:center;transform:rotate(180deg);margin:2px 10px 0 5px;transition:transform .3s}.monkey-wrap .monkey-home-wrap .monkey-name-wrap .monkey-name[data-v-c9827b3a]{text-align:center;display:inline-block;margin:5px;font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.monkey-wrap .monkey-home-wrap .monkey-name-wrap:hover .monkey-arrow[data-v-c9827b3a]{transform:rotate(0);transition:transform .3s}.monkey-wrap .monkey-menu-wrap[data-v-c9827b3a]{display:flex;align-items:center}.proxy .monkey-home-wrap[data-v-c9827b3a]{background-color:#ffe6e6;color:#c00}.name-wrap-enter-active[data-v-c9827b3a]{transition:all .2s ease-out}.name-wrap-leave-active[data-v-c9827b3a]{transition:all .2s ease-in}.name-wrap-enter-from[data-v-c9827b3a]{transform:scale(.9);width:100%;opacity:0}.name-wrap-leave-to[data-v-c9827b3a]{transform:scale(.9);width:50%;opacity:0}.btn-wrap-enter-active[data-v-c9827b3a]{transition:all .2s ease-out}.btn-wrap-leave-active[data-v-c9827b3a]{transition:all .2s ease-in}.btn-wrap-enter-from[data-v-c9827b3a],.btn-wrap-leave-to[data-v-c9827b3a]{transform:translate(5px);opacity:0}');

(function(vue$1) {
  "use strict";
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_deleteValue = /* @__PURE__ */ (() => monkeyWindow.GM_deleteValue)();
  var GM_listValues = /* @__PURE__ */ (() => monkeyWindow.GM_listValues)();
  var GM_registerMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_registerMenuCommand)();
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const GM_setObject = function(name, value) {
    GM_setValue(name, JSON.stringify(value));
  };
  let mkApi = {};
  const keyList = [
    { key: "SAAS_WEB_DEBUG_INFO", default: {}, name: "saas_web\u8C03\u8BD5\u57FA\u7840\u4FE1\u606F" },
    { key: "SAAS_WEB_DEBUG_AVAILABLE", default: false, name: "saas_web\u8C03\u8BD5\u5F00\u542F\u72B6\u6001" },
    { key: "DEVTOOL_VISIBLE", default: false, name: "\u5F00\u53D1\u5DE5\u5177\u53EF\u89C1\u6027" },
    { key: "REFRESH", default: false, name: "\u6E05\u9664\u6240\u6709\u6D4F\u89C8\u5668\u7F13\u5B58\u5E76\u5237\u65B0\u9875\u9762" },
    { key: "BOX_TOP", default: 20, name: "\u5F39\u6846\u8DDD\u79BB\u9876\u90E8\u8DDD\u79BB" },
    { key: "BOX_LEFT", default: 50, name: "\u5F39\u6846\u8DDD\u79BB\u5DE6\u4FA7\u8DDD\u79BB" },
    {
      key: "URL_INFO",
      default: {
        path: "",
        name: "",
        fulUrl: "",
        pathName: "",
        select: "",
        port: ""
      },
      name: "\u50A8\u5B58\u5728\u6D4F\u89C8\u5668\u5185\u7684\u8DEF\u7531\u8DF3\u8F6C\u4FE1\u606F"
    },
    { key: "SEARCH_VALUE", default: [], name: "\u8DEF\u7531\u53C2\u6570" },
    { key: "ERROR_COUNT", default: 0, name: "\u9879\u76EE\u62A5\u9519\u6B21\u6570" },
    { key: "ACTIVE_PATHNAME", default: "", name: "\u5F53\u524D\u6FC0\u6D3B\u7684\u8C03\u8BD5\u4FE1\u606F" },
    { key: "ORIGIN_USER", default: "", name: "\u5F53\u524D\u6FC0\u6D3B\u7684\u8C03\u8BD5\u4FE1\u606F" }
  ];
  keyList.forEach((item) => {
    mkApi[item.key] = {};
    mkApi[item.key].get = function() {
      let value = GM_getValue(item.key, void 0);
      try {
        if (value == void 0)
          return item.default;
        return JSON.parse(value);
      } catch (e) {
        return item.default;
      }
    };
    mkApi[item.key].set = function(value) {
      GM_setValue(item.key, JSON.stringify(value));
    };
  });
  mkApi.registerMenuCommand = function() {
    let dev = mkApi.DEVTOOL_VISIBLE.get();
    let tip = dev ? "\u4EC5\u5F00\u53D1\u6A21\u5F0F\u542F\u7528\u6B64\u63D2\u4EF6" : "\u5728\u6240\u6709\u9875\u9762\u542F\u7528\u6B64\u63D2\u4EF6";
    GM_registerMenuCommand(tip, function() {
      mkApi.DEVTOOL_VISIBLE.set(!dev);
      unsafeWindow.location.reload();
    });
    GM_registerMenuCommand("\u91CD\u7F6E\u811A\u672C", function() {
      const list = GM_listValues();
      if (list.length > 0)
        list.forEach((res) => GM_deleteValue(res));
      unsafeWindow.location.reload();
    });
  };
  mkApi.GM_ajax = (url, data) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url,
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        },
        onload: function(response) {
          if (response.status == 200) {
            resolve(response.response);
          } else {
            reject(response);
          }
        }
      });
    });
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getAugmentedNamespace(n) {
    var f = n.default;
    if (typeof f == "function") {
      var a = function() {
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var main = {};
  var System = {};
  var Storage = {};
  var Crypto$1 = {};
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
    if (hasRequiredCore)
      return core.exports;
    hasRequiredCore = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory();
        }
      })(commonjsGlobal, function() {
        var CryptoJS = CryptoJS || function(Math2, undefined$1) {
          var crypto2;
          if (typeof window !== "undefined" && window.crypto) {
            crypto2 = window.crypto;
          }
          if (typeof self !== "undefined" && self.crypto) {
            crypto2 = self.crypto;
          }
          if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto2 = globalThis.crypto;
          }
          if (!crypto2 && typeof window !== "undefined" && window.msCrypto) {
            crypto2 = window.msCrypto;
          }
          if (!crypto2 && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
            crypto2 = commonjsGlobal.crypto;
          }
          if (!crypto2 && typeof commonjsRequire === "function") {
            try {
              crypto2 = require$$0;
            } catch (err) {
            }
          }
          var cryptoSecureRandomInt = function() {
            if (crypto2) {
              if (typeof crypto2.getRandomValues === "function") {
                try {
                  return crypto2.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {
                }
              }
              if (typeof crypto2.randomBytes === "function") {
                try {
                  return crypto2.randomBytes(4).readInt32LE();
                } catch (err) {
                }
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
          };
          var create = Object.create || function() {
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
          var Base = C_lib.Base = function() {
            return {
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
              create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },
              init: function() {
              },
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
              clone: function() {
                return this.init.prototype.extend(this);
              }
            };
          }();
          var WordArray = C_lib.WordArray = Base.extend({
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },
            toString: function(encoder) {
              return (encoder || Hex).stringify(this);
            },
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
            clamp: function() {
              var words = this.words;
              var sigBytes = this.sigBytes;
              words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
              words.length = Math2.ceil(sigBytes / 4);
            },
            clone: function() {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },
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
            stringify: function(wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            parse: function(utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            reset: function() {
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },
            _append: function(data) {
              if (typeof data == "string") {
                data = Utf8.parse(data);
              }
              this._data.concat(data);
              this._nDataBytes += data.sigBytes;
            },
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
            clone: function() {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          C_lib.Hasher = BufferedBlockAlgorithm.extend({
            cfg: Base.extend(),
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
              this.reset();
            },
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            update: function(messageUpdate) {
              this._append(messageUpdate);
              this._process();
              return this;
            },
            finalize: function(messageUpdate) {
              if (messageUpdate) {
                this._append(messageUpdate);
              }
              var hash = this._doFinalize();
              return hash;
            },
            blockSize: 512 / 32,
            _createHelper: function(hasher) {
              return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },
            _createHmacHelper: function(hasher) {
              return function(message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          var C_algo = C.algo = {};
          return C;
        }(Math);
        return CryptoJS;
      });
    })(core);
    return core.exports;
  }
  var x64Core = { exports: {} };
  var hasRequiredX64Core;
  function requireX64Core() {
    if (hasRequiredX64Core)
      return x64Core.exports;
    hasRequiredX64Core = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function(undefined$1) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          var C_x64 = C.x64 = {};
          C_x64.Word = Base.extend({
            init: function(high, low) {
              this.high = high;
              this.low = low;
            }
          });
          C_x64.WordArray = Base.extend({
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },
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
        return CryptoJS;
      });
    })(x64Core);
    return x64Core.exports;
  }
  var libTypedarrays = { exports: {} };
  var hasRequiredLibTypedarrays;
  function requireLibTypedarrays() {
    if (hasRequiredLibTypedarrays)
      return libTypedarrays.exports;
    hasRequiredLibTypedarrays = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          if (typeof ArrayBuffer != "function") {
            return;
          }
          var C = CryptoJS;
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
        return CryptoJS.lib.WordArray;
      });
    })(libTypedarrays);
    return libTypedarrays.exports;
  }
  var encUtf16 = { exports: {} };
  var hasRequiredEncUtf16;
  function requireEncUtf16() {
    if (hasRequiredEncUtf16)
      return encUtf16.exports;
    hasRequiredEncUtf16 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Utf16 = C_enc.Utf16BE = {
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
        return CryptoJS.enc.Utf16;
      });
    })(encUtf16);
    return encUtf16.exports;
  }
  var encBase64 = { exports: {} };
  var hasRequiredEncBase64;
  function requireEncBase64() {
    if (hasRequiredEncBase64)
      return encBase64.exports;
    hasRequiredEncBase64 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Base64 = {
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
        return CryptoJS.enc.Base64;
      });
    })(encBase64);
    return encBase64.exports;
  }
  var encBase64url = { exports: {} };
  var hasRequiredEncBase64url;
  function requireEncBase64url() {
    if (hasRequiredEncBase64url)
      return encBase64url.exports;
    hasRequiredEncBase64url = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          C_enc.Base64url = {
            stringify: function(wordArray, urlSafe = true) {
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
            parse: function(base64Str, urlSafe = true) {
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
        return CryptoJS.enc.Base64url;
      });
    })(encBase64url);
    return encBase64url.exports;
  }
  var md5 = { exports: {} };
  var hasRequiredMd5;
  function requireMd5() {
    if (hasRequiredMd5)
      return md5.exports;
    hasRequiredMd5 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
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
            var n = a + (b & c | ~b & d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function GG(a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          C.MD5 = Hasher._createHelper(MD5);
          C.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);
        return CryptoJS.MD5;
      });
    })(md5);
    return md5.exports;
  }
  var sha1 = { exports: {} };
  var hasRequiredSha1;
  function requireSha1() {
    if (hasRequiredSha1)
      return sha1.exports;
    hasRequiredSha1 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
                  var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                  W[i] = n << 1 | n >>> 31;
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
        return CryptoJS.SHA1;
      });
    })(sha1);
    return sha1.exports;
  }
  var sha256 = { exports: {} };
  var hasRequiredSha256;
  function requireSha256() {
    if (hasRequiredSha256)
      return sha256.exports;
    hasRequiredSha256 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var H = [];
          var K = [];
          (function() {
            function isPrime(n2) {
              var sqrtN = Math2.sqrt(n2);
              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n2 % factor)) {
                  return false;
                }
              }
              return true;
            }
            function getFractionalBits(n2) {
              return (n2 - (n2 | 0)) * 4294967296 | 0;
            }
            var n = 2;
            var nPrime = 0;
            while (nPrime < 64) {
              if (isPrime(n)) {
                if (nPrime < 8) {
                  H[nPrime] = getFractionalBits(Math2.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math2.pow(n, 1 / 3));
                nPrime++;
              }
              n++;
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
              var f = H2[5];
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
                var ch = e & f ^ ~e & g;
                var maj = a & b ^ a & c ^ b & c;
                var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
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
              H2[5] = H2[5] + f | 0;
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
        return CryptoJS.SHA256;
      });
    })(sha256);
    return sha256.exports;
  }
  var sha224 = { exports: {} };
  var hasRequiredSha224;
  function requireSha224() {
    if (hasRequiredSha224)
      return sha224.exports;
    hasRequiredSha224 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha256());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.SHA224;
      });
    })(sha224);
    return sha224.exports;
  }
  var sha512 = { exports: {} };
  var hasRequiredSha512;
  function requireSha512() {
    if (hasRequiredSha512)
      return sha512.exports;
    hasRequiredSha512 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.SHA512;
      });
    })(sha512);
    return sha512.exports;
  }
  var sha384 = { exports: {} };
  var hasRequiredSha384;
  function requireSha384() {
    if (hasRequiredSha384)
      return sha384.exports;
    hasRequiredSha384 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core(), requireSha512());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.SHA384;
      });
    })(sha384);
    return sha384.exports;
  }
  var sha3 = { exports: {} };
  var hasRequiredSha3;
  function requireSha3() {
    if (hasRequiredSha3)
      return sha3.exports;
    hasRequiredSha3 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
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
        return CryptoJS.SHA3;
      });
    })(sha3);
    return sha3.exports;
  }
  var ripemd160 = { exports: {} };
  var hasRequiredRipemd160;
  function requireRipemd160() {
    if (hasRequiredRipemd160)
      return ripemd160.exports;
    hasRequiredRipemd160 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        /** @preserve
          			(c) 2012 by Cédric Mesnil. All rights reserved.
        
          			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
        
          			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
          			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
        
          			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
          			*/
        (function(Math2) {
          var C = CryptoJS;
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
          function rotl(x, n) {
            return x << n | x >>> 32 - n;
          }
          C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })();
        return CryptoJS.RIPEMD160;
      });
    })(ripemd160);
    return ripemd160.exports;
  }
  var hmac = { exports: {} };
  var hasRequiredHmac;
  function requireHmac() {
    if (hasRequiredHmac)
      return hmac.exports;
    hasRequiredHmac = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C.algo;
          C_algo.HMAC = Base.extend({
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
            reset: function() {
              var hasher = this._hasher;
              hasher.reset();
              hasher.update(this._iKey);
            },
            update: function(messageUpdate) {
              this._hasher.update(messageUpdate);
              return this;
            },
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
    if (hasRequiredPbkdf2)
      return pbkdf2.exports;
    hasRequiredPbkdf2 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha1(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA1 = C_algo.SHA1;
          var HMAC = C_algo.HMAC;
          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA1,
              iterations: 1
            }),
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
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
        return CryptoJS.PBKDF2;
      });
    })(pbkdf2);
    return pbkdf2.exports;
  }
  var evpkdf = { exports: {} };
  var hasRequiredEvpkdf;
  function requireEvpkdf() {
    if (hasRequiredEvpkdf)
      return evpkdf.exports;
    hasRequiredEvpkdf = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha1(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var MD5 = C_algo.MD5;
          var EvpKDF = C_algo.EvpKDF = Base.extend({
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
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
        return CryptoJS.EvpKDF;
      });
    })(evpkdf);
    return evpkdf.exports;
  }
  var cipherCore = { exports: {} };
  var hasRequiredCipherCore;
  function requireCipherCore() {
    if (hasRequiredCipherCore)
      return cipherCore.exports;
    hasRequiredCipherCore = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEvpkdf());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.lib.Cipher || function(undefined$1) {
          var C = CryptoJS;
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
            cfg: Base.extend(),
            createEncryptor: function(key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },
            createDecryptor: function(key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },
            init: function(xformMode, key, cfg) {
              this.cfg = this.cfg.extend(cfg);
              this._xformMode = xformMode;
              this._key = key;
              this.reset();
            },
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            process: function(dataUpdate) {
              this._append(dataUpdate);
              return this._process();
            },
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
            _createHelper: function() {
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
            createEncryptor: function(cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },
            createDecryptor: function(cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },
            init: function(cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          var CBC = C_mode.CBC = function() {
            var CBC2 = BlockCipherMode.extend();
            CBC2.Encryptor = CBC2.extend({
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            CBC2.Decryptor = CBC2.extend({
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
            unpad: function(data) {
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
              data.sigBytes -= nPaddingBytes;
            }
          };
          C_lib.BlockCipher = Cipher.extend({
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
            init: function(cipherParams) {
              this.mixIn(cipherParams);
            },
            toString: function(formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          var C_format = C.format = {};
          var OpenSSLFormatter = C_format.OpenSSL = {
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
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),
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
            decrypt: function(cipher, ciphertext, key, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },
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
            execute: function(password, keySize, ivSize, salt) {
              if (!salt) {
                salt = WordArray.random(64 / 8);
              }
              var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4;
              return CipherParams.create({ key, iv, salt });
            }
          };
          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),
            encrypt: function(cipher, message, password, cfg) {
              cfg = this.cfg.extend(cfg);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
              cfg.iv = derivedParams.iv;
              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },
            decrypt: function(cipher, ciphertext, password, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
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
    if (hasRequiredModeCfb)
      return modeCfb.exports;
    hasRequiredModeCfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.mode.CFB = function() {
          var CFB = CryptoJS.lib.BlockCipherMode.extend();
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
        return CryptoJS.mode.CFB;
      });
    })(modeCfb);
    return modeCfb.exports;
  }
  var modeCtr = { exports: {} };
  var hasRequiredModeCtr;
  function requireModeCtr() {
    if (hasRequiredModeCtr)
      return modeCtr.exports;
    hasRequiredModeCtr = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.mode.CTR = function() {
          var CTR = CryptoJS.lib.BlockCipherMode.extend();
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
        return CryptoJS.mode.CTR;
      });
    })(modeCtr);
    return modeCtr.exports;
  }
  var modeCtrGladman = { exports: {} };
  var hasRequiredModeCtrGladman;
  function requireModeCtrGladman() {
    if (hasRequiredModeCtrGladman)
      return modeCtrGladman.exports;
    hasRequiredModeCtrGladman = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        /** @preserve
         * Counter block mode compatible with  Dr Brian Gladman fileenc.c
         * derived from CryptoJS.mode.CTR
         * Jan Hruby jhruby.web@gmail.com
         */
        CryptoJS.mode.CTRGladman = function() {
          var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
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
        return CryptoJS.mode.CTRGladman;
      });
    })(modeCtrGladman);
    return modeCtrGladman.exports;
  }
  var modeOfb = { exports: {} };
  var hasRequiredModeOfb;
  function requireModeOfb() {
    if (hasRequiredModeOfb)
      return modeOfb.exports;
    hasRequiredModeOfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.mode.OFB = function() {
          var OFB = CryptoJS.lib.BlockCipherMode.extend();
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
        return CryptoJS.mode.OFB;
      });
    })(modeOfb);
    return modeOfb.exports;
  }
  var modeEcb = { exports: {} };
  var hasRequiredModeEcb;
  function requireModeEcb() {
    if (hasRequiredModeEcb)
      return modeEcb.exports;
    hasRequiredModeEcb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.mode.ECB = function() {
          var ECB = CryptoJS.lib.BlockCipherMode.extend();
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
        return CryptoJS.mode.ECB;
      });
    })(modeEcb);
    return modeEcb.exports;
  }
  var padAnsix923 = { exports: {} };
  var hasRequiredPadAnsix923;
  function requirePadAnsix923() {
    if (hasRequiredPadAnsix923)
      return padAnsix923.exports;
    hasRequiredPadAnsix923 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.pad.AnsiX923 = {
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
        return CryptoJS.pad.Ansix923;
      });
    })(padAnsix923);
    return padAnsix923.exports;
  }
  var padIso10126 = { exports: {} };
  var hasRequiredPadIso10126;
  function requirePadIso10126() {
    if (hasRequiredPadIso10126)
      return padIso10126.exports;
    hasRequiredPadIso10126 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.pad.Iso10126 = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Iso10126;
      });
    })(padIso10126);
    return padIso10126.exports;
  }
  var padIso97971 = { exports: {} };
  var hasRequiredPadIso97971;
  function requirePadIso97971() {
    if (hasRequiredPadIso97971)
      return padIso97971.exports;
    hasRequiredPadIso97971 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.pad.Iso97971 = {
          pad: function(data, blockSize) {
            data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
            CryptoJS.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function(data) {
            CryptoJS.pad.ZeroPadding.unpad(data);
            data.sigBytes--;
          }
        };
        return CryptoJS.pad.Iso97971;
      });
    })(padIso97971);
    return padIso97971.exports;
  }
  var padZeropadding = { exports: {} };
  var hasRequiredPadZeropadding;
  function requirePadZeropadding() {
    if (hasRequiredPadZeropadding)
      return padZeropadding.exports;
    hasRequiredPadZeropadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.pad.ZeroPadding = {
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
        return CryptoJS.pad.ZeroPadding;
      });
    })(padZeropadding);
    return padZeropadding.exports;
  }
  var padNopadding = { exports: {} };
  var hasRequiredPadNopadding;
  function requirePadNopadding() {
    if (hasRequiredPadNopadding)
      return padNopadding.exports;
    hasRequiredPadNopadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        CryptoJS.pad.NoPadding = {
          pad: function() {
          },
          unpad: function() {
          }
        };
        return CryptoJS.pad.NoPadding;
      });
    })(padNopadding);
    return padNopadding.exports;
  }
  var formatHex = { exports: {} };
  var hasRequiredFormatHex;
  function requireFormatHex() {
    if (hasRequiredFormatHex)
      return formatHex.exports;
    hasRequiredFormatHex = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function(undefined$1) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C.enc;
          var Hex = C_enc.Hex;
          var C_format = C.format;
          C_format.Hex = {
            stringify: function(cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },
            parse: function(input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({ ciphertext });
            }
          };
        })();
        return CryptoJS.format.Hex;
      });
    })(formatHex);
    return formatHex.exports;
  }
  var aes = { exports: {} };
  var hasRequiredAes;
  function requireAes() {
    if (hasRequiredAes)
      return aes.exports;
    hasRequiredAes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.AES;
      });
    })(aes);
    return aes.exports;
  }
  var tripledes = { exports: {} };
  var hasRequiredTripledes;
  function requireTripledes() {
    if (hasRequiredTripledes)
      return tripledes.exports;
    hasRequiredTripledes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
                var f = 0;
                for (var i = 0; i < 8; i++) {
                  f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f;
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
        return CryptoJS.TripleDES;
      });
    })(tripledes);
    return tripledes.exports;
  }
  var rc4 = { exports: {} };
  var hasRequiredRc4;
  function requireRc4() {
    if (hasRequiredRc4)
      return rc4.exports;
    hasRequiredRc4 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
            for (var n = 0; n < 4; n++) {
              i = (i + 1) % 256;
              j = (j + S[i]) % 256;
              var t = S[i];
              S[i] = S[j];
              S[j] = t;
              keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
            }
            this._i = i;
            this._j = j;
            return keystreamWord;
          }
          C.RC4 = StreamCipher._createHelper(RC4);
          var RC4Drop = C_algo.RC4Drop = RC4.extend({
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
        return CryptoJS.RC4;
      });
    })(rc4);
    return rc4.exports;
  }
  var rabbit = { exports: {} };
  var hasRequiredRabbit;
  function requireRabbit() {
    if (hasRequiredRabbit)
      return rabbit.exports;
    hasRequiredRabbit = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.Rabbit;
      });
    })(rabbit);
    return rabbit.exports;
  }
  var rabbitLegacy = { exports: {} };
  var hasRequiredRabbitLegacy;
  function requireRabbitLegacy() {
    if (hasRequiredRabbitLegacy)
      return rabbitLegacy.exports;
    hasRequiredRabbitLegacy = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
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
        return CryptoJS.RabbitLegacy;
      });
    })(rabbitLegacy);
    return rabbitLegacy.exports;
  }
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy());
      }
    })(commonjsGlobal, function(CryptoJS) {
      return CryptoJS;
    });
  })(cryptoJs);
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(Crypto$1, "__esModule", { value: true });
  Crypto$1.Crypto = void 0;
  var crypto_js_1 = __importDefault(cryptoJs.exports);
  var Crypto = function() {
    function Crypto2(conf) {
      this._key = crypto_js_1.default.enc.Utf8.parse(conf.key);
      this._iv = crypto_js_1.default.enc.Utf8.parse(conf.iv);
    }
    Crypto2.prototype.Decrypt = function(text) {
      var encryptedHexStr = crypto_js_1.default.enc.Hex.parse(text);
      var srcs = crypto_js_1.default.enc.Base64.stringify(encryptedHexStr);
      var decrypt = crypto_js_1.default.AES.decrypt(srcs, this._key, { iv: this._iv, mode: crypto_js_1.default.mode.CBC, padding: crypto_js_1.default.pad.Pkcs7 });
      var decryptedStr = decrypt.toString(crypto_js_1.default.enc.Utf8);
      return decryptedStr.toString();
    };
    Crypto2.prototype.Encrypt = function(text) {
      var srcs = crypto_js_1.default.enc.Utf8.parse(text);
      var encrypted = crypto_js_1.default.AES.encrypt(srcs, this._key, { iv: this._iv, mode: crypto_js_1.default.mode.CBC, padding: crypto_js_1.default.pad.Pkcs7 });
      return encrypted.ciphertext.toString().toUpperCase();
    };
    return Crypto2;
  }();
  Crypto$1.Crypto = Crypto;
  Object.defineProperty(Storage, "__esModule", { value: true });
  Storage.SystemStorage = void 0;
  var Crypto_1 = Crypto$1;
  var SystemStorage = function() {
    function SystemStorage2(aes2) {
      this.key = localStorage.key;
      this.clear = localStorage.clear;
      this.removeItem = localStorage.removeItem;
      this.crypto = new Crypto_1.Crypto(aes2);
    }
    SystemStorage2.prototype.getItem = function(key) {
      var str = localStorage.getItem(key);
      return str ? this.crypto.Decrypt(str) : str;
    };
    SystemStorage2.prototype.setItem = function(key, str) {
      localStorage.setItem(key, typeof str === "string" ? this.crypto.Encrypt(str) : str);
    };
    Object.defineProperty(SystemStorage2.prototype, "length", {
      get: function() {
        return localStorage.length;
      },
      enumerable: false,
      configurable: true
    });
    return SystemStorage2;
  }();
  Storage.SystemStorage = SystemStorage;
  var js_cookie = { exports: {} };
  /*! js-cookie v3.0.1 | MIT */
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      function assign(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            target[key] = source[key];
          }
        }
        return target;
      }
      var defaultConverter = {
        read: function(value) {
          if (value[0] === '"') {
            value = value.slice(1, -1);
          }
          return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
        },
        write: function(value) {
          return encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent
          );
        }
      };
      function init(converter, defaultAttributes) {
        function set(key, value, attributes) {
          if (typeof document === "undefined") {
            return;
          }
          attributes = assign({}, defaultAttributes, attributes);
          if (typeof attributes.expires === "number") {
            attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
          }
          if (attributes.expires) {
            attributes.expires = attributes.expires.toUTCString();
          }
          key = encodeURIComponent(key).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
          var stringifiedAttributes = "";
          for (var attributeName in attributes) {
            if (!attributes[attributeName]) {
              continue;
            }
            stringifiedAttributes += "; " + attributeName;
            if (attributes[attributeName] === true) {
              continue;
            }
            stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
          }
          return document.cookie = key + "=" + converter.write(value, key) + stringifiedAttributes;
        }
        function get(key) {
          if (typeof document === "undefined" || arguments.length && !key) {
            return;
          }
          var cookies = document.cookie ? document.cookie.split("; ") : [];
          var jar = {};
          for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split("=");
            var value = parts.slice(1).join("=");
            try {
              var foundKey = decodeURIComponent(parts[0]);
              jar[foundKey] = converter.read(value, foundKey);
              if (key === foundKey) {
                break;
              }
            } catch (e) {
            }
          }
          return key ? jar[key] : jar;
        }
        return Object.create(
          {
            set,
            get,
            remove: function(key, attributes) {
              set(
                key,
                "",
                assign({}, attributes, {
                  expires: -1
                })
              );
            },
            withAttributes: function(attributes) {
              return init(this.converter, assign({}, this.attributes, attributes));
            },
            withConverter: function(converter2) {
              return init(assign({}, this.converter, converter2), this.attributes);
            }
          },
          {
            attributes: { value: Object.freeze(defaultAttributes) },
            converter: { value: Object.freeze(converter) }
          }
        );
      }
      var api = init(defaultConverter, { path: "/" });
      return api;
    });
  })(js_cookie);
  (function(exports) {
    var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.System = exports.ROUTERCACHE = exports.FUNCTION = exports.MAINTENANCESYSTEM = exports.FBMS = exports.GROUPCODE = exports.PERSAGYADMIN = exports.USER = exports.KEEP = exports.TIMER = void 0;
    var Storage_1 = Storage;
    var js_cookie_1 = __importDefault2(js_cookie.exports);
    exports.TIMER = "TIMER";
    exports.KEEP = 25 * 60 * 1e3;
    exports.USER = "USER";
    exports.PERSAGYADMIN = "PERSAGYADMIN";
    exports.GROUPCODE = "groupCode";
    exports.FBMS = "fbms";
    exports.MAINTENANCESYSTEM = "maintenancesystem";
    exports.FUNCTION = "function";
    exports.ROUTERCACHE = "routerCache";
    var System2 = function() {
      function System3(conf, dev) {
        if (dev === void 0) {
          dev = false;
        }
        this.storage = dev ? window.localStorage : new Storage_1.SystemStorage(conf);
      }
      System3.prototype.isAdmin = function() {
        return window.location.href.includes(exports.FBMS) || window.location.href.includes(exports.MAINTENANCESYSTEM);
      };
      System3.prototype.updateTime = function() {
        this.storage.setItem(exports.TIMER, (new Date().getTime() + exports.KEEP).toString());
        var groupCode = js_cookie_1.default.get(exports.GROUPCODE);
        if (groupCode) {
          js_cookie_1.default.set(exports.GROUPCODE, groupCode, { expires: 7, path: "/" });
        }
      };
      System3.prototype.valiteTime = function() {
        return true;
      };
      System3.prototype.saveUser = function(user) {
        try {
          var item = JSON.parse(user);
          var isAdmin = item.isAdmin === "1";
          var key = isAdmin ? exports.PERSAGYADMIN : exports.USER;
          this.storage.setItem(key, user);
          if (!(isAdmin && js_cookie_1.default.get(exports.GROUPCODE))) {
            js_cookie_1.default.set(exports.GROUPCODE, JSON.parse(user).groupCode, { expires: 7, path: "/" });
          }
        } catch (error) {
        }
      };
      System3.prototype.loginOut = function() {
        var isAdmin = this.isAdmin();
        localStorage.removeItem(isAdmin ? exports.PERSAGYADMIN : exports.USER);
        var user = this.storage.getItem(exports.USER);
        var admin = this.storage.getItem(exports.PERSAGYADMIN);
        if (!user && !admin) {
          js_cookie_1.default.remove(exports.GROUPCODE, { path: "/" });
        }
      };
      System3.prototype.queryUser = function() {
        var isAdmin = this.isAdmin();
        return this.storage.getItem(isAdmin ? exports.PERSAGYADMIN : exports.USER);
      };
      return System3;
    }();
    exports.System = System2;
  })(System);
  var Static = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get_replace_text_v3 = exports.get_replace_text = exports.get_static_urls_v3 = exports.get_static_urls = exports.get_externals_v3 = exports.get_externals = exports.FILES_V3 = exports.FILES = void 0;
    exports.FILES = [
      {
        "npm_name": "vue",
        "umd_name": "Vue2",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vue@2.7.14/dist/vue.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vue@2.7.14/dist/vue.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "vue-router",
        "umd_name": "VueRouter3",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vue-router@3.6.5/dist/vue-router.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vue-router@3.6.5/dist/vue-router.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "vuex",
        "umd_name": "Vuex3",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vuex@3.6.2/dist/vuex.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vuex@3.6.2/dist/vuex.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "moment",
        "umd_name": "moment",
        "local_src": {
          "js_src": [
            "https://unpkg.com/moment@2.25.3/min/moment.min.js",
            "https://www.unpkg.com/moment@2.25.3/locale/zh-cn.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/moment@2.25.3/min/moment.min.js",
            "https://www.unpkg.com/moment@2.25.3/locale/zh-cn.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "lodash",
        "umd_name": "_",
        "local_src": {
          "js_src": [
            "https://unpkg.com/lodash@4.17.21/lodash.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/lodash@4.17.21/lodash.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "echarts",
        "umd_name": "echarts",
        "local_src": {
          "js_src": [
            "https://unpkg.com/echarts@5.4.1/dist/echarts.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/echarts@5.4.1/dist/echarts.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "@antv/g2",
        "umd_name": "G2",
        "local_src": {
          "js_src": [
            "https://unpkg.com/@antv/g2@3.5.19/dist/g2.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/@antv/g2@3.5.19/dist/g2.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "highcharts",
        "umd_name": "Highcharts",
        "local_src": {
          "js_src": [
            "https://unpkg.com/highcharts@9.3.3/highcharts.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/highcharts@9.3.3/highcharts.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "qs",
        "umd_name": "Qs",
        "local_src": {
          "js_src": [
            "https://unpkg.com/qs@6.11.0/dist/qs.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/qs@6.11.0/dist/qs.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "dayjs",
        "umd_name": "dayjs",
        "local_src": {
          "js_src": [
            "https://unpkg.com/dayjs@1.11.7/dayjs.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/dayjs@1.11.7/dayjs.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "persagy-map",
        "umd_name": "persagy-map",
        "local_src": {
          "js_src": [
            "https://unpkg.com/persagy-map@1.1.97/lib/persagy-map.umd.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/persagy-map@1.1.97/lib/persagy-map.umd.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "vue-draggable-resizable",
        "umd_name": "VueDraggableResizable",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vue-draggable-resizable@2.3.0/dist/VueDraggableResizable.umd.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vue-draggable-resizable@2.3.0/dist/VueDraggableResizable.umd.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "vuedraggable",
        "umd_name": "vuedraggable",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vuedraggable@2.24.3/dist/vuedraggable.umd.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vuedraggable@2.24.3/dist/vuedraggable.umd.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "html2canvas",
        "umd_name": "html2canvas",
        "local_src": {
          "js_src": [
            "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "@antv/f2",
        "umd_name": "F2",
        "local_src": {
          "js_src": [
            "https://unpkg.com/@antv/f2@3.8.9/dist/f2.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/@antv/f2@3.8.9/dist/f2.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "ant-design-vue",
        "umd_name": "antd",
        "local_src": {
          "js_src": [
            "https://unpkg.com/ant-design-vue@1.7.8/dist/antd.min.js"
          ],
          "css_src": [
            "https://unpkg.com/ant-design-vue@1.7.8/dist/antd.min.css"
          ]
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/ant-design-vue@1.7.8/dist/antd.min.js"
          ],
          "css_src": [
            "https://unpkg.com/ant-design-vue@1.7.8/dist/antd.min.css"
          ]
        }
      },
      {
        "npm_name": "element-ui",
        "umd_name": "ELEMENT",
        "local_src": {
          "js_src": [
            "https://unpkg.com/element-ui@2.15.12/lib/index.js"
          ],
          "css_src": [
            "https://unpkg.com/element-ui@2.15.12/lib/theme-chalk/index.css"
          ]
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/element-ui@2.15.12/lib/index.js"
          ],
          "css_src": [
            "https://unpkg.com/element-ui@2.15.12/lib/theme-chalk/index.css"
          ]
        }
      },
      {
        "npm_name": "validator",
        "umd_name": "validator",
        "local_src": {
          "js_src": [
            "https://unpkg.com/validator@11.1.0/validator.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/validator@11.1.0/validator.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "meri-design",
        "umd_name": "meri-design",
        "local_src": {
          "js_src": [
            "https://unpkg.com/meri-design@1.4.8/dist/index.js"
          ],
          "css_src": [
            "https://unpkg.com/meri-design@1.4.8/dist/index.css"
          ]
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/meri-design@1.4.8/dist/index.js"
          ],
          "css_src": [
            "https://unpkg.com/meri-design@1.4.8/dist/index.css"
          ]
        }
      }
    ];
    exports.FILES_V3 = [
      {
        "npm_name": "vue",
        "umd_name": "Vue3",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vue@3.2.45/dist/vue.global.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vue@3.2.45/dist/vue.global.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "vue-router",
        "umd_name": "VueRouter4",
        "local_src": {
          "js_src": [
            "https://unpkg.com/vue-router@4.1.6/dist/vue-router.global.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/vue-router@4.1.6/dist/vue-router.global.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "lodash",
        "umd_name": "_",
        "local_src": {
          "js_src": [
            "https://unpkg.com/lodash@4.17.21/lodash.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/lodash@4.17.21/lodash.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "echarts",
        "umd_name": "echarts",
        "local_src": {
          "js_src": [
            "https://unpkg.com/echarts@5.4.1/dist/echarts.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/echarts@5.4.1/dist/echarts.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "qs",
        "umd_name": "Qs",
        "local_src": {
          "js_src": [
            "https://unpkg.com/qs@6.11.0/dist/qs.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/qs@6.11.0/dist/qs.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "dayjs",
        "umd_name": "dayjs",
        "local_src": {
          "js_src": [
            "https://unpkg.com/dayjs@1.11.7/dayjs.min.js"
          ],
          "css_src": []
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/dayjs@1.11.7/dayjs.min.js"
          ],
          "css_src": []
        }
      },
      {
        "npm_name": "meri-plus",
        "umd_name": "meri-plus",
        "local_src": {
          "js_src": [
            "https://unpkg.com/meri-plus@0.1.17/dist/meri.umd.js"
          ],
          "css_src": [
            "https://unpkg.com/meri-plus@0.1.17/theme/index.css",
            "https://unpkg.com/meri-plus@0.1.17/theme/theme.css"
          ]
        },
        "cnd_src": {
          "js_src": [
            "https://unpkg.com/meri-plus@0.1.17/dist/meri.umd.js"
          ],
          "css_src": [
            "https://unpkg.com/meri-plus@0.1.17/theme/index.css",
            "https://unpkg.com/meri-plus@0.1.17/theme/theme.css"
          ]
        }
      }
    ];
    var get_externals = function(ignores) {
      if (ignores === void 0) {
        ignores = [];
      }
      var o = {};
      for (var _i = 0, FILES_1 = exports.FILES; _i < FILES_1.length; _i++) {
        var file = FILES_1[_i];
        var npm_name = file.npm_name, umd_name = file.umd_name;
        if (!ignores.includes(umd_name))
          o[npm_name] = umd_name;
      }
      return o;
    };
    exports.get_externals = get_externals;
    var get_externals_v3 = function(ignores) {
      if (ignores === void 0) {
        ignores = [];
      }
      var o = {};
      for (var _i = 0, FILES_V3_1 = exports.FILES_V3; _i < FILES_V3_1.length; _i++) {
        var file = FILES_V3_1[_i];
        var npm_name = file.npm_name, umd_name = file.umd_name;
        if (!ignores.includes(umd_name))
          o[npm_name] = umd_name;
      }
      return o;
    };
    exports.get_externals_v3 = get_externals_v3;
    var get_static_urls = function(use_cdn) {
      var _a, _b, _c, _d;
      if (use_cdn === void 0) {
        use_cdn = true;
      }
      var cdn = {
        js_src: [],
        css_src: []
      };
      var local = {
        js_src: [],
        css_src: []
      };
      for (var _i = 0, FILES_2 = exports.FILES; _i < FILES_2.length; _i++) {
        var file = FILES_2[_i];
        var local_src = file.local_src, cnd_src = file.cnd_src;
        (_a = cdn.js_src).push.apply(_a, cnd_src.js_src);
        (_b = cdn.css_src).push.apply(_b, cnd_src.css_src);
        (_c = local.js_src).push.apply(_c, local_src.js_src);
        (_d = local.css_src).push.apply(_d, local_src.css_src);
      }
      return use_cdn ? cdn : local;
    };
    exports.get_static_urls = get_static_urls;
    var get_static_urls_v3 = function(use_cdn) {
      var _a, _b, _c, _d;
      if (use_cdn === void 0) {
        use_cdn = true;
      }
      var cdn = {
        js_src: [],
        css_src: []
      };
      var local = {
        js_src: [],
        css_src: []
      };
      for (var _i = 0, FILES_V3_2 = exports.FILES_V3; _i < FILES_V3_2.length; _i++) {
        var file = FILES_V3_2[_i];
        var local_src = file.local_src, cnd_src = file.cnd_src;
        (_a = cdn.js_src).push.apply(_a, cnd_src.js_src);
        (_b = cdn.css_src).push.apply(_b, cnd_src.css_src);
        (_c = local.js_src).push.apply(_c, local_src.js_src);
        (_d = local.css_src).push.apply(_d, local_src.css_src);
      }
      return use_cdn ? cdn : local;
    };
    exports.get_static_urls_v3 = get_static_urls_v3;
    var get_replace_text = function() {
      return "\n    <script>\n      window.Vue2 = window.Vue;\n      window.VueRouter3 = window.VueRouter;\n      window.Vuex3 = window.Vuex;\n      delete window.Vue;\n      delete window.VueRouter;\n      delete window.Vuex;\n    <\/script>\n    ";
    };
    exports.get_replace_text = get_replace_text;
    var get_replace_text_v3 = function() {
      return "\n    <script>\n      window.Vue3 = window.Vue;\n      window.VueRouter4 = window.VueRouter;\n      delete window.Vue;\n      delete window.VueRouter;\n    <\/script>\n    ";
    };
    exports.get_replace_text_v3 = get_replace_text_v3;
  })(Static);
  var Api = {};
  Object.defineProperty(Api, "__esModule", { value: true });
  Api.json_string_server_names = void 0;
  var json_string_server_names = function(serves) {
    var result = [
      "EMS_SaaS_Web",
      "ems-saas-web",
      "saas-version-app",
      "environment_saas_web",
      "isagy_saas_web",
      "hedy_lamarr",
      "engineeringsafety-saas-web",
      "equip-run-manager",
      "environment-saas-web",
      "budget-manage",
      "finein-saas-web",
      "energy-flow-web",
      "isagy-saas-research",
      "hedy-lamarr",
      "energy-efficiency"
    ];
    return result.concat(serves);
  };
  Api.json_string_server_names = json_string_server_names;
  (function(exports) {
    var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(System, exports);
    __exportStar(Crypto$1, exports);
    __exportStar(Storage, exports);
    __exportStar(Static, exports);
    __exportStar(Api, exports);
  })(main);
  const pathNameApi = {
    getSearchValue(baseUrl) {
      if (!location.href.includes("localhost"))
        return "";
      let searchValue = location.search ? location.search.slice(1) : "";
      let searchValueList = mkApi.SEARCH_VALUE.get();
      let findItem = null;
      if (searchValueList && (searchValueList == null ? void 0 : searchValueList.length) > 0) {
        findItem = searchValueList == null ? void 0 : searchValueList.find((res) => baseUrl.includes(res.serverName));
      }
      const valueApi = {
        saveValue(searchValue2) {
          if (!searchValue2)
            return;
          if (searchValueList.length === 0 || !findItem) {
            searchValueList.push({ serverName: baseUrl.replaceAll("/", ""), searchValue: searchValue2 });
          } else {
            findItem.searchValue = searchValue2;
          }
          mkApi.SEARCH_VALUE.set(searchValueList);
        },
        getValue(searchValue2) {
          if (searchValue2)
            return searchValue2;
          return findItem ? findItem.searchValue : "";
        }
      };
      valueApi.saveValue(searchValue);
      searchValue = valueApi.getValue(searchValue);
      return searchValue;
    },
    getFulUrl(url, searchValue) {
      let fulUrl = url;
      if (searchValue) {
        fulUrl += `?${searchValue}`;
      }
      return fulUrl;
    }
  };
  const smartJumpApi = {
    isUseSmartJump(urlInfo, routerArray) {
      if (!location.href.includes("localhost"))
        return false;
      if (routerArray.length === 0 && !urlInfo.fulUrl)
        return false;
      if (urlInfo.fulUrl && location.href === urlInfo.fulUrl)
        return false;
      return true;
    },
    jumpByCompleteUrl(findItem) {
      mkApi.URL_INFO.set(findItem);
      if (!location.search && location.href !== findItem.fulUrl) {
        location.href = findItem.fulUrl;
      }
    },
    jumpByUnCompleteUrl(urlInfo, routerArray) {
      if (!urlInfo.fulUrl)
        return this.jumpByRouterArrayFirstItem(routerArray);
      let isHavePathName = location.pathname && location.pathname !== "/";
      if (!isHavePathName)
        return location.href = urlInfo.fulUrl;
      let findItem = routerArray.find((res) => res.pathName === urlInfo.pathName);
      if (findItem) {
        location.href = urlInfo.fulUrl;
      } else {
        this.jumpByRouterArrayFirstItem(routerArray);
      }
    },
    jumpByRouterArrayFirstItem(routerArray) {
      if (routerArray.length > 0) {
        mkApi.URL_INFO.set(routerArray[0]);
        location.href = routerArray[0].fulUrl;
      }
    },
    smartJump() {
      const urlInfo = mkApi.URL_INFO.get();
      const routerArray = routerApi.getRouterArrayInfo();
      const jumpStatus = this.isUseSmartJump(urlInfo, routerArray);
      if (!jumpStatus)
        return;
      const isHavePathName = location.pathname && location.pathname !== "/";
      let findItem = routerArray.find((res) => res.pathName === location.pathname);
      const isCompleteUrl = isHavePathName && findItem;
      if (isCompleteUrl) {
        this.jumpByCompleteUrl(findItem);
      } else {
        this.jumpByUnCompleteUrl(urlInfo, routerArray);
      }
    }
  };
  const routerApi = {
    getRouterDomInfo() {
      var _a, _b, _c, _d, _e, _f, _g;
      let vueApp;
      const __vue__ = document.body.querySelector("div");
      const child__vue__ = document.body.querySelector("div #app");
      vueApp = child__vue__ || __vue__;
      let rawBaseUrl = (_d = (_c = (_b = (_a = vueApp == null ? void 0 : vueApp.__vue__) == null ? void 0 : _a.$router) == null ? void 0 : _b.options) == null ? void 0 : _c.base) != null ? _d : "";
      let baseUrl = rawBaseUrl.replaceAll("//", "/");
      if (rawBaseUrl.startsWith("/"))
        baseUrl = baseUrl.substring(1);
      if (rawBaseUrl.endsWith("/"))
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
      let $router = (_g = (_f = (_e = vueApp == null ? void 0 : vueApp.__vue__) == null ? void 0 : _e.$router) == null ? void 0 : _f.options) == null ? void 0 : _g.routes;
      if (($router == null ? void 0 : $router.length) > 0) {
        $router = $router.filter((res) => !res.path.includes(":"));
      }
      return {
        baseUrl,
        routerList: $router
      };
    },
    getRouterArrayInfo() {
      const { baseUrl, routerList } = this.getRouterDomInfo();
      const searchValue = pathNameApi.getSearchValue(baseUrl);
      const routerArray = (routerList == null ? void 0 : routerList.map((res) => {
        var _a, _b, _c, _d, _e, _f;
        const path = res.path ? res.path.replaceAll("//", "/") : "";
        let url = `${location.protocol}//${location.host}/${baseUrl}${path}`;
        const pathName = `/${baseUrl}${path}`.replaceAll("//", "/");
        return {
          path,
          name: (_f = (_e = (_d = (_b = res.title) != null ? _b : (_a = res == null ? void 0 : res.meta) == null ? void 0 : _a.title) != null ? _d : (_c = res == null ? void 0 : res.meta) == null ? void 0 : _c.name) != null ? _e : res == null ? void 0 : res.name) != null ? _f : path,
          fulUrl: pathNameApi.getFulUrl(url, searchValue),
          pathName,
          select: pathName === location.pathname,
          port: location.port
        };
      })) || [];
      return routerArray;
    },
    getActiveName() {
      const saas_web_available = mkApi.SAAS_WEB_DEBUG_AVAILABLE.get();
      let that = this;
      function showRouterName() {
        const routerList = that.getRouterArrayInfo();
        let routerItem = routerList.find((res) => res.select);
        return routerItem ? routerItem.name ? routerItem.name : "---/---" : "---/---";
      }
      if (saas_web_available) {
        let saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
        if (location.host.includes("localhost") && location.href.includes(saasWebInfo.serverName) && location.href.includes(saasWebInfo.authorizationId))
          return saasWebInfo.authorizationId + "\u4EE3\u7406\u4E2D";
        if (saasWebInfo.targetUrl.includes(location.host))
          return saasWebInfo.serverName + "/" + saasWebInfo.authorizationId + "\u4EE3\u7406\u4E2D";
        return showRouterName();
      } else {
        return showRouterName();
      }
    },
    getProxyStatus() {
      const saas_web_available = mkApi.SAAS_WEB_DEBUG_AVAILABLE.get();
      if (saas_web_available) {
        let saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
        if (location.host.includes("localhost") && location.href.includes(saasWebInfo.serverName) && location.href.includes(saasWebInfo.authorizationId))
          return true;
        if (saasWebInfo.targetUrl.includes(location.host))
          return true;
        return false;
      } else {
        return false;
      }
    },
    start() {
      smartJumpApi.smartJump();
    }
  };
  var realXhr = "__xhr-gcshi";
  var events = ["load", "loadend", "timeout", "error", "readystatechange", "abort"];
  function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event)
      e[attr] = event[attr];
    e.target = e.currentTarget = xhrProxy;
    return e;
  }
  function hook(proxy2, win) {
    win = win || window;
    win[realXhr] = win[realXhr] || win.XMLHttpRequest;
    win.XMLHttpRequest = function() {
      var xhr = new win[realXhr]();
      if (win.__xhr)
        return xhr;
      for (var i = 0; i < events.length; ++i) {
        var key = "on" + events[i];
        if (xhr[key] === void 0) {
          xhr[key] = null;
        }
      }
      for (var attr in xhr) {
        var type = "";
        try {
          type = typeof xhr[attr];
        } catch (e) {
        }
        if (type === "function") {
          this[attr] = hookFunction(attr);
        } else {
          Object.defineProperty(this, attr, {
            get: getterFactory(attr),
            set: setterFactory(attr),
            enumerable: true
          });
        }
      }
      var that = this;
      xhr.getProxy = function() {
        return that;
      };
      this.xhr = xhr;
    };
    function getterFactory(attr) {
      return function() {
        var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
        var attrGetterHook = (proxy2[attr] || {})["getter"];
        return attrGetterHook && attrGetterHook(v, this) || v;
      };
    }
    function setterFactory(attr) {
      return function(v) {
        var xhr = this.xhr;
        var that = this;
        var hook2 = proxy2[attr];
        if (attr.substring(0, 2) === "on") {
          that[attr + "_"] = v;
          xhr[attr] = function(e) {
            e = configEvent(e, that);
            var ret = proxy2[attr] && proxy2[attr].call(that, xhr, e);
            ret || v.call(that, e);
          };
        } else {
          var attrSetterHook = (hook2 || {})["setter"];
          v = attrSetterHook && attrSetterHook(v, that) || v;
          this[attr + "_"] = v;
          try {
            xhr[attr] = v;
          } catch (e) {
          }
        }
      };
    }
    function hookFunction(fun) {
      return function() {
        var args = [].slice.call(arguments);
        if (proxy2[fun]) {
          var ret = proxy2[fun].call(this, args, this.xhr);
          if (ret)
            return ret;
        }
        return this.xhr[fun].apply(this.xhr, args);
      };
    }
    return win[realXhr];
  }
  var eventLoad = events[0], eventLoadEnd = events[1], eventTimeout = events[2], eventError = events[3], eventReadyStateChange = events[4], eventAbort = events[5];
  var prototype = "prototype";
  function proxy(proxy2, win) {
    win = win || window;
    if (win["__xhr-gcshi"])
      return;
    return proxyAjax(proxy2, win);
  }
  function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement("a"));
  }
  function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = "on" + name + "_";
    var event = configEvent({ type: name }, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if (typeof Event === "function") {
      evt = new Event(name, { bubbles: false });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
  }
  function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
  }
  Handler[prototype] = /* @__PURE__ */ Object.create({
    resolve: function resolve(response) {
      var xhrProxy = this.xhrProxy;
      var xhr = this.xhr;
      xhrProxy.readyState = 4;
      xhr.resHeader = response.headers;
      xhrProxy.response = xhrProxy.responseText = response.response;
      xhrProxy.statusText = response.statusText;
      xhrProxy.status = response.status;
      triggerListener(xhr, eventReadyStateChange);
      triggerListener(xhr, eventLoad);
      triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
      this.xhrProxy.status = 0;
      triggerListener(this.xhr, error.type);
      triggerListener(this.xhr, eventLoadEnd);
    }
  });
  function makeHandler(next) {
    function sub(xhr) {
      Handler.call(this, xhr);
    }
    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
  }
  var RequestHandler = makeHandler(function(rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
      xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
  });
  var ResponseHandler = makeHandler(function(response) {
    this.resolve(response);
  });
  var ErrorHandler = makeHandler(function(error) {
    this.reject(error);
  });
  function proxyAjax(proxy2, win) {
    var onRequest = proxy2.onRequest, onResponse = proxy2.onResponse, onError = proxy2.onError;
    function handleResponse(xhr, xhrProxy) {
      var handler = new ResponseHandler(xhr);
      var ret = {
        response: xhrProxy.response || xhrProxy.responseText,
        status: xhrProxy.status,
        statusText: xhrProxy.statusText,
        config: xhr.config,
        headers: xhr.resHeader || xhr.getAllResponseHeaders().split("\r\n").reduce(function(ob, str) {
          if (str === "")
            return ob;
          var m = str.split(":");
          ob[m.shift()] = trim(m.join(":"));
          return ob;
        }, {})
      };
      if (!onResponse)
        return handler.resolve(ret);
      onResponse(ret, handler);
    }
    function onerror(xhr, xhrProxy, error, errorType) {
      var handler = new ErrorHandler(xhr);
      error = { config: xhr.config, error, type: errorType };
      if (onError) {
        onError(error, handler);
      } else {
        handler.next(error);
      }
    }
    function preventXhrProxyCallback() {
      return true;
    }
    function errorCallback(errorType) {
      return function(xhr, e) {
        onerror(xhr, this, e, errorType);
        return true;
      };
    }
    function stateChangeCallback(xhr, xhrProxy) {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        handleResponse(xhr, xhrProxy);
      } else if (xhr.readyState !== 4) {
        triggerListener(xhr, eventReadyStateChange);
      }
      return true;
    }
    return hook({
      onload: preventXhrProxyCallback,
      onloadend: preventXhrProxyCallback,
      onerror: errorCallback(eventError),
      ontimeout: errorCallback(eventTimeout),
      onabort: errorCallback(eventAbort),
      onreadystatechange: function(xhr) {
        return stateChangeCallback(xhr, this);
      },
      open: function open(args, xhr) {
        var _this = this;
        var config = xhr.config = { headers: {} };
        config.method = args[0];
        config.url = args[1];
        config.async = args[2];
        config.user = args[3];
        config.password = args[4];
        config.xhr = xhr;
        var evName = "on" + eventReadyStateChange;
        if (!xhr[evName]) {
          xhr[evName] = function() {
            return stateChangeCallback(xhr, _this);
          };
        }
        if (onRequest)
          return true;
      },
      send: function(args, xhr) {
        var config = xhr.config;
        config.withCredentials = xhr.withCredentials;
        config.body = args[0];
        if (onRequest) {
          var req = function() {
            onRequest(config, new RequestHandler(xhr));
          };
          config.async === false ? req() : setTimeout(req);
          return true;
        }
      },
      setRequestHeader: function(args, xhr) {
        xhr.config.headers[args[0].toLowerCase()] = args[1];
        if (onRequest)
          return true;
      },
      addEventListener: function(args, xhr) {
        var _this = this;
        if (events.indexOf(args[0]) !== -1) {
          var handler = args[1];
          getEventTarget(xhr).addEventListener(args[0], function(e) {
            var event = configEvent(e, _this);
            event.type = args[0];
            event.isTrusted = true;
            handler.call(_this, event);
          });
          return true;
        }
      },
      getAllResponseHeaders: function(_, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          var header = "";
          for (var key in headers) {
            header += key + ": " + headers[key] + "\r\n";
          }
          return header;
        }
      },
      getResponseHeader: function(args, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          return headers[(args[0] || "").toLowerCase()];
        }
      }
    }, win);
  }
  const crypto = new main.Crypto({
    key: "1234123412ABCDEF",
    iv: "ABCDEF1234123412"
  });
  const consoleTip = null;
  const monkeyTool = {
    inject() {
      const saasWebAvailable = mkApi.SAAS_WEB_DEBUG_AVAILABLE.get();
      const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      if (saasWebAvailable && saasWebInfo.targetUrl.includes(location.host)) {
        return true;
      }
      let devToolVisible = mkApi.DEVTOOL_VISIBLE.get();
      const localhostUrl = location.href.includes("localhost");
      if (devToolVisible || localhostUrl) {
        return true;
      } else {
        return false;
      }
    },
    visible() {
      let error = document.body.querySelector("#webpack-dev-server-client-overlay");
      if (error)
        return false;
      let count = mkApi.ERROR_COUNT.get();
      if (count > 1) {
        mkApi.ERROR_COUNT.set(0);
        return false;
      }
      mkApi.ERROR_COUNT.set(count + 1);
      setTimeout(() => {
        mkApi.ERROR_COUNT.set(0);
      }, 1e3);
      const routerArrayInfo = routerApi.getRouterArrayInfo();
      if (routerArrayInfo.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    registerMenuCommand() {
      mkApi.registerMenuCommand();
    }
  };
  const SAAS_WEB_API = {
    saas_webEnabled() {
      let enabled = true;
      if (!mkApi.SAAS_WEB_DEBUG_AVAILABLE.get())
        enabled = false;
      if (!mkApi.SAAS_WEB_DEBUG_INFO.get().targetUrl)
        enabled = false;
      if (location.href.includes("localhost"))
        enabled = false;
      if (!localStorage.getItem("USER"))
        enabled = false;
      return enabled;
    },
    PROXY_USER() {
      function getUser() {
        let user = localStorage.getItem("USER");
        let userInfo = JSON.parse(crypto.Decrypt(user));
        if (userInfo.proxy) {
          const ORIGIN_USER = mkApi.ORIGIN_USER.get();
          userInfo = JSON.parse(crypto.Decrypt(ORIGIN_USER));
        } else {
          const USER = crypto.Encrypt(JSON.stringify(userInfo));
          mkApi.ORIGIN_USER.set(USER);
        }
        return userInfo;
      }
      function setUser(userInfo) {
        let PROXY_USER = crypto.Encrypt(JSON.stringify(userInfo));
        localStorage.setItem("USER", PROXY_USER);
      }
      function restoreUser() {
        if (location.href.includes("login")) {
          localStorage.removeItem("USER");
        }
        if (localStorage.getItem("USER")) {
          const ORIGIN_USER = mkApi.ORIGIN_USER.get();
          localStorage.setItem("USER", ORIGIN_USER);
        }
      }
      return {
        getUser,
        restoreUser,
        setUser
      };
    },
    getEditUserInfo(userInfo) {
      userInfo.proxy = true;
      if (!userInfo.user_id) {
        userInfo.user_id = userInfo.userId;
      }
      const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      let isIframe = saasWebInfo.nestingType;
      if (isIframe === "iframe") {
        userInfo.userName = this.getCurrentName(saasWebInfo.serverName);
      }
      let authorizations = userInfo.authorizations;
      let localServeList = authorizations.filter((res) => res.functionUrl && res.functionUrl.includes(saasWebInfo.serverName));
      if (localServeList.length > 0) {
        const { otherRouter } = mkApi.SAAS_WEB_DEBUG_INFO.get();
        localServeList.forEach((res) => {
          if (res.functionUrl && res.authorizationId && res.functionUrl.includes(saasWebInfo.serverName) && (otherRouter == null ? void 0 : otherRouter.length) > 0 && otherRouter.some((item) => item.includes(res.authorizationId))) {
            res.authorizationName = "\u3010\u672C\u5730\u3011" + res.authorizationName;
          }
        });
      }
      if (localServeList.length > 0) {
        let findItem = localServeList.find((res) => res.authorizationId && res.authorizationId.includes(saasWebInfo.authorizationId));
        if (findItem) {
          findItem.functionUrl = saasWebInfo.localUrl;
          findItem.authorizationName = saasWebInfo.authorizationName ? saasWebInfo.authorizationName : findItem.authorizationName;
        } else {
          let copyItem = JSON.parse(JSON.stringify(authorizations.find((res) => res.functionUrl && res.productOrder === "1")));
          copyItem.functionUrl = saasWebInfo.localUrl;
          copyItem.authorizationId = saasWebInfo.authorizationId;
          copyItem.authorizationName = saasWebInfo.authorizationName ? saasWebInfo.authorizationName : `\u3010\u672C\u5730\u4EE3\u7406\u670D\u52A1\u3011`;
          authorizations.unshift(copyItem);
        }
      } else {
        let firstItem = JSON.parse(JSON.stringify(authorizations.find((res) => res.functionUrl && res.productOrder === "1")));
        firstItem.authorizationId = saasWebInfo.authorizationId, firstItem.authorizationName = saasWebInfo.authorizationName || "\u3010\u672C\u5730\u4EE3\u7406\u670D\u52A1\u3011", firstItem.functionUrl = saasWebInfo.localUrl;
        authorizations.unshift(firstItem);
      }
      return userInfo;
    },
    editSystemConfig() {
      const systemConfig = unsafeWindow == null ? void 0 : unsafeWindow.systemConfig;
      if (!systemConfig)
        return consoleTip;
      const microAppIds = systemConfig.microAppIds;
      const hideHeader = systemConfig.hideHeader;
      const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      const microAppIndex = microAppIds.findIndex((res) => res === saasWebInfo.serverName);
      if (saasWebInfo.nestingType === "iframe") {
        microAppIndex > 0 && microAppIds.splice(microAppIndex, 1);
      } else {
        microAppIndex === -1 && microAppIds.push(saasWebInfo.serverName);
      }
      const microHideHeaderIndex = hideHeader.findIndex((res) => res === saasWebInfo.authorizationId);
      if (saasWebInfo.hideHeader) {
        microHideHeaderIndex === -1 && hideHeader.push(saasWebInfo.authorizationId);
      } else {
        microHideHeaderIndex > 0 && hideHeader.splice(microAppIndex, 1);
      }
    },
    urlFetch() {
      const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      if (saasWebInfo.nestingType === "qiankun") {
        let realHook = unsafeWindow.fetch;
        unsafeWindow.fetch = function(url) {
          const status = url.includes(saasWebInfo.serverName) && !url.includes(saasWebInfo.localhost);
          if (status) {
            const targetHost = new RegExp(location.origin, "g");
            url = url.replace(targetHost, `http://${saasWebInfo.localhost}`);
          }
          return realHook(url);
        };
      }
    },
    getCurrentName(serverName) {
      let searchValueList = mkApi.SEARCH_VALUE.get();
      if (!searchValueList || searchValueList.length === 0) {
        return serverName;
      }
      let findItem = searchValueList.find((res) => res.serverName === serverName);
      let loginName = "";
      if (!findItem && findItem.searchValue.includes("loginName=")) {
        return serverName;
      } else {
        loginName = findItem.searchValue.split("=")[1];
      }
      return loginName;
    }
  };
  const AJAX_HOOK_API = {
    nameServiceDataAPI() {
      let data = void 0;
      function get() {
        return data;
      }
      function set(userInfo) {
        let newObj = {};
        let exceptList = ["authorizations", "projects"];
        for (let key in userInfo) {
          if (!exceptList.find((res) => res === key)) {
            let newKey = key.replaceAll("_", "").toLowerCase();
            newObj[newKey] = userInfo[key];
          }
        }
        data = newObj;
      }
      async function getPersonByUserNameService(loginName) {
        const { localhost } = mkApi.SAAS_WEB_DEBUG_INFO.get();
        let url = `http://${localhost}/api/meos/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService`;
        let body = {
          "user_id": "",
          "userId": "",
          "pd": "",
          "person_id": "",
          "personId": "",
          "puser": {
            "userId": "",
            "loginDevice": "PC",
            "pd": ""
          },
          "loginName": loginName,
          "loginDevice": "PC"
        };
        let data2 = await mkApi.GM_ajax(url, body);
        return data2;
      }
      return {
        get,
        set,
        getPersonByUserNameService
      };
    },
    setLocalAjax(config) {
      const { targetUrl, otherRouter } = mkApi.SAAS_WEB_DEBUG_INFO.get();
      if (!targetUrl.includes(location.host))
        return config;
      if ((otherRouter == null ? void 0 : otherRouter.length) === 0 || !otherRouter.some((res) => location.href.includes(res)))
        return config;
      const saas_web_urlList = ["loginUserServiceForEncrypt", "saveLog", "sockjs-node", "getpartitionProjects", "getpartitionProjectsByUserId", "queryBusinessBoardById"];
      if (saas_web_urlList.some((url) => config.url.includes(url)))
        return config;
      if (!config.url.includes("http")) {
        const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
        if (config.url.startsWith("/")) {
          config.url = "http://" + saasWebInfo.localhost + config.url;
        } else {
          config.url = "http://" + saasWebInfo.localhost + "/" + config.url;
        }
      }
      return config;
    },
    editBody(body, userInfo) {
      let configBody = JSON.parse(body);
      for (let key in configBody) {
        let newKey = key.replaceAll("_", "").toLocaleLowerCase();
        if (userInfo.hasOwnProperty(newKey)) {
          configBody[key] = userInfo[newKey];
        }
      }
      return JSON.stringify(configBody);
    },
    async setLocalAjaxBody(config) {
      if (!config.url.includes("localhost"))
        return config;
      let searchValueList = mkApi.SEARCH_VALUE.get();
      const { serverName } = mkApi.SAAS_WEB_DEBUG_INFO.get();
      let findItem = searchValueList.find((res) => res.serverName === serverName);
      let loginName = "";
      if (!findItem && findItem.searchValue.includes("loginName=")) {
        return config;
      } else {
        loginName = findItem.searchValue.split("=")[1];
      }
      let { get, set, getPersonByUserNameService } = this.nameServiceDataAPI();
      let userInfo = get();
      if (!userInfo) {
        try {
          let response = await getPersonByUserNameService(loginName);
          if (response) {
            const responseData = JSON.parse(response);
            set(responseData.content[0]);
            userInfo = get();
          }
        } catch (err) {
          return config;
        }
      }
      if (!userInfo)
        return config;
      config.body = this.editBody(config.body, userInfo);
      return config;
    },
    setLoginUserServiceForEncrypt(response) {
      if (response.config.url.includes("loginUserServiceForEncrypt")) {
        let responseData = JSON.parse(response.response);
        let userInfo = responseData == null ? void 0 : responseData.content[0];
        if (userInfo) {
          const USER = crypto.Encrypt(JSON.stringify(userInfo));
          mkApi.ORIGIN_USER.set(USER);
          userInfo = SAAS_WEB_API.getEditUserInfo(userInfo);
          response.response = JSON.stringify(responseData);
          return response;
        } else {
          return response;
        }
      }
      return response;
    },
    unProxy(win) {
      win = win || unsafeWindow;
      win.XMLHttpRequest = win.__xhr;
      win.__xhr = void 0;
    },
    ajax_hook_start() {
      proxy({
        onRequest: async (config, handler) => {
          config = this.setLocalAjax(config) || config;
          config = await this.setLocalAjaxBody(config);
          handler.next(config);
        },
        onError: (err, handler) => {
          console.log(err.type);
          handler.next(err);
        },
        onResponse: async (response, handler) => {
          response = this.setLoginUserServiceForEncrypt(response);
          handler.next(response);
        }
      }, unsafeWindow);
    },
    ajax_enabled() {
      let proxyStatus = false;
      let saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      const saasWebAvailable = mkApi.SAAS_WEB_DEBUG_AVAILABLE.get();
      if (saasWebInfo.targetUrl && saasWebInfo.targetUrl.includes(location.host) && saasWebAvailable) {
        if (location.href.includes("login") || saasWebInfo.ajax) {
          proxyStatus = true;
        } else {
          proxyStatus = false;
        }
      }
      return proxyStatus;
    }
  };
  const hookStart = {
    ajaxStatus: false,
    saas_web_fetch_hook() {
      const saas_webEnabled = SAAS_WEB_API.saas_webEnabled();
      if (!saas_webEnabled)
        return;
      const proxyUser = SAAS_WEB_API.PROXY_USER();
      const userInfo = proxyUser.getUser();
      if (userInfo.proxy) {
        return consoleTip;
      }
      const editUserInfo = SAAS_WEB_API.getEditUserInfo(userInfo);
      SAAS_WEB_API.editSystemConfig();
      proxyUser.setUser(editUserInfo);
      if (location.href.includes(mkApi.SAAS_WEB_DEBUG_INFO.get().serverName)) {
        const { otherRouter } = mkApi.SAAS_WEB_DEBUG_INFO.get();
        if (otherRouter && (otherRouter == null ? void 0 : otherRouter.length) > 0 && otherRouter.some((res) => location.href.includes(res))) {
          SAAS_WEB_API.urlFetch();
        }
      } else {
        SAAS_WEB_API.urlFetch();
      }
    },
    xhr_Hook() {
      const enabled = AJAX_HOOK_API.ajax_enabled();
      if (!enabled)
        return;
      if (!this.ajaxStatus && location.href.includes("login") && !location.href.includes("localhost")) {
        this.ajaxStatus = true;
        SAAS_WEB_API.editSystemConfig();
        SAAS_WEB_API.urlFetch();
      }
      if (unsafeWindow.__xhr) {
        AJAX_HOOK_API.unProxy();
      }
      AJAX_HOOK_API.ajax_hook_start();
    }
  };
  function hookEnd() {
    const proxyUser = SAAS_WEB_API.PROXY_USER();
    unsafeWindow.addEventListener("unload", () => {
      proxyUser.restoreUser();
      sessionStorage.clear();
    });
  }
  const _sfc_main$3 = /* @__PURE__ */ vue$1.defineComponent({
    __name: "index",
    props: ["top", "left", "width", "bottom", "upperPart", "name"],
    emits: ["destroy"],
    setup(__props, { emit }) {
      const props = __props;
      vue$1.onMounted(() => {
        visible.value = true;
        boxWrap.value.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      });
      const boxWrap = vue$1.ref();
      const styles = vue$1.computed(
        () => {
          return {
            left: props.left,
            width: props.width,
            bottom: props.upperPart ? "" : props.bottom,
            top: props.upperPart ? props.top : ""
          };
        }
      );
      const customClass = vue$1.computed(() => {
        return props.upperPart ? "upPart" : "belowPart";
      });
      let visible = vue$1.ref(false);
      function beforeUnload() {
        if (props.name === "router") {
          emit("destroy");
        }
      }
      return (_ctx, _cache) => {
        return vue$1.openBlock(), vue$1.createBlock(vue$1.Transition, {
          name: "message",
          onAfterLeave: beforeUnload,
          onMouseleave: beforeUnload
        }, {
          default: vue$1.withCtx(() => [
            vue$1.withDirectives(vue$1.createElementVNode("div", {
              class: vue$1.normalizeClass(["monkey-box-wrap", vue$1.unref(customClass)]),
              style: vue$1.normalizeStyle(vue$1.unref(styles)),
              ref_key: "boxWrap",
              ref: boxWrap
            }, [
              vue$1.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ], 6), [
              [vue$1.vShow, vue$1.unref(visible)]
            ])
          ]),
          _: 3
        });
      };
    }
  });
  const index_vue_vue_type_style_index_0_scoped_376271cc_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const boxWrapComponent = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-376271cc"]]);
  let vm;
  const bodyHight = document.documentElement.clientHeight;
  const container = document.createElement("div");
  const createBoxWarp = (dragBox, component) => {
    if (!component) {
      return vue$1.render(null, container);
    }
    const centerLinePosition = dragBox.offsetTop + dragBox.clientHeight / 2;
    const upperPart = bodyHight / 2 - centerLinePosition > 0 ? true : false;
    const left = dragBox.offsetLeft + "px";
    const width = dragBox.offsetWidth + "px";
    const name = component.__name;
    if (vm) {
      vue$1.render(null, container);
    }
    const props = {
      upperPart,
      top: dragBox.offsetTop + dragBox.offsetHeight + 10 + "px",
      bottom: bodyHight - dragBox.offsetTop + 10 + "px",
      width,
      left,
      name,
      onDestroy: () => {
        vue$1.render(null, container);
      }
    };
    vm = vue$1.createVNode(boxWrapComponent, props, () => vue$1.h(component));
    vue$1.render(vm, container);
    document.body.appendChild(container.firstElementChild);
    //!表示一定有
  };
  const home = '<svg t="1669278323056" class="icon" viewBox="0 0 1030 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13893" width="200" height="200"><path d="M996.7104 441.97888 609.4336 38.8096C585.36448 13.77792 553.20064 0 518.72256 0S452.08064 13.77792 428.01664 38.8096L40.73984 441.97888c-39.9616 41.61536-34.816 77.58336-28.2112 92.61056 4.70528 10.65984 20.60288 39.9616 66.39616 39.9616l56.76544 0 0 310.15936c0 70.41536 50.56 136.71936 122.41408 136.71936l65.14688 0L422.9632 1021.42976l0-72.87808 0-255.36c0-35.19488-5.32992-54.79936 30.61248-54.79936l65.14688 0 65.14688 0c35.93728 0 30.61248 19.60448 30.61248 54.79936l0 255.36 0 72.87808 99.71712 0 65.152 0c71.84896 0 122.40384-66.304 122.40384-136.71936l0-310.15936 56.77056 0c45.77792 0 61.68576-29.30176 66.39616-39.9616C1031.53664 519.56736 1036.672 483.59424 996.7104 441.97888z" p-id="13894" fill=" rgba(0, 101, 179,.7)"></path></svg>';
  const arrow = '<svg t="1669278611131" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14927" width="200" height="200"><path d="M1005.9 691c11.2 11.2 16.7 25.8 16.7 40.5 0 14.6-5.5 29.3-16.7 40.5-22.3 22.3-58.5 22.3-80.8 0L511.4 358.1 97.6 771.7c-22.3 22.3-58.5 22.3-80.8 0-22.3-22.3-22.3-58.5 0-80.8L446.7 261c17.3-17.3 40.2-26.7 64.7-26.7s47.4 9.5 64.7 26.7l429.8 430z m0 0" fill=" #0065B3" p-id="14928"></path></svg>';
  const refresh = '<svg t="1669279529953" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23522" width="200" height="200"><path d="M1017.856 460.8l-185.408-233.536c-20.48-25.6-58.368-25.6-78.848 0L569.216 460.8C554.88 478.208 568.256 504.832 590.784 504.832l72.704 0c-2.048 136.192-2.048 309.312-240.704 447.552-6.144 4.096-3.072 13.312 4.096 12.288 456.768-70.656 493.632-376.896 494.656-458.816l75.776 0C1019.904 504.832 1032.192 478.208 1017.856 460.8L1017.856 460.8zM434.048 519.168 361.344 519.168c2.048-136.192 2.048-309.312 240.704-447.552 6.144-4.096 3.072-13.312-4.096-12.288C141.12 129.984 104.256 437.248 103.232 518.144L27.456 518.144c-22.528 0-35.84 26.624-21.504 44.032l185.344 233.536c20.48 25.6 58.368 25.6 78.848 0l185.408-233.536C468.864 545.792 456.576 519.168 434.048 519.168L434.048 519.168zM434.048 519.168" p-id="23523" fill="#C7CBCF"></path></svg>';
  const setting = '<svg t="1669279735275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="46658" width="200" height="200"><path d="M1017.377674 456.010825c-3.988848-22.373567-25.431206-44.900629-47.617507-49.979298l-16.45067-3.802606c-39.015595-11.780301-73.665767-37.860283-95.66685-75.9416-22.185278-38.356586-27.235294-81.920778-17.633612-121.807207l4.860704-15.611559c6.66991-21.719674-1.994424-51.633984-19.256576-66.345034 0 0-15.643282-13.20986-59.709917-38.699394-44.060495-25.457812-63.191204-32.410154-63.191204-32.410154-21.37789-7.726985-51.54291-0.37146-66.99688 16.32992l-11.594059 12.462846c-29.665647 28.045753-69.645197 45.215808-113.584941 45.215808-44.152593 0-84.258009-17.294898-113.954355-45.526893L385.393999 67.804269c-15.393595-16.669658-45.591361-24.056905-66.967204-16.325827 0 0-19.131733 6.915503-63.290465 32.405037-43.996027 25.490557-59.546188 38.639019-59.546188 38.639019-17.326621 14.71105-26.019607 44.500517-19.289322 66.313312l4.827959 15.769149c9.474792 39.853683 4.364401 83.325777-17.633612 121.653711-22.063505 38.235836-57.056484 64.380286-96.228645 76.030627L51.186288 405.967058c-22.090111 5.050016-43.564191 27.608801-47.553039 49.950645 0 0-3.613294 20.09978-3.613294 71.109548 0 51.012837 3.613294 71.019497 3.613294 71.019497 4.02057 22.434965 25.461905 44.933375 47.553039 50.105165l15.708773 3.492544c39.325657 11.713786 74.411757 37.95238 96.600105 76.343759 22.091134 38.327934 27.14115 81.892125 17.573237 121.779577l-4.767584 15.579837c-6.730285 21.686928 1.962701 51.601238 19.349697 66.309218 0 0 15.551184 13.21293 59.644425 38.702464 44.093241 25.551956 63.164598 32.411177 63.164598 32.411177 21.408589 7.726985 51.509141 0.311085 66.967204-16.269545l11.06194-11.902074c29.697369-28.355815 69.829392-45.617967 114.047476-45.617967 44.189432 0 84.387969 17.386996 114.210181 45.617967l0.027629 0 10.940167 11.902074c15.45397 16.58063 45.493124 23.99653 66.930365 16.269545 0 0 19.071358-6.979972 63.321164-32.411177 44.002167-25.489534 59.579957-38.702464 59.579957-38.702464 17.328667-14.70798 25.928532-44.496423 19.323091-66.309218l-4.860704-16.080234c-9.349949-39.761586-4.239558-83.139535 17.633612-121.279181 22.25077-38.452777 57.277518-64.569598 96.538707-76.343759l0-0.065492 15.705704-3.612271c22.187325-5.051039 43.62866-27.545356 47.615461-49.983391 0 0 3.613294-20.068058 3.613294-71.109548C1020.990968 476.078883 1017.377674 456.010825 1017.377674 456.010825zM510.507508 691.592284c-90.588181 0-164.067706-73.665767-164.067706-164.532287 0-90.741677 73.478502-164.342975 164.067706-164.342975 90.584088 0 163.970492 73.633021 163.970492 164.467819C674.478 618.052384 601.091596 691.592284 510.507508 691.592284z" p-id="46659" fill="#C7CBCF"></path></svg>';
  const vue = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="37.07" height="36" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 198"><path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"></path><path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"></path><path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"></path></svg>';
  const vueGray = '<svg t="1669605726745" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3188" width="200" height="200"><path d="M512 504L764.8 68.8h-134.4L512 275.2 393.6 70.4h-134.4L512 504zM819.2 70.4L512 600 204.8 68.8H0l512 886.4L1024 70.4H819.2z" fill="#C7CBCF" p-id="3189"></path></svg>';
  const _hoisted_1$2 = { class: "router-wrap" };
  const _hoisted_2$2 = ["innerHTML"];
  const _hoisted_3$2 = ["innerHTML"];
  const _hoisted_4$2 = ["onClick"];
  const _hoisted_5$1 = { class: "path-wrap" };
  const _hoisted_6$1 = { class: "name-wrap" };
  const _sfc_main$2 = /* @__PURE__ */ vue$1.defineComponent({
    __name: "router",
    setup(__props) {
      const vTitle = {
        mounted(el) {
          el.onmouseenter = (e) => {
            const { clientWidth, scrollWidth, title } = el;
            if (!title && scrollWidth > clientWidth)
              el.title = el.innerText;
          };
        }
      };
      const routerArray = routerApi.getRouterArrayInfo();
      const jump = (urlInfo) => {
        if (location.href.includes("localhost")) {
          mkApi.URL_INFO.set(urlInfo);
          mkApi.SAAS_WEB_DEBUG_AVAILABLE.set(false);
          location.href = urlInfo.fulUrl;
        } else {
          location.href = urlInfo.fulUrl + location.search;
        }
      };
      function getName(url) {
        if (!url || url === "/")
          return "/";
        if (url.startsWith("/")) {
          return url.substring(1);
        } else {
          return url;
        }
      }
      return (_ctx, _cache) => {
        return vue$1.openBlock(), vue$1.createElementBlock("div", _hoisted_1$2, [
          (vue$1.openBlock(true), vue$1.createElementBlock(vue$1.Fragment, null, vue$1.renderList(vue$1.unref(routerArray), (item, index) => {
            return vue$1.openBlock(), vue$1.createElementBlock("div", {
              class: "router-item",
              key: index
            }, [
              vue$1.withDirectives(vue$1.createElementVNode("div", {
                class: "left",
                innerHTML: vue$1.unref(vueGray)
              }, null, 8, _hoisted_2$2), [
                [vue$1.vShow, !item.select]
              ]),
              vue$1.withDirectives(vue$1.createElementVNode("div", {
                class: "left",
                innerHTML: vue$1.unref(vue)
              }, null, 8, _hoisted_3$2), [
                [vue$1.vShow, item.select]
              ]),
              vue$1.createElementVNode("div", {
                class: "right",
                onClick: ($event) => jump(item)
              }, [
                vue$1.withDirectives((vue$1.openBlock(), vue$1.createElementBlock("div", _hoisted_5$1, [
                  vue$1.createTextVNode(vue$1.toDisplayString(getName(item.path)), 1)
                ])), [
                  [vTitle]
                ]),
                vue$1.withDirectives((vue$1.openBlock(), vue$1.createElementBlock("div", _hoisted_6$1, [
                  vue$1.createTextVNode(vue$1.toDisplayString(getName(item.name)), 1)
                ])), [
                  [vTitle]
                ])
              ], 8, _hoisted_4$2)
            ]);
          }), 128))
        ]);
      };
    }
  });
  const router_vue_vue_type_style_index_0_scoped_dcd8eb21_lang = "";
  const routerComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-dcd8eb21"]]);
  const _withScopeId = (n) => (vue$1.pushScopeId("data-v-909a43a7"), n = n(), vue$1.popScopeId(), n);
  const _hoisted_1$1 = { class: "monkey-setting-wrap" };
  const _hoisted_2$1 = { class: "switch-wrap" };
  const _hoisted_3$1 = { class: "item-wrap" };
  const _hoisted_4$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("div", { class: "left" }, [
    /* @__PURE__ */ vue$1.createElementVNode("span", { class: "name" }, "\u542F\u7528saasweb\u8C03\u8BD5")
  ], -1));
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("span", null, null, -1));
  const _hoisted_6 = [
    _hoisted_5
  ];
  const _hoisted_7 = { class: "setting-wrap" };
  const _hoisted_8 = { class: "item-wrap" };
  const _hoisted_9 = { class: "name" };
  const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("span", null, [
    /* @__PURE__ */ vue$1.createTextVNode("\u4E3B\u5E94\u7528\u5730\u5740\uFF1A"),
    /* @__PURE__ */ vue$1.createElementVNode("i", { style: { "color": "red" } }, "*")
  ], -1));
  const _hoisted_11 = { class: "setting-content" };
  const _hoisted_12 = { class: "item-wrap" };
  const _hoisted_13 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("p", { class: "name" }, "\u5B50\u5E94\u7528\u63A5\u5165\u65B9\u5F0F\uFF1A", -1));
  const _hoisted_14 = { class: "setting-content" };
  const _hoisted_15 = { class: "item-wrap" };
  const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("p", { class: "name" }, "\u9690\u85CF\u4E3B\u5E94\u7528\u5BFC\u822A\u680F\uFF1A", -1));
  const _hoisted_17 = { class: "setting-content" };
  const _hoisted_18 = { class: "item-wrap" };
  const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("p", { class: "name" }, "\u5B50\u5E94\u7528\u6570\u636E\u6765\u6E90\uFF1A", -1));
  const _hoisted_20 = { class: "setting-content" };
  const _hoisted_21 = { class: "item-wrap" };
  const _hoisted_22 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("p", { class: "name" }, "\u81EA\u5B9A\u4E49\u83DC\u5355\u540D\u79F0\uFF1A", -1));
  const _hoisted_23 = { class: "setting-content" };
  const _hoisted_24 = { class: "item-wrap" };
  const _hoisted_25 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue$1.createElementVNode("p", { class: "name" }, "\u5B50\u5E94\u7528\u4FE1\u606F\uFF1A", -1));
  const _hoisted_26 = ["title"];
  const _hoisted_27 = ["textContent"];
  const _hoisted_28 = { class: "btn-wrap" };
  const _sfc_main$1 = /* @__PURE__ */ vue$1.defineComponent({
    __name: "setting",
    setup(__props) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const proxyStatus = vue$1.computed(() => {
        return routerApi.getProxyStatus();
      });
      const saasWeb_available = vue$1.ref(mkApi.SAAS_WEB_DEBUG_AVAILABLE.get());
      const routerArrayInfo = routerApi.getRouterArrayInfo();
      console.log("routerArrayInfo: ", routerArrayInfo);
      const saasWebInfoDefault = vue$1.reactive({
        targetUrl: "http://doimp.persagy.com/",
        nestingType: "qiankun",
        hideHeader: false,
        authorizationName: "",
        localhost: location.host,
        localUrl: location.origin + "/" + ((_b = (_a = location.pathname.replace("//", "/")) == null ? void 0 : _a.split("/")) == null ? void 0 : _b[1]) + "/",
        authorizationId: (_e = (_d = (_c = location.pathname.replace("//", "/")) == null ? void 0 : _c.split("/")) == null ? void 0 : _d[2]) != null ? _e : "",
        serverName: (_h = (_g = (_f = location.pathname.replace("//", "/")) == null ? void 0 : _f.split("/")) == null ? void 0 : _g[1]) != null ? _h : "",
        ajax: false,
        otherRouter: routerArrayInfo.map((res) => res.pathName)
      });
      const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
      if (saasWebInfo.targetUrl && mkApi.SAAS_WEB_DEBUG_AVAILABLE.get()) {
        for (let i in saasWebInfoDefault) {
          if (i !== "localUrl" || !location.href.includes("localhost")) {
            saasWebInfoDefault[i] = saasWebInfo[i];
          } else {
            saasWebInfoDefault[i] = location.origin + "/" + ((_j = (_i = location.pathname.replace("//", "/")) == null ? void 0 : _i.split("/")) == null ? void 0 : _j[1]) + "/";
          }
        }
      }
      if (saasWebInfo.targetUrl) {
        saasWebInfoDefault.targetUrl = saasWebInfo.targetUrl;
      }
      const activePathName = mkApi.ACTIVE_PATHNAME.get();
      if (!activePathName || !saasWebInfo.targetUrl) {
        saasWeb_available.value = false;
        mkApi.SAAS_WEB_DEBUG_AVAILABLE.set(false);
        mkApi.SAAS_WEB_DEBUG_INFO.set({});
      }
      function setSaasWebStatus() {
        const status = saasWeb_available.value;
        if (status) {
          saasWeb_available.value = !saasWeb_available.value;
          mkApi.SAAS_WEB_DEBUG_AVAILABLE.set(saasWeb_available.value);
          location.reload();
        } else {
          if (!location.href.includes("localhost"))
            return alert("\u8BF7\u5728\u3010\u672C\u5730\u5F00\u53D1\u7684\u524D\u7AEF\u754C\u9762\u3011\u70B9\u51FB\u6B64\u6309\u94AE\uFF01");
          saasWeb_available.value = !saasWeb_available.value;
        }
      }
      function refreshByUnHealthStatus() {
        if (proxyStatus.value && !mkApi.SAAS_WEB_DEBUG_AVAILABLE.get()) {
          if (confirm("saasweb\u8C03\u8BD5\u72B6\u6001\u5F02\u5E38\uFF01\u8BF7\u5237\u65B0\u9875\u9762\uFF01")) {
            location.reload();
          }
        }
      }
      const save = () => {
        refreshByUnHealthStatus();
        mkApi.SAAS_WEB_DEBUG_INFO.set(saasWebInfoDefault);
        mkApi.SAAS_WEB_DEBUG_AVAILABLE.set(true);
        if (!location.href.includes("localhost")) {
          if (location.href.includes(saasWebInfo.serverName) && location.href.includes(saasWebInfo.authorizationId)) {
            location.reload();
          } else {
            location.href = saasWebInfo.targetUrl;
          }
        } else {
          window.open(saasWebInfoDefault.targetUrl);
          location.reload();
        }
      };
      return (_ctx, _cache) => {
        return vue$1.openBlock(), vue$1.createElementBlock("div", _hoisted_1$1, [
          vue$1.createElementVNode("div", _hoisted_2$1, [
            vue$1.createElementVNode("div", _hoisted_3$1, [
              _hoisted_4$1,
              vue$1.createElementVNode("div", {
                class: vue$1.normalizeClass(["right", { select: saasWeb_available.value }]),
                onClick: _cache[0] || (_cache[0] = ($event) => setSaasWebStatus())
              }, _hoisted_6, 2)
            ])
          ]),
          vue$1.withDirectives(vue$1.createElementVNode("div", _hoisted_7, [
            vue$1.createElementVNode("div", _hoisted_8, [
              vue$1.createElementVNode("p", _hoisted_9, [
                _hoisted_10,
                vue$1.createElementVNode("span", {
                  class: "clear",
                  onClick: _cache[1] || (_cache[1] = ($event) => saasWebInfoDefault.targetUrl = "")
                }, "\u6E05\u7A7A")
              ]),
              vue$1.createElementVNode("div", _hoisted_11, [
                vue$1.withDirectives(vue$1.createElementVNode("input", {
                  type: "text",
                  class: "input_text",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => saasWebInfoDefault.targetUrl = $event)
                }, null, 512), [
                  [vue$1.vModelText, saasWebInfoDefault.targetUrl]
                ])
              ])
            ]),
            vue$1.createElementVNode("div", _hoisted_12, [
              _hoisted_13,
              vue$1.createElementVNode("div", _hoisted_14, [
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "nestingType",
                    type: "radio",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => saasWebInfoDefault.nestingType = $event),
                    value: "qiankun"
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.nestingType]
                  ]),
                  vue$1.createTextVNode("qiankun")
                ]),
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "nestingType",
                    type: "radio",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => saasWebInfoDefault.nestingType = $event),
                    value: "iframe"
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.nestingType]
                  ]),
                  vue$1.createTextVNode("iframe")
                ])
              ])
            ]),
            vue$1.createElementVNode("div", _hoisted_15, [
              _hoisted_16,
              vue$1.createElementVNode("div", _hoisted_17, [
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "hideHeader",
                    type: "radio",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => saasWebInfoDefault.hideHeader = $event),
                    value: false
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.hideHeader]
                  ]),
                  vue$1.createTextVNode("\u5426")
                ]),
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "hideHeader",
                    type: "radio",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => saasWebInfoDefault.hideHeader = $event),
                    value: true
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.hideHeader]
                  ]),
                  vue$1.createTextVNode("\u662F")
                ])
              ])
            ]),
            vue$1.createElementVNode("div", _hoisted_18, [
              _hoisted_19,
              vue$1.createElementVNode("div", _hoisted_20, [
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "ajax",
                    type: "radio",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => saasWebInfoDefault.ajax = $event),
                    value: false
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.ajax]
                  ]),
                  vue$1.createTextVNode("\u7EBF\u4E0A")
                ]),
                vue$1.createElementVNode("label", null, [
                  vue$1.withDirectives(vue$1.createElementVNode("input", {
                    name: "ajax",
                    type: "radio",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => saasWebInfoDefault.ajax = $event),
                    value: true
                  }, null, 512), [
                    [vue$1.vModelRadio, saasWebInfoDefault.ajax]
                  ]),
                  vue$1.createTextVNode("\u672C\u5730")
                ])
              ])
            ]),
            vue$1.createElementVNode("div", _hoisted_21, [
              _hoisted_22,
              vue$1.createElementVNode("div", _hoisted_23, [
                vue$1.withDirectives(vue$1.createElementVNode("input", {
                  type: "text",
                  class: "input_text",
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => saasWebInfoDefault.authorizationName = $event),
                  placeholder: "\u4E0D\u586B\u4F7F\u7528\u9ED8\u8BA4\u503C"
                }, null, 512), [
                  [vue$1.vModelText, saasWebInfoDefault.authorizationName]
                ])
              ])
            ]),
            vue$1.createElementVNode("div", _hoisted_24, [
              _hoisted_25,
              vue$1.createElementVNode("div", {
                class: "setting-content",
                title: saasWebInfoDefault.localUrl + saasWebInfoDefault.authorizationId
              }, [
                vue$1.createElementVNode("p", {
                  textContent: vue$1.toDisplayString(saasWebInfoDefault.serverName + "/" + saasWebInfoDefault.authorizationId)
                }, null, 8, _hoisted_27)
              ], 8, _hoisted_26)
            ])
          ], 512), [
            [vue$1.vShow, saasWeb_available.value]
          ]),
          vue$1.withDirectives(vue$1.createElementVNode("div", _hoisted_28, [
            vue$1.createElementVNode("span", {
              onClick: _cache[10] || (_cache[10] = ($event) => save())
            }, vue$1.toDisplayString(vue$1.unref(proxyStatus) ? "\u8DF3\u8F6C\u81F3\u8C03\u8BD5\u9875\u9762" : "\u4FDD\u5B58\u914D\u7F6E"), 1)
          ], 512), [
            [vue$1.vShow, saasWeb_available.value]
          ])
        ]);
      };
    }
  });
  const setting_vue_vue_type_style_index_0_scoped_909a43a7_lang = "";
  const settingCoComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-909a43a7"]]);
  let realWidth = vue$1.ref();
  const position = vue$1.computed(() => {
    var _a, _b;
    const bodyWidth = (_b = (_a = document == null ? void 0 : document.body) == null ? void 0 : _a.clientWidth) != null ? _b : 0;
    const bodyHight2 = document.documentElement.clientHeight;
    let boxTop = mkApi.BOX_TOP.get();
    let boxLeft = mkApi.BOX_LEFT.get();
    if (realWidth.value && realWidth.value + boxLeft - bodyWidth > 0) {
      return {
        boxTop: boxTop + "px",
        boxLeft: bodyWidth - realWidth.value + "px"
      };
    }
    if (boxTop < 0 || boxTop > bodyWidth || boxTop > bodyHight2 || boxTop < 0) {
      return {
        boxTop: "20px",
        boxLeft: "20px"
      };
    }
    return {
      boxTop: boxTop + "px",
      boxLeft: boxLeft + "px"
    };
  });
  const _hoisted_1 = { class: "monkey-home-wrap" };
  const _hoisted_2 = { class: "monkey-name" };
  const _hoisted_3 = { class: "monkey-arrow" };
  const _hoisted_4 = {
    key: 0,
    class: "monkey-menu-wrap"
  };
  const _sfc_main = /* @__PURE__ */ vue$1.defineComponent({
    __name: "App",
    setup(__props) {
      const routerName = vue$1.ref("---/---");
      const proxyStatus = vue$1.computed(() => {
        return routerApi.getProxyStatus();
      });
      const box = vue$1.ref();
      vue$1.onMounted(() => {
        realWidth.value = box.value.clientWidth;
        routerName.value = routerApi.getActiveName();
        if (location.href.includes("localhost")) {
          mkApi.ACTIVE_PATHNAME.set(location.host);
        }
      });
      document.addEventListener("click", () => {
        createBoxWarp(box.value, null);
      });
      function refreshByUnHealthStatus() {
        if (proxyStatus.value && !mkApi.SAAS_WEB_DEBUG_AVAILABLE.get()) {
          if (confirm("saasweb\u8C03\u8BD5\u72B6\u6001\u5F02\u5E38\uFF01\u8BF7\u5237\u65B0\u9875\u9762\uFF01")) {
            location.reload();
          }
        }
      }
      const refreshApi = {
        reLoad: () => {
          mkApi.REFRESH.set(true);
          location.href = location.href;
        },
        deleteStorage: () => {
          const refreshStatus = mkApi.REFRESH.get();
          if (refreshStatus) {
            localStorage.clear();
            sessionStorage.clear();
            let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            for (var i = keys.length; i--; )
              document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
          }
          mkApi.REFRESH.set(false);
        }
      };
      window.addEventListener("unload", () => {
        refreshApi.deleteStorage();
        if (location.href.includes("localhost")) {
          mkApi.ACTIVE_PATHNAME.set("");
        }
      });
      window.addEventListener("popstate", () => {
        const saasWeb_available = mkApi.SAAS_WEB_DEBUG_AVAILABLE.get();
        const saasWebInfo = mkApi.SAAS_WEB_DEBUG_INFO.get();
        if (!saasWeb_available && proxyStatus)
          return location.reload();
        if (saasWeb_available && proxyStatus && location.href.includes(saasWebInfo.serverName)) {
          location.reload();
        }
        setTimeout(() => {
          routerName.value = routerApi.getActiveName();
        }, 1e3);
      });
      const nameWrapVisible = vue$1.ref(false);
      const mouseenterMoveBtn = () => {
        createBoxWarp(box.value, null);
        nameWrapVisible.value = true;
      };
      return (_ctx, _cache) => {
        const _directive_icon = vue$1.resolveDirective("icon");
        const _directive_color = vue$1.resolveDirective("color");
        const _directive_drag = vue$1.resolveDirective("drag");
        return vue$1.withDirectives((vue$1.openBlock(), vue$1.createElementBlock("div", {
          class: vue$1.normalizeClass(["monkey-wrap", { proxy: vue$1.unref(proxyStatus) }]),
          ref_key: "box",
          ref: box,
          onMousemove: refreshByUnHealthStatus,
          style: vue$1.normalizeStyle({ top: vue$1.unref(position).boxTop, left: vue$1.unref(position).boxLeft }),
          onMouseleave: _cache[4] || (_cache[4] = ($event) => nameWrapVisible.value = false)
        }, [
          vue$1.createElementVNode("div", _hoisted_1, [
            vue$1.withDirectives(vue$1.createElementVNode("span", {
              class: "icon v-drag-handle",
              onMouseenter: _cache[0] || (_cache[0] = ($event) => mouseenterMoveBtn())
            }, null, 544), [
              [_directive_icon, [vue$1.unref(home), vue$1.unref(proxyStatus) ? "#c00" : ""]]
            ]),
            vue$1.createVNode(vue$1.Transition, { name: "name-wrap" }, {
              default: vue$1.withCtx(() => [
                nameWrapVisible.value ? (vue$1.openBlock(), vue$1.createElementBlock("div", {
                  key: 0,
                  class: "monkey-name-wrap",
                  onMouseenter: _cache[1] || (_cache[1] = ($event) => vue$1.unref(createBoxWarp)(box.value, routerComponent))
                }, [
                  vue$1.createElementVNode("span", _hoisted_2, vue$1.toDisplayString(routerName.value), 1),
                  vue$1.withDirectives(vue$1.createElementVNode("span", _hoisted_3, null, 512), [
                    [_directive_icon, [vue$1.unref(arrow), vue$1.unref(proxyStatus) ? "#c00" : ""]]
                  ])
                ], 32)) : vue$1.createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          vue$1.createVNode(vue$1.Transition, { name: "btn-wrap" }, {
            default: vue$1.withCtx(() => [
              nameWrapVisible.value ? (vue$1.openBlock(), vue$1.createElementBlock("div", _hoisted_4, [
                vue$1.withDirectives(vue$1.createElementVNode("span", {
                  class: "icon",
                  onClick: _cache[2] || (_cache[2] = (...args) => refreshApi.reLoad && refreshApi.reLoad(...args))
                }, null, 512), [
                  [_directive_icon, [vue$1.unref(refresh), vue$1.unref(proxyStatus) ? "#ffe6e6" : ""]],
                  [_directive_color, vue$1.unref(proxyStatus)]
                ]),
                vue$1.withDirectives(vue$1.createElementVNode("span", {
                  class: "icon",
                  onMouseenter: _cache[3] || (_cache[3] = ($event) => vue$1.unref(createBoxWarp)(box.value, settingCoComponent))
                }, null, 544), [
                  [_directive_icon, [vue$1.unref(setting), vue$1.unref(proxyStatus) ? "#ffe6e6" : ""]],
                  [_directive_color, vue$1.unref(proxyStatus)]
                ])
              ])) : vue$1.createCommentVNode("", true)
            ]),
            _: 1
          })
        ], 38)), [
          [_directive_drag]
        ]);
      };
    }
  });
  const App_vue_vue_type_style_index_0_scoped_c9827b3a_lang = "";
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c9827b3a"]]);
  const directive$1 = {
    beforeMount(el) {
      const dragBox = el;
      const dragArea = el.getElementsByClassName("v-drag-handle").length > 0 ? el.getElementsByClassName("v-drag-handle")[0] : el;
      const bodyWidth = document.body.clientWidth;
      const bodyHight2 = document.documentElement.clientHeight;
      dragArea.onmousedown = (e) => {
        let domLeft = dragBox.offsetLeft;
        let domTop = dragBox.offsetTop;
        e.preventDefault();
        e.stopPropagation();
        let mouseX = e.clientX - domLeft;
        let mouseY = e.clientY - domTop;
        const domWidth = dragBox.offsetWidth;
        const domHeight = dragBox.offsetHeight;
        document.onmousemove = (e2) => {
          let domCenterLeft = e2.clientX - mouseX;
          let domCenterTop = e2.clientY - mouseY;
          dragBox.style.left = domCenterLeft + "px";
          dragBox.style.top = domCenterTop + "px";
          domLeft = dragBox.offsetLeft;
          domTop = dragBox.offsetTop;
          let domRight = bodyWidth - domLeft - domWidth;
          let domBottom = bodyHight2 - domHeight - domTop;
          if (domRight <= 0) {
            dragBox.style.left = bodyWidth - domWidth + "px";
          }
          if (domBottom < 0) {
            dragBox.style.top = bodyHight2 - domHeight + "px";
          }
          if (domLeft < 0) {
            dragBox.style.left = 0;
          }
          if (domTop < 0) {
            dragBox.style.top = 0;
          }
        };
        document.onmouseup = (e2) => {
          e2.preventDefault();
          document.onmousemove = null;
          document.onmouseup = null;
          GM_setObject("BOX_LEFT", dragBox.offsetLeft);
          GM_setObject("BOX_TOP", dragBox.offsetTop);
        };
      };
    }
  };
  const drag = {
    install: function(app) {
      app.directive("drag", directive$1);
    }
  };
  const color = {
    beforeMount(el, binding) {
      const wrapDom = el;
      const path = el.querySelector("path");
      wrapDom.onmouseenter = function() {
        path.style.fill = binding.value ? "#c00" : "rgb(0, 101, 179)";
      };
      wrapDom.onmouseleave = function() {
        path.style.fill = binding.value ? "#ffe6e6" : "#C7CBCF";
      };
    }
  };
  const directives$1 = {
    install: function(app) {
      app.directive("color", color);
    }
  };
  const icon = {
    beforeMount(el, binding) {
      if (typeof binding.value === "string") {
        el.innerHTML = binding.value;
      } else {
        const code = binding.value[0];
        const color2 = binding.value[1];
        el.innerHTML = color2 ? code.replace(/fill=".*"/, `fill="${color2}"`) : code;
      }
    }
  };
  const directives = {
    install: function(app) {
      app.directive("icon", icon);
    }
  };
  const directive = {
    install: function(app) {
      app.use(drag);
      app.use(directives$1);
      app.use(directives);
    }
  };
  const render = (visible) => {
    visible && vue$1.createApp(App).use(directive).mount(
      (() => {
        const el = document.createElement("div");
        document.body.append(el);
        return el;
      })()
    );
  };
  monkeyTool.registerMenuCommand();
  const injectTool = monkeyTool.inject();
  if (injectTool) {
    hookStart.saas_web_fetch_hook();
    hookStart.xhr_Hook();
    hookEnd();
    unsafeWindow.addEventListener("load", () => {
      if (location.href.includes("login") && !location.href.includes("localhost")) {
        sessionStorage.clear();
      }
      hookStart.xhr_Hook();
      routerApi.start();
      setTimeout(() => {
        const visible = monkeyTool.visible();
        render(visible);
      }, 1e3);
    });
  }
})(Vue);
