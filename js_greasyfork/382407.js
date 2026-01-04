// ==UserScript==
// @name           HLS parser
// @namespace      https://greasyfork.org/users/136230
// @description    Parser for hls
// @include        *://*
// @version        0.5.0
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/382407/HLS%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/382407/HLS%20parser.meta.js
// ==/UserScript==

// git source: https://github.com/kuu/hls-parser.git

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HLS"] = factory();
	else
		root["HLS"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! ./utils */ "./utils.js"),
    getOptions = _require.getOptions,
    setOptions = _require.setOptions;

var parse = __webpack_require__(/*! ./parse */ "./parse.js");

var stringify = __webpack_require__(/*! ./stringify */ "./stringify.js");

var types = __webpack_require__(/*! ./types */ "./types.js");

module.exports = {
  parse: parse,
  stringify: stringify,
  types: types,
  getOptions: getOptions,
  setOptions: setOptions
};

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
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
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./parse.js":
/*!******************!*\
  !*** ./parse.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var utils = __webpack_require__(/*! ./utils */ "./utils.js");

var _require = __webpack_require__(/*! ./types */ "./types.js"),
    Rendition = _require.Rendition,
    Variant = _require.Variant,
    SessionData = _require.SessionData,
    Key = _require.Key,
    MediaInitializationSection = _require.MediaInitializationSection,
    DateRange = _require.DateRange,
    SpliceInfo = _require.SpliceInfo,
    MasterPlaylist = _require.MasterPlaylist,
    MediaPlaylist = _require.MediaPlaylist,
    Segment = _require.Segment;

function unquote(str) {
  return utils.trim(str, '"');
}

function getTagCategory(tagName) {
  switch (tagName) {
    case 'EXTM3U':
    case 'EXT-X-VERSION':
      return 'Basic';

    case 'EXTINF':
    case 'EXT-X-BYTERANGE':
    case 'EXT-X-DISCONTINUITY':
    case 'EXT-X-KEY':
    case 'EXT-X-MAP':
    case 'EXT-X-PROGRAM-DATE-TIME':
    case 'EXT-X-DATERANGE':
    case 'EXT-X-CUE-OUT':
    case 'EXT-X-CUE-IN':
    case 'EXT-X-CUE-OUT-CONT':
    case 'EXT-X-CUE':
    case 'EXT-OATCLS-SCTE35':
    case 'EXT-X-ASSET':
    case 'EXT-X-SCTE35':
      return 'Segment';

    case 'EXT-X-TARGETDURATION':
    case 'EXT-X-MEDIA-SEQUENCE':
    case 'EXT-X-DISCONTINUITY-SEQUENCE':
    case 'EXT-X-ENDLIST':
    case 'EXT-X-PLAYLIST-TYPE':
    case 'EXT-X-I-FRAMES-ONLY':
      return 'MediaPlaylist';

    case 'EXT-X-MEDIA':
    case 'EXT-X-STREAM-INF':
    case 'EXT-X-I-FRAME-STREAM-INF':
    case 'EXT-X-SESSION-DATA':
    case 'EXT-X-SESSION-KEY':
      return 'MasterPlaylist';

    case 'EXT-X-INDEPENDENT-SEGMENTS':
    case 'EXT-X-START':
      return 'MediaorMasterPlaylist';

    default:
      return 'Unknown';
  }
}

function parseEXTINF(param) {
  var pair = utils.splitAt(param, ',');
  return {
    duration: utils.toNumber(pair[0]),
    title: decodeURIComponent(escape(pair[1]))
  };
}

function parseBYTERANGE(param) {
  var pair = utils.splitAt(param, '@');
  return {
    length: utils.toNumber(pair[0]),
    offset: pair[1] ? utils.toNumber(pair[1]) : -1
  };
}

function parseResolution(str) {
  var pair = utils.splitAt(str, 'x');
  return {
    width: utils.toNumber(pair[0]),
    height: utils.toNumber(pair[1])
  };
}

function parseIV(str) {
  var iv = utils.hexToByteSequence(str);

  if (iv.length !== 16) {
    utils.INVALIDPLAYLIST('IV must be a 128-bit unsigned integer');
  }

  return iv;
}

function parseUserAttribute(str) {
  if (str.startsWith('"')) {
    return unquote(str);
  }

  if (str.startsWith('0x') || str.startsWith('0X')) {
    return utils.hexToByteSequence(str);
  }

  return utils.toNumber(str);
}

function setCompatibleVersionOfKey(params, attributes) {
  if (attributes['IV'] && params.compatibleVersion < 2) {
    params.compatibleVersion = 2;
  }

  if ((attributes['KEYFORMAT'] || attributes['KEYFORMATVERSIONS']) && params.compatibleVersion < 5) {
    params.compatibleVersion = 5;
  }
}

function parseAttributeList(param) {
  var list = utils.splitByCommaWithPreservingQuotes(param);
  var attributes = {};
  list.forEach(function (item) {
    var _utils$splitAt = utils.splitAt(item, '='),
        _utils$splitAt2 = _slicedToArray(_utils$splitAt, 2),
        key = _utils$splitAt2[0],
        value = _utils$splitAt2[1];

    var val = unquote(value);

    switch (key) {
      case 'URI':
        attributes[key] = val;
        break;

      case 'START-DATE':
      case 'END-DATE':
        attributes[key] = new Date(val);
        break;

      case 'IV':
        attributes[key] = parseIV(val);
        break;

      case 'BYTERANGE':
        attributes[key] = parseBYTERANGE(val);
        break;

      case 'RESOLUTION':
        attributes[key] = parseResolution(val);
        break;

      case 'END-ON-NEXT':
      case 'DEFAULT':
      case 'AUTOSELECT':
      case 'FORCED':
      case 'PRECISE':
        attributes[key] = val === 'YES';
        break;

      case 'DURATION':
      case 'PLANNED-DURATION':
      case 'BANDWIDTH':
      case 'AVERAGE-BANDWIDTH':
      case 'FRAME-RATE':
      case 'TIME-OFFSET':
        attributes[key] = utils.toNumber(val);
        break;

      default:
        if (key.startsWith('SCTE35-')) {
          attributes[key] = utils.hexToByteSequence(val);
        } else if (key.startsWith('X-')) {
          attributes[key] = parseUserAttribute(value);
        } else {
          attributes[key] = val;
        }

    }
  });
  return attributes;
}

function parseTagParam(name, param) {
  switch (name) {
    case 'EXTM3U':
    case 'EXT-X-DISCONTINUITY':
    case 'EXT-X-ENDLIST':
    case 'EXT-X-I-FRAMES-ONLY':
    case 'EXT-X-INDEPENDENT-SEGMENTS':
    case 'EXT-X-CUE-IN':
      return [null, null];

    case 'EXT-X-VERSION':
    case 'EXT-X-TARGETDURATION':
    case 'EXT-X-MEDIA-SEQUENCE':
    case 'EXT-X-DISCONTINUITY-SEQUENCE':
    case 'EXT-X-CUE-OUT':
      return [utils.toNumber(param), null];

    case 'EXT-X-KEY':
    case 'EXT-X-MAP':
    case 'EXT-X-DATERANGE':
    case 'EXT-X-MEDIA':
    case 'EXT-X-STREAM-INF':
    case 'EXT-X-I-FRAME-STREAM-INF':
    case 'EXT-X-SESSION-DATA':
    case 'EXT-X-SESSION-KEY':
    case 'EXT-X-START':
      return [null, parseAttributeList(param)];

    case 'EXTINF':
      return [parseEXTINF(param), null];

    case 'EXT-X-BYTERANGE':
      return [parseBYTERANGE(param), null];

    case 'EXT-X-PROGRAM-DATE-TIME':
      return [new Date(param), null];

    case 'EXT-X-PLAYLIST-TYPE':
      return [param, null];
    // <EVENT|VOD>

    default:
      return [param, null];
    // Unknown tag
  }
}

function MIXEDTAGS() {
  utils.INVALIDPLAYLIST("The file contains both media and master playlist tags.");
}

function splitTag(line) {
  var index = line.indexOf(':');

  if (index === -1) {
    return [line.slice(1).trim(), null];
  }

  return [line.slice(1, index).trim(), line.slice(index + 1).trim()];
}

function parseRendition(_ref) {
  var attributes = _ref.attributes;
  var rendition = new Rendition({
    type: attributes['TYPE'],
    uri: attributes['URI'],
    groupId: attributes['GROUP-ID'],
    language: attributes['LANGUAGE'],
    assocLanguage: attributes['ASSOC-LANGUAGE'],
    name: attributes['NAME'],
    isDefault: attributes['DEFAULT'],
    autoselect: attributes['AUTOSELECT'],
    forced: attributes['FORCED'],
    instreamId: attributes['INSTREAM-ID'],
    characteristics: attributes['CHARACTERISTICS'],
    channels: attributes['CHANNELS']
  });
  return rendition;
}

function checkRedundantRendition(renditions, rendition) {
  var defaultFound = false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = renditions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.name === rendition.name) {
        return 'All EXT-X-MEDIA tags in the same Group MUST have different NAME attributes.';
      }

      if (item.isDefault) {
        defaultFound = true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (defaultFound && rendition.isDefault) {
    return 'EXT-X-MEDIA A Group MUST NOT have more than one member with a DEFAULT attribute of YES.';
  }

  return '';
}

function addRendition(variant, line, type) {
  var rendition = parseRendition(line);
  var renditions = variant[utils.camelify(type)];
  var errorMessage = checkRedundantRendition(renditions, rendition);

  if (errorMessage) {
    utils.INVALIDPLAYLIST(errorMessage);
  }

  renditions.push(rendition);

  if (rendition.isDefault) {
    variant.currentRenditions[utils.camelify(type)] = renditions.length - 1;
  }
}

function matchTypes(attrs, variant, params) {
  ['AUDIO', 'VIDEO', 'SUBTITLES', 'CLOSED-CAPTIONS'].forEach(function (type) {
    if (type === 'CLOSED-CAPTIONS' && attrs[type] === 'NONE') {
      params.isClosedCaptionsNone = true;
      variant.closedCaptions = [];
    } else if (attrs[type] && !variant[utils.camelify(type)].find(function (item) {
      return item.groupId === attrs[type];
    })) {
      utils.INVALIDPLAYLIST("".concat(type, " attribute MUST match the value of the GROUP-ID attribute of an EXT-X-MEDIA tag whose TYPE attribute is ").concat(type, "."));
    }
  });
}

function parseVariant(lines, variantAttrs, uri, iFrameOnly, params) {
  var variant = new Variant({
    uri: uri,
    bandwidth: variantAttrs['BANDWIDTH'],
    averageBandwidth: variantAttrs['AVERAGE-BANDWIDTH'],
    codecs: variantAttrs['CODECS'],
    resolution: variantAttrs['RESOLUTION'],
    frameRate: variantAttrs['FRAME-RATE'],
    hdcpLevel: variantAttrs['HDCP-LEVEL']
  });
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var line = _step2.value;

      if (line.name === 'EXT-X-MEDIA') {
        var renditionAttrs = line.attributes;
        var renditionType = renditionAttrs['TYPE'];

        if (!renditionType || !renditionAttrs['GROUP-ID']) {
          utils.INVALIDPLAYLIST('EXT-X-MEDIA TYPE attribute is REQUIRED.');
        }

        if (variantAttrs[renditionType] === renditionAttrs['GROUP-ID']) {
          addRendition(variant, line, renditionType);

          if (renditionType === 'CLOSED-CAPTIONS') {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = variant.closedCaptions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var instreamId = _step3.value.instreamId;

                if (instreamId && instreamId.startsWith('SERVICE') && params.compatibleVersion < 7) {
                  params.compatibleVersion = 7;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  matchTypes(variantAttrs, variant, params);
  variant.isIFrameOnly = iFrameOnly;
  return variant;
}

function sameKey(key1, key2) {
  if (key1.method !== key2.method) {
    return false;
  }

  if (key1.uri !== key2.uri) {
    return false;
  }

  if (key1.iv) {
    if (!key2.iv) {
      return false;
    }

    if (key1.iv.length !== key2.iv.length) {
      return false;
    }

    for (var i = 0; i < key1.iv.length; i++) {
      if (key1.iv[i] !== key2.iv[i]) {
        return false;
      }
    }
  } else if (key2.iv) {
    return false;
  }

  if (key1.format !== key2.format) {
    return false;
  }

  if (key1.formatVersion !== key2.formatVersion) {
    return false;
  }

  return true;
}

function parseMasterPlaylist(lines, params) {
  var playlist = new MasterPlaylist();
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = lines.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2),
          index = _step4$value[0],
          _step4$value$ = _step4$value[1],
          name = _step4$value$.name,
          value = _step4$value$.value,
          attributes = _step4$value$.attributes;

      if (name === 'EXT-X-VERSION') {
        playlist.version = value;
      } else if (name === 'EXT-X-STREAM-INF') {
        var uri = lines[index + 1];

        if (typeof uri !== 'string' || uri.startsWith('#EXT')) {
          utils.INVALIDPLAYLIST('EXT-X-STREAM-INF must be followed by a URI line');
        }

        var _variant = parseVariant(lines, attributes, uri, false, params);

        if (_variant) {
          playlist.variants.push(_variant);
        }
      } else if (name === 'EXT-X-I-FRAME-STREAM-INF') {
        var _variant2 = parseVariant(lines, attributes, attributes.URI, true, params);

        if (_variant2) {
          playlist.variants.push(_variant2);
        }
      } else if (name === 'EXT-X-SESSION-DATA') {
        (function () {
          var sessionData = new SessionData({
            id: attributes['DATA-ID'],
            value: attributes['VALUE'],
            uri: attributes['URI'],
            language: attributes['LANGUAGE']
          });

          if (playlist.sessionDataList.find(function (item) {
            return item.id === sessionData.id && item.language === sessionData.language;
          })) {
            utils.INVALIDPLAYLIST('A Playlist MUST NOT contain more than one EXT-X-SESSION-DATA tag with the same DATA-ID attribute and the same LANGUAGE attribute.');
          }

          playlist.sessionDataList.push(sessionData);
        })();
      } else if (name === 'EXT-X-SESSION-KEY') {
        (function () {
          if (attributes['METHOD'] === 'NONE') {
            utils.INVALIDPLAYLIST('EXT-X-SESSION-KEY: The value of the METHOD attribute MUST NOT be NONE');
          }

          var sessionKey = new Key({
            method: attributes['METHOD'],
            uri: attributes['URI'],
            iv: attributes['IV'],
            format: attributes['KEYFORMAT'],
            formatVersion: attributes['KEYFORMATVERSIONS']
          });

          if (playlist.sessionKeyList.find(function (item) {
            return sameKey(item, sessionKey);
          })) {
            utils.INVALIDPLAYLIST('A Master Playlist MUST NOT contain more than one EXT-X-SESSION-KEY tag with the same METHOD, URI, IV, KEYFORMAT, and KEYFORMATVERSIONS attribute values.');
          }

          setCompatibleVersionOfKey(params, attributes);
          playlist.sessionKeyList.push(sessionKey);
        })();
      } else if (name === 'EXT-X-INDEPENDENT-SEGMENTS') {
        if (playlist.independentSegments) {
          utils.INVALIDPLAYLIST('EXT-X-INDEPENDENT-SEGMENTS tag MUST NOT appear more than once in a Playlist');
        }

        playlist.independentSegments = true;
      } else if (name === 'EXT-X-START') {
        if (playlist.start) {
          utils.INVALIDPLAYLIST('EXT-X-START tag MUST NOT appear more than once in a Playlist');
        }

        if (typeof attributes['TIME-OFFSET'] !== 'number') {
          utils.INVALIDPLAYLIST('EXT-X-START: TIME-OFFSET attribute is REQUIRED');
        }

        playlist.start = {
          offset: attributes['TIME-OFFSET'],
          precise: attributes['PRECISE'] || false
        };
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  if (params.isClosedCaptionsNone) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = playlist.variants[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var variant = _step5.value;

        if (variant.closedCaptions.length > 0) {
          utils.INVALIDPLAYLIST('If there is a variant with CLOSED-CAPTIONS attribute of NONE, all EXT-X-STREAM-INF tags MUST have this attribute with a value of NONE');
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  return playlist;
}

function parseSegment(lines, uri, start, end, mediaSequenceNumber, discontinuitySequence, params) {
  var segment = new Segment({
    uri: uri,
    mediaSequenceNumber: mediaSequenceNumber,
    discontinuitySequence: discontinuitySequence
  });

  var _loop = function _loop(i) {
    var _lines$i = lines[i],
        name = _lines$i.name,
        value = _lines$i.value,
        attributes = _lines$i.attributes;

    if (name === 'EXTINF') {
      if (!Number.isInteger(value.duration) && params.compatibleVersion < 3) {
        params.compatibleVersion = 3;
      }

      if (Math.round(value.duration) > params.targetDuration) {
        utils.INVALIDPLAYLIST('EXTINF duration, when rounded to the nearest integer, MUST be less than or equal to the target duration');
      }

      segment.duration = value.duration;
      segment.title = value.title;
    } else if (name === 'EXT-X-BYTERANGE') {
      if (params.compatibleVersion < 4) {
        params.compatibleVersion = 4;
      }

      segment.byterange = value;
    } else if (name === 'EXT-X-DISCONTINUITY') {
      segment.discontinuity = true;
    } else if (name === 'EXT-X-KEY') {
      setCompatibleVersionOfKey(params, attributes);
      segment.key = new Key({
        method: attributes['METHOD'],
        uri: attributes['URI'],
        iv: attributes['IV'],
        format: attributes['KEYFORMAT'],
        formatVersion: attributes['KEYFORMATVERSIONS']
      });
    } else if (name === 'EXT-X-MAP') {
      if (params.compatibleVersion < 5) {
        params.compatibleVersion = 5;
      }

      params.hasMap = true;
      segment.map = new MediaInitializationSection({
        uri: attributes['URI'],
        byterange: attributes['BYTERANGE']
      });
    } else if (name === 'EXT-X-PROGRAM-DATE-TIME') {
      segment.programDateTime = value;
    } else if (name === 'EXT-X-DATERANGE') {
      var attrs = {};
      Object.keys(attributes).forEach(function (key) {
        if (key.startsWith('SCTE35-') || key.startsWith('X-')) {
          attrs[key] = attributes[key];
        }
      });
      segment.dateRange = new DateRange({
        id: attributes['ID'],
        classId: attributes['CLASS'],
        start: attributes['START-DATE'],
        end: attributes['END-DATE'],
        duration: attributes['DURATION'],
        plannedDuration: attributes['PLANNED-DURATION'],
        endOnNext: attributes['END-ON-NEXT'],
        attributes: attrs
      });
    } else if (name === 'EXT-X-CUE-OUT') {
      segment.markers.push(new SpliceInfo({
        type: 'OUT',
        duration: value
      }));
    } else if (name === 'EXT-X-CUE-IN') {
      segment.markers.push(new SpliceInfo({
        type: 'IN'
      }));
    } else if (name === 'EXT-X-CUE-OUT-CONT' || name === 'EXT-X-CUE' || name === 'EXT-OATCLS-SCTE35' || name === 'EXT-X-ASSET' || name === 'EXT-X-SCTE35') {
      segment.markers.push(new SpliceInfo({
        type: 'RAW',
        tagName: name,
        value: value
      }));
    }
  };

  for (var i = start; i <= end; i++) {
    _loop(i);
  }

  return segment;
}

function parseMediaPlaylist(lines, params) {
  var playlist = new MediaPlaylist();
  var segmentStart = -1;
  var mediaSequence = 0;
  var discontinuityFound = false;
  var discontinuitySequence = 0;
  var currentKey = null;
  var currentMap = null;
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = lines.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var _step6$value = _slicedToArray(_step6.value, 2),
          index = _step6$value[0],
          line = _step6$value[1];

      var name = line.name,
          value = line.value,
          attributes = line.attributes,
          category = line.category;

      if (category === 'Segment') {
        if (segmentStart === -1) {
          segmentStart = index;
        }

        if (name === 'EXT-X-DISCONTINUITY') {
          discontinuityFound = true;
        }

        continue;
      }

      if (name === 'EXT-X-VERSION') {
        if (playlist.version === undefined) {
          playlist.version = value;
        } else {
          utils.INVALIDPLAYLIST('A Playlist file MUST NOT contain more than one EXT-X-VERSION tag.');
        }
      } else if (name === 'EXT-X-TARGETDURATION') {
        playlist.targetDuration = params.targetDuration = value;
      } else if (name === 'EXT-X-MEDIA-SEQUENCE') {
        if (playlist.segments.length > 0) {
          utils.INVALIDPLAYLIST('The EXT-X-MEDIA-SEQUENCE tag MUST appear before the first Media Segment in the Playlist.');
        }

        playlist.mediaSequenceBase = mediaSequence = value;
      } else if (name === 'EXT-X-DISCONTINUITY-SEQUENCE') {
        if (playlist.segments.length > 0) {
          utils.INVALIDPLAYLIST('The EXT-X-DISCONTINUITY-SEQUENCE tag MUST appear before the first Media Segment in the Playlist.');
        }

        if (discontinuityFound) {
          utils.INVALIDPLAYLIST('The EXT-X-DISCONTINUITY-SEQUENCE tag MUST appear before any EXT-X-DISCONTINUITY tag.');
        }

        playlist.discontinuitySequenceBase = discontinuitySequence = value;
      } else if (name === 'EXT-X-ENDLIST') {
        playlist.endlist = true;
      } else if (name === 'EXT-X-PLAYLIST-TYPE') {
        playlist.playlistType = value;
      } else if (name === 'EXT-X-I-FRAMES-ONLY') {
        if (params.compatibleVersion < 4) {
          params.compatibleVersion = 4;
        }

        playlist.isIFrame = true;
      } else if (name === 'EXT-X-INDEPENDENT-SEGMENTS') {
        if (playlist.independentSegments) {
          utils.INVALIDPLAYLIST('EXT-X-INDEPENDENT-SEGMENTS tag MUST NOT appear more than once in a Playlist');
        }

        playlist.independentSegments = true;
      } else if (name === 'EXT-X-START') {
        if (playlist.start) {
          utils.INVALIDPLAYLIST('EXT-X-START tag MUST NOT appear more than once in a Playlist');
        }

        if (typeof attributes['TIME-OFFSET'] !== 'number') {
          utils.INVALIDPLAYLIST('EXT-X-START: TIME-OFFSET attribute is REQUIRED');
        }

        playlist.start = {
          offset: attributes['TIME-OFFSET'],
          precise: attributes['PRECISE'] || false
        };
      } else if (typeof line === 'string') {
        // uri
        if (segmentStart === -1) {
          utils.INVALIDPLAYLIST('A URI line is not preceded by any segment tags');
        }

        if (!playlist.targetDuration) {
          utils.INVALIDPLAYLIST('The EXT-X-TARGETDURATION tag is REQUIRED');
        }

        var segment = parseSegment(lines, line, segmentStart, index - 1, mediaSequence++, discontinuitySequence, params);

        if (segment) {
          var discontinuity = segment.discontinuity,
              key = segment.key,
              map = segment.map,
              byterange = segment.byterange,
              uri = segment.uri;

          if (discontinuity) {
            segment.discontinuitySequence = ++discontinuitySequence;
          }

          if (key) {
            currentKey = key;
          } else if (currentKey) {
            segment.key = currentKey;
          }

          if (map) {
            currentMap = map;
          } else if (currentMap) {
            segment.map = currentMap;
          }

          if (byterange && byterange.offset === -1) {
            var segments = playlist.segments;

            if (segments.length > 0) {
              var prevSegment = segments[segments.length - 1];

              if (prevSegment.byterange && prevSegment.uri === uri) {
                byterange.offset = prevSegment.byterange.offset + prevSegment.byterange.length;
              } else {
                utils.INVALIDPLAYLIST('If offset of EXT-X-BYTERANGE is not present, a previous Media Segment MUST be a sub-range of the same media resource');
              }
            } else {
              utils.INVALIDPLAYLIST('If offset of EXT-X-BYTERANGE is not present, a previous Media Segment MUST appear in the Playlist file');
            }
          }

          playlist.segments.push(segment);
        }

        segmentStart = -1;
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
        _iterator6["return"]();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  checkDateRange(playlist.segments);
  return playlist;
}

function checkDateRange(segments) {
  var earliestDates = new Map();
  var rangeList = new Map();
  var hasDateRange = false;
  var hasProgramDateTime = false;

  for (var i = segments.length - 1; i >= 0; i--) {
    var _segments$i = segments[i],
        programDateTime = _segments$i.programDateTime,
        dateRange = _segments$i.dateRange;

    if (programDateTime) {
      hasProgramDateTime = true;
    }

    if (dateRange) {
      hasDateRange = true;

      if (dateRange.endOnNext && (dateRange.end || dateRange.duration)) {
        utils.INVALIDPLAYLIST('An EXT-X-DATERANGE tag with an END-ON-NEXT=YES attribute MUST NOT contain DURATION or END-DATE attributes.');
      }

      var start = dateRange.start.getTime();
      var duration = dateRange.duration || 0;

      if (dateRange.end && dateRange.duration) {
        if (start + duration * 1000 !== dateRange.end.getTime()) {
          utils.INVALIDPLAYLIST('END-DATE MUST be equal to the value of the START-DATE attribute plus the value of the DURATION');
        }
      }

      if (dateRange.endOnNext) {
        dateRange.end = earliestDates.get(dateRange.classId);
      }

      earliestDates.set(dateRange.classId, dateRange.start);
      var end = dateRange.end ? dateRange.end.getTime() : dateRange.start.getTime() + (dateRange.duration || 0) * 1000;
      var range = rangeList.get(dateRange.classId);

      if (range) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = range[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var entry = _step7.value;

            if (entry.start <= start && entry.end > start || entry.start >= start && entry.start < end) {
              utils.INVALIDPLAYLIST('DATERANGE tags with the same CLASS should not overlap');
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        range.push({
          start: start,
          end: end
        });
      } else {
        rangeList.set(dateRange.classId, [{
          start: start,
          end: end
        }]);
      }
    }
  }

  if (hasDateRange && !hasProgramDateTime) {
    utils.INVALIDPLAYLIST('If a Playlist contains an EXT-X-DATERANGE tag, it MUST also contain at least one EXT-X-PROGRAM-DATE-TIME tag.');
  }
}

function CHECKTAGCATEGORY(category, params) {
  if (category === 'Segment' || category === 'MediaPlaylist') {
    if (params.isMasterPlaylist === undefined) {
      params.isMasterPlaylist = false;
      return;
    }

    if (params.isMasterPlaylist) {
      MIXEDTAGS();
    }

    return;
  }

  if (category === 'MasterPlaylist') {
    if (params.isMasterPlaylist === undefined) {
      params.isMasterPlaylist = true;
      return;
    }

    if (params.isMasterPlaylist === false) {
      MIXEDTAGS();
    }
  } // category === 'Basic' or 'MediaorMasterPlaylist' or 'Unknown'

}

function parseTag(line, params) {
  var _splitTag = splitTag(line),
      _splitTag2 = _slicedToArray(_splitTag, 2),
      name = _splitTag2[0],
      param = _splitTag2[1];

  var category = getTagCategory(name);
  CHECKTAGCATEGORY(category, params);

  if (category === 'Unknown') {
    return null;
  }

  if (category === 'MediaPlaylist') {
    if (params.hash[name]) {
      utils.INVALIDPLAYLIST('There MUST NOT be more than one Media Playlist tag of each type in any Media Playlist');
    }

    params.hash[name] = true;
  }

  var _parseTagParam = parseTagParam(name, param),
      _parseTagParam2 = _slicedToArray(_parseTagParam, 2),
      value = _parseTagParam2[0],
      attributes = _parseTagParam2[1];

  return {
    name: name,
    category: category,
    value: value,
    attributes: attributes
  };
}

function lexicalParse(text, params) {
  var lines = [];
  text.split('\n').forEach(function (l) {
    var line = l.trim();

    if (!line) {
      // empty line
      return;
    }

    if (line.startsWith('#')) {
      if (line.startsWith('#EXT')) {
        // tag
        var tag = parseTag(line, params);

        if (tag) {
          lines.push(tag);
        }

        return;
      } // comment


      return;
    } // uri


    lines.push(line);
  });

  if (lines.length === 0 || lines[0].name !== 'EXTM3U') {
    utils.INVALIDPLAYLIST('The EXTM3U tag MUST be the first line.');
  }

  return lines;
}

function semanticParse(lines, params) {
  var playlist;

  if (params.isMasterPlaylist) {
    playlist = parseMasterPlaylist(lines, params);
  } else {
    playlist = parseMediaPlaylist(lines, params);

    if (!playlist.isIFrame && params.hasMap && params.compatibleVersion < 6) {
      params.compatibleVersion = 6;
    }
  }

  if (params.compatibleVersion > 1) {
    if (!playlist.version || playlist.version < params.compatibleVersion) {
      utils.INVALIDPLAYLIST("EXT-X-VERSION needs to be ".concat(params.compatibleVersion, " or higher."));
    }
  }

  return playlist;
}

function parse(text) {
  var params = {
    version: undefined,
    isMasterPlaylist: undefined,
    hasMap: false,
    targetDuration: 0,
    compatibleVersion: 1,
    isClosedCaptionsNone: false,
    hash: {}
  };
  var lines = lexicalParse(text, params);
  var playlist = semanticParse(lines, params);
  playlist.source = text;
  return playlist;
}

module.exports = parse;

/***/ }),

/***/ "./stringify.js":
/*!**********************!*\
  !*** ./stringify.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var utils = __webpack_require__(/*! ./utils */ "./utils.js");

var ALLOW_REDUNDANCY = ['#EXTINF', '#EXT-X-BYTERANGE', '#EXT-X-DISCONTINUITY', '#EXT-X-STREAM-INF', '#EXT-X-CUE-OUT', '#EXT-X-CUE-IN'];
var SKIP_IF_REDUNDANT = ['#EXT-X-KEY', '#EXT-X-MAP', '#EXT-X-MEDIA'];

var LineArray =
/*#__PURE__*/
function (_Array) {
  _inherits(LineArray, _Array);

  function LineArray(baseUri) {
    var _this;

    _classCallCheck(this, LineArray);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LineArray).call(this));
    _this.baseUri = baseUri;
    return _this;
  } // @override


  _createClass(LineArray, [{
    key: "push",
    value: function push() {
      var _this2 = this;

      for (var _len = arguments.length, elems = new Array(_len), _key = 0; _key < _len; _key++) {
        elems[_key] = arguments[_key];
      }

      var _loop = function _loop() {
        var elem = _elems[_i];

        if (!elem.startsWith('#')) {
          _get(_getPrototypeOf(LineArray.prototype), "push", _this2).call(_this2, elem);

          return "continue";
        }

        if (ALLOW_REDUNDANCY.some(function (item) {
          return elem.startsWith(item);
        })) {
          _get(_getPrototypeOf(LineArray.prototype), "push", _this2).call(_this2, elem);

          return "continue";
        }

        if (_this2.includes(elem)) {
          if (SKIP_IF_REDUNDANT.some(function (item) {
            return elem.startsWith(item);
          })) {
            return "continue";
          }

          utils.INVALIDPLAYLIST("Redundant item (".concat(elem, ")"));
        }

        _get(_getPrototypeOf(LineArray.prototype), "push", _this2).call(_this2, elem);
      };

      // redundancy check
      for (var _i = 0, _elems = elems; _i < _elems.length; _i++) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    }
  }]);

  return LineArray;
}(_wrapNativeSuper(Array));

function buildDecimalFloatingNumber(num, fixed) {
  var rounded = Math.round(num * 1000) / 1000;
  return fixed ? rounded.toFixed(fixed) : rounded;
}

function buildMasterPlaylist(lines, playlist) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = playlist.sessionDataList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sessionData = _step.value;
      buildSessionData(lines, sessionData);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = playlist.sessionKeyList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var sessionKey = _step2.value;
      buildKey(lines, sessionKey, true);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = playlist.variants[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var variant = _step3.value;
      buildVariant(lines, variant);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function buildSessionData(lines, sessionData) {
  var attrs = ["DATA-ID=\"".concat(sessionData.id, "\"")];

  if (sessionData.language) {
    attrs.push("LANGUAGE=\"".concat(sessionData.language, "\""));
  }

  if (sessionData.value) {
    attrs.push("VALUE=\"".concat(sessionData.value, "\""));
  } else if (sessionData.uri) {
    attrs.push("URI=\"".concat(sessionData.uri, "\""));
  }

  lines.push("#EXT-X-SESSION-DATA:".concat(attrs.join(',')));
}

function buildKey(lines, key, isSessionKey) {
  var name = isSessionKey ? '#EXT-X-SESSION-KEY' : '#EXT-X-KEY';
  var attrs = ["METHOD=".concat(key.method)];

  if (key.uri) {
    attrs.push("URI=\"".concat(key.uri, "\""));
  }

  if (key.iv) {
    if (key.iv.length !== 16) {
      utils.INVALIDPLAYLIST('IV must be a 128-bit unsigned integer');
    }

    attrs.push("IV=".concat(utils.byteSequenceToHex(key.iv)));
  }

  if (key.format) {
    attrs.push("KEYFORMAT=\"".concat(key.format, "\""));
  }

  if (key.formatVersion) {
    attrs.push("KEYFORMATVERSIONS=\"".concat(key.formatVersion, "\""));
  }

  lines.push("".concat(name, ":").concat(attrs.join(',')));
}

function buildVariant(lines, variant) {
  var name = variant.isIFrameOnly ? '#EXT-X-I-FRAME-STREAM-INF' : '#EXT-X-STREAM-INF';
  var attrs = ["BANDWIDTH=".concat(variant.bandwidth)];

  if (variant.averageBandwidth) {
    attrs.push("AVERAGE-BANDWIDTH=".concat(variant.averageBandwidth));
  }

  if (variant.isIFrameOnly) {
    attrs.push("URI=\"".concat(variant.uri, "\""));
  }

  if (variant.codecs) {
    attrs.push("CODECS=\"".concat(variant.codecs, "\""));
  }

  if (variant.resolution) {
    attrs.push("RESOLUTION=".concat(variant.resolution.width, "x").concat(variant.resolution.height));
  }

  if (variant.frameRate) {
    attrs.push("FRAME-RATE=".concat(buildDecimalFloatingNumber(variant.frameRate, 3)));
  }

  if (variant.hdcpLevel) {
    attrs.push("HDCP-LEVEL=".concat(variant.hdcpLevel));
  }

  if (variant.audio.length > 0) {
    attrs.push("AUDIO=\"".concat(variant.audio[0].groupId, "\""));
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = variant.audio[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var rendition = _step4.value;
        buildRendition(lines, rendition);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }

  if (variant.video.length > 0) {
    attrs.push("VIDEO=\"".concat(variant.video[0].groupId, "\""));
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = variant.video[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _rendition = _step5.value;
        buildRendition(lines, _rendition);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  if (variant.subtitles.length > 0) {
    attrs.push("SUBTITLES=\"".concat(variant.subtitles[0].groupId, "\""));
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = variant.subtitles[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _rendition2 = _step6.value;
        buildRendition(lines, _rendition2);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }

  if (utils.getOptions().allowClosedCaptionsNone && variant.closedCaptions.length === 0) {
    attrs.push("CLOSED-CAPTIONS=NONE");
  } else if (variant.closedCaptions.length > 0) {
    attrs.push("CLOSED-CAPTIONS=\"".concat(variant.closedCaptions[0].groupId, "\""));
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = variant.closedCaptions[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var _rendition3 = _step7.value;
        buildRendition(lines, _rendition3);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
          _iterator7["return"]();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }
  }

  lines.push("".concat(name, ":").concat(attrs.join(',')));

  if (!variant.isIFrameOnly) {
    lines.push("".concat(variant.uri));
  }
}

function buildRendition(lines, rendition) {
  var attrs = ["TYPE=".concat(rendition.type), "GROUP-ID=\"".concat(rendition.groupId, "\""), "NAME=\"".concat(rendition.name, "\"")];

  if (rendition.isDefault !== undefined) {
    attrs.push("DEFAULT=".concat(rendition.isDefault ? 'YES' : 'NO'));
  }

  if (rendition.autoselect !== undefined) {
    attrs.push("AUTOSELECT=".concat(rendition.autoselect ? 'YES' : 'NO'));
  }

  if (rendition.forced !== undefined) {
    attrs.push("FORCED=".concat(rendition.forced ? 'YES' : 'NO'));
  }

  if (rendition.language) {
    attrs.push("LANGUAGE=\"".concat(rendition.language, "\""));
  }

  if (rendition.assocLanguage) {
    attrs.push("ASSOC-LANGUAGE=\"".concat(rendition.assocLanguage, "\""));
  }

  if (rendition.instreamId) {
    attrs.push("INSTREAM-ID=\"".concat(rendition.instreamId, "\""));
  }

  if (rendition.characteristics) {
    attrs.push("CHARACTERISTICS=\"".concat(rendition.characteristics, "\""));
  }

  if (rendition.channels) {
    attrs.push("CHANNELS=\"".concat(rendition.channels, "\""));
  }

  if (rendition.uri) {
    attrs.push("URI=\"".concat(rendition.uri, "\""));
  }

  lines.push("#EXT-X-MEDIA:".concat(attrs.join(',')));
}

function buildMediaPlaylist(lines, playlist) {
  if (playlist.targetDuration) {
    lines.push("#EXT-X-TARGETDURATION:".concat(playlist.targetDuration));
  }

  if (playlist.mediaSequenceBase) {
    lines.push("#EXT-X-MEDIA-SEQUENCE:".concat(playlist.mediaSequenceBase));
  }

  if (playlist.discontinuitySequenceBase) {
    lines.push("#EXT-X-DISCONTINUITY-SEQUENCE:".concat(playlist.discontinuitySequenceBase));
  }

  if (playlist.playlistType) {
    lines.push("#EXT-X-PLAYLIST-TYPE:".concat(playlist.playlistType));
  }

  if (playlist.isIFrame) {
    lines.push("#EXT-X-I-FRAMES-ONLY");
  }

  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = playlist.segments[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var segment = _step8.value;
      buildSegment(lines, segment, playlist.version);
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
        _iterator8["return"]();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  if (playlist.endlist) {
    lines.push("#EXT-X-ENDLIST");
  }
}

function buildSegment(lines, segment) {
  var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (segment.byterange) {
    lines.push("#EXT-X-BYTERANGE:".concat(buildByteRange(segment.byterange)));
  }

  if (segment.discontinuity) {
    lines.push("#EXT-X-DISCONTINUITY");
  }

  if (segment.key) {
    buildKey(lines, segment.key);
  }

  if (segment.map) {
    buildMap(lines, segment.map);
  }

  if (segment.programDateTime) {
    lines.push("#EXT-X-PROGRAM-DATE-TIME:".concat(utils.formatDate(segment.programDateTime)));
  }

  if (segment.dateRange) {
    buildDateRange(lines, segment.dateRange);
  }

  if (segment.markers.length > 0) {
    buildMarkers(lines, segment.markers);
  }

  var duration = version < 3 ? Math.round(segment.duration) : buildDecimalFloatingNumber(segment.duration);
  lines.push("#EXTINF:".concat(duration, ",").concat(unescape(encodeURIComponent(segment.title || ''))));
  Array.prototype.push.call(lines, "".concat(segment.uri)); // URIs could be redundant when EXT-X-BYTERANGE is used
}

function buildMap(lines, map) {
  var attrs = ["URI=\"".concat(map.uri, "\"")];

  if (map.byterange) {
    attrs.push("BYTERANGE=".concat(buildByteRange(map.byterange)));
  }

  lines.push("#EXT-X-MAP:".concat(attrs.join(',')));
}

function buildByteRange(byterange) {
  return "".concat(byterange.length, "@").concat(byterange.offset);
}

function buildDateRange(lines, dateRange) {
  var attrs = ["ID=\"".concat(dateRange.id, "\""), "START-DATE=\"".concat(utils.formatDate(dateRange.start), "\"")];

  if (dateRange.end) {
    attrs.push("END-DATE=\"".concat(dateRange.end, "\""));
  }

  if (dateRange.duration) {
    attrs.push("DURATION=".concat(dateRange.duration));
  }

  if (dateRange.plannedDuration) {
    attrs.push("PLANNED-DURATION=".concat(dateRange.plannedDuration));
  }

  if (dateRange.classId) {
    attrs.push("CLASS=\"".concat(dateRange.classId, "\""));
  }

  if (dateRange.endOnNext) {
    attrs.push("END-ON-NEXT=YES");
  }

  Object.keys(dateRange.attributes).forEach(function (key) {
    if (key.startsWith('X-')) {
      if (typeof dateRange.attributes[key] === 'number') {
        attrs.push("".concat(key, "=").concat(dateRange.attributes[key]));
      } else {
        attrs.push("".concat(key, "=\"").concat(dateRange.attributes[key], "\""));
      }
    } else if (key.startsWith('SCTE35-')) {
      attrs.push("".concat(key, "=").concat(utils.byteSequenceToHex(dateRange.attributes[key])));
    }
  });
  lines.push("#EXT-X-DATERANGE:".concat(attrs.join(',')));
}

function buildMarkers(lines, markers) {
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = markers[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var marker = _step9.value;

      if (marker.type === 'OUT') {
        lines.push("#EXT-X-CUE-OUT:".concat(marker.duration));
      } else if (marker.type === 'IN') {
        lines.push('#EXT-X-CUE-IN');
      } else if (marker.type === 'RAW') {
        var value = marker.value ? ":".concat(marker.value) : '';
        lines.push("#".concat(marker.tagName).concat(value));
      }
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
        _iterator9["return"]();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }
}

function stringify(playlist) {
  utils.PARAMCHECK(playlist);
  utils.ASSERT('Not a playlist', playlist.type === 'playlist');
  var lines = new LineArray(playlist.uri);
  lines.push('#EXTM3U');

  if (playlist.version) {
    lines.push("#EXT-X-VERSION:".concat(playlist.version));
  }

  if (playlist.independentSegments) {
    lines.push('#EXT-X-INDEPENDENT-SEGMENTS');
  }

  if (playlist.start) {
    lines.push("#EXT-X-START:TIME-OFFSET=".concat(buildDecimalFloatingNumber(playlist.start.offset)).concat(playlist.start.precise ? ',PRECISE=YES' : ''));
  }

  if (playlist.isMasterPlaylist) {
    buildMasterPlaylist(lines, playlist);
  } else {
    buildMediaPlaylist(lines, playlist);
  } // console.log('<<<');
  // console.log(lines.join('\n'));
  // console.log('>>>');


  return lines.join('\n');
}

module.exports = stringify;

/***/ }),

/***/ "./types.js":
/*!******************!*\
  !*** ./types.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(/*! ./utils */ "./utils.js");

var Rendition = function Rendition(_ref) {
  var type = _ref.type,
      uri = _ref.uri,
      groupId = _ref.groupId,
      language = _ref.language,
      assocLanguage = _ref.assocLanguage,
      name = _ref.name,
      isDefault = _ref.isDefault,
      autoselect = _ref.autoselect,
      forced = _ref.forced,
      instreamId = _ref.instreamId,
      characteristics = _ref.characteristics,
      channels = _ref.channels;

  _classCallCheck(this, Rendition);

  utils.PARAMCHECK(type, groupId, name);
  utils.CONDITIONALASSERT([type === 'SUBTITLES', uri], [type === 'CLOSED-CAPTIONS', instreamId], [type === 'CLOSED-CAPTIONS', !uri], [forced, type === 'CLOSED-CAPTIONS']);
  this.type = type;
  this.uri = uri;
  this.groupId = groupId;
  this.language = language;
  this.assocLanguage = assocLanguage;
  this.name = name;
  this.isDefault = isDefault;
  this.autoselect = autoselect;
  this.forced = forced;
  this.instreamId = instreamId;
  this.characteristics = characteristics;
  this.channels = channels;
};

var Variant = function Variant(_ref2) {
  var uri = _ref2.uri,
      _ref2$isIFrameOnly = _ref2.isIFrameOnly,
      isIFrameOnly = _ref2$isIFrameOnly === void 0 ? false : _ref2$isIFrameOnly,
      bandwidth = _ref2.bandwidth,
      averageBandwidth = _ref2.averageBandwidth,
      codecs = _ref2.codecs,
      resolution = _ref2.resolution,
      frameRate = _ref2.frameRate,
      hdcpLevel = _ref2.hdcpLevel,
      _ref2$audio = _ref2.audio,
      audio = _ref2$audio === void 0 ? [] : _ref2$audio,
      _ref2$video = _ref2.video,
      video = _ref2$video === void 0 ? [] : _ref2$video,
      _ref2$subtitles = _ref2.subtitles,
      subtitles = _ref2$subtitles === void 0 ? [] : _ref2$subtitles,
      _ref2$closedCaptions = _ref2.closedCaptions,
      closedCaptions = _ref2$closedCaptions === void 0 ? [] : _ref2$closedCaptions,
      _ref2$currentRenditio = _ref2.currentRenditions,
      currentRenditions = _ref2$currentRenditio === void 0 ? {
    audio: 0,
    video: 0,
    subtitles: 0,
    closedCaptions: 0
  } : _ref2$currentRenditio;

  _classCallCheck(this, Variant);

  // utils.PARAMCHECK(uri, bandwidth, codecs);
  utils.PARAMCHECK(uri, bandwidth); // the spec states that CODECS is required but not true in the real world

  this.uri = uri;
  this.isIFrameOnly = isIFrameOnly;
  this.bandwidth = bandwidth;
  this.averageBandwidth = averageBandwidth;
  this.codecs = codecs;
  this.resolution = resolution;
  this.frameRate = frameRate;
  this.hdcpLevel = hdcpLevel;
  this.audio = audio;
  this.video = video;
  this.subtitles = subtitles;
  this.closedCaptions = closedCaptions;
  this.currentRenditions = currentRenditions;
};

var SessionData = function SessionData(_ref3) {
  var id = _ref3.id,
      value = _ref3.value,
      uri = _ref3.uri,
      language = _ref3.language;

  _classCallCheck(this, SessionData);

  utils.PARAMCHECK(id, value || uri);
  utils.ASSERT('SessionData cannot have both value and uri, shoud be either.', !(value && uri));
  this.id = id;
  this.value = value;
  this.uri = uri;
  this.language = language;
};

var Key = function Key(_ref4) {
  var method = _ref4.method,
      uri = _ref4.uri,
      iv = _ref4.iv,
      format = _ref4.format,
      formatVersion = _ref4.formatVersion;

  _classCallCheck(this, Key);

  utils.PARAMCHECK(method);
  utils.CONDITIONALPARAMCHECK([method !== 'NONE', uri]);
  utils.CONDITIONALASSERT([method === 'NONE', !(uri || iv || format || formatVersion)]);
  this.method = method;
  this.uri = uri;
  this.iv = iv;
  this.format = format;
  this.formatVersion = formatVersion;
};

var MediaInitializationSection = function MediaInitializationSection(_ref5) {
  var uri = _ref5.uri,
      mimeType = _ref5.mimeType,
      byterange = _ref5.byterange;

  _classCallCheck(this, MediaInitializationSection);

  utils.PARAMCHECK(uri);
  this.uri = uri;
  this.mimeType = mimeType;
  this.byterange = byterange;
};

var DateRange = function DateRange(_ref6) {
  var id = _ref6.id,
      classId = _ref6.classId,
      start = _ref6.start,
      end = _ref6.end,
      duration = _ref6.duration,
      plannedDuration = _ref6.plannedDuration,
      endOnNext = _ref6.endOnNext,
      _ref6$attributes = _ref6.attributes,
      attributes = _ref6$attributes === void 0 ? {} : _ref6$attributes;

  _classCallCheck(this, DateRange);

  utils.PARAMCHECK(id, start);
  utils.CONDITIONALPARAMCHECK([endOnNext === true, classId]);
  utils.CONDITIONALASSERT([end, start <= end], [duration, duration >= 0], [plannedDuration, plannedDuration >= 0]);
  this.id = id;
  this.classId = classId;
  this.start = start;
  this.end = end;
  this.duration = duration;
  this.plannedDuration = plannedDuration;
  this.endOnNext = endOnNext;
  this.attributes = attributes;
};

var SpliceInfo = function SpliceInfo(_ref7) {
  var type = _ref7.type,
      duration = _ref7.duration,
      tagName = _ref7.tagName,
      value = _ref7.value;

  _classCallCheck(this, SpliceInfo);

  utils.PARAMCHECK(type);
  utils.CONDITIONALPARAMCHECK([type === 'OUT', duration]);
  utils.CONDITIONALPARAMCHECK([type === 'RAW', tagName]);
  this.type = type;
  this.duration = duration;
  this.tagName = tagName;
  this.value = value;
};

var Data = function Data(type) {
  _classCallCheck(this, Data);

  utils.PARAMCHECK(type);
  this.type = type;
};

var Playlist =
/*#__PURE__*/
function (_Data) {
  _inherits(Playlist, _Data);

  function Playlist(_ref8) {
    var _this;

    var isMasterPlaylist = _ref8.isMasterPlaylist,
        uri = _ref8.uri,
        version = _ref8.version,
        _ref8$independentSegm = _ref8.independentSegments,
        independentSegments = _ref8$independentSegm === void 0 ? false : _ref8$independentSegm,
        start = _ref8.start,
        source = _ref8.source;

    _classCallCheck(this, Playlist);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Playlist).call(this, 'playlist'));
    utils.PARAMCHECK(isMasterPlaylist);
    _this.isMasterPlaylist = isMasterPlaylist;
    _this.uri = uri;
    _this.version = version;
    _this.independentSegments = independentSegments;
    _this.start = start;
    _this.source = source;
    return _this;
  }

  return Playlist;
}(Data);

var MasterPlaylist =
/*#__PURE__*/
function (_Playlist) {
  _inherits(MasterPlaylist, _Playlist);

  function MasterPlaylist() {
    var _this2;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MasterPlaylist);

    params.isMasterPlaylist = true;
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(MasterPlaylist).call(this, params));
    var _params$variants = params.variants,
        variants = _params$variants === void 0 ? [] : _params$variants,
        currentVariant = params.currentVariant,
        _params$sessionDataLi = params.sessionDataList,
        sessionDataList = _params$sessionDataLi === void 0 ? [] : _params$sessionDataLi,
        _params$sessionKeyLis = params.sessionKeyList,
        sessionKeyList = _params$sessionKeyLis === void 0 ? [] : _params$sessionKeyLis;
    _this2.variants = variants;
    _this2.currentVariant = currentVariant;
    _this2.sessionDataList = sessionDataList;
    _this2.sessionKeyList = sessionKeyList;
    return _this2;
  }

  return MasterPlaylist;
}(Playlist);

var MediaPlaylist =
/*#__PURE__*/
function (_Playlist2) {
  _inherits(MediaPlaylist, _Playlist2);

  function MediaPlaylist() {
    var _this3;

    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MediaPlaylist);

    params.isMasterPlaylist = false;
    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(MediaPlaylist).call(this, params));
    var targetDuration = params.targetDuration,
        _params$mediaSequence = params.mediaSequenceBase,
        mediaSequenceBase = _params$mediaSequence === void 0 ? 0 : _params$mediaSequence,
        _params$discontinuity = params.discontinuitySequenceBase,
        discontinuitySequenceBase = _params$discontinuity === void 0 ? 0 : _params$discontinuity,
        _params$endlist = params.endlist,
        endlist = _params$endlist === void 0 ? false : _params$endlist,
        playlistType = params.playlistType,
        isIFrame = params.isIFrame,
        _params$segments = params.segments,
        segments = _params$segments === void 0 ? [] : _params$segments,
        hash = params.hash;
    _this3.targetDuration = targetDuration;
    _this3.mediaSequenceBase = mediaSequenceBase;
    _this3.discontinuitySequenceBase = discontinuitySequenceBase;
    _this3.endlist = endlist;
    _this3.playlistType = playlistType;
    _this3.isIFrame = isIFrame;
    _this3.segments = segments;
    _this3.hash = hash;
    return _this3;
  }

  return MediaPlaylist;
}(Playlist);

var Segment =
/*#__PURE__*/
function (_Data2) {
  _inherits(Segment, _Data2);

  function Segment(_ref9) {
    var _this4;

    var uri = _ref9.uri,
        mimeType = _ref9.mimeType,
        data = _ref9.data,
        duration = _ref9.duration,
        title = _ref9.title,
        byterange = _ref9.byterange,
        discontinuity = _ref9.discontinuity,
        mediaSequenceNumber = _ref9.mediaSequenceNumber,
        discontinuitySequence = _ref9.discontinuitySequence,
        key = _ref9.key,
        map = _ref9.map,
        programDateTime = _ref9.programDateTime,
        dateRange = _ref9.dateRange,
        _ref9$markers = _ref9.markers,
        markers = _ref9$markers === void 0 ? [] : _ref9$markers;

    _classCallCheck(this, Segment);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Segment).call(this, 'segment'));
    utils.PARAMCHECK(uri, mediaSequenceNumber, discontinuitySequence);
    _this4.uri = uri;
    _this4.mimeType = mimeType;
    _this4.data = data;
    _this4.duration = duration;
    _this4.title = title;
    _this4.byterange = byterange;
    _this4.discontinuity = discontinuity;
    _this4.mediaSequenceNumber = mediaSequenceNumber;
    _this4.discontinuitySequence = discontinuitySequence;
    _this4.key = key;
    _this4.map = map;
    _this4.programDateTime = programDateTime;
    _this4.dateRange = dateRange;
    _this4.markers = markers;
    return _this4;
  }

  return Segment;
}(Data);

module.exports = {
  Rendition: Rendition,
  Variant: Variant,
  SessionData: SessionData,
  Key: Key,
  MediaInitializationSection: MediaInitializationSection,
  DateRange: DateRange,
  SpliceInfo: SpliceInfo,
  Playlist: Playlist,
  MasterPlaylist: MasterPlaylist,
  MediaPlaylist: MediaPlaylist,
  Segment: Segment
};

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var options = {};

function THROW(err) {
  if (!options.strictMode) {
    return console.error(err.message);
  }

  throw err;
}

function ASSERT(msg) {
  for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    options[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = options.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          param = _step$value[1];

      if (!param) {
        THROW(new Error("".concat(msg, " : Failed at [").concat(index, "]")));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function CONDITIONALASSERT() {
  for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    options[_key2] = arguments[_key2];
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = options.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          index = _step2$value[0],
          _step2$value$ = _slicedToArray(_step2$value[1], 2),
          cond = _step2$value$[0],
          param = _step2$value$[1];

      if (!cond) {
        continue;
      }

      if (!param) {
        THROW(new Error("Conditional Assert : Failed at [".concat(index, "]")));
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function PARAMCHECK() {
  for (var _len3 = arguments.length, options = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    options[_key3] = arguments[_key3];
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = options.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2),
          index = _step3$value[0],
          param = _step3$value[1];

      if (param === undefined) {
        THROW(new Error("Param Check : Failed at [".concat(index, "]")));
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function CONDITIONALPARAMCHECK() {
  for (var _len4 = arguments.length, options = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    options[_key4] = arguments[_key4];
  }

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = options.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2),
          index = _step4$value[0],
          _step4$value$ = _slicedToArray(_step4$value[1], 2),
          cond = _step4$value$[0],
          param = _step4$value$[1];

      if (!cond) {
        continue;
      }

      if (param === undefined) {
        THROW(new Error("Conditional Param Check : Failed at [".concat(index, "]")));
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}

function INVALIDPLAYLIST(msg) {
  THROW(new Error("Invalid Playlist : ".concat(msg)));
}

function toNumber(str) {
  var radix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (typeof str === 'number') {
    return str;
  }

  var num;

  if (radix === 10) {
    num = parseFloat(str, radix);
  } else {
    num = parseInt(str, radix);
  }

  if (isNaN(num)) {
    return 0;
  }

  return num;
}

function hexToByteSequence(str) {
  if (str.startsWith('0x') || str.startsWith('0X')) {
    str = str.slice(2);
  }

  var numArray = [];

  for (var i = 0; i < str.length; i += 2) {
    numArray.push(toNumber(str.slice(i, i + 2), 16));
  }

  return Buffer.from(numArray);
}

function byteSequenceToHex(sequence) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : sequence.length;

  if (end <= start) {
    THROW(new Error("end must be larger than start : start=".concat(start, ", end=").concat(end)));
  }

  var array = [];

  for (var i = start; i < end; i++) {
    array.push("0".concat((sequence[i] & 0xFF).toString(16).toUpperCase()).slice(-2));
  }

  return "0x".concat(array.join(''));
}

function tryCatch(body, errorHandler) {
  try {
    return body();
  } catch (err) {
    return errorHandler(err);
  }
}

function splitAt(str, delimiter) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lastDelimiterPos = -1;

  for (var i = 0, j = 0; i < str.length; i++) {
    if (str[i] === delimiter) {
      if (j++ === index) {
        return [str.slice(0, i), str.slice(i + 1)];
      }

      lastDelimiterPos = i;
    }
  }

  if (lastDelimiterPos !== -1) {
    return [str.slice(0, lastDelimiterPos), str.slice(lastDelimiterPos + 1)];
  }

  return [str];
}

function trim(str) {
  var _char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

  if (!str) {
    return str;
  }

  str = str.trim();

  if (_char === ' ') {
    return str;
  }

  if (str.startsWith(_char)) {
    str = str.slice(1);
  }

  if (str.endsWith(_char)) {
    str = str.slice(0, -1);
  }

  return str;
}

function splitByCommaWithPreservingQuotes(str) {
  var list = [];
  var doParse = true;
  var start = 0;
  var prevQuotes = [];

  for (var i = 0; i < str.length; i++) {
    var curr = str[i];

    if (doParse && curr === ',') {
      list.push(str.slice(start, i).trim());
      start = i + 1;
      continue;
    }

    if (curr === '"' || curr === '\'') {
      if (doParse) {
        prevQuotes.push(curr);
        doParse = false;
      } else if (curr === prevQuotes[prevQuotes.length - 1]) {
        prevQuotes.pop();
        doParse = true;
      } else {
        prevQuotes.push(curr);
      }
    }
  }

  list.push(str.slice(start).trim());
  return list;
}

function camelify(str) {
  var array = [];
  var nextUpper = false;
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = str[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var ch = _step5.value;

      if (ch === '-' || ch === '_') {
        nextUpper = true;
        continue;
      }

      if (nextUpper) {
        array.push(ch.toUpperCase());
        nextUpper = false;
        continue;
      }

      array.push(ch.toLowerCase());
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
        _iterator5["return"]();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  return array.join('');
}

function formatDate(date) {
  var YYYY = date.getUTCFullYear();
  var MM = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  var DD = ('0' + date.getUTCDate()).slice(-2);
  var hh = ('0' + date.getUTCHours()).slice(-2);
  var mm = ('0' + date.getUTCMinutes()).slice(-2);
  var ss = ('0' + date.getUTCSeconds()).slice(-2);
  var msc = ('00' + date.getUTCMilliseconds()).slice(-3);
  return "".concat(YYYY, "-").concat(MM, "-").concat(DD, "T").concat(hh, ":").concat(mm, ":").concat(ss, ".").concat(msc, "Z");
}

function hasOwnProp(obj, propName) {
  return Object.hasOwnProperty.call(obj, propName);
}

function setOptions() {
  var newOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  options = Object.assign(options, newOptions);
}

function getOptions() {
  return Object.assign({}, options);
}

module.exports = {
  THROW: THROW,
  ASSERT: ASSERT,
  CONDITIONALASSERT: CONDITIONALASSERT,
  PARAMCHECK: PARAMCHECK,
  CONDITIONALPARAMCHECK: CONDITIONALPARAMCHECK,
  INVALIDPLAYLIST: INVALIDPLAYLIST,
  toNumber: toNumber,
  hexToByteSequence: hexToByteSequence,
  byteSequenceToHex: byteSequenceToHex,
  tryCatch: tryCatch,
  splitAt: splitAt,
  trim: trim,
  splitByCommaWithPreservingQuotes: splitByCommaWithPreservingQuotes,
  camelify: camelify,
  formatDate: formatDate,
  hasOwnProp: hasOwnProp,
  setOptions: setOptions,
  getOptions: getOptions
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ })

/******/ });
});