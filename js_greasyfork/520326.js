// ==UserScript==
// @name         AlterAle - zombs.io
// @namespace    http://tampermonkey.net/
// @version      -.7.3
// @description  weeb mod de-weeb'd
// @author       rdm / AyuBloom
// @match        zombs.io
// @match        localhost:1000
// @icon         https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/AlterAle%20Arcaea.webp?v=1717835928442
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520326/AlterAle%20-%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/520326/AlterAle%20-%20zombsio.meta.js
// ==/UserScript==

/* @Dependencies */
/*
 bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
 Backing buffer: ArrayBuffer, Accessor: Uint8Array
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/bytebuffer.js for details
*/
(function (h, l) {
    if ("function" === typeof define && define.amd) define(["long"], l);
    else if ("function" === typeof require && "object" === typeof module && module && module.exports) {
        h = module;
        try {
            var t = require("long");
        } catch (v) {}
        l = l(t);
        h.exports = l;
    } else (h.dcodeIO = h.dcodeIO || {}).ByteBuffer = l(h.dcodeIO.Long);
})(this, function (h) {
    function l(a) {
        var b = 0;
        return function () {
            return b < a.length ? a.charCodeAt(b++) : null;
        };
    }
    function t() {
        var a = [],
            b = [];
        return function () {
            if (0 === arguments.length) return b.join("") + x.apply(String, a);
            1024 < a.length + arguments.length && (b.push(x.apply(String, a)), (a.length = 0));
            Array.prototype.push.apply(a, arguments);
        };
    }
    function v(a, b, c, e, k) {
        var f = 8 * k - e - 1;
        var d = (1 << f) - 1,
            g = d >> 1,
            n = -7;
        k = c ? k - 1 : 0;
        var h = c ? -1 : 1,
            q = a[b + k];
        k += h;
        c = q & ((1 << -n) - 1);
        q >>= -n;
        for (n += f; 0 < n; c = 256 * c + a[b + k], k += h, n -= 8);
        f = c & ((1 << -n) - 1);
        c >>= -n;
        for (n += e; 0 < n; f = 256 * f + a[b + k], k += h, n -= 8);
        if (0 === c) c = 1 - g;
        else {
            if (c === d) return f ? NaN : Infinity * (q ? -1 : 1);
            f += Math.pow(2, e);
            c -= g;
        }
        return (q ? -1 : 1) * f * Math.pow(2, c - e);
    }
    function y(a, b, c, e, k, f) {
        var d,
            g = 8 * f - k - 1,
            n = (1 << g) - 1,
            h = n >> 1,
            q = 23 === k ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        f = e ? 0 : f - 1;
        var l = e ? 1 : -1,
            m = 0 > b || (0 === b && 0 > 1 / b) ? 1 : 0;
        b = Math.abs(b);
        isNaN(b) || Infinity === b
            ? ((b = isNaN(b) ? 1 : 0), (e = n))
        : ((e = Math.floor(Math.log(b) / Math.LN2)),
           1 > b * (d = Math.pow(2, -e)) && (e--, (d *= 2)),
           (b = 1 <= e + h ? b + q / d : b + q * Math.pow(2, 1 - h)),
           2 <= b * d && (e++, (d /= 2)),
           e + h >= n ? ((b = 0), (e = n)) : 1 <= e + h ? ((b = (b * d - 1) * Math.pow(2, k)), (e += h)) : ((b = b * Math.pow(2, h - 1) * Math.pow(2, k)), (e = 0)));
        for (; 8 <= k; a[c + f] = b & 255, f += l, b /= 256, k -= 8);
        e = (e << k) | b;
        for (g += k; 0 < g; a[c + f] = e & 255, f += l, e /= 256, g -= 8);
        a[c + f - l] |= 128 * m;
    }
    var g = function (a, b, c) {
        "undefined" === typeof a && (a = g.DEFAULT_CAPACITY);
        "undefined" === typeof b && (b = g.DEFAULT_ENDIAN);
        "undefined" === typeof c && (c = g.DEFAULT_NOASSERT);
        if (!c) {
            a |= 0;
            if (0 > a) throw RangeError("Illegal capacity");
            b = !!b;
            c = !!c;
        }
        this.buffer = 0 === a ? w : new ArrayBuffer(a);
        this.view = 0 === a ? null : new Uint8Array(this.buffer);
        this.offset = 0;
        this.markedOffset = -1;
        this.limit = a;
        this.littleEndian = b;
        this.noAssert = c;
    };
    g.VERSION = "5.0.1";
    g.LITTLE_ENDIAN = !0;
    g.BIG_ENDIAN = !1;
    g.DEFAULT_CAPACITY = 16;
    g.DEFAULT_ENDIAN = g.BIG_ENDIAN;
    g.DEFAULT_NOASSERT = !1;
    g.Long = h || null;
    var d = g.prototype;
    Object.defineProperty(d, "__isByteBuffer__", { value: !0, enumerable: !1, configurable: !1 });
    var w = new ArrayBuffer(0),
        x = String.fromCharCode;
    g.accessor = function () {
        return Uint8Array;
    };
    g.allocate = function (a, b, c) {
        return new g(a, b, c);
    };
    g.concat = function (a, b, c, e) {
        if ("boolean" === typeof b || "string" !== typeof b) (e = c), (c = b), (b = void 0);
        for (var k = 0, f = 0, d = a.length, u; f < d; ++f) g.isByteBuffer(a[f]) || (a[f] = g.wrap(a[f], b)), (u = a[f].limit - a[f].offset), 0 < u && (k += u);
        if (0 === k) return new g(0, c, e);
        b = new g(k, c, e);
        for (f = 0; f < d; ) (c = a[f++]), (u = c.limit - c.offset), 0 >= u || (b.view.set(c.view.subarray(c.offset, c.limit), b.offset), (b.offset += u));
        b.limit = b.offset;
        b.offset = 0;
        return b;
    };
    g.isByteBuffer = function (a) {
        return !0 === (a && a.__isByteBuffer__);
    };
    g.type = function () {
        return ArrayBuffer;
    };
    g.wrap = function (a, b, c, e) {
        "string" !== typeof b && ((e = c), (c = b), (b = void 0));
        if ("string" === typeof a)
            switch (("undefined" === typeof b && (b = "utf8"), b)) {
                case "base64":
                    return g.fromBase64(a, c);
                case "hex":
                    return g.fromHex(a, c);
                case "binary":
                    return g.fromBinary(a, c);
                case "utf8":
                    return g.fromUTF8(a, c);
                case "debug":
                    return g.fromDebug(a, c);
                default:
                    throw Error("Unsupported encoding: " + b);
            }
        if (null === a || "object" !== typeof a) throw TypeError("Illegal buffer");
        if (g.isByteBuffer(a)) return (b = d.clone.call(a)), (b.markedOffset = -1), b;
        if (a instanceof Uint8Array) (b = new g(0, c, e)), 0 < a.length && ((b.buffer = a.buffer), (b.offset = a.byteOffset), (b.limit = a.byteOffset + a.byteLength), (b.view = new Uint8Array(a.buffer)));
        else if (a instanceof ArrayBuffer) (b = new g(0, c, e)), 0 < a.byteLength && ((b.buffer = a), (b.offset = 0), (b.limit = a.byteLength), (b.view = 0 < a.byteLength ? new Uint8Array(a) : null));
        else if ("[object Array]" === Object.prototype.toString.call(a)) for (b = new g(a.length, c, e), b.limit = a.length, c = 0; c < a.length; ++c) b.view[c] = a[c];
        else throw TypeError("Illegal buffer");
        return b;
    };
    d.writeBitSet = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if (!(a instanceof Array)) throw TypeError("Illegal BitSet: Not an array");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        var e = b,
            k = a.length,
            f = k >> 3,
            d = 0;
        for (b += this.writeVarint32(k, b); f--; ) {
            var g = (!!a[d++] & 1) | ((!!a[d++] & 1) << 1) | ((!!a[d++] & 1) << 2) | ((!!a[d++] & 1) << 3) | ((!!a[d++] & 1) << 4) | ((!!a[d++] & 1) << 5) | ((!!a[d++] & 1) << 6) | ((!!a[d++] & 1) << 7);
            this.writeByte(g, b++);
        }
        if (d < k) {
            for (g = f = 0; d < k; ) g |= (!!a[d++] & 1) << f++;
            this.writeByte(g, b++);
        }
        return c ? ((this.offset = b), this) : b - e;
    };
    d.readBitSet = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        var c = this.readVarint32(a),
            e = c.value,
            k = e >> 3,
            f = 0,
            d = [];
        for (a += c.length; k--; )
            (c = this.readByte(a++)), (d[f++] = !!(c & 1)), (d[f++] = !!(c & 2)), (d[f++] = !!(c & 4)), (d[f++] = !!(c & 8)), (d[f++] = !!(c & 16)), (d[f++] = !!(c & 32)), (d[f++] = !!(c & 64)), (d[f++] = !!(c & 128));
        if (f < e) for (k = 0, c = this.readByte(a++); f < e; ) d[f++] = !!((c >> k++) & 1);
        b && (this.offset = a);
        return d;
    };
    d.readBytes = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+" + a + ") <= " + this.buffer.byteLength);
        }
        b = this.slice(b, b + a);
        c && (this.offset += a);
        return b;
    };
    d.writeInt8 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 1;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        this.view[b - 1] = a;
        c && (this.offset += 1);
        return this;
    };
    d.writeByte = d.writeInt8;
    d.readInt8 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        a = this.view[a];
        128 === (a & 128) && (a = -(255 - a + 1));
        b && (this.offset += 1);
        return a;
    };
    d.readByte = d.readInt8;
    d.writeUint8 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 1;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        this.view[b - 1] = a;
        c && (this.offset += 1);
        return this;
    };
    d.writeUInt8 = d.writeUint8;
    d.readUint8 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        a = this.view[a];
        b && (this.offset += 1);
        return a;
    };
    d.readUInt8 = d.readUint8;
    d.writeInt16 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 2;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 2;
        this.littleEndian ? ((this.view[b + 1] = (a & 65280) >>> 8), (this.view[b] = a & 255)) : ((this.view[b] = (a & 65280) >>> 8), (this.view[b + 1] = a & 255));
        c && (this.offset += 2);
        return this;
    };
    d.writeShort = d.writeInt16;
    d.readInt16 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a];
            c |= this.view[a + 1] << 8;
        } else (c = this.view[a] << 8), (c |= this.view[a + 1]);
        32768 === (c & 32768) && (c = -(65535 - c + 1));
        b && (this.offset += 2);
        return c;
    };
    d.readShort = d.readInt16;
    d.writeUint16 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 2;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 2;
        this.littleEndian ? ((this.view[b + 1] = (a & 65280) >>> 8), (this.view[b] = a & 255)) : ((this.view[b] = (a & 65280) >>> 8), (this.view[b + 1] = a & 255));
        c && (this.offset += 2);
        return this;
    };
    d.writeUInt16 = d.writeUint16;
    d.readUint16 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a];
            c |= this.view[a + 1] << 8;
        } else (c = this.view[a] << 8), (c |= this.view[a + 1]);
        b && (this.offset += 2);
        return c;
    };
    d.readUInt16 = d.readUint16;
    d.writeInt32 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 4;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 4;
        this.littleEndian
            ? ((this.view[b + 3] = (a >>> 24) & 255), (this.view[b + 2] = (a >>> 16) & 255), (this.view[b + 1] = (a >>> 8) & 255), (this.view[b] = a & 255))
        : ((this.view[b] = (a >>> 24) & 255), (this.view[b + 1] = (a >>> 16) & 255), (this.view[b + 2] = (a >>> 8) & 255), (this.view[b + 3] = a & 255));
        c && (this.offset += 4);
        return this;
    };
    d.writeInt = d.writeInt32;
    d.readInt32 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a + 2] << 16;
            c |= this.view[a + 1] << 8;
            c |= this.view[a];
            c += (this.view[a + 3] << 24) >>> 0;
        } else (c = this.view[a + 1] << 16), (c |= this.view[a + 2] << 8), (c |= this.view[a + 3]), (c += (this.view[a] << 24) >>> 0);
        b && (this.offset += 4);
        return c | 0;
    };
    d.readInt = d.readInt32;
    d.writeUint32 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 4;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 4;
        this.littleEndian
            ? ((this.view[b + 3] = (a >>> 24) & 255), (this.view[b + 2] = (a >>> 16) & 255), (this.view[b + 1] = (a >>> 8) & 255), (this.view[b] = a & 255))
        : ((this.view[b] = (a >>> 24) & 255), (this.view[b + 1] = (a >>> 16) & 255), (this.view[b + 2] = (a >>> 8) & 255), (this.view[b + 3] = a & 255));
        c && (this.offset += 4);
        return this;
    };
    d.writeUInt32 = d.writeUint32;
    d.readUint32 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a + 2] << 16;
            c |= this.view[a + 1] << 8;
            c |= this.view[a];
            c += (this.view[a + 3] << 24) >>> 0;
        } else (c = this.view[a + 1] << 16), (c |= this.view[a + 2] << 8), (c |= this.view[a + 3]), (c += (this.view[a] << 24) >>> 0);
        b && (this.offset += 4);
        return c;
    };
    d.readUInt32 = d.readUint32;
    h &&
        ((d.writeInt64 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" === typeof a) a = h.fromNumber(a);
            else if ("string" === typeof a) a = h.fromString(a);
            else if (!(a && a instanceof h)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        "number" === typeof a ? (a = h.fromNumber(a)) : "string" === typeof a && (a = h.fromString(a));
        b += 8;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 8;
        e = a.low;
        a = a.high;
        this.littleEndian
            ? ((this.view[b + 3] = (e >>> 24) & 255),
               (this.view[b + 2] = (e >>> 16) & 255),
               (this.view[b + 1] = (e >>> 8) & 255),
               (this.view[b] = e & 255),
               (b += 4),
               (this.view[b + 3] = (a >>> 24) & 255),
               (this.view[b + 2] = (a >>> 16) & 255),
               (this.view[b + 1] = (a >>> 8) & 255),
               (this.view[b] = a & 255))
        : ((this.view[b] = (a >>> 24) & 255),
           (this.view[b + 1] = (a >>> 16) & 255),
           (this.view[b + 2] = (a >>> 8) & 255),
           (this.view[b + 3] = a & 255),
           (b += 4),
           (this.view[b] = (e >>> 24) & 255),
           (this.view[b + 1] = (e >>> 16) & 255),
           (this.view[b + 2] = (e >>> 8) & 255),
           (this.view[b + 3] = e & 255));
        c && (this.offset += 8);
        return this;
    }),
         (d.writeLong = d.writeInt64),
         (d.readInt64 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a + 2] << 16;
            c |= this.view[a + 1] << 8;
            c |= this.view[a];
            c += (this.view[a + 3] << 24) >>> 0;
            a += 4;
            var e = this.view[a + 2] << 16;
            e |= this.view[a + 1] << 8;
            e |= this.view[a];
            e += (this.view[a + 3] << 24) >>> 0;
        } else
            (e = this.view[a + 1] << 16),
                (e |= this.view[a + 2] << 8),
                (e |= this.view[a + 3]),
                (e += (this.view[a] << 24) >>> 0),
                (a += 4),
                (c = this.view[a + 1] << 16),
                (c |= this.view[a + 2] << 8),
                (c |= this.view[a + 3]),
                (c += (this.view[a] << 24) >>> 0);
        a = new h(c, e, !1);
        b && (this.offset += 8);
        return a;
    }),
         (d.readLong = d.readInt64),
         (d.writeUint64 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" === typeof a) a = h.fromNumber(a);
            else if ("string" === typeof a) a = h.fromString(a);
            else if (!(a && a instanceof h)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        "number" === typeof a ? (a = h.fromNumber(a)) : "string" === typeof a && (a = h.fromString(a));
        b += 8;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= 8;
        e = a.low;
        a = a.high;
        this.littleEndian
            ? ((this.view[b + 3] = (e >>> 24) & 255),
               (this.view[b + 2] = (e >>> 16) & 255),
               (this.view[b + 1] = (e >>> 8) & 255),
               (this.view[b] = e & 255),
               (b += 4),
               (this.view[b + 3] = (a >>> 24) & 255),
               (this.view[b + 2] = (a >>> 16) & 255),
               (this.view[b + 1] = (a >>> 8) & 255),
               (this.view[b] = a & 255))
        : ((this.view[b] = (a >>> 24) & 255),
           (this.view[b + 1] = (a >>> 16) & 255),
           (this.view[b + 2] = (a >>> 8) & 255),
           (this.view[b + 3] = a & 255),
           (b += 4),
           (this.view[b] = (e >>> 24) & 255),
           (this.view[b + 1] = (e >>> 16) & 255),
           (this.view[b + 2] = (e >>> 8) & 255),
           (this.view[b + 3] = e & 255));
        c && (this.offset += 8);
        return this;
    }),
         (d.writeUInt64 = d.writeUint64),
         (d.readUint64 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
        }
        if (this.littleEndian) {
            var c = this.view[a + 2] << 16;
            c |= this.view[a + 1] << 8;
            c |= this.view[a];
            c += (this.view[a + 3] << 24) >>> 0;
            a += 4;
            var e = this.view[a + 2] << 16;
            e |= this.view[a + 1] << 8;
            e |= this.view[a];
            e += (this.view[a + 3] << 24) >>> 0;
        } else
            (e = this.view[a + 1] << 16),
                (e |= this.view[a + 2] << 8),
                (e |= this.view[a + 3]),
                (e += (this.view[a] << 24) >>> 0),
                (a += 4),
                (c = this.view[a + 1] << 16),
                (c |= this.view[a + 2] << 8),
                (c |= this.view[a + 3]),
                (c += (this.view[a] << 24) >>> 0);
        a = new h(c, e, !0);
        b && (this.offset += 8);
        return a;
    }),
         (d.readUInt64 = d.readUint64));
    d.writeFloat32 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 4;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        y(this.view, a, b - 4, this.littleEndian, 23, 4);
        c && (this.offset += 4);
        return this;
    };
    d.writeFloat = d.writeFloat32;
    d.readFloat32 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
        }
        a = v(this.view, a, this.littleEndian, 23, 4);
        b && (this.offset += 4);
        return a;
    };
    d.readFloat = d.readFloat32;
    d.writeFloat64 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        b += 8;
        var e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        y(this.view, a, b - 8, this.littleEndian, 52, 8);
        c && (this.offset += 8);
        return this;
    };
    d.writeDouble = d.writeFloat64;
    d.readFloat64 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
        }
        a = v(this.view, a, this.littleEndian, 52, 8);
        b && (this.offset += 8);
        return a;
    };
    d.readDouble = d.readFloat64;
    g.MAX_VARINT32_BYTES = 5;
    g.calculateVarint32 = function (a) {
        a >>>= 0;
        return 128 > a ? 1 : 16384 > a ? 2 : 2097152 > a ? 3 : 268435456 > a ? 4 : 5;
    };
    g.zigZagEncode32 = function (a) {
        return (((a |= 0) << 1) ^ (a >> 31)) >>> 0;
    };
    g.zigZagDecode32 = function (a) {
        return ((a >>> 1) ^ -(a & 1)) | 0;
    };
    d.writeVarint32 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        var e = g.calculateVarint32(a);
        b += e;
        var k = this.buffer.byteLength;
        b > k && this.resize((k *= 2) > b ? k : b);
        b -= e;
        for (a >>>= 0; 128 <= a; ) (k = (a & 127) | 128), (this.view[b++] = k), (a >>>= 7);
        this.view[b++] = a;
        return c ? ((this.offset = b), this) : e;
    };
    d.writeVarint32ZigZag = function (a, b) {
        return this.writeVarint32(g.zigZagEncode32(a), b);
    };
    d.readVarint32 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        var c = 0,
            e = 0;
        do {
            if (!this.noAssert && a > this.limit) throw ((a = Error("Truncated")), (a.truncated = !0), a);
            var k = this.view[a++];
            5 > c && (e |= (k & 127) << (7 * c));
            ++c;
        } while (0 !== (k & 128));
        e |= 0;
        return b ? ((this.offset = a), e) : { value: e, length: c };
    };
    d.readVarint32ZigZag = function (a) {
        a = this.readVarint32(a);
        "object" === typeof a ? (a.value = g.zigZagDecode32(a.value)) : (a = g.zigZagDecode32(a));
        return a;
    };
    h &&
        ((g.MAX_VARINT64_BYTES = 10),
         (g.calculateVarint64 = function (a) {
        "number" === typeof a ? (a = h.fromNumber(a)) : "string" === typeof a && (a = h.fromString(a));
        var b = a.toInt() >>> 0,
            c = a.shiftRightUnsigned(28).toInt() >>> 0;
        a = a.shiftRightUnsigned(56).toInt() >>> 0;
        return 0 == a ? (0 == c ? (16384 > b ? (128 > b ? 1 : 2) : 2097152 > b ? 3 : 4) : 16384 > c ? (128 > c ? 5 : 6) : 2097152 > c ? 7 : 8) : 128 > a ? 9 : 10;
    }),
         (g.zigZagEncode64 = function (a) {
        "number" === typeof a ? (a = h.fromNumber(a, !1)) : "string" === typeof a ? (a = h.fromString(a, !1)) : !1 !== a.unsigned && (a = a.toSigned());
        return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned();
    }),
         (g.zigZagDecode64 = function (a) {
        "number" === typeof a ? (a = h.fromNumber(a, !1)) : "string" === typeof a ? (a = h.fromString(a, !1)) : !1 !== a.unsigned && (a = a.toSigned());
        return a.shiftRightUnsigned(1).xor(a.and(h.ONE).toSigned().negate()).toSigned();
    }),
         (d.writeVarint64 = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" === typeof a) a = h.fromNumber(a);
            else if ("string" === typeof a) a = h.fromString(a);
            else if (!(a && a instanceof h)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        "number" === typeof a ? (a = h.fromNumber(a, !1)) : "string" === typeof a ? (a = h.fromString(a, !1)) : !1 !== a.unsigned && (a = a.toSigned());
        var e = g.calculateVarint64(a),
            k = a.toInt() >>> 0,
            f = a.shiftRightUnsigned(28).toInt() >>> 0;
        a = a.shiftRightUnsigned(56).toInt() >>> 0;
        b += e;
        var d = this.buffer.byteLength;
        b > d && this.resize((d *= 2) > b ? d : b);
        b -= e;
        switch (e) {
            case 10:
                this.view[b + 9] = (a >>> 7) & 1;
            case 9:
                this.view[b + 8] = 9 !== e ? a | 128 : a & 127;
            case 8:
                this.view[b + 7] = 8 !== e ? (f >>> 21) | 128 : (f >>> 21) & 127;
            case 7:
                this.view[b + 6] = 7 !== e ? (f >>> 14) | 128 : (f >>> 14) & 127;
            case 6:
                this.view[b + 5] = 6 !== e ? (f >>> 7) | 128 : (f >>> 7) & 127;
            case 5:
                this.view[b + 4] = 5 !== e ? f | 128 : f & 127;
            case 4:
                this.view[b + 3] = 4 !== e ? (k >>> 21) | 128 : (k >>> 21) & 127;
            case 3:
                this.view[b + 2] = 3 !== e ? (k >>> 14) | 128 : (k >>> 14) & 127;
            case 2:
                this.view[b + 1] = 2 !== e ? (k >>> 7) | 128 : (k >>> 7) & 127;
            case 1:
                this.view[b] = 1 !== e ? k | 128 : k & 127;
        }
        return c ? ((this.offset += e), this) : e;
    }),
         (d.writeVarint64ZigZag = function (a, b) {
        return this.writeVarint64(g.zigZagEncode64(a), b);
    }),
         (d.readVarint64 = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        var c = a,
            e = 0,
            k = 0;
        var d = this.view[a++];
        var g = d & 127;
        if (
            d & 128 &&
            ((d = this.view[a++]), (g |= (d & 127) << 7), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (g |= (d & 127) << 14), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (g |= (d & 127) << 21), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (e = d & 127), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (e |= (d & 127) << 7), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (e |= (d & 127) << 14), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (e |= (d & 127) << 21), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (k = d & 127), d & 128 || (this.noAssert && "undefined" === typeof d)) &&
            ((d = this.view[a++]), (k |= (d & 127) << 7), d & 128 || (this.noAssert && "undefined" === typeof d))
        )
            throw Error("Buffer overrun");
        g = h.fromBits(g | (e << 28), (e >>> 4) | (k << 24), !1);
        return b ? ((this.offset = a), g) : { value: g, length: a - c };
    }),
         (d.readVarint64ZigZag = function (a) {
        (a = this.readVarint64(a)) && a.value instanceof h ? (a.value = g.zigZagDecode64(a.value)) : (a = g.zigZagDecode64(a));
        return a;
    }));
    d.writeCString = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        var e,
            d = a.length;
        if (!this.noAssert) {
            if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
            for (e = 0; e < d; ++e) if (0 === a.charCodeAt(e)) throw RangeError("Illegal str: Contains NULL-characters");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        d = m.calculateUTF16asUTF8(l(a))[1];
        b += d + 1;
        e = this.buffer.byteLength;
        b > e && this.resize((e *= 2) > b ? e : b);
        b -= d + 1;
        m.encodeUTF16toUTF8(
            l(a),
            function (a) {
                this.view[b++] = a;
            }.bind(this)
        );
        this.view[b++] = 0;
        return c ? ((this.offset = b), this) : d;
    };
    d.readCString = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        var c = a,
            e,
            d = -1;
        m.decodeUTF8toUTF16(
            function () {
                if (0 === d) return null;
                if (a >= this.limit) throw RangeError("Illegal range: Truncated data, " + a + " < " + this.limit);
                d = this.view[a++];
                return 0 === d ? null : d;
            }.bind(this),
            (e = t()),
            !0
        );
        return b ? ((this.offset = a), e()) : { string: e(), length: a - c };
    };
    d.writeIString = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        var e = b;
        var d = m.calculateUTF16asUTF8(l(a), this.noAssert)[1];
        b += 4 + d;
        var f = this.buffer.byteLength;
        b > f && this.resize((f *= 2) > b ? f : b);
        b -= 4 + d;
        this.littleEndian
            ? ((this.view[b + 3] = (d >>> 24) & 255), (this.view[b + 2] = (d >>> 16) & 255), (this.view[b + 1] = (d >>> 8) & 255), (this.view[b] = d & 255))
        : ((this.view[b] = (d >>> 24) & 255), (this.view[b + 1] = (d >>> 16) & 255), (this.view[b + 2] = (d >>> 8) & 255), (this.view[b + 3] = d & 255));
        b += 4;
        m.encodeUTF16toUTF8(
            l(a),
            function (a) {
                this.view[b++] = a;
            }.bind(this)
        );
        if (b !== e + 4 + d) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + 4 + d));
        return c ? ((this.offset = b), this) : b - e;
    };
    d.readIString = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
        }
        var c = a,
            e = this.readUint32(a);
        e = this.readUTF8String(e, g.METRICS_BYTES, (a += 4));
        a += e.length;
        return b ? ((this.offset = a), e.string) : { string: e.string, length: a - c };
    };
    g.METRICS_CHARS = "c";
    g.METRICS_BYTES = "b";
    d.writeUTF8String = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        var e = b;
        var d = m.calculateUTF16asUTF8(l(a))[1];
        b += d;
        var f = this.buffer.byteLength;
        b > f && this.resize((f *= 2) > b ? f : b);
        b -= d;
        m.encodeUTF16toUTF8(
            l(a),
            function (a) {
                this.view[b++] = a;
            }.bind(this)
        );
        return c ? ((this.offset = b), this) : b - e;
    };
    d.writeString = d.writeUTF8String;
    g.calculateUTF8Chars = function (a) {
        return m.calculateUTF16asUTF8(l(a))[0];
    };
    g.calculateUTF8Bytes = function (a) {
        return m.calculateUTF16asUTF8(l(a))[1];
    };
    g.calculateString = g.calculateUTF8Bytes;
    d.readUTF8String = function (a, b, c) {
        "number" === typeof b && ((c = b), (b = void 0));
        var e = "undefined" === typeof c;
        e && (c = this.offset);
        "undefined" === typeof b && (b = g.METRICS_CHARS);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
            c >>>= 0;
            if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
        }
        var d = 0,
            f = c;
        if (b === g.METRICS_CHARS) {
            var p = t();
            m.decodeUTF8(
                function () {
                    return d < a && c < this.limit ? this.view[c++] : null;
                }.bind(this),
                function (a) {
                    ++d;
                    m.UTF8toUTF16(a, p);
                }
            );
            if (d !== a) throw RangeError("Illegal range: Truncated data, " + d + " == " + a);
            return e ? ((this.offset = c), p()) : { string: p(), length: c - f };
        }
        if (b === g.METRICS_BYTES) {
            if (!this.noAssert) {
                if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
                c >>>= 0;
                if (0 > c || c + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+" + a + ") <= " + this.buffer.byteLength);
            }
            var h = c + a;
            m.decodeUTF8toUTF16(
                function () {
                    return c < h ? this.view[c++] : null;
                }.bind(this),
                (p = t()),
                this.noAssert
            );
            if (c !== h) throw RangeError("Illegal range: Truncated data, " + c + " == " + h);
            return e ? ((this.offset = c), p()) : { string: p(), length: c - f };
        }
        throw TypeError("Unsupported metrics: " + b);
    };
    d.readString = d.readUTF8String;
    d.writeVString = function (a, b) {
        var c = "undefined" === typeof b;
        c && (b = this.offset);
        if (!this.noAssert) {
            if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");
            b >>>= 0;
            if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
        }
        var e = b;
        var d = m.calculateUTF16asUTF8(l(a), this.noAssert)[1];
        var f = g.calculateVarint32(d);
        b += f + d;
        var p = this.buffer.byteLength;
        b > p && this.resize((p *= 2) > b ? p : b);
        b -= f + d;
        b += this.writeVarint32(d, b);
        m.encodeUTF16toUTF8(
            l(a),
            function (a) {
                this.view[b++] = a;
            }.bind(this)
        );
        if (b !== e + d + f) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + d + f));
        return c ? ((this.offset = b), this) : b - e;
    };
    d.readVString = function (a) {
        var b = "undefined" === typeof a;
        b && (a = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
        }
        var c = a,
            e = this.readVarint32(a);
        e = this.readUTF8String(e.value, g.METRICS_BYTES, (a += e.length));
        a += e.length;
        return b ? ((this.offset = a), e.string) : { string: e.string, length: a - c };
    };
    d.append = function (a, b, c) {
        if ("number" === typeof b || "string" !== typeof b) (c = b), (b = void 0);
        var e = "undefined" === typeof c;
        e && (c = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
            c >>>= 0;
            if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
        }
        a instanceof g || (a = g.wrap(a, b));
        b = a.limit - a.offset;
        if (0 >= b) return this;
        c += b;
        var d = this.buffer.byteLength;
        c > d && this.resize((d *= 2) > c ? d : c);
        c -= b;
        this.view.set(a.view.subarray(a.offset, a.limit), c);
        a.offset += b;
        e && (this.offset += b);
        return this;
    };
    d.appendTo = function (a, b) {
        a.append(this, b);
        return this;
    };
    d.writeBytes = d.append;
    d.assert = function (a) {
        this.noAssert = !a;
        return this;
    };
    d.capacity = function () {
        return this.buffer.byteLength;
    };
    d.clear = function () {
        this.offset = 0;
        this.limit = this.buffer.byteLength;
        this.markedOffset = -1;
        return this;
    };
    d.clone = function (a) {
        var b = new g(0, this.littleEndian, this.noAssert);
        a ? ((b.buffer = new ArrayBuffer(this.buffer.byteLength)), (b.view = new Uint8Array(b.buffer))) : ((b.buffer = this.buffer), (b.view = this.view));
        b.offset = this.offset;
        b.markedOffset = this.markedOffset;
        b.limit = this.limit;
        return b;
    };
    d.compact = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        if (0 === a && b === this.buffer.byteLength) return this;
        var c = b - a;
        if (0 === c) return (this.buffer = w), (this.view = null), 0 <= this.markedOffset && (this.markedOffset -= a), (this.limit = this.offset = 0), this;
        var e = new ArrayBuffer(c),
            d = new Uint8Array(e);
        d.set(this.view.subarray(a, b));
        this.buffer = e;
        this.view = d;
        0 <= this.markedOffset && (this.markedOffset -= a);
        this.offset = 0;
        this.limit = c;
        return this;
    };
    d.copy = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        if (a === b) return new g(0, this.littleEndian, this.noAssert);
        var c = b - a,
            e = new g(c, this.littleEndian, this.noAssert);
        e.offset = 0;
        e.limit = c;
        0 <= e.markedOffset && (e.markedOffset -= a);
        this.copyTo(e, 0, a, b);
        return e;
    };
    d.copyTo = function (a, b, c, e) {
        var d, f;
        if (!this.noAssert && !g.isByteBuffer(a)) throw TypeError("Illegal target: Not a ByteBuffer");
        b = (f = "undefined" === typeof b) ? a.offset : b | 0;
        c = (d = "undefined" === typeof c) ? this.offset : c | 0;
        e = "undefined" === typeof e ? this.limit : e | 0;
        if (0 > b || b > a.buffer.byteLength) throw RangeError("Illegal target range: 0 <= " + b + " <= " + a.buffer.byteLength);
        if (0 > c || e > this.buffer.byteLength) throw RangeError("Illegal source range: 0 <= " + c + " <= " + this.buffer.byteLength);
        var p = e - c;
        if (0 === p) return a;
        a.ensureCapacity(b + p);
        a.view.set(this.view.subarray(c, e), b);
        d && (this.offset += p);
        f && (a.offset += p);
        return this;
    };
    d.ensureCapacity = function (a) {
        var b = this.buffer.byteLength;
        return b < a ? this.resize((b *= 2) > a ? b : a) : this;
    };
    d.fill = function (a, b, c) {
        var e = "undefined" === typeof b;
        e && (b = this.offset);
        "string" === typeof a && 0 < a.length && (a = a.charCodeAt(0));
        "undefined" === typeof b && (b = this.offset);
        "undefined" === typeof c && (c = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");
            a |= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal begin: Not an integer");
            b >>>= 0;
            if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal end: Not an integer");
            c >>>= 0;
            if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
        }
        if (b >= c) return this;
        for (; b < c; ) this.view[b++] = a;
        e && (this.offset = b);
        return this;
    };
    d.flip = function () {
        this.limit = this.offset;
        this.offset = 0;
        return this;
    };
    d.mark = function (a) {
        a = "undefined" === typeof a ? this.offset : a;
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
            a >>>= 0;
            if (0 > a || a + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+0) <= " + this.buffer.byteLength);
        }
        this.markedOffset = a;
        return this;
    };
    d.order = function (a) {
        if (!this.noAssert && "boolean" !== typeof a) throw TypeError("Illegal littleEndian: Not a boolean");
        this.littleEndian = !!a;
        return this;
    };
    d.LE = function (a) {
        this.littleEndian = "undefined" !== typeof a ? !!a : !0;
        return this;
    };
    d.BE = function (a) {
        this.littleEndian = "undefined" !== typeof a ? !a : !1;
        return this;
    };
    d.prepend = function (a, b, c) {
        if ("number" === typeof b || "string" !== typeof b) (c = b), (b = void 0);
        var e = "undefined" === typeof c;
        e && (c = this.offset);
        if (!this.noAssert) {
            if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");
            c >>>= 0;
            if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
        }
        a instanceof g || (a = g.wrap(a, b));
        b = a.limit - a.offset;
        if (0 >= b) return this;
        var d = b - c;
        if (0 < d) {
            var f = new ArrayBuffer(this.buffer.byteLength + d),
                p = new Uint8Array(f);
            p.set(this.view.subarray(c, this.buffer.byteLength), b);
            this.buffer = f;
            this.view = p;
            this.offset += d;
            0 <= this.markedOffset && (this.markedOffset += d);
            this.limit += d;
            c += d;
        } else new Uint8Array(this.buffer);
        this.view.set(a.view.subarray(a.offset, a.limit), c - b);
        a.offset = a.limit;
        e && (this.offset -= b);
        return this;
    };
    d.prependTo = function (a, b) {
        a.prepend(this, b);
        return this;
    };
    d.printDebug = function (a) {
        "function" !== typeof a && (a = console.log.bind(console));
        a(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(!0));
    };
    d.remaining = function () {
        return this.limit - this.offset;
    };
    d.reset = function () {
        0 <= this.markedOffset ? ((this.offset = this.markedOffset), (this.markedOffset = -1)) : (this.offset = 0);
        return this;
    };
    d.resize = function (a) {
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal capacity: " + a + " (not an integer)");
            a |= 0;
            if (0 > a) throw RangeError("Illegal capacity: 0 <= " + a);
        }
        if (this.buffer.byteLength < a) {
            a = new ArrayBuffer(a);
            var b = new Uint8Array(a);
            b.set(this.view);
            this.buffer = a;
            this.view = b;
        }
        return this;
    };
    d.reverse = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        if (a === b) return this;
        Array.prototype.reverse.call(this.view.subarray(a, b));
        return this;
    };
    d.skip = function (a) {
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");
            a |= 0;
        }
        var b = this.offset + a;
        if (!this.noAssert && (0 > b || b > this.buffer.byteLength)) throw RangeError("Illegal length: 0 <= " + this.offset + " + " + a + " <= " + this.buffer.byteLength);
        this.offset = b;
        return this;
    };
    d.slice = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        var c = this.clone();
        c.offset = a;
        c.limit = b;
        return c;
    };
    d.toBuffer = function (a) {
        var b = this.offset,
            c = this.limit;
        if (!this.noAssert) {
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: Not an integer");
            b >>>= 0;
            if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal limit: Not an integer");
            c >>>= 0;
            if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
        }
        if (!a && 0 === b && c === this.buffer.byteLength) return this.buffer;
        if (b === c) return w;
        a = new ArrayBuffer(c - b);
        new Uint8Array(a).set(new Uint8Array(this.buffer).subarray(b, c), 0);
        return a;
    };
    d.toArrayBuffer = d.toBuffer;
    d.toString = function (a, b, c) {
        if ("undefined" === typeof a) return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";
        "number" === typeof a && (c = b = a = "utf8");
        switch (a) {
            case "utf8":
                return this.toUTF8(b, c);
            case "base64":
                return this.toBase64(b, c);
            case "hex":
                return this.toHex(b, c);
            case "binary":
                return this.toBinary(b, c);
            case "debug":
                return this.toDebug();
            case "columns":
                return this.toColumns();
            default:
                throw Error("Unsupported encoding: " + a);
        }
    };
    var z = (function () {
        for (
            var a = {},
            b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99,
                 100,
                 101,
                 102,
                 103,
                 104,
                 105,
                 106,
                 107,
                 108,
                 109,
                 110,
                 111,
                 112,
                 113,
                 114,
                 115,
                 116,
                 117,
                 118,
                 119,
                 120,
                 121,
                 122,
                 48,
                 49,
                 50,
                 51,
                 52,
                 53,
                 54,
                 55,
                 56,
                 57,
                 43,
                 47,
                ],
            c = [],
            e = 0,
            d = b.length;
            e < d;
            ++e
        )
            c[b[e]] = e;
        a.encode = function (a, c) {
            for (var e, d; null !== (e = a()); )
                c(b[(e >> 2) & 63]),
                    (d = (e & 3) << 4),
                    null !== (e = a())
                    ? ((d |= (e >> 4) & 15), c(b[(d | ((e >> 4) & 15)) & 63]), (d = (e & 15) << 2), null !== (e = a()) ? (c(b[(d | ((e >> 6) & 3)) & 63]), c(b[e & 63])) : (c(b[d & 63]), c(61)))
                : (c(b[d & 63]), c(61), c(61));
        };
        a.decode = function (a, b) {
            function e(a) {
                throw Error("Illegal character code: " + a);
            }
            for (var d, k, f; null !== (d = a()); )
                if (((k = c[d]), "undefined" === typeof k && e(d), null !== (d = a()) && ((f = c[d]), "undefined" === typeof f && e(d), b(((k << 2) >>> 0) | ((f & 48) >> 4)), null !== (d = a())))) {
                    k = c[d];
                    if ("undefined" === typeof k)
                        if (61 === d) break;
                        else e(d);
                    b((((f & 15) << 4) >>> 0) | ((k & 60) >> 2));
                    if (null !== (d = a())) {
                        f = c[d];
                        if ("undefined" === typeof f)
                            if (61 === d) break;
                            else e(d);
                        b((((k & 3) << 6) >>> 0) | f);
                    }
                }
        };
        a.test = function (a) {
            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a);
        };
        return a;
    })();
    d.toBase64 = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        a |= 0;
        b |= 0;
        if (0 > a || b > this.capacity || a > b) throw RangeError("begin, end");
        var c;
        z.encode(
            function () {
                return a < b ? this.view[a++] : null;
            }.bind(this),
            (c = t())
        );
        return c();
    };
    g.fromBase64 = function (a, b) {
        if ("string" !== typeof a) throw TypeError("str");
        var c = new g((a.length / 4) * 3, b),
            e = 0;
        z.decode(l(a), function (a) {
            c.view[e++] = a;
        });
        c.limit = e;
        return c;
    };
    g.btoa = function (a) {
        return g.fromBinary(a).toBase64();
    };
    g.atob = function (a) {
        return g.fromBase64(a).toBinary();
    };
    d.toBinary = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        a |= 0;
        b |= 0;
        if (0 > a || b > this.capacity() || a > b) throw RangeError("begin, end");
        if (a === b) return "";
        for (var c = [], e = []; a < b; ) c.push(this.view[a++]), 1024 <= c.length && (e.push(String.fromCharCode.apply(String, c)), (c = []));
        return e.join("") + String.fromCharCode.apply(String, c);
    };
    g.fromBinary = function (a, b) {
        if ("string" !== typeof a) throw TypeError("str");
        for (var c = 0, e = a.length, d = new g(e, b); c < e; ) {
            b = a.charCodeAt(c);
            if (255 < b) throw RangeError("illegal char code: " + b);
            d.view[c++] = b;
        }
        d.limit = e;
        return d;
    };
    d.toDebug = function (a) {
        for (var b = -1, c = this.buffer.byteLength, e, d = "", f = "", g = ""; b < c; ) {
            -1 !== b && ((e = this.view[b]), (d = 16 > e ? d + ("0" + e.toString(16).toUpperCase()) : d + e.toString(16).toUpperCase()), a && (f += 32 < e && 127 > e ? String.fromCharCode(e) : "."));
            ++b;
            if (a && 0 < b && 0 === b % 16 && b !== c) {
                for (; 51 > d.length; ) d += " ";
                g += d + f + "\n";
                d = f = "";
            }
            d =
                b === this.offset && b === this.limit
                ? d + (b === this.markedOffset ? "!" : "|")
            : b === this.offset
                ? d + (b === this.markedOffset ? "[" : "<")
            : b === this.limit
                ? d + (b === this.markedOffset ? "]" : ">")
            : d + (b === this.markedOffset ? "'" : a || (0 !== b && b !== c) ? " " : "");
        }
        if (a && " " !== d) {
            for (; 51 > d.length; ) d += " ";
            g += d + f + "\n";
        }
        return a ? g : d;
    };
    g.fromDebug = function (a, b, c) {
        var e = a.length;
        b = new g(((e + 1) / 3) | 0, b, c);
        for (var d = 0, f = 0, h, l = !1, n = !1, m = !1, q = !1, r = !1; d < e; ) {
            switch ((h = a.charAt(d++))) {
                case "!":
                    if (!c) {
                        if (n || m || q) {
                            r = !0;
                            break;
                        }
                        n = m = q = !0;
                    }
                    b.offset = b.markedOffset = b.limit = f;
                    l = !1;
                    break;
                case "|":
                    if (!c) {
                        if (n || q) {
                            r = !0;
                            break;
                        }
                        n = q = !0;
                    }
                    b.offset = b.limit = f;
                    l = !1;
                    break;
                case "[":
                    if (!c) {
                        if (n || m) {
                            r = !0;
                            break;
                        }
                        n = m = !0;
                    }
                    b.offset = b.markedOffset = f;
                    l = !1;
                    break;
                case "<":
                    if (!c) {
                        if (n) {
                            r = !0;
                            break;
                        }
                        n = !0;
                    }
                    b.offset = f;
                    l = !1;
                    break;
                case "]":
                    if (!c) {
                        if (q || m) {
                            r = !0;
                            break;
                        }
                        q = m = !0;
                    }
                    b.limit = b.markedOffset = f;
                    l = !1;
                    break;
                case ">":
                    if (!c) {
                        if (q) {
                            r = !0;
                            break;
                        }
                        q = !0;
                    }
                    b.limit = f;
                    l = !1;
                    break;
                case "'":
                    if (!c) {
                        if (m) {
                            r = !0;
                            break;
                        }
                        m = !0;
                    }
                    b.markedOffset = f;
                    l = !1;
                    break;
                case " ":
                    l = !1;
                    break;
                default:
                    if (!c && l) r = !0;
                    else {
                        h = parseInt(h + a.charAt(d++), 16);
                        if (!c && (isNaN(h) || 0 > h || 255 < h)) throw TypeError("Illegal str: Not a debug encoded string");
                        b.view[f++] = h;
                        l = !0;
                    }
            }
            if (r) throw TypeError("Illegal str: Invalid symbol at " + d);
        }
        if (!c) {
            if (!n || !q) throw TypeError("Illegal str: Missing offset or limit");
            if (f < b.buffer.byteLength) throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + f + " < " + e);
        }
        return b;
    };
    d.toHex = function (a, b) {
        a = "undefined" === typeof a ? this.offset : a;
        b = "undefined" === typeof b ? this.limit : b;
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        for (var c = Array(b - a), e; a < b; ) (e = this.view[a++]), 16 > e ? c.push("0", e.toString(16)) : c.push(e.toString(16));
        return c.join("");
    };
    g.fromHex = function (a, b, c) {
        if (!c) {
            if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
            if (0 !== a.length % 2) throw TypeError("Illegal str: Length not a multiple of 2");
        }
        var e = a.length;
        b = new g((e / 2) | 0, b);
        for (var d, f = 0, h = 0; f < e; f += 2) {
            d = parseInt(a.substring(f, f + 2), 16);
            if (!c && (!isFinite(d) || 0 > d || 255 < d)) throw TypeError("Illegal str: Contains non-hex characters");
            b.view[h++] = d;
        }
        b.limit = h;
        return b;
    };
    var m = (function () {
        var a = {
            MAX_CODEPOINT: 1114111,
            encodeUTF8: function (a, c) {
                var b = null;
                "number" === typeof a &&
                    ((b = a),
                     (a = function () {
                    return null;
                }));
                for (; null !== b || null !== (b = a()); )
                    128 > b
                        ? c(b & 127)
                    : (2048 > b ? c(((b >> 6) & 31) | 192) : 65536 > b ? (c(((b >> 12) & 15) | 224), c(((b >> 6) & 63) | 128)) : (c(((b >> 18) & 7) | 240), c(((b >> 12) & 63) | 128), c(((b >> 6) & 63) | 128)), c((b & 63) | 128)),
                        (b = null);
            },
            decodeUTF8: function (a, c) {
                for (
                    var b,
                    d,
                    f,
                    g,
                    h = function (a) {
                        a = a.slice(0, a.indexOf(null));
                        var b = Error(a.toString());
                        b.name = "TruncatedError";
                        b.bytes = a;
                        throw b;
                    };
                    null !== (b = a());

                )
                    if (0 === (b & 128)) c(b);
                    else if (192 === (b & 224)) null === (d = a()) && h([b, d]), c(((b & 31) << 6) | (d & 63));
                    else if (224 === (b & 240)) (null !== (d = a()) && null !== (f = a())) || h([b, d, f]), c(((b & 15) << 12) | ((d & 63) << 6) | (f & 63));
                    else if (240 === (b & 248)) (null !== (d = a()) && null !== (f = a()) && null !== (g = a())) || h([b, d, f, g]), c(((b & 7) << 18) | ((d & 63) << 12) | ((f & 63) << 6) | (g & 63));
                    else throw RangeError("Illegal starting byte: " + b);
            },
            UTF16toUTF8: function (a, c) {
                for (var b, d = null; null !== (b = null !== d ? d : a()); ) 55296 <= b && 57343 >= b && null !== (d = a()) && 56320 <= d && 57343 >= d ? (c(1024 * (b - 55296) + d - 56320 + 65536), (d = null)) : c(b);
                null !== d && c(d);
            },
            UTF8toUTF16: function (a, c) {
                var b = null;
                "number" === typeof a &&
                    ((b = a),
                     (a = function () {
                    return null;
                }));
                for (; null !== b || null !== (b = a()); ) 65535 >= b ? c(b) : ((b -= 65536), c((b >> 10) + 55296), c((b % 1024) + 56320)), (b = null);
            },
            encodeUTF16toUTF8: function (b, c) {
                a.UTF16toUTF8(b, function (b) {
                    a.encodeUTF8(b, c);
                });
            },
            decodeUTF8toUTF16: function (b, c) {
                a.decodeUTF8(b, function (b) {
                    a.UTF8toUTF16(b, c);
                });
            },
            calculateCodePoint: function (a) {
                return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
            },
            calculateUTF8: function (a) {
                for (var b, d = 0; null !== (b = a()); ) d += 128 > b ? 1 : 2048 > b ? 2 : 65536 > b ? 3 : 4;
                return d;
            },
            calculateUTF16asUTF8: function (b) {
                var c = 0,
                    d = 0;
                a.UTF16toUTF8(b, function (a) {
                    ++c;
                    d += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
                });
                return [c, d];
            },
        };
        return a;
    })();
    d.toUTF8 = function (a, b) {
        "undefined" === typeof a && (a = this.offset);
        "undefined" === typeof b && (b = this.limit);
        if (!this.noAssert) {
            if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
            a >>>= 0;
            if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");
            b >>>= 0;
            if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
        }
        var c;
        try {
            m.decodeUTF8toUTF16(
                function () {
                    return a < b ? this.view[a++] : null;
                }.bind(this),
                (c = t())
            );
        } catch (e) {
            if (a !== b) throw RangeError("Illegal range: Truncated data, " + a + " != " + b);
        }
        return c();
    };
    g.fromUTF8 = function (a, b, c) {
        if (!c && "string" !== typeof a) throw TypeError("Illegal str: Not a string");
        var d = new g(m.calculateUTF16asUTF8(l(a), !0)[1], b, c),
            h = 0;
        m.encodeUTF16toUTF8(l(a), function (a) {
            d.view[h++] = a;
        });
        d.limit = h;
        return d;
    };
    return g;
});
const { ByteBuffer } = dcodeIO;

/**
 * Optimized Priority Queue Implementation (Min-Heap)
 * Stores elements with associated priorities (keys in D* Lite).
 * Uses a map for O(1) average time complexity for finding elements.
 */
class PriorityQueue {
    constructor() {
        // Array to store heap elements: { element: string (key "x,y"), priority: number[] }
        this.heap = [];
        // Map to store the index of each element in the heap: { elementKey: index }
        this.indices = new Map();
    }

    // Helper function to compare priorities (keys in D* Lite)
    compare(keyA, keyB) {
        if (keyA[0] < keyB[0]) return -1;
        if (keyA[0] > keyB[0]) return 1;
        // If k1 is equal, compare k2
        if (keyA[1] < keyB[1]) return -1;
        if (keyA[1] > keyB[1]) return 1;
        return 0; // Keys are equal
    }

    // Add an element (string key) with its priority
    push(elementKey, priority) {
        if (this.indices.has(elementKey)) {
            // If element already exists, update its priority instead of pushing
            this.update(elementKey, priority);
            return;
        }
        const index = this.heap.length;
        this.heap.push({ element: elementKey, priority });
        this.indices.set(elementKey, index);
        this.bubbleUp(index);
    }

    // Remove and return the element (string key) with the lowest priority
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        const topItem = this.heap[0];
        const lastItem = this.heap.pop(); // Remove last element

        this.indices.delete(topItem.element); // Remove top element's index

        if (!this.isEmpty()) {
            // Move the last item to the top
            this.heap[0] = lastItem;
            this.indices.set(lastItem.element, 0); // Update index of moved element
            this.bubbleDown(0); // Restore heap property
        }

        return topItem.element; // Return only the element key
    }

    // Get the element (string key) and priority with the lowest priority without removing it
    peek() {
        return this.isEmpty() ? null : this.heap[0]; // Return { element: key, priority: [...] }
    }

    // Update the priority of an element (string key)
    update(elementKey, newPriority) {
        if (!this.indices.has(elementKey)) {
            // If element not found, push it
            this.push(elementKey, newPriority);
            return;
            // Alternatively, throw an error or return if update implies existence
            // console.warn(`Element ${elementKey} not found for update.`);
            // return;
        }

        const index = this.indices.get(elementKey);
        const oldPriority = this.heap[index].priority;
        this.heap[index].priority = newPriority;

        // Decide whether to bubble up or down based on priority change
        if (this.compare(newPriority, oldPriority) < 0) {
            this.bubbleUp(index);
        } else {
            this.bubbleDown(index);
        }
    }

    // Remove an element (string key) from the queue
    remove(elementKey) {
        if (!this.indices.has(elementKey)) {
            return false; // Element not found
        }

        const indexToRemove = this.indices.get(elementKey);
        const lastItem = this.heap.pop(); // Remove last element

        this.indices.delete(elementKey); // Remove target element's index

        // If the element to remove wasn't the last element
        if (indexToRemove < this.heap.length) {
            const oldPriority = this.heap[indexToRemove].priority; // Priority before overwriting
            this.heap[indexToRemove] = lastItem; // Move last element to the removed spot
            this.indices.set(lastItem.element, indexToRemove); // Update index map

            // Re-heapify: Bubble up or down based on priority comparison
            if (this.compare(lastItem.priority, oldPriority) < 0) {
                this.bubbleUp(indexToRemove);
            } else {
                this.bubbleDown(indexToRemove);
            }
        }
        return true; // Indicate removal was successful
    }

    // Check if the queue is empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Get the size of the queue
    size() {
        return this.heap.length;
    }

    // Check if an element (string key) exists in the queue (O(1) average)
    includes(elementKey) {
        return this.indices.has(elementKey);
    }

    // --- Heap Helper Methods ---

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChild(index) {
        return 2 * index + 1;
    }

    rightChild(index) {
        return 2 * index + 2;
    }

    // Swap elements at indices i and j, updating the index map
    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
        // Update indices map
        this.indices.set(this.heap[i].element, i);
        this.indices.set(this.heap[j].element, j);
    }

    // Bubble up element at index, maintaining index map
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = this.parent(index);
            if (this.compare(this.heap[index].priority, this.heap[parentIndex].priority) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    // Bubble down element at index, maintaining index map
    bubbleDown(index) {
        const size = this.heap.length;
        while (true) {
            let smallestIndex = index;
            const leftIndex = this.leftChild(index);
            const rightIndex = this.rightChild(index);

            if (leftIndex < size && this.compare(this.heap[leftIndex].priority, this.heap[smallestIndex].priority) < 0) {
                smallestIndex = leftIndex;
            }

            if (rightIndex < size && this.compare(this.heap[rightIndex].priority, this.heap[smallestIndex].priority) < 0) {
                smallestIndex = rightIndex;
            }

            if (smallestIndex !== index) {
                this.swap(index, smallestIndex);
                index = smallestIndex;
            } else {
                break;
            }
        }
    }
}

/**
 * D* Lite Algorithm Implementation (Using Optimized Priority Queue)
 */
class DStarLite {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;

        // --- Core D* Lite Data Structures ---
        // Store g, rhs values. Key: "x,y" string. Value: { g: number, rhs: number }
        this.cellData = new Map();
        // Optimized Priority queue (U) storing node keys ("x,y") to be expanded
        this.openList = new PriorityQueue();
        // Key modifier for dynamic updates
        this.km = 0;

        // --- Start and Goal ---
        // Store start/goal as objects {x, y} but use their keys ("x,y") for lookups/storage
        this.start = null;
        this.goal = null;
        this.lastStart = null;

        // --- Obstacles ---
        // Set of obstacle coordinates (Key: "x,y" string)
        this.obstacles = new Set();
        // Store costs of edges that have changed (for dynamic updates)
        // Key: "x1,y1_x2,y2", Value: new_cost
        this.updatedEdgeCosts = new Map();

        // --- Heuristic ---
        // Using Manhattan distance for grid environments
        this.heuristic = (a, b) => {
            // Input can be node object {x,y} or string key "x,y"
            const nodeA = (typeof a === 'string') ? this.parseKey(a) : a;
            const nodeB = (typeof b === 'string') ? this.parseKey(b) : b;
            if (!nodeA || !nodeB) return Infinity; // Should not happen in normal operation
            return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
        };

        // --- Cost Function ---
        // Cost between adjacent cells (can be dynamic)
        this.cost = (nodeA, nodeB) => {
            // Ensure nodes are objects for key generation and obstacle check
            const objA = (typeof nodeA === 'string') ? this.parseKey(nodeA) : nodeA;
            const objB = (typeof nodeB === 'string') ? this.parseKey(nodeB) : nodeB;
            if (!objA || !objB) return Infinity; // Invalid node input

            const keyA = this.getKey(objA);
            const keyB = this.getKey(objB);

            const edgeKey = `${keyA}_${keyB}`;
            const reverseEdgeKey = `${keyB}_${keyA}`;

            // Check if this specific edge has an updated cost
            if (this.updatedEdgeCosts.has(edgeKey)) {
                return this.updatedEdgeCosts.get(edgeKey);
            }
            if (this.updatedEdgeCosts.has(reverseEdgeKey)) {
                return this.updatedEdgeCosts.get(reverseEdgeKey);
            }

            // Check if either node is an obstacle
            if (this.isObstacle(keyA) || this.isObstacle(keyB)) {
                return Infinity; // Moving into or out of an obstacle has infinite cost
            }
            // Basic cost for adjacent non-obstacle cells (can be adjusted e.g., for diagonals)
            const dx = objA.x - objB.x;
            const dy = objA.y - objB.y;
            if (dx !== 0 && dy !== 0) return Math.sqrt(2);
            else return 1;
        };
    }

    // --- Node Key and Data Management ---
    getKey(node) { // Input: {x, y} object
        return `${node.x},${node.y}`;
    }

    parseKey(key) { // Input: "x,y" string
        const parts = key.split(',');
        if (parts.length !== 2) return null; // Invalid key
        return { x: parseInt(parts[0], 10), y: parseInt(parts[1], 10) };
    }

    // Get/Set g and rhs using string keys
    getNodeData(key) {
        if (!this.cellData.has(key)) {
            // Lazy initialization: Default g and rhs to Infinity
            this.cellData.set(key, { g: Infinity, rhs: Infinity });
        }
        return this.cellData.get(key);
    }

    getG(key) {
        return this.getNodeData(key).g;
    }

    getRHS(key) {
        return this.getNodeData(key).rhs;
    }

    setG(key, value) {
        this.getNodeData(key).g = value;
    }

    setRHS(key, value) {
        this.getNodeData(key).rhs = value;
    }

    // --- Obstacle Management (using string keys) ---
    addObstacle(x, y) {
        this.obstacles.add(`${x},${y}`);
    }

    removeObstacle(x, y) {
        this.obstacles.delete(`${x},${y}`);
    }

    isObstacle(key) { // Input: "x,y" string key
        return this.obstacles.has(key);
    }

    // --- Initialization ---
    initialize(start, goal) { // Input: {x, y} objects
        this.openList = new PriorityQueue();
        this.cellData = new Map(); // Clear previous data
        this.km = 0;

        this.start = start;
        this.goal = goal;
        this.lastStart = start; // Initialize lastStart

        const goalKey = this.getKey(this.goal);

        // Initialize goal node
        this.setRHS(goalKey, 0);
        // g(goal) is initially infinity (handled by getNodeData default)

        // Add goal key to the open list
        this.openList.push(goalKey, this.calculateKey(goalKey));
    }

    // --- Core D* Lite Functions ---

    // Calculate the key (priority) for a node (using string key)
    calculateKey(key) {
        const g = this.getG(key);
        const rhs = this.getRHS(key);
        const minVal = Math.min(g, rhs);
        // Key: [k1, k2]
        // k1 = min(g, rhs) + h(start, node) + km
        // k2 = min(g, rhs)
        // Heuristic needs the start object and the node object (parsed from key)
        const h = this.heuristic(this.start, key); // heuristic handles parsing key
        return [minVal + h + this.km, minVal];
    }

    // Update the rhs value of a node (using string key) and manage open list
    updateVertex(key) {
        const goalKey = this.getKey(this.goal);

        // Don't update the goal node's rhs based on neighbors
        if (key !== goalKey) {
            let minRhs = Infinity;
            const node = this.parseKey(key); // Need object for getNeighbors
            if (!node) return; // Invalid key

            const neighbors = this.getNeighbors(node); // Returns neighbor objects {x,y}
            for (const successorObj of neighbors) {
                const successorKey = this.getKey(successorObj);
                // Cost function needs objects or keys, ensure consistency
                const costVal = this.cost(key, successorKey); // Pass keys to cost function
                if (costVal === Infinity) continue; // Skip impassable successors
                minRhs = Math.min(minRhs, costVal + this.getG(successorKey));
            }
            this.setRHS(key, minRhs);
        }

        // Remove node key from open list if it's already there (O(log n) now)
        if (this.openList.includes(key)) {
            this.openList.remove(key);
        }

        // If node is locally inconsistent (g != rhs), add its key to the open list
        if (this.getG(key) !== this.getRHS(key)) {
            // Check if it's an obstacle before adding
            if (!this.isObstacle(key)) {
                this.openList.push(key, this.calculateKey(key));
            }
        }
    }

    // Compute the shortest path from start to goal
    computeShortestPath() {
        if (!this.start || !this.goal) {
            console.error("Start or Goal not set!");
            return false; // Indicate failure
        }

        const startKey = this.getKey(this.start);
        const goalKey = this.getKey(this.goal);
        let iterations = 0; // Safety counter
        const maxIterations = this.gridWidth * this.gridHeight * 5; // Heuristic limit

        // Continue while the start node is inconsistent or the top key is less than start's key
        while (
            !this.openList.isEmpty() &&
            (this.openList.compare(this.openList.peek().priority, this.calculateKey(startKey)) < 0 ||
             this.getRHS(startKey) !== this.getG(startKey))
        ) {
            // Safety Break
            if (++iterations > maxIterations) {
                console.warn(`Max iterations (${maxIterations}) reached in computeShortestPath. Aborting.`);
                return false; // Indicate potential issue or unreachable goal
            }

            const topItem = this.openList.peek(); // { element: key, priority: [...] }
            if (!topItem) break; // Should not happen if !isEmpty, but safety check

            const k_old = topItem.priority;
            const uKey = topItem.element; // The node key to process
            const k_new = this.calculateKey(uKey);

            // Condition 1: Node needs update (key increased) -> Update priority in PQ
            if (this.openList.compare(k_old, k_new) < 0) {
                this.openList.update(uKey, k_new); // O(log n)
            }
            // Condition 2: Node is locally consistent (g > rhs) -> Make it overconsistent
            else if (this.getG(uKey) > this.getRHS(uKey)) {
                this.setG(uKey, this.getRHS(uKey));
                this.openList.pop(); // Remove uKey from queue (O(log n))

                // Update predecessors (neighbors)
                const uNode = this.parseKey(uKey);
                if (!uNode) continue; // Should not happen
                const predecessors = this.getNeighbors(uNode); // Neighbors are predecessors in grid
                for (const predObj of predecessors) {
                    const predKey = this.getKey(predObj);
                    if (!this.isObstacle(predKey) && predKey !== goalKey) { // Don't update goal's RHS this way
                        this.updateVertex(predKey); // Update non-obstacle predecessors
                    }
                }
            }
            // Condition 3: Node is locally inconsistent (g < rhs) -> Make it consistent or overconsistent
            else {
                // const g_old = this.getG(uKey); // g_old not strictly needed here
                this.setG(uKey, Infinity); // Make g infinite temporarily

                // Update u itself first (if not an obstacle)
                if (!this.isObstacle(uKey)) {
                    this.updateVertex(uKey);
                }

                // Update predecessors (neighbors)
                const uNode = this.parseKey(uKey);
                if (!uNode) continue; // Should not happen
                const predecessors = this.getNeighbors(uNode);
                for (const predObj of predecessors) {
                    const predKey = this.getKey(predObj);
                    if (!this.isObstacle(predKey) && predKey !== goalKey) { // Don't update goal's RHS this way
                        this.updateVertex(predKey);
                    }
                }
            }
        }
        // Check if a path was found (start node is consistent and reachable)
        return this.getRHS(startKey) !== Infinity && this.getG(startKey) !== Infinity;
    }

    // --- Path Reconstruction ---
    getPath() {
        const startKey = this.getKey(this.start);
        const goalKey = this.getKey(this.goal);

        if (!this.start || !this.goal || this.getG(startKey) === Infinity) {
            console.log("No path found or algorithm not run/finished.");
            return []; // No path
        }

        const path = [this.start]; // Store path as node objects {x, y}
        let currentKey = startKey;
        let safetyCounter = 0;
        const maxPathLength = this.gridWidth * this.gridHeight;

        while (currentKey !== goalKey) {
            if (++safetyCounter > maxPathLength) {
                console.error("Path reconstruction exceeded max length. Possible loop or issue.");
                return []; // Abort
            }

            let bestNextNode = null; // Store as object {x, y}
            let minCost = Infinity;
            const currentNode = this.parseKey(currentKey);
            if (!currentNode) return []; // Error

            const neighbors = this.getNeighbors(currentNode); // Get neighbor objects
            for (const neighborObj of neighbors) {
                const neighborKey = this.getKey(neighborObj);
                if (this.isObstacle(neighborKey)) continue; // Skip obstacles

                // Cost function expects keys or objects, ensure consistency
                const costVal = this.cost(currentKey, neighborKey);
                if (costVal === Infinity) continue; // Skip impassable edges

                const costToGo = costVal + this.getG(neighborKey);

                // Tie-breaking: Prefer lower heuristic, then lower coordinates if needed (optional)
                if (costToGo < minCost) {
                    minCost = costToGo;
                    bestNextNode = neighborObj;
                } else if (costToGo === minCost && bestNextNode) {
                    // Optional tie-breaking (e.g., prefer lower heuristic to goal)
                    const hCurrentBest = this.heuristic(bestNextNode, this.goal);
                    const hNeighbor = this.heuristic(neighborObj, this.goal);
                    if (hNeighbor < hCurrentBest) {
                        bestNextNode = neighborObj;
                    }
                    // Further tie-breaking (e.g., x, then y) if heuristics are equal
                    else if (hNeighbor === hCurrentBest) {
                        if (neighborObj.x < bestNextNode.x || (neighborObj.x === bestNextNode.x && neighborObj.y < bestNextNode.y)) {
                            bestNextNode = neighborObj;
                        }
                    }
                }
            }

            if (bestNextNode === null || minCost === Infinity) {
                console.warn("Path reconstruction failed - stuck at", currentKey, " No valid non-obstacle neighbor found.");
                return path; // Return partial path up to blockage
            }

            path.push(bestNextNode);
            currentKey = this.getKey(bestNextNode);
        }
        return path; // Return array of {x, y} objects
    }

    // --- Handling Dynamic Changes ---

    // Update the cost of moving between two adjacent nodes (input: {x,y} objects)
    updateEdgeCost(nodeA, nodeB, newCost) {
        const keyA = this.getKey(nodeA);
        const keyB = this.getKey(nodeB);
        const edgeKey = `${keyA}_${keyB}`;
        this.updatedEdgeCosts.set(edgeKey, newCost);

        // Update the vertex *from* which the edge originates, as its RHS depends on cost(A, B) + g(B)
        // If the edge cost changes, recalculate RHS for node A.
        // Also update B, as its RHS might depend on cost(B, A) + g(A) if the graph is undirected or cost changes symmetrically.
        // For simplicity and safety in potentially changing environments, update both.
        this.updateVertex(keyA);
        this.updateVertex(keyB);

        // Recompute the shortest path *after* all batch updates are done.
        // this.computeShortestPath();
    }

    // Add or remove an obstacle dynamically (input: x, y coordinates)
    updateObstacle(x, y, isObstacle) {
        const nodeKey = `${x},${y}`;
        const currentlyIsObstacle = this.obstacles.has(nodeKey);

        if (isObstacle && !currentlyIsObstacle) {
            // --- Adding an obstacle ---
            this.obstacles.add(nodeKey);

            // Make g and rhs infinite for the obstacle node itself
            // Note: g/rhs might already be Inf if unreachable, but set explicitly for clarity.
            // const oldG = this.getG(nodeKey); // Store old G if needed, but D* Lite logic handles this implicitly
            this.setG(nodeKey, Infinity);
            this.setRHS(nodeKey, Infinity);

            // If the node was in the open list, remove it (O(log n))
            if (this.openList.includes(nodeKey)) {
                this.openList.remove(nodeKey);
            }

            // Update neighbors (now predecessors of the obstacle)
            // Their RHS might increase because the path through the obstacle is gone
            const node = this.parseKey(nodeKey);
            if (!node) return; // Should not happen
            const neighbors = this.getNeighbors(node);
            for (const neighborObj of neighbors) {
                const neighborKey = this.getKey(neighborObj);
                if (!this.isObstacle(neighborKey)) { // Don't update other obstacles
                    // updateVertex handles the recalculation needed if RHS depended on the now-obstacle node
                    this.updateVertex(neighborKey);
                }
            }
            // No need to explicitly update the obstacle node itself via updateVertex,
            // as it's marked as an obstacle and won't be added to openList or used in paths.

        } else if (!isObstacle && currentlyIsObstacle) {
            // --- Removing an obstacle ---
            this.obstacles.delete(nodeKey);

            // We need to potentially recalculate the RHS for the now-clear node
            // based on its neighbors, and update its neighbors as they might now
            // have a better path through the cleared node.
            // Update the cleared node first.
            this.updateVertex(nodeKey);

            // Update neighbors
            const node = this.parseKey(nodeKey);
            if (!node) return; // Should not happen
            const neighbors = this.getNeighbors(node);
            for (const neighborObj of neighbors) {
                const neighborKey = this.getKey(neighborObj);
                if (!this.isObstacle(neighborKey)) {
                    this.updateVertex(neighborKey);
                }
            }
        }
        // If state didn't change, do nothing
        // Remember to call computeShortestPath() after a batch of updates.
    }


    // Handle changes when the start position moves (input: new {x,y} object)
    handleStartMoved(newStart) {
        const oldStartKey = this.getKey(this.start);
        const newStartKey = this.getKey(newStart);

        this.lastStart = this.start; // Store the previous start object
        this.start = newStart;

        // Update the key modifier based on the heuristic change between old and new start, relative to the goal.
        // This compensates for the change in h(s, u) for all nodes u in the priority queue keys.
        // km = km + h(last, goal) - h(new, goal) -- though the original paper uses h(last, s_new)
        // Let's stick to the common implementation using h relative to goal:
        this.km += this.heuristic(this.lastStart, this.goal);

        // It's crucial that calculateKey uses the *current* this.start
        // and the current this.km. The priority queue doesn't need explicit updates
        // for all nodes just because km changed; the comparison logic handles it implicitly
        // when calculateKey is called during computeShortestPath.

        // No need to re-initialize g/rhs values.

        // Trigger computeShortestPath to find the path from the new start.
        // this.computeShortestPath();
    }


    // --- Utility Functions ---

    // Get valid neighbors of a node (input: {x,y} object, output: array of {x,y} objects)
    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            // Add diagonals if needed (remember to adjust cost function if diagonal cost != 1):
            { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
            { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
        ];

        for (const dir of directions) {
            const nextX = node.x + dir.dx;
            const nextY = node.y + dir.dy;

            // Check grid boundaries
            if (nextX >= 0 && nextX < this.gridWidth && nextY >= 0 && nextY < this.gridHeight) {
                // We don't check for obstacles here; cost function or caller handles that.
                neighbors.push({ x: nextX, y: nextY });
            }
        }
        return neighbors;
    }
}


// @WasmModule
let PacketIds_1 = {
    default: {
        0: "PACKET_ENTITY_UPDATE",
        1: "PACKET_PLAYER_COUNTER_UPDATE",
        2: "PACKET_SET_WORLD_DIMENSIONS",
        3: "PACKET_INPUT",
        4: "PACKET_ENTER_WORLD",
        5: "PACKET_PRE_ENTER_WORLD",
        6: "PACKET_ENTER_WORLD2",
        7: "PACKET_PING",
        9: "PACKET_RPC",
        10: "PACKET_BLEND",
        PACKET_PRE_ENTER_WORLD: 5,
        PACKET_ENTER_WORLD: 4,
        PACKET_ENTER_WORLD2: 6,
        PACKET_ENTITY_UPDATE: 0,
        PACKET_INPUT: 3,
        PACKET_PING: 7,
        PACKET_PLAYER_COUNTER_UPDATE: 1,
        PACKET_RPC: 9,
        PACKET_SET_WORLD_DIMENSIONS: 2,
        PACKET_BLEND: 10,
    },
},
    e_AttributeType = {
        0: "Uninitialized",
        1: "Uint32",
        2: "Int32",
        3: "Float",
        4: "String",
        5: "Vector2",
        6: "EntityType",
        7: "ArrayVector2",
        8: "ArrayUint32",
        9: "Uint16",
        10: "Uint8",
        11: "Int16",
        12: "Int8",
        13: "Uint64",
        14: "Int64",
        15: "Double",
        Uninitialized: 0,
        Uint32: 1,
        Int32: 2,
        Float: 3,
        String: 4,
        Vector2: 5,
        EntityType: 6,
        ArrayVector2: 7,
        ArrayUint32: 8,
        Uint16: 9,
        Uint8: 10,
        Int16: 11,
        Int8: 12,
        Uint64: 13,
        Int64: 14,
        Double: 15,
    },
    e_ParameterType = { 0: "Uint32", 1: "Int32", 2: "Float", 3: "String", 4: "Uint64", 5: "Int64", Uint32: 0, Int32: 1, Float: 2, String: 3, Uint64: 4, Int64: 5 };
class BinCodec {
    constructor() {
        (this.attributeMaps = {}), (this.entityTypeNames = {}), (this.rpcMaps = []), (this.rpcMapsByName = {}), (this.sortedUidsByType = {}), (this.removedEntities = {}), (this.absentEntitiesFlags = []), (this.updatedEntityFlags = []);
    }
    encode(e, t, a) {
        let r = new dcodeIO.ByteBuffer(100, !0);
        switch (e) {
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                r.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD), this.encodeEnterWorld(r, t);
                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD2:
                r.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD2), this.encodeEnterWorld2(r, a);
                break;
            case PacketIds_1.default.PACKET_INPUT:
                r.writeUint8(PacketIds_1.default.PACKET_INPUT), this.encodeInput(r, t);
                break;
            case PacketIds_1.default.PACKET_PING:
                r.writeUint8(PacketIds_1.default.PACKET_PING), this.encodePing(r, t);
                break;
            case PacketIds_1.default.PACKET_RPC:
                r.writeUint8(PacketIds_1.default.PACKET_RPC), this.encodeRpc(r, t);
                break;
            case PacketIds_1.default.PACKET_BLEND:
                r.writeUint8(PacketIds_1.default.PACKET_BLEND), this.encodeBlend(r, t);
        }
        return r.flip(), r.compact(), r.toArrayBuffer(!1);
    }
    decode(e, t) {
        let a = dcodeIO.ByteBuffer.wrap(e);
        a.littleEndian = !0;
        let r = a.readUint8(),
            n;
        switch (r) {
            case PacketIds_1.default.PACKET_PRE_ENTER_WORLD:
                n = this.decodePreEnterWorldResponse(a, t);
                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                n = this.decodeEnterWorldResponse(a);
                break;
            case PacketIds_1.default.PACKET_ENTITY_UPDATE:
                n = this.decodeEntityUpdate(a);
                break;
            case PacketIds_1.default.PACKET_PING:
                n = this.decodePing(a);
                break;
            case PacketIds_1.default.PACKET_RPC:
                n = this.decodeRpc(a);
                break;
            case PacketIds_1.default.PACKET_BLEND:
                n = this.decodeBlend(a, t);
        }
        return (n.opcode = r), n;
    }
    safeReadVString(e) {
        let t = e.offset,
            a = e.readVarint32(t);
        try {
            var r = e.readUTF8String.bind(e)(a.value, "b", (t += a.length));
            return (t += r.length), (e.offset = t), r.string;
        } catch (n) {
            return (t += a.value), (e.offset = t), "?";
        }
    }
    decodePreEnterWorldResponse(e, t) {
        return t._MakeBlendField(255, 140), { extra: this.decodeBlendInternal(e, t) };
    }
    decodeEnterWorldResponse(e) {
        let t = {
            allowed: e.readUint32(),
            uid: e.readUint32(),
            startingTick: e.readUint32(),
            tickRate: e.readUint32(),
            effectiveTickRate: e.readUint32(),
            players: e.readUint32(),
            maxPlayers: e.readUint32(),
            chatChannel: e.readUint32(),
            effectiveDisplayName: this.safeReadVString(e),
            x1: e.readInt32(),
            y1: e.readInt32(),
            x2: e.readInt32(),
            y2: e.readInt32(),
        },
            a = e.readUint32();
        (this.attributeMaps = {}), (this.entityTypeNames = {});
        for (let r = 0; r < a; r++) {
            let n = [],
                i = e.readUint32(),
                s = e.readVString(),
                d = e.readUint32();
            for (let o = 0; o < d; o++) {
                let c = e.readVString(),
                    l = e.readUint32();
                n.push({ name: c, type: l });
            }
            (this.attributeMaps[i] = n), (this.entityTypeNames[i] = s), (this.sortedUidsByType[i] = []);
        }
        let p = e.readUint32();
        (this.rpcMaps = []), (this.rpcMapsByName = {});
        for (let h = 0; h < p; h++) {
            let f = e.readVString(),
                U = e.readUint8(),
                u = 0 != e.readUint8(),
                y = [];
            for (let E = 0; E < U; E++) {
                let $ = e.readVString(),
                    m = e.readUint8();
                y.push({ name: $, type: m });
            }
            let b = { name: f, parameters: y, isArray: u, index: this.rpcMaps.length };
            this.rpcMaps.push(b), (this.rpcMapsByName[f] = b);
        }
        return t;
    }
    decodeEntityUpdate(e) {
        var t = e.readUint32(),
            a = e.readVarint32(),
            r = {};
        for (var n in ((r.tick = t), (r.entities = {}), this.removedEntities)) delete this.removedEntities[n];
        for (var i = 0; i < a; i++) {
            var n = e.readUint32();
            this.removedEntities[n] = 1;
        }
        for (var s = e.readVarint32(), i = 0; i < s; i++) {
            var d = e.readVarint32(),
                o = e.readUint32();
            this.entityTypeNames[o];
            for (var c = 0; c < d; c++) {
                var l = e.readUint32();
                this.sortedUidsByType[o].push(l);
            }
        }
        for (var i in this.sortedUidsByType) {
            for (var p = this.sortedUidsByType[i], h = [], c = 0; c < p.length; c++) {
                var n = p[c];
                n in this.removedEntities || h.push(n);
            }
            h.sort(function (e, t) {
                return e < t ? -1 : e > t ? 1 : 0;
            }),
                (this.sortedUidsByType[i] = h);
        }
        for (; e.remaining(); ) {
            var f = e.readUint32();
            if ((this.entityTypeNames[f], !(f in this.attributeMaps))) throw Error("Entity type is not in attribute map: " + f);
            var U = Math.floor((this.sortedUidsByType[f].length + 7) / 8);
            this.absentEntitiesFlags.length = 0;
            for (var i = 0; i < U; i++) this.absentEntitiesFlags.push(e.readUint8());
            for (var u = this.attributeMaps[f], y = 0; y < this.sortedUidsByType[f].length; y++) {
                var n = this.sortedUidsByType[f][y];
                if ((this.absentEntitiesFlags[Math.floor(y / 8)] & (1 << y % 8)) != 0) {
                    r.entities[n] = !0;
                    continue;
                }
                var E = { uid: n };
                this.updatedEntityFlags.length = 0;
                for (var c = 0; c < Math.ceil(u.length / 8); c++) this.updatedEntityFlags.push(e.readUint8());
                for (var c = 0; c < u.length; c++) {
                    var $ = u[c],
                        m = Math.floor(c / 8),
                        b = c % 8,
                        v = void 0,
                        g = [];
                    if (this.updatedEntityFlags[m] & (1 << b))
                        switch ($.type) {
                            case e_AttributeType.Uint32:
                                E[$.name] = e.readUint32();
                                break;
                            case e_AttributeType.Int32:
                                E[$.name] = e.readInt32();
                                break;
                            case e_AttributeType.Float:
                                E[$.name] = e.readInt32() / 100;
                                break;
                            case e_AttributeType.String:
                                E[$.name] = this.safeReadVString(e);
                                break;
                            case e_AttributeType.Vector2:
                                var T = e.readInt32() / 100,
                                    k = e.readInt32() / 100;
                                E[$.name] = { x: T, y: k };
                                break;
                            case e_AttributeType.ArrayVector2:
                                (v = e.readInt32()), (g = []);
                                for (var i = 0; i < v; i++) {
                                    var P = e.readInt32() / 100,
                                        I = e.readInt32() / 100;
                                    g.push({ x: P, y: I });
                                }
                                E[$.name] = g;
                                break;
                            case e_AttributeType.ArrayUint32:
                                (v = e.readInt32()), (g = []);
                                for (var i = 0; i < v; i++) {
                                    var B = e.readInt32();
                                    g.push(B);
                                }
                                E[$.name] = g;
                                break;
                            case e_AttributeType.Uint16:
                                E[$.name] = e.readUint16();
                                break;
                            case e_AttributeType.Uint8:
                                E[$.name] = e.readUint8();
                                break;
                            case e_AttributeType.Int16:
                                E[$.name] = e.readInt16();
                                break;
                            case e_AttributeType.Int8:
                                E[$.name] = e.readInt8();
                                break;
                            case e_AttributeType.Uint64:
                                E[$.name] = e.readUint32() + 4294967296 * e.readUint32();
                                break;
                            case e_AttributeType.Int64:
                                var R = e.readUint32(),
                                    w = e.readInt32();
                                w < 0 && (R *= -1), (R += 4294967296 * w), (E[$.name] = R);
                                break;
                            case e_AttributeType.Double:
                                var _ = e.readUint32(),
                                    A = e.readInt32();
                                A < 0 && (_ *= -1), (_ += 4294967296 * A), (_ /= 100), (E[$.name] = _);
                                break;
                            default:
                                throw Error("Unsupported attribute type: " + $.type);
                        }
                }
                r.entities[E.uid] = E;
            }
        }
        return (r.byteSize = e.capacity()), r;
    }
    decodePing() {
        return {};
    }
    encodeRpc(e, t) {
        if (!(t.name in this.rpcMapsByName)) throw Error("RPC not in map: " + t.name);
        var a = this.rpcMapsByName[t.name];
        e.writeUint32(a.index);
        for (var r = 0; r < a.parameters.length; r++) {
            var n = t[a.parameters[r].name];
            switch (a.parameters[r].type) {
                case e_ParameterType.Float:
                    e.writeInt32(Math.floor(100 * n));
                    break;
                case e_ParameterType.Int32:
                    e.writeInt32(n);
                    break;
                case e_ParameterType.String:
                    e.writeVString(n);
                    break;
                case e_ParameterType.Uint32:
                    e.writeUint32(n);
            }
        }
    }
    decodeBlend(e, t) {
        return { extra: this.decodeBlendInternal(e, t) };
    }
    decodeBlendInternal(e, t) {
        t._MakeBlendField(24, 132);
        for (let a = t._MakeBlendField(228, e.remaining()), r = 0; e.remaining(); ) (t.HEAPU8[a + r] = e.readUint8()), r++;
        t._MakeBlendField(172, 36);
        for (var n = new ArrayBuffer(64), i = new Uint8Array(n), s = t._MakeBlendField(4, 152), d = 0; d < 64; d++) i[d] = t.HEAPU8[s + d];
        return n;
    }
    decodeRpcObject(e, t) {
        for (var a = {}, r = 0; r < t.length; r++)
            switch (t[r].type) {
                case e_ParameterType.Uint32:
                    a[t[r].name] = e.readUint32();
                    break;
                case e_ParameterType.Int32:
                    a[t[r].name] = e.readInt32();
                    break;
                case e_ParameterType.Float:
                    a[t[r].name] = e.readInt32() / 100;
                    break;
                case e_ParameterType.String:
                    a[t[r].name] = this.safeReadVString(e);
                    break;
                case e_ParameterType.Uint64:
                    a[t[r].name] = e.readUint32() + 4294967296 * e.readUint32();
            }
        return a;
    }
    decodeRpc(e) {
        var t = e.readUint32(),
            a = this.rpcMaps[t],
            r = { name: a.name, response: null };
        if (a.isArray) {
            for (var n = [], i = e.readUint16(), s = 0; s < i; s++) n.push(this.decodeRpcObject(e, a.parameters));
            r.response = n;
        } else r.response = this.decodeRpcObject(e, a.parameters);
        return r;
    }
    encodeBlend(e, t) {
        for (var a = new Uint8Array(t.extra), r = 0; r < t.extra.byteLength; r++) e.writeUint8(a[r]);
    }
    encodeEnterWorld(e, t) {
        e.writeVString(t.displayName);
        for (var a = new Uint8Array(t.extra), r = 0; r < t.extra.byteLength; r++) e.writeUint8(a[r]);
    }
    encodeEnterWorld2(e, t) {
        for (var a = t._MakeBlendField(187, 22), r = 0; r < 16; r++) e.writeUint8(t.HEAPU8[a + r]);
    }
    encodeInput(e, t) {
        e.writeVString(JSON.stringify(t));
    }
    encodePing(e) {
        e.writeUint8(0);
    }
}
let codec = new BinCodec(),
    wasmBuffers;
fetch("/asset/zombs_wasm.wasm").then((e) =>
                                     e.arrayBuffer().then((e) => {
    wasmBuffers = e;
})
                                    );
const wasmModule = (callback, data_12, hostname) => {
    function _a(e, t, r) {
        for (var a = t + r, n = t; e[n] && !(n >= a); ) ++n;
        if (n - t > 16 && e.subarray && _n) return _n.decode(e.subarray(t, n));
        for (var i = ""; t < n; ) {
            let d = e[t++];
            if (128 & d) {
                var s = 63 & e[t++];
                if (192 != (224 & d)) {
                    var l = 63 & e[t++];
                    if ((d = 224 == (240 & d) ? ((15 & d) << 12) | (s << 6) | l : ((7 & d) << 18) | (s << 12) | (l << 6) | (63 & e[t++])) < 65536) i += String.fromCharCode(d);
                    else {
                        var c = d - 65536;
                        i += String.fromCharCode(55296 | (c >> 10), 56320 | (1023 & c));
                    }
                } else i += String.fromCharCode(((31 & d) << 6) | s);
            } else i += String.fromCharCode(d);
        }
        return i;
    }
    function _b(e, t) {
        return e ? _a(_k, e, t) : "";
    }
    function _c(e, t, r, a) {
        if (!(a > 0)) return 0;
        for (var n = r, i = r + a - 1, d = 0; d < e.length; ++d) {
            var s = e.charCodeAt(d);
            if ((s >= 55296 && s <= 57343 && (s = (65536 + ((1023 & s) << 10)) | (1023 & e.charCodeAt(++d))), s <= 127)) {
                if (r >= i) break;
                t[r++] = s;
            } else if (s <= 2047) {
                if (r + 1 >= i) break;
                (t[r++] = 192 | (s >> 6)), (t[r++] = 128 | (63 & s));
            } else if (s <= 65535) {
                if (r + 2 >= i) break;
                (t[r++] = 224 | (s >> 12)), (t[r++] = 128 | ((s >> 6) & 63)), (t[r++] = 128 | (63 & s));
            } else {
                if (r + 3 >= i) break;
                (t[r++] = 240 | (s >> 18)), (t[r++] = 128 | ((s >> 12) & 63)), (t[r++] = 128 | ((s >> 6) & 63)), (t[r++] = 128 | (63 & s));
            }
        }
        return (t[r] = 0), r - n;
    }
    function _d(e, t, r) {
        return _c(e, _k, t, r);
    }
    function _e(e) {
        for (var t = 0, r = 0; r < e.length; ++r) {
            var a = e.charCodeAt(r);
            a >= 55296 && a <= 57343 && (a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++r))), a <= 127 ? ++t : (t += a <= 2047 ? 2 : a <= 65535 ? 3 : 4);
        }
        return t;
    }
    function _f(e) {
        (_m.HEAP8 = new Int8Array(e)),
            (_m.HEAP16 = new Int16Array(e)),
            (_m.HEAP32 = _l = new Int32Array(e)),
            (_m.HEAPU8 = _k = new Uint8Array(e)),
            (_m.HEAPU16 = new Uint16Array(e)),
            (_m.HEAPU32 = new Uint32Array(e)),
            (_m.HEAPF32 = new Float32Array(e)),
            (_m.HEAPF64 = new Float64Array(e));
    }
    function _g() {
        function e(e) {
            (_m.asm = e.exports), _f(_m.asm.g.buffer), _o(), _j();
        }
        function t(t) {
            e(t.instance);
        }
        function r(e) {
            WebAssembly.instantiate(wasmBuffers, a).then((t) => {
                e(t), "function" == typeof callback && callback(_m.decodeOpcode5(hostname, data_12));
            });
        }
        var a = { a: { d() {}, e() {}, c: _h, f() {}, b: _i, a() {}, } };
        if (_m.instantiateWasm)
            try {
                return _m.instantiateWasm(a, e);
            } catch (n) {
                return console.log("Module.instantiateWasm callback failed with error: " + n), !1;
            }
        return r(t), {};
    }
    function _h(_hh) {
        let e = _b(_hh);
        if (e.includes('typeof window === "undefined" ? 1 : 0;') || e.includes("typeof process !== 'undefined' ? 1 : 0;")) return 0;
        if (e.includes("Game.currentGame.network.connected ? 1 : 0")) return 1;
        if (e.includes("Game.currentGame.world.myUid === null ? 0 : Game.currentGame.world.myUid;")) return 0;
        if (e.includes('document.getElementById("hud").children.length;')) return 24;
        if (e.includes("hostname")) return hostname;
        let data;
        return 0 | eval(_b(_hh));
    }
    function _i(e) {
        var t = hostname;
        if (null == t) return 0;
        t = String(t);
        var r = _i,
            a = _e(t);
        return (!r.bufferSize || r.bufferSize < a + 1) && (r.bufferSize && _s(r.buffer), (r.bufferSize = a + 1), (r.buffer = _r(r.bufferSize))), _d(t, r.buffer, r.bufferSize), r.buffer;
    }
    function _j() {
        (_l[1328256] = 5313008), (_l[1328257] = 0), _m._main(1, 5313024);
    }
    var _k,
        _l,
        _m = {},
        _n = new TextDecoder("utf8");
    _g();
    var _o = (_m.___wasm_call_ctors = function () {
        return (_o = _m.___wasm_call_ctors = _m.asm.h).apply(null, arguments);
    }),
        _p = (_m._main = function () {
            return (_p = _m._main = _m.asm.i).apply(null, arguments);
        }),
        _q = (_m._MakeBlendField = function () {
            return (_q = _m._MakeBlendField = _m.asm.j).apply(null, arguments);
        }),
        _r = (_m._malloc = function () {
            return (_r = _m._malloc = _m.asm.l).apply(null, arguments);
        }),
        _s = (_m._free = function () {
            return (_s = _m._free = _m.asm.m).apply(null, arguments);
        });
    return (
        (_m.decodeOpcode5 = function (e, t) {
            _m.hostname = e;
            let r = codec.decode(new Uint8Array(t), _m),
                a = codec.encode(6, {}, _m);
            return { 5: r, 6: a, 10: _m };
        }),
        _m
    );
};

// @FontAwesome
const fontAwesome = document.createElement("script");
fontAwesome.type = "text/javascript";
fontAwesome.src = "https://kit.fontawesome.com/1c239b2e80.js";
document.head.appendChild(fontAwesome);

document.querySelectorAll('#hud-respawn > div > div > div > h2, #hud-respawn > div > div > div > p, #hud-respawn > div > div > div > div, .ad-unit, #hud-intro > div.hud-intro-footer > a:nth-child(2), #hud-intro > div.hud-intro-footer > a:nth-child(4), #hud-intro > div.hud-intro-wrapper > h1, #hud-intro > div.hud-intro-wrapper > h2, .hud-intro-left, .hud-intro-guide, .hud-intro > .hud-intro-stone, .hud-intro >.hud-intro-tree, .hud-intro-youtuber, .hud-intro-more-games, .hud-intro-social, .hud-respawn-corner-bottom-left, .hud-respawn-twitter-btn, .hud-respawn-facebook-btn').forEach(el => el.remove());
const css = `
/* @Root */
:root {
    --normal-btn: rgb(40 152 231);
    --light-hover-btn: rgb(111 208 247);
}

::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/whiteslider.png?v=1714878503407);
}

input[type='range'] {
    accent-color: var(--normal-btn);
}

.btn-theme {
    background: var(--normal-btn);
}
.btn-theme:hover {
    background: var(--light-hover-btn);
}

/* @CustomKeyframes */
@keyframes bounce {
    50%   { transform: translateY(-30px); }
    100%  { transform: translateY(-10px); }
}

.hud-intro::before {
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
}
.hud-intro::after {
    background: unset;
}

#hud-intro > div.hud-intro-corner-top-right > div {
    padding: 10px;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.2);
    z-index: 4;
}

/*
#hud-intro > div.hud-intro-wrapper {
    justify-content: flex-end;
    margin: 40px 0 0;
}
#hud-intro > div.hud-intro-wrapper > div > div {
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.2);
}
#hud-intro > div.hud-intro-wrapper > div > div > input {
    color: white;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
}
#hud-intro > div.hud-intro-wrapper > div > div > select {
    color: white;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
    border: 0px;
    margin: 10px 0;
}
*/

#hud-intro > div.hud-intro-wrapper {
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    margin: 0;
}
#hud-intro > div.hud-intro-wrapper > div {
    height: 100%;
    margin: 0;
}
#hud-intro > div.hud-intro-wrapper > div > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    border-radius: 0px;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.2);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
}
#hud-intro > div.hud-intro-footer {
    left: unset;
    right: 20px;
}

/* @CustomIntroStyles */
#hud-intro-options > input {
    color: white;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
}
#hud-intro-options > select {
    color: white;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
    border: 0px;
    margin: 10px 0;
}
#intro-animation {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 0;
}
#background-canvas {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    filter: blur(2px);
}
#foreground-canvas {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 3;
}

#start-btn {
    position: absolute;
    top: 50%;
    left: 300px;
    height: fit-content;
    width: calc(100% - 300px);
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    transform: translateY(-50%);
    cursor: pointer;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.3), transparent 25%);
}
#start-btn > h1 {
    color: white;
    margin-right: 20px;
    font-size: 60px;
    text-transform: none;
}
#start-btn > hr {
    border: 2px solid white;
    width: 225px;
    margin: 10px 0;
}
#start-btn > h2 {
    margin-right: 20px;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
}

#sesSelect {
    display: none;
    float: left;
    width: 100%;
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 0 10px;
    border: 0;
    font-size: 14px;
    border-radius: 4px;
    color: white;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
}
#sesSelect:disabled {
    opacity: 0.4;
}
#delBtn, #addBtn {
    display: none;
    width: calc(50% - 5px);
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    font-size: 14px;
    border-left: 0;
    border-right: 0;
    border-top: 0;
    border-radius: 4px;
    color: #eee;
    cursor: pointer;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
}

#delBtn {
    margin: 0 5px 10px 0;
    border-bottom: 2px solid red;
}
#addBtn {
    margin: 0 0 10px 5px;
    border-bottom: 2px solid white;
}

#hud-intro-overlay {
    display: none;
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 999;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: all 0.5s;
}
#hud-intro-overlay h2 {
    color: white;
    font-size: 30px;
    text-shadow: 0 0 20px black;
    margin-bottom: 15px;
}
#hud-intro-overlay strong {
    margin: -15px 0 5px;
    color: #aaa;
}
#hud-intro-overlay p {
    color: #eee;
    margin: 10px 0;
    font-weight: bold;
}
#hud-intro-overlay input, #hud-intro-overlay select, #hud-intro-overlay button:not(.session-back):not(#create-session):not(#create-endpoint) {
    width: 100%;
    height: 50px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 0 15px;
    border: 0;
    text-align: start;
    font-size: 15px;
    border-radius: 10px;
    color: white;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(10px);" : ""}
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
}
#hud-intro-overlay button {
    cursor: pointer;
}
#loading-div {
    display: none;
    pointer-events: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
#loading-div > span {
    width: 100px;
    height: 100px;
}
#loading-div > a {
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.4);
    pointer-events: all;
}
#select-session-add, #endpoint-add-menu, #session-add-menu {
    width: 40vw;
    display: none;
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
}
.session-navigator {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
}
.session-navigator button {
    height: 20px;
    background: none;
    border: 0;
    color: #eee;
    font-weight: bold;
    zoom: 130%;
}

/* @CustomUIStyles */
.dragBox {
    position: absolute;
    background-color: rgba(233, 233, 233, 0.3);
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}
.dragBoxMenu {
    background-color: whitesmoke;
    border-radius: 5px;
    color: #111;
    transform: translate(-50%, -50%);
    position: absolute;
    padding: 3px;
    width: auto;
    z-index: 999;
}
.dragBoxMenu > button, .dragBoxMenu > input {
    width: 100%;
    background-color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: default;
    transition: none;
}
.dragBoxMenu > button:hover, .dragBoxMenu > input:focus {
    background-color: grey;
    color: whitesmoke;
}
.dragBoxMenu > input:focus::placeholder {
    color: whitesmoke;
}

#joinWithPsk {
    display: none;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(5px);" : ""}
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    padding: 4px 5px;
    border-radius: 8px;
    color: white;
    width: 30vw;
    height: 40px;
    position: fixed;
    left: 35vw;
    top: 60vh;
}

.interaction-wheel {
    display: none;
    height: 250px;
    width: 250px;
    border: 80px solid rgba(255, 255, 255, 0.1);
    b${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 125px;
    position: fixed;
    top: calc(50vh - 125px);
    left: calc(50vw - 125px);
}
.tag-is-disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: no-drop;
}
#next-wheel {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    color: white;
    right: -120px;
    position: absolute;
    top: -80px;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
}
#next-wheel::after {
    content: '\\f363';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 5%;
    left: 5%;
}
#zoom-mode {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    color: white;
    left: -120px;
    position: absolute;
    bottom: -80px;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    border: none;
    text-align: center;
    padding: 20px 0;
    font-family: 'Hammersmith One';
}
.hud-zoom-item {
    width: 48px;
    height: 48px;
    color: white;
    position: absolute;
    transition: all 0.15s ease-in-out;
}
.zoom-reset {
    top: -60px;
    left: calc(50% - 15px);
}
.zoom-up {
    left: -60px;
    top: calc(50% - 15px);
}
.zoom-down {
    top: calc(50% - 15px);
    right: -80px;
}
.zoom-prop {
    font-size: 20px;
    bottom: -80px;
    left: 25%;
}

#ent-settings {
    flex-direction: column;
    padding: 20px;
    position: absolute;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 180px;
}
#current-side {
    background: none;
    border: none;
    margin-top: 5px;
    color: white;
    width: 100%;
}
#ent-width {
    margin: 5px -1px 10px;
    width: calc(100% - 45px);
}
#ent-width::after {
    content: attr(data-width);
    position: absolute;
    right: 20px;
    color: white;
}
#ent-controls {
    display: flex;
    justify-content: space-between;
    margin: 5px -5px 0;
    zoom: 130%;
}
#ent-controls button {
    color: white;
    background: none;
    border: none;
    cursor: pointer;
}

#hud-debug {
    color: rgb(0, 255, 255);
}
#hud-debug > strong {
    font-family: "HammerSmith One";
    color: red;
    font-weight: 700;
}

.hud-popup-overlay > div.hud-popup-message {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
}
.hud-popup-overlay .hud-popup-confirmation .hud-confirmation-actions .btn.btn-green {
    background: var(--normal-btn);
}

.hud-tooltip {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}
.hud-tooltip-left::after {
    left: calc(100% + 5px);
    border-left: 6px solid rgba(255, 255, 255, 0.2);
}
.hud-tooltip-right::after {
    right: calc(100% + 5px);
    border-right: 6px solid rgba(255, 255, 255, 0.2);
}
.hud-tooltip-top::after {
    top: calc(100% + 5px);
    border-top: 6px solid rgba(255, 255, 255, 0.2);
}
.hud-tooltip-bottom::after {
    bottom: calc(100% + 5px);
    border-bottom: 6px solid rgba(255, 255, 255, 0.2);
}
.hud-building-view, .hud-building-ahrc {
    position: relative;
    display: block;
    padding: 0 10px;
    margin: 0 0 6px;
    font-family: 'Hammersmith One', sans-serif;
    text-shadow: 0 1px 3px rgb(0 0 0 / 20%);
    text-align: left;
}

.hud-chat {
    resize: vertical;
    max-height: 380px;
    min-height: 75px;
    overflow-y: auto;
    border-radius: 4px 4px 4px 0;
}
.hud-chat .hud-chat-message {
    display: block;
    position: relative;
    width: 90%;
    white-space: unset;
    word-break: break-all;
    overflow: visible;
}
.hud-chat .hud-chat-message strong {
    display: inline-block;
}
.hud-chat .hud-chat-message > small {
    position: absolute;
    right: -12%;
    font-weight: bold;
    opacity: 0.4;
}

#hud-spell-icons {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
#hud-spell-icons > div {
    background: none;
}

#hud-menu-icons {
    background: rgba(255, 255, 255, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
#hud-menu-icons > div {
    background: none;
}

#hud > div.hud-bottom-left {
    z-index: 20;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 4px;
}
#hud-map {
    cursor: crosshair;
    pointer-events: all;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
}
#hud-day-night-ticker {
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    margin-top: 0px;
}

#hud-resources {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
}
#hud-health-bar {
    height: 3px;
    padding: 0px;
}
#hud-health-bar::after {
    content: unset;
}
#hud-health-bar > div {
    height: 3px;
}
#hud-shield-bar {
    height: 3px;
    padding: 0px;
    margin: 0px 0px 5px !important;
}
#hud-shield-bar > div {
    height: 3px;
    border-radius: 0px;
}
#hud-party-icons > div {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
}
#hud-party-icons > div.is-empty {
    background: rgba(255, 255, 255, 0.1) !important;
    opacity: 0.4;
}
.hud-buff-bar .hud-buff-bar-item::before {
    content: attr(data-tier);
}
#hud-buff-bar > a {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
}

#hud-toolbar > div.hud-toolbar-buildings > a {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
}
#hud-toolbar > div.hud-toolbar-buildings > a.is-disabled {
    background: rgba(255, 255, 255, 0.1) !important;
}

#hud-respawn {
    background: none;
    z-index: 9999;
    width: 600px;
    height: 200px;
    top: calc(50vh - 100px);
    left: calc(50vw - 300px);
}
#hud-respawn > div {
    margin: 0px;
}
#hud-respawn > div > div > div {
    display: flex;
    width: 500px;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    align-items: flex-end;
    justify-content: space-between;
    padding: 10px 20px 30px;
}

/* @CustomMenuStyles */
#hud-menu-shop {
    top: calc(50vh - 215px);
    left: calc(50vw - 345px);
    width: 690px;
    height: 430px;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.1);
    margin: 0 0 0 0;
    padding: 0px;
    z-index: 20;
    overflow: hidden;
    border-radius: 10px;
}
#hud-menu-shop > h3 {
    margin: 20px;
}
.hud-menu-shop .hud-shop-grid {
    height: 360px;
    border-radius: 0px;
    background: rgba(0, 0, 0, 0.1);
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip {
    background: var(--normal-btn);
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:hover, .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:active {
    background: var(--light-hover-btn);
}
.hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip.is-disabled {
    background: none;
}
.hud-menu-shop .hud-shop-grid .hud-shop-item[data-item=HatComingSoon] .hud-shop-item-coming-soon {
    background: none;
}
#hud-menu-shop > div.hud-shop-tabs > a.hud-shop-tabs-link.is-active {
    background: rgba(0, 0, 0, 0.1);
}
#hud-menu-shop > div.hud-shop-tabs > a.hud-shop-tabs-link:first-child {
    border-radius: 0px;
}

.hud-menu-party .hud-party-members .hud-member-link::before {
    display: block;
    position: absolute;
    content: " ";
    left: 0px;
    bottom: 0px;
    height: 3px;
    width: 30%;
}
.hud-menu-party .hud-party-grid .hud-party-link span:nth-child(4) {
    display: none;
    position: absolute;
    top: 10px;
    right: 15px;
}
#hud-menu-party > div.hud-party-members > div:nth-child(1)::before {
    background: #8473d4;
}
#hud-menu-party > div.hud-party-members > div:nth-child(2)::before {
    background: #d6ab35;
}
#hud-menu-party > div.hud-party-members > div:nth-child(3)::before {
    background: #76bd2f;
}
#hud-menu-party > div.hud-party-members > div:nth-child(4)::before {
    background: #d67820;
}
#hud-menu-party {
    top: calc(50vh - 240px);
    left: calc(50vw - 305px);
    margin: 0;
    width: 610px;
    height: 480px;
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.1);
    z-index: 20;
    border-radius: 10px;

    /* Alternative
    backdrop-filter: blur(5px);
    background: rgba(111, 208, 247, 0.05);
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1);
    z-index: 20;
    */
}
.hud-menu-party .hud-party-grid .hud-party-link.is-active {
    background: var(--normal-btn) !important;
}
.hud-menu-party .hud-party-visibility {
    width: 275.5px;
    margin: 10px 3px 0 0;
    background: var(--normal-btn);
}
.hud-menu-party .hud-party-share {
    width: 395px;
    margin: 0 0 0 5px;
}
.hud-menu-party .hud-party-visibility:hover, .hud-menu-party .hud-party-visibility:active {
    background: var(--light-hover-btn);
}

/* @CustomModMenuStyles */
#hud-menu-settings {
    ${localStorage.UseBackdropBlur === "true" ? "backdrop-filter: blur(3px);" : ""}
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.1);
    margin: 0px;
    top: calc(50vh - 250px);
    left: calc(50vw - 360px);
    width: 720px;
    height: 500px;
    padding: 0px;
    border-radius: 10px;
    overflow: hidden;
    z-index: 20;
}
.hud-menu-tabs {
    position: relative;
    height: 40px;
    line-height: 40px;
    margin-top: 30px;
}
.hud-menu-tabs-link {
    display: block;
    float: left;
    padding: 0 14px;
    margin: 0 1px 0 0;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.1);
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.15s ease-in-out;
}
.hud-menu-tabs-link.is-active, .hud-menu-tabs-link:hover {
    background: rgba(0, 0, 0, 0.36);
    color: #eee;
}
.hud-menu-tabs-link:last-child {
    border-top-right-radius: 3px;
}
.hint-controls {
    position: absolute;
    display: flex;
    flex-direction: column;
    zoom: 83%;
    width: fit-content;
    height: 65px;
    top: 55px;
    left: 53%;
    overflow-y: scroll;
}
.hint-controls > li {
    opacity: 0.5;
    -webkit-font-smoothing: antialiased;
    margin: 0 5px 0 0;
}
#hud-menu-settings > h3 {
    margin: 20px;
}
.hud-menu-settings .hud-settings-grid {
    height: 390px;
    margin: 0px;
    overflow: hidden;
    padding: unset;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}
.hud-settings-page {
    width: 100%;
    height: 100%;
}
.hud-settings-page > span {
    position: relative;
    margin: auto;
    font-size: 17px;
    opacity: 0.7;
}
.hud-settings-options {
    display: inline-block;
    position: relative;
    width: 50%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    overflow: auto;
    scrollbar-width: none;
}
.hud-settings-options > div {
    opacity: 0.8;
    display: block;
    position: relative;
    height: 120px;
    border-bottom: 3px solid rgba(255, 255, 255, 0.2);
    padding: 15px;
}
.hud-settings-options > div.disabled {
    pointer-events: none;
    opacity: 0.4;
}
.hud-settings-options > div:nth-child(even) {
    background: rgba(0, 0, 0, 0.15);
}
.hud-settings-options > div:last-child {
    border-bottom: none;
}
.hud-settings-options > div > div {
    display: flex;
    position: absolute;
    bottom: 11px;
    right: 11px;
    justify-content: flex-end;
}
.hud-settings-options h2 {
    font-family: "Open Sans";
    margin: 5px 0;
    font-size: 1.4em;
}
.hud-settings-options span {
    display: block;
    position: absolute;
    opacity: 0.7;
    width: 55%;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
}
.hud-settings-options > div > div span {
    position: relative;
    width: 60px;
}
.hud-settings-options button {
    position: absolute;
    top: calc(50% - 20px);
    right: 50px;
    height: 40px;
    width: 25%;
    background: #fff;
    border: none;
    border-bottom: 3px solid lightgreen;
    color: #111;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.05);
}
.hud-settings-options .underline-red {
    border-bottom: 3px solid red;
}
.hud-settings-options a {
    position: absolute;
    top: calc(50% - 10px);
    right: 10px;
    height: 20px;
    width: 20px;
    background: unset;
    opacity: 0.4;
    transition: all 0.15s ease-in-out;
}
.hud-settings-options a::before {
    font-family: "Font Awesome 5 Free";
    content: "\\f054";
    font-size: 20px;
    height: 100%;
    width: 100%;
    display: block;
    font-weight: 900;
}
.hud-settings-options a:hover {
    opacity: 1;
}
.hud-settings-options input {
    position: relative;
    margin-bottom: 0px;
}
.hud-settings-more {
    position: relative;
    display: inline-block;
    width: 50%;
    height: 100%;
    padding: 15px;
    overflow: auto;
}
.hud-settings-more h2 {
    margin: 5px 0px 10px;
}
.hud-settings-more select {
    height: 40px;
    width: 35%;
    background: #fff;
    border: none;
    color: #111;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
    float: right;
    padding: 0px 10px;
}
.hud-settings-more select:hover {
    background: #fff;
    color: black;
}
.hud-settings-more input:not([type="checkbox"]) {
    height: 40px;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    color: #eee;
    margin: 10px 0;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
}
.hud-settings-more span {
    display: block;
    opacity: 0.5;
}
.hud-menu-settings > .hud-settings-grid label > span {
    display: inline-block;
    color: white;
    text-transform: unset;
    font-size: 16px;
}
.hud-settings-more p {
    display: inline-block;
    height: 40px;
    align-content: center;
    margin: unset;
    opacity: 0.8;
    font-size: 15px;
}
.hud-settings-more span {
    display: block;
    opacity: 0.5;
}
.hud-settings-more hr {
    width: 8%;
    float: left;
    margin-top: -5px;
    opacity: 0.4;
}

/* @CustomMoreSettings */
.base-card {
    position: relative;
    display: block;
    width: 100%;
    height: 64px;
    margin: 0 0 10px;
    padding: 10px 10px 10px 10px;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    color: #eee;
    border-radius: 3px;
    transition: all 0.15s ease-in-out;
    text-align: left;
}
.base-card:hover {
    background: rgba(255, 255, 255, 0.2);
}
#base-management {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 75%;
    margin: 0px -15px;
    padding: 0 15px;
    overflow-y: scroll;
    overflow-x: visible;
    scrollbar-width: none;
}
#base-management input {
    margin: 0px;
}
#target-base-name {
    background: none;
    box-shadow: none;
    text-align: left;
    font-weight: bold;
    padding: 0px;
    font-size: 16px;
}
#target-base-description {
    background: none;
    box-shadow: none;
    text-align: left;
    padding: 0px;
    opacity: 0.8;
    height: 20px;
    margin-bottom: 10px;
}
#target-base-design {
    background: none;
    box-shadow: none;
    text-align: left;
    padding: 0px;
    opacity: 0.4;
    height: 20px;
    margin-bottom: 20px;
    font-size: 8px;
}
#action-tab {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 40px;
    margin: 0 -15px -10px;
    overflow-x: visible;
    background: rgba(0, 0, 0, 0.1);
}
#action-tab > button {
    width: 40px;
    background: none;
    border: none;
    color: #eee;
    filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.1));
    font-size: 16px;
    cursor: pointer;
}
#useful-info {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: flex-start;
    height: 50px;
    margin-top: 10px;
    font-size: 14px;
}

#switch-ses {
    display: flex;
}
#switch-ses select {
    display: block;
    width: 85%;
    margin: 0px 10px 0 0;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
}
#switch-ses button {
    background: none;
    box-shadow: unset;
    border: 0px;
    color: white;
    cursor: pointer;
    width: 40px;
    font-size: 20px;
}

.more-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    margin: 20px -15px 10px;
    padding: 5px 15px 10px;
    background: rgba(0, 0, 0, 0.2);
    height: 50px;
}
.more-title:first-child {
    margin: -15px -15px 10px;
}
#general-control, #multibox-control {
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
}
#general-control button, #multibox-control button {
    height: 40px;
    background: #fff;
    border: none;
    border-bottom: 2px solid red;
    color: #111;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.05);
    padding: 0 20px;
}
#socket-info {
    display: flex;
    align-items: baseline;
    gap: 12px;
}
.more-title > * {
    margin: 0;
}
#clone-status > p {
    position: relative;
    margin: 10px 0 0;
}

#heat-range, #scene-alpha-range {
    display: flex;
    margin: 10px 0;
}
#heat-range input[type="number"], #scene-alpha-range input[type="number"] {
    width: 26%;
}
#heat-range input[type="range"], #scene-alpha-range input[type="range"] {
    margin: 10px;
    box-shadow: none;
}
`;
let styles = document.createElement("style");
styles.type = "text/css";
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);

window.getClass = (DOMClass) => {
    return document.getElementsByClassName(DOMClass);
};

window.getId = (DOMId) => {
    return document.getElementById(DOMId);
};

const getClass = window.getClass;
const getId = window.getId;

/* @IntroJsStyles */
document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div").removeChild(document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > button"));

/*
getClass("hud-intro-corner-top-left")[0].insertAdjacentHTML("afterbegin", `
    <div>
        <label>
            <input type="checkbox" id="useSes" />
            <span>Session Mode</span>
        </label>
        <label>
            <input type="checkbox" id="shouldUseBackdrop" ${localStorage.UseBackdropBlur === "true" ? "checked" : ""} />
            <span>Use Backdrop Blur</span>
        </label>
        <label>
            <input type="checkbox" id="shouldUseOptimization" />
            <span>Enhanced Optimization</span>
        </label>
    </div>
`);
*/
document.querySelector("#hud-intro").setAttribute("style", "--bg-image: url('https://act-webstatic.hoyoverse.com/puzzle/zzz/pz_zCT32XGuUS/resource/puzzle/2025/07/08/38b8c41c1f28f924081f894b84251896_401722559154469106.mp4');");
// document.querySelector("#hud-intro").setAttribute("style", "--bg-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/cachedImage.jpg?v=1751177111668');");
document.querySelector("#hud-intro").insertAdjacentHTML("afterbegin", `
    <video autoplay muted loop style="position: absolute; width: 100%; height: 100%; object-fit: cover; left: 50%; top: 50%; transform: translate(-50%, -50%); filter: brightness(80%);" src="https://act-webstatic.hoyoverse.com/puzzle/zzz/pz_zCT32XGuUS/resource/puzzle/2025/07/08/38b8c41c1f28f924081f894b84251896_401722559154469106.mp4"></video>
    <div id="intro-animation">
        <canvas id="background-canvas"></canvas>
        <!-- <img src="https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/eto_large.png?v=1717285769725" /> -->
        <canvas id="foreground-canvas"></canvas>
    </div>
`);
document.querySelector("#hud-intro").insertAdjacentHTML("beforeend", `
    <div id="start-btn">
        <h1>Play</h1>
        <hr />
        <h2>Click to play</h2>
    </div>
    <div id="hud-intro-overlay">
        <div id="loading-div">
            <span class="hud-loading"></span>
            <a href="javascript:void(0);" onclick="game.ui.components.Intro.hideLoadingScreen();">Click to return</a>
        </div>
    </div>
`);
document.querySelector(".hud-intro-form").insertAdjacentHTML("beforeend", `
    <div id="hud-intro-title" style="text-align: start;">
        <h1>ZOMBS<small>.io</small></h1>
        <h2>Build. Defend. Survive.</h2>
    </div>
    <div id="hud-intro-options">
    </div>
    <div id="hud-intro-settings">
        <label>
            <input type="checkbox" id="useSes" />
            <span>Session Mode</span>
        </label>
        <label>
            <input type="checkbox" id="shouldUseBackdrop" ${localStorage.UseBackdropBlur === "true" ? "checked" : ""} />
            <span>Use Backdrop Blur</span>
        </label>
        <label>
            <input type="checkbox" id="shouldUseOptimization" />
            <span>Enhanced Optimization</span>
        </label>
    </div>
`);
document.querySelector("#hud-intro-options").insertAdjacentElement("beforeend", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > input"));
document.querySelector("#hud-intro-options").insertAdjacentElement("beforeend", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > select"));
document.querySelector("#hud-intro-settings").insertAdjacentElement("beforeend", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > label"));

document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

/*
const allLines = {};
const RAIN_OFFSET = 5;
const LINES_ON_SCREEN = 10;
function createLines(linesOnScreen) {
    // if (Object.keys(allLines).length >= linesOnScreen) return;
    for (const lineId in allLines) {
        const line = allLines[lineId];
        if (line.y > window.innerHeight + line.length) delete allLines[lineId];
    };
    for (let i = 0; i < (linesOnScreen - Object.keys(allLines).length); i++) {
        const rctx = ["background-canvas", "foreground-canvas"][Math.floor(Math.random() * 2)];
        const rLineLength = getRandomArbitrary(25, 50);
        const rPosX = getRandomArbitrary(50, window.innerWidth + 50);
        const rSpeed = getRandomArbitrary(10, 30);
        const rTimeout = getRandomArbitrary(20, 5000);

        allLines[genUUID()] = {x: rPosX, y: -rLineLength - RAIN_OFFSET, length: rLineLength, speed: rSpeed, ctxId: rctx, timeout: rTimeout, shouldTimeout: true};
    };
};

function drawLine() {
    for (const lineId in allLines) {
        const line = allLines[lineId];
        // console.log(line);

        // setTimeout(() => {
        const ctx = getId(line.ctxId).getContext("2d");
        ctx.strokeStyle = "White";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x - RAIN_OFFSET, line.y + line.length);
        ctx.stroke();
        line.shouldTimeout = false;
        // }, line.shouldTimeout ? line.timeout : 0);
    };
}

function moveLine(lineIndex) {
    for (const lineId in allLines) {
        allLines[lineId].y += allLines[lineId].speed;
        allLines[lineId].x -= RAIN_OFFSET / 2;
    };
}

let drawLoopId;
function drawLoop() {
    createLines(LINES_ON_SCREEN);

    const background = getId("background-canvas");
    const bctx = background.getContext("2d");
    bctx.clearRect(0, 0, background.width, background.height);

    const foreground = getId("foreground-canvas");
    const fctx = foreground.getContext("2d");
    fctx.clearRect(0, 0, foreground.width, foreground.height);

    moveLine();
    drawLine();

    drawLoopId = requestAnimationFrame(drawLoop);
}
setTimeout(() => {
    drawLoopId = requestAnimationFrame(drawLoop);
}, 500);
*/

game.network.addEnterWorldHandler((e) => {
    if (!e.allowed) return game.ui.components.Intro.hideLoadingScreen();
    cancelAnimationFrame(drawLoopId);
});

function resizeIntroCanvases() {
    const background = getId("background-canvas");
    background.width = window.innerWidth;
    background.height = window.innerHeight;

    const foreground = getId("foreground-canvas");
    foreground.width = window.innerWidth;
    foreground.height = window.innerHeight;
};
resizeIntroCanvases();
window.addEventListener("resize", resizeIntroCanvases);

// game.ui.components.Intro.submitElem = getId("start-btn");
game.ui.components.Intro.hideLoadingScreen = function() {
    if (game.world.inWorld && getId("hud-intro").style.display != "none") {
        getId("hud-intro").style.display = "none";
    };
    getId("hud-intro-overlay").style.display = "none";
    getId("hud-intro-overlay").style.opacity = 0;
    getId("loading-div").style.display = "none";
};
game.ui.components.Intro.showLoadingScreen = function() {
    getId("select-session-add").style.display = "none";
    getId("endpoint-add-menu").style.display = "none";
    getId("session-add-menu").style.display = "none";

    getId("hud-intro-overlay").style.display = "flex";
    getId("hud-intro-overlay").style.opacity = 1;
    getId("loading-div").style.display = "flex";
};

game.ui.components.Intro.onSubmitClick = function () {
    const realNicknameLength = new Blob([this.nameInputElem.value]).size;
    if (realNicknameLength > 29) return void game.ui.components.Intro.onConnectionError('Your nickname length is too long. Please shorten it/use less special characters.');
    const server = this.ui.getOption(`servers`)[this.serverElem.value];
    localStorage.setItem(`name`, this.nameInputElem.value.trim());
    this.connecting || (
        this.connecting = true,
        getId("hud-intro-overlay").style.display = "flex",
        getId("hud-intro-overlay").style.opacity = 1,
        getId("loading-div").style.display = "flex",
        this.connectionTimer = setTimeout(() => {
            const _this = game.ui.components.Intro;
            _this.connecting = false;
            game.network.disconnect();
            _this.hideLoadingScreen();
            _this.serverElem?.classList.add('has-error');
            _this.errorElem.style.display = 'block';
            _this.errorElem.innerText = `We failed to join the game - this is a known issue with anti-virus software. Please try disabling any web filtering features.`;
        }, 15000),
        this.errorElem.style.display = `none`,
        this.ui.setOption(`nickname`,this.nameInputElem.value.trim()),
        this.ui.setOption(`serverId`, this.serverElem.value),
        game.network.connect(server)
    );
}
getId("start-btn").onclick = game.ui.components.Intro.onSubmitClick.bind(game.ui.components.Intro);

game.ui.components.Intro.onEnterWorld = function (data) {
    this.connecting = false;
    if (this.connectionTimer) {
        clearInterval(this.connectionTimer);
        delete this.connectionTimer;
    }
    if (!data.allowed) {
        _this.hideLoadingScreen();
        this.serverElem.classList.add('has-error');
        this.errorElem.style.display = 'block';
        this.errorElem.innerText = 'This server is currently full. Please try again later or select another server.';
        return;
    }
    this.hide();
};

game.ui.components.Intro.onConnectionError = function (errorText) {
    errorText ||= `We were unable to connect to the gameserver. Please try another server.`;
    this.connecting = false;
    this.connectionTimer && (
        clearInterval(this.connectionTimer),
        delete this.connectionTimer
    );
    this.hideLoadingScreen();
    this.serverElem.classList.add('has-error');
    this.errorElem.style.display = 'block';
    this.errorElem.innerText = errorText;
};

document.addEventListener('keyup', function(e) {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.code == 'Escape') {
            game.ui.components.Intro.hideLoadingScreen();
        };
        if (e.key == "Enter") {
            (game.ui?.playerTick?.dead === 1) && game.ui.components.Chat.startTyping();
        };
        if (e.key == ";") {
            game.ui.getPlayerPetUid() && Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()});
        }
        if (e.key == "'") {
            if (game.ui.getPlayerPetUid()) {
                game.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1});
                game.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1});
            };
        };
        if (e.code == 'KeyC' && !e.ctrlKey) {
            setTimeout(() => {
                document.querySelector('#joinWithPsk').style.display = 'block';
                document.querySelector('#joinWithPsk').focus();
                document.querySelector('#joinWithPsk').value = "";
            }, 100);
        }
    };
});

/* @Misc. */
getId('hud').insertAdjacentHTML('beforeend', `
    <input id="joinWithPsk" type="tel" placeholder="insert PSK..." class="btn">
`);
document.querySelector('#joinWithPsk').addEventListener('keyup', (e) => {
    if (e.key == "Enter" || e.key == "Escape") {
        e.target.style.display = 'none';
        e.key == "Enter" && game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: e.target.value});
    };
});

document.querySelector("#hud-resources").appendChild(getId("hud-shield-bar"));
document.querySelector("#hud-resources").appendChild(getId("hud-health-bar"));

document.querySelector("#hud-respawn > div > div > div").insertAdjacentHTML("afterbegin", `
    <div id="respawn-text-div" style="display: flex;flex-direction: column;flex-wrap: wrap;width: fit-content;padding: 0 10px;opacity: 0.7;align-items: flex-start;"></div>
    <button class="hud-respawn-btn" id="hud-spectate-btn">Spectate</button>
`);

game.ui.components.Respawn.respawnTextElem = getId("respawn-text-div");
game.ui.components.Respawn.onPlayerDeath = function (deadResponse) {
    window.deadPos = game.ui.playerTick.position;
    const player = Game.currentGame.world.getEntityByUid(Game.currentGame.world.getMyUid()),
          playerTick = player.getTargetTick();
    this.lastTick = playerTick;
    this.respawnTextElem.innerHTML = `<li>Wave: ` + playerTick.wave + `</li><li>Score: ` + playerTick.score.toLocaleString() + `</li><li>Leaderboard: #` + (game.ui.components.Leaderboard.leaderboardData.find(e => e.uid == game.world.myUid).rank + 1) + `</li>`;
    this.show();
}
game.network.addRpcHandler("Dead", game.ui.components.Respawn.onPlayerDeath.bind(game.ui.components.Respawn));

/* @ModMenuJsStyles */
getId('hud-menu-settings').innerHTML = `
    <a class="hud-menu-close" onclick="getId('hud-menu-settings').style.display = 'none';"></a>
    <h3>Advanced</h3>
    <div class="hud-menu-tabs">
        <a class="hud-menu-tabs-link" data-menu="0">Build</a>
        <a class="hud-menu-tabs-link" data-menu="1">Player</a>
        <a class="hud-menu-tabs-link" data-menu="2">WS & Raid</a>
        <a class="hud-menu-tabs-link" data-menu="3">Visual</a>
        <a class="hud-menu-tabs-link" data-menu="4">Misc.</a>
    </div>
    <div class="hint-controls"></div>
    <div class="hud-settings-grid" page="0"></div>
`;

getClass('hud-settings-grid')[0].innerHTML = `
<div class="hud-settings-page" id="page0">
    <div class="hud-settings-options"></div>
    <div class="hud-settings-more"></div>
</div>
<div class="hud-settings-page" id="page1">
    <div class="hud-settings-options"></div>
    <div class="hud-settings-more"></div>
</div>
<div class="hud-settings-page" id="page2">
    <div class="hud-settings-options"></div>
    <div class="hud-settings-more"></div>
</div>
<div class="hud-settings-page" id="page3">
    <div class="hud-settings-options"></div>
    <div class="hud-settings-more"></div>
</div>
<div class="hud-settings-page" id="page4">
    <div class="hud-settings-options"></div>
    <div class="hud-settings-more"></div>
</div>
`;

const hint_enum = {
    0: `<li><strong>Shift + 1</strong> [!] toggles Wall Block.</li>
        <li><strong>Comma</strong> [,] toggles Rebuilder.</li>
        <li><strong>Period</strong> [.] toggles Auto Upgrade.</li>`,

    1: `<li><strong>Shift-click</strong> on the minimap to navigate.</li>
        <li><strong>Equal</strong> [=] toggles Auto Bow.</li>
        <li><strong>C</strong> toggles quick join via PSK input.</li>
        <li><strong>G</strong> toggles zoom menu.</li>
        <li><strong>Dash</strong> [-] toggles local info indicators.</li>
        <li><strong>Semi-colon</strong> [;] deletes your pet.</li>
        <li><strong>Back-tick</strong> ['] revives your pet.</li>`,
    2: ``,

    3: `<li><strong>Shift + / </strong> [?] toggles Screenshot Mode.</li>
        <li><strong>V</strong> toggles Grouping Grid.</li>`,
    4: ``,
};

function refreshMore(page) {
    const container = document.querySelector("#" + page + " > div.hud-settings-more");
    for (let children of container.children) {
        children.style.display = "none";
    }
}

function refreshPage() {
    for (let i = 0; i < getClass('hud-settings-grid')[0].children.length; i++) getId(`page${i}`).style.display = "none";
};

function setPage(page) {
    const lastPage = parseInt(getClass('hud-settings-grid')[0].getAttribute('page'));

    refreshPage();

    getClass("hud-menu-tabs")[0].children[lastPage].classList.remove("is-active");
    getClass("hud-menu-tabs")[0].children[page].classList.add("is-active");

    getId(`page${page}`).style.display = "flex";
    getClass('hint-controls')[0].innerHTML = hint_enum[page];
    getClass('hud-settings-grid')[0].setAttribute('page', page);
};
setPage('0');
Array.from(getClass("hud-menu-tabs")[0].children).forEach((e) => {
    e.onclick = () => { setPage(e.getAttribute("data-menu")); };
});

const menu = {
    page0: {
        AHRC: {
            name: `AHRC`,
            description: `Automatically harvests resources.`,
            more: {
                html: `
                    <p>AHRC type: </p>
                    <select id="ahrcOptions">
                        <option value="ch" selected>All</option>
                        <option value="h">Harvest</option>
                        <option value="c">Collect</option>
                    </select>
                    <br><br>
                    <span>The <strong>All</strong> option is both Harvest + Collect.</span>
                `,
                functions: () => {},
            },
        },
        wallBlock: {
            name: `Defense Block`,
            description: `Allows you to place mulitple defenses at once.`,
            more: {
                html: `
                    <p>Block width: </p>
                    <select id="blockX" class="btn">
                        ${[3, 5, 7, 9, 11, 13, 15].map(size => {
                            return `<option value="${size}" ${size == 5 ? "selected" : ""}>${size} blocks</option>`;
                        }).join("\n")}
                    </select>
                    <br><br>
                    <p>Block height: </p>
                    <select id="blockY" class="btn">
                        ${[3, 5, 7, 9, 11, 13, 15].map(size => {
                            return `<option value="${size}" ${size == 5 ? "selected" : ""}>${size} blocks</option>`;
                        }).join("\n")}
                    </select>
                    <br><br>
                    <p>Type of defense: </p>
                    <select id="defense-select" class="btn">
                        <option value="Wall" selected>Wall</option>
                        <option value="Door">Door</option>
                    </select>
                    <br><br>
                    <span>Default value is 5x5, maximum is 15x15 (cells).</span>
                `,
                functions: () => {
                    getId("blockX").onchange = () => { game.script.wallBlock.wallElem.setAttribute("data-tier", `${getId("blockX").value}x${getId("blockY").value}`); };
                    getId("blockY").onchange = () => { game.script.wallBlock.wallElem.setAttribute("data-tier", `${getId("blockX").value}x${getId("blockY").value}`); };
                    getId("defense-select").onchange = ({target}) => {
                        game.script.wallBlock.typeOfDefense = target.value;
                        game.script.wallBlock.wallElem.setAttribute("data-building", target.value);
                    };
                }
            },
            onCallback: () => {
                game.script.wallBlock.wallElem.style.display = "block";
            },
            offCallback: () => {
                game.script.wallBlock.wallElem.style.display = "none";
            },
        },
        autoTrap: {
            name: `Auto Trap`,
            description: `Automatically traps players with wall blocks.`,
            more: {
                html: `
                    <p>Should trap: </p>
                    <select id="autoTrapOptions" class="btn">
                        <option value="pl" selected>Non-party members</option>
                        <option value="al">All players</option>
                    </select>
                    <br><br>
                    <span>Each block is always 7x7.</span>
                `,
                functions: () => {}
            },
        },
        rebuild: {
            name: `Auto Rebuild`,
            description: `Automatically rebuilds dead towers and upgrades them.`,
            more: {
                html: `
                    <p>Rebuild to tier: </p>
                    <select id="rebuilderTierOptions" class="btn">
                        <option value="current" selected>Current</option>
                        ${[1, 2, 3, 4, 5, 6, 7, 8].map(tier => {
                            return `<option value="tier-${tier}">Tier ${tier}</option>`;
                        }).join("\n")}
                    </select>
                    <br><br>
                    <span>By behaviour, if the previously destroyed tower has a lower tier than the selected tier, it will be rebuilt to the old tier.</span>
                `,
                functions: () => {
                    const tierEnum = {
                        'current': null,
                        'tier-1': 1,
                        'tier-2': 2,
                        'tier-3': 3,
                        'tier-4': 4,
                        'tier-5': 5,
                        'tier-6': 6,
                        'tier-7': 7,
                        'tier-8': 8
                    };
                    getId("rebuilderTierOptions").onchange = function({target}) {
                        game.script.rebuild.shouldRebuildToTier = tierEnum[target.value];
                    };
                },
            },
            onCallback: () => {
                for (let i in Game.currentGame.ui.buildings) {
                    const building = Game.currentGame.ui.buildings[i];
                    game.script.rebuild.savedBase[building.type] ||= {};
                    game.script.rebuild.savedBase[building.type][building.x] ||= {};
                    game.script.rebuild.savedBase[building.type][building.x][building.y] = building.tier;
                }
            },
            offCallback: () => {
                game.script.rebuild.savedBase = {};
                game.script.rebuild.toBeReplaced = {};
                game.script.rebuild.toBeUpgraded = {};
            },
        },
        autoUpgrade: {
            name: `Auto Upgrader`,
            description: `Automatically upgrades towers to maximum tier.`,
            more: null,
            onCallback: () => {
                for (let building of Object.values(game.ui.buildings)) {
                    if (building.tier < 8) {
                        game.script.autoUpgrade.autoUpgradeList[building.uid] = true;
                    }
                }
            },
            offCallback: () => {
                game.script.autoUpgrade.autoUpgradeList = {};
            }
        },
        AULHT: {
            name: `AULHT`,
            description: `Automatically upgrades low-health towers.`,
        },
        autoBuild: {
            name: "Auto Builder",
            description: `Automatically builds a base when placing stash.`,
        },
        baseSaver: {
            name: "Base Saver",
            description: `Manage all your saved bases here.`,
            more: {
                html: `
                    <div id="base-container"></div>
                    <div id="base-management" style="display: none;">
                        <div id="action-tab">
                            <button id="return-to-manager"><i class="fa-solid fa-chevron-left"></i></button>
                            <button id="save-config" onclick="window.saveCurrentBaseConfig();"><i class="fa-solid fa-floppy-disk"></i></button>
                            <button id="encode-target-design"><i class="fa-solid fa-code"></i></button>
                            <button id="view-target-design"><i class="fa-solid fa-eye"></i></button>
                            <button id="build-design"><i class="fa-solid fa-hammer"></i></button>
                            <button id="clear-target-design"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                        <br><h2>Info</h2><hr />
                        <input id="target-base-name" type="tel" placeholder="Base name" class="btn" maxlength="20">
                        <input id="target-base-description" type="tel" placeholder="Base description" class="btn" maxlength="40">
                        <input id="target-base-design" type="tel" placeholder="Base string" class="btn">
                        <div id="useful-info"></div>
                        <label>
                            <input type="checkbox" id="shouldBuildBase">
                            <span>Set default for Auto Builder</span>
                        </label>
                    </div>
                `,
                functions: () => {
                    localStorage.totalSlots ||= 2;
                    getId("return-to-manager").onclick = () => document.querySelector("#more-baseSaver").click();
                    localStorage.baseslot0 = `3,0,-96,0;3,-96,0,0;3,0,-192,0;3,-96,-240,0;3,-192,0,0;3,-240,-96,0;4,-336,-96,0;4,-432,-288,0;4,-96,-336,0;4,-288,-432,0;8,-192,-384,0;8,-384,-192,0;8,-288,-192,0;8,-192,-192,0;8,-192,-288,0;8,-288,-288,0;8,-384,-384,0;8,-96,-96,0;7,-288,0,0;7,-384,0,0;7,-432,-96,0;7,0,-288,0;7,0,-384,0;7,-96,-432,0;0,-168,-504,0;0,-216,-504,0;0,-264,-552,0;0,-312,-552,0;0,-312,-504,0;0,-504,-216,0;0,-504,-168,0;0,-552,-264,0;0,-552,-312,0;0,-504,-312,0;1,-360,-456,0;1,-456,-360,0;9,96,-96,0;9,-96,96,0;|Lucky's 1P corner farm base|Can be changed for current session|default`;

                    window.isSlotEmpty = function(index) {
                        const baseData = localStorage[`baseslot${index}`]?.split("|");
                        return !!baseData?.[0];
                    };

                    window.createBaseSlot = function() {
                        const oldTotalSlots = parseInt(localStorage.totalSlots);
                        const nextItem = oldTotalSlots + 1;
                        localStorage.totalSlots = nextItem;
                        localStorage[`baseslot${nextItem}`] = '|||';
                        document.querySelector("#more-baseSaver").click();
                    };

                    window.saveCurrentBaseConfig = function() {
                        const [design, title, description, date] = [...document.querySelectorAll("#target-base-design, #target-base-name, #target-base-description"), new Date().toLocaleDateString()];
                        const baseManagement = getId('base-management');
                        const currentBaseItem = baseManagement.getAttribute('current-item');
                        localStorage[`baseslot${currentBaseItem}`] = `${design.value}|${title.value}|${description.value}|${date}`;
                        return void game.ui.components.PopupOverlay.showHint('Current base configuration saved.');
                    };
                },
                bind: () => {
                    const baseContainer = getId('base-container');
                    const baseManagement = getId('base-management');
                    baseContainer.innerHTML = '';
                    baseManagement.style.display = "none";

                    for (let i = 0; i < parseInt(localStorage.totalSlots) + 1; i++) {
                        const baseItem = document.createElement('div');
                        const baseData = localStorage[`baseslot${i}`]?.split("|");
                        const baseId = genUUID();

                        /*
                        baseData?.[1] && (baseData[1] = window.filterXSS(baseData[1]));
                        baseData?.[2] && (baseData[2] = window.filterXSS(baseData[2]));
                        */

                        baseItem.classList.add('base-card');
                        baseItem.id = `base-item-${i}`;
                        baseItem.setAttribute('item-base', i);
                        baseItem.innerHTML = `
                            <strong></strong>
                            <span style="color: rgba(255, 255, 255, 0.4);font-size: 13px;display: flex;"></span>
                            <span style="color: rgba(255, 255, 255, 0.4);font-size: 13px;display: flex;justify-content: flex-end;transform: translate(0px, -40px);"></span>
                        `;

                        const [title, description, date] = baseItem.children;
                        title.innerText = baseData?.[1] || "Unoccupied";
                        description.innerText = baseData?.[2] || "-";
                        date.innerText = baseData?.[3] || "";

                        baseItem.onclick = function() {
                            const [titleField, descriptionField, designField] = [...document.querySelectorAll("#target-base-name, #target-base-description, #target-base-design")];
                            designField.value = baseData?.[0] || "";
                            titleField.value = baseData?.[1] || "";
                            descriptionField.value = baseData?.[2] || "";

                            getId("encode-target-design").onclick = game.script.builder.recordBase.bind(game.script.builder);
                            getId("view-target-design").onclick = () => game.script.builder.showOverlay(designField.value, 10000);

                            baseManagement.setAttribute('current-item', i);
                            for (let otherItem = 0; otherItem < parseInt(localStorage.totalSlots) + 1; otherItem++) {
                                const item = getId(`base-item-${otherItem}`);
                                const isThisItem = item.getAttribute('item-base') == i;
                                if (isThisItem) continue;
                                item.style.display = "none";
                            };

                            baseItem.style.transform = 'translate(0px, 306px)';
                            getId('add-base-slot').style.display = "none";
                            baseManagement.style.display = "block";

                            getId("build-design").onclick = function() {
                                game.ui.components.PopupOverlay.showConfirmation("Are you sure you want to build base?", 5000, function() {
                                    game.script.builder.buildBase(designField.value);
                                });
                            };

                            const {wood, stone} = game.script.builder.calculateResourceNeeded(designField.value);
                            const neededPlayers = game.script.builder.calculateNeededPlayers(designField.value);
                            getId("useful-info").innerHTML = `
                                <li>Wood: ${wood}</li>
                                <li>Needed players: ${neededPlayers}</li>
                                <li>Stone: ${stone}</li>
                            `;

                            const autoBuildElem = getId("shouldBuildBase");
                            autoBuildElem.checked = sessionStorage[`base-item-${i}`] && sessionStorage[`base-item-${i}`] == "true";
                            autoBuildElem.onchange = function() {
                                if (autoBuildElem.checked == true) {
                                    for (let otherItem = 0; otherItem < parseInt(localStorage.totalSlots) + 1; otherItem++) sessionStorage[`base-item-${otherItem}`] = false;
                                    sessionStorage[`base-item-${i}`] = true;
                                    game.script.autoBuild.defaultBase = designField.value;
                                }
                            };
                        };
                        baseContainer.appendChild(baseItem);
                    }
                    const addItem = document.createElement('div');
                    addItem.classList.add('base-card');
                    addItem.id = "add-base-slot";
                    addItem.innerHTML = `
                        <strong style="position: absolute;top: 20px;left: 40px;opacity: 0.4;"><i class="fas fa-plus"></i></strong>
                        <span style="color: rgba(255, 255, 255, 0.4);display: flex;justify-content: flex-end;position: absolute;left: 65px;top: 20px;">Add another base slot</span>
                    `;
                    addItem.onclick = window.createBaseSlot;
                    baseContainer.appendChild(addItem);
                },
            },
        },
    },
    page1: {
        autoAim: {
            name: "Auto Aim",
            description: "Automate attacks against enemies.",
            more: {
                html: `
                    <p>Aim for: </p>
                    <select id="autoAimOptions">
                        <option value="player" selected>Players</option>
                        <option value="zombie">Zombies</option>
                        <option value="zom/dem">Zombies/Demons</option>
                        <option value="all">All</option>
                    </select>
                `,
            },
        },
        autoHeal: {
            name: "Auto Heal",
            description: "Heals your player/pet automatically.",
            more: {
                html: `
                    <strong>Define the health percentage where the Auto Heal will kick in.</strong>
                    <span>Default value is 15%.</span>
                    <input id="auto-heal-threshold" type="number" placeholder="Enter a valid percentile here..." min="1" max="100" value="15" />
                `,
                functions: () => {},
            }
        },
        autoRespawn: {
            name: "Auto Respawn",
            description: "Automatically respawns player upon death.",
        },
        spam: {
            name: `Chat Spam`,
            description: `Annoys other players with messages.`,
            more: {
                html: `
                    <strong>Input the text that you want to spam.</strong>
                    <span>If no text is inputted, random messages with be sent.</span>
                    <input id="chat-spam-input" placeholder="Spam text here..." />
                `,
                functions: () => {
                    const spamInputElem = getId("chat-spam-input");
                    spamInputElem.oninput = game.script.spam.onchange.bind(game.script.spam);
                }
            },
            onCallback: () => { game.script.spam.start(); },
            offCallback: () => { game.script.spam.stop(); },
        },
        movementCopy: {
            name: `Movement Copy`,
            description: `Copies the closest player's movement.`,
            more: null,
            offCallback: () => {
                game.script.movementCopy.target = null;
            },
        },
    },
    page2: {
        sessions: {
            name: "Session Saver",
            description: "Switch sockets on the fly.",
            more: {
                html: `
                    <div class="more-title">
                        <h2>Manage</h2>
                        <button id="refresh-ses" style="background: none;box-shadow: unset;border: 0px;color: white;cursor: pointer;"><i class="fa-solid fa-arrows-rotate"></i></button>
                    </div>
                    <div id="switch-ses">
                        <button id="switch-btn"><i class="fa-solid fa-repeat"></i></button>
                    </div>
                `,
                functions: () => {
                    let isInit = false;
                    game.network.addEnterWorldHandler((e) => {
                        if (isInit || !e.allowed) return;
                        isInit = true;

                        getId("switch-ses").insertBefore(getId("sesSelect"), getId("switch-btn"));
                        getId("switch-ses").insertAdjacentElement("afterend", getId("addBtn"));
                        getId("switch-ses").insertAdjacentElement("afterend", getId("delBtn"));
                        getId("switch-ses").insertAdjacentHTML("afterend", `<br>`);

                        getId("sesSelect").style.display = "block";
                        getId("delBtn").style.display = "inline-block";
                        getId("addBtn").style.display = "inline-block";
                    });
                    getId("refresh-ses").onclick = () => game.script.sessions.fetchSessions();
                    getId("switch-btn").onclick = () => {
                        if (!getId("useSes").checked) {
                            getId("useSes").checked = true;
                            getId("useSes").onchange();
                        };

                        game.network.disconnect();
                        // game.network.connect();
                    };
                },
            },
        },
        cloneSockets: {
            name: "Clones",
            description: "Otherwise known as sockets, alts, etc.",
            more: {
                html: `
                    <div class="more-title">
                        <div id="socket-info">
                            <h2>Status</h2>
                            <span id="clone-amount">0 active</span>
                        </div>
                        <button id="toggle-status" style="background: none;box-shadow: unset;border: 0px;color: white;cursor: pointer;"><i class="fa-solid fa-chevron-up"></i></button>
                    </div>
                    <div id="clone-status" style="display: block;"><span>Nothing here yet...</span></div>

                    <div class="more-title"><h2>General</h2></div>
                    <div id="general-control">
                        <button id="control-delete-all" style="border-bottom: 2px solid red;">Delete all</button>
                        <button id="control-set-default" style="border-bottom: 3px solid deepskyblue;">Set all to default type</button>
                    </div>
                    <label>
                        <input type="checkbox" id="alt-useProxy">
                        <span>Use proxies (if available)</span>
                    </label>
                    <label>
                        <input type="checkbox" id="alt-autoFill">
                        <span>Auto fill server</span>
                    </label>
                    <label>
                        <input type="checkbox" id="alt-randomizeName" checked>
                        <span>Use randomized names</span>
                    </label>
                    <p>Default socket type: </p>
                    <select id="socketTypeOptions" class="btn">
                        <option value="Multibox">Multibox</option>
                        <option value="Filler">Filler</option>
                        <option value="PlayerTrick">Player Trick</option>
                        <option value="AITO">AITO</option>
                    </select>
                    <div class="more-title"><h2>Multibox</h2></div>
                    <div id="multibox-control"></div>
                    <label>
                        <input type="checkbox" id="alt-control" checked>
                        <span>Control clones</span>
                    </label>
                    <label>
                        <input type="checkbox" id="alt-raid">
                        <span>Raid mode (1-by-1)</span>
                    </label>
                    <p>Default movement type: </p>
                    <select id="movementTypeOptions" class="btn">
                        <option value="0">Copy</option>
                        <option value="1" selected>Mouse</option>
                        <option value="2">Lock</option>
                        <option value="3">Player</option>
                    </select>
                `,
                functions: () => {
                    getId("toggle-status").onclick = () => {
                        const cloneStatus = getId("clone-status");
                        getId("toggle-status").innerHTML = `<i class="fa-solid fa-chevron-${cloneStatus.style.display === "none" ? "up" : "down"}"></i>`;
                        cloneStatus.style.display = cloneStatus.style.display === "none" ? "block" : "none";
                    };
                    const observer = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type == 'childList') {
                                getId("clone-status").firstChild.localName == "span" && getId("clone-status").removeChild(getId("clone-status").firstChild);
                            };
                        };
                    });
                    observer.observe(getId("clone-status"), { attributes: true, childList: true, subtree: true });

                    for (const option in game.script.sockets.shared.options) {
                        const toggleElem = getId("alt-" + option);
                        toggleElem.addEventListener("change", ({target}) => {
                            if (target.checked) {
                                game.script.sockets.shared.options[option].enabled = true;
                                game.script.sockets.shared.options[option]?.onCallback?.();
                            } else {
                                game.script.sockets.shared.options[option].enabled = false;
                                game.script.sockets.shared.options[option]?.offCallback?.();
                            };
                        });
                    }

                    getId("control-delete-all").onclick = () => {
                        game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to delete all clones?`, 5000, function() {
                            for (let uuid in game.script.sockets.shared.all) {
                                game.script.sockets.shared.all[uuid].ws.readyState != 3 && game.script.sockets.shared.all[uuid].ws.close();
                            };
                        });
                    };
                    getId("control-set-default").onclick = () => {
                        for (let uuid in game.script.sockets.shared.all) {
                            game.script.sockets.shared.all[uuid].switchType(getId("socketTypeOptions").value);
                        };
                    };

                    getId("movementTypeOptions").onchange = ({target}) => {
                        for (const uuid in game.script.sockets.shared.all) {
                            const socket = game.script.sockets.shared.all[uuid];
                            if (socket.typeSpecificVariables.overrides && !socket.typeSpecificVariables.overrides.autoMove) {
                                socket.typeSpecificVariables.autoMove = parseInt(target.value);
                            };
                        };
                    };
                },
            },
            isToggle: false,
            customButtonText: "Send",
            callback: () => {
                const type = getId("socketTypeOptions").value;
                game.script.sockets.createSocket(type);
            },
        },
    },
    page3: {
        optimize: {
            name: "Optimizers",
            description: "Disables rendering features for better performance.",
            more: {
                html: `
                    <h2>Sprite refreshing</h2>
                    <label>
                        <input type="checkbox" id="zombieSprite" checked>
                        <span>Zombie sprites</span>
                    </label>
                    <label>
                        <input type="checkbox" id="towerSprite" checked>
                        <span>Tower sprites</span>
                    </label>
                    <label>
                        <input type="checkbox" id="projectileSprite" checked>
                        <span>Projectile sprites</span>
                    </label>
                    <h2>Other</h2>
                    <label>
                        <input type="checkbox" id="updateAnimation" checked>
                        <span>Update entity models</span>
                    </label>
                `,
                functions: () => {
                    for (const option in game.script.optimize) {
                        if (["background", "init"].indexOf(option) > -1) continue;
                        getId(option).addEventListener("change", ({target}) => {
                            game.script.optimize[option] = target.checked;
                        });
                    }
                }
            },
        },
        showAoe: {
            name: "AOE Map",
            description: "Shows the area of damage for all AOE towers.",
            more: null,
        },
        stashIndicators: {
            name: "Stash Indicators",
            description: "Shows useful borders Gold Stash-related.",
            more: null,
            onCallback: () => {
                const { indicators } = game.script.stashIndicators.currentIndicators;
                for (const indicator of indicators) indicator.setVisible(true);
            },
            offCallback: () => {
                const { indicators } = game.script.stashIndicators.currentIndicators;
                for (const indicator of indicators) indicator.setVisible(false);
            },
        },
        buildingLife: {
            name: "Building Lifetime",
            description: "Shows a heat map indicating buildings' lifespan.",
            more: {
                html: `
                    <strong>Limit the amount of towers to be indicated via heat map</strong>
                    <span>counting from most recently placed towers</span>
                    <div id="heat-range">
                        <input type="number" id="heat-min" min="0" value="0" disabled />
                        <input type="range" id="heat-slider" step="1" min="0" max="0" />
                        <input type="number" id="heat-max" min="0" value="0" disabled />
                    </div>
                    <div id="scene-alpha-range">
                        <input type="number" id="scene-alpha-val" value="0.5" disabled />
                        <input type="range" id="scene-alpha-slider" step="0.1" min="0" max="1" />
                    </div>
                `,
                functions: () => {
                    getId("heat-slider").addEventListener("input", ({target}) => {
                        game.script.buildingLife.startingIndex = target.valueAsNumber;
                        getId("heat-min").value = target.valueAsNumber;

                        clearTimeout(game.script.buildingLife.refreshTimeout);
                        game.script.buildingLife.refreshTimeout = setTimeout(() => {
                            game.script.buildingLife.refreshMap();
                            game.options.options.buildingLife && (
                                game.script.buildingLife.hideMap(),
                                game.script.buildingLife.showMap()
                            );
                        }, 50);
                    });
                    getId("scene-alpha-slider").addEventListener("input", ({target}) => {
                        getId("scene-alpha-val").value = target.valueAsNumber;
                        game.script.buildingLife.setSceneryAlpha(target.valueAsNumber);
                    });
                },
            },
            onCallback: () => { game.script.buildingLife.showMap(); },
            offCallback: () => { game.script.buildingLife.hideMap(); },
        },
        grouping: {
            name: "Grouping Grid",
            description: "Shows the grids of tower ranges' groups.",
            more: null,
            isToggle: false,
            customButtonText: "Cycle",
            callback: () => {
                game.script.grouping.cycleGrid();
            },
        },
        bossAlert: {
            name: "Boss Alert",
            description: "Alerts you before a boss wave.",
            more: null,
        },
    },
    page4: {
        autoGiveSell: {
            name: "Auto Give Sell",
            description: "Gives sell to every member, even new ones automatically.",
            more: null,
            onCallback: () => {
                // document.querySelector("#hud-menu-party > div.hud-party-members > div:nth-child(2) > div > a.hud-member-can-sell.btn")
                for (let member of game.ui.playerPartyMembers) {
                    game.network.sendRpc({name: "SetPartyMemberCanSell", uid: member.playerUid, canSell: 1});
                };
            },
        },
    },
};

const addFunctionToElem = ({ id, option, buttonText, colors, isToggle, isCheckBox, callback, onCallback, offCallback }) => {
    const options = game.options.options;
    colors ||= 'btn-red?btn-theme';

    if (isCheckBox) {
        getId(id).addEventListener('change', e => {
            if (options[option].multibox === false) {
                options[option].multibox = true;
                onCallback?.();
            } else {
                options[option].multibox = false;
                offCallback?.();
            };
        });
        return;
    };

    getId(id).addEventListener('click', e => {
        if (isToggle === false) {
            callback?.();
        } else {
            let toggleColor = colors.split('?');
            if (typeof options[option] == "object") {
                if (options[option].enabled === false) {
                    options[option].enabled = true;
                    toggleColor[1] && e.target.classList.remove(toggleColor[1]);
                    e.target.classList.add(toggleColor[0]);
                    buttonText === undefined || (e.target.innerText = `Disable ${buttonText}`);
                    onCallback?.();
                } else {
                    options[option].enabled = false;
                    e.target.classList.remove(toggleColor[0]);
                    toggleColor[1] && e.target.classList.add(toggleColor[1]);
                    buttonText === undefined || (e.target.innerText = `Enable ${buttonText}`);
                    offCallback?.();
                };
            } else {
                if (options[option] === false) {
                    options[option] = true;
                    toggleColor[1] && e.target.classList.remove(toggleColor[1]);
                    e.target.classList.add(toggleColor[0]);
                    buttonText === undefined || (e.target.innerText = `Disable ${buttonText}`);
                    onCallback?.();
                } else {
                    options[option] = false;
                    e.target.classList.remove(toggleColor[0]);
                    toggleColor[1] && e.target.classList.add(toggleColor[1]);
                    buttonText === undefined || (e.target.innerText = `Enable ${buttonText}`);
                    offCallback?.();
                }
            };
        };
    });
};

/* @GeneralFunctions + Enums */
const towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];
const allBossWaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];

function bindTooltip(elem, innerHTML, anchor = 'top') {
    elem.targetElem = elem;
    elem.anchor = anchor;
    elem.hide = function() { this.tooltipElem && (this.tooltipElem.remove(), delete this.tooltipElem); };
    elem.targetElem.addEventListener('mouseenter', function() {
        let toolTip = innerHTML;
        document.body.insertAdjacentHTML(`beforeend`, toolTip);
        this.tooltipElem = document.getElementById(`hud-tooltip`);

        let clientRect = this.targetElem.getBoundingClientRect();
        let position = {'left': 0, 'top': 0};
        switch(this.anchor) {
            case 'top':
                position.left = clientRect.left + clientRect.width / 0x2 - this.tooltipElem.offsetWidth / 0x2;
                position.top = clientRect.top - this.tooltipElem.offsetHeight - 0x14;
                break;
            case 'bottom':
                position.left = clientRect.left + clientRect.width / 0x2 - this.tooltipElem.offsetWidth / 0x2;
                position.top = clientRect.top + clientRect.height + 0x14;
                break;
            case 'left':
                position.left = clientRect.left - this.tooltipElem.offsetWidth - 0x14;
                position.top = clientRect.top + clientRect.height / 0x2 - this.tooltipElem.offsetHeight / 0x2;
                break;
            case 'right':
                position.left = clientRect.left + clientRect.width + 0x14;
                position.top = clientRect.top + clientRect.height / 0x2 - this.tooltipElem.offsetHeight / 0x2;
                break;
        }
        this.tooltipElem.className = `hud-tooltip hud-tooltip-` + this.anchor;
        this.tooltipElem.style.left = position.left + 'px';
        this.tooltipElem.style.top = position.top + 'px';
        this.tooltipElem.style.zIndex = "999";
    });
    elem.targetElem.addEventListener(`mouseleave`, elem.hide);
}

function inRange(pos, target, range) {
    return pos < target + range && pos > target - range;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function isPointInCircle(circle, point, radius) {
    if ((point.x - circle.x)**2 + (point.y - circle.y)**2 <= radius**2) return true;
    return false;
}

function genUUID() {
    if (crypto?.randomUUID) {
        return crypto.randomUUID();
    } else {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
            /[018]/g, c => (
                c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
            ).toString(16)
        );
    };
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
};

function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r, g, b];
    }
    return null;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    };
    return array;
}

function garbageGenerator(garbageLength = 25) {
    let garbageCharacters = localStorage.literallyEveryUnicodeEver;
    let garbage = "";
    for (let i = 0; i < garbageLength; i++) garbage += garbageCharacters[Math.floor(Math.random() * garbageCharacters.length)];
    return garbage;
}

function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e/-1e23)/-10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e/-1e20)/-10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e/-1e17)/-10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e/-1e14)/-10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e/-1e11)/-10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e/-1e8)/-10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e/-1e5)/-10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e/-1e2)/-10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e/1e2)/10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e/1e5)/10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e/1e8)/10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e/1e11)/10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e/1e14)/10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e/1e17)/10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e/1e20)/10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
}

const getClock = (_date) => {
    let date = _date || new Date(),
        d = date.getDate(),
        d1 = date.getDay(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        session = "PM";

    if (h == 2) h = 12;

    if (h < 13) session = "AM"
    if (h > 12) {
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

const measureDistance = (obj1, obj2) => {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return Math.abs((xDif**2) + (yDif**2));
};

const getEntityAtPos = (x, y, width = 1, height = 1) => {
    const cell = game.world.entityGrid.getCellIndexes(x, y, { width, height });
    return game.world.entityGrid.getEntitiesInCell(cell);
}

const isEntityOccupied = (x, y, width = 1, height = 1) => {
    const cell = game.world.entityGrid.getCellIndexes(x, y, { width, height });
    const entity = game.world.entityGrid.getEntitiesInCell(cell);
    return Object.keys(entity).length > 0;
}

const canAfford = (resources, costs, tier) => {
    const { gold, wood, stone } = resources;
    const goldCosts = costs.goldCosts[tier - 1];
    const stoneCosts = costs.stoneCosts[tier - 1];
    const woodCosts = costs.woodCosts[tier - 1];
    return !(gold < goldCosts || wood < woodCosts || stone < stoneCosts);
}

const predictDirection = (lastPos, currentPos, acc = 2) => {
    const anchors = {up: 0, down: 0, left: 0, right: 0};
    if (!lastPos || !currentPos) return anchors;
    if (acc > 100) acc = 100;
    // limitation might be position changes in the slightest
    // rounding numbers may help
    const xDelta = lastPos.x - currentPos.x;
    const yDelta = lastPos.y - currentPos.y;
    xDelta < -acc ? (anchors.right = 1) : xDelta > acc && (anchors.left = 1);
    yDelta < -acc ? (anchors.down = 1) : yDelta > acc && (anchors.up = 1);
    return anchors;
};

const moveTowards = (a, b, acc = 24) => {
    const packet = {down: 0, up: 0, left: 0, right: 0};

    if (a.y - b.y <= acc) packet.down = 1;
    if (-a.y + b.y <= acc) packet.up = 1;
    if (-a.x + b.x <= acc) packet.left = 1;
    if (a.x - b.x <= acc) packet.right = 1;

    return packet;
};

function getDistanceToCursor(cursorPos, wsPos) {
    if (wsPos) {
        const xDif = wsPos.x - cursorPos.x;
        const yDif = wsPos.y - cursorPos.y;
        return Math.abs((xDif**2) + (yDif**2));
    }
    return -1;
};

function getIsNextWaveActive() {
    let isNextWaveActive = false;
    const allComingBossWaves = allBossWaves.map(wave => wave - 1);
    for (let wave of allComingBossWaves) {
        isNextWaveActive = game.ui.playerTick.wave == wave;
    }
    return isNextWaveActive;
};

class EventEmitter extends EventTarget {
    constructor() {
        super();
        this._events = {};
    };
    on(event, callback, options) {
        this._events[event] ||= [];
        this._events[event].push(callback);
        this.addEventListener(event, ({detail: data}) => {
            callback(data);
        }, options);
    };
    once(event, callback) {
        this.on(event, callback, {once: true});
    };
    emit(event, data) {
        const Event = new CustomEvent(event, { detail: data });
        this.dispatchEvent(Event);
    };
};

/* @CustomFunctions */
game.options.options = {
    AHRC: {
        enabled: false,
        multibox: true,
    },
    wallBlock: false,
    rebuild: false,
    autoTrap: false,
    autoUpgrade: false,
    AULHT: false,
    autoBuild: false,
    dragBox: false,

    lockAim: false,
    movementCopy: false,
    spam: false,
    autoHeal: {
        enabled: true,
        multibox: true,
    },
    getRSS: false,
    autoBow: false,
    autoAim: false,
    autoRespawn: false,

    showAoe: false,
    stashIndicators: false,
    buildingLife: false,
    bossAlert: true,
    ssMode: false,

    autoGiveSell: false,

    spectate: false,
    navigator: false,
    XKey: false,
};

game.script = {
    AHRC: {
        handlers: [{type: "entityUpdate", names: "onTick"}],
        checkedHarvesters: new Set(),
        workingHarvesters: new Set(),
        excludedHarvesters: new Set(),
        onTick: function() {
            const options = game.options.options;
            if (options.AHRC.enabled) {
                for (let uid in game.world.entities) {
                    if (this.excludedHarvesters.has(parseInt(uid))) continue;
                    const entity = game.world.entities[uid];
                    if (entity.targetTick.model == "Harvester" && entity.targetTick.partyId == game.ui.playerPartyId && game.ui.playerTick.gold > 0.69) {
                        if (this.checkedHarvesters.has(uid)) {
                            if (entity.targetTick.stone != 0 || entity.targetTick.wood != 0) this.workingHarvesters.add(uid);
                        } else {
                            this.checkedHarvesters.add(uid);
                            game.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: parseInt(uid),
                                deposit: 0.69
                            });
                        };
                    };
                    if (this.workingHarvesters.has(uid)) {
                        if (entity.targetTick.stone >= entity.targetTick.harvestMax || entity.targetTick.wood >= entity.targetTick.harvestMax) continue;
                        const amount = entity.fromTick.tier * 0.05 - 0.02;
                        const ahrcOptions = getId('ahrcOptions');
                        ahrcOptions.value !== "c" && game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: amount});
                        ahrcOptions.value !== "h" && game.network.sendRpc({name: "CollectHarvester", uid: parseInt(uid)});
                    };
                };
            };
        },
    },
    wallBlock: {
        handlers: [{type: "packetFunc", names: ["sendRpc", "onSendRpc", 9]}, {type: "keybind", names: "keyup"}],
        wallElem: document.createElement("a"),
        typeOfDefense: "Wall",
        isEven: function(number) {
            return number % 2 === 0;
        },
        placeWallBlock: function(blockWidth, blockHeight, data, offset) {
            let offsetFromTarget,
                isOffsetUsed = !!offset;
            isOffsetUsed && (offsetFromTarget = 48 * offset);
            for (let x =
                 -((blockWidth -
                    (this.isEven(blockWidth) ? 0 : 1)) / 2) * 48;
                 x <= (blockWidth -
                       (this.isEven(blockWidth) ? 0 : 1)) / 2 * 48;
                 x += 48) {
                // if (isOffsetUsed && (Math.abs(x) <= offsetFromTarget)) continue;
                for (let y =
                     -((blockHeight -
                        (this.isEven(blockHeight) ? 0 : 1)) / 2) * 48;
                     y <= (blockHeight -
                           (this.isEven(blockHeight) ? 0 : 1)) / 2 * 48;
                     y += 48) {
                    if (isOffsetUsed && Math.abs(y) <= offsetFromTarget && Math.abs(x) <= offsetFromTarget) continue;
                    const posX = data.x + x,
                          posY = data.y + y,
                          shouldPlace = !isEntityOccupied(posX, posY);
                    shouldPlace && (x !== 0 || y !== 0) && game.network.sendPacket(9, {name: "MakeBuilding", type: this.typeOfDefense, x: posX, y: posY, yaw: 0});
                };
            };
        },
        onSendRpc: function(data) {
            if (data.name === "MakeBuilding" && data.type === this.typeOfDefense && game.options.options.wallBlock) {
                if (!game.script.rebuild.savedBase?.[data.type]?.[data.x]?.[data.y]) {
                    const blockWidth = parseInt(document.querySelector('#blockX').value);
                    const blockHeight = parseInt(document.querySelector('#blockY').value);
                    this.placeWallBlock(blockWidth, blockHeight, data);
                };
            };
        },
        keyup: function(e) {
            if (e.key == "!") getId("toggle-wallBlock").click();
        },
        init: function() {
            this.wallElem.classList.add("hud-buff-bar-item");
            this.wallElem.setAttribute("data-building", "Wall");
            this.wallElem.style.display = "none";
            this.wallElem.setAttribute("data-tier", `${getId("blockX").value}x${getId("blockY").value}`);
            document.getElementsByClassName("hud-buff-bar")[0].appendChild(this.wallElem);
        },
    },
    autoTrap: {
        handlers: [{type: "entityUpdate", names: "onEntityUpdate"}],
        onEntityUpdate: function() {
            if (game.options.options.diep) {
                for (let i of game.renderer.npcs.attachments) {
                    const criteria = document.querySelector("#autoTrapOptions").value == "pl" ? i.targetTick.partyId !== game.ui.playerPartyId : i.targetTick.uid !== game.world.myUid;
                    if (i.entityClass === "PlayerEntity" && criteria) {
                        if (isPointInCircle(i.targetTick.position, game.ui.playerTick.position, 500)) {
                            const position = i.targetTick.position;
                            const data = { x: Math.round(position.x / 24) * 24, y: Math.round(position.y / 24) * 24 };
                            game.script.wallBlock.placeWallBlock(7, 7, data, 1);
                        };
                    };
                };
            };
        },
    },
    rebuild: {
        handlers: [{type: "entityUpdate", names: "onEntityUpdate"}, {type: "rpc", names: ["LocalBuilding"]}, {type: "keybind", names: "keyup"}],
        goldStashTier: null,
        savedBase: {},
        toBeReplaced: {},
        toBeUpgraded: {},
        shouldRebuildToTier: null,
        LocalBuilding: function(buildings) {
            const options = game.options.options;
            const allBuildings = Object.values(Game.currentGame.ui.buildings);
            this.goldStashTier = game.ui.components.BuildingOverlay.getGoldStashTier();

            if (options.rebuild) {
                for (let i in buildings) {
                    const building = buildings[i];
                    if (building.dead === 1) {
                        // The building has died
                        if (this.savedBase[building.type]?.[building.x]?.[building.y]) {
                            this.toBeReplaced[building.type] ||= {};
                            this.toBeReplaced[building.type][building.x] ||= {};
                            this.toBeReplaced[building.type][building.x][building.y] = true;
                            delete this.toBeUpgraded[building.uid];
                        }
                    } else {
                        // The building was upgraded/placed
                        if (this.savedBase[building.type]?.[building.x]?.[building.y] !== undefined) {
                            if (typeof this.toBeUpgraded[building.uid] === "number" && this.toBeUpgraded[building.uid] <= 1) {
                                this.toBeUpgraded[building.uid] = false;
                            } else if (this.toBeUpgraded[building.uid] === undefined) {
                                if (this.shouldRebuildToTier !== null && this.savedBase[building.type][building.x][building.y] > this.shouldRebuildToTier) {
                                    this.toBeUpgraded[building.uid] = this.shouldRebuildToTier;
                                } else if (building.tier < this.savedBase[building.type][building.x][building.y]) {
                                    this.toBeUpgraded[building.uid] = this.savedBase[building.type][building.x][building.y];
                                };
                            };
                            delete this.toBeReplaced[building.type]?.[building.x]?.[building.y];
                        }
                    }
                }
            }
        },
        onEntityUpdate: function({ entities }) {
            const options = game.options.options;
            if (options.rebuild && this.goldStashTier) {
                for (let i in this.toBeReplaced) {
                    for (let x in this.toBeReplaced[i]) {
                        for (let y in this.toBeReplaced[i][x]) {
                            Game.currentGame.network.sendRpc({
                                name: "MakeBuilding",
                                type: i,
                                x: parseInt(x),
                                y: parseInt(y),
                                yaw: 0
                            });
                        }
                    }
                }
                for (let uid in this.toBeUpgraded) {
                    if (!(uid in entities)) {
                        delete this.toBeUpgraded[uid];
                        continue;
                    };
                    if (this.toBeUpgraded[uid] == false || this.toBeUpgraded[uid] <= 1) continue;
                    Game.currentGame.network.sendRpc({
                        name: "UpgradeBuilding",
                        uid: parseInt(uid)
                    });
                    this.toBeUpgraded[uid]--;
                };
            };
        },
        keyup: function(e) {
            if (e.key == ",") getId("toggle-rebuild").click();
        },
    },
    autoUpgrade: {
        handlers: [{type: "entityUpdate", names: "onEntityUpdate"}, {type: "rpc", names: ["LocalBuilding"]}, {type: "keybind", names: "keyup"}],
        autoUpgradeList: {},
        goldStashTier: null,
        LocalBuilding: function(buildings) {
            const options = game.options.options;
            this.goldStashTier = game.ui.components.BuildingOverlay.getGoldStashTier();
            if (options.autoUpgrade) {
                for (let i in buildings) {
                    const building = buildings[i];
                    if (building.dead !== 1) {
                        if (building.tier < 8) this.autoUpgradeList[building.uid] = true;
                        else delete this.autoUpgradeList[building.uid];
                    };
                };
            };
        },
        onEntityUpdate: function({entities}) {
            const options = game.options.options;
            if (options.autoUpgrade && this.goldStashTier) {
                let resourcesClone = {
                    wood: game.ui.playerTick.wood,
                    stone: game.ui.playerTick.stone,
                    gold: game.ui.playerTick.gold
                }

                for (let i in this.autoUpgradeList) {
                    const building = game.ui.buildings[i];
                    if (building?.type !== "GoldStash" && building?.tier >= this.goldStashTier) continue;
                    if (!(i in game.world.entities)) continue;

                    const costs = game.ui.buildingSchema[building.type];
                    if (canAfford(resourcesClone, costs, building.tier + 1)) {
                        resourcesClone.wood -= costs.woodCosts[building.tier];
                        resourcesClone.stone -= costs.stoneCosts[building.tier];
                        resourcesClone.gold -= costs.goldCosts[building.tier];

                        game.network.sendRpc({name: "UpgradeBuilding", uid: parseInt(i)});
                    }
                }
            }
        },
        keyup: function(e) {
            if (e.key == ".") getId("toggle-autoUpgrade").click();
        },
    },
    AULHT: {
        handlers: [{type: "entityUpdate", names: "onTick"}, {type: "rpc", names: ["LocalBuilding"]}],
        shouldHaveBeenUpgraded: {},
        LocalBuilding: function(buildings) {
            if (game.options.options.AULHT) {
                for (let i in buildings) {
                    const building = buildings[i];
                    if (building.dead === 0 && building.uid in this.shouldHaveBeenUpgraded) {
                        building.tier > this.shouldHaveBeenUpgraded[building.uid] && delete this.shouldHaveBeenUpgraded[building.uid];
                    }
                }
            }
        },
        onTick: function({entities}) {
            if (game.options.options.AULHT) {
                for (let uid in entities) {
                    const currentEntity = entities[uid];
                    const worldEntity = game.world.entities[uid];

                    if (currentEntity == true || worldEntity == undefined) continue;
                    if (uid in this.shouldHaveBeenUpgraded) continue;

                    if (uid in game.ui.buildings && typeof currentEntity.health == 'number') {
                        const buildingHealth = (currentEntity.health / worldEntity.targetTick.maxHealth) * 100;
                        if (buildingHealth <= 20 && worldEntity.targetTick.tier != game.ui.components.BuildingOverlay.getGoldStashTier()) {
                            game.network.sendRpc({name: "UpgradeBuilding", uid: parseInt(uid)});
                            this.shouldHaveBeenUpgraded[uid] = structuredClone(worldEntity.targetTick.tier);
                        };
                    };
                };
            };
        },
    },
    autoBuild: {
        handlers: [{type: "rpc", names: ["LocalBuilding"]}],
        defaultBase: '3,0,-96,0;3,-96,0,0;3,0,-192,0;3,-96,-240,0;3,-192,0,0;3,-240,-96,0;4,-336,-96,0;4,-432,-288,0;4,-96,-336,0;4,-288,-432,0;8,-192,-384,0;8,-384,-192,0;8,-288,-192,0;8,-192,-192,0;8,-192,-288,0;8,-288,-288,0;8,-384,-384,0;8,-96,-96,0;7,-288,0,0;7,-384,0,0;7,-432,-96,0;7,0,-288,0;7,0,-384,0;7,-96,-432,0;0,-168,-504,0;0,-216,-504,0;0,-264,-552,0;0,-312,-552,0;0,-312,-504,0;0,-504,-216,0;0,-504,-168,0;0,-552,-264,0;0,-552,-312,0;0,-504,-312,0;1,-360,-456,0;1,-456,-360,0;9,96,-96,0;9,-96,96,0;',
        LocalBuilding: function(buildings) {
            if (game.options.options.autoBuild) {
                for (let i in buildings) {
                    const building = buildings[i];
                    if (building.type == "GoldStash" && building.dead === 0) game.script.builder.buildBase(this.defaultBase);
                };
            };
        },
    },
    reconstruct: {
        HORIZONTAL_DELTA: 500,
        VERTICAL_DELTA: 1,

        isMapping: false,
        isMappingNow: false,

        currentMap: {},
        currentEntTowers: {},

        currentWidth: 2,
        currentlyMapping: null,

        buildNote: document.createElement('p'),
        entSettings: document.createElement('div'),

        pathWayIndicators: {},
        validCellsIndicators: {},

        currentBase: '',
        entranceGroups: {},
        entPriority: ["right", "bottom", "top", "left"],

        init: function() {
            this.buildNote.innerHTML = `Map out the entrance path by drag-clicking the right mouse button.<br>Press Esc to save the current configuration.`;
            this.buildNote.style.display = "none";
            this.buildNote.style.color = "white";
            this.buildNote.style.opacity = '0.5';
            this.buildNote.style.textAlign = "center";
            getClass('hud-top-center')[0].appendChild(this.buildNote);

            this.entSettings.id = "ent-settings";
            this.entSettings.innerHTML = `
                Anchor: <select id="current-side">
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                </select><br>
                Entrance span: <input id="ent-width" type="range" step="1" data-width="2 cells" value="2" min="2" max="8" /><br>

                <div id="ent-controls">
                    <button id="undo-ent"><i class="fa-solid fa-xmark"></i></button>
                    <button id="create-ent"><i class="fa-solid fa-check"></i></button>
                </div>
            `;
            this.entSettings.style.display = "none";
            getClass("hud")[0].appendChild(this.entSettings);

            document.addEventListener("keyup", (e) => {
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                    if (e.key == "Escape") {
                        if (this.isMapping) {
                            this.isMapping = false;
                            this.buildNote.style.display = "none";
                            game.renderer.follow(game.world.entities[game.world.myUid]);

                            this.currentMap = {};
                            this.currentEntTowers = {};

                            this.removeAllIndicators();
                            this.entSettings.style.display = "none";
                        };
                    };
                };
            });

            getId("current-side").addEventListener("select", ({target}) => {
                this.currentlyMapping = target.value;
            });
            getId("ent-width").addEventListener("input", ({target}) => {
                target.setAttribute("data-width", target.value + ` cells`);
                this.currentWidth = target.valueAsNumber;
                this.updateEntranceTowers();
            });
            getId("undo-ent").addEventListener("click", ({target}) => {
                this.currentMap = {};
                this.currentEntTowers = {};

                this.removeAllIndicators();
                this.entSettings.style.display = "none";
            });
            getId("create-ent").addEventListener("click", ({target}) => {
                this.entranceGroups[this.currentlyMapping] = Object.values(this.currentEntTowers).map(({x, y, type, yaw}) => {
                    return `${type},${x},${y},${yaw};`;
                }).join("");

                this.currentMap = {};
                this.currentEntTowers = {};
                for (const validCellIndex in this.validCellsIndicators) {
                    game.renderer.npcs.removeAttachment(this.validCellsIndicators[validCellIndex]);
                    delete this.validCellsIndicators[validCellIndex];
                };
                this.entSettings.style.display = "none";
            });

            game.network.addRpcHandler("LocalBuilding", this.onLocalBuilding.bind(this));
            getId("hud").addEventListener("mousedown", this.onMouseDown.bind(this));
            getId("hud").addEventListener("mousemove", this.onMouseMove.bind(this));
            getId("hud").addEventListener("mouseup", this.onMouseUp.bind(this));
        },
        reconstructBaseByPriority: function() {
            for (const side of this.entPriority) {
                game.script.builder.buildBase(this.entranceGroups[side]);
            };

        },
        removeAllIndicators: function() {
            for (const cellIndex in this.currentMap) {
                game.renderer.npcs.removeAttachment(this.pathWayIndicators[cellIndex]);
                delete this.pathWayIndicators[cellIndex];
            };
            for (const validCellIndex in this.validCellsIndicators) {
                game.renderer.npcs.removeAttachment(this.validCellsIndicators[validCellIndex]);
                delete this.validCellsIndicators[validCellIndex];
            };
        },
        getNonEntTowers: function() {
            const map = {};
            for (let x = this.goldStash.x - 12 * 48; x < this.goldStash.x + 12 * 48; x++) {
                for (let y = this.goldStash.y - 12 * 48; y < this.goldStash.y + 12 * 48; y++) {
                    map[x] ||= {};
                    map[x][y] = false;
                };
            };
            for (const relativePos of Object.values(this.currentMap)) {
                map[this.goldStash.x - relativePos.x][this.goldStash.y - relativePos.y] = true;
            };

            // <tab>

            const movementsX = [1, 0, -1, 0];
            const movementsY = [0, 1, 0, -1];


            let yourFuckinAnswer = [];

            for (let XxX = this.goldStash.x - 12 * 48; XxX < this.goldStash.x + 12 * 48; XxX++) {
                for (let YyY = this.goldStash.y - 12 * 48; YyY < this.goldStash.y + 12 * 48; YyY++) {
                    if (map[XxX][YyY]) continue;

                    let newAnswer = [];

                    let queueX = [];
                    let queueY = [];

                    queueX.push(XxX);
                    queueY.push(YyY);
                    map[XxX][YyY] = true;

                    while (queueX.length != 0) {
                        let x = queueX.shift();
                        let y = queueY.shift();

                        newAnswer.push({x, y});

                        for (let i = 0; i < 4; i++) {
                            let newX = x + movementsX[i];
                            let newY = y + movementsY[i];

                            if (map[newX][newY]) continue;
                            if (newX < this.goldStash.x - 12 * 48 || newX >= this.goldStash.x + 12 * 48) continue;
                            if (newY < this.goldStash.y - 12 * 48 || newY >= this.goldStash.y + 12 * 48) continue;

                            map[newX][newY] = true;

                            queueX.push(newX);
                            queueY.push(newY);
                        }
                    }

                    yourFuckinAnswer.push(newAnswer);
                }
            }
            console.log(yourFuckinAnswer);
            // </tab>

        },
        updateEntranceTowers: function() {
            for (const validCellIndex in this.validCellsIndicators) {
                game.renderer.npcs.removeAttachment(this.validCellsIndicators[validCellIndex]);
                delete this.validCellsIndicators[validCellIndex];
            };
            this.currentEntTowers = {};

            for (let cellIndex in this.currentMap) {
                cellIndex = parseInt(cellIndex);
                for (let CIx = cellIndex - this.HORIZONTAL_DELTA * this.currentWidth; CIx <= cellIndex + this.HORIZONTAL_DELTA * this.currentWidth; CIx += this.HORIZONTAL_DELTA) {
                    if (CIx < 0 || CIx > this.HORIZONTAL_DELTA ** 2) continue;
                    for (let CIy = CIx - this.VERTICAL_DELTA * this.currentWidth; CIy <= CIx + this.VERTICAL_DELTA * this.currentWidth; CIy += this.VERTICAL_DELTA) {
                        if (CIy < 0 || CIy > this.HORIZONTAL_DELTA ** 2) continue;
                        if (!(CIy in this.currentMap)) this.validCellsIndicators[CIy] = null;
                    };
                };
            };
            for (const validCellIndex in this.validCellsIndicators) {
                const entities = game.world.entityGrid.getEntitiesInCell(validCellIndex);
                if (this.validCellsIndicators[validCellIndex] !== null) continue;
                for (const uid in entities) {
                    const building = game.ui.buildings[uid];
                    if (!building || building.dead === 1) continue;

                    this.currentEntTowers[uid] = {
                        type: towerCodes.indexOf(building.type),
                        x: this.goldStash.x - building.x,
                        y: this.goldStash.y - building.y,
                        yaw: game.world.entities[building.uid]?.targetTick?.yaw
                    };

                    const buildingSchema = game.ui.buildingSchema[building.type];
                    const buildingSize = buildingSchema.gridWidth * 48;

                    const indicator = game.assetManager.models.rangeIndicatorModel({
                        width: buildingSize,
                        height: buildingSize,
                    }, {r: 111, g: 208, b: 247}, {r: 111, g: 208, b: 247}, 0);
                    indicator.setPosition(building.x, building.y);

                    this.validCellsIndicators[validCellIndex] = indicator;
                    game.renderer.npcs.addAttachment(indicator);
                };
                this.validCellsIndicators[validCellIndex] === null && delete this.validCellsIndicators[validCellIndex];
            };
            console.log(this.validCellsIndicators);
        },
        startReconstruction: function() {
            if (!this.goldStash) return;

            game.ui.components.MenuParty.hide();
            game.ui.components.MenuShop.hide();
            game.ui.components.MenuSettings.hide();

            this.isMapping = true;
            this.buildNote.style.display = "block";
            this.currentBase = game.script.builder.recordBase(false);
            game.renderer.follow(game.world.entities[this.goldStash.uid]);
        },
        onLocalBuilding: function(buildings) {
            for (const building of buildings) {
                if (building.type == "GoldStash") {
                    this.goldStash = building.dead === 0 ? building : null;
                };
            };
        },
        onMouseDown: function(e) {
            if (!this.isMapping || e.button !== 2) return;
            if (!e.repeat) {
                console.log('a');
                this.currentMap = {};
                this.isMappingNow = true;
            };
        },
        onMouseMove: function(e) {
            if (!this.isMappingNow) return;

            const absolutePos = game.renderer.screenToWorld(e.clientX, e.clientY);
            const cellBeneath = game.world.entityGrid.getCellIndexes(absolutePos.x, absolutePos.y, {width: 1, height: 1})[0];

            const cellCoordByCells = game.world.entityGrid.getCellCoords(cellBeneath);
            const cellCoordsByAbsPos = {x: cellCoordByCells.x * 48, y: cellCoordByCells.y * 48};

            this.currentMap[cellBeneath] = {
                x: this.goldStash.x - cellCoordsByAbsPos.x,
                y: this.goldStash.y - cellCoordsByAbsPos.y,
            };

            if (!this.pathWayIndicators[cellBeneath]) {
                console.log(cellBeneath, cellCoordByCells, cellCoordsByAbsPos);
                const indicator = game.assetManager.models.rangeIndicatorModel({
                    width: 48,
                    height: 48,
                }, {r: 255, g: 0, b: 0}, {r: 255, g: 0, b: 0}, 0);

                indicator.setPosition(cellCoordsByAbsPos.x + 24, cellCoordsByAbsPos.y + 24);
                game.renderer.npcs.addAttachment(indicator);
                this.pathWayIndicators[cellBeneath] = indicator;
            };
        },
        onMouseUp: function(e) {
            if (!this.isMappingNow) return;
            this.isMappingNow = false;

            this.entSettings.style.display = "block";
            this.entSettings.style.left = e.clientX + "px";
            this.entSettings.style.top = e.clientY + "px";

            this.updateEntranceTowers();
        },
    },
    autoHeal: {
        init: function() {
            Game.currentGame.ui._events.playerPetTickUpdate.push(pet => this.petTickUpdate.onTick(pet));
            game.ui._events.playerTickUpdate.push(player => this.playerTickUpdate.onTick(player));
        },
        playerTickUpdate: {
            hasEquipedPotion: false,
            lastTickHealth: 100,
            onTick: function(player) {
                const options = game.options.options;

                if (options.autoHeal) {
                    if (!game.ui.inventory.HealthPotion && player.gold >= 100) {
                        Game.currentGame.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1});
                    };
                    const playerHealth = (player.health / player.maxHealth) * 100;
                    this.hasEquipedPotion = (this.lastTickHealth <= playerHealth);
                    const healThreshold = getId("auto-heal-threshold").valueAsNumber || 15;
                    if (playerHealth <= healThreshold && !this.hasEquipedPotion) {
                        Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1});
                    };
                    this.lastTickHealth = playerHealth;
                };
            },
        },
        petTickUpdate: {
            buyItem: (itemName, tier = 1) => Game.currentGame.network.sendRpc({name: "BuyItem", itemName, tier}),
            equipItem: (itemName, tier = 1) => Game.currentGame.network.sendRpc({name: "EquipItem", itemName, tier}),
            petLevelEnum: [8, 16, 24, 32, 48, 64, 96],
            petTokenEnum: [100, 100, 100, 100, 200, 200, 300, Infinity],
            onTick: function(pet) {
                const options = game.options.options;
                if (options.autoHeal) {
                    if (pet.health <= 0) {
                        this.buyItem("PetRevive");
                        this.equipItem("PetRevive");
                    }
                    let petHealth = (pet.health / pet.maxHealth) * 100;
                    const healThreshold = getId("auto-heal-threshold").valueAsNumber || 15;
                    if (petHealth <= healThreshold) {
                        this.buyItem('PetHealthPotion');
                        this.equipItem("PetHealthPotion");
                    }
                };
                this.petLevelEnum.indexOf(game.ui.components.MenuShop.shopItems[pet.model].level) > -1 && (
                    game.ui.playerTick.token >= this.petTokenEnum[pet.tier - 1] && this.buyItem(pet.model, pet.tier + 1)
                );
            },
        },
    },
    spam: {
        randomSpamText: [
            `?verify`,
            "hi",
            "ez",
            "Super Idol的笑容都没你的甜八月正午的阳光都没你耀眼热爱 105 °C的你滴滴清纯的蒸馏水",
            "Zǎoshang hǎo zhōngguó xiànzài wǒ yǒu BING CHILLING 🥶🍦",
            "Wǒ hěn xǐhuān BING CHILLING 🥶🍦 Dànshì sùdù yǔ jīqíng 9 bǐ BING CHILLING 🥶🍦",
            "<img src='https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/EohccRVVoAAMjiu%20copy.png?v=1717428846048'>"
        ],
        spamInterval: null,
        spamText: '',
        fetchUnicode: async function() {
            if (!localStorage.literallyEveryUnicodeEver) {
                localStorage.literallyEveryUnicodeEver = await fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')
                    .then(response => response.text());
                this.randomSpamText.push(`${garbageGenerator()} BIG RAID ${garbageGenerator()}`);
            }
        },
        onchange: function({target}) {
            this.spamText = target.value;
        },
        start: function() {
            this.spamInterval = setInterval(() => {
                let text;
                if (this.spamText !== '') text = `${garbageGenerator()} ${this.spamText} ${garbageGenerator()}`;
                else text = getRandomItem(this.randomSpamText);
                game.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: text
                });
            }, 1050);
        },
        stop: function() {
            clearInterval(this.spamInterval);
        },
        init: function() {
            this.fetchUnicode();
        },
    },
    autoBow: {
        handlers: [{type: "entityUpdate", names: "onEntityUpdate"}, {type: "keybind", names: "keyup"}],
        onEntityUpdate: function() {
            if (game.options.options.autoBow) {
                game.network.sendInput({space: 0});
                game.network.sendInput({space: 1});
            };
        },
        keyup: function(e) {
            if (e.key == "=" && game.world.inWorld) {
                if (game.ui.inventory.Bow) {
                    game.options.options.autoBow = !game.options.options.autoBow;
                    game.options.options.autoBow && game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: game.ui.inventory.Bow.tier});
                } else if (game.ui.playerTick.gold > 100) {
                    game.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1});
                };
            }
        },
    },
    autoAim: {
        handlers: [{type: "entityUpdate", names: "onEntityUpdate"}],
        aimTarget: "player",
        targets: [],
        init: function() {
            getId("autoAimOptions").addEventListener("change", ({target}) => {
                this.aimTarget = target.value;
            });
        },
        onEntityUpdate: function() {
            const options = game.options.options;
            if (options.autoAim) {
                this.targets = [];
                const entities = game.renderer.npcs.attachments;

                for (let entity of entities) {
                    switch(this.aimTarget) {
                        case "player":
                            if (entity.fromTick.model == "GamePlayer" && entity.targetTick.partyId !== game.ui.playerPartyId && entity.fromTick.dead == 0) {
                                this.targets.push(entity.fromTick);
                            };
                            break;
                        case "zombie":
                            if (entity.fromTick.model !== "NeutralTier1" && entity.fromTick.entityClass == "Npc") {
                                this.targets.push(entity.fromTick);
                            };
                            break;
                        case "zom/dem":
                            if (entity.fromTick.entityClass == "Npc") {
                                this.targets.push(entity.fromTick);
                            };
                            break;
                        default:
                            if (entity.fromTick.uid !== game.world.myUid) {
                                this.targets.push(entity.fromTick);
                            };
                    };
                };

                if (this.targets.length > 0) {
                    const myPos = game.ui.playerTick.position;
                    this.targets.sort((a, b) => {
                        const distThisToA = measureDistance(myPos, a.position);
                        const distThisToB = measureDistance(myPos, b.position);

                        if (distThisToA < distThisToB) return -1;
                        else if (distThisToA > distThisToB) return 1;

                        return 0;
                    });

                    const target = this.targets[0];
                    const clientPos = game.renderer.worldToScreen(target.position.x, target.position.y);
                    game.inputManager.onMouseMoved({clientX: clientPos.x, clientY: clientPos.y});
                }
            };
        }
    },
    autoRespawn: {
        handlers: [{type: "rpc", names: ["Dead"]}],
        Dead: function() {
            if (!game.options.options.autoRespawn) return;
            document.querySelector("#hud-respawn > div > div > div > button:nth-child(3)").click();
        },
    },
    getRSS: {
        handlers: [{type: "entityUpdate", names: "onTick"}, {type: "keybind", names: ["keyup", "mousemove"]}, {type: "rpc", names: ["DayCycle"]}],
        dayTickData: null,
        scoreData: {},

        lastHoveredPlayers: {},
        allowedRSS: true,
        assignOldTick: function(player, playerTick) {
            const [wood_1, stone_1, gold_1, token_1, px_1, py_1, info] = playerTick;
            player.targetTick.oldWood = wood_1;
            player.targetTick.oldStone = stone_1;
            player.targetTick.oldGold = gold_1;
            player.targetTick.oldToken = token_1;
            player.targetTick.oldPX = px_1;
            player.targetTick.oldPY = py_1;
            player.targetTick.info = info;
            player.targetTick.name = player.targetTick.info;
        },
        highlightColor: function(uid, rgb) {
            // const hr = hexToRgb(hex);
            game.world.entities[uid].currentModel.nameEntity.setColor(111, 208, 247);
        },
        resetColor: function(uid) {
            game.world.entities[uid].currentModel.nameEntity.setColor(220, 220, 220);
        },
        DayCycle: function(e) {
            this.dayTickData = e;
            if (!game.ui.playerTick) return;
            if (game.ui.playerTick.wave == 0) return;
            for (const player of game.ui.playerPartyMembers) {
                if (!e.isDay) {
                    const { playerUid } = player;
                    const playerTick = game.world.entities[playerUid].targetTick;
                    this.scoreData[playerUid] ||= {
                        spw: 0,
                        lastWaveScore: playerTick.score,
                    };
                    this.scoreData[playerUid].spw = playerTick.score - this.scoreData[playerUid].lastWaveScore;
                    this.scoreData[playerUid].lastWaveScore = playerTick.score;
                };
            };
            for (const uid in this.scoreData) {
                game.ui.playerPartyMembers.findIndex(e => e.playerUid == uid) == -1 && delete this.scoreData[uid];
            };
        },
        onTick: function() {
            const options = game.options.options;
            if (options.getRSS) !this.allowedRSS && (this.allowedRSS = true);
            if (options.getRSS || this.allowedRSS) {
                // game.debug.allEntities = [];
                for (let player of game.renderer.npcs.attachments) {
                    if (!!player.fromTick.name) {
                        let wood_1 = counter(player.targetTick.wood);
                        let stone_1 = counter(player.targetTick.stone);
                        let gold_1 = counter(player.targetTick.gold);
                        let token_1 = counter(player.targetTick.token);
                        let px_1 = counter(player.targetTick.position.x);
                        let py_1 = counter(player.targetTick.position.y);
                        let timeout_1 = player.targetTick.isPaused ? "On Timeout" : "";
                        if (options.getRSS && !player.targetTick.oldName) {
                            player.targetTick.oldName = player.targetTick.name;
                            let info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
  ${(player.targetTick.uid in this.scoreData) ? `SPW: ${this.scoreData[player.targetTick.uid].spw.toLocaleString()}` : ""}
                    ${timeout_1}





`;
                            this.assignOldTick(player, [wood_1, stone_1, gold_1, token_1, px_1, py_1, info]);
                        }
                        if (!options.getRSS && player.targetTick.oldName) {
                            player.targetTick.info = player.targetTick.oldName;
                            player.targetTick.name = player.targetTick.info;
                            player.targetTick.oldName = null;
                        }
                        if (options.getRSS) {
                            if (player.targetTick.oldGold !== gold_1
                                || player.targetTick.oldWood !== wood_1
                                || player.targetTick.oldStone !== stone_1
                                || player.targetTick.oldToken !== token_1
                                || player.targetTick.oldPX !== px_1
                                || player.targetTick.oldPY !== py_1) {
                                let info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
  ${(player.targetTick.uid in this.scoreData) ? `SPW: ${this.scoreData[player.targetTick.uid].spw.toLocaleString()}` : ""}
                    ${timeout_1}





`;
                                this.assignOldTick(player, [wood_1, stone_1, gold_1, token_1, px_1, py_1, info]);
                            }
                        }
                    }
                }
            }
            if (!options.getRSS) this.allowedRSS = false;
        },
        mousemove: function(e) {
            if (!game.options.options.getRSS) return;
            const worldPos = game.renderer.screenToWorld(e.clientX, e.clientY);
            const entitiesUnderMouse = getEntityAtPos(worldPos.x, worldPos.y);
            for (const uid in this.lastHoveredPlayers) {
                if (!(uid in entitiesUnderMouse)) {
                    uid in game.world.entities && this.resetColor(uid);
                    delete this.lastHoveredPlayers[uid];
                }
            }
            for (const uid in entitiesUnderMouse) {
                if (game.world.entities[uid].targetTick.name && !(uid in this.lastHoveredPlayers)) {
                    this.lastHoveredPlayers[uid] = true;
                    this.highlightColor(uid);
                }
            }
        },
        keyup: function(e) {
            if (e.key == "-") game.options.options.getRSS = !game.options.options.getRSS;
        },
    },
    showAoe: {
        modelIndicatorsPool: {},
        projectileEnums: {
            "CannonProjectile": {
                parent: 'CannonTower',
                innerRGB: {r: 60, g: 188, b: 92},
                borderRGB: {r: 58, g: 170, b: 86},
                aoe: 250,
            },
            "BombProjectile": {
                parent: 'BombTower',
                innerRGB: {r: 0xd8, g: 0x0, b: 0x27},
                borderRGB: {r: 0xd8, g: 0x4d, b: 0x5c},
                aoe: 250,
            },
            "FireballProjectile": {
                parent: "MagicTower",
                innerRGB: {r: 73, g: 178, b: 204},
                borderRGB: {r: 48, g: 130, b: 150},
                aoe: 100
            }
        },
        init: function() {
            const poolSize = 50;
            for (let modelName in this.projectileEnums) {
                this.modelIndicatorsPool[modelName] = [];
                for (let i = 0; i < poolSize; i++) {
                    const {innerRGB, borderRGB, aoe, parent} = this.projectileEnums[modelName];
                    const aoeIndicator = game.assetManager.models.rangeIndicatorModel({
                        isCircular: true,
                        radius: aoe,
                    }, innerRGB, borderRGB);
                    aoeIndicator.setVisible(true);
                    this.modelIndicatorsPool[modelName].push(aoeIndicator);
                }
            }
        },
        onEntityRemoved: function(t) {
            if (game.options.options.showAoe) {
                const entityTick = game.world.entities[t].targetTick;
                if (entityTick.model in this.projectileEnums) {
                    const { msBetweenFiresTiers, lifetimeTiers } = game.ui.buildingSchema[this.projectileEnums[entityTick.model].parent];
                    let aoeIndicator;
                    if (this.modelIndicatorsPool[entityTick.model].length > 0) {
                        aoeIndicator = this.modelIndicatorsPool[entityTick.model].shift();
                    } else {
                        const {innerRGB, borderRGB, aoe, parent} = this.projectileEnums[entityTick.model];
                        aoeIndicator = game.assetManager.models.rangeIndicatorModel({
                            isCircular: true,
                            radius: aoe,
                        }, innerRGB, borderRGB);
                        aoeIndicator.setVisible(true);
                    }
                    aoeIndicator.setPosition(entityTick.position.x, entityTick.position.y);
                    game.renderer.ground.addAttachment(aoeIndicator);

                    setTimeout(() => {
                        game.renderer.ground.removeAttachment(aoeIndicator);
                        this.modelIndicatorsPool[entityTick.model].push(aoeIndicator);
                    }, msBetweenFiresTiers[7]);
                }
            }
        },
    },
    stashIndicators: {
        BUILDING_DISTANCE: 864,
        MIN_STASH_DISTANCE: 2496,
        ZOMBIE_SPAWN_RANGE: 48 * Math.sqrt(2 * (18 ** 2)),
        currentIndicators: {
            uid: null,
            indicators: [],
        },
        onEntityCreated: function(t) {
            if (t.model == "GoldStash") {
                if (this.currentIndicators.uid == t.uid) return;

                for (const indicator of this.currentIndicators.indicators) game.renderer.ground.removeAttachment(indicator);

                const buildLimitIndicator = game.assetManager.models.rangeIndicatorModel({
                    width: this.BUILDING_DISTANCE * 2,
                    height: this.BUILDING_DISTANCE * 2,
                }, null, {r: 0xee, g: 0xee, b: 0xee}, 12);
                buildLimitIndicator.setVisible(game.options.options.stashIndicators);
                buildLimitIndicator.setPosition(t.position.x, t.position.y);
                game.renderer.ground.addAttachment(buildLimitIndicator);

                const stashLimitIndicator = game.assetManager.models.rangeIndicatorModel({
                    width: this.MIN_STASH_DISTANCE * 2,
                    height: this.MIN_STASH_DISTANCE * 2,
                }, null, {r: 0xee, g: 0xee, b: 0xee}, 12);
                stashLimitIndicator.setVisible(game.options.options.stashIndicators);
                stashLimitIndicator.setPosition(t.position.x, t.position.y);
                game.renderer.ground.addAttachment(stashLimitIndicator);

                const zombieSpawnIndicator = game.assetManager.models.rangeIndicatorModel({
                    isCircular: true,
                    radius: this.ZOMBIE_SPAWN_RANGE,
                }, {r: 0xff, g: 0xff, b: 0xff}, {r: 0xee, g: 0xee, b: 0xee});
                zombieSpawnIndicator.setVisible(game.options.options.stashIndicators);
                zombieSpawnIndicator.setPosition(t.position.x, t.position.y);
                game.renderer.ground.addAttachment(zombieSpawnIndicator);

                this.currentIndicators = {
                    uid: t.uid,
                    indicators: [buildLimitIndicator, stashLimitIndicator, zombieSpawnIndicator],
                };
            }
        },
    },
    grouping: {
        loadedGrid: false,
        displays: ["none", "blue", "purple"],
        currentlyDisplaying: "none",
        init: function() {
            game.network.addEnterWorldHandler(() => {
                if (this.loadedGrid) return;
                this.makeGrid();
            });
            document.addEventListener("keyup", function(e) {
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                    if (e.key == "v") getId("Grouping Grid").click();
                };
            });
        },
        makeGrid: function(width, height) {
            this.loadedGrid = true;
            const blueCell = game.assetManager.models.rangeIndicatorModel({
                width: 196,
                height: 196,
            }, null, {r: 111, g: 208, b: 247}, 4);

            const purpleCell = game.assetManager.models.rangeIndicatorModel({
                width: 196,
                height: 196,
            }, null, {r: 213, g: 118, b: 211}, 4);

            this.blueGrid = new game.renderer.spriteType(blueCell.goldRegion.getTexture(), true);
            this.blueGrid.setDimensions(0, 0, 24000, 24000);
            this.blueGrid.setAnchor(0, 0);
            this.blueGrid.setAlpha(1.5);
            this.blueGrid.setVisible(this.currentlyDisplaying == "blue");

            this.purpleGrid = new game.renderer.spriteType(purpleCell.goldRegion.getTexture(), true);
            this.purpleGrid.setDimensions(48, 48, 23952, 23952);
            this.purpleGrid.setAnchor(0, 0);
            this.purpleGrid.setAlpha(1.75);
            this.purpleGrid.setVisible(this.currentlyDisplaying == "purple");

            game.renderer.ground.addAttachment(this.blueGrid);
            game.renderer.ground.addAttachment(this.purpleGrid);
        },
        refreshGrid: function() {
            this.blueGrid.setVisible(this.currentlyDisplaying == "blue");
            this.purpleGrid.setVisible(this.currentlyDisplaying == "purple");
        },
        cycleGrid: function() {
            this.currentlyDisplaying = this.displays[(this.displays.indexOf(this.currentlyDisplaying) + 1) % 3];
            this.refreshGrid();
        },
    },
    buildingLife: {
        handlers: [{type: "rpc", names: ["LocalBuilding"]}],

        MAX_ALPHA: 5,

        buildingWeights: {},
        indicators: [],
        sceneryAlpha: 0.5,

        startingIndex: 0,
        refreshTimeout: null,

        LocalBuilding: function(buildings) {
            for (let building of buildings) {
                if (building.dead === 1) {
                    building.uid in this.buildingWeights && delete this.buildingWeights[building.uid];
                } else {
                    if (building.uid in this.buildingWeights) continue;
                    this.buildingWeights[building.uid] = null;
                };
            };
            getId("heat-slider").max = Object.keys(this.buildingWeights).length - 1;
            getId("heat-max").value = Object.keys(this.buildingWeights).length;

            this.refreshMap();
        },
        refreshMap: function() {
            const sortedUids = Object.keys(this.buildingWeights).sort((a, b) => a - b);
            const gap = this.MAX_ALPHA / (sortedUids.length - this.startingIndex);

            let i = 0,
                _i = -1;
            for (let uid of sortedUids) {
                _i++;
                if (_i < this.startingIndex) {
                    this.buildingWeights[uid] = null;
                    continue;
                } else if (_i == this.startingIndex) i = 0;

                this.buildingWeights[uid] = gap * i++;
            };
        },
        setSceneryAlpha: function(alpha) {
            this.sceneryAlpha = alpha;
            game.options.options.buildingLife && game.renderer.scenery.setAlpha(this.sceneryAlpha);
        },
        showMap: function() {
            for (let uid in this.buildingWeights) {
                if (this.buildingWeights[uid] === null) {
                    const entity = game.renderer.scenery.attachments.find(e => e.uid == uid);
                    entity?.setAlpha?.(0);
                    continue;
                };
                const building = game.ui.buildings[uid];
                if (!building || building.dead === 1) continue;

                const buildingSchema = game.ui.buildingSchema[building.type];
                const buildingSize = buildingSchema.gridWidth * 48;

                const indicator = game.assetManager.models.rangeIndicatorModel({
                    width: buildingSize,
                    height: buildingSize,
                }, {r: 255, g: 0, b: 0}, {r: 255, g: 0, b: 0}, 0);
                indicator.setAlpha(this.MAX_ALPHA - this.buildingWeights[uid]);
                indicator.setPosition(building.x, building.y);

                this.indicators.push(indicator);
                game.renderer.npcs.addAttachment(indicator);
            };
            game.renderer.scenery.setAlpha(this.sceneryAlpha);
        },
        hideMap: function() {
            for (const indicator of this.indicators) game.renderer.npcs.removeAttachment(indicator);
            for (const entities of game.renderer.scenery.attachments) entities.setAlpha(1);
            game.renderer.scenery.setAlpha(1);
        },
    },
    bossAlert: {
        handlers: [{type: "rpc", names: ["DayCycle"]}],
        init: function() {
            this.bossAlert = document.createElement('p');
            this.bossAlert.innerHTML = `<i class="fa fa-exclamation-triangle"></i> Boss wave incoming`;
            this.bossAlert.style.display = "none";
            this.bossAlert.style.color = "white";
            this.bossAlert.style.opacity = '0.5';
            getClass('hud-top-center')[0].appendChild(this.bossAlert);
        },
        DayCycle: function(e) {
            if (!game.ui.playerTick) return;
            if (e.isDay) this.bossAlert.style.display = (getIsNextWaveActive() && game.options.options.bossAlert) ? "block" : "none";
        },
    },
    ssMode: {
        handlers: [{type: "keybind", names: "keyup"}],
        keyup: function(e) {
            if (e.key == "?") this.toggle();
        },
        toggle: function() {
            game.options.options.ssMode = !game.options.options.ssMode;
            document.querySelector("#hud").style.display = document.querySelector("#hud").style.display == "none" ? "block" : "none";
        },
    },
    lockAim: {
        handlers: [{type: "keybind", names: "keyup"}],
        init: function() {
            game.inputManager._emit = game.inputManager.emit;
            game.inputManager.emit = function(...args) {
                if (args[0].indexOf("mouse") > -1 && game.options.options.lockAim) return;
                return this._emit(...args);
            };
        },
        keyup: function(e) {
            if (e.key == "u") game.options.options.lockAim = !game.options.options.lockAim;
        },
    },
    autoGiveSell: {
        handlers: [{type: "rpc", names: ["PartyInfo"]}],
        PartyInfo: function(e) {
            if (game.options.options.autoGiveSell) {
                game.network.emitter.once("PACKET_ENTITY_UPDATE", () => {
                    for (let member of e) {
                        console.log(member);
                        game.network.sendRpc({name: "SetPartyMemberCanSell", uid: member.playerUid, canSell: 1});
                    };
                });
            };
        },
    },
    /* @Rebinds */
    sell: {
        sellAllByType: function(type) {
            if (!game.ui.playerPartyCanSell) return;
            let lastSoldBuilding = null;
            let allBuildings = [Infinity, ...Object.values(game.ui.buildings).filter(e => e.type == type)];
            let sellInterval = () => {
                if (!game.ui.buildings[lastSoldBuilding?.uid]) allBuildings.shift();
                if (window.sellBreak || allBuildings.length == 0) return;
                const target = allBuildings[0];
                if (target !== undefined && !game.ui.buildings[target]?.dead) {
                    lastSoldBuilding = target;
                    Game.currentGame.network.sendRpc({
                        name: "DeleteBuilding",
                        uid: parseInt(target.uid)
                    });
                    setTimeout(sellInterval, 50);
                };
            };
            sellInterval();
        },
        sellAllWithUids: function(uids) {
            if (!game.ui.playerPartyCanSell) return;
            let lastSoldBuilding = null;

            uids = uids.filter(e => game.ui.buildings[e]?.type !== "GoldStash");
            let allBuildings = [Infinity, ...uids];

            let sellInterval = () => {
                if (!game.ui.buildings[lastSoldBuilding]) allBuildings.shift();
                if (window.sellBreak || allBuildings.length == 0) return;
                const target = allBuildings[0];
                if (target !== undefined && !game.ui.buildings[target]?.dead) {
                    lastSoldBuilding = target;
                    Game.currentGame.network.sendRpc({
                        name: "DeleteBuilding",
                        uid: parseInt(target)
                    });
                    setTimeout(sellInterval, 50);
                };
            };
            sellInterval();
        },
        sellAll: function() {
            this.isSellingAll = true;
            const sellInterval = () => {
                if (window.sellBreak) return;
                if (Object.keys(game.ui.buildings).length > 1 && game.ui.playerPartyCanSell) {
                    Game.currentGame.network.sendRpc({
                        name: "DeleteBuilding",
                        uid: parseInt(Object.keys(game.ui.buildings)[1])
                    });
                    setTimeout(() => { sellInterval(); }, 100);
                    Object.keys(game.ui.buildings).length == 2 && (this.isSellingAll = false);
                }
            }
            sellInterval();
        },
        sellBuilding: function () {
            if (this.buildingUid) {
                if ('GoldStash' == this.buildingId) {
                    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to delete all buildings?`, 5000, function() {
                        game.script.sell.sellAll();
                    });
                    return this.stopWatching();
                }
                if (this.shouldUpgradeAll) {
                    const id = this.buildingId;
                    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to delete all buildings of this type?`, 5000, function() {
                        game.script.sell.sellAllByType(id);
                    });
                } else Game.currentGame.network.sendRpc({name: 'DeleteBuilding', uid: this.buildingUid});
            };
        },
        init: function() {
            game.ui.components.BuildingOverlay.sellBuilding = this.sellBuilding.bind(game.ui.components.BuildingOverlay);
        },
    },
    chat: {
        blockedUids: [],
        emojiList: {
            hmm: "https://cdn.discordapp.com/emojis/724365641963929611.png?size=48",
            pog: "https://cdn.discordapp.com/emojis/721070353337811026.png?size=48",
            pepehands: "https://cdn.discordapp.com/emojis/733406770139103293.png?size=48",
            pepeEyes: "https://cdn.discordapp.com/emojis/869573233794486323.gif?size=48",
            pepeHappy: "https://cdn.discordapp.com/emojis/801475958883614811.png?size=48",
            sadge: "https://cdn.discordapp.com/emojis/826530556974989344.png?size=48",
            ha: "https://cdn.discordapp.com/emojis/782756472886525953.png?size=48",
            kekw: "https://cdn.discordapp.com/emojis/748511358076846183.png?size=48",
            pogEyes: "https://cdn.discordapp.com/emojis/786979080406564885.png?size=48",
            appalled: "https://cdn.discordapp.com/emojis/830880294881853530.png?size=48",
            pogYou: "https://cdn.discordapp.com/emojis/790293794716516430.png?size=48",
            pogChag: "https://cdn.discordapp.com/emojis/831156303497134090.png?size=48",
            pogey: "https://cdn.discordapp.com/emojis/790293759861719050.png?size=48",
            weirdChamp: "https://cdn.discordapp.com/emojis/757553915389673502.png?size=48",
            monkaS: "https://cdn.discordapp.com/emojis/757179783573405766.png?size=48",
            yep: "https://cdn.discordapp.com/emojis/758356179477987339.png?size=48",

            weirdButOkay: "https://cdn.discordapp.com/emojis/831156194247966782.gif?size=48",
            pogpogpogpog: "https://cdn.discordapp.com/emojis/869580566096379974.gif?size=48",
            wooyeah: "https://cdn.discordapp.com/emojis/791008461420888084.gif?size=48",
            idk: "https://cdn.discordapp.com/emojis/882513306164805642.gif?size=48",
        },
        blockPlayer: function(name, uid) {
            game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${window.filterXSS(name, { whiteList: {} })} (${uid})?`, 3500, () => {
                this.blockedUids.push(uid);
                for (let bl of Array.from(document.getElementsByClassName(`uid${uid}`))) {
                    bl.innerHTML = "Unblock";
                    bl.style.color = "blue";
                    bl.onclick = () => this.unblockPlayer(name, uid);
                };
            }, () => {});
        },
        unblockPlayer: function(name, uid) {
            this.blockedUids.splice(this.blockedUids.indexOf(uid), 1);
            for (let bl of Array.from(document.getElementsByClassName(`uid${uid}`))) {
                bl.innerHTML = "Block";
                bl.style.color = "red";
                bl.onclick = () => this.blockPlayer(name, uid);
            };
        },
        onMessageReceived: function(msg) {
            if (this.blockedUids.includes(msg.uid) || window.chatDisabled) return;
            let a = Game.currentGame.ui.getComponent("Chat"),
                b = window.filterXSS(msg.displayName, {whiteList: {}}),
                c = window.filterXSS(msg.message, {whiteList: {}})
            // c = escapeHtml(c)
            .replace(/(?:f|F)uck/gi, `<img src="https://cdn.discordapp.com/emojis/907625398832070667.png?size=80" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
            .replace(/s[3e]x+/gi, `<img src="https://cdn.discordapp.com/emojis/953759638350872666.gif?size=80&quality=lossless" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
            .replace(/n+[i1]+gg+[a@]+/i, `<img src="https://cdn.discordapp.com/emojis/902742239996936226.webp?size=80" height="16" width="17" style="margin: 1px 0 0 0;"></img>`)
            let arr = c.split(':');

            for (let i = 1; i < arr.length; i += 2) {
                if (!this.emojiList[arr[i]]) arr = [c];
                else arr[i] = `<img src="${this.emojiList[arr[i]]}" height="16" width="18" style="margin: 1px 0 0 0;"></img>`;
            }

            let d = arr.join(" ");

            let e = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" style="color: red;margin: 0 5px 0 0;display: inline-block;" class="uid${msg.uid}">Block</a><strong> ${b}</strong>: ${d}<small>${getClock()}</small></div>`);
            e.children[0].onclick = () => game.script.chat.blockPlayer(b, msg.uid);
            a.messagesElem.appendChild(e);
            a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
        },
        init: function() {
            Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
            Game.currentGame.network.addRpcHandler("ReceiveChatMessage", this.onMessageReceived.bind(this));
            document.addEventListener('keyup', function(e) {
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                    if (e.key == "Enter") {
                        (game.ui?.playerTick?.dead === 1) && game.ui.components.Chat.startTyping();
                    };
                };
            });
        },
    },
    parties: {
        serverPopulation: 0,

        partyMenu: getClass("hud-menu-party")[0],
        partyTabs: getClass("hud-party-tabs")[0],

        partyMembers: getClass("hud-party-members")[0],
        partyGrid: getClass("hud-party-grid")[0],
        closedParties: null,
        shareKeyLog: null,

        init: function() {
            this.partyMembers.style.display = "block";
            this.partyGrid.style.display = "none";

            const privateTab2 = document.createElement("a");
            privateTab2.className = "hud-party-tabs-link";
            privateTab2.id = "privateTab2";
            privateTab2.innerHTML = "Closed Parties";

            this.closedParties = document.createElement("div");
            this.closedParties.className = "hud-private hud-party-grid";
            this.closedParties.id = "privateHud2";
            this.closedParties.style.display = "none";

            this.partyTabs.appendChild(privateTab2);
            this.partyMenu.insertBefore(this.closedParties, getClass("hud-party-actions")[0]);


            const privateTab = document.createElement("a");
            privateTab.className = "hud-party-tabs-link";
            privateTab.id = "privateTab";
            privateTab.innerHTML = "Key Logs";

            this.shareKeyLog = document.createElement("div");
            this.shareKeyLog.className = "hud-private hud-party-grid";
            this.shareKeyLog.id = "privateHud";
            this.shareKeyLog.style.display = "none";

            this.partyTabs.appendChild(privateTab);
            this.partyMenu.insertBefore(this.shareKeyLog, getClass("hud-party-actions")[0]);

            privateTab.addEventListener("click", e => {
                for (let menu of [this.partyMembers, this.partyGrid, this.closedParties, this.shareKeyLog]) {
                    menu.style.display == "block" && (menu.style.display = "none");
                }

                for (let i of getClass("hud-party-tabs-link")) i.className = "hud-party-tabs-link";
                privateTab.className = "hud-party-tabs-link is-active";

                this.shareKeyLog.style.display = "block";
            })

            privateTab2.addEventListener("click", e => {
                for (let menu of [this.partyMembers, this.partyGrid, this.closedParties, this.shareKeyLog]) {
                    menu.style.display == "block" && (menu.style.display = "none");
                }

                for (let i of getClass("hud-party-tabs-link")) i.className = "hud-party-tabs-link";
                privateTab2.className = "hud-party-tabs-link is-active";

                this.closedParties.style.display = "block";
            })

            getClass("hud-party-tabs-link")[0].addEventListener("click", e => {
                this.shareKeyLog.style.display = "none";
                privateTab.className = "hud-party-tabs-link";

                this.closedParties.style.display = "none";
                privateTab2.className = "hud-party-tabs-link";
            })

            getClass("hud-party-tabs-link")[1].addEventListener("click", e => {
                this.shareKeyLog.style.display = "none";
                privateTab.className = "hud-party-tabs-link";

                this.closedParties.style.display = "none";
                privateTab2.className = "hud-party-tabs-link";
            });
            game.network.addRpcHandler("PartyShareKey", (e) => game.script.parties.onPartyShareKey(e));
            game.network.addRpcHandler("SetPartyList", (e) => game.script.parties.onSetPartyList(e));
        },
        onSetPartyList: function(parties) {
            this.serverPopulation = 0;
            for (let party of parties) {
                this.serverPopulation += party.memberCount;
            }
            document.getElementsByClassName("hud-party-server")[0].innerHTML = `${this.serverPopulation}/32<small id="serverRegion"></small>`;
        },
        onPartyShareKey: function(e) {
            const psk = e.partyShareKey,
                  lnk = `https://zombs.io/#/${game.options.serverId}/${psk}/`;
            this.shareKeyLog.innerHTML += `
                <div style="display:inline-block;margin:10px 5px 0;">
                    <li>
                        <strong
                            style="cursor: pointer;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: '${psk}' });">${psk}
                        </strong> - <a href="${lnk}" target="_blank" color="purple">
                            [Link]
                        </a>
                    </li>
                </div>
                <br />
            `;
        },
    },
    /* @NonToggle */
    builder: {
        buildBase: function(design) {
            const goldStash = Object.values(game.ui.buildings).find(building => building.type == "GoldStash");

            if (typeof design !== "string") throw new Error("Argument must be given as a string.");
            if (goldStash === undefined) throw new Error("You must have a gold stash to be able to use this.");

            const towers = design.split(";");

            for (let towerStr of towers) {
                const tower = towerStr.split(",");

                if (tower[0] === "") continue;
                if (tower.length < 4) throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be replicated.`);

                Game.currentGame.network.sendRpc({
                    name: "MakeBuilding",
                    type: towerCodes[parseInt(tower[0])],
                    x: goldStash.x - parseInt(tower[1]),
                    y: goldStash.y - parseInt(tower[2]),
                    yaw: parseInt(tower[3])
                });
            };
        },

        recordBase: function(pasteValue = true) {
            const goldStash = Object.values(game.ui.buildings).find(building => building.type == "GoldStash");
            let baseStr = "";
            for (let i in game.ui.buildings) {
                const building = game.ui.buildings[i];
                if (towerCodes.indexOf(building.type) < 0) continue;

                let yaw = 0;

                if (["Harvester", "MeleeTower"].includes(building.type)) {
                    if (game.world.entities[building.uid] !== undefined) yaw = game.world.entities[building.uid].targetTick.yaw;
                }
                baseStr += `${towerCodes.indexOf(building.type)},${goldStash.x - building.x},${goldStash.y - building.y},${yaw};`;
            }
            if (pasteValue) getId('target-base-design').value = baseStr;
            else return baseStr;
        },
        calculateResourceNeeded(design) {
            const rssNeeded = {wood: 0, stone: 0};
            const schema = game.ui.buildingSchema;

            if (typeof design !== "string") throw new Error("Argument must be given as a string.");

            const towers = design.split(";");
            for (let towerStr of towers) {
                const tower = towerStr.split(",");

                if (tower[0] === "") continue;
                if (tower.length < 4) throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be calculated for resources needed.`);

                rssNeeded.wood += schema[towerCodes[parseInt(tower[0])]].woodCosts[0];
                rssNeeded.stone += schema[towerCodes[parseInt(tower[0])]].stoneCosts[0];
            };
            return rssNeeded;
        },
        calculateNeededPlayers(design) {
            if (typeof design !== "string") throw new Error("Argument must be given as a string.");

            const allTowers = {};
            const schema = game.ui.buildingSchema;

            const towers = design.split(";");
            for (let towerStr of towers) {
                const tower = towerStr.split(",");

                if (tower[0] === "") continue;
                if (tower.length < 4) throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be calculated for resources needed.`);

                allTowers[tower[0]] ||= 0;
                allTowers[tower[0]]++;
            };
            let highestNeededAmount = 1;
            for (const towerName in allTowers) {
                const amount = allTowers[towerName];
                const neededAmount = Math.ceil(amount / (schema[towerCodes[parseInt(towerName)]].limit / game.ui.playerPartyMembers.length));
                neededAmount > highestNeededAmount && (highestNeededAmount = neededAmount);
            };
            return highestNeededAmount;
        },
        showOverlay: function (design, timeout) {
            const goldStash = Object.values(game.ui.buildings).find(building => building.type == "GoldStash");

            if (typeof design !== "string") throw new Error("Argument must be given as a string.");
            if (goldStash === null) throw new Error("You must have a gold stash to be able to use this.");

            this.overlayEntities && (this.overlayEntities.length > 0 && this.overlayEntities.map(e => game.renderer.ui.removeAttachment(e)));
            this.overlayEntities = [];
            this.overlayDesign = design;
            this.isShowingOverlay = true;
            game.renderer.follow(game.world.entities[goldStash.uid]);
            setTimeout(() => {
                const towers = design.split(";"),
                      schema = game.ui.getBuildingSchema();

                for (let towerStr of towers) {
                    const towerData = towerStr.split(",");
                    const [type, xWorld, yWorld, yaw] = towerData;
                    const towerLength = towerData.length

                    if (type === "") continue;
                    if (towerLength.length < 4) throw new Error(`${JSON.stringify(towerLength)} contains an issue that must be fixed before this design can be replicated.`);

                    const buildingType = schema[towerCodes[parseInt(type)]],
                          placeholderEntity = Game.currentGame.assetManager.loadModel(buildingType.modelName, {}),
                          { x, y } = game.renderer.worldToUi(goldStash.x - parseInt(xWorld), goldStash.y - parseInt(yWorld));
                    placeholderEntity.setAlpha(0.5);
                    placeholderEntity.setRotation(parseInt(yaw));
                    placeholderEntity.setPosition(x, y);

                    Game.currentGame.renderer.ui.addAttachment(placeholderEntity);
                    this.overlayEntities.push(placeholderEntity);
                }
                timeout && setTimeout(this.hideOverlay.bind(this), timeout);
            }, 50);
        },

        hideOverlay: function() {
            for (let entity of this.overlayEntities) game.renderer.ui.removeAttachment(entity);
            game.renderer.follow(game.world.entities[game.world.myUid]);
            this.isShowingOverlay = false;
            this.overlayDesign = null;
        },

        onResize: function() {
            this.isShowingOverlay && this.showOverlay(this.overlayDesign);
        },
        init: function() {
            window.addEventListener("resize", this.onResize.bind(this));
            document.addEventListener("zoom", this.onResize.bind(this));
        },
    },
    sessions: {
        SESSION_CREATE_TIMEOUT: 15000,
        SESSION_FETCH_TIMEOUT: 10000,

        staticJSONs: [{name:"BuildingShopPrices",response:{json:'[{"Name":"Wall","Class":"PlayerObject","GoldCosts":[0,5,30,60,80,100,250,800],"WoodCosts":[2,0,0,0,0,0,0,0],"StoneCosts":[0,2,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,400,600,800,1500,2500],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,80,250]},{"Name":"GoldStash","Class":"GoldStash","GoldCosts":[0,5000,10000,16000,20000,32000,100000,400000],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[1500,1800,2300,3000,5000,8000,12000,20000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[50,60,70,90,110,150,400,700]},{"Name":"GoldMine","Class":"GoldMine","GoldCosts":[0,200,300,600,800,1200,8000,30000],"WoodCosts":[5,15,25,35,45,55,700,1600],"StoneCosts":[5,15,25,35,45,55,700,1600],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[150,250,350,500,800,1400,1800,2800],"GoldPerSecond":[4,6,7,10,12,15,25,35],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,120]},{"Name":"Door","Class":"Door","GoldCosts":[0,10,50,70,150,200,400,800],"WoodCosts":[5,5,0,0,0,0,0,0],"StoneCosts":[5,5,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,500,700,1000,1500,2000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,1000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,100]},{"Name":"CannonTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,30,40,60,80,300,800],"StoneCosts":[15,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[500,500,500,500,600,600,600,600],"MsBetweenFires":[1000,769,625,500,400,350,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,30,50,70,120,150,200,300],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,8],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,65,70,70,75,80,100,140],"ProjectileName":"CannonProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"ArrowTower","Class":"ArrowTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[600,650,700,750,800,850,900,1000],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,40,70,120,180,250,400,500],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1300,1300,1300,1300,1300,1300,1300,1300],"ProjectileVelocity":[60,65,70,70,75,80,120,140],"ProjectileName":"ArrowProjectile","ProjectileAoe":[false,false,false,false,false,false,false,false],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"Harvester","Class":"Harvester","GoldCosts":[0,100,200,600,1200,2000,8000,10000],"WoodCosts":[5,25,30,40,50,70,300,600],"StoneCosts":[5,20,30,40,60,80,300,600],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,2800],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,130],"HarvestAmount":[2.5,4.65,4.55,7.2,8.25,10,13.5,16],"HarvestCooldown":[1500,1400,1300,1200,1100,1000,900,800],"HarvestMax":[400,800,1200,1600,2000,2400,2800,3600],"HarvestRange":[300,300,300,300,300,300,300,300],"DepositCostPerMinute":[200,300,350,500,600,700,1200,1400],"DepositMax":[800,1200,1400,2000,2400,2800,4800,6000],"MaxYawDeviation":[70,70,70,70,70,70,70,70]},{"Name":"BombTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,40,50,80,120,300,800],"StoneCosts":[10,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[1000,1000,1000,1000,1000,1000,1000,1000],"MsBetweenFires":[1000,1000,1000,1000,1000,1000,900,900],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[30,60,100,140,200,600,1200,1600],"DamageToPlayers":[9,9,10,10,11,11,12,12],"DamageToPets":[10,10,10,10,10,10,10,10],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[20,20,20,20,20,20,20,20],"ProjectileName":"BombProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileIgnoresCollisions":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"ProjectileMaxRange":[1000,1000,1000,1000,1000,1000,1000,1000]},{"Name":"MagicTower","Class":"MagicTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,40,50,70,100,300,800],"StoneCosts":[15,25,40,50,70,100,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[400,400,400,400,400,400,400,400],"MsBetweenFires":[800,800,700,600,500,400,300,300],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[10,20,40,50,70,80,120,160],"DamageToPlayers":[5,5,5,6,6,6,7,7],"DamageToPets":[5,5,5,5,5,5,5,5],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[500,500,500,500,500,500,500,500],"ProjectileVelocity":[45,45,45,45,45,45,45,45],"ProjectileName":"FireballProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[100,100,100,100,100,100,100,100],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"MeleeTower","Class":"MeleeTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,30,40,50,70,300,800],"StoneCosts":[10,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[110,110,110,110,110,110,110,110],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[200,400,800,1200,1600,2200,4000,9000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,220,350],"DamageToZombies":[80,120,200,280,500,1000,2000,3000],"DamageToPlayers":[5,6,7,8,9,10,11,12],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"MaxYawDeviation":[30,30,30,30,30,30,30,30]},{"Name":"SlowTrap","Class":"Trap","GoldCosts":[0,100,200,400,600,800,1000,1500],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":47.99,"Width":47.99,"Health":[150,200,400,800,1200,1600,2200,3000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"SlowDuration":[2500,2500,2500,3000,3000,3250,3500,4000],"SlowAmount":[0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.7]}]'},opcode:9},{name:"ItemShopPrices",response:{json:'[{"Name":"Spear","Class":"MeleeWeapon","MsBetweenFires":[250,250,250,250,250,250,250],"DamageToZombies":[30,80,120,300,2000,8000,10000],"DamageToNeutrals":[50,80,100,200,250,400,600],"DamageToBuildings":[0.75,1.5,2.25,3,3.75,4.5,5.25],"DamageToPlayers":[15,16,17,18,20,22,22],"DamageToPets":[3,3.5,4,4.5,5,5.5,5.5],"GoldCosts":[1400,2800,5600,11200,22500,45000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[50,50,50,50,50,50,50]},{"Name":"Pickaxe","Class":"MeleeWeapon","MsBetweenFires":[300,300,285,250,200,200,200],"DamageToZombies":[20,20,20,20,20,20,20],"DamageToBuildings":[0,0,0,0,0,0,0],"DamageToPlayers":[0,0,0,0,0,0,0],"DamageToNeutrals":[10,10,10,10,10,10,10],"DamageToPets":[0,0,0,0,0,0,0],"GoldCosts":[0,1000,3000,6000,8000,24000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[70,70,70,70,70,70,70],"IsTool":true,"HarvestCount":[1,2,2,3,3,4,6]},{"Name":"Bow","Class":"RangedWeapon","DamageToZombies":[20,40,100,300,2400,10000,14000],"DamageToBuildings":[2,2.3,2.5,2.7,3,3,3],"DamageToPlayers":[22,24,26,28,30,32,32],"DamageToNeutrals":[50,100,150,200,250,400,700],"DamageToPets":[2,2.3,2.5,2.7,3,3,3],"GoldCosts":[100,400,2000,7000,24000,30000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"ChargeTime":[150,150,150,150,150,150,150],"ProjectileVelocity":[100,100,100,100,100,100,100],"ProjectileName":"BowProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[550,550,550,550,550,550,550]},{"Name":"Bomb","Class":"RangedWeapon","GoldCosts":[100,400,3000,5000,24000,30000,90000],"DamageToNeutrals":[50,100,150,200,250,300,500],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"DamageToZombies":[10,30,80,150,1200,6000,9000],"DamageToBuildings":[1,1,1,1,1,1,1],"DamageToPlayers":[20,22,24,26,28,30,30],"DamageToPets":[1,1,1,1,1,1,1],"ProjectileVelocity":[40,40,40,40,40,40,40],"ProjectileName":"BombProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[700,700,700,700,700,700,700],"ProjectileAoe":[true,true,true,true,true,true,true],"ProjectileAoeRadius":[50,50,50,50,50,50,50],"ProjectileIgnoresCollisions":[false,false,false,false,false,false,false],"ProjectileMaxRange":[700,700,700,700,700,700,700]},{"Name":"HealthPotion","Class":"HealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":15000},{"Name":"ZombieShield","Class":"ZombieShield","GoldCosts":[1000,3000,7000,14000,18000,22000,24000,30000,45000,70000],"StoneCosts":[0,0,0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0,0,0],"Health":[500,1000,1800,4000,10000,20000,35000,50000,65000,85000],"RechargePerSecond":[50,100,200,400,1000,2000,3500,5000,6500,8500],"MsBeforeRecharge":[10000,9000,8000,7000,6000,6000,6000,6000,6000,6000]},{"Name":"Pause","Class":"Pause","GoldCosts":[10000],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":240000},{"Name":"PetMiner","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"HarvestCount":[1,1,2,2,3,3,4,4],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[false,false,false,false,false,false,false,false],"CanMine":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"HarvestLeashRange":[0,0,0,0,0,0,0,0],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,450,450,400,400,380,380,350],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromMiningPerHalfSecond":[1,1,1,1,1,1,1,1]},{"Name":"PetCARL","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,490,490,490,480,480,470,470],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,60,60,60,60,60,60,60],"ProjectileName":"PetCARLProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"DamageToZombies":[30,100,400,600,1000,3000,6000,8000],"DamageToPlayers":[30,31,32,33,34,35,36,37],"DamageToBuildings":[2,2,2,3,3,3,4,4],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromZombies":[30,28,25,25,25,25,25,25],"ExperienceFromNeutrals":[30,28,25,25,25,25,25,25]},{"Name":"HatHorns","Class":"Hat","GoldCosts":[0],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]},{"Name":"PetHealthPotion","Class":"PetHealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetWhistle","Class":"PetWhistle","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetRevive","Class":"PetRevive","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]}]'},opcode:9},{name:"Spells",response:{json:'[{"Name":"HealTowersSpell","VisualLifetime":10000,"VisualRadius":600,"Cooldown":[240000],"IsCooldownForParty":true,"Healing":[{"Type":"Tower","Amount":[50],"Over":[10000],"Radius":[600]}],"GoldCosts":[1000],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]}]'},opcode:9}],
        codecJSON: '{"attributeMaps":{"667546015":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"firingTick","type":1},{"name":"experience","type":1},{"name":"stoneGain","type":3},{"name":"woodGain","type":3},{"name":"stoneGainTick","type":1},{"name":"woodGainTick","type":1}],"742594995":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1059671174":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1},{"name":"lastDamagedTick","type":1}],"1372600389":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"1496910567":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1}],"1566069472":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1672634632":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"1816895259":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"2092990061":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2093252446":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"2347737811":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"reconnectSecret","type":4},{"name":"name","type":4},{"name":"score","type":13},{"name":"baseSpeed","type":3},{"name":"speedAttribute","type":3},{"name":"availableSkillPoints","type":2},{"name":"experience","type":3},{"name":"level","type":1},{"name":"msBetweenFires","type":3},{"name":"aimingYaw","type":2},{"name":"energy","type":3},{"name":"maxEnergy","type":3},{"name":"energyRegenerationRate","type":3},{"name":"kills","type":2},{"name":"weaponName","type":4},{"name":"weaponTier","type":1},{"name":"firingTick","type":1},{"name":"startChargingTick","type":1},{"name":"stone","type":15},{"name":"wood","type":15},{"name":"gold","type":15},{"name":"token","type":15},{"name":"wave","type":1},{"name":"partyId","type":1},{"name":"zombieShieldHealth","type":3},{"name":"zombieShieldMaxHealth","type":3},{"name":"isPaused","type":1},{"name":"isInvulnerable","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"lastDamage","type":3},{"name":"lastDamageTick","type":1},{"name":"lastDamageTarget","type":1},{"name":"hatName","type":4},{"name":"petUid","type":1},{"name":"isBuildingWalking","type":10}],"2402467733":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2462472648":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1}],"2464630638":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2899981078":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"harvestMax","type":1},{"name":"stone","type":1},{"name":"wood","type":1},{"name":"firingTick","type":1},{"name":"deposit","type":3},{"name":"depositMax","type":3},{"name":"lastHarvestedBy","type":4}],"2969697641":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"towerYaw","type":3},{"name":"firingTick","type":1},{"name":"healingTick","type":1}]},"entityTypeNames":{"667546015":"Pet","742594995":"GoldMine","1059671174":"Zombie","1372600389":"Stone","1496910567":"Neutral","1566069472":"PlayerObject","1672634632":"NeutralCamp","1816895259":"GameProjectile","2092990061":"Trap","2093252446":"Tree","2347737811":"GamePlayer","2402467733":"GoldStash","2462472648":"Spell","2464630638":"Door","2899981078":"Harvester","2969697641":"Tower"},"rpcMaps":[{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},{"name":"RecallPet","parameters":[],"isArray":false,"index":34},{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}],"rpcMapsByName":{"Shutdown":{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},"ReceiveChatMessage":{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},"SendChatMessage":{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},"Login":{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},"LoginResponse":{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},"AccountSession":{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},"Metrics":{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},"DayCycle":{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},"MakeBuilding":{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},"BuildingShopPrices":{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},"ItemShopPrices":{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},"LocalBuilding":{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},"Dead":{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},"Admin":{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},"UpgradeBuilding":{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},"DeleteBuilding":{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},"BuyItem":{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},"SetItem":{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},"EquipItem":{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},"SetOpenParty":{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},"SetPartyName":{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},"SetPartyMemberCanSell":{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},"JoinParty":{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},"JoinPartyByShareKey":{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},"PartyApplicant":{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},"PartyApplicantDecide":{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},"PartyApplicantDenied":{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},"PartyApplicantExpired":{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},"PartyShareKey":{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},"PartyInfo":{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},"AddParty":{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},"RemoveParty":{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},"Leaderboard":{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},"Failure":{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},"RecallPet":{"name":"RecallPet","parameters":[],"isArray":false,"index":34},"LeaveParty":{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},"KickParty":{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},"AddDepositToHarvester":{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},"CollectHarvester":{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},"CastSpell":{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},"CastSpellResponse":{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},"Spells":{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},"SetPartyList":{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}}}',

        useSes: false,
        currentSesId: null,

        allSessions: null,
        endpoints: localStorage.sessionEndpoints ? JSON.parse(localStorage.sessionEndpoints) : {
            localhost: {
                secret: 'f07cbf563d19619ba4afe3ae1e2ec95710a72b3e',
                https: false,
                wss: "localhost:727",
                api: "localhost:728",
            },
        },

        nameInput: getClass("hud-intro-name")[0],
        serverSelect: getClass("hud-intro-server")[0],
        overlayElem: getId("hud-intro-overlay"),

        sesSelect: document.createElement("select"),
        delBtn: document.createElement("button"),
        addBtn: document.createElement("button"),
        init: async function() {
            this.addBtn.id = "addBtn";
            this.addBtn.innerText = "Add...";
            document.querySelector("#hud-intro-options").insertAdjacentElement("afterbegin", this.addBtn);

            this.delBtn.id = "delBtn";
            this.delBtn.innerText = "Delete";
            document.querySelector("#hud-intro-options").insertAdjacentElement("afterbegin", this.delBtn);

            this.sesSelect.disabled = true;
            this.sesSelect.id = "sesSelect";
            document.querySelector("#hud-intro-options").insertAdjacentElement("afterbegin", this.sesSelect);

            getId("hud-intro-overlay").insertAdjacentHTML("beforeend", `
                <div id="select-session-add">
                    <h2>Which one do wish to add?</h2>
                    <button id="add-endpoint">Add a new endpoint</button>
                    <button id="add-session">Add a new session</button>
                </div>
                <div id="endpoint-add-menu">
                    <h2>Endpoint info</h2>
                    <p>Nickname</p>
                    <input id="endpoint-name" placeholder="somecoolname" />
                    <p>Server URL</p>
                    <input id="endpoint-server" placeholder="domain:port" />
                    <p>API URL</p>
                    <input id="endpoint-api" placeholder="domain:port" />
                    <p>Secret key</p>
                    <input id="endpoint-secret" placeholder="0123456789abcdef" />
                    <p>Protocol</p>
                    <select id="endpoint-protocol">
                        <option value="http" selected>HTTP</option>
                        <option value="https">HTTPS</option>
                    </select>
                    <div class="session-navigator">
                        <button class="session-back"><i class="fa-solid fa-chevron-left"></i></button>
                        <button id="create-endpoint"><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>
                <div id="session-add-menu">
                    <h2>Session creation info</h2>
                    <strong>You can leave the Party share key field empty.</strong>
                    <p>Endpoint</p>
                    <select id="session-endpoint">
                        ${Object.keys(this.endpoints).map((name) => {
                name = window.filterXSS(name, { whiteList: {} });
                return `<option value="${name}" selected>${name}</option>`;
            }).join("\n")}
                    </select>
                    <p>Username</p>
                    <input id="session-nickname" placeholder="AyuLover2911" />
                    <p>Server</p>
                    <select id="session-server">${this.serverSelect.innerHTML}</select>
                    <p>Party share key</p>
                    <input id="session-psk" placeholder="abcdefghijklmnopqrstuvwxyz" />
                    <div class="session-navigator">
                        <button class="session-back"><i class="fa-solid fa-chevron-left"></i></button>
                        <button id="create-session"><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>
            `);

            getId("useSes").onchange = () => {
                this.useSes = getId("useSes").checked;
                if (this.useSes) {
                    this.sesSelect.style.display = "block";
                    this.delBtn.style.display = "inline-block";
                    this.addBtn.style.display = "inline-block";

                    this.nameInput.style.display = "none";
                    this.serverSelect.style.display = "none";

                    document.documentElement.style.setProperty('--normal-btn', 'rgb(158 74 208)');
                    document.documentElement.style.setProperty('--light-hover-btn', 'rgb(213 118 211)');
                    /*
                    document.querySelector("#intro-animation > img").src = "https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/luna.png?v=1720346619482";
                    document.querySelector("#intro-animation > img").style.left = "calc(15vw - 600px)";
                    document.querySelector("#hud-intro").setAttribute("style", "--bg-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Eden%20Conflict.webp?v=1717298976083');");
                    */
                } else {
                    this.sesSelect.style.display = "none";
                    this.delBtn.style.display = "none";
                    this.addBtn.style.display = "none";

                    this.nameInput.style.display = "block";
                    this.serverSelect.style.display = "block";

                    document.documentElement.style.setProperty('--normal-btn', 'rgb(40 152 231)');
                    document.documentElement.style.setProperty('--light-hover-btn', 'rgb(111 208 247)');
                    /*
                    document.querySelector("#intro-animation > img").src = "https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/eto_large.png?v=1717285769725";
                    document.querySelector("#intro-animation > img").style.left = "calc(15vw - 300px)";
                    document.querySelector("#hud-intro").setAttribute("style", "--bg-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/BG_eden_append_light.webp?v=1717285760533');");
                    */
                };
            };

            this.delBtn.onclick = () => {
                const [endpoint, sessionId] = this.sesSelect.value.split("/");
                this.deleteSes(endpoint, sessionId);
            };

            this.addBtn.onclick = () => {
                game.ui.components.Intro.hideLoadingScreen();
                getId("hud-intro").style.display = "block";

                this.overlayElem.style.display = "flex";
                this.overlayElem.style.opacity = 1;
                getId("select-session-add").style.display = "flex";
                getId("endpoint-add-menu").style.display = "none";
                getId("session-add-menu").style.display = "none";
            };
            getId("add-endpoint").onclick = () => {
                getId("select-session-add").style.display = "none";
                getId("endpoint-add-menu").style.display = "flex";
                getId("session-add-menu").style.display = "none";
            };
            getId("add-session").onclick = () => {
                getId("select-session-add").style.display = "none";
                getId("endpoint-add-menu").style.display = "none";
                getId("session-add-menu").style.display = "flex";
            };
            for (const backElem of getClass("session-back")) backElem.onclick = () => { this.addBtn.click(); };
            getId("create-endpoint").onclick = () => this.addNewEndpoint(
                getId("endpoint-name").value,
                getId("endpoint-server").value,
                getId("endpoint-api").value,
                getId("endpoint-protocol").value,
                getId("endpoint-secret").value,
            );
            getId("create-session").onclick = () => this.createNewSession(
                getId("session-nickname").value,
                getId("session-server").value,
                getId("session-psk").value,
                getId("session-endpoint").value,
            );

            game.network.establishSessionConnection = function() {
                const [endpoint, sessionId] = game.script.sessions.sesSelect.value.split("/");
                this.connectionOptions = game.script.sessions.allSessions[endpoint][sessionId].connectionOptions;
                this.connected = false;
                this.connecting = true;
                this.codec.rpcMaps = [{
                    "name": "SyncData",
                    "parameters": [{
                        "name": "json",
                        "type": 3
                    }],
                    "isArray": false,
                    "index": 0
                }, {
                    "name": "VerifyUser",
                    "parameters": [{
                        "name": "secretKey",
                        "type": 3,
                    }],
                    "isArray": false,
                    "index": 1
                }, {
                    "name": "ConnectSession",
                    "parameters": [{
                        "name": "id",
                        "type": 3
                    }],
                    "isArray": false,
                    "index": 2
                }];
                this.codec.rpcMapsByName = {
                    "SyncData": {
                        "name": "SyncData",
                        "parameters": [{
                            "name": "json",
                            "type": 3
                        }],
                        "isArray": false,
                        "index": 0
                    },
                    "VerifyUser": {
                        "name": "VerifyUser",
                        "parameters": [{
                            "name": "secretKey",
                            "type": 3
                        }],
                        "isArray": false,
                        "index": 1
                    },
                    "ConnectSession": {
                        "name": "ConnectSession",
                        "parameters": [{
                            "name": "id",
                            "type": 3
                        }],
                        "isArray": false,
                        "index": 2
                    },
                };
                this.socket = new WebSocket(`ws${game.script.sessions.endpoints[endpoint].https ? "s" : ""}://${game.script.sessions.endpoints[endpoint].wss}`);
                this.socket.binaryType = `arraybuffer`;
                this.socket.addEventListener("open", () => {
                    this.socket.send(this.codec.encode(9, {
                        name: "VerifyUser",
                        secretKey: game.script.sessions.endpoints[endpoint].secret
                    }));
                    this.socket.send(this.codec.encode(9, {
                        name: "ConnectSession",
                        id: sessionId,
                    }));
                });
                this.bindEventListeners();
                this.addRpcHandler("SyncData", (response) => {
                    try {
                        const data = JSON.parse(response.json);

                        this.connectionOptions = data.connectionOptions;
                        game.options.serverId = data.connectionOptions.id;
                        game.options.nickname = data.syncNeeds[0].effectiveDisplayName;

                        const staticCodecData = JSON.parse(game.script.sessions.codecJSON);
                        for (let i in staticCodecData) {
                            this.codec[i] = staticCodecData[i];
                        };
                        this.codec.sortedUidsByType = data.sortedUidsByType;
                        this.codec.removedEntities = data.removedEntities;
                        this.codec.absentEntitiesFlags = data.absentEntitiesFlags;
                        this.codec.updatedEntityFlags = data.updatedEntityFlags;

                        for (let i = 0; i < game.script.sessions.staticJSONs.length; i++) {
                            this.emitter.emit(PacketIds_1.default[game.script.sessions.staticJSONs[i].opcode], game.script.sessions.staticJSONs[i]);
                        };

                        for (let i = 0; i < data.syncNeeds.length; i++) {
                            this.emitter.emit(PacketIds_1.default[data.syncNeeds[i].opcode], data.syncNeeds[i]);
                        };

                        for (let i = 0; i < data.messages.length; i++) {
                            this.emitter.emit(PacketIds_1.default[9], {
                                name: "ReceiveChatMessage",
                                response: data.messages[i],
                                opcode: 9
                            });
                        };

                        if (data.castSpellResponse && data.castSpellResponse.cooldownStartTick && (data.tick - data.castSpellResponse.cooldownStartTick) * 50 < 240000) {
                            this.emitter.emit(PacketIds_1.default[9], {
                                name: 'CastSpellResponse',
                                response: data.castSpellResponse,
                                opcode: 9
                            });
                        };

                        for (let i in data.inventory) {
                            this.emitter.emit(PacketIds_1.default[9], {
                                name: "SetItem",
                                response: {
                                    itemName: data.inventory[i].itemName,
                                    tier: data.inventory[i].tier,
                                    stacks: data.inventory[i].stacks
                                },
                                opcode: 9
                            });
                        };

                        this.emitter.emit(PacketIds_1.default[9], {
                            name: "LocalBuilding",
                            response: data.localBuildings,
                            opcode: 9
                        });

                        this.emitter.emit(PacketIds_1.default[0], {
                            tick: data.tick,
                            entities: data.entities,
                            byteSize: data.byteSize,
                            opcode: 0
                        });

                        this.emitter.once(PacketIds_1.default[0], () => {
                            const myPlayer = data.entities[data.syncNeeds[0].uid];
                            myPlayer?.dead && this.emitter.emit(PacketIds_1.default[9], {
                                name: "Dead",
                                response: {stashDied: 0},
                                opcode: 9
                            });
                            myPlayer?.isPaused && (
                                game.ui.onLocalItemUpdate({
                                    itemName: 'Pause',
                                    tier: 1,
                                    stacks: 1
                                }),
                                game.ui.emit('wavePaused')
                            );
                        });
                    } catch(e) { console.log(e); };
                });
            };

            game.network.connect = async function (options) {
                if (!this.connecting) {
                    if (game.script.sessions.useSes) return this.establishSessionConnection();
                    this.connectionOptions = options;
                    this.connected = false;
                    this.connecting = true;
                    this.socket = new WebSocket('wss://' + options.hostname + ':' + options.port);
                    this.socket.binaryType = `arraybuffer`;
                    this.bindEventListeners();
                };
            };

            game.network.reconnect = function () {
                return this.connect(this.connectionOptions);
            };

            await this.fetchSessions();
        },
        fetchSessions: async function() {
            for (const endpointName in this.endpoints) {
                const endpointData = this.endpoints[endpointName];
                try {
                    let data = await fetch(
                        `http${endpointData.https ? "s" : ""}://${endpointData.api}/sessions`,
                        {
                            signal: AbortSignal.timeout(this.SESSION_FETCH_TIMEOUT),
                            method: "get",
                            headers: new Headers({
                                "ngrok-skip-browser-warning": "69420",
                            }),
                        }
                    );
                    data = await data.json();

                    this.allSessions ||= {};
                    this.sesSelect.disabled = false;

                    this.allSessions[endpointName] = data;
                } catch(e) {
                    console.warn(`Failed to fetch available sessions for ${endpointName}: ` + e);
                };
            };
            this.mapSessions();
        },
        mapSessions() {
            if (this.allSessions === null) return;
            let sessionHTML = '';
            for (const endpointName in this.allSessions) {
                sessionHTML += `
                    <optgroup label="${window.filterXSS(endpointName, { whiteList: {} })}">
                        ${Object.entries(this.allSessions[endpointName]).map(([key, data]) => {
                    let { connectionOptions: { id }, name } = data;
                    name = window.filterXSS(name, { whiteList: {} });
                    return `<option value="${endpointName}/${key}">${name} [${id}]</option>`;
                }).join("\n")}
                    </optgroup>
                `;
            };
            this.sesSelect.innerHTML = sessionHTML;
            getId("session-endpoint").innerHTML = Object.keys(this.endpoints).map((name) => {
                name = window.filterXSS(name, { whiteList: {} });
                return `<option value="${name}" selected>${name}</option>`;
            }).join("\n");
        },
        addNewEndpoint: async function(name, server, api, protocol, secret) {
            game.ui.components.Intro.showLoadingScreen();
            if (name && secret && server && api && protocol) {
                this.endpoints[name] = {https: protocol == "https", secret, wss: server, api};
                localStorage.sessionEndpoints = JSON.stringify(this.endpoints);
                await this.fetchSessions();
            } else game.ui.components.Intro.onConnectionError("Please fill in ALL necessary details to add a new endpoint.");
            game.ui.components.Intro.hideLoadingScreen();
            game.world.isInitialized && (getId("hud-intro").style.display = "none");
        },
        createNewSession: async function(nickname, server, psk = "", endpoint) {
            game.ui.components.Intro.showLoadingScreen();
            try {
                const {https, api} = this.endpoints[endpoint];
                console.log(nickname, server, psk, endpoint);
                let data = await fetch(
                    `http${https ? "s" : ""}://${api}/create?name=${nickname}&serverId=${server}&psk=${psk}`,
                    {
                        signal: AbortSignal.timeout(this.SESSION_CREATE_TIMEOUT),
                        method: "get",
                        headers: new Headers({
                            "ngrok-skip-browser-warning": "69420",
                        }),
                    }
                );
                data = await data.json();

                this.allSessions ||= {};
                this.sesSelect.disabled = false;

                this.allSessions[endpoint] = data.data;
                this.mapSessions();

                this.sesSelect.value = `${endpoint}/${data.createdSession}`;
            } catch(e) {
                console.log(e);
                game.ui.components.Intro.onConnectionError(e);
            };
            game.ui.components.Intro.hideLoadingScreen();
            game.world.isInitialized && (getId("hud-intro").style.display = "none");
        },
        deleteSes: async function(endpoint, sesId) {
            const { api, https } = this.endpoints[endpoint];
            await fetch(
                `http${https ? "s" : ""}://${api}/delete?sessionId=${sesId}`,
                { signal: AbortSignal.timeout(this.SESSION_CREATE_TIMEOUT) }
            );
            setTimeout(this.fetchSessions.bind(this), 500);
        },
    },
    sockets: {
        statusEnum: {
            "Population Full": "red",
            "Failed": "red",
            "Closed": "red",
            "Connecting": "yellow",
            "Open": "green"
        },
        shared: {
            all: {},
            uiHooks: {},
            availableNames: shuffleArray([
                "Hikari",
                "Tairitsu",
                "Kou",
                "Sapphire",
                "Lethe",
                "Tairitsu (Axium)",
                "Tairitsu (Grievous Lady)",
                "Stella",
                "Hikari & Fisica",
                "Ilith",
                "Eto",
                "Luna",
                "Shirabe",
                "Hikari (Zero)",
                "Hikari (Fracture)",
                "Hikari (Summer)",
                "Tairitsu (Summer)",
                "Tairitsu & Trin",
                "Ayu",
                "Eto & Luna (Winter)",
                "Hikari & Seine",
                "Yume",
                "Saya",
                "Tairitsu (Grievous Lady) & Chuni Penguin",
                "Nono Shibusawa",
                "Haruna Mishima",
                "Regulus (MDA-21)",
                "Pandora Nemesis (MTA-XXX)",
                "Chuni Penguin",
                "Kanae",
                "Hikari (Fantasia)",
                "Tairitsu (Sonata)",
                "Sia",
                "DORO*C",
                "Tairitsu (Tempest)",
                "Brillante (E/S Primera)",
                "Ilith (Summer)",
                "Saya (Etude)",
                "Alice & Tenniel",
                "Luna & Mia",
                "Areus",
                "Seele Haze",
                "Isabelle Yagrush",
                "Mir",
                "Lagrange",
                "Shirahime",
                "Linka",
                "Nami",
                "Saya & Elizabeth",
                "Lily",
                "Kanae (Midsummer)",
                "Alice & Tenniel (Minuet)",
                "Tairitsu (Elegy)",
                "Marija",
                "Vita",
                "Hikari (Fatalis)",
                "Hikari & Tairitsu (Reunion)",
                "Saki",
                "Setsuna",
                "Amane",
                "Kou (Winter)",
                "Lethe (Apophenia)",
                "Lagrange (Aria)",
                "Milk (UNiVERSE)",
                "Shama (UNiVERSE)",
                "Mika Yurisaki",
                "Shikoku",
                "Toa Kozukata",
                "Mithra Tercera",
                "Nami (Twilight)",
                "Ilith & Ivy",
                "Hikari & Vanessa",
                "Maya",
                "Luin",
                "Vita (Cadenza)",
                "Ai-chan",
                "Luna & Ilot",
                "Eto & Hoppe",
                "Nell",
                "Lacrymira",
                "Tsumugi",
                "Chinatsu",
            ]),
            options: {
                useProxy: {
                    enabled: false,
                },
                control: {
                    enabled: true,
                },
                autoFill: {
                    enabled: false,
                    onCallback: () => {
                        game.network.emitter.emit("PACKET_RPC", {
                            name: "SetPartyList",
                            response: Object.values(game.ui.parties),
                            opcode: 9
                        });
                    },
                },
                randomizeName: {
                    enabled: true,
                },
                raid: {
                    enabled: false,
                    nearestToCursor: null,
                },
            },
        },
        helpers: {
            init: function() {
                game.network.addEntityUpdateHandler(() => {
                    this.updateNearestMultiboxClone.call(game.script.sockets);
                });
            },
            updateNearestMultiboxClone: function() {
                if (this.shared.options.raid.enabled) {
                    let nearestDistance = Infinity;
                    for (let uuid in this.shared.all) {
                        const socket = this.shared.all[uuid];
                        if (socket.identifiers.type != "Multibox" || socket.ws.readyState != 1) continue;
                        const mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                        const distance = getDistanceToCursor(mousePosition, socket.player?.targetTick?.position);
                        if (distance < nearestDistance && socket.player?.uid && socket.player?.targetTick?.dead === 0) {
                            nearestDistance = distance;
                            this.shared.options.raid.nearestToCursor = socket.player.uid;
                        };
                    };
                };
            }
        },
        init: function() {
            game.network.addRpcHandler("SetPartyList", (parties) => {
                if (this.shared.options.autoFill.enabled) {
                    let serverPopulation = 0;
                    for (let party of parties) {
                        serverPopulation += party.memberCount;
                    };
                    const emptyAmount = 32 - serverPopulation;
                    if (emptyAmount > 0) {
                        let connectedSockets = 0;
                        for (const socket of Object.values(this.shared.all)) {
                            if (socket.hasEnteredWorld && socket.ws.readyState === 1) connectedSockets++;
                        };
                        const shouldWait = ((connectedSockets + 1) % 7) === 0;
                        shouldWait && game.ui.components.PopupOverlay.showHint("Please change your IP Address for the auto-filling to continue.");
                        this.createSocket("Filler");
                    };
                };
            });
        },
        updateActiveSocketsAmount: function() {
            let openSockets = 0;
            const allSockets = Object.values(this.shared.all);
            for (let i = 0; i < allSockets.length; i++) {
                allSockets[i].ws.readyState == 1 && openSockets++;
            };
            getId("clone-amount").innerText = openSockets + " active";
        },
        addUiHook: function(UUID, elemSelector, event, callback) {
            this.shared.uiHooks[elemSelector] ||= {};
            if (!this.shared.uiHooks[elemSelector][event]) {
                this.shared.uiHooks[elemSelector][event] = {};
                document.querySelector(elemSelector)["on" + event] = (e) => {
                    for (let uuid in this.shared.uiHooks[elemSelector][event]) {
                        this.shared.uiHooks[elemSelector][event][uuid]();
                    };
                };
            };
            this.shared.uiHooks[elemSelector][event][UUID] = callback;
        },
        removeUiHook: function(UUID, elemSelector, event) {
            delete this.shared.uiHooks[elemSelector][event][UUID];
        },
        Socket: class Socket {
            constructor(url, identifiers) {
                this.parent = game.script.sockets;
                if (this.parent.shared.options.useProxy.enabled) {
                    const serverId = game.network.connectionOptions.id;
                    url = `ws://localhost:1003/${serverId}`;
                }
                this.ws = new WebSocket(url);
                this.ws.binaryType = "arraybuffer";

                this.identifiers = identifiers;
                this.player = {
                    uid: null,
                    partyShareKey: null,

                    targetTick: {},
                    petTick: {},

                    // entities: {},

                    inventory: {},
                    buildings: {},
                    parties: {},

                    hasHealed: false,
                    lastTickHealth: 100,
                };
                this.hasEnteredWorld = false;

                this.pingStart = null;
                this.pingCompletion = null;
                this.ping = 0;

                this.keybinds = {
                    keyup: {},
                    keydown: {},
                    mousedown: {},
                    mouseup: {},
                    mousemove: () => {},
                };

                /*
                this.msElapsedSinceInputSent = 0;
                this.currentInput = {};
                this.shouldInput = false;
                */

                this.statusDisplay = getId(`alt${this.identifiers.id}`) || document.createElement("p");
                this.statusDisplay.style.position = "relative";
                this.statusDisplay.style.width = "100%";

                this.minimapDisplay = document.createElement('div');

                this.timeCreation = Date.now();

                this.init(this.identifiers.type);
            };
            init(type) {
                this.ws.addEventListener("open", () => {
                    this.updateStatus("Connecting");
                    this.codec = new BinCodec();
                    this.resetListeners(type);
                    this.bindKeys();
                });
                this.ws.addEventListener("message", this.onMessage.bind(this));
                this.ws.addEventListener("close", this.onClose.bind(this));
                this.ws.addEventListener("error", this.onError.bind(this));
                // game.renderer.addTickCallback(this.onRendererTick.bind(this));
            };
            decodeData(data) {
                this.data = {};
                const m = new Uint8Array(data);
                this.data.opcode = m[0];
                switch(m[0]) {
                    case 5:
                        wasmModule(e => {
                            this.sendPacket(4, {
                                displayName: this.identifiers.name,
                                extra: e[5].extra
                            });
                            this.wasmModule = e;
                        }, m, game.network.connectionOptions.ipAddress);
                        break;
                    case 10:
                        this.sendPacket(10, {extra: codec.decode(data, this.wasmModule[10]).extra});
                        break;
                    default:
                        this.data = this.codec.decode(data);
                };
                if (m[0] == 4 && this.data.allowed) {
                    this.ws.send(this.wasmModule[6]);
                    this.hasEnteredWorld = true;
                };
            };
            onError() {
                game.ui.components.PopupOverlay.showHint("Socket failed to connect. Maybe switch your IP?");
            };
            onClose() {
                this.parent.updateActiveSocketsAmount();
                this.updateStatus("Closed");

                this.minimapDisplay.remove();

                this.wasmModule = null;

                this.identifiers.name != game.ui.playerTick.name && this.parent.shared.availableNames.push(this.identifiers.name);

                if (this.parent.shared.options.autoFill.enabled) {
                    setTimeout(() => {
                        game.network.emitter.emit("PACKET_RPC", {
                            name: "SetPartyList",
                            response: Object.values(game.ui.parties),
                            opcode: 9
                        });
                    }, 1000);
                };
            };
            onMessage({data}) {
                this.sendPingIfNecessary();
                this.decodeData(data);
                this.emitter.emit(PacketIds_1.default[this.data.opcode], this.data);
            };
            /*
            onRendererTick(delta) {
                this.msElapsedSinceInputSent += delta;
                this.sendInputKeys();
            };
            */
            addOnceHandler(opcode, callback) {
                this.emitter.once(PacketIds_1.default[opcode], callback.bind(this));
            };
            addPacketHandler(opcode, callback) {
                this.emitter.on(PacketIds_1.default[opcode], callback.bind(this));
            };
            sendPacket(e, t) {
                const enc = this.codec.encode(e, t);
                this.ws.readyState == 1 && this.ws.send(enc);
            };
            sendInput(t) {
                this.sendPacket(3, t);
            };
            sendRpc(t) {
                this.sendPacket(9, t);
            };
            sendPingIfNecessary() {
                var pingInProgress = (this.pingStart != null);
                if (pingInProgress) {
                    return;
                }
                if (this.pingCompletion != null) {
                    var msSinceLastPing = (new Date().getTime() - this.pingCompletion.getTime());
                    if (msSinceLastPing <= 5000) {
                        return;
                    }
                }
                this.pingStart = new Date();
                this.sendPacket(7, { nonce: 0 });
            };
            /*
            scheduleInput(data) {
                this.currentInput = data;
                this.shouldInput = true;
                this.sendInputKeys();
            };
            sendInputKeys() {
                const msPerTick = game.world.msPerTick;
                if (!(this.msElapsedSinceInputSent < msPerTick)) {
                    if (this.shouldInput) {
                        this.sendInput(this.currentInput);
                        this.currentInput = {};
                        this.shouldInput = false;
                    };
                };
            };
            */
            resetListeners(type) {
                this.keybinds = {
                    keyup: {},
                    keydown: {},
                    mousedown: {},
                    mouseup: {},
                    mousemove: () => {},
                };
                this.emitter = new EventEmitter();

                this.bindDefaultListeners();
                this.bindTypeHandlers(type);
            };
            bindDefaultListeners() {
                this.addPacketHandler(0, (data) => {
                    try {
                        if (data.entities[this.player?.uid].name) {
                            this.player.targetTick = data.entities[this.player.uid];
                        };
                        for (let g in this.player.targetTick) {
                            if (this.player.targetTick[g] !== data.entities[this.player.uid][g] && data.entities[this.player.uid][g] !== undefined) {
                                this.player.targetTick[g] = data.entities[this.player.uid][g];
                            };
                        };
                        if (this.player.targetTick.petUid) {
                            if (data.entities?.[this.player.targetTick.petUid]?.model) {
                                this.player.petTick = data.entities[this.player.targetTick.petUid];
                            }
                            for (let g in this.player.petTick) {
                                if (this.player.petTick[g] !== data.entities?.[this.player.targetTick.petUid][g] && data.entities?.[this.player.targetTick.petUid][g] !== undefined) {
                                    this.player.petTick[g] = data.entities[this.player.targetTick.petUid][g];
                                };
                            };
                        };

                        for (let i in data.entities) {
                            if (["Tree", "Stone", "NeutralCamp"].indexOf(data.entities[i].model) > -1) {
                                game.world.createEntity(data.entities[i]);
                            };
                        };
                    } catch {};
                });
                this.addPacketHandler(4, (e) => {
                    if (e.allowed) {
                        this.player.uid = e.uid;

                        this.parent.updateActiveSocketsAmount();
                        this.updateStatus("Open");

                        console.log(`%c [SOCKET ${this.identifiers.id}]`, 'color: #54ebd9', '\n', `${e.players + 1}/32 players`);

                        this.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: 1});
                        this.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: 1});

                        this.sendInput({left: 1, up: 1});
                        this.sendInput({space: 1});
                    } else {
                        console.log(`%c [SOCKET ${this.identifiers.id}]`, 'color: #54ebd9', '\n', `32/32 players`);
                        this.updateStatus("Population Full");
                    };
                });
                this.addPacketHandler(5, () => {
                    setTimeout(() => {
                        if (this.data.opcode === 5) this.ws.close();
                    }, 5000);
                });
                this.addPacketHandler(7, () => {
                    const now = new Date();
                    this.ping = (now.getTime() - this.pingStart.getTime()) / 2;
                    this.pingStart = null;
                    this.pingCompletion = now;
                });
                this.addPacketHandler(9, (e) => {
                    this.updateStatus("Open");
                    switch(e.name) {
                        case "PartyShareKey":
                            if (!this.player.partyShareKey) {
                                this.sendRpc({
                                    name: "JoinPartyByShareKey",
                                    partyShareKey: game.ui.getPlayerPartyShareKey()
                                });
                                this.minimapDisplay.classList.add('hud-map-player');
                                this.minimapDisplay.style.display = "block";
                                getClass('hud-map')[0].appendChild(this.minimapDisplay);
                            };
                            this.player.partyShareKey = e.response.partyShareKey;
                            this.minimapDisplay.style.display = (e.response.partyShareKey == game.ui.getPlayerPartyShareKey()) ? "none" : "block";
                            break;
                        case "SetItem":
                            this.player.inventory[e.response.itemName] = e.response;
                            if (!this.player.inventory[e.response.itemName].stacks) {
                                delete this.player.inventory[e.response.itemName];
                            };
                            break;
                        case "Leaderboard":
                            this.sendRpc(game.metrics.metrics);

                            this.minimapDisplay.style.left = (Math.round(this.player?.targetTick?.position?.x) / 24000 * 100) + '%';
                            this.minimapDisplay.style.top = (Math.round(this.player?.targetTick?.position?.y) / 24000 * 100) + '%';
                            break;
                    };
                });
            };
            bindKeys() {
                for (let event in this.keybinds) {
                    switch(event) {
                        case "keyup":
                        case "keydown":
                            document.addEventListener(event, (e) => {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (let keyCode in this.keybinds[event]) {
                                        if (e.keyCode == keyCode && this.ws.readyState == 1) this.keybinds[event][keyCode].call(this, e);
                                    };
                                }
                            });
                            break;
                        case "mouseup":
                        case "mousedown":
                            document.addEventListener(event, (e) => {
                                for (let which in this.keybinds[event]) {
                                    if (e.which == which && this.ws.readyState == 1) this.keybinds[event][which].call(this, e);
                                };
                            });
                            break;
                        case "mousemove":
                            document.addEventListener(event, (e) => {
                                this.ws.readyState == 1 && this.keybinds[event].call(this, e);
                            });
                            break;
                    };
                };
            };
            bindTypeHandlers(type) {
                if (this.parent[type]) {
                    this.typeHandlers = [];
                    this.typeSpecificVariables = {};

                    typeof this.parent[type].init == "function" && this.parent[type].init.call(this);

                    const handlersForType = this.parent[type];
                    for (const handler in handlersForType) {
                        if (typeof handlersForType[handler] !== "function" || ["init", "deinit"].indexOf(handler) > -1) continue;
                        this.typeHandlers.push(handler);
                    };
                    for (const handler of this.typeHandlers) this.addPacketHandler(PacketIds_1.default[handler], (data) => { handlersForType[handler].call(this, data, handlersForType); });

                    if (this.parent[type].keybinds) {
                        Object.assign(this.keybinds, this.parent[type].keybinds);
                    };
                };
            };
            switchType(type) {
                typeof this.parent[this.identifiers.type].deinit == "function" && this.parent[this.identifiers.type].deinit.call(this);
                this.identifiers.type = type;
                this.resetListeners(type);
            };
            updateStatus(status) {
                this.statusDisplay.innerHTML = `
                    <strong>${this.identifiers.name}</strong>
                    <select style="position: absolute;top: -10px;right: -5px;width: 130px;background: unset;box-shadow: none;color:white;" id="switch${this.identifiers.id}" ${status === "Open" ? "" : "disabled"}>
                        <option value="Multibox" ${this.identifiers.type == "Multibox" ? "selected" : ""}>Multibox</option>
                        <option value="Filler" ${this.identifiers.type == "Filler" ? "selected" : ""}>Filler</option>
                        <option value="PlayerTrick" ${this.identifiers.type == "PlayerTrick" ? "selected" : ""}>Player Trick</option>
                        <option value="AITO" ${this.identifiers.type == "AITO" ? "selected" : ""}>AITO</option>
                    </select><br>
                    State: <strong style="color: ${this.parent.statusEnum[status]};">[${status}]</strong>${["Population Full", "Failed", "Closed"].indexOf(status) == -1 ? `, ping: ${this.ping}ms` : `, created: ${getClock(new Date(this.timeCreation))}`}<br>
                    ${status === "Open" ? `
                    UID: ${this.player.uid}, partyId: <strong>${this.player.targetTick.partyId || 0}</strong><br>
                    <strong>W: ${counter(this.player?.targetTick?.wood || 0)}, S: ${counter(this.player?.targetTick?.stone || 0)}, G: ${counter(this.player?.targetTick?.gold || 0)}, T: ${counter(this.player?.targetTick?.token || 0)}</strong><br>
                    <a href="javascript:void(0);" style="margin: 5px 0 0 0;color: red;" onclick="game.script.sockets.shared.all['${this.identifiers.id}'].ws.close();">Delete</a>
                    ${this.identifiers.type == "Multibox" ? `
                    ${this.player.targetTick.partyId != game.ui.playerPartyId && this.player.targetTick.partyId ? `
                    <a href="javascript:void(0);"
                       style="margin: 5px 0 0 0;color: lightblue;"
                       onclick="game.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: game.script.sockets.shared.all['${this.identifiers.id}'].player.partyShareKey});"
                    >Join Party</a>
                    ` : ""}
                    ` : ""}
                    <!-- Type: <select href="javascript:void(0);" style="margin: 5px 0 0 0;color: red;" onselect="game.script.sockets.shared.all['${this.identifiers.id}'].ws.close();">Switch...</select> -->
                    <!--
                    <a href="javascript:void(0);"
                       style="margin: 5px 0 0 0;color: lightblue;"
                       class="elem-is-disabled"
                       id="respawnAlt#${this.identifiers.id}"
                       onclick="
                           game.script.cloneSockets.allSockets[${this.identifiers.id}].network.sendInput({respawn: 1});
                           document.getElementById('respawnAlt#${this.identifiers.id}').classList.add('elem-is-disabled');
                       "
                    >Respawn</a> -->
                    ` : ""}
                `;
                if (status === "Connecting" && !getId(`alt${this.identifiers.id}`)) {
                    this.statusDisplay.id = `alt${this.identifiers.id}`;
                    getId("clone-status").appendChild(this.statusDisplay);
                };
                getId(`switch${this.identifiers.id}`).onchange = ({target}) => {
                    this.switchType(target.value);
                };
            };
        },
        createSocket: function(type) {
            const socketId = genUUID(),
                  socketName = this.shared.options.randomizeName.enabled ? this.shared.availableNames.shift() : game.ui.playerTick.name;
            this.shared.all[socketId] = new this.Socket(`wss://${game.network.connectionOptions.hostname}:443/`, {
                id: socketId,
                name: socketName,
                type,
            });
        },
        Builder: {

        },
        Multibox: {
            init: function() {
                this.typeSpecificVariables.mouseData = {
                    yaw: 1,
                    worldX: 1,
                    worldY: 1,
                    distance: 1,

                    mouseUp: 1,
                    mouseDown: 0,
                    mousePos: {x: 0, y: 0},
                };

                this.typeSpecificVariables.overrides = {
                    autoMove: false,
                };

                this.typeSpecificVariables.FOLLOW_ACCURACY = 50;
                this.typeSpecificVariables.FOLLOW_TYPE = {
                    NONE: 0,
                    MOUSE: 1,
                    LOCK: 2,
                    PLAYER: 3,
                };
                this.typeSpecificVariables.autoMove = parseInt(getId("movementTypeOptions").value); // this.parent.shared.overridables.autoMove;
                this.typeSpecificVariables.followPoint = {x: 0, y: 0};

                this.typeSpecificVariables.autoHeal = {
                    hasHealed: false,
                    lastTickHealth: 100,
                };

                const shopItems = ['Pickaxe', 'Spear', 'Bow', 'Bomb', 'ZombieShield'];
                for (let i in shopItems) {
                    this.parent.addUiHook(this.identifiers.id, `#hud-menu-shop > div.hud-shop-grid > a:nth-child(${parseInt(i) + 1})`, "click", () => {
                        const item = shopItems[i];
                        if (this.parent.shared.options.control.enabled && this.ws.readyState == 1) {
                            this.sendRpc({
                                name: "BuyItem",
                                itemName: item,
                                tier: this.player.inventory[item] ? this.player.inventory[item].tier + 1 : 1
                            });
                        };
                    });
                };

                const itemArray = ['Pickaxe', 'Spear', 'Bow', 'Bomb', 'HealthPotion', 'PetHealthPotion', 'PetWhistle'];
                for (let i in itemArray) {
                    this.parent.addUiHook(this.identifiers.id, `#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(${parseInt(i) + 1})`, "click", () => {
                        if (this.parent.shared.options.control.enabled && this.ws.readyState == 1) {
                            this.player.inventory[itemArray[i]] && this.sendRpc({
                                name: "EquipItem",
                                itemName: itemArray[i],
                                tier: this.player.inventory[itemArray[i]].tier
                            });
                        };
                    });
                };
            },
            deinit: function() {
                const shopItems = ['Pickaxe', 'Spear', 'Bow', 'Bomb', 'ZombieShield'];
                for (let i in shopItems) {
                    this.parent.removeUiHook(this.identifiers.id, `#hud-menu-shop > div.hud-shop-grid > a:nth-child(${parseInt(i) + 1})`, "click");
                };

                const itemArray = ['Pickaxe', 'Spear', 'Bow', 'Bomb', 'HealthPotion', 'PetHealthPotion', 'PetWhistle'];
                for (let i in itemArray) {
                    this.parent.removeUiHook(this.identifiers.id, `#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(${parseInt(i) + 1})`, "click");
                };
            },
            keybinds: {
                keyup: {
                    87: function() {
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({up: 0});
                        };
                    },
                    83: function() {
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({down: 0});
                        };
                    },
                    68: function() {
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({right: 0});
                        };
                    },
                    65: function() {
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({left: 0});
                        };
                    },
                    81: function(data) {
                        if (this.parent.shared.options.control.enabled) {
                            let nextWeapon = 'Pickaxe',
                                weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'],
                                foundCurrent = false;
                            for (let i in weaponOrder) {
                                if (foundCurrent) {
                                    if (this.player.inventory[weaponOrder[i]]) {
                                        nextWeapon = weaponOrder[i];
                                        break;
                                    };
                                } else if (weaponOrder[i] == this.player.targetTick.weaponName) {
                                    foundCurrent = true;
                                };
                            };
                            this.sendRpc({name: 'EquipItem', itemName: nextWeapon, tier: this.player.inventory[nextWeapon].tier});
                        };
                    },
                    72: function() {
                        this.parent.shared.options.control.enabled && this.sendRpc({name: 'LeaveParty'});
                    },
                    74: function() {
                        this.parent.shared.options.control.enabled && this.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey});
                    },
                    32: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.sendInput({space: 0});
                        };
                    },
                    82: function() {
                        if (this.parent.shared.options.control.enabled) {
                            const buildingOverlay = game.ui.components.BuildingOverlay;
                            const buildings = game.ui.buildings;
                            if (buildingOverlay.shouldUpgradeAll) {
                                for (let i in buildings) {
                                    if (buildings[i].type == buildingOverlay.buildingId && buildings[i].tier == buildingOverlay.buildingTier) {
                                        this.sendRpc({name: "UpgradeBuilding", uid: buildings[i].uid});
                                    };
                                };
                            } else if (buildingOverlay.buildingUid) {
                                this.sendRpc({name: "UpgradeBuilding", uid: buildingOverlay.buildingUid});
                            };
                        };
                    },
                    89: function() {
                        if (this.parent.shared.options.control.enabled) {
                            const buildingOverlay = game.ui.components.BuildingOverlay;
                            if (buildingOverlay.buildingUid) {
                                this.sendRpc({name: "DeleteBuilding", uid: buildingOverlay.buildingUid});
                            };
                        };
                    },
                    76: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.sendRpc({
                                name: "BuyItem",
                                itemName: "PetRevive",
                                tier: 1
                            });
                            this.sendRpc({
                                name: "EquipItem",
                                itemName: "PetRevive",
                                tier: 1
                            });
                        };
                    },
                    186: function() {
                        if (this.parent.shared.options.control.enabled && this.player.petTick) {
                            this.sendRpc({name: "DeleteBuilding", uid: this.player.petTick.uid});
                        }
                    }
                    /*
                    221: function() {
                        this.parent.shared.options.control.enabled && game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: this.player.partyShareKey});
                    }
                    */
                },
                keydown: {
                    87: function(e) {
                        if (e.repeat) return;
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({up: 1, down: 0});
                        };
                    },
                    83: function(e) {
                        if (e.repeat) return;
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({up: 0, down: 1});
                        };
                    },
                    68: function(e) {
                        if (e.repeat) return;
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({right: 1, left: 0});
                        };
                    },
                    65: function(e) {
                        if (e.repeat) return;
                        if (this.parent.shared.options.control.enabled && !this.typeSpecificVariables.autoMove) {
                            this.sendInput({right: 0, left: 1});
                        };
                    },
                    32: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.sendInput({space: 1});
                        };
                    },
                    82: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1});
                            this.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1});
                        };
                    },
                    222: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.sendRpc({
                                name: "EquipItem",
                                itemName: "PetCARL",
                                tier: this.player.inventory.PetCARL.tier
                            });
                            this.sendRpc({
                                name: "BuyItem",
                                itemName: "PetCARL",
                                tier: this.player.inventory.PetCARL.tier + 1
                            });
                        };
                    },
                },
                mouseup: {
                    1: function() {
                        if (this.parent.shared.options.control.enabled) {
                            this.typeSpecificVariables.mouseData.mouseDown = 0;
                            this.typeSpecificVariables.mouseData.mouseUp = 1;
                            const {worldX, worldY, distance} = this.typeSpecificVariables.mouseData;
                            this.sendInput({mouseUp: 1, worldX, worldY, distance});
                        };
                    },
                    3: function(e) {
                        if (this.parent.shared.options.control.enabled) {
                            if (this.typeSpecificVariables.autoMove == this.typeSpecificVariables.FOLLOW_TYPE.LOCK) {
                                this.typeSpecificVariables.followPoint = game.renderer.screenToWorld(e.clientX, e.clientY);
                            };
                        };
                    },
                },
                mousedown: {
                    3: function() {
                        /*
                        const mouseToWorld = game.renderer.screenToWorld(e.clientX, e.clientY);
                        const options = game.script.options;
                        if (!ws.isclosed && ws.local.isOnControl) {
                            if (e.which === 3) {
                                ws.local.moveaway = true;
                                const packet = {};
                                if (ws.entities.myPlayer.position.y - mouseToWorld.y > 1) {
                                    packet.down = 0;
                                } else {
                                    packet.down = 1;
                                }
                                if (-ws.entities.myPlayer.position.y + mouseToWorld.y > 1) {
                                    packet.up = 0;
                                } else {
                                    packet.up = 1;
                                }
                                if (-ws.entities.myPlayer.position.x + mouseToWorld.x > 1) {
                                    packet.left = 0;
                                } else {
                                    packet.left = 1;
                                }
                                if (ws.entities.myPlayer.position.x - mouseToWorld.x > 1) {
                                    packet.right = 0;
                                } else {
                                    packet.right = 1;
                                }
                                ws.move(packet);
                            }
                        }
                        */
                    },
                    1: function() {
                        if (this.parent.shared.options.control.enabled) {
                            if (this.parent.shared.options.raid.enabled) {
                                if (this.parent.shared.options.raid.nearestToCursor !== this.player.uid) {
                                    this.sendInput({mouseUp: 0});
                                }
                                if (this.parent.shared.options.raid.nearestToCursor === this.player.uid) {
                                    this.sendInput({space: 1});
                                    this.sendInput({space: 0});
                                    this.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                                }
                                if (game.ui.playerPartyShareKey === this.player.partyShareKey && this.player.targetTick.dead) {
                                    this.sendRpc({name: "LeaveParty"});
                                    this.sendInput({mouseUp: 0});
                                } else {
                                    this.sendInput({mouseUp: 0});
                                }
                            } else {
                                this.typeSpecificVariables.mouseData.mouseDown = 1;
                                this.typeSpecificVariables.mouseData.mouseUp = 0;
                                const {yaw, worldX, worldY, distance} = this.typeSpecificVariables.mouseData;
                                this.sendInput({mouseDown: yaw, worldX, worldY, distance});
                            };
                        };
                    }
                },
                mousemove: function(e) {
                    if (this.parent.shared.options.control.enabled) {
                        this.typeSpecificVariables.mouseData.mousePos = {x: e.clientX, y: e.clientY};
                        const worldMouse = game.renderer.screenToWorld(e.clientX, e.clientY);
                        if (this.typeSpecificVariables.autoMove == this.typeSpecificVariables.FOLLOW_TYPE.MOUSE) this.typeSpecificVariables.followPoint = worldMouse;

                        if (this.player?.targetTick?.position && !this.player?.targetTick?.dead) {
                            const xPos = (-this.player.targetTick.position.x + worldMouse.x) * 100,
                                  yPos = (-this.player.targetTick.position.y + worldMouse.y) * 100,
                                  yaw = game.inputPacketCreator.screenToYaw(xPos, yPos);

                            if (this.typeSpecificVariables.mouseData.yaw != yaw) {
                                const distance = game.inputPacketCreator.distanceToCenter(xPos, yPos) / 100;

                                this.typeSpecificVariables.mouseData.yaw = yaw;
                                this.typeSpecificVariables.mouseData.worldX = xPos;
                                this.typeSpecificVariables.mouseData.worldY = yPos;
                                this.typeSpecificVariables.mouseData.distance = distance;

                                if (this.typeSpecificVariables.mouseData.mouseDown) {
                                    this.sendInput({mouseMovedWhileDown: yaw, worldX: xPos, worldY: yPos, distance});
                                }
                                if (this.typeSpecificVariables.mouseData.mouseUp) {
                                    this.sendInput({mouseMoved: yaw, worldX: xPos, worldY: yPos, distance});
                                };
                                // game.world.entities[this.player.uid].targetTick.aimingYaw = game.world.entities[this.player.uid].fromTick.aimingYaw = yaw;
                            };
                        };
                    };
                }
            },
            PACKET_ENTITY_UPDATE: function(data, parent) {
                if (this.player.targetTick.dead) {
                    this.typeSpecificVariables.mouseData.yaw = (this.typeSpecificVariables.mouseData.yaw + 1) % 360;
                    this.sendInput({mouseMoved: this.typeSpecificVariables.mouseData.yaw});
                }
                if (game.world.localPlayer.entity.fromTick.position.x != game.world.localPlayer.entity.targetTick.position.x || game.world.localPlayer.entity.fromTick.position.y != game.world.localPlayer.entity.targetTick.position.y) {
                    if (this.typeSpecificVariables.autoMove == this.typeSpecificVariables.FOLLOW_TYPE.MOUSE) {
                        this.typeSpecificVariables.followPoint = game.renderer.screenToWorld(
                            this.typeSpecificVariables.mouseData.mousePos.x,
                            this.typeSpecificVariables.mouseData.mousePos.y
                        );
                    };
                    if (this.typeSpecificVariables.autoMove == this.typeSpecificVariables.FOLLOW_TYPE.PLAYER) {
                        this.typeSpecificVariables.followPoint = game.world.localPlayer.entity.targetTick.position;
                    };
                };
                // if (this.parent.shared.options.control.enabled) {
                if (this.typeSpecificVariables.autoMove) {
                    const acc = this.typeSpecificVariables.FOLLOW_ACCURACY,
                          point = this.typeSpecificVariables.followPoint,
                          position = this.player.targetTick.position,
                          packet = {};

                    if (position.y - point.y > acc) {
                        packet.down = 0;
                    } else {
                        packet.down = 1;
                    }
                    if (-position.y + point.y > acc) {
                        packet.up = 0;
                    } else {
                        packet.up = 1;
                    }
                    if (-position.x + point.x > acc) {
                        packet.left = 0;
                    } else {
                        packet.left = 1;
                    }
                    if (position.x - point.x > acc) {
                        packet.right = 0;
                    } else {
                        packet.right = 1;
                    }
                    this.sendInput(packet);
                };
                // };

                if (game.options.options.AHRC.enabled && game.options.options.AHRC.multibox) {
                    for (let uid in this.player.buildings) {
                        let obj = this.player.buildings[uid];
                        if (obj.type == "Harvester") {
                            const amount = obj.tier * 0.05 - 0.02;
                            const ahrcOptions = getId('ahrcOptions');
                            ahrcOptions.value !== "c" && this.sendRpc({name: "AddDepositToHarvester", uid: obj.uid, deposit: amount});
                            ahrcOptions.value !== "h" && this.sendRpc({name: "CollectHarvester", uid: obj.uid});
                        };
                    };
                };
                if (game.options.options.autoHeal.enabled && game.options.options.autoHeal.multibox) {
                    const healThreshold = getId("auto-heal-threshold").valueAsNumber;

                    if (!this.player.inventory.HealthPotion && this.player.targetTick.gold >= 100) {
                        this.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1});
                    }
                    const playerHealth = (this.player.targetTick.health / this.player.targetTick.maxHealth) * 100;
                    this.typeSpecificVariables.autoHeal.hasHealed = this.typeSpecificVariables.autoHeal.lastTickHealth <= playerHealth;
                    if (playerHealth <= healThreshold && !this.typeSpecificVariables.autoHeal.hasHealed) {
                        this.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1});
                    }

                    const petHealth = (this.player?.petTick?.health / this.player?.petTick?.maxHealth) * 100;
                    if (petHealth <= healThreshold) {
                        this.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                        this.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                    }
                    this.typeSpecificVariables.autoHeal.lastTickHealth = playerHealth;
                }
            },
        },
        Filler: {
            PACKET_RPC: function(data, parent) {
                this.sendInput({left: 1, up: 1, right: 0, down: 0});
                // this.sendInput({space: 1});

                if (this.data.name == "Dead") this.sendInput({respawn: 1});
            },
        },
        PlayerTrick: {
            init: function() {
                this.typeSpecificVariables.playerTrickTimeouts = {
                    inull: true,
                    i1: true,
                    i2: true,
                    i3: true
                };
                this.typeSpecificVariables.dayTicker = 0;
            },
            getIsZombiesActive: function () {
                let isZombiesActive = false;
                for (let i of game.renderer.npcs.attachments) {
                    if (i.fromTick.model !== "NeutralTier1") {
                        if (i.fromTick.entityClass == "Npc") {
                            isZombiesActive = true;
                            return isZombiesActive;
                        }
                    }
                }
                return isZombiesActive;
            },
            getIsNextWaveActive: function () {
                let isNextWaveActive = false;
                const allComingBossWaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121].map(wave => wave - 1);
                for (let wave of allComingBossWaves) {
                    game.ui.playerTick.wave == wave && (isNextWaveActive = true);
                }
                return isNextWaveActive;
            },
            getIsWaveActive: function () {
                let isWaveActive = false;
                const allBossWaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];
                for (let wave of allBossWaves) {
                    game.ui.playerTick.wave == wave && (isWaveActive = true);
                }
                return isWaveActive;
            },
            PACKET_RPC: function(data, parent) {
                if (this.data.name == "DayCycle") {
                    this.typeSpecificVariables.tickData = this.data.response;
                }
            },
            PACKET_ENTITY_UPDATE: function(data, parent) {
                this.typeSpecificVariables.currentTick = data.tick;

                let dayRatio = 0,
                    nightRatio = 0,
                    barWidth = 130;
                if (this.typeSpecificVariables.tickData) {
                    if (this.typeSpecificVariables.tickData.dayEndTick) {
                        if (this.typeSpecificVariables.tickData.dayEndTick > 0) {
                            var dayLength = this.typeSpecificVariables.tickData.dayEndTick - this.typeSpecificVariables.tickData.cycleStartTick;
                            var dayTicksRemaining = this.typeSpecificVariables.tickData.dayEndTick - this.typeSpecificVariables.currentTick;
                            dayRatio = 1 - dayTicksRemaining / dayLength;
                        }
                    } else if (this.typeSpecificVariables.tickData.nightEndTick > 0) {
                        var nightLength = this.typeSpecificVariables.tickData.nightEndTick - this.typeSpecificVariables.tickData.cycleStartTick;
                        var nightTicksRemaining = this.typeSpecificVariables.tickData.nightEndTick - this.typeSpecificVariables.currentTick;
                        dayRatio = 1;
                        nightRatio = 1 - nightTicksRemaining / nightLength;
                    }
                    var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * - barWidth;
                    var offsetPosition = currentPosition + barWidth / 2;
                    if (offsetPosition) this.typeSpecificVariables.dayTicker = Math.round(offsetPosition);
                }

                // if (game.options.options.playerTrick) {
                if (parent.getIsWaveActive() && parent.getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                    if (this.typeSpecificVariables.playerTrickTimeouts.inull) {
                        this.typeSpecificVariables.playerTrickTimeouts.inull = false;
                        this.sendRpc({name: "LeaveParty"});
                        setTimeout(() => { this.typeSpecificVariables.playerTrickTimeouts && (this.typeSpecificVariables.playerTrickTimeouts.inull = true); }, 250);
                    }
                }
                if (this.typeSpecificVariables.dayTicker < -18 && this.typeSpecificVariables.dayTicker >= -23 && !this.typeSpecificVariables.tickData.isDay && parent.getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                    if (this.typeSpecificVariables.playerTrickTimeouts.i1) {
                        this.typeSpecificVariables.playerTrickTimeouts.i1 = false;
                        this.sendRpc({name: "LeaveParty"});
                        setTimeout(() => { this.typeSpecificVariables.playerTrickTimeouts && (this.typeSpecificVariables.playerTrickTimeouts.i1 = true); }, 250);
                    }
                }
                if (!parent.getIsZombiesActive() && game.ui.playerPartyMembers.length !== 4 && !parent.getIsNextWaveActive()) {
                    if (this.typeSpecificVariables.playerTrickTimeouts.i2) {
                        this.typeSpecificVariables.playerTrickTimeouts.i2 = false;
                        this.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                        setTimeout(() => { this.typeSpecificVariables.playerTrickTimeouts && (this.typeSpecificVariables.playerTrickTimeouts.i2 = true); }, 250);
                    }
                }
                if (this.typeSpecificVariables.dayTicker > 18 && this.typeSpecificVariables.dayTicker <= 23 && parent.getIsZombiesActive() && this.typeSpecificVariables.tickData.isDay && game.ui.playerPartyMembers.length !== 4) {
                    if (this.typeSpecificVariables.playerTrickTimeouts.i3) {
                        this.typeSpecificVariables.playerTrickTimeouts.i3 = false;
                        this.sendRpc({name: "LeaveParty"});
                        setTimeout(() => { this.typeSpecificVariables.playerTrickTimeouts && (this.typeSpecificVariables.playerTrickTimeouts.i3 = true); }, 250)
                    }
                }
                // }
            },
        },
        AITO: {
            lastSocket: {},
            PACKET_ENTITY_UPDATE: function(data, parent) {
                if (this.player.partyShareKey) {
                    if (this.player.partyShareKey != game.ui.getPlayerPartyShareKey()) {
                        this.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });
                    } else if (this.player.targetTick.gold >= 10000) {
                        this.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    };
                };
            },
            PACKET_PRE_ENTER_WORLD: function(data, parent) {
                parent.lastSocket[this.identifiers.id]?.ws?.readyState === 1 && parent.lastSocket[this.identifiers.id].ws.close();
            },
            PACKET_RPC: function(data, parent) {
                this.sendInput({left: 1, up: 1, right: 0, down: 0});
                // this.sendInput({space: 1});

                if (this.data.name == "DayCycle") {
                    this.typeSpecificVariables.isDay = this.data.response.isDay;
                    if (!this.typeSpecificVariables.isDay) {
                        if (this.ws.readyState === 1 && this.typeSpecificVariables.verified === true) {
                            parent.lastSocket[this.identifiers.id] = this;
                            this.parent.shared.all[this.identifiers.id] = new this.parent.Socket(
                                `wss://${game.network.connectionOptions.hostname}:443/`,
                                this.identifiers
                            );
                        }
                    } else this.typeSpecificVariables.verified = true;
                }
                if (this.data.name == "Dead") this.sendInput({respawn: 1});
            },
        },
    },
    movementCopy: {
        handlers: [{type: "entityUpdate", names: "onTick"}, {type: "keybind", names: "keyup"}],
        targetLastPos: null,
        target: null,
        onTick: function({entities}) {
            if (game.options.options.movementCopy) {
                if (!this.target) {
                    const targets = [];
                    for (let entity of game.renderer.npcs.attachments) {
                        if (entity.uid === game.world.myUid || entity.targetTick.dead == 1) continue;
                        const { position, uid } = entity.targetTick;
                        entity.entityClass === "PlayerEntity" && targets.push({position, uid});
                    };
                    if (targets.length > 0) {
                        const myPos = game.ui.playerTick.position;
                        targets.sort((a, b) => {
                            const distThisToA = measureDistance(myPos, a.position);
                            const distThisToB = measureDistance(myPos, b.position);

                            if (distThisToA < distThisToB) return -1;
                            else if (distThisToA > distThisToB) return 1;

                            return 0;
                        });
                        this.target = targets[0].uid;
                    };
                };

                const targetInCurrentTick = entities[this.target];
                const targetInWorldTick = game.world.entities[this.target];
                const currentTargetPosition = targetInCurrentTick?.position;
                const lastTargetPosition = this.targetLastPos || targetInWorldTick.targetTick.position;

                if (currentTargetPosition) {
                    const nextMove = predictDirection(lastTargetPosition, currentTargetPosition);
                    nextMove && game.network.sendInput(nextMove);
                    this.targetLastPos = currentTargetPosition;
                };

                const {position: playerPos} = game.world.entities[game.world.myUid].targetTick;
                const distFromPlayerToTarget = measureDistance(playerPos, targetInWorldTick.targetTick.position);
                if (distFromPlayerToTarget > 48) {
                    const nextMove = predictDirection(playerPos, targetInWorldTick.targetTick.position, 48);
                    nextMove && game.network.sendInput(nextMove);
                };
            };
        },
        keyup: function(e) {
            if (e.key == "[") getId("toggle-movementCopy").click();
        },
    },
    spectate: {
        handlers: [{type: "rpc", names: ["Dead"]}, {type: "keybind", names: ["keydown", "keyup"]}],
        cameraPos: {x: 0, y: 0},
        navigationKeys: {
            // numpad
            104: "up",
            98: "down",
            102: "right",
            100: "left",
            // wasd
            87: "up",
            83: "down",
            68: "right",
            65: "left",
            // keypad
            38: "up",
            40: "down",
            39: "right",
            37: "left"
        },
        direction: {
            up: { axis: "y", value: -96 },
            down: { axis: "y", value: 96 },
            right: { axis: "x", value: 96 },
            left: { axis: "x", value: -96 }
        },
        moveCameraTo: function({x, y}) {
            game.renderer.follow({ getPositionX: () => x, getPositionY: () => y });
        },
        init: function() {
            this.spectatorNote = document.createElement('p');
            this.spectatorNote.innerHTML = `Press Esc to stop spectating...<br>Use arrow keys or WASD to navigate.`;
            this.spectatorNote.style.display = "none";
            this.spectatorNote.style.color = "white";
            this.spectatorNote.style.opacity = '0.5';
            this.spectatorNote.style.textAlign = "center";
            getClass('hud-top-center')[0].appendChild(this.spectatorNote);

            getId('hud-spectate-btn').onclick = () => {
                game.options.options.spectate = true;
                this.spectatorNote.style.display = "block";
                getId("hud-respawn").style.display = "none";
            };
        },
        Dead: function() {
            this.cameraPos = game.ui.playerTick.position;
        },
        keyup: function(e) {
            if (e.key == "Escape") {
                if (game.options.options.spectate) {
                    game.options.options.spectate = false;
                    this.spectatorNote.style.display = "none";
                    getId("hud-respawn").style.display = "block";
                    game.renderer.follow(game.world.entities[game.world.myUid]);
                }
            }
        },
        keydown: function(e) {
            if (!game.options.options.spectate) return;
            if (e.keyCode in this.navigationKeys) {
                const {axis, value} = this.direction[this.navigationKeys[e.keyCode]];
                this.cameraPos[axis] += value;
                this.moveCameraTo(this.cameraPos);
            };
        },
    },
    dragBox: {
        handlers: [{type: "keybind", names: "keydown"}],
        buildingModels: ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"],
        firstDragMouse: {
            pos: {x: 0, y: 0},
            hasDragged: false
        },
        mouseDragPos: {x: 0, y: 0},
        staticWorldPos: undefined,
        dragBoxElem: undefined,
        dragBoxMenuElem: undefined,
        resetData: function() {
            this.firstDragMouse = {
                pos: {x: 0, y: 0},
                hasDragged: false
            };
            this.mouseDragPos = {x: 0, y: 0};
        },
        isWithinSelection: function({x, y}, {pos1, pos2}) {
            return (x > Math.min(pos1.x, pos2.x) && x < Math.max(pos1.x, pos2.x) && y > Math.min(pos1.y, pos2.y) && y < Math.max(pos1.y, pos2.y));
        },
        findStash: function({pos1, pos2}) {
            return game.renderer.scenery.attachments.find((entity) => {
                if (entity.fromTick.model == "GoldStash") {
                    const building = entity.targetTick.position;
                    if (this.isWithinSelection(building, {pos1, pos2})) return entity;
                }
            });
        },
        cancelDragBox: function() {
            this.dragBoxMenuElem.remove();
            this.dragBoxElem.remove();
            this.staticWorldPos = undefined;
            window.disableZoom = false;
        },
        init: function() {
            getId("hud").addEventListener("mousedown", this.onMouseDown.bind(this));
            getId("hud").addEventListener("mousemove", this.onMouseMove.bind(this));
            getId("hud").addEventListener("mouseup", this.onMouseUp.bind(this));
            game.renderer.on("cameraUpdate", this.onCameraUpdate.bind(this));
        },
        onMouseDown: function(e) {
            if (this.firstDragMouse.hasDragged || !game.options.options.dragBox || !game.world.inWorld) return;
            window.disableZoom = true;
            this.firstDragMouse = {
                pos: {x: e.clientX, y: e.clientY},
                hasDragged: true
            };
            this.dragBoxElem = document.createElement('div');
            this.dragBoxElem.classList.add('dragBox');
            this.dragBoxElem.style.top = `${e.clientY}px`;
            this.dragBoxElem.style.left = `${e.clientX}px`;
            getId("hud").appendChild(this.dragBoxElem);
        },
        onMouseMove: function(e) {
            if (!this.firstDragMouse.hasDragged || !game.world.inWorld) return;
            // clearTimeout(this.dragTimeout);
            this.mouseDragPos = {x: e.clientX, y: e.clientY};
            this.dragBoxElem.style.top = `${Math.min(this.mouseDragPos.y, this.firstDragMouse.pos.y)}px`;
            this.dragBoxElem.style.left = `${Math.min(this.mouseDragPos.x, this.firstDragMouse.pos.x)}px`;
            this.dragBoxElem.style.width = `${Math.abs(this.mouseDragPos.x - this.firstDragMouse.pos.x)}px`;
            this.dragBoxElem.style.height = `${Math.abs(this.mouseDragPos.y - this.firstDragMouse.pos.y)}px`;
            // this.dragTimeout = setTimeout(function() { this.onMouseUp(e); }.bind(this), 2000);
        },
        onMouseUp: function(e) {
            if (!this.firstDragMouse.hasDragged || !game.world.inWorld) return;
            // clearTimeout(this.dragTimeout);
            const lastDragPos = { x: e.clientX, y: e.clientY };
            const oldPos = { x: this.firstDragMouse.pos.x, y: this.firstDragMouse.pos.y };
            this.staticWorldPos = game.renderer.screenToWorld(oldPos.x, oldPos.y);
            if (Math.hypot(lastDragPos.x - oldPos.x, lastDragPos.y - oldPos.y) < 50) {
                this.dragBoxElem.remove();
                this.resetData();
                this.staticWorldPos = undefined;
                return;
            }
            this.dragBoxMenuElem = document.createElement('div');
            this.dragBoxMenuElem.classList.add('dragBoxMenu');
            this.dragBoxMenuElem.style.top = `${lastDragPos.y}px`;
            this.dragBoxMenuElem.style.left = `${lastDragPos.x}px`;
            this.dragBoxMenuElem.innerHTML = `
                <button id="saveSelection">Save Towers</button>
                <button id="delWithin">Delete Selection</button>
                <button id="cancelDragBox">Cancel</button>
                <small style="color: red; display: none;" id="selectionErrorMessage">Cannot find any base. Please try again.</small>
            `;
            getId("hud").appendChild(this.dragBoxMenuElem);

            game.options.options.dragBox = false;
            this.resetData();

            const pos1 = this.staticWorldPos;
            const pos2 = game.renderer.screenToWorld(lastDragPos.x, lastDragPos.y);

            getId("cancelDragBox").onclick = this.cancelDragBox.bind(this);
            getId("delWithin").onclick = function(e) {
                const roundedX = Math.round(pos1.x / 48) * 48;
                const roundedY = Math.round(pos1.y / 48) * 48;

                const deltaX = Math.round(Math.abs(pos1.x - pos2.x) / 48);
                const deltaY = Math.round(Math.abs(pos1.y - pos2.y) / 48);

                const entitiesWithin = {};

                for (let x = roundedX; x < roundedX + (deltaX * 48); x += 48) {
                    for (let y = roundedY; y < roundedY + (deltaX * 48); y += 48) {
                        Object.assign(entitiesWithin, getEntityAtPos(x, y));
                    };
                };

                game.script.sell.sellAllWithUids(Object.keys(entitiesWithin));

                this.cancelDragBox();
            }.bind(this);
            getId("saveSelection").onclick = function(e) {
                const goldStash = this.findStash({pos1, pos2})?.fromTick?.position;
                let baseStr = '';
                if (!goldStash) {
                    getId("selectionErrorMessage").style.display = "block";
                    return;
                };
                for (let uid in game.world.entities) {
                    const entity = game.world.entities[uid];
                    if (this.buildingModels.includes(entity.fromTick.model)) {
                        const buildingPos = entity.targetTick.position;
                        if (this.isWithinSelection(buildingPos, {pos1, pos2})) {
                            baseStr += `${this.buildingModels.indexOf(entity.fromTick.model)},${goldStash.x - buildingPos.x},${goldStash.y - buildingPos.y},${entity.targetTick.yaw};`;
                        };
                    }
                };
                if (baseStr.length == 0) {
                    getId("selectionErrorMessage").style.display = "block";
                    return;
                };

                this.cancelDragBox();

                game.ui.components.MenuSettings.isVisible() || game.ui.components.MenuSettings.show();
                window.isSlotEmpty(localStorage.totalSlots) && window.createBaseSlot();
                setPage('0');
                getId("more-baseSaver").click();
                getId("base-item-" + localStorage.totalSlots).click();
                getId('target-base-design').value = baseStr;
            }.bind(this);
        },
        onCameraUpdate: function() {
            if (!this.staticWorldPos) return;
            const {x: realScreenX, y: realScreenY } = game.renderer.worldToScreen(this.staticWorldPos.x, this.staticWorldPos.y);
            const rect = this.dragBoxElem.getBoundingClientRect();

            this.dragBoxElem.style.top = `${realScreenY}px`;
            this.dragBoxElem.style.left = `${realScreenX}px`;
            this.dragBoxMenuElem.style.top = `${rect.y + rect.height}px`;
            this.dragBoxMenuElem.style.left = `${rect.x + rect.width}px`;
        },
        onResize: function() {

        },
        keydown: function(e) {
            if (!e.repeat && e.shiftKey && e.key == "Z") {
                game.options.options.dragBox = true;
            };
        },
    },
    navigator: {
        handlers: [{type: "keybind", names: "keyup"}],

        targetDisplay: null,
        debugPath: [],

        GRID_WIDTH: null,
        GRID_HEIGHT: null,

        dStar: null,

        currentMap: null,
        currentPath: null,

        startNode: null,
        goalNode: null,

        hasRecomputed: false,

        nextIndex: 1,
        lastIndex: 0,

        lastPos: null,
        stuckPrediction: 0,

        shouldMove: false,
        target: null,
        init() {
            getId("hud-map").onclick = this.onMapClick.bind(this);
        },
        onMapClick: function(e) {
            if (!e.shiftKey) return;
            const rect = getId("hud-map").getBoundingClientRect(),
                  x = e.clientX - rect.left,
                  y = e.clientY - rect.top;
            const worldX = (x / rect.width) * game.world.getWidth(),
                  worldY = (y / rect.height) * game.world.getHeight();

            if (game.options.options.navigator) {
                this.stop();
                game.ui.components.PopupOverlay.showHint("Stopped current navigation.");
            } else {
                if (typeof worldX !== "number" || typeof worldY !== "number") return game.ui.components.PopupOverlay.showHint("Invalid value!");
                if (worldX > 23900 || worldX < 30 || worldY > 23900 || worldY < 30) return game.ui.components.PopupOverlay.showHint("Coordinates too small / big!");

                this.targetDisplay = document.createElement("div");
                this.targetDisplay.classList.add('hud-map-player');
                this.targetDisplay.style.display = "block";
                this.targetDisplay.style.left = x + "px";
                this.targetDisplay.style.top = y + "px";
                this.targetDisplay.style.background = 'var(--light-hover-btn)';
                getId("hud-map").appendChild(this.targetDisplay);

                this.start(worldX, worldY);
            };
        },
        start: function(x, y) {
            game.options.options.navigator = true;
            this.shouldMove = true;
            this.target = {x, y};

            this.initMap(x, y);
            this.moveToNextPath();
        },
        stop: function() {
            this.reset();
            this.shouldMove = false;
            game.network.sendInput({right: 0, left: 0, up: 0, down: 0});
            game.options.options.navigator = false;
        },
        reset: function() {
            this.targetDisplay?.remove?.();
            for (let i in this.debugPath) {
                this.debugPath[i] && game.renderer.ground.removeAttachment(this.debugPath[i]);
            };
            this.debugPath = [];

            this.dStar = null;

            this.currentMap = null;
            this.currentPath = null;

            this.startNode = null;
            this.goalNode = null;

            this.hasRecomputed = false;

            this.nextIndex = 1;
            this.lastIndex = 0;

            this.lastPos = null;
            this.stuckPrediction = 0;
        },
        initMap: function(x, y) {
            // console.log('initializing');
            this.GRID_WIDTH = game.world.entityGrid.rows;
            this.GRID_HEIGHT = game.world.entityGrid.columns;

            this.dStar = new DStarLite(this.GRID_WIDTH, this.GRID_HEIGHT);

            this.currentMap = structuredClone(game.world.entityGrid.entityMap);

            const playerCellIndex = this.currentMap[game.world.myUid][0];

            this.startNode = game.world.entityGrid.getCellCoords(playerCellIndex);
            this.goalNode = game.world.entityGrid.getCellCoords(game.world.entityGrid.getCellIndexes(x, y, {width: 1, height: 1}));

            for (let uid in this.currentMap) {
                if (uid == game.world.myUid) continue;
                for (let cellIndex of this.currentMap[uid]) {
                    if (cellIndex == playerCellIndex) continue;
                    const cellCoord = game.world.entityGrid.getCellCoords(cellIndex);
                    this.dStar.addObstacle(cellCoord.x, cellCoord.y);
                };
            };

            this.dStar.initialize(this.startNode, this.goalNode);
            if (this.dStar.computeShortestPath()) {
                this.currentPath = this.dStar.getPath();

                for (let i in this.currentPath) {
                    const path = game.assetManager.loadModel("PlacementIndicatorModel", {
                        width: 48,
                        height: 48
                    });
                    path.setPosition(this.currentPath[i].x * 48 + 24, this.currentPath[i].y * 48 + 24);
                    path.setIsOccupied(true);
                    game.renderer.ground.addAttachment(path);
                    this.debugPath.push(path);
                };
            };
            // console.log("initialized", this.startNode, this.goalNode);
        },
        updateObstacleChange: function() {
            let shouldUpdate = false;
            const playerCellIndex = game.world.entityGrid.entityMap[game.world.myUid][0];
            // add new obstacles
            for (let uid in game.world.entityGrid.entityMap) {
                if (uid == game.world.myUid) continue;
                if (!(uid in this.currentMap)) {
                    shouldUpdate = true;
                    for (let cellIndex of game.world.entityGrid.entityMap[uid]) {
                        if (cellIndex == playerCellIndex) continue;
                        const cellCoord = game.world.entityGrid.getCellCoords(cellIndex);
                        this.dStar.updateObstacle(cellCoord.x, cellCoord.y, true);
                    };
                };
            };
            // remove old obstacles
            for (let uid in this.currentMap) {
                if (uid == game.world.myUid) continue;
                if (!(uid in game.world.entityGrid.entityMap)) {
                    shouldUpdate = true;
                    for (let cellIndex of this.currentMap[uid]) {
                        const cellCoord = game.world.entityGrid.getCellCoords(cellIndex);
                        this.dStar.updateObstacle(cellCoord.x, cellCoord.y, false);
                    };
                };
            };

            // console.log("should update: ", shouldUpdate);
            if (shouldUpdate) this.updatePath();

            this.currentMap = structuredClone(game.world.entityGrid.entityMap);
        },
        updatePath: function() {
            // console.log(this.currentPath, this.dStar.obstacles, this.currentPath[this.nextIndex]);
            const playerCellIndex = game.world.entityGrid.entityMap[game.world.myUid][0];
            const currentPos = game.world.entityGrid.getCellCoords(playerCellIndex);
            const deltaXFromLast = this.currentPath[this.nextIndex].x - this.currentPath[this.lastIndex].x;
            const deltaYFromLast = this.currentPath[this.nextIndex].y - this.currentPath[this.lastIndex].y;

            this.startNode = {x: currentPos.x - deltaXFromLast, y: currentPos.y - deltaYFromLast};
            this.dStar.handleStartMoved(this.startNode);

            const foundNewPath = this.dStar.computeShortestPath();
            if (foundNewPath) {
                // console.log(this.dStar);
                this.currentPath = this.dStar.getPath();
                this.hasRecomputed = true;
            };
        },
        moveToNextPath: function() {
            try {
                this.updateObstacleChange();
                if (!this.shouldMove) return;

                const currentPos = game.ui.playerTick.position;

                if (this.lastPos) {
                    // console.log("ye", this.lastPos.x, currentPos.x, this.lastPos.y, currentPos.y);
                    if (inRange(this.lastPos.x, currentPos.x, 5) && inRange(this.lastPos.y, currentPos.y, 5)) {
                        // console.log("no");
                        this.stuckPrediction++;
                    };
                };

                if (this.stuckPrediction > 100) {
                    this.updatePath();
                    this.stuckPrediction = 0;
                };

                // if new object is detected, restart path index (since start coord is reset)
                if (this.hasRecomputed) {
                    this.nextIndex = 3;
                    this.hasRecomputed = false;

                    // debug: path visualization
                    for (let i in this.debugPath) {
                        this.debugPath[i] && game.renderer.ground.removeAttachment(this.debugPath[i]);
                    };
                    this.debugPath = [];
                    for (let i in this.currentPath) {
                        const path = game.assetManager.loadModel("PlacementIndicatorModel", {
                            width: 48,
                            height: 48
                        });
                        path.setPosition(this.currentPath[i].x * 48 + 24, this.currentPath[i].y * 48 + 24);
                        path.setIsOccupied(true);
                        game.renderer.ground.addAttachment(path);
                        this.debugPath.push(path);
                    };
                };

                const playerPos = game.ui.playerTick.position;
                if (this.currentPath[this.nextIndex + 1] != undefined) {
                    if (inRange(playerPos.x, this.currentPath[this.nextIndex + 1].x * 48, 192) && inRange(playerPos.y, this.currentPath[this.nextIndex + 1].y * 48, 192)) {
                        this.lastIndex = this.nextIndex++;

                        // debug: path visualization
                        this.debugPath[this.lastIndex].setIsOccupied(true);
                        this.debugPath[this.nextIndex].setIsOccupied(false);
                    };
                };
                let lastPath = this.currentPath[this.lastIndex];
                let nextPath = this.currentPath[this.nextIndex];
                if (inRange(nextPath.x * 48, this.target.x, 150) && inRange(nextPath.y * 48, this.target.y, 150)) return this.stop();

                this.moveTowards(lastPath, nextPath);
                this.lastPos = currentPos;
                setTimeout(this.moveToNextPath.bind(this), 50);
            } catch(e) {
                game.ui.components.PopupOverlay.showHint("Aborted navigator due to an error.");
                console.log(e);
                this.stop();
            };
        },
        moveTowards: function(last, next, acc = 0) {
            const packet = {};
            const lastX = last.x * 48,
                  lastY = last.y * 48,
                  nextX = next.x * 48,
                  nextY = next.y * 48;
            if (last.y - next.y > acc) {
                packet.down = 0;
            } else {
                packet.down = 1;
            }
            if (-last.y + next.y > acc) {
                packet.up = 0;
            } else {
                packet.up = 1;
            }
            if (-last.x + next.x > acc) {
                packet.left = 0;
            } else {
                packet.left = 1;
            }
            if (last.x - next.x > acc) {
                packet.right = 0;
            } else {
                packet.right = 1;
            }
            game.inputPacketScheduler.scheduleInput(packet);
        },
        /*
        moveTowards: function(point, acc = 48) {
            const packet = {};
            const position = game.ui.playerTick.position;
            if (position.y - point.y > acc) {
                packet.down = 0;
            } else {
                packet.down = 1;
            }
            if (-position.y + point.y > acc) {
                packet.up = 0;
            } else {
                packet.up = 1;
            }
            if (-position.x + point.x > acc) {
                packet.left = 0;
            } else {
                packet.left = 1;
            }
            if (position.x - point.x > acc) {
                packet.right = 0;
            } else {
                packet.right = 1;
            }
            game.inputPacketScheduler.scheduleInput(packet);
        },
        */
        keyup: function(e) {
            if (e.key == "Escape") {
                if (game.options.options.navigator) {
                    this.stop();
                    game.ui.components.PopupOverlay.showHint("Stopped current navigation.");
                }
            };
        },
    },
    zoom: {
        dimension: 1,
        zoomonscroll: false,
        upd: function() {
            if (window.disableZoom) return;
            getClass('zoom-prop')[0].innerText = `${this.dimension.toFixed(1)}x`;

            const renderer = Game.currentGame.renderer;
            let canvasWidth = window.innerWidth * window.devicePixelRatio;
            let canvasHeight = window.innerHeight * window.devicePixelRatio;
            let ratio = canvasHeight / (1080 * this.dimension);
            renderer.scale = ratio;
            renderer.entities.setScale(ratio);
            renderer.ui.setScale(ratio);
            renderer.renderer.resize(canvasWidth, canvasHeight);
            renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
            renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;

            const event = new Event("zoom");
            document.dispatchEvent(event);
        },
        onWindowResize: function(e) {
            if (this.zoomonscroll && e.deltaY) {
                if (e.deltaY > 0) this.dimension *= 1.02;
                else if (e.deltaY < 0) this.dimension /= 1.02;
            }
            this.upd();
        },
        zoom: function(val) {
            this.dimension = val;
            this.upd();
        },
        toggleZoomOnScroll: function() {
            this.dimension /= 1.02;
            this.zoomonscroll = !this.zoomonscroll;
            const zoomMode = document.querySelector("#zoom-mode");
            const zoomBtns = [...document.getElementsByClassName('hud-zoom-item')];
            if (!this.zoomonscroll) {
                this.resetZoom();
                for (let i of zoomBtns) i.classList.remove('tag-is-disabled');
                zoomMode.innerText = "Button";
            } else {
                zoomMode.innerText = "Scroll";
                for (let i of zoomBtns) i.classList.add('tag-is-disabled');
            }
        },
        zoomOut: function() {
            this.dimension *= 1.25;
            this.zoom(this.dimension);
        },
        zoomIn: function() {
            this.dimension /= 1.25;
            this.zoom(this.dimension);
        },
        resetZoom: function() {
            this.dimension = 1;
            this.zoom(this.dimension);
        },
        init: function() {
            getId('hud').insertAdjacentHTML('beforeend', `
                <div class="interaction-wheel">
                    <a class="hud-zoom-item zoom-reset" onclick="game.script.zoom.resetZoom();"><i class="fa fa-undo fa-lg" style="font-size: 30px;"></i></a>
                    <a class="hud-zoom-item zoom-up" onclick="game.script.zoom.zoomOut();"><i class="fa fa-arrow-up fa-2x" style="font-size: 30px;"></i></a>
                    <a class="hud-zoom-item zoom-down" onclick="game.script.zoom.zoomIn();"><i class="fa fa-arrow-down fa-2x" style="font-size: 30px;"></i></a>
                    <a class="hud-zoom-item zoom-prop">1.0x</a>
                    <a id="zoom-mode">Button</a>
                    <a id="next-wheel" onclick="game.script.zoom.toggleZoomOnScroll();"></a>
                </div>
            `);
            document.addEventListener('keyup', function(e) {
                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                    if (e.code == 'KeyG') {
                        const wheelDisplay = getClass('interaction-wheel')[0];
                        wheelDisplay.style.display = (wheelDisplay.style.display === 'block') ? 'none' : 'block';
                    }
                    if (e.code == "KeyN") {
                        game.script.zoom.zoomIn();
                    }
                    if (e.code == "KeyM") {
                        game.script.zoom.zoomOut();
                    }
                    if (e.key == "Escape") {
                        getClass('interaction-wheel')[0].style.display = 'none';
                    };
                };
            });
            window.onresize = this.onWindowResize.bind(this);
            window.onwheel = this.onWindowResize.bind(this);
            window.onresize();
        },
    },
    markers: {
        currentIndex: 0,
        allMarkers: [],
        removeMarker: function(id) {
            getId(id)?.remove?.();
            delete this.allMarkers[id];
        },
        placeMarker: function({x, y, id, timeout, shouldIndicateIndex}) {
            id ||= genUUID();
            shouldIndicateIndex && (this.currentIndex++);
            const markerLeft = parseInt(Math.round(x / game.world.getWidth() * 100)) - 4;
            const markerTop = parseInt(Math.round(y / game.world.getHeight() * 100)) - 14;

            const markerElem = document.createElement("div");
            markerElem.style.left = `${markerLeft}%`;
            markerElem.style.top = `${markerTop}%`;
            markerElem.style.display = "block";
            markerElem.style.color = "white";
            markerElem.style.position = "absolute";
            markerElem.classList.add("map-display");
            markerElem.id = id;
            markerElem.innerHTML = `<i class='fa fa-map-marker'>${shouldIndicateIndex ? this.currentIndex : ""}</i>`;
            markerElem.onclick = (e) => {
                e.stopPropagation();
                if (e.shiftKey) return game.script.navigator.onMapClick(e);
                game.ui.components.PopupOverlay.showConfirmation("Do you want to remove this marker?", 5000, (() => { this.removeMarker(id); }).bind(this));
            };
            getId("hud-map").insertAdjacentElement("beforeend", markerElem);

            this.allMarkers[id] = {x, y};
            timeout && setTimeout(() => {
                getId(`${id}`).remove();
            }, 240000);
        },
        init: function() {
            getId("hud-map").addEventListener("click", (e) => {
                if (e.shiftKey) return;
                const rect = getId("hud-map").getBoundingClientRect(),
                      x = e.clientX - rect.left,
                      y = e.clientY - rect.top;
                const worldX = (x / rect.width) * game.world.getWidth(),
                      worldY = (y / rect.height) * game.world.getHeight();

                this.placeMarker({x: worldX, y: worldY});
            });
        },
    },
    optimize: {
        zombieSprite: true,
        towerSprite: true,
        projectileSprite: true,
        updateAnimation: true,
        background: true,
        init: function() {
            getId("shouldUseBackdrop").addEventListener("change", ({target}) => {
                localStorage.setItem("UseBackdropBlur", target.checked);
                location.reload();
            });
            if (window.location.hostname !== "localhost") {
                getId("shouldUseOptimization").addEventListener("change", ({target}) => {
                    game.script.optimize.background = !target.checked;
                });

                game.world.networkEntityPool = null;
                game.world._networkEntityPool = [];

                const bsTick = { uid: 0, entityClass: null };
                const poolSize = Game.currentGame.getNetworkEntityPooling();
                for (let i = 0; i < poolSize; i++) {
                    const entity = new game.renderer.entityType(bsTick);
                    entity.reset();
                    game.world._networkEntityPool.push(entity);
                };
                game.world.getPooledNetworkEntityCount = function() {
                    return this._networkEntityPool.length;
                };
            } else {
                getId("shouldUseOptimization").disabled = true;
                getId("optimize-div").classList.add("disabled");
            };
        },
    },
};

/* @Add-ons */
game.ui.components.PlacementOverlay.update = function () {
    if (this.buildingId) {
        var buildingSchema = this.ui.getBuildingSchema(),
            building = buildingSchema[this.buildingId],
            mousePos = this.ui.getMousePosition(),
            world = Game.currentGame.world,
            worldMousePos = Game.currentGame.renderer.screenToWorld(mousePos.x, mousePos.y),
            cells = world.entityGrid.getCellIndexes(worldMousePos.x, worldMousePos.y, {
                'width': building.gridWidth,
                'height': building.gridHeight
            }),
            cellSize = world.entityGrid.getCellSize(),
            coord = {
                'x': 0,
                'y': 0
            };
        for (var cell in cells) {
            if (cells[cell]) {
                var cellCoord = world.entityGrid.getCellCoords(cells[cell]),
                    _cellCoord = {
                        'x': cellCoord.x * cellSize + cellSize / 2,
                        'y': cellCoord.y * cellSize + cellSize / 2
                    },
                    worldToUi = Game.currentGame.renderer.worldToUi(_cellCoord.x, _cellCoord.y),
                    isOccupied = this.checkIsOccupied(cells[cell], cellCoord);
                this.placeholderTints[cell].setPosition(worldToUi.x, worldToUi.y);
                this.placeholderTints[cell].setIsOccupied(isOccupied);
                this.placeholderTints[cell].setVisible(true);
                coord.x += cellCoord.x;
                coord.y += cellCoord.y;
            } else this.placeholderTints[cell].setVisible(false);
        };
        coord.x = coord.x / cells.length;
        coord.y = coord.y / cells.length;
        var worldPos = {
            'x': coord.x * cellSize + cellSize / 2,
            'y': coord.y * cellSize + cellSize / 2
        },
            uiPos = Game.currentGame.renderer.worldToUi(worldPos.x, worldPos.y);
        if (!this.rangeIndicator) {
            var { maxStashDistance } = game.ui.components.BuildingOverlay;
            if ('GoldStash' == this.buildingId) {
                this.rangeIndicator = game.assetManager.models.rangeIndicatorModel({
                    'width': maxStashDistance * cellSize * 2,
                    'height': maxStashDistance * cellSize * 2
                }, {r: 0xff, g: 0xff, b: 0xff}, {r: 0xdd, g: 0xdd, b: 0xdd});
            } else if (building.rangeTiers) {
                this.rangeIndicator = game.assetManager.models.rangeIndicatorModel({
                    'isCircular': true,
                    'radius': building.rangeTiers[0] * 0.57071
                }, {r: 0xff, g: 0xff, b: 0xff}, {r: 0xdd, g: 0xdd, b: 0xdd});
            };
            this.rangeIndicator && Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
        };
        this.placeholderEntity.setPosition(uiPos.x, uiPos.y);
        this.placeholderText.setPosition(uiPos.x, uiPos.y - 110);
        this.rangeIndicator && this.rangeIndicator.setPosition(worldPos.x, worldPos.y);
    };
};
game.ui.components.PlacementOverlay.cancelPlacing = function () {
    if (this.buildingId) {
        Game.currentGame.renderer.ui.removeAttachment(this.placeholderEntity);
        Game.currentGame.renderer.ground.removeAttachment(this.rangeIndicator);
        for (let cell in this.placeholderTints) Game.currentGame.renderer.ui.removeAttachment(this.placeholderTints[cell]);
        for (let cell in this.borderTints) Game.currentGame.renderer.ground.removeAttachment(this.borderTints[cell]);
        this.placeholderText.setAlpha(0x0);
        this.placeholderText.setPosition(-0x3e8, -0x3e8);
        this.placeholderEntity = null;
        this.rangeIndicator = null;
        this.placeholderTints = [];
        this.borderTints = [];
        this.buildingId = null;
    };
};

/* @Rebinds */
getId('hud-debug').style.color = 'var(--light-hover-btn)';
game.debug.onRendererTick = function () {
    if (this.ticks++, this.visible && this.ticks % 0x14 === 0x0) {
        let debugHTML = `Server: ` + Game.currentGame.network.connectionOptions.id + ` (` + Game.currentGame.network.connectionOptions.name + `)<br>`,
            serverTime = Game.currentGame.world.replicator.getServerTime(),
            clientTime = Game.currentGame.world.replicator.getClientTime(),
            realClientTime = Game.currentGame.world.replicator.getRealClientTime(),
            frameStutters = Game.currentGame.world.replicator.getFrameStutters(),
            interpolating = Game.currentGame.world.replicator.getInterpolating(),
            tickByteSize = Game.currentGame.world.replicator.getTickByteSize(),
            tickEntities = Game.currentGame.world.replicator.getTickEntities(),
            pooledNetworkEntityCount = (Game.currentGame.world.getLocalPlayer(), Game.currentGame.world.getPooledNetworkEntityCount()),
            frameExtrapolated = Game.currentGame.metrics.getFramesExtrapolated(),
            clientTimeResets = Game.currentGame.world.replicator.getClientTimeResets(),
            maxExtrapolationTime = Game.currentGame.world.replicator.getMaxExtrapolationTime(),
            playerPos = game.world.localPlayer.entity.getPosition(),
            kilobytePerSec = tickByteSize / 1024 * 20,
            isTickLarge = kilobytePerSec > 150;
        debugHTML = debugHTML + `Ping: ` + Game.currentGame.network.getPing() + ` ms<br>`;
        debugHTML = debugHTML + `Server time: ` + serverTime + '\x20ms<br>';
        debugHTML = debugHTML + `Client time: ` + clientTime + ` ms<br>`;
        debugHTML = debugHTML + `Real client time: ` + realClientTime + ` ms<br>`;
        debugHTML = debugHTML + `Client lag: ` + (serverTime - clientTime) + '\x20ms<br>';
        debugHTML = debugHTML + `Real client lag: ` + (serverTime - realClientTime) + ` ms<br>`;
        debugHTML = debugHTML + 'Stutters:\x20' + frameStutters + `<br>`;
        debugHTML = debugHTML + `Frames extrapolated: ` + frameExtrapolated + `<br>`;
        debugHTML = debugHTML + `Max extrapolation time: ` + maxExtrapolationTime + '<br>';
        debugHTML = debugHTML + `Client time resets: ` + clientTimeResets + `<br>`;
        debugHTML = debugHTML + `Interpolating: ` + interpolating + `<br>`;
        debugHTML = debugHTML + `Tick byte size: ` + (isTickLarge ? "<strong>" : "") + tickByteSize + '\x20(' + kilobytePerSec.toFixed(2) + 'KB/s)' + (isTickLarge ? "</strong>" : "") + '<br>';
        debugHTML = debugHTML + `Tick entities: ` + tickEntities + '<br>';
        debugHTML = debugHTML + 'Pooled\x20network\x20entities:\x20' + pooledNetworkEntityCount + '<br>';
        debugHTML += `Pooled model entities:<br>`;
        for (const modelName in Game.currentGame.getModelEntityPooling()) {
            debugHTML = debugHTML + '- ' + modelName + ': ' + Game.currentGame.world.getPooledModelEntityCount(modelName) + '<br>';
        }
        debugHTML = debugHTML + 'Player\x20position:\x20<br>';
        debugHTML = debugHTML + '-\x20X:\x20' + playerPos.x.toFixed(2) + '<br>';
        debugHTML = debugHTML + '-\x20Y:\x20' + playerPos.y.toFixed(2) + '<br>';
        this.debugElem.innerHTML = debugHTML;
    }
}
game.renderer.tickCallbacks[8] = game.debug.onRendererTick.bind(game.debug);

game.ui.components.MenuParty.update = function () {
    var parties = this.ui.getParties();
    var playerIsLeader = this.ui.getPlayerPartyLeader();
    var playerPartyData = parties[this.ui.getPlayerPartyId()];
    var playerPartyMembers = this.ui.getPlayerPartyMembers();
    var serverId = this.ui.getOption('serverId');
    var staleElems = {};
    var availableParties = 0;

    this.clonedPartyElems ||= {};
    this.closedGridElem ||= getId("privateHud2");

    for (var partyId in this.partyElems) {
        staleElems[partyId] = true;
    }
    for (var partyId in parties) {
        var partyData = parties[partyId];
        var partyElem = this.partyElems[partyId];
        var partyNameSanitized = window.filterXSS(partyData.partyName, { whiteList: {} });
        delete staleElems[partyId];
        if (!this.partyElems[partyId]) {
            partyElem = this.ui.createElement("<div class=\"hud-party-link\"></div>");
            this.clonedPartyElems[partyId] = this.ui.createElement("<div class=\"hud-party-link\"></div>");
            this.partyElems[partyId] = partyElem;
            this.gridElem.appendChild(partyElem);
            this.closedGridElem.appendChild(this.clonedPartyElems[partyId]);
            partyElem.addEventListener('click', this.onPartyJoinRequestHandler(partyData.partyId).bind(this));
        }
        if (partyData.isOpen) {
            partyElem.style.display = 'block';
            this.clonedPartyElems[partyId].style.display = "none";
            availableParties++;
        }
        else {
            partyElem.style.display = 'none';
            this.clonedPartyElems[partyId].style.display = "block";
        }
        if (this.ui.getPlayerPartyId() === partyData.partyId) {
            partyElem.classList.add('is-active');
            partyElem.classList.remove('is-disabled');

            this.clonedPartyElems[partyId].classList.add('is-active');
            this.clonedPartyElems[partyId].classList.remove('is-disabled');
        }
        else if (partyData.memberCount === this.maxPartySize) {
            partyElem.classList.remove('is-active');
            partyElem.classList.add('is-disabled');

            this.clonedPartyElems[partyId].classList.remove('is-active');
            this.clonedPartyElems[partyId].classList.add('is-disabled');
        }
        else {
            partyElem.classList.remove('is-active');
            partyElem.classList.remove('is-disabled');

            this.clonedPartyElems[partyId].classList.remove('is-active');
            this.clonedPartyElems[partyId].classList.remove('is-disabled');
        }
        partyElem.innerHTML = "<strong>" + partyNameSanitized + "</strong><small>ID: " + partyData.partyId + "</small> <span>" + partyData.memberCount + "/" + this.maxPartySize + "</span><span>-</span>";
        this.clonedPartyElems[partyId].innerHTML = "<strong>" + partyNameSanitized + "</strong><small>ID: " + partyData.partyId + "</small> <span>" + partyData.memberCount + "/" + this.maxPartySize + "</span>";
    }
    for (var partyId in staleElems) {
        if (!this.partyElems[partyId]) {
            continue;
        }
        this.partyElems[partyId].remove();
        this.clonedPartyElems[partyId].remove();
        delete this.partyElems[partyId];
        delete this.clonedPartyElems[partyId];
    }
    for (var i in this.memberElems) {
        this.memberElems[i].remove();
        delete this.memberElems[i];
    }
    for (var i in playerPartyMembers) {
        var playerName = window.filterXSS(playerPartyMembers[i].displayName, { whiteList: {} });
        var memberElem = this.ui.createElement(
            "<div class=\"hud-member-link\">\n                <strong>" + playerName + "</strong>\n                <small>" + (playerPartyMembers[i].isLeader === 1 ? 'Leader' : 'Member') + "</small>\n                <div class=\"hud-member-actions\">\n                    <a class=\"hud-member-can-sell btn" + (!playerIsLeader || playerPartyMembers[i].isLeader === 1 ? ' is-disabled' : '') + (playerPartyMembers[i].canSell === 1 ? ' is-active' : '') + "\"><span class=\"hud-can-sell-tick\"></span> Can sell buildings</a>\n                    <a class=\"hud-member-kick btn btn-red" + (!playerIsLeader || playerPartyMembers[i].isLeader === 1 ? ' is-disabled' : '') + "\">Kick</a>\n                </div>\n            </div>"
        );
        this.membersElem.appendChild(memberElem);
        this.memberElems[i] = memberElem;
        if (playerIsLeader && playerPartyMembers[i].isLeader === 0) {
            var kickElem = memberElem.querySelector('.hud-member-kick');
            var canSellElem = memberElem.querySelector('.hud-member-can-sell');
            kickElem.addEventListener('click', this.onPartyMemberKick(i).bind(this));
            canSellElem.addEventListener('click', this.onPartyMemberCanSellToggle(i).bind(this));
        }
    }
    if (availableParties > 0) {
        this.gridEmptyElem.style.display = 'none';
    }
    else {
        this.gridEmptyElem.style.display = 'block';
    }
    if (!playerPartyData) {
        this.tagInputElem.setAttribute('disabled', 'true');
        this.tagInputElem.value = '';
        this.shareInputElem.setAttribute('disabled', 'true');
        this.shareInputElem.value = '';
        this.visibilityElem.classList.add('is-disabled');
        return;
    }
    if (document.activeElement !== this.tagInputElem) {
        this.tagInputElem.value = playerPartyData.partyName;
    }
    if (playerIsLeader) {
        this.tagInputElem.removeAttribute('disabled');
    }
    else {
        this.tagInputElem.setAttribute('disabled', 'true');
    }
    this.shareInputElem.removeAttribute('disabled');
    this.shareInputElem.value = 'https://zombs.io/#/' + serverId + '/' + this.ui.getPlayerPartyShareKey();
    if (playerIsLeader) {
        this.visibilityElem.classList.remove('is-disabled');
    }
    else {
        this.visibilityElem.classList.add('is-disabled');
    }
    if (playerPartyData.isOpen) {
        this.visibilityElem.classList.remove('is-private');
        this.visibilityElem.innerText = 'Public';
    }
    else {
        this.visibilityElem.classList.add('is-private');
        this.visibilityElem.innerText = 'Private';
    }
};
getClass("hud-party-actions")[0].insertAdjacentHTML("afterend", `
<div class="partydiv" style="text-align: center">
  <button class="btn btn-red" style="width: 275.5px;margin: 10px 0 0 3px;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
</div>`);

game.ui.components.Leaderboard.update = function () {
    const currentGame = Game.currentGame;
    // this.playerUidElems ||= {};
    for (let leaderboardElem = 0; leaderboardElem < this.leaderboardData.length; leaderboardElem++) {
        let playerData = this.leaderboardData[leaderboardElem],
            playerName = this.playerNames[playerData.uid];
        this.playerNames[playerData.uid] || (
            playerName = window.filterXSS(playerData.name, { whiteList: {} }),
            this.playerNames[playerData.uid] = playerName
        );
        leaderboardElem in this.playerElems || (
            this.playerElems[leaderboardElem] = this.ui.createElement('<div\x20class=\x22hud-leaderboard-player\x22></div>'),
            // this.playerUidElems[leaderboardElem] = this.ui.createElement('<span\x20class=\x22player-uid\x22>-</span>'),
            this.playerRankElems[leaderboardElem] = this.ui.createElement(`<span class="player-rank">-</span>`),
            this.playerNameElems[leaderboardElem] = this.ui.createElement(`<strong class="player-name">-</strong>`),
            this.playerScoreElems[leaderboardElem] = this.ui.createElement(`<span class="player-score">-</span>`),
            this.playerWaveElems[leaderboardElem] = this.ui.createElement('<span\x20class=\x22player-wave\x22>-</span>'),

            this.playerElems[leaderboardElem].appendChild(this.playerRankElems[leaderboardElem]),
            // this.playerElems[leaderboardElem].appendChild(this.playerUidElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerNameElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerScoreElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerWaveElems[leaderboardElem]),

            this.playersElem.appendChild(this.playerElems[leaderboardElem])
        );

        game.world.myUid === playerData.uid
            ? this.playerElems[leaderboardElem].classList.add('is-active')
        : this.playerElems[leaderboardElem].classList.remove(`is-active`);

        this.playerElems[leaderboardElem].style.display = `block`;
        // this.playerUidElems[leaderboardElem].innerText = playerData.uid;
        this.playerRankElems[leaderboardElem].innerText = '#' + (playerData.rank + 1);
        this.playerNameElems[leaderboardElem].innerText = playerName;
        this.playerScoreElems[leaderboardElem].innerText = playerData.score.toLocaleString();
        this.playerWaveElems[leaderboardElem].innerHTML = (0 === playerData.wave) ? `<small>-</small>` : playerData.wave.toLocaleString();

    }
    if (this.leaderboardData.length < this.playerElems.length) {
        for (let invalidEntries = this.leaderboardData.length; invalidEntries < this.playerElems.length; invalidEntries++) {
            this.playerElems[invalidEntries].style.display = `none`;
        }
    }
}

game.ui.components.BuildingOverlay.createResourceCostString = function (schema, schemaTier, amountOfBuildings) {
    void 0 === schemaTier && (schemaTier = 0x1);
    void 0 === amountOfBuildings && (amountOfBuildings = 0x1);
    var totalCost = [],
        resources = {
            'wood': `wood`,
            'stone': `stone`,
            'gold': 'gold',
            'token': 'tokens'
        },
        playerTick = Game.currentGame.ui.getPlayerTick();
    for (var resource in resources) {
        var resourceCost = resource + `Costs`;
        if (schema[resourceCost] && schema[resourceCost][schemaTier - 1]) {
            var currentTotalCost = schema[resourceCost][schemaTier - 1] * amountOfBuildings,
                canAfford = playerTick && playerTick[resource] >= currentTotalCost;
            canAfford
                ? totalCost.push('<span\x20class=\x22hud-resource-' + resources[resource] + '\x22>' + currentTotalCost.toLocaleString() + '\x20' + resources[resource] + `</span>`)
            : totalCost.push(`<span class="hud-resource-` + resources[resource] + ` hud-resource-low">` + currentTotalCost.toLocaleString() + '\x20' + resources[resource] + `</span>`);
        }
    }
    return totalCost.length > 0 ? totalCost.join(',\x20') : `<span class="hud-resource-free">Free</span>`;
}

game.ui.components.BuildingOverlay.createResourceRefundString = function (buildingType, buildingSchema, tier) {
    void 0 === tier && (tier = 1);
    var totalCost = [],
        buildingsByTier = {},
        buildings = Object.values(game.ui.buildings).filter(e => e.type == buildingType),
        resources = {
            'wood': `wood`,
            'stone': `stone`,
            'gold': `gold`,
            'token': 'tokens'
        };
    for (let building of buildings) {
        buildingsByTier[building.tier] ||= 0;
        buildingsByTier[building.tier]++;
    }
    for (var resource in resources) {
        var resourceCost = resource + `Costs`;
        if (buildingSchema[resourceCost]) {
            var totalTierCost = 0;
            if (this.shouldUpgradeAll) {
                for (let i = 1; i <= tier; i++) {
                    totalTierCost = Math.floor(
                        buildingSchema[resourceCost].slice(0, i)
                        .reduce((prev, curr) => prev + curr, 0) / 2
                    ) * buildingsByTier[i];
                }
            } else totalTierCost = Math.floor(buildingSchema[resourceCost].slice(0, tier).reduce((prev, curr) => prev + curr, 0) / 2);
            totalTierCost && totalCost.push('<span\x20class=\x22hud-resource-' + resources[resource] + '\x22>' + totalTierCost.toLocaleString() + '\x20' + resources[resource] + `</span>`);
        }
    }
    return totalCost.length > 0 ? totalCost.join(',\x20') : `<span class="hud-resource-free">None</span>`;
}


game.ui.components.BuildingOverlay.excludeBuilding = function() {
    game.script.AHRC.excludedHarvesters.has(this.buildingUid) ? (
        this.excludeElem.classList.add("btn-theme"),
        this.excludeElem.classList.remove("btn-red"),
        this.excludeElem.innerHTML = `Exclude Harvester<i class="fa fa-minus" style="position: absolute;right: 10px;top: 13px;"></i>`,
        game.script.AHRC.excludedHarvesters.delete(this.buildingUid)
    ) : (
        this.excludeElem.classList.add("btn-red"),
        this.excludeElem.classList.remove("btn-theme"),
        this.excludeElem.innerHTML = `Include Harvester<i class="fa fa-plus" style="position: absolute;right: 10px;top: 13px;"></i>`,
        game.script.AHRC.excludedHarvesters.add(this.buildingUid)
    );
}

game.ui.components.BuildingOverlay.viewFromBuilding = function() {
    const buildings = game.ui.getBuildings(),
          building = game.world.entities[this.buildingUid];
    if (!building) return;

    this.isViewingFromBuilding = true;
    this.componentElem.style.opacity = "0.1";
    game.renderer.follow(building);
};

game.ui.components.BuildingOverlay.stopWatching = function () {
    this.buildingUid && (
        this.isViewingFromBuilding && game.renderer.follow(game.world.entities[game.world.myUid]),
        this.rangeIndicator && (
            Game.currentGame.renderer.ground.removeAttachment(this.rangeIndicator),
            delete this.rangeIndicator
        ),
        this.componentElem.innerHTML = '',
        this.componentElem.style.opacity = "1",
        this.componentElem.style.left = `-1000px`,
        this.componentElem.style.top = '-1000px',
        this.buildingUid = null,
        this.buildingId = null,
        this.buildingTier = null,
        this.hide()
    );
}

game.ui.components.BuildingOverlay.startWatching = function(buildingId) {
    this.buildingUid && this.stopWatching();
    let buildings = this.ui.getBuildings(),
        building = buildings[buildingId];
    if (!building) return;
    this.buildingUid = buildingId;
    this.buildingId = building.type;
    this.buildingTier = building.tier;
    const schema = this.ui.getBuildingSchema(),
          buildingSchema = schema[this.buildingId];
    if ('GoldStash' == this.buildingId) {
        var world = Game.currentGame.world,
            cellSize = world.entityGrid.getCellSize();
        this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
            'width': this.maxStashDistance * cellSize * 2,
            'height': this.maxStashDistance * cellSize * 2
        });
        Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
    } else if (buildingSchema.rangeTiers) {
        this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
            'isCircular': true,
            'radius': buildingSchema.rangeTiers[this.buildingTier - 1] * 0.57071
        });
        Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator)
    };
    this.componentElem.innerHTML = `<div class="hud-tooltip-building">
            <h2>` + buildingSchema.name + `</h2>
            <h3>Tier <span class="hud-building-tier">` + this.buildingTier + `</span> Building</h3>
            <div class="hud-tooltip-health">
                <span class="hud-tooltip-health-bar" style="width:100%;"></span>
            </div>
            <div class="hud-tooltip-body">
                <div class="hud-building-stats"></div>
                <p class="hud-building-actions">
                    <span class="hud-building-dual-btn">
                        <a class="btn btn-purple hud-building-deposit">Refuel</a>
                        <a class="btn btn-gold hud-building-collect">Collect</a>
                    </span>
                    <a class="btn btn-theme hud-building-ahrc">Exclude Harvester<i class="fa fa-minus" style="position: absolute;right: 10px;top: 13px;"></i></a>
                    <a class="btn btn-theme hud-building-view" style="display: none;">View From Building<i class="fas fa-eye" style="position: absolute;right: 10px;top: 13px;"></i></a>
                    <a class="btn btn-green hud-building-upgrade">Upgrade</a>
                    <a class="btn btn-red hud-building-sell">Sell</a>
                </p>
            </div>
        </div>`;
    this.tierElem = this.componentElem.querySelector(`.hud-building-tier`);
    this.healthBarElem = this.componentElem.querySelector(`.hud-tooltip-health-bar`);
    this.statsElem = this.componentElem.querySelector(`.hud-building-stats`);
    this.actionsElem = this.componentElem.querySelector(`.hud-building-actions`);
    this.depositElem = this.componentElem.querySelector(`.hud-building-deposit`);
    this.dualBtnElem = this.componentElem.querySelector(`.hud-building-dual-btn`);
    this.excludeElem = this.componentElem.querySelector(`.hud-building-ahrc`);
    this.collectElem = this.componentElem.querySelector(`.hud-building-collect`);
    this.viewElem = this.componentElem.querySelector('.hud-building-view');
    this.upgradeElem = this.componentElem.querySelector('.hud-building-upgrade');
    this.sellElem = this.componentElem.querySelector('.hud-building-sell');
    `Harvester` !== this.buildingId && (
        this.dualBtnElem.style.display = `none`,
        this.excludeElem.style.display = `none`,
        this.viewElem.style.display = `block`
    );
    game.script.AHRC.excludedHarvesters.has(this.buildingUid) ? (
        this.excludeElem.classList.add("btn-red"),
        this.excludeElem.classList.remove("btn-theme"),
        this.excludeElem.innerHTML = `Include Harvester<i class="fa fa-plus" style="position: absolute;right: 10px;top: 13px;"></i>`
    ) : (
        this.excludeElem.classList.add("btn-theme"),
        this.excludeElem.classList.remove("btn-red"),
        this.excludeElem.innerHTML = `Exclude Harvester<i class="fa fa-minus" style="position: absolute;right: 10px;top: 13px;"></i>`
    );
    this.depositElem.addEventListener(`click`, this.depositIntoBuilding.bind(this));
    this.collectElem.addEventListener(`click`, this.collectFromBuilding.bind(this));
    this.excludeElem.addEventListener(`click`, this.excludeBuilding.bind(this));
    this.viewElem.addEventListener(`click`, this.viewFromBuilding.bind(this));
    this.upgradeElem.addEventListener(`click`, this.upgradeBuilding.bind(this));
    this.sellElem.addEventListener(`click`, this.sellBuilding.bind(this));
    this.show();
    this.update();
}
game.ui.components.BuildingOverlay.update = function () {
    if (this.buildingUid) {
        const buildingEntity = Game.currentGame.world.getEntityByUid(this.buildingUid);
        if (!buildingEntity) return void this.stopWatching();

        let renderer = Game.currentGame.renderer,
            buildingUiPosition = renderer.worldToScreen(buildingEntity.getPositionX(), buildingEntity.getPositionY()),
            buildingTick = buildingEntity.getTargetTick(),
            buildingsSchema = this.ui.getBuildingSchema(),
            buildings = this.ui.getBuildings(),
            buildingSchema = buildingsSchema[this.buildingId],
            building = buildings[this.buildingUid];
        if (!building) return void this.stopWatching();

        let buildingHeight = buildingSchema.gridHeight,
            buildingScale = (buildingSchema.gridWidth, buildingHeight / 2 * 48 * (renderer.getScale() / window.devicePixelRatio)),
            buildingTier = building.tier,
            buildingSchemaTier = 1,
            isBuildingMaxed = false,
            isBuildingAtMaxTier = false,
            currentStats = {},
            nextTierStats = {},
            sameBuildings = 1,
            buildingStats = {
                'health': `Health`,
                'damage': `Damage`,
                'range': 'Range',
                'gps': 'Gold/Sec',
                'harvest': `Harvest/Sec`,
                'harvestCapacity': `Capacity`,
                'msBetweenFires': `Firerate`
            };

        if (buildingSchema.tiers) {
            const stashTier = this.getGoldStashTier();
            building.tier < buildingSchema.tiers ? (buildingSchemaTier = building.tier + 1, isBuildingMaxed = false) : (buildingSchemaTier = building.tier, isBuildingMaxed = true);
            isBuildingAtMaxTier = !isBuildingMaxed && (building.tier < stashTier || `GoldStash` === this.buildingId);
        }
        for (let buildingStat in buildingStats) {
            let currentStat = `<small>&mdash;</small>`,
                nextTierStat = '<small>&mdash;</small>';
            buildingSchema[buildingStat + `Tiers`] && (
                currentStat = buildingSchema[buildingStat + `Tiers`][buildingTier - 1],
                buildingStat == "msBetweenFires" && (currentStat = (1000 / currentStat).toFixed(2).toLocaleString()),
                isBuildingMaxed || (
                    nextTierStat = buildingSchema[buildingStat + 'Tiers'][buildingSchemaTier - 1],
                    buildingStat == "msBetweenFires" && (nextTierStat = (1000 / nextTierStat).toFixed(2).toLocaleString())
                ),
                currentStats[buildingStat] = '<p>' + buildingStats[buildingStat] + `: <strong class="hud-stats-current">` + currentStat + '</strong></p>',
                nextTierStats[buildingStat] = `<p>` + buildingStats[buildingStat] + ':\x20<strong\x20class=\x22hud-stats-next\x22>' + nextTierStat + `</strong></p>`
            );
        }
        if (this.shouldUpgradeAll) {
            sameBuildings = 0;
            for (let buildingUid in buildings) {
                // parseInt(buildingUid); tf
                buildings[buildingUid].type === this.buildingId && buildings[buildingUid].tier === building.tier && sameBuildings++;
            }
        }
        let costString = this.createResourceCostString(buildingSchema, buildingSchemaTier, sameBuildings),
            refundString = this.createResourceRefundString(this.buildingId, buildingSchema, building.tier),
            buildingHealth = Math.round(buildingTick.health / buildingTick.maxHealth * 100);

        buildingTick.partyId !== this.ui.getPlayerPartyId() ? this.actionsElem.style.display = `none` : this.actionsElem.style.display = 'block';
        this.tierElem.innerHTML = building.tier.toString();
        this.buildingTier = building.tier;
        this.healthBarElem.style.width = buildingHealth + '%';
        if (Object.keys(currentStats).length > 0) {
            let currentStatValues = '',
                nextTierStatValues = '';
            for (let stat in currentStats) currentStatValues += currentStats[stat];
            for (let stat in nextTierStats) nextTierStatValues += nextTierStats[stat];
            this.statsElem.innerHTML = `
                <div class="hud-stats-current hud-stats-values">
                    ` + currentStatValues + `
                </div>
                <div class="hud-stats-next hud-stats-values">
                    ` + nextTierStatValues + `
                </div>
            `;
        } else this.statsElem.innerHTML = '';
        if (`Harvester` === this.buildingId) {
            let depositAmount = Math.floor(buildingTick.depositMax / 10),
                isDepositPossible = buildingTick.depositMax - buildingTick.deposit < depositAmount;
            isDepositPossible ? this.depositElem.classList.add('is-disabled') : this.depositElem.classList.remove(`is-disabled`);
            this.shouldUpgradeAll
                ? this.depositElem.innerHTML = 'Refuel\x20All\x20<small>(' + (depositAmount * sameBuildings).toLocaleString() + ` gold)</small>`
                : this.depositElem.innerHTML = 'Refuel\x20<small>(' + depositAmount.toLocaleString() + ` gold)</small>`;
        }
        isBuildingAtMaxTier ? this.upgradeElem.classList.remove(`is-disabled`) : this.upgradeElem.classList.add('is-disabled');
        this.shouldUpgradeAll ? (
            this.upgradeElem.innerHTML = `Upgrade All <small>(` + costString + ')</small>',
            this.sellElem.innerHTML = `Sell All <small>(` + refundString + ')</small>'
        ) : (
            this.upgradeElem.innerHTML = `Upgrade <small>(` + costString + `)</small>`,
            this.sellElem.innerHTML = `Sell <small>(` + refundString + `)</small>`
        );
        `GoldStash` == this.buildingId ? (
            this.sellElem.innerHTML = `Sell All Buildings`,
            this.sellElem.classList.remove(`is-disabled`),
            this.isSellingAll && this.sellElem.classList.add(`is-disabled`)
        ) : this.ui.getPlayerPartyCanSell() ? (
            this.sellElem.classList.remove(`is-disabled`)
        ) : (
            this.sellElem.classList.add(`is-disabled`),
            this.sellElem.innerHTML = `Need Permission to Sell`
        );
        this.componentElem.style.left = buildingUiPosition.x - this.componentElem.offsetWidth / 0x2 + 'px';
        this.componentElem.style.top = buildingUiPosition.y - buildingScale - this.componentElem.offsetHeight - 0x14 + 'px';
        this.rangeIndicator && this.rangeIndicator.setPosition(buildingEntity.getPositionX(), buildingEntity.getPositionY());
    }
}

game.ui.onBuildingSchemaUpdate = function (rawSchema) {
    const schemas = JSON.parse(rawSchema.json);
    for (const buildingId in schemas) {
        let buildingSchema = schemas[buildingId];
        for (var schema in this.buildingSchema) {
            if (schema == buildingSchema.Name) {
                buildingSchema.MsBetweenFires && (this.buildingSchema[schema].msBetweenFiresTiers = buildingSchema.MsBetweenFires);
                buildingSchema.ProjectileAoe && (this.buildingSchema[schema].aoeTiers = buildingSchema.ProjectileAoe);
                buildingSchema.ProjectileAoeRadius && (this.buildingSchema[schema].aoeRadiusTiers = buildingSchema.ProjectileAoeRadius);
                buildingSchema.ProjectileLifetime && (this.buildingSchema[schema].lifetimeTiers = buildingSchema.ProjectileLifetime);
                break;
            }
        }
    }
    this.emit(`buildingSchemaUpdate`, this.buildingSchema);
}
game.ui.onItemSchemaUpdate = function (rawSchema) {
    var schemas = JSON.parse(rawSchema.json);
    for (var item in schemas) {
        var itemSchema = schemas[item];
        for (var schema in this.itemSchema) {
            schema == "Bow" && (this.itemSchema[schema].rangeTiers = Array(7).fill(1000));
            if (schema == itemSchema.Name) {
                itemSchema.MaxYawDeviation && (this.itemSchema[schema].maxYawDeviationTiers = itemSchema.MaxYawDeviation);
                itemSchema.MsBetweenFires && (this.itemSchema[schema].msBetweenFiresTiers = itemSchema.MsBetweenFires);
                itemSchema.ProjectileAoe && (this.itemSchema[schema].aoeTiers = itemSchema.ProjectileAoe);
                itemSchema.ProjectileAoeRadius && (this.itemSchema[schema].aoeRadiusTiers = itemSchema.ProjectileAoeRadius);
                itemSchema.ProjectileLifetime && (this.itemSchema[schema].lifetimeTiers = itemSchema.ProjectileLifetime);
                break;
            }
        }
    }
    this.emit(`itemSchemaUpdate`, this.itemSchema);
}

game.network.addRpcHandler("BuildingShopPrices", game.ui.onBuildingSchemaUpdate.bind(game.ui));
game.network.addRpcHandler("ItemShopPrices", game.ui.onItemSchemaUpdate.bind(game.ui));

/* @CustomRenderer */
game.renderer.nodeType = class i {
    constructor(e = null) {
        this.attachments = [];
        this.parent = null;
        this.isVisible = true;
        this.setNode(e || new window.PIXI.Container);
    }
    getNode() {
        return this.node;
    }
    setNode(t) {
        this.node = t;
    }
    getParent() {
        return this.parent;
    }
    setParent(t) {
        this.parent = t;
    }
    getAttachments() {
        return this.attachments;
    }
    addAttachment(t, e = 0) {
        t.getNode().zHack = e;
        t.setParent(this);
        this.node.addChild(t.getNode());
        this.attachments.push(t);
        this.node.children.sort(function (t, e) {
            return t.zHack == e.zHack ? 0 : t.zHack < e.zHack ? -1 : 1;
        });
    }
    removeAttachment(t) {
        if (t) {
            this.node.removeChild(t.getNode());
            t.setParent(null);

            var e = this.attachments.indexOf(t);
            e > -1 && this.attachments.splice(e, 1);
        }
    }
    getRotation() {
        return 180 * this.node.rotation / Math.PI;
    }
    setRotation(t) {
        this.node.rotation = t * Math.PI / 180;
    }
    getAlpha() {
        return this.node.alpha;
    }
    setAlpha(t) {
        this.node.alpha = t;
    }
    getScale() {
        return this.node.scale;
    }
    setScale(t) {
        this.node.scale.x = t;
        this.node.scale.y = t;
    }
    getScaleX() {
        return this.node.scale.x;
    }
    setScaleX(t) {
        this.node.scale.x = t;
    }
    getScaleY() {
        return this.node.scale.y;
    }
    setScaleY(t) {
        this.node.scale.y = t;
    }
    getFilters() {
        return this.node.filters;
    }
    setFilters(t) {
        this.node.filters = t;
    }
    getPosition() {
        return this.node.position;
    }
    setPosition(t, e) {
        this.node.position.x = t;
        this.node.position.y = e;
    }
    getPositionX() {
        return this.getPosition().x;
    }
    setPositionX(t) {
        this.node.position.x = t;
    }
    getPositionY() {
        return this.getPosition().y;
    }
    setPositionY(t) {
        this.node.position.y = t;
    }
    getPivotPoint() {
        return this.node.pivot;
    }
    setPivotPoint(t, e) {
        this.node.pivot.x = t;
        this.node.pivot.y = e;
    }
    getVisible() {
        return this.isVisible;
    }
    setVisible(t) {
        this.isVisible = t;
        this.node.visible = t;
    }
    update(t, e) {
        for (let r = 0; r < this.attachments.length; r++) this.attachments[r].update(t, e);
    }
};
game.renderer.spriteType = class d extends game.renderer.nodeType {
    constructor(texture, tiled) {
        super();
        this.sprite = null;
        if (typeof texture === 'string') {
            texture = window.PIXI.Texture.fromImage(texture);
        }
        if (tiled) {
            this.sprite = new window.PIXI.extras.TilingSprite(texture);
            this.sprite.texture.baseTexture.scaleMode = window.PIXI.SCALE_MODES.NEAREST;
        } else {
            this.sprite = new window.PIXI.Sprite(texture);
        }
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.setNode(this.sprite);
    }
    getAnchor() {
        return this.sprite.anchor;
    };
    setAnchor(x, y) {
        this.sprite.anchor.x = x;
        this.sprite.anchor.y = y;
    };
    getTint() {
        return this.node.tint;
    };
    setTint(tint) {
        this.node.tint = tint;
    };
    getBlendMode() {
        return this.node.tint;
    };
    setBlendMode(blendMode) {
        this.node.blendMode = blendMode;
    };
    getMask() {
        return this.node.mask;
    };
    setMask(entity) {
        this.node.mask = entity.getNode();
    };
    setDimensions(x, y, width, height) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = width;
        this.sprite.height = height;
    };
};
game.renderer.graphicsType = class u extends game.renderer.nodeType {
    constructor() {
        super();
        this.draw = new window.PIXI.Graphics();
        this.draw.clear();
        this.setNode(this.draw);
    }
    drawLine(thickness, xStart, yStart, xEnd, yEnd, color = 0xffffff, alpha = 1) {
        this.draw.alpha = alpha;
        this.draw.lineStyle(thickness, color)
            .moveTo(xStart, yStart)
            .lineTo(xEnd, yEnd);
    }
    drawTriangle(_a, _b, _c, _d, _e, _f) {
        void 0x0 === _d && (_d = null);
        void 0x0 === _e && (_e = null);
        void 0x0 === _f && (_f = null);
        _f && _f > 0x0 && this.draw.lineStyle(_f, _e.r << 0x10 | _e.g << 0x8 | _e.b, _e.a);
        _d && this.draw.beginFill(_d.r << 0x10 | _d.g << 0x8 | _d.b, _d.a);
        this.draw.drawPolygon([_a.x, _a.y, _b.x, _b.y, _c.x, _c.y]);
        _d && this.draw.endFill();
    }
    drawArc(_a, _b, _c, _d, _e, _f, _g, _h, _i) {
        void 0x0 === _g && (_g = null),
            void 0x0 === _h && (_h = null),
            void 0x0 === _i && (_i = null),
            _i && _i > 0x0 && this.draw.lineStyle(_i, _h.r << 0x10 | _h.g << 0x8 | _h.b, _h.a),
            _d = _d * Math.PI / 0xb4,
            _e = _e * Math.PI / 0xb4,
            _g && this.draw.beginFill(_g.r << 0x10 | _g.g << 0x8 | _g.b, _g.a),
            this.draw.arc(_a, _b, _c, _d, _e, _f),
            _g && this.draw.endFill();
    };
    drawCircle(_a, _b, _c, _d, _e, _f) {
        void 0x0 === _d && (_d = null),
            void 0x0 === _e && (_e = null),
            void 0x0 === _f && (_f = null),
            _f && _f > 0x0 && this.draw.lineStyle(_f, _e.r << 0x10 | _e.g << 0x8 | _e.b, _e.a),
            _d && this.draw.beginFill(_d.r << 0x10 | _d.g << 0x8 | _d.b, _d.a),
            this.draw.drawCircle(_a, _b, _c),
            _d && this.draw.endFill();
    };
    drawRect(_a, _b, _c, _d, _e, _f, _g) {
        void 0x0 === _e && (_e = null),
            void 0x0 === _f && (_f = null),
            void 0x0 === _g && (_g = null),
            _g && _g > 0x0 && this.draw.lineStyle(_g, _f.r << 0x10 | _f.g << 0x8 | _f.b, _f.a),
            _e && this.draw.beginFill(_e.r << 0x10 | _e.g << 0x8 | _e.b, _e.a),
            this.draw.drawRect(_a, _b, _c - _a, _d - _b),
            _e && this.draw.endFill();
    };
    drawRoundedRect(_a, _b, _c, _d, _e, _f, _g, _h) {
        void 0x0 === _f && (_f = null),
            void 0x0 === _g && (_g = null),
            void 0x0 === _h && (_h = null),
            _h && _h > 0x0 && this.draw.lineStyle(_h, _g.r << 0x10 | _g.g << 0x8 | _g.b, _g.a),
            _f && this.draw.beginFill(_f.r << 0x10 | _f.g << 0x8 | _f.b, _f.a),
            this.draw.drawRoundedRect(_a, _b, _c - _a, _d - _b, _e),
            _f && this.draw.endFill();
    };
    drawEllipse(_a, _b, _c, _d, _e, _f, _g) {
        void 0x0 === _e && (_e = null),
            void 0x0 === _f && (_f = null),
            void 0x0 === _g && (_g = null),
            _g && _g > 0x0 && this.draw.lineStyle(_g, _f.r << 0x10 | _f.g << 0x8 | _f.b, _f.a),
            _e && this.draw.beginFill(_e.r << 0x10 | _e.g << 0x8 | _e.b, _e.a),
            this.draw.drawEllipse(_a, _b, _c, _d),
            _e && this.draw.endFill();
    };
    getTexture() {
        const renderer = Game.currentGame.renderer.getInternalRenderer();
        return renderer.generateTexture(this.draw);
    };
    clear() {
        this.draw.clear();
    };
};
if (window.location.hostname !== "localhost") {
    game.renderer.models = {GamePlayer:{model:"PlayerModel"},Stone:{model:"RecoilModel",gridSize:{width:3,height:3},args:{name:"/asset/image/map/map-stone.svg"}},Tree:{model:"RecoilModel",gridSize:{width:4,height:4},args:{name:"/asset/image/map/map-tree.svg"}},Wall:{model:"WallModel"},Door:{model:"DoorModel"},SlowTrap:{model:"SlowTrapModel"},ArrowTower:{model:"ArrowTowerModel",gridSize:{width:2,height:2}},CannonTower:{model:"CannonTowerModel",gridSize:{width:2,height:2}},MeleeTower:{model:"MeleeTowerModel",gridSize:{width:2,height:2}},BombTower:{model:"BombTowerModel",gridSize:{width:2,height:2}},MagicTower:{model:"MageTowerModel",gridSize:{width:2,height:2}},GoldMine:{model:"GoldMineModel",gridSize:{width:2,height:2}},Harvester:{model:"HarvesterModel",gridSize:{width:2,height:2}},GoldStash:{model:"GoldStashModel",gridSize:{width:2,height:2}},ArrowProjectile:{model:"ProjectileArrowModel"},CannonProjectile:{model:"ProjectileCannonModel"},BowProjectile:{model:"ProjectileArrowModel"},BombProjectile:{model:"ProjectileBombModel"},FireballProjectile:{model:"ProjectileMageModel"},HealTowersSpell:{model:"HealTowersSpellModel"},PetCARL:{model:"PetModel"},PetMiner:{model:"PetModel"},ZombieGreenTier1:{model:"ZombieModel"},ZombieGreenTier2:{model:"ZombieModel"},ZombieGreenTier3:{model:"ZombieModel"},ZombieGreenTier4:{model:"ZombieModel"},ZombieGreenTier5:{model:"ZombieModel"},ZombieGreenTier6:{model:"ZombieModel"},ZombieGreenTier7:{model:"ZombieModel"},ZombieGreenTier8:{model:"ZombieModel"},ZombieGreenTier9:{model:"ZombieModel"},ZombieGreenTier10:{model:"ZombieModel"},ZombieRangedGreenTier1:{model:"ZombieRangedModel"},ZombieBlueTier1:{model:"ZombieModel"},ZombieBlueTier2:{model:"ZombieModel"},ZombieBlueTier3:{model:"ZombieModel"},ZombieBlueTier4:{model:"ZombieModel"},ZombieBlueTier5:{model:"ZombieModel"},ZombieBlueTier6:{model:"ZombieModel"},ZombieBlueTier7:{model:"ZombieModel"},ZombieBlueTier8:{model:"ZombieModel"},ZombieBlueTier9:{model:"ZombieModel"},ZombieBlueTier10:{model:"ZombieModel"},ZombieRedTier1:{model:"ZombieModel"},ZombieRedTier2:{model:"ZombieModel"},ZombieRedTier3:{model:"ZombieModel"},ZombieRedTier4:{model:"ZombieModel"},ZombieRedTier5:{model:"ZombieModel"},ZombieRedTier6:{model:"ZombieModel"},ZombieRedTier7:{model:"ZombieModel"},ZombieRedTier8:{model:"ZombieModel"},ZombieRedTier9:{model:"ZombieModel"},ZombieRedTier10:{model:"ZombieModel"},ZombieYellowTier1:{model:"ZombieModel"},ZombieYellowTier2:{model:"ZombieModel"},ZombieYellowTier3:{model:"ZombieModel"},ZombieYellowTier4:{model:"ZombieModel"},ZombieYellowTier5:{model:"ZombieModel"},ZombieYellowTier6:{model:"ZombieModel"},ZombieYellowTier7:{model:"ZombieModel"},ZombieYellowTier8:{model:"ZombieModel"},ZombieYellowTier9:{model:"ZombieModel"},ZombieYellowTier10:{model:"ZombieModel"},ZombiePurpleTier1:{model:"ZombieModel"},ZombiePurpleTier2:{model:"ZombieModel"},ZombiePurpleTier3:{model:"ZombieModel"},ZombiePurpleTier4:{model:"ZombieModel"},ZombiePurpleTier5:{model:"ZombieModel"},ZombiePurpleTier6:{model:"ZombieModel"},ZombiePurpleTier7:{model:"ZombieModel"},ZombiePurpleTier8:{model:"ZombieModel"},ZombiePurpleTier9:{model:"ZombieModel"},ZombiePurpleTier10:{model:"ZombieModel"},ZombieOrangeTier1:{model:"ZombieModel"},ZombieOrangeTier2:{model:"ZombieModel"},ZombieOrangeTier3:{model:"ZombieModel"},ZombieOrangeTier4:{model:"ZombieModel"},ZombieOrangeTier5:{model:"ZombieModel"},ZombieOrangeTier6:{model:"ZombieModel"},ZombieOrangeTier7:{model:"ZombieModel"},ZombieOrangeTier8:{model:"ZombieModel"},ZombieOrangeTier9:{model:"ZombieModel"},ZombieOrangeTier10:{model:"ZombieModel"},ZombieBossTier1:{model:"ZombieBossModel"},ZombieBossTier2:{model:"ZombieBossModel"},ZombieBossTier3:{model:"ZombieBossModel"},ZombieBossTier4:{model:"ZombieBossModel"},ZombieBossTier5:{model:"ZombieBossModel"},ZombieBossTier6:{model:"ZombieBossModel"},ZombieBossTier7:{model:"ZombieBossModel"},ZombieBossTier8:{model:"ZombieBossModel"},ZombieBossTier9:{model:"ZombieBossModel"},ZombieBossTier10:{model:"ZombieBossModel"},ZombieBossTier11:{model:"ZombieBossModel"},ZombieBossTier12:{model:"ZombieBossModel"},ZombieBossTier13:{model:"ZombieBossModel"},ZombieBossTier14:{model:"ZombieBossModel"},ZombieBossTier15:{model:"ZombieBossModel"},ZombieBossTier16:{model:"ZombieBossModel"},ZombieBossTier17:{model:"ZombieBossModel"},ZombieBossTier18:{model:"ZombieBossModel"},ZombieBossTier19:{model:"ZombieBossModel"},ZombieBossTier20:{model:"ZombieBossModel"},ZombieBossTier21:{model:"ZombieBossModel"},ZombieBossTier22:{model:"ZombieBossModel"},ZombieBossTier23:{model:"ZombieBossModel"},ZombieBossTier24:{model:"ZombieBossModel"},ZombieBossTier25:{model:"ZombieBossModel"},ZombieBossTier26:{model:"ZombieBossModel"},ZombieBossTier27:{model:"ZombieBossModel"},ZombieBossTier28:{model:"ZombieBossModel"},ZombieBossTier29:{model:"ZombieBossModel"},ZombieBossTier30:{model:"ZombieBossModel"},ZombieBossTier31:{model:"ZombieBossModel"},ZombieBossTier32:{model:"ZombieBossModel"},ZombieBossTier33:{model:"ZombieBossModel"},ZombieBossTier34:{model:"ZombieBossModel"},ZombieBossTier35:{model:"ZombieBossModel"},ZombieBossTier36:{model:"ZombieBossModel"},ZombieBossTier37:{model:"ZombieBossModel"},ZombieBossTier38:{model:"ZombieBossModel"},ZombieBossTier39:{model:"ZombieBossModel"},ZombieBossTier40:{model:"ZombieBossModel"},NeutralCamp:{model:"NeutralCampModel"},NeutralTier1:{model:"NeutralModel"},PathNode:{model:"PathNodeModel"}};
    game.lerp = function(t, e, r) {
        return (r > 1.2 && (r = 1), t + (e - t) * r);
    }
    game.mod = function (_a, _b) {
        return (_a % _b + _b) % _b;
    }
    game.interpolateYaw = function (__a, __b) {
        var _game = Game.currentGame.world.getReplicator().getMsInThisTick() / Game.currentGame.world.getMsPerTick(),
            delta = __a - __b;
        delta = game.mod(delta + 0xb4, 0x168) - 0xb4;
        delta = game.lerp(0x0, delta, _game);
        var addDelta = __b + delta;
        addDelta < 0x0 && (addDelta += 0x168);
        addDelta >= 0x168 && (addDelta -= 0x168);
        return addDelta;
    }
    game.renderer.entityType = class o extends game.renderer.nodeType {
        constructor(t) {
            super();
            this.uid = t.uid;
            this.setVisible(true);
            this.setTargetTick(t);
        }
        calculateVector(t, e, r) {
            return (r > 1.2 && (r = 1), t + (e - t) * r);
        }
        reset() {
            this.uid = 0;
            this.currentModel = null;
            this.entityClass = null;
            this.fromTick = null;
            this.targetTick = null;
            this.setVisible(true);
        }
        isLocal() {
            var t = Game.currentGame.world.getLocalPlayer();
            return !(!t || !t.getEntity()) && this.uid == t.getEntity().uid;
        }
        getTargetTick() {
            return this.targetTick;
        }
        getFromTick() {
            return this.fromTick;
        }
        setTargetTick(t) {
            this.targetTick || (this.entityClass = t.entityClass, this.targetTick = t);
            this.addMissingTickFields(t, this.targetTick);
            this.fromTick = this.targetTick;
            this.targetTick = t;
            void 0 !== t.scale && this.setScale(t.scale);
            this.fromTick.model !== this.targetTick.model && this.refreshModel(this.targetTick.model);
            this.entityClass = this.targetTick.entityClass;
        }
        overrideFromTick(t) {
            this.fromTick = t;
        }
        overrideTargetTick(t) {
            this.targetTick = t;
        }
        tick(t, e) {
            if (this.fromTick) {
                var r = t / e;
                this.isVisible || this.setVisible(true);
                this.setPositionX(this.calculateVector(this.fromTick.position.x, this.targetTick.position.x, r));
                this.setPositionY(this.calculateVector(this.fromTick.position.y, this.targetTick.position.y, r));
                this.setRotation(((t, e) => {
                    let r = t - e;
                    r = ((r + 180) % 360 + 360) % 360 - 180;
                    r = this.calculateVector(0, r, Game.currentGame.world.getReplicator().getMsInThisTick() / Game.currentGame.world.getMsPerTick());

                    let i = e + r;
                    i < 0 && (i += 360);
                    i >= 360 && (i -= 360);

                    return i;
                })(this.targetTick.yaw, this.fromTick.yaw));
            }
        }
        update(t, e) {
            this.fromTick && (this.fromTick.interpolatedYaw = this.getRotation());
            if (this.currentModel && game.script.optimize.updateAnimation) this.currentModel.update(t, this.fromTick);
            this.node.visible = this.isVisible;
        }
        refreshModel(t) {
            const e = game.renderer.models;
            if (!(t in e)) throw new Error("Attempted to create unknown model: " + t);
            var r = e[t].model;

            Game.currentGame.getModelEntityPooling(r) && (this.currentModel = Game.currentGame.world.getModelFromPool(r));
            if (!this.currentModel) {
                var i = {};
                "args" in e[t] && (i = e[t].args);
                i.modelName = t;

                this.currentModel = Game.currentGame.assetManager.loadModel(r, i);
                this.currentModel.modelName = r;
            }
            if (this.currentModel.modelName == 'PlayerModel') {
                this.currentModel.updateSwingingWeapon = function (useThisIfUrGay, radius) {
                    var currentModel = this;
                    void 0 === radius && (radius = 100);
                    return function (tick, currentTick) {
                        var interpolatedYaw = game.interpolateYaw(currentTick.getTargetTick().aimingYaw, currentTick.getFromTick().aimingYaw);
                        currentModel.weapon.setRotation(interpolatedYaw - tick.interpolatedYaw);
                        if (tick.firingTick && (tick.firingTick !== currentModel.lastFiringTick || !currentModel.lastFiringAnimationDone)) {
                            currentModel.lastFiringTick = tick.firingTick;
                            currentModel.lastFiringAnimationDone = false;
                            var msSinceTick = Game.currentGame.world.replicator.getMsSinceTick(tick.firingTick),
                                itemSchema = game.ui.itemSchema,
                                _a = Math.min(msSinceTick / itemSchema[currentModel.lastWeaponName].msBetweenFiresTiers[currentModel.lastWeaponTier - 1], 1),
                                _b = Math.sin(_a * Math.PI) * radius // itemSchema[currentModel.lastWeaponName].maxYawDeviationTiers[currentModel.lastWeaponTier - 1];
                            1 === _a && (currentModel.lastFiringAnimationDone = true);
                            currentModel.weapon.setRotation(interpolatedYaw - tick.interpolatedYaw - _b);
                            currentModel.hat && currentModel.hat.setRotation(interpolatedYaw - tick.interpolatedYaw - 0.6 * _b);
                        }
                    }
                }
                /*
                this.currentModel.updateRotationWithLocalData = function(entity, yaw) {
                    if (entity.isLocal() || yaw) {
                        entity.getTargetTick().aimingYaw = entity.getFromTick().aimingYaw = yaw || game.inputPacketCreator.getLastAnyYaw();
                    }
                }
                */
            };
            this.currentModel.setParent(this);
            this.setNode(this.currentModel.getNode());
        }
        addMissingTickFields(t, e) {
            for (var r in e) {
                var i = e[r];
                r in t || (t[r] = i);
            }
        }
    };
    game.renderer.textSpriteType = class s extends window.PIXI.Text {
        constructor() {
            super();
        }
        renderWebGL(t) {
            this.updateText(true);
            this.calculateVertices();

            t.setObjectRenderer(t.plugins[this.pluginName]);
            t.plugins[this.pluginName].render(this);
        }
        _renderCanvas(t) {
            this.updateText(true);
            t.plugins[this.pluginName].render(this);
        }
    };
    game.renderer.textType = class a extends game.renderer.nodeType {
        constructor(t, e, r) {
            super();
            this.text = new game.renderer.textSpriteType(t, {fontFamily: e, fontSize: r, lineJoin: "round", padding: 10});
            this.text.resolution = 2 * window.devicePixelRatio;
            this.setNode(this.text);
        }
        setColor(t, e, r) {
            this.text.style.fill = t << 16 | e << 8 | r;
        }
        setStroke(t, e, r, i) {
            this.text.style.stroke = t << 16 | e << 8 | r;
            this.text.style.strokeThickness = i;
        }
        setFontWeight(t) {
            this.text.style.fontWeight = t;
        }
        setLetterSpacing(t) {
            this.text.style.letterSpacing = t;
        }
        setAnchor(t, e) {
            this.text.anchor.set(t, e);
        }
        setString(t) {
            this.text.text = t;
        }
    }

    Game.currentGame.world.createEntity = function(t) {
        if (this.entities[t.uid]) return;

        let e;
        if (Game.currentGame.getNetworkEntityPooling() && this._networkEntityPool.length > 0) {
            e = this._networkEntityPool.shift();
            e.setTargetTick(t);
            e.uid = t.uid;
        } else {
            e = new game.renderer.entityType(t);
        }

        let shouldLoadModel = true;
        if (t.model.indexOf("Zombie") > -1 && !game.script.optimize.zombieSprite) shouldLoadModel = false;
        if (t.model in game.ui.buildingSchema && !game.script.optimize.towerSprite) shouldLoadModel = false;
        if (t.entityClass == "Projectile" && !game.script.optimize.projectileSprite) shouldLoadModel = false;
        shouldLoadModel && e.refreshModel(t.model);

        t.uid === this.myUid && (this.localPlayer.setEntity(e), this.renderer.follow(e));
        this.entities[t.uid] = e;
        this.renderer.add(e, t.entityClass);
        this.entityGrid.updateEntity(this.entities[t.uid]);
        game.script.stashIndicators.onEntityCreated(t);
    };
    Game.currentGame.world.removeEntity = function(t) {
        if (["Tree", "Stone", "NeutralCamp"].indexOf(this.entities[t].fromTick.model) > -1) return;
        game.script.showAoe.onEntityRemoved(t);
        this.renderer.remove(this.entities[t]);
        this.entityGrid.removeEntity(parseInt(t));
        if (this.entities[t].currentModel) {
            const model = this.entities[t].currentModel;
            if (Game.currentGame.getModelEntityPooling(model.modelName)) {
                model.reset();
                this.modelEntityPool[model.modelName].push(model);
            };
        };
        if (Game.currentGame.getNetworkEntityPooling()) {
            this.entities[t].reset();
            this._networkEntityPool.push(this.entities[t]);
        }
        delete this.entities[t];
    };
    Game.currentGame.renderer.add = function(t, e) {
        if (t instanceof game.renderer.entityType) {
            switch (e) {
                case "Prop":
                    this.scenery.addAttachment(t);
                    break;
                case "Projectile":
                    this.projectiles.addAttachment(t);
                    break;
                case "Player":
                    this.players.addAttachment(t);
                    break;
                default:
                    this.npcs.addAttachment(t);
            }
            // } else t instanceof game.renderer.textType ? this.ui.addAttachment(t) : this.ground.addAttachment(t);
        } else if (!game.script.optimize.background) {
            if (t instanceof game.renderer.nodeType) Game.currentGame.renderer.ground.addAttachment(t);
            else {
                if (!(t instanceof game.renderer.textType)) return; // throw new Error("Unhandled object: " + JSON.stringify(t));
                Game.currentGame.renderer.ui.addAttachment(t);
            }
        } else t instanceof game.renderer.textType ? this.ui.addAttachment(t) : this.ground.addAttachment(t);
    };
    Game.currentGame.renderer.remove = function(t) {
        if (t instanceof game.renderer.entityType) {
            switch (t.entityClass) {
                case "Prop":
                    this.scenery.removeAttachment(t);
                    break;
                case "Projectile":
                    this.projectiles.removeAttachment(t);
                    break;
                case "Player":
                    this.players.removeAttachment(t);
                    break;
                default:
                    this.npcs.removeAttachment(t);
            }
            // } else t instanceof game.renderer.textType ? this.ui.removeAttachment(t) : this.ground.removeAttachment(t);
        } else if (!game.script.optimize.background) {
            t instanceof game.renderer.nodeType ? Game.currentGame.renderer.ground.removeAttachment(t) : t instanceof game.renderer.textType && Game.currentGame.renderer.ui.removeAttachment(t);
        } else t instanceof game.renderer.textType ? this.ui.removeAttachment(t) : this.ground.removeAttachment(t);
    };
    Game.currentGame.renderer.tickCallbacks[7] = () => {
        const t = Game.currentGame.world.replicator.getMsInThisTick();
        for (const e in Game.currentGame.world.entities) {
            Game.currentGame.world.entities[e].tick(t, Game.currentGame.world.replicator.msPerTick);
        };
    };
} else {
    Game.currentGame.world._createEntity = Game.currentGame.world.createEntity;
    Game.currentGame.world.createEntity = function(t) {
        if (this.entities[t.uid]) return;
        this._createEntity(t);
        game.script.stashIndicators.onEntityCreated(t);
    };
    Game.currentGame.world._removeEntity = Game.currentGame.world.removeEntity;
    Game.currentGame.world.removeEntity = function(t) {
        if (["Tree", "Stone", "NeutralCamp"].indexOf(this.entities[t].fromTick.model) > -1) return;
        game.script.showAoe.onEntityRemoved(t);
        this._removeEntity(t);
    };
};

game.assetManager.models ||= {};
game.assetManager.models.rangeIndicatorModel = function(e, innerRGB = {r: 0xc8, g: 0xa0, b: 0x0}, borderRGB = {r: 0xff, g: 0xc8, b: 0x0}, lineWidth = 8) {
    const container = new game.renderer.nodeType();
    container.isCircular = e.isCircular || false;
    container.goldRegion = new game.renderer.graphicsType();
    container.goldRegion.setAlpha(0.1);

    if (container.isCircular) {
        container.goldRegion.drawCircle(0, 0, e.radius, innerRGB, borderRGB, lineWidth);
    } else {
        container.goldRegion.drawRect(-e.width / 2, -e.height / 2, e.width / 2, e.height / 2, innerRGB, borderRGB, lineWidth);
    };

    container.addAttachment(container.goldRegion);
    return container;
};

/* @Misc. */
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);


/* @Bindings */
(function MapFunctionsToElem() {
    for (let page in menu) {
        const [optionsElem, moreElem] = document.querySelectorAll("#" + page + " > div");
        for (let option in menu[page]) {
            const {name, description, more, isToggle, callback, customButtonText, onCallback, offCallback} = menu[page][option];
            const hasMore = !!more;
            const itemElem = document.createElement("div");
            itemElem.id = option + "-div";
            // if option is an object
            if (typeof game.options.options[option] == "object") {
                itemElem.innerHTML = `
                    <h2>${name}</h2>
                    <span>${description}</span>
                    <button id="toggle-${option}" ${game.options.options[option].enabled ? `class="underline-red"` : ""}>
                        ${game.options.options[option].enabled ? "Disable" : "Enable"}
                    </button>
                    ${isToggle === false ? `<button id="${name}">${customButtonText}</button>` : ""}
                    ${hasMore ? `<a id="more-${option}"></a>` : ""}
                    <div>
                        <span>Multibox</span>
                        <input id="multibox-${option}" type="checkbox" ${game.options.options[option].multibox ? "checked" : ""} />
                    </div>
                `;
                // if option is a boolean or undefined
            } else {
                itemElem.innerHTML = `
                    <h2>${name}</h2>
                    <span>${description}</span>
                    ${game.options.options[option] === undefined ? "" : `
                        <button id="toggle-${option}" ${game.options.options[option] ? `class="underline-red"` : ""}>
                            ${game.options.options[option] ? "Disable" : "Enable"}
                        </button>
                    `}
                    ${isToggle === false ? `<button id="${name}">${customButtonText}</button>` : ""}
                    ${hasMore ? `<a id="more-${option}"></a>` : ""}
                `;
            };
            optionsElem.appendChild(itemElem);

            if (hasMore) {
                const {html, functions, bind} = more;
                const moreContainer = document.createElement("div");
                moreContainer.innerHTML = html;
                moreContainer.style.display = "none";
                moreElem.appendChild(moreContainer);
                functions?.();

                const toggleElem = getId("more-" + option);
                toggleElem.onclick = () => {
                    refreshMore(page);
                    bind?.();
                    moreContainer.style.display = "block";
                }
            }
            if (!(game.options.options[option] === undefined)) {
                if (typeof game.options.options[option] == "object") {
                    addFunctionToElem({id: 'multibox-' + option, option, isCheckBox: true});
                };
                addFunctionToElem({id: 'toggle-' + option, option, buttonText: '', colors: "underline-red?", isToggle, callback, onCallback, offCallback});
            } else if (isToggle === false) {
                addFunctionToElem({id: name, option, buttonText: '', colors: "underline-red?", isToggle, callback, onCallback, offCallback});
            };
        };
    };
})();

(function MapHandlers() {
    for (const functionName in game.script) game.script[functionName]?.init?.();
    game.script.sockets.helpers.init();
    /*
    for (const subFunctionName in game.script.sockets) {
        if (typeof game.script.sockets[subFunctionName] == "object") {} // && (game.script.sockets[subFunctionName].parent = game.script.sockets);
    };
    */
    const keybindListeners = {};
    for (const functionName in game.options.options) {
        if (!game.script[functionName] || game.script[functionName].handlers === undefined) continue;
        const usesHandlers = game.script[functionName].handlers;
        for (const {type, names} of usesHandlers) {
            console.log(type, functionName, names);
            switch(type) {
                case "rpc":
                    for (const name of names) {
                        game.network.addRpcHandler(name, game.script[functionName][name].bind(game.script[functionName]));
                    };
                    break;
                case "entityUpdate":
                    game.network.addEntityUpdateHandler(game.script[functionName][names].bind(game.script[functionName]));
                    break;
                case "tickUpdate":
                    game.ui._events[names].push(game.script[functionName][names].bind(game.script[functionName][names]));
                    break;
                case "keybind":
                    if (typeof names == "object") {
                        for (const name of names) {
                            keybindListeners[name] ||= [];
                            keybindListeners[name].push(functionName);
                        };
                    } else {
                        keybindListeners[names] ||= [];
                        keybindListeners[names].push(functionName);
                    };
                    break;
                case "packetFunc":
                    game.network[names[0]] = function(data) {
                        game.script[functionName][names[1]](data);
                        this.sendPacket(names[2], data);
                    };
                    break;
            };
        };
    };
    for (const name in keybindListeners) {
        document.addEventListener(name, function(e) {
            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                for (const functionName of keybindListeners[name]) game.script[functionName][name](e);
            };
        });
    };
})();