// ==UserScript==
// @description 基于 flv.js 的斗鱼HTML5播放器.
// @icon https://ojiju7xvu.qnssl.com/d5hp/icon.png
// @name 斗鱼HTML5播放器
// @require https://cdn.bootcss.com/flv.js/1.3.3/flv.min.js
// @namespace http://imspace.cn/gms
// @run-at document_end
// @version 0.7.4
// @grant GM_xmlhttpRequest
// @match *://*.douyu.com/*
// @downloadURL https://update.greasyfork.org/scripts/26901/%E6%96%97%E9%B1%BCHTML5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/26901/%E6%96%97%E9%B1%BCHTML5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

class GMXMLHttpRequest {
  constructor () {
    this.config = {
      headers: {}
    }
    this.xhr = null
  }
  open (method, url) {
    this.config.method = method
    this.config.url = url
  }
  send () {
    for (let key of Object.keys(this)) {
      if (key === 'config') continue
      if (key.substr(0, 2) === 'on') {
        this.config[key] = this.wrapper(this[key])
      } else {
        this.config[key] = this[key]
      }
    }
    this.xhr = GM_xmlhttpRequest(this.config)
  }
  setRequestHeader (key, value) {
    this.config.headers[key] = value
  }
  abort () {
    this.xhr && this.xhr.abort()
  }
  wrapper (func) {
    return e => {
      e.target = this.xhr
      if (e.response) {
        e.target.response = e.response
      }
      func(e)
    }
  }
  get status () {
    return this.xhr ? this.xhr.status : 0
  }
  get readyState () {
    return this.xhr ? this.xhr.readyState : 0
  }
}
window.fetch = function (url, config) {
  let conf = {}
  Object.assign(conf, config || { method: 'GET' })
  conf.url = url
  conf.data = config ? config.body : null
  conf.responseType = 'arraybuffer'
  return new Promise((resolve, reject) => {
    conf.onload = (response) => {
      if (response.status === 200) {
        resolve({
          json () {
            const enc = new TextDecoder('utf-8')
            return Promise.resolve(JSON.parse(enc.decode(new Uint8Array(response.response))))
          },
          arrayBuffer () {
            return Promise.resolve(response.response)
          }
        })
      } else {
        reject(response)
      }
    }
    GM_xmlhttpRequest(conf)
  })
}
window.XMLHttpRequest = GMXMLHttpRequest
window.__space_inject = {script: "(function (global, factory) {\n"+
"    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :\n"+
"    typeof define === 'function' && define.amd ? define(factory) :\n"+
"    (factory());\n"+
"}(this, (function () { 'use strict';\n"+
"\n"+
"  /*! *****************************************************************************\r\n"+
"  Copyright (c) Microsoft Corporation. All rights reserved.\r\n"+
"  Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use\r\n"+
"  this file except in compliance with the License. You may obtain a copy of the\r\n"+
"  License at http://www.apache.org/licenses/LICENSE-2.0\r\n"+
"\r\n"+
"  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\r\n"+
"  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\r\n"+
"  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\r\n"+
"  MERCHANTABLITY OR NON-INFRINGEMENT.\r\n"+
"\r\n"+
"  See the Apache Version 2.0 License for specific language governing permissions\r\n"+
"  and limitations under the License.\r\n"+
"  ***************************************************************************** */\r\n"+
"  /* global Reflect, Promise */\r\n"+
"\r\n"+
"  var extendStatics = Object.setPrototypeOf ||\r\n"+
"      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n"+
"      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  function __decorate(decorators, target, key, desc) {\r\n"+
"      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n"+
"      if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n"+
"      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n"+
"      return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  function __awaiter(thisArg, _arguments, P, generator) {\r\n"+
"      return new (P || (P = Promise))(function (resolve, reject) {\r\n"+
"          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n"+
"          function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }\r\n"+
"          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n"+
"          step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n"+
"      });\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  function __read(o, n) {\r\n"+
"      var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n"+
"      if (!m) return o;\r\n"+
"      var i = m.call(o), r, ar = [], e;\r\n"+
"      try {\r\n"+
"          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n"+
"      }\r\n"+
"      catch (error) { e = { error: error }; }\r\n"+
"      finally {\r\n"+
"          try {\r\n"+
"              if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n"+
"          }\r\n"+
"          finally { if (e) throw e.error; }\r\n"+
"      }\r\n"+
"      return ar;\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  function __await(v) {\r\n"+
"      return this instanceof __await ? (this.v = v, this) : new __await(v);\r\n"+
"  }\n"+
"\n"+
"  class JSocket {\r\n"+
"      static init() {\r\n"+
"          return __awaiter(this, void 0, void 0, function* () {\r\n"+
"              const src = 'https://imspace.nos-eastchina1.126.net/JSocket2.swf';\r\n"+
"              const flash = ['<object type=\"application/x-shockwave-flash\" ', 'id=\"jsocket\" ', 'name=\"jsocket\" ', 'align=\"middle\" ', 'allowscriptaccess=\"always\" ', 'allowfullscreen=\"true\" ', 'allowfullscreeninteractive=\"true\" ', 'wmode=\"transparent\" ', 'data=\"' + src + '\" ', 'width=\"100%\" ', 'height=\"100%\">', '<param name=\"src\" value=\"' + src + '\">', '<param name=\"quality\" value=\"high\">', '<param name=\"bgcolor\" value=\"#fff\">', '<param name=\"allowscriptaccess\" value=\"always\">', '<param name=\"allowfullscreen\" value=\"true\">', '<param name=\"wmode\" value=\"transparent\">', '<param name=\"allowFullScreenInteractive\" value=\"true\">', '<param name=\"flashvars\" value=\"\">', \"</object>\"].join(\"\");\r\n"+
"              let div = document.createElement('div');\r\n"+
"              div.className = 'jsocket-cls';\r\n"+
"              document.body.appendChild(div);\r\n"+
"              JSocket.el = div;\r\n"+
"              div.innerHTML = flash;\r\n"+
"              var api = document.querySelector('#jsocket');\r\n"+
"              console.log(div, api);\r\n"+
"              JSocket.flashapi = api;\r\n"+
"              if (JSocket.flashapi.newsocket) {\r\n"+
"                  return;\r\n"+
"              }\r\n"+
"              else {\r\n"+
"                  return new Promise((res, rej) => {\r\n"+
"                      const id = setTimeout(rej, 10 * 1000);\r\n"+
"                      JSocket.swfloadedcb = () => {\r\n"+
"                          clearTimeout(id);\r\n"+
"                          res();\r\n"+
"                      };\r\n"+
"                  });\r\n"+
"              }\r\n"+
"          });\r\n"+
"      }\r\n"+
"      static swfloaded() {\r\n"+
"          JSocket.swfloadedcb();\r\n"+
"      }\r\n"+
"      static connectHandler(socid) {\r\n"+
"          JSocket.handlers[socid].connectHandler();\r\n"+
"      }\r\n"+
"      static dataHandler(socid, data) {\r\n"+
"          try {\r\n"+
"              JSocket.handlers[socid].dataHandler(atob(data));\r\n"+
"          }\r\n"+
"          catch (e) {\r\n"+
"              console.error(e);\r\n"+
"          }\r\n"+
"      }\r\n"+
"      static closeHandler(socid) {\r\n"+
"          JSocket.handlers[socid].closeHandler();\r\n"+
"      }\r\n"+
"      static errorHandler(socid, str) {\r\n"+
"          JSocket.handlers[socid].errorHandler(str);\r\n"+
"      }\r\n"+
"      init(handlers, newsocketopt) {\r\n"+
"          this.socid = JSocket.flashapi.newsocket(newsocketopt);\r\n"+
"          JSocket.handlers[this.socid] = handlers;\r\n"+
"      }\r\n"+
"      connect(host, port) {\r\n"+
"          JSocket.flashapi.connect(this.socid, host, port);\r\n"+
"      }\r\n"+
"      write(data) {\r\n"+
"          JSocket.flashapi.write(this.socid, btoa(data));\r\n"+
"      }\r\n"+
"      writeFlush(data) {\r\n"+
"          JSocket.flashapi.writeFlush(this.socid, btoa(data));\r\n"+
"      }\r\n"+
"      close() {\r\n"+
"          JSocket.flashapi.close(this.socid);\r\n"+
"      }\r\n"+
"      flush() {\r\n"+
"          JSocket.flashapi.flush(this.socid);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  JSocket.VERSION = '0.1';\r\n"+
"  JSocket.handlers = [];\r\n"+
"  window.JSocket = JSocket;\n"+
"\n"+
"  function utf8ToUtf16(utf8_bytes) {\r\n"+
"      let unicode_codes = [];\r\n"+
"      let unicode_code = 0;\r\n"+
"      let num_followed = 0;\r\n"+
"      for (let i = 0; i < utf8_bytes.length; ++i) {\r\n"+
"          let utf8_byte = utf8_bytes[i];\r\n"+
"          if (utf8_byte >= 0x100) {\r\n"+
"          }\r\n"+
"          else if ((utf8_byte & 0xC0) == 0x80) {\r\n"+
"              if (num_followed > 0) {\r\n"+
"                  unicode_code = (unicode_code << 6) | (utf8_byte & 0x3f);\r\n"+
"                  num_followed -= 1;\r\n"+
"              }\r\n"+
"              else {\r\n"+
"              }\r\n"+
"          }\r\n"+
"          else {\r\n"+
"              if (num_followed == 0) {\r\n"+
"                  unicode_codes.push(unicode_code);\r\n"+
"              }\r\n"+
"              else {\r\n"+
"              }\r\n"+
"              if (utf8_byte < 0x80) {\r\n"+
"                  unicode_code = utf8_byte;\r\n"+
"                  num_followed = 0;\r\n"+
"              }\r\n"+
"              else if ((utf8_byte & 0xE0) == 0xC0) {\r\n"+
"                  unicode_code = utf8_byte & 0x1f;\r\n"+
"                  num_followed = 1;\r\n"+
"              }\r\n"+
"              else if ((utf8_byte & 0xF0) == 0xE0) {\r\n"+
"                  unicode_code = utf8_byte & 0x0f;\r\n"+
"                  num_followed = 2;\r\n"+
"              }\r\n"+
"              else if ((utf8_byte & 0xF8) == 0xF0) {\r\n"+
"                  unicode_code = utf8_byte & 0x07;\r\n"+
"                  num_followed = 3;\r\n"+
"              }\r\n"+
"              else {\r\n"+
"              }\r\n"+
"          }\r\n"+
"      }\r\n"+
"      if (num_followed == 0) {\r\n"+
"          unicode_codes.push(unicode_code);\r\n"+
"      }\r\n"+
"      else {\r\n"+
"      }\r\n"+
"      unicode_codes.shift();\r\n"+
"      let utf16_codes = [];\r\n"+
"      for (var i = 0; i < unicode_codes.length; ++i) {\r\n"+
"          unicode_code = unicode_codes[i];\r\n"+
"          if (unicode_code < (1 << 16)) {\r\n"+
"              utf16_codes.push(unicode_code);\r\n"+
"          }\r\n"+
"          else {\r\n"+
"              var first = ((unicode_code - (1 << 16)) / (1 << 10)) + 0xD800;\r\n"+
"              var second = (unicode_code % (1 << 10)) + 0xDC00;\r\n"+
"              utf16_codes.push(first);\r\n"+
"              utf16_codes.push(second);\r\n"+
"          }\r\n"+
"      }\r\n"+
"      return utf16_codes;\r\n"+
"  }\r\n"+
"  function utf8_to_ascii(str) {\r\n"+
"      const char2bytes = (unicode_code) => {\r\n"+
"          let utf8_bytes = [];\r\n"+
"          if (unicode_code < 0x80) {\r\n"+
"              utf8_bytes.push(unicode_code);\r\n"+
"          }\r\n"+
"          else if (unicode_code < (1 << 11)) {\r\n"+
"              utf8_bytes.push((unicode_code >>> 6) | 0xC0);\r\n"+
"              utf8_bytes.push((unicode_code & 0x3F) | 0x80);\r\n"+
"          }\r\n"+
"          else if (unicode_code < (1 << 16)) {\r\n"+
"              utf8_bytes.push((unicode_code >>> 12) | 0xE0);\r\n"+
"              utf8_bytes.push(((unicode_code >> 6) & 0x3f) | 0x80);\r\n"+
"              utf8_bytes.push((unicode_code & 0x3F) | 0x80);\r\n"+
"          }\r\n"+
"          else if (unicode_code < (1 << 21)) {\r\n"+
"              utf8_bytes.push((unicode_code >>> 18) | 0xF0);\r\n"+
"              utf8_bytes.push(((unicode_code >> 12) & 0x3F) | 0x80);\r\n"+
"              utf8_bytes.push(((unicode_code >> 6) & 0x3F) | 0x80);\r\n"+
"              utf8_bytes.push((unicode_code & 0x3F) | 0x80);\r\n"+
"          }\r\n"+
"          return utf8_bytes;\r\n"+
"      };\r\n"+
"      let o = [];\r\n"+
"      for (let i = 0; i < str.length; i++) {\r\n"+
"          o = o.concat(char2bytes(str.charCodeAt(i)));\r\n"+
"      }\r\n"+
"      return o.map(i => String.fromCharCode(i)).join('');\r\n"+
"  }\r\n"+
"  function ascii_to_utf8(str) {\r\n"+
"      let bytes = str.split('').map(i => i.charCodeAt(0));\r\n"+
"      return utf8ToUtf16(bytes).map(i => String.fromCharCode(i)).join('');\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"  function getURL(src) {\r\n"+
"      if (src.substr(0, 5) !== 'blob:') {\r\n"+
"          src = chrome.runtime.getURL(src);\r\n"+
"      }\r\n"+
"      return src;\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  const p32 = (i) => [i, i / 256, i / 65536, i / 16777216].map(i => String.fromCharCode(Math.floor(i) % 256)).join('');\r\n"+
"  const u32 = (s) => s.split('').map(i => i.charCodeAt(0)).reduce((a, b) => b * 256 + a);\r\n"+
"  let messageMap = {};\r\n"+
"  function onMessage(type, cb) {\r\n"+
"      messageMap[type] = cb;\r\n"+
"  }\r\n"+
"  function postMessage(type, data) {\r\n"+
"      window.postMessage({\r\n"+
"          type: type,\r\n"+
"          data: data\r\n"+
"      }, \"*\");\r\n"+
"  }\r\n"+
"  let msgCallbacks = [];\r\n"+
"  let lastCbId = 0;\r\n"+
"\r\n"+
"  window.addEventListener('message', (event) => __awaiter(window, void 0, void 0, function* () {\r\n"+
"      const data = event.data;\r\n"+
"      if (data.cb) {\r\n"+
"          let cb = msgCallbacks[data.cbId];\r\n"+
"          if (cb && (typeof cb === 'function')) {\r\n"+
"              cb(data.cbResult);\r\n"+
"          }\r\n"+
"      }\r\n"+
"      else if (data.type) {\r\n"+
"          let result = undefined;\r\n"+
"          if (typeof messageMap[data.type] === 'function') {\r\n"+
"              result = messageMap[data.type](data.data);\r\n"+
"              if (result instanceof Promise) {\r\n"+
"                  result = yield result;\r\n"+
"              }\r\n"+
"              if (data.cbId) {\r\n"+
"                  window.postMessage({\r\n"+
"                      cb: true,\r\n"+
"                      cbId: data.cbId,\r\n"+
"                      cbResult: result\r\n"+
"                  }, '*');\r\n"+
"              }\r\n"+
"          }\r\n"+
"      }\r\n"+
"  }), false);\r\n"+
"  function retry(promise, times) {\r\n"+
"      return __awaiter(this, void 0, void 0, function* () {\r\n"+
"          let err = [];\r\n"+
"          for (let i = 0; i < times; i++) {\r\n"+
"              try {\r\n"+
"                  return yield promise();\r\n"+
"              }\r\n"+
"              catch (e) {\r\n"+
"                  err.push(e);\r\n"+
"              }\r\n"+
"          }\r\n"+
"          throw err;\r\n"+
"      });\r\n"+
"  }\r\n"+
"  function getSync() {\r\n"+
"      return new Promise((res, rej) => {\r\n"+
"          if (chrome && chrome.storage && chrome.storage.sync) {\r\n"+
"              chrome.storage.sync.get(items => {\r\n"+
"                  res(items);\r\n"+
"              });\r\n"+
"          }\r\n"+
"          else {\r\n"+
"              rej(new Error('不支持的存储方式'));\r\n"+
"          }\r\n"+
"      });\r\n"+
"  }\r\n"+
"\r\n"+
"\r\n"+
"\r\n"+
"  const defaultBgListener = (request) => __awaiter(window, void 0, void 0, function* () { return null; });\r\n"+
"  let bgListener = defaultBgListener;\n"+
"\n"+
"  function md5cycle(x, k) {\r\n"+
"      var a = x[0], b = x[1], c = x[2], d = x[3];\r\n"+
"      a = ff(a, b, c, d, k[0], 7, -680876936);\r\n"+
"      d = ff(d, a, b, c, k[1], 12, -389564586);\r\n"+
"      c = ff(c, d, a, b, k[2], 17, 606105819);\r\n"+
"      b = ff(b, c, d, a, k[3], 22, -1044525330);\r\n"+
"      a = ff(a, b, c, d, k[4], 7, -176418897);\r\n"+
"      d = ff(d, a, b, c, k[5], 12, 1200080426);\r\n"+
"      c = ff(c, d, a, b, k[6], 17, -1473231341);\r\n"+
"      b = ff(b, c, d, a, k[7], 22, -45705983);\r\n"+
"      a = ff(a, b, c, d, k[8], 7, 1770035416);\r\n"+
"      d = ff(d, a, b, c, k[9], 12, -1958414417);\r\n"+
"      c = ff(c, d, a, b, k[10], 17, -42063);\r\n"+
"      b = ff(b, c, d, a, k[11], 22, -1990404162);\r\n"+
"      a = ff(a, b, c, d, k[12], 7, 1804603682);\r\n"+
"      d = ff(d, a, b, c, k[13], 12, -40341101);\r\n"+
"      c = ff(c, d, a, b, k[14], 17, -1502002290);\r\n"+
"      b = ff(b, c, d, a, k[15], 22, 1236535329);\r\n"+
"      a = gg(a, b, c, d, k[1], 5, -165796510);\r\n"+
"      d = gg(d, a, b, c, k[6], 9, -1069501632);\r\n"+
"      c = gg(c, d, a, b, k[11], 14, 643717713);\r\n"+
"      b = gg(b, c, d, a, k[0], 20, -373897302);\r\n"+
"      a = gg(a, b, c, d, k[5], 5, -701558691);\r\n"+
"      d = gg(d, a, b, c, k[10], 9, 38016083);\r\n"+
"      c = gg(c, d, a, b, k[15], 14, -660478335);\r\n"+
"      b = gg(b, c, d, a, k[4], 20, -405537848);\r\n"+
"      a = gg(a, b, c, d, k[9], 5, 568446438);\r\n"+
"      d = gg(d, a, b, c, k[14], 9, -1019803690);\r\n"+
"      c = gg(c, d, a, b, k[3], 14, -187363961);\r\n"+
"      b = gg(b, c, d, a, k[8], 20, 1163531501);\r\n"+
"      a = gg(a, b, c, d, k[13], 5, -1444681467);\r\n"+
"      d = gg(d, a, b, c, k[2], 9, -51403784);\r\n"+
"      c = gg(c, d, a, b, k[7], 14, 1735328473);\r\n"+
"      b = gg(b, c, d, a, k[12], 20, -1926607734);\r\n"+
"      a = hh(a, b, c, d, k[5], 4, -378558);\r\n"+
"      d = hh(d, a, b, c, k[8], 11, -2022574463);\r\n"+
"      c = hh(c, d, a, b, k[11], 16, 1839030562);\r\n"+
"      b = hh(b, c, d, a, k[14], 23, -35309556);\r\n"+
"      a = hh(a, b, c, d, k[1], 4, -1530992060);\r\n"+
"      d = hh(d, a, b, c, k[4], 11, 1272893353);\r\n"+
"      c = hh(c, d, a, b, k[7], 16, -155497632);\r\n"+
"      b = hh(b, c, d, a, k[10], 23, -1094730640);\r\n"+
"      a = hh(a, b, c, d, k[13], 4, 681279174);\r\n"+
"      d = hh(d, a, b, c, k[0], 11, -358537222);\r\n"+
"      c = hh(c, d, a, b, k[3], 16, -722521979);\r\n"+
"      b = hh(b, c, d, a, k[6], 23, 76029189);\r\n"+
"      a = hh(a, b, c, d, k[9], 4, -640364487);\r\n"+
"      d = hh(d, a, b, c, k[12], 11, -421815835);\r\n"+
"      c = hh(c, d, a, b, k[15], 16, 530742520);\r\n"+
"      b = hh(b, c, d, a, k[2], 23, -995338651);\r\n"+
"      a = ii(a, b, c, d, k[0], 6, -198630844);\r\n"+
"      d = ii(d, a, b, c, k[7], 10, 1126891415);\r\n"+
"      c = ii(c, d, a, b, k[14], 15, -1416354905);\r\n"+
"      b = ii(b, c, d, a, k[5], 21, -57434055);\r\n"+
"      a = ii(a, b, c, d, k[12], 6, 1700485571);\r\n"+
"      d = ii(d, a, b, c, k[3], 10, -1894986606);\r\n"+
"      c = ii(c, d, a, b, k[10], 15, -1051523);\r\n"+
"      b = ii(b, c, d, a, k[1], 21, -2054922799);\r\n"+
"      a = ii(a, b, c, d, k[8], 6, 1873313359);\r\n"+
"      d = ii(d, a, b, c, k[15], 10, -30611744);\r\n"+
"      c = ii(c, d, a, b, k[6], 15, -1560198380);\r\n"+
"      b = ii(b, c, d, a, k[13], 21, 1309151649);\r\n"+
"      a = ii(a, b, c, d, k[4], 6, -145523070);\r\n"+
"      d = ii(d, a, b, c, k[11], 10, -1120210379);\r\n"+
"      c = ii(c, d, a, b, k[2], 15, 718787259);\r\n"+
"      b = ii(b, c, d, a, k[9], 21, -343485551);\r\n"+
"      x[0] = add32(a, x[0]);\r\n"+
"      x[1] = add32(b, x[1]);\r\n"+
"      x[2] = add32(c, x[2]);\r\n"+
"      x[3] = add32(d, x[3]);\r\n"+
"  }\r\n"+
"  function cmn(q, a, b, x, s, t) {\r\n"+
"      a = add32(add32(a, q), add32(x, t));\r\n"+
"      return add32((a << s) | (a >>> (32 - s)), b);\r\n"+
"  }\r\n"+
"  function ff(a, b, c, d, x, s, t) {\r\n"+
"      return cmn((b & c) | ((~b) & d), a, b, x, s, t);\r\n"+
"  }\r\n"+
"  function gg(a, b, c, d, x, s, t) {\r\n"+
"      return cmn((b & d) | (c & (~d)), a, b, x, s, t);\r\n"+
"  }\r\n"+
"  function hh(a, b, c, d, x, s, t) {\r\n"+
"      return cmn(b ^ c ^ d, a, b, x, s, t);\r\n"+
"  }\r\n"+
"  function ii(a, b, c, d, x, s, t) {\r\n"+
"      return cmn(c ^ (b | (~d)), a, b, x, s, t);\r\n"+
"  }\r\n"+
"  function md51(s) {\r\n"+
"      var txt = '';\r\n"+
"      var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;\r\n"+
"      for (i = 64; i <= s.length; i += 64) {\r\n"+
"          md5cycle(state, md5blk(s.substring(i - 64, i)));\r\n"+
"      }\r\n"+
"      s = s.substring(i - 64);\r\n"+
"      var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];\r\n"+
"      for (i = 0; i < s.length; i++)\r\n"+
"          tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);\r\n"+
"      tail[i >> 2] |= 0x80 << ((i % 4) << 3);\r\n"+
"      if (i > 55) {\r\n"+
"          md5cycle(state, tail);\r\n"+
"          for (i = 0; i < 16; i++)\r\n"+
"              tail[i] = 0;\r\n"+
"      }\r\n"+
"      tail[14] = n * 8;\r\n"+
"      md5cycle(state, tail);\r\n"+
"      return state;\r\n"+
"  }\r\n"+
"  function md5blk(s) {\r\n"+
"      var md5blks = [], i;\r\n"+
"      for (i = 0; i < 64; i += 4) {\r\n"+
"          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);\r\n"+
"      }\r\n"+
"      return md5blks;\r\n"+
"  }\r\n"+
"  var hex_chr = '0123456789abcdef'.split('');\r\n"+
"  function rhex(n) {\r\n"+
"      var s = '', j = 0;\r\n"+
"      for (; j < 4; j++)\r\n"+
"          s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];\r\n"+
"      return s;\r\n"+
"  }\r\n"+
"  function hex(x) {\r\n"+
"      return x.map(rhex).join('');\r\n"+
"  }\r\n"+
"  function md5(s) {\r\n"+
"      return hex(md51(s));\r\n"+
"  }\r\n"+
"  var add32 = function (a, b) {\r\n"+
"      return (a + b) & 0xFFFFFFFF;\r\n"+
"  };\r\n"+
"  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {\r\n"+
"      add32 = function (x, y) {\r\n"+
"          var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16) + (lsw >> 16);\r\n"+
"          return (msw << 16) | (lsw & 0xFFFF);\r\n"+
"      };\r\n"+
"  }\n"+
"\n"+
"  const getACF = (key) => {\r\n"+
"      try {\r\n"+
"          return new RegExp(`acf_${key}=(.*?);`).exec(document.cookie)[1];\r\n"+
"      }\r\n"+
"      catch (e) {\r\n"+
"          return '';\r\n"+
"      }\r\n"+
"  };\r\n"+
"  function filterEnc(s) {\r\n"+
"      s = s.toString();\r\n"+
"      s = s.replace(/@/g, '@A');\r\n"+
"      return s.replace(/\\//g, '@S');\r\n"+
"  }\r\n"+
"  function filterDec(s) {\r\n"+
"      s = s.toString();\r\n"+
"      s = s.replace(/@S/g, '/');\r\n"+
"      return s.replace(/@A/g, '@');\r\n"+
"  }\r\n"+
"  function douyuEncode(data) {\r\n"+
"      return Object.keys(data).map(key => `${key}@=${filterEnc(data[key])}`).join('/') + '/';\r\n"+
"  }\r\n"+
"  function douyuDecode(data) {\r\n"+
"      let out = {\r\n"+
"          type: '!!missing!!'\r\n"+
"      };\r\n"+
"      try {\r\n"+
"          data.split('/').filter(i => i.length > 2).forEach(i => {\r\n"+
"              let e = i.split('@=');\r\n"+
"              out[e[0]] = filterDec(e[1]);\r\n"+
"          });\r\n"+
"      }\r\n"+
"      catch (e) {\r\n"+
"          console.error(e);\r\n"+
"          console.log(data);\r\n"+
"      }\r\n"+
"      return out;\r\n"+
"  }\r\n"+
"  function ACJ(id, data) {\r\n"+
"      if (typeof data == 'object') {\r\n"+
"          data = douyuEncode(data);\r\n"+
"      }\r\n"+
"      try {\r\n"+
"          window._ACJ_([id, data]);\r\n"+
"      }\r\n"+
"      catch (e) {\r\n"+
"          console.error(id, data, e);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  class DouyuProtocol extends JSocket {\r\n"+
"      constructor(listener) {\r\n"+
"          super();\r\n"+
"          this.listener = listener;\r\n"+
"          this.connectHandler = () => null;\r\n"+
"          this.init(this, {});\r\n"+
"          this.buffer = '';\r\n"+
"      }\r\n"+
"      connectAsync(host, port) {\r\n"+
"          super.connect(host, port);\r\n"+
"          return new Promise((res, rej) => {\r\n"+
"              const prevConnHandler = this.connectHandler;\r\n"+
"              const prevErrHandler = this.errorHandler;\r\n"+
"              const recover = () => {\r\n"+
"                  this.connectHandler = prevConnHandler;\r\n"+
"                  this.errorHandler = prevErrHandler;\r\n"+
"              };\r\n"+
"              this.connectHandler = () => {\r\n"+
"                  recover();\r\n"+
"                  res();\r\n"+
"              };\r\n"+
"              this.errorHandler = () => {\r\n"+
"                  recover();\r\n"+
"                  rej();\r\n"+
"              };\r\n"+
"          });\r\n"+
"      }\r\n"+
"      dataHandler(data) {\r\n"+
"          this.buffer += data;\r\n"+
"          let buffer = this.buffer;\r\n"+
"          while (buffer.length >= 4) {\r\n"+
"              let size = u32(buffer.substr(0, 4));\r\n"+
"              if (buffer.length >= size) {\r\n"+
"                  let pkgStr = '';\r\n"+
"                  try {\r\n"+
"                      pkgStr = ascii_to_utf8(buffer.substr(12, size - 8));\r\n"+
"                  }\r\n"+
"                  catch (e) {\r\n"+
"                      console.log('deocde fail', escape(buffer.substr(12, size - 8)));\r\n"+
"                  }\r\n"+
"                  this.buffer = buffer = buffer.substr(size + 4);\r\n"+
"                  if (pkgStr.length === 0)\r\n"+
"                      continue;\r\n"+
"                  try {\r\n"+
"                      let pkg = douyuDecode(pkgStr);\r\n"+
"                      this.listener && this.listener.onPackage(pkg, pkgStr);\r\n"+
"                  }\r\n"+
"                  catch (e) {\r\n"+
"                      console.error('call map', e);\r\n"+
"                  }\r\n"+
"              }\r\n"+
"              else {\r\n"+
"                  break;\r\n"+
"              }\r\n"+
"          }\r\n"+
"      }\r\n"+
"      closeHandler() {\r\n"+
"          console.error('lost connection');\r\n"+
"          this.listener && this.listener.onClose();\r\n"+
"      }\r\n"+
"      errorHandler(err) {\r\n"+
"          console.error(err);\r\n"+
"          this.listener && this.listener.onError(err);\r\n"+
"      }\r\n"+
"      send(data) {\r\n"+
"          let msg = douyuEncode(data) + '\\0';\r\n"+
"          msg = utf8_to_ascii(msg);\r\n"+
"          msg = p32(msg.length + 8) + p32(msg.length + 8) + p32(689) + msg;\r\n"+
"          this.writeFlush(msg);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  function Type(type) {\r\n"+
"      return (target, propertyKey, descriptor) => {\r\n"+
"          if (!target.map) {\r\n"+
"              target.map = {};\r\n"+
"          }\r\n"+
"          target.map[type] = target[propertyKey];\r\n"+
"      };\r\n"+
"  }\r\n"+
"  class DouyuBaseClient {\r\n"+
"      constructor(roomId) {\r\n"+
"          this.roomId = roomId;\r\n"+
"          this.lastIP = null;\r\n"+
"          this.lastPort = null;\r\n"+
"          this.keepaliveId = null;\r\n"+
"          this.redirect = {};\r\n"+
"          this.prot = new DouyuProtocol(this);\r\n"+
"      }\r\n"+
"      static getRoomArgs() {\r\n"+
"          if (window._room_args)\r\n"+
"              return window._room_args;\r\n"+
"          if (window.room_args) {\r\n"+
"              return window.room_args;\r\n"+
"          }\r\n"+
"          else {\r\n"+
"              return window.$ROOM.args;\r\n"+
"          }\r\n"+
"      }\r\n"+
"      reconnect() {\r\n"+
"          return __awaiter(this, void 0, void 0, function* () {\r\n"+
"              console.log('reconnect');\r\n"+
"              this.prot.listener = null;\r\n"+
"              this.prot = new DouyuProtocol(this);\r\n"+
"              try {\r\n"+
"                  yield this.connectAsync(this.lastIP, this.lastPort);\r\n"+
"              }\r\n"+
"              catch (e) {\r\n"+
"                  this.onError();\r\n"+
"              }\r\n"+
"          });\r\n"+
"      }\r\n"+
"      onClose() {\r\n"+
"          setTimeout(() => this.reconnect(), 1000);\r\n"+
"      }\r\n"+
"      onError() {\r\n"+
"          this.onClose();\r\n"+
"      }\r\n"+
"      onPackage(pkg, pkgStr) {\r\n"+
"          const type = pkg.type;\r\n"+
"          if (this.redirect[type]) {\r\n"+
"              ACJ(this.redirect[type], pkg);\r\n"+
"              return;\r\n"+
"          }\r\n"+
"          if (this.map[type]) {\r\n"+
"              this.map[type].call(this, pkg, pkgStr);\r\n"+
"              return;\r\n"+
"          }\r\n"+
"          this.onDefault(pkg);\r\n"+
"      }\r\n"+
"      onDefault(pkg) {\r\n"+
"      }\r\n"+
"      send(pkg) {\r\n"+
"          this.prot.send(pkg);\r\n"+
"      }\r\n"+
"      connectAsync(ip, port) {\r\n"+
"          return __awaiter(this, void 0, void 0, function* () {\r\n"+
"              this.lastIP = ip;\r\n"+
"              this.lastPort = port;\r\n"+
"              yield this.prot.connectAsync(ip, port);\r\n"+
"              this.send(this.loginreq());\r\n"+
"          });\r\n"+
"      }\r\n"+
"      keepalivePkg() {\r\n"+
"          return {\r\n"+
"              type: 'keeplive',\r\n"+
"              tick: Math.round(new Date().getTime() / 1000).toString()\r\n"+
"          };\r\n"+
"      }\r\n"+
"      loginreq() {\r\n"+
"          const rt = Math.round(new Date().getTime() / 1000);\r\n"+
"          const devid = getACF('devid');\r\n"+
"          const username = getACF('username');\r\n"+
"          console.log('username', username, devid);\r\n"+
"          return {\r\n"+
"              type: 'loginreq',\r\n"+
"              username: username,\r\n"+
"              ct: 0,\r\n"+
"              password: '',\r\n"+
"              roomid: this.roomId,\r\n"+
"              devid: devid,\r\n"+
"              rt: rt,\r\n"+
"              vk: md5(`${rt}r5*^5;}2#\\${XF[h+;'./.Q'1;,-]f'p[${devid}`),\r\n"+
"              ver: '20150929',\r\n"+
"              aver: '2017012111',\r\n"+
"              biz: getACF('biz'),\r\n"+
"              stk: getACF('stk'),\r\n"+
"              ltkid: getACF('ltkid')\r\n"+
"          };\r\n"+
"      }\r\n"+
"      startKeepalive() {\r\n"+
"          this.send(this.keepalivePkg());\r\n"+
"          if (this.keepaliveId) {\r\n"+
"              clearInterval(this.keepaliveId);\r\n"+
"          }\r\n"+
"          this.keepaliveId = setInterval(() => this.send(this.keepalivePkg()), 30 * 1000);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  let blacklist = [];\r\n"+
"  function onChatMsg(data) {\r\n"+
"      if (blacklist.indexOf(data.uid) !== -1) {\r\n"+
"          console.log('black');\r\n"+
"          return;\r\n"+
"      }\r\n"+
"      try {\r\n"+
"          postMessage('DANMU', data);\r\n"+
"      }\r\n"+
"      catch (e) {\r\n"+
"          console.error('wtf', e);\r\n"+
"      }\r\n"+
"      ACJ('room_data_chat2', data);\r\n"+
"      if (window.BarrageReturn) {\r\n"+
"          window.BarrageReturn(douyuEncode(data));\r\n"+
"      }\r\n"+
"  }\r\n"+
"  class DouyuClient extends DouyuBaseClient {\r\n"+
"      constructor(roomId, danmuClient) {\r\n"+
"          super(roomId);\r\n"+
"          this.danmuClient = danmuClient;\r\n"+
"          this.redirect = {\r\n"+
"              qtlr: 'room_data_tasklis',\r\n"+
"              initcl: 'room_data_chatinit',\r\n"+
"              memberinfores: 'room_data_info',\r\n"+
"              ranklist: 'room_data_cqrank',\r\n"+
"              rsm: 'room_data_brocast',\r\n"+
"              qausrespond: 'data_rank_score',\r\n"+
"              frank: 'room_data_handler',\r\n"+
"              online_noble_list: 'room_data_handler',\r\n"+
"          };\r\n"+
"      }\r\n"+
"      reqOnlineGift(loginres) {\r\n"+
"          return {\r\n"+
"              type: 'reqog',\r\n"+
"              uid: loginres.userid\r\n"+
"          };\r\n"+
"      }\r\n"+
"      chatmsg(data) {\r\n"+
"          onChatMsg(data);\r\n"+
"      }\r\n"+
"      resog(data) {\r\n"+
"          ACJ('room_data_chest', {\r\n"+
"              lev: data.lv,\r\n"+
"              lack_time: data.t,\r\n"+
"              dl: data.dl\r\n"+
"          });\r\n"+
"      }\r\n"+
"      loginres(data) {\r\n"+
"          console.log('loginres ms', data);\r\n"+
"          this.uid = data.userid;\r\n"+
"          this.send(this.reqOnlineGift(data));\r\n"+
"          this.startKeepalive();\r\n"+
"          ACJ('room_data_login', data);\r\n"+
"          ACJ('room_data_getdid', {\r\n"+
"              devid: getACF('devid')\r\n"+
"          });\r\n"+
"      }\r\n"+
"      keeplive(data, rawString) {\r\n"+
"          ACJ('room_data_userc', data.uc);\r\n"+
"          ACJ('room_data_tbredpacket', rawString);\r\n"+
"      }\r\n"+
"      setmsggroup(data) {\r\n"+
"          console.log('joingroup', data);\r\n"+
"          this.danmuClient.send({\r\n"+
"              type: 'joingroup',\r\n"+
"              rid: data.rid,\r\n"+
"              gid: data.gid\r\n"+
"          });\r\n"+
"      }\r\n"+
"      onDefault(data) {\r\n"+
"          ACJ('room_data_handler', data);\r\n"+
"          console.log('ms', data);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  __decorate([\r\n"+
"      Type('chatmsg')\r\n"+
"  ], DouyuClient.prototype, \"chatmsg\", null);\r\n"+
"  __decorate([\r\n"+
"      Type('resog')\r\n"+
"  ], DouyuClient.prototype, \"resog\", null);\r\n"+
"  __decorate([\r\n"+
"      Type('loginres')\r\n"+
"  ], DouyuClient.prototype, \"loginres\", null);\r\n"+
"  __decorate([\r\n"+
"      Type('keeplive')\r\n"+
"  ], DouyuClient.prototype, \"keeplive\", null);\r\n"+
"  __decorate([\r\n"+
"      Type('setmsggroup')\r\n"+
"  ], DouyuClient.prototype, \"setmsggroup\", null);\r\n"+
"  class DouyuDanmuClient extends DouyuBaseClient {\r\n"+
"      constructor(roomId) {\r\n"+
"          super(roomId);\r\n"+
"          this.redirect = {\r\n"+
"              chatres: 'room_data_chat2',\r\n"+
"              initcl: 'room_data_chatinit',\r\n"+
"              dgb: 'room_data_giftbat1',\r\n"+
"              dgn: 'room_data_giftbat1',\r\n"+
"              spbc: 'room_data_giftbat1',\r\n"+
"              uenter: 'room_data_nstip2',\r\n"+
"              upgrade: 'room_data_ulgrow',\r\n"+
"              newblackres: 'room_data_sys',\r\n"+
"              ranklist: 'room_data_cqrank',\r\n"+
"              rankup: 'room_data_ulgrow',\r\n"+
"              gift_title: 'room_data_schat',\r\n"+
"              rss: 'room_data_state',\r\n"+
"              srres: 'room_data_wbsharesuc',\r\n"+
"              onlinegift: 'room_data_olyw',\r\n"+
"              gpbc: 'room_data_handler',\r\n"+
"              synexp: 'room_data_handler',\r\n"+
"              frank: 'room_data_handler',\r\n"+
"              ggbb: 'room_data_sabonusget',\r\n"+
"              online_noble_list: 'room_data_handler',\r\n"+
"          };\r\n"+
"      }\r\n"+
"      chatmsg(pkg) {\r\n"+
"          onChatMsg(pkg);\r\n"+
"      }\r\n"+
"      loginres(data) {\r\n"+
"          console.log('loginres dm', data);\r\n"+
"          this.startKeepalive();\r\n"+
"      }\r\n"+
"      onDefault(data) {\r\n"+
"          ACJ('room_data_handler', data);\r\n"+
"          console.log('dm', data);\r\n"+
"      }\r\n"+
"  }\r\n"+
"  __decorate([\r\n"+
"      Type('chatmsg')\r\n"+
"  ], DouyuDanmuClient.prototype, \"chatmsg\", null);\r\n"+
"  __decorate([\r\n"+
"      Type('loginres')\r\n"+
"  ], DouyuDanmuClient.prototype, \"loginres\", null);\r\n"+
"  function hookDouyu(roomId, miscClient) {\r\n"+
"      let oldExe;\r\n"+
"      const repeatPacket = (text) => douyuDecode(text);\r\n"+
"      const jsMap = {\r\n"+
"          js_getRankScore: repeatPacket,\r\n"+
"          js_getnoble: repeatPacket,\r\n"+
"          js_rewardList: {\r\n"+
"              type: 'qrl',\r\n"+
"              rid: roomId\r\n"+
"          },\r\n"+
"          js_queryTask: {\r\n"+
"              type: 'qtlnq'\r\n"+
"          },\r\n"+
"          js_newQueryTask: {\r\n"+
"              type: 'qtlq'\r\n"+
"          },\r\n"+
"          js_sendmsg(msg) {\r\n"+
"              let pkg = douyuDecode(msg);\r\n"+
"              pkg.type = 'chatmessage';\r\n"+
"              return pkg;\r\n"+
"          },\r\n"+
"          js_giveGift(gift) {\r\n"+
"              let pkg = douyuDecode(gift);\r\n"+
"              if (pkg.type === 'dn_s_gf') {\r\n"+
"                  pkg.type = 'sgq';\r\n"+
"                  pkg.bat = 0;\r\n"+
"              }\r\n"+
"              console.log('giveGift', gift);\r\n"+
"              return gift;\r\n"+
"          },\r\n"+
"          js_GetHongbao: repeatPacket,\r\n"+
"          js_UserHaveHandle() { },\r\n"+
"          js_myblacklist(list) {\r\n"+
"              console.log('add blacklist', list);\r\n"+
"              blacklist = list.split('|');\r\n"+
"          },\r\n"+
"          js_medal_opera(opt) {\r\n"+
"              let pkg = douyuDecode(opt);\r\n"+
"              return pkg;\r\n"+
"          }\r\n"+
"      };\r\n"+
"      const api = window['require']('douyu/page/room/base/api');\r\n"+
"      const hookd = function hookd(...args) {\r\n"+
"          let req = jsMap[args[0]];\r\n"+
"          if (req) {\r\n"+
"              if (typeof req == 'function') {\r\n"+
"                  req = req.apply(null, args.slice(1));\r\n"+
"              }\r\n"+
"              req && miscClient.send(req);\r\n"+
"          }\r\n"+
"          else {\r\n"+
"              console.log('exe', args);\r\n"+
"              try {\r\n"+
"                  return oldExe.apply(api, args);\r\n"+
"              }\r\n"+
"              catch (e) { }\r\n"+
"          }\r\n"+
"      };\r\n"+
"      if (api) {\r\n"+
"          if (api.exe !== hookd) {\r\n"+
"              oldExe = api.exe;\r\n"+
"              api.exe = hookd;\r\n"+
"          }\r\n"+
"      }\r\n"+
"      else if (window.thisMovie) {\r\n"+
"          window.thisMovie = () => new Proxy({}, {\r\n"+
"              get(target, key, receiver) {\r\n"+
"                  return (...args) => hookd.apply(null, [key].concat(args));\r\n"+
"              }\r\n"+
"          });\r\n"+
"      }\r\n"+
"  }\r\n"+
"  function douyuApi(roomId) {\r\n"+
"      return __awaiter(this, void 0, void 0, function* () {\r\n"+
"          const res = yield fetch('/swf_api/get_room_args');\r\n"+
"          const args = yield res.json();\r\n"+
"          const servers = JSON.parse(decodeURIComponent(args.server_config));\r\n"+
"          const mserver = servers[Math.floor(Math.random() * servers.length)];\r\n"+
"          const ports = [8601, 8602, 12601, 12602];\r\n"+
"          const danmuServer = {\r\n"+
"              ip: 'danmu.douyu.com',\r\n"+
"              port: ports[Math.floor(Math.random() * ports.length)]\r\n"+
"          };\r\n"+
"          let danmuClient = new DouyuDanmuClient(roomId);\r\n"+
"          let miscClient = new DouyuClient(roomId, danmuClient);\r\n"+
"          yield danmuClient.connectAsync(danmuServer.ip, danmuServer.port);\r\n"+
"          yield miscClient.connectAsync(mserver.ip, mserver.port);\r\n"+
"          return {\r\n"+
"              sendDanmu(content) {\r\n"+
"                  miscClient.send({\r\n"+
"                      col: '0',\r\n"+
"                      content: content,\r\n"+
"                      dy: '',\r\n"+
"                      pid: '',\r\n"+
"                      sender: miscClient.uid,\r\n"+
"                      type: 'chatmessage'\r\n"+
"                  });\r\n"+
"              },\r\n"+
"              serverSend(pkg) {\r\n"+
"                  return miscClient.send(pkg);\r\n"+
"              },\r\n"+
"              hookExe() {\r\n"+
"                  hookDouyu(roomId, miscClient);\r\n"+
"              }\r\n"+
"          };\r\n"+
"      });\r\n"+
"  }\n"+
"\n"+
"  function hookFunc(obj, funcName, newFunc) {\r\n"+
"      var old = obj[funcName];\r\n"+
"      obj[funcName] = function () {\r\n"+
"          return newFunc.call(this, old.bind(this), Array.from(arguments));\r\n"+
"      };\r\n"+
"  }\r\n"+
"  function getParam(flash, name) {\r\n"+
"      const children = flash.children;\r\n"+
"      for (let i = 0; i < children.length; i++) {\r\n"+
"          const param = children[i];\r\n"+
"          if (param.name == name) {\r\n"+
"              return param.value;\r\n"+
"          }\r\n"+
"      }\r\n"+
"      return '';\r\n"+
"  }\r\n"+
"  function getRoomIdFromFlash(s) {\r\n"+
"      return s.split('&').filter(i => i.substr(0, 6) == 'RoomId')[0].split('=')[1];\r\n"+
"  }\r\n"+
"  hookFunc(document, 'createElement', (old, args) => {\r\n"+
"      var ret = old.apply(null, args);\r\n"+
"      if (args[0] == 'object') {\r\n"+
"          hookFunc(ret, 'setAttribute', (old, args) => {\r\n"+
"              if (args[0] == 'data') {\r\n"+
"                  if (/WebRoom/.test(args[1])) {\r\n"+
"                      setTimeout(() => {\r\n"+
"                          let roomId = getRoomIdFromFlash(getParam(ret, 'flashvars'));\r\n"+
"                          console.log('RoomId', roomId);\r\n"+
"                          postMessage('VIDEOID', {\r\n"+
"                              roomId: roomId,\r\n"+
"                              id: ret.id\r\n"+
"                          });\r\n"+
"                      }, 1);\r\n"+
"                  }\r\n"+
"              }\r\n"+
"              return old.apply(null, args);\r\n"+
"          });\r\n"+
"      }\r\n"+
"      return ret;\r\n"+
"  });\r\n"+
"  let api;\r\n"+
"  onMessage('BEGINAPI', (data) => __awaiter(window, void 0, void 0, function* () {\r\n"+
"      yield retry(() => JSocket.init(), 3);\r\n"+
"      api = yield douyuApi(data.roomId);\r\n"+
"      api.hookExe();\r\n"+
"      window.api = api;\r\n"+
"  }));\r\n"+
"  onMessage('SENDANMU', data => {\r\n"+
"      api.sendDanmu(data);\r\n"+
"  });\r\n"+
"  onMessage('ACJ', data => {\r\n"+
"      ACJ(data.id, data.data);\r\n"+
"  });\n"+
"\n"+
"})));\n"+
"\n", css: ".jsocket-cls,\n"+
".big-flash-cls {\n"+
"  width: 80vw;\n"+
"  height: 80vh;\n"+
"  position: absolute;\n"+
"  top: -100vh;\n"+
"  left: 0;\n"+
"}\n"+
".donate-dialog {\n"+
"  position: fixed;\n"+
"  z-index: 100002;\n"+
"  left: 0;\n"+
"  top: 0;\n"+
"  right: 0;\n"+
"  bottom: 0;\n"+
"  display: flex;\n"+
"  align-items: center;\n"+
"  justify-content: center;\n"+
"}\n"+
".donate-dialog .donate-title {\n"+
"  font-size: 20px;\n"+
"}\n"+
".donate-dialog .donate-content {\n"+
"  margin-bottom: 10px;\n"+
"}\n"+
".donate-dialog .donate-wrap {\n"+
"  width: 400px;\n"+
"  padding: 10px;\n"+
"  background: #fff;\n"+
"  border-radius: 5px;\n"+
"  border: 1px solid #aaa;\n"+
"}\n"+
".donate-dialog .donate-qrcode-bar {\n"+
"  display: flex;\n"+
"  justify-content: space-between;\n"+
"}\n"+
".donate-dialog .donate-qrcode-bar img {\n"+
"  height: 168px;\n"+
"}\n"+
".donate-dialog .donate-qrcode-desc {\n"+
"  text-align: center;\n"+
"}\n"+
".donate-dialog .donate-close-btn {\n"+
"  margin-top: 10px;\n"+
"}\n"+
".donate-dialog .donate-close-btn:before {\n"+
"  content: '关闭';\n"+
"  text-align: center;\n"+
"  display: block;\n"+
"}\n"+
".player-menu {\n"+
"  position: fixed;\n"+
"  top: 0;\n"+
"  left: 0;\n"+
"  right: 0;\n"+
"  bottom: 0;\n"+
"  z-index: 100001;\n"+
"}\n"+
".player-menu .menu {\n"+
"  position: absolute;\n"+
"  background-color: #fff;\n"+
"  min-width: 200px;\n"+
"  border: 1px solid #aaa;\n"+
"  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);\n"+
"  -webkit-user-select: none;\n"+
"  -moz-user-select: none;\n"+
"}\n"+
".player-menu .menu .menu-dash {\n"+
"  height: 1px;\n"+
"  background-color: #aaa;\n"+
"}\n"+
".player-menu .menu .menu-item {\n"+
"  color: #000;\n"+
"  padding: 5px;\n"+
"  cursor: default;\n"+
"}\n"+
".player-menu .menu .menu-item:last-child {\n"+
"  border-bottom: 0;\n"+
"}\n"+
".player-menu .menu .menu-item:hover {\n"+
"  background-color: #ddd;\n"+
"}\n"+
".danmu-container {\n"+
"  width: 100%;\n"+
"  height: 100%;\n"+
"  border: 1px solid #e5e4e4;\n"+
"  box-sizing: border-box;\n"+
"}\n"+
".danmu-wrap {\n"+
"  width: 100%;\n"+
"  height: 100%;\n"+
"  position: relative;\n"+
"  background-color: #000;\n"+
"}\n"+
".danmu-wrap .danmu-input {\n"+
"  display: none;\n"+
"}\n"+
".danmu-wrap .danmu-video {\n"+
"  width: 100%;\n"+
"  height: calc(100% - 42px);\n"+
"}\n"+
".danmu-wrap .danmu-ctrl {\n"+
"  box-sizing: border-box;\n"+
"  border: 1px solid #fafafa;\n"+
"  border-left: 0;\n"+
"  border-right: 0;\n"+
"  width: 100%;\n"+
"  height: 42px;\n"+
"  padding: 5px;\n"+
"  color: #5a5a5a;\n"+
"  background: #fafafa;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl > a {\n"+
"  float: left;\n"+
"  cursor: pointer;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-btn {\n"+
"  box-sizing: border-box;\n"+
"  display: inline-block;\n"+
"  height: 30px;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-mute {\n"+
"  float: right;\n"+
"  width: 30px;\n"+
"  height: 30px;\n"+
"  padding: 5px;\n"+
"  transition: all .3s ease;\n"+
"  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiANCiJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KDQo8c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIg0KeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0ic3Ryb2tlOiAjNWE1YTVhOyBmaWxsOnRyYW5zcGFyZW50OyBzdHJva2Utd2lkdGg6MiI%2BDQogIDxwYXRoIGQ9Ik05LDQgTDUsOCBMMiw4IEwyLDEyIEw1LDEyIEw5LDE2IFoiIHN0eWxlPSJmaWxsOiAjNWE1YTVhIiAvPg0KICA8cGF0aCBkPSJNMTIsMTIgQTMsMyAwIDAgMCAxMiw4IFoiIHN0eWxlPSJmaWxsOiAjNWE1YTVhIiAvPg0KICA8cGF0aCBkPSJNMTIsMiBBIDksOSAwIDAgMSAxMiwxOCIgc3R5bGU9InN0cm9rZS13aWR0aDoyIi8%2BDQo8L3N2Zz4%3D) no-repeat center;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-mute[muted] {\n"+
"  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiANCiJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KDQo8c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIg0KeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0ic3Ryb2tlOiAjNWE1YTVhOyBmaWxsOnRyYW5zcGFyZW50OyBzdHJva2Utd2lkdGg6MiI%2BDQogIDxwYXRoIGQ9Ik05LDQgTDUsOCBMMiw4IEwyLDEyIEw1LDEyIEw5LDE2IFoiIHN0eWxlPSJmaWxsOiAjNWE1YTVhIiAvPg0KICA8cGF0aCBkPSJNMTIsMTMgTDE4LDciIC8%2BDQogIDxwYXRoIGQ9Ik0xMiw3IEwxOCwxMyIgLz4NCjwvc3ZnPg%3D%3D) no-repeat center;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume {\n"+
"  box-sizing: border-box;\n"+
"  margin: 5px;\n"+
"  height: 20px;\n"+
"  float: right;\n"+
"  position: relative;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume .progress {\n"+
"  position: absolute;\n"+
"  pointer-events: none;\n"+
"  top: 9px;\n"+
"  left: 0;\n"+
"  width: 0;\n"+
"  height: 2px;\n"+
"  background-color: #4285f4;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"] {\n"+
"  cursor: pointer;\n"+
"  height: 20px;\n"+
"  outline: none;\n"+
"  background-color: transparent;\n"+
"  -webkit-appearance: none;\n"+
"  -moz-appearance: none;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"] .thumb {\n"+
"  -webkit-appearance: none;\n"+
"  -moz-appearance: none;\n"+
"  height: 12px;\n"+
"  width: 12px;\n"+
"  margin-top: -5px;\n"+
"  border-radius: 50%;\n"+
"  background-color: #4285f4;\n"+
"  position: relative;\n"+
"  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"]::-webkit-slider-thumb {\n"+
"  -webkit-appearance: none;\n"+
"  -moz-appearance: none;\n"+
"  height: 12px;\n"+
"  width: 12px;\n"+
"  margin-top: -5px;\n"+
"  border-radius: 50%;\n"+
"  background-color: #4285f4;\n"+
"  position: relative;\n"+
"  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"]::-moz-range-thumb {\n"+
"  -webkit-appearance: none;\n"+
"  -moz-appearance: none;\n"+
"  height: 12px;\n"+
"  width: 12px;\n"+
"  margin-top: -5px;\n"+
"  border-radius: 50%;\n"+
"  background-color: #4285f4;\n"+
"  position: relative;\n"+
"  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"] .track {\n"+
"  height: 2px;\n"+
"  background-color: #9f9f9f;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"]::-webkit-slider-runnable-track {\n"+
"  height: 2px;\n"+
"  background-color: #9f9f9f;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-volume > input[type=\"range\"]::-moz-range-track {\n"+
"  height: 2px;\n"+
"  background-color: #9f9f9f;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-fullpage {\n"+
"  float: right;\n"+
"  width: 30px;\n"+
"  height: 30px;\n"+
"  padding: 5px;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-fullpage::before {\n"+
"  content: \" \";\n"+
"  display: block;\n"+
"  width: 20px;\n"+
"  height: 16px;\n"+
"  border: 2px solid #5a5a5a;\n"+
"  box-sizing: border-box;\n"+
"  margin-top: 2px;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-fullscreen {\n"+
"  float: right;\n"+
"  width: 30px;\n"+
"  height: 30px;\n"+
"  padding: 5px;\n"+
"  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiANCiJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KDQo8c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIg0KeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0ic3Ryb2tlOiAjNWE1YTVhOyBmaWxsOnRyYW5zcGFyZW50OyBzdHJva2Utd2lkdGg6MiI%2BDQogIDxwb2x5bGluZSBwb2ludHM9IjEsOCAxLDEgOCwxIiAvPg0KICA8cG9seWxpbmUgcG9pbnRzPSIxOSw4IDE5LDEgMTIsMSIgLz4NCiAgPHBvbHlsaW5lIHBvaW50cz0iMSwxMiAxLDE5IDgsMTkiIC8%2BDQogIDxwb2x5bGluZSBwb2ludHM9IjE5LDEyIDE5LDE5IDEyLDE5IiAvPg0KPC9zdmc%2B);\n"+
"  background-repeat: no-repeat;\n"+
"  background-position: center;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-switch {\n"+
"  float: right;\n"+
"  display: inline-block;\n"+
"  height: 30px;\n"+
"  line-height: 30px;\n"+
"  padding: 0 5px;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-tip {\n"+
"  float: right;\n"+
"  display: inline-block;\n"+
"  height: 30px;\n"+
"  line-height: 30px;\n"+
"  padding: 0 5px;\n"+
"  cursor: default;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-reload {\n"+
"  width: 30px;\n"+
"  height: 30px;\n"+
"  padding: 5px;\n"+
"  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI%2FPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiANCiJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KDQo8c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIg0KeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0ic3Ryb2tlOiAjNWE1YTVhOyBmaWxsOnRyYW5zcGFyZW50OyBzdHJva2Utd2lkdGg6Mi41Ij4NCiAgPHBhdGggZD0iTSAxOC42OSwxMi4zMyBBOCA4IDAgMSAxIDE4LjY5LDcuNjciIC8%2BDQogIDxwYXRoIGQ9Ik0gMTYsNyBMIDE5LDcgTCAxOSw0IFoiIC8%2BDQo8L3N2Zz4NCg%3D%3D);\n"+
"  background-repeat: no-repeat;\n"+
"  background-position: center;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-playpause {\n"+
"  width: 30px;\n"+
"  height: 30px;\n"+
"  padding: 5px;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-playpause::before {\n"+
"  transition: all .3s ease;\n"+
"  border-color: transparent;\n"+
"  content: \" \";\n"+
"  display: block;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-playpause:not([pause])::before {\n"+
"  width: 0;\n"+
"  height: 0;\n"+
"  border-top: 10px solid transparent;\n"+
"  border-left: 20px solid #5a5a5a;\n"+
"  border-bottom: 10px solid transparent;\n"+
"}\n"+
".danmu-wrap .danmu-ctrl .danmu-playpause[pause]::before {\n"+
"  box-sizing: border-box;\n"+
"  width: 15px;\n"+
"  height: 20px;\n"+
"  margin-left: 2.5px;\n"+
"  border-left: 5px solid #5a5a5a;\n"+
"  border-right: 5px solid #5a5a5a;\n"+
"}\n"+
".danmu-wrap .danmu-layout {\n"+
"  position: absolute;\n"+
"  top: 0;\n"+
"  left: 0;\n"+
"  right: 0;\n"+
"  bottom: 0;\n"+
"  pointer-events: none;\n"+
"  color: #fff;\n"+
"  font-size: 25px;\n"+
"  font-family: SimHei, \"Microsoft JhengHei\", Arial, Helvetica, sans-serif;\n"+
"  text-shadow: #000000 1px 0px 1px, #000000 0px 1px 1px, #000000 0px -1px 1px, #000000 -1px 0px 1px;\n"+
"  line-height: 1.25;\n"+
"  font-weight: bold;\n"+
"  overflow: hidden;\n"+
"  opacity: 0.5;\n"+
"}\n"+
".danmu-wrap .danmu-layout > div {\n"+
"  display: none;\n"+
"  position: absolute;\n"+
"  white-space: pre;\n"+
"}\n"+
".danmu-wrap .danmu-layout .danmu-self {\n"+
"  outline: 2px solid #fff;\n"+
"}\n"+
".danmu-wrap[fullpage] {\n"+
"  top: 0;\n"+
"  left: 0;\n"+
"  width: 100%;\n"+
"  height: 100%;\n"+
"  position: fixed;\n"+
"  z-index: 100000;\n"+
"  cursor: none;\n"+
"}\n"+
".danmu-wrap[fullpage] .danmu-input {\n"+
"  position: absolute;\n"+
"  top: 75%;\n"+
"  width: 100%;\n"+
"  display: block;\n"+
"  transition: all .3s ease;\n"+
"  transform: translateY(50px);\n"+
"  opacity: 0;\n"+
"}\n"+
".danmu-wrap[fullpage] .danmu-input > input {\n"+
"  outline: 0;\n"+
"  box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.8);\n"+
"  width: 300px;\n"+
"  margin: 0 auto;\n"+
"  display: block;\n"+
"  border: 0;\n"+
"  background: rgba(255, 255, 255, 0.8);\n"+
"  padding: 5px;\n"+
"  color: #000;\n"+
"  cursor: default;\n"+
"}\n"+
".danmu-wrap[fullpage] .danmu-input > input::-webkit-input-placeholder {\n"+
"  color: #888;\n"+
"}\n"+
".danmu-wrap[fullpage][inputing] .danmu-input {\n"+
"  transform: translateY(0);\n"+
"  opacity: 1;\n"+
"}\n"+
".danmu-wrap[fullpage][inputing] .danmu-input > input {\n"+
"  cursor: text;\n"+
"}\n"+
".danmu-wrap[fullpage] .danmu-video {\n"+
"  height: 100%;\n"+
"  transition: all .3s ease;\n"+
"}\n"+
".danmu-wrap[fullpage] .danmu-ctrl {\n"+
"  position: absolute;\n"+
"  bottom: 0;\n"+
"  opacity: 0;\n"+
"  transition: all .3s ease;\n"+
"}\n"+
".danmu-wrap[fullpage][hover] {\n"+
"  cursor: default;\n"+
"}\n"+
".danmu-wrap[fullpage][hover] .danmu-ctrl {\n"+
"  cursor: default;\n"+
"  opacity: 0.75;\n"+
"}\n"+
"\n"};
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('flv.js')) :
  typeof define === 'function' && define.amd ? define(['flv.js'], factory) :
  (factory(global.flvjs));
}(this, (function (flv_js) { 'use strict';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };







  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }





  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }







  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }



  function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
  }

  function hookFetchCode () {
    // let self = this
    const convertHeader = function convertHeader (headers) {
      let out = new Headers();
      for (let key of Object.keys(headers)) {
        out.set(key, headers[key]);
      }
      return out
    };
    const hideHookStack = stack => {
      return stack.replace(/^\s*at\s.*?hookfetch\.js:\d.*$\n/mg, '')
    };
    const base64ToUint8 = (b64) => {
      const s = atob(b64);
      const length = s.length;
      let ret = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        ret[i] = s.charCodeAt(i);
      }
      return ret
    };
    class WrapPort {
      constructor (port) {
        this.curMethod = '';
        this.curResolve = null;
        this.curReject = null;
        this.stack = '';
        this.port = port;
        this.lastDone = true;

        port.onMessage.addListener(msg => this.onMessage(msg));
      }
      post (method, args) {
        if (!this.lastDone) {
          throw new Error('Last post is not done')
        }
        this.stack = new Error().stack;
        return new Promise((resolve, reject) => {
          this.lastDone = false;
          this.curMethod = method;
          this.curResolve = resolve;
          this.curReject = reject;
          this.port.postMessage({
            method: method,
            args: args
          });
        })
      }
      onMessage (msg) {
        if (msg.method === this.curMethod) {
          if (msg.err) {
            let err = new Error(msg.err.message);
            err.oriName = msg.err.name;
            err.stack = hideHookStack(this.stack);
            // console.log('fetch err', err)
            this.curReject.call(null, err);
          } else {
            this.curResolve.apply(null, msg.args);
          }
          this.curResolve = null;
          this.curReject = null;
          this.lastDone = true;
        } else {
          console.error('wtf?');
        }
      }
    }
    class PortReader {
      constructor (port) {
        this.port = port;
        this.hasReader = false;
      }
      _requireReader () {
        if (this.hasReader) {
          return Promise.resolve()
        } else {
          return this.port.post('body.getReader').then(() => this.hasReader = true)
        }
      }
      read () {
        return this._requireReader()
          .then(() => this.port.post('reader.read'))
          .then(r => {
            if (r.done == false) {
              r.value = base64ToUint8(r.value);
            }
            return r
          })
      }
      cancel () {
        return this._requireReader().then(() => this.port.post('reader.cancel'))
      }
    }
    class PortBody {
      constructor (port) {
        this.port = port;
      }
      getReader () {
        return new PortReader(this.port)
      }
    }
    class PortFetch {
      constructor () {
        this.port = new WrapPort(chrome.runtime.connect({name: 'fetch'}));
      }
      fetch (...args) {
        return this.port.post('fetch', args).then(r => {
          r.json = () => this.port.post('json');
          r.arrayBuffer = () => this.port.post('arrayBuffer').then(buf => {
            return new Uint8Array(buf).buffer
          });
          r.headers = convertHeader(r.headers);
          r.body = new PortBody(this.port);
          return r
        })
      }
    }
    const bgFetch = function bgFetch (...args) {
      const fetch = new PortFetch();
      return fetch.fetch(...args)
    };
    function hookFetch () {
      if (fetch !== bgFetch) {
        fetch = bgFetch;
      }
    }
    const oldBlob = Blob;
    const newBlob = function newBlob(a, b) {
      a[0] = `(${hookFetchCode})();${a[0]}`;
      console.log('new blob', a, b);
      return new oldBlob(a, b)
    };
    // if(self.document !== undefined) {
    //   if (self.Blob !== newBlob) {
    //     self.Blob = newBlob
    //   }
    // }

    hookFetch();
  }
  function isFirefox () {
    return /Firefox/.test(navigator.userAgent)
  }
  if (!isFirefox()) {
    hookFetchCode();
  }

  function utf8ToUtf16(utf8_bytes) {
      let unicode_codes = [];
      let unicode_code = 0;
      let num_followed = 0;
      for (let i = 0; i < utf8_bytes.length; ++i) {
          let utf8_byte = utf8_bytes[i];
          if (utf8_byte >= 0x100) {
          }
          else if ((utf8_byte & 0xC0) == 0x80) {
              if (num_followed > 0) {
                  unicode_code = (unicode_code << 6) | (utf8_byte & 0x3f);
                  num_followed -= 1;
              }
              else {
              }
          }
          else {
              if (num_followed == 0) {
                  unicode_codes.push(unicode_code);
              }
              else {
              }
              if (utf8_byte < 0x80) {
                  unicode_code = utf8_byte;
                  num_followed = 0;
              }
              else if ((utf8_byte & 0xE0) == 0xC0) {
                  unicode_code = utf8_byte & 0x1f;
                  num_followed = 1;
              }
              else if ((utf8_byte & 0xF0) == 0xE0) {
                  unicode_code = utf8_byte & 0x0f;
                  num_followed = 2;
              }
              else if ((utf8_byte & 0xF8) == 0xF0) {
                  unicode_code = utf8_byte & 0x07;
                  num_followed = 3;
              }
              else {
              }
          }
      }
      if (num_followed == 0) {
          unicode_codes.push(unicode_code);
      }
      else {
      }
      unicode_codes.shift();
      let utf16_codes = [];
      for (var i = 0; i < unicode_codes.length; ++i) {
          unicode_code = unicode_codes[i];
          if (unicode_code < (1 << 16)) {
              utf16_codes.push(unicode_code);
          }
          else {
              var first = ((unicode_code - (1 << 16)) / (1 << 10)) + 0xD800;
              var second = (unicode_code % (1 << 10)) + 0xDC00;
              utf16_codes.push(first);
              utf16_codes.push(second);
          }
      }
      return utf16_codes;
  }
  function utf8_to_ascii(str) {
      const char2bytes = (unicode_code) => {
          let utf8_bytes = [];
          if (unicode_code < 0x80) {
              utf8_bytes.push(unicode_code);
          }
          else if (unicode_code < (1 << 11)) {
              utf8_bytes.push((unicode_code >>> 6) | 0xC0);
              utf8_bytes.push((unicode_code & 0x3F) | 0x80);
          }
          else if (unicode_code < (1 << 16)) {
              utf8_bytes.push((unicode_code >>> 12) | 0xE0);
              utf8_bytes.push(((unicode_code >> 6) & 0x3f) | 0x80);
              utf8_bytes.push((unicode_code & 0x3F) | 0x80);
          }
          else if (unicode_code < (1 << 21)) {
              utf8_bytes.push((unicode_code >>> 18) | 0xF0);
              utf8_bytes.push(((unicode_code >> 12) & 0x3F) | 0x80);
              utf8_bytes.push(((unicode_code >> 6) & 0x3F) | 0x80);
              utf8_bytes.push((unicode_code & 0x3F) | 0x80);
          }
          return utf8_bytes;
      };
      let o = [];
      for (let i = 0; i < str.length; i++) {
          o = o.concat(char2bytes(str.charCodeAt(i)));
      }
      return o.map(i => String.fromCharCode(i)).join('');
  }
  function ascii_to_utf8(str) {
      let bytes = str.split('').map(i => i.charCodeAt(0));
      return utf8ToUtf16(bytes).map(i => String.fromCharCode(i)).join('');
  }
  function requestFullScreen() {
      let de = document.documentElement;
      if (de.requestFullscreen) {
          de.requestFullscreen();
      }
      else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen();
      }
      else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen();
      }
  }
  function exitFullscreen() {
      let de = document;
      if (de.exitFullscreen) {
          de.exitFullscreen();
      }
      else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen();
      }
      else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen();
      }
  }
  class LocalStorage {
      constructor(domain) {
          this.domain = domain;
      }
      getItem(key, def) {
          return window.localStorage.getItem(`${this.domain}-${key}`) || def;
      }
      setItem(key, data) {
          window.localStorage.setItem(`${this.domain}-${key}`, data);
      }
  }
  class Timer {
      constructor(delay) {
          this.delay = delay;
      }
      reset() {
          if (this.id) {
              clearTimeout(this.id);
          }
          this.id = window.setTimeout(this.onTimer, this.delay);
      }
  }
  function getURL(src) {
      if (src.substr(0, 5) !== 'blob:') {
          src = chrome.runtime.getURL(src);
      }
      return src;
  }
  function addScript(src) {
      var script = document.createElement('script');
      script.src = getURL(src);
      document.head.appendChild(script);
  }
  function addCss(src, rel = 'stylesheet', type = 'text/css') {
      var link = document.createElement('link');
      link.rel = rel;
      link.type = type;
      link.href = getURL(src);
      document.head.appendChild(link);
  }
  function createBlobURL(content, type) {
      var blob = new Blob([content], { type });
      return URL.createObjectURL(blob);
  }
  const p32 = (i) => [i, i / 256, i / 65536, i / 16777216].map(i => String.fromCharCode(Math.floor(i) % 256)).join('');
  const u32 = (s) => s.split('').map(i => i.charCodeAt(0)).reduce((a, b) => b * 256 + a);
  let messageMap = {};
  function onMessage(type, cb) {
      messageMap[type] = cb;
  }
  function postMessage(type, data) {
      window.postMessage({
          type: type,
          data: data
      }, "*");
  }
  let msgCallbacks = [];
  let lastCbId = 0;

  window.addEventListener('message', (event) => __awaiter(window, void 0, void 0, function* () {
      const data = event.data;
      if (data.cb) {
          let cb = msgCallbacks[data.cbId];
          if (cb && (typeof cb === 'function')) {
              cb(data.cbResult);
          }
      }
      else if (data.type) {
          let result = undefined;
          if (typeof messageMap[data.type] === 'function') {
              result = messageMap[data.type](data.data);
              if (result instanceof Promise) {
                  result = yield result;
              }
              if (data.cbId) {
                  window.postMessage({
                      cb: true,
                      cbId: data.cbId,
                      cbResult: result
                  }, '*');
              }
          }
      }
  }), false);

  function getSync() {
      return new Promise((res, rej) => {
          if (chrome && chrome.storage && chrome.storage.sync) {
              chrome.storage.sync.get(items => {
                  res(items);
              });
          }
          else {
              rej(new Error('不支持的存储方式'));
          }
      });
  }
  function setSync(item) {
      return new Promise((res, rej) => {
          if (chrome && chrome.storage && chrome.storage.sync) {
              chrome.storage.sync.set(item, res);
          }
          else {
              rej(new Error('不支持的存储方式'));
          }
      });
  }
  function getSetting() {
      return __awaiter(this, void 0, void 0, function* () {
          let setting;
          try {
              setting = yield getSync();
          }
          catch (e) {
          }
          if (!setting) {
              setting = {};
          }
          if (!setting.blacklist) {
              setting.blacklist = [];
          }
          return setting;
      });
  }
  function setSetting(setting) {
      return __awaiter(this, void 0, void 0, function* () {
          yield setSync(setting);
      });
  }
  const defaultBgListener = (request) => __awaiter(window, void 0, void 0, function* () { return null; });
  let bgListener = defaultBgListener;
  function setBgListener(listener) {
      if (bgListener === defaultBgListener) {
          if ((typeof chrome !== 'undefined') && chrome.runtime && chrome.runtime.onMessage) {
              chrome.runtime.onMessage.addListener((request, sender, sendResponse) => __awaiter(this, void 0, void 0, function* () {
                  sendResponse(yield bgListener(request));
              }));
          }
      }
      else {
          console.warn('多次设置BgListener');
      }
      bgListener = listener;
  }
  class DelayNotify {
      constructor(defaultValue) {
          this.defaultValue = defaultValue;
          this.notified = false;
          this.tmid = null;
          this.res = null;
      }
      notify(value) {
          if (this.notified) {
              return;
          }
          this.notified = true;
          this.value = value;
          if (this.res) {
              this.res(this.value);
          }
      }
      wait(timeout = 1000 * 10) {
          if (this.notified) {
              return Promise.resolve(this.value);
          }
          return new Promise((resolve, reject) => {
              if (timeout > 0) {
                  window.setTimeout(() => {
                      resolve(this.defaultValue);
                  }, timeout);
              }
              this.res = (value) => {
                  return resolve(value);
              };
          });
      }
      reset() {
          this.notified = false;
      }
  }

  /*! typestate - v1.0.4 - 2016-09-07
  * https://github.com/eonarheim/TypeState
  * Copyright (c) 2016 Erik Onarheim; Licensed BSD-2-Clause*/
  var typestate;
  (function (typestate) {
      /**
       * Transition grouping to faciliate fluent api
       */
      var Transitions = (function () {
          function Transitions(fsm) {
              this.fsm = fsm;
          }
          /**
           * Specify the end state(s) of a transition function
           */
          Transitions.prototype.to = function () {
              var states = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  states[_i - 0] = arguments[_i];
              }
              this.toStates = states;
              this.fsm.addTransitions(this);
          };
          /**
           * Specify that any state in the state enum is value
           * Takes the state enum as an argument
           */
          Transitions.prototype.toAny = function (states) {
              var toStates = [];
              for (var s in states) {
                  if (states.hasOwnProperty(s)) {
                      toStates.push(states[s]);
                  }
              }
              this.toStates = toStates;
              this.fsm.addTransitions(this);
          };
          return Transitions;
      }());
      typestate.Transitions = Transitions;
      /**
       * Internal representation of a transition function
       */
      var TransitionFunction = (function () {
          function TransitionFunction(fsm, from, to) {
              this.fsm = fsm;
              this.from = from;
              this.to = to;
          }
          return TransitionFunction;
      }());
      typestate.TransitionFunction = TransitionFunction;
      /**
       * A simple finite state machine implemented in TypeScript, the templated argument is meant to be used
       * with an enumeration.
       */
      var FiniteStateMachine = (function () {
          function FiniteStateMachine(startState) {
              this._transitionFunctions = [];
              this._onCallbacks = {};
              this._exitCallbacks = {};
              this._enterCallbacks = {};
              this._invalidTransitionCallback = null;
              this.currentState = startState;
              this._startState = startState;
          }
          FiniteStateMachine.prototype.addTransitions = function (fcn) {
              var _this = this;
              fcn.fromStates.forEach(function (from) {
                  fcn.toStates.forEach(function (to) {
                      // self transitions are invalid and don't add duplicates
                      if (from !== to && !_this._validTransition(from, to)) {
                          _this._transitionFunctions.push(new TransitionFunction(_this, from, to));
                      }
                  });
              });
          };
          /**
           * Listen for the transition to this state and fire the associated callback
           */
          FiniteStateMachine.prototype.on = function (state, callback) {
              var key = state.toString();
              if (!this._onCallbacks[key]) {
                  this._onCallbacks[key] = [];
              }
              this._onCallbacks[key].push(callback);
              return this;
          };
          /**
           * Listen for the transition to this state and fire the associated callback, returning
           * false in the callback will block the transition to this state.
           */
          FiniteStateMachine.prototype.onEnter = function (state, callback) {
              var key = state.toString();
              if (!this._enterCallbacks[key]) {
                  this._enterCallbacks[key] = [];
              }
              this._enterCallbacks[key].push(callback);
              return this;
          };
          /**
           * Listen for the transition to this state and fire the associated callback, returning
           * false in the callback will block the transition from this state.
           */
          FiniteStateMachine.prototype.onExit = function (state, callback) {
              var key = state.toString();
              if (!this._exitCallbacks[key]) {
                  this._exitCallbacks[key] = [];
              }
              this._exitCallbacks[key].push(callback);
              return this;
          };
          /**
           * List for an invalid transition and handle the error, returning a falsy value will throw an
           * exception, a truthy one will swallow the exception
           */
          FiniteStateMachine.prototype.onInvalidTransition = function (callback) {
              if (!this._invalidTransitionCallback) {
                  this._invalidTransitionCallback = callback;
              }
              return this;
          };
          /**
           * Declares the start state(s) of a transition function, must be followed with a '.to(...endStates)'
           */
          FiniteStateMachine.prototype.from = function () {
              var states = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  states[_i - 0] = arguments[_i];
              }
              var _transition = new Transitions(this);
              _transition.fromStates = states;
              return _transition;
          };
          FiniteStateMachine.prototype.fromAny = function (states) {
              var fromStates = [];
              for (var s in states) {
                  if (states.hasOwnProperty(s)) {
                      fromStates.push(states[s]);
                  }
              }
              var _transition = new Transitions(this);
              _transition.fromStates = fromStates;
              return _transition;
          };
          FiniteStateMachine.prototype._validTransition = function (from, to) {
              return this._transitionFunctions.some(function (tf) {
                  return (tf.from === from && tf.to === to);
              });
          };
          /**
           * Check whether a transition to a new state is valid
           */
          FiniteStateMachine.prototype.canGo = function (state) {
              return this.currentState === state || this._validTransition(this.currentState, state);
          };
          /**
           * Transition to another valid state
           */
          FiniteStateMachine.prototype.go = function (state) {
              if (!this.canGo(state)) {
                  if (!this._invalidTransitionCallback || !this._invalidTransitionCallback(this.currentState, state)) {
                      throw new Error('Error no transition function exists from state ' + this.currentState.toString() + ' to ' + state.toString());
                  }
              }
              else {
                  this._transitionTo(state);
              }
          };
          /**
           * This method is availble for overridding for the sake of extensibility.
           * It is called in the event of a successful transition.
           */
          FiniteStateMachine.prototype.onTransition = function (from, to) {
              // pass, does nothing until overidden
          };
          /**
          * Reset the finite state machine back to the start state, DO NOT USE THIS AS A SHORTCUT for a transition.
          * This is for starting the fsm from the beginning.
          */
          FiniteStateMachine.prototype.reset = function () {
              this.currentState = this._startState;
          };
          /**
           * Whether or not the current state equals the given state
           */
          FiniteStateMachine.prototype.is = function (state) {
              return this.currentState === state;
          };
          FiniteStateMachine.prototype._transitionTo = function (state) {
              var _this = this;
              if (!this._exitCallbacks[this.currentState.toString()]) {
                  this._exitCallbacks[this.currentState.toString()] = [];
              }
              if (!this._enterCallbacks[state.toString()]) {
                  this._enterCallbacks[state.toString()] = [];
              }
              if (!this._onCallbacks[state.toString()]) {
                  this._onCallbacks[state.toString()] = [];
              }
              var canExit = this._exitCallbacks[this.currentState.toString()].reduce(function (accum, next) {
                  return accum && next.call(_this, state);
              }, true);
              var canEnter = this._enterCallbacks[state.toString()].reduce(function (accum, next) {
                  return accum && next.call(_this, _this.currentState);
              }, true);
              if (canExit && canEnter) {
                  var old = this.currentState;
                  this.currentState = state;
                  this._onCallbacks[this.currentState.toString()].forEach(function (fcn) {
                      fcn.call(_this, old);
                  });
                  this.onTransition(old, state);
              }
          };
          return FiniteStateMachine;
      }());
      typestate.FiniteStateMachine = FiniteStateMachine;
  })(typestate || (typestate = {}));
  var TypeState_1 = typestate;

  const storage = new LocalStorage('h5plr');
  function findInParent(node, toFind) {
      while ((node !== toFind) && (node !== null)) {
          node = node.parentElement;
      }
      return node !== null;
  }
  var PlayerState;
  (function (PlayerState) {
      PlayerState[PlayerState["Stopped"] = 0] = "Stopped";
      PlayerState[PlayerState["Playing"] = 1] = "Playing";
      PlayerState[PlayerState["Paused"] = 2] = "Paused";
      PlayerState[PlayerState["Buffering"] = 3] = "Buffering";
  })(PlayerState || (PlayerState = {}));
  var SizeState;
  (function (SizeState) {
      SizeState[SizeState["Normal"] = 0] = "Normal";
      SizeState[SizeState["FullPage"] = 1] = "FullPage";
      SizeState[SizeState["FullScreen"] = 2] = "FullScreen";
      SizeState[SizeState["ExitFullScreen"] = 3] = "ExitFullScreen";
  })(SizeState || (SizeState = {}));
  class SizeStateFSM extends TypeState_1.FiniteStateMachine {
      constructor() {
          super(SizeState.Normal);
          this.fromAny(SizeState).to(SizeState.Normal);
          this.fromAny(SizeState).to(SizeState.FullPage);
          this.fromAny(SizeState).to(SizeState.FullScreen);
          this.from(SizeState.FullScreen).to(SizeState.ExitFullScreen);
      }
      onTransition(from, to) {
          console.log('SizeFSM', from, to);
      }
  }
  class PlayerStateFSM extends TypeState_1.FiniteStateMachine {
      constructor() {
          super(PlayerState.Stopped);
          this.fromAny(PlayerState).to(PlayerState.Stopped);
          this.fromAny(PlayerState).to(PlayerState.Playing);
          this.from(PlayerState.Playing).to(PlayerState.Buffering);
          this.from(PlayerState.Playing).to(PlayerState.Paused);
          this.from(PlayerState.Buffering).to(PlayerState.Paused);
      }
      onTransition(from, to) {
          console.log('PlayerFSM', from, to);
      }
  }
  class PlayerUI {
      constructor(listener, state) {
          this.listener = listener;
          this.state = state;
          this.inputing = false;
          this.hideDanmu = false;
          this._muted = false;
          this._fullscreen = false;
          this._lastY = -1;
          const playerContainer = document.createElement('div');
          const playerWrap = document.createElement('div');
          const playerCtrl = document.createElement('div');
          const danmuLayout = document.createElement('div');
          const videoBox = document.createElement('div');
          const msgBox = document.createElement('div');
          const msgInput = document.createElement('input');
          const videoEl = document.createElement('video');
          this.sizeState = new SizeStateFSM();
          let lastState;
          this.sizeState
              .on(SizeState.Normal, from => {
              switch (from) {
                  case SizeState.FullPage:
                      this._exitFullPage();
                      break;
                  case SizeState.ExitFullScreen:
                      this._exitFullScreen();
                      break;
              }
          })
              .on(SizeState.FullPage, from => {
              switch (from) {
                  case SizeState.Normal:
                      this._enterFullPage();
                      break;
                  case SizeState.ExitFullScreen:
                      this._enterFullPage();
                      break;
              }
          })
              .on(SizeState.FullScreen, from => {
              if (from == SizeState.FullScreen)
                  return;
              lastState = from;
              switch (from) {
                  case SizeState.Normal:
                      this._enterFullScreen();
                      break;
                  case SizeState.FullPage:
                      this._enterFullScreen();
                      break;
              }
          })
              .on(SizeState.ExitFullScreen, from => {
              this._exitFullScreen();
              this.sizeState.go(lastState);
          });
          videoEl.style.width = videoEl.style.height = '100%';
          msgInput.type = 'text';
          msgInput.placeholder = '发送弹幕...';
          msgBox.className = 'danmu-input';
          videoBox.className = 'danmu-video';
          playerCtrl.className = 'danmu-ctrl';
          danmuLayout.className = 'danmu-layout';
          playerWrap.className = 'danmu-wrap';
          playerContainer.className = 'danmu-container';
          videoBox.appendChild(videoEl);
          msgBox.appendChild(msgInput);
          playerWrap.appendChild(videoBox);
          playerWrap.appendChild(playerCtrl);
          playerWrap.appendChild(danmuLayout);
          playerWrap.appendChild(msgBox);
          playerContainer.appendChild(playerWrap);
          let timer = new Timer(1000);
          timer.onTimer = () => playerWrap.removeAttribute('hover');
          playerWrap.addEventListener('mousemove', event => {
              const hoverCtl = findInParent(event.target, playerCtrl);
              if (event.offsetY - this._lastY == 0)
                  return;
              this._lastY = event.offsetY;
              let height = playerWrap.getBoundingClientRect().height;
              if (event.offsetY > 0) {
                  playerWrap.setAttribute('hover', '');
                  timer.reset();
              }
              else {
                  playerWrap.removeAttribute('hover');
              }
          });
          playerWrap.addEventListener('click', event => {
              if (findInParent(event.target, msgBox))
                  return;
              playerWrap.removeAttribute('inputing');
              this.inputing = false;
          });
          document.addEventListener('keydown', event => {
              if (event.keyCode == 13) {
                  if (this.sizeState.is(SizeState.Normal))
                      return;
                  if (event.target.nodeName.toUpperCase() === 'TEXTAREA')
                      return;
                  this.inputing = !this.inputing;
                  if (this.inputing) {
                      msgInput.value = '';
                      playerWrap.setAttribute('inputing', '');
                      msgInput.focus();
                  }
                  else {
                      if (msgInput.value.length > 0) {
                          listener.onSendDanmu(msgInput.value);
                      }
                      playerWrap.removeAttribute('inputing');
                  }
              }
              else if (event.keyCode == 27) {
                  if (this.sizeState.is(SizeState.FullPage)) {
                      this.sizeState.go(SizeState.Normal);
                  }
                  if (this.sizeState.is(SizeState.FullScreen)) {
                      this.sizeState.go(SizeState.ExitFullScreen);
                  }
              }
          });
          document.addEventListener('webkitfullscreenchange', event => {
              this._fullscreen = !this._fullscreen;
              if (!this._fullscreen) {
                  if (this.sizeState.is(SizeState.FullScreen)) {
                      this.sizeState.go(SizeState.ExitFullScreen);
                  }
              }
          });
          window.addEventListener('unload', event => {
              listener.onStop();
              listener.onUnload();
          });
          this.video = videoEl;
          this.el = playerContainer;
          this.wrap = playerWrap;
          this.dmLayout = danmuLayout;
          this.playerCtrl = playerCtrl;
          this.transparent = this.transparent;
      }
      _exitFullScreen() {
          exitFullscreen();
          this.wrap.removeAttribute('fullpage');
          this.el.appendChild(this.wrap);
          document.body.style.overflow = document.body.parentElement.style.overflow = 'auto';
          this.listener.onTryPlay();
      }
      _enterFullScreen() {
          requestFullScreen();
          this.wrap.setAttribute('fullpage', '');
          document.body.appendChild(this.wrap);
          document.body.style.overflow = document.body.parentElement.style.overflow = 'hidden';
          this.listener.onTryPlay();
      }
      _exitFullPage() {
          this.wrap.removeAttribute('fullpage');
          this.el.appendChild(this.wrap);
          document.body.style.overflow = document.body.parentElement.style.overflow = 'auto';
          this.listener.onTryPlay();
      }
      _enterFullPage() {
          this.wrap.setAttribute('fullpage', '');
          document.body.appendChild(this.wrap);
          document.body.style.overflow = document.body.parentElement.style.overflow = 'hidden';
          this.listener.onTryPlay();
      }
      get transparent() {
          return parseInt(storage.getItem('transparent', '0'));
      }
      set transparent(val) {
          storage.setItem('transparent', val.toString());
          this.dmLayout.style.opacity = (1 - val / 100).toString();
      }
      get playing() {
          return this.state.is(PlayerState.Playing) || this.state.is(PlayerState.Buffering);
      }
      set playing(val) {
          if (val) {
              this.state.go(PlayerState.Playing);
          }
          else {
              this.state.go(PlayerState.Paused);
          }
      }
      get muted() {
          return this._muted;
      }
      set muted(v) {
          this.listener.onMute(v);
          if (v) {
              this.muteEl.setAttribute('muted', '');
          }
          else {
              this.muteEl.removeAttribute('muted');
          }
          this._muted = v;
      }
      notifyStateChange() {
          if (this.playing) {
              this.playPause.setAttribute('pause', '');
          }
          else {
              this.playPause.removeAttribute('pause');
          }
      }
      initControls() {
          if (this.tipEl)
              return;
          let bar = this.playerCtrl;
          const now = () => new Date().getTime();
          const addBtn = (cls, cb) => {
              const btn = document.createElement('a');
              btn.className = ['danmu-btn', 'danmu-' + cls].join(' ');
              btn.addEventListener('click', cb);
              bar.appendChild(btn);
              return btn;
          };
          this.video.addEventListener('dblclick', event => {
              switch (this.sizeState.currentState) {
                  case SizeState.Normal:
                      this.sizeState.go(SizeState.FullPage);
                      break;
                  case SizeState.FullPage:
                      this.sizeState.go(SizeState.Normal);
                      break;
                  case SizeState.FullScreen:
                      this.sizeState.go(SizeState.ExitFullScreen);
                      break;
              }
              event.preventDefault();
              event.stopPropagation();
          });
          this.playPause = addBtn('playpause', () => {
              this.playing = !this.playing;
              this.notifyStateChange();
          });
          this.playPause.setAttribute('pause', '');
          const reload = addBtn('reload', () => {
              this.listener.onReload();
          });
          const fullscreen = addBtn('fullscreen', () => {
              if (this.sizeState.is(SizeState.FullScreen)) {
                  this.sizeState.go(SizeState.ExitFullScreen);
              }
              else {
                  this.sizeState.go(SizeState.FullScreen);
              }
          });
          const fullpage = addBtn('fullpage', () => {
              switch (this.sizeState.currentState) {
                  case SizeState.Normal:
                      this.sizeState.go(SizeState.FullPage);
                      break;
                  case SizeState.FullPage:
                      this.sizeState.go(SizeState.Normal);
                      break;
                  case SizeState.FullScreen:
                      this.sizeState.go(SizeState.ExitFullScreen);
                      this.sizeState.go(SizeState.FullPage);
                      break;
              }
          });
          const volume = this.createVolume(percent => {
              this.listener.onVolumeChange(percent);
          });
          bar.appendChild(volume);
          this.muteEl = addBtn('mute', () => {
              this.muted = !this.muted;
          });
          const danmuSwitch = addBtn('switch', () => {
              this.hideDanmu = !this.hideDanmu;
              this.listener.onHideDanmu(this.hideDanmu);
              danmuSwitch.innerText = this.hideDanmu ? '开启弹幕' : '关闭弹幕';
              this.dmLayout.style.display = this.hideDanmu ? 'none' : 'block';
          });
          danmuSwitch.innerText = this.hideDanmu ? '开启弹幕' : '关闭弹幕';
          const tip = document.createElement('div');
          tip.className = 'danmu-tip';
          bar.appendChild(tip);
          this.tipEl = tip;
      }
      createVolume(cb) {
          const volume = document.createElement('div');
          const progress = document.createElement('div');
          const input = document.createElement('input');
          volume.className = 'danmu-volume';
          progress.className = 'progress';
          input.type = 'range';
          volume.appendChild(input);
          volume.appendChild(progress);
          input.value = storage.getItem('volume') || '100';
          cb(parseInt(input.value) / 100);
          input.addEventListener('input', event => {
              progress.style.width = `${input.value}%`;
              cb(parseInt(input.value) / 100);
              storage.setItem('volume', input.value);
          });
          progress.style.width = `${input.value}%`;
          return volume;
      }
      setTip(tip) {
          this.tipEl.innerText = tip;
      }
  }
  class PlayerBufferMonitor {
      constructor(dmPlayer) {
          this.dmPlayer = dmPlayer;
          this.intId = window.setInterval(() => {
              try {
                  this.handler();
              }
              catch (e) {
                  console.error(e);
              }
          }, 200);
          this.reset();
      }
      unload() {
          window.clearInterval(this.intId);
      }
      reset() {
          this.bufTime = 1;
      }
      get player() {
          return this.dmPlayer.player;
      }
      handler() {
          if (this.player) {
              const buffered = this.player.buffered;
              if (buffered.length === 0)
                  return;
              const buf = buffered.end(buffered.length - 1) - this.player.currentTime;
              const state = this.dmPlayer.state;
              if (state.is(PlayerState.Playing)) {
                  if (buf <= 1) {
                      state.go(PlayerState.Buffering);
                      this.dmPlayer.ui.notifyStateChange();
                      this.bufTime *= 2;
                      if (this.bufTime > 8) {
                          console.warn('网络不佳');
                          this.bufTime = 8;
                      }
                  }
              }
              else if (state.is(PlayerState.Buffering)) {
                  if (buf > this.bufTime) {
                      state.go(PlayerState.Playing);
                      this.dmPlayer.player.currentTime -= 0.5;
                      this.dmPlayer.ui.notifyStateChange();
                  }
              }
          }
      }
  }
  class DanmuPlayer {
      constructor(listener, ui) {
          this.inputing = false;
          this._src = '';
          this.bufferMonitor = new PlayerBufferMonitor(this);
          this.state = new PlayerStateFSM();
          const now = () => new Date().getTime();
          let beginTime = 0;
          this.state
              .on(PlayerState.Stopped, () => {
              beginTime = 0;
              this.mgr.deferTime = 0;
              this.bufferMonitor.reset();
              if (this.player) {
                  this.player.unload();
                  this.player.detachMediaElement();
                  this.player = null;
              }
          })
              .on(PlayerState.Paused, from => {
              beginTime = now();
              this.player.pause();
          })
              .on(PlayerState.Playing, from => {
              if (beginTime !== 0) {
                  this.mgr.deferTime += now() - beginTime;
              }
              this.player.play();
          })
              .on(PlayerState.Buffering, from => {
              beginTime = 0;
              this.player.pause();
          });
          this.initUI();
          this.mgr = new DanmuManager(this.ui.dmLayout, this.state);
          this.listener = listener;
      }
      onVolumeChange(vol) {
          this.player.volume = vol;
      }
      onReload() {
          this.stop();
          this.load();
      }
      onSendDanmu(txt) {
          this.listener.onSendDanmu(txt);
      }
      onStop() {
          this.stop();
      }
      onUnload() {
          this.bufferMonitor.unload();
      }
      onTryPlay() {
          this.tryPlay();
      }
      onMute(muted) {
          if (muted) {
              this.lastVolume = this.player.volume;
              this.player.volume = 0;
          }
          else {
              this.player.volume = this.lastVolume;
          }
      }
      onHideDanmu(hide) {
          this.mgr.hideDanmu = hide;
      }
      onStat(e) {
          this.ui.setTip(Math.round(e.speed * 10) / 10 + 'KB/s');
      }
      load() {
          return __awaiter(this, void 0, void 0, function* () {
              this.src = yield this.listener.getSrc();
          });
      }
      createFlvjs() {
          const sourceConfig = {
              isLive: true,
              type: 'flv',
              url: this.src
          };
          const playerConfig = {
              enableWorker: false,
              deferLoadAfterSourceOpen: true,
              stashInitialSize: 512 * 1024,
              enableStashBuffer: true,
              autoCleanupMinBackwardDuration: 20,
              autoCleanupMaxBackwardDuration: 40,
              autoCleanupSourceBuffer: true
          };
          const player = flvjs.createPlayer(sourceConfig, playerConfig);
          player.on(flvjs.Events.ERROR, (e, t) => {
              console.error('播放器发生错误：' + e + ' - ' + t);
              player.unload();
          });
          player.on(flvjs.Events.STATISTICS_INFO, this.onStat.bind(this));
          player.attachMediaElement(this.ui.video);
          player.load();
          player.play();
          return player;
      }
      stop() {
          this.state.go(PlayerState.Stopped);
      }
      set src(val) {
          this._src = val;
          this.stop();
          let player = this.createFlvjs();
          this.player = player;
          this.ui.initControls();
          this.state.go(PlayerState.Playing);
      }
      get src() {
          return this._src;
      }
      initUI() {
          this.ui = new PlayerUI(this, this.state);
      }
      tryPlay() {
          if (this.state.is(PlayerState.Playing)) {
              try {
                  this.ui.video.play();
              }
              catch (e) { }
          }
      }
      fireDanmu(text, color, cls) {
          return this.mgr.fireDanmu(text, color, cls);
      }
  }
  class DanmuManager {
      constructor(danmuLayout, state) {
          this.danmuLayout = danmuLayout;
          this.state = state;
          this.pool = [];
          this.rows = [];
          this._deferTime = 0;
          this.maxRow = 10;
          this.baseTop = 10;
          this.deferId = null;
          this.deferQueue = [];
          this.hideDanmu = false;
          this.parsePic = (i) => i;
          const poolSize = 100;
          for (let i = 0; i < poolSize; i++) {
              let dm = document.createElement('div');
              danmuLayout.appendChild(dm);
              this.pool.push({
                  el: dm,
                  using: false
              });
          }
      }
      get playing() {
          return this.state.is(PlayerState.Playing);
      }
      set deferTime(v) {
          this._deferTime = v;
          this.defering = v !== 0;
      }
      get deferTime() {
          return this._deferTime;
      }
      calcRect() {
          return this.danmuLayout.getBoundingClientRect();
      }
      calcRow(width, duration) {
          let rect = this.calcRect();
          const now = new Date().getTime();
          const check = (idx) => {
              let row = this.rows[idx];
              if (!row)
                  return true;
              if (row.endTime <= now) {
                  this.rows[idx] = null;
                  return true;
              }
              else {
                  const distance = rect.width + row.width;
                  const percent = (now - row.beginTime) / row.duration;
                  const left = rect.width - distance * percent;
                  if (left + row.width >= rect.width) {
                      return false;
                  }
                  const remainTime = row.endTime - now;
                  const myDistance = rect.width + width;
                  const leftX = rect.width - (myDistance) * (remainTime / duration);
                  if (leftX < 0) {
                      return false;
                  }
              }
              return true;
          };
          let i = 0;
          while (true) {
              if (check(i)) {
                  this.rows[i] = {
                      duration: duration,
                      beginTime: now,
                      endTime: now + duration,
                      width: width
                  };
                  return i % this.maxRow;
              }
              i++;
          }
      }
      doDefer() {
          if (this.deferQueue.length === 0)
              return;
          const top = this.deferQueue[0];
          const now = new Date().getTime();
          if (this.playing && ((top.oriTime + this.deferTime) <= now)) {
              top.run();
              this.deferQueue.shift();
          }
      }
      set defering(v) {
          if (this.deferId === null) {
              if (v) {
                  this.deferId = window.setInterval(() => this.doDefer(), 100);
              }
          }
          else {
              if (v === false) {
                  window.clearInterval(this.deferId);
                  this.deferId = null;
              }
          }
      }
      fireDanmu(text, color, cls) {
          const fire = () => {
              let rect = this.calcRect();
              const duration = rect.width * 7;
              let { el: dm } = this.pool.shift();
              setTimeout(() => {
                  dm.removeAttribute('style');
                  this.pool.push({
                      el: dm,
                      using: false
                  });
              }, duration);
              dm.innerText = text;
              dm.innerHTML = this.parsePic(dm.innerHTML);
              if (Array.isArray(cls))
                  cls = cls.join(' ');
              dm.className = cls || '';
              dm.style.left = `${rect.width}px`;
              dm.style.display = 'inline-block';
              dm.style.color = color;
              setTimeout(() => {
                  let dmRect = dm.getBoundingClientRect();
                  const row = this.calcRow(dmRect.width, duration);
                  dm.style.top = `${this.baseTop + row * dmRect.height}px`;
                  dm.style.transition = `transform ${duration / 1000}s linear`;
                  dm.style.transform = `translateX(-${rect.width + dmRect.width}px)`;
              }, 0);
          };
          const now = new Date().getTime();
          if (!this.playing || this.deferTime > 0) {
              this.deferQueue.push({
                  oriTime: now,
                  run: () => fire()
              });
              return;
          }
          if (this.hideDanmu)
              return;
          if (this.pool.length == 0)
              return;
          fire();
      }
  }

  const createMenu = (x, y) => {
    const wrap = document.createElement('div');
    const menu = document.createElement('div');
    wrap.className = 'player-menu';
    menu.className = 'menu';
    wrap.appendChild(menu);

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.close = () => document.body.removeChild(wrap);
    wrap.addEventListener('mousedown', event => {
      if (event.target === wrap) {
        document.body.removeChild(wrap);
      }
    });
    wrap.addEventListener('contextmenu', event => event.preventDefault());

    document.body.appendChild(wrap);
    return menu
  };
  const addTextMenu = (menu, text, cb) => {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.innerText = text;
    menu.appendChild(item);

    item.addEventListener('click', () => {
      menu.close();
      cb();
    });
  };
  const addEleMenu = (menu, ele) => {
    const item = document.createElement('div');
    item.className = 'menu-ele';
    item.appendChild(ele);
    menu.appendChild(item);
  };
  const addLabelMenu = (menu, label) => {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.innerText = label;
    menu.appendChild(item);
  };
  const addDash = (menu) => {
    const item = document.createElement('div');
    item.className = 'menu-dash';
    menu.appendChild(item);
  };
  function bindMenu (el, menuItems) {
    el.addEventListener('contextmenu', event => {
      const menu = createMenu(event.clientX, event.clientY);
      let items = menuItems;
      if (typeof items === 'function') items = items();
      for (let item of items) {
        if (item.text) {
          addTextMenu(menu, item.text, item.cb);
        } else if (item.el) {
          addEleMenu(menu, item.el, item.cb);
        } else if (item.label) {
          addLabelMenu(menu, item.label);
        } else {
          addDash(menu);
        }
      }
      const rect = menu.getBoundingClientRect();
      if (menu.offsetLeft + menu.offsetWidth > document.documentElement.clientWidth) {
        menu.style.left = `${rect.left - rect.width}px`;
      }
      if (menu.offsetTop + menu.offsetHeight > document.documentElement.clientHeight) {
        menu.style.top = `${rect.top - rect.height}px`;
      }
      event.preventDefault();
    });
  }

  function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  function md51(s) {
      var txt = '';
      var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
      for (i = 64; i <= s.length; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++)
          tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
          md5cycle(state, tail);
          for (i = 0; i < 16; i++)
              tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
  }
  function md5blk(s) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
  }
  var hex_chr = '0123456789abcdef'.split('');
  function rhex(n) {
      var s = '', j = 0;
      for (; j < 4; j++)
          s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
  }
  function hex(x) {
      return x.map(rhex).join('');
  }
  function md5(s) {
      return hex(md51(s));
  }
  var add32 = function (a, b) {
      return (a + b) & 0xFFFFFFFF;
  };
  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
      add32 = function (x, y) {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xFFFF);
      };
  }

  class BaseSource {
      constructor() {
          this.onChange = () => null;
      }
      set url(v) {
          if (v === this._url) {
              this._url = v;
              return;
          }
          this.onChange(v);
      }
      get url() {
          return this._url;
      }
  }

  let m_signer = null;
  function getSourceURL(rid, cdn, rate) {
      return __awaiter(this, void 0, void 0, function* () {
          const tt = Math.round(new Date().getTime() / 60 / 1000);
          const did = md5(Math.random().toString()).toUpperCase();
          if (m_signer === null) {
              throw new Error('Signer is not defined.');
          }
          const sign = yield m_signer(rid, tt, did);
          let body = {
              'cdn': cdn,
              'rate': rate,
              'ver': 'Douyu_h5_2017080201beta',
              'tt': tt,
              'did': did,
              'sign': sign.sign,
              'cptl': sign.cptl,
              'ct': 'webh5'
          };
          body = Object.keys(body).map(key => `${key}=${encodeURIComponent(body[key])}`).join('&');
          const res = yield fetch(`https://www.douyu.com/lapi/live/getPlay/${rid}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: body
          });
          const videoInfo = yield res.json();
          const baseUrl = videoInfo.data.rtmp_url;
          const livePath = videoInfo.data.rtmp_live;
          if (baseUrl && livePath) {
              const videoUrl = `${baseUrl}/${livePath}`;
              console.log('RoomId', rid, 'SourceURL:', videoUrl);
              return videoUrl;
          }
          else {
              throw new Error('未开播或获取失败');
          }
      });
  }
  function getSwfApi(rid) {
      return __awaiter(this, void 0, void 0, function* () {
          const API_KEY = 'bLFlashflowlad92';
          const tt = Math.round(new Date().getTime() / 60 / 1000);
          const signContent = [rid, API_KEY, tt].join('');
          const sign = md5(signContent);
          const res = yield fetch(`https://www.douyu.com/swf_api/room/${rid}?cdn=&nofan=yes&_t=${tt}&sign=${sign}`);
          const obj = yield res.json();
          return yield obj.data;
      });
  }
  class DouyuSource extends BaseSource {
      constructor(roomId, signer) {
          super();
          m_signer = signer;
          this._cdn = 'ws';
          this._rate = '0';
          this.url = '';
          this.roomId = roomId;
          this.swfApi = null;
      }
      set cdn(val) {
          this._cdn = val;
          this.getUrl();
      }
      get cdn() {
          return this._cdn;
      }
      set rate(val) {
          this._rate = val;
          this.getUrl();
      }
      get rate() {
          return this._rate;
      }
      get cdnsWithName() {
          if (this.swfApi) {
              return this.swfApi.cdnsWithName;
          }
          else {
              return [{
                      name: '主要线路',
                      cdn: 'ws'
                  }];
          }
      }
      getUrl() {
          return __awaiter(this, void 0, void 0, function* () {
              if (!this.swfApi) {
                  this.swfApi = yield getSwfApi(this.roomId);
                  this._cdn = this.swfApi.cdns[0];
              }
              let url = yield getSourceURL(this.roomId, this.cdn, this.rate);
              this.url = url;
              return url;
          });
      }
  }

  class JSocket {
      static init() {
          return __awaiter(this, void 0, void 0, function* () {
              const src = 'https://imspace.nos-eastchina1.126.net/JSocket2.swf';
              const flash = ['<object type="application/x-shockwave-flash" ', 'id="jsocket" ', 'name="jsocket" ', 'align="middle" ', 'allowscriptaccess="always" ', 'allowfullscreen="true" ', 'allowfullscreeninteractive="true" ', 'wmode="transparent" ', 'data="' + src + '" ', 'width="100%" ', 'height="100%">', '<param name="src" value="' + src + '">', '<param name="quality" value="high">', '<param name="bgcolor" value="#fff">', '<param name="allowscriptaccess" value="always">', '<param name="allowfullscreen" value="true">', '<param name="wmode" value="transparent">', '<param name="allowFullScreenInteractive" value="true">', '<param name="flashvars" value="">', "</object>"].join("");
              let div = document.createElement('div');
              div.className = 'jsocket-cls';
              document.body.appendChild(div);
              JSocket.el = div;
              div.innerHTML = flash;
              var api = document.querySelector('#jsocket');
              console.log(div, api);
              JSocket.flashapi = api;
              if (JSocket.flashapi.newsocket) {
                  return;
              }
              else {
                  return new Promise((res, rej) => {
                      const id = setTimeout(rej, 10 * 1000);
                      JSocket.swfloadedcb = () => {
                          clearTimeout(id);
                          res();
                      };
                  });
              }
          });
      }
      static swfloaded() {
          JSocket.swfloadedcb();
      }
      static connectHandler(socid) {
          JSocket.handlers[socid].connectHandler();
      }
      static dataHandler(socid, data) {
          try {
              JSocket.handlers[socid].dataHandler(atob(data));
          }
          catch (e) {
              console.error(e);
          }
      }
      static closeHandler(socid) {
          JSocket.handlers[socid].closeHandler();
      }
      static errorHandler(socid, str) {
          JSocket.handlers[socid].errorHandler(str);
      }
      init(handlers, newsocketopt) {
          this.socid = JSocket.flashapi.newsocket(newsocketopt);
          JSocket.handlers[this.socid] = handlers;
      }
      connect(host, port) {
          JSocket.flashapi.connect(this.socid, host, port);
      }
      write(data) {
          JSocket.flashapi.write(this.socid, btoa(data));
      }
      writeFlush(data) {
          JSocket.flashapi.writeFlush(this.socid, btoa(data));
      }
      close() {
          JSocket.flashapi.close(this.socid);
      }
      flush() {
          JSocket.flashapi.flush(this.socid);
      }
  }
  JSocket.VERSION = '0.1';
  JSocket.handlers = [];
  window.JSocket = JSocket;

  const getACF = (key) => {
      try {
          return new RegExp(`acf_${key}=(.*?);`).exec(document.cookie)[1];
      }
      catch (e) {
          return '';
      }
  };
  function filterEnc(s) {
      s = s.toString();
      s = s.replace(/@/g, '@A');
      return s.replace(/\//g, '@S');
  }
  function filterDec(s) {
      s = s.toString();
      s = s.replace(/@S/g, '/');
      return s.replace(/@A/g, '@');
  }
  function douyuEncode(data) {
      return Object.keys(data).map(key => `${key}@=${filterEnc(data[key])}`).join('/') + '/';
  }
  function douyuDecode(data) {
      let out = {
          type: '!!missing!!'
      };
      try {
          data.split('/').filter(i => i.length > 2).forEach(i => {
              let e = i.split('@=');
              out[e[0]] = filterDec(e[1]);
          });
      }
      catch (e) {
          console.error(e);
          console.log(data);
      }
      return out;
  }
  function ACJ(id, data) {
      if (typeof data == 'object') {
          data = douyuEncode(data);
      }
      try {
          window._ACJ_([id, data]);
      }
      catch (e) {
          console.error(id, data, e);
      }
  }
  class DouyuProtocol extends JSocket {
      constructor(listener) {
          super();
          this.listener = listener;
          this.connectHandler = () => null;
          this.init(this, {});
          this.buffer = '';
      }
      connectAsync(host, port) {
          super.connect(host, port);
          return new Promise((res, rej) => {
              const prevConnHandler = this.connectHandler;
              const prevErrHandler = this.errorHandler;
              const recover = () => {
                  this.connectHandler = prevConnHandler;
                  this.errorHandler = prevErrHandler;
              };
              this.connectHandler = () => {
                  recover();
                  res();
              };
              this.errorHandler = () => {
                  recover();
                  rej();
              };
          });
      }
      dataHandler(data) {
          this.buffer += data;
          let buffer = this.buffer;
          while (buffer.length >= 4) {
              let size = u32(buffer.substr(0, 4));
              if (buffer.length >= size) {
                  let pkgStr = '';
                  try {
                      pkgStr = ascii_to_utf8(buffer.substr(12, size - 8));
                  }
                  catch (e) {
                      console.log('deocde fail', escape(buffer.substr(12, size - 8)));
                  }
                  this.buffer = buffer = buffer.substr(size + 4);
                  if (pkgStr.length === 0)
                      continue;
                  try {
                      let pkg = douyuDecode(pkgStr);
                      this.listener && this.listener.onPackage(pkg, pkgStr);
                  }
                  catch (e) {
                      console.error('call map', e);
                  }
              }
              else {
                  break;
              }
          }
      }
      closeHandler() {
          console.error('lost connection');
          this.listener && this.listener.onClose();
      }
      errorHandler(err) {
          console.error(err);
          this.listener && this.listener.onError(err);
      }
      send(data) {
          let msg = douyuEncode(data) + '\0';
          msg = utf8_to_ascii(msg);
          msg = p32(msg.length + 8) + p32(msg.length + 8) + p32(689) + msg;
          this.writeFlush(msg);
      }
  }
  function Type(type) {
      return (target, propertyKey, descriptor) => {
          if (!target.map) {
              target.map = {};
          }
          target.map[type] = target[propertyKey];
      };
  }
  class DouyuBaseClient {
      constructor(roomId) {
          this.roomId = roomId;
          this.lastIP = null;
          this.lastPort = null;
          this.keepaliveId = null;
          this.redirect = {};
          this.prot = new DouyuProtocol(this);
      }
      static getRoomArgs() {
          if (window._room_args)
              return window._room_args;
          if (window.room_args) {
              return window.room_args;
          }
          else {
              return window.$ROOM.args;
          }
      }
      reconnect() {
          return __awaiter(this, void 0, void 0, function* () {
              console.log('reconnect');
              this.prot.listener = null;
              this.prot = new DouyuProtocol(this);
              try {
                  yield this.connectAsync(this.lastIP, this.lastPort);
              }
              catch (e) {
                  this.onError();
              }
          });
      }
      onClose() {
          setTimeout(() => this.reconnect(), 1000);
      }
      onError() {
          this.onClose();
      }
      onPackage(pkg, pkgStr) {
          const type = pkg.type;
          if (this.redirect[type]) {
              ACJ(this.redirect[type], pkg);
              return;
          }
          if (this.map[type]) {
              this.map[type].call(this, pkg, pkgStr);
              return;
          }
          this.onDefault(pkg);
      }
      onDefault(pkg) {
      }
      send(pkg) {
          this.prot.send(pkg);
      }
      connectAsync(ip, port) {
          return __awaiter(this, void 0, void 0, function* () {
              this.lastIP = ip;
              this.lastPort = port;
              yield this.prot.connectAsync(ip, port);
              this.send(this.loginreq());
          });
      }
      keepalivePkg() {
          return {
              type: 'keeplive',
              tick: Math.round(new Date().getTime() / 1000).toString()
          };
      }
      loginreq() {
          const rt = Math.round(new Date().getTime() / 1000);
          const devid = getACF('devid');
          const username = getACF('username');
          console.log('username', username, devid);
          return {
              type: 'loginreq',
              username: username,
              ct: 0,
              password: '',
              roomid: this.roomId,
              devid: devid,
              rt: rt,
              vk: md5(`${rt}r5*^5;}2#\${XF[h+;'./.Q'1;,-]f'p[${devid}`),
              ver: '20150929',
              aver: '2017012111',
              biz: getACF('biz'),
              stk: getACF('stk'),
              ltkid: getACF('ltkid')
          };
      }
      startKeepalive() {
          this.send(this.keepalivePkg());
          if (this.keepaliveId) {
              clearInterval(this.keepaliveId);
          }
          this.keepaliveId = setInterval(() => this.send(this.keepalivePkg()), 30 * 1000);
      }
  }
  let blacklist = [];
  function onChatMsg(data) {
      if (blacklist.indexOf(data.uid) !== -1) {
          console.log('black');
          return;
      }
      try {
          postMessage('DANMU', data);
      }
      catch (e) {
          console.error('wtf', e);
      }
      ACJ('room_data_chat2', data);
      if (window.BarrageReturn) {
          window.BarrageReturn(douyuEncode(data));
      }
  }
  class DouyuClient extends DouyuBaseClient {
      constructor(roomId, danmuClient) {
          super(roomId);
          this.danmuClient = danmuClient;
          this.redirect = {
              qtlr: 'room_data_tasklis',
              initcl: 'room_data_chatinit',
              memberinfores: 'room_data_info',
              ranklist: 'room_data_cqrank',
              rsm: 'room_data_brocast',
              qausrespond: 'data_rank_score',
              frank: 'room_data_handler',
              online_noble_list: 'room_data_handler',
          };
      }
      reqOnlineGift(loginres) {
          return {
              type: 'reqog',
              uid: loginres.userid
          };
      }
      chatmsg(data) {
          onChatMsg(data);
      }
      resog(data) {
          ACJ('room_data_chest', {
              lev: data.lv,
              lack_time: data.t,
              dl: data.dl
          });
      }
      loginres(data) {
          console.log('loginres ms', data);
          this.uid = data.userid;
          this.send(this.reqOnlineGift(data));
          this.startKeepalive();
          ACJ('room_data_login', data);
          ACJ('room_data_getdid', {
              devid: getACF('devid')
          });
      }
      keeplive(data, rawString) {
          ACJ('room_data_userc', data.uc);
          ACJ('room_data_tbredpacket', rawString);
      }
      setmsggroup(data) {
          console.log('joingroup', data);
          this.danmuClient.send({
              type: 'joingroup',
              rid: data.rid,
              gid: data.gid
          });
      }
      onDefault(data) {
          ACJ('room_data_handler', data);
          console.log('ms', data);
      }
  }
  __decorate([
      Type('chatmsg')
  ], DouyuClient.prototype, "chatmsg", null);
  __decorate([
      Type('resog')
  ], DouyuClient.prototype, "resog", null);
  __decorate([
      Type('loginres')
  ], DouyuClient.prototype, "loginres", null);
  __decorate([
      Type('keeplive')
  ], DouyuClient.prototype, "keeplive", null);
  __decorate([
      Type('setmsggroup')
  ], DouyuClient.prototype, "setmsggroup", null);
  class DouyuDanmuClient extends DouyuBaseClient {
      constructor(roomId) {
          super(roomId);
          this.redirect = {
              chatres: 'room_data_chat2',
              initcl: 'room_data_chatinit',
              dgb: 'room_data_giftbat1',
              dgn: 'room_data_giftbat1',
              spbc: 'room_data_giftbat1',
              uenter: 'room_data_nstip2',
              upgrade: 'room_data_ulgrow',
              newblackres: 'room_data_sys',
              ranklist: 'room_data_cqrank',
              rankup: 'room_data_ulgrow',
              gift_title: 'room_data_schat',
              rss: 'room_data_state',
              srres: 'room_data_wbsharesuc',
              onlinegift: 'room_data_olyw',
              gpbc: 'room_data_handler',
              synexp: 'room_data_handler',
              frank: 'room_data_handler',
              ggbb: 'room_data_sabonusget',
              online_noble_list: 'room_data_handler',
          };
      }
      chatmsg(pkg) {
          onChatMsg(pkg);
      }
      loginres(data) {
          console.log('loginres dm', data);
          this.startKeepalive();
      }
      onDefault(data) {
          ACJ('room_data_handler', data);
          console.log('dm', data);
      }
  }
  __decorate([
      Type('chatmsg')
  ], DouyuDanmuClient.prototype, "chatmsg", null);
  __decorate([
      Type('loginres')
  ], DouyuDanmuClient.prototype, "loginres", null);

  const runtime = {
      sendMessage(message) {
          return chrome.runtime.sendMessage(message);
      },
      connect(connectInfo) {
          return chrome.runtime.connect(connectInfo);
      }
  };

  var SignerState;
  (function (SignerState) {
      SignerState[SignerState["None"] = 0] = "None";
      SignerState[SignerState["Loaded"] = 1] = "Loaded";
      SignerState[SignerState["Ready"] = 2] = "Ready";
      SignerState[SignerState["Timeout"] = 3] = "Timeout";
  })(SignerState || (SignerState = {}));
  function wrapPort(port) {
      let curMethod = '';
      let curResolve = null;
      let curReject = null;
      let stack = new Error().stack;
      port.onMessage.addListener((msg) => {
          if (msg.method === curMethod) {
              curResolve(msg.args[0]);
          }
          else {
              curReject('wtf');
              console.error('wtf?');
          }
      });
      return function (method, ...args) {
          return new Promise((resolve, reject) => {
              curMethod = method;
              curResolve = resolve;
              curReject = reject;
              port.postMessage({
                  method: method,
                  args: args
              });
          });
      };
  }
  let Signer;
  {
      const DB_NAME = 'shared-worker-signer';
      const DB_VERSION = 1;
      const DB_STORE_NAME = 'cache';
      class ManualCache {
          initDB() {
              return new Promise((resolve, reject) => {
                  const that = this;
                  const req = indexedDB.open(DB_NAME, DB_VERSION);
                  req.onsuccess = function (evt) {
                      that.db = this.result;
                      resolve(that);
                  };
                  req.onerror = function (evt) {
                      that.errCode = evt.target.errorCode;
                      reject(that.errCode);
                  };
                  req.onupgradeneeded = function (evt) {
                      const store = evt.currentTarget.result.createObjectStore(DB_STORE_NAME);
                  };
              });
          }
          getArrayBuffer(key, url) {
              return this.getFile(key).then((file) => {
                  if (file && file.url === url) {
                      return file.data;
                  }
                  else {
                      return this.fetchAndSave(key, url);
                  }
              });
          }
          putFile(key, url, data) {
              return new Promise((resolve, reject) => {
                  const tx = this.db.transaction(DB_STORE_NAME, 'readwrite');
                  const store = tx.objectStore(DB_STORE_NAME);
                  const req = store.put({ data: data, url: url }, key);
                  req.onsuccess = function (evt) {
                      resolve();
                  };
                  req.onerror = function () {
                      reject(this.error);
                  };
              });
          }
          getFile(key) {
              return new Promise((resolve, reject) => {
                  const tx = this.db.transaction(DB_STORE_NAME, 'readonly');
                  const store = tx.objectStore(DB_STORE_NAME);
                  const req = store.get(key);
                  req.onsuccess = function ({ target }) {
                      resolve(target.result);
                  };
                  req.onerror = function () {
                      reject(this.error);
                  };
              });
          }
          fetchAndSave(key, url) {
              return fetch(url).then(res => res.arrayBuffer()).then(buffer => this.putFile(key, url, buffer).then(() => buffer));
          }
      }
      const manualCache = new ManualCache();
      const signerURL = `data:text/javascript,importScripts('https://imspace.nos-eastchina1.126.net/shared-worker-signer_v0.0.3.js')`;
      class SharedWorkerSigner {
          static _clean() {
              this._resolve = null;
              this._reject = null;
          }
          static onMessage({ data }) {
              console.log('onMessage', data);
              if (data.type === 'query') {
                  if (data.data === true) {
                      this._resolve();
                      this._clean();
                      this._stopQuery = true;
                  }
                  else {
                      setTimeout(() => this.query(), 100);
                  }
              }
              else if (data.type === 'sign') {
                  this._resolve(data.data);
                  this._clean();
              }
              else if (data.type === 'error') {
                  this._reject(data.data);
                  this._clean();
              }
              else if (data.type === 'getArrayBuffer') {
                  manualCache.getArrayBuffer(data.key, data.url).then(buffer => {
                      this._worker.port.postMessage({
                          type: 'getArrayBuffer',
                          data: buffer
                      }, [buffer]);
                  }).catch((e) => {
                      this._worker.port.postMessage({
                          type: 'getArrayBuffer',
                          err: e
                      });
                  });
              }
          }
          static get state() {
              return this._state;
          }
          static sign(rid, tt, did) {
              return __awaiter(this, void 0, void 0, function* () {
                  return new Promise((resolve, reject) => {
                      this._worker.port.postMessage({
                          type: 'sign',
                          args: [rid, tt, did]
                      });
                      this._resolve = resolve;
                      this._reject = reject;
                  });
              });
          }
          static init() {
              if (this._inited) {
                  return Promise.resolve();
              }
              return manualCache.initDB().then(() => new Promise((resolve, reject) => {
                  this._resolve = resolve;
                  this._reject = reject;
                  const worker = new SharedWorker(signerURL);
                  this._worker = worker;
                  worker.port.onmessage = e => this.onMessage(e);
                  window.setTimeout(() => this.query(), 500);
                  window.setTimeout(() => {
                      if (this.state !== SignerState.Ready) {
                          this._state = SignerState.Timeout;
                      }
                      if (this._stopQuery === false) {
                          this._stopQuery = true;
                      }
                  }, 15 * 1000);
              }));
          }
          static query() {
              if (!this._stopQuery) {
                  this._worker.port.postMessage({
                      type: 'query'
                  });
              }
          }
      }
      SharedWorkerSigner._inited = false;
      SharedWorkerSigner._state = SignerState.None;
      SharedWorkerSigner._stopQuery = false;
      Signer = SharedWorkerSigner;
  }

  let dialog = null;
  function getDialog(title, content, qrcodes) {
      if (dialog) {
          return dialog;
      }
      dialog = document.createElement('div');
      dialog.className = 'donate-dialog';
      const wrap = document.createElement('div');
      wrap.className = 'donate-wrap';
      const titleEl = document.createElement('h3');
      titleEl.className = 'donate-title';
      titleEl.innerText = title;
      const contentEl = document.createElement('div');
      contentEl.className = 'donate-content';
      contentEl.innerText = content;
      const qrcodeEl = document.createElement('div');
      qrcodeEl.className = 'donate-qrcode-bar';
      for (let i of qrcodes) {
          const qrcodeBox = document.createElement('div');
          qrcodeBox.className = 'donate-qrcode-box';
          const qrcode = document.createElement('img');
          qrcode.className = 'donate-qrcode-img';
          qrcode.src = i.src;
          const qrcodeDesc = document.createElement('div');
          qrcodeDesc.className = 'donate-qrcode-desc';
          qrcodeDesc.innerText = i.desc;
          qrcodeBox.appendChild(qrcode);
          qrcodeBox.appendChild(qrcodeDesc);
          qrcodeEl.appendChild(qrcodeBox);
      }
      const closeEl = document.createElement('div');
      closeEl.className = 'donate-close-btn';
      const close = () => {
          dialog.style.display = 'none';
      };
      closeEl.addEventListener('click', close);
      wrap.appendChild(titleEl);
      wrap.appendChild(contentEl);
      wrap.appendChild(qrcodeEl);
      wrap.appendChild(closeEl);
      dialog.appendChild(wrap);
      dialog.style.display = 'none';
      return dialog;
  }

  const onload = () => {
      if (window.__space_inject) {
          const { script, css } = window.__space_inject;
          addCss(createBlobURL(css, 'text/css'));
          addScript(createBlobURL(script, 'text/javascript'));
          window.__space_inject = null;
      }
      else {
          addCss('dist/danmu.css');
          addScript('dist/douyuInject.js');
      }
      const uid = getACF('uid');
      flvjs.LoggingControl.forceGlobalTag = true;
      flvjs.LoggingControl.enableAll = true;
      class DouyuPlayerUI extends PlayerUI {
          constructor(listener, state) {
              super(listener, state);
              this.douyuFullpage = false;
              this.wrap.style.position = 'inherit';
              this.wrap.style.zIndex = 'inherit';
          }
          _enterFullScreen() {
              this.wrap.style.position = '';
              this.wrap.style.zIndex = '';
              super._enterFullScreen();
          }
          _exitFullScreen() {
              this.wrap.style.position = 'inherit';
              this.wrap.style.zIndex = 'inherit';
              super._exitFullScreen();
          }
          _enterFullPage() {
              this.wrap.setAttribute('fullpage', '');
              this.el.style.border = '0';
              if (!this.douyuFullpage) {
                  this.douyuFullpage = true;
                  postMessage('ACJ', {
                      id: 'room_bus_pagescr'
                  });
              }
          }
          _exitFullPage() {
              this.wrap.removeAttribute('fullpage');
              this.el.style.border = '';
              if (this.douyuFullpage) {
                  this.douyuFullpage = false;
                  postMessage('ACJ', {
                      id: 'room_bus_pagescr'
                  });
              }
          }
      }
      class DouyuDanmuPlayer extends DanmuPlayer {
          constructor(roomId) {
              const source = new DouyuSource(roomId, (rid, tt, did) => __awaiter(this, void 0, void 0, function* () {
                  let sign = yield Signer.sign(roomId, tt, did);
                  return sign;
              }));
              source.onChange = videoUrl => {
                  this.src = videoUrl;
              };
              super({
                  getSrc: () => source.getUrl(),
                  onSendDanmu(txt) {
                      window.postMessage({
                          type: "SENDANMU",
                          data: txt
                      }, "*");
                  }
              });
              this.source = source;
          }
          initUI() {
              this.ui = new DouyuPlayerUI(this, this.state);
          }
          onDanmuPkg(pkg) {
              const getColor = (c) => ['#ff0000', '#1e87f0', '#7ac84b', '#ff7f00', '#9b39f4', '#ff69b4'][c - 1];
              if (pkg.txt.length > 0) {
                  let cls = [];
                  let color = getColor(pkg.col) || '#ffffff';
                  if (pkg.uid === uid)
                      cls.push('danmu-self');
                  this.fireDanmu(pkg.txt, color, cls);
              }
          }
      }
      const makeMenu = (player, source) => {
          const cdnMenu = () => source.cdnsWithName.map((i) => {
              let suffix = '';
              if (i.cdn == source.cdn)
                  suffix = ' √';
              return {
                  text: i.name + suffix,
                  cb() {
                      source.cdn = i.cdn;
                  }
              };
          });
          const rateMenu = () => {
              const rates = [{
                      text: '超清',
                      rate: '0'
                  }, {
                      text: '高清',
                      rate: '2'
                  }, {
                      text: '普清',
                      rate: '1'
                  }];
              return rates.map(i => {
                  let suffix = '';
                  if (i.rate == source.rate)
                      suffix = ' √';
                  return {
                      text: i.text + suffix,
                      cb() {
                          source.rate = i.rate;
                      }
                  };
              });
          };
          const transparentMenu = () => {
              const opts = [{
                      text: '0%',
                      transparent: 0
                  }, {
                      text: '25%',
                      transparent: 25
                  }, {
                      text: '50%',
                      transparent: 50
                  }];
              return [{
                      label: '弹幕透明度:'
                  }].concat(opts.map(i => {
                  let suffix = '';
                  if (i.transparent == player.ui.transparent)
                      suffix = ' √';
                  return {
                      text: i.text + suffix,
                      cb() {
                          player.ui.transparent = i.transparent;
                      },
                      label: null
                  };
              }));
          };
          let mGetURL;
          {
              mGetURL = file => 'https://imspace.nos-eastchina1.126.net/img/' + file;
          }
          const dialog = getDialog('捐赠', '你的支持是我最大的动力.', [{
                  src: mGetURL('alipay.png'),
                  desc: '支付宝'
              }, {
                  src: mGetURL('wechat.png'),
                  desc: '微信'
              }]);
          const donate = () => {
              return [{
                      text: '捐赠',
                      cb() {
                          document.body.appendChild(dialog);
                          dialog.style.display = 'flex';
                      }
                  }];
          };
          const dash = {};
          bindMenu(player.ui.video, () => [].concat(cdnMenu(), dash, rateMenu(), dash, transparentMenu(), dash, donate()));
      };
      const loadVideo = (roomId, replace) => {
          const danmuPlayer = new DouyuDanmuPlayer(roomId);
          danmuPlayer.mgr.parsePic = s => s.replace(/\[emot:dy(.*?)\]/g, (_, i) => `<img style="height:1em" src="https://shark.douyucdn.cn/app/douyu/res/page/room-normal/face/dy${i}.png?v=20161103">`);
          replace(danmuPlayer.ui.el);
          makeMenu(danmuPlayer, danmuPlayer.source);
          window.danmu = danmuPlayer;
          return danmuPlayer.source.getUrl().then(() => danmuPlayer);
      };
      let danmuPlayer = null;
      let signerLoaded = new DelayNotify(false);
      Signer.init().then(() => true).catch(() => false).then((data) => {
          console.log('SIGNER_READY', data);
          signerLoaded.notify(data);
      });
      onMessage('DANMU', data => {
          danmuPlayer && danmuPlayer.onDanmuPkg(data);
      });
      onMessage('VIDEOID', (data) => __awaiter(window, void 0, void 0, function* () {
          console.log('onVideoId', data);
          const roomId = data.roomId;
          setBgListener((req) => __awaiter(this, void 0, void 0, function* () {
              switch (req.type) {
                  case 'toggle':
                      let setting = yield getSetting();
                      const id = setting.blacklist.indexOf(roomId);
                      if (id === -1) {
                          setting.blacklist.push(roomId);
                      }
                      else {
                          setting.blacklist.splice(id, 1);
                      }
                      yield setSetting(setting);
                      location.reload();
              }
          }));
          console.log('wait signer');
          if (!(yield signerLoaded.wait())) {
              console.warn('加载签名程序失败, 无法获取视频地址');
              return;
          }
          console.log('start replace');
          try {
              const setting = yield getSetting();
              if (setting.blacklist.indexOf(roomId) !== -1) {
                  if (runtime.sendMessage) {
                      runtime.sendMessage({
                          type: 'disable'
                      });
                  }
                  return;
              }
          }
          catch (e) {
              console.warn(e);
          }
          let ctr = document.querySelector(`#${data.id}`);
          yield postMessage('BEGINAPI', {
              roomId
          });
          danmuPlayer = yield loadVideo(roomId, el => {
              ctr.parentNode.replaceChild(el, ctr);
          });
      }));
  };
  onload();

})));
