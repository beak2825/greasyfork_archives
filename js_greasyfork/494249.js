// ==UserScript==
// @name               ostrich
// @namespace          https://dvxg.de/
// @version            0.2.10
// @author             davidxuang
// @description        Reposting music torrents on sites built on Gazelle and other frameworks
// @description:zh-CN  适用于Gazelle等架构站点的音乐转种工具
// @license            AGPL-3.0-only
// @icon               https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji/assets/Musical%20score/3D/musical_score_3d.png
// @homepage           https://github.com/davidxuang/ostrich
// @homepageURL        https://github.com/davidxuang/ostrich
// @match              https://logs.musichoarders.xyz/
// @match              https://*.dicmusic.com/torrents.php*
// @match              https://*.dicmusic.com/artist.php*
// @match              https://*.dicmusic.com/collages.php*
// @match              https://*.dicmusic.com/upload.php*
// @match              https://*.orpheus.network/torrents.php*
// @match              https://*.orpheus.network/artist.php*
// @match              https://*.orpheus.network/collages.php*
// @match              https://*.orpheus.network/upload.php*
// @match              https://*.redacted.ch/torrents.php*
// @match              https://*.redacted.ch/artist.php*
// @match              https://*.redacted.ch/collages.php*
// @match              https://*.redacted.ch/upload.php*
// @match              https://*.open.cd/plugin_details.php*
// @match              https://*.open.cd/plugin_upload.php*
// @match              https://*.tjupt.org/details.php*
// @match              https://*.tjupt.org/upload.php*
// @resource           brotli_wasm_bg  https://cdn.jsdelivr.net/npm/brotli-wasm@3/pkg.web/brotli_wasm_bg.wasm
// @grant              GM_getResourceURL
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494249/ostrich.user.js
// @updateURL https://update.greasyfork.org/scripts/494249/ostrich.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const version = "3.7.7";
  const VERSION = version;
  const _hasBuffer = typeof Buffer === "function";
  const _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
  const _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
  const b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const b64chs = Array.prototype.slice.call(b64ch);
  const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
  })(b64chs);
  const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  const _fromCC = String.fromCharCode.bind(String);
  const _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
  const _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
  const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
  const btoaPolyfill = (bin) => {
    let u32, c0, c1, c2, asc = "";
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length; ) {
      if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
        throw new TypeError("invalid character found");
      u32 = c0 << 16 | c1 << 8 | c2;
      asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
  };
  const _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
  const _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
    const maxargs = 4096;
    let strs = [];
    for (let i = 0, l = u8a.length; i < l; i += maxargs) {
      strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return _btoa(strs.join(""));
  };
  const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
  const cb_utob = (c) => {
    if (c.length < 2) {
      var cc = c.charCodeAt(0);
      return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    } else {
      var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
      return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    }
  };
  const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  const utob = (u) => u.replace(re_utob, cb_utob);
  const _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
  const encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
  const encodeURI = (src) => encode(src, true);
  const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
  const cb_btou = (cccc) => {
    switch (cccc.length) {
      case 4:
        var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
        return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
      case 3:
        return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
      default:
        return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
    }
  };
  const btou = (b) => b.replace(re_btou, cb_btou);
  const atobPolyfill = (asc) => {
    asc = asc.replace(/\s+/g, "");
    if (!b64re.test(asc))
      throw new TypeError("malformed base64.");
    asc += "==".slice(2 - (asc.length & 3));
    let u24, bin = "", r1, r2;
    for (let i = 0; i < asc.length; ) {
      u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
      bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
  };
  const _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
  const _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
  const toUint8Array = (a) => _toUint8Array(_unURI(a));
  const _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
  const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
  const decode = (src) => _decode(_unURI(src));
  const isValid = (src) => {
    if (typeof src !== "string")
      return false;
    const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
  };
  const _noEnum = (v) => {
    return {
      value: v,
      enumerable: false,
      writable: true,
      configurable: true
    };
  };
  const extendString = function() {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add("fromBase64", function() {
      return decode(this);
    });
    _add("toBase64", function(urlsafe) {
      return encode(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return encode(this, true);
    });
    _add("toBase64URL", function() {
      return encode(this, true);
    });
    _add("toUint8Array", function() {
      return toUint8Array(this);
    });
  };
  const extendUint8Array = function() {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add("toBase64", function(urlsafe) {
      return fromUint8Array(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return fromUint8Array(this, true);
    });
    _add("toBase64URL", function() {
      return fromUint8Array(this, true);
    });
  };
  const extendBuiltins = () => {
    extendString();
    extendUint8Array();
  };
  const gBase64 = {
    version,
    VERSION,
    atob: _atob,
    atobPolyfill,
    btoa: _btoa,
    btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode,
    encodeURI,
    encodeURL: encodeURI,
    utob,
    btou,
    decode,
    isValid,
    fromUint8Array,
    toUint8Array,
    extendString,
    extendUint8Array,
    extendBuiltins
  };
  var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  let wasm;
  const heap = new Array(32).fill(void 0);
  heap.push(void 0, null, true, false);
  function getObject(idx) {
    return heap[idx];
  }
  const cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
  cachedTextDecoder.decode();
  let cachegetUint8Memory0 = null;
  function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
      cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
  }
  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  let heap_next = heap.length;
  function addHeapObject(obj) {
    if (heap_next === heap.length)
      heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  let WASM_VECTOR_LEN = 0;
  const cachedTextEncoder = new TextEncoder("utf-8");
  const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  } : function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length);
      getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len);
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127)
        break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3);
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  let cachegetInt32Memory0 = null;
  function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
      cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
  }
  function dropObject(idx) {
    if (idx < 36)
      return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  let stack_pointer = 32;
  function addBorrowedObject(obj) {
    if (stack_pointer == 1)
      throw new Error("out of js stack");
    heap[--stack_pointer] = obj;
    return stack_pointer;
  }
  function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }
  function compress(buf, raw_options) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.compress(retptr, ptr0, len0, addBorrowedObject(raw_options));
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      if (r3) {
        throw takeObject(r2);
      }
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      heap[stack_pointer++] = void 0;
    }
  }
  function decompress(buf) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.decompress(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      if (r3) {
        throw takeObject(r2);
      }
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  function isLikeNone(x) {
    return x === void 0 || x === null;
  }
  const BrotliStreamResultCode = Object.freeze({ ResultSuccess: 1, "1": "ResultSuccess", NeedsMoreInput: 2, "2": "NeedsMoreInput", NeedsMoreOutput: 3, "3": "NeedsMoreOutput" });
  class BrotliStreamResult {
    static __wrap(ptr) {
      const obj = Object.create(BrotliStreamResult.prototype);
      obj.ptr = ptr;
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_brotlistreamresult_free(ptr);
    }
    get code() {
      const ret = wasm.__wbg_get_brotlistreamresult_code(this.ptr);
      return ret >>> 0;
    }
    set code(arg0) {
      wasm.__wbg_set_brotlistreamresult_code(this.ptr, arg0);
    }
    get buf() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.__wbg_get_brotlistreamresult_buf(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    set buf(arg0) {
      const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.__wbg_set_brotlistreamresult_buf(this.ptr, ptr0, len0);
    }
    get input_offset() {
      const ret = wasm.__wbg_get_brotlistreamresult_input_offset(this.ptr);
      return ret >>> 0;
    }
    set input_offset(arg0) {
      wasm.__wbg_set_brotlistreamresult_input_offset(this.ptr, arg0);
    }
  }
  class CompressStream {
    static __wrap(ptr) {
      const obj = Object.create(CompressStream.prototype);
      obj.ptr = ptr;
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_compressstream_free(ptr);
    }
    constructor(quality) {
      const ret = wasm.compressstream_new(!isLikeNone(quality), isLikeNone(quality) ? 0 : quality);
      return CompressStream.__wrap(ret);
    }
    compress(input_opt, output_size) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(input_opt) ? 0 : passArray8ToWasm0(input_opt, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.compressstream_compress(retptr, this.ptr, ptr0, len0, output_size);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BrotliStreamResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    total_out() {
      const ret = wasm.compressstream_total_out(this.ptr);
      return ret >>> 0;
    }
  }
  class DecompressStream {
    static __wrap(ptr) {
      const obj = Object.create(DecompressStream.prototype);
      obj.ptr = ptr;
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_decompressstream_free(ptr);
    }
    constructor() {
      const ret = wasm.decompressstream_new();
      return DecompressStream.__wrap(ret);
    }
    decompress(input, output_size) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decompressstream_decompress(retptr, this.ptr, ptr0, len0, output_size);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BrotliStreamResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    total_out() {
      const ret = wasm.decompressstream_total_out(this.ptr);
      return ret >>> 0;
    }
  }
  async function load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          if (module.headers.get("Content-Type") != "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return { instance, module };
      } else {
        return instance;
      }
    }
  }
  async function init(input) {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
      const ret = getObject(arg0) === void 0;
      return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
      const val = getObject(arg0);
      const ret = typeof val === "object" && val !== null;
      return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = JSON.stringify(obj === void 0 ? null : obj);
      const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
      const ret = new Error();
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
      const ret = getObject(arg1).stack;
      const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
      try {
        console.error(getStringFromWasm0(arg0, arg1));
      } finally {
        wasm.__wbindgen_free(arg0, arg1);
      }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
    if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
      input = fetch(input);
    }
    const { instance, module } = await load(await input, imports);
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    return wasm;
  }
  const _brotli = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    BrotliStreamResult,
    BrotliStreamResultCode,
    CompressStream,
    DecompressStream,
    compress,
    decompress,
    default: init
  }, Symbol.toStringTag, { value: "Module" }));
  const brotli = await (async () => {
    const url = _GM_getResourceURL("brotli_wasm_bg");
    await init(gBase64.toUint8Array(url.slice(url.indexOf(","))).buffer);
    return _brotli;
  })();
  const base64url = {
    // DecoderStream,
    // EncoderStream,
    decode: gBase64.decode,
    encode: (v) => gBase64.encode(v, true),
    decodeBytes: gBase64.toUint8Array,
    encodeBytes: (v) => gBase64.fromUint8Array(v, true)
  };
  function marshal(object) {
    return base64url.encodeBytes(brotli.compress(new TextEncoder().encode(JSON.stringify(object))));
  }
  function unmarshal(str) {
    return JSON.parse(new TextDecoder().decode(brotli.decompress(base64url.decodeBytes(str))));
  }
  function xmlHttpRequest(details) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        ...details,
        onabort() {
          reject("Aborted");
        },
        onload(event) {
          if (event.status !== 200) {
            reject(event.statusText);
          }
          resolve(event);
        },
        onerror(event) {
          reject(event);
        },
        ontimeout() {
          reject("Timeout");
        }
      });
    });
  }
  function parseHeaders(value) {
    return Object.fromEntries(value.split("\r\n").map((line) => {
      var c = line.indexOf(":");
      return [line.substring(0, c), line.substring(c + 1).trimStart()];
    }));
  }
  function toDataTransfer(file) {
    const data2 = new DataTransfer();
    if (file instanceof Array) {
      file.forEach((f) => {
        data2.items.add(f);
      });
    } else {
      data2.items.add(file);
    }
    return data2;
  }
  function unescapeHtml(value) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }
  async function nextMutation(target, type, subtree, timeout, sender) {
    try {
      console.debug(`Waiting for mutations with timeout of ${timeout ?? (timeout = 3e4)}.`);
      return await Promise.race([
        new Promise((_, reject) => {
          setTimeout(() => reject("Timeout"), timeout);
        }),
        new Promise((resolve) => {
          const observer = new MutationObserver((mutations) => {
            if (mutations.some((m) => m.type === type)) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(target, { [type]: true, subtree });
          sender?.dispatchEvent(new Event("change"));
        })
      ]);
    } catch (reason) {
      console.warn(reason);
    }
  }
  function onDescendantAdded(target, subtree, callback) {
    new MutationObserver((mutations) => {
      mutations.filter((m) => m.type === "childList" && m.addedNodes.length).flatMap((m) => [...m.addedNodes]).forEach(callback);
    }).observe(target, { childList: true, subtree });
  }
  const _reSplit = /^((?:\p{L}|\p{P}|\s)+)\s+[（()]((?:\p{L}|\p{P}|\s)+)[)）]$/u;
  function trySelect(select, name) {
    name = name.toLowerCase();
    let options = [...select.options].map((option) => ({
      name: option.textContent?.toLowerCase(),
      key: option.value
    })).filter((p) => p.name);
    let seq = options.filter((p) => p.name === name);
    if (seq.length) {
      return seq.length === 1 && (select.value = seq.at(0).key);
    }
    seq = options.filter((p) => (p.name?.indexOf(name) ?? NaN) >= 0 || p.name && (name?.indexOf(p.name) ?? NaN) >= 0);
    if (seq.length) {
      return seq.length === 1 && (select.value = seq.at(0).key);
    }
    const match = name.match(_reSplit);
    const names = match ? [match[1], match[2]] : [name];
    options = options.flatMap((p) => {
      const m = p.name.match(_reSplit);
      return m ? [
        { name: m[1], key: p.key },
        { name: m[2], key: p.key }
      ] : p;
    }).filter((p) => p.name);
    seq = options.filter((p) => names.some((n) => (p.name?.indexOf(n) ?? NaN) >= 0 || p.name && (n?.indexOf(p.name) ?? NaN) >= 0));
    return seq.length === 1 && (select.value = seq.at(0).key);
  }
  function _throw(ex) {
    throw ex;
  }
  const base = {
    gazelle: {
      include: {
        source: [
          "/torrents.php",
          "/artist.php",
          "/collages.php"
        ],
        target: "/upload.php"
      },
      exclude: {
        download: "/torrents.php"
      },
      actions: {
        log: "viewlog"
      }
    },
    nexusphp: {
      include: {
        source: "/plugin_details.php",
        target: "/plugin_upload.php"
      },
      exclude: {
        download: "/download.php"
      }
    }
  };
  const override = {
    gazelle: {
      DIC: {
        hostname: "dicmusic.com",
        selects: {
          releaseType: {
            "1": "Album",
            "3": "Soundtrack",
            "5": "EP",
            "6": "Anthology",
            "7": "Compilation",
            "9": "Single",
            "11": "Live album",
            "13": "Remix",
            "14": "Bootleg",
            "15": "Interview",
            "16": "Mixtape",
            "17": "Demo",
            "18": "Concert recording",
            "19": "DJ Mix",
            "21": "Unknown"
          }
        }
      },
      OPS: {
        hostname: "orpheus.network",
        selects: {
          releaseType: {
            "1": "Album",
            "3": "Soundtrack",
            "5": "EP",
            "6": "Anthology",
            "7": "Compilation",
            "9": "Single",
            "11": "Live album",
            "13": "Remix",
            "14": "Bootleg",
            "15": "Interview",
            "16": "Mixtape",
            "17": "DJ Mix",
            "18": "Concert recording",
            "21": "Unknown"
          }
        }
      },
      Redacted: {
        hostname: "redacted.ch",
        selects: {
          releaseType: {
            "1": "Album",
            "3": "Soundtrack",
            "5": "EP",
            "6": "Anthology",
            "7": "Compilation",
            "9": "Single",
            "11": "Live album",
            "13": "Remix",
            "14": "Bootleg",
            "15": "Interview",
            "16": "Mixtape",
            "17": "Demo",
            "18": "Concert Recording",
            "19": "DJ Mix",
            "21": "Unknown"
          }
        },
        actions: {
          log: "loglist"
        }
      }
    },
    nexusphp: {
      OpenCD: {
        hostname: "open.cd"
      },
      TJUPT: {
        hostname: "tjupt.org",
        include: {
          source: "/details.php",
          target: "/upload.php"
        }
      }
    }
  };
  const _data = {
    base,
    override
  };
  let data = {};
  Object.keys(_data.override).forEach((fw2) => ((fw22) => {
    data[fw22] = {};
    Object.keys(_data.override[fw22]).forEach((st2) => {
      const base2 = _data.base[fw22];
      let site2 = _data.override[fw22][st2];
      site2.include = {
        ...base2.include,
        ...site2.include
      };
      site2.exclude = {
        ...base2.exclude,
        ...site2.exclude
      };
      site2.actions = {
        ...base2.actions,
        ...site2.actions
      };
      data[fw22][st2] = site2;
    });
  })(fw2));
  class VoidElement {
    constructor(tag) {
      __publicField(this, "#");
      this["#"] = tag;
    }
  }
  function Void(tag) {
    return () => new VoidElement(tag);
  }
  class ValueVoidElement {
    constructor(tag, value) {
      __publicField(this, "#");
      __publicField(this, "$");
      this["#"] = tag;
      this.$ = value;
    }
  }
  class ViewElement {
    constructor(tag, children) {
      __publicField(this, "#");
      __publicField(this, "$$");
      this["#"] = tag;
      this.$$ = children;
    }
  }
  function View(tag) {
    return (children) => new ViewElement(tag, children);
  }
  class ValueViewElement {
    constructor(tag, value, children) {
      __publicField(this, "#");
      __publicField(this, "$");
      __publicField(this, "$$");
      this["#"] = tag;
      this.$$ = children;
      this.$ = value;
    }
  }
  function ValueView(tag) {
    return (value, children) => new ValueViewElement(tag, value, children);
  }
  const Bold = View("b");
  const Italic = View("i");
  const Underline = View("u");
  const Strikethrough = View("s");
  const Font = ValueView("font");
  const Size = ValueView("size");
  const Color = ValueView("color");
  const Heading = ValueView("h");
  const Sub = View("sub");
  const Sup = View("sup");
  const Anchor = ValueView("url");
  class ImageElement extends ValueVoidElement {
    constructor(value, alt) {
      super("img", value);
      __publicField(this, "alt");
      this.alt = alt;
    }
  }
  const Image = (value, alt) => new ImageElement(value, alt);
  const Code = View("code");
  const Spoiler = View("#spoiler");
  const HorizontalRule = Void("hr");
  const Align = ValueView("align");
  const Quote = ValueView("quote");
  const Pre = ValueView("pre");
  const Collapse = ValueView("#collapse");
  const ListItem = View("li");
  const UList = View("ul");
  const OList = View("ol");
  const Table = View("table");
  const TableRow = View("tr");
  const TableCell = View("td");
  const is = {
    void: (node) => /* @__PURE__ */ ((input) => {
      return "hr" === input;
    })(node["#"]),
    valueVoid: (node) => /* @__PURE__ */ ((input) => {
      return "img" === input;
    })(node["#"]),
    view: (node) => /* @__PURE__ */ ((input) => {
      return "b" === input || "i" === input || "u" === input || "s" === input || "sub" === input || "sup" === input || "code" === input || "#spoiler" === input || "li" === input || "ul" === input || "ol" === input || "table" === input || "tr" === input || "td" === input;
    })(node["#"]),
    valueView: (node) => /* @__PURE__ */ ((input) => {
      return "font" === input || "size" === input || "color" === input || "h" === input || "url" === input || "align" === input || "quote" === input || "pre" === input || "#collapse" === input;
    })(node["#"])
  };
  class BBText {
    constructor(value) {
      __publicField(this, "#", "#text");
      __publicField(this, "$");
      this.$ = value;
    }
  }
  function _clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function _wrapNewline(nodes, position) {
    if (position === 2 || position === 3) {
      let f = nodes.at(0);
      if (f instanceof BBText) {
        f.$ = f.$.replace(/^ */, "\n");
      } else {
        nodes.unshift(new BBText("\n"));
      }
    }
    if (position === 1 || position === 3) {
      let l = nodes.at(-1);
      if (l instanceof BBText) {
        l.$ = l.$.replace(/ *$/, "\n");
      } else {
        nodes.push(new BBText("\n"));
      }
    }
    return nodes;
  }
  function _fromHTML(parent, baseURL, raw = false) {
    let index = -1;
    const origin = [...parent.childNodes];
    const result = [];
    while (++index < origin.length) {
      const n = origin[index];
      if (n instanceof globalThis.Text) {
        let last = result.at(-1);
        if (raw) {
          result.push(new BBText(n.textContent ?? ""));
        } else if (last instanceof BBText) {
          last.$ = last.$ + (last.$.match(/\s$/) ? n.textContent?.trimStart() ?? "" : n.textContent ?? "").replace(/\s+/g, " ");
        } else {
          result.push(new BBText(n.textContent?.replace(/\s+/g, " ") ?? ""));
        }
      } else if (n instanceof HTMLBRElement) {
        _wrapNewline(result, 1);
      } else if (n instanceof HTMLUListElement) {
        result.push(UList([...n.children].map((item) => ListItem(_fromHTML(item, baseURL)))));
      } else if (n instanceof HTMLOListElement) {
        result.push(OList([...n.children].map((item) => ListItem(_fromHTML(item, baseURL)))));
      } else if (n instanceof HTMLTableElement) {
        if (n.classList.contains("hide")) {
          result.push(Collapse(n.tBodies.item(0)?.rows?.item(0)?.cells?.item(0)?.textContent?.trim() ?? _throw(n), _fromHTML(n.tBodies.item(0)?.rows?.item(1)?.cells?.item(0) ?? _throw(n), baseURL)));
        } else {
          const caption = [...n.children].at(0);
          if (caption instanceof HTMLTableCaptionElement) {
            result.push(Align("center", _fromHTML(caption, baseURL)));
          }
          result.push(Table([n.tHead, ...n.tBodies].filter((sec) => sec).flatMap((sec) => [...sec.rows]).map((row) => TableRow([...row.cells].map((cell) => TableCell(_fromHTML(cell, baseURL)))))));
        }
      } else if (n instanceof HTMLQuoteElement) {
        result.push(Quote("", _fromHTML(n, baseURL)));
      } else if (n instanceof HTMLPreElement) {
        result.push(Pre("", _fromHTML(n, baseURL, true)));
      } else if (n instanceof HTMLFieldSetElement) {
        const firstChild = [...n.children].at(0);
        if (firstChild instanceof HTMLLegendElement) {
          n.removeChild(firstChild);
          result.push(Quote(firstChild.textContent?.trim() ?? "", _fromHTML(n, baseURL)));
        } else {
          result.push(Quote("", _fromHTML(n, baseURL)));
        }
      } else if (n instanceof HTMLFontElement) {
        let outer;
        const children = _fromHTML(n, baseURL);
        if (n.face) {
          outer = Font(n.face, children);
        }
        if (n.size) {
          outer = Font(n.size, outer ? [outer] : children);
        }
        if (n.color) {
          outer = Font(n.color, outer ? [outer] : children);
        }
        if (outer) {
          result.push(outer);
        } else {
          result.push(...children);
        }
      } else if (n instanceof HTMLHeadingElement) {
        result.push(Heading(parseInt(n.tagName.slice(1)), _fromHTML(n, baseURL)));
      } else if (n instanceof HTMLAnchorElement) {
        let href = n.href;
        if (!href.match(/^[a-z+]+:\/\//)) {
          href = new URL(href, baseURL).toString();
        }
        if (n.attributes.getNamedItem("onclick")?.value?.startsWith("QuoteJump")) {
          let offset = 0;
          while (offset++ < origin.length) {
            if (origin.at(index + offset) instanceof HTMLQuoteElement)
              break;
          }
          if (index + offset === origin.length)
            throw n;
          result.push(Quote([...n.children].at(0)?.textContent?.trim() ?? "", _fromHTML(origin.at(index + offset), baseURL)));
          index += offset;
        } else {
          result.push(Anchor(href, _fromHTML(n, baseURL)));
        }
      } else if (n instanceof HTMLImageElement) {
        if (n.classList.contains("listicon")) {
          result.push(ListItem([]));
        } else {
          result.push(Image(n.src, n.alt));
        }
      } else if (n instanceof HTMLHRElement) {
        result.push(HorizontalRule());
      } else if (n instanceof HTMLElement) {
        if (n.classList.contains("mature")) {
          continue;
        }
        const tagName = n.tagName.toLowerCase();
        const nextElement = origin.slice(index).filter((node) => node instanceof HTMLElement && !(node instanceof HTMLBRElement)).at(1);
        if (n.classList.contains("quoteheader")) {
          let offset = 0;
          while (offset++ < origin.length) {
            if (origin.at(index + offset) instanceof HTMLQuoteElement)
              break;
          }
          if (index + offset === origin.length)
            throw n;
          result.push(Quote(n.textContent?.trim() ?? "", _fromHTML(origin.at(index + offset), baseURL)));
          index += offset;
        } else if (tagName === "strong" && nextElement instanceof HTMLAnchorElement && (nextElement.attributes.getNamedItem("onclick")?.value?.indexOf("spoiler") ?? NaN) >= 0) {
          let offset = 0;
          while (offset++ < origin.length) {
            if (origin.at(index + offset) instanceof HTMLQuoteElement)
              break;
          }
          if (index + offset === origin.length)
            throw n;
          result.push(Collapse(n.textContent?.trim() ?? "", _fromHTML(origin.at(index + offset), baseURL)));
          index += offset;
          index += 3;
        } else if (n.classList.contains("codetop")) {
          let nextElement2;
          do {
            nextElement2 = origin[++index];
            if (nextElement2 === void 0) {
              throw n;
            }
          } while (!(nextElement2 instanceof HTMLElement));
          result.push(..._fromHTML(nextElement2, baseURL));
          let offset = 1;
          nextElement2 = origin[index + offset];
          while (!(nextElement2 instanceof HTMLElement) && nextElement2) {
            nextElement2 = origin[index + ++offset];
          }
          if (nextElement2 instanceof HTMLElement) {
            if (nextElement2.children.item(0)?.classList?.contains("codemain")) {
              result.push(..._fromHTML(nextElement2.children.item(0), baseURL));
              index += offset;
            }
          }
        } else if (tagName === "b" || tagName === "strong") {
          result.push(Bold(_fromHTML(n, baseURL)));
        } else if (tagName === "i" || tagName === "i") {
          result.push(Italic(_fromHTML(n, baseURL)));
        } else if (tagName === "u" || tagName === "ins") {
          result.push(Underline(_fromHTML(n, baseURL)));
        } else if (tagName === "s" || tagName === "strike" || tagName === "del") {
          result.push(Strikethrough(_fromHTML(n, baseURL)));
        } else if (tagName === "code" || tagName === "tt") {
          result.push(Code(_fromHTML(n, baseURL)));
        } else if (tagName === "sub") {
          result.push(Sub(_fromHTML(n, baseURL)));
        } else if (tagName === "sup") {
          result.push(Sup(_fromHTML(n, baseURL)));
        } else if (tagName === "center" || tagName === "marquee") {
          result.push(Align("center", _fromHTML(n, baseURL)));
        } else {
          let outer;
          let allowUnwrap = false;
          const children = _fromHTML(n, baseURL);
          const classes = [...n.classList];
          const fontWeight = n.style.fontWeight.toLowerCase();
          if (parseFloat(fontWeight) >= 550 || fontWeight === "bold" || fontWeight === "bolder") {
            outer = Bold(children);
          }
          const fontStyle = n.style.fontStyle.toLowerCase();
          if (fontStyle === "italic" || fontStyle.startsWith("oblique")) {
            outer = Italic(outer ? [outer] : children);
          }
          const textDecoration = n.style.textDecoration.toLowerCase().split(" ");
          const textDecorationLine = n.style.textDecorationLine.toLowerCase();
          if (textDecorationLine === "underline" || textDecoration.indexOf("underline") >= 0) {
            outer = Underline(outer ? [outer] : children);
          } else if (textDecorationLine === "line-through" || textDecoration.indexOf("line-through") >= 0) {
            outer = Strikethrough(outer ? [outer] : children);
          }
          const fontFamily = n.style.fontFamily.toLowerCase().split(";").at(0);
          if (fontFamily) {
            if (n.children.item(0) instanceof HTMLPreElement) {
              allowUnwrap = true;
            } else {
              outer = Font(fontFamily, outer ? [outer] : children);
            }
          }
          const fontSize = n.style.fontSize.toLowerCase();
          const sizeClasses = classes.filter((x) => x.startsWith("size"));
          if (sizeClasses.length) {
            outer = Size(_clamp(parseInt(sizeClasses.at(0).slice(4)), 0, 7), outer ? [outer] : children);
          } else if (fontSize) {
            console.warn(fontSize);
          }
          const color = n.style.color.toLowerCase();
          if (color) {
            outer = Color(color, outer ? [outer] : children);
          }
          const align = n.style.textAlign.toLowerCase();
          if (/* @__PURE__ */ ((input) => {
            return "left" === input || "center" === input || "right" === input;
          })(align)) {
            outer = Align(align, outer ? [outer] : children);
          }
          if (tagName === "span") {
            if (!(n.attributes.getNamedItem("class")?.value || n.attributes.getNamedItem("style")?.value)) {
              allowUnwrap = true;
            } else if (n.classList.contains("mask")) {
              outer = Spoiler(children);
            }
          }
          if (tagName === "p") {
            if (n.classList.contains("sub")) {
              result.push(Heading(2, children));
            } else {
              result.push(..._wrapNewline(outer ? [outer] : children, 3));
            }
          } else if (outer) {
            if (tagName === "p")
              ;
            else {
              result.push(outer);
            }
          } else if (allowUnwrap) {
            result.push(...children);
          } else {
            console.warn(n);
            console.log(n.outerHTML);
            if (tagName === "span") {
              result.push(...children);
            }
          }
        }
      } else {
        throw n;
      }
    }
    return result;
  }
  function fromHTML(parent, baseURL) {
    return _fromHTML(parent, baseURL);
  }
  const bb = {
    fromHTML,
    is
  };
  const _isBigEndian = (() => {
    const u32 = new Uint32Array([1464816196]);
    const u8 = new Uint8Array(u32.buffer);
    switch (u8[0]) {
      case 87:
        return true;
      case 68:
        return false;
      default:
        throw u8;
    }
  })();
  const _bomUtf16LE = new Uint8Array([255, 254]);
  function toFile(logs, title) {
    if (logs.recovered) {
      console.warn(logs);
    }
    return logs.encoded ? logs.encoded.map((log2, l) => new File([base64url.decodeBytes(log2)], logs.encoded.length > 1 ? `${title}.${l + 1}.log` : `${title}.log`, {
      type: "text/plain"
    })) : logs.plain.map((log2, l) => {
      log2 = log2.trim();
      const name = logs.plain.length > 1 ? `${title}.${l + 1}.log` : `${title}.log`;
      if (log2.startsWith("Exact Audio Copy")) {
        const array = new Uint16Array(log2.length);
        let c = log2.length;
        while (c >= 0) {
          const ch = log2.charCodeAt(--c);
          array[c] = ch;
        }
        if (_isBigEndian) {
          c = array.length;
          while (c >= 0) {
            const ch = array[--c];
            array[c] = (ch >> 8) + ((ch & 255) << 8);
          }
        }
        return new File([_bomUtf16LE, array.buffer], name, {
          type: "text/plain"
        });
      } else if (log2.startsWith("X Lossless Decoder")) {
        return new File([new TextEncoder().encode(`${log2}
`).buffer], name, {
          type: "text/plain"
        });
      } else {
        throw log2;
      }
    });
  }
  const utf8 = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
  const utf16BE = new TextDecoder("utf-16be", { ignoreBOM: true, fatal: true });
  const utf16LE = new TextDecoder("utf-16le", { ignoreBOM: true, fatal: true });
  function toString(logs) {
    return logs.encoded ? logs.encoded.map((log2) => {
      const array = base64url.decodeBytes(log2);
      if (array[0] === 255 && array[1] === 254) {
        return utf16LE.decode(array);
      } else if (array[0] === 255 && array[1] === 254) {
        return utf16BE.decode(array);
      } else {
        return utf8.decode(array);
      }
    }) : logs.plain;
  }
  const log = { toFile, toString };
  function _dump$1(n, ordered = false) {
    let tag = n["#"];
    switch (n["#"]) {
      case "#text":
        return n.$.match(/\[(\/?(?:\w+(?:=.+?)?|\*|#))\]/g) ? `[plain]${n.$}[/plain]` : n.$;
      case "li":
        tag = ordered ? "#" : "*";
        return `[${tag}]${n.$$.map((n2) => _dump$1(n2)).join("")}`;
      case "img":
        return `[${tag}=${n.$}]${n.alt}[/${tag}]`;
      case "ul":
        return n.$$.map((n2) => _dump$1(n2)).join("\n");
      case "ol":
        return n.$$.map((n2) => _dump$1(n2, true)).join("\n");
      case "#collapse":
      case "#spoiler":
        tag = "hide";
        break;
    }
    if (bb.is.void(n)) {
      return `[${tag}]`;
    } else if (bb.is.valueVoid(n)) {
      return n;
    } else if (bb.is.view(n)) {
      return `[${tag}]${n.$$.map((x) => _dump$1(x)).join("")}[/${tag}]`;
    } else if (bb.is.valueView(n)) {
      return n.$ ? `[${tag}=${n.$}]${n.$$.map((x) => _dump$1(x)).join("")}[/${tag}]` : `[${tag}]${n.$$.map((x) => _dump$1(x)).join("")}[/${tag}]`;
    } else {
      throw n;
    }
  }
  function dump$1(root) {
    return root.map((node) => _dump$1(node)).join("").trim();
  }
  const bbcode$1 = { ...bb, dump: dump$1 };
  function dic(site2) {
    site2.adapt = async (payload, callback) => {
      const record = payload.record;
      if (payload["gazelle"]) {
        await adaptAuto(payload["gazelle"]);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        await adaptDescriptions(payload.record, callback);
      } else {
        await adaptUniversal(payload.record, callback);
      }
      if (record.item.logs) {
        await adaptLogs(record.item.logs, record.group.name);
      }
    };
    return true;
  }
  function ops(site2) {
    site2.adapt = async (payload, callback) => {
      const record = payload.record;
      if (payload["gazelle"]) {
        await adaptAuto(payload["gazelle"]);
      } else {
        await adaptUniversal(payload.record, callback);
      }
      if (record.item.logs) {
        await adaptLogs(record.item.logs, record.group.name);
      }
    };
  }
  function redacted(site2) {
    site2.adapt = async (payload, callback) => {
      const record = payload.record;
      await adaptUniversal(record, callback);
      if (record.item.logs) {
        await adaptLogs(record.item.logs, record.group.name);
      }
      if (payload["gazelle"]) {
        adaptGazelle("Redacted", payload["gazelle"]);
      }
    };
  }
  function _toRecord(e, site2, base2, logs) {
    const group_bb = e.group.bbBody ?? e.group.wikiBBcode;
    return {
      site: site2,
      group: {
        name: unescapeHtml(e.group.name),
        artists: e.group.musicInfo.artists.map((a) => a.name),
        guests: e.group.musicInfo.with.map((a) => a.name),
        composers: e.group.musicInfo.composers.map((a) => a.name),
        conductor: e.group.musicInfo.conductor.map((a) => a.name),
        producer: e.group.musicInfo.producer.map((a) => a.name),
        dj: e.group.musicInfo.dj.map((a) => a.name),
        remixer: e.group.musicInfo.remixedBy.map((a) => a.name),
        description: group_bb ? unescapeHtml(group_bb) : void 0,
        description_tree: bb.fromHTML(new DOMParser().parseFromString(`<html><body>${e.group.wikiBody}</body></html>`, "text/html").body, base2),
        label: unescapeHtml(e.group.recordLabel),
        catalogue: unescapeHtml(e.group.catalogueNumber),
        year: e.group.year,
        image: e.group.wikiImage
      },
      item: {
        name: unescapeHtml(e.torrent.remasterTitle),
        description: unescapeHtml(e.torrent.description),
        label: unescapeHtml(e.torrent.remasterRecordLabel),
        catalogue: unescapeHtml(e.torrent.remasterCatalogueNumber),
        year: e.torrent.remasterYear,
        media: e.torrent.media,
        encoding: e.torrent.encoding,
        format: e.torrent.format,
        scene: e.torrent.scene,
        uploaded_by: e.torrent.username,
        logs
      }
    };
  }
  function _mostCommon(array, invalid) {
    let compare = 0;
    let common = invalid;
    array.reduce((acc, val) => {
      if (val in acc) {
        acc[val]++;
      } else {
        acc[val] = 1;
      }
      if (acc[val] > compare) {
        compare = acc[val];
        common = val;
      }
      return acc;
    }, {});
    return common;
  }
  function _recoverLog(log2) {
    if (log2.startsWith("Exact Audio Copy") || log2.startsWith("EAC extraction logfile")) {
      return log2.replace("\r\n", "\n").replace(/^Used [Dd]rive( +: .+?)(?: \(not found in database\))?$/m, "Used drive$1").replace(/Additional command line options +: .+(\n.+)+/m, (sub) => sub.replace("\n", "")).split("\n\n").map((block) => {
        let lines = block.split("\n");
        if (lines.some((line) => line.startsWith("Delete leading and trailing silent blocks"))) {
          const common_pos = _mostCommon(lines.map((line) => line.indexOf(":")), -1);
          lines = lines.map((line) => {
            const pos = line.indexOf(":");
            return line.slice(0, pos).padEnd(common_pos) + line.slice(pos);
          });
        }
        return lines.join("\n");
      }).join("\n\n").replace("\n", "\r\n");
    } else if (log2.startsWith("X Lossless Decoder") || log2.startsWith("XLD extraction logfile")) {
      return log2.replace("\r\n", "\n").replace(/^Used [Dd]rive( +: .+?)(?: \(not found in database\))?$/m, "Used drive$1").replace(/(Absolute +\| +Relative +\| +Confidence)$/m, "$1 ").replace(/(?<!\n)\n(\n\nAccurateRip)/, "$1");
    } else {
      console.warn(log2);
      return log2;
    }
  }
  async function extract([st2, site2], callback) {
    $("tr.torrent_row, .group_torrent:not(.edition)").each((_, header) => {
      let initialised = false;
      let busy = false;
      const header_buttons = $(header).find(".torrent_action_buttons, .td_info > span");
      const repost_button = $("<a>RE</a>").attr("href", "#repost")[0];
      header_buttons.find("> a").last().after(document.createTextNode(" | "), repost_button);
      repost_button.onclick = async () => {
        const torrent_url = header_buttons.children().filter((_2, e) => e instanceof HTMLAnchorElement).map((_2, e) => new URL(e.href, location.href)).filter((_2, url) => url.searchParams.get("action") === "download")[0];
        const torrent_id = torrent_url.searchParams.get("id");
        let links_container;
        if (header.id) {
          links_container = $(`#torrent_${torrent_id}`).removeClass("hidden").find("blockquote").first();
          if (!links_container.hasClass("ostrich")) {
            links_container.addClass("ostrich").append($("<br>"), $("<br>"));
          }
        } else {
          links_container = $(header).next();
          if (links_container.length === 0 || !links_container.hasClass("torrentdetails")) {
            links_container = $(`<td>`).attr("colspan", 9).appendTo($(`<tr>`).addClass("torrentdetails").addClass("pad").insertAfter(header));
          }
        }
        if (initialised || busy) {
          return;
        }
        busy = true;
        try {
          const links = $(`<span>`).text("Repost to...").appendTo(links_container);
          const gazelle_url = new URL(`/ajax.php?action=torrent&id=${torrent_id}`, location.href).toString();
          const record = await xmlHttpRequest({
            method: "GET",
            url: gazelle_url,
            responseType: "json"
          }).then(async (event) => {
            let r = event.response;
            if (r.status !== "success") {
              throw r.error;
            }
            let logs;
            if (r.response.torrent.hasLog) {
              logs = await xmlHttpRequest({
                method: "GET",
                url: `${site2.exclude.download}?action=${site2.actions?.log || _throw(site2)}&torrentid=${torrent_id}`,
                responseType: "document"
              }).then(async (event2) => {
                const body = $(event2.response?.body);
                const sections = body.find(".log_section");
                if (sections.length) {
                  return {
                    encoded: await Promise.all(sections.toArray().map(async (section) => {
                      const event3 = await xmlHttpRequest({
                        method: "GET",
                        url: new URL(($(section).find("a.brackets")[0] ?? _throw(section)).href, location.href).toString(),
                        responseType: "arraybuffer"
                      });
                      return base64url.encodeBytes(new Uint8Array(event3.response));
                    })),
                    score: r.response.torrent.logScore
                  };
                } else {
                  return {
                    plain: body.find("pre").map((_2, pre) => pre.textContent).toArray().map(_recoverLog),
                    recovered: true,
                    score: r.response.torrent.logScore
                  };
                }
              });
            } else {
              logs = void 0;
            }
            return _toRecord(r.response, st2, new URL(location.href), logs);
          });
          links.text("Repost to: ");
          await callback(links, {
            torrent: torrent_url.toString(),
            record,
            gazelle: gazelle_url
          });
          initialised = true;
        } finally {
          busy = false;
        }
      };
    });
  }
  async function validate(callback) {
    await callback($("#upload_logs .label"), "#file[name^=logfiles]");
    const form = $("#dynamic_form")[0];
    if (form) {
      onDescendantAdded($(form).single(), false, async (node) => {
        const label = $(node).find("#upload_logs .label");
        if (label.length) {
          await callback(label, "#file[name^=logfiles]");
        }
      });
    }
  }
  async function _getJson(gazelle2, type) {
    return xmlHttpRequest({
      method: "GET",
      url: gazelle2,
      responseType: type
    }).then((event) => event.response);
  }
  async function adaptAuto(gazelle2) {
    const json_input = $("#torrent-json-file").single();
    json_input.files = toDataTransfer(new File([await _getJson(gazelle2, "arraybuffer")], "gazelle.json", {
      type: "application/json"
    })).files;
    await nextMutation($("#dynamic_form").single(), "childList", void 0, void 0, json_input);
  }
  function _adaptArtistRole(role) {
    switch (role) {
      case "artists":
        return "1";
      case "with":
        return "2";
      case "composers":
        return "3";
      case "conductor":
        return "4";
      case "dj":
        return "5";
      case "remixedBy":
        return "6";
      case "producer":
        return "7";
      default:
        throw role;
    }
  }
  async function adaptDescriptions(record, callback) {
    await callback($("tr:has(#album_desc) > .label"), $("#album_desc"), dumpDescriptions([record.group], bbcode$1.dump));
    await callback($("tr:has(#release_desc) > .label"), $("#release_desc"), dumpDescriptions([record.item], bbcode$1.dump));
  }
  async function adaptUniversal(record, callback) {
    $("#title").single().value = record.group.name;
    $("#year").single().value = record.group.year.toString();
    $("#remaster_year").single().value = record.item.year?.toString() ?? "";
    $("#remaster_title").single().value = record.item.name ?? "";
    $("#remaster_record_label").single().value = record.item.label ?? "";
    $("#remaster_catalogue_number").single().value = record.item.catalogue ?? "";
    const format_select = $("#format").single();
    trySelect(format_select, record.item.format);
    $(format_select).trigger("change");
    const encoding_select = $("#bitrate").single();
    if (!trySelect(encoding_select, record.item.encoding)) {
      trySelect(encoding_select, "Other");
      $(encoding_select).trigger("change");
      $("#other_bitrate").single().value = record.item.encoding;
    }
    trySelect($("#media").single(), record.item.media);
    $("#image").single().value = record.group.image;
    await adaptDescriptions(record, callback);
  }
  function _adaptReleaseType(select, value, source, target) {
    const name = Object.entries(data.gazelle[source].selects.releaseType).find(([k, _v]) => k === value)?.[1]?.toLowerCase();
    if (!name)
      return;
    const mapped = Object.entries(data.gazelle[target].selects.releaseType).find(([_, v]) => v.toLowerCase() === name)?.[0];
    if (mapped === void 0)
      return;
    select.value = mapped;
  }
  async function adaptGazelle(site2, json_url) {
    const json = await _getJson(json_url, "json");
    if (json.status === "failure") {
      throw json;
    }
    const group = json.response.group;
    const release = json.response.torrent;
    const artist_add = $("#artistfields .brackets.icon_add").single();
    Object.entries(group.musicInfo).flatMap(([role, artists]) => {
      return artists.map((artist) => [role, artist]);
    }).forEach(([role, artist], i) => {
      let input;
      if (i === 0) {
        input = $("#artist").single();
      } else {
        artist_add.click();
        input = $(`#artist_${i}`).single();
      }
      input.value = artist.name;
      input.nextElementSibling.value = _adaptArtistRole(role);
    });
    {
      _adaptReleaseType($("#releasetype").single(), group.releaseType.toString(), site2, "Redacted");
    }
    if (release.scene) {
      $("#scene").single().click();
    }
    $("#tags").single().value = group.tags.join(",");
  }
  async function adaptLogs(logs, name) {
    const log_input = $("#file[name^=logfiles]").single();
    log_input.files = toDataTransfer(log.toFile(logs, name)).files;
  }
  function gazelle(framework) {
    Object.entries(framework).forEach(([st2, site2]) => {
      site2.extract = extract;
      site2.validate = validate;
      switch (st2) {
        case "DIC":
          return dic(site2);
        case "OPS":
          return ops(site2);
        case "Redacted":
          return redacted(site2);
      }
    });
  }
  const _is = {
    void: (node) => /* @__PURE__ */ ((input) => {
      return "hr" === input;
    })(node["#"]),
    valueVoid: (node) => /* @__PURE__ */ ((input) => {
      return "img" === input;
    })(node["#"]),
    view: (node) => /* @__PURE__ */ ((input) => {
      return "b" === input || "i" === input || "u" === input || "s" === input || "center" === input || "sup" === input || "sub" === input || "mask" === input || "pre" === input || "*" === input || "table" === input || "tr" === input || "td" === input;
    })(node["#"]),
    valueView: (node) => /* @__PURE__ */ ((input) => {
      return "font" === input || "size" === input || "color" === input || "url" === input || "code" === input || "quote" === input || "hide" === input;
    })(node["#"])
  };
  function _dump(n, depth = -1) {
    let np = (() => {
      switch (n["#"]) {
        case "h":
          return ValueView("size")(8 - n.$, n.$$);
        case "code":
          return ValueView("font")("monospace", n.$$);
        case "#spoiler":
          return { ...n, "#": "mask" };
        case "align":
          if (n.$ === "center") {
            return View("center")(n.$$);
          } else {
            console.warn(n);
            return n.$$.map((c) => _dump(c, depth)).join("");
          }
        case "#collapse":
          return { ...n, "#": "hide" };
        case "li":
          console.warn(n);
          return { ...n, "#": "*" };
        case "ul":
          ++depth;
          return n.$$.map((li) => `${"    ".repeat(depth)}[*] ${li.$$.map((c) => _dump(c, depth)).join()}`).join("\n");
        case "ol":
          ++depth;
          return n.$$.map((li, i) => `${"    ".repeat(depth)}[*] ${i + 1}. ${li.$$.map((c) => _dump(c, depth)).join()}`).join("\n");
        default:
          return n;
      }
    })();
    if (typeof np === "string") {
      return np;
    }
    switch (np["#"]) {
      case "#text":
        return np.$.replace(/\[(\/?(?:\w+(?:=.+?)?|\*|#))\]/g, "[​$1​]");
      case "*":
        return `[${np["#"]}]${np.$$.map((n2) => _dump(n2)).join("")}`;
    }
    if (_is.void(np)) {
      return `[${np["#"]}]`;
    } else if (_is.valueVoid(np)) {
      return np.$ ? `[${np["#"]}=${np.$}]` : `[${np["#"]}]`;
    } else if (_is.view(np)) {
      return `[${np["#"]}]${np.$$.map((c) => _dump(c)).join("")}[/${np["#"]}]`;
    } else if (_is.valueView(np)) {
      return np.$ ? `[${np["#"]}=${np.$}]${np.$$.map((c) => _dump(c)).join("")}[/${np["#"]}]` : `[${np["#"]}]${np.$$.map((c) => _dump(c)).join("")}[/${np["#"]}]`;
    } else {
      throw n;
    }
  }
  function dump(root) {
    return root.map((node) => _dump(node)).join("").trim();
  }
  const bbcode = { ...bb, dump };
  function opencd(site2) {
    site2.validate = async (callback) => {
      await callback($(".rowhead[msg^=NFO]"), "input[name^=nfo1]");
    };
    site2.adapt = async (payload, callback) => {
      const record = payload.record;
      const cover_task = xmlHttpRequest({
        method: "GET",
        url: record.group.image,
        responseType: "arraybuffer"
      }).then((event) => {
        const transfer = toDataTransfer(new File([event.response], new URL(event.finalUrl).pathname.split("/").filter((x) => x).at(-1)?.substring(1) ?? _throw(event), {
          type: parseHeaders(event.responseHeaders)["content-type"].split(";")[0]
        }));
        $("td:has(> #cover) iframe").single().contentDocument.querySelector("#file").files = transfer.files;
      });
      const desc_parent = $("#editer_description").single();
      if (desc_parent.children.length === 0) {
        await nextMutation(desc_parent, "childList");
      }
      $("#browsecat").single().value = "408";
      $("#artist").single().value = record.group.artists.join(" / ");
      $("#resource_name").single().value = record.group.name;
      const year = $("#year").single();
      year.value = record.group.year.toString();
      year.dispatchEvent(new Event("change"));
      trySelect($("#standard").single(), record.item.format);
      trySelect($("#medium").single(), record.item.media);
      const repost_input = $("#boardid1").single();
      repost_input.checked = true;
      $(repost_input).trigger("change");
      $("#small_descr").single().value = [
        record.item.name,
        record.group.year !== record.item.year && record.item.year,
        record.item.label ? record.item.label : record.group.label,
        record.item.catalogue ? record.item.catalogue : record.group.catalogue
      ].filter((i) => i).join(" / ");
      if (record.item.logs) {
        const log_add = $("#nfoadd").single();
        log.toFile(record.item.logs, record.group.name).forEach(async (f, i) => {
          if (i > 0) {
            log_add.click();
          }
          $(`[name=nfo${"1".repeat(i + 1)}]`).single().files = toDataTransfer(f).files;
        });
      }
      await callback($("tr:has(#descr) > .rowhead"), $("#descr"), dumpDescriptions([record.group, record.item], bbcode.dump));
      await cover_task;
    };
  }
  function tjupt(site2) {
    site2.adapt = async (payload, callback) => {
      const record = payload.record;
      const select_cat = $("#browsecat").single();
      select_cat.value = "406";
      $(select_cat).trigger("change");
      const form_div = select_cat.nextElementSibling ?? _throw(select_cat);
      while (form_div.children.length <= 1)
        await nextMutation(select_cat.nextElementSibling ?? _throw(select_cat), "childList");
      $("#hqname").single().value = record.group.name;
      $("#artist").single().value = record.group.artists.join(" / ");
      $("#issuedate").single().value = record.group.year.toString();
      $("#specificcat").single().value = record.item.media;
      $("#format").single().value = record.item.format;
      $("#hqtone").single().value = record.item.encoding;
      $("input[name=small_descr]").single().value = [
        record.item.name,
        record.group.year !== record.item.year && record.item.year,
        record.item.label ? record.item.label : record.group.label,
        record.item.catalogue ? record.item.catalogue : record.group.catalogue,
        record.item.logs?.score && `Log (${record.item.logs.score}%)`
      ].filter((i) => i).join(" / ");
      const logs = record.item.logs ? log.toString(record.item.logs).map((log2) => `[hide=Log][code]${log2}[/code][/hide]`).join("\n") : void 0;
      await callback($("tr:has(#descr) > .rowhead"), $("#descr"), dumpDescriptions([record.group, record.item], bbcode.dump).map((s) => [`[img]${record.group.image}[/img]`, s, logs].filter((i) => i).join("\n[hr]\n")));
    };
  }
  function nexusphp(framework) {
    Object.entries(framework).forEach(([st2, site2]) => {
      switch (st2) {
        case "OpenCD":
          return opencd(site2);
        case "TJUPT":
          return tjupt(site2);
      }
    });
  }
  gazelle(data.gazelle);
  nexusphp(data.nexusphp);
  function parseSites(location2) {
    if (location2.hostname.toLowerCase() === "logs.musichoarders.xyz") {
      return ["gazelle", "", {}, "validate"];
    }
    const [fw2, st2, site2] = Object.entries(data).flatMap(([fw22, framework]) => Object.entries(framework).map(([st22, site22]) => [fw22, st22, site22])).find(([_f, _s, site22]) => location2.hostname.endsWith(site22.hostname)) ?? _throw(location2);
    const [cat2] = Object.entries(site2.include).find(([cat22, fw_path]) => {
      const path = site2.include?.[cat22] ?? fw_path;
      return path instanceof Array ? path.filter((path2) => path2 === location2.pathname).length > 0 : path === location2.pathname;
    }) ?? _throw(location2);
    return [fw2, st2, site2, cat2];
  }
  function dumpDescriptions(descriptions, dump2) {
    const array = descriptions.map((d) => [
      d.description,
      d.description_tree ? dump2(d.description_tree) : void 0
    ]);
    function* _join() {
      if (array[0][0] !== void 0) {
        yield [array[0][0], ...array.slice(1).map((p) => p[0] ?? p[1] ?? "")].filter((d) => d).join("\n[hr]\n");
      }
      if (array[0][1] !== void 0) {
        yield [array[0][1], ...array.slice(1).map((p) => p[1] ?? p[0] ?? "")].filter((d) => d).join("\n[hr]\n");
      }
    }
    return Array.from(_join());
  }
  const [fw, st, site, cat] = parseSites(location);
  if (cat === "validate") {
    const psuedo_url = new URL(new URL(location.href).hash.substring(1), location.origin);
    if (psuedo_url.pathname === "/ostrich") {
      const input = document.querySelector("#cursorfiles");
      if (input) {
        input.files = toDataTransfer(new File([base64url.decodeBytes(psuedo_url.hash.slice(1))], "text.log", {
          type: "text/plain"
        })).files;
        await( new Promise((resolve) => setTimeout(resolve, 1e3)));
        input.dispatchEvent(new Event("change"));
      }
    }
  } else {
    if ($?.fn?.jquery == void 0) {
      $ = jQuery?.fn?.jquery ? jQuery : await( import("https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.slim.min.js"));
    }
    $.fn.extend({
      single() {
        return this.length === 1 ? this[0] : _throw(this);
      }
    });
    if (cat === "source") {
      if (site.extract) {
        await( site.extract([st, site], async (container, payload) => {
          console.debug(payload);
          const params = new URLSearchParams();
          Object.entries(payload).forEach(([k, v]) => {
            params.set(k, marshal(v));
          });
          const p = params.toString();
          Object.entries(data).flatMap(([_fw, framework]) => Object.entries(framework)).filter(([_st, site2]) => site2.adapt && !location.hostname.endsWith(site2.hostname)).forEach(([st2, site2], s) => {
            if (s !== 0) {
              container.append(document.createTextNode(" · "));
            }
            $(`<a>`).appendTo(container).text(st2).attr("target", "_blank").attr("href", `https://${site2.hostname}${site2.include.target}#ostrich?${p}`);
          });
        }));
      }
    } else if (cat === "target") {
      const psuedo_url = new URL(new URL(location.href).hash.substring(1), location.origin);
      if (site.validate) {
        await( site.validate(async (container, selector) => {
          const anchor = $("<a>").appendTo(container.append($("<br>"))).text("Validate").attr("href", "#_ostrich").single();
          anchor.onclick = async () => {
            await Promise.all($(selector).toArray().filter((input) => input.files).flatMap((input) => [...input.files]).map(async (file) => {
              window.open(`https://logs.musichoarders.xyz#ostrich#${base64url.encodeBytes(new Uint8Array(await file.arrayBuffer()))}`, "_blank");
            }));
          };
        }));
      }
      if (psuedo_url.pathname === "/ostrich") {
        const payload = Object.fromEntries([...psuedo_url.searchParams.entries()].map(([k, v]) => [
          k,
          unmarshal(v)
        ]));
        const record = payload.record;
        console.debug(payload);
        const torrent_task = xmlHttpRequest({
          method: "GET",
          url: payload.torrent,
          responseType: "arraybuffer"
        }).then((event) => {
          return toDataTransfer(new File([event.response], `${encodeURIComponent(record.group.name)}.torrent`, { type: "application/x-bittorrent" }));
        });
        if (site.adapt) {
          await( site.adapt(payload, async (container, input, selections) => {
            selections = selections.filter((s) => s);
            if (selections.length >= 1) {
              input.single().value = selections[0];
              if (selections.length > 1) {
                const anchor = $("<a>").appendTo(container.append($("<br>"))).text("Toggle").attr("href", "#_ostrich").single();
                anchor.onclick = () => {
                  selections.push(selections.shift());
                  input.single().value = selections[0];
                };
              }
            }
          }));
          switch (fw) {
            case "gazelle":
              await( torrent_task.then((data2) => {
                $("#file[name=file_input]").single().files = data2.files;
              }));
              break;
            case "nexusphp":
              await( torrent_task.then((data2) => {
                $("#torrent").single().files = data2.files;
              }));
              break;
          }
        }
      }
    }
  }

})();