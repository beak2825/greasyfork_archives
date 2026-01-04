!function(e, r) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dmzjDecrypt = r();
}(this, (function() {
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", dbits;
    function int2char(e) {
        return BI_RM.charAt(e);
    }
    function op_and(e, r) {
        return e & r;
    }
    function op_or(e, r) {
        return e | r;
    }
    function op_xor(e, r) {
        return e ^ r;
    }
    function op_andnot(e, r) {
        return e & ~r;
    }
    function lbit(e) {
        if (0 == e) return -1;
        var r = 0;
        return 0 == (65535 & e) && (e >>= 16, r += 16), 0 == (255 & e) && (e >>= 8, r += 8), 
        0 == (15 & e) && (e >>= 4, r += 4), 0 == (3 & e) && (e >>= 2, r += 2), 0 == (1 & e) && ++r, 
        r;
    }
    function cbit(e) {
        for (var r = 0; 0 != e; ) e &= e - 1, ++r;
        return r;
    }
    var canary = 0xdeadbeefcafe, j_lm = 15715070 == (16777215 & canary), lowprimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997 ], lplim = (1 << 26) / lowprimes[lowprimes.length - 1], BigInteger = function() {
        function BigInteger(e, r, i) {
            null != e && ("number" == typeof e ? this.fromNumber(e, r, i) : null == r && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, r));
        }
        return BigInteger.prototype.toString = function(e) {
            if (this.s < 0) return "-" + this.negate().toString(e);
            var r;
            if (16 == e) r = 4; else if (8 == e) r = 3; else if (2 == e) r = 1; else if (32 == e) r = 5; else {
                if (4 != e) return this.toRadix(e);
                r = 2;
            }
            var i, n = (1 << r) - 1, o = !1, s = "", a = this.t, u = this.DB - a * this.DB % r;
            if (a-- > 0) for (u < this.DB && (i = this[a] >> u) > 0 && (o = !0, s = int2char(i)); a >= 0; ) u < r ? (i = (this[a] & (1 << u) - 1) << r - u, 
            i |= this[--a] >> (u += this.DB - r)) : (i = this[a] >> (u -= r) & n, u <= 0 && (u += this.DB, 
            --a)), i > 0 && (o = !0), o && (s += int2char(i));
            return o ? s : "0";
        }, BigInteger.prototype.negate = function() {
            var e = nbi();
            return BigInteger.ZERO.subTo(this, e), e;
        }, BigInteger.prototype.abs = function() {
            return this.s < 0 ? this.negate() : this;
        }, BigInteger.prototype.compareTo = function(e) {
            var r = this.s - e.s;
            if (0 != r) return r;
            var i = this.t;
            if (0 != (r = i - e.t)) return this.s < 0 ? -r : r;
            for (;--i >= 0; ) if (0 != (r = this[i] - e[i])) return r;
            return 0;
        }, BigInteger.prototype.bitLength = function() {
            return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
        }, BigInteger.prototype.mod = function(e) {
            var r = nbi();
            return this.abs().divRemTo(e, null, r), this.s < 0 && r.compareTo(BigInteger.ZERO) > 0 && e.subTo(r, r), 
            r;
        }, BigInteger.prototype.modPowInt = function(e, r) {
            var i;
            return i = e < 256 || r.isEven() ? new Classic(r) : new Montgomery(r), this.exp(e, i);
        }, BigInteger.prototype.clone = function() {
            var e = nbi();
            return this.copyTo(e), e;
        }, BigInteger.prototype.intValue = function() {
            if (this.s < 0) {
                if (1 == this.t) return this[0] - this.DV;
                if (0 == this.t) return -1;
            } else {
                if (1 == this.t) return this[0];
                if (0 == this.t) return 0;
            }
            return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
        }, BigInteger.prototype.byteValue = function() {
            return 0 == this.t ? this.s : this[0] << 24 >> 24;
        }, BigInteger.prototype.shortValue = function() {
            return 0 == this.t ? this.s : this[0] << 16 >> 16;
        }, BigInteger.prototype.signum = function() {
            return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1;
        }, BigInteger.prototype.toByteArray = function() {
            var e = this.t, r = [];
            r[0] = this.s;
            var i, n = this.DB - e * this.DB % 8, o = 0;
            if (e-- > 0) for (n < this.DB && (i = this[e] >> n) != (this.s & this.DM) >> n && (r[o++] = i | this.s << this.DB - n); e >= 0; ) n < 8 ? (i = (this[e] & (1 << n) - 1) << 8 - n, 
            i |= this[--e] >> (n += this.DB - 8)) : (i = this[e] >> (n -= 8) & 255, n <= 0 && (n += this.DB, 
            --e)), 0 != (128 & i) && (i |= -256), 0 == o && (128 & this.s) != (128 & i) && ++o, 
            (o > 0 || i != this.s) && (r[o++] = i);
            return r;
        }, BigInteger.prototype.equals = function(e) {
            return 0 == this.compareTo(e);
        }, BigInteger.prototype.min = function(e) {
            return this.compareTo(e) < 0 ? this : e;
        }, BigInteger.prototype.max = function(e) {
            return this.compareTo(e) > 0 ? this : e;
        }, BigInteger.prototype.and = function(e) {
            var r = nbi();
            return this.bitwiseTo(e, op_and, r), r;
        }, BigInteger.prototype.or = function(e) {
            var r = nbi();
            return this.bitwiseTo(e, op_or, r), r;
        }, BigInteger.prototype.xor = function(e) {
            var r = nbi();
            return this.bitwiseTo(e, op_xor, r), r;
        }, BigInteger.prototype.andNot = function(e) {
            var r = nbi();
            return this.bitwiseTo(e, op_andnot, r), r;
        }, BigInteger.prototype.not = function() {
            for (var e = nbi(), r = 0; r < this.t; ++r) e[r] = this.DM & ~this[r];
            return e.t = this.t, e.s = ~this.s, e;
        }, BigInteger.prototype.shiftLeft = function(e) {
            var r = nbi();
            return e < 0 ? this.rShiftTo(-e, r) : this.lShiftTo(e, r), r;
        }, BigInteger.prototype.shiftRight = function(e) {
            var r = nbi();
            return e < 0 ? this.lShiftTo(-e, r) : this.rShiftTo(e, r), r;
        }, BigInteger.prototype.getLowestSetBit = function() {
            for (var e = 0; e < this.t; ++e) if (0 != this[e]) return e * this.DB + lbit(this[e]);
            return this.s < 0 ? this.t * this.DB : -1;
        }, BigInteger.prototype.bitCount = function() {
            for (var e = 0, r = this.s & this.DM, i = 0; i < this.t; ++i) e += cbit(this[i] ^ r);
            return e;
        }, BigInteger.prototype.testBit = function(e) {
            var r = Math.floor(e / this.DB);
            return r >= this.t ? 0 != this.s : 0 != (this[r] & 1 << e % this.DB);
        }, BigInteger.prototype.setBit = function(e) {
            return this.changeBit(e, op_or);
        }, BigInteger.prototype.clearBit = function(e) {
            return this.changeBit(e, op_andnot);
        }, BigInteger.prototype.flipBit = function(e) {
            return this.changeBit(e, op_xor);
        }, BigInteger.prototype.add = function(e) {
            var r = nbi();
            return this.addTo(e, r), r;
        }, BigInteger.prototype.subtract = function(e) {
            var r = nbi();
            return this.subTo(e, r), r;
        }, BigInteger.prototype.multiply = function(e) {
            var r = nbi();
            return this.multiplyTo(e, r), r;
        }, BigInteger.prototype.divide = function(e) {
            var r = nbi();
            return this.divRemTo(e, r, null), r;
        }, BigInteger.prototype.remainder = function(e) {
            var r = nbi();
            return this.divRemTo(e, null, r), r;
        }, BigInteger.prototype.divideAndRemainder = function(e) {
            var r = nbi(), i = nbi();
            return this.divRemTo(e, r, i), [ r, i ];
        }, BigInteger.prototype.modPow = function(e, r) {
            var i, n, o = e.bitLength(), s = nbv(1);
            if (o <= 0) return s;
            i = o < 18 ? 1 : o < 48 ? 3 : o < 144 ? 4 : o < 768 ? 5 : 6, n = o < 8 ? new Classic(r) : r.isEven() ? new Barrett(r) : new Montgomery(r);
            var a = [], u = 3, l = i - 1, f = (1 << i) - 1;
            if (a[1] = n.convert(this), i > 1) {
                var h = nbi();
                for (n.sqrTo(a[1], h); u <= f; ) a[u] = nbi(), n.mulTo(h, a[u - 2], a[u]), u += 2;
            }
            var p, c, d = e.t - 1, g = !0, m = nbi();
            for (o = nbits(e[d]) - 1; d >= 0; ) {
                for (o >= l ? p = e[d] >> o - l & f : (p = (e[d] & (1 << o + 1) - 1) << l - o, d > 0 && (p |= e[d - 1] >> this.DB + o - l)), 
                u = i; 0 == (1 & p); ) p >>= 1, --u;
                if ((o -= u) < 0 && (o += this.DB, --d), g) a[p].copyTo(s), g = !1; else {
                    for (;u > 1; ) n.sqrTo(s, m), n.sqrTo(m, s), u -= 2;
                    u > 0 ? n.sqrTo(s, m) : (c = s, s = m, m = c), n.mulTo(m, a[p], s);
                }
                for (;d >= 0 && 0 == (e[d] & 1 << o); ) n.sqrTo(s, m), c = s, s = m, m = c, --o < 0 && (o = this.DB - 1, 
                --d);
            }
            return n.revert(s);
        }, BigInteger.prototype.modInverse = function(e) {
            var r = e.isEven();
            if (this.isEven() && r || 0 == e.signum()) return BigInteger.ZERO;
            for (var i = e.clone(), n = this.clone(), o = nbv(1), s = nbv(0), a = nbv(0), u = nbv(1); 0 != i.signum(); ) {
                for (;i.isEven(); ) i.rShiftTo(1, i), r ? (o.isEven() && s.isEven() || (o.addTo(this, o), 
                s.subTo(e, s)), o.rShiftTo(1, o)) : s.isEven() || s.subTo(e, s), s.rShiftTo(1, s);
                for (;n.isEven(); ) n.rShiftTo(1, n), r ? (a.isEven() && u.isEven() || (a.addTo(this, a), 
                u.subTo(e, u)), a.rShiftTo(1, a)) : u.isEven() || u.subTo(e, u), u.rShiftTo(1, u);
                i.compareTo(n) >= 0 ? (i.subTo(n, i), r && o.subTo(a, o), s.subTo(u, s)) : (n.subTo(i, n), 
                r && a.subTo(o, a), u.subTo(s, u));
            }
            return 0 != n.compareTo(BigInteger.ONE) ? BigInteger.ZERO : u.compareTo(e) >= 0 ? u.subtract(e) : u.signum() < 0 ? (u.addTo(e, u), 
            u.signum() < 0 ? u.add(e) : u) : u;
        }, BigInteger.prototype.pow = function(e) {
            return this.exp(e, new NullExp);
        }, BigInteger.prototype.gcd = function(e) {
            var r = this.s < 0 ? this.negate() : this.clone(), i = e.s < 0 ? e.negate() : e.clone();
            if (r.compareTo(i) < 0) {
                var n = r;
                r = i, i = n;
            }
            var o = r.getLowestSetBit(), s = i.getLowestSetBit();
            if (s < 0) return r;
            for (o < s && (s = o), s > 0 && (r.rShiftTo(s, r), i.rShiftTo(s, i)); r.signum() > 0; ) (o = r.getLowestSetBit()) > 0 && r.rShiftTo(o, r), 
            (o = i.getLowestSetBit()) > 0 && i.rShiftTo(o, i), r.compareTo(i) >= 0 ? (r.subTo(i, r), 
            r.rShiftTo(1, r)) : (i.subTo(r, i), i.rShiftTo(1, i));
            return s > 0 && i.lShiftTo(s, i), i;
        }, BigInteger.prototype.isProbablePrime = function(e) {
            var r, i = this.abs();
            if (1 == i.t && i[0] <= lowprimes[lowprimes.length - 1]) {
                for (r = 0; r < lowprimes.length; ++r) if (i[0] == lowprimes[r]) return !0;
                return !1;
            }
            if (i.isEven()) return !1;
            for (r = 1; r < lowprimes.length; ) {
                for (var n = lowprimes[r], o = r + 1; o < lowprimes.length && n < lplim; ) n *= lowprimes[o++];
                for (n = i.modInt(n); r < o; ) if (n % lowprimes[r++] == 0) return !1;
            }
            return i.millerRabin(e);
        }, BigInteger.prototype.copyTo = function(e) {
            for (var r = this.t - 1; r >= 0; --r) e[r] = this[r];
            e.t = this.t, e.s = this.s;
        }, BigInteger.prototype.fromInt = function(e) {
            this.t = 1, this.s = e < 0 ? -1 : 0, e > 0 ? this[0] = e : e < -1 ? this[0] = e + this.DV : this.t = 0;
        }, BigInteger.prototype.fromString = function(e, r) {
            var i;
            if (16 == r) i = 4; else if (8 == r) i = 3; else if (256 == r) i = 8; else if (2 == r) i = 1; else if (32 == r) i = 5; else {
                if (4 != r) return void this.fromRadix(e, r);
                i = 2;
            }
            this.t = 0, this.s = 0;
            for (var n = e.length, o = !1, s = 0; --n >= 0; ) {
                var a = 8 == i ? 255 & +e[n] : intAt(e, n);
                a < 0 ? "-" == e.charAt(n) && (o = !0) : (o = !1, 0 == s ? this[this.t++] = a : s + i > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s, 
                this[this.t++] = a >> this.DB - s) : this[this.t - 1] |= a << s, (s += i) >= this.DB && (s -= this.DB));
            }
            8 == i && 0 != (128 & +e[0]) && (this.s = -1, s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)), 
            this.clamp(), o && BigInteger.ZERO.subTo(this, this);
        }, BigInteger.prototype.clamp = function() {
            for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e; ) --this.t;
        }, BigInteger.prototype.dlShiftTo = function(e, r) {
            var i;
            for (i = this.t - 1; i >= 0; --i) r[i + e] = this[i];
            for (i = e - 1; i >= 0; --i) r[i] = 0;
            r.t = this.t + e, r.s = this.s;
        }, BigInteger.prototype.drShiftTo = function(e, r) {
            for (var i = e; i < this.t; ++i) r[i - e] = this[i];
            r.t = Math.max(this.t - e, 0), r.s = this.s;
        }, BigInteger.prototype.lShiftTo = function(e, r) {
            for (var i = e % this.DB, n = this.DB - i, o = (1 << n) - 1, s = Math.floor(e / this.DB), a = this.s << i & this.DM, u = this.t - 1; u >= 0; --u) r[u + s + 1] = this[u] >> n | a, 
            a = (this[u] & o) << i;
            for (u = s - 1; u >= 0; --u) r[u] = 0;
            r[s] = a, r.t = this.t + s + 1, r.s = this.s, r.clamp();
        }, BigInteger.prototype.rShiftTo = function(e, r) {
            r.s = this.s;
            var i = Math.floor(e / this.DB);
            if (i >= this.t) r.t = 0; else {
                var n = e % this.DB, o = this.DB - n, s = (1 << n) - 1;
                r[0] = this[i] >> n;
                for (var a = i + 1; a < this.t; ++a) r[a - i - 1] |= (this[a] & s) << o, r[a - i] = this[a] >> n;
                n > 0 && (r[this.t - i - 1] |= (this.s & s) << o), r.t = this.t - i, r.clamp();
            }
        }, BigInteger.prototype.subTo = function(e, r) {
            for (var i = 0, n = 0, o = Math.min(e.t, this.t); i < o; ) n += this[i] - e[i], 
            r[i++] = n & this.DM, n >>= this.DB;
            if (e.t < this.t) {
                for (n -= e.s; i < this.t; ) n += this[i], r[i++] = n & this.DM, n >>= this.DB;
                n += this.s;
            } else {
                for (n += this.s; i < e.t; ) n -= e[i], r[i++] = n & this.DM, n >>= this.DB;
                n -= e.s;
            }
            r.s = n < 0 ? -1 : 0, n < -1 ? r[i++] = this.DV + n : n > 0 && (r[i++] = n), r.t = i, 
            r.clamp();
        }, BigInteger.prototype.multiplyTo = function(e, r) {
            var i = this.abs(), n = e.abs(), o = i.t;
            for (r.t = o + n.t; --o >= 0; ) r[o] = 0;
            for (o = 0; o < n.t; ++o) r[o + i.t] = i.am(0, n[o], r, o, 0, i.t);
            r.s = 0, r.clamp(), this.s != e.s && BigInteger.ZERO.subTo(r, r);
        }, BigInteger.prototype.squareTo = function(e) {
            for (var r = this.abs(), i = e.t = 2 * r.t; --i >= 0; ) e[i] = 0;
            for (i = 0; i < r.t - 1; ++i) {
                var n = r.am(i, r[i], e, 2 * i, 0, 1);
                (e[i + r.t] += r.am(i + 1, 2 * r[i], e, 2 * i + 1, n, r.t - i - 1)) >= r.DV && (e[i + r.t] -= r.DV, 
                e[i + r.t + 1] = 1);
            }
            e.t > 0 && (e[e.t - 1] += r.am(i, r[i], e, 2 * i, 0, 1)), e.s = 0, e.clamp();
        }, BigInteger.prototype.divRemTo = function(e, r, i) {
            var n = e.abs();
            if (!(n.t <= 0)) {
                var o = this.abs();
                if (o.t < n.t) return null != r && r.fromInt(0), void (null != i && this.copyTo(i));
                null == i && (i = nbi());
                var s = nbi(), a = this.s, u = e.s, l = this.DB - nbits(n[n.t - 1]);
                l > 0 ? (n.lShiftTo(l, s), o.lShiftTo(l, i)) : (n.copyTo(s), o.copyTo(i));
                var f = s.t, h = s[f - 1];
                if (0 != h) {
                    var p = h * (1 << this.F1) + (f > 1 ? s[f - 2] >> this.F2 : 0), c = this.FV / p, d = (1 << this.F1) / p, g = 1 << this.F2, m = i.t, y = m - f, v = null == r ? nbi() : r;
                    for (s.dlShiftTo(y, v), i.compareTo(v) >= 0 && (i[i.t++] = 1, i.subTo(v, i)), BigInteger.ONE.dlShiftTo(f, v), 
                    v.subTo(s, s); s.t < f; ) s[s.t++] = 0;
                    for (;--y >= 0; ) {
                        var b = i[--m] == h ? this.DM : Math.floor(i[m] * c + (i[m - 1] + g) * d);
                        if ((i[m] += s.am(0, b, i, y, 0, f)) < b) for (s.dlShiftTo(y, v), i.subTo(v, i); i[m] < --b; ) i.subTo(v, i);
                    }
                    null != r && (i.drShiftTo(f, r), a != u && BigInteger.ZERO.subTo(r, r)), i.t = f, 
                    i.clamp(), l > 0 && i.rShiftTo(l, i), a < 0 && BigInteger.ZERO.subTo(i, i);
                }
            }
        }, BigInteger.prototype.invDigit = function() {
            if (this.t < 1) return 0;
            var e = this[0];
            if (0 == (1 & e)) return 0;
            var r = 3 & e;
            return (r = (r = (r = (r = r * (2 - (15 & e) * r) & 15) * (2 - (255 & e) * r) & 255) * (2 - ((65535 & e) * r & 65535)) & 65535) * (2 - e * r % this.DV) % this.DV) > 0 ? this.DV - r : -r;
        }, BigInteger.prototype.isEven = function() {
            return 0 == (this.t > 0 ? 1 & this[0] : this.s);
        }, BigInteger.prototype.exp = function(e, r) {
            if (e > 4294967295 || e < 1) return BigInteger.ONE;
            var i = nbi(), n = nbi(), o = r.convert(this), s = nbits(e) - 1;
            for (o.copyTo(i); --s >= 0; ) if (r.sqrTo(i, n), (e & 1 << s) > 0) r.mulTo(n, o, i); else {
                var a = i;
                i = n, n = a;
            }
            return r.revert(i);
        }, BigInteger.prototype.chunkSize = function(e) {
            return Math.floor(Math.LN2 * this.DB / Math.log(e));
        }, BigInteger.prototype.toRadix = function(e) {
            if (null == e && (e = 10), 0 == this.signum() || e < 2 || e > 36) return "0";
            var r = this.chunkSize(e), i = Math.pow(e, r), n = nbv(i), o = nbi(), s = nbi(), a = "";
            for (this.divRemTo(n, o, s); o.signum() > 0; ) a = (i + s.intValue()).toString(e).substr(1) + a, 
            o.divRemTo(n, o, s);
            return s.intValue().toString(e) + a;
        }, BigInteger.prototype.fromRadix = function(e, r) {
            this.fromInt(0), null == r && (r = 10);
            for (var i = this.chunkSize(r), n = Math.pow(r, i), o = !1, s = 0, a = 0, u = 0; u < e.length; ++u) {
                var l = intAt(e, u);
                l < 0 ? "-" == e.charAt(u) && 0 == this.signum() && (o = !0) : (a = r * a + l, ++s >= i && (this.dMultiply(n), 
                this.dAddOffset(a, 0), s = 0, a = 0));
            }
            s > 0 && (this.dMultiply(Math.pow(r, s)), this.dAddOffset(a, 0)), o && BigInteger.ZERO.subTo(this, this);
        }, BigInteger.prototype.fromNumber = function(e, r, i) {
            if ("number" == typeof r) if (e < 2) this.fromInt(1); else for (this.fromNumber(e, i), 
            this.testBit(e - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this), 
            this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(r); ) this.dAddOffset(2, 0), 
            this.bitLength() > e && this.subTo(BigInteger.ONE.shiftLeft(e - 1), this); else {
                var n = [], o = 7 & e;
                n.length = 1 + (e >> 3), r.nextBytes(n), o > 0 ? n[0] &= (1 << o) - 1 : n[0] = 0, 
                this.fromString(n, 256);
            }
        }, BigInteger.prototype.bitwiseTo = function(e, r, i) {
            var n, o, s = Math.min(e.t, this.t);
            for (n = 0; n < s; ++n) i[n] = r(this[n], e[n]);
            if (e.t < this.t) {
                for (o = e.s & this.DM, n = s; n < this.t; ++n) i[n] = r(this[n], o);
                i.t = this.t;
            } else {
                for (o = this.s & this.DM, n = s; n < e.t; ++n) i[n] = r(o, e[n]);
                i.t = e.t;
            }
            i.s = r(this.s, e.s), i.clamp();
        }, BigInteger.prototype.changeBit = function(e, r) {
            var i = BigInteger.ONE.shiftLeft(e);
            return this.bitwiseTo(i, r, i), i;
        }, BigInteger.prototype.addTo = function(e, r) {
            for (var i = 0, n = 0, o = Math.min(e.t, this.t); i < o; ) n += this[i] + e[i], 
            r[i++] = n & this.DM, n >>= this.DB;
            if (e.t < this.t) {
                for (n += e.s; i < this.t; ) n += this[i], r[i++] = n & this.DM, n >>= this.DB;
                n += this.s;
            } else {
                for (n += this.s; i < e.t; ) n += e[i], r[i++] = n & this.DM, n >>= this.DB;
                n += e.s;
            }
            r.s = n < 0 ? -1 : 0, n > 0 ? r[i++] = n : n < -1 && (r[i++] = this.DV + n), r.t = i, 
            r.clamp();
        }, BigInteger.prototype.dMultiply = function(e) {
            this[this.t] = this.am(0, e - 1, this, 0, 0, this.t), ++this.t, this.clamp();
        }, BigInteger.prototype.dAddOffset = function(e, r) {
            if (0 != e) {
                for (;this.t <= r; ) this[this.t++] = 0;
                for (this[r] += e; this[r] >= this.DV; ) this[r] -= this.DV, ++r >= this.t && (this[this.t++] = 0), 
                ++this[r];
            }
        }, BigInteger.prototype.multiplyLowerTo = function(e, r, i) {
            var n = Math.min(this.t + e.t, r);
            for (i.s = 0, i.t = n; n > 0; ) i[--n] = 0;
            for (var o = i.t - this.t; n < o; ++n) i[n + this.t] = this.am(0, e[n], i, n, 0, this.t);
            for (o = Math.min(e.t, r); n < o; ++n) this.am(0, e[n], i, n, 0, r - n);
            i.clamp();
        }, BigInteger.prototype.multiplyUpperTo = function(e, r, i) {
            --r;
            var n = i.t = this.t + e.t - r;
            for (i.s = 0; --n >= 0; ) i[n] = 0;
            for (n = Math.max(r - this.t, 0); n < e.t; ++n) i[this.t + n - r] = this.am(r - n, e[n], i, 0, 0, this.t + n - r);
            i.clamp(), i.drShiftTo(1, i);
        }, BigInteger.prototype.modInt = function(e) {
            if (e <= 0) return 0;
            var r = this.DV % e, i = this.s < 0 ? e - 1 : 0;
            if (this.t > 0) if (0 == r) i = this[0] % e; else for (var n = this.t - 1; n >= 0; --n) i = (r * i + this[n]) % e;
            return i;
        }, BigInteger.prototype.millerRabin = function(e) {
            var r = this.subtract(BigInteger.ONE), i = r.getLowestSetBit();
            if (i <= 0) return !1;
            var n = r.shiftRight(i);
            (e = e + 1 >> 1) > lowprimes.length && (e = lowprimes.length);
            for (var o = nbi(), s = 0; s < e; ++s) {
                o.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
                var a = o.modPow(n, this);
                if (0 != a.compareTo(BigInteger.ONE) && 0 != a.compareTo(r)) {
                    for (var u = 1; u++ < i && 0 != a.compareTo(r); ) if (0 == (a = a.modPowInt(2, this)).compareTo(BigInteger.ONE)) return !1;
                    if (0 != a.compareTo(r)) return !1;
                }
            }
            return !0;
        }, BigInteger.prototype.square = function() {
            var e = nbi();
            return this.squareTo(e), e;
        }, BigInteger.prototype.gcda = function(e, r) {
            var i = this.s < 0 ? this.negate() : this.clone(), n = e.s < 0 ? e.negate() : e.clone();
            if (i.compareTo(n) < 0) {
                var o = i;
                i = n, n = o;
            }
            var s = i.getLowestSetBit(), a = n.getLowestSetBit();
            if (a < 0) r(i); else {
                s < a && (a = s), a > 0 && (i.rShiftTo(a, i), n.rShiftTo(a, n));
                var gcda1 = function() {
                    (s = i.getLowestSetBit()) > 0 && i.rShiftTo(s, i), (s = n.getLowestSetBit()) > 0 && n.rShiftTo(s, n), 
                    i.compareTo(n) >= 0 ? (i.subTo(n, i), i.rShiftTo(1, i)) : (n.subTo(i, n), n.rShiftTo(1, n)), 
                    i.signum() > 0 ? setTimeout(gcda1, 0) : (a > 0 && n.lShiftTo(a, n), setTimeout((function() {
                        r(n);
                    }), 0));
                };
                setTimeout(gcda1, 10);
            }
        }, BigInteger.prototype.fromNumberAsync = function(e, r, i, n) {
            if ("number" == typeof r) if (e < 2) this.fromInt(1); else {
                this.fromNumber(e, i), this.testBit(e - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this), 
                this.isEven() && this.dAddOffset(1, 0);
                var o = this, bnpfn1_1 = function() {
                    o.dAddOffset(2, 0), o.bitLength() > e && o.subTo(BigInteger.ONE.shiftLeft(e - 1), o), 
                    o.isProbablePrime(r) ? setTimeout((function() {
                        n();
                    }), 0) : setTimeout(bnpfn1_1, 0);
                };
                setTimeout(bnpfn1_1, 0);
            } else {
                var s = [], a = 7 & e;
                s.length = 1 + (e >> 3), r.nextBytes(s), a > 0 ? s[0] &= (1 << a) - 1 : s[0] = 0, 
                this.fromString(s, 256);
            }
        }, BigInteger;
    }(), NullExp = function() {
        function NullExp() {}
        return NullExp.prototype.convert = function(e) {
            return e;
        }, NullExp.prototype.revert = function(e) {
            return e;
        }, NullExp.prototype.mulTo = function(e, r, i) {
            e.multiplyTo(r, i);
        }, NullExp.prototype.sqrTo = function(e, r) {
            e.squareTo(r);
        }, NullExp;
    }(), Classic = function() {
        function Classic(e) {
            this.m = e;
        }
        return Classic.prototype.convert = function(e) {
            return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e;
        }, Classic.prototype.revert = function(e) {
            return e;
        }, Classic.prototype.reduce = function(e) {
            e.divRemTo(this.m, null, e);
        }, Classic.prototype.mulTo = function(e, r, i) {
            e.multiplyTo(r, i), this.reduce(i);
        }, Classic.prototype.sqrTo = function(e, r) {
            e.squareTo(r), this.reduce(r);
        }, Classic;
    }(), Montgomery = function() {
        function Montgomery(e) {
            this.m = e, this.mp = e.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, 
            this.um = (1 << e.DB - 15) - 1, this.mt2 = 2 * e.t;
        }
        return Montgomery.prototype.convert = function(e) {
            var r = nbi();
            return e.abs().dlShiftTo(this.m.t, r), r.divRemTo(this.m, null, r), e.s < 0 && r.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(r, r), 
            r;
        }, Montgomery.prototype.revert = function(e) {
            var r = nbi();
            return e.copyTo(r), this.reduce(r), r;
        }, Montgomery.prototype.reduce = function(e) {
            for (;e.t <= this.mt2; ) e[e.t++] = 0;
            for (var r = 0; r < this.m.t; ++r) {
                var i = 32767 & e[r], n = i * this.mpl + ((i * this.mph + (e[r] >> 15) * this.mpl & this.um) << 15) & e.DM;
                for (e[i = r + this.m.t] += this.m.am(0, n, e, r, 0, this.m.t); e[i] >= e.DV; ) e[i] -= e.DV, 
                e[++i]++;
            }
            e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e);
        }, Montgomery.prototype.mulTo = function(e, r, i) {
            e.multiplyTo(r, i), this.reduce(i);
        }, Montgomery.prototype.sqrTo = function(e, r) {
            e.squareTo(r), this.reduce(r);
        }, Montgomery;
    }(), Barrett = function() {
        function Barrett(e) {
            this.m = e, this.r2 = nbi(), this.q3 = nbi(), BigInteger.ONE.dlShiftTo(2 * e.t, this.r2), 
            this.mu = this.r2.divide(e);
        }
        return Barrett.prototype.convert = function(e) {
            if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m);
            if (e.compareTo(this.m) < 0) return e;
            var r = nbi();
            return e.copyTo(r), this.reduce(r), r;
        }, Barrett.prototype.revert = function(e) {
            return e;
        }, Barrett.prototype.reduce = function(e) {
            for (e.drShiftTo(this.m.t - 1, this.r2), e.t > this.m.t + 1 && (e.t = this.m.t + 1, 
            e.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); e.compareTo(this.r2) < 0; ) e.dAddOffset(1, this.m.t + 1);
            for (e.subTo(this.r2, e); e.compareTo(this.m) >= 0; ) e.subTo(this.m, e);
        }, Barrett.prototype.mulTo = function(e, r, i) {
            e.multiplyTo(r, i), this.reduce(i);
        }, Barrett.prototype.sqrTo = function(e, r) {
            e.squareTo(r), this.reduce(r);
        }, Barrett;
    }();
    function nbi() {
        return new BigInteger(null);
    }
    function parseBigInt(e, r) {
        return new BigInteger(e, r);
    }
    var inBrowser = "undefined" != typeof navigator;
    inBrowser && j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = function am2(e, r, i, n, o, s) {
        for (var a = 32767 & r, u = r >> 15; --s >= 0; ) {
            var l = 32767 & this[e], f = this[e++] >> 15, h = u * l + f * a;
            o = ((l = a * l + ((32767 & h) << 15) + i[n] + (1073741823 & o)) >>> 30) + (h >>> 15) + u * f + (o >>> 30), 
            i[n++] = 1073741823 & l;
        }
        return o;
    }, dbits = 30) : inBrowser && j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = function am1(e, r, i, n, o, s) {
        for (;--s >= 0; ) {
            var a = r * this[e++] + i[n] + o;
            o = Math.floor(a / 67108864), i[n++] = 67108863 & a;
        }
        return o;
    }, dbits = 26) : (BigInteger.prototype.am = function am3(e, r, i, n, o, s) {
        for (var a = 16383 & r, u = r >> 14; --s >= 0; ) {
            var l = 16383 & this[e], f = this[e++] >> 14, h = u * l + f * a;
            o = ((l = a * l + ((16383 & h) << 14) + i[n] + o) >> 28) + (h >> 14) + u * f, i[n++] = 268435455 & l;
        }
        return o;
    }, dbits = 28), BigInteger.prototype.DB = dbits, BigInteger.prototype.DM = (1 << dbits) - 1, 
    BigInteger.prototype.DV = 1 << dbits;
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP), BigInteger.prototype.F1 = BI_FP - dbits, 
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RC = [], rr, vv;
    for (rr = "0".charCodeAt(0), vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    for (rr = "a".charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    for (rr = "A".charCodeAt(0), vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    function intAt(e, r) {
        var i = BI_RC[e.charCodeAt(r)];
        return null == i ? -1 : i;
    }
    function nbv(e) {
        var r = nbi();
        return r.fromInt(e), r;
    }
    function nbits(e) {
        var r, i = 1;
        return 0 != (r = e >>> 16) && (e = r, i += 16), 0 != (r = e >> 8) && (e = r, i += 8), 
        0 != (r = e >> 4) && (e = r, i += 4), 0 != (r = e >> 2) && (e = r, i += 2), 0 != (r = e >> 1) && (e = r, 
        i += 1), i;
    }
    BigInteger.ZERO = nbv(0), BigInteger.ONE = nbv(1);
    var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64pad = "=", decoder$1;
    function hex2b64(e) {
        var r, i, n = "";
        for (r = 0; r + 3 <= e.length; r += 3) i = parseInt(e.substring(r, r + 3), 16), 
        n += b64map.charAt(i >> 6) + b64map.charAt(63 & i);
        for (r + 1 == e.length ? (i = parseInt(e.substring(r, r + 1), 16), n += b64map.charAt(i << 2)) : r + 2 == e.length && (i = parseInt(e.substring(r, r + 2), 16), 
        n += b64map.charAt(i >> 2) + b64map.charAt((3 & i) << 4)); (3 & n.length) > 0; ) n += b64pad;
        return n;
    }
    function b64tohex(e) {
        var r, i = "", n = 0, o = 0;
        for (r = 0; r < e.length && e.charAt(r) != b64pad; ++r) {
            var s = b64map.indexOf(e.charAt(r));
            s < 0 || (0 == n ? (i += int2char(s >> 2), o = 3 & s, n = 1) : 1 == n ? (i += int2char(o << 2 | s >> 4), 
            o = 15 & s, n = 2) : 2 == n ? (i += int2char(o), i += int2char(s >> 2), o = 3 & s, 
            n = 3) : (i += int2char(o << 2 | s >> 4), i += int2char(15 & s), n = 0));
        }
        return 1 == n && (i += int2char(o << 2)), i;
    }
    var Hex = {
        decode: function(e) {
            var r;
            if (void 0 === decoder$1) {
                var i = "0123456789ABCDEF", n = " \f\n\r\t \u2028\u2029";
                for (decoder$1 = {}, r = 0; r < 16; ++r) decoder$1[i.charAt(r)] = r;
                for (i = i.toLowerCase(), r = 10; r < 16; ++r) decoder$1[i.charAt(r)] = r;
                for (r = 0; r < 8; ++r) decoder$1[n.charAt(r)] = -1;
            }
            var o = [], s = 0, a = 0;
            for (r = 0; r < e.length; ++r) {
                var u = e.charAt(r);
                if ("=" == u) break;
                if (-1 != (u = decoder$1[u])) {
                    if (void 0 === u) throw new Error("Illegal character at offset " + r);
                    s |= u, ++a >= 2 ? (o[o.length] = s, s = 0, a = 0) : s <<= 4;
                }
            }
            if (a) throw new Error("Hex encoding incomplete: 4 bits missing");
            return o;
        }
    }, decoder, Base64 = {
        decode: function(e) {
            var r;
            if (void 0 === decoder) {
                var i = "= \f\n\r\t \u2028\u2029";
                for (decoder = Object.create(null), r = 0; r < 64; ++r) decoder["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(r)] = r;
                for (decoder["-"] = 62, decoder._ = 63, r = 0; r < 9; ++r) decoder[i.charAt(r)] = -1;
            }
            var n = [], o = 0, s = 0;
            for (r = 0; r < e.length; ++r) {
                var a = e.charAt(r);
                if ("=" == a) break;
                if (-1 != (a = decoder[a])) {
                    if (void 0 === a) throw new Error("Illegal character at offset " + r);
                    o |= a, ++s >= 4 ? (n[n.length] = o >> 16, n[n.length] = o >> 8 & 255, n[n.length] = 255 & o, 
                    o = 0, s = 0) : o <<= 6;
                }
            }
            switch (s) {
              case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");

              case 2:
                n[n.length] = o >> 10;
                break;

              case 3:
                n[n.length] = o >> 16, n[n.length] = o >> 8 & 255;
            }
            return n;
        },
        re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
        unarmor: function(e) {
            var r = Base64.re.exec(e);
            if (r) if (r[1]) e = r[1]; else {
                if (!r[2]) throw new Error("RegExp out of sync");
                e = r[2];
            }
            return Base64.decode(e);
        }
    }, max = 1e13, Int10 = function() {
        function Int10(e) {
            this.buf = [ +e || 0 ];
        }
        return Int10.prototype.mulAdd = function(e, r) {
            var i, n, o = this.buf, s = o.length;
            for (i = 0; i < s; ++i) (n = o[i] * e + r) < max ? r = 0 : n -= (r = 0 | n / max) * max, 
            o[i] = n;
            r > 0 && (o[i] = r);
        }, Int10.prototype.sub = function(e) {
            var r, i, n = this.buf, o = n.length;
            for (r = 0; r < o; ++r) (i = n[r] - e) < 0 ? (i += max, e = 1) : e = 0, n[r] = i;
            for (;0 === n[n.length - 1]; ) n.pop();
        }, Int10.prototype.toString = function(e) {
            if (10 != (e || 10)) throw new Error("only base 10 is supported");
            for (var r = this.buf, i = r[r.length - 1].toString(), n = r.length - 2; n >= 0; --n) i += (max + r[n]).toString().substring(1);
            return i;
        }, Int10.prototype.valueOf = function() {
            for (var e = this.buf, r = 0, i = e.length - 1; i >= 0; --i) r = r * max + e[i];
            return r;
        }, Int10.prototype.simplify = function() {
            var e = this.buf;
            return 1 == e.length ? e[0] : this;
        }, Int10;
    }(), ellipsis = "…", reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
    function stringCut(e, r) {
        return e.length > r && (e = e.substring(0, r) + ellipsis), e;
    }
    var Stream = function() {
        function Stream(e, r) {
            this.hexDigits = "0123456789ABCDEF", e instanceof Stream ? (this.enc = e.enc, this.pos = e.pos) : (this.enc = e, 
            this.pos = r);
        }
        return Stream.prototype.get = function(e) {
            if (void 0 === e && (e = this.pos++), e >= this.enc.length) throw new Error("Requesting byte offset ".concat(e, " on a stream of length ").concat(this.enc.length));
            return "string" == typeof this.enc ? this.enc.charCodeAt(e) : this.enc[e];
        }, Stream.prototype.hexByte = function(e) {
            return this.hexDigits.charAt(e >> 4 & 15) + this.hexDigits.charAt(15 & e);
        }, Stream.prototype.hexDump = function(e, r, i) {
            for (var n = "", o = e; o < r; ++o) if (n += this.hexByte(this.get(o)), !0 !== i) switch (15 & o) {
              case 7:
                n += "  ";
                break;

              case 15:
                n += "\n";
                break;

              default:
                n += " ";
            }
            return n;
        }, Stream.prototype.isASCII = function(e, r) {
            for (var i = e; i < r; ++i) {
                var n = this.get(i);
                if (n < 32 || n > 176) return !1;
            }
            return !0;
        }, Stream.prototype.parseStringISO = function(e, r) {
            for (var i = "", n = e; n < r; ++n) i += String.fromCharCode(this.get(n));
            return i;
        }, Stream.prototype.parseStringUTF = function(e, r) {
            for (var i = "", n = e; n < r; ) {
                var o = this.get(n++);
                i += o < 128 ? String.fromCharCode(o) : o > 191 && o < 224 ? String.fromCharCode((31 & o) << 6 | 63 & this.get(n++)) : String.fromCharCode((15 & o) << 12 | (63 & this.get(n++)) << 6 | 63 & this.get(n++));
            }
            return i;
        }, Stream.prototype.parseStringBMP = function(e, r) {
            for (var i, n, o = "", s = e; s < r; ) i = this.get(s++), n = this.get(s++), o += String.fromCharCode(i << 8 | n);
            return o;
        }, Stream.prototype.parseTime = function(e, r, i) {
            var n = this.parseStringISO(e, r), o = (i ? reTimeS : reTimeL).exec(n);
            return o ? (i && (o[1] = +o[1], o[1] += +o[1] < 70 ? 2e3 : 1900), n = o[1] + "-" + o[2] + "-" + o[3] + " " + o[4], 
            o[5] && (n += ":" + o[5], o[6] && (n += ":" + o[6], o[7] && (n += "." + o[7]))), 
            o[8] && (n += " UTC", "Z" != o[8] && (n += o[8], o[9] && (n += ":" + o[9]))), n) : "Unrecognized time: " + n;
        }, Stream.prototype.parseInteger = function(e, r) {
            for (var i, n = this.get(e), o = n > 127, s = o ? 255 : 0, a = ""; n == s && ++e < r; ) n = this.get(e);
            if (0 === (i = r - e)) return o ? -1 : 0;
            if (i > 4) {
                for (a = n, i <<= 3; 0 == (128 & (+a ^ s)); ) a = +a << 1, --i;
                a = "(" + i + " bit)\n";
            }
            o && (n -= 256);
            for (var u = new Int10(n), l = e + 1; l < r; ++l) u.mulAdd(256, this.get(l));
            return a + u.toString();
        }, Stream.prototype.parseBitString = function(e, r, i) {
            for (var n = this.get(e), o = "(" + ((r - e - 1 << 3) - n) + " bit)\n", s = "", a = e + 1; a < r; ++a) {
                for (var u = this.get(a), l = a == r - 1 ? n : 0, f = 7; f >= l; --f) s += u >> f & 1 ? "1" : "0";
                if (s.length > i) return o + stringCut(s, i);
            }
            return o + s;
        }, Stream.prototype.parseOctetString = function(e, r, i) {
            if (this.isASCII(e, r)) return stringCut(this.parseStringISO(e, r), i);
            var n = r - e, o = "(" + n + " byte)\n";
            n > (i /= 2) && (r = e + i);
            for (var s = e; s < r; ++s) o += this.hexByte(this.get(s));
            return n > i && (o += ellipsis), o;
        }, Stream.prototype.parseOID = function(e, r, i) {
            for (var n = "", o = new Int10, s = 0, a = e; a < r; ++a) {
                var u = this.get(a);
                if (o.mulAdd(128, 127 & u), s += 7, !(128 & u)) {
                    if ("" === n) if ((o = o.simplify()) instanceof Int10) o.sub(80), n = "2." + o.toString(); else {
                        var l = o < 80 ? o < 40 ? 0 : 1 : 2;
                        n = l + "." + (o - 40 * l);
                    } else n += "." + o.toString();
                    if (n.length > i) return stringCut(n, i);
                    o = new Int10, s = 0;
                }
            }
            return s > 0 && (n += ".incomplete"), n;
        }, Stream;
    }(), ASN1 = function() {
        function ASN1(e, r, i, n, o) {
            if (!(n instanceof ASN1Tag)) throw new Error("Invalid tag value.");
            this.stream = e, this.header = r, this.length = i, this.tag = n, this.sub = o;
        }
        return ASN1.prototype.typeName = function() {
            switch (this.tag.tagClass) {
              case 0:
                switch (this.tag.tagNumber) {
                  case 0:
                    return "EOC";

                  case 1:
                    return "BOOLEAN";

                  case 2:
                    return "INTEGER";

                  case 3:
                    return "BIT_STRING";

                  case 4:
                    return "OCTET_STRING";

                  case 5:
                    return "NULL";

                  case 6:
                    return "OBJECT_IDENTIFIER";

                  case 7:
                    return "ObjectDescriptor";

                  case 8:
                    return "EXTERNAL";

                  case 9:
                    return "REAL";

                  case 10:
                    return "ENUMERATED";

                  case 11:
                    return "EMBEDDED_PDV";

                  case 12:
                    return "UTF8String";

                  case 16:
                    return "SEQUENCE";

                  case 17:
                    return "SET";

                  case 18:
                    return "NumericString";

                  case 19:
                    return "PrintableString";

                  case 20:
                    return "TeletexString";

                  case 21:
                    return "VideotexString";

                  case 22:
                    return "IA5String";

                  case 23:
                    return "UTCTime";

                  case 24:
                    return "GeneralizedTime";

                  case 25:
                    return "GraphicString";

                  case 26:
                    return "VisibleString";

                  case 27:
                    return "GeneralString";

                  case 28:
                    return "UniversalString";

                  case 30:
                    return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();

              case 1:
                return "Application_" + this.tag.tagNumber.toString();

              case 2:
                return "[" + this.tag.tagNumber.toString() + "]";

              case 3:
                return "Private_" + this.tag.tagNumber.toString();
            }
        }, ASN1.prototype.content = function(e) {
            if (void 0 === this.tag) return null;
            void 0 === e && (e = 1 / 0);
            var r = this.posContent(), i = Math.abs(this.length);
            if (!this.tag.isUniversal()) return null !== this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(r, r + i, e);
            switch (this.tag.tagNumber) {
              case 1:
                return 0 === this.stream.get(r) ? "false" : "true";

              case 2:
                return this.stream.parseInteger(r, r + i);

              case 3:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(r, r + i, e);

              case 4:
                return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(r, r + i, e);

              case 6:
                return this.stream.parseOID(r, r + i, e);

              case 16:
              case 17:
                return null !== this.sub ? "(" + this.sub.length + " elem)" : "(no elem)";

              case 12:
                return stringCut(this.stream.parseStringUTF(r, r + i), e);

              case 18:
              case 19:
              case 20:
              case 21:
              case 22:
              case 26:
                return stringCut(this.stream.parseStringISO(r, r + i), e);

              case 30:
                return stringCut(this.stream.parseStringBMP(r, r + i), e);

              case 23:
              case 24:
                return this.stream.parseTime(r, r + i, 23 == this.tag.tagNumber);
            }
            return null;
        }, ASN1.prototype.toString = function() {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]";
        }, ASN1.prototype.toPrettyString = function(e) {
            void 0 === e && (e = "");
            var r = e + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0 && (r += "+"), r += this.length, this.tag.tagConstructed ? r += " (constructed)" : !this.tag.isUniversal() || 3 != this.tag.tagNumber && 4 != this.tag.tagNumber || null === this.sub || (r += " (encapsulates)"), 
            r += "\n", null !== this.sub) {
                e += "  ";
                for (var i = 0, n = this.sub.length; i < n; ++i) r += this.sub[i].toPrettyString(e);
            }
            return r;
        }, ASN1.prototype.posStart = function() {
            return this.stream.pos;
        }, ASN1.prototype.posContent = function() {
            return this.stream.pos + this.header;
        }, ASN1.prototype.posEnd = function() {
            return this.stream.pos + this.header + Math.abs(this.length);
        }, ASN1.prototype.toHexString = function() {
            return this.stream.hexDump(this.posStart(), this.posEnd(), !0);
        }, ASN1.decodeLength = function(e) {
            var r = e.get(), i = 127 & r;
            if (i == r) return i;
            if (i > 6) throw new Error("Length over 48 bits not supported at position " + (e.pos - 1));
            if (0 === i) return null;
            r = 0;
            for (var n = 0; n < i; ++n) r = 256 * r + e.get();
            return r;
        }, ASN1.prototype.getHexStringValue = function() {
            var e = this.toHexString(), r = 2 * this.header, i = 2 * this.length;
            return e.substr(r, i);
        }, ASN1.decode = function(e) {
            var r;
            r = e instanceof Stream ? e : new Stream(e, 0);
            var i = new Stream(r), n = new ASN1Tag(r), o = ASN1.decodeLength(r), s = r.pos, a = s - i.pos, u = null, getSub = function() {
                var e = [];
                if (null !== o) {
                    for (var i = s + o; r.pos < i; ) e[e.length] = ASN1.decode(r);
                    if (r.pos != i) throw new Error("Content size is not correct for container starting at offset " + s);
                } else try {
                    for (;;) {
                        var n = ASN1.decode(r);
                        if (n.tag.isEOC()) break;
                        e[e.length] = n;
                    }
                    o = s - r.pos;
                } catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
                return e;
            };
            if (n.tagConstructed) u = getSub(); else if (n.isUniversal() && (3 == n.tagNumber || 4 == n.tagNumber)) try {
                if (3 == n.tagNumber && 0 != r.get()) throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                u = getSub();
                for (var l = 0; l < u.length; ++l) if (u[l].tag.isEOC()) throw new Error("EOC is not supposed to be actual content.");
            } catch (e) {
                u = null;
            }
            if (null === u) {
                if (null === o) throw new Error("We can't skip over an invalid tag with undefined length at offset " + s);
                r.pos = s + Math.abs(o);
            }
            return new ASN1(i, a, o, n, u);
        }, ASN1;
    }(), ASN1Tag = function() {
        function ASN1Tag(e) {
            var r = e.get();
            if (this.tagClass = r >> 6, this.tagConstructed = 0 != (32 & r), this.tagNumber = 31 & r, 
            31 == this.tagNumber) {
                var i = new Int10;
                do {
                    r = e.get(), i.mulAdd(128, 127 & r);
                } while (128 & r);
                this.tagNumber = i.simplify();
            }
        }
        return ASN1Tag.prototype.isUniversal = function() {
            return 0 === this.tagClass;
        }, ASN1Tag.prototype.isEOC = function() {
            return 0 === this.tagClass && 0 === this.tagNumber;
        }, ASN1Tag;
    }(), Arcfour = function() {
        function Arcfour() {
            this.i = 0, this.j = 0, this.S = [];
        }
        return Arcfour.prototype.init = function(e) {
            var r, i, n;
            for (r = 0; r < 256; ++r) this.S[r] = r;
            for (i = 0, r = 0; r < 256; ++r) i = i + this.S[r] + e[r % e.length] & 255, n = this.S[r], 
            this.S[r] = this.S[i], this.S[i] = n;
            this.i = 0, this.j = 0;
        }, Arcfour.prototype.next = function() {
            var e;
            return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, e = this.S[this.i], 
            this.S[this.i] = this.S[this.j], this.S[this.j] = e, this.S[e + this.S[this.i] & 255];
        }, Arcfour;
    }();
    function prng_newstate() {
        return new Arcfour;
    }
    var rng_psize = 256, rng_state, rng_pool = null, rng_pptr;
    if (null == rng_pool) {
        rng_pool = [], rng_pptr = 0;
        var t = void 0;
        if ("undefined" != typeof window && window.crypto && window.crypto.getRandomValues) {
            var z = new Uint32Array(256);
            for (window.crypto.getRandomValues(z), t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = 255 & z[t];
        }
        var count = 0, onMouseMoveListener_1 = function(e) {
            if ((count = count || 0) >= 256 || rng_pptr >= rng_psize) window.removeEventListener ? window.removeEventListener("mousemove", onMouseMoveListener_1, !1) : window.detachEvent && window.detachEvent("onmousemove", onMouseMoveListener_1); else try {
                var r = e.x + e.y;
                rng_pool[rng_pptr++] = 255 & r, count += 1;
            } catch (e) {}
        };
        "undefined" != typeof window && (window.addEventListener ? window.addEventListener("mousemove", onMouseMoveListener_1, !1) : window.attachEvent && window.attachEvent("onmousemove", onMouseMoveListener_1));
    }
    function rng_get_byte() {
        if (null == rng_state) {
            for (rng_state = prng_newstate(); rng_pptr < rng_psize; ) {
                var e = Math.floor(65536 * Math.random());
                rng_pool[rng_pptr++] = 255 & e;
            }
            for (rng_state.init(rng_pool), rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
            rng_pptr = 0;
        }
        return rng_state.next();
    }
    var SecureRandom = function() {
        function SecureRandom() {}
        return SecureRandom.prototype.nextBytes = function(e) {
            for (var r = 0; r < e.length; ++r) e[r] = rng_get_byte();
        }, SecureRandom;
    }();
    function pkcs1pad1(e, r) {
        if (r < e.length + 22) return console.error("Message too long for RSA"), null;
        for (var i = r - e.length - 6, n = "", o = 0; o < i; o += 2) n += "ff";
        return parseBigInt("0001" + n + "00" + e, 16);
    }
    function pkcs1pad2(e, r) {
        if (r < e.length + 11) return console.error("Message too long for RSA"), null;
        for (var i = [], n = e.length - 1; n >= 0 && r > 0; ) {
            var o = e.charCodeAt(n--);
            o < 128 ? i[--r] = o : o > 127 && o < 2048 ? (i[--r] = 63 & o | 128, i[--r] = o >> 6 | 192) : (i[--r] = 63 & o | 128, 
            i[--r] = o >> 6 & 63 | 128, i[--r] = o >> 12 | 224);
        }
        i[--r] = 0;
        for (var s = new SecureRandom, a = []; r > 2; ) {
            for (a[0] = 0; 0 == a[0]; ) s.nextBytes(a);
            i[--r] = a[0];
        }
        return i[--r] = 2, i[--r] = 0, new BigInteger(i);
    }
    var RSAKey = function() {
        function RSAKey() {
            this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, 
            this.dmq1 = null, this.coeff = null;
        }
        return RSAKey.prototype.doPublic = function(e) {
            return e.modPowInt(this.e, this.n);
        }, RSAKey.prototype.doPrivate = function(e) {
            if (null == this.p || null == this.q) return e.modPow(this.d, this.n);
            for (var r = e.mod(this.p).modPow(this.dmp1, this.p), i = e.mod(this.q).modPow(this.dmq1, this.q); r.compareTo(i) < 0; ) r = r.add(this.p);
            return r.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i);
        }, RSAKey.prototype.setPublic = function(e, r) {
            null != e && null != r && e.length > 0 && r.length > 0 ? (this.n = parseBigInt(e, 16), 
            this.e = parseInt(r, 16)) : console.error("Invalid RSA public key");
        }, RSAKey.prototype.encrypt = function(e) {
            var r = this.n.bitLength() + 7 >> 3, i = pkcs1pad2(e, r);
            if (null == i) return null;
            var n = this.doPublic(i);
            if (null == n) return null;
            for (var o = n.toString(16), s = o.length, a = 0; a < 2 * r - s; a++) o = "0" + o;
            return o;
        }, RSAKey.prototype.setPrivate = function(e, r, i) {
            null != e && null != r && e.length > 0 && r.length > 0 ? (this.n = parseBigInt(e, 16), 
            this.e = parseInt(r, 16), this.d = parseBigInt(i, 16)) : console.error("Invalid RSA private key");
        }, RSAKey.prototype.setPrivateEx = function(e, r, i, n, o, s, a, u) {
            null != e && null != r && e.length > 0 && r.length > 0 ? (this.n = parseBigInt(e, 16), 
            this.e = parseInt(r, 16), this.d = parseBigInt(i, 16), this.p = parseBigInt(n, 16), 
            this.q = parseBigInt(o, 16), this.dmp1 = parseBigInt(s, 16), this.dmq1 = parseBigInt(a, 16), 
            this.coeff = parseBigInt(u, 16)) : console.error("Invalid RSA private key");
        }, RSAKey.prototype.generate = function(e, r) {
            var i = new SecureRandom, n = e >> 1;
            this.e = parseInt(r, 16);
            for (var o = new BigInteger(r, 16); ;) {
                for (;this.p = new BigInteger(e - n, 1, i), 0 != this.p.subtract(BigInteger.ONE).gcd(o).compareTo(BigInteger.ONE) || !this.p.isProbablePrime(10); ) ;
                for (;this.q = new BigInteger(n, 1, i), 0 != this.q.subtract(BigInteger.ONE).gcd(o).compareTo(BigInteger.ONE) || !this.q.isProbablePrime(10); ) ;
                if (this.p.compareTo(this.q) <= 0) {
                    var s = this.p;
                    this.p = this.q, this.q = s;
                }
                var a = this.p.subtract(BigInteger.ONE), u = this.q.subtract(BigInteger.ONE), l = a.multiply(u);
                if (0 == l.gcd(o).compareTo(BigInteger.ONE)) {
                    this.n = this.p.multiply(this.q), this.d = o.modInverse(l), this.dmp1 = this.d.mod(a), 
                    this.dmq1 = this.d.mod(u), this.coeff = this.q.modInverse(this.p);
                    break;
                }
            }
        }, RSAKey.prototype.decrypt = function(e) {
            var r = parseBigInt(e, 16), i = this.doPrivate(r);
            return null == i ? null : pkcs1unpad2$1(i, this.n.bitLength() + 7 >> 3);
        }, RSAKey.prototype.generateAsync = function(e, r, i) {
            var n = new SecureRandom, o = e >> 1;
            this.e = parseInt(r, 16);
            var s = new BigInteger(r, 16), a = this, loop1 = function() {
                var loop4 = function() {
                    if (a.p.compareTo(a.q) <= 0) {
                        var e = a.p;
                        a.p = a.q, a.q = e;
                    }
                    var r = a.p.subtract(BigInteger.ONE), n = a.q.subtract(BigInteger.ONE), o = r.multiply(n);
                    0 == o.gcd(s).compareTo(BigInteger.ONE) ? (a.n = a.p.multiply(a.q), a.d = s.modInverse(o), 
                    a.dmp1 = a.d.mod(r), a.dmq1 = a.d.mod(n), a.coeff = a.q.modInverse(a.p), setTimeout((function() {
                        i();
                    }), 0)) : setTimeout(loop1, 0);
                }, loop3 = function() {
                    a.q = nbi(), a.q.fromNumberAsync(o, 1, n, (function() {
                        a.q.subtract(BigInteger.ONE).gcda(s, (function(e) {
                            0 == e.compareTo(BigInteger.ONE) && a.q.isProbablePrime(10) ? setTimeout(loop4, 0) : setTimeout(loop3, 0);
                        }));
                    }));
                }, loop2 = function() {
                    a.p = nbi(), a.p.fromNumberAsync(e - o, 1, n, (function() {
                        a.p.subtract(BigInteger.ONE).gcda(s, (function(e) {
                            0 == e.compareTo(BigInteger.ONE) && a.p.isProbablePrime(10) ? setTimeout(loop3, 0) : setTimeout(loop2, 0);
                        }));
                    }));
                };
                setTimeout(loop2, 0);
            };
            setTimeout(loop1, 0);
        }, RSAKey.prototype.sign = function(e, r, i) {
            var n = pkcs1pad1(getDigestHeader(i) + r(e).toString(), this.n.bitLength() / 4);
            if (null == n) return null;
            var o = this.doPrivate(n);
            if (null == o) return null;
            var s = o.toString(16);
            return 0 == (1 & s.length) ? s : "0" + s;
        }, RSAKey.prototype.verify = function(e, r, i) {
            var n = parseBigInt(r, 16), o = this.doPublic(n);
            return null == o ? null : removeDigestHeader(o.toString(16).replace(/^1f+00/, "")) == i(e).toString();
        }, RSAKey;
    }();
    function pkcs1unpad2$1(e, r) {
        for (var i = e.toByteArray(), n = 0; n < i.length && 0 == i[n]; ) ++n;
        if (i.length - n != r - 1 || 2 != i[n]) return null;
        for (++n; 0 != i[n]; ) if (++n >= i.length) return null;
        for (var o = ""; ++n < i.length; ) {
            var s = 255 & i[n];
            s < 128 ? o += String.fromCharCode(s) : s > 191 && s < 224 ? (o += String.fromCharCode((31 & s) << 6 | 63 & i[n + 1]), 
            ++n) : (o += String.fromCharCode((15 & s) << 12 | (63 & i[n + 1]) << 6 | 63 & i[n + 2]), 
            n += 2);
        }
        return o;
    }
    var DIGEST_HEADERS = {
        md2: "3020300c06082a864886f70d020205000410",
        md5: "3020300c06082a864886f70d020505000410",
        sha1: "3021300906052b0e03021a05000414",
        sha224: "302d300d06096086480165030402040500041c",
        sha256: "3031300d060960864801650304020105000420",
        sha384: "3041300d060960864801650304020205000430",
        sha512: "3051300d060960864801650304020305000440",
        ripemd160: "3021300906052b2403020105000414"
    };
    function getDigestHeader(e) {
        return DIGEST_HEADERS[e] || "";
    }
    function removeDigestHeader(e) {
        for (var r in DIGEST_HEADERS) if (DIGEST_HEADERS.hasOwnProperty(r)) {
            var i = DIGEST_HEADERS[r], n = i.length;
            if (e.substr(0, n) == i) return e.substr(n);
        }
        return e;
    }
    /*!
    Copyright (c) 2011, Yahoo! Inc. All rights reserved.
    Code licensed under the BSD License:
    http://developer.yahoo.com/yui/license.html
    version: 2.9.0
    */    var YAHOO = {};
    YAHOO.lang = {
        extend: function(e, r, i) {
            if (!r || !e) throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
            var F = function() {};
            if (F.prototype = r.prototype, e.prototype = new F, e.prototype.constructor = e, 
            e.superclass = r.prototype, r.prototype.constructor == Object.prototype.constructor && (r.prototype.constructor = r), 
            i) {
                var n;
                for (n in i) e.prototype[n] = i[n];
                var _IEEnumFix = function() {}, o = [ "toString", "valueOf" ];
                try {
                    /MSIE/.test(navigator.userAgent) && (_IEEnumFix = function(e, r) {
                        for (n = 0; n < o.length; n += 1) {
                            var i = o[n], s = r[i];
                            "function" == typeof s && s != Object.prototype[i] && (e[i] = s);
                        }
                    });
                } catch (e) {}
                _IEEnumFix(e.prototype, i);
            }
        }
    };
    /**
     * @fileOverview
     * @name asn1-1.0.js
     * @author Kenji Urushima kenji.urushima@gmail.com
     * @version asn1 1.0.13 (2017-Jun-02)
     * @since jsrsasign 2.1
     * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
     */
    var KJUR = {};
    void 0 !== KJUR.asn1 && KJUR.asn1 || (KJUR.asn1 = {}), KJUR.asn1.ASN1Util = new function() {
        this.integerToByteHex = function(e) {
            var r = e.toString(16);
            return r.length % 2 == 1 && (r = "0" + r), r;
        }, this.bigIntToMinTwosComplementsHex = function(e) {
            var r = e.toString(16);
            if ("-" != r.substr(0, 1)) r.length % 2 == 1 ? r = "0" + r : r.match(/^[0-7]/) || (r = "00" + r); else {
                var i = r.substr(1).length;
                i % 2 == 1 ? i += 1 : r.match(/^[0-7]/) || (i += 2);
                for (var n = "", o = 0; o < i; o++) n += "f";
                r = new BigInteger(n, 16).xor(e).add(BigInteger.ONE).toString(16).replace(/^-/, "");
            }
            return r;
        }, this.getPEMStringFromHex = function(e, r) {
            return hextopem(e, r);
        }, this.newObject = function(e) {
            var r = KJUR.asn1, i = r.DERBoolean, n = r.DERInteger, o = r.DERBitString, s = r.DEROctetString, a = r.DERNull, u = r.DERObjectIdentifier, l = r.DEREnumerated, f = r.DERUTF8String, h = r.DERNumericString, p = r.DERPrintableString, c = r.DERTeletexString, d = r.DERIA5String, g = r.DERUTCTime, m = r.DERGeneralizedTime, y = r.DERSequence, v = r.DERSet, b = r.DERTaggedObject, S = r.ASN1Util.newObject, w = Object.keys(e);
            if (1 != w.length) throw "key of param shall be only one.";
            var R = w[0];
            if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + R + ":")) throw "undefined key: " + R;
            if ("bool" == R) return new i(e[R]);
            if ("int" == R) return new n(e[R]);
            if ("bitstr" == R) return new o(e[R]);
            if ("octstr" == R) return new s(e[R]);
            if ("null" == R) return new a(e[R]);
            if ("oid" == R) return new u(e[R]);
            if ("enum" == R) return new l(e[R]);
            if ("utf8str" == R) return new f(e[R]);
            if ("numstr" == R) return new h(e[R]);
            if ("prnstr" == R) return new p(e[R]);
            if ("telstr" == R) return new c(e[R]);
            if ("ia5str" == R) return new d(e[R]);
            if ("utctime" == R) return new g(e[R]);
            if ("gentime" == R) return new m(e[R]);
            if ("seq" == R) {
                for (var O = e[R], B = [], T = 0; T < O.length; T++) {
                    var E = S(O[T]);
                    B.push(E);
                }
                return new y({
                    array: B
                });
            }
            if ("set" == R) {
                for (O = e[R], B = [], T = 0; T < O.length; T++) {
                    E = S(O[T]);
                    B.push(E);
                }
                return new v({
                    array: B
                });
            }
            if ("tag" == R) {
                var A = e[R];
                if ("[object Array]" === Object.prototype.toString.call(A) && 3 == A.length) {
                    var _ = S(A[2]);
                    return new b({
                        tag: A[0],
                        explicit: A[1],
                        obj: _
                    });
                }
                var I = {};
                if (void 0 !== A.explicit && (I.explicit = A.explicit), void 0 !== A.tag && (I.tag = A.tag), 
                void 0 === A.obj) throw "obj shall be specified for 'tag'.";
                return I.obj = S(A.obj), new b(I);
            }
        }, this.jsonToASN1HEX = function(e) {
            return this.newObject(e).getEncodedHex();
        };
    }, KJUR.asn1.ASN1Util.oidHexToInt = function(e) {
        for (var r = "", i = parseInt(e.substr(0, 2), 16), n = (r = Math.floor(i / 40) + "." + i % 40, 
        ""), o = 2; o < e.length; o += 2) {
            var s = ("00000000" + parseInt(e.substr(o, 2), 16).toString(2)).slice(-8);
            if (n += s.substr(1, 7), "0" == s.substr(0, 1)) r = r + "." + new BigInteger(n, 2).toString(10), 
            n = "";
        }
        return r;
    }, KJUR.asn1.ASN1Util.oidIntToHex = function(e) {
        var itox = function(e) {
            var r = e.toString(16);
            return 1 == r.length && (r = "0" + r), r;
        }, roidtox = function(e) {
            var r = "", i = new BigInteger(e, 10).toString(2), n = 7 - i.length % 7;
            7 == n && (n = 0);
            for (var o = "", s = 0; s < n; s++) o += "0";
            i = o + i;
            for (s = 0; s < i.length - 1; s += 7) {
                var a = i.substr(s, 7);
                s != i.length - 7 && (a = "1" + a), r += itox(parseInt(a, 2));
            }
            return r;
        };
        if (!e.match(/^[0-9.]+$/)) throw "malformed oid string: " + e;
        var r = "", i = e.split("."), n = 40 * parseInt(i[0]) + parseInt(i[1]);
        r += itox(n), i.splice(0, 2);
        for (var o = 0; o < i.length; o++) r += roidtox(i[o]);
        return r;
    }, KJUR.asn1.ASN1Object = function() {
        this.getLengthHexFromValue = function() {
            if (void 0 === this.hV || null == this.hV) throw "this.hV is null or undefined.";
            if (this.hV.length % 2 == 1) throw "value hex must be even length: n=0,v=" + this.hV;
            var e = this.hV.length / 2, r = e.toString(16);
            if (r.length % 2 == 1 && (r = "0" + r), e < 128) return r;
            var i = r.length / 2;
            if (i > 15) throw "ASN.1 length too long to represent by 8x: n = " + e.toString(16);
            return (128 + i).toString(16) + r;
        }, this.getEncodedHex = function() {
            return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(), 
            this.hL = this.getLengthHexFromValue(), this.hTLV = this.hT + this.hL + this.hV, 
            this.isModified = !1), this.hTLV;
        }, this.getValueHex = function() {
            return this.getEncodedHex(), this.hV;
        }, this.getFreshValueHex = function() {
            return "";
        };
    }, KJUR.asn1.DERAbstractString = function(e) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this), this.getString = function() {
            return this.s;
        }, this.setString = function(e) {
            this.hTLV = null, this.isModified = !0, this.s = e, this.hV = stohex(this.s);
        }, this.setStringHex = function(e) {
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = e;
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && ("string" == typeof e ? this.setString(e) : void 0 !== e.str ? this.setString(e.str) : void 0 !== e.hex && this.setStringHex(e.hex));
    }, YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractTime = function(e) {
        KJUR.asn1.DERAbstractTime.superclass.constructor.call(this), this.localDateToUTC = function(e) {
            return utc = e.getTime() + 6e4 * e.getTimezoneOffset(), new Date(utc);
        }, this.formatDate = function(e, r, i) {
            var n = this.zeroPadding, o = this.localDateToUTC(e), s = String(o.getFullYear());
            "utc" == r && (s = s.substr(2, 2));
            var a = s + n(String(o.getMonth() + 1), 2) + n(String(o.getDate()), 2) + n(String(o.getHours()), 2) + n(String(o.getMinutes()), 2) + n(String(o.getSeconds()), 2);
            if (!0 === i) {
                var u = o.getMilliseconds();
                if (0 != u) {
                    var l = n(String(u), 3);
                    a = a + "." + (l = l.replace(/[0]+$/, ""));
                }
            }
            return a + "Z";
        }, this.zeroPadding = function(e, r) {
            return e.length >= r ? e : new Array(r - e.length + 1).join("0") + e;
        }, this.getString = function() {
            return this.s;
        }, this.setString = function(e) {
            this.hTLV = null, this.isModified = !0, this.s = e, this.hV = stohex(e);
        }, this.setByDateValue = function(e, r, i, n, o, s) {
            var a = new Date(Date.UTC(e, r - 1, i, n, o, s, 0));
            this.setByDate(a);
        }, this.getFreshValueHex = function() {
            return this.hV;
        };
    }, YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object), KJUR.asn1.DERAbstractStructured = function(e) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this), this.setByASN1ObjectArray = function(e) {
            this.hTLV = null, this.isModified = !0, this.asn1Array = e;
        }, this.appendASN1Object = function(e) {
            this.hTLV = null, this.isModified = !0, this.asn1Array.push(e);
        }, this.asn1Array = new Array, void 0 !== e && void 0 !== e.array && (this.asn1Array = e.array);
    }, YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object), KJUR.asn1.DERBoolean = function() {
        KJUR.asn1.DERBoolean.superclass.constructor.call(this), this.hT = "01", this.hTLV = "0101ff";
    }, YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object), KJUR.asn1.DERInteger = function(e) {
        KJUR.asn1.DERInteger.superclass.constructor.call(this), this.hT = "02", this.setByBigInteger = function(e) {
            this.hTLV = null, this.isModified = !0, this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(e);
        }, this.setByInteger = function(e) {
            var r = new BigInteger(String(e), 10);
            this.setByBigInteger(r);
        }, this.setValueHex = function(e) {
            this.hV = e;
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && (void 0 !== e.bigint ? this.setByBigInteger(e.bigint) : void 0 !== e.int ? this.setByInteger(e.int) : "number" == typeof e ? this.setByInteger(e) : void 0 !== e.hex && this.setValueHex(e.hex));
    }, YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object), KJUR.asn1.DERBitString = function(e) {
        if (void 0 !== e && void 0 !== e.obj) {
            var r = KJUR.asn1.ASN1Util.newObject(e.obj);
            e.hex = "00" + r.getEncodedHex();
        }
        KJUR.asn1.DERBitString.superclass.constructor.call(this), this.hT = "03", this.setHexValueIncludingUnusedBits = function(e) {
            this.hTLV = null, this.isModified = !0, this.hV = e;
        }, this.setUnusedBitsAndHexValue = function(e, r) {
            if (e < 0 || 7 < e) throw "unused bits shall be from 0 to 7: u = " + e;
            var i = "0" + e;
            this.hTLV = null, this.isModified = !0, this.hV = i + r;
        }, this.setByBinaryString = function(e) {
            var r = 8 - (e = e.replace(/0+$/, "")).length % 8;
            8 == r && (r = 0);
            for (var i = 0; i <= r; i++) e += "0";
            var n = "";
            for (i = 0; i < e.length - 1; i += 8) {
                var o = e.substr(i, 8), s = parseInt(o, 2).toString(16);
                1 == s.length && (s = "0" + s), n += s;
            }
            this.hTLV = null, this.isModified = !0, this.hV = "0" + r + n;
        }, this.setByBooleanArray = function(e) {
            for (var r = "", i = 0; i < e.length; i++) 1 == e[i] ? r += "1" : r += "0";
            this.setByBinaryString(r);
        }, this.newFalseArray = function(e) {
            for (var r = new Array(e), i = 0; i < e; i++) r[i] = !1;
            return r;
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && ("string" == typeof e && e.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(e) : void 0 !== e.hex ? this.setHexValueIncludingUnusedBits(e.hex) : void 0 !== e.bin ? this.setByBinaryString(e.bin) : void 0 !== e.array && this.setByBooleanArray(e.array));
    }, YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object), KJUR.asn1.DEROctetString = function(e) {
        if (void 0 !== e && void 0 !== e.obj) {
            var r = KJUR.asn1.ASN1Util.newObject(e.obj);
            e.hex = r.getEncodedHex();
        }
        KJUR.asn1.DEROctetString.superclass.constructor.call(this, e), this.hT = "04";
    }, YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNull = function() {
        KJUR.asn1.DERNull.superclass.constructor.call(this), this.hT = "05", this.hTLV = "0500";
    }, YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object), KJUR.asn1.DERObjectIdentifier = function(e) {
        var itox = function(e) {
            var r = e.toString(16);
            return 1 == r.length && (r = "0" + r), r;
        }, roidtox = function(e) {
            var r = "", i = new BigInteger(e, 10).toString(2), n = 7 - i.length % 7;
            7 == n && (n = 0);
            for (var o = "", s = 0; s < n; s++) o += "0";
            i = o + i;
            for (s = 0; s < i.length - 1; s += 7) {
                var a = i.substr(s, 7);
                s != i.length - 7 && (a = "1" + a), r += itox(parseInt(a, 2));
            }
            return r;
        };
        KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this), this.hT = "06", 
        this.setValueHex = function(e) {
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = e;
        }, this.setValueOidString = function(e) {
            if (!e.match(/^[0-9.]+$/)) throw "malformed oid string: " + e;
            var r = "", i = e.split("."), n = 40 * parseInt(i[0]) + parseInt(i[1]);
            r += itox(n), i.splice(0, 2);
            for (var o = 0; o < i.length; o++) r += roidtox(i[o]);
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = r;
        }, this.setValueName = function(e) {
            var r = KJUR.asn1.x509.OID.name2oid(e);
            if ("" === r) throw "DERObjectIdentifier oidName undefined: " + e;
            this.setValueOidString(r);
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && ("string" == typeof e ? e.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(e) : this.setValueName(e) : void 0 !== e.oid ? this.setValueOidString(e.oid) : void 0 !== e.hex ? this.setValueHex(e.hex) : void 0 !== e.name && this.setValueName(e.name));
    }, YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object), KJUR.asn1.DEREnumerated = function(e) {
        KJUR.asn1.DEREnumerated.superclass.constructor.call(this), this.hT = "0a", this.setByBigInteger = function(e) {
            this.hTLV = null, this.isModified = !0, this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(e);
        }, this.setByInteger = function(e) {
            var r = new BigInteger(String(e), 10);
            this.setByBigInteger(r);
        }, this.setValueHex = function(e) {
            this.hV = e;
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && (void 0 !== e.int ? this.setByInteger(e.int) : "number" == typeof e ? this.setByInteger(e) : void 0 !== e.hex && this.setValueHex(e.hex));
    }, YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object), KJUR.asn1.DERUTF8String = function(e) {
        KJUR.asn1.DERUTF8String.superclass.constructor.call(this, e), this.hT = "0c";
    }, YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERNumericString = function(e) {
        KJUR.asn1.DERNumericString.superclass.constructor.call(this, e), this.hT = "12";
    }, YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERPrintableString = function(e) {
        KJUR.asn1.DERPrintableString.superclass.constructor.call(this, e), this.hT = "13";
    }, YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString), 
    KJUR.asn1.DERTeletexString = function(e) {
        KJUR.asn1.DERTeletexString.superclass.constructor.call(this, e), this.hT = "14";
    }, YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString), KJUR.asn1.DERIA5String = function(e) {
        KJUR.asn1.DERIA5String.superclass.constructor.call(this, e), this.hT = "16";
    }, YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString), KJUR.asn1.DERUTCTime = function(e) {
        KJUR.asn1.DERUTCTime.superclass.constructor.call(this, e), this.hT = "17", this.setByDate = function(e) {
            this.hTLV = null, this.isModified = !0, this.date = e, this.s = this.formatDate(this.date, "utc"), 
            this.hV = stohex(this.s);
        }, this.getFreshValueHex = function() {
            return void 0 === this.date && void 0 === this.s && (this.date = new Date, this.s = this.formatDate(this.date, "utc"), 
            this.hV = stohex(this.s)), this.hV;
        }, void 0 !== e && (void 0 !== e.str ? this.setString(e.str) : "string" == typeof e && e.match(/^[0-9]{12}Z$/) ? this.setString(e) : void 0 !== e.hex ? this.setStringHex(e.hex) : void 0 !== e.date && this.setByDate(e.date));
    }, YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERGeneralizedTime = function(e) {
        KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, e), this.hT = "18", 
        this.withMillis = !1, this.setByDate = function(e) {
            this.hTLV = null, this.isModified = !0, this.date = e, this.s = this.formatDate(this.date, "gen", this.withMillis), 
            this.hV = stohex(this.s);
        }, this.getFreshValueHex = function() {
            return void 0 === this.date && void 0 === this.s && (this.date = new Date, this.s = this.formatDate(this.date, "gen", this.withMillis), 
            this.hV = stohex(this.s)), this.hV;
        }, void 0 !== e && (void 0 !== e.str ? this.setString(e.str) : "string" == typeof e && e.match(/^[0-9]{14}Z$/) ? this.setString(e) : void 0 !== e.hex ? this.setStringHex(e.hex) : void 0 !== e.date && this.setByDate(e.date), 
        !0 === e.millis && (this.withMillis = !0));
    }, YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime), KJUR.asn1.DERSequence = function(e) {
        KJUR.asn1.DERSequence.superclass.constructor.call(this, e), this.hT = "30", this.getFreshValueHex = function() {
            for (var e = "", r = 0; r < this.asn1Array.length; r++) {
                e += this.asn1Array[r].getEncodedHex();
            }
            return this.hV = e, this.hV;
        };
    }, YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERSet = function(e) {
        KJUR.asn1.DERSet.superclass.constructor.call(this, e), this.hT = "31", this.sortFlag = !0, 
        this.getFreshValueHex = function() {
            for (var e = new Array, r = 0; r < this.asn1Array.length; r++) {
                var i = this.asn1Array[r];
                e.push(i.getEncodedHex());
            }
            return 1 == this.sortFlag && e.sort(), this.hV = e.join(""), this.hV;
        }, void 0 !== e && void 0 !== e.sortflag && 0 == e.sortflag && (this.sortFlag = !1);
    }, YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured), KJUR.asn1.DERTaggedObject = function(e) {
        KJUR.asn1.DERTaggedObject.superclass.constructor.call(this), this.hT = "a0", this.hV = "", 
        this.isExplicit = !0, this.asn1Object = null, this.setASN1Object = function(e, r, i) {
            this.hT = r, this.isExplicit = e, this.asn1Object = i, this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(), 
            this.hTLV = null, this.isModified = !0) : (this.hV = null, this.hTLV = i.getEncodedHex(), 
            this.hTLV = this.hTLV.replace(/^../, r), this.isModified = !1);
        }, this.getFreshValueHex = function() {
            return this.hV;
        }, void 0 !== e && (void 0 !== e.tag && (this.hT = e.tag), void 0 !== e.explicit && (this.isExplicit = e.explicit), 
        void 0 !== e.obj && (this.asn1Object = e.obj, this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)));
    }, YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);
    var __extends = (extendStatics = function(e, r) {
        return extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(e, r) {
            e.__proto__ = r;
        } || function(e, r) {
            for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
        }, extendStatics(e, r);
    }, function(e, r) {
        if ("function" != typeof r && null !== r) throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
        function __() {
            this.constructor = e;
        }
        extendStatics(e, r), e.prototype = null === r ? Object.create(r) : (__.prototype = r.prototype, 
        new __);
    }), extendStatics, JSEncryptRSAKey = function(e) {
        function JSEncryptRSAKey(r) {
            var i = e.call(this) || this;
            return r && ("string" == typeof r ? i.parseKey(r) : (JSEncryptRSAKey.hasPrivateKeyProperty(r) || JSEncryptRSAKey.hasPublicKeyProperty(r)) && i.parsePropertiesFrom(r)), 
            i;
        }
        return __extends(JSEncryptRSAKey, e), JSEncryptRSAKey.prototype.parseKey = function(e) {
            try {
                var r = 0, i = 0, n = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(e) ? Hex.decode(e) : Base64.unarmor(e), o = ASN1.decode(n);
                if (3 === o.sub.length && (o = o.sub[2].sub[0]), 9 === o.sub.length) {
                    r = o.sub[1].getHexStringValue(), this.n = parseBigInt(r, 16), i = o.sub[2].getHexStringValue(), 
                    this.e = parseInt(i, 16);
                    var s = o.sub[3].getHexStringValue();
                    this.d = parseBigInt(s, 16);
                    var a = o.sub[4].getHexStringValue();
                    this.p = parseBigInt(a, 16);
                    var u = o.sub[5].getHexStringValue();
                    this.q = parseBigInt(u, 16);
                    var l = o.sub[6].getHexStringValue();
                    this.dmp1 = parseBigInt(l, 16);
                    var f = o.sub[7].getHexStringValue();
                    this.dmq1 = parseBigInt(f, 16);
                    var h = o.sub[8].getHexStringValue();
                    this.coeff = parseBigInt(h, 16);
                } else {
                    if (2 !== o.sub.length) return !1;
                    if (o.sub[0].sub) {
                        var p = o.sub[1].sub[0];
                        r = p.sub[0].getHexStringValue(), this.n = parseBigInt(r, 16), i = p.sub[1].getHexStringValue(), 
                        this.e = parseInt(i, 16);
                    } else r = o.sub[0].getHexStringValue(), this.n = parseBigInt(r, 16), i = o.sub[1].getHexStringValue(), 
                    this.e = parseInt(i, 16);
                }
                return !0;
            } catch (e) {
                return !1;
            }
        }, JSEncryptRSAKey.prototype.getPrivateBaseKey = function() {
            var e = {
                array: [ new KJUR.asn1.DERInteger({
                    int: 0
                }), new KJUR.asn1.DERInteger({
                    bigint: this.n
                }), new KJUR.asn1.DERInteger({
                    int: this.e
                }), new KJUR.asn1.DERInteger({
                    bigint: this.d
                }), new KJUR.asn1.DERInteger({
                    bigint: this.p
                }), new KJUR.asn1.DERInteger({
                    bigint: this.q
                }), new KJUR.asn1.DERInteger({
                    bigint: this.dmp1
                }), new KJUR.asn1.DERInteger({
                    bigint: this.dmq1
                }), new KJUR.asn1.DERInteger({
                    bigint: this.coeff
                }) ]
            };
            return new KJUR.asn1.DERSequence(e).getEncodedHex();
        }, JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function() {
            return hex2b64(this.getPrivateBaseKey());
        }, JSEncryptRSAKey.prototype.getPublicBaseKey = function() {
            var e = new KJUR.asn1.DERSequence({
                array: [ new KJUR.asn1.DERObjectIdentifier({
                    oid: "1.2.840.113549.1.1.1"
                }), new KJUR.asn1.DERNull ]
            }), r = new KJUR.asn1.DERSequence({
                array: [ new KJUR.asn1.DERInteger({
                    bigint: this.n
                }), new KJUR.asn1.DERInteger({
                    int: this.e
                }) ]
            }), i = new KJUR.asn1.DERBitString({
                hex: "00" + r.getEncodedHex()
            });
            return new KJUR.asn1.DERSequence({
                array: [ e, i ]
            }).getEncodedHex();
        }, JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function() {
            return hex2b64(this.getPublicBaseKey());
        }, JSEncryptRSAKey.wordwrap = function(e, r) {
            if (!e) return e;
            var i = "(.{1," + (r = r || 64) + "})( +|$\n?)|(.{1," + r + "})";
            return e.match(RegExp(i, "g")).join("\n");
        }, JSEncryptRSAKey.prototype.getPrivateKey = function() {
            var e = "-----BEGIN RSA PRIVATE KEY-----\n";
            return e += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n", e += "-----END RSA PRIVATE KEY-----";
        }, JSEncryptRSAKey.prototype.getPublicKey = function() {
            var e = "-----BEGIN PUBLIC KEY-----\n";
            return e += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n", e += "-----END PUBLIC KEY-----";
        }, JSEncryptRSAKey.hasPublicKeyProperty = function(e) {
            return (e = e || {}).hasOwnProperty("n") && e.hasOwnProperty("e");
        }, JSEncryptRSAKey.hasPrivateKeyProperty = function(e) {
            return (e = e || {}).hasOwnProperty("n") && e.hasOwnProperty("e") && e.hasOwnProperty("d") && e.hasOwnProperty("p") && e.hasOwnProperty("q") && e.hasOwnProperty("dmp1") && e.hasOwnProperty("dmq1") && e.hasOwnProperty("coeff");
        }, JSEncryptRSAKey.prototype.parsePropertiesFrom = function(e) {
            this.n = e.n, this.e = e.e, e.hasOwnProperty("d") && (this.d = e.d, this.p = e.p, 
            this.q = e.q, this.dmp1 = e.dmp1, this.dmq1 = e.dmq1, this.coeff = e.coeff);
        }, JSEncryptRSAKey;
    }(RSAKey), commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, src = {
        exports: {}
    }, indexLight = {
        exports: {}
    }, indexMinimal = {}, minimal = {}, aspromise, hasRequiredAspromise;
    function requireAspromise() {
        if (hasRequiredAspromise) return aspromise;
        return hasRequiredAspromise = 1, aspromise = function asPromise(e, r) {
            var i = new Array(arguments.length - 1), n = 0, o = 2, s = !0;
            for (;o < arguments.length; ) i[n++] = arguments[o++];
            return new Promise((function executor(o, a) {
                i[n] = function callback(e) {
                    if (s) if (s = !1, e) a(e); else {
                        for (var r = new Array(arguments.length - 1), i = 0; i < r.length; ) r[i++] = arguments[i];
                        o.apply(null, r);
                    }
                };
                try {
                    e.apply(r || null, i);
                } catch (e) {
                    s && (s = !1, a(e));
                }
            }));
        }, aspromise;
    }
    var base64$1 = {}, hasRequiredBase64, eventemitter, hasRequiredEventemitter, float, hasRequiredFloat, inquire_1, hasRequiredInquire;
    function requireBase64() {
        return hasRequiredBase64 || (hasRequiredBase64 = 1, function(e) {
            var r = e;
            r.length = function length(e) {
                var r = e.length;
                if (!r) return 0;
                for (var i = 0; --r % 4 > 1 && "=" === e.charAt(r); ) ++i;
                return Math.ceil(3 * e.length) / 4 - i;
            };
            for (var i = new Array(64), n = new Array(123), o = 0; o < 64; ) n[i[o] = o < 26 ? o + 65 : o < 52 ? o + 71 : o < 62 ? o - 4 : o - 59 | 43] = o++;
            r.encode = function encode(e, r, n) {
                for (var o, s = null, a = [], u = 0, l = 0; r < n; ) {
                    var f = e[r++];
                    switch (l) {
                      case 0:
                        a[u++] = i[f >> 2], o = (3 & f) << 4, l = 1;
                        break;

                      case 1:
                        a[u++] = i[o | f >> 4], o = (15 & f) << 2, l = 2;
                        break;

                      case 2:
                        a[u++] = i[o | f >> 6], a[u++] = i[63 & f], l = 0;
                    }
                    u > 8191 && ((s || (s = [])).push(String.fromCharCode.apply(String, a)), u = 0);
                }
                return l && (a[u++] = i[o], a[u++] = 61, 1 === l && (a[u++] = 61)), s ? (u && s.push(String.fromCharCode.apply(String, a.slice(0, u))), 
                s.join("")) : String.fromCharCode.apply(String, a.slice(0, u));
            };
            var s = "invalid encoding";
            r.decode = function decode(e, r, i) {
                for (var o, a = i, u = 0, l = 0; l < e.length; ) {
                    var f = e.charCodeAt(l++);
                    if (61 === f && u > 1) break;
                    if (void 0 === (f = n[f])) throw Error(s);
                    switch (u) {
                      case 0:
                        o = f, u = 1;
                        break;

                      case 1:
                        r[i++] = o << 2 | (48 & f) >> 4, o = f, u = 2;
                        break;

                      case 2:
                        r[i++] = (15 & o) << 4 | (60 & f) >> 2, o = f, u = 3;
                        break;

                      case 3:
                        r[i++] = (3 & o) << 6 | f, u = 0;
                    }
                }
                if (1 === u) throw Error(s);
                return i - a;
            }, r.test = function test(e) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e);
            };
        }(base64$1)), base64$1;
    }
    function requireEventemitter() {
        if (hasRequiredEventemitter) return eventemitter;
        function EventEmitter() {
            this._listeners = {};
        }
        return hasRequiredEventemitter = 1, eventemitter = EventEmitter, EventEmitter.prototype.on = function on(e, r, i) {
            return (this._listeners[e] || (this._listeners[e] = [])).push({
                fn: r,
                ctx: i || this
            }), this;
        }, EventEmitter.prototype.off = function off(e, r) {
            if (void 0 === e) this._listeners = {}; else if (void 0 === r) this._listeners[e] = []; else for (var i = this._listeners[e], n = 0; n < i.length; ) i[n].fn === r ? i.splice(n, 1) : ++n;
            return this;
        }, EventEmitter.prototype.emit = function emit(e) {
            var r = this._listeners[e];
            if (r) {
                for (var i = [], n = 1; n < arguments.length; ) i.push(arguments[n++]);
                for (n = 0; n < r.length; ) r[n].fn.apply(r[n++].ctx, i);
            }
            return this;
        }, eventemitter;
    }
    function requireFloat() {
        if (hasRequiredFloat) return float;
        function factory(e) {
            return "undefined" != typeof Float32Array ? function() {
                var r = new Float32Array([ -0 ]), i = new Uint8Array(r.buffer), n = 128 === i[3];
                function writeFloat_f32_cpy(e, n, o) {
                    r[0] = e, n[o] = i[0], n[o + 1] = i[1], n[o + 2] = i[2], n[o + 3] = i[3];
                }
                function writeFloat_f32_rev(e, n, o) {
                    r[0] = e, n[o] = i[3], n[o + 1] = i[2], n[o + 2] = i[1], n[o + 3] = i[0];
                }
                function readFloat_f32_cpy(e, n) {
                    return i[0] = e[n], i[1] = e[n + 1], i[2] = e[n + 2], i[3] = e[n + 3], r[0];
                }
                function readFloat_f32_rev(e, n) {
                    return i[3] = e[n], i[2] = e[n + 1], i[1] = e[n + 2], i[0] = e[n + 3], r[0];
                }
                e.writeFloatLE = n ? writeFloat_f32_cpy : writeFloat_f32_rev, e.writeFloatBE = n ? writeFloat_f32_rev : writeFloat_f32_cpy, 
                e.readFloatLE = n ? readFloat_f32_cpy : readFloat_f32_rev, e.readFloatBE = n ? readFloat_f32_rev : readFloat_f32_cpy;
            }() : function() {
                function writeFloat_ieee754(e, r, i, n) {
                    var o = r < 0 ? 1 : 0;
                    if (o && (r = -r), 0 === r) e(1 / r > 0 ? 0 : 2147483648, i, n); else if (isNaN(r)) e(2143289344, i, n); else if (r > 34028234663852886e22) e((o << 31 | 2139095040) >>> 0, i, n); else if (r < 11754943508222875e-54) e((o << 31 | Math.round(r / 1401298464324817e-60)) >>> 0, i, n); else {
                        var s = Math.floor(Math.log(r) / Math.LN2);
                        e((o << 31 | s + 127 << 23 | 8388607 & Math.round(r * Math.pow(2, -s) * 8388608)) >>> 0, i, n);
                    }
                }
                function readFloat_ieee754(e, r, i) {
                    var n = e(r, i), o = 2 * (n >> 31) + 1, s = n >>> 23 & 255, a = 8388607 & n;
                    return 255 === s ? a ? NaN : o * (1 / 0) : 0 === s ? 1401298464324817e-60 * o * a : o * Math.pow(2, s - 150) * (a + 8388608);
                }
                e.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE), e.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE), 
                e.readFloatLE = readFloat_ieee754.bind(null, readUintLE), e.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
            }(), "undefined" != typeof Float64Array ? function() {
                var r = new Float64Array([ -0 ]), i = new Uint8Array(r.buffer), n = 128 === i[7];
                function writeDouble_f64_cpy(e, n, o) {
                    r[0] = e, n[o] = i[0], n[o + 1] = i[1], n[o + 2] = i[2], n[o + 3] = i[3], n[o + 4] = i[4], 
                    n[o + 5] = i[5], n[o + 6] = i[6], n[o + 7] = i[7];
                }
                function writeDouble_f64_rev(e, n, o) {
                    r[0] = e, n[o] = i[7], n[o + 1] = i[6], n[o + 2] = i[5], n[o + 3] = i[4], n[o + 4] = i[3], 
                    n[o + 5] = i[2], n[o + 6] = i[1], n[o + 7] = i[0];
                }
                function readDouble_f64_cpy(e, n) {
                    return i[0] = e[n], i[1] = e[n + 1], i[2] = e[n + 2], i[3] = e[n + 3], i[4] = e[n + 4], 
                    i[5] = e[n + 5], i[6] = e[n + 6], i[7] = e[n + 7], r[0];
                }
                function readDouble_f64_rev(e, n) {
                    return i[7] = e[n], i[6] = e[n + 1], i[5] = e[n + 2], i[4] = e[n + 3], i[3] = e[n + 4], 
                    i[2] = e[n + 5], i[1] = e[n + 6], i[0] = e[n + 7], r[0];
                }
                e.writeDoubleLE = n ? writeDouble_f64_cpy : writeDouble_f64_rev, e.writeDoubleBE = n ? writeDouble_f64_rev : writeDouble_f64_cpy, 
                e.readDoubleLE = n ? readDouble_f64_cpy : readDouble_f64_rev, e.readDoubleBE = n ? readDouble_f64_rev : readDouble_f64_cpy;
            }() : function() {
                function writeDouble_ieee754(e, r, i, n, o, s) {
                    var a = n < 0 ? 1 : 0;
                    if (a && (n = -n), 0 === n) e(0, o, s + r), e(1 / n > 0 ? 0 : 2147483648, o, s + i); else if (isNaN(n)) e(0, o, s + r), 
                    e(2146959360, o, s + i); else if (n > 17976931348623157e292) e(0, o, s + r), e((a << 31 | 2146435072) >>> 0, o, s + i); else {
                        var u;
                        if (n < 22250738585072014e-324) e((u = n / 5e-324) >>> 0, o, s + r), e((a << 31 | u / 4294967296) >>> 0, o, s + i); else {
                            var l = Math.floor(Math.log(n) / Math.LN2);
                            1024 === l && (l = 1023), e(4503599627370496 * (u = n * Math.pow(2, -l)) >>> 0, o, s + r), 
                            e((a << 31 | l + 1023 << 20 | 1048576 * u & 1048575) >>> 0, o, s + i);
                        }
                    }
                }
                function readDouble_ieee754(e, r, i, n, o) {
                    var s = e(n, o + r), a = e(n, o + i), u = 2 * (a >> 31) + 1, l = a >>> 20 & 2047, f = 4294967296 * (1048575 & a) + s;
                    return 2047 === l ? f ? NaN : u * (1 / 0) : 0 === l ? 5e-324 * u * f : u * Math.pow(2, l - 1075) * (f + 4503599627370496);
                }
                e.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4), e.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0), 
                e.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4), e.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
            }(), e;
        }
        function writeUintLE(e, r, i) {
            r[i] = 255 & e, r[i + 1] = e >>> 8 & 255, r[i + 2] = e >>> 16 & 255, r[i + 3] = e >>> 24;
        }
        function writeUintBE(e, r, i) {
            r[i] = e >>> 24, r[i + 1] = e >>> 16 & 255, r[i + 2] = e >>> 8 & 255, r[i + 3] = 255 & e;
        }
        function readUintLE(e, r) {
            return (e[r] | e[r + 1] << 8 | e[r + 2] << 16 | e[r + 3] << 24) >>> 0;
        }
        function readUintBE(e, r) {
            return (e[r] << 24 | e[r + 1] << 16 | e[r + 2] << 8 | e[r + 3]) >>> 0;
        }
        return hasRequiredFloat = 1, float = factory(factory);
    }
    function requireInquire() {
        if (hasRequiredInquire) return inquire_1;
        function inquire(moduleName) {
            try {
                var mod = eval("quire".replace(/^/, "re"))(moduleName);
                if (mod && (mod.length || Object.keys(mod).length)) return mod;
            } catch (e) {}
            return null;
        }
        return hasRequiredInquire = 1, inquire_1 = inquire, inquire_1;
    }
    var utf8$2 = {}, hasRequiredUtf8, pool_1, hasRequiredPool, longbits, hasRequiredLongbits, hasRequiredMinimal;
    function requireUtf8() {
        return hasRequiredUtf8 || (hasRequiredUtf8 = 1, function(e) {
            var r = e;
            r.length = function utf8_length(e) {
                for (var r = 0, i = 0, n = 0; n < e.length; ++n) (i = e.charCodeAt(n)) < 128 ? r += 1 : i < 2048 ? r += 2 : 55296 == (64512 & i) && 56320 == (64512 & e.charCodeAt(n + 1)) ? (++n, 
                r += 4) : r += 3;
                return r;
            }, r.read = function utf8_read(e, r, i) {
                if (i - r < 1) return "";
                for (var n, o = null, s = [], a = 0; r < i; ) (n = e[r++]) < 128 ? s[a++] = n : n > 191 && n < 224 ? s[a++] = (31 & n) << 6 | 63 & e[r++] : n > 239 && n < 365 ? (n = ((7 & n) << 18 | (63 & e[r++]) << 12 | (63 & e[r++]) << 6 | 63 & e[r++]) - 65536, 
                s[a++] = 55296 + (n >> 10), s[a++] = 56320 + (1023 & n)) : s[a++] = (15 & n) << 12 | (63 & e[r++]) << 6 | 63 & e[r++], 
                a > 8191 && ((o || (o = [])).push(String.fromCharCode.apply(String, s)), a = 0);
                return o ? (a && o.push(String.fromCharCode.apply(String, s.slice(0, a))), o.join("")) : String.fromCharCode.apply(String, s.slice(0, a));
            }, r.write = function utf8_write(e, r, i) {
                for (var n, o, s = i, a = 0; a < e.length; ++a) (n = e.charCodeAt(a)) < 128 ? r[i++] = n : n < 2048 ? (r[i++] = n >> 6 | 192, 
                r[i++] = 63 & n | 128) : 55296 == (64512 & n) && 56320 == (64512 & (o = e.charCodeAt(a + 1))) ? (n = 65536 + ((1023 & n) << 10) + (1023 & o), 
                ++a, r[i++] = n >> 18 | 240, r[i++] = n >> 12 & 63 | 128, r[i++] = n >> 6 & 63 | 128, 
                r[i++] = 63 & n | 128) : (r[i++] = n >> 12 | 224, r[i++] = n >> 6 & 63 | 128, r[i++] = 63 & n | 128);
                return i - s;
            };
        }(utf8$2)), utf8$2;
    }
    function requirePool() {
        if (hasRequiredPool) return pool_1;
        return hasRequiredPool = 1, pool_1 = function pool(e, r, i) {
            var n = i || 8192, o = n >>> 1, s = null, a = n;
            return function pool_alloc(i) {
                if (i < 1 || i > o) return e(i);
                a + i > n && (s = e(n), a = 0);
                var u = r.call(s, a, a += i);
                return 7 & a && (a = 1 + (7 | a)), u;
            };
        };
    }
    function requireLongbits() {
        if (hasRequiredLongbits) return longbits;
        hasRequiredLongbits = 1, longbits = LongBits;
        var e = requireMinimal();
        function LongBits(e, r) {
            this.lo = e >>> 0, this.hi = r >>> 0;
        }
        var r = LongBits.zero = new LongBits(0, 0);
        r.toNumber = function() {
            return 0;
        }, r.zzEncode = r.zzDecode = function() {
            return this;
        }, r.length = function() {
            return 1;
        };
        var i = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
        LongBits.fromNumber = function fromNumber(e) {
            if (0 === e) return r;
            var i = e < 0;
            i && (e = -e);
            var n = e >>> 0, o = (e - n) / 4294967296 >>> 0;
            return i && (o = ~o >>> 0, n = ~n >>> 0, ++n > 4294967295 && (n = 0, ++o > 4294967295 && (o = 0))), 
            new LongBits(n, o);
        }, LongBits.from = function from(i) {
            if ("number" == typeof i) return LongBits.fromNumber(i);
            if (e.isString(i)) {
                if (!e.Long) return LongBits.fromNumber(parseInt(i, 10));
                i = e.Long.fromString(i);
            }
            return i.low || i.high ? new LongBits(i.low >>> 0, i.high >>> 0) : r;
        }, LongBits.prototype.toNumber = function toNumber(e) {
            if (!e && this.hi >>> 31) {
                var r = 1 + ~this.lo >>> 0, i = ~this.hi >>> 0;
                return r || (i = i + 1 >>> 0), -(r + 4294967296 * i);
            }
            return this.lo + 4294967296 * this.hi;
        }, LongBits.prototype.toLong = function toLong(r) {
            return e.Long ? new e.Long(0 | this.lo, 0 | this.hi, Boolean(r)) : {
                low: 0 | this.lo,
                high: 0 | this.hi,
                unsigned: Boolean(r)
            };
        };
        var n = String.prototype.charCodeAt;
        return LongBits.fromHash = function fromHash(e) {
            return e === i ? r : new LongBits((n.call(e, 0) | n.call(e, 1) << 8 | n.call(e, 2) << 16 | n.call(e, 3) << 24) >>> 0, (n.call(e, 4) | n.call(e, 5) << 8 | n.call(e, 6) << 16 | n.call(e, 7) << 24) >>> 0);
        }, LongBits.prototype.toHash = function toHash() {
            return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
        }, LongBits.prototype.zzEncode = function zzEncode() {
            var e = this.hi >> 31;
            return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0, this.lo = (this.lo << 1 ^ e) >>> 0, 
            this;
        }, LongBits.prototype.zzDecode = function zzDecode() {
            var e = -(1 & this.lo);
            return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0, this.hi = (this.hi >>> 1 ^ e) >>> 0, 
            this;
        }, LongBits.prototype.length = function length() {
            var e = this.lo, r = (this.lo >>> 28 | this.hi << 4) >>> 0, i = this.hi >>> 24;
            return 0 === i ? 0 === r ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : r < 16384 ? r < 128 ? 5 : 6 : r < 2097152 ? 7 : 8 : i < 128 ? 9 : 10;
        }, longbits;
    }
    function requireMinimal() {
        return hasRequiredMinimal || (hasRequiredMinimal = 1, function(e) {
            var r = e;
            function merge(e, r, i) {
                for (var n = Object.keys(r), o = 0; o < n.length; ++o) void 0 !== e[n[o]] && i || (e[n[o]] = r[n[o]]);
                return e;
            }
            function newError(e) {
                function CustomError(e, r) {
                    if (!(this instanceof CustomError)) return new CustomError(e, r);
                    Object.defineProperty(this, "message", {
                        get: function() {
                            return e;
                        }
                    }), Error.captureStackTrace ? Error.captureStackTrace(this, CustomError) : Object.defineProperty(this, "stack", {
                        value: (new Error).stack || ""
                    }), r && merge(this, r);
                }
                return CustomError.prototype = Object.create(Error.prototype, {
                    constructor: {
                        value: CustomError,
                        writable: !0,
                        enumerable: !1,
                        configurable: !0
                    },
                    name: {
                        get: function get() {
                            return e;
                        },
                        set: void 0,
                        enumerable: !1,
                        configurable: !0
                    },
                    toString: {
                        value: function value() {
                            return this.name + ": " + this.message;
                        },
                        writable: !0,
                        enumerable: !1,
                        configurable: !0
                    }
                }), CustomError;
            }
            r.asPromise = requireAspromise(), r.base64 = requireBase64(), r.EventEmitter = requireEventemitter(), 
            r.float = requireFloat(), r.inquire = requireInquire(), r.utf8 = requireUtf8(), 
            r.pool = requirePool(), r.LongBits = requireLongbits(), r.isNode = Boolean(void 0 !== commonjsGlobal && commonjsGlobal && commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node), 
            r.global = r.isNode && commonjsGlobal || "undefined" != typeof window && window || "undefined" != typeof self && self || commonjsGlobal, 
            r.emptyArray = Object.freeze ? Object.freeze([]) : [], r.emptyObject = Object.freeze ? Object.freeze({}) : {}, 
            r.isInteger = Number.isInteger || function isInteger(e) {
                return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
            }, r.isString = function isString(e) {
                return "string" == typeof e || e instanceof String;
            }, r.isObject = function isObject(e) {
                return e && "object" == typeof e;
            }, r.isset = r.isSet = function isSet(e, r) {
                var i = e[r];
                return !(null == i || !e.hasOwnProperty(r)) && ("object" != typeof i || (Array.isArray(i) ? i.length : Object.keys(i).length) > 0);
            }, r.Buffer = function() {
                try {
                    var e = r.inquire("buffer").Buffer;
                    return e.prototype.utf8Write ? e : null;
                } catch (e) {
                    return null;
                }
            }(), r._Buffer_from = null, r._Buffer_allocUnsafe = null, r.newBuffer = function newBuffer(e) {
                return "number" == typeof e ? r.Buffer ? r._Buffer_allocUnsafe(e) : new r.Array(e) : r.Buffer ? r._Buffer_from(e) : "undefined" == typeof Uint8Array ? e : new Uint8Array(e);
            }, r.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array, r.Long = r.global.dcodeIO && r.global.dcodeIO.Long || r.global.Long || r.inquire("long"), 
            r.key2Re = /^true|false|0|1$/, r.key32Re = /^-?(?:0|[1-9][0-9]*)$/, r.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, 
            r.longToHash = function longToHash(e) {
                return e ? r.LongBits.from(e).toHash() : r.LongBits.zeroHash;
            }, r.longFromHash = function longFromHash(e, i) {
                var n = r.LongBits.fromHash(e);
                return r.Long ? r.Long.fromBits(n.lo, n.hi, i) : n.toNumber(Boolean(i));
            }, r.merge = merge, r.lcFirst = function lcFirst(e) {
                return e.charAt(0).toLowerCase() + e.substring(1);
            }, r.newError = newError, r.ProtocolError = newError("ProtocolError"), r.oneOfGetter = function getOneOf(e) {
                for (var r = {}, i = 0; i < e.length; ++i) r[e[i]] = 1;
                return function() {
                    for (var e = Object.keys(this), i = e.length - 1; i > -1; --i) if (1 === r[e[i]] && void 0 !== this[e[i]] && null !== this[e[i]]) return e[i];
                };
            }, r.oneOfSetter = function setOneOf(e) {
                return function(r) {
                    for (var i = 0; i < e.length; ++i) e[i] !== r && delete this[e[i]];
                };
            }, r.toJSONOptions = {
                longs: String,
                enums: String,
                bytes: String,
                json: !0
            }, r._configure = function() {
                var e = r.Buffer;
                e ? (r._Buffer_from = e.from !== Uint8Array.from && e.from || function Buffer_from(r, i) {
                    return new e(r, i);
                }, r._Buffer_allocUnsafe = e.allocUnsafe || function Buffer_allocUnsafe(r) {
                    return new e(r);
                }) : r._Buffer_from = r._Buffer_allocUnsafe = null;
            };
        }(minimal)), minimal;
    }
    var writer = Writer$1, util$7 = requireMinimal(), BufferWriter$1, LongBits$1 = util$7.LongBits, base64 = util$7.base64, utf8$1 = util$7.utf8;
    function Op(e, r, i) {
        this.fn = e, this.len = r, this.next = void 0, this.val = i;
    }
    function noop() {}
    function State(e) {
        this.head = e.head, this.tail = e.tail, this.len = e.len, this.next = e.states;
    }
    function Writer$1() {
        this.len = 0, this.head = new Op(noop, 0, 0), this.tail = this.head, this.states = null;
    }
    var create$1 = function create() {
        return util$7.Buffer ? function create_buffer_setup() {
            return (Writer$1.create = function create_buffer() {
                return new BufferWriter$1;
            })();
        } : function create_array() {
            return new Writer$1;
        };
    };
    function writeByte(e, r, i) {
        r[i] = 255 & e;
    }
    function writeVarint32(e, r, i) {
        for (;e > 127; ) r[i++] = 127 & e | 128, e >>>= 7;
        r[i] = e;
    }
    function VarintOp(e, r) {
        this.len = e, this.next = void 0, this.val = r;
    }
    function writeVarint64(e, r, i) {
        for (;e.hi; ) r[i++] = 127 & e.lo | 128, e.lo = (e.lo >>> 7 | e.hi << 25) >>> 0, 
        e.hi >>>= 7;
        for (;e.lo > 127; ) r[i++] = 127 & e.lo | 128, e.lo = e.lo >>> 7;
        r[i++] = e.lo;
    }
    function writeFixed32(e, r, i) {
        r[i] = 255 & e, r[i + 1] = e >>> 8 & 255, r[i + 2] = e >>> 16 & 255, r[i + 3] = e >>> 24;
    }
    Writer$1.create = create$1(), Writer$1.alloc = function alloc(e) {
        return new util$7.Array(e);
    }, util$7.Array !== Array && (Writer$1.alloc = util$7.pool(Writer$1.alloc, util$7.Array.prototype.subarray)), 
    Writer$1.prototype._push = function push(e, r, i) {
        return this.tail = this.tail.next = new Op(e, r, i), this.len += r, this;
    }, VarintOp.prototype = Object.create(Op.prototype), VarintOp.prototype.fn = writeVarint32, 
    Writer$1.prototype.uint32 = function write_uint32(e) {
        return this.len += (this.tail = this.tail.next = new VarintOp((e >>>= 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len, 
        this;
    }, Writer$1.prototype.int32 = function write_int32(e) {
        return e < 0 ? this._push(writeVarint64, 10, LongBits$1.fromNumber(e)) : this.uint32(e);
    }, Writer$1.prototype.sint32 = function write_sint32(e) {
        return this.uint32((e << 1 ^ e >> 31) >>> 0);
    }, Writer$1.prototype.uint64 = function write_uint64(e) {
        var r = LongBits$1.from(e);
        return this._push(writeVarint64, r.length(), r);
    }, Writer$1.prototype.int64 = Writer$1.prototype.uint64, Writer$1.prototype.sint64 = function write_sint64(e) {
        var r = LongBits$1.from(e).zzEncode();
        return this._push(writeVarint64, r.length(), r);
    }, Writer$1.prototype.bool = function write_bool(e) {
        return this._push(writeByte, 1, e ? 1 : 0);
    }, Writer$1.prototype.fixed32 = function write_fixed32(e) {
        return this._push(writeFixed32, 4, e >>> 0);
    }, Writer$1.prototype.sfixed32 = Writer$1.prototype.fixed32, Writer$1.prototype.fixed64 = function write_fixed64(e) {
        var r = LongBits$1.from(e);
        return this._push(writeFixed32, 4, r.lo)._push(writeFixed32, 4, r.hi);
    }, Writer$1.prototype.sfixed64 = Writer$1.prototype.fixed64, Writer$1.prototype.float = function write_float(e) {
        return this._push(util$7.float.writeFloatLE, 4, e);
    }, Writer$1.prototype.double = function write_double(e) {
        return this._push(util$7.float.writeDoubleLE, 8, e);
    };
    var writeBytes = util$7.Array.prototype.set ? function writeBytes_set(e, r, i) {
        r.set(e, i);
    } : function writeBytes_for(e, r, i) {
        for (var n = 0; n < e.length; ++n) r[i + n] = e[n];
    };
    Writer$1.prototype.bytes = function write_bytes(e) {
        var r = e.length >>> 0;
        if (!r) return this._push(writeByte, 1, 0);
        if (util$7.isString(e)) {
            var i = Writer$1.alloc(r = base64.length(e));
            base64.decode(e, i, 0), e = i;
        }
        return this.uint32(r)._push(writeBytes, r, e);
    }, Writer$1.prototype.string = function write_string(e) {
        var r = utf8$1.length(e);
        return r ? this.uint32(r)._push(utf8$1.write, r, e) : this._push(writeByte, 1, 0);
    }, Writer$1.prototype.fork = function fork() {
        return this.states = new State(this), this.head = this.tail = new Op(noop, 0, 0), 
        this.len = 0, this;
    }, Writer$1.prototype.reset = function reset() {
        return this.states ? (this.head = this.states.head, this.tail = this.states.tail, 
        this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new Op(noop, 0, 0), 
        this.len = 0), this;
    }, Writer$1.prototype.ldelim = function ldelim() {
        var e = this.head, r = this.tail, i = this.len;
        return this.reset().uint32(i), i && (this.tail.next = e.next, this.tail = r, this.len += i), 
        this;
    }, Writer$1.prototype.finish = function finish() {
        for (var e = this.head.next, r = this.constructor.alloc(this.len), i = 0; e; ) e.fn(e.val, r, i), 
        i += e.len, e = e.next;
        return r;
    }, Writer$1._configure = function(e) {
        BufferWriter$1 = e, Writer$1.create = create$1(), BufferWriter$1._configure();
    };
    var writer_buffer = BufferWriter, Writer = writer;
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util$6 = requireMinimal();
    function BufferWriter() {
        Writer.call(this);
    }
    function writeStringBuffer(e, r, i) {
        e.length < 40 ? util$6.utf8.write(e, r, i) : r.utf8Write ? r.utf8Write(e, i) : r.write(e, i);
    }
    BufferWriter._configure = function() {
        BufferWriter.alloc = util$6._Buffer_allocUnsafe, BufferWriter.writeBytesBuffer = util$6.Buffer && util$6.Buffer.prototype instanceof Uint8Array && "set" === util$6.Buffer.prototype.set.name ? function writeBytesBuffer_set(e, r, i) {
            r.set(e, i);
        } : function writeBytesBuffer_copy(e, r, i) {
            if (e.copy) e.copy(r, i, 0, e.length); else for (var n = 0; n < e.length; ) r[i++] = e[n++];
        };
    }, BufferWriter.prototype.bytes = function write_bytes_buffer(e) {
        util$6.isString(e) && (e = util$6._Buffer_from(e, "base64"));
        var r = e.length >>> 0;
        return this.uint32(r), r && this._push(BufferWriter.writeBytesBuffer, r, e), this;
    }, BufferWriter.prototype.string = function write_string_buffer(e) {
        var r = util$6.Buffer.byteLength(e);
        return this.uint32(r), r && this._push(writeStringBuffer, r, e), this;
    }, BufferWriter._configure();
    var reader = Reader$1, util$5 = requireMinimal(), BufferReader$1, LongBits = util$5.LongBits, utf8 = util$5.utf8;
    function indexOutOfRange(e, r) {
        return RangeError("index out of range: " + e.pos + " + " + (r || 1) + " > " + e.len);
    }
    function Reader$1(e) {
        this.buf = e, this.pos = 0, this.len = e.length;
    }
    var create_array = "undefined" != typeof Uint8Array ? function create_typed_array(e) {
        if (e instanceof Uint8Array || Array.isArray(e)) return new Reader$1(e);
        throw Error("illegal buffer");
    } : function create_array(e) {
        if (Array.isArray(e)) return new Reader$1(e);
        throw Error("illegal buffer");
    }, create = function create() {
        return util$5.Buffer ? function create_buffer_setup(e) {
            return (Reader$1.create = function create_buffer(e) {
                return util$5.Buffer.isBuffer(e) ? new BufferReader$1(e) : create_array(e);
            })(e);
        } : create_array;
    };
    function readLongVarint() {
        var e = new LongBits(0, 0), r = 0;
        if (!(this.len - this.pos > 4)) {
            for (;r < 3; ++r) {
                if (this.pos >= this.len) throw indexOutOfRange(this);
                if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * r) >>> 0, this.buf[this.pos++] < 128) return e;
            }
            return e.lo = (e.lo | (127 & this.buf[this.pos++]) << 7 * r) >>> 0, e;
        }
        for (;r < 4; ++r) if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * r) >>> 0, 
        this.buf[this.pos++] < 128) return e;
        if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 28) >>> 0, e.hi = (e.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, 
        this.buf[this.pos++] < 128) return e;
        if (r = 0, this.len - this.pos > 4) {
            for (;r < 5; ++r) if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * r + 3) >>> 0, 
            this.buf[this.pos++] < 128) return e;
        } else for (;r < 5; ++r) {
            if (this.pos >= this.len) throw indexOutOfRange(this);
            if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * r + 3) >>> 0, this.buf[this.pos++] < 128) return e;
        }
        throw Error("invalid varint encoding");
    }
    function readFixed32_end(e, r) {
        return (e[r - 4] | e[r - 3] << 8 | e[r - 2] << 16 | e[r - 1] << 24) >>> 0;
    }
    function readFixed64() {
        if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
        return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader$1.create = create(), Reader$1.prototype._slice = util$5.Array.prototype.subarray || util$5.Array.prototype.slice, 
    Reader$1.prototype.uint32 = function read_uint32_setup() {
        var e = 4294967295;
        return function read_uint32() {
            if (e = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128) return e;
            if (e = (e | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) return e;
            if (e = (e | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) return e;
            if (e = (e | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) return e;
            if (e = (e | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128) return e;
            if ((this.pos += 5) > this.len) throw this.pos = this.len, indexOutOfRange(this, 10);
            return e;
        };
    }(), Reader$1.prototype.int32 = function read_int32() {
        return 0 | this.uint32();
    }, Reader$1.prototype.sint32 = function read_sint32() {
        var e = this.uint32();
        return e >>> 1 ^ -(1 & e) | 0;
    }, Reader$1.prototype.bool = function read_bool() {
        return 0 !== this.uint32();
    }, Reader$1.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
    }, Reader$1.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
        return 0 | readFixed32_end(this.buf, this.pos += 4);
    }, Reader$1.prototype.float = function read_float() {
        if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
        var e = util$5.float.readFloatLE(this.buf, this.pos);
        return this.pos += 4, e;
    }, Reader$1.prototype.double = function read_double() {
        if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
        var e = util$5.float.readDoubleLE(this.buf, this.pos);
        return this.pos += 8, e;
    }, Reader$1.prototype.bytes = function read_bytes() {
        var e = this.uint32(), r = this.pos, i = this.pos + e;
        if (i > this.len) throw indexOutOfRange(this, e);
        return this.pos += e, Array.isArray(this.buf) ? this.buf.slice(r, i) : r === i ? new this.buf.constructor(0) : this._slice.call(this.buf, r, i);
    }, Reader$1.prototype.string = function read_string() {
        var e = this.bytes();
        return utf8.read(e, 0, e.length);
    }, Reader$1.prototype.skip = function skip(e) {
        if ("number" == typeof e) {
            if (this.pos + e > this.len) throw indexOutOfRange(this, e);
            this.pos += e;
        } else do {
            if (this.pos >= this.len) throw indexOutOfRange(this);
        } while (128 & this.buf[this.pos++]);
        return this;
    }, Reader$1.prototype.skipType = function(e) {
        switch (e) {
          case 0:
            this.skip();
            break;

          case 1:
            this.skip(8);
            break;

          case 2:
            this.skip(this.uint32());
            break;

          case 3:
            for (;4 != (e = 7 & this.uint32()); ) this.skipType(e);
            break;

          case 5:
            this.skip(4);
            break;

          default:
            throw Error("invalid wire type " + e + " at offset " + this.pos);
        }
        return this;
    }, Reader$1._configure = function(e) {
        BufferReader$1 = e, Reader$1.create = create(), BufferReader$1._configure();
        var r = util$5.Long ? "toLong" : "toNumber";
        util$5.merge(Reader$1.prototype, {
            int64: function read_int64() {
                return readLongVarint.call(this)[r](!1);
            },
            uint64: function read_uint64() {
                return readLongVarint.call(this)[r](!0);
            },
            sint64: function read_sint64() {
                return readLongVarint.call(this).zzDecode()[r](!1);
            },
            fixed64: function read_fixed64() {
                return readFixed64.call(this)[r](!0);
            },
            sfixed64: function read_sfixed64() {
                return readFixed64.call(this)[r](!1);
            }
        });
    };
    var reader_buffer = BufferReader, Reader = reader;
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util$4 = requireMinimal();
    function BufferReader(e) {
        Reader.call(this, e);
    }
    BufferReader._configure = function() {
        util$4.Buffer && (BufferReader.prototype._slice = util$4.Buffer.prototype.slice);
    }, BufferReader.prototype.string = function read_string_buffer() {
        var e = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + e, this.len));
    }, BufferReader._configure();
    var rpc = {}, service$1 = Service$1, util$3 = requireMinimal();
    function Service$1(e, r, i) {
        if ("function" != typeof e) throw TypeError("rpcImpl must be a function");
        util$3.EventEmitter.call(this), this.rpcImpl = e, this.requestDelimited = Boolean(r), 
        this.responseDelimited = Boolean(i);
    }
    (Service$1.prototype = Object.create(util$3.EventEmitter.prototype)).constructor = Service$1, 
    Service$1.prototype.rpcCall = function rpcCall(e, r, i, n, o) {
        if (!n) throw TypeError("request must be specified");
        var s = this;
        if (!o) return util$3.asPromise(rpcCall, s, e, r, i, n);
        if (s.rpcImpl) try {
            return s.rpcImpl(e, r[s.requestDelimited ? "encodeDelimited" : "encode"](n).finish(), (function rpcCallback(r, n) {
                if (r) return s.emit("error", r, e), o(r);
                if (null !== n) {
                    if (!(n instanceof i)) try {
                        n = i[s.responseDelimited ? "decodeDelimited" : "decode"](n);
                    } catch (r) {
                        return s.emit("error", r, e), o(r);
                    }
                    return s.emit("data", n, e), o(null, n);
                }
                s.end(!0);
            }));
        } catch (r) {
            return s.emit("error", r, e), void setTimeout((function() {
                o(r);
            }), 0);
        } else setTimeout((function() {
            o(Error("already ended"));
        }), 0);
    }, Service$1.prototype.end = function end(e) {
        return this.rpcImpl && (e || this.rpcImpl(null, null, null), this.rpcImpl = null, 
        this.emit("end").off()), this;
    }, function(e) {
        e.Service = service$1;
    }(rpc);
    var roots = {};
    !function(e) {
        var r = e;
        function configure() {
            r.util._configure(), r.Writer._configure(r.BufferWriter), r.Reader._configure(r.BufferReader);
        }
        r.build = "minimal", r.Writer = writer, r.BufferWriter = writer_buffer, r.Reader = reader, 
        r.BufferReader = reader_buffer, r.util = requireMinimal(), r.rpc = rpc, r.roots = roots, 
        r.configure = configure, configure();
    }(indexMinimal);
    var util$2 = {
        exports: {}
    }, codegen_1 = codegen;
    function codegen(e, r) {
        "string" == typeof e && (r = e, e = void 0);
        var i = [];
        function Codegen(e) {
            if ("string" != typeof e) {
                var r = toString();
                if (codegen.verbose && console.log("codegen: " + r), r = "return " + r, e) {
                    for (var n = Object.keys(e), o = new Array(n.length + 1), s = new Array(n.length), a = 0; a < n.length; ) o[a] = n[a], 
                    s[a] = e[n[a++]];
                    return o[a] = r, Function.apply(null, o).apply(null, s);
                }
                return Function(r)();
            }
            for (var u = new Array(arguments.length - 1), l = 0; l < u.length; ) u[l] = arguments[++l];
            if (l = 0, e = e.replace(/%([%dfijs])/g, (function replace(e, r) {
                var i = u[l++];
                switch (r) {
                  case "d":
                  case "f":
                    return String(Number(i));

                  case "i":
                    return String(Math.floor(i));

                  case "j":
                    return JSON.stringify(i);

                  case "s":
                    return String(i);
                }
                return "%";
            })), l !== u.length) throw Error("parameter count mismatch");
            return i.push(e), Codegen;
        }
        function toString(n) {
            return "function " + (n || r || "") + "(" + (e && e.join(",") || "") + "){\n  " + i.join("\n  ") + "\n}";
        }
        return Codegen.toString = toString, Codegen;
    }
    codegen.verbose = !1;
    var fetch_1 = fetch, asPromise = requireAspromise(), inquire = requireInquire(), fs = inquire("fs");
    function fetch(e, r, i) {
        return "function" == typeof r ? (i = r, r = {}) : r || (r = {}), i ? !r.xhr && fs && fs.readFile ? fs.readFile(e, (function fetchReadFileCallback(n, o) {
            return n && "undefined" != typeof XMLHttpRequest ? fetch.xhr(e, r, i) : n ? i(n) : i(null, r.binary ? o : o.toString("utf8"));
        })) : fetch.xhr(e, r, i) : asPromise(fetch, this, e, r);
    }
    fetch.xhr = function fetch_xhr(e, r, i) {
        var n = new XMLHttpRequest;
        n.onreadystatechange = function fetchOnReadyStateChange() {
            if (4 === n.readyState) {
                if (0 !== n.status && 200 !== n.status) return i(Error("status " + n.status));
                if (r.binary) {
                    var e = n.response;
                    if (!e) {
                        e = [];
                        for (var o = 0; o < n.responseText.length; ++o) e.push(255 & n.responseText.charCodeAt(o));
                    }
                    return i(null, "undefined" != typeof Uint8Array ? new Uint8Array(e) : e);
                }
                return i(null, n.responseText);
            }
        }, r.binary && ("overrideMimeType" in n && n.overrideMimeType("text/plain; charset=x-user-defined"), 
        n.responseType = "arraybuffer"), n.open("GET", e), n.send();
    };
    var path = {};
    !function(e) {
        var r = e, i = r.isAbsolute = function isAbsolute(e) {
            return /^(?:\/|\w+:)/.test(e);
        }, n = r.normalize = function normalize(e) {
            var r = (e = e.replace(/\\/g, "/").replace(/\/{2,}/g, "/")).split("/"), n = i(e), o = "";
            n && (o = r.shift() + "/");
            for (var s = 0; s < r.length; ) ".." === r[s] ? s > 0 && ".." !== r[s - 1] ? r.splice(--s, 2) : n ? r.splice(s, 1) : ++s : "." === r[s] ? r.splice(s, 1) : ++s;
            return o + r.join("/");
        };
        r.resolve = function resolve(e, r, o) {
            return o || (r = n(r)), i(r) ? r : (o || (e = n(e)), (e = e.replace(/(?:\/|^)[^/]+$/, "")).length ? n(e + "/" + r) : r);
        };
    }(path);
    var types$1 = {}, hasRequiredTypes, field, hasRequiredField, oneof, hasRequiredOneof, namespace, hasRequiredNamespace, mapfield, hasRequiredMapfield, method, hasRequiredMethod, service, hasRequiredService;
    function requireTypes() {
        return hasRequiredTypes || (hasRequiredTypes = 1, function(e) {
            var r = e, i = requireUtil(), n = [ "double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes" ];
            function bake(e, r) {
                var i = 0, o = {};
                for (r |= 0; i < e.length; ) o[n[i + r]] = e[i++];
                return o;
            }
            r.basic = bake([ 1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2 ]), r.defaults = bake([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, !1, "", i.emptyArray, null ]), 
            r.long = bake([ 0, 0, 0, 1, 1 ], 7), r.mapKey = bake([ 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2 ], 2), 
            r.packed = bake([ 1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0 ]);
        }(types$1)), types$1;
    }
    function requireField() {
        if (hasRequiredField) return field;
        hasRequiredField = 1, field = Field;
        var e = requireObject();
        ((Field.prototype = Object.create(e.prototype)).constructor = Field).className = "Field";
        var r, i = require_enum(), n = requireTypes(), o = requireUtil(), s = /^required|optional|repeated$/;
        function Field(r, i, a, u, l, f, h) {
            if (o.isObject(u) ? (h = l, f = u, u = l = void 0) : o.isObject(l) && (h = f, f = l, 
            l = void 0), e.call(this, r, f), !o.isInteger(i) || i < 0) throw TypeError("id must be a non-negative integer");
            if (!o.isString(a)) throw TypeError("type must be a string");
            if (void 0 !== u && !s.test(u = u.toString().toLowerCase())) throw TypeError("rule must be a string rule");
            if (void 0 !== l && !o.isString(l)) throw TypeError("extend must be a string");
            "proto3_optional" === u && (u = "optional"), this.rule = u && "optional" !== u ? u : void 0, 
            this.type = a, this.id = i, this.extend = l || void 0, this.required = "required" === u, 
            this.optional = !this.required, this.repeated = "repeated" === u, this.map = !1, 
            this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, 
            this.long = !!o.Long && void 0 !== n.long[a], this.bytes = "bytes" === a, this.resolvedType = null, 
            this.extensionField = null, this.declaringField = null, this._packed = null, this.comment = h;
        }
        return Field.fromJSON = function fromJSON(e, r) {
            return new Field(e, r.id, r.type, r.rule, r.extend, r.options, r.comment);
        }, Object.defineProperty(Field.prototype, "packed", {
            get: function() {
                return null === this._packed && (this._packed = !1 !== this.getOption("packed")), 
                this._packed;
            }
        }), Field.prototype.setOption = function setOption(r, i, n) {
            return "packed" === r && (this._packed = null), e.prototype.setOption.call(this, r, i, n);
        }, Field.prototype.toJSON = function toJSON(e) {
            var r = !!e && Boolean(e.keepComments);
            return o.toObject([ "rule", "optional" !== this.rule && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", r ? this.comment : void 0 ]);
        }, Field.prototype.resolve = function resolve() {
            if (this.resolved) return this;
            if (void 0 === (this.typeDefault = n.defaults[this.type]) ? (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), 
            this.resolvedType instanceof r ? this.typeDefault = null : this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]) : this.options && this.options.proto3_optional && (this.typeDefault = null), 
            this.options && null != this.options.default && (this.typeDefault = this.options.default, 
            this.resolvedType instanceof i && "string" == typeof this.typeDefault && (this.typeDefault = this.resolvedType.values[this.typeDefault])), 
            this.options && (!0 !== this.options.packed && (void 0 === this.options.packed || !this.resolvedType || this.resolvedType instanceof i) || delete this.options.packed, 
            Object.keys(this.options).length || (this.options = void 0)), this.long) this.typeDefault = o.Long.fromNumber(this.typeDefault, "u" === this.type.charAt(0)), 
            Object.freeze && Object.freeze(this.typeDefault); else if (this.bytes && "string" == typeof this.typeDefault) {
                var s;
                o.base64.test(this.typeDefault) ? o.base64.decode(this.typeDefault, s = o.newBuffer(o.base64.length(this.typeDefault)), 0) : o.utf8.write(this.typeDefault, s = o.newBuffer(o.utf8.length(this.typeDefault)), 0), 
                this.typeDefault = s;
            }
            return this.map ? this.defaultValue = o.emptyObject : this.repeated ? this.defaultValue = o.emptyArray : this.defaultValue = this.typeDefault, 
            this.parent instanceof r && (this.parent.ctor.prototype[this.name] = this.defaultValue), 
            e.prototype.resolve.call(this);
        }, Field.d = function decorateField(e, r, i, n) {
            return "function" == typeof r ? r = o.decorateType(r).name : r && "object" == typeof r && (r = o.decorateEnum(r).name), 
            function fieldDecorator(s, a) {
                o.decorateType(s.constructor).add(new Field(a, e, r, i, {
                    default: n
                }));
            };
        }, Field._configure = function configure(e) {
            r = e;
        }, field;
    }
    function requireOneof() {
        if (hasRequiredOneof) return oneof;
        hasRequiredOneof = 1, oneof = OneOf;
        var e = requireObject();
        ((OneOf.prototype = Object.create(e.prototype)).constructor = OneOf).className = "OneOf";
        var r = requireField(), i = requireUtil();
        function OneOf(r, i, n, o) {
            if (Array.isArray(i) || (n = i, i = void 0), e.call(this, r, n), void 0 !== i && !Array.isArray(i)) throw TypeError("fieldNames must be an Array");
            this.oneof = i || [], this.fieldsArray = [], this.comment = o;
        }
        function addFieldsToParent(e) {
            if (e.parent) for (var r = 0; r < e.fieldsArray.length; ++r) e.fieldsArray[r].parent || e.parent.add(e.fieldsArray[r]);
        }
        return OneOf.fromJSON = function fromJSON(e, r) {
            return new OneOf(e, r.oneof, r.options, r.comment);
        }, OneOf.prototype.toJSON = function toJSON(e) {
            var r = !!e && Boolean(e.keepComments);
            return i.toObject([ "options", this.options, "oneof", this.oneof, "comment", r ? this.comment : void 0 ]);
        }, OneOf.prototype.add = function add(e) {
            if (!(e instanceof r)) throw TypeError("field must be a Field");
            return e.parent && e.parent !== this.parent && e.parent.remove(e), this.oneof.push(e.name), 
            this.fieldsArray.push(e), e.partOf = this, addFieldsToParent(this), this;
        }, OneOf.prototype.remove = function remove(e) {
            if (!(e instanceof r)) throw TypeError("field must be a Field");
            var i = this.fieldsArray.indexOf(e);
            if (i < 0) throw Error(e + " is not a member of " + this);
            return this.fieldsArray.splice(i, 1), (i = this.oneof.indexOf(e.name)) > -1 && this.oneof.splice(i, 1), 
            e.partOf = null, this;
        }, OneOf.prototype.onAdd = function onAdd(r) {
            e.prototype.onAdd.call(this, r);
            for (var i = 0; i < this.oneof.length; ++i) {
                var n = r.get(this.oneof[i]);
                n && !n.partOf && (n.partOf = this, this.fieldsArray.push(n));
            }
            addFieldsToParent(this);
        }, OneOf.prototype.onRemove = function onRemove(r) {
            for (var i, n = 0; n < this.fieldsArray.length; ++n) (i = this.fieldsArray[n]).parent && i.parent.remove(i);
            e.prototype.onRemove.call(this, r);
        }, OneOf.d = function decorateOneOf() {
            for (var e = new Array(arguments.length), r = 0; r < arguments.length; ) e[r] = arguments[r++];
            return function oneOfDecorator(r, n) {
                i.decorateType(r.constructor).add(new OneOf(n, e)), Object.defineProperty(r, n, {
                    get: i.oneOfGetter(e),
                    set: i.oneOfSetter(e)
                });
            };
        }, oneof;
    }
    function requireNamespace() {
        if (hasRequiredNamespace) return namespace;
        hasRequiredNamespace = 1, namespace = Namespace;
        var e = requireObject();
        ((Namespace.prototype = Object.create(e.prototype)).constructor = Namespace).className = "Namespace";
        var r, i, n, o = requireField(), s = requireUtil(), a = requireOneof();
        function arrayToJSON(e, r) {
            if (e && e.length) {
                for (var i = {}, n = 0; n < e.length; ++n) i[e[n].name] = e[n].toJSON(r);
                return i;
            }
        }
        function Namespace(r, i) {
            e.call(this, r, i), this.nested = void 0, this._nestedArray = null;
        }
        function clearCache(e) {
            return e._nestedArray = null, e;
        }
        return Namespace.fromJSON = function fromJSON(e, r) {
            return new Namespace(e, r.options).addJSON(r.nested);
        }, Namespace.arrayToJSON = arrayToJSON, Namespace.isReservedId = function isReservedId(e, r) {
            if (e) for (var i = 0; i < e.length; ++i) if ("string" != typeof e[i] && e[i][0] <= r && e[i][1] > r) return !0;
            return !1;
        }, Namespace.isReservedName = function isReservedName(e, r) {
            if (e) for (var i = 0; i < e.length; ++i) if (e[i] === r) return !0;
            return !1;
        }, Object.defineProperty(Namespace.prototype, "nestedArray", {
            get: function() {
                return this._nestedArray || (this._nestedArray = s.toArray(this.nested));
            }
        }), Namespace.prototype.toJSON = function toJSON(e) {
            return s.toObject([ "options", this.options, "nested", arrayToJSON(this.nestedArray, e) ]);
        }, Namespace.prototype.addJSON = function addJSON(e) {
            if (e) for (var s, a = Object.keys(e), u = 0; u < a.length; ++u) s = e[a[u]], this.add((void 0 !== s.fields ? r.fromJSON : void 0 !== s.values ? n.fromJSON : void 0 !== s.methods ? i.fromJSON : void 0 !== s.id ? o.fromJSON : Namespace.fromJSON)(a[u], s));
            return this;
        }, Namespace.prototype.get = function get(e) {
            return this.nested && this.nested[e] || null;
        }, Namespace.prototype.getEnum = function getEnum(e) {
            if (this.nested && this.nested[e] instanceof n) return this.nested[e].values;
            throw Error("no such enum: " + e);
        }, Namespace.prototype.add = function add(e) {
            if (!(e instanceof o && void 0 !== e.extend || e instanceof r || e instanceof a || e instanceof n || e instanceof i || e instanceof Namespace)) throw TypeError("object must be a valid nested object");
            if (this.nested) {
                var s = this.get(e.name);
                if (s) {
                    if (!(s instanceof Namespace && e instanceof Namespace) || s instanceof r || s instanceof i) throw Error("duplicate name '" + e.name + "' in " + this);
                    for (var u = s.nestedArray, l = 0; l < u.length; ++l) e.add(u[l]);
                    this.remove(s), this.nested || (this.nested = {}), e.setOptions(s.options, !0);
                }
            } else this.nested = {};
            return this.nested[e.name] = e, e.onAdd(this), clearCache(this);
        }, Namespace.prototype.remove = function remove(r) {
            if (!(r instanceof e)) throw TypeError("object must be a ReflectionObject");
            if (r.parent !== this) throw Error(r + " is not a member of " + this);
            return delete this.nested[r.name], Object.keys(this.nested).length || (this.nested = void 0), 
            r.onRemove(this), clearCache(this);
        }, Namespace.prototype.define = function define(e, r) {
            if (s.isString(e)) e = e.split("."); else if (!Array.isArray(e)) throw TypeError("illegal path");
            if (e && e.length && "" === e[0]) throw Error("path must be relative");
            for (var i = this; e.length > 0; ) {
                var n = e.shift();
                if (i.nested && i.nested[n]) {
                    if (!((i = i.nested[n]) instanceof Namespace)) throw Error("path conflicts with non-namespace objects");
                } else i.add(i = new Namespace(n));
            }
            return r && i.addJSON(r), i;
        }, Namespace.prototype.resolveAll = function resolveAll() {
            for (var e = this.nestedArray, r = 0; r < e.length; ) e[r] instanceof Namespace ? e[r++].resolveAll() : e[r++].resolve();
            return this.resolve();
        }, Namespace.prototype.lookup = function lookup(e, r, i) {
            if ("boolean" == typeof r ? (i = r, r = void 0) : r && !Array.isArray(r) && (r = [ r ]), 
            s.isString(e) && e.length) {
                if ("." === e) return this.root;
                e = e.split(".");
            } else if (!e.length) return this;
            if ("" === e[0]) return this.root.lookup(e.slice(1), r);
            var n = this.get(e[0]);
            if (n) {
                if (1 === e.length) {
                    if (!r || r.indexOf(n.constructor) > -1) return n;
                } else if (n instanceof Namespace && (n = n.lookup(e.slice(1), r, !0))) return n;
            } else for (var o = 0; o < this.nestedArray.length; ++o) if (this._nestedArray[o] instanceof Namespace && (n = this._nestedArray[o].lookup(e, r, !0))) return n;
            return null === this.parent || i ? null : this.parent.lookup(e, r);
        }, Namespace.prototype.lookupType = function lookupType(e) {
            var i = this.lookup(e, [ r ]);
            if (!i) throw Error("no such type: " + e);
            return i;
        }, Namespace.prototype.lookupEnum = function lookupEnum(e) {
            var r = this.lookup(e, [ n ]);
            if (!r) throw Error("no such Enum '" + e + "' in " + this);
            return r;
        }, Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(e) {
            var i = this.lookup(e, [ r, n ]);
            if (!i) throw Error("no such Type or Enum '" + e + "' in " + this);
            return i;
        }, Namespace.prototype.lookupService = function lookupService(e) {
            var r = this.lookup(e, [ i ]);
            if (!r) throw Error("no such Service '" + e + "' in " + this);
            return r;
        }, Namespace._configure = function(e, o, s) {
            r = e, i = o, n = s;
        }, namespace;
    }
    function requireMapfield() {
        if (hasRequiredMapfield) return mapfield;
        hasRequiredMapfield = 1, mapfield = MapField;
        var e = requireField();
        ((MapField.prototype = Object.create(e.prototype)).constructor = MapField).className = "MapField";
        var r = requireTypes(), i = requireUtil();
        function MapField(r, n, o, s, a, u) {
            if (e.call(this, r, n, s, void 0, void 0, a, u), !i.isString(o)) throw TypeError("keyType must be a string");
            this.keyType = o, this.resolvedKeyType = null, this.map = !0;
        }
        return MapField.fromJSON = function fromJSON(e, r) {
            return new MapField(e, r.id, r.keyType, r.type, r.options, r.comment);
        }, MapField.prototype.toJSON = function toJSON(e) {
            var r = !!e && Boolean(e.keepComments);
            return i.toObject([ "keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", r ? this.comment : void 0 ]);
        }, MapField.prototype.resolve = function resolve() {
            if (this.resolved) return this;
            if (void 0 === r.mapKey[this.keyType]) throw Error("invalid key type: " + this.keyType);
            return e.prototype.resolve.call(this);
        }, MapField.d = function decorateMapField(e, r, n) {
            return "function" == typeof n ? n = i.decorateType(n).name : n && "object" == typeof n && (n = i.decorateEnum(n).name), 
            function mapFieldDecorator(o, s) {
                i.decorateType(o.constructor).add(new MapField(s, e, r, n));
            };
        }, mapfield;
    }
    function requireMethod() {
        if (hasRequiredMethod) return method;
        hasRequiredMethod = 1, method = Method;
        var e = requireObject();
        ((Method.prototype = Object.create(e.prototype)).constructor = Method).className = "Method";
        var r = requireUtil();
        function Method(i, n, o, s, a, u, l, f, h) {
            if (r.isObject(a) ? (l = a, a = u = void 0) : r.isObject(u) && (l = u, u = void 0), 
            void 0 !== n && !r.isString(n)) throw TypeError("type must be a string");
            if (!r.isString(o)) throw TypeError("requestType must be a string");
            if (!r.isString(s)) throw TypeError("responseType must be a string");
            e.call(this, i, l), this.type = n || "rpc", this.requestType = o, this.requestStream = !!a || void 0, 
            this.responseType = s, this.responseStream = !!u || void 0, this.resolvedRequestType = null, 
            this.resolvedResponseType = null, this.comment = f, this.parsedOptions = h;
        }
        return Method.fromJSON = function fromJSON(e, r) {
            return new Method(e, r.type, r.requestType, r.responseType, r.requestStream, r.responseStream, r.options, r.comment, r.parsedOptions);
        }, Method.prototype.toJSON = function toJSON(e) {
            var i = !!e && Boolean(e.keepComments);
            return r.toObject([ "type", "rpc" !== this.type && this.type || void 0, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", i ? this.comment : void 0, "parsedOptions", this.parsedOptions ]);
        }, Method.prototype.resolve = function resolve() {
            return this.resolved ? this : (this.resolvedRequestType = this.parent.lookupType(this.requestType), 
            this.resolvedResponseType = this.parent.lookupType(this.responseType), e.prototype.resolve.call(this));
        }, method;
    }
    function requireService() {
        if (hasRequiredService) return service;
        hasRequiredService = 1, service = Service;
        var e = requireNamespace();
        ((Service.prototype = Object.create(e.prototype)).constructor = Service).className = "Service";
        var r = requireMethod(), i = requireUtil(), n = rpc;
        function Service(r, i) {
            e.call(this, r, i), this.methods = {}, this._methodsArray = null;
        }
        function clearCache(e) {
            return e._methodsArray = null, e;
        }
        return Service.fromJSON = function fromJSON(e, i) {
            var n = new Service(e, i.options);
            if (i.methods) for (var o = Object.keys(i.methods), s = 0; s < o.length; ++s) n.add(r.fromJSON(o[s], i.methods[o[s]]));
            return i.nested && n.addJSON(i.nested), n.comment = i.comment, n;
        }, Service.prototype.toJSON = function toJSON(r) {
            var n = e.prototype.toJSON.call(this, r), o = !!r && Boolean(r.keepComments);
            return i.toObject([ "options", n && n.options || void 0, "methods", e.arrayToJSON(this.methodsArray, r) || {}, "nested", n && n.nested || void 0, "comment", o ? this.comment : void 0 ]);
        }, Object.defineProperty(Service.prototype, "methodsArray", {
            get: function() {
                return this._methodsArray || (this._methodsArray = i.toArray(this.methods));
            }
        }), Service.prototype.get = function get(r) {
            return this.methods[r] || e.prototype.get.call(this, r);
        }, Service.prototype.resolveAll = function resolveAll() {
            for (var r = this.methodsArray, i = 0; i < r.length; ++i) r[i].resolve();
            return e.prototype.resolve.call(this);
        }, Service.prototype.add = function add(i) {
            if (this.get(i.name)) throw Error("duplicate name '" + i.name + "' in " + this);
            return i instanceof r ? (this.methods[i.name] = i, i.parent = this, clearCache(this)) : e.prototype.add.call(this, i);
        }, Service.prototype.remove = function remove(i) {
            if (i instanceof r) {
                if (this.methods[i.name] !== i) throw Error(i + " is not a member of " + this);
                return delete this.methods[i.name], i.parent = null, clearCache(this);
            }
            return e.prototype.remove.call(this, i);
        }, Service.prototype.create = function create(e, r, o) {
            for (var s, a = new n.Service(e, r, o), u = 0; u < this.methodsArray.length; ++u) {
                var l = i.lcFirst((s = this._methodsArray[u]).resolve().name).replace(/[^$\w_]/g, "");
                a[l] = i.codegen([ "r", "c" ], i.isReserved(l) ? l + "_" : l)("return this.rpcCall(m,q,s,r,c)")({
                    m: s,
                    q: s.resolvedRequestType.ctor,
                    s: s.resolvedResponseType.ctor
                });
            }
            return a;
        }, service;
    }
    var message$1 = Message, util$1 = requireMinimal(), decoder_1, hasRequiredDecoder, verifier_1, hasRequiredVerifier;
    function Message(e) {
        if (e) for (var r = Object.keys(e), i = 0; i < r.length; ++i) this[r[i]] = e[r[i]];
    }
    function requireDecoder() {
        if (hasRequiredDecoder) return decoder_1;
        hasRequiredDecoder = 1, decoder_1 = function decoder(n) {
            var o = i.codegen([ "r", "l" ], n.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (n.fieldsArray.filter((function(e) {
                return e.map;
            })).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()");
            n.group && o("if((t&7)===4)")("break");
            o("switch(t>>>3){");
            for (var s = 0; s < n.fieldsArray.length; ++s) {
                var a = n._fieldsArray[s].resolve(), u = a.resolvedType instanceof e ? "int32" : a.type, l = "m" + i.safeProp(a.name);
                o("case %i: {", a.id), a.map ? (o("if(%s===util.emptyObject)", l)("%s={}", l)("var c2 = r.uint32()+r.pos"), 
                void 0 !== r.defaults[a.keyType] ? o("k=%j", r.defaults[a.keyType]) : o("k=null"), 
                void 0 !== r.defaults[u] ? o("value=%j", r.defaults[u]) : o("value=null"), o("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", a.keyType)("case 2:"), 
                void 0 === r.basic[u] ? o("value=types[%i].decode(r,r.uint32())", s) : o("value=r.%s()", u), 
                o("break")("default:")("r.skipType(tag2&7)")("break")("}")("}"), void 0 !== r.long[a.keyType] ? o('%s[typeof k==="object"?util.longToHash(k):k]=value', l) : o("%s[k]=value", l)) : a.repeated ? (o("if(!(%s&&%s.length))", l, l)("%s=[]", l), 
                void 0 !== r.packed[u] && o("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", l, u)("}else"), 
                void 0 === r.basic[u] ? o(a.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", l, s) : o("%s.push(r.%s())", l, u)) : void 0 === r.basic[u] ? o(a.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", l, s) : o("%s=r.%s()", l, u), 
                o("break")("}");
            }
            for (o("default:")("r.skipType(t&7)")("break")("}")("}"), s = 0; s < n._fieldsArray.length; ++s) {
                var f = n._fieldsArray[s];
                f.required && o("if(!m.hasOwnProperty(%j))", f.name)("throw util.ProtocolError(%j,{instance:m})", missing(f));
            }
            return o("return m");
        };
        var e = require_enum(), r = requireTypes(), i = requireUtil();
        function missing(e) {
            return "missing required '" + e.name + "'";
        }
        return decoder_1;
    }
    function requireVerifier() {
        if (hasRequiredVerifier) return verifier_1;
        hasRequiredVerifier = 1, verifier_1 = function verifier(e) {
            var i = r.codegen([ "m" ], e.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected"), n = e.oneofsArray, o = {};
            n.length && i("var p={}");
            for (var s = 0; s < e.fieldsArray.length; ++s) {
                var a = e._fieldsArray[s].resolve(), u = "m" + r.safeProp(a.name);
                if (a.optional && i("if(%s!=null&&m.hasOwnProperty(%j)){", u, a.name), a.map) i("if(!util.isObject(%s))", u)("return%j", invalid(a, "object"))("var k=Object.keys(%s)", u)("for(var i=0;i<k.length;++i){"), 
                genVerifyKey(i, a, "k[i]"), genVerifyValue(i, a, s, u + "[k[i]]")("}"); else if (a.repeated) i("if(!Array.isArray(%s))", u)("return%j", invalid(a, "array"))("for(var i=0;i<%s.length;++i){", u), 
                genVerifyValue(i, a, s, u + "[i]")("}"); else {
                    if (a.partOf) {
                        var l = r.safeProp(a.partOf.name);
                        1 === o[a.partOf.name] && i("if(p%s===1)", l)("return%j", a.partOf.name + ": multiple values"), 
                        o[a.partOf.name] = 1, i("p%s=1", l);
                    }
                    genVerifyValue(i, a, s, u);
                }
                a.optional && i("}");
            }
            return i("return null");
        };
        var e = require_enum(), r = requireUtil();
        function invalid(e, r) {
            return e.name + ": " + r + (e.repeated && "array" !== r ? "[]" : e.map && "object" !== r ? "{k:" + e.keyType + "}" : "") + " expected";
        }
        function genVerifyValue(r, i, n, o) {
            if (i.resolvedType) if (i.resolvedType instanceof e) {
                r("switch(%s){", o)("default:")("return%j", invalid(i, "enum value"));
                for (var s = Object.keys(i.resolvedType.values), a = 0; a < s.length; ++a) r("case %i:", i.resolvedType.values[s[a]]);
                r("break")("}");
            } else r("{")("var e=types[%i].verify(%s);", n, o)("if(e)")("return%j+e", i.name + ".")("}"); else switch (i.type) {
              case "int32":
              case "uint32":
              case "sint32":
              case "fixed32":
              case "sfixed32":
                r("if(!util.isInteger(%s))", o)("return%j", invalid(i, "integer"));
                break;

              case "int64":
              case "uint64":
              case "sint64":
              case "fixed64":
              case "sfixed64":
                r("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", o, o, o, o)("return%j", invalid(i, "integer|Long"));
                break;

              case "float":
              case "double":
                r('if(typeof %s!=="number")', o)("return%j", invalid(i, "number"));
                break;

              case "bool":
                r('if(typeof %s!=="boolean")', o)("return%j", invalid(i, "boolean"));
                break;

              case "string":
                r("if(!util.isString(%s))", o)("return%j", invalid(i, "string"));
                break;

              case "bytes":
                r('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', o, o, o)("return%j", invalid(i, "buffer"));
            }
            return r;
        }
        function genVerifyKey(e, r, i) {
            switch (r.keyType) {
              case "int32":
              case "uint32":
              case "sint32":
              case "fixed32":
              case "sfixed32":
                e("if(!util.key32Re.test(%s))", i)("return%j", invalid(r, "integer key"));
                break;

              case "int64":
              case "uint64":
              case "sint64":
              case "fixed64":
              case "sfixed64":
                e("if(!util.key64Re.test(%s))", i)("return%j", invalid(r, "integer|Long key"));
                break;

              case "bool":
                e("if(!util.key2Re.test(%s))", i)("return%j", invalid(r, "boolean key"));
            }
            return e;
        }
        return verifier_1;
    }
    Message.create = function create(e) {
        return this.$type.create(e);
    }, Message.encode = function encode(e, r) {
        return this.$type.encode(e, r);
    }, Message.encodeDelimited = function encodeDelimited(e, r) {
        return this.$type.encodeDelimited(e, r);
    }, Message.decode = function decode(e) {
        return this.$type.decode(e);
    }, Message.decodeDelimited = function decodeDelimited(e) {
        return this.$type.decodeDelimited(e);
    }, Message.verify = function verify(e) {
        return this.$type.verify(e);
    }, Message.fromObject = function fromObject(e) {
        return this.$type.fromObject(e);
    }, Message.toObject = function toObject(e, r) {
        return this.$type.toObject(e, r);
    }, Message.prototype.toJSON = function toJSON() {
        return this.$type.toObject(this, util$1.toJSONOptions);
    };
    var converter = {}, hasRequiredConverter;
    function requireConverter() {
        return hasRequiredConverter || (hasRequiredConverter = 1, function(e) {
            var r = e, i = require_enum(), n = requireUtil();
            function genValuePartial_fromObject(e, r, n, o) {
                var s = !1;
                if (r.resolvedType) if (r.resolvedType instanceof i) {
                    e("switch(d%s){", o);
                    for (var a = r.resolvedType.values, u = Object.keys(a), l = 0; l < u.length; ++l) a[u[l]] !== r.typeDefault || s || (e("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', o, o, o), 
                    r.repeated || e("break"), s = !0), e("case%j:", u[l])("case %i:", a[u[l]])("m%s=%j", o, a[u[l]])("break");
                    e("}");
                } else e('if(typeof d%s!=="object")', o)("throw TypeError(%j)", r.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", o, n, o); else {
                    var f = !1;
                    switch (r.type) {
                      case "double":
                      case "float":
                        e("m%s=Number(d%s)", o, o);
                        break;

                      case "uint32":
                      case "fixed32":
                        e("m%s=d%s>>>0", o, o);
                        break;

                      case "int32":
                      case "sint32":
                      case "sfixed32":
                        e("m%s=d%s|0", o, o);
                        break;

                      case "uint64":
                        f = !0;

                      case "int64":
                      case "sint64":
                      case "fixed64":
                      case "sfixed64":
                        e("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", o, o, f)('else if(typeof d%s==="string")', o)("m%s=parseInt(d%s,10)", o, o)('else if(typeof d%s==="number")', o)("m%s=d%s", o, o)('else if(typeof d%s==="object")', o)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", o, o, o, f ? "true" : "");
                        break;

                      case "bytes":
                        e('if(typeof d%s==="string")', o)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", o, o, o)("else if(d%s.length >= 0)", o)("m%s=d%s", o, o);
                        break;

                      case "string":
                        e("m%s=String(d%s)", o, o);
                        break;

                      case "bool":
                        e("m%s=Boolean(d%s)", o, o);
                    }
                }
                return e;
            }
            function genValuePartial_toObject(e, r, n, o) {
                if (r.resolvedType) r.resolvedType instanceof i ? e("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", o, n, o, o, n, o, o) : e("d%s=types[%i].toObject(m%s,o)", o, n, o); else {
                    var s = !1;
                    switch (r.type) {
                      case "double":
                      case "float":
                        e("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", o, o, o, o);
                        break;

                      case "uint64":
                        s = !0;

                      case "int64":
                      case "sint64":
                      case "fixed64":
                      case "sfixed64":
                        e('if(typeof m%s==="number")', o)("d%s=o.longs===String?String(m%s):m%s", o, o, o)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", o, o, o, o, s ? "true" : "", o);
                        break;

                      case "bytes":
                        e("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", o, o, o, o, o);
                        break;

                      default:
                        e("d%s=m%s", o, o);
                    }
                }
                return e;
            }
            r.fromObject = function fromObject(e) {
                var r = e.fieldsArray, o = n.codegen([ "d" ], e.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
                if (!r.length) return o("return new this.ctor");
                o("var m=new this.ctor");
                for (var s = 0; s < r.length; ++s) {
                    var a = r[s].resolve(), u = n.safeProp(a.name);
                    a.map ? (o("if(d%s){", u)('if(typeof d%s!=="object")', u)("throw TypeError(%j)", a.fullName + ": object expected")("m%s={}", u)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", u), 
                    genValuePartial_fromObject(o, a, s, u + "[ks[i]]")("}")("}")) : a.repeated ? (o("if(d%s){", u)("if(!Array.isArray(d%s))", u)("throw TypeError(%j)", a.fullName + ": array expected")("m%s=[]", u)("for(var i=0;i<d%s.length;++i){", u), 
                    genValuePartial_fromObject(o, a, s, u + "[i]")("}")("}")) : (a.resolvedType instanceof i || o("if(d%s!=null){", u), 
                    genValuePartial_fromObject(o, a, s, u), a.resolvedType instanceof i || o("}"));
                }
                return o("return m");
            }, r.toObject = function toObject(e) {
                var r = e.fieldsArray.slice().sort(n.compareFieldsById);
                if (!r.length) return n.codegen()("return {}");
                for (var o = n.codegen([ "m", "o" ], e.name + "$toObject")("if(!o)")("o={}")("var d={}"), s = [], a = [], u = [], l = 0; l < r.length; ++l) r[l].partOf || (r[l].resolve().repeated ? s : r[l].map ? a : u).push(r[l]);
                if (s.length) {
                    for (o("if(o.arrays||o.defaults){"), l = 0; l < s.length; ++l) o("d%s=[]", n.safeProp(s[l].name));
                    o("}");
                }
                if (a.length) {
                    for (o("if(o.objects||o.defaults){"), l = 0; l < a.length; ++l) o("d%s={}", n.safeProp(a[l].name));
                    o("}");
                }
                if (u.length) {
                    for (o("if(o.defaults){"), l = 0; l < u.length; ++l) {
                        var f = u[l], h = n.safeProp(f.name);
                        if (f.resolvedType instanceof i) o("d%s=o.enums===String?%j:%j", h, f.resolvedType.valuesById[f.typeDefault], f.typeDefault); else if (f.long) o("if(util.Long){")("var n=new util.Long(%i,%i,%j)", f.typeDefault.low, f.typeDefault.high, f.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", h)("}else")("d%s=o.longs===String?%j:%i", h, f.typeDefault.toString(), f.typeDefault.toNumber()); else if (f.bytes) {
                            var p = "[" + Array.prototype.slice.call(f.typeDefault).join(",") + "]";
                            o("if(o.bytes===String)d%s=%j", h, String.fromCharCode.apply(String, f.typeDefault))("else{")("d%s=%s", h, p)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", h, h)("}");
                        } else o("d%s=%j", h, f.typeDefault);
                    }
                    o("}");
                }
                var c = !1;
                for (l = 0; l < r.length; ++l) {
                    f = r[l];
                    var d = e._fieldsArray.indexOf(f);
                    h = n.safeProp(f.name);
                    f.map ? (c || (c = !0, o("var ks2")), o("if(m%s&&(ks2=Object.keys(m%s)).length){", h, h)("d%s={}", h)("for(var j=0;j<ks2.length;++j){"), 
                    genValuePartial_toObject(o, f, d, h + "[ks2[j]]")("}")) : f.repeated ? (o("if(m%s&&m%s.length){", h, h)("d%s=[]", h)("for(var j=0;j<m%s.length;++j){", h), 
                    genValuePartial_toObject(o, f, d, h + "[j]")("}")) : (o("if(m%s!=null&&m.hasOwnProperty(%j)){", h, f.name), 
                    genValuePartial_toObject(o, f, d, h), f.partOf && o("if(o.oneofs)")("d%s=%j", n.safeProp(f.partOf.name), f.name)), 
                    o("}");
                }
                return o("return d");
            };
        }(converter)), converter;
    }
    var wrappers = {}, type, hasRequiredType, root, hasRequiredRoot, hasRequiredUtil, object, hasRequiredObject, _enum, hasRequired_enum, encoder_1, hasRequiredEncoder;
    function requireType() {
        if (hasRequiredType) return type;
        hasRequiredType = 1, type = Type;
        var e = requireNamespace();
        ((Type.prototype = Object.create(e.prototype)).constructor = Type).className = "Type";
        var r = require_enum(), i = requireOneof(), n = requireField(), o = requireMapfield(), s = requireService(), a = message$1, u = reader, l = writer, f = requireUtil(), h = requireEncoder(), p = requireDecoder(), c = requireVerifier(), d = requireConverter(), g = wrappers;
        function Type(r, i) {
            e.call(this, r, i), this.fields = {}, this.oneofs = void 0, this.extensions = void 0, 
            this.reserved = void 0, this.group = void 0, this._fieldsById = null, this._fieldsArray = null, 
            this._oneofsArray = null, this._ctor = null;
        }
        function clearCache(e) {
            return e._fieldsById = e._fieldsArray = e._oneofsArray = null, delete e.encode, 
            delete e.decode, delete e.verify, e;
        }
        return Object.defineProperties(Type.prototype, {
            fieldsById: {
                get: function() {
                    if (this._fieldsById) return this._fieldsById;
                    this._fieldsById = {};
                    for (var e = Object.keys(this.fields), r = 0; r < e.length; ++r) {
                        var i = this.fields[e[r]], n = i.id;
                        if (this._fieldsById[n]) throw Error("duplicate id " + n + " in " + this);
                        this._fieldsById[n] = i;
                    }
                    return this._fieldsById;
                }
            },
            fieldsArray: {
                get: function() {
                    return this._fieldsArray || (this._fieldsArray = f.toArray(this.fields));
                }
            },
            oneofsArray: {
                get: function() {
                    return this._oneofsArray || (this._oneofsArray = f.toArray(this.oneofs));
                }
            },
            ctor: {
                get: function() {
                    return this._ctor || (this.ctor = Type.generateConstructor(this)());
                },
                set: function(e) {
                    var r = e.prototype;
                    r instanceof a || ((e.prototype = new a).constructor = e, f.merge(e.prototype, r)), 
                    e.$type = e.prototype.$type = this, f.merge(e, a, !0), this._ctor = e;
                    for (var i = 0; i < this.fieldsArray.length; ++i) this._fieldsArray[i].resolve();
                    var n = {};
                    for (i = 0; i < this.oneofsArray.length; ++i) n[this._oneofsArray[i].resolve().name] = {
                        get: f.oneOfGetter(this._oneofsArray[i].oneof),
                        set: f.oneOfSetter(this._oneofsArray[i].oneof)
                    };
                    i && Object.defineProperties(e.prototype, n);
                }
            }
        }), Type.generateConstructor = function generateConstructor(e) {
            for (var r, i = f.codegen([ "p" ], e.name), n = 0; n < e.fieldsArray.length; ++n) (r = e._fieldsArray[n]).map ? i("this%s={}", f.safeProp(r.name)) : r.repeated && i("this%s=[]", f.safeProp(r.name));
            return i("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
        }, Type.fromJSON = function fromJSON(a, u) {
            var l = new Type(a, u.options);
            l.extensions = u.extensions, l.reserved = u.reserved;
            for (var f = Object.keys(u.fields), h = 0; h < f.length; ++h) l.add((void 0 !== u.fields[f[h]].keyType ? o.fromJSON : n.fromJSON)(f[h], u.fields[f[h]]));
            if (u.oneofs) for (f = Object.keys(u.oneofs), h = 0; h < f.length; ++h) l.add(i.fromJSON(f[h], u.oneofs[f[h]]));
            if (u.nested) for (f = Object.keys(u.nested), h = 0; h < f.length; ++h) {
                var p = u.nested[f[h]];
                l.add((void 0 !== p.id ? n.fromJSON : void 0 !== p.fields ? Type.fromJSON : void 0 !== p.values ? r.fromJSON : void 0 !== p.methods ? s.fromJSON : e.fromJSON)(f[h], p));
            }
            return u.extensions && u.extensions.length && (l.extensions = u.extensions), u.reserved && u.reserved.length && (l.reserved = u.reserved), 
            u.group && (l.group = !0), u.comment && (l.comment = u.comment), l;
        }, Type.prototype.toJSON = function toJSON(r) {
            var i = e.prototype.toJSON.call(this, r), n = !!r && Boolean(r.keepComments);
            return f.toObject([ "options", i && i.options || void 0, "oneofs", e.arrayToJSON(this.oneofsArray, r), "fields", e.arrayToJSON(this.fieldsArray.filter((function(e) {
                return !e.declaringField;
            })), r) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : void 0, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "group", this.group || void 0, "nested", i && i.nested || void 0, "comment", n ? this.comment : void 0 ]);
        }, Type.prototype.resolveAll = function resolveAll() {
            for (var r = this.fieldsArray, i = 0; i < r.length; ) r[i++].resolve();
            var n = this.oneofsArray;
            for (i = 0; i < n.length; ) n[i++].resolve();
            return e.prototype.resolveAll.call(this);
        }, Type.prototype.get = function get(e) {
            return this.fields[e] || this.oneofs && this.oneofs[e] || this.nested && this.nested[e] || null;
        }, Type.prototype.add = function add(r) {
            if (this.get(r.name)) throw Error("duplicate name '" + r.name + "' in " + this);
            if (r instanceof n && void 0 === r.extend) {
                if (this._fieldsById ? this._fieldsById[r.id] : this.fieldsById[r.id]) throw Error("duplicate id " + r.id + " in " + this);
                if (this.isReservedId(r.id)) throw Error("id " + r.id + " is reserved in " + this);
                if (this.isReservedName(r.name)) throw Error("name '" + r.name + "' is reserved in " + this);
                return r.parent && r.parent.remove(r), this.fields[r.name] = r, r.message = this, 
                r.onAdd(this), clearCache(this);
            }
            return r instanceof i ? (this.oneofs || (this.oneofs = {}), this.oneofs[r.name] = r, 
            r.onAdd(this), clearCache(this)) : e.prototype.add.call(this, r);
        }, Type.prototype.remove = function remove(r) {
            if (r instanceof n && void 0 === r.extend) {
                if (!this.fields || this.fields[r.name] !== r) throw Error(r + " is not a member of " + this);
                return delete this.fields[r.name], r.parent = null, r.onRemove(this), clearCache(this);
            }
            if (r instanceof i) {
                if (!this.oneofs || this.oneofs[r.name] !== r) throw Error(r + " is not a member of " + this);
                return delete this.oneofs[r.name], r.parent = null, r.onRemove(this), clearCache(this);
            }
            return e.prototype.remove.call(this, r);
        }, Type.prototype.isReservedId = function isReservedId(r) {
            return e.isReservedId(this.reserved, r);
        }, Type.prototype.isReservedName = function isReservedName(r) {
            return e.isReservedName(this.reserved, r);
        }, Type.prototype.create = function create(e) {
            return new this.ctor(e);
        }, Type.prototype.setup = function setup() {
            for (var e = this.fullName, r = [], i = 0; i < this.fieldsArray.length; ++i) r.push(this._fieldsArray[i].resolve().resolvedType);
            this.encode = h(this)({
                Writer: l,
                types: r,
                util: f
            }), this.decode = p(this)({
                Reader: u,
                types: r,
                util: f
            }), this.verify = c(this)({
                types: r,
                util: f
            }), this.fromObject = d.fromObject(this)({
                types: r,
                util: f
            }), this.toObject = d.toObject(this)({
                types: r,
                util: f
            });
            var n = g[e];
            if (n) {
                var o = Object.create(this);
                o.fromObject = this.fromObject, this.fromObject = n.fromObject.bind(o), o.toObject = this.toObject, 
                this.toObject = n.toObject.bind(o);
            }
            return this;
        }, Type.prototype.encode = function encode_setup(e, r) {
            return this.setup().encode(e, r);
        }, Type.prototype.encodeDelimited = function encodeDelimited(e, r) {
            return this.encode(e, r && r.len ? r.fork() : r).ldelim();
        }, Type.prototype.decode = function decode_setup(e, r) {
            return this.setup().decode(e, r);
        }, Type.prototype.decodeDelimited = function decodeDelimited(e) {
            return e instanceof u || (e = u.create(e)), this.decode(e, e.uint32());
        }, Type.prototype.verify = function verify_setup(e) {
            return this.setup().verify(e);
        }, Type.prototype.fromObject = function fromObject(e) {
            return this.setup().fromObject(e);
        }, Type.prototype.toObject = function toObject(e, r) {
            return this.setup().toObject(e, r);
        }, Type.d = function decorateType(e) {
            return function typeDecorator(r) {
                f.decorateType(r, e);
            };
        }, type;
    }
    function requireRoot() {
        if (hasRequiredRoot) return root;
        hasRequiredRoot = 1, root = Root;
        var e = requireNamespace();
        ((Root.prototype = Object.create(e.prototype)).constructor = Root).className = "Root";
        var r, i, n, o = requireField(), s = require_enum(), a = requireOneof(), u = requireUtil();
        function Root(r) {
            e.call(this, "", r), this.deferred = [], this.files = [];
        }
        function SYNC() {}
        Root.fromJSON = function fromJSON(e, r) {
            return r || (r = new Root), e.options && r.setOptions(e.options), r.addJSON(e.nested);
        }, Root.prototype.resolvePath = u.path.resolve, Root.prototype.fetch = u.fetch, 
        Root.prototype.load = function load(e, r, o) {
            "function" == typeof r && (o = r, r = void 0);
            var s = this;
            if (!o) return u.asPromise(load, s, e, r);
            var a = o === SYNC;
            function finish(e, r) {
                if (o) {
                    var i = o;
                    if (o = null, a) throw e;
                    i(e, r);
                }
            }
            function getBundledFileName(e) {
                var r = e.lastIndexOf("google/protobuf/");
                if (r > -1) {
                    var i = e.substring(r);
                    if (i in n) return i;
                }
                return null;
            }
            function process(e, n) {
                try {
                    if (u.isString(n) && "{" === n.charAt(0) && (n = JSON.parse(n)), u.isString(n)) {
                        i.filename = e;
                        var o, f = i(n, s, r), h = 0;
                        if (f.imports) for (;h < f.imports.length; ++h) (o = getBundledFileName(f.imports[h]) || s.resolvePath(e, f.imports[h])) && fetch(o);
                        if (f.weakImports) for (h = 0; h < f.weakImports.length; ++h) (o = getBundledFileName(f.weakImports[h]) || s.resolvePath(e, f.weakImports[h])) && fetch(o, !0);
                    } else s.setOptions(n.options).addJSON(n.nested);
                } catch (e) {
                    finish(e);
                }
                a || l || finish(null, s);
            }
            function fetch(e, r) {
                if (e = getBundledFileName(e) || e, !(s.files.indexOf(e) > -1)) if (s.files.push(e), 
                e in n) a ? process(e, n[e]) : (++l, setTimeout((function() {
                    --l, process(e, n[e]);
                }))); else if (a) {
                    var i;
                    try {
                        i = u.fs.readFileSync(e).toString("utf8");
                    } catch (e) {
                        return void (r || finish(e));
                    }
                    process(e, i);
                } else ++l, s.fetch(e, (function(i, n) {
                    --l, o && (i ? r ? l || finish(null, s) : finish(i) : process(e, n));
                }));
            }
            var l = 0;
            u.isString(e) && (e = [ e ]);
            for (var f, h = 0; h < e.length; ++h) (f = s.resolvePath("", e[h])) && fetch(f);
            if (a) return s;
            l || finish(null, s);
        }, Root.prototype.loadSync = function loadSync(e, r) {
            if (!u.isNode) throw Error("not supported");
            return this.load(e, r, SYNC);
        }, Root.prototype.resolveAll = function resolveAll() {
            if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map((function(e) {
                return "'extend " + e.extend + "' in " + e.parent.fullName;
            })).join(", "));
            return e.prototype.resolveAll.call(this);
        };
        var l = /^[A-Z]/;
        function tryHandleExtension(e, r) {
            var i = r.parent.lookup(r.extend);
            if (i) {
                var n = new o(r.fullName, r.id, r.type, r.rule, void 0, r.options);
                return i.get(n.name) || (n.declaringField = r, r.extensionField = n, i.add(n)), 
                !0;
            }
            return !1;
        }
        return Root.prototype._handleAdd = function _handleAdd(e) {
            if (e instanceof o) void 0 === e.extend || e.extensionField || tryHandleExtension(0, e) || this.deferred.push(e); else if (e instanceof s) l.test(e.name) && (e.parent[e.name] = e.values); else if (!(e instanceof a)) {
                if (e instanceof r) for (var i = 0; i < this.deferred.length; ) tryHandleExtension(0, this.deferred[i]) ? this.deferred.splice(i, 1) : ++i;
                for (var n = 0; n < e.nestedArray.length; ++n) this._handleAdd(e._nestedArray[n]);
                l.test(e.name) && (e.parent[e.name] = e);
            }
        }, Root.prototype._handleRemove = function _handleRemove(r) {
            if (r instanceof o) {
                if (void 0 !== r.extend) if (r.extensionField) r.extensionField.parent.remove(r.extensionField), 
                r.extensionField = null; else {
                    var i = this.deferred.indexOf(r);
                    i > -1 && this.deferred.splice(i, 1);
                }
            } else if (r instanceof s) l.test(r.name) && delete r.parent[r.name]; else if (r instanceof e) {
                for (var n = 0; n < r.nestedArray.length; ++n) this._handleRemove(r._nestedArray[n]);
                l.test(r.name) && delete r.parent[r.name];
            }
        }, Root._configure = function(e, o, s) {
            r = e, i = o, n = s;
        }, root;
    }
    function requireUtil() {
        if (hasRequiredUtil) return util$2.exports;
        hasRequiredUtil = 1;
        var e, r, i = util$2.exports = requireMinimal(), n = roots;
        i.codegen = codegen_1, i.fetch = fetch_1, i.path = path, i.fs = i.inquire("fs"), 
        i.toArray = function toArray(e) {
            if (e) {
                for (var r = Object.keys(e), i = new Array(r.length), n = 0; n < r.length; ) i[n] = e[r[n++]];
                return i;
            }
            return [];
        }, i.toObject = function toObject(e) {
            for (var r = {}, i = 0; i < e.length; ) {
                var n = e[i++], o = e[i++];
                void 0 !== o && (r[n] = o);
            }
            return r;
        };
        var o = /\\/g, s = /"/g;
        i.isReserved = function isReserved(e) {
            return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(e);
        }, i.safeProp = function safeProp(e) {
            return !/^[$\w_]+$/.test(e) || i.isReserved(e) ? '["' + e.replace(o, "\\\\").replace(s, '\\"') + '"]' : "." + e;
        }, i.ucFirst = function ucFirst(e) {
            return e.charAt(0).toUpperCase() + e.substring(1);
        };
        var a = /_([a-z])/g;
        i.camelCase = function camelCase(e) {
            return e.substring(0, 1) + e.substring(1).replace(a, (function(e, r) {
                return r.toUpperCase();
            }));
        }, i.compareFieldsById = function compareFieldsById(e, r) {
            return e.id - r.id;
        }, i.decorateType = function decorateType(r, n) {
            if (r.$type) return n && r.$type.name !== n && (i.decorateRoot.remove(r.$type), 
            r.$type.name = n, i.decorateRoot.add(r.$type)), r.$type;
            e || (e = requireType());
            var o = new e(n || r.name);
            return i.decorateRoot.add(o), o.ctor = r, Object.defineProperty(r, "$type", {
                value: o,
                enumerable: !1
            }), Object.defineProperty(r.prototype, "$type", {
                value: o,
                enumerable: !1
            }), o;
        };
        var u = 0;
        return i.decorateEnum = function decorateEnum(e) {
            if (e.$type) return e.$type;
            r || (r = require_enum());
            var n = new r("Enum" + u++, e);
            return i.decorateRoot.add(n), Object.defineProperty(e, "$type", {
                value: n,
                enumerable: !1
            }), n;
        }, i.setProperty = function setProperty(e, r, i) {
            if ("object" != typeof e) throw TypeError("dst must be an object");
            if (!r) throw TypeError("path must be specified");
            return function setProp(e, r, i) {
                var n = r.shift();
                if ("__proto__" === n) return e;
                if (r.length > 0) e[n] = setProp(e[n] || {}, r, i); else {
                    var o = e[n];
                    o && (i = [].concat(o).concat(i)), e[n] = i;
                }
                return e;
            }(e, r = r.split("."), i);
        }, Object.defineProperty(i, "decorateRoot", {
            get: function() {
                return n.decorated || (n.decorated = new (requireRoot()));
            }
        }), util$2.exports;
    }
    function requireObject() {
        if (hasRequiredObject) return object;
        hasRequiredObject = 1, object = ReflectionObject, ReflectionObject.className = "ReflectionObject";
        var e, r = requireUtil();
        function ReflectionObject(e, i) {
            if (!r.isString(e)) throw TypeError("name must be a string");
            if (i && !r.isObject(i)) throw TypeError("options must be an object");
            this.options = i, this.parsedOptions = null, this.name = e, this.parent = null, 
            this.resolved = !1, this.comment = null, this.filename = null;
        }
        return Object.defineProperties(ReflectionObject.prototype, {
            root: {
                get: function() {
                    for (var e = this; null !== e.parent; ) e = e.parent;
                    return e;
                }
            },
            fullName: {
                get: function() {
                    for (var e = [ this.name ], r = this.parent; r; ) e.unshift(r.name), r = r.parent;
                    return e.join(".");
                }
            }
        }), ReflectionObject.prototype.toJSON = function toJSON() {
            throw Error();
        }, ReflectionObject.prototype.onAdd = function onAdd(r) {
            this.parent && this.parent !== r && this.parent.remove(this), this.parent = r, this.resolved = !1;
            var i = r.root;
            i instanceof e && i._handleAdd(this);
        }, ReflectionObject.prototype.onRemove = function onRemove(r) {
            var i = r.root;
            i instanceof e && i._handleRemove(this), this.parent = null, this.resolved = !1;
        }, ReflectionObject.prototype.resolve = function resolve() {
            return this.resolved || this.root instanceof e && (this.resolved = !0), this;
        }, ReflectionObject.prototype.getOption = function getOption(e) {
            if (this.options) return this.options[e];
        }, ReflectionObject.prototype.setOption = function setOption(e, r, i) {
            return i && this.options && void 0 !== this.options[e] || ((this.options || (this.options = {}))[e] = r), 
            this;
        }, ReflectionObject.prototype.setParsedOption = function setParsedOption(e, i, n) {
            this.parsedOptions || (this.parsedOptions = []);
            var o = this.parsedOptions;
            if (n) {
                var s = o.find((function(r) {
                    return Object.prototype.hasOwnProperty.call(r, e);
                }));
                if (s) {
                    var a = s[e];
                    r.setProperty(a, n, i);
                } else (s = {})[e] = r.setProperty({}, n, i), o.push(s);
            } else {
                var u = {};
                u[e] = i, o.push(u);
            }
            return this;
        }, ReflectionObject.prototype.setOptions = function setOptions(e, r) {
            if (e) for (var i = Object.keys(e), n = 0; n < i.length; ++n) this.setOption(i[n], e[i[n]], r);
            return this;
        }, ReflectionObject.prototype.toString = function toString() {
            var e = this.constructor.className, r = this.fullName;
            return r.length ? e + " " + r : e;
        }, ReflectionObject._configure = function(r) {
            e = r;
        }, object;
    }
    function require_enum() {
        if (hasRequired_enum) return _enum;
        hasRequired_enum = 1, _enum = Enum;
        var e = requireObject();
        ((Enum.prototype = Object.create(e.prototype)).constructor = Enum).className = "Enum";
        var r = requireNamespace(), i = requireUtil();
        function Enum(r, i, n, o, s, a) {
            if (e.call(this, r, n), i && "object" != typeof i) throw TypeError("values must be an object");
            if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = o, 
            this.comments = s || {}, this.valuesOptions = a, this.reserved = void 0, i) for (var u = Object.keys(i), l = 0; l < u.length; ++l) "number" == typeof i[u[l]] && (this.valuesById[this.values[u[l]] = i[u[l]]] = u[l]);
        }
        return Enum.fromJSON = function fromJSON(e, r) {
            var i = new Enum(e, r.values, r.options, r.comment, r.comments);
            return i.reserved = r.reserved, i;
        }, Enum.prototype.toJSON = function toJSON(e) {
            var r = !!e && Boolean(e.keepComments);
            return i.toObject([ "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", r ? this.comment : void 0, "comments", r ? this.comments : void 0 ]);
        }, Enum.prototype.add = function add(e, r, n, o) {
            if (!i.isString(e)) throw TypeError("name must be a string");
            if (!i.isInteger(r)) throw TypeError("id must be an integer");
            if (void 0 !== this.values[e]) throw Error("duplicate name '" + e + "' in " + this);
            if (this.isReservedId(r)) throw Error("id " + r + " is reserved in " + this);
            if (this.isReservedName(e)) throw Error("name '" + e + "' is reserved in " + this);
            if (void 0 !== this.valuesById[r]) {
                if (!this.options || !this.options.allow_alias) throw Error("duplicate id " + r + " in " + this);
                this.values[e] = r;
            } else this.valuesById[this.values[e] = r] = e;
            return o && (void 0 === this.valuesOptions && (this.valuesOptions = {}), this.valuesOptions[e] = o || null), 
            this.comments[e] = n || null, this;
        }, Enum.prototype.remove = function remove(e) {
            if (!i.isString(e)) throw TypeError("name must be a string");
            var r = this.values[e];
            if (null == r) throw Error("name '" + e + "' does not exist in " + this);
            return delete this.valuesById[r], delete this.values[e], delete this.comments[e], 
            this.valuesOptions && delete this.valuesOptions[e], this;
        }, Enum.prototype.isReservedId = function isReservedId(e) {
            return r.isReservedId(this.reserved, e);
        }, Enum.prototype.isReservedName = function isReservedName(e) {
            return r.isReservedName(this.reserved, e);
        }, _enum;
    }
    function requireEncoder() {
        if (hasRequiredEncoder) return encoder_1;
        hasRequiredEncoder = 1, encoder_1 = function encoder(n) {
            for (var o, s = i.codegen([ "m", "w" ], n.name + "$encode")("if(!w)")("w=Writer.create()"), a = n.fieldsArray.slice().sort(i.compareFieldsById), u = 0; u < a.length; ++u) {
                var l = a[u].resolve(), f = n._fieldsArray.indexOf(l), h = l.resolvedType instanceof e ? "int32" : l.type, p = r.basic[h];
                o = "m" + i.safeProp(l.name), l.map ? (s("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", o, l.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", o)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (l.id << 3 | 2) >>> 0, 8 | r.mapKey[l.keyType], l.keyType), 
                void 0 === p ? s("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", f, o) : s(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | p, h, o), 
                s("}")("}")) : l.repeated ? (s("if(%s!=null&&%s.length){", o, o), l.packed && void 0 !== r.packed[h] ? s("w.uint32(%i).fork()", (l.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", o)("w.%s(%s[i])", h, o)("w.ldelim()") : (s("for(var i=0;i<%s.length;++i)", o), 
                void 0 === p ? genTypePartial(s, l, f, o + "[i]") : s("w.uint32(%i).%s(%s[i])", (l.id << 3 | p) >>> 0, h, o)), 
                s("}")) : (l.optional && s("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", o, l.name), 
                void 0 === p ? genTypePartial(s, l, f, o) : s("w.uint32(%i).%s(%s)", (l.id << 3 | p) >>> 0, h, o));
            }
            return s("return w");
        };
        var e = require_enum(), r = requireTypes(), i = requireUtil();
        function genTypePartial(e, r, i, n) {
            return r.resolvedType.group ? e("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", i, n, (r.id << 3 | 3) >>> 0, (r.id << 3 | 4) >>> 0) : e("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", i, n, (r.id << 3 | 2) >>> 0);
        }
        return encoder_1;
    }
    !function(e) {
        var r = message$1;
        e[".google.protobuf.Any"] = {
            fromObject: function(e) {
                if (e && e["@type"]) {
                    var r = e["@type"].substring(e["@type"].lastIndexOf("/") + 1), i = this.lookup(r);
                    if (i) {
                        var n = "." === e["@type"].charAt(0) ? e["@type"].slice(1) : e["@type"];
                        return -1 === n.indexOf("/") && (n = "/" + n), this.create({
                            type_url: n,
                            value: i.encode(i.fromObject(e)).finish()
                        });
                    }
                }
                return this.fromObject(e);
            },
            toObject: function(e, i) {
                var n = "", o = "";
                if (i && i.json && e.type_url && e.value) {
                    o = e.type_url.substring(e.type_url.lastIndexOf("/") + 1), n = e.type_url.substring(0, e.type_url.lastIndexOf("/") + 1);
                    var s = this.lookup(o);
                    s && (e = s.decode(e.value));
                }
                if (!(e instanceof this.ctor) && e instanceof r) {
                    var a = e.$type.toObject(e, i);
                    return "" === n && (n = "type.googleapis.com/"), o = n + ("." === e.$type.fullName[0] ? e.$type.fullName.slice(1) : e.$type.fullName), 
                    a["@type"] = o, a;
                }
                return this.toObject(e, i);
            }
        };
    }(wrappers);
    var protobuf$1 = indexLight.exports = indexMinimal;
    function load(e, r, i) {
        return "function" == typeof r ? (i = r, r = new protobuf$1.Root) : r || (r = new protobuf$1.Root), 
        r.load(e, i);
    }
    function loadSync(e, r) {
        return r || (r = new protobuf$1.Root), r.loadSync(e);
    }
    protobuf$1.build = "light", protobuf$1.load = load, protobuf$1.loadSync = loadSync, 
    protobuf$1.encoder = requireEncoder(), protobuf$1.decoder = requireDecoder(), protobuf$1.verifier = requireVerifier(), 
    protobuf$1.converter = requireConverter(), protobuf$1.ReflectionObject = requireObject(), 
    protobuf$1.Namespace = requireNamespace(), protobuf$1.Root = requireRoot(), protobuf$1.Enum = require_enum(), 
    protobuf$1.Type = requireType(), protobuf$1.Field = requireField(), protobuf$1.OneOf = requireOneof(), 
    protobuf$1.MapField = requireMapfield(), protobuf$1.Service = requireService(), 
    protobuf$1.Method = requireMethod(), protobuf$1.Message = message$1, protobuf$1.wrappers = wrappers, 
    protobuf$1.types = requireTypes(), protobuf$1.util = requireUtil(), protobuf$1.ReflectionObject._configure(protobuf$1.Root), 
    protobuf$1.Namespace._configure(protobuf$1.Type, protobuf$1.Service, protobuf$1.Enum), 
    protobuf$1.Root._configure(protobuf$1.Type), protobuf$1.Field._configure(protobuf$1.Type);
    var indexLightExports = indexLight.exports, tokenize_1 = tokenize$1, delimRe = /[\s{}=;:[\],'"()<>]/g, stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g, setCommentRe = /^ *[*/]+ */, setCommentAltRe = /^\s*\*?\/*/, setCommentSplitRe = /\n/g, whitespaceRe = /\s/, unescapeRe = /\\(.?)/g, unescapeMap = {
        0: "\0",
        r: "\r",
        n: "\n",
        t: "\t"
    };
    function unescape(e) {
        return e.replace(unescapeRe, (function(e, r) {
            switch (r) {
              case "\\":
              case "":
                return r;

              default:
                return unescapeMap[r] || "";
            }
        }));
    }
    function tokenize$1(e, r) {
        e = e.toString();
        var i = 0, n = e.length, o = 1, s = 0, a = {}, u = [], l = null;
        function illegal(e) {
            return Error("illegal " + e + " (line " + o + ")");
        }
        function charAt(r) {
            return e.charAt(r);
        }
        function setComment(i, n, u) {
            var l, f = {
                type: e.charAt(i++),
                lineEmpty: !1,
                leading: u
            }, h = i - (r ? 2 : 3);
            do {
                if (--h < 0 || "\n" === (l = e.charAt(h))) {
                    f.lineEmpty = !0;
                    break;
                }
            } while (" " === l || "\t" === l);
            for (var p = e.substring(i, n).split(setCommentSplitRe), c = 0; c < p.length; ++c) p[c] = p[c].replace(r ? setCommentAltRe : setCommentRe, "").trim();
            f.text = p.join("\n").trim(), a[o] = f, s = o;
        }
        function isDoubleSlashCommentLine(r) {
            var i = findEndOfLine(r), n = e.substring(r, i);
            return /^\s*\/{1,2}/.test(n);
        }
        function findEndOfLine(e) {
            for (var r = e; r < n && "\n" !== charAt(r); ) r++;
            return r;
        }
        function next() {
            if (u.length > 0) return u.shift();
            if (l) return function readString() {
                var r = "'" === l ? stringSingleRe : stringDoubleRe;
                r.lastIndex = i - 1;
                var n = r.exec(e);
                if (!n) throw illegal("string");
                return i = r.lastIndex, push(l), l = null, unescape(n[1]);
            }();
            var s, a, f, h, p, c = 0 === i;
            do {
                if (i === n) return null;
                for (s = !1; whitespaceRe.test(f = charAt(i)); ) if ("\n" === f && (c = !0, ++o), 
                ++i === n) return null;
                if ("/" === charAt(i)) {
                    if (++i === n) throw illegal("comment");
                    if ("/" === charAt(i)) if (r) {
                        if (h = i, p = !1, isDoubleSlashCommentLine(i)) {
                            p = !0;
                            do {
                                if ((i = findEndOfLine(i)) === n) break;
                                if (i++, !c) break;
                            } while (isDoubleSlashCommentLine(i));
                        } else i = Math.min(n, findEndOfLine(i) + 1);
                        p && (setComment(h, i, c), c = !0), o++, s = !0;
                    } else {
                        for (p = "/" === charAt(h = i + 1); "\n" !== charAt(++i); ) if (i === n) return null;
                        ++i, p && (setComment(h, i - 1, c), c = !0), ++o, s = !0;
                    } else {
                        if ("*" !== (f = charAt(i))) return "/";
                        h = i + 1, p = r || "*" === charAt(h);
                        do {
                            if ("\n" === f && ++o, ++i === n) throw illegal("comment");
                            a = f, f = charAt(i);
                        } while ("*" !== a || "/" !== f);
                        ++i, p && (setComment(h, i - 2, c), c = !0), s = !0;
                    }
                }
            } while (s);
            var d = i;
            if (delimRe.lastIndex = 0, !delimRe.test(charAt(d++))) for (;d < n && !delimRe.test(charAt(d)); ) ++d;
            var g = e.substring(i, i = d);
            return '"' !== g && "'" !== g || (l = g), g;
        }
        function push(e) {
            u.push(e);
        }
        function peek() {
            if (!u.length) {
                var e = next();
                if (null === e) return null;
                push(e);
            }
            return u[0];
        }
        return Object.defineProperty({
            next,
            peek,
            push,
            skip: function skip(e, r) {
                var i = peek();
                if (i === e) return next(), !0;
                if (!r) throw illegal("token '" + i + "', '" + e + "' expected");
                return !1;
            },
            cmnt: function cmnt(e) {
                var i, n = null;
                return void 0 === e ? (i = a[o - 1], delete a[o - 1], i && (r || "*" === i.type || i.lineEmpty) && (n = i.leading ? i.text : null)) : (s < e && peek(), 
                i = a[e], delete a[e], !i || i.lineEmpty || !r && "/" !== i.type || (n = i.leading ? null : i.text)), 
                n;
            }
        }, "line", {
            get: function() {
                return o;
            }
        });
    }
    tokenize$1.unescape = unescape;
    var parse_1 = parse;
    parse.filename = null, parse.defaults = {
        keepCase: !1
    };
    var tokenize = tokenize_1, Root = requireRoot(), Type = requireType(), Field = requireField(), MapField = requireMapfield(), OneOf = requireOneof(), Enum = require_enum(), Service = requireService(), Method = requireMethod(), types = requireTypes(), util = requireUtil(), base10Re = /^[1-9][0-9]*$/, base10NegRe = /^-?[1-9][0-9]*$/, base16Re = /^0[x][0-9a-fA-F]+$/, base16NegRe = /^-?0[x][0-9a-fA-F]+$/, base8Re = /^0[0-7]+$/, base8NegRe = /^-?0[0-7]+$/, numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/, nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/, typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/, fqTypeRefRe = /^(?:\.[a-zA-Z_][a-zA-Z_0-9]*)+$/;
    function parse(e, r, i) {
        r instanceof Root || (i = r, r = new Root), i || (i = parse.defaults);
        var n, o, s, a, u, l = i.preferTrailingComment || !1, f = tokenize(e, i.alternateCommentMode || !1), h = f.next, p = f.push, c = f.peek, d = f.skip, g = f.cmnt, m = !0, y = !1, v = r, b = i.keepCase ? function(e) {
            return e;
        } : util.camelCase;
        function illegal(e, r, i) {
            var n = parse.filename;
            return i || (parse.filename = null), Error("illegal " + (r || "token") + " '" + e + "' (" + (n ? n + ", " : "") + "line " + f.line + ")");
        }
        function readString() {
            var e, r = [];
            do {
                if ('"' !== (e = h()) && "'" !== e) throw illegal(e);
                r.push(h()), d(e), e = c();
            } while ('"' === e || "'" === e);
            return r.join("");
        }
        function readValue(e) {
            var r = h();
            switch (r) {
              case "'":
              case '"':
                return p(r), readString();

              case "true":
              case "TRUE":
                return !0;

              case "false":
              case "FALSE":
                return !1;
            }
            try {
                return function parseNumber(e, r) {
                    var i = 1;
                    "-" === e.charAt(0) && (i = -1, e = e.substring(1));
                    switch (e) {
                      case "inf":
                      case "INF":
                      case "Inf":
                        return i * (1 / 0);

                      case "nan":
                      case "NAN":
                      case "Nan":
                      case "NaN":
                        return NaN;

                      case "0":
                        return 0;
                    }
                    if (base10Re.test(e)) return i * parseInt(e, 10);
                    if (base16Re.test(e)) return i * parseInt(e, 16);
                    if (base8Re.test(e)) return i * parseInt(e, 8);
                    if (numberRe.test(e)) return i * parseFloat(e);
                    throw illegal(e, "number", r);
                }(r, !0);
            } catch (i) {
                if (e && typeRefRe.test(r)) return r;
                throw illegal(r, "value");
            }
        }
        function readRanges(e, r) {
            var i, n;
            do {
                !r || '"' !== (i = c()) && "'" !== i ? e.push([ n = parseId(h()), d("to", !0) ? parseId(h()) : n ]) : e.push(readString());
            } while (d(",", !0));
            d(";");
        }
        function parseId(e, r) {
            switch (e) {
              case "max":
              case "MAX":
              case "Max":
                return 536870911;

              case "0":
                return 0;
            }
            if (!r && "-" === e.charAt(0)) throw illegal(e, "id");
            if (base10NegRe.test(e)) return parseInt(e, 10);
            if (base16NegRe.test(e)) return parseInt(e, 16);
            if (base8NegRe.test(e)) return parseInt(e, 8);
            throw illegal(e, "id");
        }
        function parsePackage() {
            if (void 0 !== n) throw illegal("package");
            if (n = h(), !typeRefRe.test(n)) throw illegal(n, "name");
            v = v.define(n), d(";");
        }
        function parseImport() {
            var e, r = c();
            switch (r) {
              case "weak":
                e = s || (s = []), h();
                break;

              case "public":
                h();

              default:
                e = o || (o = []);
            }
            r = readString(), d(";"), e.push(r);
        }
        function parseSyntax() {
            if (d("="), a = readString(), !(y = "proto3" === a) && "proto2" !== a) throw illegal(a, "syntax");
            d(";");
        }
        function parseCommon(e, r) {
            switch (r) {
              case "option":
                return parseOption(e, r), d(";"), !0;

              case "message":
                return parseType(e, r), !0;

              case "enum":
                return parseEnum(e, r), !0;

              case "service":
                return function parseService(e, r) {
                    if (!nameRe.test(r = h())) throw illegal(r, "service name");
                    var i = new Service(r);
                    ifBlock(i, (function parseService_block(e) {
                        if (!parseCommon(i, e)) {
                            if ("rpc" !== e) throw illegal(e);
                            !function parseMethod(e, r) {
                                var i = g(), n = r;
                                if (!nameRe.test(r = h())) throw illegal(r, "name");
                                var o, s, a, u, l = r;
                                d("("), d("stream", !0) && (s = !0);
                                if (!typeRefRe.test(r = h())) throw illegal(r);
                                o = r, d(")"), d("returns"), d("("), d("stream", !0) && (u = !0);
                                if (!typeRefRe.test(r = h())) throw illegal(r);
                                a = r, d(")");
                                var f = new Method(l, n, o, a, s, u);
                                f.comment = i, ifBlock(f, (function parseMethod_block(e) {
                                    if ("option" !== e) throw illegal(e);
                                    parseOption(f, e), d(";");
                                })), e.add(f);
                            }(i, e);
                        }
                    })), e.add(i);
                }(e, r), !0;

              case "extend":
                return function parseExtension(e, r) {
                    if (!typeRefRe.test(r = h())) throw illegal(r, "reference");
                    var i = r;
                    ifBlock(null, (function parseExtension_block(r) {
                        switch (r) {
                          case "required":
                          case "repeated":
                            parseField(e, r, i);
                            break;

                          case "optional":
                            parseField(e, y ? "proto3_optional" : "optional", i);
                            break;

                          default:
                            if (!y || !typeRefRe.test(r)) throw illegal(r);
                            p(r), parseField(e, "optional", i);
                        }
                    }));
                }(e, r), !0;
            }
            return !1;
        }
        function ifBlock(e, r, i) {
            var n = f.line;
            if (e && ("string" != typeof e.comment && (e.comment = g()), e.filename = parse.filename), 
            d("{", !0)) {
                for (var o; "}" !== (o = h()); ) r(o);
                d(";", !0);
            } else i && i(), d(";"), e && ("string" != typeof e.comment || l) && (e.comment = g(n) || e.comment);
        }
        function parseType(e, r) {
            if (!nameRe.test(r = h())) throw illegal(r, "type name");
            var i = new Type(r);
            ifBlock(i, (function parseType_block(e) {
                if (!parseCommon(i, e)) switch (e) {
                  case "map":
                    !function parseMapField(e) {
                        d("<");
                        var r = h();
                        if (void 0 === types.mapKey[r]) throw illegal(r, "type");
                        d(",");
                        var i = h();
                        if (!typeRefRe.test(i)) throw illegal(i, "type");
                        d(">");
                        var n = h();
                        if (!nameRe.test(n)) throw illegal(n, "name");
                        d("=");
                        var o = new MapField(b(n), parseId(h()), r, i);
                        ifBlock(o, (function parseMapField_block(e) {
                            if ("option" !== e) throw illegal(e);
                            parseOption(o, e), d(";");
                        }), (function parseMapField_line() {
                            parseInlineOptions(o);
                        })), e.add(o);
                    }(i);
                    break;

                  case "required":
                  case "repeated":
                    parseField(i, e);
                    break;

                  case "optional":
                    parseField(i, y ? "proto3_optional" : "optional");
                    break;

                  case "oneof":
                    !function parseOneOf(e, r) {
                        if (!nameRe.test(r = h())) throw illegal(r, "name");
                        var i = new OneOf(b(r));
                        ifBlock(i, (function parseOneOf_block(e) {
                            "option" === e ? (parseOption(i, e), d(";")) : (p(e), parseField(i, "optional"));
                        })), e.add(i);
                    }(i, e);
                    break;

                  case "extensions":
                    readRanges(i.extensions || (i.extensions = []));
                    break;

                  case "reserved":
                    readRanges(i.reserved || (i.reserved = []), !0);
                    break;

                  default:
                    if (!y || !typeRefRe.test(e)) throw illegal(e);
                    p(e), parseField(i, "optional");
                }
            })), e.add(i);
        }
        function parseField(e, r, i) {
            var n = h();
            if ("group" !== n) {
                for (;n.endsWith(".") || c().startsWith("."); ) n += h();
                if (!typeRefRe.test(n)) throw illegal(n, "type");
                var o = h();
                if (!nameRe.test(o)) throw illegal(o, "name");
                o = b(o), d("=");
                var s = new Field(o, parseId(h()), n, r, i);
                if (ifBlock(s, (function parseField_block(e) {
                    if ("option" !== e) throw illegal(e);
                    parseOption(s, e), d(";");
                }), (function parseField_line() {
                    parseInlineOptions(s);
                })), "proto3_optional" === r) {
                    var a = new OneOf("_" + o);
                    s.setOption("proto3_optional", !0), a.add(s), e.add(a);
                } else e.add(s);
                y || !s.repeated || void 0 === types.packed[n] && void 0 !== types.basic[n] || s.setOption("packed", !1, !0);
            } else (function parseGroup(e, r) {
                var i = h();
                if (!nameRe.test(i)) throw illegal(i, "name");
                var n = util.lcFirst(i);
                i === n && (i = util.ucFirst(i));
                d("=");
                var o = parseId(h()), s = new Type(i);
                s.group = !0;
                var a = new Field(n, o, i, r);
                a.filename = parse.filename, ifBlock(s, (function parseGroup_block(e) {
                    switch (e) {
                      case "option":
                        parseOption(s, e), d(";");
                        break;

                      case "required":
                      case "repeated":
                        parseField(s, e);
                        break;

                      case "optional":
                        parseField(s, y ? "proto3_optional" : "optional");
                        break;

                      case "message":
                        parseType(s, e);
                        break;

                      case "enum":
                        parseEnum(s, e);
                        break;

                      default:
                        throw illegal(e);
                    }
                })), e.add(s).add(a);
            })(e, r);
        }
        function parseEnum(e, r) {
            if (!nameRe.test(r = h())) throw illegal(r, "name");
            var i = new Enum(r);
            ifBlock(i, (function parseEnum_block(e) {
                switch (e) {
                  case "option":
                    parseOption(i, e), d(";");
                    break;

                  case "reserved":
                    readRanges(i.reserved || (i.reserved = []), !0);
                    break;

                  default:
                    !function parseEnumValue(e, r) {
                        if (!nameRe.test(r)) throw illegal(r, "name");
                        d("=");
                        var i = parseId(h(), !0), n = {
                            options: void 0,
                            setOption: function(e, r) {
                                void 0 === this.options && (this.options = {}), this.options[e] = r;
                            }
                        };
                        ifBlock(n, (function parseEnumValue_block(e) {
                            if ("option" !== e) throw illegal(e);
                            parseOption(n, e), d(";");
                        }), (function parseEnumValue_line() {
                            parseInlineOptions(n);
                        })), e.add(r, i, n.comment, n.options);
                    }(i, e);
                }
            })), e.add(i);
        }
        function parseOption(e, r) {
            var i = d("(", !0);
            if (!typeRefRe.test(r = h())) throw illegal(r, "name");
            var n, o = r, s = o;
            i && (d(")"), s = o = "(" + o + ")", r = c(), fqTypeRefRe.test(r) && (n = r.slice(1), 
            o += r, h())), d("="), function setParsedOption(e, r, i, n) {
                e.setParsedOption && e.setParsedOption(r, i, n);
            }(e, s, parseOptionValue(e, o), n);
        }
        function parseOptionValue(e, r) {
            if (d("{", !0)) {
                for (var i = {}; !d("}", !0); ) {
                    if (!nameRe.test(u = h())) throw illegal(u, "name");
                    var n, o = u;
                    if (d(":", !0), "{" === c()) n = parseOptionValue(e, r + "." + u); else if ("[" === c()) {
                        var s;
                        if (n = [], d("[", !0)) {
                            do {
                                s = readValue(!0), n.push(s);
                            } while (d(",", !0));
                            d("]"), void 0 !== s && setOption(e, r + "." + u, s);
                        }
                    } else n = readValue(!0), setOption(e, r + "." + u, n);
                    var a = i[o];
                    a && (n = [].concat(a).concat(n)), i[o] = n, d(",", !0), d(";", !0);
                }
                return i;
            }
            var l = readValue(!0);
            return setOption(e, r, l), l;
        }
        function setOption(e, r, i) {
            e.setOption && e.setOption(r, i);
        }
        function parseInlineOptions(e) {
            if (d("[", !0)) {
                do {
                    parseOption(e, "option");
                } while (d(",", !0));
                d("]");
            }
            return e;
        }
        for (;null !== (u = h()); ) switch (u) {
          case "package":
            if (!m) throw illegal(u);
            parsePackage();
            break;

          case "import":
            if (!m) throw illegal(u);
            parseImport();
            break;

          case "syntax":
            if (!m) throw illegal(u);
            parseSyntax();
            break;

          case "option":
            parseOption(v, u), d(";");
            break;

          default:
            if (parseCommon(v, u)) {
                m = !1;
                continue;
            }
            throw illegal(u);
        }
        return parse.filename = null, {
            package: n,
            imports: o,
            weakImports: s,
            syntax: a,
            root: r
        };
    }
    var common_1 = common, commonRe = /\/|\./, timeType;
    function common(e, r) {
        commonRe.test(e) || (e = "google/protobuf/" + e + ".proto", r = {
            nested: {
                google: {
                    nested: {
                        protobuf: {
                            nested: r
                        }
                    }
                }
            }
        }), common[e] = r;
    }
    common("any", {
        Any: {
            fields: {
                type_url: {
                    type: "string",
                    id: 1
                },
                value: {
                    type: "bytes",
                    id: 2
                }
            }
        }
    }), common("duration", {
        Duration: timeType = {
            fields: {
                seconds: {
                    type: "int64",
                    id: 1
                },
                nanos: {
                    type: "int32",
                    id: 2
                }
            }
        }
    }), common("timestamp", {
        Timestamp: timeType
    }), common("empty", {
        Empty: {
            fields: {}
        }
    }), common("struct", {
        Struct: {
            fields: {
                fields: {
                    keyType: "string",
                    type: "Value",
                    id: 1
                }
            }
        },
        Value: {
            oneofs: {
                kind: {
                    oneof: [ "nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue" ]
                }
            },
            fields: {
                nullValue: {
                    type: "NullValue",
                    id: 1
                },
                numberValue: {
                    type: "double",
                    id: 2
                },
                stringValue: {
                    type: "string",
                    id: 3
                },
                boolValue: {
                    type: "bool",
                    id: 4
                },
                structValue: {
                    type: "Struct",
                    id: 5
                },
                listValue: {
                    type: "ListValue",
                    id: 6
                }
            }
        },
        NullValue: {
            values: {
                NULL_VALUE: 0
            }
        },
        ListValue: {
            fields: {
                values: {
                    rule: "repeated",
                    type: "Value",
                    id: 1
                }
            }
        }
    }), common("wrappers", {
        DoubleValue: {
            fields: {
                value: {
                    type: "double",
                    id: 1
                }
            }
        },
        FloatValue: {
            fields: {
                value: {
                    type: "float",
                    id: 1
                }
            }
        },
        Int64Value: {
            fields: {
                value: {
                    type: "int64",
                    id: 1
                }
            }
        },
        UInt64Value: {
            fields: {
                value: {
                    type: "uint64",
                    id: 1
                }
            }
        },
        Int32Value: {
            fields: {
                value: {
                    type: "int32",
                    id: 1
                }
            }
        },
        UInt32Value: {
            fields: {
                value: {
                    type: "uint32",
                    id: 1
                }
            }
        },
        BoolValue: {
            fields: {
                value: {
                    type: "bool",
                    id: 1
                }
            }
        },
        StringValue: {
            fields: {
                value: {
                    type: "string",
                    id: 1
                }
            }
        },
        BytesValue: {
            fields: {
                value: {
                    type: "bytes",
                    id: 1
                }
            }
        }
    }), common("field_mask", {
        FieldMask: {
            fields: {
                paths: {
                    rule: "repeated",
                    type: "string",
                    id: 1
                }
            }
        }
    }), common.get = function get(e) {
        return common[e] || null;
    };
    var protobuf = src.exports = indexLightExports;
    protobuf.build = "full", protobuf.tokenize = tokenize_1, protobuf.parse = parse_1, 
    protobuf.common = common_1, protobuf.Root._configure(protobuf.Type, protobuf.parse, protobuf.common);
    var srcExports = src.exports, protobufjs = srcExports;
    const V4_PRIVATE_KEY = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAK8nNR1lTnIfIes6oRWJNj3mB6OssDGx0uGMpgpbVCpf6+VwnuI2stmhZNoQcM417Iz7WqlPzbUmu9R4dEKmLGEEqOhOdVaeh9Xk2IPPjqIu5TbkLZRxkY3dJM1htbz57d/roesJLkZXqssfG5EJauNc+RcABTfLb4IiFjSMlTsnAgMBAAECgYEAiz/pi2hKOJKlvcTL4jpHJGjn8+lL3wZX+LeAHkXDoTjHa47g0knYYQteCbv+YwMeAGupBWiLy5RyyhXFoGNKbbnvftMYK56hH+iqxjtDLnjSDKWnhcB7089sNKaEM9Ilil6uxWMrMMBH9v2PLdYsqMBHqPutKu/SigeGPeiB7VECQQDizVlNv67go99QAIv2n/ga4e0wLizVuaNBXE88AdOnaZ0LOTeniVEqvPtgUk63zbjl0P/pzQzyjitwe6HoCAIpAkEAxbOtnCm1uKEp5HsNaXEJTwE7WQf7PrLD4+BpGtNKkgja6f6F4ld4QZ2TQ6qvsCizSGJrjOpNdjVGJ7bgYMcczwJBALvJWPLmDi7ToFfGTB0EsNHZVKE66kZ/8Stx+ezueke4S556XplqOflQBjbnj2PigwBN/0afT+QZUOBOjWzoDJkCQClzo+oDQMvGVs9GEajS/32mJ3hiWQZrWvEzgzYRqSf3XVcEe7PaXSd8z3y3lACeeACsShqQoc8wGlaHXIJOHTcCQQCZw5127ZGs8ZDTSrogrH73Kw/HvX55wGAeirKYcv28eauveCG7iyFR0PFB/P/EDZnyb+ifvyEFlucPUI0+Y87F", ComicDetailInfoProto = {
        nested: {
            proto: {
                fields: {
                    comicInfo: {
                        type: "ComicInfo",
                        id: 3
                    }
                }
            },
            ComicInfo: {
                fields: {
                    id: {
                        type: "int64",
                        id: 1
                    },
                    title: {
                        type: "string",
                        id: 2
                    },
                    direction: {
                        type: "int64",
                        id: 3
                    },
                    islong: {
                        type: "int64",
                        id: 4
                    },
                    cover: {
                        type: "string",
                        id: 6
                    },
                    description: {
                        type: "string",
                        id: 7
                    },
                    last_updatetime: {
                        type: "int64",
                        id: 8
                    },
                    last_update_chapter_name: {
                        type: "string",
                        id: 9
                    },
                    first_letter: {
                        type: "string",
                        id: 11
                    },
                    comic_py: {
                        type: "string",
                        id: 12
                    },
                    hidden: {
                        type: "int64",
                        id: 13
                    },
                    hot_num: {
                        type: "int64",
                        id: 14
                    },
                    hit_num: {
                        type: "int64",
                        id: 15
                    },
                    last_update_chapter_id: {
                        type: "int64",
                        id: 18
                    },
                    types: {
                        type: "Types",
                        id: 19,
                        rule: "repeated"
                    },
                    status: {
                        type: "Status",
                        id: 20
                    },
                    authors: {
                        type: "Authors",
                        id: 21,
                        rule: "repeated"
                    },
                    subscribe_num: {
                        type: "int64",
                        id: 22
                    },
                    chapters: {
                        type: "Chapters",
                        id: 23,
                        rule: "repeated"
                    },
                    is_need_login: {
                        type: "int64",
                        id: 24
                    },
                    dh_url_links: {
                        type: "DhUrlLink",
                        id: 27,
                        rule: "repeated"
                    }
                }
            },
            Types: {
                fields: {
                    tag_id: {
                        type: "int64",
                        id: 1
                    },
                    tag_name: {
                        type: "string",
                        id: 2
                    }
                }
            },
            Status: {
                fields: {
                    tag_id: {
                        type: "int64",
                        id: 1
                    },
                    tag_name: {
                        type: "string",
                        id: 2
                    }
                }
            },
            Authors: {
                fields: {
                    tag_id: {
                        type: "int64",
                        id: 1
                    },
                    tag_name: {
                        type: "string",
                        id: 2
                    }
                }
            },
            Data: {
                fields: {
                    chapter_id: {
                        type: "int64",
                        id: 1
                    },
                    chapter_title: {
                        type: "string",
                        id: 2
                    },
                    updatetime: {
                        type: "int64",
                        id: 3
                    },
                    filesize: {
                        type: "int64",
                        id: 4
                    },
                    chapter_order: {
                        type: "int64",
                        id: 5
                    }
                }
            },
            Chapters: {
                fields: {
                    title: {
                        type: "string",
                        id: 1
                    },
                    data: {
                        type: "Data",
                        id: 2,
                        rule: "repeated"
                    }
                }
            },
            DhUrlLink: {
                fields: {
                    title: {
                        type: "string",
                        id: 1
                    }
                }
            }
        }
    }, key = new JSEncryptRSAKey(V4_PRIVATE_KEY), message = protobufjs.Root.fromJSON(ComicDetailInfoProto).lookupType("proto"), base64ToArrayBuffer = e => {
        const r = window.atob(e), i = new Uint8Array(r.length);
        for (let e = 0; e < r.length; e++) i[e] = r.charCodeAt(e);
        return i;
    }, arrayBufferToBase64 = e => {
        let r = "";
        const i = new Uint8Array(e), n = i.byteLength;
        for (let e = 0; e < n; e++) r += String.fromCharCode(i[e]);
        return window.btoa(r);
    }, pkcs1unpad2 = (e, r) => {
        const i = e.toByteArray();
        let n = 0;
        for (;n < i.length && 0 === i[n]; ) ++n;
        if (i.length - n != r - 1 || 2 !== i[n]) return null;
        for (++n; 0 !== i[n]; ) if (++n >= i.length) return null;
        const o = [];
        for (;++n < i.length; ) o.push(i[n]);
        return o;
    }, customDecrypt = e => {
        const r = parseBigInt(e, 16), i = key.doPrivate(r);
        return null == i ? null : pkcs1unpad2(i, key.n.bitLength() + 7 >> 3);
    }, utilsDmzjDecrypt = e => {
        const r = base64ToArrayBuffer(e), {length: i} = r;
        let n = 0, o = 0, s = [];
        for (;i - n > 0; ) s = s.concat(customDecrypt(b64tohex(arrayBufferToBase64(r.slice(n, n + 128))))), 
        o++, n = 128 * o;
        return Uint8Array.from(s);
    }, dmzjDecrypt = e => {
        const r = utilsDmzjDecrypt(e);
        return message.decode(r);
    };
    return dmzjDecrypt;
}));
