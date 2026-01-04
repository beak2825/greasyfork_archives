// ==UserScript==
// @name         Sun:Raise - zombs.io
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  weeb strikes again
// @author       rdm
// @match        *://zombs.io/
// @icon         https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Kanae%20Midsummer%20icon.webp?v=1716509941729
// @grant        none
// @license      GNU GPLv3
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/467381/Sun%3ARaise%20-%20zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/467381/Sun%3ARaise%20-%20zombsio.meta.js
// ==/UserScript==

/* @Credit
 * i have to give credit where credit is due,
 * most of the images used in this mod, including:
 *   + intro background (#hud-intro::before),
 *   + theme-character (.hud-intro-character)
 * is taken from Arcaea, this mod is themed to look
 * like Arcaea's UI.
 *
 * visit Arcaea at https://arcaea.lowiro.com/ and
 * check out the game on Google's Play Store and
 * Apple's App Store.
 */

// day 1 (0.1) : intro styles done
// day 2 (0.2) : menu styles done
// day 3 (0.3) : ahrc, rb, autoup done + polishing
// day 4 (0.4) : entering unfamiliar territory with scanner
// day 5 (0.41): polishing
// day ? (0.42): beta release
// v0.5        : added resizeable wall blocks
// v0.6        : auto heal & ??????????????????
// v0.7        : unlimited slots base saver
// v0.71       : shop shortcuts
// v0.73       : shop shortcut fixes & added entity preserver
// v0.80       : raid defending tools (in Misc.) and Grouping Grid (courtesy of ABCxFF) added
// v0.90       : multi-auto-heal feature based on Trollers' idea, fix assets (again) & one minor fix
// v0.91       : websocket scanner preview
// v0.92       : map viewer (press +) backported from my personal mod
// v0.93       : i forgor that entity caching (added in v0.91? but i also forgor to note that in oops) doesnt have a reset button so now it does
// v1.00       : now with enough features! and more to come...
// v1.10       : session saver! more about it here: https://github.com/AyuBloom/zombs-session-saver

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

// @FontAwesome
const fontAwesome = document.createElement("script");
fontAwesome.type = "text/javascript";
fontAwesome.src = "https://kit.fontawesome.com/1c239b2e80.js";
document.head.appendChild(fontAwesome);

document.querySelectorAll('.ad-unit, #hud-intro > div.hud-intro-wrapper > h1, #hud-intro > div.hud-intro-footer > a:nth-child(2), #hud-intro > div.hud-intro-footer > a:nth-child(4), #hud-menu-shop > div.hud-shop-grid > a:nth-child(10), #hud-intro > div.hud-intro-wrapper > h2, .hud-intro-left, .hud-intro-guide, .hud-intro > .hud-intro-stone, .hud-intro >.hud-intro-tree, .hud-intro-youtuber, .hud-intro-more-games, .hud-intro-social, .hud-respawn-corner-bottom-left, .hud-respawn-twitter-btn, .hud-respawn-facebook-btn').forEach(el => el.remove());

const css = `
/* @Media */
@media only screen and (min-width: 1200px) {
    #hud-intro {
        zoom: 110%;
    }
}
/* @Root */
:root {
    --menu-background: hsl(29deg 69% 34% / 40%);
    --normal-btn: hsl(44deg 58% 60%);
    --light-hover-btn: hsl(44deg 88% 70%);
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

/* @Keyframes */
@keyframes parallax-bg {
    0%, 100% {
        background-position: top left;
    }
    50% {
        background-position: bottom right;
    }
}
@keyframes bounce {
    50%   { background-position-y: -10px; }
    100%  { background-position-y: 0px; }
}
@keyframes slide-in-left {
    0% {
        left: -100%;
    }
    100% {
        left: 0px;
    }
}
@keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

/* @ButtonStyles */
.no-bg {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    color: #eee;
    background: none;
    box-shadow: none;
    border: none;
    cursor: pointer;
}
.underline-white {
    border-bottom: 3px solid #eee;
}
.underline-red {
    border-bottom: 3px solid red;
}
.hud-settings-options .underline-red {
    border-bottom: 3px solid red;
}
.btn-important {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    color: var(--normal-btn);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    border-bottom: 3px solid var(--normal-btn);
    box-shadow: inset 0 -7px 9px -7px var(--normal-btn);
}
.btn-important:hover {
    filter: saturate(200%);
}
.btn-diamond {
    display: block;
    position: relative;
    overflow: hidden;
    width: 75px;
    height: 75px;
    transform: rotate(45deg);
    margin: 10px;
    border: 4px solid white;
    cursor: pointer;
}
.btn-diamond::before {
    position: relative;
    content: '';
    width: 0;
    height: 0;
    border-top: 60px solid rgba(0, 0, 0, 0.2);
    border-right: 60px solid transparent;
    left: -10px;
    top: 25px;
}
.btn-diamond:hover {
    filter: saturate(200%);
    box-shadow: inset 0 0 20px 3px rgb(0 0 0 / 45%);
}
.btn-diamond p {
    margin: 0px;
    transform: rotate(-45deg);
    position: relative;
    color: white;
    font-size: 18px;
    top: -6px;
    font-weight: 600;
}
/* @IntroStyles */
.hud-intro::before {
    background-image: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Omatsuri%20Light.webp?v=1714878746625');
    background-size: 200%;
    background-position: top;
    filter: blur(10px);
    animation-name: parallax-bg;
    animation-duration: 400s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
.hud-intro::after {
    background: rgba(0, 0, 0, 0.2);
}
#hud-intro > div.hud-intro-corner-top-left {
    top: 0px;
    left: 0px;
    /* display: none; */
}
.hud-intro-stick {
    display: block;
    position: relative;
    width: 30vw;
    background: #eee;
    height: 30px;
    box-shadow: 0px 5px 10px 2px rgb(0 0 0 / 70%);
    font-weight: 700;
    padding: 4px;
}
.hud-intro-stick::before {
    display: block;
    position: absolute;
    content: "";
    right: -12px;
    top: 3px;
    height: 22.5px;
    width: 22.5px;
    transform: rotate(45deg);
    background: #eee;
}
.hud-intro-stick::after {
    display: block;
    position: absolute;
    content: "";
    right: -11px;
    top: 4px;
    height: 18px;
    width: 18px;
    transform: rotate(45deg);
    background: black;
    border: 2px double #eee;
}
.hud-intro-scan-data {
    width: 30vw;
    min-width: 100%;
    height: fit-content;
    background: rgba(0, 0, 0, 0.4);
    border-bottom-right-radius: 4px;
    padding: 10px;
    zoom: 90%;
    color: #eee;
    max-height: 400px;
    overflow: scroll;
}
.hud-intro-scan-data .hud-intro-scan-data-player {
    position: relative;
    display: block;
    margin: 0 0 8px;
    padding: 0 90px 0 40px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
}
.hud-intro-scan-data .hud-intro-scan-data-player:last-child {
    margin-bottom: 0;
}
.hud-intro-scan-data .hud-intro-scan-data-player.is-header * {
    color: rgba(255, 255, 255, 0.6) !important;
}
.hud-intro-scan-data .hud-intro-scan-data-player .player-rank {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    color: rgba(255, 255, 255, 0.6);
}
.hud-intro-scan-data .hud-intro-scan-data-player .player-name {
    display: block;
    height: 20px;
    line-height: 20px;
}
.hud-intro-scan-data .hud-intro-scan-data-player .player-score {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 50px;
    color: rgba(255, 255, 255, 1);
}
.hud-intro-scan-data .hud-intro-scan-data-player .player-wave {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    color: rgba(255, 255, 255, 0.7);
}
.hud-intro-scan-data hr {
    border: 1px dashed #eee;
    margin: 20px 0;
}
#hud-intro > div.hud-intro-corner-top-right {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    top: 0px;
    right: 0px;
    border-bottom-left-radius: 4px;
}
#hud-intro > div.hud-intro-corner-top-right::before {
    display: block;
    position: absolute;
    content: "";
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent 5%, rgba(255, 255, 255, 0.9));
    right: 10px;
    bottom: 0px;
}
#hud-intro > div.hud-intro-corner-top-right::after {
    display: block;
    position: absolute;
    content: "";
    width: 15px;
    height: 15px;
    transform: rotate(45deg);
    margin: 10px;
    border: 4px solid white;
    background: black;
    right: 0px;
    bottom: -20px;
    box-shadow: none;
    border-style: double;
}
.hud-intro .hud-intro-footer {
    left: 20px;
    right: unset;
    text-shadow: 0 1px 3px rgb(0 0 0 / 50%);
    z-index: 20 !important;
}
#hud-intro > div.hud-intro-wrapper > div {
    z-index: 31;
    margin: 50px 30vw 0 0;
}
#hud-intro > div.hud-intro-wrapper > div > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 380px;
    padding-bottom: 0px;
    padding-top: 37.5px;
}
.hud-intro-server-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 10px;
}
.hud-intro-server-decorator {
    width: 0px;
    content: "";
    height: 0px;
    border-bottom: 50px solid #eee;
    border-right: 50px solid transparent;
    position: relative;
    bottom: 0px;
}
#hud-intro > div.hud-intro-wrapper > div > div > div > div > select {
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
}
.hud-intro-name-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 5px;
}
.hud-intro-name-decorator {
    width: 0px;
    content: "";
    height: 0px;
    border-top: 50px solid #eee;
    border-right: 50px solid transparent;
    position: relative;
    bottom: 0px;
}
.hud-intro-name-decorator::after {
    content: "";
    position: absolute;
    bottom: 54px;
    left: -200px;
    width: 120px;
    border-bottom: 3px dashed #eee;
}
#hud-intro > div.hud-intro-wrapper > div > div > div > div > input {
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
    padding: 8px 30px 8px 14px;
}
#saved-names {
    position: absolute;
    top: -34px;
    left: -20px;
    box-shadow: none;
    border: none;
    background: none;
    width: 20px;
}
#scan-btn {
    cursor: pointer;
    width: 120px;
    position: relative;
    right: -160px;
    top: -20px;
    height: 120px;
    margin: -60px;
    filter: drop-shadow(7.5px 2.5px 0px rgba(0, 0, 0, 0.5));
}
.hud-intro .hud-intro-form .hud-intro-play {
    width: 150px;
    height: 150px;
    transform: rotate(45deg);
    border: 5px solid white;
    margin-bottom: -20px;
    margin-left: -7.5px;
    margin-right: -150px;
    margin-top: -17.5px;
    background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Story_crimsonsolace.webp?v=1714878769815);
    background-size: 150%;
    padding: 0 0 0 0;
    background-position-y: center;
    background-position-x: center;
    transition: all 0.15s ease-in-out;
    z-index: 21 !important;
    position: relative;
    filter: drop-shadow(10px -5px 0px rgba(0, 0, 0, 0.4));
}
.hud-intro .hud-intro-form .hud-intro-play:hover {
    filter: drop-shadow(10px -5px 0px rgba(0, 0, 0, 0.4)) saturate(200%);
    box-shadow: inset 0 0 20px 3px rgb(0 0 0 / 45%);
}
#playspan {
    position: relative;
    font-weight: 900;
    z-index: 22;
    font-size: xx-large;
    text-shadow: 1px 1px 3px black;
    cursor: pointer;
    font-family: 'Open Sans';
    pointer-events: none;
    top: -75px;
    left: 65px;
    margin: -20px -30px;
}
.hud-intro .hud-intro-form .hud-intro-play::after {
    display: block;
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    width: 40px;
    height: 40px;
    border-top: 5px solid white;
    border-left: 5px solid white;
    border-top-left-radius: 5px;
    pointer-events: none;
}
#hud-intro > div.hud-intro-wrapper > div > div > label {
    margin: -30px 20px 0 0;
}
.hud-intro .hud-intro-decoration {
    display: flex;
    position: absolute;
    bottom: 0px;
    width: 100%;
    pointer-events: none;
}
.hud-intro .hud-intro-decoration > * {
    pointer-events: none;
}
.hud-intro-decoration .hud-intro-left-triangle {
    height: 300px;
    width: 600px;
}
.hud-intro-decoration .hud-intro-left-triangle::before {
    width: 100%;
    height: 100%;
    transform: rotate(30deg);
    content: '';
    display: block;
    position: absolute;
    left: -40%;
    bottom: -50%;
    background-image: linear-gradient( 45deg, rgba(60, 50, 93, 0.8) 25%, rgba(60, 50, 93, 0.7) 25%, rgba(60, 50, 93, 0.7) 50%, rgba(60, 50, 93, 0.8) 50%, rgba(60, 50, 93, 0.8) 75%, rgba(60, 50, 93, 0.7) 75%, rgba(60, 50, 93, 0.7) );
    background-size: 10px 10px;
}
.hud-intro-decoration .hud-intro-right-triangle {
    height: 700px;
    width: 700px;
}
.hud-intro-decoration .hud-intro-right-triangle::before {
    width: 100%;
    height: 100%;
    transform: rotate(-45deg);
    content: '';
    display: block;
    position: absolute;
    right: -50%;
    bottom: -50%;
    color: white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/light2.webp?v=1714878822666);
    background-position-x: 130px;
    filter: drop-shadow(4px 2px 6px black);
}
.hud-intro-decoration .hud-intro-character {
    display: block;
    position: absolute;
    height: 70vh;
    width: 70vh;
    bottom: 7.5vh;
    right: calc(20vw - 35vh);
    cursor: default;
    z-index: 30;
    filter: drop-shadow(15px 15px 0px rgba(0, 0, 0, 0.3));
    background-size: cover;
    background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Kanae%20midsummer.webp?v=1714878905694);
    background-repeat: no-repeat;
    animation-name: bounce;
    animation-duration: 10s;
    animation-iteration-count: infinite;
}
.hud-intro-credits {
    position: fixed;
    display: block;
    bottom: 40px;
    left: 20px;
    color: rgba(255, 255, 255, 0.4);
}

/* @UIBuildingOverlay */
.hud-building-overlay {
    background: var(--menu-background);
    border: 3px solid white;
    padding: 12px;
    width: 370px;
}
.hud-building-overlay::after {
    border-top: 6px solid white;
    top: 101%;
}
.hud-building-overlay .hud-tooltip-health .hud-tooltip-health-bar {
    background: #bf6509;
}

/* @UIChatStyles */
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
.hud-chat .hud-spw {
    display: none;
    height: 180px;
    padding: 10px;
    overflow-y: auto;
}
.hud-spw strong {
    color: #a79aef;
}
.hud-chat-link-tab {
    display: block;
    float: left;
    padding: 0 14px;
    margin: 0 1px -10px 0;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.15s ease-in-out;
    line-height: 40px;
    border-width: 0;
}
.hud-chat-link-tab:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #eee;
}
.hud-chat-link-tab.is-active {
    background: rgba(0, 0, 0, 0.2);
    color: #eee;
}
#hud > div.hud-top-left > div.chat-tool {
    display: none;
    opacity: 0;
    position: relative;
    width: 510px;
    text-align: center;
    margin: -20px 0 0 -10px;
    transition: background 0.15s ease-in-out;
}
#hud > div.hud-top-left > div.chat-tool.is-focused {
    display: block;
    opacity: 1;
}

/* @UIZoomStyles */
.interaction-wheel {
    display: none;
    height: 250px;
    width: 250px;
    border: 80px solid rgba(0, 0, 0, 0.4);
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
    background: rgba(0, 0, 0, 0.4);
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
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Friends_Mutual.webp?v=1714878926203);
    background-size: 90%;
    top: 5%;
    left: 5%;
}
#zoom-mode {
    background: rgba(0, 0, 0, 0.4);
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
#zoom-controls {
    background: rgba(0, 0, 0, 0.2);
    color: white;
    right: calc(50% - 65px);
    position: fixed;
    top: 74px;
    height: 60px;
    width: 130px;
    border-radius: 4px;
    border: none;
    text-align: start;
    padding: 10px;
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

/* @UIMapViewer */

.hud-map-resource {
    display: none;
    position: absolute;
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    background: #eee;
    border-radius: 50%;
    z-index: 2;
    transform: scale(0.6);
}
.hud-intro-tree {
    display: block;
    position: absolute;
    background: url('/asset/image/ui/entities/entities-tree.svg') no-repeat;
    width: 192px;
    height: 192px;
    z-index: -1;
}
.hud-intro-stone {
    display: block;
    position: absolute;
    background: url('/asset/image/ui/entities/entities-stone.svg') no-repeat;
    width: 144px;
    height: 144px;
    z-index: -1;
}
.hud-intro-neutral-camp {
    display: block;
    position: absolute;
    background: url('/asset/image/entity/neutral-camp/neutral-camp-base.svg') no-repeat;
    width: 144px;
    height: 144px;
    z-index: -1;
}
#background-blur {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    cursor: initial;
    z-index: 666;
    background-color: rgba(0, 0, 0, 0.3);
}
#map-chunks {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    z-index: 727;
    position: fixed;
    left: calc(50vw - 250px);
    top: calc(50vh - 250px);
    width: 500px;
    height: 500px;
    border: 2px solid white;
    /* overflow: hidden; */
}
#map-chunks::before {
    display: block;
    content: "";
    position: absolute;
    bottom: -10px;
    left: 20px;
    width: 200px;
    border-bottom: 3px dotted white;
    border-bottom-style: dashed;
}
#map-chunks::after {
    display: block;
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    width: 40px;
    height: 200px;
    border-top: 2px solid white;
    border-left: 2px solid white;
    border-top-left-radius: 4px;
    pointer-events: none;
}
.map-chunk {
    display: block;
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.05s ease-in-out;
}
.map-chunk:hover {
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.7);
}
#inspector-navigators {
    position: fixed;
    display: flex;
    left: calc(52.5vw + 250px);
    top: calc(47.5vh - 250px);
    z-index: 999;
    height: 250px;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

/* @UIQuickBuy */
.hud-center-toolbar {
    width: 30vw;
    height: 68px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.4);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    top: -20px;
    position: relative;
    overflow-x: auto;
    padding: 10px;
    display: flex;
    flex-wrap: nowrap;
    max-width: max-content;
}
.hud-center-toolbar .is-disabled {
    pointer-events: none;
    opacity: 0.4 !important;
}
.hud-center-toolbar .hud-center-toolbar-item {
    position: relative;
    flex: 0 0 auto;
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    margin: 0 4px;
    text-align: center;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
}
.hud-center-toolbar .hud-center-toolbar-item::after {
    content: ' ';
    display: block;
    width: 32px;
    height: 32px;
    margin: 8px auto;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.7;
    transition: all 0.15s ease-in-out;
}

/* @UIMisc. */
#joinWithPsk {
    display: none;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 4px 5px;
    border-radius: 8px;
    color: rgb(255, 255, 255);
    width: 30vw;
    height: 40px;
    position: fixed;
    left: 35vw;
    top: 60vh;
}
div > div > a.btn.btn-green.hud-confirmation-accept {
    background: var(--normal-btn);
}

/* @UIMenuShopStyles */
#hud-menu-shop {
    top: calc(50vh - 250px);
    left: calc(50vw - 345px);
    width: 690px;
    height: 500px;
    background: var(--menu-background);
    border: 4px solid white;
    margin: 0 0 0 0;
    padding: 20px 20px 20px 20px;
    z-index: 20;
}
.hud-menu-shop .hud-shop-grid {
    height: 360px;
}
.hud-shop-grid::after {
    font-size: 200px;
    position: absolute;
    top: -30px;
    right: -70px;
    width: 40%;
    height: 40%;
    z-index: -69;
    font-family: "Font Awesome 5 Free";
    font-weight: 10;
    content: "\\f185";
    opacity: 0.1;
    color: white;
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

/* @UIMenuPartyStyles */
#hud-menu-party {
    top: calc(50vh - 240px);
    left: calc(50vw - 305px);
    margin: 0;
    width: 610px;
    height: 480px;
    background-color: var(--menu-background);
    border: 4px solid white;
    z-index: 20;
}
.hud-party-members::after {
    font-size: 200px;
    position: absolute;
    bottom: 30px;
    left: -10px;
    width: 40%;
    height: 40%;
    z-index: -69;
    font-family: "Font Awesome 5 Free";
    font-weight: 10;
    content: "\\f185";
    opacity: 0.1;
    color: white;
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
.hud-party-grid::after {
    font-size: 200px;
    position: absolute;
    bottom: 30px;
    left: -10px;
    width: 40%;
    height: 40%;
    z-index: -69;
    font-family: "Font Awesome 5 Free";
    font-weight: 10;
    content: "\\f185";
    opacity: 0.1;
    color: white;
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

/* @UIMenuSettingsStyles */
#hud-menu-settings {
    background-color: var(--menu-background);
    border: 4px solid white;
    margin: 0px;
    top: calc(50vh - 275px);
    left: calc(50vw - 360px);
    width: 720px;
    height: 550px;
    overflow: hidden;
}
.hud-menu-settings::before {
    font-size: 200px;
    position: absolute;
    top: -90px;
    left: calc(50% - 100px);
    width: 40%;
    height: 40%;
    z-index: -69;
    font-family: "Font Awesome 5 Free";
    font-weight: 10;
    content: "\\f185";
    opacity: 0.1;
    color: white;
}
#hud-menu-settings::after {
    display: block;
    position: absolute;
    content: "";
    width: 25px;
    height: 25px;
    transform: rotate(45deg);
    margin: 10px;
    background: white;
    right: -25px;
    top: 73px;
    box-shadow: none;
}
.hud-menu-settings .hud-settings-grid {
    height: 390px;
    margin: 90px 0 0;
    overflow: hidden;
    padding: unset;
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
.hud-settings-page .coming-soon {

}
.hud-settings-options {
    display: inline-block;
    position: relative;
    width: 50%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    padding: 15px;
    overflow: auto;
}
.hud-settings-options > div {
    opacity: 0.8;
    display: block;
    position: relative;
    height: 100px;
    border-bottom: 2px dashed white;
    margin-bottom: 15px;
}
.hud-settings-options h2 {
    font-family: "Open Sans";
    margin: 5px 0 10px 0;
    font-size: 1.4em;
}
.hud-settings-options span {
    display: block;
    position: absolute;
    opacity: 0.7;
    width: 60%;
    -webkit-font-smoothing: antialiased;
}
.hud-settings-options button {
    position: absolute;
    top: calc(50% - 20px);
    right: 35px;
    height: 40px;
    width: 25%;
    background: unset;
    border: none;
    border-bottom: 3px solid white;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}
.hud-settings-options a {
    position: absolute;
    top: calc(50% - 10px);
    right: -5px;
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
.hud-settings-more {
    position: relative;
    display: inline-block;
    width: 50%;
    height: 100%;
    padding: 15px;
    overflow: auto;
}
.hud-settings-more input:not([type="checkbox"]) {
    height: 40px;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 2px dashed rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    padding: 5px;
    color: #eee;
    margin: 10px 0;
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
.hint-controls {
    position: absolute;
    display: flex;
    flex-direction: column;
    zoom: 83%;
    width: fit-content;
    height: 84px;
    top: 55px;
    left: 30px;
    overflow: scroll;
}
.hint-controls > li {
    opacity: 0.5;
    -webkit-font-smoothing: antialiased;
    margin: 0 5px 0 0;
}
#select-page {
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    top: 75px;
    right: 0px;
    background-image: linear-gradient(to left, rgba(0, 0, 0, 0.4), transparent);
    box-shadow: 10px 0 rgb(0 0 0 / 40%);
    width: 200px;
    border: 2px solid;
    border-image: linear-gradient(to right, transparent 5%, rgb(163 163 43) 35%, rgb(206 120 55) 95%);
    border-image-slice: 1;
    border-left: none;
    border-right: none;
    border-top: none;
    padding-left: 20px;
}
#page-name {
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    position: relative;
    transform: translate(0px, 9px);
}
/* @UIMenuMoreCustomStyles */
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
    width: 95%;
    height: 75%;
    margin: 0px;
    padding-right: 10px;
    overflow: scroll;
}
#base-management > h2 {
    display: inline-block;
    margin: 10px 0 10px;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
}
#base-management > hr {
    width: 87%;
    opacity: 0.4;
}
#save-config {
    position: absolute;
    top: 285px;
    right: 15px;
}
#clone-status {
    display: block;
    width: 100%;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    margin-bottom: 25px;
}
.more-seperator {
    border-bottom: 2px dashed white;
    border-top: unset;
}
`;

const styles = document.createElement("style");
styles.type = "text/css";
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);

function getClass(DOMClass) {
    return document.getElementsByClassName(DOMClass);
};

function getId(DOMId) {
    return document.getElementById(DOMId);
};

/* @Intro */
getId("hud-intro").insertAdjacentHTML("beforeend", `
    <div class="hud-intro-decoration" id="hud-intro-decoration">
        <a class="hud-intro-left-triangle"></a>
        <a class="hud-intro-right-triangle"></a>
        <a class="hud-intro-character"></a>
    </div>
    <div class="hud-intro-credits">
        <span>Sun<strong>:Raise</strong></span>
        <i class="fas fa-sun"></i>
    </div>
`);
getClass("hud-intro-corner-top-left")[0].insertAdjacentHTML("afterbegin", `
    <a class="hud-intro-stick">Scanner</a>
    <div class="hud-intro-scan-data">
        <span style="display: block;position: relative;opacity: 0.7;text-wrap: wrap;">Scanned data will be shown here once done.</span>
    </div>
`);
getClass("hud-intro-form")[0].insertAdjacentHTML("afterbegin", `
    <div style="margin: 0 10px 0 0;width: 85%;">
        <div class="hud-intro-name-container">
            <a class="hud-intro-name-decorator"><select id="saved-names"></select></a>
        </div>
        <div class="hud-intro-server-container">
            <a class="hud-intro-server-decorator"></a>
        </div>
    </div>
    <div></div>
    <img id="scan-btn" src="https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/scan.webp?v=1714879196519" onclick="window.sscs();" />
`);
getClass("hud-intro-name-container")[0].insertAdjacentElement("afterbegin", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > input"));
getClass("hud-intro-server-container")[0].insertAdjacentElement("afterbegin", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > select"));

getClass("hud-intro-play")[0].innerText = "";
document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > div:nth-child(2)").insertAdjacentElement("afterbegin", document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > button"));
document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > div:nth-child(2)").insertAdjacentHTML("beforeend", `
    <span id="playspan">Play</span>
`);

/*
getClass("hud-intro-form")[0].insertAdjacentHTML("beforeend", `
    <label>
        <input type="checkbox" class="hud-intro-session" value="false">
        <span>Use Sessions</span>
    </label>
`);
*/

const oldSubmit = game.ui.components.Intro.submitElem;
const newSubmit = oldSubmit.cloneNode(true);
oldSubmit.parentNode.replaceChild(newSubmit, oldSubmit);
game.ui.components.Intro.submitElem = newSubmit;
game.ui.components.Intro.onSubmitClick = function (_0x56b3b8) {
    const realNicknameLength = new Blob([this.nameInputElem.value]).size;
    if (realNicknameLength > 29) return void game.ui.components.Intro.onConnectionError('Your nickname length is too long. Please shorten it/use less special characters.');
    const server = this.ui.getOption(`servers`)[this.serverElem.value];
    localStorage.setItem(`name`, this.nameInputElem.value.trim());
    this.connecting || (
        this.connecting = true,
        getId("playspan").style && (getId("playspan").innerText = "    "),
        this.connectionTimer = setTimeout(function() {
            this.onConnectionError();
        }.bind(this), 15000),
        this.submitElem.innerHTML = '<span\x20class=\x22hud-loading\x22></span>',
        this.errorElem.style.display = `none`,
        this.ui.setOption(`nickname`,this.nameInputElem.value.trim()),
        this.ui.setOption(`serverId`, this.serverElem.value),
        game.network.connect(server)
    );
}
newSubmit.onclick = game.ui.components.Intro.onSubmitClick.bind(game.ui.components.Intro);

game.ui.components.Intro.onConnectionError = function (errorText) {
    errorText ||= `We were unable to connect to the gameserver. Please try another server.`;
    this.connecting = false;
    this.connectionTimer && (
        clearInterval(this.connectionTimer),
        delete this.connectionTimer
    );
    getId("playspan").style && (getId("playspan").innerText = "Play");
    this.serverElem.classList.add('has-error');
    this.errorElem.style.display = 'block';
    this.errorElem.innerText = errorText;
}

game.ui.components.Intro.checkForPartyInvitation = function () {
    if (document.location.hash && !(document.location.hash.length < 2)) {
        var subString = document.location.hash.substring(2).split('/'),
            serverId = subString[0],
            partyShareKey = subString[1];
        if (serverId) {
            this.serverElem.setAttribute(`disabled`, `true`);
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div > div > div:nth-child(1) > div.hud-intro-server-container > a").style.opacity = '0.4';
            this.serverElem.querySelector('option[value=\x22' + serverId + '\x22]').setAttribute(`selected`, 'true');
            partyShareKey && (this.partyShareKey = partyShareKey);
            /*             Game.currentGame.network.addEnterWorldHandler(function (e) {
                if (e.allowed && !this.reconnectKey) {
                    var packet = {
                        'name': `JoinPartyByShareKey`,
                        'partyShareKey': this.partyShareKey
                    };
                    Game.currentGame.network.sendRpc(packet);
                }
            }); */
        };
    }
};
game.ui.components.Intro.checkForPartyInvitation();

(function() {
    if (!localStorage.savedNames) return;
    let id = 0;
    const selectElem = getId("saved-names"),
          names = [],
          items = JSON.parse(localStorage.savedNames).map(nameUnfiltered => {
              const name = window.filterXSS(nameUnfiltered);
              names.push(nameUnfiltered);
              return `<option>${name}</option>`;
          }).join('\n');
    selectElem.innerHTML = items;
})();

getId("saved-names").addEventListener('change', (e) => { getClass("hud-intro-name")[0].value = e.target.selectedOptions[0].innerText; });

game.network.addEnterWorldHandler((e) => {
    if (!e.allowed) {
        try {
            getId("playspan").innerText = "Play";
            game.ui.components.Intro.submitElem.innerText = '';
        } catch {};
    };
    console.log(e);

    if (!game.cacheEnv.hasCached) {
        for (let uid in game.cacheEnv.cachedEntitiesByServer[game.options.serverId]) {
            const entity = toInclude(uid, game.cacheEnv.cachedEntitiesByServer[game.options.serverId][uid]);
            game.world.createEntity(entity);
        };
        game.cacheEnv.hasCached = true;
    };

    !localStorage.savedNames && (localStorage.savedNames = JSON.stringify([]));
    const willBeSaved = e.effectiveDisplayName,
          storage = JSON.parse(localStorage.savedNames);
    if (storage.find(i => i == willBeSaved) === undefined) {
        storage.push(willBeSaved);
        localStorage.savedNames = JSON.stringify(storage);
    }
});

document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

window.appSsrs = res => {
    console.log(res);
    if (res.population !== null) {
        getClass("hud-intro-server")[0].value = res.server.id;
        getClass("hud-intro-server")[0].selectedOptions[0].innerText = `${res.server.name} [${res.population}/32]`;
    }
    const leaderboard = res.leaderboard.response;
    const ssrs = getClass("hud-intro-scan-data")[0];
    ssrs.innerHTML = `
    <p>Population: ${res.population === null ? "Cannot fetch" : res.population}</p>
    <div>
    ${leaderboard.map(lb => {
        return `
        <div class="hud-intro-scan-data-player">
            <span class="player-rank">#${lb.rank + 1}</span>
            <strong class="player-name">${window.filterXSS(lb.name)}</strong>
            <span class="player-score">${counter(lb.score)}</span>
            <span class="player-wave">${counter(lb.wave)}</span>
        </div>
        `;
    }).join("\n")}
    </div>
    <hr />
    <div>
    ${res.parties.map(p => {
        return `
        <div class="hud-intro-scan-data-player">
            <span class="player-rank">${p.memberCount}</span>
            <strong class="player-name">${window.filterXSS(p.partyName)}</strong>
            <span class="player-score">${p.isOpen ? "Public" : "Private"}</span>
            <span class="player-wave">${p.partyId}</span>
        </div>
        `;
    }).join("\n")}
    </div>
    `;
};

/* @UI */
// @Chat
game.ui.components.Chat.chatResize = function() {
    this.messagesElem.style.height = (this.componentElem.offsetHeight - 40) + "px";
    this.componentElem.scrollTop = this.messagesElem.scrollHeight;
}
game.ui.components.Chat.blockedNames = [];
game.ui.components.Chat.emojiList = {
    // static emojis
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

    // animated emojis / gif
    weirdButOkay: "https://cdn.discordapp.com/emojis/831156194247966782.gif?size=48",
    pogpogpogpog: "https://cdn.discordapp.com/emojis/869580566096379974.gif?size=48",
    wooyeah: "https://cdn.discordapp.com/emojis/791008461420888084.gif?size=48",
    idk: "https://cdn.discordapp.com/emojis/882513306164805642.gif?size=48",
};
game.ui.components.Chat.blockPlayer = function(name) {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${window.filterXSS(name)}?`, 3500, () => {
        this.blockedNames.push(name);
        for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if (msg.childNodes[1].innerText === ' ' + name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "blue";
                bl.onclick = () => this.unblockPlayer(name);
            };
        };
    }, () => {});
};
game.ui.components.Chat.unblockPlayer = function(name) {
    this.blockedNames.splice(this.blockedNames.indexOf(name), 1);
    for (let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if (msg.childNodes[1].innerText === ' ' + name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => this.blockPlayer(name);
        };
    };
};
game.ui.components.Chat.onMessageReceived = function(e) {
    if (this.blockedNames.includes(e.displayName) || window.chatDisabled) return;
    let a = this,
        b = window.filterXSS(e.displayName),
        c = window.filterXSS(e.message)
    .replace(/(?:f|F)uck/gi, `<img src="https://cdn.discordapp.com/emojis/907625398832070667.png?size=80" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
    .replace(/s[3e]x+/gi, `<img src="https://cdn.discordapp.com/emojis/953759638350872666.gif?size=80&quality=lossless" height="16" width="18" style="margin: 1px 0 0 0;"></img>`)
    .replace(/n+[i1]+gg+[a@]+/i, `<img src="https://cdn.discordapp.com/emojis/902742239996936226.webp?size=80" height="16" width="17" style="margin: 1px 0 0 0;"></img>`);
    let arr = c.split(':');

    for (let i = 1; i < arr.length; i += 2) {
        if (!this.emojiList[arr[i]]) arr = [c];
        else arr[i] = `<img src="${this.emojiList[arr[i]]}" height="16" width="18" style="margin: 1px 0 0 0;"></img>`;
    }

    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" style="color: red;margin: 0 5px 0 0;display: inline-block;">Block</a><strong> ${b}</strong>: ${arr.join(" ")}<small>${getClock()}</small></div>`);
    d.children[0].onclick = () => game.ui.components.Chat.blockPlayer(b);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
}
new ResizeObserver(game.ui.components.Chat.chatResize.bind(game.ui.components.Chat)).observe(getId("hud-chat"));
Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", game.ui.components.Chat.onMessageReceived.bind(game.ui.components.Chat));

// @Zoom
getId('hud').insertAdjacentHTML('beforeend', `
<div class="interaction-wheel">
    <a class="hud-zoom-item zoom-reset" onclick="game.zoom.resetZoom();"><i class="fa fa-undo fa-lg" style="font-size: 30px;"></i></a>
    <a class="hud-zoom-item zoom-up" onclick="game.zoom.zoomOut();"><i class="fa fa-arrow-up fa-2x" style="font-size: 30px;"></i></a>
    <a class="hud-zoom-item zoom-down" onclick="game.zoom.zoomIn();"><i class="fa fa-arrow-down fa-2x" style="font-size: 30px;"></i></a>
    <a class="hud-zoom-item zoom-prop">1.0x</a>
    <a id="zoom-mode">Button</a>
    <a id="zoom-controls">
        <strong>N</strong> to zoom in <br>
        <strong>M</strong> to zoom out
    </a>
    <a id="next-wheel" onclick="game.zoom.toggleZoomOnScroll();"></a>
</div>
<input id="joinWithPsk" type="tel" placeholder="insert PSK..." class="btn">
`);
game.zoom = {
    dimension: 1,
    zoomonscroll: !!parseInt(localStorage.zoomonscroll) || false,
    upd: function() {
        getClass('zoom-prop')[0].innerText = `${this.dimension.toFixed(1)}x`;
        this.dimension = Math.max(0.1, this.dimension);

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
    },
    onWindowResize: function(e) {
        if (this.zoomonscroll && e) {
            if (e.deltaY > 0) this.dimension += 0.02;
            else if (e.deltaY < 0) this.dimension -= 0.02;
        }
        this.upd();
        game.ui.components.PlacementOverlay.onResize?.();
    },
    zoom: function(val) {
        this.dimension = val;
        this.upd();
    },
    toggleZoomOnScroll: function() {
        this.dimension -= 0.02;
        this.zoomonscroll = !this.zoomonscroll;
        localStorage.zoomonscroll = this.zoomonscroll | 0;
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
        this.dimension += 1;
        this.zoom(this.dimension);
    },
    zoomIn: function() {
        this.dimension -= 1;
        this.zoom(this.dimension);
    },
    resetZoom: function() {
        this.dimension = 1;
        this.zoom(this.dimension);
    }
};
game.zoom.onWindowResize();
window.onresize = game.zoom.onWindowResize.bind(game.zoom);
window.onwheel = game.zoom.onWindowResize.bind(game.zoom);

/* @MapViewer */
document.querySelector("#hud").insertAdjacentHTML("afterend", `
    <div id="map-display" style="display: none;">
        <a id="background-blur"></a>
        <div id="map-chunks"></div>
        <div id="inspector-navigators">
            <a style="border: solid white;border-width: 0 3px 3px 0;transform: rotate(-135deg);padding: 5px;opacity: 0.4;pointer-events: none;"></a>
            <button class="btn-diamond"
                style="background: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Arcaea%20Song%20Background.webp?v=1715415904104');background-position: top;"
                onclick="window.exitViewMapChunks();">
                    <p class="add-text">Exit</p>
            </button>
            <button class="btn-diamond"
                style="zoom: 80%;background: url('https://cdn.glitch.global/ba7f4151-2a49-416a-985b-56301606ae3d/Arcaea%20Song%20Background.webp?v=1715415904104');background-position: center;display: none;"
                onclick="window.backToView();">
                    <p class="add-text">Back</p>
            </button>
            <a style="border: solid white;border-width: 0 3px 3px 0;transform: rotate(45deg);padding: 5px;opacity: 0.4;pointer-events: none;"></a>
        </div>
    </div>
`);

document.getElementById("background-blur").addEventListener("click", e => e.stopPropagation());

const chunkSize = 2000;
const elemEnum = {
    Tree: "hud-intro-tree",
    Stone: "hud-intro-stone",
    NeutralCamp: "hud-intro-neutral-camp"
}
const entityColorEnum = {
    Tree: "green",
    Stone: "grey",
    NeutralCamp: "red"
};
const sizeEnum = {
    Tree: 192,
    Stone: 144,
    NeutralCamp: 144
}

function refreshMap() {
    document.getElementById(`hud-tooltip`)?.remove?.();
    while (document.querySelector("#map-chunks").firstChild) {
        document.querySelector("#map-chunks").removeChild(document.querySelector("#map-chunks").lastChild);
    }
}

function loadChunks() {
    const envEntities = {};
    const amountOfChunks = game.world.getHeight() / chunkSize;
    const container = document.querySelector("#map-chunks");
    const chunkSizeOnDisplay = (chunkSize / game.world.getHeight()) * 100;
    for (let chunkX = 0; chunkX < amountOfChunks; chunkX++) {
        const marginX = chunkSizeOnDisplay * chunkX;
        const offsetX = chunkSize * chunkX;
        envEntities[offsetX] ||= {};
        for (let chunkY = 0; chunkY < amountOfChunks; chunkY++) {
            const marginY = chunkSizeOnDisplay * chunkY;
            const offsetY = chunkSize * chunkY;
            envEntities[offsetX][offsetY] ||= [];
            container.insertAdjacentHTML("afterbegin", `
                <a class="map-chunk" id="chunk(${chunkX}, ${chunkY})" style="left: ${marginX}%;top: ${marginY}%;width: ${chunkSizeOnDisplay}%; height: ${chunkSizeOnDisplay}%;"></a>
            `);
            const elem = document.getElementById(`chunk(${chunkX}, ${chunkY})`);
            bindTooltip(elem, `
                <div id="hud-tooltip" class="hud-tooltip">
                    <strong>Sector ${chunkX}-${chunkY}</strong>
                    <br><span style="font-style: italic;opacity: 0.7;">X: ${offsetX}-${offsetX + chunkSize}</span>
                    <br><span style="font-style: italic;opacity: 0.7;">Y: ${offsetY}-${offsetY + chunkSize}</span>
                </div>
            `);
            elem.onclick = () => {
                refreshMap();
                document.querySelector("#inspector-navigators > button:nth-child(3)").style.display = "block";
                for (let entity of envEntities[offsetX][offsetY]) {
                    const relativeX = entity.position.x - (chunkSize * chunkX);
                    const relativeY = entity.position.y - (chunkSize * chunkY);
                    const [positionX, positionY] = [(relativeX / chunkSize) * 100, (relativeY / chunkSize) * 100];
                    const displaySize = ((sizeEnum[entity.model] / (chunkSize / 2)) * sizeEnum[entity.model] * 2) - 5;
                    container.insertAdjacentHTML("afterbegin", `
                        <a class="entity ${elemEnum[entity.model]}"
                           id="entity(${Math.round(entity.position.x)}, ${Math.round(entity.position.y)})"
                           style="display: block;position: absolute;left: calc(${positionX}% - ${displaySize / 2}px);top: calc(${positionY}% - ${displaySize / 2}px);z-index: 999;width: ${displaySize}px;height: ${displaySize}px;background-size: cover;"></a>
                    `);
                    bindTooltip(document.getElementById(`entity(${Math.round(entity.position.x)}, ${Math.round(entity.position.y)})`), `
                        <div id="hud-tooltip" class="hud-tooltip">
                            <strong>X: </strong>${Math.round(entity.position.x)}
                            <br><strong>Y: </strong>${Math.round(entity.position.y)}
                        </div>
                    `);
                }
                // 200 = grouping grid size
                for (let relativePosX = -(chunkSize % 200); relativePosX < chunkSize - (chunkSize % 200); relativePosX += 200) {
                    for (let relativePosY = -(chunkSize % 200); relativePosY < chunkSize - (chunkSize % 200); relativePosY += 200) {
                        const [positionX, positionY] = [(relativePosX / chunkSize) * 100, (relativePosY / chunkSize) * 100];
                        container.insertAdjacentHTML("afterbegin", `
                            <a class="grid" style="display: block;position: absolute;left: ${positionX}%;top: ${positionY}%;width: ${(200 / chunkSize) * 100}%; height: ${(200 / chunkSize) * 100}%;border: 1px solid rgba(255, 255, 255, 0.2);pointer-events: none;"></a>
                        `);
                    }
                }
            }
        }
    }
    for (let entity of Object.values(game.world.entities)) {
        if (["Tree", "Stone", "NeutralCamp"].indexOf(entity.fromTick.model) == -1) continue;

        const { position, model } = entity.fromTick;

        const entityDiv = document.createElement("div");
        entityDiv.classList.add("hud-map-resource");
        entityDiv.style.background = entityColorEnum[model];
        entityDiv.style.left = `${position.x / 24000 * 100}%`;
        entityDiv.style.top = `${position.y / 24000 * 100}%`;
        entityDiv.style.display = "block";
        container.appendChild(entityDiv);

        const indexX = Math.floor(position.x / chunkSize);
        const indexY = Math.floor(position.y / chunkSize);
        envEntities[indexX * chunkSize][indexY * chunkSize].push({position, model});
    }
}

window.viewMapChunks = () => {
    refreshMap();
    loadChunks();
    document.querySelector("#inspector-navigators > button:nth-child(3)").style.display = "none";
    document.getElementById("map-display").style.display = "block";
}

window.backToView = () => {
    refreshMap();
    loadChunks();
    document.querySelector("#inspector-navigators > button:nth-child(3)").style.display = "none";
}

window.exitViewMapChunks = () => {
    document.getElementById("map-display").style.display = "none";
}

/* @Party */
game.ui.components.MenuParty.loaded = false;
game.ui.components.MenuParty.serverPopulation = 0;
game.ui.components.MenuParty.closedParties = null;
game.ui.components.MenuParty.shareKeyLog = null;
game.ui.components.MenuParty.partyMenu = getClass("hud-menu-party")[0];
game.ui.components.MenuParty.partyTabs = getClass("hud-party-tabs")[0];
game.ui.components.MenuParty.partyMembers = getClass("hud-party-members")[0];
game.ui.components.MenuParty.partyGrid = getClass("hud-party-grid")[0];
game.ui.components.MenuParty.init = function() {
    if (this.loaded) return;
    this.loaded = true;

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
    })
}
game.ui.components.MenuParty.onSetPartyList = function(parties) {
    this.serverPopulation = 0;
    for (let party of parties) this.serverPopulation += party.memberCount;
    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${this.serverPopulation}/32<small id="serverRegion"></small>`;
}
game.ui.components.MenuParty.onPartyShareKey = function(e) {
    const psk = e.partyShareKey,
          lnk = `https://zombs.io/#/${game.options.serverId}/${psk}/`;
    this.shareKeyLog.innerHTML += `
        <div style="display:inline-block;margin:10px 5px 0;">
            <li>
                <strong style="cursor: pointer;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: '${psk}' });">${psk}</strong> - <a href="${lnk}" target="_blank" color="purple">[Link]</a>
            </li>
        </div>
        <br />
    `;
}
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
        var partyNameSanitized = window.filterXSS(partyData.partyName);
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
        partyElem.innerHTML = "<strong>" + partyNameSanitized + "</strong><small>id: " + partyData.partyId + "</small> <span>" + partyData.memberCount + "/" + this.maxPartySize + "</span>";
        this.clonedPartyElems[partyId].innerHTML = "<strong>" + partyNameSanitized + "</strong><small>id: " + partyData.partyId + "</small> <span>" + partyData.memberCount + "/" + this.maxPartySize + "</span>";
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
        var playerName = window.filterXSS(playerPartyMembers[i].displayName);
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
}
getClass("hud-party-actions")[0].insertAdjacentHTML("afterend", `
<div class="partydiv" style="text-align: center">
  <button class="btn btn-red" style="width: 275.5px;margin: 10px 0 0 3px;box-shadow: none;" onclick="Game.currentGame.network.sendRpc({name: 'LeaveParty'});">Leave</button>
</div>`);
game.ui.components.MenuParty.init();
game.network.addRpcHandler("PartyShareKey", (e) => game.ui.components.MenuParty.onPartyShareKey(e));
game.network.addRpcHandler("SetPartyList", (e) => game.ui.components.MenuParty.onSetPartyList(e));

/* @Settings
   @ModMenu */

getId('hud-menu-settings').innerHTML = `
    <a class="hud-menu-close" onclick="document.getElementById('hud-menu-settings').style.display = 'none';"></a>
    <h3>Advanced</h3>
    <div id="select-page">
        <button id="back-page" class="no-bg"><i class="fas fa-arrow-left"></i></button>
        <span id="page-name">-</span>
        <button id="forward-page" class="no-bg"><i class="fas fa-arrow-right"></i></button>
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

    1: `<li><strong>C</strong> toggles quick join via PSK input.</li>
        <li><strong>G</strong> toggles zoom menu.</li>
        <li><strong>Dash</strong> [-] toggles local info indicators.</li>
        <li><strong>Equal</strong> [=] toggles Auto Bow.</li>
        <li><strong>Semi-colon</strong> [;] deletes your pet.</li>
        <li><strong>Back-tick</strong> ['] revives your pet.</li>`, // anti tiến bịp,
    2: ``,

    3: ``,

    4: `<li><strong>?</strong> toggles Screenshot Mode.</li>
        <li><strong>~</strong> marks your position.</li>
        <li><strong>+</strong> toggles Map Inspector.</li>`
};

const pageName_enum = {
    0: 'Build',
    1: 'Player',
    2: 'Visual',
    3: 'Clone',
    4: 'Misc.',
};

/* const optionElem_enum = {
    name: 'h2',
    description: 'span',
} */

const menu = {
    page0: {
        AHRC: {
            name: `AHRC`,
            description: `Automatically harvests resources.`,
            more: null
        },
        rebuild: {
            name: `Auto Rebuilder`,
            description: `Automatically rebuilds dead towers.`,
            more: null,
            onCallback: () => { game.rebuilder.saveTowers(); },
            offCallback: () => { game.rebuilder.reset(); },
        },
        autoUpgrade: {
            name: `Auto Upgrader`,
            description: `Automatically upgrades towers.`,
            more: null
        },
        wallBlock: {
            name: `Wall Block`,
            description: `Allows you to place mulitple walls at once.`,
            more: {
                html: `
                    <strong>Change the size of the block that will be placed.</strong>
                    <span>Default value is 5x5, maximum is 15x15 (cells).</span>
                    <div style="display: flex;align-items: center;justify-content: space-between;">
                        Width: <input id="blockX" type="number" placeholder="w" min="3" max="15" value="3" class="btn" style="width: 20%">
                        Height: <input id="blockY" type="number" placeholder="h" min="3" max="15" value="3" class="btn" style="width: 20%">
                    </div>
                `,
                functions: () => {},
            },
        },
        baseSaver: {
            name: "Base Saver",
            description: `Manage all your saved bases here.`,
            more: {
                html: `
                    <div id="base-container"></div>
                    <div id="base-management" style="display: none;">
                        <br><a href="javascript:void(0);" id="return-to-manager" style="color: var(--light-hover-btn);"><i class="fa fa-angle-left"></i> Go back to base manager</a>
                        <br><h2>Design</h2><hr />
                        <input id="target-base-design" type="tel" placeholder="Base string" class="btn">
                        <button id="clear-target-design" class="no-bg underline-red" style="width: calc(50% - 5px);" onclick="document.getElementById('target-base-design').value = '';">Clear</button>
                        <button id="view-target-design" class="no-bg underline-white" style="width: calc(50% - 5px);margin: 0 0 5px 5px;">View</button>
                        <button id="encode-target-design" class="btn-important" style="width: calc(50% - 5px);">Encode</button>
                        <button id="build-design" class="btn-important" style="width: calc(50% - 5px);margin: 0 0 5px 5px;">Build</button>
                        <br></br>
                        <h2>Info</h2><hr />
                        <input id="target-base-name" type="tel" placeholder="Base name" class="btn" maxlength="20">
                        <input id="target-base-description" type="tel" placeholder="Base description" class="btn" maxlength="40">
                        <button id="save-config" class="btn-important" onclick="window.saveCurrentBaseConfig();">Save</button>
                        <br></br>
                        <h2>Help</h2><hr />
                        <span>Get your current base's encoded string by pressing "Encode". Press "Clear" to delete the current string.</span>
                        <span>Press "Build" to build from the design. Press "View" to have a preview of the saved base.</span>
                        <span>Press "Save" to save all changes. (any changes will NOT save when you leave the menu without pressing this button.</span>
                    </div>
                `,
                functions: () => {
                    localStorage.totalSlots ||= 2;
                    getId("return-to-manager").onclick = () => document.querySelector("#more-baseSaver").click();
                    window.createBaseSlot = function() {
                        const oldTotalSlots = parseInt(localStorage.totalSlots);
                        const nextItem = oldTotalSlots + 1;
                        localStorage.totalSlots = nextItem;
                        localStorage[`baseslot${nextItem}`] = '|||';
                        document.querySelector("#more-baseSaver").click();
                    };

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
                    }

                    window.isSlotEmpty = function(index) {
                        const baseData = localStorage[`baseslot${index}`]?.split("|");
                        return !!baseData?.[0];
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

                    for (let i = 1; i < parseInt(localStorage.totalSlots) + 1; i++) {
                        const baseItem = document.createElement('div');
                        const baseData = localStorage[`baseslot${i}`]?.split("|");
                        const baseId = genUUID();

                        baseData?.[1] && (baseData[1] = window.filterXSS(baseData[1]));
                        baseData?.[2] && (baseData[2] = window.filterXSS(baseData[2]));

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
                            const [designField, titleField, descriptionField] = [...document.querySelectorAll("#target-base-design, #target-base-name, #target-base-description")];
                            designField.value = baseData?.[0] || "";
                            titleField.value = baseData?.[1] || "";
                            descriptionField.value = baseData?.[2] || "";

                            getId("encode-target-design").onclick = game.builder.recordBase.bind(game.builder);
                            getId("view-target-design").onclick = () => game.ui.components.PlacementOverlay.showOverlay(designField.value, 10000);

                            baseManagement.setAttribute('current-item', i);
                            for (let otherItem = 1; otherItem < parseInt(localStorage.totalSlots) + 1; otherItem++) {
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
                                    game.builder.buildBase(designField.value);
                                });
                            }
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
        chatSpam: {
            name: `Chat Spammer`,
            description: `Annoys other players with messages.`,
            more: {
                html: `
                    <strong>Input the text that you want to spam.</strong>
                    <span>If no text is inputted, random messages with be sent.</span>
                    <input id="chat-spam-input" placeholder="Spam text here..." />
                `,
                functions: () => {
                    const spamInputElem = getId("chat-spam-input");
                    spamInputElem.oninput = game.spam.onchange.bind(game.spam);
                }
            },
            onCallback: () => { game.spam.start(); },
            offCallback: () => { game.spam.stop(); },
        },
        autoAim: {
            name: `Auto Aim`,
            description: "Aims at the nearest player.",
            more: null
        },
        autoHeal: {
            name: "Auto Heal",
            description: "Heals your player/pet automatically.",
            more: {
                html: `
                    <strong>Define the health percentage that the auto heal will kick in if below it.</strong>
                    <span>Default value is 25%.</span>
                    <input id="auto-heal-threshold" type="number" placeholder="Enter a valid percentile here..." min="1" max="100" value="25" />
                `,
                functions: () => {},
            }
        },
        frss: {
            name: "Exact Resource Counter",
            description: `"De-truncate" your resource counter.`,
            more: null,
        },
    },
    page2: {
        ground: {
            name: "Render Ground",
            description: "Toggles rendering of the ground.",
            more: null,
            onCallback: () => { game.renderer.ground.setVisible(true); },
            offCallback: () => { game.renderer.ground.setVisible(false); },
        },
        npcs: {
            name: "Render NPCs",
            description: "Toggles rendering of NPCs.",
            more: null,
            onCallback: () => { game.renderer.npcs.setVisible(true); },
            offCallback: () => { game.renderer.npcs.setVisible(false); },
        },
        projectiles: {
            name: "Render Projectiles",
            description: "Toggles rendering of projectiles.",
            more: null,
            onCallback: () => { game.renderer.projectiles.setVisible(true); },
            offCallback: () => { game.renderer.projectiles.setVisible(false); },
        },
        scenery: {
            name: "Render Environment",
            description: "Toggles rendering of the environment.",
            more: null,
            onCallback: () => { game.renderer.scenery.setVisible(true); },
            offCallback: () => { game.renderer.scenery.setVisible(false); },
        },
        groupingGrid: {
            name: "Grouping Grid",
            description: "<strong>Warning</strong>: conflicts with ground rendering.",
            more: null,
            onCallback: () => {
                game.renderer.ground.attachments[0].attachments[1].setAlpha(0.625);
                game.renderer.ground.attachments[0].attachments[1].setScale(200 / 48);
                game.renderer.ground.attachments[0].attachments[1].sprite.width /= 200 / 48;
                game.renderer.ground.attachments[0].attachments[1].sprite.height /= 200 / 48;
            },
            offCallback: () => {
                game.renderer.ground.attachments[0].attachments[1].setAlpha(1);
                game.renderer.ground.attachments[0].attachments[1].setScale(1);
                game.renderer.ground.attachments[0].attachments[1].sprite.width *= 200 / 48;
                game.renderer.ground.attachments[0].attachments[1].sprite.height *= 200 / 48;
            },
        },
        entityCache: {
            name: "Entity Caching",
            description: "Caches previously seen entities.",
            more: {
                html: `
                    <strong>By default, entities is automatically cached.</strong>
                    <span>(you cannot disable caching, yet.)</span>
                    <br>
                    <strong>You can reset the current server's cached entities with the button below.</strong>
                    <button id="reset-cached" class="btn-important" style="width: -webkit-fill-available;margin-top: 20px;">Reset</button>
                `,
                functions: () => {
                    getId("reset-cached").onclick = () => {
                        game.cacheEnv.cachedEntitiesByServer[game.network.connectionOptions.id] = {};
                        localStorage.cachedEntitiesByServer = JSON.stringify(this.cachedEntitiesByServer);
                        Game.currentGame.world.refreshEntity();
                    };
                },
            },
        },
    },
    page3: {
        cloneSockets: {
            name: "Clones",
            description: "Otherwise known as sockets, alts, etc.",
            more: {
                html: `
                    <h2 style="display: inline-block;margin-top: 10px;">Status</h2>
                    <button id="toggle-status" class="no-bg" style="margin-left: -10px;height: 30px;"><i class="fa-solid fa-chevron-down"></i></button>
                    <div id="clone-status" style="display: none;"><span>Nothing here yet...</span></div>

                    <hr class="more-seperator" />

                    <h2>Menu</h2>
                    <label>
                        <input type="checkbox" id="control-clones" checked="true">
                        <span>Control clones</span>
                    </label>
                `,
                functions: () => {
                    getId("toggle-status").onclick = () => {
                        const cloneStatus = getId("clone-status");
                        getId("toggle-status").innerHTML = cloneStatus.style.display === "none" ? `<i class="fa-solid fa-chevron-up"></i>` : `<i class="fa-solid fa-chevron-down"></i>`;
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
                },
            },
            isToggle: false,
            customButtonText: "Send",
            callback: () => {
                game.clones.createSocket();
            },
        },
        aito: {
            name: "Auto Timeout (AITO)",
            description: "Sends a socket to auto-use timeout.",
            more: null,
            onCallback: () => {
                window.sendAitoAlt();
            },
        },
    },
    page4: {
        autoUpTowers: {
            name: "Building Support",
            description: "Auto-upgrades low-health towers.",
            more: {
                html: `
                    <strong>Define the health percentage to upgrade buildings when their health is below it.</strong>
                    <span>Default value is 20%.</span>
                    <input id="auto-tower-upgrade-threshold" type="number" placeholder="Enter a valid percentile here..." min="1" max="99" value="20" />
                `,
                functions: () => {},
            }
        }
    },
};

function refreshMore(page) {
    const container = document.querySelector("#" + page + " > div.hud-settings-more");
    for (let children of container.children) {
        children.style.display = "none";
    }
}

function refreshPage(pageState, page) {
    for (let i = 0; i < 5; i++) getId(`page${i}`).style.display = "none";
};

function setPage(page) {
    const pageState = page;
    switch(page) {
        case "forward":
            page = parseInt(getClass('hud-settings-grid')[0].getAttribute('page')) + 1;
            break;
        case "backwards":
            page = parseInt(getClass('hud-settings-grid')[0].getAttribute('page')) - 1;
            break;
    }
    refreshPage(pageState, page);
    if (page < 0) page = 4;
    if (page > 4) page = 0;
    getId(`page${page}`).style.display = "flex";
    getId('page-name').innerText = pageName_enum[page];
    getClass('hint-controls')[0].innerHTML = hint_enum[page];
    getClass('hud-settings-grid')[0].setAttribute('page', page);
};
setPage('0');
getId('back-page').addEventListener('click', () => setPage("backwards"));
getId('forward-page').addEventListener('click', () => setPage("forward"));

// @Misc.
game.world._createEntity = game.world.createEntity;
game.world.createEntity = function(t) {
    this._createEntity(t);
    if (["Tree", "Stone", "NeutralCamp"].indexOf(t.model) > -1) {
        const { shouldCache } = game.cacheEnv;
        const { serverId } = game.options;
        shouldCache && (
            game.cacheEnv.cachedEntitiesByServer[serverId] ||= {},
            game.cacheEnv.cachedEntitiesByServer[serverId][t.uid] = t.position
        );
    };
};
Game.currentGame.world.refreshEntity = function() {
    for (let t in this.entities) {
        if (t in this.replicator.currentTick.entities) continue;
        this.renderer.remove(this.entities[t]);
        delete this.entities[t];
        this.entityGrid.removeEntity(parseInt(t));
    }
}
Game.currentGame.world.removeEntity = function(t) {
    if (["Tree", "Stone", "NeutralCamp"].indexOf(this.entities[t].fromTick.model) > -1) return;
    this.renderer.remove(this.entities[t]);
    const model = this.entities[t].currentModel;
    if (Game.currentGame.getModelEntityPooling(model.modelName)) {
        model.reset();
        this.modelEntityPool[model.modelName].push(model);
    }
    this.entityGrid.removeEntity(parseInt(t));
    delete this.entities[t];
};

const toolbar_enum = {
    "Pickaxe": { index: 0, hasNextTier: true },
    "Spear": { index: 1, hasNextTier: true },
    "Bow": { index: 2, hasNextTier: true },
    "Bomb": { index: 3, hasNextTier: true },
    "HealthPotion": { index: 4, hasNextTier: false },
    "PetHealthPotion": { index: 5, hasNextTier: false },
};
getClass('hud-top-center')[0].insertAdjacentHTML('afterbegin', `
    <div class="hud-center-toolbar">
        ${Object.keys(toolbar_enum).map(itemName => {
    return `<a class="hud-center-toolbar-item" data-item="${itemName}" data-tier="1"></a>`;
}).join("\n")}
    </div>
`);
[...document.querySelector("#hud > div.hud-top-center > div").children].forEach(elem => {
    elem.onclick = () => {
        const itemName = elem.getAttribute("data-item");
        const itemTier = elem.getAttribute("data-tier");
        game.network.sendRpc({name: "BuyItem", itemName, tier: parseInt(itemTier)});
    };
});

game.network.addRpcHandler("SetItem", ({itemName, tier}) => {
    if (Object.keys(toolbar_enum).indexOf(itemName) > -1) {
        const { index, hasNextTier } = toolbar_enum[itemName];
        if (!hasNextTier) return;
        document.querySelector("#hud > div.hud-top-center > div").children[index].classList[tier == 8 ? "add" : "remove"]("is-disabled");
        document.querySelector("#hud > div.hud-top-center > div").children[index].setAttribute("data-tier", tier + 1);
    };
});

/* @EntitySaver */
const notIncluded = {yaw:0,health:100,maxHealth:100,damage:10,height:32,width:32,collisionRadius:70,entityClass:"Prop",dead:0,timeDead:0,slowed:0,stunned:0,hits:[],interpolatedYaw:0};
const detectModelByUid = (uid) => {
    if (0 < uid && uid <= 400) return "Tree";
    if (400 < uid && uid <= 800) return "Stone";
    if (800 < uid && uid <= 825) return "NeutralCamp";
    throw new RangeError("Unsupported UID");
}
const toInclude = (uid, position) => {
    const entity = {model: detectModelByUid(uid), position, uid};
    for (let i in notIncluded) entity[i] = notIncluded[i];
    return entity;
}
localStorage.cachedEntitiesByServer ||= JSON.stringify({});
game.cacheEnv = {
    shouldCache: true,
    hasCached: false,
    cachedEntitiesByServer: JSON.parse(localStorage.cachedEntitiesByServer),
    /* onchange: function({target}) {
        this.shouldCache = target.checked;
    }, */
    onbeforeunload: function() {
        if (!this.shouldCache || !game.world.inWorld) return;
        localStorage.cachedEntitiesByServer = JSON.stringify(this.cachedEntitiesByServer);
    },
};

addEventListener("beforeunload", game.cacheEnv.onbeforeunload.bind(game.cacheEnv));

/* @ScoreLogger */
function chatResize() {
    getClass("hud-chat-messages")[0].style.height = (getId("hud-chat").offsetHeight - 40) + "px";
    getClass("hud-spw")[0].style.height = (getId("hud-chat").offsetHeight - 40) + "px";

    getClass("hud-chat-messages")[0].scrollTop = getClass("hud-chat-messages")[0].scrollHeight;
    getClass("hud-spw")[0].scrollTop = getClass("hud-spw")[0].scrollHeight;
}
new ResizeObserver(chatResize).observe(getId("hud-chat"));
document.querySelector("#hud-chat").insertAdjacentHTML('beforeend', `
<div class="hud-spw" num-of-children="0" num-of-removed-children="0">
    <div id="avg-spw"><strong>Last 10 waves average</strong>: 0 score</div>
</div>
`);
document.querySelector("#hud-chat").insertAdjacentHTML('afterend', `
<div class="chat-tool">
    <a class="hud-chat-link-tab is-active" id="chat-tool-chat" onclick="game.ui.components.Chat.toggleChat();" style="width: 16%;border-radius: 0 0 0 3px;">Chat</a>
    <a class="hud-chat-link-tab" id="chat-tool-spw" onclick="game.ui.components.Chat.toggleSpw();" style="width: 16%;">Score</a>
</div>
`);
game.ui.components.Chat.toolElem = getClass("chat-tool")[0];
game.ui.components.Chat.spwElem = getClass("hud-spw")[0];
game.ui.components.Chat.chatToolElem = getId("chat-tool-chat");
game.ui.components.Chat.spwToolElem = getId("chat-tool-spw");
game.ui.components.Chat.toggleChat = function() {
    this.spwToolElem.classList.remove("is-active");
    this.chatToolElem.classList.add("is-active");

    this.messagesElem.style.display = "block";
    this.spwElem.style.display = "none";

    this.messageInputElem.removeAttribute("readonly", '');
    setTimeout(this.startTyping.bind(this), 200);
}
game.ui.components.Chat.toggleSpw = function() {
    this.chatToolElem.classList.remove("is-active");
    this.spwToolElem.classList.add("is-active");

    this.messagesElem.style.display = "none";
    this.spwElem.style.display = "block";

    this.messageInputElem.setAttribute("readonly", '');
    setTimeout(this.startTyping.bind(this), 200);
}
game.ui.components.Chat.addScoreLog = function({wave, score}) {
    const children = [...this.spwElem.children];
    const spwElem = document.createElement('div');
    let numOfChildren = parseInt(this.spwElem.getAttribute('num-of-children'));
    let numOfRemovedChildren = parseInt(this.spwElem.getAttribute('num-of-removed-children'));

    spwElem.innerHTML = `<strong>Wave ${wave}</strong>: ${score.toLocaleString()} score (+${((score / game.ui.playerTick.score) * 100).toFixed(2)}%)<small>${getClock()}</small>`;
    spwElem.classList.add("hud-log");

    this.spwElem.appendChild(spwElem);
    this.spwElem.setAttribute('num-of-children', `${++numOfChildren}`);

    if (children.length > 501) {
        children[1].remove();
        this.spwElem.setAttribute('num-of-removed-children', `${++numOfRemovedChildren}`);
    }

    this.lastTenScores.push(score);
    if (this.lastTenScores.length > 10) this.lastTenScores.shift();
    getId("avg-spw").innerHTML = `<strong>Last 10 waves average</strong>: ${Math.round(arrAvg(this.lastTenScores)).toLocaleString()} score`;
}
game.ui.components.Chat.lastTenScores = [];

game.ui.components.Chat.startTyping = function() {
    this.componentElem.classList.add(`is-focused`);
    this.toolElem.classList.add(`is-focused`);
    this.messageInputElem.focus();
};
game.ui.components.Chat.cancelTyping = function() {
    setTimeout(() => {
        this.componentElem.classList.remove('is-focused');
        this.toolElem.classList.remove(`is-focused`);
        this.messageInputElem.blur();
    }, 100);
};

/* @Functions */
// @Options
game.options.options = {
    autoBow: false,
    getRSS: false,
    AHRC: false,
    rebuild: false,
    autoUpgrade: false,
    heal: true,
    revive: true,
    frss: false,
    chatSpam: false,
    autoAim: false,
    wallBlock: false,
    autoHeal: true,

    ground: true,
    npcs: true,
    projectiles: true,
    scenery: true,
    groupingGrid: false,

    aito: false,

    autoUpTowers: false,
}

// @Marker
game.markers = {
    currentIndex: 0,
    allMarkers: [],
    placeMarker: function({x, y, id, timeout, shouldIndicateIndex}) {
        id ||= Math.random();
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
        getId("hud-map").insertAdjacentElement("beforeend", markerElem);

        this.allMarkers.push({x, y});
        timeout && setTimeout(getId(`${id}`).remove, 240000);
    }
}

// @RSSOverhead
game.rssOverhead = {
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
    onTick: function(entities) {
        const options = game.options.options;
        if (options.getRSS) !this.allowedRSS && (this.allowedRSS = true);
        if (options.getRSS || this.allowedRSS) {
            for (let uid in entities) {
                const player = game.world.entities[uid];
                if (!!player?.fromTick?.name) {
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
  ${window.filterXSS(player.targetTick.oldName)}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
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
  ${window.filterXSS(player.targetTick.oldName)}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
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
}

// @AHRC
game.ahrc = {
    checkedHarvesters: new Set(),
    workingHarvesters: new Set(),
    onTick: function() {
        const options = game.options.options;
        if (options.AHRC) {
            for (let uid in game.world.entities) {
                const entity = game.world.entities[uid];
                if (entity.targetTick.model == "Harvester" && entity.targetTick.partyId == game.ui.playerPartyId && game.ui.playerTick.gold > 0.69) {
                    if (this.checkedHarvesters.has(uid)) {
                        if (entity.fromTick.stone !== entity.targetTick.stone || entity.fromTick.wood !== entity.targetTick.wood) {
                            this.workingHarvesters.add(uid);
                        };
                    } else {
                        this.checkedHarvesters.add(uid);
                        game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: 0.69});
                    };
                };
                if (this.workingHarvesters.has(uid)) {
                    const amount = entity.fromTick.tier * 0.05 - 0.02;
                    game.network.sendRpc({name: "AddDepositToHarvester", uid: parseInt(uid), deposit: amount});
                    game.network.sendRpc({name: "CollectHarvester", uid: parseInt(uid)});
                };
            };
        }
    }
}

// @Rebuilder
game.rebuilder = {
    savedTowers: new Map(),
    shouldBeReplaced: [],
    goldStash: null,
    reset: function() {
        this.savedTowers = new Map();
    },
    saveTowers: function() {
        for (let i in game.ui.buildings) {
            const {x, y, type} = game.ui.buildings[i];
            this.savedTowers.set(parseInt(i), {x, y, type});
        }
    },
    onLocalBuilding: function(buildings) {
        const options = game.options.options;
        const allBuildings = Object.values(game.ui.buildings);
        this.goldStash = allBuildings.find(building => building.type == "GoldStash");
        if (options.rebuild) {
            for (let i in buildings) {
                const {dead, uid, x, y, type, tier} = buildings[i];
                if (dead === 1) {
                    if (this.savedTowers.get(uid) !== undefined) {
                        this.shouldBeReplaced.push({x, y, type});
                    }
                } else {
                    const oldBuilding = getByValue(this.savedTowers, {x, y, type});
                    if (oldBuilding) {
                        this.savedTowers.set(parseInt(uid), {x, y, type});
                        this.shouldBeReplaced = this.shouldBeReplaced.filter(e => !equal(e, {x, y, type}));
                    }
                }
            }
        }
    },
    onTick: function(entities) {
        const options = game.options.options;
        if (options.rebuild && this.goldStash) {
            for (let i = this.shouldBeReplaced.length - 1; i >= 0; i--) {
                const deadTower = this.shouldBeReplaced[i];
                const {x, y, type} = deadTower;
                game.network.sendRpc({name: "MakeBuilding", type, x, y, yaw: 0});
            }
        }
    },
};

// @Builder
game.builder = {
    towerCodes: ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"],

    buildBase: function(design) {
        const goldStash = game.rebuilder.goldStash;

        if (typeof design !== "string") throw new Error("Argument must be given as a string.");
        if (goldStash === undefined) throw new Error("You must have a gold stash to be able to use this.");

        const towers = design.split(";");

        for (let towerStr of towers) {
            const tower = towerStr.split(",");

            if (tower[0] === "") continue;
            if (tower.length < 4) throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be replicated.`);

            Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                type: this.towerCodes[parseInt(tower[0])],
                x: goldStash.x - parseInt(tower[1]),
                y: goldStash.y - parseInt(tower[2]),
                yaw: parseInt(tower[3])
            });
        };
    },

    recordBase: function() {
        const goldStash = game.rebuilder.goldStash;
        let baseStr = "";
        for (let i in game.ui.buildings) {
            const building = game.ui.buildings[i];
            if (this.towerCodes.indexOf(building.type) < 0) continue;

            let yaw = 0;

            if (["Harvester", "MeleeTower"].includes(building.type)) {
                if (game.world.entities[building.uid] !== undefined) yaw = game.world.entities[building.uid].targetTick.yaw;
            }
            baseStr += `${this.towerCodes.indexOf(building.type)},${goldStash.x - building.x},${goldStash.y - building.y},${yaw};`;
        }
        getId('target-base-design').value = baseStr;
    }
};

// @AutoAim
game.autoAim = {
    targets: [],
    onTick: function() {
        const options = game.options.options;
        if (options.autoAim) {
            this.targets = [];
            const entities = Object.values(game.world.entities);

            for (let entity of entities) {
                if (entity.fromTick.model == "GamePlayer" && entity.targetTick.partyId !== game.ui.playerPartyId && entity.fromTick.dead == 0) {
                    this.targets.push(entity.fromTick);
                };
            };

            if (this.targets.length > 0) {
                const myPos = game.ui.playerTick.position;
                this.targets.sort((a, b) => {
                    return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
                });

                const target = this.targets[0];
                let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);
                game.inputPacketCreator.lastAnyYaw = reversedAim;
                game.network.sendPacket(3, {mouseMoved: reversedAim});
            }
        };
    }
};

// @AutoUpTowers
game.autoUpTowers = {
    previouslyUpgraded: {},
    onTick: function({entities}) {
        const options = game.options.options;
        if (options.autoUpTowers) {
            for (let uid in entities) {
                const currentEntity = entities[uid];
                const worldEntity = game.world.entities[uid];

                if (currentEntity == true || worldEntity == undefined) continue;
                if (uid in this.previouslyUpgraded && worldEntity.targetTick.tier == this.previouslyUpgraded[uid]) continue;

                if (uid in game.ui.buildings && typeof currentEntity.health == 'number') {
                    const buildingHealth = (currentEntity.health / worldEntity.targetTick.maxHealth) * 100;
                    const threshold = getId("auto-tower-upgrade-threshold").valueAsNumber;
                    if (buildingHealth <= threshold && worldEntity.targetTick.tier != game.ui.components.BuildingOverlay.getGoldStashTier()) {
                        game.network.sendRpc({name: "UpgradeBuilding", uid: parseInt(uid)});
                        this.previouslyUpgraded[uid] = structuredClone(worldEntity.targetTick.tier);
                    };
                };
            };
        };
    },
};

// @Buildings
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
            _0x17c50d = {
                'x': 0,
                'y': 0
            };
        for (var cell in cells) {
            if (cells[cell]) {
                var cellCoord = world.entityGrid.getCellCoords(cells[cell]),
                    _0x3206b9 = {
                        'x': cellCoord.x * cellSize + cellSize / 2,
                        'y': cellCoord.y * cellSize + cellSize / 2
                    },
                    _0x4ae73f = Game.currentGame.renderer.worldToUi(_0x3206b9.x, _0x3206b9.y),
                    _0x27e53e = this.checkIsOccupied(cells[cell], cellCoord);
                this.placeholderTints[cell].setPosition(_0x4ae73f.x, _0x4ae73f.y);
                this.placeholderTints[cell].setIsOccupied(_0x27e53e);
                this.placeholderTints[cell].setVisible(true);
                _0x17c50d.x += cellCoord.x;
                _0x17c50d.y += cellCoord.y;
            } else this.placeholderTints[cell].setVisible(false);
        };
        _0x17c50d.x = _0x17c50d.x / cells.length;
        _0x17c50d.y = _0x17c50d.y / cells.length;
        var worldPos = {
            'x': _0x17c50d.x * cellSize + cellSize / 2,
            'y': _0x17c50d.y * cellSize + cellSize / 2
        },
            uiPos = Game.currentGame.renderer.worldToUi(worldPos.x, worldPos.y);
        if (!this.rangeIndicator) {
            var { maxStashDistance } = game.ui.components.BuildingOverlay;
            if ('GoldStash' == this.buildingId) {
                this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
                    'width': maxStashDistance * cellSize * 2,
                    'height': maxStashDistance * cellSize * 2
                });
                Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
            } else if (building.rangeTiers) {
                this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
                    'isCircular': true,
                    'radius': building.rangeTiers[0] * 0.57071
                });
                Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
            };
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
    }
}
game.ui.components.PlacementOverlay.showOverlay = function (design, timeout) {
    this.buildingId && this.cancelPlacing();
    const goldStash = game.rebuilder.goldStash;

    if (typeof design !== "string") throw new Error("Argument must be given as a string.");
    if (goldStash === null) throw new Error("You must have a gold stash to be able to use this.");

    this.overlayEntities && (this.overlayEntities.length > 0 && this.overlayEntities.map(e => game.renderer.ui.removeAttachment(e)));
    this.overlayEntities = [];
    this.overlayDesign = design;
    this.isShowingOverlay = true;
    game.renderer.follow(game.world.entities[goldStash.uid]);
    setTimeout(() => {
        const towers = design.split(";"),
              schema = this.ui.getBuildingSchema();

        for (let towerStr of towers) {
            const towerData = towerStr.split(",");
            const [type, xWorld, yWorld, yaw] = towerData;
            const towerLength = towerData.length

            if (type === "") continue;
            if (towerLength.length < 4) throw new Error(`${JSON.stringify(towerLength)} contains an issue that must be fixed before this design can be replicated.`);

            const buildingType = schema[game.builder.towerCodes[parseInt(type)]],
                  placeholderEntity = Game.currentGame.assetManager.loadModel(buildingType.modelName, {}),
                  { x, y } = game.renderer.worldToUi(goldStash.x - parseInt(xWorld), goldStash.y - parseInt(yWorld));
            placeholderEntity.setAlpha(0.5);
            placeholderEntity.setRotation(parseInt(yaw));
            placeholderEntity.setPosition(x, y);

            Game.currentGame.renderer.ui.addAttachment(placeholderEntity);
            this.overlayEntities.push(placeholderEntity);
        }
        timeout && setTimeout(game.ui.components.PlacementOverlay.hideOverlay.bind(this), timeout);
    }, 50);
};

game.ui.components.PlacementOverlay.hideOverlay = function() {
    for (let entity of this.overlayEntities) game.renderer.ui.removeAttachment(entity);
    game.renderer.follow(game.world.entities[game.world.myUid]);
    this.isShowingOverlay = false;
    this.overlayDesign = null;
}

game.ui.components.PlacementOverlay.onResize = function() {
    this.isShowingOverlay && game.ui.components.PlacementOverlay.showOverlay(this.overlayDesign);
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

game.ui.components.BuildingOverlay.sellBuilding = function () {
    if (this.buildingUid) {
        if ('GoldStash' == this.buildingId) {
            game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to delete all buildings?`, 5000, function() {
                sellAll();
            });
            return this.stopWatching();
        }
        if (this.shouldUpgradeAll) {
            const id = this.buildingId;
            game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to delete all buildings of this type?`, 5000, function() {
                sellAllByType(id);
            });
        } else Game.currentGame.network.sendRpc({name: 'DeleteBuilding', uid: this.buildingUid});
    }
}

game.ui.components.BuildingOverlay.startWatching = function(buildingId) {
    this.buildingUid && this.stopWatching();
    let buildings = this.ui.getBuildings(),
        building = buildings[buildingId];
    if (!building) return;
    this.buildingUid = buildingId;
    this.buildingId = building.type;
    this.buildingTier = building.tier;
    let schema = this.ui.getBuildingSchema(),
        buildingSchema = schema[this.buildingId];
    if ('GoldStash' == this.buildingId) {
        var world = Game.currentGame.world,
            cellSize = world.entityGrid.getCellSize();
        this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
            'width': this.maxStashDistance * cellSize * 2,
            'height': this.maxStashDistance * cellSize * 2
        });
        Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator);
    } else {
        buildingSchema.rangeTiers && (
            this.rangeIndicator = game.assetManager.loadModel('RangeIndicatorModel', {
                'isCircular': true,
                'radius': buildingSchema.rangeTiers[this.buildingTier - 1] * 0.57071
            }), Game.currentGame.renderer.ground.addAttachment(this.rangeIndicator)
        );
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
                    <a class="btn btn-gold hud-building-upgrade">Upgrade</a>
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
    this.collectElem = this.componentElem.querySelector(`.hud-building-collect`);
    this.upgradeElem = this.componentElem.querySelector('.hud-building-upgrade');
    this.sellElem = this.componentElem.querySelector('.hud-building-sell');
    `Harvester` !== this.buildingId && (this.dualBtnElem.style.display = `none`);
    this.depositElem.addEventListener(`click`, this.depositIntoBuilding.bind(this));
    this.collectElem.addEventListener(`click`, this.collectFromBuilding.bind(this));
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
                'harvestCapacity': `Capacity`
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
                currentStat = buildingSchema[buildingStat + `Tiers`][buildingTier - 1].toLocaleString(),
                isBuildingMaxed || (
                    nextTierStat = buildingSchema[buildingStat + 'Tiers'][buildingSchemaTier - 1].toLocaleString()
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

// @Leaderboard
game.ui.components.Leaderboard.update = function () {
    const currentGame = Game.currentGame;
    for (let leaderboardElem = 0; leaderboardElem < this.leaderboardData.length; leaderboardElem++) {
        let playerData = this.leaderboardData[leaderboardElem],
            playerName = this.playerNames[playerData.uid];
        this.playerNames[playerData.uid] || (
            playerName = window.filterXSS(playerData.name),
            this.playerNames[playerData.uid] = playerName
        );
        leaderboardElem in this.playerElems || (
            this.playerElems[leaderboardElem] = this.ui.createElement('<div\x20class=\x22hud-leaderboard-player\x22></div>'),
            this.playerRankElems[leaderboardElem] = this.ui.createElement(`<span class="player-rank">-</span>`),
            this.playerNameElems[leaderboardElem] = this.ui.createElement(`<strong class="player-name">-</strong>`),
            this.playerScoreElems[leaderboardElem] = this.ui.createElement(`<span class="player-score">-</span>`),
            this.playerWaveElems[leaderboardElem] = this.ui.createElement('<span\x20class=\x22player-wave\x22>-</span>'),

            this.playerElems[leaderboardElem].appendChild(this.playerRankElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerNameElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerScoreElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerWaveElems[leaderboardElem]),

            this.playersElem.appendChild(this.playerElems[leaderboardElem])
        );

        this.playerElems[leaderboardElem].classList[game.world.myUid === playerData.uid ? "add" : "remove"]('is-active');

        this.playerElems[leaderboardElem].style.display = `block`;
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

// @Spammer
game.spam = {
    literallyEveryUnicodeEver: null,
    randomSpamText: [
        // `${garbageGenerator()} BIG RAID ${garbageGenerator()}`,
        `?verify`,
        "hi",
        "ez",
        "Super Idol的笑容都没你的甜八月正午的阳光都没你耀眼热爱 105 °C的你滴滴清纯的蒸馏水",
        "Zǎoshang hǎo zhōngguó xiànzài wǒ yǒu BING CHILLING 🥶🍦",
        "Wǒ hěn xǐhuān BING CHILLING 🥶🍦 Dànshì sùdù yǔ jīqíng 9 bǐ BING CHILLING 🥶🍦",
    ],
    spamInterval: null,
    spamText: '',
    fetchUnicode: async function() {
        if (!this.literallyEveryUnicodeEver) {
            this.literallyEveryUnicodeEver = await fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')
                .then(response => response.text())
                .then(data => { return data; });
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
    }
};

// @Clones + @SessionSaver
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
        this.attributeMaps = {};
        this.entityTypeNames = {};
        this.rpcMaps = [];
        this.rpcMapsByName = {};
        this.sortedUidsByType = {};
        this.removedEntities = {};
        this.absentEntitiesFlags = [];
        this.updatedEntityFlags = [];
    }
    encode(e, t, r) {
        let a = new ByteBuffer(100, !0);
        switch (e) {
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                a.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD), this.encodeEnterWorld(a, t);
                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD2:
                a.writeUint8(PacketIds_1.default.PACKET_ENTER_WORLD2), this.encodeEnterWorld2(a, r);
                break;
            case PacketIds_1.default.PACKET_INPUT:
                a.writeUint8(PacketIds_1.default.PACKET_INPUT), this.encodeInput(a, t);
                break;
            case PacketIds_1.default.PACKET_PING:
                a.writeUint8(PacketIds_1.default.PACKET_PING), this.encodePing(a, t);
                break;
            case PacketIds_1.default.PACKET_RPC:
                a.writeUint8(PacketIds_1.default.PACKET_RPC), this.encodeRpc(a, t);
                break;
            case PacketIds_1.default.PACKET_BLEND:
                a.writeUint8(PacketIds_1.default.PACKET_BLEND), this.encodeBlend(a, t);
        }
        return a.flip(), a.compact(), a.toArrayBuffer(!1);
    }
    decode(e, t) {
        let r = ByteBuffer.wrap(e);
        r.littleEndian = !0;
        let a = r.readUint8(),
            n;
        switch (a) {
            case PacketIds_1.default.PACKET_PRE_ENTER_WORLD:
                n = this.decodePreEnterWorldResponse(r, t);
                break;
            case PacketIds_1.default.PACKET_ENTER_WORLD:
                n = this.decodeEnterWorldResponse(r);
                break;
            case PacketIds_1.default.PACKET_ENTITY_UPDATE:
                n = this.decodeEntityUpdate(r);
                break;
            case PacketIds_1.default.PACKET_PING:
                n = this.decodePing(r);
                break;
            case PacketIds_1.default.PACKET_RPC:
                n = this.decodeRpc(r);
                break;
            case PacketIds_1.default.PACKET_BLEND:
                n = this.decodeBlend(r, t);
        }
        return (n.opcode = a), n;
    }
    safeReadVString(e) {
        let t = e.offset,
            r = e.readVarint32(t);
        try {
            var a = e.readUTF8String.bind(e)(r.value, "b", (t += r.length));
            return (t += a.length), (e.offset = t), a.string;
        } catch (n) {
            return (t += r.value), (e.offset = t), "?";
        }
    }
    decodePreEnterWorldResponse(e, t) {
        return t._MakeBlendField(255, 140), { extra: this.decodeBlendInternal(e, t) };
    }
    decodeEnterWorldResponse(e) {
        let t = e.readUint32(),
            r,
            a = {
                allowed: t,
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
            n = e.readUint32();
        (this.attributeMaps = {}), (this.entityTypeNames = {});
        for (let i = 0; i < n; i++) {
            let s = [],
                d = e.readUint32(),
                l = e.readVString(),
                c = e.readUint32();
            for (let o = 0; o < c; o++) {
                let u = e.readVString(),
                    f = e.readUint32();
                s.push({ name: u, type: f });
            }
            (this.attributeMaps[d] = s), (this.entityTypeNames[d] = l), (this.sortedUidsByType[d] = []);
        }
        let p = e.readUint32();
        (this.rpcMaps = []), (this.rpcMapsByName = {});
        for (let _ = 0; _ < p; _++) {
            let E = e.readVString(),
                m = e.readUint8(),
                y = 0 != e.readUint8(),
                h = [];
            for (let T = 0; T < m; T++) {
                let P = e.readVString(),
                    U = e.readUint8();
                h.push({ name: P, type: U });
            }
            let $ = { name: E, parameters: h, isArray: y, index: this.rpcMaps.length };
            this.rpcMaps.push($), (this.rpcMapsByName[E] = $);
        }
        return a;
    }
    decodeEntityUpdate(e) {
        let t = e.readUint32(),
            r = e.readVarint32(),
            a = {};
        (a.tick = t), (a.entities = new Map());
        let n = Object.keys(this.removedEntities);
        for (let i = 0; i < n.length; i++) delete this.removedEntities[n[i]];
        for (let s = 0; s < r; s++) {
            var d = e.readUint32();
            this.removedEntities[d] = 1;
        }
        let l = e.readVarint32();
        for (let c = 0; c < l; c++)
            for (var o = e.readVarint32(), u = e.readUint32(), f = 0; f < o; f++) {
                var p = e.readUint32();
                this.sortedUidsByType[u].push(p);
            }
        let _ = Object.keys(this.sortedUidsByType);
        for (let E = 0; E < _.length; E++) {
            let m = this.sortedUidsByType[_[E]],
                y = [];
            for (let h = 0; h < m.length; h++) {
                let T = m[h];
                T in this.removedEntities || y.push(T);
            }
            y.sort((e, t) => e - t), (this.sortedUidsByType[_[E]] = y);
        }
        for (; e.remaining(); ) {
            let P = e.readUint32();
            if (!(P in this.attributeMaps)) throw Error("Entity type is not in attribute map: " + P);
            let U = Math.floor((this.sortedUidsByType[P].length + 7) / 8);
            this.absentEntitiesFlags.length = 0;
            for (let $ = 0; $ < U; $++) this.absentEntitiesFlags.push(e.readUint8());
            let b = this.attributeMaps[P];
            for (let A = 0; A < this.sortedUidsByType[P].length; A++) {
                let I = this.sortedUidsByType[P][A];
                if ((this.absentEntitiesFlags[Math.floor(A / 8)] & (1 << A % 8)) != 0) {
                    a.entities.set(I, !0);
                    continue;
                }
                var k = { uid: I };
                this.updatedEntityFlags.length = 0;
                for (let g = 0; g < Math.ceil(b.length / 8); g++) this.updatedEntityFlags.push(e.readUint8());
                for (let C = 0; C < b.length; C++) {
                    let w = b[C],
                        R = Math.floor(C / 8),
                        v = C % 8,
                        N,
                        B = [];
                    if (this.updatedEntityFlags[R] & (1 << v))
                        switch (w.type) {
                            case e_AttributeType.Uint32:
                                k[w.name] = e.readUint32();
                                break;
                            case e_AttributeType.Int32:
                                k[w.name] = e.readInt32();
                                break;
                            case e_AttributeType.Float:
                                k[w.name] = e.readInt32() / 100;
                                break;
                            case e_AttributeType.String:
                                k[w.name] = this.safeReadVString(e);
                                break;
                            case e_AttributeType.Vector2:
                                var K = e.readInt32() / 100,
                                    S = e.readInt32() / 100;
                                k[w.name] = { x: K, y: S };
                                break;
                            case e_AttributeType.ArrayVector2:
                                (N = e.readInt32()), (B = []);
                                for (let D = 0; D < N; D++) {
                                    let M = e.readInt32() / 100,
                                        F = e.readInt32() / 100;
                                    B.push({ x: M, y: F });
                                }
                                k[w.name] = B;
                                break;
                            case e_AttributeType.ArrayUint32:
                                (N = e.readInt32()), (B = []);
                                for (let O = 0; O < N; O++) {
                                    let W = e.readInt32();
                                    B.push(W);
                                }
                                k[w.name] = B;
                                break;
                            case e_AttributeType.Uint16:
                                k[w.name] = e.readUint16();
                                break;
                            case e_AttributeType.Uint8:
                                k[w.name] = e.readUint8();
                                break;
                            case e_AttributeType.Int16:
                                k[w.name] = e.readInt16();
                                break;
                            case e_AttributeType.Int8:
                                k[w.name] = e.readInt8();
                                break;
                            case e_AttributeType.Uint64:
                                k[w.name] = e.readUint32() + 4294967296 * e.readUint32();
                                break;
                            case e_AttributeType.Int64:
                                var L = e.readUint32(),
                                    V = e.readInt32();
                                V < 0 && (L *= -1), (L += 4294967296 * V), (k[w.name] = L);
                                break;
                            case e_AttributeType.Double:
                                var x = e.readUint32(),
                                    G = e.readInt32();
                                G < 0 && (x *= -1), (x += 4294967296 * G), (x /= 100), (k[w.name] = x);
                                break;
                            default:
                                throw Error("Unsupported attribute type: " + w.type);
                        }
                }
                a.entities.set(k.uid, k);
            }
        }
        return (a.byteSize = e.capacity()), a;
    }
    decodePing() {
        return {};
    }
    encodeRpc(e, t) {
        if (!(t.name in this.rpcMapsByName)) throw Error("RPC not in map: " + t.name);
        var r = this.rpcMapsByName[t.name];
        e.writeUint32(r.index);
        for (var a = 0; a < r.parameters.length; a++) {
            var n = t[r.parameters[a].name];
            switch (r.parameters[a].type) {
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
        for (let r = t._MakeBlendField(228, e.remaining()), a = 0; e.remaining(); ) (t.HEAPU8[r + a] = e.readUint8()), a++;
        t._MakeBlendField(172, 36);
        for (var n = new ArrayBuffer(64), i = new Uint8Array(n), s = t._MakeBlendField(4, 152), d = 0; d < 64; d++) i[d] = t.HEAPU8[s + d];
        return n;
    }
    decodeRpcObject(e, t) {
        for (var r = {}, a = 0; a < t.length; a++)
            switch (t[a].type) {
                case e_ParameterType.Uint32:
                    r[t[a].name] = e.readUint32();
                    break;
                case e_ParameterType.Int32:
                    r[t[a].name] = e.readInt32();
                    break;
                case e_ParameterType.Float:
                    r[t[a].name] = e.readInt32() / 100;
                    break;
                case e_ParameterType.String:
                    r[t[a].name] = this.safeReadVString(e);
                    break;
                case e_ParameterType.Uint64:
                    r[t[a].name] = e.readUint32() + 4294967296 * e.readUint32();
            }
        return r;
    }
    decodeRpc(e) {
        var t = e.readUint32(),
            r = this.rpcMaps[t],
            a = { name: r.name, response: null };
        if (r.isArray) {
            for (var n = [], i = e.readUint16(), s = 0; s < i; s++) n.push(this.decodeRpcObject(e, r.parameters));
            a.response = n;
        } else a.response = this.decodeRpcObject(e, r.parameters);
        return a;
    }
    encodeBlend(e, t) {
        for (var r = new Uint8Array(t.extra), a = 0; a < t.extra.byteLength; a++) e.writeUint8(r[a]);
    }
    encodeEnterWorld(e, t) {
        e.writeVString(t.displayName);
        for (var r = new Uint8Array(t.extra), a = 0; a < t.extra.byteLength; a++) e.writeUint8(r[a]);
    }
    encodeEnterWorld2(e, t) {
        for (var r = t._MakeBlendField(187, 22), a = 0; a < 16; a++) e.writeUint8(t.HEAPU8[r + a]);
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
fetch("https://cdn.glitch.global/14f404fe-81a3-418b-bc7c-78513660ae26/zombs_wasm%20(7).wasm?v=1710679251082")
    .then((e) => e.arrayBuffer().then((e) => {
    wasmBuffers = e;
}));
const wasmModule = (callback, data_12, hostname) => {
    function _a(e, t, r) {
        for (var a = t + r, n = t; e[n] && !(n >= a); ) ++n;
        if (n - t > 16 && e.subarray && _n) return _n.decode(e.subarray(t, n));
        for (var i = ""; t < n; ) {
            let s = e[t++];
            if (128 & s) {
                var d = 63 & e[t++];
                if (192 != (224 & s)) {
                    var l = 63 & e[t++];
                    if ((s = 224 == (240 & s) ? ((15 & s) << 12) | (d << 6) | l : ((7 & s) << 18) | (d << 12) | (l << 6) | (63 & e[t++])) < 65536) i += String.fromCharCode(s);
                    else {
                        var c = s - 65536;
                        i += String.fromCharCode(55296 | (c >> 10), 56320 | (1023 & c));
                    }
                } else i += String.fromCharCode(((31 & s) << 6) | d);
            } else i += String.fromCharCode(s);
        }
        return i;
    }
    function _b(e, t) {
        return e ? _a(_k, e, t) : "";
    }
    function _c(e, t, r, a) {
        if (!(a > 0)) return 0;
        for (var n = r, i = r + a - 1, s = 0; s < e.length; ++s) {
            var d = e.charCodeAt(s);
            if ((d >= 55296 && d <= 57343 && (d = (65536 + ((1023 & d) << 10)) | (1023 & e.charCodeAt(++s))), d <= 127)) {
                if (r >= i) break;
                t[r++] = d;
            } else if (d <= 2047) {
                if (r + 1 >= i) break;
                (t[r++] = 192 | (d >> 6)), (t[r++] = 128 | (63 & d));
            } else if (d <= 65535) {
                if (r + 2 >= i) break;
                (t[r++] = 224 | (d >> 12)), (t[r++] = 128 | ((d >> 6) & 63)), (t[r++] = 128 | (63 & d));
            } else {
                if (r + 3 >= i) break;
                (t[r++] = 240 | (d >> 18)), (t[r++] = 128 | ((d >> 12) & 63)), (t[r++] = 128 | ((d >> 6) & 63)), (t[r++] = 128 | (63 & d));
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
        var a = { a: { d() {}, e() {}, c() {}, f() {}, b: _h, a: _i } };
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


const staticJSONs = [
    {
        name: 'BuildingShopPrices',
        response: {
            json: '[{"Name":"Wall","Class":"PlayerObject","GoldCosts":[0,5,30,60,80,100,250,800],"WoodCosts":[2,0,0,0,0,0,0,0],"StoneCosts":[0,2,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,400,600,800,1500,2500],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,80,250]},{"Name":"GoldStash","Class":"GoldStash","GoldCosts":[0,5000,10000,16000,20000,32000,100000,400000],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[1500,1800,2300,3000,5000,8000,12000,20000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[50,60,70,90,110,150,400,700]},{"Name":"GoldMine","Class":"GoldMine","GoldCosts":[0,200,300,600,800,1200,8000,30000],"WoodCosts":[5,15,25,35,45,55,700,1600],"StoneCosts":[5,15,25,35,45,55,700,1600],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":95.99,"Height":95.99,"Health":[150,250,350,500,800,1400,1800,2800],"GoldPerSecond":[4,6,7,10,12,15,25,35],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,120]},{"Name":"Door","Class":"Door","GoldCosts":[0,10,50,70,150,200,400,800],"WoodCosts":[5,5,0,0,0,0,0,0],"StoneCosts":[5,5,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0],"Width":47.99,"Height":47.99,"Health":[150,200,300,500,700,1000,1500,2000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,1000],"HealthRegenPerSecond":[5,7,12,17,25,40,70,100]},{"Name":"CannonTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,30,40,60,80,300,800],"StoneCosts":[15,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[500,500,500,500,600,600,600,600],"MsBetweenFires":[1000,769,625,500,400,350,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,30,50,70,120,150,200,300],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,8],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,65,70,70,75,80,100,140],"ProjectileName":"CannonProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"ArrowTower","Class":"ArrowTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[600,650,700,750,800,850,900,1000],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[20,40,70,120,180,250,400,500],"DamageToPlayers":[5,5,6,6,7,7,8,8],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1300,1300,1300,1300,1300,1300,1300,1300],"ProjectileVelocity":[60,65,70,70,75,80,120,140],"ProjectileName":"ArrowProjectile","ProjectileAoe":[false,false,false,false,false,false,false,false],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"Harvester","Class":"Harvester","GoldCosts":[0,100,200,600,1200,2000,8000,10000],"WoodCosts":[5,25,30,40,50,70,300,600],"StoneCosts":[5,20,30,40,60,80,300,600],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,2800],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,130],"HarvestAmount":[2.5,4.65,4.55,7.2,8.25,10,13.5,16],"HarvestCooldown":[1500,1400,1300,1200,1100,1000,900,800],"HarvestMax":[400,800,1200,1600,2000,2400,2800,3600],"HarvestRange":[300,300,300,300,300,300,300,300],"DepositCostPerMinute":[200,300,350,500,600,700,1200,1400],"DepositMax":[800,1200,1400,2000,2400,2800,4800,6000],"MaxYawDeviation":[70,70,70,70,70,70,70,70]},{"Name":"BombTower","Class":"Tower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,40,50,80,120,300,800],"StoneCosts":[10,25,40,50,80,120,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[1000,1000,1000,1000,1000,1000,1000,1000],"MsBetweenFires":[1000,1000,1000,1000,1000,1000,900,900],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[30,60,100,140,200,600,1200,1600],"DamageToPlayers":[9,9,10,10,11,11,12,12],"DamageToPets":[10,10,10,10,10,10,10,10],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[20,20,20,20,20,20,20,20],"ProjectileName":"BombProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileIgnoresCollisions":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"ProjectileMaxRange":[1000,1000,1000,1000,1000,1000,1000,1000]},{"Name":"MagicTower","Class":"MagicTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[15,25,40,50,70,100,300,800],"StoneCosts":[15,25,40,50,70,100,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[400,400,400,400,400,400,400,400],"MsBetweenFires":[800,800,700,600,500,400,300,300],"Height":95.99,"Width":95.99,"Health":[150,200,400,800,1200,1600,2200,3600],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"DamageToZombies":[10,20,40,50,70,80,120,160],"DamageToPlayers":[5,5,5,6,6,6,7,7],"DamageToPets":[5,5,5,5,5,5,5,5],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"ProjectileLifetime":[500,500,500,500,500,500,500,500],"ProjectileVelocity":[45,45,45,45,45,45,45,45],"ProjectileName":"FireballProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[100,100,100,100,100,100,100,100],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10]},{"Name":"MeleeTower","Class":"MeleeTower","GoldCosts":[0,100,200,600,1200,2000,8000,35000],"WoodCosts":[10,25,30,40,50,70,300,800],"StoneCosts":[10,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"TowerRadius":[110,110,110,110,110,110,110,110],"MsBetweenFires":[400,333,285,250,250,250,250,250],"Height":95.99,"Width":95.99,"Health":[200,400,800,1200,1600,2200,4000,9000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,220,350],"DamageToZombies":[80,120,200,280,500,1000,2000,3000],"DamageToPlayers":[5,6,7,8,9,10,11,12],"DamageToPets":[5,5,5,5,5,5,6,6],"DamageToNeutrals":[250,350,450,550,650,750,850,1000],"MaxYawDeviation":[30,30,30,30,30,30,30,30]},{"Name":"SlowTrap","Class":"Trap","GoldCosts":[0,100,200,400,600,800,1000,1500],"WoodCosts":[5,25,30,40,50,70,300,800],"StoneCosts":[5,20,30,40,60,80,300,800],"TokenCosts":[0,0,0,0,0,0,0,0],"Height":47.99,"Width":47.99,"Health":[150,200,400,800,1200,1600,2200,3000],"MsBeforeRegen":[10000,10000,10000,10000,10000,10000,10000,10000],"HealthRegenPerSecond":[2,5,10,20,40,80,110,150],"SlowDuration":[2500,2500,2500,3000,3000,3250,3500,4000],"SlowAmount":[0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.7]}]'},
        opcode: 9
    },
    {
        name: 'ItemShopPrices',
        response: {
            json: '[{"Name":"Spear","Class":"MeleeWeapon","MsBetweenFires":[250,250,250,250,250,250,250],"DamageToZombies":[30,80,120,300,2000,8000,10000],"DamageToNeutrals":[50,80,100,200,250,400,600],"DamageToBuildings":[0.75,1.5,2.25,3,3.75,4.5,5.25],"DamageToPlayers":[15,16,17,18,20,22,22],"DamageToPets":[3,3.5,4,4.5,5,5.5,5.5],"GoldCosts":[1400,2800,5600,11200,22500,45000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[50,50,50,50,50,50,50]},{"Name":"Pickaxe","Class":"MeleeWeapon","MsBetweenFires":[300,300,285,250,200,200,200],"DamageToZombies":[20,20,20,20,20,20,20],"DamageToBuildings":[0,0,0,0,0,0,0],"DamageToPlayers":[0,0,0,0,0,0,0],"DamageToNeutrals":[10,10,10,10,10,10,10],"DamageToPets":[0,0,0,0,0,0,0],"GoldCosts":[0,1000,3000,6000,8000,24000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"Range":[100,100,100,100,100,100,100],"MaxYawDeviation":[70,70,70,70,70,70,70],"IsTool":true,"HarvestCount":[1,2,2,3,3,4,6]},{"Name":"Bow","Class":"RangedWeapon","DamageToZombies":[20,40,100,300,2400,10000,14000],"DamageToBuildings":[2,2.3,2.5,2.7,3,3,3],"DamageToPlayers":[22,24,26,28,30,32,32],"DamageToNeutrals":[50,100,150,200,250,400,700],"DamageToPets":[2,2.3,2.5,2.7,3,3,3],"GoldCosts":[100,400,2000,7000,24000,30000,90000],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"ChargeTime":[150,150,150,150,150,150,150],"ProjectileVelocity":[100,100,100,100,100,100,100],"ProjectileName":"BowProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[550,550,550,550,550,550,550]},{"Name":"Bomb","Class":"RangedWeapon","GoldCosts":[100,400,3000,5000,24000,30000,90000],"DamageToNeutrals":[50,100,150,200,250,300,500],"StoneCosts":[0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0],"MsBetweenFires":[500,500,500,500,500,500,500],"DamageToZombies":[10,30,80,150,1200,6000,9000],"DamageToBuildings":[1,1,1,1,1,1,1],"DamageToPlayers":[20,22,24,26,28,30,30],"DamageToPets":[1,1,1,1,1,1,1],"ProjectileVelocity":[40,40,40,40,40,40,40],"ProjectileName":"BombProjectile","ProjectileCollisionRadius":[10,10,10,10,10,10,10],"ProjectileLifetime":[700,700,700,700,700,700,700],"ProjectileAoe":[true,true,true,true,true,true,true],"ProjectileAoeRadius":[50,50,50,50,50,50,50],"ProjectileIgnoresCollisions":[false,false,false,false,false,false,false],"ProjectileMaxRange":[700,700,700,700,700,700,700]},{"Name":"HealthPotion","Class":"HealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":15000},{"Name":"ZombieShield","Class":"ZombieShield","GoldCosts":[1000,3000,7000,14000,18000,22000,24000,30000,45000,70000],"StoneCosts":[0,0,0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0,0,0],"TokenCosts":[0,0,0,0,0,0,0,0,0,0],"Health":[500,1000,1800,4000,10000,20000,35000,50000,65000,85000],"RechargePerSecond":[50,100,200,400,1000,2000,3500,5000,6500,8500],"MsBeforeRecharge":[10000,9000,8000,7000,6000,6000,6000,6000,6000,6000]},{"Name":"Pause","Class":"Pause","GoldCosts":[10000],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0],"PurchaseCooldown":240000},{"Name":"PetMiner","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"HarvestCount":[1,1,2,2,3,3,4,4],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[false,false,false,false,false,false,false,false],"CanMine":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"HarvestLeashRange":[0,0,0,0,0,0,0,0],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,450,450,400,400,380,380,350],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromMiningPerHalfSecond":[1,1,1,1,1,1,1,1]},{"Name":"PetCARL","Class":"Pet","GoldCosts":[0,0,0,0,0,0,0,0],"WoodCosts":[0,0,0,0,0,0,0,0],"StoneCosts":[0,0,0,0,0,0,0,0],"TokenCosts":[0,100,100,100,100,200,200,300],"CollisionRadius":25,"Health":[400,800,1500,3000,5000,8000,10000,16000],"MsBeforeRegen":[8000,8000,8000,8000,8000,8000,8000,8000],"HealthRegenPerSecond":[5,5,5,5,5,5,5,5],"Speed":[30,32,34,35,35,37,37,38],"DamageToNeutrals":[80,100,150,200,250,400,500,600],"Ranged":[false,false,false,false,false,false,false,false],"CanAttackPlayers":[true,true,true,true,true,true,true,true],"LeashRange":[500,500,500,500,500,500,500,500],"AttackRange":[80,80,80,80,80,80,80,80],"MsBetweenFires":[500,490,490,490,480,480,470,470],"ProjectileLifetime":[1000,1000,1000,1000,1000,1000,1000,1000],"ProjectileVelocity":[60,60,60,60,60,60,60,60],"ProjectileName":"PetCARLProjectile","ProjectileAoe":[true,true,true,true,true,true,true,true],"ProjectileAoeRadius":[250,250,250,250,250,250,250,250],"ProjectileCollisionRadius":[10,10,10,10,10,10,10,10],"DamageToZombies":[30,100,400,600,1000,3000,6000,8000],"DamageToPlayers":[30,31,32,33,34,35,36,37],"DamageToBuildings":[2,2,2,3,3,3,4,4],"EvolvesAtLevel":[0,8,16,24,32,48,64,96],"ExperienceFromZombies":[30,28,25,25,25,25,25,25],"ExperienceFromNeutrals":[30,28,25,25,25,25,25,25]},{"Name":"HatHorns","Class":"Hat","GoldCosts":[0],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]},{"Name":"PetHealthPotion","Class":"PetHealthPotion","GoldCosts":[100],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetWhistle","Class":"PetWhistle","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]},{"Name":"PetRevive","Class":"PetRevive","GoldCosts":[0],"StoneCosts":[0],"WoodCosts":[0],"TokenCosts":[0]}]'},
        opcode: 9
    },
    {
        name: 'Spells',
        response: {
            json: '[{"Name":"HealTowersSpell","VisualLifetime":10000,"VisualRadius":600,"Cooldown":[240000],"IsCooldownForParty":true,"Healing":[{"Type":"Tower","Amount":[50],"Over":[10000],"Radius":[600]}],"GoldCosts":[1000],"WoodCosts":[0],"StoneCosts":[0],"TokenCosts":[0]}]'},
        opcode: 9
    }
];

const codecJSON = '{"attributeMaps":{"667546015":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"firingTick","type":1},{"name":"experience","type":1},{"name":"stoneGain","type":3},{"name":"woodGain","type":3},{"name":"stoneGainTick","type":1},{"name":"woodGainTick","type":1}],"742594995":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1059671174":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1},{"name":"lastDamagedTick","type":1}],"1372600389":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"1496910567":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"firingTick","type":1}],"1566069472":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"1672634632":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"1816895259":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1}],"2092990061":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2093252446":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"hits","type":8}],"2347737811":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"reconnectSecret","type":4},{"name":"name","type":4},{"name":"score","type":13},{"name":"baseSpeed","type":3},{"name":"speedAttribute","type":3},{"name":"availableSkillPoints","type":2},{"name":"experience","type":3},{"name":"level","type":1},{"name":"msBetweenFires","type":3},{"name":"aimingYaw","type":2},{"name":"energy","type":3},{"name":"maxEnergy","type":3},{"name":"energyRegenerationRate","type":3},{"name":"kills","type":2},{"name":"weaponName","type":4},{"name":"weaponTier","type":1},{"name":"firingTick","type":1},{"name":"startChargingTick","type":1},{"name":"stone","type":15},{"name":"wood","type":15},{"name":"gold","type":15},{"name":"token","type":15},{"name":"wave","type":1},{"name":"partyId","type":1},{"name":"zombieShieldHealth","type":3},{"name":"zombieShieldMaxHealth","type":3},{"name":"isPaused","type":1},{"name":"isInvulnerable","type":1},{"name":"lastPetDamage","type":3},{"name":"lastPetDamageTick","type":1},{"name":"lastPetDamageTarget","type":1},{"name":"lastDamage","type":3},{"name":"lastDamageTick","type":1},{"name":"lastDamageTarget","type":1},{"name":"hatName","type":4},{"name":"petUid","type":1},{"name":"isBuildingWalking","type":10}],"2402467733":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2462472648":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1}],"2464630638":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1}],"2899981078":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"harvestMax","type":1},{"name":"stone","type":1},{"name":"wood","type":1},{"name":"firingTick","type":1},{"name":"deposit","type":3},{"name":"depositMax","type":3},{"name":"lastHarvestedBy","type":4}],"2969697641":[{"name":"position","type":5},{"name":"yaw","type":2},{"name":"health","type":3},{"name":"maxHealth","type":3},{"name":"damage","type":3},{"name":"height","type":3},{"name":"width","type":3},{"name":"collisionRadius","type":1},{"name":"model","type":4},{"name":"entityClass","type":4},{"name":"dead","type":1},{"name":"timeDead","type":3},{"name":"slowed","type":1},{"name":"stunned","type":1},{"name":"tier","type":1},{"name":"partyId","type":1},{"name":"towerYaw","type":3},{"name":"firingTick","type":1},{"name":"healingTick","type":1}]},"entityTypeNames":{"667546015":"Pet","742594995":"GoldMine","1059671174":"Zombie","1372600389":"Stone","1496910567":"Neutral","1566069472":"PlayerObject","1672634632":"NeutralCamp","1816895259":"GameProjectile","2092990061":"Trap","2093252446":"Tree","2347737811":"GamePlayer","2402467733":"GoldStash","2462472648":"Spell","2464630638":"Door","2899981078":"Harvester","2969697641":"Tower"},"rpcMaps":[{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},{"name":"RecallPet","parameters":[],"isArray":false,"index":34},{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}],"rpcMapsByName":{"Shutdown":{"name":"Shutdown","parameters":[{"name":"reason","type":3},{"name":"shutdownUnix","type":0}],"isArray":false,"index":0},"ReceiveChatMessage":{"name":"ReceiveChatMessage","parameters":[{"name":"displayName","type":3},{"name":"channel","type":3},{"name":"message","type":3},{"name":"uid","type":0}],"isArray":false,"index":1},"SendChatMessage":{"name":"SendChatMessage","parameters":[{"name":"channel","type":3},{"name":"message","type":3}],"isArray":false,"index":2},"Login":{"name":"Login","parameters":[{"name":"token","type":3}],"isArray":false,"index":3},"LoginResponse":{"name":"LoginResponse","parameters":[{"name":"json","type":3}],"isArray":false,"index":4},"AccountSession":{"name":"AccountSession","parameters":[{"name":"json","type":3}],"isArray":false,"index":5},"Metrics":{"name":"Metrics","parameters":[{"name":"minFps","type":2},{"name":"maxFps","type":2},{"name":"currentFps","type":2},{"name":"averageFps","type":2},{"name":"framesRendered","type":2},{"name":"framesInterpolated","type":2},{"name":"framesExtrapolated","type":2},{"name":"allocatedNetworkEntities","type":2},{"name":"currentClientLag","type":2},{"name":"minClientLag","type":2},{"name":"maxClientLag","type":2},{"name":"currentPing","type":2},{"name":"minPing","type":2},{"name":"maxPing","type":2},{"name":"averagePing","type":2},{"name":"longFrames","type":2},{"name":"stutters","type":2},{"name":"group","type":0},{"name":"isMobile","type":0},{"name":"timeResets","type":2},{"name":"maxExtrapolationTime","type":2},{"name":"extrapolationIncidents","type":2},{"name":"totalExtrapolationTime","type":2},{"name":"differenceInClientTime","type":2}],"isArray":false,"index":6},"DayCycle":{"name":"DayCycle","parameters":[{"name":"cycleStartTick","type":0},{"name":"nightEndTick","type":0},{"name":"dayEndTick","type":0},{"name":"isDay","type":0}],"isArray":false,"index":7},"MakeBuilding":{"name":"MakeBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"yaw","type":1}],"isArray":false,"index":8},"BuildingShopPrices":{"name":"BuildingShopPrices","parameters":[{"name":"json","type":3}],"isArray":false,"index":9},"ItemShopPrices":{"name":"ItemShopPrices","parameters":[{"name":"json","type":3},{"name":"json","type":3}],"isArray":false,"index":10},"LocalBuilding":{"name":"LocalBuilding","parameters":[{"name":"x","type":1},{"name":"y","type":1},{"name":"type","type":3},{"name":"dead","type":0},{"name":"uid","type":0},{"name":"tier","type":0}],"isArray":true,"index":11},"Dead":{"name":"Dead","parameters":[{"name":"stashDied","type":0}],"isArray":false,"index":12},"Admin":{"name":"Admin","parameters":[{"name":"password","type":3},{"name":"command","type":3}],"isArray":false,"index":13},"UpgradeBuilding":{"name":"UpgradeBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":14},"DeleteBuilding":{"name":"DeleteBuilding","parameters":[{"name":"uid","type":0}],"isArray":false,"index":15},"BuyItem":{"name":"BuyItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":16},"SetItem":{"name":"SetItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0},{"name":"stacks","type":0}],"isArray":false,"index":17},"EquipItem":{"name":"EquipItem","parameters":[{"name":"itemName","type":3},{"name":"tier","type":0}],"isArray":false,"index":18},"SetOpenParty":{"name":"SetOpenParty","parameters":[{"name":"isOpen","type":0}],"isArray":false,"index":19},"SetPartyName":{"name":"SetPartyName","parameters":[{"name":"partyName","type":3}],"isArray":false,"index":20},"SetPartyMemberCanSell":{"name":"SetPartyMemberCanSell","parameters":[{"name":"uid","type":0},{"name":"canSell","type":0}],"isArray":false,"index":21},"JoinParty":{"name":"JoinParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":22},"JoinPartyByShareKey":{"name":"JoinPartyByShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":23},"PartyApplicant":{"name":"PartyApplicant","parameters":[{"name":"displayName","type":3},{"name":"applicantUid","type":0}],"isArray":false,"index":24},"PartyApplicantDecide":{"name":"PartyApplicantDecide","parameters":[{"name":"applicantUid","type":0},{"name":"accepted","type":0}],"isArray":false,"index":25},"PartyApplicantDenied":{"name":"PartyApplicantDenied","parameters":[],"isArray":false,"index":26},"PartyApplicantExpired":{"name":"PartyApplicantExpired","parameters":[{"name":"applicantUid","type":0}],"isArray":false,"index":27},"PartyShareKey":{"name":"PartyShareKey","parameters":[{"name":"partyShareKey","type":3}],"isArray":false,"index":28},"PartyInfo":{"name":"PartyInfo","parameters":[{"name":"playerUid","type":0},{"name":"displayName","type":3},{"name":"isLeader","type":0},{"name":"canSell","type":0}],"isArray":true,"index":29},"AddParty":{"name":"AddParty","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":false,"index":30},"RemoveParty":{"name":"RemoveParty","parameters":[{"name":"partyId","type":0}],"isArray":false,"index":31},"Leaderboard":{"name":"Leaderboard","parameters":[{"name":"name","type":3},{"name":"uid","type":0},{"name":"rank","type":0},{"name":"score","type":4},{"name":"wave","type":0}],"isArray":true,"index":32},"Failure":{"name":"Failure","parameters":[{"name":"category","type":3},{"name":"reason","type":3},{"name":"x","type":0},{"name":"y","type":0},{"name":"type","type":3}],"isArray":false,"index":33},"RecallPet":{"name":"RecallPet","parameters":[],"isArray":false,"index":34},"LeaveParty":{"name":"LeaveParty","parameters":[],"isArray":false,"index":35},"KickParty":{"name":"KickParty","parameters":[{"name":"uid","type":0}],"isArray":false,"index":36},"AddDepositToHarvester":{"name":"AddDepositToHarvester","parameters":[{"name":"uid","type":0},{"name":"deposit","type":2}],"isArray":false,"index":37},"CollectHarvester":{"name":"CollectHarvester","parameters":[{"name":"uid","type":0}],"isArray":false,"index":38},"CastSpell":{"name":"CastSpell","parameters":[{"name":"spell","type":3},{"name":"x","type":1},{"name":"y","type":1},{"name":"tier","type":0}],"isArray":false,"index":39},"CastSpellResponse":{"name":"CastSpellResponse","parameters":[{"name":"spell","type":3},{"name":"cooldown","type":0},{"name":"cooldownStartTick","type":0}],"isArray":false,"index":40},"Spells":{"name":"Spells","parameters":[{"name":"json","type":3}],"isArray":false,"index":41},"SetPartyList":{"name":"SetPartyList","parameters":[{"name":"partyId","type":0},{"name":"partyName","type":3},{"name":"isOpen","type":0},{"name":"memberCount","type":0}],"isArray":true,"index":42}}}'

game.sessions = {
    SESSION_SECRET_KEY: 'f07cbf563d19619ba4afe3ae1e2ec95710a72b3e',
    SESSION_DEFAULT_PORT: 727,
    SESSION_FETCH_TIMEOUT: 7500,

    allSessions: null,
    sessionElem: document.createElement('optgroup'),

    shouldUseSession: false,
    currentSession: null,

    init: async function() {
        const allServerElems = document.querySelectorAll(".hud-intro-server option");
        for (const serverElem of allServerElems) {
            serverElem.innerText = `${serverElem.innerText} (${serverElem.value})`;
        };
        await this.fetchSessions();
        this.sessionElem.label = "Sessions";
        game.ui.components.Intro.serverElem.appendChild(this.sessionElem);
        game.ui.components.Intro.serverElem.onchange = ({ target: { value } }) => {
            if (value == "newSes") return game.sessions.createSession();
            if (value.includes("session")) {
                const sessionId = value.split("/")[1];
                game.sessions.useSessions(sessionId);
            } else this.shouldUseSession = false;
        };
    },
    useSessions: function(sessionId) {
        this.currentSession = sessionId;
        this.shouldUseSession = true;
    },
    fetchSessions: async function() {
        try {
            let data = await fetch(
                `http://localhost:${this.SESSION_DEFAULT_PORT + 1}/sessions`,
                { signal: AbortSignal.timeout(this.SESSION_FETCH_TIMEOUT) }
            );
            data = await data.json();
            this.allSessions = data;
            this.mapSessions();
        } catch {
            console.log("Failed to fetch available sessions...");
        };
    },
    createSession: async function(nickname = getClass("hud-intro-name")[0].value, server = getClass("hud-intro-server")[0].value, psk = "") {
        if (server == "newSes") server = prompt("Enter server ID");
        if (!(server in game.options.servers)) {
            if (!("v" + server in game.options.servers)) return this.createSession(nickname, "newSes");
        };
        psk = prompt("Enter party share key (if you don't intend to join a party after creating the session, please leave this empty)");
        try {
            let data = await fetch(
                `http://localhost:${this.SESSION_DEFAULT_PORT + 1}/create?name=${nickname}&serverId=${server}&psk=${psk}`,
                { signal: AbortSignal.timeout(this.SESSION_FETCH_TIMEOUT) }
            );
            data = await data.json();
            this.allSessions = data.data;
            this.mapSessions();

            getClass("hud-intro-server")[0].value = `session/${data.createdSession}`;
            this.useSessions(data.createdSession);
        } catch(e) {
            console.log("Failed to create new session: " + e);
        };
        // await fetch(`http://localhost:${this.SESSION_DEFAULT_PORT + 1}/create?name=${nickname}&serverId=${server}`);
    },
    mapSessions() {
        if (this.allSessions === null) return;
        this.sessionElem.innerHTML = [...Object.entries(this.allSessions).map(([ key, {name, connectionOptions: { id } } ]) => {
            return `
                <option value="session/${key}">${window.filterXSS(name)} [${id}]</option>
            `;
        }), `<option value="newSes">New Session</option>`].join("\n");
    },
};

game.network.establishSessionConnection = function() {
    const { currentSession, allSessions } = game.sessions;
    this.connectionOptions = allSessions[currentSession].connectionOptions;
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
    this.socket = new WebSocket(`ws://localhost:${game.sessions.SESSION_DEFAULT_PORT}`);
    this.socket.binaryType = `arraybuffer`;
    this.socket.addEventListener("open", () => {
        this.socket.send(this.codec.encode(9, {
            name: "VerifyUser",
            secretKey: game.sessions.SESSION_SECRET_KEY
        }));
        this.socket.send(this.codec.encode(9, {
            name: "ConnectSession",
            id: currentSession,
        }));
    });
    this.bindEventListeners();
    this.addRpcHandler("SyncData", (response) => {
        try {
            const data = JSON.parse(response.json);

            this.connectionOptions = data.connectionOptions;
            game.options.serverId = data.connectionOptions.id;
            game.options.nickname = data.syncNeeds[0].effectiveDisplayName;

            const staticCodecData = JSON.parse(codecJSON);
            for (let i in staticCodecData) {
                this.codec[i] = staticCodecData[i];
            };
            this.codec.sortedUidsByType = data.sortedUidsByType;
            this.codec.removedEntities = data.removedEntities;
            this.codec.absentEntitiesFlags = data.absentEntitiesFlags;
            this.codec.updatedEntityFlags = data.updatedEntityFlags;

            for (let i = 0; i < staticJSONs.length; i++) {
                this.emitter.emit(PacketIds_1.default[staticJSONs[i].opcode], staticJSONs[i]);
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
        if (game.sessions.shouldUseSession) return this.establishSessionConnection();
        this.connectionOptions = options;
        this.connected = false;
        this.connecting = true;
        this.socket = new WebSocket('wss://' + options.hostname + ':' + options.port);
        this.socket.binaryType = `arraybuffer`;
        this.bindEventListeners();
    };
};

game.sessions.init();

const loadLbPacket = (socket) => {
    for (let i = 0; i < 26; i++) socket.ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125])); // move packet
    socket.ws.send(new Uint8Array([7, 0])); // ping
    socket.ws.send(
        new Uint8Array(
            [9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,
             166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]
        )
    ); // metrics
};

game.clones = {
    all: {},
    shared: {
        control: true,
    },
    createSocket: function() {
        const socket = new CloneSocket();
        this.all[socket.identifiers.id] = socket;
        socket.shared = this.shared;
    }
};

function decodeMessage(server, socket, msg) {
    let data = {};
    const m = new Uint8Array(msg.data);
    data.opcode = m[0];
    switch(m[0]) {
        case 5:
            wasmModule(e => {
                socket.sendPacket(4, {displayName: socket.identifiers.name, extra: e[5].extra});
                socket.ws.enterWorld2 = e[6];
                socket.Module = e[10];
            }, m, server.ipAddress);
            break;
        case 10:
            socket.sendPacket(10, {extra: codec.decode(m, socket.Module).extra});
            break;
        default:
            data = socket.network.codec.decode(msg.data);
    };
    if (m[0] == 4) {
        data.allowed && socket.ws.send(socket.ws.enterWorld2);
        delete socket.ws.enterWorld2;
    };
    return data;
}

class Socket {
    constructor(url, identifiers, sendNow = true) {
        this.url = url;
        this.identifiers = identifiers;
        sendNow && this.init();
    };
    init() {
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = "arraybuffer";
        this.ws.addEventListener("open", () => {
            console.log("a", this);
            this.network = new game.networkType();
            this.network.emitter.removeListener("PACKET_BLEND", this.network.emitter._events.PACKET_BLEND);
        });
    }
    sendPacket(e, t) {
        const enc = this.network.codec.encode(e, t);
        this.ws.readyState == 1 && this.ws.send(enc);
    };
};

const status_enum = {
    "Population Full": "red",
    "Failed": "red",
    "Closed": "red",
    "Connecting": "yellow",
    "Open": "green"
};

class CloneSocket extends Socket {
    constructor(server = game.network.connectionOptions) {
        const id = genShortUUID();
        super(`wss://${server.hostname}:443/`, {
            name: garbageGenerator(1), id,
        });
        this.timeCreation = Date.now();
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

        this.minimapDisplay = document.createElement('div');
        this.statusDisplay = document.createElement("p");

        // this.server = server;
        this.bindControls();
        this.ws.addEventListener("open", () => { this.updateStatus("Connecting"); });
        this.ws.addEventListener("message", (msg) => {
            this.data = decodeMessage(server, this, msg);
            switch(this.data.opcode) {
                case 0: this.onEntityUpdate(this.data); break;
                case 4: this.onEnterWorld(this.data); break;
                case 5:
                    this.onPreEnterWorld(this.data);
                    setTimeout(() => { if (this.data.opcode === 5) this.ws.close(3001); }, 5000);
                    break;
                case 9: this.onRpc(this.data); break;
            };
        });
        this.ws.addEventListener("close", ({code}) => { this.onClose(code); });
    };
    sendInput(t) { this.sendPacket(3, t); };
    sendPing(t) { this.sendPacket(7, t); };
    sendRpc(t) { this.sendPacket(9, t); };
    onEntityUpdate(data) {
        if (data.entities[this.player.uid].name) {
            this.player.targetTick = data.entities[this.player.uid];
        }
        for (let g in this.player.targetTick) {
            if (this.player.targetTick[g] !== data.entities[this.player.uid][g] && data.entities[this.player.uid][g] !== undefined) {
                this.player.targetTick[g] = data.entities[this.player.uid][g];
            }
        }
        if (this.player.targetTick.petUid) {
            if (data.entities?.[this.player.targetTick.petUid]?.model) {
                this.player.petTick = data.entities[this.player.targetTick.petUid];
            }
            for (let g in this.player.petTick) {
                if (this.player.petTick[g] !== data.entities?.[this.player.targetTick.petUid][g] && data.entities?.[this.player.targetTick.petUid][g] !== undefined) {
                    this.player.petTick[g] = data.entities[this.player.targetTick.petUid][g];
                }
            }
        }
        for (let i in data.entities) {
            /*
            if (data.entities[i].name) {
                this.entities.players[i] = data.entities[i];
            } */

            if (["Tree", "Stone", "NeutralCamp"].indexOf(data.entities[i].model) > -1) {
                game.world.createEntity(data.entities[i]);
            }
        }
        /*
        for (let i in this.entities.players) {
            if (!data.entities[i]) delete this.entities.players[i];
            for (let g in this.entities.players[i]) {
                if (this.entities.players[i][g] !== data.entities[i][g] && data.entities[i][g] !== undefined) {
                    this.entities.players[i][g] = data.entities[i][g];
                };
            };
        };
        */
    };
    onEnterWorld(e) {
        if (e.allowed) {
            this.player.uid = e.uid;

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
    };
    onPreEnterWorld(e) {};
    onRpc(e) {
        this.updateStatus("Open");
        switch(e.name) {
            case "PartyShareKey":
                this.player.partyShareKey || this.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});
                this.player.partyShareKey = e.response;
                break;
            case "SetItem":
                this.player.inventory[e.response.itemName] = e.response;
                if (!this.player.inventory[e.response.itemName].stacks) {
                    delete this.player.inventory[e.response.itemName];
                }
                break;
        };
    };
    onClose(code) {
        switch(code) {
            case 3001:
                this.updateStatus("Failed");
                break;
            default:
                this.updateStatus("Closed");
        };
    };
    bindControls() {};
    updateStatus(status) {
        const timeElapsedInMiliseconds = Date.now() - this.timeCreation;
        const timeElapsedInSeconds = Math.floor(timeElapsedInMiliseconds / 1000);
        const timeElapsedInMinutes = Math.floor(timeElapsedInSeconds / 60);
        const timeElapsedInSecondsSubtracted = timeElapsedInSeconds - (timeElapsedInMinutes * 60);
        this.statusDisplay.id = `alt${this.identifiers.id}`;
        this.statusDisplay.innerHTML = `
            Socket ${this.identifiers.id}<br>
            State: <strong style="color: ${status_enum[status]};">[${status}]</strong>${["Population Full", "Failed", "Closed"].indexOf(status) == -1 ? `, elapsed: ${timeElapsedInMinutes}m ${timeElapsedInSecondsSubtracted}s` : `, created: ${getClock(new Date(this.timeCreation))}`}<br>
            ${status === "Open" ? `
            UID: ${this.player.uid}, partyId: <strong>${this.player.targetTick.partyId || 0}</strong><br>
            <strong>W: ${counter(this.player?.targetTick?.wood || 0)}, S: ${counter(this.player?.targetTick?.stone || 0)}, G: ${counter(this.player?.targetTick?.gold || 0)}, T: ${counter(this.player?.targetTick?.token || 0)}</strong><br>
            <a href="javascript:void(0);" style="margin: 5px 0 0 0;color: red;" onclick="game.clones.all['${this.identifiers.id}'].ws.close();">Delete</a>
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
        status === "Connecting" && getId("clone-status").appendChild(this.statusDisplay);
    };
};

window.CloneSocket = CloneSocket;

window.sendAitoAlt = () => {
    let lastSocket = null;
    const server = game.network.connectionOptions;
    const hostname = server.hostname;
    const url = `wss://${hostname}:443/`;
    const aitoInterval = () => {
        if (!game.options.options.aito) {
            lastSocket?.ws?.close?.();
            return;
        };
        const socket = new Socket(url, {
            name: garbageGenerator(1),
        });
        socket.verified = false;
        socket.sendInput = function(t) {
            this.sendPacket(3, t);
        };
        socket.sendRpc = function(t) {
            this.sendPacket(9, t);
        };
        socket.ws.onmessage = (msg) => {
            socket.data = decodeMessage(server, socket, msg);
            if (socket.data.opcode === 0) {
                socket.identifiers.player = Object.assign(socket.identifiers.player, socket.data.entities[socket.identifiers.uid]);
                if (socket.identifiers.psk) {
                    if (socket.identifiers.psk.response.partyShareKey != game.ui.getPlayerPartyShareKey()) {
                        socket.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });
                    } else if (socket.identifiers.player.gold >= 10000) {
                        socket.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    };
                };
            };
            if (socket.data.opcode === 4) {
                socket.identifiers.uid = socket.data.uid;
                socket.identifiers.player = {};
                socket.sendInput({left: 1, up: 1});
            };
            if (socket.data.opcode === 5) {
                console.log(lastSocket);
                lastSocket?.ws?.close?.();
                setTimeout(() => {
                    if (socket.data.opcode === 5) {
                        socket.ws.close();
                        aitoInterval();
                    };
                }, 2500);
            };
            if (socket.data.opcode === 9) {
                if (socket.data.name == "DayCycle") {
                    const isDay = socket.data.response.isDay;
                    if (!isDay) {
                        if (socket.ws.readyState == 1 && socket.verified) {
                            lastSocket = socket;
                            aitoInterval();
                        };
                    } else socket.verified = true;
                };
                if (socket.data.name == "Dead") socket.sendInput({respawn: 1});
                if (socket.data.name == "Leaderboard") {
                    socket.sendPacket(7, {nonce: 0});
                    socket.sendRpc(game.metrics.metrics);
                };
                if (socket.data.name == "PartyShareKey") socket.identifiers.psk = socket.data;
            };
        };
    };
    aitoInterval();
};

window.sscs = (selected = getClass("hud-intro-server")[0].value) => {
    const server = game.options.servers[selected];
    const hostname = server.hostname;
    const url = `wss://${hostname}:443/`;
    let hasSentData = false;

    document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div").innerHTML = `
        <strong class="hud-loading" style="display: block;margin: auto;"></strong>
        <span style="display: block;margin: 10px 0 5px;position: relative;text-align: center;opacity: 0.7;">This may take 10-20 seconds.</span>
    `;
    const socket = new Socket(url, {
        name: new Date().toLocaleString(),
    });
    socket.ws.onopen = (data) => {
        socket.ws.send(new Uint8Array([7, 0]));
    };
    socket.ws.onmessage = msg => {
        const data = decodeMessage(server, socket, msg);
        if (!data) return;
        switch(data.opcode) {
            case 4:
                if (!data.allowed) {
                    const lbData = {
                        name: "Leaderboard",
                        response: [{name: "Server full.", uid: 727, rank: 0, score: 0, wave: 0}],
                        opcode: 9
                    };
                    window.appSsrs({ population: 32, leaderboard: lbData, parties: [], server: server });
                    hasSentData = true;
                } else {
                    socket.sendPacket(3, { left: 1, up: 1, mouseMovedWhileDown: 0 });
                    socket.sendPacket(3, {space: 0});
                    socket.sendPacket(3, {space: 1});
                    socket.pop = data.players;
                    loadLbPacket(socket);
                }
                break;
            case 9:
                if (data.name === "SetPartyList") {
                    socket.parties = data.response;
                };
                if (data.name === "Leaderboard") {
                    if (socket.b4 >= 3) return socket.ws.close();
                    if (socket.b4 != 0) {
                        if (data.response.length > 1 || socket.pop == 0) {
                            window.appSsrs({ population: socket.pop, leaderboard: data, parties: socket.parties, server: server });
                            hasSentData = true;
                            return socket.ws.close();
                        } else loadLbPacket(socket);
                    };
                    socket.b4++;
                };
                break;
        };
    };
    socket.ws.onclose = () => {
        if (!hasSentData) {
            const lbData = {
                name: "Leaderboard",
                response: [{name: "Unable to access.", uid: 727, rank: 0, score: 0, wave: 0}],
                opcode: 9
            };
            window.appSsrs({ population: null, leaderboard: lbData, parties: [], server: server });
            hasSentData = true;
        };
    };
};

/* @Functions */

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

function genUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g, c => (
            c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
        ).toString(16)
    );
};

function genShortUUID() {
    return ([1e2] + -1e2 + -4e2 + -8e2 + -1e2).replace(
        /[018]/g, c => (
            c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
        ).toString(16)
    );
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
};

function garbageGenerator(garbageLength = 25) {
    let garbageCharacters = game.spam.literallyEveryUnicodeEver;
    let garbage = "";
    for (let i = 0; i < garbageLength; i++) garbage += garbageCharacters[Math.floor(Math.random() * garbageCharacters.length)];
    return garbage;
}

function isEven(number) {
    return number % 2 === 0;
};
function isEntityOccupied(x, y) {
    const cell = game.world.entityGrid.getCellIndexes(x, y, { width: 1, height: 1 });
    const entity = game.world.entityGrid.getEntitiesInCell(cell);
    return Object.keys(entity).length > 0;
};
function placeWallBlock(blockWidth, blockHeight, data) {
    const widthOffset = isEven(blockWidth) ? 0 : 1;
    const heightOffset = isEven(blockHeight) ? 0 : 1;
    for (let x = -((blockWidth - widthOffset) / 2) * 48; x <= (blockWidth - widthOffset) / 2 * 48; x += 48) {
        for (let y = -((blockHeight - heightOffset) / 2) * 48; y <= (blockHeight - heightOffset) / 2 * 48; y += 48) {
            const posX = data.x + x,
                  posY = data.y + y,
                  shouldPlace = !isEntityOccupied(posX, posY);
            shouldPlace && game.network.sendPacket(9, {name: "MakeBuilding", type: "Wall", x: posX, y: posY, yaw: 0});
        };
    };
};

function sellAllByType(type) {
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
};

function sellAll() {
    game.ui.components.BuildingOverlay.isSellingAll = true;
    const sellInterval = () => {
        if (window.sellBreak) return;
        if (Object.keys(game.ui.buildings).length > 1 && game.ui.playerPartyCanSell) {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: parseInt(Object.keys(game.ui.buildings)[1])
            });
            setTimeout(() => { sellInterval(); }, 100);
            Object.keys(game.ui.buildings).length == 2 && (game.ui.components.BuildingOverlay.isSellingAll = false);
        }
    }
    sellInterval();
}

const measureDistance = (obj1, obj2) => {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return Math.abs((Math.pow(xDif, 2)) + (Math.pow(yDif, 2)));
};

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (equal(value, searchValue)) return key;
    }
}

function equal(a, b) {
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;

        var length, i, keys;

        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;

        for (i = length; i-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        }

        for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
        }

        return true;
    }

    return a!==a && b!==b;
};

const addFunctionToElem = ({ id, option, buttonText, colors, isToggle, callback, onCallback, offCallback }) => {
    const options = game.options.options;
    colors ||= 'btn-red?btn-theme';

    getId(id).addEventListener('click', e => {
        if (isToggle === false) {
            callback?.();
        } else {
            let toggleColor = colors.split('?');
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
    });
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

    if (h == 2){
        h = 12;
    };

    if (h < 13) {
        session = "AM"
    };
    if (h > 12){
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

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

function ssMode() {
    const mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-center-right", ".hud-chat", ".hud-top-right", ".hud-center-toolbar"]);
    for (let mb of mba) {
        if (mb.classList[0] !== "hud-center-toolbar") mb.style.display = (mb.style.display === "none") ? "block" : "none";
        else mb.style.display = (mb.style.display === "none") ? "flex" : "none";
    }
    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-shield-bar"));
    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-health-bar"));
    document.querySelector(".hud-bottom-right").insertAdjacentElement("afterbegin", document.querySelector("#hud-party-icons"));
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-day-night-ticker"));
};

// @TickUpdates
game.tickUpdate = {
    playerTickUpdate: {
        resourceElem: game.ui.components.Resources,
        hasEquipedPotion: false,
        lastTickHealth: 100,
        onTick: function(player) {
            const options = game.options.options;
            /*             const playerHealth = (player.health / player.maxHealth) * 100;
            const healThreshold = getId("auto-heal-threshold").valueAsNumber || 25;
            if (options.autoHeal && playerHealth <= healThreshold) this.healPlayer(); */

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

            if (!options.frss) return;
            const resources = ["wood", "stone", "gold"];
            for (let rs of resources) {
                this.resourceElem[`${rs}Elem`].innerHTML = Math.round(player[rs]).toLocaleString();
            };
            this.resourceElem.tokensElem.innerHTML = Math.round(player.token).toLocaleString();
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
                const healThreshold = getId("auto-heal-threshold").valueAsNumber || 25;
                if (petHealth <= healThreshold) {
                    this.buyItem('PetHealthPotion');
                    this.equipItem("PetHealthPotion");
                }
            };
            this.petLevelEnum.indexOf(game.ui.components.MenuShop.shopItems[pet.model].level) > -1 && (
                game.ui.playerTick.token >= this.petTokenEnum[pet.tier - 1] && this.buyItem(pet.model, pet.tier + 1)
            )
        },
    },
};


/* @Handlers + Bindings */
game.network.sendRpc = function(data) {
    if (data.name === "MakeBuilding" && data.type === "Wall" && game.options.options.wallBlock) {
        const blockWidth = document.querySelector('#blockX').valueAsNumber;
        const blockHeight = document.querySelector('#blockY').valueAsNumber;
        placeWallBlock(blockWidth, blockHeight, data);
        return;
    };
    this.sendPacket(9, data);
};
game.network.addEntityUpdateHandler((e) => {
    const {entities} = e;
    const options = game.options.options;
    if (options.autoBow) {
        game.network.sendInput({space: 0});
        game.network.sendInput({space: 1});
    };

    if (options.autoUpgrade) {
        for (let uid in game.ui.buildings) {
            const building = game.ui.buildings[uid];
            if (building?.type !== "GoldStash" && building?.tier >= game.rebuilder.goldStash.tier) continue;
            if (building?.dead || !(uid in game.world.entities)) continue;
            game.network.sendRpc({name: "UpgradeBuilding", uid: parseInt(uid)});
        };
    };

    game.autoUpTowers.onTick(e);
    game.ahrc.onTick();
    game.rssOverhead.onTick(entities);
    game.rebuilder.onTick(entities);
    game.autoAim.onTick();
});
game.spam.fetchUnicode();
game.network.addRpcHandler("LocalBuilding", (buildings) => {
    game.rebuilder.onLocalBuilding(buildings);
});
game.ui._events.playerPetTickUpdate.push(game.tickUpdate.petTickUpdate.onTick.bind(game.tickUpdate.petTickUpdate));
game.ui._events.playerTickUpdate.push(game.tickUpdate.playerTickUpdate.onTick.bind(game.tickUpdate.playerTickUpdate));

(function MapFunctionsToElem() {
    for (let page in menu) {
        const [optionsElem, moreElem] = document.querySelectorAll("#" + page + " > div");
        for (let option in menu[page]) {
            const {name, description, more, isToggle, callback, customButtonText, onCallback, offCallback} = menu[page][option];
            const hasMore = !!more;
            const itemElem = document.createElement("div");
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
                addFunctionToElem({id: 'toggle-' + option, option, buttonText: '', colors: "underline-red?", isToggle, callback, onCallback, offCallback});
            } else if (isToggle === false) {
                addFunctionToElem({id: name, option, buttonText: '', colors: "underline-red?", isToggle, callback, onCallback, offCallback});
            };
        }
    }
})();

/* @Keybinds */
document.addEventListener('keydown', function(e) {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key == "/") {
            game.network.sendRpc({name: "EquipItem", itemName: "PetCARL", tier: game.ui.inventory?.PetCARL?.tier || 1});
        }
        if (e.key === "?") {
            ssMode();
        };
    }
});

document.addEventListener('keyup', function(e) {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key == "~") {
            game.markers.placeMarker({
                x: game.ui.playerTick.position.x,
                y: game.ui.playerTick.position.y,
                timeout: false,
                shouldIndicateIndex: true,
            });
        }
        if (e.key == '-') {
            game.options.options.getRSS = !game.options.options.getRSS;
        }
        if (e.key == "=") {
            game.world.inWorld && (
                game.ui.playerTick.gold > 100 && (
                    game.ui.inventory.Bow || (
                        game.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1}),
                        game.ui.inventory.Bow = {itemName: 'Bow', tier: 1, stacks: 1}
                    )
                ),
                game.ui.inventory.Bow && (
                    game.options.options.autoBow = !game.options.options.autoBow,
                    game.options.options.autoBow && game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: game.ui.inventory.Bow.tier})
                )
            )
        }
        if (e.key == ",") {
            getId('toggle-rebuild').click();
        }
        if (e.key == ".") {
            getId("toggle-autoUpgrade").click();
        }
        if (e.key == ";") {
            game.ui.getPlayerPetUid() && Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()});
        }
        if (e.key == "'") {
            game.ui.getPlayerPetUid() && (
                game.network.sendRpc({name: "BuyItem", itemName: "PetRevive", tier: 1}),
                game.network.sendRpc({name: "EquipItem", itemName: "PetRevive", tier: 1})
            );
        }
        if (e.key == "+") {
            window.viewMapChunks();
        }
        if (e.code == 'KeyG') {
            const wheelDisplay = getClass('interaction-wheel')[0];
            wheelDisplay.style.display = (wheelDisplay.style.display === 'block') ? 'none' : 'block';
        }
        if (e.code == 'KeyC' && !e.ctrlKey) {
            setTimeout(() => {
                document.querySelector('#joinWithPsk').style.display = 'block';
                document.querySelector('#joinWithPsk').focus();
                document.querySelector('#joinWithPsk').value = "";
            }, 100);
        }
        if (e.code == "KeyN") {
            game.zoom.zoomIn();
        }
        if (e.code == "KeyM") {
            game.zoom.zoomOut();
        }
        if (e.key == "Escape") {
            window.exitViewMapChunks();
            getClass('interaction-wheel')[0].style.display = 'none';
        }
        if (e.key == "!") {
            getId("toggle-wallBlock").click();
        }
    }
});

document.querySelector('#joinWithPsk').addEventListener('keyup', (e) => {
    if (e.key == "Enter" || e.key == "Escape") {
        e.target.style.display = 'none';
        (e.key == "Enter") && game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: e.target.value});
    };
});