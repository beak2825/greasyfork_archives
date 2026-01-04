// ==UserScript==
// @name          GGn No-Intro Helper
// @description   A GGn user script to help with No-Intro uploads/trumps
// @namespace     http://tampermonkey.net/
// @version       3.0.4
// @author        BestGrapeLeaves
// @license       MIT
// @match         *://gazellegames.net/upload.php?groupid=*
// @match         *://gazellegames.net/torrents.php?id=*
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_listValues
// @grant         GM_deleteValue
// @grant         GM_setValue
// @grant         GM_getValue
// @connect       datomatic.no-intro.org
// @icon          https://i.imgur.com/UFOk0Iu.png
// @downloadURL https://update.greasyfork.org/scripts/450254/GGn%20No-Intro%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450254/GGn%20No-Intro%20Helper.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength){
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }
    return parts.join('');
}


/***/ }),

/***/ "./node_modules/bencode/lib/decode.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];
const INTEGER_START = 0x69 // 'i'
;
const STRING_DELIM = 0x3A // ':'
;
const DICTIONARY_START = 0x64 // 'd'
;
const LIST_START = 0x6C // 'l'
;
const END_OF_TYPE = 0x65 // 'e'
;
/**
 * replaces parseInt(buffer.toString('ascii', start, end)).
 * For strings with less then ~30 charachters, this is actually a lot faster.
 *
 * @param {Buffer} data
 * @param {Number} start
 * @param {Number} end
 * @return {Number} calculated number
 */ function getIntFromBuffer(buffer, start, end) {
    let sum = 0;
    let sign = 1;
    for(let i = start; i < end; i++){
        const num = buffer[i];
        if (num < 58 && num >= 48) {
            sum = sum * 10 + (num - 48);
            continue;
        }
        if (i === start && num === 43) {
            continue;
        }
        if (i === start && num === 45) {
            sign = -1;
            continue;
        }
        if (num === 46) {
            break;
        }
        throw new Error('not a number: buffer[' + i + '] = ' + num);
    }
    return sum * sign;
}
/**
 * Decodes bencoded data.
 *
 * @param  {Buffer} data
 * @param  {Number} start (optional)
 * @param  {Number} end (optional)
 * @param  {String} encoding (optional)
 * @return {Object|Array|Buffer|String|Number}
 */ function decode(data, start, end, encoding) {
    if (data == null || data.length === 0) {
        return null;
    }
    if (typeof start !== 'number' && encoding == null) {
        encoding = start;
        start = undefined;
    }
    if (typeof end !== 'number' && encoding == null) {
        encoding = end;
        end = undefined;
    }
    decode.position = 0;
    decode.encoding = encoding || null;
    decode.data = !Buffer.isBuffer(data) ? Buffer.from(data) : data.slice(start, end);
    decode.bytes = decode.data.length;
    return decode.next();
}
decode.bytes = 0;
decode.position = 0;
decode.data = null;
decode.encoding = null;
decode.next = function() {
    switch(decode.data[decode.position]){
        case DICTIONARY_START:
            return decode.dictionary();
        case LIST_START:
            return decode.list();
        case INTEGER_START:
            return decode.integer();
        default:
            return decode.buffer();
    }
};
decode.find = function(chr) {
    let i = decode.position;
    const c = decode.data.length;
    const d = decode.data;
    while(i < c){
        if (d[i] === chr) return i;
        i++;
    }
    throw new Error('Invalid data: Missing delimiter "' + String.fromCharCode(chr) + '" [0x' + chr.toString(16) + ']');
};
decode.dictionary = function() {
    decode.position++;
    const dict = {};
    while(decode.data[decode.position] !== END_OF_TYPE){
        dict[decode.buffer()] = decode.next();
    }
    decode.position++;
    return dict;
};
decode.list = function() {
    decode.position++;
    const lst = [];
    while(decode.data[decode.position] !== END_OF_TYPE){
        lst.push(decode.next());
    }
    decode.position++;
    return lst;
};
decode.integer = function() {
    const end = decode.find(END_OF_TYPE);
    const number = getIntFromBuffer(decode.data, decode.position + 1, end);
    decode.position += end + 1 - decode.position;
    return number;
};
decode.buffer = function() {
    let sep = decode.find(STRING_DELIM);
    const length = getIntFromBuffer(decode.data, decode.position, sep);
    const end = ++sep + length;
    decode.position = end;
    return decode.encoding ? decode.data.toString(decode.encoding, sep, end) : decode.data.slice(sep, end);
};
module.exports = decode;


/***/ }),

/***/ "./node_modules/bencode/lib/encode.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];
const { getType  } = __webpack_require__("./node_modules/bencode/lib/util.js");
/**
 * Encodes data in bencode.
 *
 * @param  {Buffer|Array|String|Object|Number|Boolean} data
 * @return {Buffer}
 */ function encode(data, buffer, offset) {
    const buffers = [];
    let result = null;
    encode._encode(buffers, data);
    result = Buffer.concat(buffers);
    encode.bytes = result.length;
    if (Buffer.isBuffer(buffer)) {
        result.copy(buffer, offset);
        return buffer;
    }
    return result;
}
encode.bytes = -1;
encode._floatConversionDetected = false;
encode._encode = function(buffers, data) {
    if (data == null) {
        return;
    }
    switch(getType(data)){
        case 'buffer':
            encode.buffer(buffers, data);
            break;
        case 'object':
            encode.dict(buffers, data);
            break;
        case 'map':
            encode.dictMap(buffers, data);
            break;
        case 'array':
            encode.list(buffers, data);
            break;
        case 'set':
            encode.listSet(buffers, data);
            break;
        case 'string':
            encode.string(buffers, data);
            break;
        case 'number':
            encode.number(buffers, data);
            break;
        case 'boolean':
            encode.number(buffers, data);
            break;
        case 'arraybufferview':
            encode.buffer(buffers, Buffer.from(data.buffer, data.byteOffset, data.byteLength));
            break;
        case 'arraybuffer':
            encode.buffer(buffers, Buffer.from(data));
            break;
    }
};
const buffE = Buffer.from('e');
const buffD = Buffer.from('d');
const buffL = Buffer.from('l');
encode.buffer = function(buffers, data) {
    buffers.push(Buffer.from(data.length + ':'), data);
};
encode.string = function(buffers, data) {
    buffers.push(Buffer.from(Buffer.byteLength(data) + ':' + data));
};
encode.number = function(buffers, data) {
    const maxLo = 0x80000000;
    const hi = data / maxLo << 0;
    const lo = data % maxLo << 0;
    const val = hi * maxLo + lo;
    buffers.push(Buffer.from('i' + val + 'e'));
    if (val !== data && !encode._floatConversionDetected) {
        encode._floatConversionDetected = true;
        console.warn('WARNING: Possible data corruption detected with value "' + data + '":', 'Bencoding only defines support for integers, value was converted to "' + val + '"');
        console.trace();
    }
};
encode.dict = function(buffers, data) {
    buffers.push(buffD);
    let j = 0;
    let k;
    // fix for issue #13 - sorted dicts
    const keys = Object.keys(data).sort();
    const kl = keys.length;
    for(; j < kl; j++){
        k = keys[j];
        if (data[k] == null) continue;
        encode.string(buffers, k);
        encode._encode(buffers, data[k]);
    }
    buffers.push(buffE);
};
encode.dictMap = function(buffers, data) {
    buffers.push(buffD);
    const keys = Array.from(data.keys()).sort();
    for (const key of keys){
        if (data.get(key) == null) continue;
        Buffer.isBuffer(key) ? encode._encode(buffers, key) : encode.string(buffers, String(key));
        encode._encode(buffers, data.get(key));
    }
    buffers.push(buffE);
};
encode.list = function(buffers, data) {
    let i = 0;
    const c = data.length;
    buffers.push(buffL);
    for(; i < c; i++){
        if (data[i] == null) continue;
        encode._encode(buffers, data[i]);
    }
    buffers.push(buffE);
};
encode.listSet = function(buffers, data) {
    buffers.push(buffL);
    for (const item of data){
        if (item == null) continue;
        encode._encode(buffers, item);
    }
    buffers.push(buffE);
};
module.exports = encode;


/***/ }),

/***/ "./node_modules/bencode/lib/encoding-length.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];
const { digitCount , getType  } = __webpack_require__("./node_modules/bencode/lib/util.js");
function listLength(list) {
    let length = 1 + 1 // type marker + end-of-type marker
    ;
    for (const value of list){
        length += encodingLength(value);
    }
    return length;
}
function mapLength(map) {
    let length = 1 + 1 // type marker + end-of-type marker
    ;
    for (const [key, value] of map){
        const keyLength = Buffer.byteLength(key);
        length += digitCount(keyLength) + 1 + keyLength;
        length += encodingLength(value);
    }
    return length;
}
function objectLength(value) {
    let length = 1 + 1 // type marker + end-of-type marker
    ;
    const keys = Object.keys(value);
    for(let i = 0; i < keys.length; i++){
        const keyLength = Buffer.byteLength(keys[i]);
        length += digitCount(keyLength) + 1 + keyLength;
        length += encodingLength(value[keys[i]]);
    }
    return length;
}
function stringLength(value) {
    const length = Buffer.byteLength(value);
    return digitCount(length) + 1 + length;
}
function arrayBufferLength(value) {
    const length = value.byteLength - value.byteOffset;
    return digitCount(length) + 1 + length;
}
function encodingLength(value) {
    const length = 0;
    if (value == null) return length;
    const type = getType(value);
    switch(type){
        case 'buffer':
            return digitCount(value.length) + 1 + value.length;
        case 'arraybufferview':
            return arrayBufferLength(value);
        case 'string':
            return stringLength(value);
        case 'array':
        case 'set':
            return listLength(value);
        case 'number':
            return 1 + digitCount(Math.floor(value)) + 1;
        case 'bigint':
            return 1 + value.toString().length + 1;
        case 'object':
            return objectLength(value);
        case 'map':
            return mapLength(value);
        default:
            throw new TypeError(`Unsupported value of type "${type}"`);
    }
}
module.exports = encodingLength;


/***/ }),

/***/ "./node_modules/bencode/lib/index.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const bencode = module.exports;
bencode.encode = __webpack_require__("./node_modules/bencode/lib/encode.js");
bencode.decode = __webpack_require__("./node_modules/bencode/lib/decode.js");
/**
 * Determines the amount of bytes
 * needed to encode the given value
 * @param  {Object|Array|Buffer|String|Number|Boolean} value
 * @return {Number} byteCount
 */ bencode.byteLength = bencode.encodingLength = __webpack_require__("./node_modules/bencode/lib/encoding-length.js");


/***/ }),

/***/ "./node_modules/bencode/lib/util.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];
const util = module.exports;
util.digitCount = function digitCount(value) {
    // Add a digit for negative numbers, as the sign will be prefixed
    const sign = value < 0 ? 1 : 0;
    // Guard against negative numbers & zero going into log10(),
    // as that would return -Infinity
    value = Math.abs(Number(value || 1));
    return Math.floor(Math.log10(value)) + 1 + sign;
};
util.getType = function getType(value) {
    if (Buffer.isBuffer(value)) return 'buffer';
    if (ArrayBuffer.isView(value)) return 'arraybufferview';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Number) return 'number';
    if (value instanceof Boolean) return 'boolean';
    if (value instanceof Set) return 'set';
    if (value instanceof Map) return 'map';
    if (value instanceof String) return 'string';
    if (value instanceof ArrayBuffer) return 'arraybuffer';
    return typeof value;
};


/***/ }),

/***/ "./node_modules/buffer/index.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ /* eslint-disable no-proto */ 
const base64 = __webpack_require__("./node_modules/base64-js/index.js");
const ieee754 = __webpack_require__("./node_modules/ieee754/index.js");
const customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
 ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
 : null;
exports.lW = Buffer;
__webpack_unused_export__ = SlowBuffer;
exports.h2 = 50;
const K_MAX_LENGTH = 0x7fffffff;
__webpack_unused_export__ = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */ Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}
function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        const arr = new Uint8Array(1);
        const proto = {
            foo: function() {
                return 42;
            }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
Object.defineProperty(Buffer.prototype, 'parent', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
    }
});
Object.defineProperty(Buffer.prototype, 'offset', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    // Return an augmented `Uint8Array` instance
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new TypeError('The "string" argument must be of type string. Received type number');
        }
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192 // not used by this implementation
;
function from(value, encodingOrOffset, length) {
    if (typeof value === 'string') {
        return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
    }
    if (value == null) {
        throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === 'number') {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
        return Buffer.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
        return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
    }
    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
        return createBuffer(size);
    }
    if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpreted as a start offset.
        return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */ Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }
    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding);
    }
    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual);
    }
    return buf;
}
function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for(let i = 0; i < length; i += 1){
        buf[i] = array[i] & 255;
    }
    return buf;
}
function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
    } else {
        buf = new Uint8Array(array, byteOffset, length);
    }
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
            return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0);
        }
        return fromArrayLike(obj);
    }
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
    }
}
function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
    }
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) {
        length = 0;
    }
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
    ;
};
Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }
    if (a === b) return 0;
    let x = a.length;
    let y = b.length;
    for(let i = 0, len = Math.min(x, y); i < len; ++i){
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
        return Buffer.alloc(0);
    }
    let i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i){
            length += list[i].length;
        }
    }
    const buffer = Buffer.allocUnsafe(length);
    let pos = 0;
    for(i = 0; i < list.length; ++i){
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
                if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
                buf.copy(buffer, pos);
            } else {
                Uint8Array.prototype.set.call(buffer, buf, pos);
            }
        } else if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
            buf.copy(buffer, pos);
        }
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) {
        return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
    }
    if (typeof string !== 'string') {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + typeof string);
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    // Use a for loop to avoid recursion
    let loweredCase = false;
    for(;;){
        switch(encoding){
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len;
            case 'utf8':
            case 'utf-8':
                return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2;
            case 'hex':
                return len >>> 1;
            case 'base64':
                return base64ToBytes(string).length;
            default:
                if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
                    ;
                }
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    let loweredCase = false;
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
        start = 0;
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
        return '';
    }
    if (end === undefined || end > this.length) {
        end = this.length;
    }
    if (end <= 0) {
        return '';
    }
    // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
        return '';
    }
    if (!encoding) encoding = 'utf8';
    while(true){
        switch(encoding){
            case 'hex':
                return hexSlice(this, start, end);
            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end);
            case 'ascii':
                return asciiSlice(this, start, end);
            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end);
            case 'base64':
                return base64Slice(this, start, end);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end);
            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = (encoding + '').toLowerCase();
                loweredCase = true;
        }
    }
}
// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
    }
    for(let i = 0; i < len; i += 2){
        swap(this, i, i + 1);
    }
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
    }
    for(let i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
    }
    for(let i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    let str = '';
    const max = exports.h2;
    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
    if (this.length > max) str += ' ... ';
    return '<Buffer ' + str + '>';
};
if (customInspectSymbol) {
    Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
        target = Buffer.from(target, target.offset, target.byteLength);
    }
    if (!Buffer.isBuffer(target)) {
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + typeof target);
    }
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
        thisStart = 0;
    }
    if (thisEnd === undefined) {
        thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
    }
    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }
    if (thisStart >= thisEnd) {
        return -1;
    }
    if (start >= end) {
        return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for(let i = 0; i < len; ++i){
        if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
        }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;
    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
    } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
    }
    byteOffset = +byteOffset // Coerce to Number.
    ;
    if (numberIsNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : buffer.length - 1;
    }
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    // Normalize val
    if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
    }
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
            return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 0xFF // Search for a byte value [0-255]
        ;
        if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
                return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) {
            return buf[i];
        } else {
            return buf.readUInt16BE(i * indexSize);
        }
    }
    let i;
    if (dir) {
        let foundIndex = -1;
        for(i = byteOffset; i < arrLength; i++){
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1) foundIndex = i;
                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
                if (foundIndex !== -1) i -= i - foundIndex;
                foundIndex = -1;
            }
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i = byteOffset; i >= 0; i--){
            let found = true;
            for(let j = 0; j < valLength; j++){
                if (read(arr, i + j) !== read(val, j)) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) {
        length = remaining;
    } else {
        length = Number(length);
        if (length > remaining) {
            length = remaining;
        }
    }
    const strLen = string.length;
    if (length > strLen / 2) {
        length = strLen / 2;
    }
    let i;
    for(i = 0; i < length; ++i){
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else {
        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    }
    const remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
    }
    if (!encoding) encoding = 'utf8';
    let loweredCase = false;
    for(;;){
        switch(encoding){
            case 'hex':
                return hexWrite(this, string, offset, length);
            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return asciiWrite(this, string, offset, length);
            case 'base64':
                // Warning: maxLength not taken into account in base64Write
                return base64Write(this, string, offset, length);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length);
            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
    } else {
        return base64.fromByteArray(buf.slice(start, end));
    }
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while(i < end){
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 0x80) {
                        codePoint = firstByte;
                    }
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
                        if (tempCodePoint > 0x7F) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                            codePoint = tempCodePoint;
                        }
                    }
            }
        }
        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000;
function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
        ;
    }
    // Decode in chunks to avoid "call stack size exceeded".
    let res = '';
    let i = 0;
    while(i < len){
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
}
function asciiSlice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);
    for(let i = start; i < end; ++i){
        ret += String.fromCharCode(buf[i] & 0x7F);
    }
    return ret;
}
function latin1Slice(buf, start, end) {
    let ret = '';
    end = Math.min(buf.length, end);
    for(let i = start; i < end; ++i){
        ret += String.fromCharCode(buf[i]);
    }
    return ret;
}
function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = '';
    for(let i = start; i < end; ++i){
        out += hexSliceLookupTable[buf[i]];
    }
    return out;
}
function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = '';
    // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
    for(let i = 0; i < bytes.length - 1; i += 2){
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) {
        start = len;
    }
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) {
        end = len;
    }
    if (end < start) end = start;
    const newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */ function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while(++i < byteLength && (mul *= 0x100)){
        val += this[offset + i] * mul;
    }
    return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
    }
    let val = this[offset + --byteLength];
    let mul = 1;
    while(byteLength > 0 && (mul *= 0x100)){
        val += this[offset + --byteLength] * mul;
    }
    return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while(++i < byteLength && (mul *= 0x100)){
        val += this[offset + i] * mul;
    }
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i];
    while(i > 0 && (mul *= 0x100)){
        val += this[offset + --i] * mul;
    }
    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24) // Overflow
    ;
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
});
Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, 'offset');
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
});
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100)){
        this[offset + i] = value / mul & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100)){
        this[offset + i] = value / mul & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
function wrtBigUInt64LE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(0xffffffff));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
}
function wrtBigUInt64BE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(0xffffffff));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
}
Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value) {
    let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value) {
    let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'));
});
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 0xFF;
    while(++i < byteLength && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 0xFF;
    while(--i >= 0 && (mul *= 0x100)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
};
Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value) {
    let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value) {
    let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'));
});
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');
    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end);
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }
    return len;
};
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }
        if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
                // Fast path: If `val` fits into a single byte, use that numeric value.
                val = code;
            }
        }
    } else if (typeof val === 'number') {
        val = val & 255;
    } else if (typeof val === 'boolean') {
        val = Number(val);
    }
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
    }
    if (end <= start) {
        return this;
    }
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;
    if (typeof val === 'number') {
        for(i = start; i < end; ++i){
            this[i] = val;
        }
    } else {
        const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for(i = 0; i < end - start; ++i){
            this[i + start] = bytes[i % len];
        }
    }
    return this;
};
// CUSTOM ERRORS
// =============
// Simplified versions from Node, changed for Buffer-only usage
const errors = {};
function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
        get code() {
            return sym;
        }
        set code(value) {
            Object.defineProperty(this, 'code', {
                configurable: true,
                enumerable: true,
                value,
                writable: true
            });
        }
        toString() {
            return `${this.name} [${sym}]: ${this.message}`;
        }
        constructor(){
            super();
            Object.defineProperty(this, 'message', {
                value: getMessage.apply(this, arguments),
                writable: true,
                configurable: true
            });
            // Add the error code to the name to include it in the stack trace.
            this.name = `${this.name} [${sym}]`;
            // Access the stack to generate the error message including the error code
            // from the name.
            this.stack // eslint-disable-line no-unused-expressions
            ;
            // Reset the name to the actual name.
            delete this.name;
        }
    };
}
E('ERR_BUFFER_OUT_OF_BOUNDS', function(name) {
    if (name) {
        return `${name} is outside of buffer bounds`;
    }
    return 'Attempt to access memory outside buffer bounds';
}, RangeError);
E('ERR_INVALID_ARG_TYPE', function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
}, TypeError);
E('ERR_OUT_OF_RANGE', function(str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
        }
        received += 'n';
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
}, RangeError);
function addNumericalSeparator(val) {
    let res = '';
    let i = val.length;
    const start = val[0] === '-' ? 1 : 0;
    for(; i >= start + 4; i -= 3){
        res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
}
// CHECK FUNCTIONS
// ===============
function checkBounds(buf, offset, byteLength) {
    validateNumber(offset, 'offset');
    if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
        boundsError(offset, buf.length - (byteLength + 1));
    }
}
function checkIntBI(value, min, max, buf, offset, byteLength) {
    if (value > max || value < min) {
        const n = typeof min === 'bigint' ? 'n' : '';
        let range;
        if (byteLength > 3) {
            if (min === 0 || min === BigInt(0)) {
                range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
            } else {
                range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength + 1) * 8 - 1}${n}`;
            }
        } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE('value', range, value);
    }
    checkBounds(buf, offset, byteLength);
}
function validateNumber(value, name) {
    if (typeof value !== 'number') {
        throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value);
    }
}
function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value);
    }
    if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', `>= ${type ? 1 : 0} and <= ${length}`, value);
}
// HELPER FUNCTIONS
// ================
const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0];
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while(str.length % 4 !== 0){
        str = str + '=';
    }
    return str;
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for(let i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }
                // valid lead
                leadSurrogate = codePoint;
                continue;
            }
            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }
            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }
        leadSurrogate = null;
        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
            throw new Error('Invalid code point');
        }
    }
    return bytes;
}
function asciiToBytes(str) {
    const byteArray = [];
    for(let i = 0; i < str.length; ++i){
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
    }
    return byteArray;
}
function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for(let i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    let i;
    for(i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
    ;
}
// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = function() {
    const alphabet = '0123456789abcdef';
    const table = new Array(256);
    for(let i = 0; i < 16; ++i){
        const i16 = i * 16;
        for(let j = 0; j < 16; ++j){
            table[i16 + j] = alphabet[i] + alphabet[j];
        }
    }
    return table;
}();
// Return not function with Error if BigInt not supported
function defineBigIntMethod(fn) {
    return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn;
}
function BufferBigIntNotDefined() {
    throw new Error('BigInt not supported');
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8){}
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8){}
    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8){}
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8){}
    buffer[offset + i - d] |= s * 128;
};


/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function assertPath(path) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
    }
}
// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
    var res = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code;
    for(var i = 0; i <= path.length; ++i){
        if (i < path.length) code = path.charCodeAt(i);
        else if (code === 47 /*/*/ ) break;
        else code = 47 /*/*/ ;
        if (code === 47 /*/*/ ) {
            if (lastSlash === i - 1 || dots === 1) {
            // NOOP
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/  || res.charCodeAt(res.length - 2) !== 46 /*.*/ ) {
                    if (res.length > 2) {
                        var lastSlashIndex = res.lastIndexOf('/');
                        if (lastSlashIndex !== res.length - 1) {
                            if (lastSlashIndex === -1) {
                                res = '';
                                lastSegmentLength = 0;
                            } else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    } else if (res.length === 2 || res.length === 1) {
                        res = '';
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += '/..';
                    else res = '..';
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);
                else res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 /*.*/  && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep, pathObject) {
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
    if (!dir) {
        return base;
    }
    if (dir === pathObject.root) {
        return dir + base;
    }
    return dir + sep + base;
}
var posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
        var resolvedPath = '';
        var resolvedAbsolute = false;
        var cwd;
        for(var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--){
            var path;
            if (i >= 0) path = arguments[i];
            else {
                if (cwd === undefined) cwd = process.cwd();
                path = cwd;
            }
            assertPath(path);
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0) return '/' + resolvedPath;
            else return '/';
        } else if (resolvedPath.length > 0) {
            return resolvedPath;
        } else {
            return '.';
        }
    },
    normalize: function normalize(path) {
        assertPath(path);
        if (path.length === 0) return '.';
        var isAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/ ;
        // Normalize the path
        path = normalizeStringPosix(path, !isAbsolute);
        if (path.length === 0 && !isAbsolute) path = '.';
        if (path.length > 0 && trailingSeparator) path += '/';
        if (isAbsolute) return '/' + path;
        return path;
    },
    isAbsolute: function isAbsolute(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === 47 /*/*/ ;
    },
    join: function join() {
        if (arguments.length === 0) return '.';
        var joined;
        for(var i = 0; i < arguments.length; ++i){
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
                if (joined === undefined) joined = arg;
                else joined += '/' + arg;
            }
        }
        if (joined === undefined) return '.';
        return posix.normalize(joined);
    },
    relative: function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return '';
        from = posix.resolve(from);
        to = posix.resolve(to);
        if (from === to) return '';
        // Trim any leading backslashes
        var fromStart = 1;
        for(; fromStart < from.length; ++fromStart){
            if (from.charCodeAt(fromStart) !== 47 /*/*/ ) break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        var toStart = 1;
        for(; toStart < to.length; ++toStart){
            if (to.charCodeAt(toStart) !== 47 /*/*/ ) break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for(; i <= length; ++i){
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /*/*/ ) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    } else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                } else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /*/*/ ) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    } else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode) break;
            else if (fromCode === 47 /*/*/ ) lastCommonSep = i;
        }
        var out = '';
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
            if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/ ) {
                if (out.length === 0) out += '..';
                else out += '/..';
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47 /*/*/ ) ++toStart;
            return to.slice(toStart);
        }
    },
    _makeLong: function _makeLong(path) {
        return path;
    },
    dirname: function dirname(path) {
        assertPath(path);
        if (path.length === 0) return '.';
        var code = path.charCodeAt(0);
        var hasRoot = code === 47 /*/*/ ;
        var end = -1;
        var matchedSlash = true;
        for(var i = path.length - 1; i >= 1; --i){
            code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            } else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) return hasRoot ? '/' : '.';
        if (hasRoot && end === 1) return '//';
        return path.slice(0, end);
    },
    basename: function basename(path, ext) {
        if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
        assertPath(path);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return '';
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for(i = path.length - 1; i >= 0; --i){
                var code = path.charCodeAt(i);
                if (code === 47 /*/*/ ) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        } else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
        } else {
            for(i = path.length - 1; i >= 0; --i){
                if (path.charCodeAt(i) === 47 /*/*/ ) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1) return '';
            return path.slice(start, end);
        }
    },
    extname: function extname(path) {
        assertPath(path);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        for(var i = path.length - 1; i >= 0; --i){
            var code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/ ) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return '';
        }
        return path.slice(startDot, end);
    },
    format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== 'object') {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format('/', pathObject);
    },
    parse: function parse(path) {
        assertPath(path);
        var ret = {
            root: '',
            dir: '',
            base: '',
            ext: '',
            name: ''
        };
        if (path.length === 0) return ret;
        var code = path.charCodeAt(0);
        var isAbsolute = code === 47 /*/*/ ;
        var start;
        if (isAbsolute) {
            ret.root = '/';
            start = 1;
        } else {
            start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        var preDotState = 0;
        // Get non-dir info
        for(; i >= start; --i){
            code = path.charCodeAt(i);
            if (code === 47 /*/*/ ) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === 46 /*.*/ ) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1) startDot = i;
                else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
                else ret.base = ret.name = path.slice(startPart, end);
            }
        } else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            } else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute) ret.dir = '/';
        return ret;
    },
    sep: '/',
    delimiter: ':',
    win32: null,
    posix: null
};
posix.posix = posix;
module.exports = posix;


/***/ }),

/***/ "./node_modules/rusha/dist/rusha.js":
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
    if (true) module.exports = factory();
    else {}
})(typeof self !== 'undefined' ? self : this, function() {
    return /******/ function(modules) {
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/ /******/ // The require function
        /******/ function __nested_webpack_require_588__(moduleId) {
            /******/ /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) {
                /******/ return installedModules[moduleId].exports;
            /******/ }
            /******/ // Create a new module (and put it into the cache)
            /******/ var module1 = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: false,
                /******/ exports: {}
            };
            /******/ /******/ // Execute the module function
            /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __nested_webpack_require_588__);
            /******/ /******/ // Flag the module as loaded
            /******/ module1.l = true;
            /******/ /******/ // Return the exports of the module
            /******/ return module1.exports;
        /******/ }
        /******/ /******/ /******/ // expose the modules object (__webpack_modules__)
        /******/ __nested_webpack_require_588__.m = modules;
        /******/ /******/ // expose the module cache
        /******/ __nested_webpack_require_588__.c = installedModules;
        /******/ /******/ // define getter function for harmony exports
        /******/ __nested_webpack_require_588__.d = function(exports1, name, getter) {
            /******/ if (!__nested_webpack_require_588__.o(exports1, name)) {
                /******/ Object.defineProperty(exports1, name, {
                    /******/ configurable: false,
                    /******/ enumerable: true,
                    /******/ get: getter
                });
            /******/ }
        /******/ };
        /******/ /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __nested_webpack_require_588__.n = function(module1) {
            /******/ var getter = module1 && module1.__esModule ? /******/ function getDefault() {
                return module1['default'];
            } : /******/ function getModuleExports() {
                return module1;
            };
            /******/ __nested_webpack_require_588__.d(getter, 'a', getter);
            /******/ return getter;
        /******/ };
        /******/ /******/ // Object.prototype.hasOwnProperty.call
        /******/ __nested_webpack_require_588__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/ /******/ // __webpack_public_path__
        /******/ __nested_webpack_require_588__.p = "";
        /******/ /******/ // Load entry module and return exports
        /******/ return __nested_webpack_require_588__(__nested_webpack_require_588__.s = 3);
    /******/ }([
        /* 0 */ /***/ function(module1, exports1, __nested_webpack_require_3275__) {
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            /* eslint-env commonjs, browser */ var RushaCore = __nested_webpack_require_3275__(5);
            var _require = __nested_webpack_require_3275__(1), toHex = _require.toHex, ceilHeapSize = _require.ceilHeapSize;
            var conv = __nested_webpack_require_3275__(6);
            // Calculate the length of buffer that the sha1 routine uses
            // including the padding.
            var padlen = function(len) {
                for(len += 9; len % 64 > 0; len += 1){}
                return len;
            };
            var padZeroes = function(bin, len) {
                var h8 = new Uint8Array(bin.buffer);
                var om = len % 4, align = len - om;
                switch(om){
                    case 0:
                        h8[align + 3] = 0;
                    case 1:
                        h8[align + 2] = 0;
                    case 2:
                        h8[align + 1] = 0;
                    case 3:
                        h8[align + 0] = 0;
                }
                for(var i = (len >> 2) + 1; i < bin.length; i++){
                    bin[i] = 0;
                }
            };
            var padData = function(bin, chunkLen, msgLen) {
                bin[chunkLen >> 2] |= 0x80 << 24 - (chunkLen % 4 << 3);
                // To support msgLen >= 2 GiB, use a float division when computing the
                // high 32-bits of the big-endian message length in bits.
                bin[((chunkLen >> 2) + 2 & ~0x0f) + 14] = msgLen / (1 << 29) | 0;
                bin[((chunkLen >> 2) + 2 & ~0x0f) + 15] = msgLen << 3;
            };
            var getRawDigest = function(heap, padMaxChunkLen) {
                var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
                var out = new Int32Array(5);
                var arr = new DataView(out.buffer);
                arr.setInt32(0, io[0], false);
                arr.setInt32(4, io[1], false);
                arr.setInt32(8, io[2], false);
                arr.setInt32(12, io[3], false);
                arr.setInt32(16, io[4], false);
                return out;
            };
            var Rusha = function() {
                function Rusha(chunkSize) {
                    _classCallCheck(this, Rusha);
                    chunkSize = chunkSize || 64 * 1024;
                    if (chunkSize % 64 > 0) {
                        throw new Error('Chunk size must be a multiple of 128 bit');
                    }
                    this._offset = 0;
                    this._maxChunkLen = chunkSize;
                    this._padMaxChunkLen = padlen(chunkSize);
                    // The size of the heap is the sum of:
                    // 1. The padded input message size
                    // 2. The extended space the algorithm needs (320 byte)
                    // 3. The 160 bit state the algoritm uses
                    this._heap = new ArrayBuffer(ceilHeapSize(this._padMaxChunkLen + 320 + 20));
                    this._h32 = new Int32Array(this._heap);
                    this._h8 = new Int8Array(this._heap);
                    this._core = new RushaCore({
                        Int32Array: Int32Array
                    }, {}, this._heap);
                }
                Rusha.prototype._initState = function _initState(heap, padMsgLen) {
                    this._offset = 0;
                    var io = new Int32Array(heap, padMsgLen + 320, 5);
                    io[0] = 1732584193;
                    io[1] = -271733879;
                    io[2] = -1732584194;
                    io[3] = 271733878;
                    io[4] = -1009589776;
                };
                Rusha.prototype._padChunk = function _padChunk(chunkLen, msgLen) {
                    var padChunkLen = padlen(chunkLen);
                    var view = new Int32Array(this._heap, 0, padChunkLen >> 2);
                    padZeroes(view, chunkLen);
                    padData(view, chunkLen, msgLen);
                    return padChunkLen;
                };
                Rusha.prototype._write = function _write(data, chunkOffset, chunkLen, off) {
                    conv(data, this._h8, this._h32, chunkOffset, chunkLen, off || 0);
                };
                Rusha.prototype._coreCall = function _coreCall(data, chunkOffset, chunkLen, msgLen, finalize) {
                    var padChunkLen = chunkLen;
                    this._write(data, chunkOffset, chunkLen);
                    if (finalize) {
                        padChunkLen = this._padChunk(chunkLen, msgLen);
                    }
                    this._core.hash(padChunkLen, this._padMaxChunkLen);
                };
                Rusha.prototype.rawDigest = function rawDigest(str) {
                    var msgLen = str.byteLength || str.length || str.size || 0;
                    this._initState(this._heap, this._padMaxChunkLen);
                    var chunkOffset = 0, chunkLen = this._maxChunkLen;
                    for(chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen){
                        this._coreCall(str, chunkOffset, chunkLen, msgLen, false);
                    }
                    this._coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
                    return getRawDigest(this._heap, this._padMaxChunkLen);
                };
                Rusha.prototype.digest = function digest(str) {
                    return toHex(this.rawDigest(str).buffer);
                };
                Rusha.prototype.digestFromString = function digestFromString(str) {
                    return this.digest(str);
                };
                Rusha.prototype.digestFromBuffer = function digestFromBuffer(str) {
                    return this.digest(str);
                };
                Rusha.prototype.digestFromArrayBuffer = function digestFromArrayBuffer(str) {
                    return this.digest(str);
                };
                Rusha.prototype.resetState = function resetState() {
                    this._initState(this._heap, this._padMaxChunkLen);
                    return this;
                };
                Rusha.prototype.append = function append(chunk) {
                    var chunkOffset = 0;
                    var chunkLen = chunk.byteLength || chunk.length || chunk.size || 0;
                    var turnOffset = this._offset % this._maxChunkLen;
                    var inputLen = void 0;
                    this._offset += chunkLen;
                    while(chunkOffset < chunkLen){
                        inputLen = Math.min(chunkLen - chunkOffset, this._maxChunkLen - turnOffset);
                        this._write(chunk, chunkOffset, inputLen, turnOffset);
                        turnOffset += inputLen;
                        chunkOffset += inputLen;
                        if (turnOffset === this._maxChunkLen) {
                            this._core.hash(this._maxChunkLen, this._padMaxChunkLen);
                            turnOffset = 0;
                        }
                    }
                    return this;
                };
                Rusha.prototype.getState = function getState() {
                    var turnOffset = this._offset % this._maxChunkLen;
                    var heap = void 0;
                    if (!turnOffset) {
                        var io = new Int32Array(this._heap, this._padMaxChunkLen + 320, 5);
                        heap = io.buffer.slice(io.byteOffset, io.byteOffset + io.byteLength);
                    } else {
                        heap = this._heap.slice(0);
                    }
                    return {
                        offset: this._offset,
                        heap: heap
                    };
                };
                Rusha.prototype.setState = function setState(state) {
                    this._offset = state.offset;
                    if (state.heap.byteLength === 20) {
                        var io = new Int32Array(this._heap, this._padMaxChunkLen + 320, 5);
                        io.set(new Int32Array(state.heap));
                    } else {
                        this._h32.set(new Int32Array(state.heap));
                    }
                    return this;
                };
                Rusha.prototype.rawEnd = function rawEnd() {
                    var msgLen = this._offset;
                    var chunkLen = msgLen % this._maxChunkLen;
                    var padChunkLen = this._padChunk(chunkLen, msgLen);
                    this._core.hash(padChunkLen, this._padMaxChunkLen);
                    var result = getRawDigest(this._heap, this._padMaxChunkLen);
                    this._initState(this._heap, this._padMaxChunkLen);
                    return result;
                };
                Rusha.prototype.end = function end() {
                    return toHex(this.rawEnd().buffer);
                };
                return Rusha;
            }();
            module1.exports = Rusha;
            module1.exports._core = RushaCore;
        /***/ },
        /* 1 */ /***/ function(module1, exports1) {
            /* eslint-env commonjs, browser */ //
            // toHex
            //
            var precomputedHex = new Array(256);
            for(var i = 0; i < 256; i++){
                precomputedHex[i] = (i < 0x10 ? '0' : '') + i.toString(16);
            }
            module1.exports.toHex = function(arrayBuffer) {
                var binarray = new Uint8Array(arrayBuffer);
                var res = new Array(arrayBuffer.byteLength);
                for(var _i = 0; _i < res.length; _i++){
                    res[_i] = precomputedHex[binarray[_i]];
                }
                return res.join('');
            };
            //
            // ceilHeapSize
            //
            module1.exports.ceilHeapSize = function(v) {
                // The asm.js spec says:
                // The heap object's byteLength must be either
                // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
                // Also, byteLengths smaller than 2^16 are deprecated.
                var p = 0;
                // If v is smaller than 2^16, the smallest possible solution
                // is 2^16.
                if (v <= 65536) return 65536;
                // If v < 2^24, we round up to 2^n,
                // otherwise we round up to 2^24 * n.
                if (v < 16777216) {
                    for(p = 1; p < v; p = p << 1){}
                } else {
                    for(p = 16777216; p < v; p += 16777216){}
                }
                return p;
            };
            //
            // isDedicatedWorkerScope
            //
            module1.exports.isDedicatedWorkerScope = function(self1) {
                var isRunningInWorker = 'WorkerGlobalScope' in self1 && self1 instanceof self1.WorkerGlobalScope;
                var isRunningInSharedWorker = 'SharedWorkerGlobalScope' in self1 && self1 instanceof self1.SharedWorkerGlobalScope;
                var isRunningInServiceWorker = 'ServiceWorkerGlobalScope' in self1 && self1 instanceof self1.ServiceWorkerGlobalScope;
                // Detects whether we run inside a dedicated worker or not.
                //
                // We can't just check for `DedicatedWorkerGlobalScope`, since IE11
                // has a bug where it only supports `WorkerGlobalScope`.
                //
                // Therefore, we consider us as running inside a dedicated worker
                // when we are running inside a worker, but not in a shared or service worker.
                //
                // When new types of workers are introduced, we will need to adjust this code.
                return isRunningInWorker && !isRunningInSharedWorker && !isRunningInServiceWorker;
            };
        /***/ },
        /* 2 */ /***/ function(module1, exports1, __nested_webpack_require_15381__) {
            /* eslint-env commonjs, worker */ module1.exports = function() {
                var Rusha = __nested_webpack_require_15381__(0);
                var hashData = function(hasher, data, cb) {
                    try {
                        return cb(null, hasher.digest(data));
                    } catch (e) {
                        return cb(e);
                    }
                };
                var hashFile = function(hasher, readTotal, blockSize, file, cb) {
                    var reader = new self.FileReader();
                    reader.onloadend = function onloadend() {
                        if (reader.error) {
                            return cb(reader.error);
                        }
                        var buffer = reader.result;
                        readTotal += reader.result.byteLength;
                        try {
                            hasher.append(buffer);
                        } catch (e) {
                            cb(e);
                            return;
                        }
                        if (readTotal < file.size) {
                            hashFile(hasher, readTotal, blockSize, file, cb);
                        } else {
                            cb(null, hasher.end());
                        }
                    };
                    reader.readAsArrayBuffer(file.slice(readTotal, readTotal + blockSize));
                };
                var workerBehaviourEnabled = true;
                self.onmessage = function(event) {
                    if (!workerBehaviourEnabled) {
                        return;
                    }
                    var data = event.data.data, file = event.data.file, id = event.data.id;
                    if (typeof id === 'undefined') return;
                    if (!file && !data) return;
                    var blockSize = event.data.blockSize || 4 * 1024 * 1024;
                    var hasher = new Rusha(blockSize);
                    hasher.resetState();
                    var done = function(err, hash) {
                        if (!err) {
                            self.postMessage({
                                id: id,
                                hash: hash
                            });
                        } else {
                            self.postMessage({
                                id: id,
                                error: err.name
                            });
                        }
                    };
                    if (data) hashData(hasher, data, done);
                    if (file) hashFile(hasher, 0, blockSize, file, done);
                };
                return function() {
                    workerBehaviourEnabled = false;
                };
            };
        /***/ },
        /* 3 */ /***/ function(module1, exports1, __nested_webpack_require_18245__) {
            /* eslint-env commonjs, browser */ var work = __nested_webpack_require_18245__(4);
            var Rusha = __nested_webpack_require_18245__(0);
            var createHash = __nested_webpack_require_18245__(7);
            var runWorker = __nested_webpack_require_18245__(2);
            var _require = __nested_webpack_require_18245__(1), isDedicatedWorkerScope = _require.isDedicatedWorkerScope;
            var isRunningInDedicatedWorker = typeof self !== 'undefined' && isDedicatedWorkerScope(self);
            Rusha.disableWorkerBehaviour = isRunningInDedicatedWorker ? runWorker() : function() {};
            Rusha.createWorker = function() {
                var worker = work(/*require.resolve*/ (2));
                var terminate = worker.terminate;
                worker.terminate = function() {
                    URL.revokeObjectURL(worker.objectURL);
                    terminate.call(worker);
                };
                return worker;
            };
            Rusha.createHash = createHash;
            module1.exports = Rusha;
        /***/ },
        /* 4 */ /***/ function(module1, exports1, __nested_webpack_require_19338__) {
            function webpackBootstrapFunc(modules) {
                /******/ // The module cache
                /******/ var installedModules = {};
                /******/ // The require function
                /******/ function __nested_webpack_require_19585__(moduleId) {
                    /******/ // Check if module is in cache
                    /******/ if (installedModules[moduleId]) /******/ return installedModules[moduleId].exports;
                    /******/ // Create a new module (and put it into the cache)
                    /******/ var module1 = installedModules[moduleId] = {
                        /******/ i: moduleId,
                        /******/ l: false,
                        /******/ exports: {}
                    };
                    /******/ // Execute the module function
                    /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __nested_webpack_require_19585__);
                    /******/ // Flag the module as loaded
                    /******/ module1.l = true;
                    /******/ // Return the exports of the module
                    /******/ return module1.exports;
                /******/ }
                /******/ // expose the modules object (__webpack_modules__)
                /******/ __nested_webpack_require_19585__.m = modules;
                /******/ // expose the module cache
                /******/ __nested_webpack_require_19585__.c = installedModules;
                /******/ // identity function for calling harmony imports with the correct context
                /******/ __nested_webpack_require_19585__.i = function(value) {
                    return value;
                };
                /******/ // define getter function for harmony exports
                /******/ __nested_webpack_require_19585__.d = function(exports1, name, getter) {
                    /******/ if (!__nested_webpack_require_19585__.o(exports1, name)) {
                        /******/ Object.defineProperty(exports1, name, {
                            /******/ configurable: false,
                            /******/ enumerable: true,
                            /******/ get: getter
                        });
                    /******/ }
                /******/ };
                /******/ // define __esModule on exports
                /******/ __nested_webpack_require_19585__.r = function(exports1) {
                    /******/ Object.defineProperty(exports1, '__esModule', {
                        value: true
                    });
                /******/ };
                /******/ // getDefaultExport function for compatibility with non-harmony modules
                /******/ __nested_webpack_require_19585__.n = function(module1) {
                    /******/ var getter = module1 && module1.__esModule ? /******/ function getDefault() {
                        return module1['default'];
                    } : /******/ function getModuleExports() {
                        return module1;
                    };
                    /******/ __nested_webpack_require_19585__.d(getter, 'a', getter);
                    /******/ return getter;
                /******/ };
                /******/ // Object.prototype.hasOwnProperty.call
                /******/ __nested_webpack_require_19585__.o = function(object, property) {
                    return Object.prototype.hasOwnProperty.call(object, property);
                };
                /******/ // __webpack_public_path__
                /******/ __nested_webpack_require_19585__.p = "/";
                /******/ // on error function for async loading
                /******/ __nested_webpack_require_19585__.oe = function(err) {
                    console.error(err);
                    throw err;
                };
                var f = __nested_webpack_require_19585__(__nested_webpack_require_19585__.s = ENTRY_MODULE);
                return f.default || f // try to call default if defined to also support babel esmodule exports
                ;
            }
            var moduleNameReqExp = '[\\.|\\-|\\+|\\w|\/|@]+';
            var dependencyRegExp = '\\((\/\\*.*?\\*\/)?\s?.*?(' + moduleNameReqExp + ').*?\\)' // additional chars when output.pathinfo is true
            ;
            // http://stackoverflow.com/a/2593661/130442
            function quoteRegExp(str) {
                return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
            }
            function getModuleDependencies(sources, module1, queueName) {
                var retval = {};
                retval[queueName] = [];
                var fnString = module1.toString();
                var wrapperSignature = fnString.match(/^function\s?\(\w+,\s*\w+,\s*(\w+)\)/);
                if (!wrapperSignature) return retval;
                var webpackRequireName = wrapperSignature[1];
                // main bundle deps
                var re = new RegExp('(\\\\n|\\W)' + quoteRegExp(webpackRequireName) + dependencyRegExp, 'g');
                var match;
                while(match = re.exec(fnString)){
                    if (match[3] === 'dll-reference') continue;
                    retval[queueName].push(match[3]);
                }
                // dll deps
                re = new RegExp('\\(' + quoteRegExp(webpackRequireName) + '\\("(dll-reference\\s(' + moduleNameReqExp + '))"\\)\\)' + dependencyRegExp, 'g');
                while(match = re.exec(fnString)){
                    if (!sources[match[2]]) {
                        retval[queueName].push(match[1]);
                        sources[match[2]] = __nested_webpack_require_19338__(match[1]).m;
                    }
                    retval[match[2]] = retval[match[2]] || [];
                    retval[match[2]].push(match[4]);
                }
                return retval;
            }
            function hasValuesInQueues(queues) {
                var keys = Object.keys(queues);
                return keys.reduce(function(hasValues, key) {
                    return hasValues || queues[key].length > 0;
                }, false);
            }
            function getRequiredModules(sources, moduleId) {
                var modulesQueue = {
                    main: [
                        moduleId
                    ]
                };
                var requiredModules = {
                    main: []
                };
                var seenModules = {
                    main: {}
                };
                while(hasValuesInQueues(modulesQueue)){
                    var queues = Object.keys(modulesQueue);
                    for(var i = 0; i < queues.length; i++){
                        var queueName = queues[i];
                        var queue = modulesQueue[queueName];
                        var moduleToCheck = queue.pop();
                        seenModules[queueName] = seenModules[queueName] || {};
                        if (seenModules[queueName][moduleToCheck] || !sources[queueName][moduleToCheck]) continue;
                        seenModules[queueName][moduleToCheck] = true;
                        requiredModules[queueName] = requiredModules[queueName] || [];
                        requiredModules[queueName].push(moduleToCheck);
                        var newModules = getModuleDependencies(sources, sources[queueName][moduleToCheck], queueName);
                        var newModulesKeys = Object.keys(newModules);
                        for(var j = 0; j < newModulesKeys.length; j++){
                            modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]] || [];
                            modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]].concat(newModules[newModulesKeys[j]]);
                        }
                    }
                }
                return requiredModules;
            }
            module1.exports = function(moduleId, options) {
                options = options || {};
                var sources = {
                    main: __nested_webpack_require_19338__.m
                };
                var requiredModules = options.all ? {
                    main: Object.keys(sources)
                } : getRequiredModules(sources, moduleId);
                var src = '';
                Object.keys(requiredModules).filter(function(m) {
                    return m !== 'main';
                }).forEach(function(module1) {
                    var entryModule = 0;
                    while(requiredModules[module1][entryModule]){
                        entryModule++;
                    }
                    requiredModules[module1].push(entryModule);
                    sources[module1][entryModule] = '(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })';
                    src = src + 'var ' + module1 + ' = (' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(entryModule)) + ')({' + requiredModules[module1].map(function(id) {
                        return '' + JSON.stringify(id) + ': ' + sources[module1][id].toString();
                    }).join(',') + '});\n';
                });
                src = src + '(' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(moduleId)) + ')({' + requiredModules.main.map(function(id) {
                    return '' + JSON.stringify(id) + ': ' + sources.main[id].toString();
                }).join(',') + '})(self);';
                var blob = new window.Blob([
                    src
                ], {
                    type: 'text/javascript'
                });
                if (options.bare) {
                    return blob;
                }
                var URL1 = window.URL || window.webkitURL || window.mozURL || window.msURL;
                var workerUrl = URL1.createObjectURL(blob);
                var worker = new window.Worker(workerUrl);
                worker.objectURL = workerUrl;
                return worker;
            };
        /***/ },
        /* 5 */ /***/ function(module1, exports1) {
            // The low-level RushCore module provides the heart of Rusha,
            // a high-speed sha1 implementation working on an Int32Array heap.
            // At first glance, the implementation seems complicated, however
            // with the SHA1 spec at hand, it is obvious this almost a textbook
            // implementation that has a few functions hand-inlined and a few loops
            // hand-unrolled.
            module1.exports = function RushaCore(stdlib$840, foreign$841, heap$842) {
                'use asm';
                var H$843 = new stdlib$840.Int32Array(heap$842);
                function hash$844(k$845, x$846) {
                    // k in bytes
                    k$845 = k$845 | 0;
                    x$846 = x$846 | 0;
                    var i$847 = 0, j$848 = 0, y0$849 = 0, z0$850 = 0, y1$851 = 0, z1$852 = 0, y2$853 = 0, z2$854 = 0, y3$855 = 0, z3$856 = 0, y4$857 = 0, z4$858 = 0, t0$859 = 0, t1$860 = 0;
                    y0$849 = H$843[x$846 + 320 >> 2] | 0;
                    y1$851 = H$843[x$846 + 324 >> 2] | 0;
                    y2$853 = H$843[x$846 + 328 >> 2] | 0;
                    y3$855 = H$843[x$846 + 332 >> 2] | 0;
                    y4$857 = H$843[x$846 + 336 >> 2] | 0;
                    for(i$847 = 0; (i$847 | 0) < (k$845 | 0); i$847 = i$847 + 64 | 0){
                        z0$850 = y0$849;
                        z1$852 = y1$851;
                        z2$854 = y2$853;
                        z3$856 = y3$855;
                        z4$858 = y4$857;
                        for(j$848 = 0; (j$848 | 0) < 64; j$848 = j$848 + 4 | 0){
                            t1$860 = H$843[i$847 + j$848 >> 2] | 0;
                            t0$859 = ((y0$849 << 5 | y0$849 >>> 27) + (y1$851 & y2$853 | ~y1$851 & y3$855) | 0) + ((t1$860 + y4$857 | 0) + 1518500249 | 0) | 0;
                            y4$857 = y3$855;
                            y3$855 = y2$853;
                            y2$853 = y1$851 << 30 | y1$851 >>> 2;
                            y1$851 = y0$849;
                            y0$849 = t0$859;
                            H$843[k$845 + j$848 >> 2] = t1$860;
                        }
                        for(j$848 = k$845 + 64 | 0; (j$848 | 0) < (k$845 + 80 | 0); j$848 = j$848 + 4 | 0){
                            t1$860 = (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) << 1 | (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) >>> 31;
                            t0$859 = ((y0$849 << 5 | y0$849 >>> 27) + (y1$851 & y2$853 | ~y1$851 & y3$855) | 0) + ((t1$860 + y4$857 | 0) + 1518500249 | 0) | 0;
                            y4$857 = y3$855;
                            y3$855 = y2$853;
                            y2$853 = y1$851 << 30 | y1$851 >>> 2;
                            y1$851 = y0$849;
                            y0$849 = t0$859;
                            H$843[j$848 >> 2] = t1$860;
                        }
                        for(j$848 = k$845 + 80 | 0; (j$848 | 0) < (k$845 + 160 | 0); j$848 = j$848 + 4 | 0){
                            t1$860 = (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) << 1 | (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) >>> 31;
                            t0$859 = ((y0$849 << 5 | y0$849 >>> 27) + (y1$851 ^ y2$853 ^ y3$855) | 0) + ((t1$860 + y4$857 | 0) + 1859775393 | 0) | 0;
                            y4$857 = y3$855;
                            y3$855 = y2$853;
                            y2$853 = y1$851 << 30 | y1$851 >>> 2;
                            y1$851 = y0$849;
                            y0$849 = t0$859;
                            H$843[j$848 >> 2] = t1$860;
                        }
                        for(j$848 = k$845 + 160 | 0; (j$848 | 0) < (k$845 + 240 | 0); j$848 = j$848 + 4 | 0){
                            t1$860 = (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) << 1 | (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) >>> 31;
                            t0$859 = ((y0$849 << 5 | y0$849 >>> 27) + (y1$851 & y2$853 | y1$851 & y3$855 | y2$853 & y3$855) | 0) + ((t1$860 + y4$857 | 0) - 1894007588 | 0) | 0;
                            y4$857 = y3$855;
                            y3$855 = y2$853;
                            y2$853 = y1$851 << 30 | y1$851 >>> 2;
                            y1$851 = y0$849;
                            y0$849 = t0$859;
                            H$843[j$848 >> 2] = t1$860;
                        }
                        for(j$848 = k$845 + 240 | 0; (j$848 | 0) < (k$845 + 320 | 0); j$848 = j$848 + 4 | 0){
                            t1$860 = (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) << 1 | (H$843[j$848 - 12 >> 2] ^ H$843[j$848 - 32 >> 2] ^ H$843[j$848 - 56 >> 2] ^ H$843[j$848 - 64 >> 2]) >>> 31;
                            t0$859 = ((y0$849 << 5 | y0$849 >>> 27) + (y1$851 ^ y2$853 ^ y3$855) | 0) + ((t1$860 + y4$857 | 0) - 899497514 | 0) | 0;
                            y4$857 = y3$855;
                            y3$855 = y2$853;
                            y2$853 = y1$851 << 30 | y1$851 >>> 2;
                            y1$851 = y0$849;
                            y0$849 = t0$859;
                            H$843[j$848 >> 2] = t1$860;
                        }
                        y0$849 = y0$849 + z0$850 | 0;
                        y1$851 = y1$851 + z1$852 | 0;
                        y2$853 = y2$853 + z2$854 | 0;
                        y3$855 = y3$855 + z3$856 | 0;
                        y4$857 = y4$857 + z4$858 | 0;
                    }
                    H$843[x$846 + 320 >> 2] = y0$849;
                    H$843[x$846 + 324 >> 2] = y1$851;
                    H$843[x$846 + 328 >> 2] = y2$853;
                    H$843[x$846 + 332 >> 2] = y3$855;
                    H$843[x$846 + 336 >> 2] = y4$857;
                }
                return {
                    hash: hash$844
                };
            };
        /***/ },
        /* 6 */ /***/ function(module1, exports1) {
            var _this = this;
            /* eslint-env commonjs, browser */ var reader = void 0;
            if (typeof self !== 'undefined' && typeof self.FileReaderSync !== 'undefined') {
                reader = new self.FileReaderSync();
            }
            // Convert a binary string and write it to the heap.
            // A binary string is expected to only contain char codes < 256.
            var convStr = function(str, H8, H32, start, len, off) {
                var i = void 0, om = off % 4, lm = (len + om) % 4, j = len - lm;
                switch(om){
                    case 0:
                        H8[off] = str.charCodeAt(start + 3);
                    case 1:
                        H8[off + 1 - (om << 1) | 0] = str.charCodeAt(start + 2);
                    case 2:
                        H8[off + 2 - (om << 1) | 0] = str.charCodeAt(start + 1);
                    case 3:
                        H8[off + 3 - (om << 1) | 0] = str.charCodeAt(start);
                }
                if (len < lm + (4 - om)) {
                    return;
                }
                for(i = 4 - om; i < j; i = i + 4 | 0){
                    H32[off + i >> 2] = str.charCodeAt(start + i) << 24 | str.charCodeAt(start + i + 1) << 16 | str.charCodeAt(start + i + 2) << 8 | str.charCodeAt(start + i + 3);
                }
                switch(lm){
                    case 3:
                        H8[off + j + 1 | 0] = str.charCodeAt(start + j + 2);
                    case 2:
                        H8[off + j + 2 | 0] = str.charCodeAt(start + j + 1);
                    case 1:
                        H8[off + j + 3 | 0] = str.charCodeAt(start + j);
                }
            };
            // Convert a buffer or array and write it to the heap.
            // The buffer or array is expected to only contain elements < 256.
            var convBuf = function(buf, H8, H32, start, len, off) {
                var i = void 0, om = off % 4, lm = (len + om) % 4, j = len - lm;
                switch(om){
                    case 0:
                        H8[off] = buf[start + 3];
                    case 1:
                        H8[off + 1 - (om << 1) | 0] = buf[start + 2];
                    case 2:
                        H8[off + 2 - (om << 1) | 0] = buf[start + 1];
                    case 3:
                        H8[off + 3 - (om << 1) | 0] = buf[start];
                }
                if (len < lm + (4 - om)) {
                    return;
                }
                for(i = 4 - om; i < j; i = i + 4 | 0){
                    H32[off + i >> 2 | 0] = buf[start + i] << 24 | buf[start + i + 1] << 16 | buf[start + i + 2] << 8 | buf[start + i + 3];
                }
                switch(lm){
                    case 3:
                        H8[off + j + 1 | 0] = buf[start + j + 2];
                    case 2:
                        H8[off + j + 2 | 0] = buf[start + j + 1];
                    case 1:
                        H8[off + j + 3 | 0] = buf[start + j];
                }
            };
            var convBlob = function(blob, H8, H32, start, len, off) {
                var i = void 0, om = off % 4, lm = (len + om) % 4, j = len - lm;
                var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
                switch(om){
                    case 0:
                        H8[off] = buf[3];
                    case 1:
                        H8[off + 1 - (om << 1) | 0] = buf[2];
                    case 2:
                        H8[off + 2 - (om << 1) | 0] = buf[1];
                    case 3:
                        H8[off + 3 - (om << 1) | 0] = buf[0];
                }
                if (len < lm + (4 - om)) {
                    return;
                }
                for(i = 4 - om; i < j; i = i + 4 | 0){
                    H32[off + i >> 2 | 0] = buf[i] << 24 | buf[i + 1] << 16 | buf[i + 2] << 8 | buf[i + 3];
                }
                switch(lm){
                    case 3:
                        H8[off + j + 1 | 0] = buf[j + 2];
                    case 2:
                        H8[off + j + 2 | 0] = buf[j + 1];
                    case 1:
                        H8[off + j + 3 | 0] = buf[j];
                }
            };
            module1.exports = function(data, H8, H32, start, len, off) {
                if (typeof data === 'string') {
                    return convStr(data, H8, H32, start, len, off);
                }
                if (data instanceof Array) {
                    return convBuf(data, H8, H32, start, len, off);
                }
                // Safely doing a Buffer check using "this" to avoid Buffer polyfill to be included in the dist
                if (_this && _this.Buffer && _this.Buffer.isBuffer(data)) {
                    return convBuf(data, H8, H32, start, len, off);
                }
                if (data instanceof ArrayBuffer) {
                    return convBuf(new Uint8Array(data), H8, H32, start, len, off);
                }
                if (data.buffer instanceof ArrayBuffer) {
                    return convBuf(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), H8, H32, start, len, off);
                }
                if (data instanceof Blob) {
                    return convBlob(data, H8, H32, start, len, off);
                }
                throw new Error('Unsupported data type.');
            };
        /***/ },
        /* 7 */ /***/ function(module1, exports1, __nested_webpack_require_41097__) {
            var _createClass = function() {
                function defineProperties(target, props) {
                    for(var i = 0; i < props.length; i++){
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            /* eslint-env commonjs, browser */ var Rusha = __nested_webpack_require_41097__(0);
            var _require = __nested_webpack_require_41097__(1), toHex = _require.toHex;
            var Hash = function() {
                function Hash() {
                    _classCallCheck(this, Hash);
                    this._rusha = new Rusha();
                    this._rusha.resetState();
                }
                Hash.prototype.update = function update(data) {
                    this._rusha.append(data);
                    return this;
                };
                Hash.prototype.digest = function digest(encoding) {
                    var digest = this._rusha.rawEnd().buffer;
                    if (!encoding) {
                        return digest;
                    }
                    if (encoding === 'hex') {
                        return toHex(digest);
                    }
                    throw new Error('unsupported digest encoding');
                };
                _createClass(Hash, [
                    {
                        key: 'state',
                        get: function() {
                            return this._rusha.getState();
                        },
                        set: function(state) {
                            this._rusha.setState(state);
                        }
                    }
                ]);
                return Hash;
            }();
            module1.exports = function() {
                return new Hash();
            };
        /***/ }
    ]);
});


/***/ }),

/***/ "./node_modules/simple-sha1/browser.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global self */ const Rusha = __webpack_require__("./node_modules/rusha/dist/rusha.js");
const rushaWorkerSha1 = __webpack_require__("./node_modules/simple-sha1/rusha-worker-sha1.js");
const rusha = new Rusha();
const scope = typeof window !== 'undefined' ? window : self;
const crypto = scope.crypto || scope.msCrypto || {};
let subtle = crypto.subtle || crypto.webkitSubtle;
function sha1sync(buf) {
    return rusha.digest(buf);
}
// Browsers throw if they lack support for an algorithm.
// Promise will be rejected on non-secure origins. (http://goo.gl/lq4gCo)
try {
    subtle.digest({
        name: 'sha-1'
    }, new Uint8Array()).catch(function() {
        subtle = false;
    });
} catch (err) {
    subtle = false;
}
function sha1(buf, cb) {
    if (!subtle) {
        if (typeof window !== 'undefined') {
            rushaWorkerSha1(buf, function onRushaWorkerSha1(err, hash) {
                if (err) {
                    // On error, fallback to synchronous method which cannot fail
                    cb(sha1sync(buf));
                    return;
                }
                cb(hash);
            });
        } else {
            queueMicrotask(()=>cb(sha1sync(buf)));
        }
        return;
    }
    if (typeof buf === 'string') {
        buf = uint8array(buf);
    }
    subtle.digest({
        name: 'sha-1'
    }, buf).then(function succeed(result) {
        cb(hex(new Uint8Array(result)));
    }, function fail() {
        // On error, fallback to synchronous method which cannot fail
        cb(sha1sync(buf));
    });
}
function uint8array(s) {
    const l = s.length;
    const array = new Uint8Array(l);
    for(let i = 0; i < l; i++){
        array[i] = s.charCodeAt(i);
    }
    return array;
}
function hex(buf) {
    const l = buf.length;
    const chars = [];
    for(let i = 0; i < l; i++){
        const bite = buf[i];
        chars.push((bite >>> 4).toString(16));
        chars.push((bite & 0x0f).toString(16));
    }
    return chars.join('');
}
module.exports = sha1;
module.exports.sync = sha1sync;


/***/ }),

/***/ "./node_modules/simple-sha1/rusha-worker-sha1.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Rusha = __webpack_require__("./node_modules/rusha/dist/rusha.js");
let worker;
let nextTaskId;
let cbs;
function init() {
    worker = Rusha.createWorker();
    nextTaskId = 1;
    cbs = {} // taskId -> cb
    ;
    worker.onmessage = function onRushaMessage(e) {
        const taskId = e.data.id;
        const cb = cbs[taskId];
        delete cbs[taskId];
        if (e.data.error != null) {
            cb(new Error('Rusha worker error: ' + e.data.error));
        } else {
            cb(null, e.data.hash);
        }
    };
}
function sha1(buf, cb) {
    if (!worker) init();
    cbs[nextTaskId] = cb;
    worker.postMessage({
        id: nextTaskId,
        data: buf
    });
    nextTaskId += 1;
}
module.exports = sha1;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./src/inserts/checkForTrumpsButton.ts
function checkForTrumpsButton() {
    const existing = $("#check-for-no-intro-trumps-button");
    const button = existing.length > 0 ? existing : $(`<input id="check-for-no-intro-trumps-button" type="button" value="Check for No-Intro Trumps" style="background: hotpink; color: black; font-weight: bold; margin-left: 10px;"/>`);
    const progress = (text)=>{
        button.val(text);
    };
    const disable = ()=>{
        button.prop("disabled", true);
        button.css("background-color", "pink");
        button.css("color", "darkslategray");
        button.css("box-shadow", "none");
    };
    const insert = ()=>{
        button.detach();
        $(".torrent_table > tbody > tr:first-child > td:first-child").first().append(button);
    };
    return {
        disable,
        progress,
        insert,
        button
    };
}

;// CONCATENATED MODULE: ./src/utils/dom/extractNoIntroLinkFromDescription.ts
// Being strict here to avoid No-Intro IP bans
const NO_INTRO_ROM_LINK_REGEX = /^https?:\/\/datomatic\.no-intro\.org\/(index\.php)?\?page=show_record&s=\d+&n=[a-z]?\d+$/i;
const IN_DESC_NO_INTRO_ROM_LINK_REGEX = /https?:\/\/datomatic\.no-intro\.org\/(index\.php)?\?page=show_record&s=\d+&n=[a-z]?\d+/i;
function extractNoIntroLinkFromDescription(torrentId) {
    const links = $(`#torrent_${torrentId} #description a`);
    let found = links.map(function() {
        return $(this).attr("href");
    }).get().find((link)=>NO_INTRO_ROM_LINK_REGEX.test(link));
    if (!found) {
        // Try to find the link in the description,
        // happens when the [url] bbcode tag is not used/botched
        const description = $(`#torrent_${torrentId} #description`).text();
        const match = description.match(IN_DESC_NO_INTRO_ROM_LINK_REGEX);
        found = match ? match[0] : undefined;
    }
    // Normalize
    try {
        const url = new URL(found);
        url.protocol = "https:"; // Rarely descriptions have the http protocol
        url.pathname = "/index.php";
        return url.toString();
    } catch  {
        return undefined;
    }
}

;// CONCATENATED MODULE: ./src/utils/dom/getNoIntroTorrentsOnPage.ts

function notFalse(x) {
    return x !== false;
}
function getNoIntroTorrentsOnPage() {
    return $('a[title="Permalink"]').map(function() {
        const torrentId = new URLSearchParams($(this).attr("href").replace("torrents.php", "")).get("torrentid");
        const noIntroLink = extractNoIntroLinkFromDescription(torrentId);
        if (!noIntroLink) {
            return false;
        }
        const reported = $(this).parent().parent().find(".reported_label").text() === "Reported";
        return {
            torrentId,
            a: $(this),
            noIntroLink,
            reported,
            permalink: window.location.origin + "/" + $(this).attr("href"),
            platform: $("#groupplatform").text()
        };
    }).get().filter(notFalse);
}

;// CONCATENATED MODULE: ./src/inserts/insertAddCopyHelpers.ts

function addCopyHref(noIntroLink, edition) {
    const groupId = new URLSearchParams(window.location.search).get("id");
    const params = new URLSearchParams();
    params.set("groupid", groupId);
    params.set("no-intro", noIntroLink);
    if (edition) {
        params.set("edition", edition);
    }
    return `upload.php?${params.toString()}`;
}
function insertAddCopyHelpers() {
    getNoIntroTorrentsOnPage().forEach((param)=>{
        let { torrentId , a , noIntroLink  } = param;
        // Extract edition information
        const editionInfo = a.parents(".group_torrent").parent().prev().find(".group_torrent > td > strong").text();
        const [editionYear, ...rest] = editionInfo.split(" - ");
        const editionName = rest.join(" - ");
        const formatedEditionInfo = `${editionName} (${editionYear})`;
        const addCopyButton = $(`<a href="${addCopyHref(noIntroLink, formatedEditionInfo)}" title="Add Copy" id="ac_${torrentId}">AC</a>`);
        $([
            " | ",
            addCopyButton
        ]).insertAfter(a);
    });
}

;// CONCATENATED MODULE: ./src/constants.ts
// REGEXES
const PARENS_TAGS_REGEX = /\(.*?\)/g;
const NO_INTRO_TAGS_REGEX = /\((Unl|Proto|Sample|Aftermarket|Homebrew)\)|\(Rev \d+\)|\(v[\d\.]+\)|\(Beta(?: \d+)?\)/;
// Aftermarket? Homebrew?
const NO_INTRO_EDITION_TAGS_REGEX = /\((Proto|Sample)\)||\(Beta(?: \d+)?\)/;
// LISTS
const GGN_REGIONS = [
    "USA",
    "Europe",
    "Japan",
    "Asia",
    "Australia",
    "France",
    "Germany",
    "Spain",
    "Italy",
    "UK",
    "Netherlands",
    "Sweden",
    "Russia",
    "China",
    "Korea",
    "Hong Kong",
    "Taiwan",
    "Brazil",
    "Canada",
    "Japan, USA",
    "Japan, Europe",
    "USA, Europe",
    "Europe, Australia",
    "Japan, Asia",
    "UK, Australia",
    "World",
    "Region-Free",
    "Other", 
];
// TABLES
const REGION_TO_LANGUAGE = {
    World: "English",
    USA: "English",
    Europe: "English",
    Japan: "Japanese",
    Australia: "English",
    France: "French",
    Germany: "German",
    Italy: "Italian",
    UK: "English",
    Netherlands: "Other",
    Sweden: "Other",
    Russia: "Russian",
    China: "Chinese",
    Korea: "Korean",
    Taiwan: "Chinese",
    Spain: "Spanish",
    "Hong Kong": "Chinese",
    Brazil: "Portuguese",
    Canada: "English",
    "USA, Europe": "English",
    "Europe, Australia": "English",
    "UK, Australia": "English",
    Other: "Other"
};
const TWO_LETTER_REGION_CODE_TO_NAME = {
    en: "English",
    de: "German",
    fr: "French",
    cz: "Czech",
    zh: "Chinese",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    es: "Spanish"
};
const PLATFORM_TO_ARCHIVE_TYPE = {
    "Fairchild Channel F": "zip",
    "Atari 2600": "zip",
    "RCA Studio II": "zip",
    "Atari 5200": "zip",
    Vectrex: "zip",
    "Mattel Intellivision": "zip",
    ColecoVision: "zip",
    "Emerson Arcadia 2001": "zip",
    "Epoch Super Casette Vision": "zip",
    "VTech CreatiVision": "zip",
    "Casio PV-1000": "zip",
    // "Commodore VIC-20 Cartridges & Tapes": "zip",
    // "Commodore VIC-20 Floppies": "7z",
    DOS: "7z",
    // "Commodore 64 Cartridges & Tapes": "zip",
    // "Commodore 64 Floppies": "7z",
    MSX: "zip",
    // "MSX Cartridges": "zip",
    // "MSX Floppies": "7z",
    // "MSX 2 Cartridges": "zip",
    // "MSX 2 Floppies": "7z",
    "Sinclair ZX Spectrum": "zip",
    Windows: "7z",
    // "Commodore 128 Cartridges": "zip",
    // "Commodore 128 Floppies": "7z",
    // "Commodore Plus/4 Cartridges": "zip",
    // "Commodore Plus/4 Floppies": "7z",
    // "Commodore Amiga": "7z",
    "Amiga CD32": "7z",
    "Philips Videopac+": "zip",
    NES: "zip",
    "SG-1000": "zip",
    "Master System": "zip",
    "Atari ST": "7z",
    "Atari 7800": "zip",
    Famicom: "zip",
    "NEC TurboGrafx-16": "zip",
    "Atari Lynx": "zip",
    // "PC Engine SuperGrafx Cards": "zip",
    // "PC Engine SuperGrafx CD": "7z",
    "Game Boy": "zip",
    "Amstrad SPC": "7z",
    "Phillips CD-i": "7z",
    "Hartung Game Master": "zip",
    SNES: "zip",
    "Mega Drive": "zip",
    "Watara Supervision": "zip",
    "Game Gear": "zip",
    Pico: "zip",
    "3DO": "7z",
    "Atari Jaguar": "zip",
    Saturn: "7z",
    "NEC PC-FX": "7z",
    "PlayStation 1": "7z",
    "Casio Loopy": "zip",
    "Funtech Super ACan": "zip",
    "Virtual Boy": "zip",
    "Nintendo 64": "zip",
    "Apple Bandai Pippin": "7z",
    "Game.com": "zip",
    "Game Boy Color": "zip",
    "SNK Neo Geo Pocket": "zip",
    Dreamcast: "7z",
    "Bandai Wonderswan Color": "zip",
    "PlayStation 2": "7z",
    "Nintendo GameCube": "7z",
    "Game Boy Advance": "zip",
    "GamePark GP32": "zip",
    Xbox: "7z",
    "Nokia N-Gage": "zip",
    "NEC PC-98": "7z",
    // "PlayStation 3": "7z/none",
    "PlayStation Portable": "7z",
    "Nintendo DS": "zip",
    "V.Smile": "zip",
    Gizmondo: "zip",
    "Xbox 360": "7z",
    "Nintendo 3DS": "zip",
    // Wii: "None (if scrubbed)",
    "Wii U": "7z",
    Ouya: "zip",
    "New Nintendo 3DS": "zip",
    Switch: "7z"
};
// Zibzab is the best!!!!
const GGN_PLATFORM_TO_NO_INTRO_PLATFORM_CODE = {
    "Apple Bandai Pippin": "276",
    "Game Boy": "46",
    "Game Boy Advance": "23",
    "Game Boy Color": "47",
    NES: "45",
    "Family Computer Disk System": "31",
    "Nintendo 64": "24",
    "Nintendo 3DS": "64",
    "New Nintendo 3DS": "81",
    "Nintendo DS": "28",
    "Nintendo GameCube": "261",
    SNES: "49",
    "Virtual Boy": "15",
    "PlayStation Portable": "91",
    "PlayStation Vita": "92",
    "Game Gear": "25",
    "Master System": "26",
    "Mega Drive": "32",
    Pico: "18",
    "SG-1000": "19",
    "Atari 2600": "88",
    "Atari 5200": "1",
    "Atari 7800": "74",
    "Atari Jaguar": "2",
    "Atari Lynx": "30",
    "Atari ST": "68",
    "Bandai WonderSwan": "50",
    "Bandai WonderSwan Color": "51",
    "Commodore 64": "42",
    "Commodore Amiga": "40",
    "Commodore VIC-20": "34",
    "NEC PC-98": "243",
    "NEC TurboGrafx-16": "12",
    "ZX Spectrum": "73",
    MSX: "10",
    "MSX 2": "11",
    "Game.com": "20",
    "V.Smile": "76",
    CreatiVision: "21",
    "Casio Loopy": "48",
    "Casio PV-1000": "59",
    Colecovision: "3",
    "Emerson Arcadia 2001": "4",
    "Entex Adventure Vision": "5",
    "Epoch Super Casette Vision": "60",
    "Fairchild Channel F": "6",
    "Funtech Super Acan": "56",
    "GamePark GP32": "58",
    "General Computer Vectrex": "7",
    "Hartung Game Master": "8",
    "Mattel Intellivision": "105",
    Ouya: "130",
    "Philips Videopac+": "16",
    "RCA Studio II": "29",
    "SNK Neo Geo Pocket": "35",
    "Watara Supervision": "22"
};

;// CONCATENATED MODULE: ./src/utils/GMCache.ts
class GMCache {
    getKeyName(key) {
        return `cache${this.name}.${key}`;
    }
    get(key) {
        const res = GM_getValue(this.getKeyName(key));
        if (res === undefined) {
            return undefined;
        }
        const { value , expires  } = res;
        if (expires && expires < Date.now()) {
            this.delete(key);
            return undefined;
        }
        return value;
    }
    set(key, value, ttl) {
        const expires = Date.now() + ttl;
        GM_setValue(this.getKeyName(key), {
            value,
            expires
        });
    }
    delete(key) {
        GM_deleteValue(this.getKeyName(key));
    }
    cleanUp() {
        const keys = GM_listValues();
        keys.forEach((key)=>{
            if (key.startsWith(this.getKeyName(""))) {
                const { expires  } = GM_getValue(key);
                if (expires < Date.now()) {
                    GM_deleteValue(key);
                }
            }
        });
    }
    clear() {
        const keys = GM_listValues();
        keys.forEach((key)=>{
            if (key.startsWith(this.getKeyName(""))) {
                GM_deleteValue(key);
            }
        });
    }
    constructor(name){
        this.name = name;
    }
}

;// CONCATENATED MODULE: ./src/utils/identifyNoIntroTags.ts

function identifyNoIntroTags(title) {
    const tags = title.match(/\(.+?\)/g).map((p)=>p.slice(1, -1));
    let region = "";
    let languages = [];
    let edition = [];
    let release = [];
    tags.forEach((tag)=>{
        console.log(`tag: ${tag}`);
        // Region
        if (GGN_REGIONS.includes(tag)) {
            console.log("region", tag);
            region = tag;
            return;
        }
        // Language
        const maybeTwoLetterCodes = tag.split(",").map((l)=>l.trim().toLowerCase());
        const isLanguages = maybeTwoLetterCodes.every((l)=>/^[a-z]{2}$/.test(l));
        if (isLanguages) {
            languages = maybeTwoLetterCodes;
            return;
        }
        // Edition
        if ([
            "Proto",
            "Sample"
        ].includes(tag) || tag.startsWith("Beta") || tag.startsWith("Demo") || tag.endsWith("Virtual Console") || tag.includes("Edition") || tag.includes("Collection")) {
            edition.push(tag);
            return;
        }
        // None of the above
        console.log("release tag", tag);
        release.push(tag);
    });
    if (region === "") {
        release.shift();
        region = "Other";
    }
    let language;
    if (languages.length === 0) {
        language = REGION_TO_LANGUAGE[region];
    } else if (languages.length === 1) {
        language = TWO_LETTER_REGION_CODE_TO_NAME[languages[0]] || "Other";
    } else {
        language = "Multi-Language";
    }
    return {
        language: language,
        region: region,
        edition,
        release: release.map((t)=>`(${t})`).join(" ")
    };
}

;// CONCATENATED MODULE: ./src/utils/fetchNoIntro.ts


const cache = new GMCache("no-intro");
// @ts-expect-error
unsafeWindow.GGN_NO_INTRO_HELPER_CACHE = cache;
function getRelationshipDetails(scraped) {
    const findDataByTitle = (title)=>[
            ...scraped.querySelectorAll("td.TableData")
        ].filter((d)=>d.innerText.trim() === title)[0];
    const nextOverText = (td)=>(td.nextElementSibling.innerText || "").trim();
    const splitMerge = findDataByTitle("Split/Merge:");
    if (!splitMerge) {
        return;
    }
    // I don't know what other types of splits there are but better safe than sorry
    const isParentSplit = nextOverText(splitMerge) === "Parent.";
    if (!isParentSplit) {
        return;
    }
    const relationship = findDataByTitle("P/C relationship:");
    if (!relationship) {
        return;
    }
    return relationship.nextElementSibling;
}
function determineParentUrl(scraped, scrapedUrl) {
    const relationshipDetails = getRelationshipDetails(scraped);
    if (!relationshipDetails) {
        return;
    }
    if (relationshipDetails.innerText.trim().startsWith("Parent.")) {
        return scrapedUrl;
    }
    if (relationshipDetails.innerText.trim().startsWith("Clone.")) {
        const parentLink = relationshipDetails.querySelector("a");
        if (!parentLink) {
            return;
        }
        return "https://datomatic.no-intro.org/" + parentLink.getAttribute("href");
    }
}
function getRomChildrenUrls(scraped, url) {
    const relationshipDetails = getRelationshipDetails(scraped);
    if (!relationshipDetails) {
        return [];
    }
    if (!relationshipDetails.innerText.trim().startsWith("Parent.")) {
        return [];
    }
    return [
        ...relationshipDetails.querySelectorAll("a")
    ].map((a)=>"https://datomatic.no-intro.org/" + a.getAttribute("href"));
}
function scrapeNoIntro(url) {
    let method = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "GET", data = arguments.length > 2 ? arguments[2] : void 0;
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method,
            url,
            data,
            timeout: 5000,
            onload: (param)=>{
                let { responseText  } = param;
                try {
                    const parser = new DOMParser();
                    const scraped = parser.parseFromString(responseText, "text/html");
                    resolve(scraped);
                } catch (err) {
                    reject(err);
                }
            },
            ontimeout: ()=>{
                reject(new Error("Request to No-Intro timed out after 5 seconds"));
            }
        });
    });
}
async function getRomInformationFromNoIntro(url) {
    const cached = cache.get(url);
    if (cached) {
        return {
            ...cached,
            cached: true
        };
    }
    const scraped = await scrapeNoIntro(url);
    try {
        const dumpsTitle = [
            ...scraped.querySelectorAll("td.TableTitle")
        ].find((td)=>td.innerText.trim() === "Dump(s)" || td.innerText.trim() === "Scene dump(s)");
        if (!dumpsTitle) {
            // @ts-expect-error
            unsafeWindow.GMPARSER = scraped;
            console.error("GGn No-Intro Helper: dumps title not found, set parser as global: GMPARSER");
            throw new Error("No dump's title found");
        }
        // hmmm
        const filename = dumpsTitle.parentElement.parentElement.parentElement.nextElementSibling.querySelector("table > tbody > tr:nth-child(2) > td:last-child").innerText.trim();
        const extension = filename.split(".").pop() || "";
        let title = scraped.querySelector("tr.romname_section > td").innerText.trim();
        const noIntroPlatform = scraped.querySelector("#content > div.standard > table:first-child").innerText.trim().split(" - ").slice(1).join(" - ");
        const info = {
            extension,
            title: title,
            cached: false,
            noIntroPlatform,
            noIntroUrl: url,
            parentUrl: determineParentUrl(scraped, url),
            childrenUrls: getRomChildrenUrls(scraped, url)
        };
        cache.set(url, info, 1000 * 60 * 60);
        return info;
    } catch (err) {
        console.error("zibzab helper failed to parse no-intro:", err);
        throw new Error("Failed to parse no-intro :/\nIf the No-Intro link in the torrent description is valid and working, please report to BestGrapeLeaves, including the error that was logged to the browser console");
    }
}
async function searchNoIntro(title, platform, expectedExtension) {
    const cached = cache.get(`search:${title}:${platform}`);
    if (cached) {
        return cached.map((rom)=>({
                ...rom,
                cached: true
            }));
    }
    // compose search url
    const url = new URL("https://datomatic.no-intro.org/index.php");
    url.searchParams.set("page", "search");
    url.searchParams.set("s", platform);
    // compose form data
    const formData = new FormData();
    formData.append("system_selection", platform);
    formData.append("text", title);
    formData.append("where", "1");
    formData.append("sort", "Title");
    formData.append("order", "Ascending");
    const scraped = await scrapeNoIntro(url.toString(), "POST", formData);
    try {
        const romLinks = [
            ...scraped.querySelectorAll("#content > table.info-table .SearchLinkTitle > a"), 
        ];
        const results = romLinks.map((link)=>{
            const url = "https://datomatic.no-intro.org/index.php" + link.getAttribute("href");
            const rom = {
                cached: false,
                // @TODO: platformize
                noIntroPlatform: "",
                title: link.innerText.trim(),
                extension: expectedExtension,
                noIntroUrl: url,
                childrenUrls: []
            };
            // cache.set(url, rom, 1000 * 60 * 60);
            return rom;
        });
        cache.set(`search:${title}:${platform}`, results, 1000 * 60 * 60);
        return results;
    } catch (err) {
        console.error("zibzab helper failed to parse no-intro:", err);
        throw new Error("Failed to search no-intro :/\nIf you believe this is a bug in the script, please report to BestGrapeLeaves, including the error that was logged to the browser console");
    }
}
function findNoIntroSiblings(url) {}
function populateNoIntroInformation(rom) {
    // We stopped shipping entire filenames
    // when zibzab reported that it varies from dump to dump
    // like some can have a "bad" filename
    // title is 100% accurate, and extension shouldn't vary
    const title = rom.title.replace(/^[a-z]?\d+ - /, ""); // Remove 4 digit game code;
    const filename = `${title}.${rom.extension}`;
    // Region/Lang
    const { language , region , edition , release  } = identifyNoIntroTags(title);
    return {
        ...rom,
        filename,
        language,
        region,
        releaseTags: release,
        editionTags: edition,
        title
    };
}
async function fetchNoIntro(url) {
    return populateNoIntroInformation(await getRomInformationFromNoIntro(url));
}

;// CONCATENATED MODULE: ./src/utils/dom/fetchTorrentFilelist.ts
// We are fetching files for checking,
// might as well reduce load on servers and save to dom (like the button does)
function fetchTorrentFilelist(torrentId) {
    const parseFromDom = ()=>$(`#files_${torrentId} > table > tbody > tr:not(.colhead_dark) > td:first-child`).map(function() {
            return $(this).text();
        }).get();
    return new Promise((resolve)=>{
        // @ts-expect-error
        if ($("#files_" + torrentId).raw().innerHTML === "") {
            // $('#files_' + torrentId).gshow().raw().innerHTML = '<h4>Loading...</h4>';
            ajax.get("torrents.php?action=torrentfilelist&torrentid=" + torrentId, function(response) {
                // @ts-expect-error
                $("#files_" + torrentId).ghide();
                // @ts-expect-error
                $("#files_" + torrentId).raw().innerHTML = response;
                resolve(parseFromDom());
            });
        } else {
            resolve(parseFromDom());
        }
    });
}

;// CONCATENATED MODULE: ./src/utils/dom/checkIfTrumpable.ts



async function checkIfTrumpable(torrent) {
    try {
        const { title , cached , extension , parentUrl  } = await fetchNoIntro(torrent.noIntroLink);
        const desiredExt = PLATFORM_TO_ARCHIVE_TYPE[torrent.platform];
        const desiredFilename = title + "." + (desiredExt || "zip");
        const files = await fetchTorrentFilelist(torrent.torrentId);
        if (files.length !== 1) {
            return {
                trumpable: true,
                cached,
                inditermint: "\nMultiple/No files found in torrent"
            };
        }
        const actualFilename = files[0];
        return {
            trumpable: desiredExt ? desiredFilename !== actualFilename : title !== actualFilename.split(".").slice(0, -1).join("."),
            desiredFilename,
            actualFilename,
            cached,
            desiredExt,
            title,
            romExtension: extension,
            parentUrl
        };
    } catch (err) {
        console.error("GGn No-Intro Helper: Error checking trumpability", err);
        return {
            trumpable: true,
            cached: false,
            inditermint: err.message
        };
    }
}

;// CONCATENATED MODULE: ./src/utils/massReporting.ts
// Whack whack
// So many shenanigans to avoid enslaving my self to using IDs for elems
let massReporting = false;
let reportFunctions = {};
function isMassReporting() {
    return massReporting;
}
function setMassReporting(value) {
    massReporting = value;
}
function registerReport(torrentId, report) {
    reportFunctions[torrentId] = report;
}
function clearReportFunctions() {
    reportFunctions = {};
}
async function reportTorrent(torrentId) {
    if (reportFunctions[torrentId]) {
        await reportFunctions[torrentId]();
        reportFunctions[torrentId] = undefined;
    } else {
        throw new Error(`No report function registered for torrent ${torrentId}`);
    }
}
async function reportAllTrumps() {
    setMassReporting(true);
    const torrentIds = Object.keys(reportFunctions);
    for(let i = 0; i < torrentIds.length; i++){
        const id = torrentIds[i];
        if (i === torrentIds.length - 1) {
            setMassReporting(false);
        }
        await reportTorrent(id);
        await new Promise((resolve)=>setTimeout(resolve, 100));
    }
}

;// CONCATENATED MODULE: ./src/inserts/smallPre.ts
function smallPre(text, bgColor) {
    return `<pre style="
    padding: 0px;
    margin: 0;
    background-color: ${bgColor};
    color: black;
    font-weight: bold;
    font-size: 12px;
    padding-left: 3px;
    padding-right: 3px;
    width: fit-content;
  ">${text}</pre>`;
}

;// CONCATENATED MODULE: ./src/inserts/insertTrumpNotice.ts


function inditermintNoticeInfo(param) {
    let { inditermint  } = param;
    return {
        title: "Couldn't determine if the torrent is trumpable:",
        details: inditermint,
        color: "pink"
    };
}
function reportedNoticeInfo() {
    return {
        title: "Torrent was trumped and reported!",
        details: "",
        color: "var(--darkRed)"
    };
}
function trumpableNoticeInfo(param) {
    let { actualFilename , desiredFilename  } = param;
    return {
        title: "This torrent is trumpable!",
        details: `The filename in the torrent is: ${smallPre(actualFilename, "lightcoral")} but the desired filename, based on <i>No-Intro</i> is: ${smallPre(desiredFilename, "lightgreen")}`,
        color: "hotpink"
    };
}
function reportableNoticeInfo(param) {
    let { fixedVersion , torrentId , actualFilename , desiredFilename , noIntroLink  } = param;
    const form = $("<div/></div>");
    const trumpingTorrentInput = $(`<input type="text" value="${fixedVersion.permalink}" placeholder="https://gazellegames.net/torrents.php?id=xxxxx&torrentid=yyyyyy" style="width: 75%; background: #ffb952; color: black;"/>`);
    const commentTextarea = $(`<textarea placeholder="Previous upload didn't like hummus" style="height: 100px; width: 90%; background: #ffb952; color: black; margin: 0;"/>`);
    const reportReason = actualFilename.split(".").slice(0, -1).join(".") !== desiredFilename.split(".").slice(0, -1).join(".") ? "ROM name changed on No-Intro." : "Corrected archive type.";
    commentTextarea.text(`${reportReason}
Reported filename        : ${actualFilename}
Trumping filename       : ${desiredFilename}
No-Intro for reference : ${noIntroLink}`);
    const submitInputButton = $(`<input class="no-intro-helper-submit-trump-report-button" id="no-intro-helper-submit-trump-report-${torrentId}" type="button" value="REPORT" style="width: 70px; margin: 0; background: #ffb952; color: black; font-weight: bolder;"/>`);
    const errorMessage = $("<div style='color: red; font-weight: bold; font-size: 13px; white-space: pre-line;'></div>").hide();
    form.append(`<p style="font-size: 12px;">Trumping Torrent Permalink:</p>`, trumpingTorrentInput, `<p style="font-size: 12px;">Report Comment:</p>`, commentTextarea, `<p style="font-size: 12px;">Submit Report:</p>`, submitInputButton, errorMessage);
    // can't read spagettelian, I'm sorry.
    const report = async ()=>{
        // If it's disabled this should in theory not trigger,
        // but just in case jquery does some shenaningans
        // when you manually trigger a click event
        if (submitInputButton.prop("disabled") === true) {
            return;
        }
        errorMessage.hide();
        submitInputButton.prop("disabled", true);
        $(`#trump-notice-links-${torrentId} > span:nth-child(2)`).hide();
        $(`#trump-notice-title-${torrentId}`).css("color", "#ffb952").find(".trump-notice-title-span").text("Reporting...");
        const data = new FormData();
        data.append("submit", "true");
        data.append("torrentid", torrentId);
        data.append("categoryid", "1");
        data.append("type", "trump");
        data.append("sitelink", fixedVersion.permalink);
        data.append("extra", commentTextarea.val());
        data.append("id_token", new Date().getTime().toString());
        try {
            await new Promise((resolve)=>setTimeout(resolve, 3000));
            await fetch("/reportsv2.php?action=takereport", {
                method: "POST",
                body: data
            });
            if (!isMassReporting()) {
                window.location.reload();
            } else {
                $(`#trump-notice-title-${torrentId}`).text("Reported!");
            }
        } catch (err) {
            console.error("Error submitting trump report", err);
            console.error("Form data sent:", Object.fromEntries([
                ...data.entries()
            ]));
            errorMessage.text(`An error occurred while submitting the trump report. If you believe this is a problem with the script, please report to BestGrapeLeaves (including console logs if you can).
Error Message:
${err.message}`);
            errorMessage.show();
            submitInputButton.prop("disabled", false);
            $(`#trump-notice-links-${torrentId} > span:nth-child(2)`).show();
            $(`#trump-notice-title-${torrentId}`).css("color", "#ff7600").find(".trump-notice-title-span").text("Torrent needs to be reported for trump!");
            const toggleDetailsActionSpan = $(`#trump-notice-links-${torrentId} > span:first-child`);
            const collapsed = toggleDetailsActionSpan.text() === "[Expand]";
            if (collapsed) {
                toggleDetailsActionSpan.text("[Collapse]");
                $(`#trump-notice-title-${torrentId}`).next().show();
            }
        }
    };
    registerReport(torrentId, report);
    submitInputButton.click(report);
    return {
        title: "Torrent needs to be reported for trump!",
        details: form,
        color: "#ff7600"
    };
}
function insertTrumpNotice(torrent) {
    const { inditermint , fixedVersion , torrentId , reported  } = torrent;
    // Settings
    let info;
    let type;
    if (inditermint) {
        type = "inditermint";
        info = inditermintNoticeInfo(torrent);
    } else if (fixedVersion) {
        if (reported) {
            type = "reported";
            info = reportedNoticeInfo();
        } else {
            type = "reportable";
            info = reportableNoticeInfo(torrent);
        }
    } else {
        type = "trumpable";
        info = trumpableNoticeInfo(torrent);
    }
    const { color , details , title  } = info;
    // Elements
    const detailsDiv = $(`<div style="font-weight: normal; color: white; white-space: pre-line;"></div>`).hide();
    detailsDiv.append(details);
    const titleSpan = $(`
    <span id="trump-notice-title-${torrentId}" style="color: ${color}; font-size: 14px; font-weight: bold;"><span class="trump-notice-title-span">${title}</span></span>`);
    const actionsDiv = $(`<div id="trump-notice-links-${torrentId}" style="font-weight: normal; font-size: 11px; display: inline; margin: 5px; user-select: none;"></div>`);
    // Toggle Details
    if (type !== "reported") {
        const toggleDetailsActionSpan = $(`<span style="cursor: pointer; margin-right: 5px;">[Expand]</span>`);
        toggleDetailsActionSpan.click(()=>{
            const collapsed = toggleDetailsActionSpan.text() === "[Expand]";
            if (collapsed) {
                toggleDetailsActionSpan.text("[Collapse]");
                detailsDiv.show();
            } else {
                toggleDetailsActionSpan.text("[Expand]");
                detailsDiv.hide();
            }
        });
        actionsDiv.append(toggleDetailsActionSpan);
    }
    // Send Report
    if (type === "reportable") {
        const sendReportActionSpan = $(`<span style="cursor: pointer; margin-right: 5px;">[Send Report]</span>`);
        sendReportActionSpan.click(()=>{
            $(`#no-intro-helper-submit-trump-report-${torrentId}`).click();
        });
        actionsDiv.append(sendReportActionSpan);
    }
    // Cheer
    if (type === "reported") {
        const cheerActionSpan = $(`<span style="cursor: pointer; margin-right: 5px; position: absolute;">[Cheer]</span>`);
        const randomAnimation = Math.random() > 0.5 ? "spin" : "grow";
        cheerActionSpan.click(()=>{
            cheerActionSpan.text("HOORAY!");
            cheerActionSpan.animate({
                opacity: 0
            }, // @ts-expect-error
            {
                duration: 2000,
                complete: ()=>{
                    // prevent huge animated text from blocking clicks
                    cheerActionSpan.detach();
                },
                step: function(now) {
                    if (randomAnimation === "spin") {
                        cheerActionSpan.css({
                            transform: "rotate(" + now * 360 * 5 + "deg)"
                        });
                    } else {
                        cheerActionSpan.css({
                            transform: "scale(" + (1 + (1 - now) * 28) + ")"
                        });
                    }
                }
            }, "swing");
        });
        actionsDiv.append(cheerActionSpan);
    }
    // Tree
    const wrapper = $(`<div></div>`);
    titleSpan.append(actionsDiv);
    wrapper.append(titleSpan);
    wrapper.append(detailsDiv);
    // Place
    let currentlyAdaptedToSmallScreen;
    function placeTrumpNotice() {
        console.log("adapting", window.innerWidth);
        if (window.innerWidth <= 800) {
            if (currentlyAdaptedToSmallScreen) {
                return;
            }
            currentlyAdaptedToSmallScreen = true;
            $(`#torrent${torrentId}`).css("border-bottom", "none");
            wrapper.css("margin-left", "25px");
            wrapper.detach();
            wrapper.insertAfter(`#torrent${torrentId}`);
        } else {
            if (currentlyAdaptedToSmallScreen === false) {
                return;
            }
            currentlyAdaptedToSmallScreen = false;
            $(`#torrent${torrentId}`).css("border-bottom", "");
            wrapper.css("margin-left", "0px");
            wrapper.detach();
            wrapper.appendTo(`#torrent${torrentId} > td:first-child`);
        }
    }
    placeTrumpNotice();
    $(window).resize(placeTrumpNotice);
    // Call global hook (for other scripts)
    // @ts-expect-error
    if (typeof unsafeWindow.GM_GGN_NOINTRO_HELPER_ADDED_LINKS === "function") {
        // @ts-expect-error
        unsafeWindow.GM_GGN_NOINTRO_HELPER_ADDED_LINKS({
            ...torrent,
            links: actionsDiv
        });
    }
}

;// CONCATENATED MODULE: ./src/inserts/reportAllTrumpsButton.ts

function reportAllTrumpsButton() {
    const existing = $("#report-all-no-intro-trumps-button");
    const button = existing.length > 0 ? existing : $(`<input id="report-all-no-intro-trumps-button" type="button" value="Report All Trumped" style="background: #ff7600; color: black; font-weight: bold; margin-left: 10px;"/>`);
    const disable = ()=>{
        button.prop("disabled", true);
        button.css("background-color", "#ffb952");
        button.css("color", "darkslategray");
        button.css("box-shadow", "none");
    };
    const insert = ()=>{
        button.detach();
        $(".torrent_table > tbody > tr:first-child > td:first-child").first().append(button);
    };
    if (existing.length === 0) {
        button.click(async (e)=>{
            e.stopImmediatePropagation();
            button.val("Reporting...");
            disable();
            reportAllTrumps();
        });
    }
    return {
        disable,
        insert,
        button
    };
}

;// CONCATENATED MODULE: ./src/inserts/insertTrumpSuggestions.ts








async function checkForImproperlyNamedTorrents(torrents) {
    const { disable , progress  } = checkForTrumpsButton();
    disable();
    let prevCached = false;
    // let alreadySearched = new Set<string>();
    // let maybeNewVersions: BareNoIntroRomInformation[] = [];
    let parentRomsUrls = new Set();
    const trumpResults = [];
    for(let i = 0; i < torrents.length; i++){
        const torrent = torrents[i];
        progress(`Checking For Trumps ${i + 1}/${torrents.length}...`);
        // timeout to avoid rate limiting
        if (!prevCached) {
            await new Promise((resolve)=>setTimeout(resolve, 500));
        }
        // Check trump
        const TrumpCheckResult = await checkIfTrumpable(torrent);
        const { cached , parentUrl  } = TrumpCheckResult;
        prevCached = cached;
        trumpResults.push({
            ...TrumpCheckResult,
            ...torrent
        });
        if (parentUrl) {
            parentRomsUrls.add(parentUrl);
        }
    // Search for new versions
    // if ($("#groupplatform").text() !== "MSX 2") {
    //   continue;
    // }
    // const gameName = title.replace(/\(.+?\)/g, "").trim();
    // if (alreadySearched.has(gameName)) {
    //   continue;
    // }
    // // @TODO: platofrmify
    // maybeNewVersions = [
    //   ...maybeNewVersions,
    //   ...(await searchNoIntro(gameName, "11", romExtension)),
    // ];
    // alreadySearched.add(gameName);
    }
    // Find actually new versions
    // const newVersions: Record<string, BareNoIntroRomInformation> = {};
    // maybeNewVersions.forEach((v) => {
    //   if (newVersions[v.noIntroUrl]) {
    //     return;
    //   }
    //   // naming consistency is life
    //   if (torrents.some((t) => t.noIntroLink === v.noIntroUrl)) {
    //     return;
    //   }
    //   newVersions[v.noIntroUrl] = v;
    // });
    const allRelatedRomsUrls = new Set(parentRomsUrls);
    let newVersions = [];
    try {
        await Promise.all(Array.from(parentRomsUrls).map(async (url)=>{
            const { childrenUrls  } = await getRomInformationFromNoIntro(url);
            childrenUrls.forEach((c)=>allRelatedRomsUrls.add(c));
        }));
        const newVersionsUrls = Array.from(allRelatedRomsUrls).filter((url)=>!torrents.some((t)=>t.noIntroLink === url));
        newVersions = await Promise.all(newVersionsUrls.map((url)=>fetchNoIntro(url)));
    } catch (err) {
        // @TODO: display and handle properly in dom blah blah
        console.error("Failed to get new versions", err);
    }
    return {
        trumpResults,
        newVersions
    };
}
// Filter the torrents that have a trump uploaded
function attachFixedVersionsToTorrents(torrents) {
    // Efficiency is not my greatest of concerns,
    // if you want implement a graph theory solution in O(1) or something
    return torrents.map((c)=>{
        if (!c.trumpable || c.inditermint) {
            return c;
        }
        return {
            ...c,
            fixedVersion: torrents.find((v)=>!v.inditermint && !v.trumpable && v.noIntroLink === c.noIntroLink)
        };
    });
}
function insertTrumpSuggestions(results) {
    const { progress  } = checkForTrumpsButton();
    let trumps = 0;
    let reportable = 0;
    clearReportFunctions();
    results.forEach((torrent)=>{
        if (!torrent.trumpable) {
            return;
        }
        if (torrent.inditermint) {
            insertTrumpNotice(torrent);
            return;
        }
        if (torrent.fixedVersion && !torrent.reported) {
            reportable++;
        }
        if (!torrent.fixedVersion) {
            trumps++;
        }
        insertTrumpNotice(torrent);
    });
    if (trumps === 0) {
        progress("No Trumps Found");
    } else if (trumps === 1) {
        progress("1 Trump Found");
    } else {
        progress(`${trumps} Trumps Found`);
    }
    const { button , insert  } = reportAllTrumpsButton();
    if (reportable > 0) {
        insert();
    } else {
        button.detach();
    }
}
function insertNewVersionSuggestions(newVersions) {
    if (newVersions.length === 0) {
        return;
    }
    const availableToUploadSectionTitle = $(`<tbody>
      <tr class="group_torrent">
        <td style="background-color: #662b2b;" colspan="6" class="edition_info" onclick="jQuery('#edition_new_versions').toggle();return false;">
          <strong style="color: #ffdba6;">✭ New Versions Available To Upload</strong>
        </td>
      </tr>
    </tbody>`);
    const availableToUploadSection = $(`<tbody id="edition_new_versions" style=""></tbody>`);
    const styles = $(`
    <style>
      #edition_new_versions > tr {
        background-color: rgba(102, 43, 43, 0.4)
      }

      #edition_new_versions > tr:hover {
        background-color: rgba(102, 43, 43)
      }
    </style>`);
    newVersions.map(populateNoIntroInformation).forEach((v)=>{
        availableToUploadSection.append(`<tr class="group_torrent" style="font-weight: normal" id="torrent378950">
        <td>
          <span
            >[
            <a style="color: blanchedalmond;" href="${addCopyHref(v.noIntroUrl)}" title="Add Copy">AC</a>
            ]</span
          >

          »
          <a style="color: blanchedalmond;" target="_blank" href="${v.noIntroUrl}" class="friends_upload">${v.title}</a>
        </td>
        <td class="nobr">
          <span class="time" title="Upload It!">hopefully today</span>
        </td>
        <td class="nobr">------</td>
        <td>∞</td>
        <td>∞</td>
        <td>∞</td>
      </tr>`);
    });
    // Insert to page
    $(".torrent_table").append(availableToUploadSectionTitle, availableToUploadSection, styles);
}
async function findAndDisplayTrumps() {
    const torrents = getNoIntroTorrentsOnPage();
    const { trumpResults , newVersions  } = await checkForImproperlyNamedTorrents(torrents);
    const processed = attachFixedVersionsToTorrents(trumpResults);
    console.log("GGn No-Intro Helper: Trumps", processed);
    console.log("GGn No-Intro Helper: new versions", newVersions);
    insertNewVersionSuggestions(newVersions);
    insertTrumpSuggestions(processed);
}

;// CONCATENATED MODULE: ./src/pages/torrents.ts




function trumpSuggestions() {
    const torrents = getNoIntroTorrentsOnPage();
    if (torrents.length === 0) {
        return;
    }
    const { button , insert  } = checkForTrumpsButton();
    insert();
    if (torrents.length <= 4) {
        findAndDisplayTrumps();
    }
    button.click((e)=>{
        e.stopImmediatePropagation();
        findAndDisplayTrumps();
    });
}
function torrentsPageMain() {
    insertAddCopyHelpers();
    trumpSuggestions();
}

;// CONCATENATED MODULE: ./src/inserts/uploadLinkParserUI.ts
function uploadNoIntroLinkParserUI() {
    // elements
    const container = $(`<tr id="no-intro-url" name="no-intro-url">
      <td class="label">No-Intro Link</td>
    </tr>`);
    const input = $('<input type="text" id="no-intro-url-input" name="no-intro-url-input" size="60%" class="input_tog" value="">');
    // @TODO: Just make it one notice p, why seven different kinds why
    const error = $('<p id="no-intro-url-error" name="no-intro-url-error" style="color: red; font-weight:bold; font-size: 15px; white-space:pre-line;"></p>').hide();
    const loading = $('<p id="no-intro-url-loading" name="no-intro-url-loading" style="color: green;">Loading...</p>').hide();
    const warning = $('<p id="no-intro-url-warning" name="no-intro-url-warning" style="color: yellow; white-space: pre-line;"></p>').hide();
    const incorrectFilename = $('<div style="font-weight: normal; color: white; line-height: 1.5em;"></div>').hide();
    const goButton = $('<input type="button" value="No-Intro"></input>');
    // structure
    const td = $("<td></td>");
    td.append(input);
    td.append(loading);
    td.append(error);
    td.append(incorrectFilename);
    td.append(warning);
    container.append(td);
    // utils
    const setError = (msg)=>{
        error.html(msg);
        error.show();
    };
    const setWarning = (msg)=>{
        warning.text(msg);
        warning.show();
    };
    const setLoading = (isLoading)=>{
        if (isLoading) {
            loading.show();
        } else {
            loading.hide();
        }
    };
    const insert = ()=>{
        container.insertAfter("#torrent_file");
    };
    // stuff
    input.on("paste", (e)=>{
        e.preventDefault();
        const text = e.originalEvent.clipboardData.getData("text/plain");
        input.val(text);
    });
    return {
        loading,
        error,
        warning,
        incorrectFilename,
        container,
        input,
        goButton,
        setError,
        setWarning,
        setLoading,
        insert
    };
}

;// CONCATENATED MODULE: ./src/utils/dom/setUploadEdition.ts
function setUploadEdition(edition) {
    try {
        $("#groupremasters").val(edition).change();
        GroupRemaster();
    } catch  {
    // group remaster always throws (regardless of the userscript)
    }
}

;// CONCATENATED MODULE: ./src/utils/generateTorrentDescription.ts
const compressedWithZip = "[url=https://sourceforge.net/projects/trrntzip/]torrentzip.[/url]";
const compressedWith7z = "[url=https://github.com/BubblesInTheTub/torrent7z]torrent7z.[/url]";
const generateTorrentDescription = function() {
    let url = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "xxx", filename = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "xxx", zip = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    return `[align=center][b]${filename}[/b] matches [url=${url}]No-Intro checksum[/url].
Compressed with ${zip ? compressedWithZip : compressedWith7z}[/align]
`;
};

// EXTERNAL MODULE: ./node_modules/bencode/lib/index.js
var lib = __webpack_require__("./node_modules/bencode/lib/index.js");
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ./node_modules/path-browserify/index.js
var path_browserify = __webpack_require__("./node_modules/path-browserify/index.js");
var path_browserify_default = /*#__PURE__*/__webpack_require__.n(path_browserify);
// EXTERNAL MODULE: ./node_modules/simple-sha1/browser.js
var browser = __webpack_require__("./node_modules/simple-sha1/browser.js");
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);
;// CONCATENATED MODULE: ./src/utils/parseTorrent.ts
/* provided dependency */ var Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];
/*! parse-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */ /* global Blob */ 


function parseTorrent(torrentId) {
    if (Buffer.isBuffer(torrentId) && torrentId.length === 20) {
        // if info hash (buffer)
        throw new Error("Magnet not implemented");
    } else if (Buffer.isBuffer(torrentId)) {
        // if .torrent file (buffer)
        return decodeTorrentFile(torrentId); // might throw
    } else {
        throw new Error("Invalid torrent identifier");
    }
}
/**
 * Parse a torrent. Throws an exception if the torrent is missing required fields.
 * @param  {Buffer|Object} t
 * @return {Object}        parsed torrent
 */ function decodeTorrentFile(torrent) {
    let t = Buffer.isBuffer(torrent) ? lib_default().decode(torrent) : torrent;
    // sanity check
    ensure(t.info, "info");
    ensure(t.info["name.utf-8"] || t.info.name, "info.name");
    ensure(t.info["piece length"], "info['piece length']");
    ensure(t.info.pieces, "info.pieces");
    if (t.info.files) {
        t.info.files.forEach((file)=>{
            ensure(typeof file.length === "number", "info.files[0].length");
            ensure(file["path.utf-8"] || file.path, "info.files[0].path");
        });
    } else {
        ensure(typeof t.info.length === "number", "info.length");
    }
    const result = {
        info: t.info,
        infoBuffer: lib_default().encode(t.info),
        name: (t.info["name.utf-8"] || t.info.name).toString(),
        announce: []
    };
    result.infoHash = browser_default().sync(result.infoBuffer);
    result.infoHashBuffer = Buffer.from(result.infoHash, "hex");
    if (t.info.private !== undefined) result.private = !!t.info.private;
    if (t["creation date"]) result.created = new Date(t["creation date"] * 1000);
    if (t["created by"]) result.createdBy = t["created by"].toString();
    if (Buffer.isBuffer(t.comment)) result.comment = t.comment.toString();
    // announce and announce-list will be missing if metadata fetched via ut_metadata
    if (Array.isArray(t["announce-list"]) && t["announce-list"].length > 0) {
        t["announce-list"].forEach((urls)=>{
            urls.forEach((url)=>{
                result.announce.push(url.toString());
            });
        });
    } else if (t.announce) {
        result.announce.push(t.announce.toString());
    }
    // handle url-list (BEP19 / web seeding)
    if (Buffer.isBuffer(t["url-list"])) {
        // some clients set url-list to empty string
        t["url-list"] = t["url-list"].length > 0 ? [
            t["url-list"]
        ] : [];
    }
    result.urlList = (t["url-list"] || []).map((url)=>url.toString());
    // remove duplicates by converting to Set and back
    result.announce = Array.from(new Set(result.announce));
    result.urlList = Array.from(new Set(result.urlList));
    const files = t.info.files || [
        t.info
    ];
    result.files = files.map((file, i)=>{
        const parts = [].concat(result.name, file["path.utf-8"] || file.path || []).map((p)=>p.toString());
        return {
            path: path_browserify_default().join.apply(null, [
                (path_browserify_default()).sep
            ].concat(parts)).slice(1),
            name: parts[parts.length - 1],
            length: file.length,
            offset: files.slice(0, i).reduce(sumLength, 0)
        };
    });
    result.length = files.reduce(sumLength, 0);
    const lastFile = result.files[result.files.length - 1];
    result.pieceLength = t.info["piece length"];
    result.lastPieceLength = (lastFile.offset + lastFile.length) % result.pieceLength || result.pieceLength;
    result.pieces = splitPieces(t.info.pieces);
    return result;
}
function sumLength(sum, file) {
    return sum + file.length;
}
function splitPieces(buf) {
    const pieces = [];
    for(let i = 0; i < buf.length; i += 20){
        pieces.push(buf.slice(i, i + 20).toString("hex"));
    }
    return pieces;
}
function ensure(bool, fieldName) {
    if (!bool) throw new Error(`Torrent is missing required field: ${fieldName}`);
}
// Workaround Browserify v13 bug
// https://github.com/substack/node-browserify/issues/1483
(()=>{
    Buffer.alloc(0);
})();

;// CONCATENATED MODULE: ./src/pages/upload.ts
/* provided dependency */ var upload_Buffer = __webpack_require__("./node_modules/buffer/index.js")["lW"];







function toBuffer(ab) {
    const buf = upload_Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for(let i = 0; i < buf.length; ++i){
        buf[i] = view[i];
    }
    return buf;
}
function highlightNeedsToBeVerified(selectors) {
    selectors.forEach((s)=>{
        console.log("Highlighting", s);
        $(s).css("border", "yellow solid 1.5px");
    });
}
// @TODO: Spaghetti nonsense, should have slept before
function uploadPageMain() {
    // const filename = $("#file").val() as string;
    const { goButton , error , warning , input , setError , setLoading , setWarning , insert , incorrectFilename ,  } = uploadNoIntroLinkParserUI();
    insert();
    goButton.insertAfter("#file");
    // Pre-fill link if possible
    const params = new URLSearchParams(window.location.search);
    const noIntroLink = params.get("no-intro");
    if (noIntroLink) {
        $("#no-intro-url-input").val(noIntroLink).change();
    }
    goButton.click(async ()=>{
        // Prechecks
        incorrectFilename.hide();
        incorrectFilename.empty();
        error.hide();
        warning.hide();
        let link = input.val();
        try {
            if (!link) {
                setError("Please enter the No-Intro link");
                return;
            }
            const url = new URL(link);
            url.protocol = "https:";
            link = url.toString();
            if (!link.startsWith("https://datomatic.no-intro.org/")) {
                setError("Not a no-intro link");
                return;
            }
        } catch  {
            setError("Invalid URL");
            return;
        }
        // Fetch no intro
        setLoading(true);
        goButton.prop("disabled", true);
        let info;
        try {
            info = await fetchNoIntro(link);
        } catch (err) {
            setError(err.message || err || "An unexpected error has occurred");
            setLoading(false);
            goButton.prop("disabled", false);
            return;
        }
        const { filename , language , region , releaseTags , editionTags , title  } = info;
        // Call global hook (for other scripts)
        const platform = $("#platform").val();
        const desiredArchiveExt = PLATFORM_TO_ARCHIVE_TYPE[platform] || "zip";
        // @ts-expect-error
        if (typeof unsafeWindow.GM_GGN_NOINTRO_HELPER_ADDED_LINKS === "function") {
            // @ts-expect-error
            const res = await unsafeWindow.GM_GGN_NOINTRO_HELPER_BEFORE_MAGIC_BUTTON({
                ...info,
                archiveName: title + "." + desiredArchiveExt
            });
            if (res) {
                setError(res);
                setLoading(false);
                goButton.prop("disabled", false);
                return;
            }
        }
        // Parse torrent
        // let parsedTorrent: Awaited<ReturnType<typeof parseTorrent>>;
        // let filenameFromUploadedTorrent = "";
        const file = $("#file").prop("files")[0];
        if (!file) {
            setError("No torrent file uploaded");
            setLoading(false);
            goButton.prop("disabled", false);
            return;
        }
        try {
            const parsedTorrent = parseTorrent(toBuffer(await file.arrayBuffer()));
            if (!("files" in parsedTorrent)) {
                console.log("nofiles");
                throw new Error("No files in torrent");
            }
            // Check if torrent is a single file
            if (parsedTorrent.files.length !== 1) {
                setError("Can't compare the filenames in the torrent to No-Intro since the torrent has multiple files. If this is intentional, please ignore this error message.");
            } else {
                // @TODO: verify file not in subfolder
                console.log("Parsed torrent file", parsedTorrent.files[0]);
                const filenameFromUploadedTorrent = parsedTorrent.files[0].name.split(".").slice(0, -1).join(".");
                if (filenameFromUploadedTorrent !== title) {
                    setError("The filename in the torrent does not match the No-Intro title");
                    incorrectFilename.show();
                    incorrectFilename.append(`The filename in the torrent is: ${smallPre(filenameFromUploadedTorrent, "lightcoral")} but the desired filename, based on <i>No-Intro</i> is: ${smallPre(title, "lightgreen")}
If this is intentional, please ignore this message.`);
                }
            }
        } catch  {
            setError("Couldn't parse torrent file, continuing without verifying torrent");
        }
        const highlightForVerification = [];
        // Release type = ROM
        $("select#miscellaneous").val("ROM").change();
        // Description
        $("textarea#release_desc").val(generateTorrentDescription(link, filename, // @ts-expect-error hemummume
        PLATFORM_TO_ARCHIVE_TYPE[$("#platform").val()] !== "7z"));
        // Region
        $("select#region").val(region);
        highlightForVerification.push("select#region");
        // Language
        if (language) {
            $("select#language").val(language);
        }
        highlightForVerification.push("select#language");
        // It is a special edition (all no intro are)
        if (!$("input#remaster").prop("checked")) {
            $("input#remaster").prop("checked", true);
            Remaster();
        }
        // Not a scene release
        $("#ripsrc_home").prop("checked", true);
        updateReleaseTitle(title.replace(/\(.+?\)/g, "").trim() + (releaseTags ? " " + releaseTags : ""));
        highlightForVerification.push("input#release_title");
        // Set correct edition from url params/edition
        // @TODO: Compare from param to expected
        // Sometimes editions are created wrong
        // If so maybe let the user choose or just show a warning
        let editionFromParam = params.get("edition");
        let editionFromTags = "";
        if (!editionFromParam) {
            const postfix = editionTags.length === 0 ? "" : ` - ${editionTags.join(", ")}`;
            editionFromTags = `No-Intro${postfix}`;
        }
        // Update edition select
        let updatedEdition = false;
        $("#groupremasters > option").each(function() {
            const title = $(this).text().toLowerCase();
            if (editionFromParam) {
                if (title === editionFromParam.toLowerCase()) {
                    setUploadEdition($(this).val());
                    updatedEdition = true;
                    return false; // This breaks out of the jquery loop
                }
                return;
            }
            if (editionFromTags && title.replace(/ \(\d{4}\)/, "") === editionFromTags.toLowerCase()) {
                setUploadEdition($(this).val());
                updatedEdition = true;
                return false;
            }
        });
        // If edition does not exist, fill name at least
        if (!updatedEdition) {
            $("#remaster_title").val(editionFromTags);
            highlightForVerification.push("#remaster_title");
        }
        highlightNeedsToBeVerified(highlightForVerification);
        setWarning(`Make sure to verify everything before uploading, especially the highlighted details.\nEven scripts make mistakes.`);
        // Wrap up
        setLoading(false);
        goButton.prop("disabled", false);
    });
}

;// CONCATENATED MODULE: ./src/index.ts



async function main() {
    console.log("GGn No-Intro Helper: Starting...");
    if (window.location.pathname === "/torrents.php") {
        torrentsPageMain();
    } else if (window.location.pathname === "/upload.php") {
        uploadPageMain();
    }
    // Blacklist no-intro URLs that lead to ban
    $("a").click(function() {
        if (NO_INTRO_ROM_LINK_REGEX.test($(this).attr("href"))) {
            $(this).text("BLACKLISTED");
            return false;
        }
    });
}
main().catch((e)=>{
    console.log(e);
});

})();

/******/ })()
;