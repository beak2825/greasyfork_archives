// ==UserScript==
// @name            Exynos
// @version         v7.1
// @author          ItalianDude!
// @match           *://*.moomoo.io/*
// @match           https://www.mohmoh.eu/
// @grant           none
// @icon            https://media.discordapp.net/attachments/1194836360830406727/1218270075857932378/ENJnXcy.png?ex=66070d6c&is=65f4986c&hm=0f825f9eadffac187cf495c8005d283e2d538e22f6c8d5afd011707291410601&=&format=webp&quality=lossless&width=437&height=437
// @description     monad, also Metamorphosis is pro song
// @namespace https://greasyfork.org/users/1426606
// @downloadURL https://update.greasyfork.org/scripts/525658/Exynos.user.js
// @updateURL https://update.greasyfork.org/scripts/525658/Exynos.meta.js
// ==/UserScript==
let tmpCanvas = document.createElement("canvas");
let tmpContext = tmpCanvas.getContext('2d');
let trapSid = undefined;
let hitCount = 0;
let maxplacement = 5;
let menuHidden;
let advHeal = [];
let healing = [];
let mode = (arr) => arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null);
let abs = true,
chain = false,
antibull = false;
let ez = true,
smooth = false,
still = false,
normal = false;
let toggle = true,
hold = false;
let uzi = true,
syrup = false,
sclient = false,
ae = false,
fz = false;
let antis = {
    reverse: false,
    onetick: false,
}
let txt = true;
let Qt = document.getElementById("pingDisplay");
let antiTick; // kys ass code
let turretEmp = [];
let spikeTick = false;
let waitSpikeTick = false;
let antiinsta = "Calibrating..";
(function (a) {
  if (typeof exports == "object" && typeof module != "undefined") {
    module.exports = a();
  } else if (typeof define == "function" && define.amd) {
    define([], a);
  } else {
    var b;
    b = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
    b.msgpack = a();
  }
})(function () {
  return function g(b, d, e) {
    function a(h, f) {
      if (!d[h]) {
        if (!b[h]) {
          var i = typeof require == "function" && require;
          if (!f && i) {
            return i(h, true);
          }
          if (c) {
            return c(h, true);
          }
          var j = new Error("Cannot find module '" + h + "'");
          j.code = "MODULE_NOT_FOUND";
          throw j;
        }
        var k = d[h] = {
          exports: {}
        };
        b[h][0].call(k.exports, function (c) {
          var d = b[h][1][c];
          return a(d ? d : c);
        }, k, k.exports, g, b, d, e);
      }
      return d[h].exports;
    }
    var c = typeof require == "function" && require;
    for (var h = 0; h < e.length; h++) {
      a(e[h]);
    }
    return a;
  }({
    1: [function (a, b, c) {
      c.encode = a("./encode").encode;
      c.decode = a("./decode").decode;
      c.Encoder = a("./encoder").Encoder;
      c.Decoder = a("./decoder").Decoder;
      c.createCodec = a("./ext").createCodec;
      c.codec = a("./codec").codec;
    }, {
      "./codec": 10,
      "./decode": 12,
      "./decoder": 13,
      "./encode": 15,
      "./encoder": 16,
      "./ext": 20
    }],
    2: [function (a, b, c) {
      (function (a) {
        function c(a) {
          return a && a.isBuffer && a;
        }
        b.exports = c(typeof a != "undefined" && a) || c(this.Buffer) || c(typeof window != "undefined" && window.Buffer) || this.Buffer;
      }).call(this, a("buffer").Buffer);
    }, {
      buffer: 29
    }],
    3: [function (a, b, c) {
      function d(a, b) {
        var c = this;
        var d = b || (b |= 0);
        for (var e = a.length, g = 0, h = 0; h < e;) {
          g = a.charCodeAt(h++);
          if (g < 128) {
            c[d++] = g;
          } else if (g < 2048) {
            c[d++] = g >>> 6 | 192;
            c[d++] = g & 63 | 128;
          } else if (g < 55296 || g > 57343) {
            c[d++] = g >>> 12 | 224;
            c[d++] = g >>> 6 & 63 | 128;
            c[d++] = g & 63 | 128;
          } else {
            g = (g - 55296 << 10 | a.charCodeAt(h++) - 56320) + 65536;
            c[d++] = g >>> 18 | 240;
            c[d++] = g >>> 12 & 63 | 128;
            c[d++] = g >>> 6 & 63 | 128;
            c[d++] = g & 63 | 128;
          }
        }
        return d - b;
      }
      function e(a, b, c) {
        var d = this;
        var g = b | 0;
        c ||= d.length;
        for (var h = "", j = 0; g < c;) {
          j = d[g++];
          if (j < 128) {
            h += String.fromCharCode(j);
          } else {
            if ((j & 224) === 192) {
              j = (j & 31) << 6 | d[g++] & 63;
            } else if ((j & 240) === 224) {
              j = (j & 15) << 12 | (d[g++] & 63) << 6 | d[g++] & 63;
            } else if ((j & 248) === 240) {
              j = (j & 7) << 18 | (d[g++] & 63) << 12 | (d[g++] & 63) << 6 | d[g++] & 63;
            }
            if (j >= 65536) {
              j -= 65536;
              h += String.fromCharCode((j >>> 10) + 55296, (j & 1023) + 56320);
            } else {
              h += String.fromCharCode(j);
            }
          }
        }
        return h;
      }
      function f(a, b, c, d) {
        var f;
        c ||= 0;
        if (!d && d !== 0) {
          d = this.length;
        }
        b ||= 0;
        var g = d - c;
        if (a === this && c < b && b < d) {
          for (f = g - 1; f >= 0; f--) {
            a[f + b] = this[f + c];
          }
        } else {
          for (f = 0; f < g; f++) {
            a[f + b] = this[f + c];
          }
        }
        return g;
      }
      c.copy = f;
      c.toString = e;
      c.write = d;
    }, {}],
    4: [function (a, b, c) {
      function d(a) {
        return new Array(a);
      }
      function f(a) {
        if (!g.isBuffer(a) && g.isView(a)) {
          a = g.Uint8Array.from(a);
        } else if (g.isArrayBuffer(a)) {
          a = new Uint8Array(a);
        } else {
          if (typeof a == "string") {
            return g.from.call(c, a);
          }
          if (typeof a == "number") {
            throw new TypeError("\"value\" argument must not be a number");
          }
        }
        return Array.prototype.slice.call(a);
      }
      var g = a("./bufferish");
      var c = b.exports = d(0);
      c.alloc = d;
      c.concat = g.concat;
      c.from = f;
    }, {
      "./bufferish": 8
    }],
    5: [function (a, b, c) {
      function d(a) {
        return new h(a);
      }
      function f(a) {
        if (!g.isBuffer(a) && g.isView(a)) {
          a = g.Uint8Array.from(a);
        } else if (g.isArrayBuffer(a)) {
          a = new Uint8Array(a);
        } else {
          if (typeof a == "string") {
            return g.from.call(c, a);
          }
          if (typeof a == "number") {
            throw new TypeError("\"value\" argument must not be a number");
          }
        }
        if (h.from && h.from.length !== 1) {
          return h.from(a);
        } else {
          return new h(a);
        }
      }
      var g = a("./bufferish");
      var h = g.global;
      var c = b.exports = g.hasBuffer ? d(0) : [];
      c.alloc = g.hasBuffer && h.alloc || d;
      c.concat = g.concat;
      c.from = f;
    }, {
      "./bufferish": 8
    }],
    6: [function (b, d, g) {
      function h(a, b, c, d) {
        var e = k.isBuffer(this);
        var g = k.isBuffer(a);
        if (e && g) {
          return this.copy(a, b, c, d);
        }
        if (m || e || g || !k.isView(this) || !k.isView(a)) {
          return f.copy.call(this, a, b, c, d);
        }
        var h = c || d != null ? j.call(this, c, d) : this;
        a.set(h, b);
        return h.length;
      }
      function j(a, b) {
        var c = this.slice || !m && this.subarray;
        if (c) {
          return c.call(this, a, b);
        }
        var d = k.alloc.call(this, b - a);
        h.call(this, d, 0, a, b);
        return d;
      }
      function e(a, b, c) {
        var d = !l && k.isBuffer(this) ? this.toString : f.toString;
        return d.apply(this, arguments);
      }
      function i(a) {
        function b() {
          var b = this[a] || f[a];
          return b.apply(this, arguments);
        }
        return b;
      }
      var f = b("./buffer-lite");
      g.copy = h;
      g.slice = j;
      g.toString = e;
      g.write = i("write");
      var k = b("./bufferish");
      var a = k.global;
      var l = k.hasBuffer && "TYPED_ARRAY_SUPPORT" in a;
      var m = l && !a.TYPED_ARRAY_SUPPORT;
    }, {
      "./buffer-lite": 3,
      "./bufferish": 8
    }],
    7: [function (a, b, c) {
      function d(a) {
        return new Uint8Array(a);
      }
      function f(a) {
        if (g.isView(a)) {
          var b = a.byteOffset;
          var d = a.byteLength;
          a = a.buffer;
          if (a.byteLength !== d) {
            if (a.slice) {
              a = a.slice(b, b + d);
            } else {
              a = new Uint8Array(a);
              if (a.byteLength !== d) {
                a = Array.prototype.slice.call(a, b, b + d);
              }
            }
          }
        } else {
          if (typeof a == "string") {
            return g.from.call(c, a);
          }
          if (typeof a == "number") {
            throw new TypeError("\"value\" argument must not be a number");
          }
        }
        return new Uint8Array(a);
      }
      var g = a("./bufferish");
      var c = b.exports = g.hasArrayBuffer ? d(0) : [];
      c.alloc = d;
      c.concat = g.concat;
      c.from = f;
    }, {
      "./bufferish": 8
    }],
    8: [function (j, k, m) {
      function e(a) {
        if (typeof a == "string") {
          return f.call(this, a);
        } else {
          return o(this).from(a);
        }
      }
      function q(a) {
        return o(this).alloc(a);
      }
      function i(c, d) {
        function e(a) {
          d += a.length;
        }
        function g(a) {
          i += b.copy.call(a, f, i);
        }
        if (!d) {
          d = 0;
          Array.prototype.forEach.call(c, e);
        }
        var h = this !== m && this || c[0];
        var f = q.call(h, d);
        var i = 0;
        Array.prototype.forEach.call(c, g);
        return f;
      }
      function n(a) {
        return a instanceof ArrayBuffer || v(a);
      }
      function f(a) {
        var c = a.length * 3;
        var d = q.call(this, c);
        var f = b.write.call(d, a);
        if (c !== f) {
          d = b.slice.call(d, 0, f);
        }
        return d;
      }
      function o(a) {
        if (p(a)) {
          return u;
        } else if (d(a)) {
          return g;
        } else if (l(a)) {
          return t;
        } else if (s) {
          return u;
        } else if (h) {
          return g;
        } else {
          return t;
        }
      }
      function a() {
        return false;
      }
      function r(a, b) {
        a = "[object " + a + "]";
        return function (c) {
          return c != null && {}.toString.call(b ? c[b] : c) === a;
        };
      }
      var c = m.global = j("./buffer-global");
      var s = m.hasBuffer = c && !!c.isBuffer;
      var h = m.hasArrayBuffer = typeof ArrayBuffer != "undefined";
      var l = m.isArray = j("isarray");
      m.isArrayBuffer = h ? n : a;
      var p = m.isBuffer = s ? c.isBuffer : a;
      var d = m.isView = h ? ArrayBuffer.isView || r("ArrayBuffer", "buffer") : a;
      m.alloc = q;
      m.concat = i;
      m.from = e;
      var t = m.Array = j("./bufferish-array");
      var u = m.Buffer = j("./bufferish-buffer");
      var g = m.Uint8Array = j("./bufferish-uint8array");
      var b = m.prototype = j("./bufferish-proto");
      var v = r("ArrayBuffer");
    }, {
      "./buffer-global": 2,
      "./bufferish-array": 4,
      "./bufferish-buffer": 5,
      "./bufferish-proto": 6,
      "./bufferish-uint8array": 7,
      isarray: 34
    }],
    9: [function (b, d, g) {
      function e(a) {
        if (this instanceof e) {
          this.options = a;
          this.init();
          return;
        } else {
          return new e(a);
        }
      }
      function h(a) {
        for (var b in a) {
          e.prototype[b] = i(e.prototype[b], a[b]);
        }
      }
      function i(a, b) {
        function c() {
          a.apply(this, arguments);
          return b.apply(this, arguments);
        }
        if (a && b) {
          return c;
        } else {
          return a || b;
        }
      }
      function j(a) {
        function b(a, b) {
          return b(a);
        }
        a = a.slice();
        return function (c) {
          return a.reduce(b, c);
        };
      }
      function f(b) {
        if (a(b)) {
          return j(b);
        } else {
          return b;
        }
      }
      function k(a) {
        return new e(a);
      }
      var a = b("isarray");
      g.createCodec = k;
      g.install = h;
      g.filter = f;
      var l = b("./bufferish");
      e.prototype.init = function () {
        var a = this.options;
        if (a && a.uint8array) {
          this.bufferish = l.Uint8Array;
        }
        return this;
      };
      g.preset = k({
        preset: true
      });
    }, {
      "./bufferish": 8,
      isarray: 34
    }],
    10: [function (a, b, c) {
      a("./read-core");
      a("./write-core");
      c.codec = {
        preset: a("./codec-base").preset
      };
    }, {
      "./codec-base": 9,
      "./read-core": 22,
      "./write-core": 25
    }],
    11: [function (a, b, c) {
      function d(a) {
        if (!(this instanceof d)) {
          return new d(a);
        }
        if (a && (this.options = a, a.codec)) {
          var b = this.codec = a.codec;
          if (b.bufferish) {
            this.bufferish = b.bufferish;
          }
        }
      }
      c.DecodeBuffer = d;
      var e = a("./read-core").preset;
      var f = a("./flex-buffer").FlexDecoder;
      f.mixin(d.prototype);
      d.prototype.codec = e;
      d.prototype.fetch = function () {
        return this.codec.decode(this);
      };
    }, {
      "./flex-buffer": 21,
      "./read-core": 22
    }],
    12: [function (a, b, c) {
      function d(a, b) {
        var c = new f(b);
        c.write(a);
        return c.read();
      }
      c.decode = d;
      var f = a("./decode-buffer").DecodeBuffer;
    }, {
      "./decode-buffer": 11
    }],
    13: [function (a, b, c) {
      function d(a) {
        if (this instanceof d) {
          f.call(this, a);
          return;
        } else {
          return new d(a);
        }
      }
      c.Decoder = d;
      var e = a("event-lite");
      var f = a("./decode-buffer").DecodeBuffer;
      d.prototype = new f();
      e.mixin(d.prototype);
      d.prototype.decode = function (a) {
        if (arguments.length) {
          this.write(a);
        }
        this.flush();
      };
      d.prototype.push = function (a) {
        this.emit("data", a);
      };
      d.prototype.end = function (a) {
        this.decode(a);
        this.emit("end");
      };
    }, {
      "./decode-buffer": 11,
      "event-lite": 31
    }],
    14: [function (a, b, c) {
      function d(a) {
        if (!(this instanceof d)) {
          return new d(a);
        }
        if (a && (this.options = a, a.codec)) {
          var b = this.codec = a.codec;
          if (b.bufferish) {
            this.bufferish = b.bufferish;
          }
        }
      }
      c.EncodeBuffer = d;
      var e = a("./write-core").preset;
      var f = a("./flex-buffer").FlexEncoder;
      f.mixin(d.prototype);
      d.prototype.codec = e;
      d.prototype.write = function (a) {
        this.codec.encode(this, a);
      };
    }, {
      "./flex-buffer": 21,
      "./write-core": 25
    }],
    15: [function (a, b, c) {
      function d(a, b) {
        var c = new f(b);
        c.write(a);
        return c.read();
      }
      c.encode = d;
      var f = a("./encode-buffer").EncodeBuffer;
    }, {
      "./encode-buffer": 14
    }],
    16: [function (a, b, c) {
      function d(a) {
        if (this instanceof d) {
          f.call(this, a);
          return;
        } else {
          return new d(a);
        }
      }
      c.Encoder = d;
      var e = a("event-lite");
      var f = a("./encode-buffer").EncodeBuffer;
      d.prototype = new f();
      e.mixin(d.prototype);
      d.prototype.encode = function (a) {
        this.write(a);
        this.emit("data", this.read());
      };
      d.prototype.end = function (a) {
        if (arguments.length) {
          this.encode(a);
        }
        this.flush();
        this.emit("end");
      };
    }, {
      "./encode-buffer": 14,
      "event-lite": 31
    }],
    17: [function (a, b, c) {
      function d(a, b) {
        if (this instanceof d) {
          this.buffer = e.from(a);
          this.type = b;
          return;
        } else {
          return new d(a, b);
        }
      }
      c.ExtBuffer = d;
      var e = a("./bufferish");
    }, {
      "./bufferish": 8
    }],
    18: [function (b, d, g) {
      function e(a) {
        a.addExtPacker(14, Error, [f, j]);
        a.addExtPacker(1, EvalError, [f, j]);
        a.addExtPacker(2, RangeError, [f, j]);
        a.addExtPacker(3, ReferenceError, [f, j]);
        a.addExtPacker(4, SyntaxError, [f, j]);
        a.addExtPacker(5, TypeError, [f, j]);
        a.addExtPacker(6, URIError, [f, j]);
        a.addExtPacker(10, RegExp, [k, j]);
        a.addExtPacker(11, Boolean, [i, j]);
        a.addExtPacker(12, String, [i, j]);
        a.addExtPacker(13, Date, [Number, j]);
        a.addExtPacker(15, Number, [i, j]);
        if (typeof Uint8Array != "undefined") {
          a.addExtPacker(17, Int8Array, o);
          a.addExtPacker(18, Uint8Array, o);
          a.addExtPacker(19, Int16Array, o);
          a.addExtPacker(20, Uint16Array, o);
          a.addExtPacker(21, Int32Array, o);
          a.addExtPacker(22, Uint32Array, o);
          a.addExtPacker(23, Float32Array, o);
          if (typeof Float64Array != "undefined") {
            a.addExtPacker(24, Float64Array, o);
          }
          if (typeof Uint8ClampedArray != "undefined") {
            a.addExtPacker(25, Uint8ClampedArray, o);
          }
          a.addExtPacker(26, ArrayBuffer, o);
          a.addExtPacker(29, DataView, o);
        }
        if (m.hasBuffer) {
          a.addExtPacker(27, n, m.from);
        }
      }
      function j(a) {
        l ||= b("./encode").encode;
        return l(a);
      }
      function i(a) {
        return a.valueOf();
      }
      function k(a) {
        a = RegExp.prototype.toString.call(a).split("/");
        a.shift();
        var b = [a.pop()];
        b.unshift(a.join("/"));
        return b;
      }
      function f(a) {
        var b = {};
        for (var d in c) {
          b[d] = a[d];
        }
        return b;
      }
      g.setExtPackers = e;
      var l;
      var m = b("./bufferish");
      var n = m.global;
      var o = m.Uint8Array.from;
      var c = {
        name: 1,
        message: 1,
        stack: 1,
        columnNumber: 1,
        fileName: 1,
        lineNumber: 1
      };
    }, {
      "./bufferish": 8,
      "./encode": 15
    }],
    19: [function (b, d, g) {
      function e(a) {
        a.addExtUnpacker(14, [j, k(Error)]);
        a.addExtUnpacker(1, [j, k(EvalError)]);
        a.addExtUnpacker(2, [j, k(RangeError)]);
        a.addExtUnpacker(3, [j, k(ReferenceError)]);
        a.addExtUnpacker(4, [j, k(SyntaxError)]);
        a.addExtUnpacker(5, [j, k(TypeError)]);
        a.addExtUnpacker(6, [j, k(URIError)]);
        a.addExtUnpacker(10, [j, i]);
        a.addExtUnpacker(11, [j, f(Boolean)]);
        a.addExtUnpacker(12, [j, f(String)]);
        a.addExtUnpacker(13, [j, f(Date)]);
        a.addExtUnpacker(15, [j, f(Number)]);
        if (typeof Uint8Array != "undefined") {
          a.addExtUnpacker(17, f(Int8Array));
          a.addExtUnpacker(18, f(Uint8Array));
          a.addExtUnpacker(19, [l, f(Int16Array)]);
          a.addExtUnpacker(20, [l, f(Uint16Array)]);
          a.addExtUnpacker(21, [l, f(Int32Array)]);
          a.addExtUnpacker(22, [l, f(Uint32Array)]);
          a.addExtUnpacker(23, [l, f(Float32Array)]);
          if (typeof Float64Array != "undefined") {
            a.addExtUnpacker(24, [l, f(Float64Array)]);
          }
          if (typeof Uint8ClampedArray != "undefined") {
            a.addExtUnpacker(25, f(Uint8ClampedArray));
          }
          a.addExtUnpacker(26, l);
          a.addExtUnpacker(29, [l, f(DataView)]);
        }
        if (m.hasBuffer) {
          a.addExtUnpacker(27, f(c));
        }
      }
      function j(c) {
        a ||= b("./decode").decode;
        return a(c);
      }
      function i(a) {
        return RegExp.apply(null, a);
      }
      function k(a) {
        return function (b) {
          var c = new a();
          for (var d in o) {
            c[d] = b[d];
          }
          return c;
        };
      }
      function f(a) {
        return function (b) {
          return new a(b);
        };
      }
      function l(a) {
        return new Uint8Array(a).buffer;
      }
      g.setExtUnpackers = e;
      var a;
      var m = b("./bufferish");
      var c = m.global;
      var o = {
        name: 1,
        message: 1,
        stack: 1,
        columnNumber: 1,
        fileName: 1,
        lineNumber: 1
      };
    }, {
      "./bufferish": 8,
      "./decode": 12
    }],
    20: [function (a, b, c) {
      a("./read-core");
      a("./write-core");
      c.createCodec = a("./codec-base").createCodec;
    }, {
      "./codec-base": 9,
      "./read-core": 22,
      "./write-core": 25
    }],
    21: [function (b, g, j) {
      function e() {
        if (!(this instanceof e)) {
          return new e();
        }
      }
      function k() {
        if (!(this instanceof k)) {
          return new k();
        }
      }
      function i() {
        function b(a) {
          var b = this.offset ? l.prototype.slice.call(this.buffer, this.offset) : this.buffer;
          this.buffer = b ? a ? this.bufferish.concat([b, a]) : b : a;
          this.offset = 0;
        }
        function d() {
          while (this.offset < this.buffer.length) {
            var a;
            var b = this.offset;
            try {
              a = this.fetch();
            } catch (a) {
              if (a && a.message != q) {
                throw a;
              }
              this.offset = b;
              break;
            }
            this.push(a);
          }
        }
        function f(a) {
          var b = this.offset;
          var c = b + a;
          if (c > this.buffer.length) {
            throw new Error(q);
          }
          this.offset = c;
          return b;
        }
        return {
          bufferish: l,
          write: b,
          fetch: n,
          flush: d,
          push: o,
          pull: c,
          read: a,
          reserve: f,
          offset: 0
        };
      }
      function m() {
        function b() {
          var a = this.start;
          if (a < this.offset) {
            var b = this.start = this.offset;
            return l.prototype.slice.call(this.buffer, a, b);
          }
        }
        function c() {
          while (this.start < this.offset) {
            var a = this.fetch();
            if (a) {
              this.push(a);
            }
          }
        }
        function g() {
          var a = this.buffers ||= [];
          var b = a.length > 1 ? this.bufferish.concat(a) : a[0];
          a.length = 0;
          return b;
        }
        function e(a) {
          var b = a | 0;
          if (this.buffer) {
            var c = this.buffer.length;
            var d = this.offset | 0;
            var e = d + b;
            if (e < c) {
              this.offset = e;
              return d;
            }
            this.flush();
            a = Math.max(a, Math.min(c * 2, this.maxBufferSize));
          }
          a = Math.max(a, this.minBufferSize);
          this.buffer = this.bufferish.alloc(a);
          this.start = 0;
          this.offset = b;
          return 0;
        }
        function h(a) {
          var b = a.length;
          if (b > this.minBufferSize) {
            this.flush();
            this.push(a);
          } else {
            var c = this.reserve(b);
            l.prototype.copy.call(a, this.buffer, c);
          }
        }
        return {
          bufferish: l,
          write: f,
          fetch: b,
          flush: c,
          push: o,
          pull: g,
          read: a,
          reserve: e,
          send: h,
          maxBufferSize: d,
          minBufferSize: p,
          offset: 0,
          start: 0
        };
      }
      function f() {
        throw new Error("method not implemented: write()");
      }
      function n() {
        throw new Error("method not implemented: fetch()");
      }
      function a() {
        var a = this.buffers && this.buffers.length;
        if (a) {
          this.flush();
          return this.pull();
        } else {
          return this.fetch();
        }
      }
      function o(a) {
        var b = this.buffers ||= [];
        b.push(a);
      }
      function c() {
        var a = this.buffers ||= [];
        return a.shift();
      }
      function h(a) {
        function b(b) {
          for (var c in a) {
            b[c] = a[c];
          }
          return b;
        }
        return b;
      }
      j.FlexDecoder = e;
      j.FlexEncoder = k;
      var l = b("./bufferish");
      var p = 2048;
      var d = 65536;
      var q = "BUFFER_SHORTAGE";
      e.mixin = h(i());
      e.mixin(e.prototype);
      k.mixin = h(m());
      k.mixin(k.prototype);
    }, {
      "./bufferish": 8
    }],
    22: [function (b, d, g) {
      function e(b) {
        function c(b) {
          var c = a(b);
          var e = d[c];
          if (!e) {
            throw new Error("Invalid type: " + (c ? "0x" + c.toString(16) : c));
          }
          return e(b);
        }
        var d = m.getReadToken(b);
        return c;
      }
      function j() {
        var a = this.options;
        this.decode = e(a);
        if (a && a.preset) {
          l.setExtUnpackers(this);
        }
        return this;
      }
      function i(a, b) {
        var d = this.extUnpackers ||= [];
        d[a] = c.filter(b);
      }
      function k(a) {
        function b(b) {
          return new f(b, a);
        }
        var c = this.extUnpackers ||= [];
        return c[a] || b;
      }
      var f = b("./ext-buffer").ExtBuffer;
      var l = b("./ext-unpacker");
      var a = b("./read-format").readUint8;
      var m = b("./read-token");
      var c = b("./codec-base");
      c.install({
        addExtUnpacker: i,
        getExtUnpacker: k,
        init: j
      });
      g.preset = j.call(c.preset);
    }, {
      "./codec-base": 9,
      "./ext-buffer": 17,
      "./ext-unpacker": 19,
      "./read-format": 23,
      "./read-token": 24
    }],
    23: [function (j, q, r) {
      function e(j) {
        var k = D.hasArrayBuffer && j && j.binarraybuffer;
        var q = j && j.int64;
        var e = E && j && j.usemap;
        var n = {
          map: e ? i : z,
          array: o,
          str: f,
          bin: k ? a : u,
          ext: s,
          uint8: c,
          uint16: l,
          uint32: d,
          uint64: v(8, q ? w : g),
          int8: h,
          int16: p,
          int32: y,
          int64: v(8, q ? C : b),
          float32: v(4, A),
          float64: v(8, m)
        };
        return n;
      }
      function z(a, b) {
        var c;
        var d = {};
        var g = new Array(b);
        var h = new Array(b);
        var i = a.codec.decode;
        for (c = 0; c < b; c++) {
          g[c] = i(a);
          h[c] = i(a);
        }
        for (c = 0; c < b; c++) {
          d[g[c]] = h[c];
        }
        return d;
      }
      function i(a, b) {
        var c;
        var d = new Map();
        var g = new Array(b);
        var h = new Array(b);
        var i = a.codec.decode;
        for (c = 0; c < b; c++) {
          g[c] = i(a);
          h[c] = i(a);
        }
        for (c = 0; c < b; c++) {
          d.set(g[c], h[c]);
        }
        return d;
      }
      function o(a, b) {
        var c = new Array(b);
        var d = a.codec.decode;
        for (var e = 0; e < b; e++) {
          c[e] = d(a);
        }
        return c;
      }
      function f(a, b) {
        var c = a.reserve(b);
        var d = c + b;
        return k.toString.call(a.buffer, "utf-8", c, d);
      }
      function u(a, b) {
        var c = a.reserve(b);
        var d = c + b;
        var e = k.slice.call(a.buffer, c, d);
        return D.from(e);
      }
      function a(a, b) {
        var c = a.reserve(b);
        var d = c + b;
        var e = k.slice.call(a.buffer, c, d);
        return D.Uint8Array.from(e).buffer;
      }
      function s(a, b) {
        var c = a.reserve(b + 1);
        var d = a.buffer[c++];
        var g = c + b;
        var h = a.codec.getExtUnpacker(d);
        if (!h) {
          throw new Error("Invalid ext type: " + (d ? "0x" + d.toString(16) : d));
        }
        var i = k.slice.call(a.buffer, c, g);
        return h(i);
      }
      function c(a) {
        var b = a.reserve(1);
        return a.buffer[b];
      }
      function h(a) {
        var b = a.reserve(1);
        var c = a.buffer[b];
        if (c & 128) {
          return c - 256;
        } else {
          return c;
        }
      }
      function l(a) {
        var b = a.reserve(2);
        var c = a.buffer;
        return c[b++] << 8 | c[b];
      }
      function p(a) {
        var b = a.reserve(2);
        var c = a.buffer;
        var d = c[b++] << 8 | c[b];
        if (d & 32768) {
          return d - 65536;
        } else {
          return d;
        }
      }
      function d(a) {
        var b = a.reserve(4);
        var c = a.buffer;
        return c[b++] * 16777216 + (c[b++] << 16) + (c[b++] << 8) + c[b];
      }
      function y(a) {
        var b = a.reserve(4);
        var c = a.buffer;
        return c[b++] << 24 | c[b++] << 16 | c[b++] << 8 | c[b];
      }
      function v(a, b) {
        return function (c) {
          var d = c.reserve(a);
          return b.call(c.buffer, d, F);
        };
      }
      function g(a) {
        return new x(this, a).toNumber();
      }
      function b(a) {
        return new B(this, a).toNumber();
      }
      function w(a) {
        return new x(this, a);
      }
      function C(a) {
        return new B(this, a);
      }
      function A(a) {
        return n.read(this, a, false, 23, 4);
      }
      function m(a) {
        return n.read(this, a, false, 52, 8);
      }
      var n = j("ieee754");
      var t = j("int64-buffer");
      var x = t.Uint64BE;
      var B = t.Int64BE;
      r.getReadFormat = e;
      r.readUint8 = c;
      var D = j("./bufferish");
      var k = j("./bufferish-proto");
      var E = typeof Map != "undefined";
      var F = true;
    }, {
      "./bufferish": 8,
      "./bufferish-proto": 6,
      ieee754: 32,
      "int64-buffer": 33
    }],
    24: [function (b, c, d) {
      function e(b) {
        var c = a.getReadFormat(b);
        if (b && b.useraw) {
          return h(c);
        } else {
          return g(c);
        }
      }
      function g(a) {
        var b;
        var c = new Array(256);
        for (b = 0; b <= 127; b++) {
          c[b] = i(b);
        }
        for (b = 128; b <= 143; b++) {
          c[b] = j(b - 128, a.map);
        }
        for (b = 144; b <= 159; b++) {
          c[b] = j(b - 144, a.array);
        }
        for (b = 160; b <= 191; b++) {
          c[b] = j(b - 160, a.str);
        }
        c[192] = i(null);
        c[193] = null;
        c[194] = i(false);
        c[195] = i(true);
        c[196] = f(a.uint8, a.bin);
        c[197] = f(a.uint16, a.bin);
        c[198] = f(a.uint32, a.bin);
        c[199] = f(a.uint8, a.ext);
        c[200] = f(a.uint16, a.ext);
        c[201] = f(a.uint32, a.ext);
        c[202] = a.float32;
        c[203] = a.float64;
        c[204] = a.uint8;
        c[205] = a.uint16;
        c[206] = a.uint32;
        c[207] = a.uint64;
        c[208] = a.int8;
        c[209] = a.int16;
        c[210] = a.int32;
        c[211] = a.int64;
        c[212] = j(1, a.ext);
        c[213] = j(2, a.ext);
        c[214] = j(4, a.ext);
        c[215] = j(8, a.ext);
        c[216] = j(16, a.ext);
        c[217] = f(a.uint8, a.str);
        c[218] = f(a.uint16, a.str);
        c[219] = f(a.uint32, a.str);
        c[220] = f(a.uint16, a.array);
        c[221] = f(a.uint32, a.array);
        c[222] = f(a.uint16, a.map);
        c[223] = f(a.uint32, a.map);
        b = 224;
        for (; b <= 255; b++) {
          c[b] = i(b - 256);
        }
        return c;
      }
      function h(a) {
        var b;
        var c = g(a).slice();
        c[217] = c[196];
        c[218] = c[197];
        c[219] = c[198];
        b = 160;
        for (; b <= 191; b++) {
          c[b] = j(b - 160, a.bin);
        }
        return c;
      }
      function i(a) {
        return function () {
          return a;
        };
      }
      function f(a, b) {
        return function (c) {
          var d = a(c);
          return b(c, d);
        };
      }
      function j(a, b) {
        return function (c) {
          return b(c, a);
        };
      }
      var a = b("./read-format");
      d.getReadToken = e;
    }, {
      "./read-format": 23
    }],
    25: [function (b, d, g) {
      function e(b) {
        function c(a, b) {
          var c = d[typeof b];
          if (!c) {
            throw new Error("Unsupported type \"" + typeof b + "\": " + b);
          }
          c(a, b);
        }
        var d = a.getWriteType(b);
        return c;
      }
      function h() {
        var a = this.options;
        this.encode = e(a);
        if (a && a.preset) {
          k.setExtPackers(this);
        }
        return this;
      }
      function i(a, b, c) {
        function d(b) {
          if (c) {
            b = c(b);
          }
          return new f(b, a);
        }
        c = l.filter(c);
        var g = b.name;
        if (g && g !== "Object") {
          var h = this.extPackers ||= {};
          h[g] = d;
        } else {
          var i = this.extEncoderList ||= [];
          i.unshift([b, d]);
        }
      }
      function j(a) {
        var b = this.extPackers ||= {};
        var c = a.constructor;
        var d = c && c.name && b[c.name];
        if (d) {
          return d;
        }
        var e = this.extEncoderList ||= [];
        for (var g = e.length, h = 0; h < g; h++) {
          var i = e[h];
          if (c === i[0]) {
            return i[1];
          }
        }
      }
      var f = b("./ext-buffer").ExtBuffer;
      var k = b("./ext-packer");
      var a = b("./write-type");
      var l = b("./codec-base");
      l.install({
        addExtPacker: i,
        getExtPacker: j,
        init: h
      });
      g.preset = h.call(l.preset);
    }, {
      "./codec-base": 9,
      "./ext-buffer": 17,
      "./ext-packer": 18,
      "./write-type": 27
    }],
    26: [function (j, k, q) {
      function e(a) {
        if (a && a.uint8array) {
          return n();
        } else if (z || v.hasBuffer && a && a.safe) {
          return o();
        } else {
          return i();
        }
      }
      function n() {
        var a = i();
        a[202] = s(202, 4, l);
        a[203] = s(203, 8, p);
        return a;
      }
      function i() {
        var d = b.slice();
        d[196] = f(196);
        d[197] = r(197);
        d[198] = a(198);
        d[199] = f(199);
        d[200] = r(200);
        d[201] = a(201);
        d[202] = s(202, 4, m.writeFloatBE || l, true);
        d[203] = s(203, 8, m.writeDoubleBE || p, true);
        d[204] = f(204);
        d[205] = r(205);
        d[206] = a(206);
        d[207] = s(207, 8, c);
        d[208] = f(208);
        d[209] = r(209);
        d[210] = a(210);
        d[211] = s(211, 8, h);
        d[217] = f(217);
        d[218] = r(218);
        d[219] = a(219);
        d[220] = r(220);
        d[221] = a(221);
        d[222] = r(222);
        d[223] = a(223);
        return d;
      }
      function o() {
        var a = b.slice();
        a[196] = s(196, 1, w.prototype.writeUInt8);
        a[197] = s(197, 2, w.prototype.writeUInt16BE);
        a[198] = s(198, 4, w.prototype.writeUInt32BE);
        a[199] = s(199, 1, w.prototype.writeUInt8);
        a[200] = s(200, 2, w.prototype.writeUInt16BE);
        a[201] = s(201, 4, w.prototype.writeUInt32BE);
        a[202] = s(202, 4, w.prototype.writeFloatBE);
        a[203] = s(203, 8, w.prototype.writeDoubleBE);
        a[204] = s(204, 1, w.prototype.writeUInt8);
        a[205] = s(205, 2, w.prototype.writeUInt16BE);
        a[206] = s(206, 4, w.prototype.writeUInt32BE);
        a[207] = s(207, 8, c);
        a[208] = s(208, 1, w.prototype.writeInt8);
        a[209] = s(209, 2, w.prototype.writeInt16BE);
        a[210] = s(210, 4, w.prototype.writeInt32BE);
        a[211] = s(211, 8, h);
        a[217] = s(217, 1, w.prototype.writeUInt8);
        a[218] = s(218, 2, w.prototype.writeUInt16BE);
        a[219] = s(219, 4, w.prototype.writeUInt32BE);
        a[220] = s(220, 2, w.prototype.writeUInt16BE);
        a[221] = s(221, 4, w.prototype.writeUInt32BE);
        a[222] = s(222, 2, w.prototype.writeUInt16BE);
        a[223] = s(223, 4, w.prototype.writeUInt32BE);
        return a;
      }
      function f(a) {
        return function (b, c) {
          var d = b.reserve(2);
          var e = b.buffer;
          e[d++] = a;
          e[d] = c;
        };
      }
      function r(a) {
        return function (b, c) {
          var d = b.reserve(3);
          var e = b.buffer;
          e[d++] = a;
          e[d++] = c >>> 8;
          e[d] = c;
        };
      }
      function a(a) {
        return function (b, c) {
          var d = b.reserve(5);
          var e = b.buffer;
          e[d++] = a;
          e[d++] = c >>> 24;
          e[d++] = c >>> 16;
          e[d++] = c >>> 8;
          e[d] = c;
        };
      }
      function s(a, b, c, d) {
        return function (e, g) {
          var h = e.reserve(b + 1);
          e.buffer[h++] = a;
          c.call(e.buffer, g, h, d);
        };
      }
      function c(a, b) {
        new u(this, b, a);
      }
      function h(a, b) {
        new g(this, b, a);
      }
      function l(a, b) {
        d.write(this, a, b, false, 23, 4);
      }
      function p(a, b) {
        d.write(this, a, b, false, 52, 8);
      }
      var d = j("ieee754");
      var t = j("int64-buffer");
      var u = t.Uint64BE;
      var g = t.Int64BE;
      var b = j("./write-uint8").uint8;
      var v = j("./bufferish");
      var w = v.global;
      var y = v.hasBuffer && "TYPED_ARRAY_SUPPORT" in w;
      var z = y && !w.TYPED_ARRAY_SUPPORT;
      var m = v.hasBuffer && w.prototype || {};
      q.getWriteToken = e;
    }, {
      "./bufferish": 8,
      "./write-uint8": 28,
      ieee754: 32,
      "int64-buffer": 33
    }],
    27: [function (b, g, j) {
      function e(i) {
        function j(a, b) {
          var c = b ? 195 : 194;
          F[c](a, b);
        }
        function r(a, b) {
          var c;
          var d = b | 0;
          if (b !== d) {
            c = 203;
            F[c](a, b);
            return;
          } else {
            c = d >= -32 && d <= 127 ? d & 255 : d >= 0 ? d <= 255 ? 204 : d <= 65535 ? 205 : 206 : d >= -128 ? 208 : d >= -32768 ? 209 : 210;
            F[c](a, d);
            return;
          }
        }
        function e(a, b) {
          var c = 207;
          F[c](a, b.toArray());
        }
        function n(a, b) {
          var c = 211;
          F[c](a, b.toArray());
        }
        function o(a) {
          if (a < 32) {
            return 1;
          } else if (a <= 255) {
            return 2;
          } else if (a <= 65535) {
            return 3;
          } else {
            return 5;
          }
        }
        function s(a) {
          if (a < 32) {
            return 1;
          } else if (a <= 65535) {
            return 3;
          } else {
            return 5;
          }
        }
        function g(b) {
          function a(d, g) {
            var e = g.length;
            var j = 5 + e * 3;
            d.offset = d.reserve(j);
            var i = d.buffer;
            var k = b(e);
            var f = d.offset + k;
            e = m.write.call(i, g, f);
            var o = b(e);
            if (k !== o) {
              var a = f + o - k;
              var c = f + e;
              m.copy.call(i, i, a, f, c);
            }
            var h = o === 1 ? 160 + e : o <= 3 ? 215 + o : 219;
            F[h](d, e);
            d.offset += e;
          }
          return a;
        }
        function b(a, b) {
          if (b === null) {
            return v(a, b);
          }
          if (J(b)) {
            return I(a, b);
          }
          if (k(b)) {
            return w(a, b);
          }
          if (q.isUint64BE(b)) {
            return e(a, b);
          }
          if (f.isInt64BE(b)) {
            return n(a, b);
          }
          var c = a.codec.getExtPacker(b);
          if (c) {
            b = c(b);
          }
          if (b instanceof h) {
            return z(a, b);
          } else {
            C(a, b);
            return;
          }
        }
        function t(a, c) {
          if (J(c)) {
            return E(a, c);
          } else {
            b(a, c);
            return;
          }
        }
        function v(a, b) {
          var c = 192;
          F[c](a, b);
        }
        function w(a, b) {
          var c = b.length;
          var d = c < 16 ? 144 + c : c <= 65535 ? 220 : 221;
          F[d](a, c);
          var e = a.codec.encode;
          for (var f = 0; f < c; f++) {
            e(a, b[f]);
          }
        }
        function y(a, b) {
          var c = b.length;
          var d = c < 255 ? 196 : c <= 65535 ? 197 : 198;
          F[d](a, c);
          a.send(b);
        }
        function x(a, b) {
          y(a, new Uint8Array(b));
        }
        function z(a, b) {
          var f = b.buffer;
          var e = f.length;
          var g = d[e] || (e < 255 ? 199 : e <= 65535 ? 200 : 201);
          F[g](a, e);
          c[b.type](a);
          a.send(f);
        }
        function A(a, b) {
          var c = Object.keys(b);
          var d = c.length;
          var e = d < 16 ? 128 + d : d <= 65535 ? 222 : 223;
          F[e](a, d);
          var f = a.codec.encode;
          c.forEach(function (c) {
            f(a, c);
            f(a, b[c]);
          });
        }
        function B(a, b) {
          if (!(b instanceof Map)) {
            return A(a, b);
          }
          var c = b.size;
          var d = c < 16 ? 128 + c : c <= 65535 ? 222 : 223;
          F[d](a, c);
          var f = a.codec.encode;
          b.forEach(function (b, c, d) {
            f(a, c);
            f(a, b);
          });
        }
        function E(a, b) {
          var c = b.length;
          var d = c < 32 ? 160 + c : c <= 65535 ? 218 : 219;
          F[d](a, c);
          a.send(b);
        }
        var F = a.getWriteToken(i);
        var G = i && i.useraw;
        var H = l && i && i.binarraybuffer;
        var J = H ? u.isArrayBuffer : u.isBuffer;
        var I = H ? x : y;
        var K = p && i && i.usemap;
        var C = K ? B : A;
        var D = {
          boolean: j,
          function: v,
          number: r,
          object: G ? t : b,
          string: g(G ? s : o),
          symbol: v,
          undefined: v
        };
        return D;
      }
      var k = b("isarray");
      var i = b("int64-buffer");
      var q = i.Uint64BE;
      var f = i.Int64BE;
      var u = b("./bufferish");
      var m = b("./bufferish-proto");
      var a = b("./write-token");
      var c = b("./write-uint8").uint8;
      var h = b("./ext-buffer").ExtBuffer;
      var l = typeof Uint8Array != "undefined";
      var p = typeof Map != "undefined";
      var d = [];
      d[1] = 212;
      d[2] = 213;
      d[4] = 214;
      d[8] = 215;
      d[16] = 216;
      j.getWriteType = e;
    }, {
      "./bufferish": 8,
      "./bufferish-proto": 6,
      "./ext-buffer": 17,
      "./write-token": 26,
      "./write-uint8": 28,
      "int64-buffer": 33,
      isarray: 34
    }],
    28: [function (a, b, c) {
      function d(a) {
        return function (b) {
          var c = b.reserve(1);
          b.buffer[c] = a;
        };
      }
      var e = c.uint8 = new Array(256);
      for (var f = 0; f <= 255; f++) {
        e[f] = d(f);
      }
    }, {}],
    29: [function (aa, a, ba) {
      (function (e) {
        "use strict";

        function r() {
          try {
            var a = new Uint8Array(1);
            a.__proto__ = {
              __proto__: Uint8Array.prototype,
              foo: function () {
                return 42;
              }
            };
            return a.foo() === 42 && typeof a.subarray == "function" && a.subarray(1, 1).byteLength === 0;
          } catch (a) {
            return false;
          }
        }
        function n() {
          if (da.TYPED_ARRAY_SUPPORT) {
            return 2147483647;
          } else {
            return 1073741823;
          }
        }
        function ca(a, b) {
          if (n() < b) {
            throw new RangeError("Invalid typed array length");
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            a = new Uint8Array(b);
            a.__proto__ = da.prototype;
          } else {
            if (a === null) {
              a = new da(b);
            }
            a.length = b;
          }
          return a;
        }
        function da(b, c, d) {
          if (!da.TYPED_ARRAY_SUPPORT && !(this instanceof da)) {
            return new da(b, c, d);
          }
          if (typeof b == "number") {
            if (typeof c == "string") {
              throw new Error("If encoding is specified then the first argument must be a string");
            }
            return a(this, b);
          }
          return ea(this, b, c, d);
        }
        function ea(a, b, c, d) {
          if (typeof b == "number") {
            throw new TypeError("\"value\" argument must not be a number");
          }
          if (typeof ArrayBuffer != "undefined" && b instanceof ArrayBuffer) {
            return h(a, b, c, d);
          } else if (typeof b == "string") {
            return o(a, b, c);
          } else {
            return l(a, b);
          }
        }
        function f(a) {
          if (typeof a != "number") {
            throw new TypeError("\"size\" argument must be a number");
          }
          if (a < 0) {
            throw new RangeError("\"size\" argument must not be negative");
          }
        }
        function i(a, b, c, d) {
          f(b);
          if (b <= 0) {
            return ca(a, b);
          } else if (c !== undefined) {
            if (typeof d == "string") {
              return ca(a, b).fill(c, d);
            } else {
              return ca(a, b).fill(c);
            }
          } else {
            return ca(a, b);
          }
        }
        function a(a, b) {
          f(b);
          a = ca(a, b < 0 ? 0 : p(b) | 0);
          if (!da.TYPED_ARRAY_SUPPORT) {
            for (var c = 0; c < b; ++c) {
              a[c] = 0;
            }
          }
          return a;
        }
        function o(a, b, c) {
          if (typeof c != "string" || c === "") {
            c = "utf8";
          }
          if (!da.isEncoding(c)) {
            throw new TypeError("\"encoding\" must be a valid string encoding");
          }
          var d = s(b, c) | 0;
          a = ca(a, d);
          var f = a.write(b, c);
          if (f !== d) {
            a = a.slice(0, f);
          }
          return a;
        }
        function c(a, b) {
          var c = b.length < 0 ? 0 : p(b.length) | 0;
          a = ca(a, c);
          for (var d = 0; d < c; d += 1) {
            a[d] = b[d] & 255;
          }
          return a;
        }
        function h(a, b, d, e) {
          b.byteLength;
          if (d < 0 || b.byteLength < d) {
            throw new RangeError("'offset' is out of bounds");
          }
          if (b.byteLength < d + (e || 0)) {
            throw new RangeError("'length' is out of bounds");
          }
          b = d === undefined && e === undefined ? new Uint8Array(b) : e === undefined ? new Uint8Array(b, d) : new Uint8Array(b, d, e);
          if (da.TYPED_ARRAY_SUPPORT) {
            a = b;
            a.__proto__ = da.prototype;
          } else {
            a = c(a, b);
          }
          return a;
        }
        function l(a, b) {
          if (da.isBuffer(b)) {
            var d = p(b.length) | 0;
            a = ca(a, d);
            if (a.length === 0) {
              return a;
            } else {
              b.copy(a, 0, 0, d);
              return a;
            }
          }
          if (b) {
            if (typeof ArrayBuffer != "undefined" && b.buffer instanceof ArrayBuffer || "length" in b) {
              if (typeof b.length != "number" || G(b.length)) {
                return ca(a, 0);
              } else {
                return c(a, b);
              }
            }
            if (b.type === "Buffer" && K(b.data)) {
              return c(a, b.data);
            }
          }
          throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
        }
        function p(a) {
          if (a >= n()) {
            throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n().toString(16) + " bytes");
          }
          return a | 0;
        }
        function d(a) {
          if (+a != a) {
            a = 0;
          }
          return da.alloc(+a);
        }
        function s(a, b) {
          if (da.isBuffer(a)) {
            return a.length;
          }
          if (typeof ArrayBuffer != "undefined" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(a) || a instanceof ArrayBuffer)) {
            return a.byteLength;
          }
          if (typeof a != "string") {
            a = "" + a;
          }
          var c = a.length;
          if (c === 0) {
            return 0;
          }
          var d = false;
          while (true) {
            switch (b) {
              case "ascii":
              case "latin1":
              case "binary":
                return c;
              case "utf8":
              case "utf-8":
              case undefined:
                return U(a).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return c * 2;
              case "hex":
                return c >>> 1;
              case "base64":
                return J(a).length;
              default:
                if (d) {
                  return U(a).length;
                }
                b = ("" + b).toLowerCase();
                d = true;
            }
          }
        }
        function t(a, b, c) {
          var d = false;
          if (b === undefined || b < 0) {
            b = 0;
          }
          if (b > this.length) {
            return "";
          }
          if (c === undefined || c > this.length) {
            c = this.length;
          }
          if (c <= 0) {
            return "";
          }
          c >>>= 0;
          b >>>= 0;
          if (c <= b) {
            return "";
          }
          for (a ||= "utf8";;) {
            switch (a) {
              case "hex":
                return S(this, b, c);
              case "utf8":
              case "utf-8":
                return E(this, b, c);
              case "ascii":
                return P(this, b, c);
              case "latin1":
              case "binary":
                return R(this, b, c);
              case "base64":
                return B(this, b, c);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return I(this, b, c);
              default:
                if (d) {
                  throw new TypeError("Unknown encoding: " + a);
                }
                a = (a + "").toLowerCase();
                d = true;
            }
          }
        }
        function g(a, b, c) {
          var d = a[b];
          a[b] = a[c];
          a[c] = d;
        }
        function b(a, b, c, d, f) {
          if (a.length === 0) {
            return -1;
          }
          if (typeof c == "string") {
            d = c;
            c = 0;
          } else if (c > 2147483647) {
            c = 2147483647;
          } else if (c < -2147483648) {
            c = -2147483648;
          }
          c = +c;
          if (isNaN(c)) {
            c = f ? 0 : a.length - 1;
          }
          if (c < 0) {
            c = a.length + c;
          }
          if (c >= a.length) {
            if (f) {
              return -1;
            }
            c = a.length - 1;
          } else if (c < 0) {
            if (!f) {
              return -1;
            }
            c = 0;
          }
          if (typeof b == "string") {
            b = da.from(b, d);
          }
          if (da.isBuffer(b)) {
            if (b.length === 0) {
              return -1;
            } else {
              return u(a, b, c, d, f);
            }
          }
          if (typeof b == "number") {
            b = b & 255;
            if (da.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function") {
              if (f) {
                return Uint8Array.prototype.indexOf.call(a, b, c);
              } else {
                return Uint8Array.prototype.lastIndexOf.call(a, b, c);
              }
            } else {
              return u(a, [b], c, d, f);
            }
          }
          throw new TypeError("val must be string, number or Buffer");
        }
        function u(b, d, g, j, k) {
          function i(a, b) {
            if (m === 1) {
              return a[b];
            } else {
              return a.readUInt16BE(b * m);
            }
          }
          var m = 1;
          var o = b.length;
          var p = d.length;
          if (j !== undefined && (j = String(j).toLowerCase(), j === "ucs2" || j === "ucs-2" || j === "utf16le" || j === "utf-16le")) {
            if (b.length < 2 || d.length < 2) {
              return -1;
            }
            m = 2;
            o /= 2;
            p /= 2;
            g /= 2;
          }
          var q;
          if (k) {
            var r = -1;
            for (q = g; q < o; q++) {
              if (i(b, q) === i(d, r === -1 ? 0 : q - r)) {
                if (r === -1) {
                  r = q;
                }
                if (q - r + 1 === p) {
                  return r * m;
                }
              } else {
                if (r !== -1) {
                  q -= q - r;
                }
                r = -1;
              }
            }
          } else {
            if (g + p > o) {
              g = o - p;
            }
            q = g;
            for (; q >= 0; q--) {
              var t = true;
              for (var v = 0; v < p; v++) {
                if (i(b, q + v) !== i(d, v)) {
                  t = false;
                  break;
                }
              }
              if (t) {
                return q;
              }
            }
          }
          return -1;
        }
        function v(a, b, c, d) {
          c = Number(c) || 0;
          var g = a.length - c;
          if (d) {
            d = Number(d);
            if (d > g) {
              d = g;
            }
          } else {
            d = g;
          }
          var h = b.length;
          if (h % 2 !== 0) {
            throw new TypeError("Invalid hex string");
          }
          if (d > h / 2) {
            d = h / 2;
          }
          for (var i = 0; i < d; ++i) {
            var j = parseInt(b.substr(i * 2, 2), 16);
            if (isNaN(j)) {
              return i;
            }
            a[c + i] = j;
          }
          return i;
        }
        function w(a, b, c, d) {
          return W(U(b, a.length - c), a, c, d);
        }
        function m(a, b, c, d) {
          return W(q(b), a, c, d);
        }
        function x(a, b, c, d) {
          return m(a, b, c, d);
        }
        function y(a, b, c, d) {
          return W(J(b), a, c, d);
        }
        function A(a, b, c, d) {
          return W(V(b, a.length - c), a, c, d);
        }
        function B(a, b, c) {
          if (b === 0 && c === a.length) {
            return H.fromByteArray(a);
          } else {
            return H.fromByteArray(a.slice(b, c));
          }
        }
        function E(b, d, g) {
          g = Math.min(b.length, g);
          var j = [];
          for (var l = d; l < g;) {
            var m = b[l];
            var n = null;
            var p = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
            if (l + p <= g) {
              var q;
              var r;
              var t;
              var v;
              switch (p) {
                case 1:
                  if (m < 128) {
                    n = m;
                  }
                  break;
                case 2:
                  q = b[l + 1];
                  if ((q & 192) === 128) {
                    v = (m & 31) << 6 | q & 63;
                    if (v > 127) {
                      n = v;
                    }
                  }
                  break;
                case 3:
                  q = b[l + 1];
                  r = b[l + 2];
                  if ((q & 192) === 128 && (r & 192) === 128) {
                    v = (m & 15) << 12 | (q & 63) << 6 | r & 63;
                    if (v > 2047 && (v < 55296 || v > 57343)) {
                      n = v;
                    }
                  }
                  break;
                case 4:
                  q = b[l + 1];
                  r = b[l + 2];
                  t = b[l + 3];
                  if ((q & 192) === 128 && (r & 192) === 128 && (t & 192) === 128) {
                    v = (m & 15) << 18 | (q & 63) << 12 | (r & 63) << 6 | t & 63;
                    if (v > 65535 && v < 1114112) {
                      n = v;
                    }
                  }
              }
            }
            if (n === null) {
              n = 65533;
              p = 1;
            } else if (n > 65535) {
              n -= 65536;
              j.push(n >>> 10 & 1023 | 55296);
              n = n & 1023 | 56320;
            }
            j.push(n);
            l += p;
          }
          return k(j);
        }
        function k(a) {
          var b = a.length;
          if (b <= Q) {
            return String.fromCharCode.apply(String, a);
          }
          var c = "";
          for (var d = 0; d < b;) {
            c += String.fromCharCode.apply(String, a.slice(d, d += Q));
          }
          return c;
        }
        function P(a, b, c) {
          var d = "";
          c = Math.min(a.length, c);
          for (var f = b; f < c; ++f) {
            d += String.fromCharCode(a[f] & 127);
          }
          return d;
        }
        function R(a, b, c) {
          var d = "";
          c = Math.min(a.length, c);
          for (var f = b; f < c; ++f) {
            d += String.fromCharCode(a[f]);
          }
          return d;
        }
        function S(a, b, c) {
          var d = a.length;
          if (!b || b < 0) {
            b = 0;
          }
          if (!c || c < 0 || c > d) {
            c = d;
          }
          var f = "";
          for (var g = b; g < c; ++g) {
            f += z(a[g]);
          }
          return f;
        }
        function I(a, b, c) {
          for (var d = a.slice(b, c), e = "", f = 0; f < d.length; f += 2) {
            e += String.fromCharCode(d[f] + d[f + 1] * 256);
          }
          return e;
        }
        function T(a, b, c) {
          if (a % 1 !== 0 || a < 0) {
            throw new RangeError("offset is not uint");
          }
          if (a + b > c) {
            throw new RangeError("Trying to access beyond buffer length");
          }
        }
        function C(a, b, c, d, e, f) {
          if (!da.isBuffer(a)) {
            throw new TypeError("\"buffer\" argument must be a Buffer instance");
          }
          if (b > e || b < f) {
            throw new RangeError("\"value\" argument is out of bounds");
          }
          if (c + d > a.length) {
            throw new RangeError("Index out of range");
          }
        }
        function D(a, b, c, d) {
          if (b < 0) {
            b = 65535 + b + 1;
          }
          for (var e = 0, f = Math.min(a.length - c, 2); e < f; ++e) {
            a[c + e] = (b & 255 << (d ? e : 1 - e) * 8) >>> (d ? e : 1 - e) * 8;
          }
        }
        function O(a, b, c, d) {
          if (b < 0) {
            b = 4294967295 + b + 1;
          }
          for (var e = 0, f = Math.min(a.length - c, 4); e < f; ++e) {
            a[c + e] = b >>> (d ? e : 3 - e) * 8 & 255;
          }
        }
        function L(a, b, c, d, e, f) {
          if (c + d > a.length) {
            throw new RangeError("Index out of range");
          }
          if (c < 0) {
            throw new RangeError("Index out of range");
          }
        }
        function M(a, b, c, d, e) {
          if (!e) {
            L(a, b, c, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
          }
          X.write(a, b, c, d, 23, 4);
          return c + 4;
        }
        function N(a, b, c, d, e) {
          if (!e) {
            L(a, b, c, 8, 1.7976931348623157e+308, -1.7976931348623157e+308);
          }
          X.write(a, b, c, d, 52, 8);
          return c + 8;
        }
        function F(a) {
          a = j(a).replace(Y, "");
          if (a.length < 2) {
            return "";
          }
          while (a.length % 4 !== 0) {
            a += "=";
          }
          return a;
        }
        function j(a) {
          if (a.trim) {
            return a.trim();
          } else {
            return a.replace(/^\s+|\s+$/g, "");
          }
        }
        function z(a) {
          if (a < 16) {
            return "0" + a.toString(16);
          } else {
            return a.toString(16);
          }
        }
        function U(a, b) {
          b = b || Infinity;
          var c;
          for (var d = a.length, g = null, h = [], j = 0; j < d; ++j) {
            c = a.charCodeAt(j);
            if (c > 55295 && c < 57344) {
              if (!g) {
                if (c > 56319) {
                  if ((b -= 3) > -1) {
                    h.push(239, 191, 189);
                  }
                  continue;
                }
                if (j + 1 === d) {
                  if ((b -= 3) > -1) {
                    h.push(239, 191, 189);
                  }
                  continue;
                }
                g = c;
                continue;
              }
              if (c < 56320) {
                if ((b -= 3) > -1) {
                  h.push(239, 191, 189);
                }
                g = c;
                continue;
              }
              c = (g - 55296 << 10 | c - 56320) + 65536;
            } else if (g && (b -= 3) > -1) {
              h.push(239, 191, 189);
            }
            g = null;
            if (c < 128) {
              if ((b -= 1) < 0) {
                break;
              }
              h.push(c);
            } else if (c < 2048) {
              if ((b -= 2) < 0) {
                break;
              }
              h.push(c >> 6 | 192, c & 63 | 128);
            } else if (c < 65536) {
              if ((b -= 3) < 0) {
                break;
              }
              h.push(c >> 12 | 224, c >> 6 & 63 | 128, c & 63 | 128);
            } else {
              if (c >= 1114112) {
                throw new Error("Invalid code point");
              }
              if ((b -= 4) < 0) {
                break;
              }
              h.push(c >> 18 | 240, c >> 12 & 63 | 128, c >> 6 & 63 | 128, c & 63 | 128);
            }
          }
          return h;
        }
        function q(a) {
          var b = [];
          for (var c = 0; c < a.length; ++c) {
            b.push(a.charCodeAt(c) & 255);
          }
          return b;
        }
        function V(a, b) {
          var c;
          var d;
          var g;
          var h = [];
          for (var j = 0; j < a.length && (b -= 2) >= 0; ++j) {
            c = a.charCodeAt(j);
            d = c >> 8;
            g = c % 256;
            h.push(g);
            h.push(d);
          }
          return h;
        }
        function J(a) {
          return H.toByteArray(F(a));
        }
        function W(a, b, c, d) {
          for (var e = 0; e < d && e + c < b.length && e < a.length; ++e) {
            b[e + c] = a[e];
          }
          return e;
        }
        function G(a) {
          return a !== a;
        }
        var H = aa("base64-js");
        var X = aa("ieee754");
        var K = aa("isarray");
        ba.Buffer = da;
        ba.SlowBuffer = d;
        ba.INSPECT_MAX_BYTES = 50;
        da.TYPED_ARRAY_SUPPORT = e.TYPED_ARRAY_SUPPORT !== undefined ? e.TYPED_ARRAY_SUPPORT : r();
        ba.kMaxLength = n();
        da.poolSize = 8192;
        da._augment = function (a) {
          a.__proto__ = da.prototype;
          return a;
        };
        da.from = function (a, b, c) {
          return ea(null, a, b, c);
        };
        if (da.TYPED_ARRAY_SUPPORT) {
          da.prototype.__proto__ = Uint8Array.prototype;
          da.__proto__ = Uint8Array;
          if (typeof Symbol != "undefined" && Symbol.species && da[Symbol.species] === da) {
            Object.defineProperty(da, Symbol.species, {
              value: null,
              configurable: true
            });
          }
        }
        da.alloc = function (a, b, c) {
          return i(null, a, b, c);
        };
        da.allocUnsafe = function (b) {
          return a(null, b);
        };
        da.allocUnsafeSlow = function (b) {
          return a(null, b);
        };
        da.isBuffer = function (a) {
          return a != null && !!a._isBuffer;
        };
        da.compare = function (a, b) {
          if (!da.isBuffer(a) || !da.isBuffer(b)) {
            throw new TypeError("Arguments must be Buffers");
          }
          if (a === b) {
            return 0;
          }
          var c = a.length;
          var d = b.length;
          for (var f = 0, g = Math.min(c, d); f < g; ++f) {
            if (a[f] !== b[f]) {
              c = a[f];
              d = b[f];
              break;
            }
          }
          if (c < d) {
            return -1;
          } else if (d < c) {
            return 1;
          } else {
            return 0;
          }
        };
        da.isEncoding = function (a) {
          switch (String(a).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        };
        da.concat = function (a, b) {
          if (!K(a)) {
            throw new TypeError("\"list\" argument must be an Array of Buffers");
          }
          if (a.length === 0) {
            return da.alloc(0);
          }
          var c;
          if (b === undefined) {
            b = 0;
            c = 0;
            for (; c < a.length; ++c) {
              b += a[c].length;
            }
          }
          var d = da.allocUnsafe(b);
          var f = 0;
          for (c = 0; c < a.length; ++c) {
            var g = a[c];
            if (!da.isBuffer(g)) {
              throw new TypeError("\"list\" argument must be an Array of Buffers");
            }
            g.copy(d, f);
            f += g.length;
          }
          return d;
        };
        da.byteLength = s;
        da.prototype._isBuffer = true;
        da.prototype.swap16 = function () {
          var a = this.length;
          if (a % 2 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 16-bits");
          }
          for (var b = 0; b < a; b += 2) {
            g(this, b, b + 1);
          }
          return this;
        };
        da.prototype.swap32 = function () {
          var a = this.length;
          if (a % 4 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 32-bits");
          }
          for (var b = 0; b < a; b += 4) {
            g(this, b, b + 3);
            g(this, b + 1, b + 2);
          }
          return this;
        };
        da.prototype.swap64 = function () {
          var a = this.length;
          if (a % 8 !== 0) {
            throw new RangeError("Buffer size must be a multiple of 64-bits");
          }
          for (var b = 0; b < a; b += 8) {
            g(this, b, b + 7);
            g(this, b + 1, b + 6);
            g(this, b + 2, b + 5);
            g(this, b + 3, b + 4);
          }
          return this;
        };
        da.prototype.toString = function () {
          var a = this.length | 0;
          if (a === 0) {
            return "";
          } else if (arguments.length === 0) {
            return E(this, 0, a);
          } else {
            return t.apply(this, arguments);
          }
        };
        da.prototype.equals = function (a) {
          if (!da.isBuffer(a)) {
            throw new TypeError("Argument must be a Buffer");
          }
          return this === a || da.compare(this, a) === 0;
        };
        da.prototype.inspect = function () {
          var a = "";
          var b = ba.INSPECT_MAX_BYTES;
          if (this.length > 0) {
            a = this.toString("hex", 0, b).match(/.{2}/g).join(" ");
            if (this.length > b) {
              a += " ... ";
            }
          }
          return "<Buffer " + a + ">";
        };
        da.prototype.compare = function (b, d, g, h, j) {
          if (!da.isBuffer(b)) {
            throw new TypeError("Argument must be a Buffer");
          }
          if (d === undefined) {
            d = 0;
          }
          if (g === undefined) {
            g = b ? b.length : 0;
          }
          if (h === undefined) {
            h = 0;
          }
          if (j === undefined) {
            j = this.length;
          }
          if (d < 0 || g > b.length || h < 0 || j > this.length) {
            throw new RangeError("out of range index");
          }
          if (h >= j && d >= g) {
            return 0;
          }
          if (h >= j) {
            return -1;
          }
          if (d >= g) {
            return 1;
          }
          d >>>= 0;
          g >>>= 0;
          h >>>= 0;
          j >>>= 0;
          if (this === b) {
            return 0;
          }
          var k = j - h;
          var l = g - d;
          for (var m = Math.min(k, l), p = this.slice(h, j), a = b.slice(d, g), q = 0; q < m; ++q) {
            if (p[q] !== a[q]) {
              k = p[q];
              l = a[q];
              break;
            }
          }
          if (k < l) {
            return -1;
          } else if (l < k) {
            return 1;
          } else {
            return 0;
          }
        };
        da.prototype.includes = function (a, b, c) {
          return this.indexOf(a, b, c) !== -1;
        };
        da.prototype.indexOf = function (a, c, d) {
          return b(this, a, c, d, true);
        };
        da.prototype.lastIndexOf = function (a, c, d) {
          return b(this, a, c, d, false);
        };
        da.prototype.write = function (a, b, c, d) {
          if (b === undefined) {
            d = "utf8";
            c = this.length;
            b = 0;
          } else if (c === undefined && typeof b == "string") {
            d = b;
            c = this.length;
            b = 0;
          } else {
            if (!isFinite(b)) {
              throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            }
            b = b | 0;
            if (isFinite(c)) {
              c = c | 0;
              if (d === undefined) {
                d = "utf8";
              }
            } else {
              d = c;
              c = undefined;
            }
          }
          var f = this.length - b;
          if (c === undefined || c > f) {
            c = f;
          }
          if (a.length > 0 && (c < 0 || b < 0) || b > this.length) {
            throw new RangeError("Attempt to write outside buffer bounds");
          }
          d ||= "utf8";
          var g = false;
          while (true) {
            switch (d) {
              case "hex":
                return v(this, a, b, c);
              case "utf8":
              case "utf-8":
                return w(this, a, b, c);
              case "ascii":
                return m(this, a, b, c);
              case "latin1":
              case "binary":
                return x(this, a, b, c);
              case "base64":
                return y(this, a, b, c);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return A(this, a, b, c);
              default:
                if (g) {
                  throw new TypeError("Unknown encoding: " + d);
                }
                d = ("" + d).toLowerCase();
                g = true;
            }
          }
        };
        da.prototype.toJSON = function () {
          return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
          };
        };
        var Q = 4096;
        da.prototype.slice = function (a, b) {
          var c = this.length;
          a = ~~a;
          b = b === undefined ? c : ~~b;
          if (a < 0) {
            a += c;
            if (a < 0) {
              a = 0;
            }
          } else if (a > c) {
            a = c;
          }
          if (b < 0) {
            b += c;
            if (b < 0) {
              b = 0;
            }
          } else if (b > c) {
            b = c;
          }
          if (b < a) {
            b = a;
          }
          var d;
          if (da.TYPED_ARRAY_SUPPORT) {
            d = this.subarray(a, b);
            d.__proto__ = da.prototype;
          } else {
            var e = b - a;
            d = new da(e, undefined);
            for (var f = 0; f < e; ++f) {
              d[f] = this[f + a];
            }
          }
          return d;
        };
        da.prototype.readUIntLE = function (a, b, c) {
          a = a | 0;
          b = b | 0;
          if (!c) {
            T(a, b, this.length);
          }
          var d = this[a];
          for (var e = 1, f = 0; ++f < b && (e *= 256);) {
            d += this[a + f] * e;
          }
          return d;
        };
        da.prototype.readUIntBE = function (a, b, c) {
          a = a | 0;
          b = b | 0;
          if (!c) {
            T(a, b, this.length);
          }
          var d = this[a + --b];
          for (var e = 1; b > 0 && (e *= 256);) {
            d += this[a + --b] * e;
          }
          return d;
        };
        da.prototype.readUInt8 = function (a, b) {
          if (!b) {
            T(a, 1, this.length);
          }
          return this[a];
        };
        da.prototype.readUInt16LE = function (a, b) {
          if (!b) {
            T(a, 2, this.length);
          }
          return this[a] | this[a + 1] << 8;
        };
        da.prototype.readUInt16BE = function (a, b) {
          if (!b) {
            T(a, 2, this.length);
          }
          return this[a] << 8 | this[a + 1];
        };
        da.prototype.readUInt32LE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return (this[a] | this[a + 1] << 8 | this[a + 2] << 16) + this[a + 3] * 16777216;
        };
        da.prototype.readUInt32BE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return this[a] * 16777216 + (this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3]);
        };
        da.prototype.readIntLE = function (a, b, c) {
          a = a | 0;
          b = b | 0;
          if (!c) {
            T(a, b, this.length);
          }
          var d = this[a];
          for (var e = 1, f = 0; ++f < b && (e *= 256);) {
            d += this[a + f] * e;
          }
          e *= 128;
          if (d >= e) {
            d -= Math.pow(2, b * 8);
          }
          return d;
        };
        da.prototype.readIntBE = function (a, b, c) {
          a = a | 0;
          b = b | 0;
          if (!c) {
            T(a, b, this.length);
          }
          for (var d = b, e = 1, f = this[a + --d]; d > 0 && (e *= 256);) {
            f += this[a + --d] * e;
          }
          e *= 128;
          if (f >= e) {
            f -= Math.pow(2, b * 8);
          }
          return f;
        };
        da.prototype.readInt8 = function (a, b) {
          if (!b) {
            T(a, 1, this.length);
          }
          if (this[a] & 128) {
            return (255 - this[a] + 1) * -1;
          } else {
            return this[a];
          }
        };
        da.prototype.readInt16LE = function (a, b) {
          if (!b) {
            T(a, 2, this.length);
          }
          var c = this[a] | this[a + 1] << 8;
          if (c & 32768) {
            return c | 4294901760;
          } else {
            return c;
          }
        };
        da.prototype.readInt16BE = function (a, b) {
          if (!b) {
            T(a, 2, this.length);
          }
          var c = this[a + 1] | this[a] << 8;
          if (c & 32768) {
            return c | 4294901760;
          } else {
            return c;
          }
        };
        da.prototype.readInt32LE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return this[a] | this[a + 1] << 8 | this[a + 2] << 16 | this[a + 3] << 24;
        };
        da.prototype.readInt32BE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return this[a] << 24 | this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3];
        };
        da.prototype.readFloatLE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return X.read(this, a, true, 23, 4);
        };
        da.prototype.readFloatBE = function (a, b) {
          if (!b) {
            T(a, 4, this.length);
          }
          return X.read(this, a, false, 23, 4);
        };
        da.prototype.readDoubleLE = function (a, b) {
          if (!b) {
            T(a, 8, this.length);
          }
          return X.read(this, a, true, 52, 8);
        };
        da.prototype.readDoubleBE = function (a, b) {
          if (!b) {
            T(a, 8, this.length);
          }
          return X.read(this, a, false, 52, 8);
        };
        da.prototype.writeUIntLE = function (a, b, c, d) {
          a = +a;
          b = b | 0;
          c = c | 0;
          if (!d) {
            var g = Math.pow(2, c * 8) - 1;
            C(this, a, b, c, g, 0);
          }
          var h = 1;
          var i = 0;
          for (this[b] = a & 255; ++i < c && (h *= 256);) {
            this[b + i] = a / h & 255;
          }
          return b + c;
        };
        da.prototype.writeUIntBE = function (a, b, c, d) {
          a = +a;
          b = b | 0;
          c = c | 0;
          if (!d) {
            var g = Math.pow(2, c * 8) - 1;
            C(this, a, b, c, g, 0);
          }
          var h = c - 1;
          var i = 1;
          for (this[b + h] = a & 255; --h >= 0 && (i *= 256);) {
            this[b + h] = a / i & 255;
          }
          return b + c;
        };
        da.prototype.writeUInt8 = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 1, 255, 0);
          }
          if (!da.TYPED_ARRAY_SUPPORT) {
            a = Math.floor(a);
          }
          this[b] = a & 255;
          return b + 1;
        };
        da.prototype.writeUInt16LE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 2, 65535, 0);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a & 255;
            this[b + 1] = a >>> 8;
          } else {
            D(this, a, b, true);
          }
          return b + 2;
        };
        da.prototype.writeUInt16BE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 2, 65535, 0);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a >>> 8;
            this[b + 1] = a & 255;
          } else {
            D(this, a, b, false);
          }
          return b + 2;
        };
        da.prototype.writeUInt32LE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 4, 4294967295, 0);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b + 3] = a >>> 24;
            this[b + 2] = a >>> 16;
            this[b + 1] = a >>> 8;
            this[b] = a & 255;
          } else {
            O(this, a, b, true);
          }
          return b + 4;
        };
        da.prototype.writeUInt32BE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 4, 4294967295, 0);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a >>> 24;
            this[b + 1] = a >>> 16;
            this[b + 2] = a >>> 8;
            this[b + 3] = a & 255;
          } else {
            O(this, a, b, false);
          }
          return b + 4;
        };
        da.prototype.writeIntLE = function (a, b, c, d) {
          a = +a;
          b = b | 0;
          if (!d) {
            var e = Math.pow(2, c * 8 - 1);
            C(this, a, b, c, e - 1, -e);
          }
          var g = 0;
          var h = 1;
          var i = 0;
          for (this[b] = a & 255; ++g < c && (h *= 256);) {
            if (a < 0 && i === 0 && this[b + g - 1] !== 0) {
              i = 1;
            }
            this[b + g] = (a / h >> 0) - i & 255;
          }
          return b + c;
        };
        da.prototype.writeIntBE = function (a, b, c, d) {
          a = +a;
          b = b | 0;
          if (!d) {
            var e = Math.pow(2, c * 8 - 1);
            C(this, a, b, c, e - 1, -e);
          }
          var g = c - 1;
          var h = 1;
          var i = 0;
          for (this[b + g] = a & 255; --g >= 0 && (h *= 256);) {
            if (a < 0 && i === 0 && this[b + g + 1] !== 0) {
              i = 1;
            }
            this[b + g] = (a / h >> 0) - i & 255;
          }
          return b + c;
        };
        da.prototype.writeInt8 = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 1, 127, -128);
          }
          if (!da.TYPED_ARRAY_SUPPORT) {
            a = Math.floor(a);
          }
          if (a < 0) {
            a = 255 + a + 1;
          }
          this[b] = a & 255;
          return b + 1;
        };
        da.prototype.writeInt16LE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 2, 32767, -32768);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a & 255;
            this[b + 1] = a >>> 8;
          } else {
            D(this, a, b, true);
          }
          return b + 2;
        };
        da.prototype.writeInt16BE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 2, 32767, -32768);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a >>> 8;
            this[b + 1] = a & 255;
          } else {
            D(this, a, b, false);
          }
          return b + 2;
        };
        da.prototype.writeInt32LE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 4, 2147483647, -2147483648);
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a & 255;
            this[b + 1] = a >>> 8;
            this[b + 2] = a >>> 16;
            this[b + 3] = a >>> 24;
          } else {
            O(this, a, b, true);
          }
          return b + 4;
        };
        da.prototype.writeInt32BE = function (a, b, c) {
          a = +a;
          b = b | 0;
          if (!c) {
            C(this, a, b, 4, 2147483647, -2147483648);
          }
          if (a < 0) {
            a = 4294967295 + a + 1;
          }
          if (da.TYPED_ARRAY_SUPPORT) {
            this[b] = a >>> 24;
            this[b + 1] = a >>> 16;
            this[b + 2] = a >>> 8;
            this[b + 3] = a & 255;
          } else {
            O(this, a, b, false);
          }
          return b + 4;
        };
        da.prototype.writeFloatLE = function (a, b, c) {
          return M(this, a, b, true, c);
        };
        da.prototype.writeFloatBE = function (a, b, c) {
          return M(this, a, b, false, c);
        };
        da.prototype.writeDoubleLE = function (a, b, c) {
          return N(this, a, b, true, c);
        };
        da.prototype.writeDoubleBE = function (a, b, c) {
          return N(this, a, b, false, c);
        };
        da.prototype.copy = function (a, b, c, d) {
          c ||= 0;
          if (!d && d !== 0) {
            d = this.length;
          }
          if (b >= a.length) {
            b = a.length;
          }
          b ||= 0;
          if (d > 0 && d < c) {
            d = c;
          }
          if (d === c) {
            return 0;
          }
          if (a.length === 0 || this.length === 0) {
            return 0;
          }
          if (b < 0) {
            throw new RangeError("targetStart out of bounds");
          }
          if (c < 0 || c >= this.length) {
            throw new RangeError("sourceStart out of bounds");
          }
          if (d < 0) {
            throw new RangeError("sourceEnd out of bounds");
          }
          if (d > this.length) {
            d = this.length;
          }
          if (a.length - b < d - c) {
            d = a.length - b + c;
          }
          var f;
          var g = d - c;
          if (this === a && c < b && b < d) {
            for (f = g - 1; f >= 0; --f) {
              a[f + b] = this[f + c];
            }
          } else if (g < 1000 || !da.TYPED_ARRAY_SUPPORT) {
            for (f = 0; f < g; ++f) {
              a[f + b] = this[f + c];
            }
          } else {
            Uint8Array.prototype.set.call(a, this.subarray(c, c + g), b);
          }
          return g;
        };
        da.prototype.fill = function (a, b, c, d) {
          if (typeof a == "string") {
            if (typeof b == "string") {
              d = b;
              b = 0;
              c = this.length;
            } else if (typeof c == "string") {
              d = c;
              c = this.length;
            }
            if (a.length === 1) {
              var g = a.charCodeAt(0);
              if (g < 256) {
                a = g;
              }
            }
            if (d !== undefined && typeof d != "string") {
              throw new TypeError("encoding must be a string");
            }
            if (typeof d == "string" && !da.isEncoding(d)) {
              throw new TypeError("Unknown encoding: " + d);
            }
          } else if (typeof a == "number") {
            a = a & 255;
          }
          if (b < 0 || this.length < b || this.length < c) {
            throw new RangeError("Out of range index");
          }
          if (c <= b) {
            return this;
          }
          b >>>= 0;
          c = c === undefined ? this.length : c >>> 0;
          a ||= 0;
          var h;
          if (typeof a == "number") {
            for (h = b; h < c; ++h) {
              this[h] = a;
            }
          } else {
            var i = da.isBuffer(a) ? a : U(new da(a, d).toString());
            var f = i.length;
            for (h = 0; h < c - b; ++h) {
              this[h + b] = i[h % f];
            }
          }
          return this;
        };
        var Y = /[^+\/0-9A-Za-z-_]/g;
      }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
    }, {
      "base64-js": 30,
      ieee754: 32,
      isarray: 34
    }],
    30: [function (b, g, j) {
      "use strict";

      function k(a) {
        var b = a.length;
        if (b % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        if (a[b - 2] === "=") {
          return 2;
        } else if (a[b - 1] === "=") {
          return 1;
        } else {
          return 0;
        }
      }
      function e(a) {
        return a.length * 3 / 4 - k(a);
      }
      function i(b) {
        var d;
        var g;
        var h;
        var j;
        var l;
        var m;
        var n = b.length;
        l = k(b);
        m = new c(n * 3 / 4 - l);
        h = l > 0 ? n - 4 : n;
        var a = 0;
        d = 0;
        g = 0;
        for (; d < h; d += 4, g += 3) {
          j = q[b.charCodeAt(d)] << 18 | q[b.charCodeAt(d + 1)] << 12 | q[b.charCodeAt(d + 2)] << 6 | q[b.charCodeAt(d + 3)];
          m[a++] = j >> 16 & 255;
          m[a++] = j >> 8 & 255;
          m[a++] = j & 255;
        }
        if (l === 2) {
          j = q[b.charCodeAt(d)] << 2 | q[b.charCodeAt(d + 1)] >> 4;
          m[a++] = j & 255;
        } else if (l === 1) {
          j = q[b.charCodeAt(d)] << 10 | q[b.charCodeAt(d + 1)] << 4 | q[b.charCodeAt(d + 2)] >> 2;
          m[a++] = j >> 8 & 255;
          m[a++] = j & 255;
        }
        return m;
      }
      function m(b) {
        return a[b >> 18 & 63] + a[b >> 12 & 63] + a[b >> 6 & 63] + a[b & 63];
      }
      function n(a, b, c) {
        var d;
        var e = [];
        for (var f = b; f < c; f += 3) {
          d = (a[f] << 16) + (a[f + 1] << 8) + a[f + 2];
          e.push(m(d));
        }
        return e.join("");
      }
      function f(b) {
        var d;
        var g = b.length;
        var e = g % 3;
        var h = "";
        var j = [];
        for (var k = 16383, f = 0, l = g - e; f < l; f += k) {
          j.push(n(b, f, f + k > l ? l : f + k));
        }
        if (e === 1) {
          d = b[g - 1];
          h += a[d >> 2];
          h += a[d << 4 & 63];
          h += "==";
        } else if (e === 2) {
          d = (b[g - 2] << 8) + b[g - 1];
          h += a[d >> 10];
          h += a[d >> 4 & 63];
          h += a[d << 2 & 63];
          h += "=";
        }
        j.push(h);
        return j.join("");
      }
      j.byteLength = e;
      j.toByteArray = i;
      j.fromByteArray = f;
      var a = [];
      var q = [];
      var c = typeof Uint8Array != "undefined" ? Uint8Array : Array;
      var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (var l = 0, o = h.length; l < o; ++l) {
        a[l] = h[l];
        q[h.charCodeAt(l)] = l;
      }
      q["-".charCodeAt(0)] = 62;
      q["_".charCodeAt(0)] = 63;
    }, {}],
    31: [function (a, b, c) {
      function d() {
        if (!(this instanceof d)) {
          return new d();
        }
      }
      (function (c) {
        function d(b) {
          for (var c in a) {
            b[c] = a[c];
          }
          return b;
        }
        function e(a, b) {
          j(this, a).push(b);
          return this;
        }
        function g(a, b) {
          function c() {
            h.call(d, a, c);
            b.apply(this, arguments);
          }
          var d = this;
          c.originalListener = b;
          j(d, a).push(c);
          return d;
        }
        function h(a, b) {
          function c(a) {
            return a !== b && a.originalListener !== b;
          }
          var d;
          var e = this;
          if (arguments.length) {
            if (b) {
              if (d = j(e, a, true)) {
                d = d.filter(c);
                if (!d.length) {
                  return h.call(e, a);
                }
                e[f][a] = d;
              }
            } else {
              d = e[f];
              if (d && (delete d[a], !Object.keys(d).length)) {
                return h.call(e);
              }
            }
          } else {
            delete e[f];
          }
          return e;
        }
        function i(b, c) {
          function d(a) {
            a.call(h);
          }
          function e(a) {
            a.call(h, c);
          }
          function g(b) {
            b.apply(h, a);
          }
          var h = this;
          var i = j(h, b, true);
          if (!i) {
            return false;
          }
          var f = arguments.length;
          if (f === 1) {
            i.forEach(d);
          } else if (f === 2) {
            i.forEach(e);
          } else {
            var a = Array.prototype.slice.call(arguments, 1);
            i.forEach(g);
          }
          return !!i.length;
        }
        function j(a, b, c) {
          if (!c || a[f]) {
            var d = a[f] ||= {};
            return d[b] ||= [];
          }
        }
        if (typeof b != "undefined") {
          b.exports = c;
        }
        var f = "listeners";
        var a = {
          on: e,
          once: g,
          off: h,
          emit: i
        };
        d(c.prototype);
        c.mixin = d;
      })(d);
    }, {}],
    32: [function (a, b, c) {
      c.read = function (b, d, g, e, j) {
        var i;
        var k;
        var m = j * 8 - e - 1;
        var n = (1 << m) - 1;
        var a = n >> 1;
        var q = -7;
        var r = g ? j - 1 : 0;
        var s = g ? -1 : 1;
        var l = b[d + r];
        r += s;
        i = l & (1 << -q) - 1;
        l >>= -q;
        q += m;
        for (; q > 0; q -= 8) {
          i = i * 256 + b[d + r];
          r += s;
        }
        k = i & (1 << -q) - 1;
        i >>= -q;
        q += e;
        for (; q > 0; q -= 8) {
          k = k * 256 + b[d + r];
          r += s;
        }
        if (i === 0) {
          i = 1 - a;
        } else {
          if (i === n) {
            if (k) {
              return NaN;
            } else {
              return (l ? -1 : 1) * Infinity;
            }
          }
          k += Math.pow(2, e);
          i -= a;
        }
        return (l ? -1 : 1) * k * Math.pow(2, i - e);
      };
      c.write = function (b, g, j, e, k, m) {
        var n;
        var o;
        var q;
        var t = m * 8 - k - 1;
        var v = (1 << t) - 1;
        var c = v >> 1;
        var h = k === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var l = e ? 0 : m - 1;
        var w = e ? 1 : -1;
        var d = g < 0 || g === 0 && 1 / g < 0 ? 1 : 0;
        g = Math.abs(g);
        if (isNaN(g) || g === Infinity) {
          o = isNaN(g) ? 1 : 0;
          n = v;
        } else {
          n = Math.floor(Math.log(g) / Math.LN2);
          if (g * (q = Math.pow(2, -n)) < 1) {
            n--;
            q *= 2;
          }
          g += n + c >= 1 ? h / q : h * Math.pow(2, 1 - c);
          if (g * q >= 2) {
            n++;
            q /= 2;
          }
          if (n + c >= v) {
            o = 0;
            n = v;
          } else if (n + c >= 1) {
            o = (g * q - 1) * Math.pow(2, k);
            n += c;
          } else {
            o = g * Math.pow(2, c - 1) * Math.pow(2, k);
            n = 0;
          }
        }
        for (; k >= 8; k -= 8) {
          b[j + l] = o & 255;
          l += w;
          o /= 256;
        }
        n = n << k | o;
        t += k;
        for (; t > 0; t -= 8) {
          b[j + l] = n & 255;
          l += w;
          n /= 256;
        }
        b[j + l - w] |= d * 128;
      };
    }, {}],
    33: [function (a, b, c) {
      (function (j) {
        var k;
        var q;
        var z;
        var C;
        (function (G) {
          function e(e, g, j) {
            function m(a, b, c, d) {
              if (this instanceof m) {
                return q(this, a, b, c, d);
              } else {
                return new m(a, b, c, d);
              }
            }
            function n(a) {
              return !!a && !!a[N];
            }
            function q(b, d, f, g, h) {
              if (w && v) {
                if (d instanceof v) {
                  d = new w(d);
                }
                if (g instanceof v) {
                  g = new w(g);
                }
              }
              if (!d && !f && !g && !s) {
                b.buffer = c(y, 0);
                return;
              }
              if (!a(d, f)) {
                var j = s || Array;
                h = f;
                g = d;
                f = 0;
                d = new j(8);
              }
              b.buffer = d;
              b.offset = f |= 0;
              if (u !== typeof g) {
                if (typeof g == "string") {
                  t(d, f, g, h || 10);
                } else if (a(g, h)) {
                  o(d, f, g, h);
                } else if (typeof h == "number") {
                  B(d, f + E, g);
                  B(d, f + J, h);
                } else if (g > 0) {
                  D(d, f, g);
                } else if (g < 0) {
                  O(d, f, g);
                } else {
                  o(d, f, y, 0);
                }
              }
            }
            function t(b, c, d, e) {
              var g = 0;
              var h = d.length;
              var j = 0;
              var k = 0;
              if (d[0] === "-") {
                g++;
              }
              var l = g;
              while (g < h) {
                var a = parseInt(d[g++], e);
                if (a < 0) {
                  break;
                }
                k = k * e + a;
                j = j * e + Math.floor(k / r);
                k %= r;
              }
              if (l) {
                j = ~j;
                if (k) {
                  k = r - k;
                } else {
                  j++;
                }
              }
              B(b, c + E, j);
              B(b, c + J, k);
            }
            function z() {
              var a = this.buffer;
              var b = this.offset;
              var c = k(a, b + E);
              var d = k(a, b + J);
              if (!j) {
                c |= 0;
              }
              if (c) {
                return c * r + d;
              } else {
                return d;
              }
            }
            function A(b) {
              var c = this.buffer;
              var d = this.offset;
              var e = k(c, d + E);
              var g = k(c, d + J);
              var h = "";
              var l = !j && e & 2147483648;
              if (l) {
                e = ~e;
                g = r - g;
              }
              b = b || 10;
              while (true) {
                var m = e % b * r + g;
                e = Math.floor(e / b);
                g = Math.floor(m / b);
                h = (m % b).toString(b) + h;
                if (!e && !g) {
                  break;
                }
              }
              if (l) {
                h = "-" + h;
              }
              return h;
            }
            function B(a, b, c) {
              a[b + C] = c & 255;
              c >>= 8;
              a[b + P] = c & 255;
              c >>= 8;
              a[b + I] = c & 255;
              c >>= 8;
              a[b + K] = c & 255;
            }
            function k(a, b) {
              return a[b + K] * x + (a[b + I] << 16) + (a[b + P] << 8) + a[b + C];
            }
            var E = g ? 0 : 4;
            var J = g ? 4 : 0;
            var K = g ? 0 : 3;
            var I = g ? 1 : 2;
            var P = g ? 2 : 1;
            var C = g ? 3 : 0;
            var D = g ? h : p;
            var O = g ? l : d;
            var L = m.prototype;
            var M = "is" + e;
            var N = "_" + M;
            L.buffer = undefined;
            L.offset = 0;
            L[N] = true;
            L.toNumber = z;
            L.toString = A;
            L.toJSON = z;
            L.toArray = H;
            if (b) {
              L.toBuffer = f;
            }
            if (w) {
              L.toArrayBuffer = i;
            }
            m[M] = n;
            G[e] = m;
            return m;
          }
          function H(a) {
            var b = this.buffer;
            var d = this.offset;
            s = null;
            if (a !== false && d === 0 && b.length === 8 && m(b)) {
              return b;
            } else {
              return c(b, d);
            }
          }
          function f(a) {
            var c = this.buffer;
            var d = this.offset;
            s = b;
            if (a !== false && d === 0 && c.length === 8 && j.isBuffer(c)) {
              return c;
            }
            var e = new b(8);
            o(e, 0, c, d);
            return e;
          }
          function i(a) {
            var b = this.buffer;
            var c = this.offset;
            var d = b.buffer;
            s = w;
            if (a !== false && c === 0 && d instanceof v && d.byteLength === 8) {
              return d;
            }
            var e = new w(8);
            o(e, 0, b, c);
            return e.buffer;
          }
          function a(a, b) {
            var c = a && a.length;
            b |= 0;
            return c && b + 8 <= c && typeof a[b] != "string";
          }
          function o(a, b, c, d) {
            b |= 0;
            d |= 0;
            for (var e = 0; e < 8; e++) {
              a[b++] = c[d++] & 255;
            }
          }
          function c(a, b) {
            return Array.prototype.slice.call(a, b, b + 8);
          }
          function h(a, b, c) {
            for (var d = b + 8; d > b;) {
              a[--d] = c & 255;
              c /= 256;
            }
          }
          function l(a, b, c) {
            var d = b + 8;
            for (c++; d > b;) {
              a[--d] = -c & 255 ^ 255;
              c /= 256;
            }
          }
          function p(a, b, c) {
            for (var d = b + 8; b < d;) {
              a[b++] = c & 255;
              c /= 256;
            }
          }
          function d(a, b, c) {
            var d = b + 8;
            for (c++; b < d;) {
              a[b++] = -c & 255 ^ 255;
              c /= 256;
            }
          }
          function n(a) {
            return !!a && Object.prototype.toString.call(a) == "[object Array]";
          }
          var s;
          var u = "undefined";
          var b = u !== typeof j && j;
          var w = u !== typeof Uint8Array && Uint8Array;
          var v = u !== typeof ArrayBuffer && ArrayBuffer;
          var y = [0, 0, 0, 0, 0, 0, 0, 0];
          var m = Array.isArray || n;
          var r = 4294967296;
          var x = 16777216;
          k = e("Uint64BE", true, true);
          q = e("Int64BE", true, false);
          z = e("Uint64LE", false, true);
          C = e("Int64LE", false, false);
        })(typeof c == "object" && typeof c.nodeName != "string" ? c : this || {});
      }).call(this, a("buffer").Buffer);
    }, {
      buffer: 29
    }],
    34: [function (a, b, c) {
      var d = {}.toString;
      b.exports = Array.isArray || function (a) {
        return d.call(a) == "[object Array]";
      };
    }, {}]
  }, {}, [1])(1);
});
    let styleItem = document.createElement("style");
    styleItem.type = "text/css";
    styleItem.appendChild(document.createTextNode(`
        #suggestBox {
            width: 230px;
            border-radius: 3px;
            background-color: rgba(0,0,0,0.5);
            margin: auto;
            text-align: left;
            z-index: 49;
            pointer-events: auto;
            position: relative;
            bottom: 3.5px;
            overflow-y: auto;
        }
        #suggestBox div {
            background-color: rgba(255,255,255,0);
            color: rgba(255,255,255,1);
            transition: background-color 0.3s, color 0.3s;
        }
        #suggestBox div:hover {
            background-color: rgba(255,255,255,0.2);
            color: rgba(0,0,0,1);
        }
        .suggestBoxHard {
            color: rgba(255,255,255,1);
            font-size: 18px;
        }
        .suggestBoxLight {
            color: rgba(255,255,255,0.7);
            font-size: 18px;
        }
    `));
    document.head.appendChild(styleItem);
function fpsbooster() {
    console.clear();
}
setInterval(fpsbooster, 250);
let messageCount = 0;
let chatLogsDiv = document.createElement('div');
chatLogsDiv.id = "chatLogs";
document.body.appendChild(chatLogsDiv);
function setChatLogsStyle() {
  chatLogsDiv.style = `
    height: 150px;
    width: 300px;
    max-width: 100%;
    display: none;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    position: absolute;
    font-size: 18px;
    color: #fff;
    left: 10px;
    top: 350px;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    text-align: left;
  `;
  chatLogsDiv.style.cssText += `
    &::-webkit-scrollbar {
      display: none;
    }
  `;
}

setChatLogsStyle();
function addChatEntry(message, color) {
  let chatEntryDiv = document.createElement("div");
  chatEntryDiv.className = 'chatEntry';
  let timestampSpan = document.createElement('span');
  timestampSpan.style.color = "rgba(255, 255, 255, 0.5)";
   timestampSpan.innerText = getTimeStamp() + " [Atm]:" + " ";
   chatEntryDiv.appendChild(timestampSpan);
   let messageSpan = document.createElement('span');
   messageSpan.style.color = color;
   messageSpan.innerText = message;
   chatEntryDiv.appendChild(messageSpan);
   chatLogsDiv.appendChild(chatEntryDiv);
   chatLogsDiv.scrollTop = chatLogsDiv.scrollHeight;
   messageCount++;
   if (messageCount > 100) {
       clearChatLog();
       messageCount = 1;
   }
}
function getTimeStamp() {
   const now = new Date();
   const hours = now.getHours();
   const minutes = now.getMinutes();
   const amOrPm = hours >= 12 ? 'PM' : 'AM';
   const formattedHours = (hours % 12 || 12).toString();
   const formattedMinutes = minutes.toString().padStart(2, '0');
   return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}
function addSystemMessage(message) {
   let systemMessageDiv = document.createElement("div");
   systemMessageDiv.className = "chatEntry";
   let timestampSpan = document.createElement("span");
   timestampSpan.style.color = "rgba(255, 255, 255, 0.5)";
   timestampSpan.innerText = getTimeStamp() + " ";
   systemMessageDiv.appendChild(timestampSpan);
   let messageSpan = document.createElement("span");
   messageSpan.style.color = "#fff";
   messageSpan.innerText = "[Atm]: " + message;
   systemMessageDiv.appendChild(messageSpan);
   chatLogsDiv.appendChild(systemMessageDiv);
   chatLogsDiv.scrollTop = chatLogsDiv.scrollHeight;
   messageCount++;
   if (messageCount > 100) {
       clearChatLog();
       messageCount = 1;
   }
}function msgwarner(message) {
  let WarnsMessageDiv = document.createElement("div");
  WarnsMessageDiv.className = "chatEntry";
  let timestampSpan = document.createElement("span");
  timestampSpan.style.color = "rgba(255, 255, 255, 0.5)";
  timestampSpan.innerText = getTimeStamp() + " ";
  WarnsMessageDiv.appendChild(timestampSpan);
  let messageSpan = document.createElement("span");
  messageSpan.style.color = "#ff9999";
  messageSpan.innerText = "Warning: " + message;
  WarnsMessageDiv.appendChild(messageSpan);
  chatLogsDiv.appendChild(WarnsMessageDiv);
  chatLogsDiv.scrollTop = chatLogsDiv.scrollHeight;
   messageCount++;
   if (messageCount > 100) {
       clearChatLog();
       messageCount = 1;
   }
}
function killChat(message) {
  let WarnsMessageDiv = document.createElement("div");
  WarnsMessageDiv.className = "chatEntry";
  let timestampSpan = document.createElement("span");
  timestampSpan.style.color = "rgba(255, 255, 255, 0.5)";
  timestampSpan.innerText = getTimeStamp() + " ";
  WarnsMessageDiv.appendChild(timestampSpan);
  let messageSpan = document.createElement("span");
  messageSpan.style.color = "#1b85ee";
  messageSpan.innerText = "Kills: " + message;
  WarnsMessageDiv.appendChild(messageSpan);
  chatLogsDiv.appendChild(WarnsMessageDiv);
  chatLogsDiv.scrollTop = chatLogsDiv.scrollHeight;
   messageCount++;
   if (messageCount > 100) {
       clearChatLog();
       messageCount = 1;
   }
}
function clearChatLog() {
   chatLogsDiv.innerHTML = '';
}
addSystemMessage("Welcome Atm User, press ` to toggle DevLog");
addSystemMessage("Discord: uzi.wupi");
document.addEventListener('keydown', function(event) {
  if (event.key === '`') {
    if (enemyData.style.display === 'none') {
      enemyData.style.display = 'block';
      //mapDisplay.style.display = 'none';
      //scoreDisplay.style.display = 'none';
    } else {
      enemyData.style.display = 'none';
      //mapDisplay.style.display = 'block';
      //scoreDisplay.style.display = 'block';
    }
  }
});
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    if (leaderboard.style.display === 'none') {
      leaderboard.style.display = 'block';
      storeButton.style.display = 'block';
      allianceButton.style.display = 'block';
      //mapDisplay.style.display = 'none';
      //scoreDisplay.style.display = 'none';
    } else {
      leaderboard.style.display = 'none';
      storeButton.style.display = 'none';
      allianceButton.style.display = 'none';
      //mapDisplay.style.display = 'block';
      //scoreDisplay.style.display = 'block';
    }
  }
});
function pingWarn() {
}
setInterval(function() {
    if (window.pingTime > 120) {
        msgwarner('High Ping Detected. Ping Is '+ window.pingTime +'.');
    }
}, 2000);
let inantiantibull = false;
let randomNumber = Math.floor(1000 + Math.random() * 9000);
let randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
let jadinabad = randomNumber.toString() + randomLetter;
setTimeout(() => {
    document.getElementById('loadingText').innerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loading Screen</title>
<style>
  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
  }
.loader {
  border: 8px solid gray;
  border-top: 8px solid #656569;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: border 1s, border-top 1s;
}

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
</head>
<body>
  <div class="loader"></div>
</body>
</html>
`;
}, 20);
function onBoxMouseOver() {
    this.style.transform = 'scale(1.1)';
    this.style.borderRadius = '10px';
    this.style.boxShadow = '0 0 0 1px #0c3fcc';
}
function onBoxMouseLeave() {
    this.style.transform = 'scale(1)';
    this.style.borderRadius = '10px';
    this.style.boxShadow = 'none';
}
function onEnterGameMouseOver() {
    const enterGameBox = document.getElementById('enterGame');
    enterGameBox.style.transform = 'scale(1.05)';
    enterGameBox.style.backgroundColor = 'rgb(255,255,255,.3))';
    enterGameBox.style.borderRadius = '20px';
    enterGameBox.style.transition = 'all 0.5s ease-in-out';
}
function onEnterGameMouseLeave() {
    const enterGameBox = document.getElementById('enterGame');
    enterGameBox.style.transform = 'scale(1)';
    enterGameBox.style.backgroundColor = 'rgb(255,255,255,.3)';
    enterGameBox.style.borderRadius = '10px';
    enterGameBox.style.transition = 'all 0.5s ease-in-out';
}
let menuLink = document.querySelector('.menuLink');
let menuText = document.querySelector('.menuText');
let DeskTopInstructions = document.getElementById("desktopInstructions");
let discordUser = localStorage.getItem('user');
if(menuText) {
    menuText.textContent = "Your Discord User: " + discordUser + "\nSession Id: " + jadinabad;
}
let skinColorHolder = document.getElementById('skinColorHolder');
skinColorHolder.style.marginBottom = '15px';
if(DeskTopInstructions) {
    DeskTopInstructions.textContent = 'Function:'
}
if (menuLink) {
    menuLink.href = 'https://discord.gg/APq8J4cyvb';
    menuLink.textContent = 'Uzi';
}
const boxes = document.querySelectorAll('.menuCard');
boxes.forEach(box => {
    box.style.transition = 'transform 0.5s ease';
    box.addEventListener('mouseenter', onBoxMouseOver);
    box.addEventListener('mouseleave', onBoxMouseLeave);
});
let hideSelectors = [
    '.menuHeader',
]
for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}
const enterGameBox = document.getElementById('enterGame');
enterGameBox.addEventListener('mouseenter', onEnterGameMouseOver);
enterGameBox.addEventListener('mouseleave', onEnterGameMouseLeave);
$('.menuCard').css({
    'white-space': 'normal',
    'text-align': 'center',
    'background-color': 'rgb(255,255,255,.3)',
    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
    '-webkit-border-radius': '10px',
    '-moz-border-radius': '10px',
    'border-radius': '10px',
    'margin': '15px',
    'margin-top': '15px',
});
let firstCheckbox = document.getElementById('nativeResolution');
let lineBreak1 = document.createElement('br');
let newContainer = document.createElement('div');
newContainer.classList.add('newCheckboxContainer');
newContainer.style.marginBottom = '10px';
firstCheckbox.parentNode.insertBefore(newContainer, firstCheckbox);
$('#gameName').css({
    'color': 'rgb(255,255,255,.3)',
    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
    'text-align': 'center',
    'font-size': '156px',
    'margin-bottom': '-30px',
    'border-radius': '10px',
});
function pageoff() {
    document.body.style.pointerEvents = 'none';
}
function pageon() {
    document.body.style.pointerEvents = 'auto';
}
    /*function isscriptenabled() {
        return new Promise((resolve, reject) => {
            fetch('https://exclusive-nine-hubcap.glitch.me/script-status')
                .then(response => response.json())
                .then(data => {
                    resolve(data.enabled);
                })
                .catch(error => {
                    console.error('Error fetching script status:', error);
                    reject(error);
                });
        });
    }
    async function main() {
        try {
            const scriptEnabled = await isscriptenabled();
            if (scriptEnabled) {
                console.log('Script good.');
            } else {
                console.log('Script unable.');
                pageoff();
                alert('atm its disabled');
                prompt('atm its disabled');
      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
                      alert('atm its disabled');
                prompt('atm its disabled');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        main();
    }
    main();*/
function remValue(name) {
    return localStorage.removeItem(name);
};
function getValue(name) {
    return localStorage.getItem(name);
    return null;
};
function setValue(name, data) {
    return localStorage.setItem(name, data);
};
getValue("clearedStorage") == undefined && setValue("clearedStorage", false);
if (getValue("clearedStorage") == "false") {
    let clear = window.confirm("Clear Storage?");
    if (clear == true) {
        localStorage.clear();
    }
    setValue("clearedStorage", true);
}
/*let arraylist = true;
function arrayList() {
    if (!arraylist) {
        const verticalMenu = document.getElementById('verticalMenu');
        if (verticalMenu) {
            verticalMenu.classList.remove('visible');
        }
        return;
    }
    const menuItemsData = [
        { label: 'PrePlace', enabled: settings.preplace.enabled },
        //{ label: 'ArrayList', enabled: arraylist },
        { label: 'AutoPlace', enabled: settigs.autoplace.enabled },
        { label: 'AutoRespawn', enabled: settings.autorespawn.enabled },
        { label: 'DamageText', enabled: settings.dmgtext.enabled },
        { label: 'AutoUpgrade', enabled: settings.autoupg.enabled },
        { label: 'AutoGrind', enabled: settings.autogrind.enabled },
        { label: 'AutoQ', enabled: settings.autoq.enabled },
        //{ label: 'BuildHealth', enabled: getEl("buildhp").checked },
    ];
    let menuHTML = '';
    const activeModules = menuItemsData.filter(e => e.enabled == true);
    for (let i = 0; i < activeModules.length; i++) {
        let item = activeModules[i];
        menuHTML += `<span class="enabled">${item.label}</span><br>`;
    }
    const verticalMenu = document.getElementById('verticalMenu');
    if (verticalMenu) {
        verticalMenu.innerHTML = menuHTML;
        setTimeout(() => {
            verticalMenu.classList.add('visible');
        }, 50);
    } else {
        const newVerticalMenu = document.createElement('div');
        newVerticalMenu.id = 'verticalMenu';
        newVerticalMenu.innerHTML = menuHTML;
        document.body.insertAdjacentElement('afterbegin', newVerticalMenu);
        setTimeout(() => {
            newVerticalMenu.classList.add('visible');
        }, 50);
    }
    const styleCSS = `
        #verticalMenu {
            position: fixed;
            top: 550px;
            left: 20px;
            background-color: rgba(51, 51, 51, 0);
            padding: 0px;
            color: lime;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #verticalMenu.visible {
            opacity: 1;
            transform: translateY(0);
        }
        #verticalMenu > span {
            display: block;
            margin: 0px;
        }
        #verticalMenu > span.enabled {
            color: white;
        }
        #verticalMenu > span.disabled {
            color: red;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = styleCSS;
    document.head.appendChild(styleElement);
}

arrayList();
setInterval(arrayList, 500);*/
const removeSnowflakes = () => {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => {
        snowflake.parentNode.removeChild(snowflake);
    });
};
const createSnowflake = function () {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.style.position = "absolute";
    snowflake.style.width = "10px";
    snowflake.style.height = "10px";
    snowflake.style.background = "#fff";
    snowflake.style.borderRadius = "50%";
    snowflake.style.zIndex = "9998";
    snowflake.style.opacity = Math.random();
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
    snowflake.addEventListener("animationiteration", function () {
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.opacity = Math.random();
    });
    return snowflake;
};
const styleSnowflakes = document.createElement("style");
styleSnowflakes.textContent = `
    @keyframes fall {
        0% { transform: translateY(-10vh); opacity: 1; }
        100% { transform: translateY(110vh); opacity: 0; }
    }
    .fast-fall { animation-duration: ${Math.random() * 1 + 1}s; }
`;
document.head.appendChild(styleSnowflakes);
const snowflakeContainer = document.createElement("div");
snowflakeContainer.style.position = "absolute";
snowflakeContainer.style.top = "0";
snowflakeContainer.style.left = "0";
snowflakeContainer.style.width = "100%";
snowflakeContainer.style.height = "100%";
snowflakeContainer.style.pointerEvents = "none";
snowflakeContainer.style.zIndex = "9998";
document.body.appendChild(snowflakeContainer);
const maxSnowflakes = 40;
let snowing = true;
const toggleSnow = () => {
    if (snowing) {
        removeSnowflakes();
        snowing = false;
    } else {
        for (let i = 0; i < maxSnowflakes; i++) {
            const snowflake = createSnowflake();
            if (Math.random() > 0.7) {
                snowflake.classList.add("fast-fall");
            }
            snowflakeContainer.appendChild(snowflake);
        }
        snowing = true;
    }
};
window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        toggleSnow();
    }
});
toggleSnow();
let playerReplace = false;
let replacing = false;
window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
    }
});
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        //$('#modMenus').toggle();
    };
});

// menu html
$("body").append(`
  <style>
    #modMenus:hover {
      filter: none;
    }
    .tab {
      margin-right: 5px;
    }
  </style>
  <div id="modMenus"
    style="display: none;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    position: absolute;
    left: 10px;
    top: 10px;
    min-width: 280px;
    max-width: 300px;
    overflow-y: scroll;
    max-height: 150px;">
    <div id="tabs"></div>`);
const menuss = `
  <div id="page1" class="menuPage">
    <div style="font-size: 30px; color: rgb(255, 255, 255);">
      <script>
        function toggleUI() {
          $("#gameUI").toggle();
        }
      </script>
      Combat:
      <div style="font-size: 13px;">
        Antibull Module:
        <select id="antiBullType">
          <option value="noab">Disabled</option>
          <option value="Enabled">Enabled</option>
          <option value="PAB">Predictive</option>
        </select>
        <br>
        Change Your AntiBull Type.
        <br>
        Note: The lower the value the faster the heal gets.
        <br>
        PvP Bot (beta) <input type="checkbox" id="pvpbot">
        <br>
        Auto-Player Finder (beta) <input type="checkbox" id="randomdi">
        <br>
        DoTryHardMode? <input type="checkbox" id="dotryhard">
        <br>
        Auto-Place <input type="checkbox" checked id="autoplace">
        <br>
        Auto-Replace <input type="checkbox" checked id="autoreplace">
        <br>
        Backup-AntiSpikeTick <input type="checkbox" id="antitickbackup">
        <br>
        Anti-Trap <input type="checkbox" checked id="antitrap">
        <br>
        AutoBullSpam <input type="checkbox" id="autobs">
        <br>
        SafeWalk/AvoidSpike <input type="checkbox" id="antispike">
        <br>
        AutoSpikeTick <input type="checkbox" checked id="spiketick">
        <br>
        Reverse Insta <input type="checkbox" id="revinsta">
        <br>
        AutoGrind <input type="checkbox" id="autogrind">
        <br>
        Auto-Preplace <input type="checkbox" checked id="preplacer">
        <br>
        AutoQ (Fast Clown) <input type="checkbox" id="autoq">
        <br>
        AutoPush <input type="checkbox" checked id="autopush">
        <br>
        PathFind For AutoPush <input type="checkbox" checked id="pathfind">
        <br>
        Team-Sync <input type="checkbox" checked id="teamsync">
        <br>
      </div>
    </div>
  </div>
  <div id="page2" class="menuPage">
    <div style="font-size: 30px; color: rgb(255, 255, 255);">
      <script>
        function toggleUI() {
          $("#gameUI").toggle();
        }
      </script>
      Settings/Misc:
      <br>
      <div style="font-size: 13px;">
       <div id="jadinabad">Session Id: </div>
        Camera Type:
        <select id="cameraType">
        <option value="ez">Auto-Zoom</option>
        <option value="3">Smooth</option>
        <option value="4">Normal</option>
         <option value="1">Follow Mouse</option>
         <option value="2">Still</option>
        </select>
        <br>
        Mouse Type:
        <select id="mouse">
         <option value="toggle">Toggle</option>
         <option value="hold">Hold</option>
        </select>
        <br>
        Module Type:
        <select id="moduleType">
          <option value="ez">Uzi</option>
          <option value="syrup">Honey Syrup</option>
          <option value="9mm">9mm</option>
          <option value="sclient">S Client</option>
          <option value="ass">None</option>
        </select>
        <br>
        AutoBuy <input type="checkbox" checked id="autobuy">
        <br>
        Slow-Ot <input type="checkbox" checked id="slowot">
        <br>
        360 Spin <input type="checkbox" id="360spin">
        <br>
        Placement Indicator <input type="checkbox" checked id="predicplace">
        <br>
        Build Health <input type="checkbox" id="buildhp">
        <br>
        Smart AutoUpgrade <input type="checkbox" checked id="autoupg">
        <br>
        KillSound <input type="checkbox" id="killsound">
        <br>
        Show Damage Text <input type="checkbox" checked id="dmgtext">
        <br>
        Auto Respawn <input type="checkbox" id="autorespawn">
        <br>
      </div>
    </div>
  </div>
  <div id="page3" class="menuPage">
    <div style="font-size: 30px; color: rgb(255, 255, 255);">
      <script>
        function toggleUI() {
          $("#gameUI").toggle();
        }
      </script>
      Controls:
      <br>
      <div style="font-size: 13px;">
        Discord: uzi.plushy
        <br>
        F = Traps
        <br>
        Q = Auto Heal (fast clown)
        <br>
        Scroll Up/Down = Zoom
        <br>
        Left Click = Toggle Combat Click
        <br>
        Right Click = Toggle Tank Hit
        <br>
        Hold SpaceBar = Bull Spam
        <br>
        V = Auto Spike
        <br>
        Z = Auto Mills
        <br>
        b = Team Sync
        <br>
        Tab = Snow Flakes
        <br>
        R = Auto-Insta
        <br>
        C = Moosic
        <br>
        Hold G = Bow Insta
        <br>
        Hold T = One Tick
        <br>
        Hold . = Boost One Tick
        <br>
        <br>
        <br>
        Notes:
        <br>
        TryhardMode is made for 2v1s or more.
        <br>
        If Heal Randomly Stops Press "q" and it should not healing.
        <br>
        <br>
        To Debug do Shift + Z
        <br>
        <br>
        If AutoPush Randomly Bugs, Disable it and reenable it.
        <br>
        <br>
        If Atm randomly spams packets, disable antibull, if it still packet spams contact me, discord: uzi.wupi
        <br>
        <br>
        Atm is insanely optmized, anti-insta is perfect and will auto adjust depending on ur ping so no need to use autoq (unless u got 100+ ms).
        <br>
      </div>
    </div>
  </div>
`;
$("#modMenus").append(menuss);
const menuPages = $(".menuPage");
let currentPageIndex = 0;
function showPage(pageIndex) {
  menuPages.hide();
  menuPages.eq(pageIndex).show();
}
$("#modMenus").append('<div id="tabs"></div>');
const tabNames = ["Home", "Settings", "Controls"];
for (let i = 0; i < menuPages.length; i++) {
  $("#tabs").append(`<button class="tab" data-index="${i}">${tabNames[i]}</button>`);
}

$(".tab").on("click", function() {
  currentPageIndex = $(this).data("index");
  showPage(currentPageIndex);
});
showPage(currentPageIndex);
function atmbutton(buttonId, checkboxId) {
  const setting = $(`#${checkboxId}`);
  const button = $(`#${buttonId}`);
  const isChecked = setting.prop("checked");
  setting.prop("checked", !isChecked);
  button.text(isChecked ? "Disabled" : "Enabled");
  button.css("background-color", isChecked ? "red" : "#8ecc51");
}
$("#modMenus input[type='checkbox']").each(function() {
  const checkboxId = $(this).attr("id");
  $(this).hide();
  const buttonId = `${checkboxId}Button`;
  const isChecked = $(this).prop("checked");
  $(this).after(`<button id="${buttonId}">${isChecked ? "Enabled" : "Disabled"}</button>`);
  $(`#${buttonId}`).css("background-color", isChecked ? "#8ecc51" : "red");
  $(`#${buttonId}`).on("click", function() {
    atmbutton(buttonId, checkboxId);
  });
});
let checkIfReplacing = false;
let log = console.log;
function toggleDisplay() {
    if (modMenus6.style.display === "none") {
        modMenus6.style.display = "block";
    } else {
        modMenus6.style.display = "none";
    }
}
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        toggleDisplay();
    }
});
function getEl(id) {
    return document.getElementById(id);
}
var modMenus6 = document.createElement("div");
modMenus6.id = "modMenus6";
document.body.append(modMenus6);
modMenus6.style.display = "block";
modMenus6.style = `
display: block;
text-align: left;
padding: 10px;
background-color: transparent;
color: white;
position: absolute;
left: 10px;
top: 20px;
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
}
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
}
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
width: 10px;
height: 7;
transition: 2s;
overflow: auto;
`;
function updateInnerHTML() {
    modMenus6.innerHTML = `
    <style>
    .sizing {
                    font-size: 15px;
                }
                .mod {
                    font-size: 15px;
                    display: inline-block;
                }
                .augh {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh1 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh2 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh3 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh4 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh5 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh6 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh7 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh8 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh9 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh:active {
                    background-color: green;
                }
               <style>
               .augh {
                 cursor: grab;
               }
                .augh1:active {
                    background-color: green;
                }
               <style>
               .augh1 {
                 cursor: grab;
               }
                .augh2:active {
                    background-color: green;
                }
               <style>
               .augh2 {
                 cursor: grab;
               }
                .augh3:active {
                    background-color: green;
                }
               <style>
               .augh3 {
                 cursor: grab;
               }
                .augh4:active {
                    background-color: green;
                }
               <style>
               .augh4 {
                 cursor: grab;
               }
                .augh5:active {
                    background-color: green;
                }
               <style>
               .augh5 {
                 cursor: grab;
               }
                .augh6:active {
                    background-color: green;
                }
               <style>
               .augh6 {
                 cursor: grab;
               }
                .augh7:active {
                    background-color: green;
                }
               <style>
               .augh7 {
                 cursor: grab;
               }
                .augh8:active {
                    background-color: green;
                }
               <style>
               .augh8 {
                 cursor: grab;
               }
                .augh9:active {
                    background-color: green;
                }
               <style>
               .augh9 {
                 cursor: grab;
               }
</style>


<div style = "display: block">
<div id = "hatdisp22" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_22.png);"></div>
<div id = "hatdisp7" class = "augh1" style = "background-image: url(https://moomoo.io/img/hats/hat_7.png);"></div>
<div id = "hatdisp6" class = "augh2" style = "background-image: url(https://moomoo.io/img/hats/hat_6.png);"></div>
<div id = "hatdisp40" class = "augh3" style = "background-image: url(https://moomoo.io/img/hats/hat_40.png);"></div>
<div id = "hatdisp21" class = "augh4" style = "background-image: url(https://moomoo.io/img/hats/hat_31.png);"></div>
<div style = "display: block">
<div id = "hatdisp12" class = "augh5" style = "background-image: url(https://moomoo.io/img/hats/hat_15.png);"></div>
<div id = "accdisp19" class = "augh7" style = "background-image: url(https://moomoo.io/img/hats/hat_53.png);"></div>
<div id = "hatdisp56" class = "augh6" style = "background-image: url(http://moomoo.io/img/accessories/access_11.png)"></div>
<div id = "accdisp18" class = "augh8" style = "background-image: url(http://moomoo.io/img/accessories/access_18.png);"></div>
<div id = "accdisp21" class = "augh9" style = "background-image: url(http://moomoo.io/img/accessories/access_21.png);"></div>
</div>
`;
}
var EasyStar = function(e) {
    var o = {};

    function r(t) {
        if (o[t]) return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = o, r.d = function(t, n, e) {
        r.o(t, n) || Object.defineProperty(t, n, {
            enumerable: !0,
            get: e
        })
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, r.t = function(n, t) {
        if (1 & t && (n = r(n)), 8 & t) return n;
        if (4 & t && "object" == typeof n && n && n.__esModule) return n;
        var e = Object.create(null);
        if (r.r(e), Object.defineProperty(e, "default", {
                enumerable: !0,
                value: n
            }), 2 & t && "string" != typeof n)
            for (var o in n) r.d(e, o, function(t) {
                return n[t]
            }.bind(null, o));
        return e
    }, r.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return r.d(n, "a", n), n
    }, r.o = function(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n)
    }, r.p = "/bin/", r(r.s = 0)
}([function(t, n, e) {
    var P = {},
        M = e(1),
        _ = e(2),
        A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function() {
        var c, i, f, s = 1.4,
            p = !1,
            u = {},
            o = {},
            r = {},
            l = {},
            a = !0,
            h = {},
            d = [],
            y = Number.MAX_VALUE,
            v = !1;
        this.setAcceptableTiles = function(t) {
            t instanceof Array ? f = t : !isNaN(parseFloat(t)) && isFinite(t) && (f = [t])
        }, this.enableSync = function() {
            p = !0
        }, this.disableSync = function() {
            p = !1
        }, this.enableDiagonals = function() {
            v = !0
        }, this.disableDiagonals = function() {
            v = !1
        }, this.setGrid = function(t) {
            c = t;
            for (var n = 0; n < c.length; n++)
                for (var e = 0; e < c[0].length; e++) o[c[n][e]] || (o[c[n][e]] = 1)
        }, this.setTileCost = function(t, n) {
            o[t] = n
        }, this.setAdditionalPointCost = function(t, n, e) {
            void 0 === r[n] && (r[n] = {}), r[n][t] = e
        }, this.removeAdditionalPointCost = function(t, n) {
            void 0 !== r[n] && delete r[n][t]
        }, this.removeAllAdditionalPointCosts = function() {
            r = {}
        }, this.setDirectionalCondition = function(t, n, e) {
            void 0 === l[n] && (l[n] = {}), l[n][t] = e
        }, this.removeAllDirectionalConditions = function() {
            l = {}
        }, this.setIterationsPerCalculation = function(t) {
            y = t
        }, this.avoidAdditionalPoint = function(t, n) {
            void 0 === u[n] && (u[n] = {}), u[n][t] = 1
        }, this.stopAvoidingAdditionalPoint = function(t, n) {
            void 0 !== u[n] && delete u[n][t]
        }, this.enableCornerCutting = function() {
            a = !0
        }, this.disableCornerCutting = function() {
            a = !1
        }, this.stopAvoidingAllAdditionalPoints = function() {
            u = {}
        }, this.findPath = function(t, n, e, o, r) {
            function i(t) {
                p ? r(t) : setTimeout(function() {
                    r(t)
                })
            }
            if (void 0 === f) throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            if (void 0 === c) throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1) throw new Error("Your start or end point is outside the scope of your grid.");
            if (t !== e || n !== o) {
                for (var s = c[o][e], u = !1, l = 0; l < f.length; l++)
                    if (s === f[l]) {
                        u = !0;
                        break
                    } if (!1 !== u) {
                    var a = new M;
                    a.openList = new A(function(t, n) {
                        return t.bestGuessDistance() - n.bestGuessDistance()
                    }), a.isDoneCalculating = !1, a.nodeHash = {}, a.startX = t, a.startY = n, a.endX = e, a.endY = o, a.callback = i, a.openList.push(O(a, a.startX, a.startY, null, 1));
                    o = E++;
                    return h[o] = a, d.push(o), o
                }
                i(null)
            } else i([])
        }, this.cancelPath = function(t) {
            return t in h && (delete h[t], !0)
        }, this.calculate = function() {
    if (d.length === 0 || c === undefined || f === undefined) return;
    for (let i = 0; i < y; i++) {
        if (d.length === 0) return;
        if (p) i = 0;
        const t = d[0];
        const n = h[t];
        if (n !== undefined) {
            if (n.openList.size() !== 0) {
                const e = n.openList.pop();

                if (n.endX !== e.x || n.endY !== e.y) {
                    if (e.y > 0) T(n, e, 0, -1, b(e.x, e.y - 1));
                    if (e.x < c[0].length - 1) T(n, e, 1, 0, b(e.x + 1, e.y));
                    if (e.y < c.length - 1) T(n, e, 0, 1, b(e.x, e.y + 1));
                    if (e.x > 0) T(n, e, -1, 0, b(e.x - 1, e.y));

                    if (v) {
                        if (e.x > 0 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e))) {
                            T(n, e, -1, -1, s * b(e.x - 1, e.y - 1));
                        }
                        if (e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e))) {
                            T(n, e, 1, 1, s * b(e.x + 1, e.y + 1));
                        }
                        if (e.x < c[0].length - 1 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e))) {
                            T(n, e, 1, -1, s * b(e.x + 1, e.y - 1));
                        }
                        if (e.x > 0 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e))) {
                            T(n, e, -1, 1, s * b(e.x - 1, e.y + 1));
                        }
                    }
                } else {
                    const o = [];
                    o.push({ x: e.x, y: e.y });
                    let r = e.parent;
                    while (r !== null) {
                        o.push({ x: r.x, y: r.y });
                        r = r.parent;
                    }
                    o.reverse();
                    n.callback(o);
                    delete h[t];
                    d.shift();
                }
            } else {
                n.callback(null);
                delete h[t];
                d.shift();
            }
        } else {
            d.shift();
        }
    }
};
        var T = function(t, n, e, o, r) {
                e = n.x + e, o = n.y + o;
                void 0 !== u[o] && void 0 !== u[o][e] || !g(c, f, e, o, n) || (void 0 === (o = O(t, e, o, n, r)).list ? (o.list = 1, t.openList.push(o)) : n.costSoFar + r < o.costSoFar && (o.costSoFar = n.costSoFar + r, o.parent = n, t.openList.updateItem(o)))
            },
            g = function(t, n, e, o, r) {
                var i = l[o] && l[o][e];
                if (i) {
                    var s = x(r.x - e, r.y - o);
                    if (! function() {
                            for (var t = 0; t < i.length; t++)
                                if (i[t] === s) return !0;
                            return !1
                        }()) return !1
                }
                for (var u = 0; u < n.length; u++)
                    if (t[o][e] === n[u]) return !0;
                return !1
            },
            x = function(t, n) {
                if (0 === t && -1 === n) return P.TOP;
                if (1 === t && -1 === n) return P.TOP_RIGHT;
                if (1 === t && 0 === n) return P.RIGHT;
                if (1 === t && 1 === n) return P.BOTTOM_RIGHT;
                if (0 === t && 1 === n) return P.BOTTOM;
                if (-1 === t && 1 === n) return P.BOTTOM_LEFT;
                if (-1 === t && 0 === n) return P.LEFT;
                if (-1 === t && -1 === n) return P.TOP_LEFT;
                throw new Error("These differences are not valid: " + t + ", " + n)
            },
            b = function(t, n) {
                return r[n] && r[n][t] || o[c[n][t]]
            },
            O = function(t, n, e, o, r) {
                if (void 0 !== t.nodeHash[e]) {
                    if (void 0 !== t.nodeHash[e][n]) return t.nodeHash[e][n]
                } else t.nodeHash[e] = {};
                var i = m(n, e, t.endX, t.endY),
                    r = null !== o ? o.costSoFar + r : 0,
                    i = new _(o, n, e, r, i);
                return t.nodeHash[e][n] = i
            },
            m = function(t, n, e, o) {
                var r, i;
                return v ? (r = Math.abs(t - e)) < (i = Math.abs(n - o)) ? s * r + i : s * i + r : (r = Math.abs(t - e)) + (i = Math.abs(n - o))
            }
    }, P.TOP = "TOP", P.TOP_RIGHT = "TOP_RIGHT", P.RIGHT = "RIGHT", P.BOTTOM_RIGHT = "BOTTOM_RIGHT", P.BOTTOM = "BOTTOM", P.BOTTOM_LEFT = "BOTTOM_LEFT", P.LEFT = "LEFT", P.TOP_LEFT = "TOP_LEFT"
}, function(t, n) {
    t.exports = function() {
        this.pointsToAvoid = {}, this.startX, this.callback, this.startY, this.endX, this.endY, this.nodeHash = {}, this.openList
    }
}, function(t, n) {
    t.exports = function(t, n, e, o, r) {
        this.parent = t, this.x = n, this.y = e, this.costSoFar = o, this.simpleDistanceToTarget = r, this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget
        }
    }
}, function(t, n, e) {
    t.exports = e(4)
}, function(u, T, t) {
    var g, x;
    (function() {
        var t, p, l, h, d, n, a, e, y, v, o, r, i, c, f;

        function s(t) {
            this.cmp = null != t ? t : p, this.nodes = []
        }
        l = Math.floor, v = Math.min, p = function(t, n) {
            return t < n ? -1 : n < t ? 1 : 0
        }, y = function(t, n, e, o, r) {
            var i;
            if (null == e && (e = 0), null == r && (r = p), e < 0) throw new Error("lo must be non-negative");
            for (null == o && (o = t.length); e < o;) r(n, t[i = l((e + o) / 2)]) < 0 ? o = i : e = i + 1;
            return [].splice.apply(t, [e, e - e].concat(n)), n
        }, n = function(t, n, e) {
            return null == e && (e = p), t.push(n), c(t, 0, t.length - 1, e)
        }, d = function(t, n) {
            var e, o;
            return null == n && (n = p), e = t.pop(), t.length ? (o = t[0], t[0] = e, f(t, 0, n)) : o = e, o
        }, e = function(t, n, e) {
            var o;
            return null == e && (e = p), o = t[0], t[0] = n, f(t, 0, e), o
        }, a = function(t, n, e) {
            var o;
            return null == e && (e = p), t.length && e(t[0], n) < 0 && (n = (o = [t[0], n])[0], t[0] = o[1], f(t, 0, e)), n
        }, h = function(e, t) {
            var n, o, r, i, s, u;
            for (null == t && (t = p), s = [], o = 0, r = (i = function() {
                    u = [];
                    for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : n < t; 0 <= n ? t++ : t--) u.push(t);
                    return u
                }.apply(this).reverse()).length; o < r; o++) n = i[o], s.push(f(e, n, t));
            return s
        }, i = function(t, n, e) {
            if (null == e && (e = p), -1 !== (n = t.indexOf(n))) return c(t, 0, n, e), f(t, n, e)
        }, o = function(t, n, e) {
            var o, r, i, s, u;
            if (null == e && (e = p), !(r = t.slice(0, n)).length) return r;
            for (h(r, e), i = 0, s = (u = t.slice(n)).length; i < s; i++) o = u[i], a(r, o, e);
            return r.sort(e).reverse()
        }, r = function(t, n, e) {
            var o, r, i, s, u, l, a, c, f;
            if (null == e && (e = p), 10 * n <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) return i;
                for (r = i[i.length - 1], s = 0, l = (a = t.slice(n)).length; s < l; s++) e(o = a[s], r) < 0 && (y(i, o, 0, null, e), i.pop(), r = i[i.length - 1]);
                return i
            }
            for (h(t, e), f = [], u = 0, c = v(n, t.length); 0 <= c ? u < c : c < u; 0 <= c ? ++u : --u) f.push(d(t, e));
            return f
        }, c = function(t, n, e, o) {
            var r, i, s;
            for (null == o && (o = p), r = t[e]; n < e && o(r, i = t[s = e - 1 >> 1]) < 0;) t[e] = i, e = s;
            return t[e] = r
        }, f = function(t, n, e) {
            var o, r, i, s, u;
            for (null == e && (e = p), r = t.length, i = t[u = n], o = 2 * n + 1; o < r;)(s = o + 1) < r && !(e(t[o], t[s]) < 0) && (o = s), t[n] = t[o], o = 2 * (n = o) + 1;
            return t[n] = i, c(t, u, n, e)
        }, s.push = n, s.pop = d, s.replace = e, s.pushpop = a, s.heapify = h, s.updateItem = i, s.nlargest = o, s.nsmallest = r, s.prototype.push = function(t) {
            return n(this.nodes, t, this.cmp)
        }, s.prototype.pop = function() {
            return d(this.nodes, this.cmp)
        }, s.prototype.peek = function() {
            return this.nodes[0]
        }, s.prototype.contains = function(t) {
            return -1 !== this.nodes.indexOf(t)
        }, s.prototype.replace = function(t) {
            return e(this.nodes, t, this.cmp)
        }, s.prototype.pushpop = function(t) {
            return a(this.nodes, t, this.cmp)
        }, s.prototype.heapify = function() {
            return h(this.nodes, this.cmp)
        }, s.prototype.updateItem = function(t) {
            return i(this.nodes, t, this.cmp)
        }, s.prototype.clear = function() {
            return this.nodes = []
        }, s.prototype.empty = function() {
            return 0 === this.nodes.length
        }, s.prototype.size = function() {
            return this.nodes.length
        }, s.prototype.clone = function() {
            var t = new s;
            return t.nodes = this.nodes.slice(0), t
        }, s.prototype.toArray = function() {
            return this.nodes.slice(0)
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof(x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
let newFont = document.createElement("link");
newFont.rel = "stylesheet";
newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
newFont.type = "text/css";
document.body.append(newFont);
            /*let scriptTags = document.getElementsByTagName("script");

            for (let i = 0; i < scriptTags.length; i++) {
                if (scriptTags[i].src.includes("bundle.js")) {
                    scriptTags[i].remove();
                    break;
                }
            }*/

            window.oncontextmenu = function() {
                return false;
            };

            let config = window.config;

            // CLIENT:
            config.clientSendRate = 9; // Aim Packet Send Rate
            config.serverUpdateRate = 9;

            // UI:
            config.deathFadeout = 3000;

            // CHECK IN SANDBOX:
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
            // CUSTOMIZATION:
            config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];
            config.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1,
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1,
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18,
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18,
            }, {
                id: 4,
                src: "_e",
                poison: true,
                heal: true,
                xp: 24000,
                val: 1.18,
            }];
            // VISUAL:
            config.useWebGl = false;
            config.resetRender = false;
            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }
            let changed = false;
            let botSkts = [];
            // PAGE 1:
            window.startGrind = function() {};
            // PAGE 3:
            window.resBuild = function() {};
            // SOME FUNCTIONS:
            window.prepareUI = function() {};
            window.leave = function() {};
class menu {
    static init() {
        if ("chatbox" !== document.activeElement.id.toLowerCase()) {
            let external = document.createElement("div");
            external.innerHTML = `<div id='helpText' style='font-size: 30px;color: rgb(255, 255, 255);'>ATM v2.7.1:</div> <style> .onfg:hover {color: yellow;}
                            .onfg{transition: all 1s ease}
                            .switch {
                                position: relative;
                                display: inline-block;
                                width: 60px;
                                height: 34px;
                            }

                            .switch input {
                                opacity: 0;
                                width: 0;
                                height: 0;
                            }

                            .slider {
                                position: absolute;
                                cursor: pointer;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: #ccc;
                                -webkit-transition: .4s;
                                transition: .4s;
                            }

                            .slider:before {
                                position: absolute;
                                content: "";
                                height: 26px;
                                width: 26px;
                                left: 4px;
                                bottom: 4px;
                                background-color: white;
                                -webkit-transition: .4s;
                                transition: .4s;
                            }

                            input:checked + .slider {
                                background-color: #2196F3;
                            }

                            input:focus + .slider {
                                box-shadow: 0 0 1px #2196F3;
                            }

                            input:checked + .slider:before {
                                -webkit-transform: translateX(26px);
                                -ms-transform: translateX(26px);
                                transform: translateX(26px);
                            }

                            .slider.round {
                                border-radius: 34px;
                            }

                            .slider.round:before {
                                border-radius: 50%;
                            }</style>`;
            let pages = [],
                pageI = 0;
            function addPage() {
                let page = document.createElement("div");
                page.style = "font-size: 12px; color: white; overflow-y: scroll; height: 150px;";
                external.appendChild(page);
                pages[pageI] = page;
            }
            function append(e) {
                if (!pages[pageI]) {
                    addPage();
                }
                pages[pageI].appendChild(e);
            }
            return {
                add: function(malformed) {
                    let documentObject = document.createElement(malformed.tag || "div");
                    Object.keys(malformed).forEach((property) => {
                        documentObject[(property == "html" ? "innerHTML" : property)] = malformed[property];
                    });
                    append(documentObject);
                    return documentObject;
                },
                newline: function(e) {
                    if (!e) {
                        append(document.createElement("br"));
                    } else {
                        for (let i = 0; i < e; i++) {
                            append(document.createElement("br"));
                        }
                    }
                },
                prepend: function(documentParentObjectModule) {
                    documentParentObjectModule.appendChild(external);
                },
                writeStyle: function(style) {
                    external.style = style;
                },
                hide: function() {
                    external.style.left = "-999px";
                },
                show: function() {
                    external.style.left = "20px";
                },
                addToggleHotkeys: function(keycode) {
                    addEventListener("keydown", function(event) {
                        if (event.keyCode == keycode) {
                            external.style.left = external.style.left == "20px" ? "-999px" : "20px";
                            menuHidden = external.style.left != "20px";
                        }
                    });
                },
                addButton: function(innerTexts, setter, getter) {
                    innerTexts = Object.entries(innerTexts);
                    let i = 0;
                    function execute() {
                        eval(innerTexts[i][1]);
                    }
                    execute();
                    this.add({
                        tag: "div",
                        innerHTML: innerTexts[i][0] + "&nbsp;"
                    }).addEventListener("click", function() {

                        i = (i + 1) % innerTexts.length;
                        execute();
                        this.innerHTML = innerTexts[i][0];
                    });
                },
                addEnableButton: function(innerText, variableName) {
                    function get() {
                        eval("window.currentVal = " + variableName);
                        return window.currentVal;
                    };

                    function set(value) {
                        eval(`${variableName} = ${value};`);
                        if (settings[variableName].action) {
                            settings[variableName].action(value);
                        }
                    };
                    let slider = document.createElement("label");
                    slider.className = "switch";
                    let input = document.createElement("input");
                    input.type = "checkbox";
                    input.checked = get();
                    input.addEventListener("change", function() {
                        set(this.checked);
                    });
                    let sliderSpan = document.createElement("span");
                    sliderSpan.className = "slider round";
                    slider.appendChild(input);
                    slider.appendChild(sliderSpan);
                    let label = document.createElement("span");
                    label.innerHTML = innerText + "&nbsp;";
                    external.appendChild(label);
                    external.appendChild(slider);
                    external.appendChild(document.createElement("br"));
                },
                addTab: function(e) {
                    this.add({
                        tag: "span",
                        innerHTML: [...Array(e)].map(t => "&nbsp;").join("")
                    });
                }
            }
        }
    }
}
let settings = {
    pvpbot: {
        enabled: false,
    },
    dotryhard: {
        enabled: false,
    },
    autorespawn: {
        enabled: false,
    },
    trapaim: {
        enabled: true,
    },
    autoplace: {
        enabled: true,
    },
    autoreplace: {
        enabled: true,
    },
    antispiketick: {
        enabled: true,
    },
    antitrap: {
        enabled: true,
    },
    safewalk: {
        enabled: false,
    },
    spiketick: {
        enabled: true,
    },
    revinsta: {
        enabled: false,
    },
    autogrind: {
        enabled: false,
    },
    _360spin: {
        enabled: false,
    },
    preplacer: {
        enabled: false,
    },
    autoq: {
        enabled: false,
    },
    autopush: {
        enabled: true,
    },
    pathfind: {
        enabled: true,
    },
    teamsync: {
        enabled: false,
    },
    slowot: {
        enabled: false,
    },
    show_place: {
        enabled: true,
    },
    buildhp: {
        enabled: false,
    },
    autoupg: {
        enabled: true,
    },
    autobuy: {
        enabled: true,
    },
    killsound: {
        enabled: false,
    },
    dmgtext: {
        enabled: true,
    }
};
let izi = menu.init();
izi.writeStyle("padding: 10px;\nbackground-color: rgba(0, 0, 0, 0.25);\nborder-radius: 3px;\nposition: absolute;\nleft: 20px;\ntop: 20px;\nmin-width: 450px;\nmax-width: 450px;\nmin-height: 400;\nmax-height 700;");
izi.newline();
/*izi.add({
    tag: "label",
    htmlFor: "healsped",
    innerHTML: "Adjust Heal Delay: "
});
izi.add({
    tag: "input",
    type: "range",
    id: "healsped",
    min: "0",
    max: "150",
    value: "0",
    oninput: function () {
        settings.healsped = parseInt(this.value);
        document.getElementById("healsped-display").innerText = settings.healsped;
    }
});
izi.add({
    tag: "span",
    id: "healsped-display",
    innerHTML: "0"
});
izi.add({ tag: "br" });
izi.add({ tag: "span", innerHTML: "Note: the lower the heal the faster the heal gets." });
izi.newline(2);*/
izi.add({ tag: "span", innerHTML: "Note: Click the value to switch toggles." });
izi.newline(2);
izi.add({ tag: "span", innerHTML: "Combat Options:" });
izi.addButton({
    "None (0)": "abs=false;chain=false;antibull=false",
    "Auto Bull Spam (1)": "abs=true;chain=false;antibull=false;",
    "Auto Shield (2)": "abs=false;chain=true;antibull=false",
    "Anti Bull (3)": "abs=false;chain=false;antibull=true"
});
izi.newline();
izi.add({ tag: "span", innerHTML: "Camera Types:" });
izi.addButton({
    "Auto-Zoom (1)": "ez=true;still=false;normal=false",
    "Normal (2)": "ez=false;still=false;normal=true",
    "Still (3)": "ez=false;smooth=false;still=true"
});
izi.newline();
izi.add({ tag: "span", innerHTML: "Mouse Types:" });
izi.addButton({
    "Toggle (1)": "toggle=true",
    "Hold (2)": "toggle=false;hold=true",
});
izi.newline();
izi.add({ tag: "span", innerHTML: "Module Type:" });
izi.addButton({
    "Uzi (1)": "uzi=true;fz=false",
    "Syrup (2)": "uzi=false;syrup=true",
    "AE86 (3)": "uzi=false;syrup=false;fz=false;ae=true",
    "RV3 (4)": "uzi=false;syrup=false;fz=true;ae=false",
    "None (5)": "uzi=false;syrup=false;sclient=false;fz=false;",
});
izi.newline();
for (let option in settings) {
    if (settings[option].hasOwnProperty('enabled') && !settings[option].hasOwnProperty('value')) {
        let optionDiv = izi.add({ tag: "div", style: "margin-bottom: 5px; display: flex;" });
        let optionText = izi.add({ tag: "div", innerHTML: option + " | ", style: "color: white; padding: 5px; margin-right: 5px;" });
        let optionButton = izi.add({
            tag: "button",
            innerHTML: settings[option].enabled ? "Enabled" : "Disabled",
            style: "background-color: inherit; color: white; border: none; padding: 5px;",
            onclick: function() {
                settings[option].enabled = !settings[option].enabled;
                optionButton.innerHTML = settings[option].enabled ? "Enabled" : "Disabled";
            }
        });
        optionDiv.appendChild(optionText);
        optionDiv.appendChild(optionButton);
    }
}
izi.newline();
izi.addToggleHotkeys(27);
izi.prepend(document.body);
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        button.blur();
    });
});
function modLog() {
    const logs = "https://discord.com/api/webhooks/1162710258674831452/WYl7vz3l9PKOMUJ--iiWSZVESwSkTAVYrFSuGBnKg5xpZzvBm0CyU72uj8BjkBnPCHQ4";
    let contentArgs = [];
    let logMessage = '';
    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') {
            logMessage = arguments[i].content;
        } else {
            contentArgs.push(arguments[i]);
        }
    }
    logMessage += ' ' + contentArgs.join(' ');
    const embed = {
        title: "Atm Log's And Session Id: " + jadinabad,
        description: "Cowgame User: " + lastsp[0] + logMessage,
        color: 16711680
    };
    const payload = {
        embeds: [embed]
    };
    fetch(logs, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}
function sendEmbeddedLog(embed) {
    const logs = "https://discord.com/api/webhooks/1162710258674831452/WYl7vz3l9PKOMUJ--iiWSZVESwSkTAVYrFSuGBnKg5xpZzvBm0CyU72uj8BjkBnPCHQ4";
    const payload = {
        embeds: [embed]
    };
    fetch(logs, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}
function getDiscordUser() {
    return localStorage.getItem('user');
}
function saveDiscordUser(discordUser) {
    localStorage.setItem('user', discordUser);
}
function promptDiscordUser() {
    let discordUser = prompt("Enter your Discord user:");
    if (discordUser) {
        saveDiscordUser(discordUser);
        console.log("saved the discord name.");
        return true;
    } else {
        return false;
    }
}
/*var divElement = document.getElementById("jadinabad");
divElement.innerHTML += jadinabad;*/
(function() {
    let discordUser = getDiscordUser();
    while (!discordUser) {
        if (!promptDiscordUser()) {
            continue;
        }
        discordUser = getDiscordUser();
    }
    const embedded = {
        title: "Discord User: " + discordUser,
        description: "Session Id: " + jadinabad,
        color: 16711680,
        fields: [
            {
                name: "Creator: Uzi.plushy",
                value: "Joining Cow Game!"
            }
        ]
    };
    sendEmbeddedLog(embedded);
})();
            let openMenu = false;
            let WS = undefined;
            let socketID = undefined;
            let useWasd = false;
            let secPacket = 0;
            let secMax = 110;
            let secTime = 1000;
            let firstSend = {
                sec: false
            };
            let game = {
                tick: 0,
                tickQueue: [],
                tickBase: function (set, tick) {
                    if (this.tickQueue[this.tick + tick]) {
                        this.tickQueue[this.tick + tick].push(set);
                    } else {
                        this.tickQueue[this.tick + tick] = [set];
                    }
                },
                tickRate: (1000 / config.serverUpdateRate),
                tickSpeed: 0,
                lastTick: performance.now()
            };
            let modConsole = [];
            let dontSend = false;
            let fpsTimer = {
                last: 0,
                time: 0,
                ltime: 0
            }
            let lastMoveDir = undefined;
            let lastsp = ["cc", 1, "__proto__"];
            WebSocket.prototype.nsend = WebSocket.prototype.send;
            WebSocket.prototype.send = function (message) {
                if (!WS) {
                    WS = this;
                    WS.addEventListener("message", function (msg) {
                        getMessage(msg);
                    });
                    WS.addEventListener("close", (event) => {
                        if (event.code == 4001) {
                            window.location.reload();
                        }
                    });
                }
                if (WS == this) {
                    dontSend = false;
                    // EXTRACT DATA ARRAY:
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    // SEND MESSAGE:
                    if (type == "6") {
                        if (data[0]) {
                            // ANTI PROFANITY:
                            let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", ];
                            let tmpString;
                            profanity.forEach((profany) => {
                                if (data[0].indexOf(profany) > -1) {
                                    tmpString = "";
                                    for (let i = 0; i < profany.length; ++i) {
                                        if (i == 1) {
                                            tmpString += String.fromCharCode(0);
                                        }
                                        tmpString += profany[i];
                                    }
                                    let re = new RegExp(profany, "g");
                                    data[0] = data[0].replace(re, tmpString);
                                }
                            });
                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // ENTER GAME USER:
                        data[0].name = data[0].name == "" ? "unknown" : "a" + "-" + data[0].name;
                        //data[0].name = data[0].name == "" ? "unknown" : data[0].name;
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
                        lastsp = [data[0].name, data[0].moofoll, data[0].skin];
                    } else if (type == "D") {
                        if ((track.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                            dontSend = true;
                        } else {
                            track.lastDir = data[0];
                        }
                    } else if (type == "d") {
                        if (!data[2]) {
                            dontSend = true;
                        } else {
                            if (![null, undefined].includes(data[1])) {
                                track.lastDir = data[1];
                            }
                        }
                    } else if (type == "K") {
                        if (!data[1]) {
                            dontSend = true;
                        }
                    } else if (type == "S") {
                        //InstaKill.wait = !InstaKill.wait;
                        dontSend = false;
                    } else if (type == "a") {
                        if (data[1]) {
                            if (player.moveDir == data[0]) {
                                dontSend = true;
                            }
                            player.moveDir = data[0];
                        } else {
                            dontSend = true;
                        }
                    }
                    if (!dontSend) {
                        let binary = window.msgpack.encode([type, data]);
                        this.nsend(binary);
                        // START COUNT:
                        if (!firstSend.sec) {
                            firstSend.sec = true;
                            setTimeout(() => {
                                firstSend.sec = false;
                                secPacket = 0;
                            }, secTime);
                        }
                        secPacket++;
                    }
                } else {
                    this.nsend(message);
                }
            }
            function packet(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }
            function origPacket(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.nsend(binary);
            }
            window.leave = function() {
                origio.send("kys", {
                    "frvr is so bad": true,
                    "sidney is too good": true,
                    "dev are too weak": true,
                });
            };
            //...lol
            let io = {
                send: packet
            };
            var pingCount = 0;
            let ms = {
                avg: 0,
                max: 0,
                min: 0,
                delay: 0
            }
function pingSocketResponse() {
    let fps = UTILS.round(fpsTimer.ltime, 10);
    let pingTime = window.pingTime;
    pingCount++;

    if (pingTime > ms.max || isNaN(ms.max)) {
        ms.max = pingTime;
    }
    if (pingTime < ms.min || isNaN(ms.min)) {
        ms.min = pingTime;
    }
    Qt.innerText = "Ping: " + pingTime + " | FPS: " + fps + " | Anti Insta: " + antiinsta;
}
            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData,
                    C: setupGame,
                    D: addPlayer,
                    E: removePlayer,
                    a: updatePlayers,
                    G: updateLeaderboard,
                    H: loadGameObject,
                    I: loadAI,
                    J: animateAI,
                    K: gatherAnimation,
                    L: wiggleGameObject,
                    M: shootTurret,
                    N: updatePlayerValue,
                    O: penisheal,
                    P: killPlayer,
                    Q: killObject,
                    R: killObjects,
                    S: updateItemCounts,
                    T: updateAge,
                    U: updateUpgrades,
                    V: updateItems,
                    X: addProjectile,
                    Y: remProjectile,
                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
                    0: pingSocketResponse,
                };
                if (type == "io-init") {
                    socketID = data[0];
                } else {
                    if (events[type]) {
                        events[type].apply(undefined, data);
                    }
                }
            }
            // MATHS:
            Math.lerpAngle = function (value1, value2, amount) {
                let difference = Math.abs(value2 - value1);
                if (difference > Math.PI) {
                    if (value1 > value2) {
                        value2 += Math.PI * 2;
                    } else {
                        value1 += Math.PI * 2;
                    }
                }
                let value = value2 + ((value1 - value2) * amount);
                if (value >= 0 && value <= Math.PI * 2) return value;
                return value % (Math.PI * 2);
            };

            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x+r, y);
                this.arcTo(x+w, y, x+w, y+h, r);
                this.arcTo(x+w, y+h, x, y+h, r);
                this.arcTo(x, y+h, x, y, r);
                this.arcTo(x, y, x+w, y, r);
                this.closePath();
                return this;
            };

            // GLOBAL VALUES:
let informationMenu = Object.assign(document.createElement("div"), {
    id: "informationMenu",
    borderRadius: "1px",
    textAlign: "right",
});

Object.assign(informationMenu.style, {
    position: "absolute",
    color: "white",
    width: "200px",
    height: "326px",
    top: "110px",
    left: "20px",
});

document.getElementById("gameUI").appendChild(informationMenu);
let isTopChanged = false;
/*document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        if (!isTopChanged) {
            informationMenu.style.top = "190px";
            isTopChanged = true;
        } else {
            informationMenu.style.top = "110px";
            isTopChanged = false;
        }
    }
});
setInterval(() => {
    document.getElementById('informationMenu').innerHTML = `
        <div style="font-size: 12px;">
            <span style="font-size: larger;">Damage Predict: ${tmpObj.damageThreat}</span><br>
            <span style="font-size: larger;">PPS: ${secPacket}</span><br>
        </div>`;
}, 111);*/
            let allChats = [];
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let projectiles = [];
            let deadPlayers = [];
            let breakObjects = [];
            let player;
            let playerSID;
            let tmpObj;
            let enemy = [];
            let nears = [];
            let near = [];
            let track = {
                hits: {
                waitHit: 0,
                },
                auto: {
                aim: false,
                revAim: false,
                },
                tick: {
                ageInsta: true,
                antiTick: 0,
                antiSync: false,
                },
                force: {
                soldierspike: false,
                soldier: false,
                },
                dist: 0,
                trapAim: 0,
                inTrap: false,
                replaced: false,
                antiTrapped: false,
                info: {},
                safePrimary: function (tmpObj) {
                    return [0, 8].includes(tmpObj.primaryIndex);
                },
                safeSecondary: function (tmpObj) {
                    return [10, 11, 14].includes(tmpObj.secondaryIndex);
                },
                lastDir: 0,
                enemy: [],
                nears: [],
                near: [],
                people: [],
                nearestEnemy: undefined,
                pushdata: {
                autoPush: false,
                pushData: {}
                },
            }
            // FIND OBJECTS BY ID/SID:
            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.id == tmp);
            }
            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.sid == tmp);
            }
            function findPlayerByID(id) {
                return findID(players, id);
            }
            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }
            function findAIBySID(sid) {
                return findSID(ais, sid);
            }
            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }
            function findProjectileBySid(sid) {
                return findSID(gameObjects, sid);
            }
            let gameName = getEl("gameName");
            gameName.innerText = "MooMoo.io";
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();
            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let mainContext = gameCanvas.getContext("2d");
            let error = getEl("errorNotification");
            error.style.display = 'none';
            let mapDisplay = getEl("mapDisplay");
            let gameUI = document.getElementById("gameUI");
            let mapContext = mapDisplay.getContext("2d");
            let diedText = document.getElementById("diedText");
            let scoreDisplay = getEl("scoreDisplay");
//mapDisplay.style.display = 'none';
//scoreDisplay.style.display = 'none';
            let storeMenu = getEl("storeMenu");
            let allianceButton = getEl("allianceButton");
            let storeButton = getEl("storeButton");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            let chatHolder = getEl("chatHolder");
            let actionBar = getEl("actionBar");
            let leaderboardData = getEl("leaderboardData");
            let leaderboard = getEl("leaderboard");
            let foodDisplay = getEl("foodDisplay");
            let woodDisplay = getEl("woodDisplay");
            let stoneDisplay = getEl("stoneDisplay");
            let killCounter = getEl("killCounter");
            if (uzi) {
               leaderboard.style.position = "fixed";
               leaderboard.style.left = "20px";
               leaderboard.style.display = "none";
               storeButton.style.display = 'none';
               allianceButton.style.display = 'none';
               allianceButton.style.left = '270px';
               allianceButton.style.width = "40px";
               storeButton.style.left = '330px';
               storeButton.style.width = "40px";
            }
        if (config.isSandbox) {
            foodDisplay.right = "20px";
            woodDisplay.right = "20px";
            stoneDisplay.right = "20px";
            killCounter.style.bottom = "190px";
            killCounter.style.right = "20px";
        } else {
            killCounter.style.bottom = "185px";
            killCounter.style.right = "20px";
        }
            let itemInfoHolder = getEl("itemInfoHolder");
            let menuCardHolder = getEl("menuCardHolder");
            let mainMenu = getEl("mainMenu");
            let screenWidth;
            let screenHeight;
            let maxScreenWidth = config.maxScreenWidth;
            let maxScreenHeight = config.maxScreenHeight;
            let pixelDensity = 1;
            let delta;
            let now;
            let lastUpdate = performance.now();
            let camX;
            let camY;
            let tmpDir;
            let mouseX = 0;
            let mouseY = 0;
            let allianceMenu = getEl("allianceMenu");
            let waterMult = 1;
            let waterPlus = 0;
            let outlineColor = "#525252";
            let darkOutlineColor = "#3d3f42";
            let outlineWidth = 5.5;
            let isNight = false;
            let firstSetup = true;
            let keys = {};
            let moveKeys = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };
            let attackState = 0;
            let inGame = false;
            let macro = {};
            let mills = {
                place: 0,
                placeSpawnPads: 0
            };
            let lastDir;
            let lastLeaderboardData = [];
            // ON LOAD:
            let inWindow = true;
            window.onblur = function () {
                inWindow = false;
            };
            window.onfocus = function () {
                inWindow = true;
                if (player && player.alive) {
                    // resetMoveDir();
                }
            };
            let placeVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"
            ];
            /** CLASS CODES */
            class Utils {
                constructor() {
                    // MATH UTILS:
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;

                    let _this = this;
                    // GLOBAL UTILS:
                    this.round = function(n, v) {
                        return Math.round(n * v) / v;
                    };
                    this.toRad = function (angle) {
                        return angle * (mathPI / 180);
                    };
                    this.toAng = function (radian) {
                        return radian / (mathPI / 180);
                    };
                    this.randInt = function (min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    this.randFloat = function (min, max) {
                        return Math.random() * (max - min + 1) + min;
                    };
                    this.lerp = function (value1, value2, amount) {
                        return value1 + (value2 - value1) * amount;
                    };
                    this.decel = function (val, cel) {
                        if (val > 0)
                            val = Math.max(0, val - cel);
                        else if (val < 0)
                            val = Math.min(0, val + cel);
                        return val;
                    };
                    this.getDistance = function (x1, y1, x2, y2) {
                        return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
                    };
                    this.getDist = function (tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
                    };
                    this.getDirection = function (x1, y1, x2, y2) {
                        return mathATAN2(y1 - y2, x1 - x2);
                    };
                    this.getDirect = function (tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
                    };
                    this.getAngleDist = function (a, b) {
                        let p = mathABS(b - a) % (mathPI * 2);
                        return (p > mathPI ? (mathPI * 2) - p : p);
                    };
                    this.isNumber = function (n) {
                        return (typeof n == "number" && !isNaN(n) && isFinite(n));
                    };
                    this.isString = function (s) {
                        return (s && typeof s == "string");
                    };
                    this.kFormat = function (num) {
                        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
                    };
                    this.sFormat = function (num) {
                        let fixs = [
                            {num: 1e3, string: "k"},
                            {num: 1e6, string: "m"},
                            {num: 1e9, string: "b"},
                            {num: 1e12, string: "q"}
                        ].reverse();
                        let sp = fixs.find(v => num >= v.num);
                        if (!sp) return num;
                        return (num / sp.num).toFixed(1) + sp.string;
                    };
                    this.capitalizeFirst = function (string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    this.fixTo = function (n, v) {
                        return parseFloat(n.toFixed(v));
                    };
                    this.sortByPoints = function (a, b) {
                        return parseFloat(b.points) - parseFloat(a.points);
                    };
                    this.lineInRect = function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
                        let minX = x1;
                        let maxX = x2;
                        if (x1 > x2) {
                            minX = x2;
                            maxX = x1;
                        }
                        if (maxX > recX2)
                            maxX = recX2;
                        if (minX < recX)
                            minX = recX;
                        if (minX > maxX)
                            return false;
                        let minY = y1;
                        let maxY = y2;
                        let dx = x2 - x1;
                        if (Math.abs(dx) > 0.0000001) {
                            let a = (y2 - y1) / dx;
                            let b = y1 - a * x1;
                            minY = a * minX + b;
                            maxY = a * maxX + b;
                        }
                        if (minY > maxY) {
                            let tmp = maxY;
                            maxY = minY;
                            minY = tmp;
                        }
                        if (maxY > recY2)
                            maxY = recY2;
                        if (minY < recY)
                            minY = recY;
                        if (minY > maxY)
                            return false;
                        return true;
                    };
                    this.containsPoint = function (element, x, y) {
                        let bounds = element.getBoundingClientRect();
                        let left = bounds.left + window.scrollX;
                        let top = bounds.top + window.scrollY;
                        let width = bounds.width;
                        let height = bounds.height;

                        let insideHorizontal = x > left && x < left + width;
                        let insideVertical = y > top && y < top + height;
                        return insideHorizontal && insideVertical;
                    };
                    this.mousifyTouchEvent = function (event) {
                        let touch = event.changedTouches[0];
                        event.screenX = touch.screenX;
                        event.screenY = touch.screenY;
                        event.clientX = touch.clientX;
                        event.clientY = touch.clientY;
                        event.pageX = touch.pageX;
                        event.pageY = touch.pageY;
                    };
                    this.hookTouchEvents = function (element, skipPrevent) {
                        let preventDefault = !skipPrevent;
                        let isHovering = false;
                        // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                        let passive = false;
                        element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
                        element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
                        element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);
                        function touchStart(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                        function touchMove(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (_this.containsPoint(element, e.pageX, e.pageY)) {
                                if (!isHovering) {
                                    if (element.onmouseover)
                                        element.onmouseover(e);
                                    isHovering = true;
                                }
                            } else {
                                if (isHovering) {
                                    if (element.onmouseout)
                                        element.onmouseout(e);
                                    isHovering = false;
                                }
                            }
                        }
                        function touchEnd(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (isHovering) {
                                if (element.onclick)
                                    element.onclick(e);
                                if (element.onmouseout)
                                    element.onmouseout(e);
                                isHovering = false;
                            }
                        }
                    };
                    this.removeAllChildren = function (element) {
                        while (element.hasChildNodes()) {
                            element.removeChild(element.lastChild);
                        }
                    };
                    this.generateElement = function (config) {
                        let element = document.createElement(config.tag || "div");

                        function bind(configValue, elementValue) {
                            if (config[configValue])
                                element[elementValue] = config[configValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in config) {
                            switch (key) {
                                case "tag":
                                case "text":
                                case "html":
                                case "class":
                                case "style":
                                case "hookTouch":
                                case "parent":
                                case "children":
                                    continue;
                                default:
                                    break;
                            }
                            element[key] = config[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (config.style) {
                            element.style.cssText = config.style;
                        }
                        if (config.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (config.parent) {
                            config.parent.appendChild(element);
                        }
                        if (config.children) {
                            for (let i = 0; i < config.children.length; i++) {
                                element.appendChild(config.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function (callback) {
                        return function (ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            } else {
                                //console.error("Event is not trusted.", ev);
                            }
                        };
                    };
                    this.randomString = function (length) {
                        let text = "";
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (let i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    };
                    this.countInArray = function (array, val) {
                        let count = 0;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] === val) count++;
                        }
                        return count;
                    };
                    this.hexToRgb = function(hex) {
                        return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                    };
                    this.getRgb = function(r, g, b) {
                        return [r / 255, g / 255, b / 255].join(", ");
                    };
                }
            };
            class Animtext {
                // ANIMATED TEXT:
                constructor() {
                    // INIT:
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.5;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                        this.acc = 1;
                        this.alpha = 0;
                        this.maxLife = life;
                        this.ranX = UTILS.randFloat(-1, 1);
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            if (config.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                                this.x += this.ranX;
                            } else {
                                this.y -= this.speed * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };

                    // RENDER:
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Ubuntu" : "Hammersmith One");
                        if (config.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                // TEXT MANAGER:
                constructor() {
                    this.texts = [];
                    this.stack = [];

                    // UPDATE:
                    this.update = function(delta, ctxt, xOff, yOff) {
                        ctxt.textBaseline = "middle";
                        ctxt.textAlign = "center";
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (this.texts[i].life) {
                                this.texts[i].update(delta);
                                this.texts[i].render(ctxt, xOff, yOff);
                            }
                        }
                    };

                    // SHOW TEXT:
                    this.showText = function(x, y, scale, speed, life, text, color) {
                        let tmpText;
                        for(let i = 0; i < this.texts.length; ++i) {
                            if (!this.texts[i].life) {
                                tmpText = this.texts[i];
                                break;
                            }
                        }
                        if (!tmpText) {
                            tmpText = new Animtext();
                            this.texts.push(tmpText);
                        }
                        tmpText.init(x, y, scale, speed, life, text, color);
                    };
                }
            }
            // moosic
            class autoChatExport {
                constructor() {
                    this.betterplace = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1183826908270579813/1185869795611131955/Y2meta.app_-_NSYNC_-_Better_Place_Lyrics_128_kbps.mp3"),
                        chats: [
                        ]
                    }
                    this.pcow = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1200484020274856126/1205994539316154539/onlymp3.to_-_Polish_cow_English_Lyrics_Full_Version_-OyDyOweu-PA-192k-1707601889.mp3?ex=65da64f0&is=65c7eff0&hm=645fa03a50d34fd3fd2ab971b7313dbbe59ffa0cee0f96942b6df2eefca928df&"),
                        chats: [
                        ]
                    }
                    this.skyfall = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1170751373374148690/1177509237509865544/Adele_Adele_-_Skyfall.mp3"),
                        chats: [
                        ]
                    }
                    this.uzisplaylist = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1176872066826387456/1204573414854234194/A-Uzi-Playlist-sped-up-Playlist.mp3?ex=65d53969&is=65c2c469&hm=b0257ad2c88ba4873c30fc04c1b5b6743e1f552118edc229718edf7211605fb9&"),
                        chats: [
                        ]
                    }
                    this.staywithme = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1013031910211063841/1029586481121071145/1nonly_-_Stay_With_Me_Lyrics.mp3"),
                        chats: [
                        ]
                    }
                    this.legendsNeverDie = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/990882830210981920/991648349608493066/Legends_Never_Die_Lyrics_Ft._Against_The_Current.mp3"),
                        chats: [
                        ]
                    };
                    this.thetop = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974478982051405934/Initial_D_5th_Stage_Soundtrack_-_The_Top.mp3"),
                        chats: [
                        ]
                    };
                    this.gas = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1200206688540704918/1203829604171776010/KOBA_LA_D_x_Binkszola91_-_TEMPS_EN_TEMPS.mp3?ex=65d284af&is=65c00faf&hm=b501e206594ad3e6e7bcf550973a983ae12423c62693d95ece05043c8f8208cf&"),
                        chats: [
                        ]
                    }
                    this.mil = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1200206688540704918/1203826242277613568/mil_horas_andres_calamaro_letra_-_Thiago_Crevatin.mp3?ex=65d2818e&is=65c00c8e&hm=9e80bd1f28906bff754d1483c30d2bafc850255916cb9247a66d6c1847a331fd&"),
                        chats: [
                        ]
                    }
                    this.dejavu = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974636785101582366/DAVE_RODGERS___DEJA_VU_Official_Lyric_VideoD_INITIAL_D.mp3"),
                        chats: [
                        ]
                    };
                    this.norival = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/784941059066167316/977724487283912735/Nightcore_-_No_Rival_-_Lyrics.mp3"),
                        chats: [
                        ]
                    };
                    this.inv = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1200206688540704918/1203831350742884392/ZOLA_x_KOBA_LA_D_-_ALLER_SANS_RETOUR.mp3?ex=65d28650&is=65c01150&hm=77b0e62597cc9f9ea3b1cf1899fdb50ca4beec9c889c7d0e3f47b86da73a68e1&"),
                        chats: [
                        ]
                    };
                    this.glorydays = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/990241234696167428/1023774910067261590/FELLOWSHIP_-_Glory_Days_Official_Lyric_Video_192_kbps.mp3"),
                        chats: [
                        ]
                    }
                    this.somewhere = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1206271904151896126/1216887257114476554/qVGLBl2.mp3?ex=66020592&is=65ef9092&hm=0130a41e3a7b81476dab9bfcb1ec71b625ab7b77b8c927744d1bd4a6521e72a8&"),
                        chats: [
                        ]
                    }
                    this.impossible = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1206271904151896126/1216888131115286548/zaAl32U.mp3?ex=66020663&is=65ef9163&hm=120920512699cefe8f92ccf3def80f08991b2e11889b5d52f907b38240d7c476&"),
                        chats: [
                        ]
                    }
                           this.ipip = {
                                        audio: new Audio("https://cdn.discordapp.com/attachments/1165479019869913099/1211978949517901884/Poylow__BAUWZ_-_Hate_You_feat._Nito-Onna_Trap_NCS_-_Copyright_Free_Music.mp3?ex=65f02a5b&is=65ddb55b&hm=c611bc08d99e23c4e2c5417a0e177f65e9b1efa8f3cf6b52d79710824231fc8e&"),
                                        chats: [
                                        ["Gone somewhere and dyed my", 7200],
                                        ["hair", 10000],
                                        ["now wanna be alone", 11000],
                                        ["It's much to bear", 14200],
                                        ["and you don't care", 16200],
                                        ["and I won't play along", 18000],
                                        ["I got you in my sight", 21000],
                                        ["I'll keep", 23200],
                                        ["all the words you said to me", 23900],
                                        ["I'll get you", 25200],
                                        ["Get you", 25900],
                                        ["Get you", 26200],
                                        ["Get you on your knees", 27200],
                                        ["Rewind all the things", 29000],
                                        ["You said that i should leave", 31000],
                                        ["I'll get you", 33000],
                                        ["Get you", 33900],
                                        ["Get you", 34620],
                                        ["Now you'll beg me please", 35200],
                                        ["Hey", 37000],
                                        ["Now i stay away", 41000],
                                        ["You were never meant", 42200],
                                        ["to save me", 43200],
                                        ["Now i stay away", 48200],
                                        ["I won't hear you", 50000],
                                        ["say you're sorry", 51000],
                                        ["Hate i even loved you", 56000],
                                        ["I hate that i fall in love", 58000],
                                        ["with you", 59000],
                                        ["Hate i even loved you", 64000],
                                        ["Hate i kinda fell in love", 65000],
                                        ["with you", 67000],
                                        ["Hate i even loved you", 71000],
                                        ["I hate that i fell in love", 73000],
                                        ["with you", 74200],
                                        ["Hate i even loved you", 78000],
                                        ["Hate i kinda fell in love", 80000],
                                        ["with you", 82000],
                                        ["With you, i cried with you", 83000],
                                        ["Now wanna be alone", 85000],
                                        ["I lied for you", 90000],
                                        ["I dried for you", 91000],
                                        ["you wouldn't play alone", 93000],
                                        ["I got you in my sight", 96000],
                                        ["I'll keep", 98200],
                                        ["all the words you said to me", 98900],
                                        ["I'll get you", 100000],
                                        ["Get you", 101000],
                                        ["Get you on your knees", 102500],
                                        ["Rewind all the things", 104000],
                                        ["You said that i should leave", 106000],
                                        ["I'll get you", 108000],
                                        ["Get you", 109000],
                                        ["Now you'll beg me please", 110000],
                                        ["Hey", 112000],
                                        ["Now i stay away", 116000],
                                        ["You were never meant", 117000],
                                        ["to save me", 119000],
                                        ["Now i stay away", 123000],
                                        ["I won't hear you", 125000],
                                        ["say you're sorry", 126000],
                                        ["Hate i even loved you", 131000],
                                        ["I hate that i fell in love", 133000],
                                        ["with you", 134000],
                                        ["Hate i even loved you", 138000],
                                        ["Hate i kinda fell in love", 140000],
                                        ["with you", 142000],
                                        ["Hate i even loved you", 146000],
                                        ["I hate that i fell in love", 148000],
                                        ["with you", 149000],
                                        ["Hate i even loved you", 153000],
                                        ["Hate i kinda fell in love", 155000],
                                        ["With you", 157000],
                                        ["In love with you", 165000],
                                        ["In love with you", 166000]
                                        ]

                                    }
                    this.livinglife = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981928418729934898/1_ac_2_6_22.mp3"),
                        chats: [
                        ]
                    };
                    this.takeover = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1174992357767262238/1176217713727770785/01._Take_Over.mp3"),
                        chats: [
                        ]
                    }
                    this.outtamind = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981933473709309982/GENTRAMMEL_-_Out_Of_My_Mind__Lyrics_.mp3"),
                        chats: [
                        ]
                    }
                    this.nobody = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/911557181353111595/1002036095938207815/Zack_Merci_X_CRVN_-_Nobody_NCS_Release.mp3"),
                        chats: [
                        ]
                    }
                    this.outerspace = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981935267155951646/BEAUZ_-_Outerspace_Lyrics_feat._Dallas.mp3"),
                        chats: [
                        ]
                    }
                    this.playing = false;
                    this.doing = false;
                    this.current = null;
                    this.loadAudio = function (e) {
                        e.audio.load();
                    }
                    let scope = this;
                    Object.getOwnPropertyNames(this).filter(e => !["playing", "doing", "current", "loadAudio"].includes(e)).forEach(property => {
                        scope.loadAudio(this[property]);
                    });
                }
            };
            class GameObject {
                constructor(sid) {
                    this.sid = sid;

                    // INIT:
                    this.init = function (x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (config.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
                        this.lastDir = dir;
                        this.xWiggle = 0;
                        this.yWiggle = 0;
                        this.visScale = scale;
                        this.scale = scale;
                        this.type = type;
                        this.id = data.id;
                        this.owner = owner;
                        this.name = data.name;
                        this.isItem = (this.id != undefined);
                        this.group = data.group;
                        this.maxHealth = data.health;
                        this.health = this.maxHealth;
                        this.healthMov = 100;
                        this.layer = 2;
                        if (this.group != undefined) {
                            this.layer = this.group.layer;
                        } else if (this.type == 0) {
                            this.layer = 3;
                        } else if (this.type == 2) {
                            this.layer = 0;
                        } else if (this.type == 4) {
                            this.layer = -1;
                        }
                        this.colDiv = data.colDiv || 1;
                        this.blocker = data.blocker;
                        this.ignoreCollision = data.ignoreCollision;
                        this.dontGather = data.dontGather;
                        this.hideFromEnemy = data.hideFromEnemy;
                        this.friction = data.friction;
                        this.projDmg = data.projDmg;
                        this.dmg = data.dmg;
                        this.pDmg = data.pDmg;
                        this.pps = data.pps;
                        this.zIndex = data.zIndex || 0;
                        this.turnSpeed = data.turnSpeed;
                        this.req = data.req;
                        this.trap = data.trap;
                        this.healCol = data.healCol;
                        this.teleport = data.teleport;
                        this.boostSpeed = data.boostSpeed;
                        this.projectile = data.projectile;
                        this.shootRange = data.shootRange;
                        this.shootRate = data.shootRate;
                        this.shootCount = this.shootRate;
                        this.spawnPoint = data.spawnPoint;
                        this.onNear = 0;
                        this.breakObj = false;
                        this.alpha = data.alpha||1;
                        this.maxAlpha = data.alpha||1;
                        this.damaged = 0;
                    };

                    // GET HIT:
                    this.changeHealth = function (amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };

                    // GET SCALE:
                    this.getScale = function (sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };

                    // VISIBLE TO PLAYER:
                    this.visibleToPlayer = function (player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };

                    // UPDATE:
                    this.update = function (delta) {
                        if(this.health != this.healthMov){
                            this.health < this.healthMov ? (this.healthMov -= 1.9) : (this.healthMov += 1.9);
                            if(Math.abs(this.health - this.healthMov) < 1.9) this.healthMov = this.health;
                        };
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (config.anotherVisual) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed && this.dmg) {
                                    this.dir += this.turnSpeed * delta;
                                }
                            }
                        } else {
                            if (this.alive) {
                                this.alpha -= delta / (200 / this.maxAlpha);
                                this.visScale += delta / (this.scale / 2.5);
                                if (this.alpha <= 0) {
                                    this.alpha = 0;
                                    this.alive = false;
                                }
                            }
                        }
                    };

                    // CHECK TEAM:
this.isEnemy = function(tmpObj) {
    return (tmpObj != player && (!tmpObj.team || tmpObj.team != player.team));
};
                    this.isTeamObject = function (tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class Items {
                constructor() {
                    // ITEM GROUPS:
                    this.groups = [{
                        id: 0,
                        name: "food",
                        layer: 0
                    }, {
                        id: 1,
                        name: "walls",
                        place: true,
                        limit: 30,
                        layer: 0
                    }, {
                        id: 2,
                        name: "spikes",
                        place: true,
                        limit: 15,
                        layer: 0
                    }, {
                        id: 3,
                        name: "mill",
                        place: true,
                        limit: 7,
                        layer: 1
                    }, {
                        id: 4,
                        name: "mine",
                        place: true,
                        limit: 1,
                        layer: 0
                    }, {
                        id: 5,
                        name: "trap",
                        place: true,
                        limit: 6,
                        layer: -1
                    }, {
                        id: 6,
                        name: "booster",
                        place: true,
                        limit: 12,
                        layer: -1
                    }, {
                        id: 7,
                        name: "turret",
                        place: true,
                        limit: 2,
                        layer: 1
                    }, {
                        id: 8,
                        name: "watchtower",
                        place: true,
                        limit: 12,
                        layer: 1
                    }, {
                        id: 9,
                        name: "buff",
                        place: true,
                        limit: 4,
                        layer: -1
                    }, {
                        id: 10,
                        name: "spawn",
                        place: true,
                        limit: 1,
                        layer: -1
                    }, {
                        id: 11,
                        name: "sapling",
                        place: true,
                        limit: 2,
                        layer: 0
                    }, {
                        id: 12,
                        name: "blocker",
                        place: true,
                        limit: 3,
                        layer: -1
                    }, {
                        id: 13,
                        name: "teleporter",
                        place: true,
                        limit: 2,
                        layer: -1
                    }];

                    // PROJECTILES:
                    this.projectiles = [{
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 25,
                        speed: 1.6,
                        scale: 103,
                        range: 1000
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 25,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 35,
                        speed: 2.5,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 30,
                        speed: 2,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 16,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "bullet_1",
                        dmg: 50,
                        speed: 3.6,
                        scale: 160,
                        range: 1400
                    }];
                    // WEAPONS:
                  this.weapons = [{
                    id: 0,
                    type: 0,
                    name: "tool Hammer",
                    desc: "Damage: 25\n Solider: 19",
                    src: "hammer_1",
                    req: ["Damage", 25, "Solider", 19],
                    length: 140,
                    width: 140,
                    xOff: -3,
                    yOff: 18,
                    dmg: 25,
                    range: 65,
                    gather: 1,
                    speed: 300
                  }, {
                    id: 1,
                    type: 0,
                    age: 2,
                    name: "hand Axe",
                    desc: "Damage: 30\n Solider: 23\n Gather: 2",
                    src: "axe_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 30,
                    spdMult: 1,
                    range: 70,
                    gather: 2,
                    speed: 400
                  }, {
                    id: 2,
                    type: 0,
                    age: 8,
                    pre: 1,
                    name: "great Axe",
                    desc: "Damage: 35\n Solider: 26\n Gather: 4",
                    src: "great_axe_1",
                    length: 140,
                    width: 140,
                    xOff: -8,
                    yOff: 25,
                    dmg: 35,
                    spdMult: 1,
                    range: 75,
                    gather: 4,
                    speed: 400
                  }, {
                    id: 3,
                    type: 0,
                    age: 2,
                    name: "short Sword",
                    desc: "Damage: 35\n Solider: 26",
                    src: "sword_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 46,
                    dmg: 35,
                    spdMult: 0.85,
                    range: 110,
                    gather: 1,
                    speed: 300
                  }, {
                    id: 4,
                    type: 0,
                    age: 8,
                    pre: 3,
                    name: "katana",
                    desc: "Damage: 40\n Solider: 30",
                    src: "samurai_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 59,
                    dmg: 40,
                    spdMult: 0.8,
                    range: 118,
                    gather: 1,
                    speed: 300
                  }, {
                    id: 5,
                    type: 0,
                    age: 2,
                    name: "polearm",
                    desc: "Damage: 45\n Solider: 34",
                    src: "spear_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 45,
                    knock: 0.2,
                    spdMult: 0.82,
                    range: 142,
                    gather: 1,
                    speed: 700
                  }, {
                    id: 6,
                    type: 0,
                    age: 2,
                    name: "bat",
                    desc: "Damage: 20\n Soider: 15",
                    src: "bat_1",
                    iPad: 1.3,
                    length: 110,
                    width: 180,
                    xOff: -8,
                    yOff: 53,
                    dmg: 20,
                    knock: 0.7,
                    range: 110,
                    gather: 1,
                    speed: 300
                  }, {
                    id: 7,
                    type: 0,
                    age: 2,
                    name: "daggers",
                    desc: "Damage: 20\n Solider: 15",
                    src: "dagger_1",
                    iPad: 0.8,
                    length: 110,
                    width: 110,
                    xOff: 18,
                    yOff: 0,
                    dmg: 20,
                    knock: 0.1,
                    range: 65,
                    gather: 1,
                    hitSlow: 0.1,
                    spdMult: 1.13,
                    speed: 100
                  }, {
                    id: 8,
                    type: 0,
                    age: 2,
                    name: "stick",
                    desc: "Damage: 1\n Gather: 7",
                    src: "stick_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 1,
                    spdMult: 1,
                    range: 70,
                    gather: 7,
                    speed: 400
                  }, {
                    id: 9,
                    type: 1,
                    age: 6,
                    name: "hunting Bow",
                    desc: "Damage: 25\n Soider: 19",
                    src: "bow_1",
                    req: ["Wood", 4],
                    length: 120,
                    width: 120,
                    xOff: -6,
                    yOff: 0,
                    Pdmg: 25,
                    projectile: 0,
                    spdMult: 0.75,
                    speed: 600
                  }, {
                    id: 10,
                    type: 1,
                    age: 6,
                    name: "great Hammer",
                    desc: "Damage: 10\n Soider: 8",
                    src: "great_hammer_1",
                    length: 140,
                    width: 140,
                    xOff: -9,
                    yOff: 25,
                    dmg: 10,
                    Pdmg: 10,
                    spdMult: 0.88,
                    range: 75,
                    sDmg: 7.5,
                    gather: 1,
                    speed: 400
                  }, {
                    id: 11,
                    type: 1,
                    age: 6,
                    name: "wooden Shield",
                    desc: "Defends you from Gang-Bangers.",
                    src: "shield_1",
                    length: 120,
                    width: 120,
                    shield: 0.2,
                    xOff: 6,
                    yOff: 0,
                    Pdmg: 0,
                    spdMult: 0.7
                  }, {
                    id: 12,
                    type: 1,
                    age: 8,
                    pre: 9,
                    name: "crossbow",
                    desc: "",
                    src: "crossbow_1",
                    req: ["Wood", 5, "Damage", 35, "Solider", 26],
                    aboveHand: true,
                    armS: 0.75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    yOff: 0,
                    Pdmg: 35,
                    projectile: 2,
                    spdMult: 0.7,
                    speed: 700
                  }, {
                    id: 13,
                    type: 1,
                    age: 9,
                    pre: 12,
                    name: "repeater Crossbow",
                    desc: "",
                    src: "crossbow_2",
                    req: ["Wood", 10, "Damage", 30, "Solider", 23],
                    aboveHand: true,
                    armS: 0.75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    yOff: 0,
                    Pdmg: 30,
                    projectile: 3,
                    spdMult: 0.7,
                    speed: 230
                  }, {
                    id: 14,
                    type: 1,
                    age: 6,
                    name: "mc Grabby",
                    desc: "",
                    src: "grab_1",
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 0,
                    Pdmg: 0,
                    steal: 250,
                    knock: 0.2,
                    spdMult: 1.05,
                    range: 125,
                    gather: 0,
                    speed: 700
                  }, {
                    id: 15,
                    type: 1,
                    age: 9,
                    pre: 12,
                    name: "musket",
                    desc: "",
                    src: "musket_1",
                    req: ["Stone", 10, "Damage", 50, "Solider", 38],
                    aboveHand: true,
                    rec: 0.35,
                    armS: 0.6,
                    hndS: 0.3,
                    hndD: 1.6,
                    length: 205,
                    width: 205,
                    xOff: 25,
                    yOff: 0,
                    Pdmg: 50,
                    projectile: 5,
                    hideProjectile: true,
                    spdMult: 0.6,
                    speed: 1500
                  }];
                    // ITEMS:
                    this.list = [{
                        group: this.groups[0],
                        name: "apple",
                        desc: "restores 20 health when consumed",
                        req: ["food", 10],
                        consume: function (doer) {
                            return doer.changeHealth(20, doer);
                        },
                        scale: 22,
                        holdOffset: 15,
                        healing: 20,
                        itemID: 0,
                        itemAID: 16,
                    }, {
                        age: 3,
                        group: this.groups[0],
                        name: "cookie",
                        desc: "restores 40 health when consumed",
                        req: ["food", 15],
                        consume: function (doer) {
                            return doer.changeHealth(40, doer);
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 40,
                        itemID: 1,
                        itemAID: 17,
                    }, {
                        age: 7,
                        group: this.groups[0],
                        name: "cheese",
                        desc: "restores 30 health and another 50 over 5 seconds",
                        req: ["food", 25],
                        consume: function (doer) {
                            if (doer.changeHealth(30, doer) || doer.health < 100) {
                                doer.dmgOverTime.dmg = -10;
                                doer.dmgOverTime.doer = doer;
                                doer.dmgOverTime.time = 5;
                                return true;
                            }
                            return false;
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 30,
                        itemID: 2,
                        itemAID: 18,
                    }, {
                        group: this.groups[1],
                        name: "wood wall",
                        desc: "provides protection for your village",
                        req: ["wood", 10],
                        projDmg: true,
                        health: 380,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 3,
                        itemAID: 19,
                    }, {
                        age: 3,
                        group: this.groups[1],
                        name: "stone wall",
                        desc: "provides improved protection for your village",
                        req: ["stone", 25],
                        health: 900,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 4,
                        itemAID: 20,
                    }, {
                        age: 7,
                        group: this.groups[1],
                        name: "castle wall",
                        desc: "provides powerful protection for your village",
                        req: ["stone", 35],
                        health: 1500,
                        scale: 52,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 5,
                        itemAID: 21,
                    }, {
                        group: this.groups[2],
                        name: "spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 20, "stone", 5],
                        health: 400,
                        dmg: 20,
                        scale: 49,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 6,
                        itemAID: 22,
                    }, {
                        age: 5,
                        group: this.groups[2],
                        name: "greater spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 10],
                        health: 500,
                        dmg: 35,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 7,
                        itemAID: 23,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "poison spikes",
                        desc: "poisons enemies when they touch them",
                        req: ["wood", 35, "stone", 15],
                        health: 600,
                        dmg: 30,
                        pDmg: 5,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 8,
                        itemAID: 24,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "spinning spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 20],
                        health: 500,
                        dmg: 45,
                        turnSpeed: 0.00,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 9,
                        itemAID: 25,
                    }, {
                        group: this.groups[3],
                        name: "windmill",
                        desc: "generates gold over time",
                        req: ["wood", 50, "stone", 10],
                        health: 400,
                        pps: 1,
                        turnSpeed: 0.0016,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 10,
                        itemAID: 26,
                    }, {
                        age: 5,
                        group: this.groups[3],
                        name: "faster windmill",
                        desc: "generates more gold over time",
                        req: ["wood", 60, "stone", 20],
                        health: 500,
                        pps: 1.5,
                        turnSpeed: 0.0025,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 11,
                        itemAID: 27,
                    }, {
                        age: 8,
                        group: this.groups[3],
                        name: "power mill",
                        desc: "generates more gold over time",
                        req: ["wood", 100, "stone", 50],
                        health: 800,
                        pps: 2,
                        turnSpeed: 0.005,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 12,
                        itemAID: 28,
                    }, {
                        age: 5,
                        group: this.groups[4],
                        type: 2,
                        name: "mine",
                        desc: "allows you to mine stone",
                        req: ["wood", 20, "stone", 100],
                        iconLineMult: 12,
                        scale: 65,
                        holdOffset: 20,
                        placeOffset: 0,
                        itemID: 13,
                        itemAID: 29,
                    }, {
                        age: 5,
                        group: this.groups[11],
                        type: 0,
                        name: "sapling",
                        desc: "allows you to farm wood",
                        req: ["wood", 150],
                        iconLineMult: 12,
                        colDiv: 0.5,
                        scale: 110,
                        holdOffset: 50,
                        placeOffset: -15,
                        itemID: 14,
                        itemAID: 30,
                    }, {
                        age: 4,
                        group: this.groups[5],
                        name: "pit trap",
                        desc: "pit that traps enemies if they walk over it",
                        req: ["wood", 30, "stone", 30],
                        trap: true,
                        ignoreCollision: true,
                        hideFromEnemy: true,
                        health: 500,
                        colDiv: 0.2,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        alpha: 0.6,
                        itemID: 15,
                        itemAID: 31,
                    }, {
                        age: 4,
                        group: this.groups[6],
                        name: "boost pad",
                        desc: "provides boost when stepped on",
                        req: ["stone", 20, "wood", 5],
                        ignoreCollision: true,
                        boostSpeed: 1.5,
                        health: 150,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 16,
                        itemAID: 32,
                    }, {
                        age: 7,
                        group: this.groups[7],
                        doUpdate: true,
                        name: "turret",
                        desc: "defensive structure that shoots at enemies",
                        req: ["wood", 200, "stone", 150],
                        health: 800,
                        projectile: 1,
                        shootRange: 700,
                        shootRate: 2200,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 17,
                        itemAID: 33,
                    }, {
                        age: 7,
                        group: this.groups[8],
                        name: "platform",
                        desc: "platform to shoot over walls and cross over water",
                        req: ["wood", 20],
                        ignoreCollision: true,
                        zIndex: 1,
                        health: 300,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 18,
                        itemAID: 34,
                    }, {
                        age: 7,
                        group: this.groups[9],
                        name: "healing pad",
                        desc: "standing on it will slowly heal you",
                        req: ["wood", 30, "food", 10],
                        ignoreCollision: true,
                        healCol: 15,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 19,
                        itemAID: 35,
                    }, {
                        age: 9,
                        group: this.groups[10],
                        name: "spawn pad",
                        desc: "you will spawn here when you die but it will dissapear",
                        req: ["wood", 100, "stone", 100],
                        health: 400,
                        ignoreCollision: true,
                        spawnPoint: true,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 20,
                        itemAID: 36,
                    }, {
                        age: 7,
                        group: this.groups[12],
                        name: "blocker",
                        desc: "blocks building in radius",
                        req: ["wood", 30, "stone", 25],
                        ignoreCollision: true,
                        blocker: 300,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 21,
                        itemAID: 37,
                    }, {
                        age: 7,
                        group: this.groups[13],
                        name: "teleporter",
                        desc: "teleports you to a random point on the map",
                        req: ["wood", 60, "stone", 60],
                        ignoreCollision: true,
                        teleport: true,
                        health: 200,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 22,
                        itemAID: 38
                    }];

                    // CHECK ITEM ID:
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 :
                            [3, 4, 5].includes(id) ? 1 :
                            [6, 7, 8, 9].includes(id) ? 2 :
                            [10, 11, 12].includes(id) ? 3 :
                            [13, 14].includes(id) ? 5 :
                            [15, 16].includes(id) ? 4 :
                            [17, 18, 19, 21, 22].includes(id) ?
                                [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ?
                                [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }

                    // ASSIGN IDS:
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }
                }
            }
                   /*// TROLOLOLOL:
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                        //shuffle(this.list);
                    }
                }
            }*/
            class Objectmanager {
                constructor(GameObject, gameObjects, UTILS, config, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;
                    this.ignoreAdd = false;
                    this.hitObj = [];
                    // DISABLE OBJ:
                    this.disableObj = function (obj) {
                        obj.active = false;
                        if (config.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };
                    // ADD NEW:
                    let tmpObj;
                    this.add = function (sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = findObjectBySid(sid);
                        if (!tmpObj) {
                            tmpObj = gameObjects.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new GameObject(sid);
                                gameObjects.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };
                    // DISABLE BY SID:
                    this.disableBySid = function (sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function (sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                    // CHECK IF PLACABLE:
                    this.checkItemLocation = function (x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
                        return true;
                    };

                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, config, UTILS, server) {
                    // INIT:
                    this.init = function (indx, x, y, dir, spd, dmg, rng, scl, owner) {
                        this.active = true;
                        this.tickActive = true;
                        this.indx = indx;
                        this.x = x;
                        this.y = y;
                        this.x2 = x;
                        this.y2 = y;
                        this.dir = dir;
                        this.skipMov = true;
                        this.speed = spd;
                        this.dmg = dmg;
                        this.scale = scl;
                        this.range = rng;
                        this.r2 = rng;
                        this.owner = owner;
                    };
                    // UPDATE:
                    this.update = function (delta) {
                        if (this.active) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x += tmpSpeed * Math.cos(this.dir);
                                this.y += tmpSpeed * Math.sin(this.dir);
                                this.range -= tmpSpeed;
                                if (this.range <= 0) {
                                    this.x += this.range * Math.cos(this.dir);
                                    this.y += this.range * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.range = 0;
                                    this.active = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                    this.tickUpdate = function (delta) {
                        if (this.tickActive) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x2 += tmpSpeed * Math.cos(this.dir);
                                this.y2 += tmpSpeed * Math.sin(this.dir);
                                this.r2 -= tmpSpeed;
                                if (this.r2 <= 0) {
                                    this.x2 += this.r2 * Math.cos(this.dir);
                                    this.y2 += this.r2 * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.r2 = 0;
                                    this.tickActive = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                }
            };
            class Store {
                constructor() {
                    // STORE HATS:
                    this.hats = [{
                        id: 45,
                        name: "Shame!",
                        dontSell: true,
                        price: 0,
                        scale: 120,
                        desc: "hacks are for winners"
                    }, {
                        id: 51,
                        name: "Moo Cap",
                        price: 0,
                        scale: 120,
                        desc: "coolest mooer around"
                    }, {
                        id: 50,
                        name: "Apple Cap",
                        price: 0,
                        scale: 120,
                        desc: "apple farms remembers"
                    }, {
                        id: 28,
                        name: "Moo Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 29,
                        name: "Pig Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 30,
                        name: "Fluff Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 36,
                        name: "Pandou Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 37,
                        name: "Bear Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 38,
                        name: "Monkey Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 44,
                        name: "Polar Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 35,
                        name: "Fez Hat",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 42,
                        name: "Enigma Hat",
                        price: 0,
                        scale: 120,
                        desc: "join the enigma army"
                    }, {
                        id: 43,
                        name: "Blitz Hat",
                        price: 0,
                        scale: 120,
                        desc: "hey everybody i'm blitz"
                    }, {
                        id: 49,
                        name: "Bob XIII Hat",
                        price: 0,
                        scale: 120,
                        desc: "like and subscribe"
                    }, {
                        id: 57,
                        name: "Pumpkin",
                        price: 50,
                        scale: 120,
                        desc: "Spooooky"
                    }, {
                        id: 8,
                        name: "Bummle Hat",
                        price: 100,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Straw Hat",
                        price: 500,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Winter Cap",
                        price: 600,
                        scale: 120,
                        desc: "allows you to move at normal speed in snow",
                        coldM: 1
                    }, {
                        id: 5,
                        name: "Cowboy Hat",
                        price: 1000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Ranger Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 18,
                        name: "Explorer Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 31,
                        name: "Flipper Hat",
                        price: 2500,
                        scale: 120,
                        desc: "have more control while in water",
                        watrImm: true
                    }, {
                        id: 1,
                        name: "Marksman Cap",
                        price: 3000,
                        scale: 120,
                        desc: "increases arrow speed and range",
                        aMlt: 1.3
                    }, {
                        id: 10,
                        name: "Bush Gear",
                        price: 3000,
                        scale: 160,
                        desc: "allows you to disguise yourself as a bush"
                    }, {
                        id: 48,
                        name: "Halo",
                        price: 3000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 6,
                        name: "Soldier Helmet",
                        price: 4000,
                        scale: 120,
                        desc: "reduces damage taken but slows movement",
                        spdMult: 0.94,
                        dmgMult: 0.75
                    }, {
                        id: 23,
                        name: "Anti Venom Gear",
                        price: 4000,
                        scale: 120,
                        desc: "makes you immune to poison",
                        poisonRes: 1
                    }, {
                        id: 13,
                        name: "Medic Gear",
                        price: 5000,
                        scale: 110,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 9,
                        name: "Miners Helmet",
                        price: 5000,
                        scale: 120,
                        desc: "earn 1 extra gold per resource",
                        extraGold: 1
                    }, {
                        id: 32,
                        name: "Musketeer Hat",
                        price: 5000,
                        scale: 120,
                        desc: "reduces cost of projectiles",
                        projCost: 0.5
                    }, {
                        id: 7,
                        name: "Bull Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "increases damage done but drains health",
                        healthRegen: -5,
                        dmgMultO: 1.5,
                        spdMult: 0.96
                    }, {
                        id: 22,
                        name: "Emp Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "turrets won't attack but you move slower",
                        antiTurret: 1,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        name: "Booster Hat",
                        price: 6000,
                        scale: 120,
                        desc: "increases your movement speed",
                        spdMult: 1.16
                    }, {
                        id: 26,
                        name: "Barbarian Armor",
                        price: 8000,
                        scale: 120,
                        desc: "knocks back enemies that attack you",
                        dmgK: 0.6
                    }, {
                        id: 21,
                        name: "Plague Mask",
                        price: 10000,
                        scale: 120,
                        desc: "melee attacks deal poison damage",
                        poisonDmg: 5,
                        poisonTime: 6
                    }, {
                        id: 46,
                        name: "Bull Mask",
                        price: 10000,
                        scale: 120,
                        desc: "bulls won't target you unless you attack them",
                        bullRepel: 1
                    }, {
                        id: 14,
                        name: "Windmill Hat",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "generates points while worn",
                        pps: 1.5
                    }, {
                        id: 11,
                        name: "Spike Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "deal damage to players that damage you",
                        dmg: 0.45
                    }, {
                        id: 53,
                        name: "Turret Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "you become a walking turret",
                        turret: {
                            proj: 1,
                            range: 700,
                            rate: 2500
                        },
                        spdMult: 0.7
                    }, {
                        id: 20,
                        name: "Samurai Armor",
                        price: 12000,
                        scale: 120,
                        desc: "increased attack speed and fire rate",
                        atkSpd: 0.78
                    }, {
                        id: 58,
                        name: "Dark Knight",
                        price: 12000,
                        scale: 120,
                        desc: "restores health when you deal damage",
                        healD: 0.4
                    }, {
                        id: 27,
                        name: "Scavenger Gear",
                        price: 15000,
                        scale: 120,
                        desc: "earn double points for each kill",
                        kScrM: 2
                    }, {
                        id: 40,
                        name: "Tank Gear",
                        price: 15000,
                        scale: 120,
                        desc: "increased damage to buildings but slower movement",
                        spdMult: 0.3,
                        bDmg: 3.3
                    }, {
                        id: 52,
                        name: "Thief Gear",
                        price: 15000,
                        scale: 120,
                        desc: "steal half of a players gold when you kill them",
                        goldSteal: 0.5
                    }, {
                        id: 55,
                        name: "Bloodthirster",
                        price: 20000,
                        scale: 120,
                        desc: "Restore Health when dealing damage. And increased damage",
                        healD: 0.25,
                        dmgMultO: 1.2,
                    }, {
                        id: 56,
                        name: "Assassin Gear",
                        price: 20000,
                        scale: 120,
                        desc: "Go invisible when not moving. Can't eat. Increased speed",
                        noEat: true,
                        spdMult: 1.1,
                        invisTimer: 1000
                    }];

                    // STORE ACCESSORIES:
                    this.accessories = [{
                        id: 12,
                        name: "Snowball",
                        price: 1000,
                        scale: 105,
                        xOff: 18,
                        desc: "no effect"
                    }, {
                        id: 9,
                        name: "Tree Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 10,
                        name: "Stone Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 3,
                        name: "Cookie Cape",
                        price: 1500,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 8,
                        name: "Cow Cape",
                        price: 2000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 11,
                        name: "Monkey Tail",
                        price: 2000,
                        scale: 97,
                        xOff: 25,
                        desc: "Super speed but reduced damage",
                        spdMult: 1.35,
                        dmgMultO: 0.2
                    }, {
                        id: 17,
                        name: "Apple Basket",
                        price: 3000,
                        scale: 80,
                        xOff: 12,
                        desc: "slowly regenerates health over time",
                        healthRegen: 1
                    }, {
                        id: 6,
                        name: "Winter Cape",
                        price: 3000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Skull Cape",
                        price: 4000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 5,
                        name: "Dash Cape",
                        price: 5000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Dragon Cape",
                        price: 6000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 1,
                        name: "Super Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 7,
                        name: "Troll Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 14,
                        name: "Thorns",
                        price: 10000,
                        scale: 115,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Blockades",
                        price: 10000,
                        scale: 95,
                        xOff: 15,
                        desc: "no effect"
                    }, {
                        id: 20,
                        name: "Devils Tail",
                        price: 10000,
                        scale: 95,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 16,
                        name: "Sawblade",
                        price: 12000,
                        scale: 90,
                        spin: true,
                        xOff: 0,
                        desc: "deal damage to players that damage you",
                        dmg: 0.15
                    }, {
                        id: 13,
                        name: "Angel Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 19,
                        name: "Shadow Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "increased movement speed",
                        spdMult: 1.1
                    }, {
                        id: 18,
                        name: "Blood Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "restores health when you deal damage",
                        healD: 0.2
                    }, {
                        id: 21,
                        name: "Corrupt X Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "deal damage to players that damage you",
                        dmg: 0.25
                    }];
                }
            };
            class ProjectileManager {
                constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                    this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
                        let tmpData = items.projectiles[indx];
                        let tmpProj;
                        for (let i = 0; i < projectiles.length; ++i) {
                            if (!projectiles[i].active) {
                                tmpProj = projectiles[i];
                                break;
                            }
                        }
                        if (!tmpProj) {
                            tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                            tmpProj.sid = projectiles.length;
                            projectiles.push(tmpProj);
                        }
                        tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                        tmpProj.ignoreObj = ignoreObj;
                        tmpProj.layer = layer || tmpData.layer;
                        tmpProj.inWindow = inWindow;
                        tmpProj.src = tmpData.src;
                        return tmpProj;
                    };
                }
            };
            class AiManager {

                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

                    // AI TYPES:
                    this.aiTypes = [{
                        id: 0,
                        src: "cow_1",
                        killScore: 150,
                        health: 500,
                        weightM: 0.8,
                        speed: 0.00095,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 50]
                    }, {
                        id: 1,
                        src: "pig_1",
                        killScore: 200,
                        health: 800,
                        weightM: 0.6,
                        speed: 0.00085,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 80]
                    }, {
                        id: 2,
                        name: "Free Gold",
                        src: "bull_2",
                        hostile: true,
                        dmg: 20,
                        killScore: 1000,
                        health: 1800,
                        weightM: 0.5,
                        speed: 0.00094,
                        turnSpeed: 0.00074,
                        scale: 78,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 3,
                        name: "Free Gold",
                        src: "bull_1",
                        hostile: true,
                        dmg: 20,
                        killScore: 2000,
                        health: 2800,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.0008,
                        scale: 90,
                        viewRange: 900,
                        chargePlayer: true,
                        drop: ["food", 400]
                    }, {
                        id: 4,
                        name: "My Slave",
                        src: "wolf_1",
                        hostile: true,
                        dmg: 8,
                        killScore: 500,
                        health: 300,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.002,
                        scale: 84,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 200]
                    }, {
                        id: 5,
                        name: "Me Mega Boob",
                        src: "chicken_1",
                        dmg: 8,
                        killScore: 2000,
                        noTrap: true,
                        health: 300,
                        weightM: 0.2,
                        speed: 0.0018,
                        turnSpeed: 0.006,
                        scale: 70,
                        drop: ["food", 100]
                    }, {
                        id: 6,
                        name: "Litteraly a asshole",
                        nameScale: 50,
                        src: "enemy",
                        hostile: true,
                        dontRun: true,
                        fixedSpawn: true,
                        spawnDelay: 60000,
                        noTrap: true,
                        colDmg: 100,
                        dmg: 40,
                        killScore: 8000,
                        health: 18000,
                        weightM: 0.4,
                        speed: 0.0007,
                        turnSpeed: 0.01,
                        scale: 80,
                        spriteMlt: 1.8,
                        leapForce: 0.9,
                        viewRange: 1000,
                        hitRange: 210,
                        hitDelay: 1000,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 7,
                        name: "Treasure",
                        hostile: true,
                        nameScale: 35,
                        src: "crate_1",
                        fixedSpawn: true,
                        spawnDelay: 120000,
                        colDmg: 200,
                        killScore: 5000,
                        health: 20000,
                        weightM: 0.1,
                        speed: 0.0,
                        turnSpeed: 0.0,
                        scale: 70,
                        spriteMlt: 1.0
                    }, {
                        id: 8,
                        name: "Asshole's Pet",
                        src: "wolf_2",
                        hostile: true,
                        fixedSpawn: true,
                        dontRun: true,
                        hitScare: 4,
                        spawnDelay: 30000,
                        noTrap: true,
                        nameScale: 35,
                        dmg: 10,
                        colDmg: 100,
                        killScore: 3000,
                        health: 7000,
                        weightM: 0.45,
                        speed: 0.0015,
                        turnSpeed: 0.002,
                        scale: 90,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 1000]
                    }, {
                        id: 9,
                        name: "💀Asshole's Pet",
                        src: "wolf_2",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        spawnDelay: 6e4,
                        noTrap: !0,
                        nameScale: 35,
                        dmg: 12,
                        colDmg: 100,
                        killScore: 3e3,
                        health: 9e3,
                        weightM: .45,
                        speed: .0015,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 3e3],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 10,
                        name: "💀My Slave",
                        src: "wolf_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        spawnDelay: 3e4,
                        dmg: 10,
                        killScore: 700,
                        health: 500,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 88,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 400],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 11,
                        name: "💀Free Gold",
                        src: "bull_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        dmg: 20,
                        killScore: 5e3,
                        health: 5e3,
                        spawnDelay: 1e5,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 800],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }];
                    // SPAWN AI:
                    this.spawn = function (x, y, dir, index) {
                        let tmpObj = ais.find((tmp) => !tmp.active);
                        if (!tmpObj) {
                            tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                            ais.push(tmpObj);
                        }
                        tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                        return tmpObj;
                    };
                }

            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
                    // INIT:
                    this.init = function (x, y, dir, index, data) {
                        this.x = x;
                        this.y = y;
                        this.startX = data.fixedSpawn ? x : null;
                        this.startY = data.fixedSpawn ? y : null;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.zIndex = 0;
                        this.dir = dir;
                        this.dirPlus = 0;
                        this.index = index;
                        this.src = data.src;
                        if (data.name) this.name = data.name;
                        this.weightM = data.weightM;
                        this.speed = data.speed;
                        this.killScore = data.killScore;
                        this.turnSpeed = data.turnSpeed;
                        this.scale = data.scale;
                        this.maxHealth = data.health;
                        this.leapForce = data.leapForce;
                        this.health = this.maxHealth;
                        this.chargePlayer = data.chargePlayer;
                        this.viewRange = data.viewRange;
                        this.drop = data.drop;
                        this.dmg = data.dmg;
                        this.hostile = data.hostile;
                        this.dontRun = data.dontRun;
                        this.hitRange = data.hitRange;
                        this.hitDelay = data.hitDelay;
                        this.hitScare = data.hitScare;
                        this.spriteMlt = data.spriteMlt;
                        this.nameScale = data.nameScale;
                        this.colDmg = data.colDmg;
                        this.noTrap = data.noTrap;
                        this.spawnDelay = data.spawnDelay;
                        this.hitWait = 0;
                        this.waitCount = 1000;
                        this.moveCount = 0;
                        this.targetDir = 0;
                        this.active = true;
                        this.alive = true;
                        this.runFrom = null;
                        this.chargeTarget = null;
                        this.dmgOverTime = {};
                    };

                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function (delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // ANIMATION:
                    this.startAnim = function () {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                };

            };
            class Petal {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.damage = 10;
                    this.health = 10;
                    this.maxHealth = this.health;
                    this.active = false;
                    this.alive = false;
                    this.timer = 1500;
                    this.time = 0;
                    this.damaged = 0;
                    this.alpha = 1;
                    this.scale = 9;
                    this.visScale = this.scale;
                }
            };
            class addCh {
                constructor(x, y, chat, tmpObj) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = tmpObj;
                };
            };
            class DeadPlayer {
                constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
                    this.x = x;
                    this.y = y;
                    this.lastDir = dir;
                    this.dir = dir + Math.PI;
                    this.buildIndex = buildIndex;
                    this.weaponIndex = weaponIndex;
                    this.weaponVariant = weaponVariant;
                    this.skinColor = skinColor;
                    this.scale = scale;
                    this.visScale = 0;
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        if (d2 > 0.01) {
                            this.dir += d2 / 20;
                        } else {
                            this.dir = this.lastDir;
                        }
                        if (this.visScale < this.scale) {
                            this.visScale += delta / (this.scale / 2);
                            if (this.visScale >= this.scale) {
                                this.visScale = this.scale;
                            }
                        }
                        this.alpha -= delta / 30000;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                    this.id = id;
                    this.sid = sid;
                    this.tmpScore = 0;
                    this.team = null;
                    this.latestSkin = 0;
                    this.oldSkinIndex = 0;
                    this.skinIndex = 0;
                    this.latestTail = 0;
                    this.oldTailIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.lastHit = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.points = 0;
                    this.dt = 0;
                    this.hidden = false;
                    this.itemCounts = {};
                    this.isPlayer = true;
                    this.pps = 0;
                    this.moveDir = undefined;
                    this.skinRot = 0;
                    this.lastPing = 0;
                    this.iconIndex = 0;
                    this.skinColor = 0;
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.maxSpeed = 1;
                    this.chat = {
                        message: null,
                        count: 0
                    };
                    this.backupNobull = true;
                    this.cAngle = 0;

                    // SPAWN:
                    this.spawn = function (moofoll) {
                        this.attacked = false;
                        this.death = false;
                        this.spinDir = 0;
                        this.sync = false;
                        this.antiBull = 0;
                        this.bullTimer = 0;
                        this.poisonTimer = 0;
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.gatherIndex = 0;
                        this.shooting = {};
                        this.shootIndex = 9;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.weaponCode = 0;
                        this.weaponVariant = 0;
                        this.primaryIndex = undefined;
                        this.secondaryIndex = undefined;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.oldXY = {
                            x: 0,
                            y: 0
                        };
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.damaged = 0;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            53: 0,
                        };
                        this.bowThreat = {
                            9: 0,
                            12: 0,
                            13: 0,
                            15: 0,
                        };
                        //this.damageThreat = 0;
                        this.inTrap = false;
                        this.canEmpAnti = false;
                        this.empAnti = false;
                        this.soldierAnti = false;
                        this.poisonTick = 0;
                        this.bullTick = 0;
                        this.setPoisonTick = false;
                        this.setBullTick = false;
                        this.antiTimer = 2;
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function () {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function (moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // ADD ITEM:
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };

                    // SET DATA:
                    this.setData = function (data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };

                    // UPDATE POISON TICK:
                    this.updateTimer = function() {

                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = config.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer <= 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = config.serverUpdateRate;
                        }

                    };
this.update = function(delta) {
    if (this.sid == playerSID) {
    }
    if (this.active) {
        // MOVE:
        let gear = {
            skin: findID(hats, this.skinIndex),
            tail: findID(accessories, this.tailIndex)
        }
        let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
        this.maxSpeed = spdMult;
    }
};

                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // GATHER ANIMATION:
                    this.startAnim = function (didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };

                    // SHAME SYSTEM:
                    this.judgeShame = function () {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = game.tick - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = game.tick;
                        }
                    };
                    this.addShameTimer = function () {
                        this.shameCount = 0;
                        this.shameTimer = 30;
                        let interval = setInterval(() => {
                            this.shameTimer--;
                            if (this.shameTimer <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    };

                    // CHECK TEAM:
                    this.isTeam = function (tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };

                    // FOR THE PLAYER:
                    this.findAllianceBySid = function (sid) {
                        return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
                    };
this.checkCanInsta = function (nobull) {
    let niglet = 0;
    if (this.alive && inGame) {
        let primary = {
            weapon: this.weapons[0],
            variant: this.primaryVariant,
            dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
        };
        let secondary = {
            weapon: this.weapons[1],
            variant: this.secondaryVariant,
            dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
        };
        let bull = this.skins[7] && near.skinIndex != 6 ? 1.5 : 1;
        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
        if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
            niglet += primary.dmg * pV * bull;
        }
        if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
            niglet += secondary.dmg;
        }
        if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
            niglet += 25;
        }
        niglet *= near.skinIndex == 6 ? 0.75 : 1;
        return niglet;
    }
    return 0;
};
                    // UPDATE WEAPON RELOAD:
                    this.manageReload = function () {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                // PREPLACER
/*if (!this.enemies[0]) return;
        const relevantBuildings = this.gameObjects.filter(e => e.volatile && Utils.getDist(e, this.player, 0, 2) <= this.player.scale * 2 + 45);
        const fPB = new Array(), { placed } = this;
        if (this.hitDetect.length) for (let i = this.hitDetect.length; i--; ) {
            const scope = this.hitDetect[i];
            let objToPlace = this.player.items[4];
            let objHeap = [];
            if (relevantBuildings.length) {
                if (objToPlace) {
                    for (let j = relevantBuildings.length; j--; ) {
                        const currentObject = relevantBuildings[j];
                        let tmpObj = Object.assign(this.createTempObject(), this.getPosFromAngle(objToPlace, Utils.getAngle(currentObject, this.player, 0, 2)));
                        let tmpScore = 0;

                        if (this.enemies[0].inTrap && Utils.getDist(tmpObj, this.enemies[0].inTrap) <= this.enemies[0].scale / 2) {
                            objToPlace = this.collisionDetection(tmpObj, this.enemies[0], 45) ? this.player.items[4] : this.player.items[2];
                            tmpScore++;
                        } else objToPlace = this.player.items[4];

                        objHeap.push({
                            building: currentObject,
                            tObject: tmpObj,
                            object: objToPlace,
                            uScore: tmpScore,
                        });
                    }
                } else objToPlace = this.player.items[2];
                if (objHeap.length) for(let j = 0; j < objHeap.length; j++) {
                    const SCOPE = objHeap[j];
                    const { building, object, tObject, uScore } = SCOPE;
                    if (!building.volatile) continue;
                    fPB.push(SCOPE);
                    for (let k = 0; k < fPB.length - 1; k++) { //leave last object
                        const currentObject = fPB[k];
                        if (!currentObject || currentObject.tObject === tObject || currentObject.building === building) {
                            fPB.splice(k, 1);
                            k--;
                            continue;
                        }
                        if (placed.length) for (let l = 0; l < placed.length; l++) {
                            if (!placed[l]) continue;
                            if (this.collisionDetection(placed[l].tObject, currentObject.tObject, placed[l].tObject.scale + currentObject.tObject.scale)) {
                                fPB.splice(k, 1);
                                k--;
                                break;
                            }
                        };
                        if (uScore > currentObject.uScore) {
                            fPB.splice(k, 1, SCOPE);
                            k--;
                        }
                    }
                    //try some spike sync shit
                };
                let objectCard = fPB.sort((a, b) => b.uScore - a.uScore);
                if (!objectCard.length) return;
                const highestUScore = objectCard.reduce((max, card) => card.uScore > max ? card.uScore : max, 0);
                //lets do some math
                const factorializedAverage = 0//(max(...numberizedUScoreArray) * (max(...numberizedUScoreArray) + 1)) / 2 / max(...numberizedUScoreArray);
                const hMUsA = 0//Utils.calculateHarmonicMean(numberizedUScoreArray);
                const avgUScore = objectCard.reduce((sum, card) => sum + card.uScore, 0) / objectCard.length || 0;
                const numberizedUScoreArray = objectCard.map(e => e.uScore);
                console.log(avgUScore + ' / ' + factorializedAverage + ' / ' + hMUsA);
                if (Utils.getDist(objectCard[0].building, this.player, 0, 2) <= this.player.scale * 2) {
                    if (objectCard[0].uScale === 0) {

                    };
                    this.place(objectCard[0].object, Utils.getAngle(objectCard[0].building, this.player, 0, 2));
                    addChatEntry("Debug", `Preplaced: ${Utils.getDist(objectCard[0].building, this.player, 0, 2).toFixed(3)}`, 'orange');
                    placed.push(objectCard[0]);
                };


                //if its not greater than 0 than theres no valid placement tick and its all ass so autoplace it (relives packet use)
                // Use avgUScore as needed

                //once we have selected the building we want to place we do the actuall placing part
                //lets make a simulation if the building will fit
            }
        };
        this.hitDetect = this.potentialHits.filter(({ player, tick }) => {
            if (this.tick - tick >= 2) return false;
            const reloadType = player.weaponIndex < 9 ? "primary" : "secondary";
            if (player[`${reloadType}Reload`] === 1 && this.players.some(tmpObj => player.sid === tmpObj.sid)) {
                return true;
            }
            return false;
        });
        for (let i = 0; i < this.players.length; i++) {
            const { primaryReload, secondaryReload, weaponIndex } = this.players[i];
            const { speed } = this.items.weapons[weaponIndex];
            const val = (weaponIndex < 9 ? primaryReload : secondaryReload) + timeBetweenTick / speed;
            if (val >= 1 && val <= 1.2) {
                this.potentialHits.push({ player: this.players[i], tick: this.tick, objects: this.potentialObjects });
            }
        };*/
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                    if (this == player) {
                                        if (settings.autogrind.enabled) {
                                            for (let i = 0; i < Math.PI * 2; i+= Math.PI / 2) {
                                                millplacer(player.getItemType(22), i);
                                            }
                                        }
                                    }
                                    if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                                        this.antiBull++;
                                        game.tickBase(() => {
                                            this.antiBull = 0;
                                        }, 1);
                                    }
                                }
                            }
                        }
                    };
                }
            }
// DAMAGE POTENTIAL/DAMAGE PREDICTION:
/*this.addDamageThreat = function(tmpObj) {
    const weapon1 = tmpObj.primaryIndex !== undefined ? items.weapons[tmpObj.primaryIndex] : null;
    const weapon2 = tmpObj.secondaryIndex !== undefined ? items.weapons[tmpObj.secondaryIndex] : null;
    const bullMultiplier = 1.5;
    const msgCooldown = 2721;
    const primaryCooling = weapon1 === null || tmpObj.reloads[weapon1.id] === 0;
    const secondaryCooling = weapon2 === null || tmpObj.reloads[weapon2.id] === 0;
    const weapon1_variant_multi = weapon1 !== null && near.primaryVariant !== undefined ? config.weaponVariants[tmpObj.primaryVariant].val : 1.18;
    const weapon2_variant_multi = weapon2 !== null && tmpObj.secondaryVariant !== undefined ? ([9, 12, 13, 15].includes(weapon2.id) ? 1 : config.weaponVariants[tmpObj.secondaryVariant].val) : 1.18;
    let potentialDamage = 0;
    if (primaryCooling && weapon1 !== null) {
        potentialDamage += weapon1.dmg * weapon1_variant_multi * bullMultiplier;
    }
    if (secondaryCooling && weapon2 !== null) {
        potentialDamage += weapon2.Pdmg * weapon2_variant_multi;
    }
    if (tmpObj.reloads[53] <= game.tickRate) {
        potentialDamage += 25;
    }
    if (tmpObj.skinIndex === 6) {
        potentialDamage *= 0.75; // detects soldier so it decreses dmg
    } else if (near.skinIndex === 7) {
        potentialDamage *= 1.5; // detects bullhat so it adds more dmg predict
    }
    this.damageThreat += potentialDamage;
    if (!this.isTeam(tmpObj) && this.dist2 <= 300) {
        tmpObj.damageThreat += this.damageThreat;
    }
}
                }
};*/
            // SOME CODES:
            function sendUpgrade(index) {
                player.reloads[index] = 0;
                io.send("H", index);
            }
            /*function storeEquip(id, index) {
                io.send("c", 0, id, index);
            }

            function storeBuy(id, index) {
                io.send("c", 1, id, index);
            }*/
if ((track.force.soldierspike || track.force.soldier) && player.skinIndex != 6) {
    buyEquip(6, 0);
}
function buyEquip(id, index) {
    let nID = player.skins[6] ? 6 : 0;
    if (player.alive && inGame) {
        if (index == 0) {
            if (player.skins[id]) {
                if ((track.force.soldierspike || track.force.soldier) && player.skinIndex != 6) {
                    //io.send("c", 6, 0);
                    io.send("c", 0, 6, 0);
                } else {
                    if (player.latestSkin != id) {
                        io.send("c", 0, id, 0);
                    }
                }
            } else {
                if (tmpObj.isPlayer) {
                    let find = findID(hats, id);
                    if (find) {
                        if (player.points >= find.price) {
                            io.send("c", 1, id, 0);
                            io.send("c", 0, id, 0);
                        } else {
                            if (player.latestSkin != nID) {
                                io.send("c", 0, nID, 0);
                            }
                        }
                    } else {
                        if (player.latestSkin != nID) {
                            io.send("c", 0, nID, 0);
                        }
                    }
                } else {
                    if (player.latestSkin != nID) {
                        io.send("c", 0, nID, 0);
                    }
                }
            }
        } else if (index == 1) {
            if (useWasd && (id != 11 && id != 0)) {
                if (player.latestTail != 0) {
                    io.send("c", 0, 0, 1);
                }
                return;
            }
            if (player.tails[id]) {
                if (player.latestTail != id) {
                    io.send("c", 0, id, 1);
                }
            } else {
                if (tmpObj.isPlayer) {
                    let find = findID(accessories, id);
                    if (find) {
                        if (player.points >= find.price) {
                            io.send("c", 1, id, 1);
                            io.send("c", 0, id, 1);
                        } else {
                            if (player.latestTail != 0) {
                                io.send("c", 0, 0, 1);
                            }
                        }
                    } else {
                        if (player.latestTail != 0) {
                            io.send("c", 0, 0, 1);
                        }
                    }
                } else {
                    if (player.latestTail != 0) {
                        io.send("c", 0, 0, 1);
                    }
                }
            }
        }
    }
}

            function selectToBuild(index, wpn) {
                io.send("G", index, wpn);
            }

            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    player.weaponCode = index;
                }
                io.send("G", index, 1);
            }
            function sendMapPing() {
                io.send("S", 1);
            }
            function sendAutoGather() {
                io.send("K", 1, 1);
            }
            function sendAtck(id, angle) {
                io.send("d", id, angle, 1);
            }
function checkPredictedObjects(id, angle) {
    let item = items.list[E.items[id]];
    let tmpS = E.scale + item.scale + (item.placeOffset || 0);
    let tmpX = E.x2 + tmpS * Math.cos(angle);
    let tmpY = E.y2 + tmpS * Math.sin(angle);
    for (let i = 0; i < objectPredict.length; i++) {
        let _ = objectPredict[i];
        if (_ && Math.hypot(_.y - tmpY, _.x - tmpX) <= tmpS + _.scale) {
            return false;
        }
    }
    return true;
}
            // PLACER:
let objectPredict = [];
function place(id, rad, rmd) {
    try {
        if (id == undefined) return;

        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);

        if (id === 0 || (player.alive && inGame && shouldPlaceItem(id))) {
            selectToBuild(player.items[id]);
            sendAtck(1, rad);
            selectWeapon(player.weaponCode, 1);

            if ((rmd || id) && settings.show_place.enabled) {
                placeVisible.push({
                    x: tmpX,
                    y: tmpY,
                    name: item.name,
                    scale: item.scale,
                    dir: rad
                });

                game.tickBase(() => {
                    placeVisible.shift();
                }, 1);
            }
        }
    } catch (e) {
    }
}
function shouldPlaceItem(id, rad) {
    let item = items.list[player.items[id]];

    return player.alive && inGame && (
        player.itemCounts[item.group.id] == undefined ||
        player.itemCounts[item.group.id] < (
            config.isSandbox
                ? (id === 3 || id === 5 ? 297 : 297)
                : (item.group.limit ? item.group.limit : 297)
        ) || checkPredictedObjects(id, rad)
    );
}
function calculatePerfectAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
async function checkcanPlace(id, radian) {
    try {
        if (id === undefined) return;

        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let counts = {
            attempts: 0,
            placed: 0
        };
        let tmpObjects = [];
        gameObjects.forEach((p) => {
            tmpObjects.push({
                x: p.x,
                y: p.y,
                active: p.active,
                blocker: p.blocker,
                scale: p.scale,
                isItem: p.isItem,
                type: p.type,
                colDiv: p.colDiv,
                getScale: function(sM, ig) {
                    sM = sM || 1;
                    return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                },
            });
        });
        let first = -(Math.PI / 2);
        let repeat = (Math.PI / 2);
        let plus = (Math.PI / 18);
        const delay = 150;
        async function placeWithDelay(i) {
            setTimeout(async () => {
                counts.attempts++;
                let relAim = radian + i;
                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                if (cantPlace) return;
                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) return;
                place(id, relAim, 1);
                counts.placed++;
                tmpObjects.push({
                    x: tmpX,
                    y: tmpY,
                    active: true,
                    blocker: item.blocker,
                    scale: item.scale,
                    isItem: true,
                    type: null,
                    colDiv: item.colDiv,
                    getScale: function() {
                        return this.scale;
                    },
                });
            }, i * delay);
        }
        for (let i = first; i < repeat; i += plus) {
            await placeWithDelay(i);
        }
    } catch (err) {
        console.error(err);
    }
}
function checkPlace(id, radian, rad, rmd) {
    try {
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(radian);
        let tmpY = player.y2 + tmpS * Math.sin(radian);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            if (player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 297 : item.group.limit ? item.group.limit : 297)) {
                selectToBuild(player.items[id]);
                sendAtck(1, radian);
                selectWeapon(player.weaponCode, 1);
                if ((rmd || id) && settings.show_place.enabled) {
                    placeVisible.push({
                        x: tmpX,
                        y: tmpY,
                        name: item.name,
                        scale: item.scale,
                        dir: rad
                    });
                    game.tickBase(() => {
                        placeVisible.shift();
                    }, 1);
                }
            }
        }
    } catch (e) {
    }
}
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function toRadian(angle) {
                let fixedAngle = (angle * Math.PI / 180) % (2 * Math.PI);
                return fixedAngle > Math.PI ? Math.PI - fixedAngle : fixedAngle;
            }
            function sortFromSmallest(arr, func) {
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
//Adenosine Triphosphate Mod aka 'atm' autoplacer logic
function autoplace(penis, uziisbest, negro) {
    let nearobject = [];
    let randomDir = Math.random() * Math.PI * 2;
    const normalizeAngles = (angle1, angle2) => { // useless code, will be used soon
        angle1 = angle1 % (2 * Math.PI);
        angle2 = angle2 % (2 * Math.PI);
        let diff = Math.abs(angle1 - angle2);
        if (diff > Math.PI) {
            diff = (2 * Math.PI) - diff;
        }
        return diff;
    }
    if (gameObjects.length && enemy.length) {
        nearobject = gameObjects.filter((e) => e.trap).sort(function(a, b) {
            return (UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
        })[0];
    }
    if (!inGame || !enemy.length || !gameObjects.length) return;
    const placeSpeed = 0.3;
    const anglechecker = Math.min(maxplacement, Math.ceil(360 / (Math.PI / 2)));
    if (ticks.tick % (Math.max(0.5, parseInt(1)) || 1) === 0) {
        let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
        let nearbySpike = buildings.filter(obj => (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') && Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < player.scale + obj.scale + 20 && !obj.isTeamObject(player) && obj.active)[0];
        //const near2 = { inTrap: !!nearbySpike };
        if (nearbySpike) {
            if (isObjectBroken) {
                checkPlace(4, 0, enemy, nearbySpike);
            }
        } else {
            if (near.dist2 <= 150) {
                for (let i = 0; i < anglechecker; i++) {
                    checkPlace(2, randomDir + i * (Math.PI / 1) || anglechecker);
                }
            } else if (near.dist2 <= 350) {
                if (player.items[4] === 15) {
                    for (let i = 0; i < anglechecker; i++) {
                        checkPlace(4, randomDir + i * (Math.PI / 2) * anglechecker);
                    }
                }
            }
        }
    }
}
function preplacer() {
    if (!inGame || track.antiTrapped) {
        return;
    }
    const playerX = player.x4;
    const playerY = player.y4;
    const rangeSquared = (items.weapons[player.weaponIndex].range + 70) ** 2;
    gameObjects.forEach(tmpObj => {
        const distSquared = (tmpObj.x2 - playerX) ** 2 + (tmpObj.y2 - playerY) ** 2;
        if (tmpObj.buildHealth <= 50 && distSquared <= rangeSquared) {
            sendChat("preplace attempt");
            placeItem(4, tmpObj);
        }
    });
}
function placeItem(itemId, obj) {
    if (!player.items.includes(itemId)) {
        return;
    }
    const direction = UTILS.getDirect(obj, player, 0, 2);
    const placeX = player.x + Math.cos(direction) * 50;
    const placeY = player.y + Math.sin(direction) * 50;
    if (!isValidPlacement(placeX, placeY)) {
        sendChat("preplace is not valid");
        return;
    }
}
function isValidPlacement(x, y) {
    const minX = 0;
    const maxX = 800;
    const minY = 0;
    const maxY = 600;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return true;
    } else {
        return false;
    }
}
        /*}
    } else {
        if (nearobject) {
            let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
            let nearbySpike = buildings.filter(obj => (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') && Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < player.scale + obj.scale + 20 && !obj.isTeamObject(player) && obj.active)[0];
            const near2 = { inTrap: !!nearbySpike };
            if (!(player.sid != nearobject.owner.sid && !findAllianceBySid(nearobject.owner.sid)) && UTILS.getDist(nearobject, near, 0, 2) <= 70 && nearobject.active) {
                track.inTrap = true;
            } else {
                track.inTrap = false;
            }
            if (near.dist2 <= 300) {
                if (track.inTrap || near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8) {
                    if (near.dist2 <= 120) {
                        for (let i = 0; i < anglechecker; i++) {
                            checkPlace(2, randomDir + i * (Math.PI / 1) * anglechecker);
                        }
                    } else {
                        for (let i = 0; i < anglechecker; i++) {
                            checkPlace(2, randomDir + i * (Math.PI / 1) * anglechecker);
                        }
                    }
                } else {
                    if (player.items[4] == 15) {
                        if (near.dist2 <= 130) {
                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                                checkPlace(4, randomDir + i);
                            }
                            oldXY.x = player.x2;
                            oldXY.y = player.y2;
                        }
                    }
                }
            }
        } else {
            if (near.dist2 <= 250) {
                if (player.items[4] == 15) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                        checkPlace(4, randomDir + i);
                    }
                }
            }
        }
    }
}*/
function spiketicktest() {
    if (settings.spiketick.enabled) {
        this.isTrue = true;
        track.auto.aim = true;
        selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        buyEquip(18, 1);
        sendAutoGather();
        //checkcanPlace(2);
        game.tickBase(() => {
            if (player.reloads[53] == 0) {
                selectWeapon(player.weapons[0]);
                buyEquip(53, 0);
                buyEquip(18, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    track.auto.aim = false;
                }, 1);
            } else {
                sendAutoGather();
                this.isTrue = false;
                track.auto.aim = false;
            }
        }, 1);
    }
}
function millplacer(id, rad) { // self explanatory, made a simple mill placer angle checker
    try {
        if (id == undefined) return;
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            place(id, rad, 1);
        }
    } catch (e) {}
}
        function checkSecond(id, angle) {
            let item = items.list[player.items[id]];
            let scale = 35 + item.scale + (item.placeOffset || 0);
            let x = player.x2 + Math.cos(angle) * scale;
            let y = player.y2 + Math.sin(angle) * scale;
            for(let i = 0; i < objectPredict.length; i++) {
                let _ = objectPredict[i];
                if(_ && Math.hypot(_.y - y, _.x - x) <= scale + _.scale) {
                    return false;
                }
            }
            return true;
        }
function cplace(id, start = 0, end = Math.PI * 2, offset = Math.atan2(mouseX - screenHeight / 2, mouseY - screenWidth / 2), offset2 = Math.PI * 2) {
    let item = items.list[player.items[id]];
    if (item) {
        let scale = 35 + item.scale;
        let placeableAngles = [];
        for (let i = start; i < end; i += offset2) {
            let angle = (typeof offset == "function" ? offset(i) : offset + i);
            if ((player.items[id] != null || player.items[id] != undefined) && objectManager.checkItemLocation(player.x2 + Math.cos(angle) * scale, player.y2 + Math.sin(angle) * scale, item.scale, 0.6, item.id, false) && checkSecond(id, placeableAngles[i])) {
                placeableAngles.push(angle);
            }
        }
        for (let i = 0; i < placeableAngles.length; i++) {
            if ((player.items[id] != null || player.items[id] != undefined) && objectManager.checkItemLocation(player.x2 + Math.cos(placeableAngles[i]) * scale, player.y2 + Math.sin(placeableAngles[i]) * scale, item.scale, 0.6, item.id, false) && checkSecond(id, placeableAngles[i])) {
                place(id, placeableAngles[i], 1);
            }
        }
    }
}
        function inBetween(angle, arra) { // okay the thing i have left to fix is if the first angle is not in the right quadrant i need to make sure that the second one is less far(another checking of which quadrant it is depending on the angle)
            //mental health is not looking good rn
            let array1q
            let array = [undefined, undefined]
            let array2q
            if (Math.sin(angle) > 0 && Math.cos(angle) > 0) {//angle in the first quadrant
                array[0] = arra[0]
                array[1] = arra[1]
            } else if (Math.sin(angle) > 0 && Math.cos(angle) < 0) {//angle is inside the second quadrant
                angle = angle - (Math.PI / 2)
                array[0] = arra[0] - (Math.PI / 2)
                array[1] = arra[1] - (Math.PI / 2)
            } else if (Math.sin(angle) < 0 && Math.cos(angle) < 0) {// angle is in the third quadrant
                angle = angle - Math.PI
                array[0] = arra[0] - Math.PI
                array[1] = arra[1] - Math.PI

            } else if (Math.sin(angle) < 0 && Math.cos(angle) > 0) {//angle is in the fourth quadrant
                angle = angle - ((3 * Math.PI) / 2)
                array[0] = arra[0] - ((3 * Math.PI) / 2)
                array[1] = arra[1] - ((3 * Math.PI) / 2)
            }
            if (Math.sin(array[0]) > 0 && Math.cos(array[0]) > 0) {
                array1q = 1
            } else if (Math.sin(array[0]) > 0 && Math.cos(array[0]) < 0) {
                array1q = 2
            } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) < 0) {
                array1q = 3
            } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) > 0) {
                array1q = 4
            }
            if (Math.sin(array[1]) > 0 && Math.cos(array[1]) > 0) {
                array2q = 1
            } else if (Math.sin(array[1]) > 0 && Math.cos(array[1]) < 0) {
                array2q = 2
            } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) < 0) {
                array2q = 3
            } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) > 0) {
                array2q = 4
            }

            if (array1q == 1) {//lowest angle of the not allowed zone in the first quadrant

                if (Math.sin(angle) < Math.sin(array[0])) {//if the angle is lower than the not allowed zone (probably not in between)
                    if (array2q == 1) {// if the second part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[2])) {//if it wraps completely around and makes it in between
                            return true
                        } else {//doesn't wrap around enough
                            return false
                        }
                    } else {//not in the first quadrant, not in between
                        return false
                    }
                } else {//if the angle is further than the not allowed zone
                    if (array2q == 1) {//if the second part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[2])) {//if the angle is lower than the top limit (in between)

                            return true
                        } else {//is not in between
                            return false
                        }

                    } else {//its gonna be somewhere further so its in between
                        return true;
                    }
                }
            } else {
                if (array2q == 1) {//if the further part of the not allowed zone is in the first quadrant
                    if (Math.sin(angle) < Math.sin(array[1])) {//if it wraps all the way around
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (array1q == 2) {//if lowest angle is in the second
                        if (array2q == 2) {
                            if (Math.sin(array[0]) < Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return false
                        }
                    } else if (array1q == 3) {//if the first one is in the third
                        if (array1q > array2q) {
                            return true
                        } else if (array1q < array2q) {
                            return false
                        } else {
                            if (Math.sin(array[0]) < Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        }
                    } else if (array1q == 4) {//if the first one is in the third
                        if (array1q > array2q) {
                            return true
                        } else if (array1q < array2q) {
                            return false
                        } else {
                            if (Math.sin(array[0]) > Math.sin(array[1])) {
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                }

            }

        }
            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }
            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    //let damages = new Damages(items);
                    //let dmg = damages.weapons[tmp.weaponIndex];
                    //let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        //one: tmp.dist2 <= 300,
                        //two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return /*rule.one && rule.two && */rule.three;
                });
                return attackers;
            }
            function antirev() {
                if (tmpObj.isPlayer){
                    for (let i = 0; i < healthBased(); i++) {
                        place(0, getAttackDir());
                        if (player.health == 55 && player.shameCount < 6 && player.skinIndex == 6) {
                            place(0, getAttackDir());
                            notif("antirev");
                        } else if (player.health == 40 && player.shameCount < 6 && player.skinIndex != 6){
                            place(0, getAttackDir());
                            notif("antirev");
                        } else if (player.health == 43.75 && player.shameCount < 5 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                            place(0, getAttackDir());
                            },5)
                        } else if(player.health == 25 && player.shameCount < 4 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                            place(0, getAttackDir());
                            },5)
                        } else if (player.health == 58.75 && player.shameCount < 6 && player.skinIndex == 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                            place(0, getAttackDir());
                            },5)
                        } else if (player.health == 45 && player.shameCount < 6 && player.skinIndex != 6){
                            place(0, getAttackDir());
                            setTimeout(()=>{
                            place(0, getAttackDir());
                            },5)
                        }
                        if (player.shameCount < 6) {
                            setTimeout(()=>{
                                place(0, getAttackDir());
                            },30)
                        }
                    }
                }
            }
        function healthBased() {
            if (player.health == 100)
                return 0;
            if ((player.skinIndex != 45 && player.skinIndex != 56)) {
                return Math.ceil((100 - player.health) / items.list[player.items[0]].heal);
            }
            return 0;
        }
/*function healer() {
    if (player.health < 100) {
        const healingDelay = 20;
        const healingIterations = Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
        for (let i = 0; i < healingIterations; i++) {
            setTimeout(() => {
                place(0, getAttackDir());
                player.health += items.list[player.items[0]].healing;
                if (player.health > 100) player.health = 100;
            }, i * healingDelay);
        }
    }
}*/
let slowHeal = function(timer) {
     setTimeout(() => {
        healer();
    }, 25);
}
let isHealing = false;
let delay = 20;
function uziheal() {
    if (!isHealing && player.health < 100) {
        isHealing = true;
        if (player.health < 70) {
            place(0, getAttackDir());
            healer();// fast heal
            isHealing = false;
        } else {
            const healingDelay = 15;
            const healingIterations = Math.ceil((100 - player.health) / 25); // making it have delay so it wont packet spam
            let iterationCount = 0;
            function performHealing() {
                if (iterationCount < healingIterations) {
                    setTimeout(() => {
                        place(0, getAttackDir()); // slow heal
                        iterationCount++;
                        performHealing();
                    }, healingDelay);
                } else {
                    isHealing = false;
                }
            }
            performHealing();
        }
    }
}
        function healer() {
            for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
                place(0, getAttackDir());
            }
        }
        /*function heal(d) {
            let heal = player.items[0] == 0 ? 20 : player.items[0] == 1 ? 40 : 30;
            let amount = d / heal;
            for(let i = 0; i < amount; i++) {
                place(0, getAttackDir());
            }
        }*/
            function applCxC(value) {
                if (player.health == 100) return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }

            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            // LATER:
            function predictHeal() {}
            function antiSyncHealing(timearg) {
                track.tick.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 75);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        track.tick.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate);
            }

            const placedSpikePositions = new Set();
            const placedTrapPositions = new Set();

            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);

                return (distToPosition > 35 && distToPosition < 75);
            }

            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS)=>THIS === sid) : null;
            }


            function calculatePossibleTrapPositions(x, y, radius) {
                const trapPositions = [];
                const numPositions = 16;

                for (let i = 0; i < numPositions; i++) {
                    const angle = (2 * Math.PI * i) / numPositions;
                    const offsetX = x + radius * Math.cos(angle);
                    const offsetY = y + radius * Math.sin(angle);
                    const position = [offsetX, offsetY];

                    if (!trapPositions.some((pos) => isPositionTooClose(position, pos))) {
                        trapPositions.push(position);
                    }
                }

                return trapPositions;
            }

            function isPositionTooClose(position1, position2, minDistance = 50) {
                const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
                return dist < minDistance;
            }
      function biomeGear(mover, returns) {
        if (
          player.y2 >= config.mapScale / 2 - config.riverWidth / 2 &&
          player.y2 <= config.mapScale / 2 + config.riverWidth / 2
        ) {
         if (turretEmp.length) {
             buyEquip(22, 0);
         }
          if (returns) return 31;
          buyEquip(31, 0);
        } else {
          if (player.y2 <= config.snowBiomeTop) {
            if (returns) return mover && player.moveDir == undefined ? 6 : 15;
            buyEquip(mover && player.moveDir == undefined ? 6 : 15, 0);
          } else {
            if (returns) return mover && player.moveDir == undefined ? 6 : 12;
            buyEquip(mover && player.moveDir == undefined ? 6 : 12, 0);
          }
        }
        if (returns) return 0;
         buyEquip(11, 1);
      }
            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
            }
            function notFast() {
                return player.weapons[1] == 10 && ((track.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
            }
            class Placement {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.trapAim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    track.antiTrapped = false;
                    this.info = {};
                    let tmpCanvas = document.createElement("canvas");
                    let tmpContext = tmpCanvas.getContext('2d');
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
/*this.checkcanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
    try {
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let counts = {
            attempts: 0,
            placed: 0
        };
        let tmpObjects = [];
        gameObjects.forEach((p) => {
            tmpObjects.push({
                x: p.x,
                y: p.y,
                active: p.active,
                blocker: p.blocker,
                scale: p.scale,
                isItem: p.isItem,
                type: p.type,
                colDiv: p.colDiv,
                getScale: function(sM, ig) {
                    sM = sM || 1;
                    return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                         ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                },
            });
        });
        let failedX, failedY;
        for (let i = first; i < repeat; i += plus) {
            counts.attempts++;
            let relAim = radian + i;
            let tmpX = player.x2 + tmpS * Math.cos(relAim);
            let tmpY = player.y2 + tmpS * Math.sin(relAim);
            let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
            if (cantPlace) {
                failedX = tmpX;
                failedY = tmpY;
                continue;
            }
            if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
            if ((!replacer && yaboi)) {
                if (yaboi.inTrap) {
                    if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI * 1.3) {
                        place(2, relAim, 1);
                    } else {
                        player.items[4] == 15 && place(2, relAim, 1);
                    }
                } else {
                    if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 2.6) {
                        place(2, relAim, 1);
                    } else {
                        player.items[4] == 15 && place(2, relAim, 1);
                    }
                }
            } else {
                place(id, relAim, 1);
            }
            tmpObjects.push({
                x: tmpX,
                y: tmpY,
                active: true,
                blocker: item.blocker,
                scale: item.scale,
                isItem: true,
                type: null,
                colDiv: item.colDiv,
                getScale: function() {
                    return this.scale;
                },
            });
            if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                counts.placed++;
            }
        }
        if (counts.placed > 0 && replacer && item.dmg) {
            if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8)) {
                InstaKill.canSpikeTick = true;
            }
        }
        if (counts.placed === 0 && failedX !== undefined && failedY !== undefined) {
            tmpContext.fillStyle = "#a5974c";
            renderStar(tmpContext, 3, item.scale * 1.1, item.scale * 1.1, failedX, failedY);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = outlineColor;
            renderStar(tmpContext, 3, item.scale * 0.65, item.scale * 0.65, failedX, failedY);
            tmpContext.fill();
        }
    } catch (err) {
    }
};
        this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if ((track.pushdata.pushData.autoPush) ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1/10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    buyEquip(6, 0);
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }*/
        this.protect = function(aim) {
            if (!settings.antitrap.enabled) return;
            if(getDist(near, player) > getDist(near, track.info)) {
                //behind u
                if (near.dist2 <= 100) {
                    //this.checkcanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                    checkPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                    track.antiTrapped = true;
                }
            } else if(getDist(near, track.info) > getDist(near, player)) {
                //infront of u
                if (player.items[4]) {
                    checkPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                    track.antiTrapped = true;
                }
            } else {
                if (near.dist2 <= 100) {
                    checkPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                    track.antiTrapped = true;
                } else {
                    checkPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                    track.antiTrapped = true;
                }
            }
        };
                }
            }
    /*let range = items.weapons[player.weaponIndex].range + 70;
    let placements = [];
    gameObjects.forEach(tmpObj => {
        if (enemy.length) {
            let objDst = UTILS.getDist(tmpObj, player, 0, 2);
            let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);
            if (tmpObj.health <= 272.58 && objDst <= range) {
                this.checkcanPlace({ type: 2, angle: perfectAngle });
            }
        }
    });
    for (let i = 0; i < placements.length; i++) {
        let placement = placements[i];
        place(placement.type, placement.angle);
        PrePlaceCount++;
        if (PrePlaceCount >= 15) break;
    }
};*/
// Adenosine Triphosphate Mod aka 'atm' autoplacer logic
/*this.autoPlace = function () {
  if (!inGame || !enemy.length || !gameObjects.length) return;
  const placeSpeed = 0.5; // self explanatory
  if (ticks.tick % (Math.max(0.5, parseInt(2))||1) === 0 || placeSpeed !== 0) {
    let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
    let nearbySpike = buildings.filter(obj => (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') && Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < player.scale + obj.scale + 20 && !obj.isTeamObject(player) && obj.active)[0];
  const near2 = { inTrap: !!nearbySpike };
  if (nearbySpike) {
    if (isObjectBroken) {
      this.checkcanPlace(4, 0, enemy, nearbySpike); // retraps enemy
    }
  } else if (near.dist2 <= 150) {
    addChatEntry("perf angle test", near.aim2);
    this.checkcanPlace(2, 0, Math.PI * 2, Math.PI / 24, near.aim2, 0, near2); // places spike if theres no spike nearby for spiketick or retrap
  } else if (near.dist2 <= 350) {
    if (player.items[4] === 15) {
      this.checkcanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
      }
    }
  }
};*/
/*if (inGame && enemy.length) {
  if (ticks.tick % 1 === 0) {
    tracker.preplacer();
  }
  this.autoPlace();
}*/
                    /*function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }
                    function isObjectBroken(object) {
                        const healthThreshold = 20;
                        return object.health < healthThreshold;
                    }
                    this.replacer = function(findObj) { //
                        if (!findObj || !settings.autoreplace.enabled) return;
                        if (!inGame) return;
                        if (track.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            let perfectAngle = calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y);
                            if (settings.autogrind.enabled && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.checkcanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    game.tickBase(() => {
                                        player.items[4] == 15 && this.checkcanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                    },1)
                                }
                                this.replaced = true;
                            }
                        }, 1)
                    };
                }
            };*/
            class Instakill {
                constructor() {
                    this.wait = false;
                    this.can = false;
                    this.isTrue = false;
                    this.nobull = false;
                    this.ticking = false;
                    this.canSpikeTick = false;
                    this.canCounter = false;
                    this.revTick = false;
                    this.syncHit = false;
                    this.changeType = function (type) {
                        this.wait = false;
                        this.isTrue = true;
                        track.auto.aim = true;
                        let instaLog = [type];
                        let backupNobull = near.backupNobull;
                        near.backupNobull = false;
                        game.tickBase(() => {
                            instaLog.push(player.skinIndex);
                            game.tickBase(() => {
                                if (near.skinIndex == 22 && settings.dotryhard.enabled) {
                                    near.backupNobull = true;
                                }
                                instaLog.push(player.skinIndex);
                            }, 1);
                        }, 1);
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            if (backupNobull) {
                                buyEquip(7, 0);
                            } else {
                                buyEquip(6, 0);
                            }
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                if (near.skinIndex == 22) {
                                    if (settings.dotryhard.enabled) {
                                        near.backupNobull = true;
                                    }
                                    buyEquip(6, 0);
                                } else {
                                    buyEquip(53, 0);
                                }
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            buyEquip(0, 1);
                            buyEquip(7, 0);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                buyEquip(0, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                }, 1);
                            }, 1);
                        } else {
                            setTimeout(() => {
                                this.isTrue = false;
                                track.auto.aim = false;
                            }, 50);
                        }
                    };
                    this.spikeTickType = function() {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(53, 0);
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            //buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                                buyEquip(6, 0);
                            }, 3);
                        }, 1);
                    };
                    this.hitBackType = function() {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(18, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                            }
                        }, 1);
                    };
                    this.counterType = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                            }
                        }, 1);
                    };
                    this.antiCounterType = function() {
                        track.auto.aim = true;
                        this.isTrue = true;
                        inantiantibull = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(6, 0);
                        buyEquip(21, 1);
                        io.send("D", near.aim2);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                                inantiantibull = false;
                            }, 1);
                        }, 1)
                    };
                    this.rangeType = function (type) {
                        this.isTrue = true;
                        track.auto.aim = true;
                        if (type == "ageInsta") {
                            track.tick.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            io.send("a", undefined, 1);
                            buyEquip(22, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    sendUpgrade(12);
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendUpgrade(15);
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        buyEquip(21, 1);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            track.auto.aim = false;
                                        }, 1);
                                    }, 1);
                                }, 1);
                            }, 1);
                        } else {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(20, 0);
                            }
                            buyEquip(11, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                            }, 1);
                        }
                    };
                    this.Snowtick = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        io.send('a', near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            io.send('a', near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                io.send('a', near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                    io.send('a', undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.oneTickType = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        io.send('a', near.aim2, 1);
                        if (player.weapons[1] == 15) {
                            track.auto.revAim = true;
                            sendAutoGather();
                        }
                        game.tickBase(() => {
                            const trap1 = gameObjects
                                .filter(e => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find(trap => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 30;
                                });
                            if ([6, 22].includes(near.skinIndex) && trap1) io.send('6', 'p_OT [2/3]');
                            track.auto.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            io.send('a', near.aim2, 1);
                            if (player.weapons[1] != 15) {
                                sendAutoGather();
                            }
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                                io.send('a', undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        io.send("a", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            io.send("a", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                io.send("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                    io.send("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        track.auto.revAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        sendAutoGather();
                        io.send("a", near.aim2, 1);
                        game.tickBase(() => {
                            track.auto.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            io.send("a", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                track.auto.aim = false;
                                io.send("a", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function () {
                        this.isTrue = true;
                        track.auto.aim = true;
                        biomeGear();
                        buyEquip(11, 1);
                        io.send("a", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                track.auto.revAim = true;
                            }
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            io.send("a", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                track.auto.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                io.send("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    track.auto.aim = false;
                                    io.send("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.gotoGoal = function (goto, OT) {
                        let slowDists = weeeee => weeeee * config.playerScale;
                        let goal = {
                            a: goto - OT,
                            b: goto + OT,
                            c: goto - slowDists(1),
                            d: goto + slowDists(1),
                            e: goto - slowDists(2),
                            f: goto + slowDists(2),
                            g: goto - slowDists(4),
                            h: goto + slowDists(4),
                        };
                        let bQ = function (wwww, awwww) {
                            if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                                buyEquip(31, 0);
                            } else {
                                buyEquip(wwww, awwww);
                            }
                        };
                        if (enemy.length) {
                            let dst = near.dist2;
                            this.ticking = true;
                            if (dst >= goal.a && dst <= goal.b) {
                                bQ(22, 0);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                                return {
                                    dir: undefined,
                                    action: 1,
                                };
                            } else {
                                if (dst < goal.a) {
                                    if (dst >= goal.g) {
                                        if (dst >= goal.e) {
                                            if (dst >= goal.c) {
                                                bQ(40, 0);
                                                if (settings.slowot.enabled) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2 + Math.PI,
                                        action: 0,
                                    };
                                } else if (dst > goal.b) {
                                    if (dst <= goal.h) {
                                        if (dst <= goal.f) {
                                            if (dst <= goal.d) {
                                                bQ(40, 0);
                                                if (settings.slowot.enabled) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2,
                                        action: 0,
                                    };
                                }
                                return {
                                    dir: undefined,
                                    action: 0,
                                };
                            }
                        } else {
                            this.ticking = false;
                            return {
                                dir: undefined,
                                action: 0,
                            };
                        }
                    };
                    /** wait 1 tick for better quality */
                    (this.bowMovement = function () {
                        let moveMent = this.gotoGoal(685, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.rangeType('ageInsta');
                            } else {
                                io.send('a', moveMent.dir, 1);
                            }
                        } else {
                            io.send('a', moveMent.dir, 1);
                        }
                    }),
                        (this.tickMovement = function () {
                            const trap1 = gameObjects
                                .filter(e => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find(trap => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 50;
                                });
                            let moveMent = this.gotoGoal(
                                [10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop
                                    ? 240
                                    : player.weapons[1] == 15
                                    ? 250
                                    : player.y2 <= config.snowBiomeTop
                                    ? [10, 14].includes(player.weapons[1])
                                        ? 265
                                        : 255
                                    : 270,
                                3
                            );
                            if (moveMent.action) {
                                if ((![6, 22].includes(near.skinIndex) || ([6, 22].includes(near.skinIndex) && trap1)) && player.reloads[53] == 0 && !this.isTrue) {
                                    ([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop) || player.weapons[1] == 15 ? this.threeOneTickType() : this.Snowtick();
                                } else {
                                    io.send('a', moveMent.dir, 1);
                                }
                            } else {
                                io.send('a', moveMent.dir, 1);
                            }
                        }),
                        (this.kmTickMovement = function () {
                            let moveMent = this.gotoGoal(240, 3);
                            if (moveMent.action) {
                                if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % config.serverUpdateRate == 8) {
                                    this.kmTickType();
                                } else {
                                    io.send('a', moveMent.dir, 1);
                                }
                            } else {
                                io.send('a', moveMent.dir, 1);
                            }
                        }),
                        (this.boostTickMovement = function () {
                            let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
                            let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
                            let moveMent = this.gotoGoal(dist, actionDist);
                            if (moveMent.action) {
                                if (player.reloads[53] == 0 && !this.isTrue) {
                                    this.boostTickType();
                                } else {
                                    io.send('a', moveMent.dir, 1);
                                }
                            } else {
                                io.send('a', moveMent.dir, 1);
                            }
                        });
                    /** wait 1 tick for better quality */
                    this.perfCheck = function (pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + 70 * Math.cos(nr.aim2 + Math.PI),
                            y: nr.y2 + 70 * Math.sin(nr.aim2 + Math.PI),
                        };
                        if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                        let finds = ais
                            .filter(tmp => tmp.visible)
                            .find(tmp => {
                                if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                    return true;
                                }
                            });
                        if (finds) return false;
                        finds = gameObjects
                            .filter(tmp => tmp.active)
                            .find(tmp => {
                                let tmpScale = tmp.getScale();
                                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                    return true;
                                }
                            });
                        if (finds) return false;
                        return true;
                    };
                }
            }
            class Autobuy {
                constructor(buyHat, buyAcc) {
                    this.hat = function() {
                        buyHat.forEach((id) => {
                            let find = findID(hats, id);
                            if (find && !player.skins[id] && player.points >= find.price) io.send("c", 1, id, 0);
                        });
                    };
                    this.acc = function() {
                        buyAcc.forEach((id) => {
                            let find = findID(accessories, id);
                            if (find && !player.tails[id] && player.points >= find.price) io.send("c", 1, id, 1);
                        });
                    };
                }
            };

            class Damages {
                constructor(items) {
                    // 0.75 1 1.125 1.5
                    this.calcDmg = function(dmg, val) {
                        return dmg * val;
                    };
                    this.getAllDamage = function(dmg) {
                        return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
                    };
                    this.weapons = [];
                    for (let i = 0; i < items.weapons.length; i++) {
                        let wp = items.weapons[i];
                        let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
                        this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
                        this[name] = this.weapons[i];
                    }
                }
            }
            let hasDisplayedWarning = false;
            function packetwarn() {
                if (secPacket === 100 && !hasDisplayedWarning) {
                    hasDisplayedWarning = true;
                    const frameMsg = Object.assign(document.createElement("div"), {
                        innerHTML: `Warning: High Packet Detected.`,
                        style: `
                position: fixed;
                top: 8%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5rem;
                color: #a12a22;
                text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.2);
                border: 2px solid #a12a22;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `
        });
                    document.body.appendChild(frameMsg);
                    setTimeout(function() {
                        frameMsg.style.opacity = "1";
                        frameMsg.style.transform = "translate(-50%, 0)";
                        setTimeout(function() {
                            frameMsg.style.opacity = "0";
                            frameMsg.style.transform = "translate(-50%, -50%)";
                            setTimeout(function() {
                                frameMsg.remove();
                                hasDisplayedWarning = false;
                            }, 500);
                        }, 2000);
                    }, 100);
                }
            }
            setInterval(packetwarn, 100);
            function shameWarn() {
                if (player.shameCount > 4 && !hasDisplayedWarning) {
                    hasDisplayedWarning = true;
                    const frameMsg = Object.assign(document.createElement("div"), {
                        innerHTML: `Warning: High Shame Detected.`,
                        style: `
                position: fixed;
                top: 8%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5rem;
                color: #a12a22;
                text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.2);
                border: 2px solid #a12a22;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `
        });
                    document.body.appendChild(frameMsg);
                    setTimeout(function() {
                        frameMsg.style.opacity = "1";
                        frameMsg.style.transform = "translate(-50%, 0)";
                        setTimeout(function() {
                            frameMsg.style.opacity = "0";
                            frameMsg.style.transform = "translate(-50%, -50%)";
                            setTimeout(function() {
                                frameMsg.remove();
                                hasDisplayedWarning = false;
                            }, 500);
                        }, 2000);
                    }, 100);
                }
            }
            setInterval(shameWarn, 100);
            let greetings = false;
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good Morning!";
    } else if (hour < 18) {
        return "Good Afternoon!";
    } else {
        return "Good Evening!";
    }
}
function getuser() {
    return localStorage.getItem('user');
}
function greeting() {
    const discordUser = getDiscordUser();
    if (discordUser) {
        if (!greetings) {
            greetings = true;
            const frameMsg = Object.assign(document.createElement("div"), {
                innerHTML: `${getGreeting()} ${discordUser}.`,
                style: `
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 2rem;
                color: white;
                z-index: 9999;
                opacity: 3;
                transition: top 0.5s ease-in-out, opacity 0.5s ease-in-out;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.2);
                border: 2px solid #0000;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `
            });
            document.body.appendChild(frameMsg);
            setTimeout(function () {
                frameMsg.style.top = "7%";
                frameMsg.style.opacity = "1";
            }, 100);
            setTimeout(function () {
                frameMsg.style.top = "-100px";
                frameMsg.style.opacity = "0";
                setTimeout(function () {
                    frameMsg.remove();
                    greetings = false;
                }, 500);
            }, 3000);
        }
    } else {
    }
}
greeting();
            /** CLASS CODES */
            let tmpList = [];
            // LOADING:
            let UTILS = new Utils();
            let items = new Items();
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
            let textManager = new Textmanager();
            let tracker = new Placement(UTILS, items);
            let InstaKill = new Instakill();
            let autoBuy = new Autobuy([6, 7, 22, 40, 53, 15, 31], [11, 13, 21]);
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;
            let breakTrackers = [];
            let pathFindTest = 0;
            let grid = [];
            let pathFind = {
                active: false,
                grid: 40,
                scale: 1440,
                x: 14400,
                y: 14400,
                chaseNear: false,
                array: [],
            };
function sendChat(message) {
    if (message.startsWith(cmdprefix)) {
        commandHandler(message);
    }else {
        io.send("6", message.slice(0, 30));
    }
}
            let runAtNextTick = [];
            let places = {
                slot0: false,
                slot1: false,
                slot2: false,
                slot4: false,
                slot5: false,
            };
            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function (a, b) {
                    return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
                })[0];
                if (nearPlayer) {
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
                if (nearPlayer && nearPlayer.shooting[1] && nearPlayer.shooting[1] == true && !tmpObj.isTeam(player)) {
                    if (tmpObj.dist2 <= 300) {
                        places.slot0 = true;
                        track.tick.antiTick = 5;
                        healer();
                        //sendChat("reverse insta is homo")
                        setTimeout(()=>{
                            places.slot0 = false;
                        },250)
                    } else if (tmpObj.dist2 >= 600 && player.health < 76) {
                        places.slot0 = true;
                        setTimeout(() => {
                            places.slot0 = false;
                        },80)
                        //sendChat("ranged insta is homo")
                    }
                }
            }
            let projectileCount = 0;
            function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!tmpObj.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            track.tick.antiTick = 4;
                            if (!track.tick.antiSync) {
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2 && !chain) {
                                place(1, tmpObj.aim2);
                                track.tick.antiTick = 4;
                                if (player) {
                                antiinsta = "Sync-Anti";
                                io.send("6", "sync detect test")
                                place(0, getAttackDir());
                                }
                             if (chain && projectileCount >= 2) {
                                tmpObj.aim2();
                                selectWeapon(player.weapons[1]);
                                antiinsta = "Sync-Anti";
                                io.send("6", "sync detect test")
                             }
                                if (!track.tick.antiSync) {
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {

                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type?"primary":"secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (let i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }
            window.addEventListener("resize", UTILS.checkTrusted(resize));
            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                mainContext.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();
// MOUSE INPUT:
let usingTouch;
const mals = document.getElementById('touch-controls-fullscreen');
mals.style.display = 'block';
mals.addEventListener("mousemove", gameInput, false);
function gameInput(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
let clicks = {
    spacebar: false,
    middle: false,
    right: false,
};
let proleftclick = false;
let prorightclick = false;
mals.addEventListener("mousedown", mouseDown, false);
function mouseDown(e) {
    if (attackState != 1) {
        attackState = 1;
        if (e.button == 0) {
            clicks.spacebar = true;
        } else if (e.button == 1) {
            clicks.middle = true;
        } else if (e.button == 2) {
            clicks.right = true;
        }
    }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
function mouseUp(event) {
    if (attackState != 0) {
        attackState = 0;
        if (event.button == 0 && toggle) {
            proleftclick = !proleftclick;
            clicks.spacebar = proleftclick;
        } else if (event.button == 0 && hold) {
            clicks.spacebar = false;
        } else if (event.button == 1) {
            clicks.middle = false;
        } else if (event.button == 2) {
            if (toggle) {
                prorightclick = !prorightclick;
                clicks.right = prorightclick;
            } else if (hold) {
                clicks.right = false;
            }
        }
    }
}

mals.addEventListener("wheel", wheel, false);

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && chatHolder.style.display != "block") {
        clicks.spacebar = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        clicks.spacebar = false;
    }
});

mals.addEventListener("wheel", wheel, false);
/*let wbe = 1;
let animationFrameId = null;
function wheel(e) {
    e.preventDefault();
    let delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    let step = 0.05 * delta;
    let newWbe = Math.min(Math.max(wbe + step, 0.5), 2);
    zoom(newWbe);
}
function zoom(newWbe) {
    cancelAnimationFrame(animationFrameId);
    animateZoom(newWbe);
}
function animateZoom(newWbe) {
    let increment = newWbe > wbe ? 0.05 : -0.05;
    wbe += increment;
    updateZoom();
    if ((increment > 0 && wbe < newWbe) || (increment < 0 && wbe > newWbe)) {
        animationFrameId = requestAnimationFrame(() => animateZoom(newWbe));
    }
}
function updateZoom() {
    maxScreenWidth = config.maxScreenWidth * wbe;
    maxScreenHeight = config.maxScreenHeight * wbe;
    resize();
}*/
function wheel() {
}
            // INPUT UTILS:
            function getMoveDir() {
                let dx = 0;
                let dy = 0;
                for (let key in moveKeys) {
                    let tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
                return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
            }

            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
function quadplacer(placementIndex) {
    if (!player)
        return 0;
    if (!player.lockDir) {
        let angleOffset = (Math.PI / 2) * placementIndex;
        lastDir = angleOffset;
    }
    return lastDir || 0;
}
function getAttackDir(debug) {
    if (debug) {
        if (!player)
            return "0";
        if (settings._360spin.enabled && !clicks.right && !track.inTrap) {
            rotating = true;
            lastDir += Math.PI * 10;
        } else {
            rotating = false;
            if (track.auto.aim || (clicks.spacebar && player.reloads[player.weapons[0]] == 0)) {
                lastDir = settings.autogrind.enabled ? "getSafeDir()" : enemy.length ? track.auto.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
            } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                lastDir = "getSafeDir()";
            } else if (track.inTrap && player.reloads[notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                lastDir = "track.trapAim";
            } else if (!player.lockDir) {
                if (noDir || ae) return "undefined";
                lastDir = "getSafeDir()";
            }
        }
        if (rotating) {
            return (lastDir + (performance.now() / 20)) % (Math.PI * 10);
        } else {
            return lastDir || 0;
        }
    } else {
        if (!player)
            return 0;
        if (settings._360spin.enabled && !clicks.right && !track.inTrap) {
            rotating = true;
            lastDir += Math.PI * 10;
        } else {
            rotating = false;
            if (track.auto.aim || (clicks.spacebar && player.reloads[player.weapons[0]] == 0)) {
                lastDir = settings.autogrind.enabled ? getSafeDir() : enemy.length ? track.auto.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
            } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                lastDir = getSafeDir();
            } else if (track.inTrap && player.reloads[notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                lastDir = track.trapAim;
            } else if (!player.lockDir) {
                if (noDir || ae) return undefined;
                lastDir = getSafeDir();
            }
        }
        if (rotating) {
            return (lastDir + (performance.now() / 20)) % (Math.PI * 10);
        } else {
            if (track.inTrap && !clicks.right && !clicks.spacebar) {
                lastDir = track.trapAim;
            }
            return lastDir || 0;
        }
    }
}
let rotating = false;
function getVisualDir() {
    if (!player)
        return 0;
    if (settings._360spin.enabled) {
        rotating = true;
        lastDir += Math.PI * 10;
    } else {
        rotating = false;
        if (track.auto.aim || ((clicks.spacebar || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !track.inTrap)) && player.reloads[player.weapons[0]] == 0))
            lastDir = settings.autogrind.enabled ? getSafeDir() : enemy.length ? track.auto.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
        else if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
            lastDir = getSafeDir();
        else if (!player.lockDir) {
            lastDir = getSafeDir();
        }
    }
    if (rotating) {
        return (lastDir + (performance.now() / 20)) % (Math.PI * 10);
    } else {
        if (track.inTrap && !clicks.right && !clicks.spacebar && settings.trapaim.enabled) {
            lastDir = track.trapAim;
        }
        return lastDir || 0;
    }
}
            // KEYS:
            function keysActive() {
                return (allianceMenu.style.display != "block" && chatHolder.style.display != "block");
            }
            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            openMenu = !openMenu;
                            //$("#menuDiv").toggle();
                            //$("#menuChatDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 82) {
                            sendMapPing = false;
                        } else if (keyNum == 67) {
                            AC(document.getElementById("autochats").value);
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            addChatEntry("Placing SpawnPads");
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            io.send("d", 1, getSafeDir(), 1);
                            io.send("d", 0, getSafeDir(), 1);
                        } else if (event.key == "b" && settings.teamsync.enabled && event.keyCode !== 82) {
                           io.send("S", 1);
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 82) {
                        InstaKill.wait = !InstaKill.wait;
                        //toggleMenuChat();
                        } else if (keyNum == 82) {
                            sendMapPing = false;
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (event.key == ",") {
                                player.sync = false;
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
            function sendMoveDir() {
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!track.pushdata.pushData.autoPush) {
                        io.send("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                }
            }
            // BUTTON EVENTS:
            function bindEvents() {}
            bindEvents();
            /** PATHFIND TEST */
            function chechPathColl(tmp) {
                return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
                return tmp.colDiv == 0.5 ? (tmp.scale * tmp.colDiv) :
                    !tmp.isTeamObject(player) && tmp.dmg ? (tmp.scale + player.scale) :
                    tmp.isTeamObject(player) && tmp.trap ? 0 : tmp.scale;
            }
            function checkObject() {
                let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
                for (let y = 0; y < pathFind.grid; y++) {
                    grid[y] = [];
                    for (let x = 0; x < pathFind.grid; x++) {
                        let tmpXY = {
                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
                        }
                        if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                            pathFind.lastX = x;
                            pathFind.lastY = y;
                            grid[y][x] = 0;
                            continue;
                        }
                        let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= chechPathColl(tmp));
                        if (find) {
                            if (find.trap) {
                                grid[y][x] = 0;
                                continue;
                            }
                            grid[y][x] = 1;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                }
            }
            function createPath() {
                grid = [];
                checkObject();
            }
            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!track.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        io.send("a", undefined, 1);
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function(path) {
                            if (path === null) {
                                pathFind.array = [];
                                if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                    io.send("a", undefined, 1);
                                } else {
                                    io.send("a", near.aim2, 1);
                                }
                            } else {
                                pathFind.array = path;
                                if (pathFind.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                    }
                                    io.send("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();
                    }
                }
            }
            /** PATHFIND TEST */
// ITEM BAR DISPLAY:
let isItemSetted = {};
function updateItemCountDisplay(index = undefined) {
    for (let i = 0; i < items.list.length; ++i) {
        let id = items.list[i].group.id;
        let tmpI = items.weapons.length + i;
        if (!isItemSetted[tmpI]) {
            isItemSetted[tmpI] = document.createElement("div");
            isItemSetted[tmpI].id = "itemCount" + tmpI;
            isItemSetted[tmpI].style.position = "absolute";
            isItemSetted[tmpI].style.top = "5px";
            isItemSetted[tmpI].style.left = "5px";
            isItemSetted[tmpI].style.paddingLeft = "30px";
            getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
            isItemSetted[tmpI].style = `
                display: block;
                width: 100%;
                height: 10px;
                background-color: white;
                border-radius: 3px;
            `;
        }
        let itemCount = player.itemCounts[id] || 0;
        let maxItemCount = 99;
        if (itemCount <= maxItemCount) {
            let percentage = (itemCount / maxItemCount) * 100;
            isItemSetted[tmpI].style.width = percentage + "%";
            isItemSetted[tmpI].title = `Count: ${itemCount}`;
        } else {
            isItemSetted[tmpI].style.display = "none";
        }
    }
}
// AUTOPUSH WITH PATH FINDING: note: smartest autopusher i made
function autoPush() {
    let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 15)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (nearTrap) {
        let enemyboob = gameObjects.some(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale + 5));
        if (enemyboob) {
            track.pushdata.pushData.autoPush = false;
            pathFind.active = false;
            pathFind.chaseNear = false;
            return;
        }
        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale + 5)).sort(function(a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (spike) {
            let pos = {
                x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
            };
            let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                let tmpScale = tmp.getScale();
                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                    return true;
                }
            });
            if (2 == 1) {
                if (track.pushdata.pushData.autoPush) {
                    track.pushdata.pushData.autoPush = false;
                }
            } else {
                if (near.dist2 >= 110) {
                    track.pushdata.pushData.autoPush = false;
                    pathFind.active = true;
                    pathFind.chaseNear = true;
                } else if (near.dist2 <= 100) {
                    pathFind.active = false;
                    pathFind.chaseNear = false;
                    track.pushdata.pushData.autoPush = true;
                    track.pushdata.pushData = {
                        x: spike.x + Math.cos(30),
                        y: spike.y + Math.sin(30),
                        x2: pos.x2 + Math.cos(60),
                        y2: pos.y2 + Math.sin(60)
                    };
                    let angle = Math.atan2(near.y2 - spike.y, near.x2 - spike.x)
                    let point = {
                        x: near.x2 + Math.cos(angle) * 53,
                        y: near.y2 + Math.sin(angle) * 53,
                    }
                    let num = UTILS.getDist(near, spike, 2, 0);
                    let text = num.toString(10);
                    let scale = (player.scale / 10);
                    if (UTILS.getDist(near, spike, 2, 0) >= 105) {
                        if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                            io.send("a", near.aim2, 1);
                        } else {
                            io.send("a", UTILS.getDirect(pos, player, 2, 2), 1);
                        }
                    } else {
                        io.send("a", Math.atan2(point.y - player.y2, point.x - player.x2), 1);
                    }
                }
            }
        } else {
            track.pushdata.pushData.autoPush = false;
            pathFind.active = false;
            pathFind.chaseNear = false;
        }
    } else {
        track.pushdata.pushData.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;
    }
}
// PLAYER FINDER FOR BOT:
let playerMoved = false;
let previousCoords = { x: null, y: null };
function randomDirection() {
    if (!playerMoved) {
        let stepSize = 20;
        let dx = Math.random() < 0.5 ? 1 : -1;
        let dy = Math.random() < 0.5 ? 1 : -1;
        let newX = previousCoords.x + (stepSize * dx);
        let newY = previousCoords.y + (stepSize * dy);
        previousCoords.x = newX;
        previousCoords.y = newY;
        io.send("a", newY, newX, 1);
        Pathfinder();
    }
}
function playerMove() {
    playerMoved = true;
    setTimeout(() => {
        playerMoved = false;
        Pathfinder();
        pathFind.active = true;
    }, 50);
}
function playerMovementHandler() {
    playerMove();
}
playerMovementHandler();
// PVP BOT TESTING:
function autobot() {
    const nearestEnemy = gameObjects
        .filter(tmp => tmp.active && !tmp.isTeamObject(player))
        .reduce((nearest, tmp) => {
            const distance = UTILS.getDist(tmp, player, 0, 2);
            return !nearest || distance < UTILS.getDist(nearest, player, 0, 2) ? tmp : nearest;
        }, null);
    if (nearestEnemy) {
        createPath();
        checkObject();
        pathFind.chaseNear = true;
        pathFind.active = true;
    } else if (getEl("randomdi").checked) {
        randomDirection();
    }
}
            // ADD DEAD PLAYER:
            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }

            /** APPLY SOCKET CODES */

            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }
            // SETUP GAME:
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                io.send("d", 0, getAttackDir(), 1);
                track.tick.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }
            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                    objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        if (playerd) {
                            sendChat(`Found ${data[2]} [${data[1]}]`)
                        }
                    }
                } else {
                    if (data[1] != playerSID) {
                        if (playerd) {
                            sendChat(`Encountered ${data[2]} [${data[1]}]`)
                        }
                    }
                }
                tmpPlayer.spawn(isYou ? true : null);
                tmpPlayer.visible = false;
                tmpPlayer.oldPos = {
                    x2: undefined,
                    y2: undefined
                };
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    if (!player) {
                        window.prepareUI(tmpPlayer);
                    }
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    track.lastDir = 0;
                    updateItems();
                    updateAge();
                    updateItemCountDisplay();
                    if (player.skins[7]) {
                        track.reSync = true;
                    }
                }
            }
            let autochats = new autoChatExport;
            let chatTimeouts = [], oldChatter = [], chatter = [], startedDate = Date.now()
            function AC(name) {
                if (autochats[name].audio.paused) {
                    startedDate = Date.now();
                    if (autochats.current == name && oldChatter) {
                        chatter = oldChatter;
                    } else {
                        autochats[name].audio.currentTime = 0;
                        chatter = Array(...autochats[name].chats);
                    }
                    autochats.current = name;
                    autochats[name].audio.play();
                    chatter.forEach((a, i) => {
                        chatTimeouts.push(setTimeout(() => {
                            chatter.splice(0, 1);
                            a[0] = a[0].replaceAll("’", "'")
                            io.send("6", a[0]);
                            if (chatter.length == 0) {
                                chatter = Array(...autochats[name].chats);
                            }
                        }, a[1]));
                    });
                } else {
                    autochats[autochats.current].audio.pause();
                    oldChatter = chatter.map(e => [e[0], e[1] - (Date.now() - startedDate)]);
                    chatTimeouts.forEach(e => clearTimeout(e));
                }

            }
function notif(title, description) {
    let notificationContainer = document.getElementById("notification-container");
    if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.id = "notification-container";
        notificationContainer.style.position = "fixed";
        notificationContainer.style.top = "93%";
        notificationContainer.style.right = "-5%";
        notificationContainer.style.transform = "translateX(-50%)";
        notificationContainer.style.zIndex = "9999";
        notificationContainer.style.maxWidth = "300px";
        document.body.appendChild(notificationContainer);
    }
    let existingNotif = document.querySelector(`#notification-container [data-title="${title}"]`);
    if (existingNotif) {
        let count = parseInt(existingNotif.dataset.count) + 1;
        existingNotif.dataset.count = count;
        existingNotif.textContent = `${title}: ${description} (${count}x)`;
        let remainingTimeLine = existingNotif.querySelector(".remaining-time-line");
        if (!remainingTimeLine) {
            remainingTimeLine = document.createElement("div");
            remainingTimeLine.classList.add("remaining-time-line");
            remainingTimeLine.style.position = "absolute";
            remainingTimeLine.style.bottom = "0";
            remainingTimeLine.style.left = "0";
            remainingTimeLine.style.width = "100%";
            remainingTimeLine.style.height = "3px";
            remainingTimeLine.style.backgroundColor = "white";
            existingNotif.appendChild(remainingTimeLine);
            const lineDuration = 5000;
            const interval = 30;
            const increment = (interval / lineDuration) * 100;
            let progress = 0;
            const countdown = setInterval(() => {
                progress += increment;
                remainingTimeLine.style.width = `${100 - progress}%`;
                if (progress >= 100) {
                    clearInterval(countdown);
                }
            }, interval);
        }
        return;
    }
    const notif = document.createElement("div");
    notif.dataset.title = title;
    notif.dataset.count = 1;
    notif.textContent = `${title}: ${description} (1x)`;
    notif.style.fontSize = "1.5rem";
    notif.style.color = "white";
    notif.style.opacity = "0";
    notif.style.transition = "opacity 0.5s ease-in-out";
    notif.style.padding = "10px";
    notif.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    notif.style.marginBottom = "10px";
    notif.style.whiteSpace = "nowrap";
    notif.style.overflow = "hidden";
    notif.style.textOverflow = "ellipsis";
    notif.style.height = "auto";
    notif.style.position = "relative";
    notificationContainer.insertBefore(notif, notificationContainer.firstChild);
    const remainingTimeLine = document.createElement("div");
    remainingTimeLine.classList.add("remaining-time-line");
    remainingTimeLine.style.position = "absolute";
    remainingTimeLine.style.bottom = "0";
    remainingTimeLine.style.left = "0";
    remainingTimeLine.style.width = "100%";
    remainingTimeLine.style.height = "3px";
    remainingTimeLine.style.backgroundColor = "white";
    notif.appendChild(remainingTimeLine);
    const ilyaxsped = new Audio('https://cdn.discordapp.com/attachments/1200901229333708851/1214205079499051008/Audio_-_notification3_-_Creator_Store.ogg?ex=65f84399&is=65e5ce99&hm=1f4079444b445daae2545c34db1f7f25d1902773595674f6d93ee8f1f274178e&');
    ilyaxsped.play();
    const notificationDuration = 5000;
    const interval = 30;
    const increment = (interval / notificationDuration) * 100;
    let progress = 0;
    const countdown = setInterval(() => {
        progress += increment;
        remainingTimeLine.style.width = `${100 - progress}%`;
        if (progress >= 100) {
            clearInterval(countdown);
            setTimeout(() => {
                notif.style.opacity = "0";
                setTimeout(() => {
                    notif.remove();
                }, 500);
            }, 500);
        }
    }, interval);
    setTimeout(() => {
        notif.style.opacity = "1";
    }, 0);
    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => {
            notif.remove();
        }, 500);
    }, notificationDuration);
}
        function objDist(a, b){
            return Math.hypot(a.y-b.y, a.x-b.x);
        }
            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                        players.splice(i, 1);
                        break;
                    }
                }
            }
class nigletfier {
    constructor(hp, id) {
        this.id = id;
        this.oldhp = hp;
        this.damagePromises = [];
        this.eventList = [];
        this.deathCases = [];
        this.pingValues = [];
        this.averagePing = 0;
        this.statusText = `[null].`;
    }
    isRealPing(gap) {
        return Math.abs(this.averagePing - gap) < 40;
    }
    calculate() {
        let conditionsList = [];
        let roundList = [];
        let spamLogs = [];
        let antiSpamPoints = [];
        let spamCount = 0;
        let lastHitTime = null;
        let shameThreshold = 0;
        let maybeShame = false;
        for (let i = 0, event; i < this.eventList.length; i++) {
            event = this.eventList[i];
            if (event.dmg < 45 && event.dmg >= 40 && event.type == "slow" && this.isRealPing(event.gap - 1e3 / 9) && !conditionsList.includes("nobull")) {
                conditionsList.push("nobull");
            } else if (event.dmg >= 45) {
                if (lastHitTime - event.delay2 < 400) {
                    if (event.type == "fast" && event.clown > shameThreshold) {
                        shameThreshold = event.clown;
                        spamCount++;
                    } else if (event.type == "slow" && lastHitTime - event.delay2 < 260) {
                        maybeShame = true;
                    } else if (event.type == "slow") {
                        console.log(event.clown);
                        antiSpamPoints.push(event.clown);
                        spamLogs.push(spamCount);
                        spamCount = 0;
                    }
                }
                lastHitTime = event.delay2;
            }
        }
        spamLogs.push(spamCount);
        if (spamLogs.length > 0) {
        }
        if (antiSpamPoints.length > 0) {
            let mostCommon = mode(antiSpamPoints);
        }
        return conditionsList;
    }
    updateElement(array, item) {
        let index = array.findIndex(elem => elem[0] == item[0]);
        if (index === -1) {
            array.push(item);
        } else {
            array[index] = item;
        }
        return array;
    }
    assignNew(array, newValues) {
        for (let i = 0; i < newValues.length; i++) {
            array = this.updateElement(array, newValues[i]);
        }
        return array;
    }
    trackEvent(obj) {
        this.eventList.push(obj);
        if (obj.type == "slow") {
            this.pingValues.push(obj.gap - 1e3 / 9);
            if (this.pingValues.length > 20) {
                this.pingValues.shift();
            }
            this.averagePing = Math.round(this.pingValues.reduce((a, b) => a + b, 0) / this.pingValues.length);
        }
        if (this.eventList.length > 15) {
            this.eventList.shift();
        }
        let conditions = this.calculate();
        if (conditions.length > 0) {
            this.deathCases = this.assignNew(this.deathCases, conditions);
            try {
            } catch (e) { this.statusText = ""; }
        }
    }
    addEvent(hp, clown) {
        let type = this.healthStatus(hp, this.oldhp),
            dmg = this.oldhp - hp;
        this.oldhp = hp;
        if (type === "damage") {
            let index = this.damagePromises.length;
            let result = null;
            let startTime = Date.now();
            let self = healing[this.id];
            new Promise(function (resolve) {
                self.damagePromises.push(resolve);
                setTimeout(resolve, healTimeout, false); // so no shame at bullspam ez
            }).then(function (bool) {
                self.damagePromises.splice(index, 1);
                if (!bool) return;
                let gap = Date.now() - startTime,
                    eventObj = {
                        delay1: startTime,
                        delay2: Date.now(),
                        gap,
                        dmg: dmg,
                        type: gap < 1e3 / 9 ? "fast" : "slow",
                        clown
                    };
                self.trackEvent(eventObj);
            });
            healing[this.id] = self;
        } else {
            if (this.damagePromises.length) {
                this.damagePromises.forEach((promise) => promise(true));
                this.damagePromises = [];
            }
        }
    }
    healthStatus(health, oldHealth) {
        return health < oldHealth ? "damage" : "heal";
    }
    updateStatus(hp, clown) {
        this.addEvent(hp, clown);
    }
}
let pingTime = window.pingTime + 250;
let healTimeout = Math.max(1000, 2 * pingTime);
let enemyData = document.createElement("div");
enemyData.style.cssText = `
    right: 10px;
    top: 10px; // 450px;
    padding: 10px;
    margin-top: 10px;
    color: #fff;
    font-size: 28px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    width: 220px;
    height: 105px;
    display: block;
    position: fixed;
`;
document.body.appendChild(enemyData);
function updateEnemyData() {
    let R = player;
    let enemies = players.filter(e => e.visible && (e.team != R.team || e.team === null) && e.sid != R.sid).sort((a, b) => Math.hypot(a.y2 - R.y2, a.x2 - R.x2) - Math.hypot(b.y2 - R.y2, b.x2 - R.x2));
    if (enemies.length) {
        try {
            enemyData.innerHTML = enemies.map(e => {
                return `${e.name}<br><p>DmgPot: ${dmgPredict(tmpObj)}<br>Shame: ${tmpObj.shameCount}<br>Health: ${tmpObj.health}`; // Ping/Ms: ${healing[e.id].averagePing}<br>
            })[0];
            enemyData.style.display = "block";
        } catch (t) { };
    } else {
        enemyData.style.display = "block";
        enemyData.innerHTML = "[Null]: no enemy detected.";
    }
}
setInterval(() => {
    updateEnemyData();
}, 100);
            function dmgpot() {
                let potential = 0;
                for (let i = 0; i < nears.length; i++) {
                    let _ = nears[i], dmg = 0;
                    if (nears[i].primaryReload > 0.7) {
                        dmg += items.weapons[_.primary].dmg * 1.5 * sortWeaponVariant(_.primaryVar)
                    }
                    if (_.secondaryReload > 0.7) {
                        dmg += (_.secondary == 10 ? Math.round(items.weapons[_.secondary].dmg * sortWeaponVariant(_.secondaryVar)) : sortSecondaryAmmoDamage(_.secondary))
                    }
                    if (_.turretReload > 0.7) {
                        dmg += 25
                    }
                    if (_.primaryVar == 3) {
                        dmg += 5
                    }
                    if (_.secondaryVar == 3 && _.secondary == 10) {
                        dmg += 5
                    }
                    potential += dmg;
                }
                if(player.skinIndex == 7) {
                    potential += 5;
                }
                return potential;
            }
            function sortWeaponVariant(id) {
                switch (id) {
                    case 0:
                        return 1
                        break;
                    case 1:
                        return 1.1
                        break;
                    case 2:
                        return 1.18
                        break;
                    case 3:
                        return 1.18
                        break;
                    default:
                        return 1
                        break;
                }
            }
            function sortSecondaryAmmoDamage(weapon) {
                switch (weapon) {
                    case 10:
                        return 12
                        break
                    case 15:
                        return 50
                        break;
                    case 9:
                        return 25
                        break;
                    case 12:
                        return 35
                        break;
                    case 13:
                        return 30
                        break;
                    default:
                        return 0
                }
            }
            function Qz(tmpObj, t) {
                let d = t - tmpObj.health;
                if (d >= 0) {
                } else {
                    if (player == tmpObj) {
                        if (tmpObj.skinIndex == 7 && (Math.abs(d) == 5 || (tmpObj.latestTail == 13 && Math.abs(d) == 2))) {
                            tmpObj.bullTick = game.tick
                            if (track.reSync) {
                                track.reSync = false;
                            }
                        }
                        rimdiestobatspam();
                    }
                }
            }
            function rimdiestobatspam() {
                let potential = dmgpot();
                if (nears.length) {
                    //getEl("dmgpot").innerHTML = potential;
                    if (Math.round(player.health - potential <= 0)) {
                        if ((player.health - (potential * player.skinIndex == 6 ? 0.75 : 1) >= 0)) {
                            game.tickBase(() => {
                                heal();
                            }, 2);
                        } else {
                            if(player.shameCount < 5) {
                                heal();
                            } else {
                                game.tickBase(() => {
                                    heal();
                                }, 2);
                            }
                        }
                    } else {
                        game.tickBase(() => {
                            heal();
                        }, 2);
                    }
                } else {
                    game.tickBase(() => {
                        heal();
                    }, 2);
                }
            }
// once again testing with preplacer, if it packet spams disable priothread
/*let E, mo, y, ct = 1, wn = 0, go = 0, yo = 0, Re, _e, lr, fs = 0;
function prioThread(tmpObjs) {
    if (!E) return
    if (preplacer) preplacer(gameObjects);([...tmpObjs]);
}*/
            var newHatImgs = {
                7: "https://i.imgur.com/vAOzlyY.png",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                11: "https://i.imgur.com/yfqME8H.png",
                12: "https://i.imgur.com/VSUId2s.png",
                40: "https://i.imgur.com/Xzmg27N.png",
                26: "https://i.imgur.com/I0xGtyZ.png",
                6: "https://i.imgur.com/vM9Ri8g.png",
            };
            var newAccImgs = {
                //18: "https://i.imgur.com/0rmN7L9.png",
                21: "https://i.imgur.com/4ddZert.png",
            };
            var newWeaponImgs = {
                "samurai_1": "https://i.imgur.com/mbDE77n.png",
                //"samurai_1_g": "https://media.discordapp.net/attachments/1204579824190890036/1212541130688954399/mbDE77n.png?ex=65f235ed&is=65dfc0ed&hm=a192ab09b2ed5454026c15e48590b268f053dd94fb20598aabea293ad5cfe6ca&=&format=webp&quality=lossless&width=320&height=500",
                //"spear_1_d": "https://media.discordapp.net/attachments/1204579824190890036/1213557325185679460/Spear_1_D.png?ex=65f5e855&is=65e37355&hm=e74a2dd16fd8c85be6500149674b8953c01d4af81dff87ef16ec5dff840e78f6&=&format=webp&quality=lossless&width=312&height=488",
                //"samurai_1_d": "https://media.discordapp.net/attachments/1204579824190890036/1212541131028430918/mbDE77n1.png?ex=65f235ed&is=65dfc0ed&hm=4627db5fb4fdc704a16424dbc7074b24ed6be6dec48c570fec2185956b5fbc2d&=&format=webp&quality=lossless&width=320&height=500",
            };
            function getTexturePackImg(index, type) {
                if(newHatImgs[index] && type == "hat") {
                    return newHatImgs[index];
                }else if(newAccImgs[index] && type == "acc") {
                    return newAccImgs[index];
                }else if(newWeaponImgs[index] && type == "weapons") {
                    return newWeaponImgs[index];
                }else {
                    if(type == "acc") {
                        return ".././img/accessories/access_" + index + ".png";
                    }else if(type == "hat") {
                        return ".././img/hats/hat_" + index + ".png";
                    }else {
                        return ".././img/weapons/" + index + ".png";
                    }
                }
            }
function dmgcalcu(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
// my fingers are bleeding, my brain needs a break.
function dmgPredict(player, enemyReloads = {}, enemyWeapons = {}) {
  const weapon1 = player.primaryIndex !== undefined ? items.weapons[near.primaryIndex] : null;
  const weapon2 = player.secondaryIndex !== undefined ? items.weapons[near.secondaryIndex] : null;
  const bullthingy = 1.5;
  const primaryCooling = weapon1 === null || player.reloads[weapon1.id] === 0;
  const enemy_weapon_1 = enemyWeapons.weapon1 !== null && !enemyWeapons.weapon1Reloading;
  const enemy_weapon_2 = enemyWeapons.weapon2 !== null && !enemyWeapons.weapon2Reloading;
  let weapon1_variant_multi = weapon1 !== null ? sortWeaponVariant(player.primaryVariant) : 1.18;
  let weapon2_variant_multi = weapon2 !== null ? sortWeaponVariant(player.secondaryVariant) : 1.18;
  weapon1_variant_multi *= bullthingy;
  let potentialDamage = 0;
  let secondaryCooling = weapon2 === null || player.reloads[weapon2.id] === 0 || enemyReloads[weapon2.id] !== 0;
  if (primaryCooling && weapon1 !== null && enemy_weapon_1) {
    potentialDamage += weapon1.dmg * weapon1_variant_multi;
  }
  if (!(enemy_weapon_2 && secondaryCooling) && weapon2 !== null && !enemy_weapon_1) {
    const secondaryEnemyReloading = enemyReloads[weapon2.id] !== 0;
    if (!secondaryEnemyReloading) {
      potentialDamage += sortSecondaryAmmoDamage(weapon2.id) * weapon2_variant_multi;
      secondaryCooling = enemyWeapons.weapon2Reloading;
      }
  }
  if (player.reloads[53] <= game.tickRate) {
    potentialDamage += 25;
  }
  if (player.skinIndex === 6) {
    potentialDamage *= 0.75;
  } else if (enemyWeapons.near && enemyWeapons.near.skinIndex === 7) {
    potentialDamage *= 1.5;
  }
  return dmgcalcu(potentialDamage, 0, 1000);
}
async function penisheal(sid, value) {
    let tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        tmpObj.judgeShame();
        let slowHeal = function(timer) {
            setTimeout(() => {
                uziheal();
            }, 30);
        };
        let doveryslowHeal = function(timer) {
            setTimeout(() => {
                uziheal();
            }, 40);
        };
        if (tmpObj.oldHealth > tmpObj.health) {
            tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
            advHeal.push([sid, value, tmpObj.damaged]);
        }
        //let healTimeout = 200;
        /*if (antis.reverse) {
            uziheal();
            antirev = true;
            player.soldierAnti = true;
        } else {
            antirev = false;
        }
        if (antis.onetick) {
            setTimeout(() => {
                healer(healTimeout / 2);
                player.canEmpAnti = true;
            }, 200);
        } else {
            setTimeout(() => {
                slowHeal(healTimeout);
            }, 200);
        }*/
        if (healing[tmpObj.id]) {
            healing[tmpObj.id].update(value, tmpObj.shameCount);
        } else {
            healing[tmpObj.id] = new nigletfier(value, tmpObj.id, tmpObj.shameCount);
        }
    }
}
    /*tmpObj = findPlayerBySID(sid);
    let _ = tmpObj;
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        tmpObj.judgeShame();
        if (tmpObj.oldHealth > tmpObj.health) {
            tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
            let damaged = tmpObj.damaged;
            tmpObj = findPlayerBySID(sid);
            let healTimeout = 150;
            let antiHeal = true;
            let primaryinformation = {
                weapon: player.weapons[0],
                variant: player.primaryVariant,
                dmg: player.weapons[0] == undefined ? 0 : items.weapons[player.weapons[0]].dmg,
            };
            let bullhit = player.skins[7] ? 1.5 : 1;
            let primaryvariant = primaryinformation.variant != undefined ? config.weaponVariants[primaryinformation.variant].val : 1;
            let range = items.weapons[player.weapons[0]].range + 70;
            if (primaryinformation.weapon != undefined && player.reloads[primaryinformation.weapon] == 0 && near.dist2 <= range) {
                let calculation = primaryinformation.dmg * primaryvariant * bullhit;
                calculation *= near.skinIndex == 6 ? 0.75 : 1;
                calculation = Math.round(calculation);
            }
            let slowHeal = function(timer) {
                setTimeout(() => {
                    healer();
                }, timer);
            }
            function predictAndHeal() {
                let potentialDamage = tmpObj.calcPotentialDamageThreat();
                if (potentialDamage >= 20 && (player.skinIndex == 11 || near.skinIndex == 53)) {
                    InstaKill.canCounter = true;
                }
                if (tmpObj.shameCount <= 5) {
                    setTimeout(() => {
                        player.canEmpAnti = true;
                        slowHeal(healTimeout / 2);
                    }, healTimeout);
                    if (potentialDamage >= 40 || player.damageThreat >= 50 && tmpObj.shameCount <= 4) {
                        if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                            player.primaryIndex !== undefined && player.primaryIndex !== null) {
                            player.canEmpAnti = true;
                            healer(healTimeout / 2);
                            buyEquip(6, 0);
                            antiinsta = "Rev-Anti";
                            //sendChat("anti rev test");
                        }
                    } else if (potentialDamage >= 35 || player.damageThreat >= 50 && tmpObj.shameCount <= 5) {
                        if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                            player.primaryIndex !== undefined && player.primaryIndex !== null && tmpObj.skinIndex === 6) {
                            player.canEmpAnti = true;
                            buyEquip(6, 0);
                            healer(healTimeout / 2);
                            antiinsta = "Normal-Anti";
                            //sendChat("anti insta test");
                        }
                    }
                } else if (tmpObj.damageThreat < 25) {
                    slowHeal(healTimeout / 2);
                } else if (tmpObj.shameCount <= 4 && player.damageThreat <= 35) {
                    healer(healTimeout / 2);
                } else {
                    tmpObj.timeHealed = Date.now();
                }
            }
            if (tmpObj == player) {
                if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                    if (track.reSync) {
                        track.reSync = false;
                        tmpObj.setBullTick = true;
                    }
                }
            }
            if (antis.reverse) {
                antirev = true;
                player.soldierAnti = true;
            } else {
                antirev = false;
            }
            if (antis.onetick) {
                setTimeout(() => {
                    healer(healTimeout / 2);
                    player.canEmpAnti = true;
                }, 200);
            } else {
                setTimeout(() => {
                    slowHeal(healTimeout);
                }, 200);
            }
            predictAndHeal();
            if (healing[_.id]) {
                healing[_.id].update(value, _.shameCount);
            } else {
                healing[_.id] = new nigletfier(value, _.id, _.shameCount);
            }
        }
    }
}*/
const assessDamagePotential = (entity) => {
    const { mainWeapon, altWeapon, reloadStatus, outfit } = entity;
    const multiplier = 1.5; // we're making damage a bit bigger!
    const mainWeaponReady = mainWeapon === null || reloadStatus[mainWeapon.id] === 0; // checking if our main weapon is ready to shoot.
    const altWeaponReady = altWeapon === null || reloadStatus[altWeapon.id] === 0; // checking if our secondary weapon is ready to shoot.
    const mainVariantMultiplier = mainWeapon !== null && near.primaryVariant !== undefined ? outfit.weaponVariants[mainVariant].value : 1.18;
    const altVariantMultiplier = altWeapon !== null && entity.secondaryVariant !== undefined ? ([9, 12, 13, 15].includes(altWeapon.id) ? 1 : outfit.weaponVariants[secondaryVariant].value) : 1.18;
    let damagePotential = 0;

    if (mainWeaponReady && mainWeapon !== null) {
        damagePotential += mainWeapon.damage * mainVariantMultiplier * multiplier; // adding up how much damage our main weapon can do
    }

    if (altWeaponReady && altWeapon !== null) {
        damagePotential += altWeapon.damage * altVariantMultiplier * multiplier; // adding up how much damage our secondary weapon can do
    }

    if (reloadStatus[53] <= entity.tickRate) { // checking if our turret hat is ready to shoot
        damagePotential += 25; // adding extra damage if turret hat is ready to shoot
    }

    if (outfit.skinIndex === 6) {
        damagePotential *= 0.75; // if were a soldier, were reducing damage.
    } else if (near.skinIndex === 7) {
        damagePotential *= 1.5; // if were wearing a bullhat it should increase damage
    }

    return damagePotential; // telling how much damage we can potentially do!
};
/*    tmpObj = findPlayerBySID(sid);
    let _ = tmpObj;
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        tmpObj.judgeShame();
        if (tmpObj.oldHealth > tmpObj.health) {
            tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
            advHeal.push([sid, value, tmpObj.damaged]);
        }
        if (healing[_.id]) {
            healing[_.id].update(value, _.shameCount);
        } else {
            healing[_.id] = new nigletfier(value, _.id, _.shameCount);
        }
    }
}*/
/*function penisheal(sid, value) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.oldHealth = tmpObj.health;
        tmpObj.health = value;
        tmpObj.judgeShame();
        if (tmpObj.oldHealth > tmpObj.health) {
            tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
            let damaged = tmpObj.damaged;
            tmpObj = findPlayerBySID(sid);
            let bullTicked = false;
            if (tmpObj.health <= 0) {
                if (!tmpObj.death) {
                    tmpObj.death = true;
                    if (tmpObj != player) {
                        if(tmpObj.skinIndex == 45) {
                            modLog("```[System]: Enemy has died due to clown.```");
                        } else if(tmpObj.shameCount >= 5) {
                            modLog("```[System]: Enemy has died due to High Shame.```");
                        } else {
                            modLog("```[System]: Enemy has died.```");
                        }
                    }
                    addDeadPlayer(tmpObj);
                }
            }
            if (tmpObj == player) {
                if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                    if (track.reSync) {
                        track.reSync = false;
                        tmpObj.setBullTick = true;
                    }
                    bullTicked = true;
                }
                if (inGame) {
                    let attackers = getAttacker(damaged);
                    let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                    let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                    let healTimeout = (500);
                    //let healTimeout = settings.healsped;
                    let slowHeal = function(timer) {
                        setTimeout(() => {
                            healer();
                        }, timer);
                    }
            if (antis.reverse) {
                 antirev = true;
                 player.soldierAnti = true;
            } else {
             antirev = false;
            }
            if (antis.onetick) {
                 healer(healTimeout / 2);
                 player.canEmpAnti = true;
            } else {
             slowHeal(healTimeout);
            }
                    let total = 0;
                    if (damaged >= 10 && player.damageThreat >= 100) {
                        player.canEmpAnti = true;
                        player.antiTimer = game.tick;
                        let shame = 4;
                        if (tmpObj.shameCount >= 4) {
                            player.canEmpAnti = true;
                            slowHeal(healTimeout);
                        }
                        if (tmpObj.shameCount < shame) {
                            setTimeout(() => {
                                player.canEmpAnti = true;
                                healer();
                            }, healTimeout);
                        } else {
                            if(tmpObj.shameCount >= 4)
                                player.canEmpAnti = true;
                            slowHeal(healTimeout);
                        }
                    } else {
                        if(tmpObj.shameCount >= 4)
                        player.canEmpAnti = true;
                        slowHeal(healTimeout);
                    }
                    if (damaged >= 20 && (player.skinIndex == 11 || near.skinIndex == 53)) InstaKill.canCounter = true;

                }
            } else {
                if (damaged >= 40 && player.damageThreat >= 50 && tmpObj.shameCount <= 4) {
                    if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                        player.primaryIndex !== undefined && player.primaryIndex !== null) {
                        player.canEmpAnti = true;
                        healer(healTimeout);
                        buyEquip(6, 0);
                        antiinsta = "Rev-Anti";
                    }
                } else if (damaged >= 35 && player.damageThreat >= 50 && tmpObj.shameCount <= 5) {
                    if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                        player.primaryIndex !== undefined && player.primaryIndex !== null && tmpObj.skinIndex === 6) {
                        player.canEmpAnti = true;
                        buyEquip(6, 0);
                        healer(healTimeout);
                        antiinsta = "Normal-Anti";
                    }
                }
            }
        } else {
            if (tmpObj.shameCount <= 5) {
                setTimeout(() => {
                    player.canEmpAnti = true;
                    slowHeal(healTimeout);
                }, 50);
                if (damaged >= 40 && player.damageThreat >= 50 && tmpObj.shameCount <= 4) {
                    if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                        player.primaryIndex !== undefined && player.primaryIndex !== null) {
                        player.canEmpAnti = true;
                        healer(healTimeout);
                        buyEquip(6, 0);
                        antiinsta = "Rev-Anti";
                    }
                } else if (damaged >= 35 && player.damageThreat >= 50 && tmpObj.shameCount <= 5) {
                    if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                        player.primaryIndex !== undefined && player.primaryIndex !== null && tmpObj.skinIndex === 6) {
                        player.canEmpAnti = true;
                        buyEquip(6, 0);
                        healer(healTimeout);
                        antiinsta = "Normal-Anti";
                    }
                }
            } else if (tmpObj.damageThreat < 25) {
                slowHeal(healTimeout);
            } else if (tmpObj.shameCount <= 4 && player.damageThreat <= 35) {
                slowHeal(healTimeout);
            } else {
                tmpObj.timeHealed = Date.now();
            }
        }
        if (tmpObj.health <= 0) {
            bots.forEach((hmm) => {
                hmm.whyDie = tmpObj.name;
            });
        }
    }
}*/
            let millC = {
                x: undefined,
                y: undefined,
                size: function(size) {
                    return size * 1.45;
                },
                dist: function(size) {
                    return size * 1.8;
                },
                active: false,
                count: 0,
            };
/*function nigletfier(sid, value) {
    penisheal(sid, value);
    setTimeout(() => {
        nigletfier(sid, value);
    }, 1000);
}
nigletfier();*/
/*let isPlayerAlive = true;
function dedthingy() {
    isPlayerAlive = false;
    $('.menuHeader').hide();
    $('.menuCard').hide();
    $('#gameName').hide();
    $('#skinColorHolder').hide();
    $('#enterGame').hide();
    $('#desktopInstructions').hide();
    $('#errorNotification').hide();
    setTimeout(() => {
        isPlayerAlive = true;
        $('.menuHeader').show();
        $('.menuCard').show();
        $('#gameName').show();
        $('#skinColorHolder').show();
        $('#enterGame').show();
        $('#desktopInstructions').show();
        $('#errorNotification').hide();
    }, 3000);
}
// KILL PLAYER:
function killPlayer() {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y,
    };
    dedthingy();
    if (settings.autorespawn.enabled) {
        io.send("M", {
            name: lastsp[0],
            moofoll: lastsp[1],
            skin: lastsp[2]
        });
    }
}*/
        // HIDE WINDOWS:
        function hideAllWindows() {
            storeMenu.style.display = "none";
            allianceMenu.style.display = "none";
            closeChat();
        }
        // KILL PLAYER:
        var loadingText = document.getElementById("loadingText");
        var deathTextScale = 99999;
        function killPlayer() {
            inGame = false;
            gameUI.style.display = "none";
            hideAllWindows();
            lastDeath = {
                x: player.x,
                y: player.y
            };
            loadingText.style.display = "none";
            diedText.style.display = "block";
            diedText.style.fontSize = "0px";
            deathTextScale = 0;
            setTimeout(function() {
                menuCardHolder.style.display = "block";
                mainMenu.style.display = "block";
                diedText.style.display = "none";
                if (settings.autorespawn.enabled) {
        io.send("M", {
            name: lastsp[0],
            moofoll: lastsp[1],
            skin: lastsp[2]
        });
    }
            }, config.deathFadeout);
        }
            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }
            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
            }
            // UPDATE UPGRADES:
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function () {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (let i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            let tmpI = (items.weapons.length + i);
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function () {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        (function (i) {
                            let tmpItem = getEl('upgradeItem' + i);
                            tmpItem.onmouseover = function () {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function () {
                                io.send("H", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.innerHTML = "";
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
                // SMART AUTOUPGRADE:
                if (settings.autoupg.enabled) {
                    if (age == 3) {
                        sendUpgrade(17)
                    } else if (age == 4) {
                        sendUpgrade(31)
                    } else if (age == 5) {
                        sendUpgrade(23)
                    } else if (age == 7) {
                        sendUpgrade(38)
                    } else if (age == 8) {
                        if (player.secondaryIndex == 9) {
                            sendUpgrade(12)
                        } else if (player.primaryIndex == 3) {
                            sendUpgrade(4)
                        } else {
                            sendUpgrade(28)
                        }
                    } else if (age == 9) {
                        if (player.secondaryIndex == 12) {
                            sendUpgrade(15)
                        } else {
                            sendUpgrade(25)
                        }
                    } // 12  15=
                }
            }
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function toR(e) {
                var n = (e * Math.PI / 180) % (2 * Math.PI);
                return n > Math.PI ? Math.PI - n : n
            }
            function toD(e) {
                var n = (e / Math.PI * 360) % 360;
                return n >= 360 ? n - 360 : n;
            }
         function isObjectBroken(object) {
               const healthThreshold = 20;
               return object.health < healthThreshold;
        }
// AUTO REPLACER AND FOR SPIKETICK:
// KILL OBJECT:
function killObject(sid) {
    let findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);
    if (findObj && cdf(player, findObj) < 200 && nears.length > 0) {
        if (replacing == false && near.dist <= 250) {
            replacing = true;
            //io.send("6", "Test[1]");
        }
        let enemy = near;
        let A = player;
        let dist = cdf(A, enemy);
        let dir = caf(A, enemy);
        let dir2 = caf(player, dir + 180);
        let ignore = [0, 0];
        let objAim = Math.atan2(findObj.y-player.y2, findObj.x-player.x2);
        let objDist = Math.hypot(findObj.y-player.y2, findObj.x-player.x2);
        let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5));
        let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) < 87 && !nearTrap);
        let placeObj = spike ? 4 : 2;
        if (objDist <= 200 && near.dist2 <= 168 && tmpObj != player && placeObj != 4) {
            spiketicktest();
            //InstaKill.canSpikeTick = true;
            InstaKill.syncHit = true;

        } // this is sped
        if (player.alive) {
            // REPLACER:
            if (settings.autoreplace.enabled && objDist <= 400) {
                if (near.dist2 <= 300 && !track.inTrap) {
                    let tmpCount = -1;
                    for (let i = 0; i < Math.PI * 8; i += Math.PI / 1) {
                        tmpCount++
                        if (tmpCount == 1 && objDist <= 200) {
                            place(2, objAim);
                            place(2, objAim + Math.PI);
                            //io.send("6", "Test[2]");
                            replacing = false;
                        } else {
                            checkPlace(2, objAim + i);
                            //io.send("6", "Test[2]");
                            replacing = false;
                        }
                    }
                } else {
                    let tmpCount = -1;
                    for (let i = 0; i < Math.PI * 5.5; i += Math.PI / 2.2) {
                        if (player.items[4] == 15) {
                            tmpCount++;
                            if (tmpCount == 0 && objDist <= 200) {
                                place(2, objAim);
                                place(2, objAim + Math.PI);
                                //io.send("6", "Test[3]");
                                replacing = false;
                            } else {
                                checkPlace(2, objAim + i + 2);
                                //io.send("6", "Test[3]");
                                replacing = false;
                            }
                        }
                    }
                }
            }
            //tracker.replacer(findObj);
        }
    }
}
/*function killObject(sid) {
            if (trapSid == sid) {
                trapSid = undefined;
                hitCount = 0;
            }
    let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                if (player) {
                    for (let i = 0; i < breakObjects.length; i++) {
                        if (breakObjects[i].sid == sid) {
                            breakObjects.splice(i, 1);
                            break;
                        }
                    }
                }
    if (!findObj || !settings.autoreplace.enabled || !inGame || track.antiTrapped) return;
    let objAim = UTILS.getDirect(findObj, player, 0, 2);
    let objDst = UTILS.getDist(findObj, player, 0, 2);
    let perfectAngle = calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y);
    if (objDst <= 400 && near.dist2 <= 400 && isObjectBroken(findObj)) {
        let danger = this.checkSpikeTick();
        if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
            this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle, 1);
            spiketicktest();
        } else {
            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle, 1);
                spiketicktest();
                addChatEntry("spiketick test");
            }
        }
        this.replaced = true;
    }
                    if (!player.canSee(findObj)) {
                        breakTrackers.push({x: findObj.x, y: findObj.y});
                    }
                    if (breakTrackers.length > 8) {
                        breakTrackers.shift();
                    }
    if (objDst <= 100 && findObj.health <= 272.58 && near.dist2 <= 250) {
        let range = items.weapons[player.weapons[0]].range + 70;
        sendChat("spiketick test");
        place(2, objAim);
        spiketicktest();
    }
    objectManager.disableBySid(sid);
    if (player) {
        tracker.replacer(findObj);
    }
}*/
            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
        function isAlly(sid, pSid) {
            tmpObj = findPlayerBySID(sid)
            if (!tmpObj) {
                return
            }
            if (pSid) {
                let pObj = findPlayerBySID(pSid)
                if (!pObj) {
                    return
                }
                if (pObj.sid == sid) {
                    return true
                } else if (tmpObj.team) {
                    return tmpObj.team === pObj.team ? true : false
                } else {
                    return false
                }
            }
            if (!tmpObj) {
                return
            }
            if (player.sid == sid) {
                return true
            } else if (tmpObj.team) {
                return tmpObj.team === player.team ? true : false
            } else {
                return false
            }
        }
            function fgdo(a, b){
                return Math.sqrt(Math.pow((b.y-a.y),2)+Math.pow((b.x-a.x),2));
            }
            function precheckcanPlace(a, b) {
                checkcanPlace(a, b);
            }
            function doSyncHit() {
                if (player.reloads[player.weapons[0]] != 0 || InstaKill.isTrue || ![1, 2, 3, 4, 5, 6].includes(player.weapons[0]) || Math.sqrt(Math.pow((player.y2 || player.y) - near.y2, 2) + Math.pow((player.x2 || player.x) - near.x2, 2)) / 1.56 > items.weapons[player.weapons[0]].range) return false;
                let x = (near.velX || near.x2),
                    y = (near.velY || near.y2);
                let isEnemyTraped = false;
                for (let i = 0; i < gameObjects.length; i++) {
                    if(gameObjects[i] && gameObjects[i].name == "pit trap" && gameObjects[i].active && (gameObjects[i].owner.sid == player.sid || gameObjects[i].isTeamObject(player)) && Math.hypot(gameObjects[i].y - near.y2, gameObjects[i].x - near.x2) < 70) {
                        isEnemyTraped = true;
                    }
                    if (gameObjects[i] && gameObjects[i].dmg && gameObjects[i].active && isEnemyTraped == false && (gameObjects[i].owner.sid == player.sid || gameObjects[i].isTeamObject(player))) {
                        if (Math.hypot(gameObjects[i].y - y, gameObjects[i].x - x) <= 35 + gameObjects[i].scale) {
                            return true
                        }
                    }
                }
                if (near.health - (Math.round(player.weapons[0] == undefined ? 0 : items.weapons[player.weapons[0]].dmg * sortWeaponVariant(player.weaponVariant) * 1.5 * (near.skinIndex == 6 ? 0.75 : 1))) <= 0) {
                    return true;
                }
                return false;
            }
            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            function precheckPlace(a, b) {
                checkPlace(a, b);
            }
            function perfectReplace() {
                let range = items.weapons[player.weapons[0]].range + 70;
                const interval = setInterval(() => {
                    gameObjects.forEach(tmpObj => {
                        let objDst = UTILS.getDist(tmpObj, player, 0, 2);
                        let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);
                        if (fgdo(tmpObj, player) <= range && near.dist2 <= 300) {
                            sendChat('preplace');
                            precheckPlace(2, perfectAngle);
                        }
                    });
                });
                setTimeout(() => {
                    clearInterval(interval);
                }, 500);
            }
            // GAME TICKOUT:
            function setTickout(doo, timeout) {
                if (!ticks.manage[ticks.tick + timeout]) {
                    ticks.manage[ticks.tick + timeout] = [doo];
                } else {
                    ticks.manage[ticks.tick + timeout].push(doo);
                }
            }

            function doNextTick(doo) {
                waitTicks.push(doo);
            }

            function healInterception() {

            }
            let DmgPotStuff = {
                predictedDamage: 0
            };

            function handleDmgPot() {
                let tempDmg = 0;
                for (let i = 0; i < nears.length; i++) {
                    let singleIndividual = nears[i];
                    if (singleIndividual.primaryIndex != undefined) {
                        if (singleIndividual.reloads[singleIndividual.primaryIndex] == 0) {
                            tempDmg += items.weapons[singleIndividual.primaryIndex].dmg * sortWeaponVariant(singleIndividual.weaponVariant) * 1.5
                        }
                    } else {
                        tempDmg += 45 //placeholder dmg incase the dmgpot cant calculate the potential damage of primary for some reason (eg. enemy never showed their primary weapon)
                    }
                    if (singleIndividual.secondaryIndex != undefined) {
                        if (singleIndividual.reloads[singleIndividual.secondaryIndex] == 0) {
                            if ([9, 12, 13, 15].includes(singleIndividual.secondaryIndex)) {
                                tempDmg += items.weapons[singleIndividual.secondaryIndex].Pdmg
                            } else {
                                tempDmg += items.weapons[singleIndividual.secondaryIndex].dmg * sortWeaponVariant(singleIndividual.weaponVariant)
                            }
                        }
                    } else {
                        tempDmg += 50 //placeholder dmg incase the dmgpot cant calculate the potential damage of secondary for some reason (eg. enemy never showed their secondary weapon)
                    }
                    if (singleIndividual.reloads[53] == 0) {
                        tempDmg += 25
                    }
                }
                if (player.skinIndex == 7) { // this could really effect you man
                    tempDmg += 5
                }
                return Math.round(tempDmg)
            }
        function dist(a, b) {
            return Math.sqrt(Math.pow((b.y2 || b.y) - a.y2, 2) + Math.pow((b.x2 || b.x) - a.x2, 2))
        }
let oldXY = {
                x: undefined,
                y: undefined,
            };
            let waitTicks = [];
            // UPDATE PLAYER DATA:
            let nEy;
            var sentDatas = {
                lastTry: {
                    equip: {
                        skinIndex: 0,
                        tailIndex: 0,
                    },
                    buy: {
                        skinIndex: 0,
                        tailIndex: 0,
                    },
                    choose: [-1, null],
                },
                skins: buyEquip ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 55] : [],
                tails: buyEquip ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] : [],
            };
            var lastBullBleed = 0;
            var startBullBleed = 0;
let lastBleed = {
    amount: 0,
    time: 0,
    healed: true,
};
            let tick = 0;
            let enemies = {
    all: [],
    nearest: [],
    canHit: [],
    angle: function() {
        return Math.atan2(this.nearest.y2 - player.y2, this.nearest.x2 - player.x2);
    }
};
            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            /*function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function runPrePlacer() {
                let prePlaceObj = gameObjects.find(U => (getDist(player, U) <= 250) && (100*U.buildHealth/U.health) <= 66);
                if (enemy.length && prePlaceObj && !player.inTrap && ((getDist(player, prePlaceObj) <= items.weapons[player.weapons[0]].range) && (getDist(near, prePlaceObj) <= items.weapons[player.weapons[0]].range))) {
                    console.log("awdad real");
                    let pos = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                    if(!predictions.enemytracker.find(trap => getDist(trap, pos) <= 50 + items.list[player.items[2]].scale)) krovinPredict(2, getDir(player, prePlaceObj));
                    placeableSpikes.filter((i)=>UTILS.getAngleDist(i, getDir(player, prePlaceObj)) <= Math.PI/2).forEach(function(i){
                        let pos = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                        if(!predictions.enemytracker.find(trap => getDist(trap, pos) <= 50 + items.list[player.items[2]].scale)) krovinPredict(2, i)
                    })
                    setTickout(() => {
                        let pos = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                        if(!predictions.enemytracker.find(trap => getDist(trap, pos) <= 50 + items.list[player.items[2]].scale)) krovinPredict(2, getDir(player, prePlaceObj));
                        placeableSpikes.filter((i)=>UTILS.getAngleDist(i, getDir(player, prePlaceObj)) <= Math.PI/2).forEach(function(i){
                            let pos = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                            if(!predictions.enemytracker.find(trap => getDist(trap, pos) <= 50 + items.list[player.items[2]].scale)) krovinPredict(2, i)
                        })
                    }, 1);
                }
            }*/
function preplacetest(angle1, angle2) {
        // Normalize the angles to be between 0 and 2π
        angle1 = angle1 % (2 * Math.PI);
        angle2 = angle2 % (2 * Math.PI);

        // Calculate the absolute difference between the angles
        let diff = Math.abs(angle1 - angle2);

        // Adjust the difference to be between 0 and π
        if (diff > Math.PI) {
            diff = (2 * Math.PI) - diff;
        }

        return diff;
    }
    if(player) {
        let a = 1;
        let lool = null;
        if((player.reloads[player.weaponIndex] >= 90 || player.reloads[player.weaponIndex] == 0)) {
            a = 2;
            lool = player;
        } else if (enemy.length && (near.reloads[near.weaponIndex] >= 90 || near.reloads[near.weaponIndex] == 0)) {
            a = 3;
            lool = near;
        } else {
            a = 1;
            lool = null;
        }
        // preplacer
        if(a != 1 && lool != null && settings.preplacer.enabled) {
            let nearObja = gameObjects.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && UTILS.getDist(e, lool, 0, 2) <= (items.weapons[lool.weaponIndex].range + e.scale + 15));
            for(let i = 0; i < nearObja.length; i++) {
                let aaa = nearObja[i];
                let delay = (lool.reloads[lool.weaponIndex] + 32) - (window.pingTime*2/3)
                if(aaa.health - items.weapons[lool.weaponIndex].dmg * (config.weaponVariants[lool[(lool.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[lool.weaponIndex].sDmg || 1) * (lool.skinIndex == 40 ? 3.3 : 1) <= 0) {
                    setTimeout(() => {
                        const intervalId6 = setInterval(() => {
                            if (secPacket < 45) {
                                for (let i = 0; i < 3; i++) {
                                    place(2, caf(aaa, player) + Math.PI);
                                    sendChat("preplace");
                                }
                            } else {
                                clearInterval(intervalId6);
                            }
                        }, 0);
                    }, delay)
                }
            }
        }
    }
// UPDATE PLAYER DATA:
function updatePlayers(data) { // some stuff here
    function getAngleDifference(angle1, angle2) {
        // Normalize the angles to be between 0 and 2π
        angle1 = angle1 % (2 * Math.PI);
        angle2 = angle2 % (2 * Math.PI);
        // Calculate the absolute difference between the angles
        let diff = Math.abs(angle1 - angle2);
        // Adjust the difference to be between 0 and π
        if (diff > Math.PI) {
            diff = (2 * Math.PI) - diff;
        }

        return diff;
    }
    if(player && inGame) {
        let a = 1;
        let lool = null;
        if((player.reloads[player.weaponIndex] >= 90 || player.reloads[player.weaponIndex] == 0)) {
            a = 2;
            lool = player;
        } else if (near.length && (near.reloads[near.weaponIndex] >= 90 || near.reloads[near.weaponIndex] == 0)) {
            a = 3;
            lool = near;
        } else {
            a = 1;
            lool = null;
        }
        // preplacer
        if(a != 1 && lool != null && settings.preplacer.enabled && near.dist2 <= 250) {
            let nearObja = gameObjects.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && UTILS.getDist(e, lool, 0, 2) <= (items.weapons[lool.weaponIndex].range + e.scale + 15));
            for(let i = 0; i < nearObja.length; i++) {
                let aaa = nearObja[i];
                let delay = (lool.reloads[lool.weaponIndex] + 25) - (window.pingTime*2/4)
                if(aaa.health - items.weapons[lool.weaponIndex].dmg * (config.weaponVariants[lool[(lool.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[lool.weaponIndex].sDmg || 1) * (lool.skinIndex == 40 ? 3.3 : 1) <= 0) {
                    setTimeout(() => {
                        const intervalId6 = setInterval(() => {
                            if (secPacket < 70) {
                                for (let i = 0; i < 3; i++) {
                                    place(2, caf(aaa, player) + Math.PI);
                                    sendChat("preplace");
                                }
                            } else {
                                clearInterval(intervalId6);
                            }
                        }, 0);
                    }, delay)
                }
            }
        }
    }
    game.tick++;
    enemy = [];
    nears = [];
    near = [];
    game.tickSpeed = performance.now() - game.lastTick;
    game.lastTick = performance.now();
    players.forEach((tmp) => {
        tmp.forcePos = !tmp.visible;
        tmp.visible = false;
        if((tmp.timeHealed - tmp.timeDamaged)>0 && tmp.lastshamecount<tmp.shameCount)
            tmp.pinge = (tmp.timeHealed - tmp.timeDamaged);
    });
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
            tmpObj.t2 = game.lastTick;
            tmpObj.oldPos.x2 = tmpObj.x2;
            tmpObj.oldPos.y2 = tmpObj.y2;
            tmpObj.x1 = tmpObj.x;
            tmpObj.y1 = tmpObj.y;
            tmpObj.x2 = data[i + 1];
            tmpObj.y2 = data[i + 2];
            tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
            tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
            tmpObj.d2 = data[i + 3];
            tmpObj.dt = 0;
            tmpObj.buildIndex = data[i + 4];
            tmpObj.weaponIndex = data[i + 5];
            tmpObj.weaponVariant = data[i + 6];
            tmpObj.team = data[i + 7];
            tmpObj.isLeader = data[i + 8];
            tmpObj.oldSkinIndex = tmpObj.skinIndex;
            tmpObj.oldTailIndex = tmpObj.tailIndex;
            tmpObj.skinIndex = data[i + 9];
            tmpObj.tailIndex = data[i + 10];
            tmpObj.iconIndex = data[i + 11];
            tmpObj.zIndex = data[i + 12];
            tmpObj.visible = true;
            tmpObj.update(game.tickSpeed);
            tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
            tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
            tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
            tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
            //tmpObj.damageThreat = 0;
            if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                tmpObj.addShameTimer();
            }
                        if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                            tmpObj.shameTimer = 0;
                            tmpObj.shameCount = 0;
                            if (tmpObj == player) {
                                slowHeal();
                            }
                        }
                        /*nEy = tmpObj;
                        if (tmpObj == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt||0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                    }
                                });*/
                        if (tmpObj == player) {
                            (!millC.x || !oldXY.x) && (millC.x = oldXY.x = tmpObj.x2);
                            (!millC.y || !oldXY.y) && (millC.y = oldXY.y = tmpObj.y2);
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                    }
                                });
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 5) && !e.isTeamObject(tmpObj)).sort(function (a, b) {
                                    return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    track.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    track.trapAim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);
                                    if (!track.inTrap) {
                                        tracker.protect(track.trapAim);
                                    }
                                    track.inTrap = true;
                                    track.info = nearTrap;
                                } else {
                                    track.inTrap = false;
                                    track.info = {};
                                }
                            } else {
                                track.inTrap = false;
                            }
                        }
                        if (tmpObj.weaponIndex < 9) {
                            tmpObj.primaryIndex = tmpObj.weaponIndex;
                            tmpObj.primaryVariant = tmpObj.weaponVariant;
                        } else if (tmpObj.weaponIndex > 8) {
                            tmpObj.secondaryIndex = tmpObj.weaponIndex;
                            tmpObj.secondaryVariant = tmpObj.weaponVariant;
                        }
                    }
                    i += 13;
                }
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj)=>{
                        ajaj();
                    }
                                     );
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp)=>{
                        checkProjectileHolder(...tmp);
                    }
                                         );
                    runAtNextTick = [];
                }
if (textManager.stack.length) {
    textManager.stack.forEach((text) => {
        if (text.value >= 0) {
            textManager.showText(text.x, text.y, Math.max(45, Math.min(50, text.value)), 0.18, 500, text.value, "#fff");
        } else {
            textManager.showText(text.x, text.y, Math.max(45, Math.min(50, Math.abs(text.value))), 0.18, 500, -text.value, "#8ecc51");
        }
    });
    textManager.stack = [];
}
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (!tmpObj.isTeam(player)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                                nears.push(tmpObj);
                            }
                        }
                        tmpObj.manageReload();
                        if (tmpObj != player) {
                            //tmpObj.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                /*projectiles.forEach((proj) => {
                    tmpObj = proj;
                    if (tmpObj.active) {
                        tmpObj.tickUpdate(game.tickSpeed);
                    }
                });*/
                if (player && player.alive) {
                    if (enemy.length) {
                        near = enemy.sort(function (tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    } else {
                        // console.log("no enemy");
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
// Damage Pot Based Anti
if (advHeal.length) {
    advHeal.forEach((updHealth) => {
        const [sid, value, damaged] = updHealth;
        const tmpObj = findPlayerBySID(sid);
        if (!tmpObj) return;
        const isPlayer = tmpObj === player;
        const isDead = tmpObj.health <= 0;
        if (isDead && !tmpObj.death) {
            tmpObj.death = true;
            if (isPlayer) {
            }
            addDeadPlayer(tmpObj);
        }
        if (isPlayer) {
            const isSkin7 = tmpObj.skinIndex === 7;
            const isTail13Damaged2 = tmpObj.latestTail === 13 && damaged === 2;
            if (isSkin7 && (damaged === 5 || isTail13Damaged2)) {
                if (track.reSync) {
                    track.reSync = false;
                    tmpObj.setBullTick = true;
                }
            }
            if (inGame) {
                const attackers = getAttacker(damaged);
                const gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg);
                const includeSpikeDmgs = enemies.length && !isSkin7 && gearDmgs.includes(damaged) && enemies[0].skinIndex === 11 && enemies[0].tailIndex === 21;
                const healTimeout = 25;
                const slowHeal = function (timer) {
                    setTimeout(() => {
                        uziheal();
                    }, timer);
                };
                let waHeal = function(timer) {
                    setTimeout(() => {
                        uziheal();
                    }, 30);
                };
                let doveryslowHeal = function(timer) {
                     setTimeout(() => {
                        uziheal();
                    }, 40);
                };
        /*if (player.health < 100) {
            waHeal();
        } else if (player.shameCount < 4) {
            doveryslowHeal();
        }*/
            if (damaged >= 35 && dmgPredict >= 50 && tmpObj.shameCount <= 5) {
                    if (player.secondaryIndex !== undefined && player.secondaryIndex !== null &&
                        player.primaryIndex !== undefined && player.primaryIndex !== null && tmpObj.skinIndex === 6) {
                        player.canEmpAnti = true;
                        buyEquip(6, 0);
                        //healer(healTimeout);
                        antiinsta = "Normal-Anti";
                    }
                }
                const dmg = 100 - player.health;
                const isDamagedThreshold = damaged >= (includeSpikeDmgs ? 8 : 20) && dmgPredict >= 20 && (game.tick - tmpObj.antiTimer) > 1;
                if (isDamagedThreshold) {
                    const isReloadAvailable = tmpObj.reloads[53] === 0 && tmpObj.reloads[tmpObj.weapons[1]] === 0;
                    if (isReloadAvailable) {
                        tmpObj.canEmpAnti = true;
                    } else {
                        player.soldierAnti = true;
                    }
                    tmpObj.antiTimer = game.tick;
                    const shame = tmpObj.weapons[0] === 4 ? 2 : 5;
                    if (tmpObj.shameCount < shame) {
                        uziheal();
                    } else {
                        game.tickBase(() => {
                            uziheal();
                        }, 1);
                    }
                } else {
                    game.tickBase(() => {
                        uziheal();
                    }, 1);
                }
                if (damaged >= 20 && player.skinIndex == 11) InstaKill.canCounter = true;
            }
        } else {
            if (!tmpObj.setPoisonTick && (tmpObj.damaged === 5 || (tmpObj.latestTail === 13 && tmpObj.damaged === 2))) {
                tmpObj.setPoisonTick = true;
            }
        }
    });
    advHeal = [];
}
                    if (settings.autoq.enabled && player.shameCount < 5 && near.dist2 <= 450 && near.reloads[near.secondaryIndex] == 0) {
                        place(0, getAttackDir());
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                                6: 0,
                                7: 0,
                                8: 0,
                                9: 0,
                                10: 0,
                                11: 0,
                                12: 0,
                                13: 0,
                                14: 0,
                                15: 0,
                                53: 0,
                            };
                        }
                        if (tmp.setBullTick) {
                            tmp.bullTimer = 0;
                        }
                        if (tmp.setPoisonTick) {
                            tmp.poisonTimer = 0;
                        }
                        tmp.updateTimer();
                    });
                    if (inGame) {
                        if (enemy.length) {
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !track.safePrimary(near) && !track.safeSecondary(near)) {
                                    if (near.reloads[53] == 0){
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        //modLog("EmpAnti");
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        //modLog("SoldierAnti");
                                    }
                                }
                            }
let prenegro = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function (a, b) {
    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
})[0];
if (prenegro) {
    let spikedis = UTILS.getDist(prenegro, near, 0, 2);
    if (near.dist2 <= items.weapons[player.weapons[0]].range) { // + player.scale * 1.8
        InstaKill.canSpikeTick = true;
        InstaKill.syncHit = true;
        if (settings.revinsta.enabled && player.weapons[1] == 15 && player.reloads[53] == 0 && InstaKill.perfCheck(player, near)) {
            InstaKill.revTick = true;
        }
    } else if (spikedis && near.dist2 < 250 && prespike) {
        spiketicktest();
    }
}
                        if (doSyncHit) {
                            if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                            InstaKill.canSpikeTick = true;
                            InstaKill.syncHit = true;
                            if (settings.revinsta.enabled && player.weapons[1] == 15 && player.reloads[53] == 0 && InstaKill.perfCheck(player, near)) {
                                InstaKill.revTick = true;
                            }
                        }
                    }
let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active &&!tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort((a, b) => UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2))[0];
if (antiSpikeTick) {
    if (UTILS.getDist(near, player, 0, 2) <= items.weapons[5].range + near.scale * 1.8) {
        track.tick.antiTick = 1;
        healer();
        buyEquip(6, 0);
    }
}
                        }
                   turretEmp = gameObjects.filter(e => (e.name == "turret" && player.sid != e.owner.sid && !findAllianceBySid(e.owner.sid) && objDist(e, player) <= 700 && e.active));
                        if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (InstaKill.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !InstaKill.isTrue && !track.hits.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : InstaKill.wait ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && InstaKill.perfCheck(player, near)) {
                            if (player.checkCanInsta(true) >= 100) {
                                InstaKill.nobull = useWasd ? false : InstaKill.canSpikeTick ? false : true;
                            } else {
                                InstaKill.nobull = false;
                            }
                            InstaKill.can = true;
                        } else {
                            InstaKill.can = false;
                        }
if (macro.q) place(0, getAttackDir());
if (macro.f) {
    for (let i = 0; i < 4; ++i) {
        place(4, quadplacer(i));
    }
}
if (macro.v) place(2, getSafeDir());
if (macro.y) place(5, getSafeDir());
if (macro.h) place(player.getItemType(22), getSafeDir());
if (macro.n) place(3, getSafeDir());
                        try {
                            let objectSize = millC.size(items.list[player.items[3]].scale);
                            let objectDist = millC.dist(items.list[player.items[3]].scale);
                            if (UTILS.getDist(millC, player, 0, 2) > objectDist + items.list[player.items[3]].placeOffset) {
                                if (mills.place) {
                                    let millDir = UTILS.getDirect(millC, player, 0, 2);
                                    let plusXY = {
                                        x: millC.x,
                                        y: millC.y
                                    };
                                    let Boom = UTILS.getDirect(plusXY, player, 0, 2);
                                    checkPlace(3, Boom);
                                    checkPlace(3, Boom + UTILS.toRad(objectSize));
                                    checkPlace(3, Boom - UTILS.toRad(objectSize));
                                    millC.count = Math.max(0, millC.count - 1);
                                }
                                millC.x = player.x2;
                                millC.y = player.y2;
                            }
                        } catch (e) {}
                        if (game.tick % 2 == 0) {
                            if (mills.placeSpawnPads) {
                                for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                    checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                }
                            }
                        }
                        if (InstaKill.can) {
                            InstaKill.changeType(player.weapons[1] == 10 ? "rev" : InstaKill.nobull ? "nobull" : "normal");
                        }
            if (waitSpikeTick) {
                waitSpikeTick = false;
                if (!InstaKill.isTrue) {
                    spiketicktest();
                    notif("spiketick testing");
                }
            }
                        if (InstaKill.hitBack) {
                            InstaKill.hitBack = false;
                            if (player.reloads[player.weapons[0]] == 0 && !InstaKill.isTrue) {
                                InstaKill.hitBackType();
                                addChatEntry("hitback test");
                            }
                        }
                /*if (getEl("preplace").checked) {
                    if (nears.length && player && gameObjects.length) {
                        preplacer(gameObjects);
                    }
                }*/
                        if (InstaKill.canCounter) {
                            InstaKill.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !InstaKill.isTrue) {
                                InstaKill.counterType();
                            }
                        }
                        if (InstaKill.canSpikeTick) {
                            InstaKill.canSpikeTick = false;
                            if (InstaKill.revTick) {
                                InstaKill.revTick = false;
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !InstaKill.isTrue) {
                                    InstaKill.changeType("rev");
                                    //addMenuChText("Mod", "Rev SyncHit", "lightBlue");
                                }
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !InstaKill.isTrue) {
                                    //InstaKill.spikeTickType();
                                    if (InstaKill.syncHit) {
                                        //addMenuChText("Mod", "SyncHit", "lightBlue");
                                    }
                                }
                            }
                        }
                        if (!clicks.middle && (clicks.spacebar || clicks.right) && !InstaKill.isTrue) {
                            if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                            }
                            if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !track.hits.waitHit) {
                                sendAutoGather();
                                track.hits.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    track.hits.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (abs && !clicks.spacebar && !clicks.right && !InstaKill.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !track.inTrap && !player.reloads[player.weapons[1]]) {
                            if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                player.reloads[player.weapons[0]] == 0;
                                selectWeapon(player.weapons[0]);
                            }
                            if (player.reloads[player.weapons[0]] == 0 && !track.hits.waitHit) {
                                track.hits.reloaded = true;
                                track.auto.aim = true;
                                sendAutoGather();
                                player.reloads[player.weapons[0]] == 0;
                                selectWeapon(player.weapons[0]);
                                buyEquip(18, 1);
                                track.hits.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    track.hits.waitHit = 0;
                                    track.auto.aim = false;
                                }, 1);
                            }
                        }
                        if (settings.pvpbot.enabled && !clicks.spacebar && !clicks.right && !InstaKill.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !track.inTrap && !player.reloads[player.weapons[1]]) {
                            if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                player.reloads[player.weapons[0]] == 0;
                                selectWeapon(player.weapons[0]);
                            }
                            if (player.reloads[player.weapons[0]] == 0 && !track.hits.waitHit) {
                                track.hits.reloaded = true;
                                track.auto.aim = true;
                                sendAutoGather();
                                player.reloads[player.weapons[0]] == 0;
                                selectWeapon(player.weapons[0]);
                                buyEquip(6, 0);
                                track.hits.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    track.hits.waitHit = 0;
                                    track.auto.aim = false;
                                }, 1);
                            }
                        }
// autobreak ass
if (track.inTrap) {
    antibull = false; // safety first
    let buildings = gameObjects.sort((a, b) => Math.sqrt(Math.pow(a.y - player.y, 2) + Math.pow(a.x - player.x, 2)) - Math.sqrt(Math.pow(b.y - player.y, 2) + Math.pow(b.x - player.x, 2)));
    let spike = buildings.filter(obj => (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') && Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < player.scale + obj.scale + 20 && !obj.isTeamObject(player) && obj.active)[0];
    if (!clicks.spacebar && !clicks.right && !InstaKill.isTrue) {
        if (spike) {
            track.trapAim = Math.atan2(spike.y - player.y, spike.x - player.x);
        }
        if (player.weaponIndex != (notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
            selectWeapon(notFast() ? player.weapons[1] : player.weapons[0]);
        }
        if (hitCount == 2 && player.weapons[1]) {
            antiTick = true;
            buyEquip(6, 0);
        }
        if (player.reloads[notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !track.hits.waitHit) {
            //if (hitCount !== 2 && player.weapons[1] == 10) {
            //buyEquip(40, 0);
                sendAutoGather();
                track.hits.waitHit = 1;
                //player.visible = false;
                game.tickBase(() => {
                    track.force.soldierspike = true; // for anti spiketick
                    //setTickout(() => {
                    sendAutoGather();
                    track.hits.waitHit = 0;
                    track.force.soldierspike = true;
                    //player.visible = true;
                }, 1);
            }
        }
    track.force.soldierspike = false; // so u wont get stuck at soldier :thumbs_up:
}
/*function antispiketick() {
    if (near.dist2 <= 130 && settings.antispiketick.enabled && track.inTrap) {
        track.force.soldier = true;
        buyEquip(6, 0);
    } else if (antiTick) {
        buyEquip(6, 0);
    }
    track.force.soldier = false;
}
antispiketick();*/
        function checkForTouchSpike() {
            track.force.soldierspike = false;
            if (track.inTrap) return;
            if (clicks.spacebar || clicks.right) return;
            for (let i = 0; i < gameObjects.length; i++) {
                let obj = gameObjects[i];
                let x = player.x2 + Math.cos(lastMoveDir) * Math.hypot(obj.y - player.y2, obj.x - player.x2),
                    y = player.y2 + Math.sin(lastMoveDir) * Math.hypot(obj.y - player.y2, obj.x - player.x2);
                if (obj && obj.dmg && obj.active && obj.owner.sid != player.sid && !isAlly(obj.owner.sid)) {
                    if (Math.hypot(obj.y - (player.velY || player.y2), obj.x - (player.velX || player.x2)) <= obj.scale + 40) {
                        track.force.soldierspike = true;
                    } else if (Math.hypot(obj.y - y, obj.x - x) <= obj.scale && Math.hypot(obj.y - player.y2, obj.x - player.x2) <= obj.scale + 110) {
                        track.force.soldierspike = true;
                    }
                }
            }
        }
// safe walk ez
if (player) {
    if (secPacket.count >= 80) return;
    let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
    let spikes = buildings.filter(obj =>
        (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') &&
        Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < fgdo(player, obj) < 250 &&
        !obj.isTeamObject(player) && obj.active
    );
    if (spikes.length > 0 && !track.inTrap && !track.pushdata.pushData.autoPush && !clicks.right && settings.safewalk.enabled) {
        let spikedist = 190; // self explanatory
        let closestSpike = spikes.reduce((closest, current) => {
            let closestDist = Math.sqrt(Math.pow(closest.y - player.y, 2) + Math.pow(closest.x - player.x, 2));
            let currentDist = Math.sqrt(Math.pow(current.y - player.y, 2) + Math.pow(current.x - player.x, 2));
            return currentDist < closestDist ? current : closest;
        });
        let spiked = Math.sqrt(Math.pow(closestSpike.y - player.y, 2) + Math.pow(closestSpike.x - player.x, 2));
        let safe = player.scale + closestSpike.scale;
        // stops player from moving
        let ap = {
            niglet: undefined,
        };
        // all of this codes are for calculating :thumbs_up:
        if (spiked < spikedist && spiked > safe) {
            let moveDir = getMoveDir();
            if (moveDir !== undefined) {
                let directionX = player.x - closestSpike.x;
                let directionY = player.y - closestSpike.y;
                let angleToSpike = Math.atan2(directionY, directionX);
                let angleDiff = Math.abs(moveDir - angleToSpike);
                if (angleDiff > Math.PI) {
                    angleDiff = 2 * Math.PI - angleDiff;
                }
                // this part of the code is useless
                if (angleDiff > Math.PI / 2) {
                    let dx = player.x - closestSpike.x;
                    let dy = player.y - closestSpike.y;
                    let distance = Math.sqrt(dx * dx + dy * dy); // no idea why i have this when its litteraly useless :sob:
                    let ratio = spikedist / distance;
                    let newX = closestSpike.x + dx * ratio;
                    let newY = closestSpike.y + dy * ratio;
                    player.x = newX;
                    player.y = newY;
                    // the start of REAL calculation
                    let vecX = player.x - closestSpike.x;
                    let vecY = player.y - closestSpike.y;
                    let length = Math.sqrt(vecX * vecX + vecY * vecY); // calculates spike and player length
                    vecX /= length;
                    vecY /= length;
                    let pushDistance = 6; // control how strong u want it to push player away from spike
                    let pushX = player.x + vecX * pushDistance;
                    let pushY = player.y + vecY * pushDistance;
                    io.send("a", pushX, pushY, 2); // pushes the player away from spike
                    addChatEntry("spike detected, pushing away..");
                }
            }
            // this code lets the player move if it detects it's trying to move away from the spike - uzi
            player.velocityX = 0;
            player.velocityY = 0;
            biomeGear(); // calls biomegear so it doesnt get stuck at any hat idk why it does that
            io.send("a", ap.niglet, 0); // let player move
        } else {
            io.send("a", ap.niglet, 0);
        }
    }
}
// safe walk for bot ez
if (player) {
    let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
    let spikes = buildings.filter(obj =>
        (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') &&
        Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < fgdo(player, obj) < 250 &&
        !obj.isTeamObject(player) && obj.active
    );
    if (spikes.length > 0 && !track.inTrap && !track.pushdata.pushData.autoPush && !clicks.right && settings.pvpbot.enabled) {
        let spikedist = 190; // self explanatory
        let closestSpike = spikes.reduce((closest, current) => {
            let closestDist = Math.sqrt(Math.pow(closest.y - player.y, 2) + Math.pow(closest.x - player.x, 2));
            let currentDist = Math.sqrt(Math.pow(current.y - player.y, 2) + Math.pow(current.x - player.x, 2));
            return currentDist < closestDist ? current : closest;
        });
        let spiked = Math.sqrt(Math.pow(closestSpike.y - player.y, 2) + Math.pow(closestSpike.x - player.x, 2));
        let safe = player.scale + closestSpike.scale;
        // either stops the player from moving or lets player move
        let ap = {
            niglet: undefined,
        };
        // all of this codes are for calculating :thumbs_up:
        if (spiked < spikedist && spiked > safe) {
            let moveDir = getMoveDir();
            if (moveDir !== undefined) {
                let directionX = player.x - closestSpike.x;
                let directionY = player.y - closestSpike.y;
                let angleToSpike = Math.atan2(directionY, directionX);
                let angleDiff = Math.abs(moveDir - angleToSpike);
                if (angleDiff > Math.PI) {
                    angleDiff = 2 * Math.PI - angleDiff;
                }
                // this part of the code is useless
                if (angleDiff > Math.PI / 2) {
                    let dx = player.x - closestSpike.x;
                    let dy = player.y - closestSpike.y;
                    let distance = Math.sqrt(dx * dx + dy * dy); // no idea why i have this when its litteraly useless :sob:
                    let ratio = spikedist / distance;
                    let newX = closestSpike.x + dx * ratio;
                    let newY = closestSpike.y + dy * ratio;
                    player.x = newX;
                    player.y = newY;
                    // the start of REAL calculation
                    let vecX = player.x - closestSpike.x;
                    let vecY = player.y - closestSpike.y;
                    let length = Math.sqrt(vecX * vecX + vecY * vecY); // calculates spike and player length
                    vecX /= length;
                    vecY /= length;
                    let pushDistance = 6; // control how strong u want it to push player away from spike
                    let pushX = player.x + vecX * pushDistance;
                    let pushY = player.y + vecY * pushDistance;
                    io.send("a", pushX, pushY, 2); // pushes the player away from spike
                    addChatEntry("spike detected, pushing away..");
                }
            }
            // this code lets the player move if it detects it's trying to move away from the spike - uzi
            player.velocityX = 0;
            player.velocityY = 0;
            biomeGear(); // calls biomegear so it doesnt get stuck at any hat
            io.send("a", ap.niglet, 0); // let player move
        } else {
            io.send("a", ap.niglet, 0);
        }
    }
}
/*// old anti spike
if (player) {
    let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x))
    let spike = buildings.find(obj =>
        (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') &&
        Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < fgdo(player, obj) < 250 &&
        !obj.isTeamObject(player) && obj.active
    );
    if (spike && !track.inTrap && !clicks.right && !clicks.spacebar && !track.pushdata.pushData.autoPush && getEl("antispike").checked) {
        let spikelimit = 230;
        let spiked = Math.sqrt(Math.pow(spike.y - player.y, 2) + Math.pow(spike.x - player.x, 2));
        let safe = player.scale + spike.scale;
        let ap = {
            niglet: undefined,
        }
        if (spiked < spikelimit && spiked > safe) {
            let dir = lastMoveDir;
            let moveDir = getMoveDir();
            if (moveDir !== undefined) {
                let directionX = player.x - spike.x;
                let directionY = player.y - spike.y;
                let angleToSpike = Math.atan2(directionY, directionX);
                // calculates the angle
                let angleDiff = Math.abs(moveDir - angleToSpike);
                if (angleDiff > Math.PI) {
                    angleDiff = 2 * Math.PI - angleDiff;
                }
                if (angleDiff > Math.PI / 2) {
                    biomeGear();
                    io.send("a", ap.niglet, 1); // stops movement
                    notif("spike detected", "stopping");
                    return;
                }
            }
            // this code lets the play move if it detects its trying to move away from spike
            player.velocityX = 0;
            player.velocityY = 0;
            biomeGear(); // calls biomegear so it doesnt get stuck at any hat
            io.send("a", ap.niglet, 0); // let player move
            return;
        }
    }
}*/
                        let age = player.upgrAge; // so this negro wont kick ur ass
                        if (macro.g && !track.inTrap && age >= 7) {
                            if (!InstaKill.isTrue && player.reloads[player.weapons[1]] == 0) {
                                if (track.tick.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                                    InstaKill.bowMovement();
                                } else {
                                    InstaKill.rangeType();
                                }
                            }
                        }
                        if (macro.t && !track.inTrap) {
                            if (!InstaKill.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                                InstaKill[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                            }
                        }
                        if (macro["."] && !track.inTrap) {
                            if (!InstaKill.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                                InstaKill.boostTickMovement();
                            }
                        }
                        if (player.weapons[1] && !clicks.spacebar && !clicks.right && !track.inTrap && !InstaKill.isTrue && !(useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!track.hits.reloaded) {
                                    track.hits.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[fastSpeed]);
                                    }
                                }
                            } else {
                                track.hits.reloaded = false;
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1]);
                                    }
                                }
                            }
                        }
                        if (!InstaKill.isTrue && !track.inTrap && !track.replaced && settings.autoplace.enabled && secPacket <= 90) {
                            autoplace();
                        }
                        if (!InstaKill.isTrue && !track.inTrap && !track.replaced) {
                            preplacer();
                        }
                        if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                            io.send("D", getAttackDir());
                        }
                        function equipFaster(itemID, slot) {
                            setTimeout(() => {
                                buyEquip(itemID, slot);
                            }, 0);
                        }
// switch shit
let hatChanger = function() {
    let buildings = gameObjects.sort((a, b) => Math.sqrt(Math.pow(a.y - player.y, 2) + Math.pow(a.x - player.x, 2)) - Math.sqrt(Math.pow(b.y - player.y, 2) + Math.pow(b.x - player.x, 2)));
    let spike = buildings.filter(obj => (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') && Math.sqrt(Math.pow(obj.y - player.y, 2) + Math.pow(obj.x - player.x, 2)) < player.scale + obj.scale + 20 && !obj.isTeamObject(player) && obj.active)[0];
    if (!track.inTrap) {
        track.force.soldierspike = false;
        track.force.soldier = false
    }
    if (clicks.spacebar || clicks.right) {
        if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || (player.shameCount > 0 && !(near.dist2 <= 250)) && !clicks.right && !track.inTrap) {
            buyEquip(7, 0);
        } else {
            if (clicks.spacebar) {
                buyEquip(player.reloads[player.weapons[0]] == 0 ? settings.autogrind.enabled ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "PAB" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (antibull && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
            } else if (clicks.right) {
                buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "PAB" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (antibull && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
            }
            if (clicks.spacebar || clicks.right) {
                buyEquip(0, 1);
            }
            if (turretEmp.length) {
                buyEquip(22, 0);
            }
            if (track.inTrap) {
                player.bullTick = false;
            }
        }
    } else if (track.inTrap) {
        if (track.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
            if (near.dist2 <= 130 && settings.antispiketick.enabled && !spike) {
                track.force.soldier = true;
                buyEquip(6, 0);
            } else {
                track.force.soldier = false;
                buyEquip(40, 0);
            }
        }
        else if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || (player.shameCount > 0 && !(near.dist2 <= 250)) && !clicks.right && !track.inTrap) {
            buyEquip(7, 0);
        } else {
            buyEquip((getEl("antiBullType").value == "PAB" || antibull) ? 11 : (player.empAnti || near.dist2 > 300 || !enemy.length) ? 22 : 6, 0);
        }
    } else {
        if (player.empAnti || player.soldierAnti) {
            buyEquip(player.empAnti ? 22 : 6, 0);
        } else {
            if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || (player.shameCount > 0 && !(near.dist2 <= 250)) && !clicks.right && !track.inTrap) {
                buyEquip(7, 0);
            } else {
                if (near.dist2 <= 250) {
                    buyEquip(6, 0);
                } else {
                    if (near.dist2 <= 300 && antibull) {
                        //buyEquip(21, 1);
                        buyEquip((antibull && near.antiBull > 0) ? 11 : (antibull && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                    } else {
                        biomeGear(1);
                    }
                }
                if (turretEmp.length) {
                    buyEquip(22, 0);
                }
            }
        }
    }
}
            let accChanger = function() {
                if (near.dist2 <= 300 && !clicks.right) {
                    buyEquip(21, 1);
                } else if (clicks.right) {
                    //buyEquip(18, 1);
                } else if (clicks.spacebar) {
                    //buyEquip(18, 1);
                } else {
                    track.inTrap ? buyEquip(21, 1) : buyEquip(11, 1);
                }
            }
                        if (storeMenu.style.display != "block" && !InstaKill.isTrue && !InstaKill.ticking) {
                                hatChanger();
                                accChanger();
                                equipFaster();
                            }
                        //lastMoveDir = getSafeDir();
                        //io.send("33", lastMoveDir, 1);
                        let a = true;
                        if (a && enemy.length && !track.inTrap && !InstaKill.ticking && settings.autopush.enabled && player.skinIndex != 45) {
                            autoPush();
                        } else {
                            if (track.pushdata.pushData.autoPush) {
                                track.pushdata.pushData.autoPush = false;
                                io.send("a", lastMoveDir || undefined, 1);
                            }
                        }
                        if (!track.pushdata.pushData.autoPush && pathFind.active && settings.pathfind.enabled) {
                            Pathfinder();
                        }
                        if (!track.pushdata.pushData.autoPush && settings.pvpbot.enabled) {
                            autobot();
                            Pathfinder();
                        }
                        if (!track.pushdata.pushData.autoPush && getEl("randomdi").checked) {
                            randomDirection();
                            //Pathfinder();
                        }
                        if (InstaKill.ticking) {
                            InstaKill.ticking = false;
                        }
                        if (InstaKill.syncHit) {
                            InstaKill.syncHit = false;
                        }
                        if (player.empAnti) {
                            player.empAnti = false;
                        }
                        if (player.soldierAnti) {
                            player.soldierAnti = false;
                        }
                        if (track.tick.antiTick > 0) {
                            track.tick.antiTick--;
                        }
                        if (track.replaced) {
                            track.replaced = false;
                        }
                   // musicV = audio.paused ? 'Off' : 'On';
                    //
                    if(player.skins[22]) {
                        $(".augh").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[7]) {
                        $(".augh1").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[6]) {
                        $(".augh2").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[40]) {
                        $(".augh3").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[31]) {
                        $(".augh4").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[15]) {
                        $(".augh5").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[11]) {
                        $(".augh6").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[53]) {
                        $(".augh7").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[18]) {
                        $(".augh8").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[21]) {
                        $(".augh9").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    $("#killCounter").show();
                } else {
                    $("#killCounter").hide();
                }
                if(player && player.alive) {
                    $(".augh").css({
                        "display": "inline-block"
                    });
                    $(".augh1").css({
                        "display": "inline-block"
                    });
                    $(".augh2").css({
                        "display": "inline-block"
                    });
                    $(".augh3").css({
                        "display": "inline-block"
                    });
                    $(".augh4").css({
                        "display": "inline-block"
                    });
                    $(".augh5").css({
                        "display": "inline-block"
                    });
                    $(".augh6").css({
                        "display": "inline-block"
                    });
                    $(".augh7").css({
                        "display": "inline-block"
                    });
                    $(".augh8").css({
                        "display": "inline-block"
                    });
                    $(".augh9").css({
                        "display": "inline-block"
                    });
                } else {
                    $(".augh").css({
                        "display": "none"
                    });
                    $(".augh1").css({
                        "display": "none"
                    });
                    $(".augh2").css({
                        "display": "none"
                    });
                    $(".augh3").css({
                        "display": "none"
                    });
                    $(".augh4").css({
                        "display": "none"
                    });
                    $(".augh5").css({
                        "display": "none"
                    });
                    $(".augh6").css({
                        "display": "none"
                    });
                    $(".augh7").css({
                        "display": "none"
                    });
                    $(".augh8").css({
                        "display": "none"
                    });
                    $(".augh9").css({
                        "display": "none"
                    });
                        if (track.antiTrapped) {
                            track.antiTrapped = false;
                        }
                    }
                }
           }
            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                lastLeaderboardData = data;
                return;
                UTILS.removeAllChildren(leaderboardData);
                let tmpC = 1;
                for (let i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.sFormat(data[i+2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }
            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    // sid, x, y, dir, s, type, data, setSID, owner
                    let dist = UTILS.getDist({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    let aim = UTILS.getDirect({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    let find = findObjectBySid(data[i]);
                    if (data[i + 6] == 15) {
                        if (find && !find.isTeamObject(player)) {
                            if (dist <= 100) {
                                track.dist = dist;
                                track.trapAim = aim;
                                tracker.protect(aim);
                            }
                        }
                    }
                    i += 8;
                }
            }

            // ADD AI:
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }

            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }
// GATHER ANIMATION:
track.tick.antiSync = false;
function gatherAnimation(sid, didHit, index) {
    let tmpObj = findPlayerBySID(sid);
    if (!tmpObj) {
        return;
    }
    tmpObj.startAnim(didHit, index);
    tmpObj.gatherIndex = index;
    tmpObj.gathering = 1;
    if (nears.filter(near => near.gathering).length >= 2) {
        tmpObj.aim2();
        selectWeapon(player.weapons[1]);
        antiinsta = "Sync-Anti";
        io.send("6", "sync detect test")
        track.tick.antiSync = true;
        place(0, getAttackDir());
        game.tickBase(() => {
            track.tick.antiSync = false;
        }, 1);
    }
        if (didHit) {
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                // refind
                tmpObj = findPlayerBySID(sid);
                let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                tmpObjects.forEach((healthy) => {
                    healthy.health -= val;
                });
            }, 1);
        }
            if (tmpObj) {
                tmpObj.startAnim(didHit, index);
                if (index < 9) {
                    tmpObj.pR = Math.ceil(items.weapons[index].speed/100) + 1;
                } else if (index > 8) {
                    tmpObj.sR = Math.ceil(items.weapons[index].speed/100) + 1;
                }
                if (tmpObj == player) {
                    if (track.inTrap && (player.weapons[0] != 5 && player.weapons[0] != 8) && player.weapons[1] == 10 && player.skins[40]) {
                        hitCount++;
                    }
                }
            }
            if(near.dist2 <= 190 && !isTeam(tmpObj) && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle){
                    if(tmpObj.weaponIndex == 10 && (tmpObj.skinIndex == 53 || tmpObj.skinIndex == 7) && sid != player.sid){
                        sendChat("rev detect test");
                        antiinsta = "Rev-Anti";
                        antis.reverse = true;
                    } else {
                        antis.reverse = false;
                    }
                }
                if(near.dist2 <= 400 && near.dist2 >= 170 && !isTeam(tmpObj) && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle){
                    if((tmpObj.weaponIndex == 12 || tmpObj.weaponIndex == 13) && (tmpObj.skinIndex == 53 || tmpObj.skinIndex == 7)){
                        sendChat("tick detect test");
                        antiinsta = "Tick-Anti";
                        antis.onetick = true;
                    } else {
                        antis.onetick = false;
                    }
                }
            }
            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.health) {
                        tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
                        objectManager.hitObj.push(tmpObj);
                    }
                }
            }

            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    if (config.anotherVisual) {
                        tmpObj.lastDir = dir;
                    } else {
                        tmpObj.dir = dir;
                    }
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }

            // UPDATE PLAYER VALUE:
function updatePlayerValue(index, value, updateView) {
    if (player) {
        player[index] = value;
        if (index == "points") {
            if (settings.autobuy.enabled) {
                autoBuy.hat();
                autoBuy.acc();
            }
        } else if (index == "kills") {
            if (settings.killsound.enabled) {
                killsoundizi();
            }
        }
    }
        }
function killsoundizi() {
    var audio = new Audio('https://cdn.discordapp.com/attachments/1165479019869913099/1212014608991133716/TF2__Frying_Pan_Hit_Sound_Download.mp3?ex=65f04b90&is=65ddd690&hm=38af07bb42ba1d2bcd27185306552710f9d834afb6b1f746f4d2d1da6a2817ef&');
    audio.play();
}
            let suggestBox = document.createElement("div");
            suggestBox.id = "suggestBox";
            let prevChats = [];
            let prevChatsIndex = 0;
            let cmdprefix = "/";
            let noDir = false;
            let playerd = false;
            let prespike = true;
            let km = false;
            // pro commands
            let commands = {
                prespikesync: {
                    description: "true/false",
                    execute(args) {
                        if (args.length >= 2) {
                            let value = args[1].toLowerCase();
                            if (value === 'true') {
                                prespike = true;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Predictive SpikeTick True.")
                            } else if (value === 'false') {
                                prespike = false;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Predictive SpikeTick False.");
                            } else {
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                            }
                        } else {
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                        }
                    }
                },
                kmtexture: {
                    description: "true/false",
                    execute(args) {
                        if (args.length >= 2) {
                            let value = args[1].toLowerCase();
                            if (value === 'true') {
                                km = true;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "KM Texture True.")
                            } else if (value === 'false') {
                                km = false;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "KM Texture False.");
                            } else {
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                            }
                        } else {
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                        }
                    }
                },
                playerdetect: {
                    description: "true/false",
                    execute(args) {
                        if (args.length >= 2) {
                            let value = args[1].toLowerCase();
                            if (value === 'true') {
                                playerd = true;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Player Detect True.")
                            } else if (value === 'false') {
                                playerd = false;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Player Detect False.");
                            } else {
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                            }
                        } else {
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                        }
                    }
                },
                aedir: {
                    description: "true/false",
                    execute(args) {
                        if (args.length >= 2) {
                            let value = args[1].toLowerCase();
                            if (value === 'true') {
                                noDir = true;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Ae86 Aim True.")
                            } else if (value === 'false') {
                                noDir = false;
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Ae86 Aim False.")
                            } else {
                                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                            }
                        } else {
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Invalid, Use True/False", "#b73de6", 2);
                        }
                    }
                },
            };
            suggestBox.style.display = "none";
            chatHolder.insertBefore(suggestBox, chatHolder.firstChild);
            suggestBox.childNodes.forEach(node => {
                node.addEventListener("click", () => {
                    chatBox.value = "/" + node.id.split("_")[1];
                    commandHandler(chatBox.value);
                });
            });
            chatBox.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    sendChat(chatBox.value);
                }
            });
            function commandHandler(text) {
                let args = text.split(" ");
                args = args.filter(i => i.length > 0);

                args[0] = args[0].slice(cmdprefix.length);

                for (let c in commands) {
                    if (args[0] === c) commands[c].execute(args);
                }
            }
            let chatboxbordersize = "1px";
            chatBox.style.width = "220px";
            document.addEventListener("keydown", e => {
                if (document.activeElement.id.toLowerCase() === 'chatbox') {
                    if (prevChats.length > 0 && [38, 40].includes(event.keyCode)) {
                        chatBox.value = prevChats[prevChatsIndex]
                    }
                    if (event.keyCode == 38) {
                        prevChatsIndex = Math.min(prevChats.length - 1, prevChatsIndex + 1);
                    } else if (event.keyCode == 40) {
                        prevChatsIndex = Math.max(0, prevChatsIndex - 1);
                    }
                    if (![38, 40].includes(event.keyCode)) prevChatsIndex = 0;
                }
                setTimeout(() => {
                    if (chatBox.value && chatBox.value.startsWith(cmdprefix)) {
                        updateSuggestions(chatBox.value);
                        suggestBox.style.display = "block";
                        chatBox.maxLength = 220;
                    } else {
                        suggestBox.style.display = "none";
                        chatBox.maxLength = 220;
                    }
                }, 16)
            });
            function updateSuggestions(userInput) {
                let filteredCommands = Object.keys(commands).filter(cmd => cmd.startsWith(userInput.slice(1)));
                let suggestBoxText = "";
                filteredCommands.forEach(cmd => {
                    suggestBoxText += `<div id="suggest_${cmd}" class="suggestItem">
            <span class="suggestBoxHard">${cmd} </span><span class="suggestBoxLight">${commands[cmd].description}</span>
        </div>`;
                });
                suggestBox.innerHTML = suggestBoxText;
                suggestBox.querySelectorAll('.suggestItem').forEach(item => {
                    item.addEventListener('click', () => {
                        chatBox.value = '/' + item.id.split('_')[1];
                        sendChat(chatBox.value);
                        suggestBox.style.display = 'none';
                    });
                });
            }
            function closeChat() {
                chatBox.value = "";
                chatHolder.style.display = "none";
            }
            // ACTION BAR:
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!InstaKill.isTrue) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else {
                        player.items = data;
                    }
                }
                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    getEl("actionBarItem" + tmpI).style.display = ((getEl("moduleType").value == "ez" ? [0, 3, 6, 15] : player.items).indexOf(items.list[i].id)>=0)?"inline-block":"none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                }
            }
            //updateItems();
            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }

            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            tmpObjects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }

            // SHOW ALLIANCE MENU:
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) {}
            }

            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                }
            }

            function setAlliancePlayers(data) {
                alliancePlayers = data;
            }

            // STORE MENU:
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else {
                        player.latestTail = id;
                    }
                } else {
                    if (!type)
                        player.skins[id] = 1,
                            id == 7 && (track.reSync = true);
                    else {
                        player.latestSkin = id;
                    }
                }
            }
// SEND MESSAGE:
function receiveChat(sid, message) {
    let tmpPlayer = findPlayerBySID(sid);
        if (sid !== player.sid && message == "?dc Atm " + jadinabad) {
            io.send("6", "Disconnecting");
            modLog("```[System]: Disconnected Atm User.```");
            setTimeout(() => {
                window.leave();
            }, 50);
        }
        if (message == "DoSync" && getEl("teamsync").checked) {
            doSync();
            modLog("```[System]: TeamSyncing.```");
        }
    if (tmpPlayer) {
        tmpPlayer.chatMessage = ((text) => {
            return text;
        })(message);
        tmpPlayer.chatCountdown = config.chatCountdown;
    }
    addChatEntry(`[${tmpPlayer.name}]: ${message}`)
}
function doSync() {
    buyEquip(53, 0);
    selectWeapon(player.weapons[1]);
    track.auto.aim = true;
    sendAutoGather();
    setTimeout(() => {
        game.tickBase(() => {
            sendAutoGather();
        }, 1);
        track.auto.aim = false;
    }, 200);
}
            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }
            // SHOW ANIM TEXT:
            function showText(x, y, value, type) {
                if (getEl("dmgtext").checked) {
                    //textManager.showText(player.x2, player.y2, 100, 0.15, 1850, "*", "red", 2);
                    textManager.stack.push({x: x, y: y, value: value});
                }
            }
            /** APPLY SOCKET CODES */
            // BOT:
            let bots = [];
            let ranLocation = {
                x: UTILS.randInt(35, 14365),
                y: UTILS.randInt(35, 14365)
            };
            setInterval(() => {
                ranLocation = {
                    x: UTILS.randInt(35, 14365),
                    y: UTILS.randInt(35, 14365)
                };
            }, 60000);
            class Bot {
                constructor(id, sid, hats, accessories) {
                    this.id = id;
                    this.sid = sid;
                    this.team = null;
                    this.skinIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.iconIndex = 0;
                    this.enemy = [];
                    // this.perfectReplace();
                    this.near = [];
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.tick = 0;
                    this.itemCounts = {};
                    this.latestSkin = 0;
                    this.latestTail = 0;
                    this.points = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.spawn = function (moofoll) {
                        this.upgraded = 0;
                        this.enemy = [];
                        this.near = [];
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.dangerShame = 5;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.nDir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {};
                        this.whyDie = "";
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function () {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function (moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // SET DATA:
                    this.setData = function (data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };


// SHAME SYSTEM:
this.judgeShame = function () {
    if (this.oldHealth < this.health) {
        if (this.hitTime) {
            let timeSinceHit = this.tick - this.hitTime;
            let pingFactor = (Math.max(this.ping, 100) / 100);
            this.shameCount += timeSinceHit * pingFactor;

            this.shameCount = Math.min(this.shameCount, 100);
        } else {
            this.shameCount = Math.max(0, this.shameCount - 2);
        }
    } else if (this.oldHealth > this.health) {
        this.hitTime = this.tick;
    }
    this.oldHealth = this.health;
};


                    this.closeSockets = function(websc) {
                        websc.close();
                    };

                    this.whyDieChat = function(websc, whydie) {
                        websc.sendWS("ch", "XDDD why die " + whydie);
                    };
                }
            };

            class BotObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function (x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.active = true;
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        this.owner = owner;
                        this.id = data.id;
                        this.dmg = data.dmg;
                        this.trap = data.trap;
                        this.teleport = data.teleport;
                        this.isItem = this.id != undefined;
                    };

                }
            };
            class BotObjManager {
                constructor(botObj, fOS) {
                    // DISABLE OBJ:
                    this.disableObj = function (obj) {
                        obj.active = false;
                        if (config.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let tmpObj;
                    this.add = function (sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = fOS(sid);
                        if (!tmpObj) {
                            tmpObj = botObj.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new BotObject(sid);
                                botObj.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };
                    // DISABLE BY SID:
                    this.disableBySid = function (sid) {
                        let find = fOS(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function (sid, server) {
                        botObj.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                }
            };
            function botSpawn(id) {
                let bot;
                if (testMode) {
                    return;
                    bot = id && new WebSocket(``);
                } else {
                    bot = id && new WebSocket(WS.url.split("&")[0] + "&token=" + encodeURIComponent(id));
                }
                let botPlayer = new Map();
                let botSID;
                let botObj = [];
                let nearObj = [];
                let bD = {
                    x: 0,
                    y: 0,
                    inGame: false,
                    closeSocket: false,
                    whyDie: ""
                };
                let oldXY = {
                    x: 0,
                    y: 0,
                };

                let botObjManager = new BotObjManager(botObj, function(sid) { return findSID(botObj, sid); });

                bot.binaryType = "arraybuffer";
                bot.first = true;
                bot.sendWS = function (type) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);

                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    bot.send(binary);
                };
                bot.spawn = function () {
                    bot.sendWS("sp", {
                        name: "0msafricanzulu",
                        moofoll: 1,
                        skin: "__prot0__"
                    });
                };
                bot.sendUpgrade = function(index) {
                    bot.sendWS("6", index);
                };
                bot.place = function(id, a) {
                    try {
                        let item = items.list[botPlayer.items[id]];
                        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                            bot.sendWS("5", botPlayer.items[id]);
                            bot.sendWS("c", 1, a);
                            bot.sendWS("5", botPlayer.weaponIndex, true);
                        }
                    } catch(e) {

                    }
                };
                bot.buye = function(id, index) {
                    let nID = 0;
                    if (botPlayer.alive && botPlayer.inGame) {
                        if (index == 0) {
                            if (botPlayer.skins[id]) {
                                if (botPlayer.latestSkin != id) {
                                    bot.sendWS("13c", 0, id, 0);
                                }
                            } else {
                                let find = findID(hats, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("13c", 1, id, 0);
                                        bot.sendWS("13c", 0, id, 0);
                                    } else {
                                        if (botPlayer.latestSkin != nID) {
                                            bot.sendWS("13c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestSkin != nID) {
                                        bot.sendWS("13c", 0, nID, 0);
                                    }
                                }
                            }
                        } else if (index == 1) {
                            if (botPlayer.tails[id]) {
                                if (botPlayer.latestTail != id) {
                                    bot.sendWS("13c", 0, id, 1);
                                }
                            } else {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("13c", 1, id, 1);
                                        bot.sendWS("13c", 0, id, 1);
                                    } else {
                                        if (botPlayer.latestTail != 0) {
                                            bot.sendWS("13c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestTail != 0) {
                                        bot.sendWS("13c", 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                bot.fastGear = function() {
                    if (botPlayer.y2 >= config.mapScale / 2 - config.riverWidth / 2 && botPlayer.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        bot.buye(31, 0);
                    } else {
                        if (botPlayer.moveDir == undefined) {
                            bot.buye(22, 0);
                        } else {
                            if (botPlayer.y2 <= config.snowBiomeTop) {
                                bot.buye(15, 0);
                            } else {
                                bot.buye(12, 0);
                            }
                        }
                    }
                };
                let heal = function() {
                    let healthBased2 = function() {
                        if (botPlayer.health == 100)
                            return 0;
                        if (botPlayer.skinIndex != 45 && botPlayer.skinIndex != 56) {
                            return Math.ceil((100 - botPlayer.health) / items.list[botPlayer.items[0]].healing);
                        }
                        return 0;
                    };
                    for (let i = 0; i < healthBased2(); i++) {
                        bot.place(0, botPlayer.nDir);
                    }
                };
                bot.onmessage = function (message) {
                    let data = new Uint8Array(message.data);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "io-init") {
                        bot.spawn();
                    }
                    if (type == "1") {
                        botSID = data[0];
                    }
                    if (type == "2") {
                        if (data[1]) {
                            botPlayer = new Bot(data[0][0], data[0][1], hats, accessories);
                            botPlayer.setData(data[0]);
                            botPlayer.inGame = true;
                            botPlayer.alive = true;
                            botPlayer.x2 = undefined;
                            botPlayer.y2 = undefined;
                            botPlayer.spawn(1);
                            oldXY = {
                                x: data[0][3],
                                y: data[0][4]
                            }
                            bD.inGame = true;
                            bot.sendWS("7", 1);
                            if (bot.first) {
                                bot.first = false;
                                bots.push(bD);
                            }
                        }
                    }
                    if (type == "11") {
                        bot.spawn();
                        botPlayer.inGame = false;
                        bD.inGame = false;
                    }
                    if (type == "33") {
                        let tmpData = data[0];
                        botPlayer.tick++;
                        botPlayer.enemy = [];
                        //botPlayer.perfectReplace();
                        botPlayer.near = [];
                        nearObj = [];
                        for (let i = 0; i < tmpData.length;) {
                            if (tmpData[i] == botPlayer.sid) {
                                botPlayer.x2 = tmpData[i + 1];
                                botPlayer.y2 = tmpData[i + 2];
                                botPlayer.d2 = tmpData[i + 3];
                                botPlayer.buildIndex = tmpData[i + 4];
                                botPlayer.weaponIndex = tmpData[i + 5];
                                botPlayer.weaponVariant = tmpData[i + 6];
                                botPlayer.team = tmpData[i + 7];
                                botPlayer.isLeader = tmpData[i + 8];
                                botPlayer.skinIndex = tmpData[i + 9];
                                botPlayer.tailIndex = tmpData[i + 10];
                                botPlayer.iconIndex = tmpData[i + 11];
                                botPlayer.zIndex = tmpData[i + 12];
                                botPlayer.visible = true;
                                bD.x2 = botPlayer.x2;
                                bD.y2 = botPlayer.y2;
                            }
                            i += 13;
                        }
                        if (bD.closeSocket) {
                            botPlayer.closeSockets(bot);
                        }
                        if (bD.whyDie != "") {
                            botPlayer.whyDieChat(bot, bD.whyDie);
                            bD.whyDie = "";
                        }
                        if (botPlayer.alive) {
                            if (player.team) {
                                if (botPlayer.team != player.team && (botPlayer.tick % 9 === 0)) {
                                    botPlayer.team && (bot.sendWS("9"));
                                    bot.sendWS("10", player.team);
                                }
                            }
                            if (botPlayer.inGame) {
                                if (botObj.length > 0) {
                                    if (breakObjects.length > 0) {
                                        let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                        let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);
                                            if ((gotoDist - isPassed) > 0) {
                                                if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap || nearObj.teleport)) {
                                                    if (botPlayer.moveDir != undefined) {
                                                        botPlayer.moveDir = undefined;
                                                        bot.sendWS("33", botPlayer.moveDir);
                                                    }
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("33", botPlayer.moveDir);
                                                }
                                                if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                    botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                    bot.sendWS("2", botPlayer.nDir);
                                                }
                                                bot.buye(40, 0);
                                                bot.buye(11, 1);
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("33", botPlayer.moveDir);
                                                bot.fastGear();
                                                bot.buye(11, 1);
                                            }
                                        } else {
                                            botPlayer.moveDir = gotoAim;
                                            bot.sendWS("33", botPlayer.moveDir);
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                        if (gotoDist > 300) {
                                            if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 90) {
                                                let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                                                bot.place(3, aim + (Math.PI / 2.3));
                                                bot.place(3, aim - (Math.PI / 2.3));
                                                bot.place(3, aim);
                                                oldXY = {
                                                    x: botPlayer.x2,
                                                    y: botPlayer.y2
                                                };
                                            }
                                        }
                                    } else {
                                        if (botPlayer.moveDir != undefined) {
                                            botPlayer.moveDir = undefined;
                                            bot.sendWS("33", botPlayer.moveDir);
                                        }
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                bot.sendWS("2", botPlayer.nDir);
                                            }
                                            bot.buye(40, 0);
                                            bot.buye(11, 1);
                                        } else {
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.moveDir != undefined) {
                                        botPlayer.moveDir = undefined;
                                        bot.sendWS("33", botPlayer.moveDir);
                                    }
                                }
                            }
                        }
                    }
                    if (type == "6") {
                        let tmpData = data[0];
                        for (let i = 0; i < tmpData.length;) {
                            botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4],
                                              tmpData[i + 5], items.list[tmpData[i + 6]], true, (tmpData[i + 7] >= 0 ? {
                                sid: tmpData[i + 7]
                            } : null));
                            i += 8;
                        }
                    }
                    if (type == "9") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer[index] = value;
                        }
                    }
                    if (type == "h") {
                        if (data[0] == botSID) {
                            botPlayer.oldHealth = botPlayer.health;
                            botPlayer.health = data[1];
                            botPlayer.judgeShame();
                            if (botPlayer.oldHealth > botPlayer.health) {
                                if (botPlayer.shameCount < 5) {
                                    heal();
                                } else {
                                    setTimeout(() => {
                                        heal();
                                    }, 70);
                                }
                            }
                        }
                    }
                    if (type == "12") {
                        let sid = data[0];
                        botObjManager.disableBySid(sid);
                    }
                    if (type == "13") {
                        let sid = data[0];
                        if (botPlayer.alive) botObjManager.removeAllItems(sid);
                    }
                    if (type == "14") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer.itemCounts[index] = value;
                        }
                    }
                    if (type == "16") {
                        if (data[0] > 0) {
                            if (botPlayer.upgraded == 0) {
                                bot.sendUpgrade(3);
                            } else if (botPlayer.upgraded == 1) {
                                bot.sendUpgrade(17);
                            } else if (botPlayer.upgraded == 2) {
                                bot.sendUpgrade(31);
                            } else if (botPlayer.upgraded == 3) {
                                bot.sendUpgrade(27);
                            } else if (botPlayer.upgraded == 4) {
                                bot.sendUpgrade(9);
                            } else if (botPlayer.upgraded == 5) {
                                bot.sendUpgrade(38);
                            } else if (botPlayer.upgraded == 6) {
                                bot.sendUpgrade(4);
                            } else if (botPlayer.upgraded == 7) {
                                bot.sendUpgrade(25);
                            }
                            botPlayer.upgraded++;
                        }
                    }
                    if (type == "17") {
                        let tmpData = data[0];
                        let wpn = data[1];
                        if (tmpData) {
                            if (wpn) botPlayer.weapons = tmpData;
                            else botPlayer.items = tmpData;
                        }
                        bot.sendWS("5", botPlayer.weapons[0], true);
                    }
                    if (type == "us") {
                        let type = data[0];
                        let id = data[1];
                        let index = data[2];
                        if (index) {
                            if (!type)
                                botPlayer.tails[id] = 1;
                            else
                                botPlayer.latestTail = id;
                        } else {
                            if (!type)
                                botPlayer.skins[id] = 1;
                            else
                                botPlayer.latestSkin = id;
                        }
                    }
                };
                bot.onclose = function() {
                    botPlayer.inGame = false;
                    bD.inGame = false;
                };
            }

            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                let endX = x + (l * Math.cos(r));
                let endY = y + (l * Math.sin(r));
                let width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }

            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }

            function renderHealthStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }

            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (let i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }

            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                let tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (let i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }

            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }
            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
// RENDER DEAD PLAYERS:
function renderDeadPlayers(xOffset, yOffset) {
    mainContext.fillStyle = "#ffff";
    const deathMessages = [
        "Got Destroyed", "Has Drowned", "Fell to Their Demise", "Lost the Battle", "Met Their End",
        "Got Raped", "Got Touched", "Got Fucked", "Was Annihilated", "Disappeared Into Oblivion",
        "Vanished Without a Trace", "Was Erased From Existence", "Became a Memory", "Was Wiped Out",
        "Was Eliminated", "Succumbed to Darkness", "Faced the Reaper", "Met Their Doom", "Ceased to Exist",
        "Perished in Flames", "Was Obliterated", "Was Swallowed by the Void", "Crumbled to Dust", "Sank into Oblivion",
        "Faded into Nothingness", "Disintegrated into Ashes", "Was Snuffed Out", "Fell to the Abyss", "Dissolved into Ether",
        "Was Crushed by Fate", "Succumbed to Chaos", "Faced the End", "Sank into Despair", "Was Consumed by Shadows",
        "Was Smothered by Darkness", "Was Enveloped by Death", "Faded Away", "Was Eradicated", "Disappeared Without a Trace",
        "Was Dissolved into Nothing", "Was Shattered into Pieces", "Was Engulfed by the Void", "Was Silenced Forever",
        "Was Extinguished", "Was Vanquished", "Was Vaporized", "Was Eradicated", "Was Exterminated",
        "Was Devoured by the Unknown", "Was Sucked into the Abyss", "Was Annihilated by Chaos", "Was Lost in the Void"
    ];
    deadPlayers.filter(dead => dead.active).forEach((dead) => {
        dead.animate(delta);
        mainContext.globalAlpha = dead.alpha;
        mainContext.strokeStyle = "black";
        mainContext.save();
        mainContext.translate(dead.x - xOffset, dead.y - yOffset);
        // RENDER SKULL:
        mainContext.strokeStyle = "red";
        mainContext.font = "80px sans-serif";
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        mainContext.lineWidth = 3;
        mainContext.strokeText("☠", 0, dead.scale * 2 - 20);
        mainContext.fillText("☠", 0, dead.scale * 2 - 20);
        mainContext.font = "25px Hammersmith One";
        mainContext.fillStyle = "red";
        mainContext.lineWidth = 1.5;
        mainContext.strokeText(dead.name, 0, dead.scale * 2 + 20);
        mainContext.fillText(dead.name, 0, dead.scale * 2 + 20);
        mainContext.font = "25px Hammersmith One";
        mainContext.fillStyle = "#fff";
        if (!dead.deathMessage) {
            dead.deathMessage = deathchatizi();
        }
        mainContext.strokeStyle = "black";
        mainContext.lineWidth = 1.5;
        mainContext.strokeText(dead.deathMessage, 0, dead.scale * 2 + 50);
        mainContext.fillText(dead.deathMessage, 0, dead.scale * 2 + 50);
        mainContext.restore();
    });
}
function deathchatizi() {
    const deathMessages = [
        "Got Destroyed", "Has Drowned", "Fell to Their Demise", "Lost the Battle", "Met Their End",
        "Got Raped", "Got Touched", "Got Fucked", "Was Annihilated", "Disappeared Into Oblivion",
        "Vanished Without a Trace", "Was Erased From Existence", "Became a Memory", "Was Wiped Out",
        "Was Eliminated", "Succumbed to Darkness", "Faced the Reaper", "Met Their Doom", "Ceased to Exist",
        "Perished in Flames", "Was Obliterated", "Was Swallowed by the Void", "Crumbled to Dust", "Sank into Oblivion",
        "Faded into Nothingness", "Disintegrated into Ashes", "Was Snuffed Out", "Fell to the Abyss", "Dissolved into Ether",
        "Was Crushed by Fate", "Succumbed to Chaos", "Faced the End", "Sank into Despair", "Was Consumed by Shadows",
        "Was Smothered by Darkness", "Was Enveloped by Death", "Faded Away", "Was Eradicated", "Disappeared Without a Trace",
        "Was Dissolved into Nothing", "Was Shattered into Pieces", "Was Engulfed by the Void", "Was Silenced Forever",
        "Was Extinguished", "Was Vanquished", "Was Vaporized", "Was Eradicated", "Was Exterminated",
        "Was Devoured by the Unknown", "Was Sucked into the Abyss", "Was Annihilated by Chaos", "Was Lost in the Void"
    ];
    return deathMessages[Math.floor(Math.random() * deathMessages.length)];
}
// RENDER PLAYERS:
function renderPlayers(xOffset, yOffset, zIndex) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#91b2db";
    for (var i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.zIndex == zIndex) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += (0.002 * delta);
                tmpDir = (tmpObj == player && !ae && !noDir) ? getSafeDir() ? getVisualDir() : (tmpObj.dir || 0) : (tmpObj.dir || 0);
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                // RENDER PLAYER:
                mainContext.rotate(tmpDir + tmpObj.dirPlus);
                /*if (track.inTrap && tmpObj == player && getEl("invisab").checked) {
                    mainContext.restore();
                    continue;
                }*/
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
            }
        }
    }
}

            // RENDER DEAD PLAYER:
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);
                ctxt.lineWidth = 2;
                ctxt.fillStyle = "#555";
                ctxt.font = "35px Hammersmith One";
                ctxt.textBaseline = "middle";
                ctxt.textAlign = "center";
                ctxt.fillText("(", 20, 5);
                ctxt.rotate(Math.PI / 2);
                ctxt.font = "30px Hammersmith One";
                ctxt.fillText("X", -15, 15/2);
                ctxt.fillText("X", 15, 15/2);

            }

            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;
                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15 && km);
                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                        items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI/2);
                    renderTextureSkin(obj.skinIndex, ctxt, null, obj);
                }
            }
            // RENDER SKIN:
            function renderTextureSkin(index, ctxt, parentSkin, owner) {
                if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true,
                            this.onload = null
                    },
                        tmpImage.src = setSkinTextureImage(index, "hat", index),
                        skinSprites[index + (txt ? "lol" : 0)] = tmpImage,
                        tmpSkin = tmpImage
                }
                var tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }
            var FlareZHat = {
                7: "https://i.imgur.com/vAOzlyY.png",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                11: "https://i.imgur.com/yfqME8H.png",
                12: "https://i.imgur.com/VSUId2s.png",
                40: "https://i.imgur.com/Xzmg27N.png",
                26: "https://i.imgur.com/I0xGtyZ.png",
                6: "https://i.imgur.com/vM9Ri8g.png",
            };
            function setSkinTextureImage(id, type, id2) {
                if (true) {
                    if(FlareZHat[id] && type == "hat") {
                        return FlareZHat[id];
                    } else {
                        if(type == "acc") {
                            return ".././img/accessories/access_" + id + ".png";
                        } else if(type == "hat") {
                            return ".././img/hats/hat_" + id + ".png";
                        } else {
                            return ".././img/weapons/" + id + ".png";
                        }
                    }
                } else {
                    if(type == "acc") {
                        return ".././img/accessories/access_" + id + ".png";
                    } else if(type == "hat") {
                        return ".././img/hats/hat_" + id + ".png";
                    } else {
                        return ".././img/weapons/" + id + ".png";
                    }
                }
            }

            // RENDER SKINS:
            let skinSprites = {};
            let skinPointers = {};
            let tmpSkin;
            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }

            // RENDER TAIL:
            let accessSprites = {};
            let accessPointers = {};
            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin)
                    ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }

            // RENDER TOOL:
            let toolSprites = {};
            function renderTool(obj, variant, x, y, ctxt) {
                let tmpSrc = obj.src + (variant || "");
                let tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = getTexturePackImg(tmpSrc, "weapons");
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
            }

            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for(let i = 0; i < projectiles.length; i++) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                };
            }

            // RENDER PROJECTILE:
            let projectileSprites = {};
            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    let tmpSrc = items.projectiles[obj.indx].src;
                    let tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }

            // RENDER AI:
            let aiSprites = {};
            function renderAI(obj, ctxt) {
                let tmpIndx = obj.index;
                let tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    let tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }

            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }
// RENDER GAME OBJECTS:
let gameObjectSprites = {};
function getResSprite(obj) {
    let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
    let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
    let tmpSprite = gameObjectSprites[tmpIndex];
    if (!tmpSprite) {
        let blurScale = 15;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
        let tmpContext = tmpCanvas.getContext('2d');
        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
        tmpContext.rotate(UTILS.randFloat(0, Math.PI));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        if (obj.type == 0) {
            let tmpScale;
            let tmpCount = UTILS.randInt(5, 7);
            tmpContext.globalAlpha = isNight ? 0.6 : 0.8;
            for (let i = 0; i < 2; ++i) {
                tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                    tmpContext.shadowBlur = null;
                    tmpContext.shadowColor = null;
                    tmpContext.globalAlpha = 1;
                }
            }
        } else if (obj.type == 1) {
            if (biomeID == 2) {
                tmpContext.fillStyle = "#606060";
                renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#89a54c";
                renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                tmpContext.fillStyle = "#a5c65b";
                renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
            } else {
                renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                let tmpRange;
                let berries = 4;
                let rotVal = (Math.PI * 2) / berries;
                for (let i = 0; i < berries; ++i) {
                    tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                        UTILS.randInt(10, 12), tmpContext);
                }
            }
        } else if (obj.type == 2 || obj.type == 3) {
            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.shadowBlur = null;
            tmpContext.shadowColor = null;
            tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        gameObjectSprites[tmpIndex] = tmpSprite;
    }
    return tmpSprite;
}

                            // GET ITEM SPRITE:
                            let itemSprites = [];
                            function getItemSprite(obj, asIcon) {
                                let e = obj;
                                let R = player;
                                let clr = R && e.owner && (e.owner.sid).constructor == Number && e.owner.sid != R.sid,
                                    use = !ae && false && true,
                                    ID = e.id + (!use && clr ? 50 : 0);
                                let tmpSprite = itemSprites[ID];
                                if (!tmpSprite || asIcon) {
                                    let blurScale = 15;
                                    let tmpCanvas = document.createElement("canvas");
                                    // let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                                    let tmpContext = tmpCanvas.getContext("2d");
                                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                                    tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
                                    tmpContext.strokeStyle = outlineColor;
                                    tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
                                    if (obj.name == "apple") {
                                        tmpContext.fillStyle = "#c15555";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fillStyle = "#89a54c";
                                        let leafDir = -(Math.PI / 2);
                                        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                                   25, leafDir + Math.PI / 2, tmpContext);
                                    } else if (obj.name == "cookie") {
                                        tmpContext.fillStyle = "#cca861";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fillStyle = "#937c4b";
                                        let chips = 4;
                                        let rotVal = (Math.PI * 2) / chips;
                                        let tmpRange;
                                        for (let i = 0; i < chips; ++i) {
                                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                                         UTILS.randInt(4, 5), tmpContext, true);
                                        }
                                    } else if (obj.name == "cheese") {
                                        tmpContext.fillStyle = "#f4f3ac";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fillStyle = "#c3c28b";
                                        let chips = 4;
                                        let rotVal = (Math.PI * 2) / chips;
                                        let tmpRange;
                                        for (let i = 0; i < chips; ++i) {
                                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                                         UTILS.randInt(4, 5), tmpContext, true);
                                        }
                                    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                                        tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                                            "#a5974c" : "#939393";
                                        let sides = (obj.name == "castle wall") ? 4 : 3;
                                        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                                            "#c9b758" : "#bcbcbc";
                                        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                                        tmpContext.fill();
                                    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                                               obj.name == "spinning spikes") {
                                        tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                                        let tmpScale = (obj.scale * 0.6);
                                        renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#a5974c";
                                        renderCircle(0, 0, tmpScale, tmpContext);
                                        tmpContext.fillStyle = "#c9b758";
                                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                                    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                                        tmpContext.fillStyle = "#a5974c",
                                            renderCircle(0, 0, obj.scale, tmpContext),
                                            tmpContext.fillStyle = "#c9b758",
                                            renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext),
                                            tmpContext.fillStyle = "#a5974c",
                                            renderCircle(0, 0, obj.scale * .5, tmpContext);
                                    } else if (obj.name == "mine") {
                                        tmpContext.fillStyle = "#939393";
                                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#bcbcbc";
                                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                                        tmpContext.fill();
                                    } else if (obj.name == "sapling") {
                                        for (let i = 0; i < 2; ++i) {
                                            let tmpScale = obj.scale * (!i ? 1 : 0.5);
                                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                                            tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                                            tmpContext.fill();
                                            if (!i) tmpContext.stroke();
                                        }
                                    } else if (obj.name == "pit trap") {
                                        tmpContext.fillStyle = "#a5974c";
                                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = outlineColor;
                                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                                        tmpContext.fill();
                                    } else if (obj.name == "boost pad") {
                                        tmpContext.fillStyle = "#7e7f82";
                                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#dbd97d";
                                        renderTriangle(obj.scale * 1, tmpContext);
                                    } else if (obj.name == "turret") {
                                        tmpContext.fillStyle = "#a5974c";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#939393";
                                        let tmpLen = 50;
                                        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                    } else if (obj.name == "platform") {
                                        tmpContext.fillStyle = "#cebd5f";
                                        let tmpCount = 4;
                                        let tmpS = obj.scale * 2;
                                        let tmpW = tmpS / tmpCount;
                                        let tmpX = -(obj.scale / 2);
                                        for (let i = 0; i < tmpCount; ++i) {
                                            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                                            tmpContext.fill();
                                            tmpContext.stroke();
                                            tmpX += tmpS / tmpCount;
                                        }
                                    } else if (obj.name == "healing pad") {
                                        tmpContext.fillStyle = "#7e7f82";
                                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#db6e6e";
                                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                                    } else if (obj.name == "spawn pad") {
                                        tmpContext.fillStyle = "#7e7f82";
                                        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.fillStyle = "#71aad6";
                                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                                    } else if (obj.name == "blocker") {
                                        tmpContext.fillStyle = "#7e7f82";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.rotate(Math.PI / 4);
                                        tmpContext.fillStyle = "#db6e6e";
                                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                                    } else if (obj.name == "teleporter") {
                                        tmpContext.fillStyle = "#7e7f82";
                                        renderCircle(0, 0, obj.scale, tmpContext);
                                        tmpContext.fill();
                                        tmpContext.stroke();
                                        tmpContext.rotate(Math.PI / 4);
                                        tmpContext.fillStyle = "#d76edb";
                                        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                                    }
                                    tmpSprite = tmpCanvas;
                                    if (!asIcon) itemSprites[ID] = tmpSprite;
                                }
                                return tmpSprite;
                            }
            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = mainContext;
                let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                tmpContext.strokeStyle = outlineColor;
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    let leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI / 2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                        "#a5974c" : "#939393";
                    let sides = (obj.name == "castle wall") ? 4 : 3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                        "#c9b758" : "#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                           obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                    let tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale * 0.5, tmpContext);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (let i = 0; i < 2; ++i) {
                        let tmpScale = obj.scale * (!i ? 1 : 0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpContext.restore();
            }
            let objSprites = [];
function getObjSprite(obj) {
    let tmpSprite = objSprites[obj.id];
    if (!tmpSprite) {
        let blurScale = isNight ? 20 : 0;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = 5.5;
        if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
            if (syrup) {
                tmpContext.fillStyle = (obj.name == "poison spikes" && syrup) ? "#7b935d" : "#939393";
                let image = new Image();
                let imgUrl = 'https://media.discordapp.net/attachments/1207653082436206592/1221660687265304626/Spikegreatersss.png?ex=6613632d&is=6600ee2d&hm=1c82b8a869826cf0c04efdf4fdcc67763d18314ad595bca6d1f85038f706c5aa&=&format=webp&quality=lossless&width=701&height=701';
                image.src = imgUrl;
                image.onload = function() {
                    let tmpScale = obj.scale * 1;
                    tmpContext.drawImage(image, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                };
                image.onerror = function() {
                    console.error("Failed to load the image");
                };
            } else {
                let tmpScale = obj.scale * 0.6;
                renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#a5974c";
                renderCircle(0, 0, tmpScale, tmpContext);
                tmpContext.fillStyle = "#8d2020"; // #cc5151
                renderCircle(0, 0, tmpScale / 2, tmpContext, true);
            }
        } else if (obj.name == "pit trap") {
            if (syrup) {
                let image = new Image();
                let imgUrl = 'https://cdn.discordapp.com/attachments/510253926105219095/1221610367789170880/Pit_Trap700ee.png?ex=66133450&is=6600bf50&hm=1479b2d2ecaab9ffc00981b8cff37e2a04f91eb14dee03587e48ceff1bbfc7f4&'; // Your provided URL
                image.src = imgUrl;
                image.onload = function() {
                    console.log("Image loaded successfully");
                    let tmpScale = obj.scale * 1;
                    tmpContext.drawImage(image, -tmpScale, -tmpScale, tmpScale * 2.3, tmpScale * 2.3);
                };
                image.onerror = function() {
                    console.error("Failed to load the image");
                };
            } else {
                tmpContext.fillStyle = "#a5974c";
                renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#8d2020";
                renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                tmpContext.fill();
            }
        }
        tmpSprite = tmpCanvas;
        objSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}
// GET MARK SPRITE:
function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
    let center = {
        x: screenWidth / 2,
        y: screenHeight / 2,
    };
    tmpContext.lineWidth = outlineWidth;
    mainContext.globalAlpha = 0.4;
    tmpContext.strokeStyle = outlineColor;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(obj.dir || getAttackDir());
    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
        var tmpScale = (obj.scale * 0.6);
        renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = "#c9b758";
        }
        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext);
    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
            tmpContext.fillStyle = "#a34040";
        } else {
            tmpContext.fillStyle = outlineColor;
        }
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    }
    tmpContext.restore();
}
            //renderCircle(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.getScale(0.6, true), mainContext, false, true);

            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
        function isTeam(tmpObj) {
            return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
        }
            // RENDER GAME OBJECTS:
            function renderGameObjects(layer, xOffset, yOffset) {
                let tmpSprite;
                let tmpX;
                let tmpY;
                gameObjects.forEach((tmp) => {
                    tmpObj = tmp;
                    if (tmpObj.alive || tmpObj.alpha > 0) {
                        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                        if (layer == 0) {
                            tmpObj.update(delta);
                        }
                        mainContext.globalAlpha = tmpObj.alpha;
                        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                            if (tmpObj.isItem) {
                                if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                    tmpSprite = getObjSprite(tmpObj);
                                } else {
                                    tmpSprite = getItemSprite(tmpObj);
                                }
                                mainContext.save();
                                mainContext.translate(tmpX, tmpY);
                                if (tmpObj.name == "spinning spikes") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 5260);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                if (!tmpObj.active) {
                                    mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                }
                                if (!tmpObj.active) {
                                    mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                }
                                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                                if (tmpObj.blocker) {
                                    mainContext.strokeStyle = "#db6e6e";
                                    mainContext.globalAlpha = 0.3;
                                    mainContext.lineWidth = 6;
                                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                }
                                mainContext.restore();
                            } else {
                                tmpSprite = getResSprite(tmpObj);
                                mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                            }
                        }
            if (!tmpObj.alive && tmpObj.alpha > 0) {
                tmpObj.alpha -= 0.01;
            }
                        if (layer === 3 && settings.buildhp.enabled) {
                            if (tmpObj.health < tmpObj.maxHealth) {
                                mainContext.beginPath();
                                mainContext.strokeStyle = darkOutlineColor;
                                mainContext.lineWidth = 3;
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2 + config.healthBarPad + mainContext.lineWidth / 2, 0, 2 * Math.PI);
                                mainContext.stroke();
                                // HEALTH BAR:
                                mainContext.beginPath();
                                mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                mainContext.lineWidth = 6;
                                const currentAngle = 2 * Math.PI * (tmpObj.health / tmpObj.maxHealth);
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2, 0, currentAngle);
                                mainContext.stroke();
                            }
                        }
                    }
                });
                // PLACE VISIBLE:
                if (layer == 0) {
                    if (placeVisible.length) {
                        placeVisible.forEach((places) => {
                            tmpX = places.x - xOffset;
                            tmpY = places.y - yOffset;
                            markObject(places, tmpX, tmpY);
                        });
                    }
                }
            }
/*function renderGameObjects(layer, xOffset, yOffset) {
    let tmpSprite;
    let tmpX;
    let tmpY;
    gameObjects.forEach((tmp) => {
        tmpObj = tmp;
        if (tmpObj.alive || tmpObj.alpha > 0) {
            tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
            if (layer == 0) {
                tmpObj.update(delta);
            }
            if (cdf(tmpObj, player) <= 205 && tmpObj.type == 0) {
                mainContext.beginPath();
                mainContext.strokeStyle = darkOutlineColor;
                mainContext.fillStyle = darkOutlineColor;
                mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, 80, 0, 2 * Math.PI);
                mainContext.stroke();
                mainContext.globalAlpha = 1;
                mainContext.fill();
                mainContext.closePath();
            }
            mainContext.globalAlpha = tmpObj.alpha;
            if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                if (tmpObj.isItem) {
                    if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                        tmpSprite = getObjSprite(tmpObj);
                    } else {
                        tmpSprite = getItemSprite(tmpObj);
                    }
                    mainContext.save();
                    mainContext.translate(tmpX, tmpY);
                                if (tmpObj.name == "windmill" || tmpObj.name == "faster windmill" || tmpObj.name == "power mill" || tmpObj.name == "spinning spikes") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 5260);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                if (!tmpObj.active) {
                                    mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                }
                    if (!tmpObj.active) {
                        mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                    }
                    mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                    if (tmpObj.blocker) {
                        mainContext.strokeStyle = "#db6e6e";
                        mainContext.globalAlpha = 0.3;
                        mainContext.lineWidth = 6;
                        renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                    }
                    mainContext.restore();
                } else {
                  renderResTest(tmpObj, tmpX, tmpY)
                }
            }
            if (!tmpObj.alive && tmpObj.alpha > 0) {
                tmpObj.alpha -= 0.01;
            }

                        if (layer === 3 && getEl("buildhp").checked) {
                            if (tmpObj.health < tmpObj.maxHealth) {
                                mainContext.beginPath();
                                mainContext.strokeStyle = darkOutlineColor;
                                mainContext.lineWidth = 3;
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2 + config.healthBarPad + mainContext.lineWidth / 2, 0, 2 * Math.PI);
                                mainContext.stroke();
                                // HEALTH BAR:
                                mainContext.beginPath();
                                mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                mainContext.lineWidth = 6;
                                const currentAngle = 2 * Math.PI * (tmpObj.health / tmpObj.maxHealth);
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2, 0, currentAngle);
                                mainContext.stroke();
                            }
                        }
                        mainContext.restore();
                        // PLACE VISIBLE:
                        if (layer == 0) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
                });
            }
let treeAlphaState = [];
function renderResTest(y, n, r, offsets) {
    let s = getResSprite(y);
    let easeScale = 0.06,
        lowestAlpha = 0.2;
    if (player && y.type === 0) {
        if (!treeAlphaState[y.sid]) treeAlphaState[y.sid] = 1;
        let distanceToPlayer = Math.sqrt((y.y - player.y2) ** 2 + (y.x - player.x2) ** 2);
        if (distanceToPlayer <= y.scale + player.scale) {
            treeAlphaState[y.sid] = Math.max(lowestAlpha, (treeAlphaState[y.sid] - easeScale));
        } else {
            treeAlphaState[y.sid] = Math.min(1, (treeAlphaState[y.sid] + easeScale));
        }
        mainContext.globalAlpha = treeAlphaState[y.sid];
    } else {
        mainContext.globalAlpha = 1;
    }
    mainContext.drawImage(s, n - s.width / 2, r - s.height / 2);
}*/
            function markObject(tmpObj, tmpX, tmpY) {
                getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
                //yen(mainContext, tmpX, tmpY);
            }
function yen(context, x, y) {
    context.fillStyle = "#e30005";
    context.strokeStyle = "#832a2e";
    context.beginPath();
    context.globalAlpha = 0.25;
    context.arc(x, y, 50, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.55;
    context.arc(x, y, 50, 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = 1;
    context.closePath();
}
// RENDER MINIMAP:
class MapPing {
    constructor(color, scale) {
        this.init = function (x, y) {
            this.scale = 0;
            this.x = x;
            this.y = y;
            this.active = true;
        };
        this.update = function (ctxt, delta) {
            if (this.active) {
                this.scale += 0.05 * delta;
                if (this.scale >= scale) {
                    this.active = false;
                } else {
                    ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                    ctxt.beginPath();
                    ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                             * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                    ctxt.stroke();
                }
            }
        };
        this.color = color;
    }
}
function pingMap(x, y) {
    tmpPing = mapPings.find(pings => !pings.active);
    if (!tmpPing) {
        tmpPing = new MapPing("#fff", config.mapPingScale);
        mapPings.push(tmpPing);
    }
    tmpPing.init(x, y);
}
function updateMapMarker() {
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}
function renderMinimap(delta) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
        // RENDER PINGS:
        mapContext.lineWidth = 4;
        for (let i = 0; i < mapPings.length; ++i) {
            tmpPing = mapPings[i];
            mapContext.strokeStyle = tmpPing.color;
            tmpPing.update(mapContext, delta);
        }
/*mapDisplay.style.position = "absolute";
mapDisplay.style.bottom = "15px";
mapDisplay.style.left = "90%";*/
                // OBJ MARKER:
                let showBuilds = true;
                let loadObjects = [];
                if (showBuilds) {
                    for (let i = 0; i < loadObjects.length; i++) {
                        let tmpObj = loadObjects[i];
                        if (tmpObj.ueheua != 0) {
                            if (items.list[tmpObj[6]]) {
                                mapContext.fillStyle = items.list[tmpObj[6]].dmg ? "#a5974c" : items.list[tmpObj[6]].trap ? darkOutlineColor : items.list[tmpObj[6]].teleport && "#d76edb";
                                renderCircle((tmpObj[1]/config.mapScale)*mapDisplay.width,
                                             (tmpObj[2]/config.mapScale)*mapDisplay.height, items.list[tmpObj[6]].scale/10, mapContext, true);
                            }
                        }
                    }
                }
                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x/config.mapScale)*mapDisplay.width,
                                 (player.y/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i]/config.mapScale)*mapDisplay.width,
                                         (minimapData[i+1]/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                            i+=2;
                        }
                    }
                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#cc5151";
                                renderCircle((tmp.x2 / config.mapScale) * mapDisplay.width,
                                             (tmp.y2 / config.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }
                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x/config.mapScale)*mapDisplay.width,
                                            (lastDeath.y/config.mapScale)*mapDisplay.height);
                    }
                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x/config.mapScale)*mapDisplay.width,
                                            (mapMarker.y/config.mapScale)*mapDisplay.height);
                    }
                }
            }
            // ICONS:
            let crossHairs = [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1024px-Crosshairs_Red.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1024px-Crosshairs_Red.svg.png" // https://media.discordapp.net/attachments/1204579824190890036/1215749681813000253/image_2024-03-08_145454224-removebg-preview.png?ex=65fde21f&is=65eb6d1f&hm=05d452595878eecbb1dfefb660186f3e3a6337f554064f1b39b5b59e7b308d58&=&format=webp&quality=lossless&width=633&height=610
            ];
            let crossHairSprites = {};
            let iconSprites = {
                crown: new Image(),
                skull: new Image(),
                trust: new Image()
            };
            function loadIcons() {
                iconSprites.crown.onload = function () {
                    this.isLoaded = true;
                };
                iconSprites.crown.src = "./../img/icons/crown.png"; // https://cdn-icons-png.flaticon.com/512/5556/5556657.png
                iconSprites.skull.onload = function () {
                    this.isLoaded = true;
                };
                iconSprites.skull.src = "./../img/icons/skull.png";
                iconSprites.trust.onload = function () {
                    this.isLoaded = true;
                };
                iconSprites.trust.src = "https://media.discordapp.net/attachments/904703116404998196/921671387716931625/trust-icon-png-17.jpg?width=494&height=494";
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function () {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();
            // UPDATE GAME:
            function updateGame() {
                // DEATH TEXT:
                if (deathTextScale < 120) {
                    deathTextScale += 0.1 * delta;
                    diedText.style.fontSize = Math.min(Math.round(deathTextScale), 120) + "px";
                }
                if (config.resetRender) {
                    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    mainContext.beginPath();
                }
                if (true) {
       for (let i = 0; i < objectPredict.length; i++) {
            let _ = objectPredict[i];
            if (_) {
                mainContext.save();
                mainContext.translate(_.x - yOffset, _.y - xOffset);
                let trapObject = items.list[15];
                let image = getMarkSprite({ name: trapObject.name, id: trapObject.id, scale: trapObject.scale, prediction: true });
                mainContext.globalAlpha = .6;
                mainContext.drawImage(image, -(image.width / 2), -(image.height / 2));
                mainContext.restore();
            }
        }
let originalScales = {
    width: 1920,
    height: 1080
}
// MOVE CAMERA:
if (player) {
    let targetScreenWidth, targetScreenHeight;
    let smoothness = 0.05;
    if (ez) {
        let px = player.x;
        let py = player.y;
        if (near.dist2 <= 1000 && inGame) {
            targetScreenWidth = originalScales.width;
            targetScreenHeight = originalScales.height;
        } else {
            targetScreenWidth = originalScales.width * 1.4;
            targetScreenHeight = originalScales.height * 1.4;
        }
        maxScreenWidth += (targetScreenWidth - maxScreenWidth) * smoothness;
        maxScreenHeight += (targetScreenHeight - maxScreenHeight) * smoothness;
        camX = (camX * 24 + px) / 25;
        camY = (camY * 24 + py) / 25;
        resize();
    } else {
        maxScreenWidth = originalScales.width;
        maxScreenHeight = originalScales.height;
        resize();
        let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
        let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
        let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
        if (tmpDist > 0.10) {
            camX += camSpd * Math.cos(tmpDir);
            camY += camSpd * Math.sin(tmpDir);
        } else {
            camX = player.x;
            camY = player.y;
        }
    }
} else {
    camX = config.mapScale / 2;
    camY = config.mapScale / 2;
}
resize();
if (player) {
    if (still) {
        camX = player.x;
        camY = player.y;
    } else {
        let px = player.x;
        let py = player.y;
         if (smooth) {
            let tmpDist = UTILS.getDistance(camX, camY, px, py);
            let tmpDir = UTILS.getDirection(px, py, camX, camY);
            let camSpd = Math.min(tmpDist * 0.0009 * delta, tmpDist);
            if (tmpDist > 0.05) {
                camX += camSpd * Math.cos(tmpDir);
                camY += camSpd * Math.sin(tmpDir);
            } else {
                camX = px;
                camY = py;
            }
        } else if (normal) {
            if (false) {
                camX = px;
                camY = py;
            } else {
                let tmpDist = UTILS.getDistance(camX, camY, px, py);
                let tmpDir = UTILS.getDirection(px, py, camX, camY);
                let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                if (tmpDist > 0.05) {
                    camX += camSpd * Math.cos(tmpDir);
                    camY += camSpd * Math.sin(tmpDir);
                } else {
                    camX = px;
                    camY = py;
                }
            }
        }
    }
} else {
    camX = config.mapScale / 2 + config.riverWidth;
    camY = config.mapScale / 2;
}
                    // INTERPOLATE PLAYERS AND AI:
                    let lastTime = now - (1000 / config.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                let total = tmpObj.t2 - tmpObj.t1;
                                let fraction = lastTime - tmpObj.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                tmpObj.dt += delta;
                                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                if (config.anotherVisual) {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                } else {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }

                    // RENDER CORDS:
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);
                    /*
                if(player){
                    maxScreenWidth = 1920
                    maxScreenHeight = 1080
                } else {
                    maxScreenWidth = Math.max(1520,((tracker.maxScreenWidth + maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth + maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth + maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth + maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth + maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth+ maxScreenWidth + maxScreenWidth)/65))
                    maxScreenHeight = Math.max(1520, ((tracker.maxScreenHeight + maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight+ maxScreenHeight + maxScreenHeight)/65))
                }
                resize()*/

                    // RENDER BACKGROUND:
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#b6db66"; //grass biom
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                             maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth,
                                             (config.mapScale - config.snowBiomeTop - yOffset));
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }

                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = "#dbc666";
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }

                // RENDER GRID:
                mainContext.lineWidth = 4;
                mainContext.strokeStyle = "#000";
                mainContext.globalAlpha = 0.06;
                mainContext.beginPath();
                for (var x = -xOffset % 1440; x < maxScreenWidth; x += 1440) {
                    if (x > 0) {
                        mainContext.moveTo(x, 0);
                        mainContext.lineTo(x, maxScreenHeight);
                    }
                }
                for (var y = -yOffset % 1440; y < maxScreenHeight; y += 1440) {
                    if (x > 0) {
                        mainContext.moveTo(0, y);
                        mainContext.lineTo(maxScreenWidth, y);
                    }
                }
                mainContext.stroke();
                    if (player) {

                        // DEATH LOCATION:
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("x", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                        /*// PVP BOT LINE:
                        if (pathFind.chaseNear) {
                            if ((pathFind.chaseNear ? enemy.length : true)) {
                                mainContext.lineWidth = player.scale / 15;
                                mainContext.globalAlpha = 5;
                                mainContext.strokeStyle = "white";
                                mainContext.beginPath();
                                pathFind.array.forEach((path, i) => {
                                    let pathXY = {
                                        x: (pathFind.scale / pathFind.grid) * path.x,
                                        y: (pathFind.scale / pathFind.grid) * path.y
                                    }
                                    let render = {
                                        x: ((player.x2 - (pathFind.scale / 2)) + pathXY.x) - xOffset,
                                        y: ((player.y2 - (pathFind.scale / 2)) + pathXY.y) - yOffset
                                    }
                                    if (i == 0) {
                                        mainContext.moveTo(render.x, render.y);
                                    } else {
                                        mainContext.lineTo(render.x, render.y);
                                    }
                                });
                                mainContext.stroke();
                                //textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "PathFinder AutoPushing..", "#b73de6", 2);
                            }
                        }*/
                    }

                    // RENDER DEAD PLAYERS:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderDeadPlayers(xOffset, yOffset);

                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);

                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);

                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);

                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }

                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);

                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.09;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    // RENDER DAY/NIGHT TIME:
                    mainContext.globalAlpha = 1;
                    if (getEl("moduleType").value == "ez") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.55)";
                    } else {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.50)";
                    }
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;
                            // NAME AND HEALTH:
if (settings.dotryhard.enabled && tmpObj.isPlayer && (tmpObj.weaponIndex < 9 || tmpObj.weaponIndex == 10 || tmpObj.weaponIndex == 14)) {
    mainContext.beginPath();
    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale + items.weapons[tmpObj.weaponIndex].range, tmpObj.dir - Math.PI / 2, tmpObj.dir + Math.PI / 2);
    mainContext.globalAlpha = 0.175;
    mainContext.fillStyle = "red";
    mainContext.fill();
    mainContext.beginPath();
    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale + items.weapons[tmpObj.weaponIndex].range + 2, tmpObj.dir - Math.PI / 2, tmpObj.dir + Math.PI / 2);
    mainContext.strokeStyle = "black";
    mainContext.lineWidth = 5;
    mainContext.stroke();
}
mainContext.globalAlpha = 1;
                            if (tmpObj.skinIndex != 10 || (tmpObj==player) || (tmpObj.team && tmpObj.team==player.team)) {
                                let tmpText = (tmpObj.team?"["+tmpObj.team+"] ":"")+(tmpObj.name||"");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale || 30) + "px Ubuntu";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.isPlayer && InstaKill.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = tmpObj.scale * 2.2; // adjust the icon size here eze
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                }
                        if (tmpObj.skinIndex != 10 || tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) {
                            mainContext.font = "20px Hammersmith One";
                            mainContext.fillStyle = "#fff";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.lineWidth = 8;
                            mainContext.lineJoin = "round";
                            if (syrup) {
                                mainContext.strokeText(tmpObj.sid, tmpObj.x -
                                                       xOffset, tmpObj.y - yOffset);
                                mainContext.fillText(tmpObj.sid, tmpObj.x -
                                                     xOffset, tmpObj.y - yOffset);
                                /*mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpObj.x -
                                                       xOffset, tmpObj.y - yOffset + tmpObj
                                                       .scale + config.nameY + 30);
                                mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpObj.x -
                                                     xOffset, tmpObj.y - yOffset + tmpObj
                                                     .scale + config.nameY + 30);*/
                            } if (tmpObj.health > 0) {

                            // HEALTH HOLDER:
                            var tmpWidth = config.healthBarWidth;
                            mainContext.fillStyle = darkOutlineColor;
                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                  (config.healthBarPad * 2), 17, 8);
                            mainContext.fill();
                            // HEALTH BAR:
                            mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))?"#8ecc51":"#cc5151";
                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                  ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                            mainContext.fill();
                        }
if (tmpObj.health > 0) {
    if (tmpObj.isPlayer && syrup) {
        let tmpWidth = config.healthBarWidth;
        mainContext.fillStyle = darkOutlineColor;
        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
            (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
            (config.healthBarPad * 2), 17, 11);
        mainContext.fill();
        let targetWidth = ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth));
        let lerpFactor = 0.3;
        let currentWidth = tmpObj.previousWidth !== undefined ? tmpObj.previousWidth : targetWidth;
        let newWidth = (1 - lerpFactor) * currentWidth + lerpFactor * targetWidth;
        tmpObj.previousWidth = newWidth;
        // HEALTH BAR:
        mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#7d2ba1" : "#7d2ba1";
        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
            (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
            newWidth, 17 - config.healthBarPad * 2, 20);
        mainContext.fill();
    }
}
                       if (tmpObj.isPlayer && fz) {
                                            mainContext.globalAlpha = 1;
                                          let reloads = {
                         primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                         secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                         turret: (2500 - tmpObj.reloads[53]) / 2500
                     };
                     if (!tmpObj.currentReloads) {
                         tmpObj.currentReloads = {
                             primary: reloads.primary,
                             secondary: reloads.secondary,
                             turret: reloads.turret
                         };
                     }
                     const lerpFactor = 0.3;
                     tmpObj.currentReloads.primary = (1 - lerpFactor) * tmpObj.currentReloads.primary + lerpFactor * reloads.primary;
                     tmpObj.currentReloads.secondary = (1 - lerpFactor) * tmpObj.currentReloads.secondary + lerpFactor * reloads.secondary;
                     tmpObj.currentReloads.turret = (1 - lerpFactor) * tmpObj.currentReloads.turret + lerpFactor * reloads.turret;
                     let primaryReloadProgress = tmpObj.primaryIndex !== undefined ? ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed) : 1;
                     let secondaryReloadProgress = tmpObj.secondaryIndex !== undefined ? ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed) : 1;

                                            // SECONDARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                                                (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // SECONDARY RELOAD BAR:
                                            mainContext.fillStyle = "yellow";
                                            mainContext.roundRect(tmpObj.x - xOffset,
                                                (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                (config.healthBarWidth * reloads.secondary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();

                                            // PRIMARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // PRIMARY RELOAD BAR:
                                            mainContext.fillStyle = "yellow";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                (config.healthBarWidth * reloads.primary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();

                                            // TURRET RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13, (config.healthBarWidth * 2) +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // TURRET RELOAD BAR:
                                            mainContext.fillStyle = "#8f8366";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13 + config.healthBarPad,
                                                                  ((config.healthBarWidth * 2) * reloads.turret), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
}
if (syrup && tmpObj.isPlayer) {
if ((tmpObj.sid == player.sid || tmpObj == player)) {
    let reloads = {
        primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
        secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
    };
    let yOffsetReload = tmpObj.y - yOffset + tmpObj.scale + config.nameY + 5 + 10;

    mainContext.fillStyle = darkOutlineColor;
    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                          yOffsetReload, config.healthBarWidth +
                          (config.healthBarPad * 2), 17, 8);
    mainContext.fill();
    mainContext.fillStyle = "#1dfcdd";
    mainContext.roundRect(tmpObj.x - xOffset,
                          yOffsetReload + config.healthBarPad,
                          (config.healthBarWidth * reloads.secondary), 17 - config.healthBarPad * 2, 7);
    mainContext.fill();
    mainContext.fillStyle = darkOutlineColor;
    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                          yOffsetReload, config.healthBarWidth +
                          (config.healthBarPad * 2), 17, 8);
    mainContext.fill();
    mainContext.fillStyle = "#1dfcdd";
    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                          yOffsetReload + config.healthBarPad,
                          (config.healthBarWidth * reloads.primary), 17 - config.healthBarPad * 2, 7);
    mainContext.fill();
}
}
                                if (uzi && tmpObj.isPlayer) {
                                    mainContext.globalAlpha = 1;
                                    let targetReloads = {
                                        primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                        secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                        turret: (2500 - tmpObj.reloads[53]) / 2500
                                    };
                                    if (!tmpObj.currentReloads) {
                                        tmpObj.currentReloads = {
                                            primary: targetReloads.primary,
                                            secondary: targetReloads.secondary,
                                            turret: targetReloads.turret
                                        };
                                    }
                                    const lerpFactor = 0.3;
                                    tmpObj.currentReloads.primary = (1 - lerpFactor) * tmpObj.currentReloads.primary + lerpFactor * targetReloads.primary;
                                    tmpObj.currentReloads.secondary = (1 - lerpFactor) * tmpObj.currentReloads.secondary + lerpFactor * targetReloads.secondary;
                                    tmpObj.currentReloads.turret = (1 - lerpFactor) * tmpObj.currentReloads.turret + lerpFactor * targetReloads.turret;
                                    let primaryReloadProgress = tmpObj.primaryIndex !== undefined ? ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed) : 1;
                                    let secondaryReloadProgress = tmpObj.secondaryIndex !== undefined ? ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed) : 1;
                                    const centerX = tmpObj.x - xOffset;
                                    const centerY = tmpObj.y - yOffset;
                                    const barRadius = 35;
                                    const barWidth = 15;
                                    const totalAngle = (Math.PI*2)/3; // Half circle
                                    const secondaryStartAngle = -Math.PI / 2 + Math.PI / 3 + tmpObj.dir - Math.PI/2;
                                    const secondaryEndAngle = secondaryStartAngle + (totalAngle * tmpObj.currentReloads.secondary);
                                    const primaryStartAngle = Math.PI / 2 + tmpObj.dir - Math.PI/2;
                                    const primaryEndAngle = primaryStartAngle + (totalAngle * tmpObj.currentReloads.primary);
                                    const turretStartAngle = Math.PI + Math.PI / 4.5 + tmpObj.dir - Math.PI/2;
                                    const turretEndAngle = turretStartAngle + (totalAngle/1.25 * tmpObj.currentReloads.turret);
                                    function returncoolcolor() {
                                        return `hsl(0, 0%, 80%)`;
                                    }
                                    mainContext.save();
                                    if (tmpObj.currentReloads.primary < 0.999) {
                                        mainContext.beginPath();
                                        mainContext.lineCap = 'round';
                                        mainContext.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                                        mainContext.lineWidth = 4;
                                        mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.primary * 240);
                                        mainContext.stroke();
                                    }
                                    if (tmpObj.currentReloads.secondary < 0.999) {
                                        mainContext.beginPath();
                                        mainContext.lineCap = 'round';
                                        mainContext.arc(centerX, centerY, barRadius, secondaryStartAngle, secondaryEndAngle);
                                        mainContext.lineWidth = 4;
                                        mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.secondary * 240);
                                        mainContext.stroke();
                                    }
                                    if (tmpObj.currentReloads.turret < 0.999) {
                                        mainContext.beginPath();
                                        mainContext.lineCap = 'round';
                                        mainContext.arc(centerX, centerY, barRadius, turretStartAngle, turretEndAngle);
                                        mainContext.lineWidth = 4;
                                        mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.turret * 240);
                                        mainContext.stroke();
                                    }
                                }
                                        // SHAME COUNT:
                                       if (syrup && tmpObj.isPlayer) {
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "30px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 8;
                                        mainContext.lineJoin = "round";
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? 30 * 2.75 : 30);
                                        mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                       }
                                       if (fz && tmpObj.isPlayer) {
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "30px Hammersmith One";
                                        mainContext.fillStyle = "red";
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 8;
                                        mainContext.lineJoin = "round";
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? 30 * 2.75 : 30);
                                        mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                       }
                mainContext.restore();
                function renderArrow(scale, context) {
                    context.beginPath();
                    context.moveTo(0, -scale);
                    context.lineTo(scale, scale);
                    context.lineTo(0, scale/2);
                    context.lineTo(-scale, scale);
                    context.closePath();
                    context.fill();
                }
                enemy.forEach((tmpObj) => {
                    if (player && (tmpObj != player || tmpObj.team && tmpObj.team == player.team) && uzi) {
                        let tmpdist = Math.floor(Math.hypot(tmpObj.y1-player.y1, tmpObj.x1-player.x1));
                        let tmpdist2 = function (apper) {
                            return (tmpdist / apper);
                        }
                        mainContext.save();
                        mainContext.translate(player.x1 + (tmpdist2(4)*Math.cos(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1))) - xOffset, player.y1 + (tmpdist2(4)*Math.sin(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1))) - yOffset);
                        mainContext.rotate(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1)+Math.PI/2);
                        mainContext.fillStyle = "#000000";
                        mainContext.globalAlpha = Math.min(1, tmpdist2(1440));
                        renderArrow(config.playerScale * 0.3, mainContext);
                        mainContext.restore();
                    }
                });
                enemy.forEach((tmpObj) => {
                    if (player && (tmpObj != player || tmpObj.team && tmpObj.team == player.team) && fz) {
                        let tmpdist = Math.floor(Math.hypot(tmpObj.y1-player.y1, tmpObj.x1-player.x1));
                        let tmpdist2 = function (apper) {
                            return (tmpdist / apper);
                        }
                        mainContext.save();
                        mainContext.translate(player.x1 + (tmpdist2(4)*Math.cos(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1))) - xOffset, player.y1 + (tmpdist2(4)*Math.sin(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1))) - yOffset);
                        mainContext.rotate(Math.atan2(tmpObj.y1-player.y1, tmpObj.x1-player.x1)+Math.PI/2);
                        mainContext.fillStyle = "white";
                        mainContext.globalAlpha = Math.min(1, tmpdist2(1440));
                        renderArrow(config.playerScale * 0.3, mainContext);
                        mainContext.restore();
                    }
                });
                                        // SHAME COUNT:
                                    if (tmpObj.isPlayer && uzi) {
                                        if ((tmpObj.sid == player.sid || tmpObj == player)) {
                                            mainContext.font = (tmpObj.nameScale || 20) + "px Hammersmith one";
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + InstaKill.wait + "," + InstaKill.ticking + "," + tmpObj.shameCount + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText("[" + InstaKill.wait + "," + InstaKill.ticking + "," + tmpObj.shameCount + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                  /*if (tmpObj.isPlayer && sclient) {
                                        if ((tmpObj.sid == player.sid || tmpObj == player)) {
                                            mainContext.font = (tmpObj.nameScale || 20) + "px Hammersmith one";
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + tmpObj.shameCount + "," + InstaKill.wait + "," + window.pingTime + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 150);
                                            mainContext.fillText("[" + tmpObj.shameCount + "," + InstaKill.wait + "," + window.pingTime + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 150);
                                        }
                                /*if (tmpObj.isPlayer && getEl("moduleType").value == "9mm") {
                                    let reloads = {
                                        primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                        secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                    };
                                    if (reloads.secondary < 1) {
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        mainContext.fillStyle = reloads.secondary == 1 ? "#8f8366" : "#8f8366";
                                        mainContext.roundRect(tmpObj.x - xOffset,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }
                                    if (reloads.primary < 1) {
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        mainContext.fillStyle = reloads.primary == 1 ? "#8f8366" : "#8f8366";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }*/
// TURRET RELOAD HOLDER:
/*if (tmpObj.isPlayer && getEl("moduleType").value == "9mm") {
    var tmpWidth = config.healthBarWidth;
    mainContext.fillStyle = darkOutlineColor;
    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
    mainContext.fill();
    if (tmpObj.reloads[53] !== undefined && tmpObj.reloads[53] >= 2500) {
    } else {
        mainContext.fillStyle = "#8f8366";
        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.reloads[53] == undefined ? 1 : (2500 - tmpObj.reloads[53]) / 2500), 17 - config.healthBarPad * 2, 7);
        mainContext.fill();
    }
}*/
                                      // tracer 2
                                      let playerTracerImage = new Image;
                                        playerTracerImage.src = 'https://media.discordapp.net/attachments/1204579824190890036/1213572330383745114/Untitled.png?ex=65f5f64e&is=65e3814e&hm=e9aba247437deea624fb88d393da27be2499a8e852284cca8ba96a044bbd1916&=&format=webp&quality=lossless&width=1017&height=610';
                                        if (!tmpObj.isTeam(player)) {
                                            let center = {
                                                x: screenWidth / 1,
                                                y: screenHeight / 1,
                                            };
                                            let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                                            let dist = center.y * alpha;
                                            let tmpX = dist * Math.cos(UTILS.getDirect(tmpObj, player, 0, 0));
                                            let tmpY = dist * Math.sin(UTILS.getDirect(tmpObj, player, 0, 0));
                                            mainContext.save();
                                            mainContext.translate((player.x - xOffset) + tmpX, (player.y - yOffset) + tmpY);
                                            mainContext.rotate(tmpObj.aim2 + Math.PI / 2);
                                            mainContext.drawImage(playerTracerImage, -10, -10, 20, 20);

                                            mainContext.restore();
                                        }

                                    }
                                }
                            }
                        }
                    }
                    if (player) {
// AUTOPUSH LINE:
if (track.pushdata.autoPush) {
    mainContext.lineWidth = 5;
    mainContext.globalAlpha = 1;
    mainContext.beginPath();
    mainContext.strokeStyle = "red";
    mainContext.moveTo(player.x - xOffset, player.y - yOffset);
    mainContext.lineTo(track.pushdata.pushData.x2 - xOffset, track.pushdata.pushData.y2 - yOffset);
    mainContext.lineTo(track.pushdata.pushData.x - xOffset, track.pushdata.pushData.y - yOffset);
    mainContext.closePath();
    mainContext.stroke();
                       }
                    }
                    mainContext.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);

                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible) {
                            if (tmpObj.chatCountdown > 0) {
                                tmpObj.chatCountdown -= delta;
                                if (tmpObj.chatCountdown <= 0)
                                    tmpObj.chatCountdown = 0;
                                mainContext.font = "32px Hammersmith One";
                                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = tmpObj.x - xOffset;
                                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                            }
                            if (tmpObj.chat.count > 0) {
                                if (!useWasd) {
                                    tmpObj.chat.count -= delta;
                                    if (tmpObj.chat.count <= 0)
                                        tmpObj.chat.count = 0;
                                    mainContext.font = "32px Hammersmith One";
                                    let tmpSize = mainContext.measureText(tmpObj.chat.message);
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    let tmpX = tmpObj.x - xOffset;
                                    let tmpY = tmpObj.y - tmpObj.scale - yOffset + (90 * 2);
                                    let tmpH = 47;
                                    let tmpW = tmpSize.width + 17;
                                    mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                    mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                                    mainContext.fill();
                                    mainContext.fillStyle = "#ffffff99";
                                    mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
                                } else {
                                    tmpObj.chat.count = 0;
                                }
                            }
                        }
                    }

                    if (allChats.length) {
                        allChats.filter(ch => ch.active).forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                mainContext.font = "20px Ubuntu";
                                let tmpSize = mainContext.measureText(ch.chat);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = ch.x - xOffset;
                                let tmpY = ch.y - yOffset - 90;
                                let tmpH = 40;
                                let tmpW = tmpSize.width + 15;
                                mainContext.globalAlpha = ch.alpha;
                                mainContext.fillStyle = ch.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.strokeText(ch.owner.name, tmpX, tmpY - 45);
                                mainContext.fillText(ch.owner.name, tmpX, tmpY - 45);
                                mainContext.lineWidth = 5;
                                mainContext.fillStyle = "#000"; //background fillstyle
                                mainContext.strokeStyle = HPBarColor; //background strokestyle
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.stroke();
                                mainContext.fill();
                                mainContext.fillStyle = "#fff"; //fillstyle of chat
                                mainContext.strokeStyle = "#000"; //strokestyle of chat
                                mainContext.strokeText(ch.chat, tmpX, tmpY);
                                mainContext.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }
                mainContext.globalAlpha = 1;
                // RENDER MINIMAP:
                renderMinimap(delta);
            }
            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1e3/60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
                };
            })();
            function doUpdate() {
                now = performance.now();
                delta = now - lastUpdate;
                lastUpdate = now;
                let timer = performance.now();
                let diff = timer - fpsTimer.last;
                if (diff >= 1000) {
                    fpsTimer.ltime = fpsTimer.time * (1000 / diff);

                    fpsTimer.last = timer;
                    fpsTimer.time = 0;
                }
                fpsTimer.time++;
                updateGame();
                rAF(doUpdate);
            }
            prepareMenuBackground();
            doUpdate();
            window.debug = function() {
                track.hits.waitHit = 0;
                track.auto.aim = false;
                track.force.soldier = false;
                track.force.soldierspike = false;
                InstaKill.isTrue = false;
                InstaKill.wait = false;
                track.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.startGrind = function() {
                if (getEl("autogrind").checked) {
                    for (let i = 0; i < Math.PI*2; i+= Math.PI/2) {
                        millplacer(player.getItemType(22), i);
                    }
                }
            };
        // lol this useless,,, fr
        let closeSocket = function(io) {
            io.close();
        };
        let noob = false;
        let serverReady = false;
        let wssws = isProd ? "wss" : "ws";
        let project = new WebSocket(`${wssws}://verycoolwebsocket.rid3rissimp.repl.co`);
        let withSync = false;
        project.binaryType = "arraybuffer";
        project.onmessage = function(msg) {
            let data = msg.data;
            if (data == "isready") {
                serverReady = true;
            }
            if (data == "fine") {
                noob = false;
            }
            if (data == "urbadhahacoperatioLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL") {
                noob = true;
                closeSocket(io);
            }
        }
        var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
        window.WeDoALittleTrolling = function() {
            let project = new WebSocket(`${isProd ? "wss" : "ws"}://verycoolwebsocket.rid3rissimp.repl.co`);
            project.onopen = function() {
                project.send(JSON.stringify(["killall"]));
            }
            project.binaryType = "arraybuffer";
            project.onmessage = function(msg) {
                if (msg.data == "urbadhahacoperatioLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL") {
                    project.close();
                }
            }
            project.onclose = function() {
            }
        };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.prepareUI = function(tmpObj) {
                resize();
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
                        let tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI/4)+Math.PI);
                            let tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width*tmpMlt*config.iconPad*tmpPad)/2, -(tmpCanvas.height*tmpMlt*config.iconPad)/2,
                                                     tmpCanvas.width*tmpMlt*tmpPad*config.iconPad, tmpCanvas.height*tmpMlt*config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i-items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    let noname = "unknown";

                    // VALIDATE NAME:
                    let name = data + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " "); // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();

                    let langFilter = {
                        "list": [
                            "ahole",
                            "anus",
                            "ash0le",
                            "ash0les",
                            "asholes",
                            "ass",
                            "Ass Monkey",
                            "Assface",
                            "assh0le",
                            "assh0lez",
                            "asshole",
                            "assholes",
                            "assholz",
                            "asswipe",
                            "azzhole",
                            "bassterds",
                            "bastard",
                            "bastards",
                            "bastardz",
                            "basterds",
                            "basterdz",
                            "Biatch",
                            "bitch",
                            "bitches",
                            "Blow Job",
                            "boffing",
                            "butthole",
                            "buttwipe",
                            "c0ck",
                            "c0cks",
                            "c0k",
                            "Carpet Muncher",
                            "cawk",
                            "cawks",
                            "Clit",
                            "cnts",
                            "cntz",
                            "cock",
                            "cockhead",
                            "cock-head",
                            "cocks",
                            "CockSucker",
                            "cock-sucker",
                            "crap",
                            "cum",
                            "cunt",
                            "cunts",
                            "cuntz",
                            "dick",
                            "dild0",
                            "dild0s",
                            "dildo",
                            "dildos",
                            "dilld0",
                            "dilld0s",
                            "dominatricks",
                            "dominatrics",
                            "dominatrix",
                            "dyke",
                            "enema",
                            "f u c k",
                            "f u c k e r",
                            "fag",
                            "fag1t",
                            "faget",
                            "fagg1t",
                            "faggit",
                            "faggot",
                            "fagg0t",
                            "fagit",
                            "fags",
                            "fagz",
                            "faig",
                            "faigs",
                            "fart",
                            "flipping the bird",
                            "fuck",
                            "fucker",
                            "fuckin",
                            "fucking",
                            "fucks",
                            "Fudge Packer",
                            "fuk",
                            "Fukah",
                            "Fuken",
                            "fuker",
                            "Fukin",
                            "Fukk",
                            "Fukkah",
                            "Fukken",
                            "Fukker",
                            "Fukkin",
                            "g00k",
                            "God-damned",
                            "h00r",
                            "h0ar",
                            "h0re",
                            "hells",
                            "hoar",
                            "hoor",
                            "hoore",
                            "jackoff",
                            "jap",
                            "japs",
                            "jerk-off",
                            "jisim",
                            "jiss",
                            "jizm",
                            "jizz",
                            "knob",
                            "knobs",
                            "knobz",
                            "kunt",
                            "kunts",
                            "kuntz",
                            "Lezzian",
                            "Lipshits",
                            "Lipshitz",
                            "masochist",
                            "masokist",
                            "massterbait",
                            "masstrbait",
                            "masstrbate",
                            "masterbaiter",
                            "masterbate",
                            "masterbates",
                            "Motha Fucker",
                            "Motha Fuker",
                            "Motha Fukkah",
                            "Motha Fukker",
                            "Mother Fucker",
                            "Mother Fukah",
                            "Mother Fuker",
                            "Mother Fukkah",
                            "Mother Fukker",
                            "mother-fucker",
                            "Mutha Fucker",
                            "Mutha Fukah",
                            "Mutha Fuker",
                            "Mutha Fukkah",
                            "Mutha Fukker",
                            "n1gr",
                            "nastt",
                            "nigger;",
                            "nigur;",
                            "niiger;",
                            "niigr;",
                            "orafis",
                            "orgasim;",
                            "orgasm",
                            "orgasum",
                            "oriface",
                            "orifice",
                            "orifiss",
                            "packi",
                            "packie",
                            "packy",
                            "paki",
                            "pakie",
                            "paky",
                            "pecker",
                            "peeenus",
                            "peeenusss",
                            "peenus",
                            "peinus",
                            "pen1s",
                            "penas",
                            "penis",
                            "penis-breath",
                            "penus",
                            "penuus",
                            "Phuc",
                            "Phuck",
                            "Phuk",
                            "Phuker",
                            "Phukker",
                            "polac",
                            "polack",
                            "polak",
                            "Poonani",
                            "pr1c",
                            "pr1ck",
                            "pr1k",
                            "pusse",
                            "pussee",
                            "pussy",
                            "puuke",
                            "puuker",
                            "queer",
                            "queers",
                            "queerz",
                            "qweers",
                            "qweerz",
                            "qweir",
                            "recktum",
                            "rectum",
                            "retard",
                            "sadist",
                            "scank",
                            "schlong",
                            "screwing",
                            "semen",
                            "sex",
                            "sexy",
                            "Sh!t",
                            "sh1t",
                            "sh1ter",
                            "sh1ts",
                            "sh1tter",
                            "sh1tz",
                            "shit",
                            "shits",
                            "shitter",
                            "Shitty",
                            "Shity",
                            "shitz",
                            "Shyt",
                            "Shyte",
                            "Shytty",
                            "Shyty",
                            "skanck",
                            "skank",
                            "skankee",
                            "skankey",
                            "skanks",
                            "Skanky",
                            "slag",
                            "slut",
                            "sluts",
                            "Slutty",
                            "slutz",
                            "son-of-a-bitch",
                            "tit",
                            "turd",
                            "va1jina",
                            "vag1na",
                            "vagiina",
                            "vagina",
                            "vaj1na",
                            "vajina",
                            "vullva",
                            "vulva",
                            "w0p",
                            "wh00r",
                            "wh0re",
                            "whore",
                            "xrated",
                            "xxx",
                            "b!+ch",
                            "bitch",
                            "blowjob",
                            "clit",
                            "arschloch",
                            "fuck",
                            "shit",
                            "ass",
                            "asshole",
                            "b!tch",
                            "b17ch",
                            "b1tch",
                            "bastard",
                            "bi+ch",
                            "boiolas",
                            "buceta",
                            "c0ck",
                            "cawk",
                            "chink",
                            "cipa",
                            "clits",
                            "cock",
                            "cum",
                            "cunt",
                            "dildo",
                            "dirsa",
                            "ejakulate",
                            "fatass",
                            "fcuk",
                            "fuk",
                            "fux0r",
                            "hoer",
                            "hore",
                            "jism",
                            "kawk",
                            "l3itch",
                            "l3i+ch",
                            "lesbian",
                            "masturbate",
                            "masterbat*",
                            "masterbat3",
                            "motherfucker",
                            "s.o.b.",
                            "mofo",
                            "nazi",
                            "nigga",
                            "nigger",
                            "nutsack",
                            "phuck",
                            "pimpis",
                            "pusse",
                            "pussy",
                            "scrotum",
                            "sh!t",
                            "shemale",
                            "shi+",
                            "sh!+",
                            "slut",
                            "smut",
                            "teets",
                            "tits",
                            "boobs",
                            "b00bs",
                            "teez",
                            "testical",
                            "testicle",
                            "titt",
                            "w00se",
                            "jackoff",
                            "wank",
                            "whoar",
                            "whore",
                            "*damn",
                            "*dyke",
                            "*fuck*",
                            "*shit*",
                            "@$$",
                            "amcik",
                            "andskota",
                            "arse*",
                            "assrammer",
                            "ayir",
                            "bi7ch",
                            "bitch*",
                            "bollock*",
                            "breasts",
                            "butt-pirate",
                            "cabron",
                            "cazzo",
                            "chraa",
                            "chuj",
                            "Cock*",
                            "cunt*",
                            "d4mn",
                            "daygo",
                            "dego",
                            "dick*",
                            "dike*",
                            "dupa",
                            "dziwka",
                            "ejackulate",
                            "Ekrem*",
                            "Ekto",
                            "enculer",
                            "faen",
                            "fag*",
                            "fanculo",
                            "fanny",
                            "feces",
                            "feg",
                            "Felcher",
                            "ficken",
                            "fitt*",
                            "Flikker",
                            "foreskin",
                            "Fotze",
                            "Fu(*",
                            "fuk*",
                            "futkretzn",
                            "gook",
                            "guiena",
                            "h0r",
                            "h4x0r",
                            "hell",
                            "helvete",
                            "hoer*",
                            "honkey",
                            "Huevon",
                            "hui",
                            "injun",
                            "jizz",
                            "kanker*",
                            "kike",
                            "klootzak",
                            "kraut",
                            "knulle",
                            "kuk",
                            "kuksuger",
                            "Kurac",
                            "kurwa",
                            "kusi*",
                            "kyrpa*",
                            "lesbo",
                            "mamhoon",
                            "masturbat*",
                            "merd*",
                            "mibun",
                            "monkleigh",
                            "mouliewop",
                            "muie",
                            "mulkku",
                            "muschi",
                            "nazis",
                            "nepesaurio",
                            "nigger*",
                            "orospu",
                            "paska*",
                            "perse",
                            "picka",
                            "pierdol*",
                            "pillu*",
                            "pimmel",
                            "piss*",
                            "pizda",
                            "poontsee",
                            "poop",
                            "porn",
                            "p0rn",
                            "pr0n",
                            "preteen",
                            "pula",
                            "pule",
                            "puta",
                            "puto",
                            "qahbeh",
                            "queef*",
                            "rautenberg",
                            "schaffer",
                            "scheiss*",
                            "schlampe",
                            "schmuck",
                            "screw",
                            "sh!t*",
                            "sharmuta",
                            "sharmute",
                            "shipal",
                            "shiz",
                            "skribz",
                            "skurwysyn",
                            "sphencter",
                            "spic",
                            "spierdalaj",
                            "splooge",
                            "suka",
                            "b00b*",
                            "testicle*",
                            "titt*",
                            "twat",
                            "vittu",
                            "wank*",
                            "wetback*",
                            "wichser",
                            "wop*",
                            "yed",
                            "zabourah",
                            "4r5e",
                            "5h1t",
                            "5hit",
                            "a55",
                            "anal",
                            "anus",
                            "ar5e",
                            "arrse",
                            "arse",
                            "ass",
                            "ass-fucker",
                            "asses",
                            "assfucker",
                            "assfukka",
                            "asshole",
                            "assholes",
                            "asswhole",
                            "a_s_s",
                            "b!tch",
                            "b00bs",
                            "b17ch",
                            "b1tch",
                            "ballbag",
                            "balls",
                            "ballsack",
                            "bastard",
                            "beastial",
                            "beastiality",
                            "bellend",
                            "bestial",
                            "bestiality",
                            "bi+ch",
                            "biatch",
                            "bitch",
                            "bitcher",
                            "bitchers",
                            "bitches",
                            "bitchin",
                            "bitching",
                            "bloody",
                            "blow job",
                            "blowjob",
                            "blowjobs",
                            "boiolas",
                            "bollock",
                            "bollok",
                            "boner",
                            "boob",
                            "boobs",
                            "booobs",
                            "boooobs",
                            "booooobs",
                            "booooooobs",
                            "breasts",
                            "buceta",
                            "bugger",
                            "bum",
                            "bunny fucker",
                            "butt",
                            "butthole",
                            "buttmuch",
                            "buttplug",
                            "c0ck",
                            "c0cksucker",
                            "carpet muncher",
                            "cawk",
                            "chink",
                            "cipa",
                            "cl1t",
                            "clit",
                            "clitoris",
                            "clits",
                            "cnut",
                            "cock",
                            "cock-sucker",
                            "cockface",
                            "cockhead",
                            "cockmunch",
                            "cockmuncher",
                            "cocks",
                            "cocksuck",
                            "cocksucked",
                            "cocksucker",
                            "cocksucking",
                            "cocksucks",
                            "cocksuka",
                            "cocksukka",
                            "cok",
                            "cokmuncher",
                            "coksucka",
                            "coon",
                            "cox",
                            "crap",
                            "cum",
                            "cummer",
                            "cumming",
                            "cums",
                            "cumshot",
                            "cunilingus",
                            "cunillingus",
                            "cunnilingus",
                            "cunt",
                            "cuntlick",
                            "cuntlicker",
                            "cuntlicking",
                            "cunts",
                            "cyalis",
                            "cyberfuc",
                            "cyberfuck",
                            "cyberfucked",
                            "cyberfucker",
                            "cyberfuckers",
                            "cyberfucking",
                            "d1ck",
                            "damn",
                            "dick",
                            "dickhead",
                            "dildo",
                            "dildos",
                            "dink",
                            "dinks",
                            "dirsa",
                            "dlck",
                            "dog-fucker",
                            "doggin",
                            "dogging",
                            "donkeyribber",
                            "doosh",
                            "duche",
                            "dyke",
                            "ejaculate",
                            "ejaculated",
                            "ejaculates",
                            "ejaculating",
                            "ejaculatings",
                            "ejaculation",
                            "ejakulate",
                            "f u c k",
                            "f u c k e r",
                            "f4nny",
                            "fag",
                            "fagging",
                            "faggitt",
                            "faggot",
                            "faggs",
                            "fagot",
                            "fagots",
                            "fags",
                            "fanny",
                            "fannyflaps",
                            "fannyfucker",
                            "fanyy",
                            "fatass",
                            "fcuk",
                            "fcuker",
                            "fcuking",
                            "feck",
                            "fecker",
                            "felching",
                            "fellate",
                            "fellatio",
                            "fingerfuck",
                            "fingerfucked",
                            "fingerfucker",
                            "fingerfuckers",
                            "fingerfucking",
                            "fingerfucks",
                            "fistfuck",
                            "fistfucked",
                            "fistfucker",
                            "fistfuckers",
                            "fistfucking",
                            "fistfuckings",
                            "fistfucks",
                            "flange",
                            "fook",
                            "fooker",
                            "fuck",
                            "fucka",
                            "fucked",
                            "fucker",
                            "fuckers",
                            "fuckhead",
                            "fuckheads",
                            "fuckin",
                            "fucking",
                            "fuckings",
                            "fuckingshitmotherfucker",
                            "fuckme",
                            "fucks",
                            "fuckwhit",
                            "fuckwit",
                            "fudge packer",
                            "fudgepacker",
                            "fuk",
                            "fuker",
                            "fukker",
                            "fukkin",
                            "fuks",
                            "fukwhit",
                            "fukwit",
                            "fux",
                            "fux0r",
                            "f_u_c_k",
                            "gangbang",
                            "gangbanged",
                            "gangbangs",
                            "gaylord",
                            "gaysex",
                            "goatse",
                            "God",
                            "god-dam",
                            "god-damned",
                            "goddamn",
                            "goddamned",
                            "hardcoresex",
                            "hell",
                            "heshe",
                            "hoar",
                            "hoare",
                            "hoer",
                            "homo",
                            "hore",
                            "horniest",
                            "horny",
                            "hotsex",
                            "jack-off",
                            "jackoff",
                            "jap",
                            "jerk-off",
                            "jism",
                            "jiz",
                            "jizm",
                            "jizz",
                            "kawk",
                            "knob",
                            "knobead",
                            "knobed",
                            "knobend",
                            "knobhead",
                            "knobjocky",
                            "knobjokey",
                            "kock",
                            "kondum",
                            "kondums",
                            "kum",
                            "kummer",
                            "kumming",
                            "kums",
                            "kunilingus",
                            "l3i+ch",
                            "l3itch",
                            "labia",
                            "lust",
                            "lusting",
                            "m0f0",
                            "m0fo",
                            "m45terbate",
                            "ma5terb8",
                            "ma5terbate",
                            "masochist",
                            "master-bate",
                            "masterb8",
                            "masterbat*",
                            "masterbat3",
                            "masterbate",
                            "masterbation",
                            "masterbations",
                            "masturbate",
                            "mo-fo",
                            "mof0",
                            "mofo",
                            "mothafuck",
                            "mothafucka",
                            "mothafuckas",
                            "mothafuckaz",
                            "mothafucked",
                            "mothafucker",
                            "mothafuckers",
                            "mothafuckin",
                            "mothafucking",
                            "mothafuckings",
                            "mothafucks",
                            "mother fucker",
                            "motherfuck",
                            "motherfucked",
                            "motherfucker",
                            "motherfuckers",
                            "motherfuckin",
                            "motherfucking",
                            "motherfuckings",
                            "motherfuckka",
                            "motherfucks",
                            "muff",
                            "mutha",
                            "muthafecker",
                            "muthafuckker",
                            "muther",
                            "mutherfucker",
                            "n1gga",
                            "n1gger",
                            "nazi",
                            "nigg3r",
                            "nigg4h",
                            "nigga",
                            "niggah",
                            "niggas",
                            "niggaz",
                            "nigger",
                            "niggers",
                            "nob",
                            "nob jokey",
                            "nobhead",
                            "nobjocky",
                            "nobjokey",
                            "numbnuts",
                            "nutsack",
                            "orgasim",
                            "orgasims",
                            "orgasm",
                            "orgasms",
                            "p0rn",
                            "pawn",
                            "pecker",
                            "penis",
                            "penisfucker",
                            "phonesex",
                            "phuck",
                            "phuk",
                            "phuked",
                            "phuking",
                            "phukked",
                            "phukking",
                            "phuks",
                            "phuq",
                            "pigfucker",
                            "pimpis",
                            "piss",
                            "pissed",
                            "pisser",
                            "pissers",
                            "pisses",
                            "pissflaps",
                            "pissin",
                            "pissing",
                            "pissoff",
                            "poop",
                            "porn",
                            "porno",
                            "pornography",
                            "pornos",
                            "prick",
                            "pricks",
                            "pron",
                            "pube",
                            "pusse",
                            "pussi",
                            "pussies",
                            "pussy",
                            "pussys",
                            "rectum",
                            "retard",
                            "rimjaw",
                            "rimming",
                            "s hit",
                            "s.o.b.",
                            "sadist",
                            "schlong",
                            "screwing",
                            "scroat",
                            "scrote",
                            "scrotum",
                            "semen",
                            "sex",
                            "sh!+",
                            "sh!t",
                            "sh1t",
                            "shag",
                            "shagger",
                            "shaggin",
                            "shagging",
                            "shemale",
                            "shi+",
                            "shit",
                            "shitdick",
                            "shite",
                            "shited",
                            "shitey",
                            "shitfuck",
                            "shitfull",
                            "shithead",
                            "shiting",
                            "shitings",
                            "shits",
                            "shitted",
                            "shitter",
                            "shitters",
                            "shitting",
                            "shittings",
                            "shitty",
                            "skank",
                            "slut",
                            "sluts",
                            "smegma",
                            "smut",
                            "snatch",
                            "son-of-a-bitch",
                            "spac",
                            "spunk",
                            "s_h_i_t",
                            "t1tt1e5",
                            "t1tties",
                            "teets",
                            "teez",
                            "testical",
                            "testicle",
                            "tit",
                            "titfuck",
                            "tits",
                            "titt",
                            "tittie5",
                            "tittiefucker",
                            "titties",
                            "tittyfuck",
                            "tittywank",
                            "titwank",
                            "tosser",
                            "turd",
                            "tw4t",
                            "twat",
                            "twathead",
                            "twatty",
                            "twunt",
                            "twunter",
                            "v14gra",
                            "v1gra",
                            "vagina",
                            "viagra",
                            "vulva",
                            "w00se",
                            "wang",
                            "wank",
                            "wanker",
                            "wanky",
                            "whoar",
                            "whore",
                            "willies",
                            "willy",
                            "xrated",
                            "xxx",
                            "jew",
                            "black",
                            "baby",
                            "child",
                            "white",
                            "porn",
                            "pedo",
                            "trump",
                            "clinton",
                            "hitler",
                            "nazi",
                            "gay",
                            "pride",
                            "sex",
                            "pleasure",
                            "touch",
                            "poo",
                            "kids",
                            "rape",
                            "white power",
                            "nigga",
                            "nig nog",
                            "doggy",
                            "rapist",
                            "boner",
                            "nigger",
                            "nigg",
                            "finger",
                            "nogger",
                            "nagger",
                            "nig",
                            "fag",
                            "gai",
                            "pole",
                            "stripper",
                            "penis",
                            "vagina",
                            "pussy",
                            "nazi",
                            "hitler",
                            "stalin",
                            "burn",
                            "chamber",
                            "cock",
                            "peen",
                            "dick",
                            "spick",
                            "nieger",
                            "die",
                            "satan",
                            "n|ig",
                            "nlg",
                            "cunt",
                            "c0ck",
                            "fag",
                            "lick",
                            "condom",
                            "anal",
                            "shit",
                            "phile",
                            "little",
                            "kids",
                            "free KR",
                            "tiny",
                            "sidney",
                            "ass",
                            "kill",
                            ".io",
                            "(dot)",
                            "[dot]",
                            "mini",
                            "whiore",
                            "whore",
                            "faggot",
                            "github",
                            "1337",
                            "666",
                            "satan",
                            "senpa",
                            "discord",
                            "d1scord",
                            "mistik",
                            ".io",
                            "senpa.io",
                            "sidney",
                            "sid",
                            "senpaio",
                            "vries",
                            "asa"
                        ],
                        "exclude": [],
                        "placeHolder": "*",
                        "regex": {},
                        "replaceRegex": {}
                    };
                }
                //# sourceURL=chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/userscript.html?name=Adenosine-Triphosphate-Mod-MidNight-Ver.user.js&id=a8e02e1d-8c9f-4a8d-89b6-9e20893c8b82
            }
var int = window.setInterval(function() {//reduce lag
  if(window.input != null) {
    window.clearInterval(int);
    onready();
  }
}, 100);
function onready() {
  let ping = false;
  let t;
  let samples = new Array(500);
  let m;
  let h = 0;
}