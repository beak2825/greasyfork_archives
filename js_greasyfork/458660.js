// ==UserScript==
// @name         florr.io memory entity parser
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  parses through entities stored in memory (requires florr.io master automation)
// @author       bismuth
// @match        https://florr.io/
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/458660/florrio%20memory%20entity%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/458660/florrio%20memory%20entity%20parser.meta.js
// ==/UserScript==
class MemoryWriter {
    static index = 0;
    static u8(val) {
        World.HEAPU8[MemoryWriter.index] = val;
    }
    static u16(val) {
        World.HEAPU16[MemoryWriter.index >> 1] = val;
    }
    static i32(val) {
        World.HEAP32[MemoryWriter.index >> 2] = val;
    }
    static f32(val) {
        World.HEAPF32[MemoryWriter.index >> 2] = val;
    }
    static f64(val) {
        World.HEAPF64[MemoryWriter.index >> 3] = val;
    }
    static id(val) {
        World.HEAPU8.set(val, MemoryWriter.index);
    }
}
class MemoryReader {
    constructor() {
        this.index = 0;
    }
    u8() {
        return World.HEAPU8[(this.index+=1)-1];
    }
    u16() {
        return World.HEAPU16[(this.index+=2)-2 >> 1];
    }
    i32() {
        return World.HEAP32[(this.index+=4)-4 >> 2];
    }
    f32() {
        return World.HEAPF32[(this.index+=4)-4 >> 2];
    }
    f64() {
        return World.HEAPF64[(this.index+=8)-8 >> 3];
    }
    str() {
        let strAt = this.index;
        let length = World.HEAPU8[this.index + 11];
        if (length === 0x80) {
            length = World.HEAP32[(this.index + 4) >> 2];
            strAt = World.HEAP32[this.index >> 2];
        }
        this.index += 12;
        return new TextDecoder().decode(World.HEAPU8.subarray(strAt, strAt + length));
    }
    id() {
        return World.HEAPU8.subarray(this.index,(this.index+=2));
    }
}
class Entity {
    static fields;
    static components;
    constructor(ptr) {
        this.ptr = ptr;
        this.parse();
    }
    parse() {
        for (const n of Object.keys(Entity.components)) {
            const base = World.HEAP32[this.ptr + parseInt(n) >> 2];
            if (base < 1e6) continue;
            const component = Entity.components[n];
            this[component] = {};
            for (const field of Entity.fields[component]) {
                World.reader.index = base + field.offset;
                if (field.repeat) {
                    this[component][field.name] = [];
                    for (let n = 0; n < field.repeat; n++) this[component][field.name].push(World.reader[field.type]());
                }
                else {
                    this[component][field.name] = World.reader[field.type]();
                    Object.defineProperty(this[component], '$' + field.name, {
                        set(val) {
                            MemoryWriter.index = base + field.offset;
                            MemoryWriter[field.type](val);
                        },
                        get() {
                            World.reader.index = base + field.offset;
                            return World.reader[field.type]();
                        }
                    });
                }
            }
        }
        return this;
    }
}
class World {
    static entities = {};
    static reader = new MemoryReader();
    static init(buffer) {
        World.HEAPU8 = new Uint8Array(buffer);
        World.HEAPU16 = new Uint16Array(buffer);
        World.HEAP32 = new Int32Array(buffer);
        World.HEAPF32 = new Float32Array(buffer);
        World.HEAPF64 = new Float64Array(buffer);
        World.camera = World.HEAPF32.subarray(Automator.config.ptrConsts.entListPtr + Automator.config.ptrConsts.animatedOffset >> 2, Automator.config.ptrConsts.entListPtr + Automator.config.ptrConsts.animatedOffset + 12 >> 2);
        Entity.components = Automator.config.components;
        Entity.fields = Automator.config.fields;
        Entity.basePtr = Automator.config.ptrConsts.entListPtr + Automator.config.ptrConsts.entVecOffset;
        Entity.guiGroupOffset = Automator.config.ptrConsts.entListPtr + Automator.config.ptrConsts.guiGroupOffset;
        Entity.size = Automator.config.ptrConsts.entSize;
        Entity.inVecOffset = Automator.config.ptrConsts.entVecPtrOffsetPer;
        World.ready = true;
        const base = Automator.config.ptrConsts.entListPtr + Automator.config.ptrConsts.entListOffset;
    }
    static parseEnts() {
        const prevEntities = {...World.entities};
        World.entities = {};

        const len = World.HEAP32[Entity.basePtr - 8 >> 2];
        const entPtrs = World.HEAP32.slice(World.HEAP32[Entity.basePtr >> 2] >> 2, World.HEAP32[Entity.basePtr >> 2] + len * 4 >> 2);
        const guiPtr = World.HEAP32[World.HEAP32[World.HEAP32[Entity.guiGroupOffset >> 2] >> 2] >> 2];
        const hash = World.HEAP32[guiPtr + 28 >> 2];
        if ((hash >>> 16) === 0) return;
        if (prevEntities.hasOwnProperty("gui") && guiPtr === prevEntities.gui.ptr) World.entities.gui = prevEntities.gui.parse();
        else World.entities.gui = new Entity(guiPtr);
        for (const ptr of entPtrs) {
            const hash = World.HEAP32[ptr + 28 - Entity.inVecOffset >> 2];
            const id = `<${hash & 32767},${hash >>> 16}>`;
            if ((hash >>> 16) === 0) continue;
            if (prevEntities.hasOwnProperty(id)) World.entities[id] = prevEntities[id].parse();
            else World.entities[id] = new Entity(ptr - Entity.inVecOffset);
        }
    }
    static parseChat() {
        World.chat = [];
        const count = World.HEAP32[Automator.config.textOffsets.chatBasePtr >> 2];
        for (let n = 0; n < count; n++) {
            World.chat.push([]);
            World.reader.index = Automator.config.textOffsets.chatBasePtr + 16 + Automator.config.textOffsets.outerSize * n;
            const ptr = World.reader.i32();
            World.reader.index = ptr;
            const innerCount = World.reader.i32();
            World.reader.index = ptr + 8;
            const startLinePtr = World.reader.i32();
            for (let m = 0; m < innerCount; m++) {
                World.reader.index = startLinePtr + 160 * m + 132;
                World.chat[n].push(World.reader.str());
            }
        }
        console.log(World.chat);
    }
    static parseMobs() {
        World.mobs = [];
        const id_count = 34;
        const rarity_count = 7;
        let base = 12911808;
        for (let id = 0; id < id_count; id++) {
            World.mobs.push(new Array(rarity_count).fill(0).map(x => []));
            for (let rarity = 0; rarity < rarity_count; rarity++) {
                World.reader.index = base + 232 * id + 12 * rarity;
                const innerCount = World.reader.i32();
                console.log(innerCount);
                World.reader.index += 4;
                const ptr = World.reader.i32();
                console.log(ptr);
                for (let m = 0; m < innerCount; m++) {
                    World.reader.index = ptr + m * 28;
                    const lineCount = World.reader.i32();
                    World.reader.index += 4;
                    const startLinePtr = World.reader.i32();
                    if (lineCount === 0) World.mobs[id][rarity][m] = '';
                    else if (lineCount === 1) {
                        World.reader.index = startLinePtr + 132;
                        World.mobs[id][rarity][m] = World.reader.str();
                    }
                    else {
                        World.mobs[id][rarity][m] = [];
                        for (let q = 0; q < lineCount; q++) {
                            World.reader.index = startLinePtr + 160 * q + 132;
                            World.mobs[id][rarity][m].push(World.reader.str());
                        }
                    }
                }
            }
        }
        console.log(World.mobs);
    }
    constructor() {}
}