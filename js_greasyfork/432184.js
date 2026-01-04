// ==UserScript==
// @name         douban_search
// @namespace    https://github.com/Kyouichirou
// @version      1.0
// @description  directly show search results of douban in current web page
// @author       HLA
// @license      MIT
// @include      *
// @grant        GM_xmlhttpRequest
// @connect      search.douban.com
// @compatiable  chrome; just test on chrome 80+
// @noframes
// @icon         https://book.douban.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/432184/douban_search.user.js
// @updateURL https://update.greasyfork.org/scripts/432184/douban_search.meta.js
// ==/UserScript==

(() => {
    /*
    @name: doubane_search_result_decrypt
    @description:
    豆瓣搜索结果整合在html文件中, 但是经过加密
    位于'window.__DATA__ ='
    modify from: https://github.com/SergioJune/Spider-Crack-JS/blob/master/douban/main.js
    修改内容:
    1. 修正大量的错误
    2. 删减冗余代码
    3. 删减/修改大部分代码, 简化部分代码
    4. 代码规范(部分改成Es6+)
    5. 使之最终可在"use strict"模式下运行
    */
    "use strict";
    const e_playload = (r) => r;
    const K = {
        read(t, e, r, n, o) {
            let i,
                a,
                s = 8 * o - n - 1,
                u = (1 << s) - 1,
                c = u >> 1,
                f = -7,
                l = r ? o - 1 : 0,
                h = r ? -1 : 1,
                p = t[e + l];
            for (
                l += h, i = p & ((1 << -f) - 1), p >>= -f, f += s;
                f > 0;
                i = 256 * i + t[e + l], l += h, f -= 8
            );
            for (
                a = i & ((1 << -f) - 1), i >>= -f, f += n;
                f > 0;
                a = 256 * a + t[e + l], l += h, f -= 8
            );
            if (0 === i) i = 1 - c;
            else {
                if (i === u) return a ? NaN : (1 / 0) * (p ? -1 : 1);
                a += Math.pow(2, n);
                i -= c;
            }
            return (p ? -1 : 1) * a * Math.pow(2, i - n);
        },
        write(t, e, r, n, o, i) {
            var a,
                s,
                u,
                c = 8 * i - o - 1,
                f = (1 << c) - 1,
                l = f >> 1,
                h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                p = n ? 0 : i - 1,
                d = n ? 1 : -1,
                m = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
            for (
                e = Math.abs(e),
                    isNaN(e) || e === 1 / 0
                        ? ((s = isNaN(e) ? 1 : 0), (a = f))
                        : ((a = Math.floor(Math.log(e) / Math.LN2)),
                          e * (u = Math.pow(2, -a)) < 1 && (a--, (u *= 2)),
                          (e += a + l >= 1 ? h / u : h * Math.pow(2, 1 - l)),
                          e * u >= 2 && (a++, (u /= 2)),
                          a + l >= f
                              ? ((s = 0), (a = f))
                              : a + l >= 1
                              ? ((s = (e * u - 1) * Math.pow(2, o)), (a += l))
                              : ((s = e * Math.pow(2, l - 1) * Math.pow(2, o)),
                                (a = 0)));
                o >= 8;
                t[r + p] = 255 & s, p += d, s /= 256, o -= 8
            );
            for (
                a = (a << o) | s, c += o;
                c > 0;
                t[r + p] = 255 & a, p += d, a /= 256, c -= 8
            );
            t[r + p - d] |= 128 * m;
        },
    };
    const t = { getStat: (e) => a(e) };
    const encry2arr_from = (t, e, r) => from_a(null, t, e, r);
    function hash(e) {
        return (
            "string" === typeof e && (e = encry2arr_from(e)),
            to_string.call((0, o_default)(e, 41405), 16).replace(/^0+/, "")
        );
    }
    function to_number() {
        return 65536 * this._a16 + this._a00;
    }
    function to_string(t) {
        t = t || 10;
        var e = new i_i(t);
        if (!gt.call(this, e)) return to_number.call(this).toString(t);
        for (
            var r = clone.call(this), n = new Array(64), o = 63;
            o >= 0 &&
            (div.call(r, e),
            (n[o] = to_number.call(r.remainder).toString(t)),
            gt.call(r, e));
            o--
        );
        n[o - 1] = to_number.call(r).toString(t);
        return n.join("");
    }
    const gt = function (t) {
        return (
            this._a48 > t._a48 ||
            (!(this._a48 < t._a48) &&
                (this._a32 > t._a32 ||
                    (!(this._a32 < t._a32) &&
                        (this._a16 > t._a16 ||
                            (!(this._a16 < t._a16) && this._a00 > t._a00)))))
        );
    };
    function div(t) {
        for (var e = clone.call(t), r = -1; !lt.call(this, e); )
            shiftLeft.call(e, 1, !0), r++;
        for (
            this.remainder = clone.call(this),
                this._a00 = 0,
                this._a16 = 0,
                this._a32 = 0,
                this._a48 = 0;
            r >= 0;
            r--
        )
            shiftRight.call(e, 1),
                lt.call(this.remainder, e) ||
                    (subtract(this.remainder, e),
                    r > 47
                        ? (this._a48 |= 1 << (r - 48))
                        : r > 31
                        ? (this._a32 |= 1 << (r - 32))
                        : r > 15
                        ? (this._a16 |= 1 << (r - 16))
                        : (this._a00 |= 1 << r));
        return this;
    }
    function lt(t) {
        return (
            this._a48 < t._a48 ||
            (!(this._a48 > t._a48) &&
                (this._a32 < t._a32 ||
                    (!(this._a32 > t._a32) &&
                        (this._a16 < t._a16 ||
                            (!(this._a16 > t._a16) && this._a00 < t._a00)))))
        );
    }
    function shiftLeft(t, e) {
        return (
            (t %= 64),
            t > 47
                ? ((this._a48 = this._a00 << (t - 48)),
                  (this._a32 = 0),
                  (this._a16 = 0),
                  (this._a00 = 0))
                : t > 31
                ? ((t -= 32),
                  (this._a48 = (this._a16 << t) | (this._a00 >> (16 - t))),
                  (this._a32 = (this._a00 << t) & 65535),
                  (this._a16 = 0),
                  (this._a00 = 0))
                : t > 15
                ? ((t -= 16),
                  (this._a48 = (this._a32 << t) | (this._a16 >> (16 - t))),
                  (this._a32 =
                      65535 & ((this._a16 << t) | (this._a00 >> (16 - t)))),
                  (this._a16 = (this._a00 << t) & 65535),
                  (this._a00 = 0))
                : ((this._a48 = (this._a48 << t) | (this._a32 >> (16 - t))),
                  (this._a32 =
                      65535 & ((this._a32 << t) | (this._a16 >> (16 - t)))),
                  (this._a16 =
                      65535 & ((this._a16 << t) | (this._a00 >> (16 - t)))),
                  (this._a00 = (this._a00 << t) & 65535)),
            e || (this._a48 &= 65535),
            this
        );
    }
    const Ut = {
        $UID: "j",
        $defaultRootUID: 4,
        $keys: "z",
        $vals: "k",
        crypto: {
            decrypt: function n(t, e) {
                return r_decrypt(t, e);
            },
            encrypt: function r(e) {
                var r =
                    arguments.length > 1 && undefined !== arguments[1]
                        ? arguments[1]
                        : "hjasbdn2ih823rgwudsde7e2dhsdhas";
                "string" === typeof r &&
                    (r = [].map.call(r, (t) => t.charCodeAt(0)));
                for (
                    var n, o = [], i = 0, a = new t(e.length), s = 0;
                    s < 256;
                    s++
                )
                    o[s] = s;
                for (s = 0; s < 256; s++)
                    (i = (i + o[s] + r[s % r.length]) % 256),
                        (n = o[s]),
                        (o[s] = o[i]),
                        (o[i] = n);
                (s = 0), (i = 0);
                for (var u = 0; u < e.length; u++)
                    (s = (s + 1) % 256),
                        (i = (i + o[s]) % 256),
                        (n = o[s]),
                        (o[s] = o[i]),
                        (o[i] = n),
                        (a[u] = e[u] ^ o[(o[s] + o[i]) % 256]);
                return a;
            },
        },
        getRealUID: (t) => (t > 1 ? (t < 7 ? 5 : t < 12 ? -5 : 0) : 0) + t,
        getType: function o(t) {
            return Object.prototype.toString.call(t).slice(8, -1);
        },
    };
    const from_a = (t, e, r) => ("string" === typeof e ? f(t, e, r) : null);
    const f = (t, e, r) => {
        let n = y(e, r);
        t = o_19(t, n);
        let a = write(t, e, r);
        a !== n && (t = t.slice(0, a));
        return t;
    };
    const y = (t, e) => {
        "string" !== typeof t && (t += "");
        let r = t.length;
        if (0 === r) return 0;
        let n = false;
        while (true) {
            switch (e) {
                case "ascii":
                case "latin1":
                case "binary":
                    return r;
                case "utf8":
                case "utf-8":
                case undefined:
                    return Y(t).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * r;
                case "hex":
                    return r >>> 1;
                case "base64":
                    return V(t).length;
                default:
                    if (n) return Y(t).length;
                    e = ("" + e).toLowerCase();
                    n = true;
            }
        }
    };
    function toByteArray(t) {
        // 13  30  32
        let f = {
            43: 62,
            45: 62,
            47: 63,
            48: 52,
            49: 53,
            50: 54,
            51: 55,
            52: 56,
            53: 57,
            54: 58,
            55: 59,
            56: 60,
            57: 61,
            65: 0,
            66: 1,
            67: 2,
            68: 3,
            69: 4,
            70: 5,
            71: 6,
            72: 7,
            73: 8,
            74: 9,
            75: 10,
            76: 11,
            77: 12,
            78: 13,
            79: 14,
            80: 15,
            81: 16,
            82: 17,
            83: 18,
            84: 19,
            85: 20,
            86: 21,
            87: 22,
            88: 23,
            89: 24,
            90: 25,
            95: 63,
            97: 26,
            98: 27,
            99: 28,
            100: 29,
            101: 30,
            102: 31,
            103: 32,
            104: 33,
            105: 34,
            106: 35,
            107: 36,
            108: 37,
            109: 38,
            110: 39,
            111: 40,
            112: 41,
            113: 42,
            114: 43,
            115: 44,
            116: 45,
            117: 46,
            118: 47,
            119: 48,
            120: 49,
            121: 50,
            122: 51,
        };
        let e,
            r,
            o,
            i,
            a,
            s,
            u = t.length;
        (a = n_is_4(t)),
            (s = new Uint8Array((3 * u) / 4 - a)),
            (o = a > 0 ? u - 4 : u);
        let c = 0;
        for (e = 0, r = 0; e < o; e += 4, r += 3)
            (i =
                (f[t.charCodeAt(e)] << 18) |
                (f[t.charCodeAt(e + 1)] << 12) |
                (f[t.charCodeAt(e + 2)] << 6) |
                f[t.charCodeAt(e + 3)]),
                (s[c++] = (i >> 16) & 255),
                (s[c++] = (i >> 8) & 255),
                (s[c++] = 255 & i);
        return (
            2 === a
                ? ((i =
                      (f[t.charCodeAt(e)] << 2) |
                      (f[t.charCodeAt(e + 1)] >> 4)),
                  (s[c++] = 255 & i))
                : 1 === a &&
                  ((i =
                      (f[t.charCodeAt(e)] << 10) |
                      (f[t.charCodeAt(e + 1)] << 4) |
                      (f[t.charCodeAt(e + 2)] >> 2)),
                  (s[c++] = (i >> 8) & 255),
                  (s[c++] = 255 & i)),
            s
        );
    }
    const z = (t) => (t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, ""));
    const V = (t) => toByteArray(q(t));
    const o_19 = (t, e) => (t = new Uint8Array(e));
    const q = (t) => {
        t = z(t).replace(/[^+\/0-9A-Za-z-_]/g, "");
        if (t.length < 2) return "";
        while (t.length % 4 !== 0) t += "=";
        return t;
    };
    function n_is_4(t) {
        const e = t.length;
        if (e % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
        return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0;
    }
    function Y(t, e) {
        e = e || 1 / 0;
        for (var r, n = t.length, o = null, i = [], a = 0; a < n; ++a) {
            if ((r = t.charCodeAt(a)) > 55295 && r < 57344) {
                if (!o) {
                    if (r > 56319) {
                        (e -= 3) > -1 && i.push(239, 191, 189);
                        continue;
                    }
                    if (a + 1 === n) {
                        (e -= 3) > -1 && i.push(239, 191, 189);
                        continue;
                    }
                    o = r;
                    continue;
                }
                if (r < 56320) {
                    (e -= 3) > -1 && i.push(239, 191, 189), (o = r);
                    continue;
                }
                r = 65536 + (((o - 55296) << 10) | (r - 56320));
            } else o && (e -= 3) > -1 && i.push(239, 191, 189);
            if (((o = null), r < 128)) {
                if ((e -= 1) < 0) break;
                i.push(r);
            } else if (r < 2048) {
                if ((e -= 2) < 0) break;
                i.push((r >> 6) | 192, (63 & r) | 128);
            } else if (r < 65536) {
                if ((e -= 3) < 0) break;
                i.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
            } else {
                if (!(r < 1114112)) throw new Error("Invalid code point");
                if ((e -= 4) < 0) break;
                i.push(
                    (r >> 18) | 240,
                    ((r >> 12) & 63) | 128,
                    ((r >> 6) & 63) | 128,
                    (63 & r) | 128
                );
            }
        }
        return i;
    }
    const write_E = (t, e, r, n) => X(Y(e, t.length - r), t, r, n);
    function write(k, t, e, r, n) {
        // 23  37  63
        if (undefined === e) {
            n = "utf8";
            r = k.length;
            e = 0;
        } else if (undefined === r && "string" === typeof e)
            (n = e), (r = k.length), (e = 0);
        else {
            if (!isFinite(e))
                throw new Error(
                    "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                );
            (e |= 0),
                isFinite(r)
                    ? ((r |= 0), undefined === n && (n = "utf8"))
                    : ((n = r), (r = undefined));
        }
        let o = k.length - e;
        if (
            ((undefined === r || r > o) && (r = o),
            (t.length > 0 && (r < 0 || e < 0)) || e > 0)
        )
            throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");
        for (var i = !1; ; )
            switch (n) {
                case "hex":
                    return _(k, t, e, r);
                case "utf8":
                case "utf-8":
                    return write_E(k, t, e, r);
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                    return S_24(k, t, e, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                default:
                    if (i) throw new TypeError("Unknown encoding: " + n);
                    (n = ("" + n).toLowerCase()), (i = !0);
            }
    }
    const S_24 = (t, e, r, n) => X(V(e), t, r, n);
    function X(t, e, r, n) {
        for (var o = 0; o < n && !(o + r >= e.length || o >= t.length); ++o)
            e[o + r] = t[o];
        return o;
    }
    function a_slice(k, t, e) {
        //~~ double NOT按位运算符。用它代替Math.floor()，因为它更快
        let r = k.length;
        (t = ~~t),
            (e = undefined === e ? r : ~~e),
            t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
            e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
            e < t && (e = t);
        const n = k.subarray(t, e);
        return n;
    }
    const c = (t, e) => (t = o_19(t, e < 0 ? 0 : e));
    const allocUnsafe = (t) => c(null, t);
    function a_68_copy(k, t, e, r, n) {
        if (
            (r || (r = 0),
            n || 0 === n || (n = k.length),
            e >= t.length && (e = t.length),
            e || (e = 0),
            n > 0 && n < r && (n = r),
            n === r)
        )
            return 0;
        if (0 === t.length || 0 === k.length) return 0;
        if (e < 0) throw new RangeError("targetStart out of bounds");
        if (r < 0 || r >= k.length)
            throw new RangeError("sourceStart out of bounds");
        if (n < 0) throw new RangeError("sourceEnd out of bounds");
        n > k.length && (n = k.length),
            t.length - e < n - r && (n = t.length - e + r);
        var o,
            a = n - r;
        if (k === t && r < e && e < n)
            for (o = a - 1; o >= 0; --o) t[o + e] = k[o + r];
        else if (a < 1e3 || !true) for (o = 0; o < a; ++o) t[o + e] = k[o + r];
        else Uint8Array.prototype.set.call(t, k.subarray(r, r + a), e);
        return a;
    }
    function concat(t, e) {
        var r;
        if (undefined === e)
            for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
        var n = allocUnsafe(e),
            o = 0;
        for (r = 0; r < t.length; ++r) {
            var a = t[r];
            a_68_copy(a, n, o), (o += a.length);
        }
        return n;
    }
    function a(e) {
        return (
            "string" === typeof e && (e = t.from(e)),
            (0, null)(e, 41405).toString(16).replace(/^0+/, "")
        );
    }
    function i_update(t, e, r) {
        if ("number" === typeof t) {
            if ("string" === typeof e)
                throw new Error(
                    "If encoding is specified then the first argument must be a string"
                );
            return c(this, t);
        }
        return a_g_Bt(this, t, e, r);
    }
    function update(kkk, t) {
        var r,
            o = "string" === typeof t;
        o && ((t = null), (o = !1), (r = !0)),
            "undefined" != typeof ArrayBuffer &&
                t instanceof ArrayBuffer &&
                ((r = !0), (t = new Uint8Array(t)));
        let c = t.length;
        if (0 == c) return kkk;
        if (
            ((kkk.total_len += c),
            0 == kkk.memsize &&
                (kkk.memory = o
                    ? ""
                    : r
                    ? new Uint8Array(32)
                    : new i_update(32)),
            kkk.memsize + c < 32)
        )
            return (
                o
                    ? (kkk.memory += t)
                    : r
                    ? kkk.memory.set(t.subarray(0, c), kkk.memsize)
                    : a_68_copy(t, kkk.memory, kkk.memsize, 0, c),
                (kkk.memsize += c),
                kkk
            );
    }
    function digest(kkk) {
        // 90
        var a = i_i, // 这些加密数据有用
            s = a("11400714785074694791"),
            u = a("14029467366897019727"),
            c = a("1609587929392839161"),
            f = a("9650029242287828579"),
            l = a("2870177450012600261");

        var t,
            e,
            r = kkk.memory,
            n = "string" === typeof r,
            o = 0,
            i = kkk.memsize,
            h = new i_i();
        for (
            kkk.total_len >= 32
                ? ((t = kkk.v1.clone().rotl(1)),
                  t.add(kkk.v2.clone().rotl(7)),
                  t.add(kkk.v3.clone().rotl(12)),
                  t.add(kkk.v4.clone().rotl(18)),
                  t.xor(kkk.v1.multiply(u).rotl(31).multiply(s)),
                  t.multiply(s).add(f),
                  t.xor(kkk.v2.multiply(u).rotl(31).multiply(s)),
                  t.multiply(s).add(f),
                  t.xor(kkk.v3.multiply(u).rotl(31).multiply(s)),
                  t.multiply(s).add(f),
                  t.xor(kkk.v4.multiply(u).rotl(31).multiply(s)),
                  t.multiply(s).add(f))
                : (t = add(kkk.seed.clone(), l)),
                add(t, s_this(kkk.total_len, h));
            o <= i - 8;

        )
            n
                ? a_a.call(
                      h,
                      (r.charCodeAt(o + 1) << 8) | r.charCodeAt(o),
                      (r.charCodeAt(o + 3) << 8) | r.charCodeAt(o + 2),
                      (r.charCodeAt(o + 5) << 8) | r.charCodeAt(o + 4),
                      (r.charCodeAt(o + 7) << 8) | r.charCodeAt(o + 6)
                  )
                : a_a.call(
                      h,
                      (r[o + 1] << 8) | r[o],
                      (r[o + 3] << 8) | r[o + 2],
                      (r[o + 5] << 8) | r[o + 4],
                      (r[o + 7] << 8) | r[o + 6]
                  ),
                multiply(rotl.call(multiply(h, u), 31), s),
                add(multiply(rotl.call(xor.call(t, h), 27), s), f),
                (o += 8);
        for (
            o + 4 <= i &&
            (n
                ? h.fromBits(
                      (r.charCodeAt(o + 1) << 8) | r.charCodeAt(o),
                      (r.charCodeAt(o + 3) << 8) | r.charCodeAt(o + 2),
                      0,
                      0
                  )
                : h.fromBits(
                      (r[o + 1] << 8) | r[o],
                      (r[o + 3] << 8) | r[o + 2],
                      0,
                      0
                  ),
            t.xor(multiply(h, s)).rotl(23).multiply(u).add(c),
            (o += 4));
            o < i;

        )
            h.fromBits(n ? r.charCodeAt(o++) : r[o++], 0, 0, 0),
                t.xor(h.multiply(l)).rotl(11).multiply(s);
        return (
            (e = shiftRight.call(clone.call(t), 33)),
            multiply(xor.call(t, e), u),
            (e = shiftRight.call(clone.call(t), 29)),
            multiply(xor.call(t, e), c),
            (e = shiftRight.call(clone.call(t), 32)),
            xor.call(t, e),
            i_this.call(kkk, kkk.seed),
            t
        );
    }

    function clone() {
        return new i_i(this._a00, this._a16, this._a32, this._a48);
    }
    function shiftRight(t) {
        return (
            (t %= 64),
            t > 47
                ? ((this._a00 = this._a48 >> (t - 48)),
                  (this._a16 = 0),
                  (this._a32 = 0),
                  (this._a48 = 0))
                : t > 31
                ? ((t -= 32),
                  (this._a00 =
                      65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                  (this._a16 = (this._a48 >> t) & 65535),
                  (this._a32 = 0),
                  (this._a48 = 0))
                : t > 15
                ? ((t -= 16),
                  (this._a00 =
                      65535 & ((this._a16 >> t) | (this._a32 << (16 - t)))),
                  (this._a16 =
                      65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                  (this._a32 = (this._a48 >> t) & 65535),
                  (this._a48 = 0))
                : ((this._a00 =
                      65535 & ((this._a00 >> t) | (this._a16 << (16 - t)))),
                  (this._a16 =
                      65535 & ((this._a16 >> t) | (this._a32 << (16 - t)))),
                  (this._a32 =
                      65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                  (this._a48 = (this._a48 >> t) & 65535)),
            this
        );
    }
    function o_default() {
        return 2 === arguments.length
            ? digest(update(new o_default(arguments[1]), arguments[0]))
            : this instanceof o_default
            ? void i_this.call(this, arguments[0])
            : null;
    }

    function i_this(t) {
        var s = {
            remainder: null,
            _a00: 51847,
            _a16: 34283,
            _a32: 31153,
            _a48: 40503,
            clone: function () {
                return new i_i(this._a00, this._a16, this._a32, this._a48);
            },
        };
        var u = {
            remainder: null,
            _a00: 60239,
            _a16: 10196,
            _a32: 44605,
            _a48: 49842,
        };
        return (
            (this.seed = new i_a(t)),
            (this.v1 = add(add(this.seed.clone(), s), u)),
            (this.v2 = add(this.seed.clone(), u)),
            (this.v3 = this.seed.clone()),
            (this.v4 = subtract(this.seed.clone(), s)),
            (this.total_len = 0),
            (this.memsize = 0),
            (this.memory = null),
            this
        );
    }
    const subtract = (a, t) => add(a, negate(clone.call(t)));
    function negate(a) {
        var t = 1 + (65535 & ~a._a00);
        return (
            (a._a00 = 65535 & t),
            (t = (65535 & ~a._a16) + (t >>> 16)),
            (a._a16 = 65535 & t),
            (t = (65535 & ~a._a32) + (t >>> 16)),
            (a._a32 = 65535 & t),
            (a._a48 = (~a._a48 + (t >>> 16)) & 65535),
            a
        );
    }
    function i_i(t, e, r, n) {
        return this instanceof i_i
            ? ((this.remainder = null),
              "string" === typeof t
                  ? i_u.call(this, t, e)
                  : undefined === e
                  ? s_this.call(this, t)
                  : void a_a.apply(this, arguments))
            : new i_i(t, e, r, n);
    }
    function i_u(t, e) {
        (e = e || 10),
            (this._a00 = 0),
            (this._a16 = 0),
            (this._a32 = 0),
            (this._a48 = 0);
        for (
            var r = c[e] || new i_i(Math.pow(e, 5)), n = 0, o = t.length;
            n < o;
            n += 5
        ) {
            var a = Math.min(5, o - n),
                s = parseInt(t.slice(n, n + a), e);
            add(
                multiply(this, a < 5 ? new i_i(Math.pow(e, a)) : r),
                new i_i(s)
            );
        }
        return this;
    }
    function multiply(k, t) {
        var e = k._a00,
            r = k._a16,
            n = k._a32,
            o = k._a48,
            i = t._a00,
            a = t._a16,
            s = t._a32,
            u = t._a48,
            c = e * i,
            f = c >>> 16;
        f += e * a;
        var l = f >>> 16;
        (f &= 65535), (f += r * i), (l += f >>> 16), (l += e * s);
        var h = l >>> 16;
        return (
            (l &= 65535),
            (l += r * a),
            (h += l >>> 16),
            (l &= 65535),
            (l += n * i),
            (h += l >>> 16),
            (h += e * u),
            (h &= 65535),
            (h += r * s),
            (h &= 65535),
            (h += n * a),
            (h &= 65535),
            (h += o * i),
            (k._a00 = 65535 & c),
            (k._a16 = 65535 & f),
            (k._a32 = 65535 & l),
            (k._a48 = 65535 & h),
            k
        );
    }
    function i_a(t) {
        // 73  75  78  80
        return (
            (this.remainder = null),
            (this._a00 = 65535 & t),
            (this._a16 = t >>> 16),
            (this._a32 = 0),
            (this._a48 = 0),
            (this.clone = function () {
                // 77  81
                return new i_i(this._a00, this._a16, this._a32, this._a48);
            }),
            this
        );
    }
    function s_this(t, k) {
        // 74
        if (k)
            return (
                (k._a00 = 65535 & t),
                (k._a16 = t >>> 16),
                (k._a32 = 0),
                (k._a48 = 0),
                k
            );
        return (
            (this._a00 = 65535 & t),
            (this._a16 = t >>> 16),
            (this._a32 = 0),
            (this._a48 = 0),
            this
        );
    }
    function rotl(t) {
        if (0 === (t %= 64)) return this;
        if (t > 31) {
            var e = this._a00;
            if (
                ((this._a00 = this._a32),
                (this._a32 = e),
                (e = this._a48),
                (this._a48 = this._a16),
                (this._a16 = e),
                32 == t)
            )
                return this;
            t -= 32;
        }
        var r = (this._a48 << 16) | this._a32,
            n = (this._a16 << 16) | this._a00,
            o = (r << t) | (n >>> (32 - t)),
            i = (n << t) | (r >>> (32 - t));
        return (
            (this._a00 = 65535 & i),
            (this._a16 = i >>> 16),
            (this._a32 = 65535 & o),
            (this._a48 = o >>> 16),
            this
        );
    }
    function xor(t) {
        return (
            (this._a00 ^= t._a00),
            (this._a16 ^= t._a16),
            (this._a32 ^= t._a32),
            (this._a48 ^= t._a48),
            this
        );
    }
    function a_a(t, e, r, n) {
        return undefined === r
            ? ((this._a00 = 65535 & t),
              (this._a16 = t >>> 16),
              (this._a32 = 65535 & e),
              (this._a48 = e >>> 16),
              this)
            : ((this._a00 = 0 | t),
              (this._a16 = 0 | e),
              (this._a32 = 0 | r),
              (this._a48 = 0 | n),
              this);
    }
    function add(a, t) {
        // 83  85
        var e = a._a00 + t._a00,
            r = e >>> 16;
        r += a._a16 + t._a16;
        var n = r >>> 16;
        n += a._a32 + t._a32;
        var o = n >>> 16;
        return (
            (o += a._a48 + t._a48),
            (a._a00 = 65535 & e),
            (a._a16 = 65535 & r),
            (a._a32 = 65535 & n),
            (a._a48 = 65535 & o),
            a
        );
    }
    function r_decrypt(e) {
        var r =
            arguments.length > 1 && undefined !== arguments[1]
                ? arguments[1]
                : "hjasbdn2ih823rgwudsde7e2dhsdhas";
        "string" === typeof r &&
            (r = [].map.call(r, function (t) {
                return t.charCodeAt(0);
            }));
        for (
            var n, o = [], i = 0, a = new i_update(e.length), s = 0;
            s < 256;
            s++
        )
            o[s] = s;
        for (s = 0; s < 256; s++)
            (i = (i + o[s] + r[s % r.length]) % 256),
                (n = o[s]),
                (o[s] = o[i]),
                (o[i] = n);
        (s = 0), (i = 0);
        for (var u = 0; u < e.length; u++)
            (s = (s + 1) % 256),
                (i = (i + o[s]) % 256),
                (n = o[s]),
                (o[s] = o[i]),
                (o[i] = n),
                (a[u] = e[u] ^ o[(o[s] + o[i]) % 256]);
        return a;
    }
    function Bt(t) {
        var e = {};
        (e.maxObjectSize = 1e8),
            (e.maxObjectCount = 32768),
            (e.parseFile = function (t, e) {
                function r(t) {
                    var r,
                        n = null;
                    try {
                        r = null;
                    } catch (t) {
                        n = t;
                    }
                    e(n, r);
                }
            });
        function r(e) {
            var r = x[e],
                n = t[r],
                o = (240 & n) >> 4,
                i = 15 & n,
                a = {
                    offset: r,
                    type: n,
                    objType: o,
                    objInfo: i,
                    tableOffset: e,
                };
            switch (o) {
                case 0:
                    return f(a);
                case 1:
                    return h(a);
                case 8:
                    return null;
                case 2:
                    return d(a);
                case 3:
                    return m(a);
                case 6:
                    return y(a);
                case 4:
                    return g(a);
                case 5:
                    return g(a, !0);
                case 10:
                    return v(a);
                case 13:
                    return b(a);
                default:
                    throw new Error(2, o.toString(16));
            }
        }
        function f(t) {
            let e = t.objInfo,
                r = t.objType;
            switch (e) {
                case 0:
                    return null;
                case 8:
                    return !1;
                case 9:
                    return !0;
                case 15:
                    return null;
                default:
                    throw new Error(3, r.toString(16));
            }
        }
        function h(r) {
            var n = r.offset,
                o = r.objInfo,
                i = Math.pow(2, o);
            if (i < e.maxObjectSize)
                return a_h_Bt(a_slice(t, n + 1, n + 1 + i));
            throw new Error("4 " + i + " " + e.maxObjectSize);
        }
        function d(r) {
            var n = r.offset,
                o = r.objInfo,
                i = Math.pow(2, o);
            if (!(i < e.maxObjectSize))
                throw new Error("4 " + i + " " + e.maxObjectSize);
            var a = t.slice(n + 1, n + 1 + i);
            return 4 === i
                ? readFloatBE.call(a, 0)
                : 8 === i
                ? readDoubleBE.call(a, 0)
                : undefined;
        }
        function m(e) {
            var r = e.offset,
                n = e.objInfo;
            3 != n && console.error(5, n);
            var o = t.slice(r + 1, r + 9);
            return new Date(9783072e5 + 1e3 * o.readDoubleBE(0));
        }
        function y(r) {
            var n = r.offset,
                o = r.objInfo,
                a = 1,
                s = o;
            if (15 == o) {
                var u = t[n + 1],
                    c = (240 & u) / 16;
                1 != c && console.error(6, c);
                var f = 15 & u,
                    l = Math.pow(2, f);
                (a = 2 + l), (s = null);
            }
            if (s < e.maxObjectSize) return t.slice(n + a, n + a + s);
            throw new Error("4 " + s + " " + e.maxObjectSize);
        }
        function g(r, o) {
            var a = r.offset,
                s = r.objInfo;
            o = o || 0;
            var u = "utf8",
                f = s,
                l = 1;
            if (15 == s) {
                var h = t[a + 1],
                    p = (240 & h) / 16;
                if (1 != p) throw new Error("7 " + p);
                var d = 15 & h,
                    m = Math.pow(2, d);
                (l = 2 + m), (f = i_Bt(a_slice(t, a + 2, a + 2 + m)));
            }
            if ((f *= o + 1) < e.maxObjectSize) {
                var y = new i_update(a_slice(t, a + l, a + l + f));
                return (
                    o && ((y = c_g_Bt(y)), (u = "ucs2")),
                    to_string_g_Bt.call(y, u)
                );
            }
            throw new Error("4 " + f + " " + e.maxObjectSize);
        }
        function v(n) {
            var o = n.offset,
                a = n.objInfo,
                s = a,
                u = 1;
            if (15 == a) {
                var c = t[o + 1],
                    f = (240 & c) / 16;
                var l = 15 & c,
                    h = Math.pow(2, l);
                (u = 2 + h), (s = i_Bt(a_slice(t, o + 2, o + 2 + h)));
            }
            for (var p = [], d = 0; d < s; d++) {
                var m = i_Bt(a_slice(t, o + u + d * E, o + u + (d + 1) * E));
                p[d] = r(m);
            }
            return p;
        }
        function b(n) {
            var o = n.offset,
                a = n.objInfo,
                s = (n.tableOffset, a),
                u = 1;
            if (15 == a) {
                var c = t[o + 1],
                    f = (240 & c) / 16;
                1 != f && console.error(9, f);
                var l = 15 & c,
                    h = Math.pow(2, l);
                (u = 2 + h), (s = null);
            }
            if (2 * s * E > e.maxObjectSize) throw new Error(4);
            for (var p = {}, d = 0; d < s; d++) {
                var m = i_Bt(a_slice(t, o + u + d * E, o + u + (d + 1) * E)),
                    y = i_Bt(
                        a_slice(
                            t,
                            o + u + s * E + d * E,
                            o + u + s * E + (d + 1) * E
                        )
                    ),
                    g = r(m),
                    v = r(y);
                p[g] = v;
            }
            return p;
        }
        var w = a_slice(t, t.length - 32, t.length),
            _ = readUInt8.call(w, 6),
            E = readUInt8.call(w, 7),
            A = s_Bt(w, 8),
            C = s_Bt(w, 16),
            S = s_Bt(w, 24);
        for (var x = [], O = 0; O < A; O++) {
            var T = a_slice(t, S + O * _, S + (O + 1) * _);
            x[O] = i_Bt(T, 0);
        }
        return r(C);
    }
    function readUInt8(t) {
        return this[t];
    }
    function s_Bt(t, e) {
        return readUInt32BE.call(a_slice(t, e, e + 8), 4, 8);
    }
    function readUInt32BE(t) {
        return (
            16777216 * this[t] +
            ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
        );
    }
    function i_Bt(t, e) {
        e = e || 0;
        for (var r = 0, n = e; n < t.length; n++) (r <<= 8), (r |= 255 & t[n]);
        return r;
    }
    function a_g_Bt(t, e, r, n) {
        if ("number" === typeof e)
            throw new TypeError('"value" argument must not be a number');
        return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer
            ? null
            : "string" === typeof e
            ? f(t, e, r)
            : p_a(t, e);
    }
    function p_a(t, e) {
        let r = e.length;
        return (
            (t = o_19(t, r)), 0 === t.length ? t : (a_68_copy(e, t, 0, 0, r), t)
        );
    }
    function c_g_Bt(t) {
        for (var e = t.length, r = 0; r < e; r += 2) {
            var n = t[r];
            (t[r] = t[r + 1]), (t[r + 1] = n);
        }
        return t;
    }
    function to_string_g_Bt() {
        const t = this.length;
        return 0 === t
            ? ""
            : 0 === arguments.length
            ? null
            : g_to_string.apply(this, arguments);
    }
    function g_to_string(t, e, r) {
        var n = !1;
        if (((undefined === e || e < 0) && (e = 0), e > this.length)) return "";
        if (((undefined === r || r > this.length) && (r = this.length), r <= 0))
            return "";
        if (((r >>>= 0), (e >>>= 0), r <= e)) return "";
        for (t || (t = "utf8"); ; )
            switch (t) {
                case "hex":
                case "utf8":
                case "utf-8":
                    return T_g(this, e, r);
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return j_g(this, e, r);
                default:
                    if (n) throw new TypeError("Unknown encoding: " + t);
                    (t = (t + "").toLowerCase()), (n = !0);
            }
    }

    function j_g(t, e, r) {
        for (var n = a_slice(t, e, r), o = "", i = 0; i < n.length; i += 2)
            o += String.fromCharCode(n[i] + 256 * n[i + 1]);
        return o;
    }
    function T_g(t, e, r) {
        r = Math.min(t.length, r);
        for (var n = [], o = e; o < r; ) {
            var i = t[o],
                a = null,
                s = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
            if (o + s <= r) {
                var u, c, f, l;
                switch (s) {
                    case 1:
                        i < 128 && (a = i);
                        break;
                    case 2:
                        (u = t[o + 1]),
                            128 === (192 & u) &&
                                (l = ((31 & i) << 6) | (63 & u)) > 127 &&
                                (a = l);
                        break;
                    case 3:
                        (u = t[o + 1]),
                            (c = t[o + 2]),
                            128 === (192 & u) &&
                                128 === (192 & c) &&
                                (l =
                                    ((15 & i) << 12) |
                                    ((63 & u) << 6) |
                                    (63 & c)) > 2047 &&
                                (l < 55296 || l > 57343) &&
                                (a = l);
                        break;
                    case 4:
                        (u = t[o + 1]),
                            (c = t[o + 2]),
                            (f = t[o + 3]),
                            128 === (192 & u) &&
                                128 === (192 & c) &&
                                128 === (192 & f) &&
                                (l =
                                    ((15 & i) << 18) |
                                    ((63 & u) << 12) |
                                    ((63 & c) << 6) |
                                    (63 & f)) > 65535 &&
                                l < 1114112 &&
                                (a = l);
                }
            }
            null === a
                ? ((a = 65533), (s = 1))
                : a > 65535 &&
                  ((a -= 65536),
                  n.push(((a >>> 10) & 1023) | 55296),
                  (a = 56320 | (1023 & a))),
                n.push(a),
                (o += s);
        }
        return P_T(n);
    }
    function P_T(t) {
        const e = t.length;
        if (e < 4097) return String.fromCharCode.apply(String, t);
        for (var r = "", n = 0; n < e; )
            r += String.fromCharCode.apply(String, a_slice(t, n, (n += 4096)));
        return r;
    }
    const a_h_Bt = (t, e, r) => (
        (e = e || 0), (r = r || t.length - e), readIntBE.call(t, e, r)
    );
    function readIntBE(t, e, r) {
        (t |= 0), (e |= 0), r || undefined;
        for (var n = e, o = 1, i = this[t + --n]; n > 0 && (o *= 256); )
            i += this[t + --n] * o;
        return (o *= 128), i >= o && (i -= Math.pow(2, 8 * e)), i;
    }
    function readFloatBE(t, e) {
        return e || undefined, K.read(this, t, !1, 23, 4);
    }
    function readDoubleBE(t, e) {
        return e || undefined, K.read(this, t, !1, 52, 8);
    }
    function kt(t) {
        var i = Ut;
        function n(e) {
            if (1 === Object.keys(e).length && undefined !== e[i.$UID])
                return o(e[i.$UID]);
            if (i.$vals in e) {
                var t = e[i.$keys],
                    n = e[i.$vals];
                return t
                    ? t.reduce(function (e, t, i) {
                          return (e[o(t)] = r(n[i])), e;
                      }, {})
                    : n.map(function (e) {
                          return o(e);
                      });
            }
            return Object.keys(e).reduce(function (t, n) {
                var o = e[n];
                return (t[n] = r(o)), t;
            }, {});
        }
        function r(t) {
            return "Object" === (0, i.getType)(t)
                ? n(t)
                : "Array" === (0, i.getType)(t)
                ? t.map((e) => r(e))
                : t instanceof i_update
                ? (0 === t[t.length - 1] && (t = t.slice(0, t.length - 1)),
                  t.toString())
                : t;
        }
        const o = (e) => r(t[(0, i.getRealUID)(e)]);
        return o(
            arguments.length > 1 && undefined !== arguments[1]
                ? arguments[1]
                : (0, i.getRealUID)(i.$defaultRootUID)
        );
    }
    const n_n = (r) => e_e(t)(r_r)(r);
    function e_e(e) {
        return function (e) {
            return function (t) {
                var n = Object.keys(t)[0],
                    r = Ut.crypto.decrypt(t[n], n);
                return e(r);
            };
        };
    }
    function e_e_decrypt(e) {
        return function (e) {
            return function (t) {
                return e(Bt(t));
            };
        };
    }
    function playload(e) {
        return function (e) {
            return function (t) {
                return e({
                    type: "INIT",
                    payload: kt(t),
                });
            };
        };
    }
    const r_r = (r) => e_e_decrypt(t)(e_e_decrypt_n)(r);
    const e_e_decrypt_n = (r) => playload(t)(e_playload)(r);
    //interface
    const decrypt = (data) => {
        try {
            let a = encry2arr_from(data, "base64"), // 0
                s = Math.max(Math.floor((a.length - 32) / 3), 0), // 40
                u = a_slice(a, s, s + 16); // 41
            a = concat([a_slice(a, 0, s), a_slice(a, s + 16)]); // 43  45  47
            let c_data = hash(concat([u, encry2arr_from("")])); // 49  67  69
            let l = {};
            l[c_data] = a;
            return n_n(((l = {}), (l[c_data] = a), l));
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    const createPannel = {
        frame(lists) {
            const html = `
                <div
                    id="settingLayerMask"
                >
                    <style>
                        #settingLayerMask {
                            display: flex;
                            align-items: stretch;
                            justify-content: center;
                            position: fixed;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            background-color: rgba(0, 0, 0, 0.5);
                            z-index: 200000000;
                            overflow: auto;
                            font-family: arial, sans-serif;
                            min-height: 100%;
                            font-size: 16px;
                            transition: 0.5s;
                            padding-bottom: 80px;
                            box-sizing: border-box;
                        }
                        #settingLayer {
                            box-sizing: unset !important;
                            height: 560px;
                            display: flex;
                            flex-wrap: wrap;
                            padding: 20px;
                            margin: 0px 25px 50px 5px;
                            background-color: #fff;
                            border-radius: 4px;
                            position: absolute;
                            min-width: 580px;
                            max-width: 580px;
                            transition: 0.5s;
                        }
                        #search-close {
                            background: white;
                            color: #3abdc1;
                            line-height: 20px;
                            height: fit-content;
                            width: fit-content;
                            text-align: center;
                            font-size: 20px;
                            padding: 10px;
                            border: 3px solid #3abdc1;
                            border-radius: 50%;
                            transition: 0.5s;
                            top: -20px;
                            right: -20px;
                            position: absolute;
                        }
                        .item-movie-root {
                            padding: 15px 20px !important;
                            display: flex;
                            position: relative;
                            -webkit-box-pack: justify;
                            justify-content: space-between;
                            border: 4px dashed rgba(133, 144, 166, 0.2) !important;
                            border-radius: 6px !important;
                            margin: 5px 0px !important;
                        }
                        .item_detail{
                            flex: 1;
                        }
                        .item_pl {
                            font: 12px Arial, Helvetica, sans-serif;
                            line-height: 150%;
                            color: #666666;
                        }
                        a:link {
                            color: #37a;
                        }
                        .item_meta {
                            margin-top: 7px;
                            color: #999;
                            font-size: 12px;
                            line-height: 1.5;
                        }
                        a.title.text {
                            vertical-align: middle;
                            line-height: 1.5;
                        }
                        img.cover {
                            height: 120px;
                            width: 100px;
                            margin: 1px;
                            margin-right: 40px;
                        }
                        #search-close::before {
                            content: "\\2716";
                        }
                    </style>
                    <div
                        id="settingLayer"
                        style="top: 45%; left: 50%; transform: translate(-50%, -50%)"
                    >
                        <div class="setting_content" style="margin-left: 1%; height: 100%; min-width:560px; max-width: 560px;">
                            <ul class="items_list" style="overflow:auto;height: 100%;">
                                ${lists.join("")}
                            </ul>
                        </div>
                        <span id="search-close" title="close"></span>
                    </div>
                </div>`;
            document.documentElement.insertAdjacentHTML("beforeend", html);
            this.event();
        },
        item_raw(info) {
            const bpurl =
                "data:image/gif;base64,R0lGODlhZACRANUAAOzs7NnZ2cXFxeTk5Pb29ry8vO3t7dHR0cfHx8/Pz/r6+sDAwLe3t9TU1OLi4sHBwdjY2PHx8crKyvj4+Ovr6/Ly8tbW1rW1tefn58nJydPT093d3c7OztXV1bq6uu/v7+rq6tvb27Kysv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABkAJEAAAb/QJBwSCwaj8ikcslsOp/QqHTKHFmv2Kx2y+16v+Bw9jMUm8/o9JksVLvfcDH7E6/b6/O7fm/O8/+AY2WBhH9+hYh2h4mMbouNkH2DkZRhj5WYWpeZnCObnZifoJSio5ClpoyoqYirrISur4Cxsny0tXq3uIqTu6q9vq3AwbDDxLPGaREAzM3Oz9DR0syBupoPItna29zd3t/cFrbJYgfZAujpAgkB7e7v8PHvBs0OARLZCXvWVwUiDQoiAcgGIBe5L/4cYErwz2CbNBn+UaEXTZ47hVcCNLxjbSC4jyBDMohgRWMAh3TQMBTJsqUIASU38np4RoDLmyFjnuR4kItN/5xAvelECTGo0W1DedI08/Oo0aQzU9Z0ehQqnp5bmlLFGdAkUTRat7os6FWpVKZigZKVeXWpmLDapsmNtuDj2p1Riwq1A3fb3a9TvakbTLiwOgZ2R5TNCzYtzr9m9TpuCZlx4MksKShmG8daX8zfKrc9+xZ05s14R0sWPFEkCNSA0YKD6cY17MiNPyIwzDud7cWqc5sGKbozVi2fh/vdTNuybOXg1jYPfhm6N+mxS1sPzTx7BYrgw2Pbfp353PDoBbkdEKK9+/ft/ZHvtrYA/Pv43Q9QT5p9fvfyzbecRvb9Z2AI+2HxiH8GBiggQZsVeGB+CV6x4IQOPljfhP9VaP/FhQdmKOCGHOLnoSfAMPifiPORWCJ8J4LY4IMDiiDhi/rxl4WK+bFInos4thdjihjSGFeEQb435HpFGikCkEEu2V+TRkKJo5Q7UkmjlS9iiQWP+Pm4HZclenkFmPeJaR2ZHJppBZrwqQkdmxO6OQKc78mpHJ0H2okngE4+iWSSQur4pZYaemIjoYUqSOSBCARa0EA3RmnomRNG6uSkizLqZ6aSKlrplZe+CeqmojKKYKl3nlplqp6y+md7mr5KqaqfQhrqrbE6yqSuqDKUAa6yurqlA532auGjBta6ZQMaqNrosr82G2gD0ubo65TAGnlAttN+yKyBTnoAbrgoVmvhIAcXPPgABOeuum2WJR5g7734fhvvvkoWy++/8eYK8MDEznsowQgnKXDCDNfpb8MQd/hwxBT3azCmFWeMrowaU7xwxxDbOQEBJJds8skop6zyyiy37HLKrB6DjFsyG3JczW/wg7McN++sTM8+rwF00DzTTLRxRh+d89BKe6Fz05owDfUWT09NLWlW/5x01kVjzbUkW3/9RdVZk2212VOjDbXaTbOttNtHw0203EHT7bPdO+ONs9418y2z38cATozgwRDui+G7II6L4rXM4fjjkEcu+eSUV2755ZhPpPnmmgcBADs=";
            const purl = info.cover_url;
            let rate = info.rating && info.rating.value;
            const count = info.rating && info.rating.count;
            let style = "";
            if (rate) {
                rate = parseFloat(rate);
                const color =
                    rate > 7.9 ? "green" : rate < 6.5 ? "red" : "#D4652F";
                style = `style="color: ${color};"`;
            }
            const html = `
                <li class="item-movie-root">
                    <a
                        href=${info.url}
                        class="cover-link"
                        target="_blank"
                        ><img
                            src=${
                                !purl ||
                                ["essay", "default", "banner"].some((x) =>
                                    purl.includes(x)
                                )
                                    ? bpurl
                                    : purl
                            }
                            crossorigin="anonymous"
                            referrerpolicy="no-referrer"
                            class="cover"
                    /></a>
                    <div class="item_detail">
                        <div class="item_title">
                            <a
                                class="title-text"
                                href=${info.url}
                                target="_blank"
                                >${info.title}</a
                            >
                        </div>
                        <div class="rating">
                            <span class="rating_nums" ${style}>评分: ${
                rate || "暂无评价"
            }</span
                            ><span class="item_pl"> (${
                                count ? count + "人" : "评分人数不足"
                            })</span>
                        </div>
                        <div class="item_meta abstract">
                            ${info.abstract || "尚无信息"}
                        </div>
                        <div class="item_meta abstract_2">
                            ${info.abstract_2 || "尚无信息"}
                        </div>
                    </div>
                </li>`;
            return html;
        },
        node: null,
        remove() {
            if (this.node) {
                this.node.parentNode.remove();
                this.node = null;
            }
        },
        event() {
            setTimeout(() => {
                this.node = document.getElementById("settingLayer");
                //使用onclick, 注意事件被覆蓋的問題, 这会导致a标签无法跳转
                this.node.addEventListener(
                    "click",
                    (e) => e.target.id === "search-close" && this.remove()
                );
            }, 25);
        },
        main(arr) {
            this.node
                ? this.remove()
                : this.frame(arr.map((e) => this.item_raw(e)));
        },
    };
    const xmlHTTPRequest = (url, time = 3500, rType = false) => {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: time,
                onload: (response) => {
                    if (response.status == 200)
                        resolve(rType ? response.finalUrl : response.response);
                    else {
                        console.log(`err: code ${response.status}`);
                        reject("request data error");
                    }
                },
                onerror: (e) => {
                    console.log(e);
                    reject("something error");
                },
                ontimeout: (e) => {
                    console.log(e);
                    reject("timeout error");
                },
            });
        });
    };
    const get_data = (url) => {
        return new Promise((resolve, reject) => {
            xmlHTTPRequest(url).then(
                (html) => {
                    if (html) {
                        const dom = new DOMParser().parseFromString(
                            html,
                            "text/html"
                        );
                        const scripts = dom.getElementsByTagName("script");
                        if (scripts.length > 0) {
                            for (const e of scripts) {
                                if (e.type === "text/javascript") {
                                    const text = e.text;
                                    if (
                                        text &&
                                        text.includes("window.__DATA")
                                    ) {
                                        resolve(
                                            text.slice(
                                                text.indexOf('"') + 1,
                                                text.lastIndexOf('"')
                                            )
                                        );
                                        return;
                                    }
                                }
                            }
                        }
                        reject(null);
                    }
                },
                () => reject(null)
            );
        });
    };
    const get_search_results = (url) => {
        get_data(url).then((data) => {
            if (data) {
                const d = decrypt(data);
                if (!d) {
                    alert("failed to decrypt data");
                    return;
                }
                if (d.payload.error_info || d.payload.items.length === 0) {
                    alert("no search results");
                    return;
                }
                createPannel.main(d.payload.items);
            } else alert("failed to get html content");
        });
    };
    document.onkeydown = (e) => {
        const code = e.key;
        if (
            !(code === "1" || code === "2") ||
            e.shiftKey ||
            e.ctrlKey ||
            e.altKey
        )
            return;
        let cl = "";
        if (
            (e.target.localName &&
                ["input", "textarea"].includes(
                    e.target.localName.toLowerCase()
                )) ||
            ((cl = e.target.className) &&
                (cl = cl.toLocaleUpperCase()) &&
                ["draft", "editor", "text", "code"].some((c) => cl.includes(c)))
        )
            return;
        const s = window.getSelection().toString();
        s &&
            get_search_results(
                "https://search.douban.com/" +
                    (code === "1"
                        ? `book/subject_search?search_text=${encodeURIComponent(
                              s
                          )}&cat=1001`
                        : `movie/subject_search?search_text=${encodeURIComponent(
                              s
                          )}&cat=1002`)
            );
    };
})();
