// ==UserScript==
// @name         msgpackasdw
// @description  msgpack backup
// @author       msgpack authors
// @license      MIT
// ==/UserScript==

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
!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("guify",[],n):"object"==typeof exports?exports.guify=n():e.guify=n()}(this,function(){return function(e){function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=16)}([function(e,n,t){function o(e,n,t){var o=l[n];if(void 0===o&&(o=r(n)),o){if(void 0===t)return e.style[o];e.style[o]=c(o,t)}}function i(e,n){for(var t in n)n.hasOwnProperty(t)&&o(e,t,n[t])}function r(e){var n=u(e),t=s(n);return l[n]=l[e]=l[t]=t,t}function a(){2===arguments.length?"string"==typeof arguments[1]?arguments[0].style.cssText=arguments[1]:i(arguments[0],arguments[1]):o(arguments[0],arguments[1],arguments[2])}var s=t(18),u=t(19),l={float:"cssFloat"},c=t(22);e.exports=a,e.exports.set=a,e.exports.get=function(e,n){return Array.isArray(n)?n.reduce(function(n,t){return n[t]=o(e,t||""),n},{}):o(e,n||"")}},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.theme=void 0;var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(9),a=(function(e){e&&e.__esModule}(r),function(){function e(){o(this,e)}return i(e,[{key:"Set",value:function(e){Object.assign(this,s,e)}}]),e}()),s={name:"BaseTheme",colors:{menuBarBackground:"black",menuBarText:"black",panelBackground:"black",componentBackground:"black",componentBackgroundHover:"black",componentForeground:"black",componentActive:"black",textPrimary:"black",textSecondary:"black",textHover:"black",textActive:"black"},sizing:{menuBarHeight:"25px",componentHeight:"20px",componentSpacing:"5px",labelWidth:"42%"}};n.theme=new a},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(0),i=function(e){return e&&e.__esModule?e:{default:e}}(o),r=function(e,n,t){var o=e.appendChild(document.createElement("div"));return o.classList.add("guify-component-container"),(0,i.default)(o,{position:"relative","min-height":t.sizing.componentHeight,"margin-bottom":t.sizing.componentSpacing}),o};n.default=r,e.exports=n.default},function(e,n,t){"use strict";var o=t(31);e.exports=o,e.exports.csjs=o,e.exports.getCss=t(45)},function(e,n,t){var o;!function(n){"use strict";function i(){}function r(e,n){for(var t=e.length;t--;)if(e[t].listener===n)return t;return-1}function a(e){return function(){return this[e].apply(this,arguments)}}function s(e){return"function"==typeof e||e instanceof RegExp||!(!e||"object"!=typeof e)&&s(e.listener)}var u=i.prototype,l=n.EventEmitter;u.getListeners=function(e){var n,t,o=this._getEvents();if(e instanceof RegExp){n={};for(t in o)o.hasOwnProperty(t)&&e.test(t)&&(n[t]=o[t])}else n=o[e]||(o[e]=[]);return n},u.flattenListeners=function(e){var n,t=[];for(n=0;n<e.length;n+=1)t.push(e[n].listener);return t},u.getListenersAsObject=function(e){var n,t=this.getListeners(e);return t instanceof Array&&(n={},n[e]=t),n||t},u.addListener=function(e,n){if(!s(n))throw new TypeError("listener must be a function");var t,o=this.getListenersAsObject(e),i="object"==typeof n;for(t in o)o.hasOwnProperty(t)&&-1===r(o[t],n)&&o[t].push(i?n:{listener:n,once:!1});return this},u.on=a("addListener"),u.addOnceListener=function(e,n){return this.addListener(e,{listener:n,once:!0})},u.once=a("addOnceListener"),u.defineEvent=function(e){return this.getListeners(e),this},u.defineEvents=function(e){for(var n=0;n<e.length;n+=1)this.defineEvent(e[n]);return this},u.removeListener=function(e,n){var t,o,i=this.getListenersAsObject(e);for(o in i)i.hasOwnProperty(o)&&-1!==(t=r(i[o],n))&&i[o].splice(t,1);return this},u.off=a("removeListener"),u.addListeners=function(e,n){return this.manipulateListeners(!1,e,n)},u.removeListeners=function(e,n){return this.manipulateListeners(!0,e,n)},u.manipulateListeners=function(e,n,t){var o,i,r=e?this.removeListener:this.addListener,a=e?this.removeListeners:this.addListeners;if("object"!=typeof n||n instanceof RegExp)for(o=t.length;o--;)r.call(this,n,t[o]);else for(o in n)n.hasOwnProperty(o)&&(i=n[o])&&("function"==typeof i?r.call(this,o,i):a.call(this,o,i));return this},u.removeEvent=function(e){var n,t=typeof e,o=this._getEvents();if("string"===t)delete o[e];else if(e instanceof RegExp)for(n in o)o.hasOwnProperty(n)&&e.test(n)&&delete o[n];else delete this._events;return this},u.removeAllListeners=a("removeEvent"),u.emitEvent=function(e,n){var t,o,i,r,a=this.getListenersAsObject(e);for(r in a)if(a.hasOwnProperty(r))for(t=a[r].slice(0),i=0;i<t.length;i++)o=t[i],!0===o.once&&this.removeListener(e,o.listener),o.listener.apply(this,n||[])===this._getOnceReturnValue()&&this.removeListener(e,o.listener);return this},u.trigger=a("emitEvent"),u.emit=function(e){var n=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,n)},u.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},u._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},u._getEvents=function(){return this._events||(this._events={})},i.noConflict=function(){return n.EventEmitter=l,i},void 0!==(o=function(){return i}.call(n,t,n,e))&&(e.exports=o)}("undefined"!=typeof window?window:this||{})},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(0),i=function(e){return e&&e.__esModule?e:{default:e}}(o);n.default=function(e,n,t){var o=e.appendChild(document.createElement("div"));(0,i.default)(o,{left:0,width:"calc("+t.sizing.labelWidth+" - 2%)",display:"inline-block","margin-right":"2%",verticalAlign:"top"});var r=o.appendChild(document.createElement("div"));return r.innerHTML=n,(0,i.default)(r,{color:t.colors.textPrimary,display:"inline-block",verticalAlign:"sub","min-height":t.sizing.componentHeight,"line-height":t.sizing.componentHeight}),r},e.exports=n.default},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(0),i=function(e){return e&&e.__esModule?e:{default:e}}(o);n.default=function(e,n,t,o,r){var a=e.appendChild(document.createElement("input"));a.type="text",a.value=n;var s={position:"absolute",backgroundColor:t.colors.componentBackground,paddingLeft:"1%",height:t.sizing.componentHeight,width:o,display:"inline-block",overflow:"hidden",border:"none","font-family":"'Hack', monospace","font-size":"11px",color:t.colors.textSecondary,userSelect:"text",cursor:"text",lineHeight:t.sizing.componentHeight,wordBreak:"break-all","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box"};return r||(s.right=0),(0,i.default)(a,s),a},e.exports=n.default},function(e,n,t){"use strict";function o(e,n,t){var o=e.join(" ");return Object.create(a.prototype,{classNames:{value:Object.freeze(e),configurable:!1,writable:!1,enumerable:!0},unscoped:{value:Object.freeze(n),configurable:!1,writable:!1,enumerable:!0},className:{value:o,configurable:!1,writable:!1,enumerable:!0},selector:{value:e.map(function(e){return t?e:"."+e}).join(", "),configurable:!1,writable:!1,enumerable:!0},toString:{value:function(){return o},configurable:!1,writeable:!1,enumerable:!1}})}function i(e){return e instanceof a}function r(e){return e.reduce(function(e,n){return i(n)&&n.classNames.forEach(function(t,o){e[t]=n.unscoped[o]}),e},{})}function a(){}e.exports={makeComposition:o,isComposition:i,ignoreComposition:r}},function(e,n,t){"use strict";var o=/(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source,i=/(@\S*keyframes\s*)([^{\s]*)/.source,r=/(?!(?:[^*\/]|\*[^\/]|\/[^*])*\*+\/)/.source,a=new RegExp(o+r,"g"),s=new RegExp(i+r,"g");e.exports={classRegex:a,keyframesRegex:s,ignoreComments:r}},function(e,n,t){"use strict";e.exports={light:{name:"Light",colors:{menuBarBackground:"rgb(227, 227, 227)",menuBarText:"rgb(36, 36, 36)",panelBackground:"rgb(227, 227, 227)",componentBackground:"rgb(204, 204, 204)",componentBackgroundHover:"rgb(190, 190, 190)",componentForeground:"rgb(105, 105, 105)",componentActive:"rgb(36, 36, 36)",textPrimary:"rgb(36, 36, 36)",textSecondary:"rgb(87, 87, 87)",textHover:"rgb(204, 204, 204)",textActive:"rgb(204, 204, 204)"}},dark:{name:"Dark",colors:{menuBarBackground:"rgb(35, 35, 35)",menuBarText:"rgb(235, 235, 235)",panelBackground:"rgb(35, 35, 35)",componentBackground:"rgb(54, 54, 54)",componentBackgroundHover:"rgb(76, 76, 76)",componentForeground:"rgb(112, 112, 112)",componentActive:"rgb(202, 202, 202)",textPrimary:"rgb(235, 235, 235)",textSecondary:"rgb(181, 181, 181)",textHover:"rgb(235, 235, 235)",textActive:"rgb(54, 54, 54)"}},yorha:{name:"YoRHa",colors:{menuBarBackground:"#CCC8B1",menuBarText:"#454138",panelBackground:"#CCC8B1",componentBackground:"#BAB5A1",componentBackgroundHover:"#877F6E",componentForeground:"#454138",componentActive:"#978F7E",textPrimary:"#454138",textSecondary:"#454138",textHover:"#CCC8B1",textActive:"#CCC8B1"},font:{fontFamily:"helvetica, sans-serif",fontSize:"14px",fontWeight:"100"}}}},function(e,n,t){!function(t){"use strict";function o(e){return"number"==typeof e&&!isNaN(e)||!!(e=(e||"").toString().trim())&&!isNaN(e)}void 0!==e&&e.exports&&(n=e.exports=o),n.isNumeric=o}()},function(e,n,t){"use strict";e.exports=" css "},function(e,n,t){"use strict";e.exports=t(44)},function(e,n){function t(e,n){if(n=n||{},void 0===e)throw new Error(a);var t=!0===n.prepend?"prepend":"append",s=void 0!==n.container?n.container:document.querySelector("head"),u=i.indexOf(s);-1===u&&(u=i.push(s)-1,r[u]={});var l;return void 0!==r[u]&&void 0!==r[u][t]?l=r[u][t]:(l=r[u][t]=o(),"prepend"===t?s.insertBefore(l,s.childNodes[0]):s.appendChild(l)),65279===e.charCodeAt(0)&&(e=e.substr(1,e.length)),l.styleSheet?l.styleSheet.cssText+=e:l.textContent+=e,l}function o(){var e=document.createElement("style");return e.setAttribute("type","text/css"),e}var i=[],r=[],a="insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).";e.exports=t,e.exports.insertCss=t},function(e,n,t){var o;!function(i){function r(e,n){if(e=e||"",n=n||{},e instanceof r)return e;if(!(this instanceof r))return new r(e,n);var t=a(e);this._originalInput=e,this._r=t.r,this._g=t.g,this._b=t.b,this._a=t.a,this._roundA=D(100*this._a)/100,this._format=n.format||t.format,this._gradientType=n.gradientType,this._r<1&&(this._r=D(this._r)),this._g<1&&(this._g=D(this._g)),this._b<1&&(this._b=D(this._b)),this._ok=t.ok,this._tc_id=I++}function a(e){var n={r:0,g:0,b:0},t=1,o=null,i=null,r=null,a=!1,u=!1;return"string"==typeof e&&(e=V(e)),"object"==typeof e&&(B(e.r)&&B(e.g)&&B(e.b)?(n=s(e.r,e.g,e.b),a=!0,u="%"===String(e.r).substr(-1)?"prgb":"rgb"):B(e.h)&&B(e.s)&&B(e.v)?(o=F(e.s),i=F(e.v),n=f(e.h,o,i),a=!0,u="hsv"):B(e.h)&&B(e.s)&&B(e.l)&&(o=F(e.s),r=F(e.l),n=l(e.h,o,r),a=!0,u="hsl"),e.hasOwnProperty("a")&&(t=e.a)),t=j(t),{ok:a,format:e.format||u,r:q(255,W(n.r,0)),g:q(255,W(n.g,0)),b:q(255,W(n.b,0)),a:t}}function s(e,n,t){return{r:255*C(e,255),g:255*C(n,255),b:255*C(t,255)}}function u(e,n,t){e=C(e,255),n=C(n,255),t=C(t,255);var o,i,r=W(e,n,t),a=q(e,n,t),s=(r+a)/2;if(r==a)o=i=0;else{var u=r-a;switch(i=s>.5?u/(2-r-a):u/(r+a),r){case e:o=(n-t)/u+(n<t?6:0);break;case n:o=(t-e)/u+2;break;case t:o=(e-n)/u+4}o/=6}return{h:o,s:i,l:s}}function l(e,n,t){function o(e,n,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?e+6*(n-e)*t:t<.5?n:t<2/3?e+(n-e)*(2/3-t)*6:e}var i,r,a;if(e=C(e,360),n=C(n,100),t=C(t,100),0===n)i=r=a=t;else{var s=t<.5?t*(1+n):t+n-t*n,u=2*t-s;i=o(u,s,e+1/3),r=o(u,s,e),a=o(u,s,e-1/3)}return{r:255*i,g:255*r,b:255*a}}function c(e,n,t){e=C(e,255),n=C(n,255),t=C(t,255);var o,i,r=W(e,n,t),a=q(e,n,t),s=r,u=r-a;if(i=0===r?0:u/r,r==a)o=0;else{switch(r){case e:o=(n-t)/u+(n<t?6:0);break;case n:o=(t-e)/u+2;break;case t:o=(e-n)/u+4}o/=6}return{h:o,s:i,v:s}}function f(e,n,t){e=6*C(e,360),n=C(n,100),t=C(t,100);var o=i.floor(e),r=e-o,a=t*(1-n),s=t*(1-r*n),u=t*(1-(1-r)*n),l=o%6;return{r:255*[t,s,a,a,u,t][l],g:255*[u,t,t,s,a,a][l],b:255*[a,a,u,t,t,s][l]}}function p(e,n,t,o){var i=[P(D(e).toString(16)),P(D(n).toString(16)),P(D(t).toString(16))];return o&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function h(e,n,t,o,i){var r=[P(D(e).toString(16)),P(D(n).toString(16)),P(D(t).toString(16)),P(T(o))];return i&&r[0].charAt(0)==r[0].charAt(1)&&r[1].charAt(0)==r[1].charAt(1)&&r[2].charAt(0)==r[2].charAt(1)&&r[3].charAt(0)==r[3].charAt(1)?r[0].charAt(0)+r[1].charAt(0)+r[2].charAt(0)+r[3].charAt(0):r.join("")}function d(e,n,t,o){return[P(T(o)),P(D(e).toString(16)),P(D(n).toString(16)),P(D(t).toString(16))].join("")}function g(e,n){n=0===n?0:n||10;var t=r(e).toHsl();return t.s-=n/100,t.s=O(t.s),r(t)}function b(e,n){n=0===n?0:n||10;var t=r(e).toHsl();return t.s+=n/100,t.s=O(t.s),r(t)}function m(e){return r(e).desaturate(100)}function y(e,n){n=0===n?0:n||10;var t=r(e).toHsl();return t.l+=n/100,t.l=O(t.l),r(t)}function v(e,n){n=0===n?0:n||10;var t=r(e).toRgb();return t.r=W(0,q(255,t.r-D(-n/100*255))),t.g=W(0,q(255,t.g-D(-n/100*255))),t.b=W(0,q(255,t.b-D(-n/100*255))),r(t)}function x(e,n){n=0===n?0:n||10;var t=r(e).toHsl();return t.l-=n/100,t.l=O(t.l),r(t)}function w(e,n){var t=r(e).toHsl(),o=(t.h+n)%360;return t.h=o<0?360+o:o,r(t)}function k(e){var n=r(e).toHsl();return n.h=(n.h+180)%360,r(n)}function _(e){var n=r(e).toHsl(),t=n.h;return[r(e),r({h:(t+120)%360,s:n.s,l:n.l}),r({h:(t+240)%360,s:n.s,l:n.l})]}function S(e){var n=r(e).toHsl(),t=n.h;return[r(e),r({h:(t+90)%360,s:n.s,l:n.l}),r({h:(t+180)%360,s:n.s,l:n.l}),r({h:(t+270)%360,s:n.s,l:n.l})]}function z(e){var n=r(e).toHsl(),t=n.h;return[r(e),r({h:(t+72)%360,s:n.s,l:n.l}),r({h:(t+216)%360,s:n.s,l:n.l})]}function E(e,n,t){n=n||6,t=t||30;var o=r(e).toHsl(),i=360/t,a=[r(e)];for(o.h=(o.h-(i*n>>1)+720)%360;--n;)o.h=(o.h+i)%360,a.push(r(o));return a}function M(e,n){n=n||6;for(var t=r(e).toHsv(),o=t.h,i=t.s,a=t.v,s=[],u=1/n;n--;)s.push(r({h:o,s:i,v:a})),a=(a+u)%1;return s}function j(e){return e=parseFloat(e),(isNaN(e)||e<0||e>1)&&(e=1),e}function C(e,n){A(e)&&(e="100%");var t=L(e);return e=q(n,W(0,parseFloat(e))),t&&(e=parseInt(e*n,10)/100),i.abs(e-n)<1e-6?1:e%n/parseFloat(n)}function O(e){return q(1,W(0,e))}function H(e){return parseInt(e,16)}function A(e){return"string"==typeof e&&-1!=e.indexOf(".")&&1===parseFloat(e)}function L(e){return"string"==typeof e&&-1!=e.indexOf("%")}function P(e){return 1==e.length?"0"+e:""+e}function F(e){return e<=1&&(e=100*e+"%"),e}function T(e){return i.round(255*parseFloat(e)).toString(16)}function R(e){return H(e)/255}function B(e){return!!Z.CSS_UNIT.exec(e)}function V(e){e=e.replace(N,"").replace($,"").toLowerCase();var n=!1;if(X[e])e=X[e],n=!0;else if("transparent"==e)return{r:0,g:0,b:0,a:0,format:"name"};var t;return(t=Z.rgb.exec(e))?{r:t[1],g:t[2],b:t[3]}:(t=Z.rgba.exec(e))?{r:t[1],g:t[2],b:t[3],a:t[4]}:(t=Z.hsl.exec(e))?{h:t[1],s:t[2],l:t[3]}:(t=Z.hsla.exec(e))?{h:t[1],s:t[2],l:t[3],a:t[4]}:(t=Z.hsv.exec(e))?{h:t[1],s:t[2],v:t[3]}:(t=Z.hsva.exec(e))?{h:t[1],s:t[2],v:t[3],a:t[4]}:(t=Z.hex8.exec(e))?{r:H(t[1]),g:H(t[2]),b:H(t[3]),a:R(t[4]),format:n?"name":"hex8"}:(t=Z.hex6.exec(e))?{r:H(t[1]),g:H(t[2]),b:H(t[3]),format:n?"name":"hex"}:(t=Z.hex4.exec(e))?{r:H(t[1]+""+t[1]),g:H(t[2]+""+t[2]),b:H(t[3]+""+t[3]),a:R(t[4]+""+t[4]),format:n?"name":"hex8"}:!!(t=Z.hex3.exec(e))&&{r:H(t[1]+""+t[1]),g:H(t[2]+""+t[2]),b:H(t[3]+""+t[3]),format:n?"name":"hex"}}function U(e){var n,t;return e=e||{level:"AA",size:"small"},n=(e.level||"AA").toUpperCase(),t=(e.size||"small").toLowerCase(),"AA"!==n&&"AAA"!==n&&(n="AA"),"small"!==t&&"large"!==t&&(t="small"),{level:n,size:t}}var N=/^\s+/,$=/\s+$/,I=0,D=i.round,q=i.min,W=i.max,G=i.random;r.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(299*e.r+587*e.g+114*e.b)/1e3},getLuminance:function(){var e,n,t,o,r,a,s=this.toRgb();return e=s.r/255,n=s.g/255,t=s.b/255,o=e<=.03928?e/12.92:i.pow((e+.055)/1.055,2.4),r=n<=.03928?n/12.92:i.pow((n+.055)/1.055,2.4),a=t<=.03928?t/12.92:i.pow((t+.055)/1.055,2.4),.2126*o+.7152*r+.0722*a},setAlpha:function(e){return this._a=j(e),this._roundA=D(100*this._a)/100,this},toHsv:function(){var e=c(this._r,this._g,this._b);return{h:360*e.h,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=c(this._r,this._g,this._b),n=D(360*e.h),t=D(100*e.s),o=D(100*e.v);return 1==this._a?"hsv("+n+", "+t+"%, "+o+"%)":"hsva("+n+", "+t+"%, "+o+"%, "+this._roundA+")"},toHsl:function(){var e=u(this._r,this._g,this._b);return{h:360*e.h,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=u(this._r,this._g,this._b),n=D(360*e.h),t=D(100*e.s),o=D(100*e.l);return 1==this._a?"hsl("+n+", "+t+"%, "+o+"%)":"hsla("+n+", "+t+"%, "+o+"%, "+this._roundA+")"},toHex:function(e){return p(this._r,this._g,this._b,e)},toHexString:function(e){return"#"+this.toHex(e)},toHex8:function(e){return h(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return"#"+this.toHex8(e)},toRgb:function(){return{r:D(this._r),g:D(this._g),b:D(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+D(this._r)+", "+D(this._g)+", "+D(this._b)+")":"rgba("+D(this._r)+", "+D(this._g)+", "+D(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:D(100*C(this._r,255))+"%",g:D(100*C(this._g,255))+"%",b:D(100*C(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+D(100*C(this._r,255))+"%, "+D(100*C(this._g,255))+"%, "+D(100*C(this._b,255))+"%)":"rgba("+D(100*C(this._r,255))+"%, "+D(100*C(this._g,255))+"%, "+D(100*C(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":!(this._a<1)&&(Y[p(this._r,this._g,this._b,!0)]||!1)},toFilter:function(e){var n="#"+d(this._r,this._g,this._b,this._a),t=n,o=this._gradientType?"GradientType = 1, ":"";if(e){var i=r(e);t="#"+d(i._r,i._g,i._b,i._a)}return"progid:DXImageTransform.Microsoft.gradient("+o+"startColorstr="+n+",endColorstr="+t+")"},toString:function(e){var n=!!e;e=e||this._format;var t=!1,o=this._a<1&&this._a>=0;return n||!o||"hex"!==e&&"hex6"!==e&&"hex3"!==e&&"hex4"!==e&&"hex8"!==e&&"name"!==e?("rgb"===e&&(t=this.toRgbString()),"prgb"===e&&(t=this.toPercentageRgbString()),"hex"!==e&&"hex6"!==e||(t=this.toHexString()),"hex3"===e&&(t=this.toHexString(!0)),"hex4"===e&&(t=this.toHex8String(!0)),"hex8"===e&&(t=this.toHex8String()),"name"===e&&(t=this.toName()),"hsl"===e&&(t=this.toHslString()),"hsv"===e&&(t=this.toHsvString()),t||this.toHexString()):"name"===e&&0===this._a?this.toName():this.toRgbString()},clone:function(){return r(this.toString())},_applyModification:function(e,n){var t=e.apply(null,[this].concat([].slice.call(n)));return this._r=t._r,this._g=t._g,this._b=t._b,this.setAlpha(t._a),this},lighten:function(){return this._applyModification(y,arguments)},brighten:function(){return this._applyModification(v,arguments)},darken:function(){return this._applyModification(x,arguments)},desaturate:function(){return this._applyModification(g,arguments)},saturate:function(){return this._applyModification(b,arguments)},greyscale:function(){return this._applyModification(m,arguments)},spin:function(){return this._applyModification(w,arguments)},_applyCombination:function(e,n){return e.apply(null,[this].concat([].slice.call(n)))},analogous:function(){return this._applyCombination(E,arguments)},complement:function(){return this._applyCombination(k,arguments)},monochromatic:function(){return this._applyCombination(M,arguments)},splitcomplement:function(){return this._applyCombination(z,arguments)},triad:function(){return this._applyCombination(_,arguments)},tetrad:function(){return this._applyCombination(S,arguments)}},r.fromRatio=function(e,n){if("object"==typeof e){var t={};for(var o in e)e.hasOwnProperty(o)&&(t[o]="a"===o?e[o]:F(e[o]));e=t}return r(e,n)},r.equals=function(e,n){return!(!e||!n)&&r(e).toRgbString()==r(n).toRgbString()},r.random=function(){return r.fromRatio({r:G(),g:G(),b:G()})},r.mix=function(e,n,t){t=0===t?0:t||50;var o=r(e).toRgb(),i=r(n).toRgb(),a=t/100;return r({r:(i.r-o.r)*a+o.r,g:(i.g-o.g)*a+o.g,b:(i.b-o.b)*a+o.b,a:(i.a-o.a)*a+o.a})},r.readability=function(e,n){var t=r(e),o=r(n);return(i.max(t.getLuminance(),o.getLuminance())+.05)/(i.min(t.getLuminance(),o.getLuminance())+.05)},r.isReadable=function(e,n,t){var o,i,a=r.readability(e,n);switch(i=!1,o=U(t),o.level+o.size){case"AAsmall":case"AAAlarge":i=a>=4.5;break;case"AAlarge":i=a>=3;break;case"AAAsmall":i=a>=7}return i},r.mostReadable=function(e,n,t){var o,i,a,s,u=null,l=0;t=t||{},i=t.includeFallbackColors,a=t.level,s=t.size;for(var c=0;c<n.length;c++)(o=r.readability(e,n[c]))>l&&(l=o,u=r(n[c]));return r.isReadable(e,u,{level:a,size:s})||!i?u:(t.includeFallbackColors=!1,r.mostReadable(e,["#fff","#000"],t))};var X=r.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},Y=r.hexNames=function(e){var n={};for(var t in e)e.hasOwnProperty(t)&&(n[e[t]]=t);return n}(X),Z=function(){var e="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",n="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?",t="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?";return{CSS_UNIT:new RegExp(e),rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+t),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+t),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+t),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();void 0!==e&&e.exports?e.exports=r:void 0!==(o=function(){return r}.call(n,t,n,e))&&(e.exports=o)}(Math)},function(e,n){/*!
* screenfull
* v5.0.0 - 2019-09-09
* (c) Sindre Sorhus; MIT License
*/
!function(){"use strict";var n="undefined"!=typeof window&&void 0!==window.document?window.document:{},t=void 0!==e&&e.exports,o=function(){for(var e,t=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],o=0,i=t.length,r={};o<i;o++)if((e=t[o])&&e[1]in n){for(o=0;o<e.length;o++)r[t[0][o]]=e[o];return r}return!1}(),i={change:o.fullscreenchange,error:o.fullscreenerror},r={request:function(e){return new Promise(function(t,i){var r=function(){this.off("change",r),t()}.bind(this);this.on("change",r),e=e||n.documentElement,Promise.resolve(e[o.requestFullscreen]()).catch(i)}.bind(this))},exit:function(){return new Promise(function(e,t){if(!this.isFullscreen)return void e();var i=function(){this.off("change",i),e()}.bind(this);this.on("change",i),Promise.resolve(n[o.exitFullscreen]()).catch(t)}.bind(this))},toggle:function(e){return this.isFullscreen?this.exit():this.request(e)},onchange:function(e){this.on("change",e)},onerror:function(e){this.on("error",e)},on:function(e,t){var o=i[e];o&&n.addEventListener(o,t,!1)},off:function(e,t){var o=i[e];o&&n.removeEventListener(o,t,!1)},raw:o};if(!o)return void(t?e.exports={isEnabled:!1}:window.screenfull={isEnabled:!1});Object.defineProperties(r,{isFullscreen:{get:function(){return Boolean(n[o.fullscreenElement])}},element:{enumerable:!0,get:function(){return n[o.fullscreenElement]}},isEnabled:{enumerable:!0,get:function(){return Boolean(n[o.fullscreenEnabled])}}}),t?e.exports=r:window.screenfull=r}()},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(17),i=function(e){return e&&e.__esModule?e:{default:e}}(o);n.default=i.default,e.exports=n.default},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(0),s=o(a),u=t(23),l=o(u),c=t(9),f=o(c),p=t(1),h=t(24),d=t(72),g=t(74),b=t(77),m=t(15),y=o(m),v=t(79),x=function(){function e(n){i(this,e),this.opts=n,this.hasRoot=void 0!==n.root,n.width=n.width||300,n.root=n.root||document.body,n.align=n.align||"left",n.opacity=n.opacity||1,n.barMode=n.barMode||"offset",n.panelMode=n.panelMode||"inner",n.pollRateMS=n.pollRateMS||100,n.open=n.open||!1;var t=n.theme;void 0===n.theme&&(t=f.default.dark),(0,l.default)(n.theme)&&(void 0===f.default[n.theme]?(console.error("There is no theme preset with the name '"+n.theme+"'! Defaulting to dark theme."),t=f.default.dark):t=f.default[n.theme]),p.theme.Set(t),this._ConstructElements(),this._LoadStyles(),this.componentManager=new h.ComponentManager,this.loadedComponents=[],this._UpdateComponents()}return r(e,[{key:"_LoadStyles",value:function(){var e=function(e){var n=document.createElement("style");n.setAttribute("type","text/css"),n.setAttribute("rel","stylesheet"),n.setAttribute("href",e),document.getElementsByTagName("head")[0].appendChild(n)};e("//cdn.jsdelivr.net/font-hack/2.019/css/hack.min.css"),p.theme.font?(p.theme.font.fontURL&&e(p.theme.font.fontURL),p.theme.font.fontFamily&&(0,s.default)(this.container,"font-family",p.theme.font.fontFamily),p.theme.font.fontSize&&(0,s.default)(this.container,"font-size",p.theme.font.fontSize),p.theme.font.fontWeight&&(0,s.default)(this.container,"font-weight",p.theme.font.fontWeight)):(0,s.default)(this.container,"font-family","'Hack', monospace")}},{key:"_ConstructElements",value:function(){var e=this;this.container=document.createElement("div"),this.container.classList.add(v["guify-container"]);var n={};"overlay"!=this.opts.barMode&&"above"!=this.opts.barMode&&"none"!=this.opts.barMode||(n.position="absolute"),this.hasRoot&&"above"==this.opts.barMode&&(n.top="-"+p.theme.sizing.menuBarHeight),(0,s.default)(this.container,n),this.opts.root.insertBefore(this.container,this.opts.root.childNodes[0]),"none"!==this.opts.barMode&&(this.bar=new d.MenuBar(this.container,this.opts),this.bar.addListener("ontogglepanel",function(){e.panel.ToggleVisible()}),this.bar.addListener("onfullscreenrequested",function(){e.ToggleFullscreen()})),this.panel=new g.Panel(this.container,this.opts),"none"===this.opts.barMode||!0===this.opts.open?this.panel.SetVisible(!0):this.panel.SetVisible(!1),this.toaster=new b.ToastArea(this.container,this.opts)}},{key:"_UpdateComponents",value:function(){var e=this;this.loadedComponents.forEach(function(e){e.binding&&e.binding.object[e.binding.property]!=e.oldValue&&(e.SetValue(e.binding.object[e.binding.property]),e.oldValue=e.binding.object[e.binding.property])}),setTimeout(function(){window.requestAnimationFrame(function(){e._UpdateComponents()})},this.opts.pollRateMS)}},{key:"Register",value:function(e){var n=this,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!Array.isArray(e)){var o=Object.assign(e,t);return this._Register(o)}e.forEach(function(e){var o=Object.assign(e,t);n._Register(o)})}},{key:"Remove",value:function(e){e.Remove(),this.loadedComponents=this.loadedComponents.filter(function(n){return n!==e})}},{key:"_Register",value:function(e){if(e.object&&e.property&&void 0===e.object[e.property])throw new Error("Object "+e.object+" has no property '"+e.property+"'");e.object&&e.property&&(e.initial=e.object[e.property]);var n=this.panel.panel;if(e.folder){var t=this.loadedComponents.find(function(n){return"folder"===n.opts.type&&n.opts.label===e.folder});if(!t)throw new Error("No folder exists with the name "+e.folder);n=t.folderContainer}var o=this.componentManager.Create(n,e);return e.object&&e.property&&(o.binding={object:e.object,property:e.property}),o.on&&(o.on("initialized",function(n){e.onInitialize&&e.onInitialize(n)}),o.on("input",function(n){e.object&&e.property&&(e.object[e.property]=n),e.onChange&&e.onChange(n)})),this.loadedComponents.push(o),o}},{key:"Toast",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5e3,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;this.toaster.CreateToast(e,n,t)}},{key:"ToggleFullscreen",value:function(){y.default.isFullscreen?y.default.exit():(console.log("Request fullscreen"),y.default.request(this.opts.root))}}]),e}();n.default=x,e.exports=n.default},function(e,n){var t=null,o=["Webkit","Moz","O","ms"];e.exports=function(e){t||(t=document.createElement("div"));var n=t.style;if(e in n)return e;for(var i=e.charAt(0).toUpperCase()+e.slice(1),r=o.length;r>=0;r--){var a=o[r]+i;if(a in n)return a}return!1}},function(e,n,t){function o(e){return i(e).replace(/\s(\w)/g,function(e,n){return n.toUpperCase()})}var i=t(20);e.exports=o},function(e,n,t){function o(e){return i(e).replace(/[\W_]+(.|$)/g,function(e,n){return n?" "+n:""}).trim()}var i=t(21);e.exports=o},function(e,n){function t(e){return r.test(e)?e.toLowerCase():a.test(e)?(o(e)||e).toLowerCase():s.test(e)?i(e).toLowerCase():e.toLowerCase()}function o(e){return e.replace(u,function(e,n){return n?" "+n:""})}function i(e){return e.replace(l,function(e,n,t){return n+" "+t.toLowerCase().split("").join(" ")})}e.exports=t;var r=/\s/,a=/(_|-|\.|:)/,s=/([a-z][A-Z]|[A-Z][a-z])/,u=/[\W_]+(.|$)/g,l=/(.)([A-Z]+)/g},function(e,n){var t={animationIterationCount:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridColumn:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,stopOpacity:!0,strokeDashoffset:!0,strokeOpacity:!0,strokeWidth:!0};e.exports=function(e,n){return"number"!=typeof n||t[e]?n:n+"px"}},function(e,n,t){"use strict";var o=String.prototype.valueOf,i=function(e){try{return o.call(e),!0}catch(e){return!1}},r=Object.prototype.toString,a="function"==typeof Symbol&&"symbol"==typeof Symbol.toStringTag;e.exports=function(e){return"string"==typeof e||"object"==typeof e&&(a?i(e):"[object String]"===r.call(e))}},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.ComponentManager=void 0;var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(25),a=function(e){return e&&e.__esModule?e:{default:e}}(r),s=t(1);n.ComponentManager=function(){function e(){o(this,e),this.uuid=(0,a.default)(),this.components={title:t(28),range:t(29),button:t(46),checkbox:t(48),select:t(50),text:t(52),color:t(53),folder:t(65),file:t(67),display:t(69),interval:t(70)}}return i(e,[{key:"Create",value:function(e,n){if(void 0===this.components[n.type])throw new Error("No component type named '"+n.type+"' exists.");var t=new this.components[n.type](e,n,s.theme,this.uuid);return Object.assign(t,{Remove:function(){this.container.parentNode.removeChild(this.container)}}),t}}]),e}()},function(e,n,t){function o(e,n,t){var o=n&&t||0;"string"==typeof e&&(n="binary"===e?new Array(16):null,e=null),e=e||{};var a=e.random||(e.rng||i)();if(a[6]=15&a[6]|64,a[8]=63&a[8]|128,n)for(var s=0;s<16;++s)n[o+s]=a[s];return n||r(a)}var i=t(26),r=t(27);e.exports=o},function(e,n){var t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(t){var o=new Uint8Array(16);e.exports=function(){return t(o),o}}else{var i=new Array(16);e.exports=function(){for(var e,n=0;n<16;n++)0==(3&n)&&(e=4294967296*Math.random()),i[n]=e>>>((3&n)<<3)&255;return i}}},function(e,n){function t(e,n){var t=n||0,i=o;return[i[e[t++]],i[e[t++]],i[e[t++]],i[e[t++]],"-",i[e[t++]],i[e[t++]],"-",i[e[t++]],i[e[t++]],"-",i[e[t++]],i[e[t++]],"-",i[e[t++]],i[e[t++]],i[e[t++]],i[e[t++]],i[e[t++]],i[e[t++]]].join("")}for(var o=[],i=0;i<256;++i)o[i]=(i+256).toString(16).substr(1);e.exports=t},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=t(0),r=function(e){return e&&e.__esModule?e:{default:e}}(i),a=function e(n,i,a){o(this,e),this.opts=i,this.container=t(2)(n,i.label,a),(0,r.default)(this.container,{});var s=this.container.appendChild(document.createElement("div"));(0,r.default)(s,{"box-sizing":"border-box",width:"100%",display:"inline-block",height:a.sizing.componentHeight,verticalAlign:"top"});var u=s.appendChild(document.createElement("div"));u.innerHTML="&#9632; "+i.label+" &#9632;",(0,r.default)(u,{display:"inline-block",verticalAlign:"sub",height:a.sizing.componentHeight,"line-height":a.sizing.componentHeight,"padding-left":"5px","padding-right":"5px","background-color":a.colors.textPrimary,color:a.colors.panelBackground})};n.default=a,e.exports=n.default},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(4),l=o(u),c=t(0),f=o(c),p=t(10),h=o(p),d=t(30),g=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));if(u.opts=o,u.container=t(2)(e,o.label,a),t(5)(u.container,o.label,a),o.step&&o.steps)throw new Error("Cannot specify both step and steps. Got step = "+o.step+", steps = ",o.steps);if(u.input=u.container.appendChild(document.createElement("input")),u.input.type="range",u.input.className=d["guify-range"],o.label&&u.input.setAttribute("aria-label",o.label+" input"),"log"===o.scale){if(o.max=(0,h.default)(o.max)?o.max:100,o.min=(0,h.default)(o.min)?o.min:.1,o.min*o.max<=0)throw new Error("Log range min/max must have the same sign and not equal zero. Got min = "+o.min+", max = "+o.max);if(u.logmin=o.min,u.logmax=o.max,u.logsign=o.min>0?1:-1,u.logmin=Math.abs(u.logmin),u.logmax=Math.abs(u.logmax),o.min=0,o.max=100,(0,h.default)(o.step))throw new Error("Log may only use steps (integer number of steps), not a step value. Got step ="+o.step);if(o.step=1,o.initial=u.InverseScaleValue((0,h.default)(o.initial)?o.initial:scaleValue(.5*(o.min+o.max))),o.initial*u.InverseScaleValue(o.max)<=0)throw new Error("Log range initial value must have the same sign as min/max and must not equal zero. Got initial value = "+o.initial)}else o.max=(0,h.default)(o.max)?o.max:100,o.min=(0,h.default)(o.min)?o.min:0,o.step=(0,h.default)(o.step)?o.step:.01,o.initial=(0,h.default)(o.initial)?o.initial:.5*(o.min+o.max);(0,h.default)(o.steps)&&(o.step=(0,h.default)(o.steps)?(o.max-o.min)/o.steps:o.step);var l=Math.round((o.initial-o.min)/o.step);return o.initial=o.min+o.step*l,u.input.min=o.min,u.input.max=o.max,u.input.step=o.step,u.input.value=o.initial,(0,f.default)(u.input,{width:"calc(100% - "+a.sizing.labelWidth+" - 16% - 0.5em)"}),u.valueComponent=t(6)(u.container,u.ScaleValue(o.initial),a,"16%"),o.label&&u.valueComponent.setAttribute("aria-label",o.label+" value"),setTimeout(function(){u.emit("initialized",parseFloat(u.input.value))}),u.userIsModifying=!1,u.input.addEventListener("focus",function(){u.focused=!0}),u.input.addEventListener("blur",function(){u.focused=!1}),u.input.addEventListener("mouseup",function(){u.input.blur()}),u.input.oninput=function(e){var n=u.ScaleValue(parseFloat(e.target.value));u.valueComponent.value=u.FormatNumber(n),u.lastValue=n,u.emit("input",n)},u.valueComponent.onchange=function(){var e=u.valueComponent.value;if(Number(parseFloat(e))==e){var n=parseFloat(e);n=Math.min(Math.max(n,o.min),o.max),n=Math.ceil((n-o.min)/o.step)*o.step+o.min,u.valueComponent.value=n,u.emit("input",n)}else u.valueComponent.value=u.lastValue},u}return a(n,e),s(n,[{key:"ScaleValue",value:function(e){return"log"===this.opts.scale?this.logsign*Math.exp(Math.log(this.logmin)+(Math.log(this.logmax)-Math.log(this.logmin))*e/100):e}},{key:"InverseScaleValue",value:function(e){return"log"===this.opts.scale?100*(Math.log(e*this.logsign)-Math.log(this.logmin))/(Math.log(this.logmax)-Math.log(this.logmin)):e}},{key:"SetValue",value:function(e){!0!==this.focused&&(this.valueComponent.value=this.FormatNumber(e),this.input.value=this.InverseScaleValue(e),this.lastValue=this.input.value)}},{key:"GetValue",value:function(){return this.input.value}},{key:"FormatNumber",value:function(e){return e.toFixed(3).replace(/\.?0*$/,"")}}]),n}(l.default);n.default=g,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\ninput[type=range].guify-range {\n    -webkit-appearance: none;\n    width: 100%;\n    height: ",";\n    margin: 0px 0;\n    padding: 0;\n    display: inline-block;\n}\n\n/* Remove outlines since we'll be adding our own */\ninput[type=range].guify-range:focus {\n    outline: none;\n}\ninput[type=range].guify-range::-moz-focus-outer {\n    border: 0;\n}\n\n/* Webkit */\ninput[type=range].guify-range::-webkit-slider-runnable-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: ",";\n}\ninput[type=range].guify-range::-webkit-slider-thumb {\n    height: ",";\n    width: 10px;\n    background: ",";\n    cursor: ew-resize;\n    -webkit-appearance: none;\n    margin-top: 0px;\n}\ninput[type=range].guify-range:focus::-webkit-slider-runnable-track {\n    background: ",";\n    outline: none;\n}\n\n/* Gecko */\ninput[type=range].guify-range::-moz-range-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: ",";\n}\ninput[type=range].guify-range:focus::-moz-range-track {\n    background: ",";\n}\ninput[type=range].guify-range::-moz-range-thumb {\n    height: ",";\n    width: 10px;\n    background: ",";\n    cursor: ew-resize;\n    border: none;\n    border-radius: 0;\n}\n\n/* IE */\ninput[type=range].guify-range::-ms-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: transparent;\n    border-color: transparent;\n    color: transparent;\n}\ninput[type=range].guify-range::-ms-fill-lower {\n    background: ",";\n}\ninput[type=range].guify-range::-ms-fill-upper {\n    background: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-lower {\n    background: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-upper {\n    background: ",";\n}\ninput[type=range].guify-range::-ms-thumb {\n    width: 10px;\n    border-radius: 0px;\n    background: ",";\n    cursor: ew-resize;\n    height: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-lower {\n    background: ",";\n    outline: none;\n}\ninput[type=range].guify-range:focus::-ms-fill-upper {\n    background: ",";\n    outline: none;\n}\n\n"],["\n\ninput[type=range].guify-range {\n    -webkit-appearance: none;\n    width: 100%;\n    height: ",";\n    margin: 0px 0;\n    padding: 0;\n    display: inline-block;\n}\n\n/* Remove outlines since we'll be adding our own */\ninput[type=range].guify-range:focus {\n    outline: none;\n}\ninput[type=range].guify-range::-moz-focus-outer {\n    border: 0;\n}\n\n/* Webkit */\ninput[type=range].guify-range::-webkit-slider-runnable-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: ",";\n}\ninput[type=range].guify-range::-webkit-slider-thumb {\n    height: ",";\n    width: 10px;\n    background: ",";\n    cursor: ew-resize;\n    -webkit-appearance: none;\n    margin-top: 0px;\n}\ninput[type=range].guify-range:focus::-webkit-slider-runnable-track {\n    background: ",";\n    outline: none;\n}\n\n/* Gecko */\ninput[type=range].guify-range::-moz-range-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: ",";\n}\ninput[type=range].guify-range:focus::-moz-range-track {\n    background: ",";\n}\ninput[type=range].guify-range::-moz-range-thumb {\n    height: ",";\n    width: 10px;\n    background: ",";\n    cursor: ew-resize;\n    border: none;\n    border-radius: 0;\n}\n\n/* IE */\ninput[type=range].guify-range::-ms-track {\n    width: 100%;\n    height: ",";\n    cursor: ew-resize;\n    background: transparent;\n    border-color: transparent;\n    color: transparent;\n}\ninput[type=range].guify-range::-ms-fill-lower {\n    background: ",";\n}\ninput[type=range].guify-range::-ms-fill-upper {\n    background: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-lower {\n    background: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-upper {\n    background: ",";\n}\ninput[type=range].guify-range::-ms-thumb {\n    width: 10px;\n    border-radius: 0px;\n    background: ",";\n    cursor: ew-resize;\n    height: ",";\n}\ninput[type=range].guify-range:focus::-ms-fill-lower {\n    background: ",";\n    outline: none;\n}\ninput[type=range].guify-range:focus::-ms-fill-upper {\n    background: ",";\n    outline: none;\n}\n\n"]),i=t(1),r=t(3),a=i.theme.colors.componentBackground,s=i.theme.colors.componentForeground,u=i.theme.colors.componentActive;e.exports=r(o,i.theme.sizing.componentHeight,i.theme.sizing.componentHeight,a,i.theme.sizing.componentHeight,s,u,i.theme.sizing.componentHeight,a,u,i.theme.sizing.componentHeight,s,i.theme.sizing.componentHeight,a,a,u,u,s,i.theme.sizing.componentHeight,u,u)},function(e,n,t){"use strict";(function(n){function o(){var e=Array.prototype.slice.call(arguments),t=i.apply(null,e);return n.document&&r(i.getCss(t)),t}var i=t(33),r=t(13);e.exports=o}).call(n,t(32))},function(e,n){var t;t=function(){return this}();try{t=t||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(t=window)}e.exports=t},function(e,n,t){"use strict";var o=t(34);e.exports=o(),e.exports.csjs=o,e.exports.noScope=o({noscope:!0}),e.exports.getCss=t(12)},function(e,n,t){"use strict";e.exports=t(35)},function(e,n,t){"use strict";function o(e){return u(e)?e.selector:e}function i(e,n){return e.map(function(e,t){return t!==n.length?e+n[t]:e}).join("")}function r(e,n){return Object.keys(e).reduce(function(t,o){return n[o]||(t[o]=e[o]),t},{})}var a=t(36),s=t(7),u=s.isComposition,l=s.ignoreComposition,c=t(37),f=t(38),p=t(11),h=t(43);e.exports=function(e){e=void 0===e?{}:e;var n=void 0!==e.noscope&&e.noscope;return function(e,t){for(var t=Array(arguments.length-1),s=1;s<arguments.length;s++)t[s-1]=arguments[s];var u=i(e,t.map(o)),d=l(t),g=n?h(u):f(u,d),b=a(g.css),m=r(g.classes,d),y=r(g.keyframes,d),v=b.compositions,x=c(m,y,v);return Object.defineProperty(x,p,{enumerable:!1,configurable:!1,writeable:!1,value:b.css})}}},function(e,n,t){"use strict";function o(e){return e.split(",").map(i)}function i(e){var n=e.trim();return"."===n[0]?n.substr(1):n}var r=(t(7).makeComposition,/\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g);e.exports=function(e){function n(e,n){var t=i(n[1]),r=n[3],a=n[4],s=n.index+n[1].length+n[2].length,u=r.length+a.length;return e.css=e.css.slice(0,s)+" "+e.css.slice(s+u+1),o(a).forEach(function(n){e.compositions[t]||(e.compositions[t]={}),e.compositions[n]||(e.compositions[n]={}),e.compositions[t][n]=e.compositions[n]}),e}for(var t,a=[];t=r.exec(e);)a.unshift(t);return a.reduce(n,{css:e,compositions:{}})}},function(e,n,t){"use strict";function o(e){function n(e){return Object.keys(e).forEach(function(i){t[i]||(t[i]=!0,o.push(i),n(e[i]))})}var t={},o=[];return n(e),o}var i=t(7).makeComposition;e.exports=function(e,n,t){var r=Object.keys(n).reduce(function(e,t){var o=n[t];return e[o]=i([t],[o],!0),e},{});return Object.keys(e).reduce(function(n,r){var a=e[r],s=t[r],u=s?o(s):[],l=[r].concat(u),c=l.map(function(n){return e[n]?e[n]:n});return n[a]=i(l,c),n},r)}},function(e,n,t){"use strict";function o(e,n){function t(e,t){function i(i,r,a){var s=n[a]?a:o(a);return e[t][s]=a,r+s}var r=a[t];return{css:e.css.replace(r,i),keyframes:e.keyframes,classes:e.classes}}var o=i(e),a={classes:s,keyframes:u},l=Object.keys(a).reduce(t,{css:e,keyframes:{},classes:{}});return r(l)}var i=t(39),r=t(42),a=t(8),s=a.classRegex,u=a.keyframesRegex;e.exports=o},function(e,n,t){"use strict";var o=t(40),i=t(41);e.exports=function(e){var n=o(i(e));return function(e){return e+"_"+n}}},function(e,n,t){"use strict";e.exports=function(e){if(0===e)return"0";for(var n="";e>0;)n="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[e%62]+n,e=Math.floor(e/62);return n}},function(e,n,t){"use strict";e.exports=function(e){for(var n=5381,t=e.length;t;)n=33*n^e.charCodeAt(--t);return n>>>0}},function(e,n,t){function o(e){var n=Object.keys(e.keyframes).reduce(function(n,t){return n[e.keyframes[t]]=t,n},{}),t=Object.keys(n);if(t.length){var o="((?:animation|animation-name)\\s*:[^};]*)("+t.join("|")+")([;\\s])"+i,r=new RegExp(o,"g");return{css:e.css.replace(r,function(e,t,o,i){return t+n[o]+i}),keyframes:e.keyframes,classes:e.classes}}return e}var i=t(8).ignoreComments;e.exports=o},function(e,n,t){"use strict";function o(e){return{css:e,keyframes:i(e,s),classes:i(e,a)}}function i(e,n){for(var t,o={};null!==(t=n.exec(e));){var i=t[2];o[i]=i}return o}var r=t(8),a=r.classRegex,s=r.keyframesRegex;e.exports=o},function(e,n,t){"use strict";var o=t(11);e.exports=function(e){return e[o]}},function(e,n,t){"use strict";e.exports=t(12)},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=t(4),u=o(s),l=t(0),c=(o(l),t(47)),f=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));u.opts=o,u.container=t(2)(e,o.label,a),t(5)(u.container,"",a);var l=u.container.appendChild(document.createElement("button"));return l.className=c["guify-button"],l.textContent=o.label,l.addEventListener("click",o.action),l.addEventListener("mouseup",function(){l.blur()}),u}return a(n,e),n}(u.default);n.default=f,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-button {\n    box-sizing: border-box !important;\n    color: ",";\n    background-color: ",";\n\n    position: absolute;\n    text-align: center;\n    height: ",";\n    line-height: ",";\n    padding-top: 0px;\n    padding-bottom: 0px;\n    width: calc(100% - ",");\n    border: none;\n    cursor: pointer;\n    right: 0;\n    font-family: inherit;\n}\n\n\n.guify-button:focus {\n    outline:none;\n}\n.guify-button::-moz-focus-inner {\n    border:0;\n}\n\n.guify-button:hover,\n.guify-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-button:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n"],["\n\n.guify-button {\n    box-sizing: border-box !important;\n    color: ",";\n    background-color: ",";\n\n    position: absolute;\n    text-align: center;\n    height: ",";\n    line-height: ",";\n    padding-top: 0px;\n    padding-bottom: 0px;\n    width: calc(100% - ",");\n    border: none;\n    cursor: pointer;\n    right: 0;\n    font-family: inherit;\n}\n\n\n.guify-button:focus {\n    outline:none;\n}\n.guify-button::-moz-focus-inner {\n    border:0;\n}\n\n.guify-button:hover,\n.guify-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-button:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.textSecondary,i.theme.colors.componentBackground,i.theme.sizing.componentHeight,i.theme.sizing.componentHeight,i.theme.sizing.labelWidth,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.colors.textActive,i.theme.colors.componentActive)},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(4),l=o(u),c=t(0),f=(o(c),t(49)),p=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return u.opts=o,u.container=t(2)(e,o.label,a),t(5)(u.container,o.label,a),u.input=u.container.appendChild(document.createElement("input")),u.input.id="checkbox-"+o.label+s,u.input.type="checkbox",u.input.checked=o.initial,u.input.className=f["guify-checkbox"],o.label&&u.input.setAttribute("aria-label",o.label),u.container.appendChild(document.createElement("label")).htmlFor=u.input.id,setTimeout(function(){u.emit("initialized",u.input.checked)}),u.input.onchange=function(e){u.emit("input",e.target.checked)},u}return a(n,e),s(n,[{key:"SetValue",value:function(e){this.input.checked=e}},{key:"GetValue",value:function(){return this.input.checked}}]),n}(l.default);n.default=p,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(['\n\ninput[type=checkbox].guify-checkbox {\n    opacity: 0;\n    appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    margin: 0;\n    border-radius: 0;\n    cursor: pointer;\n}\n\ninput[type=checkbox].guify-checkbox + label {\n    margin: 0;\n}\n\ninput[type=checkbox].guify-checkbox + label:before {\n    content: "";\n    display: inline-block;\n    width: ',";\n    height: ",";\n    padding: 0;\n    margin: 0;\n    vertical-align: middle;\n    background-color: ",";\n    border-radius: 0px;\n    cursor: pointer;\n    box-sizing: content-box;\n    -moz-box-sizing: content-box;\n    -webkit-box-sizing: content-box;\n\n}\n\n/* Hover style */\ninput[type=checkbox].guify-checkbox:hover + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid 4px ",";\n}\n\n/* Checked style */\ninput[type=checkbox]:checked.guify-checkbox + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid "," ",";\n}\n\n/* Focused and checked */\ninput[type=checkbox]:checked.guify-checkbox:focus + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid "," ",";\n}\n\n/* Focus and unchecked */\ninput[type=checkbox].guify-checkbox:focus + label:before {\n    background-color: ",";\n}\n\n"],['\n\ninput[type=checkbox].guify-checkbox {\n    opacity: 0;\n    appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    margin: 0;\n    border-radius: 0;\n    cursor: pointer;\n}\n\ninput[type=checkbox].guify-checkbox + label {\n    margin: 0;\n}\n\ninput[type=checkbox].guify-checkbox + label:before {\n    content: "";\n    display: inline-block;\n    width: ',";\n    height: ",";\n    padding: 0;\n    margin: 0;\n    vertical-align: middle;\n    background-color: ",";\n    border-radius: 0px;\n    cursor: pointer;\n    box-sizing: content-box;\n    -moz-box-sizing: content-box;\n    -webkit-box-sizing: content-box;\n\n}\n\n/* Hover style */\ninput[type=checkbox].guify-checkbox:hover + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid 4px ",";\n}\n\n/* Checked style */\ninput[type=checkbox]:checked.guify-checkbox + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid "," ",";\n}\n\n/* Focused and checked */\ninput[type=checkbox]:checked.guify-checkbox:focus + label:before {\n    width: calc("," - ("," * 2));\n    height: calc("," - ("," * 2));\n    background-color: ",";\n    border: solid "," ",";\n}\n\n/* Focus and unchecked */\ninput[type=checkbox].guify-checkbox:focus + label:before {\n    background-color: ",";\n}\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.sizing.componentHeight,i.theme.sizing.componentHeight,i.theme.colors.componentBackground,i.theme.sizing.componentHeight,"4px",i.theme.sizing.componentHeight,"4px",i.theme.colors.componentBackgroundHover,i.theme.colors.componentBackground,i.theme.sizing.componentHeight,"4px",i.theme.sizing.componentHeight,"4px",i.theme.colors.componentForeground,"4px",i.theme.colors.componentBackground,i.theme.sizing.componentHeight,"4px",i.theme.sizing.componentHeight,"4px",i.theme.colors.componentForeground,"4px",i.theme.colors.componentBackgroundHover,i.theme.colors.componentBackgroundHover)},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function r(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),s=t(4),u=function(e){return e&&e.__esModule?e:{default:e}}(s),l=t(51),c=function(e){function n(e,r,a,s){o(this,n);var u=i(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));u.opts=r;var c,f,p,h,d,g,b;if(u.container=t(2)(e,r.label,a),t(5)(u.container,r.label,a),u.input=document.createElement("select"),u.input.className=l["guify-select-dropdown"],r.label&&u.input.setAttribute("aria-label",r.label),f=document.createElement("span"),f.classList.add(l["guify-select-triangle"],l["guify-select-triangle--down"]),p=document.createElement("span"),p.classList.add(l["guify-select-triangle"],l["guify-select-triangle--up"]),u.container.appendChild(f),u.container.appendChild(p),Array.isArray(r.options))for(c=0;c<r.options.length;c++)d=r.options[c],g=document.createElement("option"),g.value=g.textContent=d,r.initial===d&&(g.selected="selected"),u.input.appendChild(g);else for(b=Object.keys(r.options),c=0;c<b.length;c++)h=b[c],g=document.createElement("option"),g.value=h,r.initial===h&&(g.selected="selected"),g.textContent=r.options[h],u.input.appendChild(g);u.container.appendChild(u.input),u.input.onchange=function(e){u.emit("input",e.target.value)};var m=function(){f.classList.add(l["guify-select-triangle--down-highlight"]),p.classList.add(l["guify-select-triangle--up-highlight"])},y=function(){f.classList.remove(l["guify-select-triangle--down-highlight"]),p.classList.remove(l["guify-select-triangle--up-highlight"])},v=!1;return u.input.addEventListener("mouseover",m),u.input.addEventListener("focus",function(){v=!0,m()}),u.input.addEventListener("blur",function(){v=!1,y()}),u.input.addEventListener("mouseleave",function(){v||y()}),u}return r(n,e),a(n,[{key:"SetValue",value:function(e){this.input.value=e}},{key:"GetValue",value:function(){return this.input.value}}]),n}(u.default);n.default=c,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-select-dropdown {\n    display: inline-block;\n    position: absolute;\n    width: calc(100% - ",");\n    padding-left: 1.5%;\n    height: ",";\n    border: none;\n    border-radius: 0;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    -o-appearance:none;\n    appearance: none;\n    font-family: inherit;\n    background-color: ",";\n    color: ",";\n    box-sizing: border-box !important;\n    -moz-box-sizing: border-box !important;\n    -webkit-box-sizing: border-box !important;\n}\n\n/* Disable default outline since we're providing our own */\n.guify-select-dropdown:focus {\n    outline: none;\n}\n.guify-select-dropdown::-moz-focus-inner {\n    border: 0;\n}\n\n\n.guify-select-dropdown:focus,\n.guify-select-dropdown:hover {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-select-dropdown::-ms-expand {\n    display:none;\n}\n.guify-select-triangle {\n    content: ' ';\n    border-right: 3px solid transparent;\n    border-left: 3px solid transparent;\n    line-height: ",";\n    position: absolute;\n    right: 2.5%;\n    z-index: 1;\n    pointer-events: none;\n}\n\n.guify-select-triangle--up {\n    bottom: 55%;\n    border-bottom: 5px solid ",";\n    border-top: 0px transparent;\n}\n\n.guify-select-triangle--down {\n    top: 55%;\n    border-top: 5px solid ",";\n    border-bottom: 0px transparent;\n}\n\n.guify-select-triangle--up-highlight {\n    border-bottom-color: ",";\n}\n\n.guify-select-triangle--down-highlight {\n    border-top-color: ",";\n}\n\n"],["\n\n.guify-select-dropdown {\n    display: inline-block;\n    position: absolute;\n    width: calc(100% - ",");\n    padding-left: 1.5%;\n    height: ",";\n    border: none;\n    border-radius: 0;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    -o-appearance:none;\n    appearance: none;\n    font-family: inherit;\n    background-color: ",";\n    color: ",";\n    box-sizing: border-box !important;\n    -moz-box-sizing: border-box !important;\n    -webkit-box-sizing: border-box !important;\n}\n\n/* Disable default outline since we're providing our own */\n.guify-select-dropdown:focus {\n    outline: none;\n}\n.guify-select-dropdown::-moz-focus-inner {\n    border: 0;\n}\n\n\n.guify-select-dropdown:focus,\n.guify-select-dropdown:hover {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-select-dropdown::-ms-expand {\n    display:none;\n}\n.guify-select-triangle {\n    content: ' ';\n    border-right: 3px solid transparent;\n    border-left: 3px solid transparent;\n    line-height: ",";\n    position: absolute;\n    right: 2.5%;\n    z-index: 1;\n    pointer-events: none;\n}\n\n.guify-select-triangle--up {\n    bottom: 55%;\n    border-bottom: 5px solid ",";\n    border-top: 0px transparent;\n}\n\n.guify-select-triangle--down {\n    top: 55%;\n    border-top: 5px solid ",";\n    border-bottom: 0px transparent;\n}\n\n.guify-select-triangle--up-highlight {\n    border-bottom-color: ",";\n}\n\n.guify-select-triangle--down-highlight {\n    border-top-color: ",";\n}\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.sizing.labelWidth,i.theme.sizing.componentHeight,i.theme.colors.componentBackground,i.theme.colors.textSecondary,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.sizing.componentHeight,i.theme.colors.textSecondary,i.theme.colors.textSecondary,i.theme.colors.textHover,i.theme.colors.textHover)},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(4),l=o(u),c=t(0),f=o(c),p=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return u.opts=o,u.container=t(2)(e,o.label,a),t(5)(u.container,o.label,a),u.input=u.container.appendChild(document.createElement("input")),u.input.type="text",u.input.className="guify-text",o.initial&&(u.input.value=o.initial),o.label&&u.input.setAttribute("aria-label",o.label),(0,f.default)(u.input,{position:"absolute",paddingLeft:"6px",height:a.sizing.componentHeight,width:"calc(100% - "+a.sizing.labelWidth+")",border:"none",background:a.colors.componentBackground,color:a.colors.textSecondary,fontFamily:"inherit","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box",resize:"vertical"}),setTimeout(function(){u.emit("initialized",u.input.value)}),u.input.oninput=function(e){u.emit("input",e.target.value)},u.input.addEventListener("focus",function(){(0,f.default)(u.input,{outline:"none"}),u.focused=!0}),u.input.addEventListener("blur",function(){u.focused=!1}),u}return a(n,e),s(n,[{key:"SetValue",value:function(e){!0!==this.focused&&(this.input.value=e)}},{key:"GetValue",value:function(){return this.input.value}}]),n}(l.default);n.default=p,e.exports=n.default},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(4),l=o(u),c=t(54),f=o(c),p=t(0),h=o(p),d=t(14),g=o(d),b=t(13),m=o(b),y=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));u.opts=o,u.theme=a,o.format=o.format||"rgb",o.initial=o.initial||"#123456",u.container=t(2)(e,o.label,a),t(5)(u.container,o.label,a);var l=u.container.appendChild(document.createElement("span"));l.className="guify-color-"+s;var c=t(6)(u.container,"",a,"calc(100% - "+a.sizing.labelWidth+" - 12% - 0.5em)");c.setAttribute("readonly","true"),l.onmouseover=function(){u.picker.$el.style.display=""};var p=o.initial;switch(o.format){case"rgb":case"hex":p=(0,g.default)(p).toHexString();break;case"array":p=g.default.fromRatio({r:p[0],g:p[1],b:p[2]}).toHexString()}return u.picker=new f.default({el:l,color:p,background:a.colors.componentBackground,width:125,height:100}),(0,h.default)(u.picker.$el,{marginTop:a.sizing.componentHeight,display:"none",position:"absolute"}),(0,h.default)(l,{position:"relative",display:"inline-block",width:"12.5%",height:a.sizing.componentHeight,backgroundColor:u.picker.getHexString()}),u.InjectStyles(),l.onmouseout=function(e){u.picker.$el.style.display="none"},setTimeout(function(){u.emit("initialized",p)}),u.picker.onChange(function(e){c.value=u.Format(e),(0,h.default)(l,{backgroundColor:e}),u.emit("input",u.Format(e))}),u}return a(n,e),s(n,[{key:"Format",value:function(e){switch(this.opts.format){case"rgb":return(0,g.default)(e).toRgbString();case"hex":return(0,g.default)(e).toHexString();case"array":var n=(0,g.default)(e).toRgb();return[n.r/255,n.g/255,n.b/255].map(function(e){return e.toFixed(2)});default:return e}}},{key:"SetValue",value:function(e){this.picker.setColor(e)}},{key:"GetValue",value:function(){return this.Format(this.picker.getColor())}},{key:"InjectStyles",value:function(){(0,m.default)("\n\n        .Scp {\n            width: 125px;\n            height: 100px;\n            -webkit-user-select: none;\n            -moz-user-select: none;\n                -ms-user-select: none;\n                    user-select: none;\n            position: relative;\n            z-index: 1000;\n            cursor: pointer;\n        }\n        .Scp-saturation {\n            position: relative;\n            width: calc(100% - 25px);\n            height: 100%;\n            background: linear-gradient(to right, #fff 0%, #f00 100%);\n            float: left;\n            margin-right: 5px;\n        }\n        .Scp-brightness {\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(to top, #000 0%, rgba(255,255,255,0) 100%);\n        }\n        .Scp-sbSelector {\n            border: 1px solid;\n            position: absolute;\n            width: 14px;\n            height: 14px;\n            background: #fff;\n            border-radius: 10px;\n            top: -7px;\n            left: -7px;\n            box-sizing: border-box;\n            z-index: 10;\n        }\n        .Scp-hue {\n            width: 20px;\n            height: 100%;\n            position: relative;\n            float: left;\n            background: linear-gradient(to bottom, #f00 0%, #f0f 17%, #00f 34%, #0ff 50%, #0f0 67%, #ff0 84%, #f00 100%);\n        }\n        .Scp-hSelector {\n            position: absolute;\n            background: #fff;\n            border-bottom: 1px solid #000;\n            right: -3px;\n            width: 10px;\n            height: 2px;\n        }\n\n        ")}}]),n}(l.default);n.default=y,e.exports=n.default},function(e,n,t){"use strict";!function(){function n(e){return e=e||{},this.color=null,this.width=0,this.widthUnits="px",this.height=0,this.heightUnits="px",this.hue=0,this.position={x:0,y:0},this.huePosition=0,this.saturationWidth=0,this.hueHeight=0,this.maxHue=0,this.inputIsNumber=!1,this._onSaturationMouseDown=this._onSaturationMouseDown.bind(this),this._onSaturationMouseMove=this._onSaturationMouseMove.bind(this),this._onSaturationMouseUp=this._onSaturationMouseUp.bind(this),this._onHueMouseDown=this._onHueMouseDown.bind(this),this._onHueMouseMove=this._onHueMouseMove.bind(this),this._onHueMouseUp=this._onHueMouseUp.bind(this),this.$el=document.createElement("div"),this.$el.className="Scp",this.$el.innerHTML=['<div class="Scp-saturation">','<div class="Scp-brightness"></div>','<div class="Scp-sbSelector"></div>',"</div>",'<div class="Scp-hue">','<div class="Scp-hSelector"></div>',"</div>"].join(""),this.$saturation=this.$el.querySelector(".Scp-saturation"),this.$hue=this.$el.querySelector(".Scp-hue"),this.$sbSelector=this.$el.querySelector(".Scp-sbSelector"),this.$hSelector=this.$el.querySelector(".Scp-hSelector"),this.$saturation.addEventListener("mousedown",this._onSaturationMouseDown),this.$saturation.addEventListener("touchstart",this._onSaturationMouseDown),this.$hue.addEventListener("mousedown",this._onHueMouseDown),this.$hue.addEventListener("touchstart",this._onHueMouseDown),e.el&&this.appendTo(e.el),e.background&&this.setBackgroundColor(e.background),e.widthUnits&&(this.widthUnits=e.widthUnits),e.heightUnits&&(this.heightUnits=e.heightUnits),this.setSize(e.width||175,e.height||150),this.setColor(e.color),this}function o(e,n,t){return Math.min(Math.max(e,n),t)}function i(e){return e=0===e.type.indexOf("touch")?e.touches[0]:e,{x:e.clientX,y:e.clientY}}function r(e){return e="#"+("00000"+(0|e).toString(16)).substr(-6)}var a=t(55),s=t(56),u=t(14),l=t(59);a(n.prototype),n.prototype.appendTo=function(e){return e.appendChild(this.$el),this},n.prototype.remove=function(){this._onSaturationMouseUp(),this._onHueMouseUp(),this.$saturation.removeEventListener("mousedown",this._onSaturationMouseDown),this.$saturation.removeEventListener("touchstart",this._onSaturationMouseDown),this.$hue.removeEventListener("mousedown",this._onHueMouseDown),this.$hue.removeEventListener("touchstart",this._onHueMouseDown),this.off(),this.$el.parentNode&&this.$el.parentNode.removeChild(this.$el)},n.prototype.setColor=function(e){s(e)?(this.inputIsNumber=!0,e=r(e)):this.inputIsNumber=!1,this.color=u(e);var n=this.color.toHsv();return isNaN(n.h)||(this.hue=n.h),this._moveSelectorTo(this.saturationWidth*n.s,(1-n.v)*this.hueHeight),this._moveHueTo((1-this.hue/360)*this.hueHeight),this._updateHue(),this},n.prototype.setSize=function(e,n){return this.width=e,this.height=n,this.$el.style.width=this.width+this.widthUnits,this.$el.style.height=this.height+this.heightUnits,this.saturationWidth=this.width-25,this.$saturation.style.width=this.saturationWidth+"px",this.hueHeight=this.height,this.maxHue=this.hueHeight-2,this},n.prototype.setBackgroundColor=function(e){return s(e)&&(e=r(e)),this.$el.style.padding="5px",this.$el.style.background=u(e).toHexString(),this},n.prototype.setNoBackground=function(){this.$el.style.padding="0px",this.$el.style.background="none"},n.prototype.onChange=function(e){return this.on("update",e),this.emit("update",this.getHexString()),this},n.prototype.getColor=function(){return this.inputIsNumber?this.getHexNumber():this.color.toString()},n.prototype.getHexString=function(){return this.color.toHexString().toUpperCase()},n.prototype.getHexNumber=function(){return parseInt(this.color.toHex(),16)},n.prototype.getRGB=function(){return this.color.toRgb()},n.prototype.getHSV=function(){return this.color.toHsv()},n.prototype.isDark=function(){return this.color.isDark()},n.prototype.isLight=function(){return this.color.isLight()},n.prototype._moveSelectorTo=function(e,n){this.position.x=o(e,0,this.saturationWidth),this.position.y=o(n,0,this.hueHeight),l(this.$sbSelector,{x:this.position.x,y:this.position.y})},n.prototype._updateColorFromPosition=function(){this.color=u({h:this.hue,s:this.position.x/this.saturationWidth,v:1-this.position.y/this.hueHeight}),this._updateColor()},n.prototype._moveHueTo=function(e){this.huePosition=o(e,0,this.maxHue),l(this.$hSelector,{y:this.huePosition})},n.prototype._updateHueFromPosition=function(){var e=this.color.toHsv();this.hue=360*(1-this.huePosition/this.maxHue),this.color=u({h:this.hue,s:e.s,v:e.v}),this._updateHue()},n.prototype._updateHue=function(){var e=u({h:this.hue,s:1,v:1});this.$saturation.style.background="linear-gradient(to right, #fff, "+e.toHexString()+")",this._updateColor()},n.prototype._updateColor=function(){this.$sbSelector.style.background=this.color.toHexString(),this.$sbSelector.style.borderColor=this.color.isDark()?"#fff":"#000",this.emit("update",this.color.toHexString())},n.prototype._onSaturationMouseDown=function(e){var n=this.$saturation.getBoundingClientRect(),t=i(e).x,o=i(e).y;this._moveSelectorTo(t-n.left,o-n.top),this._updateColorFromPosition(),window.addEventListener("mouseup",this._onSaturationMouseUp),window.addEventListener("touchend",this._onSaturationMouseUp),window.addEventListener("mousemove",this._onSaturationMouseMove),window.addEventListener("touchmove",this._onSaturationMouseMove),e.preventDefault()},n.prototype._onSaturationMouseMove=function(e){var n=this.$saturation.getBoundingClientRect(),t=i(e).x,o=i(e).y;this._moveSelectorTo(t-n.left,o-n.top),this._updateColorFromPosition()},n.prototype._onSaturationMouseUp=function(){window.removeEventListener("mouseup",this._onSaturationMouseUp),window.removeEventListener("touchend",this._onSaturationMouseUp),window.removeEventListener("mousemove",this._onSaturationMouseMove),window.removeEventListener("touchmove",this._onSaturationMouseMove)},n.prototype._onHueMouseDown=function(e){var n=this.$hue.getBoundingClientRect(),t=i(e).y;this._moveHueTo(t-n.top),this._updateHueFromPosition(),window.addEventListener("mouseup",this._onHueMouseUp),window.addEventListener("touchend",this._onHueMouseUp),window.addEventListener("mousemove",this._onHueMouseMove),window.addEventListener("touchmove",this._onHueMouseMove),e.preventDefault()},n.prototype._onHueMouseMove=function(e){var n=this.$hue.getBoundingClientRect(),t=i(e).y;this._moveHueTo(t-n.top),this._updateHueFromPosition()},n.prototype._onHueMouseUp=function(){window.removeEventListener("mouseup",this._onHueMouseUp),window.removeEventListener("touchend",this._onHueMouseUp),window.removeEventListener("mousemove",this._onHueMouseMove),window.removeEventListener("touchmove",this._onHueMouseMove)},void 0!==e&&e.exports&&(e.exports=n)}()},function(e,n,t){function o(e){if(e)return i(e)}function i(e){for(var n in o.prototype)e[n]=o.prototype[n];return e}e.exports=o,o.prototype.on=o.prototype.addEventListener=function(e,n){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(n),this},o.prototype.once=function(e,n){function t(){this.off(e,t),n.apply(this,arguments)}return t.fn=n,this.on(e,t),this},o.prototype.off=o.prototype.removeListener=o.prototype.removeAllListeners=o.prototype.removeEventListener=function(e,n){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var t=this._callbacks["$"+e];if(!t)return this;if(1==arguments.length)return delete this._callbacks["$"+e],this;for(var o,i=0;i<t.length;i++)if((o=t[i])===n||o.fn===n){t.splice(i,1);break}return this},o.prototype.emit=function(e){this._callbacks=this._callbacks||{};var n=[].slice.call(arguments,1),t=this._callbacks["$"+e];if(t){t=t.slice(0);for(var o=0,i=t.length;o<i;++o)t[o].apply(this,n)}return this},o.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},o.prototype.hasListeners=function(e){return!!this.listeners(e).length}},function(e,n,t){"use strict";/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var o=t(57);e.exports=function(e){var n=o(e);if("string"===n){if(!e.trim())return!1}else if("number"!==n)return!1;return e-e+1>=0}},function(e,n,t){var o=t(58),i=Object.prototype.toString;e.exports=function(e){if(void 0===e)return"undefined";if(null===e)return"null";if(!0===e||!1===e||e instanceof Boolean)return"boolean";if("string"==typeof e||e instanceof String)return"string";if("number"==typeof e||e instanceof Number)return"number";if("function"==typeof e||e instanceof Function)return"function";if(void 0!==Array.isArray&&Array.isArray(e))return"array";if(e instanceof RegExp)return"regexp";if(e instanceof Date)return"date";var n=i.call(e);return"[object RegExp]"===n?"regexp":"[object Date]"===n?"date":"[object Arguments]"===n?"arguments":"[object Error]"===n?"error":o(e)?"buffer":"[object Set]"===n?"set":"[object WeakSet]"===n?"weakset":"[object Map]"===n?"map":"[object WeakMap]"===n?"weakmap":"[object Symbol]"===n?"symbol":"[object Int8Array]"===n?"int8array":"[object Uint8Array]"===n?"uint8array":"[object Uint8ClampedArray]"===n?"uint8clampedarray":"[object Int16Array]"===n?"int16array":"[object Uint16Array]"===n?"uint16array":"[object Int32Array]"===n?"int32array":"[object Uint32Array]"===n?"uint32array":"[object Float32Array]"===n?"float32array":"[object Float64Array]"===n?"float64array":"object"}},function(e,n){function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function o(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(t(e)||o(e)||!!e._isBuffer)}},function(e,n,t){"use strict";function o(e,n){var t,o,i,r=[];s(n);for(t in n)h.call(n,t)&&(o=n[t],h.call(f.transform,t)?(i=f.transform[t],c(o)&&(o=o.join(i.separator)),r.push(t+"("+p(o,i.defaultUnit,i.separator)+")")):h.call(f,t)?(i=f[t],c(o)&&(o=o.join(i.separator)),e.style[l(t)]=p(o,i.defaultUnit,i.separator)):console.warn("dom-transform: this property (`"+t+"`) is not supported."));e.style[d]=r.join(" ")}function i(e,n){var t=e.style;if("string"==typeof n)return h.call(f.transform,n)?t[d]:t[l(n)];n||(n=u());var o={};return n.forEach(function(e){o[e]=t[l(e)]}),o}function r(e,n){var t=e.style;if("string"==typeof n)return void(t[l(n)]=null);n||(n=u()),n.forEach(function(e){t[l(e)]=null})}function a(){return d.length>0}function s(e){var n;for(n in e)h.call(g,n)&&(e[g[n]]=e[n],delete e[n])}function u(){return Object.keys(f).map(function(e){return e})}var l=t(60),c=t(61),f=t(62),p=t(63),h=Object.prototype.hasOwnProperty,d=l("transform"),g={x:"translateX",y:"translateY",z:"translateZ",origin:"transformOrigin"};n=e.exports=o,n.get=i,n.reset=r,n.isSupported=a},function(e,n){function t(e){if(e=e.replace(/-([a-z])/g,function(e,n){return n.toUpperCase()}),void 0!==r[e])return e;for(var n=e.charAt(0).toUpperCase()+e.slice(1),t=a.length;t--;){var o=a[t]+n;if(void 0!==r[o])return o}return e}function o(e){return e in u?u[e]:u[e]=t(e)}function i(e){return e=t(e),s.test(e)&&(e="-"+e.replace(s,"-$1"),s.lastIndex=0),e.toLowerCase()}var r="undefined"!=typeof document?document.createElement("p").style:{},a=["O","ms","Moz","Webkit"],s=/([A-Z])/g,u={};e.exports=o,e.exports.dash=i},function(e,n){var t=Array.isArray,o=Object.prototype.toString;e.exports=t||function(e){return!!e&&"[object Array]"==o.call(e)}},function(e,n,t){"use strict";e.exports={transform:{translate:{defaultUnit:"px"},translate3d:{defaultUnit:"px"},translateX:{defaultUnit:"px"},translateY:{defaultUnit:"px"},translateZ:{defaultUnit:"px"},scale:{defaultUnit:""},scale3d:{defaultUnit:""},scaleX:{defaultUnit:""},scaleY:{defaultUnit:""},scaleZ:{defaultUnit:""},rotate:{defaultUnit:"deg"},rotate3d:{defaultUnit:""},rotateX:{defaultUnit:"deg"},rotateY:{defaultUnit:"deg"},rotateZ:{defaultUnit:"deg"},skew:{defaultUnit:"deg"},skewX:{defaultUnit:"deg"},skewY:{defaultUnit:"deg"},perspective:{defaultUnit:"px"},matrix:{defaultUnit:""},matrix3d:{defaultUnit:""}},transformOrigin:{defaultUnit:"px",separator:" "}}},function(e,n,t){"use strict";var o=t(64),i=/^-?\d+(\.\d+)?$/;e.exports=function(e,n,t){if(t=t||",","number"==typeof e)return""+e+n;var r=new RegExp(t,"g");return e.split(r.test(e)?t:" ").map(function(e){return e=o(e),i.test(e)&&(e+=n),e}).join(t)}},function(e,n){function t(e){return e.replace(/^\s*|\s*$/g,"")}n=e.exports=t,n.left=function(e){return e.replace(/^\s*/,"")},n.right=function(e){return e.replace(/\s*$/,"")}},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(0),a=function(e){return e&&e.__esModule?e:{default:e}}(r),s=t(66),u=function(){function e(n,i,r,u){var l=this;o(this,e),this.opts=i,this.container=t(2)(n,i.label,r),this.container.classList.add(s["guify-folder"]),this.container.setAttribute("role","button"),this.container.setAttribute("tabIndex","0"),this.arrow=this.container.appendChild(document.createElement("div")),this.arrow.innerHTML="&#9662;",(0,a.default)(this.arrow,{width:"1.5em"}),this.label=this.container.appendChild(document.createElement("div")),this.label.innerHTML=i.label,this.container.onclick=function(){l.Toggle()},this.container.addEventListener("mouseup",function(){l.container.blur()}),this.container.addEventListener("keydown",function(e){13!==e.which&&32!==e.which||l.Toggle()}),this.folderContainer=n.appendChild(document.createElement("div")),this.folderContainer.classList.add(s["guify-folder-contents"]),this.open=this.opts.open||!1,this.SetOpen(this.open)}return i(e,[{key:"Toggle",value:function(){this.open=!this.open,this.SetOpen(this.open)}},{key:"SetOpen",value:function(e){this.open=e,e?(this.folderContainer.classList.remove(s["guify-folder-closed"]),this.arrow.innerHTML="&#9662;"):(this.folderContainer.classList.add(s["guify-folder-closed"]),this.arrow.innerHTML="&#9656;")}}]),e}();n.default=u,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-folder {\n    cursor: pointer;\n    padding-left: 0.5em;\n    color: ",";\n}\n\n.guify-folder div {\n    display: inline-block;\n    vertical-align: sub;\n    line-height: calc("," + 5px);\n}\n\n.guify-folder:hover,\n.guify-folder:focus {\n    color: ",";\n    background-color: ",";\n    outline: none;\n}\n\n\n.guify-folder-contents {\n    display: block;\n    box-sizing: border-box;\n    padding-left: 14px;\n    margin-bottom: 5px;\n    border-left: 2px solid ",";\n}\n\n.guify-folder-contents.guify-folder-closed {\n    height: 0;\n    display: none;\n}\n\n\n"],["\n\n.guify-folder {\n    cursor: pointer;\n    padding-left: 0.5em;\n    color: ",";\n}\n\n.guify-folder div {\n    display: inline-block;\n    vertical-align: sub;\n    line-height: calc("," + 5px);\n}\n\n.guify-folder:hover,\n.guify-folder:focus {\n    color: ",";\n    background-color: ",";\n    outline: none;\n}\n\n\n.guify-folder-contents {\n    display: block;\n    box-sizing: border-box;\n    padding-left: 14px;\n    margin-bottom: 5px;\n    border-left: 2px solid ",";\n}\n\n.guify-folder-contents.guify-folder-closed {\n    height: 0;\n    display: none;\n}\n\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.textPrimary,i.theme.sizing.componentHeight,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.colors.componentBackground)},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(4),l=o(u),c=t(0),f=o(c),p=t(68),h=function(e){function n(e,o,a,s){i(this,n);var u=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));u.opts=o,u.opts.fileReadFunc=u.opts.fileReadFunc||"readAsDataURL",u.file=null,u.fileName=null,u.container=t(2)(e,o.label,a),u.container.classList.add(p["guify-file-container"]),u.container.setAttribute("role","button"),u.container.setAttribute("tabIndex","0"),(0,f.default)(u.container,{width:"100%","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box",height:"unset",padding:"8px"});var l=u.container.appendChild(document.createElement("div"));l.innerHTML=o.label,(0,f.default)(l,"padding-bottom","5px");var c=u.container.appendChild(document.createElement("input"));c.setAttribute("type","file"),c.setAttribute("multiple",!1),c.style.display="none",o.label&&c.setAttribute("aria-label",o.label),u.fileLabel=u.container.appendChild(document.createElement("div")),u.fileLabel.innerHTML="Choose a file...";var h=function(e){var n;e.dataTransfer?n=e.dataTransfer.files:e.target&&(n=e.target.files);var t=(n[0],new FileReader);t.onload=function(){u.file=t.result,u.fileLabel.innerHTML=n[0].name,u.emit("input",u.file)},t[u.opts.fileReadFunc](n[0])};return c.addEventListener("change",h),u.container.addEventListener("dragover",function(e){e.preventDefault(),e.stopPropagation(),u.container.classList.add(p["guify-dragover"])}),u.container.addEventListener("dragleave",function(e){e.preventDefault(),e.stopPropagation(),u.container.classList.remove(p["guify-dragover"])}),u.container.addEventListener("drop",function(e){e.preventDefault(),e.stopPropagation(),u.container.classList.remove(p["guify-dragover"]),h(e)}),u.container.onclick=function(){c.click()},u.container.addEventListener("keydown",function(e){13!==e.which&&32!==e.which||c.click()}),u.container.addEventListener("mouseup",function(){u.container.blur()}),u}return a(n,e),s(n,[{key:"SetValue",value:function(e){}},{key:"GetValue",value:function(){return this.file}}]),n}(l.default);n.default=h,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-file-container {\n    display: inline-block;\n    outline: none;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    color: ",";\n    background-color: ",";\n}\n\n.guify-file-container:hover,\n.guify-file-container:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-file-container:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n.guify-dragover {\n    background-color: ",";\n    box-shadow: inset 0 0 0 3px ",";\n}\n\n\n"],["\n\n.guify-file-container {\n    display: inline-block;\n    outline: none;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    color: ",";\n    background-color: ",";\n}\n\n.guify-file-container:hover,\n.guify-file-container:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-file-container:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n.guify-dragover {\n    background-color: ",";\n    box-shadow: inset 0 0 0 3px ",";\n}\n\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.textPrimary,i.theme.colors.componentBackground,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.colors.textActive,i.theme.colors.componentActive,i.theme.colors.componentBackground,i.theme.colors.componentForeground)},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(0),a=function(e){return e&&e.__esModule?e:{default:e}}(r),s=function(){function e(n,i,r,s){o(this,e),this.opts=i,this.container=t(2)(n,i.label,r),t(5)(this.container,i.label,r),this.text=this.container.appendChild(document.createElement("div")),(0,a.default)(this.text,{display:"inline-block",height:"unset",width:"calc(100% - "+r.sizing.labelWidth+")",border:"none",color:r.colors.textSecondary,fontFamily:"inherit","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box",verticalAlign:"sub","line-height":r.sizing.componentHeight,"user-select":"text"}),i.label&&this.text.setAttribute("aria-label",i.label)}return i(e,[{key:"SetValue",value:function(e){this.text.innerHTML=e.toString()}},{key:"GetValue",value:function(){return this.text.innerHTML.toString()}}]),e}();n.default=s,e.exports=n.default},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}function s(e,n,t){return Math.min(Math.max(e,n),t)}Object.defineProperty(n,"__esModule",{value:!0});var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),l=t(4),c=o(l),f=t(0),p=o(f),h=t(10),d=o(h),g=t(71),b=function(e){function n(e,o,a,u){i(this,n);var l=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));if(l.opts=o,l.container=t(2)(e,o.label,a),t(5)(l.container,o.label,a),o.step&&o.steps)throw new Error("Cannot specify both step and steps. Got step = "+o.step+", steps = ",o.steps);if(l.input=l.container.appendChild(document.createElement("span")),l.input.className=g["guify-interval"],l.handle=document.createElement("span"),l.handle.className=g["guify-interval-handle"],l.input.appendChild(l.handle),Array.isArray(o.initial)||(o.initial=[]),"log"===o.scale){if(o.max=(0,d.default)(o.max)?o.max:100,o.min=(0,d.default)(o.min)?o.min:.1,o.min*o.max<=0)throw new Error("Log range min/max must have the same sign and not equal zero. Got min = "+o.min+", max = "+o.max);if(l.logmin=o.min,l.logmax=o.max,l.logsign=o.min>0?1:-1,l.logmin=Math.abs(l.logmin),l.logmax=Math.abs(l.logmax),o.min=0,o.max=100,(0,d.default)(o.step))throw new Error("Log may only use steps (integer number of steps), not a step value. Got step ="+o.step);if(o.step=1,o.initial=[l.InverseScaleValue((0,d.default)(o.initial)?o.initial[0]:scaleValue(o.min+.25*(o.max-o.min))),l.InverseScaleValue((0,d.default)(o.initial)?o.initial[1]:scaleValue(o.min+.75*(o.max-o.min)))],l.ScaleValue(o.initial[0])*l.ScaleValue(o.max)<=0||scaleValue(o.initial[1])*l.ScaleValue(o.max)<=0)throw new Error("Log range initial value must have the same sign as min/max and must not equal zero. Got initial value = ["+l.ScaleValue(o.initial[0])+", "+l.ScaleValue(o.initial[1])+"]")}else o.max=(0,d.default)(o.max)?o.max:100,o.min=(0,d.default)(o.min)?o.min:0,o.step=(0,d.default)(o.step)?o.step:.01,o.initial=[(0,d.default)(o.initial[0])?o.initial[0]:.25*(o.min+o.max),(0,d.default)(o.initial[1])?o.initial[1]:.75*(o.min+o.max)];(0,d.default)(o.steps)&&(o.step=(0,d.default)(o.steps)?(o.max-o.min)/o.steps:o.step),o.initial[0]=o.min+o.step*Math.round((o.initial[0]-o.min)/o.step),o.initial[1]=o.min+o.step*Math.round((o.initial[1]-o.min)/o.step),l.value=o.initial,(0,p.default)(l.handle,{left:(l.value[0]-o.min)/(o.max-o.min)*100+"%",right:100-(l.value[1]-o.min)/(o.max-o.min)*100+"%"}),l.lValue=t(6)(l.container,l.ScaleValue(o.initial[0]),a,"11%",!0),l.rValue=t(6)(l.container,l.ScaleValue(o.initial[1]),a,"11%"),o.label&&l.lValue.setAttribute("aria-label",o.label+" lower value"),o.label&&l.lValue.setAttribute("aria-label",o.label+" upper value"),l.activeIndex=-1,setTimeout(function(){var e=l.ScaleValue(l.value[0]),n=l.ScaleValue(l.value[1]);l.lValue.innerHTML=e,l.rValue.innerHTML=n,l.emit("initialized",[e,n])}),l.input.addEventListener("focus",function(){l.focused=!0}),l.input.addEventListener("blur",function(){l.focused=!1});var c=function(e){return e.pageX-l.input.getBoundingClientRect().left},f=function(e){var n=s(c(e)/l.input.offsetWidth,0,1);l.setActiveValue(n)},h=function e(n){var t=s(c(n)/l.input.offsetWidth,0,1);l.setActiveValue(t),document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",e),l.activeIndex=-1};return l.input.addEventListener("mousedown",function(e){var n=s(c(e)/l.input.offsetWidth,0,1),t=(l.value[0]-o.min)/(o.max-o.min),i=(l.value[1]-o.min)/(o.max-o.min);t-=1e-15*Math.abs(o.max-o.min),i+=1e-15*Math.abs(o.max-o.min);var r=Math.abs(t-n),a=Math.abs(i-n);l.activeIndex=r<a?0:1,console.log(l.activeIndex),document.addEventListener("mousemove",f),document.addEventListener("mouseup",h)}),l.input.addEventListener("mouseup",function(){l.input.blur()}),l.input.oninput=function(){var e=l.ScaleValue(l.value[0]),n=l.ScaleValue(l.value[1]);l.lValue.value=e,l.rValue.value=n,l.emit("input",[e,n])},l.lValue.onchange=function(){var e=l.lValue.value,n=parseFloat(l.rValue.value);if(Number(parseFloat(e))==e){var t=parseFloat(e);t=Math.min(Math.max(t,o.min),o.max),t=Math.ceil((t-o.min)/o.step)*o.step+o.min,t=Math.min(t,n),l.lValue.value=t,l.emit("input",[t,n]),l.RefreshHandle([t,n])}else l.lValue.value=l.lastValue[0]},l.rValue.onchange=function(){var e=l.rValue.value,n=parseFloat(l.lValue.value);if(Number(parseFloat(e))==e){var t=parseFloat(e);t=Math.min(Math.max(t,o.min),o.max),t=Math.ceil((t-o.min)/o.step)*o.step+o.min,t=Math.max(t,n),l.rValue.value=t,l.emit("input",[n,t]),l.RefreshHandle([n,t])}else l.rValue.value=l.lastValue[1]},l}return a(n,e),u(n,[{key:"ScaleValue",value:function(e){return"log"===this.opts.scale?this.logsign*Math.exp(Math.log(this.logmin)+(Math.log(this.logmax)-Math.log(this.logmin))*e/100):e}},{key:"InverseScaleValue",value:function(e){return"log"===this.opts.scale?100*(Math.log(e*this.logsign)-Math.log(this.logmin))/(Math.log(this.logmax)-Math.log(this.logmin)):e}},{key:"setActiveValue",value:function(e){if(-1!==this.activeIndex){var n=this.opts,t=(this.value[0]-n.min)/(n.max-n.min),o=(this.value[1]-n.min)/(n.max-n.min);e=0===this.activeIndex?Math.min(o,e):Math.max(t,e);var i=n.min+Math.round((n.max-n.min)*e/n.step)*n.step;this.value[this.activeIndex]=i,(0,p.default)(this.handle,{left:(this.value[0]-n.min)/(n.max-n.min)*100+"%",right:100-(this.value[1]-n.min)/(n.max-n.min)*100+"%"}),this.input.oninput()}}},{key:"SetValue",value:function(e){!0!==this.focused&&(this.lValue.value=this.FormatNumber(e[0]),this.rValue.value=this.FormatNumber(e[1]),this.lastValue=[this.lValue.value,this.rValue.value])}},{key:"FormatNumber",value:function(e){return e.toFixed(3).replace(/\.?0*$/,"")}},{key:"GetValue",value:function(){return[this.lValue.value,this.rValue.value]}},{key:"RefreshHandle",value:function(e){var n=(parseFloat(e[0])-this.opts.min)/(this.opts.max-this.opts.min)*100,t=100-(parseFloat(e[1])-this.opts.min)/(this.opts.max-this.opts.min)*100;(0,p.default)(this.handle,{left:n+"%",right:t+"%"})}}]),n}(c.default);n.default=b,e.exports=n.default},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n.guify-interval {\n    -webkit-appearance: none;\n    position: absolute;\n    height: 20px;\n    margin: 0px 0;\n    width: 33%;\n    left: 54.5%;\n    background-color: ",";\n    cursor: ew-resize;\n\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n.guify-interval-handle {\n    background-color: ",";\n    position: absolute;\n    height: ",";\n    min-width: 1px;\n}\n.guify-interval-handle:focus {\n    background: ",";\n}\n"],["\n.guify-interval {\n    -webkit-appearance: none;\n    position: absolute;\n    height: 20px;\n    margin: 0px 0;\n    width: 33%;\n    left: 54.5%;\n    background-color: ",";\n    cursor: ew-resize;\n\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n.guify-interval-handle {\n    background-color: ",";\n    position: absolute;\n    height: ",";\n    min-width: 1px;\n}\n.guify-interval-handle:focus {\n    background: ",";\n}\n"]),i=t(1),r=t(3),a=i.theme.colors.componentBackground,s=i.theme.colors.componentForeground,u=i.theme.colors.componentActive;e.exports=r(o,a,s,i.theme.sizing.componentHeight,u)},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}Object.defineProperty(n,"__esModule",{value:!0}),n.MenuBar=void 0;var s=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),u=t(0),l=o(u),c=t(4),f=o(c),p=(t(1),t(15)),h=o(p);n.MenuBar=function(e){function n(e,o){i(this,n);var a=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this)),s=t(73);if(a.element=document.createElement("div"),a.element.className=s["guify-bar"],e.appendChild(a.element),o.title){var u=a.element.appendChild(document.createElement("div"));u.className=s["guify-bar-title"],u.innerHTML=o.title}var c=a.element.appendChild(document.createElement("button"));if(c.className=s["guify-bar-button"],c.innerHTML="Controls",(0,l.default)(c,{left:"left"==o.align?"0":"unset",right:"left"==o.align?"unset":"0"}),c.onclick=function(){a.emit("ontogglepanel")},h.default.isEnabled){var f=a.element.appendChild(document.createElement("button"));f.className=s["guify-bar-button"],f.innerHTML="「　」",f.setAttribute("aria-label","Toggle Fullscreen"),(0,l.default)(f,{left:"left"==o.align?"unset":"0",right:"left"==o.align?"0":"unset"}),f.onclick=function(){a.emit("onfullscreenrequested")}}return a}return a(n,e),s(n,[{key:"SetVisible",value:function(e){this.element.style.display=e?"block":"none"}}]),n}(f.default)},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-bar {\n    background-color: ",";\n    height: ",";\n    width: 100%;\n    opacity: 1.0;\n    position: relative;\n    cursor: default;\n}\n\n.guify-bar-title {\n    color: ",";\n    text-align: center;\n    width: 100%;\n    position: absolute;\n    top: 0;\n    line-height: ",";\n    color: ",";\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n.guify-bar-button {\n    text-align: center;\n    border: none;\n    cursor: pointer;\n    font-family: inherit;\n    height: 100%;\n    position: absolute;\n    top: 0;\n    color: ",";\n    background-color: ",";\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    margin: 0;\n\n}\n\n/* Hide default accessibility outlines since we're providing our own visual feedback */\n.guify-bar-button:focus {\n    outline:none;\n}\n.guify-bar-button::-moz-focus-inner {\n    border:0;\n}\n\n.guify-bar-button:hover,\n.guify-bar-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-bar-button:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n\n"],["\n\n.guify-bar {\n    background-color: ",";\n    height: ",";\n    width: 100%;\n    opacity: 1.0;\n    position: relative;\n    cursor: default;\n}\n\n.guify-bar-title {\n    color: ",";\n    text-align: center;\n    width: 100%;\n    position: absolute;\n    top: 0;\n    line-height: ",";\n    color: ",";\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n.guify-bar-button {\n    text-align: center;\n    border: none;\n    cursor: pointer;\n    font-family: inherit;\n    height: 100%;\n    position: absolute;\n    top: 0;\n    color: ",";\n    background-color: ",";\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    margin: 0;\n\n}\n\n/* Hide default accessibility outlines since we're providing our own visual feedback */\n.guify-bar-button:focus {\n    outline:none;\n}\n.guify-bar-button::-moz-focus-inner {\n    border:0;\n}\n\n.guify-bar-button:hover,\n.guify-bar-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-bar-button:active {\n    color: "," !important;\n    background-color: "," !important;\n}\n\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.menuBarBackground,i.theme.sizing.menuBarHeight,i.theme.colors.text1,i.theme.sizing.menuBarHeight,i.theme.colors.menuBarText,i.theme.colors.textPrimary,i.theme.colors.componentBackground,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.colors.textActive,i.theme.colors.componentActive)},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.Panel=void 0;var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(0),a=function(e){return e&&e.__esModule?e:{default:e}}(r),s=t(1);n.Panel=function(){function e(n,i){o(this,e),this.opts=i,this.styles=t(75),this.container=n.appendChild(document.createElement("div")),this.container.className=this.styles["guify-panel-container"],(0,a.default)(this.container,{width:i.width,opacity:i.opacity||1,left:"left"==i.align?"0":"unset",right:"left"==i.align?"unset":"0"}),"outer"==i.panelMode&&(0,a.default)(this.container,{left:"left"==i.align?"unset":"100%",right:"left"==i.align?"100%":"unset"}),"none"===i.barMode&&this._MakeToggleButton(),this.panel=this.container.appendChild(document.createElement("div")),this.panel.className=this.styles["guify-panel"],"none"===i.barMode&&i.title&&t(76)(this.panel,i.title,s.theme)}return i(e,[{key:"SetVisible",value:function(e){e?(this.panel.classList.remove(this.styles["guify-panel-hidden"]),this.menuButton&&this.menuButton.setAttribute("alt","Close GUI")):(this.panel.classList.add(this.styles["guify-panel-hidden"]),this.menuButton&&this.menuButton.setAttribute("alt","Open GUI"))}},{key:"ToggleVisible",value:function(){this.panel.classList.contains(this.styles["guify-panel-hidden"])?this.SetVisible(!0):this.SetVisible(!1)}},{key:"_MakeToggleButton",value:function(){var e=this;this.menuButton=this.container.appendChild(document.createElement("button")),this.menuButton.className=this.styles["guify-panel-toggle-button"],(0,a.default)(this.menuButton,{left:"left"==this.opts.align?"0px":"unset",right:"left"==this.opts.align?"unset":"0px"}),this.menuButton.onclick=function(){e.ToggleVisible()},this.menuButton.addEventListener("mouseup",function(){e.menuButton.blur()}),this.menuButton.innerHTML='\n        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">\n            <rect x="10%" y="10%" width="80%" height="80%"/>\n        </svg>\n        '}}]),e}()},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-panel-container {\n    position: absolute;\n    background: ",";\n}\n\n.guify-panel {\n    padding: 14px;\n    /* Last component will have a margin, so reduce padding to account for this */\n    padding-bottom: calc(14px - ",");\n\n    /* all: initial;  */\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    cursor: default;\n    text-align: left;\n    box-sizing: border-box;\n}\n\n.guify-panel.guify-panel-hidden {\n    height: 0px;\n    display: none;\n}\n\n.guify-panel * {\n    box-sizing: initial;\n    -webkit-box-sizing: initial;\n    -moz-box-sizing: initial;\n}\n\n.guify-panel input {\n    font-family: 'Hack';\n    font-size: 11px;\n    display: inline;\n}\n\n.guify-panel a {\n    color: inherit;\n    text-decoration: none;\n}\n\n.guify-panel-toggle-button {\n    position: absolute;\n    top: 0;\n    margin: 0;\n    padding: 0;\n    width: 15px;\n    height: 15px;\n    line-height: 15px;\n    text-align: center;\n    border: none;\n    cursor: pointer;\n    font-family: inherit;\n    color: ",";\n    background-color: ",";\n\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n\n}\n\n/* Open/Close button styling */\n.guify-panel-toggle-button svg {\n    fill-opacity: 0;\n    stroke-width: 3;\n    stroke: ",";\n}\n\n/* Remove browser default outlines since we're providing our own */\n.guify-panel-toggle-button:focus {\n    outline:none;\n}\n.guify-panel-toggle-button::-moz-focus-inner {\n    border: 0;\n}\n\n.guify-panel-toggle-button:hover,\n.guify-panel-toggle-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-panel-toggle-button:active {\n    color: ",";\n    background-color: ",";\n}\n\n"],["\n\n.guify-panel-container {\n    position: absolute;\n    background: ",";\n}\n\n.guify-panel {\n    padding: 14px;\n    /* Last component will have a margin, so reduce padding to account for this */\n    padding-bottom: calc(14px - ",");\n\n    /* all: initial;  */\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    cursor: default;\n    text-align: left;\n    box-sizing: border-box;\n}\n\n.guify-panel.guify-panel-hidden {\n    height: 0px;\n    display: none;\n}\n\n.guify-panel * {\n    box-sizing: initial;\n    -webkit-box-sizing: initial;\n    -moz-box-sizing: initial;\n}\n\n.guify-panel input {\n    font-family: 'Hack';\n    font-size: 11px;\n    display: inline;\n}\n\n.guify-panel a {\n    color: inherit;\n    text-decoration: none;\n}\n\n.guify-panel-toggle-button {\n    position: absolute;\n    top: 0;\n    margin: 0;\n    padding: 0;\n    width: 15px;\n    height: 15px;\n    line-height: 15px;\n    text-align: center;\n    border: none;\n    cursor: pointer;\n    font-family: inherit;\n    color: ",";\n    background-color: ",";\n\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n\n}\n\n/* Open/Close button styling */\n.guify-panel-toggle-button svg {\n    fill-opacity: 0;\n    stroke-width: 3;\n    stroke: ",";\n}\n\n/* Remove browser default outlines since we're providing our own */\n.guify-panel-toggle-button:focus {\n    outline:none;\n}\n.guify-panel-toggle-button::-moz-focus-inner {\n    border: 0;\n}\n\n.guify-panel-toggle-button:hover,\n.guify-panel-toggle-button:focus {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-panel-toggle-button:active {\n    color: ",";\n    background-color: ",";\n}\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.panelBackground,i.theme.sizing.componentSpacing,i.theme.colors.textPrimary,i.theme.colors.componentBackground,i.theme.colors.componentForeground,i.theme.colors.textHover,i.theme.colors.componentForeground,i.theme.colors.textActive,i.theme.colors.componentActive)},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,n,t){var o=e.appendChild(document.createElement("div"));return o.innerHTML=n,(0,i.default)(o,{width:"100%",textAlign:"center",color:t.colors.textSecondary,height:"20px",marginBottom:"4px"}),o};var o=t(0),i=function(e){return e&&e.__esModule?e:{default:e}}(o);e.exports=n.default},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0}),n.ToastArea=void 0;var i=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(0),a=function(e){return e&&e.__esModule?e:{default:e}}(r);t(1),n.ToastArea=function(){function e(n,i){o(this,e),this.opts=i,this.styles=t(78),this.element=n.appendChild(document.createElement("div")),this.element.classList.add(this.styles["guify-toast-area"]),(0,a.default)(this.element,{position:"absolute",width:"100%"})}return i(e,[{key:"CreateToast",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5e3,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;console.log("[Toast] "+e);var o=this.element.appendChild(document.createElement("div"));o.classList.add(this.styles["guify-toast-notification"]),o.setAttribute("aria-live","polite"),o.innerHTML=e,(0,a.default)(o,{});var i=o.appendChild(document.createElement("button"));i.innerHTML="&#10006;",i.classList.add(this.styles["guify-toast-close-button"]);var r=void 0,s=function(){o.blur(),(0,a.default)(o,{opacity:"0"}),clearTimeout(r),r=setTimeout(function(){o&&o.parentNode.removeChild(o)},t)};r=setTimeout(s,n),i.onclick=s}}]),e}()},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-toast-notification {\n    box-sizing: border-box;\n    color: theme.colors.text1;\n    position: relative;\n    width: 100%;\n    /* height: 20px; */\n    padding: 8px;\n    padding-left: 20px;\n    padding-right: 20px;\n    text-align: center;\n    font-family: 'Hack', monospace;\n    font-size: 11px;\n}\n\n.guify-toast-area .guify-toast-notification:nth-child(odd) {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-toast-area .guify-toast-notification:nth-child(even) {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-toast-close-button {\n    color: ",";\n    background: transparent;\n    position: absolute;\n    textAlign: center;\n    margin-top: auto;\n    margin-bottom: auto;\n    border: none;\n    cursor: pointer;\n    top: 0;\n    bottom: 0;\n    right: 8px;\n}\n\n"],["\n\n.guify-toast-notification {\n    box-sizing: border-box;\n    color: theme.colors.text1;\n    position: relative;\n    width: 100%;\n    /* height: 20px; */\n    padding: 8px;\n    padding-left: 20px;\n    padding-right: 20px;\n    text-align: center;\n    font-family: 'Hack', monospace;\n    font-size: 11px;\n}\n\n.guify-toast-area .guify-toast-notification:nth-child(odd) {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-toast-area .guify-toast-notification:nth-child(even) {\n    color: ",";\n    background-color: ",";\n}\n\n.guify-toast-close-button {\n    color: ",";\n    background: transparent;\n    position: absolute;\n    textAlign: center;\n    margin-top: auto;\n    margin-bottom: auto;\n    border: none;\n    cursor: pointer;\n    top: 0;\n    bottom: 0;\n    right: 8px;\n}\n\n"]),i=t(1),r=t(3);e.exports=r(o,i.theme.colors.textPrimary,i.theme.colors.panelBackground,i.theme.colors.textPrimary,i.theme.colors.menuBarBackground,i.theme.colors.textPrimary)},function(e,n,t){"use strict";var o=function(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n\n.guify-container {\n    position: relative;\n    left: 0;\n    width: 100%;\n    font-size: 11px;\n    z-index: 9999;\n}\n\n"],["\n\n.guify-container {\n    position: relative;\n    left: 0;\n    width: 100%;\n    font-size: 11px;\n    z-index: 9999;\n}\n\n"]),i=(t(1),t(3));e.exports=i(o)}])});
/******/
(function() { // webpackBootstrap
    /******/
    "use strict";
    /******/
    var __webpack_modules__ = ({
        /***/
        "./src/Cow.js":
            /*!********************!*\
              !*** ./src/Cow.js ***!
              \********************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _config_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./config.json */ "./src/config.json");
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
                /* harmony import */
                var _modules_entities_Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./modules/entities/Player.js */ "./src/modules/entities/Player.js");
                /* harmony import */
                var _modules_plugins_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./modules/plugins/index.js */ "./src/modules/plugins/index.js");
                /* harmony import */
                var _game_configs_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./game_configs/index.js */ "./src/game_configs/index.js");
                class Cow {
                    constructor() {
                        this.config = _config_json__WEBPACK_IMPORTED_MODULE_0__
                        this.items = _game_configs_index_js__WEBPACK_IMPORTED_MODULE_4__
                        this.codec = _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec
                        this.socket = _constants_js__WEBPACK_IMPORTED_MODULE_1__.socket
                        this.playersManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.playersManager
                        this.objectsManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.objectsManager
                        this.animalsManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.animalsManager
                        this.ticker = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ticker
                        this.camera = _constants_js__WEBPACK_IMPORTED_MODULE_1__.camera
                        this.renderer = _constants_js__WEBPACK_IMPORTED_MODULE_1__.renderer
                        this.input = _constants_js__WEBPACK_IMPORTED_MODULE_1__.input
                        this.placement = _constants_js__WEBPACK_IMPORTED_MODULE_1__.placement
                        this.player = void 0
                        this.inGame = false
                        this._plugins = new Map([
                            ["auto-reconect", new _modules_plugins_index_js__WEBPACK_IMPORTED_MODULE_3__.AutoReconect()]
                        ])
                    }
                    onPacket(packetName, listener) {
                        this.socket.handler.onPacket(packetName, listener)
                    }
                    onKeyboard(keyName, listener, options) {
                        return this.input.keyboard.on(keyName, listener, options)
                    }
                    sendPacket(packetName, ...content) {
                        this.socket.send(packetName, content)
                    }
                    placeItem(groupIndex, {
                        angle
                    } = {}) {
                        this.placement.placeItem(groupIndex, {
                            angle
                        })
                    }
                    addRender(renderKey, renderFunc) {
                        this.renderer.addRender(renderKey, renderFunc)
                    }
                    setInGame(_inGame) {
                        if (typeof _inGame !== 'boolean') return
                        this._inGame = _inGame
                    }
                    getNearPlayer(checkEnemy) {
                        if (!this.player) return
                        const {
                            CowUtils
                        } = window
                        let players = this.playersManager.list
                        if (checkEnemy) {
                            players = players.filter((player) => !player.isAlly)
                        }
                        return players.sort((a, b) => {
                            a = CowUtils.getDistance(a, this.player)
                            b = CowUtils.getDistance(b, this.player)
                            return a - b
                        })[0]
                    }
                    getNearEnemy() {
                        return this.getNearPlayer(true)
                    }
                    setPlayer(player) {
                        this.camera.setTo(player.x, player.y)
                        if (!(player instanceof _modules_entities_Player_js__WEBPACK_IMPORTED_MODULE_2__["default"]) || typeof this.player !== 'undefined') return
                        this.player = player
                    }
                    setPluginState(pluginName, state) {
                        if (!this._plugins.has(pluginName)) return
                        const plugin = this._plugins.get(pluginName)
                        plugin.setActiveState(state)
                    }
                    executePlugin(pluginName) {
                        if (!this._plugins.has(pluginName)) return
                        const plugin = this._plugins.get(pluginName)
                        if (!plugin.isActiveState) return
                        plugin.execute()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Cow);
                /***/
            }),
        /***/
        "./src/constants.js":
            /*!**************************!*\
              !*** ./src/constants.js ***!
              \**************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    animalsManager: function() {
                        return /* binding */ animalsManager;
                    },
                    /* harmony export */
                    camera: function() {
                        return /* binding */ camera;
                    },
                    /* harmony export */
                    codec: function() {
                        return /* binding */ codec;
                    },
                    /* harmony export */
                    cow: function() {
                        return /* binding */ cow;
                    },
                    /* harmony export */
                    input: function() {
                        return /* binding */ input;
                    },
                    /* harmony export */
                    objectsManager: function() {
                        return /* binding */ objectsManager;
                    },
                    /* harmony export */
                    placement: function() {
                        return /* binding */ placement;
                    },
                    /* harmony export */
                    playersManager: function() {
                        return /* binding */ playersManager;
                    },
                    /* harmony export */
                    renderer: function() {
                        return /* binding */ renderer;
                    },
                    /* harmony export */
                    socket: function() {
                        return /* binding */ socket;
                    },
                    /* harmony export */
                    ticker: function() {
                        return /* binding */ ticker;
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _Cow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Cow.js */ "./src/Cow.js");
                /* harmony import */
                var _modules_Placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./modules/Placement.js */ "./src/modules/Placement.js");
                /* harmony import */
                var _modules_Ticker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./modules/Ticker.js */ "./src/modules/Ticker.js");
                /* harmony import */
                var _modules_input_Input_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./modules/input/Input.js */ "./src/modules/input/Input.js");
                /* harmony import */
                var _modules_managers_AnimalsManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./modules/managers/AnimalsManager.js */ "./src/modules/managers/AnimalsManager.js");
                /* harmony import */
                var _modules_managers_ObjectsManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./modules/managers/ObjectsManager.js */ "./src/modules/managers/ObjectsManager.js");
                /* harmony import */
                var _modules_managers_PlayersManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./modules/managers/PlayersManager.js */ "./src/modules/managers/PlayersManager.js");
                /* harmony import */
                var _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./modules/render/Camera.js */ "./src/modules/render/Camera.js");
                /* harmony import */
                var _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./modules/render/Renderer.js */ "./src/modules/render/Renderer.js");
                /* harmony import */
                var _modules_socket_Socket_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./modules/socket/Socket.js */ "./src/modules/socket/Socket.js");
                const codec = {
                    decoder: void 0,
                    encoder: void 0,
                    isReady: false
                }
                const socket = new _modules_socket_Socket_js__WEBPACK_IMPORTED_MODULE_9__["default"]()
                const playersManager = new _modules_managers_PlayersManager_js__WEBPACK_IMPORTED_MODULE_6__["default"]()
                const objectsManager = new _modules_managers_ObjectsManager_js__WEBPACK_IMPORTED_MODULE_5__["default"]()
                const animalsManager = new _modules_managers_AnimalsManager_js__WEBPACK_IMPORTED_MODULE_4__["default"]()
                const ticker = new _modules_Ticker_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                const camera = new _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
                const renderer = new _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__["default"]()
                const input = new _modules_input_Input_js__WEBPACK_IMPORTED_MODULE_3__["default"]()
                const placement = new _modules_Placement_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
                const cow = new _Cow_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
                /***/
            }),
        /***/
        "./src/game_configs/accessories.js":
            /*!*****************************************!*\
              !*** ./src/game_configs/accessories.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                const accessories = [{
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
                accessories.searchById = function(id) {
                    return this.find((accessory) => accessory.id === id)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (accessories);
                /***/
            }),
        /***/
        "./src/game_configs/aiTypes.js":
            /*!*************************************!*\
              !*** ./src/game_configs/aiTypes.js ***!
              \*************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    src: "cow_1",
                    killScore: 150,
                    health: 500,
                    weightM: 0.8,
                    speed: 0.00095,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 50]
                }, {
                    id: 1,
                    src: "pig_1",
                    killScore: 200,
                    health: 800,
                    weightM: 0.6,
                    speed: 0.00085,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 80]
                }, {
                    id: 2,
                    name: "Bull",
                    src: "bull_2",
                    hostile: true,
                    dmg: 20,
                    killScore: 1000,
                    health: 1800,
                    weightM: 0.5,
                    speed: 0.00094,
                    turnSpeed: 0.00074,
                    scale: 78,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 3,
                    name: "Bully",
                    src: "bull_1",
                    hostile: true,
                    dmg: 20,
                    killScore: 2000,
                    health: 2800,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.0008,
                    scale: 90,
                    viewRange: 900,
                    chargePlayer: true,
                    drop: ["food", 400]
                }, {
                    id: 4,
                    name: "Wolf",
                    src: "wolf_1",
                    hostile: true,
                    dmg: 8,
                    killScore: 500,
                    health: 300,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.002,
                    scale: 84,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 200]
                }, {
                    id: 5,
                    name: "Quack",
                    src: "chicken_1",
                    dmg: 8,
                    killScore: 2000,
                    noTrap: true,
                    health: 300,
                    weightM: 0.2,
                    speed: 0.0018,
                    turnSpeed: 0.006,
                    scale: 70,
                    drop: ["food", 100]
                }, {
                    id: 6,
                    name: "MOOSTAFA",
                    nameScale: 50,
                    src: "enemy",
                    hostile: true,
                    dontRun: true,
                    fixedSpawn: true,
                    spawnDelay: 60000,
                    noTrap: true,
                    colDmg: 100,
                    dmg: 40,
                    killScore: 8000,
                    health: 18000,
                    weightM: 0.4,
                    speed: 0.0007,
                    turnSpeed: 0.01,
                    scale: 80,
                    spriteMlt: 1.8,
                    leapForce: 0.9,
                    viewRange: 1000,
                    hitRange: 210,
                    hitDelay: 1000,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 7,
                    name: "Treasure",
                    hostile: true,
                    nameScale: 35,
                    src: "crate_1",
                    fixedSpawn: true,
                    spawnDelay: 120000,
                    colDmg: 200,
                    killScore: 5000,
                    health: 20000,
                    weightM: 0.1,
                    speed: 0.0,
                    turnSpeed: 0.0,
                    scale: 70,
                    spriteMlt: 1.0
                }, {
                    id: 8,
                    name: "MOOFIE",
                    src: "wolf_2",
                    hostile: true,
                    fixedSpawn: true,
                    dontRun: true,
                    hitScare: 4,
                    spawnDelay: 30000,
                    noTrap: true,
                    nameScale: 35,
                    dmg: 10,
                    colDmg: 100,
                    killScore: 3000,
                    health: 7000,
                    weightM: 0.45,
                    speed: 0.0015,
                    turnSpeed: 0.002,
                    scale: 90,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 1000]
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/groups.js":
            /*!************************************!*\
              !*** ./src/game_configs/groups.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
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
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/hats.js":
            /*!**********************************!*\
              !*** ./src/game_configs/hats.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                const hats = [{
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
                hats.searchById = function(id) {
                    return this.find((hat) => hat.id === id)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (hats);
                /***/
            }),
        /***/
        "./src/game_configs/index.js":
            /*!***********************************!*\
              !*** ./src/game_configs/index.js ***!
              \***********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    accessories: function() {
                        return /* reexport safe */ _accessories_js__WEBPACK_IMPORTED_MODULE_0__["default"];
                    },
                    /* harmony export */
                    aiTypes: function() {
                        return /* reexport safe */ _aiTypes_js__WEBPACK_IMPORTED_MODULE_1__["default"];
                    },
                    /* harmony export */
                    groups: function() {
                        return /* reexport safe */ _groups_js__WEBPACK_IMPORTED_MODULE_2__["default"];
                    },
                    /* harmony export */
                    hats: function() {
                        return /* reexport safe */ _hats_js__WEBPACK_IMPORTED_MODULE_3__["default"];
                    },
                    /* harmony export */
                    list: function() {
                        return /* reexport safe */ _list_js__WEBPACK_IMPORTED_MODULE_4__["default"];
                    },
                    /* harmony export */
                    projectiles: function() {
                        return /* reexport safe */ _projectiles_js__WEBPACK_IMPORTED_MODULE_5__["default"];
                    },
                    /* harmony export */
                    variants: function() {
                        return /* reexport safe */ _variants_js__WEBPACK_IMPORTED_MODULE_6__["default"];
                    },
                    /* harmony export */
                    weapons: function() {
                        return /* reexport safe */ _weapons_js__WEBPACK_IMPORTED_MODULE_7__["default"];
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _accessories_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./accessories.js */ "./src/game_configs/accessories.js");
                /* harmony import */
                var _aiTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./aiTypes.js */ "./src/game_configs/aiTypes.js");
                /* harmony import */
                var _groups_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./groups.js */ "./src/game_configs/groups.js");
                /* harmony import */
                var _hats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./hats.js */ "./src/game_configs/hats.js");
                /* harmony import */
                var _list_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./list.js */ "./src/game_configs/list.js");
                /* harmony import */
                var _projectiles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./projectiles.js */ "./src/game_configs/projectiles.js");
                /* harmony import */
                var _variants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./variants.js */ "./src/game_configs/variants.js");
                /* harmony import */
                var _weapons_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./weapons.js */ "./src/game_configs/weapons.js");
                /***/
            }),
        /***/
        "./src/game_configs/list.js":
            /*!**********************************!*\
              !*** ./src/game_configs/list.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _groups_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./groups.js */ "./src/game_configs/groups.js");
                const list = [{
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
                    name: "castle wall",
                    desc: "provides powerful protection for your village",
                    req: ["stone", 35],
                    health: 1500,
                    scale: 52,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][4],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][11],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][5],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][6],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][7],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][8],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][9],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][10],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][12],
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
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][13],
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
                }]
                for (var i = 0; i < list.length; ++i) {
                    list[i].id = i
                    if (list[i].pre) {
                        list[i].pre = i - list[i].pre
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (list);
                /***/
            }),
        /***/
        "./src/game_configs/projectiles.js":
            /*!*****************************************!*\
              !*** ./src/game_configs/projectiles.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
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
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/variants.js":
            /*!**************************************!*\
              !*** ./src/game_configs/variants.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    src: "",
                    xp: 0,
                    val: 1
                }, {
                    id: 1,
                    src: "_g",
                    xp: 3000,
                    val: 1.1
                }, {
                    id: 2,
                    src: "_d",
                    xp: 7000,
                    val: 1.18
                }, {
                    id: 3,
                    src: "_r",
                    poison: true,
                    xp: 12000,
                    val: 1.18
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/weapons.js":
            /*!*************************************!*\
              !*** ./src/game_configs/weapons.js ***!
              \*************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
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
                }]);
                /***/
            }),
        /***/
        "./src/hooks.js":
            /*!**********************!*\
              !*** ./src/hooks.js ***!
              \**********************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
                /* harmony import */
                var _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./utils/CowUtils.js */ "./src/utils/CowUtils.js");
                // define codec
                _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].createHook({
                    property: "extensionCodec",
                    setter: (instance) => {
                        if (typeof _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder !== 'undefined') {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.decoder = instance
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.isReady = true
                            return
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder = instance
                    }
                })
                // define websocket
                WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
                    apply(target, instance, args) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.isReady) {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.setWebSocket(instance)
                        }
                        return target.apply(instance, args)
                    }
                })
                /***/
            }),
        /***/
        "./src/modules/Placement.js":
            /*!**********************************!*\
              !*** ./src/modules/Placement.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../constants.js */ "./src/constants.js");
                class Placement {
                    constructor() {
                        this.delay = 0
                        this.lastPlaceTick = 0
                    }
                    setDelay(_delay) {
                        this.delay = _delay
                    }
                    sendPlace(id, angle) {
                        const timeSincePlace = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks - this.lastPlaceTick
                        if (timeSincePlace < this.delay) return
                        const {
                            packets
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.SELECT_BUILD, id)
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.ATTACK_STATE, 1, angle)
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.ATTACK_STATE, 0, angle)
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.SELECT_BUILD, _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.weapons[0], true)
                        this.lastPlaceTick = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks
                    }
                    placeItem(groupIndex, {
                        angle
                    } = {}) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive) return
                        const itemIndex = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.items[groupIndex]
                        if (typeof itemIndex === 'undefined') return
                        const item = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.list[itemIndex]
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.isCanBuild(item)) return
                        angle = typeof angle === 'undefined' ? _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.lookAngle : angle
                        const scale = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.scale + item.scale + (item.placeOffset || 0)
                        const placeX = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.x2 + (scale * Math.cos(angle))
                        const placeY = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.y2 + (scale * Math.sin(angle))
                        const isCanPlace = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.checkItemLocation(placeX, placeY, item.scale, 0.6, item.id, false)
                        if (!(item.consume && (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.skin && _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.skin?.noEat)) && (item.consume || isCanPlace)) {
                            this.sendPlace(item.id, angle)
                        }
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Placement);
                /***/
            }),
        /***/
        "./src/modules/Ticker.js":
            /*!*******************************!*\
              !*** ./src/modules/Ticker.js ***!
              \*******************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Ticker {
                    constructor() {
                        this.ticks = 0
                        this.tickTasks = []
                        this.isClear = false
                    }
                    clear() {
                        this.tickTasks = []
                        this.isClear = true
                    }
                    addTickTask(callback) {
                        if (!(callback instanceof Function)) return
                        this.tasks.push(callback)
                    }
                    updateTicks() {
                        this.ticks += 1
                        if (this.isClear) {
                            this.isClear = false
                            return
                        }
                        if (this.tickTasks.length) {
                            this.tickTasks[0]()
                            this.tickTasks.shift()
                        }
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Ticker);
                /***/
            }),
        /***/
        "./src/modules/entities/Animal.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Animal.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Entity.js */ "./src/modules/entities/Entity.js");
                class Animal extends _Entity_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
                    constructor({
                        sid,
                        index,
                        x,
                        y,
                        dir
                    }) {
                        super({
                            sid
                        })
                        const {
                            CowUtils
                        } = window
                        const data = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.aiTypes[index]
                        if (!data) data = {}
                        this.sid = sid
                        this.x = x
                        this.y = y
                        this.name = data.name || data.src
                        this.startX = data?.fixedSpawn ? x : null
                        this.startY = data?.fixedSpawn ? y : null
                        this.xVel = 0
                        this.yVel = 0
                        this.zIndex = 0
                        this.dir = CowUtils.fixAngle(dir)
                        this.dirPlus = 0
                        this.index = index
                        this.src = data.src
                        this.weightM = data.weightM
                        this.speed = data.speed
                        this.killScore = data.killScore
                        this.turnSpeed = data.turnSpeed
                        this.scale = data.scale
                        this.maxHealth = data.health
                        this.leapForce = data.leapForce
                        this.health = this.maxHealth
                        this.chargePlayer = data.chargePlayer
                        this.viewRange = data.viewRange
                        this.drop = data.drop
                        this.dmg = data.dmg
                        this.hostile = data.hostile
                        this.dontRun = data.dontRun
                        this.hitRange = data.hitRange
                        this.hitDelay = data.hitDelay
                        this.hitScare = data.hitScare
                        this.spriteMlt = data.spriteMlt
                        this.nameScale = data.nameScale
                        this.colDmg = data.colDmg
                        this.noTrap = data.noTrap
                        this.spawnDelay = data.spawnDelay
                        this.hitWait = 0
                        this.waitCount = 1000
                        this.moveCount = 0
                        this.targetDir = 0
                        this.runFrom = null
                        this.chargeTarget = null
                        this.dmgOverTime = {}
                        this.visible = true
                    }
                    disable() {
                        this.visible = false
                    }
                    setTickData(data) {
                        const time = Date.now()
                        this.index = data[1]
                        this.time1 = (this.time2 === undefined) ? time : this.time2
                        this.time2 = time
                        this.x1 = this.x
                        this.y1 = this.y
                        this.x2 = data[2]
                        this.y2 = data[3]
                        this.dir1 = (this.dir2 === undefined) ? data[4] : this.dir2
                        this.dir2 = data[4]
                        this.dir = this.dir2
                        this.health = data[5]
                        this.dt = 0
                        this.visible = true
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Animal);
                /***/
            }),
        /***/
        "./src/modules/entities/Entity.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Entity.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Entity {
                    constructor({
                        id,
                        sid
                    }) {
                        this.id = id
                        this.sid = sid
                        this.name = "unknown"
                        this.dt = 0
                        this.x = 0
                        this.y = 0
                        this.x1 = this.x
                        this.y1 = this.y
                        this.x2 = this.x1
                        this.y2 = this.y1
                        this.dir = 0
                        this.dir1 = 0
                        this.dir2 = this.dir1
                        this.health = 100
                        this.maxHealth = this.health
                        this.scale = 35
                        this.zIndex = 0
                    }
                    get renderX() {
                        return this.x - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.xOffset
                    }
                    get renderY() {
                        return this.y - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.yOffset
                    }
                    setInitData(data) {
                        if (!Array.isArray(data) || !data?.length) return
                        this.id = data[0]
                        this.sid = data[1]
                        this.name = data[2]
                        this.x = data[3]
                        this.y = data[4]
                        this.dir = data[5]
                        this.health = data[6]
                        this.maxHealth = data[7]
                        this.scale = data[8]
                        if (typeof data[9] !== 'undefined') {
                            this.skinColor = data[9]
                        }
                        this.visible = false
                    }
                    setTo(x, y) {
                        if (typeof x !== 'number' || typeof y !== 'number') return
                        if (isNaN(x) || isNaN(y)) return
                        this.x = x
                        this.y = y
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Entity);
                /***/
            }),
        /***/
        "./src/modules/entities/GameObject.js":
            /*!********************************************!*\
              !*** ./src/modules/entities/GameObject.js ***!
              \********************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants */ "./src/constants.js");
                class GameObject {
                    constructor({
                        sid
                    }) {
                        const {
                            CowUtils
                        } = window
                        this.sid = sid
                        this.init = function(x, y, dir, scale, type, data, owner) {
                            data = typeof data === 'undefined' ? {} : data
                            this.x = x
                            this.y = y
                            this.dir = CowUtils.fixAngle(dir)
                            this.xWiggle = 0
                            this.yWiggle = 0
                            this.scale = scale
                            this.type = type
                            this.id = data.id
                            this.owner = owner
                            this.name = data.name
                            this.isItem = Boolean(this.id !== undefined)
                            this.group = data.group
                            this.health = data.health
                            this.maxHealth = data.health
                            this.layer = this.group !== undefined ? this.group.layer : this.type === 0 ? 3 : this.type === 2 ? 0 : this.type === 4 ? -1 : 2
                            this.sentTo = {}
                            this.gridLocations = []
                            this.doUpdate = data.doUpdate
                            this.colDiv = data.colDiv || 1
                            this.blocker = data.blocker
                            this.ignoreCollision = data.ignoreCollision
                            this.dontGather = data.dontGather
                            this.hideFromEnemy = data.hideFromEnemy
                            this.friction = data.friction
                            this.projDmg = data.projDmg
                            this.dmg = data.dmg
                            this.pDmg = data.pDmg
                            this.pps = data.pps
                            this.zIndex = data.zIndex || 0
                            this.turnSpeed = data.turnSpeed
                            this.req = data.req
                            this.trap = data.trap
                            this.healCol = data.healCol
                            this.teleport = data.teleport
                            this.boostSpeed = data.boostSpeed
                            this.projectile = data.projectile
                            this.shootRange = data.shootRange
                            this.shootRate = data.shootRate
                            this.shootCount = this.shootRate
                            this.spawnPoint = data.spawnPoint
                            this.visible = true
                            this.active = true
                        }
                    }
                    get renderX() {
                        return this.x + Number(this.xWiggle) - _constants__WEBPACK_IMPORTED_MODULE_0__.cow.camera.xOffset
                    }
                    get renderY() {
                        return this.y + Number(this.yWiggle) - _constants__WEBPACK_IMPORTED_MODULE_0__.cow.camera.yOffset
                    }
                    setVisible(_visible) {
                        if (typeof _visible !== 'boolean') return
                        this.visible = _visible
                    }
                    setActive(_active) {
                        if (typeof _active !== 'boolean') return
                        this.active = _active
                    }
                    getScale(scaleMult, hasColDiv) {
                        scaleMult = scaleMult || 1
                        const isVolume = this.isItem || this.type == 2 || this.type == 3 || this.type == 4
                        return this.scale * (isVolume ? 1 : (0.6 * scaleMult)) * (hasColDiv ? 1 : this.colDiv)
                    }
                    changeHealth(amount) {
                        amount = parseInt(amount)
                        this.health += amount
                        return this.health <= 0
                    }
                    doWiggle(dir) {
                        this.xWiggle += _constants__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherWiggle * Math.cos(dir)
                        this.yWiggle += _constants__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherWiggle * Math.sin(dir)
                    }
                    update() {
                        if (!this.visible) return
                        const {
                            renderer
                        } = _constants__WEBPACK_IMPORTED_MODULE_0__.cow
                        if (this.xWiggle) {
                            this.xWiggle *= Math.pow(0.99, renderer.delta)
                        }
                        if (this.yWiggle) {
                            this.yWiggle *= Math.pow(0.99, renderer.delta)
                        }
                        if (this.turnSpeed) {
                            this.dir += this.turnSpeed * renderer.delta
                        }
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (GameObject);
                /***/
            }),
        /***/
        "./src/modules/entities/Player.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Player.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Entity.js */ "./src/modules/entities/Entity.js");
                /* harmony import */
                var _reloads_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./reloads.js */ "./src/modules/entities/reloads.js");
                class Player extends _Entity_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
                    constructor({
                        id,
                        sid
                    }) {
                        super({
                            id,
                            sid
                        })
                        this.skinColor = void 0
                        this.buildIndex = -1
                        this.weaponIndex = 0
                        this.weaponVariant = 0
                        this.team = ""
                        this.skinIndex = 0
                        this.tailIndex = 0
                        this.isLeader = false
                        this.iconIndex = 0
                        this.items = [0, 3, 6, 10]
                        this.weapons = [0]
                        this.skins = {}
                        this.tails = {}
                        const defineFreeCaps = (config, capType) => {
                            for (let i = 0; i < config.length; ++i) {
                                const cap = config[i]
                                if (cap.price > 0) continue
                                this[capType][cap.id] = true
                            }
                        }
                        defineFreeCaps(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.hats, "skins")
                        defineFreeCaps(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.accessories, "tails")
                        this.itemCounts = {}
                        this.gold = 100
                        this.stone = 100
                        this.wood = 100
                        this.food = 100
                        this.reloads = new _reloads_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                        this.maxXP = 300
                        this.XP = 0
                        this.age = 1
                        this.kills = 0
                        this.upgrAge = 2
                        this.upgradePoints = 0
                        this.hitTime = null
                        this.shameCount = 0
                        this.shameTimer = 0
                        this.speed = 0
                        this.moveDir = 0
                        this.isPlayer = true
                        this.lastDeath = {}
                        this.createdInstance = {}
                        this._updateCreatedInstance()
                    }
                    get isMe() {
                        return Boolean(this.sid === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.sid && _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive)
                    }
                    get isAlly() {
                        return Boolean((this.sid === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.sid) || (this.team && this.team === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.team))
                    }
                    get weapon() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.weapons[this.weaponIndex]
                    }
                    get lookAngle() {
                        return this.isMe ? _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.input.mouse.angle : (this.dir || this.dir2)
                    }
                    get skin() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.hats.searchById(this.skinIndex)
                    }
                    get tail() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.accessories.searchById(this.tailIndex)
                    }
                    _updateCreatedInstance() {
                        this.createdInstance = {}
                        const ignoreKeys = ["skins", "tails", "sid", "id", "lastDeath", "reloads"]
                        for (const key in this) {
                            if (key === "createdInstance") continue
                            if (ignoreKeys.includes(key)) continue
                            this.createdInstance[key] = this[key]
                        }
                    }
                    spawn() {
                        this.alive = true
                        if (!this.isMe) return
                        for (const key in this.createdInstance) {
                            const value = this.createdInstance[key]
                            this[key] = value
                        }
                        this._updateCreatedInstance()
                        this.reloads = new _reloads_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setInGame(true)
                    }
                    kill() {
                        if (!this.isMe) return
                        this.alive = false
                        this.lastDeath = {
                            x: this.x,
                            y: this.y
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setInGame(false)
                    }
                    disable() {
                        this.visible = false
                    }
                    hasResources(item) {
                        for (let i = 0; i < item.req.length; i += 2) {
                            if (this[item.req[i]] >= Math.round(item.req[i + 1])) continue
                            return false
                        }
                        return true
                    }
                    isCanBuild(item) {
                        return this.hasResources(item)
                    }
                    setTickData(data) {
                        if (!Array.isArray(data) || !data?.length) return
                        const {
                            CowUtils
                        } = window
                        this.dt = 0
                        this.x1 = this.x
                        this.y1 = this.y
                        this.speed = CowUtils.getDistance(this.x2, this.y2, data[1], data[2])
                        this.x2 = data[1]
                        this.y2 = data[2]
                        this.moveDir = CowUtils.getDirection(this.x1, this.y1, this.x2, this.y2)
                        this.dir1 = this.dir2 !== null ? this.dir2 : data[3]
                        this.dir2 = data[3]
                        this.time1 = this.time2 !== null ? this.time2 : Date.now()
                        this.time2 = Date.now()
                        this.buildIndex = data[4]
                        this.weaponIndex = data[5]
                        this.weaponVariant = data[6]
                        this.team = data[7]
                        this.isLeader = data[8]
                        this.skinIndex = data[9]
                        this.tailIndex = data[10]
                        this.iconIndex = data[11]
                        this.zIndex = data[12]
                        this.visible = true
                        this.tick()
                    }
                    updateShame() {
                        const timeSinceHit = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks - this.hitTime
                        if (timeSinceHit < 2) {
                            this.shameCount += 1
                            if (this.shameCount >= 8) {
                                this.shameTimer = 30000
                                this.shameCount = 0
                            }
                        } else {
                            this.shameCount = Math.max(0, this.shameCount - 2)
                        }
                    }
                    changeHealth(_health) {
                        if (this.health > _health) {
                            this.updateShame()
                            this.hitTime = 0
                        } else {
                            this.hitTime = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks
                        }
                        this.health = _health
                    }
                    onGather(didHit, weaponIndex) {
                        const reloadType = weaponIndex > 8 ? "secondary" : "primary"
                        const currentReload = this.reloads[reloadType]
                        currentReload.count = 0
                        currentReload.date = Date.now()
                        if (didHit) {
                            const {
                                CowUtils
                            } = window
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.eachVisible((gameObject) => {
                                if (!gameObject.isItem || gameObject.dontGather) return
                                const scale = gameObject.scale || gameObject.getScale()
                                const distance = CowUtils.getDistance(this, gameObject) - scale
                                const angle = CowUtils.getDirection(gameObject, this)
                                const angleDistance = CowUtils.getAngleDist(angle, this.dir2)
                                const isInAngle = angleDistance <= _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherAngle
                                const isInRange = distance <= this.weapon.range
                                if (!isInAngle || !isInRange) return
                                const damage = this.weapon.dmg * _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.variants[this.weaponVariant].val
                                const damageAmount = damage * (this.weapon.sDmg || 1) * (this.skin?.id === 40 ? 3.3 : 1)
                                gameObject.changeHealth(-damageAmount)
                            })
                        }
                    }
                    updateReloads() {
                        const reloadType = this.weaponIndex > 8 ? "secondary" : "primary"
                        const currentReload = this.reloads[reloadType]
                        if (currentReload.id != this.weapon.id) {
                            currentReload.setData(this.weapon, this.weaponVariant)
                        }
                        if (this.weaponVariant != currentReload.rarity) {
                            currentReload.rarity = this.weaponVariant
                        }
                        if (this.weaponIndex === currentReload.id) {
                            if (currentReload.count < currentReload.max && this.buildIndex === -1) {
                                currentReload.add()
                            }
                        }
                        this.reloads[reloadType] = currentReload
                        if (this.reloads.turret.count < this.reloads.turret.max) {
                            this.reloads.turret.add()
                        }
                    }
                    tick() {
                        this.updateReloads()
                        if (this.skinIndex != 45) {
                            if (this.shameCount === 8) {
                                this.shameTimer = 0
                                this.shameCont = 0
                            }
                            if (this.shameTimer > 0) this.shameTimer = 0
                        } else {
                            if (this.shameCount != 8) {
                                this.shameCount = 8
                                this.shameTimer = 270
                            }
                            if (this.shameTimer > 0) this.shameTimer -= 1
                        }
                    }
                    canSee(other) {
                        if (!other) return false
                        const dx = Math.abs(other.x - this.x) - other.scale
                        const dy = Math.abs(other.y - this.y) - other.scale
                        return dx <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenWidth / 2) * 1.3 && dy <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenHeight / 2) * 1.3
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Player);
                /***/
            }),
        /***/
        "./src/modules/entities/reloads.js":
            /*!*****************************************!*\
              !*** ./src/modules/entities/reloads.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Reload {
                    constructor(id, speed, ticks) {
                        const tick = 111
                        ticks = ticks || Math.ceil(speed / tick)
                        this.id = id
                        this.count = ticks
                        this.date = 0
                        this.date2 = this.date
                        this.max = ticks
                        this.max2 = speed
                        this.rarity = 0
                        this.done = true
                        this.active = false
                        const {
                            CowUtils
                        } = window
                        this._default = CowUtils.removeProto(this)
                    }
                    get dif() {
                        return this.count / this.max
                    }
                    get smoothValue() {
                        if (this.done) return 1
                        return (this.date2 - this.date) / this.max2
                    }
                    setData(weapon, weaponVariant) {
                        this.id = weapon.id
                        this.max = weapon.speed ? Math.ceil(weapon.speed / (1e3 / 9)) : 0
                        this.max2 = weapon.speed
                        this.count = parseInt(this.max)
                        this.done = true
                        this.rarity = weaponVariant
                        this.active = true
                    }
                    add() {
                        this.count += 1
                        this.count = parseInt(this.count)
                        this.done = this.count === this.max
                    }
                    clear() {
                        this.count = 0
                        this.done = false
                        this.date = Date.now()
                    }
                }
                class Reloads {
                    constructor() {
                        this.primary = new Reload(5, 300),
                            this.secondary = new Reload(15, 1500),
                            this.turret = new Reload(null, 2500, 23)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Reloads);
                /***/
            }),
        /***/
        "./src/modules/input/Input.js":
            /*!************************************!*\
              !*** ./src/modules/input/Input.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Keyboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Keyboard.js */ "./src/modules/input/Keyboard.js");
                /* harmony import */
                var _Mouse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Mouse.js */ "./src/modules/input/Mouse.js");
                class Input {
                    constructor() {
                        this.keyboard = new _Keyboard_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
                        this.mouse = new _Mouse_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Input);
                /***/
            }),
        /***/
        "./src/modules/input/Keyboard.js":
            /*!***************************************!*\
              !*** ./src/modules/input/Keyboard.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Keyboard {
                    constructor() {
                        this.activeKeys = new Map()
                        this.events = new Map()
                        this.init()
                    }
                    on(keyName, listener, options = {
                        repeat: true
                    }) {
                        if (typeof keyName !== 'string') return
                        if (!(listener instanceof Function)) return
                        if (!this.events.has(keyName)) {
                            this.events.set(keyName, new Map())
                        }
                        const listeners = this.events.get(keyName)
                        const id = parseInt(Date.now() / 1000 + (Math.random() * 100e3))
                        const value = {
                            listener,
                            options
                        }
                        listeners.set(id, value)
                        return {
                            rebind: (newKeyName) => {
                                const listener = this.events.get(keyName).get(id)
                                if (this.events.get(keyName).has(id)) {
                                    this.events.get(keyName).delete(id)
                                }
                                return this.on(newKeyName, listener.listener, listener.options)
                            }
                        }
                    }
                    trigger(code, doRepeat) {
                        this.events.forEach((eventsChunk, keyName) => {
                            if (!eventsChunk.size || keyName !== code) return
                            eventsChunk.forEach((event) => {
                                if (!event?.options?.repeat && doRepeat) return
                                event.listener()
                            })
                        })
                    }
                    onKeydown(event) {
                        if (!this.activeKeys.get(event.code)) {
                            this.activeKeys.set(event.code, true)
                            this.trigger(event.code)
                        }
                    }
                    onKeyup(event) {
                        if (this.activeKeys.get(event.code)) {
                            this.activeKeys.set(event.code, false)
                        }
                    }
                    update() {
                        this.activeKeys.forEach((state, keyName) => {
                            if (!state) return
                            this.trigger(keyName, true)
                        })
                    }
                    init() {
                        window.addEventListener("keydown", this.onKeydown.bind(this))
                        window.addEventListener("keyup", this.onKeyup.bind(this))
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Keyboard);
                /***/
            }),
        /***/
        "./src/modules/input/Mouse.js":
            /*!************************************!*\
              !*** ./src/modules/input/Mouse.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Mouse {
                    constructor() {
                        this.x = void 0
                        this.y = void 0
                        this.isDown = false
                        this.isUp = !this.isDown
                        this.lastClick = null
                        this.lastMove = null
                        window.addEventListener("load", this.init.bind(this))
                    }
                    get angle() {
                        const canvas = document.getElementById("gameCanvas") || _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.renderer.canvas
                        if (!canvas) return
                        const width = canvas.clientWidth / 2
                        const height = canvas.clientHeight / 2
                        return Math.atan2(this.y - height, this.x - width)
                    }
                    setTo(x, y) {
                        if (typeof x !== 'number' || typeof y !== 'number') return
                        this.x = x
                        this.y = y
                        this.lastMove = Date.now()
                    }
                    setState(_isDown) {
                        this.isDown = _isDown
                        this.isUp = !_isDown
                        this.lastClick = Date.now()
                    }
                    onMousemove(event) {
                        this.setTo(event.clientX, event.clientY)
                    }
                    onMousedown() {
                        this.setState(true)
                    }
                    onMouseup() {
                        this.setState(false)
                    }
                    init() {
                        const touchControls = document.getElementById("touch-controls-fullscreen")
                        touchControls.addEventListener("mousemove", this.onMousemove.bind(this))
                        touchControls.addEventListener("mousedown", this.onMousedown.bind(this))
                        touchControls.addEventListener("mouseup", this.onMouseup.bind(this))
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Mouse);
                /***/
            }),
        /***/
        "./src/modules/managers/AnimalsManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/AnimalsManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_Animal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/Animal.js */ "./src/modules/entities/Animal.js");
                /* harmony import */
                var _entities_Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../entities/Player.js */ "./src/modules/entities/Player.js");
                class AnimalsManager {
                    constructor() {
                        this.animals = new Map()
                        this.animalsInStream = 0
                    }
                    get list() {
                        return [...this.animals.values()]
                    }
                    getById(sid) {
                        return this.animals.get(sid)
                    }
                    each(callback) {
                        this.animals.forEach(callback)
                    }
                    eachVisible(callback) {
                        this.each((animal) => {
                            if (!animal.visible) return
                            callback(animal)
                        })
                    }
                    updateAnimals(content) {
                        const chunkSize = 7
                        this.animalsInStream = 0
                        this.each((animal) => {
                            animal.disable()
                        })
                        for (let i = 0; i < content.length; i += chunkSize) {
                            const chunk = content.slice(i, i + chunkSize)
                            this.animalsInStream += 1
                            if (!this.animals.has(chunk[0])) {
                                const animal = new _entities_Animal_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                    sid: chunk[0],
                                    index: chunk[1],
                                    x: chunk[2],
                                    y: chunk[3],
                                    dir: chunk[4]
                                })
                                this.animals.set(chunk[0], animal)
                                continue
                            }
                            const animal = this.animals.get(chunk[0])
                            animal.setTickData(chunk)
                        }
                    }
                    interpolate() {
                        const {
                            renderer
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
                        const lastTime = renderer.nowUpdate - (1000 / (0 || 10))
                        this.eachVisible((animal) => {
                            animal.dt += renderer.delta
                            const rate = 170
                            const tmpRate = Math.min(1.7, animal.dt / rate)
                            const xDif = animal.x2 - animal.x1
                            const yDif = animal.y2 - animal.y1
                            animal.setTo(
                                animal.x1 + (xDif * tmpRate),
                                animal.y1 + (yDif * tmpRate)
                            )
                        })
                    }
                    update() {
                        this.interpolate()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (AnimalsManager);
                /***/
            }),
        /***/
        "./src/modules/managers/ObjectsManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/ObjectsManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_GameObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/GameObject.js */ "./src/modules/entities/GameObject.js");
                class ObjectsManager {
                    constructor() {
                        this.objects = new Map()
                        this.objectsInStream = 0
                    }
                    get list() {
                        return [...this.objects.values()]
                    }
                    getById(sid) {
                        return this.objects.get(sid)
                    }
                    each(callback) {
                        this.objects.forEach(callback)
                    }
                    eachVisible(callback) {
                        const visibleObjects = this.list.filter((object) => object.active && object.visible)
                        for (let i = 0; i < visibleObjects.length; i++) {
                            const gameObject = visibleObjects[i]
                            if (!gameObject.visible || !gameObject.active) return
                            callback(gameObject)
                        }
                    }
                    disableAllObjects(sid) {
                        this.each((gameObject) => {
                            if (!gameObject.owner || gameObject.owner.sid !== sid) return
                            this.objects.delete(gameObject.sid)
                        })
                    }
                    add(sid, x, y, dir, scale, type, data, setSID, owner) {
                        let tmpObject = this.getById(sid)
                        if (!tmpObject) {
                            tmpObject = new _entities_GameObject_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                sid
                            })
                            this.objects.set(sid, tmpObject)
                        }
                        if (setSID) tmpObject.sid = sid
                        tmpObject.init(x, y, dir, scale, type, data, setSID, owner)
                    }
                    checkItemLocation(x, y, scale, scaleMult, indx, ignoreWater) {
                        const {
                            CowUtils
                        } = window
                        const position = {
                            x,
                            y
                        }
                        let isCanPlace = true
                        this.eachVisible((gameObject) => {
                            if (!isCanPlace) return
                            const blockScale = (gameObject.blocker ? gameObject.blocker : gameObject.getScale(scaleMult, gameObject.isItem))
                            if (CowUtils.getDistance(position, gameObject) < (scale + blockScale)) {
                                isCanPlace = false
                            }
                        })
                        if (
                            !ignoreWater && indx != 18 &&
                            y >= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2) - (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.riverWidth / 2) &&
                            y <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2) + (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.riverWidth / 2)
                        ) {
                            isCanPlace = false
                        }
                        return isCanPlace
                    }
                    update() {
                        this.objectsInStream = 0
                        this.each((gameObject) => {
                            if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.canSee(gameObject)) {
                                return gameObject.setVisible(false)
                            }
                            gameObject.setVisible(true)
                            this.objectsInStream += 1
                            // if (!gameObject.doUpdate) return
                            gameObject.update()
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (ObjectsManager);
                /***/
            }),
        /***/
        "./src/modules/managers/PlayersManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/PlayersManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/Player.js */ "./src/modules/entities/Player.js");
                class PlayersManager {
                    constructor() {
                        this.players = new Map()
                        this.playersInStream = 0
                    }
                    get list() {
                        return [...this.players.values()]
                    }
                    getById(sid) {
                        return this.players.get(sid)
                    }
                    each(callback) {
                        this.players.forEach(callback)
                    }
                    eachVisible(callback) {
                        this.each((player) => {
                            if (!player.visible) return
                            callback(player)
                        })
                    }
                    addPlayer(content, isYou) {
                        if (!this.players.has(content[1])) {
                            this.players.set(content[1], new _entities_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                id: content[0],
                                sid: content[1]
                            }))
                        }
                        const player = this.players.get(content[1])
                        player.visible = false
                        player.x2 = void 0
                        player.y2 = void 0
                        player.spawn()
                        player.setInitData(content)
                        if (isYou) {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setPlayer(player)
                        }
                    }
                    removePlayer(sid) {
                        if (!this.players.has(sid)) return
                        this.players.delete(sid)
                    }
                    updatePlayers(content) {
                        const chunkSize = 13
                        this.playersInStream = 0
                        this.eachVisible((player) => {
                            player.disable()
                        })
                        for (let i = 0; i < content.length; i += chunkSize) {
                            const chunk = content.slice(i, i + chunkSize)
                            if (!this.players.has(chunk[0])) continue
                            const player = this.players.get(chunk[0])
                            player.setTickData(chunk)
                            this.playersInStream += 1
                        }
                    }
                    interpolate() {
                        const {
                            CowUtils
                        } = window
                        const {
                            renderer
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
                        const lastTime = renderer.nowUpdate - (1000 / (0 || 10))
                        this.eachVisible((player) => {
                            player.dt += renderer.delta
                            const total = player.time2 - player.time1
                            const fraction = lastTime - player.time1
                            const ratio = total / fraction
                            const rate = 170
                            const tmpRate = Math.min(1.7, player.dt / rate)
                            const xDif = player.x2 - player.x1
                            const yDif = player.y2 - player.y1
                            player.setTo(
                                player.x1 + (xDif * tmpRate),
                                player.y1 + (yDif * tmpRate)
                            )
                            player.dir = CowUtils.lerpAngle(player.dir2, player.dir1, Math.min(1.2, ratio))
                        })
                    }
                    update() {
                        this.interpolate()
                        this.eachVisible((player) => {
                            const reloadType = player.weaponIndex > 8 ? "secondary" : "primary"
                            const currentReload = player.reloads[reloadType]
                            if (player.weaponIndex === currentReload.id) {
                                if (currentReload.count < currentReload.max && player.buildIndex === -1) {
                                    currentReload.date2 = Date.now()
                                }
                            }
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (PlayersManager);
                /***/
            }),
        /***/
        "./src/modules/plugins/AutoReconect.js":
            /*!*********************************************!*\
              !*** ./src/modules/plugins/AutoReconect.js ***!
              \*********************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Plugin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Plugin.js */ "./src/modules/plugins/Plugin.js");
                class AutoReconect extends _Plugin_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
                    constructor() {
                        super({
                            name: "auto-reconect",
                            description: "Automatically reloads the page after the connection is closed or the game could not be logged in",
                            once: true
                        })
                    }
                    execute() {
                        super.execute(() => {
                            location.reload()
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (AutoReconect);
                /***/
            }),
        /***/
        "./src/modules/plugins/Plugin.js":
            /*!***************************************!*\
              !*** ./src/modules/plugins/Plugin.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Plugin {
                    constructor({
                        name,
                        description,
                        once,
                        isCanChangeActiveState = true
                    }) {
                        this.name = name
                        this.description = description
                        this.once = once
                        this._isCanChangeActiveState = isCanChangeActiveState
                        this.isActiveState = false
                        this.lastActive = null
                    }
                    setActiveState(state) {
                        if (!this._isCanChangeActiveState) return
                        this.isActiveState = state
                    }
                    execute(callback) {
                        if (this.once && this.lastActive) return
                        if (callback instanceof Function) {
                            callback()
                        }
                        this.lastActive = Date.now()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Plugin);
                /***/
            }),
        /***/
        "./src/modules/plugins/index.js":
            /*!**************************************!*\
              !*** ./src/modules/plugins/index.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    AutoReconect: function() {
                        return /* reexport safe */ _AutoReconect_js__WEBPACK_IMPORTED_MODULE_0__["default"];
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _AutoReconect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./AutoReconect.js */ "./src/modules/plugins/AutoReconect.js");
                /***/
            }),
        /***/
        "./src/modules/render/Camera.js":
            /*!**************************************!*\
              !*** ./src/modules/render/Camera.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Camera {
                    constructor() {
                        this.x = 0
                        this.y = 0
                        this.distance = 0
                        this.angle = 0
                        this.speed = 0
                        this.xOffset = 0
                        this.yOffset = 0
                    }
                    setTo(x, y) {
                        this.x = x
                        this.y = y
                    }
                    update() {
                        if (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive) {
                            const {
                                CowUtils
                            } = window
                            this.distance = CowUtils.getDistance(this, _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player)
                            this.angle = CowUtils.getDirection(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player, this)
                            this.speed = Math.min(this.distance * .01 * _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.renderer.delta, this.distance)
                            if (this.distance > .05) {
                                this.x += this.speed * Math.cos(this.angle)
                                this.y += this.speed * Math.sin(this.angle)
                            } else {
                                this.setTo(
                                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.x,
                                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.y
                                )
                            }
                        } else {
                            this.setTo(
                                _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2,
                                _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2
                            )
                        }
                        this.xOffset = this.x - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenWidth / 2
                        this.yOffset = this.y - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenHeight / 2
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Camera);
                /***/
            }),
        /***/
        "./src/modules/render/Renderer.js":
            /*!****************************************!*\
              !*** ./src/modules/render/Renderer.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Renderer {
                    constructor() {
                        this.canvas = void 0
                        this.context = void 0
                        this.renders = new Map()
                        this.nowUpdate = void 0
                        this.lastUpdate = this.nowUpdate
                        this.delta = 0
                        window.addEventListener("load", this.init.bind(this))
                    }
                    addRender(renderKey, renderFunc) {
                        if (typeof renderKey !== 'string') return
                        if (!(renderFunc instanceof Function)) return
                        if (!this.renders.has(renderKey)) {
                            this.renders.set(renderKey, new Map())
                        }
                        const rendersChunk = this.renders.get(renderKey)
                        rendersChunk.set(rendersChunk.size + 1, renderFunc)
                    }
                    _updateAll() {
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.animalsManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.input.keyboard.update()
                    }
                    updateFrame() {
                        this.nowUpdate = Date.now()
                        this.delta = this.nowUpdate - this.lastUpdate
                        this.lastUpdate = this.nowUpdate
                        requestAnimationFrame(this.updateFrame.bind(this))
                        this._updateAll()
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player) return
                        this.renders.forEach((rendersChunk) => {
                            if (!rendersChunk.size) return
                            rendersChunk.forEach((render) => {
                                render()
                            })
                        })
                    }
                    init() {
                        this.canvas = document.getElementById("gameCanvas")
                        this.context = this.canvas.getContext("2d")
                        this.updateFrame()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Renderer);
                /***/
            }),
        /***/
        "./src/modules/socket/Handler.js":
            /*!***************************************!*\
              !*** ./src/modules/socket/Handler.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _events_getEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./events/getEvents.js */ "./src/modules/socket/events/getEvents.js");
                class Handler {
                    static handlerKeys = {
                        "socket-open": "onSocketOpen",
                        "socket-message": "onSocketMessage",
                        "socket-close": "onSocketClose"
                    }
                    constructor({
                        socket
                    }) {
                        this.socket = socket
                        this.packetsListeners = new Map()
                        this.firstMessage = false
                    }
                    onPacket(packetName, listener) {
                        if (typeof packetName !== 'string') return
                        if (!(listener instanceof Function)) return
                        if (!this.packetsListeners.has(packetName)) {
                            this.packetsListeners.set(packetName, new Map())
                        }
                        const listeners = this.packetsListeners.get(packetName)
                        listeners.set(listeners.size + 1, listener)
                    }
                    onSocketOpen() {}
                    onSocketMessage(event) {
                        if (!this.firstMessage) {
                            const events = (0, _events_getEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"])()
                            for (const event in events) {
                                this.onPacket(event, events[event])
                            }
                            this.firstMessage = true
                        }
                        const {
                            data
                        } = event
                        if (!(data instanceof ArrayBuffer)) return
                        const binary = new Uint8Array(data)
                        const decoded = _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.decoder.decode(binary)
                        if (!decoded.length) return
                        const type = decoded[0]
                        const content = decoded[1]
                        this.packetsListeners.forEach((packetListeners, packetName) => {
                            if (!packetListeners.size) return
                            if (packetName !== type) return
                            packetListeners.forEach((packetListener) => {
                                packetListener(...content)
                            })
                        })
                    }
                    onSocketClose() {
                        const {
                            plugins
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.executePlugin(plugins.AUTO_RECONECT)
                    }
                    handle(handlerKey, event) {
                        const listenerName = Handler.handlerKeys[handlerKey]
                        if (typeof listenerName === 'undefined') return
                        const listener = this[listenerName]
                        if (!(listener instanceof Function)) return
                        listener.call(this, event)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Handler);
                /***/
            }),
        /***/
        "./src/modules/socket/Manager.js":
            /*!***************************************!*\
              !*** ./src/modules/socket/Manager.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Manager {
                    static triggerKeys = {
                        "set-websocket": "onWebSocketSetted"
                    }
                    constructor({
                        socket
                    }) {
                        this.socket = socket
                    }
                    onWebSocketSetted() {
                        const {
                            handler
                        } = this.socket
                        this.socket.onEvent("open", handler.handle.bind(handler, "socket-open"))
                        this.socket.onEvent("message", handler.handle.bind(handler, "socket-message"))
                        this.socket.onEvent("close", handler.handle.bind(handler, "socket-close"))
                    }
                    trigger(triggerKey, ...props) {
                        const listenerName = Manager.triggerKeys[triggerKey]
                        if (typeof listenerName === 'undefined') return
                        const listener = this[listenerName]
                        if (!(listener instanceof Function)) return
                        listener.call(this, ...props)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Manager);
                /***/
            }),
        /***/
        "./src/modules/socket/Socket.js":
            /*!**************************************!*\
              !*** ./src/modules/socket/Socket.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Handler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Handler.js */ "./src/modules/socket/Handler.js");
                /* harmony import */
                var _Manager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./Manager.js */ "./src/modules/socket/Manager.js");
                class Socket {
                    constructor() {
                        this.websocket = void 0
                        this.socketId = void 0
                        this.handler = new _Handler_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                            socket: this
                        })
                        this.manager = new _Manager_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
                            socket: this
                        })
                    }
                    get isCreated() {
                        return Boolean(typeof this.websocket !== 'undefined')
                    }
                    get isReady() {
                        return Boolean(this.websocket?.readyState === 1)
                    }
                    send(type, content) {
                        if (!this.isReady) return
                        const encoded = _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder.encode([type, content])
                        this.websocket.send(encoded)
                    }
                    onEvent(eventKey, listener) {
                        if (!this.isCreated) return
                        if (eventKey.startsWith("on")) {
                            this.websocket[eventKey] = listener
                            return
                        }
                        this.websocket.addEventListener(eventKey, listener)
                    }
                    setSocketId(_socketId) {
                        if (typeof _socketId !== 'number') return
                        this.socketId = _socketId
                    }
                    setWebSocket(_websocket) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.isReady) return
                        if (this.websocket instanceof WebSocket) return
                        if (!(_websocket instanceof WebSocket)) return
                        if (!/moomoo/.test(_websocket.url)) return
                        this.websocket = _websocket
                        this.manager.trigger("set-websocket")
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Socket);
                /***/
            }),
        /***/
        "./src/modules/socket/events/animals/loadAI.js":
            /*!*****************************************************!*\
              !*** ./src/modules/socket/events/animals/loadAI.js ***!
              \*****************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function loadAI(content) {
                    if (!content?.length) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.animalsManager.updateAnimals(content)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (loadAI);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/addProjectile.js":
            /*!****************************************************************!*\
              !*** ./src/modules/socket/events/game_object/addProjectile.js ***!
              \****************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                    const isTurret = Number(range == 700 && speed == 1.5)
                    const position = {
                        x,
                        y
                    }
                    const {
                        CowUtils
                    } = window
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.eachVisible((player) => {
                        const distance = Math.round(CowUtils.getDistance(player, position)) - player.scale
                        const isSameDir = player.dir2 - dir < .6
                        const isProjectileInDistance = distance <= 135
                        const isOwnTurret = isTurret && player.reloads.turret.done && player.skinIndex === 53 && distance <= 10
                        const isOwnSecondary = !isTurret && player.reloads.secondary.done && player.weapon.projectile !== undefined && isSameDir && isProjectileInDistance
                        const reloadType = isTurret ? "turret" : "secondary"
                        if (!isOwnTurret && !isOwnSecondary) return
                        player.reloads[reloadType].clear()
                    })
                }
                /* harmony default export */
                __webpack_exports__["default"] = (addProjectile);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/killObject.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/game_object/killObject.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killObject(sid) {
                    const gameObject = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.getById(sid)
                    if (!gameObject) return
                    gameObject.setActive(false)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/killObjects.js":
            /*!**************************************************************!*\
              !*** ./src/modules/socket/events/game_object/killObjects.js ***!
              \**************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killObjects(sid) {
                    if (!sid) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.disableAllObjects(sid)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killObjects);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/loadGameObject.js":
            /*!*****************************************************************!*\
              !*** ./src/modules/socket/events/game_object/loadGameObject.js ***!
              \*****************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function loadGameObject(content) {
                    const chunkSize = 8
                    for (let i = 0; i < content.length; i += chunkSize) {
                        const chunk = content.slice(i, i + chunkSize)
                        chunk[6] = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.list[chunk[6]]
                        if (chunk[7] >= 0) {
                            chunk[7] = {
                                sid: chunk[7]
                            }
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.add(...chunk)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (loadGameObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/wiggleGameObject.js":
            /*!*******************************************************************!*\
              !*** ./src/modules/socket/events/game_object/wiggleGameObject.js ***!
              \*******************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function wiggleGameObject(dir, sid) {
                    const gameObject = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.getById(sid)
                    if (!gameObject) return
                    gameObject.doWiggle(dir)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (wiggleGameObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/getEvents.js":
            /*!************************************************!*\
              !*** ./src/modules/socket/events/getEvents.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _animals_loadAI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./animals/loadAI.js */ "./src/modules/socket/events/animals/loadAI.js");
                /* harmony import */
                var _game_object_addProjectile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./game_object/addProjectile.js */ "./src/modules/socket/events/game_object/addProjectile.js");
                /* harmony import */
                var _game_object_killObject_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./game_object/killObject.js */ "./src/modules/socket/events/game_object/killObject.js");
                /* harmony import */
                var _game_object_killObjects_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./game_object/killObjects.js */ "./src/modules/socket/events/game_object/killObjects.js");
                /* harmony import */
                var _game_object_loadGameObject_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./game_object/loadGameObject.js */ "./src/modules/socket/events/game_object/loadGameObject.js");
                /* harmony import */
                var _game_object_wiggleGameObject_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./game_object/wiggleGameObject.js */ "./src/modules/socket/events/game_object/wiggleGameObject.js");
                /* harmony import */
                var _player_addPlayer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./player/addPlayer.js */ "./src/modules/socket/events/player/addPlayer.js");
                /* harmony import */
                var _player_gatherAnimation_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./player/gatherAnimation.js */ "./src/modules/socket/events/player/gatherAnimation.js");
                /* harmony import */
                var _player_killPlayer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./player/killPlayer.js */ "./src/modules/socket/events/player/killPlayer.js");
                /* harmony import */
                var _player_removePlayer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__( /*! ./player/removePlayer.js */ "./src/modules/socket/events/player/removePlayer.js");
                /* harmony import */
                var _player_updateHealth_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__( /*! ./player/updateHealth.js */ "./src/modules/socket/events/player/updateHealth.js");
                /* harmony import */
                var _player_updatePlayers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__( /*! ./player/updatePlayers.js */ "./src/modules/socket/events/player/updatePlayers.js");
                /* harmony import */
                var _stats_updateItemCounts_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__( /*! ./stats/updateItemCounts.js */ "./src/modules/socket/events/stats/updateItemCounts.js");
                /* harmony import */
                var _stats_updateItems_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__( /*! ./stats/updateItems.js */ "./src/modules/socket/events/stats/updateItems.js");
                /* harmony import */
                var _stats_updatePlayerValue_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__( /*! ./stats/updatePlayerValue.js */ "./src/modules/socket/events/stats/updatePlayerValue.js");
                /* harmony import */
                var _system_setupGame_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__( /*! ./system/setupGame.js */ "./src/modules/socket/events/system/setupGame.js");

                function getEvents() {
                    const events = {}
                    const {
                        packets
                    } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
                    events[packets.SETUP_GAME] = _system_setupGame_js__WEBPACK_IMPORTED_MODULE_16__["default"]
                    events[packets.ADD_PLAYER] = _player_addPlayer_js__WEBPACK_IMPORTED_MODULE_7__["default"]
                    events[packets.KILL_PLAYER] = _player_killPlayer_js__WEBPACK_IMPORTED_MODULE_9__["default"]
                    events[packets.REMOVE_PLAYER] = _player_removePlayer_js__WEBPACK_IMPORTED_MODULE_10__["default"]
                    events[packets.UPDATE_PLAYERS] = _player_updatePlayers_js__WEBPACK_IMPORTED_MODULE_12__["default"]
                    events[packets.UPDATE_ITEM_COUNTS] = _stats_updateItemCounts_js__WEBPACK_IMPORTED_MODULE_13__["default"]
                    events[packets.UPDATE_PLAYER_VALUE] = _stats_updatePlayerValue_js__WEBPACK_IMPORTED_MODULE_15__["default"]
                    events[packets.UPDATE_HEALTH] = _player_updateHealth_js__WEBPACK_IMPORTED_MODULE_11__["default"]
                    events[packets.UPDATE_ITEMS] = _stats_updateItems_js__WEBPACK_IMPORTED_MODULE_14__["default"]
                    events[packets.GATHER_ANIMATION] = _player_gatherAnimation_js__WEBPACK_IMPORTED_MODULE_8__["default"]
                    events[packets.ADD_PROJECTILE] = _game_object_addProjectile_js__WEBPACK_IMPORTED_MODULE_2__["default"]
                    events[packets.LOAD_GAME_OBJECT] = _game_object_loadGameObject_js__WEBPACK_IMPORTED_MODULE_5__["default"]
                    events[packets.KILL_OBJECT] = _game_object_killObject_js__WEBPACK_IMPORTED_MODULE_3__["default"]
                    events[packets.KILL_OBJECTS] = _game_object_killObjects_js__WEBPACK_IMPORTED_MODULE_4__["default"]
                    events[packets.WIGGLE_GAME_OBJECT] = _game_object_wiggleGameObject_js__WEBPACK_IMPORTED_MODULE_6__["default"]
                    events[packets.LOAD_AI] = _animals_loadAI_js__WEBPACK_IMPORTED_MODULE_1__["default"]
                    return events
                }
                /* harmony default export */
                __webpack_exports__["default"] = (getEvents);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/addPlayer.js":
            /*!*******************************************************!*\
              !*** ./src/modules/socket/events/player/addPlayer.js ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function addPlayer(content, isYou) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.addPlayer(content, isYou)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (addPlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/gatherAnimation.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/player/gatherAnimation.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function gatherAnimation(sid, didHit, index) {
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.getById(sid)
                    if (!player) return
                    player.onGather(didHit, index)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (gatherAnimation);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/killPlayer.js":
            /*!********************************************************!*\
              !*** ./src/modules/socket/events/player/killPlayer.js ***!
              \********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killPlayer() {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.kill()
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killPlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/removePlayer.js":
            /*!**********************************************************!*\
              !*** ./src/modules/socket/events/player/removePlayer.js ***!
              \**********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function removePlayer(id) {
                    if (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.players.size <= 1) return
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.list.find((player) => player.id === id)
                    if (!player) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.removePlayer(player.sid)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (removePlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/updateHealth.js":
            /*!**********************************************************!*\
              !*** ./src/modules/socket/events/player/updateHealth.js ***!
              \**********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateHealth(sid, value) {
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.getById(sid)
                    if (!player) return
                    player.changeHealth(value)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateHealth);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/updatePlayers.js":
            /*!***********************************************************!*\
              !*** ./src/modules/socket/events/player/updatePlayers.js ***!
              \***********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updatePlayers(content) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.updatePlayers(content)
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.updateTicks()
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updatePlayers);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updateItemCounts.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/stats/updateItemCounts.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateItemCounts(index, value) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.itemCounts[index] = value
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateItemCounts);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updateItems.js":
            /*!********************************************************!*\
              !*** ./src/modules/socket/events/stats/updateItems.js ***!
              \********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateItems(data, isWeapon) {
                    if (!data?.length) return
                    const type = isWeapon ? "weapons" : "items"
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player[type] = data
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateItems);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updatePlayerValue.js":
            /*!**************************************************************!*\
              !*** ./src/modules/socket/events/stats/updatePlayerValue.js ***!
              \**************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updatePlayerValue(index, value, updateView) {
                    if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player[index] = value
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updatePlayerValue);
                /***/
            }),
        /***/
        "./src/modules/socket/events/system/setupGame.js":
            /*!*******************************************************!*\
              !*** ./src/modules/socket/events/system/setupGame.js ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function setupGame(socketId) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.setSocketId(socketId)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (setupGame);
                /***/
            }),
        /***/
        "./src/utils/CowUtils.js":
            /*!*******************************!*\
              !*** ./src/utils/CowUtils.js ***!
              \*******************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class CowUtils {
                    static removeProto(object) {
                        if (!(object instanceof Object)) return
                        return JSON.parse(JSON.stringify(object))
                    }
                    static randInt(min, max) {
                        return Math.floor(CowUtils.randFloat(min, max))
                    }
                    static randFloat(min, max) {
                        if (typeof max === 'undefined') {
                            max = min
                            min = 0
                        }
                        return (Math.random() * (max - min + 1)) + min
                    }
                    static lerp(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount
                    }
                    static kFormat(value) {
                        value = parseFloat(value)
                        return value > 999 ? `${(value / 1000).toFixed(1)}k` : value
                    }
                    static fixAngle(angle) {
                        return Math.atan2(Math.cos(angle), Math.sin(angle))
                    }
                    static getDistance(x1, y1, x2, y2) {
                        if (x1 instanceof Object && y1 instanceof Object) {
                            return Math.hypot(x1.y - y1.y, x1.x - y1.x)
                        }
                        return Math.hypot(y1 - y2, x1 - x2)
                    }
                    static getDirection(x1, y1, x2, y2) {
                        if (x1 instanceof Object && y1 instanceof Object) {
                            return Math.atan2(x1.y - y1.y, x1.x - y1.x)
                        }
                        return Math.atan2(y1 - y2, x1 - x2)
                    }
                    static getAngleDist(angleBetween, targetLookDir) {
                        const difference = Math.abs(targetLookDir - angleBetween) % (Math.PI * 2)
                        return (difference > Math.PI ? (Math.PI * 2) - difference : difference)
                    }
                    static lerpAngle(value1, value2, amount) {
                        const difference = Math.abs(value2 - value1)
                        if (difference > Math.PI) {
                            if (value1 > value2) {
                                value2 += Math.PI * 2
                            } else {
                                value1 += Math.PI * 2
                            }
                        }
                        const value = value2 + ((value1 - value2) * amount)
                        if (value >= 0 && value <= (Math.PI * 2)) return value
                        return (value % (Math.PI * 2))
                    }
                    static createHook({
                        property,
                        proto = Object.prototype,
                        setter,
                        getter
                    }) {
                        const symbol = Symbol(property)
                        Object.defineProperty(proto, property, {
                            get() {
                                typeof getter === 'function' && getter(this, this[symbol])
                                return this[symbol]
                            },
                            set(value) {
                                typeof setter === 'function' && setter(this, value)
                                this[symbol] = value
                            }
                        })
                        return symbol
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (CowUtils);
                /***/
            }),
        /***/
        "./src/config.json":
            /*!*************************!*\
              !*** ./src/config.json ***!
              \*************************/
            /***/
            (function(module) {
                module.exports = JSON.parse('{"NAME":"Cow.JS","VERSION":"1.0.0","maxScreenWidth":1920,"maxScreenHeight":1080,"mapScale":14400,"riverWidth":724,"gatherAngle":1.208304866765305,"hitAngle":1.5707963267948966,"shieldAngle":1.0471975511965976,"gatherWiggle":10,"designations":{"plugins":{"AUTO_RECONECT":"auto-reconect","CHECK_PLACEMENT":"check-placement"},"packets":{"INIT_DATA":"A","DISCONNECT":"B","SETUP_GAME":"C","ADD_PLAYER":"D","REMOVE_PLAYER":"E","UPDATE_PLAYERS":"a","UPDATE_LEADERBOARD":"G","LOAD_GAME_OBJECT":"H","LOAD_AI":"I","ANIMATE_AI":"J","GATHER_ANIMATION":"K","WIGGLE_GAME_OBJECT":"L","SHOOT_TURRET":"M","UPDATE_PLAYER_VALUE":"N","UPDATE_HEALTH":"O","KILL_PLAYER":"P","KILL_OBJECT":"Q","KILL_OBJECTS":"R","UPDATE_ITEM_COUNTS":"S","UPDATE_AGE":"T","UPDATE_UPGRADES":"U","UPDATE_ITEMS":"V","ADD_PROJECTILE":"X","REMOVE_PROJECTILE":"Y","SERVER_SHUTDOWN_NOTICE":"Z","ADD_ALLIANCE":"g","DELETE_ALLIANCE":"1","ALLIANCE_NOTIFICATION":"2","SET_PLAYER_TEAM":"3","SET_ALLIANCE_PLAYERS":"4","UPDATE_STORE_ITEMS":"5","RECEIVE_CHAT":"6","UPDATE_MINIMAP":"7","SHOW_TEXT":"8","PING_MAP":"9","PING_SOCKET_RESPONSE":"0","ALLIANCE_JOIN_REQUEST":"P","KICK_FROM_CLAN":"Q","SEND_ALLIANCE_JOIN":"b","CREATE_ALLIANCE":"L","LEAVE_ALLIANCE":"N","STORE_EQUIP":"c","CHAT_MESSAGE":"6","RMD":"E","ATTACK_STATE":"d","MOVE_DIR":"a","MAP_PING":"S","AUTO_ATTACK":"K","SELECT_BUILD":"G","SPAWN":"M","SELECT_UPGRADE":"H","LOOK_DIR":"D","PING_SOCKET":"0"},"items":{"FOOD":0,"WALL":1,"SPIKE":2,"MILL":3,"TRAP":4,"TURRET":5}}}');
                /***/
            })
        /******/
    });
    /************************************************************************/
    /******/ // The module cache
    /******/
    var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/
        var cachedModule = __webpack_module_cache__[moduleId];
        /******/
        if (cachedModule !== undefined) {
            /******/
            return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/
            exports: {}
            /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/
    /* webpack/runtime/define property getters */
    /******/
    ! function() {
        /******/ // define getter functions for harmony exports
        /******/
        __webpack_require__.d = function(exports, definition) {
            /******/
            for (var key in definition) {
                /******/
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /******/
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    }();
    /******/
    /******/
    /* webpack/runtime/hasOwnProperty shorthand */
    /******/
    ! function() {
        /******/
        __webpack_require__.o = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }
        /******/
    }();
    /******/
    /******/
    /* webpack/runtime/make namespace object */
    /******/
    ! function() {
        /******/ // define __esModule on exports
        /******/
        __webpack_require__.r = function(exports) {
            /******/
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module'
                });
                /******/
            }
            /******/
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            /******/
        };
        /******/
    }();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    ! function() {
        /*!**********************!*\
          !*** ./src/index.js ***!
          \**********************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
        /* harmony import */
        var _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./utils/CowUtils.js */ "./src/utils/CowUtils.js");
        /* harmony import */
        var _hooks_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./hooks.js */ "./src/hooks.js");
        const watermark = setInterval(() => {
            const linksContainer = document.getElementById("linksContainer2")
            if (!linksContainer) return
            const html = linksContainer.innerHTML
            linksContainer.innerHTML = html.replace(/(v\d\.\d\.\d)/gi, `$1 </a> | <a href="#" target="_blank" class="menuLink" style="color: #9f1a1a">${_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.NAME}</a>`)
            clearInterval(watermark)
        })
        setTimeout(() => clearInterval(watermark), 30e3)
        window.CowUtils = _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]
        window.Cow = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
    }();
    /******/
})();