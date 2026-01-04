class t {
    Long = null;
}

t.Long = function(t, e) {
    this.low_ = 0 | t,
        this.high_ = 0 | e
}
    ,
    t.Long.$metadata$ = {
    kind: "class",
    simpleName: "Long",
    interfaces: []
},
    t.Long.IntCache_ = {},
    t.Long.fromInt = function(e) {
    if (-128 <= e && e < 128) {
        var n = t.Long.IntCache_[e];
        if (n)
            return n
    }
    var o = new t.Long(0 | e,e < 0 ? -1 : 0);
    return -128 <= e && e < 128 && (t.Long.IntCache_[e] = o),
        o
}
    ,
    t.Long.fromNumber = function(e) {
    return isNaN(e) ? t.Long.ZERO : e <= -t.Long.TWO_PWR_63_DBL_ ? t.Long.MIN_VALUE : e + 1 >= t.Long.TWO_PWR_63_DBL_ ? t.Long.MAX_VALUE : e < 0 ? t.Long.fromNumber(-e).negate() : new t.Long(e % t.Long.TWO_PWR_32_DBL_ | 0,e / t.Long.TWO_PWR_32_DBL_ | 0)
}
    ,
    t.Long.fromBits = function(e, n) {
    return new t.Long(e,n)
}
    ,
    t.Long.fromString = function(e, n) {
    if (0 == e.length)
        throw Error("number format error: empty string");
    var o = n || 10;
    if (o < 2 || 36 < o)
        throw Error("radix out of range: " + o);
    if ("-" == e.charAt(0))
        return t.Long.fromString(e.substring(1), o).negate();
    if (e.indexOf("-") >= 0)
        throw Error('number format error: interior "-" character: ' + e);
    for (var i = t.Long.fromNumber(Math.pow(o, 8)), r = t.Long.ZERO, s = 0; s < e.length; s += 8) {
        var a = Math.min(8, e.length - s)
        , c = parseInt(e.substring(s, s + a), o);
        if (a < 8) {
            var u = t.Long.fromNumber(Math.pow(o, a));
            r = r.multiply(u).add(t.Long.fromNumber(c))
        } else
            r = (r = r.multiply(i)).add(t.Long.fromNumber(c))
    }
    return r
}
    ,
    t.Long.TWO_PWR_16_DBL_ = 65536,
    t.Long.TWO_PWR_24_DBL_ = 1 << 24,
    t.Long.TWO_PWR_32_DBL_ = t.Long.TWO_PWR_16_DBL_ * t.Long.TWO_PWR_16_DBL_,
    t.Long.TWO_PWR_31_DBL_ = t.Long.TWO_PWR_32_DBL_ / 2,
    t.Long.TWO_PWR_48_DBL_ = t.Long.TWO_PWR_32_DBL_ * t.Long.TWO_PWR_16_DBL_,
    t.Long.TWO_PWR_64_DBL_ = t.Long.TWO_PWR_32_DBL_ * t.Long.TWO_PWR_32_DBL_,
    t.Long.TWO_PWR_63_DBL_ = t.Long.TWO_PWR_64_DBL_ / 2,
    t.Long.ZERO = t.Long.fromInt(0),
    t.Long.ONE = t.Long.fromInt(1),
    t.Long.NEG_ONE = t.Long.fromInt(-1),
    t.Long.MAX_VALUE = t.Long.fromBits(-1, 2147483647),
    t.Long.MIN_VALUE = t.Long.fromBits(0, -2147483648),
    t.Long.TWO_PWR_24_ = t.Long.fromInt(1 << 24),
    t.Long.prototype.toInt = function() {
    return this.low_
}
    ,
    t.Long.prototype.toNumber = function() {
    return this.high_ * t.Long.TWO_PWR_32_DBL_ + this.getLowBitsUnsigned()
}
    ,
    t.Long.prototype.hashCode = function() {
    return this.high_ ^ this.low_
}
    ,
    t.Long.prototype.toString = function(e) {
    var n = e || 10;
    if (n < 2 || 36 < n)
        throw Error("radix out of range: " + n);
    if (this.isZero())
        return "0";
    if (this.isNegative()) {
        if (this.equalsLong(t.Long.MIN_VALUE)) {
            var o = t.Long.fromNumber(n)
            , i = this.div(o)
            , r = i.multiply(o).subtract(this);
            return i.toString(n) + r.toInt().toString(n)
        }
        return "-" + this.negate().toString(n)
    }
    for (var s = t.Long.fromNumber(Math.pow(n, 6)), a = (r = this,
                                                         ""); ; ) {
        var c = r.div(s)
        , u = r.subtract(c.multiply(s)).toInt().toString(n);
        if ((r = c).isZero())
            return u + a;
        for (; u.length < 6; )
            u = "0" + u;
        a = "" + u + a
    }
}
    ,
    t.Long.prototype.getHighBits = function() {
    return this.high_
}
    ,
    t.Long.prototype.getLowBits = function() {
    return this.low_
}
    ,
    t.Long.prototype.getLowBitsUnsigned = function() {
    return this.low_ >= 0 ? this.low_ : t.Long.TWO_PWR_32_DBL_ + this.low_
}
    ,
    t.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative())
        return this.equalsLong(t.Long.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
    for (var e = 0 != this.high_ ? this.high_ : this.low_, n = 31; n > 0 && 0 == (e & 1 << n); n--)
        ;
    return 0 != this.high_ ? n + 33 : n + 1
}
    ,
    t.Long.prototype.isZero = function() {
    return 0 == this.high_ && 0 == this.low_
}
    ,
    t.Long.prototype.isNegative = function() {
    return this.high_ < 0
}
    ,
    t.Long.prototype.isOdd = function() {
    return 1 == (1 & this.low_)
}
    ,
    t.Long.prototype.equalsLong = function(t) {
    return this.high_ == t.high_ && this.low_ == t.low_
}
    ,
    t.Long.prototype.notEqualsLong = function(t) {
    return this.high_ != t.high_ || this.low_ != t.low_
}
    ,
    t.Long.prototype.lessThan = function(t) {
    return this.compare(t) < 0
}
    ,
    t.Long.prototype.lessThanOrEqual = function(t) {
    return this.compare(t) <= 0
}
    ,
    t.Long.prototype.greaterThan = function(t) {
    return this.compare(t) > 0
}
    ,
    t.Long.prototype.greaterThanOrEqual = function(t) {
    return this.compare(t) >= 0
}
    ,
    t.Long.prototype.compare = function(t) {
    if (this.equalsLong(t))
        return 0;
    var e = this.isNegative()
    , n = t.isNegative();
    return e && !n ? -1 : !e && n ? 1 : this.subtract(t).isNegative() ? -1 : 1
}
    ,
    t.Long.prototype.negate = function() {
    return this.equalsLong(t.Long.MIN_VALUE) ? t.Long.MIN_VALUE : this.not().add(t.Long.ONE)
}
    ,
    t.Long.prototype.add = function(e) {
    var n = this.high_ >>> 16
    , o = 65535 & this.high_
    , i = this.low_ >>> 16
    , r = 65535 & this.low_
    , s = e.high_ >>> 16
    , a = 65535 & e.high_
    , c = e.low_ >>> 16
    , u = 0
    , l = 0
    , _ = 0
    , p = 0;
    return _ += (p += r + (65535 & e.low_)) >>> 16,
        p &= 65535,
        l += (_ += i + c) >>> 16,
        _ &= 65535,
        u += (l += o + a) >>> 16,
        l &= 65535,
        u += n + s,
        u &= 65535,
        t.Long.fromBits(_ << 16 | p, u << 16 | l)
}
    ,
    t.Long.prototype.subtract = function(t) {
    return this.add(t.negate())
}
    ,
    t.Long.prototype.multiply = function(e) {
    if (this.isZero())
        return t.Long.ZERO;
    if (e.isZero())
        return t.Long.ZERO;
    if (this.equalsLong(t.Long.MIN_VALUE))
        return e.isOdd() ? t.Long.MIN_VALUE : t.Long.ZERO;
    if (e.equalsLong(t.Long.MIN_VALUE))
        return this.isOdd() ? t.Long.MIN_VALUE : t.Long.ZERO;
    if (this.isNegative())
        return e.isNegative() ? this.negate().multiply(e.negate()) : this.negate().multiply(e).negate();
    if (e.isNegative())
        return this.multiply(e.negate()).negate();
    if (this.lessThan(t.Long.TWO_PWR_24_) && e.lessThan(t.Long.TWO_PWR_24_))
        return t.Long.fromNumber(this.toNumber() * e.toNumber());
    var n = this.high_ >>> 16
    , o = 65535 & this.high_
    , i = this.low_ >>> 16
    , r = 65535 & this.low_
    , s = e.high_ >>> 16
    , a = 65535 & e.high_
    , c = e.low_ >>> 16
    , u = 65535 & e.low_
    , l = 0
    , _ = 0
    , p = 0
    , h = 0;
    return p += (h += r * u) >>> 16,
        h &= 65535,
        _ += (p += i * u) >>> 16,
        p &= 65535,
        _ += (p += r * c) >>> 16,
        p &= 65535,
        l += (_ += o * u) >>> 16,
        _ &= 65535,
        l += (_ += i * c) >>> 16,
        _ &= 65535,
        l += (_ += r * a) >>> 16,
        _ &= 65535,
        l += n * u + o * c + i * a + r * s,
        l &= 65535,
        t.Long.fromBits(p << 16 | h, l << 16 | _)
}
    ,
    t.Long.prototype.div = function(e) {
    if (e.isZero())
        throw Error("division by zero");
    if (this.isZero())
        return t.Long.ZERO;
    if (this.equalsLong(t.Long.MIN_VALUE)) {
        if (e.equalsLong(t.Long.ONE) || e.equalsLong(t.Long.NEG_ONE))
            return t.Long.MIN_VALUE;
        if (e.equalsLong(t.Long.MIN_VALUE))
            return t.Long.ONE;
        if ((i = this.shiftRight(1).div(e).shiftLeft(1)).equalsLong(t.Long.ZERO))
            return e.isNegative() ? t.Long.ONE : t.Long.NEG_ONE;
        var n = this.subtract(e.multiply(i));
        return i.add(n.div(e))
    }
    if (e.equalsLong(t.Long.MIN_VALUE))
        return t.Long.ZERO;
    if (this.isNegative())
        return e.isNegative() ? this.negate().div(e.negate()) : this.negate().div(e).negate();
    if (e.isNegative())
        return this.div(e.negate()).negate();
    var o = t.Long.ZERO;
    for (n = this; n.greaterThanOrEqual(e); ) {
        for (var i = Math.max(1, Math.floor(n.toNumber() / e.toNumber())), r = Math.ceil(Math.log(i) / Math.LN2), s = r <= 48 ? 1 : Math.pow(2, r - 48), a = t.Long.fromNumber(i), c = a.multiply(e); c.isNegative() || c.greaterThan(n); )
            i -= s,
                c = (a = t.Long.fromNumber(i)).multiply(e);
        a.isZero() && (a = t.Long.ONE),
            o = o.add(a),
            n = n.subtract(c)
    }
    return o
}
    ,
    t.Long.prototype.modulo = function(t) {
    return this.subtract(this.div(t).multiply(t))
}
    ,
    t.Long.prototype.not = function() {
    return t.Long.fromBits(~this.low_, ~this.high_)
}
    ,
    t.Long.prototype.and = function(e) {
    return t.Long.fromBits(this.low_ & e.low_, this.high_ & e.high_)
}
    ,
    t.Long.prototype.or = function(e) {
    return t.Long.fromBits(this.low_ | e.low_, this.high_ | e.high_)
}
    ,
    t.Long.prototype.xor = function(e) {
    return t.Long.fromBits(this.low_ ^ e.low_, this.high_ ^ e.high_)
}
    ,
    t.Long.prototype.shiftLeft = function(e) {
    if (0 == (e &= 63))
        return this;
    var n = this.low_;
    if (e < 32) {
        var o = this.high_;
        return t.Long.fromBits(n << e, o << e | n >>> 32 - e)
    }
    return t.Long.fromBits(0, n << e - 32)
}
    ,
    t.Long.prototype.shiftRight = function(e) {
    if (0 == (e &= 63))
        return this;
    var n = this.high_;
    if (e < 32) {
        var o = this.low_;
        return t.Long.fromBits(o >>> e | n << 32 - e, n >> e)
    }
    return t.Long.fromBits(n >> e - 32, n >= 0 ? 0 : -1)
}
    ,
    t.Long.prototype.shiftRightUnsigned = function(e) {
    if (0 == (e &= 63))
        return this;
    var n = this.high_;
    if (e < 32) {
        var o = this.low_;
        return t.Long.fromBits(o >>> e | n << 32 - e, n >>> e)
    }
    return 32 == e ? t.Long.fromBits(n, 0) : t.Long.fromBits(n >>> e - 32, 0)
}
    ,
    t.Long.prototype.equals = function(e) {
    return e instanceof t.Long && this.equalsLong(e)
}
    ,
    t.Long.prototype.compareTo_11rb$ = t.Long.prototype.compare,
    t.Long.prototype.inc = function() {
    return this.add(t.Long.ONE)
}
    ,
    t.Long.prototype.dec = function() {
    return this.add(t.Long.NEG_ONE)
}
    ,
    t.Long.prototype.valueOf = function() {
    return this.toNumber()
}
    ,
    t.Long.prototype.unaryPlus = function() {
    return this
}
    ,
    t.Long.prototype.unaryMinus = t.Long.prototype.negate,
    t.Long.prototype.inv = t.Long.prototype.not,
    t.Long.prototype.rangeTo = function(e) {
    return new t.kotlin.ranges.LongRange(this,e)
}