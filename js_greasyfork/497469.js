// ==UserScript==

// @name         x-Surf

// @namespace    Developer Company (DC)
// @namespace    Hack Studio

// @version      v0.4
// @version:js   v9.2.33.2
// @version:py   v1.3.9
// @version:ph   v2.3.19
// @version:rb   v0.01

// @description  MvP [ Update 0.4 ]

// @author       2k09__

// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js

// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*

// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_getTabs
// @grant        GM_getTab
// @grant        GM_saveTab

// @icon         https://dev.moomoo.io/img/icons/crown.png

// @run-at       document-start

// @license      Copyright (c) { Hack Studio }
// @license      All Rights Reserved

// @downloadURL https://update.greasyfork.org/scripts/497469/x-Surf.user.js
// @updateURL https://update.greasyfork.org/scripts/497469/x-Surf.meta.js
// ==/UserScript==
/*
 CONTROLS

 Esc = Menu
 m = AutoWindmill
 v = Spike
 h = Turret / Teleporter
 f = trap / boostPad
 t = Wall
 l = SpawnPad
 n = 1 Windmill
 r = InstaKill
 . = OneTick
 Space = Spike Tick

 SETTINGS

 Aimbot (Menu)
 ID (Menu)
 Spam Message(Menu)
 AutoGG
 Create Clan(Menu)
 Bots (Command)
 pAB Process
 AutoHat
 AutoHeal
 AntiBowInsta
 Autoplace(Menu)
 Replace(Menu)
 AutoSelect(Menu)
 Dir
 Smooth UI(Menu)
 Ping
 CountHP
 AutoBreak
 Zoom
 AutoGrind(Menu)
 Music
 Bars Reload
 Zoom

*/
/*
.88.       .88.     .88. .88.        .88.    .88.
 .88.     .88.    .88.    .88.       .88.    .88.
  .88.   .88.      .88   .88.        .88..88..88.
   .88. .88.          .88.                   .88.
     .88.                                    .88.
*/
/*

  · Credits:

  · Helpers:
  - winter
  - hoaa_idk
  - looter_xd
  - Zyenth
  - Daniel_35

  · Creator:
  - 2k09__

  · extraCredits:
  - marshall
  - alexandra
  - ander

  · Teams:
  - Developer Team
  - T&S Team
  - Club Hack On Game
  - Hack Studio

*/
alert(`[ Update 0.4 ]`);
    function serialize(data) {
        const pow32 = 0x100000000;
        let floatBuffer, floatView;
        let array = new Uint8Array(128);
        let length = 0;
        append(data);
        return array.subarray(0, length);

        function append(data) {
            switch (typeof data) {
                case "undefined":
                    appendNull(data);
                    break;
                case "boolean":
                    appendBoolean(data);
                    break;
                case "number":
                    appendNumber(data);
                    break;
                case "string":
                    appendString(data);
                    break;
                case "object":
                    if (data === null) {
                        appendNull(data);
                    } else if (data instanceof Date) {
                        appendDate(data);
                    } else if (Array.isArray(data)) {
                        appendArray(data);
                    } else if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
                        appendBinArray(data);
                    } else if (data instanceof Int8Array || data instanceof Int16Array || data instanceof Uint16Array ||
                               data instanceof Int32Array || data instanceof Uint32Array ||
                               data instanceof Float32Array || data instanceof Float64Array) {
                        appendArray(data);
                    } else {
                        appendObject(data);
                    };
                    break;
            };
        };

        function appendNull(data) {
            appendByte(0xc0);
        };

        function appendBoolean(data) {
            appendByte(data ? 0xc3 : 0xc2);
        };

        function appendNumber(data) {
            if (isFinite(data) && Math.floor(data) === data) {
                if (data >= 0 && data <= 0x7f) {
                    appendByte(data);
                } else if (data < 0 && data >= -0x20) {
                    appendByte(data);
                } else if (data > 0 && data <= 0xff) { // uint8
                    appendBytes([0xcc, data]);
                } else if (data >= -0x80 && data <= 0x7f) { // int8
                    appendBytes([0xd0, data]);
                } else if (data > 0 && data <= 0xffff) { // uint16
                    appendBytes([0xcd, data >>> 8, data]);
                } else if (data >= -0x8000 && data <= 0x7fff) { // int16
                    appendBytes([0xd1, data >>> 8, data]);
                } else if (data > 0 && data <= 0xffffffff) { // uint32
                    appendBytes([0xce, data >>> 24, data >>> 16, data >>> 8, data]);
                } else if (data >= -0x80000000 && data <= 0x7fffffff) { // int32
                    appendBytes([0xd2, data >>> 24, data >>> 16, data >>> 8, data]);
                } else if (data > 0 && data <= 0xffffffffffffffff) { // uint64
                    let hi = data / pow32;
                    let lo = data % pow32;
                    appendBytes([0xd3, hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
                } else if (data >= -0x8000000000000000 && data <= 0x7fffffffffffffff) { // int64
                    appendByte(0xd3);
                    appendInt64(data);
                } else if (data < 0) { // below int64
                    appendBytes([0xd3, 0x80, 0, 0, 0, 0, 0, 0, 0]);
                } else { // above uint64
                    appendBytes([0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
                };
            } else {
                if (!floatView) {
                    floatBuffer = new ArrayBuffer(8);
                    floatView = new DataView(floatBuffer);
                };
                floatView.setFloat64(0, data);
                appendByte(0xcb);
                appendBytes(new Uint8Array(floatBuffer));
            };
        };

        function appendString(data) {
            let bytes = encodeUtf8(data);
            let length = bytes.length;

            if (length <= 0x1f) {
                appendByte(0xa0 + length);
            } else if (length <= 0xff) {
                appendBytes([0xd9, length]);
            } else if (length <= 0xffff) {
                appendBytes([0xda, length >>> 8, length]);
            } else {
                appendBytes([0xdb, length >>> 24, length >>> 16, length >>> 8, length]);
            };

            appendBytes(bytes);
        };

        function appendArray(data) {
            let length = data.length;

            if (length <= 0xf) {
                appendByte(0x90 + length);
            } else if (length <= 0xffff) {
                appendBytes([0xdc, length >>> 8, length]);
            } else {
                appendBytes([0xdd, length >>> 24, length >>> 16, length >>> 8, length]);
            };

            for (let index = 0; index < length; index++) {
                append(data[index]);
            };
        };

        function appendBinArray(data) {
            let length = data.length;

            if (length <= 0xf) {
                appendBytes([0xc4, length]);
            } else if (length <= 0xffff) {
                appendBytes([0xc5, length >>> 8, length]);
            } else {
                appendBytes([0xc6, length >>> 24, length >>> 16, length >>> 8, length]);
            };

            appendBytes(data);
        };

        function appendObject(data) {
            let length = 0;
            for (let key in data) length++;

            if (length <= 0xf) {
                appendByte(0x80 + length);
            } else if (length <= 0xffff) {
                appendBytes([0xde, length >>> 8, length]);
            } else {
                appendBytes([0xdf, length >>> 24, length >>> 16, length >>> 8, length]);
            };

            for (let key in data) {
                append(key);
                append(data[key]);
            };
        };

        function appendDate(data) {
            let sec = data.getTime() / 1000;
            if (data.getMilliseconds() === 0 && sec >= 0 && sec < 0x100000000) { // 32 bit seconds
                appendBytes([0xd6, 0xff, sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else if (sec >= 0 && sec < 0x400000000) { // 30 bit nanoseconds, 34 bit seconds
                let ns = data.getMilliseconds() * 1000000;
                appendBytes([0xd7, 0xff, ns >>> 22, ns >>> 14, ns >>> 6, ((ns << 2) >>> 0) | (sec / pow32), sec >>> 24, sec >>> 16, sec >>> 8, sec]);
            }
            else { // 32 bit nanoseconds, 64 bit seconds, negative values allowed
                let ns = data.getMilliseconds() * 1000000;
                appendBytes([0xc7, 12, 0xff, ns >>> 24, ns >>> 16, ns >>> 8, ns]);
                appendInt64(sec);
            };
        };

        function appendByte(byte) {
            if (array.length < length + 1) {
                let newLength = array.length * 2;
                while (newLength < length + 1)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            };
            array[length] = byte;
            length++;
        };

        function appendBytes(bytes) {
            if (array.length < length + bytes.length) {
                let newLength = array.length * 2;
                while (newLength < length + bytes.length)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            };
            array.set(bytes, length);
            length += bytes.length;
        };

        function appendInt64(value) {
            let hi, lo;
            if (value >= 0) {
                hi = value / pow32;
                lo = value % pow32;
            }
            else {
                value++;
                hi = Math.abs(value) / pow32;
                lo = Math.abs(value) % pow32;
                hi = ~hi;
                lo = ~lo;
            };
            appendBytes([hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
        };
    };

    function deserialize(array) {
        const pow32 = 0x100000000; // 2^32
        let pos = 0;
        if (array instanceof ArrayBuffer) {
            array = new Uint8Array(array);
        };
        if (typeof array !== "object" || typeof array.length === "undefined") {
            throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
        };
        if (!array.length) {
            throw new Error("Invalid argument: The byte array to deserialize is empty.");
        };
        if (!(array instanceof Uint8Array)) {
            array = new Uint8Array(array);
        };
        let data = read();
        if (pos < array.length) {
        };
        return data;

        function read() {
            const byte = array[pos++];
            if (byte >= 0x00 && byte <= 0x7f) return byte; // positive fixint
            if (byte >= 0x80 && byte <= 0x8f) return readMap(byte - 0x80); // fixmap
            if (byte >= 0x90 && byte <= 0x9f) return readArray(byte - 0x90); // fixarray
            if (byte >= 0xa0 && byte <= 0xbf) return readStr(byte - 0xa0); // fixstr
            if (byte === 0xc0) return null; // nil
            if (byte === 0xc1) throw new Error("Invalid byte code 0xc1 found."); // never used
            if (byte === 0xc2) return false // false
            if (byte === 0xc3) return true; // true
            if (byte === 0xc4) return readBin(-1, 1); // bin 8
            if (byte === 0xc5) return readBin(-1, 2); // bin 16
            if (byte === 0xc6) return readBin(-1, 4); // bin 32
            if (byte === 0xc7) return readExt(-1, 1); // ext 8
            if (byte === 0xc8) return readExt(-1, 2); // ext 16
            if (byte === 0xc9) return readExt(-1, 4) // ext 32
            if (byte === 0xca) return readFloat(4); // float 32
            if (byte === 0xcb) return readFloat(8); // float 64
            if (byte === 0xcc) return readUInt(1); // uint 8
            if (byte === 0xcd) return readUInt(2); // uint 16
            if (byte === 0xce) return readUInt(4); // uint 32
            if (byte === 0xcf) return readUInt(8) // uint 64
            if (byte === 0xd0) return readInt(1); // int 8
            if (byte === 0xd1) return readInt(2); // int 16
            if (byte === 0xd2) return readInt(4); // int 32
            if (byte === 0xd3) return readInt(8); // int 64
            if (byte === 0xd4) return readExt(1); // fixext 1
            if (byte === 0xd5) return readExt(2); // fixext 2
            if (byte === 0xd6) return readExt(4); // fixext 4
            if (byte === 0xd7) return readExt(8); // fixext 8
            if (byte === 0xd8) return readExt(16); // fixext 16
            if (byte === 0xd9) return readStr(-1, 1); // str 8
            if (byte === 0xda) return readStr(-1, 2); // str 16
            if (byte === 0xdb) return readStr(-1, 4); // str 32
            if (byte === 0xdc) return readArray(-1, 2); // array 16
            if (byte === 0xdd) return readArray(-1, 4); // array 32
            if (byte === 0xde) return readMap(-1, 2); // map 16
            if (byte === 0xdf) return readMap(-1, 4); // map 32
            if (byte >= 0xe0 && byte <= 0xff) return byte - 256; // negative fixint
            console.debug("msgpack array:", array);
            throw new Error("Invalid byte value '" + byte + "' at index " + (pos - 1) + " in the MessagePack binary data (length " + array.length + "): Expecting a range of 0 to 255. This is not a byte array.");
        };

        function readInt(size) {
            let value = 0;
            let first = true;
            while (size-- > 0) {
                if (first) {
                    let byte = array[pos++];
                    value += byte & 0x7f;
                    if (byte & 0x80) {
                        value -= 0x80;
                    };
                    first = false;
                }
                else {
                    value *= 256;
                    value += array[pos++];
                };
            };
            return value;
        };

        function readUInt(size) {
            let value = 0;
            while (size-- > 0) {
                value *= 256;
                value += array[pos++];
            };
            return value;
        };

        function readFloat(size) {
            let view = new DataView(array.buffer, pos, size);
            pos += size;
            if (size === 4) {
                return view.getFloat32(0, false);
            };
            if (size === 8) {
                return view.getFloat64(0, false);
            };
        };

        function readBin(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = array.subarray(pos, pos + size);
            pos += size;
            return data;
        };

        function readMap(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = {};
            while (size-- > 0) {
                let key = read();
                data[key] = read();
            };
            return data;
        };

        function readArray(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = [];
            while (size-- > 0) {
                data.push(read());
            };
            return data;
        };

        function readStr(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let start = pos;
            pos += size;
            return decodeUtf8(array, start, size);
        };

        function readExt(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let type = readUInt(1);
            let data = readBin(size);
            switch (type) {
                case 255:
                    return readExtDate(data);
            };
            return { type: type, data: data };
        };

        function readExtDate(data) {
            if (data.length === 4) {
                let sec = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                return new Date(sec * 1000);
            };
            if (data.length === 8) {
                let ns = ((data[0] << 22) >>> 0) +
                    ((data[1] << 14) >>> 0) +
                    ((data[2] << 6) >>> 0) +
                    (data[3] >>> 2);
                let sec = ((data[3] & 0x3) * pow32) +
                    ((data[4] << 24) >>> 0) +
                    ((data[5] << 16) >>> 0) +
                    ((data[6] << 8) >>> 0) +
                    data[7];
                return new Date(sec * 1000 + ns / 1000000);
            };
            if (data.length === 12) {
                let ns = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                pos -= 8;
                let sec = readInt(8);
                return new Date(sec * 1000 + ns / 1000000);
            };
            throw new Error("Invalid data length for a date value.");
        };
    };

    function encodeUtf8(str) {
        let ascii = true, length = str.length;
        for (let x = 0; x < length; x++) {
            if (str.charCodeAt(x) > 127) {
                ascii = false;
                break;
            };
        };

        let i = 0, bytes = new Uint8Array(str.length * (ascii ? 1 : 4));
        for (let ci = 0; ci !== length; ci++) {
            let c = str.charCodeAt(ci);
            if (c < 128) {
                bytes[i++] = c;
                continue;
            };
            if (c < 2048) {
                bytes[i++] = c >> 6 | 192;
            }
            else {
                if (c > 0xd7ff && c < 0xdc00) {
                    if (++ci >= length)
                        throw new Error("UTF-8 encode: incomplete surrogate pair");
                    let c2 = str.charCodeAt(ci);
                    if (c2 < 0xdc00 || c2 > 0xdfff)
                        throw new Error("UTF-8 encode: second surrogate character 0x" + c2.toString(16) + " at index " + ci + " out of range");
                    c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                    bytes[i++] = c >> 18 | 240;
                    bytes[i++] = c >> 12 & 63 | 128;
                }
                else bytes[i++] = c >> 12 | 224;
                bytes[i++] = c >> 6 & 63 | 128;
           };
            bytes[i++] = c & 63 | 128;
        };
        return ascii ? bytes : bytes.subarray(0, i);
    };

    function decodeUtf8(bytes, start, length) {
        let i = start, str = "";
        length += start;
        while (i < length) {
            let c = bytes[i++];
            if (c > 127) {
                if (c > 191 && c < 224) {
                    if (i >= length)
                        throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                    c = (c & 31) << 6 | bytes[i++] & 63;
                }
                else if (c > 223 && c < 240) {
                    if (i + 1 >= length)
                        throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                    c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else if (c > 239 && c < 248) {
                    if (i + 2 >= length)
                        throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                    c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
                }
                else throw new Error("UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1));
            };
            if (c <= 0xffff) str += String.fromCharCode(c);
            else if (c <= 0x10ffff) {
                c -= 0x10000;
                str += String.fromCharCode(c >> 10 | 0xd800)
                str += String.fromCharCode(c & 0x3FF | 0xdc00)
            }
            else throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
        };
        return str;
    };

    let msgpack = {
        serialize: serialize,
        deserialize: deserialize,

        encode: serialize,
        decode: deserialize
    };

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = msgpack;
    }
    else {
        window[window.msgpackJsName || "msgpack"] = msgpack;
    };
let myPlayer = {
    name: "x-{NAME}",
    id: null,
    sid: null,
    health: 100,
    maxHealth: null,
    damage: null,
    attackSpeed: null,
    attackRange: null,
    isSkull: null,
    team: null,
    isLeader: null,
    recours: 100,
    weapon: null,
    weaponIndex: null,
    weaponVariant: null,
    buildIndex: null,
    clan: null,
    x: null,
    y: null,
    dead: null,
    angle: null
};
let enemy = {
    name: null,
    id: null,
    damage: null,
    isLeader: null,
    isSkull: null,
    x: null,
    y: null,
    clan: null,
    team: null,
    weapon: null,
    weaponIndex: null,
    weaponVariant: null,
    health: 100,
    maxHealth: null
};
var accesoryList = {
    Unequip: 0,
    Snowball: 12,
    TreeCape: 9,
    StoneCape: 10,
    CookieCape: 3,
    CowCape: 8,
    MonkeyTail: 11,
    AppleBasket: 17,
    WinterCape: 6,
    SkullCape: 4,
    DashCape: 5,
    DragonCape: 2,
    SuperCape: 1,
    TrollCape: 7,
    Thorns: 14,
    Blockades: 15,
    DevilsTail: 20,
    Sawblade: 16,
    AngelWings: 13,
    ShadowWings: 19,
    BloodWings: 18,
    CorruptXWings: 21
};

var hatList = {
    Unequip: 0,
    MooCap: 51,
    AppleCap: 50,
    MooHead: 28,
    PigHead: 29,
    FluffHead: 30,
    PandouHead: 36,
    BearHead: 37,
    MonkeyHead: 38,
    PolarHead: 44,
    FezHat: 35,
    EnigmaHat: 42,
    BlitzHat: 43,
    BobXIIIHat: 49,
    Pumpkin: 57,
    BummleHat: 8,
    StrawHat: 2,
    WinterCap: 15,
    CowboyHat: 5,
    RangerHat: 4,
    ExplorerHat: 18,
    FlipperHat: 31,
    MarksmanCap: 1,
    BushGear: 10,
    Halo: 48,
    SoldierHelmet: 6,
    AntiVenomGear: 23,
    MedicGear: 13,
    MinersHelmet: 9,
    MusketeerHat: 32,
    BullHelmet: 7,
    EmpHelmet: 22,
    BoosterHat: 12,
    BarbarianArmor: 26,
    PlagueMask: 21,
    BullMask: 46,
    WindmillHat: 14,
    SpikeGear: 11,
    TurretGear: 53,
    SamuraiArmor: 20,
    DarkKnight: 58,
    ScavengerGear: 27,
    TankGear: 40,
    ThiefGear: 52,
    Bloodthirster: 55,
    AssassinGear: 56
   };
    function buyAndEquipHat(name) {
        var target = hatList.name;
        storeBuy(target);
        storeEquip(target);
    };
    function buyAndEquipAccesory(name) {
        var target2 = accesoryList.name;
        storeBuy(target2);
        storeEquip(target2);
    };
/* t12 */
let food = Surf.myPlayer.inventory.food;
let trap = Surf.myPlayer.inventory.trap;
let spike = Surf.myPlayer.inventory.spike;
let boostPad = Surf.myPlayer.inventory.boostPad;
let sword = Surf.myPlayer.inventory.sword;
let healSpeed = 125;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let ahth = 86;
let ahrp = 2;
let ahtky = 80;
let healOn = true;
let bots = 3;
let zoomLevel = 1;
let Texture;
let keys = {};
let urMessage = "ü";
let spamInterval;
let autoplaceActive = false;
let replaceActive = false;
let mouse = { x: 0, y: 0 };
let spamming = false;
let init = false;
let width;
let height;
let coreURL = new URL(window.location.href);
const autoplaceEnable = document.getElementById('autoplace-enable');
const replaceEnable = document.getElementById('replace-enable');
let InvisClan = "ü"
/* t12 */

localStorage.moofoll = !0;
const Surf = window.Surf;

Surf.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]

    if (Surf.myPlayer.sid === sid && health < 100) {
        if(health < 100 && health > 79) {
        buyAndEquipHat(11);
        buyAndEquipAccesory(11);
        setTimeout(() => {
        Surf.myPlayer.place(food);
        chat("x-Surf | 0%");
        }, 151);
        } else if(health < 80 && health > 59) {
            buyAndEquipHat(11);
            buyAndEquipAccesory(21);
            setTimeout(() => {
                Surf.myPlayer.place(food);
                Surf.myPlayer.place(food);
                chat("x-Surf | 25%")
            }, 100);
        } else if(health < 60 && health > 39) {
            buyAndEquipHat(7);
            buyAndEquipAccesory(11);
           setTimeout(() => {
            Surf.myPlayer.place(food);
            Surf.myPlayer.place(food);
            chat("x-Surf | 50 - 75&")
           }, 100);
        } else if(health < 40 && health > 0) {
            buyAndEquipHat(6);
            buyAndEquipAccesory(11);
           setTimeout(() => {
            Surf.myPlayer.place(food);
            Surf.myPlayer.place(food);
            chat("x-Surf | /!\ Warring 100%")
           }, 90);
        };
    };
});
function placeV() {
  // Spike
  Surf.placeObject("spike", Surf.mousePosition);
};
function placeF() {
  // Trap
  Surf.placeObject("trap", Surf.mousePosition);
};
function placeN() {
  // Windmill
  Surf.placeObject("windmill", Surf.mousePosition);
};
function placeT() {
  // Wall
  Surf.placeObject("wall", Surf.mousePosition);
};
function placeH() {
  // Turret && Teleporter
  Surf.placeObject("turret", "teleporter", Surf.mousePosition);
};
function placeL() {
  // Spawpad
  Surf.placeObject("spawpad", Surf.mousePosition);
};
document.addEventListener("keydown", function(event) {
  switch (event.key) {
    case "v":
      placeV();
      break;
    case "f":
      placeF();
      break;
    case "n":
      placeN();
      break;
    case "t":
      placeT();
      break;
    case "h":
      placeH();
      break;
    case "l":
      placeL();
      break;
  };
});
var hpElement = document.createElement("div");
hpElement.style.position = "absolute";
hpElement.style.bottom = "10px";
hpElement.style.left = "50%";
hpElement.style.transform = "translateX(-50%)";
hpElement.style.fontSize = "24px";
hpElement.style.fontWeight = "bold";
hpElement.style.color = "black";
hpElement.style.textShadow = "0 0 10px black";
document.body.appendChild(hpElement);

setInterval(function() {
hpElement.textContent = `${myPlayer.hp} / 100`;
}, 1000 / 60);

document.addEventListener("DOMSubtreeModified", function() {
var usernameElements = document.querySelectorAll(".username");
for (var i = 0; i < usernameElements.length; i++) {
if (usernameElements[i].textContent === "tester") {
usernameElements[i].textContent = "x-Surf";
myPlayer.skinColor = "#000000";
  };
 };
});

function instaKill() {
Surf.buy("BullsHelmet");
Surf.equip("BullsHelmet");
Surf.buy("BloodWings");
Surf.equip("BloodWings");

Surf.buy("TurretGear");
Surf.equip("TurretGear");
Surf.buy("CorruptXWings");
Surf.equip("CorruptXWings");

attackWithBothWeapons();

Surf.buy("AppleCap");
Surf.equip("AppleCap");
Surf.buy("MonkeyTail");
Surf.equip("MonkeyTail");
Surf.weapon("primary");

if (isOnSurface()) {

} else if (isInLake()) {
 Surf.buy("FlipperHat");
 Surf.equip("FlipperHat");
 Surf.buy("MonkeyTail");
 Surf.equip("MonkeyTail");
} else if (isInSnow()) {
 Surf.buy("WinterCap");
 Surf.equip("WinterCap");
 Surf.buy("MonkeyTail");
 Surf.equip("MonkeyTail");
};

chat("x-Surf | x-Insta 8 Dmg");
};

function attackWithBothWeapons() {
document.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window, detail: 0, screenX: window.innerWidth / 2, screenY: window.innerHeight / 2, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }));
document.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window, detail: 0, screenX: window.innerWidth / 2, screenY: window.innerHeight / 2, clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }));
};

function AntiBowInsta() {
    if (enemy.dectectBow()) {
     if (enemy.dectectCrossBow()) {
      if (enemy.dectectMusket()) {
       if (enemy.dectectRepeatCrossBow()) {
           Surf.placeObject("wall", Surf.enemyPosition);
           chat("x-Surf | x-AntiBow /$\ x-Dectect");
       };
      };
     };
    };
    AntiBowInsta();
};

function autoHat() {
 if (enemy.isNear()) {
  Surf.buy("SpikeGear");
  Surf.equip("SpikeGear");
  Surf.buy("MonkeyTail");
  Surf.equip("MonkeyTail");
} else {
  Surf.buy("BoosterHat");
  Surf.equip("BoosterHat");
  Surf.buy("MonkeyTail");
  Surf.equip("MonkeyTail");
 };
};
function autoBreak() {
 if (Surf.detectTrap()) {

setInterval(function() {
Surf.buy("AppleCap");
Surf.equip("AppleCap");
Surf.buy("MonkeyTail");
Surf.equip("MonkeyTail");
setTimeout(function() {
Surf.buy("BarbarianArmor");
Surf.equip("BarbarianArmor");
Surf.buy("ShadowWings");
Surf.equip("ShadowWings");
   }, 2000);
  }, 4000);
 };
};
 function detectTrap() {
  if (enemy.detectTrap()) {
    Surf.buy("TankGear");
    Surf.equip("TankGear");
    Surf.buy("MonkeyTail");
    Surf.equip("MonkeyTail");
  };
};
function switchToAppleCap() {
  Surf.buy("TankGear");
  Surf.equip("TankGear");
  Surf.buy("MonkeyTail");
  Surf.equip("MonkeyTail");
 /* later */
  Surf.buy("AppleCap");
  Surf.equip("AppleCap");
  Surf.buy("MonkeyTail")
  Surf.equip("MonkeyTail")
};
function placeTrapsBehindPlayer() {
let trap1 = new trap(myPlayer.x - 10, myPlayer.y);
let trap2 = new trap(myPlayer.x - 20, myPlayer.y);

  Surf.add(trap1);
  Surf.add(trap2);
};
while (true) {
  detectTrap();
  switchToAppleCap();
  placeTrapsBehindPlayer();
  delay(100);
  chat("x-Surf | Dectect TrAP")
 };
function autoAttack() {
 if (enemy.isNear()) {
  Surf.buy("BullsHelmet");
  Surf.equip("BullsHelmet");
  Surf.buy("BloodWings");
  Surf.equip("BloodWings");
} else {
  Surf.buy("AppleCap");
  Surf.equip("AppleCap")
  Surf.buy("MonkeyTail")
  Surf.equip("MonkeyTail")
  Surf.attack();
 };
};
setInterval(autoAttack, 500); // 500ms
function detectEnemyTrap() {
 if (enemy.detect()) {
  placeTrapsAroundPlayer();
 };
};

function placeTrapsAroundPlayer() {

var trapPos1 = {x: myPlayer.x + 10, y: myPlayer.y};
var trapPos2 = {x: myPlayer.x - 10, y: myPlayer.y};
var trapPos3 = {x: myPlayer.x, y: myPlayer.y + 10};
var trapPos4 = {x: myPlayer.x, y: myPlayer.y - 10};

var trap1 = new trap(trapPos1.x, trapPos1.y);
var trap2 = new trap(trapPos2.x, trapPos2.y);
var trap3 = new trap(trapPos3.x, trapPos3.y);
var trap4 = new trap(trapPos4.x, trapPos4.y);

Surf.add(trap1);
Surf.add(trap2);
Surf.add(trap3);
Surf.add(trap4);
};

function detectTrapBreak() {
if (enemy.breakTrap()) {
replaceTrapWithSpike();
 };
};

function replaceTrapWithSpike() {
var brokenTrap = getBrokenTrap();

brokenTrap.replaceWith(spike);

spamSpikeOnEnemy();
};
function spamSpikeOnEnemy() {

var spikePos1 = {x: enemy.x + 5, y: enemy.y};
var spikePos2 = {x: enemy.x - 5, y: enemy.y};
var spikePos3 = {x: enemy.x, y: enemy.y + 5};
var spikePos4 = {x: enemy.x, y: enemy.y - 5};

var spike1 = new spike(spikePos1.x, spikePos1.y);
var spike2 = new spike(spikePos2.x, spikePos2.y);
var spike3 = new spike(spikePos3.x, spikePos3.y);
var spike4 = new spike(spikePos4.x, spikePos4.y);

Surf.add(spike1);
Surf.add(spike2);
Surf.add(spike3);
Surf.add(spike4);
};
setInterval(function() {
 detectEnemyTrap();
 detectTrapBreak();
 autoplaceActive();
 replaceActive();
}, 10);

let ws,
 msgpack5 = window.msgpack,
  prevCount = 0;

const attachWebSocketListener = e => {
  e.addEventListener("message", hookWS);
};
const hookWS = e => {
  // You can add actions related to WebSocket messages here
};
const chat = e => {
  sendPacket(["6", [e]]);
};
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  };
  this.oldSend(e);
};
const handleMutations = mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;
      if (count > prevCount) {
        chat("x-Surf v0.4");
      } else {
        chat("$".kills);
        prevCount = count;
      }
    }
  }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
  subtree: true,
  childList: true
});
var textElement = document.createElement("div");
textElement.style.position = "center";
textElement.style.top = "10px";
textElement.style.left = "10px";
textElement.style.fontSize = "24px";
textElement.style.fontWeight = "bold";
textElement.style.color = "white";
textElement.style.textShadow = "0 0 10px black";
textElement.textContent = "x-Surf v0.4";
document.body.appendChild(textElement);

var pingElement = document.createElement("div");
pingElement.style.position = "absolute";
pingElement.style.top = "10px";
pingElement.style.left = "50%";
pingElement.style.transform = "translateX(-50%)";
pingElement.style.fontSize = "24px";
pingElement.style.fontWeight = "bold";
pingElement.style.color = "white";
pingElement.style.textShadow = "0 0 10px black";
document.body.appendChild(pingElement);

setInterval(function() {
var ping = myPlayer.ping;
pingElement.textContent = `${ping} ms`;
}, 1000);

function attackSecondary() {
 Surf.buy("TurretGear");
 Surf.equip("TurretGear");
 Surf.buy("MonkeyTail")
 Surf.equip("MonkeyTail")
}

function attackPrimary() {
 Surf.buy("BullsHelmet");
 Surf.equip("BullsHelmet");
 Surf.buy("BloodWings");
 Surf.equip("BloodWings");
};

function boostTowardsEnemy() {
 boostPad.activate();
};

function oneTick() {
 attackSecondary();
setTimeout(function() {
 attackPrimary();
}, 50);
 boostTowardsEnemy();
};

document.addEventListener("keydown", function(event) {
 if (event.key === ".") {
  oneTick();
  chat("x-Surf | << OneTick Send >>");
 };
});

const menuContainer = document.createElement('div');
menuContainer.style.position = 'absolute';
menuContainer.style.top = '50%';
menuContainer.style.left = '50%';
menuContainer.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(menuContainer);

const menu = document.createElement('div');
menu.innerHTML = `
<h2>x-Surf v0.4</h2>
<ul>
<li><input type="checkbox" id="smooth-enable"> Smooth UI </li>
<li><label for="smooth-speed">Speed: </label> <input type="range" id="smooth-speed" min="0" max="10" value="5"></li>
<li><label for="smooth-intensity">Intensity: </label> <input type="range" id="smooth-intensity" min="0" max="10" value="5"></li>
<li><p id="player-id">ID: <span id="id-value"></span></p></li>
<li><input type="checkbox" id="autoplace-enable"> Autoplace </li>
<li><input type="checkbox" id="replace-enable"> Replace </li>
<li><input type="checkbox" id="aimbot-enable"> Aimbot </li>
<li><label for="clan-name">Clan: </label> <input type="text" id="clan-name" value="${InvisClan}" minlength="0" maxlength="30">
<button id="create-clan-btn">Create Clan</button></li>
<li>
<label for="messageToSpam">Message: </label>
<input type="text" id="messageToSpam" value="${urMessage}" minlength="0" maxlength="30">
<br>
<button id="updateMessageBtn"> Update </button>
<button id="startSpamBtn"> Start </button>
<button id="stopSpamBtn"> Stop </button>
<li><input type="checkbox" id="auto-Grind-btn"> Auto Grind </li>
</li>
<li>
<p>Auto Select: </p>
<button id="dh-btn">!dh</button>
<button id="kh-btn">!kh</button>
<button id="sm-btn">!sm</button>
<button id="ph-btn">!ph</button>
</li>
</ul>
`;

const dhBtn = document.getElementById('dh-btn');
dhBtn.addEventListener('click', () => {
console.log('Auto Select: Daggers + Hammer');
});

const khBtn = document.getElementById('kh-btn');
khBtn.addEventListener('click', () => {
console.log('Auto Select: Katana + Hammer');
});

const smBtn = document.getElementById('sm-btn');
smBtn.addEventListener('click', () => {
console.log('Auto Select: Sword + Musket');
});

const phBtn = document.getElementById('ph-btn');
phBtn.addEventListener('click', () => {
console.log('Auto Select: Polearm + Hammer');
});

const createClanBtn = document.getElementById('create-clan-btn');
createClanBtn.addEventListener('click', createClan);

function createClan() {
const clanNameInput = document.getElementById('clan-name');
const clanName = clanNameInput.value;
console.log(`Create clan: ${clanName}`);
};

setInterval(function() {
aimAtEnemy();
}, 10);

function aimAtEnemy() {
let enemy = getNearestEnemy();
if (enemy) {
let angle = getAngleToEnemy(enemy);
myPlayer.rotation = angle;
 };
};

function getNearestEnemy() {
let enemies = Surf.getEnemies();
let nearestEnemy = null;
let nearestDistance = Infinity;
for (let i = 0; i < enemies.length; i++) {
let enemy = enemies[i];
let distance = getDistanceToEnemy(enemy);
if (distance < nearestDistance) {
nearestEnemy = enemy;
nearestDistance = distance;
 };
};
return nearestEnemy;
};

function getAngleToEnemy(enemy) {
let dx = enemy.x - myPlayer.x;
let dy = enemy.y - myPlayer.y;
let angle = Math.atan2(dy, dx);
return angle;
};

function getDistanceToEnemy(enemy) {
let dx = enemy.x - myPlayer.x;
let dy = enemy.y - myPlayer.y;
let distance = Math.sqrt(dx * dx + dy * dy);
return distance;
};

menuContainer.appendChild(menu);

function showPlayerId() {
let player = Surf.getPlayer();
 let idValue = document.getElementById('id-value');
if (player.type === "animal") {
 idValue.textContent = player.animalId;
} else if (player.type === "myPlayer") {
 idValue.textContent = player.myPlayerId;
} else if (player.type === "enemy") {
 idValue.textContent = player.enemyId;
} else if (player.type === "ally") {
 idValue.textContent = player.allyId;
 };
};
setInterval(showPlayerId, 100);

autoplaceEnable.addEventListener('change', (e) => {
if (e.target.checked) {
autoplaceActive = true;
} else {
autoplaceActive = false;
 };
});

replaceEnable.addEventListener('change', (e) => {
if (e.target.checked) {
replaceActive = true;
} else {
replaceActive = false;
 };
});
setInterval(function() {
if (autoplaceActive) {
 detectEnemyTrap();
 chat("x-Surf | In Trap !");
};
if (replaceActive) {
  detectTrapBreak();
  chat("x-Surf | Replace !");
 };
}, 10);

const smoothVisualization = document.createElement('div');
smoothVisualization.style.position = 'absolute';
smoothVisualization.style.top = '0';
smoothVisualization.style.left = '0';
smoothVisualization.style.width = '100%';
smoothVisualization.style.height = '100%';
document.body.appendChild(smoothVisualization);

function activateSmooth() {
  smoothVisualization.activate();
  smoothVisualization.style.opacity = '0.5';
};

function deactivateSmooth() {
  smoothVisualization.deactivate();
  smoothVisualization.style.opacity = '0';
};

function updateSmoothSpeed(value) {
  //...
};

function updateSmoothIntensity(value) {
  //...
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    menuContainer.style.display = 'block';
  }
});
menuContainer.addEventListener('click', (e) => {
  if (e.target!== menuContainer && e.target!== menuContainer.children) {
    menuContainer.style.display = 'none';
  };
});

const smoothEnable = document.getElementById('smooth-enable');
smoothEnable.addEventListener('change', (e) => {
  if (e.target.checked) {
    activateSmooth();
  } else {
    deactivateSmooth();
  };
});

const smoothSpeed = document.getElementById('smooth-speed');
smoothSpeed.addEventListener('input', (e) => {
  updateSmoothSpeed(e.target.value);
});

const smoothIntensity = document.getElementById('smooth-intensity');
smoothIntensity.addEventListener('input', (e) => {
  updateSmoothIntensity(e.target.value);
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Space') {
 spikeTick();
 chat("x-Surf | Spike Tick");
}
});

function spikeTick() {
Surf.buy("BullsHelmet");
Surf.equip("BullsHelmet");
    /* later */
Surf.buy("Corrupt X Wings");
Surf.equip("Corrupt X Wings");

var spikePos1 = {x: myPlayer.x + 5, y: myPlayer.y};
var spikePos2 = {x: myPlayer.x - 5, y: myPlayer.y};

var spike1 = new spike(spikePos1.x, spikePos1.y);
var spike2 = new spike(spikePos2.x, spikePos2.y);

Surf.add(spike1);
Surf.add(spike2);
};
    window.sessionStorage.force = coreURL.searchParams.get("fc");
    document.msgpack = window.msgpack;
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(message) {
        if (!ws) {
            document.ws = this;
            ws = this;
        }
        this.oldSend(message);
    };
    const updateMessageBtn = document.getElementById("updateMessageBtn");
    const startSpamBtn = document.getElementById("startSpamBtn");
    const stopSpamBtn = document.getElementById("stopSpamBtn");
    updateMessageBtn.addEventListener("click", () => {
        urMessage = document.getElementById("messageToSpam").value;
        console.log("urMessage updated:", urMessage);
    });
    startSpamBtn.addEventListener("click", () => {
        if (!spamming) {
            startSpam();
        };
    });
    stopSpamBtn.addEventListener("click", () => {
        if (spamming) {
            stopSpam();
        };
    });
    document.addEventListener("keydown", event => {
        if (event.keyCode === 27) {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        };
    });
    function startSpam() {
        spamming = true;
        console.log("Spam started");
        spamInterval = setInterval(() => {
            chat(urMessage);
        }, 1500);
    };
    function stopSpam() {
        spamming = false;
        console.log("Spam stopped");
        clearInterval(spamInterval);
    }
    menu();
    function changeStyle() {
        var storeHolder = document.getElementById("storeHolder");
        var chatBox = document.getElementById("chatBox");
        var ageBarBody = document.getElementById("ageBarBody");
        if (storeHolder) {
            storeHolder.style.height = "600px";
            storeHolder.style.width = "400px";
        };
        if (chatBox) {
            chatBox.style.backgroundColor = "rgb(0 0 0 / 0%)";
        };
        if (ageBarBody) {
            ageBarBody.style.backgroundColor = "rgba(0, 128, 0, 0.8)";
            ageBarBody.style.border = "2px solid rgba(0, 128, 0, 0.5)";
        };
        if (storeHolder && chatBox && ageBarBody) {
            clearInterval(intervalId);
        };
    };
    var intervalId = setInterval(changeStyle, 500);
    window.Cow.setCodec(window.msgpack);
    CanvasRenderingContext2D.prototype._roundRect = CanvasRenderingContext2D.prototype.roundRect;
    window.Cow.addRender("global", () => {
        window.Cow.playersManager.eachVisible(player => {
            if (player === null || player === undefined || !player.alive) return;
            function renderBar({ width, innerWidth, xOffset, yOffset, color }) {
                const context = window.Cow.renderer.context;
                const healthBarPad = window.config.healthBarPad;
                const height = 17;
                const radius = 8;
                context.save();
                context.fillStyle = "#3d3f42";
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width - healthBarPad, -8.5, 2 * width + 2 * healthBarPad, height, radius);
                context.fill();
                context.restore();
                context.save();
                context.fillStyle = color;
                context.translate(xOffset, yOffset);
                context.beginPath();
                context._roundRect(-width, -8.5 + healthBarPad, 2 * innerWidth, height - 2 * healthBarPad, radius - 1);
                context.fill();
                context.restore();
            }
            const width = window.config.healthBarWidth / 2 - window.config.healthBarPad / 2;
            const primaryReloadCount = Math.min(Math.max(player.reloads.primary.count / player.reloads.primary.max, 0), 1);
            const secondaryReloadCount = Math.min(Math.max(player.reloads.secondary.count / player.reloads.secondary.max, 0), 1);
            const yOffset = player.renderY + player.scale + window.config.nameY - 5;
            renderBar({
                width,
                innerWidth: width * primaryReloadCount,
                xOffset: player.renderX - width * 1.19,
                yOffset,
                color: player.isAlly ? "#ffffff" : "#cc5151"
            });
            renderBar({
                width,
                innerWidth: width * secondaryReloadCount,
                xOffset: player.renderX + width * 1.19,
                yOffset,
                color: player.isAlly ? "#000000" : "#cc5151"
            });
        });
    });
const originalSend = WebSocket.prototype.send;
window.playerSocket = null;
window.botSockets = [];

WebSocket.prototype.send = function (...args) {
  this.addEventListener("message", function (e) {
    const [packet, data] = msgpack.decode(new Uint8Array(e.data));
    if (packet == "C" && myPlayer.sid == null) {
      console.log("game started");
      myPlayer.dead = false;
      myPlayer.sid = data[0];
    };
    if (packet == "M" && myPlayer.dead) {
      myPlayer.dead = false;
    };
  });
  if (window.playerSocket == null) {
    window.playerSocket = this;
  };
  originalSend.call(this, ...args);
};
const checkChange = setInterval(() => {
  if (window.playerSocket != null) {
    socketFound(window.playerSocket, -1);
    clearInterval(checkChange);
    botJoin(3);
  };
}, 100);
function botJoin(amount) {
  let t = window.playerSocket.url.split("wss://")[1].split("?")[0];
  let index = 0;
  for (let i = 0; i < amount; i++) {
    window.grecaptcha
      .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
        action: "homepage",
      })
      .then((a) => {
        window.botSockets.push(
          new WebSocket(
            "wss://" + t + "?token=" + "re:" + encodeURIComponent(a)
          )
        );
        if (i == amount) {
          window.botSockets.forEach((botSocket) => {
            botSocket.binaryType = "arraybuffer";
            botSocket.onopen = () => {
              window.bots.push({
                number: i,
                sid: null,
                x: null,
                y: null,
                toX: null,
                toY: null,
                age: null,
                lvl: 0,
                hold: false,
                movement: "follow",
                toX: null,
                toY: null,
                angle: null,
                dead: true,
                health: 100,
                items: [0, 3, 6, 10],
              });
              let packet = "M";
              index+=1;
              let data = [{ moofoll: "1", name: "x-Bot" + index, skin: 0 }];
              sendPacket(botSocket, packet, data);
              socketFound(botSocket, window.botSockets.indexOf(botSocket));
            };
          });
        }
      });
  }
}

window.player = myPlayer;
window.bots = [];
function socketFound(socket, indexOfSocket) {
  socket.addEventListener("message", function (message) {
    viewMessage(message, indexOfSocket);
  });
  if (indexOfSocket != -1 && window.bots[indexOfSocket] && !myPlayer.dead) {
    setInterval(() => {
      window.bots[indexOfSocket].angle = parseFloat(
          Math.atan2(
              myPlayer.y - window.bots[indexOfSocket].y,
              myPlayer.x - window.bots[indexOfSocket].x
          ).toFixed(2)
      );
      sendPacket(window.botSockets[indexOfSocket], "D", [
        window.bots[indexOfSocket].angle,
      ]);
      let dist = Math.sqrt(
          Math.pow(myPlayer.x - window.bots[indexOfSocket].x, 2) +
          Math.pow(myPlayer.y - window.bots[indexOfSocket].y, 2)
      );
        if(window.bots[indexOfSocket].movement == "follow") {
            sendPacket(window.botSockets[indexOfSocket], "a", [
                window.bots[indexOfSocket].angle,
            ]);
        } else if(window.bots[indexOfSocket].movement == "harvest") {
            sendPacket(window.botSockets[indexOfSocket], "a", [
                window.bots[indexOfSocket].angle,
            ]);
            allBotClick();
        };
      if (window.bots[indexOfSocket].dead) {
        let pack = "M";
        let dat = [{ moofoll: "1", name: "MooMoo Bot " + (indexOfSocket + 1), skin: 0 }];
        sendPacket(window.botSockets[indexOfSocket], pack, dat);
      };
    }, 100);
  };
  socket.send = function (...args) {
    const [packet, data] = msgpack.decode(new Uint8Array(args[0]));
    if (!["G", "N", "O", "D"].includes(packet)) {
    };
    if (packet === "a" && data[0] != null) {
    };
    if(packet == 6 && data[0] != null) {
        let message = data[0];
        if(message == "attack") {
            allBotClick();
        } else if(message == "hold") {
            allBotStop();
        } else if(message == "follow") {
            allBotFollow();
        } else if(message == "heal") {
            allBotHeal();
        } else if(message == "upgrade") {
            allBotUpgrade();
        } else if(message == "harvest") {
            allBotHarvest();
        } else if(message == "switch") {
            allBotSwitch();
        } else if(message.substring(0, 4) == "team") {
            allBotTeam(message.substring(5));
        } else if(message.substring(0, 5) == "heal ") {
            heal(+message.substring(5));
        } else if(message.substring(0, 7) == "attack ") {
            botClick(+message.substring(7));
        } else if(message.substring(0, 8) == "upgrade ") {
            upgrade(+message.substring(8));
        } else if(message.substring(0, 7) == "follow ") {
            follow(+message.substring(7));
        } else if(message.substring(0, 5) == "hold ") {
            stop(+message.substring(5));
        } else if(message.substring(0, 7) == "switch ") {
            switchWepon(+message.substring(7));
        };
    };
      if(packet === "H") {
          console.log(packet);
          console.log(data);
      };
    const arr = new Uint8Array(Array.from(msgpack.encode([packet, data])));
    originalSend.call(this, arr);
  };
};
function click() {
    sendPacket(window.playerSocket, "d", [1]);
    sendPacket(window.playerSocket, "d", [0]);
};
function botClick(bot) {
    sendPacket(window.botSockets[bot], "d", [1]);
    sendPacket(window.botSockets[bot], "d", [0]);
};
function upgrade(bot) {
    switch(window.bots[bot].lvl) {
        case 0:
            sendPacket(window.botSockets[bot], "H", [3]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Polearm"]);
        break;
        case 1:
            sendPacket(window.botSockets[bot], "H", [17]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Cookie"]);
        break;
        case 2:
            sendPacket(window.botSockets[bot], "H", [31]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Pit-Trap"]);
        break;
        case 3:
            sendPacket(window.botSockets[bot], "H", [23]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Greater Spikes"]);
        break;
        case 4:
            sendPacket(window.botSockets[bot], "H", [9]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Hunting Bow"]);
        break;
        case 5:
            sendPacket(window.botSockets[bot], "H", [33]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Turret"]);
        break;
        case 6:
            sendPacket(window.botSockets[bot], "H", [12]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked CrossBow"]);
        break;
        case 7:
            sendPacket(window.botSockets[bot], "H", [15]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Musket"]);
        break;
    };
    window.bots[bot].lvl+=1;
};
function allBotClick() {
    for(let i = 0; i < window.botSockets.length; i++) {
        botClick(i);
    };
};
function switchWepon(bot) {
    sendPacket(window.botSockets[bot], "G", [
        window.bots[bot].items[0],
    ]);
};
function allBotSwitch() {
    for(let i = 0; i < window.botSockets.length; i++) {
        switchWepon(i);
    };
};
function heal(bot) {
    sendPacket(window.botSockets[bot], "G", [
        window.bots[bot].items[0],
    ]);
    sendPacket(window.botSockets[bot], "d", [1]);
    sendPacket(window.botSockets[bot], "d", [0]);
};
function allBotHeal() {
    for(let i = 0; i < window.botSockets.length; i++) {
        heal(i);
    };
};
function allBotUpgrade() {
    for(let i = 0; i < window.botSockets.length; i++) {
        upgrade(i);
    };
};
function allBotHarvest() {
    for(let i = 0; i < window.bots.length; i++) {
        sendPacket(window.botSockets[i], "6", ["Bot Mode: Harvesting"]);
        window.bots[i].movement = "harvest";
        window.bots[i].hold = false;
    };
};
function team(bot, team) {
    sendPacket(window.botSockets[bot], "6", ["!join " + team]);
    sendPacket(window.botSockets[bot], "b", [team]);
};
function allBotTeam(teamToJoin) {
    for(let i = 0; i < window.botSockets.length; i++) {
        team(i, teamToJoin);
    };
};
function stop(bot) {
    window.bots[bot].hold = true;
};
function allBotStop() {
    for(let i = 0; i < window.bots.length; i++) {
        stop(i);
    };
};
function follow(bot) {
    sendPacket(window.botSockets[bot], "6", ["Bot Mode: Following"]);
    window.bots[bot].hold = false;
    window.bots[bot].movement = "follow";
};
function allBotFollow() {
    for(let i = 0; i< window.bots.length; i++) {
        follow(i);
    };
};
function viewMessage(m, indexOfSocket) {
  const [packet, data] = msgpack.decode(new Uint8Array(m.data));
  if (["C"].includes(packet) && indexOfSocket != -1) {
    console.log("SETTING SID", indexOfSocket);
    window.bots[indexOfSocket].sid = data[0];
    window.bots[indexOfSocket].dead = false;
    window.bots[indexOfSocket].health = 100;
  };
  if (packet == "P") {
    indexOfSocket == -1
      ? ((myPlayer.dead = true), (myPlayer.health = 100))
      : (window.bots[indexOfSocket].dead = true);
  };
  if (["a"].includes(packet) && data[0].length > 0) {
    if (indexOfSocket != -1) {
     let myData = data[0].slice(
        data[0].indexOf(window.bots[indexOfSocket].sid),
        data[0].indexOf(window.bots[indexOfSocket].sid) + 13
      );
      if(!window.bots[indexOfSocket].hold) {
          window.bots[indexOfSocket].x = myData[1] - Math.cos(myPlayer.angle) * 150;
          window.bots[indexOfSocket].y = myData[2] - Math.sin(myPlayer.angle) * 150;
          window.bots[indexOfSocket].toX = myData[1] - Math.cos(myPlayer.angle) * 150;
          window.bots[indexOfSocket].toY = myData[2] - Math.sin(myPlayer.angle) * 150;
      } else {
          window.bots[indexOfSocket].x = window.bots[indexOfSocket].toX;
          window.bots[indexOfSocket].y = window.bots[indexOfSocket].toY;
      };
    } else {
      let myData = data[0].slice(
        data[0].indexOf(myPlayer.sid),
        data[0].indexOf(myPlayer.sid) + 13
      );
      myPlayer.x = myData[1];
      myPlayer.y = myData[2];
      myPlayer.angle = myData[3];
    };
    if (indexOfSocket != -1) {
    };
  };
  let items = [0, 3, 6, 10];
  if (packet == "V" && !data[1]) {
    window.bots[indexOfSocket].items = data[0];
  };
  if (packet == "O" && indexOfSocket != -1) {
    window.bots[indexOfSocket].health = data[1];
    let dist = Math.sqrt(
      Math.pow(myPlayer.x - window.bots[indexOfSocket].x, 2) +
        Math.pow(myPlayer.y - window.bots[indexOfSocket].y, 2)
    );
    if (
      !window.botSockets[indexOfSocket].dead &&
      healOn &&
      window.bots[indexOfSocket].health < ahth &&
      window.bots[indexOfSocket].health > 0 &&
      dist > 200
    ) {
      setTimeout(function () {
        for (let i = 0; i < ahrp; i++) {
          sendPacket(window.botSockets[indexOfSocket], "G", [
            window.bots[indexOfSocket].items[0],
          ]);
          sendPacket(window.botSockets[indexOfSocket], "d", [1]);
          sendPacket(window.botSockets[indexOfSocket], "d", [0]);
        };
      }, healSpeed);
    };
  };
  if (packet == "O" && indexOfSocket == -1) {
    myPlayer.health = data[1];
    if (
      !myPlayer.dead &&
      healOn &&
      myPlayer.health < ahth &&
      myPlayer.health > 0
    ) {
      setTimeout(function () {
        for (let i = 0; i < ahrp; i++) {
          sendPacket(window.playerSocket, "G", [0]);
          sendPacket(window.playerSocket, "d", [1]);
          sendPacket(window.playerSocket, "d", [0]);
        };
      }, healSpeed);
    };
  };
};
const sendPacket = e => socket => packet => data => {
  const arr = new Uint8Array(Array.from(msgpack.encode([packet, data])));
  socket.send(arr);
  if (ws) {
    ws.send(msgpack5.encode(e));
  };
};
    window.addEventListener('load', function() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const originalDrawImage = ctx.drawImage;
        ctx.drawImage = function () {
            this.shadowColor = "rgba(50, 50, 50, 0.5)";
            this.shadowBlur = 10;
            originalDrawImage.apply(this, arguments);
            this.shadowColor = "transparent";
            this.shadowBlur = 0;
        };
    });
    document.getElementById('loadingText').innerHTML = 'Loading...';
    document.getElementById('loadingText').style.color = "000000";
    document.getElementById("nameInput").style.backgroundColor = "black";
    document.getElementById("nameInput").style.color = "000000";
    document.getElementById("enterGame").style.backgroundColor = "Black";
    document.getElementById("enterGame").style.color = "000000";
    document.getElementById("mainMenu").style.backgroundRepeat = "no-repeat";
    document.getElementById("mainMenu").style.backgroundSize = "cover";
    document.getElementById('enterGame').innerHTML = 'Lets Go!';
    document.getElementById('enterGame').style.color = 'text-shadow: red 1px 1px 40px;';
    document.getElementById('nameInput').placeholder = "tester";
    document.getElementById('diedText').innerHTML = 'Shh :>';
    document.getElementById('gameName').innerHTML = 'x-Surf';
    document.getElementById('gameName').style.color = "000000";
    document.getElementById("leaderboard").append ('v0.4');
    document.getElementById("leaderboard").style.color = "text-shadow: green 2px 2px 40px;";
    document.getElementById("leaderboard").style.border = "2px solid yellow";
    document.getElementById("moomooio_728x90_home").style.display = "none";
    $("#moomooio_728x90_home").parent().css({display: "none"});
    document.getElementById("adCard").style.display = "none";
    $("#adCard").parent().css({display: "none"});
    let ageBar = document.getElementById("ageBar");
    let hueAgeBar = 0;
    function updateAgeBarColor() {
        ageBar.style.backgroundColor = `hsl(${hueAgeBar}, 100%, 50%)`;
        hueAgeBar = (hueAgeBar + 1) % 360;
    }
    let intervalAgeBarId = setInterval(updateAgeBarColor, 50);
    let leaderboard = document.getElementById("leaderboard");
    let hueLeaderboard = 0;
    function updateLeaderboardColor() {
        leaderboard.style.borderColor = `hsl(${hueLeaderboard}, 100%, 50%)`;
        hueLeaderboard = (hueLeaderboard + 1) % 360;
    }
    let intervalLeaderboardId = setInterval(updateLeaderboardColor, 50);
    let foodDisplay = document.getElementById("foodDisplay");
    let woodDisplay = document.getElementById("woodDisplay");
    let stoneDisplay = document.getElementById("stoneDisplay");
    let scoreDisplay = document.getElementById("scoreDisplay");
    let hueText = 0;
    function updateTextColors() {
        foodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        woodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        stoneDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        scoreDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;
        hueText = (hueText + 1) % 360;
    };
    let intervalTextId = setInterval(updateTextColors, 50);
    let mapDisplay = document.getElementById("mapDisplay");
    mapDisplay.style.backgroundImage = "url('https://i.imgur.com/fgFsQJp.png')";
    mapDisplay.style.backgroundRepeat = "no-repeat";
    mapDisplay.style.backgroundSize = "cover";
var music1link = "https://cdn.discordapp.com/attachments/728226830414381056/731040059054096404/Astronomia_Remix_By_Jiaye_Trending_TikTok_EDM_Full_Version.mp3"
var music1 = new Audio(music1link);
var Music = document.querySelector("#Music")
Music.addEventListener('change', function() {
    if (this.checked) {
        music1.play();
    } else {
        music1.pause();
    };
});
let lastMouseUpdate = 0;

document.addEventListener('mousemove', (e) => {
let now = Date.now();
if (now - lastMouseUpdate >= 50) {
lastMouseUpdate = now;
let slowMouseSpeed = 0.5;
let mouseX = e.clientX;
let mouseY = e.clientY;
myPlayer.rotation = Math.atan2(mouseY - myPlayer.y, mouseX - myPlayer.x) * slowMouseSpeed;
 };
});
sword.texture = new Texture('katana.png');

class katana extends sword {
  constructor() {
    super();
    this.texture = new Texture('katana.png');
  }
}
Surf.items.sword = katana;
let bullSpamDetection = {
attackCount: 0,
lastAttackTime: 0,
threshold: 10,
timeout: 1000,

checkForBullSpam: function(player) {
let currentTime = Date.now();
let timeDiff = currentTime - this.lastAttackTime;

if (timeDiff < this.timeout) {
this.attackCount++;
if (this.attackCount >= this.threshold) {
console.log(`BullsSpam detect in player ${player.name}!`);
chat("x-Surf | pAB process");

if (true) {
Surf.player.buy("SpikeGear");
Surf.player.equip("SpikeGear");
Surf.player.buy("CorruptXWings")
Surf.player.equip("CorruptXWings")
  };
 };
} else {
this.attackCount = 1;
this.lastAttackTime = currentTime;
 };
 }
};
const autoGrid = {
enabled: false,
elements: ["Age 7", "Age 8"],

start: function() {
this.enabled = true;
this.grid();
},
grid: function() {
if (!this.enabled) return;
for (let direction of ["left", "right", "up", "down"]) {
for (let element of this.elements) {
Surf.player.placeElement(element, direction);
  };
 };
},
stop: function() {
this.enabled = false;
 }
};

const autoGridBtn = document.createElement("button");
autoGridBtn.innerHTML = "Auto Grid";
autoGridBtn.addEventListener("click", () => {
if (autoGrid.enabled) {
autoGrid.stop();
} else {
autoGrid.start();
 }
});
const autoWindmills = {
enabled: false,

start: function() {
this.enabled = true;
this.generateWindmills();
},

generateWindmills: function() {
if (!this.enabled) return;

setInterval(() => {
for (let i = 0; i < 3; i++) {
Surf.player.placeWindmill();
  };
 }, 510);
},

stop: function() {
this.enabled = false;
 }
};
Surf.addEventListener("keydown", (e) => {
if (e.key === "m" || e.key === "M") {
if (autoWindmills.enabled) {
autoWindmills.stop();
} else {
autoWindmills.start();
  };
 };
});

document.addEventListener("mousewheel", (e) => {
if (e.deltaY > 0) {
 zoomLevel += 0.1;
} else {
 zoomLevel -= 0.1;
};

Surf.camera.scale.set(zoomLevel, zoomLevel);
});