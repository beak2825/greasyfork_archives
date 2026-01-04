// ==UserScript==
// @name         TriFlank Script
// @description  press t
// @version      0.1
// @author       pd/kirimochi
// @namespace    *://diep.io/
// @match        *://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442082/TriFlank%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/442082/TriFlank%20Script.meta.js
// ==/UserScript==
var _createClass = function() {
        function n(t, e) {
            for (var r = 0; r < e.length; r++) {
                var n = e[r];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
            }
        }
        return function(t, e, r) {
            return e && n(t.prototype, e), r && n(t, r), t
        }
    }(),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    };
 
function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}! function o(s, u, a) {
    function f(e, t) {
        if (!u[e]) {
            if (!s[e]) {
                var r = "function" == typeof require && require;
                if (!t && r) return r(e, !0);
                if (h) return h(e, !0);
                var n = new Error("Cannot find module '" + e + "'");
                throw n.code = "MODULE_NOT_FOUND", n
            }
            var i = u[e] = {
                exports: {}
            };
            s[e][0].call(i.exports, function(t) {
                return f(s[e][1][t] || t)
            }, i, i.exports, o, s, u, a)
        }
        return u[e].exports
    }
    for (var h = "function" == typeof require && require, t = 0; t < a.length; t++) f(a[t]);
    return f
}({
    1: [function(t, e, r) {
        "use strict";
        r.byteLength = function(t) {
            var e = c(t),
                r = e[0],
                n = e[1];
            return 3 * (r + n) / 4 - n
        }, r.toByteArray = function(t) {
            var e, r, n = c(t),
                i = n[0],
                o = n[1],
                s = new h(function(t, e, r) {
                    return 3 * (e + r) / 4 - r
                }(0, i, o)),
                u = 0,
                a = 0 < o ? i - 4 : i;
            for (r = 0; r < a; r += 4) e = f[t.charCodeAt(r)] << 18 | f[t.charCodeAt(r + 1)] << 12 | f[t.charCodeAt(r + 2)] << 6 | f[t.charCodeAt(r + 3)], s[u++] = e >> 16 & 255, s[u++] = e >> 8 & 255, s[u++] = 255 & e;
            2 === o && (e = f[t.charCodeAt(r)] << 2 | f[t.charCodeAt(r + 1)] >> 4, s[u++] = 255 & e);
            1 === o && (e = f[t.charCodeAt(r)] << 10 | f[t.charCodeAt(r + 1)] << 4 | f[t.charCodeAt(r + 2)] >> 2, s[u++] = e >> 8 & 255, s[u++] = 255 & e);
            return s
        }, r.fromByteArray = function(t) {
            for (var e, r = t.length, n = r % 3, i = [], o = 0, s = r - n; o < s; o += 16383) i.push(a(t, o, s < o + 16383 ? s : o + 16383));
            1 == n ? (e = t[r - 1], i.push(u[e >> 2] + u[e << 4 & 63] + "==")) : 2 == n && (e = (t[r - 2] << 8) + t[r - 1], i.push(u[e >> 10] + u[e >> 4 & 63] + u[e << 2 & 63] + "="));
            return i.join("")
        };
        for (var u = [], f = [], h = "undefined" != typeof Uint8Array ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, o = n.length; i < o; ++i) u[i] = n[i], f[n.charCodeAt(i)] = i;
 
        function c(t) {
            var e = t.length;
            if (0 < e % 4) throw new Error("Invalid string. Length must be a multiple of 4");
            var r = t.indexOf("=");
            return -1 === r && (r = e), [r, r === e ? 0 : 4 - r % 4]
        }
 
        function a(t, e, r) {
            for (var n, i, o = [], s = e; s < r; s += 3) n = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (255 & t[s + 2]), o.push(u[(i = n) >> 18 & 63] + u[i >> 12 & 63] + u[i >> 6 & 63] + u[63 & i]);
            return o.join("")
        }
        f["-".charCodeAt(0)] = 62, f["_".charCodeAt(0)] = 63
    }, {}],
    2: [function(L, t, R) {
        (function(c) {
            "use strict";
            var n = L("base64-js"),
                o = L("ieee754"),
                t = "function" == typeof Symbol ? Symbol.for("nodejs.util.inspect.custom") : null;
            R.Buffer = c, R.SlowBuffer = function(t) {
                +t != t && (t = 0);
                return c.alloc(+t)
            }, R.INSPECT_MAX_BYTES = 50;
            var r = 2147483647;
 
            function s(t) {
                if (r < t) throw new RangeError('The value "' + t + '" is invalid for option "size"');
                var e = new Uint8Array(t);
                return Object.setPrototypeOf(e, c.prototype), e
            }
 
            function c(t, e, r) {
                if ("number" != typeof t) return i(t, e, r);
                if ("string" == typeof e) throw new TypeError('The "string" argument must be of type string. Received type number');
                return a(t)
            }
 
            function i(t, e, r) {
                if ("string" == typeof t) return function(t, e) {
                    "string" == typeof e && "" !== e || (e = "utf8");
                    if (!c.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
                    var r = 0 | l(t, e),
                        n = s(r),
                        i = n.write(t, e);
                    i !== r && (n = n.slice(0, i));
                    return n
                }(t, e);
                if (ArrayBuffer.isView(t)) return f(t);
                if (null == t) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + (void 0 === t ? "undefined" : _typeof(t)));
                if (x(t, ArrayBuffer) || t && x(t.buffer, ArrayBuffer)) return function(t, e, r) {
                    if (e < 0 || t.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
                    if (t.byteLength < e + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
                    var n;
                    n = void 0 === e && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, e) : new Uint8Array(t, e, r);
                    return Object.setPrototypeOf(n, c.prototype), n
                }(t, e, r);
                if ("number" == typeof t) throw new TypeError('The "value" argument must not be of type number. Received type number');
                var n = t.valueOf && t.valueOf();
                if (null != n && n !== t) return c.from(n, e, r);
                var i = function(t) {
                    if (c.isBuffer(t)) {
                        var e = 0 | h(t.length),
                            r = s(e);
                        return 0 === r.length || t.copy(r, 0, 0, e), r
                    }
                    if (void 0 !== t.length) return "number" != typeof t.length || K(t.length) ? s(0) : f(t);
                    if ("Buffer" === t.type && Array.isArray(t.data)) return f(t.data)
                }(t);
                if (i) return i;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive]) return c.from(t[Symbol.toPrimitive]("string"), e, r);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + (void 0 === t ? "undefined" : _typeof(t)))
            }
 
            function u(t) {
                if ("number" != typeof t) throw new TypeError('"size" argument must be of type number');
                if (t < 0) throw new RangeError('The value "' + t + '" is invalid for option "size"')
            }
 
            function a(t) {
                return u(t), s(t < 0 ? 0 : 0 | h(t))
            }
 
            function f(t) {
                for (var e = t.length < 0 ? 0 : 0 | h(t.length), r = s(e), n = 0; n < e; n += 1) r[n] = 255 & t[n];
                return r
            }
 
            function h(t) {
                if (r <= t) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
                return 0 | t
            }
 
            function l(t, e) {
                if (c.isBuffer(t)) return t.length;
                if (ArrayBuffer.isView(t) || x(t, ArrayBuffer)) return t.byteLength;
                if ("string" != typeof t) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + (void 0 === t ? "undefined" : _typeof(t)));
                var r = t.length,
                    n = 2 < arguments.length && !0 === arguments[2];
                if (!n && 0 === r) return 0;
                for (var i = !1;;) switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return r;
                    case "utf8":
                    case "utf-8":
                        return B(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * r;
                    case "hex":
                        return r >>> 1;
                    case "base64":
                        return C(t).length;
                    default:
                        if (i) return n ? -1 : B(t).length;
                        e = ("" + e).toLowerCase(), i = !0
                }
            }
 
            function p(t, e, r) {
                var n = t[e];
                t[e] = t[r], t[r] = n
            }
 
            function y(t, e, r, n, i) {
                if (0 === t.length) return -1;
                if ("string" == typeof r ? (n = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), K(r = +r) && (r = i ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
                    if (i) return -1;
                    r = t.length - 1
                } else if (r < 0) {
                    if (!i) return -1;
                    r = 0
                }
                if ("string" == typeof e && (e = c.from(e, n)), c.isBuffer(e)) return 0 === e.length ? -1 : d(t, e, r, n, i);
                if ("number" == typeof e) return e &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : d(t, [e], r, n, i);
                throw new TypeError("val must be string, number or Buffer")
            }
 
            function d(t, e, r, n, i) {
                var o, s = 1,
                    u = t.length,
                    a = e.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (t.length < 2 || e.length < 2) return -1;
                    u /= s = 2, a /= 2, r /= 2
                }
 
                function f(t, e) {
                    return 1 === s ? t[e] : t.readUInt16BE(e * s)
                }
                if (i) {
                    var h = -1;
                    for (o = r; o < u; o++)
                        if (f(t, o) === f(e, -1 === h ? 0 : o - h)) {
                            if (-1 === h && (h = o), o - h + 1 === a) return h * s
                        } else -1 !== h && (o -= o - h), h = -1
                } else
                    for (u < r + a && (r = u - a), o = r; 0 <= o; o--) {
                        for (var c = !0, l = 0; l < a; l++)
                            if (f(t, o + l) !== f(e, l)) {
                                c = !1;
                                break
                            } if (c) return o
                    }
                return -1
            }
 
            function v(t, e, r, n) {
                r = Number(r) || 0;
                var i = t.length - r;
                n ? i < (n = Number(n)) && (n = i) : n = i;
                var o = e.length;
                o / 2 < n && (n = o / 2);
                for (var s = 0; s < n; ++s) {
                    var u = parseInt(e.substr(2 * s, 2), 16);
                    if (K(u)) return s;
                    t[r + s] = u
                }
                return s
            }
 
            function g(t, e, r, n) {
                return _(function(t) {
                    for (var e = [], r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
                    return e
                }(e), t, r, n)
            }
 
            function w(t, e, r) {
                return 0 === e && r === t.length ? n.fromByteArray(t) : n.fromByteArray(t.slice(e, r))
            }
 
            function b(t, e, r) {
                r = Math.min(t.length, r);
                for (var n = [], i = e; i < r;) {
                    var o, s, u, a, f = t[i],
                        h = null,
                        c = 239 < f ? 4 : 223 < f ? 3 : 191 < f ? 2 : 1;
                    if (i + c <= r) switch (c) {
                        case 1:
                            f < 128 && (h = f);
                            break;
                        case 2:
                            128 == (192 & (o = t[i + 1])) && 127 < (a = (31 & f) << 6 | 63 & o) && (h = a);
                            break;
                        case 3:
                            o = t[i + 1], s = t[i + 2], 128 == (192 & o) && 128 == (192 & s) && 2047 < (a = (15 & f) << 12 | (63 & o) << 6 | 63 & s) && (a < 55296 || 57343 < a) && (h = a);
                            break;
                        case 4:
                            o = t[i + 1], s = t[i + 2], u = t[i + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & u) && 65535 < (a = (15 & f) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & u) && a < 1114112 && (h = a)
                    }
                    null === h ? (h = 65533, c = 1) : 65535 < h && (h -= 65536, n.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), n.push(h), i += c
                }
                return function(t) {
                    var e = t.length;
                    if (e <= E) return String.fromCharCode.apply(String, t);
                    var r = "",
                        n = 0;
                    for (; n < e;) r += String.fromCharCode.apply(String, t.slice(n, n += E));
                    return r
                }(n)
            }
            R.kMaxLength = r, (c.TYPED_ARRAY_SUPPORT = function() {
                try {
                    var t = new Uint8Array(1),
                        e = {
                            foo: function() {
                                return 42
                            }
                        };
                    return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(t, e), 42 === t.foo()
                } catch (t) {
                    return !1
                }
            }()) || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(c.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this)) return this.buffer
                }
            }), Object.defineProperty(c.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this)) return this.byteOffset
                }
            }), "undefined" != typeof Symbol && null != Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
                value: null,
                configurable: !0,
                enumerable: !1,
                writable: !1
            }), c.poolSize = 8192, c.from = function(t, e, r) {
                return i(t, e, r)
            }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array), c.alloc = function(t, e, r) {
                return function(t, e, r) {
                    return u(t), t <= 0 ? s(t) : void 0 !== e ? "string" == typeof r ? s(t).fill(e, r) : s(t).fill(e) : s(t)
                }(t, e, r)
            }, c.allocUnsafe = function(t) {
                return a(t)
            }, c.allocUnsafeSlow = function(t) {
                return a(t)
            }, c.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer && t !== c.prototype
            }, c.compare = function(t, e) {
                if (x(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)), x(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)), !c.isBuffer(t) || !c.isBuffer(e)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (t === e) return 0;
                for (var r = t.length, n = e.length, i = 0, o = Math.min(r, n); i < o; ++i)
                    if (t[i] !== e[i]) {
                        r = t[i], n = e[i];
                        break
                    } return r < n ? -1 : n < r ? 1 : 0
            }, c.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
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
            }, c.concat = function(t, e) {
                if (!Array.isArray(t)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length) return c.alloc(0);
                var r;
                if (void 0 === e)
                    for (r = e = 0; r < t.length; ++r) e += t[r].length;
                var n = c.allocUnsafe(e),
                    i = 0;
                for (r = 0; r < t.length; ++r) {
                    var o = t[r];
                    if (x(o, Uint8Array) && (o = c.from(o)), !c.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                    o.copy(n, i), i += o.length
                }
                return n
            }, c.byteLength = l, c.prototype._isBuffer = !0, c.prototype.swap16 = function() {
                var t = this.length;
                if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var e = 0; e < t; e += 2) p(this, e, e + 1);
                return this
            }, c.prototype.swap32 = function() {
                var t = this.length;
                if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var e = 0; e < t; e += 4) p(this, e, e + 3), p(this, e + 1, e + 2);
                return this
            }, c.prototype.swap64 = function() {
                var t = this.length;
                if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var e = 0; e < t; e += 8) p(this, e, e + 7), p(this, e + 1, e + 6), p(this, e + 2, e + 5), p(this, e + 3, e + 4);
                return this
            }, c.prototype.toLocaleString = c.prototype.toString = function() {
                var t = this.length;
                return 0 === t ? "" : 0 === arguments.length ? b(this, 0, t) : function(t, e, r) {
                    var n = !1;
                    if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
                    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                    if ((r >>>= 0) <= (e >>>= 0)) return "";
                    for (t = t || "utf8";;) switch (t) {
                        case "hex":
                            return A(this, e, r);
                        case "utf8":
                        case "utf-8":
                            return b(this, e, r);
                        case "ascii":
                            return T(this, e, r);
                        case "latin1":
                        case "binary":
                            return k(this, e, r);
                        case "base64":
                            return w(this, e, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return m(this, e, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + t);
                            t = (t + "").toLowerCase(), n = !0
                    }
                }.apply(this, arguments)
            }, c.prototype.equals = function(t) {
                if (!c.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === c.compare(this, t)
            }, c.prototype.inspect = function() {
                var t = "",
                    e = R.INSPECT_MAX_BYTES;
                return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">"
            }, t && (c.prototype[t] = c.prototype.inspect), c.prototype.compare = function(t, e, r, n, i) {
                if (x(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)), !c.isBuffer(t)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + (void 0 === t ? "undefined" : _typeof(t)));
                if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), e < 0 || r > t.length || n < 0 || i > this.length) throw new RangeError("out of range index");
                if (i <= n && r <= e) return 0;
                if (i <= n) return -1;
                if (r <= e) return 1;
                if (this === t) return 0;
                for (var o = (i >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (e >>>= 0), u = Math.min(o, s), a = this.slice(n, i), f = t.slice(e, r), h = 0; h < u; ++h)
                    if (a[h] !== f[h]) {
                        o = a[h], s = f[h];
                        break
                    } return o < s ? -1 : s < o ? 1 : 0
            }, c.prototype.includes = function(t, e, r) {
                return -1 !== this.indexOf(t, e, r)
            }, c.prototype.indexOf = function(t, e, r) {
                return y(this, t, e, r, !0)
            }, c.prototype.lastIndexOf = function(t, e, r) {
                return y(this, t, e, r, !1)
            }, c.prototype.write = function(t, e, r, n) {
                if (void 0 === e) n = "utf8", r = this.length, e = 0;
                else if (void 0 === r && "string" == typeof e) n = e, r = this.length, e = 0;
                else {
                    if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
                }
                var i = this.length - e;
                if ((void 0 === r || i < r) && (r = i), 0 < t.length && (r < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                n = n || "utf8";
                for (var o, s, u, a, f, h, c, l, p, y = !1;;) switch (n) {
                    case "hex":
                        return v(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                        return l = e, p = r, _(B(t, (c = this).length - l), c, l, p);
                    case "ascii":
                        return g(this, t, e, r);
                    case "latin1":
                    case "binary":
                        return g(this, t, e, r);
                    case "base64":
                        return a = this, f = e, h = r, _(C(t), a, f, h);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return s = e, u = r, _(function(t, e) {
                            for (var r, n, i, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) r = t.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
                            return o
                        }(t, (o = this).length - s), o, s, u);
                    default:
                        if (y) throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(), y = !0
                }
            }, c.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };
            var E = 4096;
 
            function T(t, e, r) {
                var n = "";
                r = Math.min(t.length, r);
                for (var i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);
                return n
            }
 
            function k(t, e, r) {
                var n = "";
                r = Math.min(t.length, r);
                for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);
                return n
            }
 
            function A(t, e, r) {
                var n = t.length;
                (!e || e < 0) && (e = 0), (!r || r < 0 || n < r) && (r = n);
                for (var i = "", o = e; o < r; ++o) i += N(t[o]);
                return i
            }
 
            function m(t, e, r) {
                for (var n = t.slice(e, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i
            }
 
            function U(t, e, r) {
                if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
                if (r < t + e) throw new RangeError("Trying to access beyond buffer length")
            }
 
            function O(t, e, r, n, i, o) {
                if (!c.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (i < e || e < o) throw new RangeError('"value" argument is out of bounds');
                if (r + n > t.length) throw new RangeError("Index out of range")
            }
 
            function I(t, e, r, n) {
                if (r + n > t.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range")
            }
 
            function P(t, e, r, n, i) {
                return e = +e, r >>>= 0, i || I(t, 0, r, 4), o.write(t, e, r, n, 23, 4), r + 4
            }
 
            function S(t, e, r, n, i) {
                return e = +e, r >>>= 0, i || I(t, 0, r, 8), o.write(t, e, r, n, 52, 8), r + 8
            }
            c.prototype.slice = function(t, e) {
                var r = this.length;
                (t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r), (e = void 0 === e ? r : ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), e < t && (e = t);
                var n = this.subarray(t, e);
                return Object.setPrototypeOf(n, c.prototype), n
            }, c.prototype.readUIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || U(t, e, this.length);
                for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);) n += this[t + o] * i;
                return n
            }, c.prototype.readUIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || U(t, e, this.length);
                for (var n = this[t + --e], i = 1; 0 < e && (i *= 256);) n += this[t + --e] * i;
                return n
            }, c.prototype.readUInt8 = function(t, e) {
                return t >>>= 0, e || U(t, 1, this.length), this[t]
            }, c.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0, e || U(t, 2, this.length), this[t] | this[t + 1] << 8
            }, c.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0, e || U(t, 2, this.length), this[t] << 8 | this[t + 1]
            }, c.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }, c.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }, c.prototype.readIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || U(t, e, this.length);
                for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);) n += this[t + o] * i;
                return (i *= 128) <= n && (n -= Math.pow(2, 8 * e)), n
            }, c.prototype.readIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || U(t, e, this.length);
                for (var n = e, i = 1, o = this[t + --n]; 0 < n && (i *= 256);) o += this[t + --n] * i;
                return (i *= 128) <= o && (o -= Math.pow(2, 8 * e)), o
            }, c.prototype.readInt8 = function(t, e) {
                return t >>>= 0, e || U(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }, c.prototype.readInt16LE = function(t, e) {
                t >>>= 0, e || U(t, 2, this.length);
                var r = this[t] | this[t + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, c.prototype.readInt16BE = function(t, e) {
                t >>>= 0, e || U(t, 2, this.length);
                var r = this[t + 1] | this[t] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, c.prototype.readInt32LE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }, c.prototype.readInt32BE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }, c.prototype.readFloatLE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), o.read(this, t, !0, 23, 4)
            }, c.prototype.readFloatBE = function(t, e) {
                return t >>>= 0, e || U(t, 4, this.length), o.read(this, t, !1, 23, 4)
            }, c.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0, e || U(t, 8, this.length), o.read(this, t, !0, 52, 8)
            }, c.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0, e || U(t, 8, this.length), o.read(this, t, !1, 52, 8)
            }, c.prototype.writeUIntLE = function(t, e, r, n) {
                t = +t, e >>>= 0, r >>>= 0, n || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var i = 1,
                    o = 0;
                for (this[e] = 255 & t; ++o < r && (i *= 256);) this[e + o] = t / i & 255;
                return e + r
            }, c.prototype.writeUIntBE = function(t, e, r, n) {
                t = +t, e >>>= 0, r >>>= 0, n || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var i = r - 1,
                    o = 1;
                for (this[e + i] = 255 & t; 0 <= --i && (o *= 256);) this[e + i] = t / o & 255;
                return e + r
            }, c.prototype.writeUInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 1, 255, 0), this[e] = 255 & t, e + 1
            }, c.prototype.writeUInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 2, 65535, 0), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, c.prototype.writeUInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, c.prototype.writeUInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t, e + 4
            }, c.prototype.writeUInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, c.prototype.writeIntLE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    O(this, t, e, r, i - 1, -i)
                }
                var o = 0,
                    s = 1,
                    u = 0;
                for (this[e] = 255 & t; ++o < r && (s *= 256);) t < 0 && 0 === u && 0 !== this[e + o - 1] && (u = 1), this[e + o] = (t / s >> 0) - u & 255;
                return e + r
            }, c.prototype.writeIntBE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    O(this, t, e, r, i - 1, -i)
                }
                var o = r - 1,
                    s = 1,
                    u = 0;
                for (this[e + o] = 255 & t; 0 <= --o && (s *= 256);) t < 0 && 0 === u && 0 !== this[e + o + 1] && (u = 1), this[e + o] = (t / s >> 0) - u & 255;
                return e + r
            }, c.prototype.writeInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1
            }, c.prototype.writeInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 2, 32767, -32768), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, c.prototype.writeInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, c.prototype.writeInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 4, 2147483647, -2147483648), this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4
            }, c.prototype.writeInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || O(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, c.prototype.writeFloatLE = function(t, e, r) {
                return P(this, t, e, !0, r)
            }, c.prototype.writeFloatBE = function(t, e, r) {
                return P(this, t, e, !1, r)
            }, c.prototype.writeDoubleLE = function(t, e, r) {
                return S(this, t, e, !0, r)
            }, c.prototype.writeDoubleBE = function(t, e, r) {
                return S(this, t, e, !1, r)
            }, c.prototype.copy = function(t, e, r, n) {
                if (!c.isBuffer(t)) throw new TypeError("argument should be a Buffer");
                if (r = r || 0, n || 0 === n || (n = this.length), e >= t.length && (e = t.length), e = e || 0, 0 < n && n < r && (n = r), n === r) return 0;
                if (0 === t.length || 0 === this.length) return 0;
                if (e < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
                if (n < 0) throw new RangeError("sourceEnd out of bounds");
                n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r);
                var i = n - r;
                if (this === t && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(e, r, n);
                else if (this === t && r < e && e < n)
                    for (var o = i - 1; 0 <= o; --o) t[o + e] = this[o + r];
                else Uint8Array.prototype.set.call(t, this.subarray(r, n), e);
                return i
            }, c.prototype.fill = function(t, e, r, n) {
                if ("string" == typeof t) {
                    if ("string" == typeof e ? (n = e, e = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                    if ("string" == typeof n && !c.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
                    if (1 === t.length) {
                        var i = t.charCodeAt(0);
                        ("utf8" === n && i < 128 || "latin1" === n) && (t = i)
                    }
                } else "number" == typeof t && (t &= 255);
                if (e < 0 || this.length < e || this.length < r) throw new RangeError("Out of range index");
                if (r <= e) return this;
                var o;
                if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, "number" == typeof(t = t || 0))
                    for (o = e; o < r; ++o) this[o] = t;
                else {
                    var s = c.isBuffer(t) ? t : c.from(t, n),
                        u = s.length;
                    if (0 === u) throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                    for (o = 0; o < r - e; ++o) this[o + e] = s[o % u]
                }
                return this
            };
            var e = /[^+/0-9A-Za-z-_]/g;
 
            function N(t) {
                return t < 16 ? "0" + t.toString(16) : t.toString(16)
            }
 
            function B(t, e) {
                var r;
                e = e || 1 / 0;
                for (var n = t.length, i = null, o = [], s = 0; s < n; ++s) {
                    if (55295 < (r = t.charCodeAt(s)) && r < 57344) {
                        if (!i) {
                            if (56319 < r) {
                                -1 < (e -= 3) && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === n) {
                                -1 < (e -= 3) && o.push(239, 191, 189);
                                continue
                            }
                            i = r;
                            continue
                        }
                        if (r < 56320) {
                            -1 < (e -= 3) && o.push(239, 191, 189), i = r;
                            continue
                        }
                        r = 65536 + (i - 55296 << 10 | r - 56320)
                    } else i && -1 < (e -= 3) && o.push(239, 191, 189);
                    if (i = null, r < 128) {
                        if ((e -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((e -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((e -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((e -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }
 
            function C(t) {
                return n.toByteArray(function(t) {
                    if ((t = (t = t.split("=")[0]).trim().replace(e, "")).length < 2) return "";
                    for (; t.length % 4 != 0;) t += "=";
                    return t
                }(t))
            }
 
            function _(t, e, r, n) {
                for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i) e[i + r] = t[i];
                return i
            }
 
            function x(t, e) {
                return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
            }
 
            function K(t) {
                return t != t
            }
        }).call(this, L("buffer").Buffer)
    }, {
        "base64-js": 1,
        buffer: 2,
        ieee754: 3
    }],
    3: [function(t, e, r) {
        r.read = function(t, e, r, n, i) {
            var o, s, u = 8 * i - n - 1,
                a = (1 << u) - 1,
                f = a >> 1,
                h = -7,
                c = r ? i - 1 : 0,
                l = r ? -1 : 1,
                p = t[e + c];
            for (c += l, o = p & (1 << -h) - 1, p >>= -h, h += u; 0 < h; o = 256 * o + t[e + c], c += l, h -= 8);
            for (s = o & (1 << -h) - 1, o >>= -h, h += n; 0 < h; s = 256 * s + t[e + c], c += l, h -= 8);
            if (0 === o) o = 1 - f;
            else {
                if (o === a) return s ? NaN : 1 / 0 * (p ? -1 : 1);
                s += Math.pow(2, n), o -= f
            }
            return (p ? -1 : 1) * s * Math.pow(2, o - n)
        }, r.write = function(t, e, r, n, i, o) {
            var s, u, a, f = 8 * o - i - 1,
                h = (1 << f) - 1,
                c = h >> 1,
                l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                p = n ? 0 : o - 1,
                y = n ? 1 : -1,
                d = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
            for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, s = h) : (s = Math.floor(Math.log(e) / Math.LN2), e * (a = Math.pow(2, -s)) < 1 && (s--, a *= 2), 2 <= (e += 1 <= s + c ? l / a : l * Math.pow(2, 1 - c)) * a && (s++, a /= 2), h <= s + c ? (u = 0, s = h) : 1 <= s + c ? (u = (e * a - 1) * Math.pow(2, i), s += c) : (u = e * Math.pow(2, c - 1) * Math.pow(2, i), s = 0)); 8 <= i; t[r + p] = 255 & u, p += y, u /= 256, i -= 8);
            for (s = s << i | u, f += i; 0 < f; t[r + p] = 255 & s, p += y, s /= 256, f -= 8);
            t[r + p - y] |= 128 * d
        }
    }, {}],
    4: [function(t, e, r) {
        var n = {
                objPosX: 3,
                objPosY: 1,
                objAngle: 2,
                agentPosX: 66,
                agentPosY: 23,
                agentPosX2: 18,
                agentPosY2: 44,
                fade: 64,
                opacity: 65,
                counter: 29,
                weirdBytes1: 19,
                weirdBytes2: 29,
                expPointsOthert: 20,
                maxHealth: 35,
                health: 37,
                timeAliveThis: 28,
                tankMass: 25,
                tankSpeed: 31,
                tankLevel: 38,
                expPointsThis: 39
            },
            i = {},
            o = !0,
            s = !1,
            u = void 0;
        try {
            for (var a, f = Object.keys(n)[Symbol.iterator](); !(o = (a = f.next()).done); o = !0) {
                var h = a.value;
                i[n[h]] = h
            }
        } catch (t) {
            s = !0, u = t
        } finally {
            try {
                !o && f.return && f.return()
            } finally {
                if (s) throw u
            }
        }
        var c = {
                LEFT_MOUSE: 1,
                UP: 2,
                LEFT: 4,
                DOWN: 8,
                RIGHT: 16,
                GOD_MODE: 32,
                SUICIDE: 64,
                RIGHT_MOUSE: 128,
                INSTANT_UPGRADE: 256,
                USE_GAMEPAD: 512,
                SWITCH_CLASS: 1024,
                TRUE_CONST: 2048
            },
            l = {
                UP: c.UP,
                RIGHT_UP: c.RIGHT | c.UP,
                RIGHT: c.RIGHT,
                RIGHT_DOWN: c.RIGHT | c.DOWN,
                DOWN: c.DOWN,
                LEFT_DOWN: c.LEFT | c.DOWN,
                LEFT: c.LEFT,
                LEFT_UP: c.LEFT | c.UP
            },
            p = (_createClass(y, [{
                key: "get",
                value: function(t) {
                    return this.lookup[t]
                }
            }, {
                key: "find",
                value: function(t) {
                    if (!this.reverse.hasOwnProperty(t)) throw t;
                    return this.reverse[t]
                }
            }]), y);
 
        function y() {
            var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [],
                e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
            _classCallCheck(this, y);
            var r = "function" === e ? e : function(t) {
                return t ^ e
            };
            this.table = t, this.length = t.length, this.lookup = {}, this.reverse = {};
            for (var n = 0; n < t.length; n++) this.lookup[r(n)] = t[n], this.reverse[t[n]] = r(n)
        }
        var d = new p([8, 7, 6, 5, 4, 3, 2, 1], 0),
            v = new p(["Tank", "Twin", "Triplet", "Triple Shot", "Quad Tank", "Octo Tank", "Sniper", "Machine Gun", "Flank Guard", "Tri-Angle", "Destroyer", "Overseer", "Overlord", "Twin-Flank", "Penta Shot", "Assassin", "Arena Closer", "Necromancer", "Triple Twin", "Hunter", "Gunner", "Stalker", "Ranger", "Booster", "Fighter", "Hybrid", "Manager", "Mothership", "Predator", "Sprayer", "", "Trapper", "Gunner Trapper", "Overtrapper", "Mega Trapper", "Tri-Trapper", "Smasher", "", "Landmine", "Auto Gunner", "Auto 5", "Auto 3", "Spread Shot", "Streamliner", "Auto Trapper", "Dominator", "Dominator", "Dominator", "Battleship", "Annihilator", "Auto Smasher", "Spike", "Factory", "", "Skimmer", "Rocketeer"], 0);
        e.exports = {
            updateKinds: {
                CREATE: 1,
                UPDATE: 2
            },
            inPacketKinds: {
                UPDATE: 0,
                UPDATE_COMPRESSED: 2,
                IGNORE: -1
            },
            entityTypes: {
                UNKNOWN: "UNKNOWN",
                TANK: "TANK",
                BULLET: "BULLET",
                SHAPE: "SHAPE",
                BOT: "BOT",
                OWN_TANK: "OWN_TANK",
                LEADER_TANK: "LEADER_TANK",
                MASTER_TANK: "MASTER_TANK"
            },
            fieldIdToType: {
                1: "vi",
                2: "vi",
                3: "vi",
                23: "float",
                66: "float",
                18: "float",
                44: "float",
                64: "float",
                65: "float",
                29: "float",
                19: "vu",
                57: "vu",
                20: "float",
                35: "float",
                37: "float",
                28: "float",
                25: "vi",
                26: "float",
                27: "float",
                31: "float",
                38: "vi",
                39: "float",
                59: "float",
                63: "vu",
                67: "vu",
                53: "vu"
            },
            fieldIdToName: i,
            tankTable: v,
            statTable: d,
            outPacketKinds: {
                INIT: 0,
                INPUT: 1,
                SPAWN: 2,
                UPDATE_STAT: 3,
                UPDATE_TANK: 4,
                HEARTBEAT: 5,
                UNKNOWN: 6,
                EXT_FOUND: 7,
                CLEAR_DEATH: 8,
                TAKE_TANK: 9
            },
            keyInput: c,
            directionAccelerations: {
                UP: {
                    x: 0,
                    y: -1
                },
                RIGHT_UP: {
                    x: .707,
                    y: -.707
                },
                RIGHT: {
                    x: 1,
                    y: 0
                },
                RIGHT_DOWN: {
                    x: .707,
                    y: .707
                },
                DOWN: {
                    x: 0,
                    y: 1
                },
                LEFT_DOWN: {
                    x: -.707,
                    y: .707
                },
                LEFT: {
                    x: -1,
                    y: 0
                },
                LEFT_UP: {
                    x: -.707,
                    y: -.707
                }
            },
            directionKeys: l
        }
    }, {}],
    5: [function(a, f, t) {
        (function(r) {
            var e = a("./data.js"),
                t = new ArrayBuffer(4),
                n = new Uint8Array(t),
                i = new Uint32Array(t),
                o = new Float32Array(t),
                s = (_createClass(u, [{
                    key: "i8",
                    value: function(t) {
                        return this.buffer[this.length] = t, this.length += 1, this
                    }
                }, {
                    key: "i32",
                    value: function(t) {
                        return i[0] = t, this.buffer.set(n, this.length), this.length += 4, this
                    }
                }, {
                    key: "float",
                    value: function(t) {
                        return o[0] = t, this.buffer.set(n, this.length), this.length += 4, this
                    }
                }, {
                    key: "vu",
                    value: function(t) {
                        do {
                            var e = t;
                            (t >>>= 7) && (e |= 128), this.buffer[this.length++] = e
                        } while (t);
                        return this
                    }
                }, {
                    key: "vi",
                    value: function(t) {
                        var e = (2147483648 & t) >>> 31;
                        e && (t = ~t);
                        var r = t << 1 | e;
                        return this.vu(r), this
                    }
                }, {
                    key: "vf",
                    value: function(t) {
                        return o[0] = t, this.vi(function(t) {
                            return (255 & t) << 24 | (65280 & t) << 8 | t >> 8 & 65280 | t >> 24 & 255
                        }(i[0])), this
                    }
                }, {
                    key: "string",
                    value: function(t) {
                        if (t) {
                            var e = new Uint8Array(r.from(t));
                            this.buffer.set(e, this.length), this.length += e.length
                        }
                        return this.buffer[this.length++] = 0, this
                    }
                }, {
                    key: "out",
                    value: function() {
                        return this.buffer.buffer.slice(0, this.length)
                    }
                }, {
                    key: "dump",
                    value: function() {
                        return Array.from(this.buffer.subarray(0, this.length)).map(function(t) {
                            return t.toString(16).padStart(2, 0)
                        }).join(" ")
                    }
                }, {
                    key: "encodeOutbound",
                    value: function(t) {
                        switch (t.kind) {
                            case e.outPacketKinds.INIT:
                                return this.encodeInit(t);
                            case e.outPacketKinds.INPUT:
                                return this.encodeInput(t);
                            case e.outPacketKinds.SPAWN:
                                return this.encodeSpawn(t);
                            case e.outPacketKinds.UPDATE_STAT:
                                return this.encodeUpdateStat(t);
                            case e.outPacketKinds.UPDATE_TANK:
                                return this.encodeUpdateTank(t);
                            case e.outPacketKinds.EXT_FOUND:
                                return !1;
                            default:
                                return t.data ? t.data : this.vu(t.kind).out()
                        }
                    }
                }, {
                    key: "encodeInput",
                    value: function(t) {
                        return this.vu(t.kind).vu(t.key).vf(t.x).vf(t.y).out()
                    }
                }, {
                    key: "encodeInit",
                    value: function(t) {
                        return this.vu(t.kind).string(t.build).string(t.unk1).string(t.partyId).string(t.unk2).out()
                    }
                }, {
                    key: "encodeSpawn",
                    value: function(t) {
                        return this.vu(t.kind).string(t.name).out()
                    }
                }, {
                    key: "encodeUpdateStat",
                    value: function(t) {
                        return this.vu(t.kind).vu(t.statId).vu(t.upto).out()
                    }
                }, {
                    key: "encodeUpdateTank",
                    value: function(t) {
                        return this.vu(t.kind).vu(t.tankId).out()
                    }
                }]), u);
 
            function u() {
                _classCallCheck(this, u), this.length = 0, this.buffer = new Uint8Array(4096)
            }
            f.exports = {
                Encoder: s
            }
        }).call(this, a("buffer").Buffer)
    }, {
        "./data.js": 4,
        buffer: 2
    }],
    6: [function(t, e, r) {
        e.exports = {
            inject: function(n, i) {
                var o = new Set,
                    s = window.WebSocket.prototype.send;
                return window.WebSocket.prototype.send = function(t) {
                    var e = new Uint8Array(t);
                    if (!o.has(this)) {
                        console.log("Hello: New WebSocket is being used."), o.add(this);
                        var r = this.onmessage;
                        this.onmessage = function(t) {
                            if (n && (t.data = n.call(this, new Uint8Array(t.data))), t.data) return r.call(this, t)
                        }
                    }
                    try {
                        i && (e = i.call(this, e))
                    } catch (t) {
                        console.log("Test Injection")
                    }
                    if (e) return s.call(this, e)
                }, console.log("injection ok"), s
            }
        }
    }, {}],
    7: [function(t, e, r) {
        var n = t("./data.js"),
            i = new ArrayBuffer(4),
            o = new Uint8Array(i),
            s = new Uint32Array(i),
            u = new Float32Array(i),
            a = (_createClass(f, [{
                key: "i8",
                value: function() {
                    var t = this.buffer[this.at++];
                    return this.assertNotOOB(), t
                }
            }, {
                key: "endianSwap",
                value: function(t) {
                    return (255 & t) << 24 | (65280 & t) << 8 | t >> 8 & 65280 | t >> 24 & 255
                }
            }, {
                key: "i32",
                value: function() {
                    return o.set(this.buffer.subarray(this.at, this.at += 4)), this.assertNotOOB(), s[0]
                }
            }, {
                key: "float",
                value: function() {
                    return o.set(this.buffer.subarray(this.at, this.at += 4)), this.assertNotOOB(), u[0]
                }
            }, {
                key: "vleft",
                value: function() {
                    this.at--;
                    for (var t = 1; 128 & this.buffer[this.at - 1] && t < 4;) this.at--, t++
                }
            }, {
                key: "vu",
                value: function() {
                    for (var t = 0, e = 0; 128 & this.buffer[this.at];) t |= (127 & this.buffer[this.at++]) << e, e += 7;
                    return t |= this.buffer[this.at++] << e, this.assertNotOOB(), t
                }
            }, {
                key: "vi",
                value: function() {
                    var t = this.vu(),
                        e = 1 & t;
                    return t >>= 1, e && (t = ~t), this.assertNotOOB(), t
                }
            }, {
                key: "vf",
                value: function() {
                    return s[0] = this.endianSwap(this.vi()), this.assertNotOOB(), u[0]
                }
            }, {
                key: "string",
                value: function() {
                    for (var t = ""; this.buffer[this.at];) t += String.fromCharCode(this.buffer[this.at]), this.at++;
                    return this.at++, this.assertNotOOB(), t
                }
            }, {
                key: "getByteString",
                value: function(t, e) {
                    for (var r = ""; t < e && t < this.buffer.length;) {
                        var n = this.buffer[t];
                        r += (n < 16 ? "0" : "") + n.toString(16) + " ", t++
                    }
                    return r
                }
            }, {
                key: "isEOF",
                value: function() {
                    return this.at === this.buffer.length
                }
            }, {
                key: "raiseUnexpected",
                value: function(t, e) {
                    var r = "Error at pos " + this.at + ": " + t;
                    "tolerate" !== e && console.log(" ");
                    var n = new Error(r);
                    throw n.payload = e, n
                }
            }, {
                key: "assertEOF",
                value: function() {
                    this.isEOF() || this.raiseUnexpected("Expected end of packet.")
                }
            }, {
                key: "assertNotOOB",
                value: function() {
                    this.at > this.buffer.length && this.raiseUnexpected("Unexpected end of packet.")
                }
            }, {
                key: "assertNoIntersectingKeys",
                value: function(t, e) {}
            }, {
                key: "parseOutbound",
                value: function() {
                    var t = this.i8();
                    switch (t) {
                        case n.outPacketKinds.INIT:
                            return this.parseInit();
                        case n.outPacketKinds.INPUT:
                            return this.parseInput();
                        case n.outPacketKinds.SPAWN:
                            return this.parseSpawn();
                        case n.outPacketKinds.UPDATE_STAT:
                            return this.parseUpdateStat();
                        case n.outPacketKinds.UPDATE_TANK:
                            return this.parseUpdateTank();
                        default:
                            return {
                                kind: t, data: this.buffer
                            }
                    }
                }
            }, {
                key: "parseInput",
                value: function() {
                    var t = {
                        kind: n.outPacketKinds.INPUT,
                        key: this.vu(),
                        x: this.vf(),
                        y: this.vf()
                    };
                    return this.isEOF() || console.log("Unexpected end of output 'input' packet."), this.assertEOF(), t
                }
            }, {
                key: "parseInit",
                value: function() {
                    if (this.isEOF()) return {
                        kind: n.outPacketKinds.INIT
                    };
                    var t = {
                        kind: n.outPacketKinds.INIT,
                        build: this.string(),
                        unk1: this.string(),
                        partyId: this.string(),
                        unk2: this.string()
                    };
                    return this.assertEOF(), t
                }
            }, {
                key: "parseSpawn",
                value: function() {
                    var t = {
                        kind: n.outPacketKinds.SPAWN,
                        name: this.string()
                    };
                    return this.assertEOF(), t
                }
            }, {
                key: "parseUpdateStat",
                value: function() {
                    var t = {
                        kind: n.outPacketKinds.UPDATE_STAT,
                        statId: this.vu(),
                        upto: this.vu()
                    };
                    return this.assertEOF(), t
                }
            }, {
                key: "parseUpdateTank",
                value: function() {
                    var t = {
                        kind: n.outPacketKinds.UPDATE_TANK,
                        tankId: this.vu()
                    };
                    return this.assertEOF(), t
                }
            }, {
                key: "parseInbound",
                value: function() {
                    var t = this.i8();
                    return t === n.inPacketKinds.UPDATE ? this.buffer.length < 2 ? this.ignorePacket("?") : this.updatePacket() : t === n.inPacketKinds.UPDATE_COMPRESSED ? this.updateCompressedPacket() : this.ignorePacket(t)
                }
            }, {
                key: "updatePacket",
                value: function() {
                    var t = this.vu(),
                        e = {
                            kind: n.inPacketKinds.UPDATE,
                            updateId: t,
                            deletes: this.multiEntityDeletes(),
                            upcreates: this.multiEntityUpcreates()
                        };
                    return this.assertEOF(), e
                }
            }, {
                key: "updateCompressedPacket",
                value: function() {
                    this.raiseUnexpected("UPDATE_COMPRESSED not supported", "compressed")
                }
            }, {
                key: "ignorePacket",
                value: function(t) {
                    return {
                        kind: n.inPacketKinds.IGNORE,
                        ignore_reason: t
                    }
                }
            }, {
                key: "entityId",
                value: function() {
                    var t = this.vu() + "#" + this.vu();
                    return this.curEntityId = t
                }
            }, {
                key: "isMatch",
                value: function(t) {
                    if (this.at + t.length > this.buffer.length) return !1;
                    for (var e = 0; e < t.length; e++)
                        if (this.buffer[e + this.at] !== t[e]) return !1;
                    return !0
                }
            }, {
                key: "moveToNextCreate",
                value: function() {
                    for (; ++this.at < this.buffer.length;)
                        if (this.entityCreateTypeId() !== n.entityTypes.UNKNOWN && 0 === this.buffer[this.at - 1] && 1 === this.buffer[this.at - 2]) return this.vleft(), this.vleft(), this.vleft(), void this.vleft();
                    this.assertEOF()
                }
            }, {
                key: "entityCreateTypeId",
                value: function() {
                    return this.isMatch([2, 0, 5, 3, 0, 3]) ? n.entityTypes.TANK : this.isMatch([2, 0, 7, 0, 1]) ? n.entityTypes.BULLET : this.isMatch([2, 0, 5, 3, 0, 1]) ? n.entityTypes.SHAPE : n.entityTypes.UNKNOWN
                }
            }, {
                key: "fieldIdSpec",
                value: function() {
                    return 1 ^ this.vu()
                }
            }, {
                key: "updateKind",
                value: function() {
                    var t = this.vu(),
                        e = this.vu();
                    return 1 === t && 0 === e ? n.updateKinds.CREATE : 0 === t && 1 === e ? n.updateKinds.UPDATE : (console.log(), void this.raiseUnexpected("Unknown update type: " + t + " " + e, 9 === e ? "tolerate" : null))
                }
            }, {
                key: "multiEntityDeletes",
                value: function() {
                    for (var t = this.vu(), e = [], r = 0; r < t; r++) e.push(this.entityId());
                    return e
                }
            }, {
                key: "multiEntityUpcreates",
                value: function() {
                    for (var t = this.vu(), e = [], r = 0; r < t; r++) {
                        if (this.isEOF()) {
                            console.log("unexpected eof...");
                            break
                        }
                        e.push(this.entityUpcreate())
                    }
                    return this.assertEOF(), e
                }
            }, {
                key: "entityUpcreate",
                value: function() {
                    var t = this.entityId(),
                        e = this.updateKind(),
                        r = {
                            entityId: t,
                            updateKind: e
                        };
                    return e === n.updateKinds.CREATE ? Object.assign(r, this.entityCreate()) : e === n.updateKinds.UPDATE ? Object.assign(r, this.entityUpdate()) : this.raiseUnexpected("Internal error"), r
                }
            }, {
                key: "parseField",
                value: function(t) {
                    n.fieldIdToType.hasOwnProperty(t) || this.raiseUnexpected("Unknown property field_id: " + t + " @ " + this.curEntityId, t);
                    var e = n.fieldIdToType[t];
                    if (!(e in this)) return this.raiseUnexpected("Internal error: method to parse field_type " + field_name + " not implemented"), {};
                    var r = {};
                    return r[n.fieldIdToName.hasOwnProperty(t) ? n.fieldIdToName[t] : "unk_" + e + "_" + t] = this[e](), r
                }
            }, {
                key: "entityUpdate",
                value: function() {
                    for (var t = this.fieldIdSpec(), e = {};;) {
                        var r = this.parseField(t);
                        this.assertNoIntersectingKeys(e, r), Object.assign(e, r);
                        var n = this.fieldIdSpec();
                        if (0 === n) break;
                        t += n
                    }
                    return e
                }
            }, {
                key: "entityCreate",
                value: function() {
                    var t = this.entityCreateTypeId();
                    t === n.entityTypes.UNKNOWN && this.raiseUnexpected("Entity create: " + this.curEntityId + ", " + t + ".", "create");
                    var e = {
                        entityType: t
                    };
                    return this.moveToNextCreate(), e
                }
            }]), f);
 
        function f(t) {
            _classCallCheck(this, f), this.at = 0, this.buffer = new Uint8Array(t), this.curEntityId = ""
        }
 
        function h(t) {
            var e = new ArrayBuffer(t.length),
                r = new Uint8Array(e),
                n = 0,
                i = !0,
                o = !1,
                s = void 0;
            try {
                for (var u, a = t[Symbol.iterator](); !(i = (u = a.next()).done); i = !0) {
                    var f = u.value;
                    r[n++] = f
                }
            } catch (t) {
                o = !0, s = t
            } finally {
                try {
                    !i && a.return && a.return()
                } finally {
                    if (o) throw s
                }
            }
            return e
        }
        e.exports = {
            Parser: a,
            byteStringToBuffer: function(t) {
                var e = t.split(" "),
                    r = [],
                    n = !0,
                    i = !1,
                    o = void 0;
                try {
                    for (var s, u = e[Symbol.iterator](); !(n = (s = u.next()).done); n = !0) {
                        var a = s.value;
                        r.push(parseInt(a, 16))
                    }
                } catch (t) {
                    i = !0, o = t
                } finally {
                    try {
                        !n && u.return && u.return()
                    } finally {
                        if (i) throw o
                    }
                }
                return h(r)
            },
            bytesToBuffer: h
        }
    }, {
        "./data.js": 4
    }],
    8: [function(t, e, r) {
        var i = t("./data.js"),
            o = t("./parser.js").Parser,
            f = t("./encoder.js").Encoder,
            n = t("./injection.js").inject;
 
        function s(t, e) {
            var r = !0,
                n = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next()).done); r = !0) {
                    var u = o.value,
                        a = new f;
                    h.call(t, a.encodeOutbound(u))
                }
            } catch (t) {
                n = !0, i = t
            } finally {
                try {
                    !r && s.return && s.return()
                } finally {
                    if (n) throw i
                }
            }
            return null
        }
        var u = 0;
        window.switchPeriod = 1.5, window.isOn = !1, window.switches = [74, -1];
        var a = 0;
        document.addEventListener("keydown", function(t) {
            "t" !== t.key && "T" !== t.key || (window.isOn = !window.isOn, a = 0, console.log("Switch script on: " + window.isOn))
        });
        var h = n(null, function(t) {
            var e = this;
            window.sendPackets = function(t) {
                return s(e, t)
            };
            var r = new o(t).parseOutbound();
            if (r.kind === i.outPacketKinds.SPAWN && (window.isOn = !1), r.kind === i.outPacketKinds.UPDATE_TANK, r.kind !== i.outPacketKinds.INPUT) return t;
            if (u++, window.isOn && u % window.switchPeriod == 0) {
                a %= switches.length;
                var n = window.switches[a++];
                if (!(0 <= n)) return r.key |= i.keyInput.SWITCH_CLASS, s(this, [r]);
                s(this, [{
                    kind: 4,
                    tankId: n
                }])
            }
            return t
        })
    }, {
        "./data.js": 4,
        "./encoder.js": 5,
        "./injection.js": 6,
        "./parser.js": 7
    }]
}, {}, [8]);