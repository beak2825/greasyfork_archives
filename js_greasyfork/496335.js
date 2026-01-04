// ==UserScript==
// @name         HiddenThread
// @version      0.5.11
// @description  steganography for 2ch.hk
// @author       anon25519
// @include      *://2ch.*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/954286
// @downloadURL https://update.greasyfork.org/scripts/496335/HiddenThread.user.js
// @updateURL https://update.greasyfork.org/scripts/496335/HiddenThread.meta.js
// ==/UserScript==
let bomb = 0;
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

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
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
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

},{}],2:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

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
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
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
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
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
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
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
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
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
  if (!Array.isArray(list)) {
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
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
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
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

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
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
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

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
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
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
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
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
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
    if (typeof Uint8Array.prototype.indexOf === 'function') {
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

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
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
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
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
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
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

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

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
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

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
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
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
  value = +value
  offset = offset >>> 0
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
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
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
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
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
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
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
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
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

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":1,"buffer":2,"ieee754":3}],3:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
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

},{}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":4,"timers":5}],6:[function(require,module,exports){
/**
 * Minified by jsDelivr using UglifyJS v3.0.24.
 * Original file: /npm/mersennetwister@0.2.3/src/MersenneTwister.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
module.exports.EvalString = '!function(t,i){"use strict";"object"==typeof exports?module.exports=i():"function"==typeof define&&define.amd?define(i):t.MersenneTwister=i()}(this,function(){"use strict";var t=624,i=397,s=function(i){void 0===i&&(i=(new Date).getTime()),this.mt=new Array(t),this.mti=625,this.seed(i)};s.prototype.seed=function(i){var s;for(this.mt[0]=i>>>0,this.mti=1;this.mti<t;this.mti++)s=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&s)>>>16)<<16)+1812433253*(65535&s)+this.mti,this.mt[this.mti]>>>=0},s.prototype.seedArray=function(i){var s,h=1,n=0,e=t>i.length?t:i.length;for(this.seed(19650218);e>0;e--)s=this.mt[h-1]^this.mt[h-1]>>>30,this.mt[h]=(this.mt[h]^(1664525*((4294901760&s)>>>16)<<16)+1664525*(65535&s))+i[n]+n,this.mt[h]>>>=0,n++,++h>=t&&(this.mt[0]=this.mt[623],h=1),n>=i.length&&(n=0);for(e=623;e;e--)s=this.mt[h-1]^this.mt[h-1]>>>30,this.mt[h]=(this.mt[h]^(1566083941*((4294901760&s)>>>16)<<16)+1566083941*(65535&s))-h,this.mt[h]>>>=0,++h>=t&&(this.mt[0]=this.mt[623],h=1);this.mt[0]=2147483648},s.prototype.int=function(){var s,h,n=new Array(0,2567483615);if(this.mti>=t){for(625===this.mti&&this.seed(5489),h=0;h<227;h++)s=2147483648&this.mt[h]|2147483647&this.mt[h+1],this.mt[h]=this.mt[h+i]^s>>>1^n[1&s];for(;h<623;h++)s=2147483648&this.mt[h]|2147483647&this.mt[h+1],this.mt[h]=this.mt[h+(i-t)]^s>>>1^n[1&s];s=2147483648&this.mt[623]|2147483647&this.mt[0],this.mt[623]=this.mt[396]^s>>>1^n[1&s],this.mti=0}return s=this.mt[this.mti++],s^=s>>>11,s^=s<<7&2636928640,s^=s<<15&4022730752,(s^=s>>>18)>>>0},s.prototype.int31=function(){return this.int()>>>1},s.prototype.real=function(){return this.int()*(1/4294967295)},s.prototype.realx=function(){return(this.int()+.5)*(1/4294967296)},s.prototype.rnd=function(){return this.int()*(1/4294967296)},s.prototype.random=s.prototype.rnd,s.prototype.rndHiRes=function(){return(67108864*(this.int()>>>5)+(this.int()>>>6))*(1/9007199254740992)};var h=new s;return s.random=function(){return h.rnd()},s});';

},{}],7:[function(require,module,exports){
(function (global){(function (){
!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).elliptic=e()}(function(){return function r(f,d,n){function a(t,e){if(!d[t]){if(!f[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(s)return s(t,!0);throw(i=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",i}i=d[t]={exports:{}},f[t][0].call(i.exports,function(e){return a(f[t][1][e]||e)},i,i.exports,r,f,d,n)}return d[t].exports}for(var s="function"==typeof require&&require,e=0;e<n.length;e++)a(n[e]);return a}({1:[function(e,t,i){"use strict";i.version=e("../package.json").version,i.utils=e("./elliptic/utils"),i.rand=e("brorand"),i.curve=e("./elliptic/curve"),i.curves=e("./elliptic/curves"),i.ec=e("./elliptic/ec"),i.eddsa=e("./elliptic/eddsa")},{"../package.json":35,"./elliptic/curve":4,"./elliptic/curves":7,"./elliptic/ec":8,"./elliptic/eddsa":11,"./elliptic/utils":15,brorand:17}],2:[function(e,t,i){"use strict";var r=e("bn.js"),f=e("../utils"),x=f.getNAF,I=f.getJSF,o=f.assert;function d(e,t){this.type=e,this.p=new r(t.p,16),this.red=t.prime?r.red(t.prime):r.mont(this.p),this.zero=new r(0).toRed(this.red),this.one=new r(1).toRed(this.red),this.two=new r(2).toRed(this.red),this.n=t.n&&new r(t.n,16),this.g=t.g&&this.pointFromJSON(t.g,t.gRed),this._wnafT1=new Array(4),this._wnafT2=new Array(4),this._wnafT3=new Array(4),this._wnafT4=new Array(4),this._bitLength=this.n?this.n.bitLength():0;t=this.n&&this.p.div(this.n);!t||0<t.cmpn(100)?this.redN=null:(this._maxwellTrick=!0,this.redN=this.n.toRed(this.red))}function n(e,t){this.curve=e,this.type=t,this.precomputed=null}(t.exports=d).prototype.point=function(){throw new Error("Not implemented")},d.prototype.validate=function(){throw new Error("Not implemented")},d.prototype._fixedNafMul=function(e,t){o(e.precomputed);var i=e._getDoubles(),r=x(t,1,this._bitLength),t=(1<<i.step+1)-(i.step%2==0?2:1);t/=3;for(var f,d=[],n=0;n<r.length;n+=i.step){f=0;for(var a=n+i.step-1;n<=a;a--)f=(f<<1)+r[a];d.push(f)}for(var s=this.jpoint(null,null,null),c=this.jpoint(null,null,null),h=t;0<h;h--){for(n=0;n<d.length;n++)(f=d[n])===h?c=c.mixedAdd(i.points[n]):f===-h&&(c=c.mixedAdd(i.points[n].neg()));s=s.add(c)}return s.toP()},d.prototype._wnafMul=function(e,t){for(var i=e._getNAFPoints(4),r=i.wnd,f=i.points,d=x(t,r,this._bitLength),n=this.jpoint(null,null,null),a=d.length-1;0<=a;a--){for(var s=0;0<=a&&0===d[a];a--)s++;if(0<=a&&s++,n=n.dblp(s),a<0)break;var c=d[a];o(0!==c),n="affine"===e.type?0<c?n.mixedAdd(f[c-1>>1]):n.mixedAdd(f[-c-1>>1].neg()):0<c?n.add(f[c-1>>1]):n.add(f[-c-1>>1].neg())}return"affine"===e.type?n.toP():n},d.prototype._wnafMulAdd=function(e,t,i,r,f){for(var d,n=this._wnafT1,a=this._wnafT2,s=this._wnafT3,c=0,h=0;h<r;h++){var o=(d=t[h])._getNAFPoints(e);n[h]=o.wnd,a[h]=o.points}for(h=r-1;1<=h;h-=2){var u=h-1,b=h;if(1===n[u]&&1===n[b]){var l=[t[u],null,null,t[b]];0===t[u].y.cmp(t[b].y)?(l[1]=t[u].add(t[b]),l[2]=t[u].toJ().mixedAdd(t[b].neg())):0===t[u].y.cmp(t[b].y.redNeg())?(l[1]=t[u].toJ().mixedAdd(t[b]),l[2]=t[u].add(t[b].neg())):(l[1]=t[u].toJ().mixedAdd(t[b]),l[2]=t[u].toJ().mixedAdd(t[b].neg()));var p=[-3,-1,-5,-7,0,7,5,1,3],m=I(i[u],i[b]),c=Math.max(m[0].length,c);for(s[u]=new Array(c),s[b]=new Array(c),_=0;_<c;_++){var v=0|m[0][_],g=0|m[1][_];s[u][_]=p[3*(1+v)+(1+g)],s[b][_]=0,a[u]=l}}else s[u]=x(i[u],n[u],this._bitLength),s[b]=x(i[b],n[b],this._bitLength),c=Math.max(s[u].length,c),c=Math.max(s[b].length,c)}var y=this.jpoint(null,null,null),M=this._wnafT4;for(h=c;0<=h;h--){for(var w=0;0<=h;){for(var S=!0,_=0;_<r;_++)M[_]=0|s[_][h],0!==M[_]&&(S=!1);if(!S)break;w++,h--}if(0<=h&&w++,y=y.dblp(w),h<0)break;for(_=0;_<r;_++){var A=M[_];0!==A&&(0<A?d=a[_][A-1>>1]:A<0&&(d=a[_][-A-1>>1].neg()),y="affine"===d.type?y.mixedAdd(d):y.add(d))}}for(h=0;h<r;h++)a[h]=null;return f?y:y.toP()},(d.BasePoint=n).prototype.eq=function(){throw new Error("Not implemented")},n.prototype.validate=function(){return this.curve.validate(this)},d.prototype.decodePoint=function(e,t){e=f.toArray(e,t);t=this.p.byteLength();if((4===e[0]||6===e[0]||7===e[0])&&e.length-1==2*t)return 6===e[0]?o(e[e.length-1]%2==0):7===e[0]&&o(e[e.length-1]%2==1),this.point(e.slice(1,1+t),e.slice(1+t,1+2*t));if((2===e[0]||3===e[0])&&e.length-1===t)return this.pointFromX(e.slice(1,1+t),3===e[0]);throw new Error("Unknown point format")},n.prototype.encodeCompressed=function(e){return this.encode(e,!0)},n.prototype._encode=function(e){var t=this.curve.p.byteLength(),i=this.getX().toArray("be",t);return e?[this.getY().isEven()?2:3].concat(i):[4].concat(i,this.getY().toArray("be",t))},n.prototype.encode=function(e,t){return f.encode(this._encode(t),e)},n.prototype.precompute=function(e){if(this.precomputed)return this;var t={doubles:null,naf:null,beta:null};return t.naf=this._getNAFPoints(8),t.doubles=this._getDoubles(4,e),t.beta=this._getBeta(),this.precomputed=t,this},n.prototype._hasDoubles=function(e){if(!this.precomputed)return!1;var t=this.precomputed.doubles;return!!t&&t.points.length>=Math.ceil((e.bitLength()+1)/t.step)},n.prototype._getDoubles=function(e,t){if(this.precomputed&&this.precomputed.doubles)return this.precomputed.doubles;for(var i=[this],r=this,f=0;f<t;f+=e){for(var d=0;d<e;d++)r=r.dbl();i.push(r)}return{step:e,points:i}},n.prototype._getNAFPoints=function(e){if(this.precomputed&&this.precomputed.naf)return this.precomputed.naf;for(var t=[this],i=(1<<e)-1,r=1==i?null:this.dbl(),f=1;f<i;f++)t[f]=t[f-1].add(r);return{wnd:e,points:t}},n.prototype._getBeta=function(){return null},n.prototype.dblp=function(e){for(var t=this,i=0;i<e;i++)t=t.dbl();return t}},{"../utils":15,"bn.js":16}],3:[function(e,t,i){"use strict";var r=e("../utils"),d=e("bn.js"),f=e("inherits"),n=e("./base"),a=r.assert;function s(e){this.twisted=1!=(0|e.a),this.mOneA=this.twisted&&-1==(0|e.a),this.extended=this.mOneA,n.call(this,"edwards",e),this.a=new d(e.a,16).umod(this.red.m),this.a=this.a.toRed(this.red),this.c=new d(e.c,16).toRed(this.red),this.c2=this.c.redSqr(),this.d=new d(e.d,16).toRed(this.red),this.dd=this.d.redAdd(this.d),a(!this.twisted||0===this.c.fromRed().cmpn(1)),this.oneC=1==(0|e.c)}function c(e,t,i,r,f){n.BasePoint.call(this,e,"projective"),null===t&&null===i&&null===r?(this.x=this.curve.zero,this.y=this.curve.one,this.z=this.curve.one,this.t=this.curve.zero,this.zOne=!0):(this.x=new d(t,16),this.y=new d(i,16),this.z=r?new d(r,16):this.curve.one,this.t=f&&new d(f,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.t&&!this.t.red&&(this.t=this.t.toRed(this.curve.red)),this.zOne=this.z===this.curve.one,this.curve.extended&&!this.t&&(this.t=this.x.redMul(this.y),this.zOne||(this.t=this.t.redMul(this.z.redInvm()))))}f(s,n),(t.exports=s).prototype._mulA=function(e){return this.mOneA?e.redNeg():this.a.redMul(e)},s.prototype._mulC=function(e){return this.oneC?e:this.c.redMul(e)},s.prototype.jpoint=function(e,t,i,r){return this.point(e,t,i,r)},s.prototype.pointFromX=function(e,t){var i=(e=!(e=new d(e,16)).red?e.toRed(this.red):e).redSqr(),r=this.c2.redSub(this.a.redMul(i)),i=this.one.redSub(this.c2.redMul(this.d).redMul(i)),r=r.redMul(i.redInvm()),i=r.redSqrt();if(0!==i.redSqr().redSub(r).cmp(this.zero))throw new Error("invalid point");r=i.fromRed().isOdd();return(t&&!r||!t&&r)&&(i=i.redNeg()),this.point(e,i)},s.prototype.pointFromY=function(e,t){var i=(e=!(e=new d(e,16)).red?e.toRed(this.red):e).redSqr(),r=i.redSub(this.c2),i=i.redMul(this.d).redMul(this.c2).redSub(this.a),r=r.redMul(i.redInvm());if(0===r.cmp(this.zero)){if(t)throw new Error("invalid point");return this.point(this.zero,e)}i=r.redSqrt();if(0!==i.redSqr().redSub(r).cmp(this.zero))throw new Error("invalid point");return i.fromRed().isOdd()!==t&&(i=i.redNeg()),this.point(i,e)},s.prototype.validate=function(e){if(e.isInfinity())return!0;e.normalize();var t=e.x.redSqr(),i=e.y.redSqr(),e=t.redMul(this.a).redAdd(i),i=this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(i)));return 0===e.cmp(i)},f(c,n.BasePoint),s.prototype.pointFromJSON=function(e){return c.fromJSON(this,e)},s.prototype.point=function(e,t,i,r){return new c(this,e,t,i,r)},c.fromJSON=function(e,t){return new c(e,t[0],t[1],t[2])},c.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" y: "+this.y.fromRed().toString(16,2)+" z: "+this.z.fromRed().toString(16,2)+">"},c.prototype.isInfinity=function(){return 0===this.x.cmpn(0)&&(0===this.y.cmp(this.z)||this.zOne&&0===this.y.cmp(this.curve.c))},c.prototype._extDbl=function(){var e=this.x.redSqr(),t=this.y.redSqr(),i=(i=this.z.redSqr()).redIAdd(i),r=this.curve._mulA(e),f=this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),d=r.redAdd(t),e=d.redSub(i),i=r.redSub(t),r=f.redMul(e),t=d.redMul(i),i=f.redMul(i),d=e.redMul(d);return this.curve.point(r,t,d,i)},c.prototype._projDbl=function(){var e,t,i,r,f,d,n=this.x.redAdd(this.y).redSqr(),a=this.x.redSqr(),s=this.y.redSqr();return d=this.curve.twisted?(f=(i=this.curve._mulA(a)).redAdd(s),this.zOne?(e=n.redSub(a).redSub(s).redMul(f.redSub(this.curve.two)),t=f.redMul(i.redSub(s)),f.redSqr().redSub(f).redSub(f)):(r=this.z.redSqr(),d=f.redSub(r).redISub(r),e=n.redSub(a).redISub(s).redMul(d),t=f.redMul(i.redSub(s)),f.redMul(d))):(i=a.redAdd(s),r=this.curve._mulC(this.z).redSqr(),d=i.redSub(r).redSub(r),e=this.curve._mulC(n.redISub(i)).redMul(d),t=this.curve._mulC(i).redMul(a.redISub(s)),i.redMul(d)),this.curve.point(e,t,d)},c.prototype.dbl=function(){return this.isInfinity()?this:this.curve.extended?this._extDbl():this._projDbl()},c.prototype._extAdd=function(e){var t=this.y.redSub(this.x).redMul(e.y.redSub(e.x)),i=this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),r=this.t.redMul(this.curve.dd).redMul(e.t),f=this.z.redMul(e.z.redAdd(e.z)),d=i.redSub(t),e=f.redSub(r),f=f.redAdd(r),r=i.redAdd(t),i=d.redMul(e),t=f.redMul(r),r=d.redMul(r),f=e.redMul(f);return this.curve.point(i,t,f,r)},c.prototype._projAdd=function(e){var t,i=this.z.redMul(e.z),r=i.redSqr(),f=this.x.redMul(e.x),d=this.y.redMul(e.y),n=this.curve.d.redMul(f).redMul(d),a=r.redSub(n),n=r.redAdd(n),e=this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(f).redISub(d),e=i.redMul(a).redMul(e),n=this.curve.twisted?(t=i.redMul(n).redMul(d.redSub(this.curve._mulA(f))),a.redMul(n)):(t=i.redMul(n).redMul(d.redSub(f)),this.curve._mulC(a).redMul(n));return this.curve.point(e,t,n)},c.prototype.add=function(e){return this.isInfinity()?e:e.isInfinity()?this:this.curve.extended?this._extAdd(e):this._projAdd(e)},c.prototype.mul=function(e){return this._hasDoubles(e)?this.curve._fixedNafMul(this,e):this.curve._wnafMul(this,e)},c.prototype.mulAdd=function(e,t,i){return this.curve._wnafMulAdd(1,[this,t],[e,i],2,!1)},c.prototype.jmulAdd=function(e,t,i){return this.curve._wnafMulAdd(1,[this,t],[e,i],2,!0)},c.prototype.normalize=function(){if(this.zOne)return this;var e=this.z.redInvm();return this.x=this.x.redMul(e),this.y=this.y.redMul(e),this.t&&(this.t=this.t.redMul(e)),this.z=this.curve.one,this.zOne=!0,this},c.prototype.neg=function(){return this.curve.point(this.x.redNeg(),this.y,this.z,this.t&&this.t.redNeg())},c.prototype.getX=function(){return this.normalize(),this.x.fromRed()},c.prototype.getY=function(){return this.normalize(),this.y.fromRed()},c.prototype.eq=function(e){return this===e||0===this.getX().cmp(e.getX())&&0===this.getY().cmp(e.getY())},c.prototype.eqXToP=function(e){var t=e.toRed(this.curve.red).redMul(this.z);if(0===this.x.cmp(t))return!0;for(var i=e.clone(),r=this.curve.redN.redMul(this.z);;){if(i.iadd(this.curve.n),0<=i.cmp(this.curve.p))return!1;if(t.redIAdd(r),0===this.x.cmp(t))return!0}},c.prototype.toP=c.prototype.normalize,c.prototype.mixedAdd=c.prototype.add},{"../utils":15,"./base":2,"bn.js":16,inherits:32}],4:[function(e,t,i){"use strict";i.base=e("./base"),i.short=e("./short"),i.mont=e("./mont"),i.edwards=e("./edwards")},{"./base":2,"./edwards":3,"./mont":5,"./short":6}],5:[function(e,t,i){"use strict";var r=e("bn.js"),f=e("inherits"),d=e("./base"),n=e("../utils");function a(e){d.call(this,"mont",e),this.a=new r(e.a,16).toRed(this.red),this.b=new r(e.b,16).toRed(this.red),this.i4=new r(4).toRed(this.red).redInvm(),this.two=new r(2).toRed(this.red),this.a24=this.i4.redMul(this.a.redAdd(this.two))}function s(e,t,i){d.BasePoint.call(this,e,"projective"),null===t&&null===i?(this.x=this.curve.one,this.z=this.curve.zero):(this.x=new r(t,16),this.z=new r(i,16),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)))}f(a,d),(t.exports=a).prototype.validate=function(e){var t=e.normalize().x,e=t.redSqr(),t=e.redMul(t).redAdd(e.redMul(this.a)).redAdd(t);return 0===t.redSqrt().redSqr().cmp(t)},f(s,d.BasePoint),a.prototype.decodePoint=function(e,t){return this.point(n.toArray(e,t),1)},a.prototype.point=function(e,t){return new s(this,e,t)},a.prototype.pointFromJSON=function(e){return s.fromJSON(this,e)},s.prototype.precompute=function(){},s.prototype._encode=function(){return this.getX().toArray("be",this.curve.p.byteLength())},s.fromJSON=function(e,t){return new s(e,t[0],t[1]||e.one)},s.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" z: "+this.z.fromRed().toString(16,2)+">"},s.prototype.isInfinity=function(){return 0===this.z.cmpn(0)},s.prototype.dbl=function(){var e=this.x.redAdd(this.z).redSqr(),t=this.x.redSub(this.z).redSqr(),i=e.redSub(t),e=e.redMul(t),i=i.redMul(t.redAdd(this.curve.a24.redMul(i)));return this.curve.point(e,i)},s.prototype.add=function(){throw new Error("Not supported on Montgomery curve")},s.prototype.diffAdd=function(e,t){var i=this.x.redAdd(this.z),r=this.x.redSub(this.z),f=e.x.redAdd(e.z),i=e.x.redSub(e.z).redMul(i),f=f.redMul(r),r=t.z.redMul(i.redAdd(f).redSqr()),f=t.x.redMul(i.redISub(f).redSqr());return this.curve.point(r,f)},s.prototype.mul=function(e){for(var t=e.clone(),i=this,r=this.curve.point(null,null),f=[];0!==t.cmpn(0);t.iushrn(1))f.push(t.andln(1));for(var d=f.length-1;0<=d;d--)0===f[d]?(i=i.diffAdd(r,this),r=r.dbl()):(r=i.diffAdd(r,this),i=i.dbl());return r},s.prototype.mulAdd=function(){throw new Error("Not supported on Montgomery curve")},s.prototype.jumlAdd=function(){throw new Error("Not supported on Montgomery curve")},s.prototype.eq=function(e){return 0===this.getX().cmp(e.getX())},s.prototype.normalize=function(){return this.x=this.x.redMul(this.z.redInvm()),this.z=this.curve.one,this},s.prototype.getX=function(){return this.normalize(),this.x.fromRed()}},{"../utils":15,"./base":2,"bn.js":16,inherits:32}],6:[function(e,t,i){"use strict";var r=e("../utils"),y=e("bn.js"),f=e("inherits"),d=e("./base"),n=r.assert;function a(e){d.call(this,"short",e),this.a=new y(e.a,16).toRed(this.red),this.b=new y(e.b,16).toRed(this.red),this.tinv=this.two.redInvm(),this.zeroA=0===this.a.fromRed().cmpn(0),this.threeA=0===this.a.fromRed().sub(this.p).cmpn(-3),this.endo=this._getEndomorphism(e),this._endoWnafT1=new Array(4),this._endoWnafT2=new Array(4)}function s(e,t,i,r){d.BasePoint.call(this,e,"affine"),null===t&&null===i?(this.x=null,this.y=null,this.inf=!0):(this.x=new y(t,16),this.y=new y(i,16),r&&(this.x.forceRed(this.curve.red),this.y.forceRed(this.curve.red)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.inf=!1)}function c(e,t,i,r){d.BasePoint.call(this,e,"jacobian"),null===t&&null===i&&null===r?(this.x=this.curve.one,this.y=this.curve.one,this.z=new y(0)):(this.x=new y(t,16),this.y=new y(i,16),this.z=new y(r,16)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.zOne=this.z===this.curve.one}f(a,d),(t.exports=a).prototype._getEndomorphism=function(e){var t,i,r;if(this.zeroA&&this.g&&this.n&&1===this.p.modn(3))return i=(e.beta?new y(e.beta,16):i=(r=this._getEndoRoots(this.p))[0].cmp(r[1])<0?r[0]:r[1]).toRed(this.red),e.lambda?t=new y(e.lambda,16):(r=this._getEndoRoots(this.n),0===this.g.mul(r[0]).x.cmp(this.g.x.redMul(i))?t=r[0]:(t=r[1],n(0===this.g.mul(t).x.cmp(this.g.x.redMul(i))))),{beta:i,lambda:t,basis:e.basis?e.basis.map(function(e){return{a:new y(e.a,16),b:new y(e.b,16)}}):this._getEndoBasis(t)}},a.prototype._getEndoRoots=function(e){var t=e===this.p?this.red:y.mont(e),i=new y(2).toRed(t).redInvm(),e=i.redNeg(),i=new y(3).toRed(t).redNeg().redSqrt().redMul(i);return[e.redAdd(i).fromRed(),e.redSub(i).fromRed()]},a.prototype._getEndoBasis=function(e){for(var t,i,r,f,d,n,a,s=this.n.ushrn(Math.floor(this.n.bitLength()/2)),c=e,h=this.n.clone(),o=new y(1),u=new y(0),b=new y(0),l=new y(1),p=0;0!==c.cmpn(0);){var m=h.div(c),v=h.sub(m.mul(c)),g=b.sub(m.mul(o)),m=l.sub(m.mul(u));if(!r&&v.cmp(s)<0)t=a.neg(),i=o,r=v.neg(),f=g;else if(r&&2==++p)break;h=c,c=a=v,b=o,o=g,l=u,u=m}d=v.neg(),n=g;e=r.sqr().add(f.sqr());return 0<=d.sqr().add(n.sqr()).cmp(e)&&(d=t,n=i),r.negative&&(r=r.neg(),f=f.neg()),d.negative&&(d=d.neg(),n=n.neg()),[{a:r,b:f},{a:d,b:n}]},a.prototype._endoSplit=function(e){var t=this.endo.basis,i=t[0],r=t[1],f=r.b.mul(e).divRound(this.n),d=i.b.neg().mul(e).divRound(this.n),n=f.mul(i.a),t=d.mul(r.a),i=f.mul(i.b),r=d.mul(r.b);return{k1:e.sub(n).sub(t),k2:i.add(r).neg()}},a.prototype.pointFromX=function(e,t){var i=(e=!(e=new y(e,16)).red?e.toRed(this.red):e).redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),r=i.redSqrt();if(0!==r.redSqr().redSub(i).cmp(this.zero))throw new Error("invalid point");i=r.fromRed().isOdd();return(t&&!i||!t&&i)&&(r=r.redNeg()),this.point(e,r)},a.prototype.validate=function(e){if(e.inf)return!0;var t=e.x,i=e.y,e=this.a.redMul(t),e=t.redSqr().redMul(t).redIAdd(e).redIAdd(this.b);return 0===i.redSqr().redISub(e).cmpn(0)},a.prototype._endoWnafMulAdd=function(e,t,i){for(var r=this._endoWnafT1,f=this._endoWnafT2,d=0;d<e.length;d++){var n=this._endoSplit(t[d]),a=e[d],s=a._getBeta();n.k1.negative&&(n.k1.ineg(),a=a.neg(!0)),n.k2.negative&&(n.k2.ineg(),s=s.neg(!0)),r[2*d]=a,r[2*d+1]=s,f[2*d]=n.k1,f[2*d+1]=n.k2}for(var i=this._wnafMulAdd(1,r,f,2*d,i),c=0;c<2*d;c++)r[c]=null,f[c]=null;return i},f(s,d.BasePoint),a.prototype.point=function(e,t,i){return new s(this,e,t,i)},a.prototype.pointFromJSON=function(e,t){return s.fromJSON(this,e,t)},s.prototype._getBeta=function(){if(this.curve.endo){var e=this.precomputed;if(e&&e.beta)return e.beta;var t,i,r=this.curve.point(this.x.redMul(this.curve.endo.beta),this.y);return e&&(t=this.curve,i=function(e){return t.point(e.x.redMul(t.endo.beta),e.y)},(e.beta=r).precomputed={beta:null,naf:e.naf&&{wnd:e.naf.wnd,points:e.naf.points.map(i)},doubles:e.doubles&&{step:e.doubles.step,points:e.doubles.points.map(i)}}),r}},s.prototype.toJSON=function(){return this.precomputed?[this.x,this.y,this.precomputed&&{doubles:this.precomputed.doubles&&{step:this.precomputed.doubles.step,points:this.precomputed.doubles.points.slice(1)},naf:this.precomputed.naf&&{wnd:this.precomputed.naf.wnd,points:this.precomputed.naf.points.slice(1)}}]:[this.x,this.y]},s.fromJSON=function(t,e,i){"string"==typeof e&&(e=JSON.parse(e));var r=t.point(e[0],e[1],i);if(!e[2])return r;function f(e){return t.point(e[0],e[1],i)}e=e[2];return r.precomputed={beta:null,doubles:e.doubles&&{step:e.doubles.step,points:[r].concat(e.doubles.points.map(f))},naf:e.naf&&{wnd:e.naf.wnd,points:[r].concat(e.naf.points.map(f))}},r},s.prototype.inspect=function(){return this.isInfinity()?"<EC Point Infinity>":"<EC Point x: "+this.x.fromRed().toString(16,2)+" y: "+this.y.fromRed().toString(16,2)+">"},s.prototype.isInfinity=function(){return this.inf},s.prototype.add=function(e){if(this.inf)return e;if(e.inf)return this;if(this.eq(e))return this.dbl();if(this.neg().eq(e))return this.curve.point(null,null);if(0===this.x.cmp(e.x))return this.curve.point(null,null);var t=this.y.redSub(e.y),e=(t=0!==t.cmpn(0)?t.redMul(this.x.redSub(e.x).redInvm()):t).redSqr().redISub(this.x).redISub(e.x),t=t.redMul(this.x.redSub(e)).redISub(this.y);return this.curve.point(e,t)},s.prototype.dbl=function(){if(this.inf)return this;var e=this.y.redAdd(this.y);if(0===e.cmpn(0))return this.curve.point(null,null);var t=this.curve.a,i=this.x.redSqr(),e=e.redInvm(),t=i.redAdd(i).redIAdd(i).redIAdd(t).redMul(e),e=t.redSqr().redISub(this.x.redAdd(this.x)),t=t.redMul(this.x.redSub(e)).redISub(this.y);return this.curve.point(e,t)},s.prototype.getX=function(){return this.x.fromRed()},s.prototype.getY=function(){return this.y.fromRed()},s.prototype.mul=function(e){return e=new y(e,16),this.isInfinity()?this:this._hasDoubles(e)?this.curve._fixedNafMul(this,e):this.curve.endo?this.curve._endoWnafMulAdd([this],[e]):this.curve._wnafMul(this,e)},s.prototype.mulAdd=function(e,t,i){t=[this,t],i=[e,i];return this.curve.endo?this.curve._endoWnafMulAdd(t,i):this.curve._wnafMulAdd(1,t,i,2)},s.prototype.jmulAdd=function(e,t,i){t=[this,t],i=[e,i];return this.curve.endo?this.curve._endoWnafMulAdd(t,i,!0):this.curve._wnafMulAdd(1,t,i,2,!0)},s.prototype.eq=function(e){return this===e||this.inf===e.inf&&(this.inf||0===this.x.cmp(e.x)&&0===this.y.cmp(e.y))},s.prototype.neg=function(e){if(this.inf)return this;var t,i=this.curve.point(this.x,this.y.redNeg());return e&&this.precomputed&&(t=this.precomputed,e=function(e){return e.neg()},i.precomputed={naf:t.naf&&{wnd:t.naf.wnd,points:t.naf.points.map(e)},doubles:t.doubles&&{step:t.doubles.step,points:t.doubles.points.map(e)}}),i},s.prototype.toJ=function(){return this.inf?this.curve.jpoint(null,null,null):this.curve.jpoint(this.x,this.y,this.curve.one)},f(c,d.BasePoint),a.prototype.jpoint=function(e,t,i){return new c(this,e,t,i)},c.prototype.toP=function(){if(this.isInfinity())return this.curve.point(null,null);var e=this.z.redInvm(),t=e.redSqr(),i=this.x.redMul(t),e=this.y.redMul(t).redMul(e);return this.curve.point(i,e)},c.prototype.neg=function(){return this.curve.jpoint(this.x,this.y.redNeg(),this.z)},c.prototype.add=function(e){if(this.isInfinity())return e;if(e.isInfinity())return this;var t=e.z.redSqr(),i=this.z.redSqr(),r=this.x.redMul(t),f=e.x.redMul(i),d=this.y.redMul(t.redMul(e.z)),n=e.y.redMul(i.redMul(this.z)),t=r.redSub(f),i=d.redSub(n);if(0===t.cmpn(0))return 0!==i.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();f=t.redSqr(),n=f.redMul(t),r=r.redMul(f),f=i.redSqr().redIAdd(n).redISub(r).redISub(r),n=i.redMul(r.redISub(f)).redISub(d.redMul(n)),t=this.z.redMul(e.z).redMul(t);return this.curve.jpoint(f,n,t)},c.prototype.mixedAdd=function(e){if(this.isInfinity())return e.toJ();if(e.isInfinity())return this;var t=this.z.redSqr(),i=this.x,r=e.x.redMul(t),f=this.y,d=e.y.redMul(t).redMul(this.z),e=i.redSub(r),t=f.redSub(d);if(0===e.cmpn(0))return 0!==t.cmpn(0)?this.curve.jpoint(null,null,null):this.dbl();r=e.redSqr(),d=r.redMul(e),i=i.redMul(r),r=t.redSqr().redIAdd(d).redISub(i).redISub(i),d=t.redMul(i.redISub(r)).redISub(f.redMul(d)),e=this.z.redMul(e);return this.curve.jpoint(r,d,e)},c.prototype.dblp=function(e){if(0===e)return this;if(this.isInfinity())return this;if(!e)return this.dbl();if(this.curve.zeroA||this.curve.threeA){for(var t=this,i=0;i<e;i++)t=t.dbl();return t}var r=this.curve.a,f=this.curve.tinv,d=this.x,n=this.y,a=this.z,s=a.redSqr().redSqr(),c=n.redAdd(n);for(i=0;i<e;i++){var h=d.redSqr(),o=c.redSqr(),u=o.redSqr(),b=h.redAdd(h).redIAdd(h).redIAdd(r.redMul(s)),h=d.redMul(o),o=b.redSqr().redISub(h.redAdd(h)),h=h.redISub(o),b=(b=b.redMul(h)).redIAdd(b).redISub(u),h=c.redMul(a);i+1<e&&(s=s.redMul(u)),d=o,a=h,c=b}return this.curve.jpoint(d,c.redMul(f),a)},c.prototype.dbl=function(){return this.isInfinity()?this:this.curve.zeroA?this._zeroDbl():this.curve.threeA?this._threeDbl():this._dbl()},c.prototype._zeroDbl=function(){var e,t,i,r,f,d=this.zOne?(i=this.x.redSqr(),e=(r=this.y.redSqr()).redSqr(),f=(f=this.x.redAdd(r).redSqr().redISub(i).redISub(e)).redIAdd(f),r=(t=i.redAdd(i).redIAdd(i)).redSqr().redISub(f).redISub(f),i=(i=(i=e.redIAdd(e)).redIAdd(i)).redIAdd(i),e=r,t=t.redMul(f.redISub(r)).redISub(i),this.y.redAdd(this.y)):(f=this.x.redSqr(),d=(r=this.y.redSqr()).redSqr(),i=(i=this.x.redAdd(r).redSqr().redISub(f).redISub(d)).redIAdd(i),f=(r=f.redAdd(f).redIAdd(f)).redSqr(),d=(d=(d=d.redIAdd(d)).redIAdd(d)).redIAdd(d),e=f.redISub(i).redISub(i),t=r.redMul(i.redISub(e)).redISub(d),(d=this.y.redMul(this.z)).redIAdd(d));return this.curve.jpoint(e,t,d)},c.prototype._threeDbl=function(){var e,t,i,r,f,d,n,a;return this.zOne?(e=this.x.redSqr(),r=(t=this.y.redSqr()).redSqr(),n=(n=this.x.redAdd(t).redSqr().redISub(e).redISub(r)).redIAdd(n),i=f=(a=e.redAdd(e).redIAdd(e).redIAdd(this.curve.a)).redSqr().redISub(n).redISub(n),d=(d=(d=r.redIAdd(r)).redIAdd(d)).redIAdd(d),t=a.redMul(n.redISub(f)).redISub(d),e=this.y.redAdd(this.y)):(r=this.z.redSqr(),a=this.y.redSqr(),n=this.x.redMul(a),f=(f=this.x.redSub(r).redMul(this.x.redAdd(r))).redAdd(f).redIAdd(f),n=(d=(d=n.redIAdd(n)).redIAdd(d)).redAdd(d),i=f.redSqr().redISub(n),e=this.y.redAdd(this.z).redSqr().redISub(a).redISub(r),a=(a=(a=(a=a.redSqr()).redIAdd(a)).redIAdd(a)).redIAdd(a),t=f.redMul(d.redISub(i)).redISub(a)),this.curve.jpoint(i,t,e)},c.prototype._dbl=function(){var e=this.curve.a,t=this.x,i=this.y,r=this.z,f=r.redSqr().redSqr(),d=t.redSqr(),n=i.redSqr(),e=d.redAdd(d).redIAdd(d).redIAdd(e.redMul(f)),f=t.redAdd(t),t=(f=f.redIAdd(f)).redMul(n),f=e.redSqr().redISub(t.redAdd(t)),t=t.redISub(f),n=n.redSqr();n=(n=(n=n.redIAdd(n)).redIAdd(n)).redIAdd(n);n=e.redMul(t).redISub(n),r=i.redAdd(i).redMul(r);return this.curve.jpoint(f,n,r)},c.prototype.trpl=function(){if(!this.curve.zeroA)return this.dbl().add(this);var e=this.x.redSqr(),t=this.y.redSqr(),i=this.z.redSqr(),r=t.redSqr(),f=e.redAdd(e).redIAdd(e),d=f.redSqr(),n=this.x.redAdd(t).redSqr().redISub(e).redISub(r),e=(n=(n=(n=n.redIAdd(n)).redAdd(n).redIAdd(n)).redISub(d)).redSqr(),r=r.redIAdd(r);r=(r=(r=r.redIAdd(r)).redIAdd(r)).redIAdd(r);d=f.redIAdd(n).redSqr().redISub(d).redISub(e).redISub(r),t=t.redMul(d);t=(t=t.redIAdd(t)).redIAdd(t);t=this.x.redMul(e).redISub(t);t=(t=t.redIAdd(t)).redIAdd(t);d=this.y.redMul(d.redMul(r.redISub(d)).redISub(n.redMul(e)));d=(d=(d=d.redIAdd(d)).redIAdd(d)).redIAdd(d);e=this.z.redAdd(n).redSqr().redISub(i).redISub(e);return this.curve.jpoint(t,d,e)},c.prototype.mul=function(e,t){return e=new y(e,t),this.curve._wnafMul(this,e)},c.prototype.eq=function(e){if("affine"===e.type)return this.eq(e.toJ());if(this===e)return!0;var t=this.z.redSqr(),i=e.z.redSqr();if(0!==this.x.redMul(i).redISub(e.x.redMul(t)).cmpn(0))return!1;t=t.redMul(this.z),i=i.redMul(e.z);return 0===this.y.redMul(i).redISub(e.y.redMul(t)).cmpn(0)},c.prototype.eqXToP=function(e){var t=this.z.redSqr(),i=e.toRed(this.curve.red).redMul(t);if(0===this.x.cmp(i))return!0;for(var r=e.clone(),f=this.curve.redN.redMul(t);;){if(r.iadd(this.curve.n),0<=r.cmp(this.curve.p))return!1;if(i.redIAdd(f),0===this.x.cmp(i))return!0}},c.prototype.inspect=function(){return this.isInfinity()?"<EC JPoint Infinity>":"<EC JPoint x: "+this.x.toString(16,2)+" y: "+this.y.toString(16,2)+" z: "+this.z.toString(16,2)+">"},c.prototype.isInfinity=function(){return 0===this.z.cmpn(0)}},{"../utils":15,"./base":2,"bn.js":16,inherits:32}],7:[function(e,t,i){"use strict";var r,f=i,i=e("hash.js"),d=e("./curve"),n=e("./utils").assert;function a(e){"short"===e.type?this.curve=new d.short(e):"edwards"===e.type?this.curve=new d.edwards(e):this.curve=new d.mont(e),this.g=this.curve.g,this.n=this.curve.n,this.hash=e.hash,n(this.g.validate(),"Invalid curve"),n(this.g.mul(this.n).isInfinity(),"Invalid curve, G*N != O")}function s(t,i){Object.defineProperty(f,t,{configurable:!0,enumerable:!0,get:function(){var e=new a(i);return Object.defineProperty(f,t,{configurable:!0,enumerable:!0,value:e}),e}})}f.PresetCurve=a,s("p192",{type:"short",prime:"p192",p:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",a:"ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",b:"64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",n:"ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",hash:i.sha256,gRed:!1,g:["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012","07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]}),s("p224",{type:"short",prime:"p224",p:"ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",a:"ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",b:"b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",n:"ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",hash:i.sha256,gRed:!1,g:["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21","bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]}),s("p256",{type:"short",prime:null,p:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",a:"ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",b:"5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",n:"ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",hash:i.sha256,gRed:!1,g:["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296","4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]}),s("p384",{type:"short",prime:null,p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",a:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",b:"b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",n:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",hash:i.sha384,gRed:!1,g:["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7","3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]}),s("p521",{type:"short",prime:null,p:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",a:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",b:"00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",n:"000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",hash:i.sha512,gRed:!1,g:["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66","00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]}),s("curve25519",{type:"mont",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"76d06",b:"1",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:i.sha256,gRed:!1,g:["9"]}),s("ed25519",{type:"edwards",prime:"p25519",p:"7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",a:"-1",c:"1",d:"52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",n:"1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",hash:i.sha256,gRed:!1,g:["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a","6666666666666666666666666666666666666666666666666666666666666658"]});try{r=e("./precomputed/secp256k1")}catch(e){r=void 0}s("secp256k1",{type:"short",prime:"k256",p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",a:"0",b:"7",n:"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",h:"1",hash:i.sha256,beta:"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",lambda:"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",basis:[{a:"3086d221a7d46bcde86c90e49284eb15",b:"-e4437ed6010e88286f547fa90abfe4c3"},{a:"114ca50f7a8e2f3f657c1108d9d44cfd8",b:"3086d221a7d46bcde86c90e49284eb15"}],gRed:!1,g:["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",r]})},{"./curve":4,"./precomputed/secp256k1":14,"./utils":15,"hash.js":19}],8:[function(e,t,i){"use strict";var u=e("bn.js"),b=e("hmac-drbg"),r=e("../utils"),f=e("../curves"),d=e("brorand"),a=r.assert,n=e("./key"),l=e("./signature");function s(e){if(!(this instanceof s))return new s(e);"string"==typeof e&&(a(Object.prototype.hasOwnProperty.call(f,e),"Unknown curve "+e),e=f[e]),e instanceof f.PresetCurve&&(e={curve:e}),this.curve=e.curve.curve,this.n=this.curve.n,this.nh=this.n.ushrn(1),this.g=this.curve.g,this.g=e.curve.g,this.g.precompute(e.curve.n.bitLength()+1),this.hash=e.hash||e.curve.hash}(t.exports=s).prototype.keyPair=function(e){return new n(this,e)},s.prototype.keyFromPrivate=function(e,t){return n.fromPrivate(this,e,t)},s.prototype.keyFromPublic=function(e,t){return n.fromPublic(this,e,t)},s.prototype.genKeyPair=function(e){e=e||{};for(var t=new b({hash:this.hash,pers:e.pers,persEnc:e.persEnc||"utf8",entropy:e.entropy||d(this.hash.hmacStrength),entropyEnc:e.entropy&&e.entropyEnc||"utf8",nonce:this.n.toArray()}),i=this.n.byteLength(),r=this.n.sub(new u(2));;){var f=new u(t.generate(i));if(!(0<f.cmp(r)))return f.iaddn(1),this.keyFromPrivate(f)}},s.prototype._truncateToN=function(e,t){var i=8*e.byteLength()-this.n.bitLength();return 0<i&&(e=e.ushrn(i)),!t&&0<=e.cmp(this.n)?e.sub(this.n):e},s.prototype.sign=function(e,t,i,r){"object"==typeof i&&(r=i,i=null),r=r||{},t=this.keyFromPrivate(t,i),e=this._truncateToN(new u(e,16));for(var f=this.n.byteLength(),i=t.getPrivate().toArray("be",f),f=e.toArray("be",f),d=new b({hash:this.hash,entropy:i,nonce:f,pers:r.pers,persEnc:r.persEnc||"utf8"}),n=this.n.sub(new u(1)),a=0;;a++){var s=r.k?r.k(a):new u(d.generate(this.n.byteLength()));if(!((s=this._truncateToN(s,!0)).cmpn(1)<=0||0<=s.cmp(n))){var c=this.g.mul(s);if(!c.isInfinity()){var h=c.getX(),o=h.umod(this.n);if(0!==o.cmpn(0)){s=s.invm(this.n).mul(o.mul(t.getPrivate()).iadd(e));if(0!==(s=s.umod(this.n)).cmpn(0)){h=(c.getY().isOdd()?1:0)|(0!==h.cmp(o)?2:0);return r.canonical&&0<s.cmp(this.nh)&&(s=this.n.sub(s),h^=1),new l({r:o,s:s,recoveryParam:h})}}}}}},s.prototype.verify=function(e,t,i,r){e=this._truncateToN(new u(e,16)),i=this.keyFromPublic(i,r);r=(t=new l(t,"hex")).r,t=t.s;if(r.cmpn(1)<0||0<=r.cmp(this.n))return!1;if(t.cmpn(1)<0||0<=t.cmp(this.n))return!1;var f,t=t.invm(this.n),e=t.mul(e).umod(this.n),t=t.mul(r).umod(this.n);return this.curve._maxwellTrick?!(f=this.g.jmulAdd(e,i.getPublic(),t)).isInfinity()&&f.eqXToP(r):!(f=this.g.mulAdd(e,i.getPublic(),t)).isInfinity()&&0===f.getX().umod(this.n).cmp(r)},s.prototype.recoverPubKey=function(e,t,i,r){a((3&i)===i,"The recovery param is more than two bits"),t=new l(t,r);var f=this.n,d=new u(e),n=t.r,r=t.s,e=1&i,i=i>>1;if(0<=n.cmp(this.curve.p.umod(this.curve.n))&&i)throw new Error("Unable to find sencond key candinate");n=i?this.curve.pointFromX(n.add(this.curve.n),e):this.curve.pointFromX(n,e);t=t.r.invm(f),d=f.sub(d).mul(t).umod(f),f=r.mul(t).umod(f);return this.g.mulAdd(d,n,f)},s.prototype.getKeyRecoveryParam=function(e,t,i,r){if(null!==(t=new l(t,r)).recoveryParam)return t.recoveryParam;for(var f,d=0;d<4;d++){try{f=this.recoverPubKey(e,t,d)}catch(e){continue}if(f.eq(i))return d}throw new Error("Unable to find valid recovery factor")}},{"../curves":7,"../utils":15,"./key":9,"./signature":10,"bn.js":16,brorand:17,"hmac-drbg":31}],9:[function(e,t,i){"use strict";var r=e("bn.js"),f=e("../utils").assert;function d(e,t){this.ec=e,this.priv=null,this.pub=null,t.priv&&this._importPrivate(t.priv,t.privEnc),t.pub&&this._importPublic(t.pub,t.pubEnc)}(t.exports=d).fromPublic=function(e,t,i){return t instanceof d?t:new d(e,{pub:t,pubEnc:i})},d.fromPrivate=function(e,t,i){return t instanceof d?t:new d(e,{priv:t,privEnc:i})},d.prototype.validate=function(){var e=this.getPublic();return e.isInfinity()?{result:!1,reason:"Invalid public key"}:e.validate()?e.mul(this.ec.curve.n).isInfinity()?{result:!0,reason:null}:{result:!1,reason:"Public key * N != O"}:{result:!1,reason:"Public key is not a point"}},d.prototype.getPublic=function(e,t){return"string"==typeof e&&(t=e,e=null),this.pub||(this.pub=this.ec.g.mul(this.priv)),t?this.pub.encode(t,e):this.pub},d.prototype.getPrivate=function(e){return"hex"===e?this.priv.toString(16,2):this.priv},d.prototype._importPrivate=function(e,t){this.priv=new r(e,t||16),this.priv=this.priv.umod(this.ec.curve.n)},d.prototype._importPublic=function(e,t){if(e.x||e.y)return"mont"===this.ec.curve.type?f(e.x,"Need x coordinate"):"short"!==this.ec.curve.type&&"edwards"!==this.ec.curve.type||f(e.x&&e.y,"Need both x and y coordinate"),void(this.pub=this.ec.curve.point(e.x,e.y));this.pub=this.ec.curve.decodePoint(e,t)},d.prototype.derive=function(e){return e.validate()||f(e.validate(),"public point not validated"),e.mul(this.priv).getX()},d.prototype.sign=function(e,t,i){return this.ec.sign(e,this,t,i)},d.prototype.verify=function(e,t){return this.ec.verify(e,t,this)},d.prototype.inspect=function(){return"<Key priv: "+(this.priv&&this.priv.toString(16,2))+" pub: "+(this.pub&&this.pub.inspect())+" >"}},{"../utils":15,"bn.js":16}],10:[function(e,t,i){"use strict";var f=e("bn.js"),d=e("../utils"),r=d.assert;function n(e,t){if(e instanceof n)return e;this._importDER(e,t)||(r(e.r&&e.s,"Signature without r or s"),this.r=new f(e.r,16),this.s=new f(e.s,16),void 0===e.recoveryParam?this.recoveryParam=null:this.recoveryParam=e.recoveryParam)}function a(){this.place=0}function s(e,t){var i=e[t.place++];if(!(128&i))return i;var r=15&i;if(0==r||4<r)return!1;for(var f=0,d=0,n=t.place;d<r;d++,n++)f<<=8,f|=e[n],f>>>=0;return!(f<=127)&&(t.place=n,f)}function c(e){for(var t=0,i=e.length-1;!e[t]&&!(128&e[t+1])&&t<i;)t++;return 0===t?e:e.slice(t)}function h(e,t){if(t<128)e.push(t);else{var i=1+(Math.log(t)/Math.LN2>>>3);for(e.push(128|i);--i;)e.push(t>>>(i<<3)&255);e.push(t)}}(t.exports=n).prototype._importDER=function(e,t){e=d.toArray(e,t);var i=new a;if(48!==e[i.place++])return!1;var r=s(e,i);if(!1===r)return!1;if(r+i.place!==e.length)return!1;if(2!==e[i.place++])return!1;t=s(e,i);if(!1===t)return!1;r=e.slice(i.place,t+i.place);if(i.place+=t,2!==e[i.place++])return!1;t=s(e,i);if(!1===t)return!1;if(e.length!==t+i.place)return!1;i=e.slice(i.place,t+i.place);if(0===r[0]){if(!(128&r[1]))return!1;r=r.slice(1)}if(0===i[0]){if(!(128&i[1]))return!1;i=i.slice(1)}return this.r=new f(r),this.s=new f(i),!(this.recoveryParam=null)},n.prototype.toDER=function(e){var t=this.r.toArray(),i=this.s.toArray();for(128&t[0]&&(t=[0].concat(t)),128&i[0]&&(i=[0].concat(i)),t=c(t),i=c(i);!(i[0]||128&i[1]);)i=i.slice(1);var r=[2];h(r,t.length),(r=r.concat(t)).push(2),h(r,i.length);t=r.concat(i),r=[48];return h(r,t.length),r=r.concat(t),d.encode(r,e)}},{"../utils":15,"bn.js":16}],11:[function(e,t,i){"use strict";var r=e("hash.js"),f=e("../curves"),d=e("../utils"),n=d.assert,a=d.parseBytes,s=e("./key"),c=e("./signature");function h(e){if(n("ed25519"===e,"only tested with ed25519 so far"),!(this instanceof h))return new h(e);e=f[e].curve,this.curve=e,this.g=e.g,this.g.precompute(e.n.bitLength()+1),this.pointClass=e.point().constructor,this.encodingLength=Math.ceil(e.n.bitLength()/8),this.hash=r.sha512}(t.exports=h).prototype.sign=function(e,t){e=a(e);var i=this.keyFromSecret(t),r=this.hashInt(i.messagePrefix(),e),f=this.g.mul(r),t=this.encodePoint(f),i=this.hashInt(t,i.pubBytes(),e).mul(i.priv()),i=r.add(i).umod(this.curve.n);return this.makeSignature({R:f,S:i,Rencoded:t})},h.prototype.verify=function(e,t,i){e=a(e),t=this.makeSignature(t);var r=this.keyFromPublic(i),i=this.hashInt(t.Rencoded(),r.pubBytes(),e),e=this.g.mul(t.S());return t.R().add(r.pub().mul(i)).eq(e)},h.prototype.hashInt=function(){for(var e=this.hash(),t=0;t<arguments.length;t++)e.update(arguments[t]);return d.intFromLE(e.digest()).umod(this.curve.n)},h.prototype.keyFromPublic=function(e){return s.fromPublic(this,e)},h.prototype.keyFromSecret=function(e){return s.fromSecret(this,e)},h.prototype.makeSignature=function(e){return e instanceof c?e:new c(this,e)},h.prototype.encodePoint=function(e){var t=e.getY().toArray("le",this.encodingLength);return t[this.encodingLength-1]|=e.getX().isOdd()?128:0,t},h.prototype.decodePoint=function(e){var t=(e=d.parseBytes(e)).length-1,i=e.slice(0,t).concat(-129&e[t]),t=0!=(128&e[t]),i=d.intFromLE(i);return this.curve.pointFromY(i,t)},h.prototype.encodeInt=function(e){return e.toArray("le",this.encodingLength)},h.prototype.decodeInt=function(e){return d.intFromLE(e)},h.prototype.isPoint=function(e){return e instanceof this.pointClass}},{"../curves":7,"../utils":15,"./key":12,"./signature":13,"hash.js":19}],12:[function(e,t,i){"use strict";var r=e("../utils"),f=r.assert,d=r.parseBytes,e=r.cachedProperty;function n(e,t){this.eddsa=e,this._secret=d(t.secret),e.isPoint(t.pub)?this._pub=t.pub:this._pubBytes=d(t.pub)}n.fromPublic=function(e,t){return t instanceof n?t:new n(e,{pub:t})},n.fromSecret=function(e,t){return t instanceof n?t:new n(e,{secret:t})},n.prototype.secret=function(){return this._secret},e(n,"pubBytes",function(){return this.eddsa.encodePoint(this.pub())}),e(n,"pub",function(){return this._pubBytes?this.eddsa.decodePoint(this._pubBytes):this.eddsa.g.mul(this.priv())}),e(n,"privBytes",function(){var e=this.eddsa,t=this.hash(),i=e.encodingLength-1,e=t.slice(0,e.encodingLength);return e[0]&=248,e[i]&=127,e[i]|=64,e}),e(n,"priv",function(){return this.eddsa.decodeInt(this.privBytes())}),e(n,"hash",function(){return this.eddsa.hash().update(this.secret()).digest()}),e(n,"messagePrefix",function(){return this.hash().slice(this.eddsa.encodingLength)}),n.prototype.sign=function(e){return f(this._secret,"KeyPair can only verify"),this.eddsa.sign(e,this)},n.prototype.verify=function(e,t){return this.eddsa.verify(e,t,this)},n.prototype.getSecret=function(e){return f(this._secret,"KeyPair is public only"),r.encode(this.secret(),e)},n.prototype.getPublic=function(e){return r.encode(this.pubBytes(),e)},t.exports=n},{"../utils":15}],13:[function(e,t,i){"use strict";var r=e("bn.js"),f=e("../utils"),d=f.assert,e=f.cachedProperty,n=f.parseBytes;function a(e,t){this.eddsa=e,"object"!=typeof t&&(t=n(t)),Array.isArray(t)&&(t={R:t.slice(0,e.encodingLength),S:t.slice(e.encodingLength)}),d(t.R&&t.S,"Signature without R or S"),e.isPoint(t.R)&&(this._R=t.R),t.S instanceof r&&(this._S=t.S),this._Rencoded=Array.isArray(t.R)?t.R:t.Rencoded,this._Sencoded=Array.isArray(t.S)?t.S:t.Sencoded}e(a,"S",function(){return this.eddsa.decodeInt(this.Sencoded())}),e(a,"R",function(){return this.eddsa.decodePoint(this.Rencoded())}),e(a,"Rencoded",function(){return this.eddsa.encodePoint(this.R())}),e(a,"Sencoded",function(){return this.eddsa.encodeInt(this.S())}),a.prototype.toBytes=function(){return this.Rencoded().concat(this.Sencoded())},a.prototype.toHex=function(){return f.encode(this.toBytes(),"hex").toUpperCase()},t.exports=a},{"../utils":15,"bn.js":16}],14:[function(e,t,i){t.exports={doubles:{step:4,points:[["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a","f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"],["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508","11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"],["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739","d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"],["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640","4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"],["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c","4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"],["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda","96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"],["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa","5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"],["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0","cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"],["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d","9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"],["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d","e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"],["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1","9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"],["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0","5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"],["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047","10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"],["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862","283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"],["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7","7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"],["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd","56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"],["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83","7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"],["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a","53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"],["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8","bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"],["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d","4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"],["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725","7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"],["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754","4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"],["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c","17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"],["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6","6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"],["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39","c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"],["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891","893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"],["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b","febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"],["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03","2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"],["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d","eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"],["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070","7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"],["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4","e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"],["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da","662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"],["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11","1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"],["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e","efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"],["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41","2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"],["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef","67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"],["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8","db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"],["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d","648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"],["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96","35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"],["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd","ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"],["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5","9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"],["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266","40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"],["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71","34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"],["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac","c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"],["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751","1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"],["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e","493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"],["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241","c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"],["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3","be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"],["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f","4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"],["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19","aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"],["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be","b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"],["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9","6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"],["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2","8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"],["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13","7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"],["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c","ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"],["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba","2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"],["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151","e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"],["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073","d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"],["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458","38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"],["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b","69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"],["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366","d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"],["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa","40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"],["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0","620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"],["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787","7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"],["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e","ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]},naf:{wnd:7,points:[["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9","388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"],["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4","d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"],["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc","6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"],["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe","cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"],["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb","d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"],["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8","ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"],["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e","581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"],["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34","4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"],["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c","85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"],["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5","321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"],["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f","2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"],["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714","73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"],["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729","a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"],["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db","2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"],["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4","e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"],["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5","b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"],["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479","2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"],["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d","80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"],["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f","1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"],["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb","d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"],["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9","eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"],["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963","758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"],["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74","958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"],["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530","e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"],["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b","5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"],["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247","cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"],["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1","cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"],["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120","4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"],["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435","91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"],["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18","673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"],["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8","59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"],["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb","3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"],["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f","55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"],["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143","efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"],["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba","e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"],["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45","f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"],["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a","744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"],["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e","c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"],["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8","e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"],["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c","30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"],["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519","e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"],["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab","100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"],["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca","ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"],["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf","8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"],["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610","68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"],["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4","f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"],["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c","d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"],["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940","edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"],["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980","a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"],["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3","66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"],["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf","9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"],["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63","4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"],["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448","fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"],["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf","5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"],["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5","8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"],["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6","8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"],["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5","5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"],["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99","f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"],["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51","f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"],["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5","42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"],["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5","204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"],["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997","4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"],["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881","73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"],["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5","39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"],["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66","d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"],["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726","ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"],["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede","6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"],["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94","60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"],["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31","3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"],["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51","b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"],["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252","ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"],["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5","cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"],["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b","6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"],["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4","322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"],["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f","6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"],["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889","2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"],["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246","b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"],["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984","998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"],["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a","b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"],["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030","bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"],["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197","6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"],["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593","c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"],["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef","21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"],["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38","60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"],["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a","49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"],["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111","5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"],["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502","7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"],["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea","be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"],["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26","8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"],["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986","39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"],["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e","62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"],["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4","25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"],["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda","ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"],["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859","cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"],["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f","f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"],["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c","6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"],["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942","fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"],["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a","1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"],["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80","5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"],["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d","438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"],["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1","cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"],["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63","c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"],["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352","6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"],["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193","ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"],["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00","9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"],["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58","ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"],["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7","d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"],["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8","c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"],["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e","67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"],["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d","cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"],["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b","299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"],["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f","f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"],["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6","462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"],["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297","62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"],["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a","7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"],["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c","ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"],["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52","4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"],["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb","bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"],["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065","bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"],["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917","603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"],["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9","cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"],["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3","553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"],["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57","712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"],["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66","ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"],["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8","9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"],["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721","9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"],["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180","4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]}}},{}],15:[function(e,t,i){"use strict";var r=i,f=e("bn.js"),i=e("minimalistic-assert"),e=e("minimalistic-crypto-utils");r.assert=i,r.toArray=e.toArray,r.zero2=e.zero2,r.toHex=e.toHex,r.encode=e.encode,r.getNAF=function(e,t,i){var r=new Array(Math.max(e.bitLength(),i)+1);r.fill(0);for(var f=1<<t+1,d=e.clone(),n=0;n<r.length;n++){var a,s=d.andln(f-1);d.isOdd()?(a=(f>>1)-1<s?(f>>1)-s:s,d.isubn(a)):a=0,r[n]=a,d.iushrn(1)}return r},r.getJSF=function(e,t){var i=[[],[]];e=e.clone(),t=t.clone();for(var r,f=0,d=0;0<e.cmpn(-f)||0<t.cmpn(-d);){var n,a=e.andln(3)+f&3,s=t.andln(3)+d&3;3===s&&(s=-1),n=0==(1&(a=3===a?-1:a))?0:3!==(r=e.andln(7)+f&7)&&5!==r||2!==s?a:-a,i[0].push(n),s=0==(1&s)?0:3!==(r=t.andln(7)+d&7)&&5!==r||2!==a?s:-s,i[1].push(s),2*f===n+1&&(f=1-f),2*d===s+1&&(d=1-d),e.iushrn(1),t.iushrn(1)}return i},r.cachedProperty=function(e,t,i){var r="_"+t;e.prototype[t]=function(){return void 0!==this[r]?this[r]:this[r]=i.call(this)}},r.parseBytes=function(e){return"string"==typeof e?r.toArray(e,"hex"):e},r.intFromLE=function(e){return new f(e,"hex","le")}},{"bn.js":16,"minimalistic-assert":33,"minimalistic-crypto-utils":34}],16:[function(_,e,t){!function(e,t){"use strict";function p(e,t){if(!e)throw new Error(t||"Assertion failed")}function i(e,t){e.super_=t;function i(){}i.prototype=t.prototype,e.prototype=new i,e.prototype.constructor=e}function m(e,t,i){if(m.isBN(e))return e;this.negative=0,this.words=null,this.length=0,(this.red=null)!==e&&("le"!==t&&"be"!==t||(i=t,t=10),this._init(e||0,t||10,i||"be"))}var r;"object"==typeof e?e.exports=m:t.BN=m,(m.BN=m).wordSize=26;try{r=_("buffer").Buffer}catch(e){}function n(e,t,i){for(var r=0,f=Math.min(e.length,i),d=t;d<f;d++){var n=e.charCodeAt(d)-48;r<<=4,r|=49<=n&&n<=54?n-49+10:17<=n&&n<=22?n-17+10:15&n}return r}function o(e,t,i,r){for(var f=0,d=Math.min(e.length,i),n=t;n<d;n++){var a=e.charCodeAt(n)-48;f*=r,f+=49<=a?a-49+10:17<=a?a-17+10:a}return f}m.isBN=function(e){return e instanceof m||null!==e&&"object"==typeof e&&e.constructor.wordSize===m.wordSize&&Array.isArray(e.words)},m.max=function(e,t){return 0<e.cmp(t)?e:t},m.min=function(e,t){return e.cmp(t)<0?e:t},m.prototype._init=function(e,t,i){if("number"==typeof e)return this._initNumber(e,t,i);if("object"==typeof e)return this._initArray(e,t,i);p((t="hex"===t?16:t)===(0|t)&&2<=t&&t<=36);var r=0;"-"===(e=e.toString().replace(/\s+/g,""))[0]&&r++,16===t?this._parseHex(e,r):this._parseBase(e,t,r),"-"===e[0]&&(this.negative=1),this.strip(),"le"===i&&this._initArray(this.toArray(),t,i)},m.prototype._initNumber=function(e,t,i){e<0&&(this.negative=1,e=-e),e<67108864?(this.words=[67108863&e],this.length=1):e<4503599627370496?(this.words=[67108863&e,e/67108864&67108863],this.length=2):(p(e<9007199254740992),this.words=[67108863&e,e/67108864&67108863,1],this.length=3),"le"===i&&this._initArray(this.toArray(),t,i)},m.prototype._initArray=function(e,t,i){if(p("number"==typeof e.length),e.length<=0)return this.words=[0],this.length=1,this;this.length=Math.ceil(e.length/3),this.words=new Array(this.length);for(var r,f,d=0;d<this.length;d++)this.words[d]=0;var n=0;if("be"===i)for(d=e.length-1,r=0;0<=d;d-=3)f=e[d]|e[d-1]<<8|e[d-2]<<16,this.words[r]|=f<<n&67108863,this.words[r+1]=f>>>26-n&67108863,26<=(n+=24)&&(n-=26,r++);else if("le"===i)for(r=d=0;d<e.length;d+=3)f=e[d]|e[d+1]<<8|e[d+2]<<16,this.words[r]|=f<<n&67108863,this.words[r+1]=f>>>26-n&67108863,26<=(n+=24)&&(n-=26,r++);return this.strip()},m.prototype._parseHex=function(e,t){this.length=Math.ceil((e.length-t)/6),this.words=new Array(this.length);for(var i,r=0;r<this.length;r++)this.words[r]=0;for(var f=0,r=e.length-6,d=0;t<=r;r-=6)i=n(e,r,r+6),this.words[d]|=i<<f&67108863,this.words[d+1]|=i>>>26-f&4194303,26<=(f+=24)&&(f-=26,d++);r+6!==t&&(i=n(e,t,r+6),this.words[d]|=i<<f&67108863,this.words[d+1]|=i>>>26-f&4194303),this.strip()},m.prototype._parseBase=function(e,t,i){this.words=[0];for(var r=0,f=this.length=1;f<=67108863;f*=t)r++;r--,f=f/t|0;for(var d=e.length-i,n=d%r,a=Math.min(d,d-n)+i,s=0,c=i;c<a;c+=r)s=o(e,c,c+r,t),this.imuln(f),this.words[0]+s<67108864?this.words[0]+=s:this._iaddn(s);if(0!=n){for(var h=1,s=o(e,c,e.length,t),c=0;c<n;c++)h*=t;this.imuln(h),this.words[0]+s<67108864?this.words[0]+=s:this._iaddn(s)}},m.prototype.copy=function(e){e.words=new Array(this.length);for(var t=0;t<this.length;t++)e.words[t]=this.words[t];e.length=this.length,e.negative=this.negative,e.red=this.red},m.prototype.clone=function(){var e=new m(null);return this.copy(e),e},m.prototype._expand=function(e){for(;this.length<e;)this.words[this.length++]=0;return this},m.prototype.strip=function(){for(;1<this.length&&0===this.words[this.length-1];)this.length--;return this._normSign()},m.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this},m.prototype.inspect=function(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">"};var u=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],b=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],l=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];function f(e,t,i){i.negative=t.negative^e.negative;var r=e.length+t.length|0,r=(i.length=r)-1|0,f=67108863&(o=(0|e.words[0])*(0|t.words[0])),d=o/67108864|0;i.words[0]=f;for(var n=1;n<r;n++){for(var a=d>>>26,s=67108863&d,c=Math.min(n,t.length-1),h=Math.max(0,n-e.length+1);h<=c;h++){var o,u=n-h|0;a+=(o=(0|e.words[u])*(0|t.words[h])+s)/67108864|0,s=67108863&o}i.words[n]=0|s,d=0|a}return 0!==d?i.words[n]=0|d:i.length--,i.strip()}m.prototype.toString=function(e,t){if(t=0|t||1,16===(e=e||10)||"hex"===e){a="";for(var i=0,r=0,f=0;f<this.length;f++){var d=this.words[f],n=(16777215&(d<<i|r)).toString(16),a=0!==(r=d>>>24-i&16777215)||f!==this.length-1?u[6-n.length]+n+a:n+a;26<=(i+=2)&&(i-=26,f--)}for(0!==r&&(a=r.toString(16)+a);a.length%t!=0;)a="0"+a;return a=0!==this.negative?"-"+a:a}if(e===(0|e)&&2<=e&&e<=36){var s=b[e],c=l[e];for(a="",(h=this.clone()).negative=0;!h.isZero();){var h,o=h.modn(c).toString(e);a=(h=h.idivn(c)).isZero()?o+a:u[s-o.length]+o+a}for(this.isZero()&&(a="0"+a);a.length%t!=0;)a="0"+a;return a=0!==this.negative?"-"+a:a}p(!1,"Base should be between 2 and 36")},m.prototype.toNumber=function(){var e=this.words[0];return 2===this.length?e+=67108864*this.words[1]:3===this.length&&1===this.words[2]?e+=4503599627370496+67108864*this.words[1]:2<this.length&&p(!1,"Number can only safely store up to 53 bits"),0!==this.negative?-e:e},m.prototype.toJSON=function(){return this.toString(16)},m.prototype.toBuffer=function(e,t){return p(void 0!==r),this.toArrayLike(r,e,t)},m.prototype.toArray=function(e,t){return this.toArrayLike(Array,e,t)},m.prototype.toArrayLike=function(e,t,i){var r=this.byteLength(),f=i||Math.max(1,r);p(r<=f,"byte array longer than desired length"),p(0<f,"Requested array length <= 0"),this.strip();var d,n,t="le"===t,a=new e(f),s=this.clone();if(t){for(n=0;!s.isZero();n++)d=s.andln(255),s.iushrn(8),a[n]=d;for(;n<f;n++)a[n]=0}else{for(n=0;n<f-r;n++)a[n]=0;for(n=0;!s.isZero();n++)d=s.andln(255),s.iushrn(8),a[f-n-1]=d}return a},Math.clz32?m.prototype._countBits=function(e){return 32-Math.clz32(e)}:m.prototype._countBits=function(e){var t=e,e=0;return 4096<=t&&(e+=13,t>>>=13),64<=t&&(e+=7,t>>>=7),8<=t&&(e+=4,t>>>=4),2<=t&&(e+=2,t>>>=2),e+t},m.prototype._zeroBits=function(e){if(0===e)return 26;var t=e,e=0;return 0==(8191&t)&&(e+=13,t>>>=13),0==(127&t)&&(e+=7,t>>>=7),0==(15&t)&&(e+=4,t>>>=4),0==(3&t)&&(e+=2,t>>>=2),0==(1&t)&&e++,e},m.prototype.bitLength=function(){var e=this.words[this.length-1],e=this._countBits(e);return 26*(this.length-1)+e},m.prototype.zeroBits=function(){if(this.isZero())return 0;for(var e=0,t=0;t<this.length;t++){var i=this._zeroBits(this.words[t]);if(e+=i,26!==i)break}return e},m.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8)},m.prototype.toTwos=function(e){return 0!==this.negative?this.abs().inotn(e).iaddn(1):this.clone()},m.prototype.fromTwos=function(e){return this.testn(e-1)?this.notn(e).iaddn(1).ineg():this.clone()},m.prototype.isNeg=function(){return 0!==this.negative},m.prototype.neg=function(){return this.clone().ineg()},m.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this},m.prototype.iuor=function(e){for(;this.length<e.length;)this.words[this.length++]=0;for(var t=0;t<e.length;t++)this.words[t]=this.words[t]|e.words[t];return this.strip()},m.prototype.ior=function(e){return p(0==(this.negative|e.negative)),this.iuor(e)},m.prototype.or=function(e){return this.length>e.length?this.clone().ior(e):e.clone().ior(this)},m.prototype.uor=function(e){return this.length>e.length?this.clone().iuor(e):e.clone().iuor(this)},m.prototype.iuand=function(e){for(var t=this.length>e.length?e:this,i=0;i<t.length;i++)this.words[i]=this.words[i]&e.words[i];return this.length=t.length,this.strip()},m.prototype.iand=function(e){return p(0==(this.negative|e.negative)),this.iuand(e)},m.prototype.and=function(e){return this.length>e.length?this.clone().iand(e):e.clone().iand(this)},m.prototype.uand=function(e){return this.length>e.length?this.clone().iuand(e):e.clone().iuand(this)},m.prototype.iuxor=function(e){for(var t,i=this.length>e.length?(t=this,e):(t=e,this),r=0;r<i.length;r++)this.words[r]=t.words[r]^i.words[r];if(this!==t)for(;r<t.length;r++)this.words[r]=t.words[r];return this.length=t.length,this.strip()},m.prototype.ixor=function(e){return p(0==(this.negative|e.negative)),this.iuxor(e)},m.prototype.xor=function(e){return this.length>e.length?this.clone().ixor(e):e.clone().ixor(this)},m.prototype.uxor=function(e){return this.length>e.length?this.clone().iuxor(e):e.clone().iuxor(this)},m.prototype.inotn=function(e){p("number"==typeof e&&0<=e);var t=0|Math.ceil(e/26),e=e%26;this._expand(t),0<e&&t--;for(var i=0;i<t;i++)this.words[i]=67108863&~this.words[i];return 0<e&&(this.words[i]=~this.words[i]&67108863>>26-e),this.strip()},m.prototype.notn=function(e){return this.clone().inotn(e)},m.prototype.setn=function(e,t){p("number"==typeof e&&0<=e);var i=e/26|0,e=e%26;return this._expand(1+i),this.words[i]=t?this.words[i]|1<<e:this.words[i]&~(1<<e),this.strip()},m.prototype.iadd=function(e){var t,i,r;if(0!==this.negative&&0===e.negative)return this.negative=0,t=this.isub(e),this.negative^=1,this._normSign();if(0===this.negative&&0!==e.negative)return e.negative=0,t=this.isub(e),e.negative=1,t._normSign();r=this.length>e.length?(i=this,e):(i=e,this);for(var f=0,d=0;d<r.length;d++)t=(0|i.words[d])+(0|r.words[d])+f,this.words[d]=67108863&t,f=t>>>26;for(;0!==f&&d<i.length;d++)t=(0|i.words[d])+f,this.words[d]=67108863&t,f=t>>>26;if(this.length=i.length,0!==f)this.words[this.length]=f,this.length++;else if(i!==this)for(;d<i.length;d++)this.words[d]=i.words[d];return this},m.prototype.add=function(e){var t;return 0!==e.negative&&0===this.negative?(e.negative=0,t=this.sub(e),e.negative^=1,t):0===e.negative&&0!==this.negative?(this.negative=0,t=e.sub(this),this.negative=1,t):this.length>e.length?this.clone().iadd(e):e.clone().iadd(this)},m.prototype.isub=function(e){if(0!==e.negative){e.negative=0;var t=this.iadd(e);return e.negative=1,t._normSign()}if(0!==this.negative)return this.negative=0,this.iadd(e),this.negative=1,this._normSign();var i,r,f=this.cmp(e);if(0===f)return this.negative=0,this.length=1,this.words[0]=0,this;r=0<f?(i=this,e):(i=e,this);for(var d=0,n=0;n<r.length;n++)d=(t=(0|i.words[n])-(0|r.words[n])+d)>>26,this.words[n]=67108863&t;for(;0!==d&&n<i.length;n++)d=(t=(0|i.words[n])+d)>>26,this.words[n]=67108863&t;if(0===d&&n<i.length&&i!==this)for(;n<i.length;n++)this.words[n]=i.words[n];return this.length=Math.max(this.length,n),i!==this&&(this.negative=1),this.strip()},m.prototype.sub=function(e){return this.clone().isub(e)};var d=function(e,t,i){var r=e.words,f=t.words,d=i.words,n=0|r[0],a=8191&n,s=n>>>13,c=0|r[1],h=8191&c,o=c>>>13,u=0|r[2],b=8191&u,l=u>>>13,p=0|r[3],m=8191&p,v=p>>>13,g=0|r[4],y=8191&g,M=g>>>13,w=0|r[5],S=8191&w,_=w>>>13,A=0|r[6],x=8191&A,I=A>>>13,z=0|r[7],q=8191&z,R=z>>>13,k=0|r[8],P=8191&k,j=k>>>13,N=0|r[9],E=8191&N,B=N>>>13,L=0|f[0],O=8191&L,F=L>>>13,T=0|f[1],C=8191&T,Z=T>>>13,J=0|f[2],H=8191&J,D=J>>>13,X=0|f[3],K=8191&X,V=X>>>13,W=0|f[4],U=8191&W,Y=W>>>13,G=0|f[5],Q=8191&G,$=G>>>13,n=0|f[6],c=8191&n,u=n>>>13,p=0|f[7],g=8191&p,w=p>>>13,A=0|f[8],z=8191&A,k=A>>>13,r=0|f[9],N=8191&r,L=r>>>13;i.negative=e.negative^t.negative,i.length=19;var X=(0+Math.imul(a,O)|0)+((8191&(J=Math.imul(a,F)+Math.imul(s,O)|0))<<13)|0,ee=(Math.imul(s,F)+(J>>>13)|0)+(X>>>26)|0;X&=67108863,T=Math.imul(h,O),J=Math.imul(h,F)+Math.imul(o,O)|0,W=Math.imul(o,F);G=(ee+(T+Math.imul(a,C)|0)|0)+((8191&(J=(J+Math.imul(a,Z)|0)+Math.imul(s,C)|0))<<13)|0;ee=((W+Math.imul(s,Z)|0)+(J>>>13)|0)+(G>>>26)|0,G&=67108863,T=Math.imul(b,O),J=Math.imul(b,F)+Math.imul(l,O)|0,W=Math.imul(l,F),T=T+Math.imul(h,C)|0,J=(J+Math.imul(h,Z)|0)+Math.imul(o,C)|0,W=W+Math.imul(o,Z)|0;n=(ee+(T+Math.imul(a,H)|0)|0)+((8191&(J=(J+Math.imul(a,D)|0)+Math.imul(s,H)|0))<<13)|0;ee=((W+Math.imul(s,D)|0)+(J>>>13)|0)+(n>>>26)|0,n&=67108863,T=Math.imul(m,O),J=Math.imul(m,F)+Math.imul(v,O)|0,W=Math.imul(v,F),T=T+Math.imul(b,C)|0,J=(J+Math.imul(b,Z)|0)+Math.imul(l,C)|0,W=W+Math.imul(l,Z)|0,T=T+Math.imul(h,H)|0,J=(J+Math.imul(h,D)|0)+Math.imul(o,H)|0,W=W+Math.imul(o,D)|0;p=(ee+(T+Math.imul(a,K)|0)|0)+((8191&(J=(J+Math.imul(a,V)|0)+Math.imul(s,K)|0))<<13)|0;ee=((W+Math.imul(s,V)|0)+(J>>>13)|0)+(p>>>26)|0,p&=67108863,T=Math.imul(y,O),J=Math.imul(y,F)+Math.imul(M,O)|0,W=Math.imul(M,F),T=T+Math.imul(m,C)|0,J=(J+Math.imul(m,Z)|0)+Math.imul(v,C)|0,W=W+Math.imul(v,Z)|0,T=T+Math.imul(b,H)|0,J=(J+Math.imul(b,D)|0)+Math.imul(l,H)|0,W=W+Math.imul(l,D)|0,T=T+Math.imul(h,K)|0,J=(J+Math.imul(h,V)|0)+Math.imul(o,K)|0,W=W+Math.imul(o,V)|0;A=(ee+(T+Math.imul(a,U)|0)|0)+((8191&(J=(J+Math.imul(a,Y)|0)+Math.imul(s,U)|0))<<13)|0;ee=((W+Math.imul(s,Y)|0)+(J>>>13)|0)+(A>>>26)|0,A&=67108863,T=Math.imul(S,O),J=Math.imul(S,F)+Math.imul(_,O)|0,W=Math.imul(_,F),T=T+Math.imul(y,C)|0,J=(J+Math.imul(y,Z)|0)+Math.imul(M,C)|0,W=W+Math.imul(M,Z)|0,T=T+Math.imul(m,H)|0,J=(J+Math.imul(m,D)|0)+Math.imul(v,H)|0,W=W+Math.imul(v,D)|0,T=T+Math.imul(b,K)|0,J=(J+Math.imul(b,V)|0)+Math.imul(l,K)|0,W=W+Math.imul(l,V)|0,T=T+Math.imul(h,U)|0,J=(J+Math.imul(h,Y)|0)+Math.imul(o,U)|0,W=W+Math.imul(o,Y)|0;f=(ee+(T+Math.imul(a,Q)|0)|0)+((8191&(J=(J+Math.imul(a,$)|0)+Math.imul(s,Q)|0))<<13)|0;ee=((W+Math.imul(s,$)|0)+(J>>>13)|0)+(f>>>26)|0,f&=67108863,T=Math.imul(x,O),J=Math.imul(x,F)+Math.imul(I,O)|0,W=Math.imul(I,F),T=T+Math.imul(S,C)|0,J=(J+Math.imul(S,Z)|0)+Math.imul(_,C)|0,W=W+Math.imul(_,Z)|0,T=T+Math.imul(y,H)|0,J=(J+Math.imul(y,D)|0)+Math.imul(M,H)|0,W=W+Math.imul(M,D)|0,T=T+Math.imul(m,K)|0,J=(J+Math.imul(m,V)|0)+Math.imul(v,K)|0,W=W+Math.imul(v,V)|0,T=T+Math.imul(b,U)|0,J=(J+Math.imul(b,Y)|0)+Math.imul(l,U)|0,W=W+Math.imul(l,Y)|0,T=T+Math.imul(h,Q)|0,J=(J+Math.imul(h,$)|0)+Math.imul(o,Q)|0,W=W+Math.imul(o,$)|0;r=(ee+(T+Math.imul(a,c)|0)|0)+((8191&(J=(J+Math.imul(a,u)|0)+Math.imul(s,c)|0))<<13)|0;ee=((W+Math.imul(s,u)|0)+(J>>>13)|0)+(r>>>26)|0,r&=67108863,T=Math.imul(q,O),J=Math.imul(q,F)+Math.imul(R,O)|0,W=Math.imul(R,F),T=T+Math.imul(x,C)|0,J=(J+Math.imul(x,Z)|0)+Math.imul(I,C)|0,W=W+Math.imul(I,Z)|0,T=T+Math.imul(S,H)|0,J=(J+Math.imul(S,D)|0)+Math.imul(_,H)|0,W=W+Math.imul(_,D)|0,T=T+Math.imul(y,K)|0,J=(J+Math.imul(y,V)|0)+Math.imul(M,K)|0,W=W+Math.imul(M,V)|0,T=T+Math.imul(m,U)|0,J=(J+Math.imul(m,Y)|0)+Math.imul(v,U)|0,W=W+Math.imul(v,Y)|0,T=T+Math.imul(b,Q)|0,J=(J+Math.imul(b,$)|0)+Math.imul(l,Q)|0,W=W+Math.imul(l,$)|0,T=T+Math.imul(h,c)|0,J=(J+Math.imul(h,u)|0)+Math.imul(o,c)|0,W=W+Math.imul(o,u)|0;e=(ee+(T+Math.imul(a,g)|0)|0)+((8191&(J=(J+Math.imul(a,w)|0)+Math.imul(s,g)|0))<<13)|0;ee=((W+Math.imul(s,w)|0)+(J>>>13)|0)+(e>>>26)|0,e&=67108863,T=Math.imul(P,O),J=Math.imul(P,F)+Math.imul(j,O)|0,W=Math.imul(j,F),T=T+Math.imul(q,C)|0,J=(J+Math.imul(q,Z)|0)+Math.imul(R,C)|0,W=W+Math.imul(R,Z)|0,T=T+Math.imul(x,H)|0,J=(J+Math.imul(x,D)|0)+Math.imul(I,H)|0,W=W+Math.imul(I,D)|0,T=T+Math.imul(S,K)|0,J=(J+Math.imul(S,V)|0)+Math.imul(_,K)|0,W=W+Math.imul(_,V)|0,T=T+Math.imul(y,U)|0,J=(J+Math.imul(y,Y)|0)+Math.imul(M,U)|0,W=W+Math.imul(M,Y)|0,T=T+Math.imul(m,Q)|0,J=(J+Math.imul(m,$)|0)+Math.imul(v,Q)|0,W=W+Math.imul(v,$)|0,T=T+Math.imul(b,c)|0,J=(J+Math.imul(b,u)|0)+Math.imul(l,c)|0,W=W+Math.imul(l,u)|0,T=T+Math.imul(h,g)|0,J=(J+Math.imul(h,w)|0)+Math.imul(o,g)|0,W=W+Math.imul(o,w)|0;t=(ee+(T+Math.imul(a,z)|0)|0)+((8191&(J=(J+Math.imul(a,k)|0)+Math.imul(s,z)|0))<<13)|0;ee=((W+Math.imul(s,k)|0)+(J>>>13)|0)+(t>>>26)|0,t&=67108863,T=Math.imul(E,O),J=Math.imul(E,F)+Math.imul(B,O)|0,W=Math.imul(B,F),T=T+Math.imul(P,C)|0,J=(J+Math.imul(P,Z)|0)+Math.imul(j,C)|0,W=W+Math.imul(j,Z)|0,T=T+Math.imul(q,H)|0,J=(J+Math.imul(q,D)|0)+Math.imul(R,H)|0,W=W+Math.imul(R,D)|0,T=T+Math.imul(x,K)|0,J=(J+Math.imul(x,V)|0)+Math.imul(I,K)|0,W=W+Math.imul(I,V)|0,T=T+Math.imul(S,U)|0,J=(J+Math.imul(S,Y)|0)+Math.imul(_,U)|0,W=W+Math.imul(_,Y)|0,T=T+Math.imul(y,Q)|0,J=(J+Math.imul(y,$)|0)+Math.imul(M,Q)|0,W=W+Math.imul(M,$)|0,T=T+Math.imul(m,c)|0,J=(J+Math.imul(m,u)|0)+Math.imul(v,c)|0,W=W+Math.imul(v,u)|0,T=T+Math.imul(b,g)|0,J=(J+Math.imul(b,w)|0)+Math.imul(l,g)|0,W=W+Math.imul(l,w)|0,T=T+Math.imul(h,z)|0,J=(J+Math.imul(h,k)|0)+Math.imul(o,z)|0,W=W+Math.imul(o,k)|0;a=(ee+(T+Math.imul(a,N)|0)|0)+((8191&(J=(J+Math.imul(a,L)|0)+Math.imul(s,N)|0))<<13)|0;ee=((W+Math.imul(s,L)|0)+(J>>>13)|0)+(a>>>26)|0,a&=67108863,T=Math.imul(E,C),J=Math.imul(E,Z)+Math.imul(B,C)|0,W=Math.imul(B,Z),T=T+Math.imul(P,H)|0,J=(J+Math.imul(P,D)|0)+Math.imul(j,H)|0,W=W+Math.imul(j,D)|0,T=T+Math.imul(q,K)|0,J=(J+Math.imul(q,V)|0)+Math.imul(R,K)|0,W=W+Math.imul(R,V)|0,T=T+Math.imul(x,U)|0,J=(J+Math.imul(x,Y)|0)+Math.imul(I,U)|0,W=W+Math.imul(I,Y)|0,T=T+Math.imul(S,Q)|0,J=(J+Math.imul(S,$)|0)+Math.imul(_,Q)|0,W=W+Math.imul(_,$)|0,T=T+Math.imul(y,c)|0,J=(J+Math.imul(y,u)|0)+Math.imul(M,c)|0,W=W+Math.imul(M,u)|0,T=T+Math.imul(m,g)|0,J=(J+Math.imul(m,w)|0)+Math.imul(v,g)|0,W=W+Math.imul(v,w)|0,T=T+Math.imul(b,z)|0,J=(J+Math.imul(b,k)|0)+Math.imul(l,z)|0,W=W+Math.imul(l,k)|0;h=(ee+(T+Math.imul(h,N)|0)|0)+((8191&(J=(J+Math.imul(h,L)|0)+Math.imul(o,N)|0))<<13)|0;ee=((W+Math.imul(o,L)|0)+(J>>>13)|0)+(h>>>26)|0,h&=67108863,T=Math.imul(E,H),J=Math.imul(E,D)+Math.imul(B,H)|0,W=Math.imul(B,D),T=T+Math.imul(P,K)|0,J=(J+Math.imul(P,V)|0)+Math.imul(j,K)|0,W=W+Math.imul(j,V)|0,T=T+Math.imul(q,U)|0,J=(J+Math.imul(q,Y)|0)+Math.imul(R,U)|0,W=W+Math.imul(R,Y)|0,T=T+Math.imul(x,Q)|0,J=(J+Math.imul(x,$)|0)+Math.imul(I,Q)|0,W=W+Math.imul(I,$)|0,T=T+Math.imul(S,c)|0,J=(J+Math.imul(S,u)|0)+Math.imul(_,c)|0,W=W+Math.imul(_,u)|0,T=T+Math.imul(y,g)|0,J=(J+Math.imul(y,w)|0)+Math.imul(M,g)|0,W=W+Math.imul(M,w)|0,T=T+Math.imul(m,z)|0,J=(J+Math.imul(m,k)|0)+Math.imul(v,z)|0,W=W+Math.imul(v,k)|0;b=(ee+(T+Math.imul(b,N)|0)|0)+((8191&(J=(J+Math.imul(b,L)|0)+Math.imul(l,N)|0))<<13)|0;ee=((W+Math.imul(l,L)|0)+(J>>>13)|0)+(b>>>26)|0,b&=67108863,T=Math.imul(E,K),J=Math.imul(E,V)+Math.imul(B,K)|0,W=Math.imul(B,V),T=T+Math.imul(P,U)|0,J=(J+Math.imul(P,Y)|0)+Math.imul(j,U)|0,W=W+Math.imul(j,Y)|0,T=T+Math.imul(q,Q)|0,J=(J+Math.imul(q,$)|0)+Math.imul(R,Q)|0,W=W+Math.imul(R,$)|0,T=T+Math.imul(x,c)|0,J=(J+Math.imul(x,u)|0)+Math.imul(I,c)|0,W=W+Math.imul(I,u)|0,T=T+Math.imul(S,g)|0,J=(J+Math.imul(S,w)|0)+Math.imul(_,g)|0,W=W+Math.imul(_,w)|0,T=T+Math.imul(y,z)|0,J=(J+Math.imul(y,k)|0)+Math.imul(M,z)|0,W=W+Math.imul(M,k)|0;m=(ee+(T+Math.imul(m,N)|0)|0)+((8191&(J=(J+Math.imul(m,L)|0)+Math.imul(v,N)|0))<<13)|0;ee=((W+Math.imul(v,L)|0)+(J>>>13)|0)+(m>>>26)|0,m&=67108863,T=Math.imul(E,U),J=Math.imul(E,Y)+Math.imul(B,U)|0,W=Math.imul(B,Y),T=T+Math.imul(P,Q)|0,J=(J+Math.imul(P,$)|0)+Math.imul(j,Q)|0,W=W+Math.imul(j,$)|0,T=T+Math.imul(q,c)|0,J=(J+Math.imul(q,u)|0)+Math.imul(R,c)|0,W=W+Math.imul(R,u)|0,T=T+Math.imul(x,g)|0,J=(J+Math.imul(x,w)|0)+Math.imul(I,g)|0,W=W+Math.imul(I,w)|0,T=T+Math.imul(S,z)|0,J=(J+Math.imul(S,k)|0)+Math.imul(_,z)|0,W=W+Math.imul(_,k)|0;y=(ee+(T+Math.imul(y,N)|0)|0)+((8191&(J=(J+Math.imul(y,L)|0)+Math.imul(M,N)|0))<<13)|0;ee=((W+Math.imul(M,L)|0)+(J>>>13)|0)+(y>>>26)|0,y&=67108863,T=Math.imul(E,Q),J=Math.imul(E,$)+Math.imul(B,Q)|0,W=Math.imul(B,$),T=T+Math.imul(P,c)|0,J=(J+Math.imul(P,u)|0)+Math.imul(j,c)|0,W=W+Math.imul(j,u)|0,T=T+Math.imul(q,g)|0,J=(J+Math.imul(q,w)|0)+Math.imul(R,g)|0,W=W+Math.imul(R,w)|0,T=T+Math.imul(x,z)|0,J=(J+Math.imul(x,k)|0)+Math.imul(I,z)|0,W=W+Math.imul(I,k)|0;S=(ee+(T+Math.imul(S,N)|0)|0)+((8191&(J=(J+Math.imul(S,L)|0)+Math.imul(_,N)|0))<<13)|0;ee=((W+Math.imul(_,L)|0)+(J>>>13)|0)+(S>>>26)|0,S&=67108863,T=Math.imul(E,c),J=Math.imul(E,u)+Math.imul(B,c)|0,W=Math.imul(B,u),T=T+Math.imul(P,g)|0,J=(J+Math.imul(P,w)|0)+Math.imul(j,g)|0,W=W+Math.imul(j,w)|0,T=T+Math.imul(q,z)|0,J=(J+Math.imul(q,k)|0)+Math.imul(R,z)|0,W=W+Math.imul(R,k)|0;x=(ee+(T+Math.imul(x,N)|0)|0)+((8191&(J=(J+Math.imul(x,L)|0)+Math.imul(I,N)|0))<<13)|0;ee=((W+Math.imul(I,L)|0)+(J>>>13)|0)+(x>>>26)|0,x&=67108863,T=Math.imul(E,g),J=Math.imul(E,w)+Math.imul(B,g)|0,W=Math.imul(B,w),T=T+Math.imul(P,z)|0,J=(J+Math.imul(P,k)|0)+Math.imul(j,z)|0,W=W+Math.imul(j,k)|0;q=(ee+(T+Math.imul(q,N)|0)|0)+((8191&(J=(J+Math.imul(q,L)|0)+Math.imul(R,N)|0))<<13)|0;ee=((W+Math.imul(R,L)|0)+(J>>>13)|0)+(q>>>26)|0,q&=67108863,T=Math.imul(E,z),J=Math.imul(E,k)+Math.imul(B,z)|0,W=Math.imul(B,k);P=(ee+(T+Math.imul(P,N)|0)|0)+((8191&(J=(J+Math.imul(P,L)|0)+Math.imul(j,N)|0))<<13)|0;ee=((W+Math.imul(j,L)|0)+(J>>>13)|0)+(P>>>26)|0,P&=67108863;N=(ee+Math.imul(E,N)|0)+((8191&(J=Math.imul(E,L)+Math.imul(B,N)|0))<<13)|0;return ee=(Math.imul(B,L)+(J>>>13)|0)+(N>>>26)|0,N&=67108863,d[0]=X,d[1]=G,d[2]=n,d[3]=p,d[4]=A,d[5]=f,d[6]=r,d[7]=e,d[8]=t,d[9]=a,d[10]=h,d[11]=b,d[12]=m,d[13]=y,d[14]=S,d[15]=x,d[16]=q,d[17]=P,d[18]=N,0!=ee&&(d[19]=ee,i.length++),i};function a(e,t,i){return(new s).mulp(e,t,i)}function s(e,t){this.x=e,this.y=t}Math.imul||(d=f),m.prototype.mulTo=function(e,t){var i=this.length+e.length,t=(10===this.length&&10===e.length?d:i<63?f:i<1024?function(e,t,i){i.negative=t.negative^e.negative,i.length=e.length+t.length;for(var r=0,f=0,d=0;d<i.length-1;d++){for(var n=f,f=0,a=67108863&r,s=Math.min(d,t.length-1),c=Math.max(0,d-e.length+1);c<=s;c++){var h=d-c,o=(0|e.words[h])*(0|t.words[c]),h=67108863&o,a=67108863&(h=h+a|0);f+=(n=(n=n+(o/67108864|0)|0)+(h>>>26)|0)>>>26,n&=67108863}i.words[d]=a,r=n,n=f}return 0!==r?i.words[d]=r:i.length--,i.strip()}:a)(this,e,t);return t},s.prototype.makeRBT=function(e){for(var t=new Array(e),i=m.prototype._countBits(e)-1,r=0;r<e;r++)t[r]=this.revBin(r,i,e);return t},s.prototype.revBin=function(e,t,i){if(0===e||e===i-1)return e;for(var r=0,f=0;f<t;f++)r|=(1&e)<<t-f-1,e>>=1;return r},s.prototype.permute=function(e,t,i,r,f,d){for(var n=0;n<d;n++)r[n]=t[e[n]],f[n]=i[e[n]]},s.prototype.transform=function(e,t,i,r,f,d){this.permute(d,e,t,i,r,f);for(var n=1;n<f;n<<=1)for(var a=n<<1,s=Math.cos(2*Math.PI/a),c=Math.sin(2*Math.PI/a),h=0;h<f;h+=a)for(var o=s,u=c,b=0;b<n;b++){var l=i[h+b],p=r[h+b],m=o*(g=i[h+b+n])-u*(v=r[h+b+n]),v=o*v+u*g,g=m;i[h+b]=l+g,r[h+b]=p+v,i[h+b+n]=l-g,r[h+b+n]=p-v,b!==a&&(m=s*o-c*u,u=s*u+c*o,o=m)}},s.prototype.guessLen13b=function(e,t){for(var e=1&(r=1|Math.max(t,e)),i=0,r=r/2|0;r;r>>>=1)i++;return 1<<i+1+e},s.prototype.conjugate=function(e,t,i){if(!(i<=1))for(var r=0;r<i/2;r++){var f=e[r];e[r]=e[i-r-1],e[i-r-1]=f,f=t[r],t[r]=-t[i-r-1],t[i-r-1]=-f}},s.prototype.normalize13b=function(e,t){for(var i=0,r=0;r<t/2;r++){var f=8192*Math.round(e[2*r+1]/t)+Math.round(e[2*r]/t)+i;e[r]=67108863&f,i=f<67108864?0:f/67108864|0}return e},s.prototype.convert13b=function(e,t,i,r){for(var f=0,d=0;d<t;d++)f+=0|e[d],i[2*d]=8191&f,f>>>=13,i[2*d+1]=8191&f,f>>>=13;for(d=2*t;d<r;++d)i[d]=0;p(0===f),p(0==(-8192&f))},s.prototype.stub=function(e){for(var t=new Array(e),i=0;i<e;i++)t[i]=0;return t},s.prototype.mulp=function(e,t,i){var r=2*this.guessLen13b(e.length,t.length),f=this.makeRBT(r),d=this.stub(r),n=new Array(r),a=new Array(r),s=new Array(r),c=new Array(r),h=new Array(r),o=new Array(r),u=i.words;u.length=r,this.convert13b(e.words,e.length,n,r),this.convert13b(t.words,t.length,c,r),this.transform(n,d,a,s,r,f),this.transform(c,d,h,o,r,f);for(var b=0;b<r;b++){var l=a[b]*h[b]-s[b]*o[b];s[b]=a[b]*o[b]+s[b]*h[b],a[b]=l}return this.conjugate(a,s,r),this.transform(a,s,u,d,r,f),this.conjugate(u,d,r),this.normalize13b(u,r),i.negative=e.negative^t.negative,i.length=e.length+t.length,i.strip()},m.prototype.mul=function(e){var t=new m(null);return t.words=new Array(this.length+e.length),this.mulTo(e,t)},m.prototype.mulf=function(e){var t=new m(null);return t.words=new Array(this.length+e.length),a(this,e,t)},m.prototype.imul=function(e){return this.clone().mulTo(e,this)},m.prototype.imuln=function(e){p("number"==typeof e),p(e<67108864);for(var t=0,i=0;i<this.length;i++){var r=(0|this.words[i])*e,f=(67108863&r)+(67108863&t);t>>=26,t+=r/67108864|0,t+=f>>>26,this.words[i]=67108863&f}return 0!==t&&(this.words[i]=t,this.length++),this},m.prototype.muln=function(e){return this.clone().imuln(e)},m.prototype.sqr=function(){return this.mul(this)},m.prototype.isqr=function(){return this.imul(this.clone())},m.prototype.pow=function(e){var t=function(e){for(var t=new Array(e.bitLength()),i=0;i<t.length;i++){var r=i/26|0,f=i%26;t[i]=(e.words[r]&1<<f)>>>f}return t}(e);if(0===t.length)return new m(1);for(var i=this,r=0;r<t.length&&0===t[r];r++,i=i.sqr());if(++r<t.length)for(var f=i.sqr();r<t.length;r++,f=f.sqr())0!==t[r]&&(i=i.mul(f));return i},m.prototype.iushln=function(e){p("number"==typeof e&&0<=e);var t=e%26,i=(e-t)/26,r=67108863>>>26-t<<26-t;if(0!=t){for(var f=0,d=0;d<this.length;d++){var n=this.words[d]&r,a=(0|this.words[d])-n<<t;this.words[d]=a|f,f=n>>>26-t}f&&(this.words[d]=f,this.length++)}if(0!=i){for(d=this.length-1;0<=d;d--)this.words[d+i]=this.words[d];for(d=0;d<i;d++)this.words[d]=0;this.length+=i}return this.strip()},m.prototype.ishln=function(e){return p(0===this.negative),this.iushln(e)},m.prototype.iushrn=function(e,t,i){var r;p("number"==typeof e&&0<=e),r=t?(t-t%26)/26:0;var f=e%26,d=Math.min((e-f)/26,this.length),n=67108863^67108863>>>f<<f,a=i;if(r-=d,r=Math.max(0,r),a){for(var s=0;s<d;s++)a.words[s]=this.words[s];a.length=d}if(0!==d)if(this.length>d)for(this.length-=d,s=0;s<this.length;s++)this.words[s]=this.words[s+d];else this.words[0]=0,this.length=1;for(var c=0,s=this.length-1;0<=s&&(0!==c||r<=s);s--){var h=0|this.words[s];this.words[s]=c<<26-f|h>>>f,c=h&n}return a&&0!==c&&(a.words[a.length++]=c),0===this.length&&(this.words[0]=0,this.length=1),this.strip()},m.prototype.ishrn=function(e,t,i){return p(0===this.negative),this.iushrn(e,t,i)},m.prototype.shln=function(e){return this.clone().ishln(e)},m.prototype.ushln=function(e){return this.clone().iushln(e)},m.prototype.shrn=function(e){return this.clone().ishrn(e)},m.prototype.ushrn=function(e){return this.clone().iushrn(e)},m.prototype.testn=function(e){p("number"==typeof e&&0<=e);var t=e%26,e=(e-t)/26,t=1<<t;return!(this.length<=e)&&!!(this.words[e]&t)},m.prototype.imaskn=function(e){p("number"==typeof e&&0<=e);var t=e%26,e=(e-t)/26;return p(0===this.negative,"imaskn works only with positive numbers"),this.length<=e?this:(0!=t&&e++,this.length=Math.min(e,this.length),0!=t&&(t=67108863^67108863>>>t<<t,this.words[this.length-1]&=t),this.strip())},m.prototype.maskn=function(e){return this.clone().imaskn(e)},m.prototype.iaddn=function(e){return p("number"==typeof e),p(e<67108864),e<0?this.isubn(-e):0!==this.negative?(1===this.length&&(0|this.words[0])<e?(this.words[0]=e-(0|this.words[0]),this.negative=0):(this.negative=0,this.isubn(e),this.negative=1),this):this._iaddn(e)},m.prototype._iaddn=function(e){this.words[0]+=e;for(var t=0;t<this.length&&67108864<=this.words[t];t++)this.words[t]-=67108864,t===this.length-1?this.words[t+1]=1:this.words[t+1]++;return this.length=Math.max(this.length,t+1),this},m.prototype.isubn=function(e){if(p("number"==typeof e),p(e<67108864),e<0)return this.iaddn(-e);if(0!==this.negative)return this.negative=0,this.iaddn(e),this.negative=1,this;if(this.words[0]-=e,1===this.length&&this.words[0]<0)this.words[0]=-this.words[0],this.negative=1;else for(var t=0;t<this.length&&this.words[t]<0;t++)this.words[t]+=67108864,--this.words[t+1];return this.strip()},m.prototype.addn=function(e){return this.clone().iaddn(e)},m.prototype.subn=function(e){return this.clone().isubn(e)},m.prototype.iabs=function(){return this.negative=0,this},m.prototype.abs=function(){return this.clone().iabs()},m.prototype._ishlnsubmul=function(e,t,i){var r,f=e.length+i;this._expand(f);for(var d=0,n=0;n<e.length;n++){r=(0|this.words[n+i])+d;var a=(0|e.words[n])*t,d=((r-=67108863&a)>>26)-(a/67108864|0);this.words[n+i]=67108863&r}for(;n<this.length-i;n++)d=(r=(0|this.words[n+i])+d)>>26,this.words[n+i]=67108863&r;if(0===d)return this.strip();for(p(-1===d),n=d=0;n<this.length;n++)d=(r=-(0|this.words[n])+d)>>26,this.words[n]=67108863&r;return this.negative=1,this.strip()},m.prototype._wordDiv=function(e,t){var i=this.length-e.length,r=this.clone(),f=e,d=0|f.words[f.length-1];0!=(i=26-this._countBits(d))&&(f=f.ushln(i),r.iushln(i),d=0|f.words[f.length-1]);var n,a=r.length-f.length;if("mod"!==t){(n=new m(null)).length=1+a,n.words=new Array(n.length);for(var s=0;s<n.length;s++)n.words[s]=0}e=r.clone()._ishlnsubmul(f,1,a);0===e.negative&&(r=e,n&&(n.words[a]=1));for(var c=a-1;0<=c;c--){var h=67108864*(0|r.words[f.length+c])+(0|r.words[f.length+c-1]),h=Math.min(h/d|0,67108863);for(r._ishlnsubmul(f,h,c);0!==r.negative;)h--,r.negative=0,r._ishlnsubmul(f,1,c),r.isZero()||(r.negative^=1);n&&(n.words[c]=h)}return n&&n.strip(),r.strip(),"div"!==t&&0!=i&&r.iushrn(i),{div:n||null,mod:r}},m.prototype.divmod=function(e,t,i){return p(!e.isZero()),this.isZero()?{div:new m(0),mod:new m(0)}:0!==this.negative&&0===e.negative?(d=this.neg().divmod(e,t),"mod"!==t&&(r=d.div.neg()),"div"!==t&&(f=d.mod.neg(),i&&0!==f.negative&&f.iadd(e)),{div:r,mod:f}):0===this.negative&&0!==e.negative?(d=this.divmod(e.neg(),t),{div:r="mod"!==t?d.div.neg():r,mod:d.mod}):0!=(this.negative&e.negative)?(d=this.neg().divmod(e.neg(),t),"div"!==t&&(f=d.mod.neg(),i&&0!==f.negative&&f.isub(e)),{div:d.div,mod:f}):e.length>this.length||this.cmp(e)<0?{div:new m(0),mod:this}:1===e.length?"div"===t?{div:this.divn(e.words[0]),mod:null}:"mod"===t?{div:null,mod:new m(this.modn(e.words[0]))}:{div:this.divn(e.words[0]),mod:new m(this.modn(e.words[0]))}:this._wordDiv(e,t);var r,f,d},m.prototype.div=function(e){return this.divmod(e,"div",!1).div},m.prototype.mod=function(e){return this.divmod(e,"mod",!1).mod},m.prototype.umod=function(e){return this.divmod(e,"mod",!0).mod},m.prototype.divRound=function(e){var t=this.divmod(e);if(t.mod.isZero())return t.div;var i=0!==t.div.negative?t.mod.isub(e):t.mod,r=e.ushrn(1),e=e.andln(1),r=i.cmp(r);return r<0||1===e&&0===r?t.div:0!==t.div.negative?t.div.isubn(1):t.div.iaddn(1)},m.prototype.modn=function(e){p(e<=67108863);for(var t=(1<<26)%e,i=0,r=this.length-1;0<=r;r--)i=(t*i+(0|this.words[r]))%e;return i},m.prototype.idivn=function(e){p(e<=67108863);for(var t=0,i=this.length-1;0<=i;i--){var r=(0|this.words[i])+67108864*t;this.words[i]=r/e|0,t=r%e}return this.strip()},m.prototype.divn=function(e){return this.clone().idivn(e)},m.prototype.egcd=function(e){p(0===e.negative),p(!e.isZero());for(var t=this,i=e.clone(),t=0!==t.negative?t.umod(e):t.clone(),r=new m(1),f=new m(0),d=new m(0),n=new m(1),a=0;t.isEven()&&i.isEven();)t.iushrn(1),i.iushrn(1),++a;for(var s=i.clone(),c=t.clone();!t.isZero();){for(var h=0,o=1;0==(t.words[0]&o)&&h<26;++h,o<<=1);if(0<h)for(t.iushrn(h);0<h--;)(r.isOdd()||f.isOdd())&&(r.iadd(s),f.isub(c)),r.iushrn(1),f.iushrn(1);for(var u=0,b=1;0==(i.words[0]&b)&&u<26;++u,b<<=1);if(0<u)for(i.iushrn(u);0<u--;)(d.isOdd()||n.isOdd())&&(d.iadd(s),n.isub(c)),d.iushrn(1),n.iushrn(1);0<=t.cmp(i)?(t.isub(i),r.isub(d),f.isub(n)):(i.isub(t),d.isub(r),n.isub(f))}return{a:d,b:n,gcd:i.iushln(a)}},m.prototype._invmp=function(e){p(0===e.negative),p(!e.isZero());for(var t,i=this,r=e.clone(),i=0!==i.negative?i.umod(e):i.clone(),f=new m(1),d=new m(0),n=r.clone();0<i.cmpn(1)&&0<r.cmpn(1);){for(var a=0,s=1;0==(i.words[0]&s)&&a<26;++a,s<<=1);if(0<a)for(i.iushrn(a);0<a--;)f.isOdd()&&f.iadd(n),f.iushrn(1);for(var c=0,h=1;0==(r.words[0]&h)&&c<26;++c,h<<=1);if(0<c)for(r.iushrn(c);0<c--;)d.isOdd()&&d.iadd(n),d.iushrn(1);0<=i.cmp(r)?(i.isub(r),f.isub(d)):(r.isub(i),d.isub(f))}return(t=0===i.cmpn(1)?f:d).cmpn(0)<0&&t.iadd(e),t},m.prototype.gcd=function(e){if(this.isZero())return e.abs();if(e.isZero())return this.abs();var t=this.clone(),i=e.clone();t.negative=0;for(var r=i.negative=0;t.isEven()&&i.isEven();r++)t.iushrn(1),i.iushrn(1);for(;;){for(;t.isEven();)t.iushrn(1);for(;i.isEven();)i.iushrn(1);var f=t.cmp(i);if(f<0)var d=t,t=i,i=d;else if(0===f||0===i.cmpn(1))break;t.isub(i)}return i.iushln(r)},m.prototype.invm=function(e){return this.egcd(e).a.umod(e)},m.prototype.isEven=function(){return 0==(1&this.words[0])},m.prototype.isOdd=function(){return 1==(1&this.words[0])},m.prototype.andln=function(e){return this.words[0]&e},m.prototype.bincn=function(e){p("number"==typeof e);var t=e%26,e=(e-t)/26,t=1<<t;if(this.length<=e)return this._expand(1+e),this.words[e]|=t,this;for(var i=t,r=e;0!==i&&r<this.length;r++){var f=0|this.words[r],i=(f+=i)>>>26;f&=67108863,this.words[r]=f}return 0!==i&&(this.words[r]=i,this.length++),this},m.prototype.isZero=function(){return 1===this.length&&0===this.words[0]},m.prototype.cmpn=function(e){var t=e<0;return 0===this.negative||t?0===this.negative&&t?1:(this.strip(),e=1<this.length?1:(p((e=t?-e:e)<=67108863,"Number is too big"),(t=0|this.words[0])===e?0:t<e?-1:1),0!==this.negative?0|-e:e):-1},m.prototype.cmp=function(e){if(0!==this.negative&&0===e.negative)return-1;if(0===this.negative&&0!==e.negative)return 1;e=this.ucmp(e);return 0!==this.negative?0|-e:e},m.prototype.ucmp=function(e){if(this.length>e.length)return 1;if(this.length<e.length)return-1;for(var t=0,i=this.length-1;0<=i;i--){var r=0|this.words[i],f=0|e.words[i];if(r!=f){r<f?t=-1:f<r&&(t=1);break}}return t},m.prototype.gtn=function(e){return 1===this.cmpn(e)},m.prototype.gt=function(e){return 1===this.cmp(e)},m.prototype.gten=function(e){return 0<=this.cmpn(e)},m.prototype.gte=function(e){return 0<=this.cmp(e)},m.prototype.ltn=function(e){return-1===this.cmpn(e)},m.prototype.lt=function(e){return-1===this.cmp(e)},m.prototype.lten=function(e){return this.cmpn(e)<=0},m.prototype.lte=function(e){return this.cmp(e)<=0},m.prototype.eqn=function(e){return 0===this.cmpn(e)},m.prototype.eq=function(e){return 0===this.cmp(e)},m.red=function(e){return new w(e)},m.prototype.toRed=function(e){return p(!this.red,"Already a number in reduction context"),p(0===this.negative,"red works only with positives"),e.convertTo(this)._forceRed(e)},m.prototype.fromRed=function(){return p(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this)},m.prototype._forceRed=function(e){return this.red=e,this},m.prototype.forceRed=function(e){return p(!this.red,"Already a number in reduction context"),this._forceRed(e)},m.prototype.redAdd=function(e){return p(this.red,"redAdd works only with red numbers"),this.red.add(this,e)},m.prototype.redIAdd=function(e){return p(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,e)},m.prototype.redSub=function(e){return p(this.red,"redSub works only with red numbers"),this.red.sub(this,e)},m.prototype.redISub=function(e){return p(this.red,"redISub works only with red numbers"),this.red.isub(this,e)},m.prototype.redShl=function(e){return p(this.red,"redShl works only with red numbers"),this.red.shl(this,e)},m.prototype.redMul=function(e){return p(this.red,"redMul works only with red numbers"),this.red._verify2(this,e),this.red.mul(this,e)},m.prototype.redIMul=function(e){return p(this.red,"redMul works only with red numbers"),this.red._verify2(this,e),this.red.imul(this,e)},m.prototype.redSqr=function(){return p(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this)},m.prototype.redISqr=function(){return p(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this)},m.prototype.redSqrt=function(){return p(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this)},m.prototype.redInvm=function(){return p(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this)},m.prototype.redNeg=function(){return p(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this)},m.prototype.redPow=function(e){return p(this.red&&!e.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,e)};var c={k256:null,p224:null,p192:null,p25519:null};function h(e,t){this.name=e,this.p=new m(t,16),this.n=this.p.bitLength(),this.k=new m(1).iushln(this.n).isub(this.p),this.tmp=this._tmp()}function v(){h.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}function g(){h.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")}function y(){h.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")}function M(){h.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")}function w(e){var t;"string"==typeof e?(t=m._prime(e),this.m=t.p,this.prime=t):(p(e.gtn(1),"modulus must be greater than 1"),this.m=e,this.prime=null)}function S(e){w.call(this,e),this.shift=this.m.bitLength(),this.shift%26!=0&&(this.shift+=26-this.shift%26),this.r=new m(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv)}h.prototype._tmp=function(){var e=new m(null);return e.words=new Array(Math.ceil(this.n/13)),e},h.prototype.ireduce=function(e){for(var t,i=e;this.split(i,this.tmp),t=(i=(i=this.imulK(i)).iadd(this.tmp)).bitLength(),t>this.n;);e=t<this.n?-1:i.ucmp(this.p);return 0===e?(i.words[0]=0,i.length=1):0<e?i.isub(this.p):void 0!==i.strip?i.strip():i._strip(),i},h.prototype.split=function(e,t){e.iushrn(this.n,0,t)},h.prototype.imulK=function(e){return e.imul(this.k)},i(v,h),v.prototype.split=function(e,t){for(var i=Math.min(e.length,9),r=0;r<i;r++)t.words[r]=e.words[r];if(t.length=i,e.length<=9)return e.words[0]=0,void(e.length=1);var f=e.words[9];for(t.words[t.length++]=4194303&f,r=10;r<e.length;r++){var d=0|e.words[r];e.words[r-10]=(4194303&d)<<4|f>>>22,f=d}f>>>=22,0===(e.words[r-10]=f)&&10<e.length?e.length-=10:e.length-=9},v.prototype.imulK=function(e){e.words[e.length]=0,e.words[e.length+1]=0,e.length+=2;for(var t=0,i=0;i<e.length;i++){var r=0|e.words[i];t+=977*r,e.words[i]=67108863&t,t=64*r+(t/67108864|0)}return 0===e.words[e.length-1]&&(e.length--,0===e.words[e.length-1]&&e.length--),e},i(g,h),i(y,h),i(M,h),M.prototype.imulK=function(e){for(var t=0,i=0;i<e.length;i++){var r=19*(0|e.words[i])+t,f=67108863&r;r>>>=26,e.words[i]=f,t=r}return 0!==t&&(e.words[e.length++]=t),e},m._prime=function(e){if(c[e])return c[e];var t;if("k256"===e)t=new v;else if("p224"===e)t=new g;else if("p192"===e)t=new y;else{if("p25519"!==e)throw new Error("Unknown prime "+e);t=new M}return c[e]=t},w.prototype._verify1=function(e){p(0===e.negative,"red works only with positives"),p(e.red,"red works only with red numbers")},w.prototype._verify2=function(e,t){p(0==(e.negative|t.negative),"red works only with positives"),p(e.red&&e.red===t.red,"red works only with red numbers")},w.prototype.imod=function(e){return(this.prime?this.prime.ireduce(e):e.umod(this.m))._forceRed(this)},w.prototype.neg=function(e){return e.isZero()?e.clone():this.m.sub(e)._forceRed(this)},w.prototype.add=function(e,t){this._verify2(e,t);t=e.add(t);return 0<=t.cmp(this.m)&&t.isub(this.m),t._forceRed(this)},w.prototype.iadd=function(e,t){this._verify2(e,t);t=e.iadd(t);return 0<=t.cmp(this.m)&&t.isub(this.m),t},w.prototype.sub=function(e,t){this._verify2(e,t);t=e.sub(t);return t.cmpn(0)<0&&t.iadd(this.m),t._forceRed(this)},w.prototype.isub=function(e,t){this._verify2(e,t);t=e.isub(t);return t.cmpn(0)<0&&t.iadd(this.m),t},w.prototype.shl=function(e,t){return this._verify1(e),this.imod(e.ushln(t))},w.prototype.imul=function(e,t){return this._verify2(e,t),this.imod(e.imul(t))},w.prototype.mul=function(e,t){return this._verify2(e,t),this.imod(e.mul(t))},w.prototype.isqr=function(e){return this.imul(e,e.clone())},w.prototype.sqr=function(e){return this.mul(e,e)},w.prototype.sqrt=function(e){if(e.isZero())return e.clone();var t=this.m.andln(3);if(p(t%2==1),3===t){t=this.m.add(new m(1)).iushrn(2);return this.pow(e,t)}for(var i=this.m.subn(1),r=0;!i.isZero()&&0===i.andln(1);)r++,i.iushrn(1);p(!i.isZero());for(var f=new m(1).toRed(this),d=f.redNeg(),n=this.m.subn(1).iushrn(1),a=new m(2*(a=this.m.bitLength())*a).toRed(this);0!==this.pow(a,n).cmp(d);)a.redIAdd(d);for(var s=this.pow(a,i),c=this.pow(e,i.addn(1).iushrn(1)),h=this.pow(e,i),o=r;0!==h.cmp(f);){for(var u=h,b=0;0!==u.cmp(f);b++)u=u.redSqr();p(b<o);var l=this.pow(s,new m(1).iushln(o-b-1)),c=c.redMul(l),s=l.redSqr(),h=h.redMul(s),o=b}return c},w.prototype.invm=function(e){e=e._invmp(this.m);return 0!==e.negative?(e.negative=0,this.imod(e).redNeg()):this.imod(e)},w.prototype.pow=function(e,t){if(t.isZero())return new m(1).toRed(this);if(0===t.cmpn(1))return e.clone();var i=new Array(16);i[0]=new m(1).toRed(this),i[1]=e;for(var r=2;r<i.length;r++)i[r]=this.mul(i[r-1],e);var f=i[0],d=0,n=0,a=t.bitLength()%26;for(0===a&&(a=26),r=t.length-1;0<=r;r--){for(var s=t.words[r],c=a-1;0<=c;c--){var h=s>>c&1;f!==i[0]&&(f=this.sqr(f)),0!=h||0!==d?(d<<=1,d|=h,(4===++n||0===r&&0===c)&&(f=this.mul(f,i[d]),d=n=0)):n=0}a=26}return f},w.prototype.convertTo=function(e){var t=e.umod(this.m);return t===e?t.clone():t},w.prototype.convertFrom=function(e){e=e.clone();return e.red=null,e},m.mont=function(e){return new S(e)},i(S,w),S.prototype.convertTo=function(e){return this.imod(e.ushln(this.shift))},S.prototype.convertFrom=function(e){e=this.imod(e.mul(this.rinv));return e.red=null,e},S.prototype.imul=function(e,t){if(e.isZero()||t.isZero())return e.words[0]=0,e.length=1,e;e=e.imul(t),t=e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),e=e.isub(t).iushrn(this.shift),t=e;return 0<=e.cmp(this.m)?t=e.isub(this.m):e.cmpn(0)<0&&(t=e.iadd(this.m)),t._forceRed(this)},S.prototype.mul=function(e,t){if(e.isZero()||t.isZero())return new m(0)._forceRed(this);e=e.mul(t),t=e.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),e=e.isub(t).iushrn(this.shift),t=e;return 0<=e.cmp(this.m)?t=e.isub(this.m):e.cmpn(0)<0&&(t=e.iadd(this.m)),t._forceRed(this)},S.prototype.invm=function(e){return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this)}}(void 0===e||e,this)},{buffer:18}],17:[function(e,t,i){var r;function f(e){this.rand=e}if(t.exports=function(e){return(r=r||new f(null)).generate(e)},(t.exports.Rand=f).prototype.generate=function(e){return this._rand(e)},f.prototype._rand=function(e){if(this.rand.getBytes)return this.rand.getBytes(e);for(var t=new Uint8Array(e),i=0;i<t.length;i++)t[i]=this.rand.getByte();return t},"object"==typeof self)self.crypto&&self.crypto.getRandomValues?f.prototype._rand=function(e){e=new Uint8Array(e);return self.crypto.getRandomValues(e),e}:self.msCrypto&&self.msCrypto.getRandomValues?f.prototype._rand=function(e){e=new Uint8Array(e);return self.msCrypto.getRandomValues(e),e}:"object"==typeof window&&(f.prototype._rand=function(){throw new Error("Not implemented yet")});else try{var d=e("crypto");if("function"!=typeof d.randomBytes)throw new Error("Not supported");f.prototype._rand=function(e){return d.randomBytes(e)}}catch(e){}},{crypto:18}],18:[function(e,t,i){},{}],19:[function(e,t,i){i.utils=e("./hash/utils"),i.common=e("./hash/common"),i.sha=e("./hash/sha"),i.ripemd=e("./hash/ripemd"),i.hmac=e("./hash/hmac"),i.sha1=i.sha.sha1,i.sha256=i.sha.sha256,i.sha224=i.sha.sha224,i.sha384=i.sha.sha384,i.sha512=i.sha.sha512,i.ripemd160=i.ripemd.ripemd160},{"./hash/common":20,"./hash/hmac":21,"./hash/ripemd":22,"./hash/sha":23,"./hash/utils":30}],20:[function(e,t,i){"use strict";var r=e("./utils"),f=e("minimalistic-assert");function d(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}(i.BlockHash=d).prototype.update=function(e,t){if(e=r.toArray(e,t),this.pending?this.pending=this.pending.concat(e):this.pending=e,this.pendingTotal+=e.length,this.pending.length>=this._delta8){t=(e=this.pending).length%this._delta8;this.pending=e.slice(e.length-t,e.length),0===this.pending.length&&(this.pending=null),e=r.join32(e,0,e.length-t,this.endian);for(var i=0;i<e.length;i+=this._delta32)this._update(e,i,i+this._delta32)}return this},d.prototype.digest=function(e){return this.update(this._pad()),f(null===this.pending),this._digest(e)},d.prototype._pad=function(){var e=this.pendingTotal,t=this._delta8,i=t-(e+this.padLength)%t,r=new Array(i+this.padLength);r[0]=128;for(var f=1;f<i;f++)r[f]=0;if(e<<=3,"big"===this.endian){for(var d=8;d<this.padLength;d++)r[f++]=0;r[f++]=0,r[f++]=0,r[f++]=0,r[f++]=0,r[f++]=e>>>24&255,r[f++]=e>>>16&255,r[f++]=e>>>8&255,r[f++]=255&e}else for(r[f++]=255&e,r[f++]=e>>>8&255,r[f++]=e>>>16&255,r[f++]=e>>>24&255,r[f++]=0,r[f++]=0,r[f++]=0,r[f++]=0,d=8;d<this.padLength;d++)r[f++]=0;return r}},{"./utils":30,"minimalistic-assert":33}],21:[function(e,t,i){"use strict";var r=e("./utils"),f=e("minimalistic-assert");function d(e,t,i){if(!(this instanceof d))return new d(e,t,i);this.Hash=e,this.blockSize=e.blockSize/8,this.outSize=e.outSize/8,this.inner=null,this.outer=null,this._init(r.toArray(t,i))}(t.exports=d).prototype._init=function(e){e.length>this.blockSize&&(e=(new this.Hash).update(e).digest()),f(e.length<=this.blockSize);for(var t=e.length;t<this.blockSize;t++)e.push(0);for(t=0;t<e.length;t++)e[t]^=54;for(this.inner=(new this.Hash).update(e),t=0;t<e.length;t++)e[t]^=106;this.outer=(new this.Hash).update(e)},d.prototype.update=function(e,t){return this.inner.update(e,t),this},d.prototype.digest=function(e){return this.outer.update(this.inner.digest()),this.outer.digest(e)}},{"./utils":30,"minimalistic-assert":33}],22:[function(e,t,i){"use strict";var r=e("./utils"),e=e("./common"),p=r.rotl32,m=r.sum32,v=r.sum32_3,g=r.sum32_4,f=e.BlockHash;function d(){if(!(this instanceof d))return new d;f.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.endian="little"}function y(e,t,i,r){return e<=15?t^i^r:e<=31?t&i|~t&r:e<=47?(t|~i)^r:e<=63?t&r|i&~r:t^(i|~r)}r.inherits(d,f),(i.ripemd160=d).blockSize=512,d.outSize=160,d.hmacStrength=192,d.padLength=64,d.prototype._update=function(e,t){for(var i,r=h=this.h[0],f=l=this.h[1],d=b=this.h[2],n=u=this.h[3],a=o=this.h[4],s=0;s<80;s++)var c=m(p(g(h,y(s,l,b,u),e[M[s]+t],(i=s)<=15?0:i<=31?1518500249:i<=47?1859775393:i<=63?2400959708:2840853838),S[s]),o),h=o,o=u,u=p(b,10),b=l,l=c,c=m(p(g(r,y(79-s,f,d,n),e[w[s]+t],(i=s)<=15?1352829926:i<=31?1548603684:i<=47?1836072691:i<=63?2053994217:0),_[s]),a),r=a,a=n,n=p(d,10),d=f,f=c;c=v(this.h[1],b,n),this.h[1]=v(this.h[2],u,a),this.h[2]=v(this.h[3],o,r),this.h[3]=v(this.h[4],h,f),this.h[4]=v(this.h[0],l,d),this.h[0]=c},d.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h,"little"):r.split32(this.h,"little")};var M=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],w=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],S=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],_=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]},{"./common":20,"./utils":30}],23:[function(e,t,i){"use strict";i.sha1=e("./sha/1"),i.sha224=e("./sha/224"),i.sha256=e("./sha/256"),i.sha384=e("./sha/384"),i.sha512=e("./sha/512")},{"./sha/1":24,"./sha/224":25,"./sha/256":26,"./sha/384":27,"./sha/512":28}],24:[function(e,t,i){"use strict";var r=e("../utils"),f=e("../common"),e=e("./common"),h=r.rotl32,o=r.sum32,u=r.sum32_5,b=e.ft_1,d=f.BlockHash,l=[1518500249,1859775393,2400959708,3395469782];function n(){if(!(this instanceof n))return new n;d.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.W=new Array(80)}r.inherits(n,d),(t.exports=n).blockSize=512,n.outSize=160,n.hmacStrength=80,n.padLength=64,n.prototype._update=function(e,t){for(var i=this.W,r=0;r<16;r++)i[r]=e[t+r];for(;r<i.length;r++)i[r]=h(i[r-3]^i[r-8]^i[r-14]^i[r-16],1);for(var f=this.h[0],d=this.h[1],n=this.h[2],a=this.h[3],s=this.h[4],r=0;r<i.length;r++)var c=~~(r/20),c=u(h(f,5),b(c,d,n,a),s,i[r],l[c]),s=a,a=n,n=h(d,30),d=f,f=c;this.h[0]=o(this.h[0],f),this.h[1]=o(this.h[1],d),this.h[2]=o(this.h[2],n),this.h[3]=o(this.h[3],a),this.h[4]=o(this.h[4],s)},n.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h,"big"):r.split32(this.h,"big")}},{"../common":20,"../utils":30,"./common":29}],25:[function(e,t,i){"use strict";var r=e("../utils"),f=e("./256");function d(){if(!(this instanceof d))return new d;f.call(this),this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]}r.inherits(d,f),(t.exports=d).blockSize=512,d.outSize=224,d.hmacStrength=192,d.padLength=64,d.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h.slice(0,7),"big"):r.split32(this.h.slice(0,7),"big")}},{"../utils":30,"./256":26}],26:[function(e,t,i){"use strict";var r=e("../utils"),f=e("../common"),d=e("./common"),l=e("minimalistic-assert"),p=r.sum32,m=r.sum32_4,v=r.sum32_5,g=d.ch32,y=d.maj32,M=d.s0_256,w=d.s1_256,S=d.g0_256,_=d.g1_256,n=f.BlockHash,a=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function s(){if(!(this instanceof s))return new s;n.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=a,this.W=new Array(64)}r.inherits(s,n),(t.exports=s).blockSize=512,s.outSize=256,s.hmacStrength=192,s.padLength=64,s.prototype._update=function(e,t){for(var i=this.W,r=0;r<16;r++)i[r]=e[t+r];for(;r<i.length;r++)i[r]=m(_(i[r-2]),i[r-7],S(i[r-15]),i[r-16]);var f=this.h[0],d=this.h[1],n=this.h[2],a=this.h[3],s=this.h[4],c=this.h[5],h=this.h[6],o=this.h[7];for(l(this.k.length===i.length),r=0;r<i.length;r++)var u=v(o,w(s),g(s,c,h),this.k[r],i[r]),b=p(M(f),y(f,d,n)),o=h,h=c,c=s,s=p(a,u),a=n,n=d,d=f,f=p(u,b);this.h[0]=p(this.h[0],f),this.h[1]=p(this.h[1],d),this.h[2]=p(this.h[2],n),this.h[3]=p(this.h[3],a),this.h[4]=p(this.h[4],s),this.h[5]=p(this.h[5],c),this.h[6]=p(this.h[6],h),this.h[7]=p(this.h[7],o)},s.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h,"big"):r.split32(this.h,"big")}},{"../common":20,"../utils":30,"./common":29,"minimalistic-assert":33}],27:[function(e,t,i){"use strict";var r=e("../utils"),f=e("./512");function d(){if(!(this instanceof d))return new d;f.call(this),this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]}r.inherits(d,f),(t.exports=d).blockSize=1024,d.outSize=384,d.hmacStrength=192,d.padLength=128,d.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h.slice(0,12),"big"):r.split32(this.h.slice(0,12),"big")}},{"../utils":30,"./512":28}],28:[function(e,t,i){"use strict";var r=e("../utils"),f=e("../common"),P=e("minimalistic-assert"),j=r.rotr64_hi,N=r.rotr64_lo,u=r.shr64_hi,b=r.shr64_lo,E=r.sum64,B=r.sum64_hi,L=r.sum64_lo,l=r.sum64_4_hi,p=r.sum64_4_lo,O=r.sum64_5_hi,F=r.sum64_5_lo,d=f.BlockHash,n=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function a(){if(!(this instanceof a))return new a;d.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=n,this.W=new Array(160)}r.inherits(a,d),(t.exports=a).blockSize=1024,a.outSize=512,a.hmacStrength=192,a.padLength=128,a.prototype._prepareBlock=function(e,t){for(var i=this.W,r=0;r<32;r++)i[r]=e[t+r];for(;r<i.length;r+=2){var f=function(e,t){var i=j(e,t,19),r=j(t,e,29),t=u(e,t,6),t=i^r^t;t<0&&(t+=4294967296);return t}(i[r-4],i[r-3]),d=function(e,t){var i=N(e,t,19),r=N(t,e,29),t=b(e,t,6),t=i^r^t;t<0&&(t+=4294967296);return t}(i[r-4],i[r-3]),n=i[r-14],a=i[r-13],s=function(e,t){var i=j(e,t,1),r=j(e,t,8),t=u(e,t,7),t=i^r^t;t<0&&(t+=4294967296);return t}(i[r-30],i[r-29]),c=function(e,t){var i=N(e,t,1),r=N(e,t,8),t=b(e,t,7),t=i^r^t;t<0&&(t+=4294967296);return t}(i[r-30],i[r-29]),h=i[r-32],o=i[r-31];i[r]=l(f,d,n,a,s,c,h,o),i[r+1]=p(f,d,n,a,s,c,h,o)}},a.prototype._update=function(e,t){this._prepareBlock(e,t);var i=this.W,r=this.h[0],f=this.h[1],d=this.h[2],n=this.h[3],a=this.h[4],s=this.h[5],c=this.h[6],h=this.h[7],o=this.h[8],u=this.h[9],b=this.h[10],l=this.h[11],p=this.h[12],m=this.h[13],v=this.h[14],g=this.h[15];P(this.k.length===i.length);for(var y=0;y<i.length;y+=2)var M=v,w=g,S=function(e,t){var i=j(e,t,14),r=j(e,t,18),e=j(t,e,9),e=i^r^e;e<0&&(e+=4294967296);return e}(o,u),_=function(e,t){var i=N(e,t,14),r=N(e,t,18),e=N(t,e,9),e=i^r^e;e<0&&(e+=4294967296);return e}(o,u),A=function(e,t,i){i=e&t^~e&i;i<0&&(i+=4294967296);return i}(o,b,p),x=function(e,t,i){i=e&t^~e&i;i<0&&(i+=4294967296);return i}(u,l,m),I=this.k[y],z=this.k[y+1],q=i[y],R=i[y+1],k=O(M,w,S,_,A,x,I,z,q,R),q=F(M,w,S,_,A,x,I,z,q,R),M=function(e,t){var i=j(e,t,28),r=j(t,e,2),e=j(t,e,7),e=i^r^e;e<0&&(e+=4294967296);return e}(r,f),w=function(e,t){var i=N(e,t,28),r=N(t,e,2),e=N(t,e,7),e=i^r^e;e<0&&(e+=4294967296);return e}(r,f),S=function(e,t,i){i=e&t^e&i^t&i;i<0&&(i+=4294967296);return i}(r,d,a),_=function(e,t,i){i=e&t^e&i^t&i;i<0&&(i+=4294967296);return i}(f,n,s),R=B(M,w,S,_),_=L(M,w,S,_),v=p,g=m,p=b,m=l,b=o,l=u,o=B(c,h,k,q),u=L(h,h,k,q),c=a,h=s,a=d,s=n,d=r,n=f,r=B(k,q,R,_),f=L(k,q,R,_);E(this.h,0,r,f),E(this.h,2,d,n),E(this.h,4,a,s),E(this.h,6,c,h),E(this.h,8,o,u),E(this.h,10,b,l),E(this.h,12,p,m),E(this.h,14,v,g)},a.prototype._digest=function(e){return"hex"===e?r.toHex32(this.h,"big"):r.split32(this.h,"big")}},{"../common":20,"../utils":30,"minimalistic-assert":33}],29:[function(e,t,i){"use strict";var r=e("../utils").rotr32;function f(e,t,i){return e&t^~e&i}function d(e,t,i){return e&t^e&i^t&i}function n(e,t,i){return e^t^i}i.ft_1=function(e,t,i,r){return 0===e?f(t,i,r):1===e||3===e?t^i^r:2===e?d(t,i,r):void 0},i.ch32=f,i.maj32=d,i.p32=n,i.s0_256=function(e){return r(e,2)^r(e,13)^r(e,22)},i.s1_256=function(e){return r(e,6)^r(e,11)^r(e,25)},i.g0_256=function(e){return r(e,7)^r(e,18)^e>>>3},i.g1_256=function(e){return r(e,17)^r(e,19)^e>>>10}},{"../utils":30}],30:[function(e,t,i){"use strict";var s=e("minimalistic-assert"),e=e("inherits");function d(e){return(e>>>24|e>>>8&65280|e<<8&16711680|(255&e)<<24)>>>0}function r(e){return 1===e.length?"0"+e:e}function n(e){return 7===e.length?"0"+e:6===e.length?"00"+e:5===e.length?"000"+e:4===e.length?"0000"+e:3===e.length?"00000"+e:2===e.length?"000000"+e:1===e.length?"0000000"+e:e}i.inherits=e,i.toArray=function(e,t){if(Array.isArray(e))return e.slice();if(!e)return[];var i,r,f=[];if("string"==typeof e)if(t){if("hex"===t)for((e=e.replace(/[^a-z0-9]+/gi,"")).length%2!=0&&(e="0"+e),n=0;n<e.length;n+=2)f.push(parseInt(e[n]+e[n+1],16))}else for(var d=0,n=0;n<e.length;n++){var a=e.charCodeAt(n);a<128?f[d++]=a:a<2048?(f[d++]=a>>6|192,f[d++]=63&a|128):(r=n,55296!=(64512&(i=e).charCodeAt(r))||r<0||r+1>=i.length||56320!=(64512&i.charCodeAt(r+1))?f[d++]=a>>12|224:(a=65536+((1023&a)<<10)+(1023&e.charCodeAt(++n)),f[d++]=a>>18|240,f[d++]=a>>12&63|128),f[d++]=a>>6&63|128,f[d++]=63&a|128)}else for(n=0;n<e.length;n++)f[n]=0|e[n];return f},i.toHex=function(e){for(var t="",i=0;i<e.length;i++)t+=r(e[i].toString(16));return t},i.htonl=d,i.toHex32=function(e,t){for(var i="",r=0;r<e.length;r++){var f=e[r];i+=n((f="little"===t?d(f):f).toString(16))}return i},i.zero2=r,i.zero8=n,i.join32=function(e,t,i,r){s((i-=t)%4==0);for(var f=new Array(i/4),d=0,n=t;d<f.length;d++,n+=4){var a="big"===r?e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3]:e[n+3]<<24|e[n+2]<<16|e[n+1]<<8|e[n];f[d]=a>>>0}return f},i.split32=function(e,t){for(var i=new Array(4*e.length),r=0,f=0;r<e.length;r++,f+=4){var d=e[r];"big"===t?(i[f]=d>>>24,i[f+1]=d>>>16&255,i[f+2]=d>>>8&255,i[f+3]=255&d):(i[f+3]=d>>>24,i[f+2]=d>>>16&255,i[f+1]=d>>>8&255,i[f]=255&d)}return i},i.rotr32=function(e,t){return e>>>t|e<<32-t},i.rotl32=function(e,t){return e<<t|e>>>32-t},i.sum32=function(e,t){return e+t>>>0},i.sum32_3=function(e,t,i){return e+t+i>>>0},i.sum32_4=function(e,t,i,r){return e+t+i+r>>>0},i.sum32_5=function(e,t,i,r,f){return e+t+i+r+f>>>0},i.sum64=function(e,t,i,r){var f=e[t],d=r+e[t+1]>>>0,f=(d<r?1:0)+i+f;e[t]=f>>>0,e[t+1]=d},i.sum64_hi=function(e,t,i,r){return(t+r>>>0<t?1:0)+e+i>>>0},i.sum64_lo=function(e,t,i,r){return t+r>>>0},i.sum64_4_hi=function(e,t,i,r,f,d,n,a){var s=0,c=t;return s+=(c=c+r>>>0)<t?1:0,s+=(c=c+d>>>0)<d?1:0,e+i+f+n+(s+=(c=c+a>>>0)<a?1:0)>>>0},i.sum64_4_lo=function(e,t,i,r,f,d,n,a){return t+r+d+a>>>0},i.sum64_5_hi=function(e,t,i,r,f,d,n,a,s,c){var h=0,o=t;return h+=(o=o+r>>>0)<t?1:0,h+=(o=o+d>>>0)<d?1:0,h+=(o=o+a>>>0)<a?1:0,e+i+f+n+s+(h+=(o=o+c>>>0)<c?1:0)>>>0},i.sum64_5_lo=function(e,t,i,r,f,d,n,a,s,c){return t+r+d+a+c>>>0},i.rotr64_hi=function(e,t,i){return(t<<32-i|e>>>i)>>>0},i.rotr64_lo=function(e,t,i){return(e<<32-i|t>>>i)>>>0},i.shr64_hi=function(e,t,i){return e>>>i},i.shr64_lo=function(e,t,i){return(e<<32-i|t>>>i)>>>0}},{inherits:32,"minimalistic-assert":33}],31:[function(e,t,i){"use strict";var r=e("hash.js"),d=e("minimalistic-crypto-utils"),f=e("minimalistic-assert");function n(e){if(!(this instanceof n))return new n(e);this.hash=e.hash,this.predResist=!!e.predResist,this.outLen=this.hash.outSize,this.minEntropy=e.minEntropy||this.hash.hmacStrength,this._reseed=null,this.reseedInterval=null,this.K=null,this.V=null;var t=d.toArray(e.entropy,e.entropyEnc||"hex"),i=d.toArray(e.nonce,e.nonceEnc||"hex"),e=d.toArray(e.pers,e.persEnc||"hex");f(t.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._init(t,i,e)}(t.exports=n).prototype._init=function(e,t,i){i=e.concat(t).concat(i);this.K=new Array(this.outLen/8),this.V=new Array(this.outLen/8);for(var r=0;r<this.V.length;r++)this.K[r]=0,this.V[r]=1;this._update(i),this._reseed=1,this.reseedInterval=281474976710656},n.prototype._hmac=function(){return new r.hmac(this.hash,this.K)},n.prototype._update=function(e){var t=this._hmac().update(this.V).update([0]);e&&(t=t.update(e)),this.K=t.digest(),this.V=this._hmac().update(this.V).digest(),e&&(this.K=this._hmac().update(this.V).update([1]).update(e).digest(),this.V=this._hmac().update(this.V).digest())},n.prototype.reseed=function(e,t,i,r){"string"!=typeof t&&(r=i,i=t,t=null),e=d.toArray(e,t),i=d.toArray(i,r),f(e.length>=this.minEntropy/8,"Not enough entropy. Minimum is: "+this.minEntropy+" bits"),this._update(e.concat(i||[])),this._reseed=1},n.prototype.generate=function(e,t,i,r){if(this._reseed>this.reseedInterval)throw new Error("Reseed is required");"string"!=typeof t&&(r=i,i=t,t=null),i&&(i=d.toArray(i,r||"hex"),this._update(i));for(var f=[];f.length<e;)this.V=this._hmac().update(this.V).digest(),f=f.concat(this.V);r=f.slice(0,e);return this._update(i),this._reseed++,d.encode(r,t)}},{"hash.js":19,"minimalistic-assert":33,"minimalistic-crypto-utils":34}],32:[function(e,t,i){"function"==typeof Object.create?t.exports=function(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}))}:t.exports=function(e,t){var i;t&&(e.super_=t,(i=function(){}).prototype=t.prototype,e.prototype=new i,e.prototype.constructor=e)}},{}],33:[function(e,t,i){function r(e,t){if(!e)throw new Error(t||"Assertion failed")}(t.exports=r).equal=function(e,t,i){if(e!=t)throw new Error(i||"Assertion failed: "+e+" != "+t)}},{}],34:[function(e,t,i){"use strict";function r(e){return 1===e.length?"0"+e:e}function f(e){for(var t="",i=0;i<e.length;i++)t+=r(e[i].toString(16));return t}i.toArray=function(e,t){if(Array.isArray(e))return e.slice();if(!e)return[];var i=[];if("string"!=typeof e){for(var r=0;r<e.length;r++)i[r]=0|e[r];return i}if("hex"===t){(e=e.replace(/[^a-z0-9]+/gi,"")).length%2!=0&&(e="0"+e);for(r=0;r<e.length;r+=2)i.push(parseInt(e[r]+e[r+1],16))}else for(r=0;r<e.length;r++){var f=e.charCodeAt(r),d=f>>8,f=255&f;d?i.push(d,f):i.push(f)}return i},i.zero2=r,i.toHex=f,i.encode=function(e,t){return"hex"===t?f(e):e}},{}],35:[function(e,t,i){t.exports={name:"elliptic",version:"6.5.4",description:"EC cryptography",main:"lib/elliptic.js",files:["lib"],scripts:{lint:"eslint lib test","lint:fix":"npm run lint -- --fix",unit:"istanbul test _mocha --reporter=spec test/index.js",test:"npm run lint && npm run unit",version:"grunt dist && git add dist/"},repository:{type:"git",url:"git@github.com:indutny/elliptic"},keywords:["EC","Elliptic","curve","Cryptography"],author:"Fedor Indutny <fedor@indutny.com>",license:"MIT",bugs:{url:"https://github.com/indutny/elliptic/issues"},homepage:"https://github.com/indutny/elliptic",devDependencies:{brfs:"^2.0.2",coveralls:"^3.1.0",eslint:"^7.6.0",grunt:"^1.2.1","grunt-browserify":"^5.3.0","grunt-cli":"^1.3.2","grunt-contrib-connect":"^3.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^5.0.0","grunt-mocha-istanbul":"^5.0.2","grunt-saucelabs":"^9.0.1",istanbul:"^0.4.5",mocha:"^8.0.1"},dependencies:{"bn.js":"^4.11.9",brorand:"^1.1.0","hash.js":"^1.0.0","hmac-drbg":"^1.0.1",inherits:"^2.0.4","minimalistic-assert":"^1.0.1","minimalistic-crypto-utils":"^1.0.1"}}},{}]},{},[1])(1)});
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
(function (global,Buffer,setImmediate){(function (){
/*!

JSZip v3.6.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=e()}}(function(){return function s(a,o,u){function h(r,e){if(!o[r]){if(!a[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(f)return f(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return h(t||e)},i,i.exports,s,a,o,u)}return o[r].exports}for(var f="function"==typeof require&&require,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(l,t,n){(function(r){!function(e){"object"==typeof n&&void 0!==t?t.exports=e():("undefined"!=typeof window?window:void 0!==r?r:"undefined"!=typeof self?self:this).JSZip=e()}(function(){return function s(a,o,u){function h(t,e){if(!o[t]){if(!a[t]){var r="function"==typeof l&&l;if(!e&&r)return r(t,!0);if(f)return f(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[t]={exports:{}};a[t][0].call(i.exports,function(e){return h(a[t][1][e]||e)},i,i.exports,s,a,o,u)}return o[t].exports}for(var f="function"==typeof l&&l,e=0;e<u.length;e++)h(u[e]);return h}({1:[function(e,t,r){"use strict";var c=e("./utils"),l=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,u=[],h=0,f=e.length,l=f,d="string"!==c.getTypeOf(e);h<e.length;)l=f-h,n=d?(t=e[h++],r=h<f?e[h++]:0,h<f?e[h++]:0):(t=e.charCodeAt(h++),r=h<f?e.charCodeAt(h++):0,h<f?e.charCodeAt(h++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<l?(15&r)<<2|n>>6:64,o=2<l?63&n:64,u.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return u.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,u=0;if("data:"===e.substr(0,"data:".length))throw new Error("Invalid base64 input, it looks like a data url.");var h,f=3*(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(h=l.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),h[u++]=t,64!==s&&(h[u++]=r),64!==a&&(h[u++]=n);return h}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(e){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils"),a=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t[s])];return-1^e}(0|t,e,e.length):function(e,t,r){var n=a,i=0+r;e^=-1;for(var s=0;s<i;s++)e=e>>>8^n[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function u(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",s.inherits(u,a),u.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},u.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},u.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},u.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new u("Deflate",e)},r.uncompressWorker=function(){return new u("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function I(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function i(e,t,r,n,i,s){var a,o,u=e.file,h=e.compression,f=s!==B.utf8encode,l=O.transformTo("string",s(u.name)),d=O.transformTo("string",B.utf8encode(u.name)),c=u.comment,p=O.transformTo("string",s(c)),m=O.transformTo("string",B.utf8encode(c)),_=d.length!==u.name.length,g=m.length!==c.length,v="",b="",w="",y=u.dir,k=u.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),f||!_&&!g||(S|=2048);var z,E=0,C=0;y&&(E|=16),"UNIX"===i?(C=798,E|=((z=u.unixPermissions)||(z=y?16893:33204),(65535&z)<<16)):(C=20,E|=63&(u.dosPermissions||0)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v+="up"+I((b=I(1,1)+I(T(l),4)+d).length,2)+b),g&&(v+="uc"+I((w=I(1,1)+I(T(p),4)+m).length,2)+w);var A="";return A+="\n\0",A+=I(S,2),A+=h.magic,A+=I(a,2),A+=I(o,2),A+=I(x.crc32,4),A+=I(x.compressedSize,4),A+=I(x.uncompressedSize,4),A+=I(l.length,2),A+=I(v.length,2),{fileRecord:R.LOCAL_FILE_HEADER+A+l+v,dirRecord:R.CENTRAL_FILE_HEADER+I(C,2)+A+I(p.length,2)+"\0\0\0\0"+I(E,4)+I(n,4)+l+v+p}}var O=e("../utils"),s=e("../stream/GenericWorker"),B=e("../utf8"),T=e("../crc32"),R=e("../signature");function n(e,t,r,n){s.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}O.inherits(n,s),n.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,s.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},n.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},n.prototype.closedSource=function(e){this.accumulate=!1;var t,r=this.streamFiles&&!e.file.dir,n=i(e,r,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),r)this.push({data:(t=e,R.DATA_DESCRIPTOR+I(t.crc32,4)+I(t.compressedSize,4)+I(t.uncompressedSize,4)),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},n.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r,n,i,s,a,o,u=this.bytesWritten-e,h=(r=this.dirRecords.length,n=u,i=e,s=this.zipComment,a=this.encodeFileName,o=O.transformTo("string",a(s)),R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+I(r,2)+I(r,2)+I(n,4)+I(i,4)+I(o.length,2)+o);this.push({data:h,meta:{percent:100}})},n.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},n.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},n.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},n.prototype.error=function(e){var t=this._sources;if(!s.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},n.prototype.lock=function(){s.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=n},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var h=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),u=0;try{e.forEach(function(e,t){u++;var r=function(e,t){var r=e||t,n=h[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=u}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.5.0",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var n=e("./utils"),i=e("./external"),o=e("./utf8"),u=e("./zipEntries"),s=e("./stream/Crc32Probe"),h=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new s);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,s){var a=this;return s=n.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),h.isNode&&h.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",e,!0,s.optimizedBinaryString,s.base64).then(function(e){var t=new u(s);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(s.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n];a.file(i.fileNameStr,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:s.createFolders})}return t.zipComment.length&&(a.comment=t.zipComment),a})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=f.getTypeOf(t),s=f.extend(r||{},d);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(n=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""}(e))&&g.call(this,n,!0);var a,o="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!o),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string"),a=t instanceof c||t instanceof l?t:m.isNode&&m.isStream(t)?new _(e,t):f.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var u=new p(e,a,s);this.files[e]=u}function h(e){return"/"!==e.slice(-1)&&(e+="/"),e}var i=e("./utf8"),f=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),d=e("./defaults"),c=e("./compressedObject"),p=e("./zipObject"),o=e("./generate"),m=e("./nodejsUtils"),_=e("./nodejs/NodejsStreamInputAdapter"),g=function(e,t){return t=void 0!==t?t:d.createFolders,e=h(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function u(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)this.files.hasOwnProperty(t)&&(n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n))},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(u(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(u(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=g.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(e){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=f.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");f.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(e){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(e){},lastIndexOfSignature:function(e){},readAndCheckSignature:function(e){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),u=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new u(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),f=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function u(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}u.prototype={accumulate:function(e){return o=this,u=e,new a.Promise(function(t,r){var n=[],i=o._internalType,s=o._outputType,a=o._mimeType;o.on("data",function(e,t){n.push(e),u&&u(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return f.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()});var o,u},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=u},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),u=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),h=new Array(256),i=0;i<256;i++)h[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function f(){n.call(this,"utf-8 encode")}h[254]=h[254]=1,s.utf8encode=function(e){return u.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=u.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return u.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=h[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(u.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(u.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(u.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t}(t),i=t;n!==t.length&&(u.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(f,n),f.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,o){"use strict";var u=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),n=e("set-immediate-shim"),f=e("./external");function i(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}o.newBlob=function(t,r){o.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return u.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return u.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function a(e){var t=65536,r=o.getTypeOf(e),n=!0;if("uint8array"===r?n=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=s.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return s.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return s.stringifyByChar(e)}function d(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}o.applyFromCharCode=a;var c={};c.string={string:i,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:a,array:i,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return a(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:i,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:i,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:a,array:function(e){return d(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:i},o.transformTo=function(e,t){if(t=t||"",!e)return t;o.checkSupport(e);var r=o.getTypeOf(t);return c[r][e](t)},o.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":u.nodebuffer&&r.isBuffer(e)?"nodebuffer":u.uint8array&&e instanceof Uint8Array?"uint8array":u.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},o.checkSupport=function(e){if(!u[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},o.MAX_VALUE_16BITS=65535,o.MAX_VALUE_32BITS=-1,o.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},o.delay=function(e,t,r){n(function(){e.apply(r||null,t||[])})},o.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},o.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])arguments[e].hasOwnProperty(t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},o.prepareContent=function(n,e,i,s,a){return f.Promise.resolve(e).then(function(n){return u.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new f.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):n}).then(function(e){var t,r=o.getTypeOf(e);return r?("arraybuffer"===r?e=o.transformTo("uint8array",e):"string"===r&&(a?e=h.decode(e):i&&!0!==s&&(e=l(t=e,u.uint8array?new Uint8Array(t.length):new Array(t.length)))),e):f.Promise.reject(new Error("Can't read the data of '"+n+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=(e("./utf8"),e("./support"));function u(e){this.files=[],this.loadOptions=e}u.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=u},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),u=e("./compressions"),h=e("./support");function f(e,t){this.options=e,this.loadOptions=t}f.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in u)if(u.hasOwnProperty(t)&&u[t].magic===e)return u[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(e){if(this.extraFields[1]){var t=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=t.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=t.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=t.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=t.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),u=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new u("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof u?this._data:new i(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<h.length;l++)n.prototype[h[l]]=f;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,f,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(h),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){h(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(h,0)};else{var o=new t.MessageChannel;o.port1.onmessage=h,r=function(){o.port2.postMessage(0)}}var u=[];function h(){var e,t;n=!0;for(var r=u.length;r;){for(t=u,u=[],e=-1;++e<r;)t[e]();r=u.length}n=!1}f.exports=function(e){1!==u.push(e)||n||r()}}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function h(){}var f={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==h&&c(this,e)}function u(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function l(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return f.reject(t,e)}e===t?f.reject(t,new TypeError("Cannot resolve promise with itself")):f.resolve(t,e)})}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function c(t,e){var r=!1;function n(e){r||(r=!0,f.reject(t,e))}function i(e){r||(r=!0,f.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(h);return this.state!==n?l(r,this.state===a?e:t,this.outcome):this.queue.push(new u(r,e,t)),r},u.prototype.callFulfilled=function(e){f.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){f.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},f.resolve=function(e,t){var r=p(d,t);if("error"===r.status)return f.reject(e,r.value);var n=r.value;if(n)c(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},f.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){return e instanceof this?e:f.resolve(new this(h),e)},o.reject=function(e){var t=new this(h);return f.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);for(var s=new Array(n),a=0,t=-1,o=new this(h);++t<n;)u(e[t],t);return o;function u(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,f.resolve(o,s))},function(e){i||(i=!0,f.reject(o,e))})}},o.race=function(e){if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,r=!1;if(!t)return this.resolve([]);for(var n,i=-1,s=new this(h);++i<t;)n=e[i],this.resolve(n).then(function(e){r||(r=!0,f.resolve(s,e))},function(e){r||(r=!0,f.reject(s,e))});return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),u=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),h=Object.prototype.toString,f=0,l=-1,d=0,c=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:l,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==f)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?u.string2buf(t.dictionary):"[object ArrayBuffer]"===h.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==f)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=u.string2buf(e):"[object ArrayBuffer]"===h.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==f)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(u.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===f):2!==n||(this.onEnd(f),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===f&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var d=e("./zlib/inflate"),c=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,u=this.strm,h=this.options.chunkSize,f=this.options.dictionary,l=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?u.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?u.input=new Uint8Array(e):u.input=e,u.next_in=0,u.avail_in=u.input.length;do{if(0===u.avail_out&&(u.output=new c.Buf8(h),u.next_out=0,u.avail_out=h),(r=d.inflate(u,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&f&&(o="string"==typeof f?p.string2buf(f):"[object ArrayBuffer]"===_.call(f)?new Uint8Array(f):f,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===l&&(r=m.Z_OK,l=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);u.next_out&&(0!==u.avail_out&&r!==m.Z_STREAM_END&&(0!==u.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(u.output,u.next_out),s=u.next_out-i,a=p.buf2string(u.output,i),u.next_out=s,u.avail_out=h-s,s&&c.arraySet(u.output,u.output,i,s,0),this.onData(a)):this.onData(c.shrinkBuf(u.output,u.next_out)))),0===u.avail_in&&0===u.avail_out&&(l=!0)}while((0<u.avail_in||0===u.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(u.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var u=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var h=new u.Buf8(256),n=0;n<256;n++)h[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function f(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,u.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}h[254]=h[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new u.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return f(e,e.length)},r.binstring2buf=function(e){for(var t=new u.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=h[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return f(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+h[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var u,d=e("../utils/common"),h=e("./trees"),c=e("./adler32"),p=e("./crc32"),n=e("./messages"),f=0,l=0,m=-2,i=2,_=8,s=286,a=30,o=19,g=2*s+1,v=15,b=3,w=258,y=w+b+1,k=42,x=113;function S(e,t){return e.msg=n[t],t}function z(e){return(e<<1)-(4<e?9:0)}function E(e){for(var t=e.length;0<=--t;)e[t]=0}function C(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(d.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function A(e,t){h._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,C(e.strm)}function I(e,t){e.pending_buf[e.pending++]=t}function O(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function B(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,u=e.strstart>e.w_size-y?e.strstart-(e.w_size-y):0,h=e.window,f=e.w_mask,l=e.prev,d=e.strstart+w,c=h[s+a-1],p=h[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(h[(r=t)+a]===p&&h[r+a-1]===c&&h[r]===h[s]&&h[++r]===h[s+1]){s+=2,r++;do{}while(h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&h[++s]===h[++r]&&s<d);if(n=w-(d-s),s=d-w,a<n){if(e.match_start=t,o<=(a=n))break;c=h[s+a-1],p=h[s+a]}}}while((t=l[t&f])>u&&0!=--i);return a<=e.lookahead?a:e.lookahead}function T(e){var t,r,n,i,s,a,o,u,h,f,l=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=l+(l-y)){for(d.arraySet(e.window,e.window,l,l,0),e.match_start-=l,e.strstart-=l,e.block_start-=l,t=r=e.hash_size;n=e.head[--t],e.head[t]=l<=n?n-l:0,--r;);for(t=r=l;n=e.prev[--t],e.prev[t]=l<=n?n-l:0,--r;);i+=l}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,u=e.strstart+e.lookahead,f=void 0,(h=i)<(f=a.avail_in)&&(f=h),r=0===f?0:(a.avail_in-=f,d.arraySet(o,a.input,a.next_in,f,u),1===a.state.wrap?a.adler=c(a.adler,o,f,u):2===a.state.wrap&&(a.adler=p(a.adler,o,f,u)),a.next_in+=f,a.total_in+=f,f),e.lookahead+=r,e.lookahead+e.insert>=b)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+b-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<b)););}while(e.lookahead<y&&0!==e.strm.avail_in)}function R(e,t){for(var r,n;;){if(e.lookahead<y){if(T(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r)),e.match_length>=b)if(n=h._tr_tally(e,e.strstart-e.match_start,e.match_length-b),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=b){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function D(e,t){for(var r,n,i;;){if(e.lookahead<y){if(T(e),e.lookahead<y&&t===f)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=b-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-y&&(e.match_length=B(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===b&&4096<e.strstart-e.match_start)&&(e.match_length=b-1)),e.prev_length>=b&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-b,n=h._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-b),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+b-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=b-1,e.strstart++,n&&(A(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if((n=h._tr_tally(e,0,e.window[e.strstart-1]))&&A(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=h._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<b-1?e.strstart:b-1,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}function F(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function N(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*g),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),E(this.dyn_ltree),E(this.dyn_dtree),E(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(v+1),this.heap=new d.Buf16(2*s+1),E(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),E(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function U(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?k:x,e.adler=2===t.wrap?0:1,t.last_flush=f,h._tr_init(t),l):S(e,m)}function P(e){var t,r=U(e);return r===l&&((t=e.state).window_size=2*t.w_size,E(t.head),t.max_lazy_match=u[t.level].max_lazy,t.good_match=u[t.level].good_length,t.nice_match=u[t.level].nice_length,t.max_chain_length=u[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=b-1,t.match_available=0,t.ins_h=0),r}function L(e,t,r,n,i,s){if(!e)return m;var a=1;if(-1===t&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||9<i||r!==_||n<8||15<n||t<0||9<t||s<0||4<s)return S(e,m);8===n&&(n=9);var o=new N;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+b-1)/b),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,P(e)}u=[new F(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(T(e),0===e.lookahead&&t===f)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,A(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-y&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(A(e,!1),e.strm.avail_out),1)}),new F(4,4,8,4,R),new F(4,5,16,8,R),new F(4,6,32,32,R),new F(4,4,16,16,D),new F(8,16,32,32,D),new F(8,16,128,128,D),new F(8,32,128,256,D),new F(32,128,258,1024,D),new F(32,258,258,4096,D)],r.deflateInit=function(e,t){return L(e,t,_,15,8,0)},r.deflateInit2=L,r.deflateReset=P,r.deflateResetKeep=U,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?m:(e.state.gzhead=t,l):m},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?S(e,m):m;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&4!==t)return S(e,0===e.avail_out?-5:m);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===k)if(2===n.wrap)e.adler=0,I(n,31),I(n,139),I(n,8),n.gzhead?(I(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),I(n,255&n.gzhead.time),I(n,n.gzhead.time>>8&255),I(n,n.gzhead.time>>16&255),I(n,n.gzhead.time>>24&255),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(I(n,255&n.gzhead.extra.length),I(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(I(n,0),I(n,0),I(n,0),I(n,0),I(n,0),I(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),I(n,3),n.status=x);else{var a=_+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=x,O(n,a),0!==n.strstart&&(O(n,e.adler>>>16),O(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending!==n.pending_buf_size));)I(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,I(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),C(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,I(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&C(e),n.pending+2<=n.pending_buf_size&&(I(n,255&e.adler),I(n,e.adler>>8&255),e.adler=0,n.status=x)):n.status=x),0!==n.pending){if(C(e),0===e.avail_out)return n.last_flush=-1,l}else if(0===e.avail_in&&z(t)<=z(r)&&4!==t)return S(e,-5);if(666===n.status&&0!==e.avail_in)return S(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==f&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(T(e),0===e.lookahead)){if(t===f)return 1;break}if(e.match_length=0,r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=w){if(T(e),e.lookahead<=w&&t===f)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=b&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+w;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=w-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=b?(r=h._tr_tally(e,1,e.match_length-b),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=h._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(A(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(A(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(A(e,!1),0===e.strm.avail_out)?1:2}(n,t):u[n.level].func(n,t);if(3!==o&&4!==o||(n.status=666),1===o||3===o)return 0===e.avail_out&&(n.last_flush=-1),l;if(2===o&&(1===t?h._tr_align(n):5!==t&&(h._tr_stored_block(n,0,0,!1),3===t&&(E(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),C(e),0===e.avail_out))return n.last_flush=-1,l}return 4!==t?l:n.wrap<=0?1:(2===n.wrap?(I(n,255&e.adler),I(n,e.adler>>8&255),I(n,e.adler>>16&255),I(n,e.adler>>24&255),I(n,255&e.total_in),I(n,e.total_in>>8&255),I(n,e.total_in>>16&255),I(n,e.total_in>>24&255)):(O(n,e.adler>>>16),O(n,65535&e.adler)),C(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?l:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==k&&69!==t&&73!==t&&91!==t&&103!==t&&t!==x&&666!==t?S(e,m):(e.state=null,t===x?S(e,-3):l):m},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,u,h,f=t.length;if(!e||!e.state)return m;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==k||r.lookahead)return m;for(1===s&&(e.adler=c(e.adler,t,f,0)),r.wrap=0,f>=r.w_size&&(0===s&&(E(r.head),r.strstart=0,r.block_start=0,r.insert=0),h=new d.Buf8(r.w_size),d.arraySet(h,t,f-r.w_size,r.w_size,0),t=h,f=r.w_size),a=e.avail_in,o=e.next_in,u=e.input,e.avail_in=f,e.next_in=0,e.input=t,T(r);r.lookahead>=b;){for(n=r.strstart,i=r.lookahead-(b-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+b-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=b-1,T(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=b-1,r.match_available=0,e.next_in=o,e.input=u,e.avail_in=a,r.wrap=s,l},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,E;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,E=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),u=r.dmax,h=r.wsize,f=r.whave,l=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,v=(1<<r.distbits)-1;e:do{p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=m[c&g];t:for(;;){if(c>>>=w=b>>>24,p-=w,0==(w=b>>>16&255))E[s++]=65535&b;else{if(!(16&w)){if(0==(64&w)){b=m[(65535&b)+(c&(1<<w)-1)];continue t}if(32&w){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}y=65535&b,(w&=15)&&(p<w&&(c+=z[n++]<<p,p+=8),y+=c&(1<<w)-1,c>>>=w,p-=w),p<15&&(c+=z[n++]<<p,p+=8,c+=z[n++]<<p,p+=8),b=_[c&v];r:for(;;){if(c>>>=w=b>>>24,p-=w,!(16&(w=b>>>16&255))){if(0==(64&w)){b=_[(65535&b)+(c&(1<<w)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&b,p<(w&=15)&&(c+=z[n++]<<p,(p+=8)<w&&(c+=z[n++]<<p,p+=8)),u<(k+=c&(1<<w)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(c>>>=w,p-=w,(w=s-a)<k){if(f<(w=k-w)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=d,(x=0)===l){if(x+=h-w,w<y){for(y-=w;E[s++]=d[x++],--w;);x=s-k,S=E}}else if(l<w){if(x+=h+l-w,(w-=l)<y){for(y-=w;E[s++]=d[x++],--w;);if(x=0,l<y){for(y-=w=l;E[s++]=d[x++],--w;);x=s-k,S=E}}}else if(x+=l-w,w<y){for(y-=w;E[s++]=d[x++],--w;);x=s-k,S=E}for(;2<y;)E[s++]=S[x++],E[s++]=S[x++],E[s++]=S[x++],y-=3;y&&(E[s++]=S[x++],1<y&&(E[s++]=S[x++]))}else{for(x=s-k;E[s++]=E[x++],E[s++]=E[x++],E[s++]=E[x++],2<(y-=3););y&&(E[s++]=E[x++],1<y&&(E[s++]=E[x++]))}break}}break}}while(n<i&&s<o);n-=y=p>>3,c&=(1<<(p-=y<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),T=e("./inffast"),R=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function u(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function h(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=u(e,t))!==N&&(e.state=null),r):U}var f,l,d=!0;function j(e){if(d){var t;for(f=new I.Buf32(512),l=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(R(D,e.lens,0,288,f,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;R(F,e.lens,0,32,l,0,e.work,{bits:5}),d=!1}e.lencode=f,e.lenbits=9,e.distcode=l,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=u,r.inflateResetKeep=a,r.inflateInit=function(e){return h(e,15)},r.inflateInit2=h,r.inflate=function(e,t){var r,n,i,s,a,o,u,h,f,l,d,c,p,m,_,g,v,b,w,y,k,x,S,z,E=0,C=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,l=o,d=u,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(2&r.wrap&&35615===h){C[r.check=0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0),f=h=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&h)){e.msg="unknown compression method",r.mode=30;break}if(f-=4,k=8+(15&(h>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&h?10:12,f=h=0;break;case 2:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(r.flags=h,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=h>>8&1),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0,r.mode=3;case 3:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.head&&(r.head.time=h),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,C[2]=h>>>16&255,C[3]=h>>>24&255,r.check=B(r.check,C,4,0)),f=h=0,r.mode=4;case 4:for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.head&&(r.head.xflags=255&h,r.head.os=h>>8),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0,r.mode=5;case 5:if(1024&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.length=h,r.head&&(r.head.extra_len=h),512&r.flags&&(C[0]=255&h,C[1]=h>>>8&255,r.check=B(r.check,C,2,0)),f=h=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,c,k)),512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,r.length-=c),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(c=0;k=n[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,n,c,s)),o-=c,s+=c,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;f<16;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}f=h=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}e.adler=r.check=L(h),f=h=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){h>>>=7&f,f-=7&f,r.mode=27;break}for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}switch(r.last=1&h,f-=1,3&(h>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;h>>>=2,f-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}h>>>=2,f-=2;break;case 14:for(h>>>=7&f,f-=7&f;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if((65535&h)!=(h>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&h,f=h=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),u<c&&(c=u),0===c)break e;I.arraySet(i,n,s,c,a),o-=c,s+=c,u-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;f<14;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(r.nlen=257+(31&h),h>>>=5,f-=5,r.ndist=1+(31&h),h>>>=5,f-=5,r.ncode=4+(15&h),h>>>=4,f-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;f<3;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.lens[A[r.have++]]=7&h,h>>>=3,f-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=R(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(E=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(v<16)h>>>=_,f-=_,r.lens[r.have++]=v;else{if(16===v){for(z=_+2;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h>>>=_,f-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&h),h>>>=2,f-=2}else if(17===v){for(z=_+3;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}f-=_,k=0,c=3+(7&(h>>>=_)),h>>>=3,f-=3}else{for(z=_+7;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}f-=_,k=0,c=11+(127&(h>>>=_)),h>>>=7,f-=7}if(r.have+c>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=R(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=R(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=u){e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,T(e,d),a=e.next_out,i=e.output,u=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,h=r.hold,f=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(E=r.lencode[h&(1<<r.lenbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(g&&0==(240&g)){for(b=_,w=g,y=v;g=(E=r.lencode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&E,!(b+(_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}h>>>=b,f-=b,r.back+=b}if(h>>>=_,f-=_,r.back+=_,r.length=v,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.length+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(E=r.distcode[h&(1<<r.distbits)-1])>>>16&255,v=65535&E,!((_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(0==(240&g)){for(b=_,w=g,y=v;g=(E=r.distcode[y+((h&(1<<b+w)-1)>>b)])>>>16&255,v=65535&E,!(b+(_=E>>>24)<=f);){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}h>>>=b,f-=b,r.back+=b}if(h>>>=_,f-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=v,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;f<z;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}r.offset+=h&(1<<r.extra)-1,h>>>=r.extra,f-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===u)break e;if(c=d-u,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=i,p=a-r.offset,c=r.length;for(u<c&&(c=u),u-=c,r.length-=c;i[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===u)break e;i[a++]=r.length,u--,r.mode=21;break;case 27:if(r.wrap){for(;f<32;){if(0===o)break e;o--,h|=n[s++]<<f,f+=8}if(d-=u,e.total_out+=d,r.total+=d,d&&(e.adler=r.check=r.flags?B(r.check,i,d,a-d):O(r.check,i,d,a-d)),d=u,(r.flags?h:L(h))!==r.check){e.msg="incorrect data check",r.mode=30;break}f=h=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;f<32;){if(0===o)break e;o--,h+=n[s++]<<f,f+=8}if(h!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}f=h=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=u,e.next_in=s,e.avail_in=o,r.hold=h,r.bits=f,(r.wsize||d!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,d-e.avail_out)?(r.mode=31,-4):(l-=e.avail_in,d-=e.avail_out,e.total_in+=l,e.total_out+=d,r.total+=d,r.wrap&&d&&(e.adler=r.check=r.flags?B(r.check,i,d,e.next_out-d):O(r.check,i,d,e.next_out-d)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==l&&0===d||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var u,h,f,l,d,c,p,m,_,g=o.bits,v=0,b=0,w=0,y=0,k=0,x=0,S=0,z=0,E=0,C=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),T=null,R=0;for(v=0;v<=15;v++)O[v]=0;for(b=0;b<n;b++)O[t[r+b]]++;for(k=g,y=15;1<=y&&0===O[y];y--);if(y<k&&(k=y),0===y)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(w=1;w<y&&0===O[w];w++);for(k<w&&(k=w),v=z=1;v<=15;v++)if(z<<=1,(z-=O[v])<0)return-1;if(0<z&&(0===e||1!==y))return-1;for(B[1]=0,v=1;v<15;v++)B[v+1]=B[v]+O[v];for(b=0;b<n;b++)0!==t[r+b]&&(a[B[t[r+b]]++]=b);if(c=0===e?(A=T=a,19):1===e?(A=F,I-=257,T=N,R-=257,256):(A=U,T=P,-1),v=w,d=s,S=b=C=0,f=-1,l=(E=1<<(x=k))-1,1===e&&852<E||2===e&&592<E)return 1;for(;;){for(p=v-S,_=a[b]<c?(m=0,a[b]):a[b]>c?(m=T[R+a[b]],A[I+a[b]]):(m=96,0),u=1<<v-S,w=h=1<<x;i[d+(C>>S)+(h-=u)]=p<<24|m<<16|_|0,0!==h;);for(u=1<<v-1;C&u;)u>>=1;if(0!==u?(C&=u-1,C+=u):C=0,b++,0==--O[v]){if(v===y)break;v=t[r+a[b]]}if(k<v&&(C&l)!==f){for(0===S&&(S=k),d+=w,z=1<<(x=v-S);x+S<y&&!((z-=O[x+S])<=0);)x++,z<<=1;if(E+=1<<x,1===e&&852<E||2===e&&592<E)return 1;i[f=C&l]=k<<24|x<<16|d-s|0}}return 0!==C&&(i[d+C]=v-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var o=e("../utils/common");function n(e){for(var t=e.length;0<=--t;)e[t]=0}var _=15,i=16,u=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],h=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],f=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],l=new Array(576);n(l);var d=new Array(60);n(d);var c=new Array(512);n(c);var p=new Array(256);n(p);var m=new Array(29);n(m);var g,v,b,w=new Array(30);function y(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function s(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function k(e){return e<256?c[e]:c[256+(e>>>7)]}function x(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function S(e,t,r){e.bi_valid>i-r?(e.bi_buf|=t<<e.bi_valid&65535,x(e,e.bi_buf),e.bi_buf=t>>i-e.bi_valid,e.bi_valid+=r-i):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function z(e,t,r){S(e,r[2*t],r[2*t+1])}function E(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function C(e,t,r){var n,i,s=new Array(_+1),a=0;for(n=1;n<=_;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=E(s[o]++,o))}}function A(e){var t;for(t=0;t<286;t++)e.dyn_ltree[2*t]=0;for(t=0;t<30;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function I(e){8<e.bi_valid?x(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function O(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function B(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&O(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!O(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function T(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?z(e,i,t):(z(e,(s=p[i])+256+1,t),0!==(a=u[s])&&S(e,i-=m[s],a),z(e,s=k(--n),r),0!==(a=h[s])&&S(e,n-=w[s],a)),o<e.last_lit;);z(e,256,t)}function R(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,u=t.stat_desc.elems,h=-1;for(e.heap_len=0,e.heap_max=573,r=0;r<u;r++)0!==s[2*r]?(e.heap[++e.heap_len]=h=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=h<2?++h:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=h,r=e.heap_len>>1;1<=r;r--)B(e,s,r);for(i=u;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],B(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,B(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,u=t.dyn_tree,h=t.max_code,f=t.stat_desc.static_tree,l=t.stat_desc.has_stree,d=t.stat_desc.extra_bits,c=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=_;s++)e.bl_count[s]=0;for(u[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<573;r++)p<(s=u[2*u[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),u[2*n+1]=s,h<n||(e.bl_count[s]++,a=0,c<=n&&(a=d[n-c]),o=u[2*n],e.opt_len+=o*(s+a),l&&(e.static_len+=o*(f[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)h<(i=e.heap[--r])||(u[2*i+1]!==s&&(e.opt_len+=(s-u[2*i+1])*u[2*i],u[2*i+1]=s),n--)}}(e,t),C(s,h,e.bl_count)}function D(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<u&&i===a||(o<h?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[32]++):o<=10?e.bl_tree[34]++:e.bl_tree[36]++,s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4))}function F(e,t,r){var n,i,s=-1,a=t[1],o=0,u=7,h=4;for(0===a&&(u=138,h=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<u&&i===a)){if(o<h)for(;z(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(z(e,i,e.bl_tree),o--),z(e,16,e.bl_tree),S(e,o-3,2)):o<=10?(z(e,17,e.bl_tree),S(e,o-3,3)):(z(e,18,e.bl_tree),S(e,o-11,7));s=i,h=(o=0)===a?(u=138,3):i===a?(u=6,3):(u=7,4)}}n(w);var N=!1;function U(e,t,r,n){var i,s,a;S(e,0+(n?1:0),3),s=t,a=r,I(i=e),x(i,a),x(i,~a),o.arraySet(i.pending_buf,i.window,s,a,i.pending),i.pending+=a}r._tr_init=function(e){N||(function(){var e,t,r,n,i,s=new Array(_+1);for(n=r=0;n<28;n++)for(m[n]=r,e=0;e<1<<u[n];e++)p[r++]=n;for(p[r-1]=n,n=i=0;n<16;n++)for(w[n]=i,e=0;e<1<<h[n];e++)c[i++]=n;for(i>>=7;n<30;n++)for(w[n]=i<<7,e=0;e<1<<h[n]-7;e++)c[256+i++]=n;for(t=0;t<=_;t++)s[t]=0;for(e=0;e<=143;)l[2*e+1]=8,e++,s[8]++;for(;e<=255;)l[2*e+1]=9,e++,s[9]++;for(;e<=279;)l[2*e+1]=7,e++,s[7]++;for(;e<=287;)l[2*e+1]=8,e++,s[8]++;for(C(l,287,s),e=0;e<30;e++)d[2*e+1]=5,d[2*e]=E(e,5);g=new y(l,u,257,286,_),v=new y(d,h,0,30,_),b=new y(new Array(0),a,0,19,7)}(),N=!0),e.l_desc=new s(e.dyn_ltree,g),e.d_desc=new s(e.dyn_dtree,v),e.bl_desc=new s(e.bl_tree,b),e.bi_buf=0,e.bi_valid=0,A(e)},r._tr_stored_block=U,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<256;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),R(e,e.l_desc),R(e,e.d_desc),a=function(e){var t;for(D(e,e.dyn_ltree,e.l_desc.max_code),D(e,e.dyn_dtree,e.d_desc.max_code),R(e,e.bl_desc),t=18;3<=t&&0===e.bl_tree[2*f[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?U(e,t,r,n):4===e.strategy||s===i?(S(e,2+(n?1:0),3),T(e,l,d)):(S(e,4+(n?1:0),3),function(e,t,r,n){var i;for(S(e,t-257,5),S(e,r-1,5),S(e,n-4,4),i=0;i<n;i++)S(e,e.bl_tree[2*f[i]+1],3);F(e,e.dyn_ltree,t-1),F(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),T(e,e.dyn_ltree,e.dyn_dtree)),A(e),n&&I(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(p[r]+256+1)]++,e.dyn_dtree[2*k(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){var t;S(e,2,3),z(e,256,l),16===(t=e).bi_valid?(x(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){"use strict";t.exports="function"==typeof setImmediate?setImmediate:function(){var e=[].slice.apply(arguments);e.splice(1,0,0),setTimeout.apply(null,e)}},{}]},{},[10])(10)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,void 0!==r?r:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,require("timers").setImmediate)
},{"buffer":2,"timers":5}],9:[function(require,module,exports){
let Utils = require('./utils.js')
let db = null;
let maxCacheSize = 0;
let WRONG_PASSWORDS_LIMIT = 100;

async function initCacheStorage(_maxCacheSize) {
    let openRequest = indexedDB.open("htdb", 1);
    maxCacheSize = _maxCacheSize;

    let openRequestResult = await new Promise(function(resolve, reject) {
        openRequest.onerror = function(event) {
            Utils.trace('HiddenThread: initCacheStorage open() error');
            reject(event);
        };
        openRequest.onsuccess = function(event) {
            resolve(event);
        };
        openRequest.onupgradeneeded = function(event) {
            Utils.trace('HiddenThread: indexedDB onupgradeneeded');
            const db = openRequest.result;
            let objectStore = db.createObjectStore("hiddenposts", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("img_id", "img_id", { unique: true });
            objectStore.add({totalSize: 0});
        }
    });

    db = openRequestResult.target.result;
}

async function clearStore() {
    let transaction = db.transaction(["hiddenposts"], "readwrite");
    let objectStore = transaction.objectStore("hiddenposts");
    let request = objectStore.clear();
    await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: clearStore clear() error');
            reject(event);
        };
    });
    request = objectStore.put({totalSize: 0, id: 1});
    await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: clearStore put() error');
            reject(event);
        };
    });
}

function getPostSize(post) {
    let size = JSON.stringify(post).length;
    if (post.hiddenPost) {
        // Добавляем размер blob
        size += post.hiddenPost.zipData.size;
    }
    return size;
}

async function saveHiddenPostCache(objectStore, imgId, hiddenPost, id)
{
    let request = null;
    let size = null;
    if (id) {
        let post = {img_id: imgId, id: id, hiddenPost: hiddenPost, size: 0};
        size = getPostSize(post);
        post.size = size;
        request = objectStore.put(post)
    } else {
        let post = {img_id: imgId, hiddenPost: hiddenPost, size: 0};
        size = getPostSize(post);
        post.size = size;
        request = objectStore.add(post);
    }

    await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: saveHiddenPostCache error');
            reject(event);
        };
    });
    return size;
}

async function saveNormalPostCache(objectStore, imgId, wrongPasswordHashes, wrongPrivateKeyHashes, id)
{
    let request = null;
    let size = null;
    if (id) {
        let post = {img_id: imgId, id: id, wrongPasswordHashes: wrongPasswordHashes,
            wrongPrivateKeyHashes: wrongPrivateKeyHashes, size: 0};
        size = getPostSize(post);
        post.size = size;
        request = objectStore.put(post)
    } else {
        let post = {img_id: imgId, wrongPasswordHashes: wrongPasswordHashes,
            wrongPrivateKeyHashes: wrongPrivateKeyHashes, size: 0};
        size = getPostSize(post);
        post.size = size;
        request = objectStore.add(post);
    }

    await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: saveNormalPostCache error');
            reject(event);
        };
    });
    return size;
}

async function getCachedPostWithStore(key)
{
    let transaction = db.transaction(["hiddenposts"], "readwrite");
    let objectStore = transaction.objectStore("hiddenposts");
    let index = objectStore.index('img_id');
    let request = index.get(key);
    let cachedPost = await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: getCachedPostWithStore get() error');
            reject(event);
        };
    });
    return { post: cachedPost, objectStore: objectStore };
}

async function checkCacheOverflow(objectStore, sizeDelta)
{
    // Получаем текущий размер кэша
    let request = objectStore.get(1);
    let getSizeResult = await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: checkCacheOverflow get() error');
            reject(event);
        };
    });

    let newTotalSize = getSizeResult.totalSize + sizeDelta;

    // Обновляем размер кэша
    request = objectStore.put({totalSize: newTotalSize, id: 1});
    await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: checkCacheOverflow put() error');
            reject(event);
        };
    });

    if (newTotalSize > (maxCacheSize * 1024 * 1024))
    {
        let clearRequest = objectStore.clear();
        await new Promise(function(resolve, reject) {
            clearRequest.onsuccess = function(event) {
                resolve(event.target.result);
            };
            clearRequest.onerror = function(event) {
                Utils.trace('HiddenThread: checkCacheOverflow clear() error');
                reject(event);
            };
        });
        request = objectStore.put({totalSize: 0, id: 1});
        await new Promise(function(resolve, reject) {
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function(event) {
                Utils.trace('HiddenThread: checkCacheOverflow put() error');
                reject(event);
            };
        });
    }
}

function insertWithLimit(array, value) {
    array.push(value);
    if (array.length > WRONG_PASSWORDS_LIMIT) {
        array.shift();
    }
    return array;
}

async function updateCache(imgId, loadedPost, passwordHashes, privateKeyHashes) {
    if (maxCacheSize == 0)
        return;

    let cache = await getCachedPostWithStore(imgId);
    let cachedPost = cache.post;
    let objectStore = cache.objectStore;

    if (cachedPost && cachedPost.hiddenPost)
        return;

    let oldCachedPostSize = cachedPost ? cachedPost.size : 0;
    let newCachedPostSize = undefined;

    if (loadedPost) {
        if (cachedPost && !cachedPost.hiddenPost) {
            // в кэше не скрытопост
            newCachedPostSize = await saveHiddenPostCache(objectStore, imgId, loadedPost, cachedPost.id);
        } else if(!cachedPost) {
            // кэш пуст
            newCachedPostSize = await saveHiddenPostCache(objectStore, imgId, loadedPost);
        } else {
            throw new Error('assert');
        }
    } else {
        if (cachedPost && !cachedPost.hiddenPost) {
            function updateArray(oldArray, newArray) {
                let newValues = newArray.filter(x => !oldArray.includes(x));
                for (let value of newValues) {
                    oldArray = insertWithLimit(oldArray, value);
                }
                return { updated: newValues.length > 0, updatedArray: oldArray };
            }
            let updatePasswordsResult = updateArray(cachedPost.wrongPasswordHashes, passwordHashes);
            let updatePrivateKeysResult = updateArray(cachedPost.wrongPrivateKeyHashes, privateKeyHashes);

            if (updatePasswordsResult.updated || updatePrivateKeysResult.updated) {
                // в кэше не скрытопост и в кэше нет хотя бы одного текущего пароля или ключа
                newCachedPostSize = await saveNormalPostCache(objectStore, imgId,
                    updatePasswordsResult.updatedArray, updatePrivateKeysResult.updatedArray, cachedPost.id);
            } else {
                newCachedPostSize = oldCachedPostSize;
            }
        } else if(!cachedPost) {
            // кэш пуст
            newCachedPostSize = await saveNormalPostCache(objectStore, imgId,
                passwordHashes.slice(0, WRONG_PASSWORDS_LIMIT), privateKeyHashes.slice(0, WRONG_PASSWORDS_LIMIT));
        } else {
            throw new Error('assert');
        }
    }

    let sizeDelta = newCachedPostSize - oldCachedPostSize;
    await checkCacheOverflow(objectStore, sizeDelta);
}

async function getCachedPost(imgId) {
    let transaction = db.transaction(["hiddenposts"], "readonly");
    let objectStore = transaction.objectStore("hiddenposts");
    let index = objectStore.index('img_id');
    let request = index.get(imgId);
    let cachedPost = await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: getCachedPost get() error');
            reject(event);
        };
    });
    return cachedPost;
}

async function getCacheSize() {
    let transaction = db.transaction(["hiddenposts"], "readonly");
    let objectStore = transaction.objectStore("hiddenposts");
    let request = objectStore.get(1);
    let result = await new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        request.onerror = function(event) {
            Utils.trace('HiddenThread: getCacheSize get() error');
            reject(event);
        };
    });
    return result.totalSize;
}

module.exports.updateCache = updateCache
module.exports.getCachedPost = getCachedPost
module.exports.initCacheStorage = initCacheStorage
module.exports.clearStore = clearStore
module.exports.getCacheSize = getCacheSize

},{"./utils.js":14}],10:[function(require,module,exports){
let Utils = require('./utils.js')
let Elliptic = require('../lib/elliptic.min.js')

const BLOCK_SIZE = 16;
const IV_SIZE = 16;
const PUBLIC_KEY_SIZE = 65;
const SIGNATURE_SIZE = 64;

///////////////////////////////////////////////////////////////////////////////
// AES

async function getKeyMaterial(password) {
    let enc = new TextEncoder();
    let key = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password), {
        name: "PBKDF2"
    },
        false, ["deriveBits", "deriveKey"]
    );
    return key;
}

async function getKey(password, salt) {
    let keyMaterial = await getKeyMaterial(password);
    let key = await window.crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 1000,
            "hash": "SHA-256"
        },
        keyMaterial,
        {
            "name": "AES-CBC",
            "length": 256
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

async function encrypt(password, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));
    const algorithm = {
        iv,
        name: 'AES-CBC',
    };

    // В качестве соли для пароля используется IV
    let key = await getKey(password, iv);
    const encryptedData = await window.crypto.subtle.encrypt(
        algorithm,
        key,
        data,
    );

    let res = new Uint8Array(iv.length + encryptedData.byteLength);
    res.set(iv);
    res.set(new Uint8Array(encryptedData), iv.length);
    return res;
}

async function decrypt(password, data, onlyFirstBlock) {
    let iv = data.subarray(0, IV_SIZE);
    const algorithm = {
        iv,
        name: 'AES-CBC',
    };

    let key = await getKey(password, iv);
    let encryptedData = onlyFirstBlock ?
        data.subarray(IV_SIZE, IV_SIZE + BLOCK_SIZE) :
        data.subarray(IV_SIZE);
    const decryptedData = await window.crypto.subtle.decrypt(
        algorithm,
        key,
        encryptedData,
    );
    return new Uint8Array(decryptedData);
}

///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// ECC

function importPublicKeyArrayFromPrivateKey(privateKeyBase58) {
    let privateKeyArray = Utils.base58ToArray(privateKeyBase58);
    if (!privateKeyArray || privateKeyArray.length != 32)
        throw new Error('Неверный формат приватного ключа! Ожидалось 32 байта в кодировке base58');
    try {
        // WebCrypto не умеет получать публичный ключ из приватного, поэтому используется elliptic.js
        let e = new Elliptic.ec('p256')
        let publicKeyArray = e.keyFromPrivate(privateKeyArray).getPublic().encode();
        return new Uint8Array(publicKeyArray);
    }
    catch (e) {
        throw new Error('Не удалось получить публичный ключ из приватного: ' + e + '. stack:\n' + e.stack);
    }
}

async function exportPrivateKey(privateKey) {
    let privateKeyJwk = await window.crypto.subtle.exportKey(
        "jwk",
        privateKey
    );
    return Utils.arrayToBase58(Utils.base64urlToArray(privateKeyJwk.d));
}

async function importPrivateKey(privateKeyBase58, isForSign = true) {
    async function importPrivateKeyImpl(privateKeyJwk) {
        return await window.crypto.subtle.importKey(
            "jwk",
            privateKeyJwk,
            {
                name: isForSign ? 'ECDSA' : 'ECDH',
                namedCurve: "P-256"
            },
            true,
            [isForSign ? 'sign' : 'deriveKey']
        );
    }

    let privateKey = null;
    let privateKeyJwk = {
        'crv': 'P-256',
        'd': Utils.arrayToBase64url(Utils.base58ToArray(privateKeyBase58)),
        'ext': true,
        'key_ops': [isForSign ? 'sign' : 'deriveKey'],
        'kty': 'EC',
        'x': '',
        'y': ''
    }

    try {
        privateKey = await importPrivateKeyImpl(privateKeyJwk);
    }
    catch (e) {
        // Если браузер не поддерживает импорт приватного ключа без публичного,
        // то генерируем его
        let publicKeyArray = importPublicKeyArrayFromPrivateKey(privateKeyBase58);
        privateKeyJwk.x = Utils.arrayToBase64url(publicKeyArray.subarray(1, 33));
        privateKeyJwk.y = Utils.arrayToBase64url(publicKeyArray.subarray(33));
        try {
            privateKey = await importPrivateKeyImpl(privateKeyJwk);
        }
        catch (e) {
            throw new Error('HiddenThread: не удалось импортировать приватный ключ: ' + e);
        }
    }
    return privateKey;
}

async function exportPublicKey(publicKey) {
    let publicKeyArray = await window.crypto.subtle.exportKey(
        "raw",
        publicKey
    );
    return Utils.arrayToBase58(new Uint8Array(publicKeyArray));
}

async function importPublicKey(publicKeyRaw, isForVerify = true) {
    let publicKey = await window.crypto.subtle.importKey(
        "raw",
        publicKeyRaw,
        {
            name: isForVerify ? "ECDSA" : "ECDH",
            namedCurve: "P-256"
        },
        true,
        isForVerify ? ['verify'] : []
    );
    return publicKey;
}

async function generateKeyPair() {
    let keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256"
        },
        true,
        ["sign", "verify"]);

    let privateKey = await exportPrivateKey(keyPair.privateKey);
    let publicKey = await exportPublicKey(keyPair.publicKey);
    let pair = [privateKey, publicKey]
    return pair;
}

async function sign(privateKeyBase58, data) {
    let signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        await importPrivateKey(privateKeyBase58),
        data
    );

    return new Uint8Array(signature);
}

async function verify(publicKey, signature, data) {
    let result = await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        await importPublicKey(publicKey),
        signature,
        data
    );

    return result;
}

async function deriveSecretKey(privateKeyBase58, publicKeyBase58) {
    let publicKeyArray = Utils.base58ToArray(publicKeyBase58);
    if (!publicKeyArray || publicKeyArray.length != PUBLIC_KEY_SIZE)
        throw new Error(`Неверный формат публичного ключа! Ожидалось ${PUBLIC_KEY_SIZE} байт в кодировке base58.`);

    try {
        let secret = await window.crypto.subtle.deriveKey(
            {
                name: "ECDH",
                public: await importPublicKey(publicKeyArray, false)
            },
            await importPrivateKey(privateKeyBase58, false),
            {
                name: "AES-CBC",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );

        let secretRaw = await window.crypto.subtle.exportKey('raw', secret);
        return Utils.arrayToBase58(new Uint8Array(secretRaw));
    } catch (e) {
        throw new Error('Не удалось сгенерировать секрет (указан неверный публичный ключ?): ' + e + '. stack:\n' + e.stack);
    }
}

///////////////////////////////////////////////////////////////////////////////

async function digestMessageHex(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}
async function digestMessageBase58(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    return Utils.arrayToBase58(new Uint8Array(hashBuffer));
}

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
module.exports.importPublicKeyArrayFromPrivateKey = importPublicKeyArrayFromPrivateKey
module.exports.generateKeyPair = generateKeyPair
module.exports.sign = sign
module.exports.verify = verify
module.exports.deriveSecretKey = deriveSecretKey
module.exports.digestMessageHex = digestMessageHex
module.exports.digestMessageBase58 = digestMessageBase58

module.exports.BLOCK_SIZE = BLOCK_SIZE
module.exports.IV_SIZE = IV_SIZE
module.exports.PUBLIC_KEY_SIZE = PUBLIC_KEY_SIZE
module.exports.SIGNATURE_SIZE = SIGNATURE_SIZE
},{"../lib/elliptic.min.js":7,"./utils.js":14}],11:[function(require,module,exports){
let Utils = require('./utils.js')
let Crypto = require('./crypto.js')
let Post = require('./post.js')
let HtCache = require('./cache.js')

const CURRENT_VERSION = "0.5.3";
const CURRENT_VERSION_NUMERIC = 0.53;
const VERSION_SOURCE = "https://raw.githubusercontent.com/anon25519/hiddenthread/main/version.info";
const SCRIPT_SOURCE = 'https://github.com/anon25519/hiddenthread/raw/main/HiddenThread.user.js'

const STORAGE_KEY = "hiddenThread";

const MAX_IMAGE_RES_DEFAULT = 25; // 5k * 5k пикселей

const DEFAULT_THRESHOLD_DATA_RATIO = 20;
const DEFAULT_MAX_DATA_RATIO = 60;
const DEFAULT_MIN_PIXEL_COUNT = 480000; // 800 * 600 пикселей
const DEFAULT_MIN_PIXEL_COUNT_DEVIANCE = 10;
const DEFAULT_MAX_PIXEL_COUNT = 6000000; // 3k * 2k пикселей
const DEFAULT_MAX_PIXEL_COUNT_DEVIANCE = 10;
const DEFAULT_MIN_WIDTH = 800;
const DEFAULT_MIN_WIDTH_DEVIANCE = 10;
const DEFAULT_MAX_WIDTH = 2000;
const DEFAULT_MAX_WIDTH_DEVIANCE = 10;
const DEFAULT_MIN_HEIGHT = 800;
const DEFAULT_MIN_HEIGHT_DEVIANCE = 10;
const DEFAULT_MAX_HEIGHT = 2000;
const DEFAULT_MAX_HEIGHT_DEVIANCE = 10;

let getStorage = () => {
    let storage = localStorage.getItem(STORAGE_KEY) || "{}";
    return JSON.parse(storage);
}

let storage = getStorage()

let setStorage = (value) => {
    let newStorage = {
        ...getStorage(),
        ...value
    }
    storage = newStorage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));
}

function checkForPreviousVersion() {
	let storageVersion = storage.storageVersion;
	let storageChanges = {};

	// Версия до добавления storage.storageVersion
	if (!storageVersion) {
		if (!storage.passwords || !storage.passwords.some((p) => p.value == '')) {
			storageChanges.passwords = storage.passwords || [];
			storageChanges.passwords.unshift({'alias': 'Без пароля', 'value': ''});
		}
	}

	if (storageVersion != CURRENT_VERSION_NUMERIC) {
		storageChanges.storageVersion = CURRENT_VERSION_NUMERIC;
	}

	if (Object.keys(storageChanges).length > 0) setStorage(storageChanges);
}

let passwordAliases = {};
let privateKeyAliases = {};
let otherPublicKeyAliases = {};

// [{alias:'...', value:'...'}, ...]
let passwords = [];
let privateKeys = [];
let otherPublicKeys = [];

// Массив для хранения временных паролей для отправленных приватных постов
// Сопоставление нужных паролей к постам делается по IV
// [{iv:'...', password:'...', otherPublicKey:'...'}, ...]
let myPrivatePosts = [];

checkForPreviousVersion();

let decodeQueue = new Utils.Queue();
let renderQueue = new Utils.Queue();

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstElementChild;
}

function getImgName(url) {
    return url.split('/').pop().split('.')[0];
}

function getContainerName() {
    let placeholder = document.getElementById('htContainerName').placeholder;
    let value = document.getElementById('htContainerName').value;
    let fileName = value || placeholder;

    return fileName.endsWith('.png') ? fileName : `${fileName}.png`
}

function getContainerLocalFile() {
    let container = null;
    let containers = document.getElementById('hiddenContainerInput').files;
    if (containers.length == 0) {
        alert("Выберите файл!");
        return null;
    }

    let containersNum = new Array(containers.length);
    for (let i = 0; i < containersNum.length; i++) containersNum[i] = i;
    Utils.shuffleArray(containersNum, containersNum.length, Math);

    for (let num of containersNum) {
        if (containers[num].type == 'image/png' ||
            containers[num].type == 'image/jpeg') {
            container = containers[num];
            break;
        }
    }

    if (!container) {
        alert(containers.length == 1 ?
            "Выбранный файл должен быть JPG или PNG картинкой!" :
            "Хотя бы один из выбранных файлов должен быть JPG или PNG картинкой!");
        return null;
    }

    return container;
}

async function createHiddenPost() {
    let imageContainerDiv = document.getElementById('imageContainerDiv');
    imageContainerDiv.innerHTML = '';

    setStorage({ thresholdDataRatio: document.getElementById('htThresholdDataRatio').value });
    setStorage({ maxDataRatio: document.getElementById('htMaxDataRatio').value });
    setStorage({ minPixelCount: document.getElementById('htMinPixelCount').value });
    setStorage({ minPixelCountDeviance: document.getElementById('htMinPixelCountDeviance').value });
    setStorage({ maxPixelCount: document.getElementById('htMaxPixelCount').value });
    setStorage({ maxPixelCountDeviance: document.getElementById('htMaxPixelCountDeviance').value });
    setStorage({ minWidth: document.getElementById('htMinWidth').value });
    setStorage({ minWidthDeviance: document.getElementById('htMinWidthDeviance').value });
    setStorage({ maxWidth: document.getElementById('htMaxWidth').value });
    setStorage({ maxWidthDeviance: document.getElementById('htMaxWidthDeviance').value });
    setStorage({ minHeight: document.getElementById('htMinHeight').value });
    setStorage({ minHeightDeviance: document.getElementById('htMinHeightDeviance').value });
    setStorage({ maxHeight: document.getElementById('htMaxHeight').value });
    setStorage({ maxHeightDeviance: document.getElementById('htMaxHeightDeviance').value });

    let container = null;
    let pack = null;
    let url = null;
    let containerType = document.getElementById('htContainerTypeSelect').selectedIndex;
    if (containerType == 0) {
        pack = document.getElementById('htContainerPackSelect').selectedIndex;
    } else if (containerType == 1) {
        url = document.getElementById('htContainerLinkInput').value;
    } else if (containerType == 2) {
        container = getContainerLocalFile();
        if (!container)
            return;
    } else if (containerType == 3) {
        // Для генерации создаем пустую картинку 1x1
        container = new ImageData(new Uint8ClampedArray(4), 1, 1);
    }

    let otherPublicKey = document.getElementById('htOtherPublicKey').value;

    let createPostResult = await Post.createHiddenPostImpl(
        {
            image: container,
            pack: pack,
            url: url,
            isAdjustResolution: document.getElementById('htIsAdjustResolution').checked,
            thresholdDataRatio: parseInt(document.getElementById('htThresholdDataRatio').value) / 100,
            maxDataRatio: parseInt(document.getElementById('htMaxDataRatio').value) / 100,
            pixelCountAdjust: document.querySelector('input[class="pixelCountAdjustClass"]:checked').value,
            minPixelCount: parseInt(document.getElementById('htMinPixelCount').value),
            minPixelCountDeviance: parseInt(document.getElementById('htMinPixelCountDeviance').value) / 100,
            maxPixelCount: parseInt(document.getElementById('htMaxPixelCount').value),
            maxPixelCountDeviance: parseInt(document.getElementById('htMaxPixelCountDeviance').value) / 100,
            minWidth: parseInt(document.getElementById('htMinWidth').value),
            minWidthDeviance: parseInt(document.getElementById('htMinWidthDeviance').value) / 100,
            maxWidth: parseInt(document.getElementById('htMaxWidth').value),
            maxWidthDeviance: parseInt(document.getElementById('htMaxWidthDeviance').value) / 100,
            minHeight: parseInt(document.getElementById('htMinHeight').value),
            minHeightDeviance: parseInt(document.getElementById('htMinHeightDeviance').value) / 100,
            maxHeight: parseInt(document.getElementById('htMaxHeight').value),
            maxHeightDeviance: parseInt(document.getElementById('htMaxHeightDeviance').value) / 100,
        },
        document.getElementById('hiddenPostInput').value,
        document.getElementById('hiddenFilesInput').files,
        document.getElementById('htPassword').value,
        document.getElementById('htPrivateKey').value,
        otherPublicKey);

    let imageResult = createPostResult.imageResult;

    if (otherPublicKey) {
        myPrivatePosts.push({
            iv: createPostResult.iv,
            password: createPostResult.password,
            otherPublicKey: otherPublicKey
        });
    }

    let toBlobPromise = new Promise(function(resolve, reject) {
        imageResult.canvas.toBlob(function(blob) {
            resolve(blob);
        });
    });
    let blob = await toBlobPromise;
    blob.name = getContainerName();

    // Вставляем картинку в форму для отображения пользователю
    let img = document.createElement('img');
    img.style = "max-width: 300px; max-height: 300px;";
    let imgUrl = URL.createObjectURL(blob);

    img.src = imgUrl;
    imageContainerDiv.appendChild(createElementFromHTML('<span>Сохрани изображение ниже и вставь в форму отправки, если оно не вставилось автоматически:</span>'));
    imageContainerDiv.appendChild(document.createElement('br'));
    imageContainerDiv.appendChild(img);

    imageContainerDiv.appendChild(document.createElement('br'));
    imageContainerDiv.appendChild(document.createTextNode(
        `${imageResult.canvas.width}x${imageResult.canvas.height}, ` +
        `скрыто: ${Utils.getHumanReadableSize(imageResult.len)}, ` +
        `заполнено пикселей: ${imageResult.percent}%`));

    let downloadLink  = document.createElement('a');
    downloadLink.innerText = 'Сохранить картинку'
    downloadLink.href = imgUrl;
    downloadLink.download = blob.name;
    imageContainerDiv.appendChild(document.createElement('br'));
    imageContainerDiv.appendChild(downloadLink);

    // Вставляем картинку в форму отправки
    if (isDollchan()) {
        let containers = document.getElementsByClassName('de-hiddencontainer-thumb');
        let containerId = containers.length == 0 ? 0 : parseInt(containers[0].id.split('-').pop()) + 1;
        let inputFileThumbTemplate =
            `<div id="de-hiddencontainer-thumb-${containerId}" class="de-hiddencontainer-thumb" style="display: inline-block;">`+
            `  <div class="de-file">`+
            `    <div class="de-file-img">`+
            `      <div class="de-file-img" title="${blob.name}">`+
            `        <img class="de-file-img" src="${URL.createObjectURL(blob)}">`+
            `      </div>`+
            `    </div>`+
            `  </div>`+
            `<input type="button" onclick="`+
            `document.getElementById('de-hiddencontainer-input-${containerId}').value = null;`+
            `document.getElementById('de-hiddencontainer-input-${containerId}').remove();`+
            `document.getElementById('de-hiddencontainer-thumb-${containerId}').remove();" value="X"/>`+
            `</div>`;
        let inputFileTemplate = `<div style="display: none;"><input id="de-hiddencontainer-input-${containerId}" type="file" name="formimages[]" class="de-file-input" multiple="true" style="display: none;"></div>'`;
        document.getElementsByClassName('postform__raw filer')[0].insertAdjacentHTML("afterbegin", inputFileTemplate);
        let file = new File([blob], blob.name, {type: blob.type});
        let container = new DataTransfer();
        container.items.add(file);
        document.getElementById(`de-hiddencontainer-input-${containerId}`).files = container.files;

        document.getElementById('de-file-area').insertAdjacentHTML("afterbegin", inputFileThumbTemplate);
    }
    else {
        window.FormFiles.addMultiFiles([blob]);
    }

    return {len: imageResult.len, percent: imageResult.percent};
}

const tags = [
    {
        open: '[i]',
        close: '[/i]',
        open_: "<em>",
        close_: "</em>"
    },
    {
        open: '[b]',
        close: '[/b]',
        open_: "<strong>",
        close_: "</strong>"
    },
    {
        open: '[spoiler]',
        close: '[/spoiler]',
        open_: `<span class=\"spoiler\">`,
        close_: "</span>"
    },
    {
        open: '[u]',
        close: '[/u]',
        open_: `<span class=\"u\">`,
        close_: "</span>"
    },
    {
        open: '[o]',
        close: '[/o]',
        open_: `<span class=\"o\">`,
        close_: "</span>"
    },
    {
        open: '[s]',
        close: '[/s]',
        open_: `<span class=\"s\">`,
        close_: "</span>"
    },
    {
        open: '[sup]',
        close: '[/sup]',
        open_: `<sup>`,
        close_: "</sup>"
    },
    {
        open: '[sub]',
        close: '[/sub]',
        open_: `<sub>`,
        close_: "</sub>"
    }
];

function convertToHtml(text) {
    let lines = text.split('\n');
    text = "";
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 2) {
            if (lines[i].trim().startsWith("&gt;")) {
                text += `<span class="unkfunc">${lines[i]}</span><br>`;
                continue;
            }
        }
        text += `${lines[i]}<br>`;
    }
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < tags.length; j++) {
            const t = tags[j];
            if (text.substring(i, i + t.open.length).toLowerCase() === t.open) {
                let c = getClosingTagIndex(text, i, t);
                if (c == -1) {
                    continue;
                }
                text = replaceAt(text, i, t.open.length, t.open_);
                text = replaceAt(text, c + (t.open_.length - t.open.length), t.close.length, t.close_);
            }
        }

    }
    return text;
}

function replaceAt(text, index, length, replacement) {
    return text.substr(0, index) + replacement + text.substr(index + length);
}

function getClosingTagIndex(text, i, tag) {
    i += tag.open.length;
    let skip = 0;
    for (; i < text.length; i++) {
        if (text.substring(i, i + tag.open.length).toLowerCase() === tag.open) {
            skip += 1;
            continue;
        }

        if (text.substring(i, i + tag.close.length).toLowerCase() === tag.close) {
            skip -= 1;
            if (skip == -1) {
                return i;
            }
        }
    }
    return -1;
}

// Количество скрытопостов в одном посте
function getAttachedHiddenPostsCount(dataNum) {
    let c = 0;
    let posts = document.getElementsByClassName('post_type_hiddenthread');
    for (let post of posts) {
        if (post.getAttribute('data-num') == dataNum) {
            c++;
        }
    }
    return c;
}

// Добавление HTML скрытопоста к основному посту
async function addHiddenPostToHtml(postId, loadedPost, unpackedData) {
    Utils.trace(`HiddenThread: Post ${postId} is hidden, its object:`);
    Utils.trace(loadedPost);
    Utils.trace(unpackedData);

    let clearPost = document.getElementById('post-' + postId);
    let postBodyDivCount = getAttachedHiddenPostsCount(postId);
    let postBodyDiv = document.createElement('div');
    postBodyDiv.id = `hidden_post-body-${postId}${postBodyDivCount > 0 ? '_'+postBodyDivCount : ''}`;
    postBodyDiv.classList.add("post");
    postBodyDiv.classList.add("post_type_reply");
    postBodyDiv.classList.add("post_type_hiddenthread");
    if (loadedPost.isPrivate)
        postBodyDiv.classList.add("post_type_ht_private");
    if (loadedPost.password)
        postBodyDiv.classList.add("post_type_ht_password");
    postBodyDiv.setAttribute('data-num', String(postId));

    let postMetadata = document.createElement('div');
    postMetadata.classList.add('hiddenthread_metadata');
    let postArticle = document.createElement('article');
    postArticle.id = `hidden_m${postId}${postBodyDivCount > 0 ? '_'+postBodyDivCount : ''}`;
    postArticle.classList.add("post__message");

    let postArticleMessage = document.createElement('div');
    postArticleMessage.innerHTML = convertToHtml(unpackedData.message);

    //let tzOffset = (new Date()).getTimezoneOffset() * 60;
	let postCreatedDate = new Date(loadedPost.timestamp * 1000);
    let timeString =
		String(postCreatedDate.getDate()).padStart(2, '0') + '.' +
		String(postCreatedDate.getMonth() + 1).padStart(2, '0') + '.' +
		postCreatedDate.getFullYear() + ' ' +
		String(postCreatedDate.getHours()).padStart(2, '0') + ':' +
		String(postCreatedDate.getMinutes()).padStart(2, '0') + ':' +
		String(postCreatedDate.getSeconds()).padStart(2, '0');
    let d = clearPost.getElementsByClassName('post__time')[0].textContent.split(' ');
    let postDateMs = Date.parse(`20${d[0].split('/')[2]}-${d[0].split('/')[1]}-${d[0].split('/')[0]}T${d[2]}Z`);
    let incorrectTimeSpan = null;
    if (Math.abs(postDateMs/1000 - loadedPost.timestamp) > 24*3600) {
        incorrectTimeSpan = document.createElement('span');
        incorrectTimeSpan.style.color = 'red';
        incorrectTimeSpan.textContent = ' (неверное время поста!)';
    }

    let postReplyLink = document.createElement('a');
	postReplyLink.classList.add('post__reflink');
    postReplyLink.textContent = 'Ответить';
    postReplyLink.href = '#';
    postReplyLink.onclick = function(e) {
        e.preventDefault();

        let selectedText = window.getSelection().toString();
        if (selectedText) {
            let currentEl = window.getSelection().getRangeAt(0).commonAncestorContainer;
            while (true) {
                if (!currentEl) {
                    selectedText = '';
                    break;
                }
                // Проверяем, что выделение находится внутри поста, на который отвечаем
                else if (currentEl.classList && currentEl.classList.contains('post_type_hiddenthread') &&
                    currentEl.getAttribute('data-num') == clearPost.getAttribute('data-num'))
                {
                    selectedText = selectedText.replaceAll(new RegExp('\n(.+)', 'g'), '\n>$1');
                    if (selectedText[0] && selectedText[0] != '\n') selectedText = '>' + selectedText;
                    window.getSelection().removeAllRanges();
                    break;
                }
                currentEl = currentEl.parentNode;
            }
        }

        let textarea = document.getElementById('hiddenPostInput');
        textarea.value = textarea.value + `>>${postId}\n${selectedText}\n`;

        if (isDollchan()) {
            if (document.getElementById('de-pform').style.display == 'none') {
                document.getElementsByClassName('de-parea-btn-reply')[0].click();
            }
        } else {
            if (document.getElementById('postform').style.display == 'none') {
                document.getElementsByClassName('newpost__label_top')[0].click();
            }
        }
        if (document.getElementById('hiddenThreadForm').style.display == 'none') {
            document.getElementById('hiddenThreadToggle').click();
        }
        textarea.scrollIntoView();
    }

    let postHeaderDiv = document.createElement('div');
	postHeaderDiv.classList.add("post__details");
    let timeSpanPrefix = document.createElement('span');
	timeSpanPrefix.classList.add("post__detailpart");
	timeSpanPrefix.appendChild(document.createTextNode("Создан:"));
    let timeSpan = document.createElement('span');
	timeSpan.classList.add("post__time");
	timeSpan.classList.add("post__detailpart");
	timeSpan.appendChild(document.createTextNode(timeString));
    postHeaderDiv.appendChild(timeSpanPrefix);
    postHeaderDiv.appendChild(timeSpan);
    if (incorrectTimeSpan) postHeaderDiv.appendChild(incorrectTimeSpan);
    postHeaderDiv.appendChild(postReplyLink);
    postMetadata.appendChild(postHeaderDiv);

    if (loadedPost.password) {
        let tmpDiv = document.createElement('div');
        tmpDiv.style.visibility = 'hidden';
        tmpDiv.style.position = 'absolute';
        tmpDiv.style.height = 'auto';
        tmpDiv.style.width = 'auto';
        tmpDiv.style.whiteSpace = 'nowrap';
        tmpDiv.classList.add('hiddenthread_metadata');
        document.body.appendChild(tmpDiv);
        tmpDiv.textContent = `(${loadedPost.password})`;
        let realPasswordWidth = tmpDiv.clientWidth;
        const revealText = '(раскрыть)'
        tmpDiv.textContent = revealText;
        let realRevealPasswordWidth = tmpDiv.clientWidth;
        tmpDiv.remove();
        postMetadata.appendChild(createElementFromHTML(
			`<div class="post__details"><span class="post__detailpart">Пароль: ${escapeHtml(passwordAliases[loadedPost.password])}</span>`+
            `<input class="post__reflink" readonly="" `+
            `style="background-color:rgba(0, 0, 0, 0);border:0px;width:${realRevealPasswordWidth}px;`+
            `padding-left:0px;padding-right:0px" value="${revealText}" `+
            `onclick="this.value='(${escapeHtml(loadedPost.password)})';this.style.width='${realPasswordWidth}px'"></div>`));
    }
    if (loadedPost.isPrivate) {
        postMetadata.appendChild(createElementFromHTML(
            `<div style="color:orange;" class="post__details"><i>Этот пост виден только с твоим приватным ключом `+
            `(${escapeHtml(privateKeyAliases[loadedPost.privateKey])})</i></div>`));
    }
    if (loadedPost.otherPublicKey) {
        let publicKeyAlias = otherPublicKeyAliases[loadedPost.otherPublicKey];
        if (!publicKeyAlias)
            publicKeyAlias = loadedPost.otherPublicKey;
        postMetadata.appendChild(createElementFromHTML(
            `<div style="color:orange;" class="post__details"><i>Приватный пост для получателя ${escapeHtml(publicKeyAlias)}<br>`+
            `(внимание: этот пост не будет вам виден после удаления из кэша)</i></div>`));
    }

    if (loadedPost.publicKey) {
        let postArticleSign = document.createElement('div');
		postArticleSign.classList.add("post__details");
        let publicKeyAlias = otherPublicKeyAliases[loadedPost.publicKey];
        postArticleSign.innerHTML =
            `<span class="post__detailpart">${publicKeyAlias ? 'Отправитель' : 'Публичный ключ'}:</span>` +
			`<span class="post__detailpart" style="word-wrap:normal;word-break:normal;color:` +
            `${loadedPost.isVerified ? 'green' : 'red'};">` +
            `${escapeHtml(publicKeyAlias ? publicKeyAlias : loadedPost.publicKey)}</span>` +
            `${loadedPost.isVerified ? '' : ' <span style="color: red;">(неверная подпись!)</span>'}`;
        postMetadata.appendChild(postArticleSign);
    }

    postMetadata.appendChild(await Post.createFileLinksDiv(unpackedData.files,
        unpackedData.hasSkippedFiles, postId, !storage.isPreviewDisabled));
    postArticle.appendChild(postMetadata);

    if (unpackedData.unpackResult) {
        postArticle.appendChild(createElementFromHTML(
            `<div style="font-family:courier new;color:red;">${escapeHtml(unpackedData.unpackResult)}</div>`));
    }
    postArticle.appendChild(document.createElement('br'));
    postArticle.appendChild(postArticleMessage);

    postBodyDiv.appendChild(postArticle);

    clearPost.parentNode.insertBefore(postBodyDiv, clearPost.nextSibling);

    // Переносим ссылки на скрытопосты в тело скрытопоста, если они ещё не там
    let normalPostBody = document.getElementById(`post-${postId}`);
    let hiddenPostsRefmap = normalPostBody.querySelector(`#ht_refmap-${postId}`);
    if (hiddenPostsRefmap) {
        document.getElementById(`hidden_m${postId}`).insertAdjacentElement('afterend', hiddenPostsRefmap);
    }
    return postBodyDivCount;
}


// Добавление HTML скрытопоста в объект основного поста (для всплывающих постов)
function addHiddenPostToObj(postId, hiddenPostSubId) {
    let thread = window.Post(CFG.BOARD.THREADID);
    let currentPost = thread.getPostsObj()[String(postId)];
    let postArticle = document.getElementById(`hidden_m${postId}${hiddenPostSubId > 0 ? '_'+hiddenPostSubId : ''}`);
    if (currentPost && currentPost.ajax) {
        currentPost.ajax.comment = currentPost.ajax.comment + '<br>' + postArticle.innerHTML;
    }
}

// Ссылка на пост в тексте
function createReplyLink(postId) {
    return `<a href="/${CFG.BOARD.NAME}/res/${CFG.BOARD.THREADID}.html#${postId}" ` +
        `class="${isDollchan() ? 'de-link-postref' : ''} post-reply-link" ` +
        `data-thread="${CFG.BOARD.THREADID}" data-num="${postId}">&gt;&gt;${postId}</a>`;
}

// Ссылка на пост в ответах
function createPostRefLink(postId) {
    if (isDollchan()) {
        return `<a href="#${postId}" class="de-link-backref">&gt;&gt;${escapeHtml(postId)}</a><span class="de-refcomma">, </span>`;
    }
    else {
        return createReplyLink(postId);
    }
}

function addReplyLinks(postId, refPostIdList) {
    let thread = window.Post(CFG.BOARD.THREADID);

    let refPostIdSet = new Set();
    for (const refPostId of refPostIdList) {
        let postEl = document.getElementById(`post-${refPostId}`);
        if (!postEl) continue;

        let hiddenPostsRefmap = document.getElementById(`ht_refmap-${refPostId}`);
        // Если списка с ответами на скрытопосты ещё не существует, создаём его и помещаем
        // в тело скрытопоста (либо в тело обычного поста, если скрытопост ещё не создан)
        if (!hiddenPostsRefmap) {
            if (isDollchan()) {
                hiddenPostsRefmap = createElementFromHTML(`<div id="ht_refmap-${refPostId}" class="de-refmap"></div>`);
            }
            else {
                hiddenPostsRefmap = createElementFromHTML(`<div id="ht_refmap-${refPostId}" class="post__refmap" style="display: block;"></div>`);
            }

            let hiddenPostEl = document.getElementById(`hidden_post-body-${refPostId}`);
            if (!hiddenPostEl) {
                document.getElementById(`m${refPostId}`).insertAdjacentElement('afterend', hiddenPostsRefmap);
            }
            else {
                document.getElementById(`hidden_m${refPostId}`).insertAdjacentElement('afterend', hiddenPostsRefmap);
            }
        }

        if (!refPostIdSet.has(refPostId)) {
            refPostIdSet.add(refPostId);
            // Добавление ссылки на текущий пост в ответы другого поста
            // В HTML:
            hiddenPostsRefmap.appendChild(createElementFromHTML(createPostRefLink(postId)));

            // В Object (для всплывающих постов):
            let refPost = thread.getPostsObj() && thread.getPostsObj()[refPostId];
            if (refPost) {
                if (!refPost.replies) {
                    refPost.replies = new Array();
                }
                if (!(postId in refPost.replies)) refPost.replies.push(postId);
            }
        }
    }
}

function escapeHtml(msg)
{
	return msg
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function parseMessage(message)
{
    message = message
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

    message = message.replaceAll(new RegExp('(\\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:;,.]{1,1000})', 'gi'),
        function(m, s) {
            let link = s.replace(/&amp;/g, "&");
            try {
                let url = new URL(link);
            } catch (_) {
                return s;
            }
            return `<a href="${link}" target="_blank" rel="nofollow noopener noreferrer">${link}</a>`;
        }
    );

    let refPostIdList = [];

    message = message.replaceAll(new RegExp('&gt;&gt;(\\d{1,10})', 'g'),
        function(m, s) {
            refPostIdList.push(s);
            return createReplyLink(s);
        });

    return {
        'message': message,
        'refPostIdList': refPostIdList
    }
};

async function renderHiddenPost(postId, loadedPost, unpackedData) {
    async function renderHiddenPostImpl() {
        let needToScroll = document.getElementById(`post-${postId}`).getBoundingClientRect().bottom < 0;
        let oldHeight = Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight);

        let res = parseMessage(unpackedData.message);
        unpackedData.message = res.message;
        let hiddenPostSubId = await addHiddenPostToHtml(postId, loadedPost, unpackedData);
        addReplyLinks(postId, res.refPostIdList);
        // TODO: отображение скрытопостов во всплывающих постах с куклоскриптом
        try {
            addHiddenPostToObj(postId, hiddenPostSubId); // Текст скрытопоста берется из HTML
        } catch (e) {
            Utils.trace('HiddenThread: addHiddenPostToObj error: ' + e + '. stack:\n' + e.stack);
        }

        if (needToScroll && storage.isAutoScrollEnabled) {
            let heightDelta = Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight) - oldHeight;
            window.scrollBy(0, heightDelta);
        }
    }

    function promiseGenerator()
    {
        return new Promise(async function(resolve, reject) {
            await renderHiddenPostImpl();
            resolve();
        });
    }
    await renderQueue.enqueue(promiseGenerator);
}


async function loadAndRenderPost(postId, url, passwords, privateKeys) {
    let response = null;
    let imgArrayBuffer = null;
    let imgId = getImgName(url);

    try {
        let fetchOk = false;
        let lastException = null;
        for (let i = 0; i < 3; i++) {
            try {
                if (i > 0) {
                    Utils.trace(`HiddenThread: fetch failed, retry ${i}/2`);
                    await new Promise(resolve => setTimeout(resolve, i * 5000));
                }
                response = await fetch(url);
                if (!response.ok) throw new Error(`fetch not ok, url: ${url}`);
                imgArrayBuffer = await response.arrayBuffer();
                fetchOk = true;
                break;
            } catch (e) {
                lastException = e;
            }
        }
        if (!fetchOk) throw lastException;
    } catch (e) {
        document.getElementById("imagesErrorCount").textContent =
            parseInt(document.getElementById("imagesErrorCount").textContent) + 1;
        throw e;
    } finally {
        document.getElementById("imagesLoadedCount").textContent =
            parseInt(document.getElementById("imagesLoadedCount").textContent) + 1;
    }

    let loadedPost = null;
    if (storage.isQueueDecodeDisabled) {
        loadedPost = await Post.loadPostFromImage(imgArrayBuffer, passwords, privateKeys, myPrivatePosts);
    } else {
        function promiseGenerator()
        {
            return new Promise(async function(resolve, reject) {
                loadedPost = await Post.loadPostFromImage(imgArrayBuffer, passwords, privateKeys, myPrivatePosts);
                resolve();
            });
        }
        await decodeQueue.enqueue(promiseGenerator);
    }

    if (!loadedPost)
        return loadedPost;

    loadedPosts.add(imgId);
    document.getElementById("hiddenPostsLoadedCount").textContent = loadedPosts.size;

    let unpackedData = await Post.unzipPostData(loadedPost.zipData);
    await renderHiddenPost(postId, loadedPost, unpackedData);

    return loadedPost;
}

/*
Проверяет есть ли в этом посте скрытый пост, расшифровывает
и выводит результат
*/
async function loadPost(postId, url, passwords, privateKeys, passwordHashes, privateKeyHashes) {
    Utils.trace('HiddenThread: loading post ' + postId + ' ' + url);

    let imgId = getImgName(url);
    let cachedPost = null;
    try {
        cachedPost = await HtCache.getCachedPost(imgId);
    } catch (e) {}

    if (cachedPost) {
        // Если в кэше не скрытопост и в кэше нет хотя бы одного текущего пароля или ключа,
        // то загружаем пост, выводим его (если удалось декодировать), обновляем кэш
        if (!cachedPost.hiddenPost && (
            passwordHashes.filter(x => !cachedPost.wrongPasswordHashes.includes(x)).length > 0 ||
            privateKeyHashes.filter(x => !cachedPost.wrongPrivateKeyHashes.includes(x)).length > 0 ))
        {
            let loadedPost = await loadAndRenderPost(postId, url, passwords, privateKeys);
            try {
                if (!storage.maxCachedPostSize || (loadedPost.zipData.size < storage.maxCachedPostSize * 1024))
                    await HtCache.updateCache(imgId, loadedPost, passwordHashes, privateKeyHashes);
            } catch (e) {}
        }
        // Если в кэше скрытопост, выводим его
        else if(cachedPost.hiddenPost) {
            loadedPosts.add(imgId);
            document.getElementById("hiddenPostsLoadedCount").textContent = loadedPosts.size;
            document.getElementById("hiddenPostsCachedCount").textContent =
                parseInt(document.getElementById("hiddenPostsCachedCount").textContent) + 1;
            document.getElementById("imagesLoadedCount").textContent =
                parseInt(document.getElementById("imagesLoadedCount").textContent) + 1;
            let unpackedPost = await Post.unzipPostData(cachedPost.hiddenPost.zipData);
            await renderHiddenPost(postId, cachedPost.hiddenPost, unpackedPost);
        }
        // В кэше не скрытопост
        else {
            document.getElementById("imagesLoadedCount").textContent =
                parseInt(document.getElementById("imagesLoadedCount").textContent) + 1;
        }
    } else {
        // Если в кэше ничего нет, то загружаем пост,
        // выводим его (если удалось декодировать), обновляем кэш
        let loadedPost = await loadAndRenderPost(postId, url, passwords, privateKeys);
        try {
            if (!storage.maxCachedPostSize || (loadedPost.zipData.size < storage.maxCachedPostSize * 1024))
                await HtCache.updateCache(imgId, loadedPost, passwordHashes, privateKeyHashes);
        } catch (e) {}
    }
}

function CheckVersion() {
    var request = new XMLHttpRequest();
    request.open("GET", VERSION_SOURCE);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            Utils.trace(`Актуальная версия HiddenThread: ${request.responseText}`);
            let infoDiv = document.getElementById('versionInfo');
            infoDiv.innerHTML = '';
            let info = document.createElement('span');
            if (CURRENT_VERSION === request.responseText) {
                info.style = 'color: green';
                info.textContent = 'У вас актуальная версия скрипта';
            } else {
                info.style = 'color: red';
                info.textContent = 'Ваша версия скрипта устарела (нет, она просто слишком новая)';
                infoDiv.insertAdjacentHTML('afterbegin', `(<a href="${SCRIPT_SOURCE}">обновить</a>)`);
            }
            infoDiv.insertAdjacentElement('afterbegin', info);
        }
    };
    request.send(null); // Send the request now
}

function addItemsToSelect(items, selectId) {
	let element = document.getElementById(selectId);
    for (let item of items) {
        let option = document.createElement('option');
        let str = item.value ? `${item.alias} (${item.value})` : item.alias;
        let shortStr = str.substring(0, 20);
        option.textContent = shortStr + ((str.length != shortStr.length) ? '...' : '');
        element.add(option);
    }
	let selectedIndex = storage[selectId + "SelectedIndex"];
	if (selectedIndex) {
		element.selectedIndex = selectedIndex < element.options.length ? selectedIndex : 0;
		if (element.onchange) {
			element.onchange(undefined);
		}
	}
}

function createManager(managerType) {
    let header1 = null;
    let items = null;

    // Обновляем пароли/ключи из хранилища
    if (managerType == 'Password') {
        passwords = storage.passwords ? storage.passwords : [{alias:'Без пароля', value:''}];
        items = passwords;
        header1 = '<th style="width:250px">Пароль</th>';
    } else if (managerType == 'PrivateKey') {
        privateKeys = storage.privateKeys ? storage.privateKeys : [];
        items = privateKeys;
        header1 = '<th style="width:250px">Приватный ключ</th>';
    } else {
        otherPublicKeys = storage.otherPublicKeys ? storage.otherPublicKeys : [];
        items = otherPublicKeys;
        header1 = '<th style="width:250px">Публичный ключ</th>';
    }

    function createRow(index, item) {
        let tr = document.createElement('tr');
        tr.id = `ht${managerType}ManagerRow_${index}`;
        let tdAlias = document.createElement('td');
        let inputAlias = document.createElement('input');
        inputAlias.style.width = '100%';
        inputAlias.value = item.alias;
        inputAlias.placeholder = 'Введите имя';
        tdAlias.appendChild(inputAlias);
        tr.appendChild(tdAlias);

        let tdValue = document.createElement('td');
        let inputValue = document.createElement('input');
        inputValue.style.width = '100%';
        inputValue.value = item.value;
        inputValue.placeholder = `Вставьте ${managerType == 'Password' ? 'пароль' :
            (managerType == 'PrivateKey' ? 'приватный ключ' : 'публичный ключ')}`;
        tdValue.appendChild(inputValue);
        tr.appendChild(tdValue);

        let tdDelete = document.createElement('td');
        let inputDelete = document.createElement('input');
        inputDelete.type = 'button';
        inputDelete.value = "Удалить";
        inputDelete.onclick = function () {
            document.getElementById(`ht${managerType}ManagerRow_${index}`).remove();
        }
        tdDelete.appendChild(inputDelete);
        tr.appendChild(tdDelete);
        return tr;
    }

    let tableHtml = `
        <table border="1"><tbody id="ht${managerType}ManagerBody">
        <tr><th style="width:100px">Имя</th>${header1}<th></th></tr></tbody></table>`;
    document.getElementById(`ht${managerType}ManagerDiv`).insertAdjacentHTML('afterbegin', tableHtml);

    let i = 0;
    for (let item of items) {
        document.getElementById(`ht${managerType}ManagerBody`).appendChild(createRow(i, item));
        i++;
    }

    let buttonsDiv = document.createElement('div');
    buttonsDiv.align = 'center';

    let addButton = document.createElement('input');
    addButton.type = 'button';
    addButton.value = 'Добавить';
    addButton.style = 'padding:5px;margin:auto';
    addButton.onclick = function() {
        let rows = document.getElementById(`ht${managerType}ManagerBody`).getElementsByTagName('tr');
        let lastIndex = 0;
        if (rows.length > 1) {
            lastIndex = parseInt(rows[rows.length - 1].id.split('_')[1]) + 1;
        }
        document.getElementById(`ht${managerType}ManagerBody`).appendChild(createRow(lastIndex, {alias:'', value:''}));
    }

    let saveButton = document.createElement('input');
    saveButton.type = 'button';
    saveButton.value = 'Сохранить';
    saveButton.style = 'padding:5px;margin:auto';
    saveButton.onclick = function() {
        let newItems = [];
        let rows = document.getElementById(`ht${managerType}ManagerBody`).getElementsByTagName('tr');
        for (let row of rows) {
            let inputs = row.getElementsByTagName('input');
            if (inputs.length < 2) continue;
            newItems.push({alias: inputs[0].value, value: inputs[1].value});
        }

        // Обновляем хранилище и переменные
        if (managerType == 'Password') {
            setStorage({ passwords: newItems });
            passwords = newItems;
            passwordAliases = {};
            for (let password of passwords) {
                passwordAliases[password.value] = password.alias;
            }
        } else if (managerType == 'PrivateKey') {
            setStorage({ privateKeys: newItems });
            privateKeys = newItems;
            privateKeyAliases = {};
            for (let privateKey of privateKeys) {
                privateKeyAliases[privateKey.value] = privateKey.alias;
            }
        } else {
            setStorage({ otherPublicKeys: newItems });
            otherPublicKeys = newItems;
            otherPublicKeyAliases = {};
            for (let otherPublicKey of otherPublicKeys) {
                otherPublicKeyAliases[otherPublicKey.value] = otherPublicKey.alias;
            }
        }
        items = newItems;

        // Обновляем элементы в выпадающем списке и в форме ввода
        if (document.getElementById(`ht${managerType}Select`).selectedIndex > 1) {
            document.getElementById(`ht${managerType}Select`).prevIndex = 0;
            document.getElementById(`ht${managerType}Select`).selectedIndex = 0;
            document.getElementById(`ht${managerType}InputDiv`).style.display = 'none';
            document.getElementById(`ht${managerType}`).value = '';
            if (managerType == 'PrivateKey') {
                document.getElementById(`htPublicKey`).value = '';
                document.getElementById(`htPrivatePhrase`).value = '';
            }
        }
        let selectOptions = document.getElementById(`ht${managerType}Select`).getElementsByTagName('option');
		let endI = managerType == "Password" ? 0 : 1;
        for (let i = selectOptions.length - 1; i > endI; i--) {
            selectOptions[i].remove();
        }
        addItemsToSelect(items, `ht${managerType}Select`);

        // Если изменение в паролях или ключах, проверяем старые посты
        if (managerType == 'Password' || managerType == 'PrivateKey') {
            isReloadRequested = true;
        }

        document.getElementById(`ht${managerType}ManagerDiv`).innerHTML = '';
    }

    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(saveButton);
    document.getElementById(`ht${managerType}ManagerDiv`).appendChild(buttonsDiv);
}

function privateToPublicKey(privateKey) {
    let publicKeyArray = null;
    try {
        publicKeyArray = Crypto.importPublicKeyArrayFromPrivateKey(privateKey);
    }
    catch (e) { }
    if (publicKeyArray && publicKeyArray.length > 0) {
        return Utils.arrayToBase58(publicKeyArray);
    }
    return '';
}

function wrapMarkupTags(tag1, tag2, textarea) {
    let len = textarea.value.length;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let scrollTop = textarea.scrollTop;
    let scrollLeft = textarea.scrollLeft;
    let sel = textarea.value.substring(start, end);
    let rep = tag1 + sel + tag2;

    textarea.value =  textarea.value.substring(0,start) + rep + textarea.value.substring(end,len);
    textarea.scrollTop = scrollTop;
    textarea.scrollLeft = scrollLeft;
    textarea.focus();
    textarea.setSelectionRange(start+tag1.length, end+tag1.length);
}

function createInterface() {
    let toggleText = () => {
        return storage.hidePostForm
            ? "Открыть"
            : "Закрыть"
    }
    let settingsToggleText = () => {
        return storage.hideSettingsForm
            ? "Открыть настройки"
            : "Закрыть настройки"
    }
    let formTemplate = `
        <br>
        <div id="hiddenPostDiv" style="display: inline-block; text-align: left; ${isDollchan()?'min-width: 600px;':'width: 100%;'}">
            <hr>
            <div style="position: relative; display: flex; justify-content: center; align-items: center">
                <p style="font-size:x-large;">Скрытотред ${CURRENT_VERSION}
                    <a target="_blank" style="font-size: small; margin-left: 5px" href="https://github.com/anon25519/hiddenthread">?</a>
                </p>
                <span id="hiddenThreadToggle" style="position: absolute; right: 0; cursor: pointer">${toggleText()}</span>
            </div>
            <div id="hiddenThreadForm" style="${storage.hidePostForm ? 'display:none' : ''}">
                <div style="padding:5px;">
                    <input id="htClearFormButton" type="button" style="padding:5px;margin:auto;display:block;color:red" value="Очистить форму" />
                </div>
                <textarea
                    id="hiddenPostInput"
                    placeholder="Пиши скрытый текст тут. Максимальная длина ${Post.MESSAGE_MAX_LENGTH}"
                    style="box-sizing: border-box; display: inline-block; width: 100%; padding: 5px;"
                    rows="10"
                ></textarea>
                <div><span>Разметка: </span>
                <input id="htMarkupBoldButton" type="button" value="B">
                <input id="htMarkupItalicButton" type="button" value="I">
                <input id="htMarkupGtButton" type="button" value="&gt;">
                <input id="htMarkupUnderlineButton" type="button" value="U">
                <input id="htMarkupOverlineButton" type="button" value="O">
                <input id="htMarkupSpoilerButton" type="button" value="??">
                <input id="htMarkupCrosslineButton" type="button" value="S">
                <input id="htMarkupSuperButton" type="button" value="sup">
                <input id="htMarkupSubButton" type="button" value="sub"></div>
                <div id="hiddenFilesDiv" style="padding: 5px;">
                    <span>Выбери скрытые файлы: </span>
                    <input id="hiddenFilesInput" type="file" multiple="true" />
                    <br>
                    <input id="hiddenFilesClearButton" class="mt-1" type="button" value="Очистить список файлов" />
                </div>
                <div id="htPostingSettingsToggle" style="cursor: pointer;text-align:center">${settingsToggleText()}</div>
				<div id="htPostingSettings" style="${storage.hideSettingsForm ? 'display:none' : ''}">
					<div style="padding: 5px;">
                    <div style="font-size:large;text-align:center;">Настройки шифрования</div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px;">Пароль:</span>
                        <div class="selectbox"><select id="htPasswordSelect" class="input select" style="max-width:25ch">
                            <!--<option>Без пароля</option>-->
                            <option>Ввести вручную</option>
                        </select></div>
                        <input id="htPasswordManagerButton" type="button" value="Менеджер паролей" />
                        <div id="htPasswordManagerDiv" align="center" style="padding-top:5px;"></div>
                        <div id="htPasswordInputDiv" style="padding-top:5px;">
                            <input id="htPassword" placeholder="Без пароля" autocomplete="off" style="max-width:64ch;width:100%" />
                        </div>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px;">Подпись:</span>
                        <div class="selectbox"><select id="htPrivateKeySelect" class="input select" style="max-width:25ch">
                            <option>Без ключа</option>
                            <option>Ввести вручную</option>
                        </select></div>
                        <input id="htPrivateKeyManagerButton" type="button" value="Менеджер ключей" />
                        <div id="htPrivateKeyManagerDiv" align="center" style="padding-top:5px;"></div>
                        <div id="htPrivateKeyInputDiv" style="display:none;padding-top:5px;">
                            <div id="htPrivatePhraseInputDiv">
                                Секретная фраза для генерации ключа: <br>
                                <input id="htPrivatePhrase" placeholder="Без секретной фразы" autocomplete="off" style="max-width:50ch;width:100%;padding-top:5px;" /><br>
                            </div>
                            Приватный ключ (ECDSA p256, base58): <br>
                            <input id="htPrivateKey" placeholder="Без ключа" autocomplete="off" style="max-width:50ch;width:100%;padding-top:5px;" /><br>
                            Публичный ключ: <br>
                            <input id="htPublicKey" autocomplete="off" readonly style="max-width:90ch;width:100%;color:grey;padding-top:5px;" />
                            <div align="center" class="mt-1">
                                <input id="generateKeyPairButton" type="button" value="Сгенерировать ключи" />
                            </div>
                        </div>
                    </div>
                    <div style="padding: 5px;">
                        <span style="padding-right: 5px;">Получатель:</span>
                        <div class="selectbox"><select id="htOtherPublicKeySelect" class="input select" style="max-width:25ch">
                            <option>Все</option>
                            <option>Ввести вручную</option>
                        </select></div>
                        <input id="htOtherPublicKeyManagerButton" type="button" value="Адресная книга" />
                        <div id="htOtherPublicKeyManagerDiv" align="center" style="padding-top:5px;"></div>
                        <div id="htOtherPublicKeyInputDiv" style="display:none;padding-top:5px;">
                            Публичный ключ получателя: <br>
                            <input id="htOtherPublicKey" placeholder="Без получателя" autocomplete="off" style="max-width:90ch;width:100%" />
                        </div>
                    </div>
                </div>

                <div style="padding: 5px;">
                    <div style="font-size:large;text-align:center;">Настройки контейнера</div>
                    <div>
                        <span style="margin-right: 5px">Картинка:</span>
                        <div class="selectbox">
                        <select id="htContainerTypeSelect" class="input select" style="max-width:25ch">
                            <option>загрузить случайную</option>
                            <option>загрузить по ссылке</option>
                            <option>выбрать свою</option>
                            <option>сгенерировать</option>
                        </select>
                        </div>
                        <div id="htContainerPackSelectDiv" class="selectbox"> с
                        <select id="htContainerPackSelect" class="input select" style="max-width:25ch">
                            <option>picsum.photos</option>
                            <option>imagecdn.app</option>
                            <option>cataas.com (коты)</option>
                            <option>dog.ceo (собаки)</option>
                            <option>waifu.pics (аниме sfw)</option>
                            <option>waifu.pics (аниме nsfw)</option>
                        </select>
                        </div>
                        <div id="htContainerInputDiv">
                            <span>Выбери файл(ы) (из нескольких берется рандомный): </span>
                            <input id="hiddenContainerInput" type="file" multiple="true" />
                            <br><br>
                        </div>
                        <div id="htContainerLinkDiv" style="padding-top:5px;">
                            <input id="htContainerLinkInput" placeholder="Ссылка на картинку" autocomplete="off" style="max-width:50ch;width:100%" />
                        </div>
                    </div>
                    <div style="padding-top:5px;">
                        <span style="margin-right: 5px">Имя картинки:</span>
                        <div class="selectbox">
                        <select id="htContainerNameSelect" class="input select" style="max-width:15ch">
                            <option>image.png</option>
                            <option>unixtime</option>
                        </select>
                        </div>
                        <input id="htContainerName" autocomplete="off">
                    </div>
                    <div style="padding-top:5px;">
                        Подстраивать разрешение картинки под размер поста: <input id="htIsAdjustResolution" type="checkbox">
                        <div id="htAdjustResolutionDiv" style="margin-left:18px;display:none">
                        <input id="htResetAdjustValues" type="button" value="Сбросить параметры" />
                        <div>Пороговый процент заполнения: <input type="number" id="htThresholdDataRatio" min="1" max="100"
                            value="${!isNaN(parseInt(storage.thresholdDataRatio)) ? storage.thresholdDataRatio : DEFAULT_THRESHOLD_DATA_RATIO}" style="width:50px"></div>
                        <div>Максимальный процент заполнения: <input type="number" id="htMaxDataRatio" min="1" max="100"
                            value="${!isNaN(parseInt(storage.maxDataRatio)) ? storage.maxDataRatio : DEFAULT_MAX_DATA_RATIO}" style="width:50px"></div>
                        <div>
                            <div>
                                <div>
                                    <input type="radio" id="pixelCountAdjust" class="pixelCountAdjustClass" value="pixelcount" checked="checked">
                                    <label>Ограничение по количеству пикселей</label>
                                </div>
                                <div id="htPixelCountAdjustDiv" style="margin-left:18px">
                                    <div>Минимум: <input type="number" id="htMinPixelCount" min="1"
                                        value="${!isNaN(parseInt(storage.minPixelCount)) ? storage.minPixelCount : DEFAULT_MIN_PIXEL_COUNT}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMinPixelCountDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.minPixelCountDeviance)) ? storage.minPixelCountDeviance : DEFAULT_MIN_PIXEL_COUNT_DEVIANCE}" style="width:50px"> %</div>
                                    <div>Максимум: <input type="number" id="htMaxPixelCount" min="1"
                                        value="${!isNaN(parseInt(storage.maxPixelCount)) ? storage.maxPixelCount : DEFAULT_MAX_PIXEL_COUNT}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMaxPixelCountDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.maxPixelCountDeviance)) ? storage.maxPixelCountDeviance : DEFAULT_MAX_PIXEL_COUNT_DEVIANCE}" style="width:50px"> %</div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <input type="radio" id="widthAdjust" class="pixelCountAdjustClass" value="width">
                                    <label>Ограничение по ширине</label>
                                </div>
                                <div id="htWidthAdjustDiv" style="margin-left:18px;display:none">
                                    <div>Минимум: <input type="number" id="htMinWidth" min="1"
                                        value="${!isNaN(parseInt(storage.minWidth)) ? storage.minWidth : DEFAULT_MIN_WIDTH}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMinWidthDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.minWidthDeviance)) ? storage.minWidthDeviance : DEFAULT_MIN_WIDTH_DEVIANCE}" style="width:50px"> %</div>
                                    <div>Максимум: <input type="number" id="htMaxWidth" min="1"
                                        value="${!isNaN(parseInt(storage.maxWidth)) ? storage.maxWidth : DEFAULT_MAX_WIDTH}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMaxWidthDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.maxWidthDeviance)) ? storage.maxWidthDeviance : DEFAULT_MAX_WIDTH_DEVIANCE}" style="width:50px"> %</div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <input type="radio" id="heightAdjust" class="pixelCountAdjustClass" value="height">
                                    <label>Ограничение по высоте</label>
                                </div>
                                <div id="htHeightAdjustDiv" style="margin-left:18px;display:none">
                                    <div>Минимум: <input type="number" id="htMinHeight" min="1"
                                        value="${!isNaN(parseInt(storage.minHeight)) ? storage.minHeight : DEFAULT_MIN_HEIGHT}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMinHeightDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.minHeightDeviance)) ? storage.minHeightDeviance : DEFAULT_MIN_HEIGHT_DEVIANCE}" style="width:50px"> %</div>
                                    <div>Максимум: <input type="number" id="htMaxHeight" min="1"
                                        value="${!isNaN(parseInt(storage.maxHeight)) ? storage.maxHeight : DEFAULT_MAX_HEIGHT}" style="width:80px"> пикс. ±
                                        <input type="number" id="htMaxHeightDeviance" min="0" max="99"
                                        value="${!isNaN(parseInt(storage.maxHeightDeviance)) ? storage.maxHeightDeviance : DEFAULT_MAX_HEIGHT_DEVIANCE}" style="width:50px"> %
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
				</div>
                <br>
                <div align="center">
                    <input id="createHiddenPostButton" type="button" value="Создать картинку со скрытопостом" style="padding: 5px;">
                </div>
                <div id="imageContainerDiv" align="center" />
            </div>
            <div id="versionInfo" style="display: flex; justify-content: center;"></div>
            <hr>
        </div>
    `
    let style = document.createElement("style")
    let css = `
        #hiddenPostDiv .mt-1 { margin-top: 1em; }
        #hiddenPostDiv input, textarea {
            border: 1px solid var(--theme_default_btnborder);
            background: var(--theme_default_altbtnbg);
            color: var(--theme_default_btntext);
        }
        #hiddenPostDiv input[type=button] {
            color: var(--theme_default_btntext);
        }
        .post_type_hiddenthread {
            border-left: 3px solid #${storage.postsColor ? storage.postsColor : 'F00000'};
            border-right: 3px solid #${storage.postsColor ? storage.postsColor : 'F00000'};
        }
    `
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style)

    // render
    document.getElementById('postform').insertAdjacentHTML(isDollchan() ? 'afterend' : 'beforeend', formTemplate);

    // Меню
    document.getElementsByClassName('header__opts')[0].insertAdjacentHTML(
        'beforeend', `
        <span>&nbsp;&nbsp;&nbsp;&nbsp;HiddenThread:
        <a id="hideNormalPosts" href="#">Свернуть/развернуть все обычные посты</a>
        | <a id="hiddenThreadSettings" href="#">Настройки</a>
        Л:<span id="hiddenPostsProcessingCount">0</span> Ф:<span id="imagesLoadedCount">0</span>/<span id="imagesCount">0</span> С:<span id="hiddenPostsLoadedCount">0</span> К:<span id="hiddenPostsCachedCount">0</span> Н:<span id="imagesErrorCount">0</span> Б:<span id="hiddenPostsBombLoadedCount">0</span>  <!-- Л - Кол.во картинок которые нужно обработать; Ф - Всего картинок; C - всего картинок со скрытой инфой; К - из кэша; Н - неудачно; Б - всего zip-бомб -->
        <div id="hiddenThreadSettingsWindow" style="display: none; border: solid 1px black; padding: 2px; text-align: left; min-width: 370px; max-width: fit-content; margin: auto;">
            <div>Настройки</div>
            <hr>
            <div>
                <div><input id="htIsDebugLogEnabled" type="checkbox"> <span>Включить debug-лог</span></div>
                <div><input id="htIsQueueLoadEnabled" type="checkbox"> <span>Включить последовательную загрузку скрытопостов</span></div>
                <div><input id="htIsQueueDecodeDisabled" type="checkbox"> <span>Включить параллельное декодирование скрытопостов</span></div>
                <div><input id="htIsPreviewDisabled" type="checkbox"> <span>Отключить превью картинок в скрытопостах</span></div>
                <div><input id="htIsFormClearEnabled" type="checkbox"> <span>Включить очистку полей при создании картинки</span></div>
                <div><input id="htIsAutoScrollEnabled" type="checkbox"> <span>Включить автопрокрутку страницы при загрузке постов</span></div>
                <div><input id="htPostsColor" maxlength="6" size="6"> <span>Цвет выделения скрытопостов (в hex)</span></div>
                <div><input id="htMaxImageRes" type="number" min="0" step="1" size="12"> <span>Макс. разрешение загружаемых картинок, Мп (0 - без лимита)</span></div>
                <div><input id="htMaxCachedPostSize" type="number" min="0" step="1" size="12"> <span>Макс. размер поста в кэше, Кб (0 - без лимита)</span></div>
                <div><input id="htMaxCacheSize" type="number" min="0" step="1" size="12"> <span>Макс. размер кэша, Мб (0 - кэш выключен)</span></div>
                <div>Текущий размер кэша: <span id="htCacheSize">???</span></div>
                <div><button id="htClearCache">Очистить кэш</button></div>
            </div>
            <hr>
            <div>
                <input type="button" class="button" id="hiddenThreadSettingsSave" value="Сохранить">
                <input type="button" class="button" id="hiddenThreadSettingsCancel" value="Отмена">
                <br><i>Для применения обновите страницу</i>
            </div>
        </div>
        </span>`);
    let hiddenThreadSettingsLink = document.getElementById('hiddenThreadSettings');
    hiddenThreadSettingsLink.onclick = function() {
        let settingsWindow = document.getElementById('hiddenThreadSettingsWindow');
        document.getElementById("htIsDebugLogEnabled").checked = storage.isDebugLogEnabled;
        document.getElementById("htIsQueueLoadEnabled").checked = storage.isQueueLoadEnabled;
        document.getElementById("htIsQueueDecodeDisabled").checked = storage.isQueueDecodeDisabled;
        document.getElementById("htIsPreviewDisabled").checked = storage.isPreviewDisabled;
        document.getElementById("htIsFormClearEnabled").checked = storage.isFormClearEnabled;
        document.getElementById("htIsAutoScrollEnabled").checked = storage.isAutoScrollEnabled;
        document.getElementById("htPostsColor").value = storage.postsColor ? storage.postsColor : 'F00000';
        document.getElementById("htMaxImageRes").value = storage.maxImageRes ? storage.maxImageRes :
            (typeof(storage.maxImageRes) == 'number' ? 0 : MAX_IMAGE_RES_DEFAULT);
        document.getElementById("htMaxCachedPostSize").value = storage.maxCachedPostSize ? storage.maxCachedPostSize : 0;
        document.getElementById("htMaxCacheSize").value = storage.maxCacheSize ? storage.maxCacheSize : 0;
        settingsWindow.style.display = settingsWindow.style.display == 'none' ? 'block' : 'none';
    }
    document.getElementById("hiddenThreadSettingsCancel").onclick = function() {
        document.getElementById('hiddenThreadSettingsWindow').style.display = 'none';
    }
    document.getElementById("hiddenThreadSettingsSave").onclick = function() {
        setStorage({ isDebugLogEnabled: document.getElementById("htIsDebugLogEnabled").checked });
        setStorage({ isQueueLoadEnabled: document.getElementById("htIsQueueLoadEnabled").checked });
        setStorage({ isQueueDecodeDisabled: document.getElementById("htIsQueueDecodeDisabled").checked });
        setStorage({ isPreviewDisabled: document.getElementById("htIsPreviewDisabled").checked });
        setStorage({ isFormClearEnabled: document.getElementById("htIsFormClearEnabled").checked });
        setStorage({ isAutoScrollEnabled: document.getElementById("htIsAutoScrollEnabled").checked });
        setStorage({ postsColor: document.getElementById("htPostsColor").value });
        let maxImageRes = parseInt(document.getElementById("htMaxImageRes").value);
        setStorage({ maxImageRes: maxImageRes ? maxImageRes : (typeof(maxImageRes) == 'number' ? 0 : MAX_IMAGE_RES_DEFAULT) });
        let maxCachedPostSize = parseInt(document.getElementById("htMaxCachedPostSize").value);
        setStorage({ maxCachedPostSize: maxCachedPostSize ? maxCachedPostSize : 0 });
        let maxCacheSize = parseInt(document.getElementById("htMaxCacheSize").value);
        setStorage({ maxCacheSize: maxCacheSize ? maxCacheSize : 0 });
        document.getElementById('hiddenThreadSettingsWindow').style.display = 'none';
    }
    let clearCacheButton = document.getElementById("htClearCache");
    clearCacheButton.onclick = async function() {
        let oldText = clearCacheButton.textContent;
        clearCacheButton.textContent = 'Очищаем...';
        clearCacheButton.disabled = true;
        try {
            await HtCache.clearStore();
            alert('Кэш очищен');
        } catch (e) {
            alert('Не удалось очистить кэш: ' + e);
        }
        clearCacheButton.textContent = oldText;
        clearCacheButton.disabled = false;
    }

    let adjustResolutionCheck = document.getElementById('htIsAdjustResolution');
    adjustResolutionCheck.onchange = function () {
        document.getElementById('htAdjustResolutionDiv').style.display = adjustResolutionCheck.checked ? 'block' : 'none';
    }

    let pixelCountAdjustRadio = document.querySelectorAll('input[class="pixelCountAdjustClass"]');
    for (let i = 0; i < pixelCountAdjustRadio.length; i++) {
        pixelCountAdjustRadio[i].addEventListener('change', function() {
            if (this.value == 'pixelcount') {
                document.getElementById('widthAdjust').checked = false;
                document.getElementById('heightAdjust').checked = false;
                document.getElementById('htPixelCountAdjustDiv').style.display = 'block';
                document.getElementById('htWidthAdjustDiv').style.display = 'none';
                document.getElementById('htHeightAdjustDiv').style.display = 'none';
            } else if (this.value == 'width') {
                document.getElementById('pixelCountAdjust').checked = false;
                document.getElementById('heightAdjust').checked = false;
                document.getElementById('htPixelCountAdjustDiv').style.display = 'none';
                document.getElementById('htWidthAdjustDiv').style.display = 'block';
                document.getElementById('htHeightAdjustDiv').style.display = 'none';
            } else if (this.value == 'height') {
                document.getElementById('pixelCountAdjust').checked = false;
                document.getElementById('widthAdjust').checked = false;
                document.getElementById('htPixelCountAdjustDiv').style.display = 'none';
                document.getElementById('htWidthAdjustDiv').style.display = 'none';
                document.getElementById('htHeightAdjustDiv').style.display = 'block';
            }
        });
    }

    let hideEl = document.getElementById('hideNormalPosts');
    hideEl.onclick = function () {
        hidePosts(watchedPosts);
        hideEl.value = !hideEl.value;
    }
    hideEl.value = false;

    let toggleEl = document.getElementById("hiddenThreadToggle")
    toggleEl.onclick = () => {
        setStorage({ hidePostForm: !storage.hidePostForm })
        toggleEl.textContent = toggleText()
        let formEl = document.getElementById("hiddenThreadForm")
        formEl.style.display = storage.hidePostForm
            ? "none"
            : ""
    }

    let toggleSettingsEl = document.getElementById("htPostingSettingsToggle")
    toggleSettingsEl.onclick = () => {
        setStorage({ hideSettingsForm: !storage.hideSettingsForm })
        toggleSettingsEl.textContent = settingsToggleText();
        let formEl = document.getElementById("htPostingSettings")
        formEl.style.display = storage.hideSettingsForm
            ? "none"
            : ""
    }

    document.getElementById('htContainerNameSelect').onchange = function () {
        document.getElementById('htContainerName').value = '';
        if (this.selectedIndex == 0) {
            document.getElementById('htContainerName').placeholder = 'image.png';
        } else {
            document.getElementById('htContainerName').placeholder =
                `${Utils.getRandomInRange(14000000000000, Date.now()*10)}.png`;
        }
        setStorage({ containerName: this.selectedIndex });
    }
    document.getElementById('htContainerNameSelect').selectedIndex = storage.containerName ? storage.containerName : 0;
    document.getElementById('htContainerNameSelect').dispatchEvent(new Event('change'));

    function adjustResolutionCheckHandler() {
        // Для случайных (picsum, imagecdn) и сгенерированных нет оригинального разрешения
        let containerType = document.getElementById('htContainerTypeSelect').selectedIndex;
        let containerPack = document.getElementById('htContainerPackSelect').selectedIndex;
        if ((containerType == 0 && (containerPack == 0 || containerPack == 1)) || containerType == 3) {
            document.getElementById('htIsAdjustResolution').checked = true;
            document.getElementById('htIsAdjustResolution').disabled = true;
            document.getElementById('htAdjustResolutionDiv').style.display = 'block';
        } else {
            document.getElementById('htIsAdjustResolution').disabled = false;
        }
    }

    document.getElementById('htContainerTypeSelect').onchange = function () {
        document.getElementById('htContainerPackSelectDiv').style.display = (this.selectedIndex == 0) ?
            'inline-block' : 'none';
        document.getElementById('htContainerLinkDiv').style.display = (this.selectedIndex == 1) ?
            'block' : 'none';
        document.getElementById('htContainerInputDiv').style.display = (this.selectedIndex == 2) ?
            'block' : 'none';

        adjustResolutionCheckHandler();
        setStorage({ containerType: this.selectedIndex });
    }
    document.getElementById('htContainerTypeSelect').selectedIndex = storage.containerType ? storage.containerType : 0;

    document.getElementById('htContainerPackSelect').onchange = function () {
        adjustResolutionCheckHandler();
        setStorage({ containerPack: this.selectedIndex });
    }
    document.getElementById('htContainerPackSelect').selectedIndex = storage.containerPack ? storage.containerPack : 0;

    document.getElementById('htContainerTypeSelect').dispatchEvent(new Event('change'));
    document.getElementById('htContainerPackSelect').dispatchEvent(new Event('change'));

    document.getElementById('htClearFormButton').onclick = function () {
        document.getElementById('hiddenPostInput').value = '';
        document.getElementById('hiddenFilesInput').value = null;
        let dollchanThumbs = document.getElementsByClassName('de-hiddencontainer-thumb');
        let containerIdList = [];
        for (let thumb of dollchanThumbs) {
            containerIdList.push(thumb.id.split('-').pop());
        }
        for (let id of containerIdList) {
            document.getElementById(`de-hiddencontainer-input-${id}`).value = null;
            document.getElementById(`de-hiddencontainer-input-${id}`).remove();
            document.getElementById(`de-hiddencontainer-thumb-${id}`).remove();
        }
    }

    document.getElementById('hiddenFilesClearButton').onclick = function () {
        document.getElementById('hiddenFilesInput').value = null;
    }

    let createHiddenPostButton = document.getElementById('createHiddenPostButton');
    createHiddenPostButton.onclick = async function () {
        let oldText = createHiddenPostButton.value;
        createHiddenPostButton.value = 'Генерируем картинку...';
        createHiddenPostButton.disabled = true;
        try {
            let res = await createHiddenPost();
            if (res) {
                alert('Спрятано ' + res.len + ' байт (занято ' + res.percent + '% изображения)');
                if (storage.isFormClearEnabled) {
                    document.getElementById('hiddenPostInput').value = '';
                    document.getElementById('hiddenFilesInput').value = null;
                }
                // Сбрасываем название картинки, чтобы оно не повторялось
                document.getElementById('htContainerNameSelect').dispatchEvent(new Event('change'));
            }
        } catch (e) {
            Utils.trace('HiddenThread: Ошибка при создании скрытопоста: ' + e + ' stack:\n' + e.stack);
            alert('Ошибка при создании скрытопоста: ' + e);
        }
        createHiddenPostButton.value = oldText;
        createHiddenPostButton.disabled = false;
        // >>**** cute/18879-кун **** Удаление загруженных файлов после каждого нажатия на "Создать картинку со скрытопостом"
        document.getElementById('hiddenFilesInput').value = null;
        // <<**** cute/18879-кун ****
    }


    // Обработчики элементов в настройках шифрования
    document.getElementById('htPasswordSelect').prevIndex = -1;
    document.getElementById('htPasswordSelect').onchange = function (e) {
        if (this.selectedIndex == this.prevIndex) return;
        /*if (this.selectedIndex == 0) {
            document.getElementById('htPasswordInputDiv').style.display = 'none';
            document.getElementById('htPassword').value = '';
        } else*/
		if (this.selectedIndex == 0) {
            document.getElementById('htPasswordInputDiv').style.display = 'block';
            document.getElementById('htPassword').style.color = '';
            document.getElementById('htPassword').readOnly = false;
            document.getElementById('htPassword').value = '';
        } else {
            document.getElementById('htPasswordInputDiv').style.display = 'block';
            document.getElementById('htPassword').style.color = 'grey';
            document.getElementById('htPassword').readOnly = true;
            document.getElementById('htPassword').value = passwords[this.selectedIndex - 1].value;
        }
		setStorage({htPasswordSelectSelectedIndex: this.selectedIndex});
        this.prevIndex = this.selectedIndex;
    }
    document.getElementById('htPrivateKeySelect').prevIndex = -1;
    document.getElementById('htPrivateKeySelect').onchange = function (e) {
        if (this.selectedIndex == this.prevIndex) return;
        if (this.selectedIndex == 0) {
            document.getElementById('htPrivateKeyInputDiv').style.display = 'none';
            document.getElementById('htPrivateKey').value = '';
            document.getElementById('htPublicKey').value = '';
            document.getElementById('htPrivatePhrase').value = '';
        } else if (this.selectedIndex == 1) {
            document.getElementById('htPrivateKeyInputDiv').style.display = 'block';
            document.getElementById('htPrivatePhraseInputDiv').style.display = 'block';
            document.getElementById('htPrivateKey').style.color = '';
            document.getElementById('htPrivateKey').readOnly = false;
            document.getElementById('htPrivateKey').value = '';
            document.getElementById('htPublicKey').value = '';
            document.getElementById('htPrivatePhrase').value = '';
            document.getElementById('generateKeyPairButton').style.display = '';
        } else {
            document.getElementById('htPrivateKeyInputDiv').style.display = 'block';
            document.getElementById('htPrivatePhraseInputDiv').style.display = 'none';
            document.getElementById('htPrivateKey').style.color = 'grey';
            document.getElementById('htPrivateKey').readOnly = true;
            document.getElementById('htPrivateKey').value = privateKeys[this.selectedIndex - 2].value;
            document.getElementById('htPublicKey').value = privateToPublicKey(privateKeys[this.selectedIndex - 2].value);
            document.getElementById('htPrivatePhrase').value = '';
            document.getElementById('generateKeyPairButton').style.display = 'none';
        }
		setStorage({htPrivateKeySelectSelectedIndex: this.selectedIndex});
        this.prevIndex = this.selectedIndex;
    }
    document.getElementById('htOtherPublicKeySelect').onchange = function (e) {
        if (this.selectedIndex == this.prevIndex) return;
        if (this.selectedIndex == 0) {
            document.getElementById('htOtherPublicKeyInputDiv').style.display = 'none';
            document.getElementById('htOtherPublicKey').value = '';
        } else if (this.selectedIndex == 1) {
            document.getElementById('htOtherPublicKeyInputDiv').style.display = 'block';
            document.getElementById('htOtherPublicKey').style.color = '';
            document.getElementById('htOtherPublicKey').readOnly = false;
            document.getElementById('htOtherPublicKey').value = '';
        } else {
            document.getElementById('htOtherPublicKeyInputDiv').style.display = 'block';
            document.getElementById('htOtherPublicKey').style.color = 'grey';
            document.getElementById('htOtherPublicKey').readOnly = true;
            document.getElementById('htOtherPublicKey').value = otherPublicKeys[this.selectedIndex - 2].value;
        }
		setStorage({htOtherPublicKeySelectSelectedIndex: this.selectedIndex});
        this.prevIndex = this.selectedIndex;
    }

    // Добавляем пароли и ключи в выпадающие списки
    addItemsToSelect(passwords, 'htPasswordSelect');
    addItemsToSelect(privateKeys, 'htPrivateKeySelect');
    addItemsToSelect(otherPublicKeys, 'htOtherPublicKeySelect');

    let generateKeyPairButton = document.getElementById('generateKeyPairButton');
    generateKeyPairButton.onclick = async function () {
        if (!document.getElementById('htPrivateKey').value ||
            confirm('Сгенерировать новую пару ключей? Предыдущая пара будет стерта!'))
        {
            let oldText = generateKeyPairButton.value;
            generateKeyPairButton.value = 'Генерируем ключи...';
            generateKeyPairButton.disabled = true;

            try {
                let pair = await Crypto.generateKeyPair();
                document.getElementById('htPrivatePhrase').value = '';
                document.getElementById('htPrivateKey').value = pair[0];
                document.getElementById('htPublicKey').value = pair[1];
            } catch (e) {
                Utils.trace('HiddenThread: Ошибка при создании ключей: ' + e + ' stack:\n' + e.stack);
                alert('Ошибка при создании ключей: ' + e);
            }

            generateKeyPairButton.value = oldText;
            generateKeyPairButton.disabled = false;
        }
    }

    document.getElementById('htPrivateKey').oninput = function () {
        document.getElementById(`htPrivatePhrase`).value = '';
        document.getElementById('htPublicKey').value =
            privateToPublicKey(document.getElementById('htPrivateKey').value);
    }
    document.getElementById('htPrivatePhrase').oninput = async function () {
        if (document.getElementById('htPrivatePhrase').value) {
            document.getElementById('htPrivateKey').value =
                await Crypto.digestMessageBase58(document.getElementById('htPrivatePhrase').value);
            document.getElementById('htPublicKey').value =
                privateToPublicKey(document.getElementById('htPrivateKey').value);
        } else {
            document.getElementById('htPrivateKey').value = '';
            document.getElementById('htPublicKey').value = '';
        }
    }

    document.getElementById('htPasswordManagerButton').onclick = function() {
        let manager = document.getElementById('htPasswordManagerDiv');
        if (!manager.innerHTML) {
            createManager('Password');
        } else {
            manager.innerHTML = '';
        }
    }
    document.getElementById('htPrivateKeyManagerButton').onclick = function() {
        let manager = document.getElementById('htPrivateKeyManagerDiv');
        if (!manager.innerHTML) {
            createManager('PrivateKey');
        } else {
            manager.innerHTML = '';
        }
    }
    document.getElementById('htOtherPublicKeyManagerButton').onclick = function() {
        let manager = document.getElementById('htOtherPublicKeyManagerDiv');
        if (!manager.innerHTML) {
            createManager('OtherPublicKey');
        } else {
            manager.innerHTML = '';
        }
    }

    // Кнопки разметки
    let textarea = document.getElementById('hiddenPostInput');
    document.getElementById('htMarkupBoldButton').onclick = function() { wrapMarkupTags('[b]', '[/b]', textarea); }
    document.getElementById('htMarkupItalicButton').onclick = function() { wrapMarkupTags('[i]', '[/i]', textarea); }
    document.getElementById('htMarkupGtButton').onclick = function() { wrapMarkupTags('>', '', textarea); }
    document.getElementById('htMarkupUnderlineButton').onclick = function() { wrapMarkupTags('[u]', '[/u]', textarea); }
    document.getElementById('htMarkupOverlineButton').onclick = function() { wrapMarkupTags('[o]', '[/o]', textarea); }
    document.getElementById('htMarkupSpoilerButton').onclick = function() { wrapMarkupTags('[spoiler]', '[/spoiler]', textarea); }
    document.getElementById('htMarkupCrosslineButton').onclick = function() { wrapMarkupTags('[s]', '[/s]', textarea); }
    document.getElementById('htMarkupSuperButton').onclick = function() { wrapMarkupTags('[sup]', '[/sup]', textarea); }
    document.getElementById('htMarkupSubButton').onclick = function() { wrapMarkupTags('[sub]', '[/sub]', textarea); }

    // Кнопка сброса параметров разрешения
    document.getElementById('htResetAdjustValues').onclick = function() {
        document.getElementById('htThresholdDataRatio').value = DEFAULT_THRESHOLD_DATA_RATIO;
        document.getElementById('htMaxDataRatio').value = DEFAULT_MAX_DATA_RATIO;
        document.getElementById('htMinPixelCount').value = DEFAULT_MIN_PIXEL_COUNT;
        document.getElementById('htMinPixelCountDeviance').value = DEFAULT_MIN_PIXEL_COUNT_DEVIANCE;
        document.getElementById('htMaxPixelCount').value = DEFAULT_MAX_PIXEL_COUNT;
        document.getElementById('htMaxPixelCountDeviance').value = DEFAULT_MAX_PIXEL_COUNT_DEVIANCE;
        document.getElementById('htMinWidth').value = DEFAULT_MIN_WIDTH;
        document.getElementById('htMinWidthDeviance').value = DEFAULT_MIN_WIDTH_DEVIANCE;
        document.getElementById('htMaxWidth').value = DEFAULT_MAX_WIDTH;
        document.getElementById('htMaxWidthDeviance').value = DEFAULT_MAX_WIDTH_DEVIANCE;
        document.getElementById('htMinHeight').value = DEFAULT_MIN_HEIGHT;
        document.getElementById('htMinHeightDeviance').value = DEFAULT_MIN_HEIGHT_DEVIANCE;
        document.getElementById('htMaxHeight').value = DEFAULT_MAX_HEIGHT;
        document.getElementById('htMaxHeightDeviance').value = DEFAULT_MAX_HEIGHT_DEVIANCE;
    }
}

function hidePosts(posts) {
    for (let post of posts) {
        let body = document.getElementById(`post-${post}`);
        if (isDollchan()) {
            body.getElementsByClassName('post__message')[0].classList.toggle('de-post-hiddencontent');
            if (body.getElementsByClassName('post__images')[0]) {
                body.getElementsByClassName('post__images')[0].classList.toggle('de-post-hiddencontent');
            }
            let refmaps = body.getElementsByClassName('de-refmap');
            if (refmaps) {
                for (let r of refmaps) {
                    r.classList.toggle('de-post-hiddencontent');
                }
            }
        }
        else {
            body.classList.toggle('post_type_hidden');
        }
    }
}

// Получить посты, которые нужно просмотреть
/*
Возвращает объект:
postsToScan{
    urls: [url1, url2],
    postId: ...
}
*/
function getPostsToScan()
{
    if (isDollchan()) return getPostsToScanFromHtml();

    let threadId = CFG.BOARD.THREADID;
    let thread = window.Post(threadId);
    let postsToScan = [];

    let postIdList = null;
    try {
        postIdList = thread.threadPosts();
    }
    catch (e) {
        // Если не удалось получить объект треда, берем id и ссылки из HTML
        return getPostsToScanFromHtml();
    }

    for (let postId of postIdList) {
        let postAjax = thread.getPostsObj()[String(postId)].ajax;
        if (!postAjax) continue;

        let postFiles = postAjax.files;
        if (!postFiles) continue;

        let images = [];
        for (let file of postFiles) {
            if (file.path.endsWith('.png')) {
                images.push({ url: file.path, width: file.width, height: file.height });
            }
        }
        postsToScan.push({
            images: images,
            postId: postId
        });
    }

    return postsToScan;
}

function getPostsToScanFromHtml() {
    let postsToScan = [];
    let posts = document.getElementsByClassName('post');

    for (let post of posts) {
        let postImages = post.getElementsByClassName('post__images');
        let images = [];
        for (let img of postImages) {
            let urlsHtml = img.getElementsByClassName('post__image-link');
            for (let url of urlsHtml) {
                if (url.href.endsWith('.png')) {
                    let imgEl = url.children[0];
                    images.push({ url: url.href, width: parseInt(imgEl.getAttribute('data-width')),
                        height: parseInt(imgEl.getAttribute('data-height')) });
                }
            }
        }
        postsToScan.push({
            images: images,
            postId: post.getAttribute('data-num')
        });
    }

    return postsToScan;
}


async function getCacheSizeReadable() {
    try {
        let size = await HtCache.getCacheSize();
        return Utils.getHumanReadableSize(size);
    } catch (e) {}
    return "???";
}

async function getIdbUsageReadable() {
    try {
        const quota = await navigator.storage.estimate();
        return Utils.getHumanReadableSize(quota.usage);
    } catch (e) {}
    return "???";
}

// множество ID просмотренных постов
let watchedPosts = new Set();
// множество ID просмотренных картинок
let watchedImages = new Set();
// множество ID картинок с загруженными скрытопостами
let loadedPosts = new Set();
let scanning = false;
let isReloadRequested = false;
/*
Просмотреть все посты и попробовать расшифровать
*/
async function loadHiddenThread() {
    if (scanning) {
        return; // Чтобы не запускалось в нескольких потоках
    }
    scanning = true;

    // Запрос на сброс загруженных картинок, чтобы проверить их с измененными паролями
    if (isReloadRequested) {
        document.getElementById("imagesLoadedCount").textContent = loadedPosts.size;
        document.getElementById("imagesErrorCount").textContent = '0';
        watchedImages = new Set();
        isReloadRequested = false;
    }

    let postsToScan = getPostsToScan();

    document.getElementById("imagesCount").textContent = getImagesCount(postsToScan).toString();
    document.getElementById('htCacheSize').textContent = `???+ ${await getCacheSizeReadable()} (IDB usage: ${await getIdbUsageReadable()})`;

    // Добавляем пустой пароль
    let actualPasswords = passwords;

    let passwordHashes = [];
    for (let password of actualPasswords) {
        passwordHashes.push(await Crypto.digestMessageHex(password.value));
    }
    let privateKeyHashes = [];
    for (let privateKey of privateKeys) {
        privateKeyHashes.push(await Crypto.digestMessageHex(privateKey.value));
    }

    let loadPostPromises = [];
    for (let post of postsToScan) {
        for (let image of post.images) {
            let imgId = getImgName(image.url);
            if (loadedPosts.has(imgId) || watchedImages.has(imgId)) {
                continue;
            }
            watchedImages.add(imgId);

            let pixelLimit = storage.maxImageRes ? (storage.maxImageRes) :
                (typeof(storage.maxImageRes) == 'number' ? 0 : MAX_IMAGE_RES_DEFAULT);
            pixelLimit = pixelLimit * 1000000;
            if (pixelLimit > 0 && image.width * image.height > pixelLimit)
                continue;

            function promiseGenerator() {
                return new Promise(async function(resolve, reject) {
                    document.getElementById("hiddenPostsProcessingCount").textContent =
                        parseInt(document.getElementById("hiddenPostsProcessingCount").textContent) + 1;
                    try {
                        await loadPost(post.postId, image.url, actualPasswords, privateKeys, passwordHashes, privateKeyHashes);
                    }
                    catch(e) {
                        Utils.trace('HiddenThread: Ошибка при загрузке поста: ' + e + ' stack:\n' + e.stack);
                    }
                    document.getElementById("hiddenPostsProcessingCount").textContent =
                        parseInt(document.getElementById("hiddenPostsProcessingCount").textContent) - 1;
                    resolve();
                });
            }

            let p = promiseGenerator();
            if(storage.isQueueLoadEnabled) {
                await p;
            } else {
                loadPostPromises.push(p);
            }
        }
        if (!watchedPosts.has(post.postId)) {
            watchedPosts.add(post.postId);
            if (document.getElementById('hideNormalPosts').value) {
                hidePosts([post.postId]);
            }
        }
    }

    await Promise.all(loadPostPromises);

    document.getElementById('htCacheSize').textContent = `${await getCacheSizeReadable()} (IDB usage: ${await getIdbUsageReadable()})`;

    scanning = false;
}

function loadPasswordsAndKeys() {
    passwords = storage.passwords ? storage.passwords : [{alias:'Без пароля', value:''}];
    passwordAliases = {};
    for (let password of passwords) {
        passwordAliases[password.value] = password.alias;
    }

    privateKeys = storage.privateKeys ? storage.privateKeys : [];
    privateKeyAliases = {};
    for (let privateKey of privateKeys) {
        privateKeyAliases[privateKey.value] = privateKey.alias;
    }

    otherPublicKeys = storage.otherPublicKeys ? storage.otherPublicKeys : [];
    otherPublicKeyAliases = {};
    for (let otherPublicKey of otherPublicKeys) {
        otherPublicKeyAliases[otherPublicKey.value] = otherPublicKey.alias;
    }
}

function getImagesCount(postsToScan) {
    let r = 0;
    for (let i = 0; i < postsToScan.length; i++) {
        r += postsToScan[i].images.length;
    }
    return r;
}

function isDollchan() {
    return document.getElementsByClassName('de-runned').length;
}

function isMakaba() {
    return document.getElementsByClassName('makaba').length
}

// Работаем только на главной и в тредах
if (!isMakaba()) return;

if (!storage.isDebugLogEnabled)
    Utils.trace = function() {}

HtCache.initCacheStorage(storage.maxCacheSize ? storage.maxCacheSize : 0);
loadPasswordsAndKeys();

createInterface();
CheckVersion();

setInterval(loadHiddenThread, 5000);

},{"./cache.js":9,"./crypto.js":10,"./post.js":12,"./utils.js":14}],12:[function(require,module,exports){
let Utils = require('./utils.js')
let Crypto = require('./crypto.js')
let Stegano = require('./stegano.js')
let JSZip = require('../lib/jszip.min.js')

const NORMAL_POST_TYPE = 0;
const SIGNED_POST_TYPE = 1;

const MESSAGE_MAX_LENGTH = 50000
const MAX_FILES_COUNT = 40;
const MAX_FILENAME_LENGTH = 50;

function calcContainerSize(container, ratio, dataLength, pixelCount) {
    let newPixelCount = dataLength / container.thresholdDataRatio / 3;
    let newWidth = Math.sqrt(newPixelCount * ratio);
    let newHeight = newWidth / ratio;

    let minValue = null;
    let minValueDeviance = null;
    let maxValue = null;
    let maxValueDeviance = null;
    if (container.pixelCountAdjust == 'pixelcount') {
        minValue = container.minPixelCount;
        minValueDeviance = container.minPixelCountDeviance;
        maxValue = container.maxPixelCount;
        maxValueDeviance = container.maxPixelCountDeviance;
    } else if (container.pixelCountAdjust == 'width') {
        minValue = container.minWidth;
        minValueDeviance = container.minWidthDeviance;
        maxValue = container.maxWidth;
        maxValueDeviance = container.maxWidthDeviance;
    } else if (container.pixelCountAdjust == 'height') {
        minValue = container.minHeight;
        minValueDeviance = container.minHeightDeviance;
        maxValue = container.maxHeight;
        maxValueDeviance = container.maxHeightDeviance;
    }
    const minValueDeviancePix = minValue * minValueDeviance;
    const maxValueDeviancePix = maxValue * maxValueDeviance;
    minValue = Utils.getRandomInRange(minValue - minValueDeviancePix, minValue + minValueDeviancePix);
    maxValue = Utils.getRandomInRange(maxValue - maxValueDeviancePix, maxValue + maxValueDeviancePix);

    if (container.pixelCountAdjust == 'pixelcount') {
        newPixelCount = Math.min(Math.max(newPixelCount, minValue), maxValue);
        newWidth = Math.sqrt(newPixelCount * ratio);
        newHeight = newWidth / ratio;
    } else if (container.pixelCountAdjust == 'width') {
        newWidth = Math.min(Math.max(newWidth, minValue), maxValue);
        newHeight = newWidth / ratio;
        newPixelCount = newWidth * newHeight;
    } else if (container.pixelCountAdjust == 'height') {
        newHeight = Math.min(Math.max(newHeight, minValue), maxValue);
        newWidth = newHeight * ratio;
        newPixelCount = newWidth * newHeight;
    }

    let newFillRatio = dataLength / (newPixelCount * 3);
    if (newFillRatio > container.maxDataRatio)
        return null;

    return {
        scale: Math.sqrt(newPixelCount / pixelCount),
        width: Math.ceil(newWidth),
        height: Math.ceil(newHeight),
    };
}

async function hideDataToImage(container, data) {
    let imageBitmap = await createImageBitmap(container.image);
    let pixelCount = imageBitmap.width * imageBitmap.height;
    let rgbCount = pixelCount * 3;
    let ratio = imageBitmap.width / imageBitmap.height;

    let scale = 1;
    if (container.isAdjustResolution) {
        let containerSize = calcContainerSize(container, ratio, data.length, pixelCount);
        if (!containerSize)
            throw new Error('Невозможно вместить данные в контейнер, необходимо увеличить '+
                'максимальный процент заполнения или выбрать большее разрешение.');
        scale = containerSize.scale;
    }
    else if (rgbCount < data.length) {
        let rest = Math.ceil((data.length - rgbCount) / 3);
        throw new Error('Невозможно вместить данные в контейнер, необходимо ещё ' +
            'как минимум ' + rest + ' пикселей. Выбери картинку с большим разрешением.');
    }

    let canvas = document.createElement('canvas');
    canvas.width = Math.ceil(imageBitmap.width * scale);
    canvas.height = Math.ceil(imageBitmap.height * scale);

    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.scale(scale, scale);
    ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Убираем прозрачность
    for (let i = 3; i < imageData.data.length; i+=4) {
        if (imageData.data[i] != 255) imageData.data[i] = 255;
    }
    let newImageData = await Stegano.hideDataToArray(imageData.data, data);
    for (let i = 0; i < newImageData.length; i++)
        imageData.data[i] = newImageData[i];
    ctx.putImageData(imageData, 0, 0);

    let percent = (data.length / (imageData.data.length / 4 * 3) * 100).toFixed(2);
    return { 'canvas': canvas, 'len': data.length, 'percent': percent };
}

function createHeader(type, totalLength) {
    let header = new Uint8Array(Crypto.BLOCK_SIZE);
    header.set(new TextEncoder().encode('ht'));
    let version = 0x01;
    header[2] = version & 0xFF;
    header[3] = (version >> 8) & 0xFF;
    let blocksCount = Math.ceil((Crypto.BLOCK_SIZE + totalLength + 1) / Crypto.BLOCK_SIZE);
    header[4] = blocksCount & 0xFF;
    header[5] = (blocksCount >> 8) & 0xFF;
    header[6] = (blocksCount >> 16) & 0xFF;
    header[7] = (blocksCount >> 24) & 0xFF;
    let time = Math.ceil(new Date().getTime() / 1000);
    header[8] = time & 0xFF;
    header[9] = (time >> 8) & 0xFF;
    header[10] = (time >> 16) & 0xFF;
    header[11] = (time >> 24) & 0xFF;
    header[12] = type;
    header[15] = 0x01; // PKCS#7 padding

    return header;
}

async function packPost(message, files, privateKey) {
    let zip = new JSZip();
    zip.file("_post.txt", message);
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        zip.file(f.name, f);
    }

    let archive = await zip.generateAsync({
        type: "uint8array",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9 // [1..9]
        }
    });

    let data = null;
    // Если указан приватный ключ, подписываем пост
    if (privateKey.length > 0) {
        let header = createHeader(SIGNED_POST_TYPE, Crypto.PUBLIC_KEY_SIZE + Crypto.SIGNATURE_SIZE + archive.length);
        let publicKeyArray = Crypto.importPublicKeyArrayFromPrivateKey(privateKey);

        data = new Uint8Array(Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE + Crypto.SIGNATURE_SIZE + archive.length);
        data.set(header);
        data.set(publicKeyArray, Crypto.BLOCK_SIZE);
        // Сигнатура будет вставлена после подписывания поста
        data.set(archive, Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE + Crypto.SIGNATURE_SIZE);

        let signatureArray = await Crypto.sign(privateKey, data);
        if (signatureArray.length != Crypto.SIGNATURE_SIZE || publicKeyArray.length != Crypto.PUBLIC_KEY_SIZE) {
            Utils.trace('HiddenThread: signature and publicKey:');
            Utils.trace(signatureArray);
            Utils.trace(publicKeyArray);
            throw new Error("signatureArray or publicKeyArray size incorrect");
        }
        data.set(signatureArray, Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE);
    }
    else {
        let header = createHeader(NORMAL_POST_TYPE, archive.length);
        data = new Uint8Array(header.length + archive.length);
        data.set(header);
        data.set(archive, header.length);
    }

    return data;
}

async function encryptPost(message, files, password, privateKey, otherPublicKey) {
    let oneTimePublicKey = null;
    if (otherPublicKey.length > 0) {
        // Создаем одноразовую пару ключей
        let pair = await Crypto.generateKeyPair();
        // Генерируем секрет с одноразовым приватным ключом и публичным ключом получателя
        password = await Crypto.deriveSecretKey(pair[0], otherPublicKey)
        // Получатель сгенерирует секрет нашим одноразовым публичным ключом и своим приватным
        oneTimePublicKey = Utils.base58ToArray(pair[1]);
    }

    let postData = await packPost(message, files, privateKey);

    let encryptedData = await Crypto.encrypt(password, postData);

    if (oneTimePublicKey != null) {
        // Вставляем одноразовый ключ в начало массива данных
        let keyAndData = new Uint8Array(oneTimePublicKey.length + encryptedData.length);
        keyAndData.set(oneTimePublicKey);
        keyAndData.set(encryptedData, oneTimePublicKey.length);
        encryptedData = keyAndData;
    }
    return { data: encryptedData, password: password };
}

async function getContainer(url) {
    let image = new Image();
    image.crossOrigin = "anonymous";
    try {
        image.src = url;
        await image.decode();
    } catch (e) {
        Utils.trace(`HiddenThread: ошибка при загрузке контейнера по ссылке "${image.src}": ${e}`);
        throw new Error('Не удалось загрузить контейнер по ссылке. Попробуйте ещё раз или выберите другую картинку.');
    }
    return image;
}

async function getRandomContainer(container, dataLength) {
    const RATIO = Utils.getRandomInRange(1.2, 2.0, true);

    let containerSize = calcContainerSize(container, RATIO, dataLength, 1);
    if (!containerSize)
        throw new Error('Невозможно вместить данные в контейнер, необходимо увеличить '+
            'максимальный процент заполнения или выбрать большее разрешение.');

    let width = containerSize.width;
    let height = containerSize.height;

    let image = new Image();
    image.crossOrigin = "anonymous";
    try {
        // ?x=... нужно для отключения кэша
        let nocache = `x=${Date.now()}`;
        if (container.pack == 0) {
            image.src = `https://picsum.photos/${width}/${height}?${nocache}`;
        } else if (container.pack == 1) {
            image.src = `https://random.imagecdn.app/${width}/${height}?${nocache}`;
        } else if (container.pack == 2) {
            image.src = `https://cataas.com/cat?${nocache}`;
        } else if (container.pack == 3) {
            let jsonUrl = `https:///api/breeds/image/random?${nocache}`;
            let response = await fetch(jsonUrl);
            if (!response.ok)
                throw new Error(`fetch not ok, url: ${jsonUrl}`);
            let obj = await response.json();
            if (!obj.status || obj.status !== 'success' || !obj.message)
                throw new Error(`wrong object: ${JSON.stringify(obj)}`);
            image.src = obj.message;
        } else if (container.pack == 4) {
            let jsonUrl = `https://api.waifu.pics/sfw/waifu?${nocache}`;
            let response = await fetch(jsonUrl);
            if (!response.ok)
                throw new Error(`fetch not ok, url: ${jsonUrl}`);
            let obj = await response.json();
            if (!obj.url)
                throw new Error(`wrong object: ${JSON.stringify(obj)}`);
            image.src = obj.url;
        } else if (container.pack == 5) {
            let jsonUrl = `https://api.waifu.pics/nsfw/waifu?${nocache}`;
            let response = await fetch(jsonUrl);
            if (!response.ok)
                throw new Error(`fetch not ok, url: ${jsonUrl}`);
            let obj = await response.json();
            if (!obj.url)
                throw new Error(`wrong object: ${JSON.stringify(obj)}`);
            image.src = obj.url;
        }

        // Для картинок без родного разрешения отключаем подстройку, чтобы не масштабировать лишний раз
        if (container.pack == 0 || container.pack == 1) {
            container.isAdjustResolution = false
        }
        await image.decode();
    } catch (e) {
        Utils.trace(`HiddenThread: ошибка при загрузке случайного контейнера "${image.src}": ${e}`);
        if (container.pack == 4) {
            throw new Error('Не удалось загрузить случайный контейнер. Попробуйте ещё раз или выберите свою картинку.\n' +
                'Для загрузки с waifu.pics нужно установить расширение для обхода настроек CORS ' +
                '(для firefox - CORS Everywhere, для chrome - CORS Unblock)');
        } else {
            throw new Error('Не удалось загрузить случайный контейнер. Попробуйте ещё раз или выберите свою картинку.');
        }
    }
    return image;
}

async function createHiddenPostImpl(container, message, files, password, privateKey, otherPublicKey) {
    let encryptedPost = await encryptPost(message, files, password, privateKey, otherPublicKey);
    if (!container.image) {
        if (typeof(container.pack) == 'number') {
            container.image = await getRandomContainer(container, encryptedPost.data.length);
        } else if (container.url) {
            container.image = await getContainer(container.url);
        } else {
            throw new Error('Введите ссылку для загрузки контейнера!');
        }
    }
    let imageResult = await hideDataToImage(container, encryptedPost.data);

    return {
        imageResult: imageResult,
        password: encryptedPost.password,
        iv: encryptedPost.data.subarray(0, Crypto.IV_SIZE)
    };
}

async function getMimeType(blob) {
    function check(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    let data = new Uint8Array(await blob.slice(0,12).arrayBuffer());
    if (check([0x89, 0x50, 0x4E, 0x47], data)) {
        return 'image/png';
    } else if (check([0xFF, 0xD8, 0xFF], data)) {
        return 'image/jpeg';
    } else if (check([0x52, 0x49, 0x46, 0x46], data) && check([0x57, 0x45, 0x42, 0x50], data.slice(8, 12))) {
        return 'image/webp';
    } else if (check([0x49, 0x44, 0x33], data)) {
        return 'audio/mpeg';
    } else if (check([0x47, 0x49, 0x46], data)) {
        return 'image/gif';
    } else if (check([0x66, 0x74, 0x79, 0x70], data.slice(4, 8))) {
        return 'video/mp4';
    } else if (check([0x1A, 0x45, 0xDF, 0xA3], data)) {
        return 'video/webm';
    }
    return '';
}

async function unzipPostData(zipData) {
    let zip = new JSZip();
    let unpackResult = null;
    let hasSkippedFiles = false;
    let postMessage = '';
    let files = [];
    let filesCount = 0;
    try {
        let archive = await zip.loadAsync(zipData);
		filesLength = Object.keys(archive.files).length;
        if (filesLength > MAX_FILES_COUNT)
        {
            bomb = bomb + 1;
            document.getElementById("hiddenPostsBombLoadedCount").textContent = bomb;
			return {
				'message': '',
				'files': [],
				'hasSkippedFiles': false,
				'unpackResult': "Анон наспамил " + filesLength + " файлов",
			};

        }

        for (const filename in archive.files) {
            let uncompressedSize = archive.files[filename]._data.uncompressedSize;
            const mbfileSize = Math.floor(uncompressedSize / 1024 / 1024);
            if (mbfileSize > 25) {
            bomb = bomb + 1;
            document.getElementById("hiddenPostsBombLoadedCount").textContent = bomb;
                return {
                    'message': '',
                    'files': [],
                    'hasSkippedFiles': false,
                    'unpackResult': "Анон вкинул файл весом " + mbfileSize + "мб",
                };
            }
            if (uncompressedSize < 0) {
            bomb = bomb + 1;
            document.getElementById("hiddenPostsBombLoadedCount").textContent = bomb;
                return {
                    'message': '',
                    'files': [],
                    'hasSkippedFiles': false,
                    'unpackResult': "Анон вкинул zip-бомбу",
                };
            }
            filesCount++;
            if (filesCount > MAX_FILES_COUNT) {
                hasSkippedFiles = true;
                files.push({ 'name': '_allFiles.zip', 'data': new Blob([zipData], {type: 'application/zip'}) });
                break;
            }

            if (filename == '_post.txt') {
                postMessage = await archive.file(filename).async('string');
                if (postMessage.length > MESSAGE_MAX_LENGTH) {
                    postMessage = postMessage.substring(0, MESSAGE_MAX_LENGTH) +
                        '...(часть сообщения обрезана, смотри файл ' + filename + ')';
                    let postMessageFileData = await archive.file(filename).async('blob');
                    postMessageFileData = postMessageFileData.slice(0, postMessageFileData.size, 'text/plain; charset=utf-8');
                    files.push({ 'name': filename, 'data': postMessageFileData });
                }
            }
            else {
                let fileData = await archive.file(filename).async('blob');
                let mimeType = await getMimeType(fileData);
                if (mimeType) {
                    fileData = fileData.slice(0, fileData.size, mimeType);
                }
                files.push({'name': filename, 'data': fileData});
            }
        }
    }
    catch (e) {
        Utils.trace('HiddenThread: Ошибка при распаковке архива: ' + e);
        unpackResult = 'Не удалось распаковать весь пост, контейнер поврежден';
    }

    return {
        'message': postMessage,
        'files': files,
        'hasSkippedFiles': hasSkippedFiles,
        'unpackResult': unpackResult
    };
}

async function verifyPostData(data) {
    let keySigPair = [data.subarray(Crypto.BLOCK_SIZE, Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE),
    // Копируем сигнатуру
    new Uint8Array(data.subarray(Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE,
        Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE + Crypto.SIGNATURE_SIZE))];

    // Обнуляем поле с сигнатурой, чтобы получить корректный хэш при проверке
    data.set(new Uint8Array(Crypto.SIGNATURE_SIZE), Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE);

    let isVerified = false;
    try {
        isVerified = await Crypto.verify(keySigPair[0], keySigPair[1], data);
    }
    catch (e) {
        Utils.trace('HiddenThread: Ошибка при проверке подписи: ' + e + ' stack:\n' + e.stack);
    }
    let verifyResult = {
        'publicKey': Utils.arrayToBase58(keySigPair[0]),
        'signature': Utils.arrayToBase58(keySigPair[1]),
        'isVerified': isVerified
    };
    return verifyResult;
}

function parseHeader(header) {
    return {
        'magic': new TextDecoder().decode(header.subarray(0, 2)),
        'version': header[2] + (header[3] << 8),
        'blocksCount': header[4] + (header[5] << 8) + (header[6] << 16) + (header[7] << 24),
        'timestamp': header[8] + (header[9] << 8) + (header[10] << 16) + (header[11] << 24),
        'type': header[12]
    };
}

async function decryptData(password, hiddenDataHeader, imageArray, dataOffset) {
    let dataHeader = null;
    try {
        dataHeader = await Crypto.decrypt(password, hiddenDataHeader, true);
    }
    catch (e) {
        // Не удалось расшифровать заголовок, либо неверный пароль, либо это не скрытопост
        return null;
    }

    let header = parseHeader(dataHeader);
    if (header.magic != 'ht') {
        Utils.trace('HiddenThread: Неверная сигнатура: ' + header.magic);
        return null;
    }

    Utils.trace('HiddenThread: version ' + header.version);
    Utils.trace('HiddenThread: blocksCount ' + header.blocksCount);
    Utils.trace('HiddenThread: timestamp ' + header.timestamp);
    Utils.trace('HiddenThread: type ' + header.type);

    let maxHiddenDataLength = imageArray.length / 4 * 3;
    let hiddenDataLength = Crypto.IV_SIZE + header.blocksCount * Crypto.BLOCK_SIZE;
    Utils.trace('HiddenThread: hiddenDataLength (+IV) ' + hiddenDataLength);
    if (hiddenDataLength > maxHiddenDataLength) {
        Utils.trace('HiddenThread: blocksCount * Crypto.BLOCK_SIZE: ' + (header.blocksCount * Crypto.BLOCK_SIZE) + ' > maxHiddenDataLength: ' + maxHiddenDataLength);
        return null;
    }

    // Заголовок верный, расшифровываем остальной пост
    let hiddenDataSize = dataOffset + hiddenDataLength;
    let hiddenData = await Stegano.extractDataFromArray(imageArray, hiddenDataSize);
    hiddenData = hiddenData.subarray(dataOffset);

    let decryptedData = null;
    try {
        decryptedData = await Crypto.decrypt(password, hiddenData);
    }
    catch (e) {
        Utils.trace('HiddenThread: Не удалось расшифровать данные: ' + e);
        return null;
    }
    return {
        'header': header,
        'data': decryptedData
    };
}

async function getImageData(imgArrayBuffer) {
    let imgUint8Array = new Uint8Array(imgArrayBuffer);

    // Если есть sRGB chunk, то принудительно ставим "rendering intent" в "AbsoluteColorimetric",
    // чтобы при чтении значений пикселей возвращалось истинное значение цвета
    // https://bugzilla.mozilla.org/show_bug.cgi?id=867594
    if (imgUint8Array[0x25] == 0x73 && imgUint8Array[0x26] == 0x52 &&
        imgUint8Array[0x27] == 0x47 && imgUint8Array[0x28] == 0x42)
    {
        imgUint8Array[0x29] = 3;
    }

    let imgBlob = new Blob([imgUint8Array], {'type': 'image/png'});
    const img = new Image();
    await new Promise(function(resolve, reject) {
        img.onload = function(event) {
            URL.revokeObjectURL(event.target.src);
            resolve();
        }
        img.onerror = function(event) {
            reject(event);
        }
        img.src = URL.createObjectURL(imgBlob);
    });

    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Возвращает объект скрытого поста
async function loadPostFromImage(imgArrayBuffer, passwords, privateKeys, myPrivatePosts) {
    let imageData = await getImageData(imgArrayBuffer);

    let hiddenDataHeader = null;
    let hiddenDataPrivatePostHeader = null;
    let rgbCount = imageData.data.length / 4 * 3;
    if (rgbCount < Crypto.IV_SIZE + Crypto.BLOCK_SIZE) {
        // Слишком маленький контейнер, это не скрытопост
        return null;
    } else if (rgbCount < Crypto.PUBLIC_KEY_SIZE + Crypto.IV_SIZE + Crypto.BLOCK_SIZE) {
        // Извлекаем заголовок для обычного скрытопоста (IV и первый блок AES)
        let hiddenDataHeaderSize = Crypto.IV_SIZE + Crypto.BLOCK_SIZE;
        hiddenDataHeader = await Stegano.extractDataFromArray(imageData.data, hiddenDataHeaderSize);
    } else {
        // Извлекаем заголовок для обычного скрытопоста (IV и первый блок AES)
        // и для приватного скрытопоста (одноразовый публичный ключ, IV и первый блок AES)
        let hiddenDataHeaderSize = Crypto.PUBLIC_KEY_SIZE + Crypto.IV_SIZE + Crypto.BLOCK_SIZE;
        hiddenDataPrivatePostHeader = await Stegano.extractDataFromArray(imageData.data, hiddenDataHeaderSize);
        hiddenDataHeader = hiddenDataPrivatePostHeader.subarray(0, Crypto.IV_SIZE + Crypto.BLOCK_SIZE);
    }


    let isPrivate = false;
    let decryptedData = null;
    let correctPassword = null;
    let correctPrivateKey = null;
    let otherPublicKey = null;
    let iv = hiddenDataHeader.subarray(0, Crypto.IV_SIZE);

    // Пробуем расшифровать как приватный пост, отправленный нами
    if (hiddenDataPrivatePostHeader) {
        for (let myPrivatePost of myPrivatePosts) {
            let ivMatch = true;
            for (let i = 0; i < Crypto.IV_SIZE; i++) {
                if (iv[i] != myPrivatePost.iv[i]) {
                    ivMatch = false;
                    break;
                }
            }
            if (!ivMatch) continue;

            decryptedData = await decryptData(myPrivatePost.password,
                hiddenDataPrivatePostHeader.subarray(Crypto.PUBLIC_KEY_SIZE),
                imageData.data, Crypto.PUBLIC_KEY_SIZE);
            if (decryptedData) {
                otherPublicKey = myPrivatePost.otherPublicKey;
                break;
            }
        }
    }

    if (decryptedData == null) {
        // Пробуем расшифровать как публичный пост
        for (let password of passwords) {
            decryptedData = await decryptData(password.value, hiddenDataHeader, imageData.data, 0);
            if (decryptedData) {
                correctPassword = password.value;
                break;
            }
        }
    }

    if (decryptedData == null && privateKeys.length > 0 && hiddenDataPrivatePostHeader) {
        isPrivate = true;
        // Генерируем секрет с одноразовым публичным ключом отправителя и своим приватным ключом
        let hiddenOneTimePublicKey = hiddenDataPrivatePostHeader.subarray(0, Crypto.PUBLIC_KEY_SIZE);
        let oneTimePublicKey = Utils.arrayToBase58(hiddenOneTimePublicKey);

        for (let privateKey of privateKeys) {
            let secretPassword = null;
            try {
                secretPassword = await Crypto.deriveSecretKey(privateKey.value, oneTimePublicKey);
            }
            catch (e) {
                // Не удалось сгенерировать секрет, либо неверный ключ, либо это не скрытопост
            }

            if (secretPassword) {
                // Пробуем расшифровать как приватный пост
                decryptedData = await decryptData(secretPassword,
                    hiddenDataPrivatePostHeader.subarray(Crypto.PUBLIC_KEY_SIZE),
                    imageData.data, Crypto.PUBLIC_KEY_SIZE);
                if (decryptedData) {
                    correctPrivateKey = privateKey.value;
                    break;
                }
            }
        }
    }

    // Расшифровать не получилось
    if (decryptedData == null) return null;

    let zipOffset = null;
    let verifyResult = null;
    if (decryptedData.header.type == SIGNED_POST_TYPE) {
        verifyResult = await verifyPostData(decryptedData.data);
        zipOffset = Crypto.BLOCK_SIZE + Crypto.PUBLIC_KEY_SIZE + Crypto.SIGNATURE_SIZE;
    }
    else {
        zipOffset = Crypto.BLOCK_SIZE;
    }

    let zipDataArray = decryptedData.data.subarray(zipOffset);
    let zipData = new Blob([zipDataArray], {type: 'application/zip'});

    return {
        password: correctPassword,
        privateKey: correctPrivateKey,
        otherPublicKey: otherPublicKey,
        timestamp: decryptedData.header.timestamp,
        publicKey: verifyResult ? verifyResult.publicKey : null,
        isVerified: verifyResult ? verifyResult.isVerified : null,
        isPrivate: isPrivate,
        zipData: zipData,
    };
}

async function createImagePreview(blobLink) {
    const MAX_PREVIEW_WIDTH = 200;
    const MAX_PREVIEW_HEIGHT = 300;
    let imagePreviewLink = document.createElement('a');
    let imagePreview = document.createElement('img');
    imagePreview.src = blobLink;
    try {
        await imagePreview.decode();
    } catch (e) {}
    imagePreviewLink.appendChild(imagePreview);
    imagePreview.style = `max-width:${MAX_PREVIEW_WIDTH}px;max-height:${MAX_PREVIEW_HEIGHT}px;`;
    imagePreviewLink.href = blobLink;
    imagePreviewLink.target = "_blank";

    function imagePreviewClickListener(e) {
        e.preventDefault();

        // Закрываем текущую картинку при открытии новой
        let prevImageExpandedDiv = document.getElementById('htImageExpanded');
        if (prevImageExpandedDiv) {
            prevImageExpandedDiv.remove();
            if (prevImageExpandedDiv.children[0].href == imagePreviewLink.href)
                return;
        }

        let imageExpanded = document.createElement('img');
        imageExpanded.src = blobLink;
        imageExpanded.style = 'width:inherit;height:inherit;border:2px solid #222;';

        let initLeft = window.innerWidth/2 - imageExpanded.width/2;
        let initTop = window.innerHeight/2 - imageExpanded.height/2;

        // Уменьшаем картинку сразу, если он не влезает в экран
        let initScale = 1;
        let widthFill = imageExpanded.width / window.innerWidth;
        let heightFill = imageExpanded.height / window.innerHeight;
        let maxFill = Math.max(widthFill, heightFill);
        if (maxFill > 0.8)
            initScale = 0.8 / maxFill;
        let scale = initScale;

        let imageExpandedDiv = document.createElement('div');
        imageExpandedDiv.id = 'htImageExpanded';
        imageExpandedDiv.style.zIndex = 0;
        imageExpandedDiv.style.left = `${initLeft}px`;
        imageExpandedDiv.style.top = `${initTop}px`;
        imageExpandedDiv.style.position = 'fixed';
        imageExpandedDiv.style.transform = `scale(${scale})`;

        let imageExpandedLink = document.createElement('a');
        imageExpandedLink.appendChild(imageExpanded);
        imageExpandedLink.style = 'width:inherit;height:inherit';
        imageExpandedLink.href = blobLink;
        imageExpandedLink.target = "_blank";
        imageExpandedLink.onclick = function(e) { e.preventDefault(); };

        // Зум картинки
        let wheelListener = function(e) {
            e.preventDefault();
            scale += e.deltaY * -0.005;
            scale = Math.min(Math.max(initScale*0.1, scale), initScale*10);
            imageExpandedDiv.style.transform = `scale(${scale})`;
        };
        imageExpanded.onwheel = wheelListener;

        let initialImageLeft = 0;
        let initialImageTop = 0;

        // Захват картинки для перетаскивания
        imageExpandedDiv.onmousedown = function(e) {
            e.preventDefault();
            initialImageLeft = imageExpandedDiv.style.left;
            initialImageTop = imageExpandedDiv.style.top;

            let offsetX = e.clientX - parseInt(imageExpandedDiv.style.left.slice(0, imageExpandedDiv.style.left.length-2));
            let offsetY = e.clientY - parseInt(imageExpandedDiv.style.top.slice(0, imageExpandedDiv.style.top.length-2));

            // Перетаскивание
            let mousemoveListener = function(e) {
                let topAmount = e.clientY - offsetY;
                imageExpandedDiv.style.top = topAmount + 'px';
                let leftAmount = e.clientX - offsetX;
                imageExpandedDiv.style.left = leftAmount + 'px';
            };
            window.addEventListener('mousemove', mousemoveListener);

            // Отпускание картинки
            window.addEventListener('mouseup', function(e) {
                e.preventDefault();
                window.removeEventListener('mousemove', mousemoveListener);
                if (initialImageLeft == imageExpandedDiv.style.left &&
                    initialImageTop == imageExpandedDiv.style.top && e.button == 0) {
                    imageExpandedDiv.remove();
                }
            });
        };
        imageExpandedDiv.appendChild(imageExpandedLink);
        document.getElementsByTagName('body')[0].appendChild(imageExpandedDiv);
    }

    imagePreviewLink.onclick = imagePreviewClickListener;

    let imageDiv = document.createElement('div');
    let width = imagePreview.width ? imagePreview.width : 0;
    let height = imagePreview.height ? imagePreview.height : 0;
    if (width > MAX_PREVIEW_WIDTH) {
        let scale = width / MAX_PREVIEW_WIDTH;
        height = height / scale;
    }
    if (height > MAX_PREVIEW_HEIGHT) {
        height = MAX_PREVIEW_HEIGHT;
    }
    imageDiv.style.height = `${height + 1}px`;
    imageDiv.append(imagePreviewLink);
    return imageDiv;
}

async function createFileLinksDiv(files, hasSkippedFiles, postId, isPreview) {
    function createDownloadLink(name, text, blobLink) {
        let downloadLink = document.createElement('a');
        downloadLink.download = name;
        downloadLink.innerText = text;
        downloadLink.href = blobLink;
        return downloadLink;
    }
    function isImage(mime) {
        return !!mime && (mime.endsWith('/jpeg') ||
            mime.endsWith('/png') ||
            mime.endsWith('/webp'));
    }

    let fileLinksDiv = document.createElement('div');
    if (files.length == 0) {
        return fileLinksDiv;
    }

    let normalFilesCount = hasSkippedFiles > 0 ? files.length - 1 : files.length;
    for (let i = 0; i < normalFilesCount; i++) {
        let fileDiv = document.createElement('div');
		fileDiv.classList.add('post__file-attr');
        fileDiv.style = 'display: inline-block;';

        let filename = files[i].name;
        if (filename.length > MAX_FILENAME_LENGTH) {
            filename = filename.substring(0, MAX_FILENAME_LENGTH - 10) + '[...]' +
                filename.substring(filename.length - 5);
        }
        let blobLink = URL.createObjectURL(files[i].data);

        // Если тип поддерживается, создаем ссылку для открытия файла
        // в новой вкладке, иначе только ссылку для скачивания
        let mime = files[i].data.type;
        if (mime) {
            let link = document.createElement('a');
            link.target = "_blank";
            link.innerText = filename;
            link.href = blobLink;
            fileDiv.appendChild(link);
        }
        fileDiv.appendChild(document.createTextNode(' '));
        fileDiv.appendChild(createDownloadLink(files[i].name, `${mime ? '' : filename} \u2193`, blobLink));
        fileDiv.appendChild(document.createElement('br'));
        fileDiv.appendChild(document.createTextNode(`[${Utils.getHumanReadableSize(files[i].data.size)}]`));

        if (isPreview && isImage(mime)) {
            fileDiv.appendChild(document.createElement('br'));
            fileDiv.appendChild(await createImagePreview(blobLink));
        }
        fileLinksDiv.appendChild(fileDiv);

        if (i < normalFilesCount - 1) {
            fileLinksDiv.appendChild(document.createTextNode(', '));
        }
    }
    if (hasSkippedFiles > 0) {
        let allFilesLink = createDownloadLink(`all_files_${postId}.zip`, 'скачать все',
            URL.createObjectURL(files[files.length - 1].data));

        fileLinksDiv.insertAdjacentText('beforeend', ' (некоторые файлы пропущены)');
        if (isPreview) fileLinksDiv.insertAdjacentElement('afterbegin', document.createElement('br'));
        fileLinksDiv.insertAdjacentText('afterbegin', ` [${Utils.getHumanReadableSize(files[files.length - 1].data.size)}]): `);
        fileLinksDiv.insertAdjacentElement('afterbegin', allFilesLink);
        fileLinksDiv.insertAdjacentText('afterbegin', 'Файлы (');
    }
    else {
        //if (isPreview) fileLinksDiv.insertAdjacentElement('afterbegin', document.createElement('br'));
        //fileLinksDiv.insertAdjacentText('afterbegin', 'Файлы: ');
    }
    return fileLinksDiv;
}


module.exports.createHiddenPostImpl = createHiddenPostImpl
module.exports.loadPostFromImage = loadPostFromImage
module.exports.unzipPostData = unzipPostData
module.exports.createFileLinksDiv = createFileLinksDiv
module.exports.MESSAGE_MAX_LENGTH = MESSAGE_MAX_LENGTH
},{"../lib/jszip.min.js":8,"./crypto.js":10,"./stegano.js":13,"./utils.js":14}],13:[function(require,module,exports){
let Utils = require('./utils.js')
let MersenneTwister = require('../lib/MersenneTwister.min.js');

///////////////////////////////////////////////////////////////////////////////
// LSB steganography

// Порядок упаковки:
// color (RGB), x, y, channel bit(0..7)

function getShuffledIndexList(length, steps) {
    let arrayIndexList = new Uint32Array(length / 4 * 3);
    for (let i = 0, j = 0; i < length; i++) {
        /* Skip alpha channel */
        if ((i + 1) % 4 != 0) {
            arrayIndexList[j] = i;
            j++;
        }
    }
    Utils.shuffleArray(arrayIndexList, steps, new MersenneTwister(1337));
    return arrayIndexList;
}

function runWorker(func, _args, onsuccess, onerror)
{
    const runOnce = true;

    function setupOnMessage() {
        onmessage = function(e) {
            if (e.data.type == '__args') {
                __func.apply(this, e.data.args);
            }
        }
    }

    let dependencies = MersenneTwister.EvalString +
        Utils.shuffleArray.toString() +
        getShuffledIndexList.toString().replace('Utils.', '');
    let funcString = 'data:text/javascript;charset=US-ASCII,' + dependencies + 'var __func = ' + func.toString() + ';';
    funcString += '(' + setupOnMessage.toString() + ').call(this);';

    let worker = new Worker(funcString);

    worker.onmessage = function(e) {
        onsuccess(e.data);
        if (runOnce)
            worker.terminate();
    }
    worker.onerror = function(e) {
        e.preventDefault();
        onerror(e.message);
    }
    worker.postMessage({
        type: '__args',
        args: _args
    });
}

function hideDataToArrayImpl(array, data) {
    let requiredSteps = data.length * 8;
    let arrayIndexList = getShuffledIndexList(array.length, requiredSteps);
    let arrayIndex = arrayIndexList.length - 1; /* Идем назад, т.к. индексы перемешаны с конца */
    let arrayBitIndex = 0;
    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
        for (let bitIndex = 7; bitIndex >= 0; bitIndex--) {
            let bit = (data[dataIndex] >> bitIndex) & 1;
            array[arrayIndexList[arrayIndex]] &= ~(1 << arrayBitIndex); /* Clear bit */
            array[arrayIndexList[arrayIndex]] |= bit << arrayBitIndex; /* Set bit */
            arrayIndex--;
            if (arrayIndex < 0) {
                arrayIndex = arrayIndexList.length - 1;
                arrayBitIndex++;
                if (arrayBitIndex == 8 && dataIndex < (data.length - 1)) {
                    throw new Error('Не удалось вместить данные в контейнер, осталось ещё ' +
                        (data.length - dataIndex - 1) + ' из ' + data.length + ' байт');
                }
            }
        }
    }
    postMessage(array);
}

function extractDataFromArrayImpl(array, dataLength) {
    let data = new Uint8Array(dataLength);
    let requiredSteps = data.length * 8;
    let arrayIndexList = getShuffledIndexList(array.length, requiredSteps);
    let arrayBitIndex = 0;
    let dataBitIndex = 7;
    let dataIndex = 0;
    let arrayIndex = arrayIndexList.length - 1; /* Идем назад, т.к. индексы перемешаны с конца */
    while (true) {
        let bit = (array[arrayIndexList[arrayIndex]] >> arrayBitIndex) & 1;
        data[dataIndex] |= bit << dataBitIndex;
        dataBitIndex--;
        if (dataBitIndex < 0) {
            dataBitIndex = 7;
            dataIndex++;
            if (dataIndex >= data.length) {
                postMessage(data);
                return;
            }
        }

        arrayIndex--;
        if (arrayIndex < 0) {
            arrayIndex = arrayIndexList.length - 1;
            arrayBitIndex++;
            if (arrayBitIndex == 8) {
                throw new Error('Неожиданный конец контейнера, ожидалось ещё ' +
                    (data.length - dataIndex) + ' из ' + data.length + ' байт');
            }
        }
    }
}

async function hideDataToArray(array, data) {
    return await new Promise(function(resolve, reject) {
        runWorker(
            hideDataToArrayImpl,
            [array, data],
            function(newArray) {
                resolve(newArray);
            },
            function(e) {
                reject(e);
            },
        );
    });
}

async function extractDataFromArray(array, dataLength) {
    return await new Promise(function(resolve, reject) {
        runWorker(
            extractDataFromArrayImpl,
            [array, dataLength],
            function(data) {
                resolve(data);
            },
            function(e) {
                reject(e);
            },
        );
    });
}

///////////////////////////////////////////////////////////////////////////////


module.exports.hideDataToArray = hideDataToArray
module.exports.extractDataFromArray = extractDataFromArray

},{"../lib/MersenneTwister.min.js":6,"./utils.js":14}],14:[function(require,module,exports){
/*
https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
*/
var BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var arrayToBase58 = function (B) {
    var d = [],   //the array for storing the stream of base58 digits
        s = "",   //the result string variable that will be returned
        j,        //the iterator variable for the base58 digit array (d)
        c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n;        //a temporary placeholder variable for the current base58 digit
    for (var i = 0; i < B.length; i++) { //loop through each byte in the input stream
        j = 0,                           //reset the base58 digit iterator
            c = B[i];                        //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while (j in d || c) {            //start looping through the digits until there are no more digits and no carry amount
            n = d[j];                    //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++                          //iterate to the next base58 digit
        }
    }
    while (j--)        //since the base58 digits are backwards, loop through them in reverse order
        s += BASE58_ALPHABET[d[j]]; //lookup the character associated with each base58 digit
    return s          //return the final base58 string
}
function base58ToArray(S) { var d = [], b = [], i, j, c, n; for (i in S) { j = 0, c = BASE58_ALPHABET.indexOf(S[i]); if (c < 0) return undefined; c || b.length ^ i ? i : b.push(0); while (j in d || c) { n = d[j]; n = n ? n * 58 + c : c; c = n >> 8; d[j] = n % 256; j++ } } while (j--) b.push(d[j]); return new Uint8Array(b) };

function arrayToBase64(arr) {
    let binary = '';
    let len = arr.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(arr[i]);
    }
    return window.btoa(binary);
}

function arrayToBase64url(byteArray) {
    return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
        return String.fromCharCode(val);
    }).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

function base64urlToArray(b64urlstring) {
    return new Uint8Array(atob(b64urlstring.replace(/-/g, '+').replace(/_/g, '/')).split('').map(val => {
        return val.charCodeAt(0);
    }));
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
// steps: [1, array.length - 1]
function shuffleArray(array, steps, rndSource) {
    let end = array.length - 1 - steps;
    if (end < 0) end = 0;
    for (let i = array.length - 1; i > end; i--) {
        let j = Math.floor(rndSource.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getHumanReadableSize(bytes) {
    var thresh = 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

function getRandomInRange(min, max, isFloat) {
    if (isFloat)
        return Math.random() * (max - min) + min;
    else
        return Math.floor(Math.random() * (max - min) + min);
}

function trace(s) {
    console.log(s);
}

// https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5
class Queue {
    constructor() {
        this.queue = [];
        this.pendingPromise = false;
    }

    enqueue(promise) {
      return new Promise((resolve, reject) => {
          this.queue.push({
              promise,
              resolve,
              reject,
          });
          this.dequeue();
      });
    }

    dequeue() {
      if (this.workingOnPromise) {
        return false;
      }
      const item = this.queue.shift();
      if (!item) {
        return false;
      }
      try {
        this.workingOnPromise = true;
        item.promise()
          .then((value) => {
            this.workingOnPromise = false;
            item.resolve(value);
            this.dequeue();
          })
          .catch(err => {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
          })
      } catch (err) {
        this.workingOnPromise = false;
        item.reject(err);
        this.dequeue();
      }
      return true;
    }
}


module.exports.arrayToBase58 = arrayToBase58
module.exports.base58ToArray = base58ToArray
module.exports.arrayToBase64 = arrayToBase64
module.exports.arrayToBase64url = arrayToBase64url
module.exports.base64urlToArray = base64urlToArray
module.exports.shuffleArray = shuffleArray
module.exports.getHumanReadableSize = getHumanReadableSize
module.exports.getRandomInRange = getRandomInRange
module.exports.trace = trace
module.exports.Queue = Queue

},{}]},{},[11]);