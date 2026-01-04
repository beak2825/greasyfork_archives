const msgpacklib = {
    reader: class {
        constructor(t, e = 0) {
            return this.buffer = t, this.dv = new DataView(this.buffer.buffer || this.buffer), this.offset = e, this
        }
        readString(t) {
            let e = (t || this.dv.getUint8(this.offset++)) - 160,
                s = "";
            for (let t = 0; t < e; t++) s += String.fromCharCode(this.dv.getUint8(this.offset++));
            return s
        }
        getArrayLegth() {
            return this.dv.getUint8(this.offset++) - 144
        }
        readData() {
            let t = this.dv.getUint8(this.offset++);
            if (t < 128) return t;
            if (t > 223) return this.dv.getInt8(this.offset - 1);
            if (192 === t) return null;
            if (195 === t) return !0;
            if (194 === t) return !1;
            if (t > 202 && t < 2010) switch (t) {
                case 203:
                    return this.offset += 8, this.dv.getFloat64(this.offset - 8);
                case 204:
                    return this.dv.getUint8(this.offset++);
                case 205:
                    return this.offset += 2, this.dv.getUint16(this.offset - 2);
                case 206:
                    return this.offset += 4, this.dv.getUint32(this.offset - 4);
                case 208:
                    return this.dv.getInt8(this.offset++);
                case 209:
                    return this.dv.getInt16((this.offset += 2) - 2)
            } else {
                if (t > 159 && t < 192) return this.readString(t);
                if (t > 143 && t < 160 || 220 === t) {
                    let e = 220 === t ? this.dv.getUint16((this.offset += 2) - 2) : t - 144,
                        s = [];
                    for (let t = 0; t < e; t++) s.push(this.readData());
                    return s
                }
                if (t > 127 && t < 144) {
                    let e = t - 128,
                        s = {};
                    for (let t = 0; t < e; t++) s[this.readString()] = this.readData();
                    return s
                }
            }
        }
    },
    writer: class {
        constructor(t = 1, e) {
            return 0 === t && (t = 1), this.offset = 0, this.buffer = new Uint8Array(t), this.dv = new DataView(this.buffer.buffer), this.setInt(146, !0), this
        }
        inflate(t = 1) {
            if (this.offset + t < this.buffer.length) return;
            let e = new Uint8Array(2 * this.buffer.length);
            this.buffer.forEach((t, s) => e[s] = t), this.buffer = e, this.dv = new DataView(this.buffer.buffer), t + this.offset >= this.buffer.length && this.inflate(t)
        }
        setFloat(t) {
            return this.inflate(8), this.dv.setFloat64(this.offset, t), this.offset += 8, this
        }
        setInt(t, e) {
            return !e && t > 127 && (this.inflate(), this.dv.setUint8(this.offset++, 204)), this.inflate(), this.dv.setUint8(this.offset++, t), this
        }
        setString(t) {
            return t.length >= 32 ? (this.setInt(217, !0), this.setInt(t.length, !0)) : this.setInt(160 + t.length, !0), t.split("").forEach(t => this.setInt(t.charCodeAt(), !0)), this
        }
        get arraybuffer() {
            return this.buffer.slice(0, this.offset)
        }
    }
};
window.msgpacklib = msgpacklib;