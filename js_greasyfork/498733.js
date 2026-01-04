// ==UserScript==
// @name         spgogogo
// @namespace    https://adryd.com
// @version      1.74
// @description  meow meow emwo
// @author       adryd
// @include      http://play.pixels.xyz/*
// @include      https://play.pixels.xyz/*
// @grant        GM_addElement
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498733/spgogogo.user.js
// @updateURL https://update.greasyfork.org/scripts/498733/spgogogo.meta.js
// ==/UserScript==

(() => {

  const R = {};

  function Decoder(m, R) {
      if (this._offset = R,
      m instanceof ArrayBuffer)
          this._buffer = m,
          this._view = new DataView(this._buffer);
      else if (ArrayBuffer.isView(m))
          this._buffer = m.buffer,
          this._view = new DataView(this._buffer,m.byteOffset,m.byteLength);
      else
          throw Error("Invalid argument")
  }
  Object.defineProperty(R, "__esModule", {
      value: !0
  }),
  R.decode = R.encode = void 0,
  Decoder.prototype._array = function(m) {
      for (var R = Array(m), C = 0; C < m; C++)
          R[C] = this._parse();
      return R
  }
  ,
  Decoder.prototype._map = function(m) {
      for (var R = {}, C = 0; C < m; C++)
          R[this._parse()] = this._parse();
      return R
  }
  ,
  Decoder.prototype._str = function(m) {
      var R = function(m, R, C) {
          for (var T = "", L = 0, U = R, $ = R + C; U < $; U++) {
              var B = m.getUint8(U);
              if ((128 & B) == 0) {
                  T += String.fromCharCode(B);
                  continue
              }
              if ((224 & B) == 192) {
                  T += String.fromCharCode((31 & B) << 6 | 63 & m.getUint8(++U));
                  continue
              }
              if ((240 & B) == 224) {
                  T += String.fromCharCode((15 & B) << 12 | (63 & m.getUint8(++U)) << 6 | (63 & m.getUint8(++U)) << 0);
                  continue
              }
              if ((248 & B) == 240) {
                  (L = (7 & B) << 18 | (63 & m.getUint8(++U)) << 12 | (63 & m.getUint8(++U)) << 6 | (63 & m.getUint8(++U)) << 0) >= 65536 ? (L -= 65536,
                  T += String.fromCharCode((L >>> 10) + 55296, (1023 & L) + 56320)) : T += String.fromCharCode(L);
                  continue
              }
              throw Error("Invalid byte " + B.toString(16))
          }
          return T
      }(this._view, this._offset, m);
      return this._offset += m,
      R
  }
  ,
  Decoder.prototype._bin = function(m) {
      var R = this._buffer.slice(this._offset, this._offset + m);
      return this._offset += m,
      R
  }
  ,
  Decoder.prototype._parse = function() {
      var m, R = this._view.getUint8(this._offset++), C = 0, T = 0, L = 0, U = 0;
      if (R < 192)
          return R < 128 ? R : R < 144 ? this._map(15 & R) : R < 160 ? this._array(15 & R) : this._str(31 & R);
      if (R > 223)
          return -((255 - R + 1) * 1);
      switch (R) {
      case 192:
          return null;
      case 194:
          return !1;
      case 195:
          return !0;
      case 196:
          return C = this._view.getUint8(this._offset),
          this._offset += 1,
          this._bin(C);
      case 197:
          return C = this._view.getUint16(this._offset),
          this._offset += 2,
          this._bin(C);
      case 198:
          return C = this._view.getUint32(this._offset),
          this._offset += 4,
          this._bin(C);
      case 199:
          if (C = this._view.getUint8(this._offset),
          T = this._view.getInt8(this._offset + 1),
          this._offset += 2,
          -1 === T) {
              var $ = this._view.getUint32(this._offset);
              return L = this._view.getInt32(this._offset + 4),
              U = this._view.getUint32(this._offset + 8),
              this._offset += 12,
              new Date((4294967296 * L + U) * 1e3 + $ / 1e6)
          }
          return [T, this._bin(C)];
      case 200:
          return C = this._view.getUint16(this._offset),
          T = this._view.getInt8(this._offset + 2),
          this._offset += 3,
          [T, this._bin(C)];
      case 201:
          return C = this._view.getUint32(this._offset),
          T = this._view.getInt8(this._offset + 4),
          this._offset += 5,
          [T, this._bin(C)];
      case 202:
          return m = this._view.getFloat32(this._offset),
          this._offset += 4,
          m;
      case 203:
          return m = this._view.getFloat64(this._offset),
          this._offset += 8,
          m;
      case 204:
          return m = this._view.getUint8(this._offset),
          this._offset += 1,
          m;
      case 205:
          return m = this._view.getUint16(this._offset),
          this._offset += 2,
          m;
      case 206:
          return m = this._view.getUint32(this._offset),
          this._offset += 4,
          m;
      case 207:
          return L = 4294967296 * this._view.getUint32(this._offset),
          U = this._view.getUint32(this._offset + 4),
          this._offset += 8,
          L + U;
      case 208:
          return m = this._view.getInt8(this._offset),
          this._offset += 1,
          m;
      case 209:
          return m = this._view.getInt16(this._offset),
          this._offset += 2,
          m;
      case 210:
          return m = this._view.getInt32(this._offset),
          this._offset += 4,
          m;
      case 211:
          return L = 4294967296 * this._view.getInt32(this._offset),
          U = this._view.getUint32(this._offset + 4),
          this._offset += 8,
          L + U;
      case 212:
          if (T = this._view.getInt8(this._offset),
          this._offset += 1,
          0 === T) {
              this._offset += 1;
              return
          }
          return [T, this._bin(1)];
      case 213:
          return T = this._view.getInt8(this._offset),
          this._offset += 1,
          [T, this._bin(2)];
      case 214:
          if (T = this._view.getInt8(this._offset),
          this._offset += 1,
          -1 === T)
              return m = this._view.getUint32(this._offset),
              this._offset += 4,
              new Date(1e3 * m);
          return [T, this._bin(4)];
      case 215:
          if (T = this._view.getInt8(this._offset),
          this._offset += 1,
          0 === T)
              return L = 4294967296 * this._view.getInt32(this._offset),
              U = this._view.getUint32(this._offset + 4),
              this._offset += 8,
              new Date(L + U);
          if (-1 === T) {
              L = this._view.getUint32(this._offset),
              U = this._view.getUint32(this._offset + 4),
              this._offset += 8;
              var B = (3 & L) * 4294967296 + U;
              return new Date(1e3 * B + (L >>> 2) / 1e6)
          }
          return [T, this._bin(8)];
      case 216:
          return T = this._view.getInt8(this._offset),
          this._offset += 1,
          [T, this._bin(16)];
      case 217:
          return C = this._view.getUint8(this._offset),
          this._offset += 1,
          this._str(C);
      case 218:
          return C = this._view.getUint16(this._offset),
          this._offset += 2,
          this._str(C);
      case 219:
          return C = this._view.getUint32(this._offset),
          this._offset += 4,
          this._str(C);
      case 220:
          return C = this._view.getUint16(this._offset),
          this._offset += 2,
          this._array(C);
      case 221:
          return C = this._view.getUint32(this._offset),
          this._offset += 4,
          this._array(C);
      case 222:
          return C = this._view.getUint16(this._offset),
          this._offset += 2,
          this._map(C);
      case 223:
          return C = this._view.getUint32(this._offset),
          this._offset += 4,
          this._map(C)
      }
      throw Error("Could not parse")
  }
  ,
  R.decode = function(m, R=0) {
      var C = new Decoder(m,R)
        , T = C._parse();
      if (C._offset !== m.byteLength)
          throw Error(m.byteLength - C._offset + " trailing bytes");
      return T
  }
  ,
  R.encode = function(m) {
      var R = []
        , C = []
        , T = function _encode(m, R, C) {
          var T = typeof C
            , L = 0
            , U = 0
            , $ = 0
            , B = 0
            , V = 0
            , H = 0;
          if ("string" === T) {
              if ((V = function(m) {
                  for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++)
                      (R = m.charCodeAt(T)) < 128 ? C += 1 : R < 2048 ? C += 2 : R < 55296 || R >= 57344 ? C += 3 : (T++,
                      C += 4);
                  return C
              }(C)) < 32)
                  m.push(160 | V),
                  H = 1;
              else if (V < 256)
                  m.push(217, V),
                  H = 2;
              else if (V < 65536)
                  m.push(218, V >> 8, V),
                  H = 3;
              else if (V < 4294967296)
                  m.push(219, V >> 24, V >> 16, V >> 8, V),
                  H = 5;
              else
                  throw Error("String too long");
              return R.push({
                  _str: C,
                  _length: V,
                  _offset: m.length
              }),
              H + V
          }
          if ("number" === T)
              return Math.floor(C) === C && isFinite(C) ? C >= 0 ? C < 128 ? (m.push(C),
              1) : C < 256 ? (m.push(204, C),
              2) : C < 65536 ? (m.push(205, C >> 8, C),
              3) : C < 4294967296 ? (m.push(206, C >> 24, C >> 16, C >> 8, C),
              5) : ($ = C / 4294967296 >> 0,
              B = C >>> 0,
              m.push(207, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
              9) : C >= -32 ? (m.push(C),
              1) : C >= -128 ? (m.push(208, C),
              2) : C >= -32768 ? (m.push(209, C >> 8, C),
              3) : C >= -2147483648 ? (m.push(210, C >> 24, C >> 16, C >> 8, C),
              5) : ($ = Math.floor(C / 4294967296),
              B = C >>> 0,
              m.push(211, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
              9) : (m.push(203),
              R.push({
                  _float: C,
                  _length: 8,
                  _offset: m.length
              }),
              9);
          if ("object" === T) {
              if (null === C)
                  return m.push(192),
                  1;
              if (Array.isArray(C)) {
                  if ((V = C.length) < 16)
                      m.push(144 | V),
                      H = 1;
                  else if (V < 65536)
                      m.push(220, V >> 8, V),
                      H = 3;
                  else if (V < 4294967296)
                      m.push(221, V >> 24, V >> 16, V >> 8, V),
                      H = 5;
                  else
                      throw Error("Array too large");
                  for (L = 0; L < V; L++)
                      H += _encode(m, R, C[L]);
                  return H
              }
              if (C instanceof Date) {
                  var G = C.getTime()
                    , q = Math.floor(G / 1e3)
                    , W = (G - 1e3 * q) * 1e6;
                  return q >= 0 && W >= 0 && q <= 17179869183 ? 0 === W && q <= 4294967295 ? (m.push(214, 255, q >> 24, q >> 16, q >> 8, q),
                  6) : ($ = q / 4294967296,
                  B = 4294967295 & q,
                  m.push(215, 255, W >> 22, W >> 14, W >> 6, $, B >> 24, B >> 16, B >> 8, B),
                  10) : ($ = Math.floor(q / 4294967296),
                  B = q >>> 0,
                  m.push(199, 12, 255, W >> 24, W >> 16, W >> 8, W, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
                  15)
              }
              if (C instanceof ArrayBuffer) {
                  if ((V = C.byteLength) < 256)
                      m.push(196, V),
                      H = 2;
                  else if (V < 65536)
                      m.push(197, V >> 8, V),
                      H = 3;
                  else if (V < 4294967296)
                      m.push(198, V >> 24, V >> 16, V >> 8, V),
                      H = 5;
                  else
                      throw Error("Buffer too large");
                  return R.push({
                      _bin: C,
                      _length: V,
                      _offset: m.length
                  }),
                  H + V
              }
              if ("function" == typeof C.toJSON)
                  return _encode(m, R, C.toJSON());
              var Z = []
                , Y = ""
                , K = Object.keys(C);
              for (L = 0,
              U = K.length; L < U; L++)
                  void 0 !== C[Y = K[L]] && "function" != typeof C[Y] && Z.push(Y);
              if ((V = Z.length) < 16)
                  m.push(128 | V),
                  H = 1;
              else if (V < 65536)
                  m.push(222, V >> 8, V),
                  H = 3;
              else if (V < 4294967296)
                  m.push(223, V >> 24, V >> 16, V >> 8, V),
                  H = 5;
              else
                  throw Error("Object too large");
              for (L = 0; L < V; L++)
                  H += _encode(m, R, Y = Z[L]) + _encode(m, R, C[Y]);
              return H
          }
          if ("boolean" === T)
              return m.push(C ? 195 : 194),
              1;
          if ("undefined" === T)
              return m.push(192),
              1;
          if ("function" == typeof C.toJSON)
              return _encode(m, R, C.toJSON());
          throw Error("Could not encode")
      }(R, C, m)
        , L = new ArrayBuffer(T)
        , U = new DataView(L)
        , $ = 0
        , B = 0
        , V = -1;
      C.length > 0 && (V = C[0]._offset);
      for (var H, G = 0, q = 0, W = 0, Z = R.length; W < Z; W++)
          if (U.setUint8(B + W, R[W]),
          W + 1 === V) {
              if (G = (H = C[$])._length,
              q = B + V,
              H._bin)
                  for (var Y = new Uint8Array(H._bin), K = 0; K < G; K++)
                      U.setUint8(q + K, Y[K]);
              else
                  H._str ? function(m, R, C) {
                      for (var T = 0, L = 0, U = C.length; L < U; L++)
                          (T = C.charCodeAt(L)) < 128 ? m.setUint8(R++, T) : (T < 2048 ? m.setUint8(R++, 192 | T >> 6) : (T < 55296 || T >= 57344 ? m.setUint8(R++, 224 | T >> 12) : (L++,
                          T = 65536 + ((1023 & T) << 10 | 1023 & C.charCodeAt(L)),
                          m.setUint8(R++, 240 | T >> 18),
                          m.setUint8(R++, 128 | T >> 12 & 63)),
                          m.setUint8(R++, 128 | T >> 6 & 63)),
                          m.setUint8(R++, 128 | 63 & T))
                  }(U, q, H._str) : void 0 !== H._float && U.setFloat64(q, H._float);
              $++,
              B += G,
              C[$] && (V = C[$]._offset)
          }
      return L
  }

const $ = {
  decode: function(m, R=0) {
      var C = new Decoder(m,R)
        , T = C._parse();
      if (C._offset !== m.byteLength)
          throw Error(m.byteLength - C._offset + " trailing bytes");
      return T
  },
  encode:  function(m) {
      var R = []
        , C = []
        , T = function _encode(m, R, C) {
          var T = typeof C
            , L = 0
            , U = 0
            , $ = 0
            , B = 0
            , V = 0
            , H = 0;
          if ("string" === T) {
              if ((V = function(m) {
                  for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++)
                      (R = m.charCodeAt(T)) < 128 ? C += 1 : R < 2048 ? C += 2 : R < 55296 || R >= 57344 ? C += 3 : (T++,
                      C += 4);
                  return C
              }(C)) < 32)
                  m.push(160 | V),
                  H = 1;
              else if (V < 256)
                  m.push(217, V),
                  H = 2;
              else if (V < 65536)
                  m.push(218, V >> 8, V),
                  H = 3;
              else if (V < 4294967296)
                  m.push(219, V >> 24, V >> 16, V >> 8, V),
                  H = 5;
              else
                  throw Error("String too long");
              return R.push({
                  _str: C,
                  _length: V,
                  _offset: m.length
              }),
              H + V
          }
          if ("number" === T)
              return Math.floor(C) === C && isFinite(C) ? C >= 0 ? C < 128 ? (m.push(C),
              1) : C < 256 ? (m.push(204, C),
              2) : C < 65536 ? (m.push(205, C >> 8, C),
              3) : C < 4294967296 ? (m.push(206, C >> 24, C >> 16, C >> 8, C),
              5) : ($ = C / 4294967296 >> 0,
              B = C >>> 0,
              m.push(207, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
              9) : C >= -32 ? (m.push(C),
              1) : C >= -128 ? (m.push(208, C),
              2) : C >= -32768 ? (m.push(209, C >> 8, C),
              3) : C >= -2147483648 ? (m.push(210, C >> 24, C >> 16, C >> 8, C),
              5) : ($ = Math.floor(C / 4294967296),
              B = C >>> 0,
              m.push(211, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
              9) : (m.push(203),
              R.push({
                  _float: C,
                  _length: 8,
                  _offset: m.length
              }),
              9);
          if ("object" === T) {
              if (null === C)
                  return m.push(192),
                  1;
              if (Array.isArray(C)) {
                  if ((V = C.length) < 16)
                      m.push(144 | V),
                      H = 1;
                  else if (V < 65536)
                      m.push(220, V >> 8, V),
                      H = 3;
                  else if (V < 4294967296)
                      m.push(221, V >> 24, V >> 16, V >> 8, V),
                      H = 5;
                  else
                      throw Error("Array too large");
                  for (L = 0; L < V; L++)
                      H += _encode(m, R, C[L]);
                  return H
              }
              if (C instanceof Date) {
                  var G = C.getTime()
                    , q = Math.floor(G / 1e3)
                    , W = (G - 1e3 * q) * 1e6;
                  return q >= 0 && W >= 0 && q <= 17179869183 ? 0 === W && q <= 4294967295 ? (m.push(214, 255, q >> 24, q >> 16, q >> 8, q),
                  6) : ($ = q / 4294967296,
                  B = 4294967295 & q,
                  m.push(215, 255, W >> 22, W >> 14, W >> 6, $, B >> 24, B >> 16, B >> 8, B),
                  10) : ($ = Math.floor(q / 4294967296),
                  B = q >>> 0,
                  m.push(199, 12, 255, W >> 24, W >> 16, W >> 8, W, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B),
                  15)
              }
              if (C instanceof ArrayBuffer) {
                  if ((V = C.byteLength) < 256)
                      m.push(196, V),
                      H = 2;
                  else if (V < 65536)
                      m.push(197, V >> 8, V),
                      H = 3;
                  else if (V < 4294967296)
                      m.push(198, V >> 24, V >> 16, V >> 8, V),
                      H = 5;
                  else
                      throw Error("Buffer too large");
                  return R.push({
                      _bin: C,
                      _length: V,
                      _offset: m.length
                  }),
                  H + V
              }
              if ("function" == typeof C.toJSON)
                  return _encode(m, R, C.toJSON());
              var Z = []
                , Y = ""
                , K = Object.keys(C);
              for (L = 0,
              U = K.length; L < U; L++)
                  void 0 !== C[Y = K[L]] && "function" != typeof C[Y] && Z.push(Y);
              if ((V = Z.length) < 16)
                  m.push(128 | V),
                  H = 1;
              else if (V < 65536)
                  m.push(222, V >> 8, V),
                  H = 3;
              else if (V < 4294967296)
                  m.push(223, V >> 24, V >> 16, V >> 8, V),
                  H = 5;
              else
                  throw Error("Object too large");
              for (L = 0; L < V; L++)
                  H += _encode(m, R, Y = Z[L]) + _encode(m, R, C[Y]);
              return H
          }
          if ("boolean" === T)
              return m.push(C ? 195 : 194),
              1;
          if ("undefined" === T)
              return m.push(192),
              1;
          if ("function" == typeof C.toJSON)
              return _encode(m, R, C.toJSON());
          throw Error("Could not encode")
      }(R, C, m)
        , L = new ArrayBuffer(T)
        , U = new DataView(L)
        , $ = 0
        , B = 0
        , V = -1;
      C.length > 0 && (V = C[0]._offset);
      for (var H, G = 0, q = 0, W = 0, Z = R.length; W < Z; W++)
          if (U.setUint8(B + W, R[W]),
          W + 1 === V) {
              if (G = (H = C[$])._length,
              q = B + V,
              H._bin)
                  for (var Y = new Uint8Array(H._bin), K = 0; K < G; K++)
                      U.setUint8(q + K, Y[K]);
              else
                  H._str ? function(m, R, C) {
                      for (var T = 0, L = 0, U = C.length; L < U; L++)
                          (T = C.charCodeAt(L)) < 128 ? m.setUint8(R++, T) : (T < 2048 ? m.setUint8(R++, 192 | T >> 6) : (T < 55296 || T >= 57344 ? m.setUint8(R++, 224 | T >> 12) : (L++,
                          T = 65536 + ((1023 & T) << 10 | 1023 & C.charCodeAt(L)),
                          m.setUint8(R++, 240 | T >> 18),
                          m.setUint8(R++, 128 | T >> 12 & 63)),
                          m.setUint8(R++, 128 | T >> 6 & 63)),
                          m.setUint8(R++, 128 | 63 & T))
                  }(U, q, H._str) : void 0 !== H._float && U.setFloat64(q, H._float);
              $++,
              B += G,
              C[$] && (V = C[$]._offset)
          }
      return L
  }
}


const V = {
Protocol: {
  9: "HANDSHAKE",
  10: "JOIN_ROOM",
  11: "ERROR",
  12: "LEAVE_ROOM",
  13: "ROOM_DATA",
  14: "ROOM_STATE",
  15: "ROOM_STATE_PATCH",
  16: "ROOM_DATA_SCHEMA",
  17: "ROOM_DATA_BYTES",
  HANDSHAKE: 9,
  JOIN_ROOM: 10,
  ERROR: 11,
  LEAVE_ROOM: 12,
  ROOM_DATA: 13,
  ROOM_STATE: 14,
  ROOM_STATE_PATCH: 15,
  ROOM_DATA_SCHEMA: 16,
  ROOM_DATA_BYTES: 17,
},
ErrorCode: {
  4210: "MATCHMAKE_NO_HANDLER",
  4211: "MATCHMAKE_INVALID_CRITERIA",
  4212: "MATCHMAKE_INVALID_ROOM_ID",
  4213: "MATCHMAKE_UNHANDLED",
  4214: "MATCHMAKE_EXPIRED",
  4215: "AUTH_FAILED",
  4216: "APPLICATION_ERROR",
  MATCHMAKE_NO_HANDLER: 4210,
  MATCHMAKE_INVALID_CRITERIA: 4211,
  MATCHMAKE_INVALID_ROOM_ID: 4212,
  MATCHMAKE_UNHANDLED: 4213,
  MATCHMAKE_EXPIRED: 4214,
  AUTH_FAILED: 4215,
  APPLICATION_ERROR: 4216,
},
utf8Read: function (m, R) {
  let C = m[R++];
  for (var T = "", L = 0, U = R, $ = R + C; U < $; U++) {
    var B = m[U];
    if ((128 & B) == 0) {
      T += String.fromCharCode(B);
      continue;
    }
    if ((224 & B) == 192) {
      T += String.fromCharCode(((31 & B) << 6) | (63 & m[++U]));
      continue;
    }
    if ((240 & B) == 224) {
      T += String.fromCharCode(
        ((15 & B) << 12) | ((63 & m[++U]) << 6) | ((63 & m[++U]) << 0)
      );
      continue;
    }
    if ((248 & B) == 240) {
      (L =
        ((7 & B) << 18) |
        ((63 & m[++U]) << 12) |
        ((63 & m[++U]) << 6) |
        ((63 & m[++U]) << 0)) >= 65536
        ? ((L -= 65536),
          (T += String.fromCharCode((L >>> 10) + 55296, (1023 & L) + 56320)))
        : (T += String.fromCharCode(L));
      continue;
    }
    throw Error("Invalid byte " + B.toString(16));
  }
  return T;
},
utf8Length: function (m = "") {
  let R = 0,
    C = 0;
  for (let T = 0, L = m.length; T < L; T++)
    (R = m.charCodeAt(T)) < 128
      ? (C += 1)
      : R < 2048
      ? (C += 2)
      : R < 55296 || R >= 57344
      ? (C += 3)
      : (T++, (C += 4));
  return C + 1;
},
};

!(function (m) {
"use strict";
var R,
  extendStatics = function (m, R) {
    return (extendStatics =
      Object.setPrototypeOf ||
      ({
        __proto__: [],
      } instanceof Array &&
        function (m, R) {
          m.__proto__ = R;
        }) ||
      function (m, R) {
        for (var C in R)
          Object.prototype.hasOwnProperty.call(R, C) && (m[C] = R[C]);
      })(m, R);
  };
function __extends(m, R) {
  if ("function" != typeof R && null !== R)
    throw TypeError(
      "Class extends value " + String(R) + " is not a constructor or null"
    );
  function __() {
    this.constructor = m;
  }
  extendStatics(m, R),
    (m.prototype =
      null === R
        ? Object.create(R)
        : ((__.prototype = R.prototype), new __()));
}
function __decorate(m, R, C, T) {
  var L,
    U = arguments.length,
    $ =
      U < 3
        ? R
        : null === T
        ? (T = Object.getOwnPropertyDescriptor(R, C))
        : T;
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
    $ = Reflect.decorate(m, R, C, T);
  else
    for (var B = m.length - 1; B >= 0; B--)
      (L = m[B]) && ($ = (U < 3 ? L($) : U > 3 ? L(R, C, $) : L(R, C)) || $);
  return U > 3 && $ && Object.defineProperty(R, C, $), $;
}
function __spreadArray(m, R, C) {
  if (C || 2 == arguments.length)
    for (var T, L = 0, U = R.length; L < U; L++)
      (!T && L in R) ||
        (T || (T = Array.prototype.slice.call(R, 0, L)), (T[L] = R[L]));
  return m.concat(T || Array.prototype.slice.call(R));
}
(m.OPERATION = void 0),
  ((R = m.OPERATION || (m.OPERATION = {}))[(R.ADD = 128)] = "ADD"),
  (R[(R.REPLACE = 0)] = "REPLACE"),
  (R[(R.DELETE = 64)] = "DELETE"),
  (R[(R.DELETE_AND_ADD = 192)] = "DELETE_AND_ADD"),
  (R[(R.TOUCH = 1)] = "TOUCH"),
  (R[(R.CLEAR = 10)] = "CLEAR");
var C = (function () {
  function ChangeTree(m, R, C) {
    (this.changed = !1),
      (this.changes = new Map()),
      (this.allChanges = new Set()),
      (this.caches = {}),
      (this.currentCustomOperation = 0),
      (this.ref = m),
      this.setParent(R, C);
  }
  return (
    (ChangeTree.prototype.setParent = function (m, R, C) {
      var T = this;
      if (
        (this.indexes ||
          (this.indexes =
            this.ref instanceof en ? this.ref._definition.indexes : {}),
        (this.parent = m),
        (this.parentIndex = C),
        R)
      ) {
        if (((this.root = R), this.ref instanceof en)) {
          var L = this.ref._definition;
          for (var U in L.schema) {
            var $ = this.ref[U];
            if ($ && $.$changes) {
              var B = L.indexes[U];
              $.$changes.setParent(this.ref, R, B);
            }
          }
        } else
          "object" == typeof this.ref &&
            this.ref.forEach(function (m, R) {
              if (m instanceof en) {
                var C = m.$changes,
                  L = T.ref.$changes.indexes[R];
                C.setParent(T.ref, T.root, L);
              }
            });
      }
    }),
    (ChangeTree.prototype.operation = function (m) {
      this.changes.set(--this.currentCustomOperation, m);
    }),
    (ChangeTree.prototype.change = function (R, C) {
      void 0 === C && (C = m.OPERATION.ADD);
      var T = "number" == typeof R ? R : this.indexes[R];
      this.assertValidIndex(T, R);
      var L = this.changes.get(T);
      (L && L.op !== m.OPERATION.DELETE && L.op !== m.OPERATION.TOUCH) ||
        this.changes.set(T, {
          op:
            L && L.op === m.OPERATION.DELETE ? m.OPERATION.DELETE_AND_ADD : C,
          index: T,
        }),
        this.allChanges.add(T),
        (this.changed = !0),
        this.touchParents();
    }),
    (ChangeTree.prototype.touch = function (R) {
      var C = "number" == typeof R ? R : this.indexes[R];
      this.assertValidIndex(C, R),
        this.changes.has(C) ||
          this.changes.set(C, {
            op: m.OPERATION.TOUCH,
            index: C,
          }),
        this.allChanges.add(C),
        this.touchParents();
    }),
    (ChangeTree.prototype.touchParents = function () {
      this.parent && this.parent.$changes.touch(this.parentIndex);
    }),
    (ChangeTree.prototype.getType = function (m) {
      if (this.ref._definition) {
        var R = this.ref._definition;
        return R.schema[R.fieldsByIndex[m]];
      }
      var R = this.parent._definition;
      return Object.values(R.schema[R.fieldsByIndex[this.parentIndex]])[0];
    }),
    (ChangeTree.prototype.getChildrenFilter = function () {
      var m = this.parent._definition.childFilters;
      return m && m[this.parentIndex];
    }),
    (ChangeTree.prototype.getValue = function (m) {
      return this.ref.getByIndex(m);
    }),
    (ChangeTree.prototype.delete = function (R) {
      var C = "number" == typeof R ? R : this.indexes[R];
      if (void 0 === C) {
        console.warn(
          "@colyseus/schema "
            .concat(
              this.ref.constructor.name,
              ": trying to delete non-existing index: "
            )
            .concat(R, " (")
            .concat(C, ")")
        );
        return;
      }
      var T = this.getValue(C);
      this.changes.set(C, {
        op: m.OPERATION.DELETE,
        index: C,
      }),
        this.allChanges.delete(C),
        delete this.caches[C],
        T && T.$changes && (T.$changes.parent = void 0),
        (this.changed = !0),
        this.touchParents();
    }),
    (ChangeTree.prototype.discard = function (R, C) {
      var T = this;
      void 0 === R && (R = !1),
        void 0 === C && (C = !1),
        this.ref instanceof en ||
          this.changes.forEach(function (R) {
            if (R.op === m.OPERATION.DELETE) {
              var C = T.ref.getIndex(R.index);
              delete T.indexes[C];
            }
          }),
        this.changes.clear(),
        (this.changed = R),
        C && this.allChanges.clear(),
        (this.currentCustomOperation = 0);
    }),
    (ChangeTree.prototype.discardAll = function () {
      var m = this;
      this.changes.forEach(function (R) {
        var C = m.getValue(R.index);
        C && C.$changes && C.$changes.discardAll();
      }),
        this.discard();
    }),
    (ChangeTree.prototype.cache = function (m, R) {
      this.caches[m] = R;
    }),
    (ChangeTree.prototype.clone = function () {
      return new ChangeTree(this.ref, this.parent, this.root);
    }),
    (ChangeTree.prototype.ensureRefId = function () {
      void 0 === this.refId && (this.refId = this.root.getNextUniqueId());
    }),
    (ChangeTree.prototype.assertValidIndex = function (m, R) {
      if (void 0 === m)
        throw Error('ChangeTree: missing index for field "'.concat(R, '"'));
    }),
    ChangeTree
  );
})();
function addCallback(m, R, C, T) {
  return (
    m[R] || (m[R] = []),
    m[R].push(C),
    null == T ||
      T.forEach(function (m, R) {
        return C(m, R);
      }),
    function () {
      return spliceOne(m[R], m[R].indexOf(C));
    }
  );
}
function removeChildRefs(R) {
  var C = this,
    T = "string" != typeof this.$changes.getType();
  this.$items.forEach(function (L, U) {
    R.push({
      refId: C.$changes.refId,
      op: m.OPERATION.DELETE,
      field: U,
      value: void 0,
      previousValue: L,
    }),
      T && C.$changes.root.removeRef(L.$changes.refId);
  });
}
function spliceOne(m, R) {
  if (-1 === R || R >= m.length) return !1;
  for (var C = m.length - 1, T = R; T < C; T++) m[T] = m[T + 1];
  return (m.length = C), !0;
}
var DEFAULT_SORT = function (m, R) {
    var C = m.toString(),
      T = R.toString();
    return C < T ? -1 : C > T ? 1 : 0;
  },
  T = (function () {
    function ArraySchema() {
      for (var m = [], R = 0; R < arguments.length; R++) m[R] = arguments[R];
      (this.$changes = new C(this)),
        (this.$items = new Map()),
        (this.$indexes = new Map()),
        (this.$refId = 0),
        this.push.apply(this, m);
    }
    return (
      (ArraySchema.prototype.onAdd = function (R, C) {
        return (
          void 0 === C && (C = !0),
          addCallback(
            this.$callbacks || (this.$callbacks = []),
            m.OPERATION.ADD,
            R,
            C ? this.$items : void 0
          )
        );
      }),
      (ArraySchema.prototype.onRemove = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.DELETE,
          R
        );
      }),
      (ArraySchema.prototype.onChange = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.REPLACE,
          R
        );
      }),
      (ArraySchema.is = function (m) {
        return Array.isArray(m) || void 0 !== m.array;
      }),
      Object.defineProperty(ArraySchema.prototype, "length", {
        get: function () {
          return this.$items.size;
        },
        set: function (m) {
          0 === m ? this.clear() : this.splice(m, this.length - m);
        },
        enumerable: !1,
        configurable: !0,
      }),
      (ArraySchema.prototype.push = function () {
        for (var m, R = this, C = [], T = 0; T < arguments.length; T++)
          C[T] = arguments[T];
        return (
          C.forEach(function (C) {
            (m = R.$refId++), R.setAt(m, C);
          }),
          m
        );
      }),
      (ArraySchema.prototype.pop = function () {
        var m = Array.from(this.$indexes.values()).pop();
        if (void 0 !== m) {
          this.$changes.delete(m), this.$indexes.delete(m);
          var R = this.$items.get(m);
          return this.$items.delete(m), R;
        }
      }),
      (ArraySchema.prototype.at = function (m) {
        var R = Array.from(this.$items.keys())[m];
        return this.$items.get(R);
      }),
      (ArraySchema.prototype.setAt = function (R, C) {
        void 0 !== C.$changes &&
          C.$changes.setParent(this, this.$changes.root, R);
        var T,
          L,
          U =
            null !==
              (L =
                null === (T = this.$changes.indexes[R]) || void 0 === T
                  ? void 0
                  : T.op) && void 0 !== L
              ? L
              : m.OPERATION.ADD;
        (this.$changes.indexes[R] = R),
          this.$indexes.set(R, R),
          this.$items.set(R, C),
          this.$changes.change(R, U);
      }),
      (ArraySchema.prototype.deleteAt = function (m) {
        var R = Array.from(this.$items.keys())[m];
        return void 0 !== R && this.$deleteAt(R);
      }),
      (ArraySchema.prototype.$deleteAt = function (m) {
        return (
          this.$changes.delete(m),
          this.$indexes.delete(m),
          this.$items.delete(m)
        );
      }),
      (ArraySchema.prototype.clear = function (R) {
        this.$changes.discard(!0, !0),
          (this.$changes.indexes = {}),
          this.$indexes.clear(),
          R && removeChildRefs.call(this, R),
          this.$items.clear(),
          this.$changes.operation({
            index: 0,
            op: m.OPERATION.CLEAR,
          }),
          this.$changes.touchParents();
      }),
      (ArraySchema.prototype.concat = function () {
        for (var m, R = [], C = 0; C < arguments.length; C++)
          R[C] = arguments[C];
        return new (ArraySchema.bind.apply(
          ArraySchema,
          __spreadArray(
            [void 0],
            (m = Array.from(this.$items.values())).concat.apply(m, R),
            !1
          )
        ))();
      }),
      (ArraySchema.prototype.join = function (m) {
        return Array.from(this.$items.values()).join(m);
      }),
      (ArraySchema.prototype.reverse = function () {
        var m = this,
          R = Array.from(this.$items.keys());
        return (
          Array.from(this.$items.values())
            .reverse()
            .forEach(function (C, T) {
              m.setAt(R[T], C);
            }),
          this
        );
      }),
      (ArraySchema.prototype.shift = function () {
        var m = Array.from(this.$items.keys()).shift();
        if (void 0 !== m) {
          var R = this.$items.get(m);
          return this.$deleteAt(m), R;
        }
      }),
      (ArraySchema.prototype.slice = function (m, R) {
        var C = new ArraySchema();
        return (
          C.push.apply(C, Array.from(this.$items.values()).slice(m, R)), C
        );
      }),
      (ArraySchema.prototype.sort = function (m) {
        var R = this;
        void 0 === m && (m = DEFAULT_SORT);
        var C = Array.from(this.$items.keys());
        return (
          Array.from(this.$items.values())
            .sort(m)
            .forEach(function (m, T) {
              R.setAt(C[T], m);
            }),
          this
        );
      }),
      (ArraySchema.prototype.splice = function (m, R) {
        void 0 === R && (R = this.length - m);
        for (
          var C = Array.from(this.$items.keys()), T = [], L = m;
          L < m + R;
          L++
        )
          T.push(this.$items.get(C[L])), this.$deleteAt(C[L]);
        return T;
      }),
      (ArraySchema.prototype.unshift = function () {
        for (var m = this, R = [], C = 0; C < arguments.length; C++)
          R[C] = arguments[C];
        var T = this.length,
          L = R.length,
          U = Array.from(this.$items.values());
        return (
          R.forEach(function (R, C) {
            m.setAt(C, R);
          }),
          U.forEach(function (R, C) {
            m.setAt(L + C, R);
          }),
          T + L
        );
      }),
      (ArraySchema.prototype.indexOf = function (m, R) {
        return Array.from(this.$items.values()).indexOf(m, R);
      }),
      (ArraySchema.prototype.lastIndexOf = function (m, R) {
        return (
          void 0 === R && (R = this.length - 1),
          Array.from(this.$items.values()).lastIndexOf(m, R)
        );
      }),
      (ArraySchema.prototype.every = function (m, R) {
        return Array.from(this.$items.values()).every(m, R);
      }),
      (ArraySchema.prototype.some = function (m, R) {
        return Array.from(this.$items.values()).some(m, R);
      }),
      (ArraySchema.prototype.forEach = function (m, R) {
        Array.from(this.$items.values()).forEach(m, R);
      }),
      (ArraySchema.prototype.map = function (m, R) {
        return Array.from(this.$items.values()).map(m, R);
      }),
      (ArraySchema.prototype.filter = function (m, R) {
        return Array.from(this.$items.values()).filter(m, R);
      }),
      (ArraySchema.prototype.reduce = function (m, R) {
        return Array.prototype.reduce.apply(
          Array.from(this.$items.values()),
          arguments
        );
      }),
      (ArraySchema.prototype.reduceRight = function (m, R) {
        return Array.prototype.reduceRight.apply(
          Array.from(this.$items.values()),
          arguments
        );
      }),
      (ArraySchema.prototype.find = function (m, R) {
        return Array.from(this.$items.values()).find(m, R);
      }),
      (ArraySchema.prototype.findIndex = function (m, R) {
        return Array.from(this.$items.values()).findIndex(m, R);
      }),
      (ArraySchema.prototype.fill = function (m, R, C) {
        throw Error("ArraySchema#fill() not implemented");
      }),
      (ArraySchema.prototype.copyWithin = function (m, R, C) {
        throw Error("ArraySchema#copyWithin() not implemented");
      }),
      (ArraySchema.prototype.toString = function () {
        return this.$items.toString();
      }),
      (ArraySchema.prototype.toLocaleString = function () {
        return this.$items.toLocaleString();
      }),
      (ArraySchema.prototype[Symbol.iterator] = function () {
        return Array.from(this.$items.values())[Symbol.iterator]();
      }),
      (ArraySchema.prototype.entries = function () {
        return this.$items.entries();
      }),
      (ArraySchema.prototype.keys = function () {
        return this.$items.keys();
      }),
      (ArraySchema.prototype.values = function () {
        return this.$items.values();
      }),
      (ArraySchema.prototype.includes = function (m, R) {
        return Array.from(this.$items.values()).includes(m, R);
      }),
      (ArraySchema.prototype.flatMap = function (m, R) {
        throw Error("ArraySchema#flatMap() is not supported.");
      }),
      (ArraySchema.prototype.flat = function (m) {
        throw Error("ArraySchema#flat() is not supported.");
      }),
      (ArraySchema.prototype.findLast = function () {
        var m = Array.from(this.$items.values());
        return m.findLast.apply(m, arguments);
      }),
      (ArraySchema.prototype.findLastIndex = function () {
        var m = Array.from(this.$items.values());
        return m.findLastIndex.apply(m, arguments);
      }),
      (ArraySchema.prototype.setIndex = function (m, R) {
        this.$indexes.set(m, R);
      }),
      (ArraySchema.prototype.getIndex = function (m) {
        return this.$indexes.get(m);
      }),
      (ArraySchema.prototype.getByIndex = function (m) {
        return this.$items.get(this.$indexes.get(m));
      }),
      (ArraySchema.prototype.deleteByIndex = function (m) {
        var R = this.$indexes.get(m);
        this.$items.delete(R), this.$indexes.delete(m);
      }),
      (ArraySchema.prototype.toArray = function () {
        return Array.from(this.$items.values());
      }),
      (ArraySchema.prototype.toJSON = function () {
        return this.toArray().map(function (m) {
          return "function" == typeof m.toJSON ? m.toJSON() : m;
        });
      }),
      (ArraySchema.prototype.clone = function (m) {
        return m
          ? new (ArraySchema.bind.apply(
              ArraySchema,
              __spreadArray([void 0], Array.from(this.$items.values()), !1)
            ))()
          : new (ArraySchema.bind.apply(
              ArraySchema,
              __spreadArray(
                [void 0],
                this.map(function (m) {
                  return m.$changes ? m.clone() : m;
                }),
                !1
              )
            ))();
      }),
      ArraySchema
    );
  })(),
  L = (function () {
    function MapSchema(m) {
      var R = this;
      if (
        ((this.$changes = new C(this)),
        (this.$items = new Map()),
        (this.$indexes = new Map()),
        (this.$refId = 0),
        m)
      ) {
        if (m instanceof Map || m instanceof MapSchema)
          m.forEach(function (m, C) {
            return R.set(C, m);
          });
        else for (var T in m) this.set(T, m[T]);
      }
    }
    return (
      (MapSchema.prototype.onAdd = function (R, C) {
        return (
          void 0 === C && (C = !0),
          addCallback(
            this.$callbacks || (this.$callbacks = []),
            m.OPERATION.ADD,
            R,
            C ? this.$items : void 0
          )
        );
      }),
      (MapSchema.prototype.onRemove = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.DELETE,
          R
        );
      }),
      (MapSchema.prototype.onChange = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.REPLACE,
          R
        );
      }),
      (MapSchema.is = function (m) {
        return void 0 !== m.map;
      }),
      (MapSchema.prototype[Symbol.iterator] = function () {
        return this.$items[Symbol.iterator]();
      }),
      Object.defineProperty(MapSchema.prototype, Symbol.toStringTag, {
        get: function () {
          return this.$items[Symbol.toStringTag];
        },
        enumerable: !1,
        configurable: !0,
      }),
      (MapSchema.prototype.set = function (R, C) {
        if (null == C)
          throw Error(
            "MapSchema#set('"
              .concat(R, "', ")
              .concat(C, "): trying to set ")
              .concat(C, " value on '")
              .concat(R, "'.")
          );
        var T = void 0 !== this.$changes.indexes[R],
          L = T ? this.$changes.indexes[R] : this.$refId++,
          U = T ? m.OPERATION.REPLACE : m.OPERATION.ADD,
          $ = void 0 !== C.$changes;
        return (
          $ && C.$changes.setParent(this, this.$changes.root, L),
          T
            ? $ && this.$items.get(R) !== C && (U = m.OPERATION.ADD)
            : ((this.$changes.indexes[R] = L), this.$indexes.set(L, R)),
          this.$items.set(R, C),
          this.$changes.change(R, U),
          this
        );
      }),
      (MapSchema.prototype.get = function (m) {
        return this.$items.get(m);
      }),
      (MapSchema.prototype.delete = function (m) {
        return this.$changes.delete(m), this.$items.delete(m);
      }),
      (MapSchema.prototype.clear = function (R) {
        this.$changes.discard(!0, !0),
          (this.$changes.indexes = {}),
          this.$indexes.clear(),
          R && removeChildRefs.call(this, R),
          this.$items.clear(),
          this.$changes.operation({
            index: 0,
            op: m.OPERATION.CLEAR,
          }),
          this.$changes.touchParents();
      }),
      (MapSchema.prototype.has = function (m) {
        return this.$items.has(m);
      }),
      (MapSchema.prototype.forEach = function (m) {
        this.$items.forEach(m);
      }),
      (MapSchema.prototype.entries = function () {
        return this.$items.entries();
      }),
      (MapSchema.prototype.keys = function () {
        return this.$items.keys();
      }),
      (MapSchema.prototype.values = function () {
        return this.$items.values();
      }),
      Object.defineProperty(MapSchema.prototype, "size", {
        get: function () {
          return this.$items.size;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (MapSchema.prototype.setIndex = function (m, R) {
        this.$indexes.set(m, R);
      }),
      (MapSchema.prototype.getIndex = function (m) {
        return this.$indexes.get(m);
      }),
      (MapSchema.prototype.getByIndex = function (m) {
        return this.$items.get(this.$indexes.get(m));
      }),
      (MapSchema.prototype.deleteByIndex = function (m) {
        var R = this.$indexes.get(m);
        this.$items.delete(R), this.$indexes.delete(m);
      }),
      (MapSchema.prototype.toJSON = function () {
        var m = {};
        return (
          this.forEach(function (R, C) {
            m[C] = "function" == typeof R.toJSON ? R.toJSON() : R;
          }),
          m
        );
      }),
      (MapSchema.prototype.clone = function (m) {
        var R;
        return (
          m
            ? (R = Object.assign(new MapSchema(), this))
            : ((R = new MapSchema()),
              this.forEach(function (m, C) {
                m.$changes ? R.set(C, m.clone()) : R.set(C, m);
              })),
          R
        );
      }),
      MapSchema
    );
  })(),
  U = {},
  $ = (function () {
    function SchemaDefinition() {
      (this.indexes = {}),
        (this.fieldsByIndex = {}),
        (this.deprecated = {}),
        (this.descriptors = {});
    }
    return (
      (SchemaDefinition.create = function (m) {
        var R = new SchemaDefinition();
        return (
          (R.schema = Object.assign({}, (m && m.schema) || {})),
          (R.indexes = Object.assign({}, (m && m.indexes) || {})),
          (R.fieldsByIndex = Object.assign({}, (m && m.fieldsByIndex) || {})),
          (R.descriptors = Object.assign({}, (m && m.descriptors) || {})),
          (R.deprecated = Object.assign({}, (m && m.deprecated) || {})),
          R
        );
      }),
      (SchemaDefinition.prototype.addField = function (m, R) {
        var C = this.getNextFieldIndex();
        (this.fieldsByIndex[C] = m),
          (this.indexes[m] = C),
          (this.schema[m] = Array.isArray(R)
            ? {
                array: R[0],
              }
            : R);
      }),
      (SchemaDefinition.prototype.hasField = function (m) {
        return void 0 !== this.indexes[m];
      }),
      (SchemaDefinition.prototype.addFilter = function (m, R) {
        return (
          this.filters ||
            ((this.filters = {}), (this.indexesWithFilters = [])),
          (this.filters[this.indexes[m]] = R),
          this.indexesWithFilters.push(this.indexes[m]),
          !0
        );
      }),
      (SchemaDefinition.prototype.addChildrenFilter = function (m, R) {
        var C = this.indexes[m];
        if (U[Object.keys(this.schema[m])[0]])
          return (
            this.childFilters || (this.childFilters = {}),
            (this.childFilters[C] = R),
            !0
          );
        console.warn(
          "@filterChildren: field '".concat(
            m,
            "' can't have children. Ignoring filter."
          )
        );
      }),
      (SchemaDefinition.prototype.getChildrenFilter = function (m) {
        return this.childFilters && this.childFilters[this.indexes[m]];
      }),
      (SchemaDefinition.prototype.getNextFieldIndex = function () {
        return Object.keys(this.schema || {}).length;
      }),
      SchemaDefinition
    );
  })(),
  B = (function () {
    function Context() {
      (this.types = {}), (this.schemas = new Map()), (this.useFilters = !1);
    }
    return (
      (Context.prototype.has = function (m) {
        return this.schemas.has(m);
      }),
      (Context.prototype.get = function (m) {
        return this.types[m];
      }),
      (Context.prototype.add = function (m, R) {
        void 0 === R && (R = this.schemas.size),
          (m._definition = $.create(m._definition)),
          (m._typeid = R),
          (this.types[R] = m),
          this.schemas.set(m, R);
      }),
      (Context.create = function (m) {
        return (
          void 0 === m && (m = {}),
          function (R) {
            return m.context || (m.context = new Context()), type(R, m);
          }
        );
      }),
      Context
    );
  })(),
  V = new B();
function type(m, R) {
  return (
    void 0 === R && (R = {}),
    function (C, U) {
      var $ = R.context || V,
        B = C.constructor;
      if (((B._context = $), !m))
        throw Error(
          ""
            .concat(B.name, ': @type() reference provided for "')
            .concat(
              U,
              "\" is undefined. Make sure you don't have any circular dependencies."
            )
        );
      $.has(B) || $.add(B);
      var H = B._definition;
      if ((H.addField(U, m), H.descriptors[U])) {
        if (H.deprecated[U]) return;
        try {
          throw Error(
            "@colyseus/schema: Duplicate '"
              .concat(U, "' definition on '")
              .concat(B.name, "'.\nCheck @type() annotation")
          );
        } catch (m) {
          var G = m.stack.split("\n")[4].trim();
          throw Error("".concat(m.message, " ").concat(G));
        }
      }
      var q = T.is(m),
        W = !q && L.is(m);
      if ("string" != typeof m && !en.is(m)) {
        var Z = Object.values(m)[0];
        "string" == typeof Z || $.has(Z) || $.add(Z);
      }
      if (R.manual) {
        H.descriptors[U] = {
          enumerable: !0,
          configurable: !0,
          writable: !0,
        };
        return;
      }
      var Y = "_".concat(U);
      (H.descriptors[Y] = {
        enumerable: !1,
        configurable: !1,
        writable: !0,
      }),
        (H.descriptors[U] = {
          get: function () {
            return this[Y];
          },
          set: function (m) {
            if (m !== this[Y]) {
              if (null != m) {
                if (
                  (!q ||
                    m instanceof T ||
                    (m = new (T.bind.apply(
                      T,
                      __spreadArray([void 0], m, !1)
                    ))()),
                  !W || m instanceof L || (m = new L(m)),
                  void 0 === m.$proxy)
                ) {
                  var R, C;
                  W
                    ? (((R = m).$proxy = !0),
                      (m = R =
                        new Proxy(R, {
                          get: function (m, R) {
                            return "symbol" != typeof R && void 0 === m[R]
                              ? m.get(R)
                              : m[R];
                          },
                          set: function (m, R, C) {
                            return (
                              "symbol" != typeof R &&
                              -1 === R.indexOf("$") &&
                              "onAdd" !== R &&
                              "onRemove" !== R &&
                              "onChange" !== R
                                ? m.set(R, C)
                                : (m[R] = C),
                              !0
                            );
                          },
                          deleteProperty: function (m, R) {
                            return m.delete(R), !0;
                          },
                        })))
                    : q &&
                      (((C = m).$proxy = !0),
                      (m = C =
                        new Proxy(C, {
                          get: function (m, R) {
                            return "symbol" == typeof R || isNaN(R)
                              ? m[R]
                              : m.at(R);
                          },
                          set: function (m, R, C) {
                            if ("symbol" == typeof R || isNaN(R)) m[R] = C;
                            else {
                              var T = parseInt(
                                Array.from(m.$items.keys())[R] || R
                              );
                              null == C ? m.deleteAt(T) : m.setAt(T, C);
                            }
                            return !0;
                          },
                          deleteProperty: function (m, R) {
                            return (
                              "number" == typeof R
                                ? m.deleteAt(R)
                                : delete m[R],
                              !0
                            );
                          },
                        })));
                }
                this.$changes.change(U),
                  m.$changes &&
                    m.$changes.setParent(
                      this,
                      this.$changes.root,
                      this._definition.indexes[U]
                    );
              } else this[Y] && this.$changes.delete(U);
              this[Y] = m;
            }
          },
          enumerable: !0,
          configurable: !0,
        });
    }
  );
}
function utf8Write(m, R, C) {
  for (var T = 0, L = 0, U = C.length; L < U; L++)
    (T = C.charCodeAt(L)) < 128
      ? (m[R++] = T)
      : (T < 2048
          ? (m[R++] = 192 | (T >> 6))
          : (T < 55296 || T >= 57344
              ? (m[R++] = 224 | (T >> 12))
              : (L++,
                (T = 65536 + (((1023 & T) << 10) | (1023 & C.charCodeAt(L)))),
                (m[R++] = 240 | (T >> 18)),
                (m[R++] = 128 | ((T >> 12) & 63))),
            (m[R++] = 128 | ((T >> 6) & 63))),
        (m[R++] = 128 | (63 & T)));
}
function int8$1(m, R) {
  m.push(255 & R);
}
function uint8$1(m, R) {
  m.push(255 & R);
}
function int16$1(m, R) {
  m.push(255 & R), m.push((R >> 8) & 255);
}
function uint16$1(m, R) {
  m.push(255 & R), m.push((R >> 8) & 255);
}
function int32$1(m, R) {
  m.push(255 & R),
    m.push((R >> 8) & 255),
    m.push((R >> 16) & 255),
    m.push((R >> 24) & 255);
}
function uint32$1(m, R) {
  var C = R >> 24,
    T = R >> 16,
    L = R >> 8;
  m.push(255 & R), m.push(255 & L), m.push(255 & T), m.push(255 & C);
}
function int64$1(m, R) {
  uint32$1(m, R >>> 0), uint32$1(m, Math.floor(R / 4294967296));
}
function uint64$1(m, R) {
  uint32$1(m, R >>> 0), uint32$1(m, (R / 4294967296) >> 0);
}
var H = new Int32Array(2),
  G = new Float32Array(H.buffer),
  q = new Float64Array(H.buffer);
function writeFloat32(m, R) {
  (G[0] = R), int32$1(m, H[0]);
}
function writeFloat64(m, R) {
  (q[0] = R), int32$1(m, H[0]), int32$1(m, H[1]);
}
function string$1(m, R) {
  R || (R = "");
  var C = (function (m) {
      for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++)
        (R = m.charCodeAt(T)) < 128
          ? (C += 1)
          : R < 2048
          ? (C += 2)
          : R < 55296 || R >= 57344
          ? (C += 3)
          : (T++, (C += 4));
      return C;
    })(R),
    T = 0;
  if (C < 32) m.push(160 | C), (T = 1);
  else if (C < 256) m.push(217), uint8$1(m, C), (T = 2);
  else if (C < 65536) m.push(218), uint16$1(m, C), (T = 3);
  else if (C < 4294967296) m.push(219), uint32$1(m, C), (T = 5);
  else throw Error("String too long");
  return utf8Write(m, m.length, R), T + C;
}
function number$1(m, R) {
  return isNaN(R)
    ? number$1(m, 0)
    : isFinite(R)
    ? R !== (0 | R)
      ? (m.push(203), writeFloat64(m, R), 9)
      : R >= 0
      ? R < 128
        ? (uint8$1(m, R), 1)
        : R < 256
        ? (m.push(204), uint8$1(m, R), 2)
        : R < 65536
        ? (m.push(205), uint16$1(m, R), 3)
        : R < 4294967296
        ? (m.push(206), uint32$1(m, R), 5)
        : (m.push(207), uint64$1(m, R), 9)
      : R >= -32
      ? (m.push(224 | (R + 32)), 1)
      : R >= -128
      ? (m.push(208), int8$1(m, R), 2)
      : R >= -32768
      ? (m.push(209), int16$1(m, R), 3)
      : R >= -2147483648
      ? (m.push(210), int32$1(m, R), 5)
      : (m.push(211), int64$1(m, R), 9)
    : number$1(m, R > 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER);
}
var W = Object.freeze({
  __proto__: null,
  utf8Write: utf8Write,
  int8: int8$1,
  uint8: uint8$1,
  int16: int16$1,
  uint16: uint16$1,
  int32: int32$1,
  uint32: uint32$1,
  int64: int64$1,
  uint64: uint64$1,
  float32: function (m, R) {
    writeFloat32(m, R);
  },
  float64: function (m, R) {
    writeFloat64(m, R);
  },
  writeFloat32: writeFloat32,
  writeFloat64: writeFloat64,
  boolean: function (m, R) {
    return uint8$1(m, R ? 1 : 0);
  },
  string: string$1,
  number: number$1,
});
function int8(m, R) {
  return (uint8(m, R) << 24) >> 24;
}
function uint8(m, R) {
  return m[R.offset++];
}
function int16(m, R) {
  return (uint16(m, R) << 16) >> 16;
}
function uint16(m, R) {
  return m[R.offset++] | (m[R.offset++] << 8);
}
function int32(m, R) {
  return (
    m[R.offset++] |
    (m[R.offset++] << 8) |
    (m[R.offset++] << 16) |
    (m[R.offset++] << 24)
  );
}
function uint32(m, R) {
  return int32(m, R) >>> 0;
}
function int64(m, R) {
  var C = uint32(m, R);
  return 4294967296 * int32(m, R) + C;
}
function uint64(m, R) {
  var C = uint32(m, R);
  return 4294967296 * uint32(m, R) + C;
}
var Z = new Int32Array(2),
  Y = new Float32Array(Z.buffer),
  K = new Float64Array(Z.buffer);
function readFloat32(m, R) {
  return (Z[0] = int32(m, R)), Y[0];
}
function readFloat64(m, R) {
  return (Z[0] = int32(m, R)), (Z[1] = int32(m, R)), K[0];
}
function string(m, R) {
  var C,
    T = m[R.offset++];
  T < 192
    ? (C = 31 & T)
    : 217 === T
    ? (C = uint8(m, R))
    : 218 === T
    ? (C = uint16(m, R))
    : 219 === T && (C = uint32(m, R));
  var L = (function (m, R, C) {
    for (var T = "", L = 0, U = R, $ = R + C; U < $; U++) {
      var B = m[U];
      if ((128 & B) == 0) {
        T += String.fromCharCode(B);
        continue;
      }
      if ((224 & B) == 192) {
        T += String.fromCharCode(((31 & B) << 6) | (63 & m[++U]));
        continue;
      }
      if ((240 & B) == 224) {
        T += String.fromCharCode(
          ((15 & B) << 12) | ((63 & m[++U]) << 6) | ((63 & m[++U]) << 0)
        );
        continue;
      }
      if ((248 & B) == 240) {
        (L =
          ((7 & B) << 18) |
          ((63 & m[++U]) << 12) |
          ((63 & m[++U]) << 6) |
          ((63 & m[++U]) << 0)) >= 65536
          ? ((L -= 65536),
            (T += String.fromCharCode(
              (L >>> 10) + 55296,
              (1023 & L) + 56320
            )))
          : (T += String.fromCharCode(L));
        continue;
      }
      console.error("Invalid byte " + B.toString(16));
    }
    return T;
  })(m, R.offset, C);
  return (R.offset += C), L;
}
function number(m, R) {
  var C = m[R.offset++];
  if (C < 128) return C;
  if (202 === C) return readFloat32(m, R);
  if (203 === C) return readFloat64(m, R);
  if (204 === C) return uint8(m, R);
  if (205 === C) return uint16(m, R);
  if (206 === C) return uint32(m, R);
  if (207 === C) return uint64(m, R);
  else if (208 === C) return int8(m, R);
  else if (209 === C) return int16(m, R);
  else if (210 === C) return int32(m, R);
  else if (211 === C) return int64(m, R);
  else if (C > 223) return -((255 - C + 1) * 1);
}
function switchStructureCheck(m, R) {
  return (
    255 === m[R.offset - 1] &&
    (m[R.offset] < 128 || (m[R.offset] >= 202 && m[R.offset] <= 211))
  );
}
var J = Object.freeze({
    __proto__: null,
    int8: int8,
    uint8: uint8,
    int16: int16,
    uint16: uint16,
    int32: int32,
    uint32: uint32,
    float32: function (m, R) {
      return readFloat32(m, R);
    },
    float64: function (m, R) {
      return readFloat64(m, R);
    },
    int64: int64,
    uint64: uint64,
    readFloat32: readFloat32,
    readFloat64: readFloat64,
    boolean: function (m, R) {
      return uint8(m, R) > 0;
    },
    string: string,
    stringCheck: function (m, R) {
      var C = m[R.offset];
      return (C < 192 && C > 160) || 217 === C || 218 === C || 219 === C;
    },
    number: number,
    numberCheck: function (m, R) {
      var C = m[R.offset];
      return C < 128 || (C >= 202 && C <= 211);
    },
    arrayCheck: function (m, R) {
      return m[R.offset] < 160;
    },
    switchStructureCheck: switchStructureCheck,
  }),
  X = (function () {
    function CollectionSchema(m) {
      var R = this;
      (this.$changes = new C(this)),
        (this.$items = new Map()),
        (this.$indexes = new Map()),
        (this.$refId = 0),
        m &&
          m.forEach(function (m) {
            return R.add(m);
          });
    }
    return (
      (CollectionSchema.prototype.onAdd = function (R, C) {
        return (
          void 0 === C && (C = !0),
          addCallback(
            this.$callbacks || (this.$callbacks = []),
            m.OPERATION.ADD,
            R,
            C ? this.$items : void 0
          )
        );
      }),
      (CollectionSchema.prototype.onRemove = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.DELETE,
          R
        );
      }),
      (CollectionSchema.prototype.onChange = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.REPLACE,
          R
        );
      }),
      (CollectionSchema.is = function (m) {
        return void 0 !== m.collection;
      }),
      (CollectionSchema.prototype.add = function (m) {
        var R = this.$refId++;
        return (
          void 0 !== m.$changes &&
            m.$changes.setParent(this, this.$changes.root, R),
          (this.$changes.indexes[R] = R),
          this.$indexes.set(R, R),
          this.$items.set(R, m),
          this.$changes.change(R),
          R
        );
      }),
      (CollectionSchema.prototype.at = function (m) {
        var R = Array.from(this.$items.keys())[m];
        return this.$items.get(R);
      }),
      (CollectionSchema.prototype.entries = function () {
        return this.$items.entries();
      }),
      (CollectionSchema.prototype.delete = function (m) {
        for (var R, C, T = this.$items.entries(); (C = T.next()) && !C.done; )
          if (m === C.value[1]) {
            R = C.value[0];
            break;
          }
        return (
          void 0 !== R &&
          (this.$changes.delete(R),
          this.$indexes.delete(R),
          this.$items.delete(R))
        );
      }),
      (CollectionSchema.prototype.clear = function (R) {
        this.$changes.discard(!0, !0),
          (this.$changes.indexes = {}),
          this.$indexes.clear(),
          R && removeChildRefs.call(this, R),
          this.$items.clear(),
          this.$changes.operation({
            index: 0,
            op: m.OPERATION.CLEAR,
          }),
          this.$changes.touchParents();
      }),
      (CollectionSchema.prototype.has = function (m) {
        return Array.from(this.$items.values()).some(function (R) {
          return R === m;
        });
      }),
      (CollectionSchema.prototype.forEach = function (m) {
        var R = this;
        this.$items.forEach(function (C, T, L) {
          return m(C, T, R);
        });
      }),
      (CollectionSchema.prototype.values = function () {
        return this.$items.values();
      }),
      Object.defineProperty(CollectionSchema.prototype, "size", {
        get: function () {
          return this.$items.size;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (CollectionSchema.prototype.setIndex = function (m, R) {
        this.$indexes.set(m, R);
      }),
      (CollectionSchema.prototype.getIndex = function (m) {
        return this.$indexes.get(m);
      }),
      (CollectionSchema.prototype.getByIndex = function (m) {
        return this.$items.get(this.$indexes.get(m));
      }),
      (CollectionSchema.prototype.deleteByIndex = function (m) {
        var R = this.$indexes.get(m);
        this.$items.delete(R), this.$indexes.delete(m);
      }),
      (CollectionSchema.prototype.toArray = function () {
        return Array.from(this.$items.values());
      }),
      (CollectionSchema.prototype.toJSON = function () {
        var m = [];
        return (
          this.forEach(function (R, C) {
            m.push("function" == typeof R.toJSON ? R.toJSON() : R);
          }),
          m
        );
      }),
      (CollectionSchema.prototype.clone = function (m) {
        var R;
        return (
          m
            ? (R = Object.assign(new CollectionSchema(), this))
            : ((R = new CollectionSchema()),
              this.forEach(function (m) {
                m.$changes ? R.add(m.clone()) : R.add(m);
              })),
          R
        );
      }),
      CollectionSchema
    );
  })(),
  Q = (function () {
    function SetSchema(m) {
      var R = this;
      (this.$changes = new C(this)),
        (this.$items = new Map()),
        (this.$indexes = new Map()),
        (this.$refId = 0),
        m &&
          m.forEach(function (m) {
            return R.add(m);
          });
    }
    return (
      (SetSchema.prototype.onAdd = function (R, C) {
        return (
          void 0 === C && (C = !0),
          addCallback(
            this.$callbacks || (this.$callbacks = []),
            m.OPERATION.ADD,
            R,
            C ? this.$items : void 0
          )
        );
      }),
      (SetSchema.prototype.onRemove = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.DELETE,
          R
        );
      }),
      (SetSchema.prototype.onChange = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.REPLACE,
          R
        );
      }),
      (SetSchema.is = function (m) {
        return void 0 !== m.set;
      }),
      (SetSchema.prototype.add = function (R) {
        if (this.has(R)) return !1;
        var C,
          T,
          L = this.$refId++;
        void 0 !== R.$changes &&
          R.$changes.setParent(this, this.$changes.root, L);
        var U =
          null !==
            (T =
              null === (C = this.$changes.indexes[L]) || void 0 === C
                ? void 0
                : C.op) && void 0 !== T
            ? T
            : m.OPERATION.ADD;
        return (
          (this.$changes.indexes[L] = L),
          this.$indexes.set(L, L),
          this.$items.set(L, R),
          this.$changes.change(L, U),
          L
        );
      }),
      (SetSchema.prototype.entries = function () {
        return this.$items.entries();
      }),
      (SetSchema.prototype.delete = function (m) {
        for (var R, C, T = this.$items.entries(); (C = T.next()) && !C.done; )
          if (m === C.value[1]) {
            R = C.value[0];
            break;
          }
        return (
          void 0 !== R &&
          (this.$changes.delete(R),
          this.$indexes.delete(R),
          this.$items.delete(R))
        );
      }),
      (SetSchema.prototype.clear = function (R) {
        this.$changes.discard(!0, !0),
          (this.$changes.indexes = {}),
          this.$indexes.clear(),
          R && removeChildRefs.call(this, R),
          this.$items.clear(),
          this.$changes.operation({
            index: 0,
            op: m.OPERATION.CLEAR,
          }),
          this.$changes.touchParents();
      }),
      (SetSchema.prototype.has = function (m) {
        for (
          var R, C = this.$items.values(), T = !1;
          (R = C.next()) && !R.done;

        )
          if (m === R.value) {
            T = !0;
            break;
          }
        return T;
      }),
      (SetSchema.prototype.forEach = function (m) {
        var R = this;
        this.$items.forEach(function (C, T, L) {
          return m(C, T, R);
        });
      }),
      (SetSchema.prototype.values = function () {
        return this.$items.values();
      }),
      Object.defineProperty(SetSchema.prototype, "size", {
        get: function () {
          return this.$items.size;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (SetSchema.prototype.setIndex = function (m, R) {
        this.$indexes.set(m, R);
      }),
      (SetSchema.prototype.getIndex = function (m) {
        return this.$indexes.get(m);
      }),
      (SetSchema.prototype.getByIndex = function (m) {
        return this.$items.get(this.$indexes.get(m));
      }),
      (SetSchema.prototype.deleteByIndex = function (m) {
        var R = this.$indexes.get(m);
        this.$items.delete(R), this.$indexes.delete(m);
      }),
      (SetSchema.prototype.toArray = function () {
        return Array.from(this.$items.values());
      }),
      (SetSchema.prototype.toJSON = function () {
        var m = [];
        return (
          this.forEach(function (R, C) {
            m.push("function" == typeof R.toJSON ? R.toJSON() : R);
          }),
          m
        );
      }),
      (SetSchema.prototype.clone = function (m) {
        var R;
        return (
          m
            ? (R = Object.assign(new SetSchema(), this))
            : ((R = new SetSchema()),
              this.forEach(function (m) {
                m.$changes ? R.add(m.clone()) : R.add(m);
              })),
          R
        );
      }),
      SetSchema
    );
  })(),
  ee = (function () {
    function ClientState() {
      (this.refIds = new WeakSet()), (this.containerIndexes = new WeakMap());
    }
    return (
      (ClientState.prototype.addRefId = function (m) {
        this.refIds.has(m) ||
          (this.refIds.add(m), this.containerIndexes.set(m, new Set()));
      }),
      (ClientState.get = function (m) {
        return (
          void 0 === m.$filterState && (m.$filterState = new ClientState()),
          m.$filterState
        );
      }),
      ClientState
    );
  })(),
  et = (function () {
    function ReferenceTracker() {
      (this.refs = new Map()),
        (this.refCounts = {}),
        (this.deletedRefs = new Set()),
        (this.nextUniqueId = 0);
    }
    return (
      (ReferenceTracker.prototype.getNextUniqueId = function () {
        return this.nextUniqueId++;
      }),
      (ReferenceTracker.prototype.addRef = function (m, R, C) {
        void 0 === C && (C = !0),
          this.refs.set(m, R),
          C && (this.refCounts[m] = (this.refCounts[m] || 0) + 1);
      }),
      (ReferenceTracker.prototype.removeRef = function (m) {
        (this.refCounts[m] = this.refCounts[m] - 1), this.deletedRefs.add(m);
      }),
      (ReferenceTracker.prototype.clearRefs = function () {
        this.refs.clear(), this.deletedRefs.clear(), (this.refCounts = {});
      }),
      (ReferenceTracker.prototype.garbageCollectDeletedRefs = function () {
        var m = this;
        this.deletedRefs.forEach(function (R) {
          if (!(m.refCounts[R] > 0)) {
            var C = m.refs.get(R);
            if (C instanceof en)
              for (var T in C._definition.schema)
                "string" != typeof C._definition.schema[T] &&
                  C[T] &&
                  C[T].$changes &&
                  m.removeRef(C[T].$changes.refId);
            else {
              var L = C.$changes.parent._definition;
              "function" ==
                typeof Object.values(
                  L.schema[L.fieldsByIndex[C.$changes.parentIndex]]
                )[0] &&
                Array.from(C.values()).forEach(function (R) {
                  return m.removeRef(R.$changes.refId);
                });
            }
            m.refs.delete(R), delete m.refCounts[R];
          }
        }),
          this.deletedRefs.clear();
      }),
      ReferenceTracker
    );
  })(),
  er = (function (m) {
    function EncodeSchemaError() {
      return (null !== m && m.apply(this, arguments)) || this;
    }
    return __extends(EncodeSchemaError, m), EncodeSchemaError;
  })(Error);
function assertInstanceType(m, R, C, T) {
  if (!(m instanceof R))
    throw new er(
      "a '"
        .concat(R.name, "' was expected, but '")
        .concat(m.constructor.name, "' was provided in ")
        .concat(C.constructor.name, "#")
        .concat(T)
    );
}
var en = (function () {
    function Schema() {
      for (var m = [], R = 0; R < arguments.length; R++) m[R] = arguments[R];
      Object.defineProperties(this, {
        $changes: {
          value: new C(this, void 0, new et()),
          enumerable: !1,
          writable: !0,
        },
        $callbacks: {
          value: void 0,
          enumerable: !1,
          writable: !0,
        },
      });
      var T = this._definition.descriptors;
      T && Object.defineProperties(this, T), m[0] && this.assign(m[0]);
    }
    return (
      (Schema.onError = function (m) {
        console.error(m);
      }),
      (Schema.is = function (m) {
        return m._definition && void 0 !== m._definition.schema;
      }),
      (Schema.prototype.onChange = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.REPLACE,
          R
        );
      }),
      (Schema.prototype.onRemove = function (R) {
        return addCallback(
          this.$callbacks || (this.$callbacks = []),
          m.OPERATION.DELETE,
          R
        );
      }),
      (Schema.prototype.assign = function (m) {
        return Object.assign(this, m), this;
      }),
      Object.defineProperty(Schema.prototype, "_definition", {
        get: function () {
          return this.constructor._definition;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (Schema.prototype.setDirty = function (m, R) {
        this.$changes.change(m, R);
      }),
      (Schema.prototype.listen = function (m, R, C) {
        var T = this;
        return (
          void 0 === C && (C = !0),
          this.$callbacks || (this.$callbacks = {}),
          this.$callbacks[m] || (this.$callbacks[m] = []),
          this.$callbacks[m].push(R),
          C && void 0 !== this[m] && R(this[m], void 0),
          function () {
            return spliceOne(T.$callbacks[m], T.$callbacks[m].indexOf(R));
          }
        );
      }),
      (Schema.prototype.decode = function (R, C, $) {
        void 0 === C &&
          (C = {
            offset: 0,
          }),
          void 0 === $ && ($ = this);
        var B,
          V = [],
          H = this.$changes.root,
          G = R.length,
          q = 0;
        for (H.refs.set(q, this); C.offset < G; ) {
          var W,
            Z = R[C.offset++];
          if (255 == Z) {
            q = number(R, C);
            var Y = H.refs.get(q);
            if (!Y) throw Error('"refId" not found: '.concat(q));
            $ = Y;
            continue;
          }
          var K = $.$changes,
            ee = void 0 !== $._definition,
            et = ee ? (Z >> 6) << 6 : Z;
          if (et === m.OPERATION.CLEAR) {
            $.clear(V);
            continue;
          }
          var er = ee ? Z % (et || 255) : number(R, C),
            en = ee ? $._definition.fieldsByIndex[er] : "",
            eo = K.getType(er),
            ei = void 0,
            ea = void 0,
            es = void 0;
          if (
            (ee
              ? (ea = $["_".concat(en)])
              : ((ea = $.getByIndex(er)),
                (et & m.OPERATION.ADD) === m.OPERATION.ADD
                  ? ((es = $ instanceof L ? string(R, C) : er),
                    $.setIndex(er, es))
                  : (es = $.getIndex(er))),
            (et & m.OPERATION.DELETE) === m.OPERATION.DELETE &&
              (et !== m.OPERATION.DELETE_AND_ADD && $.deleteByIndex(er),
              ea && ea.$changes && H.removeRef(ea.$changes.refId),
              (ei = null)),
            void 0 === en)
          ) {
            console.warn("@colyseus/schema: definition mismatch");
            for (
              var el = {
                offset: C.offset,
              };
              C.offset < G &&
              !(
                switchStructureCheck(R, C) &&
                ((el.offset = C.offset + 1), H.refs.has(number(R, el)))
              );

            )
              C.offset++;
            continue;
          }
          if (et === m.OPERATION.DELETE);
          else if (Schema.is(eo)) {
            var eu = number(R, C);
            if (((ei = H.refs.get(eu)), et !== m.OPERATION.REPLACE)) {
              var ec = this.getSchemaType(R, C, eo);
              !ei &&
                (((ei = this.createTypeInstance(ec)).$changes.refId = eu),
                ea &&
                  ((ei.$callbacks = ea.$callbacks),
                  ea.$changes.refId &&
                    eu !== ea.$changes.refId &&
                    H.removeRef(ea.$changes.refId))),
                H.addRef(eu, ei, ei !== ea);
            }
          } else if ("string" == typeof eo) (W = C), (ei = J[eo](R, W));
          else {
            var ed = U[Object.keys(eo)[0]],
              ef = number(R, C),
              ep = H.refs.has(ef)
                ? ea || H.refs.get(ef)
                : new ed.constructor();
            if (
              (((ei = ep.clone(!0)).$changes.refId = ef),
              ea &&
                ((ei.$callbacks = ea.$callbacks),
                ea.$changes.refId && ef !== ea.$changes.refId))
            ) {
              H.removeRef(ea.$changes.refId);
              for (
                var eh = ea.entries(), eg = void 0;
                (eg = eh.next()) && !eg.done;

              ) {
                var em = (B = eg.value)[0],
                  ey = B[1];
                V.push({
                  refId: ef,
                  op: m.OPERATION.DELETE,
                  field: em,
                  value: void 0,
                  previousValue: ey,
                });
              }
            }
            H.addRef(ef, ei, ep !== ea);
          }
          if (null != ei) {
            if (
              (ei.$changes && ei.$changes.setParent(K.ref, K.root, er),
              $ instanceof Schema)
            )
              $[en] = ei;
            else if ($ instanceof L) {
              var em = es;
              $.$items.set(em, ei), $.$changes.allChanges.add(er);
            } else if ($ instanceof T) $.setAt(er, ei);
            else if ($ instanceof X) {
              var ev = $.add(ei);
              $.setIndex(er, ev);
            } else if ($ instanceof Q) {
              var ev = $.add(ei);
              !1 !== ev && $.setIndex(er, ev);
            }
          }
          ea !== ei &&
            V.push({
              refId: q,
              op: et,
              field: en,
              dynamicIndex: es,
              value: ei,
              previousValue: ea,
            });
        }
        return this._triggerChanges(V), H.garbageCollectDeletedRefs(), V;
      }),
      (Schema.prototype.encode = function (R, C, T) {
        void 0 === R && (R = !1),
          void 0 === C && (C = []),
          void 0 === T && (T = !1);
        for (
          var $ = this.$changes, B = new WeakSet(), V = [$], H = 1, G = 0;
          G < H;
          G++
        ) {
          var q = V[G],
            Z = q.ref,
            Y = Z instanceof Schema;
          q.ensureRefId(),
            B.add(q),
            q !== $ &&
              (q.changed || R) &&
              (uint8$1(C, 255), number$1(C, q.refId));
          for (
            var K = R
                ? Array.from(q.allChanges)
                : Array.from(q.changes.values()),
              J = 0,
              X = K.length;
            J < X;
            J++
          ) {
            var Q = R
                ? {
                    op: m.OPERATION.ADD,
                    index: K[J],
                  }
                : K[J],
              ee = Q.index,
              et = Y
                ? Z._definition.fieldsByIndex &&
                  Z._definition.fieldsByIndex[ee]
                : ee,
              en = C.length;
            if (Q.op !== m.OPERATION.TOUCH) {
              if (Y) uint8$1(C, ee | Q.op);
              else {
                if ((uint8$1(C, Q.op), Q.op === m.OPERATION.CLEAR)) continue;
                number$1(C, ee);
              }
            }
            if (
              (!Y &&
                (Q.op & m.OPERATION.ADD) == m.OPERATION.ADD &&
                Z instanceof L &&
                string$1(C, q.ref.$indexes.get(ee)),
              Q.op !== m.OPERATION.DELETE)
            ) {
              var eo = q.getType(ee),
                ei = q.getValue(ee);
              if (
                (ei &&
                  ei.$changes &&
                  !B.has(ei.$changes) &&
                  (V.push(ei.$changes), ei.$changes.ensureRefId(), H++),
                Q.op !== m.OPERATION.TOUCH)
              ) {
                if (Schema.is(eo))
                  assertInstanceType(ei, eo, Z, et),
                    number$1(C, ei.$changes.refId),
                    (Q.op & m.OPERATION.ADD) === m.OPERATION.ADD &&
                      this.tryEncodeTypeId(C, eo, ei.constructor);
                else if ("string" == typeof eo)
                  !(function (m, R, C, T, L) {
                    !(function (m, R, C, T) {
                      var L,
                        U = !1;
                      switch (R) {
                        case "number":
                        case "int8":
                        case "uint8":
                        case "int16":
                        case "uint16":
                        case "int32":
                        case "uint32":
                        case "int64":
                        case "uint64":
                        case "float32":
                        case "float64":
                          (L = "number"),
                            isNaN(m) &&
                              console.log(
                                'trying to encode "NaN" in '
                                  .concat(C.constructor.name, "#")
                                  .concat(T)
                              );
                          break;
                        case "string":
                          (L = "string"), (U = !0);
                          break;
                        case "boolean":
                          return;
                      }
                      if (typeof m !== L && (!U || (U && null !== m))) {
                        var $ = "'"
                          .concat(JSON.stringify(m), "'")
                          .concat(
                            (m &&
                              m.constructor &&
                              " (".concat(m.constructor.name, ")")) ||
                              ""
                          );
                        throw new er(
                          "a '"
                            .concat(L, "' was expected, but ")
                            .concat($, " was provided in ")
                            .concat(C.constructor.name, "#")
                            .concat(T)
                        );
                      }
                    })(C, m, T, L);
                    var U = W[m];
                    if (U) U(R, C);
                    else
                      throw new er(
                        "a '"
                          .concat(m, "' was expected, but ")
                          .concat(C, " was provided in ")
                          .concat(T.constructor.name, "#")
                          .concat(L)
                      );
                  })(eo, C, ei, Z, et);
                else {
                  var ea = U[Object.keys(eo)[0]];
                  assertInstanceType(
                    Z["_".concat(et)],
                    ea.constructor,
                    Z,
                    et
                  ),
                    number$1(C, ei.$changes.refId);
                }
                T && q.cache(ee, C.slice(en));
              }
            }
          }
          R || T || q.discard();
        }
        return C;
      }),
      (Schema.prototype.encodeAll = function (m) {
        return this.encode(!0, [], m);
      }),
      (Schema.prototype.applyFilters = function (R, C) {
        void 0 === C && (C = !1);
        for (
          var T,
            U,
            $ = this,
            B = new Set(),
            V = ee.get(R),
            H = [this.$changes],
            G = 1,
            q = [],
            Z = 0;
          Z < G;
          Z++
        )
          !(function (Z) {
            var Y = H[Z];
            if (!B.has(Y.refId)) {
              var K = Y.ref,
                J = K instanceof Schema;
              uint8$1(q, 255), number$1(q, Y.refId);
              var X = V.refIds.has(Y),
                Q = C || !X;
              V.addRefId(Y);
              var ee = V.containerIndexes.get(Y),
                et = Q
                  ? Array.from(Y.allChanges)
                  : Array.from(Y.changes.values());
              !C &&
                J &&
                K._definition.indexesWithFilters &&
                K._definition.indexesWithFilters.forEach(function (R) {
                  !ee.has(R) &&
                    Y.allChanges.has(R) &&
                    (Q
                      ? et.push(R)
                      : et.push({
                          op: m.OPERATION.ADD,
                          index: R,
                        }));
                });
              for (var er = 0, en = et.length; er < en; er++) {
                var eo = Q
                  ? {
                      op: m.OPERATION.ADD,
                      index: et[er],
                    }
                  : et[er];
                if (eo.op === m.OPERATION.CLEAR) {
                  uint8$1(q, eo.op);
                  continue;
                }
                var ei = eo.index;
                if (eo.op === m.OPERATION.DELETE) {
                  J
                    ? uint8$1(q, eo.op | ei)
                    : (uint8$1(q, eo.op), number$1(q, ei));
                  continue;
                }
                var ea = Y.getValue(ei),
                  es = Y.getType(ei);
                if (J) {
                  var el = K._definition.filters && K._definition.filters[ei];
                  if (el && !el.call(K, R, ea, $)) {
                    ea && ea.$changes && B.add(ea.$changes.refId);
                    continue;
                  }
                } else {
                  var eu = Y.parent,
                    el = Y.getChildrenFilter();
                  if (el && !el.call(eu, R, K.$indexes.get(ei), ea, $)) {
                    ea && ea.$changes && B.add(ea.$changes.refId);
                    continue;
                  }
                }
                if (
                  (ea.$changes && (H.push(ea.$changes), G++),
                  eo.op !== m.OPERATION.TOUCH)
                ) {
                  if (eo.op === m.OPERATION.ADD || J)
                    q.push.apply(
                      q,
                      null !== (T = Y.caches[ei]) && void 0 !== T ? T : []
                    ),
                      ee.add(ei);
                  else if (ee.has(ei))
                    q.push.apply(
                      q,
                      null !== (U = Y.caches[ei]) && void 0 !== U ? U : []
                    );
                  else {
                    if (
                      (ee.add(ei),
                      uint8$1(q, m.OPERATION.ADD),
                      number$1(q, ei),
                      K instanceof L)
                    ) {
                      var ec = Y.ref.$indexes.get(ei);
                      string$1(q, ec);
                    }
                    ea.$changes
                      ? number$1(q, ea.$changes.refId)
                      : W[es](q, ea);
                  }
                } else if (ea.$changes && !J) {
                  if (
                    (uint8$1(q, m.OPERATION.ADD),
                    number$1(q, ei),
                    K instanceof L)
                  ) {
                    var ec = Y.ref.$indexes.get(ei);
                    string$1(q, ec);
                  }
                  number$1(q, ea.$changes.refId);
                }
              }
            }
          })(Z);
        return q;
      }),
      (Schema.prototype.clone = function () {
        var m,
          R = new this.constructor(),
          C = this._definition.schema;
        for (var T in C)
          "object" == typeof this[T] &&
          "function" ==
            typeof (null === (m = this[T]) || void 0 === m ? void 0 : m.clone)
            ? (R[T] = this[T].clone())
            : (R[T] = this[T]);
        return R;
      }),
      (Schema.prototype.toJSON = function () {
        var m = this._definition.schema,
          R = this._definition.deprecated,
          C = {};
        for (var T in m)
          R[T] ||
            null === this[T] ||
            void 0 === this[T] ||
            (C[T] =
              "function" == typeof this[T].toJSON
                ? this[T].toJSON()
                : this["_".concat(T)]);
        return C;
      }),
      (Schema.prototype.discardAllChanges = function () {
        this.$changes.discardAll();
      }),
      (Schema.prototype.getByIndex = function (m) {
        return this[this._definition.fieldsByIndex[m]];
      }),
      (Schema.prototype.deleteByIndex = function (m) {
        this[this._definition.fieldsByIndex[m]] = void 0;
      }),
      (Schema.prototype.tryEncodeTypeId = function (m, R, C) {
        R._typeid !== C._typeid && (uint8$1(m, 213), number$1(m, C._typeid));
      }),
      (Schema.prototype.getSchemaType = function (m, R, C) {
        var T;
        return (
          213 === m[R.offset] &&
            (R.offset++, (T = this.constructor._context.get(number(m, R)))),
          T || C
        );
      }),
      (Schema.prototype.createTypeInstance = function (m) {
        var R = new m();
        return (R.$changes.root = this.$changes.root), R;
      }),
      (Schema.prototype._triggerChanges = function (R) {
        for (
          var C,
            T,
            L,
            U,
            $,
            B,
            V,
            H,
            G,
            q = new Set(),
            W = this.$changes.root.refs,
            Z = 0;
          Z < R.length;
          Z++
        )
          !(function (Z) {
            var Y = R[Z],
              K = Y.refId,
              J = W.get(K),
              X = J.$callbacks;
            if (
              ((Y.op & m.OPERATION.DELETE) === m.OPERATION.DELETE &&
                Y.previousValue instanceof Schema &&
                (null ===
                  (T =
                    null === (C = Y.previousValue.$callbacks) || void 0 === C
                      ? void 0
                      : C[m.OPERATION.DELETE]) ||
                  void 0 === T ||
                  T.forEach(function (m) {
                    return m();
                  })),
              X)
            ) {
              if (J instanceof Schema) {
                if (!q.has(K))
                  try {
                    null ===
                      (L = null == X ? void 0 : X[m.OPERATION.REPLACE]) ||
                      void 0 === L ||
                      L.forEach(function (m) {
                        return m(R);
                      });
                  } catch (m) {
                    Schema.onError(m);
                  }
                try {
                  X.hasOwnProperty(Y.field) &&
                    (null === (U = X[Y.field]) ||
                      void 0 === U ||
                      U.forEach(function (m) {
                        return m(Y.value, Y.previousValue);
                      }));
                } catch (m) {
                  Schema.onError(m);
                }
              } else
                Y.op === m.OPERATION.ADD && void 0 === Y.previousValue
                  ? null === ($ = X[m.OPERATION.ADD]) ||
                    void 0 === $ ||
                    $.forEach(function (m) {
                      var R;
                      return m(
                        Y.value,
                        null !== (R = Y.dynamicIndex) && void 0 !== R
                          ? R
                          : Y.field
                      );
                    })
                  : Y.op === m.OPERATION.DELETE
                  ? void 0 !== Y.previousValue &&
                    (null === (B = X[m.OPERATION.DELETE]) ||
                      void 0 === B ||
                      B.forEach(function (m) {
                        var R;
                        return m(
                          Y.previousValue,
                          null !== (R = Y.dynamicIndex) && void 0 !== R
                            ? R
                            : Y.field
                        );
                      }))
                  : Y.op === m.OPERATION.DELETE_AND_ADD &&
                    (void 0 !== Y.previousValue &&
                      (null === (V = X[m.OPERATION.DELETE]) ||
                        void 0 === V ||
                        V.forEach(function (m) {
                          var R;
                          return m(
                            Y.previousValue,
                            null !== (R = Y.dynamicIndex) && void 0 !== R
                              ? R
                              : Y.field
                          );
                        })),
                    null === (H = X[m.OPERATION.ADD]) ||
                      void 0 === H ||
                      H.forEach(function (m) {
                        var R;
                        return m(
                          Y.value,
                          null !== (R = Y.dynamicIndex) && void 0 !== R
                            ? R
                            : Y.field
                        );
                      })),
                  Y.value !== Y.previousValue &&
                    (null === (G = X[m.OPERATION.REPLACE]) ||
                      void 0 === G ||
                      G.forEach(function (m) {
                        var R;
                        return m(
                          Y.value,
                          null !== (R = Y.dynamicIndex) && void 0 !== R
                            ? R
                            : Y.field
                        );
                      }));
              q.add(K);
            }
          })(Z);
      }),
      (Schema._definition = $.create()),
      Schema
    );
  })(),
  eo = {
    context: new B(),
  },
  ei = (function (m) {
    function ReflectionField() {
      return (null !== m && m.apply(this, arguments)) || this;
    }
    return (
      __extends(ReflectionField, m),
      __decorate(
        [type("string", eo)],
        ReflectionField.prototype,
        "name",
        void 0
      ),
      __decorate(
        [type("string", eo)],
        ReflectionField.prototype,
        "type",
        void 0
      ),
      __decorate(
        [type("number", eo)],
        ReflectionField.prototype,
        "referencedType",
        void 0
      ),
      ReflectionField
    );
  })(en),
  ea = (function (m) {
    function ReflectionType() {
      var R = (null !== m && m.apply(this, arguments)) || this;
      return (R.fields = new T()), R;
    }
    return (
      __extends(ReflectionType, m),
      __decorate(
        [type("number", eo)],
        ReflectionType.prototype,
        "id",
        void 0
      ),
      __decorate(
        [type([ei], eo)],
        ReflectionType.prototype,
        "fields",
        void 0
      ),
      ReflectionType
    );
  })(en),
  es = (function (m) {
    function Reflection() {
      var R = (null !== m && m.apply(this, arguments)) || this;
      return (R.types = new T()), R;
    }
    return (
      __extends(Reflection, m),
      (Reflection.encode = function (m) {
        var R = m.constructor,
          C = new Reflection();
        C.rootType = R._typeid;
        var T = R._context.types;
        for (var L in T) {
          var U = new ea();
          (U.id = Number(L)),
            (function (m, R) {
              for (var T in R) {
                var L = new ei();
                L.name = T;
                var U = void 0;
                if ("string" == typeof R[T]) U = R[T];
                else {
                  var $ = R[T],
                    B = void 0;
                  en.is($)
                    ? ((U = "ref"), (B = R[T]))
                    : ((U = Object.keys($)[0]),
                      "string" == typeof $[U]
                        ? (U += ":" + $[U])
                        : (B = $[U])),
                    (L.referencedType = B ? B._typeid : -1);
                }
                (L.type = U), m.fields.push(L);
              }
              C.types.push(m);
            })(U, T[L]._definition.schema);
        }
        return C.encodeAll();
      }),
      (Reflection.decode = function (m, R) {
        var C = new B(),
          T = new Reflection();
        T.decode(m, R);
        var L = T.types.reduce(function (m, R) {
          var T = (function (m) {
              function _() {
                return (null !== m && m.apply(this, arguments)) || this;
              }
              return __extends(_, m), _;
            })(en),
            L = R.id;
          return (m[L] = T), C.add(T, L), m;
        }, {});
        T.types.forEach(function (m) {
          var R = L[m.id];
          m.fields.forEach(function (m) {
            var T;
            if (void 0 !== m.referencedType) {
              var U = m.type,
                $ = L[m.referencedType];
              if (!$) {
                var B = m.type.split(":");
                (U = B[0]), ($ = B[1]);
              }
              "ref" === U
                ? type($, {
                    context: C,
                  })(R.prototype, m.name)
                : type((((T = {})[U] = $), T), {
                    context: C,
                  })(R.prototype, m.name);
            } else
              type(m.type, {
                context: C,
              })(R.prototype, m.name);
          });
        });
        var $ = L[T.rootType],
          V = new $();
        for (var H in $._definition.schema) {
          var G = $._definition.schema[H];
          "string" != typeof G &&
            (V[H] =
              "function" == typeof G
                ? new G()
                : new U[Object.keys(G)[0]].constructor());
        }
        return V;
      }),
      __decorate([type([ea], eo)], Reflection.prototype, "types", void 0),
      __decorate(
        [type("number", eo)],
        Reflection.prototype,
        "rootType",
        void 0
      ),
      Reflection
    );
  })(en);
(U.map = {
  constructor: L,
}),
  (U.array = {
    constructor: T,
  }),
  (U.set = {
    constructor: Q,
  }),
  (U.collection = {
    constructor: X,
  }),
  (m.ArraySchema = T),
  (m.CollectionSchema = X),
  (m.Context = B),
  (m.MapSchema = L),
  (m.Reflection = es),
  (m.ReflectionField = ei),
  (m.ReflectionType = ea),
  (m.Schema = en),
  (m.SchemaDefinition = $),
  (m.SetSchema = Q),
  (m.decode = J),
  (m.defineTypes = function (m, R, C) {
    for (var T in (void 0 === C && (C = {}),
    C.context || (C.context = m._context || C.context || V),
    R))
      type(R[T], C)(m.prototype, T);
    return m;
  }),
  (m.deprecated = function (m) {
    return (
      void 0 === m && (m = !0),
      function (R, C) {
        var T = R.constructor._definition;
        (T.deprecated[C] = !0),
          m &&
            (T.descriptors[C] = {
              get: function () {
                throw Error("".concat(C, " is deprecated."));
              },
              set: function (m) {},
              enumerable: !1,
              configurable: !0,
            });
      }
    );
  }),
  (m.dumpChanges = function (m) {
    for (var R = [m.$changes], C = {}, T = 0; T < 1; T++)
      !(function (m) {
        var T = R[m];
        T.changes.forEach(function (m) {
          var R = T.ref,
            L = m.index;
          C[
            R._definition ? R._definition.fieldsByIndex[L] : R.$indexes.get(L)
          ] = T.getValue(L);
        });
      })(T);
    return C;
  }),
  (m.encode = W),
  (m.filter = function (m) {
    return function (R, C) {
      var T = R.constructor;
      T._definition.addFilter(C, m) && (T._context.useFilters = !0);
    };
  }),
  (m.filterChildren = function (m) {
    return function (R, C) {
      var T = R.constructor;
      T._definition.addChildrenFilter(C, m) && (T._context.useFilters = !0);
    };
  }),
  (m.hasFilter = function (m) {
    return m._context && m._context.useFilters;
  }),
  (m.registerType = function (m, R) {
    U[m] = R;
  }),
  (m.type = type),
  Object.defineProperty(m, "__esModule", {
    value: !0,
  });
})(R);
const W = R;



  //start

   unsafeWindow._encryptUtils = {

encryptSend(m, R) {
  let C;
  let T = [V.Protocol.ROOM_DATA];
  if (
    ("string" == typeof m ? W.encode.string(T, m) : W.encode.number(T, m),
    void 0 !== R)
  ) {
    let m = $.encode(R);
    (C = new Uint8Array(T.length + m.byteLength)).set(new Uint8Array(T), 0),
      C.set(new Uint8Array(m), T.length);
  } else C = new Uint8Array(T);
  return C.buffer;
},
encryptSendBytes(m, R) {
  let C;
  let T = [V.Protocol.ROOM_DATA_BYTES];
  "string" == typeof m ? W.encode.string(T, m) : W.encode.number(T, m),
    (C = new Uint8Array(T.length + (R.byteLength || R.length))).set(
      new Uint8Array(T),
      0
    ),
    C.set(new Uint8Array(R), T.length);
    console.log(C.buffer)
    //this.connection.send(C.buffer);
}
};
const config = {
     spacepackEverywhere: {
    enabled: true, // Automatically detect webpack objects and inject them with spacepack (Default: true)
    ignoreSites: [], // Don't inject spacepack on matching sites (Default: [])

    // Don't inject spacepack on matching webpack objects (Default: [])
    ignoreChunkObjects: [
      "webpackChunkruffle_extension", // https://ruffle.rs/
    ],
  },
     siteConfigs: []
};

unsafeWindow.__webpackTools_config = config;


  // Create floating control panel
  const panel = document.createElement('div');
  //panel.id = 'floating-panel';
  panel.innerHTML = `
  <style>
   .border-title {
   border-radius:8px;
   border: 2px dashed #000;
   padding: 15px 10px;
   }

   #floating-panel legend {
     font-size: 17px;
     font-weight: bold;
     width: auto;
   }

   .fs20 {
     font-size: 20px;
   }
      #floating-panel button {
     border-radius: 5px;
     outline: none !important;
     box-sizing: border-box;
     font-weight: 500px;
     padding: 6px 12px !important;
  }
  #floating-panel .common-button {
  display: block;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 15px;
  }


/* 移除表格默认的边框 */
  #floating-panel .main-button {
     border-radius: 5px;
     outline: none !important;
     box-sizing: border-box;
     font-weight: bold;
     border: 1px solid rgb(177, 181, 247) !important;
     padding: 6px 12px !important;
      background-color:rgb(239, 240, 253);;
      color: #626aef;
  }
  #floating-panel input{
   border: 1px solid #dcdfe6;
   border-radius: 5px;
   height: 40px !important;
  outline: none !important;
  width: 225px;
  font-size: 11px !important;

  }

      #floating-panel select{
   border: 1px solid #dcdfe6;
   border-radius: 5px;
   height: 40px !important;
  outline: none !important;
  width: 225px;
  font-size: 11px !important;

  }

  .flex-center {
  display: flex;
justify-content: center;
  }

  .flex-center > * {
/* 这里可以定义子元素的样式 */
margin-right: 20px; /* 可以给子元素添加一些水平间距 */
}


  .mt6 {
   margin-top: 6px;
  }

  .mt15 {
   margin-top: 15px;
  }

  .mt30 {
   margin-top: 30px;
  }

  .flex-sb {
display: flex;
justify-content: space-between; /* 或其他值 */
}

  .flex-sa {
display: flex;
justify-content: space-around; /* 或其他值 */
}

.flex-sb > * {
/* 这里可以定义子元素的样式 */
margin-right: 20px; /* 可以给子元素添加一些水平间距 */
}

.flex-sb > *:first-child {
/* 覆盖第一个子元素的右边距 */
margin-left: 0;
}

.flex-sb > *:last-child {
/* 覆盖最后一个子元素的右边距 */
margin-right: 0;
}

table, th, td {

  border: none;
  border-collapse: collapse; /* 合并边框 */
  background-color: #fff;

}



/* 设置表头样式 */

thead th {
  border: none;

  /* background-color: #f0f0f0; 你可以选择一个适合你背景的颜色   */

  padding: 10px; /* 添加内边距使内容更易读 */
    width: 50%;

  /* text-align: center; 设置文本对齐方式   */

}



/* 设置表格内容单元格样式 */

tbody td {

  padding: 10px; /* 添加内边距使内容更易读 */

  /* 可以添加其他样式，比如背景色、字体样式等 */

}



/* 表格的其他样式（如果需要） */

table {

  width: 100%; /* 设置表格宽度为100% */

  margin-top: 0px; /* 添加上边距 */
    border: none;

}

  .main-button.active {
/* 激活状态的样式 */
 outline: none !important;
background-color: #626aef !important;
border: 1px solid #626aef;
color: #fff !important;
}


.flex-grid23 {
display: flex;
box-sizing: border-box;
flex-wrap: wrap; /* 允许容器内的项目换行 */
justify-content: center; /* 水平方向上居中对齐 */
}

.grid-item {
flex: 0 0 32.33%; /* 每个项目占据一行宽度的三分之一 */
    display: flex;
justify-content: center;
padding: 15px 0px; /* 可选：添加内边距 */
padding-bottom: 0;
margin: 0px; /* 可选：添加外边距 */
text-align: center; /* 文本（按钮）居中对齐 */
}

.grid-item button {
/* 如果有需要，可以为按钮添加额外的样式 */
width: 70%; /* 按钮宽度占据宫格的全宽 */
}
</style>
<div style="background-color: #fff; border: 2px dashed #000; padding: 15px; position: fixed; bottom: 20px; left: 20px; z-index: 99999;max-width: 730px" id="floating-panel">
  <div id="panel-content">
    <div id="farming_tab" class="farming_tab" style="display: none;">
    <div style="text-align: center;padding: 0 30px;box-sizing: border-box;">
<span>以往种植信息</span>
  <table>

    <thead>

      <tr>

        <th>地图</th>

        <th>丰收时间</th>

      </tr>

    </thead>

    <tbody>

      <tr>

        <td>1</td>

        <td>22:00</td>

      </tr>

      <tr>

        <td>2</td>

        <td>23:00</td>

      </tr>

      <!-- 添加更多行如果需要 -->

    </tbody>

  </table>
</div>
  <div calss="mt15">
   <label for="textbox1" style="padding: 2px 4px; color: black; font-size: 15px; transition: background-color 0.3s;">种植信息:</label>
  <input type="text" id="auto_farming_info" style="padding: 2px 4px; border: none; color: black; font-size: 15px; pointer-events: none;" value="Original Value 1" readonly><br>
  <label for="item_seed_id" style="margin-bottom: 3px; font-size: 15px;">种子列表:</label>
  <select id="item_seed_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 13px;width:260px;">
    <option value="itm_cottoncandySeed">itm_cottoncandySeed</option>
    <option value="itm_grainseeds">itm_grainseeds</option>
    <option value="itm_grump">itm_grump</option>
    <option value="itm_popberrySeeds">itm_popberrySeeds</option>
    <option value="itm_butterberryseeds">itm_butterberryseeds</option>
    <option value="itm_cloverSeeds">itm_cloverSeeds</option>
    <option value="itm_scarrotSeeds">itm_scarrotSeeds</option>
    <option value="itm_shorelimeSeeds">itm_shorelimeSeeds</option>
    <option value="itm_grumpkinSeeds">itm_grumpkinSeeds</option>
    <option value="itm_muckchuckSeeds">itm_muckchuckSeeds</option>
 
    
  </select>
          <label for="seed_quantity" style="margin-bottom: 3px; font-size: 15px;">数量:</label>
  <input type="text" id="seed_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:250px;">
  </div>
    <div class="flex-center mt15">
<button class="common-button" id="Harvest">丰收</button>
  <button class="common-button" id="wateringInfo">浇水</button>
  <button class="common-button" id="farming">全自动种植</button>
  <button class="common-button" id="auto_farming">托管种植</button>
</div>

 
</div>

<div id="move_tab" class="tab" style="display: none;">
  <div class="flex-grid23">
     <div class="grid-item">
      <button class="common-button" id="move_to_generalStore">商店</button>
     </div>
     <div class="grid-item">
       <button class="common-button" id="move_to_tutorialHouse">烹饪店</button>
     </div>
     <div class="grid-item">
     <button class="common-button" id="move_to_bath">去洗澡</button>
     </div>
     <div class="grid-item">
         <button class="common-button" id="move_to_two_generalStore">商店二楼</button>
     </div>
     <div class="grid-item">
     <button class="common-button" id="move_to_carnival">游乐场</button>
     </div>
     <div class="grid-item">
        <button class="common-button" id="move_to_Storage">去酒吧储物柜</button>
     </div>
  </div>

  <div class="flex-center mt15">
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">指定地图:</label>
  <input type="text" id="other_map_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
  <button class="common-button" id="move_to_other">去指定地图</button>
  </div>
 
</div>



<div id="cooking_tab" class="tab" style="display: none;">
    <div class="mt15">
  <label for="cooking_quantity" style="margin-bottom: 3px; font-size: 15px;">当前烹饪数:</label>
  <input type="text" id="cooking_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:225px">
  <label for="cooking_quantity" style="margin-bottom: 3px; font-size: 15px;">剩余烹饪数:</label>
  <input type="text" id="cooking_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:225px">
  </div>
  <div class="mt15">
      <label for="cooking_quantity" style="margin-bottom: 3px; font-size: 15px;">烹饪数量:</label>
  <input type="text" id="cooking_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:235px">
  <label for="item_cooking_id" style="margin-bottom: 3px; font-size: 15px;">烹饪列表:</label>
  <select id="item_cooking_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:240px">
  <option value="ach_Pancakes">ach_Pancakes</option>
    <option value="ach_Plain_Omelet">ach_Plain_Omelet</option>
    <option value="ach_Popberry_Pie">ach_Popberry_Pie</option>
    <option value="ach_Popberry_Loaf">ach_Popberry_Loaf</option>
    <option value="itm_cloverSeeds">itm_cloverSeeds</option>
    <option value="itm_scarrotSeeds">itm_scarrotSeeds</option>
  </select>
  </div>

  <div class="flex-center mt15">
  <button class="common-button" id="cooking">烹饪</button>
  </div>
</div>

<div id="woodworking_tab" class="tab" style="display: none;">
    <div class="mt15">
   <label for="wooden_quantity" style="margin-bottom: 3px; font-size: 15px;">制木数量:</label>
  <input type="text" id="wooden_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:235px">
  <label for="item_wooden_id" style="margin-bottom: 3px; font-size: 15px;">制木列表:</label>
  <select id="item_wooden_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:250px">
    <option value="ach_Stick">ach_Stick</option>
    <option value="ach_Wooden_Stool">ach_Wooden_Stool</option>
    <option value="itm_popberrySeeds">itm_popberrySeeds</option>
    <option value="itm_butterberryseeds">itm_butterberryseeds</option>
    <option value="itm_cloverSeeds">itm_cloverSeeds</option>
    <option value="itm_scarrotSeeds">itm_scarrotSeeds</option>
  </select>
  </div>

      <div class="flex-center mt15">
   <button class="common-button" id="wooden">制木</button>
  </div>
</div>



<div id="order_tab" class="tab" style="display: none;">
  <div>
   <label for="textbox1" style="padding: 2px 4px; color: black; font-size: 15px; transition: background-color 0.3s;">委托信息:</label>
  <input type="text" id="orderinfo_text" style="padding: 2px 4px; border: none; color: black; font-size: 15px; pointer-events: none;" value="Original Value 1" readonly><br>
  <label for="textbox2" style="padding: 2px 4px; color: black; font-size: 15px; transition: background-color 0.3s;">可提交委托数:</label>
<input type="text" id="ready_order" style="padding: 2px 4px; border: none; color: black; font-size: 15px; pointer-events: none;" value="Original Value 2" readonly ><br>


  <div class="flex-center">
      <button class="common-button" id="check_order">检查委托数量</button>
  <button class="common-button" id="put_order">提交已准备好的委托</button>
  </div>

  </div>

 

  

   


    <fieldset class="border-title mt6">
  <legend>抢购物品</legend>
  <div>
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">购买物品id:</label>
  <select id="buy_item_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width: 300px">
  <option value="itm_popberryFruit">itm_popberryFruit</option>
  <option value="itm_honey">itm_honey</option>
  <option value="itm_milk">itm_milk</option>
  <option value="itm_shorelimeFruit">itm_shorelimeFruit</option>
  <option value="itm_woodlog_01">itm_woodlog_01</option>
  <option value="itm_grainbow">itm_grainbow</option>
  <option value="itm_grumpkinFruit">itm_grumpkinFruit</option>
  <option value="itm_metalore_01">itm_metalore_01</option>
  <option value="itm_tatofruit">itm_tatofruit</option>
  <option value="itm_muckchuck">itm_muckchuck</option>
  <option value="itm_flour">itm_flour</option>
  <option value="itm_Space_Chair">itm_Space_Chair</option>
  </select>
  </div>
  <div >
   <label for="textbox1" style="margin-bottom: 3px; padding: 2px 4px; color: black; font-size: 15px; transition: background-color 0.3s;">物品单价:</label>
  <input type="text" id="item_price" style="margin-bottom: 3px; padding: 2px 4px; border: none;  color: black; font-size: 15px; pointer-events: none;" value="Original Value 1" readonly>
  </div>
  <div >
        <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">购买数量:</label>
  <input type="text" id="buy_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">购买单价:</label>
  <input type="text" id="buy_hope_price" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
  </div>
  <div >
        <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">卖出阈值:</label>
  <input type="text" id="sell_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">卖出单价:</label>
  <input type="text" id="sell_hope_price" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
  </div>
  <div >
   <label for="textbox1" style="margin-bottom: 3px; padding: 2px 4px; color: black; font-size: 15px; transition: background-color 0.3s;">抢购状态:</label>
  <input type="text" id="order_status" style="margin-bottom: 3px; padding: 2px 4px; border: none; color: black; font-size: 15px; pointer-events: none;" value="Original Value 1" readonly>
  </div>

  <div class="flex-center">
      <button class="common-button" id="check_buy_price">查询单价</button>
      <button class="common-button" id="start_buy">开始抢购v1版本</button>
      <button class="common-button" id="start_buyv2">开始抢购v2版本</button>
      <button class="common-button" id="stop_buy">停止抢购</button>
  </div>
  </fieldset>



    <fieldset class="border-title mt15">
  <legend>自动提交委托</legend>
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">金币最大亏损:</label>
  <input type="text" id="max_loss_coin_order" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:200px !important">
  <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">每钻最大亏损:</label>
  <input type="text" id="max_loss_pixel_order" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:200px !important">
  <div class="flex-center mt15">
      <button class="common-button" id="start_order">开始自动提交</button>
  <button class="common-button" id="stop_order">停止自动提交</button>
  </div>

</fieldset>


</div>



<div id="Brewing_tab" class="tab" style="display: none;">
<div class="mt15">
 <label for="textInput" style="margin-bottom: 3px; font-size: 15px;">酿酒数量:</label>
<input type="text" id="Brewing_quantity" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;">
<label for="dropdown" style="margin-bottom: 3px; font-size: 15px;">酿酒品种:</label>
<select id="item_Brewing_id" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:250px !important">
  <option value="ach_popberryWine">ach_popberryWine</option>
  <option value="ach_Wooden_Stool">ach_Wooden_Stool</option>
  <option value="itm_popberrySeeds">itm_popberrySeeds</option>
  <option value="itm_butterberryseeds">itm_butterberryseeds</option>
  <option value="itm_cloverSeeds">itm_cloverSeeds</option>
  <option value="itm_scarrotSeeds">itm_scarrotSeeds</option>
</select>
</div>
<div class="flex-center mt15">
<button class="common-button" id="Brewing">酿酒</button>
</div>
</div>


<div id="mining_tab" class="tab" style="display: none;">
<div class="mt15">
<label for="dropdown" style="margin-bottom: 3px; font-size: 15px;">矿搞选择:</label>
<select id="draft_item" style="margin-bottom: 3px; padding: 2px 4px; font-size: 15px;width:250px !important">
  <option value="itm_pickaxe_01">itm_pickaxe_01</option>
</select>
</div>
<div class="flex-center mt15">
<button class="common-button" id="start_mining">开始脱机挖矿</button>
<button class="common-button" id="stop_mining">停止脱机挖矿</button>
</div>
</div>




<div id="other_tab" class="tab" style="display: none;">
    <div class="flex-grid23">
     <div class="grid-item">
      <button class="common-button" id="Chopping">砍树</button>
     </div>
     <div class="grid-item">
       <button class="common-button" id="get_seed_on_carnival">游乐场领取种子</button>
     </div>
     <div class="grid-item">
     <button class="common-button"id="get_seed_on_PostOfficeInterior">商店领取每日奖励</button>
     </div>
     <div class="grid-item">
         <button class="common-button" id="get_bee">领取成熟蜂蜜</button>
     </div>
     <div class="grid-item">
     <button class="common-button" id="get_mineral">采矿</button>
     </div>
     <div class="grid-item">
        <button class="common-button" id="get_cow">喂牛养牛</button>
     </div>
  </div>

  <div style="text-align: center;padding: 0 30px;box-sizing: border-box;margin-top: 15px;">
<div class="flex-center" style="align-items: center;gap: 20px;">操作信息表<button class="common-button" id="Refresh">刷新</button></div>
  <table>

    <thead>

      <tr>

        <th>类型</th>

        <th>下次操作时间</th>

      </tr>

    </thead>

    <tbody>

      <tr>

        <td>1</td>

        <td>22:00</td>

      </tr>

      <tr>

        <td>2</td>

        <td>23:00</td>

      </tr>

      <!-- 添加更多行如果需要 -->

    </tbody>

  </table>
</div>


</div>

      <div style="margin: 15px auto;" class="flex-sb">
      <button class="tab-button main-button" style="border:none;" id="farming-tab" onclick="this.classList.toggle('active')">种植区域</button>
      <button class="tab-button main-button" id="mining-tab">采矿区</button>
      <button class="tab-button main-button" id="cooking-tab" onclick="this.classList.toggle('active')">烹饪区</button>
      <button class="tab-button main-button" id="woodworking-tab">制木区</button>
      <button class="tab-button main-button" id="move-tab">传送区</button>
      <button class="tab-button main-button" id="order-tab">委托区</button>
      <button class="tab-button main-button" id="Brewing-tab">酿酒区</button>
      <button class="tab-button main-button" id="other-tab">其他功能区</button>
    </div>


  </div>
  <div class="flex-center">
  <button style="display: block; box-sizing: border-box;
  outline: none !important;
     border: none !important;
     border-radius: 20px;
     padding: 5px 25px !important;
      background-color:#F56C6C;
      color: white; cursor: pointer; transition: background-color 0.3s; font-size: 15px;" id="all">收起</button>
  </div>

</div>
`;
document.body.appendChild(panel);

// 获取所有的按钮元素
var buttons = document.querySelectorAll('.tab-button');

// 为每个按钮添加点击事件监听器
buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    // 移除所有按钮上的激活类
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    // 为被点击的按钮添加激活类
    this.classList.add('active');
  });
});





document.getElementById('all').addEventListener('click', () => {
  const panelContent = document.getElementById('panel-content');
  const floatingPanel = document.getElementById('floating-panel');
  const toggleButton = document.getElementById('all');
  if (panelContent.style.display === 'none') {
    floatingPanel.style.backgroundColor = '#fff'
    floatingPanel.style.borderWidth = '2px'
    panelContent.style.display = 'block';
    toggleButton.textContent = '收起';
  } else {
    floatingPanel.style.borderWidth = '0'
    floatingPanel.style.backgroundColor = ''
    panelContent.style.display = 'none';
    toggleButton.textContent = '展开';
  }
});

 document.getElementById('move-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'block';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'none';
});
     document.getElementById('farming-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'block';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'none';
});
     document.getElementById('cooking-tab').addEventListener('click', () => {
      const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'block';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'none';
});
     document.getElementById('woodworking-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'block';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'none';
});
document.getElementById('order-tab').addEventListener('click', () => {
    const panelContent = document.getElementById('farming_tab');
       const cookContent = document.getElementById('cooking_tab');
       const woodenContent = document.getElementById('woodworking_tab');
       const otherContent = document.getElementById('other_tab');
       const orderContent = document.getElementById('order_tab');
       const moveContent = document.getElementById('move_tab');
       const BrewingContent = document.getElementById('Brewing_tab');
       const miningContent = document.getElementById('mining_tab');
       panelContent.style.display = 'none';
        cookContent.style.display = 'none';
        woodenContent.style.display = 'none';
       otherContent.style.display = 'none';
       orderContent.style.display = 'block';
       moveContent.style.display = 'none';
       BrewingContent.style.display = 'none';
       miningContent.style.display = 'none';
  });
     document.getElementById('other-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'block';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'none';

});
    document.getElementById('Brewing-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'block';
     miningContent.style.display = 'none';
});

document.getElementById('mining-tab').addEventListener('click', () => {
  const panelContent = document.getElementById('farming_tab');
     const cookContent = document.getElementById('cooking_tab');
     const woodenContent = document.getElementById('woodworking_tab');
     const otherContent = document.getElementById('other_tab');
     const orderContent = document.getElementById('order_tab');
     const moveContent = document.getElementById('move_tab');
     const BrewingContent = document.getElementById('Brewing_tab');
     const miningContent = document.getElementById('mining_tab');
     panelContent.style.display = 'none';
      cookContent.style.display = 'none';
      woodenContent.style.display = 'none';
     otherContent.style.display = 'none';
     orderContent.style.display = 'none';
     moveContent.style.display = 'none';
     BrewingContent.style.display = 'none';
     miningContent.style.display = 'block';
});



  // Button event listeners

const runtime = "(() => {\n  // src/matchModule.js\n  function matchModule(moduleStr, queryArg) {\n    const queryArray = queryArg instanceof Array ? queryArg : [queryArg];\n    return !queryArray.some((query) => {\n      if (query instanceof RegExp) {\n        return !query.test(moduleStr);\n      } else {\n        return !moduleStr.includes(query);\n      }\n    });\n  }\n\n  // src/spacepackLite.js\n  var namedRequireMap = {\n    p: \"publicPath\",\n    s: \"entryModuleId\",\n    c: \"moduleCache\",\n    m: \"moduleFactories\",\n    e: \"ensureChunk\",\n    f: \"ensureChunkHandlers\",\n    E: \"prefetchChunk\",\n    F: \"prefetchChunkHandlers\",\n    G: \"preloadChunk\",\n    H: \"preloadChunkHandlers\",\n    d: \"definePropertyGetters\",\n    r: \"makeNamespaceObject\",\n    t: \"createFakeNamespaceObject\",\n    n: \"compatGetDefaultExport\",\n    hmd: \"harmonyModuleDecorator\",\n    nmd: \"nodeModuleDecorator\",\n    h: \"getFullHash\",\n    w: \"wasmInstances\",\n    v: \"instantiateWasm\",\n    oe: \"uncaughtErrorHandler\",\n    nc: \"scriptNonce\",\n    l: \"loadScript\",\n    ts: \"createScript\",\n    tu: \"createScriptUrl\",\n    tt: \"getTrustedTypesPolicy\",\n    cn: \"chunkName\",\n    j: \"runtimeId\",\n    u: \"getChunkScriptFilename\",\n    k: \"getChunkCssFilename\",\n    hu: \"getChunkUpdateScriptFilename\",\n    hk: \"getChunkUpdateCssFilename\",\n    x: \"startup\",\n    X: \"startupEntrypoint\",\n    O: \"onChunksLoaded\",\n    C: \"externalInstallChunk\",\n    i: \"interceptModuleExecution\",\n    g: \"global\",\n    S: \"shareScopeMap\",\n    I: \"initializeSharing\",\n    R: \"currentRemoteGetScope\",\n    hmrF: \"getUpdateManifestFilename\",\n    hmrM: \"hmrDownloadManifest\",\n    hmrC: \"hmrDownloadUpdateHandlers\",\n    hmrD: \"hmrModuleData\",\n    hmrI: \"hmrInvalidateModuleHandlers\",\n    hmrS: \"hmrRuntimeStatePrefix\",\n    amdD: \"amdDefine\",\n    amdO: \"amdOptions\",\n    System: \"system\",\n    o: \"hasOwnProperty\",\n    y: \"systemContext\",\n    b: \"baseURI\",\n    U: \"relativeUrl\",\n    a: \"asyncModule\"\n  };\n  function getNamedRequire(webpackRequire) {\n    const namedRequireObj = {};\n    Object.getOwnPropertyNames(webpackRequire).forEach((key) => {\n      if (Object.prototype.hasOwnProperty.call(namedRequireMap, key)) {\n        namedRequireObj[namedRequireMap[key]] = webpackRequire[key];\n      }\n    });\n    return namedRequireObj;\n  }\n  function getSpacepack(chunkObject, logSuccess = false) {\n    function spacepack(module, exports, webpackRequire) {\n      if (logSuccess) {\n        if (!chunkObject) {\n          console.log(\"[wpTools] spacepack loaded\");\n        } else {\n          console.log(\"[wpTools] spacepack loaded in \" + chunkObject);\n        }\n      }\n      function findByExports(keysArg) {\n        if (!webpackRequire.c) {\n          throw new Error(\"webpack runtime didn't export its moduleCache\");\n        }\n        const keys = keysArg instanceof Array ? keysArg : [keysArg];\n        return Object.entries(webpackRequire.c).filter(([moduleId, exportCache]) => {\n          return !keys.some((searchKey) => {\n            return !(exportCache !== void 0 && exportCache !== window && (exports?.[searchKey] || exports?.default?.[searchKey]));\n          });\n        }).map(([moduleId, exportCache]) => {\n          return exportCache;\n        });\n      }\n      function findByCode(search) {\n        return Object.entries(webpackRequire.m).filter(([moduleId, moduleFunc]) => {\n          const funcStr = Function.prototype.toString.apply(moduleFunc);\n          return matchModule(funcStr, search);\n        }).map(([moduleId, moduleFunc]) => {\n          try {\n            return {\n              id: moduleId,\n              exports: webpackRequire(moduleId)\n            };\n          } catch (error) {\n            console.error(\"Failed to require module: \" + error);\n            return {\n              id: moduleId,\n              exports: {}\n            };\n          }\n        });\n      }\n      function findObjectFromKey(exports2, key) {\n        let subKey;\n        if (key.indexOf(\".\") > -1) {\n          const splitKey = key.split(\".\");\n          key = splitKey[0];\n          subKey = splitKey[1];\n        }\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] !== void 0) {\n            if (subKey) {\n              if (obj[key][subKey])\n                return obj;\n            } else {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromValue(exports2, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj == value)\n            return obj;\n          for (const subKey in obj) {\n            if (obj && obj[subKey] == value) {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromKeyValuePair(exports2, key, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] == value) {\n            return obj;\n          }\n        }\n        return null;\n      }\n      function findFunctionByStrings(exports2, ...strings) {\n        return Object.entries(exports2).filter(\n          ([index, func]) => typeof func === \"function\" && !strings.some(\n            (query) => !(query instanceof RegExp ? func.toString().match(query) : func.toString().includes(query))\n          )\n        )?.[0]?.[1] ?? null;\n      }\n      function inspect(moduleId) {\n        return webpackRequire.m[moduleId];\n      }\n      const exportedRequire = module.exports.default = exports.default = {\n        require: webpackRequire,\n        modules: webpackRequire.m,\n        cache: webpackRequire.c,\n        __namedRequire: getNamedRequire(webpackRequire),\n        findByCode,\n        findByExports,\n        findObjectFromKey,\n        findObjectFromKeyValuePair,\n        findObjectFromValue,\n        findFunctionByStrings,\n        inspect\n      };\n      if (chunkObject) {\n        exportedRequire.chunkObject = window[chunkObject];\n        exportedRequire.name = chunkObject;\n      }\n      if (window.wpTools) {\n        const runtimesRegistry = window.wpTools.runtimes;\n        if (runtimesRegistry[chunkObject]) {\n          console.warn(\"[wpTools] Multiple active runtimes for \" + chunkObject);\n          let currId = 0;\n          if (runtimesRegistry[chunkObject].__wpTools_multiRuntime_id) {\n            currId = runtimesRegistry[chunkObject].__wpTools_multiRuntime_id;\n          }\n          runtimesRegistry[chunkObject + \"_\" + currId] = runtimesRegistry[chunkObject];\n          currId++;\n          runtimesRegistry[chunkObject + \"_\" + currId] = exportedRequire;\n          runtimesRegistry[chunkObject] = exportedRequire;\n        }\n        runtimesRegistry[chunkObject] = exportedRequire;\n        window[\"spacepack_\" + chunkObject] = exportedRequire;\n      }\n      window[\"spacepack\"] = exportedRequire;\n    }\n    spacepack.__wpt_processed = true;\n    return spacepack;\n  }\n\n  // src/Patcher.js\n  var ConfigValidationError = class extends Error {\n  };\n  function validateProperty(name, object, key, required, validationCallback) {\n    if (!Object.prototype.hasOwnProperty.call(object, [key])) {\n      if (required) {\n        throw new ConfigValidationError(`Required property not found, missing ${key} in ${name}`);\n      } else {\n        return;\n      }\n    } else {\n      if (!validationCallback(object[key])) {\n        throw new ConfigValidationError(\n          `Failed to validate ${key} in ${name}. The following check failed: \n${validationCallback.toString()}`\n        );\n      }\n    }\n  }\n  var Patcher = class {\n    constructor(config) {\n      this._validateConfig(config);\n      this.name = config.name;\n      this.chunkObject = config.chunkObject;\n      this.webpackVersion = config.webpackVersion.toString();\n      this.patchAll = config.patchAll;\n      this.modules = new Set(config.modules ?? []);\n      for (const module of this.modules) {\n        this._validateModuleConfig(module);\n      }\n      this.patches = new Set(config.patches ?? []);\n      for (const patch of this.patches) {\n        this._validatePatchConfig(patch);\n      }\n      this.patchesToApply = /* @__PURE__ */ new Set();\n      if (this.patches) {\n        for (const patch of this.patches) {\n          if (patch.replace instanceof Array) {\n            for (const index in patch.replace) {\n              this.patchesToApply.add({\n                name: patch.name + \"_\" + index,\n                find: patch.find,\n                replace: patch.replace[index]\n              });\n            }\n            continue;\n          }\n          this.patchesToApply.add(patch);\n        }\n      }\n      this.modulesToInject = /* @__PURE__ */ new Set();\n      if (this.modules) {\n        for (const module of this.modules) {\n          if (module.needs !== void 0 && module.needs instanceof Array) {\n            module.needs = new Set(module.needs);\n          }\n          this.modulesToInject.add(module);\n        }\n      }\n      if (config.injectSpacepack !== false) {\n        this.modulesToInject.add({\n          name: \"spacepack\",\n          // This is sorta a scope hack.\n          // If we rewrap this function, it will lose its scope (in this case the match module import and the chunk object name)\n          run: getSpacepack(this.chunkObject),\n          entry: true\n        });\n      }\n      if (config.patchEntryChunk) {\n        this.modulesToInject.add({\n          name: \"patchEntryChunk\",\n          run: (module, exports, webpackRequire) => {\n            this._patchModules(webpackRequire.m);\n          },\n          entry: true\n        });\n        this.patchEntryChunk = true;\n      }\n    }\n    run() {\n      if (this.webpackVersion === \"4\" || this.webpackVersion === \"5\") {\n        this._interceptWebpackModern();\n      } else {\n        this._interceptWebpackLegacy;\n      }\n    }\n    _interceptWebpackModern() {\n      let realChunkObject = window[this.chunkObject];\n      const patcher = this;\n      Object.defineProperty(window, this.chunkObject, {\n        set: function set(value) {\n          realChunkObject = value;\n          if (patcher.patchEntryChunk) {\n            let newChunk = [[\"patchEntryChunk\"], {}];\n            patcher._injectModules(newChunk);\n            realChunkObject.push(newChunk);\n          }\n          if (!value.push.__wpt_injected) {\n            realChunkObject = value;\n            const realPush = value.push;\n            value.push = function(chunk) {\n              if (!chunk.__wpt_processed) {\n                chunk.__wpt_processed = true;\n                patcher._patchModules(chunk[1]);\n                patcher._injectModules(chunk);\n              }\n              return realPush.apply(this, arguments);\n            };\n            value.push.__wpt_injected = true;\n            if (realPush === Array.prototype.push) {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (before webpack runtime)\");\n            } else {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (at webpack runtime)\");\n            }\n          }\n        },\n        get: function get() {\n          return realChunkObject;\n        },\n        configurable: true\n      });\n    }\n    _interceptWebpackLegacy() {\n    }\n    _patchModules(modules) {\n      for (const id in modules) {\n        if (modules[id].__wpt_processed) {\n          continue;\n        }\n        let funcStr = Function.prototype.toString.apply(modules[id]);\n        const matchingPatches = [];\n        for (const patch of this.patchesToApply) {\n          if (matchModule(funcStr, patch.find)) {\n            matchingPatches.push(patch);\n            this.patchesToApply.delete(patch);\n          }\n        }\n        for (const patch of matchingPatches) {\n          funcStr = funcStr.replace(patch.replace.match, patch.replace.replacement);\n        }\n        if (matchingPatches.length > 0 || this.patchAll) {\n          let debugString = \"\";\n          if (matchingPatches.length > 0) {\n            debugString += \"Patched by: \" + matchingPatches.map((patch) => patch.name).join(\", \");\n          }\n          modules[id] = new Function(\n            \"module\",\n            \"exports\",\n            \"webpackRequire\",\n            `(${funcStr}).apply(this, arguments)\n// ${debugString}\n//# sourceURL=${this.chunkObject}-Module-${id}`\n          );\n          modules[id].__wpt_patched = true;\n        }\n        modules[id].__wpt_funcStr = funcStr;\n        modules[id].__wpt_processed = true;\n      }\n    }\n    _injectModules(chunk) {\n      const readyModules = /* @__PURE__ */ new Set();\n      for (const moduleToInject of this.modulesToInject) {\n        if (moduleToInject?.needs?.size > 0) {\n          for (const need of moduleToInject.needs) {\n            for (const wpModule of Object.entries(chunk[1])) {\n              if (need?.moduleId && wpModule[0] === need.moduleId || matchModule(wpModule[1].__wpt_funcStr, need)) {\n                moduleToInject.needs.delete(need);\n                if (moduleToInject.needs.size === 0) {\n                  readyModules.add(moduleToInject);\n                }\n                break;\n              }\n            }\n          }\n        } else {\n          readyModules.add(moduleToInject);\n        }\n      }\n      if (readyModules.size > 0) {\n        const injectModules = {};\n        const injectEntries = [];\n        for (const readyModule of readyModules) {\n          this.modulesToInject.delete(readyModule);\n          injectModules[readyModule.name] = readyModule.run;\n          if (readyModule.entry) {\n            injectEntries.push(readyModule.name);\n          }\n        }\n        if (chunk[1] instanceof Array) {\n          const origChunkArray = chunk[1];\n          chunk[1] = {};\n          origChunkArray.forEach((module, index) => {\n            chunk[1][index] = module;\n          });\n        }\n        chunk[1] = Object.assign(chunk[1], injectModules);\n        if (injectEntries.length > 0) {\n          switch (this.webpackVersion) {\n            case \"5\":\n              if (chunk[2]) {\n                const originalEntry = chunk[2];\n                chunk[2] = function(webpackRequire) {\n                  originalEntry.apply(this, arguments);\n                  injectEntries.forEach(webpackRequire);\n                };\n              } else {\n                chunk[2] = function(webpackRequire) {\n                  injectEntries.forEach(webpackRequire);\n                };\n              }\n              break;\n            case \"4\":\n              if (chunk[2]?.[0]) {\n                chunk[2]?.[0].concat([injectEntries]);\n              } else {\n                chunk[2] = [injectEntries];\n              }\n              break;\n          }\n        }\n      }\n    }\n    _validateConfig(config) {\n      validateProperty(\"siteConfigs[?]\", config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${name}]`, config, \"chunkObject\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"webpackVersion\", true, (value) => {\n        return [\"4\", \"5\"].includes(value.toString());\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchAll\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"modules\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patches\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"injectSpacepack\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchEntryChunk\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n    }\n    _validatePatchReplacement(replace, name, index) {\n      let indexStr = index === void 0 ? \"\" : `[${index}]`;\n      validateProperty(\n        `siteConfigs[${this.name}].patches[${name}].replace${indexStr}`,\n        replace,\n        \"match\",\n        true,\n        (value) => {\n          return typeof value === \"string\" || value instanceof RegExp;\n        }\n      );\n      validateProperty(`siteConfigs[${this.name}].patches[${name}].replace`, replace, \"replacement\", true, (value) => {\n        return typeof value === \"string\" || value instanceof Function;\n      });\n    }\n    _validatePatchConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].patches[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"find\", true, (value) => {\n        return (\n          // RegExp, String, or an Array of RegExps and Strings\n          typeof value === \"string\" || value instanceof RegExp || value instanceof Array && !value.some((value2) => {\n            !(typeof value2 === \"string\" || value2 instanceof RegExp);\n          })\n        );\n      });\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"replace\", true, (value) => {\n        return typeof value === \"object\";\n      });\n      if (config.replace instanceof Array) {\n        config.replace.forEach((replacement, index) => {\n          this._validatePatchReplacement(replacement, name, index);\n        });\n      } else {\n        this._validatePatchReplacement(config.replace, name);\n      }\n    }\n    _validateModuleConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].modules[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"needs\", false, (value) => {\n        return (value instanceof Array || value instanceof Set) && ![...value].some((value2) => {\n          !(typeof value2 === \"string\" || value2 instanceof RegExp || value2 instanceof Object && typeof value2.moduleId === \"string\");\n        });\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"run\", true, (value) => {\n        return typeof value === \"function\";\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"entry\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      if (config.entry === void 0) {\n        config.entry = false;\n      }\n    }\n  };\n\n  // src/spacepackEverywhere.js\n  function getWebpackVersion(chunkObject) {\n    if (chunkObject instanceof Array) {\n      return \"modern\";\n    } else {\n      return \"legacy\";\n    }\n  }\n  var onChunkLoaded = function(webpackRequire) {\n    webpackRequire(\"spacepack\");\n  };\n  onChunkLoaded[0] = [\"spacepack\"];\n  onChunkLoaded[Symbol.iterator] = function() {\n    return {\n      read: false,\n      next() {\n        if (!this.read) {\n          this.read = true;\n          return { done: false, value: 0 };\n        } else {\n          return { done: true };\n        }\n      }\n    };\n  };\n  function pushSpacepack(chunkObjectName) {\n    const chunkObject = window[chunkObjectName];\n    if (chunkObject.__spacepack_everywhere_injected) {\n      return;\n    }\n    const version = getWebpackVersion(chunkObject);\n    console.log(\"[wpTools] Detected \" + chunkObjectName + \" using webpack \" + version);\n    switch (version) {\n      case \"modern\":\n        chunkObject.__spacepack_everywhere_injected = true;\n        chunkObject.push([[\"spacepack\"], { spacepack: getSpacepack(chunkObjectName, true) }, onChunkLoaded]);\n        break;\n    }\n  }\n  function spacepackEverywhere(config) {\n    if (config?.ignoreSites?.includes(window.location.host)) {\n      return;\n    }\n    for (const key of Object.getOwnPropertyNames(window)) {\n      if ((key.includes(\"webpackJsonp\") || key.includes(\"webpackChunk\") || key.includes(\"__LOADABLE_LOADED_CHUNKS__\")) && !key.startsWith(\"spacepack\") && !config?.ignoreChunkObjects?.includes(key)) {\n        pushSpacepack(key);\n      }\n    }\n  }\n\n  // src/entry/userscript.js\n  var globalConfig = window.__webpackTools_config;\n  delete window.__webpackTools_config;\n  var siteConfigs = /* @__PURE__ */ new Set();\n  for (let siteConfig of globalConfig.siteConfigs) {\n    if (siteConfig.matchSites?.includes(window.location.host)) {\n      siteConfigs.add(siteConfig);\n      break;\n    }\n  }\n  window.wpTools = {\n    globalConfig,\n    activeSiteConfigs: siteConfigs,\n    spacepackEverywhereDetect: () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    },\n    runtimes: {}\n  };\n  if (siteConfigs.size > 0) {\n    for (const siteConfig of siteConfigs) {\n      const patcher = new Patcher(siteConfig);\n      patcher.run();\n    }\n  } else if (globalConfig?.spacepackEverywhere?.enabled !== false) {\n    window.addEventListener(\"load\", () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    });\n  }\n})();\n\n//# sourceURL=wpTools";

GM_addElement("script", {
  textContent: runtime,
});


  const PLAYER_WIDTH = 32;
  const PLAYER_HEIGHT = 48;
  //hook

    const settings = {
           hookWebsocket: true,//这个是 hook websocket
           hookEmit: false,//这个是 hook 游戏的 emit
           isWsRecord: false,
        isMvRecord: false,
        createMap: true

       }

  let interval = setInterval(() => {

   if(unsafeWindow.spacepack){


       var RoomPrototype = unsafeWindow.spacepack.findByCode('sendBytes')[0].exports.Room.prototype

       var SchemaPrototype = unsafeWindow.spacepack.findByCode('Schema')[1].exports.Schema.prototype





       const originalOnMessage = RoomPrototype.onMessageCallback
       const originalSend = RoomPrototype.send;

       let wsRecords = []
       let lastWsRecordTime = 0;

       let mvRecords = []
       let lastMvRecordTime = 0;
function copyToClipboard(text) {
// Créer un élément textarea temporaire
const textArea = document.createElement("textarea");
textArea.value = text;
document.body.appendChild(textArea);

// Sélectionner le texte dans le textarea
textArea.select();
textArea.setSelectionRange(0, 99999); // Pour les appareils mobiles

// Copier le texte dans le presse-papiers
document.execCommand("copy");

// Supprimer le textarea temporaire
document.body.removeChild(textArea);
}






      //   document.getElementById('start-move').addEventListener('click', () => {
      //     lastMvRecordTime = 0
      //      mvRecords = []
      //      settings.isMvRecord = true;

      //   });
      //  document.getElementById('stop-move').addEventListener('click', () => {
      //       const str = mvRecords.join('\n')
      //       console.log(str)
      //      copyToClipboard(str)
      //      mvRecords = []
      //      settings.isMvRecord = false;

      //  });
      //  document.getElementById('start-websocket').addEventListener('click', () => {
      //      lastWsRecordTime = 0
      //      wsRecords = []
      //      settings.isWsRecord = true;
      //  });
      //  document.getElementById('stop-websocket').addEventListener('click', () => {
      //         const str = wsRecords.join('\n')
      //       console.log(str)
      //      copyToClipboard(str)
      //      wsRecords = []
      //      settings.isWsRecord = false;

      //  });



       unsafeWindow._gameState = unsafeWindow.spacepack.findByCode('GameStateManager')[0].exports.l.singleton

       //1.sendCommand 对应 websocket的两个参数
       unsafeWindow._sendCommand = function(param1, param2){

           unsafeWindow._gameState.room.send.call(unsafeWindow._gameState.room,param1, param2)
       }
       unsafeWindow._sendWebsocket = function(arg1, arg2){
           const encResult = unsafeWindow._encryptUtils.encryptSend(arg1, arg2);
           console.log('encResult', encResult, arg1, arg2)
                        unsafeWindow._gameState.room.connection.send.call(unsafeWindow._gameState.room.connection, encResult)

       }




const corrnorVelocity = 70.71067811865474
const directVelocity = 100;

       function getDirection(startX, startY, targetX, targetY) {
  var direction = [];

  if (targetX > startX) {
      direction.push('right');
  } else if (targetX < startX) {
      direction.push('left');
  }

  if (targetY > startY) {
      direction.push("bottom");
  } else if (targetY < startY) {
      direction.push("top");
  }

  return direction.join('-') || 'no-move'; // 如果没有移动方向，则返回 'no-move'
}
       function getCurrentPlayerXY(){
           var result = null
       unsafeWindow._gameState.room.serializer.state.players.forEach(item => {

  if(item.username == 'asdzxcca') {
      result= {x: item.position.x, y: item.position.y}
  }
})
           return result;
       }

       //右下角移动
function getVelocity (direction){
  if(direction == 'right-bottom') {
      return [corrnorVelocity,corrnorVelocity]
  }
  if(direction == 'right-top') {
      return [corrnorVelocity,-corrnorVelocity]
  }
    if(direction == 'left-bottom') {
      return [-corrnorVelocity,corrnorVelocity]
  }
    if(direction == 'left-top') {
      return [-corrnorVelocity,-corrnorVelocity]
  }
  if(direction == 'left') {
      return [-directVelocity, 0]
  }

    if(direction == 'right') {
      return [directVelocity, 0]
  }
  if(direction == 'top') {
      return [0, -directVelocity]
  }

   if(direction == 'bottom') {
      return [0, directVelocity]
  }

  return [0,0]
}
       //2. emit 对应 emit hook到的数据
        unsafeWindow._emit = function(){

           const emitter = unsafeWindow._getPhaserEventEmitter();
            emitter.emit.call(emitter,...arguments)
       }
       function moveAdapter(m){
                  let R = -4 & Math.floor(Date.now() / 1e5)
                    , C = Math.round(m.position.x) * (R % 1e3) + Math.round(m.position.y) * (R % 23) + R % 111;
                  return [C, m.position.x, m.position.y, m.velocity.x, m.velocity.y]

       }
       unsafeWindow.sleep = (ms) => {
           return new Promise((resolve) => {
               setTimeout(()=>{resolve(null)},ms)


           })

       }
       let previousPosition = null


        unsafeWindow._moveToWithVelocity = function(x,y, vx, vy){


          unsafeWindow._sendCommand('mv', moveAdapter({"velocity":{x:vx, y: vy},"position":{"x":x,"y":y}}))
       }

       //人物移动方法 对应的是 hook的 mv 里的数组前两个参数
       unsafeWindow._moveTo = function(x,y, isEnd = true){
           if(!previousPosition) {
               previousPosition = getCurrentPlayerXY()
           }

           const preX = previousPosition.x;
           const preY = previousPosition.y;
           //判断是什么方向的移动
           const direction = getDirection(preX,preY,x,y )
           const velocity = isEnd ? [0,0] : getVelocity(direction);
           previousPosition.x = x
           previousPosition.y = y
           if(isEnd) {
               previousPosition = null
           }

          unsafeWindow._sendCommand('mv', moveAdapter({"velocity":{x:velocity[0], y: velocity[1]},"position":{"x":x,"y":y}}))
       }

       unsafeWindow._shunyi = function(x,y){
           unsafeWindow._gameState.scene.triggerSystem.player.moveTo.call(unsafeWindow._gameState.scene.triggerSystem.player, x,y )
       }
                  ////// // unsafeWindow._gameState.scene.triggerSystem.player.moveTo.call(unsafeWindow._gameState.scene.triggerSystem.player, x,y )


       //加入地图方法 对应 emit拦截里的 第二个参数的mapId
        unsafeWindow._joinMap = function(mapId){
              unsafeWindow._emit('ROOM_WARP',{"mapId":mapId})
       }
       var scriptElement = unsafeWindow.document.createElement("script");
       scriptElement.src = "https://qiao.github.io/PathFinding.js/visual/lib/pathfinding-browser.min.js";
unsafeWindow.document.head.appendChild(scriptElement);


function clearPath(){
const elements = document.querySelectorAll('.apath');

// 遍历并移除这些元素
elements.forEach(element => {
  element.parentNode.removeChild(element);
});
}
function createPathDiv(x1, y1) {
  // 创建 div 元素
  var div = document.createElement("div");

  // 设置 div 元素的样式
      div.classList.add('apath')

  div.style.position = "fixed";
  div.style.left = x1 + "px";
  div.style.top = y1 + "px";
  div.style.width = "1px";
  div.style.height = "1px";
  div.style.backgroundColor = "green";
  div.style.zIndex = "99999"; // 设置层级最高

  // 将 div 元素添加到页面中
  document.body.appendChild(div);
}
unsafeWindow.getRoomGraphs = () => {
const gameLibrary = unsafeWindow.spacepack.findByCode('loadLibraries')[1].exports.Z.gameLibrary
const mapBounds = getMapBounds()
var objs = Array.from(_gameState.scene.collidingObjects)

function createBlackDiv(x1, y1, x2, y2,remark) {
  // 创建 div 元素
  var div = document.createElement("div");

  // 设置 div 元素的样式
  div.classList.add('apath')
  div.style.position = "fixed";
  div.style.left = x1 + "px";
  div.style.top = y1 + "px";
  div.style.width = (x2 - x1) + "px";
  div.style.height = (y2 - y1) + "px";
  div.style.backgroundColor = "black";
  div.style.zIndex = "9999"; // 设置层级最高
  div.setAttribute('remark', remark)

  // 将 div 元素添加到页面中
  document.body.appendChild(div);
}

var positions = [];
objs.forEach(item => {
  if(item.width > 400) {
  return;
  }


  let x = (item.position.x) - mapBounds.left -PLAYER_WIDTH / 4
  let y = (item.position.y ) - mapBounds.top -  PLAYER_HEIGHT /4
  let x2 = (item.position.x + item.width) - mapBounds.left  + PLAYER_WIDTH / 4
  let y2 = (item.position.y + item.height) - mapBounds.top + PLAYER_HEIGHT /4
  if(settings.createMap) {
      createBlackDiv(x,y,x2,y2,'colldingobjects' + JSON.stringify(item.gameObject) + JSON.stringify(item.position) + '' )
  }



  positions.push([Math.round(x),Math.round(y),Math.round(x2),Math.round(y2)])
})



  return positions
}





function setObstacles(grid,obstacles) {
  obstacles.forEach(obstacle => {
      // 对于每个障碍物，将其坐标解构成 (x1, y1, x2, y2)
      const [x1, y1, x2, y2] = obstacle;



      // 遍历障碍物所占据的每个格子，设置为障碍物
      for (let x = x1; x <= x2; x++) {
          for (let y = y1; y <= y2; y++) {


            try {
                if(x <= 0 || y<= 0) {continue;}


                 grid.setWalkableAt(x, y, false);
            } catch(e) {
            console.error(e,x, y)
            }
          }
      }
  });
}
function getMapBounds(){
return unsafeWindow._gameState.scene.mapBounds
}



unsafeWindow.testFind = async (x2, y2, stepDelay, maxStepsPerPath) => {
clearPath()
const mapBounds = getMapBounds()
const positionCurrent = getCurrentPlayerXY()
   let x1 = positionCurrent.x  - mapBounds.left;
   let y1 = positionCurrent.y - mapBounds.top;

x2 = x2 - mapBounds.left;
y2 = y2 - mapBounds.top;

var grid = new PF.Grid(mapBounds.width + 100,mapBounds.height + 100);


  // 示例障碍物数组
const obstacles =unsafeWindow.getRoomGraphs()// 假设障碍物是以 [x, y] 的形式给出的
// 调用方法并传入障碍物数组
setObstacles(grid,obstacles);



// 创建 A* 寻路器
var finder = new PF.AStarFinder({
      dontCrossCorners: true,
  allowDiagonal: true, // 允许斜向移动
  weight: 100 // 默认权重

});
let path = finder.findPath(Math.round(x1), Math.round(y1), Math.round(x2),  Math.round(y2), grid);
  console.log('path', path)
// Generate obstacles dynamically based on current node's position
const batchSize = 1; // 每次处理的节点数量

for (let i = 1; i < path.length; i++) {
  const x = path[i][0] + mapBounds.left
  const y = path[i][1] + mapBounds.top

 // createPathDiv(path[i][0],path[i][1])


  // 如果是每 batchSize 个节点或者是最后一个节点，则执行 _moveTo 方法
  if ((i + 1) % batchSize === 0 || i === path.length - 1) {

      if(i == path.length - 1) {
           _moveTo(x, y, true);
      } else {
_moveTo(x, y,false);
}


      await sleep(stepDelay); // 控制速度的关键，调整 stepDelay 的值来控制速度


  }

}


}

// Async sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



       unsafeWindow._getPhaserEventEmitter = () => {
           var obj = unsafeWindow.spacepack.findByCode('phaserEventEmitter')[0].exports
           const objs = Object.values(obj)
           for(let i = 0; i< objs.length; i++){
           const el = objs[i]
           if(typeof el == 'object' && el['phaserEventEmitter'] != undefined) {
               return el['phaserEventEmitter'];
           }
           }
           return null;

       }
         // 获取 PhaserEventEmitter 对象'
         var phaserEventEmitter = unsafeWindow._getPhaserEventEmitter();
       if(!phaserEventEmitter ) {

           return;
       }
       //对象都存在了 可以 hook 了
                clearInterval(interval)


       if (settings.hookWebsocket) {

       RoomPrototype.onMessageCallback =  function(m) {
           let R = Array.from(new Uint8Array(m.data))
                , C = R[0];
              if (C === V.Protocol.JOIN_ROOM) {
                  console.log('join room')
              } else if (C === V.Protocol.ERROR) {
                  let m = {
                      offset: 1
                  }
                    , C = W.decode.number(R, m)
                    , T = W.decode.string(R, m);
                    console.log("websocket error message: 字符串解密结果:",T,"number解密结果:",C);
              } else if (C === V.Protocol.LEAVE_ROOM)
              {

              }
              else if (C === V.Protocol.ROOM_DATA_SCHEMA) {
              //save to serializer
              } else if (C === V.Protocol.ROOM_STATE){
              //save to serializer
              }

              else if (C === V.Protocol.ROOM_STATE_PATCH){
                   //save to serializer
              }

              else if (C === V.Protocol.ROOM_DATA) {
                  let C = {
                      offset: 1
                  }
                    , T = W.decode.stringCheck(R, C) ? W.decode.string(R, C) : W.decode.number(R, C)
                    , L = R.length > C.offset ? $.decode(m.data, C.offset) : void 0;
                  console.log("websocket 接收消息: 字符串解密结果:",T,L ,"number解密结果:",C);
                  if (T === 'sellOrders') {
                    // 这里你可以选择将 L 存储到一个全局变量或其他存储方式
                    unsafeWindow.sellOrdersData = L; // 存储到全局变量
                    console.log("sellOrders data stored:", window.sellOrdersData);
                  }

                  if (T === 'fetchMailbox') {
                            // 这里你可以选择将 L 存储到一个全局变量或其他存储方式
                            unsafeWindow.fetchMailbox = L; // 存储到全局变量
                    console.log("sellOrders data stored:", window.fetchMailbox);
                  }
                  if(T==='marketplace')
                    {
                        if(L.type=="purchase-failure")
                          {
                            unsafeWindow.buystate={isobsolete:0,info:L.error}
                          }
                        else if(L.type=="purchase-success")
                        {
                          unsafeWindow.buystate={isobsolete:0,quantity:L.quantity,info:"purchase-success"}
                        }
                        else if(L.error)
                          {
                            unsafeWindow.buystate={isobsolete:0,info:L.error}
                          }
                    }

              } else if (C === V.Protocol.ROOM_DATA_BYTES) {

              }

             // 调用原始的方法
           originalOnMessage.call(this, m);
      }

           //解密emit receivemessage
           //const originMessageEmit = unsafeWindow._gameState.room.onMessageHandlers.emit

            //  unsafeWindow._gameState.room.onMessageHandlers.emit = function(){
             //  console.log(`%c hook websocket message emit  : arguments=> %c ${JSON.stringify(arguments)}`,
             //"color: red; font-size: 15px;",
            // "color: blue; font-size: 15px;");

            //    originMessageEmit.call(unsafeWindow._gameState.room.onMessageHandlers, ...arguments);
       //}


       // 重写 Room.prototype.send 方法
       RoomPrototype.send = function(message, options) {
           // 打印参数
console.log(
"%cwebsocket发送消息 : %c%s %c%s %c%s %c%s",
"color:red;font-size:15px;",
"color:blue;font-size:15px;", "参数1",
"color:green;font-size:15px;", message,
"color:purple;font-size:15px;", "参数2",
"color:orange;font-size:15px;", JSON.stringify(options)
);
           let nowTime = new Date().getTime()

           if(settings.isWsRecord) {

               if(lastWsRecordTime) {
                   //已经记录过  设置sleep
                   let str = `await sleep(${nowTime - lastWsRecordTime});`
                   lastWsRecordTime = nowTime;
                   wsRecords.push(str)

               } else {
                   lastWsRecordTime = nowTime
               }
               let newStr = `_sendCommand('${message}',${JSON.stringify(options)})`
               wsRecords.push(newStr)


           }
           if(settings.isMvRecord && message == 'mv') {

                        if(lastMvRecordTime) {
                   //已经记录过  设置sleep
                   let str = `await sleep(${nowTime - lastMvRecordTime});`
                   lastMvRecordTime = nowTime;
                   mvRecords.push(str)

               } else {
                   lastMvRecordTime = nowTime
               }
               let newStr = `_moveToWithVelocity(${options[1]},${options[2]},${options[3]},${options[4]})`
               mvRecords.push(newStr)


           }


           // 调用原始的方法
           originalSend.call(this, message, options);
       };

       // 重写 Room.prototype.send 方法
       RoomPrototype.sendBytes = function(message, options) {
          // 打印参数
console.log(
"%cwebsocket发送消息 bytes方法 : %c%s %c%s %c%s %c%s",
"color:red;font-size:15px;",
"color:blue;font-size:15px;", "参数1",
"color:green;font-size:15px;", message,
"color:purple;font-size:15px;", "参数2",
"color:orange;font-size:15px;", JSON.stringify(options)
);

           // 调用原始的方法
           originalSend.call(this, message, options);
       };
   }
       }
      if(settings.hookEmit && phaserEventEmitter) {
          console.log('override emit ')

              // 保存原始的 emit 函数
              const originalEmit = phaserEventEmitter.emit;

              phaserEventEmitter.emit = function(){


                   const excludeP1 = ['PLAYER_CLICKED','GAME_OBJECT_MOUSEOUT','GAME_OBJECT_MOUSEOVER','PLAYER_JOINED', 'PLAYER_REMOVED']
          const param1 = arguments[0]
          const param2 = arguments[1]
          if(excludeP1.includes(param1)) {
              //exclude 不打印
               // 调用原始的 emit 函数并返回结果
                  originalEmit.call(this, ...arguments)
              return;
          }
                 console.log(`%c hook emit 方法 : arguments=> %c ${JSON.stringify(arguments)}`,
          "color: red; font-size: 15px;",
          "color: blue; font-size: 15px;");

                      // 调用原始的 emit 函数并返回结果
                  originalEmit.call(this, ...arguments)
              }



      }






  } ,100)


})();





//自我开发区


function waitForElement(selector, timeout = 120000) {
  return new Promise((resolve, reject) => {
    // 延迟2秒后执行实际的等待逻辑
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
          resolve(element);
          return;
      }

      const observer = new MutationObserver((mutations, observer) => {
          const element = document.querySelector(selector);
          if (element) {
              observer.disconnect();
              resolve(element);
          }
      });

      observer.observe(document.documentElement, {
          childList: true,
          subtree: true
      });

      setTimeout(() => {
          observer.disconnect();
          reject(new Error('Timeout waiting for element'));
      }, timeout);
    }, 2000); // 延迟2秒
  });
}



async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



//去商店
document.getElementById('move_to_generalStore').addEventListener('click', () => {
  (async () => {
  unsafeWindow._joinMap("terravilla");
  await waitForElement('span.commons_coinBalance__d9sah');
  unsafeWindow._shunyi(3064.3333333333685,2921);
  await  Pathfinding(3444.6666666665865+80,2921);
  await waitForElement('span.commons_coinBalance__d9sah');

  })();
});
//去商店二楼
document.getElementById('move_to_two_generalStore').addEventListener('click', () => {
  (async () => {
    _shunyi(3046.2738185605385,2798-30);
  })();
});
//去游乐场
document.getElementById('move_to_carnival').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Carnival')
      {
        current_map=unsafeWindow._gameState.room.state._name;
        if(current_map!='Terravilla')
          {
          unsafeWindow._joinMap("terravilla");
          await waitForElement('span.commons_coinBalance__d9sah');
          }
     unsafeWindow._shunyi(3179.0350675393934,3021.417103102317);
     await Pathfinding2(3179.0350675393934,2294.3079605180706-60,200);     
     unsafeWindow._shunyi(3052.191197709601,2294.3079605180706);
     await Pathfinding2(3052.191197709601,1992.6412938514256-90,200);
     await sleep(2000)
     await waitForElement('span.commons_coinBalance__d9sah');
      }


  })();
});

//去泡温泉
document.getElementById('move_to_bath').addEventListener('click', () => {
  (async () => {
  unsafeWindow._joinMap("terravilla");
  await waitForElement('span.commons_coinBalance__d9sah');
  unsafeWindow._shunyi(2891.7401796778777,3034.333333333321);
  await Pathfinding(2286.7401796779327-80,3034.333333333321);
  await Pathfinding(2278.4068463446,2912.6666666666656-100);
  await sleep(2000);
  await waitForElement('span.commons_coinBalance__d9sah');
  await Pathfinding(3008,3130.666666666699-130);


  })();
});

//去储物柜move_to_Storage
document.getElementById('move_to_Storage').addEventListener('click', () => {
  (async () => {

  var current_map=unsafeWindow._gameState.room.state._name;
  if(current_map!='Drunken Goose Interior')
    {
      current_map=unsafeWindow._gameState.room.state._name;
      if(current_map!='Terravilla')
        {
        unsafeWindow._joinMap("terravilla");
        await waitForElement('span.commons_coinBalance__d9sah');
        }
    unsafeWindow._shunyi(2370.705543603434,3828.1212235208354);
    simulateKeyPress('w',4000);
    await waitForElement('span.commons_coinBalance__d9sah');
    }
    unsafeWindow._shunyi(3196.1244952976836,2981.6280392951376);
    simulateKeyPress('w',2000);
  })();
});


//全自动
document.getElementById('farming').addEventListener('click', async () => {
  const quantity = parseInt(document.getElementById('seed_quantity').value, 10);
  const item_id = document.getElementById('item_seed_id').value;
  await Harvest();  //收菜
  await PlantingFieldInfo(item_id,quantity);  //种植
  await wateringInfo()  //浇水
});

//托管种植auto_farming
let auto_farming=false;
document.getElementById('auto_farming').addEventListener('click', async () => {
  const auto_farming_info=document.getElementById('auto_farming_info');
  auto_farming=true;
  let  quantity = parseInt(document.getElementById('seed_quantity').value, 10);
  const item_id = document.getElementById('item_seed_id').value;
  let  myitem_quantity = await get_inventory_state_info_item(item_id);
  let success_farming=0
  let sum=0
  let sleep_state=0;
   //检查种子数量
  if(myitem_quantity<quantity)
    {
      auto_farming_info.value="种子数量不足";
      return 0
    }
    while(auto_farming)
      {
        let myenergy = await getmyenergy();
        if (myenergy<400&&sleep_state==0)
          {
            auto_farming_info.value=`能量不足去睡觉!`;
            await gotomyspeckhouse();
            await Pathfinding2(3284.776057321333,3898.2551897468857,500);
            await gotomyhousesleep();
            await sleep(2000);
            await leavehouse();
            sleep_state=1;
          }
        sum = await Harvest();  //收菜
        auto_farming_info.value=`成功收菜数:${sum}`;
        success_farming+=sum;
        

        if(success_farming>=quantity)
          {
            break;
          }


        sum = await PlantingFieldInfo(item_id,quantity);  //种植
        auto_farming_info.value=`成功收种植:${sum}`;
        await wateringInfo();  //浇水
        auto_farming_info.value=`当前总种植成功数量:${success_farming}`;
        await sleep(48000);

      }
      auto_farming=false;
      auto_farming_info.value=`种植完成!!!!!`;
});




//脱机挖矿
let auto_mining=false;
document.getElementById('start_mining').addEventListener('click', async () => {


  auto_mining=true;
  let sleep_state=1;
  let sum = 0;
  const item_id = document.getElementById('draft_item').value;
  const my_inv_slot =await get_inventory_slot_info_item(item_id);
   //检查种子数量
  if(my_inv_slot<0)
    {
      console.log("没有搞子!");
      return 0
    }
    while(auto_mining)
      {
        let myenergy = await getmyenergy();
        if (myenergy<400&&sleep_state==0)
          {

            await gotomyspeckhouse();
            await Pathfinding2(3284.776057321333,3898.2551897468857,500);
            await gotomyhousesleep();
            await sleep(2000);
            await leavehouse();
            sleep_state=1;
          }
          if(sum%2==0)
            {
              var  mymine_info=getmineNodesInfov3(true);
            }
            else
            {
              var  mymine_info=getmineNodesInfov3(false);
            }
        

          for (let mine of mymine_info) {
            if (mine.state == "waiting") {
              const id = mine.id;
              await  Pathfinding5(mine.center_x+50, mine.center_y+90,600,40,300);
              const command = {
                id: item_id,
                type: "entity",
                slot: my_inv_slot,
                mid: id
              };

              unsafeWindow._sendCommand('ui', command);
             
            }
            else if (mine.state == "ready")
              {
                const id = mine.id;
                await  Pathfinding5(mine.center_x+50, mine.center_y+90,600,40,300);
                  const  command = {
                  impact: "click",
                  entity:"ent_mine_01",
                  mid: id,
                  inputs:[mine.center_x+5,mine.center_y+9]
                };
                unsafeWindow._sendCommand('clickEntity', command);
                await sleep(1000);
                const command2 = {
                  id: item_id,
                  type: "entity",
                  slot: my_inv_slot,
                  mid: id
                };
  
                unsafeWindow._sendCommand('ui', command2);


                
              }
              await sleep(800);
          }
          await sleep(5000);
          sum+=1;

      }
});


document.getElementById('stop_mining').addEventListener('click', () => {
  (async () => {
    auto_mining = false;

  })();
 });

//丰收
document.getElementById('Harvest').addEventListener('click', async () => {
  await Harvest();  //收菜

});

//浇水
document.getElementById('wateringInfo').addEventListener('click', async () => {
  await wateringInfo()  //浇水

});

//去指定地图
document.getElementById('move_to_other').addEventListener('click', async () => {
  const other_map_id = document.getElementById('other_map_id').value;
  console.log(other_map_id);
  unsafeWindow._joinMap("pixelsNFTFarm-"+other_map_id);
  await waitForElement('span.commons_coinBalance__d9sah');
});


//move_to_tutorialHouse去烹饪房
document.getElementById('move_to_tutorialHouse').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Tutorial House')
      {
        current_map=unsafeWindow._gameState.room.state._name;
        if(current_map!='Terravilla')
          {
          unsafeWindow._joinMap("terravilla");
          await waitForElement('span.commons_coinBalance__d9sah');
          }
     unsafeWindow._shunyi(3205.4026831583465,3021.417103102317);
     await Pathfinding2(3205.4026831583465,2096.417103102401-80,600);
     await sleep(2000);
     await waitForElement('span.commons_coinBalance__d9sah');
      }
      

  })();
});


//获取自己土地状态
function getMySoilNodesInfo() {
  const result = [];
  const entities = unsafeWindow._gameState.scene.crops;

  entities.forEach((value, key) => {
    result.push({ id: key, state: value.state, growTime: value.growTime ,needsWater:value.needsWater,center_x:value.propCache.position.x,center_y:value.propCache.position.y});
  });


  result.forEach(node => {
    console.log(`ID: ${node.id}, State: ${node.state}`);
  });
  result.sort((a, b) => b.center_y - a.center_y)

  return result;
}

//获取自己土地状态游乐园版本
function getMySoilNodesInfov2(x,y) {
  const result = [];
  const entities = unsafeWindow._gameState.scene.crops;
  console.log(entities);
  entities.forEach((value, key) => {
    if(value.propCache.position.x>x&&value.propCache.position.y>y)
      {
    result.push({ id: key, state: value.state, growTime: value.growTime ,needsWater:value.needsWater,center_x:value.propCache.position.x,center_y:value.propCache.position.y});
      }
  });

  result.forEach(node => {
    console.log(`ID: ${node.id}, State: ${node.state}`);
  });
  result.sort((a, b) => b.center_y - a.center_y)

  return result;
}


//去自己的房子
async function gotomyspeckhouse() {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.gameEntity&&value.gameEntity.id === 'ent_speckHouse') {
      // 假设每个SoilNode实例都有id和state属性
      result.push({ id: key,center_x:value.x,center_y:value.y});
    }
  });

  await Pathfinding3(result[0].center_x,result[0].center_y+140,800);
  _shunyi(result[0].center_x,result[0].center_y+140);
  await sleep(1000);
  await Pathfinding3(result[0].center_x,result[0].center_y-150,800);
  await sleep(2000);
  await waitForElement('span.commons_coinBalance__d9sah');

  }
//在房子睡觉
async function gotomyhousesleep() {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.gameEntity&&value.gameEntity.id === 'ent_bed_covers') {
      // 假设每个SoilNode实例都有id和state属性
      result.push({ id: value.propCache.id,center_x:value.x,center_y:value.y});
    }
  });
  unsafeWindow._sendCommand('clickEntity', { "mid": result[0].id, "entity": 'ent_bed_covers' , "impact": "click", "inputs": [result[0].center_x+3,result[0].center_y+5] });
  await sleep(32000);
  await waitForElement('span.commons_coinBalance__d9sah');

  }
//离开房子
async function leavehouse() {
  unsafeWindow._joinMap("terravilla");
  await sleep(2000);
  await waitForElement('span.commons_coinBalance__d9sah');
  const map_id =_gameState.selfPlayer.farms.$items.get(0);
  unsafeWindow._joinMap(map_id);
  await sleep(2000);
  await waitForElement('span.commons_coinBalance__d9sah');
  _shunyi(3185.766949366197,3225.6542445588107);
  }
//获取自己的能量
async function getmyenergy() {
    return _gameState.selfPlayer.energy._level;
  }
//收菜itm_shears
async function Harvest() {
  const my_inv_slot =await get_inventory_slot_info_item("itm_shears_01");
  if(my_inv_slot==-1)
    {
      console.log("没有剪刀");
      return 0;
    }
  const item_id = document.getElementById('item_seed_id').value;

  // var soliState = getMySoilNodesInfo();
  var soliState = getSoilNodesInfov3();
  
  let sum = 0;

  for (let soliDict of soliState) {
    if (soliDict.state === "grown") {
      const id = soliDict.id;
      await Pathfinding2(soliDict.center_x,soliDict.center_y,700);
      unsafeWindow._sendCommand('ui', {"id":"itm_shears_01","type":"entity","slot":my_inv_slot,"mid":id});
      console.log(`Command executed for ID: ${id}`);
      sum += 1;

      // 等待0.6秒后执行下一个命令
      await sleep(600);
    }
  }

  console.log(`成功收菜数: ${sum}`);

  soliState = getMySoilNodesInfo();
 

  for (let soliDict of soliState) {
    if (soliDict.state.includes("Dead")) {
      const id = soliDict.id;
      await Pathfinding2(soliDict.center_x,soliDict.center_y,800);
      unsafeWindow._sendCommand('ui', {"id":"itm_shears_01","type":"entity","slot":my_inv_slot,"mid":id});
      console.log(`Command executed for ID: ${id}`);



      // 等待2秒后执行下一个命令
      await sleep(2000);
    }
  }

  return sum;
}

//铲除死亡的种子
async function CroppingInfo() {
  const soliState = getMySoilNodesInfo();
  let sum = 0;

  for (let soliDict of soliState) {
    if (soliDict.state.includes("dead")) {
      const id = soliDict.id;

      unsafeWindow._sendCommand('ui', {"id":"itm_shears","type":"entity","slot":2,"mid":id});
      console.log(`Command executed for ID: ${id}`);

      sum += 1;

      // 等待2秒后执行下一个命令
      await sleep(2000);
    }
  }

  console.log(`成功铲除田地: ${sum}`);
  return 1;
}
//获取当前地图土地状态
function getSoilNodesInfo() {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.gameEntity.name === 'SoilNode') {
      // 假设每个SoilNode实例都有id和state属性
      result.push({ id: key, state: value.state ,center_x:value.propCache.position.x,center_y:value.propCache.position.y});
    }
  });

  // 根据center_x的大小对result进行降序排序
  result.sort((a, b) => b.center_y - a.center_y)

  console.log(result);
  // result.forEach(node => {
  //   console.log(`ID: ${node.id}, State: ${node.state}`);
  // });

  return result;
}

function sortSubArray(arr, start, end, ascending) {
  const subArray = arr.slice(start, end + 1);
  if (ascending) {
    subArray.sort((a, b) => a.center_x - b.center_x);
  } else {
    subArray.sort((a, b) => b.center_x - a.center_x);
  }
  // 将排序好的子数组替换回原数组
  for (let i = start; i <= end; i++) {
    arr[i] = subArray[i - start];
  }
}


//获取土地状态3章节
function getSoilNodesInfov3() {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.gameEntity&&(value.gameEntity.id === 'ent_allcrops'||value.gameEntity.id ==='ent_playersoil')) {
      // 假设每个SoilNode实例都有id和state属性
      result.push({ id: key, state: value.currentState.state ,center_x:value.propCache.position.x,center_y:value.propCache.position.y,displayInfo:value.currentState.displayInfo.format});
    }
  });

  // 根据center_y的大小进行降序排序
  result.sort((a, b) => b.center_y - a.center_y);

  // 使用一个变量来记录当前的排序方式，初始为降序
  let ascending = false;
  let currentCenterY = result.length > 0 ? result[0].center_y : null;
  let startIndex = 0;

  // 对结果数组进行进一步的排序
  for (let i = 1; i < result.length; i++) {
    if (result[i].center_y !== currentCenterY) {
      // 如果center_y值变化，切换排序方式
      sortSubArray(result, startIndex, i - 1, ascending);
      ascending = !ascending;
      currentCenterY = result[i].center_y;
      startIndex = i;
    }
  }

  // 最后一组相同center_y的子数组需要排序
  if (startIndex < result.length) {
    sortSubArray(result, startIndex, result.length - 1, ascending);
  }
  // result.forEach(node => {
  //   console.log(`ID: ${node.id}, State: ${node.state}`);
  // });

  return result;
}


//获取矿场信息
function getmineNodesInfov3(isjiangxu) {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.gameEntity&&(value.gameEntity.id === 'ent_mine_01')) {
      // 假设每个SoilNode实例都有id和state属性
      result.push({ id: key, state: value.currentState.state ,center_x:value.propCache.position.x,center_y:value.propCache.position.y,displayInfo:value.currentState.displayInfo.format});
    }
  });

  if(isjiangxu==true)
    {
  // 根据center_y的大小进行降序排序
  result.sort((a, b) => b.center_x - a.center_x);
    }
    else{
      result.sort((a, b) => a.center_x - b.center_x);
    }

  // // 使用一个变量来记录当前的排序方式，初始为降序
  // let ascending = false;
  // let currentCenterY = result.length > 0 ? result[0].center_y : null;
  // let startIndex = 0;

  // // 对结果数组进行进一步的排序
  // for (let i = 1; i < result.length; i++) {
  //   if (result[i].center_y !== currentCenterY) {
  //     // 如果center_y值变化，切换排序方式
  //     sortSubArray(result, startIndex, i - 1, ascending);
  //     ascending = !ascending;
  //     currentCenterY = result[i].center_y;
  //     startIndex = i;
  //   }
  // }

  // // 最后一组相同center_y的子数组需要排序
  // if (startIndex < result.length) {
  //   sortSubArray(result, startIndex, result.length - 1, ascending);
  // }
  // result.forEach(node => {
  //   console.log(`ID: ${node.id}, State: ${node.state}`);
  // });

  return result;
}




//获取土地v2版本
function getSoilNodesInfov2(x,y) {
  const result = [];
  const entities = _gameState.scene.entities;

  entities.forEach((value, key) => {
    if (value.constructor.name === 'SoilNode') {
      // 假设每个SoilNode实例都有id和state属性
      if(value.propCache.position.x>x&&value.propCache.position.y>y)
        {
      result.push({ id: key, state: value.state ,center_x:value.propCache.position.x,center_y:value.propCache.position.y});
        }
    }
  });

  // 根据center_x的大小对result进行降序排序
  result.sort((a, b) => b.center_y - a.center_y)

  console.log(result);
  // result.forEach(node => {
  //   console.log(`ID: ${node.id}, State: ${node.state}`);
  // });

  return result;
}

//获取自身角色mid
async function getselfplayermid() {
 const mid = _gameState.selfPlayer.quests.$items.entries().next().value[1]._player;
 return mid;
}

//获取自身角色位置

async function getselfplayeposition() {
  const mid = await getselfplayermid();
  console.log("mid:"+mid)
  const play_info =_gameState.players;
  for (const [key, value] of play_info) {
    if (key === mid) {
      return  {center_x: value._position._x , center_y: value._position._y}
    }
  }
 }
 

//种植
async function PlantingFieldInfo(Item_ID, item_sum = null) {
  const my_inv_slot =await get_inventory_slot_info_item(Item_ID);
  const my_item_quantity =await get_inventory_state_info_item(Item_ID);

  if(my_inv_slot==-1)
    {
      console.log("没有物品");
      return 0;
    }

    const my_water_slot =await get_inventory_slot_info_item("itm_rustyWateringCan");
    if(my_water_slot==-1)
      {
        console.log("没有水壶");
        return 0;
      }



  const item_id = document.getElementById('item_seed_id').value;

  // if(item_id=="itm_cottoncandySeed"||item_id=="itm_grump")
  //   {
      
  //     var  soliState = getSoilNodesInfov2(3514.899530636983,2827.083585027453);
  //   }
  //   else
  //   {
  //     var soliState = getSoilNodesInfo();
  //   }
  var soliState = getSoilNodesInfov3();


  if (isNaN(item_sum)) 
  {
  item_sum = soliState.length;
  }
  console.log(item_sum);
  if(item_sum>=my_item_quantity)
  {
   item_sum=my_item_quantity;
  }


  let sum = 0;
  for (let soliDict of soliState) {
    if (soliDict.state == "empty") {
      const id = soliDict.id;
      await Pathfinding2(soliDict.center_x,soliDict.center_y,700);
      const command = {
        id: Item_ID,
        type: "entity",
        slot: my_inv_slot,
        mid: id
      };

      unsafeWindow._sendCommand('ui', command);
      const command2 = {
        id: "itm_rustyWateringCan",
        type: "entity",
        slot: my_water_slot,
        mid: id
      };

      unsafeWindow._sendCommand('ui', command2);

      sum += 1;


      // 等待 0.6 秒后执行下一个命令
      await sleep(1000);
        if(sum>=item_sum)
        {
        break;
        }
    }

  }

  console.log(`成功种植田地: ${sum}`);
  return sum;
}

//种菜浇水收割自动寻路算法
async function Pathfinding(targetX, targetY) {
  try {
    while (true) {
      let selfPosition = await getselfplayeposition();
      console.log(selfPosition);

      let deltaX = selfPosition.center_x - targetX;
      let deltaY = selfPosition.center_y - targetY;

      if (Math.abs(deltaX) <= 80 && Math.abs(deltaY) <= 80) {
        console.log('Reached target position');
        break; // 退出循环
      }

      if (deltaX > 80) {
        simulateKeyPress('a', 300);
      } else if (deltaX < -80) {
        simulateKeyPress('d', 300);
      }

      if (deltaY > 80) {
        simulateKeyPress('w', 300);
      } else if (deltaY < -80) {
        simulateKeyPress('s', 300);
      }

      await sleep(100); // 加入一个短暂的延迟，防止无限快速循环
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return 0;
  }
}

async function Pathfinding2(targetX, targetY,dur) {
  try {
    while (true) {
      let selfPosition = await getselfplayeposition();
      console.log(selfPosition);

      let deltaX = selfPosition.center_x - targetX;
      let deltaY = selfPosition.center_y - targetY;

      if (Math.abs(deltaX) <= 80 && Math.abs(deltaY) <= 80) {
        console.log('Reached target position');
        break; // 退出循环
      }

      if (deltaX > 80) {
        simulateKeyPress('a', dur);
      } else if (deltaX < -80) {
        simulateKeyPress('d', dur);
      }

      if (deltaY > 80) {
        simulateKeyPress('w', dur);
      } else if (deltaY < -80) {
        simulateKeyPress('s', dur);
      }

      await sleep(600); // 加入一个短暂的延迟，防止无限快速循环
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return 0;
  }
}

//挖矿专用
async function Pathfinding4(targetX, targetY,keydur,maxmetric,sleep_time,max_step) {
  try {
    let sum = 0
    while (sum<=max_step) {
      let selfPosition = await getselfplayeposition();
      console.log(selfPosition);

      let deltaX = selfPosition.center_x - targetX;
      let deltaY = selfPosition.center_y - targetY;

      if (Math.abs(deltaX) <= maxmetric && Math.abs(deltaY) <= maxmetric) {
        console.log('Reached target position');
        break; // 退出循环
      }

      if (deltaX > maxmetric) {
        simulateKeyPress('a', keydur);
      } else if (deltaX < -maxmetric) {
        simulateKeyPress('d', keydur);
      }

      if (deltaY > maxmetric) {
        simulateKeyPress('w', keydur);
      } else if (deltaY < -maxmetric) {
        simulateKeyPress('s', keydur);
      }

      await sleep(sleep_time); // 加入一个短暂的延迟，防止无限快速循环
      sum+=1;
    }
    _shunyi(targetX,targetY);
  } catch (error) {
    console.error('An error occurred:', error);
    return 0;
  }
}


//挖矿专用
async function Pathfinding5(targetX, targetY,keydur,maxmetric,sleep_time) {
  try {
    let sum = 0
    while (true) {
      let selfPosition = await getselfplayeposition();
      console.log(selfPosition);

      let deltaX = selfPosition.center_x - targetX;
      let deltaY = selfPosition.center_y - targetY;

      if (Math.abs(deltaX) <= maxmetric) {
        console.log('Reached target position');
        break; // 退出循环
      }

      if (deltaX > maxmetric) {
        simulateKeyPress('a', keydur);
      } else if (deltaX < -maxmetric) {
        simulateKeyPress('d', keydur);
      }

      // if (deltaY > 400) {
      //   simulateKeyPress('w', keydur);
      // } else if (deltaY < -400) {
      //   simulateKeyPress('s', keydur);
      // }

      await sleep(sleep_time); // 加入一个短暂的延迟，防止无限快速循环
      sum+=1;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return 0;
  }
}


async function Pathfinding3(targetX, targetY,dur) {
  try {
    while (true) {
      let selfPosition = await getselfplayeposition();
      console.log(selfPosition);

      let deltaX = selfPosition.center_x - targetX;
      let deltaY = selfPosition.center_y - targetY;

      if (Math.abs(deltaX) <= 130 && Math.abs(deltaY) <= 130) {
        console.log('Reached target position');
        break; // 退出循环
      }

      if (deltaX > 130) {
        simulateKeyPress('a', dur);
      } else if (deltaX < -130) {
        simulateKeyPress('d', dur);
      }

      if (deltaY > 130) {
        simulateKeyPress('w', dur);
      } else if (deltaY < -130) {
        simulateKeyPress('s', dur);
      }

      await sleep(400); // 加入一个短暂的延迟，防止无限快速循环
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return 0;
  }
}
 

//浇水
async function wateringInfo() {
  const my_inv_slot =await get_inventory_slot_info_item("itm_rustyWateringCan");
  if(my_inv_slot==-1)
    {
      console.log("没有水壶");
      return 0;
    }
  //   if (item_id == "itm_cottoncandySeed" || item_id == "itm_grump") {
  //     var soliState = getMySoilNodesInfov2(3514.899530636983, 2827.083585027453);
  // } else {
  //     var soliState = getMySoilNodesInfo();
  // }
  var soliState = getSoilNodesInfov3();
  
  let sum = 0;
  for (let soliDict of soliState) {
    if (soliDict.displayInfo.includes("Needs Water")) {
      await Pathfinding2(soliDict.center_x,soliDict.center_y,700);
      const id = soliDict.id;
      const command = {
        id: "itm_rustyWateringCan",
        type: "entity",
        slot: my_inv_slot,
        mid: id
      };

      unsafeWindow._sendCommand('ui', command);
      console.log(`Command executed for ID: ${id}`);
      sum += 1;

      // 等待0.6秒后执行下一个命令
      await sleep(700);
    }
  }

  console.log(`成功浇水田地: ${sum}`);
  return 1;
}

//砍树
async function Chopping_trees_info() {
  var current_map=unsafeWindow._gameState.room.state._name;
  if(current_map!='Terravilla')
    {
      unsafeWindow._joinMap("terravilla");
      await waitForElement('span.commons_coinBalance__d9sah');
      unsafeWindow._shunyi(2993.1328419750316,3121.3235572106346);
      await Pathfinding(2970.0854674019038,3988.50677207877+80);
      await Pathfinding(2781.466175308384-80,3988.50677207877+80);
    }
  const my_inv_slot =await get_inventory_slot_info_item("itm_axe");
  if (my_inv_slot==-1)
    {
      console.log("没有斧子");
      return 0;
    }
  let entitiy_info =unsafeWindow._gameState.scene.entities;
  let tree_info =[];
  entitiy_info.forEach((value, index) => {
    if(value.gameEntity && value.gameEntity.id === 'ent_playerTreeLand5v1')
    {
      tree_info.push({id:index,state: value.currentState.state})
    }
    });
    simulateKeyPress('s',1000);

    for (const tree of tree_info)
    {
      const command = {
          id: "itm_axe",
          type: "entity",
          slot: my_inv_slot,
          mid: tree.id
      };
      for (let i = 0; i < 20; i++) {
        unsafeWindow._sendCommand('ui', command);  // 直接执行 _sendCommand 函数
        await sleep(1000); // 替代 sleep(1)
      }
    }
    let entitiy_info2 =unsafeWindow._gameState.scene.entities;
    let wood_info =[];
    entitiy_info2.forEach((value, index) => {
      if(value.gameEntity && value.gameEntity.id === 'ent_wood')
      {
        wood_info.push({id:index,state: value.currentState.state})
      }
    });
    for (const wood of wood_info)
      {
        const command = {
            entity: "ent_wood",
            impact: "magneto",
            mid: wood.id
        };
        unsafeWindow._sendCommand('clickEntity', command);  // 直接执行 _sendCommand 函数
        await sleep(2000); // 替代 sleep(1)

      }




}

//按下键盘持续几毫秒
function simulateKeyPress(key, duration) {
  const keyCode = key.toUpperCase().charCodeAt(0);

  // 创建并派发keydown事件
  const keyDownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: `Key${key.toUpperCase()}`,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true
  });
  document.body.dispatchEvent(keyDownEvent);

  // 等待指定的时间后创建并派发keyup事件
  setTimeout(() => {
      const keyUpEvent = new KeyboardEvent('keyup', {
          key: key,
          code: `Key${key.toUpperCase()}`,
          keyCode: keyCode,
          which: keyCode,
          bubbles: true
      });
      document.body.dispatchEvent(keyUpEvent);
  }, duration);
}

//砍树事件
document.getElementById('Chopping').addEventListener('click', () => {
  (async () => {
    // var current_map=unsafeWindow._gameState.room.state._name;
    // if(current_map!='Terravilla')
    //   {
    //     unsafeWindow._joinMap("terravilla");
    //     await waitForElement('span.commons_coinBalance__d9sah');

    //   }
    await Chopping_trees_info();
    
  })();
});

//获取实体信息各种信息
async function get_entity_info(item_id) {
  const entity_info = unsafeWindow._gameState.scene.entities;
  const result = [];
  entity_info.forEach((value, index) => {
    console.log(entity_info);
      if (value.gameEntity && value.gameEntity.id === item_id) {
          if (value.currentState.utcRefresh) {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: value.currentState.utcRefresh,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          } else {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: -1,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          }
      } 
    });
    return result;


  
}
//养牛
async function get_cow() {
  var cow = await get_entity_info("ent_cow_pickup");
  //领牛
  for (const cow of result) {
    if(cow.state=='ready')
      {
        unsafeWindow._shunyi(bee.center_x,bee.center_y+15);
        await sleep(2000);
        simulateKeyPress('s',500);
        unsafeWindow._sendCommand('clickEntity',{"mid":bee.id,"impact":"click","entity":"ent_cow_pickup","inputs":[bee.center_x,bee.center_y]});
        await sleep(2000);
      }
  }
  await sleep(2000);
  
  cow =await get_entity_info("ent_cow_pickup");
  for (const cow of result) {
    if(cow.state=='ready')
      {
        unsafeWindow._shunyi(bee.center_x,bee.center_y+15);
        await sleep(2000);
        simulateKeyPress('s',500);
        unsafeWindow._sendCommand('clickEntity',{"mid":bee.id,"impact":"click","entity":"ent_cow_pickup","inputs":[bee.center_x,bee.center_y]});
        await sleep(2000);
      }
  }

  await sleep(2000);
  //返回牛牛时间
  cow =await get_entity_info("ent_cow_pickup");
  for (const cow of result) {
    return cow.time;
  
  }
}
//养牛事件
document.getElementById('get_cow').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Terravilla')
      {
        unsafeWindow._joinMap("terravilla");
        await waitForElement('span.commons_coinBalance__d9sah');
        
      }
      await get_cow();

      

    
  })();
});


//烹饪
async function cooking_sustained_info(quantity,item_id) {
  unsafeWindow.window._shunyi(2743.162491352426,2926.948969705832);
  let entity = unsafeWindow._gameState.scene.entities;
  let entity_name="ent_stove";
  let cooking_work_id="";
  let entity_location=[4182.5,3835];
  for (const [index, value] of entity.entries())
  {
    if (value.gameEntity && value.gameEntity.id == 'ent_stove') {
      cooking_work_id = index;
        if (value.currentState.state === "ready") {
          unsafeWindow._sendCommand('clickEntity', { "mid": cooking_work_id, "entity": "ent_stove", "impact": "click", "inputs": entity_location });
        }
        await sleep(3000);
        _sendCommand('clickEntity',{"mid":cooking_work_id,"entity":entity_name,"impact":"click","inputs": entity_location });
        await sleep(2000);
        break;
    }
  }
  let i = 0;
  while(i<quantity)
  {
  let entity2=null;
  let state="";
  entity2 = unsafeWindow._gameState.scene.entities;
  for (const [index, value] of entity.entries())
    {
    if (value.gameEntity && value.gameEntity.id === 'ent_stove') {
        state=value.currentState.state;
        break;
    }
    }
     if(state=='ready')
      {
        unsafeWindow._sendCommand('clickEntity', { "mid": cooking_work_id, "entity": "ent_stove", "impact": "click", "inputs": entity_location });
        await sleep(2000);
        i=i+1;
      }
      else if (state=='loaded')
        {
          unsafeWindow._sendCommand('clickEntity',{"mid":cooking_work_id,"impact":"startCraft","entity":"ent_stove","inputs":[item_id,1]});
          await sleep(2000);
        }
        else{
          await sleep(5000);
        }
  }
  await sleep(2000);
}


//烹饪事件
document.getElementById('cooking').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Tutorial House')
      {
        current_map=unsafeWindow._gameState.room.state._name;
        if(current_map!='Terravilla')
          {
          unsafeWindow._joinMap("terravilla");
          await waitForElement('span.commons_coinBalance__d9sah');
          }
     unsafeWindow._shunyi(3205.4026831583465,3021.417103102317);
     await Pathfinding2(3205.4026831583465,2096.417103102401-80,600);
     await sleep(2000);
     await waitForElement('span.commons_coinBalance__d9sah');
      }
    let quantity = document.getElementById('cooking_quantity').value;
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity)) {
      quantity = 1;
    }
    current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Tutorial House')
      {
        console.log("为在房间内");
        return 0;
      }
    const item_id = document.getElementById('item_cooking_id').value;
    cooking_sustained_info(quantity,item_id);
  })();
});

//制木
async function Making_wooden_sustained_info(quantity,item_id) {
  
  var current_map=unsafeWindow._gameState.room.state._name;
  if(current_map!='Terravilla')
    {
      unsafeWindow._joinMap("terravilla");
      await waitForElement('span.commons_coinBalance__d9sah');
      _shunyi(2990.1932596893603,3097.325020681142);
      await Pathfinding2(2990.1932596893603,3930.6583540143997,1000);
      _shunyi(2986.912319679503,3865.6205035197345);
      await Pathfinding2(4110.071550549639+50,3865.6205035197345,1000);
    }
  let entity = unsafeWindow._gameState.scene.entities;
  let entity_name="ent_woodwork";
  let entity_location=[4059.6160462492135, 3775.7426350879955];
  let wooden_work_id="";
  for (const [index, value] of entity.entries())
  {
    if (value.gameEntity && value.gameEntity.id == 'ent_woodwork') {
      wooden_work_id = index;
        if (value.currentState.state === "ready") {
          unsafeWindow._sendCommand('clickEntity', { "mid": wooden_work_id, "entity": entity_name, "impact": "click", "inputs": entity_location });
        }
        await sleep(3000);
        _sendCommand('clickEntity',{"mid":wooden_work_id,"entity":entity_name,"impact":"click","inputs": entity_location })
        break;
    }
    
  }
  for (let i = 0; i < quantity; i++) {
    let entity2=null;
    let state="";
    unsafeWindow._sendCommand('clickEntity',{"mid":wooden_work_id,"impact":"startCraft","entity":entity_name,"inputs":[item_id,1]});
    await sleep(2000);
    while(state!='ready')
      {
        await sleep(15000);
        entity2 = unsafeWindow._gameState.scene.entities;
        for (const [index, value] of entity.entries())
          {
          if (value.gameEntity && value.gameEntity.id === 'ent_woodwork') {
              state=value.currentState.state;
              break;
          }
          }

      }
      unsafeWindow._sendCommand('clickEntity', { "mid": wooden_work_id, "entity": entity_name, "impact": "click", "inputs": entity_location });
  }
  await sleep(2000);
}


//制木事件
document.getElementById('wooden').addEventListener('click', () => {
  (async () => {
    let quantity = document.getElementById('wooden_quantity').value;
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity)) {
      quantity = 1;
    }
    const item_id = document.getElementById('item_wooden_id').value;
    Making_wooden_sustained_info(quantity,item_id);
  })();
});

//酿酒
async function Brewing_info(quantity,item_id) {
  var current_map=unsafeWindow._gameState.room.state._name;
  if(current_map!='Terravilla')
    {
      unsafeWindow._joinMap("terravilla");
      await waitForElement('span.commons_coinBalance__d9sah');
      _shunyi(3025.9307533057977,3120.171529188809);
      await Pathfinding2(3023.573730701842,3862.5285517926973+20,1000);
      _shunyi(3023.573730701842,3862.5285517926973);
      await Pathfinding2(2016.9070640352618-20,3862.5285517926973,1000);
      _shunyi(2022.8278740723483,3771.8913937396474);
    }
     
  let entity = unsafeWindow._gameState.scene.entities;
  let entity_name="ent_winery";
  let entity_location=[1997.5,3886.5];
  let wooden_work_id="";
  for (const [index, value] of entity.entries())
  {
    if (value.gameEntity && value.gameEntity.id == entity_name) {
      wooden_work_id = index;
        if (value.currentState.state === "ready") {
          unsafeWindow._sendCommand('clickEntity', { "mid": wooden_work_id, "entity": entity_name, "impact": "click", "inputs": entity_location });
          await sleep(2000);
        }
        unsafeWindow._sendCommand('clickEntity', { "mid": wooden_work_id, "entity": entity_name, "impact": "click", "inputs": entity_location });
        await sleep(2000);
        break;
    }
  }
  let i = 0;
  while(i<quantity)
  {
  let entity2=null;
  let state="";
  entity2 = unsafeWindow._gameState.scene.entities;
  for (const [index, value] of entity.entries())
    {
    if (value.gameEntity && value.gameEntity.id === entity_name) {
        state=value.currentState.state;
        break;
    }
    }
     if(state=='ready')
      {
        unsafeWindow._sendCommand('clickEntity', { "mid": wooden_work_id, "entity": entity_name , "impact": "claim"});
        await sleep(2000);
        i=i+1;
      }
      else if (state=='loaded')
        {
          unsafeWindow._sendCommand('clickEntity',{"mid":wooden_work_id,"impact":"startCraft","entity": entity_name ,"inputs":[item_id,1]});
          await sleep(2000);
        }
        else{
          await sleep(8000);
        }
  }
  await sleep(2000);
}


//酿酒事件
document.getElementById('Brewing').addEventListener('click', () => {
  (async () => {
    let quantity = document.getElementById('Brewing_quantity').value;
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity)) {
      quantity = 1;
    }
    const item_id = document.getElementById('item_Brewing_id').value;
    Brewing_info(quantity,item_id);
  })();
});



//检查可提交的委托数需需要的物品以及数量:
async function check_order_info(ready) {
  let orderinfo_text=document.getElementById('orderinfo_text');
  let  ready_order_info=document.getElementById('ready_order');
   unsafeWindow._sendCommand('sellOrders',{"storeId":"str_bucksGalore"});
   await sleep(5000);
   let ready_order=0;
   let  order_info = [];
   let order = unsafeWindow.sellOrdersData.str_bucksGalore.orders;
   order.forEach((value, index) => {
    if (value.completedAt == null) {
      order_info.push({
            sellOrderIndex: index,
            request_itemId: value.request.itemId,
            request_quantity: value.request.quantity,
            reward_currencyId: value.reward.currency.currencyId,
            reward_currencyamount: value.reward.currency.amount,
            reward_skillType: value.reward.skill.skillType,
            reward_skillexp: value.reward.skill.xp,
            iscompleted: 0
        });
    } else {
      order_info.push({ iscompleted: 1 });
    }
  });
    let self_items= await get_inventory_state_info();
    let need_item=[];
    let ready_order_id=[];
    for (const [index, order_value] of order_info.entries())
      {
        if(order_value.iscompleted==0)
          {
            for (const [index, self_value] of self_items.entries())
              {
                if(self_value.name==order_value.request_itemId)
                  {
                    if(self_value.quantity>=order_value.request_quantity)
                      {
                        ready_order_id.push(order_value.sellOrderIndex);
                        ready_order+=1;
                        break;
                      }
                      else
                      {
                        need_item.push({"requset_item":order_value.request_itemId,"request_quantity":order_value.request_quantity-self_value.quantity,"reward_currencyId":order_value.reward_currencyId
                          ,"reward_currencyamount":order_value.reward_currencyamount
                        });
                        break;
                      }
                  }
              }
              need_item.push({"requset_item":order_value.request_itemId,"request_quantity":order_value.request_quantity,"reward_currencyId":order_value.reward_currencyId
                          ,"reward_currencyamount":order_value.reward_currencyamount});

          }
      }
    let  resultStrings = [];

    // 遍历数组并提取每个字典中的 requset_item 和 request_quantity 变量
    for (let i = 0; i < need_item.length; i++) {
        const item = need_item[i];
        const requset_item = item.requset_item;
        const request_quantity = item.request_quantity;
        const reward_currencyId=item.reward_currencyId;
        const reward_currencyamount=item.reward_currencyamount;
        const resultString = `requset_item: ${requset_item}, request_quantity: ${request_quantity}, reward_currencyId:${reward_currencyId},reward_currencyamount:${reward_currencyamount}`;
        resultStrings.push(resultString);
    }

      // 将所有字符串拼接成一个字符串，使用换行符分隔
      const finalResult = resultStrings.join('***');

      // 打印最终的拼接结果
      console.log(finalResult);
      console.log(ready_order);
      orderinfo_text.value=finalResult;
      ready_order_info.value=ready_order;
    if(ready==true)
    return ready_order_id;
    else
        return need_item;
}



//检查可提交的委托数需需要的物品以及数量:
async function check_order_info_v2() {
  let orderinfo_text=document.getElementById('orderinfo_text');
  let  ready_order_info=document.getElementById('ready_order');
   unsafeWindow._sendCommand('sellOrders',{"storeId":"str_bucksGalore"});
   await sleep(5000);
   let ready_order=0;
   let  order_info = [];
   let order = unsafeWindow.sellOrdersData.str_bucksGalore.orders;
   order.forEach((value, index) => {
    if (value.completedAt == null) {
      order_info.push({
            sellOrderIndex: index,
            request_itemId: value.request.itemId,
            request_quantity: value.request.quantity,
            reward_currencyId: value.reward.currency.currencyId,
            reward_currencyamount: value.reward.currency.amount,
            reward_skillType: value.reward.skill.skillType,
            reward_skillexp: value.reward.skill.xp,
            iscompleted: 0
        });
    } else {
      order_info.push({ iscompleted: 1 });
    }
  });
  return order_info
}



async function get_inventory_state_info()
{
  const result = [];
  const entities =unsafeWindow._gameState.selfPlayer.inventory.slots.$items;
             entities.forEach((value, key) => {

                 result.push({ name: value.item, quantity: value.quantity });

             });

  return result;

}

//检查委托
document.getElementById('check_order').addEventListener('click', () => {
  (async () => {

      var selectElement = document.getElementById('buy_item_id');
      selectElement.innerHTML = '';

      let order_info =  await check_order_info(false);
      for (let i = 0; i < order_info.length; i++) {
        const item = order_info[i];
        const requset_item = item.requset_item;
        const request_quantity = item.request_quantity;
        const reward_currencyId=item.reward_currencyId;
        const reward_currencyamount=item.reward_currencyamount;
        var newOption = document.createElement('option');
        newOption.value=requset_item;
        newOption.text=requset_item;
        selectElement.appendChild(newOption);
    }


  })();
});



//提交委托
async function put_order_info() {
 let order_id = await check_order_info(true);
for (let i = 0; i < order_id.length; i++) {
  unsafeWindow._sendCommand('sellOrders',{"sellOrderIndex":order_id[i],"storeId":"str_bucksGalore"});
  await sleep(2000);
}
}

//提交委托事件
document.getElementById('put_order').addEventListener('click', () => {
 (async () => {
  put_order_info();
 })();
});

//查询物品售价信息
async function check_buy_price() {
    return new Promise((resolve, reject) => {
      var item_price = document.getElementById('item_price');
      var selectElement = document.getElementById('buy_item_id');
      var item_id = selectElement.value;
      var xhr = new XMLHttpRequest();
      var url = `https://pixels-server.pixels.xyz/v1/marketplace/item/${item_id}`;
      var pid = unsafeWindow._gameState.scene.playerId;
      var v = Date.now()+400;
      var params = `?pid=${pid}&v=${v}`;
      xhr.open('GET', url + params, true);
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  var price_info = JSON.parse(xhr.responseText).listings;
                  // 遍历订单数组，提取每个订单的price属性
                  const prices = price_info.map(order => order.price);
                  // 将price数组以逗号分隔拼接成一个字符串
                  const pricesString = prices.join(',');
                  item_price.value = pricesString;
                  resolve(price_info);
              } else {
                  reject('Failed to fetch price info');
              }
          }
      };
      xhr.send();
  });

 }



 //查询物品售价信息v2
async function check_buy_price_v2(item_id) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var url = `https://pixels-server.pixels.xyz/v1/marketplace/item/${item_id}`;
    var pid = unsafeWindow._gameState.scene.playerId;
    var v = Date.now();
    var params = `?pid=${pid}&v=${v}`;
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var price_info = JSON.parse(xhr.responseText).listings;
                // 遍历订单数组，提取每个订单的price属性
                const prices = price_info.map(order => order.price);
                // 将price数组以逗号分隔拼接成一个字符串
                if (prices.length>=2){
                resolve((prices[0]+prices[1])/2);
                }
              else{
                resolve(prices[0]);
              }
            } else {
                reject('Failed to fetch price info');
            }
        }
    };
    xhr.send();
});

}

//查询物品售价信息vc
async function check_buy_pricev3(item_id) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var url = `https://pixels-server.pixels.xyz/v1/marketplace/item/${item_id}`;
    var pid = unsafeWindow._gameState.scene.playerId;
    var v = Date.now();
    var params = `?pid=${pid}&v=${v}`;
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var price_info = JSON.parse(xhr.responseText).listings;
                // // 遍历订单数组，提取每个订单的price属性
                // const prices = price_info.map(order => order.price);
                // // 将price数组以逗号分隔拼接成一个字符串
                // const pricesString = prices.join(',');
                resolve(price_info);
            } else {
                reject('Failed to fetch price info');
            }
        }
    };
    xhr.send();
});

}

//购买物品v2版本，只买序列号第一个

async function buyOrderv2(item_quantity, item_hope_price) {
  while (true) {
      let price_quantity_info = await check_buy_price();
      if (!price_quantity_info || price_quantity_info.length === 0) {
          console.log("未获取到价格信息，稍后重试");
          await sleep(800);
          continue;
      }

      let count = item_quantity;
      let final_buy_id = "";
      let final_buy_quantity = 0;
      let final_buy_price = 1000000;
      item_hope_price = parseInt(item_hope_price, 10);

      if (isNaN(item_hope_price)) {
          console.log("价格设置错误，请重新设置");
          return 0;
      }

      for (const order of price_quantity_info) {
          const { _id, itemId, ownerId, price, fee, quantity, purchasedQuantity, state } = order;

          if (item_hope_price < price) {
              // 无合适价格休息一下
              await sleep(500);
              break;
          }

          if (final_buy_price >= price && quantity >= final_buy_quantity) {
              final_buy_price = price;
              final_buy_quantity = quantity;
              final_buy_id = _id;
          }
      }

      if (final_buy_quantity >= 1500) {
          final_buy_quantity = 750;
      } else if (final_buy_quantity >= 1000) {
          final_buy_quantity = 500;
      } else if (final_buy_quantity >= 500) {
          final_buy_quantity = 250;
      } else if (final_buy_quantity > 110) {
          final_buy_quantity = 110;
      }

      // 检查是否有有效的购买ID和数量
      if (final_buy_id && final_buy_quantity > 0) {
          // 进行购买
          unsafeWindow._sendCommand('marketplace', { "subcommand": "purchase", "listingId": final_buy_id, "quantity": final_buy_quantity });
          await sleep(500);
          return 0;
      } else {
          console.log("未找到合适的购买选项，稍后重试");
          await sleep(500);
      }
  }
}
  



 //购买物品
 async function buyOrder(price_quantity_info, item_quantity, item_hope_price) {
  let count = item_quantity;
  item_hope_price = parseInt(item_hope_price, 10);
  

  for (const order of price_quantity_info) {
      // 这里可以检查多个字段，并执行相应的操作
      const { _id, itemId, ownerId, price, fee, quantity, purchasedQuantity, state } = order;

      if (!isNaN(item_hope_price)) {
          if(quantity==1){ 
            continue;
          }
          if (quantity < count && price <= item_hope_price) {
              // count -= quantity;
              unsafeWindow._sendCommand('marketplace', { "subcommand": "purchase", "listingId": _id, "quantity": quantity });
              
          } else if (quantity >= count && price <= item_hope_price) {
              unsafeWindow._sendCommand('marketplace', { "subcommand": "purchase", "listingId": _id, "quantity": count });
              count = 0;
          }
      } else {
          if (quantity < count) {
              count -= quantity;
              unsafeWindow._sendCommand('marketplace', { "subcommand": "purchase", "listingId": _id, "quantity": quantity });
          } else if (quantity >= count) {
              unsafeWindow._sendCommand('marketplace', { "subcommand": "purchase", "listingId": _id, "quantity": count });
              count = 0;
          }
      }

      if (count === 0) {
          break;
      }
  }

  return count === 0 ? 0 : 1;
}
let isBuying = false;
//第三季独特接口
async function buyOrderv3(item_id,item_quantity, item_hope_price) {
  let count = item_quantity;
  item_hope_price = parseInt(item_hope_price, 10);
  if(count>99)
  {
    count=99
  }
  if (isNaN(item_hope_price)) {
    console.log("价格设置错误")
    return 0;

  }
  
  while(isBuying==true)
    {
     unsafeWindow._sendCommand('marketplace', { "subcommand": "findandpurchase", itemId:item_id, quantity: count,price:item_hope_price,currency:"cur_coins" });
     await sleep(4000);
      if(unsafeWindow.buystate) 
        {
          if(unsafeWindow.buystate.isobsolete==0)
            {
              if(unsafeWindow.buystate.info=="purchase-success")
                {
                  console.log("检测到购买成功");
                  await sleep(10000);
                  unsafeWindow.buystate.isobsolete=1;
                  console.log(unsafeWindow.buystate);
                  return 1 ;
                }
               else if(unsafeWindow.buystate.info=="cannot-afford")
                {
                  console.log("检测到钱不够");
                  await sleep(2000);
                  unsafeWindow.buystate.isobsolete=1;
                  console.log(unsafeWindow.buystate);
                  continue;
                }
                else if(unsafeWindow.buystate.info=="marketplace-cooldown")
                {
                  console.log("检测到市场冷却");
                  await sleep(5000);
                  unsafeWindow.buystate.isobsolete=1;
                  console.log(unsafeWindow.buystate);
                  continue;
                }
                unsafeWindow.buystate.isobsolete=1;
                console.log("未知消息");
                console.log(unsafeWindow.buystate);                
            }
            //不是最新消息
            await sleep(1000);
        }
        
        await sleep(5000);
    }
    await sleep(3000);
    return 0;
}



//领取蜂蜜
async function get_bee() {
  const entity = unsafeWindow._gameState.scene.entities;
  const result=[];
  for (const [index, value] of entity.entries()) {
      if (value.propCache && value.propCache.key === 'ent_apiary') {
      result.push({id: index , state: value.currentState.state,center_x:value.body.center.x,center_y : value.body.center.y})
      }
  }
  for (const bee of result) {
    if(bee.state=='ready')
      {
        unsafeWindow._shunyi(bee.center_x,bee.center_y+15);
        await sleep(2000);
        unsafeWindow._sendCommand('clickEntity',{"mid":bee.id,"impact":"click","entity":"ent_apiary","inputs":[bee.center_x,bee.center_y]});
        await sleep(2000);
      }
  }

}

document.getElementById('get_bee').addEventListener('click', () => {
  (async () => {
    await get_bee();

  })();
});


//采矿get_mineral
async function get_mineral() {
  const entity = unsafeWindow._gameState.scene.entities;
  const result=[];
  for (const [index, value] of entity.entries()) {
      if (value.propCache && value.propCache.key === 'ent_mine') {
      result.push({id: index , state: value.currentState.state,center_x:value.body.center.x,center_y : value.body.center.y})
      }
  }
  for (const bee of result) {
    if(bee.state=='ready')
      {

        unsafeWindow._shunyi(bee.center_x,bee.center_y+15);
        await sleep(2000);
        unsafeWindow._sendCommand('clickEntity',{"mid":bee.id,"impact":"click","entity":"ent_mine","inputs":[bee.center_x,bee.center_y]});
        await sleep(2000);
        unsafeWindow._sendCommand('clickEntity',{"mid":bee.id,"impact":"click","entity":"ent_mine","inputs":[bee.center_x,bee.center_y]});
        await sleep(2000);
      }
  }

}

let mine_start=false;
document.getElementById('get_mineral').addEventListener('click', () => {
  (async () => {
    await get_mineral();

  })();
});



//游乐场领取种子

document.getElementById('get_seed_on_carnival').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Carnival')
      {
        current_map=unsafeWindow._gameState.room.state._name;
        if(current_map!='Terravilla')
          {
          unsafeWindow._joinMap("terravilla");
          await waitForElement('span.commons_coinBalance__d9sah');
          }
     unsafeWindow._shunyi(3179.0350675393934,3021.417103102317);
     await Pathfinding2(3179.0350675393934,2294.3079605180706-60,200);     
     unsafeWindow._shunyi(3052.191197709601,2294.3079605180706);
     await Pathfinding2(3052.191197709601,1992.6412938514256-90,200);
     await sleep(2000)
     await waitForElement('span.commons_coinBalance__d9sah');
        }

      
  const entity_info = unsafeWindow._gameState.scene.entities;
  const result = [];
  entity_info.forEach((value, index) => {
    console.log(entity_info);
      if (value.gameEntity && value.gameEntity.id === 'ent_pickupdailyornagegrump') {
          if (value.currentState.utcRefresh) {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: value.currentState.utcRefresh,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          } else {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: -1,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          }
      } else if (value.gameEntity && value.gameEntity.id === 'ent_pickupdailycottoncandy') {
          if (value.currentState.utcRefresh) {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: value.currentState.utcRefresh,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          } else {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: -1,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          }
      }
  });
  console.log(result);
  let grump_state=0
  for (const seed of result) {
    if (seed.time==-1)
      {

        if(seed.item_id=="ent_pickupdailyornagegrump")
          {
            await Pathfinding2(2979.9720420448666,2890.23779430151,200);
            await Pathfinding2(2581.6387087115695,2890.23779430151,200);
            _shunyi(2563.9999999999877,2875);
            await Pathfinding2(2429,2871.4412829116586,200);
            _shunyi(seed.center_x-20, seed.center_y+40 );
            grump_state=1
          }
          else if(seed.item_id=="ent_pickupdailycottoncandy")
            {
              if(grump_state=1)
              {
                _shunyi(2429,2871.4881553646896);
                await Pathfinding2(3710.66666666655,2871.4881553646896,200);
                _shunyi(seed.center_x-20, seed.center_y+40);
              }
              else{
                await Pathfinding2(2979.9720420448666,2890.23779430151,200);
                await Pathfinding2(3405.007516127721,2890.23779430151,200);
                _shunyi(3423.3408494610526,2871.4881553646896);
                await Pathfinding2(3710.66666666655,2871.4881553646896,200);
                _shunyi(seed.center_x-20, seed.center_y+40);
              }
      
            

            }
        await sleep(2000);
        _sendCommand('clickEntity', {"mid": seed.id, "impact": "click", "entity":seed.item_id, "inputs": [seed.center_x, seed.center_y]});
        await sleep(2000);
      }

  }

  })();
});


//商店领取种子PostOfficeInterior

document.getElementById('get_seed_on_PostOfficeInterior').addEventListener('click', () => {
  (async () => {
    var current_map=unsafeWindow._gameState.room.state._name;
    if(current_map!='Post Office Interior House')
      {
        current_map=unsafeWindow._gameState.room.state._name;
        if(current_map!='Terravilla')
          {
          unsafeWindow._joinMap("terravilla");
          await waitForElement('span.commons_coinBalance__d9sah');
          }
          unsafeWindow._shunyi(2993.1328419750316,3121.3235572106346);
          await Pathfinding2(2993.1328419750316,3870.7346272470068+60,1000);
          unsafeWindow._shunyi(2993.1328419750316,3870.7346272470068);
          await Pathfinding(3290.3273660603845+50,3870.7346272470068);
          unsafeWindow._shunyi(3290.3273660603845,3870.7346272470068);
          await Pathfinding(3290.3273660603845,3784.333333333331-60);
          await sleep(2000);
          await waitForElement('span.commons_coinBalance__d9sah');
          await Pathfinding(2974,2961.3333333333485-20);
      }
  const entity_info = unsafeWindow._gameState.scene.entities;
  const result = [];
  entity_info.forEach((value, index) => {
    console.log(entity_info);
      if (value.gameEntity && value.gameEntity.id === 'ent_package_pickup') {
          if (value.currentState.utcRefresh) {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: value.currentState.utcRefresh,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          } else {
              result.push({
                  id: value.propCache.id,
                  state: value.currentState.state,
                  item_id: value.gameEntity.id,
                  time: -1,
                  center_x: value.body.center.x,
                  center_y: value.body.center.y
              });
          }
      } 
  });
  console.log(result);
  for (const seed of result) {
    if (seed.time==-1)
      {
        unsafeWindow._shunyi(seed.center_x-20, seed.center_y );
        simulateKeyPress('w',1000);
        await sleep(2000);
        _sendCommand('clickEntity', {"mid": seed.id, "impact": "click", "entity":seed.item_id, "inputs": [seed.center_x, seed.center_y]});
        await sleep(2000);
      }

  }

  })();
});

//查看物品单价事件
document.getElementById('check_buy_price').addEventListener('click', () => {
  (async () => {
    check_buy_price();
  })();
 });




//抢购物品
async function start_buy(item_id,item_quantity,item_hope_price,max_buy) {
  let self_items= await get_inventory_state_info();
  let now_self= self_items.find(item => item.name === item_id);
  let now_self_quantity = now_self ? now_self.quantity : 0;
  let i = 1
   while (i<=max_buy) {
    try {
        // Step 1: Check order price
        let price_quantity_info =await check_buy_pricev3(item_id);


        //检查自身物品
      
        console.log(now_self)
        // Step 2: Buy order
        if(item_quantity!=0)
          {
        const purchaseResult = await buyOrderv2(item_quantity,item_hope_price);
          }
          await sleep(3000);


        // Step 3: Check purchase status
        //检查自身物品
        let buy_after_items= await get_inventory_state_info();
        let buy_after= buy_after_items.find(item => item.name === item_id);
        let buy_after_quantity = buy_after ? buy_after.quantity : 0;


        if (now_self_quantity+item_quantity ==buy_after_quantity) {
            document.getElementById('order_status').value = 'Purchase successful!';
            isBuying=false;
            break;
        } else {
            item_quantity=item_quantity-buy_after_quantity+now_self_quantity;
            document.getElementById('order_status').value = 'Purchase failed, retrying...';
            await sleep(1500)
        }
      now_self_quantity=buy_after_quantity;

    } catch (error) {
        console.error('Error in order process:', error);
        document.getElementById('order_status').value = 'Error occurred, retrying...';
        await sleep(1500);
    }
}

}
//打开买界面
async function open_buy_ui() {
  return new Promise((resolve, reject) => {
    var selectElement = document.getElementById('buy_item_id');
    var xhr = new XMLHttpRequest();
    var url = `https://pixels-server.pixels.xyz/cache/marketplace/listings/count`;

    var v = Date.now();
    var params = `?v=${v}`;
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            
                resolve(200);
            } else {
                reject('Failed to fetch price info');
            }
        }
    };
    xhr.send();
});

}

//打开卖出界面
async function open_sell_ui() {
  return new Promise((resolve, reject) => {
    var pid = unsafeWindow._gameState.scene.playerId;
    var xhr = new XMLHttpRequest();
    var url = `https://pixels-server.pixels.xyz/v1/marketplace/player/${pid}`;
    var v = Date.now();
    var params = `?v=${v}`;
    xhr.open('GET', url + params, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            
                resolve(200);
            } else {
                reject('Failed to fetch price info');
            }
        }
    };
    xhr.send();
});

}


//领取邮箱物品
async function get_mail() {
  _sendCommand("fetchMailbox",undefined);
  await sleep(5000);
  if(fetchMailbox.mail.length>0)
    {
      var mail_id = fetchMailbox.mail[0]._id;
      _sendCommand("collectMailboxItem",{"mailId":mail_id,"similar":true});
      await sleep(2000);
    }
 
}



 //开始抢购
document.getElementById('start_buy').addEventListener('click', () => {
  isBuying = true;

  (async () => {
    var selectElement = document.getElementById('buy_item_id');
    var item_id = selectElement.value;
    var selectElement = document.getElementById('buy_quantity');
    var sell_selectElement = document.getElementById('sell_quantity');
    var item_quantity = selectElement.value;
    item_quantity = parseInt(item_quantity, 10);
    var sell_item_quantity = sell_selectElement.value;
    sell_item_quantity = parseInt(sell_item_quantity, 10);
    if (isNaN(item_quantity)) {
      item_quantity = 1;
    }

    var selectElement = document.getElementById('buy_hope_price');
    var item_hope_price = selectElement.value;
    var sell_selectElement_price = document.getElementById('sell_hope_price');
    var sell_hope_price = sell_selectElement_price.value;
    sell_hope_price = parseInt(sell_hope_price, 10);
    let now_self_quantity = await get_inventory_state_info_item(item_id);
     await open_buy_ui();
     while (isBuying) {

      try {
          // Step 1: Check order price
         

          //检查自身物品
        
          // Step 2: Buy order
          if(item_quantity!=0)
            {
          const purchaseResult = await buyOrderv2(item_quantity,item_hope_price);
            }
          await sleep(3000);
          // Step 3: Check purchase status
          //检查自身物品
          let buy_after_quantity = await get_inventory_state_info_item(item_id);
          console.log("now_self_quantity:"+now_self_quantity);
          console.log("buy_after_quantity:"+buy_after_quantity);
          console.log("item_quantity:"+item_quantity);
          if(!isNaN(item_quantity)&&!isNaN(sell_hope_price))
            {
              if(buy_after_quantity>=sell_item_quantity)
                {
                  await sleep(8000);
                  //进行自动卖出{"subcommand":"create","itemId":"itm_popberryFruit","quantity":78,"price":10,"currency":"cur_coins"}
                  await open_sell_ui();
                  unsafeWindow._sendCommand('marketplace', { "subcommand": "create", "itemId": item_id, "quantity": buy_after_quantity,"price":sell_hope_price, "currency":"cur_coins"});
                  await sleep(500);
                  await open_sell_ui();
                  await sleep(500);
                  //await get_mail();
                 await open_buy_ui();
                 await sleep(5000);
                  continue;
                }
            }
          
          if (now_self_quantity+item_quantity ==buy_after_quantity) {
              document.getElementById('order_status').value = 'Purchase successful!';
              await sleep(1000);
              // isBuying=false;
              // break;
          } else {
              item_quantity=item_quantity-buy_after_quantity+now_self_quantity;
              document.getElementById('order_status').value = 'Purchase failed, retrying...';
              await sleep(1000)
          }
        now_self_quantity=buy_after_quantity;

      } catch (error) {
          console.error('Error in order process:', error);
          document.getElementById('order_status').value = 'Error occurred, retrying...';
          await sleep(1000);
      }
  }
  
})();
});



 //开始抢购v2版本
 document.getElementById('start_buyv2').addEventListener('click', () => {
  isBuying = true;

  (async () => {
    var selectElement = document.getElementById('buy_item_id');
    var item_id = selectElement.value;
    var selectElement = document.getElementById('buy_quantity');
    var item_quantity = selectElement.value;
    item_quantity = parseInt(item_quantity, 10);
    if (isNaN(item_quantity)) {
      item_quantity = 1;
    }
    console.log(item_quantity);
    var selectElement = document.getElementById('buy_hope_price');
    var item_hope_price = selectElement.value;

    // let self_items= await get_inventory_state_info();
    // let now_self= self_items.find(item => item.name === item_id);
    let now_self_quantity = await get_inventory_state_info_item(item_id);
     while (isBuying) {
      try {
          // Step 1: Check order price
    


          //检查自身物品
        

          // Step 2: Buy order
          if(item_quantity!=0)
            {
            const purchaseResult = await buyOrderv3(item_id,item_quantity,item_hope_price);
            }
            if(isBuying==false)
              {
                break;
              }
          await sleep(3000);
          // Step 3: Check purchase status
          //检查自身物品
         
          let buy_after_quantity = await get_inventory_state_info_item(item_id);
          console.log("now_self_quantity:"+now_self_quantity);
          console.log("buy_after_quantity:"+buy_after_quantity);
          console.log("item_quantity:"+item_quantity);

          if (now_self_quantity+item_quantity ==buy_after_quantity) {
              document.getElementById('order_status').value = 'Purchase successful!';
              isBuying=false;
              break;
          } else {
              item_quantity=item_quantity-buy_after_quantity+now_self_quantity;
              document.getElementById('order_status').value = 'Purchase failed, retrying...';
              await sleep(1500)
          }
        now_self_quantity=buy_after_quantity;

      } catch (error) {
          console.error('Error in order process:', error);
          document.getElementById('order_status').value = 'Error occurred, retrying...';
          await sleep(1500);
      }
  }
  
})();
});

  //停止抢购
document.getElementById('stop_buy').addEventListener('click', () => {
  (async () => {
     isBuying = false;
     document.getElementById('order_status').value = 'Purchase stop!!!';
  })();
 });




//查询某个物品具体数量
async function get_inventory_state_info_item(item_id) {
  const result = [];
  const entities = unsafeWindow._gameState.selfPlayer.inventory.slots.$items;

  entities.forEach((value, key) => {
      result.push({ name: value.item, quantity: value.quantity });
  });

  // 使用 reduce 方法来累加数量
  let totalQuantity = result.reduce((total, item) => {
      if (item.name === item_id) {
          return total + item.quantity;
      } else {
          return total;
      }
  }, 0);

  return totalQuantity;
}



//查询某个物品具体位置
async function get_inventory_slot_info_item(item_id)
{
  const result = [];
  const entities =unsafeWindow._gameState.selfPlayer.inventory.slots.$items;
             entities.forEach((value, key) => {

                 result.push({ name: value.item, quantity: value.quantity,slot:value.slot});

             });
  let item= result.find(item => item.name.includes(item_id));
  let slot  = item ? item.slot : -1;

  console.log("slot:"+slot);
  return slot;

}


let isputorder=false;

 //开始自动提交
document.getElementById('start_order').addEventListener('click', () => {
  isputorder = true;
  let max_loss_coin= parseInt(document.getElementById('max_loss_coin_order').value,10);
  let max_loss_pixel= parseInt(document.getElementById('max_loss_pixel_order').value,10);
  if (isNaN(max_loss_coin)) {
    max_loss_coin = 2000;
  }
  if (isNaN(max_loss_coin)) {
    max_loss_pixel = 4000;
  }
  (async () => {
    let price = 0;
    while(isputorder)
    {
      let hope_completed_sum=0
      let is_completed=0
      var order_info =  await check_order_info_v2(false);
      for (let order of order_info )
        {
          let isok=false;
          if (order.iscompleted==0)
          {
            price = await check_buy_price_v2(order.request_itemId);
            console.log("order.sellOrderIndex:"+order.sellOrderIndex);
            console.log("price:"+price);
            console.log("order.request_quantity:"+order.request_quantity);
            let cost =price * order.request_quantity;
            console.log("cost:"+cost);
            if(order.reward_currencyId=="cur_coins")
              {
                if((cost-order.reward_currencyamount)<=max_loss_coin)
                  {
                    isok=true;
                    hope_completed_sum+=1;
                  }
              }
            else
            {
              cost = cost/order.reward_currencyamount
              if(cost<=max_loss_pixel)
                {
                  isok=true;
                  hope_completed_sum+=1;
                }
            }
          }
          else{
            is_completed+=1;
          }
          console.log(isok);


          
          if(isok==true)
            {

              let self_inventory_item=await get_inventory_state_info_item(order.request_itemId);
              let request_quantity = order.request_quantity-self_inventory_item;
              if(request_quantity>0)
                {
                  //进行抢购
                  await start_buy(order.request_itemId,request_quantity,price,10);
                  

                }
                unsafeWindow._sendCommand('sellOrders',{"sellOrderIndex":order.sellOrderIndex,"storeId":"str_bucksGalore"});
                await sleep(2000);
            }
        }
        let reality_completed=0;
        order_info =  await check_order_info_v2(false);
        for (let order of order_info )
          {
            if (order.iscompleted==1)
              {
                reality_completed+=1
              }
          }
          console.log(is_completed);
          console.log(hope_completed_sum);
          console.log(reality_completed);
        if (reality_completed==(is_completed+hope_completed_sum))
          {
            
            console.log("提交委托完成!!!");
            break;
          }
          await sleep(5000);
    }


})();
});

  //停止自动提交
document.getElementById('stop_order').addEventListener('click', () => {
  (async () => {
    isputorder = false;
     document.getElementById('order_status').value = 'Purchase stop!!!';
  })();
 });