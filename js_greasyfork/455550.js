// ==UserScript==
// @name         wasm parser
// @version      1.0
// @description  used to modify wasm
// @author       bismuth
// ==/UserScript==
const OP = {
    "unreachable": 0,
    "nop": 1,
    "block": 2,
    "loop": 3,
    "if": 4,
    "else": 5,
    "end": 11,
    "br": 12,
    "br_if": 13,
    "br_table": 14,
    "return": 15,
    "call": 16,
    "call_indirect": 17,
    "drop": 26,
    "select": 27,
    "local": {
        "get": 32,
        "set": 33,
        "tee": 34
    },
    "global": {
        "get": 35,
        "set": 36
    },
    "i32": {
        "load": 40,
        "load8_s": 44,
        "load8_u": 45,
        "load16_s": 46,
        "load16_u": 47,
        "store": 54,
        "store8": 58,
        "store16": 59,
        "const": 65,
        "eqz": 69,
        "eq": 70,
        "ne": 71,
        "lt_s": 72,
        "lt_u": 73,
        "gt_s": 74,
        "gt_u": 75,
        "le_s": 76,
        "le_u": 77,
        "ge_s": 78,
        "ge_u": 79,
        "clz": 103,
        "ctz": 104,
        "popcnt": 105,
        "add": 106,
        "sub": 107,
        "mul": 108,
        "div_s": 109,
        "div_u": 110,
        "rem_s": 111,
        "rem_u": 112,
        "and": 113,
        "or": 114,
        "xor": 115,
        "shl": 116,
        "shr_s": 117,
        "shr_u": 118,
        "rotl": 119,
        "rotr": 120,
        "wrap_i64": 167,
        "wrap_f32_s": 168,
        "wrap_f32_u": 169,
        "wrap_f64_s": 170,
        "wrap_f64_u": 171,
        "reinterpret_f32": 188
    },
    "i64": {
        "load": 41,
        "load8_s": 48,
        "load8_u": 49,
        "load16_s": 50,
        "load16_u": 51,
        "load32_s": 52,
        "load32_u": 53,
        "store": 55,
        "store8": 60,
        "store16": 61,
        "store32": 62,
        "const": 66,
        "eqz": 80,
        "eq": 81,
        "ne": 82,
        "lt_s": 83,
        "lt_u": 84,
        "gt_s": 85,
        "gt_u": 86,
        "le_s": 87,
        "le_u": 88,
        "ge_s": 89,
        "ge_u": 90,
        "clz": 121,
        "ctz": 122,
        "popcnt": 123,
        "add": 124,
        "sub": 125,
        "mul": 126,
        "div_s": 127,
        "div_u": 128,
        "rem_s": 129,
        "rem_u": 130,
        "and": 131,
        "or": 132,
        "xor": 133,
        "shl": 134,
        "shr_s": 135,
        "shr_u": 136,
        "rotl": 137,
        "rotr": 138,
        "extend_i32_s": 172,
        "extend_i32_u": 173,
        "trunc_f32_s": 174,
        "trunc_f32_u": 175,
        "trunc_f64_s": 176,
        "trunc_f64_u": 177,
        "reinterpret_f64": 189
    },
    "f32": {
        "load": 42,
        "store": 56,
        "const": 67,
        "eq": 91,
        "ne": 92,
        "lt": 93,
        "gt": 95,
        "le": 94,
        "ge": 96,
        "abs": 139,
        "neg": 140,
        "ceil": 141,
        "floor": 142,
        "trunc": 143,
        "nearest": 144,
        "sqrt": 145,
        "add": 146,
        "sub": 147,
        "mul": 148,
        "div": 149,
        "min": 150,
        "max": 151,
        "copysign": 152,
        "convert_i32_s": 178,
        "convert_i32_u": 179,
        "convert_i64_s": 180,
        "convert_i64_u": 181,
        "demote_f64": 182,
        "reinterpret_i32": 190
    },
    "f64": {
        "load": 43,
        "store": 57,
        "const": 68,
        "eq": 97,
        "ne": 98,
        "lt": 99,
        "gt": 100,
        "le": 101,
        "ge": 102,
        "abs": 153,
        "neg": 154,
        "ceil": 155,
        "floor": 156,
        "trunc": 157,
        "nearest": 158,
        "sqrt": 159,
        "add": 160,
        "sub": 161,
        "mul": 162,
        "div": 163,
        "min": 164,
        "max": 165,
        "copysign": 166,
        "convert_i32_s": 183,
        "convert_i32_u": 184,
        "convert_i64_s": 185,
        "convert_i64_u": 186,
        "promote_f32": 187,
        "reinterpret_i64": 191
    },
    "memory": {
        "size": 63,
        "grow": 64
    }
};
class WASMSection {
    constructor(desc,length) {
        this.section = desc;
        this.body = new Array(length);
    }
}
class WASMParser {
    constructor(bin) {
        this.lexer = new Reader(new Uint8Array(bin));
        this.sections = new Array(13);
        this.adjustImports = 0;
        this.importFuncCount = 0;
        this.parseWASM();
    }
    read(bin) { this.lexer.packet = new Uint8Array(bin) }
    loadFunc(index) {
        this.lexer.set(this.sections[10].body[index - this.importFuncCount]);
        const localLength = this.lexer.vu();
        for (let n = 0; n < localLength; n++) {
            this.lexer.vu();
            this.lexer.u8();
        }
        return;
    }
    set(index, val = this.lexer.packet) {
        this.sections[10].body[index - this.importFuncCount] = val;
    }
    getAdjusted(index) {
        if (index < this.importFuncCount) return index;
        return index + this.adjustImports;
    }
    addImportEntry(options) {
        const map = ['f64','f32','i64','i32'];
        switch(options.kind) {
            case 'func':
                this.sections[2].body.push({
                    name: options.name,
                    type: "func",
                    index: this.sections[1].body.length,
                    isNew: true
                });
                this.sections[1].body.push({
                    param: options.params,
                    return: options.returns,
                    isNew: true
                });
                this.adjustImports++;
                return this.sections[2].body.length - 1;
            case 'global':
                this.sections[6].body.push({
                    type: options.type,
                    mutable: options.mutable,
                    value: options.mutable,
                    isNew: true
                });
                return this.sections[6].body.length - 1;
            default:
                throw new Error('oops, not supported yet');
        }
    }
    reindex() {
        let section = this.sections[10].body;
        let length = section.length;
        for (let n = 0; n < length; n++) this.sections[10].body[n] = this.parseFunction(section[n]);
        section = this.sections[9].body;
        length = section.length;
        for (let n = 0; n < length; n++) {
            const l = section[n].funcs.length;
            for (let p = 0; p < l; p++) this.sections[9].body[n].funcs[p] = this.getAdjusted(section[n].funcs[p]);
        }
        section = this.sections[7].body;
        length = section.length;
        for (let n = 0; n < length; n++) this.sections[7].body[n].index = this.getAdjusted(section[n].index);
        this.adjustImports = 0;
    }
    compile() {
        const bin = [0, 97, 115, 109, 1, 0, 0, 0];
        for (let n = 0; n < 12; n++) {
            if (!this.sections[n]) continue;
            const section = this[`compileSection0x${n.toString(16)}`]();
            bin.push(n);
            bin.push(...Writer.vu(section.length));
            for (const byte of section) bin.push(byte);
        }
        return new Uint8Array(bin);
    }
    compileSection0x1() {
        const map = ['f64','f32','i64','i32'];
        const section = this.sections[1].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(0x60);
            bin.push(...Writer.vu(section[n].param.length));
            for (const param of section[n].param) bin.push(map.indexOf(param) + 0x7C);
            bin.push(...Writer.vu(section[n].return.length));
            for (const param of section[n].return) bin.push(map.indexOf(param) + 0x7C);
        }
        return bin;
    }
    compileSection0x2() {
        const map = ['func','table','mem','global'];
        const section = this.sections[2].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            const nameSplit = section[n].name.split('.');
            for (const part of nameSplit) bin.push(...Writer.stringLEN(part));
            bin.push(map.indexOf(section[n].type));
            bin.push(...Writer.vu(section[n].index));
            //console.log(bin);
        }
        return bin;
    }
    compileSection0x3() {
        const section = this.sections[3].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) bin.push(...Writer.vu(section[n]));
        return bin;
    }
    compileSection0x4() {
        const section = this.sections[4].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) for (let p = 0; p < 4; p++) bin.push(...Writer.vu(section[n][p]));
        return bin;
    }
    compileSection0x5() {
        const section = this.sections[5].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(...Writer.vu(section[n].type));
            bin.push(...Writer.vu(section[n].limit[0]));
            bin.push(...Writer.vu(section[n].limit[1]));
        }
        return bin;
    }
    compileSection0x6() {
        const map = ['f64','f32','i64','i32'];
        const section = this.sections[6].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(map.indexOf(section[n].type) + 0x7C);
            bin.push(section[n].mutable);
            for (const expr of section[n].expr) bin.push(...Writer.vu(expr));
            bin.push(11);
        }
        return bin;
    }
    compileSection0x7() {
        const map = ['func','table','mem','global'];
        const section = this.sections[7].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(...Writer.stringLEN(section[n].name));
            bin.push(map.indexOf(section[n].type));
            bin.push(...Writer.vu(section[n].index));
        }
        return bin;
    }
    compileSection0x8() {
        const section = this.sections[8].body;
        const length = 1;
        const bin = [1];
        bin.push(...Writer.vu(section));
        return bin;
    }
    compileSection0x9() {
        const section = this.sections[9].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(section[n].type, section[n].expr[0]);
            bin.push(...Writer.vi(section[n].expr[1]),11);
            bin.push(...Writer.vu(section[n].funcs.length));
            for (const funcIdx of section[n].funcs) bin.push(...Writer.vu(funcIdx));
        }
        return bin;
    }
    compileSection0xa() {
        const section = this.sections[10].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            //section[n] = this.parseFunction(section[n]);
            bin.push(...Writer.vu(section[n].length));
            for (const byte of section[n]) bin.push(byte);
        }
        return bin;
    }
    compileSection0xb() {
        const section = this.sections[11].body;
        const length = section.length;
        const bin = Writer.vu(length);
        for (let n = 0; n < length; n++) {
            bin.push(section[n].type,section[n].expr[0]);
            bin.push(...Writer.vi(section[n].expr[1]),11);
            bin.push(...Writer.vu(section[n].contents.length));
            for (const byte of section[n].contents) bin.push(byte);
        }
        return bin;
    }
    parseWASM() {
        this.lexer.index = 8;
        while (this.lexer.has()) {
            const id = this.lexer.u8();
            if (id > 12) return;
            this[`parseSection0x${id.toString(16)}`]();
        }
        this.importFuncCount = this.sections[2].body.filter(({type}) => type === 'func').length;
    }
    parseSection0x1() {
        const map = ['f64','f32','i64','i32'];
        const rawLength = this.lexer.vu();
        const section = new WASMSection('functypes', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            const type = { param: [], return: [] }
            if (this.lexer.u8() !== 0x60) break;
            let len = this.lexer.vu();
            for (let n = 0; n < len; n++) type.param.push(map[this.lexer.u8()-0x7C]);
            len = this.lexer.vu();
            for (let n = 0; n < len; n++) type.return.push(map[this.lexer.u8()-0x7C]);
            section.body[n] = type;
        }
        return (this.sections[1] = section);
    }
    parseSection0x2() {
        const map = ['func','table','mem','global'];
        this.lexer.vu();
        const section = new WASMSection('imports', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) section.body[n] = { name: this.lexer.stringLEN() + '.' + this.lexer.stringLEN(), type: map[this.lexer.u8()], index: this.lexer.vu() };
        return (this.sections[2] = section);
    }
    parseSection0x3() {
        this.lexer.vu();
        const section = new WASMSection('functions', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) section.body[n] = this.lexer.vu();
        return (this.sections[3] = section);
    }
    parseSection0x4() {
        this.lexer.vu();
        const section = new WASMSection('tables', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) section.body[n] = [this.lexer.vu(), this.lexer.vu(), this.lexer.vu(), this.lexer.vu()]; //incomplete
        return (this.sections[4] = section);
    }
    parseSection0x5() {
        this.lexer.vu();
        const section = new WASMSection('mem', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) section.body[n] = { type: this.lexer.vu(), limit: [this.lexer.vu(), this.lexer.vu()] }
        return (this.sections[5] = section);
    }
    parseSection0x6() {
        const map = ['f64','f32','i64','i32'];
        this.lexer.vu();
        const section = new WASMSection('globals', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            section.body[n] = { type: map[this.lexer.u8()-0x7C], mutable: this.lexer.u8(), expr: [] }
            section.body[n].expr.push(this.lexer.ru8());
            switch(this.lexer.u8()) {
                case OP.i32.const:
                case OP.i64.const:
                    section.body[n].expr.push(this.lexer.vu());
                    break;
                case OP.f32.const:
                    section.body[n].expr.push(this.f32());
                    break;
                case OP.f64.const:
                    section.body[n].expr.push(this.f64());
                    break;
            }
            this.lexer.u8();
        }
        return (this.sections[6] = section);
    }
    parseSection0x7() {
        const map = ['func','table','mem','global'];
        this.lexer.vu();
        const section = new WASMSection('exports', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            const name = this.lexer.stringLEN();
            const type = map[this.lexer.u8()];
            const index = this.lexer.vu();
            section.body[n] = { name, type, index };
        }
        return (this.sections[7] = section);
    }
    parseSection0x8() {
        this.lexer.vu();
        const section = new WASMSection('start', this.lexer.vu());
        section.body = this.vu();
        return (this.sections[8] = section);
    }
    parseSection0x9() {
        this.lexer.vu();
        const section = new WASMSection('elements', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            section.body[n] = { type: this.lexer.u8() }; //NEED TO ACCOUNT FOR DIFFERENT TYPES
            section.body[n].expr = [this.lexer.u8(),this.lexer.vu()];
            this.lexer.u8();
            const repeat = this.lexer.vu();
            section.body[n].funcs = [];
            for (let p = 0; p < repeat; p++) section.body[n].funcs.push(this.lexer.vu());
        }
        return (this.sections[9] = section);
    }
    parseSection0xa() {
        this.lexer.vu();
        const section = new WASMSection('code', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            const len = this.lexer.vu();
            section.body[n] = this.lexer.packet.slice(this.lexer.index, this.lexer.index += len);
        }
        return (this.sections[10] = section);
    }
    parseSection0xb() {
        this.lexer.vu();
        const t = this.lexer.index;

        const section = new WASMSection('data', this.lexer.vu());
        for (let n = 0; n < section.body.length; n++) {
            section.body[n] = { type: this.lexer.u8(), expr: [this.lexer.u8(),this.lexer.vu()] };
            this.lexer.u8();
            const len = this.lexer.vu();
            section.body[n].contents = this.lexer.packet.slice(this.lexer.index, this.lexer.index += len);
        }
        return (this.sections[11] = section);
    }
    parseFunction(func) {
        this.lexer.set(func);
        const localLength = this.lexer.vu();
        for (let n = 0; n < localLength; n++) {
            this.lexer.vu();
            this.lexer.u8();
        }
        while(this.lexer.has()) {
            const before = this.lexer.index;
            const instr = this.parseInstruction();
            if (instr.op === OP.call) {
                this.lexer.index = before + 1;
                this.lexer.replaceVu(this.getAdjusted(instr.immediates[0]));
            }
        }
        return this.lexer.packet;
    }
    parseInstruction() {
        let len;
        const op = this.lexer.u8();
        const immediates = [];
        switch(op) {
            case OP.block: case OP.loop: case OP.if:
            case OP.memory.size: case OP.memory.grow:
                immediates.push(this.lexer.u8());
                break;
            case OP.br: case OP.br_if:
            case OP.local.get: case OP.local.set: case OP.local.tee:
            case OP.i32.const: case OP.i64.const:
                immediates.push(this.lexer.vu());
                break;
            case OP.f32.const:
                immediates.push(this.lexer.f32());
                break;
            case OP.f64.const:
                immediates.push(this.lexer.f64());
                break;
            case OP.global.get: case OP.global.set:
                immediates.push(this.lexer.vu());
                break; //adjust global index later
            case OP.i32.load: case OP.i32.load8_s: case OP.i32.load8_u: case OP.i32.load16_s: case OP.i32.load16_u:
            case OP.i64.load: case OP.i64.load8_s: case OP.i64.load8_u: case OP.i64.load16_s: case OP.i64.load16_u: case OP.i64.load32_s: case OP.i64.load32_u:
            case OP.f32.load:
            case OP.f64.load:
            case OP.i32.store: case OP.i32.store8: case OP.i32.store16:
            case OP.i64.store: case OP.i64.store8: case OP.i64.store16: case OP.i64.store32:
            case OP.f32.store:
            case OP.f64.store:
                immediates.push(this.lexer.vu(),this.lexer.vu());
                break;
            case OP.call_indirect:
                immediates.push(this.lexer.vu(),this.lexer.u8());
                break;
            case OP.br_table:
                len = this.lexer.vu();
                immediates.push(len);
                for (let n = 0; n < len+1; n++) immediates.push(this.lexer.vu());
                break;
            case OP.call:
                immediates.push(this.lexer.vu());
                break;
            default:
                break;
        }
        return {op, immediates}
    }
    regex(func, instrRegex, cb = (sIndex,eIndex,instrs) => {}, all=true) {
        this.lexer.set(this.sections[10].body[func - this.importFuncCount]);
        const todos = [];
        let exprBlob = [];
        const localLength = this.lexer.vu();
        for (let n = 0; n < localLength; n++) {
            this.lexer.vu();
            this.lexer.u8();
        }
        let startIndex = this.lexer.index, regexPos = 0;
        while(startIndex < this.lexer.packet.length) {
            if (regexPos === 0) {
                exprBlob = [];
                startIndex = this.lexer.index;
            }
            const currIndex = this.lexer.index;
            const instr = this.parseInstruction();
            exprBlob.push(instr);
            if (instr.op === instrRegex[regexPos][0]) {
                let good = true;
                for (let n = 1; n < instrRegex[regexPos].length; n++) if (instrRegex[regexPos][n] !== instr.immediates[n-1] && instrRegex[regexPos][n] !== '*') good = false;
                if (good) regexPos++;
                else {
                    regexPos = 0;
                    this.lexer.index = startIndex;
                    this.parseInstruction();
                    continue;
                }
            }
            else {
                regexPos = 0;
                this.lexer.index = startIndex;
                this.parseInstruction();
                continue;
            }
            if (regexPos === instrRegex.length) {
                todos.push([startIndex, this.lexer.index, [...exprBlob]]);
                if (!all) break;
                regexPos = 0;
            }
        }
        for (const [si, ci, eb] of todos) {
            cb(si, ci, eb);
        }
        return this.lexer.packet;
    }
    inject(code, index = this.lexer.index) {
        return this.lexer.inject(code, index);
    }
    remove(code, index = this.lexer.index) {
        return this.lexer.remove(code, index);
    }
}
class Writer {
    static vu(num) {
        const ret = [];
        while (num >= 128) {
            ret.push((num & 127) | 128);
            num >>= 7;
        }
        ret.push(num);
        return ret;
    }
    static vi(num) {
        const ret = [];
        while (num >= 128) {
            ret.push((num & 127) | 128);
            num >>= 7;
        }
        if (num < 0x40) ret.push(num);
        else {
            ret.push(num | 0x80);
            ret.push(num<0?1:0);
        }
        return ret;
    }
    static f32(num) {
        return [...new Uint8Array(new Float32Array([num]).buffer)];
    }
    static stringLEN(str) {
        str = new TextEncoder().encode(str);
        if (str.length > 127) throw new Error('Unsupported string length: don\'t use a string that long (max 127 byte length)');
        return [str.length, ...str];
    }
}
class Reader {
    constructor(packet) {
        this.packet = packet;
        this.index = 0;
        const buffer = new ArrayBuffer(8);
        this._u8 = new Uint8Array(buffer);
        this._f32 = new Float32Array(buffer);
        this._f64 = new Float64Array(buffer);
    }
    inject(code, index = this.index) {
        this.index = index;
        const newBuf = new Uint8Array(code.length + this.packet.length);
        newBuf.set(this.packet.slice(0,this.index),0);
        newBuf.set(code,this.index);
        newBuf.set(this.packet.slice(this.index),(this.index+code.length));
        return (this.packet = newBuf);
    }
    remove(index1, index2 = this.index) {
        this.index = index2;
        const newBuf = new Uint8Array(index1 - index2 + this.packet.length);
        newBuf.set(this.packet.slice(0,index1),0);
        newBuf.set(this.packet.slice(index2,this.packet.length),index1);
        return (this.packet = newBuf);
    }
    replaceVu(replace) {
        const before = this.index, old = this.vu(), now = this.index;
        replace = Writer.vu(replace);
        if (replace.length === now - before) this.packet.set(replace, before);
        else {
            const newBuf = new Uint8Array(this.packet.length-now+before+replace.length);
            newBuf.set(this.packet.slice(0,before),0);
            newBuf.set(replace,before);
            newBuf.set(this.packet.slice(now),(this.index=before+replace.length));
            this.packet = newBuf;
        }
    }
    has() { return this.index < this.packet.length }
    set(packet) {
        this.packet = packet;
        this.index = 0;
    }
    ru8() { return this.packet[this.index] }
    u8() { return this.packet[this.index++] }
    f32() {
        this._u8.set(this.packet.slice(this.index, this.index += 4));
        return this._f32[0];
    }
    f64() {
        this._u8.set(this.packet.slice(this.index, this.index += 8));
        return this._f64[0];
    }
    vu() {
        let out = 0, at = 0;
        while (this.packet[this.index] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
    stringLEN() {
        const len = this.u8();
        const ret = new TextDecoder().decode(this.packet.slice(this.index, this.index += len));
        return ret;
    }
}