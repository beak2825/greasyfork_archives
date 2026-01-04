// ==UserScript==
// @name         florr megg timer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  shows 15s timer for mythic egg/yggdrasil
// @author       bismuth
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/453869/florr%20megg%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/453869/florr%20megg%20timer.meta.js
// ==/UserScript==
class Automator {
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
    getConfig(bin) {
        const unreachable = 0x00, block = 0x02, loop = 0x03, if_ = 0x04, else_ = 0x05, end = 0x0b, br = 0x0c, br_if = 0x0d,
              call = 0x10, drop = 0x1a,
              local_get = 0x20, local_set = 0x21, local_tee = 0x22, global_set = 0x24, i32_load = 0x28, f32_load = 0x2a, f64_load = 0x2b, i32_load8_s = 0x2c, i32_load8_u = 0x2d, i32_load16_u = 0x2f,
              i32_store = 0x36, i64_store = 0x37, f32_store = 0x38, i32_store8 = 0x3a, i32_store16 = 0x3b,
              memory_grow = 0x40, i32_const = 0x41, i64_const = 0x42, f32_const = 0x43, i32_eqz = 0x45, i32_eq = 0x46, i32_lt_s = 0x48, i32_lt_u = 0x49,
              f32_eq = 0x5b, f32_lt = 0x5d, f32_gt = 0x5e,
              i32_add = 0x6a, i32_sub = 0x6b,
              i32_and = 0x71, i32_or = 0x72, i32_xor = 0x73,
              f32_add = 0x92, f32_sub = 0x93, f32_mul = 0x94,
              f32_demote_f64 = 0xb6;
        const i32 = 0x7f, i64 = 0x7e, f32 = 0x7d, f64 = 0x4c;
        const param = 0x01, local = 0x02;
        Number.prototype.fromvu = function() {
            let _ = this;
            const ret = [];
            while (_ >= 128) {
                ret.push((_ & 127) | 128);
                _ >>= 7;
            }
            ret.push(_);
            return ret;
        }
        Number.prototype.fromfloat = function() {
            return [...new Uint8Array(new Float32Array([this]).buffer)];
        }
        Array.prototype.countingOccurences = function(val) {
            let count = 0;
            for (const a of this) if (a === val) count++;
            return count;
        }
        const wasmRegex = (regex, repeat = false, start = 0) => {
            let ret = [], rets = [];
            jump: for (let n = start; n < this.packet.length - regex.length; n++) {
                this.index = n;
                ret = [];
                for (let p = 0; p < regex.length; p++) {
                    if (regex[p] === '*') this.vu();
                    else if (regex[p] === '+') ret.push(this.vu());
                    else if (this.u8() !== regex[p]) continue jump;
                }
                ret.index = n;
                if (repeat) rets.push(ret);
                else return ret;
            }
            return rets.length? rets: false;
        }
        const components = ['GUI','player'];
        let entListPtr, offset, entSize, componentOffsets = {}, fieldOffsets = {}, animatedBasePtrPtr, animatedOffset, arenaDimAnimated, squadCodeOffset;
        const c = [], fIndex = [];
        const funcs = [];
        const field_func = new Array(150).fill().map((_,ind) => ind & 1? '*': block);
        let count = 0;
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
            /*
            if (a = wasmRegex([
                f32_const, ...(10).fromfloat(),
                f32_add,
                local_set, '*',
                end], true)) {
                for (const b of a) {
                    const d = b.index;
                    console.log(this.packet.slice(d,d+9));
                    this.packet.set([i32_const,0,f32_load,0,0], d);
                    count++;
                }
                console.log([
                f32_const, ...(10).fromfloat(),
                f32_add,
                local_set, '*',
                end])
                console.log(a);
            }
            */
            if (a = wasmRegex([
                12,
                i32,
                local_get, '*',
                i32_load, '*', '+'])) { c.push(a[0]); fIndex.push(funcIndex+358)}
            if (a = wasmRegex([i32_add,
                               call, '*',
                               block, '*',
                               i32_const, '*',
                               i32_load8_s, '*', '*',
                               i32_const, 0,
                               i32_lt_s,
                               if_, '*',
                               i32_const, '+',
                               i32_load, '*', '*',
                               i32_const, 0])) squadCodeOffset = a[0];
            if (a = wasmRegex([f32_load, '*', '*',
                               f32_mul,
                               local_tee, '*',
                               i32_const, '+',
                               f32_load])) arenaDimAnimated = a[0];
            if (a = wasmRegex([br_if, '*',
                               local_get, '*',
                               i32_const, '+',
                               i32_add,
                               local_set, '*',
                               i32_const, 1,
                               local_set, '*',
                               block])) fieldOffsets.petalsCollected = a[0];
            if (a = wasmRegex([i32_const, '+',
                               i32_add,
                               local_set, '*',
                               loop, '*',
                               local_get, '*',
                               i32_const, '+',
                               i32_sub,
                               call])) [offset, entSize] = a;
            if (a = wasmRegex([drop,
                               i32_const, '*',
                               i32_const, '*',
                               i32_store, '*', '*',
                               i32_const, '+',
                               call])) entListPtr = a[0];
            if (a = wasmRegex([f64_load, '*', '*',
                               f32_demote_f64,
                               local_get, '*',
                               i32_const, '+',
                               i32_add,
                               f32_load, '*', '*',
                               f32_sub,
                               f32_mul,
                               local_get, '*',
                               i32_const])) animatedOffset = a[0];
            if (a = wasmRegex([f32_load, '*', '+',
                               f32_store, '*', '+',
                               local_get, '*',
                               local_get, '*',
                               f32_load, '*', '+',
                               f32_store, '*', '+',
                               end])) {
                fieldOffsets.x = a[0];
                fieldOffsets.prevx = a[1];
                fieldOffsets.y = a[2];
                fieldOffsets.prevy = a[3];
            }
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex(field_func)) {
                const start = this.index;
                a = wasmRegex([block, '*',
                               local_get, '*',
                               call, '+',
                               local_tee, '*',
                               i32_load8_u, '*', '*',
                               i32_eqz,
                               if_, '*',
                               local_get, '*',
                               f32_load, '*', '+'], true, start)
                for (const [compFunc, offset] of a) {
                    if (fIndex.indexOf(compFunc) > 6) {
                        componentOffsets.renderable = c[fIndex.indexOf(compFunc)];
                        fieldOffsets.radius = offset;
                        break;
                    }
                }
                a = wasmRegex([end,
                               local_get, '*',
                               call, '+',
                               local_set, '*',
                               block], true, start);
                a = a.map(_ => _[0]);
                let b = [];
                for (let values of a) if (a.countingOccurences(values) === 3 && b.indexOf(values) === -1) b.push(values);
                if (b[0] < b[1]) componentOffsets.mob = c[fIndex.indexOf(b[0])];
                else componentOffsets.mob = c[fIndex.indexOf(b[1])];
                a = wasmRegex([end,
                               local_get, '*',
                               call, '+',
                               local_set, '*',
                               local_get, '*',
                               local_get, '*',
                               call, '*',
                               local_get, '*',
                               local_get, '*',
                               i32_load16_u, '*', '*',
                               i32_store16, '*', '+'], true, start);
                for (const [compFunc, offset] of a) {
                    if (fIndex.indexOf(compFunc) < 10) {
                        componentOffsets.drop = c[fIndex.indexOf(compFunc)];
                        fieldOffsets.dropID = offset;
                        fieldOffsets.dropRarity = offset+1;
                        break;
                    }
                }
                a = wasmRegex([block, '*',
                               local_get, '*',
                               call, '+',
                               local_tee, '*',
                               i32_load8_u], true, start);
                a = a.map(_ => _[0]);
                for (let values of a) if (a.countingOccurences(values) === 2) componentOffsets.position = c[fIndex.indexOf(values)];
                const mobFunc = fIndex[c.indexOf(componentOffsets.mob)];
                const dropFunc = fIndex[c.indexOf(componentOffsets.drop)];
                const playerFunc = fIndex[1];
                wasmRegex([end,
                           local_get, '*',
                           call, ...dropFunc.fromvu(),
                           local_set, '*',
                           block], false, start);
                fieldOffsets.dropRenderFlag = wasmRegex([i32_store8, '*', '+', br],false,this.index)[0];
                wasmRegex([end,
                           local_get, '*',
                           call, ...dropFunc.fromvu(),
                           local_set, '*',
                           local_get, '*',
                           i32_load], false, start);
                fieldOffsets.dropCount = wasmRegex([i32_store, '*', '+', br],false,this.index)[0];
                fieldOffsets.petalCooldown = wasmRegex([call, ...playerFunc.fromvu(),
                                                        i32_const, '+',
                                                        i32_add,
                                                        local_set, '*',
                                                        local_get, '*'], false, start)[0];
                fieldOffsets.inventory = wasmRegex([call, ...playerFunc.fromvu(),
                                                    i32_const, '+',
                                                    i32_add,
                                                    local_set, '*',
                                                    i32_const, '*'], false, start)[0];
                break;
            }
        }
        for (let funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            let a;
            this.packet = funcs[funcIndex];
            if (a = wasmRegex([i32_load, '*', ...componentOffsets.mob.fromvu(),
                               i32_load8_u, '*', '+',
                               local_tee, '*',
                               local_get, '*',
                               i32_load, '*', '*',
                               i32_load8_u, '*', '*'])) {
                fieldOffsets.mobRarity = a[0];
                if (fieldOffsets.isFriendly) fieldOffsets.mobID = 27 - fieldOffsets.isFriendly - fieldOffsets.mobRarity;
            }
            if (a = wasmRegex([local_get, '*',
                               if_, '*',
                               local_get, '*',
                               i32_load, '*', ...componentOffsets.mob.fromvu(),
                               i32_load8_u, '*', '+'])) {
                fieldOffsets.isFriendly = a[0];
                if (fieldOffsets.mobRarity) fieldOffsets.mobID = 27 - fieldOffsets.isFriendly - fieldOffsets.mobRarity;
            }
        }
        components.forEach((name,index) => { componentOffsets[name] = c[index]; })
        this.config = { entListPtr, offset, entSize, componentOffsets, fieldOffsets, animatedOffset, arenaDimAnimated, squadCodeOffset };
        console.log("Done with config", fIndex);
    }
    init() {
        const that = this;
        WebAssembly.instantiateStreaming = (r, i) => (r.arrayBuffer().then(b => WebAssembly.instantiate(b, i)));
        const _instantiate = WebAssembly.instantiate;
        WebAssembly.instantiate = new Proxy(WebAssembly.instantiate, {
            apply(t,ta,[bin,imports]) {
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
                    that.loop();
                    return wasm;
                });
            }
        });
    }
    meggTimer() {
        const { HEAPF32, HEAP32, HEAPU16, HEAPU8 } = this;
        const { entListPtr, offset, entSize, animatedOffset, componentOffsets, fieldOffsets, arenaDimAnimated } = this.config;
        const camInfo = HEAPF32.subarray(entListPtr + animatedOffset >> 2, entListPtr + animatedOffset + 12 >> 2);
        const { inventory, petalCooldown, dropID, radius, x, y } = fieldOffsets;
        const { player, drop, renderable, mob, position } = componentOffsets;
        const {ctx} = this;
        ctx.setTransform(1,0,0,1,0,0);
        this.scale = Math.max(this.canvas.width/1920, this.canvas.height/1080);
        if (!this.playerEnt[player >> 2]) {
            for (let n = 0; n < 8192; n++) {
                if (this.entities[n][player >> 2] && HEAP32[this.entities[n][player >> 2] + inventory >> 2]) {
                    this.playerEnt = this.entities[n];
                    break;
                }
            }
        }
        const playerComponent = this.playerEnt[player >> 2];
        const time = performance.now();
        ctx.setTransform(1,0,0,1,0,0);
        for (let n = 0; n < 8; n++) {
            if (HEAPU16[playerComponent + petalCooldown + 2 * n >> 1] !== 65535) { this.lastLoaded[n] = time; continue; }
            if (HEAPU8[playerComponent + inventory + 2 * n] !== 16 && HEAPU8[playerComponent + inventory + 2 * n] !== 30 ) continue;
            if (camInfo[0] && camInfo[1] && camInfo[2] <= 0.9 && this.toggle) {
                const timeDiff = Math.min((time - this.lastLoaded[n]) / 1000, 15);
                ctx.setTransform(1,0,0,1,this.canvas.width/2,this.canvas.height - 200*this.scale);
                ctx.lineCap = 'round';
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#333333';
                ctx.beginPath();
                ctx.moveTo((n-3.9)*this.scale*this.length,0);
                ctx.lineTo((n-3.1)*this.scale*this.length,0);
                ctx.stroke();
                ctx.lineWidth = 5;
                ctx.strokeStyle = timeDiff < 15? '#ff0000':'#85e37d';
                ctx.beginPath();
                ctx.moveTo((0.8*this.scale*this.length)/15*timeDiff+(n-3.9)*this.scale*this.length,0);
                ctx.lineTo((n-3.9)*this.scale*this.length,0);
                ctx.stroke();
                ctx.lineWidth = 0.9;
                ctx.setTransform(1,0,0,1,0,0);
            }
            else if (!(camInfo[0] && camInfo[1] && camInfo[2] <= 0.9)) for (let n = 0; n < 8; n++) this.lastLoaded[n] = performance.now();
        }
    }
    loop() {
        this.alive = false;
        this.canvas = document.getElementById('canvas'); this.ctx = this.canvas.getContext('2d');
        const { HEAPF32, HEAP32, HEAPU16, HEAPU8 } = this;
        const { entListPtr, offset, entSize, animatedOffset, componentOffsets, fieldOffsets, arenaDimAnimated } = this.config;
        const { inventory, petalCooldown, dropID, radius, x, y } = fieldOffsets;
        const { player, drop, renderable, mob, position } = componentOffsets;
        this.camInfo = HEAPF32.subarray(entListPtr + animatedOffset >> 2, entListPtr + animatedOffset + 12 >> 2);
        this.playerEnt = new Uint8Array(1000);
        this.lastLoaded = new Float32Array(8);
        this.length = 90;
        this.toggle = false; this.scale = 1;
        //const toX = x => (x - camInfo[0]) * (scale*camInfo[2]) + canvas.width / 2;
        //const toY = y => (y - camInfo[1]) * (scale*camInfo[2]) + canvas.height / 2;
        //preload entities with subarray
        let at = entListPtr + offset;
        this.entities = [];
        for (let n = 0; n < 8192; n++) this.entities.push(HEAP32.subarray(at >> 2, (at += entSize) >> 2));
        document.onkeydown = ({code}) => { if (code === 'KeyQ') this.toggle ^= true; }
        const that = this;
        window.requestAnimationFrame = new Proxy(requestAnimationFrame, {
            apply(t,ta,a) {
                that.meggTimer();
                that.alive = that.camInfo[2] <= 0.9;
                return t.apply(ta,a);
            }
        });
    }
}
window.automator = new Automator();