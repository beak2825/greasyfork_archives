// ==UserScript==
// @name         Discord Status Remote Control
// @namespace    https://discord.com/
// @version      0.1.1
// @description  Toggle Discord online status without entering the app first
// @author       d0gkiller87
// @match        https://discord.com/*
// @exclude      https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532044/Discord%20Status%20Remote%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/532044/Discord%20Status%20Remote%20Control.meta.js
// ==/UserScript==

// node_modules/@protobuf-ts/runtime/build/es2015/json-typings.js
function typeofJsonValue(value) {
  let t = typeof value;
  if (t == "object") {
    if (Array.isArray(value))
      return "array";
    if (value === null)
      return "null";
  }
  return t;
}
function isJsonObject(value) {
  return value !== null && typeof value == "object" && !Array.isArray(value);
}
// node_modules/@protobuf-ts/runtime/build/es2015/base64.js
var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var decTable = [];
for (let i = 0;i < encTable.length; i++)
  decTable[encTable[i].charCodeAt(0)] = i;
decTable[45] = encTable.indexOf("+");
decTable[95] = encTable.indexOf("/");
function base64decode(base64Str) {
  let es = base64Str.length * 3 / 4;
  if (base64Str[base64Str.length - 2] == "=")
    es -= 2;
  else if (base64Str[base64Str.length - 1] == "=")
    es -= 1;
  let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
  for (let i = 0;i < base64Str.length; i++) {
    b = decTable[base64Str.charCodeAt(i)];
    if (b === undefined) {
      switch (base64Str[i]) {
        case "=":
          groupPos = 0;
        case `
`:
        case "\r":
        case "\t":
        case " ":
          continue;
        default:
          throw Error(`invalid base64 string.`);
      }
    }
    switch (groupPos) {
      case 0:
        p = b;
        groupPos = 1;
        break;
      case 1:
        bytes[bytePos++] = p << 2 | (b & 48) >> 4;
        p = b;
        groupPos = 2;
        break;
      case 2:
        bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
        p = b;
        groupPos = 3;
        break;
      case 3:
        bytes[bytePos++] = (p & 3) << 6 | b;
        groupPos = 0;
        break;
    }
  }
  if (groupPos == 1)
    throw Error(`invalid base64 string.`);
  return bytes.subarray(0, bytePos);
}
function base64encode(bytes) {
  let base64 = "", groupPos = 0, b, p = 0;
  for (let i = 0;i < bytes.length; i++) {
    b = bytes[i];
    switch (groupPos) {
      case 0:
        base64 += encTable[b >> 2];
        p = (b & 3) << 4;
        groupPos = 1;
        break;
      case 1:
        base64 += encTable[p | b >> 4];
        p = (b & 15) << 2;
        groupPos = 2;
        break;
      case 2:
        base64 += encTable[p | b >> 6];
        base64 += encTable[b & 63];
        groupPos = 0;
        break;
    }
  }
  if (groupPos) {
    base64 += encTable[p];
    base64 += "=";
    if (groupPos == 1)
      base64 += "=";
  }
  return base64;
}

// node_modules/@protobuf-ts/runtime/build/es2015/binary-format-contract.js
var UnknownFieldHandler;
(function(UnknownFieldHandler2) {
  UnknownFieldHandler2.symbol = Symbol.for("protobuf-ts/unknown");
  UnknownFieldHandler2.onRead = (typeName, message, fieldNo, wireType, data) => {
    let container = is(message) ? message[UnknownFieldHandler2.symbol] : message[UnknownFieldHandler2.symbol] = [];
    container.push({ no: fieldNo, wireType, data });
  };
  UnknownFieldHandler2.onWrite = (typeName, message, writer) => {
    for (let { no, wireType, data } of UnknownFieldHandler2.list(message))
      writer.tag(no, wireType).raw(data);
  };
  UnknownFieldHandler2.list = (message, fieldNo) => {
    if (is(message)) {
      let all = message[UnknownFieldHandler2.symbol];
      return fieldNo ? all.filter((uf) => uf.no == fieldNo) : all;
    }
    return [];
  };
  UnknownFieldHandler2.last = (message, fieldNo) => UnknownFieldHandler2.list(message, fieldNo).slice(-1)[0];
  const is = (message) => message && Array.isArray(message[UnknownFieldHandler2.symbol]);
})(UnknownFieldHandler || (UnknownFieldHandler = {}));
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
// node_modules/@protobuf-ts/runtime/build/es2015/goog-varint.js
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0;shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [lowBits, highBits];
  }
  for (let shift = 3;shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  throw new Error("invalid varint");
}
function varint64write(lo, hi, bytes) {
  for (let i = 0;i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3;i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
var TWO_PWR_32_DBL = (1 << 16) * (1 << 16);
function int64fromString(dec) {
  let minus = dec[0] == "-";
  if (minus)
    dec = dec.slice(1);
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return [minus, lowBits, highBits];
}
function int64toString(bitsLow, bitsHigh) {
  if (bitsHigh >>> 0 <= 2097151) {
    return "" + (TWO_PWR_32_DBL * bitsHigh + (bitsLow >>> 0));
  }
  let low = bitsLow & 16777215;
  let mid = (bitsLow >>> 24 | bitsHigh << 8) >>> 0 & 16777215;
  let high = bitsHigh >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  let base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  function decimalFrom1e7(digit1e7, needLeadingZeros) {
    let partial = digit1e7 ? String(digit1e7) : "";
    if (needLeadingZeros) {
      return "0000000".slice(partial.length) + partial;
    }
    return partial;
  }
  return decimalFrom1e7(digitC, 0) + decimalFrom1e7(digitB, digitC) + decimalFrom1e7(digitA, 1);
}
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0;i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5;(b & 128) !== 0 && readBytes < 10; readBytes++)
    b = this.buf[this.pos++];
  if ((b & 128) != 0)
    throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}

// node_modules/@protobuf-ts/runtime/build/es2015/pb-long.js
var BI;
function detectBi() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = globalThis.BigInt !== undefined && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function";
  BI = ok ? {
    MIN: BigInt("-9223372036854775808"),
    MAX: BigInt("9223372036854775807"),
    UMIN: BigInt("0"),
    UMAX: BigInt("18446744073709551615"),
    C: BigInt,
    V: dv
  } : undefined;
}
detectBi();
function assertBi(bi) {
  if (!bi)
    throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
}
var RE_DECIMAL_STR = /^-?[0-9]+$/;
var TWO_PWR_32_DBL2 = 4294967296;
var HALF_2_PWR_32 = 2147483648;

class SharedPbLong {
  constructor(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
  }
  isZero() {
    return this.lo == 0 && this.hi == 0;
  }
  toNumber() {
    let result = this.hi * TWO_PWR_32_DBL2 + (this.lo >>> 0);
    if (!Number.isSafeInteger(result))
      throw new Error("cannot convert to safe number");
    return result;
  }
}

class PbULong extends SharedPbLong {
  static from(value) {
    if (BI)
      switch (typeof value) {
        case "string":
          if (value == "0")
            return this.ZERO;
          if (value == "")
            throw new Error("string is no integer");
          value = BI.C(value);
        case "number":
          if (value === 0)
            return this.ZERO;
          value = BI.C(value);
        case "bigint":
          if (!value)
            return this.ZERO;
          if (value < BI.UMIN)
            throw new Error("signed value for ulong");
          if (value > BI.UMAX)
            throw new Error("ulong too large");
          BI.V.setBigUint64(0, value, true);
          return new PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
      }
    else
      switch (typeof value) {
        case "string":
          if (value == "0")
            return this.ZERO;
          value = value.trim();
          if (!RE_DECIMAL_STR.test(value))
            throw new Error("string is no integer");
          let [minus, lo, hi] = int64fromString(value);
          if (minus)
            throw new Error("signed value for ulong");
          return new PbULong(lo, hi);
        case "number":
          if (value == 0)
            return this.ZERO;
          if (!Number.isSafeInteger(value))
            throw new Error("number is no integer");
          if (value < 0)
            throw new Error("signed value for ulong");
          return new PbULong(value, value / TWO_PWR_32_DBL2);
      }
    throw new Error("unknown value " + typeof value);
  }
  toString() {
    return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi);
  }
  toBigInt() {
    assertBi(BI);
    BI.V.setInt32(0, this.lo, true);
    BI.V.setInt32(4, this.hi, true);
    return BI.V.getBigUint64(0, true);
  }
}
PbULong.ZERO = new PbULong(0, 0);

class PbLong extends SharedPbLong {
  static from(value) {
    if (BI)
      switch (typeof value) {
        case "string":
          if (value == "0")
            return this.ZERO;
          if (value == "")
            throw new Error("string is no integer");
          value = BI.C(value);
        case "number":
          if (value === 0)
            return this.ZERO;
          value = BI.C(value);
        case "bigint":
          if (!value)
            return this.ZERO;
          if (value < BI.MIN)
            throw new Error("signed long too small");
          if (value > BI.MAX)
            throw new Error("signed long too large");
          BI.V.setBigInt64(0, value, true);
          return new PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
      }
    else
      switch (typeof value) {
        case "string":
          if (value == "0")
            return this.ZERO;
          value = value.trim();
          if (!RE_DECIMAL_STR.test(value))
            throw new Error("string is no integer");
          let [minus, lo, hi] = int64fromString(value);
          if (minus) {
            if (hi > HALF_2_PWR_32 || hi == HALF_2_PWR_32 && lo != 0)
              throw new Error("signed long too small");
          } else if (hi >= HALF_2_PWR_32)
            throw new Error("signed long too large");
          let pbl = new PbLong(lo, hi);
          return minus ? pbl.negate() : pbl;
        case "number":
          if (value == 0)
            return this.ZERO;
          if (!Number.isSafeInteger(value))
            throw new Error("number is no integer");
          return value > 0 ? new PbLong(value, value / TWO_PWR_32_DBL2) : new PbLong(-value, -value / TWO_PWR_32_DBL2).negate();
      }
    throw new Error("unknown value " + typeof value);
  }
  isNegative() {
    return (this.hi & HALF_2_PWR_32) !== 0;
  }
  negate() {
    let hi = ~this.hi, lo = this.lo;
    if (lo)
      lo = ~lo + 1;
    else
      hi += 1;
    return new PbLong(lo, hi);
  }
  toString() {
    if (BI)
      return this.toBigInt().toString();
    if (this.isNegative()) {
      let n = this.negate();
      return "-" + int64toString(n.lo, n.hi);
    }
    return int64toString(this.lo, this.hi);
  }
  toBigInt() {
    assertBi(BI);
    BI.V.setInt32(0, this.lo, true);
    BI.V.setInt32(4, this.hi, true);
    return BI.V.getBigInt64(0, true);
  }
}
PbLong.ZERO = new PbLong(0, 0);

// node_modules/@protobuf-ts/runtime/build/es2015/binary-reader.js
var defaultsRead = {
  readUnknownField: true,
  readerFactory: (bytes) => new BinaryReader(bytes)
};
function binaryReadOptions(options) {
  return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead;
}

class BinaryReader {
  constructor(buf, textDecoder) {
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    this.textDecoder = textDecoder !== null && textDecoder !== undefined ? textDecoder : new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true
    });
  }
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5)
      throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [fieldNo, wireType];
  }
  skip(wireType) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {}
        break;
      case WireType.Bit64:
        this.pos += 4;
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        let t;
        while ((t = this.tag()[1]) !== WireType.EndGroup) {
          this.skip(t);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  int32() {
    return this.uint32() | 0;
  }
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  int64() {
    return new PbLong(...this.varint64());
  }
  uint64() {
    return new PbULong(...this.varint64());
  }
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return new PbLong(lo, hi);
  }
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  fixed64() {
    return new PbULong(this.sfixed32(), this.sfixed32());
  }
  sfixed64() {
    return new PbLong(this.sfixed32(), this.sfixed32());
  }
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  bytes() {
    let len = this.uint32();
    let start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  string() {
    return this.textDecoder.decode(this.bytes());
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/assert.js
function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}
var FLOAT32_MAX = 340282346638528860000000000000000000000;
var FLOAT32_MIN = -340282346638528860000000000000000000000;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
function assertInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid int 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
    throw new Error("invalid int 32: " + arg);
}
function assertUInt32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid uint 32: " + typeof arg);
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
    throw new Error("invalid uint 32: " + arg);
}
function assertFloat32(arg) {
  if (typeof arg !== "number")
    throw new Error("invalid float 32: " + typeof arg);
  if (!Number.isFinite(arg))
    return;
  if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
    throw new Error("invalid float 32: " + arg);
}

// node_modules/@protobuf-ts/runtime/build/es2015/binary-writer.js
var defaultsWrite = {
  writeUnknownFields: true,
  writerFactory: () => new BinaryWriter
};
function binaryWriteOptions(options) {
  return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite;
}

class BinaryWriter {
  constructor(textEncoder) {
    this.stack = [];
    this.textEncoder = textEncoder !== null && textEncoder !== undefined ? textEncoder : new TextEncoder;
    this.chunks = [];
    this.buf = [];
  }
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let len = 0;
    for (let i = 0;i < this.chunks.length; i++)
      len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0;i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  fork() {
    this.stack.push({ chunks: this.chunks, buf: this.buf });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev)
      throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  string(value) {
    let chunk = this.textEncoder.encode(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  sfixed64(value) {
    let chunk = new Uint8Array(8);
    let view = new DataView(chunk.buffer);
    let long = PbLong.from(value);
    view.setInt32(0, long.lo, true);
    view.setInt32(4, long.hi, true);
    return this.raw(chunk);
  }
  fixed64(value) {
    let chunk = new Uint8Array(8);
    let view = new DataView(chunk.buffer);
    let long = PbULong.from(value);
    view.setInt32(0, long.lo, true);
    view.setInt32(4, long.hi, true);
    return this.raw(chunk);
  }
  int64(value) {
    let long = PbLong.from(value);
    varint64write(long.lo, long.hi, this.buf);
    return this;
  }
  sint64(value) {
    let long = PbLong.from(value), sign = long.hi >> 31, lo = long.lo << 1 ^ sign, hi = (long.hi << 1 | long.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  uint64(value) {
    let long = PbULong.from(value);
    varint64write(long.lo, long.hi, this.buf);
    return this;
  }
}
// node_modules/@protobuf-ts/runtime/build/es2015/json-format-contract.js
var defaultsWrite2 = {
  emitDefaultValues: false,
  enumAsInteger: false,
  useProtoFieldName: false,
  prettySpaces: 0
};
var defaultsRead2 = {
  ignoreUnknownFields: false
};
function jsonReadOptions(options) {
  return options ? Object.assign(Object.assign({}, defaultsRead2), options) : defaultsRead2;
}
function jsonWriteOptions(options) {
  return options ? Object.assign(Object.assign({}, defaultsWrite2), options) : defaultsWrite2;
}

// node_modules/@protobuf-ts/runtime/build/es2015/message-type-contract.js
var MESSAGE_TYPE = Symbol.for("protobuf-ts/message-type");

// node_modules/@protobuf-ts/runtime/build/es2015/lower-camel-case.js
function lowerCamelCase(snakeCase) {
  let capNext = false;
  const sb = [];
  for (let i = 0;i < snakeCase.length; i++) {
    let next = snakeCase.charAt(i);
    if (next == "_") {
      capNext = true;
    } else if (/\d/.test(next)) {
      sb.push(next);
      capNext = true;
    } else if (capNext) {
      sb.push(next.toUpperCase());
      capNext = false;
    } else if (i == 0) {
      sb.push(next.toLowerCase());
    } else {
      sb.push(next);
    }
  }
  return sb.join("");
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-info.js
var ScalarType;
(function(ScalarType2) {
  ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
  ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
  ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
  ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
  ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
  ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
  ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
  ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
  ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
  ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
  ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
  ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
  ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
  ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
  ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
var LongType;
(function(LongType2) {
  LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
  LongType2[LongType2["STRING"] = 1] = "STRING";
  LongType2[LongType2["NUMBER"] = 2] = "NUMBER";
})(LongType || (LongType = {}));
var RepeatType;
(function(RepeatType2) {
  RepeatType2[RepeatType2["NO"] = 0] = "NO";
  RepeatType2[RepeatType2["PACKED"] = 1] = "PACKED";
  RepeatType2[RepeatType2["UNPACKED"] = 2] = "UNPACKED";
})(RepeatType || (RepeatType = {}));
function normalizeFieldInfo(field) {
  var _a, _b, _c, _d;
  field.localName = (_a = field.localName) !== null && _a !== undefined ? _a : lowerCamelCase(field.name);
  field.jsonName = (_b = field.jsonName) !== null && _b !== undefined ? _b : lowerCamelCase(field.name);
  field.repeat = (_c = field.repeat) !== null && _c !== undefined ? _c : RepeatType.NO;
  field.opt = (_d = field.opt) !== null && _d !== undefined ? _d : field.repeat ? false : field.oneof ? false : field.kind == "message";
  return field;
}

// node_modules/@protobuf-ts/runtime/build/es2015/oneof.js
function isOneofGroup(any) {
  if (typeof any != "object" || any === null || !any.hasOwnProperty("oneofKind")) {
    return false;
  }
  switch (typeof any.oneofKind) {
    case "string":
      if (any[any.oneofKind] === undefined)
        return false;
      return Object.keys(any).length == 2;
    case "undefined":
      return Object.keys(any).length == 1;
    default:
      return false;
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-type-check.js
class ReflectionTypeCheck {
  constructor(info) {
    var _a;
    this.fields = (_a = info.fields) !== null && _a !== undefined ? _a : [];
  }
  prepare() {
    if (this.data)
      return;
    const req = [], known = [], oneofs = [];
    for (let field of this.fields) {
      if (field.oneof) {
        if (!oneofs.includes(field.oneof)) {
          oneofs.push(field.oneof);
          req.push(field.oneof);
          known.push(field.oneof);
        }
      } else {
        known.push(field.localName);
        switch (field.kind) {
          case "scalar":
          case "enum":
            if (!field.opt || field.repeat)
              req.push(field.localName);
            break;
          case "message":
            if (field.repeat)
              req.push(field.localName);
            break;
          case "map":
            req.push(field.localName);
            break;
        }
      }
    }
    this.data = { req, known, oneofs: Object.values(oneofs) };
  }
  is(message, depth, allowExcessProperties = false) {
    if (depth < 0)
      return true;
    if (message === null || message === undefined || typeof message != "object")
      return false;
    this.prepare();
    let keys = Object.keys(message), data = this.data;
    if (keys.length < data.req.length || data.req.some((n) => !keys.includes(n)))
      return false;
    if (!allowExcessProperties) {
      if (keys.some((k) => !data.known.includes(k)))
        return false;
    }
    if (depth < 1) {
      return true;
    }
    for (const name of data.oneofs) {
      const group = message[name];
      if (!isOneofGroup(group))
        return false;
      if (group.oneofKind === undefined)
        continue;
      const field = this.fields.find((f) => f.localName === group.oneofKind);
      if (!field)
        return false;
      if (!this.field(group[group.oneofKind], field, allowExcessProperties, depth))
        return false;
    }
    for (const field of this.fields) {
      if (field.oneof !== undefined)
        continue;
      if (!this.field(message[field.localName], field, allowExcessProperties, depth))
        return false;
    }
    return true;
  }
  field(arg, field, allowExcessProperties, depth) {
    let repeated = field.repeat;
    switch (field.kind) {
      case "scalar":
        if (arg === undefined)
          return field.opt;
        if (repeated)
          return this.scalars(arg, field.T, depth, field.L);
        return this.scalar(arg, field.T, field.L);
      case "enum":
        if (arg === undefined)
          return field.opt;
        if (repeated)
          return this.scalars(arg, ScalarType.INT32, depth);
        return this.scalar(arg, ScalarType.INT32);
      case "message":
        if (arg === undefined)
          return true;
        if (repeated)
          return this.messages(arg, field.T(), allowExcessProperties, depth);
        return this.message(arg, field.T(), allowExcessProperties, depth);
      case "map":
        if (typeof arg != "object" || arg === null)
          return false;
        if (depth < 2)
          return true;
        if (!this.mapKeys(arg, field.K, depth))
          return false;
        switch (field.V.kind) {
          case "scalar":
            return this.scalars(Object.values(arg), field.V.T, depth, field.V.L);
          case "enum":
            return this.scalars(Object.values(arg), ScalarType.INT32, depth);
          case "message":
            return this.messages(Object.values(arg), field.V.T(), allowExcessProperties, depth);
        }
        break;
    }
    return true;
  }
  message(arg, type, allowExcessProperties, depth) {
    if (allowExcessProperties) {
      return type.isAssignable(arg, depth);
    }
    return type.is(arg, depth);
  }
  messages(arg, type, allowExcessProperties, depth) {
    if (!Array.isArray(arg))
      return false;
    if (depth < 2)
      return true;
    if (allowExcessProperties) {
      for (let i = 0;i < arg.length && i < depth; i++)
        if (!type.isAssignable(arg[i], depth - 1))
          return false;
    } else {
      for (let i = 0;i < arg.length && i < depth; i++)
        if (!type.is(arg[i], depth - 1))
          return false;
    }
    return true;
  }
  scalar(arg, type, longType) {
    let argType = typeof arg;
    switch (type) {
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        switch (longType) {
          case LongType.BIGINT:
            return argType == "bigint";
          case LongType.NUMBER:
            return argType == "number" && !isNaN(arg);
          default:
            return argType == "string";
        }
      case ScalarType.BOOL:
        return argType == "boolean";
      case ScalarType.STRING:
        return argType == "string";
      case ScalarType.BYTES:
        return arg instanceof Uint8Array;
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        return argType == "number" && !isNaN(arg);
      default:
        return argType == "number" && Number.isInteger(arg);
    }
  }
  scalars(arg, type, depth, longType) {
    if (!Array.isArray(arg))
      return false;
    if (depth < 2)
      return true;
    if (Array.isArray(arg)) {
      for (let i = 0;i < arg.length && i < depth; i++)
        if (!this.scalar(arg[i], type, longType))
          return false;
    }
    return true;
  }
  mapKeys(map, type, depth) {
    let keys = Object.keys(map);
    switch (type) {
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
      case ScalarType.UINT32:
        return this.scalars(keys.slice(0, depth).map((k) => parseInt(k)), type, depth);
      case ScalarType.BOOL:
        return this.scalars(keys.slice(0, depth).map((k) => k == "true" ? true : k == "false" ? false : k), type, depth);
      default:
        return this.scalars(keys, type, depth, LongType.STRING);
    }
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-long-convert.js
function reflectionLongConvert(long, type) {
  switch (type) {
    case LongType.BIGINT:
      return long.toBigInt();
    case LongType.NUMBER:
      return long.toNumber();
    default:
      return long.toString();
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-json-reader.js
class ReflectionJsonReader {
  constructor(info) {
    this.info = info;
  }
  prepare() {
    var _a;
    if (this.fMap === undefined) {
      this.fMap = {};
      const fieldsInput = (_a = this.info.fields) !== null && _a !== undefined ? _a : [];
      for (const field of fieldsInput) {
        this.fMap[field.name] = field;
        this.fMap[field.jsonName] = field;
        this.fMap[field.localName] = field;
      }
    }
  }
  assert(condition, fieldName, jsonValue) {
    if (!condition) {
      let what = typeofJsonValue(jsonValue);
      if (what == "number" || what == "boolean")
        what = jsonValue.toString();
      throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`);
    }
  }
  read(input, message, options) {
    this.prepare();
    const oneofsHandled = [];
    for (const [jsonKey, jsonValue] of Object.entries(input)) {
      const field = this.fMap[jsonKey];
      if (!field) {
        if (!options.ignoreUnknownFields)
          throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`);
        continue;
      }
      const localName = field.localName;
      let target;
      if (field.oneof) {
        if (jsonValue === null && (field.kind !== "enum" || field.T()[0] !== "google.protobuf.NullValue")) {
          continue;
        }
        if (oneofsHandled.includes(field.oneof))
          throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`);
        oneofsHandled.push(field.oneof);
        target = message[field.oneof] = {
          oneofKind: localName
        };
      } else {
        target = message;
      }
      if (field.kind == "map") {
        if (jsonValue === null) {
          continue;
        }
        this.assert(isJsonObject(jsonValue), field.name, jsonValue);
        const fieldObj = target[localName];
        for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {
          this.assert(jsonObjValue !== null, field.name + " map value", null);
          let val;
          switch (field.V.kind) {
            case "message":
              val = field.V.T().internalJsonRead(jsonObjValue, options);
              break;
            case "enum":
              val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields);
              if (val === false)
                continue;
              break;
            case "scalar":
              val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name);
              break;
          }
          this.assert(val !== undefined, field.name + " map value", jsonObjValue);
          let key = jsonObjKey;
          if (field.K == ScalarType.BOOL)
            key = key == "true" ? true : key == "false" ? false : key;
          key = this.scalar(key, field.K, LongType.STRING, field.name).toString();
          fieldObj[key] = val;
        }
      } else if (field.repeat) {
        if (jsonValue === null)
          continue;
        this.assert(Array.isArray(jsonValue), field.name, jsonValue);
        const fieldArr = target[localName];
        for (const jsonItem of jsonValue) {
          this.assert(jsonItem !== null, field.name, null);
          let val;
          switch (field.kind) {
            case "message":
              val = field.T().internalJsonRead(jsonItem, options);
              break;
            case "enum":
              val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields);
              if (val === false)
                continue;
              break;
            case "scalar":
              val = this.scalar(jsonItem, field.T, field.L, field.name);
              break;
          }
          this.assert(val !== undefined, field.name, jsonValue);
          fieldArr.push(val);
        }
      } else {
        switch (field.kind) {
          case "message":
            if (jsonValue === null && field.T().typeName != "google.protobuf.Value") {
              this.assert(field.oneof === undefined, field.name + " (oneof member)", null);
              continue;
            }
            target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName]);
            break;
          case "enum":
            if (jsonValue === null)
              continue;
            let val = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields);
            if (val === false)
              continue;
            target[localName] = val;
            break;
          case "scalar":
            if (jsonValue === null)
              continue;
            target[localName] = this.scalar(jsonValue, field.T, field.L, field.name);
            break;
        }
      }
    }
  }
  enum(type, json, fieldName, ignoreUnknownFields) {
    if (type[0] == "google.protobuf.NullValue")
      assert(json === null || json === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`);
    if (json === null)
      return 0;
    switch (typeof json) {
      case "number":
        assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`);
        return json;
      case "string":
        let localEnumName = json;
        if (type[2] && json.substring(0, type[2].length) === type[2])
          localEnumName = json.substring(type[2].length);
        let enumNumber = type[1][localEnumName];
        if (typeof enumNumber === "undefined" && ignoreUnknownFields) {
          return false;
        }
        assert(typeof enumNumber == "number", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`);
        return enumNumber;
    }
    assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`);
  }
  scalar(json, type, longType, fieldName) {
    let e;
    try {
      switch (type) {
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
          if (json === null)
            return 0;
          if (json === "NaN")
            return Number.NaN;
          if (json === "Infinity")
            return Number.POSITIVE_INFINITY;
          if (json === "-Infinity")
            return Number.NEGATIVE_INFINITY;
          if (json === "") {
            e = "empty string";
            break;
          }
          if (typeof json == "string" && json.trim().length !== json.length) {
            e = "extra whitespace";
            break;
          }
          if (typeof json != "string" && typeof json != "number") {
            break;
          }
          let float = Number(json);
          if (Number.isNaN(float)) {
            e = "not a number";
            break;
          }
          if (!Number.isFinite(float)) {
            e = "too large or small";
            break;
          }
          if (type == ScalarType.FLOAT)
            assertFloat32(float);
          return float;
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.UINT32:
          if (json === null)
            return 0;
          let int32;
          if (typeof json == "number")
            int32 = json;
          else if (json === "")
            e = "empty string";
          else if (typeof json == "string") {
            if (json.trim().length !== json.length)
              e = "extra whitespace";
            else
              int32 = Number(json);
          }
          if (int32 === undefined)
            break;
          if (type == ScalarType.UINT32)
            assertUInt32(int32);
          else
            assertInt32(int32);
          return int32;
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
          if (json === null)
            return reflectionLongConvert(PbLong.ZERO, longType);
          if (typeof json != "number" && typeof json != "string")
            break;
          return reflectionLongConvert(PbLong.from(json), longType);
        case ScalarType.FIXED64:
        case ScalarType.UINT64:
          if (json === null)
            return reflectionLongConvert(PbULong.ZERO, longType);
          if (typeof json != "number" && typeof json != "string")
            break;
          return reflectionLongConvert(PbULong.from(json), longType);
        case ScalarType.BOOL:
          if (json === null)
            return false;
          if (typeof json !== "boolean")
            break;
          return json;
        case ScalarType.STRING:
          if (json === null)
            return "";
          if (typeof json !== "string") {
            e = "extra whitespace";
            break;
          }
          try {
            encodeURIComponent(json);
          } catch (e2) {
            e2 = "invalid UTF8";
            break;
          }
          return json;
        case ScalarType.BYTES:
          if (json === null || json === "")
            return new Uint8Array(0);
          if (typeof json !== "string")
            break;
          return base64decode(json);
      }
    } catch (error) {
      e = error.message;
    }
    this.assert(false, fieldName + (e ? " - " + e : ""), json);
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-json-writer.js
class ReflectionJsonWriter {
  constructor(info) {
    var _a;
    this.fields = (_a = info.fields) !== null && _a !== undefined ? _a : [];
  }
  write(message, options) {
    const json = {}, source = message;
    for (const field of this.fields) {
      if (!field.oneof) {
        let jsonValue2 = this.field(field, source[field.localName], options);
        if (jsonValue2 !== undefined)
          json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue2;
        continue;
      }
      const group = source[field.oneof];
      if (group.oneofKind !== field.localName)
        continue;
      const opt = field.kind == "scalar" || field.kind == "enum" ? Object.assign(Object.assign({}, options), { emitDefaultValues: true }) : options;
      let jsonValue = this.field(field, group[field.localName], opt);
      assert(jsonValue !== undefined);
      json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
    }
    return json;
  }
  field(field, value, options) {
    let jsonValue = undefined;
    if (field.kind == "map") {
      assert(typeof value == "object" && value !== null);
      const jsonObj = {};
      switch (field.V.kind) {
        case "scalar":
          for (const [entryKey, entryValue] of Object.entries(value)) {
            const val = this.scalar(field.V.T, entryValue, field.name, false, true);
            assert(val !== undefined);
            jsonObj[entryKey.toString()] = val;
          }
          break;
        case "message":
          const messageType = field.V.T();
          for (const [entryKey, entryValue] of Object.entries(value)) {
            const val = this.message(messageType, entryValue, field.name, options);
            assert(val !== undefined);
            jsonObj[entryKey.toString()] = val;
          }
          break;
        case "enum":
          const enumInfo = field.V.T();
          for (const [entryKey, entryValue] of Object.entries(value)) {
            assert(entryValue === undefined || typeof entryValue == "number");
            const val = this.enum(enumInfo, entryValue, field.name, false, true, options.enumAsInteger);
            assert(val !== undefined);
            jsonObj[entryKey.toString()] = val;
          }
          break;
      }
      if (options.emitDefaultValues || Object.keys(jsonObj).length > 0)
        jsonValue = jsonObj;
    } else if (field.repeat) {
      assert(Array.isArray(value));
      const jsonArr = [];
      switch (field.kind) {
        case "scalar":
          for (let i = 0;i < value.length; i++) {
            const val = this.scalar(field.T, value[i], field.name, field.opt, true);
            assert(val !== undefined);
            jsonArr.push(val);
          }
          break;
        case "enum":
          const enumInfo = field.T();
          for (let i = 0;i < value.length; i++) {
            assert(value[i] === undefined || typeof value[i] == "number");
            const val = this.enum(enumInfo, value[i], field.name, field.opt, true, options.enumAsInteger);
            assert(val !== undefined);
            jsonArr.push(val);
          }
          break;
        case "message":
          const messageType = field.T();
          for (let i = 0;i < value.length; i++) {
            const val = this.message(messageType, value[i], field.name, options);
            assert(val !== undefined);
            jsonArr.push(val);
          }
          break;
      }
      if (options.emitDefaultValues || jsonArr.length > 0 || options.emitDefaultValues)
        jsonValue = jsonArr;
    } else {
      switch (field.kind) {
        case "scalar":
          jsonValue = this.scalar(field.T, value, field.name, field.opt, options.emitDefaultValues);
          break;
        case "enum":
          jsonValue = this.enum(field.T(), value, field.name, field.opt, options.emitDefaultValues, options.enumAsInteger);
          break;
        case "message":
          jsonValue = this.message(field.T(), value, field.name, options);
          break;
      }
    }
    return jsonValue;
  }
  enum(type, value, fieldName, optional, emitDefaultValues, enumAsInteger) {
    if (type[0] == "google.protobuf.NullValue")
      return !emitDefaultValues && !optional ? undefined : null;
    if (value === undefined) {
      assert(optional);
      return;
    }
    if (value === 0 && !emitDefaultValues && !optional)
      return;
    assert(typeof value == "number");
    assert(Number.isInteger(value));
    if (enumAsInteger || !type[1].hasOwnProperty(value))
      return value;
    if (type[2])
      return type[2] + type[1][value];
    return type[1][value];
  }
  message(type, value, fieldName, options) {
    if (value === undefined)
      return options.emitDefaultValues ? null : undefined;
    return type.internalJsonWrite(value, options);
  }
  scalar(type, value, fieldName, optional, emitDefaultValues) {
    if (value === undefined) {
      assert(optional);
      return;
    }
    const ed = emitDefaultValues || optional;
    switch (type) {
      case ScalarType.INT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
        if (value === 0)
          return ed ? 0 : undefined;
        assertInt32(value);
        return value;
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
        if (value === 0)
          return ed ? 0 : undefined;
        assertUInt32(value);
        return value;
      case ScalarType.FLOAT:
        assertFloat32(value);
      case ScalarType.DOUBLE:
        if (value === 0)
          return ed ? 0 : undefined;
        assert(typeof value == "number");
        if (Number.isNaN(value))
          return "NaN";
        if (value === Number.POSITIVE_INFINITY)
          return "Infinity";
        if (value === Number.NEGATIVE_INFINITY)
          return "-Infinity";
        return value;
      case ScalarType.STRING:
        if (value === "")
          return ed ? "" : undefined;
        assert(typeof value == "string");
        return value;
      case ScalarType.BOOL:
        if (value === false)
          return ed ? false : undefined;
        assert(typeof value == "boolean");
        return value;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
        assert(typeof value == "number" || typeof value == "string" || typeof value == "bigint");
        let ulong = PbULong.from(value);
        if (ulong.isZero() && !ed)
          return;
        return ulong.toString();
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        assert(typeof value == "number" || typeof value == "string" || typeof value == "bigint");
        let long = PbLong.from(value);
        if (long.isZero() && !ed)
          return;
        return long.toString();
      case ScalarType.BYTES:
        assert(value instanceof Uint8Array);
        if (!value.byteLength)
          return ed ? "" : undefined;
        return base64encode(value);
    }
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-scalar-default.js
function reflectionScalarDefault(type, longType = LongType.STRING) {
  switch (type) {
    case ScalarType.BOOL:
      return false;
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
      return reflectionLongConvert(PbULong.ZERO, longType);
    case ScalarType.INT64:
    case ScalarType.SFIXED64:
    case ScalarType.SINT64:
      return reflectionLongConvert(PbLong.ZERO, longType);
    case ScalarType.DOUBLE:
    case ScalarType.FLOAT:
      return 0;
    case ScalarType.BYTES:
      return new Uint8Array(0);
    case ScalarType.STRING:
      return "";
    default:
      return 0;
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-binary-reader.js
class ReflectionBinaryReader {
  constructor(info) {
    this.info = info;
  }
  prepare() {
    var _a;
    if (!this.fieldNoToField) {
      const fieldsInput = (_a = this.info.fields) !== null && _a !== undefined ? _a : [];
      this.fieldNoToField = new Map(fieldsInput.map((field) => [field.no, field]));
    }
  }
  read(reader, message, options, length) {
    this.prepare();
    const end = length === undefined ? reader.len : reader.pos + length;
    while (reader.pos < end) {
      const [fieldNo, wireType] = reader.tag(), field = this.fieldNoToField.get(fieldNo);
      if (!field) {
        let u = options.readUnknownField;
        if (u == "throw")
          throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.info.typeName}`);
        let d = reader.skip(wireType);
        if (u !== false)
          (u === true ? UnknownFieldHandler.onRead : u)(this.info.typeName, message, fieldNo, wireType, d);
        continue;
      }
      let target = message, repeated = field.repeat, localName = field.localName;
      if (field.oneof) {
        target = target[field.oneof];
        if (target.oneofKind !== localName)
          target = message[field.oneof] = {
            oneofKind: localName
          };
      }
      switch (field.kind) {
        case "scalar":
        case "enum":
          let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
          let L = field.kind == "scalar" ? field.L : undefined;
          if (repeated) {
            let arr = target[localName];
            if (wireType == WireType.LengthDelimited && T != ScalarType.STRING && T != ScalarType.BYTES) {
              let e = reader.uint32() + reader.pos;
              while (reader.pos < e)
                arr.push(this.scalar(reader, T, L));
            } else
              arr.push(this.scalar(reader, T, L));
          } else
            target[localName] = this.scalar(reader, T, L);
          break;
        case "message":
          if (repeated) {
            let arr = target[localName];
            let msg = field.T().internalBinaryRead(reader, reader.uint32(), options);
            arr.push(msg);
          } else
            target[localName] = field.T().internalBinaryRead(reader, reader.uint32(), options, target[localName]);
          break;
        case "map":
          let [mapKey, mapVal] = this.mapEntry(field, reader, options);
          target[localName][mapKey] = mapVal;
          break;
      }
    }
  }
  mapEntry(field, reader, options) {
    let length = reader.uint32();
    let end = reader.pos + length;
    let key = undefined;
    let val = undefined;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          if (field.K == ScalarType.BOOL)
            key = reader.bool().toString();
          else
            key = this.scalar(reader, field.K, LongType.STRING);
          break;
        case 2:
          switch (field.V.kind) {
            case "scalar":
              val = this.scalar(reader, field.V.T, field.V.L);
              break;
            case "enum":
              val = reader.int32();
              break;
            case "message":
              val = field.V.T().internalBinaryRead(reader, reader.uint32(), options);
              break;
          }
          break;
        default:
          throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) in map entry for ${this.info.typeName}#${field.name}`);
      }
    }
    if (key === undefined) {
      let keyRaw = reflectionScalarDefault(field.K);
      key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw;
    }
    if (val === undefined)
      switch (field.V.kind) {
        case "scalar":
          val = reflectionScalarDefault(field.V.T, field.V.L);
          break;
        case "enum":
          val = 0;
          break;
        case "message":
          val = field.V.T().create();
          break;
      }
    return [key, val];
  }
  scalar(reader, type, longType) {
    switch (type) {
      case ScalarType.INT32:
        return reader.int32();
      case ScalarType.STRING:
        return reader.string();
      case ScalarType.BOOL:
        return reader.bool();
      case ScalarType.DOUBLE:
        return reader.double();
      case ScalarType.FLOAT:
        return reader.float();
      case ScalarType.INT64:
        return reflectionLongConvert(reader.int64(), longType);
      case ScalarType.UINT64:
        return reflectionLongConvert(reader.uint64(), longType);
      case ScalarType.FIXED64:
        return reflectionLongConvert(reader.fixed64(), longType);
      case ScalarType.FIXED32:
        return reader.fixed32();
      case ScalarType.BYTES:
        return reader.bytes();
      case ScalarType.UINT32:
        return reader.uint32();
      case ScalarType.SFIXED32:
        return reader.sfixed32();
      case ScalarType.SFIXED64:
        return reflectionLongConvert(reader.sfixed64(), longType);
      case ScalarType.SINT32:
        return reader.sint32();
      case ScalarType.SINT64:
        return reflectionLongConvert(reader.sint64(), longType);
    }
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-binary-writer.js
class ReflectionBinaryWriter {
  constructor(info) {
    this.info = info;
  }
  prepare() {
    if (!this.fields) {
      const fieldsInput = this.info.fields ? this.info.fields.concat() : [];
      this.fields = fieldsInput.sort((a, b) => a.no - b.no);
    }
  }
  write(message, writer, options) {
    this.prepare();
    for (const field of this.fields) {
      let value, emitDefault, repeated = field.repeat, localName = field.localName;
      if (field.oneof) {
        const group = message[field.oneof];
        if (group.oneofKind !== localName)
          continue;
        value = group[localName];
        emitDefault = true;
      } else {
        value = message[localName];
        emitDefault = false;
      }
      switch (field.kind) {
        case "scalar":
        case "enum":
          let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
          if (repeated) {
            assert(Array.isArray(value));
            if (repeated == RepeatType.PACKED)
              this.packed(writer, T, field.no, value);
            else
              for (const item of value)
                this.scalar(writer, T, field.no, item, true);
          } else if (value === undefined)
            assert(field.opt);
          else
            this.scalar(writer, T, field.no, value, emitDefault || field.opt);
          break;
        case "message":
          if (repeated) {
            assert(Array.isArray(value));
            for (const item of value)
              this.message(writer, options, field.T(), field.no, item);
          } else {
            this.message(writer, options, field.T(), field.no, value);
          }
          break;
        case "map":
          assert(typeof value == "object" && value !== null);
          for (const [key, val] of Object.entries(value))
            this.mapEntry(writer, options, field, key, val);
          break;
      }
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u === true ? UnknownFieldHandler.onWrite : u)(this.info.typeName, message, writer);
  }
  mapEntry(writer, options, field, key, value) {
    writer.tag(field.no, WireType.LengthDelimited);
    writer.fork();
    let keyValue = key;
    switch (field.K) {
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
        keyValue = Number.parseInt(key);
        break;
      case ScalarType.BOOL:
        assert(key == "true" || key == "false");
        keyValue = key == "true";
        break;
    }
    this.scalar(writer, field.K, 1, keyValue, true);
    switch (field.V.kind) {
      case "scalar":
        this.scalar(writer, field.V.T, 2, value, true);
        break;
      case "enum":
        this.scalar(writer, ScalarType.INT32, 2, value, true);
        break;
      case "message":
        this.message(writer, options, field.V.T(), 2, value);
        break;
    }
    writer.join();
  }
  message(writer, options, handler, fieldNo, value) {
    if (value === undefined)
      return;
    handler.internalBinaryWrite(value, writer.tag(fieldNo, WireType.LengthDelimited).fork(), options);
    writer.join();
  }
  scalar(writer, type, fieldNo, value, emitDefault) {
    let [wireType, method, isDefault] = this.scalarInfo(type, value);
    if (!isDefault || emitDefault) {
      writer.tag(fieldNo, wireType);
      writer[method](value);
    }
  }
  packed(writer, type, fieldNo, value) {
    if (!value.length)
      return;
    assert(type !== ScalarType.BYTES && type !== ScalarType.STRING);
    writer.tag(fieldNo, WireType.LengthDelimited);
    writer.fork();
    let [, method] = this.scalarInfo(type);
    for (let i = 0;i < value.length; i++)
      writer[method](value[i]);
    writer.join();
  }
  scalarInfo(type, value) {
    let t = WireType.Varint;
    let m;
    let i = value === undefined;
    let d = value === 0;
    switch (type) {
      case ScalarType.INT32:
        m = "int32";
        break;
      case ScalarType.STRING:
        d = i || !value.length;
        t = WireType.LengthDelimited;
        m = "string";
        break;
      case ScalarType.BOOL:
        d = value === false;
        m = "bool";
        break;
      case ScalarType.UINT32:
        m = "uint32";
        break;
      case ScalarType.DOUBLE:
        t = WireType.Bit64;
        m = "double";
        break;
      case ScalarType.FLOAT:
        t = WireType.Bit32;
        m = "float";
        break;
      case ScalarType.INT64:
        d = i || PbLong.from(value).isZero();
        m = "int64";
        break;
      case ScalarType.UINT64:
        d = i || PbULong.from(value).isZero();
        m = "uint64";
        break;
      case ScalarType.FIXED64:
        d = i || PbULong.from(value).isZero();
        t = WireType.Bit64;
        m = "fixed64";
        break;
      case ScalarType.BYTES:
        d = i || !value.byteLength;
        t = WireType.LengthDelimited;
        m = "bytes";
        break;
      case ScalarType.FIXED32:
        t = WireType.Bit32;
        m = "fixed32";
        break;
      case ScalarType.SFIXED32:
        t = WireType.Bit32;
        m = "sfixed32";
        break;
      case ScalarType.SFIXED64:
        d = i || PbLong.from(value).isZero();
        t = WireType.Bit64;
        m = "sfixed64";
        break;
      case ScalarType.SINT32:
        m = "sint32";
        break;
      case ScalarType.SINT64:
        d = i || PbLong.from(value).isZero();
        m = "sint64";
        break;
    }
    return [t, m, i || d];
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-create.js
function reflectionCreate(type) {
  const msg = type.messagePrototype ? Object.create(type.messagePrototype) : Object.defineProperty({}, MESSAGE_TYPE, { value: type });
  for (let field of type.fields) {
    let name = field.localName;
    if (field.opt)
      continue;
    if (field.oneof)
      msg[field.oneof] = { oneofKind: undefined };
    else if (field.repeat)
      msg[name] = [];
    else
      switch (field.kind) {
        case "scalar":
          msg[name] = reflectionScalarDefault(field.T, field.L);
          break;
        case "enum":
          msg[name] = 0;
          break;
        case "map":
          msg[name] = {};
          break;
      }
  }
  return msg;
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-merge-partial.js
function reflectionMergePartial(info, target, source) {
  let fieldValue, input = source, output;
  for (let field of info.fields) {
    let name = field.localName;
    if (field.oneof) {
      const group = input[field.oneof];
      if ((group === null || group === undefined ? undefined : group.oneofKind) == undefined) {
        continue;
      }
      fieldValue = group[name];
      output = target[field.oneof];
      output.oneofKind = group.oneofKind;
      if (fieldValue == undefined) {
        delete output[name];
        continue;
      }
    } else {
      fieldValue = input[name];
      output = target;
      if (fieldValue == undefined) {
        continue;
      }
    }
    if (field.repeat)
      output[name].length = fieldValue.length;
    switch (field.kind) {
      case "scalar":
      case "enum":
        if (field.repeat)
          for (let i = 0;i < fieldValue.length; i++)
            output[name][i] = fieldValue[i];
        else
          output[name] = fieldValue;
        break;
      case "message":
        let T = field.T();
        if (field.repeat)
          for (let i = 0;i < fieldValue.length; i++)
            output[name][i] = T.create(fieldValue[i]);
        else if (output[name] === undefined)
          output[name] = T.create(fieldValue);
        else
          T.mergePartial(output[name], fieldValue);
        break;
      case "map":
        switch (field.V.kind) {
          case "scalar":
          case "enum":
            Object.assign(output[name], fieldValue);
            break;
          case "message":
            let T2 = field.V.T();
            for (let k of Object.keys(fieldValue))
              output[name][k] = T2.create(fieldValue[k]);
            break;
        }
        break;
    }
  }
}

// node_modules/@protobuf-ts/runtime/build/es2015/reflection-equals.js
function reflectionEquals(info, a, b) {
  if (a === b)
    return true;
  if (!a || !b)
    return false;
  for (let field of info.fields) {
    let localName = field.localName;
    let val_a = field.oneof ? a[field.oneof][localName] : a[localName];
    let val_b = field.oneof ? b[field.oneof][localName] : b[localName];
    switch (field.kind) {
      case "enum":
      case "scalar":
        let t = field.kind == "enum" ? ScalarType.INT32 : field.T;
        if (!(field.repeat ? repeatedPrimitiveEq(t, val_a, val_b) : primitiveEq(t, val_a, val_b)))
          return false;
        break;
      case "map":
        if (!(field.V.kind == "message" ? repeatedMsgEq(field.V.T(), objectValues(val_a), objectValues(val_b)) : repeatedPrimitiveEq(field.V.kind == "enum" ? ScalarType.INT32 : field.V.T, objectValues(val_a), objectValues(val_b))))
          return false;
        break;
      case "message":
        let T = field.T();
        if (!(field.repeat ? repeatedMsgEq(T, val_a, val_b) : T.equals(val_a, val_b)))
          return false;
        break;
    }
  }
  return true;
}
var objectValues = Object.values;
function primitiveEq(type, a, b) {
  if (a === b)
    return true;
  if (type !== ScalarType.BYTES)
    return false;
  let ba = a;
  let bb = b;
  if (ba.length !== bb.length)
    return false;
  for (let i = 0;i < ba.length; i++)
    if (ba[i] != bb[i])
      return false;
  return true;
}
function repeatedPrimitiveEq(type, a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0;i < a.length; i++)
    if (!primitiveEq(type, a[i], b[i]))
      return false;
  return true;
}
function repeatedMsgEq(type, a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0;i < a.length; i++)
    if (!type.equals(a[i], b[i]))
      return false;
  return true;
}

// node_modules/@protobuf-ts/runtime/build/es2015/message-type.js
var baseDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));

class MessageType {
  constructor(name, fields, options) {
    this.defaultCheckDepth = 16;
    this.typeName = name;
    this.fields = fields.map(normalizeFieldInfo);
    this.options = options !== null && options !== undefined ? options : {};
    this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, baseDescriptors), { [MESSAGE_TYPE]: { value: this } }));
    this.refTypeCheck = new ReflectionTypeCheck(this);
    this.refJsonReader = new ReflectionJsonReader(this);
    this.refJsonWriter = new ReflectionJsonWriter(this);
    this.refBinReader = new ReflectionBinaryReader(this);
    this.refBinWriter = new ReflectionBinaryWriter(this);
  }
  create(value) {
    let message = reflectionCreate(this);
    if (value !== undefined) {
      reflectionMergePartial(this, message, value);
    }
    return message;
  }
  clone(message) {
    let copy = this.create();
    reflectionMergePartial(this, copy, message);
    return copy;
  }
  equals(a, b) {
    return reflectionEquals(this, a, b);
  }
  is(arg, depth = this.defaultCheckDepth) {
    return this.refTypeCheck.is(arg, depth, false);
  }
  isAssignable(arg, depth = this.defaultCheckDepth) {
    return this.refTypeCheck.is(arg, depth, true);
  }
  mergePartial(target, source) {
    reflectionMergePartial(this, target, source);
  }
  fromBinary(data, options) {
    let opt = binaryReadOptions(options);
    return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt);
  }
  fromJson(json, options) {
    return this.internalJsonRead(json, jsonReadOptions(options));
  }
  fromJsonString(json, options) {
    let value = JSON.parse(json);
    return this.fromJson(value, options);
  }
  toJson(message, options) {
    return this.internalJsonWrite(message, jsonWriteOptions(options));
  }
  toJsonString(message, options) {
    var _a;
    let value = this.toJson(message, options);
    return JSON.stringify(value, null, (_a = options === null || options === undefined ? undefined : options.prettySpaces) !== null && _a !== undefined ? _a : 0);
  }
  toBinary(message, options) {
    let opt = binaryWriteOptions(options);
    return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish();
  }
  internalJsonRead(json, options, target) {
    if (json !== null && typeof json == "object" && !Array.isArray(json)) {
      let message = target !== null && target !== undefined ? target : this.create();
      this.refJsonReader.read(json, message, options);
      return message;
    }
    throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(json)}.`);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.write(message, options);
  }
  internalBinaryWrite(message, writer, options) {
    this.refBinWriter.write(message, writer, options);
    return writer;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target !== null && target !== undefined ? target : this.create();
    this.refBinReader.read(reader, message, options, length);
    return message;
  }
}
// node_modules/discord-protos/src/discord_protos/google/protobuf/wrappers.ts
class DoubleValue$Type extends MessageType {
  constructor() {
    super("google.protobuf.DoubleValue", [
      { no: 1, name: "value", kind: "scalar", T: 1 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(2, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 1, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.double();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0)
      writer.tag(1, WireType.Bit64).double(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var DoubleValue = new DoubleValue$Type;

class FloatValue$Type extends MessageType {
  constructor() {
    super("google.protobuf.FloatValue", [
      { no: 1, name: "value", kind: "scalar", T: 2 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(1, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 1, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.float();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0)
      writer.tag(1, WireType.Bit32).float(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FloatValue = new FloatValue$Type;

class Int64Value$Type extends MessageType {
  constructor() {
    super("google.protobuf.Int64Value", [
      { no: 1, name: "value", kind: "scalar", T: 3, L: 0 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(ScalarType.INT64, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, ScalarType.INT64, LongType.BIGINT, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.int64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0n)
      writer.tag(1, WireType.Varint).int64(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var Int64Value = new Int64Value$Type;

class UInt64Value$Type extends MessageType {
  constructor() {
    super("google.protobuf.UInt64Value", [
      { no: 1, name: "value", kind: "scalar", T: 4, L: 0 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(ScalarType.UINT64, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, ScalarType.UINT64, LongType.BIGINT, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0n)
      writer.tag(1, WireType.Varint).uint64(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var UInt64Value = new UInt64Value$Type;

class Int32Value$Type extends MessageType {
  constructor() {
    super("google.protobuf.Int32Value", [
      { no: 1, name: "value", kind: "scalar", T: 5 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(5, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 5, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0)
      writer.tag(1, WireType.Varint).int32(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var Int32Value = new Int32Value$Type;

class UInt32Value$Type extends MessageType {
  constructor() {
    super("google.protobuf.UInt32Value", [
      { no: 1, name: "value", kind: "scalar", T: 13 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(13, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 13, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.uint32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== 0)
      writer.tag(1, WireType.Varint).uint32(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var UInt32Value = new UInt32Value$Type;

class BoolValue$Type extends MessageType {
  constructor() {
    super("google.protobuf.BoolValue", [
      { no: 1, name: "value", kind: "scalar", T: 8 }
    ]);
  }
  internalJsonWrite(message, options) {
    return message.value;
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 8, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== false)
      writer.tag(1, WireType.Varint).bool(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var BoolValue = new BoolValue$Type;

class StringValue$Type extends MessageType {
  constructor() {
    super("google.protobuf.StringValue", [
      { no: 1, name: "value", kind: "scalar", T: 9 }
    ]);
  }
  internalJsonWrite(message, options) {
    return message.value;
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 9, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = "";
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var StringValue = new StringValue$Type;

class BytesValue$Type extends MessageType {
  constructor() {
    super("google.protobuf.BytesValue", [
      { no: 1, name: "value", kind: "scalar", T: 12 }
    ]);
  }
  internalJsonWrite(message, options) {
    return this.refJsonWriter.scalar(12, message.value, "value", false, true);
  }
  internalJsonRead(json, options, target) {
    if (!target)
      target = this.create();
    target.value = this.refJsonReader.scalar(json, 12, undefined, "value");
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.value = new Uint8Array(0);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.value = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.value.length)
      writer.tag(1, WireType.LengthDelimited).bytes(message.value);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var BytesValue = new BytesValue$Type;

// node_modules/discord-protos/src/discord_protos/google/protobuf/timestamp.ts
class Timestamp$Type extends MessageType {
  constructor() {
    super("google.protobuf.Timestamp", [
      { no: 1, name: "seconds", kind: "scalar", T: 3, L: 0 },
      { no: 2, name: "nanos", kind: "scalar", T: 5 }
    ]);
  }
  now() {
    const msg = this.create();
    const ms = Date.now();
    msg.seconds = PbLong.from(Math.floor(ms / 1000)).toBigInt();
    msg.nanos = ms % 1000 * 1e6;
    return msg;
  }
  toDate(message) {
    return new Date(PbLong.from(message.seconds).toNumber() * 1000 + Math.ceil(message.nanos / 1e6));
  }
  fromDate(date) {
    const msg = this.create();
    const ms = date.getTime();
    msg.seconds = PbLong.from(Math.floor(ms / 1000)).toBigInt();
    msg.nanos = (ms % 1000 + (ms < 0 && ms % 1000 !== 0 ? 1000 : 0)) * 1e6;
    return msg;
  }
  internalJsonWrite(message, options) {
    let ms = PbLong.from(message.seconds).toNumber() * 1000;
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
      throw new Error("Unable to encode Timestamp to JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
    if (message.nanos < 0)
      throw new Error("Unable to encode invalid Timestamp to JSON. Nanos must not be negative.");
    let z = "Z";
    if (message.nanos > 0) {
      let nanosStr = (message.nanos + 1e9).toString().substring(1);
      if (nanosStr.substring(3) === "000000")
        z = "." + nanosStr.substring(0, 3) + "Z";
      else if (nanosStr.substring(6) === "000")
        z = "." + nanosStr.substring(0, 6) + "Z";
      else
        z = "." + nanosStr + "Z";
    }
    return new Date(ms).toISOString().replace(".000Z", z);
  }
  internalJsonRead(json, options, target) {
    if (typeof json !== "string")
      throw new Error("Unable to parse Timestamp from JSON " + typeofJsonValue(json) + ".");
    let matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
    if (!matches)
      throw new Error("Unable to parse Timestamp from JSON. Invalid format.");
    let ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
    if (Number.isNaN(ms))
      throw new Error("Unable to parse Timestamp from JSON. Invalid value.");
    if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
      throw new globalThis.Error("Unable to parse Timestamp from JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
    if (!target)
      target = this.create();
    target.seconds = PbLong.from(ms / 1000).toBigInt();
    target.nanos = 0;
    if (matches[7])
      target.nanos = parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1e9;
    return target;
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.seconds = 0n;
    message.nanos = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.seconds = reader.int64().toBigInt();
          break;
        case 2:
          message.nanos = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.seconds !== 0n)
      writer.tag(1, WireType.Varint).int64(message.seconds);
    if (message.nanos !== 0)
      writer.tag(2, WireType.Varint).int32(message.nanos);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var Timestamp = new Timestamp$Type;

// node_modules/discord-protos/src/discord_protos/discord_users/v1/PreloadedUserSettings.ts
var PreloadedUserSettings_InboxTab;
((PreloadedUserSettings_InboxTab2) => {
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["MENTIONS"] = 1] = "MENTIONS";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["UNREADS"] = 2] = "UNREADS";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["TODOS"] = 3] = "TODOS";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["FOR_YOU"] = 4] = "FOR_YOU";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["GAME_INVITES"] = 5] = "GAME_INVITES";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["BOOKMARKS"] = 6] = "BOOKMARKS";
  PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["SCHEDULED"] = 7] = "SCHEDULED";
})(PreloadedUserSettings_InboxTab ||= {});
var PreloadedUserSettings_DmSpamFilterV2;
((PreloadedUserSettings_DmSpamFilterV22) => {
  PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["DEFAULT_UNSET"] = 0] = "DEFAULT_UNSET";
  PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["DISABLED"] = 1] = "DISABLED";
  PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["NON_FRIENDS"] = 2] = "NON_FRIENDS";
  PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["FRIENDS_AND_NON_FRIENDS"] = 3] = "FRIENDS_AND_NON_FRIENDS";
})(PreloadedUserSettings_DmSpamFilterV2 ||= {});
var PreloadedUserSettings_ExplicitContentRedaction;
((PreloadedUserSettings_ExplicitContentRedaction2) => {
  PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["UNSET_EXPLICIT_CONTENT_REDACTION"] = 0] = "UNSET_EXPLICIT_CONTENT_REDACTION";
  PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["SHOW"] = 1] = "SHOW";
  PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["BLUR"] = 2] = "BLUR";
  PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["BLOCK"] = 3] = "BLOCK";
})(PreloadedUserSettings_ExplicitContentRedaction ||= {});
var PreloadedUserSettings_ReactionNotificationType;
((PreloadedUserSettings_ReactionNotificationType2) => {
  PreloadedUserSettings_ReactionNotificationType2[PreloadedUserSettings_ReactionNotificationType2["NOTIFICATIONS_ENABLED"] = 0] = "NOTIFICATIONS_ENABLED";
  PreloadedUserSettings_ReactionNotificationType2[PreloadedUserSettings_ReactionNotificationType2["ONLY_DMS"] = 1] = "ONLY_DMS";
  PreloadedUserSettings_ReactionNotificationType2[PreloadedUserSettings_ReactionNotificationType2["NOTIFICATIONS_DISABLED"] = 2] = "NOTIFICATIONS_DISABLED";
})(PreloadedUserSettings_ReactionNotificationType ||= {});
var PreloadedUserSettings_GuildActivityStatusRestrictionDefault;
((PreloadedUserSettings_GuildActivityStatusRestrictionDefault2) => {
  PreloadedUserSettings_GuildActivityStatusRestrictionDefault2[PreloadedUserSettings_GuildActivityStatusRestrictionDefault2["OFF"] = 0] = "OFF";
  PreloadedUserSettings_GuildActivityStatusRestrictionDefault2[PreloadedUserSettings_GuildActivityStatusRestrictionDefault2["ON_FOR_LARGE_GUILDS"] = 1] = "ON_FOR_LARGE_GUILDS";
  PreloadedUserSettings_GuildActivityStatusRestrictionDefault2[PreloadedUserSettings_GuildActivityStatusRestrictionDefault2["ON"] = 2] = "ON";
})(PreloadedUserSettings_GuildActivityStatusRestrictionDefault ||= {});
var PreloadedUserSettings_GuildsLeaderboardOptOutDefault;
((PreloadedUserSettings_GuildsLeaderboardOptOutDefault2) => {
  PreloadedUserSettings_GuildsLeaderboardOptOutDefault2[PreloadedUserSettings_GuildsLeaderboardOptOutDefault2["OFF_FOR_NEW_GUILDS"] = 0] = "OFF_FOR_NEW_GUILDS";
  PreloadedUserSettings_GuildsLeaderboardOptOutDefault2[PreloadedUserSettings_GuildsLeaderboardOptOutDefault2["ON_FOR_NEW_GUILDS"] = 1] = "ON_FOR_NEW_GUILDS";
})(PreloadedUserSettings_GuildsLeaderboardOptOutDefault ||= {});
var PreloadedUserSettings_SlayerSDKReceiveInGameDMs;
((PreloadedUserSettings_SlayerSDKReceiveInGameDMs2) => {
  PreloadedUserSettings_SlayerSDKReceiveInGameDMs2[PreloadedUserSettings_SlayerSDKReceiveInGameDMs2["SLAYER_SDK_RECEIVE_IN_GAME_DMS_UNSET"] = 0] = "SLAYER_SDK_RECEIVE_IN_GAME_DMS_UNSET";
  PreloadedUserSettings_SlayerSDKReceiveInGameDMs2[PreloadedUserSettings_SlayerSDKReceiveInGameDMs2["SLAYER_SDK_RECEIVE_IN_GAME_DMS_ALL"] = 1] = "SLAYER_SDK_RECEIVE_IN_GAME_DMS_ALL";
  PreloadedUserSettings_SlayerSDKReceiveInGameDMs2[PreloadedUserSettings_SlayerSDKReceiveInGameDMs2["SLAYER_SDK_RECEIVE_IN_GAME_DMS_USERS_WITH_GAME"] = 2] = "SLAYER_SDK_RECEIVE_IN_GAME_DMS_USERS_WITH_GAME";
  PreloadedUserSettings_SlayerSDKReceiveInGameDMs2[PreloadedUserSettings_SlayerSDKReceiveInGameDMs2["SLAYER_SDK_RECEIVE_IN_GAME_DMS_NONE"] = 3] = "SLAYER_SDK_RECEIVE_IN_GAME_DMS_NONE";
})(PreloadedUserSettings_SlayerSDKReceiveInGameDMs ||= {});
var PreloadedUserSettings_Theme;
((PreloadedUserSettings_Theme2) => {
  PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["UNSET"] = 0] = "UNSET";
  PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["DARK"] = 1] = "DARK";
  PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["LIGHT"] = 2] = "LIGHT";
  PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["DARKER"] = 3] = "DARKER";
  PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["MIDNIGHT"] = 4] = "MIDNIGHT";
})(PreloadedUserSettings_Theme ||= {});
var PreloadedUserSettings_TimestampHourCycle;
((PreloadedUserSettings_TimestampHourCycle2) => {
  PreloadedUserSettings_TimestampHourCycle2[PreloadedUserSettings_TimestampHourCycle2["AUTO"] = 0] = "AUTO";
  PreloadedUserSettings_TimestampHourCycle2[PreloadedUserSettings_TimestampHourCycle2["H12"] = 1] = "H12";
  PreloadedUserSettings_TimestampHourCycle2[PreloadedUserSettings_TimestampHourCycle2["H23"] = 2] = "H23";
})(PreloadedUserSettings_TimestampHourCycle ||= {});
var PreloadedUserSettings_LaunchPadMode;
((PreloadedUserSettings_LaunchPadMode2) => {
  PreloadedUserSettings_LaunchPadMode2[PreloadedUserSettings_LaunchPadMode2["LAUNCH_PAD_DISABLED"] = 0] = "LAUNCH_PAD_DISABLED";
  PreloadedUserSettings_LaunchPadMode2[PreloadedUserSettings_LaunchPadMode2["LAUNCH_PAD_GESTURE_FULL_SCREEN"] = 1] = "LAUNCH_PAD_GESTURE_FULL_SCREEN";
  PreloadedUserSettings_LaunchPadMode2[PreloadedUserSettings_LaunchPadMode2["LAUNCH_PAD_GESTURE_RIGHT_EDGE"] = 2] = "LAUNCH_PAD_GESTURE_RIGHT_EDGE";
  PreloadedUserSettings_LaunchPadMode2[PreloadedUserSettings_LaunchPadMode2["LAUNCH_PAD_PULL_TAB"] = 3] = "LAUNCH_PAD_PULL_TAB";
})(PreloadedUserSettings_LaunchPadMode ||= {});
var PreloadedUserSettings_UIDensity;
((PreloadedUserSettings_UIDensity2) => {
  PreloadedUserSettings_UIDensity2[PreloadedUserSettings_UIDensity2["UI_DENSITY_UNSET_UI_DENSITY"] = 0] = "UI_DENSITY_UNSET_UI_DENSITY";
  PreloadedUserSettings_UIDensity2[PreloadedUserSettings_UIDensity2["UI_DENSITY_COMPACT"] = 1] = "UI_DENSITY_COMPACT";
  PreloadedUserSettings_UIDensity2[PreloadedUserSettings_UIDensity2["UI_DENSITY_COZY"] = 2] = "UI_DENSITY_COZY";
  PreloadedUserSettings_UIDensity2[PreloadedUserSettings_UIDensity2["UI_DENSITY_RESPONSIVE"] = 3] = "UI_DENSITY_RESPONSIVE";
  PreloadedUserSettings_UIDensity2[PreloadedUserSettings_UIDensity2["UI_DENSITY_DEFAULT"] = 4] = "UI_DENSITY_DEFAULT";
})(PreloadedUserSettings_UIDensity ||= {});
var PreloadedUserSettings_SwipeRightToLeftMode;
((PreloadedUserSettings_SwipeRightToLeftMode2) => {
  PreloadedUserSettings_SwipeRightToLeftMode2[PreloadedUserSettings_SwipeRightToLeftMode2["SWIPE_RIGHT_TO_LEFT_UNSET"] = 0] = "SWIPE_RIGHT_TO_LEFT_UNSET";
  PreloadedUserSettings_SwipeRightToLeftMode2[PreloadedUserSettings_SwipeRightToLeftMode2["SWIPE_RIGHT_TO_LEFT_CHANNEL_DETAILS"] = 1] = "SWIPE_RIGHT_TO_LEFT_CHANNEL_DETAILS";
  PreloadedUserSettings_SwipeRightToLeftMode2[PreloadedUserSettings_SwipeRightToLeftMode2["SWIPE_RIGHT_TO_LEFT_REPLY"] = 2] = "SWIPE_RIGHT_TO_LEFT_REPLY";
})(PreloadedUserSettings_SwipeRightToLeftMode ||= {});
var PreloadedUserSettings_FavoriteChannelType;
((PreloadedUserSettings_FavoriteChannelType2) => {
  PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["UNSET_FAVORITE_CHANNEL_TYPE"] = 0] = "UNSET_FAVORITE_CHANNEL_TYPE";
  PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["REFERENCE_ORIGINAL"] = 1] = "REFERENCE_ORIGINAL";
  PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["CATEGORY"] = 2] = "CATEGORY";
})(PreloadedUserSettings_FavoriteChannelType ||= {});
var PreloadedUserSettings_ForLaterTab;
((PreloadedUserSettings_ForLaterTab2) => {
  PreloadedUserSettings_ForLaterTab2[PreloadedUserSettings_ForLaterTab2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  PreloadedUserSettings_ForLaterTab2[PreloadedUserSettings_ForLaterTab2["ALL"] = 1] = "ALL";
  PreloadedUserSettings_ForLaterTab2[PreloadedUserSettings_ForLaterTab2["BOOKMARKS"] = 2] = "BOOKMARKS";
  PreloadedUserSettings_ForLaterTab2[PreloadedUserSettings_ForLaterTab2["REMINDERS"] = 3] = "REMINDERS";
})(PreloadedUserSettings_ForLaterTab ||= {});
var PreloadedUserSettings_SafetySettingsPresetType;
((PreloadedUserSettings_SafetySettingsPresetType2) => {
  PreloadedUserSettings_SafetySettingsPresetType2[PreloadedUserSettings_SafetySettingsPresetType2["UNSET_SAFETY_SETTINGS_PRESET"] = 0] = "UNSET_SAFETY_SETTINGS_PRESET";
  PreloadedUserSettings_SafetySettingsPresetType2[PreloadedUserSettings_SafetySettingsPresetType2["BALANCED"] = 1] = "BALANCED";
  PreloadedUserSettings_SafetySettingsPresetType2[PreloadedUserSettings_SafetySettingsPresetType2["STRICT"] = 2] = "STRICT";
  PreloadedUserSettings_SafetySettingsPresetType2[PreloadedUserSettings_SafetySettingsPresetType2["RELAXED"] = 3] = "RELAXED";
  PreloadedUserSettings_SafetySettingsPresetType2[PreloadedUserSettings_SafetySettingsPresetType2["CUSTOM"] = 4] = "CUSTOM";
})(PreloadedUserSettings_SafetySettingsPresetType ||= {});

class PreloadedUserSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings", [
      { no: 1, name: "versions", kind: "message", T: () => PreloadedUserSettings_Versions },
      { no: 2, name: "inbox", kind: "message", T: () => PreloadedUserSettings_InboxSettings },
      { no: 3, name: "guilds", kind: "message", T: () => PreloadedUserSettings_AllGuildSettings },
      { no: 4, name: "user_content", kind: "message", T: () => PreloadedUserSettings_UserContentSettings },
      { no: 5, name: "voice_and_video", kind: "message", T: () => PreloadedUserSettings_VoiceAndVideoSettings },
      { no: 6, name: "text_and_images", kind: "message", T: () => PreloadedUserSettings_TextAndImagesSettings },
      { no: 7, name: "notifications", kind: "message", T: () => PreloadedUserSettings_NotificationSettings },
      { no: 8, name: "privacy", kind: "message", T: () => PreloadedUserSettings_PrivacySettings },
      { no: 9, name: "debug", kind: "message", T: () => PreloadedUserSettings_DebugSettings },
      { no: 10, name: "game_library", kind: "message", T: () => PreloadedUserSettings_GameLibrarySettings },
      { no: 11, name: "status", kind: "message", T: () => PreloadedUserSettings_StatusSettings },
      { no: 12, name: "localization", kind: "message", T: () => PreloadedUserSettings_LocalizationSettings },
      { no: 13, name: "appearance", kind: "message", T: () => PreloadedUserSettings_AppearanceSettings },
      { no: 14, name: "guild_folders", kind: "message", T: () => PreloadedUserSettings_GuildFolders },
      { no: 15, name: "favorites", kind: "message", T: () => PreloadedUserSettings_Favorites },
      { no: 16, name: "audio_context_settings", kind: "message", T: () => PreloadedUserSettings_AudioSettings },
      { no: 17, name: "communities", kind: "message", T: () => PreloadedUserSettings_CommunitiesSettings },
      { no: 18, name: "broadcast", kind: "message", T: () => PreloadedUserSettings_BroadcastSettings },
      { no: 19, name: "clips", kind: "message", T: () => PreloadedUserSettings_ClipsSettings },
      { no: 20, name: "for_later", kind: "message", T: () => PreloadedUserSettings_ForLaterSettings },
      { no: 21, name: "safety_settings", kind: "message", T: () => PreloadedUserSettings_SafetySettings },
      { no: 22, name: "icymi_settings", kind: "message", T: () => PreloadedUserSettings_ICYMISettings },
      { no: 23, name: "applications", kind: "message", T: () => PreloadedUserSettings_AllApplicationSettings },
      { no: 24, name: "ads", kind: "message", T: () => PreloadedUserSettings_AdsSettings }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.versions = PreloadedUserSettings_Versions.internalBinaryRead(reader, reader.uint32(), options, message.versions);
          break;
        case 2:
          message.inbox = PreloadedUserSettings_InboxSettings.internalBinaryRead(reader, reader.uint32(), options, message.inbox);
          break;
        case 3:
          message.guilds = PreloadedUserSettings_AllGuildSettings.internalBinaryRead(reader, reader.uint32(), options, message.guilds);
          break;
        case 4:
          message.userContent = PreloadedUserSettings_UserContentSettings.internalBinaryRead(reader, reader.uint32(), options, message.userContent);
          break;
        case 5:
          message.voiceAndVideo = PreloadedUserSettings_VoiceAndVideoSettings.internalBinaryRead(reader, reader.uint32(), options, message.voiceAndVideo);
          break;
        case 6:
          message.textAndImages = PreloadedUserSettings_TextAndImagesSettings.internalBinaryRead(reader, reader.uint32(), options, message.textAndImages);
          break;
        case 7:
          message.notifications = PreloadedUserSettings_NotificationSettings.internalBinaryRead(reader, reader.uint32(), options, message.notifications);
          break;
        case 8:
          message.privacy = PreloadedUserSettings_PrivacySettings.internalBinaryRead(reader, reader.uint32(), options, message.privacy);
          break;
        case 9:
          message.debug = PreloadedUserSettings_DebugSettings.internalBinaryRead(reader, reader.uint32(), options, message.debug);
          break;
        case 10:
          message.gameLibrary = PreloadedUserSettings_GameLibrarySettings.internalBinaryRead(reader, reader.uint32(), options, message.gameLibrary);
          break;
        case 11:
          message.status = PreloadedUserSettings_StatusSettings.internalBinaryRead(reader, reader.uint32(), options, message.status);
          break;
        case 12:
          message.localization = PreloadedUserSettings_LocalizationSettings.internalBinaryRead(reader, reader.uint32(), options, message.localization);
          break;
        case 13:
          message.appearance = PreloadedUserSettings_AppearanceSettings.internalBinaryRead(reader, reader.uint32(), options, message.appearance);
          break;
        case 14:
          message.guildFolders = PreloadedUserSettings_GuildFolders.internalBinaryRead(reader, reader.uint32(), options, message.guildFolders);
          break;
        case 15:
          message.favorites = PreloadedUserSettings_Favorites.internalBinaryRead(reader, reader.uint32(), options, message.favorites);
          break;
        case 16:
          message.audioContextSettings = PreloadedUserSettings_AudioSettings.internalBinaryRead(reader, reader.uint32(), options, message.audioContextSettings);
          break;
        case 17:
          message.communities = PreloadedUserSettings_CommunitiesSettings.internalBinaryRead(reader, reader.uint32(), options, message.communities);
          break;
        case 18:
          message.broadcast = PreloadedUserSettings_BroadcastSettings.internalBinaryRead(reader, reader.uint32(), options, message.broadcast);
          break;
        case 19:
          message.clips = PreloadedUserSettings_ClipsSettings.internalBinaryRead(reader, reader.uint32(), options, message.clips);
          break;
        case 20:
          message.forLater = PreloadedUserSettings_ForLaterSettings.internalBinaryRead(reader, reader.uint32(), options, message.forLater);
          break;
        case 21:
          message.safetySettings = PreloadedUserSettings_SafetySettings.internalBinaryRead(reader, reader.uint32(), options, message.safetySettings);
          break;
        case 22:
          message.icymiSettings = PreloadedUserSettings_ICYMISettings.internalBinaryRead(reader, reader.uint32(), options, message.icymiSettings);
          break;
        case 23:
          message.applications = PreloadedUserSettings_AllApplicationSettings.internalBinaryRead(reader, reader.uint32(), options, message.applications);
          break;
        case 24:
          message.ads = PreloadedUserSettings_AdsSettings.internalBinaryRead(reader, reader.uint32(), options, message.ads);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.versions)
      PreloadedUserSettings_Versions.internalBinaryWrite(message.versions, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.inbox)
      PreloadedUserSettings_InboxSettings.internalBinaryWrite(message.inbox, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.guilds)
      PreloadedUserSettings_AllGuildSettings.internalBinaryWrite(message.guilds, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.userContent)
      PreloadedUserSettings_UserContentSettings.internalBinaryWrite(message.userContent, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.voiceAndVideo)
      PreloadedUserSettings_VoiceAndVideoSettings.internalBinaryWrite(message.voiceAndVideo, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.textAndImages)
      PreloadedUserSettings_TextAndImagesSettings.internalBinaryWrite(message.textAndImages, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.notifications)
      PreloadedUserSettings_NotificationSettings.internalBinaryWrite(message.notifications, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.privacy)
      PreloadedUserSettings_PrivacySettings.internalBinaryWrite(message.privacy, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.debug)
      PreloadedUserSettings_DebugSettings.internalBinaryWrite(message.debug, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
    if (message.gameLibrary)
      PreloadedUserSettings_GameLibrarySettings.internalBinaryWrite(message.gameLibrary, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.status)
      PreloadedUserSettings_StatusSettings.internalBinaryWrite(message.status, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
    if (message.localization)
      PreloadedUserSettings_LocalizationSettings.internalBinaryWrite(message.localization, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
    if (message.appearance)
      PreloadedUserSettings_AppearanceSettings.internalBinaryWrite(message.appearance, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
    if (message.guildFolders)
      PreloadedUserSettings_GuildFolders.internalBinaryWrite(message.guildFolders, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
    if (message.favorites)
      PreloadedUserSettings_Favorites.internalBinaryWrite(message.favorites, writer.tag(15, WireType.LengthDelimited).fork(), options).join();
    if (message.audioContextSettings)
      PreloadedUserSettings_AudioSettings.internalBinaryWrite(message.audioContextSettings, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
    if (message.communities)
      PreloadedUserSettings_CommunitiesSettings.internalBinaryWrite(message.communities, writer.tag(17, WireType.LengthDelimited).fork(), options).join();
    if (message.broadcast)
      PreloadedUserSettings_BroadcastSettings.internalBinaryWrite(message.broadcast, writer.tag(18, WireType.LengthDelimited).fork(), options).join();
    if (message.clips)
      PreloadedUserSettings_ClipsSettings.internalBinaryWrite(message.clips, writer.tag(19, WireType.LengthDelimited).fork(), options).join();
    if (message.forLater)
      PreloadedUserSettings_ForLaterSettings.internalBinaryWrite(message.forLater, writer.tag(20, WireType.LengthDelimited).fork(), options).join();
    if (message.safetySettings)
      PreloadedUserSettings_SafetySettings.internalBinaryWrite(message.safetySettings, writer.tag(21, WireType.LengthDelimited).fork(), options).join();
    if (message.icymiSettings)
      PreloadedUserSettings_ICYMISettings.internalBinaryWrite(message.icymiSettings, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
    if (message.applications)
      PreloadedUserSettings_AllApplicationSettings.internalBinaryWrite(message.applications, writer.tag(23, WireType.LengthDelimited).fork(), options).join();
    if (message.ads)
      PreloadedUserSettings_AdsSettings.internalBinaryWrite(message.ads, writer.tag(24, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings = new PreloadedUserSettings$Type;

class PreloadedUserSettings_Versions$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.Versions", [
      { no: 1, name: "client_version", kind: "scalar", T: 13 },
      { no: 2, name: "server_version", kind: "scalar", T: 13 },
      { no: 3, name: "data_version", kind: "scalar", T: 13 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.clientVersion = 0;
    message.serverVersion = 0;
    message.dataVersion = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.clientVersion = reader.uint32();
          break;
        case 2:
          message.serverVersion = reader.uint32();
          break;
        case 3:
          message.dataVersion = reader.uint32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clientVersion !== 0)
      writer.tag(1, WireType.Varint).uint32(message.clientVersion);
    if (message.serverVersion !== 0)
      writer.tag(2, WireType.Varint).uint32(message.serverVersion);
    if (message.dataVersion !== 0)
      writer.tag(3, WireType.Varint).uint32(message.dataVersion);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_Versions = new PreloadedUserSettings_Versions$Type;

class PreloadedUserSettings_InboxSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.InboxSettings", [
      { no: 1, name: "current_tab", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.InboxTab", PreloadedUserSettings_InboxTab, "INBOX_TAB_"] },
      { no: 2, name: "viewed_tutorial", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.currentTab = 0;
    message.viewedTutorial = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.currentTab = reader.int32();
          break;
        case 2:
          message.viewedTutorial = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.currentTab !== 0)
      writer.tag(1, WireType.Varint).int32(message.currentTab);
    if (message.viewedTutorial !== false)
      writer.tag(2, WireType.Varint).bool(message.viewedTutorial);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_InboxSettings = new PreloadedUserSettings_InboxSettings$Type;

class PreloadedUserSettings_ChannelIconEmoji$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ChannelIconEmoji", [
      { no: 1, name: "id", kind: "message", T: () => UInt64Value },
      { no: 2, name: "name", kind: "message", T: () => StringValue },
      { no: 3, name: "color", kind: "message", T: () => UInt64Value }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.id = UInt64Value.internalBinaryRead(reader, reader.uint32(), options, message.id);
          break;
        case 2:
          message.name = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.name);
          break;
        case 3:
          message.color = UInt64Value.internalBinaryRead(reader, reader.uint32(), options, message.color);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.id)
      UInt64Value.internalBinaryWrite(message.id, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.name)
      StringValue.internalBinaryWrite(message.name, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.color)
      UInt64Value.internalBinaryWrite(message.color, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ChannelIconEmoji = new PreloadedUserSettings_ChannelIconEmoji$Type;

class PreloadedUserSettings_CustomNotificationSoundConfig$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.CustomNotificationSoundConfig", [
      { no: 1, name: "notification_sound_pack_id", kind: "message", T: () => StringValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.notificationSoundPackId = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.notificationSoundPackId);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.notificationSoundPackId)
      StringValue.internalBinaryWrite(message.notificationSoundPackId, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_CustomNotificationSoundConfig = new PreloadedUserSettings_CustomNotificationSoundConfig$Type;

class PreloadedUserSettings_ChannelSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ChannelSettings", [
      { no: 1, name: "collapsed_in_inbox", kind: "scalar", T: 8 },
      { no: 2, name: "icon_emoji", kind: "message", T: () => PreloadedUserSettings_ChannelIconEmoji },
      { no: 3, name: "custom_notification_sound_config", kind: "message", T: () => PreloadedUserSettings_CustomNotificationSoundConfig }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.collapsedInInbox = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.collapsedInInbox = reader.bool();
          break;
        case 2:
          message.iconEmoji = PreloadedUserSettings_ChannelIconEmoji.internalBinaryRead(reader, reader.uint32(), options, message.iconEmoji);
          break;
        case 3:
          message.customNotificationSoundConfig = PreloadedUserSettings_CustomNotificationSoundConfig.internalBinaryRead(reader, reader.uint32(), options, message.customNotificationSoundConfig);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.collapsedInInbox !== false)
      writer.tag(1, WireType.Varint).bool(message.collapsedInInbox);
    if (message.iconEmoji)
      PreloadedUserSettings_ChannelIconEmoji.internalBinaryWrite(message.iconEmoji, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.customNotificationSoundConfig)
      PreloadedUserSettings_CustomNotificationSoundConfig.internalBinaryWrite(message.customNotificationSoundConfig, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ChannelSettings = new PreloadedUserSettings_ChannelSettings$Type;

class PreloadedUserSettings_CustomCallSound$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.CustomCallSound", [
      { no: 1, name: "sound_id", kind: "scalar", T: 6, L: 0 },
      { no: 2, name: "guild_id", kind: "scalar", T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.soundId = 0n;
    message.guildId = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.soundId = reader.fixed64().toBigInt();
          break;
        case 2:
          message.guildId = reader.fixed64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.soundId !== 0n)
      writer.tag(1, WireType.Bit64).fixed64(message.soundId);
    if (message.guildId !== 0n)
      writer.tag(2, WireType.Bit64).fixed64(message.guildId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_CustomCallSound = new PreloadedUserSettings_CustomCallSound$Type;

class PreloadedUserSettings_ChannelListSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ChannelListSettings", [
      { no: 1, name: "layout", kind: "message", T: () => StringValue },
      { no: 2, name: "message_previews", kind: "message", T: () => StringValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.layout = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.layout);
          break;
        case 2:
          message.messagePreviews = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.messagePreviews);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.layout)
      StringValue.internalBinaryWrite(message.layout, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.messagePreviews)
      StringValue.internalBinaryWrite(message.messagePreviews, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ChannelListSettings = new PreloadedUserSettings_ChannelListSettings$Type;

class PreloadedUserSettings_GuildSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.GuildSettings", [
      { no: 1, name: "channels", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_ChannelSettings } },
      { no: 2, name: "hub_progress", kind: "scalar", T: 13 },
      { no: 3, name: "guild_onboarding_progress", kind: "scalar", T: 13 },
      { no: 4, name: "guild_recents_dismissed_at", kind: "message", T: () => Timestamp },
      { no: 5, name: "dismissed_guild_content", kind: "scalar", T: 12 },
      { no: 6, name: "join_sound", kind: "message", T: () => PreloadedUserSettings_CustomCallSound },
      { no: 7, name: "mobile_redesign_channel_list_settings", kind: "message", T: () => PreloadedUserSettings_ChannelListSettings },
      { no: 8, name: "disable_raid_alert_push", kind: "scalar", T: 8 },
      { no: 9, name: "disable_raid_alert_nag", kind: "scalar", T: 8 },
      { no: 10, name: "custom_notification_sound_config", kind: "message", T: () => PreloadedUserSettings_CustomNotificationSoundConfig },
      { no: 11, name: "leaderboards_disabled", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.channels = {};
    message.hubProgress = 0;
    message.guildOnboardingProgress = 0;
    message.dismissedGuildContent = new Uint8Array(0);
    message.disableRaidAlertPush = false;
    message.disableRaidAlertNag = false;
    message.leaderboardsDisabled = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.channels, reader, options);
          break;
        case 2:
          message.hubProgress = reader.uint32();
          break;
        case 3:
          message.guildOnboardingProgress = reader.uint32();
          break;
        case 4:
          message.guildRecentsDismissedAt = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.guildRecentsDismissedAt);
          break;
        case 5:
          message.dismissedGuildContent = reader.bytes();
          break;
        case 6:
          message.joinSound = PreloadedUserSettings_CustomCallSound.internalBinaryRead(reader, reader.uint32(), options, message.joinSound);
          break;
        case 7:
          message.mobileRedesignChannelListSettings = PreloadedUserSettings_ChannelListSettings.internalBinaryRead(reader, reader.uint32(), options, message.mobileRedesignChannelListSettings);
          break;
        case 8:
          message.disableRaidAlertPush = reader.bool();
          break;
        case 9:
          message.disableRaidAlertNag = reader.bool();
          break;
        case 10:
          message.customNotificationSoundConfig = PreloadedUserSettings_CustomNotificationSoundConfig.internalBinaryRead(reader, reader.uint32(), options, message.customNotificationSoundConfig);
          break;
        case 11:
          message.leaderboardsDisabled = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_ChannelSettings.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.GuildSettings.channels");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_ChannelSettings.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.channels)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_ChannelSettings.internalBinaryWrite(message.channels[k], writer, options);
      writer.join().join();
    }
    if (message.hubProgress !== 0)
      writer.tag(2, WireType.Varint).uint32(message.hubProgress);
    if (message.guildOnboardingProgress !== 0)
      writer.tag(3, WireType.Varint).uint32(message.guildOnboardingProgress);
    if (message.guildRecentsDismissedAt)
      Timestamp.internalBinaryWrite(message.guildRecentsDismissedAt, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.dismissedGuildContent.length)
      writer.tag(5, WireType.LengthDelimited).bytes(message.dismissedGuildContent);
    if (message.joinSound)
      PreloadedUserSettings_CustomCallSound.internalBinaryWrite(message.joinSound, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.mobileRedesignChannelListSettings)
      PreloadedUserSettings_ChannelListSettings.internalBinaryWrite(message.mobileRedesignChannelListSettings, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.disableRaidAlertPush !== false)
      writer.tag(8, WireType.Varint).bool(message.disableRaidAlertPush);
    if (message.disableRaidAlertNag !== false)
      writer.tag(9, WireType.Varint).bool(message.disableRaidAlertNag);
    if (message.customNotificationSoundConfig)
      PreloadedUserSettings_CustomNotificationSoundConfig.internalBinaryWrite(message.customNotificationSoundConfig, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.leaderboardsDisabled !== false)
      writer.tag(11, WireType.Varint).bool(message.leaderboardsDisabled);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_GuildSettings = new PreloadedUserSettings_GuildSettings$Type;

class PreloadedUserSettings_AllGuildSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AllGuildSettings", [
      { no: 1, name: "guilds", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_GuildSettings } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.guilds = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.guilds, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_GuildSettings.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.AllGuildSettings.guilds");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_GuildSettings.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.guilds)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_GuildSettings.internalBinaryWrite(message.guilds[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AllGuildSettings = new PreloadedUserSettings_AllGuildSettings$Type;

class PreloadedUserSettings_RecurringDismissibleContentState$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.RecurringDismissibleContentState", [
      { no: 1, name: "last_dismissed_version", kind: "scalar", T: 13 },
      { no: 2, name: "last_dismissed_at_ms", kind: "scalar", T: 4, L: 0 },
      { no: 3, name: "last_dismissed_object_id", kind: "scalar", T: 4, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.lastDismissedVersion = 0;
    message.lastDismissedAtMs = 0n;
    message.lastDismissedObjectId = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.lastDismissedVersion = reader.uint32();
          break;
        case 2:
          message.lastDismissedAtMs = reader.uint64().toBigInt();
          break;
        case 3:
          message.lastDismissedObjectId = reader.uint64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.lastDismissedVersion !== 0)
      writer.tag(1, WireType.Varint).uint32(message.lastDismissedVersion);
    if (message.lastDismissedAtMs !== 0n)
      writer.tag(2, WireType.Varint).uint64(message.lastDismissedAtMs);
    if (message.lastDismissedObjectId !== 0n)
      writer.tag(3, WireType.Varint).uint64(message.lastDismissedObjectId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_RecurringDismissibleContentState = new PreloadedUserSettings_RecurringDismissibleContentState$Type;

class PreloadedUserSettings_UserContentSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.UserContentSettings", [
      { no: 1, name: "dismissed_contents", kind: "scalar", T: 12 },
      { no: 2, name: "last_dismissed_outbound_promotion_start_date", kind: "message", T: () => StringValue },
      { no: 3, name: "premium_tier_0_modal_dismissed_at", kind: "message", T: () => Timestamp },
      { no: 4, name: "guild_onboarding_upsell_dismissed_at", kind: "message", T: () => Timestamp },
      { no: 5, name: "safety_user_sentiment_notice_dismissed_at", kind: "message", T: () => Timestamp },
      { no: 6, name: "last_received_changelog_id", kind: "scalar", T: 6, L: 0 },
      { no: 7, name: "recurring_dismissible_content_states", kind: "map", K: 5, V: { kind: "message", T: () => PreloadedUserSettings_RecurringDismissibleContentState } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.dismissedContents = new Uint8Array(0);
    message.lastReceivedChangelogId = 0n;
    message.recurringDismissibleContentStates = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.dismissedContents = reader.bytes();
          break;
        case 2:
          message.lastDismissedOutboundPromotionStartDate = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.lastDismissedOutboundPromotionStartDate);
          break;
        case 3:
          message.premiumTier0ModalDismissedAt = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.premiumTier0ModalDismissedAt);
          break;
        case 4:
          message.guildOnboardingUpsellDismissedAt = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.guildOnboardingUpsellDismissedAt);
          break;
        case 5:
          message.safetyUserSentimentNoticeDismissedAt = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.safetyUserSentimentNoticeDismissedAt);
          break;
        case 6:
          message.lastReceivedChangelogId = reader.fixed64().toBigInt();
          break;
        case 7:
          this.binaryReadMap7(message.recurringDismissibleContentStates, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap7(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.int32();
          break;
        case 2:
          val = PreloadedUserSettings_RecurringDismissibleContentState.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.UserContentSettings.recurring_dismissible_content_states");
      }
    }
    map[key ?? 0] = val ?? PreloadedUserSettings_RecurringDismissibleContentState.create();
  }
  internalBinaryWrite(message, writer, options) {
    if (message.dismissedContents.length)
      writer.tag(1, WireType.LengthDelimited).bytes(message.dismissedContents);
    if (message.lastDismissedOutboundPromotionStartDate)
      StringValue.internalBinaryWrite(message.lastDismissedOutboundPromotionStartDate, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.premiumTier0ModalDismissedAt)
      Timestamp.internalBinaryWrite(message.premiumTier0ModalDismissedAt, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.guildOnboardingUpsellDismissedAt)
      Timestamp.internalBinaryWrite(message.guildOnboardingUpsellDismissedAt, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.safetyUserSentimentNoticeDismissedAt)
      Timestamp.internalBinaryWrite(message.safetyUserSentimentNoticeDismissedAt, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.lastReceivedChangelogId !== 0n)
      writer.tag(6, WireType.Bit64).fixed64(message.lastReceivedChangelogId);
    for (let k of globalThis.Object.keys(message.recurringDismissibleContentStates)) {
      writer.tag(7, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int32(parseInt(k));
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_RecurringDismissibleContentState.internalBinaryWrite(message.recurringDismissibleContentStates[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_UserContentSettings = new PreloadedUserSettings_UserContentSettings$Type;

class PreloadedUserSettings_VideoFilterBackgroundBlur$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.VideoFilterBackgroundBlur", [
      { no: 1, name: "use_blur", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.useBlur = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.useBlur = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.useBlur !== false)
      writer.tag(1, WireType.Varint).bool(message.useBlur);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_VideoFilterBackgroundBlur = new PreloadedUserSettings_VideoFilterBackgroundBlur$Type;

class PreloadedUserSettings_VideoFilterAsset$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.VideoFilterAsset", [
      { no: 1, name: "id", kind: "scalar", T: 6, L: 0 },
      { no: 2, name: "asset_hash", kind: "scalar", T: 9 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.id = 0n;
    message.assetHash = "";
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.id = reader.fixed64().toBigInt();
          break;
        case 2:
          message.assetHash = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.id !== 0n)
      writer.tag(1, WireType.Bit64).fixed64(message.id);
    if (message.assetHash !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.assetHash);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_VideoFilterAsset = new PreloadedUserSettings_VideoFilterAsset$Type;

class PreloadedUserSettings_SoundboardSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.SoundboardSettings", [
      { no: 1, name: "volume", kind: "scalar", T: 2 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.volume = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.volume = reader.float();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.volume !== 0)
      writer.tag(1, WireType.Bit32).float(message.volume);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_SoundboardSettings = new PreloadedUserSettings_SoundboardSettings$Type;

class PreloadedUserSettings_VoiceAndVideoSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.VoiceAndVideoSettings", [
      { no: 1, name: "blur", kind: "message", oneof: "videoBackgroundFilterDesktop", T: () => PreloadedUserSettings_VideoFilterBackgroundBlur },
      { no: 2, name: "preset_option", kind: "scalar", oneof: "videoBackgroundFilterDesktop", T: 13 },
      { no: 3, name: "custom_asset", kind: "message", oneof: "videoBackgroundFilterDesktop", T: () => PreloadedUserSettings_VideoFilterAsset },
      { no: 5, name: "always_preview_video", kind: "message", T: () => BoolValue },
      { no: 6, name: "afk_timeout", kind: "message", T: () => UInt32Value },
      { no: 7, name: "stream_notifications_enabled", kind: "message", T: () => BoolValue },
      { no: 8, name: "native_phone_integration_enabled", kind: "message", T: () => BoolValue },
      { no: 9, name: "soundboard_settings", kind: "message", T: () => PreloadedUserSettings_SoundboardSettings },
      { no: 10, name: "disable_stream_previews", kind: "message", T: () => BoolValue },
      { no: 11, name: "soundmoji_volume", kind: "message", T: () => FloatValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.videoBackgroundFilterDesktop = { oneofKind: undefined };
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.videoBackgroundFilterDesktop = {
            oneofKind: "blur",
            blur: PreloadedUserSettings_VideoFilterBackgroundBlur.internalBinaryRead(reader, reader.uint32(), options, message.videoBackgroundFilterDesktop.blur)
          };
          break;
        case 2:
          message.videoBackgroundFilterDesktop = {
            oneofKind: "presetOption",
            presetOption: reader.uint32()
          };
          break;
        case 3:
          message.videoBackgroundFilterDesktop = {
            oneofKind: "customAsset",
            customAsset: PreloadedUserSettings_VideoFilterAsset.internalBinaryRead(reader, reader.uint32(), options, message.videoBackgroundFilterDesktop.customAsset)
          };
          break;
        case 5:
          message.alwaysPreviewVideo = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.alwaysPreviewVideo);
          break;
        case 6:
          message.afkTimeout = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.afkTimeout);
          break;
        case 7:
          message.streamNotificationsEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.streamNotificationsEnabled);
          break;
        case 8:
          message.nativePhoneIntegrationEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.nativePhoneIntegrationEnabled);
          break;
        case 9:
          message.soundboardSettings = PreloadedUserSettings_SoundboardSettings.internalBinaryRead(reader, reader.uint32(), options, message.soundboardSettings);
          break;
        case 10:
          message.disableStreamPreviews = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.disableStreamPreviews);
          break;
        case 11:
          message.soundmojiVolume = FloatValue.internalBinaryRead(reader, reader.uint32(), options, message.soundmojiVolume);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.videoBackgroundFilterDesktop.oneofKind === "blur")
      PreloadedUserSettings_VideoFilterBackgroundBlur.internalBinaryWrite(message.videoBackgroundFilterDesktop.blur, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.videoBackgroundFilterDesktop.oneofKind === "presetOption")
      writer.tag(2, WireType.Varint).uint32(message.videoBackgroundFilterDesktop.presetOption);
    if (message.videoBackgroundFilterDesktop.oneofKind === "customAsset")
      PreloadedUserSettings_VideoFilterAsset.internalBinaryWrite(message.videoBackgroundFilterDesktop.customAsset, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.alwaysPreviewVideo)
      BoolValue.internalBinaryWrite(message.alwaysPreviewVideo, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.afkTimeout)
      UInt32Value.internalBinaryWrite(message.afkTimeout, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.streamNotificationsEnabled)
      BoolValue.internalBinaryWrite(message.streamNotificationsEnabled, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.nativePhoneIntegrationEnabled)
      BoolValue.internalBinaryWrite(message.nativePhoneIntegrationEnabled, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.soundboardSettings)
      PreloadedUserSettings_SoundboardSettings.internalBinaryWrite(message.soundboardSettings, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
    if (message.disableStreamPreviews)
      BoolValue.internalBinaryWrite(message.disableStreamPreviews, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.soundmojiVolume)
      FloatValue.internalBinaryWrite(message.soundmojiVolume, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_VoiceAndVideoSettings = new PreloadedUserSettings_VoiceAndVideoSettings$Type;

class PreloadedUserSettings_ExplicitContentSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ExplicitContentSettings", [
      { no: 1, name: "explicit_content_guilds", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction, "EXPLICIT_CONTENT_REDACTION_"] },
      { no: 2, name: "explicit_content_friend_dm", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction, "EXPLICIT_CONTENT_REDACTION_"] },
      { no: 3, name: "explicit_content_non_friend_dm", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction, "EXPLICIT_CONTENT_REDACTION_"] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.explicitContentGuilds = 0;
    message.explicitContentFriendDm = 0;
    message.explicitContentNonFriendDm = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.explicitContentGuilds = reader.int32();
          break;
        case 2:
          message.explicitContentFriendDm = reader.int32();
          break;
        case 3:
          message.explicitContentNonFriendDm = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.explicitContentGuilds !== 0)
      writer.tag(1, WireType.Varint).int32(message.explicitContentGuilds);
    if (message.explicitContentFriendDm !== 0)
      writer.tag(2, WireType.Varint).int32(message.explicitContentFriendDm);
    if (message.explicitContentNonFriendDm !== 0)
      writer.tag(3, WireType.Varint).int32(message.explicitContentNonFriendDm);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ExplicitContentSettings = new PreloadedUserSettings_ExplicitContentSettings$Type;

class PreloadedUserSettings_KeywordFilterSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.KeywordFilterSettings", [
      { no: 1, name: "profanity", kind: "message", T: () => BoolValue },
      { no: 2, name: "sexual_content", kind: "message", T: () => BoolValue },
      { no: 3, name: "slurs", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.profanity = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.profanity);
          break;
        case 2:
          message.sexualContent = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.sexualContent);
          break;
        case 3:
          message.slurs = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.slurs);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.profanity)
      BoolValue.internalBinaryWrite(message.profanity, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.sexualContent)
      BoolValue.internalBinaryWrite(message.sexualContent, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.slurs)
      BoolValue.internalBinaryWrite(message.slurs, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_KeywordFilterSettings = new PreloadedUserSettings_KeywordFilterSettings$Type;

class PreloadedUserSettings_TextAndImagesSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.TextAndImagesSettings", [
      { no: 1, name: "diversity_surrogate", kind: "message", T: () => StringValue },
      { no: 2, name: "use_rich_chat_input", kind: "message", T: () => BoolValue },
      { no: 3, name: "use_thread_sidebar", kind: "message", T: () => BoolValue },
      { no: 4, name: "render_spoilers", kind: "message", T: () => StringValue },
      { no: 5, name: "emoji_picker_collapsed_sections", kind: "scalar", repeat: 2, T: 9 },
      { no: 6, name: "sticker_picker_collapsed_sections", kind: "scalar", repeat: 2, T: 9 },
      { no: 7, name: "view_image_descriptions", kind: "message", T: () => BoolValue },
      { no: 8, name: "show_command_suggestions", kind: "message", T: () => BoolValue },
      { no: 9, name: "inline_attachment_media", kind: "message", T: () => BoolValue },
      { no: 10, name: "inline_embed_media", kind: "message", T: () => BoolValue },
      { no: 11, name: "gif_auto_play", kind: "message", T: () => BoolValue },
      { no: 12, name: "render_embeds", kind: "message", T: () => BoolValue },
      { no: 13, name: "render_reactions", kind: "message", T: () => BoolValue },
      { no: 14, name: "animate_emoji", kind: "message", T: () => BoolValue },
      { no: 15, name: "animate_stickers", kind: "message", T: () => UInt32Value },
      { no: 16, name: "enable_tts_command", kind: "message", T: () => BoolValue },
      { no: 17, name: "message_display_compact", kind: "message", T: () => BoolValue },
      { no: 19, name: "explicit_content_filter", kind: "message", T: () => UInt32Value },
      { no: 20, name: "view_nsfw_guilds", kind: "message", T: () => BoolValue },
      { no: 21, name: "convert_emoticons", kind: "message", T: () => BoolValue },
      { no: 22, name: "expression_suggestions_enabled", kind: "message", T: () => BoolValue },
      { no: 23, name: "view_nsfw_commands", kind: "message", T: () => BoolValue },
      { no: 24, name: "use_legacy_chat_input", kind: "message", T: () => BoolValue },
      { no: 25, name: "soundboard_picker_collapsed_sections", kind: "scalar", repeat: 2, T: 9 },
      { no: 26, name: "dm_spam_filter", kind: "message", T: () => UInt32Value },
      { no: 27, name: "dm_spam_filter_v2", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.DmSpamFilterV2", PreloadedUserSettings_DmSpamFilterV2, "DM_SPAM_FILTER_V2_"] },
      { no: 28, name: "include_stickers_in_autocomplete", kind: "message", T: () => BoolValue },
      { no: 29, name: "explicit_content_settings", kind: "message", T: () => PreloadedUserSettings_ExplicitContentSettings },
      { no: 30, name: "keyword_filter_settings", kind: "message", T: () => PreloadedUserSettings_KeywordFilterSettings },
      { no: 31, name: "include_soundmoji_in_autocomplete", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.emojiPickerCollapsedSections = [];
    message.stickerPickerCollapsedSections = [];
    message.soundboardPickerCollapsedSections = [];
    message.dmSpamFilterV2 = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.diversitySurrogate = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.diversitySurrogate);
          break;
        case 2:
          message.useRichChatInput = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.useRichChatInput);
          break;
        case 3:
          message.useThreadSidebar = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.useThreadSidebar);
          break;
        case 4:
          message.renderSpoilers = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.renderSpoilers);
          break;
        case 5:
          message.emojiPickerCollapsedSections.push(reader.string());
          break;
        case 6:
          message.stickerPickerCollapsedSections.push(reader.string());
          break;
        case 7:
          message.viewImageDescriptions = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.viewImageDescriptions);
          break;
        case 8:
          message.showCommandSuggestions = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.showCommandSuggestions);
          break;
        case 9:
          message.inlineAttachmentMedia = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.inlineAttachmentMedia);
          break;
        case 10:
          message.inlineEmbedMedia = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.inlineEmbedMedia);
          break;
        case 11:
          message.gifAutoPlay = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.gifAutoPlay);
          break;
        case 12:
          message.renderEmbeds = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.renderEmbeds);
          break;
        case 13:
          message.renderReactions = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.renderReactions);
          break;
        case 14:
          message.animateEmoji = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.animateEmoji);
          break;
        case 15:
          message.animateStickers = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.animateStickers);
          break;
        case 16:
          message.enableTtsCommand = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.enableTtsCommand);
          break;
        case 17:
          message.messageDisplayCompact = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.messageDisplayCompact);
          break;
        case 19:
          message.explicitContentFilter = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.explicitContentFilter);
          break;
        case 20:
          message.viewNsfwGuilds = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.viewNsfwGuilds);
          break;
        case 21:
          message.convertEmoticons = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.convertEmoticons);
          break;
        case 22:
          message.expressionSuggestionsEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.expressionSuggestionsEnabled);
          break;
        case 23:
          message.viewNsfwCommands = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.viewNsfwCommands);
          break;
        case 24:
          message.useLegacyChatInput = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.useLegacyChatInput);
          break;
        case 25:
          message.soundboardPickerCollapsedSections.push(reader.string());
          break;
        case 26:
          message.dmSpamFilter = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.dmSpamFilter);
          break;
        case 27:
          message.dmSpamFilterV2 = reader.int32();
          break;
        case 28:
          message.includeStickersInAutocomplete = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.includeStickersInAutocomplete);
          break;
        case 29:
          message.explicitContentSettings = PreloadedUserSettings_ExplicitContentSettings.internalBinaryRead(reader, reader.uint32(), options, message.explicitContentSettings);
          break;
        case 30:
          message.keywordFilterSettings = PreloadedUserSettings_KeywordFilterSettings.internalBinaryRead(reader, reader.uint32(), options, message.keywordFilterSettings);
          break;
        case 31:
          message.includeSoundmojiInAutocomplete = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.includeSoundmojiInAutocomplete);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.diversitySurrogate)
      StringValue.internalBinaryWrite(message.diversitySurrogate, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.useRichChatInput)
      BoolValue.internalBinaryWrite(message.useRichChatInput, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.useThreadSidebar)
      BoolValue.internalBinaryWrite(message.useThreadSidebar, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.renderSpoilers)
      StringValue.internalBinaryWrite(message.renderSpoilers, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    for (let i = 0;i < message.emojiPickerCollapsedSections.length; i++)
      writer.tag(5, WireType.LengthDelimited).string(message.emojiPickerCollapsedSections[i]);
    for (let i = 0;i < message.stickerPickerCollapsedSections.length; i++)
      writer.tag(6, WireType.LengthDelimited).string(message.stickerPickerCollapsedSections[i]);
    if (message.viewImageDescriptions)
      BoolValue.internalBinaryWrite(message.viewImageDescriptions, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.showCommandSuggestions)
      BoolValue.internalBinaryWrite(message.showCommandSuggestions, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.inlineAttachmentMedia)
      BoolValue.internalBinaryWrite(message.inlineAttachmentMedia, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
    if (message.inlineEmbedMedia)
      BoolValue.internalBinaryWrite(message.inlineEmbedMedia, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.gifAutoPlay)
      BoolValue.internalBinaryWrite(message.gifAutoPlay, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
    if (message.renderEmbeds)
      BoolValue.internalBinaryWrite(message.renderEmbeds, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
    if (message.renderReactions)
      BoolValue.internalBinaryWrite(message.renderReactions, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
    if (message.animateEmoji)
      BoolValue.internalBinaryWrite(message.animateEmoji, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
    if (message.animateStickers)
      UInt32Value.internalBinaryWrite(message.animateStickers, writer.tag(15, WireType.LengthDelimited).fork(), options).join();
    if (message.enableTtsCommand)
      BoolValue.internalBinaryWrite(message.enableTtsCommand, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
    if (message.messageDisplayCompact)
      BoolValue.internalBinaryWrite(message.messageDisplayCompact, writer.tag(17, WireType.LengthDelimited).fork(), options).join();
    if (message.explicitContentFilter)
      UInt32Value.internalBinaryWrite(message.explicitContentFilter, writer.tag(19, WireType.LengthDelimited).fork(), options).join();
    if (message.viewNsfwGuilds)
      BoolValue.internalBinaryWrite(message.viewNsfwGuilds, writer.tag(20, WireType.LengthDelimited).fork(), options).join();
    if (message.convertEmoticons)
      BoolValue.internalBinaryWrite(message.convertEmoticons, writer.tag(21, WireType.LengthDelimited).fork(), options).join();
    if (message.expressionSuggestionsEnabled)
      BoolValue.internalBinaryWrite(message.expressionSuggestionsEnabled, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
    if (message.viewNsfwCommands)
      BoolValue.internalBinaryWrite(message.viewNsfwCommands, writer.tag(23, WireType.LengthDelimited).fork(), options).join();
    if (message.useLegacyChatInput)
      BoolValue.internalBinaryWrite(message.useLegacyChatInput, writer.tag(24, WireType.LengthDelimited).fork(), options).join();
    for (let i = 0;i < message.soundboardPickerCollapsedSections.length; i++)
      writer.tag(25, WireType.LengthDelimited).string(message.soundboardPickerCollapsedSections[i]);
    if (message.dmSpamFilter)
      UInt32Value.internalBinaryWrite(message.dmSpamFilter, writer.tag(26, WireType.LengthDelimited).fork(), options).join();
    if (message.dmSpamFilterV2 !== 0)
      writer.tag(27, WireType.Varint).int32(message.dmSpamFilterV2);
    if (message.includeStickersInAutocomplete)
      BoolValue.internalBinaryWrite(message.includeStickersInAutocomplete, writer.tag(28, WireType.LengthDelimited).fork(), options).join();
    if (message.explicitContentSettings)
      PreloadedUserSettings_ExplicitContentSettings.internalBinaryWrite(message.explicitContentSettings, writer.tag(29, WireType.LengthDelimited).fork(), options).join();
    if (message.keywordFilterSettings)
      PreloadedUserSettings_KeywordFilterSettings.internalBinaryWrite(message.keywordFilterSettings, writer.tag(30, WireType.LengthDelimited).fork(), options).join();
    if (message.includeSoundmojiInAutocomplete)
      BoolValue.internalBinaryWrite(message.includeSoundmojiInAutocomplete, writer.tag(31, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_TextAndImagesSettings = new PreloadedUserSettings_TextAndImagesSettings$Type;

class PreloadedUserSettings_NotificationSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.NotificationSettings", [
      { no: 1, name: "show_in_app_notifications", kind: "message", T: () => BoolValue },
      { no: 2, name: "notify_friends_on_go_live", kind: "message", T: () => BoolValue },
      { no: 3, name: "notification_center_acked_before_id", kind: "scalar", T: 6, L: 0 },
      { no: 4, name: "enable_burst_reaction_notifications", kind: "message", T: () => BoolValue },
      { no: 5, name: "quiet_mode", kind: "message", T: () => BoolValue },
      { no: 6, name: "focus_mode_expires_at_ms", kind: "scalar", T: 6, L: 0 },
      { no: 7, name: "reaction_notifications", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.ReactionNotificationType", PreloadedUserSettings_ReactionNotificationType, "REACTION_NOTIFICATION_TYPE_"] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.notificationCenterAckedBeforeId = 0n;
    message.focusModeExpiresAtMs = 0n;
    message.reactionNotifications = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.showInAppNotifications = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.showInAppNotifications);
          break;
        case 2:
          message.notifyFriendsOnGoLive = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.notifyFriendsOnGoLive);
          break;
        case 3:
          message.notificationCenterAckedBeforeId = reader.fixed64().toBigInt();
          break;
        case 4:
          message.enableBurstReactionNotifications = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.enableBurstReactionNotifications);
          break;
        case 5:
          message.quietMode = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.quietMode);
          break;
        case 6:
          message.focusModeExpiresAtMs = reader.fixed64().toBigInt();
          break;
        case 7:
          message.reactionNotifications = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.showInAppNotifications)
      BoolValue.internalBinaryWrite(message.showInAppNotifications, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.notifyFriendsOnGoLive)
      BoolValue.internalBinaryWrite(message.notifyFriendsOnGoLive, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.notificationCenterAckedBeforeId !== 0n)
      writer.tag(3, WireType.Bit64).fixed64(message.notificationCenterAckedBeforeId);
    if (message.enableBurstReactionNotifications)
      BoolValue.internalBinaryWrite(message.enableBurstReactionNotifications, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.quietMode)
      BoolValue.internalBinaryWrite(message.quietMode, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.focusModeExpiresAtMs !== 0n)
      writer.tag(6, WireType.Bit64).fixed64(message.focusModeExpiresAtMs);
    if (message.reactionNotifications !== 0)
      writer.tag(7, WireType.Varint).int32(message.reactionNotifications);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_NotificationSettings = new PreloadedUserSettings_NotificationSettings$Type;

class PreloadedUserSettings_PrivacySettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.PrivacySettings", [
      { no: 1, name: "allow_activity_party_privacy_friends", kind: "message", T: () => BoolValue },
      { no: 2, name: "allow_activity_party_privacy_voice_channel", kind: "message", T: () => BoolValue },
      { no: 3, name: "restricted_guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 4, name: "default_guilds_restricted", kind: "scalar", T: 8 },
      { no: 7, name: "allow_accessibility_detection", kind: "scalar", T: 8 },
      { no: 8, name: "detect_platform_accounts", kind: "message", T: () => BoolValue },
      { no: 9, name: "passwordless", kind: "message", T: () => BoolValue },
      { no: 10, name: "contact_sync_enabled", kind: "message", T: () => BoolValue },
      { no: 11, name: "friend_source_flags", kind: "message", T: () => UInt32Value },
      { no: 12, name: "friend_discovery_flags", kind: "message", T: () => UInt32Value },
      { no: 13, name: "activity_restricted_guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 14, name: "default_guilds_activity_restricted", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.GuildActivityStatusRestrictionDefault", PreloadedUserSettings_GuildActivityStatusRestrictionDefault, "GUILD_ACTIVITY_STATUS_RESTRICTION_DEFAULT_"] },
      { no: 15, name: "activity_joining_restricted_guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 16, name: "message_request_restricted_guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 17, name: "default_message_request_restricted", kind: "message", T: () => BoolValue },
      { no: 18, name: "drops_opted_out", kind: "message", T: () => BoolValue },
      { no: 19, name: "non_spam_retraining_opt_in", kind: "message", T: () => BoolValue },
      { no: 20, name: "family_center_enabled", kind: "message", T: () => BoolValue },
      { no: 21, name: "family_center_enabled_v2", kind: "message", T: () => BoolValue },
      { no: 22, name: "hide_legacy_username", kind: "message", T: () => BoolValue },
      { no: 23, name: "inappropriate_conversation_warnings", kind: "message", T: () => BoolValue },
      { no: 24, name: "recent_games_enabled", kind: "message", T: () => BoolValue },
      { no: 25, name: "guilds_leaderboard_opt_out_default", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.GuildsLeaderboardOptOutDefault", PreloadedUserSettings_GuildsLeaderboardOptOutDefault, "GUILDS_LEADERBOARD_OPT_OUT_DEFAULT_"] },
      { no: 26, name: "allow_game_friend_dms_in_discord", kind: "message", T: () => BoolValue },
      { no: 27, name: "default_guilds_restricted_v2", kind: "message", T: () => BoolValue },
      { no: 28, name: "slayer_sdk_receive_dms_in_game", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.SlayerSDKReceiveInGameDMs", PreloadedUserSettings_SlayerSDKReceiveInGameDMs] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.restrictedGuildIds = [];
    message.defaultGuildsRestricted = false;
    message.allowAccessibilityDetection = false;
    message.activityRestrictedGuildIds = [];
    message.defaultGuildsActivityRestricted = 0;
    message.activityJoiningRestrictedGuildIds = [];
    message.messageRequestRestrictedGuildIds = [];
    message.guildsLeaderboardOptOutDefault = 0;
    message.slayerSdkReceiveDmsInGame = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.allowActivityPartyPrivacyFriends = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.allowActivityPartyPrivacyFriends);
          break;
        case 2:
          message.allowActivityPartyPrivacyVoiceChannel = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.allowActivityPartyPrivacyVoiceChannel);
          break;
        case 3:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.restrictedGuildIds.push(reader.fixed64().toBigInt());
          else
            message.restrictedGuildIds.push(reader.fixed64().toBigInt());
          break;
        case 4:
          message.defaultGuildsRestricted = reader.bool();
          break;
        case 7:
          message.allowAccessibilityDetection = reader.bool();
          break;
        case 8:
          message.detectPlatformAccounts = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.detectPlatformAccounts);
          break;
        case 9:
          message.passwordless = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.passwordless);
          break;
        case 10:
          message.contactSyncEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.contactSyncEnabled);
          break;
        case 11:
          message.friendSourceFlags = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.friendSourceFlags);
          break;
        case 12:
          message.friendDiscoveryFlags = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.friendDiscoveryFlags);
          break;
        case 13:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.activityRestrictedGuildIds.push(reader.fixed64().toBigInt());
          else
            message.activityRestrictedGuildIds.push(reader.fixed64().toBigInt());
          break;
        case 14:
          message.defaultGuildsActivityRestricted = reader.int32();
          break;
        case 15:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.activityJoiningRestrictedGuildIds.push(reader.fixed64().toBigInt());
          else
            message.activityJoiningRestrictedGuildIds.push(reader.fixed64().toBigInt());
          break;
        case 16:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.messageRequestRestrictedGuildIds.push(reader.fixed64().toBigInt());
          else
            message.messageRequestRestrictedGuildIds.push(reader.fixed64().toBigInt());
          break;
        case 17:
          message.defaultMessageRequestRestricted = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.defaultMessageRequestRestricted);
          break;
        case 18:
          message.dropsOptedOut = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.dropsOptedOut);
          break;
        case 19:
          message.nonSpamRetrainingOptIn = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.nonSpamRetrainingOptIn);
          break;
        case 20:
          message.familyCenterEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.familyCenterEnabled);
          break;
        case 21:
          message.familyCenterEnabledV2 = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.familyCenterEnabledV2);
          break;
        case 22:
          message.hideLegacyUsername = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.hideLegacyUsername);
          break;
        case 23:
          message.inappropriateConversationWarnings = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.inappropriateConversationWarnings);
          break;
        case 24:
          message.recentGamesEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.recentGamesEnabled);
          break;
        case 25:
          message.guildsLeaderboardOptOutDefault = reader.int32();
          break;
        case 26:
          message.allowGameFriendDmsInDiscord = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.allowGameFriendDmsInDiscord);
          break;
        case 27:
          message.defaultGuildsRestrictedV2 = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.defaultGuildsRestrictedV2);
          break;
        case 28:
          message.slayerSdkReceiveDmsInGame = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.allowActivityPartyPrivacyFriends)
      BoolValue.internalBinaryWrite(message.allowActivityPartyPrivacyFriends, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.allowActivityPartyPrivacyVoiceChannel)
      BoolValue.internalBinaryWrite(message.allowActivityPartyPrivacyVoiceChannel, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.restrictedGuildIds.length) {
      writer.tag(3, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.restrictedGuildIds.length; i++)
        writer.fixed64(message.restrictedGuildIds[i]);
      writer.join();
    }
    if (message.defaultGuildsRestricted !== false)
      writer.tag(4, WireType.Varint).bool(message.defaultGuildsRestricted);
    if (message.allowAccessibilityDetection !== false)
      writer.tag(7, WireType.Varint).bool(message.allowAccessibilityDetection);
    if (message.detectPlatformAccounts)
      BoolValue.internalBinaryWrite(message.detectPlatformAccounts, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.passwordless)
      BoolValue.internalBinaryWrite(message.passwordless, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
    if (message.contactSyncEnabled)
      BoolValue.internalBinaryWrite(message.contactSyncEnabled, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.friendSourceFlags)
      UInt32Value.internalBinaryWrite(message.friendSourceFlags, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
    if (message.friendDiscoveryFlags)
      UInt32Value.internalBinaryWrite(message.friendDiscoveryFlags, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
    if (message.activityRestrictedGuildIds.length) {
      writer.tag(13, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.activityRestrictedGuildIds.length; i++)
        writer.fixed64(message.activityRestrictedGuildIds[i]);
      writer.join();
    }
    if (message.defaultGuildsActivityRestricted !== 0)
      writer.tag(14, WireType.Varint).int32(message.defaultGuildsActivityRestricted);
    if (message.activityJoiningRestrictedGuildIds.length) {
      writer.tag(15, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.activityJoiningRestrictedGuildIds.length; i++)
        writer.fixed64(message.activityJoiningRestrictedGuildIds[i]);
      writer.join();
    }
    if (message.messageRequestRestrictedGuildIds.length) {
      writer.tag(16, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.messageRequestRestrictedGuildIds.length; i++)
        writer.fixed64(message.messageRequestRestrictedGuildIds[i]);
      writer.join();
    }
    if (message.defaultMessageRequestRestricted)
      BoolValue.internalBinaryWrite(message.defaultMessageRequestRestricted, writer.tag(17, WireType.LengthDelimited).fork(), options).join();
    if (message.dropsOptedOut)
      BoolValue.internalBinaryWrite(message.dropsOptedOut, writer.tag(18, WireType.LengthDelimited).fork(), options).join();
    if (message.nonSpamRetrainingOptIn)
      BoolValue.internalBinaryWrite(message.nonSpamRetrainingOptIn, writer.tag(19, WireType.LengthDelimited).fork(), options).join();
    if (message.familyCenterEnabled)
      BoolValue.internalBinaryWrite(message.familyCenterEnabled, writer.tag(20, WireType.LengthDelimited).fork(), options).join();
    if (message.familyCenterEnabledV2)
      BoolValue.internalBinaryWrite(message.familyCenterEnabledV2, writer.tag(21, WireType.LengthDelimited).fork(), options).join();
    if (message.hideLegacyUsername)
      BoolValue.internalBinaryWrite(message.hideLegacyUsername, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
    if (message.inappropriateConversationWarnings)
      BoolValue.internalBinaryWrite(message.inappropriateConversationWarnings, writer.tag(23, WireType.LengthDelimited).fork(), options).join();
    if (message.recentGamesEnabled)
      BoolValue.internalBinaryWrite(message.recentGamesEnabled, writer.tag(24, WireType.LengthDelimited).fork(), options).join();
    if (message.guildsLeaderboardOptOutDefault !== 0)
      writer.tag(25, WireType.Varint).int32(message.guildsLeaderboardOptOutDefault);
    if (message.allowGameFriendDmsInDiscord)
      BoolValue.internalBinaryWrite(message.allowGameFriendDmsInDiscord, writer.tag(26, WireType.LengthDelimited).fork(), options).join();
    if (message.defaultGuildsRestrictedV2)
      BoolValue.internalBinaryWrite(message.defaultGuildsRestrictedV2, writer.tag(27, WireType.LengthDelimited).fork(), options).join();
    if (message.slayerSdkReceiveDmsInGame !== 0)
      writer.tag(28, WireType.Varint).int32(message.slayerSdkReceiveDmsInGame);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_PrivacySettings = new PreloadedUserSettings_PrivacySettings$Type;

class PreloadedUserSettings_DebugSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.DebugSettings", [
      { no: 1, name: "rtc_panel_show_voice_states", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.rtcPanelShowVoiceStates = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.rtcPanelShowVoiceStates);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.rtcPanelShowVoiceStates)
      BoolValue.internalBinaryWrite(message.rtcPanelShowVoiceStates, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_DebugSettings = new PreloadedUserSettings_DebugSettings$Type;

class PreloadedUserSettings_GameLibrarySettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.GameLibrarySettings", [
      { no: 1, name: "install_shortcut_desktop", kind: "message", T: () => BoolValue },
      { no: 2, name: "install_shortcut_start_menu", kind: "message", T: () => BoolValue },
      { no: 3, name: "disable_games_tab", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.installShortcutDesktop = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.installShortcutDesktop);
          break;
        case 2:
          message.installShortcutStartMenu = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.installShortcutStartMenu);
          break;
        case 3:
          message.disableGamesTab = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.disableGamesTab);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.installShortcutDesktop)
      BoolValue.internalBinaryWrite(message.installShortcutDesktop, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.installShortcutStartMenu)
      BoolValue.internalBinaryWrite(message.installShortcutStartMenu, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.disableGamesTab)
      BoolValue.internalBinaryWrite(message.disableGamesTab, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_GameLibrarySettings = new PreloadedUserSettings_GameLibrarySettings$Type;

class PreloadedUserSettings_CustomStatus$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.CustomStatus", [
      { no: 1, name: "text", kind: "scalar", T: 9 },
      { no: 2, name: "emoji_id", kind: "scalar", T: 6, L: 0 },
      { no: 3, name: "emoji_name", kind: "scalar", T: 9 },
      { no: 4, name: "expires_at_ms", kind: "scalar", T: 6, L: 0 },
      { no: 5, name: "created_at_ms", kind: "scalar", T: 6, L: 0 },
      { no: 6, name: "label", kind: "message", T: () => StringValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.text = "";
    message.emojiId = 0n;
    message.emojiName = "";
    message.expiresAtMs = 0n;
    message.createdAtMs = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.text = reader.string();
          break;
        case 2:
          message.emojiId = reader.fixed64().toBigInt();
          break;
        case 3:
          message.emojiName = reader.string();
          break;
        case 4:
          message.expiresAtMs = reader.fixed64().toBigInt();
          break;
        case 5:
          message.createdAtMs = reader.fixed64().toBigInt();
          break;
        case 6:
          message.label = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.label);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.text !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.text);
    if (message.emojiId !== 0n)
      writer.tag(2, WireType.Bit64).fixed64(message.emojiId);
    if (message.emojiName !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.emojiName);
    if (message.expiresAtMs !== 0n)
      writer.tag(4, WireType.Bit64).fixed64(message.expiresAtMs);
    if (message.createdAtMs !== 0n)
      writer.tag(5, WireType.Bit64).fixed64(message.createdAtMs);
    if (message.label)
      StringValue.internalBinaryWrite(message.label, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_CustomStatus = new PreloadedUserSettings_CustomStatus$Type;

class PreloadedUserSettings_StatusSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.StatusSettings", [
      { no: 1, name: "status", kind: "message", T: () => StringValue },
      { no: 2, name: "custom_status", kind: "message", T: () => PreloadedUserSettings_CustomStatus },
      { no: 3, name: "show_current_game", kind: "message", T: () => BoolValue },
      { no: 4, name: "status_expires_at_ms", kind: "scalar", T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.statusExpiresAtMs = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.status = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.status);
          break;
        case 2:
          message.customStatus = PreloadedUserSettings_CustomStatus.internalBinaryRead(reader, reader.uint32(), options, message.customStatus);
          break;
        case 3:
          message.showCurrentGame = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.showCurrentGame);
          break;
        case 4:
          message.statusExpiresAtMs = reader.fixed64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.status)
      StringValue.internalBinaryWrite(message.status, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.customStatus)
      PreloadedUserSettings_CustomStatus.internalBinaryWrite(message.customStatus, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.showCurrentGame)
      BoolValue.internalBinaryWrite(message.showCurrentGame, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.statusExpiresAtMs !== 0n)
      writer.tag(4, WireType.Bit64).fixed64(message.statusExpiresAtMs);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_StatusSettings = new PreloadedUserSettings_StatusSettings$Type;

class PreloadedUserSettings_LocalizationSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.LocalizationSettings", [
      { no: 1, name: "locale", kind: "message", T: () => StringValue },
      { no: 2, name: "timezone_offset", kind: "message", T: () => Int32Value }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.locale = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.locale);
          break;
        case 2:
          message.timezoneOffset = Int32Value.internalBinaryRead(reader, reader.uint32(), options, message.timezoneOffset);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.locale)
      StringValue.internalBinaryWrite(message.locale, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.timezoneOffset)
      Int32Value.internalBinaryWrite(message.timezoneOffset, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_LocalizationSettings = new PreloadedUserSettings_LocalizationSettings$Type;

class PreloadedUserSettings_ClientThemeSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ClientThemeSettings", [
      { no: 2, name: "background_gradient_preset_id", kind: "message", T: () => UInt32Value }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 2:
          message.backgroundGradientPresetId = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.backgroundGradientPresetId);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.backgroundGradientPresetId)
      UInt32Value.internalBinaryWrite(message.backgroundGradientPresetId, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ClientThemeSettings = new PreloadedUserSettings_ClientThemeSettings$Type;

class PreloadedUserSettings_AppearanceSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AppearanceSettings", [
      { no: 1, name: "theme", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.Theme", PreloadedUserSettings_Theme, "THEME_"] },
      { no: 2, name: "developer_mode", kind: "scalar", T: 8 },
      { no: 3, name: "client_theme_settings", kind: "message", T: () => PreloadedUserSettings_ClientThemeSettings },
      { no: 4, name: "mobile_redesign_disabled", kind: "scalar", T: 8 },
      { no: 6, name: "channel_list_layout", kind: "message", T: () => StringValue },
      { no: 7, name: "message_previews", kind: "message", T: () => StringValue },
      { no: 8, name: "search_result_exact_count_enabled", kind: "message", T: () => BoolValue },
      { no: 9, name: "timestamp_hour_cycle", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.TimestampHourCycle", PreloadedUserSettings_TimestampHourCycle, "TIMESTAMP_HOUR_CYCLE_"] },
      { no: 10, name: "happening_now_cards_disabled", kind: "message", T: () => BoolValue },
      { no: 11, name: "launch_pad_mode", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.LaunchPadMode", PreloadedUserSettings_LaunchPadMode, "LAUNCH_PAD_MODE_"] },
      { no: 12, name: "ui_density", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.UIDensity", PreloadedUserSettings_UIDensity] },
      { no: 13, name: "swipe_right_to_left_mode", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.SwipeRightToLeftMode", PreloadedUserSettings_SwipeRightToLeftMode, "SWIPE_RIGHT_TO_LEFT_MODE_"] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.theme = 0;
    message.developerMode = false;
    message.mobileRedesignDisabled = false;
    message.timestampHourCycle = 0;
    message.launchPadMode = 0;
    message.uiDensity = 0;
    message.swipeRightToLeftMode = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.theme = reader.int32();
          break;
        case 2:
          message.developerMode = reader.bool();
          break;
        case 3:
          message.clientThemeSettings = PreloadedUserSettings_ClientThemeSettings.internalBinaryRead(reader, reader.uint32(), options, message.clientThemeSettings);
          break;
        case 4:
          message.mobileRedesignDisabled = reader.bool();
          break;
        case 6:
          message.channelListLayout = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.channelListLayout);
          break;
        case 7:
          message.messagePreviews = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.messagePreviews);
          break;
        case 8:
          message.searchResultExactCountEnabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.searchResultExactCountEnabled);
          break;
        case 9:
          message.timestampHourCycle = reader.int32();
          break;
        case 10:
          message.happeningNowCardsDisabled = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.happeningNowCardsDisabled);
          break;
        case 11:
          message.launchPadMode = reader.int32();
          break;
        case 12:
          message.uiDensity = reader.int32();
          break;
        case 13:
          message.swipeRightToLeftMode = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.theme !== 0)
      writer.tag(1, WireType.Varint).int32(message.theme);
    if (message.developerMode !== false)
      writer.tag(2, WireType.Varint).bool(message.developerMode);
    if (message.clientThemeSettings)
      PreloadedUserSettings_ClientThemeSettings.internalBinaryWrite(message.clientThemeSettings, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.mobileRedesignDisabled !== false)
      writer.tag(4, WireType.Varint).bool(message.mobileRedesignDisabled);
    if (message.channelListLayout)
      StringValue.internalBinaryWrite(message.channelListLayout, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.messagePreviews)
      StringValue.internalBinaryWrite(message.messagePreviews, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.searchResultExactCountEnabled)
      BoolValue.internalBinaryWrite(message.searchResultExactCountEnabled, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.timestampHourCycle !== 0)
      writer.tag(9, WireType.Varint).int32(message.timestampHourCycle);
    if (message.happeningNowCardsDisabled)
      BoolValue.internalBinaryWrite(message.happeningNowCardsDisabled, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.launchPadMode !== 0)
      writer.tag(11, WireType.Varint).int32(message.launchPadMode);
    if (message.uiDensity !== 0)
      writer.tag(12, WireType.Varint).int32(message.uiDensity);
    if (message.swipeRightToLeftMode !== 0)
      writer.tag(13, WireType.Varint).int32(message.swipeRightToLeftMode);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AppearanceSettings = new PreloadedUserSettings_AppearanceSettings$Type;

class PreloadedUserSettings_GuildFolder$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.GuildFolder", [
      { no: 1, name: "guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 2, name: "id", kind: "message", T: () => Int64Value },
      { no: 3, name: "name", kind: "message", T: () => StringValue },
      { no: 4, name: "color", kind: "message", T: () => UInt64Value }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.guildIds = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.guildIds.push(reader.fixed64().toBigInt());
          else
            message.guildIds.push(reader.fixed64().toBigInt());
          break;
        case 2:
          message.id = Int64Value.internalBinaryRead(reader, reader.uint32(), options, message.id);
          break;
        case 3:
          message.name = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.name);
          break;
        case 4:
          message.color = UInt64Value.internalBinaryRead(reader, reader.uint32(), options, message.color);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.guildIds.length) {
      writer.tag(1, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.guildIds.length; i++)
        writer.fixed64(message.guildIds[i]);
      writer.join();
    }
    if (message.id)
      Int64Value.internalBinaryWrite(message.id, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.name)
      StringValue.internalBinaryWrite(message.name, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.color)
      UInt64Value.internalBinaryWrite(message.color, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_GuildFolder = new PreloadedUserSettings_GuildFolder$Type;

class PreloadedUserSettings_GuildFolders$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.GuildFolders", [
      { no: 1, name: "folders", kind: "message", repeat: 1, T: () => PreloadedUserSettings_GuildFolder },
      { no: 2, name: "guild_positions", kind: "scalar", repeat: 1, T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.folders = [];
    message.guildPositions = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.folders.push(PreloadedUserSettings_GuildFolder.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case 2:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.guildPositions.push(reader.fixed64().toBigInt());
          else
            message.guildPositions.push(reader.fixed64().toBigInt());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0;i < message.folders.length; i++)
      PreloadedUserSettings_GuildFolder.internalBinaryWrite(message.folders[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.guildPositions.length) {
      writer.tag(2, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.guildPositions.length; i++)
        writer.fixed64(message.guildPositions[i]);
      writer.join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_GuildFolders = new PreloadedUserSettings_GuildFolders$Type;

class PreloadedUserSettings_FavoriteChannel$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.FavoriteChannel", [
      { no: 1, name: "nickname", kind: "scalar", T: 9 },
      { no: 2, name: "type", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.FavoriteChannelType", PreloadedUserSettings_FavoriteChannelType, "FAVORITE_CHANNEL_TYPE_"] },
      { no: 3, name: "position", kind: "scalar", T: 13 },
      { no: 4, name: "parent_id", kind: "scalar", T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.nickname = "";
    message.type = 0;
    message.position = 0;
    message.parentId = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.nickname = reader.string();
          break;
        case 2:
          message.type = reader.int32();
          break;
        case 3:
          message.position = reader.uint32();
          break;
        case 4:
          message.parentId = reader.fixed64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.nickname !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.nickname);
    if (message.type !== 0)
      writer.tag(2, WireType.Varint).int32(message.type);
    if (message.position !== 0)
      writer.tag(3, WireType.Varint).uint32(message.position);
    if (message.parentId !== 0n)
      writer.tag(4, WireType.Bit64).fixed64(message.parentId);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_FavoriteChannel = new PreloadedUserSettings_FavoriteChannel$Type;

class PreloadedUserSettings_Favorites$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.Favorites", [
      { no: 1, name: "favorite_channels", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_FavoriteChannel } },
      { no: 2, name: "muted", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.favoriteChannels = {};
    message.muted = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.favoriteChannels, reader, options);
          break;
        case 2:
          message.muted = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_FavoriteChannel.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.Favorites.favorite_channels");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_FavoriteChannel.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.favoriteChannels)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_FavoriteChannel.internalBinaryWrite(message.favoriteChannels[k], writer, options);
      writer.join().join();
    }
    if (message.muted !== false)
      writer.tag(2, WireType.Varint).bool(message.muted);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_Favorites = new PreloadedUserSettings_Favorites$Type;

class PreloadedUserSettings_AudioContextSetting$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AudioContextSetting", [
      { no: 1, name: "muted", kind: "scalar", T: 8 },
      { no: 2, name: "volume", kind: "scalar", T: 2 },
      { no: 3, name: "modified_at", kind: "scalar", T: 6, L: 0 },
      { no: 4, name: "soundboard_muted", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.muted = false;
    message.volume = 0;
    message.modifiedAt = 0n;
    message.soundboardMuted = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.muted = reader.bool();
          break;
        case 2:
          message.volume = reader.float();
          break;
        case 3:
          message.modifiedAt = reader.fixed64().toBigInt();
          break;
        case 4:
          message.soundboardMuted = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.muted !== false)
      writer.tag(1, WireType.Varint).bool(message.muted);
    if (message.volume !== 0)
      writer.tag(2, WireType.Bit32).float(message.volume);
    if (message.modifiedAt !== 0n)
      writer.tag(3, WireType.Bit64).fixed64(message.modifiedAt);
    if (message.soundboardMuted !== false)
      writer.tag(4, WireType.Varint).bool(message.soundboardMuted);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AudioContextSetting = new PreloadedUserSettings_AudioContextSetting$Type;

class PreloadedUserSettings_AudioSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AudioSettings", [
      { no: 1, name: "user", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_AudioContextSetting } },
      { no: 2, name: "stream", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_AudioContextSetting } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.user = {};
    message.stream = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.user, reader, options);
          break;
        case 2:
          this.binaryReadMap2(message.stream, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_AudioContextSetting.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.AudioSettings.user");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_AudioContextSetting.create();
  }
  binaryReadMap2(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_AudioContextSetting.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.AudioSettings.stream");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_AudioContextSetting.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.user)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_AudioContextSetting.internalBinaryWrite(message.user[k], writer, options);
      writer.join().join();
    }
    for (let k of globalThis.Object.keys(message.stream)) {
      writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_AudioContextSetting.internalBinaryWrite(message.stream[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AudioSettings = new PreloadedUserSettings_AudioSettings$Type;

class PreloadedUserSettings_CommunitiesSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.CommunitiesSettings", [
      { no: 1, name: "disable_home_auto_nav", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.disableHomeAutoNav = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.disableHomeAutoNav);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.disableHomeAutoNav)
      BoolValue.internalBinaryWrite(message.disableHomeAutoNav, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_CommunitiesSettings = new PreloadedUserSettings_CommunitiesSettings$Type;

class PreloadedUserSettings_BroadcastSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.BroadcastSettings", [
      { no: 1, name: "allow_friends", kind: "message", T: () => BoolValue },
      { no: 2, name: "allowed_guild_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 3, name: "allowed_user_ids", kind: "scalar", repeat: 1, T: 6, L: 0 },
      { no: 4, name: "auto_broadcast", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.allowedGuildIds = [];
    message.allowedUserIds = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.allowFriends = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.allowFriends);
          break;
        case 2:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.allowedGuildIds.push(reader.fixed64().toBigInt());
          else
            message.allowedGuildIds.push(reader.fixed64().toBigInt());
          break;
        case 3:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.allowedUserIds.push(reader.fixed64().toBigInt());
          else
            message.allowedUserIds.push(reader.fixed64().toBigInt());
          break;
        case 4:
          message.autoBroadcast = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.autoBroadcast);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.allowFriends)
      BoolValue.internalBinaryWrite(message.allowFriends, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.allowedGuildIds.length) {
      writer.tag(2, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.allowedGuildIds.length; i++)
        writer.fixed64(message.allowedGuildIds[i]);
      writer.join();
    }
    if (message.allowedUserIds.length) {
      writer.tag(3, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.allowedUserIds.length; i++)
        writer.fixed64(message.allowedUserIds[i]);
      writer.join();
    }
    if (message.autoBroadcast)
      BoolValue.internalBinaryWrite(message.autoBroadcast, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_BroadcastSettings = new PreloadedUserSettings_BroadcastSettings$Type;

class PreloadedUserSettings_ClipsSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ClipsSettings", [
      { no: 1, name: "allow_voice_recording", kind: "message", T: () => BoolValue }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.allowVoiceRecording = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.allowVoiceRecording);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.allowVoiceRecording)
      BoolValue.internalBinaryWrite(message.allowVoiceRecording, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ClipsSettings = new PreloadedUserSettings_ClipsSettings$Type;

class PreloadedUserSettings_ForLaterSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ForLaterSettings", [
      { no: 1, name: "current_tab", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.ForLaterTab", PreloadedUserSettings_ForLaterTab, "FOR_LATER_TAB_"] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.currentTab = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.currentTab = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.currentTab !== 0)
      writer.tag(1, WireType.Varint).int32(message.currentTab);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ForLaterSettings = new PreloadedUserSettings_ForLaterSettings$Type;

class PreloadedUserSettings_SafetySettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.SafetySettings", [
      { no: 1, name: "safety_settings_preset", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.SafetySettingsPresetType", PreloadedUserSettings_SafetySettingsPresetType, "SAFETY_SETTINGS_PRESET_TYPE_"] },
      { no: 2, name: "ignore_profile_speedbump_disabled", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.safetySettingsPreset = 0;
    message.ignoreProfileSpeedbumpDisabled = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.safetySettingsPreset = reader.int32();
          break;
        case 2:
          message.ignoreProfileSpeedbumpDisabled = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.safetySettingsPreset !== 0)
      writer.tag(1, WireType.Varint).int32(message.safetySettingsPreset);
    if (message.ignoreProfileSpeedbumpDisabled !== false)
      writer.tag(2, WireType.Varint).bool(message.ignoreProfileSpeedbumpDisabled);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_SafetySettings = new PreloadedUserSettings_SafetySettings$Type;

class PreloadedUserSettings_ICYMISettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ICYMISettings", [
      { no: 1, name: "feed_generated_at", kind: "scalar", T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.feedGeneratedAt = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.feedGeneratedAt = reader.fixed64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.feedGeneratedAt !== 0n)
      writer.tag(1, WireType.Bit64).fixed64(message.feedGeneratedAt);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ICYMISettings = new PreloadedUserSettings_ICYMISettings$Type;

class PreloadedUserSettings_ApplicationDMSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ApplicationDMSettings", [
      { no: 1, name: "dm_disabled", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.dmDisabled = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.dmDisabled = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.dmDisabled !== false)
      writer.tag(1, WireType.Varint).bool(message.dmDisabled);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ApplicationDMSettings = new PreloadedUserSettings_ApplicationDMSettings$Type;

class PreloadedUserSettings_ApplicationSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.ApplicationSettings", [
      { no: 1, name: "app_dm_settings", kind: "message", T: () => PreloadedUserSettings_ApplicationDMSettings }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.appDmSettings = PreloadedUserSettings_ApplicationDMSettings.internalBinaryRead(reader, reader.uint32(), options, message.appDmSettings);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.appDmSettings)
      PreloadedUserSettings_ApplicationDMSettings.internalBinaryWrite(message.appDmSettings, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_ApplicationSettings = new PreloadedUserSettings_ApplicationSettings$Type;

class PreloadedUserSettings_AllApplicationSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AllApplicationSettings", [
      { no: 1, name: "app_settings", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_ApplicationSettings } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.appSettings = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.appSettings, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = PreloadedUserSettings_ApplicationSettings.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.PreloadedUserSettings.AllApplicationSettings.app_settings");
      }
    }
    map[key ?? "0"] = val ?? PreloadedUserSettings_ApplicationSettings.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.appSettings)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      PreloadedUserSettings_ApplicationSettings.internalBinaryWrite(message.appSettings[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AllApplicationSettings = new PreloadedUserSettings_AllApplicationSettings$Type;

class PreloadedUserSettings_AdsSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.PreloadedUserSettings.AdsSettings", [
      { no: 1, name: "always_deliver", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.alwaysDeliver = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.alwaysDeliver = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.alwaysDeliver !== false)
      writer.tag(1, WireType.Varint).bool(message.alwaysDeliver);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PreloadedUserSettings_AdsSettings = new PreloadedUserSettings_AdsSettings$Type;
// node_modules/discord-protos/src/discord_protos/discord_users/v1/FrecencyUserSettings.ts
var FrecencyUserSettings_GIFType;
((FrecencyUserSettings_GIFType2) => {
  FrecencyUserSettings_GIFType2[FrecencyUserSettings_GIFType2["GIF_TYPE_NONE"] = 0] = "GIF_TYPE_NONE";
  FrecencyUserSettings_GIFType2[FrecencyUserSettings_GIFType2["GIF_TYPE_IMAGE"] = 1] = "GIF_TYPE_IMAGE";
  FrecencyUserSettings_GIFType2[FrecencyUserSettings_GIFType2["GIF_TYPE_VIDEO"] = 2] = "GIF_TYPE_VIDEO";
})(FrecencyUserSettings_GIFType ||= {});

class FrecencyUserSettings$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings", [
      { no: 1, name: "versions", kind: "message", T: () => FrecencyUserSettings_Versions },
      { no: 2, name: "favorite_gifs", kind: "message", T: () => FrecencyUserSettings_FavoriteGIFs },
      { no: 3, name: "favorite_stickers", kind: "message", T: () => FrecencyUserSettings_FavoriteStickers },
      { no: 4, name: "sticker_frecency", kind: "message", T: () => FrecencyUserSettings_StickerFrecency },
      { no: 5, name: "favorite_emojis", kind: "message", T: () => FrecencyUserSettings_FavoriteEmojis },
      { no: 6, name: "emoji_frecency", kind: "message", T: () => FrecencyUserSettings_EmojiFrecency },
      { no: 7, name: "application_command_frecency", kind: "message", T: () => FrecencyUserSettings_ApplicationCommandFrecency },
      { no: 8, name: "favorite_soundboard_sounds", kind: "message", T: () => FrecencyUserSettings_FavoriteSoundboardSounds },
      { no: 9, name: "application_frecency", kind: "message", T: () => FrecencyUserSettings_ApplicationFrecency },
      { no: 10, name: "heard_sound_frecency", kind: "message", T: () => FrecencyUserSettings_HeardSoundFrecency },
      { no: 11, name: "played_sound_frecency", kind: "message", T: () => FrecencyUserSettings_PlayedSoundFrecency },
      { no: 12, name: "guild_and_channel_frecency", kind: "message", T: () => FrecencyUserSettings_GuildAndChannelFrecency },
      { no: 13, name: "emoji_reaction_frecency", kind: "message", T: () => FrecencyUserSettings_EmojiFrecency }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.versions = FrecencyUserSettings_Versions.internalBinaryRead(reader, reader.uint32(), options, message.versions);
          break;
        case 2:
          message.favoriteGifs = FrecencyUserSettings_FavoriteGIFs.internalBinaryRead(reader, reader.uint32(), options, message.favoriteGifs);
          break;
        case 3:
          message.favoriteStickers = FrecencyUserSettings_FavoriteStickers.internalBinaryRead(reader, reader.uint32(), options, message.favoriteStickers);
          break;
        case 4:
          message.stickerFrecency = FrecencyUserSettings_StickerFrecency.internalBinaryRead(reader, reader.uint32(), options, message.stickerFrecency);
          break;
        case 5:
          message.favoriteEmojis = FrecencyUserSettings_FavoriteEmojis.internalBinaryRead(reader, reader.uint32(), options, message.favoriteEmojis);
          break;
        case 6:
          message.emojiFrecency = FrecencyUserSettings_EmojiFrecency.internalBinaryRead(reader, reader.uint32(), options, message.emojiFrecency);
          break;
        case 7:
          message.applicationCommandFrecency = FrecencyUserSettings_ApplicationCommandFrecency.internalBinaryRead(reader, reader.uint32(), options, message.applicationCommandFrecency);
          break;
        case 8:
          message.favoriteSoundboardSounds = FrecencyUserSettings_FavoriteSoundboardSounds.internalBinaryRead(reader, reader.uint32(), options, message.favoriteSoundboardSounds);
          break;
        case 9:
          message.applicationFrecency = FrecencyUserSettings_ApplicationFrecency.internalBinaryRead(reader, reader.uint32(), options, message.applicationFrecency);
          break;
        case 10:
          message.heardSoundFrecency = FrecencyUserSettings_HeardSoundFrecency.internalBinaryRead(reader, reader.uint32(), options, message.heardSoundFrecency);
          break;
        case 11:
          message.playedSoundFrecency = FrecencyUserSettings_PlayedSoundFrecency.internalBinaryRead(reader, reader.uint32(), options, message.playedSoundFrecency);
          break;
        case 12:
          message.guildAndChannelFrecency = FrecencyUserSettings_GuildAndChannelFrecency.internalBinaryRead(reader, reader.uint32(), options, message.guildAndChannelFrecency);
          break;
        case 13:
          message.emojiReactionFrecency = FrecencyUserSettings_EmojiFrecency.internalBinaryRead(reader, reader.uint32(), options, message.emojiReactionFrecency);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.versions)
      FrecencyUserSettings_Versions.internalBinaryWrite(message.versions, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    if (message.favoriteGifs)
      FrecencyUserSettings_FavoriteGIFs.internalBinaryWrite(message.favoriteGifs, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    if (message.favoriteStickers)
      FrecencyUserSettings_FavoriteStickers.internalBinaryWrite(message.favoriteStickers, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
    if (message.stickerFrecency)
      FrecencyUserSettings_StickerFrecency.internalBinaryWrite(message.stickerFrecency, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
    if (message.favoriteEmojis)
      FrecencyUserSettings_FavoriteEmojis.internalBinaryWrite(message.favoriteEmojis, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.emojiFrecency)
      FrecencyUserSettings_EmojiFrecency.internalBinaryWrite(message.emojiFrecency, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.applicationCommandFrecency)
      FrecencyUserSettings_ApplicationCommandFrecency.internalBinaryWrite(message.applicationCommandFrecency, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
    if (message.favoriteSoundboardSounds)
      FrecencyUserSettings_FavoriteSoundboardSounds.internalBinaryWrite(message.favoriteSoundboardSounds, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
    if (message.applicationFrecency)
      FrecencyUserSettings_ApplicationFrecency.internalBinaryWrite(message.applicationFrecency, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
    if (message.heardSoundFrecency)
      FrecencyUserSettings_HeardSoundFrecency.internalBinaryWrite(message.heardSoundFrecency, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
    if (message.playedSoundFrecency)
      FrecencyUserSettings_PlayedSoundFrecency.internalBinaryWrite(message.playedSoundFrecency, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
    if (message.guildAndChannelFrecency)
      FrecencyUserSettings_GuildAndChannelFrecency.internalBinaryWrite(message.guildAndChannelFrecency, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
    if (message.emojiReactionFrecency)
      FrecencyUserSettings_EmojiFrecency.internalBinaryWrite(message.emojiReactionFrecency, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings = new FrecencyUserSettings$Type;

class FrecencyUserSettings_Versions$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.Versions", [
      { no: 1, name: "client_version", kind: "scalar", T: 13 },
      { no: 2, name: "server_version", kind: "scalar", T: 13 },
      { no: 3, name: "data_version", kind: "scalar", T: 13 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.clientVersion = 0;
    message.serverVersion = 0;
    message.dataVersion = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.clientVersion = reader.uint32();
          break;
        case 2:
          message.serverVersion = reader.uint32();
          break;
        case 3:
          message.dataVersion = reader.uint32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.clientVersion !== 0)
      writer.tag(1, WireType.Varint).uint32(message.clientVersion);
    if (message.serverVersion !== 0)
      writer.tag(2, WireType.Varint).uint32(message.serverVersion);
    if (message.dataVersion !== 0)
      writer.tag(3, WireType.Varint).uint32(message.dataVersion);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_Versions = new FrecencyUserSettings_Versions$Type;

class FrecencyUserSettings_FavoriteGIF$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteGIF", [
      { no: 1, name: "format", kind: "enum", T: () => ["discord_protos.discord_users.v1.FrecencyUserSettings.GIFType", FrecencyUserSettings_GIFType] },
      { no: 2, name: "src", kind: "scalar", T: 9 },
      { no: 3, name: "width", kind: "scalar", T: 13 },
      { no: 4, name: "height", kind: "scalar", T: 13 },
      { no: 5, name: "order", kind: "scalar", T: 13 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.format = 0;
    message.src = "";
    message.width = 0;
    message.height = 0;
    message.order = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.format = reader.int32();
          break;
        case 2:
          message.src = reader.string();
          break;
        case 3:
          message.width = reader.uint32();
          break;
        case 4:
          message.height = reader.uint32();
          break;
        case 5:
          message.order = reader.uint32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.format !== 0)
      writer.tag(1, WireType.Varint).int32(message.format);
    if (message.src !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.src);
    if (message.width !== 0)
      writer.tag(3, WireType.Varint).uint32(message.width);
    if (message.height !== 0)
      writer.tag(4, WireType.Varint).uint32(message.height);
    if (message.order !== 0)
      writer.tag(5, WireType.Varint).uint32(message.order);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FavoriteGIF = new FrecencyUserSettings_FavoriteGIF$Type;

class FrecencyUserSettings_FavoriteGIFs$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteGIFs", [
      { no: 1, name: "gifs", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FavoriteGIF } },
      { no: 2, name: "hide_tooltip", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.gifs = {};
    message.hideTooltip = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.gifs, reader, options);
          break;
        case 2:
          message.hideTooltip = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FavoriteGIF.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteGIFs.gifs");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FavoriteGIF.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.gifs)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FavoriteGIF.internalBinaryWrite(message.gifs[k], writer, options);
      writer.join().join();
    }
    if (message.hideTooltip !== false)
      writer.tag(2, WireType.Varint).bool(message.hideTooltip);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FavoriteGIFs = new FrecencyUserSettings_FavoriteGIFs$Type;

class FrecencyUserSettings_FavoriteStickers$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteStickers", [
      { no: 1, name: "sticker_ids", kind: "scalar", repeat: 1, T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.stickerIds = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.stickerIds.push(reader.fixed64().toBigInt());
          else
            message.stickerIds.push(reader.fixed64().toBigInt());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.stickerIds.length) {
      writer.tag(1, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.stickerIds.length; i++)
        writer.fixed64(message.stickerIds[i]);
      writer.join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FavoriteStickers = new FrecencyUserSettings_FavoriteStickers$Type;

class FrecencyUserSettings_FrecencyItem$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FrecencyItem", [
      { no: 1, name: "total_uses", kind: "scalar", T: 13 },
      { no: 2, name: "recent_uses", kind: "scalar", repeat: 1, T: 4, L: 0 },
      { no: 3, name: "frecency", kind: "scalar", T: 5 },
      { no: 4, name: "score", kind: "scalar", T: 5 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.totalUses = 0;
    message.recentUses = [];
    message.frecency = 0;
    message.score = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.totalUses = reader.uint32();
          break;
        case 2:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.recentUses.push(reader.uint64().toBigInt());
          else
            message.recentUses.push(reader.uint64().toBigInt());
          break;
        case 3:
          message.frecency = reader.int32();
          break;
        case 4:
          message.score = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.totalUses !== 0)
      writer.tag(1, WireType.Varint).uint32(message.totalUses);
    if (message.recentUses.length) {
      writer.tag(2, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.recentUses.length; i++)
        writer.uint64(message.recentUses[i]);
      writer.join();
    }
    if (message.frecency !== 0)
      writer.tag(3, WireType.Varint).int32(message.frecency);
    if (message.score !== 0)
      writer.tag(4, WireType.Varint).int32(message.score);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FrecencyItem = new FrecencyUserSettings_FrecencyItem$Type;

class FrecencyUserSettings_StickerFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.StickerFrecency", [
      { no: 1, name: "stickers", kind: "map", K: 6, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.stickers = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.stickers, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.StickerFrecency.stickers");
      }
    }
    map[key ?? "0"] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.stickers)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.stickers[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_StickerFrecency = new FrecencyUserSettings_StickerFrecency$Type;

class FrecencyUserSettings_FavoriteEmojis$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteEmojis", [
      { no: 1, name: "emojis", kind: "scalar", repeat: 2, T: 9 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.emojis = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.emojis.push(reader.string());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0;i < message.emojis.length; i++)
      writer.tag(1, WireType.LengthDelimited).string(message.emojis[i]);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FavoriteEmojis = new FrecencyUserSettings_FavoriteEmojis$Type;

class FrecencyUserSettings_EmojiFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.EmojiFrecency", [
      { no: 1, name: "emojis", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.emojis = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.emojis, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.EmojiFrecency.emojis");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.emojis)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.emojis[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_EmojiFrecency = new FrecencyUserSettings_EmojiFrecency$Type;

class FrecencyUserSettings_ApplicationCommandFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.ApplicationCommandFrecency", [
      { no: 1, name: "application_commands", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.applicationCommands = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.applicationCommands, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.ApplicationCommandFrecency.application_commands");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.applicationCommands)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.applicationCommands[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_ApplicationCommandFrecency = new FrecencyUserSettings_ApplicationCommandFrecency$Type;

class FrecencyUserSettings_FavoriteSoundboardSounds$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.FavoriteSoundboardSounds", [
      { no: 1, name: "sound_ids", kind: "scalar", repeat: 1, T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.soundIds = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          if (wireType === WireType.LengthDelimited)
            for (let e = reader.int32() + reader.pos;reader.pos < e; )
              message.soundIds.push(reader.fixed64().toBigInt());
          else
            message.soundIds.push(reader.fixed64().toBigInt());
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.soundIds.length) {
      writer.tag(1, WireType.LengthDelimited).fork();
      for (let i = 0;i < message.soundIds.length; i++)
        writer.fixed64(message.soundIds[i]);
      writer.join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_FavoriteSoundboardSounds = new FrecencyUserSettings_FavoriteSoundboardSounds$Type;

class FrecencyUserSettings_ApplicationFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.ApplicationFrecency", [
      { no: 1, name: "applications", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.applications = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.applications, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.ApplicationFrecency.applications");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.applications)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.applications[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_ApplicationFrecency = new FrecencyUserSettings_ApplicationFrecency$Type;

class FrecencyUserSettings_HeardSoundFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.HeardSoundFrecency", [
      { no: 1, name: "heard_sounds", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.heardSounds = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.heardSounds, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.HeardSoundFrecency.heard_sounds");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.heardSounds)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.heardSounds[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_HeardSoundFrecency = new FrecencyUserSettings_HeardSoundFrecency$Type;

class FrecencyUserSettings_PlayedSoundFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.PlayedSoundFrecency", [
      { no: 1, name: "played_sounds", kind: "map", K: 9, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.playedSounds = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.playedSounds, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.PlayedSoundFrecency.played_sounds");
      }
    }
    map[key ?? ""] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.playedSounds)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.playedSounds[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_PlayedSoundFrecency = new FrecencyUserSettings_PlayedSoundFrecency$Type;

class FrecencyUserSettings_GuildAndChannelFrecency$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_users.v1.FrecencyUserSettings.GuildAndChannelFrecency", [
      { no: 1, name: "guild_and_channels", kind: "map", K: 6, V: { kind: "message", T: () => FrecencyUserSettings_FrecencyItem } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.guildAndChannels = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.guildAndChannels, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.fixed64().toString();
          break;
        case 2:
          val = FrecencyUserSettings_FrecencyItem.internalBinaryRead(reader, reader.uint32(), options);
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_users.v1.FrecencyUserSettings.GuildAndChannelFrecency.guild_and_channels");
      }
    }
    map[key ?? "0"] = val ?? FrecencyUserSettings_FrecencyItem.create();
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.guildAndChannels)) {
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Bit64).fixed64(k);
      writer.tag(2, WireType.LengthDelimited).fork();
      FrecencyUserSettings_FrecencyItem.internalBinaryWrite(message.guildAndChannels[k], writer, options);
      writer.join().join();
    }
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var FrecencyUserSettings_GuildAndChannelFrecency = new FrecencyUserSettings_GuildAndChannelFrecency$Type;
// node_modules/discord-protos/src/discord_protos/discord_kkv_store_value_models/v1/ApplicationUserRoleConnection.ts
class ApplicationUserRoleConnection$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_kkv_store_value_models.v1.ApplicationUserRoleConnection", [
      { no: 1, name: "metadata", kind: "map", K: 9, V: { kind: "scalar", T: 9 } },
      { no: 2, name: "platform_name", kind: "scalar", T: 9 },
      { no: 3, name: "platform_username", kind: "scalar", T: 9 },
      { no: 4, name: "version", kind: "scalar", T: 6, L: 0 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.metadata = {};
    message.platformName = "";
    message.platformUsername = "";
    message.version = 0n;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.metadata, reader, options);
          break;
        case 2:
          message.platformName = reader.string();
          break;
        case 3:
          message.platformUsername = reader.string();
          break;
        case 4:
          message.version = reader.fixed64().toBigInt();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = reader.string();
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.discord_kkv_store_value_models.v1.ApplicationUserRoleConnection.metadata");
      }
    }
    map[key ?? ""] = val ?? "";
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.metadata))
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.metadata[k]).join();
    if (message.platformName !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.platformName);
    if (message.platformUsername !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.platformUsername);
    if (message.version !== 0n)
      writer.tag(4, WireType.Bit64).fixed64(message.version);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var ApplicationUserRoleConnection = new ApplicationUserRoleConnection$Type;
// node_modules/discord-protos/src/discord_protos/discord_kkv_store_value_models/v1/AcknowledgedApplicationDisclosures.ts
var AcknowledgedApplicationDisclosures_ApplicationDisclosureType;
((AcknowledgedApplicationDisclosures_ApplicationDisclosureType2) => {
  AcknowledgedApplicationDisclosures_ApplicationDisclosureType2[AcknowledgedApplicationDisclosures_ApplicationDisclosureType2["UNSPECIFIED_DISCLOSURE"] = 0] = "UNSPECIFIED_DISCLOSURE";
  AcknowledgedApplicationDisclosures_ApplicationDisclosureType2[AcknowledgedApplicationDisclosures_ApplicationDisclosureType2["IP_LOCATION"] = 1] = "IP_LOCATION";
  AcknowledgedApplicationDisclosures_ApplicationDisclosureType2[AcknowledgedApplicationDisclosures_ApplicationDisclosureType2["DISPLAYS_ADVERTISEMENTS"] = 2] = "DISPLAYS_ADVERTISEMENTS";
  AcknowledgedApplicationDisclosures_ApplicationDisclosureType2[AcknowledgedApplicationDisclosures_ApplicationDisclosureType2["PARTNER_SDK_DATA_SHARING_MESSAGE"] = 3] = "PARTNER_SDK_DATA_SHARING_MESSAGE";
})(AcknowledgedApplicationDisclosures_ApplicationDisclosureType ||= {});

class AcknowledgedApplicationDisclosures$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_kkv_store_value_models.v1.AcknowledgedApplicationDisclosures", [
      { no: 1, name: "acked_disclosures", kind: "message", repeat: 1, T: () => AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.ackedDisclosures = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.ackedDisclosures.push(AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure.internalBinaryRead(reader, reader.uint32(), options));
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    for (let i = 0;i < message.ackedDisclosures.length; i++)
      AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure.internalBinaryWrite(message.ackedDisclosures[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var AcknowledgedApplicationDisclosures = new AcknowledgedApplicationDisclosures$Type;

class AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure$Type extends MessageType {
  constructor() {
    super("discord_protos.discord_kkv_store_value_models.v1.AcknowledgedApplicationDisclosures.AcknowledgedApplicationDisclosure", [
      { no: 1, name: "disclosure_type", kind: "enum", T: () => ["discord_protos.discord_kkv_store_value_models.v1.AcknowledgedApplicationDisclosures.ApplicationDisclosureType", AcknowledgedApplicationDisclosures_ApplicationDisclosureType, "APPLICATION_DISCLOSURE_TYPE_"] },
      { no: 2, name: "acked_at", kind: "message", T: () => Timestamp }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.disclosureType = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.disclosureType = reader.int32();
          break;
        case 2:
          message.ackedAt = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.ackedAt);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.disclosureType !== 0)
      writer.tag(1, WireType.Varint).int32(message.disclosureType);
    if (message.ackedAt)
      Timestamp.internalBinaryWrite(message.ackedAt, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure = new AcknowledgedApplicationDisclosures_AcknowledgedApplicationDisclosure$Type;
// node_modules/discord-protos/src/discord_protos/premium_marketing/v1/PremiumMarketingComponentProperties.ts
var PremiumMarketingComponentProperties_ButtonAction;
((PremiumMarketingComponentProperties_ButtonAction2) => {
  PremiumMarketingComponentProperties_ButtonAction2[PremiumMarketingComponentProperties_ButtonAction2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  PremiumMarketingComponentProperties_ButtonAction2[PremiumMarketingComponentProperties_ButtonAction2["OPEN_MARKETING_PAGE"] = 1] = "OPEN_MARKETING_PAGE";
  PremiumMarketingComponentProperties_ButtonAction2[PremiumMarketingComponentProperties_ButtonAction2["OPEN_TIER_2_PAYMENT_MODAL"] = 2] = "OPEN_TIER_2_PAYMENT_MODAL";
  PremiumMarketingComponentProperties_ButtonAction2[PremiumMarketingComponentProperties_ButtonAction2["OPEN_TIER_1_PAYMENT_MODAL"] = 3] = "OPEN_TIER_1_PAYMENT_MODAL";
  PremiumMarketingComponentProperties_ButtonAction2[PremiumMarketingComponentProperties_ButtonAction2["OPEN_TIER_2_PAYMENT_MODAL_CUSTOM_CONFIRMATION_FOOTER"] = 4] = "OPEN_TIER_2_PAYMENT_MODAL_CUSTOM_CONFIRMATION_FOOTER";
})(PremiumMarketingComponentProperties_ButtonAction ||= {});

class PremiumMarketingComponentProperties$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties", [
      { no: 3, name: "content_identifier", kind: "scalar", T: 9 },
      { no: 1, name: "placeholder", kind: "scalar", oneof: "properties", T: 9 },
      { no: 2, name: "announcement_modal_variant_1", kind: "message", oneof: "properties", T: () => PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.contentIdentifier = "";
    message.properties = { oneofKind: undefined };
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 3:
          message.contentIdentifier = reader.string();
          break;
        case 1:
          message.properties = {
            oneofKind: "placeholder",
            placeholder: reader.string()
          };
          break;
        case 2:
          message.properties = {
            oneofKind: "announcementModalVariant1",
            announcementModalVariant1: PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties.internalBinaryRead(reader, reader.uint32(), options, message.properties.announcementModalVariant1)
          };
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.contentIdentifier !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.contentIdentifier);
    if (message.properties.oneofKind === "placeholder")
      writer.tag(1, WireType.LengthDelimited).string(message.properties.placeholder);
    if (message.properties.oneofKind === "announcementModalVariant1")
      PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties.internalBinaryWrite(message.properties.announcementModalVariant1, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties = new PremiumMarketingComponentProperties$Type;

class PremiumMarketingComponentProperties_FeatureCard$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.FeatureCard", [
      { no: 1, name: "header", kind: "scalar", T: 9 },
      { no: 2, name: "pill", kind: "scalar", T: 9 },
      { no: 3, name: "body", kind: "scalar", T: 9 },
      { no: 4, name: "image_link", kind: "scalar", T: 9 },
      { no: 5, name: "image_link_light_theme", kind: "scalar", T: 9 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.header = "";
    message.pill = "";
    message.body = "";
    message.imageLink = "";
    message.imageLinkLightTheme = "";
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.header = reader.string();
          break;
        case 2:
          message.pill = reader.string();
          break;
        case 3:
          message.body = reader.string();
          break;
        case 4:
          message.imageLink = reader.string();
          break;
        case 5:
          message.imageLinkLightTheme = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.header !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.header);
    if (message.pill !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.pill);
    if (message.body !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.body);
    if (message.imageLink !== "")
      writer.tag(4, WireType.LengthDelimited).string(message.imageLink);
    if (message.imageLinkLightTheme !== "")
      writer.tag(5, WireType.LengthDelimited).string(message.imageLinkLightTheme);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties_FeatureCard = new PremiumMarketingComponentProperties_FeatureCard$Type;

class PremiumMarketingComponentProperties_SubscriptionButton$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.SubscriptionButton", [
      { no: 1, name: "copy", kind: "scalar", T: 9 },
      { no: 2, name: "button_action", kind: "enum", T: () => ["discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.ButtonAction", PremiumMarketingComponentProperties_ButtonAction, "BUTTON_ACTION_"] }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.copy = "";
    message.buttonAction = 0;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.copy = reader.string();
          break;
        case 2:
          message.buttonAction = reader.int32();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.copy !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.copy);
    if (message.buttonAction !== 0)
      writer.tag(2, WireType.Varint).int32(message.buttonAction);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties_SubscriptionButton = new PremiumMarketingComponentProperties_SubscriptionButton$Type;

class PremiumMarketingComponentProperties_Subtitle$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.Subtitle", [
      { no: 1, name: "link", kind: "scalar", T: 9 },
      { no: 2, name: "locale", kind: "scalar", T: 9 },
      { no: 3, name: "is_default", kind: "scalar", T: 8 }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.link = "";
    message.locale = "";
    message.isDefault = false;
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.link = reader.string();
          break;
        case 2:
          message.locale = reader.string();
          break;
        case 3:
          message.isDefault = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.link !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.link);
    if (message.locale !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.locale);
    if (message.isDefault !== false)
      writer.tag(3, WireType.Varint).bool(message.isDefault);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties_Subtitle = new PremiumMarketingComponentProperties_Subtitle$Type;

class PremiumMarketingComponentProperties_Variant1Storage$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.Variant1Storage", [
      { no: 1, name: "hero_art_localized_video_links_dark_theme", kind: "map", K: 9, V: { kind: "scalar", T: 9 } },
      { no: 2, name: "hero_art_localized_video_links_light_theme", kind: "map", K: 9, V: { kind: "scalar", T: 9 } },
      { no: 3, name: "hero_art_video_subtitle_links", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.heroArtLocalizedVideoLinksDarkTheme = {};
    message.heroArtLocalizedVideoLinksLightTheme = {};
    message.heroArtVideoSubtitleLinks = {};
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          this.binaryReadMap1(message.heroArtLocalizedVideoLinksDarkTheme, reader, options);
          break;
        case 2:
          this.binaryReadMap2(message.heroArtLocalizedVideoLinksLightTheme, reader, options);
          break;
        case 3:
          this.binaryReadMap3(message.heroArtVideoSubtitleLinks, reader, options);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  binaryReadMap1(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = reader.string();
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.Variant1Storage.hero_art_localized_video_links_dark_theme");
      }
    }
    map[key ?? ""] = val ?? "";
  }
  binaryReadMap2(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = reader.string();
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.Variant1Storage.hero_art_localized_video_links_light_theme");
      }
    }
    map[key ?? ""] = val ?? "";
  }
  binaryReadMap3(map, reader, options) {
    let len = reader.uint32(), end = reader.pos + len, key, val;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = reader.string();
          break;
        case 2:
          val = reader.string();
          break;
        default:
          throw new globalThis.Error("unknown map entry field for field discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.Variant1Storage.hero_art_video_subtitle_links");
      }
    }
    map[key ?? ""] = val ?? "";
  }
  internalBinaryWrite(message, writer, options) {
    for (let k of globalThis.Object.keys(message.heroArtLocalizedVideoLinksDarkTheme))
      writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.heroArtLocalizedVideoLinksDarkTheme[k]).join();
    for (let k of globalThis.Object.keys(message.heroArtLocalizedVideoLinksLightTheme))
      writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.heroArtLocalizedVideoLinksLightTheme[k]).join();
    for (let k of globalThis.Object.keys(message.heroArtVideoSubtitleLinks))
      writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.heroArtVideoSubtitleLinks[k]).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties_Variant1Storage = new PremiumMarketingComponentProperties_Variant1Storage$Type;

class PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties$Type extends MessageType {
  constructor() {
    super("discord_protos.premium_marketing.v1.PremiumMarketingComponentProperties.AnnouncementModalVariant1Properties", [
      { no: 1, name: "header", kind: "scalar", T: 9 },
      { no: 2, name: "subheader", kind: "scalar", T: 9 },
      { no: 3, name: "video_link", kind: "scalar", T: 9 },
      { no: 4, name: "help_article_id", kind: "scalar", T: 9 },
      { no: 5, name: "feature_cards", kind: "message", repeat: 1, T: () => PremiumMarketingComponentProperties_FeatureCard },
      { no: 6, name: "button", kind: "message", T: () => PremiumMarketingComponentProperties_SubscriptionButton },
      { no: 7, name: "dismiss_key", kind: "scalar", T: 9 },
      { no: 8, name: "hero_art_video_link_light_theme", kind: "scalar", T: 9 },
      { no: 9, name: "hero_art_image_link_dark_theme", kind: "scalar", T: 9 },
      { no: 10, name: "hero_art_image_link_light_theme", kind: "scalar", T: 9 },
      { no: 11, name: "modal_top_pill", kind: "scalar", T: 9 },
      { no: 12, name: "body", kind: "scalar", T: 9 },
      { no: 13, name: "hero_art_video_subtitles", kind: "message", repeat: 1, T: () => PremiumMarketingComponentProperties_Subtitle },
      { no: 14, name: "storage", kind: "message", T: () => PremiumMarketingComponentProperties_Variant1Storage }
    ]);
  }
  create(value) {
    const message = globalThis.Object.create(this.messagePrototype);
    message.header = "";
    message.subheader = "";
    message.videoLink = "";
    message.helpArticleId = "";
    message.featureCards = [];
    message.dismissKey = "";
    message.heroArtVideoLinkLightTheme = "";
    message.heroArtImageLinkDarkTheme = "";
    message.heroArtImageLinkLightTheme = "";
    message.modalTopPill = "";
    message.body = "";
    message.heroArtVideoSubtitles = [];
    if (value !== undefined)
      reflectionMergePartial(this, message, value);
    return message;
  }
  internalBinaryRead(reader, length, options, target) {
    let message = target ?? this.create(), end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case 1:
          message.header = reader.string();
          break;
        case 2:
          message.subheader = reader.string();
          break;
        case 3:
          message.videoLink = reader.string();
          break;
        case 4:
          message.helpArticleId = reader.string();
          break;
        case 5:
          message.featureCards.push(PremiumMarketingComponentProperties_FeatureCard.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case 6:
          message.button = PremiumMarketingComponentProperties_SubscriptionButton.internalBinaryRead(reader, reader.uint32(), options, message.button);
          break;
        case 7:
          message.dismissKey = reader.string();
          break;
        case 8:
          message.heroArtVideoLinkLightTheme = reader.string();
          break;
        case 9:
          message.heroArtImageLinkDarkTheme = reader.string();
          break;
        case 10:
          message.heroArtImageLinkLightTheme = reader.string();
          break;
        case 11:
          message.modalTopPill = reader.string();
          break;
        case 12:
          message.body = reader.string();
          break;
        case 13:
          message.heroArtVideoSubtitles.push(PremiumMarketingComponentProperties_Subtitle.internalBinaryRead(reader, reader.uint32(), options));
          break;
        case 14:
          message.storage = PremiumMarketingComponentProperties_Variant1Storage.internalBinaryRead(reader, reader.uint32(), options, message.storage);
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
      }
    }
    return message;
  }
  internalBinaryWrite(message, writer, options) {
    if (message.header !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.header);
    if (message.subheader !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.subheader);
    if (message.videoLink !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.videoLink);
    if (message.helpArticleId !== "")
      writer.tag(4, WireType.LengthDelimited).string(message.helpArticleId);
    for (let i = 0;i < message.featureCards.length; i++)
      PremiumMarketingComponentProperties_FeatureCard.internalBinaryWrite(message.featureCards[i], writer.tag(5, WireType.LengthDelimited).fork(), options).join();
    if (message.button)
      PremiumMarketingComponentProperties_SubscriptionButton.internalBinaryWrite(message.button, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
    if (message.dismissKey !== "")
      writer.tag(7, WireType.LengthDelimited).string(message.dismissKey);
    if (message.heroArtVideoLinkLightTheme !== "")
      writer.tag(8, WireType.LengthDelimited).string(message.heroArtVideoLinkLightTheme);
    if (message.heroArtImageLinkDarkTheme !== "")
      writer.tag(9, WireType.LengthDelimited).string(message.heroArtImageLinkDarkTheme);
    if (message.heroArtImageLinkLightTheme !== "")
      writer.tag(10, WireType.LengthDelimited).string(message.heroArtImageLinkLightTheme);
    if (message.modalTopPill !== "")
      writer.tag(11, WireType.LengthDelimited).string(message.modalTopPill);
    if (message.body !== "")
      writer.tag(12, WireType.LengthDelimited).string(message.body);
    for (let i = 0;i < message.heroArtVideoSubtitles.length; i++)
      PremiumMarketingComponentProperties_Subtitle.internalBinaryWrite(message.heroArtVideoSubtitles[i], writer.tag(13, WireType.LengthDelimited).fork(), options).join();
    if (message.storage)
      PremiumMarketingComponentProperties_Variant1Storage.internalBinaryWrite(message.storage, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
    return writer;
  }
}
var PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties = new PremiumMarketingComponentProperties_AnnouncementModalVariant1Properties$Type;

// node_modules/discord-protos/src/index.ts
var compatBuffer = {
  from: function(input, encoding) {
    if (typeof input === "string" && encoding === "base64") {
      const encodedBytes = atob(input);
      const bytes = new Uint8Array(encodedBytes.length);
      for (let i = 0;i < encodedBytes.length; i++) {
        bytes[i] = encodedBytes.charCodeAt(i);
      }
      return bytes;
    } else if (!encoding && input instanceof Uint8Array) {
      return input;
    }
    throw new Error("Invalid input type.");
  },
  toBase64String: function(buffer) {
    let encodedBytes = "";
    for (let i = 0;i < buffer.length; i++) {
      encodedBytes += String.fromCharCode(buffer[i]);
    }
    return btoa(encodedBytes);
  }
};
function toBase64(data) {
  return compatBuffer.toBase64String(compatBuffer.from(this.toBinary(data)));
}
function fromBase64(base64) {
  return this.fromBinary(compatBuffer.from(base64, "base64"));
}
MessageType.prototype.fromBase64 = fromBase64;
MessageType.prototype.toBase64 = toBase64;

// index.js
GM_addStyle(`
  #status-selector {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 9999;
  }
  #status-selector button {
    background: none;
    border: 1px solid white;
    color: white;
    padding: 8px;
    cursor: pointer;
  }
  #status-selector button.online {
    background-color: #43a25a;
  }
  #status-selector button.idle {
    background-color: #ca9654;
  }
  #status-selector button.dnd {
    background-color: #d83a42;
  }
  #status-selector button.invisible {
    background-color: #83838b;
  }
`);
(async () => {

  class StatusMenu {
    constructor(discordToken) {
      this.discordToken = discordToken;
      this.statusSelector = null;
      this.buttons = {};
    }
    async init() {
      this.statusSelector = document.createElement("div");
      this.statusSelector.id = "status-selector";
      document.body.appendChild(this.statusSelector);
      const currentStatus = (await this.fetchCurrentUserSettings()).status.status.value;
      ["online", "idle", "dnd", "invisible"].forEach((status) => {
        const button = document.createElement("button");
        button.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        button.classList.toggle(status, status === currentStatus);
        button.onclick = async () => {
          const newUserSettings = await this.fetchCurrentUserSettings();
          newUserSettings.status.status.value = status;
          await this.setUserSettings(newUserSettings);
          await this.refreshStatus(status);
        };
        this.statusSelector.appendChild(button);
        this.buttons[status] = button;
      });
    }
    async refreshStatus(currentStatus = null) {
      if (!currentStatus) {
        currentStatus = (await this.fetchCurrentUserSettings()).status.status.value;
      }
      for (const [status, button] of Object.entries(this.buttons)) {
        button.classList.toggle(status, status === currentStatus);
      }
    }
    async fetchCurrentUserSettings() {
      const response = await fetch("https://discord.com/api/v9/users/@me/settings-proto/1", {
        headers: {
          Authorization: this.discordToken
        }
      });
      const data = await response.json();
      const decoded = PreloadedUserSettings.fromBase64(data.settings);
      return decoded;
    }
    async setUserSettings(userSettings) {
      const encoded = PreloadedUserSettings.toBase64(userSettings);
      await fetch("https://discord.com/api/v9/users/@me/settings-proto/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.discordToken
        },
        body: JSON.stringify({ settings: encoded })
      });
    }
  }
  const token = JSON.parse(window.localStorage.getItem("token"));
  if (!token) {
    console.warn("You need to be signed in to Discord to change your status.");
    return;
  }
  await new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve);
    }
  });
  const menu = new StatusMenu(token);
  await menu.init();
})();
