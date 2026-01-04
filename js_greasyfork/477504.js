// ==UserScript==
// @name         MooMacro
// @namespace    mohmoh plaier
// @version      v1.5
// @description  fixed packets with bundle
// @author       totally not twilightmoon
// @match        *://*.moomoo.io/*
// @icon         https://c8.alamy.com/comp/P9DECX/gold-alphabet-letter-gg-g-g-logo-combination-design-suitable-for-a-company-or-business-P9DECX.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477504/MooMacro.user.js
// @updateURL https://update.greasyfork.org/scripts/477504/MooMacro.meta.js
// ==/UserScript==

// Macros:
// g = soldier
// left click = bull
// right click = tank
// l = turret gear
// u = plague mask
// o = booster hat
// p = winter hat
// k = flipper hat

(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload"))
        return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]'))
        n(s);
    new MutationObserver(s => {
        for (const r of s)
            if (r.type === "childList")
                for (const o of r.addedNodes)
                    o.tagName === "LINK" && o.rel === "modulepreload" && n(o)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function i(s) {
        const r = {};
        return s.integrity && (r.integrity = s.integrity),
        s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
        s.crossOrigin === "use-credentials" ? r.credentials = "include" : s.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin",
        r
    }
    function n(s) {
        if (s.ep)
            return;
        s.ep = !0;
        const r = i(s);
        fetch(s.href, r)
    }
}
)();
var Pt = 4294967295;
function hl(e, t, i) {
    var n = i / 4294967296
      , s = i;
    e.setUint32(t, n),
    e.setUint32(t + 4, s)
}
function Lo(e, t, i) {
    var n = Math.floor(i / 4294967296)
      , s = i;
    e.setUint32(t, n),
    e.setUint32(t + 4, s)
}
function Fo(e, t) {
    var i = e.getInt32(t)
      , n = e.getUint32(t + 4);
    return i * 4294967296 + n
}
function ul(e, t) {
    var i = e.getUint32(t)
      , n = e.getUint32(t + 4);
    return i * 4294967296 + n
}
var Vn, Nn, Un, Rn = (typeof process > "u" || ((Vn = process == null ? void 0 : process.env) === null || Vn === void 0 ? void 0 : Vn.TEXT_ENCODING) !== "never") && typeof TextEncoder < "u" && typeof TextDecoder < "u";
function kr(e) {
    for (var t = e.length, i = 0, n = 0; n < t; ) {
        var s = e.charCodeAt(n++);
        if (s & 4294967168)
            if (!(s & 4294965248))
                i += 2;
            else {
                if (s >= 55296 && s <= 56319 && n < t) {
                    var r = e.charCodeAt(n);
                    (r & 64512) === 56320 && (++n,
                    s = ((s & 1023) << 10) + (r & 1023) + 65536)
                }
                s & 4294901760 ? i += 4 : i += 3
            }
        else {
            i++;
            continue
        }
    }
    return i
}
function fl(e, t, i) {
    for (var n = e.length, s = i, r = 0; r < n; ) {
        var o = e.charCodeAt(r++);
        if (o & 4294967168)
            if (!(o & 4294965248))
                t[s++] = o >> 6 & 31 | 192;
            else {
                if (o >= 55296 && o <= 56319 && r < n) {
                    var l = e.charCodeAt(r);
                    (l & 64512) === 56320 && (++r,
                    o = ((o & 1023) << 10) + (l & 1023) + 65536)
                }
                o & 4294901760 ? (t[s++] = o >> 18 & 7 | 240,
                t[s++] = o >> 12 & 63 | 128,
                t[s++] = o >> 6 & 63 | 128) : (t[s++] = o >> 12 & 15 | 224,
                t[s++] = o >> 6 & 63 | 128)
            }
        else {
            t[s++] = o;
            continue
        }
        t[s++] = o & 63 | 128
    }
}
var Ri = Rn ? new TextEncoder : void 0
  , dl = Rn ? typeof process < "u" && ((Nn = process == null ? void 0 : process.env) === null || Nn === void 0 ? void 0 : Nn.TEXT_ENCODING) !== "force" ? 200 : 0 : Pt;
function pl(e, t, i) {
    t.set(Ri.encode(e), i)
}
function ml(e, t, i) {
    Ri.encodeInto(e, t.subarray(i))
}
var gl = Ri != null && Ri.encodeInto ? ml : pl
  , yl = 4096;
function Vo(e, t, i) {
    for (var n = t, s = n + i, r = [], o = ""; n < s; ) {
        var l = e[n++];
        if (!(l & 128))
            r.push(l);
        else if ((l & 224) === 192) {
            var c = e[n++] & 63;
            r.push((l & 31) << 6 | c)
        } else if ((l & 240) === 224) {
            var c = e[n++] & 63
              , a = e[n++] & 63;
            r.push((l & 31) << 12 | c << 6 | a)
        } else if ((l & 248) === 240) {
            var c = e[n++] & 63
              , a = e[n++] & 63
              , u = e[n++] & 63
              , p = (l & 7) << 18 | c << 12 | a << 6 | u;
            p > 65535 && (p -= 65536,
            r.push(p >>> 10 & 1023 | 55296),
            p = 56320 | p & 1023),
            r.push(p)
        } else
            r.push(l);
        r.length >= yl && (o += String.fromCharCode.apply(String, r),
        r.length = 0)
    }
    return r.length > 0 && (o += String.fromCharCode.apply(String, r)),
    o
}
var wl = Rn ? new TextDecoder : null
  , vl = Rn ? typeof process < "u" && ((Un = process == null ? void 0 : process.env) === null || Un === void 0 ? void 0 : Un.TEXT_DECODER) !== "force" ? 200 : 0 : Pt;
function kl(e, t, i) {
    var n = e.subarray(t, t + i);
    return wl.decode(n)
}
var en = function() {
    function e(t, i) {
        this.type = t,
        this.data = i
    }
    return e
}()
  , xl = globalThis && globalThis.__extends || function() {
    var e = function(t, i) {
        return e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(n, s) {
            n.__proto__ = s
        }
        || function(n, s) {
            for (var r in s)
                Object.prototype.hasOwnProperty.call(s, r) && (n[r] = s[r])
        }
        ,
        e(t, i)
    };
    return function(t, i) {
        if (typeof i != "function" && i !== null)
            throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
        e(t, i);
        function n() {
            this.constructor = t
        }
        t.prototype = i === null ? Object.create(i) : (n.prototype = i.prototype,
        new n)
    }
}()
  , je = function(e) {
    xl(t, e);
    function t(i) {
        var n = e.call(this, i) || this
          , s = Object.create(t.prototype);
        return Object.setPrototypeOf(n, s),
        Object.defineProperty(n, "name", {
            configurable: !0,
            enumerable: !1,
            value: t.name
        }),
        n
    }
    return t
}(Error)
  , bl = -1
  , Sl = 4294967296 - 1
  , Il = 17179869184 - 1;
function Tl(e) {
    var t = e.sec
      , i = e.nsec;
    if (t >= 0 && i >= 0 && t <= Il)
        if (i === 0 && t <= Sl) {
            var n = new Uint8Array(4)
              , s = new DataView(n.buffer);
            return s.setUint32(0, t),
            n
        } else {
            var r = t / 4294967296
              , o = t & 4294967295
              , n = new Uint8Array(8)
              , s = new DataView(n.buffer);
            return s.setUint32(0, i << 2 | r & 3),
            s.setUint32(4, o),
            n
        }
    else {
        var n = new Uint8Array(12)
          , s = new DataView(n.buffer);
        return s.setUint32(0, i),
        Lo(s, 4, t),
        n
    }
}
function Ml(e) {
    var t = e.getTime()
      , i = Math.floor(t / 1e3)
      , n = (t - i * 1e3) * 1e6
      , s = Math.floor(n / 1e9);
    return {
        sec: i + s,
        nsec: n - s * 1e9
    }
}
function El(e) {
    if (e instanceof Date) {
        var t = Ml(e);
        return Tl(t)
    } else
        return null
}
function Cl(e) {
    var t = new DataView(e.buffer,e.byteOffset,e.byteLength);
    switch (e.byteLength) {
    case 4:
        {
            var i = t.getUint32(0)
              , n = 0;
            return {
                sec: i,
                nsec: n
            }
        }
    case 8:
        {
            var s = t.getUint32(0)
              , r = t.getUint32(4)
              , i = (s & 3) * 4294967296 + r
              , n = s >>> 2;
            return {
                sec: i,
                nsec: n
            }
        }
    case 12:
        {
            var i = Fo(t, 4)
              , n = t.getUint32(0);
            return {
                sec: i,
                nsec: n
            }
        }
    default:
        throw new je("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(e.length))
    }
}
function Pl(e) {
    var t = Cl(e);
    return new Date(t.sec * 1e3 + t.nsec / 1e6)
}
var $l = {
    type: bl,
    encode: El,
    decode: Pl
}
  , No = function() {
    function e() {
        this.builtInEncoders = [],
        this.builtInDecoders = [],
        this.encoders = [],
        this.decoders = [],
        this.register($l)
    }
    return e.prototype.register = function(t) {
        var i = t.type
          , n = t.encode
          , s = t.decode;
        if (i >= 0)
            this.encoders[i] = n,
            this.decoders[i] = s;
        else {
            var r = 1 + i;
            this.builtInEncoders[r] = n,
            this.builtInDecoders[r] = s
        }
    }
    ,
    e.prototype.tryToEncode = function(t, i) {
        for (var n = 0; n < this.builtInEncoders.length; n++) {
            var s = this.builtInEncoders[n];
            if (s != null) {
                var r = s(t, i);
                if (r != null) {
                    var o = -1 - n;
                    return new en(o,r)
                }
            }
        }
        for (var n = 0; n < this.encoders.length; n++) {
            var s = this.encoders[n];
            if (s != null) {
                var r = s(t, i);
                if (r != null) {
                    var o = n;
                    return new en(o,r)
                }
            }
        }
        return t instanceof en ? t : null
    }
    ,
    e.prototype.decode = function(t, i, n) {
        var s = i < 0 ? this.builtInDecoders[-1 - i] : this.decoders[i];
        return s ? s(t, i, n) : new en(i,t)
    }
    ,
    e.defaultCodec = new e,
    e
}();
function yn(e) {
    return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : e instanceof ArrayBuffer ? new Uint8Array(e) : Uint8Array.from(e)
}
function Rl(e) {
    if (e instanceof ArrayBuffer)
        return new DataView(e);
    var t = yn(e);
    return new DataView(t.buffer,t.byteOffset,t.byteLength)
}
var Al = 100
  , Dl = 2048
  , Ol = function() {
    function e(t, i, n, s, r, o, l, c) {
        t === void 0 && (t = No.defaultCodec),
        i === void 0 && (i = void 0),
        n === void 0 && (n = Al),
        s === void 0 && (s = Dl),
        r === void 0 && (r = !1),
        o === void 0 && (o = !1),
        l === void 0 && (l = !1),
        c === void 0 && (c = !1),
        this.extensionCodec = t,
        this.context = i,
        this.maxDepth = n,
        this.initialBufferSize = s,
        this.sortKeys = r,
        this.forceFloat32 = o,
        this.ignoreUndefined = l,
        this.forceIntegerToFloat = c,
        this.pos = 0,
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize)),
        this.bytes = new Uint8Array(this.view.buffer)
    }
    return e.prototype.reinitializeState = function() {
        this.pos = 0
    }
    ,
    e.prototype.encodeSharedRef = function(t) {
        return this.reinitializeState(),
        this.doEncode(t, 1),
        this.bytes.subarray(0, this.pos)
    }
    ,
    e.prototype.encode = function(t) {
        return this.reinitializeState(),
        this.doEncode(t, 1),
        this.bytes.slice(0, this.pos)
    }
    ,
    e.prototype.doEncode = function(t, i) {
        if (i > this.maxDepth)
            throw new Error("Too deep objects in depth ".concat(i));
        t == null ? this.encodeNil() : typeof t == "boolean" ? this.encodeBoolean(t) : typeof t == "number" ? this.encodeNumber(t) : typeof t == "string" ? this.encodeString(t) : this.encodeObject(t, i)
    }
    ,
    e.prototype.ensureBufferSizeToWrite = function(t) {
        var i = this.pos + t;
        this.view.byteLength < i && this.resizeBuffer(i * 2)
    }
    ,
    e.prototype.resizeBuffer = function(t) {
        var i = new ArrayBuffer(t)
          , n = new Uint8Array(i)
          , s = new DataView(i);
        n.set(this.bytes),
        this.view = s,
        this.bytes = n
    }
    ,
    e.prototype.encodeNil = function() {
        this.writeU8(192)
    }
    ,
    e.prototype.encodeBoolean = function(t) {
        t === !1 ? this.writeU8(194) : this.writeU8(195)
    }
    ,
    e.prototype.encodeNumber = function(t) {
        Number.isSafeInteger(t) && !this.forceIntegerToFloat ? t >= 0 ? t < 128 ? this.writeU8(t) : t < 256 ? (this.writeU8(204),
        this.writeU8(t)) : t < 65536 ? (this.writeU8(205),
        this.writeU16(t)) : t < 4294967296 ? (this.writeU8(206),
        this.writeU32(t)) : (this.writeU8(207),
        this.writeU64(t)) : t >= -32 ? this.writeU8(224 | t + 32) : t >= -128 ? (this.writeU8(208),
        this.writeI8(t)) : t >= -32768 ? (this.writeU8(209),
        this.writeI16(t)) : t >= -2147483648 ? (this.writeU8(210),
        this.writeI32(t)) : (this.writeU8(211),
        this.writeI64(t)) : this.forceFloat32 ? (this.writeU8(202),
        this.writeF32(t)) : (this.writeU8(203),
        this.writeF64(t))
    }
    ,
    e.prototype.writeStringHeader = function(t) {
        if (t < 32)
            this.writeU8(160 + t);
        else if (t < 256)
            this.writeU8(217),
            this.writeU8(t);
        else if (t < 65536)
            this.writeU8(218),
            this.writeU16(t);
        else if (t < 4294967296)
            this.writeU8(219),
            this.writeU32(t);
        else
            throw new Error("Too long string: ".concat(t, " bytes in UTF-8"))
    }
    ,
    e.prototype.encodeString = function(t) {
        var i = 5
          , n = t.length;
        if (n > dl) {
            var s = kr(t);
            this.ensureBufferSizeToWrite(i + s),
            this.writeStringHeader(s),
            gl(t, this.bytes, this.pos),
            this.pos += s
        } else {
            var s = kr(t);
            this.ensureBufferSizeToWrite(i + s),
            this.writeStringHeader(s),
            fl(t, this.bytes, this.pos),
            this.pos += s
        }
    }
    ,
    e.prototype.encodeObject = function(t, i) {
        var n = this.extensionCodec.tryToEncode(t, this.context);
        if (n != null)
            this.encodeExtension(n);
        else if (Array.isArray(t))
            this.encodeArray(t, i);
        else if (ArrayBuffer.isView(t))
            this.encodeBinary(t);
        else if (typeof t == "object")
            this.encodeMap(t, i);
        else
            throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(t)))
    }
    ,
    e.prototype.encodeBinary = function(t) {
        var i = t.byteLength;
        if (i < 256)
            this.writeU8(196),
            this.writeU8(i);
        else if (i < 65536)
            this.writeU8(197),
            this.writeU16(i);
        else if (i < 4294967296)
            this.writeU8(198),
            this.writeU32(i);
        else
            throw new Error("Too large binary: ".concat(i));
        var n = yn(t);
        this.writeU8a(n)
    }
    ,
    e.prototype.encodeArray = function(t, i) {
        var n = t.length;
        if (n < 16)
            this.writeU8(144 + n);
        else if (n < 65536)
            this.writeU8(220),
            this.writeU16(n);
        else if (n < 4294967296)
            this.writeU8(221),
            this.writeU32(n);
        else
            throw new Error("Too large array: ".concat(n));
        for (var s = 0, r = t; s < r.length; s++) {
            var o = r[s];
            this.doEncode(o, i + 1)
        }
    }
    ,
    e.prototype.countWithoutUndefined = function(t, i) {
        for (var n = 0, s = 0, r = i; s < r.length; s++) {
            var o = r[s];
            t[o] !== void 0 && n++
        }
        return n
    }
    ,
    e.prototype.encodeMap = function(t, i) {
        var n = Object.keys(t);
        this.sortKeys && n.sort();
        var s = this.ignoreUndefined ? this.countWithoutUndefined(t, n) : n.length;
        if (s < 16)
            this.writeU8(128 + s);
        else if (s < 65536)
            this.writeU8(222),
            this.writeU16(s);
        else if (s < 4294967296)
            this.writeU8(223),
            this.writeU32(s);
        else
            throw new Error("Too large map object: ".concat(s));
        for (var r = 0, o = n; r < o.length; r++) {
            var l = o[r]
              , c = t[l];
            this.ignoreUndefined && c === void 0 || (this.encodeString(l),
            this.doEncode(c, i + 1))
        }
    }
    ,
    e.prototype.encodeExtension = function(t) {
        var i = t.data.length;
        if (i === 1)
            this.writeU8(212);
        else if (i === 2)
            this.writeU8(213);
        else if (i === 4)
            this.writeU8(214);
        else if (i === 8)
            this.writeU8(215);
        else if (i === 16)
            this.writeU8(216);
        else if (i < 256)
            this.writeU8(199),
            this.writeU8(i);
        else if (i < 65536)
            this.writeU8(200),
            this.writeU16(i);
        else if (i < 4294967296)
            this.writeU8(201),
            this.writeU32(i);
        else
            throw new Error("Too large extension object: ".concat(i));
        this.writeI8(t.type),
        this.writeU8a(t.data)
    }
    ,
    e.prototype.writeU8 = function(t) {
        this.ensureBufferSizeToWrite(1),
        this.view.setUint8(this.pos, t),
        this.pos++
    }
    ,
    e.prototype.writeU8a = function(t) {
        var i = t.length;
        this.ensureBufferSizeToWrite(i),
        this.bytes.set(t, this.pos),
        this.pos += i
    }
    ,
    e.prototype.writeI8 = function(t) {
        this.ensureBufferSizeToWrite(1),
        this.view.setInt8(this.pos, t),
        this.pos++
    }
    ,
    e.prototype.writeU16 = function(t) {
        this.ensureBufferSizeToWrite(2),
        this.view.setUint16(this.pos, t),
        this.pos += 2
    }
    ,
    e.prototype.writeI16 = function(t) {
        this.ensureBufferSizeToWrite(2),
        this.view.setInt16(this.pos, t),
        this.pos += 2
    }
    ,
    e.prototype.writeU32 = function(t) {
        this.ensureBufferSizeToWrite(4),
        this.view.setUint32(this.pos, t),
        this.pos += 4
    }
    ,
    e.prototype.writeI32 = function(t) {
        this.ensureBufferSizeToWrite(4),
        this.view.setInt32(this.pos, t),
        this.pos += 4
    }
    ,
    e.prototype.writeF32 = function(t) {
        this.ensureBufferSizeToWrite(4),
        this.view.setFloat32(this.pos, t),
        this.pos += 4
    }
    ,
    e.prototype.writeF64 = function(t) {
        this.ensureBufferSizeToWrite(8),
        this.view.setFloat64(this.pos, t),
        this.pos += 8
    }
    ,
    e.prototype.writeU64 = function(t) {
        this.ensureBufferSizeToWrite(8),
        hl(this.view, this.pos, t),
        this.pos += 8
    }
    ,
    e.prototype.writeI64 = function(t) {
        this.ensureBufferSizeToWrite(8),
        Lo(this.view, this.pos, t),
        this.pos += 8
    }
    ,
    e
}();
function Wn(e) {
    return "".concat(e < 0 ? "-" : "", "0x").concat(Math.abs(e).toString(16).padStart(2, "0"))
}
var _l = 16
  , zl = 16
  , Bl = function() {
    function e(t, i) {
        t === void 0 && (t = _l),
        i === void 0 && (i = zl),
        this.maxKeyLength = t,
        this.maxLengthPerKey = i,
        this.hit = 0,
        this.miss = 0,
        this.caches = [];
        for (var n = 0; n < this.maxKeyLength; n++)
            this.caches.push([])
    }
    return e.prototype.canBeCached = function(t) {
        return t > 0 && t <= this.maxKeyLength
    }
    ,
    e.prototype.find = function(t, i, n) {
        var s = this.caches[n - 1];
        e: for (var r = 0, o = s; r < o.length; r++) {
            for (var l = o[r], c = l.bytes, a = 0; a < n; a++)
                if (c[a] !== t[i + a])
                    continue e;
            return l.str
        }
        return null
    }
    ,
    e.prototype.store = function(t, i) {
        var n = this.caches[t.length - 1]
          , s = {
            bytes: t,
            str: i
        };
        n.length >= this.maxLengthPerKey ? n[Math.random() * n.length | 0] = s : n.push(s)
    }
    ,
    e.prototype.decode = function(t, i, n) {
        var s = this.find(t, i, n);
        if (s != null)
            return this.hit++,
            s;
        this.miss++;
        var r = Vo(t, i, n)
          , o = Uint8Array.prototype.slice.call(t, i, i + n);
        return this.store(o, r),
        r
    }
    ,
    e
}()
  , Hl = globalThis && globalThis.__awaiter || function(e, t, i, n) {
    function s(r) {
        return r instanceof i ? r : new i(function(o) {
            o(r)
        }
        )
    }
    return new (i || (i = Promise))(function(r, o) {
        function l(u) {
            try {
                a(n.next(u))
            } catch (p) {
                o(p)
            }
        }
        function c(u) {
            try {
                a(n.throw(u))
            } catch (p) {
                o(p)
            }
        }
        function a(u) {
            u.done ? r(u.value) : s(u.value).then(l, c)
        }
        a((n = n.apply(e, t || [])).next())
    }
    )
}
  , Xn = globalThis && globalThis.__generator || function(e, t) {
    var i = {
        label: 0,
        sent: function() {
            if (r[0] & 1)
                throw r[1];
            return r[1]
        },
        trys: [],
        ops: []
    }, n, s, r, o;
    return o = {
        next: l(0),
        throw: l(1),
        return: l(2)
    },
    typeof Symbol == "function" && (o[Symbol.iterator] = function() {
        return this
    }
    ),
    o;
    function l(a) {
        return function(u) {
            return c([a, u])
        }
    }
    function c(a) {
        if (n)
            throw new TypeError("Generator is already executing.");
        for (; i; )
            try {
                if (n = 1,
                s && (r = a[0] & 2 ? s.return : a[0] ? s.throw || ((r = s.return) && r.call(s),
                0) : s.next) && !(r = r.call(s, a[1])).done)
                    return r;
                switch (s = 0,
                r && (a = [a[0] & 2, r.value]),
                a[0]) {
                case 0:
                case 1:
                    r = a;
                    break;
                case 4:
                    return i.label++,
                    {
                        value: a[1],
                        done: !1
                    };
                case 5:
                    i.label++,
                    s = a[1],
                    a = [0];
                    continue;
                case 7:
                    a = i.ops.pop(),
                    i.trys.pop();
                    continue;
                default:
                    if (r = i.trys,
                    !(r = r.length > 0 && r[r.length - 1]) && (a[0] === 6 || a[0] === 2)) {
                        i = 0;
                        continue
                    }
                    if (a[0] === 3 && (!r || a[1] > r[0] && a[1] < r[3])) {
                        i.label = a[1];
                        break
                    }
                    if (a[0] === 6 && i.label < r[1]) {
                        i.label = r[1],
                        r = a;
                        break
                    }
                    if (r && i.label < r[2]) {
                        i.label = r[2],
                        i.ops.push(a);
                        break
                    }
                    r[2] && i.ops.pop(),
                    i.trys.pop();
                    continue
                }
                a = t.call(e, i)
            } catch (u) {
                a = [6, u],
                s = 0
            } finally {
                n = r = 0
            }
        if (a[0] & 5)
            throw a[1];
        return {
            value: a[0] ? a[1] : void 0,
            done: !0
        }
    }
}
  , xr = globalThis && globalThis.__asyncValues || function(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], i;
    return t ? t.call(e) : (e = typeof __values == "function" ? __values(e) : e[Symbol.iterator](),
    i = {},
    n("next"),
    n("throw"),
    n("return"),
    i[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    i);
    function n(r) {
        i[r] = e[r] && function(o) {
            return new Promise(function(l, c) {
                o = e[r](o),
                s(l, c, o.done, o.value)
            }
            )
        }
    }
    function s(r, o, l, c) {
        Promise.resolve(c).then(function(a) {
            r({
                value: a,
                done: l
            })
        }, o)
    }
}
  , li = globalThis && globalThis.__await || function(e) {
    return this instanceof li ? (this.v = e,
    this) : new li(e)
}
  , Ll = globalThis && globalThis.__asyncGenerator || function(e, t, i) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var n = i.apply(e, t || []), s, r = [];
    return s = {},
    o("next"),
    o("throw"),
    o("return"),
    s[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    s;
    function o(h) {
        n[h] && (s[h] = function(m) {
            return new Promise(function(w, x) {
                r.push([h, m, w, x]) > 1 || l(h, m)
            }
            )
        }
        )
    }
    function l(h, m) {
        try {
            c(n[h](m))
        } catch (w) {
            p(r[0][3], w)
        }
    }
    function c(h) {
        h.value instanceof li ? Promise.resolve(h.value.v).then(a, u) : p(r[0][2], h)
    }
    function a(h) {
        l("next", h)
    }
    function u(h) {
        l("throw", h)
    }
    function p(h, m) {
        h(m),
        r.shift(),
        r.length && l(r[0][0], r[0][1])
    }
}
  , Fl = function(e) {
    var t = typeof e;
    return t === "string" || t === "number"
}
  , xi = -1
  , Ks = new DataView(new ArrayBuffer(0))
  , Vl = new Uint8Array(Ks.buffer)
  , Is = function() {
    try {
        Ks.getInt8(0)
    } catch (e) {
        return e.constructor
    }
    throw new Error("never reached")
}()
  , br = new Is("Insufficient data")
  , Nl = new Bl
  , Ul = function() {
    function e(t, i, n, s, r, o, l, c) {
        t === void 0 && (t = No.defaultCodec),
        i === void 0 && (i = void 0),
        n === void 0 && (n = Pt),
        s === void 0 && (s = Pt),
        r === void 0 && (r = Pt),
        o === void 0 && (o = Pt),
        l === void 0 && (l = Pt),
        c === void 0 && (c = Nl),
        this.extensionCodec = t,
        this.context = i,
        this.maxStrLength = n,
        this.maxBinLength = s,
        this.maxArrayLength = r,
        this.maxMapLength = o,
        this.maxExtLength = l,
        this.keyDecoder = c,
        this.totalPos = 0,
        this.pos = 0,
        this.view = Ks,
        this.bytes = Vl,
        this.headByte = xi,
        this.stack = []
    }
    return e.prototype.reinitializeState = function() {
        this.totalPos = 0,
        this.headByte = xi,
        this.stack.length = 0
    }
    ,
    e.prototype.setBuffer = function(t) {
        this.bytes = yn(t),
        this.view = Rl(this.bytes),
        this.pos = 0
    }
    ,
    e.prototype.appendBuffer = function(t) {
        if (this.headByte === xi && !this.hasRemaining(1))
            this.setBuffer(t);
        else {
            var i = this.bytes.subarray(this.pos)
              , n = yn(t)
              , s = new Uint8Array(i.length + n.length);
            s.set(i),
            s.set(n, i.length),
            this.setBuffer(s)
        }
    }
    ,
    e.prototype.hasRemaining = function(t) {
        return this.view.byteLength - this.pos >= t
    }
    ,
    e.prototype.createExtraByteError = function(t) {
        var i = this
          , n = i.view
          , s = i.pos;
        return new RangeError("Extra ".concat(n.byteLength - s, " of ").concat(n.byteLength, " byte(s) found at buffer[").concat(t, "]"))
    }
    ,
    e.prototype.decode = function(t) {
        this.reinitializeState(),
        this.setBuffer(t);
        var i = this.doDecodeSync();
        if (this.hasRemaining(1))
            throw this.createExtraByteError(this.pos);
        return i
    }
    ,
    e.prototype.decodeMulti = function(t) {
        return Xn(this, function(i) {
            switch (i.label) {
            case 0:
                this.reinitializeState(),
                this.setBuffer(t),
                i.label = 1;
            case 1:
                return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
            case 2:
                return i.sent(),
                [3, 1];
            case 3:
                return [2]
            }
        })
    }
    ,
    e.prototype.decodeAsync = function(t) {
        var i, n, s, r;
        return Hl(this, void 0, void 0, function() {
            var o, l, c, a, u, p, h, m;
            return Xn(this, function(w) {
                switch (w.label) {
                case 0:
                    o = !1,
                    w.label = 1;
                case 1:
                    w.trys.push([1, 6, 7, 12]),
                    i = xr(t),
                    w.label = 2;
                case 2:
                    return [4, i.next()];
                case 3:
                    if (n = w.sent(),
                    !!n.done)
                        return [3, 5];
                    if (c = n.value,
                    o)
                        throw this.createExtraByteError(this.totalPos);
                    this.appendBuffer(c);
                    try {
                        l = this.doDecodeSync(),
                        o = !0
                    } catch (x) {
                        if (!(x instanceof Is))
                            throw x
                    }
                    this.totalPos += this.pos,
                    w.label = 4;
                case 4:
                    return [3, 2];
                case 5:
                    return [3, 12];
                case 6:
                    return a = w.sent(),
                    s = {
                        error: a
                    },
                    [3, 12];
                case 7:
                    return w.trys.push([7, , 10, 11]),
                    n && !n.done && (r = i.return) ? [4, r.call(i)] : [3, 9];
                case 8:
                    w.sent(),
                    w.label = 9;
                case 9:
                    return [3, 11];
                case 10:
                    if (s)
                        throw s.error;
                    return [7];
                case 11:
                    return [7];
                case 12:
                    if (o) {
                        if (this.hasRemaining(1))
                            throw this.createExtraByteError(this.totalPos);
                        return [2, l]
                    }
                    throw u = this,
                    p = u.headByte,
                    h = u.pos,
                    m = u.totalPos,
                    new RangeError("Insufficient data in parsing ".concat(Wn(p), " at ").concat(m, " (").concat(h, " in the current buffer)"))
                }
            })
        })
    }
    ,
    e.prototype.decodeArrayStream = function(t) {
        return this.decodeMultiAsync(t, !0)
    }
    ,
    e.prototype.decodeStream = function(t) {
        return this.decodeMultiAsync(t, !1)
    }
    ,
    e.prototype.decodeMultiAsync = function(t, i) {
        return Ll(this, arguments, function() {
            var s, r, o, l, c, a, u, p, h;
            return Xn(this, function(m) {
                switch (m.label) {
                case 0:
                    s = i,
                    r = -1,
                    m.label = 1;
                case 1:
                    m.trys.push([1, 13, 14, 19]),
                    o = xr(t),
                    m.label = 2;
                case 2:
                    return [4, li(o.next())];
                case 3:
                    if (l = m.sent(),
                    !!l.done)
                        return [3, 12];
                    if (c = l.value,
                    i && r === 0)
                        throw this.createExtraByteError(this.totalPos);
                    this.appendBuffer(c),
                    s && (r = this.readArraySize(),
                    s = !1,
                    this.complete()),
                    m.label = 4;
                case 4:
                    m.trys.push([4, 9, , 10]),
                    m.label = 5;
                case 5:
                    return [4, li(this.doDecodeSync())];
                case 6:
                    return [4, m.sent()];
                case 7:
                    return m.sent(),
                    --r === 0 ? [3, 8] : [3, 5];
                case 8:
                    return [3, 10];
                case 9:
                    if (a = m.sent(),
                    !(a instanceof Is))
                        throw a;
                    return [3, 10];
                case 10:
                    this.totalPos += this.pos,
                    m.label = 11;
                case 11:
                    return [3, 2];
                case 12:
                    return [3, 19];
                case 13:
                    return u = m.sent(),
                    p = {
                        error: u
                    },
                    [3, 19];
                case 14:
                    return m.trys.push([14, , 17, 18]),
                    l && !l.done && (h = o.return) ? [4, li(h.call(o))] : [3, 16];
                case 15:
                    m.sent(),
                    m.label = 16;
                case 16:
                    return [3, 18];
                case 17:
                    if (p)
                        throw p.error;
                    return [7];
                case 18:
                    return [7];
                case 19:
                    return [2]
                }
            })
        })
    }
    ,
    e.prototype.doDecodeSync = function() {
        e: for (; ; ) {
            var t = this.readHeadByte()
              , i = void 0;
            if (t >= 224)
                i = t - 256;
            else if (t < 192)
                if (t < 128)
                    i = t;
                else if (t < 144) {
                    var n = t - 128;
                    if (n !== 0) {
                        this.pushMapState(n),
                        this.complete();
                        continue e
                    } else
                        i = {}
                } else if (t < 160) {
                    var n = t - 144;
                    if (n !== 0) {
                        this.pushArrayState(n),
                        this.complete();
                        continue e
                    } else
                        i = []
                } else {
                    var s = t - 160;
                    i = this.decodeUtf8String(s, 0)
                }
            else if (t === 192)
                i = null;
            else if (t === 194)
                i = !1;
            else if (t === 195)
                i = !0;
            else if (t === 202)
                i = this.readF32();
            else if (t === 203)
                i = this.readF64();
            else if (t === 204)
                i = this.readU8();
            else if (t === 205)
                i = this.readU16();
            else if (t === 206)
                i = this.readU32();
            else if (t === 207)
                i = this.readU64();
            else if (t === 208)
                i = this.readI8();
            else if (t === 209)
                i = this.readI16();
            else if (t === 210)
                i = this.readI32();
            else if (t === 211)
                i = this.readI64();
            else if (t === 217) {
                var s = this.lookU8();
                i = this.decodeUtf8String(s, 1)
            } else if (t === 218) {
                var s = this.lookU16();
                i = this.decodeUtf8String(s, 2)
            } else if (t === 219) {
                var s = this.lookU32();
                i = this.decodeUtf8String(s, 4)
            } else if (t === 220) {
                var n = this.readU16();
                if (n !== 0) {
                    this.pushArrayState(n),
                    this.complete();
                    continue e
                } else
                    i = []
            } else if (t === 221) {
                var n = this.readU32();
                if (n !== 0) {
                    this.pushArrayState(n),
                    this.complete();
                    continue e
                } else
                    i = []
            } else if (t === 222) {
                var n = this.readU16();
                if (n !== 0) {
                    this.pushMapState(n),
                    this.complete();
                    continue e
                } else
                    i = {}
            } else if (t === 223) {
                var n = this.readU32();
                if (n !== 0) {
                    this.pushMapState(n),
                    this.complete();
                    continue e
                } else
                    i = {}
            } else if (t === 196) {
                var n = this.lookU8();
                i = this.decodeBinary(n, 1)
            } else if (t === 197) {
                var n = this.lookU16();
                i = this.decodeBinary(n, 2)
            } else if (t === 198) {
                var n = this.lookU32();
                i = this.decodeBinary(n, 4)
            } else if (t === 212)
                i = this.decodeExtension(1, 0);
            else if (t === 213)
                i = this.decodeExtension(2, 0);
            else if (t === 214)
                i = this.decodeExtension(4, 0);
            else if (t === 215)
                i = this.decodeExtension(8, 0);
            else if (t === 216)
                i = this.decodeExtension(16, 0);
            else if (t === 199) {
                var n = this.lookU8();
                i = this.decodeExtension(n, 1)
            } else if (t === 200) {
                var n = this.lookU16();
                i = this.decodeExtension(n, 2)
            } else if (t === 201) {
                var n = this.lookU32();
                i = this.decodeExtension(n, 4)
            } else
                throw new je("Unrecognized type byte: ".concat(Wn(t)));
            this.complete();
            for (var r = this.stack; r.length > 0; ) {
                var o = r[r.length - 1];
                if (o.type === 0)
                    if (o.array[o.position] = i,
                    o.position++,
                    o.position === o.size)
                        r.pop(),
                        i = o.array;
                    else
                        continue e;
                else if (o.type === 1) {
                    if (!Fl(i))
                        throw new je("The type of key must be string or number but " + typeof i);
                    if (i === "__proto__")
                        throw new je("The key __proto__ is not allowed");
                    o.key = i,
                    o.type = 2;
                    continue e
                } else if (o.map[o.key] = i,
                o.readCount++,
                o.readCount === o.size)
                    r.pop(),
                    i = o.map;
                else {
                    o.key = null,
                    o.type = 1;
                    continue e
                }
            }
            return i
        }
    }
    ,
    e.prototype.readHeadByte = function() {
        return this.headByte === xi && (this.headByte = this.readU8()),
        this.headByte
    }
    ,
    e.prototype.complete = function() {
        this.headByte = xi
    }
    ,
    e.prototype.readArraySize = function() {
        var t = this.readHeadByte();
        switch (t) {
        case 220:
            return this.readU16();
        case 221:
            return this.readU32();
        default:
            {
                if (t < 160)
                    return t - 144;
                throw new je("Unrecognized array type byte: ".concat(Wn(t)))
            }
        }
    }
    ,
    e.prototype.pushMapState = function(t) {
        if (t > this.maxMapLength)
            throw new je("Max length exceeded: map length (".concat(t, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        this.stack.push({
            type: 1,
            size: t,
            key: null,
            readCount: 0,
            map: {}
        })
    }
    ,
    e.prototype.pushArrayState = function(t) {
        if (t > this.maxArrayLength)
            throw new je("Max length exceeded: array length (".concat(t, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        this.stack.push({
            type: 0,
            size: t,
            array: new Array(t),
            position: 0
        })
    }
    ,
    e.prototype.decodeUtf8String = function(t, i) {
        var n;
        if (t > this.maxStrLength)
            throw new je("Max length exceeded: UTF-8 byte length (".concat(t, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        if (this.bytes.byteLength < this.pos + i + t)
            throw br;
        var s = this.pos + i, r;
        return this.stateIsMapKey() && (!((n = this.keyDecoder) === null || n === void 0) && n.canBeCached(t)) ? r = this.keyDecoder.decode(this.bytes, s, t) : t > vl ? r = kl(this.bytes, s, t) : r = Vo(this.bytes, s, t),
        this.pos += i + t,
        r
    }
    ,
    e.prototype.stateIsMapKey = function() {
        if (this.stack.length > 0) {
            var t = this.stack[this.stack.length - 1];
            return t.type === 1
        }
        return !1
    }
    ,
    e.prototype.decodeBinary = function(t, i) {
        if (t > this.maxBinLength)
            throw new je("Max length exceeded: bin length (".concat(t, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        if (!this.hasRemaining(t + i))
            throw br;
        var n = this.pos + i
          , s = this.bytes.subarray(n, n + t);
        return this.pos += i + t,
        s
    }
    ,
    e.prototype.decodeExtension = function(t, i) {
        if (t > this.maxExtLength)
            throw new je("Max length exceeded: ext length (".concat(t, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        var n = this.view.getInt8(this.pos + i)
          , s = this.decodeBinary(t, i + 1);
        return this.extensionCodec.decode(s, n, this.context)
    }
    ,
    e.prototype.lookU8 = function() {
        return this.view.getUint8(this.pos)
    }
    ,
    e.prototype.lookU16 = function() {
        return this.view.getUint16(this.pos)
    }
    ,
    e.prototype.lookU32 = function() {
        return this.view.getUint32(this.pos)
    }
    ,
    e.prototype.readU8 = function() {
        var t = this.view.getUint8(this.pos);
        return this.pos++,
        t
    }
    ,
    e.prototype.readI8 = function() {
        var t = this.view.getInt8(this.pos);
        return this.pos++,
        t
    }
    ,
    e.prototype.readU16 = function() {
        var t = this.view.getUint16(this.pos);
        return this.pos += 2,
        t
    }
    ,
    e.prototype.readI16 = function() {
        var t = this.view.getInt16(this.pos);
        return this.pos += 2,
        t
    }
    ,
    e.prototype.readU32 = function() {
        var t = this.view.getUint32(this.pos);
        return this.pos += 4,
        t
    }
    ,
    e.prototype.readI32 = function() {
        var t = this.view.getInt32(this.pos);
        return this.pos += 4,
        t
    }
    ,
    e.prototype.readU64 = function() {
        var t = ul(this.view, this.pos);
        return this.pos += 8,
        t
    }
    ,
    e.prototype.readI64 = function() {
        var t = Fo(this.view, this.pos);
        return this.pos += 8,
        t
    }
    ,
    e.prototype.readF32 = function() {
        var t = this.view.getFloat32(this.pos);
        return this.pos += 4,
        t
    }
    ,
    e.prototype.readF64 = function() {
        var t = this.view.getFloat64(this.pos);
        return this.pos += 8,
        t
    }
    ,
    e
}()
  , Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function An(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}
var Uo = {
    exports: {}
}, ke = Uo.exports = {}, et, tt;
function Ts() {
    throw new Error("setTimeout has not been defined")
}
function Ms() {
    throw new Error("clearTimeout has not been defined")
}
(function() {
    try {
        typeof setTimeout == "function" ? et = setTimeout : et = Ts
    } catch {
        et = Ts
    }
    try {
        typeof clearTimeout == "function" ? tt = clearTimeout : tt = Ms
    } catch {
        tt = Ms
    }
}
)();
function Wo(e) {
    if (et === setTimeout)
        return setTimeout(e, 0);
    if ((et === Ts || !et) && setTimeout)
        return et = setTimeout,
        setTimeout(e, 0);
    try {
        return et(e, 0)
    } catch {
        try {
            return et.call(null, e, 0)
        } catch {
            return et.call(this, e, 0)
        }
    }
}
function Wl(e) {
    if (tt === clearTimeout)
        return clearTimeout(e);
    if ((tt === Ms || !tt) && clearTimeout)
        return tt = clearTimeout,
        clearTimeout(e);
    try {
        return tt(e)
    } catch {
        try {
            return tt.call(null, e)
        } catch {
            return tt.call(this, e)
        }
    }
}
var ft = [], ci = !1, Rt, on = -1;
function Xl() {
    !ci || !Rt || (ci = !1,
    Rt.length ? ft = Rt.concat(ft) : on = -1,
    ft.length && Xo())
}
function Xo() {
    if (!ci) {
        var e = Wo(Xl);
        ci = !0;
        for (var t = ft.length; t; ) {
            for (Rt = ft,
            ft = []; ++on < t; )
                Rt && Rt[on].run();
            on = -1,
            t = ft.length
        }
        Rt = null,
        ci = !1,
        Wl(e)
    }
}
ke.nextTick = function(e) {
    var t = new Array(arguments.length - 1);
    if (arguments.length > 1)
        for (var i = 1; i < arguments.length; i++)
            t[i - 1] = arguments[i];
    ft.push(new qo(e,t)),
    ft.length === 1 && !ci && Wo(Xo)
}
;
function qo(e, t) {
    this.fun = e,
    this.array = t
}
qo.prototype.run = function() {
    this.fun.apply(null, this.array)
}
;
ke.title = "browser";
ke.browser = !0;
ke.env = {};
ke.argv = [];
ke.version = "";
ke.versions = {};
function mt() {}
ke.on = mt;
ke.addListener = mt;
ke.once = mt;
ke.off = mt;
ke.removeListener = mt;
ke.removeAllListeners = mt;
ke.emit = mt;
ke.prependListener = mt;
ke.prependOnceListener = mt;
ke.listeners = function(e) {
    return []
}
;
ke.binding = function(e) {
    throw new Error("process.binding is not supported")
}
;
ke.cwd = function() {
    return "/"
}
;
ke.chdir = function(e) {
    throw new Error("process.chdir is not supported")
}
;
ke.umask = function() {
    return 0
}
;
var ql = Uo.exports;
const Es = An(ql)
  , Gl = 1920
  , Yl = 1080
  , Kl = 9
  , Go = Es && Es.argv.indexOf("--largeserver") != -1 ? 80 : 40
  , Zl = Go + 10
  , Jl = 6
  , Ql = 3e3
  , jl = 10
  , ec = 5
  , tc = 50
  , ic = 4.5
  , nc = 15
  , sc = .9
  , rc = 3e3
  , oc = 60
  , ac = 35
  , lc = 3e3
  , cc = 500
  , hc = Es && {}.IS_SANDBOX
  , uc = 100
  , fc = Math.PI / 2.6
  , dc = 10
  , pc = .25
  , mc = Math.PI / 2
  , gc = 35
  , yc = .0016
  , wc = .993
  , vc = 34
  , kc = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"]
  , xc = 7
  , bc = .06
  , Sc = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"]
  , Ic = Math.PI / 3
  , an = [{
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
}]
  , Tc = function(e) {
    const t = e.weaponXP[e.weaponIndex] || 0;
    for (let i = an.length - 1; i >= 0; --i)
        if (t >= an[i].xp)
            return an[i]
}
  , Mc = ["wood", "food", "stone", "points"]
  , Ec = 7
  , Cc = 9
  , Pc = 3
  , $c = 32
  , Rc = 7
  , Ac = 724
  , Dc = 114
  , Oc = .0011
  , _c = 1e-4
  , zc = 1.3
  , Bc = [150, 160, 165, 175]
  , Hc = [80, 85, 95]
  , Lc = [80, 85, 90]
  , Fc = 2400
  , Vc = .75
  , Nc = 15
  , Zs = 14400
  , Uc = 40
  , Wc = 2200
  , Xc = .6
  , qc = 1
  , Gc = .3
  , Yc = .3
  , Kc = 144e4
  , Js = 320
  , Zc = 100
  , Jc = 2
  , Qc = 3200
  , jc = 1440
  , eh = .2
  , th = -1
  , ih = Zs - Js - 120
  , nh = Zs - Js - 120
  , T = {
    maxScreenWidth: Gl,
    maxScreenHeight: Yl,
    serverUpdateRate: Kl,
    maxPlayers: Go,
    maxPlayersHard: Zl,
    collisionDepth: Jl,
    minimapRate: Ql,
    colGrid: jl,
    clientSendRate: ec,
    healthBarWidth: tc,
    healthBarPad: ic,
    iconPadding: nc,
    iconPad: sc,
    deathFadeout: rc,
    crownIconScale: oc,
    crownPad: ac,
    chatCountdown: lc,
    chatCooldown: cc,
    inSandbox: hc,
    maxAge: uc,
    gatherAngle: fc,
    gatherWiggle: dc,
    hitReturnRatio: pc,
    hitAngle: mc,
    playerScale: gc,
    playerSpeed: yc,
    playerDecel: wc,
    nameY: vc,
    skinColors: kc,
    animalCount: xc,
    aiTurnRandom: bc,
    cowNames: Sc,
    shieldAngle: Ic,
    weaponVariants: an,
    fetchVariant: Tc,
    resourceTypes: Mc,
    areaCount: Ec,
    treesPerArea: Cc,
    bushesPerArea: Pc,
    totalRocks: $c,
    goldOres: Rc,
    riverWidth: Ac,
    riverPadding: Dc,
    waterCurrent: Oc,
    waveSpeed: _c,
    waveMax: zc,
    treeScales: Bc,
    bushScales: Hc,
    rockScales: Lc,
    snowBiomeTop: Fc,
    snowSpeed: Vc,
    maxNameLength: Nc,
    mapScale: Zs,
    mapPingScale: Uc,
    mapPingTime: Wc,
    volcanoScale: Js,
    innerVolcanoScale: Zc,
    volcanoAnimalStrength: Jc,
    volcanoAnimationDuration: Qc,
    volcanoAggressionRadius: jc,
    volcanoAggressionPercentage: eh,
    volcanoDamagePerSecond: th,
    volcanoLocationX: ih,
    volcanoLocationY: nh,
    MAX_ATTACK: Xc,
    MAX_SPAWN_DELAY: qc,
    MAX_SPEED: Gc,
    MAX_TURN_SPEED: Yc,
    DAY_INTERVAL: Kc
}
  , sh = new Ol
  , rh = new Ul
  , pe = {
    socket: null,
    connected: !1,
    socketId: -1,
    connect: function(e, t, i) {
        if (this.socket)
            return;
        const n = this;
        try {
            let s = !1;
            const r = e;
            this.socket = new WebSocket(e),
            this.socket.binaryType = "arraybuffer",
            this.socket.onmessage = function(o) {
                var a = new Uint8Array(o.data);
                const l = rh.decode(a)
                  , c = l[0];
                var a = l[1];
                c == "io-init" ? n.socketId = a[0] : i[c].apply(void 0, a)
            }
            ,
            this.socket.onopen = function() {
                n.connected = !0,
                t()
            }
            ,
            this.socket.onclose = function(o) {
                n.connected = !1,
                o.code == 4001 ? t("Invalid Connection") : s || t("disconnected")
            }
            ,
            this.socket.onerror = function(o) {
                this.socket && this.socket.readyState != WebSocket.OPEN && (s = !0,
                console.error("Socket error", arguments),
                t("Socket error"))
            }
        } catch (s) {
            console.warn("Socket connection error:", s),
            t(s)
        }
    },
    send: function(e) {
        const t = Array.prototype.slice.call(arguments, 1)
          , i = sh.encode([e, t]);
        this.socket && this.socket.send(i)
    },
    socketReady: function() {
        return this.socket && this.connected
    },
    close: function() {
        this.socket && this.socket.close(),
        this.socket = null,
        this.connected = !1
    }
};
var Yo = Math.abs;
const oh = Math.sqrt;
var Yo = Math.abs;
const ah = Math.atan2
  , qn = Math.PI
  , lh = function(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}
  , ch = function(e, t) {
    return Math.random() * (t - e + 1) + e
}
  , hh = function(e, t, i) {
    return e + (t - e) * i
}
  , uh = function(e, t) {
    return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)),
    e
}
  , fh = function(e, t, i, n) {
    return oh((i -= e) * i + (n -= t) * n)
}
  , dh = function(e, t, i, n) {
    return ah(t - n, e - i)
}
  , ph = function(e, t) {
    const i = Yo(t - e) % (qn * 2);
    return i > qn ? qn * 2 - i : i
}
  , mh = function(e) {
    return typeof e == "number" && !isNaN(e) && isFinite(e)
}
  , gh = function(e) {
    return e && typeof e == "string"
}
  , yh = function(e) {
    return e > 999 ? (e / 1e3).toFixed(1) + "k" : e
}
  , wh = function(e) {
    return e.charAt(0).toUpperCase() + e.slice(1)
}
  , vh = function(e, t) {
    return e ? parseFloat(e.toFixed(t)) : 0
}
  , kh = function(e, t) {
    return parseFloat(t.points) - parseFloat(e.points)
}
  , xh = function(e, t, i, n, s, r, o, l) {
    let c = s
      , a = o;
    if (s > o && (c = o,
    a = s),
    a > i && (a = i),
    c < e && (c = e),
    c > a)
        return !1;
    let u = r
      , p = l;
    const h = o - s;
    if (Math.abs(h) > 1e-7) {
        const m = (l - r) / h
          , w = r - m * s;
        u = m * c + w,
        p = m * a + w
    }
    if (u > p) {
        const m = p;
        p = u,
        u = m
    }
    return p > n && (p = n),
    u < t && (u = t),
    !(u > p)
}
  , Ko = function(e, t, i) {
    const n = e.getBoundingClientRect()
      , s = n.left + window.scrollX
      , r = n.top + window.scrollY
      , o = n.width
      , l = n.height
      , c = t > s && t < s + o
      , a = i > r && i < r + l;
    return c && a
}
  , ln = function(e) {
    const t = e.changedTouches[0];
    e.screenX = t.screenX,
    e.screenY = t.screenY,
    e.clientX = t.clientX,
    e.clientY = t.clientY,
    e.pageX = t.pageX,
    e.pageY = t.pageY
}
  , Zo = function(e, t) {
    const i = !t;
    let n = !1;
    const s = !1;
    e.addEventListener("touchstart", ut(r), s),
    e.addEventListener("touchmove", ut(o), s),
    e.addEventListener("touchend", ut(l), s),
    e.addEventListener("touchcancel", ut(l), s),
    e.addEventListener("touchleave", ut(l), s);
    function r(c) {
        ln(c),
        window.setUsingTouch(!0),
        i && (c.preventDefault(),
        c.stopPropagation()),
        e.onmouseover && e.onmouseover(c),
        n = !0
    }
    function o(c) {
        ln(c),
        window.setUsingTouch(!0),
        i && (c.preventDefault(),
        c.stopPropagation()),
        Ko(e, c.pageX, c.pageY) ? n || (e.onmouseover && e.onmouseover(c),
        n = !0) : n && (e.onmouseout && e.onmouseout(c),
        n = !1)
    }
    function l(c) {
        ln(c),
        window.setUsingTouch(!0),
        i && (c.preventDefault(),
        c.stopPropagation()),
        n && (e.onclick && e.onclick(c),
        e.onmouseout && e.onmouseout(c),
        n = !1)
    }
}
  , bh = function(e) {
    for (; e.hasChildNodes(); )
        e.removeChild(e.lastChild)
}
  , Sh = function(e) {
    const t = document.createElement(e.tag || "div");
    function i(n, s) {
        e[n] && (t[s] = e[n])
    }
    i("text", "textContent"),
    i("html", "innerHTML"),
    i("class", "className");
    for (const n in e) {
        switch (n) {
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
        t[n] = e[n]
    }
    if (t.onclick && (t.onclick = ut(t.onclick)),
    t.onmouseover && (t.onmouseover = ut(t.onmouseover)),
    t.onmouseout && (t.onmouseout = ut(t.onmouseout)),
    e.style && (t.style.cssText = e.style),
    e.hookTouch && Zo(t),
    e.parent && e.parent.appendChild(t),
    e.children)
        for (let n = 0; n < e.children.length; n++)
            t.appendChild(e.children[n]);
    return t
}
  , Jo = function(e) {
    return e && typeof e.isTrusted == "boolean" ? e.isTrusted : !0
}
  , ut = function(e) {
    return function(t) {
        t && t instanceof Event && Jo(t) && e(t)
    }
}
  , Ih = function(e) {
    let t = "";
    const i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let n = 0; n < e; n++)
        t += i.charAt(Math.floor(Math.random() * i.length));
    return t
}
  , Th = function(e, t) {
    let i = 0;
    for (let n = 0; n < e.length; n++)
        e[n] === t && i++;
    return i
}
  , A = {
    randInt: lh,
    randFloat: ch,
    lerp: hh,
    decel: uh,
    getDistance: fh,
    getDirection: dh,
    getAngleDist: ph,
    isNumber: mh,
    isString: gh,
    kFormat: yh,
    capitalizeFirst: wh,
    fixTo: vh,
    sortByPoints: kh,
    lineInRect: xh,
    containsPoint: Ko,
    mousifyTouchEvent: ln,
    hookTouchEvents: Zo,
    removeAllChildren: bh,
    generateElement: Sh,
    eventIsTrusted: Jo,
    checkTrusted: ut,
    randomString: Ih,
    countInArray: Th
}
  , Mh = function() {
    this.init = function(e, t, i, n, s, r, o) {
        this.x = e,
        this.y = t,
        this.color = o,
        this.scale = i,
        this.startScale = this.scale,
        this.maxScale = i * 1.5,
        this.scaleSpeed = .7,
        this.speed = n,
        this.life = s,
        this.text = r
    }
    ,
    this.update = function(e) {
        this.life && (this.life -= e,
        this.y -= this.speed * e,
        this.scale += this.scaleSpeed * e,
        this.scale >= this.maxScale ? (this.scale = this.maxScale,
        this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale,
        this.scaleSpeed = 0),
        this.life <= 0 && (this.life = 0))
    }
    ,
    this.render = function(e, t, i) {
        e.fillStyle = this.color,
        e.font = this.scale + "px Hammersmith One",
        e.fillText(this.text, this.x - t, this.y - i)
    }
}
  , Eh = function() {
    this.texts = [],
    this.update = function(e, t, i, n) {
        t.textBaseline = "middle",
        t.textAlign = "center";
        for (let s = 0; s < this.texts.length; ++s)
            this.texts[s].life && (this.texts[s].update(e),
            this.texts[s].render(t, i, n))
    }
    ,
    this.showText = function(e, t, i, n, s, r, o) {
        let l;
        for (let c = 0; c < this.texts.length; ++c)
            if (!this.texts[c].life) {
                l = this.texts[c];
                break
            }
        l || (l = new Mh,
        this.texts.push(l)),
        l.init(e, t, i, n, s, r, o)
    }
}
  , Ch = function(e, t) {
    let i;
    this.sounds = [],
    this.active = !0,
    this.play = function(n, s, r) {
        !s || !this.active || (i = this.sounds[n],
        i || (i = new Howl({
            src: ".././sound/" + n + ".mp3"
        }),
        this.sounds[n] = i),
        (!r || !i.isPlaying) && (i.isPlaying = !0,
        i.play(),
        i.volume((s || 1) * e.volumeMult),
        i.loop(r)))
    }
    ,
    this.toggleMute = function(n, s) {
        i = this.sounds[n],
        i && i.mute(s)
    }
    ,
    this.stop = function(n) {
        i = this.sounds[n],
        i && (i.stop(),
        i.isPlaying = !1)
    }
}
  , Sr = Math.floor
  , Ir = Math.abs
  , bi = Math.cos
  , Si = Math.sin
  , Ph = Math.sqrt;
function $h(e, t, i, n, s, r) {
    this.objects = t,
    this.grids = {},
    this.updateObjects = [];
    let o, l;
    const c = n.mapScale / n.colGrid;
    this.setObjectGrids = function(h) {
        const m = Math.min(n.mapScale, Math.max(0, h.x))
          , w = Math.min(n.mapScale, Math.max(0, h.y));
        for (let x = 0; x < n.colGrid; ++x) {
            o = x * c;
            for (let S = 0; S < n.colGrid; ++S)
                l = S * c,
                m + h.scale >= o && m - h.scale <= o + c && w + h.scale >= l && w - h.scale <= l + c && (this.grids[x + "_" + S] || (this.grids[x + "_" + S] = []),
                this.grids[x + "_" + S].push(h),
                h.gridLocations.push(x + "_" + S))
        }
    }
    ,
    this.removeObjGrid = function(h) {
        let m;
        for (let w = 0; w < h.gridLocations.length; ++w)
            m = this.grids[h.gridLocations[w]].indexOf(h),
            m >= 0 && this.grids[h.gridLocations[w]].splice(m, 1)
    }
    ,
    this.disableObj = function(h) {
        if (h.active = !1,
        r) {
            h.owner && h.pps && (h.owner.pps -= h.pps),
            this.removeObjGrid(h);
            const m = this.updateObjects.indexOf(h);
            m >= 0 && this.updateObjects.splice(m, 1)
        }
    }
    ,
    this.hitObj = function(h, m) {
        for (let w = 0; w < s.length; ++w)
            s[w].active && (h.sentTo[s[w].id] && (h.active ? s[w].canSee(h) && r.send(s[w].id, "L", i.fixTo(m, 1), h.sid) : r.send(s[w].id, "Q", h.sid)),
            !h.active && h.owner == s[w] && s[w].changeItemCount(h.group.id, -1))
    }
    ;
    const a = [];
    let u;
    this.getGridArrays = function(h, m, w) {
        o = Sr(h / c),
        l = Sr(m / c),
        a.length = 0;
        try {
            this.grids[o + "_" + l] && a.push(this.grids[o + "_" + l]),
            h + w >= (o + 1) * c && (u = this.grids[o + 1 + "_" + l],
            u && a.push(u),
            l && m - w <= l * c ? (u = this.grids[o + 1 + "_" + (l - 1)],
            u && a.push(u)) : m + w >= (l + 1) * c && (u = this.grids[o + 1 + "_" + (l + 1)],
            u && a.push(u))),
            o && h - w <= o * c && (u = this.grids[o - 1 + "_" + l],
            u && a.push(u),
            l && m - w <= l * c ? (u = this.grids[o - 1 + "_" + (l - 1)],
            u && a.push(u)) : m + w >= (l + 1) * c && (u = this.grids[o - 1 + "_" + (l + 1)],
            u && a.push(u))),
            m + w >= (l + 1) * c && (u = this.grids[o + "_" + (l + 1)],
            u && a.push(u)),
            l && m - w <= l * c && (u = this.grids[o + "_" + (l - 1)],
            u && a.push(u))
        } catch {}
        return a
    }
    ;
    let p;
    this.add = function(h, m, w, x, S, $, v, b, R) {
        p = null;
        for (var G = 0; G < t.length; ++G)
            if (t[G].sid == h) {
                p = t[G];
                break
            }
        if (!p) {
            for (var G = 0; G < t.length; ++G)
                if (!t[G].active) {
                    p = t[G];
                    break
                }
        }
        p || (p = new e(h),
        t.push(p)),
        b && (p.sid = h),
        p.init(m, w, x, S, $, v, R),
        r && (this.setObjectGrids(p),
        p.doUpdate && this.updateObjects.push(p))
    }
    ,
    this.disableBySid = function(h) {
        for (let m = 0; m < t.length; ++m)
            if (t[m].sid == h) {
                this.disableObj(t[m]);
                break
            }
    }
    ,
    this.removeAllItems = function(h, m) {
        for (let w = 0; w < t.length; ++w)
            t[w].active && t[w].owner && t[w].owner.sid == h && this.disableObj(t[w]);
        m && m.broadcast("R", h)
    }
    ,
    this.fetchSpawnObj = function(h) {
        let m = null;
        for (let w = 0; w < t.length; ++w)
            if (p = t[w],
            p.active && p.owner && p.owner.sid == h && p.spawnPoint) {
                m = [p.x, p.y],
                this.disableObj(p),
                r.broadcast("Q", p.sid),
                p.owner && p.owner.changeItemCount(p.group.id, -1);
                break
            }
        return m
    }
    ,
    this.checkItemLocation = function(h, m, w, x, S, $, v) {
        for (let b = 0; b < t.length; ++b) {
            const R = t[b].blocker ? t[b].blocker : t[b].getScale(x, t[b].isItem);
            if (t[b].active && i.getDistance(h, m, t[b].x, t[b].y) < w + R)
                return !1
        }
        return !(!$ && S != 18 && m >= n.mapScale / 2 - n.riverWidth / 2 && m <= n.mapScale / 2 + n.riverWidth / 2)
    }
    ,
    this.addProjectile = function(h, m, w, x, S) {
        const $ = items.projectiles[S];
        let v;
        for (let b = 0; b < projectiles.length; ++b)
            if (!projectiles[b].active) {
                v = projectiles[b];
                break
            }
        v || (v = new Projectile(s,i),
        projectiles.push(v)),
        v.init(S, h, m, w, $.speed, x, $.scale)
    }
    ,
    this.checkCollision = function(h, m, w) {
        w = w || 1;
        const x = h.x - m.x
          , S = h.y - m.y;
        let $ = h.scale + m.scale;
        if (Ir(x) <= $ || Ir(S) <= $) {
            $ = h.scale + (m.getScale ? m.getScale() : m.scale);
            let v = Ph(x * x + S * S) - $;
            if (v <= 0) {
                if (m.ignoreCollision)
                    m.trap && !h.noTrap && m.owner != h && !(m.owner && m.owner.team && m.owner.team == h.team) ? (h.lockMove = !0,
                    m.hideFromEnemy = !1) : m.boostSpeed ? (h.xVel += w * m.boostSpeed * (m.weightM || 1) * bi(m.dir),
                    h.yVel += w * m.boostSpeed * (m.weightM || 1) * Si(m.dir)) : m.healCol ? h.healCol = m.healCol : m.teleport && (h.x = i.randInt(0, n.mapScale),
                    h.y = i.randInt(0, n.mapScale));
                else {
                    const b = i.getDirection(h.x, h.y, m.x, m.y);
                    if (i.getDistance(h.x, h.y, m.x, m.y),
                    m.isPlayer ? (v = v * -1 / 2,
                    h.x += v * bi(b),
                    h.y += v * Si(b),
                    m.x -= v * bi(b),
                    m.y -= v * Si(b)) : (h.x = m.x + $ * bi(b),
                    h.y = m.y + $ * Si(b),
                    h.xVel *= .75,
                    h.yVel *= .75),
                    m.dmg && m.owner != h && !(m.owner && m.owner.team && m.owner.team == h.team)) {
                        h.changeHealth(-m.dmg, m.owner, m);
                        const R = 1.5 * (m.weightM || 1);
                        h.xVel += R * bi(b),
                        h.yVel += R * Si(b),
                        m.pDmg && !(h.skin && h.skin.poisonRes) && (h.dmgOverTime.dmg = m.pDmg,
                        h.dmgOverTime.time = 5,
                        h.dmgOverTime.doer = m.owner),
                        h.colDmg && m.health && (m.changeHealth(-h.colDmg) && this.disableObj(m),
                        this.hitObj(m, i.getDirection(h.x, h.y, m.x, m.y)))
                    }
                }
                return m.zIndex > h.zIndex && (h.zIndex = m.zIndex),
                !0
            }
        }
        return !1
    }
}
function Rh(e, t, i, n, s, r, o, l, c) {
    this.addProjectile = function(a, u, p, h, m, w, x, S, $) {
        const v = r.projectiles[w];
        let b;
        for (let R = 0; R < t.length; ++R)
            if (!t[R].active) {
                b = t[R];
                break
            }
        return b || (b = new e(i,n,s,r,o,l,c),
        b.sid = t.length,
        t.push(b)),
        b.init(w, a, u, p, m, v.dmg, h, v.scale, x),
        b.ignoreObj = S,
        b.layer = $ || v.layer,
        b.src = v.src,
        b
    }
}
function Ah(e, t, i, n, s, r, o, l, c) {
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
        name: "Bull",
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
        name: "Bully",
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
        name: "Wolf",
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
        name: "Quack",
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
        name: "MOOSTAFA",
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
        name: "Treasure",
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
        name: "MOOFIE",
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
    }, {
        id: 9,
        name: "💀MOOFIE",
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
        name: "💀Wolf",
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
        name: "💀Bully",
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
    }],
    this.spawn = function(a, u, p, h) {
        if (!this.aiTypes[h])
            return console.error("missing ai type", h),
            this.spawn(a, u, p, 0);
        let m;
        for (let w = 0; w < e.length; ++w)
            if (!e[w].active) {
                m = e[w];
                break
            }
        return m || (m = new t(e.length,s,i,n,o,r,l,c),
        e.push(m)),
        m.init(a, u, p, h, this.aiTypes[h]),
        m
    }
}
const Ut = Math.PI * 2
  , Gn = 0;
function Dh(e, t, i, n, s, r, o, l) {
    this.sid = e,
    this.isAI = !0,
    this.nameIndex = s.randInt(0, r.cowNames.length - 1),
    this.init = function(p, h, m, w, x) {
        this.x = p,
        this.y = h,
        this.startX = x.fixedSpawn ? p : null,
        this.startY = x.fixedSpawn ? h : null,
        this.xVel = 0,
        this.yVel = 0,
        this.zIndex = 0,
        this.dir = m,
        this.dirPlus = 0,
        this.index = w,
        this.src = x.src,
        x.name && (this.name = x.name),
        (this.name || "").startsWith("💀") && (this.isVolcanoAi = !0),
        this.weightM = x.weightM,
        this.speed = x.speed,
        this.killScore = x.killScore,
        this.turnSpeed = x.turnSpeed,
        this.scale = x.scale,
        this.maxHealth = x.health,
        this.leapForce = x.leapForce,
        this.health = this.maxHealth,
        this.chargePlayer = x.chargePlayer,
        this.viewRange = x.viewRange,
        this.drop = x.drop,
        this.dmg = x.dmg,
        this.hostile = x.hostile,
        this.dontRun = x.dontRun,
        this.hitRange = x.hitRange,
        this.hitDelay = x.hitDelay,
        this.hitScare = x.hitScare,
        this.spriteMlt = x.spriteMlt,
        this.nameScale = x.nameScale,
        this.colDmg = x.colDmg,
        this.noTrap = x.noTrap,
        this.spawnDelay = x.spawnDelay,
        this.minSpawnRange = x.minSpawnRange,
        this.maxSpawnRange = x.maxSpawnRange,
        this.hitWait = 0,
        this.waitCount = 1e3,
        this.moveCount = 0,
        this.targetDir = 0,
        this.active = !0,
        this.alive = !0,
        this.runFrom = null,
        this.chargeTarget = null,
        this.dmgOverTime = {}
    }
    ,
    this.getVolcanoAggression = function() {
        const p = s.getDistance(this.x, this.y, r.volcanoLocationX, r.volcanoLocationY)
          , h = p > r.volcanoAggressionRadius ? 0 : r.volcanoAggressionRadius - p;
        return 1 + r.volcanoAggressionPercentage * (1 - h / r.volcanoAggressionRadius)
    }
    ;
    let c = 0;
    this.update = function(p) {
        if (this.active) {
            if (this.spawnCounter) {
                if (this.spawnCounter -= p * (1 + 0) * this.getVolcanoAggression(),
                this.spawnCounter <= 0)
                    if (this.spawnCounter = 0,
                    this.minSpawnRange || this.maxSpawnRange) {
                        const N = r.mapScale * this.minSpawnRange
                          , H = r.mapScale * this.maxSpawnRange;
                        this.x = s.randInt(N, H),
                        this.y = s.randInt(N, H)
                    } else
                        this.x = this.startX || s.randInt(0, r.mapScale),
                        this.y = this.startY || s.randInt(0, r.mapScale);
                return
            }
            c -= p,
            c <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
            this.dmgOverTime.time -= 1,
            this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
            c = 1e3);
            let v = !1
              , b = 1;
            if (!this.zIndex && !this.lockMove && this.y >= r.mapScale / 2 - r.riverWidth / 2 && this.y <= r.mapScale / 2 + r.riverWidth / 2 && (b = .33,
            this.xVel += r.waterCurrent * p),
            this.lockMove)
                this.xVel = 0,
                this.yVel = 0;
            else if (this.waitCount > 0) {
                if (this.waitCount -= p,
                this.waitCount <= 0)
                    if (this.chargePlayer) {
                        let N, H, _;
                        for (var h = 0; h < i.length; ++h)
                            i[h].alive && !(i[h].skin && i[h].skin.bullRepel) && (_ = s.getDistance(this.x, this.y, i[h].x, i[h].y),
                            _ <= this.viewRange && (!N || _ < H) && (H = _,
                            N = i[h]));
                        N ? (this.chargeTarget = N,
                        this.moveCount = s.randInt(8e3, 12e3)) : (this.moveCount = s.randInt(1e3, 2e3),
                        this.targetDir = s.randFloat(-Math.PI, Math.PI))
                    } else
                        this.moveCount = s.randInt(4e3, 1e4),
                        this.targetDir = s.randFloat(-Math.PI, Math.PI)
            } else if (this.moveCount > 0) {
                var m = this.speed * b * (1 + r.MAX_SPEED * Gn) * this.getVolcanoAggression();
                if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive) ? (this.targetDir = s.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y),
                m *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = s.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y),
                m *= 1.75,
                v = !0),
                this.hitWait && (m *= .3),
                this.dir != this.targetDir) {
                    this.dir %= Ut;
                    const N = (this.dir - this.targetDir + Ut) % Ut
                      , H = Math.min(Math.abs(N - Ut), N, this.turnSpeed * p)
                      , _ = N - Math.PI >= 0 ? 1 : -1;
                    this.dir += _ * H + Ut
                }
                this.dir %= Ut,
                this.xVel += m * p * Math.cos(this.dir),
                this.yVel += m * p * Math.sin(this.dir),
                this.moveCount -= p,
                this.moveCount <= 0 && (this.runFrom = null,
                this.chargeTarget = null,
                this.waitCount = this.hostile ? 1500 : s.randInt(1500, 6e3))
            }
            this.zIndex = 0,
            this.lockMove = !1;
            var w;
            const R = s.getDistance(0, 0, this.xVel * p, this.yVel * p)
              , G = Math.min(4, Math.max(1, Math.round(R / 40)))
              , X = 1 / G;
            for (var h = 0; h < G; ++h) {
                this.xVel && (this.x += this.xVel * p * X),
                this.yVel && (this.y += this.yVel * p * X),
                w = t.getGridArrays(this.x, this.y, this.scale);
                for (var x = 0; x < w.length; ++x)
                    for (let H = 0; H < w[x].length; ++H)
                        w[x][H].active && t.checkCollision(this, w[x][H], X)
            }
            let W = !1;
            if (this.hitWait > 0 && (this.hitWait -= p,
            this.hitWait <= 0)) {
                W = !0,
                this.hitWait = 0,
                this.leapForce && !s.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir),
                this.yVel += this.leapForce * Math.sin(this.dir));
                var w = t.getGridArrays(this.x, this.y, this.hitRange), S, $;
                for (let H = 0; H < w.length; ++H)
                    for (var x = 0; x < w[H].length; ++x)
                        S = w[H][x],
                        S.health && ($ = s.getDistance(this.x, this.y, S.x, S.y),
                        $ < S.scale + this.hitRange && (S.changeHealth(-this.dmg * 5) && t.disableObj(S),
                        t.hitObj(S, s.getDirection(this.x, this.y, S.x, S.y))));
                for (var x = 0; x < i.length; ++x)
                    i[x].canSee(this) && l.send(i[x].id, "J", this.sid)
            }
            if (v || W) {
                var S, $;
                let _;
                for (var h = 0; h < i.length; ++h)
                    S = i[h],
                    S && S.alive && ($ = s.getDistance(this.x, this.y, S.x, S.y),
                    this.hitRange ? !this.hitWait && $ <= this.hitRange + S.scale && (W ? (_ = s.getDirection(S.x, S.y, this.x, this.y),
                    S.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Gn) * this.getVolcanoAggression()),
                    S.xVel += .6 * Math.cos(_),
                    S.yVel += .6 * Math.sin(_),
                    this.runFrom = null,
                    this.chargeTarget = null,
                    this.waitCount = 3e3,
                    this.hitWait = s.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : $ <= this.scale + S.scale && (_ = s.getDirection(S.x, S.y, this.x, this.y),
                    S.changeHealth(-this.dmg * (1 + r.MAX_ATTACK * Gn) * this.getVolcanoAggression()),
                    S.xVel += .55 * Math.cos(_),
                    S.yVel += .55 * Math.sin(_)))
            }
            this.xVel && (this.xVel *= Math.pow(r.playerDecel, p)),
            this.yVel && (this.yVel *= Math.pow(r.playerDecel, p));
            const M = this.scale;
            this.x - M < 0 ? (this.x = M,
            this.xVel = 0) : this.x + M > r.mapScale && (this.x = r.mapScale - M,
            this.xVel = 0),
            this.y - M < 0 ? (this.y = M,
            this.yVel = 0) : this.y + M > r.mapScale && (this.y = r.mapScale - M,
            this.yVel = 0),
            this.isVolcanoAi && (this.chargeTarget && (s.getDistance(this.chargeTarget.x, this.chargeTarget.y, r.volcanoLocationX, r.volcanoLocationY) || 0) > r.volcanoAggressionRadius && (this.chargeTarget = null),
            this.xVel && (this.x < r.volcanoLocationX - r.volcanoAggressionRadius ? (this.x = r.volcanoLocationX - r.volcanoAggressionRadius,
            this.xVel = 0) : this.x > r.volcanoLocationX + r.volcanoAggressionRadius && (this.x = r.volcanoLocationX + r.volcanoAggressionRadius,
            this.xVel = 0)),
            this.yVel && (this.y < r.volcanoLocationY - r.volcanoAggressionRadius ? (this.y = r.volcanoLocationY - r.volcanoAggressionRadius,
            this.yVel = 0) : this.y > r.volcanoLocationY + r.volcanoAggressionRadius && (this.y = r.volcanoLocationY + r.volcanoAggressionRadius,
            this.yVel = 0)))
        }
    }
    ,
    this.canSee = function(p) {
        if (!p || p.skin && p.skin.invisTimer && p.noMovTimer >= p.skin.invisTimer)
            return !1;
        const h = Math.abs(p.x - this.x) - p.scale
          , m = Math.abs(p.y - this.y) - p.scale;
        return h <= r.maxScreenWidth / 2 * 1.3 && m <= r.maxScreenHeight / 2 * 1.3
    }
    ;
    let a = 0
      , u = 0;
    this.animate = function(p) {
        this.animTime > 0 && (this.animTime -= p,
        this.animTime <= 0 ? (this.animTime = 0,
        this.dirPlus = 0,
        a = 0,
        u = 0) : u == 0 ? (a += p / (this.animSpeed * r.hitReturnRatio),
        this.dirPlus = s.lerp(0, this.targetAngle, Math.min(1, a)),
        a >= 1 && (a = 1,
        u = 1)) : (a -= p / (this.animSpeed * (1 - r.hitReturnRatio)),
        this.dirPlus = s.lerp(0, this.targetAngle, Math.max(0, a))))
    }
    ,
    this.startAnim = function() {
        this.animTime = this.animSpeed = 600,
        this.targetAngle = Math.PI * .8,
        a = 0,
        u = 0
    }
    ,
    this.changeHealth = function(p, h, m) {
        if (this.active && (this.health += p,
        m && (this.hitScare && !s.randInt(0, this.hitScare) ? (this.runFrom = m,
        this.waitCount = 0,
        this.moveCount = 2e3) : this.hostile && this.chargePlayer && m.isPlayer ? (this.chargeTarget = m,
        this.waitCount = 0,
        this.moveCount = 8e3) : this.dontRun || (this.runFrom = m,
        this.waitCount = 0,
        this.moveCount = 2e3)),
        p < 0 && this.hitRange && s.randInt(0, 1) && (this.hitWait = 500),
        h && h.canSee(this) && p < 0 && l.send(h.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-p), 1),
        this.health <= 0)) {
            if (this.spawnDelay)
                this.spawnCounter = this.spawnDelay,
                this.x = -1e6,
                this.y = -1e6;
            else if (this.minSpawnRange || this.maxSpawnRange) {
                const w = r.mapScale * this.minSpawnRange
                  , x = r.mapScale * this.maxSpawnRange;
                this.x = s.randInt(w, x),
                this.y = s.randInt(w, x)
            } else
                this.x = this.startX || s.randInt(0, r.mapScale),
                this.y = this.startY || s.randInt(0, r.mapScale);
            if (this.health = this.maxHealth,
            this.runFrom = null,
            h && (o(h, this.killScore),
            this.drop))
                for (let w = 0; w < this.drop.length; )
                    h.addResource(r.resourceTypes.indexOf(this.drop[w]), this.drop[w + 1]),
                    w += 2
        }
    }
}
function Oh(e) {
    this.sid = e,
    this.init = function(t, i, n, s, r, o, l) {
        o = o || {},
        this.sentTo = {},
        this.gridLocations = [],
        this.active = !0,
        this.doUpdate = o.doUpdate,
        this.x = t,
        this.y = i,
        this.dir = n,
        this.xWiggle = 0,
        this.yWiggle = 0,
        this.scale = s,
        this.type = r,
        this.id = o.id,
        this.owner = l,
        this.name = o.name,
        this.isItem = this.id != null,
        this.group = o.group,
        this.health = o.health,
        this.layer = 2,
        this.group != null ? this.layer = this.group.layer : this.type == 0 ? this.layer = 3 : this.type == 2 ? this.layer = 0 : this.type == 4 && (this.layer = -1),
        this.colDiv = o.colDiv || 1,
        this.blocker = o.blocker,
        this.ignoreCollision = o.ignoreCollision,
        this.dontGather = o.dontGather,
        this.hideFromEnemy = o.hideFromEnemy,
        this.friction = o.friction,
        this.projDmg = o.projDmg,
        this.dmg = o.dmg,
        this.pDmg = o.pDmg,
        this.pps = o.pps,
        this.zIndex = o.zIndex || 0,
        this.turnSpeed = o.turnSpeed,
        this.req = o.req,
        this.trap = o.trap,
        this.healCol = o.healCol,
        this.teleport = o.teleport,
        this.boostSpeed = o.boostSpeed,
        this.projectile = o.projectile,
        this.shootRange = o.shootRange,
        this.shootRate = o.shootRate,
        this.shootCount = this.shootRate,
        this.spawnPoint = o.spawnPoint
    }
    ,
    this.changeHealth = function(t, i) {
        return this.health += t,
        this.health <= 0
    }
    ,
    this.getScale = function(t, i) {
        return t = t || 1,
        this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : .6 * t) * (i ? 1 : this.colDiv)
    }
    ,
    this.visibleToPlayer = function(t) {
        return !this.hideFromEnemy || this.owner && (this.owner == t || this.owner.team && t.team == this.owner.team)
    }
    ,
    this.update = function(t) {
        this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, t)),
        this.yWiggle && (this.yWiggle *= Math.pow(.99, t)),
        this.turnSpeed && (this.dir += this.turnSpeed * t))
    }
}
const de = [{
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
    sandboxLimit: 299,
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
    sandboxLimit: 299,
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
    sandboxLimit: 299,
    layer: -1
}]
  , _h = [{
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
}]
  , zh = [{
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
}]
  , Jt = [{
    group: de[0],
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
    group: de[0],
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
    group: de[0],
    name: "cheese",
    desc: "restores 30 health and another 50 over 5 seconds",
    req: ["food", 25],
    consume: function(e) {
        return e.changeHealth(30, e) || e.health < 100 ? (e.dmgOverTime.dmg = -10,
        e.dmgOverTime.doer = e,
        e.dmgOverTime.time = 5,
        !0) : !1
    },
    scale: 27,
    holdOffset: 15
}, {
    group: de[1],
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
    group: de[1],
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
    group: de[1],
    name: "castle wall",
    desc: "provides powerful protection for your village",
    req: ["stone", 35],
    health: 1500,
    scale: 52,
    holdOffset: 20,
    placeOffset: -5
}, {
    group: de[2],
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
    group: de[2],
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
    group: de[2],
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
    group: de[2],
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
    group: de[3],
    name: "windmill",
    desc: "generates gold over time",
    req: ["wood", 50, "stone", 10],
    health: 400,
    pps: 1,
    turnSpeed: .0016,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 45,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    pre: 1,
    group: de[3],
    name: "faster windmill",
    desc: "generates more gold over time",
    req: ["wood", 60, "stone", 20],
    health: 500,
    pps: 1.5,
    turnSpeed: .0025,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 8,
    pre: 1,
    group: de[3],
    name: "power mill",
    desc: "generates more gold over time",
    req: ["wood", 100, "stone", 50],
    health: 800,
    pps: 2,
    turnSpeed: .005,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
}, {
    age: 5,
    group: de[4],
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
    group: de[11],
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
    group: de[5],
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
    group: de[6],
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
    group: de[7],
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
    group: de[8],
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
    group: de[9],
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
    group: de[10],
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
    group: de[12],
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
    group: de[13],
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
}];
for (let e = 0; e < Jt.length; ++e)
    Jt[e].id = e,
    Jt[e].pre && (Jt[e].pre = e - Jt[e].pre);
const F = {
    groups: de,
    projectiles: _h,
    weapons: zh,
    list: Jt
}
  , Bh = ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]
  , Hh = {
    words: Bh
};
var Lh = {
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
  , Fh = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
  , Vh = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi
  , Nh = {
    object: Lh,
    array: Fh,
    regex: Vh
};
const Uh = Hh.words
  , Wh = Nh.array;
class Xh {
    constructor(t={}) {
        Object.assign(this, {
            list: t.emptyList && [] || Array.prototype.concat.apply(Uh, [Wh, t.list || []]),
            exclude: t.exclude || [],
            splitRegex: t.splitRegex || /\b/,
            placeHolder: t.placeHolder || "*",
            regex: t.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
            replaceRegex: t.replaceRegex || /\w/g
        })
    }
    isProfane(t) {
        return this.list.filter(i => {
            const n = new RegExp(`\\b${i.replace(/(\W)/g, "\\$1")}\\b`,"gi");
            return !this.exclude.includes(i.toLowerCase()) && n.test(t)
        }
        ).length > 0 || !1
    }
    replaceWord(t) {
        return t.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder)
    }
    clean(t) {
        return t.split(this.splitRegex).map(i => this.isProfane(i) ? this.replaceWord(i) : i).join(this.splitRegex.exec(t)[0])
    }
    addWords() {
        let t = Array.from(arguments);
        this.list.push(...t),
        t.map(i => i.toLowerCase()).forEach(i => {
            this.exclude.includes(i) && this.exclude.splice(this.exclude.indexOf(i), 1)
        }
        )
    }
    removeWords() {
        this.exclude.push(...Array.from(arguments).map(t => t.toLowerCase()))
    }
}
var qh = Xh;
const Gh = An(qh)
  , Qo = new Gh
  , Yh = ["jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa"];
Qo.addWords(...Yh);
const Tr = Math.abs
  , Wt = Math.cos
  , Xt = Math.sin
  , Mr = Math.pow
  , Kh = Math.sqrt;
function Zh(e, t, i, n, s, r, o, l, c, a, u, p, h, m) {
    this.id = e,
    this.sid = t,
    this.tmpScore = 0,
    this.team = null,
    this.skinIndex = 0,
    this.tailIndex = 0,
    this.hitTime = 0,
    this.tails = {};
    for (var w = 0; w < u.length; ++w)
        u[w].price <= 0 && (this.tails[u[w].id] = 1);
    this.skins = {};
    for (var w = 0; w < a.length; ++w)
        a[w].price <= 0 && (this.skins[a[w].id] = 1);
    this.points = 0,
    this.dt = 0,
    this.hidden = !1,
    this.itemCounts = {},
    this.isPlayer = !0,
    this.pps = 0,
    this.moveDir = void 0,
    this.skinRot = 0,
    this.lastPing = 0,
    this.iconIndex = 0,
    this.skinColor = 0,
    this.spawn = function(v) {
        this.active = !0,
        this.alive = !0,
        this.lockMove = !1,
        this.lockDir = !1,
        this.minimapCounter = 0,
        this.chatCountdown = 0,
        this.shameCount = 0,
        this.shameTimer = 0,
        this.sentTo = {},
        this.gathering = 0,
        this.autoGather = 0,
        this.animTime = 0,
        this.animSpeed = 0,
        this.mouseState = 0,
        this.buildIndex = -1,
        this.weaponIndex = 0,
        this.dmgOverTime = {},
        this.noMovTimer = 0,
        this.maxXP = 300,
        this.XP = 0,
        this.age = 1,
        this.kills = 0,
        this.upgrAge = 2,
        this.upgradePoints = 0,
        this.x = 0,
        this.y = 0,
        this.zIndex = 0,
        this.xVel = 0,
        this.yVel = 0,
        this.slowMult = 1,
        this.dir = 0,
        this.dirPlus = 0,
        this.targetDir = 0,
        this.targetAngle = 0,
        this.maxHealth = 100,
        this.health = this.maxHealth,
        this.scale = i.playerScale,
        this.speed = i.playerSpeed,
        this.resetMoveDir(),
        this.resetResources(v),
        this.items = [0, 3, 6, 10],
        this.weapons = [0],
        this.shootCount = 0,
        this.weaponXP = [],
        this.reloads = {},
        this.timeSpentNearVolcano = 0
    }
    ,
    this.resetMoveDir = function() {
        this.moveDir = void 0
    }
    ,
    this.resetResources = function(v) {
        for (let b = 0; b < i.resourceTypes.length; ++b)
            this[i.resourceTypes[b]] = v ? 100 : 0
    }
    ,
    this.addItem = function(v) {
        const b = c.list[v];
        if (b) {
            for (let R = 0; R < this.items.length; ++R)
                if (c.list[this.items[R]].group == b.group)
                    return this.buildIndex == this.items[R] && (this.buildIndex = v),
                    this.items[R] = v,
                    !0;
            return this.items.push(v),
            !0
        }
        return !1
    }
    ,
    this.setUserData = function(v) {
        if (v) {
            this.name = "unknown";
            let b = v.name + "";
            b = b.slice(0, i.maxNameLength),
            b = b.replace(/[^\w:\(\)\/? -]+/gmi, " "),
            b = b.replace(/[^\x00-\x7F]/g, " "),
            b = b.trim();
            let R = !1;
            const G = b.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
            for (const X of Qo.list)
                if (G.indexOf(X) != -1) {
                    R = !0;
                    break
                }
            b.length > 0 && !R && (this.name = b),
            this.skinColor = 0,
            i.skinColors[v.skin] && (this.skinColor = v.skin)
        }
    }
    ,
    this.getData = function() {
        return [this.id, this.sid, this.name, n.fixTo(this.x, 2), n.fixTo(this.y, 2), n.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
    }
    ,
    this.setData = function(v) {
        this.id = v[0],
        this.sid = v[1],
        this.name = v[2],
        this.x = v[3],
        this.y = v[4],
        this.dir = v[5],
        this.health = v[6],
        this.maxHealth = v[7],
        this.scale = v[8],
        this.skinColor = v[9]
    }
    ;
    let x = 0;
    this.update = function(v) {
        if (!this.alive)
            return;
        if ((n.getDistance(this.x, this.y, i.volcanoLocationX, i.volcanoLocationY) || 0) < i.volcanoAggressionRadius && (this.timeSpentNearVolcano += v,
        this.timeSpentNearVolcano >= 1e3 && (this.changeHealth(i.volcanoDamagePerSecond, null),
        p.send(this.id, "8", Math.round(this.x), Math.round(this.y), i.volcanoDamagePerSecond, -1),
        this.timeSpentNearVolcano %= 1e3)),
        this.shameTimer > 0 && (this.shameTimer -= v,
        this.shameTimer <= 0 && (this.shameTimer = 0,
        this.shameCount = 0)),
        x -= v,
        x <= 0) {
            const _ = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
            _ && this.changeHealth(_, this),
            this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
            this.dmgOverTime.time -= 1,
            this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
            this.healCol && this.changeHealth(this.healCol, this),
            x = 1e3
        }
        if (!this.alive)
            return;
        if (this.slowMult < 1 && (this.slowMult += 8e-4 * v,
        this.slowMult > 1 && (this.slowMult = 1)),
        this.noMovTimer += v,
        (this.xVel || this.yVel) && (this.noMovTimer = 0),
        this.lockMove)
            this.xVel = 0,
            this.yVel = 0;
        else {
            let _ = (this.buildIndex >= 0 ? .5 : 1) * (c.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= i.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : i.snowSpeed : 1) * this.slowMult;
            !this.zIndex && this.y >= i.mapScale / 2 - i.riverWidth / 2 && this.y <= i.mapScale / 2 + i.riverWidth / 2 && (this.skin && this.skin.watrImm ? (_ *= .75,
            this.xVel += i.waterCurrent * .4 * v) : (_ *= .33,
            this.xVel += i.waterCurrent * v));
            let D = this.moveDir != null ? Wt(this.moveDir) : 0
              , z = this.moveDir != null ? Xt(this.moveDir) : 0;
            const U = Kh(D * D + z * z);
            U != 0 && (D /= U,
            z /= U),
            D && (this.xVel += D * this.speed * _ * v),
            z && (this.yVel += z * this.speed * _ * v)
        }
        this.zIndex = 0,
        this.lockMove = !1,
        this.healCol = 0;
        let R;
        const G = n.getDistance(0, 0, this.xVel * v, this.yVel * v)
          , X = Math.min(4, Math.max(1, Math.round(G / 40)))
          , W = 1 / X;
        let M = {};
        for (var N = 0; N < X; ++N) {
            this.xVel && (this.x += this.xVel * v * W),
            this.yVel && (this.y += this.yVel * v * W),
            R = r.getGridArrays(this.x, this.y, this.scale);
            for (let _ = 0; _ < R.length; ++_) {
                for (let D = 0; D < R[_].length && !(R[_][D].active && !M[R[_][D].sid] && r.checkCollision(this, R[_][D], W) && (M[R[_][D].sid] = !0,
                !this.alive)); ++D)
                    ;
                if (!this.alive)
                    break
            }
            if (!this.alive)
                break
        }
        for (var H = o.indexOf(this), N = H + 1; N < o.length; ++N)
            o[N] != this && o[N].alive && r.checkCollision(this, o[N]);
        if (this.xVel && (this.xVel *= Mr(i.playerDecel, v),
        this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)),
        this.yVel && (this.yVel *= Mr(i.playerDecel, v),
        this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)),
        this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > i.mapScale && (this.x = i.mapScale - this.scale),
        this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > i.mapScale && (this.y = i.mapScale - this.scale),
        this.buildIndex < 0) {
            if (this.reloads[this.weaponIndex] > 0)
                this.reloads[this.weaponIndex] -= v,
                this.gathering = this.mouseState;
            else if (this.gathering || this.autoGather) {
                let _ = !0;
                if (c.weapons[this.weaponIndex].gather != null)
                    this.gather(o);
                else if (c.weapons[this.weaponIndex].projectile != null && this.hasRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                    this.useRes(c.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0),
                    this.noMovTimer = 0;
                    var H = c.weapons[this.weaponIndex].projectile;
                    const z = this.scale * 2
                      , U = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                    c.weapons[this.weaponIndex].rec && (this.xVel -= c.weapons[this.weaponIndex].rec * Wt(this.dir),
                    this.yVel -= c.weapons[this.weaponIndex].rec * Xt(this.dir)),
                    s.addProjectile(this.x + z * Wt(this.dir), this.y + z * Xt(this.dir), this.dir, c.projectiles[H].range * U, c.projectiles[H].speed * U, H, this, null, this.zIndex)
                } else
                    _ = !1;
                this.gathering = this.mouseState,
                _ && (this.reloads[this.weaponIndex] = c.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
            }
        }
    }
    ,
    this.addWeaponXP = function(v) {
        this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0),
        this.weaponXP[this.weaponIndex] += v
    }
    ,
    this.earnXP = function(v) {
        this.age < i.maxAge && (this.XP += v,
        this.XP >= this.maxXP ? (this.age < i.maxAge ? (this.age++,
        this.XP = 0,
        this.maxXP *= 1.2) : this.XP = this.maxXP,
        this.upgradePoints++,
        p.send(this.id, "U", this.upgradePoints, this.upgrAge),
        p.send(this.id, "T", this.XP, n.fixTo(this.maxXP, 1), this.age)) : p.send(this.id, "T", this.XP))
    }
    ,
    this.changeHealth = function(v, b) {
        if (v > 0 && this.health >= this.maxHealth)
            return !1;
        v < 0 && this.skin && (v *= this.skin.dmgMult || 1),
        v < 0 && this.tail && (v *= this.tail.dmgMult || 1),
        v < 0 && (this.hitTime = Date.now()),
        this.health += v,
        this.health > this.maxHealth && (v -= this.health - this.maxHealth,
        this.health = this.maxHealth),
        this.health <= 0 && this.kill(b);
        for (let R = 0; R < o.length; ++R)
            this.sentTo[o[R].id] && p.send(o[R].id, "O", this.sid, this.health);
        return b && b.canSee(this) && !(b == this && v < 0) && p.send(b.id, "8", Math.round(this.x), Math.round(this.y), Math.round(-v), 1),
        !0
    }
    ,
    this.kill = function(v) {
        v && v.alive && (v.kills++,
        v.skin && v.skin.goldSteal ? h(v, Math.round(this.points / 2)) : h(v, Math.round(this.age * 100 * (v.skin && v.skin.kScrM ? v.skin.kScrM : 1))),
        p.send(v.id, "N", "kills", v.kills, 1)),
        this.alive = !1,
        p.send(this.id, "P"),
        m()
    }
    ,
    this.addResource = function(v, b, R) {
        !R && b > 0 && this.addWeaponXP(b),
        v == 3 ? h(this, b, !0) : (this[i.resourceTypes[v]] += b,
        p.send(this.id, "N", i.resourceTypes[v], this[i.resourceTypes[v]], 1))
    }
    ,
    this.changeItemCount = function(v, b) {
        this.itemCounts[v] = this.itemCounts[v] || 0,
        this.itemCounts[v] += b,
        p.send(this.id, "S", v, this.itemCounts[v])
    }
    ,
    this.buildItem = function(v) {
        const b = this.scale + v.scale + (v.placeOffset || 0)
          , R = this.x + b * Wt(this.dir)
          , G = this.y + b * Xt(this.dir);
        if (this.canBuild(v) && !(v.consume && this.skin && this.skin.noEat) && (v.consume || r.checkItemLocation(R, G, v.scale, .6, v.id, !1, this))) {
            let X = !1;
            if (v.consume) {
                if (this.hitTime) {
                    const W = Date.now() - this.hitTime;
                    this.hitTime = 0,
                    W <= 120 ? (this.shameCount++,
                    this.shameCount >= 8 && (this.shameTimer = 3e4,
                    this.shameCount = 0)) : (this.shameCount -= 2,
                    this.shameCount <= 0 && (this.shameCount = 0))
                }
                this.shameTimer <= 0 && (X = v.consume(this))
            } else
                X = !0,
                v.group.limit && this.changeItemCount(v.group.id, 1),
                v.pps && (this.pps += v.pps),
                r.add(r.objects.length, R, G, this.dir, v.scale, v.type, v, !1, this);
            X && (this.useRes(v),
            this.buildIndex = -1)
        }
    }
    ,
    this.hasRes = function(v, b) {
        for (let R = 0; R < v.req.length; ) {
            if (this[v.req[R]] < Math.round(v.req[R + 1] * (b || 1)))
                return !1;
            R += 2
        }
        return !0
    }
    ,
    this.useRes = function(v, b) {
        if (!i.inSandbox)
            for (let R = 0; R < v.req.length; )
                this.addResource(i.resourceTypes.indexOf(v.req[R]), -Math.round(v.req[R + 1] * (b || 1))),
                R += 2
    }
    ,
    this.canBuild = function(v) {
        const b = i.inSandbox ? v.group.sandboxLimit || Math.max(v.group.limit * 3, 99) : v.group.limit;
        return b && this.itemCounts[v.group.id] >= b ? !1 : i.inSandbox ? !0 : this.hasRes(v)
    }
    ,
    this.gather = function() {
        this.noMovTimer = 0,
        this.slowMult -= c.weapons[this.weaponIndex].hitSlow || .3,
        this.slowMult < 0 && (this.slowMult = 0);
        const v = i.fetchVariant(this)
          , b = v.poison
          , R = v.val
          , G = {};
        let X, W, M, N;
        const H = r.getGridArrays(this.x, this.y, c.weapons[this.weaponIndex].range);
        for (let D = 0; D < H.length; ++D)
            for (var _ = 0; _ < H[D].length; ++_)
                if (M = H[D][_],
                M.active && !M.dontGather && !G[M.sid] && M.visibleToPlayer(this) && (X = n.getDistance(this.x, this.y, M.x, M.y) - M.scale,
                X <= c.weapons[this.weaponIndex].range && (W = n.getDirection(M.x, M.y, this.x, this.y),
                n.getAngleDist(W, this.dir) <= i.gatherAngle))) {
                    if (G[M.sid] = 1,
                    M.health) {
                        if (M.changeHealth(-c.weapons[this.weaponIndex].dmg * R * (c.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                            for (let z = 0; z < M.req.length; )
                                this.addResource(i.resourceTypes.indexOf(M.req[z]), M.req[z + 1]),
                                z += 2;
                            r.disableObj(M)
                        }
                    } else {
                        if (M.name === "volcano")
                            this.hitVolcano(c.weapons[this.weaponIndex].gather);
                        else {
                            this.earnXP(4 * c.weapons[this.weaponIndex].gather);
                            const z = c.weapons[this.weaponIndex].gather + (M.type == 3 ? 4 : 0);
                            this.addResource(M.type, z)
                        }
                        this.skin && this.skin.extraGold && this.addResource(3, 1)
                    }
                    N = !0,
                    r.hitObj(M, W)
                }
        for (var _ = 0; _ < o.length + l.length; ++_)
            if (M = o[_] || l[_ - o.length],
            M != this && M.alive && !(M.team && M.team == this.team) && (X = n.getDistance(this.x, this.y, M.x, M.y) - M.scale * 1.8,
            X <= c.weapons[this.weaponIndex].range && (W = n.getDirection(M.x, M.y, this.x, this.y),
            n.getAngleDist(W, this.dir) <= i.gatherAngle))) {
                let z = c.weapons[this.weaponIndex].steal;
                z && M.addResource && (z = Math.min(M.points || 0, z),
                this.addResource(3, z),
                M.addResource(3, -z));
                let U = R;
                M.weaponIndex != null && c.weapons[M.weaponIndex].shield && n.getAngleDist(W + Math.PI, M.dir) <= i.shieldAngle && (U = c.weapons[M.weaponIndex].shield);
                const Y = c.weapons[this.weaponIndex].dmg
                  , K = Y * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1)
                  , ie = .3 * (M.weightM || 1) + (c.weapons[this.weaponIndex].knock || 0);
                M.xVel += ie * Wt(W),
                M.yVel += ie * Xt(W),
                this.skin && this.skin.healD && this.changeHealth(K * U * this.skin.healD, this),
                this.tail && this.tail.healD && this.changeHealth(K * U * this.tail.healD, this),
                M.skin && M.skin.dmg && this.changeHealth(-Y * M.skin.dmg, M),
                M.tail && M.tail.dmg && this.changeHealth(-Y * M.tail.dmg, M),
                M.dmgOverTime && this.skin && this.skin.poisonDmg && !(M.skin && M.skin.poisonRes) && (M.dmgOverTime.dmg = this.skin.poisonDmg,
                M.dmgOverTime.time = this.skin.poisonTime || 1,
                M.dmgOverTime.doer = this),
                M.dmgOverTime && b && !(M.skin && M.skin.poisonRes) && (M.dmgOverTime.dmg = 5,
                M.dmgOverTime.time = 5,
                M.dmgOverTime.doer = this),
                M.skin && M.skin.dmgK && (this.xVel -= M.skin.dmgK * Wt(W),
                this.yVel -= M.skin.dmgK * Xt(W)),
                M.changeHealth(-K * U, this, this)
            }
        this.sendAnimation(N ? 1 : 0)
    }
    ,
    this.hitVolcano = function(v) {
        const b = 5 + Math.round(v / 3.5);
        this.addResource(2, b),
        this.addResource(3, b)
    }
    ,
    this.sendAnimation = function(v) {
        for (let b = 0; b < o.length; ++b)
            this.sentTo[o[b].id] && this.canSee(o[b]) && p.send(o[b].id, "K", this.sid, v ? 1 : 0, this.weaponIndex)
    }
    ;
    let S = 0
      , $ = 0;
    this.animate = function(v) {
        this.animTime > 0 && (this.animTime -= v,
        this.animTime <= 0 ? (this.animTime = 0,
        this.dirPlus = 0,
        S = 0,
        $ = 0) : $ == 0 ? (S += v / (this.animSpeed * i.hitReturnRatio),
        this.dirPlus = n.lerp(0, this.targetAngle, Math.min(1, S)),
        S >= 1 && (S = 1,
        $ = 1)) : (S -= v / (this.animSpeed * (1 - i.hitReturnRatio)),
        this.dirPlus = n.lerp(0, this.targetAngle, Math.max(0, S))))
    }
    ,
    this.startAnim = function(v, b) {
        this.animTime = this.animSpeed = c.weapons[b].speed,
        this.targetAngle = v ? -i.hitAngle : -Math.PI,
        S = 0,
        $ = 0
    }
    ,
    this.canSee = function(v) {
        if (!v || v.skin && v.skin.invisTimer && v.noMovTimer >= v.skin.invisTimer)
            return !1;
        const b = Tr(v.x - this.x) - v.scale
          , R = Tr(v.y - this.y) - v.scale;
        return b <= i.maxScreenWidth / 2 * 1.3 && R <= i.maxScreenHeight / 2 * 1.3
    }
}
const Jh = [{
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
}]
  , Qh = [{
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
  , jo = {
    hats: Jh,
    accessories: Qh
};
function jh(e, t, i, n, s, r, o) {
    this.init = function(a, u, p, h, m, w, x, S, $) {
        this.active = !0,
        this.indx = a,
        this.x = u,
        this.y = p,
        this.dir = h,
        this.skipMov = !0,
        this.speed = m,
        this.dmg = w,
        this.scale = S,
        this.range = x,
        this.owner = $,
        o && (this.sentTo = {})
    }
    ;
    const l = [];
    let c;
    this.update = function(a) {
        if (this.active) {
            let p = this.speed * a, h;
            if (this.skipMov ? this.skipMov = !1 : (this.x += p * Math.cos(this.dir),
            this.y += p * Math.sin(this.dir),
            this.range -= p,
            this.range <= 0 && (this.x += this.range * Math.cos(this.dir),
            this.y += this.range * Math.sin(this.dir),
            p = 1,
            this.range = 0,
            this.active = !1)),
            o) {
                for (var u = 0; u < e.length; ++u)
                    !this.sentTo[e[u].id] && e[u].canSee(this) && (this.sentTo[e[u].id] = 1,
                    o.send(e[u].id, "X", r.fixTo(this.x, 1), r.fixTo(this.y, 1), r.fixTo(this.dir, 2), r.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                l.length = 0;
                for (var u = 0; u < e.length + t.length; ++u)
                    c = e[u] || t[u - e.length],
                    c.alive && c != this.owner && !(this.owner.team && c.team == this.owner.team) && r.lineInRect(c.x - c.scale, c.y - c.scale, c.x + c.scale, c.y + c.scale, this.x, this.y, this.x + p * Math.cos(this.dir), this.y + p * Math.sin(this.dir)) && l.push(c);
                const m = i.getGridArrays(this.x, this.y, this.scale);
                for (let w = 0; w < m.length; ++w)
                    for (let x = 0; x < m[w].length; ++x)
                        c = m[w][x],
                        h = c.getScale(),
                        c.active && this.ignoreObj != c.sid && this.layer <= c.layer && l.indexOf(c) < 0 && !c.ignoreCollision && r.lineInRect(c.x - h, c.y - h, c.x + h, c.y + h, this.x, this.y, this.x + p * Math.cos(this.dir), this.y + p * Math.sin(this.dir)) && l.push(c);
                if (l.length > 0) {
                    let w = null
                      , x = null
                      , S = null;
                    for (var u = 0; u < l.length; ++u)
                        S = r.getDistance(this.x, this.y, l[u].x, l[u].y),
                        (x == null || S < x) && (x = S,
                        w = l[u]);
                    if (w.isPlayer || w.isAI) {
                        const $ = .3 * (w.weightM || 1);
                        w.xVel += $ * Math.cos(this.dir),
                        w.yVel += $ * Math.sin(this.dir),
                        (w.weaponIndex == null || !(n.weapons[w.weaponIndex].shield && r.getAngleDist(this.dir + Math.PI, w.dir) <= s.shieldAngle)) && w.changeHealth(-this.dmg, this.owner, this.owner)
                    } else {
                        w.projDmg && w.health && w.changeHealth(-this.dmg) && i.disableObj(w);
                        for (var u = 0; u < e.length; ++u)
                            e[u].active && (w.sentTo[e[u].id] && (w.active ? e[u].canSee(w) && o.send(e[u].id, "L", r.fixTo(this.dir, 2), w.sid) : o.send(e[u].id, "Q", w.sid)),
                            !w.active && w.owner == e[u] && e[u].changeItemCount(w.group.id, -1))
                    }
                    this.active = !1;
                    for (var u = 0; u < e.length; ++u)
                        this.sentTo[e[u].id] && o.send(e[u].id, "Y", this.sid, r.fixTo(x, 1))
                }
            }
        }
    }
}
var ea = {
    exports: {}
}
  , ta = {
    exports: {}
};
(function() {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
      , t = {
        rotl: function(i, n) {
            return i << n | i >>> 32 - n
        },
        rotr: function(i, n) {
            return i << 32 - n | i >>> n
        },
        endian: function(i) {
            if (i.constructor == Number)
                return t.rotl(i, 8) & 16711935 | t.rotl(i, 24) & 4278255360;
            for (var n = 0; n < i.length; n++)
                i[n] = t.endian(i[n]);
            return i
        },
        randomBytes: function(i) {
            for (var n = []; i > 0; i--)
                n.push(Math.floor(Math.random() * 256));
            return n
        },
        bytesToWords: function(i) {
            for (var n = [], s = 0, r = 0; s < i.length; s++,
            r += 8)
                n[r >>> 5] |= i[s] << 24 - r % 32;
            return n
        },
        wordsToBytes: function(i) {
            for (var n = [], s = 0; s < i.length * 32; s += 8)
                n.push(i[s >>> 5] >>> 24 - s % 32 & 255);
            return n
        },
        bytesToHex: function(i) {
            for (var n = [], s = 0; s < i.length; s++)
                n.push((i[s] >>> 4).toString(16)),
                n.push((i[s] & 15).toString(16));
            return n.join("")
        },
        hexToBytes: function(i) {
            for (var n = [], s = 0; s < i.length; s += 2)
                n.push(parseInt(i.substr(s, 2), 16));
            return n
        },
        bytesToBase64: function(i) {
            for (var n = [], s = 0; s < i.length; s += 3)
                for (var r = i[s] << 16 | i[s + 1] << 8 | i[s + 2], o = 0; o < 4; o++)
                    s * 8 + o * 6 <= i.length * 8 ? n.push(e.charAt(r >>> 6 * (3 - o) & 63)) : n.push("=");
            return n.join("")
        },
        base64ToBytes: function(i) {
            i = i.replace(/[^A-Z0-9+\/]/ig, "");
            for (var n = [], s = 0, r = 0; s < i.length; r = ++s % 4)
                r != 0 && n.push((e.indexOf(i.charAt(s - 1)) & Math.pow(2, -2 * r + 8) - 1) << r * 2 | e.indexOf(i.charAt(s)) >>> 6 - r * 2);
            return n
        }
    };
    ta.exports = t
}
)();
var eu = ta.exports
  , Cs = {
    utf8: {
        stringToBytes: function(e) {
            return Cs.bin.stringToBytes(unescape(encodeURIComponent(e)))
        },
        bytesToString: function(e) {
            return decodeURIComponent(escape(Cs.bin.bytesToString(e)))
        }
    },
    bin: {
        stringToBytes: function(e) {
            for (var t = [], i = 0; i < e.length; i++)
                t.push(e.charCodeAt(i) & 255);
            return t
        },
        bytesToString: function(e) {
            for (var t = [], i = 0; i < e.length; i++)
                t.push(String.fromCharCode(e[i]));
            return t.join("")
        }
    }
}
  , Er = Cs;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var tu = function(e) {
    return e != null && (ia(e) || iu(e) || !!e._isBuffer)
};
function ia(e) {
    return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e)
}
function iu(e) {
    return typeof e.readFloatLE == "function" && typeof e.slice == "function" && ia(e.slice(0, 0))
}
(function() {
    var e = eu
      , t = Er.utf8
      , i = tu
      , n = Er.bin
      , s = function(r, o) {
        r.constructor == String ? o && o.encoding === "binary" ? r = n.stringToBytes(r) : r = t.stringToBytes(r) : i(r) ? r = Array.prototype.slice.call(r, 0) : !Array.isArray(r) && r.constructor !== Uint8Array && (r = r.toString());
        for (var l = e.bytesToWords(r), c = r.length * 8, a = 1732584193, u = -271733879, p = -1732584194, h = 271733878, m = 0; m < l.length; m++)
            l[m] = (l[m] << 8 | l[m] >>> 24) & 16711935 | (l[m] << 24 | l[m] >>> 8) & 4278255360;
        l[c >>> 5] |= 128 << c % 32,
        l[(c + 64 >>> 9 << 4) + 14] = c;
        for (var w = s._ff, x = s._gg, S = s._hh, $ = s._ii, m = 0; m < l.length; m += 16) {
            var v = a
              , b = u
              , R = p
              , G = h;
            a = w(a, u, p, h, l[m + 0], 7, -680876936),
            h = w(h, a, u, p, l[m + 1], 12, -389564586),
            p = w(p, h, a, u, l[m + 2], 17, 606105819),
            u = w(u, p, h, a, l[m + 3], 22, -1044525330),
            a = w(a, u, p, h, l[m + 4], 7, -176418897),
            h = w(h, a, u, p, l[m + 5], 12, 1200080426),
            p = w(p, h, a, u, l[m + 6], 17, -1473231341),
            u = w(u, p, h, a, l[m + 7], 22, -45705983),
            a = w(a, u, p, h, l[m + 8], 7, 1770035416),
            h = w(h, a, u, p, l[m + 9], 12, -1958414417),
            p = w(p, h, a, u, l[m + 10], 17, -42063),
            u = w(u, p, h, a, l[m + 11], 22, -1990404162),
            a = w(a, u, p, h, l[m + 12], 7, 1804603682),
            h = w(h, a, u, p, l[m + 13], 12, -40341101),
            p = w(p, h, a, u, l[m + 14], 17, -1502002290),
            u = w(u, p, h, a, l[m + 15], 22, 1236535329),
            a = x(a, u, p, h, l[m + 1], 5, -165796510),
            h = x(h, a, u, p, l[m + 6], 9, -1069501632),
            p = x(p, h, a, u, l[m + 11], 14, 643717713),
            u = x(u, p, h, a, l[m + 0], 20, -373897302),
            a = x(a, u, p, h, l[m + 5], 5, -701558691),
            h = x(h, a, u, p, l[m + 10], 9, 38016083),
            p = x(p, h, a, u, l[m + 15], 14, -660478335),
            u = x(u, p, h, a, l[m + 4], 20, -405537848),
            a = x(a, u, p, h, l[m + 9], 5, 568446438),
            h = x(h, a, u, p, l[m + 14], 9, -1019803690),
            p = x(p, h, a, u, l[m + 3], 14, -187363961),
            u = x(u, p, h, a, l[m + 8], 20, 1163531501),
            a = x(a, u, p, h, l[m + 13], 5, -1444681467),
            h = x(h, a, u, p, l[m + 2], 9, -51403784),
            p = x(p, h, a, u, l[m + 7], 14, 1735328473),
            u = x(u, p, h, a, l[m + 12], 20, -1926607734),
            a = S(a, u, p, h, l[m + 5], 4, -378558),
            h = S(h, a, u, p, l[m + 8], 11, -2022574463),
            p = S(p, h, a, u, l[m + 11], 16, 1839030562),
            u = S(u, p, h, a, l[m + 14], 23, -35309556),
            a = S(a, u, p, h, l[m + 1], 4, -1530992060),
            h = S(h, a, u, p, l[m + 4], 11, 1272893353),
            p = S(p, h, a, u, l[m + 7], 16, -155497632),
            u = S(u, p, h, a, l[m + 10], 23, -1094730640),
            a = S(a, u, p, h, l[m + 13], 4, 681279174),
            h = S(h, a, u, p, l[m + 0], 11, -358537222),
            p = S(p, h, a, u, l[m + 3], 16, -722521979),
            u = S(u, p, h, a, l[m + 6], 23, 76029189),
            a = S(a, u, p, h, l[m + 9], 4, -640364487),
            h = S(h, a, u, p, l[m + 12], 11, -421815835),
            p = S(p, h, a, u, l[m + 15], 16, 530742520),
            u = S(u, p, h, a, l[m + 2], 23, -995338651),
            a = $(a, u, p, h, l[m + 0], 6, -198630844),
            h = $(h, a, u, p, l[m + 7], 10, 1126891415),
            p = $(p, h, a, u, l[m + 14], 15, -1416354905),
            u = $(u, p, h, a, l[m + 5], 21, -57434055),
            a = $(a, u, p, h, l[m + 12], 6, 1700485571),
            h = $(h, a, u, p, l[m + 3], 10, -1894986606),
            p = $(p, h, a, u, l[m + 10], 15, -1051523),
            u = $(u, p, h, a, l[m + 1], 21, -2054922799),
            a = $(a, u, p, h, l[m + 8], 6, 1873313359),
            h = $(h, a, u, p, l[m + 15], 10, -30611744),
            p = $(p, h, a, u, l[m + 6], 15, -1560198380),
            u = $(u, p, h, a, l[m + 13], 21, 1309151649),
            a = $(a, u, p, h, l[m + 4], 6, -145523070),
            h = $(h, a, u, p, l[m + 11], 10, -1120210379),
            p = $(p, h, a, u, l[m + 2], 15, 718787259),
            u = $(u, p, h, a, l[m + 9], 21, -343485551),
            a = a + v >>> 0,
            u = u + b >>> 0,
            p = p + R >>> 0,
            h = h + G >>> 0
        }
        return e.endian([a, u, p, h])
    };
    s._ff = function(r, o, l, c, a, u, p) {
        var h = r + (o & l | ~o & c) + (a >>> 0) + p;
        return (h << u | h >>> 32 - u) + o
    }
    ,
    s._gg = function(r, o, l, c, a, u, p) {
        var h = r + (o & c | l & ~c) + (a >>> 0) + p;
        return (h << u | h >>> 32 - u) + o
    }
    ,
    s._hh = function(r, o, l, c, a, u, p) {
        var h = r + (o ^ l ^ c) + (a >>> 0) + p;
        return (h << u | h >>> 32 - u) + o
    }
    ,
    s._ii = function(r, o, l, c, a, u, p) {
        var h = r + (l ^ (o | ~c)) + (a >>> 0) + p;
        return (h << u | h >>> 32 - u) + o
    }
    ,
    s._blocksize = 16,
    s._digestsize = 16,
    ea.exports = function(r, o) {
        if (r == null)
            throw new Error("Illegal argument " + r);
        var l = e.wordsToBytes(s(r, o));
        return o && o.asBytes ? l : o && o.asString ? n.bytesToString(l) : e.bytesToHex(l)
    }
}
)();
var nu = ea.exports;
const su = An(nu);
var Yn, Cr;
function Tt() {
    if (Cr)
        return Yn;
    Cr = 1;
    function e(t, i, n, s, r, o) {
        return {
            tag: t,
            key: i,
            attrs: n,
            children: s,
            text: r,
            dom: o,
            domSize: void 0,
            state: void 0,
            events: void 0,
            instance: void 0
        }
    }
    return e.normalize = function(t) {
        return Array.isArray(t) ? e("[", void 0, void 0, e.normalizeChildren(t), void 0, void 0) : t == null || typeof t == "boolean" ? null : typeof t == "object" ? t : e("#", void 0, void 0, String(t), void 0, void 0)
    }
    ,
    e.normalizeChildren = function(t) {
        var i = [];
        if (t.length) {
            for (var n = t[0] != null && t[0].key != null, s = 1; s < t.length; s++)
                if ((t[s] != null && t[s].key != null) !== n)
                    throw new TypeError(n && (t[s] != null || typeof t[s] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
            for (var s = 0; s < t.length; s++)
                i[s] = e.normalize(t[s])
        }
        return i
    }
    ,
    Yn = e,
    Yn
}
var ru = Tt()
  , na = function() {
    var e = arguments[this], t = this + 1, i;
    if (e == null ? e = {} : (typeof e != "object" || e.tag != null || Array.isArray(e)) && (e = {},
    t = this),
    arguments.length === t + 1)
        i = arguments[t],
        Array.isArray(i) || (i = [i]);
    else
        for (i = []; t < arguments.length; )
            i.push(arguments[t++]);
    return ru("", e.key, e, i)
}
  , Dn = {}.hasOwnProperty
  , ou = Tt()
  , au = na
  , Qt = Dn
  , lu = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
  , sa = {};
function Pr(e) {
    for (var t in e)
        if (Qt.call(e, t))
            return !1;
    return !0
}
function cu(e) {
    for (var t, i = "div", n = [], s = {}; t = lu.exec(e); ) {
        var r = t[1]
          , o = t[2];
        if (r === "" && o !== "")
            i = o;
        else if (r === "#")
            s.id = o;
        else if (r === ".")
            n.push(o);
        else if (t[3][0] === "[") {
            var l = t[6];
            l && (l = l.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")),
            t[4] === "class" ? n.push(l) : s[t[4]] = l === "" ? l : l || !0
        }
    }
    return n.length > 0 && (s.className = n.join(" ")),
    sa[e] = {
        tag: i,
        attrs: s
    }
}
function hu(e, t) {
    var i = t.attrs
      , n = Qt.call(i, "class")
      , s = n ? i.class : i.className;
    if (t.tag = e.tag,
    t.attrs = {},
    !Pr(e.attrs) && !Pr(i)) {
        var r = {};
        for (var o in i)
            Qt.call(i, o) && (r[o] = i[o]);
        i = r
    }
    for (var o in e.attrs)
        Qt.call(e.attrs, o) && o !== "className" && !Qt.call(i, o) && (i[o] = e.attrs[o]);
    (s != null || e.attrs.className != null) && (i.className = s != null ? e.attrs.className != null ? String(e.attrs.className) + " " + String(s) : s : e.attrs.className != null ? e.attrs.className : null),
    n && (i.class = null);
    for (var o in i)
        if (Qt.call(i, o) && o !== "key") {
            t.attrs = i;
            break
        }
    return t
}
function uu(e) {
    if (e == null || typeof e != "string" && typeof e != "function" && typeof e.view != "function")
        throw Error("The selector must be either a string or a component.");
    var t = au.apply(1, arguments);
    return typeof e == "string" && (t.children = ou.normalizeChildren(t.children),
    e !== "[") ? hu(sa[e] || cu(e), t) : (t.tag = e,
    t)
}
var ra = uu
  , fu = Tt()
  , du = function(e) {
    return e == null && (e = ""),
    fu("<", void 0, void 0, e, void 0, void 0)
}
  , pu = Tt()
  , mu = na
  , gu = function() {
    var e = mu.apply(0, arguments);
    return e.tag = "[",
    e.children = pu.normalizeChildren(e.children),
    e
}
  , Qs = ra;
Qs.trust = du;
Qs.fragment = gu;
var yu = Qs, cn = {
    exports: {}
}, Kn, $r;
function oa() {
    if ($r)
        return Kn;
    $r = 1;
    var e = function(t) {
        if (!(this instanceof e))
            throw new Error("Promise must be called with 'new'.");
        if (typeof t != "function")
            throw new TypeError("executor must be a function.");
        var i = this
          , n = []
          , s = []
          , r = a(n, !0)
          , o = a(s, !1)
          , l = i._instance = {
            resolvers: n,
            rejectors: s
        }
          , c = typeof setImmediate == "function" ? setImmediate : setTimeout;
        function a(p, h) {
            return function m(w) {
                var x;
                try {
                    if (h && w != null && (typeof w == "object" || typeof w == "function") && typeof (x = w.then) == "function") {
                        if (w === i)
                            throw new TypeError("Promise can't be resolved with itself.");
                        u(x.bind(w))
                    } else
                        c(function() {
                            !h && p.length === 0 && console.error("Possible unhandled promise rejection:", w);
                            for (var S = 0; S < p.length; S++)
                                p[S](w);
                            n.length = 0,
                            s.length = 0,
                            l.state = h,
                            l.retry = function() {
                                m(w)
                            }
                        })
                } catch (S) {
                    o(S)
                }
            }
        }
        function u(p) {
            var h = 0;
            function m(x) {
                return function(S) {
                    h++ > 0 || x(S)
                }
            }
            var w = m(o);
            try {
                p(m(r), w)
            } catch (x) {
                w(x)
            }
        }
        u(t)
    };
    return e.prototype.then = function(t, i) {
        var n = this
          , s = n._instance;
        function r(a, u, p, h) {
            u.push(function(m) {
                if (typeof a != "function")
                    p(m);
                else
                    try {
                        o(a(m))
                    } catch (w) {
                        l && l(w)
                    }
            }),
            typeof s.retry == "function" && h === s.state && s.retry()
        }
        var o, l, c = new e(function(a, u) {
            o = a,
            l = u
        }
        );
        return r(t, s.resolvers, o, !0),
        r(i, s.rejectors, l, !1),
        c
    }
    ,
    e.prototype.catch = function(t) {
        return this.then(null, t)
    }
    ,
    e.prototype.finally = function(t) {
        return this.then(function(i) {
            return e.resolve(t()).then(function() {
                return i
            })
        }, function(i) {
            return e.resolve(t()).then(function() {
                return e.reject(i)
            })
        })
    }
    ,
    e.resolve = function(t) {
        return t instanceof e ? t : new e(function(i) {
            i(t)
        }
        )
    }
    ,
    e.reject = function(t) {
        return new e(function(i, n) {
            n(t)
        }
        )
    }
    ,
    e.all = function(t) {
        return new e(function(i, n) {
            var s = t.length
              , r = 0
              , o = [];
            if (t.length === 0)
                i([]);
            else
                for (var l = 0; l < t.length; l++)
                    (function(c) {
                        function a(u) {
                            r++,
                            o[c] = u,
                            r === s && i(o)
                        }
                        t[c] != null && (typeof t[c] == "object" || typeof t[c] == "function") && typeof t[c].then == "function" ? t[c].then(a, n) : a(t[c])
                    }
                    )(l)
        }
        )
    }
    ,
    e.race = function(t) {
        return new e(function(i, n) {
            for (var s = 0; s < t.length; s++)
                t[s].then(i, n)
        }
        )
    }
    ,
    Kn = e,
    Kn
}
var Ii = oa();
typeof window < "u" ? (typeof window.Promise > "u" ? window.Promise = Ii : window.Promise.prototype.finally || (window.Promise.prototype.finally = Ii.prototype.finally),
cn.exports = window.Promise) : typeof Nt < "u" ? (typeof Nt.Promise > "u" ? Nt.Promise = Ii : Nt.Promise.prototype.finally || (Nt.Promise.prototype.finally = Ii.prototype.finally),
cn.exports = Nt.Promise) : cn.exports = Ii;
var aa = cn.exports, Zn, Rr;
function wu() {
    if (Rr)
        return Zn;
    Rr = 1;
    var e = Tt();
    return Zn = function(t) {
        var i = t && t.document, n, s = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML"
        };
        function r(d) {
            return d.attrs && d.attrs.xmlns || s[d.tag]
        }
        function o(d, f) {
            if (d.state !== f)
                throw new Error("'vnode.state' must not be modified.")
        }
        function l(d) {
            var f = d.state;
            try {
                return this.apply(f, arguments)
            } finally {
                o(d, f)
            }
        }
        function c() {
            try {
                return i.activeElement
            } catch {
                return null
            }
        }
        function a(d, f, g, I, E, O, q) {
            for (var Z = g; Z < I; Z++) {
                var V = f[Z];
                V != null && u(d, V, E, q, O)
            }
        }
        function u(d, f, g, I, E) {
            var O = f.tag;
            if (typeof O == "string")
                switch (f.state = {},
                f.attrs != null && mi(f.attrs, f, g),
                O) {
                case "#":
                    p(d, f, E);
                    break;
                case "<":
                    m(d, f, I, E);
                    break;
                case "[":
                    w(d, f, g, I, E);
                    break;
                default:
                    x(d, f, g, I, E)
                }
            else
                $(d, f, g, I, E)
        }
        function p(d, f, g) {
            f.dom = i.createTextNode(f.children),
            Y(d, f.dom, g)
        }
        var h = {
            caption: "table",
            thead: "table",
            tbody: "table",
            tfoot: "table",
            tr: "tbody",
            th: "tr",
            td: "tr",
            colgroup: "table",
            col: "colgroup"
        };
        function m(d, f, g, I) {
            var E = f.children.match(/^\s*?<(\w+)/im) || []
              , O = i.createElement(h[E[1]] || "div");
            g === "http://www.w3.org/2000/svg" ? (O.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + f.children + "</svg>",
            O = O.firstChild) : O.innerHTML = f.children,
            f.dom = O.firstChild,
            f.domSize = O.childNodes.length,
            f.instance = [];
            for (var q = i.createDocumentFragment(), Z; Z = O.firstChild; )
                f.instance.push(Z),
                q.appendChild(Z);
            Y(d, q, I)
        }
        function w(d, f, g, I, E) {
            var O = i.createDocumentFragment();
            if (f.children != null) {
                var q = f.children;
                a(O, q, 0, q.length, g, null, I)
            }
            f.dom = O.firstChild,
            f.domSize = O.childNodes.length,
            Y(d, O, E)
        }
        function x(d, f, g, I, E) {
            var O = f.tag
              , q = f.attrs
              , Z = q && q.is;
            I = r(f) || I;
            var V = I ? Z ? i.createElementNS(I, O, {
                is: Z
            }) : i.createElementNS(I, O) : Z ? i.createElement(O, {
                is: Z
            }) : i.createElement(O);
            if (f.dom = V,
            q != null && Ge(f, q, I),
            Y(d, V, E),
            !K(f) && f.children != null) {
                var ee = f.children;
                a(V, ee, 0, ee.length, g, null, I),
                f.tag === "select" && q != null && yt(f, q)
            }
        }
        function S(d, f) {
            var g;
            if (typeof d.tag.view == "function") {
                if (d.state = Object.create(d.tag),
                g = d.state.view,
                g.$$reentrantLock$$ != null)
                    return;
                g.$$reentrantLock$$ = !0
            } else {
                if (d.state = void 0,
                g = d.tag,
                g.$$reentrantLock$$ != null)
                    return;
                g.$$reentrantLock$$ = !0,
                d.state = d.tag.prototype != null && typeof d.tag.prototype.view == "function" ? new d.tag(d) : d.tag(d)
            }
            if (mi(d.state, d, f),
            d.attrs != null && mi(d.attrs, d, f),
            d.instance = e.normalize(l.call(d.state.view, d)),
            d.instance === d)
                throw Error("A view cannot return the vnode it received as argument");
            g.$$reentrantLock$$ = null
        }
        function $(d, f, g, I, E) {
            S(f, g),
            f.instance != null ? (u(d, f.instance, g, I, E),
            f.dom = f.instance.dom,
            f.domSize = f.dom != null ? f.instance.domSize : 0) : f.domSize = 0
        }
        function v(d, f, g, I, E, O) {
            if (!(f === g || f == null && g == null))
                if (f == null || f.length === 0)
                    a(d, g, 0, g.length, I, E, O);
                else if (g == null || g.length === 0)
                    ie(d, f, 0, f.length);
                else {
                    var q = f[0] != null && f[0].key != null
                      , Z = g[0] != null && g[0].key != null
                      , V = 0
                      , ee = 0;
                    if (!q)
                        for (; ee < f.length && f[ee] == null; )
                            ee++;
                    if (!Z)
                        for (; V < g.length && g[V] == null; )
                            V++;
                    if (q !== Z)
                        ie(d, f, ee, f.length),
                        a(d, g, V, g.length, I, E, O);
                    else if (Z) {
                        for (var xe = f.length - 1, be = g.length - 1, rt, Ce, fe, Se, oe, ot; xe >= ee && be >= V && (Se = f[xe],
                        oe = g[be],
                        Se.key === oe.key); )
                            Se !== oe && b(d, Se, oe, I, E, O),
                            oe.dom != null && (E = oe.dom),
                            xe--,
                            be--;
                        for (; xe >= ee && be >= V && (Ce = f[ee],
                        fe = g[V],
                        Ce.key === fe.key); )
                            ee++,
                            V++,
                            Ce !== fe && b(d, Ce, fe, I, D(f, ee, E), O);
                        for (; xe >= ee && be >= V && !(V === be || Ce.key !== oe.key || Se.key !== fe.key); )
                            ot = D(f, ee, E),
                            z(d, Se, ot),
                            Se !== fe && b(d, Se, fe, I, ot, O),
                            ++V <= --be && z(d, Ce, E),
                            Ce !== oe && b(d, Ce, oe, I, E, O),
                            oe.dom != null && (E = oe.dom),
                            ee++,
                            xe--,
                            Se = f[xe],
                            oe = g[be],
                            Ce = f[ee],
                            fe = g[V];
                        for (; xe >= ee && be >= V && Se.key === oe.key; )
                            Se !== oe && b(d, Se, oe, I, E, O),
                            oe.dom != null && (E = oe.dom),
                            xe--,
                            be--,
                            Se = f[xe],
                            oe = g[be];
                        if (V > be)
                            ie(d, f, ee, xe + 1);
                        else if (ee > xe)
                            a(d, g, V, be + 1, I, E, O);
                        else {
                            var ji = E, yi = be - V + 1, wt = new Array(yi), wi = 0, he = 0, at = 2147483647, Ft = 0, rt, Vt;
                            for (he = 0; he < yi; he++)
                                wt[he] = -1;
                            for (he = be; he >= V; he--) {
                                rt == null && (rt = N(f, ee, xe + 1)),
                                oe = g[he];
                                var He = rt[oe.key];
                                He != null && (at = He < at ? He : -1,
                                wt[he - V] = He,
                                Se = f[He],
                                f[He] = null,
                                Se !== oe && b(d, Se, oe, I, E, O),
                                oe.dom != null && (E = oe.dom),
                                Ft++)
                            }
                            if (E = ji,
                            Ft !== xe - ee + 1 && ie(d, f, ee, xe + 1),
                            Ft === 0)
                                a(d, g, V, be + 1, I, E, O);
                            else if (at === -1)
                                for (Vt = _(wt),
                                wi = Vt.length - 1,
                                he = be; he >= V; he--)
                                    fe = g[he],
                                    wt[he - V] === -1 ? u(d, fe, I, O, E) : Vt[wi] === he - V ? wi-- : z(d, fe, E),
                                    fe.dom != null && (E = g[he].dom);
                            else
                                for (he = be; he >= V; he--)
                                    fe = g[he],
                                    wt[he - V] === -1 && u(d, fe, I, O, E),
                                    fe.dom != null && (E = g[he].dom)
                        }
                    } else {
                        var Lt = f.length < g.length ? f.length : g.length;
                        for (V = V < ee ? V : ee; V < Lt; V++)
                            Ce = f[V],
                            fe = g[V],
                            !(Ce === fe || Ce == null && fe == null) && (Ce == null ? u(d, fe, I, O, D(f, V + 1, E)) : fe == null ? ne(d, Ce) : b(d, Ce, fe, I, D(f, V + 1, E), O));
                        f.length > Lt && ie(d, f, V, f.length),
                        g.length > Lt && a(d, g, V, g.length, I, E, O)
                    }
                }
        }
        function b(d, f, g, I, E, O) {
            var q = f.tag
              , Z = g.tag;
            if (q === Z) {
                if (g.state = f.state,
                g.events = f.events,
                Ln(g, f))
                    return;
                if (typeof q == "string")
                    switch (g.attrs != null && gi(g.attrs, g, I),
                    q) {
                    case "#":
                        R(f, g);
                        break;
                    case "<":
                        G(d, f, g, O, E);
                        break;
                    case "[":
                        X(d, f, g, I, E, O);
                        break;
                    default:
                        W(f, g, I, O)
                    }
                else
                    M(d, f, g, I, E, O)
            } else
                ne(d, f),
                u(d, g, I, O, E)
        }
        function R(d, f) {
            d.children.toString() !== f.children.toString() && (d.dom.nodeValue = f.children),
            f.dom = d.dom
        }
        function G(d, f, g, I, E) {
            f.children !== g.children ? (J(d, f),
            m(d, g, I, E)) : (g.dom = f.dom,
            g.domSize = f.domSize,
            g.instance = f.instance)
        }
        function X(d, f, g, I, E, O) {
            v(d, f.children, g.children, I, E, O);
            var q = 0
              , Z = g.children;
            if (g.dom = null,
            Z != null) {
                for (var V = 0; V < Z.length; V++) {
                    var ee = Z[V];
                    ee != null && ee.dom != null && (g.dom == null && (g.dom = ee.dom),
                    q += ee.domSize || 1)
                }
                q !== 1 && (g.domSize = q)
            }
        }
        function W(d, f, g, I) {
            var E = f.dom = d.dom;
            I = r(f) || I,
            f.tag === "textarea" && f.attrs == null && (f.attrs = {}),
            se(f, d.attrs, f.attrs, I),
            K(f) || v(E, d.children, f.children, g, null, I)
        }
        function M(d, f, g, I, E, O) {
            if (g.instance = e.normalize(l.call(g.state.view, g)),
            g.instance === g)
                throw Error("A view cannot return the vnode it received as argument");
            gi(g.state, g, I),
            g.attrs != null && gi(g.attrs, g, I),
            g.instance != null ? (f.instance == null ? u(d, g.instance, I, O, E) : b(d, f.instance, g.instance, I, E, O),
            g.dom = g.instance.dom,
            g.domSize = g.instance.domSize) : f.instance != null ? (ne(d, f.instance),
            g.dom = void 0,
            g.domSize = 0) : (g.dom = f.dom,
            g.domSize = f.domSize)
        }
        function N(d, f, g) {
            for (var I = Object.create(null); f < g; f++) {
                var E = d[f];
                if (E != null) {
                    var O = E.key;
                    O != null && (I[O] = f)
                }
            }
            return I
        }
        var H = [];
        function _(d) {
            for (var f = [0], g = 0, I = 0, E = 0, O = H.length = d.length, E = 0; E < O; E++)
                H[E] = d[E];
            for (var E = 0; E < O; ++E)
                if (d[E] !== -1) {
                    var q = f[f.length - 1];
                    if (d[q] < d[E]) {
                        H[E] = q,
                        f.push(E);
                        continue
                    }
                    for (g = 0,
                    I = f.length - 1; g < I; ) {
                        var Z = (g >>> 1) + (I >>> 1) + (g & I & 1);
                        d[f[Z]] < d[E] ? g = Z + 1 : I = Z
                    }
                    d[E] < d[f[g]] && (g > 0 && (H[E] = f[g - 1]),
                    f[g] = E)
                }
            for (g = f.length,
            I = f[g - 1]; g-- > 0; )
                f[g] = I,
                I = H[I];
            return H.length = 0,
            f
        }
        function D(d, f, g) {
            for (; f < d.length; f++)
                if (d[f] != null && d[f].dom != null)
                    return d[f].dom;
            return g
        }
        function z(d, f, g) {
            var I = i.createDocumentFragment();
            U(d, I, f),
            Y(d, I, g)
        }
        function U(d, f, g) {
            for (; g.dom != null && g.dom.parentNode === d; ) {
                if (typeof g.tag != "string") {
                    if (g = g.instance,
                    g != null)
                        continue
                } else if (g.tag === "<")
                    for (var I = 0; I < g.instance.length; I++)
                        f.appendChild(g.instance[I]);
                else if (g.tag !== "[")
                    f.appendChild(g.dom);
                else if (g.children.length === 1) {
                    if (g = g.children[0],
                    g != null)
                        continue
                } else
                    for (var I = 0; I < g.children.length; I++) {
                        var E = g.children[I];
                        E != null && U(d, f, E)
                    }
                break
            }
        }
        function Y(d, f, g) {
            g != null ? d.insertBefore(f, g) : d.appendChild(f)
        }
        function K(d) {
            if (d.attrs == null || d.attrs.contenteditable == null && d.attrs.contentEditable == null)
                return !1;
            var f = d.children;
            if (f != null && f.length === 1 && f[0].tag === "<") {
                var g = f[0].children;
                d.dom.innerHTML !== g && (d.dom.innerHTML = g)
            } else if (f != null && f.length !== 0)
                throw new Error("Child node of a contenteditable must be trusted.");
            return !0
        }
        function ie(d, f, g, I) {
            for (var E = g; E < I; E++) {
                var O = f[E];
                O != null && ne(d, O)
            }
        }
        function ne(d, f) {
            var g = 0, I = f.state, E, O;
            if (typeof f.tag != "string" && typeof f.state.onbeforeremove == "function") {
                var q = l.call(f.state.onbeforeremove, f);
                q != null && typeof q.then == "function" && (g = 1,
                E = q)
            }
            if (f.attrs && typeof f.attrs.onbeforeremove == "function") {
                var q = l.call(f.attrs.onbeforeremove, f);
                q != null && typeof q.then == "function" && (g |= 2,
                O = q)
            }
            if (o(f, I),
            !g)
                st(f),
                Ee(d, f);
            else {
                if (E != null) {
                    var Z = function() {
                        g & 1 && (g &= 2,
                        g || V())
                    };
                    E.then(Z, Z)
                }
                if (O != null) {
                    var Z = function() {
                        g & 2 && (g &= 1,
                        g || V())
                    };
                    O.then(Z, Z)
                }
            }
            function V() {
                o(f, I),
                st(f),
                Ee(d, f)
            }
        }
        function J(d, f) {
            for (var g = 0; g < f.instance.length; g++)
                d.removeChild(f.instance[g])
        }
        function Ee(d, f) {
            for (; f.dom != null && f.dom.parentNode === d; ) {
                if (typeof f.tag != "string") {
                    if (f = f.instance,
                    f != null)
                        continue
                } else if (f.tag === "<")
                    J(d, f);
                else {
                    if (f.tag !== "[" && (d.removeChild(f.dom),
                    !Array.isArray(f.children)))
                        break;
                    if (f.children.length === 1) {
                        if (f = f.children[0],
                        f != null)
                            continue
                    } else
                        for (var g = 0; g < f.children.length; g++) {
                            var I = f.children[g];
                            I != null && Ee(d, I)
                        }
                }
                break
            }
        }
        function st(d) {
            if (typeof d.tag != "string" && typeof d.state.onremove == "function" && l.call(d.state.onremove, d),
            d.attrs && typeof d.attrs.onremove == "function" && l.call(d.attrs.onremove, d),
            typeof d.tag != "string")
                d.instance != null && st(d.instance);
            else {
                var f = d.children;
                if (Array.isArray(f))
                    for (var g = 0; g < f.length; g++) {
                        var I = f[g];
                        I != null && st(I)
                    }
            }
        }
        function Ge(d, f, g) {
            d.tag === "input" && f.type != null && d.dom.setAttribute("type", f.type);
            var I = f != null && d.tag === "input" && f.type === "file";
            for (var E in f)
                j(d, E, null, f[E], g, I)
        }
        function j(d, f, g, I, E, O) {
            if (!(f === "key" || f === "is" || I == null || Ne(f) || g === I && !Mt(d, f) && typeof I != "object" || f === "type" && d.tag === "input")) {
                if (f[0] === "o" && f[1] === "n")
                    return Qi(d, f, I);
                if (f.slice(0, 6) === "xlink:")
                    d.dom.setAttributeNS("http://www.w3.org/1999/xlink", f.slice(6), I);
                else if (f === "style")
                    Ji(d.dom, g, I);
                else if (Je(d, f, E)) {
                    if (f === "value") {
                        if ((d.tag === "input" || d.tag === "textarea") && d.dom.value === "" + I && (O || d.dom === c()) || d.tag === "select" && g !== null && d.dom.value === "" + I || d.tag === "option" && g !== null && d.dom.value === "" + I)
                            return;
                        if (O && "" + I != "") {
                            console.error("`value` is read-only on file inputs!");
                            return
                        }
                    }
                    d.dom[f] = I
                } else
                    typeof I == "boolean" ? I ? d.dom.setAttribute(f, "") : d.dom.removeAttribute(f) : d.dom.setAttribute(f === "className" ? "class" : f, I)
            }
        }
        function Be(d, f, g, I) {
            if (!(f === "key" || f === "is" || g == null || Ne(f)))
                if (f[0] === "o" && f[1] === "n")
                    Qi(d, f, void 0);
                else if (f === "style")
                    Ji(d.dom, g, null);
                else if (Je(d, f, I) && f !== "className" && f !== "title" && !(f === "value" && (d.tag === "option" || d.tag === "select" && d.dom.selectedIndex === -1 && d.dom === c())) && !(d.tag === "input" && f === "type"))
                    d.dom[f] = null;
                else {
                    var E = f.indexOf(":");
                    E !== -1 && (f = f.slice(E + 1)),
                    g !== !1 && d.dom.removeAttribute(f === "className" ? "class" : f)
                }
        }
        function yt(d, f) {
            if ("value"in f)
                if (f.value === null)
                    d.dom.selectedIndex !== -1 && (d.dom.value = null);
                else {
                    var g = "" + f.value;
                    (d.dom.value !== g || d.dom.selectedIndex === -1) && (d.dom.value = g)
                }
            "selectedIndex"in f && j(d, "selectedIndex", null, f.selectedIndex, void 0)
        }
        function se(d, f, g, I) {
            if (f && f === g && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"),
            g != null) {
                d.tag === "input" && g.type != null && d.dom.setAttribute("type", g.type);
                var E = d.tag === "input" && g.type === "file";
                for (var O in g)
                    j(d, O, f && f[O], g[O], I, E)
            }
            var q;
            if (f != null)
                for (var O in f)
                    (q = f[O]) != null && (g == null || g[O] == null) && Be(d, O, q, I)
        }
        function Mt(d, f) {
            return f === "value" || f === "checked" || f === "selectedIndex" || f === "selected" && d.dom === c() || d.tag === "option" && d.dom.parentNode === i.activeElement
        }
        function Ne(d) {
            return d === "oninit" || d === "oncreate" || d === "onupdate" || d === "onremove" || d === "onbeforeremove" || d === "onbeforeupdate"
        }
        function Je(d, f, g) {
            return g === void 0 && (d.tag.indexOf("-") > -1 || d.attrs != null && d.attrs.is || f !== "href" && f !== "list" && f !== "form" && f !== "width" && f !== "height") && f in d.dom
        }
        var Qe = /[A-Z]/g;
        function ce(d) {
            return "-" + d.toLowerCase()
        }
        function Bt(d) {
            return d[0] === "-" && d[1] === "-" ? d : d === "cssFloat" ? "float" : d.replace(Qe, ce)
        }
        function Ji(d, f, g) {
            if (f !== g)
                if (g == null)
                    d.style.cssText = "";
                else if (typeof g != "object")
                    d.style.cssText = g;
                else if (f == null || typeof f != "object") {
                    d.style.cssText = "";
                    for (var I in g) {
                        var E = g[I];
                        E != null && d.style.setProperty(Bt(I), String(E))
                    }
                } else {
                    for (var I in g) {
                        var E = g[I];
                        E != null && (E = String(E)) !== String(f[I]) && d.style.setProperty(Bt(I), E)
                    }
                    for (var I in f)
                        f[I] != null && g[I] == null && d.style.removeProperty(Bt(I))
                }
        }
        function Ht() {
            this._ = n
        }
        Ht.prototype = Object.create(null),
        Ht.prototype.handleEvent = function(d) {
            var f = this["on" + d.type], g;
            typeof f == "function" ? g = f.call(d.currentTarget, d) : typeof f.handleEvent == "function" && f.handleEvent(d),
            this._ && d.redraw !== !1 && (0,
            this._)(),
            g === !1 && (d.preventDefault(),
            d.stopPropagation())
        }
        ;
        function Qi(d, f, g) {
            if (d.events != null) {
                if (d.events._ = n,
                d.events[f] === g)
                    return;
                g != null && (typeof g == "function" || typeof g == "object") ? (d.events[f] == null && d.dom.addEventListener(f.slice(2), d.events, !1),
                d.events[f] = g) : (d.events[f] != null && d.dom.removeEventListener(f.slice(2), d.events, !1),
                d.events[f] = void 0)
            } else
                g != null && (typeof g == "function" || typeof g == "object") && (d.events = new Ht,
                d.dom.addEventListener(f.slice(2), d.events, !1),
                d.events[f] = g)
        }
        function mi(d, f, g) {
            typeof d.oninit == "function" && l.call(d.oninit, f),
            typeof d.oncreate == "function" && g.push(l.bind(d.oncreate, f))
        }
        function gi(d, f, g) {
            typeof d.onupdate == "function" && g.push(l.bind(d.onupdate, f))
        }
        function Ln(d, f) {
            do {
                if (d.attrs != null && typeof d.attrs.onbeforeupdate == "function") {
                    var g = l.call(d.attrs.onbeforeupdate, d, f);
                    if (g !== void 0 && !g)
                        break
                }
                if (typeof d.tag != "string" && typeof d.state.onbeforeupdate == "function") {
                    var g = l.call(d.state.onbeforeupdate, d, f);
                    if (g !== void 0 && !g)
                        break
                }
                return !1
            } while (!1);
            return d.dom = f.dom,
            d.domSize = f.domSize,
            d.instance = f.instance,
            d.attrs = f.attrs,
            d.children = f.children,
            d.text = f.text,
            !0
        }
        var Et;
        return function(d, f, g) {
            if (!d)
                throw new TypeError("DOM element being rendered to does not exist.");
            if (Et != null && d.contains(Et))
                throw new TypeError("Node is currently being rendered to and thus is locked.");
            var I = n
              , E = Et
              , O = []
              , q = c()
              , Z = d.namespaceURI;
            Et = d,
            n = typeof g == "function" ? g : void 0;
            try {
                d.vnodes == null && (d.textContent = ""),
                f = e.normalizeChildren(Array.isArray(f) ? f : [f]),
                v(d, d.vnodes, f, O, null, Z === "http://www.w3.org/1999/xhtml" ? void 0 : Z),
                d.vnodes = f,
                q != null && c() !== q && typeof q.focus == "function" && q.focus();
                for (var V = 0; V < O.length; V++)
                    O[V]()
            } finally {
                n = I,
                Et = E
            }
        }
    }
    ,
    Zn
}
var Jn, Ar;
function la() {
    return Ar || (Ar = 1,
    Jn = wu()(typeof window < "u" ? window : null)),
    Jn
}
var Dr = Tt(), vu = function(e, t, i) {
    var n = []
      , s = !1
      , r = -1;
    function o() {
        for (r = 0; r < n.length; r += 2)
            try {
                e(n[r], Dr(n[r + 1]), l)
            } catch (a) {
                i.error(a)
            }
        r = -1
    }
    function l() {
        s || (s = !0,
        t(function() {
            s = !1,
            o()
        }))
    }
    l.sync = o;
    function c(a, u) {
        if (u != null && u.view == null && typeof u != "function")
            throw new TypeError("m.mount expects a component, not a vnode.");
        var p = n.indexOf(a);
        p >= 0 && (n.splice(p, 2),
        p <= r && (r -= 2),
        e(a, [])),
        u != null && (n.push(a, u),
        e(a, Dr(u), l))
    }
    return {
        mount: c,
        redraw: l
    }
}, ku = la(), js = vu(ku, typeof requestAnimationFrame < "u" ? requestAnimationFrame : null, typeof console < "u" ? console : null), Qn, Or;
function ca() {
    return Or || (Or = 1,
    Qn = function(e) {
        if (Object.prototype.toString.call(e) !== "[object Object]")
            return "";
        var t = [];
        for (var i in e)
            n(i, e[i]);
        return t.join("&");
        function n(s, r) {
            if (Array.isArray(r))
                for (var o = 0; o < r.length; o++)
                    n(s + "[" + o + "]", r[o]);
            else if (Object.prototype.toString.call(r) === "[object Object]")
                for (var o in r)
                    n(s + "[" + o + "]", r[o]);
            else
                t.push(encodeURIComponent(s) + (r != null && r !== "" ? "=" + encodeURIComponent(r) : ""))
        }
    }
    ),
    Qn
}
var jn, _r;
function ha() {
    if (_r)
        return jn;
    _r = 1;
    var e = Dn;
    return jn = Object.assign || function(t, i) {
        for (var n in i)
            e.call(i, n) && (t[n] = i[n])
    }
    ,
    jn
}
var es, zr;
function er() {
    if (zr)
        return es;
    zr = 1;
    var e = ca()
      , t = ha();
    return es = function(i, n) {
        if (/:([^\/\.-]+)(\.{3})?:/.test(i))
            throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
        if (n == null)
            return i;
        var s = i.indexOf("?")
          , r = i.indexOf("#")
          , o = r < 0 ? i.length : r
          , l = s < 0 ? o : s
          , c = i.slice(0, l)
          , a = {};
        t(a, n);
        var u = c.replace(/:([^\/\.-]+)(\.{3})?/g, function($, v, b) {
            return delete a[v],
            n[v] == null ? $ : b ? n[v] : encodeURIComponent(String(n[v]))
        })
          , p = u.indexOf("?")
          , h = u.indexOf("#")
          , m = h < 0 ? u.length : h
          , w = p < 0 ? m : p
          , x = u.slice(0, w);
        s >= 0 && (x += i.slice(s, o)),
        p >= 0 && (x += (s < 0 ? "?" : "&") + u.slice(p, m));
        var S = e(a);
        return S && (x += (s < 0 && p < 0 ? "?" : "&") + S),
        r >= 0 && (x += i.slice(r)),
        h >= 0 && (x += (r < 0 ? "" : "&") + u.slice(h)),
        x
    }
    ,
    es
}
var xu = er(), Br = Dn, bu = function(e, t, i) {
    var n = 0;
    function s(l) {
        return new t(l)
    }
    s.prototype = t.prototype,
    s.__proto__ = t;
    function r(l) {
        return function(c, a) {
            typeof c != "string" ? (a = c,
            c = c.url) : a == null && (a = {});
            var u = new t(function(w, x) {
                l(xu(c, a.params), a, function(S) {
                    if (typeof a.type == "function")
                        if (Array.isArray(S))
                            for (var $ = 0; $ < S.length; $++)
                                S[$] = new a.type(S[$]);
                        else
                            S = new a.type(S);
                    w(S)
                }, x)
            }
            );
            if (a.background === !0)
                return u;
            var p = 0;
            function h() {
                --p === 0 && typeof i == "function" && i()
            }
            return m(u);
            function m(w) {
                var x = w.then;
                return w.constructor = s,
                w.then = function() {
                    p++;
                    var S = x.apply(w, arguments);
                    return S.then(h, function($) {
                        if (h(),
                        p === 0)
                            throw $
                    }),
                    m(S)
                }
                ,
                w
            }
        }
    }
    function o(l, c) {
        for (var a in l.headers)
            if (Br.call(l.headers, a) && a.toLowerCase() === c)
                return !0;
        return !1
    }
    return {
        request: r(function(l, c, a, u) {
            var p = c.method != null ? c.method.toUpperCase() : "GET", h = c.body, m = (c.serialize == null || c.serialize === JSON.serialize) && !(h instanceof e.FormData || h instanceof e.URLSearchParams), w = c.responseType || (typeof c.extract == "function" ? "" : "json"), x = new e.XMLHttpRequest, S = !1, $ = !1, v = x, b, R = x.abort;
            x.abort = function() {
                S = !0,
                R.call(this)
            }
            ,
            x.open(p, l, c.async !== !1, typeof c.user == "string" ? c.user : void 0, typeof c.password == "string" ? c.password : void 0),
            m && h != null && !o(c, "content-type") && x.setRequestHeader("Content-Type", "application/json; charset=utf-8"),
            typeof c.deserialize != "function" && !o(c, "accept") && x.setRequestHeader("Accept", "application/json, text/*"),
            c.withCredentials && (x.withCredentials = c.withCredentials),
            c.timeout && (x.timeout = c.timeout),
            x.responseType = w;
            for (var G in c.headers)
                Br.call(c.headers, G) && x.setRequestHeader(G, c.headers[G]);
            x.onreadystatechange = function(X) {
                if (!S && X.target.readyState === 4)
                    try {
                        var W = X.target.status >= 200 && X.target.status < 300 || X.target.status === 304 || /^file:\/\//i.test(l), M = X.target.response, N;
                        if (w === "json") {
                            if (!X.target.responseType && typeof c.extract != "function")
                                try {
                                    M = JSON.parse(X.target.responseText)
                                } catch {
                                    M = null
                                }
                        } else
                            (!w || w === "text") && M == null && (M = X.target.responseText);
                        if (typeof c.extract == "function" ? (M = c.extract(X.target, c),
                        W = !0) : typeof c.deserialize == "function" && (M = c.deserialize(M)),
                        W)
                            a(M);
                        else {
                            var H = function() {
                                try {
                                    N = X.target.responseText
                                } catch {
                                    N = M
                                }
                                var _ = new Error(N);
                                _.code = X.target.status,
                                _.response = M,
                                u(_)
                            };
                            x.status === 0 ? setTimeout(function() {
                                $ || H()
                            }) : H()
                        }
                    } catch (_) {
                        u(_)
                    }
            }
            ,
            x.ontimeout = function(X) {
                $ = !0;
                var W = new Error("Request timed out");
                W.code = X.target.status,
                u(W)
            }
            ,
            typeof c.config == "function" && (x = c.config(x, c, l) || x,
            x !== v && (b = x.abort,
            x.abort = function() {
                S = !0,
                b.call(this)
            }
            )),
            h == null ? x.send() : typeof c.serialize == "function" ? x.send(c.serialize(h)) : h instanceof e.FormData || h instanceof e.URLSearchParams ? x.send(h) : x.send(JSON.stringify(h))
        }),
        jsonp: r(function(l, c, a, u) {
            var p = c.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + n++
              , h = e.document.createElement("script");
            e[p] = function(m) {
                delete e[p],
                h.parentNode.removeChild(h),
                a(m)
            }
            ,
            h.onerror = function() {
                delete e[p],
                h.parentNode.removeChild(h),
                u(new Error("JSONP request failed"))
            }
            ,
            h.src = l + (l.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(c.callbackKey || "callback") + "=" + encodeURIComponent(p),
            e.document.documentElement.appendChild(h)
        })
    }
}, Su = aa, Iu = js, Tu = bu(typeof window < "u" ? window : null, Su, Iu.redraw), ts, Hr;
function ua() {
    if (Hr)
        return ts;
    Hr = 1;
    function e(t) {
        try {
            return decodeURIComponent(t)
        } catch {
            return t
        }
    }
    return ts = function(t) {
        if (t === "" || t == null)
            return {};
        t.charAt(0) === "?" && (t = t.slice(1));
        for (var i = t.split("&"), n = {}, s = {}, r = 0; r < i.length; r++) {
            var o = i[r].split("=")
              , l = e(o[0])
              , c = o.length === 2 ? e(o[1]) : "";
            c === "true" ? c = !0 : c === "false" && (c = !1);
            var a = l.split(/\]\[?|\[/)
              , u = s;
            l.indexOf("[") > -1 && a.pop();
            for (var p = 0; p < a.length; p++) {
                var h = a[p]
                  , m = a[p + 1]
                  , w = m == "" || !isNaN(parseInt(m, 10));
                if (h === "") {
                    var l = a.slice(0, p).join();
                    n[l] == null && (n[l] = Array.isArray(u) ? u.length : 0),
                    h = n[l]++
                } else if (h === "__proto__")
                    break;
                if (p === a.length - 1)
                    u[h] = c;
                else {
                    var x = Object.getOwnPropertyDescriptor(u, h);
                    x != null && (x = x.value),
                    x == null && (u[h] = x = w ? [] : {}),
                    u = x
                }
            }
        }
        return s
    }
    ,
    ts
}
var is, Lr;
function tr() {
    if (Lr)
        return is;
    Lr = 1;
    var e = ua();
    return is = function(t) {
        var i = t.indexOf("?")
          , n = t.indexOf("#")
          , s = n < 0 ? t.length : n
          , r = i < 0 ? s : i
          , o = t.slice(0, r).replace(/\/{2,}/g, "/");
        return o ? (o[0] !== "/" && (o = "/" + o),
        o.length > 1 && o[o.length - 1] === "/" && (o = o.slice(0, -1))) : o = "/",
        {
            path: o,
            params: i < 0 ? {} : e(t.slice(i + 1, s))
        }
    }
    ,
    is
}
var ns, Fr;
function Mu() {
    if (Fr)
        return ns;
    Fr = 1;
    var e = tr();
    return ns = function(t) {
        var i = e(t)
          , n = Object.keys(i.params)
          , s = []
          , r = new RegExp("^" + i.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function(o, l, c) {
            return l == null ? "\\" + o : (s.push({
                k: l,
                r: c === "..."
            }),
            c === "..." ? "(.*)" : c === "." ? "([^/]+)\\." : "([^/]+)" + (c || ""))
        }) + "$");
        return function(o) {
            for (var l = 0; l < n.length; l++)
                if (i.params[n[l]] !== o.params[n[l]])
                    return !1;
            if (!s.length)
                return r.test(o.path);
            var c = r.exec(o.path);
            if (c == null)
                return !1;
            for (var l = 0; l < s.length; l++)
                o.params[s[l].k] = s[l].r ? c[l + 1] : decodeURIComponent(c[l + 1]);
            return !0
        }
    }
    ,
    ns
}
var ss, Vr;
function fa() {
    if (Vr)
        return ss;
    Vr = 1;
    var e = Dn
      , t = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
    return ss = function(i, n) {
        var s = {};
        if (n != null)
            for (var r in i)
                e.call(i, r) && !t.test(r) && n.indexOf(r) < 0 && (s[r] = i[r]);
        else
            for (var r in i)
                e.call(i, r) && !t.test(r) && (s[r] = i[r]);
        return s
    }
    ,
    ss
}
var rs, Nr;
function Eu() {
    if (Nr)
        return rs;
    Nr = 1;
    var e = Tt()
      , t = ra
      , i = aa
      , n = er()
      , s = tr()
      , r = Mu()
      , o = ha()
      , l = fa()
      , c = {};
    function a(u) {
        try {
            return decodeURIComponent(u)
        } catch {
            return u
        }
    }
    return rs = function(u, p) {
        var h = u == null ? null : typeof u.setImmediate == "function" ? u.setImmediate : u.setTimeout, m = i.resolve(), w = !1, x = !1, S = 0, $, v, b = c, R, G, X, W, M = {
            onbeforeupdate: function() {
                return S = S ? 2 : 1,
                !(!S || c === b)
            },
            onremove: function() {
                u.removeEventListener("popstate", _, !1),
                u.removeEventListener("hashchange", H, !1)
            },
            view: function() {
                if (!(!S || c === b)) {
                    var U = [e(R, G.key, G)];
                    return b && (U = b.render(U[0])),
                    U
                }
            }
        }, N = z.SKIP = {};
        function H() {
            w = !1;
            var U = u.location.hash;
            z.prefix[0] !== "#" && (U = u.location.search + U,
            z.prefix[0] !== "?" && (U = u.location.pathname + U,
            U[0] !== "/" && (U = "/" + U)));
            var Y = U.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, a).slice(z.prefix.length)
              , K = s(Y);
            o(K.params, u.history.state);
            function ie(J) {
                console.error(J),
                D(v, null, {
                    replace: !0
                })
            }
            ne(0);
            function ne(J) {
                for (; J < $.length; J++)
                    if ($[J].check(K)) {
                        var Ee = $[J].component
                          , st = $[J].route
                          , Ge = Ee
                          , j = W = function(Be) {
                            if (j === W) {
                                if (Be === N)
                                    return ne(J + 1);
                                R = Be != null && (typeof Be.view == "function" || typeof Be == "function") ? Be : "div",
                                G = K.params,
                                X = Y,
                                W = null,
                                b = Ee.render ? Ee : null,
                                S === 2 ? p.redraw() : (S = 2,
                                p.redraw.sync())
                            }
                        }
                        ;
                        Ee.view || typeof Ee == "function" ? (Ee = {},
                        j(Ge)) : Ee.onmatch ? m.then(function() {
                            return Ee.onmatch(K.params, Y, st)
                        }).then(j, Y === v ? null : ie) : j("div");
                        return
                    }
                if (Y === v)
                    throw new Error("Could not resolve default route " + v + ".");
                D(v, null, {
                    replace: !0
                })
            }
        }
        function _() {
            w || (w = !0,
            h(H))
        }
        function D(U, Y, K) {
            if (U = n(U, Y),
            x) {
                _();
                var ie = K ? K.state : null
                  , ne = K ? K.title : null;
                K && K.replace ? u.history.replaceState(ie, ne, z.prefix + U) : u.history.pushState(ie, ne, z.prefix + U)
            } else
                u.location.href = z.prefix + U
        }
        function z(U, Y, K) {
            if (!U)
                throw new TypeError("DOM element being rendered to does not exist.");
            if ($ = Object.keys(K).map(function(ne) {
                if (ne[0] !== "/")
                    throw new SyntaxError("Routes must start with a '/'.");
                if (/:([^\/\.-]+)(\.{3})?:/.test(ne))
                    throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
                return {
                    route: ne,
                    component: K[ne],
                    check: r(ne)
                }
            }),
            v = Y,
            Y != null) {
                var ie = s(Y);
                if (!$.some(function(ne) {
                    return ne.check(ie)
                }))
                    throw new ReferenceError("Default route doesn't match any known routes.")
            }
            typeof u.history.pushState == "function" ? u.addEventListener("popstate", _, !1) : z.prefix[0] === "#" && u.addEventListener("hashchange", H, !1),
            x = !0,
            p.mount(U, M),
            H()
        }
        return z.set = function(U, Y, K) {
            W != null && (K = K || {},
            K.replace = !0),
            W = null,
            D(U, Y, K)
        }
        ,
        z.get = function() {
            return X
        }
        ,
        z.prefix = "#!",
        z.Link = {
            view: function(U) {
                var Y = t(U.attrs.selector || "a", l(U.attrs, ["options", "params", "selector", "onclick"]), U.children), K, ie, ne;
                return (Y.attrs.disabled = !!Y.attrs.disabled) ? (Y.attrs.href = null,
                Y.attrs["aria-disabled"] = "true") : (K = U.attrs.options,
                ie = U.attrs.onclick,
                ne = n(Y.attrs.href, U.attrs.params),
                Y.attrs.href = z.prefix + ne,
                Y.attrs.onclick = function(J) {
                    var Ee;
                    typeof ie == "function" ? Ee = ie.call(J.currentTarget, J) : ie == null || typeof ie != "object" || typeof ie.handleEvent == "function" && ie.handleEvent(J),
                    Ee !== !1 && !J.defaultPrevented && (J.button === 0 || J.which === 0 || J.which === 1) && (!J.currentTarget.target || J.currentTarget.target === "_self") && !J.ctrlKey && !J.metaKey && !J.shiftKey && !J.altKey && (J.preventDefault(),
                    J.redraw = !1,
                    z.set(ne, null, K))
                }
                ),
                Y
            }
        },
        z.param = function(U) {
            return G && U != null ? G[U] : G
        }
        ,
        z
    }
    ,
    rs
}
var os, Ur;
function Cu() {
    if (Ur)
        return os;
    Ur = 1;
    var e = js;
    return os = Eu()(typeof window < "u" ? window : null, e),
    os
}
var On = yu
  , da = Tu
  , pa = js
  , Ae = function() {
    return On.apply(this, arguments)
};
Ae.m = On;
Ae.trust = On.trust;
Ae.fragment = On.fragment;
Ae.Fragment = "[";
Ae.mount = pa.mount;
Ae.route = Cu();
Ae.render = la();
Ae.redraw = pa.redraw;
Ae.request = da.request;
Ae.jsonp = da.jsonp;
Ae.parseQueryString = ua();
Ae.buildQueryString = ca();
Ae.parsePathname = tr();
Ae.buildPathname = er();
Ae.vnode = Tt();
Ae.PromisePolyfill = oa();
Ae.censor = fa();
var Pu = Ae;
const xt = An(Pu);
function ze(e, t, i, n, s) {
    this.debugLog = !1,
    this.baseUrl = e,
    this.lobbySize = i,
    this.devPort = t,
    this.lobbySpread = n,
    this.rawIPs = !!s,
    this.server = void 0,
    this.gameIndex = void 0,
    this.callback = void 0,
    this.errorCallback = void 0
}
ze.prototype.regionInfo = {
    0: {
        name: "Local",
        latitude: 0,
        longitude: 0
    },
    "us-east": {
        name: "Miami",
        latitude: 40.1393329,
        longitude: -75.8521818
    },
    miami: {
        name: "Miami",
        latitude: 40.1393329,
        longitude: -75.8521818
    },
    "us-west": {
        name: "Silicon Valley",
        latitude: 47.6149942,
        longitude: -122.4759879
    },
    siliconvalley: {
        name: "Silicon Valley",
        latitude: 47.6149942,
        longitude: -122.4759879
    },
    gb: {
        name: "London",
        latitude: 51.5283063,
        longitude: -.382486
    },
    london: {
        name: "London",
        latitude: 51.5283063,
        longitude: -.382486
    },
    "eu-west": {
        name: "Frankfurt",
        latitude: 50.1211273,
        longitude: 8.496137
    },
    frankfurt: {
        name: "Frankfurt",
        latitude: 50.1211273,
        longitude: 8.496137
    },
    au: {
        name: "Sydney",
        latitude: -33.8479715,
        longitude: 150.651084
    },
    sydney: {
        name: "Sydney",
        latitude: -33.8479715,
        longitude: 150.651084
    },
    saopaulo: {
        name: "São Paulo",
        latitude: 23.5558,
        longitude: 46.6396
    },
    sg: {
        name: "Singapore",
        latitude: 1.3147268,
        longitude: 103.7065876
    },
    singapore: {
        name: "Singapore",
        latitude: 1.3147268,
        longitude: 103.7065876
    }
};
ze.prototype.start = function(e, t, i, n) {
    if (this.callback = t,
    this.errorCallback = i,
    n)
        return t();
    const s = this.parseServerQuery(e);
    s && s.length > 0 ? (this.log("Found server in query."),
    this.password = s[3],
    this.connect(s[0], s[1], s[2])) : this.errorCallback("Unable to find server")
}
;
ze.prototype.parseServerQuery = function(e) {
    const t = new URLSearchParams(location.search,!0)
      , i = e || t.get("server");
    if (typeof i != "string")
        return [];
    const [n,s] = i.split(":");
    return [n, s, t.get("password")]
}
;
ze.prototype.findServer = function(e, t) {
    var i = this.servers[e];
    for (let n = 0; n < i.length; n++) {
        const s = i[n];
        if (s.name === t)
            return s
    }
    console.warn("Could not find server in region " + e + " with serverName " + t + ".")
}
;
ze.prototype.seekServer = function(e, t, i) {
    i == null && (i = "random"),
    t == null && (t = !1);
    const n = ["random"]
      , s = this.lobbySize
      , r = this.lobbySpread
      , o = this.servers[e].flatMap(function(h) {
        let m = 0;
        return h.games.map(function(w) {
            const x = m++;
            return {
                region: h.region,
                index: h.index * h.games.length + x,
                gameIndex: x,
                gameCount: h.games.length,
                playerCount: w.playerCount,
                playerCapacity: w.playerCapacity,
                isPrivate: w.isPrivate
            }
        })
    }).filter(function(h) {
        return !h.isPrivate
    }).filter(function(h) {
        return t ? h.playerCount == 0 && h.gameIndex >= h.gameCount / 2 : !0
    }).filter(function(h) {
        return i == "random" ? !0 : n[h.index % n.length].key == i
    }).sort(function(h, m) {
        return m.playerCount - h.playerCount
    }).filter(function(h) {
        return h.playerCount < s
    });
    if (t && o.reverse(),
    o.length == 0) {
        this.errorCallback("No open servers.");
        return
    }
    const l = Math.min(r, o.length);
    var u = Math.floor(Math.random() * l);
    u = Math.min(u, o.length - 1);
    const c = o[u]
      , a = c.region;
    var u = Math.floor(c.index / c.gameCount);
    const p = c.index % c.gameCount;
    return this.log("Found server."),
    [a, u, p]
}
;
ze.prototype.connect = function(e, t, i) {
    if (this.connected)
        return;
    const n = this.findServer(e, t);
    if (n == null) {
        this.errorCallback("Failed to find server for region " + e + " and serverName " + t);
        return
    }
    if (this.log("Connecting to server", n, "with game index", i),
    n.playerCount >= n.playerCapacity) {
        this.errorCallback("Server is already full.");
        return
    }
    window.history.replaceState(document.title, document.title, this.generateHref(e, t, this.password)),
    this.server = n,
    this.gameIndex = i,
    this.log("Calling callback with address", this.serverAddress(n), "on port", this.serverPort(n)),
    this.callback(this.serverAddress(n), this.serverPort(n), i),
    Ai && clearInterval(Ai)
}
;
ze.prototype.switchServer = function(e, t) {
    this.switchingServers = !0,
    window.location = this.generateHref(e, t, null)
}
;
ze.prototype.generateHref = function(e, t, i) {
    let n = window.location.href.split("?")[0];
    return n += "?server=" + e + ":" + t,
    i && (n += "&password=" + encodeURIComponent(i)),
    n
}
;
ze.prototype.serverAddress = function(e) {
    return e.region == 0 ? "localhost" : e.key + "." + e.region + "." + this.baseUrl
}
;
ze.prototype.serverPort = function(e) {
    return e.port
}
;
let Ai;
function $u(e) {
    e = e.filter(s => s.playerCount !== s.playerCapacity);
    const t = Math.min(...e.map(s => s.ping || 1 / 0))
      , i = e.filter(s => s.ping === t);
    return !i.length > 0 ? null : i.reduce( (s, r) => s.playerCount > r.playerCount ? s : r)
}
ze.prototype.processServers = function(e) {
    return Ai && clearInterval(Ai),
    new Promise(t => {
        const i = {}
          , n = c => {
            const a = i[c]
              , u = a[0];
            let p = this.serverAddress(u);
            const h = this.serverPort(u);
            h && (p += `:${h}`);
            const m = `https://${p}/ping`
              , w = new Date().getTime();
            return Promise.race([fetch(m).then( () => {
                const x = new Date().getTime() - w;
                a.forEach(S => {
                    S.pings = S.pings ?? [],
                    S.pings.push(x),
                    S.pings.length > 10 && S.pings.shift(),
                    S.ping = Math.floor(S.pings.reduce( ($, v) => $ + v, 0) / S.pings.length)
                }
                )
            }
            ).catch( () => {}
            ), new Promise(x => setTimeout( () => x(), 100))])
        }
          , s = async () => {
            await Promise.all(Object.keys(i).map(n)),
            window.blockRedraw || xt.redraw()
        }
        ;
        e.forEach(c => {
            i[c.region] = i[c.region] || [],
            i[c.region].push(c)
        }
        );
        for (const c in i)
            i[c] = i[c].sort(function(a, u) {
                return u.playerCount - a.playerCount
            });
        this.servers = i;
        let r;
        const [o,l] = this.parseServerQuery();
        e.forEach(c => {
            o === c.region && l === c.name && (c.selected = !0,
            r = c)
        }
        ),
        s().then(s).then( () => {
            if (r)
                return;
            let c = $u(e);
            c || (c = e[0]),
            c && (c.selected = !0,
            window.history.replaceState(document.title, document.title, this.generateHref(c.region, c.name, this.password))),
            window.blockRedraw || xt.redraw()
        }
        ).then(s).catch(c => {}
        ).finally(t),
        Ai = setInterval(s, 5e3)
    }
    )
}
;
ze.prototype.ipToHex = function(e) {
    return e.split(".").map(i => ("00" + parseInt(i).toString(16)).substr(-2)).join("").toLowerCase()
}
;
ze.prototype.hashIP = function(e) {
    return su(this.ipToHex(e))
}
;
ze.prototype.log = function() {
    if (this.debugLog)
        return console.log.apply(void 0, arguments);
    if (console.verbose)
        return console.verbose.apply(void 0, arguments)
}
;
ze.prototype.stripRegion = function(e) {
    return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)),
    e
}
;
const Ru = function(e, t) {
    return e.concat(t)
}
  , Au = function(e, t) {
    return t.map(e).reduce(Ru, [])
};
Array.prototype.flatMap = function(e) {
    return Au(e, this)
}
;
const hn = (e, t) => {
    const i = t.x - e.x
      , n = t.y - e.y;
    return Math.sqrt(i * i + n * n)
}
  , Du = (e, t) => {
    const i = t.x - e.x
      , n = t.y - e.y;
    return _u(Math.atan2(n, i))
}
  , Ou = (e, t, i) => {
    const n = {
        x: 0,
        y: 0
    };
    return i = Ps(i),
    n.x = e.x - t * Math.cos(i),
    n.y = e.y - t * Math.sin(i),
    n
}
  , Ps = e => e * (Math.PI / 180)
  , _u = e => e * (180 / Math.PI)
  , zu = e => isNaN(e.buttons) ? e.pressure !== 0 : e.buttons !== 0
  , as = new Map
  , Wr = e => {
    as.has(e) && clearTimeout(as.get(e)),
    as.set(e, setTimeout(e, 100))
}
  , wn = (e, t, i) => {
    const n = t.split(/[ ,]+/g);
    let s;
    for (let r = 0; r < n.length; r += 1)
        s = n[r],
        e.addEventListener ? e.addEventListener(s, i, !1) : e.attachEvent && e.attachEvent(s, i)
}
  , Xr = (e, t, i) => {
    const n = t.split(/[ ,]+/g);
    let s;
    for (let r = 0; r < n.length; r += 1)
        s = n[r],
        e.removeEventListener ? e.removeEventListener(s, i) : e.detachEvent && e.detachEvent(s, i)
}
  , ma = e => (e.preventDefault(),
e.type.match(/^touch/) ? e.changedTouches : e)
  , qr = () => {
    const e = window.pageXOffset !== void 0 ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft
      , t = window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return {
        x: e,
        y: t
    }
}
  , Gr = (e, t) => {
    t.top || t.right || t.bottom || t.left ? (e.style.top = t.top,
    e.style.right = t.right,
    e.style.bottom = t.bottom,
    e.style.left = t.left) : (e.style.left = t.x + "px",
    e.style.top = t.y + "px")
}
  , ir = (e, t, i) => {
    const n = ga(e);
    for (let s in n)
        if (n.hasOwnProperty(s))
            if (typeof t == "string")
                n[s] = t + " " + i;
            else {
                let r = "";
                for (let o = 0, l = t.length; o < l; o += 1)
                    r += t[o] + " " + i + ", ";
                n[s] = r.slice(0, -2)
            }
    return n
}
  , Bu = (e, t) => {
    const i = ga(e);
    for (let n in i)
        i.hasOwnProperty(n) && (i[n] = t);
    return i
}
  , ga = e => {
    const t = {};
    return t[e] = "",
    ["webkit", "Moz", "o"].forEach(function(n) {
        t[n + e.charAt(0).toUpperCase() + e.slice(1)] = ""
    }),
    t
}
  , ls = (e, t) => {
    for (let i in t)
        t.hasOwnProperty(i) && (e[i] = t[i]);
    return e
}
  , Hu = (e, t) => {
    const i = {};
    for (let n in e)
        e.hasOwnProperty(n) && t.hasOwnProperty(n) ? i[n] = t[n] : e.hasOwnProperty(n) && (i[n] = e[n]);
    return i
}
  , $s = (e, t) => {
    if (e.length)
        for (let i = 0, n = e.length; i < n; i += 1)
            t(e[i]);
    else
        t(e)
}
  , Lu = (e, t, i) => ({
    x: Math.min(Math.max(e.x, t.x - i), t.x + i),
    y: Math.min(Math.max(e.y, t.y - i), t.y + i)
});
var Fu = "ontouchstart"in window, Vu = !!window.PointerEvent, Nu = !!window.MSPointerEvent, Ti = {
    touch: {
        start: "touchstart",
        move: "touchmove",
        end: "touchend, touchcancel"
    },
    mouse: {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
    },
    pointer: {
        start: "pointerdown",
        move: "pointermove",
        end: "pointerup, pointercancel"
    },
    MSPointer: {
        start: "MSPointerDown",
        move: "MSPointerMove",
        end: "MSPointerUp"
    }
}, ri, Vi = {};
Vu ? ri = Ti.pointer : Nu ? ri = Ti.MSPointer : Fu ? (ri = Ti.touch,
Vi = Ti.mouse) : ri = Ti.mouse;
function gt() {}
gt.prototype.on = function(e, t) {
    var i = this, n = e.split(/[ ,]+/g), s;
    i._handlers_ = i._handlers_ || {};
    for (var r = 0; r < n.length; r += 1)
        s = n[r],
        i._handlers_[s] = i._handlers_[s] || [],
        i._handlers_[s].push(t);
    return i
}
;
gt.prototype.off = function(e, t) {
    var i = this;
    return i._handlers_ = i._handlers_ || {},
    e === void 0 ? i._handlers_ = {} : t === void 0 ? i._handlers_[e] = null : i._handlers_[e] && i._handlers_[e].indexOf(t) >= 0 && i._handlers_[e].splice(i._handlers_[e].indexOf(t), 1),
    i
}
;
gt.prototype.trigger = function(e, t) {
    var i = this, n = e.split(/[ ,]+/g), s;
    i._handlers_ = i._handlers_ || {};
    for (var r = 0; r < n.length; r += 1)
        s = n[r],
        i._handlers_[s] && i._handlers_[s].length && i._handlers_[s].forEach(function(o) {
            o.call(i, {
                type: s,
                target: i
            }, t)
        })
}
;
gt.prototype.config = function(e) {
    var t = this;
    t.options = t.defaults || {},
    e && (t.options = Hu(t.options, e))
}
;
gt.prototype.bindEvt = function(e, t) {
    var i = this;
    return i._domHandlers_ = i._domHandlers_ || {},
    i._domHandlers_[t] = function() {
        typeof i["on" + t] == "function" ? i["on" + t].apply(i, arguments) : console.warn('[WARNING] : Missing "on' + t + '" handler.')
    }
    ,
    wn(e, ri[t], i._domHandlers_[t]),
    Vi[t] && wn(e, Vi[t], i._domHandlers_[t]),
    i
}
;
gt.prototype.unbindEvt = function(e, t) {
    var i = this;
    return i._domHandlers_ = i._domHandlers_ || {},
    Xr(e, ri[t], i._domHandlers_[t]),
    Vi[t] && Xr(e, Vi[t], i._domHandlers_[t]),
    delete i._domHandlers_[t],
    this
}
;
function Me(e, t) {
    return this.identifier = t.identifier,
    this.position = t.position,
    this.frontPosition = t.frontPosition,
    this.collection = e,
    this.defaults = {
        size: 100,
        threshold: .1,
        color: "white",
        fadeTime: 250,
        dataOnly: !1,
        restJoystick: !0,
        restOpacity: .5,
        mode: "dynamic",
        zone: document.body,
        lockX: !1,
        lockY: !1,
        shape: "circle"
    },
    this.config(t),
    this.options.mode === "dynamic" && (this.options.restOpacity = 0),
    this.id = Me.id,
    Me.id += 1,
    this.buildEl().stylize(),
    this.instance = {
        el: this.ui.el,
        on: this.on.bind(this),
        off: this.off.bind(this),
        show: this.show.bind(this),
        hide: this.hide.bind(this),
        add: this.addToDom.bind(this),
        remove: this.removeFromDom.bind(this),
        destroy: this.destroy.bind(this),
        setPosition: this.setPosition.bind(this),
        resetDirection: this.resetDirection.bind(this),
        computeDirection: this.computeDirection.bind(this),
        trigger: this.trigger.bind(this),
        position: this.position,
        frontPosition: this.frontPosition,
        ui: this.ui,
        identifier: this.identifier,
        id: this.id,
        options: this.options
    },
    this.instance
}
Me.prototype = new gt;
Me.constructor = Me;
Me.id = 0;
Me.prototype.buildEl = function(e) {
    return this.ui = {},
    this.options.dataOnly ? this : (this.ui.el = document.createElement("div"),
    this.ui.back = document.createElement("div"),
    this.ui.front = document.createElement("div"),
    this.ui.el.className = "nipple collection_" + this.collection.id,
    this.ui.back.className = "back",
    this.ui.front.className = "front",
    this.ui.el.setAttribute("id", "nipple_" + this.collection.id + "_" + this.id),
    this.ui.el.appendChild(this.ui.back),
    this.ui.el.appendChild(this.ui.front),
    this)
}
;
Me.prototype.stylize = function() {
    if (this.options.dataOnly)
        return this;
    var e = this.options.fadeTime + "ms"
      , t = Bu("borderRadius", "50%")
      , i = ir("transition", "opacity", e)
      , n = {};
    return n.el = {
        position: "absolute",
        opacity: this.options.restOpacity,
        display: "block",
        zIndex: 999
    },
    n.back = {
        position: "absolute",
        display: "block",
        width: this.options.size + "px",
        height: this.options.size + "px",
        marginLeft: -this.options.size / 2 + "px",
        marginTop: -this.options.size / 2 + "px",
        background: this.options.color,
        opacity: ".5"
    },
    n.front = {
        width: this.options.size / 2 + "px",
        height: this.options.size / 2 + "px",
        position: "absolute",
        display: "block",
        marginLeft: -this.options.size / 4 + "px",
        marginTop: -this.options.size / 4 + "px",
        background: this.options.color,
        opacity: ".5",
        transform: "translate(0px, 0px)"
    },
    ls(n.el, i),
    this.options.shape === "circle" && ls(n.back, t),
    ls(n.front, t),
    this.applyStyles(n),
    this
}
;
Me.prototype.applyStyles = function(e) {
    for (var t in this.ui)
        if (this.ui.hasOwnProperty(t))
            for (var i in e[t])
                this.ui[t].style[i] = e[t][i];
    return this
}
;
Me.prototype.addToDom = function() {
    return this.options.dataOnly || document.body.contains(this.ui.el) ? this : (this.options.zone.appendChild(this.ui.el),
    this)
}
;
Me.prototype.removeFromDom = function() {
    return this.options.dataOnly || !document.body.contains(this.ui.el) ? this : (this.options.zone.removeChild(this.ui.el),
    this)
}
;
Me.prototype.destroy = function() {
    clearTimeout(this.removeTimeout),
    clearTimeout(this.showTimeout),
    clearTimeout(this.restTimeout),
    this.trigger("destroyed", this.instance),
    this.removeFromDom(),
    this.off()
}
;
Me.prototype.show = function(e) {
    var t = this;
    return t.options.dataOnly || (clearTimeout(t.removeTimeout),
    clearTimeout(t.showTimeout),
    clearTimeout(t.restTimeout),
    t.addToDom(),
    t.restCallback(),
    setTimeout(function() {
        t.ui.el.style.opacity = 1
    }, 0),
    t.showTimeout = setTimeout(function() {
        t.trigger("shown", t.instance),
        typeof e == "function" && e.call(this)
    }, t.options.fadeTime)),
    t
}
;
Me.prototype.hide = function(e) {
    var t = this;
    if (t.options.dataOnly)
        return t;
    if (t.ui.el.style.opacity = t.options.restOpacity,
    clearTimeout(t.removeTimeout),
    clearTimeout(t.showTimeout),
    clearTimeout(t.restTimeout),
    t.removeTimeout = setTimeout(function() {
        var i = t.options.mode === "dynamic" ? "none" : "block";
        t.ui.el.style.display = i,
        typeof e == "function" && e.call(t),
        t.trigger("hidden", t.instance)
    }, t.options.fadeTime),
    t.options.restJoystick) {
        const i = t.options.restJoystick
          , n = {};
        n.x = i === !0 || i.x !== !1 ? 0 : t.instance.frontPosition.x,
        n.y = i === !0 || i.y !== !1 ? 0 : t.instance.frontPosition.y,
        t.setPosition(e, n)
    }
    return t
}
;
Me.prototype.setPosition = function(e, t) {
    var i = this;
    i.frontPosition = {
        x: t.x,
        y: t.y
    };
    var n = i.options.fadeTime + "ms"
      , s = {};
    s.front = ir("transition", ["transform"], n);
    var r = {
        front: {}
    };
    r.front = {
        transform: "translate(" + i.frontPosition.x + "px," + i.frontPosition.y + "px)"
    },
    i.applyStyles(s),
    i.applyStyles(r),
    i.restTimeout = setTimeout(function() {
        typeof e == "function" && e.call(i),
        i.restCallback()
    }, i.options.fadeTime)
}
;
Me.prototype.restCallback = function() {
    var e = this
      , t = {};
    t.front = ir("transition", "none", ""),
    e.applyStyles(t),
    e.trigger("rested", e.instance)
}
;
Me.prototype.resetDirection = function() {
    this.direction = {
        x: !1,
        y: !1,
        angle: !1
    }
}
;
Me.prototype.computeDirection = function(e) {
    var t = e.angle.radian, i = Math.PI / 4, n = Math.PI / 2, s, r, o;
    if (t > i && t < i * 3 && !e.lockX ? s = "up" : t > -i && t <= i && !e.lockY ? s = "left" : t > -i * 3 && t <= -i && !e.lockX ? s = "down" : e.lockY || (s = "right"),
    e.lockY || (t > -n && t < n ? r = "left" : r = "right"),
    e.lockX || (t > 0 ? o = "up" : o = "down"),
    e.force > this.options.threshold) {
        var l = {}, c;
        for (c in this.direction)
            this.direction.hasOwnProperty(c) && (l[c] = this.direction[c]);
        var a = {};
        this.direction = {
            x: r,
            y: o,
            angle: s
        },
        e.direction = this.direction;
        for (c in l)
            l[c] === this.direction[c] && (a[c] = !0);
        if (a.x && a.y && a.angle)
            return e;
        (!a.x || !a.y) && this.trigger("plain", e),
        a.x || this.trigger("plain:" + r, e),
        a.y || this.trigger("plain:" + o, e),
        a.angle || this.trigger("dir dir:" + s, e)
    } else
        this.resetDirection();
    return e
}
;
function ve(e, t) {
    var i = this;
    i.nipples = [],
    i.idles = [],
    i.actives = [],
    i.ids = [],
    i.pressureIntervals = {},
    i.manager = e,
    i.id = ve.id,
    ve.id += 1,
    i.defaults = {
        zone: document.body,
        multitouch: !1,
        maxNumberOfNipples: 10,
        mode: "dynamic",
        position: {
            top: 0,
            left: 0
        },
        catchDistance: 200,
        size: 100,
        threshold: .1,
        color: "white",
        fadeTime: 250,
        dataOnly: !1,
        restJoystick: !0,
        restOpacity: .5,
        lockX: !1,
        lockY: !1,
        shape: "circle",
        dynamicPage: !1,
        follow: !1
    },
    i.config(t),
    (i.options.mode === "static" || i.options.mode === "semi") && (i.options.multitouch = !1),
    i.options.multitouch || (i.options.maxNumberOfNipples = 1);
    const n = getComputedStyle(i.options.zone.parentElement);
    return n && n.display === "flex" && (i.parentIsFlex = !0),
    i.updateBox(),
    i.prepareNipples(),
    i.bindings(),
    i.begin(),
    i.nipples
}
ve.prototype = new gt;
ve.constructor = ve;
ve.id = 0;
ve.prototype.prepareNipples = function() {
    var e = this
      , t = e.nipples;
    t.on = e.on.bind(e),
    t.off = e.off.bind(e),
    t.options = e.options,
    t.destroy = e.destroy.bind(e),
    t.ids = e.ids,
    t.id = e.id,
    t.processOnMove = e.processOnMove.bind(e),
    t.processOnEnd = e.processOnEnd.bind(e),
    t.get = function(i) {
        if (i === void 0)
            return t[0];
        for (var n = 0, s = t.length; n < s; n += 1)
            if (t[n].identifier === i)
                return t[n];
        return !1
    }
}
;
ve.prototype.bindings = function() {
    var e = this;
    e.bindEvt(e.options.zone, "start"),
    e.options.zone.style.touchAction = "none",
    e.options.zone.style.msTouchAction = "none"
}
;
ve.prototype.begin = function() {
    var e = this
      , t = e.options;
    if (t.mode === "static") {
        var i = e.createNipple(t.position, e.manager.getIdentifier());
        i.add(),
        e.idles.push(i)
    }
}
;
ve.prototype.createNipple = function(e, t) {
    var i = this
      , n = i.manager.scroll
      , s = {}
      , r = i.options
      , o = {
        x: i.parentIsFlex ? n.x : n.x + i.box.left,
        y: i.parentIsFlex ? n.y : n.y + i.box.top
    };
    if (e.x && e.y)
        s = {
            x: e.x - o.x,
            y: e.y - o.y
        };
    else if (e.top || e.right || e.bottom || e.left) {
        var l = document.createElement("DIV");
        l.style.display = "hidden",
        l.style.top = e.top,
        l.style.right = e.right,
        l.style.bottom = e.bottom,
        l.style.left = e.left,
        l.style.position = "absolute",
        r.zone.appendChild(l);
        var c = l.getBoundingClientRect();
        r.zone.removeChild(l),
        s = e,
        e = {
            x: c.left + n.x,
            y: c.top + n.y
        }
    }
    var a = new Me(i,{
        color: r.color,
        size: r.size,
        threshold: r.threshold,
        fadeTime: r.fadeTime,
        dataOnly: r.dataOnly,
        restJoystick: r.restJoystick,
        restOpacity: r.restOpacity,
        mode: r.mode,
        identifier: t,
        position: e,
        zone: r.zone,
        frontPosition: {
            x: 0,
            y: 0
        },
        shape: r.shape
    });
    return r.dataOnly || (Gr(a.ui.el, s),
    Gr(a.ui.front, a.frontPosition)),
    i.nipples.push(a),
    i.trigger("added " + a.identifier + ":added", a),
    i.manager.trigger("added " + a.identifier + ":added", a),
    i.bindNipple(a),
    a
}
;
ve.prototype.updateBox = function() {
    var e = this;
    e.box = e.options.zone.getBoundingClientRect()
}
;
ve.prototype.bindNipple = function(e) {
    var t = this, i, n = function(s, r) {
        i = s.type + " " + r.id + ":" + s.type,
        t.trigger(i, r)
    };
    e.on("destroyed", t.onDestroyed.bind(t)),
    e.on("shown hidden rested dir plain", n),
    e.on("dir:up dir:right dir:down dir:left", n),
    e.on("plain:up plain:right plain:down plain:left", n)
}
;
ve.prototype.pressureFn = function(e, t, i) {
    var n = this
      , s = 0;
    clearInterval(n.pressureIntervals[i]),
    n.pressureIntervals[i] = setInterval((function() {
        var r = e.force || e.pressure || e.webkitForce || 0;
        r !== s && (t.trigger("pressure", r),
        n.trigger("pressure " + t.identifier + ":pressure", r),
        s = r)
    }
    ).bind(n), 100)
}
;
ve.prototype.onstart = function(e) {
    var t = this
      , i = t.options
      , n = e;
    e = ma(e),
    t.updateBox();
    var s = function(r) {
        t.actives.length < i.maxNumberOfNipples ? t.processOnStart(r) : n.type.match(/^touch/) && (Object.keys(t.manager.ids).forEach(function(o) {
            if (Object.values(n.touches).findIndex(function(c) {
                return c.identifier === o
            }) < 0) {
                var l = [e[0]];
                l.identifier = o,
                t.processOnEnd(l)
            }
        }),
        t.actives.length < i.maxNumberOfNipples && t.processOnStart(r))
    };
    return $s(e, s),
    t.manager.bindDocument(),
    !1
}
;
ve.prototype.processOnStart = function(e) {
    var t = this, i = t.options, n, s = t.manager.getIdentifier(e), r = e.force || e.pressure || e.webkitForce || 0, o = {
        x: e.pageX,
        y: e.pageY
    }, l = t.getOrCreate(s, o);
    l.identifier !== s && t.manager.removeIdentifier(l.identifier),
    l.identifier = s;
    var c = function(u) {
        u.trigger("start", u),
        t.trigger("start " + u.id + ":start", u),
        u.show(),
        r > 0 && t.pressureFn(e, u, u.identifier),
        t.processOnMove(e)
    };
    if ((n = t.idles.indexOf(l)) >= 0 && t.idles.splice(n, 1),
    t.actives.push(l),
    t.ids.push(l.identifier),
    i.mode !== "semi")
        c(l);
    else {
        var a = hn(o, l.position);
        if (a <= i.catchDistance)
            c(l);
        else {
            l.destroy(),
            t.processOnStart(e);
            return
        }
    }
    return l
}
;
ve.prototype.getOrCreate = function(e, t) {
    var i = this, n = i.options, s;
    return /(semi|static)/.test(n.mode) ? (s = i.idles[0],
    s ? (i.idles.splice(0, 1),
    s) : n.mode === "semi" ? i.createNipple(t, e) : (console.warn("Coudln't find the needed nipple."),
    !1)) : (s = i.createNipple(t, e),
    s)
}
;
ve.prototype.processOnMove = function(e) {
    var t = this
      , i = t.options
      , n = t.manager.getIdentifier(e)
      , s = t.nipples.get(n)
      , r = t.manager.scroll;
    if (!zu(e)) {
        this.processOnEnd(e);
        return
    }
    if (!s) {
        console.error("Found zombie joystick with ID " + n),
        t.manager.removeIdentifier(n);
        return
    }
    if (i.dynamicPage) {
        var o = s.el.getBoundingClientRect();
        s.position = {
            x: r.x + o.left,
            y: r.y + o.top
        }
    }
    s.identifier = n;
    var l = s.options.size / 2
      , c = {
        x: e.pageX,
        y: e.pageY
    };
    i.lockX && (c.y = s.position.y),
    i.lockY && (c.x = s.position.x);
    var a = hn(c, s.position), u = Du(c, s.position), p = Ps(u), h = a / l, m = {
        distance: a,
        position: c
    }, w, x;
    if (s.options.shape === "circle" ? (w = Math.min(a, l),
    x = Ou(s.position, w, u)) : (x = Lu(c, s.position, l),
    w = hn(x, s.position)),
    i.follow) {
        if (a > l) {
            let b = c.x - x.x
              , R = c.y - x.y;
            s.position.x += b,
            s.position.y += R,
            s.el.style.top = s.position.y - (t.box.top + r.y) + "px",
            s.el.style.left = s.position.x - (t.box.left + r.x) + "px",
            a = hn(c, s.position)
        }
    } else
        c = x,
        a = w;
    var S = c.x - s.position.x
      , $ = c.y - s.position.y;
    s.frontPosition = {
        x: S,
        y: $
    },
    i.dataOnly || (s.ui.front.style.transform = "translate(" + S + "px," + $ + "px)");
    var v = {
        identifier: s.identifier,
        position: c,
        force: h,
        pressure: e.force || e.pressure || e.webkitForce || 0,
        distance: a,
        angle: {
            radian: p,
            degree: u
        },
        vector: {
            x: S / l,
            y: -$ / l
        },
        raw: m,
        instance: s,
        lockX: i.lockX,
        lockY: i.lockY
    };
    v = s.computeDirection(v),
    v.angle = {
        radian: Ps(180 - u),
        degree: 180 - u
    },
    s.trigger("move", v),
    t.trigger("move " + s.id + ":move", v)
}
;
ve.prototype.processOnEnd = function(e) {
    var t = this
      , i = t.options
      , n = t.manager.getIdentifier(e)
      , s = t.nipples.get(n)
      , r = t.manager.removeIdentifier(s.identifier);
    s && (i.dataOnly || s.hide(function() {
        i.mode === "dynamic" && (s.trigger("removed", s),
        t.trigger("removed " + s.id + ":removed", s),
        t.manager.trigger("removed " + s.id + ":removed", s),
        s.destroy())
    }),
    clearInterval(t.pressureIntervals[s.identifier]),
    s.resetDirection(),
    s.trigger("end", s),
    t.trigger("end " + s.id + ":end", s),
    t.ids.indexOf(s.identifier) >= 0 && t.ids.splice(t.ids.indexOf(s.identifier), 1),
    t.actives.indexOf(s) >= 0 && t.actives.splice(t.actives.indexOf(s), 1),
    /(semi|static)/.test(i.mode) ? t.idles.push(s) : t.nipples.indexOf(s) >= 0 && t.nipples.splice(t.nipples.indexOf(s), 1),
    t.manager.unbindDocument(),
    /(semi|static)/.test(i.mode) && (t.manager.ids[r.id] = r.identifier))
}
;
ve.prototype.onDestroyed = function(e, t) {
    var i = this;
    i.nipples.indexOf(t) >= 0 && i.nipples.splice(i.nipples.indexOf(t), 1),
    i.actives.indexOf(t) >= 0 && i.actives.splice(i.actives.indexOf(t), 1),
    i.idles.indexOf(t) >= 0 && i.idles.splice(i.idles.indexOf(t), 1),
    i.ids.indexOf(t.identifier) >= 0 && i.ids.splice(i.ids.indexOf(t.identifier), 1),
    i.manager.removeIdentifier(t.identifier),
    i.manager.unbindDocument()
}
;
ve.prototype.destroy = function() {
    var e = this;
    e.unbindEvt(e.options.zone, "start"),
    e.nipples.forEach(function(i) {
        i.destroy()
    });
    for (var t in e.pressureIntervals)
        e.pressureIntervals.hasOwnProperty(t) && clearInterval(e.pressureIntervals[t]);
    e.trigger("destroyed", e.nipples),
    e.manager.unbindDocument(),
    e.off()
}
;
function Re(e) {
    var t = this;
    t.ids = {},
    t.index = 0,
    t.collections = [],
    t.scroll = qr(),
    t.config(e),
    t.prepareCollections();
    var i = function() {
        var s;
        t.collections.forEach(function(r) {
            r.forEach(function(o) {
                s = o.el.getBoundingClientRect(),
                o.position = {
                    x: t.scroll.x + s.left,
                    y: t.scroll.y + s.top
                }
            })
        })
    };
    wn(window, "resize", function() {
        Wr(i)
    });
    var n = function() {
        t.scroll = qr()
    };
    return wn(window, "scroll", function() {
        Wr(n)
    }),
    t.collections
}
Re.prototype = new gt;
Re.constructor = Re;
Re.prototype.prepareCollections = function() {
    var e = this;
    e.collections.create = e.create.bind(e),
    e.collections.on = e.on.bind(e),
    e.collections.off = e.off.bind(e),
    e.collections.destroy = e.destroy.bind(e),
    e.collections.get = function(t) {
        var i;
        return e.collections.every(function(n) {
            return i = n.get(t),
            !i
        }),
        i
    }
}
;
Re.prototype.create = function(e) {
    return this.createCollection(e)
}
;
Re.prototype.createCollection = function(e) {
    var t = this
      , i = new ve(t,e);
    return t.bindCollection(i),
    t.collections.push(i),
    i
}
;
Re.prototype.bindCollection = function(e) {
    var t = this, i, n = function(s, r) {
        i = s.type + " " + r.id + ":" + s.type,
        t.trigger(i, r)
    };
    e.on("destroyed", t.onDestroyed.bind(t)),
    e.on("shown hidden rested dir plain", n),
    e.on("dir:up dir:right dir:down dir:left", n),
    e.on("plain:up plain:right plain:down plain:left", n)
}
;
Re.prototype.bindDocument = function() {
    var e = this;
    e.binded || (e.bindEvt(document, "move").bindEvt(document, "end"),
    e.binded = !0)
}
;
Re.prototype.unbindDocument = function(e) {
    var t = this;
    (!Object.keys(t.ids).length || e === !0) && (t.unbindEvt(document, "move").unbindEvt(document, "end"),
    t.binded = !1)
}
;
Re.prototype.getIdentifier = function(e) {
    var t;
    return e ? (t = e.identifier === void 0 ? e.pointerId : e.identifier,
    t === void 0 && (t = this.latest || 0)) : t = this.index,
    this.ids[t] === void 0 && (this.ids[t] = this.index,
    this.index += 1),
    this.latest = t,
    this.ids[t]
}
;
Re.prototype.removeIdentifier = function(e) {
    var t = {};
    for (var i in this.ids)
        if (this.ids[i] === e) {
            t.id = i,
            t.identifier = this.ids[i],
            delete this.ids[i];
            break
        }
    return t
}
;
Re.prototype.onmove = function(e) {
    var t = this;
    return t.onAny("move", e),
    !1
}
;
Re.prototype.onend = function(e) {
    var t = this;
    return t.onAny("end", e),
    !1
}
;
Re.prototype.oncancel = function(e) {
    var t = this;
    return t.onAny("end", e),
    !1
}
;
Re.prototype.onAny = function(e, t) {
    var i = this, n, s = "processOn" + e.charAt(0).toUpperCase() + e.slice(1);
    t = ma(t);
    var r = function(l, c, a) {
        a.ids.indexOf(c) >= 0 && (a[s](l),
        l._found_ = !0)
    }
      , o = function(l) {
        n = i.getIdentifier(l),
        $s(i.collections, r.bind(null, l, n)),
        l._found_ || i.removeIdentifier(n)
    };
    return $s(t, o),
    !1
}
;
Re.prototype.destroy = function() {
    var e = this;
    e.unbindDocument(!0),
    e.ids = {},
    e.index = 0,
    e.collections.forEach(function(t) {
        t.destroy()
    }),
    e.off()
}
;
Re.prototype.onDestroyed = function(e, t) {
    var i = this;
    if (i.collections.indexOf(t) < 0)
        return !1;
    i.collections.splice(i.collections.indexOf(t), 1)
}
;
const Yr = new Re
  , Kr = {
    create: function(e) {
        return Yr.create(e)
    },
    factory: Yr
};
let Zr = !1;
const Uu = e => {
    if (Zr)
        return;
    Zr = !0;
    const t = document.getElementById("touch-controls-left")
      , i = Kr.create({
        zone: t
    });
    i.on("start", e.onStartMoving),
    i.on("end", e.onStopMoving),
    i.on("move", e.onRotateMoving);
    const n = document.getElementById("touch-controls-right")
      , s = Kr.create({
        zone: n
    });
    s.on("start", e.onStartAttacking),
    s.on("end", e.onStopAttacking),
    s.on("move", e.onRotateAttacking),
    t.style.display = "block",
    n.style.display = "block"
}
  , Wu = {
    enable: Uu
};
var Xu = Object.defineProperty
  , qu = (e, t, i) => t in e ? Xu(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: i
}) : e[t] = i
  , Ye = (e, t, i) => qu(e, typeof t != "symbol" ? t + "" : t, i);
const ya = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IGY9bmV3IFRleHRFbmNvZGVyO2Z1bmN0aW9uIHAoZSl7cmV0dXJuWy4uLm5ldyBVaW50OEFycmF5KGUpXS5tYXAodD0+dC50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX1hc3luYyBmdW5jdGlvbiB3KGUsdCxyKXtyZXR1cm4gcChhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChyLnRvVXBwZXJDYXNlKCksZi5lbmNvZGUoZSt0KSkpfWZ1bmN0aW9uIGIoZSx0LHI9IlNIQS0yNTYiLG49MWU2LHM9MCl7Y29uc3Qgbz1uZXcgQWJvcnRDb250cm9sbGVyLGE9RGF0ZS5ub3coKTtyZXR1cm57cHJvbWlzZTooYXN5bmMoKT0+e2ZvcihsZXQgYz1zO2M8PW47Yys9MSl7aWYoby5zaWduYWwuYWJvcnRlZClyZXR1cm4gbnVsbDtpZihhd2FpdCB3KHQsYyxyKT09PWUpcmV0dXJue251bWJlcjpjLHRvb2s6RGF0ZS5ub3coKS1hfX1yZXR1cm4gbnVsbH0pKCksY29udHJvbGxlcjpvfX1mdW5jdGlvbiBoKGUpe2NvbnN0IHQ9YXRvYihlKSxyPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKTtmb3IobGV0IG49MDtuPHQubGVuZ3RoO24rKylyW25dPXQuY2hhckNvZGVBdChuKTtyZXR1cm4gcn1mdW5jdGlvbiBnKGUsdD0xMil7Y29uc3Qgcj1uZXcgVWludDhBcnJheSh0KTtmb3IobGV0IG49MDtuPHQ7bisrKXJbbl09ZSUyNTYsZT1NYXRoLmZsb29yKGUvMjU2KTtyZXR1cm4gcn1hc3luYyBmdW5jdGlvbiBtKGUsdD0iIixyPTFlNixuPTApe2NvbnN0IHM9IkFFUy1HQ00iLG89bmV3IEFib3J0Q29udHJvbGxlcixhPURhdGUubm93KCksbD1hc3luYygpPT57Zm9yKGxldCB1PW47dTw9cjt1Kz0xKXtpZihvLnNpZ25hbC5hYm9ydGVkfHwhY3x8IXkpcmV0dXJuIG51bGw7dHJ5e2NvbnN0IGQ9YXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KHtuYW1lOnMsaXY6Zyh1KX0sYyx5KTtpZihkKXJldHVybntjbGVhclRleHQ6bmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGQpLHRvb2s6RGF0ZS5ub3coKS1hfX1jYXRjaHt9fXJldHVybiBudWxsfTtsZXQgYz1udWxsLHk9bnVsbDt0cnl7eT1oKGUpO2NvbnN0IHU9YXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoIlNIQS0yNTYiLGYuZW5jb2RlKHQpKTtjPWF3YWl0IGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KCJyYXciLHUscywhMSxbImRlY3J5cHQiXSl9Y2F0Y2h7cmV0dXJue3Byb21pc2U6UHJvbWlzZS5yZWplY3QoKSxjb250cm9sbGVyOm99fXJldHVybntwcm9taXNlOmwoKSxjb250cm9sbGVyOm99fWxldCBpO29ubWVzc2FnZT1hc3luYyBlPT57Y29uc3R7dHlwZTp0LHBheWxvYWQ6cixzdGFydDpuLG1heDpzfT1lLmRhdGE7bGV0IG89bnVsbDtpZih0PT09ImFib3J0IilpPT1udWxsfHxpLmFib3J0KCksaT12b2lkIDA7ZWxzZSBpZih0PT09IndvcmsiKXtpZigib2JmdXNjYXRlZCJpbiByKXtjb25zdHtrZXk6YSxvYmZ1c2NhdGVkOmx9PXJ8fHt9O289YXdhaXQgbShsLGEscyxuKX1lbHNle2NvbnN0e2FsZ29yaXRobTphLGNoYWxsZW5nZTpsLHNhbHQ6Y309cnx8e307bz1iKGwsYyxhLHMsbil9aT1vLmNvbnRyb2xsZXIsby5wcm9taXNlLnRoZW4oYT0+e3NlbGYucG9zdE1lc3NhZ2UoYSYmey4uLmEsd29ya2VyOiEwfSl9KX19fSkoKTsK"
  , Gu = e => Uint8Array.from(atob(e), t => t.charCodeAt(0))
  , Jr = typeof self < "u" && self.Blob && new Blob([Gu(ya)],{
    type: "text/javascript;charset=utf-8"
});
function Yu(e) {
    let t;
    try {
        if (t = Jr && (self.URL || self.webkitURL).createObjectURL(Jr),
        !t)
            throw "";
        const i = new Worker(t,{
            name: e == null ? void 0 : e.name
        });
        return i.addEventListener("error", () => {
            (self.URL || self.webkitURL).revokeObjectURL(t)
        }
        ),
        i
    } catch {
        return new Worker("data:text/javascript;base64," + ya,{
            name: e == null ? void 0 : e.name
        })
    } finally {
        t && (self.URL || self.webkitURL).revokeObjectURL(t)
    }
}
function vn() {}
function Ku(e, t) {
    for (const i in t)
        e[i] = t[i];
    return e
}
function wa(e) {
    return e()
}
function Qr() {
    return Object.create(null)
}
function Yi(e) {
    e.forEach(wa)
}
function va(e) {
    return typeof e == "function"
}
function Zu(e, t) {
    return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function"
}
function Ju(e) {
    return Object.keys(e).length === 0
}
function Qu(e, t, i, n) {
    if (e) {
        const s = ka(e, t, i, n);
        return e[0](s)
    }
}
function ka(e, t, i, n) {
    return e[1] && n ? Ku(i.ctx.slice(), e[1](n(t))) : i.ctx
}
function ju(e, t, i, n) {
    if (e[2] && n) {
        const s = e[2](n(i));
        if (t.dirty === void 0)
            return s;
        if (typeof s == "object") {
            const r = []
              , o = Math.max(t.dirty.length, s.length);
            for (let l = 0; l < o; l += 1)
                r[l] = t.dirty[l] | s[l];
            return r
        }
        return t.dirty | s
    }
    return t.dirty
}
function ef(e, t, i, n, s, r) {
    if (s) {
        const o = ka(t, i, n, r);
        e.p(o, s)
    }
}
function tf(e) {
    if (e.ctx.length > 32) {
        const t = []
          , i = e.ctx.length / 32;
        for (let n = 0; n < i; n++)
            t[n] = -1;
        return t
    }
    return -1
}
function ye(e, t) {
    e.appendChild(t)
}
function nf(e, t, i) {
    const n = sf(e);
    if (!n.getElementById(t)) {
        const s = Te("style");
        s.id = t,
        s.textContent = i,
        rf(n, s)
    }
}
function sf(e) {
    if (!e)
        return document;
    const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
    return t && t.host ? t : e.ownerDocument
}
function rf(e, t) {
    return ye(e.head || e, t),
    t.sheet
}
function Le(e, t, i) {
    e.insertBefore(t, i || null)
}
function _e(e) {
    e.parentNode && e.parentNode.removeChild(e)
}
function Te(e) {
    return document.createElement(e)
}
function dt(e) {
    return document.createElementNS("http://www.w3.org/2000/svg", e)
}
function of(e) {
    return document.createTextNode(e)
}
function lt() {
    return of(" ")
}
function cs(e, t, i, n) {
    return e.addEventListener(t, i, n),
    () => e.removeEventListener(t, i, n)
}
function L(e, t, i) {
    i == null ? e.removeAttribute(t) : e.getAttribute(t) !== i && e.setAttribute(t, i)
}
function af(e) {
    return Array.from(e.childNodes)
}
function jr(e, t, i) {
    e.classList.toggle(t, !!i)
}
function lf(e, t, {bubbles: i=!1, cancelable: n=!1}={}) {
    return new CustomEvent(e,{
        detail: t,
        bubbles: i,
        cancelable: n
    })
}
function cf(e) {
    const t = {};
    return e.childNodes.forEach(i => {
        t[i.slot || "default"] = !0
    }
    ),
    t
}
let Ni;
function Di(e) {
    Ni = e
}
function nr() {
    if (!Ni)
        throw new Error("Function called outside component initialization");
    return Ni
}
function hf(e) {
    nr().$$.on_mount.push(e)
}
function uf(e) {
    nr().$$.on_destroy.push(e)
}
function ff() {
    const e = nr();
    return (t, i, {cancelable: n=!1}={}) => {
        const s = e.$$.callbacks[t];
        if (s) {
            const r = lf(t, i, {
                cancelable: n
            });
            return s.slice().forEach(o => {
                o.call(e, r)
            }
            ),
            !r.defaultPrevented
        }
        return !0
    }
}
const jt = []
  , kn = [];
let hi = [];
const eo = []
  , xa = Promise.resolve();
let Rs = !1;
function ba() {
    Rs || (Rs = !0,
    xa.then(le))
}
function df() {
    return ba(),
    xa
}
function As(e) {
    hi.push(e)
}
const hs = new Set;
let qt = 0;
function le() {
    if (qt !== 0)
        return;
    const e = Ni;
    do {
        try {
            for (; qt < jt.length; ) {
                const t = jt[qt];
                qt++,
                Di(t),
                pf(t.$$)
            }
        } catch (t) {
            throw jt.length = 0,
            qt = 0,
            t
        }
        for (Di(null),
        jt.length = 0,
        qt = 0; kn.length; )
            kn.pop()();
        for (let t = 0; t < hi.length; t += 1) {
            const i = hi[t];
            hs.has(i) || (hs.add(i),
            i())
        }
        hi.length = 0
    } while (jt.length);
    for (; eo.length; )
        eo.pop()();
    Rs = !1,
    hs.clear(),
    Di(e)
}
function pf(e) {
    if (e.fragment !== null) {
        e.update(),
        Yi(e.before_update);
        const t = e.dirty;
        e.dirty = [-1],
        e.fragment && e.fragment.p(e.ctx, t),
        e.after_update.forEach(As)
    }
}
function mf(e) {
    const t = []
      , i = [];
    hi.forEach(n => e.indexOf(n) === -1 ? t.push(n) : i.push(n)),
    i.forEach(n => n()),
    hi = t
}
const un = new Set;
let gf;
function Sa(e, t) {
    e && e.i && (un.delete(e),
    e.i(t))
}
function yf(e, t, i, n) {
    if (e && e.o) {
        if (un.has(e))
            return;
        un.add(e),
        gf.c.push( () => {
            un.delete(e)
        }
        ),
        e.o(t)
    }
}
function wf(e, t, i) {
    const {fragment: n, after_update: s} = e.$$;
    n && n.m(t, i),
    As( () => {
        const r = e.$$.on_mount.map(wa).filter(va);
        e.$$.on_destroy ? e.$$.on_destroy.push(...r) : Yi(r),
        e.$$.on_mount = []
    }
    ),
    s.forEach(As)
}
function vf(e, t) {
    const i = e.$$;
    i.fragment !== null && (mf(i.after_update),
    Yi(i.on_destroy),
    i.fragment && i.fragment.d(t),
    i.on_destroy = i.fragment = null,
    i.ctx = [])
}
function kf(e, t) {
    e.$$.dirty[0] === -1 && (jt.push(e),
    ba(),
    e.$$.dirty.fill(0)),
    e.$$.dirty[t / 31 | 0] |= 1 << t % 31
}
function xf(e, t, i, n, s, r, o=null, l=[-1]) {
    const c = Ni;
    Di(e);
    const a = e.$$ = {
        fragment: null,
        ctx: [],
        props: r,
        update: vn,
        not_equal: s,
        bound: Qr(),
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(t.context || (c ? c.$$.context : [])),
        callbacks: Qr(),
        dirty: l,
        skip_bound: !1,
        root: t.target || c.$$.root
    };
    o && o(a.root);
    let u = !1;
    if (a.ctx = i ? i(e, t.props || {}, (p, h, ...m) => {
        const w = m.length ? m[0] : h;
        return a.ctx && s(a.ctx[p], a.ctx[p] = w) && (!a.skip_bound && a.bound[p] && a.bound[p](w),
        u && kf(e, p)),
        h
    }
    ) : [],
    a.update(),
    u = !0,
    Yi(a.before_update),
    a.fragment = n ? n(a.ctx) : !1,
    t.target) {
        if (t.hydrate) {
            const p = af(t.target);
            a.fragment && a.fragment.l(p),
            p.forEach(_e)
        } else
            a.fragment && a.fragment.c();
        t.intro && Sa(e.$$.fragment),
        wf(e, t.target, t.anchor),
        le()
    }
    Di(c)
}
let Ia;
typeof HTMLElement == "function" && (Ia = class extends HTMLElement {
    constructor(e, t, i) {
        super(),
        Ye(this, "$$ctor"),
        Ye(this, "$$s"),
        Ye(this, "$$c"),
        Ye(this, "$$cn", !1),
        Ye(this, "$$d", {}),
        Ye(this, "$$r", !1),
        Ye(this, "$$p_d", {}),
        Ye(this, "$$l", {}),
        Ye(this, "$$l_u", new Map),
        this.$$ctor = e,
        this.$$s = t,
        i && this.attachShadow({
            mode: "open"
        })
    }
    addEventListener(e, t, i) {
        if (this.$$l[e] = this.$$l[e] || [],
        this.$$l[e].push(t),
        this.$$c) {
            const n = this.$$c.$on(e, t);
            this.$$l_u.set(t, n)
        }
        super.addEventListener(e, t, i)
    }
    removeEventListener(e, t, i) {
        if (super.removeEventListener(e, t, i),
        this.$$c) {
            const n = this.$$l_u.get(t);
            n && (n(),
            this.$$l_u.delete(t))
        }
        if (this.$$l[e]) {
            const n = this.$$l[e].indexOf(t);
            n >= 0 && this.$$l[e].splice(n, 1)
        }
    }
    async connectedCallback() {
        if (this.$$cn = !0,
        !this.$$c) {
            let e = function(s) {
                return () => {
                    let r;
                    return {
                        c: function() {
                            r = Te("slot"),
                            s !== "default" && L(r, "name", s)
                        },
                        m: function(o, l) {
                            Le(o, r, l)
                        },
                        d: function(o) {
                            o && _e(r)
                        }
                    }
                }
            };
            if (await Promise.resolve(),
            !this.$$cn || this.$$c)
                return;
            const t = {}
              , i = cf(this);
            for (const s of this.$$s)
                s in i && (t[s] = [e(s)]);
            for (const s of this.attributes) {
                const r = this.$$g_p(s.name);
                r in this.$$d || (this.$$d[r] = fn(r, s.value, this.$$p_d, "toProp"))
            }
            for (const s in this.$$p_d)
                !(s in this.$$d) && this[s] !== void 0 && (this.$$d[s] = this[s],
                delete this[s]);
            this.$$c = new this.$$ctor({
                target: this.shadowRoot || this,
                props: {
                    ...this.$$d,
                    $$slots: t,
                    $$scope: {
                        ctx: []
                    }
                }
            });
            const n = () => {
                this.$$r = !0;
                for (const s in this.$$p_d)
                    if (this.$$d[s] = this.$$c.$$.ctx[this.$$c.$$.props[s]],
                    this.$$p_d[s].reflect) {
                        const r = fn(s, this.$$d[s], this.$$p_d, "toAttribute");
                        r == null ? this.removeAttribute(this.$$p_d[s].attribute || s) : this.setAttribute(this.$$p_d[s].attribute || s, r)
                    }
                this.$$r = !1
            }
            ;
            this.$$c.$$.after_update.push(n),
            n();
            for (const s in this.$$l)
                for (const r of this.$$l[s]) {
                    const o = this.$$c.$on(s, r);
                    this.$$l_u.set(r, o)
                }
            this.$$l = {}
        }
    }
    attributeChangedCallback(e, t, i) {
        var n;
        this.$$r || (e = this.$$g_p(e),
        this.$$d[e] = fn(e, i, this.$$p_d, "toProp"),
        (n = this.$$c) == null || n.$set({
            [e]: this.$$d[e]
        }))
    }
    disconnectedCallback() {
        this.$$cn = !1,
        Promise.resolve().then( () => {
            !this.$$cn && this.$$c && (this.$$c.$destroy(),
            this.$$c = void 0)
        }
        )
    }
    $$g_p(e) {
        return Object.keys(this.$$p_d).find(t => this.$$p_d[t].attribute === e || !this.$$p_d[t].attribute && t.toLowerCase() === e) || e
    }
}
);
function fn(e, t, i, n) {
    var s;
    const r = (s = i[e]) == null ? void 0 : s.type;
    if (t = r === "Boolean" && typeof t != "boolean" ? t != null : t,
    !n || !i[e])
        return t;
    if (n === "toAttribute")
        switch (r) {
        case "Object":
        case "Array":
            return t == null ? null : JSON.stringify(t);
        case "Boolean":
            return t ? "" : null;
        case "Number":
            return t ?? null;
        default:
            return t
        }
    else
        switch (r) {
        case "Object":
        case "Array":
            return t && JSON.parse(t);
        case "Boolean":
            return t;
        case "Number":
            return t != null ? +t : t;
        default:
            return t
        }
}
function bf(e, t, i, n, s, r) {
    let o = class extends Ia {
        constructor() {
            super(e, i, s),
            this.$$p_d = t
        }
        static get observedAttributes() {
            return Object.keys(t).map(l => (t[l].attribute || l).toLowerCase())
        }
    }
    ;
    return Object.keys(t).forEach(l => {
        Object.defineProperty(o.prototype, l, {
            get() {
                return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l]
            },
            set(c) {
                var a;
                c = fn(l, c, t),
                this.$$d[l] = c,
                (a = this.$$c) == null || a.$set({
                    [l]: c
                })
            }
        })
    }
    ),
    n.forEach(l => {
        Object.defineProperty(o.prototype, l, {
            get() {
                var c;
                return (c = this.$$c) == null ? void 0 : c[l]
            }
        })
    }
    ),
    e.element = o,
    o
}
class Sf {
    constructor() {
        Ye(this, "$$"),
        Ye(this, "$$set")
    }
    $destroy() {
        vf(this, 1),
        this.$destroy = vn
    }
    $on(t, i) {
        if (!va(i))
            return vn;
        const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
        return n.push(i),
        () => {
            const s = n.indexOf(i);
            s !== -1 && n.splice(s, 1)
        }
    }
    $set(t) {
        this.$$set && !Ju(t) && (this.$$.skip_bound = !0,
        this.$$set(t),
        this.$$.skip_bound = !1)
    }
}
const If = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = {
    v: new Set
})).v.add(If);
const Ta = new TextEncoder;
function Tf(e) {
    return [...new Uint8Array(e)].map(t => t.toString(16).padStart(2, "0")).join("")
}
async function Mf(e, t="SHA-256", i=1e5) {
    const n = Date.now().toString(16);
    e || (e = Math.round(Math.random() * i));
    const s = await Ma(n, e, t);
    return {
        algorithm: t,
        challenge: s,
        salt: n,
        signature: ""
    }
}
async function Ma(e, t, i) {
    return Tf(await crypto.subtle.digest(i.toUpperCase(), Ta.encode(e + t)))
}
function Ef(e, t, i="SHA-256", n=1e6, s=0) {
    const r = new AbortController
      , o = Date.now();
    return {
        promise: (async () => {
            for (let l = s; l <= n; l += 1) {
                if (r.signal.aborted)
                    return null;
                if (await Ma(t, l, i) === e)
                    return {
                        number: l,
                        took: Date.now() - o
                    }
            }
            return null
        }
        )(),
        controller: r
    }
}
function Cf() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {}
}
function Pf(e) {
    const t = atob(e)
      , i = new Uint8Array(t.length);
    for (let n = 0; n < t.length; n++)
        i[n] = t.charCodeAt(n);
    return i
}
function $f(e, t=12) {
    const i = new Uint8Array(t);
    for (let n = 0; n < t; n++)
        i[n] = e % 256,
        e = Math.floor(e / 256);
    return i
}
async function Rf(e, t="", i=1e6, n=0) {
    const s = "AES-GCM"
      , r = new AbortController
      , o = Date.now()
      , l = async () => {
        for (let u = n; u <= i; u += 1) {
            if (r.signal.aborted || !c || !a)
                return null;
            try {
                const p = await crypto.subtle.decrypt({
                    name: s,
                    iv: $f(u)
                }, c, a);
                if (p)
                    return {
                        clearText: new TextDecoder().decode(p),
                        took: Date.now() - o
                    }
            } catch {}
        }
        return null
    }
    ;
    let c = null
      , a = null;
    try {
        a = Pf(e);
        const u = await crypto.subtle.digest("SHA-256", Ta.encode(t));
        c = await crypto.subtle.importKey("raw", u, s, !1, ["decrypt"])
    } catch {
        return {
            promise: Promise.reject(),
            controller: r
        }
    }
    return {
        promise: l(),
        controller: r
    }
}
var Q = (e => (e.ERROR = "error",
e.VERIFIED = "verified",
e.VERIFYING = "verifying",
e.UNVERIFIED = "unverified",
e.EXPIRED = "expired",
e))(Q || {});
function Af(e) {
    nf(e, "svelte-ddsc3z", '.altcha.svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, transparent);border:var(--altcha-border-width, 1px) solid var(--altcha-color-border, #a0a0a0);border-radius:var(--altcha-border-radius, 3px);color:var(--altcha-color-text, currentColor);display:flex;flex-direction:column;max-width:var(--altcha-max-width, 260px);position:relative;text-align:left}.altcha.svelte-ddsc3z.svelte-ddsc3z:focus-within{border-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, white);display:none;filter:drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.2));left:-100%;position:fixed;top:-100%;width:var(--altcha-max-width, 260px);z-index:999999}.altcha[data-floating=top].svelte-ddsc3z .altcha-anchor-arrow.svelte-ddsc3z{border-bottom-color:transparent;border-top-color:var(--altcha-color-border, #a0a0a0);bottom:-12px;top:auto}.altcha[data-floating=bottom].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-bottom-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating=top].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-top-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z:not([data-state=unverified]){display:block}.altcha-anchor-arrow.svelte-ddsc3z.svelte-ddsc3z{border:6px solid transparent;border-bottom-color:var(--altcha-color-border, #a0a0a0);content:"";height:0;left:12px;position:absolute;top:-12px;width:0}.altcha-main.svelte-ddsc3z.svelte-ddsc3z{align-items:center;display:flex;gap:0.4rem;padding:0.7rem}.altcha-label.svelte-ddsc3z.svelte-ddsc3z{flex-grow:1}.altcha-label.svelte-ddsc3z label.svelte-ddsc3z{cursor:pointer}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z{color:currentColor;opacity:0.3}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-error.svelte-ddsc3z.svelte-ddsc3z{color:var(--altcha-color-error-text, #f23939);display:flex;font-size:0.85rem;gap:0.3rem;padding:0 0.7rem 0.7rem}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z{align-items:center;background-color:var(--altcha-color-footer-bg, transparent);display:flex;font-size:0.75rem;opacity:0.4;padding:0.2rem 0.7rem;text-align:right}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-footer.svelte-ddsc3z>.svelte-ddsc3z:first-child{flex-grow:1}.altcha-footer.svelte-ddsc3z a{color:currentColor}.altcha-checkbox.svelte-ddsc3z.svelte-ddsc3z{display:flex;align-items:center;height:24px;width:24px}.altcha-checkbox.svelte-ddsc3z input.svelte-ddsc3z{width:18px;height:18px;margin:0}.altcha-hidden.svelte-ddsc3z.svelte-ddsc3z{display:none}.altcha-spinner.svelte-ddsc3z.svelte-ddsc3z{animation:svelte-ddsc3z-altcha-spinner 0.75s infinite linear;transform-origin:center}@keyframes svelte-ddsc3z-altcha-spinner{100%{transform:rotate(360deg)}}')
}
function to(e) {
    let t, i, n;
    return {
        c() {
            t = dt("svg"),
            i = dt("path"),
            n = dt("path"),
            L(i, "d", "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"),
            L(i, "fill", "currentColor"),
            L(i, "opacity", ".25"),
            L(n, "d", "M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"),
            L(n, "fill", "currentColor"),
            L(n, "class", "altcha-spinner svelte-ddsc3z"),
            L(t, "width", "24"),
            L(t, "height", "24"),
            L(t, "viewBox", "0 0 24 24"),
            L(t, "xmlns", "http://www.w3.org/2000/svg")
        },
        m(s, r) {
            Le(s, t, r),
            ye(t, i),
            ye(t, n)
        },
        d(s) {
            s && _e(t)
        }
    }
}
function Df(e) {
    let t, i = e[11].label + "", n;
    return {
        c() {
            t = Te("label"),
            L(t, "for", n = e[4] + "_checkbox"),
            L(t, "class", "svelte-ddsc3z")
        },
        m(s, r) {
            Le(s, t, r),
            t.innerHTML = i
        },
        p(s, r) {
            r[0] & 2048 && i !== (i = s[11].label + "") && (t.innerHTML = i),
            r[0] & 16 && n !== (n = s[4] + "_checkbox") && L(t, "for", n)
        },
        d(s) {
            s && _e(t)
        }
    }
}
function Of(e) {
    let t, i = e[11].verifying + "";
    return {
        c() {
            t = Te("span")
        },
        m(n, s) {
            Le(n, t, s),
            t.innerHTML = i
        },
        p(n, s) {
            s[0] & 2048 && i !== (i = n[11].verifying + "") && (t.innerHTML = i)
        },
        d(n) {
            n && _e(t)
        }
    }
}
function _f(e) {
    let t, i = e[11].verified + "", n, s;
    return {
        c() {
            t = Te("span"),
            n = lt(),
            s = Te("input"),
            L(s, "type", "hidden"),
            L(s, "name", e[4]),
            s.value = e[6]
        },
        m(r, o) {
            Le(r, t, o),
            t.innerHTML = i,
            Le(r, n, o),
            Le(r, s, o)
        },
        p(r, o) {
            o[0] & 2048 && i !== (i = r[11].verified + "") && (t.innerHTML = i),
            o[0] & 16 && L(s, "name", r[4]),
            o[0] & 64 && (s.value = r[6])
        },
        d(r) {
            r && (_e(t),
            _e(n),
            _e(s))
        }
    }
}
function io(e) {
    let t, i, n, s, r, o, l;
    return {
        c() {
            t = Te("div"),
            i = Te("a"),
            n = dt("svg"),
            s = dt("path"),
            r = dt("path"),
            o = dt("path"),
            L(s, "d", "M2.33955 16.4279C5.88954 20.6586 12.1971 21.2105 16.4279 17.6604C18.4699 15.947 19.6548 13.5911 19.9352 11.1365L17.9886 10.4279C17.8738 12.5624 16.909 14.6459 15.1423 16.1284C11.7577 18.9684 6.71167 18.5269 3.87164 15.1423C1.03163 11.7577 1.4731 6.71166 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577C16.9767 5.86872 17.5322 7.02798 17.804 8.2324L19.9522 9.01429C19.7622 7.07737 19.0059 5.17558 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956C-0.658625 5.88958 -1.21046 12.1971 2.33955 16.4279Z"),
            L(s, "fill", "currentColor"),
            L(r, "d", "M3.57212 2.33956C1.65755 3.94607 0.496389 6.11731 0.12782 8.40523L2.04639 9.13961C2.26047 7.15832 3.21057 5.25375 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577L13.8302 6.78606L19.9633 9.13364C19.7929 7.15555 19.0335 5.20847 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956Z"),
            L(r, "fill", "currentColor"),
            L(o, "d", "M7 10H5C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10H13C13 11.6569 11.6569 13 10 13C8.3431 13 7 11.6569 7 10Z"),
            L(o, "fill", "currentColor"),
            L(n, "width", "22"),
            L(n, "height", "22"),
            L(n, "viewBox", "0 0 20 20"),
            L(n, "fill", "none"),
            L(n, "xmlns", "http://www.w3.org/2000/svg"),
            L(i, "href", Ea),
            L(i, "target", "_blank"),
            L(i, "class", "altcha-logo svelte-ddsc3z"),
            L(i, "aria-label", l = e[11].ariaLinkLabel)
        },
        m(c, a) {
            Le(c, t, a),
            ye(t, i),
            ye(i, n),
            ye(n, s),
            ye(n, r),
            ye(n, o)
        },
        p(c, a) {
            a[0] & 2048 && l !== (l = c[11].ariaLinkLabel) && L(i, "aria-label", l)
        },
        d(c) {
            c && _e(t)
        }
    }
}
function no(e) {
    let t, i, n, s;
    function r(c, a) {
        return c[7] === Q.EXPIRED ? Bf : zf
    }
    let o = r(e)
      , l = o(e);
    return {
        c() {
            t = Te("div"),
            i = dt("svg"),
            n = dt("path"),
            s = lt(),
            l.c(),
            L(n, "stroke-linecap", "round"),
            L(n, "stroke-linejoin", "round"),
            L(n, "d", "M6 18L18 6M6 6l12 12"),
            L(i, "width", "14"),
            L(i, "height", "14"),
            L(i, "xmlns", "http://www.w3.org/2000/svg"),
            L(i, "fill", "none"),
            L(i, "viewBox", "0 0 24 24"),
            L(i, "stroke-width", "1.5"),
            L(i, "stroke", "currentColor"),
            L(t, "class", "altcha-error svelte-ddsc3z")
        },
        m(c, a) {
            Le(c, t, a),
            ye(t, i),
            ye(i, n),
            ye(t, s),
            l.m(t, null)
        },
        p(c, a) {
            o === (o = r(c)) && l ? l.p(c, a) : (l.d(1),
            l = o(c),
            l && (l.c(),
            l.m(t, null)))
        },
        d(c) {
            c && _e(t),
            l.d()
        }
    }
}
function zf(e) {
    let t, i = e[11].error + "";
    return {
        c() {
            t = Te("div"),
            L(t, "title", e[5])
        },
        m(n, s) {
            Le(n, t, s),
            t.innerHTML = i
        },
        p(n, s) {
            s[0] & 2048 && i !== (i = n[11].error + "") && (t.innerHTML = i),
            s[0] & 32 && L(t, "title", n[5])
        },
        d(n) {
            n && _e(t)
        }
    }
}
function Bf(e) {
    let t, i = e[11].expired + "";
    return {
        c() {
            t = Te("div"),
            L(t, "title", e[5])
        },
        m(n, s) {
            Le(n, t, s),
            t.innerHTML = i
        },
        p(n, s) {
            s[0] & 2048 && i !== (i = n[11].expired + "") && (t.innerHTML = i),
            s[0] & 32 && L(t, "title", n[5])
        },
        d(n) {
            n && _e(t)
        }
    }
}
function so(e) {
    let t, i, n = e[11].footer + "";
    return {
        c() {
            t = Te("div"),
            i = Te("div"),
            L(i, "class", "svelte-ddsc3z"),
            L(t, "class", "altcha-footer svelte-ddsc3z")
        },
        m(s, r) {
            Le(s, t, r),
            ye(t, i),
            i.innerHTML = n
        },
        p(s, r) {
            r[0] & 2048 && n !== (n = s[11].footer + "") && (i.innerHTML = n)
        },
        d(s) {
            s && _e(t)
        }
    }
}
function ro(e) {
    let t;
    return {
        c() {
            t = Te("div"),
            L(t, "class", "altcha-anchor-arrow svelte-ddsc3z")
        },
        m(i, n) {
            Le(i, t, n),
            e[48](t)
        },
        p: vn,
        d(i) {
            i && _e(t),
            e[48](null)
        }
    }
}
function Hf(e) {
    let t, i, n, s, r, o, l, c, a, u, p, h, m, w, x, S, $;
    const v = e[46].default
      , b = Qu(v, e, e[45], null);
    let R = e[7] === Q.VERIFYING && to();
    function G(D, z) {
        return D[7] === Q.VERIFIED ? _f : D[7] === Q.VERIFYING ? Of : Df
    }
    let X = G(e)
      , W = X(e)
      , M = (e[3] !== !0 || e[12]) && io(e)
      , N = (e[5] || e[7] === Q.EXPIRED) && no(e)
      , H = e[11].footer && (e[2] !== !0 || e[12]) && so(e)
      , _ = e[1] && ro(e);
    return {
        c() {
            b && b.c(),
            t = lt(),
            i = Te("div"),
            n = Te("div"),
            R && R.c(),
            s = lt(),
            r = Te("div"),
            o = Te("input"),
            a = lt(),
            u = Te("div"),
            W.c(),
            p = lt(),
            M && M.c(),
            h = lt(),
            N && N.c(),
            m = lt(),
            H && H.c(),
            w = lt(),
            _ && _.c(),
            L(o, "type", "checkbox"),
            L(o, "id", l = e[4] + "_checkbox"),
            o.required = c = e[0] !== "onsubmit" && (!e[1] || e[0] !== "off"),
            L(o, "class", "svelte-ddsc3z"),
            L(r, "class", "altcha-checkbox svelte-ddsc3z"),
            jr(r, "altcha-hidden", e[7] === Q.VERIFYING),
            L(u, "class", "altcha-label svelte-ddsc3z"),
            L(n, "class", "altcha-main svelte-ddsc3z"),
            L(i, "class", "altcha svelte-ddsc3z"),
            L(i, "data-state", e[7]),
            L(i, "data-floating", e[1])
        },
        m(D, z) {
            b && b.m(D, z),
            Le(D, t, z),
            Le(D, i, z),
            ye(i, n),
            R && R.m(n, null),
            ye(n, s),
            ye(n, r),
            ye(r, o),
            o.checked = e[8],
            ye(n, a),
            ye(n, u),
            W.m(u, null),
            ye(n, p),
            M && M.m(n, null),
            ye(i, h),
            N && N.m(i, null),
            ye(i, m),
            H && H.m(i, null),
            ye(i, w),
            _ && _.m(i, null),
            e[49](i),
            x = !0,
            S || ($ = [cs(o, "change", e[47]), cs(o, "change", e[13]), cs(o, "invalid", e[14])],
            S = !0)
        },
        p(D, z) {
            b && b.p && (!x || z[1] & 16384) && ef(b, v, D, D[45], x ? ju(v, D[45], z, null) : tf(D[45]), null),
            D[7] === Q.VERIFYING ? R || (R = to(),
            R.c(),
            R.m(n, s)) : R && (R.d(1),
            R = null),
            (!x || z[0] & 16 && l !== (l = D[4] + "_checkbox")) && L(o, "id", l),
            (!x || z[0] & 3 && c !== (c = D[0] !== "onsubmit" && (!D[1] || D[0] !== "off"))) && (o.required = c),
            z[0] & 256 && (o.checked = D[8]),
            (!x || z[0] & 128) && jr(r, "altcha-hidden", D[7] === Q.VERIFYING),
            X === (X = G(D)) && W ? W.p(D, z) : (W.d(1),
            W = X(D),
            W && (W.c(),
            W.m(u, null))),
            D[3] !== !0 || D[12] ? M ? M.p(D, z) : (M = io(D),
            M.c(),
            M.m(n, null)) : M && (M.d(1),
            M = null),
            D[5] || D[7] === Q.EXPIRED ? N ? N.p(D, z) : (N = no(D),
            N.c(),
            N.m(i, m)) : N && (N.d(1),
            N = null),
            D[11].footer && (D[2] !== !0 || D[12]) ? H ? H.p(D, z) : (H = so(D),
            H.c(),
            H.m(i, w)) : H && (H.d(1),
            H = null),
            D[1] ? _ ? _.p(D, z) : (_ = ro(D),
            _.c(),
            _.m(i, null)) : _ && (_.d(1),
            _ = null),
            (!x || z[0] & 128) && L(i, "data-state", D[7]),
            (!x || z[0] & 2) && L(i, "data-floating", D[1])
        },
        i(D) {
            x || (Sa(b, D),
            x = !0)
        },
        o(D) {
            yf(b, D),
            x = !1
        },
        d(D) {
            D && (_e(t),
            _e(i)),
            b && b.d(D),
            R && R.d(),
            W.d(),
            M && M.d(),
            N && N.d(),
            H && H.d(),
            _ && _.d(),
            e[49](null),
            S = !1,
            Yi($)
        }
    }
}
const oo = "Visit Altcha.org"
  , Ea = "https://altcha.org/";
function ao(e) {
    return JSON.parse(e)
}
function Lf(e, t, i) {
    var n, s;
    let r, o, l, c, {$$slots: a={}, $$scope: u} = t, {auto: p=void 0} = t, {blockspam: h=void 0} = t, {challengeurl: m=void 0} = t, {challengejson: w=void 0} = t, {debug: x=!1} = t, {delay: S=0} = t, {expire: $=void 0} = t, {floating: v=void 0} = t, {floatinganchor: b=void 0} = t, {floatingoffset: R=void 0} = t, {hidefooter: G=!1} = t, {hidelogo: X=!1} = t, {name: W="altcha"} = t, {maxnumber: M=1e6} = t, {mockerror: N=!1} = t, {obfuscated: H=void 0} = t, {plugins: _=void 0} = t, {refetchonexpire: D=!0} = t, {spamfilter: z=!1} = t, {strings: U=void 0} = t, {test: Y=!1} = t, {verifyurl: K=void 0} = t, {workers: ie=Math.min(16, navigator.hardwareConcurrency || 8)} = t, {workerurl: ne=void 0} = t;
    const J = ff()
      , Ee = ["SHA-256", "SHA-384", "SHA-512"]
      , st = (s = (n = document.documentElement.lang) == null ? void 0 : n.split("-")) == null ? void 0 : s[0];
    let Ge = !1, j, Be = null, yt = null, se = null, Mt = null, Ne = null, Je = null, Qe = [], ce = Q.UNVERIFIED;
    uf( () => {
        Ji(),
        se && (se.removeEventListener("submit", q),
        se.removeEventListener("reset", Z),
        se.removeEventListener("focusin", O),
        se = null),
        Ne && (clearTimeout(Ne),
        Ne = null),
        document.removeEventListener("click", g),
        document.removeEventListener("scroll", I),
        window.removeEventListener("resize", Lt)
    }
    ),
    hf( () => {
        d("mounted", "1.0.6"),
        d("workers", ie),
        Et(),
        d("plugins", Qe.length ? Qe.map(y => y.constructor.pluginName).join(", ") : "none"),
        Y && d("using test mode"),
        $ && rt($),
        p !== void 0 && d("auto", p),
        v !== void 0 && Ce(v),
        se = j.closest("form"),
        se && (se.addEventListener("submit", q, {
            capture: !0
        }),
        se.addEventListener("reset", Z),
        p === "onfocus" && se.addEventListener("focusin", O)),
        p === "onload" && (H ? ot() : He()),
        r && (G || X) && d("Attributes hidefooter and hidelogo ignored because usage with free API Keys requires attribution."),
        requestAnimationFrame( () => {
            J("load")
        }
        )
    }
    );
    function Bt(y, B) {
        return btoa(JSON.stringify({
            algorithm: y.algorithm,
            challenge: y.challenge,
            number: B.number,
            salt: y.salt,
            signature: y.signature,
            test: Y ? !0 : void 0,
            took: B.took
        }))
    }
    function Ji() {
        for (const y of Qe)
            y.destroy()
    }
    function Ht() {
        m && D && ce === Q.VERIFIED ? He() : at(Q.EXPIRED, c.expired)
    }
    async function Qi() {
        var y;
        if (N)
            throw d("mocking error"),
            new Error("Mocked error.");
        if (o)
            return d("using provided json data"),
            o;
        if (Y)
            return d("generating test challenge", {
                test: Y
            }),
            Mf(typeof Y != "boolean" ? +Y : void 0);
        {
            if (!m && se) {
                const ae = se.getAttribute("action");
                ae != null && ae.includes("/form/") && i(15, m = ae + "/altcha")
            }
            if (!m)
                throw new Error("Attribute challengeurl not set.");
            d("fetching challenge from", m);
            const B = await fetch(m, {
                headers: z ? {
                    "x-altcha-spam-filter": "1"
                } : {}
            });
            if (B.status !== 200)
                throw new Error(`Server responded with ${B.status}.`);
            const te = B.headers.get("Expires")
              , we = B.headers.get("X-Altcha-Config")
              , Fe = await B.json()
              , vt = new URLSearchParams((y = Fe.salt.split("?")) == null ? void 0 : y[1])
              , Pe = vt.get("expires") || vt.get("expire");
            if (Pe) {
                const ae = new Date(+Pe * 1e3)
                  , Xe = isNaN(ae.getTime()) ? 0 : ae.getTime() - Date.now();
                Xe > 0 && rt(Xe)
            }
            if (we)
                try {
                    const ae = JSON.parse(we);
                    ae && typeof ae == "object" && (ae.verifyurl && (ae.verifyurl = new URL(ae.verifyurl,new URL(m)).toString()),
                    ji(ae))
                } catch (ae) {
                    d("unable to configure from X-Altcha-Config", ae)
                }
            if (!$ && te != null && te.length) {
                const ae = Date.parse(te);
                if (ae) {
                    const Xe = ae - Date.now();
                    Xe > 0 && rt(Xe)
                }
            }
            return Fe
        }
    }
    function mi(y) {
        var B;
        const te = se == null ? void 0 : se.querySelector(typeof y == "string" ? `input[name="${y}"]` : 'input[type="email"]:not([data-no-spamfilter])');
        return ((B = te == null ? void 0 : te.value) == null ? void 0 : B.slice(te.value.indexOf("@"))) || void 0
    }
    function gi() {
        return z === "ipAddress" ? {
            blockedCountries: void 0,
            classifier: void 0,
            disableRules: void 0,
            email: !1,
            expectedCountries: void 0,
            expectedLanguages: void 0,
            fields: !1,
            ipAddress: void 0,
            text: void 0,
            timeZone: void 0
        } : typeof z == "object" ? z : {
            blockedCountries: void 0,
            classifier: void 0,
            disableRules: void 0,
            email: void 0,
            expectedCountries: void 0,
            expectedLanguages: void 0,
            fields: void 0,
            ipAddress: void 0,
            text: void 0,
            timeZone: void 0
        }
    }
    function Ln(y) {
        return [...(se == null ? void 0 : se.querySelectorAll(y != null && y.length ? y.map(B => `input[name="${B}"]`).join(", ") : 'input[type="text"]:not([data-no-spamfilter]), textarea:not([data-no-spamfilter])')) || []].reduce( (B, te) => {
            const we = te.name
              , Fe = te.value;
            return we && Fe && (B[we] = /\n/.test(Fe) ? Fe.replace(new RegExp("(?<!\\r)\\n","g"), `\r
`) : Fe),
            B
        }
        , {})
    }
    function Et() {
        const y = _ !== void 0 ? _.split(",") : void 0;
        for (const B of globalThis.altchaPlugins)
            (!y || y.includes(B.pluginName)) && Qe.push(new B({
                el: j,
                clarify: ot,
                dispatch: J,
                getConfiguration: yi,
                getFloatingAnchor: wt,
                getState: he,
                log: d,
                reset: at,
                solve: Se,
                setState: Vt,
                setFloatingAnchor: Ft,
                verify: He
            }))
    }
    function d(...y) {
        (x || y.some(B => B instanceof Error)) && console[y[0]instanceof Error ? "error" : "log"]("ALTCHA", `[name=${W}]`, ...y)
    }
    function f() {
        [Q.UNVERIFIED, Q.ERROR, Q.EXPIRED].includes(ce) ? z && (se == null ? void 0 : se.reportValidity()) === !1 ? i(8, Ge = !1) : H ? ot() : He() : i(8, Ge = !0)
    }
    function g(y) {
        const B = y.target;
        v && B && !j.contains(B) && (ce === Q.VERIFIED || p === "off" && ce === Q.UNVERIFIED) && i(9, j.style.display = "none", j)
    }
    function I() {
        v && ce !== Q.UNVERIFIED && xe()
    }
    function E(y) {
        for (const B of Qe)
            typeof B.onErrorChange == "function" && B.onErrorChange(Mt)
    }
    function O(y) {
        ce === Q.UNVERIFIED && He()
    }
    function q(y) {
        se && p === "onsubmit" ? ce === Q.UNVERIFIED ? (y.preventDefault(),
        y.stopPropagation(),
        He().then( () => {
            se == null || se.requestSubmit()
        }
        )) : ce !== Q.VERIFIED && (y.preventDefault(),
        y.stopPropagation(),
        ce === Q.VERIFYING && V()) : se && v && p === "off" && ce === Q.UNVERIFIED && (y.preventDefault(),
        y.stopPropagation(),
        i(9, j.style.display = "block", j),
        xe())
    }
    function Z() {
        at()
    }
    function V() {
        ce === Q.VERIFYING && c.waitAlert && alert(c.waitAlert)
    }
    function ee(y) {
        for (const B of Qe)
            typeof B.onStateChange == "function" && B.onStateChange(ce);
        v && ce !== Q.UNVERIFIED && requestAnimationFrame( () => {
            xe()
        }
        ),
        i(8, Ge = ce === Q.VERIFIED)
    }
    function Lt() {
        v && xe()
    }
    function xe(y=20) {
        if (j)
            if (yt || (yt = (b ? document.querySelector(b) : se == null ? void 0 : se.querySelector('input[type="submit"], button[type="submit"], button:not([type="button"]):not([type="reset"])')) || se),
            yt) {
                const B = parseInt(R, 10) || 12
                  , te = yt.getBoundingClientRect()
                  , we = j.getBoundingClientRect()
                  , Fe = document.documentElement.clientHeight
                  , vt = document.documentElement.clientWidth
                  , Pe = v === "auto" ? te.bottom + we.height + B + y > Fe : v === "top"
                  , ae = Math.max(y, Math.min(vt - y - we.width, te.left + te.width / 2 - we.width / 2));
                if (Pe ? i(9, j.style.top = `${te.top - (we.height + B)}px`, j) : i(9, j.style.top = `${te.bottom + B}px`, j),
                i(9, j.style.left = `${ae}px`, j),
                j.setAttribute("data-floating", Pe ? "top" : "bottom"),
                Be) {
                    const Xe = Be.getBoundingClientRect();
                    i(10, Be.style.left = te.left - ae + te.width / 2 - Xe.width / 2 + "px", Be)
                }
            } else
                d("unable to find floating anchor element")
    }
    async function be(y) {
        if (!K)
            throw new Error("Attribute verifyurl not set.");
        d("requesting server verification from", K);
        const B = {
            payload: y
        };
        if (z) {
            const {blockedCountries: Fe, classifier: vt, disableRules: Pe, email: ae, expectedLanguages: Xe, expectedCountries: Fn, fields: vi, ipAddress: ki, text: cl, timeZone: vr} = gi();
            B.blockedCountries = Fe,
            B.classifier = vt,
            B.disableRules = Pe,
            B.email = ae === !1 ? void 0 : mi(ae),
            B.expectedCountries = Fn,
            B.expectedLanguages = Xe || (st ? [st] : void 0),
            B.fields = vi === !1 ? void 0 : Ln(vi),
            B.ipAddress = ki === !1 ? void 0 : ki || "auto",
            B.text = cl,
            B.timeZone = vr === !1 ? void 0 : vr || Cf()
        }
        const te = await fetch(K, {
            body: JSON.stringify(B),
            headers: {
                "content-type": "application/json"
            },
            method: "POST"
        });
        if (te.status !== 200)
            throw new Error(`Server responded with ${te.status}.`);
        const we = await te.json();
        if (we != null && we.payload && i(6, Je = we.payload),
        J("serververification", we),
        h && we.classification === "BAD")
            throw new Error("SpamFilter returned negative classification.")
    }
    function rt(y) {
        d("expire", y),
        Ne && (clearTimeout(Ne),
        Ne = null),
        y < 1 ? Ht() : Ne = setTimeout(Ht, y)
    }
    function Ce(y) {
        d("floating", y),
        v !== y && (i(9, j.style.left = "", j),
        i(9, j.style.top = "", j)),
        i(1, v = y === !0 || y === "" ? "auto" : y === !1 || y === "false" ? void 0 : v),
        v ? (p || i(0, p = "onsubmit"),
        document.addEventListener("scroll", I),
        document.addEventListener("click", g),
        window.addEventListener("resize", Lt)) : p === "onsubmit" && i(0, p = void 0)
    }
    function fe(y) {
        if (!y.algorithm)
            throw new Error("Invalid challenge. Property algorithm is missing.");
        if (y.signature === void 0)
            throw new Error("Invalid challenge. Property signature is missing.");
        if (!Ee.includes(y.algorithm.toUpperCase()))
            throw new Error(`Unknown algorithm value. Allowed values: ${Ee.join(", ")}`);
        if (!y.challenge || y.challenge.length < 40)
            throw new Error("Challenge is too short. Min. 40 chars.");
        if (!y.salt || y.salt.length < 10)
            throw new Error("Salt is too short. Min. 10 chars.")
    }
    async function Se(y) {
        let B = null;
        if ("Worker"in window) {
            try {
                B = await oe(y, y.maxnumber)
            } catch (te) {
                d(te)
            }
            if ((B == null ? void 0 : B.number) !== void 0 || "obfuscated"in y)
                return {
                    data: y,
                    solution: B
                }
        }
        if ("obfuscated"in y) {
            const te = await Rf(y.obfuscated, y.key, y.maxnumber);
            return {
                data: y,
                solution: await te.promise
            }
        }
        return {
            data: y,
            solution: await Ef(y.challenge, y.salt, y.algorithm, y.maxnumber || M).promise
        }
    }
    async function oe(y, B=typeof Y == "number" ? Y : M, te=Math.ceil(ie)) {
        const we = [];
        te = Math.min(16, Math.max(1, te));
        for (let Pe = 0; Pe < te; Pe++)
            we.push(altchaCreateWorker(ne));
        const Fe = Math.ceil(B / te)
          , vt = await Promise.all(we.map( (Pe, ae) => {
            const Xe = ae * Fe;
            return new Promise(Fn => {
                Pe.addEventListener("message", vi => {
                    if (vi.data)
                        for (const ki of we)
                            ki !== Pe && ki.postMessage({
                                type: "abort"
                            });
                    Fn(vi.data)
                }
                ),
                Pe.postMessage({
                    payload: y,
                    max: Xe + Fe,
                    start: Xe,
                    type: "work"
                })
            }
            )
        }
        ));
        for (const Pe of we)
            Pe.terminate();
        return vt.find(Pe => !!Pe) || null
    }
    async function ot() {
        if (!H) {
            i(7, ce = Q.ERROR);
            return
        }
        const y = Qe.find(B => B.constructor.pluginName === "obfuscation");
        if (!y || !("clarify"in y)) {
            i(7, ce = Q.ERROR),
            d("Plugin `obfuscation` not found. Import `altcha/plugins/obfuscation` to load it.");
            return
        }
        if ("clarify"in y && typeof y.clarify == "function")
            return y.clarify()
    }
    function ji(y) {
        y.obfuscated !== void 0 && i(24, H = y.obfuscated),
        y.auto !== void 0 && (i(0, p = y.auto),
        p === "onload" && (H ? ot() : He())),
        y.blockspam !== void 0 && i(16, h = !!y.blockspam),
        y.floatinganchor !== void 0 && i(20, b = y.floatinganchor),
        y.delay !== void 0 && i(18, S = y.delay),
        y.floatingoffset !== void 0 && i(21, R = y.floatingoffset),
        y.floating !== void 0 && Ce(y.floating),
        y.expire !== void 0 && (rt(y.expire),
        i(19, $ = y.expire)),
        y.challenge && (fe(y.challenge),
        o = y.challenge),
        y.challengeurl !== void 0 && i(15, m = y.challengeurl),
        y.debug !== void 0 && i(17, x = !!y.debug),
        y.hidefooter !== void 0 && i(2, G = !!y.hidefooter),
        y.hidelogo !== void 0 && i(3, X = !!y.hidelogo),
        y.maxnumber !== void 0 && i(22, M = +y.maxnumber),
        y.mockerror !== void 0 && i(23, N = !!y.mockerror),
        y.name !== void 0 && i(4, W = y.name),
        y.refetchonexpire !== void 0 && i(25, D = !!y.refetchonexpire),
        y.spamfilter !== void 0 && i(26, z = typeof y.spamfilter == "object" ? y.spamfilter : !!y.spamfilter),
        y.strings && i(44, l = y.strings),
        y.test !== void 0 && i(27, Y = typeof y.test == "number" ? y.test : !!y.test),
        y.verifyurl !== void 0 && i(28, K = y.verifyurl),
        y.workers !== void 0 && i(29, ie = +y.workers),
        y.workerurl !== void 0 && i(30, ne = y.workerurl)
    }
    function yi() {
        return {
            auto: p,
            blockspam: h,
            challengeurl: m,
            debug: x,
            delay: S,
            expire: $,
            floating: v,
            floatinganchor: b,
            floatingoffset: R,
            hidefooter: G,
            hidelogo: X,
            name: W,
            maxnumber: M,
            mockerror: N,
            obfuscated: H,
            refetchonexpire: D,
            spamfilter: z,
            strings: c,
            test: Y,
            verifyurl: K,
            workers: ie,
            workerurl: ne
        }
    }
    function wt() {
        return yt
    }
    function wi(y) {
        return Qe.find(B => B.constructor.pluginName === y)
    }
    function he() {
        return ce
    }
    function at(y=Q.UNVERIFIED, B=null) {
        Ne && (clearTimeout(Ne),
        Ne = null),
        i(8, Ge = !1),
        i(5, Mt = B),
        i(6, Je = null),
        i(7, ce = y)
    }
    function Ft(y) {
        yt = y
    }
    function Vt(y, B=null) {
        i(7, ce = y),
        i(5, Mt = B)
    }
    async function He() {
        return at(Q.VERIFYING),
        await new Promise(y => setTimeout(y, S || 0)),
        Qi().then(y => (fe(y),
        d("challenge", y),
        Se(y))).then( ({data: y, solution: B}) => {
            if (d("solution", B),
            "challenge"in y && B && !("clearText"in B))
                if ((B == null ? void 0 : B.number) !== void 0) {
                    if (K)
                        return be(Bt(y, B));
                    i(6, Je = Bt(y, B)),
                    d("payload", Je)
                } else
                    throw d("Unable to find a solution. Ensure that the 'maxnumber' attribute is greater than the randomly generated number."),
                    new Error("Unexpected result returned.")
        }
        ).then( () => {
            i(7, ce = Q.VERIFIED),
            d("verified"),
            df().then( () => {
                J("verified", {
                    payload: Je
                })
            }
            )
        }
        ).catch(y => {
            d(y),
            i(7, ce = Q.ERROR),
            i(5, Mt = y.message)
        }
        )
    }
    function ol() {
        Ge = this.checked,
        i(8, Ge)
    }
    function al(y) {
        kn[y ? "unshift" : "push"]( () => {
            Be = y,
            i(10, Be)
        }
        )
    }
    function ll(y) {
        kn[y ? "unshift" : "push"]( () => {
            j = y,
            i(9, j)
        }
        )
    }
    return e.$$set = y => {
        "auto"in y && i(0, p = y.auto),
        "blockspam"in y && i(16, h = y.blockspam),
        "challengeurl"in y && i(15, m = y.challengeurl),
        "challengejson"in y && i(31, w = y.challengejson),
        "debug"in y && i(17, x = y.debug),
        "delay"in y && i(18, S = y.delay),
        "expire"in y && i(19, $ = y.expire),
        "floating"in y && i(1, v = y.floating),
        "floatinganchor"in y && i(20, b = y.floatinganchor),
        "floatingoffset"in y && i(21, R = y.floatingoffset),
        "hidefooter"in y && i(2, G = y.hidefooter),
        "hidelogo"in y && i(3, X = y.hidelogo),
        "name"in y && i(4, W = y.name),
        "maxnumber"in y && i(22, M = y.maxnumber),
        "mockerror"in y && i(23, N = y.mockerror),
        "obfuscated"in y && i(24, H = y.obfuscated),
        "plugins"in y && i(32, _ = y.plugins),
        "refetchonexpire"in y && i(25, D = y.refetchonexpire),
        "spamfilter"in y && i(26, z = y.spamfilter),
        "strings"in y && i(33, U = y.strings),
        "test"in y && i(27, Y = y.test),
        "verifyurl"in y && i(28, K = y.verifyurl),
        "workers"in y && i(29, ie = y.workers),
        "workerurl"in y && i(30, ne = y.workerurl),
        "$$scope"in y && i(45, u = y.$$scope)
    }
    ,
    e.$$.update = () => {
        e.$$.dirty[0] & 32768 && i(12, r = !!(m != null && m.includes(".altcha.org")) && !!(m != null && m.includes("apiKey=ckey_"))),
        e.$$.dirty[1] & 1 && (o = w ? ao(w) : void 0),
        e.$$.dirty[1] & 4 && i(44, l = U ? ao(U) : {}),
        e.$$.dirty[1] & 8192 && i(11, c = {
            ariaLinkLabel: oo,
            error: "Verification failed. Try again later.",
            expired: "Verification expired. Try again.",
            footer: `Protected by <a href="${Ea}" target="_blank" aria-label="${l.ariaLinkLabel || oo}">ALTCHA</a>`,
            label: "I'm not a robot",
            verified: "Verified",
            verifying: "Verifying...",
            waitAlert: "Verifying... please wait.",
            ...l
        }),
        e.$$.dirty[0] & 192 && J("statechange", {
            payload: Je,
            state: ce
        }),
        e.$$.dirty[0] & 32 && E(),
        e.$$.dirty[0] & 128 && ee()
    }
    ,
    [p, v, G, X, W, Mt, Je, ce, Ge, j, Be, c, r, f, V, m, h, x, S, $, b, R, M, N, H, D, z, Y, K, ie, ne, w, _, U, ot, ji, yi, wt, wi, he, at, Ft, Vt, He, l, u, a, ol, al, ll]
}
class Ff extends Sf {
    constructor(t) {
        super(),
        xf(this, t, Lf, Hf, Zu, {
            auto: 0,
            blockspam: 16,
            challengeurl: 15,
            challengejson: 31,
            debug: 17,
            delay: 18,
            expire: 19,
            floating: 1,
            floatinganchor: 20,
            floatingoffset: 21,
            hidefooter: 2,
            hidelogo: 3,
            name: 4,
            maxnumber: 22,
            mockerror: 23,
            obfuscated: 24,
            plugins: 32,
            refetchonexpire: 25,
            spamfilter: 26,
            strings: 33,
            test: 27,
            verifyurl: 28,
            workers: 29,
            workerurl: 30,
            clarify: 34,
            configure: 35,
            getConfiguration: 36,
            getFloatingAnchor: 37,
            getPlugin: 38,
            getState: 39,
            reset: 40,
            setFloatingAnchor: 41,
            setState: 42,
            verify: 43
        }, Af, [-1, -1, -1])
    }
    get auto() {
        return this.$$.ctx[0]
    }
    set auto(t) {
        this.$$set({
            auto: t
        }),
        le()
    }
    get blockspam() {
        return this.$$.ctx[16]
    }
    set blockspam(t) {
        this.$$set({
            blockspam: t
        }),
        le()
    }
    get challengeurl() {
        return this.$$.ctx[15]
    }
    set challengeurl(t) {
        this.$$set({
            challengeurl: t
        }),
        le()
    }
    get challengejson() {
        return this.$$.ctx[31]
    }
    set challengejson(t) {
        this.$$set({
            challengejson: t
        }),
        le()
    }
    get debug() {
        return this.$$.ctx[17]
    }
    set debug(t) {
        this.$$set({
            debug: t
        }),
        le()
    }
    get delay() {
        return this.$$.ctx[18]
    }
    set delay(t) {
        this.$$set({
            delay: t
        }),
        le()
    }
    get expire() {
        return this.$$.ctx[19]
    }
    set expire(t) {
        this.$$set({
            expire: t
        }),
        le()
    }
    get floating() {
        return this.$$.ctx[1]
    }
    set floating(t) {
        this.$$set({
            floating: t
        }),
        le()
    }
    get floatinganchor() {
        return this.$$.ctx[20]
    }
    set floatinganchor(t) {
        this.$$set({
            floatinganchor: t
        }),
        le()
    }
    get floatingoffset() {
        return this.$$.ctx[21]
    }
    set floatingoffset(t) {
        this.$$set({
            floatingoffset: t
        }),
        le()
    }
    get hidefooter() {
        return this.$$.ctx[2]
    }
    set hidefooter(t) {
        this.$$set({
            hidefooter: t
        }),
        le()
    }
    get hidelogo() {
        return this.$$.ctx[3]
    }
    set hidelogo(t) {
        this.$$set({
            hidelogo: t
        }),
        le()
    }
    get name() {
        return this.$$.ctx[4]
    }
    set name(t) {
        this.$$set({
            name: t
        }),
        le()
    }
    get maxnumber() {
        return this.$$.ctx[22]
    }
    set maxnumber(t) {
        this.$$set({
            maxnumber: t
        }),
        le()
    }
    get mockerror() {
        return this.$$.ctx[23]
    }
    set mockerror(t) {
        this.$$set({
            mockerror: t
        }),
        le()
    }
    get obfuscated() {
        return this.$$.ctx[24]
    }
    set obfuscated(t) {
        this.$$set({
            obfuscated: t
        }),
        le()
    }
    get plugins() {
        return this.$$.ctx[32]
    }
    set plugins(t) {
        this.$$set({
            plugins: t
        }),
        le()
    }
    get refetchonexpire() {
        return this.$$.ctx[25]
    }
    set refetchonexpire(t) {
        this.$$set({
            refetchonexpire: t
        }),
        le()
    }
    get spamfilter() {
        return this.$$.ctx[26]
    }
    set spamfilter(t) {
        this.$$set({
            spamfilter: t
        }),
        le()
    }
    get strings() {
        return this.$$.ctx[33]
    }
    set strings(t) {
        this.$$set({
            strings: t
        }),
        le()
    }
    get test() {
        return this.$$.ctx[27]
    }
    set test(t) {
        this.$$set({
            test: t
        }),
        le()
    }
    get verifyurl() {
        return this.$$.ctx[28]
    }
    set verifyurl(t) {
        this.$$set({
            verifyurl: t
        }),
        le()
    }
    get workers() {
        return this.$$.ctx[29]
    }
    set workers(t) {
        this.$$set({
            workers: t
        }),
        le()
    }
    get workerurl() {
        return this.$$.ctx[30]
    }
    set workerurl(t) {
        this.$$set({
            workerurl: t
        }),
        le()
    }
    get clarify() {
        return this.$$.ctx[34]
    }
    get configure() {
        return this.$$.ctx[35]
    }
    get getConfiguration() {
        return this.$$.ctx[36]
    }
    get getFloatingAnchor() {
        return this.$$.ctx[37]
    }
    get getPlugin() {
        return this.$$.ctx[38]
    }
    get getState() {
        return this.$$.ctx[39]
    }
    get reset() {
        return this.$$.ctx[40]
    }
    get setFloatingAnchor() {
        return this.$$.ctx[41]
    }
    get setState() {
        return this.$$.ctx[42]
    }
    get verify() {
        return this.$$.ctx[43]
    }
}
customElements.define("altcha-widget", bf(Ff, {
    auto: {},
    blockspam: {},
    challengeurl: {},
    challengejson: {},
    debug: {
        type: "Boolean"
    },
    delay: {},
    expire: {},
    floating: {},
    floatinganchor: {},
    floatingoffset: {},
    hidefooter: {
        type: "Boolean"
    },
    hidelogo: {
        type: "Boolean"
    },
    name: {},
    maxnumber: {},
    mockerror: {
        type: "Boolean"
    },
    obfuscated: {},
    plugins: {},
    refetchonexpire: {
        type: "Boolean"
    },
    spamfilter: {
        type: "Boolean"
    },
    strings: {},
    test: {
        type: "Boolean"
    },
    verifyurl: {},
    workers: {},
    workerurl: {}
}, ["default"], ["clarify", "configure", "getConfiguration", "getFloatingAnchor", "getPlugin", "getState", "reset", "setFloatingAnchor", "setState", "verify"], !1));
globalThis.altchaCreateWorker = e => e ? new Worker(new URL(e)) : new Yu;
globalThis.altchaPlugins = globalThis.altchaPlugins || [];
window.loadedScript = !0;
const Vf = location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.")
  , Ca = location.hostname === "sandbox-dev.moomoo.io" || location.hostname === "sandbox.moomoo.io"
  , Nf = location.hostname === "dev.moomoo.io" || location.hostname === "dev2.moomoo.io"
  , Ds = new Eh;
let Ei, dn, pn;
const xn = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  , Uf = !1
  , sr = xn || Uf;
Ca ? (dn = "https://api-sandbox.moomoo.io",
pn = "moomoo.io") : Nf ? (dn = "https://api-dev.moomoo.io",
pn = "moomoo.io") : (dn = "https://api.moomoo.io",
pn = "moomoo.io");
const Wf = !sr
  , bt = new ze(pn,443,T.maxPlayers,5,Wf);
bt.debugLog = !1;
const Ke = {
    animationTime: 0,
    land: null,
    lava: null,
    x: T.volcanoLocationX,
    y: T.volcanoLocationY
};
function Xf() {
    let e = !1;
    return function(t) {
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
    }(navigator.userAgent || navigator.vendor || window.opera),
    e
}
const Pa = Xf();
let bn = !1
  , Os = !1;
function lo() {
    !hr || Os || (Os = !0,
    Vf || sr ? Ei && us("alt:" + Ei) : Ei ? us("alt:" + Ei) : us())
}
let _s = !1;
function us(e) {
    bt.start(In, function(t, i, n) {
        let r = "wss" + "://" + t;
        xn && (r = "wss://localhost:3000"),
        e && (r += "?token=" + encodeURIComponent(e)),
        pe.connect(r, function(o) {
            if (_s) {
                _s = !1;
                return
            }
            nl(),
            o ? ys(o) : (bn = !0,
            Pn())
        }, {
            A: id,
            B: ys,
            C: Hd,
            D: hp,
            E: up,
            a: mp,
            G: Wd,
            H: ip,
            I: lp,
            J: ap,
            K: Gd,
            L: np,
            M: sp,
            N: dp,
            O: pp,
            P: Fd,
            Q: Nd,
            R: Vd,
            S: fp,
            T: Ja,
            U: Za,
            V: Na,
            X: rp,
            Y: op,
            Z: wp,
            g: fd,
            1: md,
            2: ud,
            3: dd,
            4: pd,
            5: Id,
            6: Pd,
            7: kd,
            8: Ld,
            9: wd,
            0: yp
        })
    }, function(t) {
        console.error("Vultr error:", t),
        alert(`Error:
` + t),
        ys("disconnected")
    }, xn)
}
function rr() {
    return pe.connected
}
function qf() {
    const t = prompt("party key", In);
    t && (window.onbeforeunload = void 0,
    window.location.href = "/?server=" + t)
}
const Gf = new Ch(T)
  , $a = Math.PI
  , At = $a * 2;
Math.lerpAngle = function(e, t, i) {
    Math.abs(t - e) > $a && (e > t ? t += At : e += At);
    const s = t + (e - t) * i;
    return s >= 0 && s <= At ? s : s % At
}
;
CanvasRenderingContext2D.prototype.roundRect = function(e, t, i, n, s) {
    return i < 2 * s && (s = i / 2),
    n < 2 * s && (s = n / 2),
    s < 0 && (s = 0),
    this.beginPath(),
    this.moveTo(e + s, t),
    this.arcTo(e + i, t, e + i, t + n, s),
    this.arcTo(e + i, t + n, e, t + n, s),
    this.arcTo(e, t + n, e, t, s),
    this.arcTo(e, t, e + i, t, s),
    this.closePath(),
    this
}
;
let or;
typeof Storage < "u" && (or = !0);
function _n(e, t) {
    or && localStorage.setItem(e, t)
}
function Oi(e) {
    return or ? localStorage.getItem(e) : null
}
let Sn = Oi("moofoll");
function Yf() {
    Sn || (Sn = !0,
    _n("moofoll", 1))
}
let Ra, Ct, ei = 1, Ve, ui, fs, co = Date.now();
var pt;
let Ze;
const Oe = []
  , re = [];
let nt = [];
const Ot = []
  , fi = []
  , Aa = new Rh(jh,fi,re,Oe,$e,F,T,A)
  , ho = new Ah(Oe,Dh,re,F,null,T,A);
let P, Da, k, Gt = 1, ds = 0, Oa = 0, _a = 0, ct, ht, uo, ar = 0;
const me = T.maxScreenWidth
  , ge = T.maxScreenHeight;
let ti, ii, Ui = !1;
document.getElementById("ad-container");
const zn = document.getElementById("mainMenu")
  , _i = document.getElementById("enterGame")
  , ps = document.getElementById("promoImg");
document.getElementById("partyButton");
const ms = document.getElementById("joinPartyButton")
  , zs = document.getElementById("settingsButton")
  , fo = zs.getElementsByTagName("span")[0]
  , po = document.getElementById("allianceButton")
  , mo = document.getElementById("storeButton")
  , go = document.getElementById("chatButton")
  , oi = document.getElementById("gameCanvas")
  , C = oi.getContext("2d");
var Kf = document.getElementById("serverBrowser");
const Bs = document.getElementById("nativeResolution")
  , gs = document.getElementById("showPing");
document.getElementById("playMusic");
const Wi = document.getElementById("pingDisplay")
  , yo = document.getElementById("shutdownDisplay")
  , Xi = document.getElementById("menuCardHolder")
  , zi = document.getElementById("guideCard")
  , di = document.getElementById("loadingText")
  , lr = document.getElementById("gameUI")
  , wo = document.getElementById("actionBar")
  , Zf = document.getElementById("scoreDisplay")
  , Jf = document.getElementById("foodDisplay")
  , Qf = document.getElementById("woodDisplay")
  , jf = document.getElementById("stoneDisplay")
  , ed = document.getElementById("killCounter")
  , vo = document.getElementById("leaderboardData")
  , qi = document.getElementById("nameInput")
  , kt = document.getElementById("itemInfoHolder")
  , ko = document.getElementById("ageText")
  , xo = document.getElementById("ageBarBody")
  , Yt = document.getElementById("upgradeHolder")
  , tn = document.getElementById("upgradeCounter")
  , We = document.getElementById("allianceMenu")
  , nn = document.getElementById("allianceHolder")
  , sn = document.getElementById("allianceManager")
  , De = document.getElementById("mapDisplay")
  , Bi = document.getElementById("diedText")
  , td = document.getElementById("skinColorHolder")
  , Ie = De.getContext("2d");
De.width = 300;
De.height = 300;
const St = document.getElementById("storeMenu")
  , bo = document.getElementById("storeHolder")
  , Kt = document.getElementById("noticationDisplay")
  , Hi = jo.hats
  , Li = jo.accessories;
var $e = new $h(Oh,Ot,A,T);
const Gi = "#525252"
  , So = "#3d3f42"
  , It = 5.5;
T.DAY_INTERVAL / 24;
T.DAY_INTERVAL / 2;
function id(e) {
    nt = e.teams
}
let cr = !0;
var hr = !1;
(!sr || xn) && (hr = !0);
window.onblur = function() {
    cr = !1
}
;
window.onfocus = function() {
    cr = !0,
    P && P.alive && yr()
}
;
window.captchaCallbackHook = function() {
    hr = !0
}
;
window.captchaCallbackComplete && window.captchaCallbackHook();
window.addEventListener("keydown", function(e) {
    e.keyCode == 32 && e.target == document.body && e.preventDefault()
});
oi.oncontextmenu = function() {
    return !1
}
;
["touch-controls-left", "touch-controls-right", "touch-controls-fullscreen", "storeMenu"].forEach(e => {
    document.getElementById(e) && (document.getElementById(e).oncontextmenu = function(t) {
        t.preventDefault()
    }
    )
}
);
function ys(e) {
    bn = !1,
    pe.close(),
    ur(e)
}
function ur(e, t) {
    zn.style.display = "block",
    lr.style.display = "none",
    Xi.style.display = "none",
    Bi.style.display = "none",
    di.style.display = "block",
    di.innerHTML = e + (t ? "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>" : "")
}
function nd() {
    Wi.hidden = !0,
    di.style.display = "none",
    zn.style.display = "block",
    Xi.style.display = "block",
    Td(),
    rd(),
    Ud(),
    di.style.display = "none",
    Xi.style.display = "block";
    let e = Oi("moo_name") || "";
    !e.length && FRVR.profile && (e = FRVR.profile.name(),
    e && (e += Math.floor(Math.random() * 90) + 9)),
    qi.value = e || ""
}
function sd(e) {
    var t;
    ((t = e == null ? void 0 : e.detail) == null ? void 0 : t.state) === "verified" && (Ei = e.detail.payload,
    _i.classList.remove("disabled"))
}
window.addEventListener("load", () => {
    const e = document.getElementById("altcha");
    e == null || e.addEventListener("statechange", sd)
}
);
let rn = !1;
function rd() {
    _i.onclick = A.checkTrusted(function() {
        _i.classList.contains("disabled") || (ur("Connecting..."),
        rr() ? rn ? FRVR.ads.show("interstitial").catch(console.error).finally(Pn) : (Pn(),
        rn = !0) : rn ? FRVR.ads.show("interstitial").catch(console.error).finally(lo) : (lo(),
        rn = !0))
    }),
    A.hookTouchEvents(_i),
    ps && (ps.onclick = A.checkTrusted(function() {
        rl("https://krunker.io/?play=SquidGame_KB")
    }),
    A.hookTouchEvents(ps)),
    ms && (ms.onclick = A.checkTrusted(function() {
        setTimeout(function() {
            qf()
        }, 10)
    }),
    A.hookTouchEvents(ms)),
    zs.onclick = A.checkTrusted(function() {
        Ed()
    }),
    A.hookTouchEvents(zs),
    po.onclick = A.checkTrusted(function() {
        gd()
    }),
    A.hookTouchEvents(po),
    mo.onclick = A.checkTrusted(function() {
        Sd()
    }),
    A.hookTouchEvents(mo),
    go.onclick = A.checkTrusted(function() {
        Wa()
    }),
    A.hookTouchEvents(go),
    De.onclick = A.checkTrusted(function() {
        Ya()
    }),
    A.hookTouchEvents(De)
}
let In;
const od = {
    view: () => {
        if (!bt.servers)
            return;
        let e = 0;
        const t = Object.keys(bt.servers).map(i => {
            const n = bt.regionInfo[i].name;
            let s = 0;
            const r = bt.servers[i].map(o => {
                var h;
                s += o.playerCount;
                const l = o.selected;
                let c = n + " " + o.name + " [" + Math.min(o.playerCount, o.playerCapacity) + "/" + o.playerCapacity + "]";
                const a = o.name
                  , u = l ? "selected" : "";
                o.ping && ((h = o.pings) == null ? void 0 : h.length) >= 2 ? c += ` [${Math.floor(o.ping)}ms]` : l || (c += " [?]");
                let p = {
                    value: i + ":" + a
                };
                return u && (In = i + ":" + a,
                p.selected = !0),
                xt("option", p, c)
            }
            );
            return e += s,
            [xt("option[disabled]", `${n} - ${s} players`), r, xt("option[disabled]")]
        }
        );
        return xt("select", {
            value: In,
            onfocus: () => {
                window.blockRedraw = !0
            }
            ,
            onblur: () => {
                window.blockRedraw = !1
            }
            ,
            onchange: cd
        }, [t, xt("option[disabled]", `All Servers - ${e} players`)])
    }
};
xt.mount(Kf, od);
var Hs, Ls;
location.hostname == "sandbox.moomoo.io" ? (Hs = "Back to MooMoo",
Ls = "//moomoo.io/") : (Hs = "Try the sandbox",
Ls = "//sandbox.moomoo.io/");
document.getElementById("altServer").innerHTML = "<a href='" + Ls + "'>" + Hs + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
const ad = `${dn}/servers?v=1.25`
  , za = async () => fetch(ad).then(e => e.json()).then(async e => bt.processServers(e)).catch(e => {
    console.error("Failed to load server data with status code:", e)
}
)
  , ld = () => za().then(nd).catch(e => {
    console.error("Failed to load.")
}
);
window.frvrSdkInitPromise.then( () => window.FRVR.bootstrapper.complete()).then( () => ld());
const cd = e => {
    if (window.blockRedraw = !1,
    FRVR.channelCharacteristics.allowNavigation) {
        const [t,i] = e.target.value.split(":");
        bt.switchServer(t, i)
    } else
        bn && (bn = !1,
        Os = !1,
        _s = !0,
        $n = !0,
        pe.close())
}
;
document.getElementById("pre-content-container");
function hd() {
    FRVR.ads.show("interstitial", Pn)
}
window.showPreAd = hd;
function Ue(e, t, i) {
    if (P && e) {
        if (A.removeAllChildren(kt),
        kt.classList.add("visible"),
        A.generateElement({
            id: "itemInfoName",
            text: A.capitalizeFirst(e.name),
            parent: kt
        }),
        A.generateElement({
            id: "itemInfoDesc",
            text: e.desc,
            parent: kt
        }),
        !i)
            if (t)
                A.generateElement({
                    class: "itemInfoReq",
                    text: e.type ? "secondary" : "primary",
                    parent: kt
                });
            else {
                for (let s = 0; s < e.req.length; s += 2)
                    A.generateElement({
                        class: "itemInfoReq",
                        html: e.req[s] + "<span class='itemInfoReqVal'> x" + e.req[s + 1] + "</span>",
                        parent: kt
                    });
                const n = Ca ? e.group.sandboxLimit || Math.max(e.group.limit * 3, 99) : e.group.limit;
                e.group.limit && A.generateElement({
                    class: "itemInfoLmt",
                    text: (P.itemCounts[e.group.id] || 0) + "/" + n,
                    parent: kt
                })
            }
    } else
        kt.classList.remove("visible")
}
let pi = []
  , ni = [];
function ud(e, t) {
    pi.push({
        sid: e,
        name: t
    }),
    fr()
}
function fr() {
    if (pi[0]) {
        const e = pi[0];
        A.removeAllChildren(Kt),
        Kt.style.display = "block",
        A.generateElement({
            class: "notificationText",
            text: e.name,
            parent: Kt
        }),
        A.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
            parent: Kt,
            onclick: function() {
                Vs(0)
            },
            hookTouch: !0
        }),
        A.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
            parent: Kt,
            onclick: function() {
                Vs(1)
            },
            hookTouch: !0
        })
    } else
        Kt.style.display = "none"
}
function fd(e) {
    nt.push(e),
    We.style.display == "block" && Ki()
}
function dd(e, t) {
    P && (P.team = e,
    P.isOwner = t,
    We.style.display == "block" && Ki())
}
function pd(e) {
    ni = e,
    We.style.display == "block" && Ki()
}
function md(e) {
    for (let t = nt.length - 1; t >= 0; t--)
        nt[t].sid == e && nt.splice(t, 1);
    We.style.display == "block" && Ki()
}
function gd() {
    yr(),
    We.style.display != "block" ? Ki() : Fs()
}
function Fs() {
    We.style.display == "block" && (We.style.display = "none")
}
function Ki() {
    if (P && P.alive) {
        if (Bn(),
        St.style.display = "none",
        We.style.display = "block",
        A.removeAllChildren(nn),
        P.team)
            for (var e = 0; e < ni.length; e += 2)
                (function(t) {
                    const i = A.generateElement({
                        class: "allianceItem",
                        style: "color:" + (ni[t] == P.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                        text: ni[t + 1],
                        parent: nn
                    });
                    P.isOwner && ni[t] != P.sid && A.generateElement({
                        class: "joinAlBtn",
                        text: "Kick",
                        onclick: function() {
                            Ba(ni[t])
                        },
                        hookTouch: !0,
                        parent: i
                    })
                }
                )(e);
        else if (nt.length)
            for (var e = 0; e < nt.length; ++e)
                (function(i) {
                    const n = A.generateElement({
                        class: "allianceItem",
                        style: "color:" + (nt[i].sid == P.team ? "#fff" : "rgba(255,255,255,0.6)"),
                        text: nt[i].sid,
                        parent: nn
                    });
                    A.generateElement({
                        class: "joinAlBtn",
                        text: "Join",
                        onclick: function() {
                            Ha(i)
                        },
                        hookTouch: !0,
                        parent: n
                    })
                }
                )(e);
        else
            A.generateElement({
                class: "allianceItem",
                text: "No Tribes Yet",
                parent: nn
            });
        A.removeAllChildren(sn),
        P.team ? A.generateElement({
            class: "allianceButtonM",
            style: "width: 360px",
            text: P.isOwner ? "Delete Tribe" : "Leave Tribe",
            onclick: function() {
                La()
            },
            hookTouch: !0,
            parent: sn
        }) : (A.generateElement({
            tag: "input",
            type: "text",
            id: "allianceInput",
            maxLength: 7,
            placeholder: "unique name",
            onchange: t => {
                t.target.value = (t.target.value || "").slice(0, 7)
            }
            ,
            onkeypress: t => {
                if (t.key === "Enter")
                    return t.preventDefault(),
                    Ns(),
                    !1
            }
            ,
            parent: sn
        }),
        A.generateElement({
            tag: "div",
            class: "allianceButtonM",
            style: "width: 140px;",
            text: "Create",
            onclick: function() {
                Ns()
            },
            hookTouch: !0,
            parent: sn
        }))
    }
}
function Vs(e) {
    pe.send("P", pi[0].sid, e),
    pi.splice(0, 1),
    fr()
}
function Ba(e) {
    pe.send("Q", e)
}
function Ha(e) {
    pe.send("b", nt[e].sid)
}
function Ns() {
    pe.send("L", document.getElementById("allianceInput").value)
}
function La() {
    pi = [],
    fr(),
    pe.send("N")
}
let mn, Ci, Dt;
const ai = [];
let $t;
function yd() {
    this.init = function(e, t) {
        this.scale = 0,
        this.x = e,
        this.y = t,
        this.active = !0
    }
    ,
    this.update = function(e, t) {
        this.active && (this.scale += .05 * t,
        this.scale >= T.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / T.mapPingScale),
        e.beginPath(),
        e.arc(this.x / T.mapScale * De.width, this.y / T.mapScale * De.width, this.scale, 0, 2 * Math.PI),
        e.stroke()))
    }
}
function wd(e, t) {
    for (let i = 0; i < ai.length; ++i)
        if (!ai[i].active) {
            $t = ai[i];
            break
        }
    $t || ($t = new yd,
    ai.push($t)),
    $t.init(e, t)
}
function vd() {
    Dt || (Dt = {}),
    Dt.x = P.x,
    Dt.y = P.y
}
function kd(e) {
    Ci = e
}
function xd(e) {
    if (P && P.alive) {
        Ie.clearRect(0, 0, De.width, De.height),
        Ie.strokeStyle = "#fff",
        Ie.lineWidth = 4;
        for (var t = 0; t < ai.length; ++t)
            $t = ai[t],
            $t.update(Ie, e);
        if (Ie.globalAlpha = 1,
        Ie.fillStyle = "#fff",
        ue(P.x / T.mapScale * De.width, P.y / T.mapScale * De.height, 7, Ie, !0),
        Ie.fillStyle = "rgba(255,255,255,0.35)",
        P.team && Ci)
            for (var t = 0; t < Ci.length; )
                ue(Ci[t] / T.mapScale * De.width, Ci[t + 1] / T.mapScale * De.height, 7, Ie, !0),
                t += 2;
        mn && (Ie.fillStyle = "#fc5553",
        Ie.font = "34px Hammersmith One",
        Ie.textBaseline = "middle",
        Ie.textAlign = "center",
        Ie.fillText("x", mn.x / T.mapScale * De.width, mn.y / T.mapScale * De.height)),
        Dt && (Ie.fillStyle = "#fff",
        Ie.font = "34px Hammersmith One",
        Ie.textBaseline = "middle",
        Ie.textAlign = "center",
        Ie.fillText("x", Dt.x / T.mapScale * De.width, Dt.y / T.mapScale * De.height))
    }
}
let Us = 0;
function bd(e) {
    Us != e && (Us = e,
    dr())
}
function Sd() {
    St.style.display != "block" ? (St.style.display = "block",
    We.style.display = "none",
    Bn(),
    dr()) : Ws()
}
function Ws() {
    St.style.display == "block" && (St.style.display = "none",
    Ue())
}
function Id(e, t, i) {
    i ? e ? P.tailIndex = t : P.tails[t] = 1 : e ? P.skinIndex = t : P.skins[t] = 1,
    St.style.display == "block" && dr()
}
function dr() {
    if (P) {
        A.removeAllChildren(bo);
        const e = Us
          , t = e ? Li : Hi;
        for (let i = 0; i < t.length; ++i)
            t[i].dontSell || function(n) {
                const s = A.generateElement({
                    id: "storeDisplay" + n,
                    class: "storeItem",
                    onmouseout: function() {
                        Ue()
                    },
                    onmouseover: function() {
                        Ue(t[n], !1, !0)
                    },
                    parent: bo
                });
                A.hookTouchEvents(s, !0),
                A.generateElement({
                    tag: "img",
                    class: "hatPreview",
                    src: "./img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png",
                    parent: s
                }),
                A.generateElement({
                    tag: "span",
                    text: t[n].name,
                    parent: s
                }),
                (e ? !P.tails[t[n].id] : !P.skins[t[n].id]) ? (A.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Buy",
                    onclick: function() {
                        Fa(t[n].id, e)
                    },
                    hookTouch: !0,
                    parent: s
                }),
                A.generateElement({
                    tag: "span",
                    class: "itemPrice",
                    text: t[n].price,
                    parent: s
                })) : (e ? P.tailIndex : P.skinIndex) == t[n].id ? A.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Unequip",
                    onclick: function() {
                        Xs(0, e)
                    },
                    hookTouch: !0,
                    parent: s
                }) : A.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Equip",
                    onclick: function() {
                        Xs(t[n].id, e)
                    },
                    hookTouch: !0,
                    parent: s
                })
            }(i)
    }
}
function Xs(e, t) {
    pe.send("c", 0, e, t)
}
function Fa(e, t) {
    pe.send("c", 1, e, t)
}
function Va() {
    St.style.display = "none",
    We.style.display = "none",
    Bn()
}
function Td() {
    const e = Oi("native_resolution");
    ws(e ? e == "true" : typeof cordova < "u"),
    Ct = Oi("show_ping") == "true",
    Wi.hidden = !Ct || !Ui,
    Oi("moo_moosic"),
    setInterval(function() {
        window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"),
        document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"))
    }, 1e3),
    Ua(),
    A.removeAllChildren(wo);
    for (var t = 0; t < F.weapons.length + F.list.length; ++t)
        (function(i) {
            A.generateElement({
                id: "actionBarItem" + i,
                class: "actionBarItem",
                style: "display:none",
                onmouseout: function() {
                    Ue()
                },
                parent: wo
            })
        }
        )(t);
    for (var t = 0; t < F.list.length + F.weapons.length; ++t)
        (function(n) {
            const s = document.createElement("canvas");
            s.width = s.height = 66;
            const r = s.getContext("2d");
            if (r.translate(s.width / 2, s.height / 2),
            r.imageSmoothingEnabled = !1,
            r.webkitImageSmoothingEnabled = !1,
            r.mozImageSmoothingEnabled = !1,
            F.weapons[n]) {
                r.rotate(Math.PI / 4 + Math.PI);
                var o = new Image;
                Ys[F.weapons[n].src] = o,
                o.onload = function() {
                    this.isLoaded = !0;
                    const c = 1 / (this.height / this.width)
                      , a = F.weapons[n].iPad || 1;
                    r.drawImage(this, -(s.width * a * T.iconPad * c) / 2, -(s.height * a * T.iconPad) / 2, s.width * a * c * T.iconPad, s.height * a * T.iconPad),
                    r.fillStyle = "rgba(0, 0, 70, 0.1)",
                    r.globalCompositeOperation = "source-atop",
                    r.fillRect(-s.width / 2, -s.height / 2, s.width, s.height),
                    document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + s.toDataURL() + ")"
                }
                ,
                o.src = "./img/weapons/" + F.weapons[n].src + ".png";
                var l = document.getElementById("actionBarItem" + n);
                l.onmouseover = A.checkTrusted(function() {
                    Ue(F.weapons[n], !0)
                }),
                l.onclick = A.checkTrusted(function() {
                    Fi(n, !0)
                }),
                A.hookTouchEvents(l)
            } else {
                var o = wr(F.list[n - F.weapons.length], !0);
                const a = Math.min(s.width - T.iconPadding, o.width);
                r.globalAlpha = 1,
                r.drawImage(o, -a / 2, -a / 2, a, a),
                r.fillStyle = "rgba(0, 0, 70, 0.1)",
                r.globalCompositeOperation = "source-atop",
                r.fillRect(-a / 2, -a / 2, a, a),
                document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + s.toDataURL() + ")";
                var l = document.getElementById("actionBarItem" + n);
                l.onmouseover = A.checkTrusted(function() {
                    Ue(F.list[n - F.weapons.length])
                }),
                l.onclick = A.checkTrusted(function() {
                    Fi(n - F.weapons.length)
                }),
                A.hookTouchEvents(l)
            }
        }
        )(t);
    qi.onchange = i => {
        i.target.value = (i.target.value || "").slice(0, 15)
    }
    ,
    qi.onkeypress = i => {
        if (i.key === "Enter")
            return i.preventDefault(),
            _i.onclick(i),
            !1
    }
    ,
    Bs.checked = Ra,
    Bs.onchange = A.checkTrusted(function(i) {
        ws(i.target.checked)
    }),
    gs.checked = Ct,
    gs.onchange = A.checkTrusted(function(i) {
        Ct = gs.checked,
        Wi.hidden = !Ct,
        _n("show_ping", Ct ? "true" : "false")
    })
}
function Na(e, t) {
    e && (t ? P.weapons = e : P.items = e);
    for (var i = 0; i < F.list.length; ++i) {
        const n = F.weapons.length + i;
        document.getElementById("actionBarItem" + n).style.display = P.items.indexOf(F.list[i].id) >= 0 ? "inline-block" : "none"
    }
    for (var i = 0; i < F.weapons.length; ++i)
        document.getElementById("actionBarItem" + i).style.display = P.weapons[F.weapons[i].type] == F.weapons[i].id ? "inline-block" : "none"
}
function ws(e) {
    Ra = e,
    ei = e && window.devicePixelRatio || 1,
    Bs.checked = e,
    _n("native_resolution", e.toString()),
    pr()
}
function Md() {
    Zi ? zi.classList.add("touch") : zi.classList.remove("touch")
}
function Ed() {
    zi.classList.contains("showing") ? (zi.classList.remove("showing"),
    fo.innerText = "Settings") : (zi.classList.add("showing"),
    fo.innerText = "Close")
}
function Ua() {
    let e = "";
    for (let t = 0; t < T.skinColors.length; ++t)
        t == ar ? e += "<div class='skinColorItem activeSkin' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : e += "<div class='skinColorItem' style='background-color:" + T.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
    td.innerHTML = e
}
function Cd(e) {
    ar = e,
    Ua()
}
const Pi = document.getElementById("chatBox")
  , Tn = document.getElementById("chatHolder");
function Wa() {
    Zi ? setTimeout(function() {
        const e = prompt("chat message");
        e && Io(e)
    }, 1) : Tn.style.display == "block" ? (Pi.value && Io(Pi.value),
    Bn()) : (St.style.display = "none",
    We.style.display = "none",
    Tn.style.display = "block",
    Pi.focus(),
    yr()),
    Pi.value = ""
}
function Io(e) {
    pe.send("6", e.slice(0, 30))
}
function Bn() {
    Pi.value = "",
    Tn.style.display = "none"
}
function Pd(e, t) {
    const i = Hn(e);
    i && (i.chatMessage = t,
    i.chatCountdown = T.chatCountdown)
}
window.addEventListener("resize", A.checkTrusted(pr));
function pr() {
    ti = window.innerWidth,
    ii = window.innerHeight;
    const e = Math.max(ti / me, ii / ge) * ei;
    oi.width = ti * ei,
    oi.height = ii * ei,
    oi.style.width = ti + "px",
    oi.style.height = ii + "px",
    C.setTransform(e, 0, 0, e, (ti * ei - me * e) / 2, (ii * ei - ge * e) / 2)
}
pr();
let Zi;
_t(!1);
function _t(e) {
    Zi = e,
    Md()
}
window.setUsingTouch = _t;
let $d = document.getElementById("leaderboardButton")
  , Xa = document.getElementById("leaderboard");
$d.addEventListener("touchstart", () => {
    Xa.classList.add("is-showing")
}
);
const mr = () => {
    Xa.classList.remove("is-showing")
}
;
document.body.addEventListener("touchend", mr);
document.body.addEventListener("touchleave", mr);
document.body.addEventListener("touchcancel", mr);
if (!Pa) {
    let t = function(s) {
        s.preventDefault(),
        s.stopPropagation(),
        _t(!1),
        Oa = s.clientX,
        _a = s.clientY
    }
      , i = function(s) {
        _t(!1),
        Ze != 1 && (Ze = 1,
        zt())
    }
      , n = function(s) {
        _t(!1),
        Ze != 0 && (Ze = 0,
        zt())
    };
    var vp = t
      , kp = i
      , xp = n;
    const e = document.getElementById("touch-controls-fullscreen");
    e.style.display = "block",
    e.addEventListener("mousemove", t, !1),
    e.addEventListener("mousedown", i, !1),
    e.addEventListener("mouseup", n, !1)
}
let qs = !1, qa;
function Rd() {
    let e = 0, t = 0, i;
    if (Zi) {
        if (!qs)
            return;
        i = qa
    }
    for (const n in En) {
        const s = En[n];
        e += !!pt[n] * s[0],
        t += !!pt[n] * s[1]
    }
    if ((e != 0 || t != 0) && (i = Math.atan2(t, e)),
    i !== void 0)
        return A.fixTo(i, 2)
}
let Mn;
function gr() {
    return P ? (!P.lockDir && !Zi && (Mn = Math.atan2(_a - ii / 2, Oa - ti / 2)),
    A.fixTo(Mn || 0, 2)) : 0
}
var pt = {}
  , En = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0]
};
function yr() {
    pt = {},
    pe.send("e")
}
function Ga() {
    return We.style.display != "block" && Tn.style.display != "block"
}
function Ad(e) {
    const t = e.which || e.keyCode || 0;
    t == 27 ? Va() : P && P.alive && Ga() && (pt[t] || (pt[t] = 1,
    t == 69 ? _d() : t == 67 ? vd() : t == 88 ? Od() : P.weapons[t - 49] != null ? Fi(P.weapons[t - 49], !0) : P.items[t - 49 - P.weapons.length] != null ? Fi(P.items[t - 49 - P.weapons.length]) : t == 81 ? Fi(P.items[0]) : t == 82 ? Ya() : En[t] ? Cn() : t == 32 && (Ze = 1,
    zt())))
}
window.addEventListener("keydown", A.checkTrusted(Ad));
function Dd(e) {
    if (P && P.alive) {
        const t = e.which || e.keyCode || 0;
        if (t == 13) {
            if (We.style.display === "block")
                return;
            Wa()
        } else
            Ga() && pt[t] && (pt[t] = 0,
            En[t] ? Cn() : t == 32 && (Ze = 0,
            zt()))
    }
}
window.addEventListener("keyup", A.checkTrusted(Dd));
function zt() {
    P && P.alive && pe.send("F", Ze, P.buildIndex >= 0 ? gr() : null)
}
let vs;
function Cn() {
    const e = Rd();
    (vs == null || e == null || Math.abs(e - vs) > .3) && (pe.send("f", e),
    vs = e)
}
function Od() {
    P.lockDir = P.lockDir ? 0 : 1,
    pe.send("K", 0)
}
function Ya() {
    pe.send("S", 1)
}
function _d() {
    pe.send("K", 1)
}
function Fi(e, t) {
    pe.send("z", e, t)
}
function Pn() {
    Wi.hidden = !Ct,
    window.onbeforeunload = function(e) {
        return "Are you sure?"
    }
    ,
    window.FRVR && window.FRVR.tracker.levelStart("game_start"),
    _n("moo_name", qi.value),
    !Ui && rr() && (Ui = !0,
    Gf.stop("menu"),
    ur("Loading..."),
    pe.send("M", {
        name: qi.value,
        moofoll: Sn,
        skin: ar
    })),
    zd()
}
function zd() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "none")
}
function Bd() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "block")
}
let $n = !0
  , ks = !1;
function Hd(e) {
    di.style.display = "none",
    Xi.style.display = "block",
    zn.style.display = "none",
    pt = {},
    Da = e,
    Ze = 0,
    Ui = !0,
    $n && ($n = !1,
    Ot.length = 0),
    Pa && Wu.enable({
        onStartMoving: () => {
            Ws(),
            Fs(),
            _t(!0),
            qs = !0
        }
        ,
        onStopMoving: () => {
            qs = !1,
            Cn()
        }
        ,
        onRotateMoving: (t, i) => {
            i.force < .25 || (qa = -i.angle.radian,
            Cn(),
            ks || (Mn = -i.angle.radian))
        }
        ,
        onStartAttacking: () => {
            Ws(),
            Fs(),
            _t(!0),
            ks = !0,
            P.buildIndex < 0 && (Ze = 1,
            zt())
        }
        ,
        onStopAttacking: () => {
            P.buildIndex >= 0 && (Ze = 1,
            zt()),
            Ze = 0,
            zt(),
            ks = !1
        }
        ,
        onRotateAttacking: (t, i) => {
            i.force < .25 || (Mn = -i.angle.radian)
        }
    })
}
function Ld(e, t, i, n) {
    n === -1 ? Ds.showText(e, t, 50, .18, 500, i, "#ee5551") : Ds.showText(e, t, 50, .18, 500, Math.abs(i), i >= 0 ? "#fff" : "#8ecc51")
}
let gn = 99999;
function Fd() {
    Ui = !1,
    Bd();
    try {
        factorem.refreshAds([2], !0)
    } catch {}
    lr.style.display = "none",
    Va(),
    mn = {
        x: P.x,
        y: P.y
    },
    di.style.display = "none",
    Bi.style.display = "block",
    Bi.style.fontSize = "0px",
    gn = 0,
    setTimeout(function() {
        Xi.style.display = "block",
        zn.style.display = "block",
        Bi.style.display = "none"
    }, T.deathFadeout),
    za()
}
function Vd(e) {
    P && $e.removeAllItems(e)
}
function Nd(e) {
    $e.disableBySid(e)
}
function Ka() {
    Zf.innerText = P.points,
    Jf.innerText = P.food,
    Qf.innerText = P.wood,
    jf.innerText = P.stone,
    ed.innerText = P.kills
}
const $i = {}
  , xs = ["crown", "skull"];
function Ud() {
    for (let e = 0; e < xs.length; ++e) {
        const t = new Image;
        t.onload = function() {
            this.isLoaded = !0
        }
        ,
        t.src = "./img/icons/" + xs[e] + ".png",
        $i[xs[e]] = t
    }
}
const Zt = [];
function Za(e, t) {
    if (P.upgradePoints = e,
    P.upgrAge = t,
    e > 0) {
        Zt.length = 0,
        A.removeAllChildren(Yt);
        for (var i = 0; i < F.weapons.length; ++i)
            if (F.weapons[i].age == t && (F.weapons[i].pre == null || P.weapons.indexOf(F.weapons[i].pre) >= 0)) {
                var n = A.generateElement({
                    id: "upgradeItem" + i,
                    class: "actionBarItem",
                    onmouseout: function() {
                        Ue()
                    },
                    parent: Yt
                });
                n.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage,
                Zt.push(i)
            }
        for (var i = 0; i < F.list.length; ++i)
            if (F.list[i].age == t && (F.list[i].pre == null || P.items.indexOf(F.list[i].pre) >= 0)) {
                const r = F.weapons.length + i;
                var n = A.generateElement({
                    id: "upgradeItem" + r,
                    class: "actionBarItem",
                    onmouseout: function() {
                        Ue()
                    },
                    parent: Yt
                });
                n.style.backgroundImage = document.getElementById("actionBarItem" + r).style.backgroundImage,
                Zt.push(r)
            }
        for (var i = 0; i < Zt.length; i++)
            (function(r) {
                const o = document.getElementById("upgradeItem" + r);
                o.onmouseover = function() {
                    F.weapons[r] ? Ue(F.weapons[r], !0) : Ue(F.list[r - F.weapons.length])
                }
                ,
                o.onclick = A.checkTrusted(function() {
                    pe.send("H", r)
                }),
                A.hookTouchEvents(o)
            }
            )(Zt[i]);
        Zt.length ? (Yt.style.display = "block",
        tn.style.display = "block",
        tn.innerHTML = "SELECT ITEMS (" + e + ")") : (Yt.style.display = "none",
        tn.style.display = "none",
        Ue())
    } else
        Yt.style.display = "none",
        tn.style.display = "none",
        Ue()
}
function Ja(e, t, i) {
    e != null && (P.XP = e),
    t != null && (P.maxXP = t),
    i != null && (P.age = i),
    i == T.maxAge ? (ko.innerHTML = "MAX AGE",
    xo.style.width = "100%") : (ko.innerHTML = "AGE " + P.age,
    xo.style.width = P.XP / P.maxXP * 100 + "%")
}
function Wd(e) {
    A.removeAllChildren(vo);
    let t = 1;
    for (let i = 0; i < e.length; i += 3)
        (function(n) {
            A.generateElement({
                class: "leaderHolder",
                parent: vo,
                children: [A.generateElement({
                    class: "leaderboardItem",
                    style: "color:" + (e[n] == Da ? "#fff" : "rgba(255,255,255,0.6)"),
                    text: t + ". " + (e[n + 1] != "" ? e[n + 1] : "unknown")
                }), A.generateElement({
                    class: "leaderScore",
                    text: A.kFormat(e[n + 2]) || "0"
                })]
            })
        }
        )(i),
        t++
}
let To = null;
function Xd() {
    {
        if (P && (!fs || ui - fs >= 1e3 / T.clientSendRate)) {
            fs = ui;
            const a = gr();
            To !== a && (To = a,
            pe.send("D", a))
        }
        if (gn < 120 && (gn += .1 * Ve,
        Bi.style.fontSize = Math.min(Math.round(gn), 120) + "px"),
        P) {
            const a = A.getDistance(ct, ht, P.x, P.y)
              , u = A.getDirection(P.x, P.y, ct, ht)
              , p = Math.min(a * .01 * Ve, a);
            a > .05 ? (ct += p * Math.cos(u),
            ht += p * Math.sin(u)) : (ct = P.x,
            ht = P.y)
        } else
            ct = T.mapScale / 2,
            ht = T.mapScale / 2;
        const o = ui - 1e3 / T.serverUpdateRate;
        for (var e, t = 0; t < re.length + Oe.length; ++t)
            if (k = re[t] || Oe[t - re.length],
            k && k.visible)
                if (k.forcePos)
                    k.x = k.x2,
                    k.y = k.y2,
                    k.dir = k.d2;
                else {
                    const a = k.t2 - k.t1
                      , p = (o - k.t1) / a
                      , h = 170;
                    k.dt += Ve;
                    const m = Math.min(1.7, k.dt / h);
                    var e = k.x2 - k.x1;
                    k.x = k.x1 + e * m,
                    e = k.y2 - k.y1,
                    k.y = k.y1 + e * m,
                    k.dir = Math.lerpAngle(k.d2, k.d1, Math.min(1.2, p))
                }
        const l = ct - me / 2
          , c = ht - ge / 2;
        T.snowBiomeTop - c <= 0 && T.mapScale - T.snowBiomeTop - c >= ge ? (C.fillStyle = "#b6db66",
        C.fillRect(0, 0, me, ge)) : T.mapScale - T.snowBiomeTop - c <= 0 ? (C.fillStyle = "#dbc666",
        C.fillRect(0, 0, me, ge)) : T.snowBiomeTop - c >= ge ? (C.fillStyle = "#fff",
        C.fillRect(0, 0, me, ge)) : T.snowBiomeTop - c >= 0 ? (C.fillStyle = "#fff",
        C.fillRect(0, 0, me, T.snowBiomeTop - c),
        C.fillStyle = "#b6db66",
        C.fillRect(0, T.snowBiomeTop - c, me, ge - (T.snowBiomeTop - c))) : (C.fillStyle = "#b6db66",
        C.fillRect(0, 0, me, T.mapScale - T.snowBiomeTop - c),
        C.fillStyle = "#dbc666",
        C.fillRect(0, T.mapScale - T.snowBiomeTop - c, me, ge - (T.mapScale - T.snowBiomeTop - c))),
        $n || (Gt += ds * T.waveSpeed * Ve,
        Gt >= T.waveMax ? (Gt = T.waveMax,
        ds = -1) : Gt <= 1 && (Gt = ds = 1),
        C.globalAlpha = 1,
        C.fillStyle = "#dbc666",
        Co(l, c, C, T.riverPadding),
        C.fillStyle = "#91b2db",
        Co(l, c, C, (Gt - 1) * 250)),
        C.lineWidth = 4,
        C.strokeStyle = "#000",
        C.globalAlpha = .06,
        C.beginPath();
        for (var i = -ct; i < me; i += ge / 18)
            i > 0 && (C.moveTo(i, 0),
            C.lineTo(i, ge));
        for (let a = -ht; a < ge; a += ge / 18)
            i > 0 && (C.moveTo(0, a),
            C.lineTo(me, a));
        C.stroke(),
        C.globalAlpha = 1,
        C.strokeStyle = Gi,
        Mi(-1, l, c),
        C.globalAlpha = 1,
        C.lineWidth = It,
        Mo(0, l, c),
        Po(l, c, 0),
        C.globalAlpha = 1;
        for (var t = 0; t < Oe.length; ++t)
            k = Oe[t],
            k.active && k.visible && (k.animate(Ve),
            C.save(),
            C.translate(k.x - l, k.y - c),
            C.rotate(k.dir + k.dirPlus - Math.PI / 2),
            cp(k, C),
            C.restore());
        if (Mi(0, l, c),
        Mo(1, l, c),
        Mi(1, l, c),
        Po(l, c, 1),
        Mi(2, l, c),
        Mi(3, l, c),
        C.fillStyle = "#000",
        C.globalAlpha = .09,
        l <= 0 && C.fillRect(0, 0, -l, ge),
        T.mapScale - l <= me) {
            var n = Math.max(0, -c);
            C.fillRect(T.mapScale - l, n, me - (T.mapScale - l), ge - n)
        }
        if (c <= 0 && C.fillRect(-l, 0, me + l, -c),
        T.mapScale - c <= ge) {
            var s = Math.max(0, -l);
            let a = 0;
            T.mapScale - l <= me && (a = me - (T.mapScale - l)),
            C.fillRect(s, T.mapScale - c, me - s - a, ge - (T.mapScale - c))
        }
        C.globalAlpha = 1,
        C.fillStyle = "rgba(0, 0, 70, 0.35)",
        C.fillRect(0, 0, me, ge),
        C.strokeStyle = So;
        for (var t = 0; t < re.length + Oe.length; ++t)
            if (k = re[t] || Oe[t - re.length],
            k.visible && (k.skinIndex != 10 || k == P || k.team && k.team == P.team)) {
                const u = (k.team ? "[" + k.team + "] " : "") + (k.name || "");
                if (u != "") {
                    if (C.font = (k.nameScale || 30) + "px Hammersmith One",
                    C.fillStyle = "#fff",
                    C.textBaseline = "middle",
                    C.textAlign = "center",
                    C.lineWidth = k.nameScale ? 11 : 8,
                    C.lineJoin = "round",
                    C.strokeText(u, k.x - l, k.y - c - k.scale - T.nameY),
                    C.fillText(u, k.x - l, k.y - c - k.scale - T.nameY),
                    k.isLeader && $i.crown.isLoaded) {
                        var r = T.crownIconScale
                          , s = k.x - l - r / 2 - C.measureText(u).width / 2 - T.crownPad;
                        C.drawImage($i.crown, s, k.y - c - k.scale - T.nameY - r / 2 - 5, r, r)
                    }
                    if (k.iconIndex == 1 && $i.skull.isLoaded) {
                        var r = T.crownIconScale
                          , s = k.x - l - r / 2 + C.measureText(u).width / 2 + T.crownPad;
                        C.drawImage($i.skull, s, k.y - c - k.scale - T.nameY - r / 2 - 5, r, r)
                    }
                }
                k.health > 0 && (T.healthBarWidth,
                C.fillStyle = So,
                C.roundRect(k.x - l - T.healthBarWidth - T.healthBarPad, k.y - c + k.scale + T.nameY, T.healthBarWidth * 2 + T.healthBarPad * 2, 17, 8),
                C.fill(),
                C.fillStyle = k == P || k.team && k.team == P.team ? "#8ecc51" : "#cc5151",
                C.roundRect(k.x - l - T.healthBarWidth, k.y - c + k.scale + T.nameY + T.healthBarPad, T.healthBarWidth * 2 * (k.health / k.maxHealth), 17 - T.healthBarPad * 2, 7),
                C.fill())
            }
        Ds.update(Ve, C, l, c);
        for (var t = 0; t < re.length; ++t)
            if (k = re[t],
            k.visible && k.chatCountdown > 0) {
                k.chatCountdown -= Ve,
                k.chatCountdown <= 0 && (k.chatCountdown = 0),
                C.font = "32px Hammersmith One";
                const u = C.measureText(k.chatMessage);
                C.textBaseline = "middle",
                C.textAlign = "center";
                var s = k.x - l
                  , n = k.y - k.scale - c - 90;
                const m = 47
                  , w = u.width + 17;
                C.fillStyle = "rgba(0,0,0,0.2)",
                C.roundRect(s - w / 2, n - m / 2, w, m, 6),
                C.fill(),
                C.fillStyle = "#fff",
                C.fillText(k.chatMessage, s, n)
            }
    }
    xd(Ve)
}
function Mo(e, t, i) {
    for (let n = 0; n < fi.length; ++n)
        k = fi[n],
        k.active && k.layer == e && (k.update(Ve),
        k.active && ja(k.x - t, k.y - i, k.scale) && (C.save(),
        C.translate(k.x - t, k.y - i),
        C.rotate(k.dir),
        Gs(0, 0, k, C),
        C.restore()))
}
const Eo = {};
function Gs(e, t, i, n, s) {
    if (i.src) {
        const r = F.projectiles[i.indx].src;
        let o = Eo[r];
        o || (o = new Image,
        o.onload = function() {
            this.isLoaded = !0
        }
        ,
        o.src = "./img/weapons/" + r + ".png",
        Eo[r] = o),
        o.isLoaded && n.drawImage(o, e - i.scale / 2, t - i.scale / 2, i.scale, i.scale)
    } else
        i.indx == 1 && (n.fillStyle = "#939393",
        ue(e, t, i.scale, n))
}
function qd() {
    const e = ct - me / 2
      , t = ht - ge / 2;
    Ke.animationTime += Ve,
    Ke.animationTime %= T.volcanoAnimationDuration;
    const i = T.volcanoAnimationDuration / 2
      , n = 1.7 + .3 * (Math.abs(i - Ke.animationTime) / i)
      , s = T.innerVolcanoScale * n;
    C.drawImage(Ke.land, Ke.x - T.volcanoScale - e, Ke.y - T.volcanoScale - t, T.volcanoScale * 2, T.volcanoScale * 2),
    C.drawImage(Ke.lava, Ke.x - s - e, Ke.y - s - t, s * 2, s * 2)
}
function Co(e, t, i, n) {
    const s = T.riverWidth + n
      , r = T.mapScale / 2 - t - s / 2;
    r < ge && r + s > 0 && i.fillRect(0, r, me, s)
}
function Mi(e, t, i) {
    let n, s, r;
    for (let o = 0; o < Ot.length; ++o)
        k = Ot[o],
        k.active && (s = k.x + k.xWiggle - t,
        r = k.y + k.yWiggle - i,
        e == 0 && k.update(Ve),
        k.layer == e && ja(s, r, k.scale + (k.blocker || 0)) && (C.globalAlpha = k.hideFromEnemy ? .6 : 1,
        k.isItem ? (n = wr(k),
        C.save(),
        C.translate(s, r),
        C.rotate(k.dir),
        C.drawImage(n, -(n.width / 2), -(n.height / 2)),
        k.blocker && (C.strokeStyle = "#db6e6e",
        C.globalAlpha = .3,
        C.lineWidth = 6,
        ue(0, 0, k.blocker, C, !1, !0)),
        C.restore()) : k.type === 4 ? qd() : (n = Zd(k),
        C.drawImage(n, s - n.width / 2, r - n.height / 2))))
}
function Gd(e, t, i) {
    k = Hn(e),
    k && k.startAnim(t, i)
}
function Po(e, t, i) {
    C.globalAlpha = 1;
    for (let n = 0; n < re.length; ++n)
        k = re[n],
        k.zIndex == i && (k.animate(Ve),
        k.visible && (k.skinRot += .002 * Ve,
        uo = (k == P ? gr() : k.dir) + k.dirPlus,
        C.save(),
        C.translate(k.x - e, k.y - t),
        C.rotate(uo),
        Yd(k, C),
        C.restore()))
}
function Yd(e, t) {
    t = t || C,
    t.lineWidth = It,
    t.lineJoin = "miter";
    const i = Math.PI / 4 * (F.weapons[e.weaponIndex].armS || 1)
      , n = e.buildIndex < 0 && F.weapons[e.weaponIndex].hndS || 1
      , s = e.buildIndex < 0 && F.weapons[e.weaponIndex].hndD || 1;
    if (e.tailIndex > 0 && Kd(e.tailIndex, t, e),
    e.buildIndex < 0 && !F.weapons[e.weaponIndex].aboveHand && (Oo(F.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t),
    F.weapons[e.weaponIndex].projectile != null && !F.weapons[e.weaponIndex].hideProjectile && Gs(e.scale, 0, F.projectiles[F.weapons[e.weaponIndex].projectile], C)),
    t.fillStyle = T.skinColors[e.skinColor],
    ue(e.scale * Math.cos(i), e.scale * Math.sin(i), 14),
    ue(e.scale * s * Math.cos(-i * n), e.scale * s * Math.sin(-i * n), 14),
    e.buildIndex < 0 && F.weapons[e.weaponIndex].aboveHand && (Oo(F.weapons[e.weaponIndex], T.weaponVariants[e.weaponVariant].src, e.scale, 0, t),
    F.weapons[e.weaponIndex].projectile != null && !F.weapons[e.weaponIndex].hideProjectile && Gs(e.scale, 0, F.projectiles[F.weapons[e.weaponIndex].projectile], C)),
    e.buildIndex >= 0) {
        const r = wr(F.list[e.buildIndex]);
        t.drawImage(r, e.scale - F.list[e.buildIndex].holdOffset, -r.width / 2)
    }
    ue(0, 0, e.scale, t),
    e.skinIndex > 0 && (t.rotate(Math.PI / 2),
    Qa(e.skinIndex, t, null, e))
}
const $o = {}
  , Ro = {};
let it;
function Qa(e, t, i, n) {
    if (it = $o[e],
    !it) {
        const r = new Image;
        r.onload = function() {
            this.isLoaded = !0,
            this.onload = null
        }
        ,
        r.src = "./img/hats/hat_" + e + ".png",
        $o[e] = r,
        it = r
    }
    let s = i || Ro[e];
    if (!s) {
        for (let r = 0; r < Hi.length; ++r)
            if (Hi[r].id == e) {
                s = Hi[r];
                break
            }
        Ro[e] = s
    }
    it.isLoaded && t.drawImage(it, -s.scale / 2, -s.scale / 2, s.scale, s.scale),
    !i && s.topSprite && (t.save(),
    t.rotate(n.skinRot),
    Qa(e + "_top", t, s, n),
    t.restore())
}
const Ao = {}
  , Do = {};
function Kd(e, t, i) {
    if (it = Ao[e],
    !it) {
        const s = new Image;
        s.onload = function() {
            this.isLoaded = !0,
            this.onload = null
        }
        ,
        s.src = "./img/accessories/access_" + e + ".png",
        Ao[e] = s,
        it = s
    }
    let n = Do[e];
    if (!n) {
        for (let s = 0; s < Li.length; ++s)
            if (Li[s].id == e) {
                n = Li[s];
                break
            }
        Do[e] = n
    }
    it.isLoaded && (t.save(),
    t.translate(-20 - (n.xOff || 0), 0),
    n.spin && t.rotate(i.skinRot),
    t.drawImage(it, -(n.scale / 2), -(n.scale / 2), n.scale, n.scale),
    t.restore())
}
var Ys = {};
function Oo(e, t, i, n, s) {
    const r = e.src + (t || "");
    let o = Ys[r];
    o || (o = new Image,
    o.onload = function() {
        this.isLoaded = !0
    }
    ,
    o.src = "./img/weapons/" + r + ".png",
    Ys[r] = o),
    o.isLoaded && s.drawImage(o, i + e.xOff - e.length / 2, n + e.yOff - e.width / 2, e.length, e.width)
}
const _o = {};
function Zd(e) {
    const t = e.y >= T.mapScale - T.snowBiomeTop ? 2 : e.y <= T.snowBiomeTop ? 1 : 0
      , i = e.type + "_" + e.scale + "_" + t;
    let n = _o[i];
    if (!n) {
        const r = document.createElement("canvas");
        r.width = r.height = e.scale * 2.1 + It;
        const o = r.getContext("2d");
        if (o.translate(r.width / 2, r.height / 2),
        o.rotate(A.randFloat(0, Math.PI)),
        o.strokeStyle = Gi,
        o.lineWidth = It,
        e.type == 0) {
            let l;
            for (var s = 0; s < 2; ++s)
                l = k.scale * (s ? .5 : 1),
                qe(o, k.sid % 2 === 0 ? 5 : 7, l, l * .7),
                o.fillStyle = t ? s ? "#fff" : "#e3f1f4" : s ? "#b4db62" : "#9ebf57",
                o.fill(),
                s || o.stroke()
        } else if (e.type == 1)
            if (t == 2)
                o.fillStyle = "#606060",
                qe(o, 6, e.scale * .3, e.scale * .71),
                o.fill(),
                o.stroke(),
                o.fillStyle = "#89a54c",
                ue(0, 0, e.scale * .55, o),
                o.fillStyle = "#a5c65b",
                ue(0, 0, e.scale * .3, o, !0);
            else {
                jd(o, 6, k.scale, k.scale * .7),
                o.fillStyle = t ? "#e3f1f4" : "#89a54c",
                o.fill(),
                o.stroke(),
                o.fillStyle = t ? "#6a64af" : "#c15555";
                let l;
                const c = 4
                  , a = At / c;
                for (var s = 0; s < c; ++s)
                    l = A.randInt(k.scale / 3.5, k.scale / 2.3),
                    ue(l * Math.cos(a * s), l * Math.sin(a * s), A.randInt(10, 12), o)
            }
        else
            (e.type == 2 || e.type == 3) && (o.fillStyle = e.type == 2 ? t == 2 ? "#938d77" : "#939393" : "#e0c655",
            qe(o, 3, e.scale, e.scale),
            o.fill(),
            o.stroke(),
            o.fillStyle = e.type == 2 ? t == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3",
            qe(o, 3, e.scale * .55, e.scale * .65),
            o.fill());
        n = r,
        _o[i] = n
    }
    return n
}
function zo(e, t, i) {
    const n = e.lineWidth || 0;
    i /= 2,
    e.beginPath();
    let s = Math.PI * 2 / t;
    for (let r = 0; r < t; r++)
        e.lineTo(i + (i - n / 2) * Math.cos(s * r), i + (i - n / 2) * Math.sin(s * r));
    e.closePath()
}
function Jd() {
    const t = T.volcanoScale * 2
      , i = document.createElement("canvas");
    i.width = t,
    i.height = t;
    const n = i.getContext("2d");
    n.strokeStyle = "#3e3e3e",
    n.lineWidth = It * 2,
    n.fillStyle = "#7f7f7f",
    zo(n, 10, t),
    n.fill(),
    n.stroke(),
    Ke.land = i;
    const s = document.createElement("canvas")
      , r = T.innerVolcanoScale * 2;
    s.width = r,
    s.height = r;
    const o = s.getContext("2d");
    o.strokeStyle = Gi,
    o.lineWidth = It * 1.6,
    o.fillStyle = "#f54e16",
    o.strokeStyle = "#f56f16",
    zo(o, 10, r),
    o.fill(),
    o.stroke(),
    Ke.lava = s
}
Jd();
const Bo = [];
function wr(e, t) {
    let i = Bo[e.id];
    if (!i || t) {
        const c = document.createElement("canvas");
        c.width = c.height = e.scale * 2.5 + It + (F.list[e.id].spritePadding || 0);
        const a = c.getContext("2d");
        if (a.translate(c.width / 2, c.height / 2),
        a.rotate(t ? 0 : Math.PI / 2),
        a.strokeStyle = Gi,
        a.lineWidth = It * (t ? c.width / 81 : 1),
        e.name == "apple") {
            a.fillStyle = "#c15555",
            ue(0, 0, e.scale, a),
            a.fillStyle = "#89a54c";
            const u = -(Math.PI / 2);
            Qd(e.scale * Math.cos(u), e.scale * Math.sin(u), 25, u + Math.PI / 2, a)
        } else if (e.name == "cookie") {
            a.fillStyle = "#cca861",
            ue(0, 0, e.scale, a),
            a.fillStyle = "#937c4b";
            for (var n = 4, s = At / n, r, o = 0; o < n; ++o)
                r = A.randInt(e.scale / 2.5, e.scale / 1.7),
                ue(r * Math.cos(s * o), r * Math.sin(s * o), A.randInt(4, 5), a, !0)
        } else if (e.name == "cheese") {
            a.fillStyle = "#f4f3ac",
            ue(0, 0, e.scale, a),
            a.fillStyle = "#c3c28b";
            for (var n = 4, s = At / n, r, o = 0; o < n; ++o)
                r = A.randInt(e.scale / 2.5, e.scale / 1.7),
                ue(r * Math.cos(s * o), r * Math.sin(s * o), A.randInt(4, 5), a, !0)
        } else if (e.name == "wood wall" || e.name == "stone wall" || e.name == "castle wall") {
            a.fillStyle = e.name == "castle wall" ? "#83898e" : e.name == "wood wall" ? "#a5974c" : "#939393";
            const u = e.name == "castle wall" ? 4 : 3;
            qe(a, u, e.scale * 1.1, e.scale * 1.1),
            a.fill(),
            a.stroke(),
            a.fillStyle = e.name == "castle wall" ? "#9da4aa" : e.name == "wood wall" ? "#c9b758" : "#bcbcbc",
            qe(a, u, e.scale * .65, e.scale * .65),
            a.fill()
        } else if (e.name == "spikes" || e.name == "greater spikes" || e.name == "poison spikes" || e.name == "spinning spikes") {
            a.fillStyle = e.name == "poison spikes" ? "#7b935d" : "#939393";
            var l = e.scale * .6;
            qe(a, e.name == "spikes" ? 5 : 6, e.scale, l),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#a5974c",
            ue(0, 0, l, a),
            a.fillStyle = "#c9b758",
            ue(0, 0, l / 2, a, !0)
        } else if (e.name == "windmill" || e.name == "faster windmill" || e.name == "power mill")
            a.fillStyle = "#a5974c",
            ue(0, 0, e.scale, a),
            a.fillStyle = "#c9b758",
            bs(0, 0, e.scale * 1.5, 29, 4, a),
            a.fillStyle = "#a5974c",
            ue(0, 0, e.scale * .5, a);
        else if (e.name == "mine")
            a.fillStyle = "#939393",
            qe(a, 3, e.scale, e.scale),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#bcbcbc",
            qe(a, 3, e.scale * .55, e.scale * .65),
            a.fill();
        else if (e.name == "sapling")
            for (var o = 0; o < 2; ++o) {
                var l = e.scale * (o ? .5 : 1);
                qe(a, 7, l, l * .7),
                a.fillStyle = o ? "#b4db62" : "#9ebf57",
                a.fill(),
                o || a.stroke()
            }
        else if (e.name == "pit trap")
            a.fillStyle = "#a5974c",
            qe(a, 3, e.scale * 1.1, e.scale * 1.1),
            a.fill(),
            a.stroke(),
            a.fillStyle = Gi,
            qe(a, 3, e.scale * .65, e.scale * .65),
            a.fill();
        else if (e.name == "boost pad")
            a.fillStyle = "#7e7f82",
            si(0, 0, e.scale * 2, e.scale * 2, a),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#dbd97d",
            ep(e.scale * 1, a);
        else if (e.name == "turret") {
            a.fillStyle = "#a5974c",
            ue(0, 0, e.scale, a),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#939393";
            const u = 50;
            si(0, -u / 2, e.scale * .9, u, a),
            ue(0, 0, e.scale * .6, a),
            a.fill(),
            a.stroke()
        } else if (e.name == "platform") {
            a.fillStyle = "#cebd5f";
            const u = 4
              , p = e.scale * 2
              , h = p / u;
            let m = -(e.scale / 2);
            for (var o = 0; o < u; ++o)
                si(m - h / 2, 0, h, e.scale * 2, a),
                a.fill(),
                a.stroke(),
                m += p / u
        } else
            e.name == "healing pad" ? (a.fillStyle = "#7e7f82",
            si(0, 0, e.scale * 2, e.scale * 2, a),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#db6e6e",
            bs(0, 0, e.scale * .65, 20, 4, a, !0)) : e.name == "spawn pad" ? (a.fillStyle = "#7e7f82",
            si(0, 0, e.scale * 2, e.scale * 2, a),
            a.fill(),
            a.stroke(),
            a.fillStyle = "#71aad6",
            ue(0, 0, e.scale * .6, a)) : e.name == "blocker" ? (a.fillStyle = "#7e7f82",
            ue(0, 0, e.scale, a),
            a.fill(),
            a.stroke(),
            a.rotate(Math.PI / 4),
            a.fillStyle = "#db6e6e",
            bs(0, 0, e.scale * .65, 20, 4, a, !0)) : e.name == "teleporter" && (a.fillStyle = "#7e7f82",
            ue(0, 0, e.scale, a),
            a.fill(),
            a.stroke(),
            a.rotate(Math.PI / 4),
            a.fillStyle = "#d76edb",
            ue(0, 0, e.scale * .5, a, !0));
        i = c,
        t || (Bo[e.id] = i)
    }
    return i
}
function Qd(e, t, i, n, s) {
    const r = e + i * Math.cos(n)
      , o = t + i * Math.sin(n)
      , l = i * .4;
    s.moveTo(e, t),
    s.beginPath(),
    s.quadraticCurveTo((e + r) / 2 + l * Math.cos(n + Math.PI / 2), (t + o) / 2 + l * Math.sin(n + Math.PI / 2), r, o),
    s.quadraticCurveTo((e + r) / 2 - l * Math.cos(n + Math.PI / 2), (t + o) / 2 - l * Math.sin(n + Math.PI / 2), e, t),
    s.closePath(),
    s.fill(),
    s.stroke()
}
function ue(e, t, i, n, s, r) {
    n = n || C,
    n.beginPath(),
    n.arc(e, t, i, 0, 2 * Math.PI),
    r || n.fill(),
    s || n.stroke()
}
function qe(e, t, i, n) {
    let s = Math.PI / 2 * 3, r, o;
    const l = Math.PI / t;
    e.beginPath(),
    e.moveTo(0, -i);
    for (let c = 0; c < t; c++)
        r = Math.cos(s) * i,
        o = Math.sin(s) * i,
        e.lineTo(r, o),
        s += l,
        r = Math.cos(s) * n,
        o = Math.sin(s) * n,
        e.lineTo(r, o),
        s += l;
    e.lineTo(0, -i),
    e.closePath()
}
function si(e, t, i, n, s, r) {
    s.fillRect(e - i / 2, t - n / 2, i, n),
    r || s.strokeRect(e - i / 2, t - n / 2, i, n)
}
function bs(e, t, i, n, s, r, o) {
    r.save(),
    r.translate(e, t),
    s = Math.ceil(s / 2);
    for (let l = 0; l < s; l++)
        si(0, 0, i * 2, n, r, o),
        r.rotate(Math.PI / s);
    r.restore()
}
function jd(e, t, i, n) {
    let s = Math.PI / 2 * 3;
    const r = Math.PI / t;
    let o;
    e.beginPath(),
    e.moveTo(0, -n);
    for (let l = 0; l < t; l++)
        o = A.randInt(i + .9, i * 1.2),
        e.quadraticCurveTo(Math.cos(s + r) * o, Math.sin(s + r) * o, Math.cos(s + r * 2) * n, Math.sin(s + r * 2) * n),
        s += r * 2;
    e.lineTo(0, -n),
    e.closePath()
}
function ep(e, t) {
    t = t || C;
    const i = e * (Math.sqrt(3) / 2);
    t.beginPath(),
    t.moveTo(0, -i / 2),
    t.lineTo(-e / 2, i / 2),
    t.lineTo(e / 2, i / 2),
    t.lineTo(0, -i / 2),
    t.fill(),
    t.closePath()
}
function tp() {
    const e = T.mapScale / 2;
    $e.add(0, e, e + 200, 0, T.treeScales[3], 0),
    $e.add(1, e, e - 480, 0, T.treeScales[3], 0),
    $e.add(2, e + 300, e + 450, 0, T.treeScales[3], 0),
    $e.add(3, e - 950, e - 130, 0, T.treeScales[2], 0),
    $e.add(4, e - 750, e - 400, 0, T.treeScales[3], 0),
    $e.add(5, e - 700, e + 400, 0, T.treeScales[2], 0),
    $e.add(6, e + 800, e - 200, 0, T.treeScales[3], 0),
    $e.add(7, e - 260, e + 340, 0, T.bushScales[3], 1),
    $e.add(8, e + 760, e + 310, 0, T.bushScales[3], 1),
    $e.add(9, e - 800, e + 100, 0, T.bushScales[3], 1),
    $e.add(10, e - 800, e + 300, 0, F.list[4].scale, F.list[4].id, F.list[10]),
    $e.add(11, e + 650, e - 390, 0, F.list[4].scale, F.list[4].id, F.list[10]),
    $e.add(12, e - 400, e - 450, 0, T.rockScales[2], 2)
}
function ip(e) {
    for (let t = 0; t < e.length; )
        $e.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], F.list[e[t + 6]], !0, e[t + 7] >= 0 ? {
            sid: e[t + 7]
        } : null),
        t += 8
}
function np(e, t) {
    k = tl(t),
    k && (k.xWiggle += T.gatherWiggle * Math.cos(e),
    k.yWiggle += T.gatherWiggle * Math.sin(e))
}
function sp(e, t) {
    k = tl(e),
    k && (k.dir = t,
    k.xWiggle += T.gatherWiggle * Math.cos(t + Math.PI),
    k.yWiggle += T.gatherWiggle * Math.sin(t + Math.PI))
}
function rp(e, t, i, n, s, r, o, l) {
    cr && (Aa.addProjectile(e, t, i, n, s, r, null, null, o).sid = l)
}
function op(e, t) {
    for (let i = 0; i < fi.length; ++i)
        fi[i].sid == e && (fi[i].range = t)
}
function ap(e) {
    k = el(e),
    k && k.startAnim()
}
function lp(e) {
    for (var t = 0; t < Oe.length; ++t)
        Oe[t].forcePos = !Oe[t].visible,
        Oe[t].visible = !1;
    if (e) {
        const i = Date.now();
        for (var t = 0; t < e.length; )
            k = el(e[t]),
            k ? (k.index = e[t + 1],
            k.t1 = k.t2 === void 0 ? i : k.t2,
            k.t2 = i,
            k.x1 = k.x,
            k.y1 = k.y,
            k.x2 = e[t + 2],
            k.y2 = e[t + 3],
            k.d1 = k.d2 === void 0 ? e[t + 4] : k.d2,
            k.d2 = e[t + 4],
            k.health = e[t + 5],
            k.dt = 0,
            k.visible = !0) : (k = ho.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1]),
            k.x2 = k.x,
            k.y2 = k.y,
            k.d2 = k.dir,
            k.health = e[t + 5],
            ho.aiTypes[e[t + 1]].name || (k.name = T.cowNames[e[t + 6]]),
            k.forcePos = !0,
            k.sid = e[t],
            k.visible = !0),
            t += 7
    }
}
const Ho = {};
function cp(e, t) {
    const i = e.index;
    let n = Ho[i];
    if (!n) {
        const s = new Image;
        s.onload = function() {
            this.isLoaded = !0,
            this.onload = null
        }
        ,
        s.src = "./img/animals/" + e.src + ".png",
        n = s,
        Ho[i] = n
    }
    if (n.isLoaded) {
        const s = e.scale * 1.2 * (e.spriteMlt || 1);
        t.drawImage(n, -s, -s, s * 2, s * 2)
    }
}
function ja(e, t, i) {
    return e + i >= 0 && e - i <= me && t + i >= 0 && t - i <= ge
}
function hp(e, t) {
    let i = gp(e[0]);
    i || (i = new Zh(e[0],e[1],T,A,Aa,$e,re,Oe,F,Hi,Li),
    re.push(i)),
    i.spawn(t ? Sn : null),
    i.visible = !1,
    i.x2 = void 0,
    i.y2 = void 0,
    i.setData(e),
    t && (P = i,
    ct = P.x,
    ht = P.y,
    Na(),
    Ka(),
    Ja(),
    Za(0),
    lr.style.display = "block")
}
function up(e) {
    for (let t = 0; t < re.length; t++)
        if (re[t].id == e) {
            re.splice(t, 1);
            break
        }
}
function fp(e, t) {
    P && (P.itemCounts[e] = t)
}
function dp(e, t, i) {
    P && (P[e] = t,
    i && Ka())
}
function pp(e, t) {
    k = Hn(e),
    k && (k.health = t)
}
function mp(e) {
    const t = Date.now();
    for (var i = 0; i < re.length; ++i)
        re[i].forcePos = !re[i].visible,
        re[i].visible = !1;
    for (var i = 0; i < e.length; )
        k = Hn(e[i]),
        k && (k.t1 = k.t2 === void 0 ? t : k.t2,
        k.t2 = t,
        k.x1 = k.x,
        k.y1 = k.y,
        k.x2 = e[i + 1],
        k.y2 = e[i + 2],
        k.d1 = k.d2 === void 0 ? e[i + 3] : k.d2,
        k.d2 = e[i + 3],
        k.dt = 0,
        k.buildIndex = e[i + 4],
        k.weaponIndex = e[i + 5],
        k.weaponVariant = e[i + 6],
        k.team = e[i + 7],
        k.isLeader = e[i + 8],
        k.skinIndex = e[i + 9],
        k.tailIndex = e[i + 10],
        k.iconIndex = e[i + 11],
        k.zIndex = e[i + 12],
        k.visible = !0),
        i += 13
}
function gp(e) {
    for (let t = 0; t < re.length; ++t)
        if (re[t].id == e)
            return re[t];
    return null
}
function Hn(e) {
    for (let t = 0; t < re.length; ++t)
        if (re[t].sid == e)
            return re[t];
    return null
}
function el(e) {
    for (let t = 0; t < Oe.length; ++t)
        if (Oe[t].sid == e)
            return Oe[t];
    return null
}
function tl(e) {
    for (let t = 0; t < Ot.length; ++t)
        if (Ot[t].sid == e)
            return Ot[t];
    return null
}
let il = -1;
function yp() {
    const e = Date.now() - il;
    window.pingTime = e,
    Wi.innerText = "Ping: " + e + " ms"
}
let Ss;
function nl() {
    Ss && clearTimeout(Ss),
    rr() && (il = Date.now(),
    pe.send("0")),
    Ss = setTimeout(nl, 2500)
}
function wp(e) {
    if (e < 0)
        return;
    const t = Math.floor(e / 60);
    let i = e % 60;
    i = ("0" + i).slice(-2),
    yo.innerText = "Server restarting in " + t + ":" + i,
    yo.hidden = !1
}
window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60)
    }
}();
function sl() {
    ui = Date.now(),
    Ve = ui - co,
    co = ui,
    Xd(),
    requestAnimFrame(sl)
}
tp();
sl();
function rl(e) {
    window.open(e, "_blank")
}
window.openLink = rl;
window.aJoinReq = Vs;
window.follmoo = Yf;
window.kickFromClan = Ba;
window.sendJoin = Ha;
window.leaveAlliance = La;
window.createAlliance = Ns;
window.storeBuy = Fa;
window.storeEquip = Xs;
window.showItemInfo = Ue;
window.selectSkinColor = Cd;
window.changeStoreIndex = bd;
window.config = T;


const macros = {
    'g': 'Soldier',
    'm': 'Bull',
    'right click': 'Tank',
    'l': 'Turret Gear',
    'u': 'Plague Mask',
    'o': 'Booster Hat',
    'p': 'Winter Hat',
    'k': 'Flipper Hat'
};

function hat(id, type) {
 Fa(id, type)
 Xs(id, type)
}

// Event listener for key 'g'
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'g':
            hat(6, 0);
            break;
        case 'm':
            hat(7, 0);
            break;
        case 'l':
            hat(53, 0);
            break;
        case 'u':
            hat(21, 0);
            break;
        case 'o':
            hat(12);
            break;
        case 'p':
            hat(15, 0);
            break;
        case 'k':
            hat(31, 0);
            break;
    }
});

document.addEventListener('mousedown', function(event) {
    if (event.button === 2) {
        hat(40, 0);
    } else if (event.button === 0) {
        hat(7, 0);
        const mouseUpListener = function() {
            hat(6, 0);
            document.removeEventListener('mouseup', mouseUpListener);
        };
        document.addEventListener('mouseup', mouseUpListener);
    }
});



// Create a menu element to display the macro keys and actions
const menu = document.createElement('div');
menu.style.position = 'fixed';
menu.style.top = '10px';
menu.style.left = '10px';
menu.style.width = '200px'; // Make it 2x wider
menu.style.height = '220px'; // Make it square
menu.style.background = 'rgba(255, 255, 255, 0.7)';
menu.style.padding = '10px';
menu.style.fontSize = '20px'; // Increase the font size
menu.style.fontFamily = 'HammerSmith, sans-serif'; // Use the "HammerSmith" font

// Set the border-radius property to make the menu rounded with a 6px radius
menu.style.borderRadius = '6px';

// Populate the menu with the macro keys and actions
for (const key in macros) {
    const macroItem = document.createElement('p');
    macroItem.textContent = `${key} = ${macros[key]}`;
    menu.appendChild(macroItem);
}



document.body.appendChild(menu);
