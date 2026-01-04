// ==UserScript==
// @name         获取Google验证码
// @namespace    Life is easier
// @version      0.3
// @description  在需要google验证码的网站，你还要拿起手机打开app查看验证码？这个脚本的目的就是跳过看手机的流程
// @author       slightly drunk
// @match        任何你需要google验证码登录的网址
// @supportURL   952659830@qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409892/%E8%8E%B7%E5%8F%96Google%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/409892/%E8%8E%B7%E5%8F%96Google%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 可以这样获取：http://crypto.stanford.edu/sjcl/sjcl.js
    "use strict";
    var sjcl = {
        cipher: {}, hash: {}, keyexchange: {}, mode: {}, misc: {}, codec: {}, exception: {
            corrupt: function (a) {
                this.toString = function () {
                    return "CORRUPT: " + this.message
                };
                this.message = a
            }, invalid: function (a) {
                this.toString = function () {
                    return "INVALID: " + this.message
                };
                this.message = a
            }, bug: function (a) {
                this.toString = function () {
                    return "BUG: " + this.message
                };
                this.message = a
            }, notReady: function (a) {
                this.toString = function () {
                    return "NOT READY: " + this.message
                };
                this.message = a
            }
        }
    };
    "undefined" != typeof module && module.exports && (module.exports = sjcl);
    sjcl.bitArray = {
        bitSlice: function (a, b, c) {
            a = sjcl.bitArray.g(a.slice(b / 32), 32 - (b & 31)).slice(1);
            return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b)
        }, extract: function (a, b, c) {
            var d = Math.floor(-b - c & 31);
            return ((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1
        }, concat: function (a, b) {
            if (0 === a.length || 0 === b.length) return a.concat(b);
            var c = a[a.length - 1], d = sjcl.bitArray.getPartial(c);
            return 32 === d ? a.concat(b) : sjcl.bitArray.g(b, d, c | 0, a.slice(0, a.length - 1))
        }, bitLength: function (a) {
            var b = a.length;
            return 0 ===
                b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1])
        }, clamp: function (a, b) {
            if (32 * a.length < b) return a;
            a = a.slice(0, Math.ceil(b / 32));
            var c = a.length;
            b &= 31;
            0 < c && b && (a[c - 1] = sjcl.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1));
            return a
        }, partial: function (a, b, c) {
            return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 0x10000000000 * a
        }, getPartial: function (a) {
            return Math.round(a / 0x10000000000) || 32
        }, equal: function (a, b) {
            if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return !1;
            var c = 0, d;
            for (d = 0; d < a.length; d++) c |= a[d] ^ b[d];
            return 0 ===
                c
        }, g: function (a, b, c, d) {
            var e;
            e = 0;
            for (void 0 === d && (d = []); 32 <= b; b -= 32) d.push(c), c = 0;
            if (0 === b) return d.concat(a);
            for (e = 0; e < a.length; e++) d.push(c | a[e] >>> b), c = a[e] << 32 - b;
            e = a.length ? a[a.length - 1] : 0;
            a = sjcl.bitArray.getPartial(e);
            d.push(sjcl.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1));
            return d
        }, j: function (a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
        }
    };
    sjcl.codec.base32 = {
        e: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", fromBits: function (a, b) {
            var c = "", d, e = 0, g = sjcl.codec.base32.e, f = 0, k = sjcl.bitArray.bitLength(a);
            for (d = 0; 5 * c.length < k;) c += g.charAt((f ^ a[d] >>> e) >>> 27), 5 > e ? (f = a[d] << 5 - e, e += 27, d++) : (f <<= 5, e -= 5);
            for (; c.length & 5 && !b;) c += "=";
            return c
        }, toBits: function (a) {
            a = a.replace(/\s|=/g, "").toUpperCase();
            var b = [], c, d = 0, e = sjcl.codec.base32.e, g = 0, f;
            for (c = 0; c < a.length; c++) {
                f = e.indexOf(a.charAt(c));
                if (0 > f) throw new sjcl.exception.invalid("this isn't base32!");
                27 < d ? (d -=
                          27, b.push(g ^ f >>> d), g = f << 32 - d) : (d += 5, g ^= f << 32 - d)
            }
            d & 56 && b.push(sjcl.bitArray.partial(d & 56, g, 1));
            return b
        }
    };
    sjcl.hash.sha1 = function (a) {
        a ? (this.d = a.d.slice(0), this.b = a.b.slice(0), this.a = a.a) : this.reset()
    };
    sjcl.hash.sha1.hash = function (a) {
        return (new sjcl.hash.sha1).update(a).finalize()
    };
    sjcl.hash.sha1.prototype = {
        blockSize: 512,
        reset: function () {
            this.d = this.h.slice(0);
            this.b = [];
            this.a = 0;
            return this
        },
        update: function (a) {
            "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
            var b, c = this.b = sjcl.bitArray.concat(this.b, a);
            b = this.a;
            a = this.a = b + sjcl.bitArray.bitLength(a);
            for (b = this.blockSize + b & -this.blockSize; b <= a; b += this.blockSize) n(this, c.splice(0, 16));
            return this
        },
        finalize: function () {
            var a, b = this.b, c = this.d, b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
            for (a = b.length + 2; a & 15; a++) b.push(0);
            b.push(Math.floor(this.a / 0x100000000));
            for (b.push(this.a | 0); b.length;) n(this, b.splice(0, 16));
            this.reset();
            return c
        },
        h: [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
        i: [1518500249, 1859775393, 2400959708, 3395469782]
    };

    function n(a, b) {
        var c, d, e, g, f, k, m, l = b.slice(0), h = a.d;
        e = h[0];
        g = h[1];
        f = h[2];
        k = h[3];
        m = h[4];
        for (c = 0; 79 >= c; c++) 16 <= c && (l[c] = (l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16]) << 1 | (l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16]) >>> 31), d = 19 >= c ? g & f | ~g & k : 39 >= c ? g ^ f ^ k : 59 >= c ? g & f | g & k | f & k : 79 >= c ? g ^ f ^ k : void 0, d = (e << 5 | e >>> 27) + d + m + l[c] + a.i[Math.floor(c / 20)] | 0, m = k, k = f, f = g << 30 | g >>> 2, g = e, e = d;
        h[0] = h[0] + e | 0;
        h[1] = h[1] + g | 0;
        h[2] = h[2] + f | 0;
        h[3] = h[3] + k | 0;
        h[4] = h[4] + m | 0
    }

    sjcl.misc.hmac = function (a, b) {
        this.f = b = b || sjcl.hash.sha256;
        var c = [[], []], d, e = b.prototype.blockSize / 32;
        this.c = [new b, new b];
        a.length > e && (a = b.hash(a));
        for (d = 0; d < e; d++) c[0][d] = a[d] ^ 909522486, c[1][d] = a[d] ^ 1549556828;
        this.c[0].update(c[0]);
        this.c[1].update(c[1])
    };
    sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
        a = (new this.f(this.c[0])).update(a).finalize();
        return (new this.f(this.c[1])).update(a).finalize()
    };

    // c: current time
    // k: google key
    function calGoogleCode(K, C)
    {
        var key = sjcl.codec.base32.toBits(K);

        // Count is 64 bits long.  Note that JavaScript bitwise operations make
        // the MSB effectively 0 in this case.
        var count = [((C & 0xffffffff00000000) >> 32), C & 0xffffffff];
        var otplength = 6;

        var hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
        var code = hmacsha1.encrypt(count);

        var offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
        var startBits = offset * 8;
        var endBits = startBits + 4 * 8;
        var slice = sjcl.bitArray.bitSlice(code, startBits, endBits);
        var dbc1 = slice[0];
        var dbc2 = dbc1 & 0x7fffffff;
        var otp = dbc2 % Math.pow(10, otplength);
        var result = otp.toString();
        while (result.length < otplength)
        {
            result = '0' + result;
        }
        return result
    }


    function generateCode() {
        var Gkeys = '你的密钥';
        var ctime = Math.floor((new Date() - 0) / 30000);
        var code = calGoogleCode(Gkeys, ctime);
        console.log(code);
    }

    function doTask()
    {
        setTimeout(function(){
            generateCode();
        },10000)
    }
    generateCode();
    doTask();
    
})();