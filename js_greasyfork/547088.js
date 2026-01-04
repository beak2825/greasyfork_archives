/*
 * MooMoo Mini MsgPack
 * Lightweight MessagePack encoder/decoder for MooMoo.io
 *
 * Usage:
 *   const [event, args] = miniMooMsgpack.decode(arrayBuffer);
 *   ws.send(miniMooMsgpack.encode(["packet", [data]]));
 *
 * Author: Nuro (notnuro0815)
 */
// moo-mini-pack.js
(function(r) {
    function o(b) {
        return b instanceof Uint8Array ? b : b instanceof ArrayBuffer ? new Uint8Array(b) : ArrayBuffer.isView(b) ? new Uint8Array(b.buffer, b.byteOffset, b.byteLength) : null
    }
    const TD = typeof TextDecoder != "undefined" && new TextDecoder("utf-8");
    const TE = typeof TextEncoder != "undefined" && new TextEncoder();

    function D(buf) {
        this.u = o(buf);
        if (!this.u) throw TypeError("need ArrayBuffer/Uint8Array");
        this.v = new DataView(this.u.buffer, this.u.byteOffset, this.u.byteLength);
        this.i = 0
    }
    D.prototype.b = function() {
        return this.u[this.i++]
    };
    D.prototype.u16 = function() {
        const x = this.v.getUint16(this.i);
        this.i += 2;
        return x
    };
    D.prototype.u32 = function() {
        const x = this.v.getUint32(this.i);
        this.i += 4;
        return x
    };
    D.prototype.i8 = function() {
        const x = this.v.getInt8(this.i);
        this.i += 1;
        return x
    };
    D.prototype.i16 = function() {
        const x = this.v.getInt16(this.i);
        this.i += 2;
        return x
    };
    D.prototype.i32 = function() {
        const x = this.v.getInt32(this.i);
        this.i += 4;
        return x
    };
    D.prototype.f64 = function() {
        const x = this.v.getFloat64(this.i);
        this.i += 8;
        return x
    };

    function strDec(d, n) {
        const a = d.u.subarray(d.i, d.i + n);
        d.i += n;
        return TD ? TD.decode(a) : String.fromCharCode.apply(null, a)
    }

    function arr(d, n) {
        const A = new Array(n);
        for (let i = 0; i < n; i++) A[i] = read(d);
        return A
    }

    function read(d) {
        const b = d.b();
        if (b <= 0x7f) return b;
        if ((b & 0xf0) === 0x90) return arr(d, b & 0x0f);
        if ((b & 0xe0) === 0xa0) return strDec(d, b & 0x1f);
        if ((b & 0xf0) === 0x80) throw Error("map unsupported");
        switch (b) {
            case 0xc0:
                return null;
            case 0xc2:
                return false;
            case 0xc3:
                return true;
            case 0xcb:
                return d.f64();
            case 0xcc:
                return d.b();
            case 0xcd:
                return d.u16();
            case 0xce:
                return d.u32();
            case 0xd0:
                return d.i8();
            case 0xd1:
                return d.i16();
            case 0xd2:
                return d.i32();
            case 0xd9:
                return strDec(d, d.b());
            case 0xda:
                return strDec(d, d.u16());
            case 0xdc:
                return arr(d, d.u16());
            case 0xdd:
                return arr(d, d.u32());
            default:
                if (b >= 0xe0) return (b << 24) >> 24;
                throw Error("type 0x" + b.toString(16));
        }
    }

    function E(cap) {
        cap = cap || 256;
        this.b = new Uint8Array(cap);
        this.v = new DataView(this.b.buffer);
        this.i = 0
    }
    E.prototype.g = function(n) {
        if (this.i + n <= this.b.length) return;
        const nb = new Uint8Array(Math.max(this.b.length * 2, this.i + n));
        nb.set(this.b);
        this.b = nb;
        this.v = new DataView(nb.buffer)
    };
    E.prototype.u8 = function(x) {
        this.g(1);
        this.b[this.i++] = x
    };
    E.prototype.u16 = function(x) {
        this.g(2);
        this.v.setUint16(this.i, x);
        this.i += 2
    };
    E.prototype.u32 = function(x) {
        this.g(4);
        this.v.setUint32(this.i, x);
        this.i += 4
    };
    E.prototype.i8 = function(x) {
        this.g(1);
        this.v.setInt8(this.i, x);
        this.i += 1
    };
    E.prototype.i16 = function(x) {
        this.g(2);
        this.v.setInt16(this.i, x);
        this.i += 2
    };
    E.prototype.i32 = function(x) {
        this.g(4);
        this.v.setInt32(this.i, x);
        this.i += 4
    };
    E.prototype.f64 = function(x) {
        this.g(8);
        this.v.setFloat64(this.i, x);
        this.i += 8
    };
    E.prototype.u8a = function(a) {
        this.g(a.length);
        this.b.set(a, this.i);
        this.i += a.length
    };

    function write(e, x) {
        if (x == null) {
            e.u8(0xc0);
            return
        }
        const t = typeof x;
        if (t === "boolean") {
            e.u8(x ? 0xc3 : 0xc2);
            return
        }
        if (t === "number") {
            if (Number.isInteger(x) && x >= -2147483648 && x <= 4294967295) {
                if (x >= 0) {
                    if (x < 0x80) {
                        e.u8(x);
                        return
                    }
                    if (x < 0x100) {
                        e.u8(0xcc);
                        e.u8(x);
                        return
                    }
                    if (x < 0x10000) {
                        e.u8(0xcd);
                        e.u16(x);
                        return
                    }
                    e.u8(0xce);
                    e.u32(x);
                    return
                }
                if (x >= -32) {
                    e.u8(0xe0 | (x + 32));
                    return
                }
                if (x >= -128) {
                    e.u8(0xd0);
                    e.i8(x);
                    return
                }
                if (x >= -32768) {
                    e.u8(0xd1);
                    e.i16(x);
                    return
                }
                e.u8(0xd2);
                e.i32(x);
                return
            }
            e.u8(0xcb);
            e.f64(x);
            return
        }
        if (t === "string") {
            const a = TE ? TE.encode(x) : new Uint8Array(x.split("").map(c => c.charCodeAt(0) & 255));
            const n = a.length;
            if (n < 32) {
                e.u8(0xa0 | n);
                e.u8a(a);
                return
            }
            if (n < 0x100) {
                e.u8(0xd9);
                e.u8(n);
                e.u8a(a);
                return
            }
            e.u8(0xda);
            e.u16(n);
            e.u8a(a);
            return
        }
        if (Array.isArray(x)) {
            const n = x.length;
            if (n < 16) e.u8(0x90 | n);
            else if (n < 0x10000) {
                e.u8(0xdc);
                e.u16(n)
            } else {
                e.u8(0xdd);
                e.u32(n)
            }
            for (let i = 0; i < n; i++) write(e, x[i]);
            return
        }
        // maps not needed for MooMoo; add if ever seen
        throw Error("unsupported type: " + t)
    }

    function encode(x) {
        const e = new E();
        write(e, x);
        return e.b.slice(0, e.i)
    }
    r.miniMooMsgpack = {
        decode: (u) => read(new D(u)),
        encode
    };
})(typeof module == "object" ? module.exports : window);