// ==UserScript==
// @name  Increase SB Server Size
// @description Increases the the size of Sandbox servers
// @author TheThreeBowlingBulbs
// @match  *://florr.io/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/812261
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/450755/Increase%20SB%20Server%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/450755/Increase%20SB%20Server%20Size.meta.js
// ==/UserScript==
class Florr {
    constructor() {
        this.index = 0;
        this.packet;
        this.buffer = new ArrayBuffer(4);
        this._u8 = new Uint8Array(this.buffer);
        this._i32 = new Int32Array(this.buffer);
        this._f32 = new Float32Array(this.buffer);
        this.init();
        this.ready = false;
    }
    endianSwap(val) { return ((val & 0xff) << 24) | ((val & 0xff00) << 8) | ((val >> 8) & 0xff00) | ((val >> 24) & 0xff) }
    u8() { return this.packet[this.index++] }
    vu() {
        let out = 0, at = 0;
        while (this.packet[this.index] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
    vi() {
        const out = this.vu();
        return (0 - (out & 1)) ^ (out >>> 1);
    }
    vf() {
        this._i32[0] = this.endianSwap(this.vi());
        return this._f32[0];
    }
    getConfig(bin) {
        const unreachable = 0x00, block = 0x02, loop = 0x03, if_ = 0x04, else_ = 0x05, end = 0x0b, br_if = 0x0d,
              call = 0x10, drop = 0x1a,
              local_get = 0x20, local_set = 0x21, local_tee = 0x22, global_set = 0x24, i32_load = 0x28, f32_load = 0x2a, f64_load = 0x2b, i32_load8_s = 0x2c, i32_load8_u = 0x2d,
              i32_store = 0x36, i64_store = 0x37, i32_store8 = 0x3a, i32_store16 = 0x3b,
              memory_grow = 0x40, i32_const = 0x41, i64_const = 0x42, i32_eqz = 0x45, i32_eq = 0x46, i32_lt_u = 0x49,
              f32_eq = 0x5b, f32_lt = 0x5d, f32_gt = 0x5e,
              i32_add = 0x6a, i32_sub = 0x6b,
              i32_and = 0x71, i32_or = 0x72, i32_xor = 0x73;
        const i32 = 0x7f, i64 = 0x7e, f32 = 0x7d, f64 = 0x4c;
        const param = 0x01, local = 0x02;
        const wasmRegex = regex => {
            let ret = [];
            jump: for (let n = 0; n < this.packet.length - regex.length; n++) {
                this.index = n;
                ret = [];
                for (let p = 0; p < regex.length; p++) {
                    if (regex[p] === '*') this.vu();
                    else if (regex[p] === '+') ret.push(this.vu());
                    else if (this.u8() !== regex[p]) continue jump;
                }
                return ret;
            }
            return false;
        }
        const components = ['0','collidable','2','GUI','4','5','playerInfo','mob','drop','position','11','nameable','13','14','15','16','17','18','19',20,21,22,23,'renderable',25,'petal',27];
        let entListPtr, offset, entSize, c = [], componentOffsets = {};
        const funcs = [];
        this.packet = new Uint8Array(bin);
        this.index = 8;
        while (this.index < this.packet.length) {
            const id = this.vu();
            const sectionLen = this.vu();
            if (id !== 10) {
                this.index += sectionLen;
                continue;
            }
            const bodyCount = this.vu();
            for (let i = 0; i < bodyCount; i++) {
                const len = this.vu();
                funcs.push(this.packet.subarray(this.index, this.index += len));
            }
            break;
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex([
                               12,
                               i32,
                               local_get, '*',
                               i32_load, '*', '+'])) c.push(a[0]);
            if (a = wasmRegex([i32_const, '+',
                               i32_add,
                               local_set, '*',
                               loop, '*',
                               local_get, '*',
                               i32_const,
                               '+',
                               i32_sub,
                               call])) [offset, entSize] = a;
            if (a = wasmRegex([drop,
                               i32_const, '*',
                               i32_const, '*',
                               i32_store, '*', '*',
                               i32_const, '+',
                               call])) entListPtr = a[0];
        }
        components.forEach((name,index) => {
            componentOffsets[name] = c[index];
        })
        this.config = { entListPtr, offset, entSize, componentOffsets };
        console.log("Done with config");
    }
    init() {
        const that = this;
        WebAssembly.instantiateStreaming = (r, i) => (r.arrayBuffer().then(b => WebAssembly.instantiate(b, i)));
        const _instantiate = WebAssembly.instantiate;
        WebAssembly.instantiate = (bin,imports) => {
            that.getConfig(bin);
            return _instantiate(bin, imports).then(wasm => {
                for (const exp of Object.values(wasm.instance.exports)) {
                    if (exp.buffer) {
                        const buffer = exp.buffer;
                        that.HEAPU8 = new Uint8Array(buffer);
                        that.HEAP8 = new Int8Array(buffer);
                        that.HEAPU16 = new Uint16Array(buffer);
                        that.HEAP32 = new Int32Array(buffer);
                        that.HEAPF32 = new Float32Array(buffer);
                        that.HEAPF64 = new Float64Array(buffer);
                        that.ready = true;
                        break;
                    }
                }
                this.entHandler();
                return wasm;
            });
        }
    }
}
window.florr = new Florr();