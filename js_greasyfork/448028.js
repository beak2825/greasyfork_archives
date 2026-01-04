// ==UserScript==
// @name         RBDB
// @version      1.0
// @author       0vC4
// @description  RocketBall Decoder Buffer
// @namespace    https://greasyfork.org/users/670183-exnonull
// @license      MIT
// ==/UserScript==

const RBScheme = {
    pos: [
        [13, 'x', 'f32'],
        [21, 'y', 'f32'],
    ],
    object: [
        [10, 'pos', 'pos'],
        [16, 'type', 'objectType'],
        [24, 'playerId', 'int7'],
        [37, 'angle', 'f32'],
        [42, 'speed', 'pos'],
    ],
    entity: [
        [8, 'objectId', 'int7'],
        [18, 'data', 'object'],
    ],
    entities: [
        [10, 'item', 'entity'],
    ],
    user: [
        [8, 'playerId', 'int7'],
        [18, 'username', 'string'],
        [24, 'goals', 'int7'],
        [32, 'assists', 'int7'],
        [40, 'team', 'teamName'],
        [48, 'car', 'int7'],
        [56, 'bot', 'int7'],
        [64, 'exp', 'int7'],
    ],
    users: [
        [10, 'item', 'user'],
    ],

    team: [
        [8, 'name', 'teamName'],
        [16, 'goals', 'int7'],
    ],
    round: [
        [13, 'time', 'f32'],
        [18, 'red', 'team'],
        [18, 'blue', 'team'],
        [18, 'spectator', 'team'],
        [24, 'magic', 'int7'],
    ],

    finish: [
        [10, 'authToken', 'string'],
        [34, 'username', 'string'],
        [40, 'goals', 'int7'],
        [48, 'assists', 'int7'],
        [56, 'wins', 'int7'],
        [72, 'lost', 'int7'],
        [80, 'spareExp', 'int7'],
        [88, 'exp', 'int7'],
    ],
};

class ReadBuffer {
    offset = 0
    buffer = []
    finished = false
    constructor(packet) {
        this.buffer = [...packet];
        this.offset = 0
    }

    next(size=1) {
        let offset = this.offset;
        this.offset += size;
        if (this.offset == this.buffer.length) this.finished = true;
        return offset;
    }

    get skip8() {
        this.u8;
        return this;
    }
    get skip16() {
        this.u16;
        return this;
    }
    get skip32() {
        this.u32;
        return this;
    }
    get skip64() {
        this.u64;
        return this;
    }
    get skip7() {
        this.int7;
        return this;
    }
    get skipString() {
        this.string;
        return this;
    }

    get u8() {
        return new Uint8Array([this.buffer[this.next()]])[0];
    }
    get u16() {
        return new Uint16Array(new Uint8Array(this.buffer.slice(this.next(2), this.offset)).buffer)[0];
    }
    get u32() {
        return new Uint32Array(new Uint8Array(this.buffer.slice(this.next(4), this.offset)).buffer)[0];
    }
    get u64() {
        return new BigUint64Array(new Uint8Array(this.buffer.slice(this.next(8), this.offset)).buffer)[0];
    }

    get s8() {
        return new Int8Array([this.buffer[this.next()]])[0];
    }
    get s16() {
        return new Int16Array(new Uint8Array(this.buffer.slice(this.next(2), this.offset)).buffer)[0];
    }
    get s32() {
        return new Int32Array(new Uint8Array(this.buffer.slice(this.next(4), this.offset)).buffer)[0];
    }
    get s64() {
        return new BigInt64Array(new Uint8Array(this.buffer.slice(this.next(8), this.offset)).buffer)[0];
    }

    get f32() {
        return new Float32Array(new Uint8Array(this.buffer.slice(this.next(4), this.offset)).buffer)[0];
    }
    get f64() {
        return new Float64Array(new Uint8Array(this.buffer.slice(this.next(8), this.offset)).buffer)[0];
    }

    get int7() {
        let offset = 0;
        let num = 0;
        while (offset != 0b100011) {
            let byte = this.buffer[this.offset + offset/7];
            num |= (byte&0x7f)<<offset;
            offset += 7;
            if ((byte&0x80) == 0) {
                this.next(offset/7);
                return num;
            }
        }
        this.next(offset/7);
        return num;
    }
    get array() {
        return new Uint8Array(this.buffer.slice(this.next(this.buffer.length-this.offset), this.offset));
    }
    get array7() {
        const offset = this.next(this.int7);
        return new Uint8Array(this.buffer.slice(offset, this.offset));
    }
    get string() {
        return new TextDecoder().decode(this.array7);
    }



    // custom types

    read(scheme) {
        const buffer = new ReadBuffer(this.array7);
        if (buffer.buffer.length == 0) return {};

        const data = {};
        const skip = [];
        while (!buffer.finished) {
            const slotId = buffer.u8;
            try {
                const [id, key, type] = RBScheme[scheme].find(([id], i) => {
                    if (id == slotId && !skip.includes(i)) {
                        skip.push(i);
                        return true;
                    }
                });
                data[key] = buffer[type];
            } catch (e) {
                console.log(scheme, buffer.buffer+'', buffer.offset, slotId, RBScheme[scheme]);
                throw e;
            }
        }

        return data;
    }
    readArray(scheme) {
        const buffer = new ReadBuffer(this.array7);
        if (buffer.buffer.length == 0) return [];

        const data = [];
        while (!buffer.finished)
            data.push(buffer.skip8.read(RBScheme[scheme][0][2]));

        return data;
    }

    get pos() {
        const data = this.read('pos');
        if (!data.x) data.x = 0;
        if (!data.y) data.y = 0;
        return data;
    }
    get object() {
        return this.read('object');
    }
    get entity() {
        return this.read('entity');
    }
    get entities() {
        return this.readArray('entities');
    }

    get user() {
        return this.read('user');
    }
    get users() {
        return this.readArray('users');
    }


    get objectType() {
        return ['player', 'ball', 'magic', 'magic2', 'boost'][this.int7];
    }
    get teamName() {
        return ['red', 'blue', 'spectator'][this.int7];
    }
    get team() {
        const data = this.read('team');
        if (!data.name) data.name = 'red';
        if (!data.goals) data.goals = 0;
        return data;
    }
    get round() {
        return this.read('round');
    }

    get finish() {
        return this.read('finish');
    }
}

class WriteBuffer {
    offset = 0
    buffer = []
    constructor(buffer = []) {
        this.buffer = [...buffer];
        this.offset = buffer.length;
    }

    u8(...nums) {
        for (let byte of new Uint8Array([...nums]))
            this.buffer[this.offset++] = byte;
        return this;
    }
    u16(...nums) {
        for (let byte of new Uint8Array(new Uint16Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }
    u32(...nums) {
        for (let byte of new Uint8Array(new Uint32Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }
    u64(...nums) {
        for (let byte of new Uint8Array(new BigUint64Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }

    s8(...nums) {
        for (let byte of new Uint8Array([...nums]))
            this.buffer[this.offset++] = byte;
        return this;
    }
    s16(...nums) {
        for (let byte of new Uint8Array(new Int16Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }
    s32(...nums) {
        for (let byte of new Uint8Array(new Int32Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }
    s64(...nums) {
        for (let byte of new Uint8Array(new BigInt64Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }

    f32(...nums) {
        for (let byte of new Uint8Array(new Float32Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }
    f64(...nums) {
        for (let byte of new Uint8Array(new Float64Array([...nums]).buffer))
            this.buffer[this.offset++] = byte;
        return this;
    }

    int7(...nums) {
        const bytes = [];

        for (let num of nums) {
            while(num >= 0x80) {
                bytes.push((num|0x80)%0x100);
                num >>= 7;
            }
            bytes.push(num%0x100);
        }

        for (let byte of bytes)
            this.buffer[this.offset++] = byte;

        return this;
    }
    array(...arrays) {
        for (let array of arrays)
            for (let byte of array)
                this.buffer[this.offset++] = new Uint8Array([byte])[0];
        return this;
    }
    array7(...arrays) {
        for (let array of arrays) {
            this.int7(array.length);
            for (let byte of array)
                this.buffer[this.offset++] = new Uint8Array([byte])[0];
        }
        return this;
    }
    string(...strs) {
        for (let str of strs) this.array7(new TextEncoder().encode(str));
        return this;
    }



    // custom types

    write(scheme, ...items) {

        for (let item of items) {
            const buffer = new WriteBuffer();

            for (let k in item) {
                try {
                    const [id, key, type] = RBScheme[scheme].find(([id, key]) => key == k);
                    buffer.u8(id);
                    buffer[type](item[k]);
                } catch (e) {
                    console.log(scheme, items, item, k, RBScheme[scheme], buffer.buffer+'');
                    throw e;
                }
            }

            this.int7(buffer.buffer.length).array(buffer.buffer);
        }

        return this;
    }
    writeArray(scheme, ...itemLists) {

        for (let itemList of itemLists) {
            const buffer = new WriteBuffer();
            for (let items of itemList)
                buffer.int7(10).write(RBScheme[scheme][0][2], items);
            this.int7(10, buffer.buffer.length).array(buffer.buffer);
        }

        return this;
    }

    pos(...items) {
        return this.write('pos', ...items);
    }
    object(...items) {
        return this.write('object', ...items);
    }
    entity(...items) {
        return this.write('entity', ...items);
    }
    entities(...itemLists) {
        return this.writeArray('entities', ...itemLists);
    }

    user(...items) {
        return this.write('user', ...items);
    }
    users(...itemLists) {
        return this.writeArray('users', ...itemLists);
    }

    objectType(name) {
        this.buffer[this.offset++] = ['player', 'ball', 'magic', 'magic2', 'boost'].indexOf(name);
        return this;
    }
    teamName(name) {
        this.buffer[this.offset++] = ['red', 'blue', 'spectator'].indexOf(name);
        return this;
    }
    team(...items) {
        return this.write('team', ...items);
    }
    round(...items) {
        return this.write('round', ...items);
    }

    finish(...items) {
        return this.write('finish', ...items);
    }
}
// 0vC4#7152