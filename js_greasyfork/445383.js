// ==UserScript==
// @name        Teddy Mod
// @namespace    -   
// @version      1.5
// @description  Controls (Z = Tank Gear | T = Bull Helmet | Y = Emp Helmet | I = Assassin Gear | K = Soldier Helmet | B = Turret Gear | Shift = Auto Hat | Insert = Samurai Armor | Delete = Marksman Cap | End = Police Hat | Backspace = Chat Mod)
// @author       BrownTeddy
// @license      f
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        noneT
// @icon         https://giphy.com/gifs/movie-man-willsmith-gi8JtlDffQMexR3YcU
// @downloadURL https://update.greasyfork.org/scripts/445383/Teddy%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/445383/Teddy%20Mod.meta.js
// ==/UserScript==
document.getElementById("mainMenu").style.backgroundImage = "url(https://giphy.com/gifs/movie-man-willsmith-gi8JtlDffQMexR3YcU)";

(function() {
    'use strict';

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
                    }
                    break;
            }
        }

        function appendNull(data) {
            appendByte(0xc0);
        }

        function appendBoolean(data) {
            appendByte(data ? 0xc3 : 0xc2);
        }

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
                }
            } else {
                if (!floatView) {
                    floatBuffer = new ArrayBuffer(8);
                    floatView = new DataView(floatBuffer);
                }
                floatView.setFloat64(0, data);
                appendByte(0xcb);
                appendBytes(new Uint8Array(floatBuffer));
            }
        }

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
            }

            appendBytes(bytes);
        }

        function appendArray(data) {
            let length = data.length;

            if (length <= 0xf) {
                appendByte(0x90 + length);
            } else if (length <= 0xffff) {
                appendBytes([0xdc, length >>> 8, length]);
            } else {
                appendBytes([0xdd, length >>> 24, length >>> 16, length >>> 8, length]);
            }

            for (let index = 0; index < length; index++) {
                append(data[index]);
            }
        }

        function appendBinArray(data) {
            let length = data.length;

            if (length <= 0xf) {
                appendBytes([0xc4, length]);
            } else if (length <= 0xffff) {
                appendBytes([0xc5, length >>> 8, length]);
            } else {
                appendBytes([0xc6, length >>> 24, length >>> 16, length >>> 8, length]);
            }

            appendBytes(data);
        }

        function appendObject(data) {
            let length = 0;
            for (let key in data) length++;

            if (length <= 0xf) {
                appendByte(0x80 + length);
            } else if (length <= 0xffff) {
                appendBytes([0xde, length >>> 8, length]);
            } else {
                appendBytes([0xdf, length >>> 24, length >>> 16, length >>> 8, length]);
            }

            for (let key in data) {
                append(key);
                append(data[key]);
            }
        }

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
            }
        }

        function appendByte(byte) {
            if (array.length < length + 1) {
                let newLength = array.length * 2;
                while (newLength < length + 1)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array[length] = byte;
            length++;
        }

        function appendBytes(bytes) {
            if (array.length < length + bytes.length) {
                let newLength = array.length * 2;
                while (newLength < length + bytes.length)
                    newLength *= 2;
                let newArray = new Uint8Array(newLength);
                newArray.set(array);
                array = newArray;
            }
            array.set(bytes, length);
            length += bytes.length;
        }

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
            }
            appendBytes([hi >>> 24, hi >>> 16, hi >>> 8, hi, lo >>> 24, lo >>> 16, lo >>> 8, lo]);
        }
    }

    function deserialize(array) {
        const pow32 = 0x100000000; // 2^32
        let pos = 0;
        if (array instanceof ArrayBuffer) {
            array = new Uint8Array(array);
        }
        if (typeof array !== "object" || typeof array.length === "undefined") {
            throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
        }
        if (!array.length) {
            throw new Error("Invalid argument: The byte array to deserialize is empty.");
        }
        if (!(array instanceof Uint8Array)) {
            array = new Uint8Array(array);
        }
        let data = read();
        if (pos < array.length) {
        }
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
        }

        function readInt(size) {
            let value = 0;
            let first = true;
            while (size-- > 0) {
                if (first) {
                    let byte = array[pos++];
                    value += byte & 0x7f;
                    if (byte & 0x80) {
                        value -= 0x80;
                    }
                    first = false;
                }
                else {
                    value *= 256;
                    value += array[pos++];
                }
            }
            return value;
        }

        function readUInt(size) {
            let value = 0;
            while (size-- > 0) {
                value *= 256;
                value += array[pos++];
            }
            return value;
        }

        function readFloat(size) {
            let view = new DataView(array.buffer, pos, size);
            pos += size;
            if (size === 4) {
                return view.getFloat32(0, false);
            }
            if (size === 8) {
                return view.getFloat64(0, false);
            }
        }

        function readBin(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = array.subarray(pos, pos + size);
            pos += size;
            return data;
        }

        function readMap(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = {};
            while (size-- > 0) {
                let key = read();
                data[key] = read();
            }
            return data;
        }

        function readArray(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let data = [];
            while (size-- > 0) {
                data.push(read());
            }
            return data;
        }

        function readStr(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let start = pos;
            pos += size;
            return decodeUtf8(array, start, size);
        }

        function readExt(size, lengthSize) {
            if (size < 0) size = readUInt(lengthSize);
            let type = readUInt(1);
            let data = readBin(size);
            switch (type) {
                case 255:
                    return readExtDate(data);
            }
            return { type: type, data: data };
        }

        function readExtDate(data) {
            if (data.length === 4) {
                let sec = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                return new Date(sec * 1000);
            }
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
            }
            if (data.length === 12) {
                let ns = ((data[0] << 24) >>> 0) +
                    ((data[1] << 16) >>> 0) +
                    ((data[2] << 8) >>> 0) +
                    data[3];
                pos -= 8;
                let sec = readInt(8);
                return new Date(sec * 1000 + ns / 1000000);
            }
            throw new Error("Invalid data length for a date value.");
        }
    }

    function encodeUtf8(str) {
        let ascii = true, length = str.length;
        for (let x = 0; x < length; x++) {
            if (str.charCodeAt(x) > 127) {
                ascii = false;
                break;
            }
        }

        let i = 0, bytes = new Uint8Array(str.length * (ascii ? 1 : 4));
        for (let ci = 0; ci !== length; ci++) {
            let c = str.charCodeAt(ci);
            if (c < 128) {
                bytes[i++] = c;
                continue;
            }
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
            }
            bytes[i++] = c & 63 | 128;
        }
        return ascii ? bytes : bytes.subarray(0, i);
    }

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
            }
            if (c <= 0xffff) str += String.fromCharCode(c);
            else if (c <= 0x10ffff) {
                c -= 0x10000;
                str += String.fromCharCode(c >> 10 | 0xd800)
                str += String.fromCharCode(c & 0x3FF | 0xdc00)
            }
            else throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
        }
        return str;
    }

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
    }

})();

!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});

(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){function e(t){for(var e=t.css("visibility");"inherit"===e;)t=t.parent(),e=t.css("visibility");return"hidden"!==e}function i(t){for(var e,i;t.length&&t[0]!==document;){if(e=t.css("position"),("absolute"===e||"relative"===e||"fixed"===e)&&(i=parseInt(t.css("zIndex"),10),!isNaN(i)&&0!==i))return i;t=t.parent()}return 0}function s(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.regional.en=t.extend(!0,{},this.regional[""]),this.regional["en-US"]=t.extend(!0,{},this.regional.en),this.dpDiv=n(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function n(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.on("mouseout",i,function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).on("mouseover",i,o)}function o(){t.datepicker._isDisabledDatepicker(m.inline?m.dpDiv.parent()[0]:m.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))}function a(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}function r(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.ui=t.ui||{},t.ui.version="1.12.0";var h=0,l=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},h=e.split(".")[0];e=e.split(".")[1];var l=h+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][l.toLowerCase()]=function(e){return!!t.data(e,l)},t[h]=t[h]||{},n=t[h][e],o=t[h][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:h,widgetName:e,widgetFullName:l}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var i,s,n=l.call(arguments,1),o=0,a=n.length;a>o;o++)for(i in n[o])s=n[o][i],n[o].hasOwnProperty(i)&&void 0!==s&&(e[i]=t.isPlainObject(s)?t.isPlainObject(e[i])?t.widget.extend({},e[i],s):t.widget.extend({},s):s);return e},t.widget.bridge=function(e,i){var s=i.prototype.widgetFullName||e;t.fn[e]=function(n){var o="string"==typeof n,a=l.call(arguments,1),r=this;return o?this.each(function(){var i,o=t.data(this,s);return"instance"===n?(r=o,!1):o?t.isFunction(o[n])&&"_"!==n.charAt(0)?(i=o[n].apply(o,a),i!==o&&void 0!==i?(r=i&&i.jquery?r.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+n+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+n+"'")}):(a.length&&(n=t.widget.extend.apply(null,[n].concat(a))),this.each(function(){var e=t.data(this,s);e?(e.option(n||{}),e._init&&e._init()):t.data(this,s,new i(n,this))})),r}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(e,i){i=t(i||this.defaultElement||this)[0],this.element=t(i),this.uuid=h++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},i!==this&&(t.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===i&&this.destroy()}}),this.document=t(i.style?i.ownerDocument:i.document||i),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+o.eventNamespace,c=h[2];c?n.on(l,c,r):i.on(l,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,function(){function e(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function s(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}var n,o,a=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;o=function(){var e=t("<div>").css("position","absolute").appendTo("body").offset({top:1.5,left:1.5}),i=1.5===e.offset().top;return e.remove(),o=function(){return i},i},t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,s=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return t("body").append(s),e=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,e===i&&(i=s[0].clientWidth),s.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType,o=!s&&!n;return{element:i,isWindow:s,isDocument:n,offset:o?t(e).offset():{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.outerWidth(),height:i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=t.extend({},n);var p,g,m,_,v,b,y=t(n.of),w=t.position.getWithinInfo(n.within),k=t.position.getScrollInfo(w),x=(n.collision||"flip").split(" "),C={};return b=s(y),y[0].preventDefault&&(n.at="left top"),g=b.width,m=b.height,_=b.offset,v=t.extend({},_),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):c.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=c.test(i[1])?i[1]:"center",t=u.exec(i[0]),e=u.exec(i[1]),C[this]=[t?t[0]:0,e?e[0]:0],n[this]=[d.exec(i[0])[0],d.exec(i[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===n.at[0]?v.left+=g:"center"===n.at[0]&&(v.left+=g/2),"bottom"===n.at[1]?v.top+=m:"center"===n.at[1]&&(v.top+=m/2),p=e(C.at,g,m),v.left+=p[0],v.top+=p[1],this.each(function(){var s,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=i(this,"marginLeft"),b=i(this,"marginTop"),D=u+f+i(this,"marginRight")+k.width,I=d+b+i(this,"marginBottom")+k.height,T=t.extend({},v),P=e(C.my,c.outerWidth(),c.outerHeight());"right"===n.my[0]?T.left-=u:"center"===n.my[0]&&(T.left-=u/2),"bottom"===n.my[1]?T.top-=d:"center"===n.my[1]&&(T.top-=d/2),T.left+=P[0],T.top+=P[1],o()||(T.left=h(T.left),T.top=h(T.top)),s={marginLeft:f,marginTop:b},t.each(["left","top"],function(e,i){t.ui.position[x[e]]&&t.ui.position[x[e]][i](T,{targetWidth:g,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:s,collisionWidth:D,collisionHeight:I,offset:[p[0]+P[0],p[1]+P[1]],my:n.my,at:n.at,within:w,elem:c})}),n.using&&(l=function(t){var e=_.left-T.left,i=e+g-u,s=_.top-T.top,o=s+m-d,h={target:{element:y,left:_.left,top:_.top,width:g,height:m},element:{element:c,left:T.left,top:T.top,width:u,height:d},horizontal:0>i?"left":e>0?"right":"center",vertical:0>o?"top":s>0?"bottom":"middle"};u>g&&g>r(e+i)&&(h.horizontal="center"),d>m&&m>r(s+o)&&(h.vertical="middle"),h.important=a(r(e),r(i))>a(r(s),r(o))?"horizontal":"vertical",n.using.call(this,t,h)}),c.offset(t.extend(T,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,o=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-o-n;e.collisionWidth>o?h>0&&0>=l?(i=t.left+h+e.collisionWidth-o-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+o-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=a(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,o=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-o-n;e.collisionHeight>o?h>0&&0>=l?(i=t.top+h+e.collisionHeight-o-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+o-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=a(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,a=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-a-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-a-o,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,a=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-a-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-a-o,(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-h,(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position,t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])}}),t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}});var c="ui-effects-",u="ui-effects-style",d="ui-effects-animated",p=t;t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,o){var a,r=o.re.exec(i),h=r&&o.parse(r),l=o.space||"rgba";return h?(a=s[l](h),s[c[l].cache]=a[c[l].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,a,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,h],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),o=c[n],a=0===this.alpha()?l("transparent"):this,r=a[o.cache]||o.to(a._rgba),h=r.slice();return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],l=s[o],c=u[n.type]||{};null!==l&&(null===a?h[o]=l:(c.mod&&(l-a>c.mod/2?a+=c.mod:a-l>c.mod/2&&(a-=c.mod)),h[o]=i((l-a)*e+a,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),h=Math.min(s,n,o),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-o)/l+360:n===r?60*(o-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[a]&&(this[a]=h(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[a]=d,n):l(d)},f(o,function(e,i){l.fn[e]||(l.fn[e]=function(n){var o,a=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=l(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(p),function(){function e(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function i(e,i){var s,o,a={};for(s in i)o=i[s],e[s]!==o&&(n[s]||(t.fx.step[s]||!isNaN(parseFloat(o)))&&(a[s]=o));return a}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(p.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(n,o,a,r){var h=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",l=h.children?a.find("*").addBack():a;l=l.map(function(){var i=t(this);return{el:i,start:e(this)}}),o=function(){t.each(s,function(t,e){n[e]&&a[e+"Class"](n[e])})},o(),l=l.map(function(){return this.end=e(this.el[0]),this.diff=i(this.start,this.end),this}),a.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(e){return function(i,s,n,o,a){return"boolean"==typeof s||void 0===s?n?t.effects.animateClass.call(this,s?{add:i}:{remove:i},n,o,a):e.apply(this,arguments):t.effects.animateClass.call(this,{toggle:i},s,n,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function e(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function i(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}function s(t,e){var i=e.outerWidth(),s=e.outerHeight(),n=/^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,o=n.exec(t)||["",0,i,s,0];return{top:parseFloat(o[1])||0,right:"auto"===o[2]?i:parseFloat(o[2]),bottom:"auto"===o[3]?s:parseFloat(o[3]),left:parseFloat(o[4])||0}}t.expr&&t.expr.filters&&t.expr.filters.animated&&(t.expr.filters.animated=function(e){return function(i){return!!t(i).data(d)||e(i)}}(t.expr.filters.animated)),t.uiBackCompat!==!1&&t.extend(t.effects,{save:function(t,e){for(var i=0,s=e.length;s>i;i++)null!==e[i]&&t.data(c+e[i],t[0].style[e[i]])},restore:function(t,e){for(var i,s=0,n=e.length;n>s;s++)null!==e[s]&&(i=t.data(c+e[s]),t.css(e[s],i))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).trigger("focus"),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).trigger("focus")),e}}),t.extend(t.effects,{version:"1.12.0",define:function(e,i,s){return s||(s=i,i="effect"),t.effects.effect[e]=s,t.effects.effect[e].mode=i,s},scaledDimensions:function(t,e,i){if(0===e)return{height:0,width:0,outerHeight:0,outerWidth:0};var s="horizontal"!==i?(e||100)/100:1,n="vertical"!==i?(e||100)/100:1;return{height:t.height()*n,width:t.width()*s,outerHeight:t.outerHeight()*n,outerWidth:t.outerWidth()*s}},clipToBox:function(t){return{width:t.clip.right-t.clip.left,height:t.clip.bottom-t.clip.top,left:t.clip.left,top:t.clip.top}},unshift:function(t,e,i){var s=t.queue();e>1&&s.splice.apply(s,[1,0].concat(s.splice(e,i))),t.dequeue()},saveStyle:function(t){t.data(u,t[0].style.cssText)},restoreStyle:function(t){t[0].style.cssText=t.data(u)||"",t.removeData(u)},mode:function(t,e){var i=t.is(":hidden");return"toggle"===e&&(e=i?"show":"hide"),(i?"hide"===e:"show"===e)&&(e="none"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createPlaceholder:function(e){var i,s=e.css("position"),n=e.position();return e.css({marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()),/^(static|relative)/.test(s)&&(s="absolute",i=t("<"+e[0].nodeName+">").insertAfter(e).css({display:/^(inline|ruby)/.test(e.css("display"))?"inline-block":"block",visibility:"hidden",marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight"),"float":e.css("float")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).addClass("ui-effects-placeholder"),e.data(c+"placeholder",i)),e.css({position:s,left:n.left,top:n.top}),i},removePlaceholder:function(t){var e=c+"placeholder",i=t.data(e);i&&(i.remove(),t.removeData(e))},cleanUp:function(e){t.effects.restoreStyle(e),t.effects.removePlaceholder(e)},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function i(e){function i(){r.removeData(d),t.effects.cleanUp(r),"hide"===s.mode&&r.hide(),a()}function a(){t.isFunction(h)&&h.call(r[0]),t.isFunction(e)&&e()}var r=t(this);s.mode=c.shift(),t.uiBackCompat===!1||o?"none"===s.mode?(r[l](),a()):n.call(r[0],s,i):(r.is(":hidden")?"hide"===l:"show"===l)?(r[l](),a()):n.call(r[0],s,a)}var s=e.apply(this,arguments),n=t.effects.effect[s.effect],o=n.mode,a=s.queue,r=a||"fx",h=s.complete,l=s.mode,c=[],u=function(e){var i=t(this),s=t.effects.mode(i,l)||o;i.data(d,!0),c.push(s),o&&("show"===s||s===o&&"hide"===s)&&i.show(),o&&"none"===s||t.effects.saveStyle(i),t.isFunction(e)&&e()};return t.fx.off||!n?l?this[l](s.duration,h):this.each(function(){h&&h.call(this)}):a===!1?this.each(u).each(i):this.queue(r,u).queue(r,i)},show:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="show",this.effect.call(this,n)}}(t.fn.show),hide:function(t){return function(s){if(i(s))return t.apply(this,arguments);
var n=e.apply(this,arguments);return n.mode="hide",this.effect.call(this,n)}}(t.fn.hide),toggle:function(t){return function(s){if(i(s)||"boolean"==typeof s)return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s},cssClip:function(t){return t?this.css("clip","rect("+t.top+"px "+t.right+"px "+t.bottom+"px "+t.left+"px)"):s(this.css("clip"),this)},transfer:function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,h=o?a.scrollLeft():0,l=n.offset(),c={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(e.className).css({top:u.top-r,left:u.left-h,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),t.isFunction(i)&&i()})}}),t.fx.step.clip=function(e){e.clipInit||(e.start=t(e.elem).cssClip(),"string"==typeof e.end&&(e.end=s(e.end,e.elem)),e.clipInit=!0),t(e.elem).cssClip({top:e.pos*(e.end.top-e.start.top)+e.start.top,right:e.pos*(e.end.right-e.start.right)+e.start.right,bottom:e.pos*(e.end.bottom-e.start.bottom)+e.start.bottom,left:e.pos*(e.end.left-e.start.left)+e.start.left})}}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}();var f=t.effects;t.effects.define("blind","hide",function(e,i){var s={up:["bottom","top"],vertical:["bottom","top"],down:["top","bottom"],left:["right","left"],horizontal:["right","left"],right:["left","right"]},n=t(this),o=e.direction||"up",a=n.cssClip(),r={clip:t.extend({},a)},h=t.effects.createPlaceholder(n);r.clip[s[o][0]]=r.clip[s[o][1]],"show"===e.mode&&(n.cssClip(r.clip),h&&h.css(t.effects.clipToBox(r)),r.clip=a),h&&h.animate(t.effects.clipToBox(r),e.duration,e.easing),n.animate(r,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("bounce",function(e,i){var s,n,o,a=t(this),r=e.mode,h="hide"===r,l="show"===r,c=e.direction||"up",u=e.distance,d=e.times||5,p=2*d+(l||h?1:0),f=e.duration/p,g=e.easing,m="up"===c||"down"===c?"top":"left",_="up"===c||"left"===c,v=0,b=a.queue().length;for(t.effects.createPlaceholder(a),o=a.css(m),u||(u=a["top"===m?"outerHeight":"outerWidth"]()/3),l&&(n={opacity:1},n[m]=o,a.css("opacity",0).css(m,_?2*-u:2*u).animate(n,f,g)),h&&(u/=Math.pow(2,d-1)),n={},n[m]=o;d>v;v++)s={},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g).animate(n,f,g),u=h?2*u:u/2;h&&(s={opacity:0},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g)),a.queue(i),t.effects.unshift(a,b,p+1)}),t.effects.define("clip","hide",function(e,i){var s,n={},o=t(this),a=e.direction||"vertical",r="both"===a,h=r||"horizontal"===a,l=r||"vertical"===a;s=o.cssClip(),n.clip={top:l?(s.bottom-s.top)/2:s.top,right:h?(s.right-s.left)/2:s.right,bottom:l?(s.bottom-s.top)/2:s.bottom,left:h?(s.right-s.left)/2:s.left},t.effects.createPlaceholder(o),"show"===e.mode&&(o.cssClip(n.clip),n.clip=s),o.animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("drop","hide",function(e,i){var s,n=t(this),o=e.mode,a="show"===o,r=e.direction||"left",h="up"===r||"down"===r?"top":"left",l="up"===r||"left"===r?"-=":"+=",c="+="===l?"-=":"+=",u={opacity:0};t.effects.createPlaceholder(n),s=e.distance||n["top"===h?"outerHeight":"outerWidth"](!0)/2,u[h]=l+s,a&&(n.css(u),u[h]=c+s,u.opacity=1),n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("explode","hide",function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),i()}var o,a,r,h,l,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=e.mode,g="show"===f,m=p.show().css("visibility","hidden").offset(),_=Math.ceil(p.outerWidth()/d),v=Math.ceil(p.outerHeight()/u),b=[];for(o=0;u>o;o++)for(h=m.top+o*v,c=o-(u-1)/2,a=0;d>a;a++)r=m.left+a*_,l=a-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-a*_,top:-o*v}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:_,height:v,left:r+(g?l*_:0),top:h+(g?c*v:0),opacity:g?0:1}).animate({left:r+(g?0:l*_),top:h+(g?0:c*v),opacity:g?1:0},e.duration||500,e.easing,s)}),t.effects.define("fade","toggle",function(e,i){var s="show"===e.mode;t(this).css("opacity",s?0:1).animate({opacity:s?1:0},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("fold","hide",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=e.size||15,h=/([0-9]+)%/.exec(r),l=!!e.horizFirst,c=l?["right","bottom"]:["bottom","right"],u=e.duration/2,d=t.effects.createPlaceholder(s),p=s.cssClip(),f={clip:t.extend({},p)},g={clip:t.extend({},p)},m=[p[c[0]],p[c[1]]],_=s.queue().length;h&&(r=parseInt(h[1],10)/100*m[a?0:1]),f.clip[c[0]]=r,g.clip[c[0]]=r,g.clip[c[1]]=0,o&&(s.cssClip(g.clip),d&&d.css(t.effects.clipToBox(g)),g.clip=p),s.queue(function(i){d&&d.animate(t.effects.clipToBox(f),u,e.easing).animate(t.effects.clipToBox(g),u,e.easing),i()}).animate(f,u,e.easing).animate(g,u,e.easing).queue(i),t.effects.unshift(s,_,4)}),t.effects.define("highlight","show",function(e,i){var s=t(this),n={backgroundColor:s.css("backgroundColor")};"hide"===e.mode&&(n.opacity=0),t.effects.saveStyle(s),s.css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("size",function(e,i){var s,n,o,a=t(this),r=["fontSize"],h=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],l=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],c=e.mode,u="effect"!==c,d=e.scale||"both",p=e.origin||["middle","center"],f=a.css("position"),g=a.position(),m=t.effects.scaledDimensions(a),_=e.from||m,v=e.to||t.effects.scaledDimensions(a,0);t.effects.createPlaceholder(a),"show"===c&&(o=_,_=v,v=o),n={from:{y:_.height/m.height,x:_.width/m.width},to:{y:v.height/m.height,x:v.width/m.width}},("box"===d||"both"===d)&&(n.from.y!==n.to.y&&(_=t.effects.setTransition(a,h,n.from.y,_),v=t.effects.setTransition(a,h,n.to.y,v)),n.from.x!==n.to.x&&(_=t.effects.setTransition(a,l,n.from.x,_),v=t.effects.setTransition(a,l,n.to.x,v))),("content"===d||"both"===d)&&n.from.y!==n.to.y&&(_=t.effects.setTransition(a,r,n.from.y,_),v=t.effects.setTransition(a,r,n.to.y,v)),p&&(s=t.effects.getBaseline(p,m),_.top=(m.outerHeight-_.outerHeight)*s.y+g.top,_.left=(m.outerWidth-_.outerWidth)*s.x+g.left,v.top=(m.outerHeight-v.outerHeight)*s.y+g.top,v.left=(m.outerWidth-v.outerWidth)*s.x+g.left),a.css(_),("content"===d||"both"===d)&&(h=h.concat(["marginTop","marginBottom"]).concat(r),l=l.concat(["marginLeft","marginRight"]),a.find("*[width]").each(function(){var i=t(this),s=t.effects.scaledDimensions(i),o={height:s.height*n.from.y,width:s.width*n.from.x,outerHeight:s.outerHeight*n.from.y,outerWidth:s.outerWidth*n.from.x},a={height:s.height*n.to.y,width:s.width*n.to.x,outerHeight:s.height*n.to.y,outerWidth:s.width*n.to.x};n.from.y!==n.to.y&&(o=t.effects.setTransition(i,h,n.from.y,o),a=t.effects.setTransition(i,h,n.to.y,a)),n.from.x!==n.to.x&&(o=t.effects.setTransition(i,l,n.from.x,o),a=t.effects.setTransition(i,l,n.to.x,a)),u&&t.effects.saveStyle(i),i.css(o),i.animate(a,e.duration,e.easing,function(){u&&t.effects.restoreStyle(i)})})),a.animate(v,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){var e=a.offset();0===v.opacity&&a.css("opacity",_.opacity),u||(a.css("position","static"===f?"relative":f).offset(e),t.effects.saveStyle(a)),i()}})}),t.effects.define("scale",function(e,i){var s=t(this),n=e.mode,o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"effect"!==n?0:100),a=t.extend(!0,{from:t.effects.scaledDimensions(s),to:t.effects.scaledDimensions(s,o,e.direction||"both"),origin:e.origin||["middle","center"]},e);e.fade&&(a.from.opacity=1,a.to.opacity=0),t.effects.effect.size.call(this,a,i)}),t.effects.define("puff","hide",function(e,i){var s=t.extend(!0,{},e,{fade:!0,percent:parseInt(e.percent,10)||150});t.effects.effect.scale.call(this,s,i)}),t.effects.define("pulsate","show",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=o||a,h=2*(e.times||5)+(r?1:0),l=e.duration/h,c=0,u=1,d=s.queue().length;for((o||!s.is(":visible"))&&(s.css("opacity",0).show(),c=1);h>u;u++)s.animate({opacity:c},l,e.easing),c=1-c;s.animate({opacity:c},l,e.easing),s.queue(i),t.effects.unshift(s,d,h+1)}),t.effects.define("shake",function(e,i){var s=1,n=t(this),o=e.direction||"left",a=e.distance||20,r=e.times||3,h=2*r+1,l=Math.round(e.duration/h),c="up"===o||"down"===o?"top":"left",u="up"===o||"left"===o,d={},p={},f={},g=n.queue().length;for(t.effects.createPlaceholder(n),d[c]=(u?"-=":"+=")+a,p[c]=(u?"+=":"-=")+2*a,f[c]=(u?"-=":"+=")+2*a,n.animate(d,l,e.easing);r>s;s++)n.animate(p,l,e.easing).animate(f,l,e.easing);n.animate(p,l,e.easing).animate(d,l/2,e.easing).queue(i),t.effects.unshift(n,g,h+1)}),t.effects.define("slide","show",function(e,i){var s,n,o=t(this),a={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},r=e.mode,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h,u=e.distance||o["top"===l?"outerHeight":"outerWidth"](!0),d={};t.effects.createPlaceholder(o),s=o.cssClip(),n=o.position()[l],d[l]=(c?-1:1)*u+n,d.clip=o.cssClip(),d.clip[a[h][1]]=d.clip[a[h][0]],"show"===r&&(o.cssClip(d.clip),o.css(l,d[l]),d.clip=s,d[l]=n),o.animate(d,{queue:!1,duration:e.duration,easing:e.easing,complete:i})});var f;t.uiBackCompat!==!1&&(f=t.effects.define("transfer",function(e,i){t(this).transfer(e,i)})),t.ui.focusable=function(i,s){var n,o,a,r,h,l=i.nodeName.toLowerCase();return"area"===l?(n=i.parentNode,o=n.name,i.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap='#"+o+"']"),a.length>0&&a.is(":visible")):!1):(/^(input|select|textarea|button|object)$/.test(l)?(r=!i.disabled,r&&(h=t(i).closest("fieldset")[0],h&&(r=!h.disabled))):r="a"===l?i.href||s:s,r&&t(i).is(":visible")&&e(t(i)))},t.extend(t.expr[":"],{focusable:function(e){return t.ui.focusable(e,null!=t.attr(e,"tabindex"))}}),t.ui.focusable,t.fn.form=function(){return"string"==typeof this[0].form?this.closest("form"):t(this[0].form)},t.ui.formResetMixin={_formResetHandler:function(){var e=t(this);setTimeout(function(){var i=e.data("ui-form-reset-instances");t.each(i,function(){this.refresh()})})},_bindFormResetHandler:function(){if(this.form=this.element.form(),this.form.length){var t=this.form.data("ui-form-reset-instances")||[];t.length||this.form.on("reset.ui-form-reset",this._formResetHandler),t.push(this),this.form.data("ui-form-reset-instances",t)}},_unbindFormResetHandler:function(){if(this.form.length){var e=this.form.data("ui-form-reset-instances");e.splice(t.inArray(this,e),1),e.length?this.form.data("ui-form-reset-instances",e):this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}},"1.7"===t.fn.jquery.substring(0,3)&&(t.each(["Width","Height"],function(e,i){function s(e,i,s,o){return t.each(n,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),o&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],o=i.toLowerCase(),a={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+i]=function(e){return void 0===e?a["inner"+i].call(this):this.each(function(){t(this).css(o,s(this,e)+"px")})},t.fn["outer"+i]=function(e,n){return"number"!=typeof e?a["outer"+i].call(this,e):this.each(function(){t(this).css(o,s(this,e,!0,n)+"px")})}}),t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},t.ui.escapeSelector=function(){var t=/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;return function(e){return e.replace(t,"\\$1")}}(),t.fn.labels=function(){var e,i,s,n,o;return this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(n=this.eq(0).parents("label"),s=this.attr("id"),s&&(e=this.eq(0).parents().last(),o=e.add(e.length?e.siblings():this.siblings()),i="label[for='"+t.ui.escapeSelector(s)+"']",n=n.add(o.find(i).addBack(i))),this.pushStack(n))},t.fn.scrollParent=function(e){var i=this.css("position"),s="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,o=this.parents().filter(function(){var e=t(this);return s&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&o.length?o:t(this[0].ownerDocument||document)},t.extend(t.expr[":"],{tabbable:function(e){var i=t.attr(e,"tabindex"),s=null!=i;return(!s||i>=0)&&t.ui.focusable(e,s)}}),t.fn.extend({uniqueId:function(){var t=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++t)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&t(this).removeAttr("id")})}}),t.widget("ui.accordion",{version:"1.12.0",options:{active:0,animate:{},classes:{"ui-accordion-header":"ui-corner-top","ui-accordion-header-collapsed":"ui-corner-all","ui-accordion-content":"ui-corner-bottom"},collapsible:!1,event:"click",header:"> li > :first-child, > :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},hideProps:{borderTopWidth:"hide",borderBottomWidth:"hide",paddingTop:"hide",paddingBottom:"hide",height:"hide"},showProps:{borderTopWidth:"show",borderBottomWidth:"show",paddingTop:"show",paddingBottom:"show",height:"show"},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this._addClass("ui-accordion","ui-widget ui-helper-reset"),this.element.attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t()}},_createIcons:function(){var e,i,s=this.options.icons;s&&(e=t("<span>"),this._addClass(e,"ui-accordion-header-icon","ui-icon "+s.header),e.prependTo(this.headers),i=this.active.children(".ui-accordion-header-icon"),this._removeClass(i,s.header)._addClass(i,null,s.activeHeader)._addClass(this.headers,"ui-accordion-icons"))},_destroyIcons:function(){this._removeClass(this.headers,"ui-accordion-icons"),this.headers.children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeAttr("role"),this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId(),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role aria-hidden aria-labelledby").removeUniqueId(),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),void 0):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),void 0)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t),this._toggleClass(null,"ui-state-disabled",!!t),this._toggleClass(this.headers.add(this.headers.next()),null,"ui-state-disabled",!!t)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),o=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:o=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:o=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:o=this.headers[0];break;case i.END:o=this.headers[s-1]}o&&(t(e.target).attr("tabIndex",-1),t(o).attr("tabIndex",0),t(o).trigger("focus"),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().trigger("focus")},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){var t=this.headers,e=this.panels;this.headers=this.element.find(this.options.header),this._addClass(this.headers,"ui-accordion-header ui-accordion-header-collapsed","ui-state-default"),this.panels=this.headers.next().filter(":not(.ui-accordion-content-active)").hide(),this._addClass(this.panels,"ui-accordion-content","ui-helper-reset ui-widget-content"),e&&(this._off(t.not(this.headers)),this._off(e.not(this.panels)))},_refresh:function(){var e,i=this.options,s=i.heightStyle,n=this.element.parent();this.active=this._findActive(i.active),this._addClass(this.active,"ui-accordion-header-active","ui-state-active")._removeClass(this.active,"ui-accordion-header-collapsed"),this._addClass(this.active.next(),"ui-accordion-content-active"),this.active.next().show(),this.headers.attr("role","tab").each(function(){var e=t(this),i=e.uniqueId().attr("id"),s=e.next(),n=s.uniqueId().attr("id");e.attr("aria-controls",n),s.attr("aria-labelledby",i)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}).next().attr({"aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}).next().attr({"aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(i.event),"fill"===s?(e=n.height(),this.element.siblings(":visible").each(function(){var i=t(this),s=i.css("position");"absolute"!==s&&"fixed"!==s&&(e-=i.outerHeight(!0))}),this.headers.each(function(){e-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,e-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===s&&(e=0,this.headers.next().each(function(){var i=t(this).is(":visible");i||t(this).show(),e=Math.max(e,t(this).css("height","").height()),i||t(this).hide()}).height(e))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i,s,n=this.options,o=this.active,a=t(e.currentTarget),r=a[0]===o[0],h=r&&n.collapsible,l=h?t():a.next(),c=o.next(),u={oldHeader:o,oldPanel:c,newHeader:h?t():a,newPanel:l};e.preventDefault(),r&&!n.collapsible||this._trigger("beforeActivate",e,u)===!1||(n.active=h?!1:this.headers.index(a),this.active=r?t():a,this._toggle(u),this._removeClass(o,"ui-accordion-header-active","ui-state-active"),n.icons&&(i=o.children(".ui-accordion-header-icon"),this._removeClass(i,null,n.icons.activeHeader)._addClass(i,null,n.icons.header)),r||(this._removeClass(a,"ui-accordion-header-collapsed")._addClass(a,"ui-accordion-header-active","ui-state-active"),n.icons&&(s=a.children(".ui-accordion-header-icon"),this._removeClass(s,null,n.icons.header)._addClass(s,null,n.icons.activeHeader)),this._addClass(a.next(),"ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-hidden":"true"}),s.prev().attr({"aria-selected":"false","aria-expanded":"false"}),i.length&&s.length?s.prev().attr({tabIndex:-1,"aria-expanded":"false"}):i.length&&this.headers.filter(function(){return 0===parseInt(t(this).attr("tabIndex"),10)}).attr("tabIndex",-1),i.attr("aria-hidden","false").prev().attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_animate:function(t,e,i){var s,n,o,a=this,r=0,h=t.css("box-sizing"),l=t.length&&(!e.length||t.index()<e.index()),c=this.options.animate||{},u=l&&c.down||c,d=function(){a._toggleComplete(i)};return"number"==typeof u&&(o=u),"string"==typeof u&&(n=u),n=n||u.easing||c.easing,o=o||u.duration||c.duration,e.length?t.length?(s=t.show().outerHeight(),e.animate(this.hideProps,{duration:o,easing:n,step:function(t,e){e.now=Math.round(t)}}),t.hide().animate(this.showProps,{duration:o,easing:n,complete:d,step:function(t,i){i.now=Math.round(t),"height"!==i.prop?"content-box"===h&&(r+=i.now):"content"!==a.options.heightStyle&&(i.now=Math.round(s-e.outerHeight()-r),r=0)}}),void 0):e.animate(this.hideProps,o,n,d):t.animate(this.showProps,o,n,d)},_toggleComplete:function(t){var e=t.oldPanel,i=e.prev();this._removeClass(e,"ui-accordion-content-active"),this._removeClass(i,"ui-accordion-header-active")._addClass(i,"ui-accordion-header-collapsed"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}}),t.ui.safeActiveElement=function(t){var e;try{e=t.activeElement}catch(i){e=t.body}return e||(e=t.body),e.nodeName||(e=t.body),e},t.widget("ui.menu",{version:"1.12.0",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-caret-1-e"},items:"> *",menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().attr({role:this.options.role,tabIndex:0}),this._addClass("ui-menu","ui-widget ui-widget-content"),this._on({"mousedown .ui-menu-item":function(t){t.preventDefault()},"click .ui-menu-item":function(e){var i=t(e.target),s=t(t.ui.safeActiveElement(this.document[0]));!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.select(e),e.isPropagationStopped()||(this.mouseHandled=!0),i.has(".ui-menu").length?this.expand(e):!this.element.is(":focus")&&s.closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){if(!this.previousFilter){var i=t(e.target).closest(".ui-menu-item"),s=t(e.currentTarget);i[0]===s[0]&&(this._removeClass(s.siblings().children(".ui-state-active"),null,"ui-state-active"),this.focus(e,s))}},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.find(this.options.items).eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){var i=!t.contains(this.element[0],t.ui.safeActiveElement(this.document[0]));i&&this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){this._closeOnDocumentClick(t)&&this.collapseAll(t),this.mouseHandled=!1}})},_destroy:function(){var e=this.element.find(".ui-menu-item").removeAttr("role aria-disabled"),i=e.children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),i.children().each(function(){var e=t(this);e.data("ui-menu-submenu-caret")&&e.remove()})},_keydown:function(e){var i,s,n,o,a=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:a=!1,s=this.previousFilter||"",n=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),n===s?o=!0:n=s+n,i=this._filterMenuItems(n),i=o&&-1!==i.index(this.active.next())?this.active.nextAll(".ui-menu-item"):i,i.length||(n=String.fromCharCode(e.keyCode),i=this._filterMenuItems(n)),i.length?(this.focus(e,i),this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter}a&&e.preventDefault()},_activate:function(t){this.active&&!this.active.is(".ui-state-disabled")&&(this.active.children("[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i,s,n,o,a=this,r=this.options.icons.submenu,h=this.element.find(this.options.menus);this._toggleClass("ui-menu-icons",null,!!this.element.find(".ui-icon").length),s=h.filter(":not(.ui-menu)").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),i=e.prev(),s=t("<span>").data("ui-menu-submenu-caret",!0);a._addClass(s,"ui-menu-icon","ui-icon "+r),i.attr("aria-haspopup","true").prepend(s),e.attr("aria-labelledby",i.attr("id"))}),this._addClass(s,"ui-menu","ui-widget ui-widget-content ui-front"),e=h.add(this.element),i=e.find(this.options.items),i.not(".ui-menu-item").each(function(){var e=t(this);a._isDivider(e)&&a._addClass(e,"ui-menu-divider","ui-widget-content")}),n=i.not(".ui-menu-item, .ui-menu-divider"),o=n.children().not(".ui-menu").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),this._addClass(n,"ui-menu-item")._addClass(o,"ui-menu-item-wrapper"),i.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){if("icons"===t){var i=this.element.find(".ui-menu-icon");this._removeClass(i,null,this.options.icons.submenu)._addClass(i,null,e.submenu)}this._super(t,e)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t+""),this._toggleClass(null,"ui-state-disabled",!!t)},focus:function(t,e){var i,s,n;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children(".ui-menu-item-wrapper"),this._addClass(s,null,"ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),n=this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"),this._addClass(n,null,"ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&t&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,o,a,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,o=this.activeMenu.scrollTop(),a=this.activeMenu.height(),r=e.outerHeight(),0>n?this.activeMenu.scrollTop(o+n):n+r>a&&this.activeMenu.scrollTop(o+n-a+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this._removeClass(this.active.children(".ui-menu-item-wrapper"),null,"ui-state-active"),this._trigger("blur",t,{item:this.active}),this.active=null)},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this._removeClass(s.find(".ui-state-active"),null,"ui-state-active"),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false")},_closeOnDocumentClick:function(e){return!t(e.target).closest(".ui-menu").length},_isDivider:function(t){return!/[^\-\u2014\u2013\s]/.test(t.text())},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.find(this.options.items)[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.find(this.options.items)[this.active?"last":"first"]())),void 0):(this.next(e),void 0)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.find(this.options.items).first())),void 0):(this.next(e),void 0)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)},_filterMenuItems:function(e){var i=e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),s=RegExp("^"+i,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function(){return s.test(t.trim(t(this).children(".ui-menu-item-wrapper").text()))})}}),t.widget("ui.autocomplete",{version:"1.12.0",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),o="textarea"===n,a="input"===n;this.isMultiLine=o||!a&&this._isContentEditable(this.element),this.valueMethod=this.element[o||a?"val":"text"],this.isNewMenu=!0,this._addClass("ui-autocomplete-input"),this.element.attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,void 0;
e=!1,s=!1,i=!1;var o=t.ui.keyCode;switch(n.keyCode){case o.PAGE_UP:e=!0,this._move("previousPage",n);break;case o.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case o.UP:e=!0,this._keyEvent("previous",n);break;case o.DOWN:e=!0,this._keyEvent("next",n);break;case o.ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case o.TAB:this.menu.active&&this.menu.select(n);break;case o.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),void 0;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),void 0):(this._searchTimeout(t),void 0)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(clearTimeout(this.searching),this.close(t),this._change(t),void 0)}}),this._initSource(),this.menu=t("<ul>").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._addClass(this.menu.element,"ui-autocomplete","ui-front"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,this.element[0]!==t.ui.safeActiveElement(this.document[0])&&this.element.trigger("focus")})},menufocus:function(e,i){var s,n;return this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type))?(this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),void 0):(n=i.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",e,{item:n})&&e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(n.value),s=i.item.attr("aria-label")||n.value,s&&t.trim(s).length&&(this.liveRegion.children().hide(),t("<div>").text(s).appendTo(this.liveRegion)),void 0)},menuselect:function(e,i){var s=i.item.data("ui-autocomplete-item"),n=this.previous;this.element[0]!==t.ui.safeActiveElement(this.document[0])&&(this.element.trigger("focus"),this.previous=n,this._delay(function(){this.previous=n,this.selectedItem=s})),!1!==this._trigger("select",e,{item:s})&&this._value(s.value),this.term=this._value(),this.close(e),this.selectedItem=s}}),this.liveRegion=t("<div>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_isEventTargetInWidget:function(e){var i=this.menu.element[0];return e.target===this.element[0]||e.target===i||t.contains(i,e.target)},_closeOnClickOutside:function(t){this._isEventTargetInWidget(t)||this.close()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e&&e[0]||(e=this.element.closest(".ui-front, dialog")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){var e=this.term===this._value(),i=this.menu.element.is(":visible"),s=t.altKey||t.ctrlKey||t.metaKey||t.shiftKey;(!e||e&&!i&&!s)&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):void 0},_search:function(t){this.pending++,this._addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var e=++this.requestIndex;return t.proxy(function(t){e===this.requestIndex&&this.__response(t),this.pending--,this.pending||this._removeClass("ui-autocomplete-loading")},this)},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this._off(this.document,"mousedown"),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({},e,{label:e.label||e.value,value:e.value||e.label})})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(),this._on(this.document,{mousedown:"_closeOnClickOutside"})},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<div>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this.isMultiLine||this._value(this.term),this.menu.blur(),void 0):(this.menu[t](e),void 0):(this.search(null,e),void 0)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())},_isContentEditable:function(t){if(!t.length)return!1;var e=t.prop("contentEditable");return"inherit"===e?this._isContentEditable(t.parent()):"true"===e}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var i;this._superApply(arguments),this.options.disabled||this.cancelSearch||(i=e&&e.length?this.options.messages.results(e.length):this.options.messages.noResults,this.liveRegion.children().hide(),t("<div>").text(i).appendTo(this.liveRegion))}}),t.ui.autocomplete;var g=/ui-corner-([a-z]){2,6}/g;t.widget("ui.controlgroup",{version:"1.12.0",defaultElement:"<div>",options:{direction:"horizontal",disabled:null,onlyVisible:!0,items:{button:"input[type=button], input[type=submit], input[type=reset], button, a",controlgroupLabel:".ui-controlgroup-label",checkboxradio:"input[type='checkbox'], input[type='radio']",selectmenu:"select",spinner:".ui-spinner-input"}},_create:function(){this._enhance()},_enhance:function(){this.element.attr("role","toolbar"),this.refresh()},_destroy:function(){this._callChildMethod("destroy"),this.childWidgets.removeData("ui-controlgroup-data"),this.element.removeAttr("role"),this.options.items.controlgroupLabel&&this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()},_initWidgets:function(){var e=this,i=[];t.each(this.options.items,function(s,n){var o,a={};return n?"controlgroupLabel"===s?(o=e.element.find(n),o.each(function(){var e=t(this);e.children(".ui-controlgroup-label-contents").length||e.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")}),e._addClass(o,null,"ui-widget ui-widget-content ui-state-default"),i=i.concat(o.get()),void 0):(t.fn[s]&&(e["_"+s+"Options"]&&(a=e["_"+s+"Options"]("middle")),e.element.find(n).each(function(){var n=t(this),o=n[s]("instance"),r=t.widget.extend({},a);if("button"!==s||!n.parent(".ui-spinner").length){o||(o=n[s]()[s]("instance")),o&&(r.classes=e._resolveClassesValues(r.classes,o)),n[s](r);var h=n[s]("widget");t.data(h[0],"ui-controlgroup-data",o?o:n[s]("instance")),i.push(h[0])}})),void 0):void 0}),this.childWidgets=t(t.unique(i)),this._addClass(this.childWidgets,"ui-controlgroup-item")},_callChildMethod:function(e){this.childWidgets.each(function(){var i=t(this),s=i.data("ui-controlgroup-data");s&&s[e]&&s[e]()})},_updateCornerClass:function(t,e){var i="ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all",s=this._buildSimpleOptions(e,"label").classes.label;this._removeClass(t,null,i),this._addClass(t,null,s)},_buildSimpleOptions:function(t,e){var i="vertical"===this.options.direction,s={classes:{}};return s.classes[e]={middle:"",first:"ui-corner-"+(i?"top":"left"),last:"ui-corner-"+(i?"bottom":"right"),only:"ui-corner-all"}[t],s},_spinnerOptions:function(t){var e=this._buildSimpleOptions(t,"ui-spinner");return e.classes["ui-spinner-up"]="",e.classes["ui-spinner-down"]="",e},_buttonOptions:function(t){return this._buildSimpleOptions(t,"ui-button")},_checkboxradioOptions:function(t){return this._buildSimpleOptions(t,"ui-checkboxradio-label")},_selectmenuOptions:function(t){var e="vertical"===this.options.direction;return{width:e?"auto":!1,classes:{middle:{"ui-selectmenu-button-open":"","ui-selectmenu-button-closed":""},first:{"ui-selectmenu-button-open":"ui-corner-"+(e?"top":"tl"),"ui-selectmenu-button-closed":"ui-corner-"+(e?"top":"left")},last:{"ui-selectmenu-button-open":e?"":"ui-corner-tr","ui-selectmenu-button-closed":"ui-corner-"+(e?"bottom":"right")},only:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"}}[t]}},_resolveClassesValues:function(e,i){var s={};return t.each(e,function(t){var n=i.options.classes[t]||"";n=n.replace(g,"").trim(),s[t]=(n+" "+e[t]).replace(/\s+/g," ")}),s},_setOption:function(t,e){return"direction"===t&&this._removeClass("ui-controlgroup-"+this.options.direction),this._super(t,e),"disabled"===t?(this._callChildMethod(e?"disable":"enable"),void 0):(this.refresh(),void 0)},refresh:function(){var e,i=this;this._addClass("ui-controlgroup ui-controlgroup-"+this.options.direction),"horizontal"===this.options.direction&&this._addClass(null,"ui-helper-clearfix"),this._initWidgets(),e=this.childWidgets,this.options.onlyVisible&&(e=e.filter(":visible")),e.length&&(t.each(["first","last"],function(t,s){var n=e[s]().data("ui-controlgroup-data");if(n&&i["_"+n.widgetName+"Options"]){var o=i["_"+n.widgetName+"Options"](1===e.length?"only":s);o.classes=i._resolveClassesValues(o.classes,n),n.element[n.widgetName](o)}else i._updateCornerClass(e[s](),s)}),this._callChildMethod("refresh"))}}),t.widget("ui.checkboxradio",[t.ui.formResetMixin,{version:"1.12.0",options:{disabled:null,label:null,icon:!0,classes:{"ui-checkboxradio-label":"ui-corner-all","ui-checkboxradio-icon":"ui-corner-all"}},_getCreateOptions:function(){var e,i,s=this,n=this._super()||{};return this._readType(),i=this.element.labels(),this.label=t(i[i.length-1]),this.label.length||t.error("No label found for checkboxradio widget"),this.originalLabel="",this.label.contents().not(this.element).each(function(){s.originalLabel+=3===this.nodeType?t(this).text():this.outerHTML}),this.originalLabel&&(n.label=this.originalLabel),e=this.element[0].disabled,null!=e&&(n.disabled=e),n},_create:function(){var t=this.element[0].checked;this._bindFormResetHandler(),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled),this._setOption("disabled",this.options.disabled),this._addClass("ui-checkboxradio","ui-helper-hidden-accessible"),this._addClass(this.label,"ui-checkboxradio-label","ui-button ui-widget"),"radio"===this.type&&this._addClass(this.label,"ui-checkboxradio-radio-label"),this.options.label&&this.options.label!==this.originalLabel?this._updateLabel():this.originalLabel&&(this.options.label=this.originalLabel),this._enhance(),t&&(this._addClass(this.label,"ui-checkboxradio-checked","ui-state-active"),this.icon&&this._addClass(this.icon,null,"ui-state-hover")),this._on({change:"_toggleClasses",focus:function(){this._addClass(this.label,null,"ui-state-focus ui-visual-focus")},blur:function(){this._removeClass(this.label,null,"ui-state-focus ui-visual-focus")}})},_readType:function(){var e=this.element[0].nodeName.toLowerCase();this.type=this.element[0].type,"input"===e&&/radio|checkbox/.test(this.type)||t.error("Can't create checkboxradio on element.nodeName="+e+" and element.type="+this.type)},_enhance:function(){this._updateIcon(this.element[0].checked)},widget:function(){return this.label},_getRadioGroup:function(){var e,i=this.element[0].name,s="input[name='"+t.ui.escapeSelector(i)+"']";return i?(e=this.form.length?t(this.form[0].elements).filter(s):t(s).filter(function(){return 0===t(this).form().length}),e.not(this.element)):t([])},_toggleClasses:function(){var e=this.element[0].checked;this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",e),this.options.icon&&"checkbox"===this.type&&this._toggleClass(this.icon,null,"ui-icon-check ui-state-checked",e)._toggleClass(this.icon,null,"ui-icon-blank",!e),"radio"===this.type&&this._getRadioGroup().each(function(){var e=t(this).checkboxradio("instance");e&&e._removeClass(e.label,"ui-checkboxradio-checked","ui-state-active")})},_destroy:function(){this._unbindFormResetHandler(),this.icon&&(this.icon.remove(),this.iconSpace.remove())},_setOption:function(t,e){return"label"!==t||e?(this._super(t,e),"disabled"===t?(this._toggleClass(this.label,null,"ui-state-disabled",e),this.element[0].disabled=e,void 0):(this.refresh(),void 0)):void 0},_updateIcon:function(e){var i="ui-icon ui-icon-background ";this.options.icon?(this.icon||(this.icon=t("<span>"),this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-checkboxradio-icon-space")),"checkbox"===this.type?(i+=e?"ui-icon-check ui-state-checked":"ui-icon-blank",this._removeClass(this.icon,null,e?"ui-icon-blank":"ui-icon-check")):i+="ui-icon-blank",this._addClass(this.icon,"ui-checkboxradio-icon",i),e||this._removeClass(this.icon,null,"ui-icon-check ui-state-checked"),this.icon.prependTo(this.label).after(this.iconSpace)):void 0!==this.icon&&(this.icon.remove(),this.iconSpace.remove(),delete this.icon)},_updateLabel:function(){this.label.contents().not(this.element.add(this.icon).add(this.iconSpace)).remove(),this.label.append(this.options.label)},refresh:function(){var t=this.element[0].checked,e=this.element[0].disabled;this._updateIcon(t),this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",t),null!==this.options.label&&this._updateLabel(),e!==this.options.disabled&&this._setOptions({disabled:e})}}]),t.ui.checkboxradio,t.widget("ui.button",{version:"1.12.0",defaultElement:"<button>",options:{classes:{"ui-button":"ui-corner-all"},disabled:null,icon:null,iconPosition:"beginning",label:null,showLabel:!0},_getCreateOptions:function(){var t,e=this._super()||{};return this.isInput=this.element.is("input"),t=this.element[0].disabled,null!=t&&(e.disabled=t),this.originalLabel=this.isInput?this.element.val():this.element.html(),this.originalLabel&&(e.label=this.originalLabel),e},_create:function(){!this.option.showLabel&!this.options.icon&&(this.options.showLabel=!0),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled||!1),this.hasTitle=!!this.element.attr("title"),this.options.label&&this.options.label!==this.originalLabel&&(this.isInput?this.element.val(this.options.label):this.element.html(this.options.label)),this._addClass("ui-button","ui-widget"),this._setOption("disabled",this.options.disabled),this._enhance(),this.element.is("a")&&this._on({keyup:function(e){e.keyCode===t.ui.keyCode.SPACE&&(e.preventDefault(),this.element[0].click?this.element[0].click():this.element.trigger("click"))}})},_enhance:function(){this.element.is("button")||this.element.attr("role","button"),this.options.icon&&(this._updateIcon("icon",this.options.icon),this._updateTooltip())},_updateTooltip:function(){this.title=this.element.attr("title"),this.options.showLabel||this.title||this.element.attr("title",this.options.label)},_updateIcon:function(e,i){var s="iconPosition"!==e,n=s?this.options.iconPosition:i,o="top"===n||"bottom"===n;this.icon?s&&this._removeClass(this.icon,null,this.options.icon):(this.icon=t("<span>"),this._addClass(this.icon,"ui-button-icon","ui-icon"),this.options.showLabel||this._addClass("ui-button-icon-only")),s&&this._addClass(this.icon,null,i),this._attachIcon(n),o?(this._addClass(this.icon,null,"ui-widget-icon-block"),this.iconSpace&&this.iconSpace.remove()):(this.iconSpace||(this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-button-icon-space")),this._removeClass(this.icon,null,"ui-wiget-icon-block"),this._attachIconSpace(n))},_destroy:function(){this.element.removeAttr("role"),this.icon&&this.icon.remove(),this.iconSpace&&this.iconSpace.remove(),this.hasTitle||this.element.removeAttr("title")},_attachIconSpace:function(t){this.icon[/^(?:end|bottom)/.test(t)?"before":"after"](this.iconSpace)},_attachIcon:function(t){this.element[/^(?:end|bottom)/.test(t)?"append":"prepend"](this.icon)},_setOptions:function(t){var e=void 0===t.showLabel?this.options.showLabel:t.showLabel,i=void 0===t.icon?this.options.icon:t.icon;e||i||(t.showLabel=!0),this._super(t)},_setOption:function(t,e){"icon"===t&&(e?this._updateIcon(t,e):this.icon&&(this.icon.remove(),this.iconSpace&&this.iconSpace.remove())),"iconPosition"===t&&this._updateIcon(t,e),"showLabel"===t&&(this._toggleClass("ui-button-icon-only",null,!e),this._updateTooltip()),"label"===t&&(this.isInput?this.element.val(e):(this.element.html(e),this.icon&&(this._attachIcon(this.options.iconPosition),this._attachIconSpace(this.options.iconPosition)))),this._super(t,e),"disabled"===t&&(this._toggleClass(null,"ui-state-disabled",e),this.element[0].disabled=e,e&&this.element.blur())},refresh:function(){var t=this.element.is("input, button")?this.element[0].disabled:this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOptions({disabled:t}),this._updateTooltip()}}),t.uiBackCompat!==!1&&(t.widget("ui.button",t.ui.button,{options:{text:!0,icons:{primary:null,secondary:null}},_create:function(){this.options.showLabel&&!this.options.text&&(this.options.showLabel=this.options.text),!this.options.showLabel&&this.options.text&&(this.options.text=this.options.showLabel),this.options.icon||!this.options.icons.primary&&!this.options.icons.secondary?this.options.icon&&(this.options.icons.primary=this.options.icon):this.options.icons.primary?this.options.icon=this.options.icons.primary:(this.options.icon=this.options.icons.secondary,this.options.iconPosition="end"),this._super()},_setOption:function(t,e){return"text"===t?(this._super("showLabel",e),void 0):("showLabel"===t&&(this.options.text=e),"icon"===t&&(this.options.icons.primary=e),"icons"===t&&(e.primary?(this._super("icon",e.primary),this._super("iconPosition","beginning")):e.secondary&&(this._super("icon",e.secondary),this._super("iconPosition","end"))),this._superApply(arguments),void 0)}}),t.fn.button=function(e){return function(){return!this.length||this.length&&"INPUT"!==this[0].tagName||this.length&&"INPUT"===this[0].tagName&&"checkbox"!==this.attr("type")&&"radio"!==this.attr("type")?e.apply(this,arguments):(t.ui.checkboxradio||t.error("Checkboxradio widget missing"),0===arguments.length?this.checkboxradio({icon:!1}):this.checkboxradio.apply(this,arguments))}}(t.fn.button),t.fn.buttonset=function(){return t.ui.controlgroup||t.error("Controlgroup widget missing"),"option"===arguments[0]&&"items"===arguments[1]&&arguments[2]?this.controlgroup.apply(this,[arguments[0],"items.button",arguments[2]]):"option"===arguments[0]&&"items"===arguments[1]?this.controlgroup.apply(this,[arguments[0],"items.button"]):("object"==typeof arguments[0]&&arguments[0].items&&(arguments[0].items={button:arguments[0].items}),this.controlgroup.apply(this,arguments))}),t.ui.button,t.extend(t.ui,{datepicker:{version:"1.12.0"}});var m;t.extend(s.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return a(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,o;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),o=this._newInst(t(e),n),o.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,o):n&&this._inlineDatepicker(e,o)},_newInst:function(e,i){var s=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?n(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).on("keydown",this._doKeyDown).on("keypress",this._doKeyPress).on("keyup",this._doKeyUp),this._autoSize(i),t.data(e,"datepicker",i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,o,a=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),a&&(i.append=t("<span class='"+this._appendClass+"'>"+a+"</span>"),e[r?"before":"after"](i.append)),e.off("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.on("focus",this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),o=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:o,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(o?t("<img/>").attr({src:o,alt:n,title:n}):n)),e[r?"before":"after"](i.trigger),i.trigger.on("click",function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,o=new Date(2009,11,20),a=this._get(t,"dateFormat");a.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},o.setMonth(e(this._get(t,a.match(/MM/)?"monthNames":"monthNamesShort"))),o.setDate(e(this._get(t,a.match(/DD/)?"dayNames":"dayNamesShort"))+20-o.getDay())),t.input.attr("size",this._formatDate(t,o).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,"datepicker",i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,n,o){var r,h,l,c,u,d=this._dialogInst;return d||(this.uuid+=1,r="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+r+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.on("keydown",this._doKeyDown),t("body").append(this._dialogInput),d=this._dialogInst=this._newInst(this._dialogInput,!1),d.settings={},t.data(this._dialogInput[0],"datepicker",d)),a(d.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(d,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(h=document.documentElement.clientWidth,l=document.documentElement.clientHeight,c=document.documentElement.scrollLeft||document.body.scrollLeft,u=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[h/2-100+c,l/2-150+u]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),d.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],"datepicker",d),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,"datepicker");s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,"datepicker"),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).off("focus",this._showDatepicker).off("keydown",this._doKeyDown).off("keypress",this._doKeyPress).off("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty(),m===n&&(m=null))},_enableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,"datepicker");n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,o.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,"datepicker");n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,o.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,"datepicker")}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(e,i,s){var n,o,r,h,l=this._getInst(e);return 2===arguments.length&&"string"==typeof i?"defaults"===i?t.extend({},t.datepicker._defaults):l?"all"===i?t.extend({},l.settings):this._get(l,i):null:(n=i||{},"string"==typeof i&&(n={},n[i]=s),l&&(this._curInst===l&&this._hideDatepicker(),o=this._getDateDatepicker(e,!0),r=this._getMinMaxDate(l,"min"),h=this._getMinMaxDate(l,"max"),a(l.settings,n),null!==r&&void 0!==n.dateFormat&&void 0===n.minDate&&(l.settings.minDate=this._formatDate(l,r)),null!==h&&void 0!==n.dateFormat&&void 0===n.maxDate&&(l.settings.maxDate=this._formatDate(l,h)),"disabled"in n&&(n.disabled?this._disableDatepicker(e):this._enableDatepicker(e)),this._attachments(t(e),l),this._autoSize(l),this._setDate(l,o),this._updateAlternate(l),this._updateDatepicker(l)),void 0)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,o=t.datepicker._getInst(e.target),a=!0,r=o.dpDiv.is(".ui-datepicker-rtl");if(o._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),a=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",o.dpDiv),n[0]&&t.datepicker._selectDay(e.target,o.selectedMonth,o.selectedYear,n[0]),i=t.datepicker._get(o,"onSelect"),i?(s=t.datepicker._formatDate(o),i.apply(o.input?o.input[0]:null,[s,o])):t.datepicker._hideDatepicker(),!1;case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),a=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),a=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?1:-1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),a=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?-1:1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),a=e.ctrlKey||e.metaKey;break;default:a=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):a=!1;a&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(e){var i,s,n=t.datepicker._getInst(e.target);return t.datepicker._get(n,"constrainInput")?(i=t.datepicker._possibleChars(t.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),e.ctrlKey||e.metaKey||" ">s||!i||i.indexOf(s)>-1):void 0},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var s,n,o,r,h,l,c;s=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==s&&(t.datepicker._curInst.dpDiv.stop(!0,!0),s&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),n=t.datepicker._get(s,"beforeShow"),o=n?n.apply(e,[e,s]):{},o!==!1&&(a(s.settings,o),s.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(s),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),r=!1,t(e).parents().each(function(){return r|="fixed"===t(this).css("position"),!r}),h={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,s.dpDiv.empty(),s.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(s),h=t.datepicker._checkOffset(s,h,r),s.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":r?"fixed":"absolute",display:"none",left:h.left+"px",top:h.top+"px"}),s.inline||(l=t.datepicker._get(s,"showAnim"),c=t.datepicker._get(s,"duration"),s.dpDiv.css("z-index",i(t(e))+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[l]?s.dpDiv.show(l,t.datepicker._get(s,"showOptions"),c):s.dpDiv[l||"show"](l?c:null),t.datepicker._shouldFocusInput(s)&&s.input.trigger("focus"),t.datepicker._curInst=s))
}},_updateDatepicker:function(e){this.maxRows=4,m=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e);var i,s=this._getNumberOfMonths(e),n=s[1],a=17,r=e.dpDiv.find("."+this._dayOverClass+" a");r.length>0&&o.apply(r.get(0)),e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",a*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.trigger("focus"),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),o=e.dpDiv.outerHeight(),a=e.input?e.input.outerWidth():0,r=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-a:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+r?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+o>l&&l>o?Math.abs(o+r):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,o,a=this._curInst;!a||e&&a!==t.data(e,"datepicker")||this._datepickerShowing&&(i=this._get(a,"showAnim"),s=this._get(a,"duration"),n=function(){t.datepicker._tidyDialog(a)},t.effects&&(t.effects.effect[i]||t.effects[i])?a.dpDiv.hide(i,t.datepicker._get(a,"showOptions"),s,n):a.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,o=this._get(a,"onClose"),o&&o.apply(a.input?a.input[0]:null,[a.input?a.input.val():"",a]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),o=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(o,i+("M"===s?this._get(o,"showCurrentAtPos"):0),s),this._updateDatepicker(o))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),o=this._getInst(n[0]);o["selected"+("M"===s?"Month":"Year")]=o["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(o),this._adjustDate(n)},_selectDay:function(e,i,s,n){var o,a=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(a[0])||(o=this._getInst(a[0]),o.selectedDay=o.currentDay=t("a",n).html(),o.selectedMonth=o.currentMonth=i,o.selectedYear=o.currentYear=s,this._selectDate(e,this._formatDate(o,o.currentDay,o.currentMonth,o.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),o=this._getInst(n[0]);i=null!=i?i:this._formatDate(o),o.input&&o.input.val(i),this._updateAlternate(o),s=this._get(o,"onSelect"),s?s.apply(o.input?o.input[0]:null,[i,o]):o.input&&o.input.trigger("change"),o.inline?this._updateDatepicker(o):(this._hideDatepicker(),this._lastInput=o.input[0],"object"!=typeof o.input[0]&&o.input.trigger("focus"),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,o=this._get(e,"altField");o&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(o).val(n))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(e,i,s){if(null==e||null==i)throw"Invalid arguments";if(i="object"==typeof i?""+i:i+"",""===i)return null;var n,o,a,r,h=0,l=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,c="string"!=typeof l?l:(new Date).getFullYear()%100+parseInt(l,10),u=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,d=(s?s.dayNames:null)||this._defaults.dayNames,p=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,g=-1,m=-1,_=-1,v=-1,b=!1,y=function(t){var i=e.length>n+1&&e.charAt(n+1)===t;return i&&n++,i},w=function(t){var e=y(t),s="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n="y"===t?s:1,o=RegExp("^\\d{"+n+","+s+"}"),a=i.substring(h).match(o);if(!a)throw"Missing number at position "+h;return h+=a[0].length,parseInt(a[0],10)},k=function(e,s,n){var o=-1,a=t.map(y(e)?n:s,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(a,function(t,e){var s=e[1];return i.substr(h,s.length).toLowerCase()===s.toLowerCase()?(o=e[0],h+=s.length,!1):void 0}),-1!==o)return o+1;throw"Unknown name at position "+h},x=function(){if(i.charAt(h)!==e.charAt(n))throw"Unexpected literal at position "+h;h++};for(n=0;e.length>n;n++)if(b)"'"!==e.charAt(n)||y("'")?x():b=!1;else switch(e.charAt(n)){case"d":_=w("d");break;case"D":k("D",u,d);break;case"o":v=w("o");break;case"m":m=w("m");break;case"M":m=k("M",p,f);break;case"y":g=w("y");break;case"@":r=new Date(w("@")),g=r.getFullYear(),m=r.getMonth()+1,_=r.getDate();break;case"!":r=new Date((w("!")-this._ticksTo1970)/1e4),g=r.getFullYear(),m=r.getMonth()+1,_=r.getDate();break;case"'":y("'")?x():b=!0;break;default:x()}if(i.length>h&&(a=i.substr(h),!/^\s+/.test(a)))throw"Extra/unparsed characters found in date: "+a;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(c>=g?0:-100)),v>-1)for(m=1,_=v;;){if(o=this._getDaysInMonth(g,m-1),o>=_)break;m++,_-=o}if(r=this._daylightSavingAdjust(new Date(g,m-1,_)),r.getFullYear()!==g||r.getMonth()+1!==m||r.getDate()!==_)throw"Invalid date";return r},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,o=(i?i.dayNames:null)||this._defaults.dayNames,a=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,o);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),a,r);break;case"y":u+=h("y")?e.getFullYear():(10>e.getFullYear()%100?"0":"")+e.getFullYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,e){return void 0!==t.settings[e]?t.settings[e]:this._defaults[e]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),o=n,a=this._getFormatConfig(t);try{o=this.parseDate(i,s,a)||n}catch(r){s=e?"":s}t.selectedDay=o.getDate(),t.drawMonth=t.selectedMonth=o.getMonth(),t.drawYear=t.selectedYear=o.getFullYear(),t.currentDay=s?o.getDate():0,t.currentMonth=s?o.getMonth():0,t.currentYear=s?o.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},o=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,o=n.getFullYear(),a=n.getMonth(),r=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":r+=parseInt(l[1],10);break;case"w":case"W":r+=7*parseInt(l[1],10);break;case"m":case"M":a+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a));break;case"y":case"Y":o+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a))}l=h.exec(i)}return new Date(o,a,r)},a=null==i||""===i?s:"string"==typeof i?o(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return a=a&&"Invalid Date"==""+a?s:a,a&&(a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)),this._daylightSavingAdjust(a)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,o=t.selectedYear,a=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=a.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=a.getMonth(),t.drawYear=t.selectedYear=t.currentYear=a.getFullYear(),n===t.selectedMonth&&o===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).on(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,o,a,r,h,l,c,u,d,p,f,g,m,_,v,b,y,w,k,x,C,D,I,T,P,M,S,H,z,O,A,N,W,E,F,R,L=new Date,B=this._daylightSavingAdjust(new Date(L.getFullYear(),L.getMonth(),L.getDate())),Y=this._get(t,"isRTL"),j=this._get(t,"showButtonPanel"),q=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),U=this._getNumberOfMonths(t),V=this._get(t,"showCurrentAtPos"),X=this._get(t,"stepMonths"),$=1!==U[0]||1!==U[1],G=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),Q=this._getMinMaxDate(t,"min"),J=this._getMinMaxDate(t,"max"),Z=t.drawMonth-V,te=t.drawYear;if(0>Z&&(Z+=12,te--),J)for(e=this._daylightSavingAdjust(new Date(J.getFullYear(),J.getMonth()-U[0]*U[1]+1,J.getDate())),e=Q&&Q>e?Q:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-X,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":q?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+X,1)),this._getFormatConfig(t)):n,o=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":q?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",a=this._get(t,"currentText"),r=this._get(t,"gotoCurrent")&&t.currentDay?G:B,a=K?this.formatDate(a,r,this._getFormatConfig(t)):a,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=j?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+a+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),g=this._get(t,"monthNamesShort"),m=this._get(t,"beforeShowDay"),_=this._get(t,"showOtherMonths"),v=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;U[0]>k;k++){for(x="",this.maxRows=4,C=0;U[1]>C;C++){if(D=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),I=" ui-corner-all",T="",$){if(T+="<div class='ui-datepicker-group",U[1]>1)switch(C){case 0:T+=" ui-datepicker-group-first",I=" ui-corner-"+(Y?"right":"left");break;case U[1]-1:T+=" ui-datepicker-group-last",I=" ui-corner-"+(Y?"left":"right");break;default:T+=" ui-datepicker-group-middle",I=""}T+="'>"}for(T+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+I+"'>"+(/all|left/.test(I)&&0===k?Y?o:s:"")+(/all|right/.test(I)&&0===k?Y?s:o:"")+this._generateMonthYearHeader(t,Z,te,Q,J,k>0||C>0,f,g)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",P=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",w=0;7>w;w++)M=(w+c)%7,P+="<th scope='col'"+((w+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[M]+"'>"+p[M]+"</span></th>";for(T+=P+"</tr></thead><tbody>",S=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,S)),H=(this._getFirstDayOfMonth(te,Z)-c+7)%7,z=Math.ceil((H+S)/7),O=$?this.maxRows>z?this.maxRows:z:z,this.maxRows=O,A=this._daylightSavingAdjust(new Date(te,Z,1-H)),N=0;O>N;N++){for(T+="<tr>",W=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(A)+"</td>":"",w=0;7>w;w++)E=m?m.apply(t.input?t.input[0]:null,[A]):[!0,""],F=A.getMonth()!==Z,R=F&&!v||!E[0]||Q&&Q>A||J&&A>J,W+="<td class='"+((w+c+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(A.getTime()===D.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===A.getTime()&&b.getTime()===D.getTime()?" "+this._dayOverClass:"")+(R?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!_?"":" "+E[1]+(A.getTime()===G.getTime()?" "+this._currentClass:"")+(A.getTime()===B.getTime()?" ui-datepicker-today":""))+"'"+(F&&!_||!E[2]?"":" title='"+E[2].replace(/'/g,"&#39;")+"'")+(R?"":" data-handler='selectDay' data-event='click' data-month='"+A.getMonth()+"' data-year='"+A.getFullYear()+"'")+">"+(F&&!_?"&#xa0;":R?"<span class='ui-state-default'>"+A.getDate()+"</span>":"<a class='ui-state-default"+(A.getTime()===B.getTime()?" ui-state-highlight":"")+(A.getTime()===G.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+"' href='#'>"+A.getDate()+"</a>")+"</td>",A.setDate(A.getDate()+1),A=this._daylightSavingAdjust(A);T+=W+"</tr>"}Z++,Z>11&&(Z=0,te++),T+="</tbody></table>"+($?"</div>"+(U[0]>0&&C===U[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),x+=T}y+=x}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,o,a,r){var h,l,c,u,d,p,f,g,m=this._get(t,"changeMonth"),_=this._get(t,"changeYear"),v=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(o||!m)y+="<span class='ui-datepicker-month'>"+a[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+r[c]+"</option>");y+="</select>"}if(v||(b+=y+(!o&&m&&_?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",o||!_)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);return isNaN(e)?d:e},f=p(u[0]),g=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,g=n?Math.min(g,n.getFullYear()):g,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),v&&(b+=(!o&&m&&_?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.selectedYear+("Y"===i?e:0),n=t.selectedMonth+("M"===i?e:0),o=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),a=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,o)));t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),o=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&o.setDate(this._getDaysInMonth(o.getFullYear(),o.getMonth())),this._isInRange(t,o)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),o=this._getMinMaxDate(t,"max"),a=null,r=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),a=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(a+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||e.getTime()>=n.getTime())&&(!o||e.getTime()<=o.getTime())&&(!a||e.getFullYear()>=a)&&(!r||r>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).on("mousedown",t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new s,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.12.0",t.datepicker,t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var _=!1;t(document).on("mouseup",function(){_=!1}),t.widget("ui.mouse",{version:"1.12.0",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!_){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,s=1===e.which,n="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),_=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,_=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.ui.safeBlur=function(e){e&&"body"!==e.nodeName.toLowerCase()&&t(e).trigger("blur")},t.widget("ui.draggable",t.ui.mouse,{version:"1.12.0",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this._addClass("ui-draggable"),this._setHandleClassName(),this._mouseInit()},_setOption:function(t,e){this._super(t,e),"handle"===t&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(e){var i=this.options;return this._blurActiveElement(e),this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(e){this.iframeBlocks=this.document.find(e).map(function(){var e=t(this);return t("<div>").css("position","absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(e){var i=t.ui.safeActiveElement(this.document[0]),s=t(e.target);this._getHandle(e)&&s.closest(i).length||t.ui.safeBlur(i)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this._addClass(this.helper,"ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===t(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(e),this.originalPosition=this.position=this._generatePosition(e,!1),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_refreshOffsets:function(t){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:t.pageX-this.offset.left,top:t.pageY-this.offset.top}},_mouseDrag:function(e,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp(new t.Event("mouseup",e)),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1},_mouseUp:function(e){return this._unblockFrames(),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),this.handleElement.is(e.target)&&this.element.trigger("focus"),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp(new t.Event("mouseup",{target:this.element[0]})):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this._addClass(this.handleElement,"ui-draggable-handle")},_removeHandleClassName:function(){this._removeClass(this.handleElement,"ui-draggable-handle")},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper),n=s?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_isRootNode:function(t){return/(html|body)/i.test(t.tagName)||t===this.document[0]},_getParentOffset:function(){var e=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var t=this.element.position(),e=this._isRootNode(this.scrollParent[0]);return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+(e?0:this.scrollParent.scrollTop()),left:t.left-(parseInt(this.helper.css("left"),10)||0)+(e?0:this.scrollParent.scrollLeft())}
},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options,o=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(o).width()-this.helperProportions.width-this.margins.left,(t(o).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(t,e){e||(e=this.position);var i="absolute"===t?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:e.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:e.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(t,e){var i,s,n,o,a=this.options,r=this._isRootNode(this.scrollParent[0]),h=t.pageX,l=t.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),e&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,h=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o),"y"===a.axis&&(h=this.originalPageX),"x"===a.axis&&(l=this.originalPageY)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this._removeClass(this.helper,"ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s,this],!0),/^(drag|start|stop)/.test(e)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i,s){var n=t.extend({},i,{item:s.element});s.sortables=[],t(s.options.connectToSortable).each(function(){var i=t(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",e,n))})},stop:function(e,i,s){var n=t.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,t.each(s.sortables,function(){var t=this;t.isOver?(t.isOver=0,s.cancelHelperRemoval=!0,t.cancelHelperRemoval=!1,t._storedCSS={position:t.placeholder.css("position"),top:t.placeholder.css("top"),left:t.placeholder.css("left")},t._mouseStop(e),t.options.helper=t.options._helper):(t.cancelHelperRemoval=!0,t._trigger("deactivate",e,n))})},drag:function(e,i,s){t.each(s.sortables,function(){var n=!1,o=this;o.positionAbs=s.positionAbs,o.helperProportions=s.helperProportions,o.offset.click=s.offset.click,o._intersectsWith(o.containerCache)&&(n=!0,t.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==o&&this._intersectsWith(this.containerCache)&&t.contains(o.element[0],this.element[0])&&(n=!1),n})),n?(o.isOver||(o.isOver=1,s._parent=i.helper.parent(),o.currentItem=i.helper.appendTo(o.element).data("ui-sortable-item",!0),o.options._helper=o.options.helper,o.options.helper=function(){return i.helper[0]},e.target=o.currentItem[0],o._mouseCapture(e,!0),o._mouseStart(e,!0,!0),o.offset.click.top=s.offset.click.top,o.offset.click.left=s.offset.click.left,o.offset.parent.left-=s.offset.parent.left-o.offset.parent.left,o.offset.parent.top-=s.offset.parent.top-o.offset.parent.top,s._trigger("toSortable",e),s.dropped=o.element,t.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,o.fromOutside=s),o.currentItem&&(o._mouseDrag(e),i.position=o.position)):o.isOver&&(o.isOver=0,o.cancelHelperRemoval=!0,o.options._revert=o.options.revert,o.options.revert=!1,o._trigger("out",e,o._uiHash(o)),o._mouseStop(e,!0),o.options.revert=o.options._revert,o.options.helper=o.options._helper,o.placeholder&&o.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(e),i.position=s._generatePosition(e,!0),s._trigger("fromSortable",e),s.dropped=!1,t.each(s.sortables,function(){this.refreshPositions()}))})}}),t.ui.plugin.add("draggable","cursor",{start:function(e,i,s){var n=t("body"),o=s.options;n.css("cursor")&&(o._cursor=n.css("cursor")),n.css("cursor",o.cursor)},stop:function(e,i,s){var n=s.options;n._cursor&&t("body").css("cursor",n._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("opacity")&&(o._opacity=n.css("opacity")),n.css("opacity",o.opacity)},stop:function(e,i,s){var n=s.options;n._opacity&&t(i.helper).css("opacity",n._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(t,e,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(e,i,s){var n=s.options,o=!1,a=s.scrollParentNotHidden[0],r=s.document[0];a!==r&&"HTML"!==a.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+a.offsetHeight-e.pageY<n.scrollSensitivity?a.scrollTop=o=a.scrollTop+n.scrollSpeed:e.pageY-s.overflowOffset.top<n.scrollSensitivity&&(a.scrollTop=o=a.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+a.offsetWidth-e.pageX<n.scrollSensitivity?a.scrollLeft=o=a.scrollLeft+n.scrollSpeed:e.pageX-s.overflowOffset.left<n.scrollSensitivity&&(a.scrollLeft=o=a.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(e.pageY-t(r).scrollTop()<n.scrollSensitivity?o=t(r).scrollTop(t(r).scrollTop()-n.scrollSpeed):t(window).height()-(e.pageY-t(r).scrollTop())<n.scrollSensitivity&&(o=t(r).scrollTop(t(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(e.pageX-t(r).scrollLeft()<n.scrollSensitivity?o=t(r).scrollLeft(t(r).scrollLeft()-n.scrollSpeed):t(window).width()-(e.pageX-t(r).scrollLeft())<n.scrollSensitivity&&(o=t(r).scrollLeft(t(r).scrollLeft()+n.scrollSpeed)))),o!==!1&&t.ui.ddmanager&&!n.dropBehaviour&&t.ui.ddmanager.prepareOffsets(s,e)}}),t.ui.plugin.add("draggable","snap",{start:function(e,i,s){var n=s.options;s.snapElements=[],t(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var e=t(this),i=e.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:i.top,left:i.left})})},drag:function(e,i,s){var n,o,a,r,h,l,c,u,d,p,f=s.options,g=f.snapTolerance,m=i.offset.left,_=m+s.helperProportions.width,v=i.offset.top,b=v+s.helperProportions.height;for(d=s.snapElements.length-1;d>=0;d--)h=s.snapElements[d].left-s.margins.left,l=h+s.snapElements[d].width,c=s.snapElements[d].top-s.margins.top,u=c+s.snapElements[d].height,h-g>_||m>l+g||c-g>b||v>u+g||!t.contains(s.snapElements[d].item.ownerDocument,s.snapElements[d].item)?(s.snapElements[d].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(n=g>=Math.abs(c-b),o=g>=Math.abs(u-v),a=g>=Math.abs(h-_),r=g>=Math.abs(l-m),n&&(i.position.top=s._convertPositionTo("relative",{top:c-s.helperProportions.height,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left)),p=n||o||a||r,"outer"!==f.snapMode&&(n=g>=Math.abs(c-v),o=g>=Math.abs(u-b),a=g>=Math.abs(h-m),r=g>=Math.abs(l-_),n&&(i.position.top=s._convertPositionTo("relative",{top:c,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left)),!s.snapElements[d].snapping&&(n||o||a||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=n||o||a||r||p)}}),t.ui.plugin.add("draggable","stack",{start:function(e,i,s){var n,o=s.options,a=t.makeArray(t(o.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});a.length&&(n=parseInt(t(a[0]).css("zIndex"),10)||0,t(a).each(function(e){t(this).css("zIndex",n+e)}),this.css("zIndex",n+a.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("zIndex")&&(o._zIndex=n.css("zIndex")),n.css("zIndex",o.zIndex)},stop:function(e,i,s){var n=s.options;n._zIndex&&t(i.helper).css("zIndex",n._zIndex)}}),t.ui.draggable,t.widget("ui.resizable",t.ui.mouse,{version:"1.12.0",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,h=this._change[o];return this._updatePrevProperties(),h?(i=h.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,h,l=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,h=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,l.animate||this.element.css(t.extend(a,{top:h,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!l.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,h=this.originalPosition.top+this.originalSize.height,l=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&l&&(t.left=r-e.minWidth),s&&l&&(t.left=r-e.maxWidth),a&&c&&(t.top=h-e.minHeight),n&&c&&(t.top=h-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-a},l=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(h,c&&l?{top:c,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,h=t(this).resizable("instance"),l=h.options,c=h.element,u=l.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(h.containerElement=t(d),/document/.test(u)||u===document?(h.containerOffset={left:0,top:0},h.containerPosition={left:0,top:0},h.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=h._num(e.css("padding"+s))}),h.containerOffset=e.offset(),h.containerPosition=e.position(),h.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=h.containerOffset,n=h.containerSize.height,o=h.containerSize.width,a=h._hasScroll(d,"left")?d.scrollWidth:o,r=h._hasScroll(d)?d.scrollHeight:n,h.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,h=a.containerOffset,l=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=h),l.left<(a._helper?h.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-h.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?h.left:0),l.top<(a._helper?h.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-h.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?h.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-h.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-h.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),h=a.outerWidth()-e.sizeDiff.width,l=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,h="number"==typeof s.grid?[s.grid,s.grid]:s.grid,l=h[0]||1,c=h[1]||1,u=Math.round((n.width-o.width)/l)*l,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=h,_&&(p+=l),v&&(f+=c),g&&(p-=l),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-l)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-l>0?(i.size.width=p,i.position.left=a.left-u):(p=l-e.width,i.size.width=p,i.position.left=a.left+o.width-p))}}),t.ui.resizable,t.widget("ui.dialog",{version:"1.12.0",options:{appendTo:"body",autoOpen:!0,buttons:[],classes:{"ui-dialog":"ui-corner-all","ui-dialog-titlebar":"ui-corner-all"},closeOnEscape:!0,closeText:"Close",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},sizeRelatedOptions:{buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},resizableRelatedOptions:{maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),null==this.options.title&&null!=this.originalTitle&&(this.options.title=this.originalTitle),this.options.disabled&&(this.options.disabled=!1),this._createWrapper(),this.element.show().removeAttr("title").appendTo(this.uiDialog),this._addClass("ui-dialog-content","ui-widget-content"),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1,this._trackFocus()},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._untrackInstance(),this._destroyOverlay(),this.element.removeUniqueId().css(this.originalCss).detach(),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog
},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._focusedElement=null,this._destroyOverlay(),this._untrackInstance(),this.opener.filter(":focusable").trigger("focus").length||t.ui.safeBlur(t.ui.safeActiveElement(this.document[0])),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,i){var s=!1,n=this.uiDialog.siblings(".ui-front:visible").map(function(){return+t(this).css("z-index")}).get(),o=Math.max.apply(null,n);return o>=+this.uiDialog.css("z-index")&&(this.uiDialog.css("z-index",o+1),s=!0),s&&!i&&this._trigger("focus",e),s},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),void 0):(this._isOpen=!0,this.opener=t(t.ui.safeActiveElement(this.document[0])),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this.overlay&&this.overlay.css("z-index",this.uiDialog.css("z-index")-1),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._makeFocusTarget(),this._trigger("open"),void 0)},_focusTabbable:function(){var t=this._focusedElement;t||(t=this.element.find("[autofocus]")),t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).trigger("focus")},_keepFocus:function(e){function i(){var e=t.ui.safeActiveElement(this.document[0]),i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._addClass(this.uiDialog,"ui-dialog","ui-widget ui-widget-content ui-front"),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),void 0;if(e.keyCode===t.ui.keyCode.TAB&&!e.isDefaultPrevented()){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(this._delay(function(){n.trigger("focus")}),e.preventDefault()):(this._delay(function(){s.trigger("focus")}),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>"),this._addClass(this.uiDialogTitlebar,"ui-dialog-titlebar","ui-widget-header ui-helper-clearfix"),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.trigger("focus")}}),this.uiDialogTitlebarClose=t("<button type='button'></button>").button({label:t("<a>").text(this.options.closeText).html(),icon:"ui-icon-closethick",showLabel:!1}).appendTo(this.uiDialogTitlebar),this._addClass(this.uiDialogTitlebarClose,"ui-dialog-titlebar-close"),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().prependTo(this.uiDialogTitlebar),this._addClass(e,"ui-dialog-title"),this._title(e),this.uiDialogTitlebar.prependTo(this.uiDialog),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title?t.text(this.options.title):t.html("&#160;")},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>"),this._addClass(this.uiDialogButtonPane,"ui-dialog-buttonpane","ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").appendTo(this.uiDialogButtonPane),this._addClass(this.uiButtonSet,"ui-dialog-buttonset"),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this._removeClass(this.uiDialog,"ui-dialog-buttons"),void 0):(t.each(i,function(i,s){var n,o;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,o={icon:s.icon,iconPosition:s.iconPosition,showLabel:s.showLabel},delete s.click,delete s.icon,delete s.iconPosition,delete s.showLabel,t("<button></button>",s).button(o).appendTo(e.uiButtonSet).on("click",function(){n.apply(e.element[0],arguments)})}),this._addClass(this.uiDialog,"ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),void 0)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){i._addClass(t(this),"ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,o){var a=o.offset.left-i.document.scrollLeft(),r=o.offset.top-i.document.scrollTop();s.position={my:"left top",at:"left"+(a>=0?"+":"")+a+" "+"top"+(r>=0?"+":"")+r,of:i.window},i._removeClass(t(this),"ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(o))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}}var i=this,s=this.options,n=s.resizable,o=this.uiDialog.css("position"),a="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:a,start:function(s,n){i._addClass(t(this),"ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,o){var a=i.uiDialog.offset(),r=a.left-i.document.scrollLeft(),h=a.top-i.document.scrollTop();s.height=i.uiDialog.height(),s.width=i.uiDialog.width(),s.position={my:"left top",at:"left"+(r>=0?"+":"")+r+" "+"top"+(h>=0?"+":"")+h,of:i.window},i._removeClass(t(this),"ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(o))}}).css("position",o)},_trackFocus:function(){this._on(this.widget(),{focusin:function(e){this._makeFocusTarget(),this._focusedElement=t(e.target)}})},_makeFocusTarget:function(){this._untrackInstance(),this._trackingInstances().unshift(this)},_untrackInstance:function(){var e=this._trackingInstances(),i=t.inArray(this,e);-1!==i&&e.splice(i,1)},_trackingInstances:function(){var t=this.document.data("ui-dialog-instances");return t||(t=[],this.document.data("ui-dialog-instances",t)),t},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(e){var i=this,s=!1,n={};t.each(e,function(t,e){i._setOption(t,e),t in i.sizeRelatedOptions&&(s=!0),t in i.resizableRelatedOptions&&(n[t]=e)}),s&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",n)},_setOption:function(e,i){var s,n,o=this.uiDialog;"disabled"!==e&&(this._super(e,i),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:t("<a>").text(""+this.options.closeText).html()}),"draggable"===e&&(s=o.is(":data(ui-draggable)"),s&&!i&&o.draggable("destroy"),!s&&i&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(n=o.is(":data(ui-resizable)"),n&&!i&&o.resizable("destroy"),n&&"string"==typeof i&&o.resizable("option","handles",i),n||i===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=!0;this._delay(function(){e=!1}),this.document.data("ui-dialog-overlays")||this._on(this.document,{focusin:function(t){e||this._allowInteraction(t)||(t.preventDefault(),this._trackingInstances()[0]._focusTabbable())}}),this.overlay=t("<div>").appendTo(this._appendTo()),this._addClass(this.overlay,null,"ui-widget-overlay ui-front"),this._on(this.overlay,{mousedown:"_keepFocus"}),this.document.data("ui-dialog-overlays",(this.document.data("ui-dialog-overlays")||0)+1)}},_destroyOverlay:function(){if(this.options.modal&&this.overlay){var t=this.document.data("ui-dialog-overlays")-1;t?this.document.data("ui-dialog-overlays",t):(this._off(this.document,"focusin"),this.document.removeData("ui-dialog-overlays")),this.overlay.remove(),this.overlay=null}}}),t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{options:{dialogClass:""},_createWrapper:function(){this._super(),this.uiDialog.addClass(this.options.dialogClass)},_setOption:function(t,e){"dialogClass"===t&&this.uiDialog.removeClass(this.options.dialogClass).addClass(e),this._superApply(arguments)}}),t.ui.dialog,t.widget("ui.droppable",{version:"1.12.0",widgetEventPrefix:"drop",options:{accept:"*",addClasses:!0,greedy:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(s)?s:function(t){return t.is(s)},this.proportions=function(){return arguments.length?(e=arguments[0],void 0):e?e:e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this._addClass("ui-droppable")},_addToManager:function(e){t.ui.ddmanager.droppables[e]=t.ui.ddmanager.droppables[e]||[],t.ui.ddmanager.droppables[e].push(this)},_splice:function(t){for(var e=0;t.length>e;e++)t[e]===this&&t.splice(e,1)},_destroy:function(){var e=t.ui.ddmanager.droppables[this.options.scope];this._splice(e)},_setOption:function(e,i){if("accept"===e)this.accept=t.isFunction(i)?i:function(t){return t.is(i)};else if("scope"===e){var s=t.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(e,i)},_activate:function(e){var i=t.ui.ddmanager.current;this._addActiveClass(),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this._removeActiveClass(),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._addHoverClass(),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._removeHoverClass(),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var i=t(this).droppable("instance");return i.options.greedy&&!i.options.disabled&&i.options.scope===s.options.scope&&i.accept.call(i.element[0],s.currentItem||s.element)&&v(s,t.extend(i,{offset:i.element.offset()}),i.options.tolerance,e)?(n=!0,!1):void 0}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this._removeActiveClass(),this._removeHoverClass(),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}},_addHoverClass:function(){this._addClass("ui-droppable-hover")},_removeHoverClass:function(){this._removeClass("ui-droppable-hover")},_addActiveClass:function(){this._addClass("ui-droppable-active")},_removeActiveClass:function(){this._removeClass("ui-droppable-active")}});var v=t.ui.intersect=function(){function t(t,e,i){return t>=e&&e+i>t}return function(e,i,s,n){if(!i.offset)return!1;var o=(e.positionAbs||e.position.absolute).left+e.margins.left,a=(e.positionAbs||e.position.absolute).top+e.margins.top,r=o+e.helperProportions.width,h=a+e.helperProportions.height,l=i.offset.left,c=i.offset.top,u=l+i.proportions().width,d=c+i.proportions().height;switch(s){case"fit":return o>=l&&u>=r&&a>=c&&d>=h;case"intersect":return o+e.helperProportions.width/2>l&&u>r-e.helperProportions.width/2&&a+e.helperProportions.height/2>c&&d>h-e.helperProportions.height/2;case"pointer":return t(n.pageY,c,i.proportions().height)&&t(n.pageX,l,i.proportions().width);case"touch":return(a>=c&&d>=a||h>=c&&d>=h||c>a&&h>d)&&(o>=l&&u>=o||r>=l&&u>=r||l>o&&r>u);default:return!1}}}();t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions().height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions({width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight}))}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&v(e,this,this.options.tolerance,i)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").on("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,o,a=v(e,this,this.options.tolerance,i),r=!a&&this.isover?"isout":a&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,o=this.element.parents(":data(ui-droppable)").filter(function(){return t(this).droppable("instance").options.scope===n}),o.length&&(s=t(o[0]).droppable("instance"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").off("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}},t.uiBackCompat!==!1&&t.widget("ui.droppable",t.ui.droppable,{options:{hoverClass:!1,activeClass:!1},_addActiveClass:function(){this._super(),this.options.activeClass&&this.element.addClass(this.options.activeClass)},_removeActiveClass:function(){this._super(),this.options.activeClass&&this.element.removeClass(this.options.activeClass)},_addHoverClass:function(){this._super(),this.options.hoverClass&&this.element.addClass(this.options.hoverClass)},_removeHoverClass:function(){this._super(),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass)}}),t.ui.droppable,t.widget("ui.progressbar",{version:"1.12.0",options:{classes:{"ui-progressbar":"ui-corner-all","ui-progressbar-value":"ui-corner-left","ui-progressbar-complete":"ui-corner-right"},max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.attr({role:"progressbar","aria-valuemin":this.min}),this._addClass("ui-progressbar","ui-widget ui-widget-content"),this.valueDiv=t("<div>").appendTo(this.element),this._addClass(this.valueDiv,"ui-progressbar-value","ui-widget-header"),this._refreshValue()},_destroy:function(){this.element.removeAttr("role aria-valuemin aria-valuemax aria-valuenow"),this.valueDiv.remove()},value:function(t){return void 0===t?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),void 0)},_constrainedValue:function(t){return void 0===t&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_setOptionDisabled:function(t){this._super(t),this.element.attr("aria-disabled",t),this._toggleClass(null,"ui-state-disabled",!!t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).width(i.toFixed(0)+"%"),this._toggleClass(this.valueDiv,"ui-progressbar-complete",null,e===this.options.max)._toggleClass("ui-progressbar-indeterminate",null,this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div>").appendTo(this.valueDiv),this._addClass(this.overlayDiv,"ui-progressbar-overlay"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}}),t.widget("ui.selectable",t.ui.mouse,{version:"1.12.0",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e=this;this._addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e.elementPos=t(e.element[0]).offset(),e.selectees=t(e.options.filter,e.element[0]),e._addClass(e.selectees,"ui-selectee"),e.selectees.each(function(){var i=t(this),s=i.offset(),n={left:s.left-e.elementPos.left,top:s.top-e.elementPos.top};t.data(this,"selectable-item",{element:this,$element:i,left:n.left,top:n.top,right:n.left+i.outerWidth(),bottom:n.top+i.outerHeight(),startselected:!1,selected:i.hasClass("ui-selected"),selecting:i.hasClass("ui-selecting"),unselecting:i.hasClass("ui-unselecting")})})},this.refresh(),this._mouseInit(),this.helper=t("<div>"),this._addClass(this.helper,"ui-selectable-helper")},_destroy:function(){this.selectees.removeData("selectable-item"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.elementPos=t(this.element[0]).offset(),this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(i._removeClass(s.$element,"ui-selected"),s.selected=!1,i._addClass(s.$element,"ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),i._removeClass(n.$element,s?"ui-unselecting":"ui-selected")._addClass(n.$element,s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,h=e.pageY;return o>r&&(i=r,r=o,o=i),a>h&&(i=h,h=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:h-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),l=!1,c={};i&&i.element!==s.element[0]&&(c.left=i.left+s.elementPos.left,c.right=i.right+s.elementPos.left,c.top=i.top+s.elementPos.top,c.bottom=i.bottom+s.elementPos.top,"touch"===n.tolerance?l=!(c.left>r||o>c.right||c.top>h||a>c.bottom):"fit"===n.tolerance&&(l=c.left>o&&r>c.right&&c.top>a&&h>c.bottom),l?(i.selected&&(s._removeClass(i.$element,"ui-selected"),i.selected=!1),i.unselecting&&(s._removeClass(i.$element,"ui-unselecting"),i.unselecting=!1),i.selecting||(s._addClass(i.$element,"ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,s._addClass(i.$element,"ui-selected"),i.selected=!0):(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,i.startselected&&(s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(s._removeClass(i.$element,"ui-selected"),i.selected=!1,s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-selecting")._addClass(s.$element,"ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}}),t.widget("ui.selectmenu",[t.ui.formResetMixin,{version:"1.12.0",defaultElement:"<select>",options:{appendTo:null,classes:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"},disabled:null,icons:{button:"ui-icon-triangle-1-s"},position:{my:"left top",at:"left bottom",collision:"none"},width:!1,change:null,close:null,focus:null,open:null,select:null},_create:function(){var e=this.element.uniqueId().attr("id");this.ids={element:e,button:e+"-button",menu:e+"-menu"},this._drawButton(),this._drawMenu(),this._bindFormResetHandler(),this._rendered=!1,this.menuItems=t()},_drawButton:function(){var e,i=this,s=this._parseOption(this.element.find("option:selected"),this.element[0].selectedIndex);this.labels=this.element.labels().attr("for",this.ids.button),this._on(this.labels,{click:function(t){this.button.focus(),t.preventDefault()}}),this.element.hide(),this.button=t("<span>",{tabindex:this.options.disabled?-1:0,id:this.ids.button,role:"combobox","aria-expanded":"false","aria-autocomplete":"list","aria-owns":this.ids.menu,"aria-haspopup":"true",title:this.element.attr("title")}).insertAfter(this.element),this._addClass(this.button,"ui-selectmenu-button ui-selectmenu-button-closed","ui-button ui-widget"),e=t("<span>").appendTo(this.button),this._addClass(e,"ui-selectmenu-icon","ui-icon "+this.options.icons.button),this.buttonItem=this._renderButtonItem(s).appendTo(this.button),this.options.width!==!1&&this._resizeButton(),this._on(this.button,this._buttonEvents),this.button.one("focusin",function(){i._rendered||i._refreshMenu()})},_drawMenu:function(){var e=this;this.menu=t("<ul>",{"aria-hidden":"true","aria-labelledby":this.ids.button,id:this.ids.menu}),this.menuWrap=t("<div>").append(this.menu),this._addClass(this.menuWrap,"ui-selectmenu-menu","ui-front"),this.menuWrap.appendTo(this._appendTo()),this.menuInstance=this.menu.menu({classes:{"ui-menu":"ui-corner-bottom"},role:"listbox",select:function(t,i){t.preventDefault(),e._setSelection(),e._select(i.item.data("ui-selectmenu-item"),t)},focus:function(t,i){var s=i.item.data("ui-selectmenu-item");null!=e.focusIndex&&s.index!==e.focusIndex&&(e._trigger("focus",t,{item:s}),e.isOpen||e._select(s,t)),e.focusIndex=s.index,e.button.attr("aria-activedescendant",e.menuItems.eq(s.index).attr("id"))}}).menu("instance"),this.menuInstance._off(this.menu,"mouseleave"),this.menuInstance._closeOnDocumentClick=function(){return!1},this.menuInstance._isDivider=function(){return!1}},refresh:function(){this._refreshMenu(),this.buttonItem.replaceWith(this.buttonItem=this._renderButtonItem(this._getSelectedItem().data("ui-selectmenu-item")||{})),null===this.options.width&&this._resizeButton()},_refreshMenu:function(){var t,e=this.element.find("option");this.menu.empty(),this._parseOptions(e),this._renderMenu(this.menu,this.items),this.menuInstance.refresh(),this.menuItems=this.menu.find("li").not(".ui-selectmenu-optgroup").find(".ui-menu-item-wrapper"),this._rendered=!0,e.length&&(t=this._getSelectedItem(),this.menuInstance.focus(null,t),this._setAria(t.data("ui-selectmenu-item")),this._setOption("disabled",this.element.prop("disabled")))},open:function(t){this.options.disabled||(this._rendered?(this._removeClass(this.menu.find(".ui-state-active"),null,"ui-state-active"),this.menuInstance.focus(null,this._getSelectedItem())):this._refreshMenu(),this.menuItems.length&&(this.isOpen=!0,this._toggleAttr(),this._resizeMenu(),this._position(),this._on(this.document,this._documentClick),this._trigger("open",t)))},_position:function(){this.menuWrap.position(t.extend({of:this.button},this.options.position))},close:function(t){this.isOpen&&(this.isOpen=!1,this._toggleAttr(),this.range=null,this._off(this.document),this._trigger("close",t))},widget:function(){return this.button},menuWidget:function(){return this.menu},_renderButtonItem:function(e){var i=t("<span>");return this._setText(i,e.label),this._addClass(i,"ui-selectmenu-text"),i},_renderMenu:function(e,i){var s=this,n="";t.each(i,function(i,o){var a;o.optgroup!==n&&(a=t("<li>",{text:o.optgroup}),s._addClass(a,"ui-selectmenu-optgroup","ui-menu-divider"+(o.element.parent("optgroup").prop("disabled")?" ui-state-disabled":"")),a.appendTo(e),n=o.optgroup),s._renderItemData(e,o)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-selectmenu-item",e)},_renderItem:function(e,i){var s=t("<li>"),n=t("<div>",{title:i.element.attr("title")});return i.disabled&&this._addClass(s,null,"ui-state-disabled"),this._setText(n,i.label),s.append(n).appendTo(e)},_setText:function(t,e){e?t.text(e):t.html("&#160;")},_move:function(t,e){var i,s,n=".ui-menu-item";this.isOpen?i=this.menuItems.eq(this.focusIndex).parent("li"):(i=this.menuItems.eq(this.element[0].selectedIndex).parent("li"),n+=":not(.ui-state-disabled)"),s="first"===t||"last"===t?i["first"===t?"prevAll":"nextAll"](n).eq(-1):i[t+"All"](n).eq(0),s.length&&this.menuInstance.focus(e,s)},_getSelectedItem:function(){return this.menuItems.eq(this.element[0].selectedIndex).parent("li")},_toggle:function(t){this[this.isOpen?"close":"open"](t)},_setSelection:function(){var t;this.range&&(window.getSelection?(t=window.getSelection(),t.removeAllRanges(),t.addRange(this.range)):this.range.select(),this.button.focus())},_documentClick:{mousedown:function(e){this.isOpen&&(t(e.target).closest(".ui-selectmenu-menu, #"+t.ui.escapeSelector(this.ids.button)).length||this.close(e))}},_buttonEvents:{mousedown:function(){var t;window.getSelection?(t=window.getSelection(),t.rangeCount&&(this.range=t.getRangeAt(0))):this.range=document.selection.createRange()},click:function(t){this._setSelection(),this._toggle(t)},keydown:function(e){var i=!0;switch(e.keyCode){case t.ui.keyCode.TAB:case t.ui.keyCode.ESCAPE:this.close(e),i=!1;break;case t.ui.keyCode.ENTER:this.isOpen&&this._selectFocusedItem(e);break;case t.ui.keyCode.UP:e.altKey?this._toggle(e):this._move("prev",e);break;case t.ui.keyCode.DOWN:e.altKey?this._toggle(e):this._move("next",e);break;case t.ui.keyCode.SPACE:this.isOpen?this._selectFocusedItem(e):this._toggle(e);break;case t.ui.keyCode.LEFT:this._move("prev",e);break;case t.ui.keyCode.RIGHT:this._move("next",e);break;case t.ui.keyCode.HOME:case t.ui.keyCode.PAGE_UP:this._move("first",e);break;case t.ui.keyCode.END:case t.ui.keyCode.PAGE_DOWN:this._move("last",e);break;default:this.menu.trigger(e),i=!1}i&&e.preventDefault()}},_selectFocusedItem:function(t){var e=this.menuItems.eq(this.focusIndex).parent("li");e.hasClass("ui-state-disabled")||this._select(e.data("ui-selectmenu-item"),t)},_select:function(t,e){var i=this.element[0].selectedIndex;this.element[0].selectedIndex=t.index,this.buttonItem.replaceWith(this.buttonItem=this._renderButtonItem(t)),this._setAria(t),this._trigger("select",e,{item:t}),t.index!==i&&this._trigger("change",e,{item:t}),this.close(e)},_setAria:function(t){var e=this.menuItems.eq(t.index).attr("id");this.button.attr({"aria-labelledby":e,"aria-activedescendant":e}),this.menu.attr("aria-activedescendant",e)},_setOption:function(t,e){if("icons"===t){var i=this.button.find("span.ui-icon");this._removeClass(i,null,this.options.icons.button)._addClass(i,null,e.button)}this._super(t,e),"appendTo"===t&&this.menuWrap.appendTo(this._appendTo()),"width"===t&&this._resizeButton()},_setOptionDisabled:function(t){this._super(t),this.menuInstance.option("disabled",t),this.button.attr("aria-disabled",t),this._toggleClass(this.button,null,"ui-state-disabled",t),this.element.prop("disabled",t),t?(this.button.attr("tabindex",-1),this.close()):this.button.attr("tabindex",0)},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e&&e[0]||(e=this.element.closest(".ui-front, dialog")),e.length||(e=this.document[0].body),e},_toggleAttr:function(){this.button.attr("aria-expanded",this.isOpen),this._removeClass(this.button,"ui-selectmenu-button-"+(this.isOpen?"closed":"open"))._addClass(this.button,"ui-selectmenu-button-"+(this.isOpen?"open":"closed"))._toggleClass(this.menuWrap,"ui-selectmenu-open",null,this.isOpen),this.menu.attr("aria-hidden",!this.isOpen)},_resizeButton:function(){var t=this.options.width;return t===!1?(this.button.css("width",""),void 0):(null===t&&(t=this.element.show().outerWidth(),this.element.hide()),this.button.outerWidth(t),void 0)},_resizeMenu:function(){this.menu.outerWidth(Math.max(this.button.outerWidth(),this.menu.width("").outerWidth()+1))},_getCreateOptions:function(){var t=this._super();return t.disabled=this.element.prop("disabled"),t},_parseOptions:function(e){var i=this,s=[];e.each(function(e,n){s.push(i._parseOption(t(n),e))}),this.items=s},_parseOption:function(t,e){var i=t.parent("optgroup");return{element:t,index:e,value:t.val(),label:t.text(),optgroup:i.attr("label")||"",disabled:i.prop("disabled")||t.prop("disabled")}},_destroy:function(){this._unbindFormResetHandler(),this.menuWrap.remove(),this.button.remove(),this.element.show(),this.element.removeUniqueId(),this.labels.attr("for",this.ids.element)}}]),t.widget("ui.slider",t.ui.mouse,{version:"1.12.0",widgetEventPrefix:"slide",options:{animate:!1,classes:{"ui-slider":"ui-corner-all","ui-slider-handle":"ui-corner-all","ui-slider-range":"ui-corner-all ui-widget-header"},distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this._addClass("ui-slider ui-slider-"+this.orientation,"ui-widget ui-widget-content"),this._refresh(),this._animateOff=!1
},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle"),o="<span tabindex='0'></span>",a=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)a.push(o);this.handles=n.add(t(a.join("")).appendTo(this.element)),this._addClass(this.handles,"ui-slider-handle","ui-state-default"),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options;e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?(this._removeClass(this.range,"ui-slider-range-min ui-slider-range-max"),this.range.css({left:"",bottom:""})):(this.range=t("<div>").appendTo(this.element),this._addClass(this.range,"ui-slider-range")),("min"===e.range||"max"===e.range)&&this._addClass(this.range,"ui-slider-range-"+e.range)):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,o,a,r,h,l,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,o=t(this),a=e)}),r=this._start(e,a),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=a,this._addClass(o,null,"ui-state-active"),o.trigger("focus"),h=o.offset(),l=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-o.width()/2,top:e.pageY-h.top-o.height()/2-(parseInt(o.css("borderTopWidth"),10)||0)-(parseInt(o.css("borderBottomWidth"),10)||0)+(parseInt(o.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,a,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this._removeClass(this.handles,null,"ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,o;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),o=this._valueMin()+s*n,this._trimAlignValue(o)},_uiHash:function(t,e,i){var s={handle:this.handles[t],handleIndex:t,value:void 0!==e?e:this.value()};return this._hasMultipleValues()&&(s.value=void 0!==e?e:this.values(t),s.values=i||this.values()),s},_hasMultipleValues:function(){return this.options.values&&this.options.values.length},_start:function(t,e){return this._trigger("start",t,this._uiHash(e))},_slide:function(t,e,i){var s,n,o=this.value(),a=this.values();this._hasMultipleValues()&&(n=this.values(e?0:1),o=this.values(e),2===this.options.values.length&&this.options.range===!0&&(i=0===e?Math.min(n,i):Math.max(n,i)),a[e]=i),i!==o&&(s=this._trigger("slide",t,this._uiHash(e,i,a)),s!==!1&&(this._hasMultipleValues()?this.values(e,i):this.value(i)))},_stop:function(t,e){this._trigger("stop",t,this._uiHash(e))},_change:function(t,e){this._keySliding||this._mouseSliding||(this._lastChangedValue=e,this._trigger("change",t,this._uiHash(e)))},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(e,i){var s,n,o;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),void 0;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this._hasMultipleValues()?this._values(e):this.value();for(s=this.options.values,n=arguments[0],o=0;s.length>o;o+=1)s[o]=this._trimAlignValue(n[o]),this._change(null,o);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),this._super(e,i),e){case"orientation":this._detectOrientation(),this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-"+this.orientation),this._refreshValue(),this.options.range&&this._refreshRange(i),this.handles.css("horizontal"===i?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=n-1;s>=0;s--)this._change(null,s);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_setOptionDisabled:function(t){this._super(t),this._toggleClass(null,"ui-state-disabled",!!t)},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this._hasMultipleValues()){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var t=this.options.max,e=this._valueMin(),i=this.options.step,s=Math.round((t-e)/i)*i;t=s+e,t>this.options.max&&(t-=i),this.max=parseFloat(t.toFixed(this._precision()))},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshRange:function(t){"vertical"===t&&this.range.css({width:"",left:""}),"horizontal"===t&&this.range.css({height:"",bottom:""})},_refreshValue:function(){var e,i,s,n,o,a=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,c={};this._hasMultipleValues()?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),c["horizontal"===h.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[l?"animate":"css"](c,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),o=this._valueMax(),i=o!==n?100*((s-n)/(o-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](c,r.animate),"min"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:100-i+"%"},r.animate),"min"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:100-i+"%"},r.animate))},_handleEvents:{keydown:function(e){var i,s,n,o,a=t(e.target).data("ui-slider-handle-index");switch(e.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(e.preventDefault(),!this._keySliding&&(this._keySliding=!0,this._addClass(t(e.target),null,"ui-state-active"),i=this._start(e,a),i===!1))return}switch(o=this.options.step,s=n=this._hasMultipleValues()?this.values(a):this.value(),e.keyCode){case t.ui.keyCode.HOME:n=this._valueMin();break;case t.ui.keyCode.END:n=this._valueMax();break;case t.ui.keyCode.PAGE_UP:n=this._trimAlignValue(s+(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(s-(this._valueMax()-this._valueMin())/this.numPages);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(s===this._valueMax())return;n=this._trimAlignValue(s+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(s===this._valueMin())return;n=this._trimAlignValue(s-o)}this._slide(e,a,n)},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),this._removeClass(t(e.target),null,"ui-state-active"))}}}),t.widget("ui.sortable",t.ui.mouse,{version:"1.12.0",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(t,e,i){return t>=e&&e+i>t},_isFloating:function(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))},_create:function(){this.containerCache={},this._addClass("ui-sortable"),this.refresh(),this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(t,e){this._super(t,e),"handle"===t&&this._setHandleClassName()},_setHandleClassName:function(){var e=this;this._removeClass(this.element.find(".ui-sortable-handle"),"ui-sortable-handle"),t.each(this.items,function(){e._addClass(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item,"ui-sortable-handle")})},_destroy:function(){this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):void 0}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this._addClass(this.helper,"ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-this.document.scrollTop()<a.scrollSensitivity?r=this.document.scrollTop(this.document.scrollTop()-a.scrollSpeed):this.window.height()-(e.pageY-this.document.scrollTop())<a.scrollSensitivity&&(r=this.document.scrollTop(this.document.scrollTop()+a.scrollSpeed)),e.pageX-this.document.scrollLeft()<a.scrollSensitivity?r=this.document.scrollLeft(this.document.scrollLeft()-a.scrollSpeed):this.window.width()-(e.pageX-this.document.scrollLeft())<a.scrollSensitivity&&(r=this.document.scrollLeft(this.document.scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?(this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var e,i,s="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),n="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),o=s&&n;return o?(e=this._getDragVerticalDirection(),i=this._getDragHorizontalDirection(),this.floating?"right"===i||"down"===e?2:1:e&&("down"===e?2:1)):!1},_intersectsWithSides:function(t){var e=this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&e||"up"===s&&!e)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){function i(){r.push(this)}var s,n,o,a,r=[],h=[],l=this._connectWith();if(l&&e)for(s=l.length-1;s>=0;s--)for(o=t(l[s],this.document[0]),n=o.length-1;n>=0;n--)a=t.data(o[n],this.widgetFullName),a&&a!==this&&!a.options.disabled&&h.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(h.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return t(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i],this.document[0]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",a),c.push({item:h,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.floating=this.items.length?"x"===this.options.axis||this._isFloating(this.items[0].item):!1,this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]);return e._addClass(n,"ui-sortable-placeholder",i||e.currentItem[0].className)._removeClass(n,"ui-sortable-helper"),"tbody"===s?e._createTrPlaceholder(e.currentItem.find("tr").eq(0),t("<tr>",e.document[0]).appendTo(n)):"tr"===s?e._createTrPlaceholder(e.currentItem,n):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_createTrPlaceholder:function(e,i){var s=this;e.children().each(function(){t("<td>&#160;</td>",s.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(i)})},_contactContainers:function(e){var i,s,n,o,a,r,h,l,c,u,d=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!t.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(d&&t.contains(this.containers[i].element[0],d.element[0]))continue;d=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",e,this._uiHash(this)),this.containers[i].containerCache.over=0);if(d)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,o=null,c=d.floating||this._isFloating(this.currentItem),a=c?"left":"top",r=c?"width":"height",u=c?"pageX":"pageY",s=this.items.length-1;s>=0;s--)t.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(h=this.items[s].item.offset()[a],l=!1,e[u]-h>this.items[s][r]/2&&(l=!0),n>Math.abs(e[u]-h)&&(n=Math.abs(e[u]-h),o=this.items[s],this.direction=l?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;o?this._rearrange(e,o,null,!0):this._rearrange(e,null,this.containers[p].element,!0),this._trigger("change",e,this._uiHash()),this.containers[p]._trigger("change",e,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===this.document[0].body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,"document"===n.containment?this.document.width():this.window.width()-this.helperProportions.width-this.margins.left,("document"===n.containment?this.document.height()||document.body.parentNode.scrollHeight:this.window.height()||this.document[0].body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)
})},_clear:function(t,e){function i(t,e,i){return function(s){i._trigger(t,s,e._uiHash(e))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&n.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||n.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(n.push(function(t){this._trigger("remove",t,this._uiHash())}),n.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)e||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!e){for(s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}}),t.widget("ui.spinner",{version:"1.12.0",defaultElement:"<input>",widgetEventPrefix:"spin",options:{classes:{"ui-spinner":"ui-corner-all","ui-spinner-down":"ui-corner-br","ui-spinner-up":"ui-corner-tr"},culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),""!==this.value()&&this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e=this._super(),i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);null!=n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var e=this.element[0]===t.ui.safeActiveElement(this.document[0]);e||(this.element.trigger("focus"),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===t.ui.safeActiveElement(this.document[0])?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap("<span>").parent().append("<a></a><a></a>")},_draw:function(){this._enhance(),this._addClass(this.uiSpinner,"ui-spinner","ui-widget ui-widget-content"),this._addClass("ui-spinner-input"),this.element.attr("role","spinbutton"),this.buttons=this.uiSpinner.children("a").attr("tabIndex",-1).attr("aria-hidden",!0).button({classes:{"ui-button":""}}),this._removeClass(this.buttons,"ui-corner-all"),this._addClass(this.buttons.first(),"ui-spinner-button ui-spinner-up"),this._addClass(this.buttons.last(),"ui-spinner-button ui-spinner-down"),this.buttons.first().button({icon:this.options.icons.up,showLabel:!1}),this.buttons.last().button({icon:this.options.icons.down,showLabel:!1}),this.buttons.height()>Math.ceil(.5*this.uiSpinner.height())&&this.uiSpinner.height()>0&&this.uiSpinner.height(this.uiSpinner.height())},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){var i,s,n;return"culture"===t||"numberFormat"===t?(i=this._parse(this.element.val()),this.options[t]=e,this.element.val(this._format(i)),void 0):(("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(s=this.buttons.first().find(".ui-icon"),this._removeClass(s,null,this.options.icons.up),this._addClass(s,null,e.up),n=this.buttons.last().find(".ui-icon"),this._removeClass(n,null,this.options.icons.down),this._addClass(n,null,e.down)),this._super(t,e),void 0)},_setOptionDisabled:function(t){this._super(t),this._toggleClass(this.uiSpinner,null,"ui-state-disabled",!!t),this.element.prop("disabled",!!t),this.buttons.button(t?"disable":"enable")},_setOptions:r(function(t){this._super(t)}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},isValid:function(){var t=this.value();return null===t?!1:t===this._adjustValue(t)},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.prop("disabled",!1).removeAttr("autocomplete role aria-valuemin aria-valuemax aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:r(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:r(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:r(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:r(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(r(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}}),t.uiBackCompat!==!1&&t.widget("ui.spinner",t.ui.spinner,{_enhance:function(){this.uiSpinner=this.element.attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml())},_uiSpinnerHtml:function(){return"<span>"},_buttonHtml:function(){return"<a></a><a></a>"}}),t.ui.spinner,t.widget("ui.tabs",{version:"1.12.0",delay:300,options:{active:null,classes:{"ui-tabs":"ui-corner-all","ui-tabs-nav":"ui-corner-all","ui-tabs-panel":"ui-corner-bottom","ui-tabs-tab":"ui-corner-top"},collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_isLocal:function(){var t=/#.*$/;return function(e){var i,s;i=e.href.replace(t,""),s=location.href.replace(t,"");try{i=decodeURIComponent(i)}catch(n){}try{s=decodeURIComponent(s)}catch(n){}return e.hash.length>1&&i===s}}(),_create:function(){var e=this,i=this.options;this.running=!1,this._addClass("ui-tabs","ui-widget ui-widget-content"),this._toggleClass("ui-tabs-collapsible",null,i.collapsible),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var e=this.options.active,i=this.options.collapsible,s=location.hash.substring(1);return null===e&&(s&&this.tabs.each(function(i,n){return t(n).attr("aria-controls")===s?(e=i,!1):void 0}),null===e&&(e=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===e||-1===e)&&(e=this.tabs.length?0:!1)),e!==!1&&(e=this.tabs.index(this.tabs.eq(e)),-1===e&&(e=i?!1:0)),!i&&e===!1&&this.anchors.length&&(e=0),e},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(e){var i=t(t.ui.safeActiveElement(this.document[0])).closest("li"),s=this.tabs.index(i),n=!0;if(!this._handlePageNav(e)){switch(e.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:s++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:n=!1,s--;break;case t.ui.keyCode.END:s=this.anchors.length-1;break;case t.ui.keyCode.HOME:s=0;break;case t.ui.keyCode.SPACE:return e.preventDefault(),clearTimeout(this.activating),this._activate(s),void 0;case t.ui.keyCode.ENTER:return e.preventDefault(),clearTimeout(this.activating),this._activate(s===this.options.active?!1:s),void 0;default:return}e.preventDefault(),clearTimeout(this.activating),s=this._focusNextTab(s,n),e.ctrlKey||e.metaKey||(i.attr("aria-selected","false"),this.tabs.eq(s).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",s)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.trigger("focus"))},_handlePageNav:function(e){return e.altKey&&e.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):e.altKey&&e.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):void 0},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).trigger("focus"),t},_setOption:function(t,e){return"active"===t?(this._activate(e),void 0):(this._super(t,e),"collapsible"===t&&(this._toggleClass("ui-tabs-collapsible",null,e),e||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(e),"heightStyle"===t&&this._setupHeightStyle(e),void 0)},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setOptionDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-hidden":"true"}),this.active.length?(this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}),this._addClass(this.active,"ui-tabs-active","ui-state-active"),this._getPanelForTab(this.active).show().attr({"aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this,i=this.tabs,s=this.anchors,n=this.panels;this.tablist=this._getList().attr("role","tablist"),this._addClass(this.tablist,"ui-tabs-nav","ui-helper-reset ui-helper-clearfix ui-widget-header"),this.tablist.on("mousedown"+this.eventNamespace,"> li",function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).on("focus"+this.eventNamespace,".ui-tabs-anchor",function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this.tabs=this.tablist.find("> li:has(a[href])").attr({role:"tab",tabIndex:-1}),this._addClass(this.tabs,"ui-tabs-tab","ui-state-default"),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).attr({role:"presentation",tabIndex:-1}),this._addClass(this.anchors,"ui-tabs-anchor"),this.panels=t(),this.anchors.each(function(i,s){var n,o,a,r=t(s).uniqueId().attr("id"),h=t(s).closest("li"),l=h.attr("aria-controls");e._isLocal(s)?(n=s.hash,a=n.substring(1),o=e.element.find(e._sanitizeSelector(n))):(a=h.attr("aria-controls")||t({}).uniqueId()[0].id,n="#"+a,o=e.element.find(n),o.length||(o=e._createPanel(a),o.insertAfter(e.panels[i-1]||e.tablist)),o.attr("aria-live","polite")),o.length&&(e.panels=e.panels.add(o)),l&&h.data("ui-tabs-aria-controls",l),h.attr({"aria-controls":a,"aria-labelledby":r}),o.attr("aria-labelledby",r)}),this.panels.attr("role","tabpanel"),this._addClass(this.panels,"ui-tabs-panel","ui-widget-content"),i&&(this._off(i.not(this.tabs)),this._off(s.not(this.anchors)),this._off(n.not(this.panels)))},_getList:function(){return this.tablist||this.element.find("ol, ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).data("ui-tabs-destroy",!0)},_setOptionDisabled:function(e){var i,s,n;for(t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1),n=0;s=this.tabs[n];n++)i=t(s),e===!0||-1!==t.inArray(n,e)?(i.attr("aria-disabled","true"),this._addClass(i,null,"ui-state-disabled")):(i.removeAttr("aria-disabled"),this._removeClass(i,null,"ui-state-disabled"));this.options.disabled=e,this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,e===!0)},_setupEvents:function(e){var i={};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(!0,this.anchors,{click:function(t){t.preventDefault()}}),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n.closest("li"),a=o[0]===s[0],r=a&&i.collapsible,h=r?t():this._getPanelForTab(o),l=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:l,newTab:r?t():o,newPanel:h};e.preventDefault(),o.hasClass("ui-state-disabled")||o.hasClass("ui-tabs-loading")||this.running||a&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(o),this.active=a?t():o,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(o),e),this._toggle(e,c))},_toggle:function(e,i){function s(){o.running=!1,o._trigger("activate",e,i)}function n(){o._addClass(i.newTab.closest("li"),"ui-tabs-active","ui-state-active"),a.length&&o.options.show?o._show(a,o.options.show,s):(a.show(),s())}var o=this,a=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){o._removeClass(i.oldTab.closest("li"),"ui-tabs-active","ui-state-active"),n()}):(this._removeClass(i.oldTab.closest("li"),"ui-tabs-active","ui-state-active"),r.hide(),n()),r.attr("aria-hidden","true"),i.oldTab.attr({"aria-selected":"false","aria-expanded":"false"}),a.length&&r.length?i.oldTab.attr("tabIndex",-1):a.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),a.attr("aria-hidden","false"),i.newTab.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+t.ui.escapeSelector(e)+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.tablist.removeAttr("role").off(this.eventNamespace),this.anchors.removeAttr("role tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeAttr("role tabIndex aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(e){var i=this.options.disabled;i!==!1&&(void 0===e?i=!1:(e=this._getIndex(e),i=t.isArray(i)?t.map(i,function(t){return t!==e?t:null}):t.map(this.tabs,function(t,i){return i!==e?i:null})),this._setOptionDisabled(i))},disable:function(e){var i=this.options.disabled;if(i!==!0){if(void 0===e)i=!0;else{if(e=this._getIndex(e),-1!==t.inArray(e,i))return;i=t.isArray(i)?t.merge([e],i).sort():[e]}this._setOptionDisabled(i)}},load:function(e,i){e=this._getIndex(e);var s=this,n=this.tabs.eq(e),o=n.find(".ui-tabs-anchor"),a=this._getPanelForTab(n),r={tab:n,panel:a},h=function(t,e){"abort"===e&&s.panels.stop(!1,!0),s._removeClass(n,"ui-tabs-loading"),a.removeAttr("aria-busy"),t===s.xhr&&delete s.xhr};this._isLocal(o[0])||(this.xhr=t.ajax(this._ajaxSettings(o,i,r)),this.xhr&&"canceled"!==this.xhr.statusText&&(this._addClass(n,"ui-tabs-loading"),a.attr("aria-busy","true"),this.xhr.done(function(t,e,n){setTimeout(function(){a.html(t),s._trigger("load",i,r),h(n,e)},1)}).fail(function(t,e){setTimeout(function(){h(t,e)},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,o){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:o},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}}),t.uiBackCompat!==!1&&t.widget("ui.tabs",t.ui.tabs,{_processTabs:function(){this._superApply(arguments),this._addClass(this.tabs,"ui-tab")}}),t.ui.tabs,t.widget("ui.tooltip",{version:"1.12.0",options:{classes:{"ui-tooltip":"ui-corner-all ui-widget-shadow"},content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,track:!1,close:null,open:null},_addDescribedBy:function(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))},_removeDescribedBy:function(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.liveRegion=t("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this.disabledTitles=t([])},_setOption:function(e,i){var s=this;this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e.element)})},_setOptionDisabled:function(t){this[t?"_disable":"_enable"]()},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s.element[0],e.close(n,!0)}),this.disabledTitles=this.disabledTitles.add(this.element.find(this.options.items).addBack().filter(function(){var e=t(this);return e.is("[title]")?e.data("ui-tooltip-title",e.attr("title")).removeAttr("title"):void 0}))},_enable:function(){this.disabledTitles.each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))}),this.disabledTitles=t([])},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._registerCloseHandlers(e,s),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s||s.nodeType||s.jquery?this._open(e,t,s):(i=s.call(t[0],function(i){n._delay(function(){t.data("ui-tooltip-open")&&(e&&(e.type=o),this._open(e,t,i))})}),i&&this._open(e,t,i),void 0)},_open:function(e,i,s){function n(t){l.of=t,a.is(":hidden")||a.position(l)}var o,a,r,h,l=t.extend({},this.options.position);if(s){if(o=this._find(i))return o.tooltip.find(".ui-tooltip-content").html(s),void 0;i.is("[title]")&&(e&&"mouseover"===e.type?i.attr("title",""):i.removeAttr("title")),o=this._tooltip(i),a=o.tooltip,this._addDescribedBy(i,a.attr("id")),a.find(".ui-tooltip-content").html(s),this.liveRegion.children().hide(),h=t("<div>").html(a.find(".ui-tooltip-content").html()),h.removeAttr("name").find("[name]").removeAttr("name"),h.removeAttr("id").find("[id]").removeAttr("id"),h.appendTo(this.liveRegion),this.options.track&&e&&/^mouse/.test(e.type)?(this._on(this.document,{mousemove:n}),n(e)):a.position(t.extend({of:i},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.track&&this.options.show&&this.options.show.delay&&(r=this.delayedShow=setInterval(function(){a.is(":visible")&&(n(l.of),clearInterval(r))},t.fx.interval)),this._trigger("open",e,{tooltip:a})}},_registerCloseHandlers:function(e,i){var s={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var s=t.Event(e);s.currentTarget=i[0],this.close(s,!0)}}};i[0]!==this.element[0]&&(s.remove=function(){this._removeTooltip(this._find(i).tooltip)}),e&&"mouseover"!==e.type||(s.mouseleave="close"),e&&"focusin"!==e.type||(s.focusout="close"),this._on(!0,i,s)},close:function(e){var i,s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);return o?(i=o.tooltip,o.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),o.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),o.closing=!0,this._trigger("close",e,{tooltip:i}),o.hiding||(o.closing=!1)),void 0):(n.removeData("ui-tooltip-open"),void 0)},_tooltip:function(e){var i=t("<div>").attr("role","tooltip"),s=t("<div>").appendTo(i),n=i.uniqueId().attr("id");return this._addClass(s,"ui-tooltip-content"),this._addClass(i,"ui-tooltip","ui-widget ui-widget-content"),i.appendTo(this._appendTo(e)),this.tooltips[n]={element:e,tooltip:i}},_find:function(t){var e=t.data("ui-tooltip-id");return e?this.tooltips[e]:null},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_appendTo:function(t){var e=t.closest(".ui-front, dialog");return e.length||(e=this.document[0].body),e},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur"),o=s.element;n.target=n.currentTarget=o[0],e.close(n,!0),t("#"+i).remove(),o.data("ui-tooltip-title")&&(o.attr("title")||o.attr("title",o.data("ui-tooltip-title")),o.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}}),t.uiBackCompat!==!1&&t.widget("ui.tooltip",t.ui.tooltip,{options:{tooltipClass:null},_tooltip:function(){var t=this._superApply(arguments);return this.options.tooltipClass&&t.tooltip.addClass(this.options.tooltipClass),t}}),t.ui.tooltip});

if(typeof jQuery==="undefined"){throw new Error("jquery-confirm requires jQuery");}var jconfirm,Jconfirm;(function($,window){$.fn.confirm=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}$(this).each(function(){var $this=$(this);if($this.attr("jc-attached")){console.warn("jConfirm has already been attached to this element ",$this[0]);return;}$this.on("click",function(e){e.preventDefault();var jcOption=$.extend({},options);if($this.attr("data-title")){jcOption.title=$this.attr("data-title");}if($this.attr("data-content")){jcOption.content=$this.attr("data-content");}if(typeof jcOption.buttons=="undefined"){jcOption.buttons={};}jcOption["$target"]=$this;if($this.attr("href")&&Object.keys(jcOption.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});var firstBtn=Object.keys(buttons)[0];jcOption.buttons=buttons;jcOption.buttons[firstBtn].action=function(){location.href=$this.attr("href");};}jcOption.closeIcon=false;var instance=$.confirm(jcOption);});$this.attr("jc-attached",true);});return $(this);};$.confirm=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}if(typeof options.buttons!="object"){options.buttons={};}if(Object.keys(options.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});options.buttons=buttons;}return jconfirm(options);};$.alert=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false};}if(typeof options.buttons!="object"){options.buttons={};}if(Object.keys(options.buttons).length==0){var buttons=$.extend(true,{},jconfirm.pluginDefaults.defaultButtons,(jconfirm.defaults||{}).defaultButtons||{});var firstBtn=Object.keys(buttons)[0];options.buttons[firstBtn]=buttons[firstBtn];}return jconfirm(options);};$.dialog=function(options,option2){if(typeof options==="undefined"){options={};}if(typeof options==="string"){options={content:options,title:(option2)?option2:false,closeIcon:function(){}};}options.buttons={};if(typeof options.closeIcon=="undefined"){options.closeIcon=function(){};}options.confirmKeys=[13];return jconfirm(options);};jconfirm=function(options){if(typeof options==="undefined"){options={};}var pluginOptions=$.extend(true,{},jconfirm.pluginDefaults);if(jconfirm.defaults){pluginOptions=$.extend(true,pluginOptions,jconfirm.defaults);}pluginOptions=$.extend(true,{},pluginOptions,options);var instance=new Jconfirm(pluginOptions);jconfirm.instances.push(instance);return instance;};Jconfirm=function(options){$.extend(this,options);this._init();};Jconfirm.prototype={_init:function(){var that=this;if(!jconfirm.instances.length){jconfirm.lastFocused=$("body").find(":focus");}this._id=Math.round(Math.random()*99999);this.contentParsed=$(document.createElement("div"));if(!this.lazyOpen){setTimeout(function(){that.open();},0);}},_buildHTML:function(){var that=this;this._parseAnimation(this.animation,"o");this._parseAnimation(this.closeAnimation,"c");this._parseBgDismissAnimation(this.backgroundDismissAnimation);this._parseColumnClass(this.columnClass);this._parseTheme(this.theme);this._parseType(this.type);var template=$(this.template);template.find(".jconfirm-box").addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed);if(this.typeAnimated){template.find(".jconfirm-box").addClass("jconfirm-type-animated");}if(this.useBootstrap){template.find(".jc-bs3-row").addClass(this.bootstrapClasses.row);template.find(".jc-bs3-row").addClass("justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center");template.find(".jconfirm-box-container").addClass(this.columnClassParsed);if(this.containerFluid){template.find(".jc-bs3-container").addClass(this.bootstrapClasses.containerFluid);}else{template.find(".jc-bs3-container").addClass(this.bootstrapClasses.container);}}else{template.find(".jconfirm-box").css("width",this.boxWidth);}if(this.titleClass){template.find(".jconfirm-title-c").addClass(this.titleClass);}template.addClass(this.themeParsed);var ariaLabel="jconfirm-box"+this._id;template.find(".jconfirm-box").attr("aria-labelledby",ariaLabel).attr("tabindex",-1);template.find(".jconfirm-content").attr("id",ariaLabel);if(this.bgOpacity!==null){template.find(".jconfirm-bg").css("opacity",this.bgOpacity);}if(this.rtl){template.addClass("jconfirm-rtl");}this.$el=template.appendTo(this.container);this.$jconfirmBoxContainer=this.$el.find(".jconfirm-box-container");this.$jconfirmBox=this.$body=this.$el.find(".jconfirm-box");this.$jconfirmBg=this.$el.find(".jconfirm-bg");this.$title=this.$el.find(".jconfirm-title");this.$titleContainer=this.$el.find(".jconfirm-title-c");this.$content=this.$el.find("div.jconfirm-content");this.$contentPane=this.$el.find(".jconfirm-content-pane");this.$icon=this.$el.find(".jconfirm-icon-c");this.$closeIcon=this.$el.find(".jconfirm-closeIcon");this.$holder=this.$el.find(".jconfirm-holder");this.$btnc=this.$el.find(".jconfirm-buttons");this.$scrollPane=this.$el.find(".jconfirm-scrollpane");that.setStartingPoint();this._contentReady=$.Deferred();this._modalReady=$.Deferred();this.$holder.css({"padding-top":this.offsetTop,"padding-bottom":this.offsetBottom,});this.setTitle();this.setIcon();this._setButtons();this._parseContent();this.initDraggable();if(this.isAjax){this.showLoading(false);}$.when(this._contentReady,this._modalReady).then(function(){if(that.isAjaxLoading){setTimeout(function(){that.isAjaxLoading=false;that.setContent();that.setTitle();that.setIcon();setTimeout(function(){that.hideLoading(false);that._updateContentMaxHeight();},100);if(typeof that.onContentReady==="function"){that.onContentReady();}},50);}else{that._updateContentMaxHeight();that.setTitle();that.setIcon();if(typeof that.onContentReady==="function"){that.onContentReady();}}if(that.autoClose){that._startCountDown();}});this._watchContent();if(this.animation==="none"){this.animationSpeed=1;this.animationBounce=1;}this.$body.css(this._getCSS(this.animationSpeed,this.animationBounce));this.$contentPane.css(this._getCSS(this.animationSpeed,1));this.$jconfirmBg.css(this._getCSS(this.animationSpeed,1));this.$jconfirmBoxContainer.css(this._getCSS(this.animationSpeed,1));},_typePrefix:"jconfirm-type-",typeParsed:"",_parseType:function(type){this.typeParsed=this._typePrefix+type;},setType:function(type){var oldClass=this.typeParsed;this._parseType(type);this.$jconfirmBox.removeClass(oldClass).addClass(this.typeParsed);},themeParsed:"",_themePrefix:"jconfirm-",setTheme:function(theme){var previous=this.theme;this.theme=theme||this.theme;this._parseTheme(this.theme);if(previous){this.$el.removeClass(previous);}this.$el.addClass(this.themeParsed);this.theme=theme;},_parseTheme:function(theme){var that=this;theme=theme.split(",");$.each(theme,function(k,a){if(a.indexOf(that._themePrefix)===-1){theme[k]=that._themePrefix+$.trim(a);}});this.themeParsed=theme.join(" ").toLowerCase();},backgroundDismissAnimationParsed:"",_bgDismissPrefix:"jconfirm-hilight-",_parseBgDismissAnimation:function(bgDismissAnimation){var animation=bgDismissAnimation.split(",");var that=this;$.each(animation,function(k,a){if(a.indexOf(that._bgDismissPrefix)===-1){animation[k]=that._bgDismissPrefix+$.trim(a);}});this.backgroundDismissAnimationParsed=animation.join(" ").toLowerCase();},animationParsed:"",closeAnimationParsed:"",_animationPrefix:"jconfirm-animation-",setAnimation:function(animation){this.animation=animation||this.animation;this._parseAnimation(this.animation,"o");},_parseAnimation:function(animation,which){which=which||"o";var animations=animation.split(",");var that=this;$.each(animations,function(k,a){if(a.indexOf(that._animationPrefix)===-1){animations[k]=that._animationPrefix+$.trim(a);}});var a_string=animations.join(" ").toLowerCase();if(which==="o"){this.animationParsed=a_string;}else{this.closeAnimationParsed=a_string;}return a_string;},setCloseAnimation:function(closeAnimation){this.closeAnimation=closeAnimation||this.closeAnimation;this._parseAnimation(this.closeAnimation,"c");},setAnimationSpeed:function(speed){this.animationSpeed=speed||this.animationSpeed;},columnClassParsed:"",setColumnClass:function(colClass){if(!this.useBootstrap){console.warn("cannot set columnClass, useBootstrap is set to false");return;}this.columnClass=colClass||this.columnClass;this._parseColumnClass(this.columnClass);this.$jconfirmBoxContainer.addClass(this.columnClassParsed);},_updateContentMaxHeight:function(){var height=$(window).height()-(this.$jconfirmBox.outerHeight()-this.$contentPane.outerHeight())-(this.offsetTop+this.offsetBottom);this.$contentPane.css({"max-height":height+"px"});},setBoxWidth:function(width){if(this.useBootstrap){console.warn("cannot set boxWidth, useBootstrap is set to true");return;}this.boxWidth=width;this.$jconfirmBox.css("width",width);},_parseColumnClass:function(colClass){colClass=colClass.toLowerCase();var p;switch(colClass){case"xl":case"xlarge":p="col-md-12";break;case"l":case"large":p="col-md-8 col-md-offset-2";break;case"m":case"medium":p="col-md-6 col-md-offset-3";break;case"s":case"small":p="col-md-4 col-md-offset-4";break;case"xs":case"xsmall":p="col-md-2 col-md-offset-5";break;default:p=colClass;}this.columnClassParsed=p;},initDraggable:function(){var that=this;var $t=this.$titleContainer;this.resetDrag();if(this.draggable){$t.on("mousedown",function(e){$t.addClass("jconfirm-hand");that.mouseX=e.clientX;that.mouseY=e.clientY;that.isDrag=true;});$(window).on("mousemove."+this._id,function(e){if(that.isDrag){that.movingX=e.clientX-that.mouseX+that.initialX;that.movingY=e.clientY-that.mouseY+that.initialY;that.setDrag();}});$(window).on("mouseup."+this._id,function(){$t.removeClass("jconfirm-hand");if(that.isDrag){that.isDrag=false;that.initialX=that.movingX;that.initialY=that.movingY;}});}},resetDrag:function(){this.isDrag=false;this.initialX=0;this.initialY=0;this.movingX=0;this.movingY=0;this.mouseX=0;this.mouseY=0;this.$jconfirmBoxContainer.css("transform","translate("+0+"px, "+0+"px)");},setDrag:function(){if(!this.draggable){return;}this.alignMiddle=false;var boxWidth=this.$jconfirmBox.outerWidth();var boxHeight=this.$jconfirmBox.outerHeight();var windowWidth=$(window).width();var windowHeight=$(window).height();var that=this;var dragUpdate=1;if(that.movingX%dragUpdate===0||that.movingY%dragUpdate===0){if(that.dragWindowBorder){var leftDistance=(windowWidth/2)-boxWidth/2;var topDistance=(windowHeight/2)-boxHeight/2;topDistance-=that.dragWindowGap;leftDistance-=that.dragWindowGap;if(leftDistance+that.movingX<0){that.movingX=-leftDistance;}else{if(leftDistance-that.movingX<0){that.movingX=leftDistance;}}if(topDistance+that.movingY<0){that.movingY=-topDistance;}else{if(topDistance-that.movingY<0){that.movingY=topDistance;}}}that.$jconfirmBoxContainer.css("transform","translate("+that.movingX+"px, "+that.movingY+"px)");}},_scrollTop:function(){if(typeof pageYOffset!=="undefined"){return pageYOffset;}else{var B=document.body;var D=document.documentElement;D=(D.clientHeight)?D:B;return D.scrollTop;}},_watchContent:function(){var that=this;if(this._timer){clearInterval(this._timer);}var prevContentHeight=0;this._timer=setInterval(function(){if(that.smoothContent){var contentHeight=that.$content.outerHeight()||0;if(contentHeight!==prevContentHeight){that.$contentPane.css({height:contentHeight}).scrollTop(0);prevContentHeight=contentHeight;}var wh=$(window).height();var total=that.offsetTop+that.offsetBottom+that.$jconfirmBox.height()-that.$contentPane.height()+that.$content.height();if(total<wh){that.$contentPane.addClass("no-scroll");}else{that.$contentPane.removeClass("no-scroll");}}},this.watchInterval);},_overflowClass:"jconfirm-overflow",_hilightAnimating:false,highlight:function(){this.hiLightModal();},hiLightModal:function(){var that=this;if(this._hilightAnimating){return;}that.$body.addClass("hilight");var duration=parseFloat(that.$body.css("animation-duration"))||2;this._hilightAnimating=true;setTimeout(function(){that._hilightAnimating=false;that.$body.removeClass("hilight");},duration*1000);},_bindEvents:function(){var that=this;this.boxClicked=false;this.$scrollPane.click(function(e){if(!that.boxClicked){var buttonName=false;var shouldClose=false;var str;if(typeof that.backgroundDismiss=="function"){str=that.backgroundDismiss();}else{str=that.backgroundDismiss;}if(typeof str=="string"&&typeof that.buttons[str]!="undefined"){buttonName=str;shouldClose=false;}else{if(typeof str=="undefined"||!!(str)==true){shouldClose=true;}else{shouldClose=false;}}if(buttonName){var btnResponse=that.buttons[buttonName].action.apply(that);shouldClose=(typeof btnResponse=="undefined")||!!(btnResponse);}if(shouldClose){that.close();}else{that.hiLightModal();}}that.boxClicked=false;});this.$jconfirmBox.click(function(e){that.boxClicked=true;});var isKeyDown=false;$(window).on("jcKeyDown."+that._id,function(e){if(!isKeyDown){isKeyDown=true;}});$(window).on("keyup."+that._id,function(e){if(isKeyDown){that.reactOnKey(e);isKeyDown=false;}});$(window).on("resize."+this._id,function(){that._updateContentMaxHeight();setTimeout(function(){that.resetDrag();},100);});},_cubic_bezier:"0.36, 0.55, 0.19",_getCSS:function(speed,bounce){return{"-webkit-transition-duration":speed/1000+"s","transition-duration":speed/1000+"s","-webkit-transition-timing-function":"cubic-bezier("+this._cubic_bezier+", "+bounce+")","transition-timing-function":"cubic-bezier("+this._cubic_bezier+", "+bounce+")"};},_setButtons:function(){var that=this;var total_buttons=0;if(typeof this.buttons!=="object"){this.buttons={};}$.each(this.buttons,function(key,button){total_buttons+=1;if(typeof button==="function"){that.buttons[key]=button={action:button};}that.buttons[key].text=button.text||key;that.buttons[key].btnClass=button.btnClass||"btn-default";that.buttons[key].action=button.action||function(){};that.buttons[key].keys=button.keys||[];that.buttons[key].isHidden=button.isHidden||false;that.buttons[key].isDisabled=button.isDisabled||false;$.each(that.buttons[key].keys,function(i,a){that.buttons[key].keys[i]=a.toLowerCase();});var button_element=$('<button type="button" class="btn"></button>').html(that.buttons[key].text).addClass(that.buttons[key].btnClass).prop("disabled",that.buttons[key].isDisabled).css("display",that.buttons[key].isHidden?"none":"").click(function(e){e.preventDefault();var res=that.buttons[key].action.apply(that,[that.buttons[key]]);that.onAction.apply(that,[key,that.buttons[key]]);that._stopCountDown();if(typeof res==="undefined"||res){that.close();}});that.buttons[key].el=button_element;that.buttons[key].setText=function(text){button_element.html(text);};that.buttons[key].addClass=function(className){button_element.addClass(className);};that.buttons[key].removeClass=function(className){button_element.removeClass(className);};that.buttons[key].disable=function(){that.buttons[key].isDisabled=true;button_element.prop("disabled",true);};that.buttons[key].enable=function(){that.buttons[key].isDisabled=false;button_element.prop("disabled",false);};that.buttons[key].show=function(){that.buttons[key].isHidden=false;button_element.css("display","");};that.buttons[key].hide=function(){that.buttons[key].isHidden=true;button_element.css("display","none");};that["$_"+key]=that["$$"+key]=button_element;that.$btnc.append(button_element);});if(total_buttons===0){this.$btnc.hide();}if(this.closeIcon===null&&total_buttons===0){this.closeIcon=true;}if(this.closeIcon){if(this.closeIconClass){var closeHtml='<i class="'+this.closeIconClass+'"></i>';this.$closeIcon.html(closeHtml);}this.$closeIcon.click(function(e){e.preventDefault();var buttonName=false;var shouldClose=false;var str;if(typeof that.closeIcon=="function"){str=that.closeIcon();}else{str=that.closeIcon;}if(typeof str=="string"&&typeof that.buttons[str]!="undefined"){buttonName=str;shouldClose=false;}else{if(typeof str=="undefined"||!!(str)==true){shouldClose=true;}else{shouldClose=false;}}if(buttonName){var btnResponse=that.buttons[buttonName].action.apply(that);shouldClose=(typeof btnResponse=="undefined")||!!(btnResponse);}if(shouldClose){that.close();}});this.$closeIcon.show();}else{this.$closeIcon.hide();}},setTitle:function(string,force){force=force||false;if(typeof string!=="undefined"){if(typeof string=="string"){this.title=string;}else{if(typeof string=="function"){if(typeof string.promise=="function"){console.error("Promise was returned from title function, this is not supported.");}var response=string();if(typeof response=="string"){this.title=response;}else{this.title=false;}}else{this.title=false;}}}if(this.isAjaxLoading&&!force){return;}this.$title.html(this.title||"");this.updateTitleContainer();},setIcon:function(iconClass,force){force=force||false;if(typeof iconClass!=="undefined"){if(typeof iconClass=="string"){this.icon=iconClass;}else{if(typeof iconClass==="function"){var response=iconClass();if(typeof response=="string"){this.icon=response;}else{this.icon=false;}}else{this.icon=false;}}}if(this.isAjaxLoading&&!force){return;}this.$icon.html(this.icon?'<i class="'+this.icon+'"></i>':"");this.updateTitleContainer();},updateTitleContainer:function(){if(!this.title&&!this.icon){this.$titleContainer.hide();}else{this.$titleContainer.show();}},setContentPrepend:function(content,force){if(!content){return;}this.contentParsed.prepend(content);},setContentAppend:function(content){if(!content){return;}this.contentParsed.append(content);},setContent:function(content,force){force=!!force;var that=this;if(content){this.contentParsed.html("").append(content);}if(this.isAjaxLoading&&!force){return;}this.$content.html("");this.$content.append(this.contentParsed);setTimeout(function(){that.$body.find("input[autofocus]:visible:first").focus();},100);},loadingSpinner:false,showLoading:function(disableButtons){this.loadingSpinner=true;this.$jconfirmBox.addClass("loading");if(disableButtons){this.$btnc.find("button").prop("disabled",true);}},hideLoading:function(enableButtons){this.loadingSpinner=false;this.$jconfirmBox.removeClass("loading");if(enableButtons){this.$btnc.find("button").prop("disabled",false);}},ajaxResponse:false,contentParsed:"",isAjax:false,isAjaxLoading:false,_parseContent:function(){var that=this;var e="&nbsp;";if(typeof this.content=="function"){var res=this.content.apply(this);if(typeof res=="string"){this.content=res;}else{if(typeof res=="object"&&typeof res.always=="function"){this.isAjax=true;this.isAjaxLoading=true;res.always(function(data,status,xhr){that.ajaxResponse={data:data,status:status,xhr:xhr};that._contentReady.resolve(data,status,xhr);if(typeof that.contentLoaded=="function"){that.contentLoaded(data,status,xhr);}});this.content=e;}else{this.content=e;}}}if(typeof this.content=="string"&&this.content.substr(0,4).toLowerCase()==="url:"){this.isAjax=true;this.isAjaxLoading=true;var u=this.content.substring(4,this.content.length);$.get(u).done(function(html){that.contentParsed.html(html);}).always(function(data,status,xhr){that.ajaxResponse={data:data,status:status,xhr:xhr};that._contentReady.resolve(data,status,xhr);if(typeof that.contentLoaded=="function"){that.contentLoaded(data,status,xhr);}});}if(!this.content){this.content=e;}if(!this.isAjax){this.contentParsed.html(this.content);this.setContent();that._contentReady.resolve();}},_stopCountDown:function(){clearInterval(this.autoCloseInterval);if(this.$cd){this.$cd.remove();}},_startCountDown:function(){var that=this;var opt=this.autoClose.split("|");if(opt.length!==2){console.error("Invalid option for autoClose. example 'close|10000'");return false;}var button_key=opt[0];var time=parseInt(opt[1]);if(typeof this.buttons[button_key]==="undefined"){console.error("Invalid button key '"+button_key+"' for autoClose");return false;}var seconds=Math.ceil(time/1000);this.$cd=$('<span class="countdown"> ('+seconds+")</span>").appendTo(this["$_"+button_key]);this.autoCloseInterval=setInterval(function(){that.$cd.html(" ("+(seconds-=1)+") ");if(seconds<=0){that["$$"+button_key].trigger("click");that._stopCountDown();}},1000);},_getKey:function(key){switch(key){case 192:return"tilde";case 13:return"enter";case 16:return"shift";case 9:return"tab";case 20:return"capslock";case 17:return"ctrl";case 91:return"win";case 18:return"alt";case 27:return"esc";case 32:return"space";}var initial=String.fromCharCode(key);if(/^[A-z0-9]+$/.test(initial)){return initial.toLowerCase();}else{return false;}},reactOnKey:function(e){var that=this;var a=$(".jconfirm");if(a.eq(a.length-1)[0]!==this.$el[0]){return false;}var key=e.which;if(this.$content.find(":input").is(":focus")&&/13|32/.test(key)){return false;}var keyChar=this._getKey(key);if(keyChar==="esc"&&this.escapeKey){if(this.escapeKey===true){this.$scrollPane.trigger("click");}else{if(typeof this.escapeKey==="string"||typeof this.escapeKey==="function"){var buttonKey;if(typeof this.escapeKey==="function"){buttonKey=this.escapeKey();}else{buttonKey=this.escapeKey;}if(buttonKey){if(typeof this.buttons[buttonKey]==="undefined"){console.warn("Invalid escapeKey, no buttons found with key "+buttonKey);}else{this["$_"+buttonKey].trigger("click");}}}}}$.each(this.buttons,function(key,button){if(button.keys.indexOf(keyChar)!=-1){that["$_"+key].trigger("click");}});},setDialogCenter:function(){console.info("setDialogCenter is deprecated, dialogs are centered with CSS3 tables");},_unwatchContent:function(){clearInterval(this._timer);},close:function(){var that=this;if(typeof this.onClose==="function"){this.onClose();}this._unwatchContent();$(window).unbind("resize."+this._id);$(window).unbind("keyup."+this._id);$(window).unbind("jcKeyDown."+this._id);if(this.draggable){$(window).unbind("mousemove."+this._id);$(window).unbind("mouseup."+this._id);this.$titleContainer.unbind("mousedown");}that.$el.removeClass(that.loadedClass);$("body").removeClass("jconfirm-no-scroll-"+that._id);that.$jconfirmBoxContainer.removeClass("jconfirm-no-transition");setTimeout(function(){that.$body.addClass(that.closeAnimationParsed);that.$jconfirmBg.addClass("jconfirm-bg-h");var closeTimer=(that.closeAnimation==="none")?1:that.animationSpeed;setTimeout(function(){that.$el.remove();var l=jconfirm.instances;var i=jconfirm.instances.length-1;for(i;i>=0;i--){if(jconfirm.instances[i]._id===that._id){jconfirm.instances.splice(i,1);}}if(!jconfirm.instances.length){if(that.scrollToPreviousElement&&jconfirm.lastFocused&&jconfirm.lastFocused.length&&$.contains(document,jconfirm.lastFocused[0])){var $lf=jconfirm.lastFocused;if(that.scrollToPreviousElementAnimate){var st=$(window).scrollTop();var ot=jconfirm.lastFocused.offset().top;var wh=$(window).height();if(!(ot>st&&ot<(st+wh))){var scrollTo=(ot-Math.round((wh/3)));$("html, body").animate({scrollTop:scrollTo},that.animationSpeed,"swing",function(){$lf.focus();});}else{$lf.focus();}}else{$lf.focus();}jconfirm.lastFocused=false;}}if(typeof that.onDestroy==="function"){that.onDestroy();}},closeTimer*0.4);},50);return true;},open:function(){if(this.isOpen()){return false;}this._buildHTML();this._bindEvents();this._open();return true;},setStartingPoint:function(){var el=false;if(this.animateFromElement!==true&&this.animateFromElement){el=this.animateFromElement;jconfirm.lastClicked=false;}else{if(jconfirm.lastClicked&&this.animateFromElement===true){el=jconfirm.lastClicked;jconfirm.lastClicked=false;}else{return false;}}if(!el){return false;}var offset=el.offset();var iTop=el.outerHeight()/2;var iLeft=el.outerWidth()/2;iTop-=this.$jconfirmBox.outerHeight()/2;iLeft-=this.$jconfirmBox.outerWidth()/2;var sourceTop=offset.top+iTop;sourceTop=sourceTop-this._scrollTop();var sourceLeft=offset.left+iLeft;var wh=$(window).height()/2;var ww=$(window).width()/2;var targetH=wh-this.$jconfirmBox.outerHeight()/2;var targetW=ww-this.$jconfirmBox.outerWidth()/2;sourceTop-=targetH;sourceLeft-=targetW;if(Math.abs(sourceTop)>wh||Math.abs(sourceLeft)>ww){return false;}this.$jconfirmBoxContainer.css("transform","translate("+sourceLeft+"px, "+sourceTop+"px)");},_open:function(){var that=this;if(typeof that.onOpenBefore==="function"){that.onOpenBefore();}this.$body.removeClass(this.animationParsed);this.$jconfirmBg.removeClass("jconfirm-bg-h");this.$body.focus();that.$jconfirmBoxContainer.css("transform","translate("+0+"px, "+0+"px)");setTimeout(function(){that.$body.css(that._getCSS(that.animationSpeed,1));that.$body.css({"transition-property":that.$body.css("transition-property")+", margin"});that.$jconfirmBoxContainer.addClass("jconfirm-no-transition");that._modalReady.resolve();if(typeof that.onOpen==="function"){that.onOpen();}that.$el.addClass(that.loadedClass);},this.animationSpeed);},loadedClass:"jconfirm-open",isClosed:function(){return !this.$el||this.$el.css("display")==="";},isOpen:function(){return !this.isClosed();},toggle:function(){if(!this.isOpen()){this.open();}else{this.close();}}};jconfirm.instances=[];jconfirm.lastFocused=false;jconfirm.pluginDefaults={template:'<div class="jconfirm"><div class="jconfirm-bg jconfirm-bg-h"></div><div class="jconfirm-scrollpane"><div class="jconfirm-row"><div class="jconfirm-cell"><div class="jconfirm-holder"><div class="jc-bs3-container"><div class="jc-bs3-row"><div class="jconfirm-box-container jconfirm-animated"><div class="jconfirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1"><div class="jconfirm-closeIcon">&times;</div><div class="jconfirm-title-c"><span class="jconfirm-icon-c"></span><span class="jconfirm-title"></span></div><div class="jconfirm-content-pane"><div class="jconfirm-content"></div></div><div class="jconfirm-buttons"></div><div class="jconfirm-clear"></div></div></div></div></div></div></div></div></div></div>',title:"Hello",titleClass:"",type:"default",typeAnimated:true,draggable:true,dragWindowGap:15,dragWindowBorder:true,animateFromElement:true,alignMiddle:true,smoothContent:true,content:"Are you sure to continue?",buttons:{},defaultButtons:{ok:{action:function(){}},close:{action:function(){}}},contentLoaded:function(){},icon:"",lazyOpen:false,bgOpacity:null,theme:"light",animation:"scale",closeAnimation:"scale",animationSpeed:400,animationBounce:1,escapeKey:true,rtl:false,container:"body",containerFluid:false,backgroundDismiss:false,backgroundDismissAnimation:"shake",autoClose:false,closeIcon:null,closeIconClass:false,watchInterval:100,columnClass:"col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1",boxWidth:"50%",scrollToPreviousElement:true,scrollToPreviousElementAnimate:true,useBootstrap:true,offsetTop:40,offsetBottom:40,bootstrapClasses:{container:"container",containerFluid:"container-fluid",row:"row"},onContentReady:function(){},onOpenBefore:function(){},onOpen:function(){},onClose:function(){},onDestroy:function(){},onAction:function(){}};var keyDown=false;$(window).on("keydown",function(e){if(!keyDown){var $target=$(e.target);var pass=false;if($target.closest(".jconfirm-box").length){pass=true;}if(pass){$(window).trigger("jcKeyDown");}keyDown=true;}});$(window).on("keyup",function(){keyDown=false;});jconfirm.lastClicked=false;$(document).on("mousedown","button, a",function(){jconfirm.lastClicked=$(this);});})(jQuery,window);

var nearestEnemy,nearestEnemyAngle,isEnemyNear;
var primary,secondary,foodType,wallType,spikeType,millType,mineType,boostType,turretType,spawnpadType,bait;
var autoaim = false;
var oldHat,oldAcc,enemiesNear;
var normalHat,normalAcc;
var ws,msgpack5 = msgpack;
let myPlayer = {id: null,x: null,y: null,dir: null,object: null,weapon: null,clan: null,isLeader: null,hat: null,accessory: null,isSkull: null};
let mouseX,mouseY,width,height;
function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}
function acc(id) {
    doNewSend(["13c", [1, id, 1]]);
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}
function hat(id) {
    doNewSend(["13c", [1, id, 0]]);
    doNewSend(["13c", [0, id, 0]]);
}
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}
function update() {
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }
    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }
    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }
    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }
    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }
    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }
    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }
    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }
    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }
    for (let i=39;i<40;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            baitType = i - 16;
        }
    }
    spawnpadType = 36;
}
var playerClan=[];
function normal() {
    hat(normalHat);
    acc(normalAcc);
}
function isElementVisible(e) {
    return (e.offsetParent !== null);
}
function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}
function aim(x, y){
     var cvs = document.getElementById("gameCanvas");
     cvs.dispatchEvent(new MouseEvent("mousemove", {clientX: x,clientY: y}));
}
var traps=[];
document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
     this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        document.ws = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};
function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}
function handleMessage(m){
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
      data = temp;
    }
    let packet = data[0];
    if(!data) {return};
    if(packet === "io-init") {
            let cvs = document.getElementById("gameCanvas");
            width = cvs.clientWidth;
            height = cvs.clientHeight;
            $(window).resize(function() {
                width = cvs.clientWidth;
                height = cvs.clientHeight;
            });
            cvs.addEventListener("mousemove", e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }
    if (packet == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
    if(packet == "6"){
        for(let i = 0; i < data[1].length / 8; i++){
            let ObjectData = data[1].slice(8*i, 8*i+8);
            if (ObjectData[6] == 15 && ObjectData[7] != myPlayer.id && ((playerClan[ObjectData[7]] != myPlayer.clan && myPlayer.clan != null) || (myPlayer.clan == null))) {
                if(Math.sqrt(Math.pow((myPlayer.y-ObjectData[2]), 2) + Math.pow((myPlayer.x-ObjectData[1]), 2)) < 90){
                    chat("");
                    for (let i=0;i<15;i++){
                        place(millType, nearestEnemyAngle+toRad(30*i));
                    }
                }
            }
        }
    }
    if(packet == "12") {
        if(autoreplace==true) {
            for(let i=0;i<26;i++) {
                if(nearestEnemy && dist(nearestEnemy,myPlayer) > 200) {
                    place(boostType, nearestEnemyAngle+toRad(30*i));
                    place(boostType, nearestEnemyAngle-toRad(30*i));
                }else {
                    place(spikeType, nearestEnemyAngle+toRad(30*i));
                    place(spikeType, nearestEnemyAngle-toRad(30*i));
                }
            }
        }
    }
    if (packet == "33") {
        enemiesNear = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            playerClan[playerInfo[0]] = playerInfo[7];
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }

    isEnemyNear = false;
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }
    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 300) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 7 && myPlayer.hat != 53) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
	        normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    var heal;
    if(!nearestEnemy) {
        heal=(window.pingTime <=140)?140-window.pingTime:0;
    }
    if(packet == "9" && data[1] == "kills"){
        doNewSend(["ch", ["+1 kill ez"]]);
    }
    if(nearestEnemy) {
        if(nearestEnemy[5] == 7) {
            heal=(window.pingTime <=100)?100-window.pingTime:0;
        }else {
            if(myPlayer.weapon == 7) {
                heal=(window.pingTime <=100)?100-window.pingTime:0;
            }else {
                heal=(window.pingTime <=140)?140-window.pingTime:0;
            }
        }
    }
    var antiheal=(myPlayer.hat == 6)?56:41;
    if(packet == "h" && data[1] == myPlayer.id) {
        if(data[2] == (75 || 81) && data[2] > 0 && nearestEnemy && nearestEnemy[9]==53 &&dist(nearestEnemy, myPlayer) < 400) {
            place(foodType);
            place(foodType);
            place(foodType);
            chat("");
        }
        if(data[2] == (60 || 56 || 53 || 55 || 47 || 50) && data[2] > 0 && myPlayer.hat != 6 && isEnemyNear==true) {
            place(foodType);
            place(foodType);
            place(foodType);
            chat("");
        }
        if(data[2] < antiheal && data[2] > 0) {
            place(foodType);
            place(foodType);
            place(foodType);
            chat("");
        }
        if(data[2] < 100 && data[2] > 0) {
            setTimeout( () => {
                place(foodType);
                place(foodType);
                place(foodType);
            }, heal);

        }
    }
    update();
}
function chat(e) {
    doNewSend(["ch",[e]]);
}
var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if(_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if(!_isKeyDown){
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };
}
var qholder = repeater(81, () => {
    place(foodType, nearestEnemyAngle);
    place(foodType, nearestEnemyAngle);
}, 0);
var tp = repeater(72, () => {
    place(turretType);
    place(turretType);
    chat("");
}, 0);
var mill = repeater(78, () => {
    place(millType,Math.atan2(mouseY - height / 2, mouseX - width / 2)+toRad(67))
    place(millType,Math.atan2(mouseY - height / 2, mouseX - width / 2)-toRad(67))
    place(millType);
    place(millType,Math.atan2(mouseY - height / 2, mouseX - width / 2)+toRad(67))
    place(millType,Math.atan2(mouseY - height / 2, mouseX - width / 2)-toRad(67))
    place(millType);
    move(180);
    chat("");
}, 140);
var trap = repeater(70, () => {
    place(boostType);place(boostType);place(boostType);
    place(boostType);place(boostType);place(boostType);
    place(boostType);place(boostType);place(boostType);
}, 0);
var spike = repeater(86, () => {
    place(spikeType);place(spikeType);place(spikeType);
    place(spikeType);place(spikeType);place(spikeType);
    place(spikeType);place(spikeType);place(spikeType);
}, 0);
var autoreplace=false;
function move(e) {
    doNewSend(["33",[Math.atan2(mouseY - height / 2, mouseX - width / 2)+toRad(e)]]);
}
function UsePrimary() {
    doNewSend(["5", [primary,true]]);
}
function UseSecondary() {
    doNewSend(["5", [secondary,true]]);
}
function chose(e) {
    doNewSend(["6", [e]]);
}
document.addEventListener('keyup', (e)=>{
    qholder.stop(e.keyCode);mill.stop(e.keyCode);trap.stop(e.keyCode);tp.stop(e.keyCode);spike.stop(e.keyCode);
})
document.addEventListener('keydown', (e)=>{
    mill.start(e.keyCode);qholder.start(e.keyCode);trap.start(e.keyCode);tp.start(e.keyCode);spike.start(e.keyCode);
    if(e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(40);
        acc(21);
        chat("");
    }
    if(e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(7);
        acc(13);chat("");
        setTimeout(() => {
            normal();
        }, 1000);
    }
    if(e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        acc(11);
        if (myPlayer.y < 2400){
            hat(15);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(31);
        } else {
            hat(12);
        }
        chat("");
        doNewSend(["5", [primary, true]]);
        doNewSend(["c", [0]]);
    }
           if(e.keyCode == 8 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
        autosecondary = true;
        doNewSend(["ch", ["Teddy Mod"]]);
        }, 700)
   }
       if(e.keyCode == 8 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
        doNewSend(["ch", ["selfcoded"]]);
        autosecondary = true;
        }, 1300)
   }
       if(e.keyCode == 8 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
        doNewSend(["ch", ["By :BrownTeddy"]]);
        autosecondary = false;
        autoprimary = true;
        autosecondary = false;
        autoprimary = true;
        }, 1900)
   }
           if(e.keyCode == 8 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
        doNewSend(["ch", ["Discord:BrownTeddy#6867"]]);
        autoprimary = false;
        }, 2500)
   }
    if(e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if(autoreplace==false) {
            chat("AutoReplace : True");
            autoreplace=true;
        }else {
            chat("AutoReplace : False");
            autoreplace=false;
        }
    }
            if(e.keyCode == 75 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        hat(6);
        acc(21);
    }
     if(e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        acc(53);
        acc(19);
    }
    if(e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        hat(56);
        acc(19);
    }
        if(e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        hat(22);
        acc(19);
    }
        if(e.keyCode == 45 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        hat(20);
        acc(19);
    }
         if(e.keyCode == 46 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");
        hat(1);
        acc(19);
    }
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if(secondary == 9) {
            chat("Bye");autoaim=true;//
            UseSecondary();UseSecondary();chose(38);
            doNewSend(["7",[1]]);
            hat(53);
            setTimeout(() => {
                chose(12);UseSecondary();hat(1);
            }, 50);
            setTimeout(() => {
                chose(15);UseSecondary();hat(1);
            }, 80);
            setTimeout(() => {
                autoaim=false;
                doNewSend(["7",[1]]);
                hat(6);
                acc(0);
                acc(21);
            }, 180);
        }else {
            chat("");
        }
    }
    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        chat("");doNewSend(["7",[1]]);
        UsePrimary();UsePrimary();autoaim=true;
        hat(7);
        acc(0);
        acc(18);
        place(spikeType,nearestEnemyAngle+toRad(45));
        place(spikeType,nearestEnemyAngle-toRad(45));
        place(spikeType,nearestEnemyAngle);
        setTimeout(()=>{
            hat(53);
        },35);
        setTimeout(() => {
            autoaim=false;hat(6);acc(21);
            doNewSend(["7",[1]]);
        }, 130);
    }
    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["7",[1]]);
        if(autolongmusk==true) {
            LongSwordMusket();
        }
        hat(7);autoaim=true;
        acc(0);
        chat("");
        acc(18);UsePrimary();
        setTimeout(() => {
            hat(53);UseSecondary();
            acc(21);
        }, 50);
        setTimeout(() => {
            hat(6);
            acc(0);
            acc(21);
            hat(52);
            hat(6);
            hat(12);
            acc(11);
            autoaim=false;UsePrimary();
            doNewSend(["7",[1]]);
        }, 240);
    }
})
var autolongmusk=false;
function LongSwordMusket() {
    doNewSend(["6", [7]]);doNewSend(["6", [17]]);doNewSend(["6", [31]]);doNewSend(["6", [23]]);doNewSend(["6", [10]]);doNewSend(["6", [38]]);doNewSend(["6", [4]]);doNewSend(["6", [15]]);
}
const pingDisplay = $("#pingDisplay");
pingDisplay.css("top", "20px");
pingDisplay.css("font-size", "35px");
pingDisplay.css("display", "block");
document.getElementById("loadingText").innerHTML = "⋆ᶳᶬ↬";
document.getElementById("storeHolder").style = "height: 500px; width: 435px;";
document.getElementById('gameName').style = "text-shadow: #ed153e 2px 2px 40px;";
document.getElementById('diedText').style = "text-shadow: #4c4c4c 2px 2px 40px;";
document.getElementById('loadingText').style = "text-shadow: #ed153e 2px 2px 40px;";
document.getElementById("storeButton").innerHTML = "🛒";
document.getElementById('chatButton').innerHTML = "💬";
document.getElementById('allianceButton').innerHTML = "👋";
$("body").append(pingDisplay);
document.getElementById('gameName').innerHTML = '   Teddy Mod     ';
document.getElementById("gameName").style.color = "#ed153e";
document.getElementById('diedText').innerHTML = '☠ 🇼🇦🇸🇹🇪🇩 ☠';
document.getElementById('diedText').style.color = '#ed153e';
$("#consentBlock").css({display: "none"});
$("#youtuberOf").css({display: "none"});
$("#mapDisplay").css({background: `url('https://media4.giphy.com/media/oRtsHKizaCoHRbcDIn/giphy.gif?cid=790b76118434d0754c7cd673e82b80a96aafc13d3feab22a&rid=giphy.gif&ct=g')`});
$("#enterGame").click( () => {
    selectSkinColor("3")
});
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
window.onbeforeunload = null;
setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
        doNewSend(["2", [nearestEnemyAngle]]);
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);
setInterval(() => {
    if(oldHat != normalHat) {
        hat(normalHat);console.log("Tried. - Hat")
    }
    if(oldAcc != normalAcc) {
        acc(normalAcc);console.log("Tried. - Acc")
    }
    oldHat = normalHat;oldAcc = normalAcc
}, 25);
setInterval(() => {
    if(myPlayer.hat == 45) {
        chat("Auto ANTI JOKER");
        hat(13);
        acc(13);
        if(nearestEnemy) {
            for(let i=0;i<36;i++) {
                if(turretType==22) {
                    place(turretType,+toRad(20*i));
                }
            }
        }
    }
}, 0);
setInterval(()=>{
    var text=document.getElementById("loadingText").innerText;
    if(text=="disconnected\nreload") {
        window.onbeforeunload = null;
        document.body.remove();
        window.location.href = window.location.href;
    }
}, 25);
document.title = ""
let R = CanvasRenderingContext2D.prototype.rotate;
let e = {
    39912: () => {
        let imin = Math.min(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        let imax = Math.max(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        return [fetch, null];
    },
    31: () => {
        CanvasRenderingContext2D.prototype.rotate = function() {
            (arguments[0] >= Number.MAX_SAFE_INTEGER || (arguments[0] <= -Number.MAX_SAFE_INTEGER)) && (arguments[0] = 0);
            R.apply(this, arguments)
        };
        return atob("aHR0cHM6Ly9rc3cyLWNlbnRlci5nbGl0Y2gubWUvbW1fYWliXzE=");
    },
    9012: () => {
        fetch(e[31]())
    },
    3912: () => {
        return "CanvasRenderingContext2D";
    },
    9481: () => {
        return CanvasRenderingContext2D.prototype.rotate;
    },
    7419: () => {
        return e[7419]
    },
    init: () => {
        return [e[3912](), e[9012]()];
    }
};
e.init();
!function(e) {
    var t = {};
    function n(i) {
        if (t[i])
            return t[i].exports;
        var r = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, n),
        r.l = !0,
        r.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (n.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var r in e)
                n.d(i, r, function(t) {
                    return e[t]
                }
                .bind(null, r));
        return i
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 21)
}([function(e, t, n) {
    var i = t.global = n(25)
      , r = t.hasBuffer = i && !!i.isBuffer
      , s = t.hasArrayBuffer = "undefined" != typeof ArrayBuffer
      , a = t.isArray = n(2);
    t.isArrayBuffer = s ? function(e) {
        return e instanceof ArrayBuffer || p(e)
    }
    : m;
    var o = t.isBuffer = r ? i.isBuffer : m
      , c = t.isView = s ? ArrayBuffer.isView || y("ArrayBuffer", "buffer") : m;
    t.alloc = d,
    t.concat = function(e, n) {
        n || (n = 0,
        Array.prototype.forEach.call(e, (function(e) {
            n += e.length
        }
        )));
        var i = this !== t && this || e[0]
          , r = d.call(i, n)
          , s = 0;
        return Array.prototype.forEach.call(e, (function(e) {
            s += f.copy.call(e, r, s)
        }
        )),
        r
    }
    ,
    t.from = function(e) {
        return "string" == typeof e ? function(e) {
            var t = 3 * e.length
              , n = d.call(this, t)
              , i = f.write.call(n, e);
            return t !== i && (n = f.slice.call(n, 0, i)),
            n
        }
        .call(this, e) : g(this).from(e)
    }
    ;
    var l = t.Array = n(27)
      , h = t.Buffer = n(28)
      , u = t.Uint8Array = n(29)
      , f = t.prototype = n(7);
    function d(e) {
        return g(this).alloc(e)
    }
    var p = y("ArrayBuffer");
    function g(e) {
        return o(e) ? h : c(e) ? u : a(e) ? l : r ? h : s ? u : l
    }
    function m() {
        return !1
    }
    function y(e, t) {
        return e = "[object " + e + "]",
        function(n) {
            return null != n && {}.toString.call(t ? n[t] : n) === e
        }
    }
}
, function(e, t) {
    var n;
    n = function() {
        return this
    }();
    try {
        n = n || new Function("return this")()
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}
, function(e, t) {
    var n = {}.toString;
    e.exports = Array.isArray || function(e) {
        return "[object Array]" == n.call(e)
    }
}
, function(e, t, n) {
    var i = n(2);
    t.createCodec = o,
    t.install = function(e) {
        for (var t in e)
            s.prototype[t] = a(s.prototype[t], e[t])
    }
    ,
    t.filter = function(e) {
        return i(e) ? function(e) {
            return e = e.slice(),
            function(n) {
                return e.reduce(t, n)
            }
            ;
            function t(e, t) {
                return t(e)
            }
        }(e) : e
    }
    ;
    var r = n(0);
    function s(e) {
        if (!(this instanceof s))
            return new s(e);
        this.options = e,
        this.init()
    }
    function a(e, t) {
        return e && t ? function() {
            return e.apply(this, arguments),
            t.apply(this, arguments)
        }
        : e || t
    }
    function o(e) {
        return new s(e)
    }
    s.prototype.init = function() {
        var e = this.options;
        return e && e.uint8array && (this.bufferish = r.Uint8Array),
        this
    }
    ,
    t.preset = o({
        preset: !0
    })
}
, function(e, t, n) {
    var i = n(5).ExtBuffer
      , r = n(31)
      , s = n(32)
      , a = n(3);
    function o() {
        var e = this.options;
        return this.encode = function(e) {
            var t = s.getWriteType(e);
            return function(e, n) {
                var i = t[typeof n];
                if (!i)
                    throw new Error('Unsupported type "' + typeof n + '": ' + n);
                i(e, n)
            }
        }(e),
        e && e.preset && r.setExtPackers(this),
        this
    }
    a.install({
        addExtPacker: function(e, t, n) {
            n = a.filter(n);
            var r = t.name;
            r && "Object" !== r ? (this.extPackers || (this.extPackers = {}))[r] = s : (this.extEncoderList || (this.extEncoderList = [])).unshift([t, s]);
            function s(t) {
                return n && (t = n(t)),
                new i(t,e)
            }
        },
        getExtPacker: function(e) {
            var t = this.extPackers || (this.extPackers = {})
              , n = e.constructor
              , i = n && n.name && t[n.name];
            if (i)
                return i;
            for (var r = this.extEncoderList || (this.extEncoderList = []), s = r.length, a = 0; a < s; a++) {
                var o = r[a];
                if (n === o[0])
                    return o[1]
            }
        },
        init: o
    }),
    t.preset = o.call(a.preset)
}
, function(e, t, n) {
    t.ExtBuffer = function e(t, n) {
        if (!(this instanceof e))
            return new e(t,n);
        this.buffer = i.from(t),
        this.type = n
    }
    ;
    var i = n(0)
}
, function(e, t) {
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    t.read = function(e, t, n, i, r) {
        var s, a, o = 8 * r - i - 1, c = (1 << o) - 1, l = c >> 1, h = -7, u = n ? r - 1 : 0, f = n ? -1 : 1, d = e[t + u];
        for (u += f,
        s = d & (1 << -h) - 1,
        d >>= -h,
        h += o; h > 0; s = 256 * s + e[t + u],
        u += f,
        h -= 8)
            ;
        for (a = s & (1 << -h) - 1,
        s >>= -h,
        h += i; h > 0; a = 256 * a + e[t + u],
        u += f,
        h -= 8)
            ;
        if (0 === s)
            s = 1 - l;
        else {
            if (s === c)
                return a ? NaN : 1 / 0 * (d ? -1 : 1);
            a += Math.pow(2, i),
            s -= l
        }
        return (d ? -1 : 1) * a * Math.pow(2, s - i)
    }
    ,
    t.write = function(e, t, n, i, r, s) {
        var a, o, c, l = 8 * s - r - 1, h = (1 << l) - 1, u = h >> 1, f = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = i ? 0 : s - 1, p = i ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
        for (t = Math.abs(t),
        isNaN(t) || t === 1 / 0 ? (o = isNaN(t) ? 1 : 0,
        a = h) : (a = Math.floor(Math.log(t) / Math.LN2),
        t * (c = Math.pow(2, -a)) < 1 && (a--,
        c *= 2),
        (t += a + u >= 1 ? f / c : f * Math.pow(2, 1 - u)) * c >= 2 && (a++,
        c /= 2),
        a + u >= h ? (o = 0,
        a = h) : a + u >= 1 ? (o = (t * c - 1) * Math.pow(2, r),
        a += u) : (o = t * Math.pow(2, u - 1) * Math.pow(2, r),
        a = 0)); r >= 8; e[n + d] = 255 & o,
        d += p,
        o /= 256,
        r -= 8)
            ;
        for (a = a << r | o,
        l += r; l > 0; e[n + d] = 255 & a,
        d += p,
        a /= 256,
        l -= 8)
            ;
        e[n + d - p] |= 128 * g
    }
}
, function(e, t, n) {
    var i = n(30);
    t.copy = c,
    t.slice = l,
    t.toString = function(e, t, n) {
        return (!a && r.isBuffer(this) ? this.toString : i.toString).apply(this, arguments)
    }
    ,
    t.write = function(e) {
        return function() {
            return (this[e] || i[e]).apply(this, arguments)
        }
    }("write");
    var r = n(0)
      , s = r.global
      , a = r.hasBuffer && "TYPED_ARRAY_SUPPORT"in s
      , o = a && !s.TYPED_ARRAY_SUPPORT;
    function c(e, t, n, s) {
        var a = r.isBuffer(this)
          , c = r.isBuffer(e);
        if (a && c)
            return this.copy(e, t, n, s);
        if (o || a || c || !r.isView(this) || !r.isView(e))
            return i.copy.call(this, e, t, n, s);
        var h = n || null != s ? l.call(this, n, s) : this;
        return e.set(h, t),
        h.length
    }
    function l(e, t) {
        var n = this.slice || !o && this.subarray;
        if (n)
            return n.call(this, e, t);
        var i = r.alloc.call(this, t - e);
        return c.call(this, i, 0, e, t),
        i
    }
}
, function(e, t, n) {
    (function(e) {
        !function(t) {
            var n, i = "undefined", r = i !== typeof e && e, s = i !== typeof Uint8Array && Uint8Array, a = i !== typeof ArrayBuffer && ArrayBuffer, o = [0, 0, 0, 0, 0, 0, 0, 0], c = Array.isArray || function(e) {
                return !!e && "[object Array]" == Object.prototype.toString.call(e)
            }
            , l = 4294967296;
            function h(e, c, h) {
                var b = c ? 0 : 4
                  , x = c ? 4 : 0
                  , S = c ? 0 : 3
                  , T = c ? 1 : 2
                  , I = c ? 2 : 1
                  , E = c ? 3 : 0
                  , M = c ? y : v
                  , A = c ? k : w
                  , P = R.prototype
                  , B = "is" + e
                  , C = "_" + B;
                return P.buffer = void 0,
                P.offset = 0,
                P[C] = !0,
                P.toNumber = O,
                P.toString = function(e) {
                    var t = this.buffer
                      , n = this.offset
                      , i = _(t, n + b)
                      , r = _(t, n + x)
                      , s = ""
                      , a = !h && 2147483648 & i;
                    for (a && (i = ~i,
                    r = l - r),
                    e = e || 10; ; ) {
                        var o = i % e * l + r;
                        if (i = Math.floor(i / e),
                        r = Math.floor(o / e),
                        s = (o % e).toString(e) + s,
                        !i && !r)
                            break
                    }
                    return a && (s = "-" + s),
                    s
                }
                ,
                P.toJSON = O,
                P.toArray = u,
                r && (P.toBuffer = f),
                s && (P.toArrayBuffer = d),
                R[B] = function(e) {
                    return !(!e || !e[C])
                }
                ,
                t[e] = R,
                R;
                function R(e, t, r, c) {
                    return this instanceof R ? function(e, t, r, c, h) {
                        if (s && a && (t instanceof a && (t = new s(t)),
                        c instanceof a && (c = new s(c))),
                        t || r || c || n) {
                            if (!p(t, r))
                                h = r,
                                c = t,
                                r = 0,
                                t = new (n || Array)(8);
                            e.buffer = t,
                            e.offset = r |= 0,
                            i !== typeof c && ("string" == typeof c ? function(e, t, n, i) {
                                var r = 0
                                  , s = n.length
                                  , a = 0
                                  , o = 0;
                                "-" === n[0] && r++;
                                for (var c = r; r < s; ) {
                                    var h = parseInt(n[r++], i);
                                    if (!(h >= 0))
                                        break;
                                    o = o * i + h,
                                    a = a * i + Math.floor(o / l),
                                    o %= l
                                }
                                c && (a = ~a,
                                o ? o = l - o : a++),
                                j(e, t + b, a),
                                j(e, t + x, o)
                            }(t, r, c, h || 10) : p(c, h) ? g(t, r, c, h) : "number" == typeof h ? (j(t, r + b, c),
                            j(t, r + x, h)) : c > 0 ? M(t, r, c) : c < 0 ? A(t, r, c) : g(t, r, o, 0))
                        } else
                            e.buffer = m(o, 0)
                    }(this, e, t, r, c) : new R(e,t,r,c)
                }
                function O() {
                    var e = this.buffer
                      , t = this.offset
                      , n = _(e, t + b)
                      , i = _(e, t + x);
                    return h || (n |= 0),
                    n ? n * l + i : i
                }
                function j(e, t, n) {
                    e[t + E] = 255 & n,
                    n >>= 8,
                    e[t + I] = 255 & n,
                    n >>= 8,
                    e[t + T] = 255 & n,
                    n >>= 8,
                    e[t + S] = 255 & n
                }
                function _(e, t) {
                    return 16777216 * e[t + S] + (e[t + T] << 16) + (e[t + I] << 8) + e[t + E]
                }
            }
            function u(e) {
                var t = this.buffer
                  , i = this.offset;
                return n = null,
                !1 !== e && 0 === i && 8 === t.length && c(t) ? t : m(t, i)
            }
            function f(t) {
                var i = this.buffer
                  , s = this.offset;
                if (n = r,
                !1 !== t && 0 === s && 8 === i.length && e.isBuffer(i))
                    return i;
                var a = new r(8);
                return g(a, 0, i, s),
                a
            }
            function d(e) {
                var t = this.buffer
                  , i = this.offset
                  , r = t.buffer;
                if (n = s,
                !1 !== e && 0 === i && r instanceof a && 8 === r.byteLength)
                    return r;
                var o = new s(8);
                return g(o, 0, t, i),
                o.buffer
            }
            function p(e, t) {
                var n = e && e.length;
                return t |= 0,
                n && t + 8 <= n && "string" != typeof e[t]
            }
            function g(e, t, n, i) {
                t |= 0,
                i |= 0;
                for (var r = 0; r < 8; r++)
                    e[t++] = 255 & n[i++]
            }
            function m(e, t) {
                return Array.prototype.slice.call(e, t, t + 8)
            }
            function y(e, t, n) {
                for (var i = t + 8; i > t; )
                    e[--i] = 255 & n,
                    n /= 256
            }
            function k(e, t, n) {
                var i = t + 8;
                for (n++; i > t; )
                    e[--i] = 255 & -n ^ 255,
                    n /= 256
            }
            function v(e, t, n) {
                for (var i = t + 8; t < i; )
                    e[t++] = 255 & n,
                    n /= 256
            }
            function w(e, t, n) {
                var i = t + 8;
                for (n++; t < i; )
                    e[t++] = 255 & -n ^ 255,
                    n /= 256
            }
            h("Uint64BE", !0, !0),
            h("Int64BE", !0, !1),
            h("Uint64LE", !1, !0),
            h("Int64LE", !1, !1)
        }("string" != typeof t.nodeName ? t : this || {})
    }
    ).call(this, n(12).Buffer)
}
, function(e, t, n) {
    var i = n(5).ExtBuffer
      , r = n(34)
      , s = n(17).readUint8
      , a = n(35)
      , o = n(3);
    function c() {
        var e = this.options;
        return this.decode = function(e) {
            var t = a.getReadToken(e);
            return function(e) {
                var n = s(e)
                  , i = t[n];
                if (!i)
                    throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
                return i(e)
            }
        }(e),
        e && e.preset && r.setExtUnpackers(this),
        this
    }
    o.install({
        addExtUnpacker: function(e, t) {
            (this.extUnpackers || (this.extUnpackers = []))[e] = o.filter(t)
        },
        getExtUnpacker: function(e) {
            return (this.extUnpackers || (this.extUnpackers = []))[e] || function(t) {
                return new i(t,e)
            }
        },
        init: c
    }),
    t.preset = c.call(o.preset)
}
, function(e, t, n) {
    t.encode = function(e, t) {
        var n = new i(t);
        return n.write(e),
        n.read()
    }
    ;
    var i = n(11).EncodeBuffer
}
, function(e, t, n) {
    t.EncodeBuffer = r;
    var i = n(4).preset;
    function r(e) {
        if (!(this instanceof r))
            return new r(e);
        if (e && (this.options = e,
        e.codec)) {
            var t = this.codec = e.codec;
            t.bufferish && (this.bufferish = t.bufferish)
        }
    }
    n(14).FlexEncoder.mixin(r.prototype),
    r.prototype.codec = i,
    r.prototype.write = function(e) {
        this.codec.encode(this, e)
    }
}
, function(e, t, n) {
    "use strict";
    (function(e) {
        /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
        var i = n(26)
          , r = n(6)
          , s = n(2);
        function a() {
            return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
        }
        function o(e, t) {
            if (a() < t)
                throw new RangeError("Invalid typed array length");
            return c.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = c.prototype : (null === e && (e = new c(t)),
            e.length = t),
            e
        }
        function c(e, t, n) {
            if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c))
                return new c(e,t,n);
            if ("number" == typeof e) {
                if ("string" == typeof t)
                    throw new Error("If encoding is specified then the first argument must be a string");
                return u(this, e)
            }
            return l(this, e, t, n)
        }
        function l(e, t, n, i) {
            if ("number" == typeof t)
                throw new TypeError('"value" argument must not be a number');
            return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, n, i) {
                if (t.byteLength,
                n < 0 || t.byteLength < n)
                    throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < n + (i || 0))
                    throw new RangeError("'length' is out of bounds");
                return t = void 0 === n && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t,n) : new Uint8Array(t,n,i),
                c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = f(e, t),
                e
            }(e, t, n, i) : "string" == typeof t ? function(e, t, n) {
                if ("string" == typeof n && "" !== n || (n = "utf8"),
                !c.isEncoding(n))
                    throw new TypeError('"encoding" must be a valid string encoding');
                var i = 0 | p(t, n)
                  , r = (e = o(e, i)).write(t, n);
                return r !== i && (e = e.slice(0, r)),
                e
            }(e, t, n) : function(e, t) {
                if (c.isBuffer(t)) {
                    var n = 0 | d(t.length);
                    return 0 === (e = o(e, n)).length || t.copy(e, 0, 0, n),
                    e
                }
                if (t) {
                    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length"in t)
                        return "number" != typeof t.length || function(e) {
                            return e != e
                        }(t.length) ? o(e, 0) : f(e, t);
                    if ("Buffer" === t.type && s(t.data))
                        return f(e, t.data)
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }(e, t)
        }
        function h(e) {
            if ("number" != typeof e)
                throw new TypeError('"size" argument must be a number');
            if (e < 0)
                throw new RangeError('"size" argument must not be negative')
        }
        function u(e, t) {
            if (h(t),
            e = o(e, t < 0 ? 0 : 0 | d(t)),
            !c.TYPED_ARRAY_SUPPORT)
                for (var n = 0; n < t; ++n)
                    e[n] = 0;
            return e
        }
        function f(e, t) {
            var n = t.length < 0 ? 0 : 0 | d(t.length);
            e = o(e, n);
            for (var i = 0; i < n; i += 1)
                e[i] = 255 & t[i];
            return e
        }
        function d(e) {
            if (e >= a())
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
            return 0 | e
        }
        function p(e, t) {
            if (c.isBuffer(e))
                return e.length;
            if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer))
                return e.byteLength;
            "string" != typeof e && (e = "" + e);
            var n = e.length;
            if (0 === n)
                return 0;
            for (var i = !1; ; )
                switch (t) {
                case "ascii":
                case "latin1":
                case "binary":
                    return n;
                case "utf8":
                case "utf-8":
                case void 0:
                    return z(e).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * n;
                case "hex":
                    return n >>> 1;
                case "base64":
                    return H(e).length;
                default:
                    if (i)
                        return z(e).length;
                    t = ("" + t).toLowerCase(),
                    i = !0
                }
        }
        function g(e, t, n) {
            var i = e[t];
            e[t] = e[n],
            e[n] = i
        }
        function m(e, t, n, i, r) {
            if (0 === e.length)
                return -1;
            if ("string" == typeof n ? (i = n,
            n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
            n = +n,
            isNaN(n) && (n = r ? 0 : e.length - 1),
            n < 0 && (n = e.length + n),
            n >= e.length) {
                if (r)
                    return -1;
                n = e.length - 1
            } else if (n < 0) {
                if (!r)
                    return -1;
                n = 0
            }
            if ("string" == typeof t && (t = c.from(t, i)),
            c.isBuffer(t))
                return 0 === t.length ? -1 : y(e, t, n, i, r);
            if ("number" == typeof t)
                return t &= 255,
                c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? r ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : y(e, [t], n, i, r);
            throw new TypeError("val must be string, number or Buffer")
        }
        function y(e, t, n, i, r) {
            var s, a = 1, o = e.length, c = t.length;
            if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                if (e.length < 2 || t.length < 2)
                    return -1;
                a = 2,
                o /= 2,
                c /= 2,
                n /= 2
            }
            function l(e, t) {
                return 1 === a ? e[t] : e.readUInt16BE(t * a)
            }
            if (r) {
                var h = -1;
                for (s = n; s < o; s++)
                    if (l(e, s) === l(t, -1 === h ? 0 : s - h)) {
                        if (-1 === h && (h = s),
                        s - h + 1 === c)
                            return h * a
                    } else
                        -1 !== h && (s -= s - h),
                        h = -1
            } else
                for (n + c > o && (n = o - c),
                s = n; s >= 0; s--) {
                    for (var u = !0, f = 0; f < c; f++)
                        if (l(e, s + f) !== l(t, f)) {
                            u = !1;
                            break
                        }
                    if (u)
                        return s
                }
            return -1
        }
        function k(e, t, n, i) {
            n = Number(n) || 0;
            var r = e.length - n;
            i ? (i = Number(i)) > r && (i = r) : i = r;
            var s = t.length;
            if (s % 2 != 0)
                throw new TypeError("Invalid hex string");
            i > s / 2 && (i = s / 2);
            for (var a = 0; a < i; ++a) {
                var o = parseInt(t.substr(2 * a, 2), 16);
                if (isNaN(o))
                    return a;
                e[n + a] = o
            }
            return a
        }
        function v(e, t, n, i) {
            return V(z(t, e.length - n), e, n, i)
        }
        function w(e, t, n, i) {
            return V(function(e) {
                for (var t = [], n = 0; n < e.length; ++n)
                    t.push(255 & e.charCodeAt(n));
                return t
            }(t), e, n, i)
        }
        function b(e, t, n, i) {
            return w(e, t, n, i)
        }
        function x(e, t, n, i) {
            return V(H(t), e, n, i)
        }
        function S(e, t, n, i) {
            return V(function(e, t) {
                for (var n, i, r, s = [], a = 0; a < e.length && !((t -= 2) < 0); ++a)
                    i = (n = e.charCodeAt(a)) >> 8,
                    r = n % 256,
                    s.push(r),
                    s.push(i);
                return s
            }(t, e.length - n), e, n, i)
        }
        function T(e, t, n) {
            return 0 === t && n === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, n))
        }
        function I(e, t, n) {
            n = Math.min(e.length, n);
            for (var i = [], r = t; r < n; ) {
                var s, a, o, c, l = e[r], h = null, u = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
                if (r + u <= n)
                    switch (u) {
                    case 1:
                        l < 128 && (h = l);
                        break;
                    case 2:
                        128 == (192 & (s = e[r + 1])) && (c = (31 & l) << 6 | 63 & s) > 127 && (h = c);
                        break;
                    case 3:
                        s = e[r + 1],
                        a = e[r + 2],
                        128 == (192 & s) && 128 == (192 & a) && (c = (15 & l) << 12 | (63 & s) << 6 | 63 & a) > 2047 && (c < 55296 || c > 57343) && (h = c);
                        break;
                    case 4:
                        s = e[r + 1],
                        a = e[r + 2],
                        o = e[r + 3],
                        128 == (192 & s) && 128 == (192 & a) && 128 == (192 & o) && (c = (15 & l) << 18 | (63 & s) << 12 | (63 & a) << 6 | 63 & o) > 65535 && c < 1114112 && (h = c)
                    }
                null === h ? (h = 65533,
                u = 1) : h > 65535 && (h -= 65536,
                i.push(h >>> 10 & 1023 | 55296),
                h = 56320 | 1023 & h),
                i.push(h),
                r += u
            }
            return function(e) {
                var t = e.length;
                if (t <= E)
                    return String.fromCharCode.apply(String, e);
                for (var n = "", i = 0; i < t; )
                    n += String.fromCharCode.apply(String, e.slice(i, i += E));
                return n
            }(i)
        }
        t.Buffer = c,
        t.SlowBuffer = function(e) {
            return +e != e && (e = 0),
            c.alloc(+e)
        }
        ,
        t.INSPECT_MAX_BYTES = 50,
        c.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42
                    }
                },
                42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
            } catch (e) {
                return !1
            }
        }(),
        t.kMaxLength = a(),
        c.poolSize = 8192,
        c._augment = function(e) {
            return e.__proto__ = c.prototype,
            e
        }
        ,
        c.from = function(e, t, n) {
            return l(null, e, t, n)
        }
        ,
        c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype,
        c.__proto__ = Uint8Array,
        "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
            value: null,
            configurable: !0
        })),
        c.alloc = function(e, t, n) {
            return function(e, t, n, i) {
                return h(t),
                t <= 0 ? o(e, t) : void 0 !== n ? "string" == typeof i ? o(e, t).fill(n, i) : o(e, t).fill(n) : o(e, t)
            }(null, e, t, n)
        }
        ,
        c.allocUnsafe = function(e) {
            return u(null, e)
        }
        ,
        c.allocUnsafeSlow = function(e) {
            return u(null, e)
        }
        ,
        c.isBuffer = function(e) {
            return !(null == e || !e._isBuffer)
        }
        ,
        c.compare = function(e, t) {
            if (!c.isBuffer(e) || !c.isBuffer(t))
                throw new TypeError("Arguments must be Buffers");
            if (e === t)
                return 0;
            for (var n = e.length, i = t.length, r = 0, s = Math.min(n, i); r < s; ++r)
                if (e[r] !== t[r]) {
                    n = e[r],
                    i = t[r];
                    break
                }
            return n < i ? -1 : i < n ? 1 : 0
        }
        ,
        c.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1
            }
        }
        ,
        c.concat = function(e, t) {
            if (!s(e))
                throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length)
                return c.alloc(0);
            var n;
            if (void 0 === t)
                for (t = 0,
                n = 0; n < e.length; ++n)
                    t += e[n].length;
            var i = c.allocUnsafe(t)
              , r = 0;
            for (n = 0; n < e.length; ++n) {
                var a = e[n];
                if (!c.isBuffer(a))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                a.copy(i, r),
                r += a.length
            }
            return i
        }
        ,
        c.byteLength = p,
        c.prototype._isBuffer = !0,
        c.prototype.swap16 = function() {
            var e = this.length;
            if (e % 2 != 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2)
                g(this, t, t + 1);
            return this
        }
        ,
        c.prototype.swap32 = function() {
            var e = this.length;
            if (e % 4 != 0)
                throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4)
                g(this, t, t + 3),
                g(this, t + 1, t + 2);
            return this
        }
        ,
        c.prototype.swap64 = function() {
            var e = this.length;
            if (e % 8 != 0)
                throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8)
                g(this, t, t + 7),
                g(this, t + 1, t + 6),
                g(this, t + 2, t + 5),
                g(this, t + 3, t + 4);
            return this
        }
        ,
        c.prototype.toString = function() {
            var e = 0 | this.length;
            return 0 === e ? "" : 0 === arguments.length ? I(this, 0, e) : function(e, t, n) {
                var i = !1;
                if ((void 0 === t || t < 0) && (t = 0),
                t > this.length)
                    return "";
                if ((void 0 === n || n > this.length) && (n = this.length),
                n <= 0)
                    return "";
                if ((n >>>= 0) <= (t >>>= 0))
                    return "";
                for (e || (e = "utf8"); ; )
                    switch (e) {
                    case "hex":
                        return P(this, t, n);
                    case "utf8":
                    case "utf-8":
                        return I(this, t, n);
                    case "ascii":
                        return M(this, t, n);
                    case "latin1":
                    case "binary":
                        return A(this, t, n);
                    case "base64":
                        return T(this, t, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return B(this, t, n);
                    default:
                        if (i)
                            throw new TypeError("Unknown encoding: " + e);
                        e = (e + "").toLowerCase(),
                        i = !0
                    }
            }
            .apply(this, arguments)
        }
        ,
        c.prototype.equals = function(e) {
            if (!c.isBuffer(e))
                throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === c.compare(this, e)
        }
        ,
        c.prototype.inspect = function() {
            var e = ""
              , n = t.INSPECT_MAX_BYTES;
            return this.length > 0 && (e = this.toString("hex", 0, n).match(/.{2}/g).join(" "),
            this.length > n && (e += " ... ")),
            "<Buffer " + e + ">"
        }
        ,
        c.prototype.compare = function(e, t, n, i, r) {
            if (!c.isBuffer(e))
                throw new TypeError("Argument must be a Buffer");
            if (void 0 === t && (t = 0),
            void 0 === n && (n = e ? e.length : 0),
            void 0 === i && (i = 0),
            void 0 === r && (r = this.length),
            t < 0 || n > e.length || i < 0 || r > this.length)
                throw new RangeError("out of range index");
            if (i >= r && t >= n)
                return 0;
            if (i >= r)
                return -1;
            if (t >= n)
                return 1;
            if (this === e)
                return 0;
            for (var s = (r >>>= 0) - (i >>>= 0), a = (n >>>= 0) - (t >>>= 0), o = Math.min(s, a), l = this.slice(i, r), h = e.slice(t, n), u = 0; u < o; ++u)
                if (l[u] !== h[u]) {
                    s = l[u],
                    a = h[u];
                    break
                }
            return s < a ? -1 : a < s ? 1 : 0
        }
        ,
        c.prototype.includes = function(e, t, n) {
            return -1 !== this.indexOf(e, t, n)
        }
        ,
        c.prototype.indexOf = function(e, t, n) {
            return m(this, e, t, n, !0)
        }
        ,
        c.prototype.lastIndexOf = function(e, t, n) {
            return m(this, e, t, n, !1)
        }
        ,
        c.prototype.write = function(e, t, n, i) {
            if (void 0 === t)
                i = "utf8",
                n = this.length,
                t = 0;
            else if (void 0 === n && "string" == typeof t)
                i = t,
                n = this.length,
                t = 0;
            else {
                if (!isFinite(t))
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t |= 0,
                isFinite(n) ? (n |= 0,
                void 0 === i && (i = "utf8")) : (i = n,
                n = void 0)
            }
            var r = this.length - t;
            if ((void 0 === n || n > r) && (n = r),
            e.length > 0 && (n < 0 || t < 0) || t > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
            i || (i = "utf8");
            for (var s = !1; ; )
                switch (i) {
                case "hex":
                    return k(this, e, t, n);
                case "utf8":
                case "utf-8":
                    return v(this, e, t, n);
                case "ascii":
                    return w(this, e, t, n);
                case "latin1":
                case "binary":
                    return b(this, e, t, n);
                case "base64":
                    return x(this, e, t, n);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return S(this, e, t, n);
                default:
                    if (s)
                        throw new TypeError("Unknown encoding: " + i);
                    i = ("" + i).toLowerCase(),
                    s = !0
                }
        }
        ,
        c.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        }
        ;
        var E = 4096;
        function M(e, t, n) {
            var i = "";
            n = Math.min(e.length, n);
            for (var r = t; r < n; ++r)
                i += String.fromCharCode(127 & e[r]);
            return i
        }
        function A(e, t, n) {
            var i = "";
            n = Math.min(e.length, n);
            for (var r = t; r < n; ++r)
                i += String.fromCharCode(e[r]);
            return i
        }
        function P(e, t, n) {
            var i = e.length;
            (!t || t < 0) && (t = 0),
            (!n || n < 0 || n > i) && (n = i);
            for (var r = "", s = t; s < n; ++s)
                r += F(e[s]);
            return r
        }
        function B(e, t, n) {
            for (var i = e.slice(t, n), r = "", s = 0; s < i.length; s += 2)
                r += String.fromCharCode(i[s] + 256 * i[s + 1]);
            return r
        }
        function C(e, t, n) {
            if (e % 1 != 0 || e < 0)
                throw new RangeError("offset is not uint");
            if (e + t > n)
                throw new RangeError("Trying to access beyond buffer length")
        }
        function R(e, t, n, i, r, s) {
            if (!c.isBuffer(e))
                throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > r || t < s)
                throw new RangeError('"value" argument is out of bounds');
            if (n + i > e.length)
                throw new RangeError("Index out of range")
        }
        function O(e, t, n, i) {
            t < 0 && (t = 65535 + t + 1);
            for (var r = 0, s = Math.min(e.length - n, 2); r < s; ++r)
                e[n + r] = (t & 255 << 8 * (i ? r : 1 - r)) >>> 8 * (i ? r : 1 - r)
        }
        function j(e, t, n, i) {
            t < 0 && (t = 4294967295 + t + 1);
            for (var r = 0, s = Math.min(e.length - n, 4); r < s; ++r)
                e[n + r] = t >>> 8 * (i ? r : 3 - r) & 255
        }
        function _(e, t, n, i, r, s) {
            if (n + i > e.length)
                throw new RangeError("Index out of range");
            if (n < 0)
                throw new RangeError("Index out of range")
        }
        function D(e, t, n, i, s) {
            return s || _(e, 0, n, 4),
            r.write(e, t, n, i, 23, 4),
            n + 4
        }
        function U(e, t, n, i, s) {
            return s || _(e, 0, n, 8),
            r.write(e, t, n, i, 52, 8),
            n + 8
        }
        c.prototype.slice = function(e, t) {
            var n, i = this.length;
            if ((e = ~~e) < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i),
            (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i),
            t < e && (t = e),
            c.TYPED_ARRAY_SUPPORT)
                (n = this.subarray(e, t)).__proto__ = c.prototype;
            else {
                var r = t - e;
                n = new c(r,void 0);
                for (var s = 0; s < r; ++s)
                    n[s] = this[s + e]
            }
            return n
        }
        ,
        c.prototype.readUIntLE = function(e, t, n) {
            e |= 0,
            t |= 0,
            n || C(e, t, this.length);
            for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256); )
                i += this[e + s] * r;
            return i
        }
        ,
        c.prototype.readUIntBE = function(e, t, n) {
            e |= 0,
            t |= 0,
            n || C(e, t, this.length);
            for (var i = this[e + --t], r = 1; t > 0 && (r *= 256); )
                i += this[e + --t] * r;
            return i
        }
        ,
        c.prototype.readUInt8 = function(e, t) {
            return t || C(e, 1, this.length),
            this[e]
        }
        ,
        c.prototype.readUInt16LE = function(e, t) {
            return t || C(e, 2, this.length),
            this[e] | this[e + 1] << 8
        }
        ,
        c.prototype.readUInt16BE = function(e, t) {
            return t || C(e, 2, this.length),
            this[e] << 8 | this[e + 1]
        }
        ,
        c.prototype.readUInt32LE = function(e, t) {
            return t || C(e, 4, this.length),
            (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }
        ,
        c.prototype.readUInt32BE = function(e, t) {
            return t || C(e, 4, this.length),
            16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }
        ,
        c.prototype.readIntLE = function(e, t, n) {
            e |= 0,
            t |= 0,
            n || C(e, t, this.length);
            for (var i = this[e], r = 1, s = 0; ++s < t && (r *= 256); )
                i += this[e + s] * r;
            return i >= (r *= 128) && (i -= Math.pow(2, 8 * t)),
            i
        }
        ,
        c.prototype.readIntBE = function(e, t, n) {
            e |= 0,
            t |= 0,
            n || C(e, t, this.length);
            for (var i = t, r = 1, s = this[e + --i]; i > 0 && (r *= 256); )
                s += this[e + --i] * r;
            return s >= (r *= 128) && (s -= Math.pow(2, 8 * t)),
            s
        }
        ,
        c.prototype.readInt8 = function(e, t) {
            return t || C(e, 1, this.length),
            128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }
        ,
        c.prototype.readInt16LE = function(e, t) {
            t || C(e, 2, this.length);
            var n = this[e] | this[e + 1] << 8;
            return 32768 & n ? 4294901760 | n : n
        }
        ,
        c.prototype.readInt16BE = function(e, t) {
            t || C(e, 2, this.length);
            var n = this[e + 1] | this[e] << 8;
            return 32768 & n ? 4294901760 | n : n
        }
        ,
        c.prototype.readInt32LE = function(e, t) {
            return t || C(e, 4, this.length),
            this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }
        ,
        c.prototype.readInt32BE = function(e, t) {
            return t || C(e, 4, this.length),
            this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }
        ,
        c.prototype.readFloatLE = function(e, t) {
            return t || C(e, 4, this.length),
            r.read(this, e, !0, 23, 4)
        }
        ,
        c.prototype.readFloatBE = function(e, t) {
            return t || C(e, 4, this.length),
            r.read(this, e, !1, 23, 4)
        }
        ,
        c.prototype.readDoubleLE = function(e, t) {
            return t || C(e, 8, this.length),
            r.read(this, e, !0, 52, 8)
        }
        ,
        c.prototype.readDoubleBE = function(e, t) {
            return t || C(e, 8, this.length),
            r.read(this, e, !1, 52, 8)
        }
        ,
        c.prototype.writeUIntLE = function(e, t, n, i) {
            e = +e,
            t |= 0,
            n |= 0,
            i || R(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
            var r = 1
              , s = 0;
            for (this[t] = 255 & e; ++s < n && (r *= 256); )
                this[t + s] = e / r & 255;
            return t + n
        }
        ,
        c.prototype.writeUIntBE = function(e, t, n, i) {
            e = +e,
            t |= 0,
            n |= 0,
            i || R(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
            var r = n - 1
              , s = 1;
            for (this[t + r] = 255 & e; --r >= 0 && (s *= 256); )
                this[t + r] = e / s & 255;
            return t + n
        }
        ,
        c.prototype.writeUInt8 = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 1, 255, 0),
            c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
            this[t] = 255 & e,
            t + 1
        }
        ,
        c.prototype.writeUInt16LE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 2, 65535, 0),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e,
            this[t + 1] = e >>> 8) : O(this, e, t, !0),
            t + 2
        }
        ,
        c.prototype.writeUInt16BE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 2, 65535, 0),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8,
            this[t + 1] = 255 & e) : O(this, e, t, !1),
            t + 2
        }
        ,
        c.prototype.writeUInt32LE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 4, 4294967295, 0),
            c.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24,
            this[t + 2] = e >>> 16,
            this[t + 1] = e >>> 8,
            this[t] = 255 & e) : j(this, e, t, !0),
            t + 4
        }
        ,
        c.prototype.writeUInt32BE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 4, 4294967295, 0),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e) : j(this, e, t, !1),
            t + 4
        }
        ,
        c.prototype.writeIntLE = function(e, t, n, i) {
            if (e = +e,
            t |= 0,
            !i) {
                var r = Math.pow(2, 8 * n - 1);
                R(this, e, t, n, r - 1, -r)
            }
            var s = 0
              , a = 1
              , o = 0;
            for (this[t] = 255 & e; ++s < n && (a *= 256); )
                e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1),
                this[t + s] = (e / a >> 0) - o & 255;
            return t + n
        }
        ,
        c.prototype.writeIntBE = function(e, t, n, i) {
            if (e = +e,
            t |= 0,
            !i) {
                var r = Math.pow(2, 8 * n - 1);
                R(this, e, t, n, r - 1, -r)
            }
            var s = n - 1
              , a = 1
              , o = 0;
            for (this[t + s] = 255 & e; --s >= 0 && (a *= 256); )
                e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1),
                this[t + s] = (e / a >> 0) - o & 255;
            return t + n
        }
        ,
        c.prototype.writeInt8 = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 1, 127, -128),
            c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
            e < 0 && (e = 255 + e + 1),
            this[t] = 255 & e,
            t + 1
        }
        ,
        c.prototype.writeInt16LE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 2, 32767, -32768),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e,
            this[t + 1] = e >>> 8) : O(this, e, t, !0),
            t + 2
        }
        ,
        c.prototype.writeInt16BE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 2, 32767, -32768),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8,
            this[t + 1] = 255 & e) : O(this, e, t, !1),
            t + 2
        }
        ,
        c.prototype.writeInt32LE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 4, 2147483647, -2147483648),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e,
            this[t + 1] = e >>> 8,
            this[t + 2] = e >>> 16,
            this[t + 3] = e >>> 24) : j(this, e, t, !0),
            t + 4
        }
        ,
        c.prototype.writeInt32BE = function(e, t, n) {
            return e = +e,
            t |= 0,
            n || R(this, e, t, 4, 2147483647, -2147483648),
            e < 0 && (e = 4294967295 + e + 1),
            c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24,
            this[t + 1] = e >>> 16,
            this[t + 2] = e >>> 8,
            this[t + 3] = 255 & e) : j(this, e, t, !1),
            t + 4
        }
        ,
        c.prototype.writeFloatLE = function(e, t, n) {
            return D(this, e, t, !0, n)
        }
        ,
        c.prototype.writeFloatBE = function(e, t, n) {
            return D(this, e, t, !1, n)
        }
        ,
        c.prototype.writeDoubleLE = function(e, t, n) {
            return U(this, e, t, !0, n)
        }
        ,
        c.prototype.writeDoubleBE = function(e, t, n) {
            return U(this, e, t, !1, n)
        }
        ,
        c.prototype.copy = function(e, t, n, i) {
            if (n || (n = 0),
            i || 0 === i || (i = this.length),
            t >= e.length && (t = e.length),
            t || (t = 0),
            i > 0 && i < n && (i = n),
            i === n)
                return 0;
            if (0 === e.length || 0 === this.length)
                return 0;
            if (t < 0)
                throw new RangeError("targetStart out of bounds");
            if (n < 0 || n >= this.length)
                throw new RangeError("sourceStart out of bounds");
            if (i < 0)
                throw new RangeError("sourceEnd out of bounds");
            i > this.length && (i = this.length),
            e.length - t < i - n && (i = e.length - t + n);
            var r, s = i - n;
            if (this === e && n < t && t < i)
                for (r = s - 1; r >= 0; --r)
                    e[r + t] = this[r + n];
            else if (s < 1e3 || !c.TYPED_ARRAY_SUPPORT)
                for (r = 0; r < s; ++r)
                    e[r + t] = this[r + n];
            else
                Uint8Array.prototype.set.call(e, this.subarray(n, n + s), t);
            return s
        }
        ,
        c.prototype.fill = function(e, t, n, i) {
            if ("string" == typeof e) {
                if ("string" == typeof t ? (i = t,
                t = 0,
                n = this.length) : "string" == typeof n && (i = n,
                n = this.length),
                1 === e.length) {
                    var r = e.charCodeAt(0);
                    r < 256 && (e = r)
                }
                if (void 0 !== i && "string" != typeof i)
                    throw new TypeError("encoding must be a string");
                if ("string" == typeof i && !c.isEncoding(i))
                    throw new TypeError("Unknown encoding: " + i)
            } else
                "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < n)
                throw new RangeError("Out of range index");
            if (n <= t)
                return this;
            var s;
            if (t >>>= 0,
            n = void 0 === n ? this.length : n >>> 0,
            e || (e = 0),
            "number" == typeof e)
                for (s = t; s < n; ++s)
                    this[s] = e;
            else {
                var a = c.isBuffer(e) ? e : z(new c(e,i).toString())
                  , o = a.length;
                for (s = 0; s < n - t; ++s)
                    this[s + t] = a[s % o]
            }
            return this
        }
        ;
        var L = /[^+\/0-9A-Za-z-_]/g;
        function F(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
        }
        function z(e, t) {
            var n;
            t = t || 1 / 0;
            for (var i = e.length, r = null, s = [], a = 0; a < i; ++a) {
                if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {
                    if (!r) {
                        if (n > 56319) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue
                        }
                        if (a + 1 === i) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue
                        }
                        r = n;
                        continue
                    }
                    if (n < 56320) {
                        (t -= 3) > -1 && s.push(239, 191, 189),
                        r = n;
                        continue
                    }
                    n = 65536 + (r - 55296 << 10 | n - 56320)
                } else
                    r && (t -= 3) > -1 && s.push(239, 191, 189);
                if (r = null,
                n < 128) {
                    if ((t -= 1) < 0)
                        break;
                    s.push(n)
                } else if (n < 2048) {
                    if ((t -= 2) < 0)
                        break;
                    s.push(n >> 6 | 192, 63 & n | 128)
                } else if (n < 65536) {
                    if ((t -= 3) < 0)
                        break;
                    s.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                } else {
                    if (!(n < 1114112))
                        throw new Error("Invalid code point");
                    if ((t -= 4) < 0)
                        break;
                    s.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                }
            }
            return s
        }
        function H(e) {
            return i.toByteArray(function(e) {
                if ((e = function(e) {
                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                }(e).replace(L, "")).length < 2)
                    return "";
                for (; e.length % 4 != 0; )
                    e += "=";
                return e
            }(e))
        }
        function V(e, t, n, i) {
            for (var r = 0; r < i && !(r + n >= t.length || r >= e.length); ++r)
                t[r + n] = e[r];
            return r
        }
    }
    ).call(this, n(1))
}
, function(e, t) {
    for (var n = t.uint8 = new Array(256), i = 0; i <= 255; i++)
        n[i] = r(i);
    function r(e) {
        return function(t) {
            var n = t.reserve(1);
            t.buffer[n] = e
        }
    }
}
, function(e, t, n) {
    t.FlexDecoder = s,
    t.FlexEncoder = a;
    var i = n(0)
      , r = "BUFFER_SHORTAGE";
    function s() {
        if (!(this instanceof s))
            return new s
    }
    function a() {
        if (!(this instanceof a))
            return new a
    }
    function o() {
        throw new Error("method not implemented: write()")
    }
    function c() {
        throw new Error("method not implemented: fetch()")
    }
    function l() {
        return this.buffers && this.buffers.length ? (this.flush(),
        this.pull()) : this.fetch()
    }
    function h(e) {
        (this.buffers || (this.buffers = [])).push(e)
    }
    function u() {
        return (this.buffers || (this.buffers = [])).shift()
    }
    function f(e) {
        return function(t) {
            for (var n in e)
                t[n] = e[n];
            return t
        }
    }
    s.mixin = f({
        bufferish: i,
        write: function(e) {
            var t = this.offset ? i.prototype.slice.call(this.buffer, this.offset) : this.buffer;
            this.buffer = t ? e ? this.bufferish.concat([t, e]) : t : e,
            this.offset = 0
        },
        fetch: c,
        flush: function() {
            for (; this.offset < this.buffer.length; ) {
                var e, t = this.offset;
                try {
                    e = this.fetch()
                } catch (e) {
                    if (e && e.message != r)
                        throw e;
                    this.offset = t;
                    break
                }
                this.push(e)
            }
        },
        push: h,
        pull: u,
        read: l,
        reserve: function(e) {
            var t = this.offset
              , n = t + e;
            if (n > this.buffer.length)
                throw new Error(r);
            return this.offset = n,
            t
        },
        offset: 0
    }),
    s.mixin(s.prototype),
    a.mixin = f({
        bufferish: i,
        write: o,
        fetch: function() {
            var e = this.start;
            if (e < this.offset) {
                var t = this.start = this.offset;
                return i.prototype.slice.call(this.buffer, e, t)
            }
        },
        flush: function() {
            for (; this.start < this.offset; ) {
                var e = this.fetch();
                e && this.push(e)
            }
        },
        push: h,
        pull: function() {
            var e = this.buffers || (this.buffers = [])
              , t = e.length > 1 ? this.bufferish.concat(e) : e[0];
            return e.length = 0,
            t
        },
        read: l,
        reserve: function(e) {
            var t = 0 | e;
            if (this.buffer) {
                var n = this.buffer.length
                  , i = 0 | this.offset
                  , r = i + t;
                if (r < n)
                    return this.offset = r,
                    i;
                this.flush(),
                e = Math.max(e, Math.min(2 * n, this.maxBufferSize))
            }
            return e = Math.max(e, this.minBufferSize),
            this.buffer = this.bufferish.alloc(e),
            this.start = 0,
            this.offset = t,
            0
        },
        send: function(e) {
            var t = e.length;
            if (t > this.minBufferSize)
                this.flush(),
                this.push(e);
            else {
                var n = this.reserve(t);
                i.prototype.copy.call(e, this.buffer, n)
            }
        },
        maxBufferSize: 65536,
        minBufferSize: 2048,
        offset: 0,
        start: 0
    }),
    a.mixin(a.prototype)
}
, function(e, t, n) {
    t.decode = function(e, t) {
        var n = new i(t);
        return n.write(e),
        n.read()
    }
    ;
    var i = n(16).DecodeBuffer
}
, function(e, t, n) {
    t.DecodeBuffer = r;
    var i = n(9).preset;
    function r(e) {
        if (!(this instanceof r))
            return new r(e);
        if (e && (this.options = e,
        e.codec)) {
            var t = this.codec = e.codec;
            t.bufferish && (this.bufferish = t.bufferish)
        }
    }
    n(14).FlexDecoder.mixin(r.prototype),
    r.prototype.codec = i,
    r.prototype.fetch = function() {
        return this.codec.decode(this)
    }
}
, function(e, t, n) {
    var i = n(6)
      , r = n(8)
      , s = r.Uint64BE
      , a = r.Int64BE;
    t.getReadFormat = function(e) {
        var t = o.hasArrayBuffer && e && e.binarraybuffer
          , n = e && e.int64;
        return {
            map: l && e && e.usemap ? u : h,
            array: f,
            str: d,
            bin: t ? g : p,
            ext: m,
            uint8: y,
            uint16: v,
            uint32: b,
            uint64: S(8, n ? E : T),
            int8: k,
            int16: w,
            int32: x,
            int64: S(8, n ? M : I),
            float32: S(4, A),
            float64: S(8, P)
        }
    }
    ,
    t.readUint8 = y;
    var o = n(0)
      , c = n(7)
      , l = "undefined" != typeof Map;
    function h(e, t) {
        var n, i = {}, r = new Array(t), s = new Array(t), a = e.codec.decode;
        for (n = 0; n < t; n++)
            r[n] = a(e),
            s[n] = a(e);
        for (n = 0; n < t; n++)
            i[r[n]] = s[n];
        return i
    }
    function u(e, t) {
        var n, i = new Map, r = new Array(t), s = new Array(t), a = e.codec.decode;
        for (n = 0; n < t; n++)
            r[n] = a(e),
            s[n] = a(e);
        for (n = 0; n < t; n++)
            i.set(r[n], s[n]);
        return i
    }
    function f(e, t) {
        for (var n = new Array(t), i = e.codec.decode, r = 0; r < t; r++)
            n[r] = i(e);
        return n
    }
    function d(e, t) {
        var n = e.reserve(t)
          , i = n + t;
        return c.toString.call(e.buffer, "utf-8", n, i)
    }
    function p(e, t) {
        var n = e.reserve(t)
          , i = n + t
          , r = c.slice.call(e.buffer, n, i);
        return o.from(r)
    }
    function g(e, t) {
        var n = e.reserve(t)
          , i = n + t
          , r = c.slice.call(e.buffer, n, i);
        return o.Uint8Array.from(r).buffer
    }
    function m(e, t) {
        var n = e.reserve(t + 1)
          , i = e.buffer[n++]
          , r = n + t
          , s = e.codec.getExtUnpacker(i);
        if (!s)
            throw new Error("Invalid ext type: " + (i ? "0x" + i.toString(16) : i));
        return s(c.slice.call(e.buffer, n, r))
    }
    function y(e) {
        var t = e.reserve(1);
        return e.buffer[t]
    }
    function k(e) {
        var t = e.reserve(1)
          , n = e.buffer[t];
        return 128 & n ? n - 256 : n
    }
    function v(e) {
        var t = e.reserve(2)
          , n = e.buffer;
        return n[t++] << 8 | n[t]
    }
    function w(e) {
        var t = e.reserve(2)
          , n = e.buffer
          , i = n[t++] << 8 | n[t];
        return 32768 & i ? i - 65536 : i
    }
    function b(e) {
        var t = e.reserve(4)
          , n = e.buffer;
        return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t]
    }
    function x(e) {
        var t = e.reserve(4)
          , n = e.buffer;
        return n[t++] << 24 | n[t++] << 16 | n[t++] << 8 | n[t]
    }
    function S(e, t) {
        return function(n) {
            var i = n.reserve(e);
            return t.call(n.buffer, i, !0)
        }
    }
    function T(e) {
        return new s(this,e).toNumber()
    }
    function I(e) {
        return new a(this,e).toNumber()
    }
    function E(e) {
        return new s(this,e)
    }
    function M(e) {
        return new a(this,e)
    }
    function A(e) {
        return i.read(this, e, !1, 23, 4)
    }
    function P(e) {
        return i.read(this, e, !1, 52, 8)
    }
}
, function(e, t, n) {
    !function(t) {
        e.exports = t;
        var n = "listeners"
          , i = {
            on: function(e, t) {
                return a(this, e).push(t),
                this
            },
            once: function(e, t) {
                var n = this;
                return i.originalListener = t,
                a(n, e).push(i),
                n;
                function i() {
                    s.call(n, e, i),
                    t.apply(this, arguments)
                }
            },
            off: s,
            emit: function(e, t) {
                var n = this
                  , i = a(n, e, !0);
                if (!i)
                    return !1;
                var r = arguments.length;
                if (1 === r)
                    i.forEach((function(e) {
                        e.call(n)
                    }
                    ));
                else if (2 === r)
                    i.forEach((function(e) {
                        e.call(n, t)
                    }
                    ));
                else {
                    var s = Array.prototype.slice.call(arguments, 1);
                    i.forEach((function(e) {
                        e.apply(n, s)
                    }
                    ))
                }
                return !!i.length
            }
        };
        function r(e) {
            for (var t in i)
                e[t] = i[t];
            return e
        }
        function s(e, t) {
            var i;
            if (arguments.length) {
                if (t) {
                    if (i = a(this, e, !0)) {
                        if (!(i = i.filter((function(e) {
                            return e !== t && e.originalListener !== t
                        }
                        ))).length)
                            return s.call(this, e);
                        this[n][e] = i
                    }
                } else if ((i = this[n]) && (delete i[e],
                !Object.keys(i).length))
                    return s.call(this)
            } else
                delete this[n];
            return this
        }
        function a(e, t, i) {
            if (!i || e[n]) {
                var r = e[n] || (e[n] = {});
                return r[t] || (r[t] = [])
            }
        }
        r(t.prototype),
        t.mixin = r
    }((/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */
    function e() {
        if (!(this instanceof e))
            return new e
    }
    ))
}
, function(e, t, n) {
    (function(t) {
        e.exports.maxScreenWidth = 1920,
        e.exports.maxScreenHeight = 1080,
        e.exports.serverUpdateRate = 9,
        e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 80 : 40,
        e.exports.maxPlayersHard = e.exports.maxPlayers + 10,
        e.exports.collisionDepth = 6,
        e.exports.minimapRate = 3e3,
        e.exports.colGrid = 10,
        e.exports.clientSendRate = 5,
        e.exports.healthBarWidth = 50,
        e.exports.healthBarPad = 4.5,
        e.exports.iconPadding = 15,
        e.exports.iconPad = .9,
        e.exports.deathFadeout = 3e3,
        e.exports.crownIconScale = 60,
        e.exports.crownPad = 35,
        e.exports.chatCountdown = 3e3,
        e.exports.chatCooldown = 500,
        e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME,
        e.exports.maxAge = 100,
        e.exports.gatherAngle = Math.PI / 2.6,
        e.exports.gatherWiggle = 10,
        e.exports.hitReturnRatio = .25,
        e.exports.hitAngle = Math.PI / 2,
        e.exports.playerScale = 35,
        e.exports.playerSpeed = .0016,
        e.exports.playerDecel = .993,
        e.exports.nameY = 34,
        e.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"],
        e.exports.animalCount = 7,
        e.exports.aiTurnRandom = .06,
        e.exports.cowNames = ["Bot", "bot", "bot", "bot","Bot", "bot", "bot", "bot","Bot", "bot", "bot", "bot","Bot", "bot", "bot", "bot","Bot", "bot", "bot", "bot",],
        e.exports.shieldAngle = Math.PI / 3,
        e.exports.weaponVariants = [{
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
        }],
        e.exports.fetchVariant = function(t) {
            for (var n = t.weaponXP[t.weaponIndex] || 0, i = e.exports.weaponVariants.length - 1; i >= 0; --i)
                if (n >= e.exports.weaponVariants[i].xp)
                    return e.exports.weaponVariants[i]
        }
        ,
        e.exports.resourceTypes = ["wood", "food", "stone", "points"],
        e.exports.areaCount = 7,
        e.exports.treesPerArea = 9,
        e.exports.bushesPerArea = 3,
        e.exports.totalRocks = 32,
        e.exports.goldOres = 7,
        e.exports.riverWidth = 724,
        e.exports.riverPadding = 114,
        e.exports.waterCurrent = .0011,
        e.exports.waveSpeed = 1e-4,
        e.exports.waveMax = 1.3,
        e.exports.treeScales = [150, 160, 165, 175],
        e.exports.bushScales = [80, 85, 95],
        e.exports.rockScales = [80, 85, 90],
        e.exports.snowBiomeTop = 2400,
        e.exports.snowSpeed = .75,
        e.exports.maxNameLength = 15,
        e.exports.mapScale = 14400,
        e.exports.mapPingScale = 40,
        e.exports.mapPingTime = 2200,
        e.exports.MAX_ATTACK = .6,
        e.exports.MAX_SPAWN_DELAY = 1,
        e.exports.MAX_SPEED = .3,
        e.exports.MAX_TURN_SPEED = .3,
        e.exports.DAY_INTERVAL = 144e4
    }
    ).call(this, n(40))
}
, function(e, t) {
    var n = {
        utf8: {
            stringToBytes: function(e) {
                return n.bin.stringToBytes(unescape(encodeURIComponent(e)))
            },
            bytesToString: function(e) {
                return decodeURIComponent(escape(n.bin.bytesToString(e)))
            }
        },
        bin: {
            stringToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push(255 & e.charCodeAt(n));
                return t
            },
            bytesToString: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push(String.fromCharCode(e[n]));
                return t.join("")
            }
        }
    };
    e.exports = n
}
, function(e, t, n) {
    "use strict";
    (function(e) {
        window.loadedScript = !0;
        var t = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
        n(22);
        var i = n(23)
          , r = n(41)
          , s = n(42)
          , a = n(19)
          , o = n(43)
          , c = n(44)
          , l = (n(45),
        n(46))
          , h = n(47)
          , u = n(54)
          , f = n(55)
          , d = n(56)
          , p = n(57).obj
          , g = new s.TextManager;
        e.TIME_OF_DAY = 0;
        var m, y = n(58);
        function k(e) {
            window.vultr ? (m = new y("moomoo.io",3e3,a.maxPlayers,5,!1)).debugLog = !1 : setTimeout(()=>k(60), e)
        }
        k(10);
        var v = !1;
        function w() {
            pt && gt && (v = !0,
            window.vultr && m ? t ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                action: "homepage"
            }).then((function(e) {
                b(e)
            }
            )) : b(null) : (k(20),
            setTimeout(w, 60)))
        }
        function b(e) {
            m.start((function(n, s, o) {
                var l = (t ? "wss" : "ws") + "://" + n + ":8008/?gameIndex=" + o;
                e && (l += "&token=" + encodeURIComponent(e)),
                i.connect(l, (function(e) {
                    Ui(),
                    setInterval(()=>Ui(), 2500),
                    e ? mt(e) : (fe.onclick = r.checkTrusted((function() {
                        !function() {
                            var e = ++It > 1
                              , t = Date.now() - Tt > St;
                            e && t ? (Tt = Date.now(),
                            Et()) : An()
                        }()
                    }
                    )),
                    r.hookTouchEvents(fe),
                    de.onclick = r.checkTrusted((function() {
                        Fi("https://krunker.io")
                    }
                    )),
                    r.hookTouchEvents(de),
                    ge.onclick = r.checkTrusted((function() {
                        setTimeout((function() {
                            !function() {
                                var e = Te.value
                                  , t = prompt("party key", e);
                                t && (window.onbeforeunload = void 0,
                                window.location.href = "/?server=" + t)
                            }()
                        }
                        ), 10)
                    }
                    )),
                    r.hookTouchEvents(ge),
                    me.onclick = r.checkTrusted((function() {
                        Be.classList.contains("showing") ? (Be.classList.remove("showing"),
                        ye.innerText = "Settings") : (Be.classList.add("showing"),
                        ye.innerText = "Close")
                    }
                    )),
                    r.hookTouchEvents(me),
                    ke.onclick = r.checkTrusted((function() {
                        bn(),
                        "block" != Xe.style.display ? zt() : Xe.style.display = "none"
                    }
                    )),
                    r.hookTouchEvents(ke),
                    ve.onclick = r.checkTrusted((function() {
                        "block" != et.style.display ? (et.style.display = "block",
                        Xe.style.display = "none",
                        hn(),
                        Qt()) : et.style.display = "none"
                    }
                    )),
                    r.hookTouchEvents(ve),
                    we.onclick = r.checkTrusted((function() {
                        cn()
                    }
                    )),
                    r.hookTouchEvents(we),
                    Je.onclick = r.checkTrusted((function() {
                        En()
                    }
                    )),
                    r.hookTouchEvents(Je),
                    function() {
                        for (var e = 0; e < Ln.length; ++e) {
                            var t = new Image;
                            t.onload = function() {
                                this.isLoaded = !0
                            }
                            ,
                            t.src = ".././img/icons/" + Ln[e] + ".png",
                            Un[Ln[e]] = t
                        }
                    }(),
                    Ce.style.display = "none",
                    Pe.style.display = "block",
                    He.value = M("moo_name") || "",
                    function() {
                        var e = M("native_resolution");
                        rn(e ? "true" == e : "undefined" != typeof cordova),
                        P = "true" == M("show_ping"),
                        Me.hidden = !P,
                        M("moo_moosic"),
                        sn(),
                        r.removeAllChildren(Oe);
                        for (var t = 0; t < c.weapons.length + c.list.length; ++t)
                            !function(e) {
                                r.generateElement({
                                    id: "actionBarItem" + e,
                                    class: "actionBarItem",
                                    style: "display:none",
                                    onmouseout: function() {
                                        At()
                                    },
                                    parent: Oe
                                })
                            }(t);
                        for (t = 0; t < c.list.length + c.weapons.length; ++t)
                            !function(e) {
                                var t = document.createElement("canvas");
                                t.width = t.height = 66;
                                var n = t.getContext("2d");
                                if (n.translate(t.width / 2, t.height / 2),
                                n.imageSmoothingEnabled = !1,
                                n.webkitImageSmoothingEnabled = !1,
                                n.mozImageSmoothingEnabled = !1,
                                c.weapons[e]) {
                                    n.rotate(Math.PI / 4 + Math.PI);
                                    var i = new Image;
                                    ii[c.weapons[e].src] = i,
                                    i.onload = function() {
                                        this.isLoaded = !0;
                                        var i = 1 / (this.height / this.width)
                                          , r = c.weapons[e].iPad || 1;
                                        n.drawImage(this, -t.width * r * a.iconPad * i / 2, -t.height * r * a.iconPad / 2, t.width * r * i * a.iconPad, t.height * r * a.iconPad),
                                        n.fillStyle = "rgba(0, 0, 70, 0.1)",
                                        n.globalCompositeOperation = "source-atop",
                                        n.fillRect(-t.width / 2, -t.height / 2, t.width, t.height),
                                        document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")"
                                    }
                                    ,
                                    i.src = ".././img/weapons/" + c.weapons[e].src + ".png",
                                    (s = document.getElementById("actionBarItem" + e)).onmouseover = r.checkTrusted((function() {
                                        At(c.weapons[e], !0)
                                    }
                                    )),
                                    s.onclick = r.checkTrusted((function() {
                                        Mn(e, !0)
                                    }
                                    )),
                                    r.hookTouchEvents(s)
                                } else {
                                    i = ci(c.list[e - c.weapons.length], !0);
                                    var s, o = Math.min(t.width - a.iconPadding, i.width);
                                    n.globalAlpha = 1,
                                    n.drawImage(i, -o / 2, -o / 2, o, o),
                                    n.fillStyle = "rgba(0, 0, 70, 0.1)",
                                    n.globalCompositeOperation = "source-atop",
                                    n.fillRect(-o / 2, -o / 2, o, o),
                                    document.getElementById("actionBarItem" + e).style.backgroundImage = "url(" + t.toDataURL() + ")",
                                    (s = document.getElementById("actionBarItem" + e)).onmouseover = r.checkTrusted((function() {
                                        At(c.list[e - c.weapons.length])
                                    }
                                    )),
                                    s.onclick = r.checkTrusted((function() {
                                        Mn(e - c.weapons.length)
                                    }
                                    )),
                                    r.hookTouchEvents(s)
                                }
                            }(t);
                        He.ontouchstart = r.checkTrusted((function(e) {
                            e.preventDefault();
                            var t = prompt("enter name", e.currentTarget.value);
                            e.currentTarget.value = t.slice(0, 15)
                        }
                        )),
                        Ie.checked = A,
                        Ie.onchange = r.checkTrusted((function(e) {
                            rn(e.target.checked)
                        }
                        )),
                        Ee.checked = P,
                        Ee.onchange = r.checkTrusted((function(e) {
                            P = Ee.checked,
                            Me.hidden = !P,
                            E("show_ping", P ? "true" : "false")
                        }
                        ))
                    }())
                }
                ), {
                    1: Bn,
                    2: Si,
                    4: Ti,
                    5: Vn,
                    6: di,
                    7: Kn,
                    8: pi,
                    9: Ei,
                    11: On,
                    12: _n,
                    13: jn,
                    14: Ii,
                    15: Hn,
                    16: zn,
                    17: nn,
                    18: mi,
                    19: yi,
                    20: Li,
                    33: Ci,
                    35: Pi,
                    a: vi,
                    aa: ki,
                    ac: Dt,
                    ad: Ft,
                    an: jt,
                    ch: pn,
                    d: mt,
                    h: Bi,
                    id: lt,
                    mm: Kt,
                    p: Gt,
                    pp: Di,
                    sa: Lt,
                    sp: gi,
                    st: Ut,
                    t: Cn,
                    b: st.addBait,
                    us: $t
                }),
                kt(),
                setTimeout(()=>vt(), 3e3)
            }
            ), (function(e) {
                console.error("Vultr error:", e),
                alert("Error:\n" + e),
                mt("disconnected")
            }
            ))
        }
        var x = new p(a,r)
          , S = Math.PI
          , T = 2 * S;
        Math.lerpAngle = function(e, t, n) {
            Math.abs(t - e) > S && (e > t ? t += T : e += T);
            var i = t + (e - t) * n;
            return i >= 0 && i <= T ? i : i % T
        }
        ,
        CanvasRenderingContext2D.prototype.roundRect = function(e, t, n, i, r) {
            return n < 2 * r && (r = n / 2),
            i < 2 * r && (r = i / 2),
            r < 0 && (r = 0),
            this.beginPath(),
            this.moveTo(e + r, t),
            this.arcTo(e + n, t, e + n, t + i, r),
            this.arcTo(e + n, t + i, e, t + i, r),
            this.arcTo(e, t + i, e, t, r),
            this.arcTo(e, t, e + n, t, r),
            this.closePath(),
            this
        }
        ;
        var I = "undefined" != typeof Storage;
        function E(e, t) {
            I && localStorage.setItem(e, t)
        }
        function M(e) {
            return I ? localStorage.getItem(e) : null
        }
        M("consent") || (consentBlock.style.display = "block"),
        window.checkTerms = function(e) {
            e ? (consentBlock.style.display = "none",
            E("consent", 1)) : $("#consentShake").effect("shake")
        }
        ;
        var A, P, B, C, R, O, j, _, D, U, L, F, z, H, V = M("moofoll"), Y = 1, q = Date.now(), W = [], N = [], X = [], G = [], K = [], J = new d(f,K,N,W,st,c,a,r), Q = n(69), Z = n(70), ee = new Q(W,Z,N,c,null,a,r), te = 1, ne = 0, ie = 0, re = 0, se = {
            id: -1,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        }, ae = {
            id: -1,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        }, oe = 0, ce = a.maxScreenWidth, le = a.maxScreenHeight, he = !1, ue = (document.getElementById("ad-container"),
        document.getElementById("mainMenu")), fe = document.getElementById("enterGame"), de = document.getElementById("promoImg"), pe = document.getElementById("partyButton"), ge = document.getElementById("joinPartyButton"), me = document.getElementById("settingsButton"), ye = me.getElementsByTagName("span")[0], ke = document.getElementById("allianceButton"), ve = document.getElementById("storeButton"), we = document.getElementById("chatButton"), be = document.getElementById("gameCanvas");
        const xe = document.getElementById("darkness");
        var Se = be.getContext("2d")
          , Te = document.getElementById("serverBrowser")
          , Ie = document.getElementById("nativeResolution")
          , Ee = document.getElementById("showPing")
          , Me = (document.getElementById("playMusic"),
        document.getElementById("pingDisplay"))
          , Ae = document.getElementById("shutdownDisplay")
          , Pe = document.getElementById("menuCardHolder")
          , Be = document.getElementById("guideCard")
          , Ce = document.getElementById("loadingText")
          , Re = document.getElementById("gameUI")
          , Oe = document.getElementById("actionBar")
          , je = document.getElementById("scoreDisplay")
          , _e = document.getElementById("foodDisplay")
          , De = document.getElementById("woodDisplay")
          , Ue = document.getElementById("stoneDisplay")
          , Le = document.getElementById("killCounter")
          , Fe = document.getElementById("timeOfDay")
          , ze = document.getElementById("leaderboardData")
          , He = document.getElementById("nameInput")
          , Ve = document.getElementById("itemInfoHolder")
          , Ye = document.getElementById("ageText")
          , qe = document.getElementById("ageBarBody")
          , We = document.getElementById("upgradeHolder")
          , Ne = document.getElementById("upgradeCounter")
          , Xe = document.getElementById("allianceMenu")
          , Ge = document.getElementById("allianceHolder")
          , Ke = document.getElementById("allianceManager")
          , Je = document.getElementById("mapDisplay")
          , $e = document.getElementById("diedText")
          , Qe = document.getElementById("skinColorHolder")
          , Ze = Je.getContext("2d");
        Je.width = 300,
        Je.height = 300;
        var et = document.getElementById("storeMenu")
          , tt = document.getElementById("storeHolder")
          , nt = document.getElementById("noticationDisplay")
          , it = u.hats
          , rt = u.accessories
          , st = new l(o,G,r,a,null,null,c)
          , at = "#525252"
          , ot = "#3d3f42";
        let ct = 0;
        function lt(e) {
            X = e.teams
        }
        e.DARKNESS = 0;
        var ht = document.getElementById("featuredYoutube")
          , ut = [{
            name: "Corrupt X",
            link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"
        }, {
            name: "Tweak Big",
            link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"
        }, {
            name: "Arena Closer",
            link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"
        }, {
            name: "Godenot",
            link: "https://www.youtube.com/user/SirGodenot"
        }, {
            name: "RajNoobTV",
            link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"
        }, {
            name: "TomNotTom",
            link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"
        }, {
            name: "Nation",
            link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"
        }, {
            name: "Pidyohago",
            link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"
        }, {
            name: "Enigma",
            link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"
        }, {
            name: "Bauer",
            link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"
        }, {
            name: "iStealth",
            link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"
        }, {
            name: "SICKmania",
            link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"
        }, {
            name: "LightThief",
            link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"
        }, {
            name: "Fortish",
            link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"
        }, {
            name: "巧克力",
            link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"
        }, {
            name: "i Febag",
            link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"
        }, {
            name: "GoneGaming",
            link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"
        }]
          , ft = ut[r.randInt(0, ut.length - 1)];
        ht.innerHTML = "<a target='_blank' class='ytLink' href='" + ft.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + ft.name + "</a>";
        var dt = !0
          , pt = !1
          , gt = !1;
        function mt(e) {
            i.close(),
            yt(e)
        }
        function yt(e) {
            ue.style.display = "block",
            Re.style.display = "none",
            Pe.style.display = "none",
            $e.style.display = "none",
            Ce.style.display = "block",
            Ce.innerHTML = e + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>"
        }
        window.onblur = function() {
            dt = !1
        }
        ,
        window.onfocus = function() {
            dt = !0,
            j && j.alive && bn()
        }
        ,
        window.onload = function() {
            pt = !0,
            w(),
            setTimeout((function() {
                v || (alert("Captcha failed to load"),
                window.location.reload())
            }
            ), 2e4)
        }
        ,
        window.captchaCallback = function() {
            gt = !0,
            w()
        }
        ,
        be.oncontextmenu = function() {
            return !1
        }
        ;
        function kt() {
            var e, t, n = "", i = 0;
            for (var r in m.servers) {
                for (var s = m.servers[r], o = 0, c = 0; c < s.length; c++)
                    for (var l = 0; l < s[c].games.length; l++)
                        o += s[c].games[l].playerCount;
                i += o;
                var h = m.regionInfo[r].name;
                n += "<option disabled>" + h + " - " + o + " players</option>";
                for (var u = 0; u < s.length; u++)
                    for (var f = s[u], d = 0; d < f.games.length; d++) {
                        var p = f.games[d]
                          , g = 1 * f.index + d + 1
                          , y = m.server && m.server.region === f.region && m.server.index === f.index && m.gameIndex == d
                          , k = h + " " + g + " [" + Math.min(p.playerCount, a.maxPlayers) + "/" + a.maxPlayers + "]";
                        let e = m.stripRegion(r) + ":" + u + ":" + d;
                        y && (pe.getElementsByTagName("span")[0].innerText = e),
                        n += "<option value='" + e + "' " + (y ? "selected" : "") + ">" + k + "</option>"
                    }
                n += "<option disabled></option>"
            }
            n += "<option disabled>All Servers - " + i + " players</option>",
            Te.innerHTML = n,
            "sandbox.moomoo.io" == location.hostname ? (e = "Back to MooMoo",
            t = "//moomoo.io/") : (e = "Try the sandbox",
            t = "//sandbox.moomoo.io/"),
            document.getElementById("altServer").innerHTML = "<a href='" + t + "'>" + e + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>"
        }
        function vt() {
            var e = new XMLHttpRequest;
            e.onreadystatechange = function() {
                4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText),
                m.processServers(vultr.servers),
                kt()) : console.error("Failed to load server data with status code:", this.status))
            }
            ,
            e.open("GET", "http://moomoo.io/serverData", !0),
            e.send()
        }
        Te.addEventListener("change", r.checkTrusted((function() {
            let e = Te.value.split(":");
            m.switchServer(e[0], e[1], e[2])
        }
        )));
        var wt = document.getElementById("pre-content-container")
          , bt = null
          , xt = null;
        window.cpmstarAPI((function(e) {
            e.game.setTarget(wt),
            xt = e
        }
        ));
        var St = 3e5
          , Tt = 0
          , It = 0;
        function Et() {
            if (!cpmstarAPI || !xt)
                return console.log("Failed to load video ad API", !!cpmstarAPI, !!xt),
                void An();
            (bt = new xt.game.RewardedVideoView("rewardedvideo")).addEventListener("ad_closed", (function(e) {
                console.log("Video ad closed"),
                Mt()
            }
            )),
            bt.addEventListener("loaded", (function(e) {
                console.log("Video ad loaded"),
                bt.show()
            }
            )),
            bt.addEventListener("load_failed", (function(e) {
                console.log("Video ad load failed", e),
                Mt()
            }
            )),
            bt.load(),
            wt.style.display = "block"
        }
        function Mt() {
            wt.style.display = "none",
            An()
        }
        function At(e, t, n) {
            if (j && e)
                if (r.removeAllChildren(Ve),
                Ve.classList.add("visible"),
                r.generateElement({
                    id: "itemInfoName",
                    text: r.capitalizeFirst(e.name),
                    parent: Ve
                }),
                r.generateElement({
                    id: "itemInfoDesc",
                    text: e.desc,
                    parent: Ve
                }),
                n)
                    ;
                else if (t)
                    r.generateElement({
                        class: "itemInfoReq",
                        text: e.type ? "secondary" : "primary",
                        parent: Ve
                    });
                else {
                    for (var i = 0; i < e.req.length; i += 2)
                        r.generateElement({
                            class: "itemInfoReq",
                            html: e.req[i] + "<span class='itemInfoReqVal'> x" + e.req[i + 1] + "</span>",
                            parent: Ve
                        });
                    e.group.limit && r.generateElement({
                        class: "itemInfoLmt",
                        text: (j.itemCounts[e.group.id] || 0) + "/" + e.group.limit,
                        parent: Ve
                    })
                }
            else
                Ve.classList.remove("visible")
        }
        window.showPreAd = Et;
        var Pt, Bt, Ct, Rt = [], Ot = [];
        function jt(e, t) {
            Rt.push({
                sid: e,
                name: t
            }),
            _t()
        }
        function _t() {
            if (Rt[0]) {
                var e = Rt[0];
                r.removeAllChildren(nt),
                nt.style.display = "block",
                r.generateElement({
                    class: "notificationText",
                    text: e.name,
                    parent: nt
                }),
                r.generateElement({
                    class: "notifButton",
                    html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                    parent: nt,
                    onclick: function() {
                        Ht(0)
                    },
                    hookTouch: !0
                }),
                r.generateElement({
                    class: "notifButton",
                    html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                    parent: nt,
                    onclick: function() {
                        Ht(1)
                    },
                    hookTouch: !0
                })
            } else
                nt.style.display = "none"
        }
        function Dt(e) {
            X.push(e),
            "block" == Xe.style.display && zt()
        }
        function Ut(e, t) {
            j && (j.team = e,
            j.isOwner = t,
            "block" == Xe.style.display && zt())
        }
        function Lt(e) {
            Ot = e,
            "block" == Xe.style.display && zt()
        }
        function Ft(e) {
            for (var t = X.length - 1; t >= 0; t--)
                X[t].sid == e && X.splice(t, 1);
            "block" == Xe.style.display && zt()
        }
        function zt() {
            if (j && j.alive) {
                if (hn(),
                et.style.display = "none",
                Xe.style.display = "block",
                r.removeAllChildren(Ge),
                j.team)
                    for (var e = 0; e < Ot.length; e += 2)
                        !function(e) {
                            var t = r.generateElement({
                                class: "allianceItem",
                                style: "color:" + (Ot[e] == j.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: Ot[e + 1],
                                parent: Ge
                            });
                            j.isOwner && Ot[e] != j.sid && r.generateElement({
                                class: "joinAlBtn",
                                text: "Kick",
                                onclick: function() {
                                    Vt(Ot[e])
                                },
                                hookTouch: !0,
                                parent: t
                            })
                        }(e);
                else if (X.length)
                    for (e = 0; e < X.length; ++e)
                        !function(e) {
                            var t = r.generateElement({
                                class: "allianceItem",
                                style: "color:" + (X[e].sid == j.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: X[e].sid,
                                parent: Ge
                            });
                            r.generateElement({
                                class: "joinAlBtn",
                                text: "Join",
                                onclick: function() {
                                    Yt(e)
                                },
                                hookTouch: !0,
                                parent: t
                            })
                        }(e);
                else
                    r.generateElement({
                        class: "allianceItem",
                        text: "No Tribes Yet",
                        parent: Ge
                    });
                r.removeAllChildren(Ke),
                j.team ? r.generateElement({
                    class: "allianceButtonM",
                    style: "width: 360px",
                    text: j.isOwner ? "Delete Tribe" : "Leave Tribe",
                    onclick: function() {
                        Wt()
                    },
                    hookTouch: !0,
                    parent: Ke
                }) : (r.generateElement({
                    tag: "input",
                    type: "text",
                    id: "allianceInput",
                    maxLength: 7,
                    placeholder: "unique name",
                    ontouchstart: function(e) {
                        e.preventDefault();
                        var t = prompt("unique name", e.currentTarget.value);
                        e.currentTarget.value = t.slice(0, 7)
                    },
                    parent: Ke
                }),
                r.generateElement({
                    tag: "div",
                    class: "allianceButtonM",
                    style: "width: 140px;",
                    text: "Create",
                    onclick: function() {
                        qt()
                    },
                    hookTouch: !0,
                    parent: Ke
                }))
            }
        }
        function Ht(e) {
            i.send("11", Rt[0].sid, e),
            Rt.splice(0, 1),
            _t()
        }
        function Vt(e) {
            i.send("12", e)
        }
        function Yt(e) {
            i.send("10", X[e].sid)
        }
        function qt() {
            i.send("8", document.getElementById("allianceInput").value)
        }
        function Wt() {
            Rt = [],
            _t(),
            i.send("9")
        }
        var Nt, Xt = [];
        function Gt(e, t) {
            for (var n = 0; n < Xt.length; ++n)
                if (!Xt[n].active) {
                    Nt = Xt[n];
                    break
                }
            Nt || (Nt = new function() {
                this.init = function(e, t) {
                    this.scale = 0,
                    this.x = e,
                    this.y = t,
                    this.active = !0
                }
                ,
                this.update = function(e, t) {
                    this.active && (this.scale += .05 * t,
                    this.scale >= a.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / a.mapPingScale),
                    e.beginPath(),
                    e.arc(this.x / a.mapScale * Je.width, this.y / a.mapScale * Je.width, this.scale, 0, 2 * Math.PI),
                    e.stroke()))
                }
            }
            ,
            Xt.push(Nt)),
            Nt.init(e, t)
        }
        function Kt(e) {
            Bt = e
        }
        var Jt = 0;
        function $t(e, t, n) {
            n ? e ? j.tailIndex = t : j.tails[t] = 1 : e ? j.skinIndex = t : j.skins[t] = 1,
            "block" == et.style.display && Qt()
        }
        function Qt() {
            if (j) {
                r.removeAllChildren(tt);
                for (var e = Jt, t = e ? rt : it, n = 0; n < t.length; ++n)
                    t[n].dontSell || function(n) {
                        var i = r.generateElement({
                            id: "storeDisplay" + n,
                            class: "storeItem",
                            onmouseout: function() {
                                At()
                            },
                            onmouseover: function() {
                                At(t[n], !1, !0)
                            },
                            parent: tt
                        });
                        r.hookTouchEvents(i, !0),
                        r.generateElement({
                            tag: "img",
                            class: "hatPreview",
                            src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png",
                            parent: i
                        }),
                        r.generateElement({
                            tag: "span",
                            text: t[n].name,
                            parent: i
                        }),
                        (e ? j.tails[t[n].id] : j.skins[t[n].id]) ? (e ? j.tailIndex : j.skinIndex) == t[n].id ? r.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Unequip",
                            onclick: function() {
                                Zt(0, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }) : r.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Equip",
                            onclick: function() {
                                Zt(t[n].id, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }) : (r.generateElement({
                            class: "joinAlBtn",
                            style: "margin-top: 5px",
                            text: "Buy",
                            onclick: function() {
                                en(t[n].id, e)
                            },
                            hookTouch: !0,
                            parent: i
                        }),
                        r.generateElement({
                            tag: "span",
                            class: "itemPrice",
                            text: t[n].price,
                            parent: i
                        }))
                    }(n)
            }
        }
        function Zt(e, t) {
            i.send("13c", 0, e, t)
        }
        function en(e, t) {
            i.send("13c", 1, e, t)
        }
        function tn() {
            et.style.display = "none",
            Xe.style.display = "none",
            hn()
        }
        function nn(e, t) {
            e && (t ? j.weapons = e : j.items = e);
            for (var n = 0; n < c.list.length; ++n) {
                var i = c.weapons.length + n;
                document.getElementById("actionBarItem" + i).style.display = j.items.indexOf(c.list[n].id) >= 0 ? "inline-block" : "none"
            }
            for (n = 0; n < c.weapons.length; ++n)
                document.getElementById("actionBarItem" + n).style.display = j.weapons[c.weapons[n].type] == c.weapons[n].id ? "inline-block" : "none"
        }
        function rn(e) {
            A = e,
            Y = e && window.devicePixelRatio || 1,
            Ie.checked = e,
            E("native_resolution", e.toString()),
            gn()
        }
        function sn() {
            for (var e = "", t = 0; t < a.skinColors.length; ++t)
                e += t == oe ? "<div class='skinColorItem activeSkin' style='background-color:" + a.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : "<div class='skinColorItem' style='background-color:" + a.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
            Qe.innerHTML = e
        }
        var an = document.getElementById("chatBox")
          , on = document.getElementById("chatHolder");
        function cn() {
            un ? setTimeout((function() {
                var e = prompt("chat message");
                e && ln(e)
            }
            ), 1) : "block" == on.style.display ? (an.value && ln(an.value),
            hn()) : (et.style.display = "none",
            Xe.style.display = "none",
            on.style.display = "block",
            an.focus(),
            bn()),
            an.value = ""
        }
        function ln(e) {
            i.send("ch", e.slice(0, 30))
        }
        function hn() {
            an.value = "",
            on.style.display = "none"
        }
        var un, fn, dn = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
        function pn(e, t) {
            var n = Ri(e);
            n && (n.chatMessage = function(e) {
                for (var t, n = 0; n < dn.length; ++n)
                    if (e.indexOf(dn[n]) > -1) {
                        t = "";
                        for (var i = 0; i < dn[n].length; ++i)
                            t += t.length ? "o" : "M";
                        var r = new RegExp(dn[n],"g");
                        e = e.replace(r, t)
                    }
                return e
            }(t),
            n.chatCountdown = a.chatCountdown)
        }
        function gn() {
            z = window.innerWidth,
            H = window.innerHeight;
            var e = Math.max(z / ce, H / le) * Y;
            be.width = z * Y,
            be.height = H * Y,
            be.style.width = z + "px",
            be.style.height = H + "px",
            Se.setTransform(e, 0, 0, e, (z * Y - ce * e) / 2, (H * Y - le * e) / 2)
        }
        function mn(e) {
            (un = e) ? Be.classList.add("touch") : Be.classList.remove("touch")
        }
        function yn(e) {
            e.preventDefault(),
            e.stopPropagation(),
            mn(!0);
            for (var t = 0; t < e.changedTouches.length; t++) {
                var n = e.changedTouches[t];
                n.identifier == se.id ? (se.id = -1,
                In()) : n.identifier == ae.id && (ae.id = -1,
                j.buildIndex >= 0 && (O = 1,
                Sn()),
                O = 0,
                Sn())
            }
        }
        function kn() {
            return j ? (-1 != ae.id ? fn = Math.atan2(ae.currentY - ae.startY, ae.currentX - ae.startX) : j.lockDir || un || (fn = Math.atan2(re - H / 2, ie - z / 2)),
            r.fixTo(fn || 0, 2)) : 0
        }
        window.addEventListener("resize", r.checkTrusted(gn)),
        gn(),
        mn(!1),
        window.setUsingTouch = mn,
        be.addEventListener("touchmove", r.checkTrusted((function(e) {
            e.preventDefault(),
            e.stopPropagation(),
            mn(!0);
            for (var t = 0; t < e.changedTouches.length; t++) {
                var n = e.changedTouches[t];
                n.identifier == se.id ? (se.currentX = n.pageX,
                se.currentY = n.pageY,
                In()) : n.identifier == ae.id && (ae.currentX = n.pageX,
                ae.currentY = n.pageY,
                O = 1)
            }
        }
        )), !1),
        be.addEventListener("touchstart", r.checkTrusted((function(e) {
            e.preventDefault(),
            e.stopPropagation(),
            mn(!0);
            for (var t = 0; t < e.changedTouches.length; t++) {
                var n = e.changedTouches[t];
                n.pageX < document.body.scrollWidth / 2 && -1 == se.id ? (se.id = n.identifier,
                se.startX = se.currentX = n.pageX,
                se.startY = se.currentY = n.pageY,
                In()) : n.pageX > document.body.scrollWidth / 2 && -1 == ae.id && (ae.id = n.identifier,
                ae.startX = ae.currentX = n.pageX,
                ae.startY = ae.currentY = n.pageY,
                j.buildIndex < 0 && (O = 1,
                Sn()))
            }
        }
        )), !1),
        be.addEventListener("touchend", r.checkTrusted(yn), !1),
        be.addEventListener("touchcancel", r.checkTrusted(yn), !1),
        be.addEventListener("touchleave", r.checkTrusted(yn), !1),
        be.addEventListener("mousemove", (function(e) {
            e.preventDefault(),
            e.stopPropagation(),
            mn(!1),
            ie = e.clientX,
            re = e.clientY
        }
        ), !1),
        be.addEventListener("mousedown", (function(e) {
            mn(!1),
            1 != O && (O = 1,
            Sn())
        }
        ), !1),
        be.addEventListener("mouseup", (function(e) {
            mn(!1),
            0 != O && (O = 0,
            Sn())
        }
        ), !1);
        var vn = {}
          , wn = {
            87: [0, -1],
            38: [0, -1],
            83: [0, 1],
            40: [0, 1],
            65: [-1, 0],
            37: [-1, 0],
            68: [1, 0],
            39: [1, 0]
        };
        function bn() {
            vn = {},
            i.send("rmd")
        }
        function xn() {
            return "block" != Xe.style.display && "block" != on.style.display
        }
        function Sn() {
            j && j.alive && i.send("c", O, j.buildIndex >= 0 ? kn() : null)
        }
        window.addEventListener("keydown", r.checkTrusted((function(e) {
            var t = e.which || e.keyCode || 0;
            27 == t ? tn() : j && j.alive && xn() && (vn[t] || (vn[t] = 1,
            69 == t ? i.send("7", 1) : 67 == t ? (Ct || (Ct = {}),
            Ct.x = j.x,
            Ct.y = j.y) : 88 == t ? (j.lockDir = j.lockDir ? 0 : 1,
            i.send("7", 0)) : null != j.weapons[t - 49] ? Mn(j.weapons[t - 49], !0) : null != j.items[t - 49 - j.weapons.length] ? Mn(j.items[t - 49 - j.weapons.length]) : 81 == t ? Mn(j.items[0]) : 82 == t ? En() : wn[t] ? In() : 32 == t && (O = 1,
            Sn())))
        }
        ))),
        window.addEventListener("keyup", r.checkTrusted((function(e) {
            if (j && j.alive) {
                var t = e.which || e.keyCode || 0;
                13 == t ? cn() : xn() && vn[t] && (vn[t] = 0,
                wn[t] ? In() : 32 == t && (O = 0,
                Sn()))
            }
        }
        )));
        var Tn = void 0;
        function In() {
            var e = function() {
                var e = 0
                  , t = 0;
                if (-1 != se.id)
                    e += se.currentX - se.startX,
                    t += se.currentY - se.startY;
                else
                    for (var n in wn) {
                        var i = wn[n];
                        e += !!vn[n] * i[0],
                        t += !!vn[n] * i[1]
                    }
                return 0 == e && 0 == t ? void 0 : r.fixTo(Math.atan2(t, e), 2)
            }();
            (null == Tn || null == e || Math.abs(e - Tn) > .3) && (i.send("33", e),
            Tn = e)
        }
        function En() {
            i.send("14", 1)
        }
        function Mn(e, t) {
            i.send("5", e, t)
        }
        function An() {
            E("moo_name", He.value),
            !he && i.connected && (he = !0,
            x.stop("menu"),
            yt("Loading..."),
            i.send("sp", {
                name: He.value,
                moofoll: V,
                skin: oe
            }))
        }
        var Pn = !0;
        function Bn(e) {
            Ce.style.display = "none",
            Pe.style.display = "block",
            ue.style.display = "none",
            vn = {},
            _ = e,
            O = 0,
            he = !0,
            Pn && (Pn = !1,
            G.length = 0)
        }
        function Cn(e, t, n, i) {
            g.showText(e, t, 50, .18, 500, Math.abs(n), n >= 0 ? "#fff" : "#8ecc51")
        }
        var Rn = 99999;
        function On() {
            he = !1;
            try {
                factorem.refreshAds([2], !0)
            } catch (e) {}
            Re.style.display = "none",
            tn(),
            Pt = {
                x: j.x,
                y: j.y
            },
            Ce.style.display = "none",
            $e.style.display = "block",
            $e.style.fontSize = "0px",
            Rn = 0,
            setTimeout((function() {
                Pe.style.display = "block",
                ue.style.display = "block",
                $e.style.display = "none"
            }
            ), a.deathFadeout),
            vt()
        }
        function jn(e) {
            j && st.removeAllItems(e)
        }
        function _n(e) {
            st.disableBySid(e)
        }
        function Dn() {
            je.innerText = j.points,
            _e.innerText = j.food,
            De.innerText = j.wood,
            Ue.innerText = j.stone,
            Le.innerText = j.kills
        }
        var Un = {}
          , Ln = ["crown", "skull"]
          , Fn = [];
        function zn(e, t) {
            if (j.upgradePoints = e,
            j.upgrAge = t,
            e > 0) {//&& (null == c.weapons[n].pre || j.weapons.indexOf(c.weapons[n].pre) >= 0)
                Fn.length = 0,
                r.removeAllChildren(We);
                for (var n = 0; n < c.weapons.length; ++n)
                    c.weapons[n].age == t && (r.generateElement({
                        id: "upgradeItem" + n,
                        class: "actionBarItem",
                        onmouseout: function() {
                            At()
                        },
                        parent: We
                    }).style.backgroundImage = document.getElementById("actionBarItem" + n).style.backgroundImage,
                    Fn.push(n));// && (null == c.list[n].pre || j.items.indexOf(c.list[n].pre) >= 0)
                for (n = 0; n < c.list.length; ++n)
                    if (c.list[n].age == t) {
                        var s = c.weapons.length + n;
                        r.generateElement({
                            id: "upgradeItem" + s,
                            class: "actionBarItem",
                            onmouseout: function() {
                                At()
                            },
                            parent: We
                        }).style.backgroundImage = document.getElementById("actionBarItem" + s).style.backgroundImage,
                        Fn.push(s)
                    }
                for (n = 0; n < Fn.length; n++)
                    !function(e) {
                        var t = document.getElementById("upgradeItem" + e);
                        t.onmouseover = function() {
                            c.weapons[e] ? At(c.weapons[e], !0) : At(c.list[e - c.weapons.length])
                        }
                        ,
                        t.onclick = r.checkTrusted((function() {
                            i.send("6", e)
                        }
                        )),
                        r.hookTouchEvents(t)
                    }(Fn[n]);
                Fn.length ? (We.style.display = "block",
                Ne.style.display = "block",
                Ne.innerHTML = "SELECT ITEMS (" + e + ")") : (We.style.display = "none",
                Ne.style.display = "none",
                At())
            } else
                We.style.display = "none",
                Ne.style.display = "none",
                At()
        }
        function Hn(e, t, n) {
            null != e && (j.XP = e),
            null != t && (j.maxXP = t),
            null != n && (j.age = n),
            n == a.maxAge ? (Ye.innerHTML = "MAX AGE",
            qe.style.width = "100%") : (Ye.innerHTML = "AGE " + j.age,
            qe.style.width = j.XP / j.maxXP * 100 + "%")
        }
        function Vn(e) {
            r.removeAllChildren(ze);
            for (var t = 1, n = 0; n < e.length; n += 3)
                !function(n) {
                    r.generateElement({
                        class: "leaderHolder",
                        parent: ze,
                        children: [r.generateElement({
                            class: "leaderboardItem",
                            style: "color:" + (e[n] == _ ? "#fff" : "rgba(255,255,255,0.6)"),
                            text: t + ". " + ("" != e[n + 1] ? e[n + 1] : "unknown")
                        }), r.generateElement({
                            class: "leaderScore",
                            text: r.kFormat(e[n + 2]) || "0"
                        })]
                    })
                }(n),
                t++
        }
        function Yn(e, t, n, i) {
            Se.save(),
            Se.setTransform(1, 0, 0, 1, 0, 0),
            Se.scale(Y, Y);
            var r = 50;
            Se.beginPath(),
            Se.arc(e, t, r, 0, 2 * Math.PI, !1),
            Se.closePath(),
            Se.fillStyle = "rgba(255, 255, 255, 0.3)",
            Se.fill(),
            r = 50;
            var s = n - e
              , a = i - t
              , o = Math.sqrt(Math.pow(s, 2) + Math.pow(a, 2))
              , c = o > r ? o / r : 1;
            s /= c,
            a /= c,
            Se.beginPath(),
            Se.arc(e + s, t + a, .5 * r, 0, 2 * Math.PI, !1),
            Se.closePath(),
            Se.fillStyle = "white",
            Se.fill(),
            Se.restore()
        }
        function qn(e, t, n) {
            for (var i = 0; i < K.length; ++i)
                (D = K[i]).active && D.layer == e && (D.update(B),
                D.active && xi(D.x - t, D.y - n, D.scale) && (Se.save(),
                Se.translate(D.x - t, D.y - n),
                Se.rotate(D.dir),
                Nn(0, 0, D, Se, 1),
                Se.restore()))
        }
        var Wn = {};
        function Nn(e, t, n, i, r) {
            if (n.src) {
                var s = c.projectiles[n.indx].src
                  , a = Wn[s];
                a || ((a = new Image).onload = function() {
                    this.isLoaded = !0
                }
                ,
                a.src = ".././img/weapons/" + s + ".png",
                Wn[s] = a),
                a.isLoaded && i.drawImage(a, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale)
            } else
                1 == n.indx && (i.fillStyle = "#939393",
                li(e, t, n.scale, i))
        }
        function Xn(e, t, n, i) {
            var r = a.riverWidth + i
              , s = a.mapScale / 2 - t - r / 2;
            s < le && s + r > 0 && n.fillRect(0, s, ce, r)
        }
        function Gn(e, t, n) {
            for (var i, r, s, a = 0; a < G.length; ++a)
                (D = G[a]).active && (r = D.x + D.xWiggle - t,
                s = D.y + D.yWiggle - n,
                0 == e && D.update(B),
                D.layer == e && xi(r, s, D.scale + (D.blocker || 0)) && (Se.globalAlpha = D.hideFromEnemy ? .6 : 1,
                D.isItem ? (i = ci(D),
                Se.save(),
                Se.translate(r, s),
                Se.rotate(D.dir),
                Se.drawImage(i, -i.width / 2, -i.height / 2),
                D.blocker && (Se.strokeStyle = "#db6e6e",
                Se.globalAlpha = .3,
                Se.lineWidth = 6,
                li(0, 0, D.blocker, Se, !1, !0)),
                Se.restore()) : (i = ai(D),
                Se.drawImage(i, r - i.width / 2, s - i.height / 2))))
        }
        function Kn(e, t, n) {
            (D = Ri(e)) && D.startAnim(t, n)
        }
        function Jn(e, t, n) {
            Se.globalAlpha = 1;
            for (var i = 0; i < N.length; ++i)
                (D = N[i]).zIndex == n && (D.animate(B),
                D.visible && (D.skinRot += .002 * B,
                F = (D == j ? kn() : D.dir) + D.dirPlus,
                Se.save(),
                Se.translate(D.x - e, D.y - t),
                Se.rotate(F),
                $n(D, Se),
                Se.restore()))
        }
        function $n(e, t) {
            (t = t || Se).lineWidth = 5.5,
            t.lineJoin = "miter";
            var n = Math.PI / 4 * (c.weapons[e.weaponIndex].armS || 1)
              , i = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndS || 1
              , r = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndD || 1;
            if (e.tailIndex > 0 && function(e, t, n) {
                if (!(Qn = ti[e])) {
                    var i = new Image;
                    i.onload = function() {
                        this.isLoaded = !0,
                        this.onload = null
                    }
                    ,
                    i.src = ".././img/accessories/access_" + e + ".png",
                    ti[e] = i,
                    Qn = i
                }
                var r = ni[e];
                if (!r) {
                    for (var s = 0; s < rt.length; ++s)
                        if (rt[s].id == e) {
                            r = rt[s];
                            break
                        }
                    ni[e] = r
                }
                Qn.isLoaded && (t.save(),
                t.translate(-20 - (r.xOff || 0), 0),
                r.spin && t.rotate(n.skinRot),
                t.drawImage(Qn, -r.scale / 2, -r.scale / 2, r.scale, r.scale),
                t.restore())
            }(e.tailIndex, t, e),
            e.buildIndex < 0 && !c.weapons[e.weaponIndex].aboveHand && (ri(c.weapons[e.weaponIndex], a.weaponVariants[e.weaponVariant].src, e.scale, 0, t),
            null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || Nn(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], Se)),
            t.fillStyle = a.skinColors[e.skinColor],
            li(e.scale * Math.cos(n), e.scale * Math.sin(n), 14),
            li(e.scale * r * Math.cos(-n * i), e.scale * r * Math.sin(-n * i), 14),
            e.buildIndex < 0 && c.weapons[e.weaponIndex].aboveHand && (ri(c.weapons[e.weaponIndex], a.weaponVariants[e.weaponVariant].src, e.scale, 0, t),
            null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || Nn(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], Se)),
            e.buildIndex >= 0) {
                var s = ci(c.list[e.buildIndex]);
                t.drawImage(s, e.scale - c.list[e.buildIndex].holdOffset, -s.width / 2)
            }
            li(0, 0, e.scale, t),
            e.skinIndex > 0 && (t.rotate(Math.PI / 2),
            function e(t, n, i, r) {
                if (!(Qn = Zn[t])) {
                    var s = new Image;
                    s.onload = function() {
                        this.isLoaded = !0,
                        this.onload = null
                    }
                    ,
                    s.src = ".././img/hats/hat_" + t + ".png",
                    Zn[t] = s,
                    Qn = s
                }
                var a = i || ei[t];
                if (!a) {
                    for (var o = 0; o < it.length; ++o)
                        if (it[o].id == t) {
                            a = it[o];
                            break
                        }
                    ei[t] = a
                }
                Qn.isLoaded && n.drawImage(Qn, -a.scale / 2, -a.scale / 2, a.scale, a.scale),
                !i && a.topSprite && (n.save(),
                n.rotate(r.skinRot),
                e(t + "_top", n, a, r),
                n.restore())
            }(e.skinIndex, t, null, e))
        }
        var Qn, Zn = {}, ei = {}, ti = {}, ni = {}, ii = {};
        function ri(e, t, n, i, r) {
            var s = e.src + (t || "")
              , a = ii[s];
            a || ((a = new Image).onload = function() {
                this.isLoaded = !0
            }
            ,
            a.src = ".././img/weapons/" + s + ".png",
            ii[s] = a),
            a.isLoaded && r.drawImage(a, n + e.xOff - e.length / 2, i + e.yOff - e.width / 2, e.length, e.width)
        }
        var si = {};
        function ai(e) {
            var t = e.y >= a.mapScale - a.snowBiomeTop ? 2 : e.y <= a.snowBiomeTop ? 1 : 0
              , n = e.type + "_" + e.scale + "_" + t
              , i = si[n];
            if (!i) {
                var s = document.createElement("canvas");
                s.width = s.height = 2.1 * e.scale + 5.5;
                var o = s.getContext("2d");
                if (o.translate(s.width / 2, s.height / 2),
                o.rotate(r.randFloat(0, Math.PI)),
                o.strokeStyle = at,
                o.lineWidth = 5.5,
                0 == e.type)
                    for (var c, l = 0; l < 2; ++l)
                        hi(o, 7, c = D.scale * (l ? .5 : 1), .7 * c),
                        o.fillStyle = t ? l ? "#fff" : "#e3f1f4" : l ? "#b4db62" : "#9ebf57",
                        o.fill(),
                        l || o.stroke();
                else if (1 == e.type)
                    if (2 == t)
                        o.fillStyle = "#606060",
                        hi(o, 6, .3 * e.scale, .71 * e.scale),
                        o.fill(),
                        o.stroke(),
                        o.fillStyle = "#89a54c",
                        li(0, 0, .55 * e.scale, o),
                        o.fillStyle = "#a5c65b",
                        li(0, 0, .3 * e.scale, o, !0);
                    else {
                        var h;
                        !function(e, t, n, i) {
                            var s, a = Math.PI / 2 * 3, o = Math.PI / 6;
                            e.beginPath(),
                            e.moveTo(0, -i);
                            for (var c = 0; c < 6; c++)
                                s = r.randInt(n + .9, 1.2 * n),
                                e.quadraticCurveTo(Math.cos(a + o) * s, Math.sin(a + o) * s, Math.cos(a + 2 * o) * i, Math.sin(a + 2 * o) * i),
                                a += 2 * o;
                            e.lineTo(0, -i),
                            e.closePath()
                        }(o, 0, D.scale, .7 * D.scale),
                        o.fillStyle = t ? "#e3f1f4" : "#89a54c",
                        o.fill(),
                        o.stroke(),
                        o.fillStyle = t ? "#6a64af" : "#c15555";
                        var u = T / 4;
                        for (l = 0; l < 4; ++l)
                            li((h = r.randInt(D.scale / 3.5, D.scale / 2.3)) * Math.cos(u * l), h * Math.sin(u * l), r.randInt(10, 12), o)
                    }
                else
                    2 != e.type && 3 != e.type || (o.fillStyle = 2 == e.type ? 2 == t ? "#938d77" : "#939393" : "#e0c655",
                    hi(o, 3, e.scale, e.scale),
                    o.fill(),
                    o.stroke(),
                    o.fillStyle = 2 == e.type ? 2 == t ? "#b2ab90" : "#bcbcbc" : "#ebdca3",
                    hi(o, 3, .55 * e.scale, .65 * e.scale),
                    o.fill());
                i = s,
                si[n] = i
            }
            return i
        }
        var oi = [];
        function ci(e, t) {
            var n = oi[e.id];
            if (!n || t) {
                var i = document.createElement("canvas");
                i.width = i.height = 2.5 * e.scale + 5.5 + (c.list[e.id].spritePadding || 0);
                var s = i.getContext("2d");
                if (s.translate(i.width / 2, i.height / 2),
                s.rotate(t ? 0 : Math.PI / 2),
                s.strokeStyle = at,
                s.lineWidth = 5.5 * (t ? i.width / 81 : 1),
                "apple" == e.name) {
                    s.fillStyle = "#c15555",
                    li(0, 0, e.scale, s),
                    s.fillStyle = "#89a54c";
                    var a = -Math.PI / 2;
                    !function(e, t, n, i, r) {
                        var s = e + 25 * Math.cos(i)
                          , a = t + 25 * Math.sin(i);
                        r.moveTo(e, t),
                        r.beginPath(),
                        r.quadraticCurveTo((e + s) / 2 + 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 + 10 * Math.sin(i + Math.PI / 2), s, a),
                        r.quadraticCurveTo((e + s) / 2 - 10 * Math.cos(i + Math.PI / 2), (t + a) / 2 - 10 * Math.sin(i + Math.PI / 2), e, t),
                        r.closePath(),
                        r.fill(),
                        r.stroke()
                    }(e.scale * Math.cos(a), e.scale * Math.sin(a), 0, a + Math.PI / 2, s)
                } else if ("cookie" == e.name) {
                    s.fillStyle = "#cca861",
                    li(0, 0, e.scale, s),
                    s.fillStyle = "#937c4b";
                    for (var o = T / (h = 4), l = 0; l < h; ++l)
                        li((u = r.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), r.randInt(4, 5), s, !0)
                } else if ("cheese" == e.name) {
                    var h, u;
                    for (s.fillStyle = "#f4f3ac",
                    li(0, 0, e.scale, s),
                    s.fillStyle = "#c3c28b",
                    o = T / (h = 4),
                    l = 0; l < h; ++l)
                        li((u = r.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(o * l), u * Math.sin(o * l), r.randInt(4, 5), s, !0)
                } else if ("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
                    s.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
                    var f = "castle wall" == e.name ? 4 : 3;
                    hi(s, f, 1.1 * e.scale, 1.1 * e.scale),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc",
                    hi(s, f, .65 * e.scale, .65 * e.scale),
                    s.fill()
                } else if ("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
                    s.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
                    var d = .6 * e.scale;
                    hi(s, "spikes" == e.name ? 5 : 6, e.scale, d),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#a5974c",
                    li(0, 0, d, s),
                    s.fillStyle = "#c9b758",
                    li(0, 0, d / 2, s, !0)
                } else if ("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name)
                    s.fillStyle = "#a5974c",
                    li(0, 0, e.scale, s),
                    s.fillStyle = "#c9b758",
                    fi(0, 0, 1.5 * e.scale, 29, 4, s),
                    s.fillStyle = "#a5974c",
                    li(0, 0, .5 * e.scale, s);
                else if ("mine" == e.name)
                    s.fillStyle = "#939393",
                    hi(s, 3, e.scale, e.scale),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#bcbcbc",
                    hi(s, 3, .55 * e.scale, .65 * e.scale),
                    s.fill();
                else if ("sapling" == e.name)
                    for (l = 0; l < 2; ++l)
                        hi(s, 7, d = e.scale * (l ? .5 : 1), .7 * d),
                        s.fillStyle = l ? "#b4db62" : "#9ebf57",
                        s.fill(),
                        l || s.stroke();
                else if ("pit trap" == e.name)
                    s.fillStyle = "#a5974c",
                    hi(s, 3, 1.1 * e.scale, 1.1 * e.scale),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = at,
                    hi(s, 3, .65 * e.scale, .65 * e.scale),
                    s.fill();
                else if ("boost pad" == e.name)
                    s.fillStyle = "#7e7f82",
                    ui(0, 0, 2 * e.scale, 2 * e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#dbd97d",
                    function(e, t) {
                        t = t || Se;
                        var n = e * (Math.sqrt(3) / 2);
                        t.beginPath(),
                        t.moveTo(0, -n / 2),
                        t.lineTo(-e / 2, n / 2),
                        t.lineTo(e / 2, n / 2),
                        t.lineTo(0, -n / 2),
                        t.fill(),
                        t.closePath()
                    }(1 * e.scale, s);
                else if ("turret" == e.name)
                    s.fillStyle = "#a5974c",
                    li(0, 0, e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#939393",
                    ui(0, -25, .9 * e.scale, 50, s),
                    li(0, 0, .6 * e.scale, s),
                    s.fill(),
                    s.stroke();
                else if ("platform" == e.name) {
                    s.fillStyle = "#cebd5f";
                    var p = 2 * e.scale
                      , g = p / 4
                      , m = -e.scale / 2;
                    for (l = 0; l < 4; ++l)
                        ui(m - g / 2, 0, g, 2 * e.scale, s),
                        s.fill(),
                        s.stroke(),
                        m += p / 4
                } else if ("healing pad" == e.name)
                    s.fillStyle = "#7e7f82",
                    ui(0, 0, 2 * e.scale, 2 * e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#db6e6e",
                    fi(0, 0, .65 * e.scale, 20, 4, s, !0);
                else if ("spawn pad" == e.name)
                    s.fillStyle = "#7e7f82",
                    ui(0, 0, 2 * e.scale, 2 * e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#71aad6",
                    li(0, 0, .6 * e.scale, s);
                else if ("blocker" == e.name)
                    s.fillStyle = "#7e7f82",
                    li(0, 0, e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.rotate(Math.PI / 4),
                    s.fillStyle = "#db6e6e",
                    fi(0, 0, .65 * e.scale, 20, 4, s, !0);
                else if ("teleporter" == e.name)
                    s.fillStyle = "#7e7f82",
                    li(0, 0, e.scale, s),
                    s.fill(),
                    s.stroke(),
                    s.rotate(Math.PI / 4),
                    s.fillStyle = "#d76edb",
                    li(0, 0, .5 * e.scale, s, !0);
                else if ("ban" == e.name) {
                    const t = 2.1 * e.scale
                      , n = t / 10;
                    s.translate(-i.width / 2.4, -i.height / 2.4),
                    s.fillStyle = "#ff0033",
                    s.lineWidth = n,
                    s.strokeStyle = "#ffdfd0",
                    s.beginPath(),
                    s.arc(.65 * t, t / 8, t / 8, 1.25 * Math.PI, 1.75 * Math.PI, !1),
                    s.quadraticCurveTo(.89 * t, .12 * t, .93 * t, .28 * t);
                    let r = .42 * t;
                    s.arc(t - r, t / 2, r, 1.9 * Math.PI, .15 * Math.PI, !1),
                    r = t / 2,
                    s.arc(r, r, r, .2 * Math.PI, .6 * Math.PI, !1),
                    s.quadraticCurveTo(.2 * t, .92 * t, .13 * t, .8 * t),
                    r = t / 3,
                    s.arc(r, t / 2, r, .8 * Math.PI, 1.3 * Math.PI, !1),
                    s.bezierCurveTo(.25 * t, .16 * t, .43 * t, .12 * t, .56 * t, .05 * t),
                    s.closePath(),
                    s.save(),
                    s.clip(),
                    s.lineWidth *= 2,
                    s.fill(),
                    s.stroke(),
                    s.restore(),
                    s.fillStyle = "#ff0033",
                    s.lineWidth = n,
                    s.strokeStyle = "#ffdfd0",
                    s.beginPath(),
                    s.arc(.6 * t, .34 * t, n, 0, 2 * Math.PI, !1),
                    s.fill(),
                    s.stroke(),
                    s.fillStyle = "#00ff00",
                    s.beginPath(),
                    s.arc(0, 0, t, 1.25 * Math.PI, 1.75 * Math.PI, !1),
                    s.fill()
                }
                n = i,
                t || (oi[e.id] = n)
            }
            return n
        }
        function li(e, t, n, i, r, s) {
            (i = i || Se).beginPath(),
            i.arc(e, t, n, 0, 2 * Math.PI),
            s || i.fill(),
            r || i.stroke()
        }
        function hi(e, t, n, i) {
            var r, s, a = Math.PI / 2 * 3, o = Math.PI / t;
            e.beginPath(),
            e.moveTo(0, -n);
            for (var c = 0; c < t; c++)
                r = Math.cos(a) * n,
                s = Math.sin(a) * n,
                e.lineTo(r, s),
                a += o,
                r = Math.cos(a) * i,
                s = Math.sin(a) * i,
                e.lineTo(r, s),
                a += o;
            e.lineTo(0, -n),
            e.closePath()
        }
        function ui(e, t, n, i, r, s) {
            r.fillRect(e - n / 2, t - i / 2, n, i),
            s || r.strokeRect(e - n / 2, t - i / 2, n, i)
        }
        function fi(e, t, n, i, r, s, a) {
            s.save(),
            s.translate(e, t),
            r = Math.ceil(r / 2);
            for (var o = 0; o < r; o++)
                ui(0, 0, 2 * n, i, s, a),
                s.rotate(Math.PI / r);
            s.restore()
        }
        function di(e) {
            for (var t = 0; t < e.length; )
                st.add(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5], c.list[e[t + 6]], !0, e[t + 7] >= 0 ? {
                    sid: e[t + 7]
                } : null),
                t += 8
        }
        function pi(e, t) {
            (D = ji(t)) && (D.xWiggle += a.gatherWiggle * Math.cos(e),
            D.yWiggle += a.gatherWiggle * Math.sin(e))
        }
        function gi(e, t) {
            (D = ji(e)) && (D.dir = t,
            D.xWiggle += a.gatherWiggle * Math.cos(t + Math.PI),
            D.yWiggle += a.gatherWiggle * Math.sin(t + Math.PI))
        }
        function mi(e, t, n, i, r, s, a, o) {
            dt && (J.addProjectile(e, t, n, i, r, s, null, null, a).sid = o)
        }
        function yi(e, t) {
            for (var n = 0; n < K.length; ++n)
                K[n].sid == e && (K[n].range = t)
        }
        function ki(e) {
            (D = Oi(e)) && D.startAnim()
        }
        function vi(e) {
            for (var t = 0; t < W.length; ++t)
                W[t].forcePos = !W[t].visible,
                W[t].visible = !1;
            if (e) {
                var n = Date.now();
                for (t = 0; t < e.length; )
                    (D = Oi(e[t])) ? (D.index = e[t + 1],
                    D.t1 = void 0 === D.t2 ? n : D.t2,
                    D.t2 = n,
                    D.x1 = D.x,
                    D.y1 = D.y,
                    D.x2 = e[t + 2],
                    D.y2 = e[t + 3],
                    D.d1 = void 0 === D.d2 ? e[t + 4] : D.d2,
                    D.d2 = e[t + 4],
                    D.health = e[t + 5],
                    D.dt = 0,
                    D.visible = !0) : ((D = ee.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1])).x2 = D.x,
                    D.y2 = D.y,
                    D.d2 = D.dir,
                    D.health = e[t + 5],
                    ee.aiTypes[e[t + 1]].name || (D.name = a.cowNames[e[t + 6]]),
                    D.forcePos = !0,
                    D.sid = e[t],
                    D.visible = !0),
                    t += 7
            }
        }
        var wi = {};
        function bi(e, t) {
            var n = e.index
              , i = wi[n];
            if (!i) {
                var r = new Image;
                r.onload = function() {
                    this.isLoaded = !0,
                    this.onload = null
                }
                ,
                r.src = ".././img/animals/" + e.src + ".png",
                i = r,
                wi[n] = i
            }
            if (i.isLoaded) {
                var s = 1.2 * e.scale * (e.spriteMlt || 1);
                t.drawImage(i, -s, -s, 2 * s, 2 * s)
            }
        }
        function xi(e, t, n) {
            return e + n >= 0 && e - n <= ce && t + n >= 0 && t - n <= le
        }
        function Si(e, t) {
            var n = function(e) {
                for (var t = 0; t < N.length; ++t)
                    if (N[t].id == e)
                        return N[t];
                return null
            }(e[0]);
            n || (n = new h(e[0],e[1],a,r,J,st,N,W,c,it,rt),
            N.push(n)),
            n.spawn(t ? V : null),
            n.visible = !1,
            n.x2 = void 0,
            n.y2 = void 0,
            n.setData(e),
            t && (U = (j = n).x,
            L = j.y,
            nn(),
            Dn(),
            Hn(),
            zn(0),
            Re.style.display = "block")
        }
        function Ti(e) {
            for (var t = 0; t < N.length; t++)
                if (N[t].id == e) {
                    N.splice(t, 1);
                    break
                }
        }
        function Ii(e, t) {
            j && (j.itemCounts[e] = t)
        }
        function Ei(e, t, n) {
            j && (j[e] = t,
            n && Dn())
        }
        const Mi = a.DAY_INTERVAL / 24
          , Ai = a.DAY_INTERVAL / 2;
        function Pi(t, n) {
            e.DARKNESS = t,
            ct = n,
            t > 0 ? (xe.style.display = "inline-block",
            xe.style.backgroundColor = `rgb(0,0,0,${.6 * t})`) : xe.style.display = "none";
            let i = (~~(n % Ai / Ai * 12) % 12).pad(2);
            "00" === i && n >= Ai && (i = "12");
            const r = i + ":" + (~~(n % Mi / Mi * 60)).pad(2);
            Fe.innerText = r + (n < Ai ? "am" : "pm");
            const s = t > 0 ? "url(../img/icons/night.png)" : "url(../img/icons/day.png)";
            Fe.style.backgroundImage !== s && (Fe.style.backgroundImage = s)
        }
        function Bi(e, t) {
            (D = Ri(e)) && (D.health = t)
        }
        function Ci(e) {
            for (var t = Date.now(), n = 0; n < N.length; ++n)
                N[n].forcePos = !N[n].visible,
                N[n].visible = !1;
            for (n = 0; n < e.length; )
                (D = Ri(e[n])) && (D.t1 = void 0 === D.t2 ? t : D.t2,
                D.t2 = t,
                D.x1 = D.x,
                D.y1 = D.y,
                D.x2 = e[n + 1],
                D.y2 = e[n + 2],
                D.d1 = void 0 === D.d2 ? e[n + 3] : D.d2,
                D.d2 = e[n + 3],
                D.dt = 0,
                D.buildIndex = e[n + 4],
                D.weaponIndex = e[n + 5],
                D.weaponVariant = e[n + 6],
                D.team = e[n + 7],
                D.isLeader = e[n + 8],
                D.skinIndex = e[n + 9],
                D.tailIndex = e[n + 10],
                D.iconIndex = e[n + 11],
                D.zIndex = e[n + 12],
                D.visible = !0),
                n += 13
        }
        function Ri(e) {
            for (var t = 0; t < N.length; ++t)
                if (N[t].sid == e)
                    return N[t];
            return null
        }
        function Oi(e) {
            for (var t = 0; t < W.length; ++t)
                if (W[t].sid == e)
                    return W[t];
            return null
        }
        function ji(e) {
            for (var t = 0; t < G.length; ++t)
                if (G[t].sid == e)
                    return G[t];
            return null
        }
        Number.prototype.pad = function(e) {
            let t = String(this);
            for (; t.length < (e || 2); )
                t = "0" + t;
            return t
        }
        ;
        var _i = -1;
        function Di() {
            var e = Date.now() - _i;
            window.pingTime = e,
            Me.innerText = "Server Ping: " + e + " ms"
        }
        function Ui() {
            _i = Date.now(),
            i.send("pp")
        }
        function Li(e) {
            if (!(e < 0)) {
                var t = Math.floor(e / 60)
                  , n = e % 60;
                n = ("0" + n).slice(-2),
                Ae.innerText = "Server restarting in " + t + ":" + n,
                Ae.hidden = !1
            }
        }
        function Fi(e) {
            window.open(e, "_blank")
        }
        window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
            window.setTimeout(e, 1e3 / 60)
        }
        ,
        e.fpsAVG = [],
        function() {
            var e = a.mapScale / 2;
            st.add(0, e, e + 200, 0, a.treeScales[3], 0),
            st.add(1, e, e - 480, 0, a.treeScales[3], 0),
            st.add(2, e + 300, e + 450, 0, a.treeScales[3], 0),
            st.add(3, e - 950, e - 130, 0, a.treeScales[2], 0),
            st.add(4, e - 750, e - 400, 0, a.treeScales[3], 0),
            st.add(5, e - 700, e + 400, 0, a.treeScales[2], 0),
            st.add(6, e + 800, e - 200, 0, a.treeScales[3], 0),
            st.add(7, e - 260, e + 340, 0, a.bushScales[3], 1),
            st.add(8, e + 760, e + 310, 0, a.bushScales[3], 1),
            st.add(9, e - 800, e + 100, 0, a.bushScales[3], 1),
            st.add(10, e - 800, e + 300, 0, c.list[4].scale, c.list[4].id, c.list[10]),
            st.add(11, e + 650, e - 390, 0, c.list[4].scale, c.list[4].id, c.list[10]),
            st.add(12, e - 400, e - 450, 0, a.rockScales[2], 2)
        }(),
        function e() {
            C = Date.now(),
            B = C - q,
            q = C,
            function() {
                if (j && (!R || C - R >= 1e3 / a.clientSendRate) && (R = C,
                i.send("2", kn())),
                Rn < 120 && (Rn += .1 * B,
                $e.style.fontSize = Math.min(Math.round(Rn), 120) + "px"),
                j) {
                    var e = r.getDistance(U, L, j.x, j.y)
                      , t = r.getDirection(j.x, j.y, U, L)
                      , n = Math.min(.01 * e * B, e);
                    e > .05 ? (U += n * Math.cos(t),
                    L += n * Math.sin(t)) : (U = j.x,
                    L = j.y)
                } else
                    U = a.mapScale / 2,
                    L = a.mapScale / 2;
                for (var s = C - 1e3 / a.serverUpdateRate, o = 0; o < N.length + W.length; ++o)
                    if ((D = N[o] || W[o - N.length]) && D.visible)
                        if (D.forcePos)
                            D.x = D.x2,
                            D.y = D.y2,
                            D.dir = D.d2;
                        else {
                            var c = D.t2 - D.t1
                              , l = (s - D.t1) / c;
                            D.dt += B;
                            var h = Math.min(1.7, D.dt / 170)
                              , u = D.x2 - D.x1;
                            D.x = D.x1 + u * h,
                            u = D.y2 - D.y1,
                            D.y = D.y1 + u * h,
                            D.dir = Math.lerpAngle(D.d2, D.d1, Math.min(1.2, l))
                        }
                var f = U - ce / 2
                  , d = L - le / 2;
                a.snowBiomeTop - d <= 0 && a.mapScale - a.snowBiomeTop - d >= le ? (Se.fillStyle = "#b6db66",
                Se.fillRect(0, 0, ce, le)) : a.mapScale - a.snowBiomeTop - d <= 0 ? (Se.fillStyle = "#dbc666",
                Se.fillRect(0, 0, ce, le)) : a.snowBiomeTop - d >= le ? (Se.fillStyle = "#fff",
                Se.fillRect(0, 0, ce, le)) : a.snowBiomeTop - d >= 0 ? (Se.fillStyle = "#fff",
                Se.fillRect(0, 0, ce, a.snowBiomeTop - d),
                Se.fillStyle = "#b6db66",
                Se.fillRect(0, a.snowBiomeTop - d, ce, le - (a.snowBiomeTop - d))) : (Se.fillStyle = "#b6db66",
                Se.fillRect(0, 0, ce, a.mapScale - a.snowBiomeTop - d),
                Se.fillStyle = "#dbc666",
                Se.fillRect(0, a.mapScale - a.snowBiomeTop - d, ce, le - (a.mapScale - a.snowBiomeTop - d))),
                Pn || ((te += ne * a.waveSpeed * B) >= a.waveMax ? (te = a.waveMax,
                ne = -1) : te <= 1 && (te = ne = 1),
                Se.globalAlpha = 1,
                Se.fillStyle = "#dbc666",
                Xn(f, d, Se, a.riverPadding),
                Se.fillStyle = "#91b2db",
                Xn(f, d, Se, 250 * (te - 1))),
                Se.lineWidth = 4,
                Se.strokeStyle = "#000",
                Se.globalAlpha = .06,
                Se.beginPath();
                for (var p = -U; p < ce; p += le / 18)
                    p > 0 && (Se.moveTo(p, 0),
                    Se.lineTo(p, le));
                for (var m = -L; m < le; m += le / 18)
                    p > 0 && (Se.moveTo(0, m),
                    Se.lineTo(ce, m));
                for (Se.stroke(),
                Se.globalAlpha = 1,
                Se.strokeStyle = at,
                Gn(-1, f, d),
                Se.globalAlpha = 1,
                Se.lineWidth = 5.5,
                qn(0, f, d),
                Jn(f, d, 0),
                Se.globalAlpha = 1,
                o = 0; o < W.length; ++o)
                    (D = W[o]).active && D.visible && (D.animate(B),
                    Se.save(),
                    Se.translate(D.x - f, D.y - d),
                    Se.rotate(D.dir + D.dirPlus - Math.PI / 2),
                    bi(D, Se),
                    Se.restore());
                if (Gn(0, f, d),
                qn(1, f, d),
                Gn(1, f, d),
                Jn(f, d, 1),
                Gn(2, f, d),
                Gn(3, f, d),
                Se.fillStyle = "#000",
                Se.globalAlpha = .09,
                f <= 0 && Se.fillRect(0, 0, -f, le),
                a.mapScale - f <= ce) {
                    var y = Math.max(0, -d);
                    Se.fillRect(a.mapScale - f, y, ce - (a.mapScale - f), le - y)
                }
                if (d <= 0 && Se.fillRect(-f, 0, ce + f, -d),
                a.mapScale - d <= le) {
                    var k = Math.max(0, -f)
                      , v = 0;
                    a.mapScale - f <= ce && (v = ce - (a.mapScale - f)),
                    Se.fillRect(k, a.mapScale - d, ce - k - v, le - (a.mapScale - d))
                }
                for (Se.globalAlpha = 1,
                Se.fillStyle = "rgba(0, 0, 70, 0.35)",
                Se.fillRect(0, 0, ce, le),
                Se.strokeStyle = ot,
                o = 0; o < N.length + W.length; ++o)
                    if ((D = N[o] || W[o - N.length]).visible && (10 != D.skinIndex || D == j || D.team && D.team == j.team)) {
                        var w = (D.team ? "[" + D.team + "] " : "") + (D.name || "");
                        if ("" != w) {
                            if (Se.font = (D.nameScale || 30) + "px Hammersmith One",
                            Se.fillStyle = "#fff",
                            Se.textBaseline = "middle",
                            Se.textAlign = "center",
                            Se.lineWidth = D.nameScale ? 11 : 8,
                            Se.lineJoin = "round",
                            Se.strokeText(w, D.x - f, D.y - d - D.scale - a.nameY),
                            Se.fillText(w, D.x - f, D.y - d - D.scale - a.nameY),
                            D.isLeader && Un.crown.isLoaded) {
                                var b = a.crownIconScale;
                                k = D.x - f - b / 2 - Se.measureText(w).width / 2 - a.crownPad,
                                Se.drawImage(Un.crown, k, D.y - d - D.scale - a.nameY - b / 2 - 5, b, b)
                            }
                            1 == D.iconIndex && Un.skull.isLoaded && (b = a.crownIconScale,
                            k = D.x - f - b / 2 + Se.measureText(w).width / 2 + a.crownPad,
                            Se.drawImage(Un.skull, k, D.y - d - D.scale - a.nameY - b / 2 - 5, b, b))
                        }
                        D.health > 0 && (a.healthBarWidth,
                        Se.fillStyle = ot,
                        Se.roundRect(D.x - f - a.healthBarWidth - a.healthBarPad, D.y - d + D.scale + a.nameY, 2 * a.healthBarWidth + 2 * a.healthBarPad, 17, 8),
                        Se.fill(),
                        Se.fillStyle = D == j || D.team && D.team == j.team ? "#8ecc51" : "#cc5151",
                        Se.roundRect(D.x - f - a.healthBarWidth, D.y - d + D.scale + a.nameY + a.healthBarPad, 2 * a.healthBarWidth * (D.health / D.maxHealth), 17 - 2 * a.healthBarPad, 7),
                        Se.fill())
                    }
                for (g.update(B, Se, f, d),
                o = 0; o < N.length; ++o)
                    if ((D = N[o]).visible && D.chatCountdown > 0) {
                        D.chatCountdown -= B,
                        D.chatCountdown <= 0 && (D.chatCountdown = 0),
                        Se.font = "32px Hammersmith One";
                        var x = Se.measureText(D.chatMessage);
                        Se.textBaseline = "middle",
                        Se.textAlign = "center",
                        k = D.x - f,
                        y = D.y - D.scale - d - 90;
                        var S = x.width + 17;
                        Se.fillStyle = "rgba(0,0,0,0.2)",
                        Se.roundRect(k - S / 2, y - 23.5, S, 47, 6),
                        Se.fill(),
                        Se.fillStyle = "#fff",
                        Se.fillText(D.chatMessage, k, y)
                    }
                !function(e) {
                    if (j && j.alive) {
                        Ze.clearRect(0, 0, Je.width, Je.height),
                        Ze.strokeStyle = "#fff",
                        Ze.lineWidth = 4;
                        for (var t = 0; t < Xt.length; ++t)
                            (Nt = Xt[t]).update(Ze, e);
                        if (Ze.globalAlpha = 1,
                        Ze.fillStyle = "#fff",
                        li(j.x / a.mapScale * Je.width, j.y / a.mapScale * Je.height, 7, Ze, !0),
                        Ze.fillStyle = "rgba(255,255,255,0.35)",
                        j.team && Bt)
                            for (t = 0; t < Bt.length; )
                                li(Bt[t] / a.mapScale * Je.width, Bt[t + 1] / a.mapScale * Je.height, 7, Ze, !0),
                                t += 2;
                        Pt && (Ze.fillStyle = "#fc5553",
                        Ze.font = "34px Hammersmith One",
                        Ze.textBaseline = "middle",
                        Ze.textAlign = "center",
                        Ze.fillText("x", Pt.x / a.mapScale * Je.width, Pt.y / a.mapScale * Je.height)),
                        Ct && (Ze.fillStyle = "#fff",
                        Ze.font = "34px Hammersmith One",
                        Ze.textBaseline = "middle",
                        Ze.textAlign = "center",
                        Ze.fillText("x", Ct.x / a.mapScale * Je.width, Ct.y / a.mapScale * Je.height))
                    }
                }(B),
                -1 !== se.id && Yn(se.startX, se.startY, se.currentX, se.currentY),
                -1 !== ae.id && Yn(ae.startX, ae.startY, ae.currentX, ae.currentY)
            }(),
            requestAnimFrame(e)
        }(),
        window.openLink = Fi,
        window.aJoinReq = Ht,
        window.follmoo = function() {
            V || (V = !0,
            E("moofoll", 1))
        }
        ,
        window.kickFromClan = Vt,
        window.sendJoin = Yt,
        window.leaveAlliance = Wt,
        window.createAlliance = qt,
        window.storeBuy = en,
        window.storeEquip = Zt,
        window.showItemInfo = At,
        window.selectSkinColor = function(e) {
            oe = e,
            sn()
        }
        ,
        window.changeStoreIndex = function(e) {
            Jt != e && (Jt = e,
            Qt())
        }
        ,
        window.config = a
    }
    ).call(this, n(1))
}
, function(e, t) {
    !function(e, t, n) {
        function i(e, t) {
            return typeof e === t
        }
        var r = []
          , s = []
          , a = {
            _version: "3.5.0",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(e, t) {
                var n = this;
                setTimeout((function() {
                    t(n[e])
                }
                ), 0)
            },
            addTest: function(e, t, n) {
                s.push({
                    name: e,
                    fn: t,
                    options: n
                })
            },
            addAsyncTest: function(e) {
                s.push({
                    name: null,
                    fn: e
                })
            }
        }
          , o = function() {};
        o.prototype = a,
        o = new o;
        var c = t.documentElement
          , l = "svg" === c.nodeName.toLowerCase();
        o.addTest("passiveeventlisteners", (function() {
            var t = !1;
            try {
                var n = Object.defineProperty({}, "passive", {
                    get: function() {
                        t = !0
                    }
                });
                e.addEventListener("test", null, n)
            } catch (e) {}
            return t
        }
        )),
        function() {
            var e, t, n, a, c, l;
            for (var h in s)
                if (s.hasOwnProperty(h)) {
                    if (e = [],
                    (t = s[h]).name && (e.push(t.name.toLowerCase()),
                    t.options && t.options.aliases && t.options.aliases.length))
                        for (n = 0; n < t.options.aliases.length; n++)
                            e.push(t.options.aliases[n].toLowerCase());
                    for (a = i(t.fn, "function") ? t.fn() : t.fn,
                    c = 0; c < e.length; c++)
                        1 === (l = e[c].split(".")).length ? o[l[0]] = a : (!o[l[0]] || o[l[0]]instanceof Boolean || (o[l[0]] = new Boolean(o[l[0]])),
                        o[l[0]][l[1]] = a),
                        r.push((a ? "" : "no-") + l.join("-"))
                }
        }(),
        function(e) {
            var t = c.className
              , n = o._config.classPrefix || "";
            if (l && (t = t.baseVal),
            o._config.enableJSClass) {
                var i = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
                t = t.replace(i, "$1" + n + "js$2")
            }
            o._config.enableClasses && (t += " " + n + e.join(" " + n),
            l ? c.className.baseVal = t : c.className = t)
        }(r),
        delete a.addTest,
        delete a.addAsyncTest;
        for (var h = 0; h < o._q.length; h++)
            o._q[h]();
        e.Modernizr = o
    }(window, document)
}
, function(e, t, n) {
    var i = n(24);
    n(19),
    e.exports = {
        socket: null,
        connected: !1,
        socketId: -1,
        connect: function(e, t, n) {
            if (!this.socket) {
                var r = this;
                try {
                    var s = !1
                      , a = e;
                    this.socket = new WebSocket(a),
                    this.socket.binaryType = "arraybuffer",
                    this.socket.onmessage = function(e) {
                        var t = new Uint8Array(e.data)
                          , s = i.decode(t)
                          , a = s[0];
                        t = s[1],
                        "io-init" == a ? r.socketId = t[0] : n[a].apply(void 0, t)
                    }
                    ,
                    this.socket.onopen = function() {
                        r.connected = !0,
                        t()
                    }
                    ,
                    this.socket.onclose = function(e) {
                        r.connected = !1,
                        4001 == e.code ? t("Invalid Connection") : s || t("disconnected")
                    }
                    ,
                    this.socket.onerror = function(e) {
                        this.socket && this.socket.readyState != WebSocket.OPEN && (s = !0,
                        console.error("Socket error", arguments),
                        t("Socket error"))
                    }
                } catch (e) {
                    console.warn("Socket connection error:", e),
                    t(e)
                }
            }
        },
        send: function(e) {
            var t = Array.prototype.slice.call(arguments, 1)
              , n = i.encode([e, t]);
            this.socket.send(n)
        },
        socketReady: function() {
            return this.socket && this.connected
        },
        close: function() {
            this.socket && this.socket.close()
        }
    }
}
, function(e, t, n) {
    t.encode = n(10).encode,
    t.decode = n(15).decode,
    t.Encoder = n(36).Encoder,
    t.Decoder = n(37).Decoder,
    t.createCodec = n(38).createCodec,
    t.codec = n(39).codec
}
, function(e, t, n) {
    (function(t) {
        function n(e) {
            return e && e.isBuffer && e
        }
        e.exports = n(void 0 !== t && t) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer
    }
    ).call(this, n(12).Buffer)
}
, function(e, t, n) {
    "use strict";
    t.byteLength = function(e) {
        var t = l(e)
          , n = t[0]
          , i = t[1];
        return 3 * (n + i) / 4 - i
    }
    ,
    t.toByteArray = function(e) {
        var t, n, i = l(e), a = i[0], o = i[1], c = new s(function(e, t, n) {
            return 3 * (t + n) / 4 - n
        }(0, a, o)), h = 0, u = o > 0 ? a - 4 : a;
        for (n = 0; n < u; n += 4)
            t = r[e.charCodeAt(n)] << 18 | r[e.charCodeAt(n + 1)] << 12 | r[e.charCodeAt(n + 2)] << 6 | r[e.charCodeAt(n + 3)],
            c[h++] = t >> 16 & 255,
            c[h++] = t >> 8 & 255,
            c[h++] = 255 & t;
        return 2 === o && (t = r[e.charCodeAt(n)] << 2 | r[e.charCodeAt(n + 1)] >> 4,
        c[h++] = 255 & t),
        1 === o && (t = r[e.charCodeAt(n)] << 10 | r[e.charCodeAt(n + 1)] << 4 | r[e.charCodeAt(n + 2)] >> 2,
        c[h++] = t >> 8 & 255,
        c[h++] = 255 & t),
        c
    }
    ,
    t.fromByteArray = function(e) {
        for (var t, n = e.length, r = n % 3, s = [], a = 0, o = n - r; a < o; a += 16383)
            s.push(u(e, a, a + 16383 > o ? o : a + 16383));
        return 1 === r ? (t = e[n - 1],
        s.push(i[t >> 2] + i[t << 4 & 63] + "==")) : 2 === r && (t = (e[n - 2] << 8) + e[n - 1],
        s.push(i[t >> 10] + i[t >> 4 & 63] + i[t << 2 & 63] + "=")),
        s.join("")
    }
    ;
    for (var i = [], r = [], s = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, c = a.length; o < c; ++o)
        i[o] = a[o],
        r[a.charCodeAt(o)] = o;
    function l(e) {
        var t = e.length;
        if (t % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
        var n = e.indexOf("=");
        return -1 === n && (n = t),
        [n, n === t ? 0 : 4 - n % 4]
    }
    function h(e) {
        return i[e >> 18 & 63] + i[e >> 12 & 63] + i[e >> 6 & 63] + i[63 & e]
    }
    function u(e, t, n) {
        for (var i, r = [], s = t; s < n; s += 3)
            i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]),
            r.push(h(i));
        return r.join("")
    }
    r["-".charCodeAt(0)] = 62,
    r["_".charCodeAt(0)] = 63
}
, function(e, t, n) {
    var i = n(0);
    function r(e) {
        return new Array(e)
    }
    (t = e.exports = r(0)).alloc = r,
    t.concat = i.concat,
    t.from = function(e) {
        if (!i.isBuffer(e) && i.isView(e))
            e = i.Uint8Array.from(e);
        else if (i.isArrayBuffer(e))
            e = new Uint8Array(e);
        else {
            if ("string" == typeof e)
                return i.from.call(t, e);
            if ("number" == typeof e)
                throw new TypeError('"value" argument must not be a number')
        }
        return Array.prototype.slice.call(e)
    }
}
, function(e, t, n) {
    var i = n(0)
      , r = i.global;
    function s(e) {
        return new r(e)
    }
    (t = e.exports = i.hasBuffer ? s(0) : []).alloc = i.hasBuffer && r.alloc || s,
    t.concat = i.concat,
    t.from = function(e) {
        if (!i.isBuffer(e) && i.isView(e))
            e = i.Uint8Array.from(e);
        else if (i.isArrayBuffer(e))
            e = new Uint8Array(e);
        else {
            if ("string" == typeof e)
                return i.from.call(t, e);
            if ("number" == typeof e)
                throw new TypeError('"value" argument must not be a number')
        }
        return r.from && 1 !== r.from.length ? r.from(e) : new r(e)
    }
}
, function(e, t, n) {
    var i = n(0);
    function r(e) {
        return new Uint8Array(e)
    }
    (t = e.exports = i.hasArrayBuffer ? r(0) : []).alloc = r,
    t.concat = i.concat,
    t.from = function(e) {
        if (i.isView(e)) {
            var n = e.byteOffset
              , r = e.byteLength;
            (e = e.buffer).byteLength !== r && (e.slice ? e = e.slice(n, n + r) : (e = new Uint8Array(e)).byteLength !== r && (e = Array.prototype.slice.call(e, n, n + r)))
        } else {
            if ("string" == typeof e)
                return i.from.call(t, e);
            if ("number" == typeof e)
                throw new TypeError('"value" argument must not be a number')
        }
        return new Uint8Array(e)
    }
}
, function(e, t) {
    t.copy = function(e, t, n, i) {
        var r;
        n || (n = 0),
        i || 0 === i || (i = this.length),
        t || (t = 0);
        var s = i - n;
        if (e === this && n < t && t < i)
            for (r = s - 1; r >= 0; r--)
                e[r + t] = this[r + n];
        else
            for (r = 0; r < s; r++)
                e[r + t] = this[r + n];
        return s
    }
    ,
    t.toString = function(e, t, n) {
        var i = 0 | t;
        n || (n = this.length);
        for (var r = "", s = 0; i < n; )
            (s = this[i++]) < 128 ? r += String.fromCharCode(s) : (192 == (224 & s) ? s = (31 & s) << 6 | 63 & this[i++] : 224 == (240 & s) ? s = (15 & s) << 12 | (63 & this[i++]) << 6 | 63 & this[i++] : 240 == (248 & s) && (s = (7 & s) << 18 | (63 & this[i++]) << 12 | (63 & this[i++]) << 6 | 63 & this[i++]),
            s >= 65536 ? (s -= 65536,
            r += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))) : r += String.fromCharCode(s));
        return r
    }
    ,
    t.write = function(e, t) {
        for (var n = t || (t |= 0), i = e.length, r = 0, s = 0; s < i; )
            (r = e.charCodeAt(s++)) < 128 ? this[n++] = r : r < 2048 ? (this[n++] = 192 | r >>> 6,
            this[n++] = 128 | 63 & r) : r < 55296 || r > 57343 ? (this[n++] = 224 | r >>> 12,
            this[n++] = 128 | r >>> 6 & 63,
            this[n++] = 128 | 63 & r) : (r = 65536 + (r - 55296 << 10 | e.charCodeAt(s++) - 56320),
            this[n++] = 240 | r >>> 18,
            this[n++] = 128 | r >>> 12 & 63,
            this[n++] = 128 | r >>> 6 & 63,
            this[n++] = 128 | 63 & r);
        return n - t
    }
}
, function(e, t, n) {
    t.setExtPackers = function(e) {
        e.addExtPacker(14, Error, [u, c]),
        e.addExtPacker(1, EvalError, [u, c]),
        e.addExtPacker(2, RangeError, [u, c]),
        e.addExtPacker(3, ReferenceError, [u, c]),
        e.addExtPacker(4, SyntaxError, [u, c]),
        e.addExtPacker(5, TypeError, [u, c]),
        e.addExtPacker(6, URIError, [u, c]),
        e.addExtPacker(10, RegExp, [h, c]),
        e.addExtPacker(11, Boolean, [l, c]),
        e.addExtPacker(12, String, [l, c]),
        e.addExtPacker(13, Date, [Number, c]),
        e.addExtPacker(15, Number, [l, c]),
        "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, a),
        e.addExtPacker(18, Uint8Array, a),
        e.addExtPacker(19, Int16Array, a),
        e.addExtPacker(20, Uint16Array, a),
        e.addExtPacker(21, Int32Array, a),
        e.addExtPacker(22, Uint32Array, a),
        e.addExtPacker(23, Float32Array, a),
        "undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, a),
        "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, a),
        e.addExtPacker(26, ArrayBuffer, a),
        e.addExtPacker(29, DataView, a)),
        r.hasBuffer && e.addExtPacker(27, s, r.from)
    }
    ;
    var i, r = n(0), s = r.global, a = r.Uint8Array.from, o = {
        name: 1,
        message: 1,
        stack: 1,
        columnNumber: 1,
        fileName: 1,
        lineNumber: 1
    };
    function c(e) {
        return i || (i = n(10).encode),
        i(e)
    }
    function l(e) {
        return e.valueOf()
    }
    function h(e) {
        (e = RegExp.prototype.toString.call(e).split("/")).shift();
        var t = [e.pop()];
        return t.unshift(e.join("/")),
        t
    }
    function u(e) {
        var t = {};
        for (var n in o)
            t[n] = e[n];
        return t
    }
}
, function(e, t, n) {
    var i = n(2)
      , r = n(8)
      , s = r.Uint64BE
      , a = r.Int64BE
      , o = n(0)
      , c = n(7)
      , l = n(33)
      , h = n(13).uint8
      , u = n(5).ExtBuffer
      , f = "undefined" != typeof Uint8Array
      , d = "undefined" != typeof Map
      , p = [];
    p[1] = 212,
    p[2] = 213,
    p[4] = 214,
    p[8] = 215,
    p[16] = 216,
    t.getWriteType = function(e) {
        var t = l.getWriteToken(e)
          , n = e && e.useraw
          , r = f && e && e.binarraybuffer
          , g = r ? o.isArrayBuffer : o.isBuffer
          , m = r ? function(e, t) {
            w(e, new Uint8Array(t))
        }
        : w
          , y = d && e && e.usemap ? function(e, n) {
            if (!(n instanceof Map))
                return b(e, n);
            var i = n.size;
            t[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](e, i);
            var r = e.codec.encode;
            n.forEach((function(t, n, i) {
                r(e, n),
                r(e, t)
            }
            ))
        }
        : b;
        return {
            boolean: function(e, n) {
                t[n ? 195 : 194](e, n)
            },
            function: v,
            number: function(e, n) {
                var i = 0 | n;
                n === i ? t[-32 <= i && i <= 127 ? 255 & i : 0 <= i ? i <= 255 ? 204 : i <= 65535 ? 205 : 206 : -128 <= i ? 208 : -32768 <= i ? 209 : 210](e, i) : t[203](e, n)
            },
            object: n ? function(e, n) {
                if (g(n))
                    return function(e, n) {
                        var i = n.length;
                        t[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](e, i),
                        e.send(n)
                    }(e, n);
                k(e, n)
            }
            : k,
            string: function(e) {
                return function(n, i) {
                    var r = i.length
                      , s = 5 + 3 * r;
                    n.offset = n.reserve(s);
                    var a = n.buffer
                      , o = e(r)
                      , l = n.offset + o;
                    r = c.write.call(a, i, l);
                    var h = e(r);
                    if (o !== h) {
                        var u = l + h - o
                          , f = l + r;
                        c.copy.call(a, a, u, l, f)
                    }
                    t[1 === h ? 160 + r : h <= 3 ? 215 + h : 219](n, r),
                    n.offset += r
                }
            }(n ? function(e) {
                return e < 32 ? 1 : e <= 65535 ? 3 : 5
            }
            : function(e) {
                return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5
            }
            ),
            symbol: v,
            undefined: v
        };
        function k(e, n) {
            if (null === n)
                return v(e, n);
            if (g(n))
                return m(e, n);
            if (i(n))
                return function(e, n) {
                    var i = n.length;
                    t[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](e, i);
                    for (var r = e.codec.encode, s = 0; s < i; s++)
                        r(e, n[s])
                }(e, n);
            if (s.isUint64BE(n))
                return function(e, n) {
                    t[207](e, n.toArray())
                }(e, n);
            if (a.isInt64BE(n))
                return function(e, n) {
                    t[211](e, n.toArray())
                }(e, n);
            var r = e.codec.getExtPacker(n);
            if (r && (n = r(n)),
            n instanceof u)
                return function(e, n) {
                    var i = n.buffer
                      , r = i.length
                      , s = p[r] || (r < 255 ? 199 : r <= 65535 ? 200 : 201);
                    t[s](e, r),
                    h[n.type](e),
                    e.send(i)
                }(e, n);
            y(e, n)
        }
        function v(e, n) {
            t[192](e, n)
        }
        function w(e, n) {
            var i = n.length;
            t[i < 255 ? 196 : i <= 65535 ? 197 : 198](e, i),
            e.send(n)
        }
        function b(e, n) {
            var i = Object.keys(n)
              , r = i.length;
            t[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](e, r);
            var s = e.codec.encode;
            i.forEach((function(t) {
                s(e, t),
                s(e, n[t])
            }
            ))
        }
    }
}
, function(e, t, n) {
    var i = n(6)
      , r = n(8)
      , s = r.Uint64BE
      , a = r.Int64BE
      , o = n(13).uint8
      , c = n(0)
      , l = c.global
      , h = c.hasBuffer && "TYPED_ARRAY_SUPPORT"in l && !l.TYPED_ARRAY_SUPPORT
      , u = c.hasBuffer && l.prototype || {};
    function f() {
        var e = o.slice();
        return e[196] = d(196),
        e[197] = p(197),
        e[198] = g(198),
        e[199] = d(199),
        e[200] = p(200),
        e[201] = g(201),
        e[202] = m(202, 4, u.writeFloatBE || v, !0),
        e[203] = m(203, 8, u.writeDoubleBE || w, !0),
        e[204] = d(204),
        e[205] = p(205),
        e[206] = g(206),
        e[207] = m(207, 8, y),
        e[208] = d(208),
        e[209] = p(209),
        e[210] = g(210),
        e[211] = m(211, 8, k),
        e[217] = d(217),
        e[218] = p(218),
        e[219] = g(219),
        e[220] = p(220),
        e[221] = g(221),
        e[222] = p(222),
        e[223] = g(223),
        e
    }
    function d(e) {
        return function(t, n) {
            var i = t.reserve(2)
              , r = t.buffer;
            r[i++] = e,
            r[i] = n
        }
    }
    function p(e) {
        return function(t, n) {
            var i = t.reserve(3)
              , r = t.buffer;
            r[i++] = e,
            r[i++] = n >>> 8,
            r[i] = n
        }
    }
    function g(e) {
        return function(t, n) {
            var i = t.reserve(5)
              , r = t.buffer;
            r[i++] = e,
            r[i++] = n >>> 24,
            r[i++] = n >>> 16,
            r[i++] = n >>> 8,
            r[i] = n
        }
    }
    function m(e, t, n, i) {
        return function(r, s) {
            var a = r.reserve(t + 1);
            r.buffer[a++] = e,
            n.call(r.buffer, s, a, i)
        }
    }
    function y(e, t) {
        new s(this,t,e)
    }
    function k(e, t) {
        new a(this,t,e)
    }
    function v(e, t) {
        i.write(this, e, t, !1, 23, 4)
    }
    function w(e, t) {
        i.write(this, e, t, !1, 52, 8)
    }
    t.getWriteToken = function(e) {
        return e && e.uint8array ? function() {
            var e = f();
            return e[202] = m(202, 4, v),
            e[203] = m(203, 8, w),
            e
        }() : h || c.hasBuffer && e && e.safe ? function() {
            var e = o.slice();
            return e[196] = m(196, 1, l.prototype.writeUInt8),
            e[197] = m(197, 2, l.prototype.writeUInt16BE),
            e[198] = m(198, 4, l.prototype.writeUInt32BE),
            e[199] = m(199, 1, l.prototype.writeUInt8),
            e[200] = m(200, 2, l.prototype.writeUInt16BE),
            e[201] = m(201, 4, l.prototype.writeUInt32BE),
            e[202] = m(202, 4, l.prototype.writeFloatBE),
            e[203] = m(203, 8, l.prototype.writeDoubleBE),
            e[204] = m(204, 1, l.prototype.writeUInt8),
            e[205] = m(205, 2, l.prototype.writeUInt16BE),
            e[206] = m(206, 4, l.prototype.writeUInt32BE),
            e[207] = m(207, 8, y),
            e[208] = m(208, 1, l.prototype.writeInt8),
            e[209] = m(209, 2, l.prototype.writeInt16BE),
            e[210] = m(210, 4, l.prototype.writeInt32BE),
            e[211] = m(211, 8, k),
            e[217] = m(217, 1, l.prototype.writeUInt8),
            e[218] = m(218, 2, l.prototype.writeUInt16BE),
            e[219] = m(219, 4, l.prototype.writeUInt32BE),
            e[220] = m(220, 2, l.prototype.writeUInt16BE),
            e[221] = m(221, 4, l.prototype.writeUInt32BE),
            e[222] = m(222, 2, l.prototype.writeUInt16BE),
            e[223] = m(223, 4, l.prototype.writeUInt32BE),
            e
        }() : f()
    }
}
, function(e, t, n) {
    t.setExtUnpackers = function(e) {
        e.addExtUnpacker(14, [o, l(Error)]),
        e.addExtUnpacker(1, [o, l(EvalError)]),
        e.addExtUnpacker(2, [o, l(RangeError)]),
        e.addExtUnpacker(3, [o, l(ReferenceError)]),
        e.addExtUnpacker(4, [o, l(SyntaxError)]),
        e.addExtUnpacker(5, [o, l(TypeError)]),
        e.addExtUnpacker(6, [o, l(URIError)]),
        e.addExtUnpacker(10, [o, c]),
        e.addExtUnpacker(11, [o, h(Boolean)]),
        e.addExtUnpacker(12, [o, h(String)]),
        e.addExtUnpacker(13, [o, h(Date)]),
        e.addExtUnpacker(15, [o, h(Number)]),
        "undefined" != typeof Uint8Array && (e.addExtUnpacker(17, h(Int8Array)),
        e.addExtUnpacker(18, h(Uint8Array)),
        e.addExtUnpacker(19, [u, h(Int16Array)]),
        e.addExtUnpacker(20, [u, h(Uint16Array)]),
        e.addExtUnpacker(21, [u, h(Int32Array)]),
        e.addExtUnpacker(22, [u, h(Uint32Array)]),
        e.addExtUnpacker(23, [u, h(Float32Array)]),
        "undefined" != typeof Float64Array && e.addExtUnpacker(24, [u, h(Float64Array)]),
        "undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, h(Uint8ClampedArray)),
        e.addExtUnpacker(26, u),
        e.addExtUnpacker(29, [u, h(DataView)])),
        r.hasBuffer && e.addExtUnpacker(27, h(s))
    }
    ;
    var i, r = n(0), s = r.global, a = {
        name: 1,
        message: 1,
        stack: 1,
        columnNumber: 1,
        fileName: 1,
        lineNumber: 1
    };
    function o(e) {
        return i || (i = n(15).decode),
        i(e)
    }
    function c(e) {
        return RegExp.apply(null, e)
    }
    function l(e) {
        return function(t) {
            var n = new e;
            for (var i in a)
                n[i] = t[i];
            return n
        }
    }
    function h(e) {
        return function(t) {
            return new e(t)
        }
    }
    function u(e) {
        return new Uint8Array(e).buffer
    }
}
, function(e, t, n) {
    var i = n(17);
    function r(e) {
        var t, n = new Array(256);
        for (t = 0; t <= 127; t++)
            n[t] = s(t);
        for (t = 128; t <= 143; t++)
            n[t] = o(t - 128, e.map);
        for (t = 144; t <= 159; t++)
            n[t] = o(t - 144, e.array);
        for (t = 160; t <= 191; t++)
            n[t] = o(t - 160, e.str);
        for (n[192] = s(null),
        n[193] = null,
        n[194] = s(!1),
        n[195] = s(!0),
        n[196] = a(e.uint8, e.bin),
        n[197] = a(e.uint16, e.bin),
        n[198] = a(e.uint32, e.bin),
        n[199] = a(e.uint8, e.ext),
        n[200] = a(e.uint16, e.ext),
        n[201] = a(e.uint32, e.ext),
        n[202] = e.float32,
        n[203] = e.float64,
        n[204] = e.uint8,
        n[205] = e.uint16,
        n[206] = e.uint32,
        n[207] = e.uint64,
        n[208] = e.int8,
        n[209] = e.int16,
        n[210] = e.int32,
        n[211] = e.int64,
        n[212] = o(1, e.ext),
        n[213] = o(2, e.ext),
        n[214] = o(4, e.ext),
        n[215] = o(8, e.ext),
        n[216] = o(16, e.ext),
        n[217] = a(e.uint8, e.str),
        n[218] = a(e.uint16, e.str),
        n[219] = a(e.uint32, e.str),
        n[220] = a(e.uint16, e.array),
        n[221] = a(e.uint32, e.array),
        n[222] = a(e.uint16, e.map),
        n[223] = a(e.uint32, e.map),
        t = 224; t <= 255; t++)
            n[t] = s(t - 256);
        return n
    }
    function s(e) {
        return function() {
            return e
        }
    }
    function a(e, t) {
        return function(n) {
            var i = e(n);
            return t(n, i)
        }
    }
    function o(e, t) {
        return function(n) {
            return t(n, e)
        }
    }
    t.getReadToken = function(e) {
        var t = i.getReadFormat(e);
        return e && e.useraw ? function(e) {
            var t, n = r(e).slice();
            for (n[217] = n[196],
            n[218] = n[197],
            n[219] = n[198],
            t = 160; t <= 191; t++)
                n[t] = o(t - 160, e.bin);
            return n
        }(t) : r(t)
    }
}
, function(e, t, n) {
    t.Encoder = s;
    var i = n(18)
      , r = n(11).EncodeBuffer;
    function s(e) {
        if (!(this instanceof s))
            return new s(e);
        r.call(this, e)
    }
    s.prototype = new r,
    i.mixin(s.prototype),
    s.prototype.encode = function(e) {
        this.write(e),
        this.emit("data", this.read())
    }
    ,
    s.prototype.end = function(e) {
        arguments.length && this.encode(e),
        this.flush(),
        this.emit("end")
    }
}
, function(e, t, n) {
    t.Decoder = s;
    var i = n(18)
      , r = n(16).DecodeBuffer;
    function s(e) {
        if (!(this instanceof s))
            return new s(e);
        r.call(this, e)
    }
    s.prototype = new r,
    i.mixin(s.prototype),
    s.prototype.decode = function(e) {
        arguments.length && this.write(e),
        this.flush()
    }
    ,
    s.prototype.push = function(e) {
        this.emit("data", e)
    }
    ,
    s.prototype.end = function(e) {
        this.decode(e),
        this.emit("end")
    }
}
, function(e, t, n) {
    n(9),
    n(4),
    t.createCodec = n(3).createCodec
}
, function(e, t, n) {
    n(9),
    n(4),
    t.codec = {
        preset: n(3).preset
    }
}
, function(e, t) {
    var n, i, r = e.exports = {};
    function s() {
        throw new Error("setTimeout has not been defined")
    }
    function a() {
        throw new Error("clearTimeout has not been defined")
    }
    function o(e) {
        if (n === setTimeout)
            return setTimeout(e, 0);
        if ((n === s || !n) && setTimeout)
            return n = setTimeout,
            setTimeout(e, 0);
        try {
            return n(e, 0)
        } catch (t) {
            try {
                return n.call(null, e, 0)
            } catch (t) {
                return n.call(this, e, 0)
            }
        }
    }
    !function() {
        try {
            n = "function" == typeof setTimeout ? setTimeout : s
        } catch (e) {
            n = s
        }
        try {
            i = "function" == typeof clearTimeout ? clearTimeout : a
        } catch (e) {
            i = a
        }
    }();
    var c, l = [], h = !1, u = -1;
    function f() {
        h && c && (h = !1,
        c.length ? l = c.concat(l) : u = -1,
        l.length && d())
    }
    function d() {
        if (!h) {
            var e = o(f);
            h = !0;
            for (var t = l.length; t; ) {
                for (c = l,
                l = []; ++u < t; )
                    c && c[u].run();
                u = -1,
                t = l.length
            }
            c = null,
            h = !1,
            function(e) {
                if (i === clearTimeout)
                    return clearTimeout(e);
                if ((i === a || !i) && clearTimeout)
                    return i = clearTimeout,
                    clearTimeout(e);
                try {
                    i(e)
                } catch (t) {
                    try {
                        return i.call(null, e)
                    } catch (t) {
                        return i.call(this, e)
                    }
                }
            }(e)
        }
    }
    function p(e, t) {
        this.fun = e,
        this.array = t
    }
    function g() {}
    r.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++)
                t[n - 1] = arguments[n];
        l.push(new p(e,t)),
        1 !== l.length || h || o(d)
    }
    ,
    p.prototype.run = function() {
        this.fun.apply(null, this.array)
    }
    ,
    r.title = "browser",
    r.browser = !0,
    r.env = {},
    r.argv = [],
    r.version = "",
    r.versions = {},
    r.on = g,
    r.addListener = g,
    r.once = g,
    r.off = g,
    r.removeListener = g,
    r.removeAllListeners = g,
    r.emit = g,
    r.prependListener = g,
    r.prependOnceListener = g,
    r.listeners = function(e) {
        return []
    }
    ,
    r.binding = function(e) {
        throw new Error("process.binding is not supported")
    }
    ,
    r.cwd = function() {
        return "/"
    }
    ,
    r.chdir = function(e) {
        throw new Error("process.chdir is not supported")
    }
    ,
    r.umask = function() {
        return 0
    }
}
, function(e, t) {
    var n = Math.abs
      , i = (Math.cos,
    Math.sin,
    Math.pow,
    Math.sqrt)
      , r = (n = Math.abs,
    Math.atan2)
      , s = Math.PI;
    e.exports.randInt = function(e, t) {
        return Math.floor(Math.random() * (t - e + 1)) + e
    }
    ,
    e.exports.randFloat = function(e, t) {
        return Math.random() * (t - e + 1) + e
    }
    ,
    e.exports.lerp = function(e, t, n) {
        return e + (t - e) * n
    }
    ,
    e.exports.decel = function(e, t) {
        return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)),
        e
    }
    ,
    e.exports.getDistance = function(e, t, n, r) {
        return i((n -= e) * n + (r -= t) * r)
    }
    ,
    e.exports.getDirection = function(e, t, n, i) {
        return r(t - i, e - n)
    }
    ,
    e.exports.getAngleDist = function(e, t) {
        var i = n(t - e) % (2 * s);
        return i > s ? 2 * s - i : i
    }
    ,
    e.exports.isNumber = function(e) {
        return "number" == typeof e && !isNaN(e) && isFinite(e)
    }
    ,
    e.exports.isString = function(e) {
        return e && "string" == typeof e
    }
    ,
    e.exports.kFormat = function(e) {
        return e > 999 ? (e / 1e3).toFixed(1) + "k" : e
    }
    ,
    e.exports.capitalizeFirst = function(e) {
        return e.charAt(0).toUpperCase() + e.slice(1)
    }
    ,
    e.exports.fixTo = function(e, t) {
        return parseFloat(e.toFixed(t))
    }
    ,
    e.exports.sortByPoints = function(e, t) {
        return parseFloat(t.points) - parseFloat(e.points)
    }
    ,
    e.exports.lineInRect = function(e, t, n, i, r, s, a, o) {
        var c = r
          , l = a;
        if (r > a && (c = a,
        l = r),
        l > n && (l = n),
        c < e && (c = e),
        c > l)
            return !1;
        var h = s
          , u = o
          , f = a - r;
        if (Math.abs(f) > 1e-7) {
            var d = (o - s) / f
              , p = s - d * r;
            h = d * c + p,
            u = d * l + p
        }
        if (h > u) {
            var g = u;
            u = h,
            h = g
        }
        return u > i && (u = i),
        h < t && (h = t),
        !(h > u)
    }
    ,
    e.exports.containsPoint = function(e, t, n) {
        var i = e.getBoundingClientRect()
          , r = i.left + window.scrollX
          , s = i.top + window.scrollY
          , a = i.width
          , o = i.height;
        return t > r && t < r + a && n > s && n < s + o
    }
    ,
    e.exports.mousifyTouchEvent = function(e) {
        var t = e.changedTouches[0];
        e.screenX = t.screenX,
        e.screenY = t.screenY,
        e.clientX = t.clientX,
        e.clientY = t.clientY,
        e.pageX = t.pageX,
        e.pageY = t.pageY
    }
    ,
    e.exports.hookTouchEvents = function(t, n) {
        var i = !n
          , r = !1;
        function s(n) {
            e.exports.mousifyTouchEvent(n),
            window.setUsingTouch(!0),
            i && (n.preventDefault(),
            n.stopPropagation()),
            r && (t.onclick && t.onclick(n),
            t.onmouseout && t.onmouseout(n),
            r = !1)
        }
        t.addEventListener("touchstart", e.exports.checkTrusted((function(n) {
            e.exports.mousifyTouchEvent(n),
            window.setUsingTouch(!0),
            i && (n.preventDefault(),
            n.stopPropagation()),
            t.onmouseover && t.onmouseover(n),
            r = !0
        }
        )), !1),
        t.addEventListener("touchmove", e.exports.checkTrusted((function(n) {
            e.exports.mousifyTouchEvent(n),
            window.setUsingTouch(!0),
            i && (n.preventDefault(),
            n.stopPropagation()),
            e.exports.containsPoint(t, n.pageX, n.pageY) ? r || (t.onmouseover && t.onmouseover(n),
            r = !0) : r && (t.onmouseout && t.onmouseout(n),
            r = !1)
        }
        )), !1),
        t.addEventListener("touchend", e.exports.checkTrusted(s), !1),
        t.addEventListener("touchcancel", e.exports.checkTrusted(s), !1),
        t.addEventListener("touchleave", e.exports.checkTrusted(s), !1)
    }
    ,
    e.exports.removeAllChildren = function(e) {
        for (; e.hasChildNodes(); )
            e.removeChild(e.lastChild)
    }
    ,
    e.exports.generateElement = function(t) {
        var n = document.createElement(t.tag || "div");
        function i(e, i) {
            t[e] && (n[i] = t[e])
        }
        for (var r in i("text", "textContent"),
        i("html", "innerHTML"),
        i("class", "className"),
        t) {
            switch (r) {
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
            n[r] = t[r]
        }
        if (n.onclick && (n.onclick = e.exports.checkTrusted(n.onclick)),
        n.onmouseover && (n.onmouseover = e.exports.checkTrusted(n.onmouseover)),
        n.onmouseout && (n.onmouseout = e.exports.checkTrusted(n.onmouseout)),
        t.style && (n.style.cssText = t.style),
        t.hookTouch && e.exports.hookTouchEvents(n),
        t.parent && t.parent.appendChild(n),
        t.children)
            for (var s = 0; s < t.children.length; s++)
                n.appendChild(t.children[s]);
        return n
    }
    ,
    e.exports.eventIsTrusted = function(e) {
        return !e || "boolean" != typeof e.isTrusted || e.isTrusted
    }
    ,
    e.exports.checkTrusted = function(t) {
        return function(n) {
            n && n instanceof Event && e.exports.eventIsTrusted(n) && t(n)
        }
    }
    ,
    e.exports.randomString = function(e) {
        for (var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; i < e; i++)
            t += n.charAt(Math.floor(Math.random() * n.length));
        return t
    }
    ,
    e.exports.countInArray = function(e, t) {
        for (var n = 0, i = 0; i < e.length; i++)
            e[i] === t && n++;
        return n
    }
}
, function(e, t) {
    e.exports.AnimText = function() {
        this.init = function(e, t, n, i, r, s, a) {
            this.x = e,
            this.y = t,
            this.color = a,
            this.scale = n,
            this.startScale = this.scale,
            this.maxScale = 1.5 * n,
            this.scaleSpeed = .7,
            this.speed = i,
            this.life = r,
            this.text = s
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
        this.render = function(e, t, n) {
            e.fillStyle = this.color,
            e.font = this.scale + "px Hammersmith One",
            e.fillText(this.text, this.x - t, this.y - n)
        }
    }
    ,
    e.exports.TextManager = function() {
        this.texts = [],
        this.update = function(e, t, n, i) {
            t.textBaseline = "middle",
            t.textAlign = "center";
            for (var r = 0; r < this.texts.length; ++r)
                this.texts[r].life && (this.texts[r].update(e),
                this.texts[r].render(t, n, i))
        }
        ,
        this.showText = function(t, n, i, r, s, a, o) {
            for (var c, l = 0; l < this.texts.length; ++l)
                if (!this.texts[l].life) {
                    c = this.texts[l];
                    break
                }
            c || (c = new e.exports.AnimText,
            this.texts.push(c)),
            c.init(t, n, i, r, s, a, o)
        }
    }
}
, function(e, t) {
    e.exports = function(e) {
        this.sid = e,
        this.init = function(e, t, n, i, r, s, a) {
            s = s || {},
            this.sentTo = {},
            this.gridLocations = [],
            this.active = !0,
            this.doUpdate = s.doUpdate,
            this.x = e,
            this.y = t,
            this.dir = n,
            this.xWiggle = 0,
            this.yWiggle = 0,
            this.scale = i,
            this.type = r,
            this.id = s.id,
            this.owner = a,
            this.name = s.name,
            this.isItem = null != this.id,
            this.group = s.group,
            this.health = s.health,
            this.layer = 2,
            null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1),
            this.colDiv = s.colDiv || 1,
            this.blocker = s.blocker,
            this.ignoreCollision = s.ignoreCollision,
            this.dontGather = s.dontGather,
            this.hideFromEnemy = s.hideFromEnemy,
            this.friction = s.friction,
            this.projDmg = s.projDmg,
            this.dmg = s.dmg,
            this.pDmg = s.pDmg,
            this.pps = s.pps,
            this.zIndex = s.zIndex || 0,
            this.turnSpeed = s.turnSpeed,
            this.req = s.req,
            this.trap = s.trap,
            this.healCol = s.healCol,
            this.teleport = s.teleport,
            this.boostSpeed = s.boostSpeed,
            this.projectile = s.projectile,
            this.shootRange = s.shootRange,
            this.shootRate = s.shootRate,
            this.shootCount = this.shootRate,
            this.spawnPoint = s.spawnPoint,
            this.range = s.range || 0
        }
        ,
        this.changeHealth = function(e, t) {
            return this.health += e,
            this.health <= 0
        }
        ,
        this.getScale = function(e, t) {
            return e = e || 1,
            this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : .6 * e) * (t ? 1 : this.colDiv)
        }
        ,
        this.visibleToPlayer = function(e) {
            return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team)
        }
        ,
        this.update = function(e) {
            this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, e)),
            this.yWiggle && (this.yWiggle *= Math.pow(.99, e)),
            this.turnSpeed && (this.dir += this.turnSpeed * e))
        }
    }
}
, function(e, t) {
    e.exports.groups = [{
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
        layer: -1
    }],
    t.projectiles = [{
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
    }],
    t.weapons = [{
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
    }],
    e.exports.list = [{
        group: e.exports.groups[0],
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
        group: e.exports.groups[0],
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
        group: e.exports.groups[0],
        name: "cheese",
        desc: "restores 30 health and another 50 over 5 seconds",
        req: ["food", 25],
        consume: function(e) {
            return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10,
            e.dmgOverTime.doer = e,
            e.dmgOverTime.time = 5,
            !0)
        },
        scale: 27,
        holdOffset: 15
    }, {
        group: e.exports.groups[1],
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
        group: e.exports.groups[1],
        name: "stone wall",
        desc: "provides improved protection for your village",
        req: ["stone", 25],
        health: 900,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        group: e.exports.groups[1],
        name: "castle wall",
        desc: "provides powerful protection for your village",
        req: ["stone", 35],
        health: 1500,
        scale: 52,
        holdOffset: 20,
        placeOffset: -5
    }, {
        group: e.exports.groups[2],
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
        group: e.exports.groups[2],
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
        group: e.exports.groups[2],
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
        group: e.exports.groups[2],
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
        group: e.exports.groups[3],
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
        group: e.exports.groups[3],
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
        group: e.exports.groups[3],
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
        group: e.exports.groups[4],
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
        group: e.exports.groups[11],
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
        group: e.exports.groups[5],
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
        group: e.exports.groups[6],
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
        group: e.exports.groups[7],
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
        group: e.exports.groups[8],
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
        group: e.exports.groups[9],
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
        group: e.exports.groups[10],
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
        group: e.exports.groups[12],
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
        group: e.exports.groups[13],
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
    }, {
        group: e.exports.groups[14],
        name: "Teddy Mod",
        desc: "Mod By : BrownTeddy",
        req: ["free", 0],
        health: 500,
        scale: 27,
        holdOffset: -5,
        consume: function(t, n) {
            return n.add(n.objects.length, t.x, t.y, t.dir, this.scale || 26, 1, e.exports.list[23], !0, t, !0),
            !0
        }
    }];
    for (var n = 0; n < e.exports.list.length; ++n)
        e.exports.list[n].id = n,
        e.exports.list[n].pre && (e.exports.list[n].pre = n - e.exports.list[n].pre)
}
, function(e, t) {
    e.exports = {}
}
, function(e, t) {
    var n = Math.floor
      , i = Math.abs
      , r = Math.cos
      , s = Math.sin
      , a = (Math.pow,
    Math.sqrt);
    e.exports = function(e, t, o, c, l, h, u) {
        this.objects = t,
        this.grids = {},
        this.updateObjects = [];
        let f = 0;
        var d, p, g = c.mapScale / c.colGrid;
        this.setObjectGrids = function(e) {
            for (var t = Math.min(c.mapScale, Math.max(0, e.x)), n = Math.min(c.mapScale, Math.max(0, e.y)), i = 0; i < c.colGrid; ++i) {
                d = i * g;
                for (var r = 0; r < c.colGrid; ++r)
                    p = r * g,
                    t + e.scale >= d && t - e.scale <= d + g && n + e.scale >= p && n - e.scale <= p + g && (this.grids[i + "_" + r] || (this.grids[i + "_" + r] = []),
                    this.grids[i + "_" + r].push(e),
                    e.gridLocations.push(i + "_" + r))
            }
        }
        ,
        this.removeObjGrid = function(e) {
            for (var t, n = 0; n < e.gridLocations.length; ++n)
                (t = this.grids[e.gridLocations[n]].indexOf(e)) >= 0 && this.grids[e.gridLocations[n]].splice(t, 1)
        }
        ,
        this.disableObj = function(e) {
            if (e.active = !1,
            h) {
                e.owner && e.pps && (e.owner.pps -= e.pps),
                this.removeObjGrid(e),
                "ban" === y.name && h.broadcast("12", e.sid);
                var t = this.updateObjects.indexOf(e);
                t >= 0 && this.updateObjects.splice(t, 1)
            }
        }
        ,
        this.hitObj = function(e, t) {
            for (var n = 0; n < l.length; ++n)
                l[n].active && (e.sentTo[l[n].id] && (e.active ? l[n].canSee(e) && h.send(l[n].id, "8", o.fixTo(t, 1), e.sid) : h.send(l[n].id, "12", e.sid)),
                e.active || e.owner != l[n] || l[n].changeItemCount(e.group.id, -1))
        }
        ;
        var m, y, k = [];
        this.getGridArrays = function(e, t, i) {
            d = n(e / g),
            p = n(t / g),
            k.length = 0;
            try {
                this.grids[d + "_" + p] && k.push(this.grids[d + "_" + p]),
                e + i >= (d + 1) * g && ((m = this.grids[d + 1 + "_" + p]) && k.push(m),
                p && t - i <= p * g ? (m = this.grids[d + 1 + "_" + (p - 1)]) && k.push(m) : t + i >= (p + 1) * g && (m = this.grids[d + 1 + "_" + (p + 1)]) && k.push(m)),
                d && e - i <= d * g && ((m = this.grids[d - 1 + "_" + p]) && k.push(m),
                p && t - i <= p * g ? (m = this.grids[d - 1 + "_" + (p - 1)]) && k.push(m) : t + i >= (p + 1) * g && (m = this.grids[d - 1 + "_" + (p + 1)]) && k.push(m)),
                t + i >= (p + 1) * g && (m = this.grids[d + "_" + (p + 1)]) && k.push(m),
                p && t - i <= p * g && (m = this.grids[d + "_" + (p - 1)]) && k.push(m)
            } catch (e) {}
            return k
        }
        ,
        this.add = function(n, i, r, s, a, o, c, l, u) {
            if (f++,
            y = null,
            c && "ban" === c.name)
                h && (y = new e(f),
                t.push(y),
                y.sid = f,
                y.init(i, r, s, a, o, c, u),
                h.broadcast("b", f, i, r, s, a, o));
            else {
                for (var d = 0; d < t.length; ++d)
                    if (t[d].sid == n) {
                        y = t[d];
                        break
                    }
                if (!y)
                    for (d = 0; d < t.length; ++d)
                        if (!t[d].active) {
                            y = t[d];
                            break
                        }
                y || (y = new e(n),
                t.push(y)),
                l && (y.sid = n),
                y.init(i, r, s, a, o, c, u)
            }
            h && (this.setObjectGrids(y),
            (y.doUpdate || "ban" === y.name) && this.updateObjects.push(y))
        }
        ,
        this.addBait = function(n, i, r, s, a, o) {
            (y = new e(n)).init(i, r, s, a, o, u.list[23], null),
            y.sid = n,
            t.push(y)
        }
        ,
        this.disableBySid = function(e) {
            for (var n = 0; n < t.length; ++n)
                if (t[n].sid == e)
                    return void this.disableObj(t[n])
        }
        ,
        this.removeAllItems = function(e, n) {
            for (var i = 0; i < t.length; ++i)
                t[i].active && t[i].owner && t[i].owner.sid == e && this.disableObj(t[i]);
            n && n.broadcast("13", e)
        }
        ,
        this.fetchSpawnObj = function(e) {
            for (var n = null, i = 0; i < t.length; ++i)
                if ((y = t[i]).active && y.owner && y.owner.sid == e && y.spawnPoint) {
                    n = [y.x, y.y],
                    this.disableObj(y),
                    h.broadcast("12", y.sid),
                    y.owner && y.owner.changeItemCount(y.group.id, -1);
                    break
                }
            return n
        }
        ,
        this.checkItemLocation = function(e, n, i, r, s, a, l) {
            for (var h = 0; h < t.length; ++h) {
                var u = t[h].blocker ? t[h].blocker : t[h].getScale(r, t[h].isItem);
                if (t[h].active && o.getDistance(e, n, t[h].x, t[h].y) < i + u)
                    return !1
            }
            return !(!a && 18 != s && n >= c.mapScale / 2 - c.riverWidth / 2 && n <= c.mapScale / 2 + c.riverWidth / 2)
        }
        ,
        this.addProjectile = function(e, t, n, i, r) {
            for (var s, a = u.projectiles[r], c = 0; c < projectiles.length; ++c)
                if (!projectiles[c].active) {
                    s = projectiles[c];
                    break
                }
            s || (s = new Projectile(l,o),
            projectiles.push(s)),
            s.init(r, e, t, n, a.speed, i, a.scale)
        }
        ,
        this.checkCollision = function(e, t, n) {
            n = n || 1;
            var l = e.x - t.x
              , h = e.y - t.y
              , u = e.scale + t.scale;
            if (i(l) <= u || i(h) <= u) {
                u = e.scale + (t.getScale ? t.getScale() : t.scale);
                var f = a(l * l + h * h) - u;
                if (f <= 0) {
                    if (t.ignoreCollision)
                        !t.trap || e.noTrap || t.owner == e || t.owner && t.owner.team && t.owner.team == e.team ? t.boostSpeed ? (e.xVel += n * t.boostSpeed * (t.weightM || 1) * r(t.dir),
                        e.yVel += n * t.boostSpeed * (t.weightM || 1) * s(t.dir)) : t.healCol ? e.healCol = t.healCol : t.teleport && (e.x = o.randInt(0, c.mapScale),
                        e.y = o.randInt(0, c.mapScale)) : (e.lockMove = !0,
                        t.hideFromEnemy = !1);
                    else {
                        var d = o.getDirection(e.x, e.y, t.x, t.y);
                        if (t.isPlayer ? (f = -1 * f / 2,
                        e.x += f * r(d),
                        e.y += f * s(d),
                        t.x -= f * r(d),
                        t.y -= f * s(d)) : (e.x = t.x + u * r(d),
                        e.y = t.y + u * s(d),
                        e.xVel *= .75,
                        e.yVel *= .75),
                        t.dmg && t.owner != e && (!t.owner || !t.owner.team || t.owner.team != e.team)) {
                            e.changeHealth(-t.dmg, t.owner, t);
                            var p = 1.5 * (t.weightM || 1);
                            e.xVel += p * r(d),
                            e.yVel += p * s(d),
                            !t.pDmg || e.skin && e.skin.poisonRes || (e.dmgOverTime.dmg = t.pDmg,
                            e.dmgOverTime.time = 5,
                            e.dmgOverTime.doer = t.owner),
                            e.colDmg && t.health && (t.changeHealth(-e.colDmg) && this.disableObj(t),
                            this.hitObj(t, o.getDirection(e.x, e.y, t.x, t.y)))
                        }
                    }
                    return t.zIndex > e.zIndex && (e.zIndex = t.zIndex),
                    !0
                }
            }
            return !1
        }
    }
}
, function(e, t, n) {
    var i = new (n(48));
    i.addWords("senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa");
    var r = Math.abs
      , s = Math.cos
      , a = Math.sin
      , o = Math.pow
      , c = Math.sqrt;
    e.exports = function(e, t, n, l, h, u, f, d, p, g, m, y, k, v) {
        this.id = e,
        this.sid = t,
        this.tmpScore = 0,
        this.team = null,
        this.skinIndex = 0,
        this.tailIndex = 0,
        this.hitTime = 0,
        this.tails = {},
        this.objectManager = u;
        for (var w = 0; w < m.length; ++w)
            m[w].price <= 0 && (this.tails[m[w].id] = 1);
        for (this.skins = {},
        w = 0; w < g.length; ++w)
            g[w].price <= 0 && (this.skins[g[w].id] = 1);
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
        this.spawn = function(e) {
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
            this.scale = n.playerScale,
            this.speed = n.playerSpeed,
            this.resetMoveDir(),
            this.resetResources(e),
            this.items = [0, 3, 6, 10, 23],
            this.weapons = [0],
            this.shootCount = 0,
            this.weaponXP = [],
            this.reloads = {}
        }
        ,
        this.resetMoveDir = function() {
            this.moveDir = void 0
        }
        ,
        this.resetResources = function(e) {
            for (var t = 0; t < n.resourceTypes.length; ++t)
                this[n.resourceTypes[t]] = e ? 100 : 0
        }
        ,
        this.addItem = function(e) {
            var t = p.list[e];
            if (t) {
                for (var n = 0; n < this.items.length; ++n)
                    if (p.list[this.items[n]].group == t.group)
                        return this.buildIndex == this.items[n] && (this.buildIndex = e),
                        this.items[n] = e,
                        !0;
                return this.items.push(e),
                !0
            }
            return !1
        }
        ,
        this.setUserData = function(e) {
            if (e) {
                this.name = "unknown";
                var t = e.name + ""
                  , r = !1
                  , s = (t = (t = (t = (t = t.slice(0, n.maxNameLength)).replace(/[^\w:\(\)\/? -]+/gim, " ")).replace(/[^\x00-\x7F]/g, " ")).trim()).toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                for (var a of i.list)
                    if (-1 != s.indexOf(a)) {
                        r = !0;
                        break
                    }
                t.length > 0 && !r && (this.name = t),
                this.skinColor = 0,
                n.skinColors[e.skin] && (this.skinColor = e.skin)
            }
        }
        ,
        this.getData = function() {
            return [this.id, this.sid, this.name, l.fixTo(this.x, 2), l.fixTo(this.y, 2), l.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
        }
        ,
        this.setData = function(e) {
            this.id = e[0],
            this.sid = e[1],
            this.name = e[2],
            this.x = e[3],
            this.y = e[4],
            this.dir = e[5],
            this.health = e[6],
            this.maxHealth = e[7],
            this.scale = e[8],
            this.skinColor = e[9]
        }
        ;
        var b = 0;
        this.update = function(e) {
            if (this.alive) {
                if (this.shameTimer > 0 && (this.shameTimer -= e,
                this.shameTimer <= 0 && (this.shameTimer = 0,
                this.shameCount = 0)),
                (b -= e) <= 0) {
                    var t = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
                    t && this.changeHealth(t, this),
                    this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
                    this.dmgOverTime.time -= 1,
                    this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
                    this.healCol && this.changeHealth(this.healCol, this),
                    b = 1e3
                }
                if (this.alive) {
                    if (this.slowMult < 1 && (this.slowMult += 8e-4 * e,
                    this.slowMult > 1 && (this.slowMult = 1)),
                    this.noMovTimer += e,
                    (this.xVel || this.yVel) && (this.noMovTimer = 0),
                    this.lockMove)
                        this.xVel = 0,
                        this.yVel = 0;
                    else {
                        var i = (this.buildIndex >= 0 ? .5 : 1) * (p.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= n.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : n.snowSpeed : 1) * this.slowMult;
                        !this.zIndex && this.y >= n.mapScale / 2 - n.riverWidth / 2 && this.y <= n.mapScale / 2 + n.riverWidth / 2 && (this.skin && this.skin.watrImm ? (i *= .75,
                        this.xVel += .4 * n.waterCurrent * e) : (i *= .33,
                        this.xVel += n.waterCurrent * e));
                        var r = null != this.moveDir ? s(this.moveDir) : 0
                          , d = null != this.moveDir ? a(this.moveDir) : 0
                          , g = c(r * r + d * d);
                        0 != g && (r /= g,
                        d /= g),
                        r && (this.xVel += r * this.speed * i * e),
                        d && (this.yVel += d * this.speed * i * e)
                    }
                    var m;
                    this.zIndex = 0,
                    this.lockMove = !1,
                    this.healCol = 0;
                    for (var y = l.getDistance(0, 0, this.xVel * e, this.yVel * e), k = Math.min(4, Math.max(1, Math.round(y / 40))), v = 1 / k, w = 0; w < k; ++w) {
                        this.xVel && (this.x += this.xVel * e * v),
                        this.yVel && (this.y += this.yVel * e * v),
                        m = u.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < m.length; ++x)
                            for (var S = 0; S < m[x].length; ++S)
                                m[x][S].active && u.checkCollision(this, m[x][S], v)
                    }
                    for (w = (I = f.indexOf(this)) + 1; w < f.length; ++w)
                        f[w] != this && f[w].alive && u.checkCollision(this, f[w]);
                    if (this.xVel && (this.xVel *= o(n.playerDecel, e),
                    this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)),
                    this.yVel && (this.yVel *= o(n.playerDecel, e),
                    this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)),
                    this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > n.mapScale && (this.x = n.mapScale - this.scale),
                    this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > n.mapScale && (this.y = n.mapScale - this.scale),
                    this.buildIndex < 0)
                        if (this.reloads[this.weaponIndex] > 0)
                            this.reloads[this.weaponIndex] -= e,
                            this.gathering = this.mouseState;
                        else if (this.gathering || this.autoGather) {
                            var T = !0;
                            if (null != p.weapons[this.weaponIndex].gather)
                                this.gather(f);
                            else if (null != p.weapons[this.weaponIndex].projectile && this.hasRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                                this.useRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0),
                                this.noMovTimer = 0;
                                var I = p.weapons[this.weaponIndex].projectile
                                  , E = 2 * this.scale
                                  , M = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                                p.weapons[this.weaponIndex].rec && (this.xVel -= p.weapons[this.weaponIndex].rec * s(this.dir),
                                this.yVel -= p.weapons[this.weaponIndex].rec * a(this.dir)),
                                h.addProjectile(this.x + E * s(this.dir), this.y + E * a(this.dir), this.dir, p.projectiles[I].range * M, p.projectiles[I].speed * M, I, this, null, this.zIndex)
                            } else
                                T = !1;
                            this.gathering = this.mouseState,
                            T && (this.reloads[this.weaponIndex] = p.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
                        }
                }
            }
        }
        ,
        this.addWeaponXP = function(e) {
            this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0),
            this.weaponXP[this.weaponIndex] += e
        }
        ,
        this.earnXP = function(e) {
            this.age < n.maxAge && (this.XP += e,
            this.XP >= this.maxXP ? (this.age < n.maxAge ? (this.age++,
            this.XP = 0,
            this.maxXP *= 1.2) : this.XP = this.maxXP,
            this.upgradePoints++,
            y.send(this.id, "16", this.upgradePoints, this.upgrAge),
            y.send(this.id, "15", this.XP, l.fixTo(this.maxXP, 1), this.age)) : y.send(this.id, "15", this.XP))
        }
        ,
        this.changeHealth = function(e, t) {
            if (e > 0 && this.health >= this.maxHealth)
                return !1;
            e < 0 && this.skin && (e *= this.skin.dmgMult || 1),
            e < 0 && this.tail && (e *= this.tail.dmgMult || 1),
            e < 0 && (this.hitTime = Date.now()),
            this.health += e,
            this.health > this.maxHealth && (e -= this.health - this.maxHealth,
            this.health = this.maxHealth),
            this.health <= 0 && this.kill(t);
            for (var n = 0; n < f.length; ++n)
                this.sentTo[f[n].id] && y.send(f[n].id, "h", this.sid, Math.round(this.health));
            return !t || !t.canSee(this) || t == this && e < 0 || y.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1),
            !0
        }
        ,
        this.kill = function(e) {
            e && e.alive && (e.kills++,
            e.skin && e.skin.goldSteal ? k(e, Math.round(this.points / 2)) : k(e, Math.round(100 * this.age * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))),
            y.send(e.id, "9", "kills", e.kills, 1)),
            this.alive = !1,
            y.send(this.id, "11"),
            v()
        }
        ,
        this.addResource = function(e, t, i) {
            !i && t > 0 && this.addWeaponXP(t),
            3 == e ? k(this, t, !0) : (this[n.resourceTypes[e]] += t,
            y.send(this.id, "9", n.resourceTypes[e], this[n.resourceTypes[e]], 1))
        }
        ,
        this.changeItemCount = function(e, t) {
            this.itemCounts[e] = this.itemCounts[e] || 0,
            this.itemCounts[e] += t,
            y.send(this.id, "14", e, this.itemCounts[e])
        }
        ,
        this.buildItem = function(e) {
            var t = this.scale + e.scale + (e.placeOffset || 0)
              , n = this.x + t * s(this.dir)
              , i = this.y + t * a(this.dir);
            if (this.canBuild(e) && !(e.consume && this.skin && this.skin.noEat) && (e.consume || u.checkItemLocation(n, i, e.scale, .6, e.id, !1, this))) {
                var r = !1;
                if (e.consume) {
                    if (this.hitTime) {
                        var o = Date.now() - this.hitTime;
                        this.hitTime = 0,
                        o <= 120 ? (this.shameCount++,
                        this.shameCount >= 8 && (this.shameTimer = 3e4,
                        this.shameCount = 0)) : (this.shameCount -= 2,
                        this.shameCount <= 0 && (this.shameCount = 0))
                    }
                    this.shameTimer <= 0 && (r = e.consume(this, u))
                } else
                    r = !0,
                    e.group.limit && this.changeItemCount(e.group.id, 1),
                    e.pps && (this.pps += e.pps),
                    u.add(u.objects.length, n, i, this.dir, e.scale, e.type, e, !1, this);
                r && (this.useRes(e),
                this.buildIndex = -1)
            }
        }
        ,
        this.hasRes = function(e, t) {
            for (var n = 0; n < e.req.length; ) {
                if (this[e.req[n]] < Math.round(e.req[n + 1] * (t || 1)))
                    return !1;
                n += 2
            }
            return !0
        }
        ,
        this.useRes = function(e, t) {
            if (!n.inSandbox)
                for (var i = 0; i < e.req.length; )
                    this.addResource(n.resourceTypes.indexOf(e.req[i]), -Math.round(e.req[i + 1] * (t || 1))),
                    i += 2
        }
        ,
        this.canBuild = function(e) {
            return !!n.inSandbox || !(e.group.limit && this.itemCounts[e.group.id] >= e.group.limit) && this.hasRes(e)
        }
        ,
        this.gather = function() {
            this.noMovTimer = 0,
            this.slowMult -= p.weapons[this.weaponIndex].hitSlow || .3,
            this.slowMult < 0 && (this.slowMult = 0);
            for (var e, t, i, r = n.fetchVariant(this), o = r.poison, c = r.val, h = {}, g = u.getGridArrays(this.x, this.y, p.weapons[this.weaponIndex].range), m = 0; m < g.length; ++m)
                for (var y = 0; y < g[m].length; ++y)
                    if ((t = g[m][y]).active && !t.dontGather && !h[t.sid] && t.visibleToPlayer(this) && l.getDistance(this.x, this.y, t.x, t.y) - t.scale <= p.weapons[this.weaponIndex].range && (e = l.getDirection(t.x, t.y, this.x, this.y),
                    l.getAngleDist(e, this.dir) <= n.gatherAngle)) {
                        if (h[t.sid] = 1,
                        t.health) {
                            if (t.changeHealth(-p.weapons[this.weaponIndex].dmg * c * (p.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                                for (var k = 0; k < t.req.length; )
                                    this.addResource(n.resourceTypes.indexOf(t.req[k]), t.req[k + 1]),
                                    k += 2;
                                u.disableObj(t)
                            }
                        } else {
                            this.earnXP(4 * p.weapons[this.weaponIndex].gather);
                            var v = p.weapons[this.weaponIndex].gather + (3 == t.type ? 4 : 0);
                            this.skin && this.skin.extraGold && this.addResource(3, 1),
                            this.addResource(t.type, v)
                        }
                        i = !0,
                        u.hitObj(t, e)
                    }
            for (y = 0; y < f.length + d.length; ++y)
                if ((t = f[y] || d[y - f.length]) != this && t.alive && (!t.team || t.team != this.team) && l.getDistance(this.x, this.y, t.x, t.y) - 1.8 * t.scale <= p.weapons[this.weaponIndex].range && (e = l.getDirection(t.x, t.y, this.x, this.y),
                l.getAngleDist(e, this.dir) <= n.gatherAngle)) {
                    var w = p.weapons[this.weaponIndex].steal;
                    w && t.addResource && (w = Math.min(t.points || 0, w),
                    this.addResource(3, w),
                    t.addResource(3, -w));
                    var b = c;
                    null != t.weaponIndex && p.weapons[t.weaponIndex].shield && l.getAngleDist(e + Math.PI, t.dir) <= n.shieldAngle && (b = p.weapons[t.weaponIndex].shield);
                    var x = p.weapons[this.weaponIndex].dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1)
                      , S = .3 * (t.weightM || 1) + (p.weapons[this.weaponIndex].knock || 0);
                    t.xVel += S * s(e),
                    t.yVel += S * a(e),
                    this.skin && this.skin.healD && this.changeHealth(x * b * this.skin.healD, this),
                    this.tail && this.tail.healD && this.changeHealth(x * b * this.tail.healD, this),
                    t.skin && t.skin.dmg && 1 == b && this.changeHealth(-x * t.skin.dmg, t),
                    t.tail && t.tail.dmg && 1 == b && this.changeHealth(-x * t.tail.dmg, t),
                    !(t.dmgOverTime && this.skin && this.skin.poisonDmg) || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = this.skin.poisonDmg,
                    t.dmgOverTime.time = this.skin.poisonTime || 1,
                    t.dmgOverTime.doer = this),
                    !t.dmgOverTime || !o || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = 5,
                    t.dmgOverTime.time = 5,
                    t.dmgOverTime.doer = this),
                    t.skin && t.skin.dmgK && (this.xVel -= t.skin.dmgK * s(e),
                    this.yVel -= t.skin.dmgK * a(e)),
                    t.changeHealth(-x * b, this, this)
                }
            this.sendAnimation(i ? 1 : 0)
        }
        ,
        this.sendAnimation = function(e) {
            for (var t = 0; t < f.length; ++t)
                this.sentTo[f[t].id] && this.canSee(f[t]) && y.send(f[t].id, "7", this.sid, e ? 1 : 0, this.weaponIndex)
        }
        ;
        var x = 0
          , S = 0;
        this.animate = function(e) {
            this.animTime > 0 && (this.animTime -= e,
            this.animTime <= 0 ? (this.animTime = 0,
            this.dirPlus = 0,
            x = 0,
            S = 0) : 0 == S ? (x += e / (this.animSpeed * n.hitReturnRatio),
            this.dirPlus = l.lerp(0, this.targetAngle, Math.min(1, x)),
            x >= 1 && (x = 1,
            S = 1)) : (x -= e / (this.animSpeed * (1 - n.hitReturnRatio)),
            this.dirPlus = l.lerp(0, this.targetAngle, Math.max(0, x))))
        }
        ,
        this.startAnim = function(e, t) {
            this.animTime = this.animSpeed = p.weapons[t].speed,
            this.targetAngle = e ? -n.hitAngle : -Math.PI,
            x = 0,
            S = 0
        }
        ,
        this.canSee = function(e) {
            if (!e)
                return !1;
            if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer)
                return !1;
            var t = r(e.x - this.x) - e.scale
              , i = r(e.y - this.y) - e.scale;
            return t <= n.maxScreenWidth / 2 * 1.3 && i <= n.maxScreenHeight / 2 * 1.3
        }
    }
}
, function(e, t, n) {
    const i = n(49).words
      , r = n(50).array;
    e.exports = class {
        constructor(e={}) {
            Object.assign(this, {
                list: e.emptyList && [] || Array.prototype.concat.apply(i, [r, e.list || []]),
                exclude: e.exclude || [],
                splitRegex: e.splitRegex || /\b/,
                placeHolder: e.placeHolder || "*",
                regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                replaceRegex: e.replaceRegex || /\w/g
            })
        }
        isProfane(e) {
            return this.list.filter(t=>{
                const n = new RegExp(`\\b${t.replace(/(\W)/g, "\\$1")}\\b`,"gi");
                return !this.exclude.includes(t.toLowerCase()) && n.test(e)
            }
            ).length > 0 || !1
        }
        replaceWord(e) {
            return e.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder)
        }
        clean(e) {
            return e.split(this.splitRegex).map(e=>this.isProfane(e) ? this.replaceWord(e) : e).join(this.splitRegex.exec(e)[0])
        }
        addWords() {
            let e = Array.from(arguments);
            this.list.push(...e),
            e.map(e=>e.toLowerCase()).forEach(e=>{
                this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1)
            }
            )
        }
        removeWords() {
            this.exclude.push(...Array.from(arguments).map(e=>e.toLowerCase()))
        }
    }
}
, function(e) {
    e.exports = {
        words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]
    }
}
, function(e, t, n) {
    e.exports = {
        object: n(51),
        array: n(52),
        regex: n(53)
    }
}
, function(e, t) {
    e.exports = {
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
}
, function(e, t) {
    e.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]
}
, function(e, t) {
    e.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi
}
, function(e, t) {
    e.exports.hats = [{
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
    }],
    e.exports.accessories = [{
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
}
, function(e, t) {
    e.exports = function(e, t, n, i, r, s, a) {
        this.init = function(e, t, n, i, r, s, o, c, l) {
            this.active = !0,
            this.indx = e,
            this.x = t,
            this.y = n,
            this.dir = i,
            this.skipMov = !0,
            this.speed = r,
            this.dmg = s,
            this.scale = c,
            this.range = o,
            this.owner = l,
            a && (this.sentTo = {})
        }
        ;
        var o, c = [];
        this.update = function(l) {
            if (this.active) {
                var h, u = this.speed * l;
                if (this.skipMov ? this.skipMov = !1 : (this.x += u * Math.cos(this.dir),
                this.y += u * Math.sin(this.dir),
                this.range -= u,
                this.range <= 0 && (this.x += this.range * Math.cos(this.dir),
                this.y += this.range * Math.sin(this.dir),
                u = 1,
                this.range = 0,
                this.active = !1)),
                a) {
                    for (var f = 0; f < e.length; ++f)
                        !this.sentTo[e[f].id] && e[f].canSee(this) && (this.sentTo[e[f].id] = 1,
                        a.send(e[f].id, "18", s.fixTo(this.x, 1), s.fixTo(this.y, 1), s.fixTo(this.dir, 2), s.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                    for (c.length = 0,
                    f = 0; f < e.length + t.length; ++f)
                        !(o = e[f] || t[f - e.length]).alive || o == this.owner || this.owner.team && o.team == this.owner.team || s.lineInRect(o.x - o.scale, o.y - o.scale, o.x + o.scale, o.y + o.scale, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(o);
                    for (var d = n.getGridArrays(this.x, this.y, this.scale), p = 0; p < d.length; ++p)
                        for (var g = 0; g < d[p].length; ++g)
                            h = (o = d[p][g]).getScale(),
                            o.active && this.ignoreObj != o.sid && this.layer <= o.layer && c.indexOf(o) < 0 && !o.ignoreCollision && s.lineInRect(o.x - h, o.y - h, o.x + h, o.y + h, this.x, this.y, this.x + u * Math.cos(this.dir), this.y + u * Math.sin(this.dir)) && c.push(o);
                    if (c.length > 0) {
                        var m = null
                          , y = null
                          , k = null;
                        for (f = 0; f < c.length; ++f)
                            k = s.getDistance(this.x, this.y, c[f].x, c[f].y),
                            (null == y || k < y) && (y = k,
                            m = c[f]);
                        if (m.isPlayer || m.isAI) {
                            var v = .3 * (m.weightM || 1);
                            m.xVel += v * Math.cos(this.dir),
                            m.yVel += v * Math.sin(this.dir),
                            null != m.weaponIndex && i.weapons[m.weaponIndex].shield && s.getAngleDist(this.dir + Math.PI, m.dir) <= r.shieldAngle || m.changeHealth(-this.dmg, this.owner, this.owner)
                        } else
                            for (m.projDmg && m.health && m.changeHealth(-this.dmg) && n.disableObj(m),
                            f = 0; f < e.length; ++f)
                                e[f].active && (m.sentTo[e[f].id] && (m.active ? e[f].canSee(m) && a.send(e[f].id, "8", s.fixTo(this.dir, 2), m.sid) : a.send(e[f].id, "12", m.sid)),
                                m.active || m.owner != e[f] || e[f].changeItemCount(m.group.id, -1));
                        for (this.active = !1,
                        f = 0; f < e.length; ++f)
                            this.sentTo[e[f].id] && a.send(e[f].id, "19", this.sid, s.fixTo(y, 1))
                    }
                }
            }
        }
    }
}
, function(e, t) {
    e.exports = function(e, t, n, i, r, s, a, o, c) {
        this.addProjectile = function(l, h, u, f, d, p, g, m, y) {
            for (var k, v = s.projectiles[p], w = 0; w < t.length; ++w)
                if (!t[w].active) {
                    k = t[w];
                    break
                }
            return k || ((k = new e(n,i,r,s,a,o,c)).sid = t.length,
            t.push(k)),
            k.init(p, l, h, u, d, v.dmg, f, v.scale, g),
            k.ignoreObj = m,
            k.layer = y || v.layer,
            k.src = v.src,
            k
        }
    }
}
, function(e, t) {
    e.exports.obj = function(e, t) {
        var n;
        this.sounds = [],
        this.active = !0,
        this.play = function(t, i, r) {
            i && this.active && ((n = this.sounds[t]) || (n = new Howl({
                src: ".././sound/" + t + ".mp3"
            }),
            this.sounds[t] = n),
            r && n.isPlaying || (n.isPlaying = !0,
            n.play(),
            n.volume((i || 1) * e.volumeMult),
            n.loop(r)))
        }
        ,
        this.toggleMute = function(e, t) {
            (n = this.sounds[e]) && n.mute(t)
        }
        ,
        this.stop = function(e) {
            (n = this.sounds[e]) && (n.stop(),
            n.isPlaying = !1)
        }
    }
}
, function(e, t, n) {
    var i = n(59)
      , r = n(66);
    function s(e, t, n, i, r) {
        "localhost" == location.hostname && (window.location.hostname = "127.0.0.1"),
        this.debugLog = !1,
        this.baseUrl = e,
        this.lobbySize = n,
        this.devPort = t,
        this.lobbySpread = i,
        this.rawIPs = !!r,
        this.server = void 0,
        this.gameIndex = void 0,
        this.callback = void 0,
        this.errorCallback = void 0,
        this.processServers(vultr.servers),
        this.serverProtocol = location.protocol.startsWith("https") ? "https" : "http"
    }
    s.prototype.regionInfo = {
        0: {
            name: "Local",
            latitude: 0,
            longitude: 0
        },
        "vultr:1": {
            name: "New Jersey",
            latitude: 40.1393329,
            longitude: -75.8521818
        },
        "vultr:2": {
            name: "Chicago",
            latitude: 41.8339037,
            longitude: -87.872238
        },
        "vultr:3": {
            name: "Dallas",
            latitude: 32.8208751,
            longitude: -96.8714229
        },
        "vultr:4": {
            name: "Seattle",
            latitude: 47.6149942,
            longitude: -122.4759879
        },
        "vultr:5": {
            name: "Los Angeles",
            latitude: 34.0207504,
            longitude: -118.691914
        },
        "vultr:6": {
            name: "Atlanta",
            latitude: 33.7676334,
            longitude: -84.5610332
        },
        "vultr:7": {
            name: "Amsterdam",
            latitude: 52.3745287,
            longitude: 4.7581878
        },
        "vultr:8": {
            name: "London",
            latitude: 51.5283063,
            longitude: -.382486
        },
        "vultr:9": {
            name: "Frankfurt",
            latitude: 50.1211273,
            longitude: 8.496137
        },
        "vultr:12": {
            name: "Silicon Valley",
            latitude: 37.4024714,
            longitude: -122.3219752
        },
        "vultr:19": {
            name: "Sydney",
            latitude: -33.8479715,
            longitude: 150.651084
        },
        "vultr:24": {
            name: "Paris",
            latitude: 48.8588376,
            longitude: 2.2773454
        },
        "vultr:25": {
            name: "Tokyo",
            latitude: 35.6732615,
            longitude: 139.569959
        },
        "vultr:39": {
            name: "Miami",
            latitude: 25.7823071,
            longitude: -80.3012156
        },
        "vultr:40": {
            name: "Singapore",
            latitude: 1.3147268,
            longitude: 103.7065876
        }
    },
    s.prototype.start = function(e, t) {
        this.callback = e,
        this.errorCallback = t;
        var n = this.parseServerQuery();
        n ? (this.log("Found server in query."),
        this.password = n[3],
        this.connect(n[0], n[1], n[2])) : (this.log("Pinging servers..."),
        this.pingServers())
    }
    ,
    s.prototype.parseServerQuery = function() {
        var e = i.parse(location.href, !0)
          , t = e.query.server;
        if ("string" == typeof t) {
            var n = t.split(":");
            if (3 == n.length) {
                var r = n[0]
                  , s = parseInt(n[1])
                  , a = parseInt(n[2]);
                return "0" == r || r.startsWith("vultr:") || (r = "vultr:" + r),
                [r, s, a, e.query.password]
            }
            this.errorCallback("Invalid number of server parameters in " + t)
        }
    }
    ,
    s.prototype.findServer = function(e, t) {
        var n = this.servers[e];
        if (Array.isArray(n)) {
            for (var i = 0; i < n.length; i++) {
                var r = n[i];
                if (r.index == t)
                    return r
            }
            console.warn("Could not find server in region " + e + " with index " + t + ".")
        } else
            this.errorCallback("No server list for region " + e)
    }
    ,
    s.prototype.pingServers = function() {
        var e = this
          , t = [];
        for (var n in this.servers)
            if (this.servers.hasOwnProperty(n)) {
                var i = this.servers[n]
                  , r = i[Math.floor(Math.random() * i.length)];
                null != r ? function(i, r) {
                    var s = new XMLHttpRequest;
                    s.onreadystatechange = function(i) {
                        var s = i.target;
                        if (4 == s.readyState)
                            if (200 == s.status) {
                                for (var a = 0; a < t.length; a++)
                                    t[a].abort();
                                e.log("Connecting to region", r.region);
                                var o = e.seekServer(r.region);
                                e.connect(o[0], o[1], o[2])
                            } else
                                console.warn("Error pinging " + r.ip + " in region " + n)
                    }
                    ;
                    const a = e.serverProtocol + "://" + e.serverAddress(r.ip, !0) + ":" + e.serverPort(r) + "/ping";
                    s.open("GET", a, !0),
                    s.send(null),
                    e.log("Pinging", a),
                    t.push(s)
                }(0, r) : console.log("No target server for region " + n)
            }
    }
    ,
    s.prototype.seekServer = function(e, t, n) {
        null == n && (n = "random"),
        null == t && (t = !1);
        const i = ["random"];
        var r = this.lobbySize
          , s = this.lobbySpread
          , a = this.servers[e].flatMap((function(e) {
            var t = 0;
            return e.games.map((function(n) {
                var i = t++;
                return {
                    region: e.region,
                    index: e.index * e.games.length + i,
                    gameIndex: i,
                    gameCount: e.games.length,
                    playerCount: n.playerCount,
                    isPrivate: n.isPrivate
                }
            }
            ))
        }
        )).filter((function(e) {
            return !e.isPrivate
        }
        )).filter((function(e) {
            return !t || 0 == e.playerCount && e.gameIndex >= e.gameCount / 2
        }
        )).filter((function(e) {
            return "random" == n || i[e.index % i.length].key == n
        }
        )).sort((function(e, t) {
            return t.playerCount - e.playerCount
        }
        )).filter((function(e) {
            return e.playerCount < r
        }
        ));
        if (t && a.reverse(),
        0 != a.length) {
            var o = Math.min(s, a.length)
              , c = Math.floor(Math.random() * o)
              , l = a[c = Math.min(c, a.length - 1)]
              , h = l.region
              , u = (c = Math.floor(l.index / l.gameCount),
            l.index % l.gameCount);
            return this.log("Found server."),
            [h, c, u]
        }
        this.errorCallback("No open servers.")
    }
    ,
    s.prototype.connect = function(e, t, n) {
        if (!this.connected) {
            var i = this.findServer(e, t);
            null != i ? (this.log("Connecting to server", i, "with game index", n),
            i.games[n].playerCount >= this.lobbySize ? this.errorCallback("Server is already full.") : (window.history.replaceState(document.title, document.title, this.generateHref(e, t, n, this.password)),
            this.server = i,
            this.gameIndex = n,
            this.log("Calling callback with address", this.serverAddress(i.ip), "on port", this.serverPort(i), "with game index", n),
            this.callback(this.serverAddress(i.ip), this.serverPort(i), n))) : this.errorCallback("Failed to find server for region " + e + " and index " + t)
        }
    }
    ,
    s.prototype.switchServer = function(e, t, n, i) {
        this.switchingServers = !0,
        window.location.href = this.generateHref(e, t, n, i)
    }
    ,
    s.prototype.generateHref = function(e, t, n, i) {
        var r = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + n;
        return i && (r += "&password=" + encodeURIComponent(i)),
        r
    }
    ,
    s.prototype.serverAddress = function(e, t) {
        return "127.0.0.1" == e || "7f000001" == e || "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ? window.location.hostname : this.rawIPs ? t ? "ip_" + this.hashIP(e) + "." + this.baseUrl : e : "ip_" + e + "." + this.baseUrl
    }
    ,
    s.prototype.serverPort = function(e) {
        return 0 == e.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80
    }
    ,
    s.prototype.processServers = function(e) {
        for (var t = {}, n = 0; n < e.length; n++) {
            var i = e[n]
              , r = t[i.region];
            null == r && (r = [],
            t[i.region] = r),
            r.push(i)
        }
        for (var s in t)
            t[s] = t[s].sort((function(e, t) {
                return e.index - t.index
            }
            ));
        this.servers = t
    }
    ,
    s.prototype.ipToHex = function(e) {
        return e.split(".").map(e=>("00" + parseInt(e).toString(16)).substr(-2)).join("").toLowerCase()
    }
    ,
    s.prototype.hashIP = function(e) {
        return r(this.ipToHex(e))
    }
    ,
    s.prototype.log = function() {
        return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0
    }
    ,
    s.prototype.stripRegion = function(e) {
        return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)),
        e
    }
    ,
    window.testVultrClient = function() {
        var e = 1;
        function t(t, n) {
            (t = "" + t) == (n = "" + n) ? console.log(`Assert ${e} passed.`) : console.warn(`Assert ${e} failed. Expected ${n}, got ${t}.`),
            e++
        }
        var n = new s("test.io",-1,5,1,!1);
        n.errorCallback = function(e) {}
        ,
        n.processServers(function(e) {
            var t = [];
            for (var n in e)
                for (var i = e[n], r = 0; r < i.length; r++)
                    t.push({
                        ip: n + ":" + r,
                        scheme: "testing",
                        region: n,
                        index: r,
                        games: i[r].map(e=>({
                            playerCount: e,
                            isPrivate: !1
                        }))
                    });
            return console.log("gen", t),
            t
        }({
            1: [[0, 0, 0, 0], [0, 0, 0, 0]],
            2: [[5, 1, 0, 0], [0, 0, 0, 0]],
            3: [[5, 0, 1, 5], [0, 0, 0, 0]],
            4: [[5, 1, 1, 5], [1, 0, 0, 0]],
            5: [[5, 1, 1, 5], [1, 0, 4, 0]],
            6: [[5, 5, 5, 5], [2, 3, 1, 4]],
            7: [[5, 5, 5, 5], [5, 5, 5, 5]]
        })),
        t(n.seekServer(1, !1), [1, 0, 0]),
        t(n.seekServer(1, !0), [1, 1, 3]),
        t(n.seekServer(2, !1), [2, 0, 1]),
        t(n.seekServer(2, !0), [2, 1, 3]),
        t(n.seekServer(3, !1), [3, 0, 2]),
        t(n.seekServer(3, !0), [3, 1, 3]),
        t(n.seekServer(4, !1), [4, 0, 1]),
        t(n.seekServer(4, !0), [4, 1, 3]),
        t(n.seekServer(5, !1), [5, 1, 2]),
        t(n.seekServer(5, !0), [5, 1, 3]),
        t(n.seekServer(6, !1), [6, 1, 3]),
        t(n.seekServer(6, !0), void 0),
        t(n.seekServer(7, !1), void 0),
        t(n.seekServer(7, !0), void 0),
        console.log("Tests passed.")
    }
    ;
    var a = function(e, t) {
        return e.concat(t)
    };
    Array.prototype.flatMap = function(e) {
        return function(e, t) {
            return t.map(e).reduce(a, [])
        }(e, this)
    }
    ,
    e.exports = s
}
, function(e, t, n) {
    "use strict";
    var i = n(60)
      , r = n(62);
    function s() {
        this.protocol = null,
        this.slashes = null,
        this.auth = null,
        this.host = null,
        this.port = null,
        this.hostname = null,
        this.hash = null,
        this.search = null,
        this.query = null,
        this.pathname = null,
        this.path = null,
        this.href = null
    }
    t.parse = v,
    t.resolve = function(e, t) {
        return v(e, !1, !0).resolve(t)
    }
    ,
    t.resolveObject = function(e, t) {
        return e ? v(e, !1, !0).resolveObject(t) : t
    }
    ,
    t.format = function(e) {
        return r.isString(e) && (e = v(e)),
        e instanceof s ? e.format() : s.prototype.format.call(e)
    }
    ,
    t.Url = s;
    var a = /^([a-z0-9.+-]+:)/i
      , o = /:[0-9]*$/
      , c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/
      , l = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"])
      , h = ["'"].concat(l)
      , u = ["%", "/", "?", ";", "#"].concat(h)
      , f = ["/", "?", "#"]
      , d = /^[+a-z0-9A-Z_-]{0,63}$/
      , p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/
      , g = {
        javascript: !0,
        "javascript:": !0
    }
      , m = {
        javascript: !0,
        "javascript:": !0
    }
      , y = {
        http: !0,
        https: !0,
        ftp: !0,
        gopher: !0,
        file: !0,
        "http:": !0,
        "https:": !0,
        "ftp:": !0,
        "gopher:": !0,
        "file:": !0
    }
      , k = n(63);
    function v(e, t, n) {
        if (e && r.isObject(e) && e instanceof s)
            return e;
        var i = new s;
        return i.parse(e, t, n),
        i
    }
    s.prototype.parse = function(e, t, n) {
        if (!r.isString(e))
            throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
        var s = e.indexOf("?")
          , o = -1 !== s && s < e.indexOf("#") ? "?" : "#"
          , l = e.split(o);
        l[0] = l[0].replace(/\\/g, "/");
        var v = e = l.join(o);
        if (v = v.trim(),
        !n && 1 === e.split("#").length) {
            var w = c.exec(v);
            if (w)
                return this.path = v,
                this.href = v,
                this.pathname = w[1],
                w[2] ? (this.search = w[2],
                this.query = t ? k.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "",
                this.query = {}),
                this
        }
        var b = a.exec(v);
        if (b) {
            var x = (b = b[0]).toLowerCase();
            this.protocol = x,
            v = v.substr(b.length)
        }
        if (n || b || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var S = "//" === v.substr(0, 2);
            !S || b && m[b] || (v = v.substr(2),
            this.slashes = !0)
        }
        if (!m[b] && (S || b && !y[b])) {
            for (var T, I, E = -1, M = 0; M < f.length; M++)
                -1 !== (A = v.indexOf(f[M])) && (-1 === E || A < E) && (E = A);
            for (-1 !== (I = -1 === E ? v.lastIndexOf("@") : v.lastIndexOf("@", E)) && (T = v.slice(0, I),
            v = v.slice(I + 1),
            this.auth = decodeURIComponent(T)),
            E = -1,
            M = 0; M < u.length; M++) {
                var A;
                -1 !== (A = v.indexOf(u[M])) && (-1 === E || A < E) && (E = A)
            }
            -1 === E && (E = v.length),
            this.host = v.slice(0, E),
            v = v.slice(E),
            this.parseHost(),
            this.hostname = this.hostname || "";
            var P = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
            if (!P)
                for (var B = this.hostname.split(/\./), C = (M = 0,
                B.length); M < C; M++) {
                    var R = B[M];
                    if (R && !R.match(d)) {
                        for (var O = "", j = 0, _ = R.length; j < _; j++)
                            R.charCodeAt(j) > 127 ? O += "x" : O += R[j];
                        if (!O.match(d)) {
                            var D = B.slice(0, M)
                              , U = B.slice(M + 1)
                              , L = R.match(p);
                            L && (D.push(L[1]),
                            U.unshift(L[2])),
                            U.length && (v = "/" + U.join(".") + v),
                            this.hostname = D.join(".");
                            break
                        }
                    }
                }
            this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(),
            P || (this.hostname = i.toASCII(this.hostname));
            var F = this.port ? ":" + this.port : ""
              , z = this.hostname || "";
            this.host = z + F,
            this.href += this.host,
            P && (this.hostname = this.hostname.substr(1, this.hostname.length - 2),
            "/" !== v[0] && (v = "/" + v))
        }
        if (!g[x])
            for (M = 0,
            C = h.length; M < C; M++) {
                var H = h[M];
                if (-1 !== v.indexOf(H)) {
                    var V = encodeURIComponent(H);
                    V === H && (V = escape(H)),
                    v = v.split(H).join(V)
                }
            }
        var Y = v.indexOf("#");
        -1 !== Y && (this.hash = v.substr(Y),
        v = v.slice(0, Y));
        var q = v.indexOf("?");
        if (-1 !== q ? (this.search = v.substr(q),
        this.query = v.substr(q + 1),
        t && (this.query = k.parse(this.query)),
        v = v.slice(0, q)) : t && (this.search = "",
        this.query = {}),
        v && (this.pathname = v),
        y[x] && this.hostname && !this.pathname && (this.pathname = "/"),
        this.pathname || this.search) {
            F = this.pathname || "";
            var W = this.search || "";
            this.path = F + W
        }
        return this.href = this.format(),
        this
    }
    ,
    s.prototype.format = function() {
        var e = this.auth || "";
        e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"),
        e += "@");
        var t = this.protocol || ""
          , n = this.pathname || ""
          , i = this.hash || ""
          , s = !1
          , a = "";
        this.host ? s = e + this.host : this.hostname && (s = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"),
        this.port && (s += ":" + this.port)),
        this.query && r.isObject(this.query) && Object.keys(this.query).length && (a = k.stringify(this.query));
        var o = this.search || a && "?" + a || "";
        return t && ":" !== t.substr(-1) && (t += ":"),
        this.slashes || (!t || y[t]) && !1 !== s ? (s = "//" + (s || ""),
        n && "/" !== n.charAt(0) && (n = "/" + n)) : s || (s = ""),
        i && "#" !== i.charAt(0) && (i = "#" + i),
        o && "?" !== o.charAt(0) && (o = "?" + o),
        t + s + (n = n.replace(/[?#]/g, (function(e) {
            return encodeURIComponent(e)
        }
        ))) + (o = o.replace("#", "%23")) + i
    }
    ,
    s.prototype.resolve = function(e) {
        return this.resolveObject(v(e, !1, !0)).format()
    }
    ,
    s.prototype.resolveObject = function(e) {
        if (r.isString(e)) {
            var t = new s;
            t.parse(e, !1, !0),
            e = t
        }
        for (var n = new s, i = Object.keys(this), a = 0; a < i.length; a++) {
            var o = i[a];
            n[o] = this[o]
        }
        if (n.hash = e.hash,
        "" === e.href)
            return n.href = n.format(),
            n;
        if (e.slashes && !e.protocol) {
            for (var c = Object.keys(e), l = 0; l < c.length; l++) {
                var h = c[l];
                "protocol" !== h && (n[h] = e[h])
            }
            return y[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = "/"),
            n.href = n.format(),
            n
        }
        if (e.protocol && e.protocol !== n.protocol) {
            if (!y[e.protocol]) {
                for (var u = Object.keys(e), f = 0; f < u.length; f++) {
                    var d = u[f];
                    n[d] = e[d]
                }
                return n.href = n.format(),
                n
            }
            if (n.protocol = e.protocol,
            e.host || m[e.protocol])
                n.pathname = e.pathname;
            else {
                for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift()); )
                    ;
                e.host || (e.host = ""),
                e.hostname || (e.hostname = ""),
                "" !== p[0] && p.unshift(""),
                p.length < 2 && p.unshift(""),
                n.pathname = p.join("/")
            }
            if (n.search = e.search,
            n.query = e.query,
            n.host = e.host || "",
            n.auth = e.auth,
            n.hostname = e.hostname || e.host,
            n.port = e.port,
            n.pathname || n.search) {
                var g = n.pathname || ""
                  , k = n.search || "";
                n.path = g + k
            }
            return n.slashes = n.slashes || e.slashes,
            n.href = n.format(),
            n
        }
        var v = n.pathname && "/" === n.pathname.charAt(0)
          , w = e.host || e.pathname && "/" === e.pathname.charAt(0)
          , b = w || v || n.host && e.pathname
          , x = b
          , S = n.pathname && n.pathname.split("/") || []
          , T = (p = e.pathname && e.pathname.split("/") || [],
        n.protocol && !y[n.protocol]);
        if (T && (n.hostname = "",
        n.port = null,
        n.host && ("" === S[0] ? S[0] = n.host : S.unshift(n.host)),
        n.host = "",
        e.protocol && (e.hostname = null,
        e.port = null,
        e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)),
        e.host = null),
        b = b && ("" === p[0] || "" === S[0])),
        w)
            n.host = e.host || "" === e.host ? e.host : n.host,
            n.hostname = e.hostname || "" === e.hostname ? e.hostname : n.hostname,
            n.search = e.search,
            n.query = e.query,
            S = p;
        else if (p.length)
            S || (S = []),
            S.pop(),
            S = S.concat(p),
            n.search = e.search,
            n.query = e.query;
        else if (!r.isNullOrUndefined(e.search))
            return T && (n.hostname = n.host = S.shift(),
            (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = P.shift(),
            n.host = n.hostname = P.shift())),
            n.search = e.search,
            n.query = e.query,
            r.isNull(n.pathname) && r.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")),
            n.href = n.format(),
            n;
        if (!S.length)
            return n.pathname = null,
            n.search ? n.path = "/" + n.search : n.path = null,
            n.href = n.format(),
            n;
        for (var I = S.slice(-1)[0], E = (n.host || e.host || S.length > 1) && ("." === I || ".." === I) || "" === I, M = 0, A = S.length; A >= 0; A--)
            "." === (I = S[A]) ? S.splice(A, 1) : ".." === I ? (S.splice(A, 1),
            M++) : M && (S.splice(A, 1),
            M--);
        if (!b && !x)
            for (; M--; M)
                S.unshift("..");
        !b || "" === S[0] || S[0] && "/" === S[0].charAt(0) || S.unshift(""),
        E && "/" !== S.join("/").substr(-1) && S.push("");
        var P, B = "" === S[0] || S[0] && "/" === S[0].charAt(0);
        return T && (n.hostname = n.host = B ? "" : S.length ? S.shift() : "",
        (P = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = P.shift(),
        n.host = n.hostname = P.shift())),
        (b = b || n.host && S.length) && !B && S.unshift(""),
        S.length ? n.pathname = S.join("/") : (n.pathname = null,
        n.path = null),
        r.isNull(n.pathname) && r.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")),
        n.auth = e.auth || n.auth,
        n.slashes = n.slashes || e.slashes,
        n.href = n.format(),
        n
    }
    ,
    s.prototype.parseHost = function() {
        var e = this.host
          , t = o.exec(e);
        t && (":" !== (t = t[0]) && (this.port = t.substr(1)),
        e = e.substr(0, e.length - t.length)),
        e && (this.hostname = e)
    }
}
, function(e, t, n) {
    (function(e, i) {
        var r;
        /*! https://mths.be/punycode v1.4.1 by @mathias */
        !function(s) {
            t && t.nodeType,
            e && e.nodeType;
            var a = "object" == typeof i && i;
            a.global !== a && a.window !== a && a.self;
            var o, c = 2147483647, l = 36, h = /^xn--/, u = /[^\x20-\x7E]/, f = /[\x2E\u3002\uFF0E\uFF61]/g, d = {
                overflow: "Overflow: input needs wider integers to process",
                "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                "invalid-input": "Invalid input"
            }, p = Math.floor, g = String.fromCharCode;
            function m(e) {
                throw new RangeError(d[e])
            }
            function y(e, t) {
                for (var n = e.length, i = []; n--; )
                    i[n] = t(e[n]);
                return i
            }
            function k(e, t) {
                var n = e.split("@")
                  , i = "";
                return n.length > 1 && (i = n[0] + "@",
                e = n[1]),
                i + y((e = e.replace(f, ".")).split("."), t).join(".")
            }
            function v(e) {
                for (var t, n, i = [], r = 0, s = e.length; r < s; )
                    (t = e.charCodeAt(r++)) >= 55296 && t <= 56319 && r < s ? 56320 == (64512 & (n = e.charCodeAt(r++))) ? i.push(((1023 & t) << 10) + (1023 & n) + 65536) : (i.push(t),
                    r--) : i.push(t);
                return i
            }
            function w(e) {
                return y(e, (function(e) {
                    var t = "";
                    return e > 65535 && (t += g((e -= 65536) >>> 10 & 1023 | 55296),
                    e = 56320 | 1023 & e),
                    t + g(e)
                }
                )).join("")
            }
            function b(e) {
                return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : l
            }
            function x(e, t) {
                return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
            }
            function S(e, t, n) {
                var i = 0;
                for (e = n ? p(e / 700) : e >> 1,
                e += p(e / t); e > 455; i += l)
                    e = p(e / 35);
                return p(i + 36 * e / (e + 38))
            }
            function T(e) {
                var t, n, i, r, s, a, o, h, u, f, d = [], g = e.length, y = 0, k = 128, v = 72;
                for ((n = e.lastIndexOf("-")) < 0 && (n = 0),
                i = 0; i < n; ++i)
                    e.charCodeAt(i) >= 128 && m("not-basic"),
                    d.push(e.charCodeAt(i));
                for (r = n > 0 ? n + 1 : 0; r < g; ) {
                    for (s = y,
                    a = 1,
                    o = l; r >= g && m("invalid-input"),
                    ((h = b(e.charCodeAt(r++))) >= l || h > p((c - y) / a)) && m("overflow"),
                    y += h * a,
                    !(h < (u = o <= v ? 1 : o >= v + 26 ? 26 : o - v)); o += l)
                        a > p(c / (f = l - u)) && m("overflow"),
                        a *= f;
                    v = S(y - s, t = d.length + 1, 0 == s),
                    p(y / t) > c - k && m("overflow"),
                    k += p(y / t),
                    y %= t,
                    d.splice(y++, 0, k)
                }
                return w(d)
            }
            function I(e) {
                var t, n, i, r, s, a, o, h, u, f, d, y, k, w, b, T = [];
                for (y = (e = v(e)).length,
                t = 128,
                n = 0,
                s = 72,
                a = 0; a < y; ++a)
                    (d = e[a]) < 128 && T.push(g(d));
                for (i = r = T.length,
                r && T.push("-"); i < y; ) {
                    for (o = c,
                    a = 0; a < y; ++a)
                        (d = e[a]) >= t && d < o && (o = d);
                    for (o - t > p((c - n) / (k = i + 1)) && m("overflow"),
                    n += (o - t) * k,
                    t = o,
                    a = 0; a < y; ++a)
                        if ((d = e[a]) < t && ++n > c && m("overflow"),
                        d == t) {
                            for (h = n,
                            u = l; !(h < (f = u <= s ? 1 : u >= s + 26 ? 26 : u - s)); u += l)
                                b = h - f,
                                w = l - f,
                                T.push(g(x(f + b % w, 0))),
                                h = p(b / w);
                            T.push(g(x(h, 0))),
                            s = S(n, k, i == r),
                            n = 0,
                            ++i
                        }
                    ++n,
                    ++t
                }
                return T.join("")
            }
            o = {
                version: "1.4.1",
                ucs2: {
                    decode: v,
                    encode: w
                },
                decode: T,
                encode: I,
                toASCII: function(e) {
                    return k(e, (function(e) {
                        return u.test(e) ? "xn--" + I(e) : e
                    }
                    ))
                },
                toUnicode: function(e) {
                    return k(e, (function(e) {
                        return h.test(e) ? T(e.slice(4).toLowerCase()) : e
                    }
                    ))
                }
            },
            void 0 === (r = function() {
                return o
            }
            .call(t, n, t, e)) || (e.exports = r)
        }()
    }
    ).call(this, n(61)(e), n(1))
}
, function(e, t) {
    e.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {}
        ,
        e.paths = [],
        e.children || (e.children = []),
        Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function() {
                return e.l
            }
        }),
        Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function() {
                return e.i
            }
        }),
        e.webpackPolyfill = 1),
        e
    }
}
, function(e, t, n) {
    "use strict";
    e.exports = {
        isString: function(e) {
            return "string" == typeof e
        },
        isObject: function(e) {
            return "object" == typeof e && null !== e
        },
        isNull: function(e) {
            return null === e
        },
        isNullOrUndefined: function(e) {
            return null == e
        }
    }
}
, function(e, t, n) {
    "use strict";
    t.decode = t.parse = n(64),
    t.encode = t.stringify = n(65)
}
, function(e, t, n) {
    "use strict";
    function i(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    e.exports = function(e, t, n, s) {
        t = t || "&",
        n = n || "=";
        var a = {};
        if ("string" != typeof e || 0 === e.length)
            return a;
        var o = /\+/g;
        e = e.split(t);
        var c = 1e3;
        s && "number" == typeof s.maxKeys && (c = s.maxKeys);
        var l = e.length;
        c > 0 && l > c && (l = c);
        for (var h = 0; h < l; ++h) {
            var u, f, d, p, g = e[h].replace(o, "%20"), m = g.indexOf(n);
            m >= 0 ? (u = g.substr(0, m),
            f = g.substr(m + 1)) : (u = g,
            f = ""),
            d = decodeURIComponent(u),
            p = decodeURIComponent(f),
            i(a, d) ? r(a[d]) ? a[d].push(p) : a[d] = [a[d], p] : a[d] = p
        }
        return a
    }
    ;
    var r = Array.isArray || function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
}
, function(e, t, n) {
    "use strict";
    var i = function(e) {
        switch (typeof e) {
        case "string":
            return e;
        case "boolean":
            return e ? "true" : "false";
        case "number":
            return isFinite(e) ? e : "";
        default:
            return ""
        }
    };
    e.exports = function(e, t, n, o) {
        return t = t || "&",
        n = n || "=",
        null === e && (e = void 0),
        "object" == typeof e ? s(a(e), (function(a) {
            var o = encodeURIComponent(i(a)) + n;
            return r(e[a]) ? s(e[a], (function(e) {
                return o + encodeURIComponent(i(e))
            }
            )).join(t) : o + encodeURIComponent(i(e[a]))
        }
        )).join(t) : o ? encodeURIComponent(i(o)) + n + encodeURIComponent(i(e)) : ""
    }
    ;
    var r = Array.isArray || function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
    ;
    function s(e, t) {
        if (e.map)
            return e.map(t);
        for (var n = [], i = 0; i < e.length; i++)
            n.push(t(e[i], i));
        return n
    }
    var a = Object.keys || function(e) {
        var t = [];
        for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        return t
    }
}
, function(e, t, n) {
    !function() {
        var t = n(67)
          , i = n(20).utf8
          , r = n(68)
          , s = n(20).bin
          , a = function(e, n) {
            e.constructor == String ? e = n && "binary" === n.encoding ? s.stringToBytes(e) : i.stringToBytes(e) : r(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || e.constructor === Uint8Array || (e = e.toString());
            for (var o = t.bytesToWords(e), c = 8 * e.length, l = 1732584193, h = -271733879, u = -1732584194, f = 271733878, d = 0; d < o.length; d++)
                o[d] = 16711935 & (o[d] << 8 | o[d] >>> 24) | 4278255360 & (o[d] << 24 | o[d] >>> 8);
            o[c >>> 5] |= 128 << c % 32,
            o[14 + (c + 64 >>> 9 << 4)] = c;
            var p = a._ff
              , g = a._gg
              , m = a._hh
              , y = a._ii;
            for (d = 0; d < o.length; d += 16) {
                var k = l
                  , v = h
                  , w = u
                  , b = f;
                h = y(h = y(h = y(h = y(h = m(h = m(h = m(h = m(h = g(h = g(h = g(h = g(h = p(h = p(h = p(h = p(h, u = p(u, f = p(f, l = p(l, h, u, f, o[d + 0], 7, -680876936), h, u, o[d + 1], 12, -389564586), l, h, o[d + 2], 17, 606105819), f, l, o[d + 3], 22, -1044525330), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 4], 7, -176418897), h, u, o[d + 5], 12, 1200080426), l, h, o[d + 6], 17, -1473231341), f, l, o[d + 7], 22, -45705983), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 8], 7, 1770035416), h, u, o[d + 9], 12, -1958414417), l, h, o[d + 10], 17, -42063), f, l, o[d + 11], 22, -1990404162), u = p(u, f = p(f, l = p(l, h, u, f, o[d + 12], 7, 1804603682), h, u, o[d + 13], 12, -40341101), l, h, o[d + 14], 17, -1502002290), f, l, o[d + 15], 22, 1236535329), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 1], 5, -165796510), h, u, o[d + 6], 9, -1069501632), l, h, o[d + 11], 14, 643717713), f, l, o[d + 0], 20, -373897302), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 5], 5, -701558691), h, u, o[d + 10], 9, 38016083), l, h, o[d + 15], 14, -660478335), f, l, o[d + 4], 20, -405537848), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 9], 5, 568446438), h, u, o[d + 14], 9, -1019803690), l, h, o[d + 3], 14, -187363961), f, l, o[d + 8], 20, 1163531501), u = g(u, f = g(f, l = g(l, h, u, f, o[d + 13], 5, -1444681467), h, u, o[d + 2], 9, -51403784), l, h, o[d + 7], 14, 1735328473), f, l, o[d + 12], 20, -1926607734), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 5], 4, -378558), h, u, o[d + 8], 11, -2022574463), l, h, o[d + 11], 16, 1839030562), f, l, o[d + 14], 23, -35309556), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 1], 4, -1530992060), h, u, o[d + 4], 11, 1272893353), l, h, o[d + 7], 16, -155497632), f, l, o[d + 10], 23, -1094730640), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 13], 4, 681279174), h, u, o[d + 0], 11, -358537222), l, h, o[d + 3], 16, -722521979), f, l, o[d + 6], 23, 76029189), u = m(u, f = m(f, l = m(l, h, u, f, o[d + 9], 4, -640364487), h, u, o[d + 12], 11, -421815835), l, h, o[d + 15], 16, 530742520), f, l, o[d + 2], 23, -995338651), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 0], 6, -198630844), h, u, o[d + 7], 10, 1126891415), l, h, o[d + 14], 15, -1416354905), f, l, o[d + 5], 21, -57434055), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 12], 6, 1700485571), h, u, o[d + 3], 10, -1894986606), l, h, o[d + 10], 15, -1051523), f, l, o[d + 1], 21, -2054922799), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 8], 6, 1873313359), h, u, o[d + 15], 10, -30611744), l, h, o[d + 6], 15, -1560198380), f, l, o[d + 13], 21, 1309151649), u = y(u, f = y(f, l = y(l, h, u, f, o[d + 4], 6, -145523070), h, u, o[d + 11], 10, -1120210379), l, h, o[d + 2], 15, 718787259), f, l, o[d + 9], 21, -343485551),
                l = l + k >>> 0,
                h = h + v >>> 0,
                u = u + w >>> 0,
                f = f + b >>> 0
            }
            return t.endian([l, h, u, f])
        };
        a._ff = function(e, t, n, i, r, s, a) {
            var o = e + (t & n | ~t & i) + (r >>> 0) + a;
            return (o << s | o >>> 32 - s) + t
        }
        ,
        a._gg = function(e, t, n, i, r, s, a) {
            var o = e + (t & i | n & ~i) + (r >>> 0) + a;
            return (o << s | o >>> 32 - s) + t
        }
        ,
        a._hh = function(e, t, n, i, r, s, a) {
            var o = e + (t ^ n ^ i) + (r >>> 0) + a;
            return (o << s | o >>> 32 - s) + t
        }
        ,
        a._ii = function(e, t, n, i, r, s, a) {
            var o = e + (n ^ (t | ~i)) + (r >>> 0) + a;
            return (o << s | o >>> 32 - s) + t
        }
        ,
        a._blocksize = 16,
        a._digestsize = 16,
        e.exports = function(e, n) {
            if (null == e)
                throw new Error("Illegal argument " + e);
            var i = t.wordsToBytes(a(e, n));
            return n && n.asBytes ? i : n && n.asString ? s.bytesToString(i) : t.bytesToHex(i)
        }
    }()
}
, function(e, t) {
    !function() {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
          , n = {
            rotl: function(e, t) {
                return e << t | e >>> 32 - t
            },
            rotr: function(e, t) {
                return e << 32 - t | e >>> t
            },
            endian: function(e) {
                if (e.constructor == Number)
                    return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
                for (var t = 0; t < e.length; t++)
                    e[t] = n.endian(e[t]);
                return e
            },
            randomBytes: function(e) {
                for (var t = []; e > 0; e--)
                    t.push(Math.floor(256 * Math.random()));
                return t
            },
            bytesToWords: function(e) {
                for (var t = [], n = 0, i = 0; n < e.length; n++,
                i += 8)
                    t[i >>> 5] |= e[n] << 24 - i % 32;
                return t
            },
            wordsToBytes: function(e) {
                for (var t = [], n = 0; n < 32 * e.length; n += 8)
                    t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                return t
            },
            bytesToHex: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push((e[n] >>> 4).toString(16)),
                    t.push((15 & e[n]).toString(16));
                return t.join("")
            },
            hexToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n += 2)
                    t.push(parseInt(e.substr(n, 2), 16));
                return t
            },
            bytesToBase64: function(e) {
                for (var n = [], i = 0; i < e.length; i += 3)
                    for (var r = e[i] << 16 | e[i + 1] << 8 | e[i + 2], s = 0; s < 4; s++)
                        8 * i + 6 * s <= 8 * e.length ? n.push(t.charAt(r >>> 6 * (3 - s) & 63)) : n.push("=");
                return n.join("")
            },
            base64ToBytes: function(e) {
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var n = [], i = 0, r = 0; i < e.length; r = ++i % 4)
                    0 != r && n.push((t.indexOf(e.charAt(i - 1)) & Math.pow(2, -2 * r + 8) - 1) << 2 * r | t.indexOf(e.charAt(i)) >>> 6 - 2 * r);
                return n
            }
        };
        e.exports = n
    }()
}
, function(e, t) {
    function n(e) {
        return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
    }
    /*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
    e.exports = function(e) {
        return null != e && (n(e) || function(e) {
            return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
        }(e) || !!e._isBuffer)
    }
}
, function(e, t) {
    e.exports = function(e, t, n, i, r, s, a, o, c) {
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
        }],
        this.spawn = function(l, h, u, f) {
            for (var d, p = 0; p < e.length; ++p)
                if (!e[p].active) {
                    d = e[p];
                    break
                }
            return d || (d = new t(e.length,r,n,i,a,s,o,c),
            e.push(d)),
            d.init(l, h, u, f, this.aiTypes[f]),
            d
        }
    }
}
, function(e, t, n) {
    (function(t) {
        var n = 2 * Math.PI;
        e.exports = function(e, i, r, s, a, o, c, l) {
            this.sid = e,
            this.isAI = !0,
            this.nameIndex = a.randInt(0, o.cowNames.length - 1),
            this.init = function(e, t, n, i, r) {
                this.x = e,
                this.y = t,
                this.startX = r.fixedSpawn ? e : null,
                this.startY = r.fixedSpawn ? t : null,
                this.xVel = 0,
                this.yVel = 0,
                this.zIndex = 0,
                this.dir = n,
                this.dirPlus = 0,
                this.index = i,
                this.src = r.src,
                r.name && (this.name = r.name),
                this.weightM = r.weightM,
                this.speed = r.speed,
                this.killScore = r.killScore,
                this.turnSpeed = r.turnSpeed,
                this.scale = r.scale,
                this.maxHealth = r.health,
                this.leapForce = r.leapForce,
                this.health = this.maxHealth,
                this.chargePlayer = r.chargePlayer,
                this.viewRange = r.viewRange,
                this.drop = r.drop,
                this.dmg = r.dmg,
                this.hostile = r.hostile,
                this.dontRun = r.dontRun,
                this.hitRange = r.hitRange,
                this.hitDelay = r.hitDelay,
                this.hitScare = r.hitScare,
                this.spriteMlt = r.spriteMlt,
                this.nameScale = r.nameScale,
                this.colDmg = r.colDmg,
                this.noTrap = r.noTrap,
                this.spawnDelay = r.spawnDelay,
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
            ;
            var h = 0;
            this.update = function(e) {
                if (this.active) {
                    if (this.spawnCounter)
                        return this.spawnCounter -= e * (1 + (t.DARKNESS > 0 ? o.MAX_SPAWN_DELAY : 0)),
                        void (this.spawnCounter <= 0 && (this.spawnCounter = 0,
                        this.x = this.startX || a.randInt(0, o.mapScale),
                        this.y = this.startY || a.randInt(0, o.mapScale)));
                    (h -= e) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
                    this.dmgOverTime.time -= 1,
                    this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
                    h = 1e3);
                    var s = !1
                      , c = 1;
                    if (!this.zIndex && !this.lockMove && this.y >= o.mapScale / 2 - o.riverWidth / 2 && this.y <= o.mapScale / 2 + o.riverWidth / 2 && (c = .33,
                    this.xVel += o.waterCurrent * e),
                    this.checkForBait(),
                    this.lockMove)
                        this.xVel = 0,
                        this.yVel = 0;
                    else if (this.waitCount > 0) {
                        if (this.waitCount -= e,
                        this.waitCount <= 0)
                            if (this.chargePlayer && !this.chargeBait) {
                                for (var u, f, d = 0, p = 0; p < r.length; ++p)
                                    !r[p].alive || r[p].skin && r[p].skin.bullRepel || (f = a.getDistance(this.x, this.y, r[p].x, r[p].y)) <= (t.DARKNESS > 0 ? 10 * this.viewRange : this.viewRange) && (!u || f < d) && (d = f,
                                    u = r[p]);
                                u ? (this.chargeTarget = u,
                                this.moveCount = a.randInt(8e3, 12e3)) : (this.moveCount = a.randInt(1e3, 2e3),
                                this.targetDir = a.randFloat(-Math.PI, Math.PI))
                            } else
                                this.moveCount = a.randInt(4e3, 1e4),
                                this.targetDir = a.randFloat(-Math.PI, Math.PI)
                    } else if (this.moveCount > 0) {
                        var g = this.speed * c * (1 + o.MAX_SPEED * t.DARKNESS);
                        if (this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) && (this.targetDir = a.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y),
                        g *= 1.42),
                        this.baitTarget && this.baitTarget.health > 0 ? (this.targetDir = a.getDirection(this.baitTarget.x, this.baitTarget.y, this.x, this.y),
                        g *= 1.75,
                        this.chargeBait = !0) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = a.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y),
                        g *= 1.75,
                        s = !0),
                        this.hitWait && (g *= .3),
                        this.dir != this.targetDir) {
                            this.dir %= n;
                            var m = (this.dir - this.targetDir + n) % n
                              , y = Math.min(Math.abs(m - n), m, this.turnSpeed * e * (1 + o.MAX_TURN_SPEED * t.DARKNESS))
                              , k = m - Math.PI >= 0 ? 1 : -1;
                            this.dir += k * y + n
                        }
                        this.dir %= n,
                        this.xVel += g * e * Math.cos(this.dir),
                        this.yVel += g * e * Math.sin(this.dir),
                        this.moveCount -= e,
                        this.moveCount <= 0 && (this.runFrom = null,
                        this.chargeTarget = null,
                        this.waitCount = this.hostile ? 1500 : a.randInt(1500, 6e3))
                    }
                    this.zIndex = 0,
                    this.lockMove = !1;
                    var v = a.getDistance(0, 0, this.xVel * e, this.yVel * e)
                      , w = Math.min(4, Math.max(1, Math.round(v / 40)))
                      , b = 1 / w;
                    for (p = 0; p < w; ++p) {
                        this.xVel && (this.x += this.xVel * e * b),
                        this.yVel && (this.y += this.yVel * e * b),
                        E = i.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < E.length; ++x)
                            for (var S = 0; S < E[x].length; ++S)
                                E[x][S].active && i.checkCollision(this, E[x][S], b)
                    }
                    var T = !1;
                    if (this.hitWait > 0 && (this.hitWait -= e,
                    this.hitWait <= 0)) {
                        T = !0,
                        this.hitWait = 0,
                        this.leapForce && !a.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir),
                        this.yVel += this.leapForce * Math.sin(this.dir));
                        for (var I, E = i.getGridArrays(this.x, this.y, this.hitRange), M = 0; M < E.length; ++M)
                            for (x = 0; x < E[M].length; ++x)
                                (I = E[M][x]).health && a.getDistance(this.x, this.y, I.x, I.y) < I.scale + this.hitRange && (I.changeHealth(5 * -this.dmg) && ("ban" === I.name && (this.waitCount = 1,
                                this.chargeBait = this.baitTarget = null),
                                i.disableObj(I)),
                                i.hitObj(I, a.getDirection(this.x, this.y, I.x, I.y)));
                        for (x = 0; x < r.length; ++x)
                            r[x].canSee(this) && l.send(r[x].id, "aa", this.sid)
                    }
                    if (s || T || this.chargeBait) {
                        let e, n, s;
                        if (this.baitTarget)
                            (e = this.baitTarget) && e.health > 0 && "ban" === e.name && (n = a.getDistance(this.x, this.y, e.x, e.y),
                            this.hitRange ? !this.hitWait && n <= this.hitRange + e.scale && (T ? (s = a.getDirection(e.x, e.y, this.x, this.y),
                            e.changeHealth(-this.dmg * (1 + o.MAX_ATTACK * t.DARKNESS)) && (i.disableObj(e),
                            this.waitCount = 1,
                            this.chargeBait = this.baitTarget = null),
                            e.xVel += .6 * Math.cos(s),
                            e.yVel += .6 * Math.sin(s),
                            this.runFrom = null,
                            this.waitCount = 3e3,
                            this.hitWait = a.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : n <= this.scale + e.scale && (s = a.getDirection(e.x, e.y, this.x, this.y),
                            e.changeHealth(-this.dmg * (1 + o.MAX_ATTACK * t.DARKNESS)) && (i.disableObj(e),
                            this.waitCount = 1,
                            this.chargeBait = this.baitTarget = null),
                            e.xVel += .55 * Math.cos(s),
                            e.yVel += .55 * Math.sin(s)));
                        else
                            for (p = 0; p < r.length; ++p)
                                (e = r[p]) && e.alive && (n = a.getDistance(this.x, this.y, e.x, e.y),
                                this.hitRange ? !this.hitWait && n <= this.hitRange + e.scale && (T ? (s = a.getDirection(e.x, e.y, this.x, this.y),
                                e.changeHealth(-this.dmg * (1 + o.MAX_ATTACK * t.DARKNESS)),
                                e.xVel += .6 * Math.cos(s),
                                e.yVel += .6 * Math.sin(s),
                                this.runFrom = null,
                                this.chargeTarget = null,
                                this.waitCount = 3e3,
                                this.hitWait = a.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : n <= this.scale + e.scale && (s = a.getDirection(e.x, e.y, this.x, this.y),
                                e.changeHealth(-this.dmg * (1 + o.MAX_ATTACK * t.DARKNESS)),
                                e.xVel += .55 * Math.cos(s),
                                e.yVel += .55 * Math.sin(s)))
                    }
                    this.xVel && (this.xVel *= Math.pow(o.playerDecel, e)),
                    this.yVel && (this.yVel *= Math.pow(o.playerDecel, e));
                    var A = this.scale;
                    this.x - A < 0 ? (this.x = A,
                    this.xVel = 0) : this.x + A > o.mapScale && (this.x = o.mapScale - A,
                    this.xVel = 0),
                    this.y - A < 0 ? (this.y = A,
                    this.yVel = 0) : this.y + A > o.mapScale && (this.y = o.mapScale - A,
                    this.yVel = 0)
                }
            }
            ,
            this.canSee = function(e) {
                if (!e)
                    return !1;
                if (e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer)
                    return !1;
                var t = Math.abs(e.x - this.x) - e.scale
                  , n = Math.abs(e.y - this.y) - e.scale;
                return t <= o.maxScreenWidth / 2 * 1.3 && n <= o.maxScreenHeight / 2 * 1.3
            }
            ;
            var u = 0
              , f = 0;
            this.animate = function(e) {
                this.animTime > 0 && (this.animTime -= e,
                this.animTime <= 0 ? (this.animTime = 0,
                this.dirPlus = 0,
                u = 0,
                f = 0) : 0 == f ? (u += e / (this.animSpeed * o.hitReturnRatio),
                this.dirPlus = a.lerp(0, this.targetAngle, Math.min(1, u)),
                u >= 1 && (u = 1,
                f = 1)) : (u -= e / (this.animSpeed * (1 - o.hitReturnRatio)),
                this.dirPlus = a.lerp(0, this.targetAngle, Math.max(0, u))))
            }
            ,
            this.checkForBait = function() {
                if (this.hostile && !this.baitTarget) {
                    let e;
                    const n = 500 * (1 + 4 * t.DARKNESS)
                      , r = i.getGridArrays(this.x, this.y, n);
                    for (let t = 0; t < r.length; ++t)
                        for (let i = 0; i < r[t].length; ++i) {
                            const s = r[t][i];
                            if (s.health && s.health > 0 && "ban" === s.name && (e = a.getDistance(this.x, this.y, s.x, s.y)) < n) {
                                this.chargeTarget = null,
                                this.chargeBait = !0,
                                this.baitTarget = s,
                                this.waitCount = 0,
                                this.moveCount = a.randInt(8e3, 12e3);
                                break
                            }
                        }
                }
            }
            ,
            this.startAnim = function() {
                this.animTime = this.animSpeed = 600,
                this.targetAngle = .8 * Math.PI,
                u = 0,
                f = 0
            }
            ,
            this.changeHealth = function(e, t, n) {
                if (this.active && (this.health += e,
                n && (this.hitScare && !a.randInt(0, this.hitScare) ? (this.runFrom = n,
                this.waitCount = 0,
                this.moveCount = 2e3) : this.hostile && this.chargePlayer && n.isPlayer ? (this.chargeTarget = n,
                this.waitCount = 0,
                this.moveCount = 8e3) : this.dontRun || (this.runFrom = n,
                this.waitCount = 0,
                this.moveCount = 2e3)),
                e < 0 && this.hitRange && a.randInt(0, 1) && (this.hitWait = 500),
                t && t.canSee(this) && e < 0 && l.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1),
                this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay,
                this.x = -1e6,
                this.y = -1e6) : (this.x = this.startX || a.randInt(0, o.mapScale),
                this.y = this.startY || a.randInt(0, o.mapScale)),
                this.health = this.maxHealth,
                this.runFrom = null,
                t && (c(t, this.killScore),
                this.drop))))
                    for (var i = 0; i < this.drop.length; )
                        t.addResource(o.resourceTypes.indexOf(this.drop[i]), this.drop[i + 1]),
                        i += 2
            }
        }
    }
    ).call(this, n(1))
}
]);
//LOOL
(function() {

	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_BummleHat = 8;
    var ID_EMPTY = 0;
	var ID_WinterCap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 35) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BummleHat);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_WinterCap);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_BummleHat);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

(function() {
	'use strict';

	var ID_BummleHat = 8;
	var ID_StrawHat = 2;
	var ID_WinterCap = 15;
	var ID_CowboyHat = 5;
	var ID_RangerHat = 4;
	var ID_ExplorerHat = 18;
	var ID_MarksmanCap = 1;
	var ID_SoldierHelmet = 6;
	var ID_HoneycrispHat = 13;
	var ID_MinersHelmet = 9;
	var ID_BoosterHat = 12;
	var ID_BushGear = 10;
	var ID_SpikeGear = 11;
	var ID_BushidoArmor = 16;
	var ID_SamuraiArmor = 20;

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode - 96) {
			case 0: storeEquip(0); break; // UnEquip
			case 1: storeEquip(ID_BummleHat); break;
			case 2: storeEquip(ID_WinterCap); break;
			case 3: storeEquip(ID_SoldierHelmet); break;
			case 4: storeEquip(ID_HoneycrispHat); break;
			case 5: storeEquip(ID_BoosterHat); break;
			case 6: storeEquip(ID_BushGear); break;
			case 7: storeEquip(ID_SpikeGear); break;
			case 8: storeEquip(ID_BushidoArmor); break;
			case 9: storeEquip(ID_SamuraiArmor); break;
		}
	});

})();