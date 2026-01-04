// ==UserScript==
// @name        MEGAsync Linker - dev
// @namespace   Violentmonkey Scripts
// @match       https://*.pythonanywhere.com/go/*
// @grant       GM_xmlhttpRequest
// @version     1.0.0.1
// @author      -
// @description for URL MASK
// @noframe
// @downloadURL https://update.greasyfork.org/scripts/433979/MEGAsync%20Linker%20-%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/433979/MEGAsync%20Linker%20-%20dev.meta.js
// ==/UserScript==

init()

! function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.mega = t()
}(this, function() {
  "use strict";

  function u() {
    kr = !0;
    for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; t < r; ++t) wr[t] = e[t], Er[e.charCodeAt(t)] = t;
    Er[45] = 62, Er[95] = 63
  }

  function h(e, t, r) {
    for (var n, i = [], o = t; o < r; o += 3) n = (e[o] << 16) + (e[o + 1] << 8) + e[o + 2], i.push(wr[63 & (n = n) >> 18] + wr[63 & n >> 12] + wr[63 & n >> 6] + wr[63 & n]);
    return i.join("")
  }

  function s(e) {
    kr || u();
    for (var t, r = e.length, n = r % 3, i = "", o = [], a = 0, s = r - n; a < s; a += 16383) o.push(h(e, a, s < a + 16383 ? s : a + 16383));
    return 1 == n ? (t = e[r - 1], i += wr[t >> 2], i += wr[63 & t << 4], i += "==") : 2 == n && (t = (e[r - 2] << 8) + e[r - 1], i += wr[t >> 10], i += wr[63 & t >> 4], i += wr[63 & t << 2], i += "="), o.push(i), o.join("")
  }

  function r(e, t, r, n, i) {
    var o, a, s = 8 * i - n - 1,
      u = (1 << s) - 1,
      h = u >> 1,
      f = -7,
      c = r ? i - 1 : 0,
      l = r ? -1 : 1,
      r = e[t + c];
    for (c += l, o = r & (1 << -f) - 1, r >>= -f, f += s; 0 < f; o = 256 * o + e[t + c], c += l, f -= 8);
    for (a = o & (1 << -f) - 1, o >>= -f, f += n; 0 < f; a = 256 * a + e[t + c], c += l, f -= 8);
    if (0 === o) o = 1 - h;
    else {
      if (o === u) return a ? NaN : 1 / 0 * (r ? -1 : 1);
      a += vr(2, n), o -= h
    }
    return (r ? -1 : 1) * a * vr(2, o - n)
  }

  function o(e, t, r, n, i, o) {
    var a, s, u = 8 * o - i - 1,
      h = (1 << u) - 1,
      f = h >> 1,
      c = 23 === i ? 5.960464477539062e-8 : 0,
      l = n ? 0 : o - 1,
      d = n ? 1 : -1,
      o = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = h) : (a = yr(mr(t) / Math.LN2), t * (n = vr(2, -a)) < 1 && (a--, n *= 2), 2 <= (t += 1 <= a + f ? c / n : c * vr(2, 1 - f)) * n && (a++, n /= 2), h <= a + f ? (s = 0, a = h) : 1 <= a + f ? (s = (t * n - 1) * vr(2, i), a += f) : (s = t * vr(2, f - 1) * vr(2, i), a = 0)); 8 <= i; e[r + l] = 255 & s, l += d, s /= 256, i -= 8);
    for (a = a << i | s, u += i; 0 < u; e[r + l] = 255 & a, l += d, a /= 256, u -= 8);
    e[r + l - d] |= 128 * o
  }

  function n() {
    return R.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
  }

  function i(e, t) {
    if (n() < t) throw new RangeError("Invalid typed array length");
    return R.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = R.prototype : (null === e && (e = new R(t)), e.length = t), e
  }

  function R(e, t, r) {
    if (!(R.TYPED_ARRAY_SUPPORT || this instanceof R)) return new R(e, t, r);
    if ("number" != typeof e) return a(this, e, t, r);
    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
    return c(this, e)
  }

  function a(e, t, r, n) {
    if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
    return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, r, n) {
      if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
      if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
      return t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n), R.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = R.prototype : e = l(e, t), e
    }(e, t, r, n) : "string" == typeof t ? function(e, t, r) {
      if ("string" == typeof r && "" !== r || (r = "utf8"), !R.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
      var n = 0 | g(t, r),
        r = (e = i(e, n)).write(t, r);
      return r !== n && (e = e.slice(0, r)), e
    }(e, t, r) : function(e, t) {
      if (p(t)) {
        var r = 0 | d(t.length);
        return 0 === (e = i(e, r)).length || t.copy(e, 0, 0, r), e
      }
      if (t) {
        if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function(e) {
          return e != e
        }(t.length) ? i(e, 0) : l(e, t);
        if ("Buffer" === t.type && Rr(t.data)) return l(e, t.data)
      }
      throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
    }(e, t)
  }

  function f(e) {
    if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
    if (e < 0) throw new RangeError('"size" argument must not be negative')
  }

  function c(e, t) {
    if (f(t), e = i(e, t < 0 ? 0 : 0 | d(t)), !R.TYPED_ARRAY_SUPPORT)
      for (var r = 0; r < t; ++r) e[r] = 0;
    return e
  }

  function l(e, t) {
    var r = t.length < 0 ? 0 : 0 | d(t.length);
    e = i(e, r);
    for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
    return e
  }

  function d(e) {
    if (e >= n()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n().toString(16) + " bytes");
    return 0 | e
  }

  function p(e) {
    return null != e && e._isBuffer
  }

  function g(e, t) {
    if (p(e)) return e.length;
    if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
    "string" != typeof e && (e = "" + e);
    var r = e.length;
    if (0 === r) return 0;
    for (var n = !1;;) switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;
      case "utf8":
      case "utf-8":
      case void 0:
        return O(e).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return 2 * r;
      case "hex":
        return r >>> 1;
      case "base64":
        return T(e).length;
      default:
        if (n) return O(e).length;
        t = ("" + t).toLowerCase(), n = !0
    }
  }

  function t(e, t, r) {
    var n, i, o, a = !1;
    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
    if ((r >>>= 0) <= (t >>>= 0)) return "";
    for (e = e || "utf8";;) switch (e) {
      case "hex":
        return function(e, t, r) {
          var n = e.length;
          (!t || t < 0) && (t = 0), (!r || r < 0 || n < r) && (r = n);
          for (var i = "", o = t; o < r; ++o) i += function(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
          }(e[o]);
          return i
        }(this, t, r);
      case "utf8":
      case "utf-8":
        return E(this, t, r);
      case "ascii":
        return function(e, t, r) {
          var n = "";
          r = gr(e.length, r);
          for (var i = t; i < r; ++i) n += pr(127 & e[i]);
          return n
        }(this, t, r);
      case "latin1":
      case "binary":
        return function(e, t, r) {
          var n = "";
          r = gr(e.length, r);
          for (var i = t; i < r; ++i) n += pr(e[i]);
          return n
        }(this, t, r);
      case "base64":
        return n = this, o = r, 0 === (i = t) && o === n.length ? s(n) : s(n.slice(i, o));
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return function(e, t, r) {
          for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += pr(n[o] + 256 * n[o + 1]);
          return i
        }(this, t, r);
      default:
        if (a) throw new TypeError("Unknown encoding: " + e);
        e = (e + "").toLowerCase(), a = !0
    }
  }

  function y(e, t, r) {
    var n = e[t];
    e[t] = e[r], e[r] = n
  }

  function m(e, t, r, n, i) {
    if (0 === e.length) return -1;
    if ("string" == typeof r ? (n = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
      if (i) return -1;
      r = e.length - 1
    } else if (r < 0) {
      if (!i) return -1;
      r = 0
    }
    if ("string" == typeof t && (t = R.from(t, n)), p(t)) return 0 === t.length ? -1 : v(e, t, r, n, i);
    if ("number" == typeof t) return t &= 255, R.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? (i ? Uint8Array.prototype.indexOf : Uint8Array.prototype.lastIndexOf).call(e, t, r) : v(e, [t], r, n, i);
    throw new TypeError("val must be string, number or Buffer")
  }

  function v(e, t, r, n, i) {
    function o(e, t) {
      return 1 === a ? e[t] : e.readUInt16BE(t * a)
    }
    var a = 1,
      s = e.length,
      u = t.length;
    if (void 0 !== n && ("ucs2" === (n = (n + "").toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
      if (e.length < 2 || t.length < 2) return -1;
      s /= a = 2, u /= 2, r /= 2
    }
    if (i) {
      for (var h = -1, f = r; f < s; f++)
        if (o(e, f) !== o(t, -1 === h ? 0 : f - h)) - 1 !== h && (f -= f - h), h = -1;
        else if (-1 === h && (h = f), f - h + 1 === u) return h * a
    } else
      for (s < r + u && (r = s - u), f = r; 0 <= f; f--) {
        for (var c = !0, l = 0; l < u; l++)
          if (o(e, f + l) !== o(t, l)) {
            c = !1;
            break
          } if (c) return f
      }
    return -1
  }

  function b(e, t, r, n) {
    return L(function(e) {
      for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
      return t
    }(t), e, r, n)
  }

  function w(e, t, r, n) {
    return L(function(e, t) {
      for (var r, n, i = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) n = e.charCodeAt(o), r = n >> 8, n = n % 256, i.push(n), i.push(r);
      return i
    }(t, e.length - r), e, r, n)
  }

  function E(e, t, r) {
    r = gr(e.length, r);
    for (var n = [], i = t; i < r;) {
      var o, a, s, u, h = e[i],
        f = null,
        c = 239 < h ? 4 : 223 < h ? 3 : 191 < h ? 2 : 1;
      i + c <= r && (1 === c ? h < 128 && (f = h) : 2 === c ? 128 != (192 & (o = e[i + 1])) || 127 < (u = (31 & h) << 6 | 63 & o) && (f = u) : 3 === c ? (o = e[i + 1], a = e[i + 2], 128 != (192 & o) || 128 != (192 & a) || 2047 < (u = (15 & h) << 12 | (63 & o) << 6 | 63 & a) && (u < 55296 || 57343 < u) && (f = u)) : 4 === c && (o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 != (192 & o) || 128 != (192 & a) || 128 != (192 & s) || 65535 < (u = (15 & h) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) && u < 1114112 && (f = u))), null === f ? (f = 65533, c = 1) : 65535 < f && (f -= 65536, n.push(55296 | 1023 & f >>> 10), f = 56320 | 1023 & f), n.push(f), i += c
    }
    return function(e) {
      var t = e.length;
      if (t <= 4096) return pr.apply(String, e);
      for (var r = "", n = 0; n < t;) r += pr.apply(String, e.slice(n, n += 4096));
      return r
    }(n)
  }

  function _(e, t, r) {
    if (0 != e % 1 || e < 0) throw new RangeError("offset is not uint");
    if (r < e + t) throw new RangeError("Trying to access beyond buffer length")
  }

  function k(e, t, r, n, i, o) {
    if (!p(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (i < t || t < o) throw new RangeError('"value" argument is out of bounds');
    if (r + n > e.length) throw new RangeError("Index out of range")
  }

  function S(e, t, r, n) {
    t < 0 && (t = 65535 + t + 1);
    for (var i = 0, o = gr(e.length - r, 2); i < o; ++i) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
  }

  function A(e, t, r, n) {
    t < 0 && (t = 4294967295 + t + 1);
    for (var i = 0, o = gr(e.length - r, 4); i < o; ++i) e[r + i] = 255 & t >>> 8 * (n ? i : 3 - i)
  }

  function x(e, t, r, n) {
    if (r + n > e.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range")
  }

  function I(e, t, r, n, i) {
    return i || x(e, 0, r, 4), o(e, t, r, n, 23, 4), r + 4
  }

  function C(e, t, r, n, i) {
    return i || x(e, 0, r, 8), o(e, t, r, n, 52, 8), r + 8
  }

  function O(e, t) {
    t = t || 1 / 0;
    for (var r, n = e.length, i = null, o = [], a = 0; a < n; ++a) {
      if (55295 < (r = e.charCodeAt(a)) && r < 57344) {
        if (!i) {
          if (56319 < r) {
            -1 < (t -= 3) && o.push(239, 191, 189);
            continue
          }
          if (a + 1 === n) {
            -1 < (t -= 3) && o.push(239, 191, 189);
            continue
          }
          i = r;
          continue
        }
        if (r < 56320) {
          -1 < (t -= 3) && o.push(239, 191, 189), i = r;
          continue
        }
        r = 65536 + (i - 55296 << 10 | r - 56320)
      } else i && -1 < (t -= 3) && o.push(239, 191, 189);
      if (i = null, r < 128) {
        if (--t < 0) break;
        o.push(r)
      } else if (r < 2048) {
        if ((t -= 2) < 0) break;
        o.push(192 | r >> 6, 128 | 63 & r)
      } else if (r < 65536) {
        if ((t -= 3) < 0) break;
        o.push(224 | r >> 12, 128 | 63 & r >> 6, 128 | 63 & r)
      } else {
        if (!(r < 1114112)) throw new Error("Invalid code point");
        if ((t -= 4) < 0) break;
        o.push(240 | r >> 18, 128 | 63 & r >> 12, 128 | 63 & r >> 6, 128 | 63 & r)
      }
    }
    return o
  }

  function T(e) {
    return function(e) {
      kr || u();
      var t, r, n, i, o = e.length;
      if (0 < o % 4) throw new Error("Invalid string. Length must be a multiple of 4");
      n = "=" === e[o - 2] ? 2 : "=" === e[o - 1] ? 1 : 0, i = new _r(3 * o / 4 - n), t = 0 < n ? o - 4 : o;
      for (var a = 0, s = 0; s < t; s += 4, 0) r = Er[e.charCodeAt(s)] << 18 | Er[e.charCodeAt(s + 1)] << 12 | Er[e.charCodeAt(s + 2)] << 6 | Er[e.charCodeAt(s + 3)], i[a++] = 255 & r >> 16, i[a++] = 255 & r >> 8, i[a++] = 255 & r;
      return 2 == n ? (r = Er[e.charCodeAt(s)] << 2 | Er[e.charCodeAt(s + 1)] >> 4, i[a++] = 255 & r) : 1 == n && (r = Er[e.charCodeAt(s)] << 10 | Er[e.charCodeAt(s + 1)] << 4 | Er[e.charCodeAt(s + 2)] >> 2, i[a++] = 255 & r >> 8, i[a++] = 255 & r), i
    }(function(e) {
      if ((e = ((t = e).trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")).replace(Ar, "")).length < 2) return "";
      for (var t; 0 != e.length % 4;) e += "=";
      return e
    }(e))
  }

  function L(e, t, r, n) {
    for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
    return i
  }

  function B(e) {
    return null != e && (!!e._isBuffer || j(e) || "function" == typeof(e = e).readFloatLE && "function" == typeof e.slice && j(e.slice(0, 0)))
  }

  function j(e) {
    return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
  }

  function e() {
    throw new Error("setTimeout has not been defined")
  }

  function U() {
    throw new Error("clearTimeout has not been defined")
  }

  function q(t) {
    if (xr === setTimeout) return setTimeout(t, 0);
    if ((xr === e || !xr) && setTimeout) return xr = setTimeout, setTimeout(t, 0);
    try {
      return xr(t, 0)
    } catch (e) {
      try {
        return xr.call(null, t, 0)
      } catch (e) {
        return xr.call(this, t, 0)
      }
    }
  }

  function M() {
    Tr && Cr && (Tr = !1, Cr.length ? Or = Cr.concat(Or) : Lr = -1, Or.length && P())
  }

  function P() {
    if (!Tr) {
      var e = q(M);
      Tr = !0;
      for (var t = Or.length; t;) {
        for (Cr = Or, Or = []; ++Lr < t;) Cr && Cr[Lr].run();
        Lr = -1, t = Or.length
      }
      Cr = null, Tr = !1,
        function(t) {
          if (Ir === clearTimeout) return clearTimeout(t);
          if ((Ir === U || !Ir) && clearTimeout) return Ir = clearTimeout, clearTimeout(t);
          try {
            Ir(t)
          } catch (e) {
            try {
              return Ir.call(null, t)
            } catch (e) {
              return Ir.call(this, t)
            }
          }
        }(e)
    }
  }

  function D(e) {
    var t = Array(arguments.length - 1);
    if (1 < arguments.length)
      for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
    Or.push(new z(e, t)), 1 !== Or.length || Tr || q(P)
  }

  function z(e, t) {
    this.fun = e, this.array = t
  }

  function N() {}

  function F(e, t) {
    return e(t = {
      exports: {}
    }, t.exports), t.exports
  }

  function Y() {}

  function K() {
    K.init.call(this)
  }

  function W(e) {
    return void 0 === e._maxListeners ? K.defaultMaxListeners : e._maxListeners
  }

  function J(e, t, r, n) {
    var i, o, a;
    if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');
    return (i = e._events) ? (i.newListener && (e.emit("newListener", t, r.listener || r), i = e._events), o = i[t]) : (i = e._events = new Y, e._eventsCount = 0), o ? ("function" == typeof o ? o = i[t] = n ? [r, o] : [o, r] : n ? o.unshift(r) : o.push(r), !o.warned && ((a = W(e)) && 0 < a && o.length > a) && (o.warned = !0, (a = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + t + " listeners added. Use emitter.setMaxListeners() to increase limit")).name = "MaxListenersExceededWarning", a.emitter = e, a.type = t, a.count = o.length, a = a, "function" == typeof console.warn ? console.warn(a) : console.log(a))) : (o = i[t] = r, ++e._eventsCount), e
  }

  function H(e, t, r) {
    function n() {
      e.removeListener(t, n), i || (i = !0, r.apply(e, arguments))
    }
    var i = !1;
    return n.listener = r, n
  }

  function G(e) {
    var t = this._events;
    if (t) {
      e = t[e];
      if ("function" == typeof e) return 1;
      if (e) return e.length
    }
    return 0
  }

  function $(e, t) {
    for (var r = Array(t); t--;) r[t] = e[t];
    return r
  }

  function X(e) {
    if (!fe(e)) {
      for (var t = [], r = 0; r < arguments.length; r++) t.push(Q(arguments[r]));
      return t.join(" ")
    }
    for (var r = 1, n = arguments, i = n.length, o = (e + "").replace(Nr, function(e) {
        if ("%%" === e) return "%";
        if (i <= r) return e;
        switch (e) {
          case "%s":
            return n[r++] + "";
          case "%d":
            return +n[r++];
          case "%j":
            try {
              return JSON.stringify(n[r++])
            } catch (e) {
              return "[Circular]"
            }
            default:
              return e
        }
      }), a = n[r]; r < i; a = n[++r]) o += se(a) || !pe(a) ? " " + a : " " + Q(a);
    return o
  }

  function V(e, t) {
    if (le(br.process)) return function() {
      return V(e, t).apply(this, arguments)
    };
    if (!0 === Mr.noDeprecation) return e;
    var r = !1;
    return function() {
      if (!r) {
        if (Mr.throwDeprecation) throw new Error(t);
        Mr.traceDeprecation ? console.trace(t) : console.error(t), r = !0
      }
      return e.apply(this, arguments)
    }
  }

  function Z(t) {
    return le(Dr) && (Dr = Mr.env.NODE_DEBUG || ""), t = t.toUpperCase(), Fr[t] || (new RegExp("\\b" + t + "\\b", "i").test(Dr) ? Fr[t] = function() {
      var e = X.apply(null, arguments);
      console.error("%s %d: %s", t, 0, e)
    } : Fr[t] = function() {}), Fr[t]
  }

  function Q(e, t) {
    var r = {
      seen: [],
      stylize: te
    };
    return 3 <= arguments.length && (r.depth = arguments[2]), 4 <= arguments.length && (r.colors = arguments[3]), ae(t) ? r.showHidden = t : t && ke(r, t), le(r.showHidden) && (r.showHidden = !1), le(r.depth) && (r.depth = 2), le(r.colors) && (r.colors = !1), le(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = ee), re(r, e, r.depth)
  }

  function ee(e, t) {
    t = Q.styles[t];
    return t ? "[" + Q.colors[t][0] + "m" + e + "[" + Q.colors[t][1] + "m" : e
  }

  function te(e) {
    return e
  }

  function re(t, r, n) {
    if (t.customInspect && r && me(r.inspect) && r.inspect !== Q && (!r.constructor || r.constructor.prototype !== r)) {
      var e = r.inspect(n, t);
      return fe(e) || (e = re(t, e, n)), e
    }
    var i = function(e, t) {
      if (le(t)) return e.stylize("undefined", "undefined");
      if (fe(t)) {
        var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return e.stylize(r, "string")
      }
      return he(t) ? e.stylize("" + t, "number") : ae(t) ? e.stylize("" + t, "boolean") : se(t) ? e.stylize("null", "null") : void 0
    }(t, r);
    if (i) return i;
    var o, a = Object.keys(r),
      s = (o = {}, a.forEach(function(e) {
        o[e] = !0
      }), o);
    if (t.showHidden && (a = Object.getOwnPropertyNames(r)), ye(r) && (0 <= a.indexOf("message") || 0 <= a.indexOf("description"))) return ne(r);
    if (0 === a.length) {
      if (me(r)) {
        var u = r.name ? ": " + r.name : "";
        return t.stylize("[Function" + u + "]", "special")
      }
      if (de(r)) return t.stylize(RegExp.prototype.toString.call(r), "regexp");
      if (ge(r)) return t.stylize(Date.prototype.toString.call(r), "date");
      if (ye(r)) return ne(r)
    }
    var h = "",
      f = !1,
      e = ["{", "}"];
    return oe(r) && (f = !0, e = ["[", "]"]), me(r) && (h = " [Function" + (r.name ? ": " + r.name : "") + "]"), de(r) && (h = " " + RegExp.prototype.toString.call(r)), ge(r) && (h = " " + Date.prototype.toUTCString.call(r)), ye(r) && (h = " " + ne(r)), 0 !== a.length || f && 0 != r.length ? n < 0 ? de(r) ? t.stylize(RegExp.prototype.toString.call(r), "regexp") : t.stylize("[Object]", "special") : (t.seen.push(r), i = f ? function(t, r, n, i, e) {
      for (var o = [], a = 0, s = r.length; a < s; ++a) Se(r, a + "") ? o.push(ie(t, r, n, i, a + "", !0)) : o.push("");
      return e.forEach(function(e) {
        e.match(/^\d+$/) || o.push(ie(t, r, n, i, e, !0))
      }), o
    }(t, r, n, s, a) : a.map(function(e) {
      return ie(t, r, n, s, e, f)
    }), t.seen.pop(), u = h, a = e, 60 < (i = i).reduce(function(e, t) {
      return t.indexOf("\n"), e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
    }, 0) ? a[0] + ("" === u ? "" : u + "\n ") + " " + i.join(",\n  ") + " " + a[1] : a[0] + u + " " + i.join(", ") + " " + a[1]) : e[0] + h + e[1]
  }

  function ne(e) {
    return "[" + Error.prototype.toString.call(e) + "]"
  }

  function ie(e, t, r, n, i, o) {
    var a, s, t = Object.getOwnPropertyDescriptor(t, i) || {
      value: t[i]
    };
    if (t.get ? s = t.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : t.set && (s = e.stylize("[Setter]", "special")), Se(n, i) || (a = "[" + i + "]"), s || (e.seen.indexOf(t.value) < 0 ? -1 < (s = se(r) ? re(e, t.value, null) : re(e, t.value, r - 1)).indexOf("\n") && (s = o ? s.split("\n").map(function(e) {
        return "  " + e
      }).join("\n").substr(2) : "\n" + s.split("\n").map(function(e) {
        return "   " + e
      }).join("\n")) : s = e.stylize("[Circular]", "special")), le(a)) {
      if (o && i.match(/^\d+$/)) return s;
      a = (a = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), e.stylize(a, "string"))
    }
    return a + ": " + s
  }

  function oe(e) {
    return Array.isArray(e)
  }

  function ae(e) {
    return "boolean" == typeof e
  }

  function se(e) {
    return null === e
  }

  function ue(e) {
    return null == e
  }

  function he(e) {
    return "number" == typeof e
  }

  function fe(e) {
    return "string" == typeof e
  }

  function ce(e) {
    return "symbol" == typeof e
  }

  function le(e) {
    return void 0 === e
  }

  function de(e) {
    return pe(e) && "[object RegExp]" === we(e)
  }

  function pe(e) {
    return "object" == typeof e && null !== e
  }

  function ge(e) {
    return pe(e) && "[object Date]" === we(e)
  }

  function ye(e) {
    return pe(e) && ("[object Error]" === we(e) || e instanceof Error)
  }

  function me(e) {
    return "function" == typeof e
  }

  function ve(e) {
    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
  }

  function be(e) {
    return B(e)
  }

  function we(e) {
    return Object.prototype.toString.call(e)
  }

  function Ee(e) {
    return e < 10 ? "0" + e.toString(10) : e.toString(10)
  }

  function _e() {
    var e, t;
    console.log("%s - %s", (e = new Date, t = [Ee(e.getHours()), Ee(e.getMinutes()), Ee(e.getSeconds())].join(":"), [e.getDate(), Yr[e.getMonth()], t].join(" ")), X.apply(null, arguments))
  }

  function ke(e, t) {
    if (!t || !pe(t)) return e;
    for (var r = Object.keys(t), n = r.length; n--;) e[r[n]] = t[r[n]];
    return e
  }

  function Se(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }

  function Re() {
    this.head = null, this.tail = null, this.length = 0
  }

  function Ae(e) {
    switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), function(e) {
        if (e && !Jr(e)) throw new Error("Unknown encoding: " + e)
      }(e), this.encoding) {
      case "utf8":
        this.surrogateSize = 3;
        break;
      case "ucs2":
      case "utf16le":
        this.surrogateSize = 2, this.detectIncompleteChar = Ie;
        break;
      case "base64":
        this.surrogateSize = 3, this.detectIncompleteChar = Ce;
        break;
      default:
        return void(this.write = xe)
    }
    this.charBuffer = new R(6), this.charReceived = 0, this.charLength = 0
  }

  function xe(e) {
    return e.toString(this.encoding)
  }

  function Ie(e) {
    this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0
  }

  function Ce(e) {
    this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0
  }

  function Oe(e, t) {
    e = e || {}, this.objectMode = !!e.objectMode, t instanceof rt && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var r = e.highWaterMark,
      t = this.objectMode ? 16 : 16384;
    this.highWaterMark = r || 0 === r ? r : t, this.highWaterMark = ~~this.highWaterMark, this.buffer = new Re, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (this.decoder = new Ae(e.encoding), this.encoding = e.encoding)
  }

  function Te(e) {
    return this instanceof Te ? (this._readableState = new Oe(e, this), this.readable = !0, e && "function" == typeof e.read && (this._read = e.read), void K.call(this)) : new Te(e)
  }

  function Le(e, t, r, n, i) {
    var o, a, s, u, h, h = (s = t, u = null, B(h = r) || "string" == typeof h || null == h || s.objectMode || (u = new TypeError("Invalid non-string/buffer chunk")), u);
    return h ? e.emit("error", h) : null === r ? (t.reading = !1, s = e, (u = t).ended || (!u.decoder || (h = u.decoder.end()) && h.length && (u.buffer.push(h), u.length += u.objectMode ? 1 : h.length), u.ended = !0, je(s))) : t.objectMode || r && 0 < r.length ? t.ended && !i ? (o = new Error("stream.push() after EOF"), e.emit("error", o)) : t.endEmitted && i ? (o = new Error("stream.unshift() after end event"), e.emit("error", o)) : (!t.decoder || i || n || (r = t.decoder.write(r), a = !t.objectMode && 0 === r.length), i || (t.reading = !1), a || (t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && je(e))), r = e, (e = t).readingMore || (e.readingMore = !0, D(qe, r, e))) : i || (t.reading = !1), !(t = t).ended && (t.needReadable || t.length < t.highWaterMark || 0 === t.length)
  }

  function Be(e, t) {
    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e == e ? (e > t.highWaterMark && (t.highWaterMark = (8388608 <= (r = e) ? r = 8388608 : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0)) : (t.flowing && t.length ? t.buffer.head.data : t).length;
    var r
  }

  function je(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (Hr("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? D(Ue, e) : Ue(e))
  }

  function Ue(e) {
    Hr("emit readable"), e.emit("readable"), De(e)
  }

  function qe(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (Hr("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
    t.readingMore = !1
  }

  function Me(e) {
    Hr("readable nexttick read 0"), e.read(0)
  }

  function Pe(e, t) {
    t.reading || (Hr("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), De(e), t.flowing && !t.reading && e.read(0)
  }

  function De(e) {
    var t = e._readableState;
    for (Hr("flow", t.flowing); t.flowing && null !== e.read(););
  }

  function ze(e, t) {
    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : (n = e, e = t.buffer, t = t.decoder, n < e.head.data.length ? (i = e.head.data.slice(0, n), e.head.data = e.head.data.slice(n)) : i = n === e.head.data.length ? e.shift() : (t ? function(e, t) {
      var r = t.head,
        n = 1,
        i = r.data;
      for (e -= i.length; r = r.next;) {
        var o = r.data,
          a = e > o.length ? o.length : e;
        if (i += a === o.length ? o : o.slice(0, e), 0 === (e -= a)) {
          a === o.length ? (++n, t.head = r.next || (t.tail = null)) : (t.head = r).data = o.slice(a);
          break
        }++n
      }
      return t.length -= n, i
    } : function(e, t) {
      var r = R.allocUnsafe(e),
        n = t.head,
        i = 1;
      for (n.data.copy(r), e -= n.data.length; n = n.next;) {
        var o = n.data,
          a = e > o.length ? o.length : e;
        if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
          a === o.length ? (++i, t.head = n.next || (t.tail = null)) : (t.head = n).data = o.slice(a);
          break
        }++i
      }
      return t.length -= i, r
    })(n, e), r = i), r);
    var r, n, i
  }

  function Ne(e) {
    var t = e._readableState;
    if (0 < t.length) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, D(Fe, t, e))
  }

  function Fe(e, t) {
    e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"))
  }

  function Ye(e, t) {
    for (var r = 0, n = e.length; r < n; r++)
      if (e[r] === t) return r;
    return -1
  }

  function Ke() {}

  function We(e, t, r) {
    this.chunk = e, this.encoding = t, this.callback = r, this.next = null
  }

  function Je(e, o) {
    Object.defineProperty(this, "buffer", {
      get: V(function() {
        return this.getBuffer()
      }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
    }), e = e || {}, this.objectMode = !!e.objectMode, o instanceof rt && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var t = e.highWaterMark,
      r = this.objectMode ? 16 : 16384;
    this.highWaterMark = t || 0 === t ? t : r, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1;
    r = (this.finished = !1) === e.decodeStrings;
    this.decodeStrings = !r, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
      var t, r, i, n;
      r = e, i = (t = o)._writableState, n = i.sync, e = i.writecb,
        function(e) {
          e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
        }(i), r ? function(e, t, r, n) {
          --i.pendingcb, t ? D(n, r) : n(r), e._writableState.errorEmitted = !0, e.emit("error", r)
        }(t, n, r, e) : ((r = Ze(i)) || i.corked || i.bufferProcessing || !i.bufferedRequest || Ve(t, i), n ? D(Xe, t, i, r, e) : Xe(t, i, r, e))
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new tt(this)
  }

  function He(e) {
    return this instanceof He || this instanceof rt ? (this._writableState = new Je(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev)), void K.call(this)) : new He(e)
  }

  function Ge(e, t, r, n, i) {
    a = r, s = n, (o = t).objectMode || !1 === o.decodeStrings || "string" != typeof a || (a = R.from(a, s)), R.isBuffer(r = a) && (n = "buffer");
    var o = t.objectMode ? 1 : r.length;
    t.length += o;
    var a, s = t.length < t.highWaterMark;
    return s || (t.needDrain = !0), t.writing || t.corked ? (a = t.lastBufferedRequest, t.lastBufferedRequest = new We(r, n, i), a ? a.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1) : $e(e, t, !1, o, r, n, i), s
  }

  function $e(e, t, r, n, i, o, a) {
    t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1
  }

  function Xe(e, t, r, n) {
    var i;
    r || (i = e, 0 === (r = t).length && r.needDrain && (r.needDrain = !1, i.emit("drain"))), t.pendingcb--, n(), et(e, t)
  }

  function Ve(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var n = t.bufferedRequestCount,
        i = Array(n),
        n = t.corkedRequestsFree;
      n.entry = r;
      for (var o = 0; r;) r = (i[o] = r).next, o += 1;
      $e(e, t, !0, t.length, i, "", n.finish), t.pendingcb++, t.lastBufferedRequest = null, n.next ? (t.corkedRequestsFree = n.next, n.next = null) : t.corkedRequestsFree = new tt(t)
    } else {
      for (; r;) {
        var a = r.chunk,
          s = r.encoding,
          u = r.callback;
        if ($e(e, t, !1, t.objectMode ? 1 : a.length, a, s, u), r = r.next, t.writing) break
      }
      null === r && (t.lastBufferedRequest = null)
    }
    t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1
  }

  function Ze(e) {
    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
  }

  function Qe(e, t) {
    t.prefinished || (t.prefinished = !0, e.emit("prefinish"))
  }

  function et(e, t) {
    var r = Ze(t);
    return r && (0 === t.pendingcb ? (Qe(e, t), t.finished = !0, e.emit("finish")) : Qe(e, t)), r
  }

  function tt(n) {
    var i = this;
    this.next = null, this.entry = null, this.finish = function(e) {
      var t = i.entry;
      for (i.entry = null; t;) {
        var r = t.callback;
        n.pendingcb--, r(e), t = t.next
      }
      n.corkedRequestsFree ? n.corkedRequestsFree.next = i : n.corkedRequestsFree = i
    }
  }

  function rt(e) {
    return this instanceof rt ? (Te.call(this, e), He.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), void this.once("end", nt)) : new rt(e)
  }

  function nt() {
    this.allowHalfOpen || this._writableState.ended || D(it, this)
  }

  function it(e) {
    e.end()
  }

  function ot(r) {
    this.afterTransform = function(e, t) {
      return function(e, t, r) {
        var n = e._transformState;
        n.transforming = !1;
        var i = n.writecb;
        if (!i) return e.emit("error", new Error("no writecb in Transform class"));
        n.writechunk = null, (n.writecb = null) !== r && void 0 !== r && e.push(r), i(t);
        t = e._readableState;
        t.reading = !1, (t.needReadable || t.length < t.highWaterMark) && e._read(t.highWaterMark)
      }(r, e, t)
    }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
  }

  function at(e) {
    if (!(this instanceof at)) return new at(e);
    rt.call(this, e), this._transformState = new ot(this);
    var t = this;
    this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.once("prefinish", function() {
      "function" == typeof this._flush ? this._flush(function(e) {
        st(t, e)
      }) : st(t)
    })
  }

  function st(e, t) {
    if (t) return e.emit("error", t);
    var r = e._writableState,
      t = e._transformState;
    if (r.length) throw new Error("Calling transform done when ws.length != 0");
    if (t.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null)
  }

  function ut(e) {
    return this instanceof ut ? void at.call(this, e) : new ut(e)
  }

  function ht() {
    K.call(this)
  }

  function ft(e, t) {
    if (e.forEach) return e.forEach(t);
    for (var r = 0; r < e.length; r++) t(e[r], r)
  }

  function ct(e, t) {
    var r, n = [];
    e.on("data", function(e) {
      n.push(e)
    }), e.on("end", function() {
      r || (r = !0, t(null, R.concat(n)))
    }), e.on("error", function(e) {
      r || (r = !0, t(e))
    })
  }

  function lt(r) {
    var n;
    return en(function(e) {
      n && (e = R.concat([n, e]));
      var t = yr(e.length / r) * r;
      t ? e.length > t ? (n = e.slice(t), this.emit("data", e.slice(0, t))) : (n = void 0, this.emit("data", e)) : n = n ? R.concat([n, e]) : e
    }, function() {
      n && this.emit("data", n), this.emit("end")
    })
  }

  function dt(e) {
    return (dt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
      return typeof e
    } : function(e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
  }

  function pt(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }

  function gt(e, t) {
    for (var r, n = 0; n < t.length; n++)(r = t[n]).enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
  }

  function yt(e, t, r) {
    return t && gt(e.prototype, t), r && gt(e, r), e
  }

  function mt(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
    e.prototype = Object.create(t && t.prototype, {
      constructor: {
        value: e,
        writable: !0,
        configurable: !0
      }
    }), t && bt(e, t)
  }

  function vt(e) {
    return (vt = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
      return e.__proto__ || Object.getPrototypeOf(e)
    })(e)
  }

  function bt(e, t) {
    return (bt = Object.setPrototypeOf || function(e, t) {
      return e.__proto__ = t, e
    })(e, t)
  }

  function wt(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e
  }

  function Et(r) {
    var n = function() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
      } catch (e) {
        return !1
      }
    }();
    return function() {
      var e, t = vt(r);
      return e = n ? (e = vt(this).constructor, Reflect.construct(t, arguments, e)) : t.apply(this, arguments), t = this, !(e = e) || "object" != typeof e && "function" != typeof e ? wt(t) : e
    }
  }

  function _t(e, t) {
    return function(e) {
      if (Array.isArray(e)) return e
    }(e) || function(e, t) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) {
        var r = [],
          n = !0,
          i = !1,
          o = void 0;
        try {
          for (var a, s = e[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !t || r.length !== t); n = !0);
        } catch (e) {
          i = !0, o = e
        } finally {
          try {
            n || null == s.return || s.return()
          } finally {
            if (i) throw o
          }
        }
        return r
      }
    }(e, t) || kt(e, t) || function() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
  }

  function kt(e, t) {
    if (e) {
      if ("string" == typeof e) return St(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? St(e, t) : void 0
    }
  }

  function St(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
    return n
  }

  function Rt(e, t) {
    var r;
    if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
      if (Array.isArray(e) || (r = kt(e)) || t && e && "number" == typeof e.length) {
        r && (e = r);
        var n = 0,
          t = function() {};
        return {
          s: t,
          n: function() {
            return n >= e.length ? {
              done: !0
            } : {
              done: !1,
              value: e[n++]
            }
          },
          e: function(e) {
            throw e
          },
          f: t
        }
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    var i, o = !0,
      a = !1;
    return {
      s: function() {
        r = e[Symbol.iterator]()
      },
      n: function() {
        var e = r.next();
        return o = e.done, e
      },
      e: function(e) {
        a = !0, i = e
      },
      f: function() {
        try {
          o || null == r.return || r.return()
        } finally {
          if (a) throw i
        }
      }
    }
  }

  function At(e) {
    return "string" == typeof e ? It(e) : e
  }

  function xt(e) {
    return e.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  }

  function It(e) {
    return R.from(e, "base64")
  }

  function Ct(e) {
    return new pn(Lt(e).slice(0, 16))
  }

  function Ot(t) {
    var e = (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}).start || 0;
    if (0 !== e) throw Error("Encryption cannot start midstream otherwise MAC verification will fail.");
    (t = (t = At(t)) || cn(24)) instanceof R || (t = R.from(t));
    var r = en(function(e) {
      i.encrypt(e), this.emit("data", e)
    }, function() {
      var e = i.condensedMac();
      r.key = function(e, t) {
        var r = R.alloc(32);
        e.copy(r), t.copy(r, 24);
        for (var n = 0; n < 16; n++) r.writeUInt8(r.readUInt8(n) ^ r.readUInt8(16 + n), n);
        return r
      }(t, e), this.emit("end")
    });
    if (24 !== t.length) return D(function() {
      r.emit("error", Error("Wrong key length. Key must be 192bit."))
    });
    var n = new pn(t.slice(0, 16)),
      i = new gn(n, t.slice(16), e);
    return r = Zr(lt(16), r)
  }

  function Tt(e) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
      r = t.start || 0;
    if (0 !== r && (t.disableVerification = !0), 0 != r % 16) throw Error("start argument of megaDecrypt must be a multiple of 16");
    e = At(e);
    var n = en(function(e) {
        o.decrypt(e), this.emit("data", e)
      }, function() {
        return o.condensedMac().equals(e.slice(24)) || t.disableVerification ? void this.emit("end") : this.emit("error", Error("MAC verification failed"))
      }),
      i = Ct(e),
      o = new gn(i, e.slice(16), r);
    return n = Zr(lt(16), n)
  }

  function Lt(e) {
    var t = R.alloc(32);
    e.copy(t);
    for (var r = 0; r < 16; r++) t.writeUInt8(t.readUInt8(r) ^ t.readUInt8(16 + r, !0), r);
    return t
  }

  function Bt(e) {
    for (var t = []; 0 < e--;) t[e] = 0;
    return t
  }

  function jt(e) {
    var t = e.length;
    if (e[t - 1]) return e;
    for (; 1 < t && 0 === e[t - 1];) t--;
    return e.slice(0, t)
  }

  function Ut(e, t) {
    var r = e.length,
      n = t.length;
    if (r < n) return [];
    if (n === r) {
      if (t[n - 1] > e[n - 1]) return [];
      if (1 === n) return [e[0] - t[0]]
    }
    for (var i = [], o = 0, a = 0; a < n; a++) o += e[a] - t[a], i[a] = 268435455 & o, o >>= 28;
    for (; a < r; a++) o += e[a], i[a] = 268435455 & o, o >>= 28;
    return o ? [] : jt(i)
  }

  function qt(e, t, r, n, i) {
    var o = 16383 & r,
      a = r >> 14,
      s = 16383 & n,
      r = n >> 14,
      n = a * s + r * o,
      s = o * s + ((16383 & n) << 14) + e[t] + i;
    return e[t] = 268435455 & s, i = a * r + (n >> 14) + (s >> 28)
  }

  function Mt(e, t) {
    for (var r, n, i = e.length, o = t.length, a = Bt(i + o - 1), s = 0; s < o; s++) {
      for (n = r = 0; n < i; n++) r = qt(a, s + n, e[n], t[s], r);
      a[s + i] = r
    }
    return jt(a)
  }

  function Pt(e, t, r) {
    for (var n = 0; 0 <= t && 0 < r--;) n = 268435456 * n + e[t--];
    return n
  }

  function Dt(e, t) {
    var r, n, i = e.length - 1,
      o = t.length - 1,
      a = i - o;
    if (i < o || i === o && (e[i] < t[i] || 0 < i && e[i] === t[i] && e[i - 1] < t[i - 1])) return yn.q = [0], yn.mod = e, yn;
    if (i === o && Pt(e, o, 2) / Pt(t, o, 2) < 4) {
      for (h = e.concat(), r = 0; 0 !== (n = Ut(h, t)).length;) h = n, r++;
      return yn.q = [r], yn.mod = h, yn
    }
    var s = yr(mr(t[o]) / mn) + 1,
      u = 28 - s,
      h = e.concat(),
      f = t.concat();
    if (u) {
      for (m = o; 0 < m; m--) f[m] = 268435455 & f[m] << u | f[m - 1] >> s;
      for (f[0] = 268435455 & f[0] << u, 268435455 & h[i] & 268435455 << s && (h[++i] = 0, a++), m = i; 0 < m; m--) h[m] = 268435455 & h[m] << u | h[m - 1] >> s;
      h[0] = 268435455 & h[0] << u
    }
    for (var c, l = Bt(a + 1), d = Bt(a).concat(f); 0 !== (c = Ut(h, d)).length;) l[a]++, h = c;
    for (var p, g = f[o], y = Pt(f, o, 2), m = i; o < m; m--) {
      l[p = m - o - 1] = m >= h.length ? 1 : h[m] === g ? 268435455 : yr(Pt(h, m, 2) / g);
      for (var v = Pt(h, m, 3); l[p] * y > v;) l[p]--;
      d = d.slice(1), 0 === (c = Ut(h, Mt([l[p]], d))).length && (l[p]--, c = Ut(h, Mt([l[p]], d))), h = c
    }
    if (u) {
      for (m = 0; m < h.length - 1; m++) h[m] = h[m] >> u | 268435455 & h[m + 1] << s;
      h[h.length - 1] >>= u
    }
    return yn.q = jt(l), yn.mod = jt(h), yn
  }

  function zt(e, t) {
    if (1 === t.length) {
      if (1 === e.length) return [e[0] % t[0]];
      if (t[0] < 16383) return [function(e, t) {
        for (var r, n = 0, i = e.length - 1; 0 <= i; i--) n = ((16383 & (r = e[i])) + ((n = ((r >> 14) + (n << 14)) % t) << 14)) % t;
        return n
      }(e, t[0])]
    }
    return Dt(e, t).mod
  }

  function Nt(e, t, r) {
    var n = e.length - (t.length << 1);
    if (0 < n) return Nt(e.slice(0, n).concat(Nt(e.slice(n), t, r)), t, r);
    var i, o = t.length + 1,
      n = t.length - 1,
      n = Mt(e.slice(n), r).slice(o),
      e = e.slice(0, o),
      n = Mt(n, t).slice(0, o),
      a = Ut(e, n);
    0 === a.length && (e[o] = 1, a = Ut(e, n));
    for (var s = 0; 0 !== (i = Ut(a, t)).length; s++)
      if (a = i, 3 <= s) return Nt(a, t, r);
    return a
  }

  function Ft(e, t, r) {
    var n, i, o, a = e.concat(),
      s = t.length - 1,
      u = 2 * r.length,
      h = Bt(u + 1);
    for (h[u] = 1, h = Dt(h, r).q, n = t[s], o = 1, 0 != (i = n >>> 16) && (n = i, o += 16), 0 != (i = n >> 8) && (n = i, o += 8), 0 != (i = n >> 4) && (n = i, o += 4), 0 != (i = n >> 2) && (n = i, o += 2), 0 != (i = n >> 1) && (n = i, o += 1), u = o - 2; 0 <= s; s--) {
      for (; 0 <= u; --u) a = Nt(function(e) {
        for (var t, r = e.length, n = Bt(2 * r), i = 0, o = 0; o < r; o++) {
          for (i = qt(n, 2 * o, e[o], e[o], 0), t = o + 1; t < r; t++) i = qt(n, o + t, 2 * e[t], e[o], i);
          n[o + r] = i
        }
        return jt(n)
      }(a), r, h), t[s] & 1 << u && (a = Nt(Mt(a, e), r, h));
      u = 27
    }
    return a
  }

  function Yt(e, t, r, n, i) {
    var o = Ft(zt(e, r), zt(t, Ut(r, [1])), r),
      e = Ft(zt(e, n), zt(t, Ut(n, [1])), n),
      t = 0 === (t = Ut(e, o)).length ? (t = Ut(o, e), Ut(n, t = zt(Mt(t, i), n))) : zt(Mt(t, i), n);
    return function e(t, r) {
      var n = t.length,
        i = r.length;
      if (n < i) return e(r, t);
      for (var o = [], a = 0, s = 0; s < i; s++) a += t[s] + r[s], o[s] = 268435455 & a, a >>>= 28;
      for (; s < n; s++) a += t[s], o[s] = 268435455 & a, a >>>= 28;
      return a && (o[s] = a), o
    }(Mt(t, r), o)
  }

  function Kt(e) {
    var t, r = 1,
      n = [0],
      i = 0,
      o = 256,
      a = e.length;
    if (a < 2) return 0;
    var s = 8 * (a - 2),
      u = 256 * e.charCodeAt(0) + e.charCodeAt(1);
    if (s < u || u < s - 8) return 0;
    for (var h = 0; h < s; h++) 255 < (o <<= 1) && (o = 1, t = e.charCodeAt(--a)), 268435455 < r && (r = 1, n[++i] = 0), t & o && (n[i] |= r), r <<= 1;
    return n
  }

  function Wt(e, t) {
    t = function(e) {
      for (var t = 1, r = 0, n = [0], i = 1, o = 0, a = 28 * e.length, s = "", u = 0; u < a; u++) e[r] & t && (n[o] |= i), 255 < (i <<= 1) && (i = 1, n[++o] = 0), 268435455 < (t <<= 1) && (t = 1, r++);
      for (; 0 <= o && 0 === n[o];) o--;
      for (u = 0; u <= o; u++) s = pr(n[u]) + s;
      return s
    }(Yt(Kt(e.toString("binary")), t[2], t[0], t[1], t[3]));
    return R.from(t, "binary")
  }

  function Jt(e, t) {
    if (!e) throw Error("No options given");
    var r = e.onResponse;
    if ((e = "string" == typeof e ? {
        uri: e
      } : JSON.parse(JSON.stringify(e))).onResponse = r, e.verbose && (Jt.log = function() {
        var e, t, r = {},
          n = ["trace", "debug", "info", "warn", "error"];
        for (t = 0; t < n.length; t++) r[e = n[t]] = Ht, "undefined" != typeof console && console && console[e] && (r[e] = function(r, n) {
          return function(e, t) {
            return "object" === dt(t) && (e += " " + JSON.stringify(t)), r[n](e)
          }
        }(console, e));
        return r
      }()), e.url && (e.uri = e.url, delete e.url), !e.uri && "" !== e.uri) throw Error("options.uri is a required argument");
    if ("string" != typeof e.uri) throw Error("options.uri must be a string");
    for (var n = ["proxy", "_redirectsFollowed", "maxRedirects", "followRedirect"], i = 0; i < n.length; i++)
      if (e[n[i]]) throw Error("options." + n[i] + " is not supported");
    if (e.callback = t || Ht, e.method = e.method || "GET", e.headers = e.headers || {}, e.body = e.body || null, e.timeout = e.timeout || Jt.DEFAULT_TIMEOUT, e.headers.host) throw Error("Options.headers.host is not supported");
    e.json && (e.headers.accept = e.headers.accept || "application/json", "GET" !== e.method && (e.headers["content-type"] = "application/json"), "boolean" == typeof e.json ? "string" != typeof e.body && (e.body = JSON.stringify(e.body)) : e.body = JSON.stringify(e.json));

    function o(e) {
      var t, r = [];
      for (t in e) e.hasOwnProperty(t) && r.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
      return r.join("&")
    }
    e.qs && (r = "string" == typeof e.qs ? e.qs : o(e.qs), e.uri = -1 === e.uri.indexOf("?") ? e.uri + "?" + r : e.uri + "&" + r);
    if (e.form) {
      if ("string" == typeof e.form) throw Error("form name unsupported");
      if ("POST" === e.method) {
        var a = (e.encoding || "application/x-www-form-urlencoded").toLowerCase();
        switch (e.headers["content-type"] = a) {
          case "application/x-www-form-urlencoded":
            e.body = o(e.form).replace(/%20/g, "+");
            break;
          case "multipart/form-data":
            var s = function(e) {
              var t, r = {
                  boundry: "-------------------------------" + yr(1e9 * Math.random())
                },
                n = [];
              for (t in e) e.hasOwnProperty(t) && n.push("--" + r.boundry + '\nContent-Disposition: form-data; name="' + t + '"\n\n' + e[t] + "\n");
              return n.push("--" + r.boundry + "--"), r.body = n.join(""), r.length = r.body.length, r.type = "multipart/form-data; boundary=" + r.boundry, r
            }(e.form);
            e.body = s.body, e.headers["content-type"] = s.type;
            break;
          default:
            throw Error("unsupported encoding:" + a)
        }
      }
    }
    return e.onResponse = e.onResponse || Ht, !0 === e.onResponse && (e.onResponse = t, e.callback = Ht), !e.headers.authorization && e.auth && (e.headers.authorization = "Basic " + R.from(e.auth.username + ":" + e.auth.password, "utf-8").toString("base64")), ("function" != typeof fetch || "function" != typeof ReadableStream && vn.XMLHttpRequest ? function(t) {
      function r() {
        if (!u.response) {
          if (u.response = !0, Jt.log.debug("Got response", {
              id: i.id,
              status: i.status
            }), clearTimeout(i.timeoutTimer), i.statusCode = i.status, o && 0 === i.statusCode) {
            var e = new Error("CORS request rejected: " + t.uri);
            return e.cors = "rejected", u.loading = !0, u.end = !0, h.emit("error", e), t.callback(e, i)
          }
          t.onResponse(null, i)
        }
      }

      function n() {
        var e;
        i.response && (e = i.responseText.substr(s), s += e.length, 0 < e.length && h.push(R.from(e, "ascii"))), u.loading || (u.loading = !0, Jt.log.debug("Response body loading", {
          id: i.id
        }))
      }
      var i = new vn.XMLHttpRequest,
        o = function(e) {
          var t, r = /^([\w+.-]+:)(?:\/\/([^/?#:]*)(?::(\d+))?)?/;
          try {
            t = vn.location.href
          } catch (r) {
            (t = document.createElement("a")).href = "", t = t.href
          }
          var n = r.exec(t.toLowerCase()) || [],
            e = r.exec(e.toLowerCase());
          return !(!e || e[1] === n[1] && e[2] === n[2] && (e[3] || ("http:" === e[1] ? 80 : 443)) === (n[3] || ("http:" === n[1] ? 80 : 443)))
        }(t.uri),
        e = "withCredentials" in i,
        a = !1,
        s = 0;
      if (En += 1, i.seq_id = En, i.id = En + ": " + t.method + " " + t.uri, i._id = i.id, o && !e) {
        e = new Error("Browser does not support cross-origin request: " + t.uri);
        return e.cors = "unsupported", t.callback(e, i)
      }
      i.timeoutTimer = setTimeout(function() {
        a = !0;
        var e = new Error("ETIMEDOUT");
        return e.code = "ETIMEDOUT", e.duration = t.timeout, Jt.log.error("Timeout", {
          id: i._id,
          milliseconds: t.timeout
        }), t.callback(e, i)
      }, t.timeout);
      var u = {
        response: !1,
        loading: !1,
        end: !1
      };
      i.overrideMimeType("text/plain; charset=x-user-defined"), i.onreadystatechange = function() {
        if (a) return Jt.log.debug("Ignoring timed out state change", {
          state: i.readyState,
          id: i.id
        });
        if (Jt.log.debug("State change", {
            state: i.readyState,
            id: i.id,
            timedOut: a
          }), i.readyState === vn.XMLHttpRequest.OPENED)
          for (var e in Jt.log.debug("Request started", {
              id: i.id
            }), t.headers) i.setRequestHeader(e, t.headers[e]);
        else i.readyState === vn.XMLHttpRequest.HEADERS_RECEIVED ? r() : i.readyState === vn.XMLHttpRequest.LOADING ? (r(), n()) : i.readyState === vn.XMLHttpRequest.DONE && (r(), n(), function() {
          if (!u.end) {
            if (u.end = !0, Jt.log.debug("Request done", {
                id: i.id
              }), h.push(null), i.body = i.responseText, t.json) try {
              i.body = JSON.parse(i.responseText)
            } catch (e) {
              return h.emit("error", e), t.callback(e, i)
            }
            t.callback(null, i, i.body)
          }
        }())
      }, i.open(t.method, t.uri, !0), o && (i.withCredentials = !!t.withCredentials), i.send(t.body);
      var h = new ht.Readable;
      return h._read = Ht, h
    } : function(t) {
      var n = {};
      En += 1, n.seq_id = En, n.id = En + ": " + t.method + " " + t.uri, n._id = n.id, En += 1;
      var e = {};
      t.headers && (e.headers = t.headers), t.method && (e.method = t.method), t.body && (e.body = t.body);
      var i = new ht.Readable;
      return i._read = Ht, vn.fetch(t.uri || t.url, e).then(function(e) {
        n.statusCode = n.status = e.status, i.emit("response", {
          statusCode: e.status,
          statusMessage: e.statusText,
          headers: Array.from(e.headers).reduce(function(e, t) {
            var r = _t(t, 2),
              t = r[0],
              r = r[1];
            return e[t] = r, e
          }, {})
        }), t.callback && e.clone()[t.json ? "json" : "text"]().then(function(e) {
          return t.callback(null, n, e)
        }).catch(function(e) {
          return t.callback(e)
        });
        var r = e.body.getReader();
        ! function t() {
          r.read().then(function(e) {
            e.done ? i.push(null) : (i.push(R.from(e.value)), t())
          })
        }()
      }, function(e) {
        i.emit("error", e), t.callback(e)
      }), i
    })(e)
  }

  function Ht() {}

  function Gt(e) {
    switch (typeof e) {
      case "string":
        return e;
      case "boolean":
        return e ? "true" : "false";
      case "number":
        return isFinite(e) ? e : "";
      default:
        return ""
    }
  }

  function $t(r, n, i, e) {
    return n = n || "&", i = i || "=", null === r && (r = void 0), "object" == typeof r ? Xt(kn(r), function(e) {
      var t = encodeURIComponent(Gt(e)) + i;
      return _n(r[e]) ? Xt(r[e], function(e) {
        return t + encodeURIComponent(Gt(e))
      }).join(n) : t + encodeURIComponent(Gt(r[e]))
    }).join(n) : e ? encodeURIComponent(Gt(e)) + i + encodeURIComponent(Gt(r)) : ""
  }

  function Xt(e, t) {
    if (e.map) return e.map(t);
    for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
    return r
  }

  function Vt(e, t, r, n) {
    t = t || "&", r = r || "=";
    var i = {};
    if ("string" != typeof e || 0 === e.length) return i;
    e = e.split(t);
    t = 1e3;
    n && "number" == typeof n.maxKeys && (t = n.maxKeys);
    var o = e.length;
    0 < t && t < o && (o = t);
    for (var a = 0; a < o; ++a) {
      var s, u = e[a].replace(/\+/g, "%20"),
        h = u.indexOf(r),
        f = 0 <= h ? (s = u.substr(0, h), u.substr(h + 1)) : (s = u, ""),
        c = decodeURIComponent(s),
        h = decodeURIComponent(f);
      u = i, f = c, Object.prototype.hasOwnProperty.call(u, f) ? _n(i[c]) ? i[c].push(h) : i[c] = [i[c], h] : i[c] = h
    }
    return i
  }

  function Zt() {
    this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
  }

  function Qt() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
  }

  function er(e) {
    throw new RangeError(Ln[e])
  }

  function tr(e, t) {
    var r = e.split("@"),
      n = "";
    return 1 < r.length && (n = r[0] + "@", e = r[1]), n + function(e, t) {
      for (var r = e.length, n = []; r--;) n[r] = t(e[r]);
      return n
    }((e = e.replace(Tn, ".")).split("."), t).join(".")
  }

  function rr(e, t) {
    return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
  }

  function nr(e) {
    for (var t, r, n, i, o, a, s, u, h, f, c, l = [], d = (e = function(e) {
        for (var t, r, n = [], i = 0, o = e.length; i < o;) 55296 <= (t = e.charCodeAt(i++)) && t <= 56319 && i < o ? 56320 == (64512 & (r = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--) : n.push(t);
        return n
      }(e)).length, p = 128, g = 72, y = t = 0; y < d; ++y)(u = e[y]) < 128 && l.push(jn(u));
    for (r = n = l.length, n && l.push("-"); r < d;) {
      for (i = 2147483647, y = 0; y < d; ++y) p <= (u = e[y]) && u < i && (i = u);
      for (i - p > Bn((2147483647 - t) / (h = r + 1)) && er("overflow"), t += (i - p) * h, p = i, y = 0; y < d; ++y)
        if ((u = e[y]) < p && 2147483647 < ++t && er("overflow"), u == p) {
          for (o = t, a = 36; !(o < (s = a <= g ? 1 : g + 26 <= a ? 26 : a - g)); a += 36) c = o - s, f = 36 - s, l.push(jn(rr(s + c % f, 0))), o = Bn(c / f);
          l.push(jn(rr(o, 0))), g = function(e, t, r) {
            var n = 0;
            for (e = r ? Bn(e / 700) : e >> 1, e += Bn(e / t); 455 < e; n += 36) e = Bn(e / 35);
            return Bn(n + 36 * e / (e + 38))
          }(t, h, r == n), t = 0, ++r
        }++ t, ++p
    }
    return l.join("")
  }

  function ir() {
    this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
  }

  function or(e, t, r) {
    if (e && pe(e) && e instanceof ir) return e;
    var n = new ir;
    return n.parse(e, t, r), n
  }

  function ar(e, t, r, n) {
    if (!fe(t)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
    var i = t.indexOf("?"),
      o = -1 !== i && i < t.indexOf("#") ? "?" : "#",
      i = t.split(o);
    i[0] = i[0].replace(/\\/g, "/");
    var a = (a = t = i.join(o)).trim();
    if (!n && 1 === t.split("#").length) {
      var s = Mn.exec(a);
      if (s) return e.path = a, e.href = a, e.pathname = s[1], s[2] ? (e.search = s[2], e.query = r ? Vt(e.search.substr(1)) : e.search.substr(1)) : r && (e.search = "", e.query = {}), e
    }
    var u, h, s = Un.exec(a);
    if (s && (A = (s = s[0]).toLowerCase(), e.protocol = A, a = a.substr(s.length)), (n || s || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (!(u = "//" === a.substr(0, 2)) || s && Kn[s] || (a = a.substr(2), e.slashes = !0)), !Kn[s] && (u || s && !Wn[s])) {
      var f, c = -1;
      for (p = 0; p < zn.length; p++) - 1 !== (h = a.indexOf(zn[p])) && (-1 === c || h < c) && (c = h);
      for (-1 !== (f = -1 === c ? a.lastIndexOf("@") : a.lastIndexOf("@", c)) && (k = a.slice(0, f), a = a.slice(f + 1), e.auth = decodeURIComponent(k)), c = -1, p = 0; p < Dn.length; p++) - 1 !== (h = a.indexOf(Dn[p])) && (-1 === c || h < c) && (c = h); - 1 === c && (c = a.length), e.host = a.slice(0, c), a = a.slice(c), ur(e), e.hostname = e.hostname || "";
      var l = "[" === e.hostname[0] && "]" === e.hostname[e.hostname.length - 1];
      if (!l)
        for (var d = e.hostname.split(/\./), p = 0, g = d.length; p < g; p++) {
          var y = d[p];
          if (y && !y.match(Nn)) {
            for (var m = "", v = 0, b = y.length; v < b; v++) m += 127 < y.charCodeAt(v) ? "x" : y[v];
            if (!m.match(Nn)) {
              var w = d.slice(0, p),
                E = d.slice(p + 1),
                _ = y.match(Fn);
              _ && (w.push(_[1]), E.unshift(_[2])), E.length && (a = "/" + E.join(".") + a), e.hostname = w.join(".");
              break
            }
          }
        }
      e.hostname = 255 < e.hostname.length ? "" : e.hostname.toLowerCase(), l || (e.hostname = tr(e.hostname, function(e) {
        return On.test(e) ? "xn--" + nr(e) : e
      })), f = e.port ? ":" + e.port : "";
      var k = e.hostname || "";
      e.host = k + f, e.href += e.host, l && (e.hostname = e.hostname.substr(1, e.hostname.length - 2), "/" !== a[0] && (a = "/" + a))
    }
    if (!Yn[A])
      for (p = 0, g = Pn.length; p < g; p++) {
        var S, R = Pn[p]; - 1 !== a.indexOf(R) && ((S = encodeURIComponent(R)) === R && (S = escape(R)), a = a.split(R).join(S))
      }
    l = a.indexOf("#"); - 1 !== l && (e.hash = a.substr(l), a = a.slice(0, l));
    var A, l = a.indexOf("?");
    return -1 === l ? r && (e.search = "", e.query = {}) : (e.search = a.substr(l), e.query = a.substr(l + 1), r && (e.query = Vt(e.query)), a = a.slice(0, l)), a && (e.pathname = a), Wn[A] && e.hostname && !e.pathname && (e.pathname = "/"), (e.pathname || e.search) && (f = e.pathname || "", A = e.search || "", e.path = f + A), e.href = sr(e), e
  }

  function sr(e) {
    var t = e.auth || "";
    t && (t = (t = encodeURIComponent(t)).replace(/%3A/i, ":"), t += "@");
    var r = e.protocol || "",
      n = e.pathname || "",
      i = e.hash || "",
      o = !1,
      a = "";
    e.host ? o = t + e.host : e.hostname && (o = t + (-1 === e.hostname.indexOf(":") ? e.hostname : "[" + this.hostname + "]"), e.port && (o += ":" + e.port)), e.query && pe(e.query) && Object.keys(e.query).length && (a = $t(e.query));
    a = e.search || a && "?" + a || "";
    return r && ":" !== r.substr(-1) && (r += ":"), e.slashes || (!r || Wn[r]) && !1 !== o ? (o = "//" + (o || ""), n && "/" !== n.charAt(0) && (n = "/" + n)) : o || (o = ""), i && "#" !== i.charAt(0) && (i = "#" + i), a && "?" !== a.charAt(0) && (a = "?" + a), r + o + (n = n.replace(/[?#]/g, function(e) {
      return encodeURIComponent(e)
    })) + (a = a.replace("#", "%23")) + i
  }

  function ur(e) {
    var t = e.host,
      r = qn.exec(t);
    r && (":" !== (r = r[0]) && (e.port = r.substr(1)), t = t.substr(0, t.length - r.length)), t && (e.hostname = t)
  }

  function hr(e) {
    return this instanceof hr ? (this._toSkip = e.skip, void Jn.call(this, e)) : new hr(e)
  }

  function fr(e, t, r) {
    var n = e.shareKeys;
    Array.isArray(t) || (t = cr(t));
    for (var i, o = [r = r || t.map(function(e) {
        return lr(n, e)
      }).reduce(function(e, t) {
        return e.concat(t)
      }).filter(function(e, t, r) {
        return t === r.indexOf(e)
      }), t.map(function(e) {
        return e.nodeId
      }), []], a = r.length; a--;) {
      i = new pn(n[r[a]]);
      for (var s, u = t.length; u--;) !(s = R.from(t[u].key)) || 32 !== s.length && 16 !== s.length || o[2].push(a, u, xt(i.encryptECB(s)))
    }
    return o
  }

  function cr(e) {
    return [e].concat((e.children || []).map(cr).reduce(function(e, t) {
      return e.concat(t)
    }, []))
  }

  function lr(e, t) {
    var r = t.nodeId,
      n = t.parent,
      t = [];
    return e[r] && t.push(r), n ? t.concat(lr(e, n)) : t
  }

  function dr(e, t) {
    return new Zn(e, t)
  }
  var pr = String.fromCharCode,
    gr = Math.min,
    yr = Math.floor,
    mr = Math.log,
    vr = Math.pow,
    br = "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global,
    wr = [],
    Er = [],
    _r = "undefined" == typeof Uint8Array ? Array : Uint8Array,
    kr = !1,
    Sr = {}.toString,
    Rr = Array.isArray || function(e) {
      return "[object Array]" == Sr.call(e)
    };
  R.TYPED_ARRAY_SUPPORT = void 0 === br.TYPED_ARRAY_SUPPORT || br.TYPED_ARRAY_SUPPORT, R.poolSize = 8192, R._augment = function(e) {
    return e.__proto__ = R.prototype, e
  }, R.from = function(e, t, r) {
    return a(null, e, t, r)
  }, R.TYPED_ARRAY_SUPPORT && (R.prototype.__proto__ = Uint8Array.prototype, R.__proto__ = Uint8Array), R.alloc = function(e, t, r) {
    return n = null, t = t, r = r, f(e = e), e <= 0 || void 0 === t ? i(n, e) : "string" == typeof r ? i(n, e).fill(t, r) : i(n, e).fill(t);
    var n
  }, R.allocUnsafe = function(e) {
    return c(null, e)
  }, R.allocUnsafeSlow = function(e) {
    return c(null, e)
  }, R.isBuffer = B, R.compare = function(e, t) {
    if (!p(e) || !p(t)) throw new TypeError("Arguments must be Buffers");
    if (e === t) return 0;
    for (var r = e.length, n = t.length, i = 0, o = gr(r, n); i < o; ++i)
      if (e[i] !== t[i]) {
        r = e[i], n = t[i];
        break
      } return r < n ? -1 : n < r ? 1 : 0
  }, R.isEncoding = function(e) {
    switch ((e + "").toLowerCase()) {
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
        return !0;
      default:
        return !1
    }
  }, R.concat = function(e, t) {
    if (!Rr(e)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === e.length) return R.alloc(0);
    if (void 0 === t)
      for (i = t = 0; i < e.length; ++i) t += e[i].length;
    for (var r = R.allocUnsafe(t), n = 0, i = 0; i < e.length; ++i) {
      var o = e[i];
      if (!p(o)) throw new TypeError('"list" argument must be an Array of Buffers');
      o.copy(r, n), n += o.length
    }
    return r
  }, R.byteLength = g, R.prototype._isBuffer = !0, R.prototype.swap16 = function() {
    var e = this.length;
    if (0 != e % 2) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var t = 0; t < e; t += 2) y(this, t, t + 1);
    return this
  }, R.prototype.swap32 = function() {
    var e = this.length;
    if (0 != e % 4) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var t = 0; t < e; t += 4) y(this, t, t + 3), y(this, t + 1, t + 2);
    return this
  }, R.prototype.swap64 = function() {
    var e = this.length;
    if (0 != e % 8) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var t = 0; t < e; t += 8) y(this, t, t + 7), y(this, t + 1, t + 6), y(this, t + 2, t + 5), y(this, t + 3, t + 4);
    return this
  }, R.prototype.toString = function() {
    var e = 0 | this.length;
    return 0 == e ? "" : 0 === arguments.length ? E(this, 0, e) : t.apply(this, arguments)
  }, R.prototype.equals = function(e) {
    if (!p(e)) throw new TypeError("Argument must be a Buffer");
    return this === e || 0 === R.compare(this, e)
  }, R.prototype.inspect = function() {
    var e = "";
    return 0 < this.length && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), 50 < this.length && (e += " ... ")), "<Buffer " + e + ">"
  }, R.prototype.compare = function(e, t, r, n, i) {
    if (!p(e)) throw new TypeError("Argument must be a Buffer");
    if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
    if (i <= n && r <= t) return 0;
    if (i <= n) return -1;
    if (r <= t) return 1;
    if (this === e) return 0;
    for (var o = (i >>>= 0) - (n >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = gr(o, a), u = this.slice(n, i), h = e.slice(t, r), f = 0; f < s; ++f)
      if (u[f] !== h[f]) {
        o = u[f], a = h[f];
        break
      } return o < a ? -1 : a < o ? 1 : 0
  }, R.prototype.includes = function(e, t, r) {
    return -1 !== this.indexOf(e, t, r)
  }, R.prototype.indexOf = function(e, t, r) {
    return m(this, e, t, r, !0)
  }, R.prototype.lastIndexOf = function(e, t, r) {
    return m(this, e, t, r, !1)
  }, R.prototype.write = function(e, t, r, n) {
    if (void 0 === t) n = "utf8", r = this.length, t = 0;
    else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
    else {
      if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
    }
    var i = this.length - t;
    if ((void 0 === r || i < r) && (r = i), 0 < e.length && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    n = n || "utf8";
    for (var o, a, s, u = !1;;) switch (n) {
      case "hex":
        return function(e, t, r, n) {
          r = +r || 0;
          var i = e.length - r;
          if (n ? i < (n = +n) && (n = i) : n = i, 0 != (i = t.length) % 2) throw new TypeError("Invalid hex string");
          i / 2 < n && (n = i / 2);
          for (var o, a = 0; a < n; ++a) {
            if (o = parseInt(t.substr(2 * a, 2), 16), isNaN(o)) return a;
            e[r + a] = o
          }
          return a
        }(this, e, t, r);
      case "utf8":
      case "utf-8":
        return a = t, s = r, L(O(e, (o = this).length - a), o, a, s);
      case "ascii":
        return b(this, e, t, r);
      case "latin1":
      case "binary":
        return b(this, e, t, r);
      case "base64":
        return o = this, a = t, s = r, L(T(e), o, a, s);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return w(this, e, t, r);
      default:
        if (u) throw new TypeError("Unknown encoding: " + n);
        n = ("" + n).toLowerCase(), u = !0
    }
  }, R.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  }, R.prototype.slice = function(e, t) {
    var r = this.length;
    if ((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r), t < e && (t = e), R.TYPED_ARRAY_SUPPORT)(i = this.subarray(e, t)).__proto__ = R.prototype;
    else
      for (var n = t - e, i = new R(n, void 0), o = 0; o < n; ++o) i[o] = this[o + e];
    return i
  }, R.prototype.readUIntLE = function(e, t, r) {
    e |= 0, t |= 0, r || _(e, t, this.length);
    for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
    return n
  }, R.prototype.readUIntBE = function(e, t, r) {
    e |= 0, t |= 0, r || _(e, t, this.length);
    for (var n = this[e + --t], i = 1; 0 < t && (i *= 256);) n += this[e + --t] * i;
    return n
  }, R.prototype.readUInt8 = function(e, t) {
    return t || _(e, 1, this.length), this[e]
  }, R.prototype.readUInt16LE = function(e, t) {
    return t || _(e, 2, this.length), this[e] | this[e + 1] << 8
  }, R.prototype.readUInt16BE = function(e, t) {
    return t || _(e, 2, this.length), this[e] << 8 | this[e + 1]
  }, R.prototype.readUInt32LE = function(e, t) {
    return t || _(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
  }, R.prototype.readUInt32BE = function(e, t) {
    return t || _(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
  }, R.prototype.readIntLE = function(e, t, r) {
    e |= 0, t |= 0, r || _(e, t, this.length);
    for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
    return (i *= 128) <= n && (n -= vr(2, 8 * t)), n
  }, R.prototype.readIntBE = function(e, t, r) {
    e |= 0, t |= 0, r || _(e, t, this.length);
    for (var n = t, i = 1, o = this[e + --n]; 0 < n && (i *= 256);) o += this[e + --n] * i;
    return (i *= 128) <= o && (o -= vr(2, 8 * t)), o
  }, R.prototype.readInt8 = function(e, t) {
    return t || _(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
  }, R.prototype.readInt16LE = function(e, t) {
    t || _(e, 2, this.length);
    e = this[e] | this[e + 1] << 8;
    return 32768 & e ? 4294901760 | e : e
  }, R.prototype.readInt16BE = function(e, t) {
    t || _(e, 2, this.length);
    e = this[e + 1] | this[e] << 8;
    return 32768 & e ? 4294901760 | e : e
  }, R.prototype.readInt32LE = function(e, t) {
    return t || _(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
  }, R.prototype.readInt32BE = function(e, t) {
    return t || _(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
  }, R.prototype.readFloatLE = function(e, t) {
    return t || _(e, 4, this.length), r(this, e, !0, 23, 4)
  }, R.prototype.readFloatBE = function(e, t) {
    return t || _(e, 4, this.length), r(this, e, !1, 23, 4)
  }, R.prototype.readDoubleLE = function(e, t) {
    return t || _(e, 8, this.length), r(this, e, !0, 52, 8)
  }, R.prototype.readDoubleBE = function(e, t) {
    return t || _(e, 8, this.length), r(this, e, !1, 52, 8)
  }, R.prototype.writeUIntLE = function(e, t, r, n) {
    e = +e, t |= 0, r |= 0, n || k(this, e, t, r, vr(2, 8 * r) - 1, 0);
    var i = 1,
      o = 0;
    for (this[t] = 255 & e; ++o < r && (i *= 256);) this[t + o] = 255 & e / i;
    return t + r
  }, R.prototype.writeUIntBE = function(e, t, r, n) {
    e = +e, t |= 0, r |= 0, n || k(this, e, t, r, vr(2, 8 * r) - 1, 0);
    var i = r - 1,
      o = 1;
    for (this[t + i] = 255 & e; 0 <= --i && (o *= 256);) this[t + i] = 255 & e / o;
    return t + r
  }, R.prototype.writeUInt8 = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 1, 255, 0), R.TYPED_ARRAY_SUPPORT || (e = yr(e)), this[t] = 255 & e, t + 1
  }, R.prototype.writeUInt16LE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 2, 65535, 0), R.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : S(this, e, t, !0), t + 2
  }, R.prototype.writeUInt16BE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 2, 65535, 0), R.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : S(this, e, t, !1), t + 2
  }, R.prototype.writeUInt32LE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 4, 4294967295, 0), R.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : A(this, e, t, !0), t + 4
  }, R.prototype.writeUInt32BE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 4, 4294967295, 0), R.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : A(this, e, t, !1), t + 4
  }, R.prototype.writeIntLE = function(e, t, r, n) {
    e = +e, t |= 0, n || k(this, e, t, r, (n = vr(2, 8 * r - 1)) - 1, -n);
    var i = 0,
      o = 1,
      a = 0;
    for (this[t] = 255 & e; ++i < r && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + i - 1] && (a = 1), this[t + i] = 255 & (e / o >> 0) - a;
    return t + r
  }, R.prototype.writeIntBE = function(e, t, r, n) {
    e = +e, t |= 0, n || k(this, e, t, r, (n = vr(2, 8 * r - 1)) - 1, -n);
    var i = r - 1,
      o = 1,
      a = 0;
    for (this[t + i] = 255 & e; 0 <= --i && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + i + 1] && (a = 1), this[t + i] = 255 & (e / o >> 0) - a;
    return t + r
  }, R.prototype.writeInt8 = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 1, 127, -128), R.TYPED_ARRAY_SUPPORT || (e = yr(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
  }, R.prototype.writeInt16LE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 2, 32767, -32768), R.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : S(this, e, t, !0), t + 2
  }, R.prototype.writeInt16BE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 2, 32767, -32768), R.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : S(this, e, t, !1), t + 2
  }, R.prototype.writeInt32LE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 4, 2147483647, -2147483648), R.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : A(this, e, t, !0), t + 4
  }, R.prototype.writeInt32BE = function(e, t, r) {
    return e = +e, t |= 0, r || k(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), R.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : A(this, e, t, !1), t + 4
  }, R.prototype.writeFloatLE = function(e, t, r) {
    return I(this, e, t, !0, r)
  }, R.prototype.writeFloatBE = function(e, t, r) {
    return I(this, e, t, !1, r)
  }, R.prototype.writeDoubleLE = function(e, t, r) {
    return C(this, e, t, !0, r)
  }, R.prototype.writeDoubleBE = function(e, t, r) {
    return C(this, e, t, !1, r)
  }, R.prototype.copy = function(e, t, r, n) {
    if (r = r || 0, n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t = t || 0, 0 < n && n < r && (n = r), n === r) return 0;
    if (0 === e.length || 0 === this.length) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
    if (n < 0) throw new RangeError("sourceEnd out of bounds");
    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
    var i, o = n - r;
    if (this === e && r < t && t < n)
      for (i = o - 1; 0 <= i; --i) e[i + t] = this[i + r];
    else if (o < 1e3 || !R.TYPED_ARRAY_SUPPORT)
      for (i = 0; i < o; ++i) e[i + t] = this[i + r];
    else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
    return o
  }, R.prototype.fill = function(e, t, r, n) {
    if ("string" == typeof e) {
      var i;
      if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length && (i = e.charCodeAt(0)) < 256 && (e = i), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
      if ("string" == typeof n && !R.isEncoding(n)) throw new TypeError("Unknown encoding: " + n)
    } else "number" == typeof e && (e &= 255);
    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
    if (r <= t) return this;
    if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, "number" == typeof(e = e || 0))
      for (s = t; s < r; ++s) this[s] = e;
    else
      for (var o = p(e) ? e : O(new R(e, n).toString()), a = o.length, s = 0; s < r - t; ++s) this[s + t] = o[s % a];
    return this
  };
  var Ar = /[^+\/0-9A-Za-z-_]/g,
    xr = e,
    Ir = U;
  "function" == typeof br.setTimeout && (xr = setTimeout), "function" == typeof br.clearTimeout && (Ir = clearTimeout);
  var Cr, Or = [],
    Tr = !1,
    Lr = -1;
  z.prototype.run = function() {
    this.fun.apply(null, this.array)
  };
  var Br, jr = br.performance || {},
    Ur = jr.now || jr.mozNow || jr.msNow || jr.oNow || jr.webkitNow || function() {
      return (new Date).getTime()
    },
    qr = new Date,
    Mr = {
      nextTick: D,
      title: "browser",
      browser: !0,
      env: {},
      argv: [],
      version: "",
      versions: {},
      on: N,
      addListener: N,
      once: N,
      off: N,
      removeListener: N,
      removeAllListeners: N,
      emit: N,
      binding: function() {
        throw new Error("process.binding is not supported")
      },
      cwd: function() {
        return "/"
      },
      chdir: function() {
        throw new Error("process.chdir is not supported")
      },
      umask: function() {
        return 0
      },
      hrtime: function(e) {
        var t = .001 * Ur.call(jr),
          r = yr(t),
          t = yr(t % 1 * 1e9);
        return e && (r -= e[0], (t -= e[1]) < 0 && (r--, t += 1e9)), [r, t]
      },
      platform: "browser",
      release: {},
      config: {},
      uptime: function() {
        return (new Date - qr) / 1e3
      }
    },
    Pr = "undefined" == typeof window ? "undefined" == typeof global ? "undefined" == typeof self ? {} : self : global : window;
  Y.prototype = Object.create(null), (K.EventEmitter = K).usingDomains = !1, K.prototype.domain = void 0, K.prototype._events = void 0, K.prototype._maxListeners = void 0, K.defaultMaxListeners = 10, K.init = function() {
    this.domain = null, !K.usingDomains || !Br.active || this instanceof Br.Domain || (this.domain = Br.active), this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = new Y, this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
  }, K.prototype.setMaxListeners = function(e) {
    if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
    return this._maxListeners = e, this
  }, K.prototype.getMaxListeners = function() {
    return W(this)
  }, K.prototype.emit = function(e) {
    var t, r, n, i = "error" === e,
      o = this._events;
    if (o) i = i && null == o.error;
    else if (!i) return !1;
    if (a = this.domain, i) {
      if (i = arguments[1], a) return (i = i || new Error('Uncaught, unspecified "error" event')).domainEmitter = this, i.domain = a, i.domainThrown = !1, a.emit("error", i), !1;
      if (i instanceof Error) throw i;
      var a = new Error('Uncaught, unspecified "error" event. (' + i + ")");
      throw a.context = i, a
    }
    if (!(t = o[e])) return !1;
    var s, u = "function" == typeof t;
    switch (s = arguments.length) {
      case 1:
        ! function(e, t) {
          if (u) e.call(t);
          else
            for (var r = e.length, n = $(e, r), i = 0; i < r; ++i) n[i].call(t)
        }(t, this);
        break;
      case 2:
        ! function(e, t, r, n) {
          if (t) e.call(r, n);
          else
            for (var i = e.length, o = $(e, i), a = 0; a < i; ++a) o[a].call(r, n)
        }(t, u, this, arguments[1]);
        break;
      case 3:
        ! function(e, t, r, n, i) {
          if (t) e.call(r, n, i);
          else
            for (var o = e.length, a = $(e, o), s = 0; s < o; ++s) a[s].call(r, n, i)
        }(t, u, this, arguments[1], arguments[2]);
        break;
      case 4:
        ! function(e, t, r, n, i, o) {
          if (t) e.call(r, n, i, o);
          else
            for (var a = e.length, s = $(e, a), u = 0; u < a; ++u) s[u].call(r, n, i, o)
        }(t, u, this, arguments[1], arguments[2], arguments[3]);
        break;
      default:
        for (r = Array(s - 1), n = 1; n < s; n++) r[n - 1] = arguments[n];
        ! function(e, t, r) {
          if (u) e.apply(t, r);
          else
            for (var n = e.length, i = $(e, n), o = 0; o < n; ++o) i[o].apply(t, r)
        }(t, this, r)
    }
    return !0
  }, K.prototype.addListener = function(e, t) {
    return J(this, e, t, !1)
  }, K.prototype.on = K.prototype.addListener, K.prototype.prependListener = function(e, t) {
    return J(this, e, t, !0)
  }, K.prototype.once = function(e, t) {
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    return this.on(e, H(this, e, t)), this
  }, K.prototype.prependOnceListener = function(e, t) {
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    return this.prependListener(e, H(this, e, t)), this
  }, K.prototype.removeListener = function(e, t) {
    var r, n, i, o, a;
    if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
    if (!(n = this._events)) return this;
    if (!(r = n[e])) return this;
    if (r === t || r.listener && r.listener === t) 0 == --this._eventsCount ? this._events = new Y : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));
    else if ("function" != typeof r) {
      for (i = -1, o = r.length; 0 < o--;)
        if (r[o] === t || r[o].listener && r[o].listener === t) {
          a = r[o].listener, i = o;
          break
        } if (i < 0) return this;
      if (1 === r.length) {
        if (r[0] = void 0, 0 == --this._eventsCount) return this._events = new Y, this;
        delete n[e]
      } else ! function(e) {
        for (var t = i, r = t + 1, n = e.length; r < n; t += 1, r += 1) e[t] = e[r];
        e.pop()
      }(r);
      n.removeListener && this.emit("removeListener", e, a || t)
    }
    return this
  }, K.prototype.removeAllListeners = function(e) {
    var t, r = this._events;
    if (!r) return this;
    if (!r.removeListener) return 0 === arguments.length ? (this._events = new Y, this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = new Y : delete r[e]), this;
    if (0 === arguments.length) {
      for (var n, i = Object.keys(r), o = 0; o < i.length; ++o) "removeListener" === (n = i[o]) || this.removeAllListeners(n);
      return this.removeAllListeners("removeListener"), this._events = new Y, this._eventsCount = 0, this
    }
    if ("function" == typeof(t = r[e])) this.removeListener(e, t);
    else if (t)
      for (; this.removeListener(e, t[t.length - 1]), t[0];);
    return this
  }, K.prototype.listeners = function(e) {
    var t = this._events,
      r = t ? (r = t[e]) ? "function" == typeof r ? [r.listener || r] : function(e) {
        for (var t = Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
        return t
      }(r) : [] : [];
    return r
  }, K.listenerCount = function(e, t) {
    return "function" == typeof e.listenerCount ? e.listenerCount(t) : G.call(e, t)
  }, K.prototype.listenerCount = G, K.prototype.eventNames = function() {
    return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : []
  };
  var Dr, zr = "function" == typeof Object.create ? function(e, t) {
      e.super_ = t, e.prototype = Object.create(t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })
    } : function(e, t) {
      e.super_ = t;

      function r() {}
      r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
    },
    Nr = /%[sdj%]/g,
    Fr = {};
  Q.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
  }, Q.styles = {
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    date: "magenta",
    regexp: "red"
  };
  var Yr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    Kr = {
      inherits: zr,
      _extend: ke,
      log: _e,
      isBuffer: be,
      isPrimitive: ve,
      isFunction: me,
      isError: ye,
      isDate: ge,
      isObject: pe,
      isRegExp: de,
      isUndefined: le,
      isSymbol: ce,
      isString: fe,
      isNumber: he,
      isNullOrUndefined: ue,
      isNull: se,
      isBoolean: ae,
      isArray: oe,
      inspect: Q,
      deprecate: V,
      format: X,
      debuglog: Z
    },
    Wr = Object.freeze({
      format: X,
      deprecate: V,
      debuglog: Z,
      inspect: Q,
      isArray: oe,
      isBoolean: ae,
      isNull: se,
      isNullOrUndefined: ue,
      isNumber: he,
      isString: fe,
      isSymbol: ce,
      isUndefined: le,
      isRegExp: de,
      isObject: pe,
      isDate: ge,
      isError: ye,
      isFunction: me,
      isPrimitive: ve,
      isBuffer: be,
      log: _e,
      inherits: zr,
      _extend: ke,
      default: Kr
    });
  Re.prototype.push = function(e) {
    e = {
      data: e,
      next: null
    };
    0 < this.length ? this.tail.next = e : this.head = e, this.tail = e, ++this.length
  }, Re.prototype.unshift = function(e) {
    e = {
      data: e,
      next: this.head
    };
    0 === this.length && (this.tail = e), this.head = e, ++this.length
  }, Re.prototype.shift = function() {
    if (0 !== this.length) {
      var e = this.head.data;
      return this.head = 1 === this.length ? this.tail = null : this.head.next, --this.length, e
    }
  }, Re.prototype.clear = function() {
    this.head = this.tail = null, this.length = 0
  }, Re.prototype.join = function(e) {
    if (0 === this.length) return "";
    for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
    return r
  }, Re.prototype.concat = function(e) {
    if (0 === this.length) return R.alloc(0);
    if (1 === this.length) return this.head.data;
    for (var t = R.allocUnsafe(e >>> 0), r = this.head, n = 0; r;) r.data.copy(t, n), n += r.data.length, r = r.next;
    return t
  };
  var Jr = R.isEncoding || function(e) {
    switch (e && e.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1
    }
  };
  Ae.prototype.write = function(e) {
    for (var t, r = ""; this.charLength;) {
      if (t = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length, e.copy(this.charBuffer, this.charReceived, 0, t), this.charReceived += t, this.charReceived < this.charLength) return "";
      if (e = e.slice(t, e.length), !(55296 <= (i = (r = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(r.length - 1)) && i <= 56319)) {
        if ((this.charReceived = this.charLength = 0) === e.length) return r;
        break
      }
      this.charLength += this.surrogateSize, r = ""
    }
    this.detectIncompleteChar(e);
    var n = e.length;
    this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, n), n -= this.charReceived);
    var i, n = (r += e.toString(this.encoding, 0, n)).length - 1;
    if (55296 <= (i = r.charCodeAt(n)) && i <= 56319) {
      var o = this.surrogateSize;
      return this.charLength += o, this.charReceived += o, this.charBuffer.copy(this.charBuffer, o, 0, o), e.copy(this.charBuffer, 0, 0, o), r.substring(0, n)
    }
    return r
  }, Ae.prototype.detectIncompleteChar = function(e) {
    for (var t, r = 3 <= e.length ? 3 : e.length; 0 < r; r--) {
      if (t = e[e.length - r], 1 == r && 6 == t >> 5) {
        this.charLength = 2;
        break
      }
      if (r <= 2 && 14 == t >> 4) {
        this.charLength = 3;
        break
      }
      if (r <= 3 && 30 == t >> 3) {
        this.charLength = 4;
        break
      }
    }
    this.charReceived = r
  }, Ae.prototype.end = function(e) {
    var t, r, n = "";
    return e && e.length && (n = this.write(e)), this.charReceived && (t = this.charReceived, r = this.charBuffer, e = this.encoding, n += r.slice(0, t).toString(e)), n
  }, Te.ReadableState = Oe;
  var Hr = Z("stream");
  zr(Te, K), Te.prototype.push = function(e, t) {
    var r = this._readableState;
    return r.objectMode || "string" != typeof e || (t = t || r.defaultEncoding) !== r.encoding && (e = R.from(e, t), t = ""), Le(this, r, e, t, !1)
  }, Te.prototype.unshift = function(e) {
    return Le(this, this._readableState, e, "", !0)
  }, Te.prototype.isPaused = function() {
    return !1 === this._readableState.flowing
  }, Te.prototype.setEncoding = function(e) {
    return this._readableState.decoder = new Ae(e), this._readableState.encoding = e, this
  }, Te.prototype.read = function(e) {
    Hr("read", e), e = parseInt(e, 10);
    var t = this._readableState,
      r = e;
    if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return Hr("read: emitReadable", t.length, t.ended), (0 === t.length && t.ended ? Ne : je)(this), null;
    if (0 === (e = Be(e, t)) && t.ended) return 0 === t.length && Ne(this), null;
    var n = t.needReadable;
    return Hr("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && Hr("length less than watermark", n = !0), t.ended || t.reading ? Hr("reading or ended", n = !1) : n && (Hr("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = Be(r, t))), null === (n = 0 < e ? ze(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && Ne(this)), null !== n && this.emit("data", n), n
  }, Te.prototype._read = function() {
    this.emit("error", new Error("not implemented"))
  }, Te.prototype.pipe = function(r, e) {
    function t(e) {
      Hr("onunpipe"), e === f && i()
    }

    function n() {
      Hr("onend"), r.end()
    }

    function i() {
      Hr("cleanup"), r.removeListener("close", s), r.removeListener("finish", u), r.removeListener("drain", p), r.removeListener("error", a), r.removeListener("unpipe", t), f.removeListener("end", n), f.removeListener("end", i), f.removeListener("data", o), y = !0, !c.awaitDrain || r._writableState && !r._writableState.needDrain || p()
    }

    function o(e) {
      Hr("ondata"), (m = !1) !== r.write(e) || m || ((1 === c.pipesCount && c.pipes === r || 1 < c.pipesCount && -1 !== Ye(c.pipes, r)) && !y && (Hr("false write response, pause", f._readableState.awaitDrain), f._readableState.awaitDrain++, m = !0), f.pause())
    }

    function a(e) {
      var t;
      Hr("onerror", e), h(), r.removeListener("error", a), 0 === (t = "error", r.listeners(t).length) && r.emit("error", e)
    }

    function s() {
      r.removeListener("finish", u), h()
    }

    function u() {
      Hr("onfinish"), r.removeListener("close", s), h()
    }

    function h() {
      Hr("unpipe"), f.unpipe(r)
    }
    var f = this,
      c = this._readableState;
    switch (c.pipesCount) {
      case 0:
        c.pipes = r;
        break;
      case 1:
        c.pipes = [c.pipes, r];
        break;
      default:
        c.pipes.push(r)
    }
    c.pipesCount += 1, Hr("pipe count=%d opts=%j", c.pipesCount, e);
    var l = !e || !1 !== e.end ? n : i;
    c.endEmitted ? D(l) : f.once("end", l), r.on("unpipe", t);
    var d, p = (d = f, function() {
      var e = d._readableState;
      Hr("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && d.listeners("data").length && (e.flowing = !0, De(d))
    });
    r.on("drain", p);
    var g, y = !1,
      m = !1;
    return f.on("data", o), g = "error", e = a, "function" == typeof(l = r).prependListener ? l.prependListener(g, e) : l._events && l._events[g] ? Array.isArray(l._events[g]) ? l._events[g].unshift(e) : l._events[g] = [e, l._events[g]] : l.on(g, e), r.once("close", s), r.once("finish", u), r.emit("pipe", f), c.flowing || (Hr("pipe resume"), f.resume()), r
  }, Te.prototype.unpipe = function(e) {
    var t = this._readableState;
    if (0 === t.pipesCount) return this;
    if (1 === t.pipesCount) return e && e !== t.pipes || (e = e || t.pipes, t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this)), this;
    if (!e) {
      var r = t.pipes,
        n = t.pipesCount;
      t.pipes = null, t.pipesCount = 0, t.flowing = !1;
      for (var i = 0; i < n; i++) r[i].emit("unpipe", this);
      return this
    }
    var o = Ye(t.pipes, e);
    return -1 === o || (t.pipes.splice(o, 1), --t.pipesCount, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this)), this
  }, Te.prototype.addListener = Te.prototype.on = function(e, t) {
    t = K.prototype.on.call(this, e, t);
    return "data" === e ? !1 !== this._readableState.flowing && this.resume() : "readable" === e && ((e = this._readableState).endEmitted || e.readableListening || (e.readableListening = e.needReadable = !0, e.emittedReadable = !1, e.reading ? e.length && je(this) : D(Me, this))), t
  }, Te.prototype.resume = function() {
    var e, t = this._readableState;
    return t.flowing || (Hr("resume"), t.flowing = !0, e = this, (t = t).resumeScheduled || (t.resumeScheduled = !0, D(Pe, e, t))), this
  }, Te.prototype.pause = function() {
    return Hr("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (Hr("pause"), this._readableState.flowing = !1, this.emit("pause")), this
  }, Te.prototype.wrap = function(t) {
    var e, r = this._readableState,
      n = !1,
      i = this;
    for (e in t.on("end", function() {
        var e;
        Hr("wrapped end"), r.decoder && !r.ended && (e = r.decoder.end()) && e.length && i.push(e), i.push(null)
      }), t.on("data", function(e) {
        Hr("wrapped data"), r.decoder && (e = r.decoder.write(e)), r.objectMode && null == e || !(r.objectMode || e && e.length) || i.push(e) || (n = !0, t.pause())
      }), t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function(e) {
      return function() {
        return t[e].apply(t, arguments)
      }
    }(e));
    return function(e, t) {
      for (var r = 0, n = e.length; r < n; r++) t(e[r], r)
    }(["error", "close", "destroy", "pause", "resume"], function(e) {
      t.on(e, i.emit.bind(i, e))
    }), i._read = function(e) {
      Hr("wrapped _read", e), n && (n = !1, t.resume())
    }, i
  }, Te._fromList = ze, He.WritableState = Je, zr(He, K), Je.prototype.getBuffer = function() {
    for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
    return t
  }, He.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"))
  }, He.prototype.write = function(e, t, r) {
    var n, i, o, a, s, u, h = this._writableState,
      f = !1;
    return "function" == typeof t && (r = t, t = null), R.isBuffer(e) ? t = "buffer" : t || (t = h.defaultEncoding), "function" != typeof r && (r = Ke), h.ended ? (a = this, s = r, u = new Error("write after end"), a.emit("error", u), D(s, u)) : (n = this, i = h, o = r, s = !(a = !0), null === (u = e) ? s = new TypeError("May not write null values to stream") : R.isBuffer(u) || "string" == typeof u || void 0 === u || i.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (n.emit("error", s), D(o, s), a = !1), a && (h.pendingcb++, f = Ge(this, h, e, t, r))), f
  }, He.prototype.cork = function() {
    this._writableState.corked++
  }, He.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || Ve(this, e))
  }, He.prototype.setDefaultEncoding = function(e) {
    if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + e);
    return this._writableState.defaultEncoding = e, this
  }, He.prototype._write = function(e, t, r) {
    r(new Error("not implemented"))
  }, He.prototype._writev = null, He.prototype.end = function(e, t, r) {
    var n = this._writableState;
    "function" == typeof e ? (r = e, t = e = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || (t = this, r = r, (n = n).ending = !0, et(t, n), r && (n.finished ? D(r) : t.once("finish", r)), n.ended = !0, t.writable = !1)
  }, zr(rt, Te);
  for (var Gr, $r = Object.keys(He.prototype), Xr = 0; Xr < $r.length; Xr++) Gr = $r[Xr], rt.prototype[Gr] || (rt.prototype[Gr] = He.prototype[Gr]);
  zr(at, rt), at.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, rt.prototype.push.call(this, e, t)
  }, at.prototype._transform = function() {
    throw new Error("Not implemented")
  }, at.prototype._write = function(e, t, r) {
    var n = this._transformState;
    n.writecb = r, n.writechunk = e, n.writeencoding = t, n.transforming || (t = this._readableState, (n.needTransform || t.needReadable || t.length < t.highWaterMark) && this._read(t.highWaterMark))
  }, at.prototype._read = function() {
    var e = this._transformState;
    null !== e.writechunk && e.writecb && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0
  }, zr(ut, at), ut.prototype._transform = function(e, t, r) {
    r(null, e)
  }, zr(ht, K), ht.Readable = Te, ht.Writable = He, ht.Duplex = rt, ht.Transform = at, ht.PassThrough = ut, (ht.Stream = ht).prototype.pipe = function(t, e) {
    function r(e) {
      t.writable && !1 === t.write(e) && u.pause && u.pause()
    }

    function n() {
      u.readable && u.resume && u.resume()
    }

    function i() {
      h || (h = !0, t.end())
    }

    function o() {
      h || (h = !0, "function" == typeof t.destroy && t.destroy())
    }

    function a(e) {
      if (s(), 0 === K.listenerCount(this, "error")) throw e
    }

    function s() {
      u.removeListener("data", r), t.removeListener("drain", n), u.removeListener("end", i), u.removeListener("close", o), u.removeListener("error", a), t.removeListener("error", a), u.removeListener("end", s), u.removeListener("close", s), t.removeListener("close", s)
    }
    var u = this;
    u.on("data", r), t.on("drain", n), t._isStdio || e && !1 === e.end || (u.on("end", i), u.on("close", o));
    var h = !1;
    return u.on("error", a), t.on("error", a), u.on("end", s), u.on("close", s), t.on("close", s), t.emit("pipe", u), t
  };

  function Vr(t, r) {
    function e(e) {
      n.emit("error", e)
    }
    var n = new Qr,
      i = !1;
    return ft(tn, function(e) {
      n[e] = function() {
        return t[e].apply(t, arguments)
      }
    }), ft(rn, function(t) {
      n[t] = function() {
        n.emit(t);
        var e = r[t];
        return e ? e.apply(r, arguments) : void r.emit(t)
      }
    }), ft(nn, function(t) {
      r.on(t, function() {
        var e = on.call(arguments);
        e.unshift(t), n.emit.apply(n, e)
      })
    }), r.on("end", function() {
      var e;
      i || (i = !0, (e = on.call(arguments)).unshift("end"), n.emit.apply(n, e))
    }), t.on("drain", function() {
      n.emit("drain")
    }), t.on("error", e), r.on("error", e), n.writable = t.writable, n.readable = r.readable, n
  }

  function Zr() {
    function e() {
      var e = [].slice.call(arguments);
      e.unshift("error"), i.emit.apply(i, e)
    }
    var t = 1 == arguments.length && Array.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments);
    if (0 == t.length) return (un && sn || un)();
    if (1 == t.length) return t[0];
    var r = t[0],
      n = t[t.length - 1],
      i = (an && Vr)(r, n);
    ! function e(t) {
      t.length < 2 || (t[0].pipe(t[1]), e(t.slice(1)))
    }(t);
    for (var o = 1; o < t.length - 1; o++) t[o].on("error", e);
    return i
  }
  var zr = Object.freeze({
      default: ht,
      Readable: Te,
      Writable: He,
      Duplex: rt,
      Transform: at,
      PassThrough: ut,
      Stream: ht
    }),
    Qr = zr && ht,
    en = F(function(e, t) {
      function r(t, r, e) {
        function n() {
          for (; a.length && !u.paused;) {
            var e = a.shift();
            if (null === e) return u.emit("end");
            u.emit("data", e)
          }
        }
        t = t || function(e) {
          this.queue(e)
        }, r = r || function() {
          this.queue(null)
        };
        var i = !1,
          o = !1,
          a = [],
          s = !1,
          u = new Qr;
        return u.readable = u.writable = !0, u.paused = !1, u.autoDestroy = !(e && !1 === e.autoDestroy), u.write = function(e) {
          return t.call(this, e), !u.paused
        }, u.queue = u.push = function(e) {
          return s || (null === e && (s = !0), a.push(e), n()), u
        }, u.on("end", function() {
          u.readable = !1, !u.writable && u.autoDestroy && D(function() {
            u.destroy()
          })
        }), u.end = function(e) {
          if (!i) return i = !0, arguments.length && u.write(e), u.writable = !1, r.call(u), !u.readable && u.autoDestroy && u.destroy(), u
        }, u.destroy = function() {
          if (!o) return i = o = !0, a.length = 0, u.writable = u.readable = !1, u.emit("close"), u
        }, u.pause = function() {
          if (!u.paused) return u.paused = !0, u
        }, u.resume = function() {
          return u.paused && (u.paused = !1, u.emit("resume")), n(), u.paused || u.emit("drain"), u
        }, u
      }(e.exports = r).through = r
    }),
    tn = ["write", "end", "destroy"],
    rn = ["resume", "pause"],
    nn = ["data", "close"],
    on = Array.prototype.slice,
    an = Object.freeze({
      default: Vr,
      __moduleExports: Vr
    }),
    sn = F(function(e, t) {
      function r(t, r, e) {
        function n() {
          for (; a.length && !u.paused;) {
            var e = a.shift();
            if (null === e) return u.emit("end");
            u.emit("data", e)
          }
        }
        t = t || function(e) {
          this.queue(e)
        }, r = r || function() {
          this.queue(null)
        };
        var i = !1,
          o = !1,
          a = [],
          s = !1,
          u = new Qr;
        return u.readable = u.writable = !0, u.paused = !1, u.autoDestroy = !(e && !1 === e.autoDestroy), u.write = function(e) {
          return t.call(this, e), !u.paused
        }, u.queue = u.push = function(e) {
          return s || (null === e && (s = !0), a.push(e), n()), u
        }, u.on("end", function() {
          u.readable = !1, !u.writable && u.autoDestroy && D(function() {
            u.destroy()
          })
        }), u.end = function(e) {
          if (!i) return i = !0, arguments.length && u.write(e), u.writable = !1, r.call(u), !u.readable && u.autoDestroy && u.destroy(), u
        }, u.destroy = function() {
          if (!o) return i = o = !0, a.length = 0, u.writable = u.readable = !1, u.emit("close"), u
        }, u.pause = function() {
          if (!u.paused) return u.paused = !0, u
        }, u.resume = function() {
          return u.paused && (u.paused = !1, u.emit("resume")), n(), u.paused || u.emit("drain"), u
        }, u
      }(e.exports = r).through = r
    }),
    un = Object.freeze({
      default: sn,
      __moduleExports: sn
    }),
    hn = {},
    fn = Object.freeze({
      default: hn
    }),
    cn = F(function(e) {
      function t(e, t) {
        if (t = t || {
            type: "Array"
          }, void 0 !== Mr && "number" == typeof Mr.pid && Mr.versions && Mr.versions.node) return function(e, t) {
          var r = (fn && hn).randomBytes(e);
          switch (t.type) {
            case "Array":
              return [].slice.call(r);
            case "Buffer":
              return r;
            case "Uint8Array":
              for (var n = new Uint8Array(e), i = 0; i < e; ++i) n[i] = r.readUInt8(i);
              return n;
            default:
              throw new Error(t.type + " is unsupported.")
          }
        }(e, t);
        if (!(window.crypto || window.msCrypto)) throw new Error("Your browser does not support window.crypto.");
        return function(e, t) {
          var r = new Uint8Array(e);
          switch ((window.crypto || window.msCrypto).getRandomValues(r), t.type) {
            case "Array":
              return [].slice.call(r);
            case "Buffer":
              try {
                new R(1)
              } catch (t) {
                throw new Error("Buffer not supported in this environment. Use Node.js or Browserify for browser support.")
              }
              return new R(r);
            case "Uint8Array":
              return r;
            default:
              throw new Error(t.type + " is unsupported.")
          }
        }(e, t)
      }
      var r;
      r = Pr, e.exports ? e.exports = t : r.secureRandom = t, t.randomArray = function(e) {
        return t(e, {
          type: "Array"
        })
      }, t.randomUint8Array = function(e) {
        return t(e, {
          type: "Uint8Array"
        })
      }, t.randomBuffer = function(e) {
        return t(e, {
          type: "Buffer"
        })
      }
    }),
    ln = (yt(dn, [{
      key: "encrypt",
      value: function(e) {
        return this._crypt(e, 0)
      }
    }, {
      key: "decrypt",
      value: function(e) {
        return this._crypt(e, 1)
      }
    }, {
      key: "_precompute",
      value: function() {
        for (var e, t, r, n, i, o, a, s = this._tables[0], u = this._tables[1], h = s[4], f = u[4], c = [], l = [], d = 0; d < 256; d++) l[(c[d] = d << 1 ^ 283 * (d >> 7)) ^ d] = d;
        for (e = t = 0; !h[e]; e ^= r || 1, t = l[t] || 1)
          for (i = (i = t ^ t << 1 ^ t << 2 ^ t << 3 ^ t << 4) >> 8 ^ 255 & i ^ 99, a = 16843009 * c[n = c[r = c[f[h[e] = i] = e]]] ^ 65537 * n ^ 257 * r ^ 16843008 * e, o = 257 * c[i] ^ 16843008 * i, d = 0; d < 4; d++) s[d][e] = o = o << 24 ^ o >>> 8, u[d][i] = a = a << 24 ^ a >>> 8;
        for (d = 0; d < 5; d++) s[d] = s[d].slice(0), u[d] = u[d].slice(0)
      }
    }, {
      key: "_crypt",
      value: function(e, t) {
        if (4 !== e.length) throw new Error("invalid aes block size");
        for (var r, n, i, o = this._key[t], a = e[0] ^ o[0], s = e[t ? 3 : 1] ^ o[1], u = e[2] ^ o[2], h = e[t ? 1 : 3] ^ o[3], f = o.length / 4 - 2, c = 4, l = [0, 0, 0, 0], e = this._tables[t], d = e[0], p = e[1], g = e[2], y = e[3], m = e[4], v = 0; v < f; v++) r = d[a >>> 24] ^ p[255 & s >> 16] ^ g[255 & u >> 8] ^ y[255 & h] ^ o[c], n = d[s >>> 24] ^ p[255 & u >> 16] ^ g[255 & h >> 8] ^ y[255 & a] ^ o[c + 1], i = d[u >>> 24] ^ p[255 & h >> 16] ^ g[255 & a >> 8] ^ y[255 & s] ^ o[c + 2], h = d[h >>> 24] ^ p[255 & a >> 16] ^ g[255 & s >> 8] ^ y[255 & u] ^ o[c + 3], c += 4, a = r, s = n, u = i;
        for (v = 0; v < 4; v++) l[t ? 3 & -v : v] = m[a >>> 24] << 24 ^ m[255 & s >> 16] << 16 ^ m[255 & u >> 8] << 8 ^ m[255 & h] ^ o[c++], r = a, a = s, s = u, u = h, h = r;
        return l
      }
    }]), dn);

  function dn(e) {
    pt(this, dn), this._tables[0][0][0] || this._precompute();
    var t, r, n, i, o, a = this._tables[0][4],
      s = this._tables[1],
      u = e.length,
      h = 1;
    if (4 !== u && 6 !== u && 8 !== u) throw new Error("invalid aes key size");
    for (this._key = [i = e.slice(0), o = []], t = u; t < 4 * u + 28; t++) n = i[t - 1], (0 == t % u || 8 === u && 4 == t % u) && (n = a[n >>> 24] << 24 ^ a[255 & n >> 16] << 16 ^ a[255 & n >> 8] << 8 ^ a[255 & n], 0 == t % u && (n = n << 8 ^ n >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7))), i[t] = i[t - u] ^ n;
    for (r = 0; t; r++, t--) n = i[3 & r ? t : t - 4], o[r] = t <= 4 || r < 4 ? n : s[0][a[n >>> 24]] ^ s[1][a[255 & n >> 16]] ^ s[2][a[255 & n >> 8]] ^ s[3][a[255 & n]]
  }
  ln.prototype._tables = [
    [
      [],
      [],
      [],
      [],
      []
    ],
    [
      [],
      [],
      [],
      [],
      []
    ]
  ];
  var pn = (yt(wn, [{
      key: "encryptCBC",
      value: function(e) {
        for (var t, r = [0, 0, 0, 0], n = [, , , , ], i = 0; i < e.length; i += 16) {
          for (t = 0; t < 4; t++) n[t] = e.readUInt32BE(i + 4 * t) ^ r[t];
          for (r = this.aes.encrypt(n), t = 0; t < 4; t++) e.writeInt32BE(r[t], i + 4 * t)
        }
      }
    }, {
      key: "decryptCBC",
      value: function(e) {
        for (var t, r, n = [0, 0, 0, 0], i = [, , , , ], o = 0; o < e.length; o += 16) {
          for (r = 0; r < 4; r++) i[r] = e.readUInt32BE(o + 4 * r);
          for (t = i, i = this.aes.decrypt(i), r = 0; r < 4; r++) e.writeInt32BE(i[r] ^ n[r], o + 4 * r);
          n = t
        }
      }
    }, {
      key: "stringhash",
      value: function(e) {
        for (var t, r = [0, 0, 0, 0], n = 0; n < e.length; n += 4) e.length - n < 4 ? (t = e.length - n, r[3 & n / 4] ^= e.readIntBE(n, t) << 8 * (4 - t)) : r[3 & n / 4] ^= e.readInt32BE(n);
        for (var i = 16384; i--;) r = this.aes.encrypt(r);
        var o = R.allocUnsafe(8);
        return o.writeInt32BE(r[0], 0), o.writeInt32BE(r[2], 4), o
      }
    }, {
      key: "encryptECB",
      value: function(e) {
        for (var t = [], r = 0; r < e.length; r += 16) t[0] = e.readInt32BE(r), t[1] = e.readInt32BE(r + 4), t[2] = e.readInt32BE(r + 8), t[3] = e.readInt32BE(r + 12), t = this.aes.encrypt(t), e.writeInt32BE(t[0], r), e.writeInt32BE(t[1], r + 4), e.writeInt32BE(t[2], r + 8), e.writeInt32BE(t[3], r + 12);
        return e
      }
    }, {
      key: "decryptECB",
      value: function(e) {
        for (var t = [], r = 0; r < e.length; r += 16) t[0] = e.readInt32BE(r), t[1] = e.readInt32BE(r + 4), t[2] = e.readInt32BE(r + 8), t[3] = e.readInt32BE(r + 12), t = this.aes.decrypt(t), e.writeInt32BE(t[0], r), e.writeInt32BE(t[1], r + 4), e.writeInt32BE(t[2], r + 8), e.writeInt32BE(t[3], r + 12);
        return e
      }
    }]), wn),
    gn = (yt(bn, [{
      key: "condensedMac",
      value: function() {
        this.mac && (this.macs.push(this.mac), this.mac = void 0);
        for (var e = R.alloc(16), t = 0; t < this.macs.length; t++) {
          for (var r = 0; r < 16; r++) e[r] ^= this.macs[t][r];
          this.aes.encryptECB(e)
        }
        var n = R.allocUnsafe(8);
        return n.writeInt32BE(e.readInt32BE(0) ^ e.readInt32BE(4), 0), n.writeInt32BE(e.readInt32BE(8) ^ e.readInt32BE(12), 4), n
      }
    }, {
      key: "encrypt",
      value: function(e) {
        for (var t, r = 0; r < e.length; r += 16) {
          t = this.aes.encryptECB(R.from(this.ctr));
          for (var n = 0; n < 16; n++) this.mac[n] ^= e[r + n], e[r + n] ^= t[n];
          this.aes.encryptECB(this.mac), this.incrementCTR()
        }
      }
    }, {
      key: "decrypt",
      value: function(e) {
        for (var t, r = 0; r < e.length; r += 16) {
          t = this.aes.encryptECB(R.from(this.ctr));
          for (var n = 0; n < 16; n++) e[r + n] ^= t[n], this.mac[n] ^= e[r + n];
          this.aes.encryptECB(this.mac), this.incrementCTR()
        }
      }
    }, {
      key: "incrementCTR",
      value: function() {
        for (var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 1, t = 0; t < e; t++) this.checkMacBounding();
        for (var r, n = this.ctr, i = 15; 0 !== e;) r = (e + n[i]) % 256, e = yr((e + n[i]) / 256), n[i] = r, --i < 0 && (i = 15)
      }
    }, {
      key: "checkMacBounding",
      value: function() {
        this.pos += 16, this.pos >= this.posNext && (this.macs.push(R.from(this.mac)), this.nonce.copy(this.mac, 0), this.nonce.copy(this.mac, 8), this.increment < 1048576 && (this.increment += 131072), this.posNext += this.increment)
      }
    }]), bn),
    yn = {},
    mn = .6931471805599453,
    vn = "undefined" == typeof window ? self : window;

  function bn(e, t) {
    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0;
    pt(this, bn), this.aes = e, this.nonce = t.slice(0, 8), this.increment = 131072, this.posNext = this.increment, this.pos = 0, this.ctr = R.alloc(16), this.nonce.copy(this.ctr, 0), this.mac = R.alloc(16), this.nonce.copy(this.mac, 0), this.nonce.copy(this.mac, 8), this.macs = [], this.incrementCTR(r / 16)
  }

  function wn(e) {
    if (pt(this, wn), 16 !== e.length) throw Error("Wrong key length. Key must be 128bit.");
    for (var t = [], r = 0; r < 4; r++) t[r] = e.readInt32BE(4 * r);
    this.aes = new ln(t)
  }
  Jt.log = {
    trace: Ht,
    debug: Ht,
    info: Ht,
    warn: Ht,
    error: Ht
  };
  var En = 0;
  Jt.withCredentials = !1, Jt.DEFAULT_TIMEOUT = 18e4, Jt.defaults = function(i) {
    function e(n) {
      return function(e, t) {
        for (var r in e = "string" == typeof e ? {
            uri: e
          } : JSON.parse(JSON.stringify(e)), i) void 0 === e[r] && (e[r] = i[r]);
        return n(e, t)
      }
    }
    var t = e(Jt);
    return t.get = e(Jt.get), t.post = e(Jt.post), t.put = e(Jt.put), t.head = e(Jt.head), t
  }, ["get", "put", "post", "head"].forEach(function(e) {
    var t = e.toUpperCase();
    Jt[e.toLowerCase()] = function(e) {
      "string" == typeof e ? e = {
        method: t,
        uri: e
      } : (e = JSON.parse(JSON.stringify(e))).method = t;
      e = [e].concat(Array.prototype.slice.apply(arguments, [1]));
      return Jt.apply(this, e)
    }
  });
  var _n = Array.isArray || function(e) {
      return "[object Array]" === Object.prototype.toString.call(e)
    },
    kn = Object.keys || function(e) {
      var t, r = [];
      for (t in e) Object.prototype.hasOwnProperty.call(e, t) && r.push(t);
      return r
    },
    Sn = {
      encode: $t,
      stringify: $t,
      decode: Vt,
      parse: Vt
    },
    Rn = {
      1: "EINTERNAL (-1): An internal error has occurred. Please submit a bug report, detailing the exact circumstances in which this error occurred.",
      2: "EARGS (-2): You have passed invalid arguments to this command.",
      3: "EAGAIN (-3): A temporary congestion or server malfunction prevented your request from being processed. No data was altered. Retried 4 times.",
      4: "ERATELIMIT (-4): You have exceeded your command weight per time quota. Please wait a few seconds, then try again (this should never happen in sane real-life applications).",
      5: "EFAILED (-5): The upload failed. Please restart it from scratch.",
      6: "ETOOMANY (-6): Too many concurrent IP addresses are accessing this upload target URL.",
      7: "ERANGE (-7): The upload file packet is out of range or not starting and ending on a chunk boundary.",
      8: "EEXPIRED (-8): The upload target URL you are trying to access has expired. Please request a fresh one.",
      9: "ENOENT (-9): Object (typically, node or user) not found. Wrong password?",
      10: "ECIRCULAR (-10): Circular linkage attempted",
      11: "EACCESS (-11): Access violation (e.g., trying to write to a read-only share)",
      12: "EEXIST (-12): Trying to create an object that already exists",
      13: "EINCOMPLETE (-13): Trying to access an incomplete resource",
      14: "EKEY (-14): A decryption operation failed (never returned by the API)",
      15: "ESID (-15): Invalid or expired user session, please relogin",
      16: "EBLOCKED (-16): User blocked",
      17: "EOVERQUOTA (-17): Request over quota",
      18: "ETEMPUNAVAIL (-18): Resource temporarily not available, please try again later"
    },
    An = function() {
      function r(e) {
        var t;
        return pt(this, r), (t = n.call(this)).keepalive = e, t.counterId = Math.random().toString().substr(2, 10), t.gateway = "https://g.api.mega.co.nz/", t.requestModule = Jt, t
      }
      mt(r, K);
      var n = Et(r);
      return yt(r, [{
        key: "request",
        value: function(n, i) {
          var o = this,
            a = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
            e = {
              id: (this.counterId++).toString()
            };
          this.sid && (e.sid = this.sid), "object" === dt(n._querystring) && (Object.assign(e, n._querystring), delete n._querystring), this.requestModule({
            uri: "".concat(this.gateway, "cs"),
            qs: e,
            method: "POST",
            json: [n],
            gzip: !0
          }, function(e, t, r) {
            if (e) return i(e);
            if (!r) return i(Error("Empty response"));
            if (r.length && (r = r[0]), !e && "number" == typeof r && r < 0) {
              if (-3 === r && a < 4) return setTimeout(function() {
                o.request(n, i, a + 1)
              }, 1e3 * vr(2, a + 1));
              e = Error(Rn[-r])
            } else o.keepalive && r && r.sn && o.pull(r.sn);
            i(e, r)
          })
        }
      }, {
        key: "pull",
        value: function(n) {
          var i = this,
            o = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
          this.sn = this.requestModule({
            uri: "".concat(this.gateway, "sc"),
            qs: {
              sn: n,
              sid: this.sid
            },
            method: "POST",
            json: !0,
            body: "sc?".concat(Sn.stringify({
              sn: n
            }))
          }, function(e, t, r) {
            if (i.sn = void 0, !e && "number" == typeof r && r < 0) {
              if (-3 === r && o < 4) return setTimeout(function() {
                i.pull(n, o + 1)
              }, 1e3 * vr(2, o + 1));
              e = Error(Rn[-r])
            }
            if (e) throw e;
            r.w ? i.wait(r.w, n) : r.sn && (r.a && i.emit("sc", r.a), i.pull(r.sn))
          })
        }
      }, {
        key: "wait",
        value: function(e, t) {
          var r = this;
          this.sn = this.requestModule({
            uri: e,
            method: "POST"
          }, function(e) {
            if (r.sn = void 0, e) throw Error("mega server wait req failed");
            r.pull(t)
          })
        }
      }, {
        key: "close",
        value: function() {
          this.sn && this.sn.abort()
        }
      }]), r
    }(),
    zr = Wr && Kr,
    xn = Qr.Stream,
    Wr = Zt;
  zr.inherits(Zt, xn), Zt.create = function(e, t) {
    var r, n = new this;
    for (r in t = t || {}) n[r] = t[r];
    var i = (n.source = e).emit;
    return e.emit = function() {
      return n._handleEmit(arguments), i.apply(e, arguments)
    }, e.on("error", function() {}), n.pauseStream && e.pause(), n
  }, Object.defineProperty(Zt.prototype, "readable", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.source.readable
    }
  }), Zt.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments)
  }, Zt.prototype.resume = function() {
    this._released || this.release(), this.source.resume()
  }, Zt.prototype.pause = function() {
    this.source.pause()
  }, Zt.prototype.release = function() {
    this._released = !0, this._bufferedEvents.forEach(function(e) {
      this.emit.apply(this, e)
    }.bind(this)), this._bufferedEvents = []
  }, Zt.prototype.pipe = function() {
    var e = xn.prototype.pipe.apply(this, arguments);
    return this.resume(), e
  }, Zt.prototype._handleEmit = function(e) {
    return this._released ? void this.emit.apply(this, e) : ("data" === e[0] && (this.dataSize += e[1].length, this._checkIfMaxDataSizeExceeded()), void this._bufferedEvents.push(e))
  }, Zt.prototype._checkIfMaxDataSizeExceeded = function() {
    var e;
    this._maxDataSizeExceeded || this.dataSize <= this.maxDataSize || (this._maxDataSizeExceeded = !0, e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.", this.emit("error", new Error(e)))
  };
  var Kr = Object.freeze({
      default: Wr,
      __moduleExports: Wr
    }),
    In = Kr && Wr,
    Cn = Qr.Stream;
  zr.inherits(Qt, Cn), Qt.create = function(e) {
    var t, r = new this;
    for (t in e = e || {}) r[t] = e[t];
    return r
  }, Qt.isStreamLike = function(e) {
    return "function" != typeof e && "string" != typeof e && "boolean" != typeof e && "number" != typeof e && !B(e)
  }, Qt.prototype.append = function(e) {
    var t;
    return Qt.isStreamLike(e) && (e instanceof In || (t = In.create(e, {
      maxDataSize: 1 / 0,
      pauseStream: this.pauseStreams
    }), e.on("data", this._checkDataSize.bind(this)), e = t), this._handleErrors(e), this.pauseStreams && e.pause()), this._streams.push(e), this
  }, Qt.prototype.pipe = function(e, t) {
    return Cn.prototype.pipe.call(this, e, t), this.resume(), e
  }, Qt.prototype._getNext = function() {
    if (this._currentStream = null, this._insideLoop) this._pendingNext = !0;
    else {
      this._insideLoop = !0;
      try {
        for (; this._pendingNext = !1, this._realGetNext(), this._pendingNext;);
      } finally {
        this._insideLoop = !1
      }
    }
  }, Qt.prototype._realGetNext = function() {
    var e = this._streams.shift();
    void 0 !== e ? "function" == typeof e ? e(function(e) {
      Qt.isStreamLike(e) && (e.on("data", this._checkDataSize.bind(this)), this._handleErrors(e)), this._pipeNext(e)
    }.bind(this)) : this._pipeNext(e) : this.end()
  }, Qt.prototype._pipeNext = function(e) {
    if (this._currentStream = e, Qt.isStreamLike(e)) return e.on("end", this._getNext.bind(this)), void e.pipe(this, {
      end: !1
    });
    this.write(e), this._getNext()
  }, Qt.prototype._handleErrors = function(e) {
    var t = this;
    e.on("error", function(e) {
      t._emitError(e)
    })
  }, Qt.prototype.write = function(e) {
    this.emit("data", e)
  }, Qt.prototype.pause = function() {
    this.pauseStreams && (this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.pause && this._currentStream.pause(), this.emit("pause"))
  }, Qt.prototype.resume = function() {
    this._released || (this._released = !0, this.writable = !0, this._getNext()), this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.resume && this._currentStream.resume(), this.emit("resume")
  }, Qt.prototype.end = function() {
    this._reset(), this.emit("end")
  }, Qt.prototype.destroy = function() {
    this._reset(), this.emit("close")
  }, Qt.prototype._reset = function() {
    this.writable = !1, this._streams = [], this._currentStream = null
  }, Qt.prototype._checkDataSize = function() {
    var e;
    this._updateDataSize(), this.dataSize <= this.maxDataSize || (e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.", this._emitError(new Error(e)))
  }, Qt.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var t = this;
    this._streams.forEach(function(e) {
      e.dataSize && (t.dataSize += e.dataSize)
    }), this._currentStream && this._currentStream.dataSize && (this.dataSize += this._currentStream.dataSize)
  }, Qt.prototype._emitError = function(e) {
    this._reset(), this.emit("error", e)
  };
  var On = /[^\x20-\x7E]/,
    Tn = /[\x2E\u3002\uFF0E\uFF61]/g,
    Ln = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    },
    Bn = yr,
    jn = pr,
    Un = /^([a-z0-9.+-]+:)/i,
    qn = /:[0-9]*$/,
    Mn = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    Wr = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
    Pn = ["'"].concat(Wr),
    Dn = ["%", "/", "?", ";", "#"].concat(Pn),
    zn = ["/", "?", "#"],
    Nn = /^[+a-z0-9A-Z_-]{0,63}$/,
    Fn = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    Yn = {
      javascript: !0,
      "javascript:": !0
    },
    Kn = {
      javascript: !0,
      "javascript:": !0
    },
    Wn = {
      http: !0,
      https: !0,
      ftp: !0,
      gopher: !0,
      file: !0,
      "http:": !0,
      "https:": !0,
      "ftp:": !0,
      "gopher:": !0,
      "file:": !0
    };
  ir.prototype.parse = function(e, t, r) {
    return ar(this, e, t, r)
  }, ir.prototype.format = function() {
    return sr(this)
  }, ir.prototype.resolve = function(e) {
    return this.resolveObject(or(e, !1, !0)).format()
  }, ir.prototype.resolveObject = function(e) {
    fe(e) && ((d = new ir).parse(e, !1, !0), e = d);
    for (var t, r = new ir, n = Object.keys(this), i = 0; i < n.length; i++) r[t = n[i]] = this[t];
    if (r.hash = e.hash, "" === e.href) return r.href = r.format(), r;
    if (e.slashes && !e.protocol) {
      for (var o, a = Object.keys(e), s = 0; s < a.length; s++) "protocol" !== (o = a[s]) && (r[o] = e[o]);
      return Wn[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r
    }
    if (e.protocol && e.protocol !== r.protocol) {
      if (!Wn[e.protocol]) {
        for (var u, h = Object.keys(e), f = 0; f < h.length; f++) r[u = h[f]] = e[u];
        return r.href = r.format(), r
      }
      if (r.protocol = e.protocol, e.host || Kn[e.protocol]) r.pathname = e.pathname;
      else {
        for (m = (e.pathname || "").split("/"); m.length && !(e.host = m.shift()););
        e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== m[0] && m.unshift(""), m.length < 2 && m.unshift(""), r.pathname = m.join("/")
      }
      return r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, (r.pathname || r.search) && (p = r.pathname || "", g = r.search || "", r.path = p + g), r.slashes = r.slashes || e.slashes, r.href = r.format(), r
    }
    var c, l = r.pathname && "/" === r.pathname.charAt(0),
      d = e.host || e.pathname && "/" === e.pathname.charAt(0),
      p = d || l || r.host && e.pathname,
      g = p,
      y = r.pathname && r.pathname.split("/") || [],
      l = r.protocol && !Wn[r.protocol],
      m = e.pathname && e.pathname.split("/") || [];
    if (l && (r.hostname = "", r.port = null, r.host && ("" === y[0] ? y[0] = r.host : y.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === m[0] ? m[0] = e.host : m.unshift(e.host)), e.host = null), p = p && ("" === m[0] || "" === y[0])), d) r.host = (e.host || "" === e.host ? e : r).host, r.hostname = (e.hostname || "" === e.hostname ? e : r).hostname, r.search = e.search, r.query = e.query, y = m;
    else if (m.length)(y = y || []).pop(), y = y.concat(m), r.search = e.search, r.query = e.query;
    else if (!ue(e.search)) return l && (r.hostname = r.host = y.shift(), (c = !!(r.host && 0 < r.host.indexOf("@")) && r.host.split("@")) && (r.auth = c.shift(), r.host = r.hostname = c.shift())), r.search = e.search, r.query = e.query, se(r.pathname) && se(r.search) || (r.path = (r.pathname || "") + (r.search || "")), r.href = r.format(), r;
    if (!y.length) return r.pathname = null, r.path = r.search ? "/" + r.search : null, r.href = r.format(), r;
    for (var v = y.slice(-1)[0], d = (r.host || e.host || 1 < y.length) && ("." === v || ".." === v) || "" === v, b = 0, w = y.length; 0 <= w; w--) "." === (v = y[w]) ? y.splice(w, 1) : ".." === v ? (y.splice(w, 1), b++) : b && (y.splice(w, 1), b--);
    if (!p && !g)
      for (; b--;) y.unshift("..");
    !p || "" === y[0] || y[0] && "/" === y[0].charAt(0) || y.unshift(""), d && "/" !== y.join("/").substr(-1) && y.push("");
    d = "" === y[0] || y[0] && "/" === y[0].charAt(0);
    return l && (r.hostname = r.host = !d && y.length ? y.shift() : "", (c = !!(r.host && 0 < r.host.indexOf("@")) && r.host.split("@")) && (r.auth = c.shift(), r.host = r.hostname = c.shift())), (p = p || r.host && y.length) && !d && y.unshift(""), y.length ? r.pathname = y.join("/") : (r.pathname = null, r.path = null), se(r.pathname) && se(r.search) || (r.path = (r.pathname || "") + (r.search || "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r
  }, ir.prototype.parseHost = function() {
    return ur(this)
  };
  var Jn = Qr.Transform;
  zr.inherits(hr, Jn), hr.prototype._transform = function(e, t, r) {
    0 == this._toSkip ? this.push(e) : this._toSkip > e.length ? this._toSkip -= e.length : (this._toSkip !== e.length && this.push(e.slice(this._toSkip)), this._toSkip = 0), r()
  };
  var Hn, Gn = function() {
      function d(e) {
        var t;
        return pt(this, d), (t = r.call(this)).checkConstructorArgument(e.downloadId), t.checkConstructorArgument(e.key), t.checkConstructorArgument(e.loadedFile), t.downloadId = e.downloadId, t.key = e.key ? At(e.key) : null, t.type = e.directory ? 1 : 0, t.directory = !!e.directory, Hn = Hn || new An(!1), t.api = Hn, t.loadedFile = e.loadedFile, t
      }
      mt(d, K);
      var r = Et(d);
      return yt(d, [{
        key: "checkConstructorArgument",
        value: function(e) {
          if ("string" == typeof e && !/^[\w-]+$/.test(e)) throw Error('Invalid argument: "'.concat(e, '"'))
        }
      }, {
        key: "loadMetadata",
        value: function(e, t) {
          var r;
          this.size = t.s || 0, this.timestamp = t.ts || 0, this.type = t.t, this.directory = !!t.t, this.owner = t.u, this.name = null, e && t.k && (r = t.k.split(":"), this.key = At(r[r.length - 1]), e.decryptECB(this.key), t.a && this.decryptAttributes(t.a))
        }
      }, {
        key: "decryptAttributes",
        value: function(e) {
          if (!this.key) return this;
          e = It(e), Ct(this.key).decryptCBC(e);
          e = d.unpackAttributes(e);
          return e && this.parseAttributes(e), this
        }
      }, {
        key: "parseAttributes",
        value: function(e) {
          this.attributes = e, this.name = e.n, this.label = $n[e.lbl || 0], this.favorited = !!e.fav
        }
      }, {
        key: "loadAttributes",
        value: function(c) {
          var l = this;
          "function" != typeof c && (c = function(e) {
            if (e) throw e
          });
          var e = this.directory ? {
            a: "f",
            c: 1,
            ca: 1,
            r: 1,
            _querystring: {
              n: this.downloadId
            }
          } : {
            a: "g",
            p: this.downloadId
          };
          return this.api.request(e, function(e, t) {
            if (e) return c(e);
            if (l.directory) {
              var r = Object.create(null),
                e = t.f,
                n = e.find(function(e) {
                  return e.k && e.h === e.k.split(":")[0]
                }),
                i = l.key ? new pn(l.key) : null;
              l.nodeId = n.h, l.timestamp = n.ts, r[n.h] = l;
              var o = Rt(e);
              try {
                for (o.s(); !(a = o.n()).done;) {
                  var a, s = a.value;
                  s !== n && ((a = new d(s, l.storage)).loadMetadata(i, s), a.downloadId = [l.downloadId, s.h], r[s.h] = a)
                }
              } catch (e) {
                o.e(e)
              } finally {
                o.f()
              }
              var u = Rt(e);
              try {
                for (u.s(); !(f = u.n()).done;) {
                  var h = f.value,
                    f = r[h.p];
                  f && (h = r[h.h], f.children || (f.children = []), f.children.push(h), h.parent = f)
                }
              } catch (e) {
                u.e(e)
              } finally {
                u.f()
              }
              if (l.loadMetadata(i, n), l.key && !l.attributes) return c(Error("Attributes could not be decrypted with provided key."));
              l.loadedFile ? void 0 === (e = r[l.loadedFile]) ? c(Error("Node (file or folder) not found in folder")) : c(null, e) : c(null, l)
            } else {
              if (l.size = t.s, l.decryptAttributes(t.at), l.key && !l.attributes) return c(Error("Attributes could not be decrypted with provided key."));
              c(null, l)
            }
          }), this
        }
      }, {
        key: "download",
        value: function(e, t) {
          "function" == typeof e && (t = e, e = {});
          var l = (e = e || {}).start || 0,
            d = e.returnCiphertext ? l : l - l % 16,
            p = e.end || null,
            g = e.maxConnections || 4,
            y = e.initialChunkSize || 131072,
            m = e.chunkSizeIncrement || 131072,
            v = e.maxChunkSize || 1048576,
            b = e.mvTargetElement,
            w = e.mvFileSize,
            r = {
              a: "g",
              g: 1,
              ssl: 2
            };
          if (this.nodeId ? r.n = this.nodeId : Array.isArray(this.downloadId) ? (r._querystring = {
              n: this.downloadId[0]
            }, r.n = this.downloadId[1]) : r.p = this.downloadId, this.directory) throw Error("Can't download: folder download isn't supported");
          if (!this.key && !e.returnCiphertext) throw Error("Can't download: key isn't defined");
          var E = this.key && !e.returnCiphertext ? Tt(this.key, {
              start: d,
              disableVerification: 0 !== d || null !== p
            }) : new ut,
            _ = d === l ? E : E.pipe(new hr({
              skip: l - d
            })),
            n = this.api || Hn,
            k = e.requestModule || this.api.requestModule;
          return n.request(r, function(e, n) {
            function i(e) {
              if (200 !== e.statusCode) {
                if (509 === e.statusCode) {
                  var t = e.headers["x-mega-time-left"],
                    r = Error("Bandwidth limit reached: " + t + " seconds until it resets");
                  return r.timeLimit = t, void _.emit("error", r)
                }
                _.emit("error", Error("MEGA returned a " + e.statusCode + " status code"))
              }
            }

            function o(e) {
              _.emit("error", Error("Connection error: " + e.message))
            }
            if (e) return _.emit("error", e);
            if ("string" != typeof n.g || "http" !== n.g.substr(0, 4)) return _.emit("error", Error("MEGA servers returned an invalid response, maybe caused by rate limit"));
            if ((p = p || n.s - 1) < l) return _.emit("error", Error("You can't download past the end of the file."));
            if (1 === g) {
              var t = k(n.g + "/" + d + "-" + p);
              t.on("error", o), t.on("response", i), t.pipe(E), _.on("close", function() {
                t.abort()
              })
            } else {
              var a = Qt.create(),
                s = d,
                u = y,
                h = !1;
              _.on("error", function() {
                h = !0
              }), _.on("close", function() {
                h = !0
              });
              var r = function e() {
                var t, r;
                h || ((t = gr(p, s + u - 1)) < s || (r = k(n.g + "/" + s + "-" + t), b.closest(".mega-file-div").style.backgroundSize = String(100 * t / w) + "%", b.innerText = String(Math.round(1e3 * t / w) / 10) + "%", r.on("end", e), r.on("error", o), r.on("response", i), a.append(r), s = t + 1, u < v && (u += m)))
              };
              a.on("error", function(e) {
                return _.emit("error", e)
              });
              for (var f = 0; f < g; f++) r();
              a.pipe(E)
            }
            var c = 0;
            _.on("data", function(e) {
              c += e.length, _.emit("progress", {
                bytesLoaded: c,
                bytesTotal: n.s
              })
            })
          }), t && ct(_, t), _
        }
      }, {
        key: "link",
        value: function(e, t) {
          1 === arguments.length && "function" == typeof e && (t = e, e = {
            noKey: !1
          }), "boolean" == typeof e && (e = {
            noKey: e
          });
          var r = "https://mega.nz/".concat(this.directory ? "folder" : "file", "/").concat(this.downloadId);
          !e.noKey && this.key && (r += "#".concat(xt(this.key))), !e.noKey && this.loadedFile && (r += "/file/".concat(this.loadedFile)), t(null, r)
        }
      }, {
        key: "createdAt",
        get: function() {
          if (void 0 !== this.timestamp) return 1e3 * this.timestamp
        }
      }], [{
        key: "fromURL",
        value: function(e) {
          if ("object" === dt(e)) return new d(e);
          var t = or(e);
          if ("mega.nz" !== t.hostname && "mega.co.nz" !== t.hostname) throw Error("Invalid URL: wrong hostname");
          if (!t.hash) throw Error("Invalid URL: no hash");
          if (null !== t.path.match(/\/(file|folder)\//)) {
            var r = t.hash.substr(1).split("/file/"),
              n = t.path.substring(t.path.lastIndexOf("/") + 1, t.path.length + 1),
              e = r[0];
            if (n && !e || !n && e) throw Error("Invalid URL: too few arguments");
            return new d({
              downloadId: n,
              key: e,
              directory: 0 <= t.path.indexOf("/folder/"),
              loadedFile: r[1]
            })
          }
          t = t.hash.split("!");
          if ("#" !== t[0] && "#F" !== t[0]) throw Error("Invalid URL: format not recognized");
          if (t.length <= 1) throw Error("Invalid URL: too few arguments");
          if (t.length >= ("#" === t[0] ? 4 : 5)) throw Error("Invalid URL: too many arguments");
          return new d({
            downloadId: t[1],
            key: t[2],
            directory: "#F" === t[0],
            loadedFile: t[3]
          })
        }
      }, {
        key: "unpackAttributes",
        value: function(e) {
          for (var t = 0; t < e.length && e.readUInt8(t);) t++;
          if ('MEGA{"' === (e = e.slice(0, t).toString()).substr(0, 6)) try {
            return JSON.parse(e.substr(4))
          } catch (t) {}
        }
      }]), d
    }(),
    $n = ["", "red", "orange", "yellow", "green", "blue", "purple", "grey"],
    Xn = {},
    Vn = function() {
      function c(e, t) {
        var r;
        if (pt(this, c), (r = h.call(this, e)).storage = t, r.api = t.api, r.nodeId = e.h, r.timestamp = e.ts, r.type = e.t, r.directory = !!r.type, e.k) {
          var n = e.k.split("/"),
            i = t.aes,
            o = Rt(n);
          try {
            for (o.s(); !(u = o.n()).done;) {
              var a = u.value,
                s = a.split(":")[0];
              if (s === t.user) {
                e.k = a;
                break
              }
              var u = t.shareKeys[s];
              if (u) {
                e.k = a, i = (i = Xn[s]) || (Xn[s] = new pn(u));
                break
              }
            }
          } catch (e) {
            o.e(e)
          } finally {
            o.f()
          }
          r.loadMetadata(i, e)
        }
        return r
      }
      var s = Math.ceil;
      mt(c, Gn);
      var h = Et(c);
      return yt(c, [{
        key: "loadAttributes",
        value: function() {
          throw Error("This is not needed for files loaded from logged in sessions")
        }
      }, {
        key: "mkdir",
        value: function(e, r) {
          var n = this;
          if (!this.directory) throw Error("node isn't a directory");
          if ("string" == typeof e && (e = {
              name: e
            }), e.attributes || (e.attributes = {}), e.name && (e.attributes.n = e.name), !e.attributes.n) throw Error("file name is required");
          if (e.target || (e.target = this), e.key || (e.key = R.from(cn(16))), 16 !== e.key.length) throw Error("wrong key length, must be 128bit");
          var t = e.key,
            i = c.packAttributes(e.attributes);
          Ct(t).encryptCBC(i);
          var o = R.from(t);
          this.storage.aes.encryptECB(o);
          i = {
            a: "p",
            t: e.target.nodeId || e.target,
            n: [{
              h: "xxxxxxxx",
              t: 1,
              a: xt(i),
              k: xt(o)
            }]
          }, o = lr(this.storage.shareKeys, this);
          0 < o.length && (i.cr = fr(this.storage, [{
            nodeId: "xxxxxxxx",
            key: t
          }], o)), this.api.request(i, function(e, t) {
            if (e) return e = e, void(r && r(e));
            t = n.storage._importFile(t.f[0]);
            n.storage.emit("add", t), r && r(null, t)
          })
        }
      }, {
        key: "upload",
        value: function(i, e, o) {
          var a = this;
          if (!this.directory) throw Error("node is not a directory");
          if (2 === arguments.length && "function" == typeof e && (o = (r = [e, null])[0], e = r[1]), "string" == typeof i && (i = {
              name: i
            }), i.attributes || (i.attributes = {}), i.name && (i.attributes.n = i.name), !i.attributes.n) throw Error("File name is required.");
          i.target || (i.target = this);
          var s, t = At(i.key);
          (t = t || cn(24)) instanceof R || (t = R.from(t));
          var r = i.uploadCiphertext ? 32 : 24;
          if (t.length !== r) throw Error("Wrong key length. Key must be 192bit");
          i.uploadCiphertext && (t = Lt(s = t).slice(0, 24)), i.key = t;
          var u = [],
            t = function(e, t, r, n) {
              if (e) return f(e);
              r && 0 !== r.length ? (e = +r.toString()) < 0 ? f(Error("Server returned error " + e + " while uploading")) : (u[t] = r, 0 !== t || s || (s = n.key), i.thumbnailImage && !u[1] || i.previewImage && !u[2] || !u[0] || (r = c.packAttributes(i.attributes), Ct(s).encryptCBC(r), t = R.from(s), a.storage.aes.encryptECB(t), n = {
                h: xt(u[0]),
                t: 0,
                a: xt(r),
                k: xt(t)
              }, 1 !== u.length && (n.fa = u.slice(1).map(function(e, t) {
                return t + "*" + xt(e)
              }).filter(function(e) {
                return e
              }).join("/")), r = {
                a: "p",
                t: i.target.nodeId || i.target,
                n: [n]
              }, 0 < (t = lr(a.storage.shareKeys, a)).length && (r.cr = fr(a.storage, [{
                nodeId: n.h,
                key: s
              }], t)), a.api.request(r, function(e, t) {
                if (e) return f(e);
                t = a.storage._importFile(t.f[0]);
                a.storage.emit("add", t), h.emit("complete", t), o && o(null, t)
              }))) : f(Error("Server returned a invalid response while uploading"))
            };
          i.thumbnailImage && this._uploadAttribute(i, i.thumbnailImage, 1, t), i.previewImage && this._uploadAttribute(i, i.previewImage, 2, t);
          var h = this._upload(i, e, 0, t),
            f = function(e) {
              o ? o(e) : h.emit("error", e)
            };
          return h
        }
      }, {
        key: "_upload",
        value: function(t, e, r, n) {
          var i, o, a, s = this,
            u = t.uploadCiphertext ? en() : Ot(t.key),
            h = en().pause(),
            f = Zr(h, u),
            c = t.size;
          return e && "function" != typeof e.pipe && (c = e.length, f.end(e)), c ? this._uploadWithSize(f, c, u, h, r, t, n) : f = Zr((i = function(e) {
            s._uploadWithSize(f, e, u, h, r, t, n)
          }, o = [], a = 0, en(function(e) {
            o.push(e), a += e.length
          }, function() {
            i(a), o.forEach(this.emit.bind(this, "data")), this.emit("end")
          })), f), e && "function" == typeof e.pipe && e.pipe(f), f
        }
      }, {
        key: "_uploadAttribute",
        value: function(n, e, i, o) {
          function t(e, t) {
            if (e) return o(e);
            var r = t.length;
            0 != (e = 16 * s(r / 16) - r) && (t = R.concat([t, R.alloc(e)])), (n.handle ? Ct(n.key) : new pn(n.key.slice(0, 16))).encryptCBC(t), r = en().pause(), (e = Zr(r)).end(t), a._uploadWithSize(e, t.length, e, r, i, n, o)
          }
          var a = this;
          return e instanceof R ? void t(null, e) : void ct(e, t)
        }
      }, {
        key: "_uploadWithSize",
        value: function(t, r, n, i, o, e, a) {
          var s = this,
            u = 0 === o ? {
              a: "u",
              ssl: 2,
              s: r,
              ms: 0,
              r: 0,
              e: 0,
              v: 2
            } : {
              a: "ufa",
              ssl: 2,
              s: r
            };
          e.handle && (u.h = e.handle);

          function h() {
            d = gr(b, r - _), c = R.alloc(d), w++, b < m && (b += y), p = 0, f && (f.copy(c), p = gr(f.length, d), f = f.length > d ? f.slice(d) : null), p === d ? k() : (E = !0, i.resume())
          }
          var f, c, l, d, p, g = 0 === o ? e.initialChunkSize || 131072 : r,
            y = e.chunkSizeIncrement || 131072,
            m = e.maxChunkSize || 1048576,
            v = e.maxConnections || 4,
            b = g,
            w = 0,
            E = !1,
            _ = 0,
            k = function() {
              var e = s.api.requestModule({
                method: "POST",
                body: c,
                uri: l + "/" + (0 === o ? _ : o - 1),
                forever: !0
              });
              e.on("error", function(e) {
                t.emit("error", Error("Connection error: " + e.message))
              }), e.on("response", function(e) {
                200 === e.statusCode || t.emit("error", Error("MEGA returned a " + e.statusCode + " status code"))
              }), c = null, _ += d, ct(e, function(e, t) {
                e || !t || 0 < t.length ? (n.end(), a(e, o, t, n)) : _ < r && !E && h()
              }), _ < r && !E && w < v && h()
            },
            S = 0;
          n.on("data", function(e) {
            S += e.length, t.emit("progress", {
              bytesLoaded: S,
              bytesTotal: r
            }), e.copy(c, p), p += e.length, d <= p && (E = !1, i.pause(), f = e.slice(e.length - (p - d)), k())
          }), n.on("end", function() {
            r && S !== r && t.emit("error", Error("Specified data size does not match: " + r + " !== " + S))
          }), this.api.request(u, function(e, t) {
            return e ? a(e) : (l = t.p, void h())
          })
        }
      }, {
        key: "uploadAttribute",
        value: function(n, e, i) {
          var o = this;
          if ("string" == typeof n && (n = ["thumbnail", "preview"].indexOf(n)), 0 !== n && 1 !== n) throw Error("Invalid attribute type");
          this._uploadAttribute({
            key: this.key,
            handle: this.nodeId
          }, e, n + 1, function(e, t, r) {
            if (e) return i(e);
            r = {
              a: "pfa",
              n: o.nodeId,
              fa: n + "*" + xt(r)
            };
            o.api.request(r, function(e) {
              return e ? i(e) : void i(null, o)
            })
          })
        }
      }, {
        key: "delete",
        value: function(e, t) {
          return "function" == typeof e && (t = e, e = void 0), void 0 === e && (e = this.parent === this.storage.trash), e ? this.api.request({
            a: "d",
            n: this.nodeId
          }, t) : this.moveTo(this.storage.trash, t), this
        }
      }, {
        key: "moveTo",
        value: function(e, t) {
          if ("string" == typeof e && (e = this.storage.files[e]), !(e instanceof Gn)) throw Error("target must be a folder or a nodeId");
          var r = {
              a: "m",
              n: this.nodeId,
              t: e.nodeId
            },
            e = lr(this.storage.shareKeys, e);
          return 0 < e.length && (r.cr = fr(this.storage, [this], e)), this.api.request(r, t), this
        }
      }, {
        key: "setAttributes",
        value: function(e, t) {
          var r = this;
          Object.assign(this.attributes, e);
          e = c.packAttributes(this.attributes);
          return Ct(this.key).encryptCBC(e), this.api.request({
            a: "a",
            n: this.nodeId,
            at: xt(e)
          }, function() {
            r.parseAttributes(r.attributes), t && t()
          }), this
        }
      }, {
        key: "rename",
        value: function(e, t) {
          return this.setAttributes({
            n: e
          }, t), this
        }
      }, {
        key: "setLabel",
        value: function(e, t) {
          if ("string" == typeof e && (e = $n.indexOf(e)), "number" != typeof e || yr(e) !== e || e < 0 || 7 < e) throw Error("label must be a integer between 0 and 7 or a valid label name");
          return this.setAttributes({
            lbl: e
          }, t), this
        }
      }, {
        key: "setFavorite",
        value: function(e, t) {
          return this.setAttributes({
            fav: e ? 1 : 0
          }, t), this
        }
      }, {
        key: "link",
        value: function(r, n) {
          var i = this;
          1 === arguments.length && "function" == typeof r && (n = r, r = {
            noKey: !1
          }), "boolean" == typeof r && (r = {
            noKey: r
          });
          var o = r.__folderKey;
          return this.directory && !o ? this.shareFolder(r, n) : this.api.request({
            a: "l",
            n: this.nodeId
          }, function(e, t) {
            if (e) return n(e);
            t = "https://mega.nz/".concat(o ? "folder" : "file", "/").concat(t);
            !r.noKey && i.key && (t += "#".concat(xt(o || i.key))), n(null, t)
          }), this
        }
      }, {
        key: "shareFolder",
        value: function(t, r) {
          var n = this;
          if (!this.directory) throw Error("node isn't a folder");
          var e = this.nodeId,
            i = this.storage.shareKeys[e];
          if (i) return this.link(Object.assign({
            __folderKey: i
          }, t), r), this;
          var o = At(t.key);
          if ((o = o || cn(16)) instanceof R || (o = R.from(o)), 16 === o.length) {
            this.storage.shareKeys[e] = o;
            i = R.from(e + e);
            this.storage.aes.encryptECB(i);
            i = {
              a: "s2",
              n: e,
              s: [{
                u: "EXP",
                r: 0
              }],
              ok: xt(this.storage.aes.encryptECB(R.from(o))),
              ha: xt(i),
              cr: fr(this.storage, this)
            };
            return this.api.request(i, function(e) {
              return e ? r(e) : void n.link(Object.assign({
                __folderKey: o
              }, t), r)
            }), this
          }
          D(function() {
            r(Error("share key must be 16 byte / 22 characters"))
          })
        }
      }, {
        key: "unshareFolder",
        value: function(e, t) {
          var r = {
            a: "s2",
            n: this.nodeId,
            s: [{
              u: "EXP",
              r: ""
            }]
          };
          return delete this.storage.shareKeys[this.nodeId], this.api.request(r, function() {
            t && t()
          }), this
        }
      }, {
        key: "importFile",
        value: function(e, n) {
          var i = this;
          if (!this.directory) throw Error("importFile can only be called on directories");
          if ("string" == typeof e && (e = Gn.fromURL(e)), !(e instanceof Gn)) throw Error("First argument of importFile should be a File or a URL string");
          if (!e.key) return n(Error("Can't import files without encryption keys"));

          function t(e, t) {
            if (e) return n(e);
            var r = c.packAttributes(t.attributes);
            Ct(t.key).encryptCBC(r), e = Array.isArray(t.downloadId) ? t.downloadId[1] : t.downloadId, t = {
              a: "p",
              t: i.nodeId,
              n: [{
                ph: e,
                t: 0,
                a: xt(r),
                k: xt(i.storage.aes.encryptECB(t.key))
              }]
            }, i.api.request(t, function(e, t) {
              if (e) return n(e);
              t = i.storage._importFile(t.f[0]);
              i.storage.emit("add", t), n && n(null, t)
            })
          }
          return e.attributes ? D(t, null, e) : e.loadAttributes(t), this
        }
      }], [{
        key: "packAttributes",
        value: function(e) {
          var t = JSON.stringify(e),
            t = R.from("MEGA".concat(t)),
            e = R.alloc(16 * s(t.length / 16));
          return t.copy(e), e
        }
      }]), c
    }(),
    Zn = function() {
      function n(e, t) {
        var r;
        if (pt(this, n), r = i.call(this), 1 === arguments.length && "function" == typeof e && (t = e, e = {}), !e.email) throw Error("starting a session without credentials isn't supported");
        return t = t || function(e) {
          if (e) throw e
        }, e.keepalive = void 0 === e.keepalive || !!e.keepalive, e.autoload = void 0 === e.autoload || !!e.autoload, e.autologin = void 0 === e.autologin || !!e.autologin, r.api = new An(e.keepalive), r.files = {}, (r.options = e).autologin ? r.login(t) : D(function() {
          return t(null, wt(r))
        }), r.status = "closed", r
      }
      mt(n, K);
      var i = Et(n);
      return yt(n, [{
        key: "login",
        value: function(r) {
          function o() {
            a.status = "ready", r(null, a), a.emit("ready", a)
          }
          var a = this;
          this.email = this.options.email.toLowerCase();

          function n(e) {
            var t = function(e) {
              for (var t, r = [2479122403, 2108737444, 3518906241, 22203222], n = 65536; n--;)
                for (t = 0; t < e.length; t += 16) {
                  for (var i = [0, 0, 0, 0], o = 0; o < 16; o += 4) o + t < e.length && (i[o / 4] = e.readInt32BE(o + t));
                  r = new ln(i).encrypt(r)
                }
              var a = R.allocUnsafe(16);
              for (o = 0; o < 4; o++) a.writeInt32BE(r[o], 4 * o);
              return a
            }(R.from(a.options.password));
            delete a.options.password;
            var r = new pn(t),
              t = xt(r.stringhash(R.from(a.email))),
              t = {
                a: "us",
                user: a.email,
                uh: t
              };
            s(t, r, e)
          }

          function i(e, r) {
            var t, n, i;
            t = R.from(a.options.password), n = function(e, t) {
              if (e) return r(e);
              delete a.options.password;
              e = new pn(t.slice(0, 16)), t = xt(t.slice(16)), t = {
                a: "us",
                user: a.email,
                uh: t
              };
              s(t, e, r)
            }, i = R.from(e.s, "base64"), window.crypto.subtle.importKey("raw", t, {
              name: "PBKDF2"
            }, !1, ["deriveKey", "deriveBits"]).then(function(e) {
              return window.crypto.subtle.deriveBits({
                name: "PBKDF2",
                salt: i,
                iterations: 1e5,
                hash: {
                  name: "SHA-512"
                }
              }, e, 256)
            }).then(function(e) {
              n(null, R.from(e))
            }).catch(n)
          }
          var s = function(e, n, i) {
            a.api.request(e, function(e, t) {
              if (e) return i(e);
              a.key = At(t.k), n.decryptECB(a.key), a.aes = new pn(a.key);
              e = At(t.csid), t = function(e) {
                for (var t, r = [], n = 0; n < 4; n++) {
                  if (t = 2 + (256 * e[0] + e[1] + 7 >> 3), r[n] = Kt(e.toString("binary").substr(0, t)), "number" == typeof r[n]) {
                    if (4 !== n || 16 <= e.length) return !1;
                    break
                  }
                  e = e.slice(t)
                }
                return r
              }(a.aes.decryptECB(At(t.privk)));
              if (!t) throw Error("invalid credentials");
              var r, e = xt(Wt(e, t).slice(0, 43));
              a.api.sid = a.sid = e, a.RSAPrivateKey = t, r = i, a.api.request({
                a: "ug"
              }, function(e, t) {
                return e ? r(e) : (a.name = t.name, a.user = t.u, void(a.options.autoload ? a.reload(!0, function(e) {
                  return e ? r(e) : void o()
                }) : o()))
              })
            })
          };
          this.api.request({
            a: "us0",
            user: this.email
          }, function(e, t) {
            return e ? r(e) : 1 === t.v ? n(r) : 2 === t.v ? i(t, r) : void r(Error("Account version not supported"))
          }), this.status = "connecting"
        }
      }, {
        key: "reload",
        value: function(e, r) {
          var t, i = this;
          return "function" == typeof e && (e = (t = [r, e])[0], r = t[1]), "connecting" !== this.status || e ? (this.mounts = [], this.api.request({
            a: "f",
            c: 1
          }, function(e, t) {
            return e ? r(e) : (i.shareKeys = t.ok.reduce(function(e, t) {
              var r = t.h,
                n = i.aes.encryptECB(R.from(r + r));
              return function(e, t) {
                if (e.length === t.length) {
                  for (var r = e.length, n = 0, i = 0; i < r; i++) n |= e[i] ^ t[i];
                  return 0 === n
                }
              }(At(t.ha), n) && (e[r] = i.aes.decryptECB(At(t.k))), e
            }, {}), t.f.forEach(function(e) {
              return i._importFile(e)
            }), void r(null, i.mounts))
          }), void this.api.on("sc", function(e) {
            var n = {};
            e.forEach(function(e) {
              var t;
              "u" === e.a ? (t = i.files[e.n]) && (t.timestamp = e.ts, t.decryptAttributes(e.at), t.emit("update"), i.emit("update", t)) : "d" === e.a ? n[e.n] = !0 : "t" === e.a && e.t.f.forEach(function(e) {
                var t, r = i.files[e.h];
                r ? (delete n[e.h], (t = r.parent).nodeId !== e.p && (t.children.splice(t.children.indexOf(r), 1), r.parent = i.files[e.p], r.parent.children || (r.parent.children = []), r.parent.children.push(r), r.emit("move", t), i.emit("move", r, t))) : i.emit("add", i._importFile(e))
              })
            }), Object.keys(n).forEach(function(e) {
              var t = i.files[e],
                e = t.parent;
              e.children.splice(e.children.indexOf(t), 1), i.emit("delete", t), t.emit("delete")
            })
          })) : this.once("ready", this.reload.bind(this, e, r))
        }
      }, {
        key: "_importFile",
        value: function(e) {
          var t, r;
          return this.files[e.h] || (t = this.files[e.h] = new Vn(e, this), 2 === e.t && ((this.root = t).name = "Cloud Drive"), 4 === e.t && ((this.trash = t).name = "Rubbish Bin"), 3 === e.t && ((this.inbox = t).name = "Inbox"), 1 < e.t && this.mounts.push(t), e.p && (r = this.files[e.p]) && (r.children || (r.children = []), r.children.push(t), t.parent = r)), this.files[e.h]
        }
      }, {
        key: "mkdir",
        value: function(e, t) {
          var r = this;
          return "ready" === this.status ? this.root.mkdir(e, t) : void this.on("ready", function() {
            return r.root.mkdir(e, t)
          })
        }
      }, {
        key: "upload",
        value: function(e, t, r) {
          var n = this;
          return "ready" === this.status ? this.root.upload(e, t, r) : void this.on("ready", function() {
            return n.root.upload(e, t, r)
          })
        }
      }, {
        key: "close",
        value: function() {
          this.status = "closed", this.api.close()
        }
      }, {
        key: "getAccountInfo",
        value: function(r) {
          this.api.request({
            a: "uq",
            strg: 1,
            xfer: 1,
            pro: 1
          }, function(e, t) {
            e && r(e);
            e = {};
            e.type = t.utype, e.spaceUsed = t.cstrg, e.spaceTotal = t.mstrg, e.downloadBandwidthTotal = t.mxfer || 0x28000000000000, e.downloadBandwidthUsed = t.caxfer || 0, e.sharedBandwidthUsed = t.csxfer || 0, e.sharedBandwidthLimit = t.srvratio, r(null, e)
          })
        }
      }, {
        key: "toJSON",
        value: function() {
          return {
            key: xt(this.key),
            sid: this.sid,
            name: this.name,
            user: this.user,
            options: this.options
          }
        }
      }], [{
        key: "fromJSON",
        value: function(e) {
          var t = new n(Object.assign(e.options, {
            autoload: !1,
            autologin: !1
          }));
          return t.key = It(e.key), t.aes = new pn(t.key), t.api.sid = t.sid = e.sid, t.name = e.name, t.user = e.user, t
        }
      }]), n
    }();
  return dr.Storage = Zn, dr.File = Gn, dr.file = Gn.fromURL, dr.encrypt = Ot, dr.decrypt = Tt, dr
});

function init() {
  function e(e) {
    return new Promise(t => setTimeout(t, e))
  }

  function t(e, t) {
    e || (document.querySelector("#bs").innerText = "MEGAsync로 보냄!")
  }

  function n(e, t, n) {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://localhost.megasyncloopback.mega.nz:6342/",
      data: JSON.stringify(e),
      headers: {
        "Content-Type": "text/plain"
      },
      onload: function(e) {
        t(JSON.parse(e.responseText), n)
      }
    })
  }

  function i(e, i) {
    if (e.u)
      if (i.includes("file")) {
        let e = i.split("file/")[1].split("#");
        n({
          a: "l",
          h: e[0],
          k: e[1]
        }, t)
      } else document.querySelector("#bs").innerText = "폴더 링크는 지원하지 않습니다..."
  }!async function() {
    let t = !1;
    for (; !t;) {
      await e(500);
      let o = document.querySelector("#ga"),
        u = document.querySelector("#bs");
      if (o && u) {
        t = !0;
        let e = o.getAttribute("value"),
          u = document.querySelector("#bs");
        u.removeAttribute("onclick"), u.onclick = function() {
          n({
            a: "v"
          }, i, atob(e.split("").reverse().join("")))
        }
      }
    }
  }()
}
